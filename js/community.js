// Import dari airtable.js untuk mengakses data
import { getForumComments, postComment, getCommunityMembers } from './airtable.js';

// Elemen DOM
const commentList = document.getElementById('comment-list');
const commentInput = document.getElementById('comment-input');
const submitCommentButton = document.getElementById('submit-comment');
const membersList = document.getElementById('members-list');
const joinEventButtons = document.querySelectorAll('.join-event-btn');

// Fungsi untuk menampilkan komentar di forum
function displayComments(comments) {
    commentList.innerHTML = ''; // Bersihkan komentar lama
    comments.forEach(comment => {
        const commentElement = document.createElement('li');
        commentElement.innerHTML = `
            <strong>${comment.username}</strong>: ${comment.text}
        `;
        commentList.appendChild(commentElement);
    });
}

// Fungsi untuk mengambil komentar dari Airtable (atau sumber lain)
function loadComments() {
    getForumComments()
        .then(comments => {
            displayComments(comments);
        })
        .catch(error => {
            console.error('Gagal mengambil komentar: ', error);
        });
}

// Fungsi untuk mengirimkan komentar baru
function handlePostComment() {
    const commentText = commentInput.value.trim();
    if (commentText) {
        const newComment = {
            username: 'Pengguna', // Sesuaikan dengan nama pengguna yang sedang login
            text: commentText,
        };

        postComment(newComment)
            .then(() => {
                loadComments(); // Muat ulang komentar setelah berhasil mengirim
                commentInput.value = ''; // Kosongkan input
            })
            .catch(error => {
                console.error('Gagal mengirim komentar: ', error);
            });
    }
}

// Fungsi untuk menampilkan anggota komunitas
function displayMembers(members) {
    membersList.innerHTML = ''; // Bersihkan daftar anggota lama
    members.forEach(member => {
        const memberElement = document.createElement('div');
        memberElement.classList.add('community-member');
        memberElement.innerHTML = `
            <img src="${member.avatar}" alt="${member.username}" class="member-avatar">
            <strong>${member.username}</strong> - ${member.level} Level
        `;
        membersList.appendChild(memberElement);
    });
}

// Fungsi untuk mengambil anggota komunitas dari Airtable
function loadMembers() {
    getCommunityMembers()
        .then(members => {
            displayMembers(members);
        })
        .catch(error => {
            console.error('Gagal mengambil anggota komunitas: ', error);
        });
}

// Fungsi untuk bergabung dalam acara komunitas
function handleJoinEvent(event) {
    const eventName = event.target.previousElementSibling.innerText;
    alert(`Anda telah bergabung dalam acara: ${eventName}`);
    // Proses bergabung bisa ditambahkan di sini, misalnya menambah ke Airtable atau backend
}

// Mengikat event listener ke tombol Kirim Komentar
submitCommentButton.addEventListener('click', handlePostComment);

// Mengikat event listener ke tombol Bergabung dalam acara
joinEventButtons.forEach(button => {
    button.addEventListener('click', handleJoinEvent);
});

// Load komentar dan anggota saat halaman dimuat
window.addEventListener('load', () => {
    loadComments();
    loadMembers();
});
