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

// Toggle login modal
loginBtn.addEventListener('click', () => loginModal.style.display = 'block');
registerBtn.addEventListener('click', () => registerModal.style.display = 'block');
closeLoginModal.addEventListener('click', () => loginModal.style.display = 'none');
closeRegisterModal.addEventListener('click', () => registerModal.style.display = 'none');

// Initialize pagination
handlePagination();

// Check user login status on page load
window.addEventListener('load', async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    userNameDisplay.innerText = user.username; // Display username
    logoutBtn.style.display = 'inline';  // Show logout button
    loginBtn.style.display = 'none';    // Hide login button
    registerBtn.style.display = 'none'; // Hide register button
  } else {
    userNameDisplay.innerText = ''; // Hide username
    logoutBtn.style.display = 'none'; // Hide logout button
    loginBtn.style.display = 'inline'; // Show login button
    registerBtn.style.display = 'inline'; // Show register button
  }
});

// Event listeners for login and register
document.getElementById('login-form').addEventListener('submit', handleLogin);
document.getElementById('register-form').addEventListener('submit', handleRegister);
logoutBtn.addEventListener('click', handleLogout);

// Handle profile image upload
profileImageInput.addEventListener('change', handleProfileImageUpload);

// Load games
loadGames(1); // Default to page 1
