// Elemen untuk menampilkan daftar tugas
const tasksContainer = document.getElementById('tasks-container');

// Fungsi untuk memuat tugas dari Netlify Functions
async function loadTasks() {
  try {
    const response = await fetch('/api/getTasks'); // Memanggil API Netlify Functions
    const tasks = await response.json();

    if (tasks.length === 0) {
      tasksContainer.innerHTML = '<p>No tasks available at the moment. Please check back later!</p>';
      return;
    }

    tasks.forEach(task => {
      const taskElement = document.createElement('div');
      taskElement.classList.add('task-item');

      taskElement.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p><strong>Difficulty: </strong>${task.difficulty || 'Unknown'}</p>
        <button class="start-task-btn" data-task-id="${task.id}">Start Task</button>
        <div id="task-${task.id}" class="task-details" style="display:none;">
          <p><strong>Question:</strong> ${task.question}</p>
          <form id="task-answer-form-${task.id}" class="task-answer-form">
            <input type="text" name="answer" placeholder="Your answer" required>
            <input type="hidden" name="taskId" value="${task.id}">
            <button type="submit">Submit Answer</button>
          </form>
        </div>
      `;

      // Attach event listener to the start task button
      const startTaskBtn = taskElement.querySelector('.start-task-btn');
      startTaskBtn.addEventListener('click', () => {
        const taskDetails = taskElement.querySelector('.task-details');
        taskDetails.style.display = 'block';
        startTaskBtn.style.display = 'none';
      });

      // Attach event listener to the answer form submission
      const taskForm = taskElement.querySelector('.task-answer-form');
      taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const taskId = event.target.taskId.value;
        const answer = event.target.answer.value;

        submitTaskAnswer(taskId, answer);
      });

      tasksContainer.appendChild(taskElement);
    });
  } catch (error) {
    console.error('Error loading tasks: ', error);
    alert('Failed to load tasks: ' + error.message);
  }
}

// Fungsi untuk mengirim jawaban tugas
async function submitTaskAnswer(taskId, answer) {
  try {
    const response = await fetch('/api/submitTaskAnswer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taskId, answer }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit task answer');
    }

    const data = await response.json();
    alert('Task answer submitted successfully!');
  } catch (error) {
    console.error('Error submitting task answer: ', error);
    alert('Task submission failed: ' + error.message);
  }
}

// Memuat tugas saat halaman dimuat
window.addEventListener('load', loadTasks);
