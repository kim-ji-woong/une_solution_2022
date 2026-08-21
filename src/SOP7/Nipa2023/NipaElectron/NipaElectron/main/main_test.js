// unity를 별도로 실행하는 테스트 버전

'use strict'

/* ============================================================================ */
/*                               Electron Settings                              */
/* ============================================================================ */
const { app, globalShortcut, Menu } = require('electron')

app.commandLine.appendSwitch('high-dpi-support', 1)
app.commandLine.appendSwitch('force-device-scale-factor', 1)

Menu.setApplicationMenu(null)


/* ============================================================================ */
/*                         Program Log & Show Error Box                         */
/* ============================================================================ */
const { dialog } = require('electron')
const log = require('electron-log')

let error = false
const errorMessage = (title = 'Error!', message) => {
    close_process()

    if (!error) {
        error = true
        showLog(message)
        dialog.showErrorBox(title, message)
    }
}

let showLog = (message) => {
    log.info(message)
}


/* ============================================================================ */
/*                               Program Setting file                           */
/* ============================================================================ */
const path = require('path')
const fs = require('fs')

const { start_exe, send_active_message} = require('./embedding.js')


let settings = null, preload_path = null, unity_dir = null
const readSettings = () => {
    try {
        settings = require(path.join(__dirname, "..", "..", "..", 'settings/settings.json'))
    } catch {
        settings = require(path.join(__dirname, "..", 'settings/settings.json'))
    }

    unity_dir = path.join('..', settings.unity.dir)

    preload_path = path.join(app.getAppPath(), settings.project.preload)

    if (!fs.existsSync(preload_path))
        preload_path = path.join(app.getAppPath(), "main", settings.project.preload)
}


/* ============================================================================ */
/*                              Websocket Communication                         */
/* ============================================================================ */
const { WebSocketServer } = require('ws')

let unity_websocket = null, ui_websocket = null
let ws_unity = null, ws_web = null

const onConnectionWithUnity = () => {
    showLog("on connection with unity")
}

const onReceiveMessageFromUnity = (data) => {
    const words = ("" + data).split(',')
    const signal = words[0]

    if (ui_websocket) {
        ui_websocket.send(data + "")
    }

    if (signal == 11) {
        send_active_message();
    }
}

const onCloseWithUnity = () => {
    close_process()
}

const onConnectionWithUI = () => {
    showLog("on connection with ui");
}

const onReceiveMessageFromUI = (data) => {
    if (unity_websocket) {
        unity_websocket.send(data)
    }

    const words = ("" + data).split(',')
    const signal = words[0]

    if (signal == 1 || signal == 2) {
        // Web to App (1) MoveToZone, (2) MoveToOutdoor
        webWindow.webContents.send("passTo3D", { value: true });
        webWindow.webContents.send("isOnUI", { value: true });
    } else if (signal == 16) {
        // Web to App (16) ViewMode
        if (words[1] == 0) {
            // Main Mode(0) : 기타
            webWindow.webContents.send("passToUI", { value: true });
        } else if (words[1] == 1 && words[2] == 0) {
            // Main Mode(1) && Sub Mode(0) : 기타 
            webWindow.webContents.send("passToUI", { value: true });
        } else {
            // 그 외의 화면에서는 3D 나옴
            webWindow.webContents.send("passTo3D", { value: true });
            webWindow.webContents.send("isOnUI", { value: true });
        }
    } else if (signal == 15) {
        send_active_message();
    }
}

const unity_websocket_init = () => {
    ws_unity = new WebSocketServer({ port: settings.websocket.unity })

    ws_unity.on('error', (error) => {
        showLog(error)
        errorMessage('Error', error.code)
    })

    ws_unity.on('connection', (ws) => {
        unity_websocket = ws

        onConnectionWithUnity()
        showLog("유니티와 연결됨")

        ws.on('message', (data) => {
            onReceiveMessageFromUnity(data)
            showLog("[unity] " + data)
        })

        ws.on('close', () => {
            showLog("유니티와의 연결이 끊어짐")
            onCloseWithUnity()
        })

    })
}

const ui_websocket_init = () => {
    ws_web = new WebSocketServer({ port: settings.websocket.web })

    ws_web.on('error', (error) => {
        errorMessage('Error', error.code)
    })

    ws_web.on('connection', (ws) => {

        onConnectionWithUI()
        showLog("Web과 연결됨")

        ws.on('error', (e) => {
            errorMessage('Error', e)
        })
        ui_websocket = ws


        ws.on('message', (data) => {
            onReceiveMessageFromUI(data)
            showLog("[ui] " + data)
        })

        ws.on('close', () => {
            showLog("Web과의 연결이 끊어짐")
        })
    })
}

const websocketFinalize = (webserver) => {
    if (webserver != null) {
        webserver.clients.forEach((socket) => {
            if ([socket.OPEN, socket.CLOSING].includes(socket.readyState)) {
                socket.terminate()
            }
        })
        webserver.removeAllListeners()
        webserver.close()
    }
}

const websocket_final = () => {
    websocketFinalize(ws_unity)
    websocketFinalize(ws_web)
}


/* ============================================================================ */
/*                               IPC Communication                              */
/* ============================================================================ */
const { ipcMain } = require('electron')

let preload_evt = null
ipcMain.on('evt_response', (evt, payload) => {
    preload_evt = evt
})

ipcMain.on('isOnUI', (evt, payload) => {
    if (unity_websocket) {
        if (payload.value == true) {
        }
    }
})

ipcMain.on('camera', (evt, payload) => {
    if (unity_websocket) {
        if (payload.camera == true) {
        }
    }

    if (ui_websocket) {
        if (payload.camera == true) {
        }
    }
})


