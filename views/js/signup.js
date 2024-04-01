document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to the signup form
    document.querySelector('form[name="signup"]').addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent form submission
  
      // Get user input values
      const firstName = document.getElementById('first-name').value;
      const lastName = document.getElementById('last-name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const userName = document.getElementById('user-name').value;
      const birthDate = document.getElementById('birth-date').value;
      const gender = document.getElementById('select-gender').value;
      const position = document.getElementById('select-position').value;
      const schoolSubject = document.getElementById('schoolSubject').value;
      const gradeLevel = document.getElementById('gradeLevel').value;

      // Construct the request body
      const requestBody = {
        firstName,
        lastName,
        email,
        password,
        userName,
        birthDate,
        gender,
        position
      };

      // Add additional fields based on position
      if (position === 'teacher') {
        requestBody.schoolSubject = schoolSubject;
      } else {
        requestBody.gradeLevel = gradeLevel;
      }

      // Send signup request to the server
      fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        credentials: 'same-origin'
      })
      .then(response => {
        if (response.ok) {
          // Redirect to the dashboard page on successful signup
          alert('User registration done successfully !!');
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
