// Import fungsi signUp dan uploadProfilePicture dari firebase.js
import { signUp, uploadProfilePicture, updateProfilePicture } from './firebase.js'; // Sesuaikan dengan lokasi firebase.js Anda

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

    // Menampilkan loading spinner
    document.getElementById('loading-spinner').style.display = 'block';

    // Proses pendaftaran menggunakan Firebase Authentication
    signUp(email, password)
        .then(user => {
            // Jika ada gambar profil yang diupload, lakukan upload ke Firebase Storage
            const file = profileImageInput.files.length > 0 ? profileImageInput.files[0] : null;
            if (file) {
                return uploadProfilePicture(file, user.uid);  // Mengupload gambar dan mengembalikan URL gambar
            } else {
                // Jika tidak ada gambar profil yang diupload, langsung lanjutkan
                return Promise.resolve();  // Kembalikan promise yang resolve untuk melanjutkan alur
            }
        })
        .then(url => {
            // Jika gambar profil berhasil di-upload, simpan URL ke Firestore
            if (url) {
                console.log('Gambar profil berhasil diupload:', url);
                // Simpan URL gambar ke Firestore (misalnya dengan fungsi `updateProfilePicture`)
                return updateProfilePicture(user.uid, url);
            }
        })
        .then(() => {
            // Sembunyikan loading spinner setelah registrasi selesai
            document.getElementById('loading-spinner').style.display = 'none';

            // Redirect setelah registrasi berhasil
            console.log("Registrasi berhasil! Menuju halaman utama.");
            window.location.href = '../html/home.html'; // Ganti dengan halaman home Anda
        })
        .catch(error => {
            // Menyembunyikan loading spinner jika terjadi error
            document.getElementById('loading-spinner').style.display = 'none';

            console.error("Registrasi gagal:", error.message);
            document.getElementById('error-message').innerText = `Gagal registrasi: ${error.message}`;
            document.getElementById('error-message').style.display = 'block';  // Tampilkan error message
        });
});
