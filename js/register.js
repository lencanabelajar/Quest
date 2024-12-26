// Import fungsi signUp dari firebase.js
import { signUp } from './firebase.js';  // Sesuaikan dengan lokasi firebase.js Anda

// Ambil parameter dari URL
const urlParams = new URLSearchParams(window.location.search);
const usernameFromUrl = urlParams.get('username');
const passwordFromUrl = urlParams.get('password');

// Isi form dengan nilai parameter URL jika ada
if (usernameFromUrl && passwordFromUrl) {
    document.getElementById('username').value = usernameFromUrl;
    document.getElementById('password').value = passwordFromUrl;
}

// Tangani pengiriman form
document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Mencegah form untuk submit secara default
    
    // Ambil nilai dari input form
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Proses pendaftaran menggunakan Firebase Authentication
    if (username && password) {
        // Menggunakan fungsi signUp dari firebase.js untuk melakukan registrasi
        signUp(username, password)
            .then(() => {
                // Redirect setelah registrasi berhasil
                window.location.href = '/html/home.html'; // Ganti dengan halaman home Anda
            })
            .catch(error => {
                alert(`Error: ${error.message}`);
            });
    } else {
        alert('Harap isi semua kolom!');
    }
});
