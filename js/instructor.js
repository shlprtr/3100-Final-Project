import { ApiService } from '../services/apiService.js'

loadCourses()

// new class
document.querySelector('#btnCreateCourse').addEventListener('click', async function() {
    let strName = document.querySelector('#txtCourseName').value.trim()
    let strNumber = document.querySelector('#txtCourseNumber').value.trim()
    let strSection = document.querySelector('#txtSectionNumber').value.trim()
    let strSemester = document.querySelector('#txtSemester').value.trim()
    let strStartDate = document.querySelector('#txtStartDate').value
    let strEndDate = document.querySelector('#txtEndDate').value
    
    const objResponse = await ApiService.addcourse(strName, strNumber, strSection, strSemester, strStartDate, strEndDate)
    if (objResponse.success) {
        loadCourses()
        let strCode = generateClassCode()
        console.log(strCode)
    }

})

// modal to create course
document.querySelector('#btnCreateCourseModal').addEventListener('click', function() {
    const createCourseModal = new bootstrap.Modal(document.querySelector('#createCourseModal'))
    createCourseModal.show()
})

// listener for clicking a group card
document.querySelector('#groupContainer').addEventListener('click', (event) => {
    const cardLink = event.target.closest('.stretched-link')
    if (cardLink) {
        document.querySelector('#viewGroupDetails').classList.remove('d-none')
        document.querySelector('#groupContainer').classList.add('d-none')
        document.querySelector('#divCreateCourseModal').classList.add('d-none')
        document.querySelector('#divCreateGroupModal').classList.remove('d-none')
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
    return code
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
        objScript.type = 'module'
        document.head.appendChild(objScript)
        document.querySelector('#divView').innerHTML = html
    })
    .catch(error => console.erro("Error fetching new survey form:", error))
})

async function loadCourses() {
    const objResponse = await ApiService.viewcourses()
    if (objResponse.success) {
        const arrCourses = objResponse.data.result
        arrCourses.forEach(course => {
            const strCourseHTML = `
                <div class="card shadow p-4 group-card selection-card position-relative me-2">
                    <h3>${course.CourseNumber}-${course.SectionNumber}</h3>
                    <p style="margin-bottom:0px">${course.SemesterTerm}</p>
                    <p>${course.CourseName}</p>
                    <p style="margin-bottom:0px">Start: ${course.StartDate}</p>
                    <p style="margin-bottom:0px">End: ${course.EndDate}</p>
                    <a class="stretched-link" data-course-id="${course.CourseID}"></a>
                </div>
            `
            document.querySelector('#groupContainer').innerHTML += strCourseHTML
        })
    } else {
        console.error('Error fetching courses:', objResponse.error)
    }
}