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

    // Proses pendaftaran (misalnya Firebase Authentication atau sistem backend lainnya)
    if (username && password) {
        // Contoh pengalihan setelah berhasil daftar
        window.location.href = '../home.html'; // Ganti dengan halaman home Anda
    } else {
        alert('Harap isi semua kolom!');
    }
});
