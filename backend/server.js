const express = require('express')
const cors = require('cors')
const { v4:uuidv4 } = require('uuid')
const sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcrypt')

const HTTP_PORT = 8000
const intSalt = 10
const dbSource = 'reviewly.db'
const db = new sqlite3.Database(dbSource)

var app = express()
app.use(cors())
app.use(express.json())

// get user from id
app.get('/user/:userid', (req, res, next) => {
    const strUserID = req.params.userid

    let strCommand = "SELECT * FROM tblUsers WHERE UserID = ?"
    db.all(strCommand, [strUserID], (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).json({
                status: "error",
                message: err.message
            })
        } else {
            res.status(200).json({
                status: "success",
                firstName: result[0].FirstName,
                lastName: result[0].LastName,
                email: result[0].Email
            })
        }
    })
})

// create a new user
app.post('/user', (req, res, next) => {
    const strUserID = uuidv4()
    const strEmail = req.body.email.trim().toLowerCase()
    const strFirstName = req.body.firstName
    const strLastName = req.body.lastName
    let strPassword = req.body.password

    // validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(strEmail)) {
        return res.status(400).json({ error: "Email must be a valid email address" });
    }

    // validate password against NIST standards
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(strPassword)) {
        return res.status(400).json({
            error: "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character"
        });
    }

    // hash password and attempt to create user
    strPassword = bcrypt.hashSync(strPassword, intSalt)
    let strCommand = "INSERT INTO tblUsers (UserID, Email, FirstName, LastName, Password) VALUES (?, ?, ?, ?, ?)"
    let arrParameters = [strUserID, strEmail, strFirstName, strLastName, strPassword]
    db.run(strCommand, arrParameters, (err) => {
        if (err) {
            console.log(err)
            res.status(400).json({
                status: "error",
                message: err.message
            })
        } else {
            res.status(201).json({
                status: "success"
            })
        }
    })
})

// create a session for a user
app.post('/sessions', (req, res, next) => {
    const strEmail = req.body.email.trim().toLowerCase()
    const strPassword = req.body.password

    if (strEmail, strPassword == null) {
        return res.status(400).json({ error: "You must provide an email and password" })
    }

    let strCommand = "SELECT Password, UserID FROM tblUsers WHERE Email = ?"
    db.all(strCommand, [strEmail], (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).json({
                status: "error",
                message: err.message
            })
        } else {
            if (result.length == 0) {
                res.status(401).json({ error: "Invalid email or password" })
            } else {
                let strHash = result[0].Password
                if (bcrypt.compareSync(strPassword, strHash)) {
                    // on success that the passwords match, create new session id using uuid and insert into tblSessions
                    let strSessionID = uuidv4()
                    let strUserID = result[0].UserID
                    let datNow = new Date()
                    let strNow = datNow.toISOString()
                    let strCommand = "INSERT INTO tblSessions (SessionID, UserID, LastUsedDate, Status) VALUES (?, ?, ?, ?)"
                    let arrParameters = [strSessionID, strUserID, strNow, "Active"]
                    db.run(strCommand, arrParameters, (err) => {
                        if (err) {
                            console.log(err)
                            res.status(400).json({
                                status: "error",
                                message: err.message
                            })
                        } else {
                            // potential security improvement using cookies
                            // res.cookie('sessionid', strSessionID, {
                            //     httpOnly: true,
                            //     secure: true,
                            //     sameSite: 'Strict',
                            //     maxAge: 24 * 60 * 60 * 1000 // 1 day expiration
                            // })

                            res.status(201).json({
                                status: "success",
                                sessionid: strSessionID
                            })
                        }
                    })
                } else {
                    res.status(401).json({ error: "Invalid email or password" })
                }
            }
        }
    })
})

// delete a session for a user
app.delete('/sessions', (req, res, next) => {
    const strSessionID = req.body.sessionid

    if (strSessionID == null) {
        return res.status(400).json({ error: "You must provide a session id" })
    }

    let strCommand = "DELETE FROM tblSessions WHERE SessionID = ?"
    db.run(strCommand, [strSessionID], (err) => {
        if (err) {
            console.log(err)
            res.status(400).json({
                status: "error",
                message: err.message
            })
        } else {
            res.status(204).end()
        }
    })
})


