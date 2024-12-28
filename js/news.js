// Elemen tempat berita akan ditampilkan
const newsContainer = document.getElementById('news-container');

// Data berita statis (sebagai contoh, ini bisa diganti dengan file JSON atau API eksternal)
const newsData = [
  {
    title: "Berita Terbaru 1",
    description: "Deskripsi singkat berita pertama.",
    url: "https://example.com/berita-terbaru-1"
  },
  {
    title: "Berita Terbaru 2",
    description: "Deskripsi singkat berita kedua.",
    url: "https://example.com/berita-terbaru-2"
  },
  {
    title: "Berita Terbaru 3",
    description: "Deskripsi singkat berita ketiga.",
    url: "https://example.com/berita-terbaru-3"
  }
];

// Fungsi untuk menampilkan daftar berita
function displayNews(news) {
  newsContainer.innerHTML = '';  // Bersihkan kontainer berita
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

// Fungsi untuk mengambil berita (bisa dari file JSON atau API eksternal)
function getNews() {
  return new Promise((resolve, reject) => {
    // Jika Anda menggunakan file JSON lokal (misalnya news.json), Anda bisa fetch seperti berikut:
    fetch('news.json')
      .then(response => response.json())
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject('Error fetching news: ' + error.message);
      });

    // Atau jika menggunakan API eksternal, Anda bisa fetch dari API seperti:
    /*
    fetch('https://api.example.com/news')
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(error => reject('Error fetching news: ' + error.message));
    */
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
      alert('Gagal memuat berita: ' + error);
    });
});
