// studentGames.js
// Data game untuk Edisi Pelajar - Mahasiswa
const studentGames = [
    {
        title: "Pengantar Sosiologi",
        description: "Pengantar Sosiologi",
        target: "Pelajar-Mahasiswa",
        image: "../assets/icon/ruby.png",
        link: "../html/tasks/sosiologi1"
    },
    {
        title: "Pengantar Sejarah",
        description: "Pengantar Sejarah",
        target: "Pelajar-Mahasiswa",
        image: "../assets/icon/ruby.png",
        link: "../html/tasks/sejarah1"
    },
    {
        title: "Pengantar Ekonomi",
        description: "Pengantar Ekonomi",
        target: "Pelajar-Mahasiswa",
        image: "../assets/icon/ruby.png",
        link: "../html/tasks/ekonomi1"
    },
    {
        title: "🛠 Cooming Soon",
        description: "Konten sedang dalam pengembangan",
        target: "Offline",
        image: "../assets/icon/ruby.png",
        link: "tasks/coomingsoon.html"
    },
    // Tambahkan data game lainnya di sini
];

// Fungsi untuk menampilkan daftar game
function displayStudentGames(page = 1, itemsPerPage = 3) {
    const studentGamesList = document.getElementById("student-games-list");
    studentGamesList.innerHTML = ""; // Kosongkan daftar sebelumnya

    // Hitung indeks game yang akan ditampilkan
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const gamesToDisplay = studentGames.slice(startIndex, endIndex);

    // Iterasi dan tambahkan elemen game ke dalam kontainer
    gamesToDisplay.forEach(game => {
        const gameItem = document.createElement("div");
        gameItem.className = "game-item";
        gameItem.innerHTML = `
            <a href="${game.link}" class="game-info">
                <h3>${game.title}</h3>
                <img src="${game.image}" alt="${game.description}" class="game-invois" loading="lazy">
                <p>${game.description}</p>
                <h2>${game.target}</h2>
            </a>
        `;
        studentGamesList.appendChild(gameItem);
    });
}

// Fungsi untuk menangani perubahan halaman
function showPage(page) {
    // Perbarui tampilan daftar game
    displayStudentGames(page);

    // Perbarui status tombol aktif di pagination
    const paginationButtons = document.querySelectorAll(".pagination button");
    paginationButtons.forEach(button => button.classList.remove("active"));
    paginationButtons[page - 1].classList.add("active");
}

// Tampilkan halaman pertama secara default
document.addEventListener("DOMContentLoaded", () => {
    displayStudentGames(1); // Tampilkan halaman pertama
});
