// Import Firebase modules
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Inisialisasi Firebase Auth
const auth = getAuth();

// Menangani status autentikasi
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Jika pengguna terautentikasi
    document.getElementById('username-display').innerText = user.email.split('@')[0]; // Menampilkan nama pengguna
    document.getElementById('logout-btn').style.display = "inline"; // Menampilkan tombol logout
  } else {
    // Jika tidak ada pengguna yang terautentikasi
    window.location.href = 'index.html'; // Arahkan ke halaman login
  }
});

// Logout
document.getElementById('logout-btn')?.addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = 'index.html'; // Setelah logout, arahkan ke halaman login
  }).catch((error) => {
    console.error("Error signing out: ", error.message);
  });
});
