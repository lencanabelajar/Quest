// Elemen DOM yang digunakan
const greetingUsernameDisplay = document.getElementById('greeting-username-display'); // Greeting di header
const userNameDisplay = document.getElementById('profile-username-display'); // Nama di profil
const userEmailDisplay = document.getElementById('userEmail');
const userLevelDisplay = document.getElementById('user-level-display');
const expDisplay = document.getElementById('exp-display');
const expBarFill = document.getElementById('exp-bar-fill');
const profileImage = document.getElementById('profile-avatar');
const profileImageInput = document.getElementById('profile-image-input');
const changeProfilePicBtn = document.getElementById('change-profile-pic-btn');
const logoutBtn = document.getElementById('logout-btn');
const editProfileBtn = document.getElementById('edit-profile-btn');
const editProfileModal = document.getElementById('edit-profile-modal');
const editProfileForm = document.getElementById('edit-profile-form');
const editNameInput = document.getElementById('edit-name');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

// Variabel untuk level dan pengalaman
let currentXP = 0;
let maxXP = 100;
let level = 1;

// Fungsi untuk mendapatkan data profil pengguna dari localStorage
function getUserProfile() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userEmail = sessionStorage.getItem('userEmail');
    return users.find(user => user.email === userEmail) || null;
}

// Fungsi untuk menyimpan data pengguna ke localStorage
function saveUserProfile(updatedUser) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.email === updatedUser.email);

    if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
    } else {
        console.error('Pengguna tidak ditemukan saat menyimpan profil.');
    }
}

// Fungsi untuk memuat data profil pengguna ke halaman
function loadUserProfile() {
    const userEmail = sessionStorage.getItem('userEmail');

    if (!userEmail) {
        window.location.href = 'login.html'; // Redirect jika tidak ada data login
        return;
    }

    const userProfile = getUserProfile();

    if (userProfile) {
        const fallbackName = userEmail ? userEmail.split('@')[0] : "Pengguna Baru";
        const displayName = userProfile.name || fallbackName;

        // Perbarui elemen nama untuk greeting dan profil
        greetingUsernameDisplay.innerText = displayName; // Nama di header
        userNameDisplay.innerText = displayName; // Nama di konten profil
        userEmailDisplay.innerText = userProfile.email;
        userLevelDisplay.innerText = userProfile.level || "1";
        profileImage.src = userProfile.profileImage || "../assets/icon/ruby.png";

        // Perbarui data level dan XP
        currentXP = userProfile.currentXP || 0;
        maxXP = userProfile.maxXP || 100;
        level = userProfile.level || 1;
        updateExperienceUI();
    } else {
        alert("Data profil tidak ditemukan!");
        window.location.href = "login.html";
    }
}

// Fungsi untuk memperbarui UI pengalaman
function updateExperienceUI() {
    userLevelDisplay.innerText = level;
    expDisplay.innerText = currentXP;
    expBarFill.style.width = `${(currentXP / maxXP) * 100}%`;
}

// Fungsi untuk menambahkan XP dan menangani level up
function addExperience(points) {
    currentXP += points;
    while (currentXP >= maxXP) {
        currentXP -= maxXP;
        levelUp();
    }
    updateExperienceUI();

    // Simpan perubahan ke localStorage
    const userProfile = getUserProfile();
    if (userProfile) {
        userProfile.currentXP = currentXP;
        userProfile.maxXP = maxXP;
        userProfile.level = level;
        saveUserProfile(userProfile);
    }
}

// Fungsi untuk menangani level up
function levelUp() {
    if (level < 99) {
        level++;
        maxXP = Math.ceil(maxXP * 1.2); // Tingkatkan XP yang dibutuhkan untuk level berikutnya
        alert(`Selamat! Anda telah naik ke level ${level}!`);
    } else {
        currentXP = maxXP; // Batasi XP jika level maksimal tercapai
        alert('Anda telah mencapai level maksimal!');
    }
}

// Fungsi untuk menangani unggahan gambar profil
function handleProfilePictureUpload(file) {
    if (!file) return;

    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxFileSize = 2 * 1024 * 1024; // Maksimal 2 MB

    if (!validFileTypes.includes(file.type)) {
        alert('Format file tidak didukung! Harap unggah file berformat JPEG atau PNG.');
        return;
    }

    if (file.size > maxFileSize) {
        alert('Ukuran file terlalu besar! Maksimal 2 MB.');
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        const profileImageURL = reader.result;
        const userProfile = getUserProfile();

        if (userProfile) {
            userProfile.profileImage = profileImageURL;
            saveUserProfile(userProfile);
            alert('Foto profil berhasil diperbarui!');
            loadUserProfile(); // Reload profil untuk menampilkan perubahan
        }
    };
    reader.readAsDataURL(file);
}

// Fungsi untuk membuka modal
function openModal(modal) {
    if (modal) {
        modal.style.display = 'block';
    }
}

// Fungsi untuk menutup modal
function closeModal(modal) {
    if (modal) {
        modal.style.display = 'none';
    }
}

// Fungsi untuk menangani logout
function logout() {
    sessionStorage.removeItem('userEmail');
    window.location.href = 'login.html';
}

// Event listeners
window.addEventListener('load', loadUserProfile);

changeProfilePicBtn?.addEventListener('click', () => {
    profileImageInput.click(); // Membuka dialog file
});

profileImageInput?.addEventListener('change', event => {
    const file = event.target.files[0];
    handleProfilePictureUpload(file);
});

logoutBtn?.addEventListener('click', logout);

// Fungsi untuk membuka modal edit profil
editProfileBtn?.addEventListener('click', () => {
    const userProfile = getUserProfile();

    if (userProfile) {
        editNameInput.value = userProfile.name || ''; // Hanya edit nama
        openModal(editProfileModal);
    } else {
        alert('Pengguna tidak ditemukan!');
    }
});

// Fungsi untuk menangani submit form edit profil
editProfileForm?.addEventListener('submit', event => {
    event.preventDefault(); // Mencegah reload halaman

    const newName = editNameInput.value.trim(); // Ambil nilai baru dari input nama
    const userProfile = getUserProfile();

    if (userProfile) {
        // Perbarui data pengguna
        userProfile.name = newName || userProfile.name; // Hanya update nama jika ada perubahan
        saveUserProfile(userProfile); // Simpan perubahan ke localStorage
        alert('Profil berhasil diperbarui!');
        closeModal(editProfileModal); // Tutup modal
        loadUserProfile(); // Perbarui tampilan profil
    } else {
        alert('Terjadi kesalahan saat memperbarui profil.');
    }
});

// Fungsi untuk menutup modal dengan tombol Cancel
cancelEditBtn?.addEventListener('click', () => closeModal(editProfileModal));
