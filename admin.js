const URL = 'https://68e5512421dd31f22cc16352.mockapi.io/products';
const addForm = document.getElementById('add-form');
const productsTableBody = document.querySelector('#products-table tbody');
let editingId = null; // null = add, altceva = edit

// 1️⃣ Afisare produse cu error handling
async function fetchProducts() {
    try {
        const res = await fetch(URL);
        if (!res.ok) throw new Error('Nu s-au putut încărca produsele');
        const products = await res.json();
        renderProducts(products);
    } catch (err) {
        alert(err.message);
    }
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
            <td>${parseFloat(product.price).toFixed(2)} RON</td>
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
}

// 3️⃣ Delegare event listener pentru edit/delete
productsTableBody.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-btn');
    const deleteBtn = e.target.closest('.delete-btn');

    if (editBtn) editProduct(editBtn.dataset.id);
    if (deleteBtn) deleteProduct(deleteBtn.dataset.id);
});

// 4️⃣ Adaugare / salvare modificari produs
addForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const imageURL = document.getElementById('imageURL').value.trim();
    const description = document.getElementById('description').value.trim();

    // Validare simpla
    if (!name || !imageURL || isNaN(price)) {
        alert('Completează corect numele, prețul și imaginea produsului!');
        return;
    }

    const productData = { name, price: price.toFixed(2), imageURL, description };

    try {
        if (editingId) {
            // UPDATE
            const res = await fetch(`${URL}/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            if (!res.ok) throw new Error('Nu s-au putut salva modificările');
            editingId = null;
            document.getElementById('add-btn').textContent = 'Adaugă produs';
            alert('Produs modificat cu succes!');
        } else {
            // ADD
            const res = await fetch(URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            if (!res.ok) throw new Error('Nu s-a putut adăuga produsul');
            alert('Produs adăugat cu succes!');
        }
    } catch (err) {
        alert(err.message);
    }

    addForm.reset();
    fetchProducts();
});

// 5️⃣ Stergere produs
async function deleteProduct(id) {
    if (confirm('Sigur vrei să ștergi acest produs?')) {
        try {
            const res = await fetch(`${URL}/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Nu s-a putut șterge produsul');
            alert('Produs șters cu succes!');
            fetchProducts();
        } catch (err) {
            alert(err.message);
        }
    }
}

// 6️⃣ Editare produs
async function editProduct(id) {
    try {
        const res = await fetch(`${URL}/${id}`);
        if (!res.ok) throw new Error('Produsul nu a fost găsit');
        const product = await res.json();

        document.getElementById('name').value = product.name;
        document.getElementById('price').value = product.price;
        document.getElementById('imageURL').value = product.imageURL;
        document.getElementById('description').value = product.description;

        editingId = id;
        document.getElementById('add-btn').textContent = 'Salvează modificări';
    } catch (err) {
        alert(err.message);
    }
}

// Incarcare initiala produse
fetchProducts();











