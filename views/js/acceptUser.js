async function fetchDataAndPopulateTable() {
    try {
        // Fetch data from API for teachers
        const teachersResponse = await fetch('/api/admin/getteachers');
        const teachersData = await teachersResponse.json();

        // Filter teacher data where isAccepted is false
        const pendingTeachers = teachersData.filter(teacher => !teacher.isAccepted);

        // Fetch data from API for students
        const studentsResponse = await fetch('/api/admin/getstudents');
        const studentsData = await studentsResponse.json();

        // Filter student data where isAccepted is false
        const pendingStudents = studentsData.filter(student => !student.isAccepted);

        // Get table body element
        const tableBody = document.getElementById('data-body');

        // Clear existing table rows
        tableBody.innerHTML = '';

        // Iterate over pending teachers and add to table
        pendingTeachers.forEach(teacher => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${teacher.userName}</td>
                <td>Teacher</td>
                <td><button style="background-color: #3498db; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;" onclick="acceptItem('${teacher.userName}')">Accept</button></td>
            `;
            tableBody.appendChild(row);
        });

        // Iterate over pending students and add to table
        pendingStudents.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.userName}</td>
                <td>Student</td>
                <td><button style="background-color: #3498db; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;" onclick="acceptItem('${student.userName}')">Accept</button></td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching and populating data:', error);
    }
}

const acceptItem = async (userName) => {
    try {
        const response = await fetch('/api/admin/acceptuser', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userName })
        });
        if (response.ok) {
            alert('User accepted !!');
            // Refetch and populate table
            fetchDataAndPopulateTable();
        } else {
            const errorMessage = await response.json();
            alert(`Failed to accept user: ${errorMessage.message}`);
        }
    } catch (error) {
        console.error('Error accepting user:', error);
        alert('An error occurred while accepting user');
    }
};


// Call function to fetch and populate table
fetchDataAndPopulateTable();