// Import Firebase functions from firebase.js
import { signUp, login, logout, uploadProfilePicture, displayUserProfile } from './firebase.js';

// Elements from the HTML
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

// Open login modal
loginBtn.addEventListener('click', () => {
  loginModal.style.display = 'block';
});

// Open register modal
registerBtn.addEventListener('click', () => {
  registerModal.style.display = 'block';
});

// Close login modal
closeLoginModal.addEventListener('click', () => {
  loginModal.style.display = 'none';
});

// Close register modal
closeRegisterModal.addEventListener('click', () => {
  registerModal.style.display = 'none';
});

// Handle login form submission
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = event.target.username.value;
  const password = event.target.password.value;
  login(email, password)
    .then(() => {
      loginModal.style.display = 'none';  // Close modal after login
    })
    .catch(error => {
      alert('Login failed: ' + error.message);  // Show error message
    });
});

// Handle register form submission
registerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = event.target['new-username'].value;
  const password = event.target['new-password'].value;
  signUp(email, password)
    .then(() => {
      registerModal.style.display = 'none';  // Close modal after registration
    })
    .catch(error => {
      alert('Registration failed: ' + error.message);  // Show error message
    });
});

// Handle logout
logoutBtn.addEventListener('click', () => {
  logout()
    .then(() => {
      userNameDisplay.innerText = ""; // Clear user info
      logoutBtn.style.display = 'none';  // Hide logout button
      loginBtn.style.display = 'inline'; // Show login button
      registerBtn.style.display = 'inline'; // Show register button
    })
    .catch(error => {
      alert('Logout failed: ' + error.message);  // Show error message
    });
});

// Handle profile image upload
profileImageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadProfilePicture(file)
      .then(() => {
        alert('Profile picture uploaded successfully!');
      })
      .catch(error => {
        alert('Error uploading profile picture: ' + error.message);
      });
  }
});

// Display user information on the dashboard
window.addEventListener('load', () => {
  const user = firebase.auth().currentUser;
  if (user) {
    userNameDisplay.innerText = user.email.split('@')[0]; // Display username as part of the email
    logoutBtn.style.display = 'inline';  // Show logout button
    loginBtn.style.display = 'none';    // Hide login button
    registerBtn.style.display = 'none'; // Hide register button
    displayUserProfile(user.uid); // Load user profile data
  } else {
    userNameDisplay.innerText = ""; // Hide username if not logged in
    logoutBtn.style.display = 'none';  // Hide logout button
    loginBtn.style.display = 'inline'; // Show login button
    registerBtn.style.display = 'inline'; // Show register button
  }
});

// Example to display user profile image and details
const displayUserProfileInfo = (userId) => {
  displayUserProfile(userId).then(userData => {
    if (userData) {
      // Show user info
      document.getElementById("user-email").innerText = userData.email;
      document.getElementById("user-level").innerText = userData.level;
      // Display profile image if available
      if (userData.profilePicture) {
        document.getElementById("profile-img").src = userData.profilePicture;
      }
    }
  }).catch(error => {
    console.error("Error displaying user profile:", error.message);
  });
};

// Example usage for leaderboards and game statistics, to display in leaderboard.html
const updateLeaderboard = () => {
  // Logic to update leaderboard, e.g. fetching data from Firestore
  const leaderboardRef = firebase.firestore().collection('leaderboards');
  leaderboardRef.get().then(snapshot => {
    snapshot.forEach(doc => {
      const user = doc.data();
      const leaderboardElement = document.createElement('div');
      leaderboardElement.innerHTML = `
        <p>${user.username}: ${user.score} points</p>
      `;
      document.getElementById('leaderboard-list').appendChild(leaderboardElement);
    });
  }).catch(error => {
    console.error("Error fetching leaderboard data: ", error);
  });
};

// Example function to handle pagination in game list (index.html)
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

// Function to load the list of games based on the current page
const loadGames = (page) => {
  // Example: load games for the current page (pagination logic)
  const gamesContainer = document.querySelector('.games-container');
  gamesContainer.innerHTML = ''; // Clear previous games

  // Fetch and display the games for the selected page
  const gamesPerPage = 6;
  const start = (page - 1) * gamesPerPage;
  const end = start + gamesPerPage;
  
  // Example list of games, replace this with actual data fetching logic
  const gamesList = [
    { title: "Fortnite Royal Battle", description: "Aset Pertanian Bronze Level", url: "#" },
    { title: "Game 2", description: "Game description here", url: "#" },
    // Add more games...
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
