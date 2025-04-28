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


// create a new user
app.post('/user', (req, res, next) => {
    let strUserID = uuidv4()
    let strEmail = req.body.email.trim().toLowerCase()
    let strFirstName = req.body.firstName
    let strLastName = req.body.lastName
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
    const strInstructorID = req.body.instructorID

    if (strInstructorID, strCourseName, strCourseNumber, strSectionNumber, strSemesterTerm, strStartDate, strEndDate == null) {
        return res.status(400).json({ error: "You must provide an instructor, course title, course number, section number, semester term, start date, and end date" })
    }

    let strCommand = "INSERT INTO tblCourses (CourseID, CourseName, CourseNumber, SectionNumber, SemesterTerm, StartDate, EndDate, InstructorID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    let arrParameters = [strInstructorID, strCourseName, strCourseNumber, strSectionNumber, strSemesterTerm, strStartDate, strEndDate, strInstructorID]
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

// Add a social
app.post('/socials', (req, res, next) => {
    let strSocialID = uuidv4()
    let strSocialType = req.body.socialType
    let strUsername = req.body.username
    let strUserID = req.body.userID

    if (strSocialType.length < 1) {
        return res.status(400).json({ error: "You must provide a social type" })
    }
    if (strUsername.length < 1) {
        return res.status(400).json({ error: "You must provide a username" })
    }
    if (strUserID.length < 1) {
        return res.status(400).json({ error: "You must provide a user to add a social" })
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
app.delete('/socials', (req, res, next) => {
    let strSocialID = req.body.socialID

    if (strSocialID.length < 1) {
        return res.status(400).json({ error: "You must provide a socialID" })
    }
    let comDelete = `DELETE FROM tblSocials WHERE socialID = ?`
    db.run(comDelete,[strSocialID],function(err,result){
        if(err){
            console.log(err)
            res.status(400).json({status:"error",message:err.message})
        } else {
            res.status(201).json({status:"success",message:"Task Deleted"})
        }
    })
})

// Update a social
app.put('/socials', (req, res, next) => {
    let strSocialID = req.body.socialID
    let strUsername = req.body.username

    if (strSocialID.length < 1) {
        return res.status(400).json({ error: "You must provide a socialID" })
    }
    if (strUsername.length < 1) {
        return res.status(400).json({ error: "You must provide a username" })
    }
    let comUpdate = `UPDATE tblSocials SET username = ? WHERE socialID = ?`;
    db.run(comUpdate, [strUsername, strSocialID], function (err) {
        if (err) {
            console.log(err);
            return res.status(400).json({ status: "error", message: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "TaskID not found" });
        }
    })
    res.status(200).json({ status: "success", message: "Task updated successfully" });
});

//Return all socials for a user
app.get('/socials/:userID',(req,res,next) => {
    let strUserID = req.params.userID
    if(strUserID.length < 1){
        return res.status(400).json({error:"You must provide a userID"})
    }
    let comSelect = "SELECT * FROM tblSocials WHERE UserID = ?"
    db.all(comSelect, [strUserID], function(err,result){
        if(err){
            console.log(err)
            res.status(400).json({status:"error",message:err.message})
        } else {
            res.status(200).json({status:"success",items:result})
        }
    })
})



// Add a phone number
app.post('/phone', (req, res, next) => {
    let strPhoneID = uuidv4()
    let strNationCode = req.body.nationCode
    let strAreaCode = req.body.areaCode
    let strPhoneNumber = req.body.phoneNumber
    let strUserID = req.body.userID

    if (strNationCode.length < 1) {
        return res.status(400).json({ error: "You must provide a nation code" })
    }
    if (strAreaCode.length < 1) {
        return res.status(400).json({ error: "You must provide an area code" })
    }
    if (strPhoneNumber.length < 1) {
        return res.status(400).json({ error: "You must provide a phone number" })
    }
    if (strUserID.length < 1) {
        return res.status(400).json({ error: "You must provide a user to add a social" })
    }

    let strCommand = `INSERT INTO tblPhone VALUES (?, ?, ?, ?, ?)`;
    db.run(strCommand, [strPhoneID, strNationCode, strAreaCode, strPhoneNumber, strUserID], function (err) {
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
app.delete('/phone', (req, res, next) => {
    let strPhoneID = req.body.phoneID

    if (strPhoneID.length < 1) {
        return res.status(400).json({ error: "You must provide a phoneID" })
    }
    let comDelete = `DELETE FROM tblPhone WHERE phoneID = ?`
    db.run(comDelete,[strPhoneID],function(err,result){
        if(err){
            console.log(err)
            res.status(400).json({status:"error",message:err.message})
        } else {
            res.status(201).json({status:"success",message:"Task Deleted"})
        }
    })
})

// Update a phone number
app.put('/phone', (req, res, next) => {
    let strPhoneID = req.body.phoneID
    let strNationCode = req.body.nationCode
    let strAreaCode = req.body.areaCode
    let strPhoneNumber = req.body.phoneNumber

    if (strPhoneID.length < 1) {
        return res.status(400).json({ error: "You must provide a phoneID" })
    }
    if (strNationCode.length < 1) {
        return res.status(400).json({ error: "You must provide a nation code" })
    }
    if (strAreaCode.length < 1) {
        return res.status(400).json({ error: "You must provide an area code" })
    }
    if (strPhoneNumber.length < 1) {
        return res.status(400).json({ error: "You must provide a phone number" })
    }

    let comUpdate = `UPDATE tblPhone SET NationCode = ?, AreaCode = ?, PhoneNumber = ? WHERE PhoneID = ?`;
    db.run(comUpdate, [strNationCode, strAreaCode, strPhoneNumber, strPhoneID], function (err) {
        if (err) {
            console.log(err);
            return res.status(400).json({ status: "error", message: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "TaskID not found" });
        }
        res.status(200).json({ status: "success", message: "Task updated successfully" });
    })
});

//Return all phone numbers for a user
app.get('/phone/:userID',(req,res,next) => {
    let strUserID = req.params.userID
    if(strUserID.length < 1){
        return res.status(400).json({error:"You must provide a userID"})
    }
    let comSelect = "SELECT * FROM tblPhone WHERE UserID = ?"
    db.all(comSelect, [strUserID], function(err,result){
        if(err){
            console.log(err)
            res.status(400).json({status:"error",message:err.message})
        } else {
            res.status(200).json({status:"success",items:result})
        }
    })
})

app.get('/', (req, res, next) => {
    res.status(200).json({ message: "I am alive" })
})

app.listen(HTTP_PORT, () => {
    console.log("App listening on", HTTP_PORT)
})