const cartItemsContainer = document.getElementById('cart-items');
const totalPriceEl = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const cartBadge = document.querySelector('.cart-badge');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Functie pentru render cart
function renderCart() {
  cartItemsContainer.innerHTML = '';

  if(cart.length === 0){
    cartItemsContainer.innerHTML = '<p>Coșul tău este gol.</p>';
    totalPriceEl.innerText = '0 LEI';
    cartBadge.innerText = 0;
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const card = document.createElement('div');
    card.classList.add('cart-card');
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>${item.price} LEI</p>
      <button class="remove-btn" data-index="${index}">Remove</button>
    `;
    cartItemsContainer.appendChild(card);

    total += parseFloat(item.price);
  });

  totalPriceEl.innerText = `${total.toFixed(2)} LEI`;
  cartBadge.innerText = cart.length;
}

// Remove item
cartItemsContainer.addEventListener('click', (e) => {
  if(e.target.classList.contains('remove-btn')){
    const index = e.target.dataset.index;
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  }
});

// Checkout
checkoutBtn.addEventListener('click', () => {
  if(cart.length === 0){
    alert("Coșul tău este gol!");
    return;
  }
  alert("Mulțumim pentru comandă!");
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
});

// Initial render
renderCart();
