class BoardView {
    constructor(listContainer) {
        this._container = document.querySelector(listContainer)
    }

    drawCards = (cards) => {
        return cards.map(card => `
            <div class="cardList-card card" onclick="controller.openModalCard(${card.trelloListId}, '${card.trello_list.name}', ${card.id}, '${card.name}')">
                <div class="card-body">
                    <p>${card.name}</p>
                </div>
            </div>        
        `).join('')
    }

    drawComments = (comments, username) => {
        return comments.map(comment => {
            const date = new Date(comment.createdAt)            
            return  `
                <div class="comentario">
                    <p class="comentario-date"><strong>${username}</strong> - ${date.toLocaleString()}</p>
                    <p>${comment.comment}</p>
                </div>
            `
        }).join('')
    }

    drawLists = (lists) => {
        return lists.map(list => `
            <div class="list__element">
                <div class="list__element--container">
                    <div class="list__element--title">
                        <h2>${list.name}</h2>
                        <div class="dropdown">
                            <button class="btn btn-icon dark" type="button" id="${list.id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <div class="dropdown-menu dropdown-menu-right"" aria-labelledby="${list.id}">
                                <button class="dropdown-item" onclick="controller.openModalRenameList(${list.id}, '${list.name}')">Alterar Título</button>
                                <button class="dropdown-item" onclick="controller.openModalDeleteList(${list.id})">Excluir List</button>
                            </div>
                        </div>
                    </div>
                    <div class="list__element--cardList" id="cardList-${list.id}">
                    </div>
                    <div class="list__element--addCard">
                        <button type="button" class="btn btn-block btn-sm btn-outline-dark" onclick="controller.openModalNewCard(${list.id})">
                            <i class="fas fa-plus"></i>
                            <span>Adicionar um novo card</span>
                        </button>
                    </div>
                </div>
            </div>        
        `).join('')
    }

    appendNewList = (lists) => {
        return lists += `
            <div class="list__element newList">
                <button class="btn btn-block btn-addList" data-toggle="modal" data-target="#modalNewList">
                    <i class="fas fa-plus"></i>
                    <span>Adicionar uma nova lista</span>
                </button>
            </div>
        `
    }

    updateComments = (comments, username) => {
        document.querySelector('#comentariosList').innerHTML = this.drawComments(comments.reverse(), username)
    }

    updateModalCardInfos = (listName, cardName) => {
        document.querySelector('#cardInfoTitle').innerHTML = `<i class="fab fa-trello"></i><span>${cardName}</span>`
        document.querySelector('#cardInfoSubtitle').innerHTML = `na lista <strong>${listName}</strong>`
    }

    setBoardTitle = (title) => {
        document.querySelector('.boardTitle').innerHTML = title
    }

    setBoardColor = (color) => {
        document.querySelector('main.logado').classList.add(color)
    }

    updateLists = (lists) => {
        const listHtml = this.drawLists(lists)
        this._container.innerHTML = this.appendNewList(listHtml)
    }

    updateCards = (listId, cards) => {
        const id = `#cardList-${listId}`

        document.querySelector(id).innerHTML = this.drawCards(cards)
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