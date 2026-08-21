'use strict'

/* ============================================================================ */
/*                               Electron Settings                              */
/* ============================================================================ */
const { app, Menu } = require('electron')

Menu.setApplicationMenu(null)

app.commandLine.appendSwitch('high-dpi-support', 1)
app.commandLine.appendSwitch('force-device-scale-factor', 1)
app.commandLine.appendSwitch('incognito')

const Util = require('./util/util.js')
const util = new Util()

util.setErrorCallback(closeProcess)
util.setTimeoutCallback(() => {
    app.quit()
})
setTimeout(() => { util.onTimeout() }, 10000);

const log = require('./util/logger.js')
function showLog(message) {
    log.info(message)
}

let mainWindow = null, childWindow = null

/* ============================================================================ */
/*                               Ipc Communication                              */
/* ============================================================================ */
const { ipcMain } = require('electron')

ipcMain.on('auto-rotation', (evt, payload) => {
    sendAutoRotationSignal(payload)
})

ipcMain.on('on3D', (evt, payload) => {
})

/* ============================================================================ */
/*                                 Dev functions                                */
/* ============================================================================ */
const { globalShortcut } = require('electron')
const PreferenceManager = require('./util/PreferenceManager.js')
const preferenceManager = new PreferenceManager()

function zoomOut() {
    if (!preferenceManager.isDev) return;

    var zoomFactor = preferenceManager.zoomOut()
    childWindow.webContents.setZoomFactor(zoomFactor)
    showLog(`change zoom: ${zoomFactor}`)
}
function zoomIn() {
    if (!preferenceManager.isDev) return;

    var zoomFactor = preferenceManager.zoomIn()
    childWindow.webContents.setZoomFactor(zoomFactor)
    showLog(`change zoom: ${zoomFactor}`)
}
function showDevTools() {
    if (!preferenceManager.isDev) return;

    if (childWindow.webContents.isDevToolsOpened()) {
        childWindow.webContents.closeDevTools()
        sendActiveUISignal(true)
    } else {
        childWindow.webContents.openDevTools()
        sendActiveUISignal(true)
    }
}

function sendActiveUISignal(value) {
    childWindow.webContents.send("activeUI", value);
}

/* ============================================================================ */
/*                            WebsocketCommunication                            */
/* ============================================================================ */
const WebSocketManager = require('./util/WebSocketManager.js')
let unityWebsocket = null, uiWebsocket = null

function loadWebfront() {
    childWindow.loadURL(preferenceManager.webfrontUrl).catch((error) => {
        util.onError('Error', error.code)
    })

    childWindow.webContents.setZoomFactor(preferenceManager.zoomFactor)
    childWindow.webContents.setVisualZoomLevelLimits(preferenceManager.zoomLimitMin, preferenceManager.zoomLimitMax)

    childWindow.on('ready-to-show', () => {
        subscribe()
        resizeChildWindow()

        // const ses = childWindow.webContents.session
        // util.clearWebData(ses)

        childWindow.setBackgroundColor("#00000000")
        childWindow.show();

        ipcMain.on('set-ignore-mouse-events', (event, ...args) => {
            const win = BrowserWindow.fromWebContents(event.sender)
            win.setIgnoreMouseEvents(...args)
        })
    })

    childWindow.on('focus', () => {
    })

    childWindow.on('close', (e) => {
        showLog("webWindow closed")
        unsubscribe()

        closeProcess()
    })

    childWindow.maximize()

    resizeChildWindow()
}
function onConnectionWithUnity() {
    initUIWebsocket()
    loadWebfront()
}
function onCloseWithUnity() {
    closeProcess()
}
function initUnityWebsocket() {
    unityWebsocket = new WebSocketManager()

    let callbackParams = []
    callbackParams.onErrorCallback = (error) => {
        showLog(error)
        util.onError('Error', error.code)
    }
    callbackParams.onConnectionCallback = () => {
        onConnectionWithUnity()
        showLog("유니티와 연결됨")
    }
    callbackParams.onMessageCallback = (data) => {
        onReceiveMessageFromUnity(data)
        showLog("[unity] " + data)
    }
    callbackParams.onCloseCallback = () => {
        showLog("유니티와의 연결이 끊어짐")
        onCloseWithUnity()
    }
    unityWebsocket.open(preferenceManager.unityPort, callbackParams)
}
function initUIWebsocket() {
    uiWebsocket = new WebSocketManager()

    let callbackParams = []
    callbackParams.onErrorCallback = (error) => {
        showLog(error)
        util.onError('Error', error.code)
    }
    callbackParams.onConnectionCallback = () => {
        showLog("Web과 연결됨")
    }
    callbackParams.onMessageCallback = (data) => {
        onReceiveMessageFromWebfront(data)
        showLog("[ui] " + data)
    }
    callbackParams.onCloseCallback = () => {
        showLog("Web과의 연결이 끊어짐")
    }

    uiWebsocket.open(preferenceManager.UIPort, callbackParams)
}
function closeAllWebsocketServer() {
    if(unityWebsocket!=null)
        unityWebsocket.close()

    if(uiWebsocket!=null)
        uiWebsocket.close()
}

