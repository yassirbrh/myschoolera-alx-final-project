document.addEventListener('DOMContentLoaded', async function() {
    const gradeLevelSelect = document.getElementById('gradeLevel');
    const subjectsList = document.getElementById('subjectsList');

    // Fetch data for teachers
    const teachersResponse = await fetch('/api/admin/getteachers');
    const teachersData = await teachersResponse.json();

    // Define school subjects
    const subjects = ['Mathematics', 'Science', 'English Language', 'History', 'Geography', 'Computer Science', 'Physical Education'];

    // Populate subjects and teachers list
    subjects.forEach(subject => {
        const subjectLabel = document.createElement('label');
        subjectLabel.textContent = `${subject}:`;

        const subjectTeachersList = document.createElement('div');

        // Filter teachers for the current subject
        const subjectTeachers = teachersData.filter(teacher => teacher.schoolSubject === subject && teacher.isAccepted);

        subjectTeachers.forEach(teacher => {
            const teacherRadio = document.createElement('input');
            teacherRadio.type = 'radio';
            teacherRadio.name = subject;
            teacherRadio.value = teacher.userName;
            teacherRadio.id = `${subject}-${teacher.userName}`;
            teacherRadio.style.marginRight = '5px'; // Add some space between the radio button and the label
        
            const teacherLabel = document.createElement('label');
            teacherLabel.textContent = teacher.userName;
            teacherLabel.setAttribute('for', `${subject}-${teacher.userName}`);
            teacherLabel.style.fontWeight = 'bold'; // Make the label bold to distinguish it from the radio button
        
            subjectTeachersList.appendChild(teacherRadio);
            subjectTeachersList.appendChild(teacherLabel);
            subjectTeachersList.appendChild(document.createElement('br'));
        });
        

        subjectsList.appendChild(subjectLabel);
        subjectsList.appendChild(subjectTeachersList);
        subjectTeachersList.appendChild(document.createElement('br'));
    });

    // Event listener for form submission
    const addClassForm = document.getElementById('addClassForm');
    addClassForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const gradeLevel = gradeLevelSelect.value;

        // Initialize teachersList
        const teachersList = {};

        // Loop through checkboxes to get selected teachers for each subject
        subjects.forEach(subject => {
            const selectedTeacherCheckbox = document.querySelector(`input[name="${subject}"]:checked`);
            if (selectedTeacherCheckbox) {
                teachersList[subject] = selectedTeacherCheckbox.value;
            }
        });


        async function fetchDataAndCheckStudents(teachersList, gradeLevel) {
            try {
                // Fetch data from API for students
                const studentsResponse = await fetch('/api/admin/getstudents');
                const studentsData = await studentsResponse.json();
        
                // Filter students with isAccepted set to true
                const acceptedStudents = studentsData.filter(student => student.isAccepted && student.gradeLevel === gradeLevel);
        
                // Fetch data from API for classes
                const classesResponse = await fetch('/api/admin/getclasses');
                const classesData = await classesResponse.json();
                const studentsList = []
        
                // Iterate over each accepted student
                acceptedStudents.forEach(student => {
                    const studentUserName = student.userName;
        
                    // Check if student is not already in a class
                    const isInClass = classesData.some(classItem => classItem.studentsList.includes(studentUserName));
        
                    if (!isInClass) {
                        studentsList.push(studentUserName);
                        // You can perform further actions here if needed
                    }
                });
                if (studentsList.length < 15) {
                    alert('Class should contain at least 15 students !!');
                } else if (Object.keys(teachersList).length != 7) {
                    alert('Class should have all the teachers !!');
                } else {
                    fetch('/api/admin/addclass', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            gradeLevel: gradeLevel,
                            studentsList: studentsList,
                            teachersList: teachersList
                        })
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to add class');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Class added successfully:', data);
                    })
                    .catch(error => {
                        console.error('Error adding class:', error);
                    });
                }
            } catch (error) {
                console.error('Error fetching and checking students:', error);
            }
        }
        
        fetchDataAndCheckStudents(teachersList, gradeLevel);

        // Log selected grade level and teachers list
        //console.log('Students List: ', studentsList);
        //console.log('Grade Level:', gradeLevel);
        //console.log('Teachers List:', teachersList);
    });
});
