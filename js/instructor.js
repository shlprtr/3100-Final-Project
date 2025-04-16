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