// create a course
/*
    TODO:
    - add validation
    - get the user id of current user from session id (cookies?)
    - ensure dates are in correct format
*/
app.post('/courses', (req, res, next) => {
    const strCourseID = uuidv4()
    const strCourseName = req.body.courseName
    const strCourseNumber = req.body.courseNumber
    const strSectionNumber = req.body.sectionNumber
    const strSemesterTerm = req.body.semesterTerm
    const strStartDate = req.body.startDate
    const strEndDate = req.body.endDate
    // fix so its the current user
    const strInstructorID = req.body.instructorID

    if (strInstructorID, strCourseName, strCourseNumber, strSectionNumber, strSemesterTerm, strStartDate, strEndDate == null) {
        return res.status(400).json({ error: "You must provide an instructor, course title, course number, section number, semester term, start date, and end date" })
    }

    let strCommand = "INSERT INTO tblCourses (CourseID, CourseName, CourseNumber, SectionNumber, SemesterTerm, StartDate, EndDate, InstructorID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    let arrParameters = [strCourseID, strCourseName, strCourseNumber, strSectionNumber, strSemesterTerm, strStartDate, strEndDate, strInstructorID]
    db.run(strCommand, arrParameters, (err) => {
        if (err) {
            console.log(err)
            res.status(400).json({
                status: "error",
                message: err.message
            })
        } else {
            res.status(201).json({
                status: "success",
                message: "Course created"
            })
        }
    })
})

// get all courses for a user (instructor)
app.get('/courses/:userid', (req, res, next) => {
    const strUserID = req.params.userid

    let strCommand = "SELECT * FROM tblCourses WHERE InstructorID = ?"
    db.all(strCommand, [strUserID], (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).json({
                status: "error",
                message: err.message
            })
        } else {
            res.status(200).json({
                status: "success",
                result: result
            })
        }
    })
})

// get all groups for a course
app.get('/courses/groups/:courseIid', (req, res, next) => {
    const strCourseID = req.params.courseid

    let strCommand = "SELECT * FROM tblCourseGroups WHERE CourseID = ?"
    db.all(strCommand, [strCourseID], (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).json({
                status: "error",
                message: err.message
            })
        } else {
            res.status(200).json({
                status: "success",
                result: result
            })
        }
    })
})

// create group for a course
app.post('/courses/groups', (req, res, next) => {
    const strGroupID = uuidv4()
    const strCourseID = req.body.courseID
    const strGroupName = req.body.groupName

    if (strCourseID, strGroupName == null) {
        return res.status(400).json({ error: "You must provide a course id and group name" })
    }

    let strCommand = "INSERT INTO tblCourseGroups VALUES (?, ?, ?)"
    let arrParameters = [strGroupID, strGroupName, strCourseID]
    db.run(strCommand, arrParameters, (err) => {
        if (err) {
            console.log(err)
            res.status(400).json({
                status: "error",
                message: err.message
            })
        } else {
            res.status(201).json({
                status: "success",
                message: "Group created"
            })
        }
    })
})

// get all users in a group
app.get('/courses/groups/users/:groupid', (req, res, next) => {
    const strGroupID = req.params.groupid

    let strCommand = "SELECT * FROM tblGroupMembers WHERE GroupID = ?"
    db.all(strCommand, [strGroupID], (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).json({
                status: "error",
                message: err.message
            })
        } else {
            res.status(200).json({
                status: "success",
                result: result
            })
        }
    })
})

// add a user to a group
app.post('/courses/groups/users', (req, res, next) => {
    const strGroupMemberID = uuidv4()
    const strGroupID = req.body.groupID
    const strUserID = req.body.userID

    if (strGroupID, strUserID == null) {
        return res.status(400).json({ error: "You must provide a group id and user id" })
    }

    let strCommand = "INSERT INTO tblGroupMembers VALUES (?, ?, ?)"
    let arrParameters = [strGroupMemberID, strGroupID, strUserID]
    db.run(strCommand, arrParameters, (err) => {
        if (err) {
            console.log(err)
            res.status(400).json({
                status: "error",
                message: err.message
            })
        } else {
            res.status(201).json({
                status: "success",
                message: "User added to group"
            })
        }
    })
})



app.get('/', (req, res, next) => {
    res.status(200).json({ message: "I am alive" })
})

app.listen(HTTP_PORT, () => {
    console.log("App listening on", HTTP_PORT)
})