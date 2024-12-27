// Import fungsi untuk berbagi sertifikat dan badge dari airtable.js
import { shareCertificate, shareBadge } from './airtable.js';

// Elemen untuk tombol berbagi sertifikat dan badge
const shareCertificateBtn = document.getElementById('share-certificate-btn');
const shareBadgeBtn = document.getElementById('share-badge-btn');

// Fungsi untuk berbagi sertifikat
shareCertificateBtn.addEventListener('click', () => {
  shareCertificate()
    .then(() => {
      alert('Sertifikat berhasil dibagikan!'); // Memberitahu keberhasilan
    })
    .catch(error => {
      console.error('Error saat membagikan sertifikat: ', error); // Log error untuk debugging
      alert('Gagal membagikan sertifikat: ' + error.message); // Memberitahu kegagalan
    });
});

// Fungsi untuk berbagi badge
shareBadgeBtn.addEventListener('click', () => {
  shareBadge()
    .then(() => {
      alert('Badge berhasil dibagikan!'); // Memberitahu keberhasilan
    })
    .catch(error => {
      console.error('Error saat membagikan badge: ', error); // Log error untuk debugging
      alert('Gagal membagikan badge: ' + error.message); // Memberitahu kegagalan
    });
});
