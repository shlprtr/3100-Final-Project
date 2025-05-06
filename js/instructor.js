import { ApiService } from '../services/apiService.js'
import { navigate } from '../services/pageRouter.js'

let strCurrCourseID = null
let strCurrGroupID = null

loadCourses()

// modal to create course
document.querySelector('#btnCreateCourseModal').addEventListener('click', function() {
    const createCourseModal = new bootstrap.Modal(document.querySelector('#createCourseModal'))
    createCourseModal.show()
})

// new course
document.querySelector('#btnCreateCourse').addEventListener('click', async function() {
    let strName = document.querySelector('#txtCourseName').value.trim()
    let strNumber = document.querySelector('#txtCourseNumber').value.trim()
    let strSection = document.querySelector('#txtSectionNumber').value.trim()
    let strSemester = document.querySelector('#txtSemester').value.trim()
    let strStartDate = document.querySelector('#txtStartDate').value
    let strEndDate = document.querySelector('#txtEndDate').value
    
    const objResponse = await ApiService.addCourse(strName, strNumber, strSection, strSemester, strStartDate, strEndDate)
    if (objResponse.success) {
        loadCourses()
        bootstrap.Modal.getInstance(document.querySelector('#createCourseModal')).hide()
    } else {
        Swal.fire({
            title: 'Oh no, an error occurred!',
            text: objResponse.data.error,
            icon: 'error',
            confirmButtonColor: 'var(--dark-purple)',
            background: 'var(--dark-blue)',
            color: 'white'
        })
    }
})

// listener for clicking a group card
document.querySelector('#groupContainer').addEventListener('click', (event) => {
    const cardLink = event.target.closest('.stretched-link')
    if (cardLink) {
        document.querySelector('#viewGroupDetails').classList.remove('d-none')
        document.querySelector('#groupContainer').classList.add('d-none')
        document.querySelector('#divCreateCourseModal').classList.add('d-none')
        
        // get and fill in data for in-depth course view
        const strCourseNumber = cardLink.getAttribute('data-course-number')
        const strSection = cardLink.getAttribute('data-section')

        strCurrCourseID = cardLink.getAttribute('data-course-id')

        document.querySelector('#txtCourseTitle').innerHTML = `${strCourseNumber}-${strSection}`

        loadSurveys()
        loadGroups(strCurrCourseID)
        loadStudents(strCurrCourseID)
    }
})

// modal to create group
document.querySelector('#btnCreateGroupModal').addEventListener('click', function() {
    const createGroupModal = new bootstrap.Modal(document.querySelector('#createGroupModal'))
    createGroupModal.show()
})

// new group
document.querySelector('#btnCreateGroup').addEventListener('click', async function() {
    const strName = document.querySelector('#txtGroupName').value.trim()
    
    const objResponse = await ApiService.addCourseGroup(strCurrCourseID, strName)
    if (objResponse.success) {
        loadGroups(strCurrCourseID)
        bootstrap.Modal.getInstance(document.querySelector('#createGroupModal')).hide()
    } else {
        Swal.fire({
            title: 'Oh no, an error occurred!',
            text: objResponse.data.error,
            icon: 'error',
            confirmButtonColor: 'var(--dark-purple)',
            background: 'var(--dark-blue)',
            color: 'white'
        })
    }
})

// create survey button functionality
document.querySelector('#btnNewSurvey').addEventListener('click', async (event) => {
    document.querySelector('#btnCreateGroupModal').style.display = 'none'
    document.querySelector('#viewGroupDetails').style.display = 'none'
    document.querySelector('#divHome').style.display = 'block'

    let objResponse = await ApiService.viewCourseInfo(strCurrCourseID)
    console.log(objResponse.data.result[0].CourseNumber)
    document.querySelector('#txtClassNameSectionName').innerHTML = `${objResponse.data.result[0].CourseNumber}-${objResponse.data.result[0].SectionNumber}`
})

// Highlight the active button in the navbar
function highlightActiveNavButton() {
    const buttons = document.querySelectorAll('.navbar-nav .btn');
    const currentHash = location.hash;

    buttons.forEach((button) => {
        // Remove the 'active' class from all buttons
        button.classList.remove('active');

        // Add the 'active' class to the button matching the current hash
        if (button.getAttribute('onClick')?.includes(currentHash)) {
            button.classList.add('active');
        }
    });
}

