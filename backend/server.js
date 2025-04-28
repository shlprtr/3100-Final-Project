const express = require('express')
const cors = require('cors')
const { v4:uuidv4 } = require('uuid')
const sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')

const HTTP_PORT = 8000
const intSalt = 10
const dbSource = 'reviewly.db'
const db = new sqlite3.Database(dbSource)

var app = express()
app.use(cors({
    origin: 'http://localhost:5500', // frontend, localhost development
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())


// get user info from session id
app.get('/user', authenticateUser, (req, res, next) => {
    const strUserID = req.userID

    let strCommand = "SELECT FirstName, LastName, Email FROM tblUsers WHERE UserID = ?"
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

// create a new user (register)
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
            res.status(201).json({ status: "success" })
        }
    })
})

// check for active session
app.get('/sessions', (req, res, next) => {
    const strSessionID = req.cookies.sessionID
    if (!strSessionID) {
        return res.status(401).json({ error: "No session id provided" });
    }

    verifySession(strSessionID)
    .then((result) => {
        if (result == false) {
            return res.status(401).json({ error: "Invalid session identifier" })
        } else {
            return res.status(200).json({ status: "success" })
        }
    })
    .catch((err) => {
        console.log(err)
        res.status(400).json({ error: err.message })
    })
})

// create a session for a user (login)
app.post('/sessions', (req, res, next) => {
    const strEmail = req.body.email.trim().toLowerCase()
    const strPassword = req.body.password

    if (!strEmail || !strPassword) {
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
                            res.cookie('sessionID', strSessionID, {
                                httpOnly: true,  // only accessible by the web server
                                secure: false,  // only work across https, false for localhost development
                                sameSite: 'Lax',  // only send from same domain, lax for localhost development
                                maxAge: 12 * 60 * 60 * 1000  // 12 hours
                            })
                            res.status(201).json({ status: "success" })
                        }
                    })
                } else {
                    res.status(401).json({ error: "Invalid email or password" })
                }
            }
        }
    })
})

// update a session to inactive (logout)
app.put('/sessions', (req, res, next) => {
    const strSessionID = req.cookies.sessionID
    verifySession(strSessionID)
    .then((result) => {
        if (result == false) {
            return res.status(401).json({ error: "Invalid session identifier" })
        }

        let strCommand = "UPDATE tblSessions SET Status = 'Inactive' WHERE SessionID = ?"
        db.run(strCommand, [strSessionID], (err) => {
            if (err) {
                console.log(err)
                res.status(400).json({
                    status: "error",
                    message: err.message
                })
            } else {
                res.status(201).json({ status: "success" })
            }
        })
    })
    .catch((err) => {
        console.log(err)
        res.status(400).json({ error: err.message })
    })
})


// get all courses a user instructs
app.get('/courses', authenticateUser, (req, res, next) => {
    const strUserID = req.userID

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

// create a course
/*
    TODO:
    - add validation
    - ensure dates are in correct format
*/
app.post('/courses', authenticateUser, (req, res, next) => {
    const strCourseID = uuidv4()
    const strInstructorID = req.userID  // retrieved from authenticateUser middleware
    const strCourseName = req.body.courseName
    const strCourseNumber = req.body.courseNumber
    const strSectionNumber = req.body.sectionNumber
    const strSemesterTerm = req.body.semesterTerm
    const strStartDate = req.body.startDate
    const strEndDate = req.body.endDate

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
            res.status(201).json({ status: "success" })
        }
    })
})


// get all groups for a course from session id
app.get('/courses/groups', authenticateUser, (req, res, next) => {
    const strUserID = req.userID
    const strCourseID = req.body.courseID

    let strCommand = "SELECT * FROM tblCourseGroups WHERE CourseID = ? AND InstructorID = ?"
    db.all(strCommand, [strCourseID, strUserID], (err, result) => {
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
    const strSessionID = req.cookies.sessionID
    verifySession(strSessionID)
    .then((result) => {
        if (result == false) {
            return res.status(401).json({ error: "Invalid session identifier" })
        }

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
                res.status(201).json({ status: "success" })
            }
        })
    })
    .catch((err) => {
        console.log(err)
        res.status(400).json({ error: err.message })
    })
})

// get all users in a group
app.get('/courses/groups/users', (req, res, next) => {
    const strSessionID = req.cookies.sessionID
    verifySession(strSessionID)
    .then((result) => {
        if (result == false) {
            return res.status(401).json({ error: "Invalid session identifier" })
        }

        const strGroupID = req.body.groupID
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
    .catch((err) => {
        console.log(err)
        res.status(400).json({ error: err.message })
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
            res.status(201).json({ status: "success" })
        }
    })
})



app.get('/', (req, res, next) => {
    res.status(200).json({ message: "I am alive" })
})

app.listen(HTTP_PORT, () => {
    console.log("App listening on", HTTP_PORT)
})

// verify session id
function verifySession(strSessionID) {
    return new Promise((resolve, reject) => {
        let strCommand = "SELECT * FROM tblSessions WHERE SessionID = ? AND Status = 'Active'"
        db.all(strCommand, [strSessionID], (err, result) => {
            if (err) {
                console.log(err)
                reject(err)
            } else {
                if (!result || result.length == 0) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            }
        })
    })
}

// middleware to get user id from a valid session id
function authenticateUser(req, res, next) {
    const strSessionID = req.cookies.sessionID;

    if (!strSessionID) {
        return res.status(401).json({ error: "Unauthorized: No session ID provided" });
    }

    verifySession(strSessionID)
    .then((isValid) => {
        if (!isValid) {
            return res.status(401).json({ error: "Unauthorized: Invalid session" });
        }

        // Retrieve the UserID from the session
        const strCommand = "SELECT UserID FROM tblSessions WHERE SessionID = ?";
        db.all(strCommand, [strSessionID], (err, result) => {
            if (err) {
                console.error(err)
                return res.status(401).json({ error: "Unauthorized: Invalid session" });
            }

            if (!result || result.length === 0) {
                return res.status(401).json({ error: "Unauthorized: Invalid session" });
            }

            req.userID = result[0].UserID // Attach UserID to the request object
            next();
        });
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    });
}