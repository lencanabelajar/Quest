import { login } from './firebase.js';

// Handle login form submission
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = event.target.username.value;
  const password = event.target.password.value;

  login(email, password)
    .then(() => {
      window.location.href = 'home.html';  // Redirect to home after successful login
    })
    .catch(error => {
      alert('Login failed: ' + error.message);
    });
});
