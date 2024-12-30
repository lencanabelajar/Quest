// Elemen untuk menampilkan profil pengguna
const userNameDisplay = document.getElementById('username-display');
const profileImageInput = document.getElementById('profile-image-input');
const profileImage = document.getElementById('profile-img');
const logoutBtn = document.getElementById('logout-btn');

// Fungsi untuk mengambil data profil pengguna dari localStorage
function getUserProfile() {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userEmail = sessionStorage.getItem('userEmail'); // Ambil email pengguna yang login
  
  // Cari pengguna berdasarkan email
  const user = users.find(u => u.email === userEmail);
  
  return user || null; // Kembalikan data pengguna atau null jika tidak ditemukan
}

// Fungsi untuk memperbarui gambar profil
function uploadProfilePicture(file) {
  const userEmail = sessionStorage.getItem('userEmail');
  if (!userEmail || !file) {
    alert('Pengguna tidak terautentikasi atau file tidak valid');
    return;
  }

  // Membaca file gambar sebagai base64
  const reader = new FileReader();
  reader.onloadend = () => {
    const profileImageURL = reader.result; // URL base64 gambar
    updateProfilePictureInStorage(profileImageURL);
  };
  reader.readAsDataURL(file); // Membaca file gambar
}

// Fungsi untuk memperbarui gambar profil di localStorage
function updateProfilePictureInStorage(profileImageURL) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userEmail = sessionStorage.getItem('userEmail');
  
  // Cari pengguna berdasarkan email
  const userIndex = users.findIndex(u => u.email === userEmail);
  
  if (userIndex !== -1) {
    // Perbarui gambar profil
    users[userIndex].profileImage = profileImageURL;
    localStorage.setItem('users', JSON.stringify(users)); // Simpan ke localStorage
    alert('Foto profil berhasil diunggah!');
    window.location.reload(); // Reload halaman untuk menampilkan gambar terbaru
  } else {
    alert('Pengguna tidak ditemukan');
  }
}

// Fungsi untuk menangani logout
function logout() {
  sessionStorage.removeItem('userEmail');
  window.location.href = 'login.html'; // Redirect ke halaman login
}

// Fungsi untuk menampilkan profil pengguna saat halaman dimuat
function loadUserProfile() {
  const userEmail = sessionStorage.getItem('userEmail');
  
  if (userEmail) {
    userNameDisplay.innerText = userEmail.split('@')[0]; // Menampilkan nama pengguna berdasarkan email
    const userProfile = getUserProfile();
    
    if (userProfile) {
      if (userProfile.profileImage) {
        profileImage.src = userProfile.profileImage; // Menampilkan foto profil jika ada
      } else {
        profileImage.src = './assets/default-profile.png'; // Path gambar default jika tidak ada gambar profil
      }
    } else {
      alert('Data profil tidak ditemukan');
      window.location.href = 'login.html'; // Mengarahkan pengguna ke halaman login jika profil tidak ditemukan
    }
  } else {
    window.location.href = 'login.html'; // Redirect ke halaman login jika pengguna tidak terautentikasi
  }
}

// Event listener untuk menangani unggahan gambar profil
profileImageInput.addEventListener('change', (event) => {
  const file = event.target.files[0]; // Ambil file gambar yang diunggah
  if (file) {
    uploadProfilePicture(file);
  }
});

// Event listener untuk menangani logout
logoutBtn.addEventListener('click', () => {
  logout();
});

// Memuat profil pengguna saat halaman dimuat
window.addEventListener('load', () => {
  loadUserProfile();
});
