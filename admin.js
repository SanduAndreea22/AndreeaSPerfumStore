const URL = 'https://68e5512421dd31f22cc16352.mockapi.io/products';
const addForm = document.getElementById('add-form');
const productsTableBody = document.querySelector('#products-table tbody');
let editingId = null; // null = add, altceva = edit

// 1️⃣ Afisare produse
async function fetchProducts() {
    const res = await fetch(URL);
    const products = await res.json();
    renderProducts(products);
}

// 2️⃣ Render tabel
function renderProducts(products) {
    productsTableBody.innerHTML = '';
    products.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img src="${product.imageURL}" class="product-img"></td>
            <td>${product.name}</td>
            <td>${product.price} RON</td>
            <td>
                <button class="edit-btn" data-id="${product.id}">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="delete-btn" data-id="${product.id}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        productsTableBody.appendChild(row);
    });

    // Event listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editProduct(btn.dataset.id));
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteProduct(btn.dataset.id));
    });
}

// 3️⃣ Adaugare / salvare modificari produs
addForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const productData = {
        name: document.getElementById('name').value.trim(),
        price: parseFloat(document.getElementById('price').value),
        imageURL: document.getElementById('imageURL').value.trim(),
        description: document.getElementById('description').value.trim()
    };

    if (editingId) {
        // UPDATE
        await fetch(`${URL}/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        editingId = null;
        document.getElementById('add-btn').textContent = 'Adaugă produs';
    } else {
        // ADD
        await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
    }

    addForm.reset();
    fetchProducts();
});

// 4️⃣ Stergere produs
async function deleteProduct(id) {
    if (confirm('Sigur vrei să ștergi acest produs?')) {
        await fetch(`${URL}/${id}`, { method: 'DELETE' });
        fetchProducts();
    }
}

// 5️⃣ Editare produs
async function editProduct(id) {
    const res = await fetch(`${URL}/${id}`);
    const product = await res.json();

    document.getElementById('name').value = product.name;
    document.getElementById('price').value = product.price;
    document.getElementById('imageURL').value = product.imageURL;
    document.getElementById('description').value = product.description;

    editingId = id;
    document.getElementById('add-btn').textContent = 'Salvează modificări';
}

// Incarcare initiala produse
fetchProducts();




