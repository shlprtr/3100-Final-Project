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

// listener for clicking a group card
document.querySelector('#groupContainer').addEventListener('click', (event) => {
    const cardLink = event.target.closest('.stretched-link')
    if (cardLink) {
        const strGroupId = cardLink.getAttribute('data-group-id')
        // fetch group details

        // document.querySelector('#selectedGroup').classList.remove('d-none')
        // document.querySelector('#viewGroups').classList.add('d-none')

        // document.querySelector('#groupName').innerHTML = strGroupId
        // document.querySelector('#viewSurveys').classList.remove('d-none')
    }
})

// listener for clicking a group to view
document.querySelector('#groupContainer').addEventListener('click', (event) => {
        //fetch group details

        document.querySelector('#viewGroupDetails').classList.remove('d-none')
        document.querySelector('#viewGroups').classList.add('d-none')
        document.querySelector('#viewGroupsProf').classList.add('d-none')

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
