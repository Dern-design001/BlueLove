// INITIAL DATA
const defaultProducts = [
    { id: 1, name: 'Ocean Blue Bracelet', category: 'Bracelets', price: 299, desc: 'Handcrafted with premium blue glass beads.', image: 'assets/bracelet1.png' },
    { id: 2, name: 'Crystal Mystery Box', category: 'Mystery Box', price: 999, desc: 'A curated selection of 5 random items.', image: 'assets/box1.png' },
    { id: 3, name: 'Heart Phonecase Hang', category: 'Phonecase Hang', price: 449, desc: 'Add some love to your mobile setup.', image: 'assets/hang1.png' },
    { id: 4, name: 'Aesthetic White Set', category: 'Bracelets', price: 349, desc: 'Elegant pearl-finish beads for every outfit.', image: 'assets/bracelet2.png' },
    { id: 5, name: 'Galaxy Phone Hang', category: 'Phonecase Hang', price: 499, desc: 'Deep space vibes for your phone.', image: 'assets/hang2.png' },
    { id: 6, name: 'Blue Dream Pack', category: 'Mystery Box', price: 1299, desc: 'Our best value box with 8 premium items.', image: 'assets/box2.png' }
];

// STATE MANAGEMENT
let products = JSON.parse(localStorage.getItem('bluelove_products')) || defaultProducts;
let cart = [];
let currentFilter = 'all';
let isAdmin = localStorage.getItem('bluelove_admin') === 'true';
const ADMIN_EMAIL = 'bluelove.bracelets.96@gmail.com';
const ADMIN_PASS = 'admin96'; // Set a default password

// Falling Hearts logic
function createHeart() {
    const container = document.getElementById('hearts-bg');
    if (!container) return;
    const heart = document.createElement('div');
    heart.className = 'heart';
    const size = Math.random() * 20 + 10;
    heart.style.width = size + 'px';
    heart.style.height = size + 'px';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 8 + 5 + 's';
    heart.style.opacity = Math.random() * 0.4 + 0.1;
    heart.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 13000);
}
setInterval(createHeart, 800);

function navigateTo(pageId) {
    document.querySelectorAll('.page-view').forEach(view => view.classList.remove('active'));
    document.getElementById(`page-${pageId}`).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-blue-600');
        if(btn.dataset.page === pageId) btn.classList.add('text-blue-600');
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function filterShop(category) {
    currentFilter = category;
    const grid = document.getElementById('product-grid');
    const custom = document.getElementById('custom-view');
    
    if (category === 'customize') {
        grid.classList.add('hidden');
        custom.classList.remove('hidden');
    } else {
        grid.classList.remove('hidden');
        custom.classList.add('hidden');
        renderProducts();
    }
    
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        const btnText = btn.innerText.toLowerCase();
        const matches = (category === 'all' && btnText === 'all') || 
                      (category === 'Bracelets' && btnText === 'bracelets') ||
                      (category === 'Mystery Box' && btnText === 'boxes') ||
                      (category === 'Phonecase Hang' && btnText === 'hangs') ||
                      (category === 'customize' && btnText === 'customize');
        
        if(matches) {
            btn.className = category === 'customize' 
                ? "filter-btn px-6 py-2 rounded-full blue-gradient text-white font-black text-sm transition-all shadow-md flex items-center gap-2"
                : "filter-btn px-6 py-2 rounded-full bg-blue-600 text-white font-bold text-sm transition-all shadow-md";
        } else {
            btn.className = btnText === 'customize'
                ? "filter-btn px-6 py-2 rounded-full bg-blue-50 text-blue-400 border border-blue-100 font-black text-sm transition-all shadow-sm flex items-center gap-2"
                : "filter-btn px-6 py-2 rounded-full hover:bg-white/50 glass text-gray-500 font-bold text-sm transition-all shadow-sm";
        }
    });
}

