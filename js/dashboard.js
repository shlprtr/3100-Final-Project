// show instructor view
document.querySelector('#btnInstructor').addEventListener('click', (event) => {
    fetch("pages/instructor.html")
    .then(response => response.text())
    .then(html => {
        const objScript = document.createElement('script')
        objScript.src = 'js/instructor.js'
        objScript.type = 'text/javascript'
        document.head.appendChild(objScript)
        document.querySelector('#divView').innerHTML = html
    })
    .catch(error => console.erro("Error fetching instructor view:", error))
})

// show student view
document.querySelector('#btnStudent').addEventListener('click', (event) => {
    fetch("pages/student.html")
    .then(response => response.text())
    .then(html => {
        const objScript = document.createElement('script')
        objScript.src = 'js/student.js'
        objScript.type = 'text/javascript'
        document.head.appendChild(objScript)
        document.querySelector('#divView').innerHTML = html
    })
    .catch(error => console.erro("Error fetching student view:", error))
})