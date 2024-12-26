// Import fungsi signUp, uploadProfilePicture, dan updateProfilePicture dari firebase.js
import { signUp, uploadProfilePicture, updateProfilePicture } from './firebase.js';  // Sesuaikan dengan lokasi firebase.js Anda

// Tangani pengiriman form
document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Mencegah form untuk submit secara default
    
    // Ambil nilai dari input form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const profileImageInput = document.getElementById('profile-image');

    // Reset pesan error sebelumnya
    document.getElementById('error-message').style.display = 'none';

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
        .then(userCredential => {
            const user = userCredential.user;
            
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
                // Jika gambar profil berhasil di-upload, simpan URL ke Firestore
                return updateProfilePicture(user.uid, url);  // Update Firestore dengan URL gambar profil
            } else {
                return Promise.resolve();  // Tidak ada gambar profil, lanjutkan tanpa update
            }
        })
        .then(() => {
                // Tambahkan penundaan sedikit agar proses selesai sebelum redirect
                setTimeout(() => {
                    console.log("Registrasi berhasil! Menuju halaman utama.");
                    window.location.replace('../html/home.html'); // Ganti dengan halaman home Anda
                }, 1000); // Penundaan 1 detik
            })

        .catch(error => {
            console.error("Registrasi gagal:", error.message);
            document.getElementById('error-message').innerText = `Gagal registrasi: ${error.message}`;
            document.getElementById('error-message').style.display = 'block';  // Tampilkan error message
        });
});
