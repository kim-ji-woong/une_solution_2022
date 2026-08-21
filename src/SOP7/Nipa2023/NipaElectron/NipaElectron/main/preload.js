const { ipcRenderer } = require('electron')
const log = require('electron-log')

let showLog = (message) => {
    log.info(message)
}

let debug = false
let onUI = true
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

function ignoreMouseEvents() {
    ipcRenderer.send('set-ignore-mouse-events', false)
    onUI = true
}

function passMouseEvents() {
    ipcRenderer.send('set-ignore-mouse-events', true, { forward: true })
    ipcRenderer.send('on3D', true)
    onUI = false
}

function allowEvent(id) {
    const el = document.getElementById(id)

    if (el == null) {
        return Result.NOT_FOUND
    }

    if (el.classList.contains("event_added")) return Result.FOUND

    el.addEventListener('mouseenter', () => {
        if (debug)
            showLog(`pass. id: ${el.id}, class: ${el.className}`)
        passMouseEvents()
    })
    el.addEventListener('mouseleave', () => {
        if (debug)
            showLog(`ignore. id: ${e.id}, class: ${el.className}`)
        ignoreMouseEvents()
    })
    el.classList.add("event_added")

    return Result.FOUND
}

function denyEvent(id) {
    const el = document.getElementById(id)

    if (el == null) {
        return Result.NOT_FOUND
    }

    if (el.classList.contains("event_added")) return Result.FOUND

    el.addEventListener('mouseenter', () => {
        if (debug)
            showLog(`ignore. id: ${e.id}, class: ${el.className}`)
        ignoreMouseEvents()
    })
    el.addEventListener('mouseleave', () => {
        if (debug)
            showLog(`pass. id: ${el.id}, class: ${el.className}`)
        passMouseEvents()
    })
    el.addEventListener('mousemove', () => {
        if (debug)
            showLog(`ignore. id: ${e.id}, class: ${el.className}`)
        ignoreMouseEvents()
    })
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

            el.addEventListener('mouseenter', () => {
                if (debug)
                    showLog(`ignore. id: ${e.id}, class: ${el.className}`)
                ignoreMouseEvents()
            })
            el.addEventListener('mouseleave', () => {
                if (debug)
                    showLog(`pass. id: ${el.id}, class: ${el.className}`)
                passMouseEvents()
            })
            el.addEventListener('mousemove', () => {
                if (debug)
                    showLog(`ignore. id: ${e.id}, class: ${el.className}`)
                ignoreMouseEvents()
            })
            el.classList.add("event_added")
        }
        return Result.FOUND
    }
}

function checkAutoRotation() {
    if (autoRotation)
        return;

    const now = Date.now();

    const difference = (now - latestActionTime) / 1000 / 60;

    if (debug)
        showLog(`time difference: ${difference}`)

    if (difference >= timeTerm) {
        autoRotation = true;

        if(debug)
            showLog("auto rotation true")

        ipcRenderer.send('auto-rotation', true)
    }

}

window.addEventListener("keydown", (e) => {
    latestActionTime = Date.now();

    if (debug)
        showLog(`keydown event: ${latestActionTime}`)

    if (autoRotation) {
        autoRotation = false;

        if (debug)
            showLog("auto rotation false")

        ipcRenderer.send('auto-rotation', false)
    }
})

window.addEventListener('mousemove', (event) => {
    latestActionTime = Date.now();

    if (debug)
        showLog(`mousemove event: ${latestActionTime}`)

    if (autoRotation) {
        autoRotation = false;

        if (debug)
            showLog("auto rotation false")

        ipcRenderer.send('auto-rotation', false)
    }
})

window.addEventListener('DOMContentLoaded', (event) => {
    ipcRenderer.on("passTo3D", (evt, payload) => {
        passToUI = false;
        onUI = false;

        if (debug)
            showLog("passTo3D")
    })


    ipcRenderer.on("passToUI", (evt, payload) => {
        passToUI = true;
    })

    ipcRenderer.on("mode", (evt, payload) => {
        mode = payload.mode
    })

    ipcRenderer.on("camera", (evt, payload) => {
        camera = payload.camera
    })

    ipcRenderer.on("isOnUI", (evt, payload) => {
        ipcRenderer.send("isOnUI", { value: onUI })

        if (onUI) {
            ipcRenderer.send('set-ignore-mouse-events', false)

            if (debug)
                showLog(`onUI: on ui, ${onUI}`)
        } else {
            ipcRenderer.send('set-ignore-mouse-events', true, { forward: true })
            ipcRenderer.send('on3D', true)

            if (debug)
                showLog(`onUI: on 3d, ${onUI}`)
        }
    })

    ipcRenderer.on("active3D", (evt, payload) => {
        passMouseEvents()

        if (debug)
            showLog("active3D")
    })

    ipcRenderer.on('auto-rotation', (evt, payload) => {
        timeCheck = payload.onOff

        if (debug)   
            showLog(`auto-rotation: ${timeCheck}`)

        if (timeCheck) {
            timeTerm = payload.time
            showLog(`auto-rotation time: ${timeTerm}`)
        }
    })

    setInterval(
        function () {
            if (!onUI) {
                if(debug)
                    showLog("on 3D : allow click")
                ipcRenderer.send('on3D', true)
            }
        }, 50
    )

    setInterval(
        function ()
        {
            if(timeCheck)
                checkAutoRotation();

            if (passToUI) {
                if (debug)
                    showLog("passToUI!!")
                ipcRenderer.send('set-ignore-mouse-events', false)
                return;
            }

            let el = document.getElementById('layoutContainer')

            if (el == null) {
                ignoreMouseEvents()
                if (debug)
                    showLog("layoutContainer is null")
                return
            }

            if (denyEventByClass('UI_Section') == Result.MODAL) {
                isModal = true;
                return;
            }
            else if (isModal) {
                ipcRenderer.send('set-ignore-mouse-events', true, { forward: true })
                ipcRenderer.send('on3D', true)

                if (debug)
                    showLog(`onUI: on 3d, ${onUI}`)

                isModal = false;
            }
        }, 200
    )
})
