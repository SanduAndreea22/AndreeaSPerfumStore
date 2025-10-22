const cartItemsContainer = document.getElementById('cart-items');
const totalPriceEl = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const cartBadge = document.querySelector('.cart-badge');

const URL = 'https://68e5512421dd31f22cc16352.mockapi.io/products';

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// === Render cart ===
async function renderCart() {
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Coșul tău este gol.</p>';
    totalPriceEl.innerText = 'Total: 0 LEI';
    cartBadge.innerText = 0;
    return;
  }

  let total = 0;

  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    const quantity = item.quantity || 1;

    // Verificare stoc real de la API
    let stock = item.stock || 0;
    try {
      const res = await fetch(`${URL}/${item.id}`);
      if (res.ok) {
        const product = await res.json();
        stock = product.stock || 0;
      }
    } catch (err) {
      console.error('Eroare la verificarea stocului:', err);
    }

    const subtotal = item.price * quantity;
    total += subtotal;

    const card = document.createElement('div');
    card.classList.add('cart-card');
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h3><a href="product.html?id=${item.id}">${item.name}</a></h3>
      <p>Preț: ${item.price.toFixed(2)} LEI</p>
      <div class="quantity-controls">
        <button class="decrease" data-index="${i}">-</button>
        <span>${quantity}</span>
        <button class="increase" data-index="${i}">+</button>
      </div>
      <p>Subtotal: ${subtotal.toFixed(2)} LEI</p>
      <p>Stoc disponibil: ${stock}</p>
      <button class="remove-btn" data-index="${i}">Remove</button>
    `;
    cartItemsContainer.appendChild(card);
  }

  totalPriceEl.innerText = `${total.toFixed(2)} LEI`;
  cartBadge.innerText = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
}

// === Events remove / increase / decrease ===
cartItemsContainer.addEventListener('click', async (e) => {
  const index = e.target.dataset.index;
  if (!index) return;

  const item = cart[index];
  const quantity = item.quantity || 1;

  if (e.target.classList.contains('remove-btn')) {
    cart.splice(index, 1);
  }

  if (e.target.classList.contains('increase')) {
    try {
      const res = await fetch(`${URL}/${item.id}`);
      if (res.ok) {
        const product = await res.json();
        const stock = product.stock || 0;
        if (quantity < stock) {
          cart[index].quantity = quantity + 1;
        } else {
          alert('Nu mai există stoc suficient!');
        }
      }
    } catch (err) {
      console.error('Eroare la verificarea stocului:', err);
    }
  }

  if (e.target.classList.contains('decrease')) {
    if (quantity > 1) cart[index].quantity -= 1;
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
});

// === Checkout button ===
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert("Coșul tău este gol!");
    return;
  }
  window.location.href = 'checkout.html';
});

// === Initial render ===
renderCart();


