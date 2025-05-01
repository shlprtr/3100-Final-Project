import { navigate } from '../services/pageRouter.js'
import { ApiService } from '../services/apiService.js'

// login
document.querySelector('#btnLogin').addEventListener('click', async () => {
    const strEmail = document.querySelector('#txtEmail').value
    const strPassword = document.querySelector('#txtPassword').value

    const objResponse = await ApiService.login(strEmail, strPassword)
    if (objResponse.success) {
        Swal.fire({
            title: 'Success!',
            text: 'You have successfully logged in',
            icon: 'success',
            confirmButtonColor: 'var(--dark-purple)',
            background: 'var(--dark-blue)',
            color: 'white'
        })
        navigate('#/student')
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
})