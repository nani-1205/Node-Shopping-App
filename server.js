// server.js (Node.js with Express)

const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const productsFilePath = path.join(__dirname, 'products.json');

function readProducts() {
    try {
        const data = fs.readFileSync(productsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading products.json:', error);
        return [];
    }
}

function writeProducts(products) {
    try {
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing to products.json:', error);
    }
}

let cart = [];

// --- Routes ---

// 1.  Home Page (Product Listing)
app.get('/', (req, res) => {
    const products = readProducts();
    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My Awesome Shopping App</title>
        <link rel="stylesheet" href="/style.css">
    </head>
    <body>
        <header>
          <h1>My Colorful Shopping App</h1>
          <a href="/cart" class="cart-link">
          <img src="/images/cart-icon.png" alt="Cart Icon">
           View Cart (<span id="cart-count">${cart.length}</span>)
          </a>

        </header>
        <main>
            <div class="product-grid">`;

    products.forEach(product => {
        html += `
                <div class="product">
                   <img src="${product.image}" alt="${product.name}">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>`;
    });

    html += `
            </div>
        </main>
        <script src="/script.js"></script>
    </body>
    </html>`;

    res.send(html);
});

// 2. Cart Page
app.get('/cart', (req, res) => {
    const products = readProducts();
    const cartItemsWithDetails = cart.map(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);
        return {
            ...cartItem,
            name: product ? product.name : 'Unknown Product',
            price: product ? product.price : 0,
            image: product ? product.image : '/images/placeholder.png'
        };
    });

    let totalPrice = cartItemsWithDetails.reduce((sum, item) => sum + (item.price * item.quantity), 0);


    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Your Cart</title>
        <link rel="stylesheet" href="/style.css">
        <style>
            /* Specific cart styles */
            .cart-item {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
                border: 1px solid #ddd;
                padding: 10px;
            }
            .cart-item img {
                width: 50px;
                height: 50px;
                margin-right: 10px;
                border: 1px solid #ccc;
            }
           .cart-item .item-details{
                flex-grow: 1;
           }
            .cart-item .quantity-controls {
               display: flex;
               align-items: center;

            }

            .cart-item .quantity-controls button{
              margin: 0 5px;
              padding: 5px 10px;
              background-color: #f0f0f0;
              border: 1px solid #ccc;
              cursor: pointer;
            }


           .total-price {
               font-weight: bold;
               margin-top: 20px;
               font-size: 1.2em;
           }
           .empty-cart-message {
             text-align: center;
             font-style: italic;
             color: #888;
           }

        </style>
    </head>
    <body>
      <header>
        <h1>Your Shopping Cart</h1>
        <a href="/">Back to Products</a>
      </header>
        <main>
           <div class="cart-container">
            ${cartItemsWithDetails.length === 0 ? '<p class="empty-cart-message">Your cart is empty.</p>' : ''}
             ${cartItemsWithDetails.map(item => `
                <div class="cart-item">
                   <img src="${item.image}" alt="${item.name}">
                   <div class="item-details">
                      <h2>${item.name}</h2>
                      <p>Price: $${item.price.toFixed(2)}</p>
                    </div>
                   <div class="quantity-controls">
                     <button class="quantity-btn" data-action="decrease" data-id="${item.productId}">-</button>
                     <span>${item.quantity}</span>
                     <button class="quantity-btn" data-action="increase" data-id="${item.productId}">+</button>
                   </div>

                    <button class="remove-item" data-id="${item.productId}">Remove</button>
                </div>
            `).join('')}
           </div>
           <p class="total-price">Total: $${totalPrice.toFixed(2)}</p>
             ${cartItemsWithDetails.length > 0 ? '<button id="checkout-btn">Checkout</button>' : ''}

        </main>
        <script src="/cart.js"></script>
    </body>
    </html>`;
    res.send(html);
});



// --- API Endpoints (for AJAX/Fetch) ---

// Add to Cart (API)
app.post('/api/cart/add', (req, res) => {
    const productId = parseInt(req.body.productId);
    if (!productId) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }

    const products = readProducts();
    const product = products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    const existingCartItem = cart.find(item => item.productId === productId);

    if (existingCartItem) {
        existingCartItem.quantity++;
    } else {
        cart.push({ productId: productId, quantity: 1 });
    }
    res.json({ message: 'Product added to cart', cartCount: cart.length });
});


// Update Cart Quantity (API)
app.post('/api/cart/update', (req, res) => {
    const productId = parseInt(req.body.productId);
    const action = req.body.action;

    if (!productId || !action) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    const cartItem = cart.find(item => item.productId === productId);
    if (!cartItem) {
        return res.status(404).json({ error: 'Item not found in cart' });
    }

    if (action === 'increase') {
        cartItem.quantity++;
    } else if (action === 'decrease') {
        cartItem.quantity--;
        if (cartItem.quantity <= 0) {
            cart = cart.filter(item => item.productId !== productId);
        }
    } else {
        return res.status(400).json({ error: 'Invalid action' });
    }

    res.json({ message: 'Cart updated', cartCount: cart.length });
});

// Remove from Cart (API)
app.post('/api/cart/remove', (req, res) => {
    const productId = parseInt(req.body.productId);

    if (!productId) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    const initialCartLength = cart.length;
    cart = cart.filter(item => item.productId !== productId);

    if (cart.length === initialCartLength) {
        return res.status(404).json({ error: 'Item not found in cart' });
    }

    res.json({ message: 'Item removed from cart', cartCount: cart.length });
});

// Checkout (API - Placeholder)
app.post('/api/checkout', (req, res) => {
    cart = [];
    res.json({ message: 'Checkout successful!  Your order is being processed.' });
});


// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});