import { handleLogin, handleRegister, handleLogout } from './login.js';
import { handleProfileImageUpload } from './profil.js';
import { loadGames, handlePagination } from './tasks.js';

// DOM Elements
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const logoutBtn = document.getElementById("logout-btn");
const userNameDisplay = document.getElementById("username-display");
const loginModal = document.getElementById("modal-login");
const registerModal = document.getElementById("modal-register");
const closeLoginModal = document.querySelector("#modal-login .close");
const closeRegisterModal = document.querySelector("#modal-register .close");
const profileImageInput = document.getElementById("profile-image-input");

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
});

// Helper function to toggle authentication UI
function toggleAuthUI(isLoggedIn) {
    logoutBtn.style.display = isLoggedIn ? 'inline' : 'none';
    loginBtn.style.display = isLoggedIn ? 'none' : 'inline';
    registerBtn.style.display = isLoggedIn ? 'none' : 'inline';
}

// Event listeners for login and register forms
document.getElementById('login-form').addEventListener('submit', handleLogin);
document.getElementById('register-form').addEventListener('submit', handleRegister);
logoutBtn.addEventListener('click', handleLogout);

// Handle profile image upload
profileImageInput.addEventListener('change', handleProfileImageUpload);

// Load games and initialize pagination
loadGames(1); // Default to page 1
handlePagination(); // Initialize pagination
