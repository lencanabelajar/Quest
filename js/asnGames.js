// Data untuk Edisi Pegawai Negeri - CPNS P3K - ASN
const asnGames = [
    {
        title: "📚 Pengantar PPPK",
        link: "../html/tasks/pengantarp3k",
        image: "../assets/icon/PPPK1.jpg",
        target: "Calon PPPK",
    },
    {
        title: "📚 Pengantar Tes Kompetensi Teknis Satpol PP",
        link: "../html/tasks/pengantarteskompetensiteknissatpolpp",
        image: "../assets/icon/ruby.png",
        target: "Calon PPPK",
    },
    {
        title: "📚 Pengantar Arsiparis",
        link: "../html/tasks/arsiparis",
        image: "../assets/icon/ruby.png",
        target: "CPNS - Arsiparis",
    },
    {
        title: "🛠 Cooming Soon",
        link: "../html/tasks/coomingsoon",
        image: "../assets/icon/ruby.png",
        target: "Offline",
    },
];

// Fungsi untuk menampilkan daftar game
function displayAsnGames(page = 1, itemsPerPage = 3) {
    const gamesList = document.getElementById("asn-games-list");
    gamesList.innerHTML = ""; // Kosongkan daftar sebelumnya

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const gamesToDisplay = asnGames.slice(startIndex, endIndex);

    gamesToDisplay.forEach(game => {
        const gameItem = document.createElement("div");
        gameItem.className = "game-item";
        gameItem.innerHTML = `
            <a href="${game.link}" class="game-info">
                <h3>${game.title}</h3>
                <img src="${game.image}" alt="${game.title}" class="game-invois" loading="lazy">
                <h2>${game.target}</h2>
            </a>
        `;
        gamesList.appendChild(gameItem);
    });
}

// Fungsi untuk membuat pagination
function createPagination(totalItems, itemsPerPage, targetElementId, changePageCallback) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationContainer = document.getElementById(targetElementId);
    paginationContainer.innerHTML = ""; // Kosongkan pagination sebelumnya

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.onclick = () => changePageCallback(i);
        if (i === 1) button.classList.add("active"); // Aktifkan tombol halaman pertama
        paginationContainer.appendChild(button);
    }
}

// Fungsi untuk menangani perubahan halaman
function showAsnPage(page) {
    displayAsnGames(page);

    const paginationButtons = document.querySelectorAll(".pagination button");
    paginationButtons.forEach(button => button.classList.remove("active"));
    paginationButtons[page - 1].classList.add("active");
}

// Tambahkan ini ke dalam DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    displayAsnGames(1); // Tampilkan halaman pertama
    createPagination(asnGames.length, 3, "asn-pagination", showAsnPage);
});
