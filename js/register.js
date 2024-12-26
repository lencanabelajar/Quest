// Import fungsi signUp dan uploadProfilePicture dari firebase.js
import { signUp, uploadProfilePicture } from './firebase.js';  // Sesuaikan dengan lokasi firebase.js Anda

// Tangani pengiriman form
document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Mencegah form untuk submit secara default
    
    // Ambil nilai dari input form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const profileImageInput = document.getElementById('profile-image');

    // Validasi form
    if (!email || !password || !confirmPassword) {
        document.getElementById('error-message').innerText = 'Harap isi semua kolom!';
        document.getElementById('error-message').style.display = 'block';
        return;
    }

   if (password !== confirmPassword) {
        document.getElementById('error-message').innerText = 'Password dan Konfirmasi Password tidak cocok!';
        document.getElementById('error-message').style.display = 'block';
        return;
    }

    if (password.length < 6) {
        document.getElementById('error-message').innerText = 'Password harus memiliki minimal 6 karakter!';
        document.getElementById('error-message').style.display = 'block';
        return;
    }

    // Proses pendaftaran menggunakan Firebase Authentication
    signUp(email, password)
        .then(user => {
            // Jika ada gambar profil yang diupload, lakukan upload ke Firebase Storage
            if (profileImageInput.files.length > 0) {
                const file = profileImageInput.files[0];
                return uploadProfilePicture(file, user.uid);  // Mengupload gambar dan mengembalikan URL gambar
            } else {
                // Jika tidak ada gambar profil yang diupload, langsung lanjutkan
                return Promise.resolve();  // Kembalikan promise yang resolve untuk melanjutkan alur
            }
        })
        .then(url => {
            if (url) {
                // Jika gambar profil berhasil di-upload, simpan URL ke Firestore (jika diperlukan)
                console.log('Gambar profil berhasil diupload:', url);
                // Simpan URL gambar ke Firestore (misalnya dengan fungsi `updateProfilePicture`)
            }

            // Redirect setelah registrasi berhasil
            console.log("Registrasi berhasil! Menuju halaman utama.");
            window.location.href = 'html/home.html'; // Ganti dengan halaman home Anda
        })
        .catch(error => {
            console.error("Registrasi gagal:", error.message);
            document.getElementById('error-message').innerText = `Gagal registrasi: ${error.message}`;
            document.getElementById('error-message').style.display = 'block';  // Tampilkan error message
        });
});
