const URL = 'https://68e5512421dd31f22cc16352.mockapi.io/products';
const cartBadge = document.querySelector('.cart-badge');
const container = document.querySelector('.products-container');

window.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCartBadge();
});

function displayProducts() {
    fetch(URL)
        .then(res => res.json())
        .then(products => {
            container.innerHTML = products.map(product => `
                <div class="product-card">
                    <img src="${product.imageURL}" alt="${product.name}" />
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <div class="price">${parseFloat(product.price).toFixed(2)} LEI</div>
                        <div class="buttons">
                            <button class="details-btn" onclick="window.location.href='product.html?id=${product.id}'">Details</button>

                            <button class="cart-btn" 
                                data-id="${product.id}" 
                                data-name="${product.name}" 
                                data-price="${parseFloat(product.price).toFixed(2)}" 
                                data-img="${product.imageURL}">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');

            attachCartEvents();
        })
        .catch(err => console.error('Eroare la preluarea produselor:', err));
}

function attachCartEvents() {
    const cartButtons = document.querySelectorAll('.cart-btn');
    cartButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const product = {
                id: btn.dataset.id,
                name: btn.dataset.name,
                price: parseFloat(btn.dataset.price),
                img: btn.dataset.img
            };
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartBadge();
            alert(`${product.name} a fost adăugat în coș!`);
        });
    });
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartBadge.innerText = cart.length;
}

