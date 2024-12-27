// Mengimpor fungsi dari airtable.js
import { getLeaderboardData } from './airtable.js';

// Elemen untuk menampilkan leaderboard
const leaderboardBody = document.getElementById('leaderboard-body');

// Memuat leaderboard saat halaman dimuat
window.addEventListener('load', () => {
  getLeaderboardData()
    .then(leaderboard => {
      if (leaderboard.length === 0) {
        leaderboardBody.innerHTML = '<tr><td colspan="3">Papan peringkat kosong.</td></tr>';
        return;
      }

      // Menambahkan data leaderboard ke dalam tabel
      leaderboard.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${entry.name}</td>
          <td>${entry.points}</td>
        `;
        leaderboardBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error memuat leaderboard:', error);
      leaderboardBody.innerHTML = '<tr><td colspan="3">Gagal memuat papan peringkat.</td></tr>';
    });
});
