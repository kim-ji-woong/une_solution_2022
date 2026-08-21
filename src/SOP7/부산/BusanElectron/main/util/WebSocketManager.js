const { WebSocketServer } = require('ws')

const log = require('./logger.js')

module.exports = class WebsocketManager {

    #log(message) {
        log.info(`[PreferenceManager] ${message}`)
    }

    open(port, websockerCallbackParams) {
        if (this._websocketServer != null) {
            this.close()
        }

        this._websocketServer = new WebSocketServer({ port: port })

        this._websocketServer.on('error', (error) => {
            if (websockerCallbackParams.onErrorCallback != null) {
                websockerCallbackParams.onErrorCallback(error)
            }
        })

        this._websocketServer.on('connection', (ws) => {
            this._ws = ws

            if (websockerCallbackParams.onConnectionCallback != null) {
                websockerCallbackParams.onConnectionCallback()
            }

            ws.on('error', (error) => {
                if (websockerCallbackParams.onErrorCallback != null) {
                    websockerCallbackParams.onErrorCallback(error)
                }
            })

            ws.on('message', (data) => {
                if (websockerCallbackParams.onMessageCallback != null) {
                    websockerCallbackParams.onMessageCallback(data)
                }
            })

            ws.on('close', () => {
                if (websockerCallbackParams.onCloseCallback != null) {
                    websockerCallbackParams.onCloseCallback()
                }
            })
        })
    }

    close() {
        if (this._websocketServer == null) {
            return
        }

        this._websocketServer.clients.forEach((socket) => {
            if ([socket.OPEN, socket.CLOSING].includes(socket.readyState)) {
                socket.terminate()
            }
        })
        this._websocketServer.removeAllListeners()
        this._websocketServer.close()
        this._websocketServer = null
    }

    get ws() {
        return this._ws
    }

    send(message) {
        if (this._ws == null) {
            return false
        }

        this._ws.send(message)

        return true
    }
}