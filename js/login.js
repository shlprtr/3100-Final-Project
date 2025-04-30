import { navigate } from '../services/pageRouter.js'

// login
document.querySelector('#btnLogin').addEventListener('click', (event) => {
    const strEmail = document.querySelector('#txtEmail').value
    const strPassword = document.querySelector('#txtPassword').value

    login(strEmail, strPassword)
})

// call POST /sessions endpoint to login and create session
async function login(strEmail, strPassword) {
    try {
        const response = await fetch('http://localhost:8000/sessions', {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email: strEmail,
                password: strPassword
            })
        })

        const data = await response.json()
        if (data.status == 'success') {
            Swal.fire({
                title: 'Success!',
                text: 'You have successfully logged in',
                icon: 'success',
                confirmButtonColor: 'var(--dark-purple)',
                background: 'var(--dark-blue)',
                color: 'white'
            })
            navigate('#/dashboard')
        } else {
            Swal.fire({
                title: 'Oh no, an error occurred!',
                text: data.error,
                icon: 'error',
                confirmButtonColor: 'var(--dark-purple)',
                background: 'var(--dark-blue)',
                color: 'white'
            })
        }
    } catch (error) {
        console.error(error)
    }
}