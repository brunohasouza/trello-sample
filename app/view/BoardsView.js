class BoardsView {
    constructor(containerId) {
        this._container = document.querySelector(containerId)
    }

    drawBoards = (boards) => {
        return boards.map(board => `
            <div class="col-6 col-sm-4 col-md-3 col-lg-2">
                <div class="boardElement" >
                    <a href="./board.html?id=${board.id}" class="${board.color}">
                        <span>${board.name}</span>
                    </a>
                    <div class="board-options">                        
                        <button class="btn btn-icon" onclick="controller.openModalColor(${board.id}, '${board.color}')">
                            <i class="fas fa-palette"></i>
                        </button>
                        <button class="btn btn-icon" onclick="controller.openModalName(${board.id}, '${board.name}')">
                            <i class="far fa-edit"></i>
                        </button>
                        <button class="btn btn-icon" onclick="controller.openModalDelete(${board.id})">
                            <i class="far fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>    
        `).join('')
    }
    
    appendNewBoard = (boards) => {
        return boards += `
            <div class="col-6 col-sm-4 col-md-3 col-lg-2">
                <div class="board newBoard" data-toggle="modal" data-target="#modalNovoBoard">
                    <span>Criar novo quadro</span>
                </div>
            </div>        
        `
    }

    updateBoards = (boards) => {
        const boardsHtml = this.drawBoards(boards)
        this._container.innerHTML = this.appendNewBoard(boardsHtml)
    }

    showAlert = (variant, message) => {
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
}