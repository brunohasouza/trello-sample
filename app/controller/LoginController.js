class LoginController {
    constructor(loginForm, cadastroForm, alertContainer) {
        this._formLogin = document.querySelector(loginForm)
        this._formCadastro = document.querySelector(cadastroForm)

        this._view = new LoginView(alertContainer)
        this._service = new LoginService()
    }

    init() {
        this._formLogin.addEventListener('submit', this.submitLoginForm)
        this._formCadastro.addEventListener('submit', this.submitCadastroForm)
    }

    submitLoginForm = (ev) => {
        ev.preventDefault()
        
        const username = this._formLogin.querySelector('#loginForm_username').value
        const password = this._formLogin.querySelector('#loginForm_senha').value

        if (!username || !password) {
            this._view.showAlert('Todos os campos são obrigatórios', 'danger')
            return
        }

        this._service.login({ username, password })
            .then(response => {
                this._view.showAlert('Usuário logado com sucesso.', 'success')
                window.localStorage.setItem('token', response.token)

                setTimeout(() => {
                    window.location.href = 'boards.html'                    
                }, 1000);
            })
            .catch(response => {
                this._view.showAlert(response.message, 'danger')
            })
    }

    submitCadastroForm = (ev) => {
        ev.preventDefault()
        
        const name = this._formCadastro.querySelector('#cadastroForm_nome').value
        const username = this._formCadastro.querySelector('#cadastroForm_username').value
        const password = this._formCadastro.querySelector('#cadastroForm_senha').value

        if (!username || !password || !name) {
            this._view.showAlert('Todos os campos são obrigatórios', 'danger')
            return
        }

        this._service.cadastrarUsuario({ name, username, password })
            .then(() => {
                this._view.showAlert('Usuário "username" cadastrado com sucesso. Você já pode logar.', 'success')
            })
            .catch(response => {
                
                this._view.showAlert(
                    response.message === 'username must be unique' ? 
                        `Já existe um ${username} cadastrado. Crie outro nome de usuário.` :
                        'Erro ao cadadastrar usuário', 
                    'danger'
                )
            })
    }
}