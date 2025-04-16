// const viewGroups = document.querySelector('#viewGroups')
// const selGroup = document.querySelector('#selectedGroup')
// const viewSurveys = document.querySelector('#viewSurveys')
// const viewMembers = document.querySelector('#viewMembers')
// const viewFeedback = document.querySelector('#viewFeedback')

// const btnSurveys = document.querySelector('#btnSurveys')
// const btnMembers = document.querySelector('#btnMembers')
// const btnFeedback = document.querySelector('#btnFeedback')

// listener for clicking a group card
document.querySelector('#groupContainer').addEventListener('click', (event) => {
    const cardLink = event.target.closest('.stretched-link')
    if (cardLink) {
        const strGroupId = cardLink.getAttribute('data-group-id')
        // fetch group details

        document.querySelector('#selectedGroup').classList.remove('d-none')
        document.querySelector('#viewGroups').classList.add('d-none')

        document.querySelector('#groupName').innerHTML = strGroupId
        document.querySelector('#viewSurveys').classList.remove('d-none')
    }
})

// listener for clicking a survey
document.querySelector('#surveyContainer').addEventListener('click', (event) => {
    document.querySelector('#viewSurveys').classList.add('d-none')
    const cardLink = event.target.closest('.stretched-link')
    if (cardLink) {
        const strSurveyId = cardLink.getAttribute('data-survey-id')
        // fetch group details

        document.querySelector('#frmSurvey').classList.remove('d-none')
        document.querySelector('#selectedGroup').classList.add('d-none')

        document.querySelector('#surveyName').innerHTML = strSurveyId
    }
})

// display all surveys
document.querySelector('#btnSurveys').addEventListener('click', (event) => {
    selectView('Surveys')
})

// display all members
document.querySelector('#btnMembers').addEventListener('click', (event) => {
    selectView('Members')

})

// display all feedback
document.querySelector('#btnFeedback').addEventListener('click', (event) => {
    selectView('Feedback')
})

// function to display the right stuff based on selection
function selectView(selected) {
    document.querySelector('#viewSurveys').classList.add('d-none')
    document.querySelector('#viewMembers').classList.add('d-none')
    document.querySelector('#viewFeedback').classList.add('d-none')

    document.querySelector('#btnSurveys').classList.add('unselected')
    document.querySelector('#btnMembers').classList.add('unselected')
    document.querySelector('#btnFeedback').classList.add('unselected')

    document.querySelector(`#btn${selected}`).classList.remove('unselected')
    document.querySelector(`#view${selected}`).classList.remove('d-none')
}

// modal to join group
document.querySelector('#btnJoinGroupModal').addEventListener('click', function() {
    const joinGroupModal = new bootstrap.Modal(document.querySelector('#joinGroupModal'))
    joinGroupModal.show()
})