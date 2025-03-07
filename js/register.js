// register
// document.querySelector('#btnRegister').addEventListener('click', (event) => {

// })

// swap to login component
document.querySelector('#btnSwapRegister').addEventListener('click', (event) => {
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
