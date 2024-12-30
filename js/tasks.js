// Ambil elemen-elemen yang diperlukan
const taskForm = document.getElementById('task-form');
const answerInput = document.getElementById('answer');
const taskFeedback = document.getElementById('task-feedback');
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

    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        feedbackElement.textContent = "Jawaban Anda benar! Selamat!";
        feedbackElement.style.color = "green";
    } else {
        feedbackElement.textContent = "Jawaban Anda salah. Coba lagi!";
        feedbackElement.style.color = "red";
    }

    feedbackElement.style.display = 'block';
}

// Event listeners untuk setiap form
document.getElementById('task-form-1').addEventListener('submit', function(e) {
    e.preventDefault();
    checkAnswer('answer1', 'task-feedback1', correctAnswers.question1);
});

document.getElementById('task-form-2').addEventListener('submit', function(e) {
    e.preventDefault();
    checkAnswer('answer2', 'task-feedback2', correctAnswers.question2);
});

document.getElementById('task-form-3').addEventListener('submit', function(e) {
    e.preventDefault();
    checkAnswer('answer3', 'task-feedback3', correctAnswers.question3);
});

document.getElementById('task-form-4').addEventListener('submit', function(e) {
    e.preventDefault();
    checkAnswer('answer4', 'task-feedback4', correctAnswers.question4);
});

document.getElementById('task-form-5').addEventListener('submit', function(e) {
    e.preventDefault();
    checkAnswer('answer5', 'task-feedback5', correctAnswers.question5);
});

document.getElementById('task-form-6').addEventListener('submit', function(e) {
    e.preventDefault();
    checkAnswer('answer6', 'task-feedback6', correctAnswers.question6);
});
