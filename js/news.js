// Import fungsi untuk mengambil berita dari Airtable atau sumber lainnya
import { getNews } from './airtable.js';

// Elemen tempat berita akan ditampilkan
const newsContainer = document.getElementById('news-container');

// Fungsi untuk menampilkan daftar berita
function displayNews(news) {
  news.forEach(article => {
    const articleElement = document.createElement('div');
    articleElement.classList.add('news-item');
    articleElement.innerHTML = `
      <h3>${article.title}</h3>
      <p>${article.description}</p>
      <a href="${article.url}" target="_blank">Baca lebih lanjut</a>
    `;
    newsContainer.appendChild(articleElement);
  });
}

// Ambil dan tampilkan berita ketika halaman dimuat
window.addEventListener('load', () => {
  getNews()
    .then(news => {
      displayNews(news);
    })
    .catch(error => {
      console.error('Error loading news: ', error);
      alert('Gagal memuat berita: ' + error.message);
    });
});