// Call the function on page load
highlightActiveNavButton();

// Add a listener to update the active button when the hash changes
window.addEventListener('hashchange', highlightActiveNavButton);

async function loadCourses() {
    const objResponse = await ApiService.viewCourses()
    if (objResponse.success) {
        const arrCourses = objResponse.data.result
        let strCourseHTML = ""
        arrCourses.forEach(course => {
            strCourseHTML += `
                <div class="card shadow p-4 group-card selection-card position-relative me-2">
                    <h3>${course.CourseNumber}-${course.SectionNumber}</h3>
                    <p style="margin-bottom:0px">${course.SemesterTerm}</p>
                    <p>${course.CourseName}</p>
                    <p style="margin-bottom:0px">Start: ${course.StartDate}</p>
                    <p style="margin-bottom:0px">End: ${course.EndDate}</p>
                    <a class="stretched-link"
                        data-course-id="${course.CourseID}"
                        data-course-name="${course.CourseName}"
                        data-course-number="${course.CourseNumber}"
                        data-section="${course.SectionNumber}"
                        data-semester="${course.SemesterTerm}">
                    </a>
                </div>
            `
        })
        document.querySelector('#groupContainer').innerHTML = strCourseHTML
    } else {
        console.error('Error fetching courses:', objResponse.error)
    }
}

