export class ApiService {
    static strBaseURL = 'http://localhost:8000'
    static objDefaultHeaders = {
        'Content-Type': 'application/json',
    }

    constructor() {
        if (!this.strBaseURL) {
            throw new Error('Base URL not defined.');
        }
    }

    static async request(strEndpoint, strMethod = 'GET', objBody = null, objCustomHeaders = {}) {
        const objHeaders = { ...this.objDefaultHeaders, ...objCustomHeaders}
        const objOptions = {
            method: strMethod,
            credentials: 'include',
            headers: objHeaders
        }

        if (objBody) {
            objOptions.body = JSON.stringify(objBody)
        }

        try {
            const objResponse = await fetch(`${this.strBaseURL}${strEndpoint}`, objOptions)
            let objData
            const strText = await objResponse.text();

            // check if response is JSON or raw text
            try {
                objData = strText ? JSON.parse(strText) : {}
            } catch (err) {
                console.error('Failed to parse JSON:', err)
                objData = strText
            }

            return {
                success: objResponse.ok,
                status: objResponse.status,
                data: objData,
            }
        } catch (error) {
            console.error('API Request Failed:', error)
            throw error
        }
    }

    static async get(strEndpoint, objCustomHeaders = {}) {
        return this.request(strEndpoint, 'GET', null, objCustomHeaders)
    }

    static async post(strEndpoint, objBody = null, objCustomHeaders = {}) {
        return this.request(strEndpoint, 'POST', objBody, objCustomHeaders)
    }

    static async put(strEndpoint, objBody = null, objCustomHeaders = {}) {
        return this.request(strEndpoint, 'PUT', objBody, objCustomHeaders)
    }

    static async delete(strEndpoint, objBody = null, objCustomHeaders = {}) {
        return this.request(strEndpoint, 'DELETE', objBody, objCustomHeaders)
    }

    // methods for API endpoints
    
