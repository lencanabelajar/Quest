document.addEventListener('DOMContentLoaded', function () {
    // Ambil elemen-elemen yang diperlukan
    const taskForms = document.querySelectorAll('.task-quiz .task-form');
    const completionMessage = document.getElementById('completion-message');

    const tasksData = [
        { questionId: "answer1", correctAnswer: "Pancasila", options: ["Pancasila", "UUD 1945", "Bhinneka Tunggal Ika", "Sumpah Pemuda"], xp: 15 },
        { questionId: "answer2", correctAnswer: "5", options: ["1", "3", "5", "7"], xp: 10 },
        { questionId: "answer3", correctAnswer: "1945", options: ["1945", "1949", "1950", "1965"], xp: 15 },
        { questionId: "answer4", correctAnswer: "37", options: ["16", "31", "37", "45"], xp: 15 },
        { questionId: "answer5", correctAnswer: "Mencerdaskan kehidupan bangsa", options: ["Melindungi segenap bangsa Indonesia", "Mencerdaskan kehidupan bangsa", "Menjaga persatuan bangsa", "Memajukan kesejahteraan umum"], xp: 15 },
        { questionId: "answer6", correctAnswer: "Kewenangan pemerintah daerah untuk mengatur sendiri urusan daerah", options: ["Kewenangan pemerintah daerah untuk mengatur sendiri urusan daerah", "Pengaturan urusan pemerintahan oleh pemerintah pusat", "Pemisahan kekuasaan antara pemerintah pusat dan daerah", "Pemerintahan daerah yang tidak terikat pada aturan negara"], xp: 15 },
        { questionId: "answer7", correctAnswer: "3", options: ["1", "2", "3", "4"], xp: 10 },
        { questionId: "answer8", correctAnswer: "Gubernur", options: ["Gubernur", "Bupati", "Walikota", "Presiden"], xp: 10 },
        { questionId: "answer9", correctAnswer: "Memberikan kebebasan kepada daerah untuk mengatur urusan lokal", options: ["Memusatkan semua kewenangan pada pemerintah pusat", "Memberikan kebebasan kepada daerah untuk mengatur urusan lokal", "Menambah kewenangan pemerintah daerah di semua sektor", "Menyatukan sistem pemerintahan nasional dan daerah"], xp: 20 }
    ];

    // Fungsi untuk memeriksa jawaban
    function checkAnswer(taskIndex, userAnswer) {
        const task = tasksData[taskIndex];
        const feedbackElement = document.getElementById(`task-feedback${taskIndex + 1}`);
        const correctAnswer = task.correctAnswer.toLowerCase().trim();
        const xp = task.xp;
        const userAnswerTrimmed = userAnswer.toLowerCase().trim();

        feedbackElement.style.display = 'block';

        if (userAnswerTrimmed === correctAnswer) {
            feedbackElement.textContent = "Jawaban Anda benar! Selamat!";
            feedbackElement.style.color = "green";
            storeProgress(taskIndex, true);
            addExperience(xp);
            lockTaskForm(taskIndex);

            // Cek jika taskIndex antara 0 dan 33 (answer1 sampai answer34)
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

        console.log(`Mengunci form untuk task ${taskIndex + 1}`);

        if (formElement) {
            inputElements.forEach(input => {
                input.disabled = true;
                console.log(`Menonaktifkan input: ${input.name || input.id}`);
            });
            if (submitButton) {
                submitButton.disabled = true;
                console.log('Menonaktifkan tombol submit');
            }
        } else {
            console.error(`Form untuk task ${taskIndex + 1} tidak ditemukan`);
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

            // Ambil jawaban yang dipilih dari radio button
            const userAnswer = document.querySelector(`input[name="answer${index + 1}"]:checked`);

            if (userAnswer) {
                checkAnswer(index, userAnswer.value);
            } else {
                const feedbackElement = document.getElementById(`task-feedback${index + 1}`);
                feedbackElement.textContent = "Silakan pilih jawaban!";
                feedbackElement.style.color = "orange";
                feedbackElement.style.display = 'block';
            }
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
