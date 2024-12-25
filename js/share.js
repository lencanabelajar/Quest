// Import Firebase functions from firebase.js
import { shareCertificate, shareBadge } from './firebase.js';

// Elements for sharing actions
const shareCertificateBtn = document.getElementById('share-certificate-btn');
const shareBadgeBtn = document.getElementById('share-badge-btn');

// Handle certificate sharing
shareCertificateBtn.addEventListener('click', () => {
  shareCertificate()
    .then(() => {
      alert('Certificate shared successfully!'); // Notify success
    })
    .catch(error => {
      console.error('Error sharing certificate: ', error); // Log error for debugging
      alert('Sharing certificate failed: ' + error.message); // Show error to the user
    });
});

// Handle badge sharing
shareBadgeBtn.addEventListener('click', () => {
  shareBadge()
    .then(() => {
      alert('Badge shared successfully!'); // Notify success
    })
    .catch(error => {
      console.error('Error sharing badge: ', error); // Log error for debugging
      alert('Sharing badge failed: ' + error.message); // Show error to the user
    });
});
