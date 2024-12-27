// Import fungsi login dari airtable.js
import { login } from './airtable.js';  // Sesuaikan dengan lokasi airtable.js Anda

// Tangani pengiriman form
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Mencegah form untuk submit secara default
    
    // Ambil nilai dari input form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validasi form
    if (!email || !password) {
        document.getElementById('error-message').innerText = 'Harap isi semua kolom!';
        document.getElementById('error-message').style.display = 'block';
        return;
    }

    // Proses login menggunakan fungsi login dari airtable.js
    login(email, password)
        .then(user => {
            // Redirect setelah login berhasil
            console.log("Login berhasil! Menuju halaman utama.");
            window.location.href = '../html/home.html'; // Ganti dengan halaman home Anda
        })
        .catch(error => {
            console.error("Login gagal:", error.message);
            document.getElementById('error-message').innerText = `Gagal login: ${error.message}`;
            document.getElementById('error-message').style.display = 'block';  // Tampilkan error message
        });
});
