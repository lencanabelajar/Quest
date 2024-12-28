import bcrypt from 'bcryptjs'; // Mengimpor bcryptjs

// DOM Elements
const registerForm = document.getElementById('register-form');
const profileImageInput = document.getElementById('profile-image');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessageElement = document.getElementById('error-message');

// Event listener untuk form registrasi
registerForm.addEventListener('submit', async function(e) {
    e.preventDefault(); // Mencegah form untuk submit secara default
    
    // Ambil nilai dari input form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validasi form
    if (!email || !password || !confirmPassword) {
        return displayErrorMessage('Harap isi semua kolom!');
    }

    // Validasi email
    if (!validateEmail(email)) {
        return displayErrorMessage('Email tidak valid!');
    }

    // Validasi password
    if (password !== confirmPassword) {
        return displayErrorMessage('Password dan Konfirmasi Password tidak cocok!');
    }

    if (password.length < 6) {
        return displayErrorMessage('Password harus memiliki minimal 6 karakter!');
    }

    try {
        // Hash password di frontend menggunakan bcryptjs
        const hashedPassword = await hashPassword(password);

        // Menampilkan loading spinner
        loadingSpinner.style.display = 'block';

        // Proses pendaftaran dan simpan ke Airtable dengan password yang sudah di-hash
        const user = await signUp(email, hashedPassword);

        // Simpan gambar profil jika ada
        const file = profileImageInput.files.length > 0 ? profileImageInput.files[0] : null;
        if (file) {
            await uploadProfilePicture(file, email);
        }

        // Sembunyikan loading spinner setelah registrasi selesai
        loadingSpinner.style.display = 'none';
        console.log("Registrasi berhasil! Menuju halaman utama.");
        window.location.href = '../html/home.html'; // Ganti dengan halaman home Anda
    } catch (error) {
        loadingSpinner.style.display = 'none';
        console.error("Registrasi gagal:", error.message);
        displayErrorMessage(`Gagal registrasi: ${error.message}`);
    }
});

// Fungsi untuk menampilkan pesan error
function displayErrorMessage(message) {
    errorMessageElement.innerText = message;
    errorMessageElement.style.display = 'block';
}

// Fungsi validasi email
function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

// Fungsi untuk hash password
function hashPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                reject(new Error("Terjadi kesalahan saat hashing password!"));
            } else {
                resolve(hashedPassword);
            }
        });
    });
}

// Fungsi untuk registrasi pengguna (gunakan API atau backend yang sesuai)
function signUp(email, hashedPassword) {
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
