function Order(mealName, mealPrice, mealImage) {
    this.mealName = mealName;
    this.mealPrice = mealPrice;
    this.mealImage = mealImage;
}

const orderForm = document.getElementById("orderForm");
const ordersContainer = document.getElementById("ordersContainer");
const clearOrders = document.getElementById("clearOrders");

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    if (orderForm) {
        loadOrders();

        orderForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const mealName = document.getElementById('mealName').value;
            const mealPrice = document.getElementById('mealPrice').value;
            const mealImage = document.getElementById('mealImage').value;

            const newOrder = new Order(mealName, mealPrice, mealImage);

            saveOrder(newOrder);
            displayOrder(newOrder);
            orderForm.reset();
        });

        if (clearOrders) {
            clearOrders.addEventListener('click', function () {
                localStorage.removeItem('crazyMealOrders');
                ordersContainer.innerHTML = '';
            });
        }
    }
});

function saveOrder(order) {
    let orders = JSON.parse(localStorage.getItem("crazyMealOrders")) || [];
    orders.push(order);
    localStorage.setItem("crazyMealOrders", JSON.stringify(orders));
}

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('crazyMealOrders')) || [];
    orders.forEach(order => displayOrder(order));
}

function removeOrder(orderToRemove) {
    let orders = JSON.parse(localStorage.getItem('crazyMealOrders')) || [];
    
    orders = orders.filter(order => 
        order.mealName !== orderToRemove.mealName ||
        order.mealPrice !== orderToRemove.mealPrice ||
        order.mealImage !== orderToRemove.mealImage
    );
    
    localStorage.setItem('crazyMealOrders', JSON.stringify(orders));
}

function displayOrder(order) {
    const orderElement = document.createElement('div');
    orderElement.classList.add('order-card');

    const img = document.createElement('img');
    img.alt = order.mealName;
    
    if (!order.mealImage || order.mealImage.trim() === '') {
        img.src = 'images/default-meal.jpg';
    } else {
        // Try to load the provided image
        try {
            // Check if it's a valid URL
            const url = new URL(order.mealImage);
            img.src = url.href;
        } catch {
            img.src = order.mealImage;
        }
        
        img.onerror = function() {
            this.onerror = null;
            this.src = 'images/default-meal.jpg';
            console.log('Failed to load image:', order.mealImage);
        };
    }

    const mealInfo = `
        <p><strong>Meal:</strong> ${order.mealName}</p>
        <p><strong>Price:</strong> $${order.mealPrice}</p>
    `;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '❌ Delete';
    deleteButton.classList.add('delete-btn');
    deleteButton.onclick = function() {
        removeOrder(order);
        orderElement.remove();
    };

    // Append elements
    orderElement.appendChild(img);
    orderElement.insertAdjacentHTML('beforeend', mealInfo);
    orderElement.appendChild(deleteButton);
    ordersContainer.appendChild(orderElement);
}