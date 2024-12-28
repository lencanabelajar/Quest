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

        // Mengirim data ke serverless function Netlify
        const response = await fetch('/.netlify/functions/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.status !== 200) {
            throw new Error(data.message); // Jika ada error, lemparkan
        }

        // Sembunyikan loading spinner setelah registrasi selesai
        loadingSpinner.style.display = 'none';

        // Jika berhasil, redirect ke halaman home
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
