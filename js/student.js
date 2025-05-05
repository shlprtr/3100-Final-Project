import { ApiService } from '../services/apiService.js'
import { navigate } from '../services/pageRouter.js'

loadGroups()

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
    document.querySelector('#frmSurvey').classList.remove('d-none')
    const cardLink = event.target.closest('.stretched-link')
    if (cardLink) {
        const strSurveyId = cardLink.getAttribute('data-survey-id')
        // fetch group details

        fetch("pages/studentsurvey.html")
        .then(response => response.text())
        .then(html => {
            const objScript = document.createElement('script')
            objScript.src = 'js/studentsurvey.js'
            objScript.type = 'module'
            document.head.appendChild(objScript)
            document.querySelector('#frmSurvey').innerHTML = html
        })
    }
})


// display all surveys
document.querySelector('#btnSurveys').addEventListener('click', (event) => {
    selectView('Surveys')
})

// display all members
document.querySelector('#btnMembers').addEventListener('click', async () => {
    let studentName
    // get the groupID and input it into the api call
    let objResponse = await ApiService.viewGroupUsers()
    selectView('Members')
    document.querySelector('#groupMemberContainer').innerHTML = ''
    for (let i = 0; i < objResponse.data.result.length; i++) {
        let objUserInfoResponse = await ApiService.viewUserInfo(objResponse.data.result[i].UserID)
        let objUserPhoneResponse = await ApiService.viewUserPhoneInfo(objResponse.data.result[i].UserID)
        let objUserSocialsResponse = await ApiService.viewUserSocials(objResponse.data.result[i].UserID)
        let name = objUserInfoResponse.data.firstName + ' ' + objUserInfoResponse.data.lastName
        let email = objUserInfoResponse.data.email
        let phone = '--'
        let discord = '--'
        let github = '--'
        let teams = '--'

        for (let i = 0; i < objUserPhoneResponse.data.result.length; i++) {
            phone = objUserPhoneResponse.data.result[i].PhoneNumber
        }

        for (let i = 0; i < objUserSocialsResponse.data.result.length; i++) {
            let strSocialType = objUserSocialsResponse.data.result[i].SocialType
        
            if(strSocialType === 'Discord') {
                discord = objUserSocialsResponse.data.result[i].Username
            }
            if(strSocialType === 'GitHub') {
                github = objUserSocialsResponse.data.result[i].Username
            }
            if(strSocialType === 'Teams') {
                teams = objUserSocialsResponse.data.result[i].Username
            }
        }
        
        document.querySelector('#groupMemberContainer').innerHTML += `<div class="card selection-card shadow-sm mb-2 position-relative">
                                                                    <div class="card-body">
                                                                        <p class="mb-0">${name}</p>
                                                                        <hr />
                                                                        <p class="mt-0">Email: ${email}</p>
                                                                        <p class="mt-0">Phone: ${phone}</p>
                                                                        <p class="mt-0">Discord: ${discord}</p>
                                                                        <p class="mt-0">GitHub: ${github}</p>
                                                                        <p class="mt-0">Teams: ${teams}</p>
                                                                        <a class="stretched-link" data-survey-id="Survey1"></a>
                                                                    </div>
                                                                </div>`
    }

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
    document.querySelector('#frmSurvey').classList.add('d-none')


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

// button to go back to groups
document.getElementById('btnBackToGroups').addEventListener('click', function () {
    // Hide the surveys section
    document.getElementById('viewSurveys').classList.add('d-none');
    document.getElementById('selectedGroup').classList.add('d-none');
    // Show the groups section
    document.getElementById('viewGroups').classList.remove('d-none');
});

async function loadGroups(strCourseID) {
    const objResponse = await ApiService.viewUsersGroups()
    if (objResponse.success && objResponse.data.result > 0) {
        const arrGroups = objResponse.data.result
        let strGroupHTML = ""
        arrGroups.forEach(group => {
            strGroupHTML += `
                <div class="card shadow p-4 group-card selection-card position-relative me-2">
                    <h3>${group.GroupName}</h3>
                    <a class="stretched-link"
                        data-group-id="${group.GroupID}"
                        data-group-name="${group.GroupName}"
                        data-group-course-id="${group.CourseID}">
                    </a>
                </div>
            `
        })
        document.querySelector('#groupContainer').innerHTML = strGroupHTML
    }
}