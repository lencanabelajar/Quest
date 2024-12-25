import { shareCertificate, shareBadge } from './firebase.js';

// Elements for sharing actions
const shareCertificateBtn = document.getElementById('share-certificate-btn');
const shareBadgeBtn = document.getElementById('share-badge-btn');

// Handle certificate sharing
shareCertificateBtn.addEventListener('click', () => {
  shareCertificate()
    .then(() => {
      alert('Certificate shared successfully!');
    })
    .catch(error => {
      alert('Sharing certificate failed: ' + error.message);
    });
});

// Handle badge sharing
shareBadgeBtn.addEventListener('click', () => {
  shareBadge()
    .then(() => {
      alert('Badge shared successfully!');
    })
    .catch(error => {
      alert('Sharing badge failed: ' + error.message);
    });
});
