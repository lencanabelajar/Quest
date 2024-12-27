// Import fungsi untuk menyimpan data ke Airtable
import { saveUserToAirtable } from './js/airtable.js'; // Sesuaikan dengan lokasi airtable.js Anda

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

    // Proses pendaftaran dan simpan ke Airtable
    saveUserToAirtable(email, password)
        .then(user => {
            // Jika ada gambar profil yang diupload, simpan gambar ke server atau URL
            const file = profileImageInput.files.length > 0 ? profileImageInput.files[0] : null;
            if (file) {
                // Bisa menambahkan logika untuk mengupload gambar dan simpan URL-nya
                return uploadProfilePicture(file, user.id);  // Gantilah dengan cara upload yang sesuai
            } else {
                return Promise.resolve(); // Lanjutkan tanpa gambar profil
            }
        })
        .then(() => {
            // Sembunyikan loading spinner setelah registrasi selesai
            document.getElementById('loading-spinner').style.display = 'none';
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
