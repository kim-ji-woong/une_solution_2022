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
function showLog (message) {
    log.info(message)
}

/* ============================================================================ */
/*                             ChildProcessManager                              */
/* ============================================================================ */
const ChildProcessManager = require('./util/ChildProcessManager.js')
const childProcessManager = new ChildProcessManager()
let mainWindow = null, childWindow = null
let childWindowResized = false

/* ============================================================================ */
/*                               Ipc Communication                              */
/* ============================================================================ */
const { ipcMain } = require('electron')

ipcMain.on('auto-rotation', (evt, payload) => {
    sendAutoRotationSignal(payload)
})

ipcMain.on('on3D', (evt, payload) => {
    childProcessManager.sendActiveMessage()
})

function sendActiveUISignal(state) {
    childWindow.webContents.send("activeUI", { value: state });
}

function sendPassTo3DSignal() {
    // childWindow.webContents.send("passTo3D", { value: state });
    // childWindow.webContents.send("active3D", { value: state });
    childWindow.webContents.send("active3D", { value: true });
    childProcessManager.sendActiveMessage()
}

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

function loadWebfront() {
    childWindow.loadURL(preferenceManager.webfrontUrl).catch((error) => {
        util.onError('Error', error.code)
    })

    childWindow.webContents.setZoomFactor(preferenceManager.zoomFactor)
    childWindow.webContents.setVisualZoomLevelLimits(preferenceManager.zoomLimitMin, preferenceManager.zoomLimitMax)

    childWindow.on('ready-to-show', () => {
        subscribe()
        resizeChildWindow()

        const ses = childWindow.webContents.session
        util.clearWebData(ses)

        childWindow.setBackgroundColor("#00000000")
        childWindow.show();

        ipcMain.on('set-ignore-mouse-events', (event, ...args) => {
            const win = BrowserWindow.fromWebContents(event.sender)
            win.setIgnoreMouseEvents(...args)
        })

        sendPassTo3DSignal()
    })

    childWindow.on('focus', () => {
        childProcessManager.sendInactiveMessage()
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
    if (!childWindowResized) {
        setTimeout(onConnectionWithUnity, 2000)
    } else {
        loadWebfront()
        return
    }

    childProcessManager.embeddingUnity(preferenceManager.unityFilename, resizeChildWindow);
}

/* ============================================================================ */
/*                       Child Window State Changed Event                       */
/* ============================================================================ */
function resizeChildWindow() {
    childWindowResized = true

    const parentContentBounds = mainWindow.getContentBounds()

    childProcessManager.moveWindow(0, 0, parentContentBounds.width, parentContentBounds.height, false)

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

    childProcessManager.moveWindow(0, 0, parentContentBounds.width, parentContentBounds.height, false)

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

    childProcessManager.sendInactiveMessage()
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
    if (!close_phase) {
        close_phase = true
        ipcMain.removeAllListeners()
        childProcessManager.closeUnity()
        app.quit()
    }
}

/* ============================================================================ */
/*                               Custom Functions                               */
/* ============================================================================ */

// 일렉트론에서 자동 회전이 감지되었을 때 동작
function sendAutoRotationSignal(result) {
    if (result) {
        showLog("[electron] 15, 1")
        unityWebsocket.send('15,1')
    } else {
        showLog("[electron] 15, 0")
        unityWebsocket.send('15,0')
    }
}

// 단축키 기능 추가
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
        showLog("Ctrl T pressed")
    })
}

/* ============================================================================ */
/*                                   app event                                  */
/* ============================================================================ */
app.whenReady().then(() => {
    util.setProgramStarted()
    setGlobalShortcut()
    createWindow()
    childProcessManager.startUnity(mainWindow.getNativeWindowHandle(), preferenceManager.unityExeFullPath)

    setTimeout(onConnectionWithUnity, 5000)
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
})