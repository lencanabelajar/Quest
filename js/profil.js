// Elemen untuk menampilkan profil pengguna
const userNameDisplay = document.getElementById('username-display');
const profileImageInput = document.getElementById('profile-image-input');
const profileImage = document.getElementById('profile-img');
const logoutBtn = document.getElementById('logout-btn');

// Fungsi untuk mengambil data profil pengguna (menggunakan Netlify Function)
async function getUserProfile(userEmail) {
  try {
    const response = await fetch(`/api/getUserProfile?email=${encodeURIComponent(userEmail)}`);
    if (!response.ok) {
      throw new Error('Error fetching user profile');
    }
    const userProfile = await response.json();
    return userProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

// Fungsi untuk memperbarui gambar profil (menggunakan Netlify Function)
async function uploadProfilePicture(file, userEmail) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('email', userEmail);

  try {
    const response = await fetch('/api/uploadProfilePicture', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Error uploading profile picture');
    }
    alert('Profile picture uploaded successfully!');
    window.location.reload();  // Reload halaman untuk memperbarui gambar profil
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    alert('Error uploading profile picture: ' + error.message);
  }
}

// Fungsi untuk menangani logout
async function logout() {
  sessionStorage.removeItem('userEmail');
  window.location.href = 'login.html'; // Redirect ke halaman login
}

// Fungsi untuk menampilkan profil pengguna
window.addEventListener('load', () => {
  const userEmail = sessionStorage.getItem('userEmail');
  if (userEmail) {
    userNameDisplay.innerText = userEmail.split('@')[0]; // Menampilkan nama pengguna berdasarkan email
    getUserProfile(userEmail)
      .then(userData => {
        if (userData && userData.profilePicture) {
          profileImage.src = userData.profilePicture; // Menampilkan foto profil jika ada
        }
      })
      .catch(error => {
        console.error('Error displaying user profile:', error);
      });
  } else {
    window.location.href = 'login.html'; // Redirect ke halaman login jika pengguna tidak terautentikasi
  }
});

// Fungsi untuk menangani unggahan gambar profil
profileImageInput.addEventListener('change', (event) => {
  const file = event.target.files[0]; // Ambil file gambar yang diunggah
  const userEmail = sessionStorage.getItem('userEmail');
  if (file && userEmail) {
    uploadProfilePicture(file, userEmail);
  }
});

// Fungsi untuk menangani logout
logoutBtn.addEventListener('click', () => {
  logout();
});