async function loadGroups(strCourseID) {
    const objResponse = await ApiService.viewCourseGroups(strCourseID)
    if (objResponse.success) {
        const arrGroups = objResponse.data.result
        let strGroupHTML = ""
        arrGroups.forEach(group => {
            strGroupHTML += `
                <div class="card bg-dark p-4 group-card selection-card position-relative">
                    <h5>${group.GroupName}</h5>
                    <p class="fw-lighter">Code: ${group.JoinCode}</p>
                    <a class="stretched-link"
                        data-group-name="${group.GroupName}"
                        data-group-id="${group.GroupID}">
                    </a>
                </div>
            `
        })
        document.querySelector('#divGroupContainer').innerHTML = strGroupHTML
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
                <div class="card bg-dark selection-card group-card position-relative">
                    <div class="card-body">
                        <h4 class="mt-2">${survey.Title}</h4>
                        <p>${objCourseInfo.CourseNumber}-${objCourseInfo.SectionNumber}</p>
                        <a class="stretched-link"
                            data-survey-id="${survey.SurveyID}">
                        </a>
                    </div>
                </div>
            `;
        }
        document.querySelector('#divSurveyContainer').innerHTML = strSurveyHTML
    }
}

// function for group student list
async function loadStudents(strCurrCourseID) {
    const objResponse = await ApiService.viewCourseUsers(strCurrCourseID)
    if (objResponse.success) {
        const arrGroups = objResponse.data.result
        console.log("arrGroups: " , arrGroups)
        let strStudentList = ""
        arrGroups.forEach(student => {
            strStudentList += `
                <option value=${student.FirstName}>${student.FirstName} ${student.LastName}</option>
            `
        })
        document.querySelector('#selStudents').innerHTML = strStudentList



        //document.querySelector('#selStudents').innerHTML = `<option value=${strFirstName}>${strFirstName} ${strLastName}</option>`
    }
}

async function getCourseInfo(strCourseID) {
    const objResponse = await ApiService.viewCourseInfo(strCourseID)
    if (objResponse.success) {
        return objResponse.data.result[0]
    }
    return {}
}

var survey = {
    questions: []
}
var newQuestion

document.querySelector('#btnAddTitle').addEventListener('click', (event) => {
    let strSurveyTitle = document.querySelector("#txtSurveyTitle").value

    let blnError = false
    let strMessage = ""

    if(strSurveyTitle.length < 1){
        blnError = true
        strMessage += '<p class="mb-0 mt-0">You must enter a survey title</p>'
    }

    if(blnError){
        Swal.fire({
            title: "Oh no, you have an error!",
            html: strMessage,
            icon: 'error'
        });
    }
    else {
        document.querySelector('#surveyTitle').innerHTML = strSurveyTitle
    }
});
document.querySelector('#btnCreateNewQuestion').addEventListener('click', (event) => {
    let strQuestion = document.querySelector("#cboQuestion").value

    let blnError = false
    let strMessage = ""

    if(strQuestion == ''){
        blnError = true
        strMessage += '<p class="mb-0 mt-0">You must select a question type</p>'
    }

    if(blnError){
        Swal.fire({
            title: "Oh no, you have an error!",
            html: strMessage,
            icon: 'error'
        });
    }
    else {
        let questionCount = 0
        if(strQuestion == "multiple choice"){
            document.querySelector('#divCreateQuestion').innerHTML = '<label for="txtMultipleChoiceQuestion" class="mt-4 mb-0">Enter Question:</label>'
            document.querySelector('#divCreateQuestion').innerHTML += '<input id="txtMultipleChoiceQuestion" class="form-control mb-0" type="text" placeholder="Enter question here" aria-label="Input for short answer question" required>'
            document.querySelector('#divCreateQuestion').innerHTML += '<div id="divMultipleChoiceAnswers"> </div>'
            document.querySelector('#divCreateQuestion').innerHTML += '<button id="btnAddMultipleChoiceAnswer" class="btn btn-secondary col-12 mt-2 mb-0" type="button">Add Answer</button>'
            document.querySelector('#divCreateQuestion').innerHTML += '<button id="btnCreateMultipleChoiceQuestion" class="btn btn-secondary col-12 mt-2 mb-4" type="button">Add Question To Survey</button>'
            document.querySelector('#btnAddMultipleChoiceAnswer').addEventListener('click', (event) => {
                questionCount++
                document.querySelector('#divMultipleChoiceAnswers').innerHTML += `<label for="txtMultipleChoiceAnswer${questionCount}" class="mt-1 mb-0">Answer ${questionCount}:</label>`
                document.querySelector('#divMultipleChoiceAnswers').innerHTML += `<input id="txtMultipleChoiceAnswer${questionCount}" class="form-control mb-0" type="text" placeholder="Enter question here" aria-label="Input for short answer question"></input>`
            });
            document.querySelector('#btnCreateMultipleChoiceQuestion').addEventListener('click', (event) => {
                let strMultipleChoiceQuestion = document.querySelector("#txtMultipleChoiceQuestion").value
                const answerInputs = document.querySelectorAll('#divMultipleChoiceAnswers input')
                let strAnswer = ''

                newQuestion = {
                    question: strMultipleChoiceQuestion,
                    questionType: 'Multiple Choice',
                    options: []
                };

                let blnError = false
                let strMessage = ""

                if(strMultipleChoiceQuestion.length < 1){
                    blnError = true
                    strMessage += '<p class="mb-0 mt-0">You must enter a question</p>'
                }
                if(questionCount < 1) {
                    blnError = true
                    strMessage += '<p class="mb-0 mt-0">You must enter at least one answer</p>'
                }

                if(blnError){
                    Swal.fire({
                        title: "Oh no, you have an error!",
                        html: strMessage,
                        icon: 'error'
                    });
                }
                else {
                    document.querySelector('#divSurveys').innerHTML += `<p class="mb-1">${strMultipleChoiceQuestion}</p>`
                    let answersHTML = '<ul class="mb-4">'
                    answerInputs.forEach((input, index) => {
                        const answerText = input.value.trim()
                        if (answerText.length > 0) {
                            strAnswer += `<input type="radio" id="${answerText}" value="${answerText}" style="margin-left: 30px" name="${strMultipleChoiceQuestion}">`
                            strAnswer += `<label for="${answerText}" style="margin-left: 15px;">${answerText}</label><br>`
                            newQuestion.options.push(answerText);
                        }
                    })
                    document.querySelector('#divSurveys').innerHTML += `<div class="mb-4">${strAnswer}</div>`
                    survey.questions.push(newQuestion);
                }
            });
        }
        if(strQuestion == "likert scale"){
            document.querySelector('#divCreateQuestion').innerHTML = '<label for="txtLikertQuestion" class="mt-4 mb-0">Enter Question:</label>'
            document.querySelector('#divCreateQuestion').innerHTML += '<input id="txtLikertQuestion" class="form-control mb-0" type="text" placeholder="Enter question here" aria-label="Input for likert question" required>'
            document.querySelector('#divCreateQuestion').innerHTML += '<label for="txtLikertQuestion1" class="mb-0">Enter A Low Range:</label>'
            document.querySelector('#divCreateQuestion').innerHTML += '<input id="txtLikertQuestion1" class="form-control mb-0" type="text" placeholder="Enter low range here" aria-label="Input for first likert range" required>'
            document.querySelector('#divCreateQuestion').innerHTML += '<label for="txtLikertQuestion2" class="mb-0">Enter A High Range:</label>'
            document.querySelector('#divCreateQuestion').innerHTML += '<input id="txtLikertQuestion2" class="form-control mb-0" type="text" placeholder="Enter high range here" aria-label="Input for second likert range" required>'
            document.querySelector('#divCreateQuestion').innerHTML += '<button id="btnCreateLikertQuestion" class="btn btn-secondary col-12 mt-2 mb-4" type="button">Add Question To Survey</button>'
            document.querySelector('#btnCreateLikertQuestion').addEventListener('click', (event) => {
                let strLikertQuestion = document.querySelector("#txtLikertQuestion").value
                let strLikertQuestion1 = document.querySelector("#txtLikertQuestion1").value
                let strLikertQuestion2 = document.querySelector("#txtLikertQuestion2").value
                newQuestion = {
                    question: strLikertQuestion,
                    questionType: 'Likert Scale',
                    options: [strLikertQuestion1, strLikertQuestion2]
                };

                let blnError = false
                let strMessage = ""

                if(strLikertQuestion.length < 1){
                    blnError = true
                    strMessage += '<p class="mb-0 mt-0">You must enter a question</p>'
                }
                if(strLikertQuestion1.length < 1){
                    blnError = true
                    strMessage += '<p class="mb-0 mt-0">You must enter a low range</p>'
                }
                if(strLikertQuestion2.length < 1){
                    blnError = true
                    strMessage += '<p class="mb-0 mt-0">You must enter a high range</p>'
                }

                if(blnError){
                    Swal.fire({
                        title: "Oh no, you have an error!",
                        html: strMessage,
                        icon: 'error'
                    });
                }
                else {
                    let strAnswer = ''
                    document.querySelector('#divSurveys').innerHTML += `<p class="mb-1">${strLikertQuestion}</p>`
                    strAnswer += '<div class="d-flex" style="display: inline-block; justify-content: space-between">'
                    strAnswer += `<p class="mb-1">${strLikertQuestion1}</p>`
                    strAnswer += `<input type="radio" id="${strLikertQuestion} 1" value="${strLikertQuestion} 1" name="${strLikertQuestion}">`
                    strAnswer += `<input type="radio" id="${strLikertQuestion} 2" value="${strLikertQuestion} 2" name="${strLikertQuestion}">`
                    strAnswer += `<input type="radio" id="${strLikertQuestion} 3" value="${strLikertQuestion} 3" name="${strLikertQuestion}">`
                    strAnswer += `<input type="radio" id="${strLikertQuestion} 4" value="${strLikertQuestion} 4" name="${strLikertQuestion}">`
                    strAnswer += `<input type="radio" id="${strLikertQuestion} 5" value="${strLikertQuestion} 5" name="${strLikertQuestion}">`
                    strAnswer += `<p class="mb-1">${strLikertQuestion2}</p>`
                    strAnswer += '</div>'
                    document.querySelector('#divSurveys').innerHTML += `<div class="mb-4">${strAnswer}</div>`
                    survey.questions.push(newQuestion);
                }
            });
        }
        if(strQuestion == "short answer"){
            document.querySelector('#divCreateQuestion').innerHTML = '<label for="txtShortAnswer" class="mt-4 mb-1">Enter Question:</label>'
            document.querySelector('#divCreateQuestion').innerHTML += '<input id="txtShortAnswer" class="form-control mb-0" type="text" placeholder="Enter question here" aria-label="Input for short answer question" required>'
            document.querySelector('#divCreateQuestion').innerHTML += '<button id="btnCreateShortAnswerQuestion" class="btn btn-secondary col-12 mt-2 mb-4" type="button">Add Question To Survey</button>'
            document.querySelector('#btnCreateShortAnswerQuestion').addEventListener('click', (event) => {
                let strShortAnswerQuestion = document.querySelector("#txtShortAnswer").value
                newQuestion = {
                    question: strShortAnswerQuestion,
                    questionType: 'Short Answer',
                    options: []
                };

                let blnError = false
                let strMessage = ""

                if(strShortAnswerQuestion.length < 1){
                    blnError = true
                    strMessage += '<p class="mb-0 mt-0">You must enter a question</p>'
                }

                if(blnError){
                    Swal.fire({
                        title: "Oh no, you have an error!",
                        html: strMessage,
                        icon: 'error'
                    });
                }
                else {
                    document.querySelector('#divSurveys').innerHTML += `<p class="mb-1">${strShortAnswerQuestion}</p>`
                    document.querySelector('#divSurveys').innerHTML += '<textarea id="txtResponseShortAnswer" rows="3" mb-4" cols="40" wrap="soft" class="text-white" placeholder="Enter your response here" aria-label="Input for Short Answer"></textarea>'
                    survey.questions.push(newQuestion);
                }
            });
        }
    }
});

document.querySelector('#btnCreateSurvey').addEventListener('click', async (event) => {
    event.preventDefault()
    // Get the survey preview content
    const surveyPreview = document.querySelector('#divSurveys').innerHTML;
    let blnError = false
    let strMessage = ""
    let strSurveyTitle = document.querySelector("#surveyTitle").textContent.trim()
    let strSurveyStart = document.querySelector("#txtSurveyStartDate").value
    let strSurveyEnd = document.querySelector("#txtSurveyEndDate").value
    
    if (strSurveyTitle === '' || strSurveyTitle === 'Survey Title') {
        blnError = true
        strMessage += '<p class="mb-0 mt-0">You must enter a survey title</p>'
    }
    if (!surveyPreview.trim()) {
        blnError = true
        strMessage += '<p class="mb-0 mt-0">You must add at least one question to create a survey.</p>'
    }
    if (strSurveyStart.length < 1) {
        blnError = true
        strMessage += '<p class="mb-0 mt-0">You must enter a survey start date</p>'
    }
    if (strSurveyEnd.length < 1) {
        blnError = true
        strMessage += '<p class="mb-0 mt-0">You must enter a survey end date</p>'
    }

    let objResponse = await ApiService.addSurvey(strCurrCourseID, strSurveyTitle, strSurveyStart, strSurveyEnd)
    let objSurveyResponse = await ApiService.viewSurveys(strCurrCourseID)
    for (let i = 0; i < objSurveyResponse.data.result.length; i++) {
        if (objSurveyResponse.data.result[i].Title == strSurveyTitle) {
            let strSurveyID = objSurveyResponse.data.result[i].SurveyID
            for (let i = 0; i < survey.questions.length; i++) {
                let objSurveyQuestionResponse = await ApiService.addSurveyQuestion(strSurveyID, survey.questions[i].question, JSON.stringify(survey.questions[i].options), survey.questions[i].questionType)
            }
        }
    }

    // Check if the survey has content
    if (blnError) {
        // Show SweetAlert2 error message
        Swal.fire({
            title: "Error",
            html: strMessage,
            icon: "error",
            confirmButtonText: "OK",
        });
    } 

    // Show SweetAlert2 success message
    Swal.fire({
        title: "Survey Created!",
        text: "Your survey has been successfully created.",
        icon: "success",
        confirmButtonText: "View Surveys",
        showCancelButton: true,
        cancelButtonText: "Stay Here",
    }).then((result) => {
        if (result.isConfirmed) {
            // Save the survey preview to localStorage (or send it to the server)
            localStorage.setItem('surveyPreview', surveyPreview);

            // // Redirect to createdsurveys.html     ----Database info for current and old surveys to be shown
            // window.location.href = "createdsurveys.html";
        }
    });
});

document.querySelector('#btnReturnToClass').addEventListener('click', (event) => {
    document.querySelector('#btnCreateGroupModal').style.display = 'block'
    document.querySelector('#viewGroupDetails').style.display = 'block'
    document.querySelector('#divHome').style.display = 'none'
});