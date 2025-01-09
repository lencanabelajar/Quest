import { handleLogin, handleRegister, handleLogout } from './login.js';
import { handleProfileImageUpload } from './profil.js';
import { loadGames, handlePagination } from './tasks.js';

// DOM Elements
const loginBtn = document.getElementById("login-link");
const registerBtn = document.getElementById("register-link");
const logoutBtn = document.getElementById("logout-btn");
const userNameDisplay = document.getElementById("username-display");
const loginModal = document.getElementById("modal-login");
const registerModal = document.getElementById("modal-register");
const closeLoginModal = document.querySelector("#modal-login .close");
const closeRegisterModal = document.querySelector("#modal-register .close");
const profileImageInput = document.getElementById("profile-image-input");
const spinner = document.getElementById("spinner");  // Spinner gif element

// Event listener functions
function toggleModal(modal, displayStyle) {
    modal.style.display = displayStyle;
}

// Initialize Modals
loginBtn.addEventListener('click', () => toggleModal(loginModal, 'block'));
registerBtn.addEventListener('click', () => toggleModal(registerModal, 'block'));
closeLoginModal.addEventListener('click', () => toggleModal(loginModal, 'none'));
closeRegisterModal.addEventListener('click', () => toggleModal(registerModal, 'none'));

// Check user login status on page load
window.addEventListener('load', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        userNameDisplay.innerText = user.username;
        toggleAuthUI(true);  // Show logged-in UI
    } else {
        userNameDisplay.innerText = '';
        toggleAuthUI(false); // Show logged-out UI
    }

    // Show the loading spinner while games are loading
    showSpinner(true);
    loadGames(1)  // Load games for page 1
        .then(() => {
            showSpinner(false); // Hide spinner once games are loaded
        })
        .catch((err) => {
            console.error("Error loading games:", err);
            showSpinner(false); // Hide spinner in case of error
        });
});

// Helper function to toggle authentication UI
function toggleAuthUI(isLoggedIn) {
    logoutBtn.style.display = isLoggedIn ? 'inline' : 'none';
    loginBtn.style.display = isLoggedIn ? 'none' : 'inline';
    registerBtn.style.display = isLoggedIn ? 'none' : 'inline';
}

// Helper function to show/hide loading spinner
function showSpinner(show) {
    spinner.style.display = show ? 'block' : 'none';
}

// Event listeners for login and register forms
document.getElementById('login-form').addEventListener('submit', handleLogin);
document.getElementById('register-form').addEventListener('submit', handleRegister);
logoutBtn.addEventListener('click', handleLogout);

// Handle profile image upload
profileImageInput.addEventListener('change', handleProfileImageUpload);

// Load games and initialize pagination
handlePagination(); // Initialize pagination for dynamic loading

// Daftar task yang akan ditampilkan di halaman
const taskData = [
    { judul: 'Pengantar Sosiologi', link: '../html/tasks/sosiologi1', kategori: 'Pelajar-Mahasiswa', icon: 'ruby.png' },
    { judul: 'Pengantar Sejarah', link: '../html/tasks/sejarah1', kategori: 'Pelajar-Mahasiswa', icon: 'ruby.png' },
    { judul: 'Pengantar Ekonomi', link: '../html/tasks/ekonomi1', kategori: 'Pelajar-Mahasiswa', icon: 'ruby.png' },
    { judul: 'Cooming Soon', link: 'tasks/coomingsoon.html', kategori: 'Cooming-Soon', icon: 'ruby.png' },
    { judul: 'Cooming Soon', link: 'tasks/coomingsoon.html', kategori: 'Cooming-Soon', icon: 'ruby.png' },
    { judul: 'Cooming Soon', link: 'tasks/coomingsoon.html', kategori: 'Cooming-Soon', icon: 'ruby.png' },
];

// Jumlah task yang ditampilkan per halaman
const tasksPerPage = 3;

// Halaman yang sedang aktif
let currentPage = 1;

// Fungsi untuk menampilkan halaman task
function showPage(page) {
    const start = (page - 1) * tasksPerPage;
    const end = start + tasksPerPage;
    const tasksToShow = taskData.slice(start, end);

    const taskList = document.getElementById('student-games-list');
    taskList.innerHTML = ''; // Clear previous task list

    tasksToShow.forEach(task => {
        const taskElement = createTask(task.judul, task.link, task.kategori, task.icon);
        taskList.appendChild(taskElement); // Append new task using appendChild
    });

    // Update pagination
    updatePagination();
    currentPage = page;
}

// Fungsi untuk membuat elemen task
function createTask(judul, link, kategori, icon) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('game-item');

    const taskLink = document.createElement('a');
    taskLink.href = link;
    taskLink.classList.add('game-info');

    const taskTitle = document.createElement('h3');
    taskTitle.textContent = judul;

    const taskImage = document.createElement('img');
    taskImage.src = `../assets/icon/${icon}`;
    taskImage.alt = judul;
    taskImage.classList.add('game-invois');
    taskImage.loading = 'lazy';

    const taskCategory = document.createElement('h2');
    taskCategory.textContent = kategori;

    taskLink.appendChild(taskTitle);
    taskLink.appendChild(taskImage);
    taskLink.appendChild(taskCategory);
    taskElement.appendChild(taskLink);

    return taskElement;
}

// Fungsi untuk memperbarui tombol pagination
function updatePagination() {
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = ''; // Clear pagination buttons

    const totalPages = Math.ceil(taskData.length / tasksPerPage);
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
    showPage(1);
});

// Fungsi untuk memuat data game
function loadGames(page) {
    // Misalnya Anda mendapatkan data game dari API atau data statis
    return fetch(`path_to_your_data?page=${page}`)
        .then(response => response.json())
        .then(data => {
            taskData = data; // Assign data to taskData
            showPage(page);  // Pastikan halaman yang sesuai ditampilkan setelah data dimuat
        })
        .catch(error => console.error("Error loading games:", error));
}

// Call loadGames when the page loads
window.addEventListener('load', () => {
    loadGames(currentPage)  // Memuat data untuk halaman pertama
        .then(() => {
            showPage(currentPage);  // Pastikan halaman pertama ditampilkan setelah data dimuat
        })
        .catch(error => console.error("Error loading games:", error));
});
