{/* <button class="btn btn-primary me-2" id="btnLogOut">Log Out</button>
<button class="btn btn-outline-primary justify-content-end me-2" id="btnEdit">Edit</button>
<button class="btn btn-outline-primary me-2 d-none" id="btnSaveEdit">Save</button> */}

document.querySelector('#btnLogOut').addEventListener('click', (event) => {
    fetch("pages/login.html")
.then(response => response.text())
.then(html => {
    const objScript = document.createElement('script')
    objScript.src = 'js/login.js'
    objScript.type = 'text/javascript'
    document.head.appendChild(objScript)
    document.querySelector('#divView').innerHTML = html
})
.catch(error => console.error("You did not log out sucessfully: ", error))
})

document.querySelector('#btnEdit').addEventListener('click', (event) => {
    document.querySelector('#editAccount').classList.add('d-none')
    document.querySelector('#viewAccount').classList.add('d-none')

    document.querySelector('#editAccount').classList.remove('d-none')
})

document.querySelector('#btnSaveEdit').addEventListener('click', (event) => {
    document.querySelector('#editAccount').classList.add('d-none')
    document.querySelector('#viewAccount').classList.add('d-none')
    document.querySelector('#viewAccount').classList.remove('d-none')

    txtEmail = document.querySelector('txtCurrFirstName').value.value()

    document.querySelector(`#txtCurrEmail`).ariaPlaceholder.add('unselected')



    //Github, Discord, Teams

})

function getCurrentInfo(selected) {
    document.querySelector(`#btn${selected}`).classList.remove('unselected')
    document.querySelector(`#view${selected}`).classList.remove('d-none')


}
