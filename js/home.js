// Import fungsi dari airtable.js
import { logout, uploadProfilePicture, updateUserLevel } from './airtable.js';  // Pastikan jalur ini benar

// Mendapatkan elemen DOM
const usernameDisplay = document.getElementById('username-display');
const logoutBtn = document.getElementById('logout-btn');
const userProfileImage = document.getElementById('profile-picture');

// Cek jika pengguna sudah login
const checkUserStatus = () => {
  const user = JSON.parse(localStorage.getItem('user')); // Ambil data pengguna dari localStorage
  if (user) {
    usernameDisplay.innerText = user.username; // Menampilkan nama pengguna
    if (user.profilePicture) {
      userProfileImage.src = user.profilePicture; // Menampilkan gambar profil
    }
    logoutBtn.style.display = 'inline'; // Tampilkan tombol logout
  } else {
    // Jika tidak ada pengguna yang terautentikasi, arahkan ke halaman login
    window.location.href = 'index.html';
  }
};

// Fungsi logout
logoutBtn?.addEventListener('click', () => {
  logout(); // Panggil fungsi logout dari airtable.js
  window.location.href = 'index.html'; // Arahkan ke halaman login setelah logout
});

// Fungsi untuk memperbarui gambar profil
const handleProfilePictureChange = async (event) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const file = event.target.files[0]; // Ambil file yang diupload

  if (user && file) {
    try {
      // Upload gambar ke Cloudinary dan update di Airtable
      const updatedUser = await uploadProfilePicture(file, user.email);
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Update data pengguna di localStorage
      userProfileImage.src = updatedUser.profilePicture; // Update gambar profil di halaman
    } catch (error) {
      console.error("Error uploading profile picture:", error.message);
    }
  }
};

// Menangani perubahan gambar profil (misalnya, input file)
const profilePictureInput = document.getElementById('profile-picture-input');
profilePictureInput?.addEventListener('change', handleProfilePictureChange);

// Panggil fungsi untuk memeriksa status pengguna saat halaman dimuat
checkUserStatus();
