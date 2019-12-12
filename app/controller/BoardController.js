class BoardController {
    constructor(boardId, viewContainer, tagContainer, newListForm, renameListForm, newCardForm, cardCommentForm, renameCardForm, dateCardForm) {
        this._boardId = boardId

        this._view = new BoardView(viewContainer, tagContainer)

        this._listService = new ListService(boardId)
        this._cardService = new CardService()
        this._boardsService = new BoardsService()
        this._tagService = new TagService()

        this._newListForm = document.querySelector(newListForm)
        this._renameListForm = document.querySelector(renameListForm)
        this._newCardForm = document.querySelector(newCardForm)
        this._commentForm = document.querySelector(cardCommentForm)
        this._renameCardForm = document.querySelector(renameCardForm)
        this._dateCardForm = document.querySelector(dateCardForm)

        this._username = ''

        this._selectedList = null
        this._selectedListName = null

        this._selectedCard = null
        this._selectedCardName = null
        this._selectedCardDate = null
        this._selectedCardTags = []
        this._selectedCardTagColor = null
        this._selectedCardTagLabel = null
    }

    init() {
        this.retrieveUserData()
        this.setupActionButtons()

        this._newListForm.addEventListener('submit', this.submitNewListForm)
        this._renameListForm.addEventListener('submit', this.submitRenameListForm)
        this._newCardForm.addEventListener('submit', this.submitNewCardForm)
        this._commentForm.addEventListener('submit', this.submitCommentForm)
        this._renameCardForm.addEventListener('submit', this.submitRenameCard)
        this._dateCardForm.addEventListener('submit', this.submitDateCard)

        document.querySelector('#btnConfirmDelete').addEventListener('click', this.submitRemoveList)
        document.querySelector('#btnConfirmDeleteCard').addEventListener('click', this.submitRemoveCard)

        document.querySelector('#logoutClick').addEventListener('click', (ev) => {
            window.localStorage.removeItem('token')
            window.location.href = './index.html'
        })

        this._tagService.listarTags()
            .then(response => {
                this._view.updateTags(response)
            })
            .catch(e => {
                console.error(e)
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

    submitDateCard = (ev) => {
        ev.preventDefault()

        const dateInput = this._dateCardForm.querySelector('#cardRename_date')
        const date = new Date(dateInput.value).toLocaleDateString()

        if (!date) {
            this._view.showAlert('danger', 'Todos os campos são obrigatórios.')
            return
        }

        if (date === 'Invalid Date') {
            this._view.showAlert('danger', 'Data inválida')
            return
        }

        this._cardService.alterarDataCard(this._selectedCard, date)
            .then(response => {
                this._view.showAlert('success', 'Carão modificado com sucesso')
                return this._cardService.listaCardsDeUmList(this._selectedList)
            })
            .then(response => {
                this._view.updateCards(this._selectedList, response)
                $('#modalCardDate').modal('hide')
                dateInput.value = ''
                this.clearState()
            })
            .catch(e => {
                console.error(e)
                this._view.showAlert('danger', 'Erro ao alterar data do cartão')
            })
    }

    submitRenameCard = (ev) => {
        ev.preventDefault()

        const nameInput = this._renameCardForm.querySelector('#cardRename_name')
        const name = nameInput.value.trim()

        if (!name) {
            this._view.showAlert('danger', 'Todos os campos são obrigatórios')
            return
        }

        if (name === this._selectedCardName) {
            this._view.showAlert('danger', 'Você não alterou o nome do cartão')
            return
        }

        this._cardService.renomearCard(this._selectedCard, name)
            .then(response => {
                this._view.showAlert('success', 'Cartão modificado com sucesso!')
                return this._cardService.listaCardsDeUmList(this._selectedList)
            })
            .then(response => {
                this._view.updateCards(this._selectedList, response)
                $('#modalCardName').modal('hide')
                this.clearState()
                nameInput.value = ''
            })
            .catch(e => {
                console.error(e)
                this._view.showAlert('danger', 'Erro ao alterar nome do cartão')
            })
    }

    setupActionButtons = () => {
        document.querySelector('#btnEditCardName').addEventListener('click', (ev) => {
            ev.preventDefault()

            const nameInput = this._renameCardForm.querySelector('#cardRename_name')
            nameInput.value = this._selectedCardName

            $('#modalCardInfo').modal('hide')
            $('#modalCardName').modal('show')
        })

        document.querySelector('#btnEditCardDate').addEventListener('click', (ev) => {
            ev.preventDefault()

            
            const dateInput = this._dateCardForm.querySelector('#cardRename_date')
            const selectedDate = this._selectedCardDate.split(' ')[0].split('/')

            dateInput.value = `${selectedDate[2]}-${selectedDate[1]}-${selectedDate[0]}`

            $('#modalCardInfo').modal('hide')
            $('#modalCardDate').modal('show')
        })

        document.querySelector('#btnRemoveCard').addEventListener('click', (ev) => {
            ev.preventDefault()

            $('#modalCardInfo').modal('hide')
            $('#modalCardDelete').modal('show')
        })
    }

    clearState = () => {
        this._selectedList = null
        this._selectedListName = null

        this._selectedCard = null
        this._selectedCardName = null
        this._selectedCardDate = null
        this._selectedCardTagColor = null
        this._selectedCardTagLabel = null
    }

    submitRemoveCard = (ev) => {
        ev.preventDefault()

        this._cardService.excluirCard(this._selectedCard)
            .then(response => {
                this._view.showAlert('success', 'Cartão excluído com sucesso!')
                return this._cardService.listaCardsDeUmList(this._selectedList)
            })
            .then(response => {
                this._view.updateCards(this._selectedList, response)
                $('#modalCardDelete').modal('hide')
                this.clearState()
            })
            .catch(e => {
                console.error(e)
                this._view.showAlert('danger', 'Erro ao excluir cartão')
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

    tagsByCards = (cards) => {
        const promiseAll = cards.map(card => this._cardService.listaTagsCard(card.id))

        Promise.all(promiseAll)
            .then(responses => [
                responses.forEach((tags, index) => {
                    this._view.updateCardTags(cards[index].id, tags)
                })
            ])
            .catch(e => {
                console.error(e)
            })
    }

    cardsByLists = (lists) => {
        const promiseAll = lists.map(list => this._cardService.listaCardsDeUmList(list.id))

        Promise.all(promiseAll)
            .then(response => {
                response.forEach((cards, index) => {
                    this._view.updateCards(lists[index].id, cards)
                    this.tagsByCards(cards)
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
        const tag = this._newCardForm.querySelector('.cardInfo-tag input[type="radio"]:checked')
        const date = new Date().toLocaleDateString()

        if (!this._selectedList) {
            return
        }

        if (!name) {
            this._view.showAlert('danger', 'Todos os campos são obrigatórios')
            return
        }

        if (!tag) {
            this._view.showAlert('danger', 'Escolha uma tag para seu cartão')
            return
        }

        this._cardService.cadastrarCard(name, date, this._selectedList)
            .then(response => {
                return this._cardService.adicionarTagAoCard(tag.value, response.id)
            })
            .then(response => {
                this._view.showAlert('success', 'Card criado com sucesso!')
                return this._cardService.listaCardsDeUmList(this._selectedList)
            })
            .then(response => {
                this._view.updateCards(this._selectedList, response)
                this.tagsByCards(response)
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

    openModalCard = (listId, listName, cardId, cardName, cardDate) => {
        const tag = document.querySelector(`#tagList-${cardId} .cardInfo-tag`)

        this._view.updateModalCardInfos(listName, cardName, cardDate, tag.dataset.tagColor, tag.dataset.tagLabel)

        this._selectedCard = cardId
        this._selectedCardName = cardName
        this._selectedCardDate = cardDate
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