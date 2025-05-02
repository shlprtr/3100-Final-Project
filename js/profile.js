import { navigate } from '../services/pageRouter.js'
import { ApiService } from '../services/apiService.js'

{/* <button class="btn btn-primary me-2" id="btnLogOut">Log Out</button>
<button class="btn btn-outline-primary justify-content-end me-2" id="btnEdit">Edit</button>
<button class="btn btn-outline-primary me-2 d-none" id="btnSaveEdit">Save</button> */}

var objResponse
var objResponseUser

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

    objResponse = await ApiService.viewsocials()
    console.log(objResponse)

    objResponseUser = await ApiService.viewuser()
    console.log(objResponseUser)
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

    var discordID = ''
    var gitHubID = ''
    var teamsID = ''

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
