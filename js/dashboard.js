// Toggle menu visibility
function toggleMenu() {
    const menu = document.getElementById('menuItems');
    menu.classList.toggle('d-none'); // Toggle the visibility of the menu
}

// Switch to Instructor View
function switchToInstructorView() {
    console.log('Switching to Instructor View');
    fetch('pages/instructor.html')
        .then(response => response.text())
        .then(html => {
            document.querySelector('#divView').innerHTML = html;
        })
        .catch(error => console.error('Error loading instructor view:', error));
}

// Switch to Student View
function switchToStudentView() {
    console.log('Switching to Student View');
    fetch('pages/student.html')
        .then(response => response.text())
        .then(html => {
            document.querySelector('#divView').innerHTML = html;
        })
        .catch(error => console.error('Error loading student view:', error));
}

// Add event listeners for the buttons
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#btnInstructor').addEventListener('click', () => {
        switchToInstructorView();
    });

    document.querySelector('#btnStudent').addEventListener('click', () => {
        switchToStudentView();
    });
});