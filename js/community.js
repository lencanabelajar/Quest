// Elemen DOM
const commentList = document.getElementById('comment-list');
const commentInput = document.getElementById('comment-input');
const submitCommentButton = document.getElementById('submit-comment');
const membersList = document.getElementById('members-list');
const joinEventButtons = document.querySelectorAll('.join-event-btn');

// Fungsi untuk menampilkan komentar
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

// Fungsi untuk mengambil komentar dari API Netlify Functions
async function loadComments() {
    try {
        const response = await fetch('/api/getComments'); // Memanggil API Netlify Functions
        const comments = await response.json();
        displayComments(comments);
    } catch (error) {
        console.error('Error loading comments: ', error);
        alert('Failed to load comments: ' + error.message);
    }
}

// Fungsi untuk mengirimkan komentar baru ke API
async function handlePostComment() {
    const commentText = commentInput.value.trim();
    if (commentText) {
        const newComment = {
            username: 'Pengguna', // Sesuaikan dengan nama pengguna yang sedang login
            text: commentText,
        };

        try {
            const response = await fetch('/api/postComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newComment),
            });

            if (!response.ok) {
                throw new Error('Failed to post comment');
            }

            loadComments(); // Memuat komentar setelah berhasil diposting
            commentInput.value = ''; // Kosongkan input
        } catch (error) {
            console.error('Error posting comment: ', error);
            alert('Failed to post comment: ' + error.message);
        }
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

// Fungsi untuk mengambil anggota komunitas dari API
async function loadMembers() {
    try {
        const response = await fetch('/api/getMembers');
        const members = await response.json();
        displayMembers(members);
    } catch (error) {
        console.error('Error loading members: ', error);
        alert('Failed to load members: ' + error.message);
    }
}

// Fungsi untuk bergabung dalam acara komunitas
async function handleJoinEvent(event) {
    const eventName = event.target.previousElementSibling.innerText;
    alert(`Anda telah bergabung dalam acara: ${eventName}`);

    try {
        const response = await fetch('/api/joinEvent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ eventName }),
        });

        if (!response.ok) {
            throw new Error('Failed to join event');
        }
        alert('Anda berhasil bergabung dalam acara!');
    } catch (error) {
        console.error('Error joining event: ', error);
        alert('Failed to join event: ' + error.message);
    }
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
