const URL = 'https://68e5512421dd31f22cc16352.mockapi.io/products';
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const productImg = document.getElementById('product-img');
const productName = document.getElementById('product-name');
const productPrice = document.getElementById('product-price');
const productDescription = document.getElementById('product-description');
const productStock = document.getElementById('product-stock');
const addToCartBtn = document.getElementById('add-to-cart');

let productStockCount = 0; // Stocul real al produsului

async function fetchProduct() {
  try {
    const res = await fetch(`${URL}/${id}`);
    if (!res.ok) throw new Error('Produsul nu a fost găsit');
    const product = await res.json();

    productImg.src = product.imageURL;
    productName.innerText = product.name;
    productPrice.innerText = `${product.price} LEI`;
    productDescription.innerText = product.description || "Fără descriere";

    productStock.innerText = `În stoc: ${product.stock}`;
    productStockCount = product.stock;

  } catch (err) {
    alert(err.message);
  }
}

function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  document.querySelector('.cart-badge').innerText = totalItems;
}

function showAlert(message) {
  const alertBox = document.getElementById('alert-message');
  alertBox.innerText = message;
  alertBox.style.display = 'block';
  setTimeout(() => {
    alertBox.style.display = 'none';
  }, 3000);
}

addToCartBtn.addEventListener('click', () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    // Verifică dacă nu depășește stocul
    if ((existingItem.quantity || 1) < productStockCount) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
      showAlert('Cantitatea produsului a fost crescută în coș!');
    } else {
      showAlert('Nu mai există stoc suficient!');
      return;
    }
  } else {
    if (productStockCount > 0) {
      cart.push({
        id,
        name: productName.innerText,
        price: parseFloat(productPrice.innerText),
        img: productImg.src,
        quantity: 1
      });
      showAlert('Produsul a fost adăugat în coș!');
    } else {
      showAlert('Produsul nu este în stoc!');
      return;
    }
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
});

fetchProduct();
updateCartBadge();


