// Di scripts.js atau file lain
import { getStoreItems, purchaseItem, saveUserToAirtable } from './airtable.js';

// Elements for displaying store items
const storeItemsContainer = document.getElementById('store-items');

// Load store items from Firebase
window.addEventListener('load', () => {
  getStoreItems()
    .then(items => {
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

      // Attach event listeners to buy buttons after items are loaded
      const buyButtons = document.querySelectorAll('.buy-btn');
      buyButtons.forEach(button => {
        button.addEventListener('click', () => {
          const itemId = button.dataset.id;
          purchaseItem(itemId)
            .then(() => {
              alert('Item purchased successfully!');
            })
            .catch(error => {
              console.error('Error purchasing item: ', error); // Log error for debugging
              alert('Purchase failed: ' + error.message); // Show error to the user
            });
        });
      });
    })
    .catch(error => {
      console.error('Error loading store items: ', error); // Log error for debugging
      alert('Failed to load store items: ' + error.message); // Show error to the user
    });
});
