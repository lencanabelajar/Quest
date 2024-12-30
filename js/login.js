// Fungsi untuk login
export function handleLogin(event) {
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
    document.getElementById('loading-spinner').style.display = 'block';

    try {
        const user = await loginUser(email, password);
        
        // Menyimpan informasi pengguna ke localStorage
        localStorage.setItem('user', JSON.stringify(user));

        // Menyembunyikan spinner dan redirect ke halaman utama
        document.getElementById('loading-spinner').style.display = 'none';
        window.location.href = '/html/home.html'; // Ganti dengan halaman yang sesuai
    } catch (error) {
        // Menyembunyikan spinner dan tampilkan pesan error
        document.getElementById('loading-spinner').style.display = 'none';
        showError(`Gagal login: ${error.message}`);
    }
}

// Fungsi untuk register
export function handleRegister(event) {
    event.preventDefault(); // Mencegah form untuk submit secara default

    // Ambil nilai dari input form
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

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

    try {
        const user = await registerUser(email, password);

        // Menyembunyikan spinner dan redirect ke halaman login
        document.getElementById('loading-spinner').style.display = 'none';
        window.location.href = '/html/login.html'; // Arahkan ke halaman login setelah registrasi berhasil
    } catch (error) {
        // Menyembunyikan spinner dan tampilkan pesan error
        document.getElementById('loading-spinner').style.display = 'none';
        showError(`Gagal registrasi: ${error.message}`);
    }
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

// Fungsi untuk register pengguna dan simpan ke localStorage
async function registerUser(email, password) {
    // Ambil semua pengguna dari localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Cek apakah email sudah terdaftar
    if (users.find(user => user.email === email)) {
        throw new Error('Email sudah terdaftar'); // Jika email sudah ada
    }

    // Tambahkan pengguna baru ke daftar
    const newUser = { email, password }; // Simpan email dan password (Anda bisa tambahkan fitur enkripsi password jika perlu)
    users.push(newUser);

    // Simpan daftar pengguna kembali ke localStorage
    localStorage.setItem('users', JSON.stringify(users));

    return newUser; // Kembalikan data pengguna baru
}
