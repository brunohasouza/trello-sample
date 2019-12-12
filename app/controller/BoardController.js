class BoardController {
    constructor(boardId, viewContainer, newListForm, renameListForm, newCardForm, cardCommentForm) {
        this._boardId = boardId

        this._view = new BoardView(viewContainer)

        this._listService = new ListService(boardId)
        this._cardService = new CardService()
        this._boardsService = new BoardsService()

        this._newListForm = document.querySelector(newListForm)
        this._renameListForm = document.querySelector(renameListForm)
        this._newCardForm = document.querySelector(newCardForm)
        this._commentForm = document.querySelector(cardCommentForm)

        this._username = ''

        this._selectedList = null
        this._selectedListName = null

        this._selectedCard = null
        this._selectedCardName = null
    }

    init() {
        this.retrieveUserData()

        this._newListForm.addEventListener('submit', this.submitNewListForm)
        this._renameListForm.addEventListener('submit', this.submitRenameListForm)
        this._newCardForm.addEventListener('submit', this.submitNewCardForm)
        this._commentForm.addEventListener('submit', this.submitCommentForm)

        document.querySelector('#btnConfirmDelete').addEventListener('click', this.submitRemoveList)

        document.querySelector('#logoutClick').addEventListener('click', (ev) => {
            window.localStorage.removeItem('token')
            window.location.href = './index.html'
        })

        this._boardsService.recuperarBoard(this._boardId)
            .then(resolve => {
                this._view.setBoardColor(resolve[0].color)
                this._view.setBoardTitle(resolve[0].name)
            })
            .catch(e => {
                console.error(e)
            })
            
        this._listService.listarListDeUmBoard()
            .then(response => {
                this._view.updateLists(response)
                this.cardsByLists(response)
            })
            .catch(e => {
                console.error(e)
            })
    }

    retrieveUserData = () => {
        this._login = new LoginService()
        this._login.recuperarUsuarioPeloToken()
            .then(response => {
                this._username = response.name
                LoginView.updateUsername(response.name)
            })
            .catch(e => {
                console.error(e)
                this._view.showAlert('danger', 'Erro ao recuperar dados dos usuário')
            })
    }

    cardsByLists = (lists) => {
        const promiseAll = lists.map(list => this._cardService.listaCardsDeUmList(list.id))

        Promise.all(promiseAll)
            .then(response => {
                response.forEach((cards, index) => {
                    this._view.updateCards(lists[index].id, cards)
                })
            })
            .catch(e => {
                console.error(e)
            })
    }

    submitCommentForm = (ev) => {
        ev.preventDefault()

        const commentInput = this._commentForm.querySelector('#cardInfo_comment')
        const comment = commentInput.value.trim()

        if (!comment) {
            this._view.showAlert('danger', 'Todos os campos são obrigatórios')
            return
        }

        this._cardService.adicionarComentarioAoCard(this._selectedCard, comment)
            .then(response => {
                this._view.showAlert('success', 'Comentário adicionado com sucesso!')
                commentInput.value = ''

                return this._cardService.listaCommentsCard(this._selectedCard)
            })
            .then(response => {
                this._view.updateComments(response, this._username)
            })
            .catch(e => {
                console.error(e)
                this._view.showAlert('danger', 'Erro ao submeter comentário')
            })
    }

    submitNewCardForm = (ev) => {
        ev.preventDefault()

        const nameInput = this._newCardForm.querySelector('#cardNew_name')
        const name = nameInput.value.trim()
        const date = new Date().toLocaleString()

        if (!this._selectedList) {
            return
        }

        if (!name) {
            this._view.showAlert('danger', 'Todos os campos são obrigatórios')
            return
        }

        this._cardService.cadastrarCard(name, date, this._selectedList)
            .then(response => {
                this._view.showAlert('success', 'Card criado com sucesso!')
                return this._cardService.listaCardsDeUmList(this._selectedList)
            })
            .then(response => {
                this._view.updateCards(this._selectedList, response)
                this._selectedList = null
                $('#modalNewCard').modal('hide')
                nameInput.value = ''                
            })
            .catch(e => {
                console.error(e)
                this._view.showAlert('danger', 'Erro ao criar card')
            })


    }

    submitRenameListForm = (ev) => {
        ev.preventDefault()

        const nameInput = this._renameListForm.querySelector('#listRename_name')
        const name = nameInput.value.trim()

        if (!name) {
            this._view.showAlert('danger', 'Todos os campos são obrigatórios')
            return
        }

        if (name === this._selectedListName) {
            this._view.showAlert('danger', 'Você não alterou o nome da lista')
            return
        }

        this._listService.renomearList(this._selectedList, name)
            .then(response => {
                this._selectedList = null
                this._selectedListName = null

                this._view.showAlert('success', 'Lista renomeada com sucesso!')
                $('#modalListName').modal('hide')

                nameInput.value = ''

                return this._listService.listarListDeUmBoard()
            })
            .then(response => {
                this._view.updateLists(response)
            })
            .catch(e => {
                console.error(e)
                this._view.showAlert('danger', 'Erro ao renomar lista')
            })
    }

    submitRemoveList = (ev) => {
        ev.preventDefault()

        if (!this._selectedList) {
            return
        }

        this._listService.excluirList(this._selectedList)
            .then(() => {
                this._selectedList = null

                this._view.showAlert('success', 'Lista excluída com sucesso!')
                $('#modalListDelete').modal('hide')

                return this._listService.listarListDeUmBoard()
            })
            .then(response => {
                this._view.updateLists(response)
            })
            .catch(e => {
                console.error(e)
                this._view.showAlert('danger', 'Erro ao tentar excluir lista')
            })
    }

    submitNewListForm = (ev) => {
        ev.preventDefault()

        const nameInput = this._newListForm.querySelector('#listNew_name')
        const name = nameInput.value.trim()

        if (!name) {
            this._view.showAlert('danger', 'Todos os campos são obrigatórios')
            return
        }

        this._listService.cadastrarUmList(name)
            .then(response => {
                $('#modalNewList').modal('hide')
                this._view.showAlert('success', 'Lista criada com sucesso!')
                nameInput.value = ''
                return this._listService.listarListDeUmBoard()
            })
            .then(response => {
                this._view.updateLists(response)
            })
            .catch(e => {
                console.error(e)
                this._view.showAlert('danger', 'Erro ao criar nova lista')
            })
    }

    openModalCard = (listId, listName, cardId, cardName) => {
        this._view.updateModalCardInfos(listName, cardName)

        this._selectedCard = cardId
        this._selectedCardName = cardName
        this._selectedList = listId
        this._selectedListName = listName

        this._cardService.listaCommentsCard(cardId)
            .then(response => {
                this._view.updateComments(response, this._username)
            })

        $('#modalCardInfo').modal('show')
    }

    openModalNewCard = (id) => {
        this._selectedList = id

        $('#modalNewCard').modal('show')
    }
    
    openModalRenameList = (id, name) => {
        this._selectedList = id
        this._selectedListName = name

        const input = this._renameListForm.querySelector('#listRename_name')
        input.value = name

        $('#modalListName').modal('show')
    }

    openModalDeleteList = (id) => {
        this._selectedList = id

        $('#modalListDelete').modal('show')
    }
}