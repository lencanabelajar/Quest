// Elemen DOM yang digunakan
const greetingUsernameDisplay = document.getElementById('greeting-username-display'); 
const userNameDisplay = document.getElementById('profile-username-display'); 
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
let level = 1;
let totalXP = 0; // Total XP akumulatif

// XP threshold untuk setiap level (99 level maksimal)
const xpThresholds = [100]; // Mulai dari level 1 dengan 100 XP
for (let i = 1; i < 99; i++) {
    xpThresholds.push(Math.floor(xpThresholds[i - 1] * 1.5)); // Meningkatkan dengan faktor 1.5 setiap level
}

// Simpan XP thresholds ke localStorage
localStorage.setItem('xpThresholds', JSON.stringify(xpThresholds));

console.log('XP Thresholds:', xpThresholds);

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
    }
}

// Fungsi untuk memuat data profil pengguna
function loadUserProfile() {
    const userEmail = sessionStorage.getItem('userEmail');

    if (!userEmail) {
        window.location.href = 'login.html'; // Redirect jika tidak ada data login
        return;
    }

    const userProfile = getUserProfile();

    if (userProfile) {
        // Perbarui elemen nama untuk greeting dan profil
        greetingUsernameDisplay.innerText = userProfile.name || userEmail.split('@')[0];
        userNameDisplay.innerText = userProfile.name || userEmail.split('@')[0];
        userEmailDisplay.innerText = userProfile.email;

        // Tambahkan level default jika tidak ada
        if (userProfile.currentXP >= xpThresholds[userProfile.level - 1] && userProfile.level < 99) {
            let level = userProfile.level;
            while (userProfile.currentXP >= xpThresholds[level - 1] && level < 99) {
                level++;
                userProfile.level = level;
            }
        }
        
        userLevelDisplay.innerText = userProfile.level || 1;
        profileImage.src = userProfile.profileImage || '../assets/icon/ruby.png';

        // Memperbarui progress bar
        const expBar = document.getElementById('exp-bar');
        expBar.value = userProfile.currentXP || 0;
        expBar.max = xpThresholds[userProfile.level - 1];

        // Memperbarui tampilan koin
        document.getElementById('user-coin-display').innerText = userProfile.coins || 0;
    } else {
        alert("Data profil tidak ditemukan!");
        window.location.href = "login.html";
    }

    // Perbarui data level dan XP
    currentXP = userProfile.currentXP || 0;
    level = userProfile.level || 1;
    totalXP = userProfile.totalXP || 0;

    updateExperienceUI();
}

// Fungsi untuk menambahkan pengalaman dan menangani level up
function addExperience(points) {
    currentXP += points;
    totalXP += points;

    console.log(`Added XP: ${points}`);
    console.log(`Current XP: ${currentXP}, Total XP: ${totalXP}, Level: ${level}`);
    console.log(`XP Threshold for Level ${level}: ${xpThresholds[level - 1]}`);
    
    // Periksa jika XP mencapai threshold untuk level berikutnya
    while (currentXP >= xpThresholds[level - 1] && level < 99) {
        currentXP -= xpThresholds[level - 1];
        level++;
        alert(`Selamat! Anda telah naik ke level ${level}!`);
        addCoins(50);  // Menambahkan 5 koin saat naik level
    }

    // Batasi jika level sudah mencapai 99
    if (level === 99 && currentXP >= xpThresholds[98]) {
        currentXP = xpThresholds[98];
        alert('Anda telah mencapai level maksimal!');
    }

    updateExperienceUI();

    // Simpan perubahan ke localStorage
    const userProfile = getUserProfile();
    if (userProfile) {
        userProfile.currentXP = currentXP;
        userProfile.totalXP = totalXP;
        userProfile.level = level;
        saveUserProfile(userProfile);
    }
}

// Fungsi untuk memperbarui UI XP dan Level
function updateExperienceUI() {
    userLevelDisplay.innerText = `Level: ${level}`;
    expDisplay.innerText = `${currentXP} / ${xpThresholds[level - 1]} XP`;

    // Update nilai progress bar
    const expBar = document.getElementById('exp-bar');
    expBar.value = currentXP; // Nilai XP saat ini
    expBar.max = xpThresholds[level - 1]; // Threshold level saat ini
}

// Fungsi untuk menambahkan koin
function addCoins(points) {
    let userProfile = getUserProfile();
    if (!userProfile) return;

    userProfile.coins = (userProfile.coins || 0) + points;  // Menambah koin yang dimiliki
    saveUserProfile(userProfile);  // Simpan kembali ke localStorage

    // Perbarui tampilan koin di UI
    document.getElementById('user-coin-display').innerText = userProfile.coins;
}

// Event listeners
window.addEventListener('load', loadUserProfile);

// Export fungsi addExperience untuk digunakan di halaman lain
export { addExperience };

// Fungsi untuk mengatur foto profil
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

    // Cek apakah URL saat ini mengandung folder 'tasks', jika iya, arahkan ke ../login.html
    const currentPath = window.location.pathname;

    // Jika berada di dalam folder 'tasks', keluar dari folder tersebut dan ke login.html
    if (currentPath.includes('tasks')) {
        window.location.href = '../login.html'; // Relative path keluar folder tasks
    } else {
        window.location.href = 'login.html'; // Path standar untuk halaman lain
    }
}

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

changeProfilePicBtn?.addEventListener('click', () => {
    profileImageInput.click(); // Membuka dialog file
});

profileImageInput?.addEventListener('change', event => {
    const file = event.target.files[0];
    handleProfilePictureUpload(file);
});

logoutBtn?.addEventListener('click', logout);
