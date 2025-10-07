window.addEventListener('DOMContentLoaded', displayProducts);

const URL = 'https://68e5512421dd31f22cc16352.mockapi.io/products';

function displayProducts() {
	fetch(URL)
		.then((response) => {
			if (response.ok === false) {
				throw new Error('Networn error!');
			} else {
				return response.json();
			}
		})
		.then(
			(products) =>
				(document.querySelector('.products-container').innerHTML = products
					.map(
						(product) => `
         <div class="product-card">
				<img
					src=${product.imageURL}
					alt="Product image"
				/>
				<div class="product-info">
					<h3>${product.name}</h3>
					<div class="price">${product.price} LEI</div>
					<div class="buttons">
						<button class="details-btn">Details</button>
						<button class="cart-btn">Add to Cart</button>
					</div>
				</div>
			</div>   
      `
					)
					.join(''))
		);
}