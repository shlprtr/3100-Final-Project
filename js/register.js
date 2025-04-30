// register
document.querySelector('#btnRegister').addEventListener('click', (event) => {
    const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

    let strEmail = document.querySelector('#txtEmail').value.trim().toLowerCase()
    const strFirstName = document.querySelector('#txtFirstName').value
    const strLastName = document.querySelector('#txtLastName').value
    const strPassword = document.querySelector('#txtPassword').value
    const strConfirmPassword = document.querySelector('#txtConfirmPassword').value

    let blnError = false
    let strError = ""

    if (!regEmail.test(strEmail)) {
        blnError = true
        strError += "<p class='mb-0 mt-0'>Must enter a valid email</p>"
    }

    if (strPassword.length < 1) {
        blnError = true
        strError += "<p class='mb-0 mt-0'>Password cannot be blank</p>"
    }

    if (strPassword !== strConfirmPassword) {
        blnError = true
        strError += "<p class='mb-0 mt-1'>Passwords do not match</p>"
    }

    if (strFirstName.length < 1) {
        blnError = true
        strError += "<p class='mb-0 mt-0'>First name cannot be blank</p>"
    }

    if (strLastName.length < 1) {
        blnError = true
        strError += "<p class='mb-0 mt-0'>Last name cannot be blank</p>"
    }

    if (blnError) {
        Swal.fire({
            title: 'Oh no, an error!',
            html: strError,
            icon: 'error',
            confirmButtonColor: 'var(--dark-purple)',
            background: 'var(--dark-blue)',
            color: 'white'
        })
    } else {
        // create user, temporary until possible apiService.js
        const response = fetch('http://localhost:8000/user', {
            method: 'POST',
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email: strEmail,
                firstName: strFirstName,
                lastName: strLastName,
                password: strPassword
            })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error', error))

        // Swal.fire({
        //     title: 'Success!',
        //     text: 'You have successfully registered',
        //     icon: 'success',
        //     confirmButtonColor: 'var(--dark-purple)',
        //     background: 'var(--dark-blue)',
        //     color: 'white'
        // })
    }
})