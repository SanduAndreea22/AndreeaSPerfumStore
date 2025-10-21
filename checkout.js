// === Elemente ===
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const checkoutForm = document.getElementById('checkout-form');
const paymentSelect = document.getElementById('payment-method');
const cardForm = document.getElementById('card-form');

// === Afișează produsele din coș ===
function displayCartSummary() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Coșul tău este gol.</p>";
    cartTotalEl.textContent = "Total: 0 LEI";
    return;
  }

  let total = 0;
  cart.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('cart-item');
    const quantity = item.quantity || 1;
    itemDiv.innerHTML = `
      <span>${item.name} (x${quantity})</span>
      <span>${(item.price * quantity).toFixed(2)} LEI</span>
    `;
    total += item.price * quantity;
    cartItemsContainer.appendChild(itemDiv);
  });

  cartTotalEl.textContent = `Total: ${total.toFixed(2)} LEI`;
}

// === Afișare/ascundere formular card ===
paymentSelect.addEventListener('change', () => {
  if (paymentSelect.value === 'card') {
    cardForm.style.display = 'block';
  } else {
    cardForm.style.display = 'none';
  }
});

// === Popup vizual de confirmare ===
function showPopup(message) {
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

  // După 2 secunde, închidem popup-ul și mergem la confirmare
  setTimeout(() => {
    popup.classList.remove('show');
    setTimeout(() => {
      popup.remove();
      window.location.href = 'order-confirmation.html';
    }, 400);
  }, 2000);
}

// === Gestionarea formularului ===
checkoutForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('fullname').value.trim();
  const address = document.getElementById('address').value.trim();
  const email = document.getElementById('email').value.trim();
  const payment = paymentSelect.value;

  if (name.length < 3 || address.length < 5) {
    alert("Te rugăm să introduci un nume și o adresă valide.");
    return;
  }

  if (!email.includes('@') || !email.includes('.')) {
    alert("Adresa de email nu este validă.");
    return;
  }

  // Validare detalii card dacă metoda este Card
  if (payment === 'card') {
    const cardNumber = document.getElementById('card-number').value.trim();
    const expiry = document.getElementById('expiry').value.trim();
    const cvv = document.getElementById('cvv').value.trim();

    if (cardNumber.length !== 16 || isNaN(cardNumber)) {
      alert("Număr card invalid!");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      alert("Data expirare trebuie în format MM/AA!");
      return;
    }
    if (cvv.length !== 3 || isNaN(cvv)) {
      alert("CVV invalid!");
      return;
    }
  }

  // Salvare comanda
  const order = {
    name,
    address,
    email,
    payment,
    cart: JSON.parse(localStorage.getItem('cart')) || []
  };

  localStorage.setItem('order', JSON.stringify(order));
  localStorage.removeItem('cart');

  // Afișare popup
  const paymentMessage = payment === 'card' ? "Plata cu cardul a fost efectuată!" : "Comanda va fi plătită ramburs!";
  showPopup(paymentMessage);
});

// === Initial render ===
displayCartSummary();


