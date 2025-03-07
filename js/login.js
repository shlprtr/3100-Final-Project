// login
// document.querySelector('#btnLogin').addEventListener('click', (event) => {

// })

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
