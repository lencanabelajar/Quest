// Elemen DOM yang digunakan
const userSegmentDisplay = document.getElementById('user-segment-display');
const globalRankDisplay = document.getElementById('global-rank-display');
const segmentRankDisplay = document.getElementById('segment-rank-display');

// Data untuk segmen peringkat
const segmentRanks = {
    'pelajar': 'Edisi Pelajar - Mahasiswa',
    'pegawai': 'Edisi Pegawai Negeri ~ CPNS P3K ~ ASN',
    'pekerja': 'Edisi Pekerja Profesional - Non Pemerintahan'
};

// Fungsi untuk mendapatkan data pengguna dari localStorage
function getUserData() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userEmail = sessionStorage.getItem('userEmail');
    return users.find(user => user.email === userEmail) || null;
}

// Fungsi untuk memuat dan menampilkan peringkat pengguna
function loadUserRank() {
    const user = getUserData();

    if (user) {
        // Menampilkan segmen peringkat
        userSegmentDisplay.innerText = segmentRanks[user.segment] || 'Tidak Diketahui';

        // Menampilkan peringkat dalam segmen (misalnya, berdasarkan XP atau level)
        segmentRankDisplay.innerText = `Peringkat dalam Segmen: ${user.segmentRank || 'Tidak Diketahui'}`;

        // Menampilkan peringkat global
        globalRankDisplay.innerText = `Peringkat Global: ${user.globalRank || 'Tidak Diketahui'}`;
    } else {
        alert("Data pengguna tidak ditemukan!");
        window.location.href = "login.html";
    }
}

// Fungsi untuk menghitung dan memperbarui peringkat global dan per segmen
function updateUserRank() {
    const user = getUserData();

    if (user) {
        // Menghitung peringkat global berdasarkan XP atau level
        const allUsers = JSON.parse(localStorage.getItem('users')) || [];
        allUsers.sort((a, b) => b.totalXP - a.totalXP); // Urutkan berdasarkan totalXP

        // Temukan peringkat global pengguna
        user.globalRank = allUsers.findIndex(u => u.email === user.email) + 1;

        // Hitung peringkat berdasarkan segmen (misalnya berdasarkan XP dalam segmen tertentu)
        const segmentUsers = allUsers.filter(u => u.segment === user.segment);
        segmentUsers.sort((a, b) => b.totalXP - a.totalXP); // Urutkan berdasarkan totalXP dalam segmen

        user.segmentRank = segmentUsers.findIndex(u => u.email === user.email) + 1;

        // Simpan data pengguna yang sudah diperbarui
        saveUserProfile(user);
        loadUserRank();
    } else {
        alert("Data pengguna tidak ditemukan!");
    }
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

// Event listener untuk memuat dan memperbarui peringkat saat halaman dimuat
window.addEventListener('load', loadUserRank);
window.addEventListener('load', updateUserRank);

