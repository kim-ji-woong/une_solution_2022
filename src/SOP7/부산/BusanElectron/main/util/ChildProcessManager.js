const { endianness } = require('os')

const ref = require('ref-napi')
const ffi = require('ffi-napi')

const { exec, spawn } = require('child_process')

const log = require('./logger.js')

// ffi & ref
const GW_STYLE = {
    WS_CLIPSIBLINGS: 0x004000000,
    WS_CLIPCHILDREN: 0x002000000
}

const GWL_EXSTYLE = -16

const voidPtr = ref.refType(ref.types.void)
const stringPtr = ref.refType(ref.types.CString)

const user32 = new ffi.Library('user32', {
    'MoveWindow': ['bool', ['int32', 'int', 'int', 'int', 'int', 'bool']],
    'EnumChildWindows': ['bool', ['int32', voidPtr, 'int32']],
    'GetWindowTextA': ['long', ['long', stringPtr, 'long']],
    'SendMessageA': ['int', ['int32', 'int32', 'int32', 'int32']],
    'SetParent': ['int32', ['int32', 'int32']],
    'GetWindowLongPtrA': ['int32', ['int32', 'int32']],
    'SetWindowLongPtrA': ['int', ['int', 'int', 'int']],
    'SetWindowPos': ['bool', ['long', 'long', 'int', 'int', 'int', 'int', 'uint']]
})

module.exports = class ChildProcessManager {

    #log(message) {
        log.info(`[ChildProcessManager] ${message}`)
    }

    startUnity(hwnd, exedir) {
        this.handler = endianness() == 'LE' ? hwnd.readInt32LE() : hwnd.readInt32BE()

        this.childProcess = spawn(exedir, [
            `-parentHWND ${this.handler} delayed`
        ], {
            windowsVerbatimArguments: true
        });

        const res = user32.GetWindowLongPtrA(this.handler, GWL_EXSTYLE)

        if (!(res & GW_STYLE.WS_CLIPCHILDREN)) {
            user32.SetWindowLongPtrA(this.handler, -16, res ^ GW_STYLE.WS_CLIPCHILDREN ^ GW_STYLE.WS_CLIPSIBLINGS)
        }
    }

    closeUnity() {
        exec(`taskkill /F /im ${this.filename}.exe`)

        if (this.childProcess != null) {
            this.childProcess.kill()
            this.childProcess = null
        }
    }

    embeddingUnity(filename, callbacks) {
        this.filename = filename

        const callback = ffi.Callback('bool', ['int32', 'int32'], (hwnd, param) => {
            const buf = new Buffer.alloc(255)
            user32.GetWindowTextA(hwnd, buf, 255)
            const name = ref.readCString(buf, 0)

            if (name.includes(`${filename}`)) {
                this.hwndClient = hwnd
                user32.SetParent(this.hwndClient, this.handler)
                user32.SendMessageA(this.hwndClient, 0x0006, 1, 0)

                callbacks()

                return false
            }

            return true
        })

        user32.EnumChildWindows(this.handler, callback, null);
    }

    sendActiveMessage() {
        if (this.hwndClient != null) {
            user32.SendMessageA(this.hwndClient, 0x0006, 1, 0)
        } else {
            this.#log("sendActiveMessage(), hwndClient is null")
        }
    }

    sendInactiveMessage() {
        if (this.hwndClient != null) {
            user32.SendMessageA(this.hwndClient, 0x0006, 0, 0)
        } else {
            this.#log("sendInactiveMessage(), hwndClient is null")
        }
    }

    moveWindow(x, y, width, height, redraw) {
        if (this.hwndClient != null) {
            user32.MoveWindow(this.hwndClient, x, y, width, height, redraw)
        } else {
            this.#log("moveWindow(x, y, width, height, redraw), hwndClient is null")
        }
    }

    startExe(dir) {
        return spawn(dir)
    }

    closeExe() {
        exec(`taskkill /F /im ${this.filename}.exe`)
    }
}