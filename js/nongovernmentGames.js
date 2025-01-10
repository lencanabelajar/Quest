// Data game untuk "Non Government"
const nonGovernmentData = [
    { 
        judul: '📚 Pengantar Dunia Kerja Profesional',
        link: '../html/tasks/pengantarnongovernment',
        kategori: 'Non Government',
        icon: 'ruby.png' 
    },
    {
        judul: '📚 Pengelolaan Waktu yang Efektif di Tempat Kerja Profesional',
        link: '../html/tasks/manajemenwaktu',
        kategori: 'Non Government',
        icon: 'ruby.png' 
    },
    { 
        judul: 'Pengantar Komunikasi Dunia Kerja',
        link: '../html/tasks/pengantarkomunikasikerja',
        kategori: 'Non Government',
        icon: 'ruby.png' 
    },
    { judul: '🛠 Cooming Soon',
      link: '../html/tasks/coomingsoon',
      kategori: 'Offline',
      icon: 'ruby.png' 
    },
    { 
        judul: '🛠 Cooming Soon',
        link: '../html/tasks/coomingsoon',
        kategori: 'Offline',
        icon: 'ruby.png' 
    },
    { 
        judul: '🛠 Cooming Soon',
        link: '../html/tasks/coomingsoon',
        kategori: 'Offline',
        icon: 'ruby.png' 
    },
];

// Filter untuk menghapus duplikat berdasarkan judul game
const uniqueNonGovernmentData = [...new Set(nonGovernmentData.map(game => game.judul))]
    .map(judul => nonGovernmentData.find(game => game.judul === judul));

// Jumlah game yang ditampilkan per halaman
const gamesPerPage = 3;  
let currentPage = 1;  // Halaman pertama yang akan ditampilkan

// Fungsi untuk menampilkan game pada halaman tertentu
function showPage(page) {
    const startIndex = (page - 1) * gamesPerPage;
    const endIndex = startIndex + gamesPerPage;
    const gamesToShow = uniqueNonGovernmentData.slice(startIndex, endIndex);

    const gamesList = document.getElementById('games-list');  // ID yang sesuai dengan HTML
    gamesList.innerHTML = ''; // Hapus isi sebelumnya

    // Menampilkan game
    gamesToShow.forEach(game => {
        const gameItem = document.createElement('div');
        gameItem.classList.add('game-item');

        gameItem.innerHTML = `
            <a href="${game.link}" class="game-info">
                <h3>${game.judul}</h3>
                <img src="../assets/icon/${game.icon}" alt="${game.judul}" class="game-invois" loading="lazy">
                <p>${game.judul}</p>
                <h2>${game.kategori}</h2>
            </a>
        `;
        gamesList.appendChild(gameItem);
    });

    // Memperbarui pagination
    updatePagination();
    currentPage = page;
}

// Fungsi untuk memperbarui tombol pagination
function updatePagination() {
    const paginationContainer = document.getElementById('pagination-container');  // ID sesuai HTML
    paginationContainer.innerHTML = ''; // Hapus pagination sebelumnya

    const totalPages = Math.ceil(uniqueNonGovernmentData.length / gamesPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.onclick = () => showPage(i);

        if (i === currentPage) {
            button.classList.add('active');
        }

        paginationContainer.appendChild(button);
    }
}

// Memanggil fungsi untuk menampilkan halaman pertama saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    showPage(1); // Tampilkan halaman pertama
});