/* ============================================================================ */
/*                            Resizing&Restore Event                            */
/* ============================================================================ */
let unityWindowBounds = null, webWindowBounds = null

function resizeChildWindow() {
    const parentContentBounds = unityWindow.getContentBounds()

    webWindow.setBounds({
        x: parentContentBounds.x,
        y: parentContentBounds.y,
        width: parentContentBounds.width,
        height: parentContentBounds.height
    })
}

function restoreChildWindow() {
    webWindow.restore()
    unityWindow.restore()

    const parentContentBounds = unityWindow.getContentBounds()

    webWindow.setBounds({
        x: parentContentBounds.x,
        y: parentContentBounds.y,
        width: parentContentBounds.width,
        height: parentContentBounds.height
    })
}

function subscribe() {
    unityWindow.on('move', () => {
        resizeChildWindow()
    })

    unityWindow.on('resize', () => {
        resizeChildWindow()
    })

    unityWindow.on('minimize', () => {
        unityWindowBounds = unityWindow.getBounds()
        webWindowBounds = webWindow.getBounds()

        webWindow.minimize()
        unityWindow.minimize()
    })

    unityWindow.on('maximize', () => {
        restoreChildWindow()
    })

    unityWindow.on('restore', () => {
        restoreChildWindow()
    })

}

function unsubscribe() {
    unityWindow.removeListener('move', () => {
        resizeChildWindow()
    })

    unityWindow.removeListener('resize', () => {
        resizeChildWindow()
    })

    unityWindow.removeListener('minimize', () => {
        unityWindowBounds = unityWindow.getBounds()
        webWindowBounds = webWindow.getBounds()

        webWindow.minimize()
        unityWindow.minimize()
    })

    unityWindow.removeListener('maximize', () => {
        restoreChildWindow()
    })

    unityWindow.removeListener('restore', () => {
        restoreChildWindow()
    })
}


/* ============================================================================ */
/*                             Program Close Process                            */
/* ============================================================================ */
const clearWebData = (ses) => {
    // clear cache
    ses.clearCache()
        .then(() => {
            showLog("clearCache")
        })

    // clear storage data
    ses.clearStorageData()
        .then(() => {
            showLog("clearStorageData")
        })

    // claer auth cache
    ses.clearAuthCache()
        .then(() => {
            showLog("clearAuthCache")
        })

    // clear host resolver cache
    ses.clearHostResolverCache()
        .then(() => {
            showLog("clearHostResolverCache")
        })

    // clear cookies
    ses.cookies.get({})
        .then((cookies) => {
            for (let cookie in cookies) {
                showLog(cookie)
                ses.cookies.remove(cookie.url, cookie.name)
            }
        }).catch((error) => {
            showLog(error)
        })

}

let close_phase = false
function close_process() {
    if (!close_phase) {
        close_phase = true

        ipcMain.removeAllListeners()

        app.quit()
    }
}


/* ============================================================================ */
/*                               Create Window                                  */
/* ============================================================================ */
const { BrowserWindow } = require('electron')
let unityWindow = null, webWindow = null

const createWindow = () => {
    unityWindow = new BrowserWindow({
        titleBarStyle: 'hidden',
        fullscreen: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        autoHideMenuBar: true,
    })

    unityWindow.show()

    webWindow = new BrowserWindow({
        parent: unityWindow,
        useContentSize: false,
        modal: false,
        transparent: true,
        frame: false,
        movable: false,
        resizable: false,
        webPreferences: {
            nativeWindowOpen: true,
            nodeIntegration: true,
            preload: preload_path
        }
    })

    ui_websocket_init()

    webWindow.loadURL(settings.webfront.url).catch((error) => {
        errorMessage('Error', error.code)
    })

    webWindow.on('ready-to-show', () => {
        webWindow.setBackgroundColor('#000000')

        ipcMain.on('set-ignore-mouse-events', (event, ...args) => {
            const win = BrowserWindow.fromWebContents(event.sender)
            win.setIgnoreMouseEvents(...args)
        })

    })


    if (settings.dev) {
        webWindow.webContents.on('before-input-event', (event, input) => {
            if (input.type == 'keyDown') {
                if (input.key == 'F12') {
                    if (webWindow.webContents.isDevToolsOpened()) {
                        webWindow.webContents.closeDevTools()
                    } else {
                        webWindow.webContents.openDevTools()
                    }
                }
            }
        })

        unityWindow.webContents.on('before-input-event', (event, input) => {
            if (input.type == 'keyDown') {
                if (input.key == 'F12') {
                    if (webWindow.webContents.isDevToolsOpened()) {
                        webWindow.webContents.closeDevTools()
                    } else {
                        webWindow.webContents.openDevTools()
                    }
                }
            }
        })
    }

    webWindow.maximize()

    resizeChildWindow()

    unityWindow.maximize()
    webWindow.maximize()

    unityWindow.on('close', (e) => {
        showLog("unityWindow closed")

        webWindow.close()
    })

    webWindow.on('ready-to-show', () => {
        subscribe()
        resizeChildWindow()

        webWindow.setBackgroundColor('#000000')
    })

    webWindow.on('close', (e) => {
        showLog("webWindow closed")
        const ses = webWindow.webContents.session
        clearWebData(ses)

        unsubscribe()
    })
}

app.whenReady().then(() => {

    readSettings()

    unity_websocket_init()

    globalShortcut.register('alt+tab', () => {
        return false
    })

    createWindow()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        check_update()

        createWindow()
    }
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        close_process()
    }
})

app.on('before-quit', () => {
    websocket_final()
})