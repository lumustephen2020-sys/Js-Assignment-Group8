// My products list - I put all the items I'm selling here
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
    },
    {
    id: 7,
    name: "Gaming Laptop",
    price: 2000000,
    category: "Electronics",
    image: "Images/Gaming laptop.webp",
    description: "High performance gaming laptop"
},
{
    id: 8,
    name: "Digital Camera",
    price: 850000,
    category: "Electronics",
    image: "Images/camera.webp",
    description: "Capture high-quality photos"
},
{
    id: 9,
    name: "Wireless Earbuds",
    price: 95000,
    category: "Electronics",
    image: "Images/earbuds.jpg",
    description: "Clear sound wireless earbuds"
},
{
    id: 10,
    name: "Power Bank",
    price: 70000,
    category: "Electronics",
    image: "Images/powerbank.webp",
    description: "Portable fast charging power bank"
},
{
    id: 11,
    name: "Smart Watch",
    price: 180000,
    category: "Electronics",
    image: "Images/smart watch.webp",
    description: "Track fitness and notifications"
},
{
    id: 12,
    name: "Jeans",
    price: 85000,
    category: "Fashion",
    image: "Images/jeans.jpg",
    description: "Stylish and comfortable jeans"
}
];

// These are my global variables - I use them everywhere in my code
let cart = []; // This will hold all the items the user adds to cart
let currentCategory = 'all'; // This tracks which category filter is active
let searchTerm = ''; // This tracks what the user is searching for

// This function helps me show prices with UGX currency format
function formatUGX(amount) {
    // I learned this from Google - it adds commas to big numbers
    return 'UGX ' + amount.toLocaleString('en-UG');
}

// This runs when the page loads - I check which page we're on
document.addEventListener('DOMContentLoaded', () => {
    try {
        // First I load any saved cart items from localStorage
        loadCart();
        
        // Update the little number that shows how many items are in cart
        updateCartCount();
        
        // I need to know which page the user is on
        const currentPage = window.location.pathname;
        
        // Different pages need different setup
        if (currentPage.includes('cart.html')) {
            // If we're on cart page, show cart items
            initializeCartPage();
        } else if (currentPage.includes('checkout.html')) {
            // If we're on checkout page, setup checkout
            initializeCheckoutPage();
        } else {
            // Otherwise we must be on home page
            initializeHomePage();
        }
    } catch (error) {
        // If something breaks, show error message
        console.error('Error initializing app:', error);
        showErrorMessage('Failed to load page. Please refresh.');
    }
});

//  HOME PAGE FUNCTIONS - This is for the main shop page
function initializeHomePage() {
    // Show all products when page loads
    displayProducts(products);
    // Set up all the buttons and search box
    setupHomePageListeners();
}

function setupHomePageListeners() {
    // Get the search input and button from the page
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    // When user types in search box, I update the search term
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.toLowerCase(); // Make everything lowercase so search works better
            filterProducts(); // Show only matching products
        });
    }
    
    // When user clicks search button, filter products
    if (searchBtn) {
        searchBtn.addEventListener('click', () => filterProducts());
    }
    
    // Get all the category filter buttons
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Remove active class from all buttons first
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the button that was clicked
            e.target.classList.add('active');
            // Update current category based on what was clicked
            currentCategory = e.target.dataset.category;
            // Show products for this category
            filterProducts();
        });
    });
}

// This function actually puts products on the screen
function displayProducts(productsToDisplay) {
    // Find the container where products go
    const container = document.getElementById('products-container');
    if (!container) return; // If no container, stop the function
    
    // Clear whatever was there before
    container.innerHTML = '';
    
    // If no products to show, show a message
    if (productsToDisplay.length === 0) {
        container.innerHTML = '<div class="empty-products"><p>No products found.</p></div>';
        return;
    }
    
    // Loop through each product and create HTML for it
    productsToDisplay.forEach(product => {
        // Create a card for each product
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Put all the product info inside the card
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='images/placeholder.jpg'">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">${formatUGX(product.price)}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        // I need to make the Add to Cart button work
        const addBtn = card.querySelector('.add-to-cart-btn');
        addBtn.addEventListener('click', () => addToCart(product));
        
        // Add the card to the container
        container.appendChild(card);
    });
}

// This function filters products based on category and search
function filterProducts() {
    try {
        // Start with all products
        let filtered = products;
        
        // If category isn't 'all', filter by category
        if (currentCategory !== 'all') {
            filtered = filtered.filter(product => product.category === currentCategory);
        }
        
        // If there's a search term, filter by name or description
        if (searchTerm) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
        }
        
        // Show the filtered products
        displayProducts(filtered);
    } catch (error) {
        console.error('Error filtering products:', error);
    }
}

//  CART FUNCTIONS - These manage the shopping cart
function loadCart() {
    try {
        // Try to get saved cart from browser's localStorage
        const savedCart = localStorage.getItem('cart');
        cart = savedCart ? JSON.parse(savedCart) : []; // If nothing saved, start with empty cart
    } catch (error) {
        console.error('Error loading cart:', error);
        cart = [];
    }
}

