document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to the login form
    document.querySelector('form[name="login"]').addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent form submission
  
      // Get user input values
      const password = document.getElementById('password').value;
  
      // Send login request to the server
      fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password }), // Send only password for login
        credentials: 'same-origin'
      })
      .then(response => {
        if (response.ok) {
          // Redirect to the admin dashboard page on successful login
          window.location.href = '/AdminDashboard';
        } else {
            return response.json().then(data => {
                // Throw error with server-provided message
                throw new Error('please enter the director password');
            });
        }
      })
      .catch(error => {
        // Display error message
        alert(error.message);
      });
    });
});
