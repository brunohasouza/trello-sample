class BoardController {
    constructor(boardId, viewContainer, newListForm, renameListForm) {
        this._boardId = boardId

        this._view = new BoardView(viewContainer)

        this._listService = new ListService(boardId)
        this._boardsService = new BoardsService()

        this._newListForm = document.querySelector(newListForm)
        this._renameListForm = document.querySelector(renameListForm)

        this._selectedList = null
        this._selectedListName = null
    }

    init() {
        this._newListForm.addEventListener('submit', this.submitNewListForm)
        this._renameListForm.addEventListener('submit', this.submitRenameListForm)

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
            })
            .catch(e => {
                console.error(e)
            })
    }

    submitRenameListForm = (ev) => {
        ev.preventDefault()

        const name = this._renameListForm.querySelector('#listRename_name').value.trim()

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

        const name = this._newListForm.querySelector('#listNew_name').value.trim()

        if (!name) {
            this._view.showAlert('danger', 'Todos os campos são obrigatórios')
            return
        }

        this._listService.cadastrarUmList(name)
            .then(response => {
                $('#modalNewList').modal('hide')
                this._view.showAlert('success', 'Lista criada com sucesso!')
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

    openModalNewCard = (id) => {

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