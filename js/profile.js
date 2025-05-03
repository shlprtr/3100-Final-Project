import { navigate } from '../services/pageRouter.js'
import { ApiService } from '../services/apiService.js'

{/* <button class="btn btn-primary me-2" id="btnLogOut">Log Out</button>
<button class="btn btn-outline-primary justify-content-end me-2" id="btnEdit">Edit</button>
<button class="btn btn-outline-primary me-2 d-none" id="btnSaveEdit">Save</button> */}

var objResponse
var objResponseUser
var objResponsePhone
var discordID = ''
var gitHubID = ''
var teamsID = ''
var phoneID = ''

objResponseUser = await ApiService.viewuser()

objResponse = await ApiService.viewsocials()

objResponsePhone = await ApiService.viewphone()

for (let i = 0; i < objResponse.data.result.length; i++) {
    let strSocialID = objResponse.data.result[i].Username
    let strSocialType = objResponse.data.result[i].SocialType

    if(strSocialType === 'Discord') {
        discordID = strSocialID
    }
    if(strSocialType === 'GitHub') {
        gitHubID = strSocialID
    }
    if(strSocialType === 'Teams') {
        teamsID = strSocialID
    }
}

if (objResponsePhone.data.result.length > 0) {
    phoneID = objResponsePhone.data.result[0].PhoneNumber
}

document.getElementById('txtCurrFirstName').value = objResponseUser.data.firstName
document.getElementById('txtCurrLastName').value = objResponseUser.data.lastName
document.getElementById('txtCurrPhoneNum').value = phoneID
document.getElementById('txtCurrEmail').value = objResponseUser.data.email
document.getElementById('txtCurrDiscord').value = discordID
document.getElementById('txtCurrGitHub').value = gitHubID
document.getElementById('txtCurrTeams').value = teamsID

document.querySelector('#btnLogOut').addEventListener('click', async (event) => {
    const objResponse = await ApiService.logout()
    console.log(objResponse)
    if (objResponse.success) {
        navigate('')
    } else {
        console.error('Error logging out:', objResponse.error)
    }
})

document.querySelector('#btnEdit').addEventListener('click', async () => {
    document.querySelector('#editAccount').classList.add('d-none')
    document.querySelector('#viewAccount').classList.add('d-none')

    document.querySelector('#editAccount').classList.remove('d-none')

    document.getElementById('txtFirstName').placeholder = objResponseUser.data.firstName
    document.getElementById('txtLastName').placeholder = objResponseUser.data.lastName
    document.getElementById('txtPhoneNum').placeholder = phoneID
    document.getElementById('txtEmail').placeholder = objResponseUser.data.email
    document.getElementById('txtDiscord').placeholder = discordID
    document.getElementById('txtGitHub').placeholder = gitHubID
    document.getElementById('txtTeams').placeholder = teamsID
})

document.querySelector('#btnSaveEdit').addEventListener('click', async () => {
    document.querySelector('#editAccount').classList.add('d-none')
    document.querySelector('#viewAccount').classList.remove('d-none')

    const strFirstName = document.querySelector('#txtFirstName').value
    const strLastName = document.querySelector('#txtLastName').value
    const strPhoneNumber = document.querySelector('#txtPhoneNum').value
    const strEmail = document.querySelector('#txtEmail').value
    const strDiscord = document.querySelector('#txtDiscord').value
    const strGitHub = document.querySelector('#txtGitHub').value
    const strTeams = document.querySelector('#txtTeams').value

    const socialsdata = objResponse.data
    const socials = socialsdata.result
    const userdata = objResponseUser.data
    const phonedata = objResponsePhone.data
    const phone = phonedata.result

    let tempFirstName = userdata.firstName
    let tempLastName = userdata.lastName
    let tempEmail = userdata.email

    if (strFirstName.length != 0) {
        tempFirstName = strFirstName
    }
    if (strLastName.length != 0) {
        tempLastName = strLastName
    }
    if (strEmail.length != 0) {
        tempEmail = strEmail
    }

    objResponse = await ApiService.updateuser(tempFirstName, tempLastName, tempEmail)

    if (strPhoneNumber.length > 0) {
        if (phone.length === 0) {
            objResponse = await ApiService.addphone(strPhoneNumber)
        }
        else {
            let strPhoneID = phone[0].PhoneID
            objResponse = await ApiService.updatephone(strPhoneID, strPhoneNumber)
        }
    }

    for (let i = 0; i < socials.length; i++) {
        let strSocialID = socials[i].SocialID
        let strSocialType = socials[i].SocialType

        if(strSocialType === 'Discord') {
            discordID = strSocialID
        }
        if(strSocialType === 'GitHub') {
            gitHubID = strSocialID
        }
        if(strSocialType === 'Teams') {
            teamsID = strSocialID
        }
    }
    
    if(strDiscord) {
        if(discordID.length != '') {
            objResponse = await ApiService.updatesocial(discordID, strDiscord)
        }
        else {
            objResponse = await ApiService.addsocial('Discord', strDiscord)
        }
    }
    if(strGitHub) {
        if(gitHubID.length != '') {
            objResponse = await ApiService.updatesocial(gitHubID, strGitHub)
        }
        else {
            objResponse = await ApiService.addsocial('GitHub', strGitHub)
        }
    }
    if(strTeams) {
        if(teamsID.length != '') {
            objResponse = await ApiService.updatesocial(teamsID, strTeams)
        }
        else {
            objResponse = await ApiService.addsocial('Teams', strTeams)
        }
    }



    //Github, Discord, Teams

})

function getCurrentInfo(selected) {
    document.querySelector(`#btn${selected}`).classList.remove('unselected')
    document.querySelector(`#view${selected}`).classList.remove('d-none')


}
