const { join } = require('path')
const fs = require('fs')
const log = require('./logger.js')


module.exports = class PreferenceManager {
    constructor() {
        this.#setSettingFilePath()
        this.settings = require(this._settingFilePath)

        this.#setUnityExePath(this.settings.unity.dir)

        this.#setZoomFactor()

        this._zoomLimit = [1.0, 5.0]
        this._zoomAmount = 0.01
    }

    #log(message) {
        log.info(`[PreferenceManager] ${message}`)
    }

    // settings.json 경로 설정
    #setSettingFilePath() {
        this.#log(__dirname)
        this._settingFilePath = join(__dirname, "..", "..", '/settings/settings.json')
        if (!fs.existsSync(this._settingFilePath)) {
            this._settingFilePath = join(__dirname, "..", "..", "..", "..", '/settings/settings.json')
        }
        this.#log(`settings.json path: ${this._settingFilePath}`)
    }

    // unity exe 경로 설정
    #setUnityExePath(unityDir) {
        this._unityExePath = join(__dirname, "..", "..", unityDir)
        if (!fs.existsSync(this._unityExePath)) {
            this._unityExePath = join(__dirname, "..", "..", "..", "..", unityDir)
        }
        this.#log(`unity exe path: ${this._unityExePath}`)
    }

    // preload.js 파일 경로 설정
    #setPreloadFilePath(basePath) {
        var preloadDir = this.settings.project.preload

        this.preloadFilePath = join(basePath, preloadDir)
        if (!fs.existsSync(this.preloadFilePath)) {
            this.preloadFilePath = join(basePath, "main", preloadDir)
        }
        this.#log(`preload file path: ${this.preloadFilePath}`)
    }

    // zoom factor 설정
    #setZoomFactor() {
        this._zoomFactor = this.settings.webfront.zoomFactor

        try {
            this._zoomFactor = this._zoomFactor * 1
        } catch {
            this._zoomFactor = 1.0
        }
    }

    // path
    get unityExeFullPath() {
        return `${this._unityExePath}/${this.settings.unity.filename}.exe`
    }
    get unityFilename() {
        return this.settings.unity.filename
    }

    // webfront
    get webfrontUrl() {
        return this.settings.webfront.url
    }
    get backgroundColor() {
        var color = this.settings.project.color

        if (color == null) {
            color = "#000000"
        }

        return color
    }

    // zoom
    get zoomFactor() {
        return this._zoomFactor
    }
    set zoomFactor(value) {
        if (value < this._zoomLimit[0] || value > this._zoomLimit[1]) return;

        this._zoomFactor = value
    }
    get zoomLimitMin() {
        return this._zoomLimit[0]
    }
    get zoomLimitMax() {
        return this._zoomLimit[1]
    }

    zoomOut() {
        this.zoomFactor -= this._zoomAmount

        return this.zoomFactor
    }

    zoomIn() {
        this.zoomFactor += this._zoomAmount

        return this.zoomFactor
    }

    // websocket communication
    get unityPort() {
        return this.settings.websocket.unity
    }
    get UIPort() {
        return this.settings.websocket.web
    }


    // isDev
    get isDev() {
        return this.settings.dev
    }

    // browserWindow options
    getMainWindowSettings() {
        return {
            titleBarStyle: 'hidden',
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            },
            autoHideMenuBar: true,
            kiosk: true,
            fullscreen: true,
            thickFrame: false,
            minimizable: false,
            closable: false
        }
    }

    getChildWindowSettings(baseDir) {
        this.#setPreloadFilePath(baseDir)

        return {
            useContentSize: false,
            modal: false,
            transparent: true,
            frame: false,
            movable: false,
            resizable: false,
            webPreferences: {
                nativeWindowOpen: true,
                nodeIntegration: true,
                preload: this.preloadFilePath
            },
            autoHideMenuBar: true,
            fullscreen: true,
            enableLargerThanScreen: true,
            thickFrame: false,
            minimizable: false,
            closable: false
        }
    }
}