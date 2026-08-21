const { endianness } = require('os')

const log = require('electron-log')

const ref = require('ref-napi')
const ffi = require('ffi-napi')

const { exec, spawn } = require('child_process')

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

let embedding_type = null;

let childProcess = null;
let hwndClient = null;
let handler = null;

const close_unity_2 = (filename) => {
    exec(`taskkill /F /im ${filename}.exe`)
}

// for unity
const start_unity = (hwnd, exedir) => {
    handler = endianness() == 'LE' ? hwnd.readInt32LE() : hwnd.readInt32BE()

    childProcess = spawn(exedir, [
        `-parentHWND ${handler} delayed`
    ], {
        windowsVerbatimArguments: true
    });

    const res = user32.GetWindowLongPtrA(handler, GWL_EXSTYLE)

    if (!(res & GW_STYLE.WS_CLIPCHILDREN)) {
        user32.SetWindowLongPtrA(handler, -16, res ^ GW_STYLE.WS_CLIPCHILDREN ^ GW_STYLE.WS_CLIPSIBLINGS)
    }
}

const start_painter = (hwnd, callbacks) => {
    let handle = endianness() == 'LE' ? hwnd.readInt32LE() : hwnd.readInt32BE()

    let painterProcess = spawn('C:/Users/Dev2/AppData/Local/Microsoft/WindowsApps/Microsoft.Paint_8wekyb3d8bbwe/mspaint.exe');
    let hwnd_client = null

    const res = user32.GetWindowLongPtrA(handler, GWL_EXSTYLE)

    if (!(res & GW_STYLE.WS_CLIPCHILDREN)) {
        user32.SetWindowLongPtrA(handle, -16, res ^ GW_STYLE.WS_CLIPCHILDREN ^ GW_STYLE.WS_CLIPSIBLINGS)
    }

    const callback = ffi.Callback('bool', ['int32', 'int32'], (hwnd, param) => {
        const buf = new Buffer.alloc(255)
        user32.GetWindowTextA(hwnd, buf, 255)
        const name = ref.readCString(buf, 0)

        if (name.includes(`${filename}`)) {
            hwnd_client = hwnd
            user32.SetParent(hwnd_client, handler)
            user32.SendMessageA(hwnd_client, 0x0006, 1, 0)

            callbacks()

            return false
        }

        return true
    })

    user32.EnumChildWindows(handler, callback, null);
}


const embedding_unity = (filename, callbacks) => {
    const callback = ffi.Callback('bool', ['int32', 'int32'], (hwnd, param) => {
        const buf = new Buffer.alloc(255)
        user32.GetWindowTextA(hwnd, buf, 255)
        const name = ref.readCString(buf, 0)

        if (name.includes(`${filename}`)) {
            hwndClient = hwnd
            user32.SetParent(hwndClient, handler)
            user32.SendMessageA(hwndClient, 0x0006, 1, 0)

            callbacks()

            return false
        }

        return true
    })

    user32.EnumChildWindows(handler, callback, null);
}

const close_unity = (filename) => {
    exec(`taskkill /F /im ${filename}.exe`)

    if (childProcess != null) {
        childProcess.kill()
    }
}

// for unreal
const start_unreal = (hwnd, exedir) => {
    handler = endianness() == 'LE' ? hwnd.readInt32LE() : hwnd.readInt32BE()

    childProcess = execFile(exedir, [`-FULLSCREEN`], {});

    const res = user32.GetWindowLongPtrA(handler, GWL_EXSTYLE)

    if (!(res & GW_STYLE.WS_CLIPCHILDREN)) {
        user32.SetWindowLongPtrA(handler, -16, res ^ GW_STYLE.WS_CLIPCHILDREN ^ GW_STYLE.WS_CLIPSIBLINGS)
    }
}

const embedding_unreal = (filename, callbacks) => {
    const callback = ffi.Callback('bool', ['int32', 'int32'], (hwnd, param) => {
        const buf = new Buffer.alloc(255)
        user32.GetWindowTextA(hwnd, buf, 255)
        const name = ref.readCString(buf, 0)

        if (name.includes(`${filename}`)) {
            hwndClient = hwnd
            user32.SetParent(hwndClient, handler)

            user32.GetWindowLongPtrA(hwnd, GWL_EXSTYLE)
            user32.SendMessageA(hwndClient, 0x0006, 1, 0)

            callbacks()

            return false
        }

        return true
    })

    user32.EnumChildWindows(null, callback, null);
}

// start exe
const start_exe = (dir) => {
    return spawn(dir);
}

const close_unreal = (filename) => {
    exec(`taskkill /F /im ${filename}.exe`)
    childProcess.kill()
    process.kill(childProcess.pid)
}

// SendMessageA
const send_active_message = () => {
    user32.SendMessageA(hwndClient, 0x0006, 1, 0)
}

const send_inactive_message = () => {
    user32.SendMessageA(hwndClient, 0x0006, 0, 0)
}

// MoveWindow
const move_window = (x, y, width, height, redraw = false) => {
    user32.MoveWindow(hwndClient, x, y, width, height, redraw)
}

module.exports = {
    set_embedding_type: function (type) {
        if (type == 'UNITY') {
            embedding_type = type;
        } else if (type == 'UNREAL') {
            embedding_type = type;
        } else {
            log.info("[embedding.js] set_embedding_type, unexpected type: ", type)
        }
    },
    start_3D: function (hwnd, exedir) {
        if (embedding_type == 'UNITY') {
            start_unity(hwnd, exedir);
        } else if (embedding_type == 'UNREAL') {
            start_unreal(hwnd, exedir);
        } else {
            log.info("[embedding.js] start_3D, unexpected type: ", type)
        }
    },
    close_3D: function (filename, type = 'UNITY') {
        if (embedding_type == 'UNITY') {
            close_unity(filename);
        } else if (embedding_type == 'UNREAL') {
            close_unreal(filename);
        } else {
            log.info("[embedding.js] close_3D, unexpected type: ", type)
        }
    },
    embedding_3D: function (filename, callback) {
        if (embedding_type == 'UNITY') {
            embedding_unity(filename, callback)
        } else if (embedding_type == 'UNREAL') {
            embedding_unreal(filename, callback)
        } else {
            log.info("[embedding.js] embedding_3D, unexpected type: ", type)
        }
    },
    send_active_message: function () {
        if (hwndClient != null) {
            send_active_message()
        } else {
            log.info("[embedding.js] send_active_message, hwndClient is null")
        }
    },
    send_inactive_message: function () {
        if (hwndClient != null) {
            send_inactive_message()
        } else {
            log.info("[embedding.js] send_inactive_message, hwndClient is null")
        }
    },
    move_window: function (x, y, width, height, redraw) {
        if (hwndClient != null) {
            move_window(x, y, width, height, redraw)
        } else {
            log.info("[embedding.js] move_window, hwndClient is null")
        }
    },
    start_exe: function (dir) {
        return start_exe(dir)
    }
}