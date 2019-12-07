class BoardsService {
    constructor() {
        this._baseURL = 'https://tads-trello.herokuapp.com/api/trello/boards'
        this._token = window.localStorage.getItem('token')
    }
    
    cadastrarUmBoard = (data) => new Promise((resolve, reject) => {
        const url = `${this._baseURL}/new`
        data.token = this._token

        FactoryXHR.request(
            url, 
            'POST', 
            data, 
            r => resolve(r), 
            e => reject(e)
        )
    })

    listarBoardsDoUsuario = () => new Promise((resolve, reject) => {
        const url = `${this._baseURL}/${this._token}`

        FactoryXHR.request(
            url, 
            'GET', 
            null, 
            r => resolve(r), 
            e => reject(e)
        )
    })

    recuperarBoard = (boardId) => new Promise((resolve, reject) => {
        const url = `${this._baseURL}/${this._token}/${boardId}`

        FactoryXHR.request(
            url, 
            'GET', 
            null, 
            r => resolve(r), 
            e => reject(e)
        )
    })

    excluirBoard = (boardId) => new Promise((resolve, reject) => {
        const url = `${this._baseURL}/delete`
        const data = {
            token: this._token,
            board_id: boardId
        }
        
        FactoryXHR.request(
            url, 
            'DELETE', 
            data, 
            r => resolve(r), 
            e => reject(e)
        )
    })

    renomearBoard = (boardId, name) => new Promise((resolve, reject) => {
        const url = `${this._baseURL}/rename`
        const data = {
            token: this._token,
            board_id: boardId,
            name
        }

        FactoryXHR.request(
            url, 
            'PATCH', 
            data, 
            r => resolve(r), 
            e => reject(e)
        )
    })


    alterarCorBoard = (boardId, cor) => new Promise((resolve, reject) => {
        const url = `${this._baseURL}/newcolor`
        const data = {
            token: this._token,
            board_id: boardId,
            color: cor
        }

        FactoryXHR.request(
            url, 
            'PATCH', 
            data, 
            r => resolve(r), 
            e => reject(e)
        )
    })
}