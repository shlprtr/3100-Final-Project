// swap to login component
document.querySelector('#btnSelLogin').addEventListener('click', (event) => {
    fetch("components/login.html")
    .then(response => response.text())
    .then(html => {
        const objScript = document.createElement('script')
        objScript.src = 'js/login.js'
        objScript.type = 'text/javascript'
        document.head.appendChild(objScript)
        document.querySelector('#divContent').innerHTML = html
    })
    .catch(error => console.erro("Error fetching login:", error))
})

// swap to register component
document.querySelector('#btnSelRegister').addEventListener('click', (event) => {
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