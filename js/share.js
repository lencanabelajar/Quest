// Elemen untuk tombol berbagi sertifikat dan badge
const shareCertificateBtn = document.getElementById('share-certificate-btn');
const shareBadgeBtn = document.getElementById('share-badge-btn');

// Fungsi untuk berbagi sertifikat
async function shareCertificate() {
  try {
    const response = await fetch('/api/shareCertificate', { method: 'POST' });
    if (!response.ok) {
      throw new Error('Error sharing certificate');
    }
    alert('Sertifikat berhasil dibagikan!');
  } catch (error) {
    console.error('Error saat membagikan sertifikat:', error);
    alert('Gagal membagikan sertifikat: ' + error.message);
  }
}

// Fungsi untuk berbagi badge
async function shareBadge() {
  try {
    const response = await fetch('/api/shareBadge', { method: 'POST' });
    if (!response.ok) {
      throw new Error('Error sharing badge');
    }
    alert('Badge berhasil dibagikan!');
  } catch (error) {
    console.error('Error saat membagikan badge:', error);
    alert('Gagal membagikan badge: ' + error.message);
  }
}

// Mengikat event listener untuk berbagi sertifikat dan badge
shareCertificateBtn.addEventListener('click', shareCertificate);
shareBadgeBtn.addEventListener('click', shareBadge);
