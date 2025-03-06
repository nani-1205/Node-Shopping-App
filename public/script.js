// public/script.js (Client-side JavaScript for the product listing page)

document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCountSpan = document.getElementById('cart-count');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.dataset.id;

            try {
                const response = await fetch('/api/cart/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ productId }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP error: ${response.status}`);
                }

                const data = await response.json();
                console.log(data.message);
                cartCountSpan.textContent = data.cartCount;
                showNotification('Added to cart!');

            } catch (error) {
                console.error('Error adding to cart:', error);
                showNotification(`Error: ${error.message}`, 'error');
            }
        });
    });

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
});