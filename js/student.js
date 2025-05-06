import { ApiService } from '../services/apiService.js'
import { navigate } from '../services/pageRouter.js'

let strCurrCourseID = null
let strCurrGroupID = null
let strCurrSurveyID = null
let strSurveyStatus = "Private"

loadGroups()

// listener for clicking a group card
document.querySelector('#groupContainer').addEventListener('click', (event) => {
    const cardLink = event.target.closest('.stretched-link')
    if (cardLink) {
        document.querySelector('#selectedGroup').classList.remove('d-none')
        document.querySelector('#viewGroups').classList.add('d-none')
        document.querySelector('#viewSurveys').classList.remove('d-none')

        strCurrCourseID = cardLink.getAttribute('data-group-course-id')
        strCurrGroupID = cardLink.getAttribute('data-group-id')

        document.querySelector('#groupName').innerHTML = cardLink.getAttribute('data-group-name')

        loadSurveys()
    }
})

// listener for clicking a survey
document.querySelector('#surveyContainer').addEventListener('click', (event) => {
    document.querySelector('#viewSurveys').classList.add('d-none')
    document.querySelector('#frmSurvey').classList.remove('d-none')
    const cardLink = event.target.closest('.stretched-link')
    if (cardLink) {
        strCurrSurveyID = cardLink.getAttribute('data-survey-id')

        loadSelectedSurvey()
    }
})

// display all surveys
document.querySelector('#btnSurveys').addEventListener('click', (event) => {
    selectView('Surveys')
    loadSurveys()
})

// display all members
document.querySelector('#btnMembers').addEventListener('click', async () => {
    let studentName
    let objResponse = await ApiService.viewGroupUsers(strCurrGroupID)
    selectView('Members')
    document.querySelector('#groupMemberContainer').innerHTML = ''
    for (let i = 0; i < objResponse.data.result.length; i++) {
        let objUserInfoResponse = await ApiService.viewUserInfo(objResponse.data.result[i].UserID)
        let objUserPhoneResponse = await ApiService.viewUserPhoneInfo(objResponse.data.result[i].UserID)
        let objUserSocialsResponse = await ApiService.viewUserSocials(objResponse.data.result[i].UserID)
        let name = objUserInfoResponse.data.result[0].FirstName + ' ' + objUserInfoResponse.data.result[0].LastName
        let email = objUserInfoResponse.data.result[0].Email
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
        
        document.querySelector('#groupMemberContainer').innerHTML += `
            <div class="card shadow-sm mb-2 position-relative">
                <div class="card-body">
                    <p class="mb-0">${name}</p>
                    <hr />
                    <p class="mt-0">Email: ${email}</p>
                    <p class="mt-0">Phone: ${phone}</p>
                    <p class="mt-0">Discord: ${discord}</p>
                    <p class="mt-0">GitHub: ${github}</p>
                    <p class="mt-0">Teams: ${teams}</p>
                </div>
            </div>
        `
    }

})

