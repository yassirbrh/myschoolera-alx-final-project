function extractGradeInfo(gradeString) {
	const regex = /^Gr\.(\d+)\/(\d+)$/;
	const match = gradeString.match(regex);
	if (match) {
		const gradeLevel = match[1];
		const gradeClass = parseInt(match[2]);
		return { gradeLevel, gradeClass };
	} else {
		throw new Error("Invalid grade string format");
	}
}

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
			if (!data) {
				window.location.href = '/';
			}
		});
}

document.addEventListener('DOMContentLoaded', function() {
	checkLoggedIn();
	fetch('/api/users/getuser')
		.then(response => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('Failed to fetch user data.');
			}
		})
		.then(data => {
			if (data.schoolSubject) {
				fetchTeachers();
				fetchGrades();
			} else if (data.gradeLevel) {
				fetchStudents();
			} else {
				console.error('User data does not contain schoolSubject or gradeLevel.');
			}
		})
		.catch(error => {
			console.error('Error fetching user data:', error);
		});
});

function fetchStudents() {
	fetch('/api/students/getgrades')
		.then(response => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('Failed to fetch grades.');
			}
		})
		.then(data => {
			const { grades, foundClass } = data;
			const teachersTable = document.getElementById('teachersTable');

			// Clear previous content
			teachersTable.innerHTML = '';

			// Loop over the teachersList object and create elements for each key-value pair
			for (const subject in foundClass.teachersList) {
				const teacherName = foundClass.teachersList[subject];
				const trElement = document.createElement('tr');
				const tdImgElement = document.createElement('td');
				const imgBxElement = document.createElement('div');
				const imgElement = document.createElement('img');
				const tdTextElement = document.createElement('td');
				const h4Element = document.createElement('h4');
				const brElement = document.createElement('br');
				const spanElement = document.createElement('span');

				imgBxElement.classList.add('imgBx');
				imgElement.src = "assets/imgs/customer01.jpg";
				imgElement.alt = "";
				imgBxElement.appendChild(imgElement);
				tdImgElement.appendChild(imgBxElement);
				h4Element.textContent = teacherName;
				spanElement.textContent = subject;
				h4Element.appendChild(brElement);
				h4Element.appendChild(spanElement);
				tdTextElement.appendChild(h4Element);
				trElement.appendChild(tdImgElement);
				trElement.appendChild(tdTextElement);
				tdImgElement.setAttribute('width', '60px');

				teachersTable.appendChild(trElement);
			}

			const cookies = document.cookie.split(';');
			let username = '';
			cookies.forEach(cookie => {
				const [name, value] = cookie.trim().split('=');
				if (name === 'username') {
					username = value;
				}
			});

			const gradeTable = document.getElementById('gradeTable');
			gradeTable.innerHTML = '';

			const headerRow = gradeTable.insertRow();
			const headerCell = headerRow.insertCell();
			headerCell.textContent = 'Subject';
			const examHeaders = ['Exam 1', 'Exam 2', 'Exam 3'];
			examHeaders.forEach(exam => {
				const cell = headerRow.insertCell();
				cell.textContent = exam;
			});

			for (const subject in foundClass.examScores) {
				const subjectRow = gradeTable.insertRow();
				const subjectCell = subjectRow.insertCell();
				subjectCell.textContent = subject;
				const examNumbers = ['exam1', 'exam2', 'exam3'];

				examNumbers.forEach(exam => {
					const examScores = foundClass.examScores[subject][exam];
					const examCell = subjectRow.insertCell();
					let total = 0;
					let count = 0;

					for (const student in examScores) {
						if (student === username) {
							total += examScores[student];
							count++;
						}
					}
					const averageScore = count > 0 ? (total / count).toFixed(2) : 'N/A';
					examCell.textContent = averageScore;
				});
			}
		})
		.catch(error => {
			console.error(error);
		});
}

