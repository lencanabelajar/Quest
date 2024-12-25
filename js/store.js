import { getStoreItems, purchaseItem } from './firebase.js';

// Elements for displaying store items
const storeItemsContainer = document.getElementById('store-items');
const buyButtons = document.querySelectorAll('.buy-btn');

// Load store items from Firebase
window.addEventListener('load', () => {
  getStoreItems().then(items => {
    items.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('store-item');
      itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="store-item-img">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <button class="buy-btn" data-id="${item.id}">Buy for ${item.price} coins</button>
      `;
      storeItemsContainer.appendChild(itemElement);
    });
  });
});

// Handle item purchase
buyButtons.forEach(button => {
  button.addEventListener('click', () => {
    const itemId = button.dataset.id;
    purchaseItem(itemId)
      .then(() => {
        alert('Item purchased successfully!');
      })
      .catch(error => {
        alert('Purchase failed: ' + error.message);
      });
  });
});
