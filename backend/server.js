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
    origin: "http://localhost:5500",
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
            res.status(500).json({
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

app.get('/userinfo/:userID', authenticateUser, (req, res, next) => {
    const strUserID = req.params.userID

    let strCommand = "SELECT FirstName, LastName, Email FROM tblUsers WHERE UserID = ?"
    db.all(strCommand, [strUserID], (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json({
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
        })
    }

    // hash password and attempt to create user
    strPassword = bcrypt.hashSync(strPassword, intSalt)
    let strCommand = "INSERT INTO tblUsers (UserID, Email, FirstName, LastName, Password) VALUES (?, ?, ?, ?, ?)"
    let arrParameters = [strUserID, strEmail, strFirstName, strLastName, strPassword]
    db.run(strCommand, arrParameters, (err) => {
        if (err) {
            console.log(err)
            res.status(500).json({
                status: "error",
                message: err.message
            })
        } else {
            res.status(201).json({ status: "success" })
        }
    })
})

// update current user
app.put('/user', authenticateUser, (req, res, next) => {
    let strFirstName = req.body.firstName
    let strLastName = req.body.lastName
    let strEmail = req.body.email
    let strUserID = req.userID

    if (strFirstName.length < 1) {
        return res.status(400).json({ error: "You must provide a first name" })
    }
    if (strLastName.length < 1) {
        return res.status(400).json({ error: "You must provide a last name" })
    }
    if (strEmail.length < 1) {
        return res.status(400).json({ error: "You must provide a email" })
    }
    let comUpdate = `UPDATE tblUsers SET FirstName = ?, LastName = ?, Email = ? WHERE UserID = ?`;
    db.run(comUpdate, [strFirstName, strLastName, strEmail, strUserID], function (err) {
        if (err) {
            console.log(err);
            return res.status(500).json({ status: "error", message: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "TaskID not found" });
        }
    })
    res.status(200).json({ status: "success", message: "Task updated successfully" });
});


// check for active session
app.get('/sessions', verifySession, (req, res, next) => {
    res.status(200).json({ status: "success" })
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
            res.status(500).json({
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
                            res.status(500).json({
                                status: "error",
                                message: err.message
                            })
                        } else {
                            res.cookie('sessionID', strSessionID, {
                                httpOnly: true,  // only accessible by the web server
                                secure: true,  // only work across https, false for localhost development
                                sameSite: 'Strict',  // only send from same domain
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

// update a session to 'inactive' (logout)
app.put('/sessions', verifySession, (req, res, next) => {
    const strSessionID = req.cookies.sessionID

    let strCommand = "UPDATE tblSessions SET Status = 'Inactive' WHERE SessionID = ?"
    db.run(strCommand, [strSessionID], (err) => {
        if (err) {
            console.log(err)
            res.status(500).json({
                status: "error",
                message: err.message
            })
        } else {
            res.clearCookie('sessionID', {
                httpOnly: true,
                secure: false,
                sameSite: 'Lax'
            })
            res.status(201).json({ status: "success" })
        }
    })
})


// get all courses a user instructs
app.get('/courses', authenticateUser, (req, res, next) => {
    const strUserID = req.userID

    let strCommand = "SELECT * FROM tblCourses WHERE InstructorID = ?"
    db.all(strCommand, [strUserID], (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json({
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

// get course info from courseid
app.get('/courses/:courseid', authenticateUser, verifyInstructorOrMember, (req, res, next) => {
    const strCourseID = req.params.courseid

    let strCommand = "SELECT CourseNumber, SectionNumber FROM tblCourses WHERE CourseID = ?"
    db.all(strCommand, [strCourseID], (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json({
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
app.post('/courses', authenticateUser, (req, res, next) => {
    const strCourseID = uuidv4()
    const strInstructorID = req.userID
    const strCourseName = req.body.courseName
    const strCourseNumber = req.body.courseNumber
    const strSectionNumber = req.body.sectionNumber
    const strSemesterTerm = req.body.semesterTerm
    const strStartDate = req.body.startDate
    const strEndDate = req.body.endDate

    if (!strCourseName || !strCourseNumber || !strSectionNumber || !strSemesterTerm || !strStartDate || !strEndDate) {
        return res.status(400).json({ error: "You must provide course name, course number, section number, semester term, start date, and end date" })
    }

    let strCommand = "INSERT INTO tblCourses (CourseID, CourseName, CourseNumber, SectionNumber, SemesterTerm, StartDate, EndDate, InstructorID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    let arrParameters = [strCourseID, strCourseName, strCourseNumber, strSectionNumber, strSemesterTerm, strStartDate, strEndDate, strInstructorID]
    db.run(strCommand, arrParameters, (err) => {
        if (err) {
            console.log(err)
            res.status(500).json({
                status: "error",
                message: err.message
            })
        } else {
            res.status(201).json({ status: "success" })
        }
    })
})


// get all groups for a user
app.get('/courses/groups/user', authenticateUser, (req, res, next) => {
    const strUserID = req.userID

    const strCommand = `
        SELECT cg.GroupID, cg.GroupName, cg.CourseID
        FROM tblGroupMembers gm
        JOIN tblCourseGroups cg ON gm.GroupID = cg.GroupID
        WHERE gm.UserID = ?
    `;
    db.all(strCommand, [strUserID], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ status: "error", message: err.message })
        }
        res.status(200).json({ status: "success", result: result })
    })
})

// get all groups for a course
app.get('/courses/groups/:courseid', authenticateUser, verifyInstructor, (req, res, next) => {
    const strUserID = req.userID
    const strCourseID = req.params.courseid

    let strCommand = "SELECT * FROM tblCourseGroups WHERE CourseID = ?"
    db.all(strCommand, [strCourseID], (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json({
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
app.post('/courses/groups', authenticateUser, verifyInstructor, (req, res, next) => {
    const strGroupID = uuidv4()
    const strCourseID = req.body.courseID
    const strGroupName = req.body.groupName
    const strJoinCode = Math.random().toString(36).substring(2, 8).toUpperCase()

    if (!strCourseID || !strGroupName) {
        return res.status(400).json({ error: "You must provide a course id and group name" })
    }

    let strCommand = "INSERT INTO tblCourseGroups VALUES (?, ?, ?, ?)"
    let arrParameters = [strGroupID, strGroupName, strCourseID, strJoinCode]
    db.run(strCommand, arrParameters, (err) => {
        if (err) {
            console.log(err)
            res.status(500).json({
                status: "error",
                message: err.message
            })
        } else {
            res.status(201).json({ status: "success", joinCode: strJoinCode })
        }
    })
})


// get all users in a group
app.get('/courses/groups/users/:groupID', verifySession, (req, res, next) => {
    const strGroupID = req.params.groupID

    let strCommand = "SELECT * FROM tblGroupMembers WHERE GroupID = ?"
    db.all(strCommand, [strGroupID], (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json({
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

// add current user to a group
app.post('/courses/groups/users', authenticateUser, (req, res, next) => {
    const strGroupMemberID = uuidv4()
    const strJoinCode = req.body.joinCode?.trim().toUpperCase()
    const strUserID = req.userID

    if (!strJoinCode) {
        return res.status(400).json({ error: "You must provide a join code" })
    }

    const strFindGroupCommand = "SELECT GroupID FROM tblCourseGroups WHERE JoinCode = ?"
    db.all(strFindGroupCommand, [strJoinCode], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({
                status: "error",
                message: err.message
            })
        }

        if (result.length === 0) {
            return res.status(404).json({ error: "Invalid join code" })
        }

        const strGroupID = result[0].GroupID

        // check if user already in group
        let strCheckCommand = "SELECT * FROM tblGroupMembers WHERE GroupID = ? AND UserID = ?"
        db.all(strCheckCommand, [strGroupID, strUserID], (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    status: "error",
                    message: err.message
                })
            }
    
            if (result.length > 0) {
                return res.status(400).json({
                    status: "error",
                    message: "User is already a member of this group"
                })
            }
    
            let strCommand = "INSERT INTO tblGroupMembers VALUES (?, ?, ?)"
            let arrParameters = [strGroupMemberID, strGroupID, strUserID]
            db.run(strCommand, arrParameters, (err) => {
                if (err) {
                    console.log(err)
                    res.status(500).json({
                        status: "error",
                        message: err.message
                    })
                } else {
                    res.status(201).json({ status: "success" })
                }
            })
        })
    })
})

// delete currest user from group
app.delete('/courses/groups/users', authenticateUser, (req, res, next) => {
    const strGroupID = req.body.groupID
    const strUserID = req.userID

    if (!strGroupID) {
        return res.status(400).json({ error: "You must provide a group id" })
    }

    let strCommand = "DELETE FROM tblGroupMembers WHERE GroupID = ? AND UserID = ?"
    db.run(strCommand, [strGroupID, strUserID], (err) => {
        if (err) {
            console.log(err)
            res.status(500).json({
                status: "error",
                message: err.message
            })
        } else {
            res.status(200).json({ status: "success" })
        }
    })
})


// create a social
app.post('/socials', authenticateUser, (req, res, next) => {
    let strSocialID = uuidv4()
    let strSocialType = req.body.socialType
    let strUsername = req.body.username
    let strUserID = req.userID

    if (strSocialType.length < 1) {
        return res.status(400).json({ error: "You must provide a social type" })
    }
    if (strUsername.length < 1) {
        return res.status(400).json({ error: "You must provide a username" })
    }

    let strCommand = `INSERT INTO tblSocials VALUES (?, ?, ?, ?)`;
    db.run(strCommand, [strSocialID, strSocialType, strUsername, strUserID], function (err) {
        if(err){
            console.log(err)
            res.status(400).json({status:"error", message:err.message})
        } else {
            res.status(201).json({
                status:"success"
            })
        }
    })
})

// delete a social
app.delete('/socials', authenticateUser, (req, res, next) => {
    let strSocialID = req.body.socialID
    let strUserID = req.userID

    if (strSocialID.length < 1) {
        return res.status(400).json({ error: "You must provide a social id" })
    }

    let comDelete = `DELETE FROM tblSocials WHERE SocialID = ? AND UserID = ?`
    db.run(comDelete,[strSocialID,strUserID],function(err){
        if(err){
            console.log(err)
            res.status(400).json({status:"error",message:err.message})
        } else {
            res.status(201).json({status:"success",message:"Task Deleted"})
        }
    })
})

// update a social
app.put('/socials', authenticateUser, (req, res, next) => {
    let strSocialID = req.body.socialID
    let strUsername = req.body.username
    let strUserID = req.userID

    if (strSocialID.length < 1) {
        return res.status(400).json({ error: "You must provide a socialID" })
    }
    if (strUsername.length < 1) {
        return res.status(400).json({ error: "You must provide a username" })
    }
    let comUpdate = `UPDATE tblSocials SET Username = ? WHERE SocialID = ? AND UserID = ?`;
    db.run(comUpdate, [strUsername, strSocialID, strUserID], function (err) {
        if (err) {
            console.log(err);
            return res.status(500).json({ status: "error", message: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "TaskID not found" });
        }
    })
    res.status(200).json({ status: "success", message: "Task updated successfully" });
});

// get all socials for a user
app.get('/socials', authenticateUser, (req,res,next) => {
    let strUserID = req.userID

    let comSelect = "SELECT * FROM tblSocials WHERE UserID = ?"
    db.all(comSelect, [strUserID], function(err,result){
        if(err){
            console.log(err)
            res.status(400).json({status:"error",message:err.message})
        } else {
            res.status(200).json({status:"success",result:result})
        }
    })
})

app.get('/usersocials/:userID', authenticateUser, (req,res,next) => {
    let strUserID = req.params.userID

    let comSelect = "SELECT * FROM tblSocials WHERE UserID = ?"
    db.all(comSelect, [strUserID], function(err,result){
        if(err){
            console.log(err)
            res.status(400).json({status:"error",message:err.message})
        } else {
            res.status(200).json({status:"success",result:result})
        }
    })
})


// create a phone number
app.post('/phone', authenticateUser, (req, res, next) => {
    let strPhoneID = uuidv4()
    let strPhoneNumber = req.body.phoneNumber
    let strUserID = req.userID

    if (strPhoneNumber.length < 1) {
        return res.status(400).json({ error: "You must provide a phone number" })
    }

    let strCommand = `INSERT INTO tblPhone VALUES (?, ?, ?)`;
    db.run(strCommand, [strPhoneID, strPhoneNumber, strUserID], function (err) {
        if(err){
            console.log(err)
            res.status(400).json({status:"error", message:err.message})
        } else {
            res.status(201).json({
                status:"success"
            })
        }
    })
})

// delete a phone number
app.delete('/phone', authenticateUser, (req, res, next) => {
    let strPhoneID = req.body.phoneID
    let strUserID = req.userID

    if (strPhoneID.length < 1) {
        return res.status(400).json({ error: "You must provide a phoneID" })
    }
    let comDelete = `DELETE FROM tblPhone WHERE PhoneID = ? AND UserID = ?`
    db.run(comDelete,[strPhoneID, strUserID],function(err){
        if(err){
            console.log(err)
            res.status(400).json({status:"error",message:err.message})
        } else {
            res.status(201).json({status:"success",message:"Task Deleted"})
        }
    })
})

// update a phone number
app.put('/phone', authenticateUser, (req, res, next) => {
    let strPhoneID = req.body.phoneID
    let strPhoneNumber = req.body.phoneNumber
    let strUserID = req.userID

    if (strPhoneID.length < 1) {
        return res.status(400).json({ error: "You must provide a phoneID" })
    }
    if (strPhoneNumber.length < 1) {
        return res.status(400).json({ error: "You must provide a phone number" })
    }

    let comUpdate = `UPDATE tblPhone SET PhoneNumber = ? WHERE PhoneID = ? AND UserID = ?`;
    db.run(comUpdate, [strPhoneNumber, strPhoneID, strUserID], function (err) {
        if (err) {
            console.log(err);
            return res.status(500).json({ status: "error", message: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "TaskID not found" });
        }
        res.status(200).json({ status: "success", message: "Task updated successfully" });
    })
});

// get phone number for a user
app.get('/userphone/:userID', authenticateUser, (req,res,next) => {
    let strUserID = req.params.userID

    let comSelect = "SELECT * FROM tblPhone WHERE UserID = ?"
    db.all(comSelect, [strUserID], function(err,result){
        if(err){
            console.log(err)
            res.status(400).json({status:"error",message:err.message})
        } else {
            res.status(200).json({status:"success",result:result})
        }
    })
})

// get phone number for a user
app.get('/phone', authenticateUser, (req,res,next) => {
    let strUserID = req.userID

    let comSelect = "SELECT * FROM tblPhone WHERE UserID = ?"
    db.all(comSelect, [strUserID], function(err,result){
        if(err){
            console.log(err)
            res.status(400).json({status:"error",message:err.message})
        } else {
            res.status(200).json({status:"success",result:result})
        }
    })
})


// create a survey
app.post('/survey', authenticateUser, verifyInstructor, (req, res, next) => {
    let strSurveyID = uuidv4()
    let strCourseID = req.body.courseID
    let strTitle = req.body.title
    let strStartDate = req.body.startDate
    let strEndDate = req.body.endDate

    if (strCourseID.length < 1) {
        return res.status(400).json({ error: "You must provide a valid course"})
    }
    if (strTitle.length < 1) {
        return res.status(400).json({ error: "You must provide a survey title"})
    }
    if (strStartDate.length < 1) {
        return res.status(400).json({ error: "You must provide a start date"})
    }
    if (strEndDate.length < 1) {
        return res.status(400).json({ error: "You must provide an end date"})
    }

    let strCommand = `INSERT INTO tblSurvey VALUES (?, ?, ?, ?, ?)`;
    db.run(strCommand, [strSurveyID, strCourseID, strTitle, strStartDate, strEndDate], function (err) {
        if(err){
            console.log(err)
            res.status(400).json({status:"error", message:err.message})
        } else {
            res.status(201).json({
                status:"success"
            })
        }
    })
})

// delete a survey
app.delete('/survey', authenticateUser, verifyInstructor, (req, res, next) => {
    let strSurveyID = req.body.surveyID

    if (strSurveyID.length < 1) {
        return res.status(400).json({ error: "You must provide a surveyID" })
    }

    let comDelete = `DELETE FROM tblSurvey WHERE SurveyID = ? AND CourseID = ?`
    db.run(comDelete,[strSurveyID, strCourseID],function(err){
        if(err){
            console.log(err)
            res.status(400).json({status:"error",message:err.message})
        } else {
            res.status(201).json({status:"success",message:"Task Deleted"})
        }
    })
})

// update a survey
app.put('/survey', authenticateUser, verifyInstructor, (req, res, next) => {
    let strSurveyID = req.body.surveyID
    let strStartDate = req.body.startDate
    let strEndDate = req.body.endDate
    let strTitle = req.body.title
    let strUserID = req.userID

    if (strSurveyID.length < 1) {
        return res.status(400).json({ error: "You must provide a surveyID" })
    }

    let comUpdate = `UPDATE tblSurvey SET Title = ?, StartDate = ?, EndDate = ? WHERE SurveyID = ? AND CourseID = ?`;
    db.run(comUpdate, [strTitle, strStartDate, strEndDate, strSurveyID, strCourseID], function (err) {
        if (err) {
            console.log(err);
            return res.status(500).json({ status: "error", message: err.message });
        }
        if (this.changes === 0) {
            return res.status(304).json({ status: "not modified" });
        }
        res.status(200).json({ status: "success", message: "Task updated successfully" });
    })
});

// get all surveys for a class
app.get('/survey/:courseid', authenticateUser, verifyInstructorOrMember, (req,res,next) => {
    let strCourseID = req.params.courseid
    let strUserID = req.userID

    let comSelect = "SELECT * FROM tblSurvey WHERE CourseID = ?"
    db.all(comSelect, [strCourseID], function(err,result){
        if(err){
            console.log(err)
            res.status(400).json({status:"error",message:err.message})
        } else {
            res.status(200).json({status:"success",result:result})
        }
    })
})


// create a survey question
app.post('/surveyquestion', authenticateUser, verifyInstructor, (req, res, next) => {
    let strQuestionID = uuidv4()
    let strSurveyID = req.body.surveyID
    let strQuestion = req.body.question
    let arrOptions = req.body.options
    let strQuestionType = req.body.questionType
    let strUserID = req.userID

    if (strQuestion.length < 1) {
        return res.status(400).json({ error: "You must provide a survey question"})
    }
    if (arrOptions.length < 1) {
        return res.status(400).json({ error: "You must provide survey options"})
    }
    if (strQuestionType.length < 1) {
        return res.status(400).json({ error: "You must provide a question type"})
    }

    let strCommand = `INSERT INTO tblSurveyQuestion VALUES (?, ?, ?, ?, ?)`;
    db.run(strCommand, [strQuestionID, strSurveyID, strQuestion, arrOptions, strQuestionType], function (err) {
        if(err){
            console.log(err)
            res.status(400).json({status:"error", message:err.message})
        } else {
            res.status(201).json({
                status:"success"
            })
        }
    })
})

// delete a survey question
app.delete('/surveyquestion', authenticateUser, verifyInstructor, (req, res, next) => {
    let strQuestionID = req.body.questionID
    let strSurveyID = req.body.surveyID

    if (strQuestionID.length < 1) {
        return res.status(400).json({ error: "You must provide a questionID" })
    }
    let comDelete = `DELETE FROM tblSurveyQuestion WHERE QuestionID = ? AND SurveyID = ?`
    db.run(comDelete,[strQuestionID, strSurveyID],function(err,result){
        if(err){
            console.log(err)
            res.status(400).json({status:"error",message:err.message})
        } else {
            res.status(201).json({status:"success",message:"Task Deleted"})
        }
    })
})

// get all survey questions for a survey
app.get('/surveyquestion/:surveyid', authenticateUser, verifyInstructorOrMember, (req,res,next) => {
    let strSurveyID = req.params.surveyid

    let comSelect = "SELECT * FROM tblSurveyQuestion WHERE SurveyID = ?"
    db.all(comSelect, [strSurveyID], function(err,result){
        if(err){
            console.log(err)
            res.status(400).json({status:"error",message:err.message})
        } else {
            res.status(200).json({status:"success",result:result})
        }
    })
})


// create a survey response
app.post('/surveyresponse', authenticateUser, verifyMember, (req, res, next) => {
    const strResponseID = uuidv4()
    const strSurveyID = req.body.surveyID
    const strInstructorID = req.userID
    const strQuestionID = req.body.questionID
    const strResponse = req.body.response
    const strTargetUserID = req.body.targetUserID

    if (strSurveyID.length < 1) {
        return res.status(400).json({ error: "You must provide a surveyID"})
    }
    if (strQuestionID.length < 1) {
        return res.status(400).json({ error: "You must provide a questionID"})
    }
    if (strResponse.length < 1) {
        return res.status(400).json({ error: "You must provide a response"})
    }
    if (strTargetUserID.length < 1) {
        return res.status(400).json({ error: "You must provide a target userID"})
    }

    let strCommand = `INSERT INTO tblSurveyResponse VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(strCommand, [strResponseID, strSurveyID, strInstructorID, strQuestionID, strResponse, strTargetUserID], function (err) {
        if(err){
            console.log(err)
            res.status(400).json({status:"error", message:err.message})
        } else {
            res.status(201).json({
                status:"success"
            })
        }
    })
})

// delete a survey response
app.delete('/surveyresponse', verifySession, verifyInstructorOrMember, (req, res, next) => {
    let strResponseID = req.body.responseID
    let strSurveyID = req.body.surveyID

    if (strResponseID.length < 1) {
        return res.status(400).json({ error: "You must provide a responseID" })
    }
    let comDelete = `DELETE FROM tblSurveyResponse WHERE responseID = ?`
    db.run(comDelete,[strResponseID],function(err,result){
        if(err){
            console.log(err)
            res.status(400).json({status:"error",message:err.message})
        } else {
            res.status(201).json({status:"success",message:"Task Deleted"})
        }
    })
})

// update a survey response
app.put('/surveyresponse', verifySession, verifyInstructorOrMember, (req, res, next) => {
    let strResponseID = req.body.responseID
    let strResponse = req.body.response
    let strStatus = req.body.status
    let strSurveyID = req.body.surveyID

    if (strResponseID.length < 1) {
        return res.status(400).json({ error: "You must provide a responseID" })
    }

    let comUpdate = `UPDATE tblSurveyResponse SET Response = ?, Status = ? WHERE ResponseID = ?`;
    db.run(comUpdate, [strResponse, strResponseID], function (err) {
        if (err) {
            console.log(err);
            return res.status(500).json({ status: "error", message: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "TaskID not found" });
        }
        res.status(200).json({ status: "success", message: "Task updated successfully" });
    })
});

// get all survey responses for a survey
app.get('/surveyresponse/instructor/:surveyid', authenticateUser, verifyInstructor, (req,res,next) => {
    let strSurveyID = req.params.surveyid

    let comSelect = "SELECT * FROM tblSurveyResponse WHERE SurveyID = ?"
    db.all(comSelect, [strSurveyID], function(err,result){
        if(err){
            console.log(err)
            res.status(400).json({status:"error",message:err.message})
        } else {
            res.status(200).json({status:"success",result:result})
        }
    })
})

// get survey responses for target
app.get('/surveyresponse/target/:surveyID', authenticateUser, verifyMember, (req,res,next) => {
    let strSurveyID = req.params.surveyID
    let strUserID = req.userID

    let comSelect = "SELECT * FROM tblSurveyResponse WHERE SurveyID = ? AND TargetUserID = ?"
    db.all(comSelect, [strSurveyID, strUserID], function(err,result){
        if(err){
            console.log(err)
            res.status(400).json({status:"error",message:err.message})
        } else {
            res.status(200).json({status:"success",result:result})
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
function verifySession(req, res, next) {
    const strSessionID = req.cookies.sessionID

    if (!strSessionID) {
        return res.status(401).json({ error: "Unauthorized: No session ID provided" })
    }

    let strCommand = "SELECT * FROM tblSessions WHERE SessionID = ? AND Status = 'Active'"
    db.all(strCommand, [strSessionID], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: "Internal server error" });
        }

        if (result.length == 0) {
            return res.status(401).json({ error: "Unauthorized: Invalid session" });
        }

        next()
    })
}

// middleware to get user id from a valid session id
function authenticateUser(req, res, next) {
    verifySession(req, res, (err) => {
        if (err) {
            return
        }

        // get user id from the session
        const strSessionID = req.cookies.sessionID
        const strCommand = "SELECT UserID FROM tblSessions WHERE SessionID = ?"
        db.all(strCommand, [strSessionID], (err, result) => {
            if (err) {
                console.error(err)
                return res.status(500).json({ error: "Unauthorized: Invalid session" })
            }
    
            if (result.length === 0) {
                return res.status(401).json({ error: "Unauthorized: Invalid session" })
            }
    
            req.userID = result[0].UserID // Attach UserID to the request object
            next()
        })
    })
}

// verify user is instructor for a course
function verifyInstructor(req, res, next) {
    const strUserID = req.userID
    const strSurveyID = req.body?.surveyID ?? req.params?.surveyid ?? null
    let strCourseID = req.body?.courseID ?? req.params?.courseid ?? null

    if (!strSurveyID && !strCourseID) {
        return res.status(400).json({ error: "You must provide a surveyID or courseID" })
    }

    if (strSurveyID) {
        // get courseID from surveyID
        const strGetCourseCommand = "SELECT CourseID FROM tblSurvey WHERE SurveyID = ?"
        db.all(strGetCourseCommand, [strSurveyID], (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json({ status: "error", message: err.message })
            }
            if (result.length === 0) {
                return res.status(404).json({ error: "Survey not found" })
            }

            strCourseID = result[0].CourseID
            checkInstructor(strUserID, strCourseID, res, next)
        })
    } else {
        // check instructor with courseID
        checkInstructor(strUserID, strCourseID, res, next)
    }
}

function checkInstructor(strUserID, strCourseID, res, next) {
    const strCheckCommand = "SELECT * FROM tblCourses WHERE CourseID = ? AND InstructorID = ?"
    db.all(strCheckCommand, [strCourseID, strUserID], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ status: "error", message: err.message })
        }
        if (result.length === 0) {
            return res.status(401).json({ error: "You are not the instructor for this course" })
        }
        next()
    })
}

// verify user is a member of a group
function verifyMember(req, res, next) {
    const strUserID = req.userID
    const strSurveyID = req.body?.surveyID ?? req.params?.surveyid ?? null
    let strCourseID = req.body?.courseID ?? req.params?.courseid ?? null

    if (!strSurveyID && !strCourseID) {
        return res.status(400).json({ error: "You must provide a surveyID or courseID" })
    }

    if (strSurveyID) {
        // get courseID from surveyID
        const strGetCourseCommand = "SELECT CourseID FROM tblSurvey WHERE SurveyID = ?"
        db.all(strGetCourseCommand, [strSurveyID], (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json({ status: "error", message: err.message })
            }
            if (result.length === 0) {
                return res.status(404).json({ error: "Survey not found" })
            }

            strCourseID = row.CourseID
            checkMember(strUserID, strCourseID, res, next)
        })
    } else {
        // check member with courseID
        checkMember(strUserID, strCourseID, res, next)
    }
}

function checkMember(strUserID, strCourseID, res, next) {
    const strCheckCommand = `
        SELECT * FROM tblGroupMembers gm
        JOIN tblCourseGroups cg ON gm.GroupID = cg.GroupID
        WHERE cg.CourseID = ? AND gm.UserID = ?
    `
    db.all(strCheckCommand, [strCourseID, strUserID], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ status: "error", message: err.message })
        }
        if (result.length === 0) {
            return res.status(401).json({ error: "You are not a member of this course" })
        }
        next()
    })
}

// verify user is either instructor or member
function verifyInstructorOrMember(req, res, next) {
    const strUserID = req.userID
    const strSurveyID = req.body?.surveyID ?? req.params?.surveyid ?? null
    let strCourseID = req.body?.courseID ?? req.params?.courseid ?? null

    if (!strSurveyID && !strCourseID) {
        return res.status(400).json({ error: "You must provide a surveyID or courseID" })
    }

    if (strSurveyID) {
        // get courseID from surveyID
        const strGetCourseCommand = "SELECT CourseID FROM tblSurvey WHERE SurveyID = ?"
        db.all(strGetCourseCommand, [strSurveyID], (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json({ status: "error", message: err.message })
            }
            if (result.length === 0) {
                return res.status(404).json({ error: "Survey not found" })
            }

            strCourseID = result[0].CourseID;
            checkInstructorOrMember(strUserID, strCourseID, res, next)
        })
    } else {
        // check instructor or member with courseID
        checkInstructorOrMember(strUserID, strCourseID, res, next)
    }
}

function checkInstructorOrMember(strUserID, strCourseID, res, next) {
    const strCheckInstructor = "SELECT * FROM tblCourses WHERE CourseID = ? AND InstructorID = ?"
    db.all(strCheckInstructor, [strCourseID, strUserID], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ status: "error", message: err.message })
        }
        if (result.length > 0) {
            // user is instructor
            return next()
        }

        // check if the user is a member
        const strCheckMember = `
            SELECT * FROM tblGroupMembers gm
            JOIN tblCourseGroups cg ON gm.GroupID = cg.GroupID
            WHERE cg.CourseID = ? AND gm.UserID = ?
        `
        db.all(strCheckMember, [strCourseID, strUserID], (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json({ status: "error", message: err.message })
            }
            if (result.length === 0) {
                return res.status(401).json({ error: "You are not authorized to access this resource" })
            }
            next()
        })
    })
}