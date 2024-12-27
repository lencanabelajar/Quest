import { login, signUp, logout, uploadProfilePicture, displayUserProfile } from './airtable.js';

// DOM Elements
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const logoutBtn = document.getElementById("logout-btn");
const userNameDisplay = document.getElementById("username-display");
const loginModal = document.getElementById("modal-login");
const registerModal = document.getElementById("modal-register");
const closeLoginModal = document.querySelector("#modal-login .close");
const closeRegisterModal = document.querySelector("#modal-register .close");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const profileImageInput = document.getElementById("profile-image-input");

// Toggle login modal
loginBtn.addEventListener('click', () => loginModal.style.display = 'block');
registerBtn.addEventListener('click', () => registerModal.style.display = 'block');
closeLoginModal.addEventListener('click', () => loginModal.style.display = 'none');
closeRegisterModal.addEventListener('click', () => registerModal.style.display = 'none');

// Handle login form submission
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = event.target.username.value;
  const password = event.target.password.value;
  try {
    await login(email, password);
    loginModal.style.display = 'none';
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
});

// Handle registration form submission
registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = event.target['new-username'].value;
  const password = event.target['new-password'].value;
  try {
    await signUp(email, password);
    registerModal.style.display = 'none';
  } catch (error) {
    alert('Registration failed: ' + error.message);
  }
});

// Handle logout
logoutBtn.addEventListener('click', async () => {
  try {
    await logout();
    userNameDisplay.innerText = '';
    logoutBtn.style.display = 'none';
    loginBtn.style.display = 'inline';
    registerBtn.style.display = 'inline';
  } catch (error) {
    alert('Logout failed: ' + error.message);
  }
});

// Handle profile image upload
profileImageInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      await uploadProfilePicture(file);
      alert('Profile picture uploaded successfully!');
    } catch (error) {
      alert('Error uploading profile picture: ' + error.message);
    }
  }
});

// Check user login status on page load
window.addEventListener('load', async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    userNameDisplay.innerText = user.username; // Display username
    logoutBtn.style.display = 'inline';  // Show logout button
    loginBtn.style.display = 'none';    // Hide login button
    registerBtn.style.display = 'none'; // Hide register button
    displayUserProfileInfo(user.email);
  } else {
    userNameDisplay.innerText = ''; // Hide username
    logoutBtn.style.display = 'none'; // Hide logout button
    loginBtn.style.display = 'inline'; // Show login button
    registerBtn.style.display = 'inline'; // Show register button
  }
});

// Function to display user profile info
const displayUserProfileInfo = async (email) => {
  try {
    const userData = await displayUserProfile(email);
    document.getElementById("user-email").innerText = userData.email;
    document.getElementById("user-level").innerText = userData.level;
    if (userData.profilePicture) {
      document.getElementById("profile-img").src = userData.profilePicture;
    }
  } catch (error) {
    console.error("Error displaying user profile:", error.message);
  }
};

// Handle pagination for game list (index.html)
const handlePagination = () => {
  const prevBtn = document.querySelector('.pagination button:first-child');
  const nextBtn = document.querySelector('.pagination button:last-child');
  const pageNumberButtons = document.querySelectorAll('.pagination button');

  let currentPage = 1;

  pageNumberButtons.forEach(button => {
    button.addEventListener('click', () => {
      currentPage = parseInt(button.innerText);
      loadGames(currentPage);
    });
  });

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadGames(currentPage);
    }
  });

  nextBtn.addEventListener('click', () => {
    currentPage++;
    loadGames(currentPage);
  });
};

// Function to load the list of games dynamically
const loadGames = (page) => {
  const gamesContainer = document.querySelector('.games-container');
  gamesContainer.innerHTML = ''; // Clear previous games

  const gamesPerPage = 6;
  const start = (page - 1) * gamesPerPage;
  const end = start + gamesPerPage;

  const gamesList = [
    { title: "Fortnite Royal Battle", description: "Aset Pertanian Bronze Level", url: "#" },
    { title: "Game 2", description: "Game description here", url: "#" },
    // More games...
  ];

  const gamesToShow = gamesList.slice(start, end);

  gamesToShow.forEach(game => {
    const gameItem = document.createElement('div');
    gameItem.classList.add('game-item');
    gameItem.innerHTML = `
      <a href="${game.url}" class="game-link">
        <h3>${game.title}</h3>
        <img src="assets/icon/ruby.png" alt="Game Thumbnail" class="game-thumbnail">
        <p>${game.description}</p>
        <p>Online</p>
      </a>
    `;
    gamesContainer.appendChild(gameItem);
  });
};

// Initialize pagination
handlePagination();
