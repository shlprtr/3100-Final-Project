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
document.querySelector('#btnNewSurvey').addEventListener('click', function() {
    navigate('#/create-survey')
})

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