document.addEventListener('DOMContentLoaded', function () {
    // Ambil elemen-elemen yang diperlukan
    const taskForms = document.querySelectorAll('.task-quiz .task-form');
    const completionMessage = document.getElementById('completion-message');

    const tasksData = [
        { questionId: "answer1", answer: "Auguste Comte", xp: 10 },
        { questionId: "answer2", answer: "Teman", xp: 10 },
        { questionId: "answer3", answer: "Masyarakat", xp: 10 },
        { questionId: "answer4", answer: "Emile Durkheim", xp: 15 },
        { questionId: "answer5", answer: "19", xp: 15 },
        { questionId: "answer6", answer: "Antropologi", xp: 10 },
        { questionId: "answer7", answer: "Kekuasaan", xp: 10 },
        { questionId: "answer8", answer: "Perilaku", xp: 10 },
        { questionId: "answer9", answer: "Ekonomi", xp: 15 },
        { questionId: "answer10", answer: "Sejarah", xp: 15 },
        { questionId: "answer11", answer: "Kuantitatif", xp: 10 },
        { questionId: "answer12", answer: "Observasi", xp: 15 },
        { questionId: "answer13", answer: "Kualitatif", xp: 10 },
        { questionId: "answer14", answer: "Survei", xp: 10 },
        { questionId: "answer15", answer: "Identifikasi", xp: 15 },
        { questionId: "answer16", answer: "Konflik", xp: 15 },
        { questionId: "answer17", answer: "Nilai", xp: 10 },
        { questionId: "answer18", answer: "Budaya", xp: 15 },           
        { questionId: "answer19", answer: "Nilai", xp: 30 },
        { questionId: "answer20", answer: "George Herbert Mead", xp: 30 },
        { questionId: "answer21", answer: "Keluarga", xp: 5 },
        { questionId: "answer22", answer: "Identitas Sosial", xp: 10 },
        { questionId: "answer23", answer: "Albert Bandura", xp: 15 },
        { questionId: "answer24", answer: "Simbol", xp: 15 },
        { questionId: "answer25", answer: "Perilaku", xp: 15 },
        { questionId: "answer26", answer: "Kebutuhan", xp: 15 },
        { questionId: "answer27", answer: "Ascribed", xp: 15 },
        { questionId: "answer28", answer: "Status", xp: 15 },
        { questionId: "answer29", answer: "Pengetahuan", xp: 15 },
        { questionId: "answer30", answer: "Terkait", xp: 15 },
        { questionId: "answer31", answer: "Horizontal", xp: 15 },
        { questionId: "answer32", answer: "Kekayaan", xp: 15 },
        { questionId: "answer33", answer: "Perbedaan", xp: 15 },
        { questionId: "answer34", answer: "Menengah", xp: 15 },
        { questionId: "answer35", answer: "Keragaman", xp: 15 },
        { questionId: "answer36", answer: "Mobilitas Vertikal", xp: 15 },
        { questionId: "answer37", answer: "Antargenerasi", xp: 15 },
        { questionId: "answer38", answer: "Pendidikan", xp: 15 },
        { questionId: "answer39", answer: "Intragenerasi", xp: 15 },
        { questionId: "answer40", answer: "Mengurangi Ketimpangan", xp: 15 },
        { questionId: "answer41", answer: "Kelompok Primer", xp: 15 },
        { questionId: "answer42", answer: "Organisasi Formal", xp: 15 },
        { questionId: "answer43", answer: "Kelompok Sekunder", xp: 15 },
        { questionId: "answer44", answer: "Organisasi Informal", xp: 15 },
        { questionId: "answer45", answer: "Jaringan Sosial", xp: 15 },
        { questionId: "answer46", answer: "Interaksionisme Simbolik", xp: 15 },
        { questionId: "answer47", answer: "Pertukaran Sosial", xp: 15 },
        { questionId: "answer48", answer: "Teori Konflik", xp: 15 },
        { questionId: "answer49", answer: "Konstruksionisme Sosial", xp: 15 },
        { questionId: "answer50", answer: "Fenomenologi", xp: 15 },
        { questionId: "answer96", answer: "Kontrak kerja", xp: 15 },
        { questionId: "answer97", answer: "Kepegawaian tetap", xp: 15 },
        { questionId: "answer98", answer: "Guru", xp: 15 },
        { questionId: "answer99", answer: "Pengembangan SDM", xp: 15 },
        { questionId: "answer100", answer: "Hak gaji", xp: 15 }
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
        } else {
            feedbackElement.textContent = "Jawaban Anda salah. Coba lagi!";
            feedbackElement.style.color = "red";
            storeProgress(taskIndex, false);
        }

        checkCompletion();
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
