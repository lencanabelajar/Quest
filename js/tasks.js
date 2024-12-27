// Import Firebase functions from airtable.js
import { getTasks, submitTaskAnswer } from './airtable.js';

// Elements for displaying tasks and task submission
const tasksContainer = document.getElementById('tasks-container');
const taskAnswerForm = document.getElementById('task-answer-form');

// Load tasks from Airtable or any external data source
window.addEventListener('load', () => {
  getTasks()
    .then(tasks => {
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
          // Show task details and answer form
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

          submitTaskAnswer(taskId, answer)
            .then(() => {
              alert('Task answer submitted successfully!');
              // Optionally, disable the form or show the task status
              taskForm.querySelector('button').disabled = true;
            })
            .catch(error => {
              console.error('Error submitting task answer: ', error);
              alert('Task submission failed: ' + error.message);
            });
        });

        tasksContainer.appendChild(taskElement);
      });
    })
    .catch(error => {
      console.error('Error loading tasks: ', error); // Log error for debugging
      alert('Failed to load tasks: ' + error.message); // Show error to the user
    });
});
