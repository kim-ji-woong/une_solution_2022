module.exports = class DevFunctionManager {
    constructor(preferenceManager, childWindow) {
        this.preferenceManager = preferenceManager
    }

    #log(message) {
        log.info(`[DevFunctionManager] ${message}`)
    }

    zoomIn() {
        var zoomFactor = this.preferenceManager.zoomIn()
        childWindow.webContents.setZoomFactor(zoomFactor)
        this.#log(`change zoom: ${zoomFactor}`)
    }

    zoomOut() {
        var zoomFactor = this.preferenceManager.zoomOut()
        childWindow.webContents.setZoomFactor(zoomFactor)
        showLog(`change zoom: ${zoomFactor}`)
    }
}