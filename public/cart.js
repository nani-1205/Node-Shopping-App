// public/cart.js (Client-side JavaScript for the cart page)

document.addEventListener('DOMContentLoaded', () => {
    const quantityButtons = document.querySelectorAll('.quantity-btn');
    const removeButtons = document.querySelectorAll('.remove-item');
    const checkoutButton = document.getElementById('checkout-btn');
    const cartCountSpan = document.getElementById('cart-count'); //If you have cart count on cart page

    // Update Quantity
    quantityButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.dataset.id;
            const action = event.target.dataset.action;

            try {
                const response = await fetch('/api/cart/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId, action })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP Error: ${response.status}`);
                }

                const data = await response.json();
                console.log(data.message);
                window.location.reload();


            } catch (error) {
                console.error('Error updating quantity: ', error);
                alert(`Error updating quantity: ${error.message}`);
            }
        });
    });

    // Remove Item
    removeButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.dataset.id;

            try {
                const response = await fetch('/api/cart/remove', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP Error: ${response.status}`);
                }

                const data = await response.json();
                console.log(data.message);
                window.location.reload();

            } catch (error) {
                console.error("Error removing item:", error);
                alert(`Error removing item: ${error.message}`);
            }
        });
    });

    // Checkout (Placeholder)
    if (checkoutButton) {
        checkoutButton.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP Error: ${response.status}`);
                }
                const data = await response.json();
                alert(data.message);
                window.location.href = '/';

            } catch (error) {
                console.error('Checkout Error', error);
                alert(`Checkout Error: ${error.message}`);
            }
        });
    }
});