function saveCart() {
    try {
        // Save current cart to localStorage so it doesn't disappear
        localStorage.setItem('cart', JSON.stringify(cart));
        // Update the cart count display
        updateCartCount();
    } catch (error) {
        console.error('Error saving cart:', error);
    }
}

function updateCartCount() {
    // Find all elements that show cart count (there might be multiple)
    const cartCountElements = document.querySelectorAll('#cart-count');
    // Calculate total number of items (sum of all quantities)
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update each element with the total
    cartCountElements.forEach(element => {
        if (element) element.textContent = totalItems;
    });
}

// This adds a product to the cart
function addToCart(product) {
    try {
        // Check if product is already in cart
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            // If it's already there, just increase quantity by 1
            existingItem.quantity += 1;
        } else {
            // If it's new, add it with quantity 1
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image
            });
        }
        
        // Save the updated cart
        saveCart();
        // Tell user it worked
        alert(`${product.name} added to cart!`);
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add item to cart.');
    }
}

//  CART PAGE FUNCTIONS - For the shopping cart page
function initializeCartPage() {
    // Show all items in cart when page loads
    displayCartItems();
}

function displayCartItems() {
    // Find the container for cart items
    const cartContainer = document.getElementById('cart-container');
    const summaryContainer = document.getElementById('cart-summary');
    
    if (!cartContainer) return;
    
    // Clear whatever was there before
    cartContainer.innerHTML = '';
    
    // If cart is empty, show a message
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
    
    // Loop through each item in cart and show it
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
    
    // Calculate tax and total
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    // Show the order summary with totals
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

// I had to make these global so the buttons in HTML can call them
window.updateQuantity = function(productId, change) {
    try {
        // Find the item in cart
        const item = cart.find(item => item.id === productId);
        if (item) {
            // Change quantity by +1 or -1
            item.quantity += change;
            // If quantity becomes 0 or less, remove the item
            if (item.quantity <= 0) {
                cart = cart.filter(item => item.id !== productId);
            }
            // Save changes and refresh display
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
        // Remove item from cart
        cart = cart.filter(item => item.id !== productId);
        // Save changes and refresh display
        saveCart();
        displayCartItems();
    } catch (error) {
        console.error('Error removing from cart:', error);
        alert('Failed to remove item.');
    }
};

// ============= CHECKOUT PAGE FUNCTIONS =============
function initializeCheckoutPage() {
    // Show cart summary on checkout page
    displayCheckoutSummary();
    // Set up the checkout form validation
    setupCheckoutForm();
}

function displayCheckoutSummary() {
    // Find the container for checkout summary
    const container = document.getElementById('checkout-cart-summary');
    if (!container) return;
    
    // Calculate total again
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    // Show order summary with quantities and totals
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
    // Find the checkout form
    const form = document.getElementById('checkout-form');
    if (!form) return;
    
    // When user submits form, validate and process order
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Stop form from actually submitting
        
        try {
            if (validateCheckoutForm()) {
                // Make sure cart isn't empty
                if (cart.length === 0) {
                    throw new Error('Your cart is empty. Please add items before checkout.');
                }
                
                // If everything is okay, show success message
                alert('Order placed successfully! Thank you for shopping with us.');
                // Clear the cart
                cart = [];
                saveCart();
                // Go back to home page
                window.location.href = 'index.html';
            }
        } catch (error) {
            alert(error.message);
        }
    });
    
    // Setup clear cart button if it exists
    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your cart?')) {
                cart = [];
                saveCart();
                displayCheckoutSummary();
                displayCartItems(); // If we're on cart page, refresh that too
            }
        });
    }
}

// This function checks if all form fields are filled correctly
function validateCheckoutForm() {
    // Get all the form fields
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const address = document.getElementById('address');
    
    // Clear any previous error messages
    document.getElementById('name-error').textContent = '';
    document.getElementById('email-error').textContent = '';
    document.getElementById('phone-error').textContent = '';
    document.getElementById('address-error').textContent = '';
    
    let isValid = true;
    
    // Check if name is filled
    if (!name.value.trim()) {
        document.getElementById('name-error').textContent = 'Name is required';
        isValid = false;
    }
    
    // Check if email is filled and looks like an email
    if (!email.value.trim()) {
        document.getElementById('email-error').textContent = 'Email is required';
        isValid = false;
    } else if (!email.value.includes('@') || !email.value.includes('.')) {
        document.getElementById('email-error').textContent = 'Enter a valid email';
        isValid = false;
    }
    
    // Check if phone is filled and long enough
    if (!phone.value.trim()) {
        document.getElementById('phone-error').textContent = 'Phone is required';
        isValid = false;
    } else if (phone.value.length < 10) {
        document.getElementById('phone-error').textContent = 'Enter a valid phone number';
        isValid = false;
    }
    
    // Check if address is filled
    if (!address.value.trim()) {
        document.getElementById('address-error').textContent = 'Address is required';
        isValid = false;
    }
    
    return isValid;
}

// This shows an error message on the page if something goes wrong
function showErrorMessage(message) {
    // Try to show error in different containers
    const containers = ['products-container', 'cart-container', 'checkout-cart-summary'];
    containers.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            container.innerHTML = `<div class="error-message">${message}</div>`;
        }
    });
}
