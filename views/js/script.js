// script.js

// Function to check if the user is logged in
function checkLoggedIn() {
  fetch('/api/users/loggedin')
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to check login status.');
      }
    })
    .then(data => {
      // If user is logged in, redirect to dashboard
      if (data) {
        window.location.href = '/dashboard';
      }
    });
}

// Call the function when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
  checkLoggedIn();
});
