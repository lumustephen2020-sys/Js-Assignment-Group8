// Product Data - Prices directly in UGX with local images
const products = [
    {
        id: 1,
        name: "Infinix Smart 9",
        price: 4800000,
        category: "Electronics",
        image: "Images/Infinix 1.webp", 
        description: "Latest Infinix Smart 9"
    },
    {
        id: 2,
        name: "Asus Laptop",
        price: 9250000, 
        category: "Electronics",
        image: "Images/Laptop 1.webp", 
        description: "Powerful laptop for professionals"
    },
    {
        id: 3,
        name: "Classic Sneakers",
        price: 110000, 
        category: "Fashion",
        image: "images/download.jpg", 
        description: "Comfortable Shoes"
    },
    {
        id: 4,
        name: "Princess Heels",
        price: 295000, 
        category: "Fashion",
        image: "Images/download.webp", 
        description: "Classic blue denim jeans"
    },
    {
        id: 5,
        name: "JavaScript: The Good Parts",
        price: 130000, 
        category: "Books",
        image: "Images/book 1.jpg", 
        description: "Essential JavaScript guide"
    },
    {
        id: 6,
        name: "Learn Python",
        price: 110000, 
        category: "Books",
        image: "Images/python.jpg", 
        description: "Build beautiful websites"
    }
];

// Global variables
let cart = [];
let currentCategory = 'all';
let searchTerm = '';

// Format price in UGX
function formatUGX(amount) {
    return 'UGX ' + amount.toLocaleString('en-UG');
}

// Initialize based on current page
document.addEventListener('DOMContentLoaded', () => {
    try {
        loadCart();
        
        updateCartCount();
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('cart.html')) {
            // Cart page specific
            initializeCartPage();
        } else if (currentPage.includes('checkout.html')) {
            // Checkout page specific
            initializeCheckoutPage();
        } else {
            // Home page (index.html)
            initializeHomePage();
        }
    } catch (error) {
        console.error('Error initializing app:', error);
        showErrorMessage('Failed to load page. Please refresh.');
    }
});

//  HOME PAGE FUNCTIONS
function initializeHomePage() {
    displayProducts(products);
    setupHomePageListeners();
}

function setupHomePageListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.toLowerCase();
            filterProducts();
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => filterProducts());
    }
    
    // Category filter buttons
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            filterProducts();
        });
    });
}

function displayProducts(productsToDisplay) {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
        container.innerHTML = '<div class="empty-products"><p>No products found.</p></div>';
        return;
    }
    
    productsToDisplay.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='images/placeholder.jpg'">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">${formatUGX(product.price)}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        // Add event listener to the button
        const addBtn = card.querySelector('.add-to-cart-btn');
        addBtn.addEventListener('click', () => addToCart(product));
        
        container.appendChild(card);
    });
}

function filterProducts() {
    try {
        let filtered = products;
        
        if (currentCategory !== 'all') {
            filtered = filtered.filter(product => product.category === currentCategory);
        }
        
        if (searchTerm) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
        }
        
        displayProducts(filtered);
    } catch (error) {
        console.error('Error filtering products:', error);
    }
}

//  CART FUNCTIONS 
function loadCart() {
    try {
        const savedCart = localStorage.getItem('cart');
        cart = savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
        console.error('Error loading cart:', error);
        cart = [];
    }
}

function saveCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    } catch (error) {
        console.error('Error saving cart:', error);
    }
}

function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        if (element) element.textContent = totalItems;
    });
}

function addToCart(product) {
    try {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image
            });
        }
        
        saveCart();
        alert(`${product.name} added to cart!`);
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add item to cart.');
    }
}

// ============= CART PAGE FUNCTIONS =============
function initializeCartPage() {
    displayCartItems();
}

