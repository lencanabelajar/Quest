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

const tasksPerPage = 10;
let currentPage = 1;
const taskData = [...];  // Your task data array

function showPage(page) {
    const start = (page - 1) * tasksPerPage;
    const end = start + tasksPerPage;
    const tasksToShow = taskData.slice(start, end);

    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    tasksToShow.forEach(task => {
        const taskElement = createTask(task.judul, task.link, task.kategori, task.icon);
        taskList.innerHTML += taskElement;
    });

    currentPage = page;
}

showPage(currentPage);  // Initial page load
