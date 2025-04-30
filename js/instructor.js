// display all surveys
document.querySelector('#btnCurrentSurveys').addEventListener('click', (event) => {
    selectView('Current')
})

// display all members
document.querySelector('#btnScheduledSurveys').addEventListener('click', (event) => {
    selectView('Scheduled')

})

// display all feedback
document.querySelector('#btnCompletedSurveys').addEventListener('click', (event) => {
    selectView('Completed')
})
// new class
document.querySelector('#btnCreateGroup').addEventListener('click', function() {
    let strName = document.querySelector('#txtCourse').value
    let strStartDate = document.querySelector('#txtStartDate').value
    let strEndDate = document.querySelector('#txtEndDate').value
    const htmlAddClass = `<div class="card shadow p-4 group-card selection-card position-relative me-2">
                            <h3 style="margin-bottom:20px">${strName}</h3>
                            <p style="margin-bottom:0px">Start: ${strStartDate}</p>
                            <p>End: ${strEndDate}</p>
                            <a class="stretched-link" data-group-id="${strName}"></a>
                          </div>` //CHANGE data-group-id name probs
    document.querySelector('#groupContainer').innerHTML += htmlAddClass
    let strCode = generateClassCode()
})
// modal to create group
document.querySelector('#btnCreateGroupModal').addEventListener('click', function() {
    const createGroupModal = new bootstrap.Modal(document.querySelector('#createGroupModal'))
    createGroupModal.show()
})


// listener for clicking a group card
document.querySelector('#groupContainer').addEventListener('click', (event) => {
    const cardLink = event.target.closest('.stretched-link')
    if (cardLink) {
        document.querySelector('#viewGroupsProf').classList.add('d-none')
        document.querySelector('#viewGroupDetails').classList.add('d-none')

        document.querySelector('#viewGroupDetails').classList.remove('d-none')
    }
})

//listen events for create survey view

//adding a new answer on multiple choice -- doesnt work
document.querySelector('#btnAddMC').addEventListener('click', (event) => {
    //fetch group details
    const htmlMCOption = `<div class="form-check ms-2 mb-2">
                <input class="form-check-input" type="radio" name="q1" id="q1-a1">
                <label class="form-check-label" for="q1-a1">Option 1</label>
            </div>`
    document.querySelector('#multipleChoice').innerHTMML += htmlMCOption
})

//adding a new answer on multiple choice -- doesnt work
document.querySelector('#btnQuestionType').addEventListener('click', (event) => {
    //fetch group details
    const htmlMCOption = `<div class="form-check ms-2 mb-2">
                <input class="form-check-input" type="radio" name="q1" id="q1-a1">
                <label class="form-check-label" for="q1-a1">Option 1</label>
            </div>`
    document.querySelector('#multipleChoice').innerHTMML += htmlMCOption
})

//adding a changing question type -- doesnt work
document.querySelector('#btnAddMC').addEventListener('click', (event) => {
    selectQuestionType('AddMC')
})

document.querySelector('#btnAddMS').addEventListener('click', (event) => {
    selectQuestionType('AddMS')
})

document.querySelector('#btnAddLikert').addEventListener('click', (event) => {
    selectQuestionType('AddLikert')
})

document.querySelector('#btnAddShortAnswer').addEventListener('click', (event) => {
    selectQuestionType('AddShortAnswer')
})

// function to display the right stuff based on selection
function selectView(selected) {
    document.querySelector('#viewCurrent').classList.add('d-none')
    document.querySelector('#viewScheduled').classList.add('d-none')
    document.querySelector('#viewCompleted').classList.add('d-none')

    document.querySelector('#btnCurrentSurveys').classList.add('unselected')
    document.querySelector('#btnScheduledSurveys').classList.add('unselected')
    document.querySelector('#btnCompletedSurveys').classList.add('unselected')

    document.querySelector(`#btn${selected}Surveys`).classList.remove('unselected')
    document.querySelector(`#view${selected}`).classList.remove('d-none')
}

function selectQuestionType(selected) {
    document.querySelector('#viewMC').classList.add('d-none')
    document.querySelector('#viewMS').classList.add('d-none')
    document.querySelector('#viewLikert').classList.add('d-none')
    document.querySelector('#viewShortAnswer').classList.add('d-none')

    document.querySelector('#btnAddMC').classList.add('unselected')
    document.querySelector('#btnAddMS').classList.add('unselected')
    document.querySelector('#btnAddLikert').classList.add('unselected')
    document.querySelector('#btnAddShortAnswer').classList.add('d-none')

    document.querySelector(`#btn${selected}`).classList.remove('unselected')
    document.querySelector(`#view${selected}`).classList.remove('d-none')
}

// modal to create group
document.querySelector('#btnCreateGroupModal').addEventListener('click', function() {
    const createGroupModal = new bootstrap.Modal(document.querySelector('#createGroupModal'))
    createGroupModal.show()
})
function generateClassCode(info){
    let x = 0;
    let code =''

    // Creates a random number of length 6
    while ( x < 6) {
        code += Math.floor(Math.random() * 10);
        x++
    }
}

// function verifyCode(code){
//     if(strClassCode.length < 6 || strClassCode.length > 6 || isNaN(strClassCode)){
//         blnError = true
//         strMessage += '<p class="mb-0 mt-0">You must enter a valid code</p>'
//     }
//     //now 
// }


// create survey button functionality
document.querySelector('#btnNewSurvey').addEventListener('click', function() {
    fetch("pages/createnewsurvey.html")
    .then(response => response.text())
    .then(html => {
        const objScript = document.createElement('script')
        objScript.src = 'js/createnewsurvey.js'
        objScript.type = 'text/javascript'
        document.head.appendChild(objScript)
        document.querySelector('#divView').innerHTML = html
    })
    .catch(error => console.error("Error fetching new survey form:", error))
})
