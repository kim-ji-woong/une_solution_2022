'use strict'
/* ============================================================================ */
/*                               Electron Settings                              */
/* ============================================================================ */
const { app, globalShortcut, Menu } = require('electron')

Menu.setApplicationMenu(null)

app.commandLine.appendSwitch('high-dpi-support', 1)
app.commandLine.appendSwitch('force-device-scale-factor', 1)
app.commandLine.appendSwitch('incognito')


/* ============================================================================ */
/*                         Program Log & Show Error Box                         */
/* ============================================================================ */
const { dialog } = require('electron')
const log = require('./logger.js')

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
const { join } = require('path')
const fs = require('fs')

let settings_path = null, settings = null, unity_dir = null, preload_path = null
const readSettings = () => {

    // find settings.json
    settings_path = join(__dirname, "..", '/settings/settings.json')
    if (fs.existsSync(settings_path)) {
        settings = require(settings_path)
    }
    else {
        settings_path = join(__dirname, "..", "..", "..", '/settings/settings.json')
        settings = require(settings_path)
    }
    showLog(`setting file: ${settings_path}`)

    // find 3D exe file
    unity_dir = join(__dirname, "..", settings.unity.dir)
    if (!fs.existsSync(unity_dir)) {
        unity_dir = join(__dirname, "..", "..", "..", settings.unity.dir)
    }
    showLog(`3D exe file: ${unity_dir}`)

    // find preload.js
    preload_path = path.join(app.getAppPath(), settings.project.preload)
    if (!fs.existsSync(preload_path)) {
        preload_path = path.join(app.getAppPath(), "main", settings.project.preload)
    }
    showLog(`preload.js: ${preload_path}`)
}

/* ============================================================================ */
/*                               Ipc Communication                              */
/* ============================================================================ */
const { ipcMain } = require('electron')

ipcMain.on('auto-rotation', (evt, payload) => {
    if (unity_websocket) {
        if (payload) {
            showLog("[electron] 15, 1")
            unity_websocket.send('15,1')
        }
        else {
            showLog("[electron] 15, 0")
            unity_websocket.send('15,0')
        }
    }
})

ipcMain.on('on3D', (evt, payload) => {
    send_active_message()
})

/* ============================================================================ */
/*                            Embedding 3D Program                              */
/* ============================================================================ */
const { set_embedding_type, embedding_3D, send_active_message, move_window, close_3D, send_inactive_message, start_3D } = require('./embedding.js')

set_embedding_type('UNITY')

let set_child_result = false
let unityWindow = null, webWindow = null


/* ============================================================================ */
/*                              Websocket Communication                         */
/* ============================================================================ */
const { WebSocketServer } = require('ws')
const path = require('path')

let unity_websocket = null, ui_websocket = null
let ws_unity = null, ws_web = null

const onConnectionWithUnity = () => {
    if (!set_child_result) {
        embedding_3D(settings.unity.filename, resizeChildWindow);

        webWindow.close()
        webWindow.destroy()

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
            },
            autoHideMenuBar: true,
            fullscreen: true,
            // width: 1920,
            // height: 1080,
            enableLargerThanScreen: true,
            thickFrame: false,
            minimizable: false,
            closable: false
        })

        webWindow.setBackgroundColor(settings.project.color);

        ui_websocket_init()

        webWindow.loadURL(settings.webfront.url).catch((error) => {
            errorMessage(`Error: ${error.code}`)
        })

        webWindow.on('ready-to-show', () => {
            subscribe()
            resizeChildWindow()

            const ses = webWindow.webContents.session
            clearWebData(ses)

            webWindow.setBackgroundColor("#00000000")
            webWindow.show();

            ipcMain.on('set-ignore-mouse-events', (event, ...args) => {
                const win = BrowserWindow.fromWebContents(event.sender)
                win.setIgnoreMouseEvents(...args)
            })
        })

        webWindow.on('focus', () => {
            send_inactive_message()
        })

        webWindow.on('close', (e) => {
            showLog("webWindow closed")
            unsubscribe()

            close_process()
        })

        if (settings.dev) {
            webWindow.webContents.on('before-input-event', (event, input) => {
                if (input.type == 'keyDown') {
                    if (input.key == 'F12') {
                        if (webWindow.webContents.isDevToolsOpened()) {
                            webWindow.webContents.closeDevTools()
                            webWindow.webContents.send("passTo3D", { value: true });
                        } else {
                            webWindow.webContents.openDevTools()
                            webWindow.webContents.send("passToUI", { value: true });
                        }
                    }
                }
            })

            unityWindow.webContents.on('before-input-event', (event, input) => {
                if (input.type == 'keyDown') {
                    if (input.key == 'F12') {
                        if (webWindow.webContents.isDevToolsOpened()) {
                            webWindow.webContents.closeDevTools()
                            webwindow.webContents.send("passTo3D", { value: true });
                        } else {
                            webWindow.webContents.openDevTools()
                            webwindow.webContents.send("passToUI", { value: true });
                        }
                    }
                }
            })
        }

        webWindow.maximize()

        resizeChildWindow()

        set_child_result = true
    }
}

