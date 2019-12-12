class BoardsController {
    constructor(boardsForm, colorForm, nameForm, boardsContainer){
        this._form = document.querySelector(boardsForm)
        this._formColor = document.querySelector(colorForm)
        this._formName = document.querySelector(nameForm)

        this._view = new BoardsView(boardsContainer)
        this._service = new BoardsService()

        this._selectedBoard = null
        this._selectedColor = null
        this._selectedName = null
    }

    init = () => {
        this.retrieveUserBoards()
        this.retrieveUserData()

        this._form.addEventListener('submit', this.submitNewBoardForm)
        this._formColor.addEventListener('submit', this.submitColorBoardForm)
        this._formName.addEventListener('submit', this.submitNameBoardForm)

        document.querySelector('#btnConfirmDelete').addEventListener('click', this.removeBoard)

        document.querySelector('#logoutClick').addEventListener('click', (ev) => {
            window.localStorage.removeItem('token')
            window.location.href = './index.html'
        })
    }

    removeBoard = (ev) => {
        ev.preventDefault()

        if (!this._selectedBoard) {
            return
        }

        this._service.excluirBoard(this._selectedBoard)
            .then(() => {
                this._selectedBoard = null

                this._view.showAlert('success', 'Board excluído com sucesso')
                $('#modalBoardDelete').modal('hide')

                return this._service.listarBoardsDoUsuario()
            })
            .then(response => {
                this._view.updateBoards(response)
            })
            .catch(e => {
                console.error(e)
                this._view.showAlert('danger', 'Erro ao tentar excluir este board')
            })
            
    }

    openModalColor = (boardId, color) => {
        this._selectedBoard = boardId
        this._selectedColor = color

        const input = this._formColor.querySelector(`input[value="${color}"]`)
        input.checked = true

        $('#modalBoardColor').modal('show')
    }

    openModalName = (boardId, name) => {
        this._selectedBoard = boardId
        this._selectedName = name

        const input = this._formName.querySelector('#boardName_name')
        input.value = name

        $('#modalBoardName').modal('show')
    }

    openModalDelete = (boardId) => {
        this._selectedBoard = boardId

        $('#modalBoardDelete').modal('show')
    }

    retrieveUserData = () => {
        this._login = new LoginService()
        this._login.recuperarUsuarioPeloToken()
            .then(response => {
                LoginView.updateUsername(response.name)
            })
            .catch(e => {
                console.error(e)
                this._view.showAlert('danger', 'Erro ao recuperar dados dos usuário')
            })
    }

    submitNameBoardForm = (ev) => {
        ev.preventDefault()

        const boardName = this._formName.querySelector('#boardName_name').value.trim()

        if (!boardName) {
            this._view.showAlert('danger', 'Todos os campos são obrigatórios')
            return
        }

        if (boardName === this._selectedName) {
            this._view.showAlert('danger', 'Você não mudou o título do board')
            return
        }

        this._service.renomearBoard(this._selectedBoard, boardName)
            .then(() => {
                this._view.showAlert('success', 'Nome alterado com sucesso')

                this._selectedBoard = null
                this._selectedName = null

                $('#modalBoardName').modal('hide')

                return this._service.listarBoardsDoUsuario()
            })
            .then(response => {
                this._view.updateBoards(response)
            })
            .catch(e => {
                console.error(e)
                this._view.showAlert('danger', 'Erro ao alterar nome do board')
            })
    }

    submitColorBoardForm = (ev) => {
        ev.preventDefault()

        const boardColor = this._formColor.querySelector('input[name="boardChangeColor"]:checked')

        if (!boardColor) {
            this._view.showAlert('danger', 'Todos os campos são obrigatórios')
            return
        }

        if (boardColor.value === this._selectedColor) {
            this._view.showAlert('danger', 'Você não mudou a cor do board')
            return
        }

        this._service.alterarCorBoard(this._selectedBoard, boardColor.value)
            .then(() => {
                this._view.showAlert('success', 'Cor alterada com sucesso')
                this._selectedColor = null
                this._selectedBoard = null

                $('#modalBoardColor').modal('hide')

                return this._service.listarBoardsDoUsuario()
            })
            .then(response => {
                this._view.updateBoards(response)
            })
            .catch(e => {
                console.error(e)
                this._view.showAlert('danger', 'Erro ao alterar cor do board')
            })
    }

    submitNewBoardForm = (ev) => {
        ev.preventDefault()

        const boardName = this._form.querySelector('#boardForm_nome').value.trim()
        const boardColor = this._form.querySelector('input[name="boardColor"]:checked')

        if (!boardColor || !boardName) {
            this._view.showAlert('danger', 'Todos os campos são obrigatórios')
            return
        }

        this._service.cadastrarUmBoard({
                name: boardName,
                color: boardColor.value
            })
            .then(() => {
                $('#modalNovoBoard').modal('hide')
                this._view.showAlert('success', 'Board criado com sucesso')
                return this._service.listarBoardsDoUsuario()
            })
            .then(response => {
                this._view.updateBoards(response)
            })
            .catch(e => {
                console.error(e)
                this._view.showAlert('danger', 'Erro ao criar novo board')
            })
    }

    retrieveUserBoards = () => {
        this._service.listarBoardsDoUsuario()
            .then(response => {
                this._view.updateBoards(response)
            })
            .catch(e => {
                console.error(e)
                this._view.showAlert('danger', 'Erro ao listar boards do usuário')
            })
    }
} 