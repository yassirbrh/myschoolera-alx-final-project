document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to the logout button
    document.getElementById('logout').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default button behavior

        // Send logout request to the server
        fetch('/api/admin/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        })
        .then(response => {
            if (response.ok) {
                // Redirect to the home page on successful logout
                window.location.href = '/';
            } else {
                return response.json().then(data => {
                    // Throw error with server-provided message
                    throw new Error('Failed to logout');
                });
            }
        })
        .catch(error => {
            // Display error message
            alert(error.message);
        });
    });
});
