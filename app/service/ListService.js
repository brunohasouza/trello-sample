class ListService {
    constructor(boardId) {
        this._baseURL = 'https://tads-trello.herokuapp.com/api/trello/lists'
        this._boardId = boardId
        this._token = window.localStorage.getItem('token')
    }

    cadastrarUmList = (name) => new Promise((resolve, reject) => {
        const url = `${this._baseURL}/new`
        const data = {
            name,
            token: this._token,
            board_id: this._boardId
        }

        FactoryXHR.request(
            url,
            'POST',
            data,
            r => resolve(r),
            e => reject(e)
        )
    })
        
    listarListDeUmBoard = () => new Promise((resolve, reject) => {
        const url = `${this._baseURL}/${this._token}/board/${this._boardId}`
        
        FactoryXHR.request(
            url,
            'GET',
            null,
            r => resolve(r),
            e => reject(e)
        )
    })

    recuperarList = (listId) => new Promise((resolve, reject) => {
        const url = `${this._baseURL}/${this._token}/${listId}`

        FactoryXHR.request(
            url,
            'GET',
            null,
            r => resolve(r),
            e => reject(e)
        )
    })

    renomearList = (listId, name) => new Promise((resolve, reject) => {
        const url =  `${this._baseURL}/rename`
        const data = {
            list_id: listId,
            name,
            token: this._token
        }

        FactoryXHR.request(
            url,
            'PATCH',
            data,
            r => resolve(r),
            e => reject(e)
        )
    })

    excluirList = (listId) => new Promise((resolve, reject) => {
        const url = `${this._baseURL}/delete`
        const data = {
            list_id: listId,
            token: this._token
        }

        FactoryXHR.request(
            url,
            'DELETE',
            data,
            r => resolve(r),
            e => reject(e)
        )
    })

}