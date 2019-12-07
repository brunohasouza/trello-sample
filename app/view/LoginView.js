class LoginView {
    constructor(alertContainer) {
        this._container = document.querySelector(alertContainer)
    }

    showAlert = (message, variant) => {
        const time = 3000
        const classVariant = `alert-${variant}`
        const alert = document.querySelector('#trelloAlert')

        alert.innerHTML = message
        alert.classList.add(classVariant)
        alert.classList.add('show')

        setTimeout(() => {
            alert.classList.remove('show')
        }, time)

        setTimeout(() => {
            alert.innerHTML = ''
            alert.classList.remove(classVariant)
        }, time + 500)
    }

    static updateUsername = (name) => {
        document.querySelector('#userName').innerHTML = `Olá ${name}`
    }
}