function fetchTeachers() {
	fetch('/api/teachers/getgrades')
		.then(response => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('Failed to fetch grades.');
			}
		})
		.then(data => {
			const grades = data;
			const teachersTable = document.getElementById('teachersTable');

			// Clear previous content
			teachersTable.innerHTML = '';

			// Change the text of My Teachers to My Classes
			const cardHeader = document.querySelector('.recentCustomers .cardHeader h2');
			cardHeader.textContent = 'My Classes';

			// Loop over the grades object and create elements for each key
			for (const className in grades) {
				const trElement = document.createElement('tr');
				const tdTextElement = document.createElement('td');
				const h4Element = document.createElement('h4');
				const brElement = document.createElement('br');
				const spanElement = document.createElement('span');
				const { gradeLevel, gradeClass } = extractGradeInfo(className);

				// Set text content
				h4Element.textContent = className;
				spanElement.textContent = `Grade Level: ${gradeLevel} -- Class: ${gradeClass}`;

				// Append elements
				h4Element.appendChild(brElement);
				h4Element.appendChild(spanElement);
				tdTextElement.appendChild(h4Element);
				trElement.appendChild(tdTextElement);

				// Append the row to the table
				teachersTable.appendChild(trElement);
			}
		})
		.catch(error => {
			console.error('Error:', error);
		});
}

function fetchGrades() {
	fetch('/api/teachers/getgrades')
		.then(response => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('Failed to fetch grades.');
			}
		})
		.then(data => {
			// Clear previous content
			const recentOrders = document.querySelector('.recentOrders');
			recentOrders.innerHTML = '';

			// Create the cardHeader
			const cardHeader = document.createElement('div');
			cardHeader.classList.add('cardHeader');

			// Create the h2 element
			const h2Element = document.createElement('h2');
			h2Element.textContent = 'Modify Grades';

			// Create the View All button
			const viewAllButton = document.createElement('a');
			viewAllButton.href = '#';
			viewAllButton.classList.add('btn');
			viewAllButton.textContent = 'View All';

			// Append h2 and View All button to the cardHeader
			cardHeader.appendChild(h2Element);
			cardHeader.appendChild(viewAllButton);

			// Create the form
			const gradeForm = document.createElement('form');

			// Create select input for class keys
			const classSelect = document.createElement('select');
			const keys = Object.keys(data);
			keys.forEach(classKey => {
				const option = document.createElement('option');
				option.value = classKey;
				option.textContent = classKey;
				classSelect.appendChild(option);
			});

			// Create submit button
			const submitButton = document.createElement('button');
			submitButton.textContent = 'Submit';
			submitButton.type = 'submit';

			// Create input for displaying JSON data
			const jsonDataInput = document.createElement('textarea');
			jsonDataInput.rows = 10;
			jsonDataInput.readOnly = true;
			jsonDataInput.style.width = '100%';
			jsonDataInput.removeAttribute('readonly');

			// Add event listener to the form
			gradeForm.addEventListener('submit', (event) => {
				event.preventDefault();
				const selectedKey = classSelect.value;
				const jsonData = JSON.stringify(data[selectedKey], null, 2);
				jsonDataInput.value = jsonData;
			});

			const logButton = document.createElement('button');
			logButton.textContent = 'Log Data';
			logButton.id = 'logButton';
			gradeForm.appendChild(logButton);

			// Add event listener for logging data when the new submit button is clicked
			logButton.addEventListener('click', () => {
        const selectedKey = classSelect.value;
        const jsonData = jsonDataInput.value.trim();
        
        // Make sure jsonData is not empty
        if (!jsonData) {
            console.error('JSON data is empty');
            return;
        }
    
        // Create object with selected key and jsonData
        const requestBody = {
            classID: selectedKey,
            grades: jsonData
        };
    
        // Make POST request to server
        fetch('/api/teachers/addgrades', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (response.ok) {
                console.log('Data successfully sent to server');
            } else {
                console.error(response);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
    



			// Append elements to the form
			gradeForm.appendChild(classSelect);
			gradeForm.appendChild(submitButton);
			gradeForm.appendChild(jsonDataInput);

			// Append the cardHeader and form to the recentOrders container
			recentOrders.appendChild(cardHeader);
			recentOrders.appendChild(gradeForm);
		})
		.catch(error => {
			console.error(error);
		});
}



