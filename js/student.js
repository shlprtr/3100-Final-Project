// listener for clicking a group card
document.querySelector('#groupContainer').addEventListener('click', (event) => {
    const cardLink = event.target.closest('.stretched-link')
    if (cardLink) {
        const strGroupId = cardLink.getAttribute('data-group-id')
        console.log(strGroupId)
    }
})