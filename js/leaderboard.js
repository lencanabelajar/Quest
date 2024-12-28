// Elemen untuk menampilkan leaderboard
const leaderboardBody = document.getElementById('leaderboard-body');

// Data leaderboard statis (misalnya bisa dari file JSON atau API eksternal)
const leaderboardData = [
  { name: "User1", points: 1500 },
  { name: "User2", points: 1400 },
  { name: "User3", points: 1300 },
  { name: "User4", points: 1200 },
  { name: "User5", points: 1100 }
];

// Fungsi untuk memuat leaderboard
function loadLeaderboard() {
  if (leaderboardData.length === 0) {
    leaderboardBody.innerHTML = '<tr><td colspan="3">Papan peringkat kosong.</td></tr>';
    return;
  }

  // Menambahkan data leaderboard ke dalam tabel
  leaderboardData.forEach((entry, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.name}</td>
      <td>${entry.points}</td>
    `;
    leaderboardBody.appendChild(row);
  });
}

// Memuat leaderboard saat halaman dimuat
window.addEventListener('load', loadLeaderboard);
