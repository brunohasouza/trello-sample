class LoginService {
    constructor() {
        this._baseURL = 'https://tads-trello.herokuapp.com/api/trello/users'
        this._token = window.localStorage.getItem('token')
    }

    login = (data) => new Promise((resolve, reject) => {
        const url = 'https://tads-trello.herokuapp.com/api/trello/login'

        FactoryXHR.request(
            url, 
            'POST', 
            data, 
            r =>  resolve(r), 
            e => reject(e)
        )
    })

    cadastrarUsuario = (data) => new Promise((resolve, reject) => {
        const url = `${this._baseURL}/new`

        FactoryXHR.request(
            url, 
            'POST', 
            data, 
            r =>  resolve(r), 
            e => reject(e)
        )
    })

    recuperarUsuarioPeloToken = () => new Promise((resolve, reject) => {
        const url = `${this._baseURL}/${this._token}`

        FactoryXHR.request(
            url, 
            'GET', 
            null, 
            r =>  resolve(r), 
            e => reject(e)
        )
    })
}