// Fungsi untuk login
export function handleLogin(event) {
    event.preventDefault(); // Mencegah form untuk submit secara default

    // Ambil nilai dari input form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

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
    document.getElementById('loading-spinner').style.display = 'block';

    // Proses login, misalnya dengan memeriksa di database atau API
    // Ini simulasi, Anda dapat menggantinya dengan logika API sebenarnya
    loginUser(email, password)
        .then(user => {
            // Menyimpan informasi pengguna ke localStorage
            localStorage.setItem('user', JSON.stringify(user));

            // Menyembunyikan spinner dan redirect ke halaman utama
            document.getElementById('loading-spinner').style.display = 'none';
            window.location.href = '/html/home.html';
        })
        .catch(error => {
            document.getElementById('loading-spinner').style.display = 'none';
            showError(`Gagal login: ${error.message}`);
        });
}

// Fungsi untuk register
export function handleRegister(event) {
    event.preventDefault(); // Mencegah form untuk submit secara default

    // Ambil nilai dari input form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validasi form
    if (!email || !password || !confirmPassword) {
        showError('Harap isi semua kolom!');
        return;
    }

    // Validasi email
    if (!validateEmail(email)) {
        showError('Email tidak valid!');
        return;
    }

    // Validasi password
    if (password !== confirmPassword) {
        showError('Password dan Konfirmasi Password tidak cocok!');
        return;
    }

    if (password.length < 6) {
        showError('Password harus memiliki minimal 6 karakter!');
        return;
    }

    // Tampilkan loading spinner saat proses pendaftaran
    document.getElementById('loading-spinner').style.display = 'block';

    // Proses pendaftaran
    registerUser(email, password)
        .then(user => {
            // Menyembunyikan spinner dan redirect ke halaman login
            document.getElementById('loading-spinner').style.display = 'none';
            window.location.href = '/html/login.html'; // Arahkan ke halaman login setelah registrasi berhasil
        })
        .catch(error => {
            document.getElementById('loading-spinner').style.display = 'none';
            showError(`Gagal registrasi: ${error.message}`);
        });
}

// Fungsi untuk menangani logout
export function handleLogout() {
    localStorage.removeItem('user'); // Hapus informasi user dari localStorage
    window.location.href = '/html/login.html'; // Arahkan ke halaman login setelah logout
}

// Fungsi untuk menampilkan pesan error
function showError(message) {
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.innerText = message;
    errorMessageElement.style.display = 'block';
}

// Fungsi validasi email
function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

// Fungsi simulasi login (ganti dengan logika backend nyata)
function loginUser(email, password) {
    return new Promise((resolve, reject) => {
        // Simulasi login
        setTimeout(() => {
            if (email === "test@example.com" && password === "password123") {
                resolve({ username: 'Test User', email }); // Simulasi user berhasil login
            } else {
                reject(new Error('Email atau password salah'));
            }
        }, 1000);
    });
}

// Fungsi simulasi registrasi (ganti dengan logika backend nyata)
function registerUser(email, password) {
    return new Promise((resolve, reject) => {
        // Simulasi registrasi
        setTimeout(() => {
            if (email === "test@example.com") {
                reject(new Error('Email sudah terdaftar'));
            } else {
                resolve({ username: email, email }); // Simulasi registrasi berhasil
            }
        }, 1000);
    });
}
