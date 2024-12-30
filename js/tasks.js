// Ambil elemen-elemen yang diperlukan
const taskForms = document.querySelectorAll('.task-quiz form');
const taskFeedbackElements = document.querySelectorAll('.task-feedback');
const completionMessage = document.getElementById('completion-message');

// Jawaban yang benar untuk setiap pertanyaan
const correctAnswers = {
    question1: "Aset Pertanian Bronze adalah kategori aset pertanian yang memiliki nilai tinggi dan memiliki potensi pengelolaan yang baik.",
    question2: "Keuntungan Aset Pertanian Bronze termasuk nilai tinggi dan potensi pengelolaan yang menguntungkan.",
    question3: "Aset Pertanian Bronze dikelola oleh pemerintah dan perusahaan agribisnis.",
    question4: "Manfaat mengelola Aset Pertanian Bronze adalah meningkatkan pendapatan petani dan mendukung keberlanjutan pertanian.",
    question5: "Untuk memulai investasi Aset Pertanian Bronze, Anda harus bekerja sama dengan perusahaan agribisnis dan memanfaatkan teknologi pertanian.",
    question6: "Tantangan dalam mengelola Aset Pertanian Bronze termasuk perubahan iklim dan ketidakstabilan harga pasar."
};

// Fungsi untuk memeriksa jawaban
function checkAnswer(inputId, feedbackId, correctAnswer) {
    const userAnswer = document.getElementById(inputId).value.trim();
    const feedbackElement = document.getElementById(feedbackId);

    // Memberikan umpan balik setelah pemeriksaan jawaban
    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        feedbackElement.textContent = "Jawaban Anda benar! Selamat!";
        feedbackElement.style.color = "green";
        feedbackElement.style.display = 'block';
        storeProgress(inputId, true);
    } else {
        feedbackElement.textContent = "Jawaban Anda salah. Coba lagi!";
        feedbackElement.style.color = "red";
        feedbackElement.style.display = 'block';
        storeProgress(inputId, false);
    }

    checkCompletion();
}

// Fungsi untuk menyimpan progres jawaban ke sessionStorage
function storeProgress(inputId, isCorrect) {
    const taskNumber = inputId.replace('answer', '');
    sessionStorage.setItem(`task${taskNumber}Completed`, isCorrect);
}

// Fungsi untuk memeriksa apakah semua tugas sudah selesai
function checkCompletion() {
    let allTasksCompleted = true;

    // Memeriksa semua tugas yang ada apakah sudah selesai
    for (let i = 1; i <= 6; i++) {
        if (sessionStorage.getItem(`task${i}Completed`) !== 'true') {
            allTasksCompleted = false;
            break;
        }
    }

    // Menampilkan pesan penyelesaian jika semua tugas sudah selesai
    if (allTasksCompleted) {
        completionMessage.style.display = 'block';
    }
}

// Event listeners untuk setiap form
taskForms.forEach((form, index) => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const answerId = `answer${index + 1}`;
        const feedbackId = `task-feedback${index + 1}`;
        checkAnswer(answerId, feedbackId, correctAnswers[`question${index + 1}`]);
    });
});

// Jika sebelumnya sudah ada progres, tampilkan feedbacknya
function loadPreviousProgress() {
    for (let i = 1; i <= 6; i++) {
        const taskCompleted = sessionStorage.getItem(`task${i}Completed`);
        const feedbackElement = document.getElementById(`task-feedback${i}`);

        if (taskCompleted === 'true') {
            feedbackElement.textContent = "Jawaban Anda benar! Selamat!";
            feedbackElement.style.color = "green";
            feedbackElement.style.display = 'block';
        } else if (taskCompleted === 'false') {
            feedbackElement.textContent = "Jawaban Anda salah. Coba lagi!";
            feedbackElement.style.color = "red";
            feedbackElement.style.display = 'block';
        }
    }
}

// Load progres sebelumnya ketika halaman dimuat
loadPreviousProgress();
