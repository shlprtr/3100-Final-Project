import { ApiService } from '../services/apiService.js'
import { navigate } from '../services/pageRouter.js'

var survey = {
    questions: []
}
var newQuestion

//validation for adding title button -makes sure the title isnt empty when button pressed
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

//Adds new question depending on type choosen (multi choice, short, likert)
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
            document.querySelector('#divCreateQuestion').innerHTML += '<input id="txtMultipleChoiceQuestion" class="form-control mb-0 placeholder-color" type="text" placeholder="Enter question here" aria-label="Input for short answer question" required>'
            document.querySelector('#divCreateQuestion').innerHTML += '<div id="divMultipleChoiceAnswers"> </div>'
            document.querySelector('#divCreateQuestion').innerHTML += '<button id="btnAddMultipleChoiceAnswer" class="btn btn-secondary col-12 mt-2 mb-0" type="button">Add Answer</button>'
            document.querySelector('#divCreateQuestion').innerHTML += '<button id="btnCreateMultipleChoiceQuestion" class="btn btn-secondary col-12 mt-2 mb-4 " type="button">Add Question To Survey</button>'
            document.querySelector('#btnAddMultipleChoiceAnswer').addEventListener('click', (event) => {
                questionCount++
                document.querySelector('#divMultipleChoiceAnswers').innerHTML += `<label for="txtMultipleChoiceAnswer${questionCount}" class="mt-1 mb-0">Answer ${questionCount}:</label>`
                document.querySelector('#divMultipleChoiceAnswers').innerHTML += `<input id="txtMultipleChoiceAnswer${questionCount}" class="form-control mb-0" type="text placeholder-color" placeholder="Enter question here" aria-label="Input for short answer question"></input>`
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
            document.querySelector('#divCreateQuestion').innerHTML += '<input id="txtLikertQuestion" class="form-control mb-0 placeholder-color" type="text" placeholder="Enter question here" aria-label="Input for likert question" required>'
            document.querySelector('#divCreateQuestion').innerHTML += '<label for="txtLikertQuestion1" class="mb-0">Enter A Low Range:</label>'
            document.querySelector('#divCreateQuestion').innerHTML += '<input id="txtLikertQuestion1" class="form-control mb-0 placeholder-color" type="text" placeholder="Enter low range here" aria-label="Input for first likert range" required>'
            document.querySelector('#divCreateQuestion').innerHTML += '<label for="txtLikertQuestion2" class="mb-0">Enter A High Range:</label>'
            document.querySelector('#divCreateQuestion').innerHTML += '<input id="txtLikertQuestion2" class="form-control mb-0 placeholder-color" type="text" placeholder="Enter high range here" aria-label="Input for second likert range" required>'
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
            document.querySelector('#divCreateQuestion').innerHTML += '<input id="txtShortAnswer" class="form-control mb-0 placeholder-color" type="text" placeholder="Enter question here" aria-label="Input for short answer question" required>'
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
                    document.querySelector('#divSurveys').innerHTML += '<textarea id="txtResponseShortAnswer" rows="3" mb-4" cols="40" wrap="soft" class="text-white placeholder-color" placeholder="Enter your response here" aria-label="Input for Short Answer"></textarea>'
                    survey.questions.push(newQuestion);
                }
            });
        }
    }
});

//Button Validation - makes sure your not creating an empty survey or not include a start/end date
document.querySelector('#btnCreateSurvey').addEventListener('click', async (event) => {
    event.preventDefault()
    // Get the survey preview content
    const surveyPreview = document.querySelector('#divSurveys').innerHTML;
    let blnError = false
    let strMessage = ""
    let strSurveyTitle = document.querySelector("#surveyTitle").textContent.trim()
    let strSurveyStart = document.querySelector("#txtStartDate").value
    let strSurveyEnd = document.querySelector("#txtEndDate").value
    
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

    let objResponse = await ApiService.addSurvey("f42cba98-c747-43b5-8f10-7e23b2bf7285", strSurveyTitle, strSurveyStart, strSurveyEnd)
    let objSurveyResponse = await ApiService.viewSurveys('f42cba98-c747-43b5-8f10-7e23b2bf7285')
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

// Display the survey preview on the createdsurveys.html page
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('createdsurveys.html')) {
        const surveyPreview = localStorage.getItem('surveyPreview');
        if (surveyPreview) {
            document.querySelector('#divCreatedSurveys').innerHTML = surveyPreview;
        }
    }
});

document.querySelector('#btnReturnToClass').addEventListener('click', (event) => {
    navigate('#/instructor')
});