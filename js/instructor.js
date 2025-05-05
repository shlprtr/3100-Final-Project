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
        document.querySelector('#divCreateGroupModal').classList.remove('d-none')
        
        // get and fill in data for in-depth course view
        const strCourseNumber = cardLink.getAttribute('data-course-number')
        const strSection = cardLink.getAttribute('data-section')

        strCurrCourseID = cardLink.getAttribute('data-course-id')

        document.querySelector('#txtCourseTitle').innerHTML = `${strCourseNumber}-${strSection}`

        loadGroups(strCurrCourseID)
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
                    <a class="stretched-link"
                        data-group-name="${group.GroupName}"
                        data-group-id="${group.GroupID}">
                    </a>
                </div>
            `
        })
        document.querySelector('#divSurveyContainer').innerHTML = strGroupHTML
    }
}

async function loadUsers() {
    const objResponse = await ApiService.viewCourseUsers(strCurrCourseID)
    if (objResponse.success) {
        //array of users in course
        const arrUsers = objResponse.data.result

        let strUsersHTML = ""
        arrUsers.forEach(users => {
            strUsersHTML += `
               <option value="${users.UserID}">${users.FirstName} ${users.LastName} </option>
            `
        })
        document.querySelector('#selStudents').innerHTML = strGroupHTML
    }
}
