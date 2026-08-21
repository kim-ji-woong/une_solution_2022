import wsProcessManager from "./wsProcessManager";

export default class wsManager {
    constructor(port, sdms) {
        this.sdms = sdms;
        this.port = port;
        
        this.processManager = new wsProcessManager(this.sdms);
        
        const wsUri = "ws://127.0.0.1:" + port + "/";
        this.websocket = new WebSocket(wsUri);
        this.connected = false;
        
        const wsMgr = this;
        this.messageBuffer = [];
        
        this.websocket.onopen = (evt) => {
            wsMgr.connected = true;
            wsMgr.checkBuffers();
            console.log("WebSocket Connection is Opened");
            
            // 로그인 할때 웹소켓 객체 생성 => 로그인 확인 신호 발송
            this.sendCheckLogin();
        }
        
        this.websocket.onclose = (evt) => {
            wsMgr.connected = false;
            console.log("WebSocket Connection is Closed");
        }
        
        this.websocket.onmessage = (evt) => {
            let json = null;
            if (typeof evt.data === "string") {
                try {
                    json = JSON.parse(evt.data);
                } catch (e) {
                    return;
                }
            } else if (typeof evt.data === "object") {
                // Handle object type if necessary
            }
            
            if (json && json.header !== null && json.header !== undefined) {
                const header = json.header;
                const content = json.content || {};
                
                console.log("Received Message : " + json.header + " : " + JSON.stringify(json.content));
                
                this.handleMessage(header, content);
            }
        }
        
        this.websocket.onerror = (evt) => {
            console.log("WebSocket Error : " + evt.data);
        }
    }
    // constructor end
    
    handleMessage = (header, content) => {
        if (header === wsManager.appToWeb.header.SelectPOI) { // 1
            this.processManager.selectPOI(content);
        } else if (header === wsManager.appToWeb.header.RequestSpaceList) { // 11
            this.processManager.responseSpaceList();
        } else if (header === wsManager.appToWeb.header.RequestPOIList) {
            this.processManager.responsePOIList(content);
        } else if (header === wsManager.appToWeb.header.RequestCurrentAlarmBuilding) {
            this.processManager.responseCurrentAlarmBuilding();
        } else if (header === wsManager.appToWeb.header.StartLoading) {
            this.processManager.processingLoading(header, content);
        } else if (header === wsManager.appToWeb.header.UpdateLoading) {
            this.processManager.processingLoading(header, content);
        } else if (header === wsManager.appToWeb.header.EndLoading) {
            this.processManager.processingLoading(header, content);
        }
        
    }
    
    setSDMS = (sdms) => {
        this.sdms = sdms;
        this.processManager = new wsProcessManager(sdms);
    }
    
    getSDMS = () => {
        return this.sdms;
    }
    
    replaceQuotes = (str) => {
        let start = str[0] === '"' ? "'" : str[0];
        let end = str[str.length - 1] === '"' ? "'" : str[str.length - 1];
        let middle = str.substring(1, str.length - 1);
        
        return start + middle + end;
    }
    
    static webToApp = {
        header : {
            MoveToSpace: 1,
            ShowAlarm: 2,
            VisiblePOICategory: 3,
            SelectPOI: 4,
            ResponseSpaceList: 11,
            ResponsePOIList: 12,
            UpdatedSensors: 13,
            POIAlarmSignal: 14,
            
            MoveToInitialScreen: 21, // 초기화면 이동 신호
            RequestCameraLocation: 22,
            Zoom: 23,
            AutoRotation: 24,
            MeasurementMode: 25,
            EndMeasurement: 26,
            ChangeView: 27,
            
            CheckLogin: 31,
            CheckLogout: 32,
            CheckExit: 33,
            CheckMenuState: 34,
            
            ClosePopup: 43,
            ResponseAutoRotationSettings: 44,
            ResponseAlarmLayerSettings: 45
        }
    }
    
    static appToWeb = {
        header : {
            SelectPOI: 1,
            RequestSpaceList: 11,
            RequestPOIList: 12,
            RequestCurrentAlarmBuilding: 13,
            ResponseCameraLocation: 21,
            ResponseMeasuredDistance: 22,
            KeymapProhibited: 23,
            
            // Loading 관련
            StartLoading: 31,
            UpdateLoading: 32,
            EndLoading: 33,
            
            RequestAutoRotationSettings: 42,
            RequestAlarmLayerSettings: 43
        }
    }
    
    sendMessage = (header, parameter) => {
        if (!this.connected) { // 연결이 안되어있으면 무반응
            return;
        }
        
        let json = {
            "header": header
        }
        
        if (parameter !== null && parameter !== undefined) {
            json["content"] = parameter;
        }
        
        this.websocket.send(JSON.stringify(json));
        
    }

    sendMoveToSpace = (spaceId) => { // header: 1
        let parameter = {
            "spaceId": spaceId,
        }
        this.sendMessage(wsManager.webToApp.header.MoveToSpace, parameter);
    }

    sendShowAlarm = () => { // header: 2
        this.sendMessage(wsManager.webToApp.header.ShowAlarm, null);
    }

    sendVisiblePOICategory = (category /*int*/ , visible /* boolean */ ) => { // header: 3
        let parameter = {
            "sensorType": category,
            "value": visible ? 1 : 0
        }
        this.sendMessage(wsManager.webToApp.header.VisiblePOICategory, parameter);
    }
    
    sendSelectPOI = (spaceId, poiId) => { // header: 4
        let parameter = {
            "spaceId": spaceId,
            "POI": {
                "nodeID": poiId
            }
        }
        this.sendMessage(wsManager.webToApp.header.SelectPOI, parameter);
    }
    
    sendResponseSpaceList = (spaceList) => {
        let parameter = {
            "spaces": spaceList
        }
        this.sendMessage(wsManager.webToApp.header.RequestSpaceList, parameter /* array */);
    }
    
    sendResponsePOIList = (spaceID, poiList) => {
        let parameter = {
            "spaceID": spaceID,
            "POIs": poiList
        }
        this.sendMessage(wsManager.webToApp.header.RequestPOIList, parameter);
    }
    
    sendResponseCurrentAlarmBuilding = (spaceID, spaces) => {
        let parameter = {
            "spaceID": spaceID,
            "spaces": spaces
        }
        this.sendMessage(wsManager.webToApp.header.RequestCurrentAlarmBuilding, parameter);
    }
    
    sendPOIAlarmSignal = (spaceID, POIs, isAlarm) => {
        let parameter = {
            "spaceID": spaceID,
            "POIs": POIs, /* array */
            "isAlarm": isAlarm
        }
        this.sendMessage(wsManager.webToApp.header.POIAlarmSignal, parameter);
    }
    
    sendCheckLogin = () => {
        this.sendMessage(wsManager.webToApp.header.CheckLogin, null);
    }
    
    sendCheckLogout = () => {
        this.sendMessage(wsManager.webToApp.header.CheckLogout, null);
    }
    
    sendCheckExit = () => {
        this.sendMessage(wsManager.webToApp.header.CheckExit, null);
    }
    
    checkBuffers = () => {
        for (const message of this.messageBuffer) {
            this.sendMessage(message[0], message[1]);
        }
        
        this.messageBuffer = [];
    }
    
}