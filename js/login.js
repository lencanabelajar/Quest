import { login } from './firebase.js';

// Handle login form submission
const loginForm = document.getElementById('login-form');

// Event listener untuk menangani form submission
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();  // Mencegah form submit otomatis

  // Ambil nilai input dari form
  const email = event.target.email.value;   // Pastikan id input email sesuai dengan 'email'
  const password = event.target.password.value;

  // Validasi input
  if (!email || !password) {
    alert('Email dan password harus diisi.');
    return;
  }

  // Panggil fungsi login dan tangani hasilnya
  login(email, password)
    .then(() => {
      window.location.href = 'home.html';  // Redirect ke halaman home setelah login berhasil
    })
    .catch(error => {
      alert('Login gagal: ' + error.message);  // Tampilkan pesan error jika login gagal
    });
});
