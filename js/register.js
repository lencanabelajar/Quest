// DOM Elements
const registerForm = document.getElementById('register-form');
const profileImageInput = document.getElementById('profile-image');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessageElement = document.getElementById('error-message');
const submitButton = document.querySelector('#register-form button[type="submit"]');

// Event listener untuk form registrasi
registerForm.addEventListener('submit', async function (e) {
    e.preventDefault(); // Mencegah form untuk submit secara default

    // Ambil nilai dari input form
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Reset error dan state loading
    errorMessageElement.style.display = 'none';
    errorMessageElement.innerText = '';
    disableSubmitButton(true);

    // Validasi form
    if (!email || !password || !confirmPassword) {
        return displayErrorMessage('Harap isi semua kolom!');
    }

    if (!validateEmail(email)) {
        highlightErrorField('email');
        return displayErrorMessage('Email tidak valid!');
    }

    if (password !== confirmPassword) {
        highlightErrorField('password', 'confirm-password');
        return displayErrorMessage('Password dan Konfirmasi Password tidak cocok!');
    }

    if (!validatePassword(password)) {
        highlightErrorField('password');
        return displayErrorMessage('Password harus memiliki minimal 6 karakter, termasuk huruf besar, angka, dan simbol!');
    }

    // Tampilkan loading spinner
    loadingSpinner.style.display = 'block';

    try {
        // Menyimpan gambar profil sebagai URL lokal jika ada
        let profileImageURL = 'default-profile.png'; // Default gambar profil
        if (profileImageInput.files.length > 0) {
            const profileImageFile = profileImageInput.files[0];
            profileImageURL = await readImageFile(profileImageFile);
        }

        // Enkripsi password sebelum disimpan
        const encryptedPassword = btoa(password); // Gunakan bcrypt untuk keamanan lebih baik di backend

        // Simpan data pengguna ke localStorage
        const userData = {
            email: email,
            password: encryptedPassword,
            profileImage: profileImageURL,
        };

        let users = JSON.parse(localStorage.getItem('users')) || []; // Ambil daftar pengguna yang sudah ada
        if (users.some(user => user.email === email)) {
            throw new Error('Email sudah terdaftar! Gunakan email lain.');
        }

        users.push(userData); // Tambahkan pengguna baru
        localStorage.setItem('users', JSON.stringify(users)); // Simpan daftar pengguna

        // Bersihkan form setelah berhasil
        registerForm.reset();

        // Menyembunyikan loading spinner setelah proses selesai
        loadingSpinner.style.display = 'none';

        // Menyimpan email pengguna di sessionStorage untuk otentikasi sementara
        sessionStorage.setItem('userEmail', email);

        // Redirect ke halaman profil atau utama
        console.log('Registrasi berhasil! Mengarahkan ke halaman profil...');
        window.location.href = '../html/profil.html'; // Ganti dengan halaman yang sesuai
    } catch (error) {
        loadingSpinner.style.display = 'none';
        console.error('Registrasi gagal:', error.message);
        displayErrorMessage(`Gagal registrasi: ${error.message}`);
    } finally {
        disableSubmitButton(false);
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

// Fungsi validasi password
function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return regex.test(password);
}

// Fungsi untuk membaca file gambar sebagai URL lokal menggunakan FileReader
function readImageFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result); // Menyimpan gambar sebagai base64 URL
        reader.onerror = () => resolve('default-profile.png'); // Fallback ke gambar default
        reader.readAsDataURL(file);
    });
}

// Fungsi untuk menyoroti input yang salah
function highlightErrorField(...fieldIds) {
    fieldIds.forEach(id => {
        const field = document.getElementById(id);
        field.classList.add('error-highlight'); // Tambahkan kelas CSS untuk highlight
        field.addEventListener('input', () => field.classList.remove('error-highlight'), { once: true });
    });
}

// Fungsi untuk menonaktifkan tombol submit saat proses berjalan
function disableSubmitButton(disable) {
    submitButton.disabled = disable;
    submitButton.style.opacity = disable ? 0.6 : 1;
    submitButton.style.cursor = disable ? 'not-allowed' : 'pointer';
}
