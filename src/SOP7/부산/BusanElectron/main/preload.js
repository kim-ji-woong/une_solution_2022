const { ipcRenderer } = require('electron')
const log = require('electron-log')

let showLog = (message) => {
    log.info(message)
}

let debug = false
let debugAutoRotate = false
let onUI = false
let passToUI = true;

const Result = {
    NOT_FOUND: 0,
    FOUND: 1,
    MODAL: 2
}

let isModal = false;

let latestActionTime = Date.now();
let timeTerm = 10
let timeCheck = false;
let autoRotation = false;

/* ============================================================================ */
/*                              Process Mouse Event                             */
/* ============================================================================ */
function ignoreMouseEvents() {
    ipcRenderer.send('set-ignore-mouse-events', false)
    onUI = true
}

function passMouseEvents() {
    ipcRenderer.send('set-ignore-mouse-events', true, { forward: true })
    ipcRenderer.send('on3D', true)
    onUI = false
}

function addIgnoreMouseEvents(e) {
    var el = e.target;
    if (debug)
        showLog(`ignore. id: ${el.id}, class: ${el.className}`)
    ignoreMouseEvents()
}

function addPassMouseEvents(e) {
    var el = e.target;
    if (debug)
        showLog(`pass. id: ${el.id}, class: ${el.className}`)
    passMouseEvents()
}

function allowEvent(id) {
    const el = document.getElementById(id)

    if (el == null) {
        return Result.NOT_FOUND
    }

    if (el.classList.contains("event_added")) return Result.FOUND

    el.addEventListener('mouseenter', addPassMouseEvents)
    el.addEventListener('mouseleave', addIgnoreMouseEvents)
    el.classList.add("event_added")

    return Result.FOUND
}

function denyEvent(id) {
    const el = document.getElementById(id)

    if (el == null) {
        return Result.NOT_FOUND
    }

    if (el.classList.contains("event_added")) return Result.FOUND

    el.addEventListener('mouseenter', ignoreMouseEvents)
    el.addEventListener('mouseleave', addPassMouseEvents)
    el.addEventListener('mousemove', ignoreMouseEvents)
    el.classList.add("event_added")

    return Result.FOUND
}

function denyEventByClass(name) {
    const els = document.getElementsByClassName(name)

    if (els.length == 0) {
        return Result.NOT_FOUND
    } else {
        for (let i = 0; i < els.length; i++) {
            const el = els.item(i)

            if (el == null) {
                return Result.NOT_FOUND
            }

            if (el.className.includes("modal")) {
                ignoreMouseEvents()
                return Result.MODAL
            }

            if (el.classList.contains("monitoring")) continue
            if (el.classList.contains("event_added")) continue

            el.addEventListener('mouseenter', addIgnoreMouseEvents)
            el.addEventListener('mouseleave', addPassMouseEvents)
            el.addEventListener('mousemove', addIgnoreMouseEvents)
            el.classList.add("event_added")
        }
        return Result.FOUND
    }
}

function findUIFix() {
    const els = document.getElementsByClassName('UI_Fix')
    
    if (els.length == 0) {
        return Result.NOT_FOUND
    } else {
        return Result.FOUND
    }
}

/* ============================================================================ */
/*                             Process Auto Rotation                            */
/* ============================================================================ */
function checkAutoRotationStart() {
    if (autoRotation)
        return;

    const now = Date.now();

    const difference = (now - latestActionTime) / 1000 / 60;

    if (debugAutoRotate)
        showLog(`time difference: ${difference}`)

    if (difference >= timeTerm) {
        autoRotation = true;

        if(debug)
            showLog("auto rotation true")

        ipcRenderer.send('auto-rotation', true)
    }
}
function checkAutoRotationEnd(e) {
    latestActionTime = Date.now();

    if (debugAutoRotate)
        showLog(`renew latestActionTime: ${latestActionTime}`)

    if (autoRotation) {
        autoRotation = false;

        if (debug)
            showLog("auto rotation false")

        ipcRenderer.send('auto-rotation', false)
    }
}

window.addEventListener("keydown", checkAutoRotationEnd)
window.addEventListener('mousemove',checkAutoRotationEnd)


/* ============================================================================ */
/*                               DOMContentLoaded                               */
/* ============================================================================ */

function onActiveUISignal(evt, payload) {
    if (debug)
        showLog("onActiveUISignal")

    passToUI = true;
}

// 현재 마우스 커서가 UI 위에 있는지에 따라 마우스 이벤트 허용 신호 전달
function onActive3DSignal(evt, payload) {
    if (debug)
        showLog("onActive3DSignal")

    passToUI = false;
    onUI = false;
    passMouseEvents()
}

function onAutoRotationParam(evt, payload) {
    timeCheck = payload.onOff

    if (debug)
        showLog(`auto-rotation: ${timeCheck}`)

    if (timeCheck) {
        timeTerm = payload.time
        showLog(`auto-rotation time: ${timeTerm}`)
    }
}

function detectMouseEvent() {
    if (timeCheck) {
        checkAutoRotationStart();
    }

    if (passToUI) {
        if (!onUI) {
            onUI = true
            if (debug)
                showLog("passToUI!!")
            ipcRenderer.send('set-ignore-mouse-events', false)
        }
    }
    else
    {
        let el = document.getElementById('layoutContainer')

        if (el == null) {
            ignoreMouseEvents()
            if (debug) {
                showLog("main is null")
            }
        }

        else {
            if (findUIFix() == Result.FOUND || denyEventByClass('UI_Section') == Result.MODAL) {
                if (debug)
                    showLog("find ui section")

                isModal = true;
            }

            if (isModal) {
                onActiveUISignal()

                if (debug)
                    showLog(`onUI: on 3d, ${onUI}`)

                isModal = false;
            }
        }
    }
}


window.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.on("activeUI", onActiveUISignal)
    ipcRenderer.on("active3D", onActive3DSignal)
    ipcRenderer.on('auto-rotation', onAutoRotationParam)

    setInterval(detectMouseEvent, 200)
})
