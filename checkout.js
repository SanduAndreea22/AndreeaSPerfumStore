const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const checkoutForm = document.getElementById('checkout-form');
const paymentSelect = document.getElementById('payment-method');
const cardForm = document.getElementById('card-form');

const URL = 'https://68e5512421dd31f22cc16352.mockapi.io/products';

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// === Afișare coș ===
function displayCartSummary() {
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Coșul tău este gol.</p>";
    cartTotalEl.textContent = "Total: 0 LEI";
    return;
  }

  let total = 0;
  cart.forEach(item => {
    const quantity = item.quantity || 1;
    total += item.price * quantity;

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('cart-item');
    itemDiv.innerHTML = `
      <a href="product.html?id=${item.id}">${item.name}</a> x${quantity} - ${(item.price * quantity).toFixed(2)} LEI
    `;
    cartItemsContainer.appendChild(itemDiv);
  });

  cartTotalEl.textContent = `Total: ${total.toFixed(2)} LEI`;
}

// === Afișare/ascundere formular card ===
paymentSelect.addEventListener('change', () => {
  cardForm.style.display = paymentSelect.value === 'card' ? 'block' : 'none';
});

// === Popup confirmare ===
function showPopup(message){
  const popup = document.createElement('div');
  popup.classList.add('popup-overlay');
  popup.innerHTML = `
    <div class="popup-content">
      <div class="checkmark">✔</div>
      <h2>Succes!</h2>
      <p>${message}</p>
    </div>
  `;
  document.body.appendChild(popup);
  setTimeout(() => popup.classList.add('show'), 100);

  setTimeout(() => {
    popup.classList.remove('show');
    setTimeout(() => {
      popup.remove();
      window.location.href = 'order-confirmation.html';
    }, 400);
  }, 2000);
}

// === Actualizare stoc produse ===
async function updateStock() {
  for (const item of cart) {
    try {
      const res = await fetch(`${URL}/${item.id}`);
      if (!res.ok) throw new Error("Produsul nu a fost găsit");
      const product = await res.json();

      const newStock = (product.stock || 0) - (item.quantity || 1);
      await fetch(`${URL}/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, stock: newStock })
      });
    } catch (err) {
      console.error("Eroare la actualizarea stocului:", err);
    }
  }
}

// === Trimitere formular ===
checkoutForm.addEventListener('submit', async e => {
  e.preventDefault();

  const name = document.getElementById('fullname').value.trim();
  const address = document.getElementById('address').value.trim();
  const email = document.getElementById('email').value.trim();
  const payment = paymentSelect.value;

  if(name.length < 3 || address.length < 5){
    alert("Te rugăm să introduci un nume și o adresă valide.");
    return;
  }

  if(!email.includes('@') || !email.includes('.')){
    alert("Email invalid.");
    return;
  }

  if(payment === 'card'){
    const cardNumber = document.getElementById('card-number').value.trim();
    const expiry = document.getElementById('expiry').value.trim();
    const cvv = document.getElementById('cvv').value.trim();

    if(cardNumber.length !== 16 || isNaN(cardNumber)){
      alert("Număr card invalid!");
      return;
    }
    if(!/^\d{2}\/\d{2}$/.test(expiry)){
      alert("Data expirare trebuie în format MM/AA!");
      return;
    }
    if(cvv.length !== 3 || isNaN(cvv)){
      alert("CVV invalid!");
      return;
    }
  }

  if(cart.length === 0){
    alert("Coșul tău este gol!");
    return;
  }

  // Salvare comanda
  const order = { name, address, email, payment, cart };
  localStorage.setItem('order', JSON.stringify(order));

  // Actualizare stoc
  await updateStock();

  // Golește coșul
  localStorage.removeItem('cart');

  const paymentMessage = payment === 'card' ? "Plata cu cardul a fost efectuată!" : "Comanda va fi plătită ramburs!";
  showPopup(paymentMessage);
});

// === Initial render ===
displayCartSummary();



