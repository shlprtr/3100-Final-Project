import { ApiService } from '../services/apiService.js'
import { navigate } from '../services/pageRouter.js'

// register
document.querySelector('#btnRegister').addEventListener('click', () => {
    register()
})

// register with enter key
document.getElementById("txtConfirmPassword").addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        register()
    }
})

async function register() {
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
        const objResponse = await ApiService.register(strFirstName, strLastName, strEmail, strPassword)
        if (objResponse.success) {
            Swal.fire({
                title: 'Success!',
                text: 'You have registered an account',
                icon: 'success',
                confirmButtonColor: 'var(--dark-purple)',
                background: 'var(--dark-blue)',
                color: 'white'
            })
            navigate('#/login')
        } else {
            Swal.fire({
                title: 'Oh no, an error occurred!',
                text: objResponse.data.error,
                icon: 'error',
                confirmButtonColor: 'var(--dark-purple)',
                background: 'var(--dark-blue)',
                color: 'white'
            })
        }
    }
}