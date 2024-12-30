// Ambil elemen-elemen yang diperlukan
const taskForm = document.getElementById('task-form');
const answerInput = document.getElementById('answer');
const taskFeedback = document.getElementById('task-feedback');
const completionMessage = document.getElementById('completion-message');

// Fungsi untuk memverifikasi jawaban pengguna
function checkAnswer(userAnswer) {
    const correctAnswer = "Aset Pertanian Bronze";  // Jawaban yang benar
    if (userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
        return true;
    }
    return false;
}

// Fungsi untuk menangani pengiriman jawaban
taskForm.addEventListener('submit', (event) => {
    event.preventDefault();  // Mencegah pengiriman form default
    const userAnswer = answerInput.value;

    // Verifikasi jawaban pengguna
    if (checkAnswer(userAnswer)) {
        taskFeedback.style.display = 'block';
        taskFeedback.textContent = "Jawaban benar! Selamat Anda telah menyelesaikan tugas ini.";
        taskFeedback.style.color = 'green';
        completionMessage.style.display = 'block';
    } else {
        taskFeedback.style.display = 'block';
        taskFeedback.textContent = "Jawaban salah, coba lagi.";
        taskFeedback.style.color = 'red';
    }
});
