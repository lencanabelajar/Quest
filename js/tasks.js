import { getTasks, submitTaskAnswer } from './firebase.js';

// Elements for displaying tasks
const tasksContainer = document.getElementById('tasks-container');
const taskAnswerForm = document.getElementById('task-answer-form');

// Load tasks from Firebase
window.addEventListener('load', () => {
  getTasks().then(tasks => {
    tasks.forEach(task => {
      const taskElement = document.createElement('div');
      taskElement.classList.add('task-item');
      taskElement.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
      `;
      tasksContainer.appendChild(taskElement);
    });
  });
});

// Handle task submission
taskAnswerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const taskId = event.target.taskId.value;
  const answer = event.target.answer.value;

  submitTaskAnswer(taskId, answer)
    .then(() => {
      alert('Task submitted successfully!');
    })
    .catch(error => {
      alert('Task submission failed: ' + error.message);
    });
});
