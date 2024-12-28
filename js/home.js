// Mendapatkan elemen DOM
const usernameDisplay = document.getElementById('username-display');
const logoutBtn = document.getElementById('logout-btn');
const userProfileImage = document.getElementById('profile-picture');
const profilePictureInput = document.getElementById('profile-picture-input');
const gamesContainer = document.querySelector('.games-container');
const loadingIndicator = document.getElementById('loading-indicator'); // Indikator loading

// Fungsi untuk memuat data game secara dinamis
const loadGames = () => {
  try {
    // Menampilkan indikator loading sebelum data dimuat
    loadingIndicator.style.display = 'block'; // Tampilkan indikator loading

    // Data game simulasi, Anda bisa menambahkannya sesuai kebutuhan
    const gamesData = [
      {
        title: "Fortnite Royal Battle",
        image: "../assets/icon/ruby.png",
        description: "Aset Pertanian Bronze Level",
        status: "Online",
        link: "https://hariyanto89.github.io/Quest/tasks/asetpertanianbronze.html"
      },
      {
        title: "Game Edukasi 1",
        image: "../assets/icon/ruby.png",
        description: "Tantangan Level 1",
        status: "Online",
        link: "https://hariyanto89.github.io/Quest/tasks/asetpertanianbronze.html"
      },
      {
        title: "Game Edukasi 2",
        image: "../assets/icon/ruby.png",
        description: "Tantangan Level 2",
        status: "Offline",
        link: "https://hariyanto89.github.io/Quest/tasks/asetpertanianbronze.html"
      },
    ];

    // Memasukkan data game ke dalam kontainer
    gamesData.forEach(game => {
      const gameItem = document.createElement('div');
      gameItem.classList.add('game-item');
      gameItem.innerHTML = `
        <a href="${game.link}" class="game-link">
          <h3>${game.title}</h3>
          <img src="${game.image}" alt="${game.description}" class="game-thumbnail">
          <p>${game.description}</p>
          <p>${game.status}</p>
        </a>
      `;
      gamesContainer.appendChild(gameItem);
    });

    // Menyembunyikan indikator loading setelah data dimuat
    loadingIndicator.style.display = 'none'; // Sembunyikan indikator loading
  } catch (error) {
    console.error('Error loading games:', error);
    alert('Terjadi kesalahan saat memuat game, coba lagi nanti.');

    // Menyembunyikan indikator loading setelah error
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
    window.location.href = '/html/index.html';  // Pastikan path yang benar
  }
};

// Fungsi logout
logoutBtn?.addEventListener('click', () => {
  localStorage.removeItem('user'); // Hapus data pengguna dari localStorage
  window.location.href = '/html/index.html';  // Arahkan ke halaman login setelah logout
});

// Fungsi untuk memperbarui gambar profil
const handleProfilePictureChange = (event) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const file = event.target.files[0]; // Ambil file yang diupload

  if (user && file) {
    try {
      // Menampilkan indikator loading
      loadingIndicator.style.display = 'block'; // Tampilkan indikator loading

      // Simulasi upload gambar ke server atau penyimpanan cloud
      const updatedUser = { ...user, profilePicture: URL.createObjectURL(file) }; // Simulasi update data

      // Update data pengguna di localStorage dan tampilkan gambar profil baru
      localStorage.setItem('user', JSON.stringify(updatedUser)); 
      userProfileImage.src = updatedUser.profilePicture; // Update gambar profil di halaman

      // Menyembunyikan indikator loading setelah proses selesai
      loadingIndicator.style.display = 'none';
    } catch (error) {
      console.error("Error uploading profile picture:", error.message);
      alert('Gagal mengunggah gambar profil. Silakan coba lagi.');

      // Menyembunyikan indikator loading setelah proses selesai
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
