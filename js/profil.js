import { displayUserProfile, uploadProfilePicture, logout } from './airtable.js';

// Elemen untuk menampilkan profil pengguna
const userNameDisplay = document.getElementById('username-display');
const profileImageInput = document.getElementById('profile-image-input');
const profileImage = document.getElementById('profile-img');
const logoutBtn = document.getElementById('logout-btn');

// Fungsi untuk menampilkan profil pengguna
window.addEventListener('load', () => {
  const user = firebase.auth().currentUser;  // Memeriksa apakah pengguna sudah login
  if (user) {
    userNameDisplay.innerText = user.email.split('@')[0];  // Tampilkan nama pengguna berdasarkan email
    displayUserProfile(user.uid).then(userData => {
      if (userData && userData.profilePicture) {
        profileImage.src = userData.profilePicture;  // Menampilkan foto profil jika ada
      }
    }).catch(error => {
      console.error('Error displaying user profile:', error.message);
    });
  } else {
    window.location.href = 'login.html';  // Redirect ke halaman login jika pengguna tidak terautentikasi
  }
});

// Fungsi untuk menangani unggahan gambar profil
profileImageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];  // Ambil file gambar yang diunggah
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

// Fungsi untuk menangani logout
logoutBtn.addEventListener('click', () => {
  logout()
    .then(() => {
      window.location.href = 'login.html';  // Redirect ke halaman login setelah logout berhasil
    })
    .catch(error => {
      alert('Logout failed: ' + error.message);  // Menampilkan pesan error jika logout gagal
    });
});