/* ============================================================================ */
/*                       Child Window State Changed Event                       */
/* ============================================================================ */
function resizeChildWindow() {
    const parentContentBounds = mainWindow.getContentBounds()

    childWindow.setBounds({
        x: parentContentBounds.x,
        y: parentContentBounds.y,
        width: parentContentBounds.width,
        height: parentContentBounds.height
    })
}
function restoreChildWindow() {
    childWindow.restore()
    mainWindow.restore()

    const parentContentBounds = mainWindow.getContentBounds()

    childWindow.setBounds({
        x: parentContentBounds.x,
        y: parentContentBounds.y,
        width: parentContentBounds.width,
        height: parentContentBounds.height
    })
}
function minimizeChildWindow() {
    unityWindowBounds = mainWindow.getBounds()
    webWindowBounds = childWindow.getBounds()

    childWindow.minimize()
    mainWindow.minimize()
}
function subscribe() {
    mainWindow.on('move', resizeChildWindow)
    mainWindow.on('resize', resizeChildWindow)
    mainWindow.on('minimize', minimizeChildWindow)
    mainWindow.on('maximize', restoreChildWindow)
    mainWindow.on('restore', restoreChildWindow)
}
function unsubscribe() {
    mainWindow.removeListener('move', resizeChildWindow)
    mainWindow.removeListener('resize', resizeChildWindow)
    mainWindow.removeListener('minimize', minimizeChildWindow)
    mainWindow.removeListener('maximize', restoreChildWindow)
    mainWindow.removeListener('restore', restoreChildWindow)
}

/* ============================================================================ */
/*                               Create Window                                  */
/* ============================================================================ */
const { BrowserWindow } = require('electron')

function createWindow() {
    mainWindow = new BrowserWindow(preferenceManager.getMainWindowSettings())
    mainWindow.show()
    mainWindow.maximize()

    childWindow = new BrowserWindow(preferenceManager.getChildWindowSettings(app.getAppPath()))
    childWindow.setBackgroundColor(preferenceManager.backgroundColor)
    childWindow.setParentWindow(mainWindow)
    childWindow.maximize()

    mainWindow.on('close', (e) => {
        showLog("unityWindow closed")
        childWindow.close()
    })
}

let close_phase = false
function closeProcess() {
    ipcMain.removeAllListeners()
    mainWindow.destroy()
    childWindow.destroy()
    childProcessManager.closeUnity()
    app.quit()
}

/* ============================================================================ */
/*                               Custom Functions                               */
/* ============================================================================ */

// 유니티로부터 메시지를 수신하였을 때 동작
function onReceiveMessageFromUnity(data) {
    uiWebsocket.send(data + "")

    var json = JSON.parse(data);
    var header = json.header

    if (header == 31) {
        showBackgroundColor()
    } else if (header == 33) {
        hideBackGroundColor()
    }
}

// 웹프론트로부터 메시지를 수신하였을 때 동작
function onReceiveMessageFromWebfront(data) {
    unityWebsocket.send(data + "")

    var json = JSON.parse(data);

    var header = json.header

    if (header == 1 || header == 2 || header == 43) {
    } else if (header == 44) {
        // Web to App (44) ResponseAutoRotationSettings
        let autoRoationOnOff = json.content.active == 1;
        let minutes = json.content.time * 1;
        sendAutoRotationParams(autoRoationOnOff, minutes)
    } else if (header == 33) {
        // Web to App (33) CheckExit
        closeProcess()
    }
}

function showBackgroundColor() {
    childWindow.setBackgroundColor(preferenceManager.backgroundColor)
}

function hideBackGroundColor() {
    childWindow.setBackgroundColor("#00000000")
}

// 일렉트론에서 자동 회전이 감지되었을 때 동작
function sendAutoRotationSignal(result) {
    var value = result ? 1 : 0;

    data = {
        header: 24,
        content: {
            value: value
        }
    }

    const json = JSON.stringify(data);
    unityWebsocket.send(json)
    showLog(json)
}

// 단축키 기능 추가
const KeyMap = {
    TOP: 1,
    FRONT: 2,
    LEFT: 3,
    RIGHT: 4,
    ISO: 5
}

Object.freeze(KeyMap);

function setGlobalShortcut() {
    // BrowserWindow의 alt+tab 기능 무시
    globalShortcut.register('alt+tab', () => {
        return false;
    })

    // BrowserWindow의 Ctrl+W 기능 무시
    globalShortcut.register('Ctrl+W', () => {
        return false;
    })

    // 개발자 모드에서만 동작
    globalShortcut.register('Ctrl+F12', showDevTools)
    globalShortcut.register('[', zoomOut)
    globalShortcut.register(']', zoomIn)

    // 커스텀 단축키
    globalShortcut.register('Ctrl+T', () => {
        onKeyMapPressed(KeyMap.TOP)
    })

    globalShortcut.register('Ctrl+F', () => {
        onKeyMapPressed(KeyMap.FRONT)
    })

    globalShortcut.register('Ctrl+L', () => {
        onKeyMapPressed(KeyMap.LEFT)
    })

    globalShortcut.register('Ctrl+R', () => {
        onKeyMapPressed(KeyMap.RIGHT)
    })

    globalShortcut.register('Ctrl+S', () => {
        onKeyMapPressed(KeyMap.ISO)
    })

    globalShortcut.register('ESC', () => {
        onESCPressed()
    })
}

function onKeyMapPressed(keymap) {
    var data = {
        header: 27,
        content: {
            value: keymap
        }
    }

    var json = JSON.stringify(data);

    if (unityWebsocket != null) {
        unityWebsocket.send(json)
        showLog(json)
    }
}

function onESCPressed() {
    var data = {
        header: 26,
        content: null
    }

    var json = JSON.stringify(data);

    if (unityWebsocket != null) {
        unityWebsocket.send(json)
        showLog(json)
    }
}

/* ============================================================================ */
/*                                   app event                                  */
/* ============================================================================ */
app.whenReady().then(() => {
    util.setProgramStarted()
    initUnityWebsocket()
    setGlobalShortcut()
    createWindow()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        closeProcess()
    }
})

app.on('before-quit', () => {
    closeAllWebsocketServer()
})