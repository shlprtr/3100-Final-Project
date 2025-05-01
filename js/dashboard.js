// default to student view
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

// show instructor view
document.querySelector('#btnInstructor').addEventListener('click', (event) => {
    document.querySelector('#btnInstructor').classList.remove('unselected')
    document.querySelector('#btnStudent').classList.add('unselected')
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
    document.querySelector('#btnStudent').classList.remove('unselected')
    document.querySelector('#btnInstructor').classList.add('unselected')
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
// show student view
document.querySelector('#btnProfile').addEventListener('click', (event) => {
    document.querySelector('#btnProfile').classList.remove('unselected')
    document.querySelector('#btnStudent').classList.add('unselected')
    document.querySelector('#btnInstructor').classList.add('unselected')
    fetch("pages/profile.html")
    .then(response => response.text())
    .then(html => {
        const objScript = document.createElement('script')
        objScript.src = 'js/profile.js'
        objScript.type = 'text/javascript'
        document.head.appendChild(objScript)
        document.querySelector('#divView').innerHTML = html
    })
    .catch(error => console.erro("Error fetching profile view:", error))
})