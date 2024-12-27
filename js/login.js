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

    // Proses login menggunakan fungsi login dari airtable.js
    login(email, password)
        .then(user => {
            // Redirect setelah login berhasil
            console.log("Login berhasil! Menuju halaman utama.");

            // Pastikan pengalihan URL yang benar
            window.location.href = '/html/home.html';  // Ganti dengan halaman home Anda
        })
        .catch(error => {
            console.error("Login gagal:", error.message);
            showError(`Gagal login: ${error.message}`);
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
