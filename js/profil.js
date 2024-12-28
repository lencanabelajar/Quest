// Elemen untuk menampilkan profil pengguna
const userNameDisplay = document.getElementById('username-display');
const profileImageInput = document.getElementById('profile-image-input');
const profileImage = document.getElementById('profile-img');
const logoutBtn = document.getElementById('logout-btn');

// Fungsi untuk mengambil data profil pengguna (misalnya dari sessionStorage atau API)
function getUserProfile(userEmail) {
  // Mengambil data profil dari sessionStorage atau localStorage
  return new Promise((resolve, reject) => {
    const userProfile = JSON.parse(localStorage.getItem(userEmail)); // Mengambil data pengguna berdasarkan email
    if (userProfile) {
      resolve(userProfile); // Kembalikan data pengguna jika ditemukan
    } else {
      reject(new Error('Profile not found.'));
    }
  });
}

// Fungsi untuk memperbarui gambar profil
function uploadProfilePicture(file, userEmail) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const profilePictureUrl = reader.result; // Mendapatkan URL gambar setelah di-upload
      let userProfile = JSON.parse(localStorage.getItem(userEmail)) || {}; // Ambil data profil pengguna atau buat objek baru
      userProfile.profilePicture = profilePictureUrl; // Perbarui gambar profil
      localStorage.setItem(userEmail, JSON.stringify(userProfile)); // Simpan data profil baru ke localStorage
      resolve(); // Sukses
    };
    reader.onerror = () => {
      reject(new Error('Error reading file.'));
    };
    reader.readAsDataURL(file); // Membaca file gambar sebagai data URL
  });
}

// Fungsi untuk menangani login/logout
function logout() {
  return new Promise((resolve) => {
    // Hapus data pengguna dari sessionStorage
    sessionStorage.removeItem('userEmail');
    resolve(); // Selesai
  });
}

// Fungsi untuk menampilkan profil pengguna
window.addEventListener('load', () => {
  // Cek apakah pengguna sudah login (misalnya, menggunakan sessionStorage atau cookies untuk mengidentifikasi sesi pengguna)
  const userEmail = sessionStorage.getItem('userEmail'); // Contoh menggunakan sessionStorage untuk menyimpan email pengguna yang sudah login
  if (userEmail) {
    userNameDisplay.innerText = userEmail.split('@')[0]; // Menampilkan nama pengguna berdasarkan email
    getUserProfile(userEmail)
      .then(userData => {
        if (userData && userData.profilePicture) {
          profileImage.src = userData.profilePicture; // Menampilkan foto profil jika ada
        }
      })
      .catch(error => {
        console.error('Error displaying user profile:', error.message);
      });
  } else {
    window.location.href = 'login.html'; // Redirect ke halaman login jika pengguna tidak terautentikasi
  }
});

// Fungsi untuk menangani unggahan gambar profil
profileImageInput.addEventListener('change', (event) => {
  const file = event.target.files[0]; // Ambil file gambar yang diunggah
  const userEmail = sessionStorage.getItem('userEmail'); // Ambil email pengguna yang sedang login
  if (file && userEmail) {
    uploadProfilePicture(file, userEmail)  // Kirim email pengguna agar dapat menyimpan gambar yang tepat
      .then(() => {
        alert('Profile picture uploaded successfully!');
        window.location.reload();  // Reload halaman untuk memperbarui gambar profil
      })
      .catch(error => {
        alert('Error uploading profile picture: ' + error.message);
      });
  }
});

// Fungsi untuk menangani logout
logoutBtn.addEventListener('click', () => {
  sessionStorage.removeItem('userEmail'); // Hapus data pengguna dari sessionStorage
  logout()
    .then(() => {
      window.location.href = 'login.html'; // Redirect ke halaman login setelah logout berhasil
    })
    .catch(error => {
      alert('Logout failed: ' + error.message);  // Menampilkan pesan error jika logout gagal
    });
});
