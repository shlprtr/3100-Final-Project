// login
document.querySelector('#btnLogin').addEventListener('click', (event) => {
    const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

    const strEmail = document.querySelector('#txtEmail').value.trim().toLowerCase()
    const strPassword = document.querySelector('#txtPassword').value

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

    if (blnError) {
        Swal.fire({
            title: 'Oh no, an error occurred!',
            html: strError,
            icon: 'error',
            confirmButtonColor: 'var(--dark-purple)',
            background: 'var(--dark-blue)',
            color: 'white'
        })
    } else {
        Swal.fire({
            title: 'Success!',
            text: 'You have successfully logged in',
            icon: 'success',
            confirmButtonColor: 'var(--dark-purple)',
            background: 'var(--dark-blue)',
            color: 'white'
        })

        // make api call to login

        navigate('#/dashboard')
    }
})