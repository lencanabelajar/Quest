import bcrypt from 'bcryptjs'; // Mengimpor bcryptjs

document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Mencegah form untuk submit secara default
    
    // Ambil nilai dari input form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const profileImageInput = document.getElementById('profile-image');

    // Validasi form
    if (!email || !password || !confirmPassword) {
        displayErrorMessage('Harap isi semua kolom!');
        return;
    }

    // Validasi email
    if (!validateEmail(email)) {
        displayErrorMessage('Email tidak valid!');
        return;
    }

    // Validasi password
    if (password !== confirmPassword) {
        displayErrorMessage('Password dan Konfirmasi Password tidak cocok!');
        return;
    }

    if (password.length < 6) {
        displayErrorMessage('Password harus memiliki minimal 6 karakter!');
        return;
    }

    // Hash password di frontend menggunakan bcryptjs
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error("Error hashing password:", err);
            displayErrorMessage('Terjadi kesalahan saat hashing password!');
            return;
        }

        // Menampilkan loading spinner
        document.getElementById('loading-spinner').style.display = 'block';

        // Proses pendaftaran dan simpan ke Airtable dengan password yang sudah di-hash
        signUp(email, hashedPassword) // Gunakan fungsi signUp dengan password yang sudah di-hash
            .then(user => {
                // Jika ada gambar profil yang diupload, simpan gambar ke server atau URL
                const file = profileImageInput.files.length > 0 ? profileImageInput.files[0] : null;
                if (file) {
                    return uploadProfilePicture(file, email); // Gantilah dengan cara upload yang sesuai
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
                document.getElementById('loading-spinner').style.display = 'none';
                console.error("Registrasi gagal:", error.message);
                displayErrorMessage(`Gagal registrasi: ${error.message}`);
            });
    });
});

// Fungsi untuk menampilkan pesan error
function displayErrorMessage(message) {
    document.getElementById('error-message').innerText = message;
    document.getElementById('error-message').style.display = 'block';
}

// Fungsi validasi email
function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

// Fungsi untuk registrasi pengguna (gunakan API atau backend yang sesuai)
function signUp(email, hashedPassword) {
    // Fungsi ini harus diubah sesuai dengan metode pendaftaran yang Anda gunakan (misalnya, Airtable, Firebase, dll.)
    return new Promise((resolve, reject) => {
        // Simulasi delay dan validasi sederhana
        setTimeout(() => {
            if (email === "test@example.com") {
                reject(new Error("Email sudah terdaftar"));
            } else {
                resolve({ email }); // Simulasikan pengguna baru berhasil terdaftar
            }
        }, 1000);
    });
}

// Fungsi untuk meng-upload gambar profil
function uploadProfilePicture(file, email) {
    return new Promise((resolve, reject) => {
        // Simulasi upload gambar
        setTimeout(() => {
            console.log(`Gambar profil untuk ${email} berhasil di-upload: ${file.name}`);
            resolve();
        }, 1000);
    });
}
