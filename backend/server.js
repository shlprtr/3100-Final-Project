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
    db.run(strCommand, arrParameters, function(err, result) {
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


app.get('/', (req, res, next) => {
    res.status(200).json({ message: "I am alive" })
})

app.listen(HTTP_PORT, () => {
    console.log("App listening on", HTTP_PORT)
})