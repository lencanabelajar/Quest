import { addExperience } from './profil.js'; // Jika ingin menambahkan XP

// Ambil elemen-elemen yang diperlukan
const taskForms = document.querySelectorAll('.task-quiz form');
const completionMessage = document.getElementById('completion-message');

// Jawaban benar untuk setiap pertanyaan
const tasksData = [
    {
        questionId: "question1",
        answer: "Aset Pertanian Bronze adalah kategori aset pertanian yang memiliki nilai tinggi dan memiliki potensi pengelolaan yang baik.",
        xp: 10 // XP yang diberikan untuk jawaban benar
    },
    {
        questionId: "question2",
        answer: "Keuntungan Aset Pertanian Bronze termasuk nilai tinggi dan potensi pengelolaan yang menguntungkan.",
        xp: 10
    },
    {
        questionId: "question3",
        answer: "Aset Pertanian Bronze dikelola oleh pemerintah dan perusahaan agribisnis.",
        xp: 10
    },
    {
        questionId: "question4",
        answer: "Manfaat mengelola Aset Pertanian Bronze adalah meningkatkan pendapatan petani dan mendukung keberlanjutan pertanian.",
        xp: 15
    },
    {
        questionId: "question5",
        answer: "Untuk memulai investasi Aset Pertanian Bronze, Anda harus bekerja sama dengan perusahaan agribisnis dan memanfaatkan teknologi pertanian.",
        xp: 15
    },
    {
        questionId: "question6",
        answer: "Tantangan dalam mengelola Aset Pertanian Bronze termasuk perubahan iklim dan ketidakstabilan harga pasar.",
        xp: 20
    }
];

// Fungsi untuk memeriksa jawaban
function checkAnswer(taskIndex, userAnswer) {
    const task = tasksData[taskIndex];
    const feedbackElement = document.getElementById(`task-feedback${taskIndex + 1}`);
    const correctAnswer = task.answer.toLowerCase().trim();
    const xp = task.xp;

    // Validasi jawaban
    if (userAnswer.toLowerCase().trim() === correctAnswer) {
        feedbackElement.textContent = "Jawaban Anda benar! Selamat!";
        feedbackElement.style.color = "green";
        feedbackElement.style.display = 'block';

        // Simpan progres dan tambahkan XP
        storeProgress(taskIndex, true);
        addExperience(xp); // Tambahkan XP ke profil
    } else {
        feedbackElement.textContent = "Jawaban Anda salah. Coba lagi!";
        feedbackElement.style.color = "red";
        feedbackElement.style.display = 'block';
        storeProgress(taskIndex, false);
    }

    checkCompletion(); // Periksa apakah semua tugas sudah selesai
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
        alert("Selamat! Anda telah menyelesaikan semua tugas."); // Notifikasi penyelesaian
    }
}

// Fungsi untuk memuat progres sebelumnya
function loadPreviousProgress() {
    tasksData.forEach((_, index) => {
        const taskCompleted = sessionStorage.getItem(`task${index + 1}Completed`);
        const feedbackElement = document.getElementById(`task-feedback${index + 1}`);

        if (taskCompleted === 'true') {
            feedbackElement.textContent = "Jawaban Anda benar! Selamat!";
            feedbackElement.style.color = "green";
            feedbackElement.style.display = 'block';
        } else if (taskCompleted === 'false') {
            feedbackElement.textContent = "Jawaban Anda salah. Coba lagi!";
            feedbackElement.style.color = "red";
            feedbackElement.style.display = 'block';
        }
    });
}

// Event listener untuk setiap form
taskForms.forEach((form, index) => {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const userAnswer = document.getElementById(`answer${index + 1}`).value.trim();
        checkAnswer(index, userAnswer);
    });
});

// Muat progres sebelumnya saat halaman dimuat
loadPreviousProgress();