    static async register(strFirstName, strLastName, strEmail, strPassword) {
        const objBody = {
            firstName: strFirstName,
            lastName: strLastName,
            email: strEmail,
            password: strPassword
        }

        try {
            const objResponse = await this.post('/user', objBody)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            }
        }
    }

    static async updateUser(strFirstName, strLastName, strEmail) {
        const objBody = {
            firstName: strFirstName,
            lastName: strLastName,
            email: strEmail
        }
        
        try {
            const objResponse = await this.put('/user', objBody)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            }
        }
    }

    static async viewUser() {
        try {
            const objResponse = await this.get('/user')
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            } 
        }
    }

    static async viewUserInfo(strUserID) {
        try {
            const objResponse = await this.get(`/userinfo/${strUserID}`)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            } 
        }
    }

    static async checkSession() {
        try {
            const objResponse = await this.get('/sessions')
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            } 
        }
    }

    static async login(strEmail, strPassword) {
        const objBody = {
            email: strEmail,
            password: strPassword
        }

        try {
            const objResponse = await this.post('/sessions', objBody)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            }
        }
    }

    static async logout() {
        try {
            const objResponse = await this.put('/sessions')
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            } 
        }
    }

    static async addSocial(strSocialType, strUsername) {
        const objBody = {
            socialType: strSocialType,
            username: strUsername
        }

        try {
            const objResponse = await this.post('/socials', objBody)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            }
        }
    }

    static async deleteSocial(strSocialID) {
        const objBody = {
            socialID: strSocialID
        }

        try {
            const objResponse = await this.delete('/socials', objBody)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            }
        }
    }

    static async updateSocial(strSocialID, strUsername) {
        const objBody = {
            socialID: strSocialID,
            username: strUsername
        }

        try {
            const objResponse = await this.put('/socials', objBody)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            }
        }
    }

    static async viewSocials() {
        try {
            const objResponse = await this.get('/socials')
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            } 
        }
    }

    static async viewUserSocials(strUserID) {
        try {
            const objResponse = await this.get(`/usersocials/${strUserID}`)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            } 
        }
    }

    static async addPhone(strPhoneNumber) {
        const objBody = {
            phoneNumber: strPhoneNumber
        }

        try {
            const objResponse = await this.post('/phone', objBody)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            }
        }
    }

    static async updatePhone(strPhoneID, strPhoneNumber) {
        const objBody = {
            phoneID: strPhoneID,
            phoneNumber: strPhoneNumber
        }

        try {
            const objResponse = await this.put('/phone', objBody)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            }
        }
    }

    static async viewPhone() {
        try {
            const objResponse = await this.get('/phone')
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            } 
        }
    }

    static async viewUserPhoneInfo(strUserID) {
        try {
            const objResponse = await this.get(`/userphone/${strUserID}`)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            } 
        }
    }

    static async deletePhone(strPhoneID) {
        const objBody = {
            phoneID: strPhoneID
        }

        try {
            const objResponse = await this.delete('/phone', objBody)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            } 
        }
    }

    static async addCourse(strCourseName, strCourseNumber, strSectionNumber, strSemesterTerm, strStartDate, strEndDate) {
        const objBody = {
            courseName: strCourseName,
            courseNumber: strCourseNumber,
            sectionNumber: strSectionNumber,
            semesterTerm: strSemesterTerm,
            startDate: strStartDate,
            endDate: strEndDate
        }

        try {
            const objResponse = await this.post('/courses', objBody)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            }
        }
    }

    static async viewCourses() {
        try {
            const objResponse = await this.get('/courses')
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            } 
        }
    }

    static async viewCourseInfo(strCourseID) {
        const objBody = {
            courseID: strCourseID,
        }

        try {
            const objResponse = await this.get(`/courses/${strCourseID}`)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            } 
        }
    }

    static async addCourseGroup(strCourseID, strGroupName) {
        const objBody = {
            courseID: strCourseID,
            groupName: strGroupName
        }

        try {
            const objResponse = await this.post('/courses/groups', objBody)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            }
        }
    }

    static async viewCourseGroups(strCourseID) {
        try {
            const objResponse = await this.get(`/courses/groups/${strCourseID}`)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            } 
        }
    }

    static async viewUsersGroups() {
        try {
            const objResponse = await this.get('/courses/groups/user')
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            } 
        }
    }

    static async viewCourseUsers(strCourseID) {
        try {
            const objResponse = await this.get(`/courses/groups/users/course/${strCourseID}`)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            } 
        }
    }

    static async viewGroupUsers(strGroupID) {
        try {
            const objResponse = await this.get(`/courses/groups/users/group/${strGroupID}`)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            } 
        }
    }

    static async addUserToGroup(strJoinCode) {
        const objBody = {
            joinCode: strJoinCode
        }

        try {
            const objResponse = await this.post('/courses/groups/users', objBody)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            }
        }
    }

    static async deleteUserFromGroup(strGroupID) {
        const objBody = {
            groupID: strGroupID
        }

        try {
            const objResponse = await this.delete('/courses/groups/users', objBody)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            }
        }
    }

    static async addSurvey(strCourseID, strTitle, strStartDate, strEndDate) {
        const objBody = {
            courseID: strCourseID,
            title: strTitle,
            startDate: strStartDate,
            endDate: strEndDate
        }

        try {
            const objResponse = await this.post('/survey', objBody)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            }
        }
    }

    static async deleteSurvey(strSurveyID) {
        const objBody = {
            surveyID: strSurveyID
        }

        try {
            const objResponse = await this.delete('/survey', objBody)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            }
        }
    }

    static async updateSurvey(strSurveyID, strStartDate, strEndDate, strTitle) {
        const objBody = {
            surveyID: strSurveyID,
            startDate: strStartDate,
            endDate: strEndDate,
            title: strTitle
        }

        try {
            const objResponse = await this.put('/survey', objBody)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            }
        }
    }

    static async viewSurveys(strCourseID) {
        try {
            const objResponse = await this.get(`/survey/${strCourseID}`)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            } 
        }
    }

    static async viewPublicSurveys() {
        try {
            const objResponse = await this.get(`/surveys/public`)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            } 
        }
    }

    static async addSurveyQuestion(strSurveyID, strQuestion, arrOptions, strQuestionType) {
        const objBody = {
            surveyID: strSurveyID,
            question: strQuestion, 
            options: arrOptions,
            questionType: strQuestionType
        }

        try {
            const objResponse = await this.post('/surveyquestion', objBody)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            }
        }
    }

    static async deleteSurveyQuestion(strSurveyID, strQuestionID) {
        const objBody = {
            questionID: strQuestionID,
            surveyID: strSurveyID
        }

        try {
            const objResponse = await this.delete('/surveyquestion', objBody)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            }
        }
    }

    static async viewSurveyQuestion(strSurveyID) {
        try {
            const objResponse = await this.get(`/surveyquestion/${strSurveyID}`)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            } 
        }
    }

    static async addSurveyResponse(strSurveyID, strQuestionID, strResponse, strStatus, strTargetUserID) {
        const objBody = {
            surveyID: strSurveyID,
            questionID: strQuestionID,
            response: strResponse,
            status: strStatus,
            targetUserID: strTargetUserID
        }

        try {
            const objResponse = await this.post('/surveyresponse', objBody)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            }
        }
    }

    static async deleteSurveyResponse(strResponseID, strSurveyID) {
        const objBody = {
            responseID: strResponseID,
            surveyID: strSurveyID
        }

        try {
            const objResponse = await this.delete('/surveyresponse', objBody)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            }
        }
    }

    static async updateSurveyResponse(strResponseID, strResponse, strStatus, strSurveyID) {
        const objBody = {
            responseID: strResponseID,
            response: strResponse,
            status: strStatus,
            surveyID: strSurveyID
        }

        try {
            const objResponse = await this.put('/surveyresponse', objBody)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            }
        }
    }

    static async instructorViewResponses(strSurveyID) {
        try {
            const objResponse = await this.get(`/surveyresponse/instructor/${strSurveyID}`)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            } 
        }
    }

    static async targetViewResponses(strSurveyID) {
        try {
            const objResponse = await this.get(`/surveyresponse/target/${strSurveyID}`)
            return objResponse
        } catch (error) {
            console.error('Error:', error)
            return {
                success: false,
                status: 500,
                error: error.message
            } 
        }
    }
}