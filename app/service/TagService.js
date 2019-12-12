class TagService {
    constructor() {
        this._baseURL = 'https://tads-trello.herokuapp.com/api/trello/tags'
    }

    listarTags = () => new Promise((resolve, reject) => {
        FactoryXHR.request(
            this._baseURL,
            'GET',
            null,
            r => resolve(r),
            e => reject(e)
        )
    })
}