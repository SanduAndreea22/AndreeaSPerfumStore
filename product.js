const URL = 'https://68e5512421dd31f22cc16352.mockapi.io/products';
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const productImg = document.getElementById('product-img');
const productName = document.getElementById('product-name');
const productPrice = document.getElementById('product-price');
const productDescription = document.getElementById('product-description');
const addToCartBtn = document.getElementById('add-to-cart');

async function fetchProduct() {
    try {
        const res = await fetch(`${URL}/${id}`);
        if (!res.ok) throw new Error('Produsul nu a fost găsit');
        const product = await res.json();

        productImg.src = product.imageURL;
        productName.innerText = product.name;
        productPrice.innerText = `${product.price} LEI`;
        productDescription.innerText = product.description || "Fără descriere";

    } catch (err) {
        alert(err.message);
    }
}

addToCartBtn.addEventListener('click', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({
        name: productName.innerText,
        price: productPrice.innerText,
        img: productImg.src
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    document.querySelector('.cart-badge').innerText = cart.length;
    alert('Produs adăugat în coș!');
});

fetchProduct();
