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
            return this.processManager.selectPOI(content);
        } else if (header === wsManager.appToWeb.header.RequestSpaceList) { // 11
            return this.processManager.responseSpaceList(this);
        } else if (header === wsManager.appToWeb.header.RequestPOIList) {
            return this.processManager.responsePOIList(this);
        } else if (header === wsManager.appToWeb.header.RequestCurrentAlarmBuilding) {
            return this.processManager.responseCurrentAlarmBuilding();
        } else if (header === wsManager.appToWeb.header.StartLoading) {
            return this.processManager.startLoading();
        } else if (header === wsManager.appToWeb.header.UpdateLoading) {
            return this.processManager.processingLoading(content.value);
        } else if (header === wsManager.appToWeb.header.EndLoading) {
            return this.processManager.endLoading();
        } else if (header === wsManager.appToWeb.header.ResponseCameraLocation) {
            return this.processManager.responseCameraLocation(content);
        } else if (header === wsManager.appToWeb.header.ResponseMeasuredDistance) {
            return this.processManager.responseMeasuredDistance(content);
        } else if (header === wsManager.appToWeb.header.KeymapProhibited) {
            return this.processManager.responseKeymapProhibited();
        } else if (header === wsManager.appToWeb.header.RequestAutoRotationSettings) {
            return this.processManager.responseAutoRotationSettings();
        } else if (header === wsManager.appToWeb.header.RequestAlarmLayerSettings) {
            return this.processManager.responseAlarmLayerSettings();
        } else if (header === wsManager.appToWeb.header.SendDiffusionHoursInfo) {
            return this.processManager.responseDiffusionHoursInfo(header, content);
        } else if (header === wsManager.appToWeb.header.ResponseDiffusionData) {
            return this.processManager.responseDiffusionHoursInfo(header, content);
        }
        
    }
    
    setSDMS = (sdms) => {
        this.sdms = sdms;
        this.processManager = new wsProcessManager(sdms);
    }
    
    getSDMS = () => {
        return this.sdms;
    }
    
    getTitleBar = () => {
        return this.titleBar;
    }
    
    setTitleBar = (titleBar) => {
        this.titleBar = titleBar;
        if (!this.processManager.getTitleBar()) {
            this.processManager.setTitleBar(titleBar);
        }
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
            CheckDataReady: 35,
            
            ClosePopup: 43,
            ResponseAutoRotationSettings: 44,
            ResponseAlarmLayerSettings: 45,
            
            DiffusionSimulationMode: 51,
            SendDiffusionInfo: 52,
            PlayDiffusionSimulation: 53,
            StopDiffusionSimulation: 54,
            DiffusionSimulationTimeChanged: 55,
            DiffusionHeightVisibleCategory: 56,
            
        }
    }
    
    static appToWeb = {
        header : {
            SelectPOI: 1,
            MoveToIndoor: 2,
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
            RequestAlarmLayerSettings: 43,
            
            SendDiffusionHoursInfo: 51,
            ResponseDiffusionData: 52,
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

    sendMoveToSpace = (spaceID) => { // header: 1
        let parameter = {
            "spaceID": spaceID,
        }
        this.sendMessage(wsManager.webToApp.header.MoveToSpace, parameter);
    }

    sendShowAlarm = (spaceID, pois) => { // header: 2
        let parameter = {
            "spaceID": spaceID,
            "POIs": pois
        }
        this.sendMessage(wsManager.webToApp.header.ShowAlarm, parameter);
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
            "spaceID": spaceId,
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
        this.sendMessage(wsManager.webToApp.header.ResponseSpaceList, parameter /* array */);
    }
    
    sendResponsePOIList = (parameter) => {
        this.sendMessage(wsManager.webToApp.header.ResponsePOIList, parameter);
    }
    
    sendMoveToInitialScreen = (parameter) => {
        this.sendMessage(wsManager.webToApp.header.MoveToInitialScreen, parameter);
    }
    
    sendRequestCameraLocation = () => {
        this.sendMessage(wsManager.webToApp.header.RequestCameraLocation, null);
    }

    // 23
    sendZoom = (parameter) => {
        this.sendMessage(wsManager.webToApp.header.Zoom, parameter);
    }

    // 24
    sendAutoRotation = (parameter) => {
        this.sendMessage(wsManager.webToApp.header.AutoRotation, parameter);
    }
    
    //25
    sendMeasurementMode = (parameter) => {
        this.sendMessage(wsManager.webToApp.header.MeasurementMode, parameter);
    }
    
    // 31
    sendCheckLogin = () => {
        this.sendMessage(wsManager.webToApp.header.CheckLogin, null);
    }
    
    // 32
    sendCheckLogout = () => {
        this.sendMessage(wsManager.webToApp.header.CheckLogout, null);
    }
    
    sendCheckExit = () => {
        this.sendMessage(wsManager.webToApp.header.CheckExit, null);
    }
    
    // 33
    checkBuffers = () => {
        for (const message of this.messageBuffer) {
            this.sendMessage(message[0], message[1]);
        }
        
        this.messageBuffer = [];
    }
    
    // 34
    sendCheckMenuState = (parameter) => {
        this.sendMessage(wsManager.webToApp.header.CheckMenuState, parameter);
    }
    
    // 35
    sendCheckDataReady = () => {
        this.sendMessage(wsManager.webToApp.header.CheckDataReady, null);
    }
    
    // 43 
    sendClosePopup = () => {
        this.sendMessage(wsManager.webToApp.header.ClosePopup, null);
    }
    
    /* SDMS에서 알람 리스트가 업데이트 될때마다 전송 */
    sendUpdatedPOIs = () => {
        return this.processManager.responsePOIList(this);
    }
    
    // 44
    sendResponseAutoRotationSettings = (parameter) => {
        this.sendMessage(wsManager.webToApp.header.ResponseAutoRotationSettings, parameter);
    }
    
    // 45
    sendResponseAlarmLayerSettings = (parameter) => {
        this.sendMessage(wsManager.webToApp.header.ResponseAlarmLayerSettings, parameter);
    }
    
    /*
    * Spread Simulation 관련 
    */
    
    // 51
    sendDiffusionSimulationMode = (parameter) => { // value int : 0: off, 1: on
        this.sendMessage(wsManager.webToApp.header.DiffusionSimulationMode, parameter ? 1 : 0);
    }
    
    // 52 날짜와 타입을 받아서 확산정보를 전송
    sendDiffusionInfo = (parameter) => { // parameter: { "date" , "type" }
        this.sendMessage(wsManager.webToApp.header.SendDiffusionInfo, parameter);
    }
    
    // 53 재생 
    sendPlayDiffusionSimulation = () => {
        this.sendMessage(wsManager.webToApp.header.PlayDiffusionSimulation, null);
    }
    
    // 54 정지
    sendStopDiffusionSimulation = () => {
        this.sendMessage(wsManager.webToApp.header.StopDiffusionSimulation, null);
    }
    
    // 55 시간 변경 
    sendDiffusionSimulationTimeChanged = (parameter) => { // parameter: strInt (00)
        this.sendMessage(wsManager.webToApp.header.DiffusionSimulationTimeChanged, parameter);
    }
    
    // 56 고도 선택 상태 전달
    sendDiffusionHeightVisibleCategory = (parameter) => { // parameter: { heightType: int, value: int }
        this.sendMessage(wsManager.webToApp.header.DiffusionHeightVisibleCategory, parameter);
    }
}