function renderProducts() {
    const grid = document.getElementById('product-grid');
    const filtered = products.filter(p => currentFilter === 'all' || p.category === currentFilter);
    
    grid.innerHTML = filtered.map(p => `
        <div class="product-card glass p-5 rounded-[2.5rem] flex flex-col h-full animate-up relative">
            ${isAdmin ? `
            <div class="absolute top-2 right-2 flex gap-2 z-10">
                <button onclick="editProduct(${p.id})" class="p-2 bg-emerald-500 text-white rounded-full shadow-md hover:bg-emerald-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                </button>
                <button onclick="deleteProduct(${p.id})" class="p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </div>
            ` : ''}
            <div class="w-full aspect-[4/5] rounded-[2rem] mb-6 relative overflow-hidden flex items-center justify-center shadow-inner group">
                 <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                 <span class="absolute top-5 left-5 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-600 shadow-sm">${p.category}</span>
            </div>
            <div class="px-2 pb-2 flex-grow flex flex-col text-left">
                <h3 class="text-2xl font-bold text-blue-900 mb-2 whitespace-pre-wrap">${p.name}</h3>
                <p class="text-gray-500 text-sm mb-6 leading-relaxed flex-grow whitespace-pre-wrap">${p.desc}</p>
                <div class="flex justify-between items-center mt-auto pt-6 border-t border-blue-50">
                    <span class="text-2xl font-black text-blue-800">₹${p.price}</span>
                    <button onclick="addToCart(${p.id})" class="blue-gradient text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition-all">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    sidebar.classList.toggle('translate-x-full');
    overlay.classList.toggle('hidden');
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const exists = cart.find(item => item.id === id);
    if (exists) exists.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    
    const badge = document.getElementById('cart-count');
    badge.classList.remove('pulse-badge');
    void badge.offsetWidth;
    badge.classList.add('pulse-badge');
    updateCartUI();
}

function updateCartUI() {
    const count = document.getElementById('cart-count');
    const itemsList = document.getElementById('cart-items');
    const totalDisplay = document.getElementById('cart-total');
    const checkoutTotalDisplay = document.getElementById('checkout-total-display');
    const checkoutBtn = document.getElementById('checkout-btn');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    count.innerText = totalItems;

    if (cart.length === 0) {
        itemsList.innerHTML = `<div class="text-center py-20 flex flex-col items-center"><div class="w-16 h-16 bg-blue-50 text-blue-300 rounded-full flex items-center justify-center mb-4"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg></div><p class="text-blue-300 italic font-medium">Your collection is empty...</p></div>`;
        checkoutBtn.disabled = true;
    } else {
        checkoutBtn.disabled = false;
        itemsList.innerHTML = cart.map(item => `
            <div class="flex gap-4 group animate-up p-2 hover:bg-blue-50/50 rounded-2xl transition-all">
                <div class="w-20 h-20 rounded-2xl flex-shrink-0 relative overflow-hidden shadow-inner">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
                </div>
                <div class="flex-grow flex flex-col justify-center">
                    <div class="flex justify-between items-start"><h4 class="font-bold text-blue-900 leading-tight">${item.name}</h4><button onclick="removeFromCart(${item.id})" class="text-gray-300 hover:text-red-500 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button></div>
                    <div class="flex justify-between items-center mt-2"><div class="flex items-center gap-3"><button onclick="changeQty(${item.id}, -1)" class="w-6 h-6 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">-</button><span class="text-sm font-black text-gray-800">${item.quantity}</span><button onclick="changeQty(${item.id}, 1)" class="w-6 h-6 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">+</button></div><span class="font-black text-blue-700">₹${(item.price * item.quantity).toLocaleString()}</span></div>
                </div>
            </div>
        `).join('');
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalDisplay.innerText = `₹${total.toLocaleString()}`;
    checkoutTotalDisplay.innerText = `₹${total.toLocaleString()}`;
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) removeFromCart(id);
    else updateCartUI();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function showCheckout() {
    document.getElementById('checkout-modal').classList.remove('hidden');
    document.getElementById('checkout-modal').classList.add('flex');
}

function hideCheckout() {
    document.getElementById('checkout-modal').classList.add('hidden');
    document.getElementById('checkout-modal').classList.remove('flex');
}

document.getElementById('order-form').onsubmit = (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = "Confirming Order...";
    btn.disabled = true;
    setTimeout(() => {
        alert("✨ Order Confirmed! We'll reach out to your email shortly.");
        cart = []; updateCartUI(); hideCheckout(); toggleCart();
        btn.innerText = "Confirm Order"; btn.disabled = false;
        navigateTo('home');
    }, 2000);
};

// Customization Form Submission
document.getElementById('custom-form').onsubmit = (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerHTML;
    btn.innerText = "Sending Vision...";
    btn.disabled = true;

    setTimeout(() => {
        alert("✨ Your custom request has been sent! We'll contact you to discuss details and comfort options.");
        btn.innerHTML = originalText;
        btn.disabled = false;
        e.target.reset();
        filterShop('all'); // Go back to all products
    }, 2500);
};

// ADMIN LOGIN LOGIC
function showLoginModal() {
    document.getElementById('login-modal').classList.remove('hidden');
    document.getElementById('login-modal').classList.add('flex');
}

function hideLoginModal() {
    document.getElementById('login-modal').classList.add('hidden');
    document.getElementById('login-modal').classList.remove('flex');
}

document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;

    if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
        isAdmin = true;
        localStorage.setItem('bluelove_admin', 'true');
        updateAdminUI();
        hideLoginModal();
        alert('Welcome back, Admin! Site editing enabled.');
    } else {
        alert('Invalid credentials.');
    }
});

function logout() {
    isAdmin = false;
    localStorage.removeItem('bluelove_admin');
    updateAdminUI();
    alert('Logged out.');
}

function updateAdminUI() {
    const addBtn = document.getElementById('admin-add-btn');
    const loginLink = document.getElementById('admin-login-link');
    const logoutLink = document.getElementById('admin-logout-link');

    if (isAdmin) {
        addBtn?.classList.remove('hidden');
        loginLink?.classList.add('hidden');
        logoutLink?.classList.remove('hidden');
        enableContentEditing(true);
    } else {
        addBtn?.classList.add('hidden');
        loginLink?.classList.remove('hidden');
        logoutLink?.classList.add('hidden');
        enableContentEditing(false);
    }
    renderProducts();
}

// PRODUCT MANAGEMENT (CRUD)
let tempUploadedImage = ''; // Store base64 of selected image

function showProductModal(id = null) {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('product-form');
    const preview = document.getElementById('modal-img-preview');
    
    form.reset();
    document.getElementById('p-id').value = '';
    tempUploadedImage = '';
    preview.src = 'assets/bracelet1.png'; // Default placeholder

    if (id) {
        const p = products.find(p => p.id === id);
        if (p) {
            title.innerText = "Edit Product";
            document.getElementById('p-id').value = p.id;
            document.getElementById('p-name').value = p.name;
            document.getElementById('p-category').value = p.category;
            document.getElementById('p-price').value = p.price;
            document.getElementById('p-desc').value = p.desc;
            document.getElementById('p-image').value = p.image.startsWith('data:') ? '' : p.image;
            preview.src = p.image;
        }
    } else {
        title.innerText = "Add New Product";
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

// Handle File Input
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('p-file-input');
    const preview = document.getElementById('modal-img-preview');
    const urlInput = document.getElementById('p-image');

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    tempUploadedImage = event.target.result;
                    preview.src = tempUploadedImage;
                    urlInput.value = ''; // Clear URL if file selected
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Also update preview if URL is typed
    if (urlInput) {
        urlInput.addEventListener('input', (e) => {
            if (e.target.value) {
                preview.src = e.target.value;
                tempUploadedImage = ''; 
            }
        });
    }
});

function hideProductModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function editProduct(id) {
    showProductModal(id);
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        saveProductsToLocal();
        renderProducts();
    }
}

document.getElementById('product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('p-id').value;
    const name = document.getElementById('p-name').value;
    const category = document.getElementById('p-category').value;
    const price = parseInt(document.getElementById('p-price').value);
    const desc = document.getElementById('p-desc').value;
    const manualUrl = document.getElementById('p-image').value;
    
    const image = tempUploadedImage || manualUrl || 'assets/bracelet1.png';

    if (id) {
        // Update
        const index = products.findIndex(p => p.id == id);
        if (index !== -1) {
            products[index] = { ...products[index], name, category, price, desc, image };
        }
    } else {
        // Create
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, name, category, price, desc, image });
    }

    saveProductsToLocal();
    renderProducts();
    hideProductModal();
});

function saveProductsToLocal() {
    localStorage.setItem('bluelove_products', JSON.stringify(products));
}

// WEBSITE CONTENT PERSISTENCE (CMS-LITE)
function enableContentEditing(enable) {
    // Select all editable elements
    const editables = document.querySelectorAll('[id^="edit-"]');
    editables.forEach(el => {
        el.contentEditable = enable;
        if (enable) {
            el.classList.add('admin-editing');
            el.addEventListener('blur', savePageContent);
        } else {
            el.classList.remove('admin-editing');
            el.removeEventListener('blur', savePageContent);
        }
    });

    // Also handle images if needed (advanced, maybe just text for now)
}

function savePageContent() {
    const content = {};
    document.querySelectorAll('[id^="edit-"]').forEach(el => {
        content[el.id] = el.innerText;
    });
    localStorage.setItem('bluelove_site_content', JSON.stringify(content));
}

function loadPageContent() {
    const content = JSON.parse(localStorage.getItem('bluelove_site_content'));
    if (content) {
        Object.keys(content).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerText = content[id];
        });
    }
}

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    loadPageContent();
    renderProducts();
    updateCartUI();
    updateAdminUI(); // Re-apply admin state if logged in
});
