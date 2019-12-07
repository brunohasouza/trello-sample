class FactoryXHR {
    constructor() {
        throw new Error('Esta classe não pode ser instanciada')
    }

    static request(URL, method, data = null, successCallback, errorCallback) {
        let xhr = new XMLHttpRequest()
        xhr.open(method, URL)
        xhr.setRequestHeader("content-type", "application/json")

        xhr.onreadystatechange = function() {
            if (this.readyState !== XMLHttpRequest.DONE) {
                return
            }

            const responseText = JSON.parse(xhr.responseText)

            if (this.status === 200) {
                successCallback(responseText)
            } else {
                errorCallback(responseText.errors[0])
            }

        }

        if (method === 'GET') {
            xhr.send()
        } else {
            xhr.send(JSON.stringify(data))
        }
    }
}