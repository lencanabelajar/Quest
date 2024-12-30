// DOM Elements
const registerForm = document.getElementById('register-form');
const profileImageInput = document.getElementById('profile-image');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessageElement = document.getElementById('error-message');

// Event listener untuk form registrasi
registerForm.addEventListener('submit', function(e) {
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

    // Menampilkan loading spinner
    loadingSpinner.style.display = 'block';

    try {
        // Menyimpan gambar profil sebagai URL lokal jika ada
        let profileImageURL = '';
        if (profileImageInput.files.length > 0) {
            const profileImageFile = profileImageInput.files[0];
            profileImageURL = await readImageFile(profileImageFile);
        }

        // Simpan data pengguna ke localStorage
        const userData = {
            email: email,
            password: password, // Anda bisa menambahkan enkripsi jika diperlukan
            profileImage: profileImageURL || 'default-profile.png', // Default jika tidak ada gambar
        };

        let users = JSON.parse(localStorage.getItem('users')) || []; // Ambil daftar pengguna yang sudah ada
        users.push(userData); // Tambahkan pengguna baru
        localStorage.setItem('users', JSON.stringify(users)); // Simpan daftar pengguna

        // Bersihkan form setelah berhasil
        registerForm.reset();

        // Menyembunyikan loading spinner setelah proses selesai
        loadingSpinner.style.display = 'none';

        // Jika berhasil, redirect ke halaman profil atau halaman utama
        console.log("Registrasi berhasil! Menuju halaman profil.");
        window.location.href = '../html/profile.html'; // Ganti dengan halaman yang sesuai
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

// Fungsi untuk membaca file gambar sebagai URL lokal menggunakan FileReader
function readImageFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result); // Menyimpan gambar sebagai base64 URL
        reader.onerror = reject;
        reader.readAsDataURL(file); // Membaca file sebagai base64 URL
    });
}
