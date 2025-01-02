// Elemen DOM yang digunakan
const userNameDisplay = document.getElementById('username-display');
const userEmailDisplay = document.getElementById('userEmail');
const userLevelDisplay = document.getElementById('user-level-display');
const profileImage = document.getElementById('profile-avatar');
const profileImageInput = document.getElementById('profile-image-input');
const changeProfilePicBtn = document.getElementById('change-profile-pic-btn');
const editProfileBtn = document.getElementById('edit-profile-btn');
const logoutBtn = document.getElementById('logout-btn');
const editProfileModal = document.getElementById('edit-profile-modal');
const editProfileForm = document.getElementById('edit-profile-form');
const editNameInput = document.getElementById('edit-name');
const editLevelInput = document.getElementById('edit-level');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

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
        userNameDisplay.innerText = userProfile.name || userEmail.split('@')[0];
        userEmailDisplay.innerText = userProfile.email;
        userLevelDisplay.innerText = userProfile.level || 'Pemula';
        profileImage.src = userProfile.profileImage || '../assets/icon/ruby.png';
    } else {
        console.warn('Data profil tidak ditemukan.');
        window.location.href = 'login.html'; // Redirect jika profil tidak ditemukan
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

// Fungsi untuk menyimpan perubahan profil
function saveProfileChanges(event) {
    event.preventDefault();

    const newName = editNameInput.value.trim();
    const newLevel = editLevelInput.value;

    if (!newName) {
        alert('Nama tidak boleh kosong!');
        return;
    }

    const userProfile = getUserProfile();

    if (userProfile) {
        userProfile.name = newName;
        userProfile.level = newLevel;
        saveUserProfile(userProfile);
        alert('Profil berhasil diperbarui!');
        loadUserProfile();
        closeModal(editProfileModal);
    }
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

editProfileBtn?.addEventListener('click', () => {
    const userProfile = getUserProfile();

    if (userProfile) {
        editNameInput.value = userProfile.name || '';
        editLevelInput.value = userProfile.level || 'Pemula';
        openModal(editProfileModal);
    } else {
        alert('Pengguna tidak ditemukan!');
    }
});

cancelEditBtn?.addEventListener('click', () => closeModal(editProfileModal));

editProfileForm?.addEventListener('submit', saveProfileChanges);

logoutBtn?.addEventListener('click', logout);