// display all feedback
document.querySelector('#btnFeedback').addEventListener('click', (event) => {
    selectView('Feedback')
    loadFeedback()
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

// join group
document.querySelector('#btnJoinGroup').addEventListener('click', async function() {
    const strJoinCode = document.querySelector('#txtJoinCode').value.trim().toUpperCase()

    const objResponse = await ApiService.addUserToGroup(strJoinCode)
    if (objResponse.success) {
        loadGroups()
        bootstrap.Modal.getInstance(document.querySelector('#joinGroupModal')).hide()
    }
})

// button to go back to groups
document.getElementById('btnBackToGroups').addEventListener('click', function () {
    // Hide the surveys section
    document.getElementById('viewSurveys').classList.add('d-none');
    document.getElementById('selectedGroup').classList.add('d-none');
    // Show the groups section
    document.getElementById('viewGroups').classList.remove('d-none');
});

document.querySelector('#btnPrivate').addEventListener('click', () => {
    strSurveyStatus = "Private"    
    document.querySelector('#btnPrivate').classList.add('btn-primary')
    document.querySelector('#btnPrivate').classList.remove('btn-secondary')
    document.querySelector('#btnPublic').classList.add('btn-secondary')
    document.querySelector('#btnPublic').classList.remove('btn-primary')

});

document.querySelector('#btnPublic').addEventListener('click', () => {
    strSurveyStatus = "Public"
    document.querySelector('#btnPublic').classList.add('btn-primary')
    document.querySelector('#btnPublic').classList.remove('btn-secondary')
    document.querySelector('#btnPrivate').classList.add('btn-secondary')
    document.querySelector('#btnPrivate').classList.remove('btn-primary')
});

document.querySelector('#btnSubmitForm').addEventListener('click', async () => {
    let strTargetUserID = document.querySelector('#cboTarget').value
    let blnSuccessful = false

    const objResponse = await ApiService.viewSurveyQuestion(strCurrSurveyID)
    if (objResponse.success) {
        const arrQuestions = objResponse.data.result
    
        for (let q = 0; q < arrQuestions.length; q++) {
            const objQuestion = arrQuestions[q]
            let strAnswer = null
    
            switch (objQuestion.QuestionType) {
                case "Multiple Choice":
                case "Likert":
                    const selectedOption = document.querySelector(`input[name="q${q}"]:checked`)
                    if (selectedOption) {
                        strAnswer = selectedOption.value
                        console.log(strAnswer)
                    }
                    break
    
                case "Short Answer":
                    const input = document.querySelector(`#q${q}`)
                    if (input) {
                        strAnswer = input.value.trim()
                        console.log(strAnswer)
                    }
                    break
            }
    
            if (strAnswer !== null && strAnswer.length > 0) {
                const objResponseSurvey = await ApiService.addSurveyResponse(
                    strCurrSurveyID,
                    objQuestion.QuestionID,
                    strAnswer,
                    strSurveyStatus,
                    strTargetUserID
                )
                if (objResponseSurvey.success) {
                    blnSuccessful = true
                }
            }
        }
    }

    if (blnSuccessful) {
        Swal.fire({
            title: "Success!",
            text: "Your responses were submitted.",
            icon: "success"
        })
    } else {
        Swal.fire({
            title: "Error",
            text: "Some responses could not be submitted.",
            icon: "error"
        })
    }


})

async function loadGroups() {
    const objResponse = await ApiService.viewUsersGroups()
    if (objResponse.success) {
        const arrGroups = objResponse.data.result
        let strGroupHTML = ""
        for (const group of arrGroups) {
            const objCourseInfo = await getCourseInfo(group.CourseID)
            strGroupHTML += `
                <div class="card shadow p-4 group-card selection-card position-relative me-2">
                    <h3>${group.GroupName}</h3>
                    <p>${objCourseInfo.CourseNumber}-${objCourseInfo.SectionNumber}</p>
                    <a class="stretched-link"
                        data-group-id="${group.GroupID}"
                        data-group-name="${group.GroupName}"
                        data-group-course-id="${group.CourseID}">
                    </a>
                </div>
            `
        }
        document.querySelector('#groupContainer').innerHTML = strGroupHTML
    }
}

async function loadSurveys() {
    const objResponse = await ApiService.viewSurveys(strCurrCourseID)    
    if (objResponse.success) {
        const arrSurveys = objResponse.data.result
        let strSurveyHTML = ""
        for (const survey of arrSurveys) {
            const objCourseInfo = await getCourseInfo(strCurrCourseID)
            strSurveyHTML += `
                <div class="card selection-card shadow-sm mb-2 position-relative">
                    <div class="card-body">
                        <h3 class="mt-2">${survey.Title}</h3>
                        <p>${objCourseInfo.CourseNumber}-${objCourseInfo.SectionNumber}</p>
                        <p>${objCourseInfo.StartDate} - ${objCourseInfo.EndDate}</p>
                        <a class="stretched-link"
                            data-survey-id="${survey.SurveyID}">
                        </a>
                    </div>
                </div>
            `;
        }
        document.querySelector('#surveyContainer').innerHTML = strSurveyHTML
    }
}

async function loadFeedback() {
    const objResponse = await ApiService.viewPublicSurveys()
    console.log(objResponse)
    if (objResponse.success) {
        const arrFeedback = objResponse.data.result
        let strFeedbackHTML = ""
        for (const feedback of arrFeedback) {
            strFeedbackHTML += `
                <div class="card selection-card shadow-sm mb-2 position-relative">
                    <div class="card-body">
                        <h3 class="card-title mt-2">${feedback.Title}</h3>
                        <p class="card-text">${feedback.CourseNumber}-${feedback.SectionNumber}</p>
                        <a class="stretched-link"
                            data-survey-id="${feedback.SurveyID}">
                        </a>
                    </div>
                </div>
            `
        }
        document.querySelector('#surveyFeedbackContainer').innerHTML = strFeedbackHTML
    }
}

async function loadSelectedSurvey() {
    const objResponse = await ApiService.viewSurveyQuestion(strCurrSurveyID)
    if (objResponse.success) {
        const arrQuestions = objResponse.data.result
        let arrOptions
        let strQuestionsHTML = ""
        for (let q = 0; q < arrQuestions.length; q++) {
            const question = arrQuestions[q]
            switch (question.QuestionType) {
                case "Multiple Choice":
                    strQuestionsHTML += `<p class="fw-bold">${question.Question}</p>`
                    arrOptions = JSON.parse(question.Options)
                    for (let a = 0; a < arrOptions.length; a++) {
                        strQuestionsHTML += `
                            <div class="form-check ms-2 mb-2">
                                <input class="form-check-input" type="radio" name="q${q}" id="q${q}-a${a}" value="${arrOptions[a]}" />
                                <label class="form-check-label" for="q${q}-a${a}">${arrOptions[a]}</label>
                            </div>
                        `
                    }
                    strQuestionsHTML += "<hr class='m-4'/>"
                    break
                case "Likert":
                    arrOptions = JSON.parse(question.Options)
                    strQuestionsHTML += `
                        <p class="fw-bold">${question.Question}</p>
                        <div class="text-center mb-3">
                            <div class="d-inline mx-3">${arrOptions[0]}</div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="q${q}" id="q${q}-radio1" value="1"
                                    aria-label="Radio input option for 1" />
                                <label class="form-check-label" for="q${q}-radio1">1</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="q${q}" id="q${q}-radio2" value="2"
                                    aria-label="Radio input option for 2" />
                                <label class="form-check-label" for="q${q}-radio2">2</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="q${q}" id="q${q}-radio3" value="3"
                                    aria-label="Radio input option for 3" />
                                <label class="form-check-label" for="q${q}-radio3">3</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="q${q}" id="q${q}-radio4" value="4"
                                    aria-label="Radio input option for 4" />
                                <label class="form-check-label" for="q${q}-radio4">4</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="q${q}" id="q${q}-radio5" value="5"
                                    aria-label="Radio input option for 5" />
                                <label class="form-check-label" for="q${q}-radio5">5</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="q${q}" id="q${q}-radio6" value="6"
                                    aria-label="Radio input option for 6" />
                                <label class="form-check-label" for="q${q}-radio6">6</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="q${q}" id="q${q}-radio7" value="7"
                                    aria-label="Radio input option for 7" />
                                <label class="form-check-label" for="q${q}-radio7">7</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="q${q}" id="q${q}-radio8" value="8"
                                    aria-label="Radio input option for 8" />
                                <label class="form-check-label" for="q${q}-radio8">8</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="q${q}" id="q${q}-radio9" value="9"
                                    aria-label="Radio input option for 9" />
                                <label class="form-check-label" for="q${q}-radio9">9</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="q${q}" id="q${q}-radio10" value="10"
                                    aria-label="Radio input option for 10" />
                                <label class="form-check-label" for="q${q}-radio10">10</label>
                            </div>
                            <div class="d-inline me-4">${arrOptions[1]}</div>
                        </div>
                        <hr class="m-4"/>
                    `
                    break
                case "Short Answer":
                    strQuestionsHTML += `
                        <p class="fw-bold">${question.Question}</p>
                        <div class="form-outline ms-2 me-2 mb-4">
                            <textarea class="form-control" rows="4" id="q${q}"></textarea>
                        </div>
                        <hr class="m-4"/>
                    `
                    break
                default:
                    break
            }
        }
        document.querySelector('#studentSurveyForm').innerHTML = strQuestionsHTML
    }
    loadTargetUsers()
}

async function loadTargetUsers() {
    const objResponse = await ApiService.viewGroupUsers(strCurrGroupID)    
    if (objResponse.success) {
        const arrUsers = objResponse.data.result
        let strUserHTML = "<option selected>Select Recipient</option>"
        for (const user of arrUsers) {
            const objResponseUsers = await ApiService.viewUserInfo(user.UserID)
            if (objResponseUsers.success) {
                const objUser = objResponseUsers.data.result[0]
                strUserHTML += `
                    <option value="${objUser.UserID}">${objUser.FirstName} ${objUser.LastName}</option>

                `;
            }
        }
        document.querySelector('#cboTarget').innerHTML = strUserHTML
    }
}

async function getCourseInfo(strCourseID) {
    const objResponse = await ApiService.viewCourseInfo(strCourseID)
    if (objResponse.success) {
        return objResponse.data.result[0]
    }
    return {}
}