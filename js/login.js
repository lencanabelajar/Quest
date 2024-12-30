// Elemen untuk menampilkan pesan error dan spinner loading
const errorMessageElement = document.getElementById('error-message');
const loadingSpinner = document.getElementById('loading-spinner');
const loginForm = document.getElementById('login-form');
const loginButton = loginForm.querySelector('button[type="submit"]');

// Event listener untuk form login
loginForm.addEventListener('submit', handleLogin);

// Fungsi untuk menangani login
export async function handleLogin(event) {
    event.preventDefault(); // Mencegah form untuk submit secara default

    // Ambil nilai dari input form
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Reset error message dan tampilkan loading spinner
    errorMessageElement.style.display = 'none';
    errorMessageElement.innerText = '';
    disableLoginButton(true);
    loadingSpinner.style.display = 'block';

    // Validasi form
    if (!email || !password) {
        showError('Harap isi semua kolom!');
        disableLoginButton(false);
        return;
    }

    // Validasi email menggunakan regex (format email yang valid)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Format email tidak valid!');
        highlightErrorField('email');
        disableLoginButton(false);
        return;
    }

    // Validasi panjang password (minimal 6 karakter)
    if (password.length < 6) {
        showError('Password harus memiliki minimal 6 karakter!');
        highlightErrorField('password');
        disableLoginButton(false);
        return;
    }

    try {
        // Fungsi untuk login pengguna dengan cek di localStorage
        const user = await loginUser(email, password);

        // Menyimpan informasi pengguna ke sessionStorage
        sessionStorage.setItem('userEmail', user.email);
        sessionStorage.setItem('userName', user.name || 'Pengguna'); // Jika ada nama pengguna

        // Menyembunyikan spinner dan redirect ke halaman profil
        loadingSpinner.style.display = 'none';
        window.location.href = '/html/profil.html'; // Ganti dengan halaman yang sesuai
    } catch (error) {
        // Menyembunyikan spinner dan tampilkan pesan error
        loadingSpinner.style.display = 'none';
        showError(`Gagal login: ${error.message}`);
        disableLoginButton(false);
    }
}

// Fungsi untuk menampilkan pesan error
function showError(message) {
    errorMessageElement.innerText = message;
    errorMessageElement.style.display = 'block';
}

// Fungsi untuk login pengguna dengan cek di localStorage
async function loginUser(email, password) {
    // Ambil semua pengguna dari localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Enkripsi password sebelum perbandingan (gunakan hashing seperti bcrypt di backend untuk keamanan lebih)
    const encryptedPassword = btoa(password); // Enkripsi password dengan base64 (sebaiknya gunakan bcrypt di backend)

    // Cari pengguna dengan email yang sesuai
    const user = users.find(user => user.email === email);

    // Cek apakah pengguna ada dan password cocok
    if (user && user.password === encryptedPassword) {
        return user; // Kembalikan data pengguna
    } else {
        throw new Error('Email atau password salah'); // Jika gagal login
    }
}

// Fungsi untuk menyoroti input yang salah
function highlightErrorField(...fieldIds) {
    fieldIds.forEach(id => {
        const field = document.getElementById(id);
        field.classList.add('error-highlight'); // Tambahkan kelas CSS untuk highlight
        field.addEventListener('input', () => field.classList.remove('error-highlight'), { once: true });
    });
}

// Fungsi untuk menonaktifkan tombol login saat proses login berlangsung
function disableLoginButton(disable) {
    loginButton.disabled = disable;
    loginButton.style.opacity = disable ? 0.6 : 1;
    loginButton.style.cursor = disable ? 'not-allowed' : 'pointer';
}
