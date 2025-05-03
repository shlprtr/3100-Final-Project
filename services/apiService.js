export class ApiService {
    static strBaseURL = 'http://127.0.0.1:8000'
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

    static async delete(strEndpoint, objCustomHeaders = {}) {
        return this.request(strEndpoint, 'DELETE', null, objCustomHeaders)
    }

    // methods for API endpoints
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

    static async addsocial(strSocialType, strUsername) {
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

    static async deletesocial(strSocialID) {
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

    static async updatesocial(strSocialID, strUsername) {
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

    static async viewsocials() {
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

    static async updateuser(strFirstName, strLastName, strEmail) {
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

    static async viewuser() {
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

    static async addphone(strPhoneNumber) {
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

    static async updatephone(strPhoneID, strPhoneNumber) {
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

    static async viewphone() {
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

    static async addcourse(strCourseName, strCourseNumber, strSectionNumber, strSemesterTerm, strStartDate, strEndDate) {
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

    static async viewcourses() {
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

    static async addcoursegroup(strGroupID, strGroupName) {
        const objBody = {
            groupID: strGroupID,
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

    static async viewcoursegroups() {
        try {
            const objResponse = await this.get('/courses/groups')
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

    static async addcoursegroup(strGroupID) {
        const objBody = {
            groupID: strGroupID
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

    static async viewgroupusers() {
        try {
            const objResponse = await this.get('/courses/groups/users')
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

    static async deleteuserfromgroup(strGroupID) {
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

    static async addsurvey(strCourseID, strTitle, strStartDate, strEndDate) {
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

    static async deletesurvey(strSurveyID) {
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

    static async updatesurvey(strSurveyID, strStartDate, strEndDate) {
        const objBody = {
            surveyID: strSurveyID,
            startDate: strStartDate,
            strEndDate: strEndDate
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

    static async viewsurveys() {
        try {
            const objResponse = await this.get('/survey')
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

    static async addsurveyquestion(strSurveyID, strQuestion, strOptions, strQuestionType) {
        const objBody = {
            surveyID: strSurveyID,
            question: strQuestion, 
            options: strOptions,
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

    static async deletesurveyquestion(strSurveyID) {
        const objBody = {
            questionID: strQuestionID
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

    static async viewsurveyquestion() {
        try {
            const objResponse = await this.get('/surveyquestion')
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

    static async addsurveyresponse(strSurveyID, strQuestionID, strResponse, strTargetUserID) {
        const objBody = {
            surveyID: strSurveyID,
            questionID: strQuestionID,
            response: strResponse,
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

    static async deletesurveyresponse(strResponseID) {
        const objBody = {
            responseID: strResponseID
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

    static async updatesurveyresponse(strResponseID, strResponse) {
        const objBody = {
            responseID: strResponseID,
            response: strResponse
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

    static async viewsurveyresponse() {
        try {
            const objResponse = await this.get('/surveyresponse')
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