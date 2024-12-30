// js/register.js

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
        // Menampilkan loading spinner
        loadingSpinner.style.display = 'block';

        // Cek apakah ada gambar profil yang diupload
        let profileImageURL = '';
        if (profileImageInput.files.length > 0) {
            const profileImageFile = profileImageInput.files[0];
            profileImageURL = await uploadProfileImage(profileImageFile);
        }

        // Mengirim data ke serverless function Netlify
        const response = await fetch('/.netlify/functions/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, profileImage: profileImageURL })
        });

        const data = await response.json();

        if (response.status !== 200) {
            throw new Error(data.message); // Jika ada error, lemparkan
        }

        // Sembunyikan loading spinner setelah registrasi selesai
        loadingSpinner.style.display = 'none';

        // Simpan data pengguna di localStorage
        const user = {
            email,
            profileImage: profileImageURL || 'default-profile.png', // Default jika tidak ada gambar
        };
        localStorage.setItem('user', JSON.stringify(user)); // Menyimpan user di localStorage

        // Bersihkan form setelah berhasil
        registerForm.reset();

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

// Fungsi untuk meng-upload gambar profil
async function uploadProfileImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch('/.netlify/functions/upload-profile-image', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (response.status !== 200) {
            throw new Error(result.message || 'Gagal meng-upload gambar profil');
        }

        return result.imageURL;  // URL gambar profil yang di-upload
    } catch (error) {
        console.error("Upload gambar gagal:", error.message);
        displayErrorMessage('Gagal meng-upload gambar profil.');
        return '';  // Return an empty string if upload fails
    }
}
