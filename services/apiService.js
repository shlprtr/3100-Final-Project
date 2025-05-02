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
}