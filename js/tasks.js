document.addEventListener('DOMContentLoaded', function () {
    // Ambil elemen-elemen yang diperlukan
    const taskForms = document.querySelectorAll('.task-quiz .task-form');
    const completionMessage = document.getElementById('completion-message');

    // Jawaban benar untuk setiap pertanyaan
    const tasksData = [
        { questionId: "question1", answer: "Auguste Comte", xp: 10 },
        { questionId: "question2", answer: "Teman", xp: 10 },
        { questionId: "question3", answer: "Masyarakat", xp: 10 },
        { questionId: "question4", answer: "Emile Durkheim", xp: 15 },
        { questionId: "question5", answer: "19", xp: 15 }
    ];

    // Fungsi untuk memeriksa jawaban
    function checkAnswer(taskIndex, userAnswer) {
        const task = tasksData[taskIndex];
        const feedbackElement = document.getElementById(`task-feedback${taskIndex + 1}`);
        const correctAnswer = task.answer.toLowerCase().trim();
        const xp = task.xp;
        const userAnswerTrimmed = userAnswer.toLowerCase().trim();

        feedbackElement.style.display = 'block'; // Pastikan feedback tampil

        if (userAnswerTrimmed === correctAnswer) {
            feedbackElement.textContent = "Jawaban Anda benar! Selamat!";
            feedbackElement.style.color = "green";
            storeProgress(taskIndex, true);
            addExperience(xp);  // Menambahkan XP ke profil pengguna
            lockTaskForm(taskIndex);
        } else {
            feedbackElement.textContent = "Jawaban Anda salah. Coba lagi!";
            feedbackElement.style.color = "red";
            storeProgress(taskIndex, false);
        }

        checkCompletion();
    }

    // Fungsi untuk mengunci form sehingga tidak bisa dijawab lagi
    function lockTaskForm(taskIndex) {
        const formElement = document.getElementById(`task-form${taskIndex + 1}`);
        const inputElements = formElement.querySelectorAll('input, textarea');
        const submitButton = formElement.querySelector('button[type="submit"]'); // Identifikasi tombol Kirim Jawaban
    
        inputElements.forEach(input => input.disabled = true); // Nonaktifkan input
        if (submitButton) {
            submitButton.disabled = true; // Nonaktifkan tombol Kirim Jawaban
        }
    }

    // Fungsi untuk menyimpan progres jawaban ke sessionStorage
    function storeProgress(taskIndex, isCorrect) {
        sessionStorage.setItem(`task${taskIndex + 1}Completed`, isCorrect);
    }

    // Fungsi untuk memeriksa apakah semua tugas sudah selesai
    function checkCompletion() {
        const allTasksCompleted = tasksData.every((_, index) => 
            sessionStorage.getItem(`task${index + 1}Completed`) === 'true'
        );

        if (allTasksCompleted) {
            completionMessage.style.display = 'block'; // Tampilkan pesan penyelesaian
            alert("Selamat! Anda telah menyelesaikan semua tugas.");
        }
    }

    // Event listener untuk setiap form
    taskForms.forEach((form, index) => {
        form.addEventListener('submit', function (e) {
            e.preventDefault(); // Mencegah reload halaman
            const userAnswer = document.getElementById(`answer${index + 1}`).value.trim();
            checkAnswer(index, userAnswer);
        });
    });

    // Fungsi untuk menambahkan XP ke profil pengguna
    function addExperience(points) {
        const userProfile = getUserProfile(); // Ambil data profil pengguna
        if (!userProfile) {
            alert('Pengguna tidak ditemukan!');
            return;
        }

        // Menambahkan XP dan memeriksa level up
        userProfile.currentXP += points;
        while (userProfile.currentXP >= userProfile.maxXP) {
            userProfile.currentXP -= userProfile.maxXP;
            levelUp(userProfile); // Menangani level up
        }

        // Simpan perubahan XP ke sessionStorage atau localStorage
        saveUserProfile(userProfile);

        // Update tampilan XP di halaman profil
        updateExperienceUI(userProfile);
    }

    // Fungsi untuk menangani level up
    function levelUp(userProfile) {
        userProfile.level++;
        userProfile.maxXP = Math.ceil(userProfile.maxXP * 1.2); // Meningkatkan XP untuk level berikutnya
        alert(`Selamat! Anda telah naik ke level ${userProfile.level}!`);
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

    // Ambil data profil pengguna
    function getUserProfile() {
        const userEmail = sessionStorage.getItem('userEmail');
        const users = JSON.parse(localStorage.getItem('users')) || [];
        return users.find(user => user.email === userEmail);
    }

    // Menyimpan data profil pengguna
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
