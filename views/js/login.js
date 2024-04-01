// login.js

document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to the login form
    document.querySelector('form[name="login"]').addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent form submission
  
      // Get user input values
      const userName = document.getElementById('user-name').value;
      const password = document.getElementById('password').value;
  
      // Send login request to the server
      fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName, password }),
        credentials: 'same-origin'
      })
      .then(response => {
        if (response.ok) {
          // Redirect to the dashboard page on successful login
          window.location.href = '/dashboard';
        } else {
            return response.json().then(data => {
                // Throw error with server-provided message
                throw new Error(data.message);
            });
        }
      })
      .catch(error => {
        // Display error message
        alert(error.message);
      });
    });
  });
  