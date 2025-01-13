// studentGames.js
// Data game untuk Edisi Pelajar - Mahasiswa
const studentGames = [
    {
        title: "Pengantar Sosiologi",
        link: "../html/tasks/sosiologi1",
        image: "../assets/icon/SOSIOLOGI1.jpg",
        description: "Pengantar Sosiologi",
    },
    {
        title: "Pengantar Sejarah",
        link: "../html/tasks/sejarah1",
        image: "../assets/icon/ruby.png",
        description: "Pengantar Sejarah",
    },
    {
        title: "Pengantar Ekonomi",
        link: "../html/tasks/ekonomi1",
        image: "../assets/icon/ruby.png",
        description: "Pengantar Ekonomi",
    },
    {
        title: "🛠 Coming Soon",
        link: "tasks/coomingsoon.html",
        image: "../assets/icon/ruby.png",
        description: "Offline",
    },
    {
        title: "🛠 Coming Soon",
        link: "tasks/coomingsoon.html",
        image: "../assets/icon/ruby.png",
        description: "Offline",
    },
    {
        title: "🛠 Coming Soon",
        link: "tasks/coomingsoon.html",
        image: "../assets/icon/ruby.png",
        description: "Offline",
    },
];

// Konstanta untuk jumlah item per halaman
const ITEMS_PER_PAGE = 3;

// Fungsi untuk menampilkan daftar game berdasarkan halaman
function displayStudentGames(page = 1) {
    const studentGamesList = document.getElementById("student-games-list");
    studentGamesList.innerHTML = ""; // Kosongkan daftar sebelumnya

    // Hitung indeks game yang akan ditampilkan
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const gamesToDisplay = studentGames.slice(startIndex, endIndex);

    // Tambahkan elemen game ke dalam kontainer
    gamesToDisplay.forEach(game => {
        const gameItem = document.createElement("div");
        gameItem.className = "game-item";
        gameItem.innerHTML = `
            <a href="${game.link}" class="game-info">
                <h3>${game.title}</h3>
                <img src="${game.image}" alt="${game.description}" class="game-invois" loading="lazy">
                <p>${game.description}</p>
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
    paginationButtons.forEach((button, index) => {
        if (index + 1 === page) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });
}

// Fungsi untuk membuat tombol pagination
function createPagination(totalItems) {
    const paginationContainer = document.querySelector(".pagination");
    paginationContainer.innerHTML = ""; // Kosongkan pagination sebelumnya

    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.onclick = () => showPage(i);
        if (i === 1) button.classList.add("active"); // Halaman pertama aktif secara default
        paginationContainer.appendChild(button);
    }
}

// Event listener untuk memuat halaman pertama dan membuat pagination
document.addEventListener("DOMContentLoaded", () => {
    createPagination(studentGames.length); // Buat tombol pagination
    displayStudentGames(1); // Tampilkan halaman pertama secara default
});
