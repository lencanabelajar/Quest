import { displayUserProfile, uploadProfilePicture, logout } from './firebase.js';

// Elements for displaying user profile
const userNameDisplay = document.getElementById('username-display');
const profileImageInput = document.getElementById('profile-image-input');
const profileImage = document.getElementById('profile-img');
const logoutBtn = document.getElementById('logout-btn');

// Display user profile info
window.addEventListener('load', () => {
  const user = firebase.auth().currentUser;
  if (user) {
    userNameDisplay.innerText = user.email.split('@')[0];
    displayUserProfile(user.uid).then(userData => {
      if (userData && userData.profilePicture) {
        profileImage.src = userData.profilePicture;
      }
    });
  } else {
    window.location.href = 'login.html';  // Redirect to login if not logged in
  }
});

// Handle profile image upload
profileImageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadProfilePicture(file);
  }
});

// Handle logout
logoutBtn.addEventListener('click', () => {
  logout()
    .then(() => {
      window.location.href = 'login.html';  // Redirect to login page after logout
    })
    .catch(error => {
      alert('Logout failed: ' + error.message);
    });
});