const onReceiveMessageFromUnity = (data) => {
    const words = ("" + data).split(',')
    const signal = words[0]

    if (ui_websocket) {
        if(signal != -1)
            ui_websocket.send(data + "")
    }

    if (signal == 11) {
        send_active_message();
    } else if (signal == 11) {
        webWindow.webContents.send("passTo3D", { value: true });
        webWindow.webContents.send("active3D", { value: true });
        webWindow.webContents.send("isOnUI", { value: true });
        send_active_message();
    } else if (signal == 12) {

    }
}

const onCloseWithUnity = () => {
    close_process()
}

const onReceiveMessageFromUI = (data) => {
    const words = ("" + data).split(',')
    const signal = words[0]

    if (unity_websocket) {
        unity_websocket.send(data)
    }

    if (signal == 1 || signal == 2) {
        // Web to App (1) MoveToZone, (2) MoveToOutdoor
        webWindow.webContents.send("isOnUI", { value: true });
        send_active_message();
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
            webWindow.webContents.send("active3D", { value: true });
            send_active_message();
        }
    } else if (signal == 15) {
        send_active_message();
    } else if (signal == 20) {
        webWindow.webContents.send("passTo3D", { value: true });
        webWindow.webContents.send("active3D", { value: true });
        send_active_message();
    } else if (signal == 25) {
        let autoRoationOnOff = words[1] * 1 == 1;
        let minutes = words[2] * 1;

        webWindow.webContents.send("auto-rotation", { onOff: autoRoationOnOff, time: minutes });
    } else if (signal == 27) {
        webWindow.webContents.send("passTo3D", { value: true });
        webWindow.webContents.send("active3D", { value: true });
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
        ws.on('error', (e) => {
            errorMessage('Error', e)
        })
        ui_websocket = ws

        showLog("Web과 연결됨")

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
/*                            Resizing&Restore Event                            */
/* ============================================================================ */
let unityWindowBounds = null, webWindowBounds = null

function resizeChildWindow() {
    const parentContentBounds = unityWindow.getContentBounds()

    move_window(0, 0, parentContentBounds.width, parentContentBounds.height, false)

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

    move_window(0, 0, parentContentBounds.width, parentContentBounds.height, false)

    webWindow.setBounds({
        x: parentContentBounds.x,
        y: parentContentBounds.y,
        width: parentContentBounds.width,
        height: parentContentBounds.height
    })

    webWindow.webContents.send("passTo3D", { value: true });
    webWindow.webContents.send("active3D", { value: true });
    send_active_message();
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

        send_inactive_message();
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

        send_inactive_message();
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

        close_3D(settings.unity.filename)

        app.quit()
    }
}


/* ============================================================================ */
/*                               Program Setting file                           */
/* ============================================================================ */
let isStart = false
const checkTimeout = () => {
    if (!isStart) {
        error = true
        showLog("프로그램이 정상적으로 실행되지 않았습니다. 프로그램을 재 실행해 주세요.")
        dialog.showErrorBox("Error", "프로그램이 정상적으로 실행되지 않았습니다. 프로그램을 재 실행해 주세요.")

        app.quit()
    }
}

setTimeout(checkTimeout, 10000);

/* ============================================================================ */
/*                               Create Window                                  */
/* ============================================================================ */
const { BrowserWindow } = require('electron')

const createWindow = () => {
    unityWindow = new BrowserWindow({
        titleBarStyle: 'hidden',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        autoHideMenuBar: true,
        // skipTaskbar: true,
        kiosk: true,
        fullscreen: true,
        // width: 1920,1
        // height: 1080,
        thickFrame: false,
        minimizable: false,
        closable: false
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
        },
        autoHideMenuBar: true,
        fullscreen: true,
        // width: 1920,
        // height:1080,
        thickFrame: false,
        minimizable: false,
        closable: false
    })

    webWindow.setBackgroundColor(settings.project.color)

    unityWindow.maximize()
    webWindow.maximize()

    unityWindow.on('close', (e) => {
        showLog("unityWindow closed")
        webWindow.close()
    })

    webWindow.on('ready-to-show', () => {
        subscribe()
        resizeChildWindow()

    })

    webWindow.on('focus', () => {
    })

    webWindow.on('close', (e) => {
        showLog("webWindow closed")
        unsubscribe()
    })

    // unityWindow.on('focus', () => {
    //     send_active_message()
    // })

    unityWindow.on('blur', () => {

    })
}

app.whenReady().then(() => {
    isStart = true

    readSettings()

    unity_websocket_init()

    globalShortcut.register('alt+tab', () => {
        return false;
    })

    globalShortcut.register('Ctrl+W', () => {
        return false;
    })

    createWindow()

    showLog(`${unity_dir}/${settings.unity.filename}.exe`)
    start_3D(unityWindow.getNativeWindowHandle(), `${unity_dir}/${settings.unity.filename}.exe`)
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