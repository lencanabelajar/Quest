// Elemen DOM
const commentList = document.getElementById('comment-list');
const commentInput = document.getElementById('comment-input');
const submitCommentButton = document.getElementById('submit-comment');
const membersList = document.getElementById('members-list');
const joinEventButtons = document.querySelectorAll('.join-event-btn');

// Simulasi data komentar (bisa diganti dengan API atau database lainnya)
const commentsData = [
    { username: 'Alice', text: 'Ini adalah komentar pertama!' },
    { username: 'Bob', text: 'Menarik sekali diskusi ini.' },
    { username: 'Charlie', text: 'Saya setuju dengan pendapat Bob.' }
];

// Simulasi data anggota komunitas
const membersData = [
    { username: 'Alice', avatar: 'https://example.com/avatar1.jpg', level: 5 },
    { username: 'Bob', avatar: 'https://example.com/avatar2.jpg', level: 3 },
    { username: 'Charlie', avatar: 'https://example.com/avatar3.jpg', level: 2 }
];

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

// Fungsi untuk mengambil komentar dari sumber data
function loadComments() {
    // Di sini, Anda bisa menggantikan data statis dengan API call jika ada
    displayComments(commentsData);
}

// Fungsi untuk mengirimkan komentar baru
function handlePostComment() {
    const commentText = commentInput.value.trim();
    if (commentText) {
        const newComment = {
            username: 'Pengguna', // Sesuaikan dengan nama pengguna yang sedang login
            text: commentText,
        };

        // Simulasi mengirim komentar baru
        commentsData.push(newComment); // Menambahkan komentar ke data statis
        displayComments(commentsData); // Update tampilan komentar
        commentInput.value = ''; // Kosongkan input
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

// Fungsi untuk mengambil anggota komunitas dari sumber data
function loadMembers() {
    // Di sini, Anda bisa menggantikan data statis dengan API call jika ada
    displayMembers(membersData);
}

// Fungsi untuk bergabung dalam acara komunitas
function handleJoinEvent(event) {
    const eventName = event.target.previousElementSibling.innerText;
    alert(`Anda telah bergabung dalam acara: ${eventName}`);
    // Proses bergabung bisa ditambahkan di sini, misalnya menambah ke database atau backend
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
