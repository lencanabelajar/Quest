document.addEventListener('DOMContentLoaded', function () {
    // Ambil elemen-elemen yang diperlukan
    const taskForms = document.querySelectorAll('.task-quiz .task-form');
    const completionMessage = document.getElementById('completion-message');

    const tasksData = [
        { questionId: "answer1", answer: "Pancasila", xp: 15 },
        { questionId: "answer2", answer: "Lima", xp: 15 },
        { questionId: "answer3", answer: "1945", xp: 15 },
        { questionId: "answer4", answer: "37", xp: 15 },
        { questionId: "answer5", answer: "Melindungi bangsa", xp: 15 },
        
        { questionId: "answer6", answer: "18", xp: 15 },
        { questionId: "answer7", answer: "KTP", xp: 15 },
        { questionId: "answer8", answer: "Kompetensi", xp: 15 },
        { questionId: "answer9", answer: "SSCASN", xp: 15 },
        { questionId: "answer10", answer: "Pengalaman kerja", xp: 15 },
        { questionId: "answer11", answer: "Portal SSCASN", xp: 15 },
        { questionId: "answer12", answer: "Disqualifikasi", xp: 20 },
        { questionId: "answer13", answer: "Tes tertulis", xp: 25 },
        { questionId: "answer14", answer: "Penilaian wawancara", xp: 20 },
        { questionId: "answer15", answer: "Ijazah", xp: 30 },
        { questionId: "answer16", answer: "Jabatan Teknis", xp: 15 },
        { questionId: "answer17", answer: "Jabatan Struktural", xp: 20 },
        { questionId: "answer18", answer: "Guru", xp: 25 },
        { questionId: "answer19", answer: "Jabatan Teknis", xp: 20 },
        { questionId: "answer20", answer: "Peningkatan Kualifikasi", xp: 30 },
        { questionId: "answer21", answer: "Gaji Tunjangan", xp: 15 },
        { questionId: "answer22", answer: "BPJS Kesehatan", xp: 20 },
        { questionId: "answer23", answer: "Cuti Hak", xp: 25 },
        { questionId: "answer24", answer: "Mematuhi Aturan", xp: 20 },
        { questionId: "answer25", answer: "Tanggung Jawab", xp: 30 },
        { questionId: "answer25", answer: "Pelatihan Pendidikan", xp: 15 },
        { questionId: "answer26", answer: "Persyaratan Kinerja", xp: 20 },
        { questionId: "answer27", answer: "Prestasi Kerja", xp: 25 },
        { questionId: "answer28", answer: "Pendidikan Pengalaman", xp: 20 },
        { questionId: "answer29", answer: "Kesempatan Promosi", xp: 30 },
        { questionId: "answer30", answer: "Birokrasi Lambat", xp: 15 },
        { questionId: "answer31", answer: "Mobilitas Tinggi", xp: 20 },
        { questionId: "answer32", answer: "Ketidakpastian Kontrak", xp: 25 },
        { questionId: "answer33", answer: "Manajemen Waktu", xp: 20 },
        { questionId: "answer34", answer: "Adaptasi Cepat", xp: 30 }
    ];

    // Fungsi untuk memeriksa jawaban
function checkAnswer(taskIndex, userAnswer) {
    const task = tasksData[taskIndex];
    const feedbackElement = document.getElementById(`task-feedback${taskIndex + 1}`);
    const correctAnswer = task.answer.toLowerCase().trim();
    const xp = task.xp;
    const userAnswerTrimmed = userAnswer.toLowerCase().trim();

    feedbackElement.style.display = 'block';

    if (userAnswerTrimmed === correctAnswer) {
        feedbackElement.textContent = "Jawaban Anda benar! Selamat!";
        feedbackElement.style.color = "green";
        storeProgress(taskIndex, true);
        addExperience(xp);
        lockTaskForm(taskIndex);

        // Cek jika taskIndex antara 0 dan 94 (answer1 sampai answer95)
        if (taskIndex >= 0 && taskIndex <= 33) {
            giveSociologyBadge(); // Fungsi untuk memberikan badge
        }
    } else {
        feedbackElement.textContent = "Jawaban Anda salah. Coba lagi!";
        feedbackElement.style.color = "red";
        storeProgress(taskIndex, false);
    }

    checkCompletion();
}

// Fungsi untuk memberikan badge "LENCANA PENGANTAR PPPK" dengan gambar dan nama pengguna
function giveSociologyBadge() {
    const badgeContainer = document.getElementById('badge-container');
    
    // Cek jika badge sudah ada
    if (!badgeContainer.classList.contains('badge-animation')) {
        const userProfile = getUserProfile(); // Ambil profil pengguna
        if (!userProfile) {
            console.error("Profil pengguna tidak ditemukan!");
            return;
        }

        // Membuat elemen badge baru
        const badge = document.createElement('div');
        badge.classList.add('badge');
        
        // Membuat elemen gambar
        const badgeImage = document.createElement('img');
        badgeImage.src = 'https://raw.githubusercontent.com/username/repository/branch/assets/icon/PPPK1.jpg';  // Ganti URL sesuai dengan path gambar Anda di GitHub
        badgeImage.alt = 'LENCANA PENGANTAR PPPK';
        badgeImage.classList.add('badge-image'); // Anda bisa menambahkan class untuk styling

        // Membuat elemen teks dengan nama pengguna
        const badgeText = document.createElement('p');
        badgeText.classList.add('badge-text');
        badgeText.textContent = `LENCANA PENGANTAR PPPK - ${userProfile.name}`;

        // Menambahkan gambar dan teks ke dalam badge
        badge.appendChild(badgeImage);
        badge.appendChild(badgeText);

        // Menambahkan badge ke badge container
        badgeContainer.appendChild(badge);
        badgeContainer.style.display = 'block';
        badgeContainer.classList.add('badge-animation');

        // Menghilangkan animasi setelah beberapa detik
        setTimeout(() => badgeContainer.classList.remove('badge-animation'), 2000);
    }
}

    // Fungsi untuk mengunci form
    function lockTaskForm(taskIndex) {
        const formElement = document.getElementById(`task-form${taskIndex + 1}`);
        const inputElements = formElement.querySelectorAll('input, textarea');
        const submitButton = formElement.querySelector('button[type="submit"]');
    
        inputElements.forEach(input => input.disabled = true);
        if (submitButton) {
            submitButton.disabled = true;
        }
    }

    // Fungsi untuk menyimpan progres
    function storeProgress(taskIndex, isCorrect) {
        sessionStorage.setItem(`task${taskIndex + 1}Completed`, isCorrect);
    }

    // Fungsi untuk memeriksa apakah semua tugas selesai
    function checkCompletion() {
        const allTasksCompleted = tasksData.every((_, index) =>
            sessionStorage.getItem(`task${index + 1}Completed`) === 'true'
        );

        if (allTasksCompleted) {
            completionMessage.style.display = 'block';
            alert("Selamat! Anda telah menyelesaikan semua tugas.");
            showBadge();
        }
    }

    // Fungsi untuk menampilkan badge
    function showBadge() {
        const badgeContainer = document.getElementById('badge-container');
        badgeContainer.style.display = 'block';
        badgeContainer.classList.add('badge-animation');
        setTimeout(() => badgeContainer.classList.remove('badge-animation'), 2000);
    }

    // Event listener untuk setiap form
    taskForms.forEach((form, index) => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const userAnswer = document.getElementById(`answer${index + 1}`).value.trim();
            checkAnswer(index, userAnswer);
        });
    });

    // Fungsi untuk menambahkan XP ke profil pengguna
    function addExperience(points) {
        const userProfile = getUserProfile();
        if (!userProfile) {
            alert('Pengguna tidak ditemukan!');
            return;
        }

        userProfile.currentXP += points;
        while (userProfile.currentXP >= userProfile.maxXP) {
            userProfile.currentXP -= userProfile.maxXP;
            levelUp(userProfile);
        }

        saveUserProfile(userProfile);
        updateExperienceUI(userProfile);
    }

    // Fungsi untuk menangani level up
    function levelUp(userProfile) {
        userProfile.level++;
        userProfile.maxXP = Math.ceil(userProfile.maxXP * 1.2);
        alert(`Selamat! Anda telah naik ke level ${userProfile.level}!`);

        const levelDisplay = document.getElementById('user-level-display');
        if (levelDisplay) {
            levelDisplay.classList.add('level-up-animation');
            setTimeout(() => levelDisplay.classList.remove('level-up-animation'), 1000);
        }
    }

    // Fungsi untuk memperbarui tampilan XP di halaman profil
    function updateExperienceUI(userProfile) {
        const expDisplay = document.getElementById('exp-display');
        const expBarFill = document.getElementById('exp-bar-fill');
        const userLevelDisplay = document.getElementById('user-level-display');

        expDisplay.innerText = userProfile.currentXP;
        userLevelDisplay.innerText = userProfile.level;
        expBarFill.style.width = `${(userProfile.currentXP / userProfile.maxXP) * 100}%`;
    }

    // Fungsi untuk mengambil profil pengguna
    function getUserProfile() {
        try {
            const userEmail = sessionStorage.getItem('userEmail');
            const users = JSON.parse(localStorage.getItem('users')) || [];
            return users.find(user => user.email === userEmail);
        } catch (error) {
            console.error('Gagal mengambil profil pengguna:', error);
            return null;
        }
    }

    // Fungsi untuk menyimpan profil pengguna
    function saveUserProfile(updatedUser) {
        try {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(user => user.email === updatedUser.email);

            if (userIndex !== -1) {
                users[userIndex] = updatedUser;
                localStorage.setItem('users', JSON.stringify(users));
            } else {
                console.error('Pengguna tidak ditemukan saat menyimpan profil.');
            }
        } catch (error) {
            console.error('Gagal menyimpan profil pengguna:', error);
        }
    }

    // Muat progres sebelumnya saat halaman dimuat
    loadPreviousProgress();
    function loadPreviousProgress() {
        tasksData.forEach((_, index) => {
            const taskCompleted = sessionStorage.getItem(`task${index + 1}Completed`);
            const feedbackElement = document.getElementById(`task-feedback${index + 1}`);
            const formElement = document.getElementById(`task-form${index + 1}`);

            if (taskCompleted === 'true') {
                feedbackElement.textContent = "Jawaban Anda benar! Selamat!";
                feedbackElement.style.color = "green";
                feedbackElement.style.display = 'block';
                lockTaskForm(index);
            } else if (taskCompleted === 'false') {
                feedbackElement.textContent = "Jawaban Anda salah. Coba lagi!";
                feedbackElement.style.color = "red";
                feedbackElement.style.display = 'block';
            }
        });
    }
});
