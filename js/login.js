// Elemen untuk menampilkan pesan error
const errorMessageElement = document.getElementById('error-message');
const loadingSpinner = document.getElementById('loading-spinner');

// Fungsi untuk menangani login
export async function handleLogin(event) {
    event.preventDefault(); // Mencegah form untuk submit secara default

    // Ambil nilai dari input form
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validasi form
    if (!email || !password) {
        showError('Harap isi semua kolom!');
        return;
    }

    // Validasi email menggunakan regex (format email yang valid)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Format email tidak valid!');
        return;
    }

    // Tampilkan loading spinner saat proses login berjalan
    loadingSpinner.style.display = 'block';

    try {
        const user = await loginUser(email, password);
        
        // Menyimpan informasi pengguna ke sessionStorage
        sessionStorage.setItem('userEmail', user.email);

        // Menyembunyikan spinner dan redirect ke halaman profil
        loadingSpinner.style.display = 'none';
        window.location.href = '/html/profil.html'; // Ganti dengan halaman yang sesuai
    } catch (error) {
        // Menyembunyikan spinner dan tampilkan pesan error
        loadingSpinner.style.display = 'none';
        showError(`Gagal login: ${error.message}`);
    }
}

// Fungsi untuk menangani error
function showError(message) {
    errorMessageElement.innerText = message;
    errorMessageElement.style.display = 'block';
}

// Fungsi untuk login pengguna dengan cek di localStorage
async function loginUser(email, password) {
    // Ambil semua pengguna dari localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Cari pengguna dengan email yang sesuai
    const user = users.find(user => user.email === email);

    // Cek apakah pengguna ada dan password cocok
    if (user && user.password === password) {
        return user; // Kembalikan data pengguna
    } else {
        throw new Error('Email atau password salah'); // Jika gagal login
    }
}

// Event listener untuk form login
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', handleLogin);
