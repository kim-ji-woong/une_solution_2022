/*
 * util.js
 * 최초 작성 2024-04-08
 * settings.json, unity.exe, preload.js 파일 경로를 찾아 설정한다
 * BrowserWindow 생성 시 설정값 반환한다
 */
const log = require('./logger.js')
const { dialog } = require('electron')

module.exports = class Util {
    error = false
    isStart = false

    #log(message) {
        log.info(`[Util] ${message}`)
    }

    setErrorCallback(value) {
        this._errorCallback = value
    }

    onError(title = "Error", message) {
        if (this._errorCallback != null) {
            this._errorCallback()
        }

        if (!this.error) {
            this.error = true

            this.#log(message)
            dialog.showErrorBox(title, message)
        }
    }

    setTimeoutCallback(value) {
        this._timeoutCallback = value
    }

    setProgramStarted() {
        this.isStart=true
    }

    onTimeout() {
        if (!this.isStart) {
            this.error = true

            this.#log("프로그램이 정상적으로 실행되지 않았습니다. 프로그램을 재 실행해 주세요.")
            dialog.showErrorBox("Error", "프로그램이 정상적으로 실행되지 않았습니다. 프로그램을 재 실행해 주세요.")

            this._timeoutCallback()
        }
    }

    clearWebData(ses) {
        this.#log("Clear web data")
        ses.clearCache()
            .then(() => {
            })

        ses.clearStorageData()
            .then(() => {
            })

        ses.clearAuthCache()
            .then(() => {
            })

        ses.clearHostResolverCache()
            .then(() => {
            })

        ses.cookies.get({})
            .then((cookies) => {
                for (let cookie in cookies) {
                    ses.cookies.remove(cookie.url, cookie.name)
                }
            }).catch((error) => {
                this.#log("error in clearning cookies", error)
            })
    }
}
