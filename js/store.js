// Import fungsi untuk mengambil data dan menyimpan pembelian dari Airtable
import { getStoreItems, purchaseItem, saveUserToAirtable } from './airtable.js';

// Elemen untuk menampilkan item toko
const storeItemsContainer = document.getElementById('store-items');

// Fungsi untuk memuat item toko dari Airtable
window.addEventListener('load', () => {
  getStoreItems() // Mendapatkan item dari Airtable
    .then(items => {
      // Kosongkan kontainer sebelum menampilkan item
      storeItemsContainer.innerHTML = ''; 

      if (items.length === 0) {
        storeItemsContainer.innerHTML = '<p>Belum ada item di toko.</p>';
        return;
      }

      // Loop melalui item dan menambahkannya ke halaman
      items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('store-item');
        itemElement.innerHTML = `
          <img src="${item.image}" alt="${item.name}" class="store-item-img">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <p>Harga: ${item.price} Ruby</p>
          <button class="buy-btn" data-id="${item.id}">Beli</button>
        `;
        storeItemsContainer.appendChild(itemElement);
      });

      // Menambahkan event listener untuk tombol beli setelah item dimuat
      const buyButtons = document.querySelectorAll('.buy-btn');
      buyButtons.forEach(button => {
        button.addEventListener('click', () => {
          const itemId = button.dataset.id;

          // Menangani pembelian item
          purchaseItem(itemId)
            .then(() => {
              alert('Item berhasil dibeli!');
            })
            .catch(error => {
              console.error('Error membeli item: ', error);
              alert('Gagal membeli item: ' + error.message);
            });
        });
      });
    })
    .catch(error => {
      console.error('Error memuat item toko: ', error);
      alert('Gagal memuat item toko: ' + error.message);
    });
});
