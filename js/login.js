// Import fungsi login dari airtable.js
import { login } from './airtable.js';  // Sesuaikan dengan lokasi airtable.js Anda

// Tangani pengiriman form
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Mencegah form untuk submit secara default

    // Ambil nilai dari input form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validasi form: Pastikan email dan password diisi
    if (!email || !password) {
        showError('Harap isi semua kolom!');
        return;
    }

    // Validasi email menggunakan regex (format email yang valid)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Format email tidak valid!');
        return;
    }

    // Tampilkan loading spinner saat proses login berjalan
    document.getElementById('loading-spinner').style.display = 'block';

    // Proses login menggunakan fungsi login dari airtable.js
    login(email, password)
        .then(user => {
            // Menyimpan informasi pengguna (jika dibutuhkan) ke localStorage atau sessionStorage
            sessionStorage.setItem('userEmail', email);  // Anda bisa menyimpan lebih banyak data pengguna jika perlu

            // Redirect setelah login berhasil
            console.log("Login berhasil! Menuju halaman utama.");
            window.location.href = '/html/home.html';  // Ganti dengan halaman home Anda
        })
        .catch(error => {
            console.error("Login gagal:", error.message);
            showError(`Gagal login: ${error.message}`);
        })
        .finally(() => {
            // Sembunyikan loading spinner setelah proses selesai
            document.getElementById('loading-spinner').style.display = 'none';
        });
});

// Fungsi untuk menampilkan pesan error
function showError(message) {
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.innerText = message;
    errorMessageElement.style.display = 'block';
}

// Fungsi untuk menghapus pesan error ketika pengguna mulai mengetik
document.getElementById('email').addEventListener('input', clearError);
document.getElementById('password').addEventListener('input', clearError);

function clearError() {
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.style.display = 'none';
}