function displayCartItems() {
    const cartContainer = document.getElementById('cart-container');
    const summaryContainer = document.getElementById('cart-summary');
    
    if (!cartContainer) return;
    
    cartContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <a href="index.html" class="checkout-btn">Continue Shopping</a>
            </div>
        `;
        if (summaryContainer) summaryContainer.innerHTML = '';
        return;
    }
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${formatUGX(item.price)} each</div>
                <div>Total: ${formatUGX(itemTotal)}</div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        
        cartContainer.appendChild(cartItem);
    });
    
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    if (summaryContainer) {
        summaryContainer.innerHTML = `
            <h3>Order Summary</h3>
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>${formatUGX(subtotal)}</span>
            </div>
            <div class="summary-row">
                <span>Tax (10%):</span>
                <span>${formatUGX(tax)}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>${formatUGX(total)}</span>
            </div>
            <a href="checkout.html" class="checkout-btn">Proceed to Checkout</a>
        `;
    }
}

// Make these functions global so onclick attributes can access them
window.updateQuantity = function(productId, change) {
    try {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                cart = cart.filter(item => item.id !== productId);
            }
            saveCart();
            displayCartItems();
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        alert('Failed to update quantity.');
    }
};

window.removeFromCart = function(productId) {
    try {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        displayCartItems();
    } catch (error) {
        console.error('Error removing from cart:', error);
        alert('Failed to remove item.');
    }
};

// ============= CHECKOUT PAGE FUNCTIONS =============
function initializeCheckoutPage() {
    displayCheckoutSummary();
    setupCheckoutForm();
}

function displayCheckoutSummary() {
    const container = document.getElementById('checkout-cart-summary');
    if (!container) return;
    
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    container.innerHTML = `
        <h3>Order Summary</h3>
        <div class="summary-row">
            <span>Items in cart:</span>
            <span>${cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </div>
        <div class="summary-row">
            <span>Subtotal:</span>
            <span>${formatUGX(subtotal)}</span>
        </div>
        <div class="summary-row">
            <span>Tax (10%):</span>
            <span>${formatUGX(tax)}</span>
        </div>
        <div class="summary-row total">
            <span>Total:</span>
            <span>${formatUGX(total)}</span>
        </div>
    `;
}

function setupCheckoutForm() {
    const form = document.getElementById('checkout-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        try {
            if (validateCheckoutForm()) {
                if (cart.length === 0) {
                    throw new Error('Your cart is empty. Please add items before checkout.');
                }
                
                alert('Order placed successfully! Thank you for shopping with us.');
                cart = [];
                saveCart();
                window.location.href = 'index.html';
            }
        } catch (error) {
            alert(error.message);
        }
    });
    
    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your cart?')) {
                cart = [];
                saveCart();
                displayCheckoutSummary();
                displayCartItems(); // If on cart page
            }
        });
    }
}

function validateCheckoutForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const address = document.getElementById('address');
    
    // Clear previous errors
    document.getElementById('name-error').textContent = '';
    document.getElementById('email-error').textContent = '';
    document.getElementById('phone-error').textContent = '';
    document.getElementById('address-error').textContent = '';
    
    let isValid = true;
    
    if (!name.value.trim()) {
        document.getElementById('name-error').textContent = 'Name is required';
        isValid = false;
    }
    
    if (!email.value.trim()) {
        document.getElementById('email-error').textContent = 'Email is required';
        isValid = false;
    } else if (!email.value.includes('@') || !email.value.includes('.')) {
        document.getElementById('email-error').textContent = 'Enter a valid email';
        isValid = false;
    }
    
    if (!phone.value.trim()) {
        document.getElementById('phone-error').textContent = 'Phone is required';
        isValid = false;
    } else if (phone.value.length < 10) {
        document.getElementById('phone-error').textContent = 'Enter a valid phone number';
        isValid = false;
    }
    
    if (!address.value.trim()) {
        document.getElementById('address-error').textContent = 'Address is required';
        isValid = false;
    }
    
    return isValid;
}

function showErrorMessage(message) {
    const containers = ['products-container', 'cart-container', 'checkout-cart-summary'];
    containers.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            container.innerHTML = `<div class="error-message">${message}</div>`;
        }
    });
}
