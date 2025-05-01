// Handle form submission
document
  .querySelector("#studentSurveyForm")
  .addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission
    alert("Thank you for submitting the survey!");
    // You can add logic here to send the survey data to a server or process it further
  });

// SweetAlert2 validation for empty inputs
document.querySelector('#btnPrivate').addEventListener('click', () => {
    validateForm('Private');
});

document.querySelector('#btnPublic').addEventListener('click', () => {
    validateForm('Public');
});

function validateForm(submissionType) {
    const question1 = document.querySelector('#question1').value;
    const question2 = document.querySelector('#question2').value.trim();
    const question3 = document.querySelector('#question3').value.trim();

    if (!question1) {
        Swal.fire({
            icon: 'error',
            title: 'Missing Input',
            text: 'Please select an option for Question 1.',
        });
        return;
    }

    if (!question2) {
        Swal.fire({
            icon: 'error',
            title: 'Missing Input',
            text: 'Please provide an answer for Question 2.',
        });
        return;
    }

    if (!question3) {
        Swal.fire({
            icon: 'error',
            title: 'Missing Input',
            text: 'Please provide an answer for Question 3.',
        });
        return;
    }

    // If all inputs are valid
    Swal.fire({
        icon: 'success',
        title: 'Survey Submitted',
        text: `Your survey has been submitted as ${submissionType}.`,
    });
}

// Handle navigation to the Submissions page
document.addEventListener('DOMContentLoaded', () => {
    const submissionsButton = document.querySelector('#btnSubmissions');
    if (submissionsButton) {
        submissionsButton.addEventListener('click', () => {
            // Navigate to the studentsurvey.html page
            window.location.href = '/components/studentsurvey.html';
        });
    } else {
        console.error('Submissions button (#btnSubmissions) not found in the DOM.');
    }
});