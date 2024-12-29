// Mendapatkan elemen DOM
const usernameDisplay = document.getElementById('username-display');
const logoutBtn = document.getElementById('logout-btn');
const userProfileImage = document.getElementById('profile-picture');
const profilePictureInput = document.getElementById('profile-picture-input');
const gamesContainer = document.querySelector('.games-container');
const loadingIndicator = document.getElementById('loading-indicator'); // Indikator loading

// Fungsi untuk memuat data game secara dinamis dari API atau server
const loadGames = async () => {
  try {
    loadingIndicator.style.display = 'block'; // Tampilkan indikator loading

    // Ambil data game dari API (misalnya Netlify Functions atau database)
    const response = await fetch('/api/getGames');
    if (!response.ok) {
      throw new Error('Gagal memuat data game');
    }
    const gamesData = await response.json();

    // Memasukkan data game ke dalam kontainer
    gamesContainer.innerHTML = ''; // Bersihkan kontainer game lama
    if (gamesData.length === 0) {
      gamesContainer.innerHTML = '<p>Tidak ada game yang tersedia.</p>';
    } else {
      gamesData.forEach(game => {
        const gameItem = document.createElement('div');
        gameItem.classList.add('game-item');
        gameItem.innerHTML = `
          <a href="${game.link}" class="game-link">
            <h3>${game.title}</h3>
            <img src="${game.image}" alt="${game.description}" class="game-thumbnail">
            <p>${game.description}</p>
            <p><strong>Status:</strong> ${game.status}</p>
          </a>
        `;
        gamesContainer.appendChild(gameItem);
      });
    }

    loadingIndicator.style.display = 'none'; // Sembunyikan indikator loading
  } catch (error) {
    console.error('Error loading games:', error);
    alert('Terjadi kesalahan saat memuat game, coba lagi nanti.');
    loadingIndicator.style.display = 'none';
  }
};

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
    window.location.href = '/html/login.html';  // Pastikan path yang benar
  }
};

// Fungsi logout
logoutBtn?.addEventListener('click', () => {
  localStorage.removeItem('user'); // Hapus data pengguna dari localStorage
  window.location.href = '/html/login.html';  // Arahkan ke halaman login setelah logout
});

// Fungsi untuk memperbarui gambar profil
const handleProfilePictureChange = async (event) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const file = event.target.files[0]; // Ambil file yang diupload

  if (user && file) {
    try {
      loadingIndicator.style.display = 'block'; // Tampilkan indikator loading

      // Simulasi upload gambar ke server atau penyimpanan cloud
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/uploadProfilePicture', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Gagal mengunggah gambar profil');
      }

      const updatedUser = { ...user, profilePicture: await response.text() }; // Mendapatkan URL gambar dari server
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Simpan perubahan
      userProfileImage.src = updatedUser.profilePicture; // Update gambar profil di halaman

      loadingIndicator.style.display = 'none'; // Sembunyikan indikator loading
    } catch (error) {
      console.error("Error uploading profile picture:", error.message);
      alert('Gagal mengunggah gambar profil. Silakan coba lagi.');
      loadingIndicator.style.display = 'none';
    }
  } else {
    alert('File tidak valid atau pengguna tidak ditemukan.');
  }
};

// Menangani perubahan gambar profil (misalnya, input file)
profilePictureInput?.addEventListener('change', handleProfilePictureChange);

// Panggil fungsi untuk memeriksa status pengguna saat halaman dimuat
checkUserStatus();

// Muat game saat halaman dimuat
loadGames();
