class CardService {
    constructor() {
        this._baseURL = 'https://tads-trello.herokuapp.com/api/trello/cards'
        this._token = window.localStorage.getItem('token')
    }

    cadastrarCard = (name, date, listId) => new Promise((resolve, reject) => {
        const url = `${this._baseURL}/new`
        const data = {
            name,
            data: date,
            list_id: listId,
            token: this._token
        }

        FactoryXHR.request(
            url,
            'POST',
            data,
            r => resolve(r),
            e => reject(e)
        )
    })

    recuperarUmCard = (cardId) => new Promise((resolve, reject) => {
        const url = `${this._baseURL}/${this._token}/${cardId}`

        FactoryXHR.request(
            url,
            'GET',
            null,
            r => resolve(r),
            e => reject(e)
        )
    })

    listaCardsDeUmList = (listId) => new Promise((resolve, reject) => {
        const url = `${this._baseURL}/${this._token}/list/${listId}`

        FactoryXHR.request(
            url,
            'GET',
            null,
            r => resolve(r),
            e => reject(e)
        )
    })

    renomearCard = (cardId, name) => new Promise((resolve, reject) => {
        const url = `${this._baseURL}/rename`
        const data = {
            name,
            card_id: cardId,
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

    alterarDataCard = (cardId, date) => new Promise((resolve, reject) => {
        const url = `${this._baseURL}/newdata`
        const data = {
            data: date,
            card_id: cardId,
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

    alterarCardDeList = (cardId, listId) => new Promise((resolve, reject) => {
        const url = `${this._baseURL}/changelist`
        const data = {
            card_id: cardId,
            list_id: listId,
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

    excluirCard = (cardId) => new Promise((resolve, reject) => {
        const url = `${this._baseURL}/delete`
        const data = {
            card_id: cardId,
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

    adicionarTagAoCard = (tagId, cardId) => new Promise((resolve, reject) => {
        const url = `${this._baseURL}/addtag`
        const data = {
            tag_id: tagId,
            card_id: cardId,
            token: this._token
        }

        FactoryXHR.request(
            url,
            'POST',
            data,
            r => resolve(r),
            e => reject(e)
        )
    })

    adicionarComentarioAoCard = (cardId, comment) => new Promise((resolve, reject) => {
        const url = `${this._baseURL}/addcomment`
        const data = {
            card_id: cardId,
            comment,
            token: this._token
        }

        FactoryXHR.request(
            url,
            'POST',
            data,
            r => resolve(r),
            e => reject(e)
        )
    })

    listaCommentsCard = (cardId) => new Promise((resolve, reject) => {
        const url = `${this._baseURL}/${this._token}/${cardId}/comments`

        FactoryXHR.request(
            url,
            'GET',
            null,
            r => resolve(r),
            e => reject(e)
        )
    })

    listaTagsCard = (cardId) => new Promise((resolve, reject) => {
        const url = `${this._baseURL}/${this._token}/${cardId}/tags`

        FactoryXHR.request(
            url,
            'GET',
            null,
            r => resolve(r),
            e => reject(e)
        )
    })
}