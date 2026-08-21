import wsProcessManager from "./wsProcessManager";

export default class wsManager {
    constructor(port, sdms) {
        this.wsProcessManager = new wsProcessManager();
        this.sdms = sdms;

        // WebSocket이 정상적으로 통신하기 위해선 App의 서버가 먼저 실행중이어야 한다.
        const wsUri = "ws://127.0.0.1:" + port + "/";
        this.webSocket = new WebSocket(wsUri);
        this.connected = false;
        this.monitoring = null;

        const wsMgr = this;
        this.messageBuffers = [];

        this.webSocket.onopen = (e) => {
            wsMgr.connected = true;
            wsMgr.checkBuffers();
            wsMgr.sendUrl();
        }

        this.webSocket.onclose = (e) => {
            wsMgr.connected = false;
        }

        this.webSocket.onmessage = (e) => {
            const tokens = e.data.split(',');

            if (tokens.length > 0) {
                const header = parseInt(tokens[0].trim());

                if (header === 0 || header) {
                    const parameters = [];

                    for (let i = 1; i < tokens.length; i++) {
                        parameters.push(tokens[i].trim());
                    }

                    wsMgr.onMessage(header, parameters);
                }
            }
        }

        this.webSocket.onerror = (e) => {
            console.log("webSocket error : " + e.data);
        }
    }

    static webToApp = {
        header: {
            openCCTV: 1,
            showCCTV: 2,
            closeAll: 3,
            closeCCTV: 4,
            requestCCTVList: 5,
            sendUrl: 6
        }
    };

    static appToWeb = {
        header: {
            closeCCTV: 1,
            cctvList: 2
        }
    };

    static prevSendTime = null;

    checkDelayTime(now) {
        if (!wsManager.prevSendTime) {
            return true;
        }

        const diff = now - wsManager.prevSendTime;

        // 50 milli seconds
        if (diff < 50) {
            return false;
        }

        return true;
    }

    sendMessage(header, parameter) {
        if (header === wsManager.webToApp.closeAll ||
            header === wsManager.webToApp.closeCCTV) {
            this._sendMessage(header, parameter);
            return;
        }

        const now = new Date();

        if (this.checkDelayTime(now)) {
            wsManager.prevSendTime = now;
            this._sendMessage(header, parameter);
        }
        else {
            setTimeout(() => this._sendMessage(header, parameter), 50);
        }
    }

    _sendMessage(header, parameter) {
        if (!this.connected) {
            this.messageBuffers.push([header, parameter]);
            return;
        }

        if ((parameter !== 0 && !parameter) || parameter.length === 0) {
            this.webSocket.send(header.toString());
        }
        else {
            this.webSocket.send(header + ", " + parameter);
        }
    }

    checkBuffers() {
        for (const message of this.messageBuffers) {
            this.sendMessage(message[0], message[1]);
        }

        this.messageBuffers = [];
    }

    onMessage(header, parameter) {
        if (header === wsManager.appToWeb.header.closeCCTV) {
            if (parameter && parameter.length > 0) {
                this.wsProcessManager.onCloseCCTV(parameter[0], this);
            }
        }
        else if (header === wsManager.appToWeb.cctvList) {
            if (parameter && parameter.length > 0) {
                this.wsProcessManager.receiveCCTVList(parameter, this);
            }
        }
    }

    openCCTV(guid, userID, markNo, title, sensorZoneHistoryID, x, y, cctv1, cctv2, cctv3, cctv4) {
        this.sendMessage(wsManager.webToApp.header.openCCTV, wsManager.arrayToParameter([guid, userID, markNo, title, sensorZoneHistoryID, x, y, cctv1, cctv2, cctv3, cctv4]));
    }

    showCCTV(userID, visible) {
        this.sendMessage(wsManager.webToApp.header.showCCTV, wsManager.arrayToParameter([userID, visible]));
    }

    closeAll(userID) {
        this.sendMessage(wsManager.webToApp.header.closeAll, wsManager.arrayToParameter([userID]));
    }

    closeCCTV(guid, userID) {
        this.sendMessage(wsManager.webToApp.header.closeCCTV, wsManager.arrayToParameter([guid, userID]));
    }

    requestCCTVList(userID) {
        this.sendMessage(wsManager.webToApp.header.requestCCTVList, wsManager.arrayToParameter([userID]));
    }

    sendUrl() {
        this.sendMessage(wsManager.webToApp.header.sendUrl, wsManager.arrayToParameter([window.location.origin]));
    }

    static arrayToParameter(arr) {
        let parameter = "";
        const len = arr.length;

        for (let i = 0; i < len; i++) {
            const data = arr[i] === null || arr[i] === undefined ? "" : arr[i];

            if (i === 0) {
                parameter = data;
            }
            else {
                parameter += "," + data;
            }
        }

        return parameter;
    }

    close() {
        this.webSocket.close();
    }
}