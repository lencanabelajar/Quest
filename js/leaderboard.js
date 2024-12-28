// Elemen untuk menampilkan leaderboard
const leaderboardBody = document.getElementById('leaderboard-body');
const sortButton = document.getElementById('sort-button'); // Tombol untuk mengurutkan leaderboard
const filterInput = document.getElementById('filter-input'); // Input untuk filter leaderboard

// Fungsi untuk memuat leaderboard dari API eksternal atau server
const loadLeaderboard = async () => {
  try {
    // Menampilkan indikator loading sebelum data dimuat
    leaderboardBody.innerHTML = '<tr><td colspan="3">Memuat data...</td></tr>';

    // Ambil data leaderboard dari API (misalnya menggunakan fetch)
    const response = await fetch('/api/getLeaderboard');  // Ganti dengan URL API Anda
    const leaderboardData = await response.json();  // Mengambil data leaderboard

    if (leaderboardData.length === 0) {
      leaderboardBody.innerHTML = '<tr><td colspan="3">Papan peringkat kosong.</td></tr>';
      return;
    }

    // Menambahkan data leaderboard ke dalam tabel
    leaderboardBody.innerHTML = ''; // Bersihkan konten tabel terlebih dahulu
    leaderboardData.forEach((entry, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${entry.name}</td>
        <td>${entry.points}</td>
      `;
      leaderboardBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading leaderboard:', error);
    leaderboardBody.innerHTML = '<tr><td colspan="3">Gagal memuat data leaderboard. Coba lagi nanti.</td></tr>';
  }
};

// Fungsi untuk mengurutkan leaderboard berdasarkan poin
const sortLeaderboard = () => {
  const rows = Array.from(leaderboardBody.querySelectorAll('tr'));
  const sortedRows = rows.slice(1).sort((a, b) => {
    const pointsA = parseInt(a.cells[2].textContent);
    const pointsB = parseInt(b.cells[2].textContent);
    return pointsB - pointsA; // Urutkan dari poin tertinggi ke terendah
  });

  // Menambahkan kembali baris yang sudah diurutkan
  leaderboardBody.innerHTML = '';
  sortedRows.forEach(row => leaderboardBody.appendChild(row));
};

// Fungsi untuk memfilter leaderboard berdasarkan input
const filterLeaderboard = () => {
  const filterText = filterInput.value.toLowerCase();
  const rows = Array.from(leaderboardBody.querySelectorAll('tr'));

  rows.forEach(row => {
    const nameCell = row.cells[1];
    if (nameCell) {
      const name = nameCell.textContent.toLowerCase();
      row.style.display = name.includes(filterText) ? '' : 'none';
    }
  });
};

// Mengikat event listener untuk tombol urutkan
sortButton?.addEventListener('click', sortLeaderboard);

// Mengikat event listener untuk input filter
filterInput?.addEventListener('input', filterLeaderboard);

// Memuat leaderboard saat halaman dimuat
window.addEventListener('load', loadLeaderboard);
