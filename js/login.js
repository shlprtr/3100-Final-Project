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
            icon: 'error'
        })
    } else {
        Swal.fire({
            title: 'Success!',
            text: 'You have successfully logged in',
            icon: 'success'
        })
    }
})

// swap to register component
document.querySelector('#btnSwapLogin').addEventListener('click', (event) => {
    fetch("components/register.html")
    .then(response => response.text())
    .then(html => {
        const objScript = document.createElement('script')
        objScript.src = 'js/register.js'
        objScript.type = 'text/javascript'
        document.head.appendChild(objScript)
        document.querySelector('#divContent').innerHTML = html
    })
    .catch(error => console.erro("Error fetching registration:", error))
})
