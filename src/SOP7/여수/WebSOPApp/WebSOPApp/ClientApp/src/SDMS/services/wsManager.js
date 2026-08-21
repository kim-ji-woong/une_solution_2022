import wsProcessManager from "./wsProcessManager";

export default class wsManager {
    constructor(port, sdms) {
        this.sdms = sdms;

        this.processManager = new wsProcessManager(sdms);

        // WebSocket이 정상적으로 통신하기 위해선 App의 서버가 먼저 실행중이어야 한다.
        const wsUri = "ws://127.0.0.1:" + port + "/";
        this.webSocket = new WebSocket(wsUri);
        this.connected = false;

        const wsMgr = this;
        this.messageBuffers = [];

        this.webSocket.onopen = (e) => {
            console.log("WebSocket Connection Opened");
            wsMgr.connected = true;
            wsMgr.checkBuffers();
        }

        this.webSocket.onclose = (e) => {
            console.log("WebSocket Connection Closed");
            wsMgr.connected = false;
        }

        this.webSocket.onmessage = (e) => {
            const tokens = e.data.split(',');

            if (tokens.length > 0) {
                const header = parseInt(tokens[0].trim());

                if (header === 0 || header) {
                    const parameters = [];

                    for (let i = 1; i < tokens.length; i++) {
                        parameters.push(tokens[i].trim().replace(/['""]/g, ''));
                    }

                    const isErrorOnMessage = wsMgr.onMessage(header, parameters);

                    if (isErrorOnMessage[0]) {
                        return isErrorOnMessage;
                    } else {
                        return;
                    }

                }
            }
        }

        this.webSocket.onerror = (e) => {
            console.log("webSocket error : " + e.data);
        }
    }

    static webToApp = {
        header: {
            /************Data***********/
            // DB에 저장된 처음 시작 좌표값을 전달함
            responseStartTransform: 11,
            // DB에 저장된 Sensor List를 전달함
            responseSensorList: 12,
            // WeatherData 
            responseWeather: 13,
            // 현재의 Viewport 좌표값을 요청함(현재의 Viewport를 DB에 저장하기 위함)
            requestCameraLocation: 14,

            /********InterAction********/
            // 자동회전 시간 
            autoRotationTime: 19,
            // 특정 센서의 위치로 카메라가 이동함
            // moveCameraToSensor: 21,
            selectPOI: 21,
            // 처음 시작 위치 , 구역 별 상공
            moveCameraToTarget: 22,
            // Zoom
            zoomCamera: 23,
            // 알람 위치로 이동, 알람 효과 표시
            onAlarm: 24,
            // POI 분류 및 Show Hide
            showPOI: 25,
            // 선택된 POI의 크기를 살짝 키운다. (이동X)
            
            // 각 센서의 알람 여부 리스트 전송
            sendAlarmInfo: 26,
            
            // 3D 패널 정보 전달
            sendPanels: 27,

            /***********State***********/
            // 로그인 여부
            checkLogin: 31,
            // 일반 , X-Ray모드
            changeViewMode: 32,
            // 자동 회전
            setAutoRotaion: 33,
            // POI 편집 모드 (상태 , Add일경우 Type 아니면 null)
            setWeatherOption: 34,

            // 시스템 종료 헤더
            shutDownSystem: 100,

        }
    };

    static appToWeb = {
        header: {

            /*********InterAction*********/
            // 선택한 센서의 ID를 UI로 전달함
            selectPOI: 21,
            // 클릭된 센서의 위치를 볼 수 있는 360 이미지 팝업창을 출력함
            show360Image: 22,

            /***********Data***********/
            // DB에 저장된 처음 시작 위치 좌표를 요청함
            requestStartTransform: 11,
            // 센서 리스트를 요청함
            requestSensorList: 12,
            // 날씨 정보를 요청함
            requestWeatherData: 13,
            // 현재의 Viewport 좌표값을 전달함(현재의 ViewPort를 DB에 저장하기 위함)
            responseCameraLocation: 14,

            // 테스트 시연 요청 헤더
            responseTestSensor: 50,
            responseTestSensorSMS: 51,
        }
    };

    sendMessage(header, parameter) {
        if (!this.connected) {
            this.messageBuffers.push([header, parameter]);
            return;
        }

        if (!parameter || parameter.length === 0) {
            if (parameter === 0 || parameter === false) {
                this.webSocket.send(header.toString() + ", " + parameter);
            } else {
                this.webSocket.send(header.toString());
            }
        } else {
            this.webSocket.send(header + ", " + parameter);
        }
    }

    checkBuffers() {
        for (const message of this.messageBuffers) {
            this.sendMessage(message[0], message[1]);
        }

        this.messageBuffers = [];
    }

    async onMessage(header, parameter) {
        console.log("onMessage : " + "header : " + header + " / " + "parameter : " + parameter);
        if (header === wsManager.appToWeb.header.responseCameraLocation) { // 14
            const isErrorRequest = await this.processManager.onResponseViewport(parameter);
            if (isErrorRequest === undefined || isErrorRequest === null) {
                return isErrorRequest;
            }
            if (!isErrorRequest[0]) {
                return isErrorRequest;
            }
        }
        else if (header === wsManager.appToWeb.header.requestStartTransform) { // 11
            this.processManager.onRequestViewport(this);
        }
        else if (header === wsManager.appToWeb.header.requestSensorList) { // 12
            this.processManager.onRequestSensorList(this);
        } else if (header === wsManager.appToWeb.header.selectPOI) { // 21
            this.processManager.onSelectPOI(this, parameter);
        } else if (header === wsManager.appToWeb.header.show360Image) { // 22

        } else if (header === wsManager.appToWeb.header.requestWeatherData) { // 13
            this.processManager.onRequestWeatherData(this);
        } else if (header === wsManager.appToWeb.header.responseTestSensor) {
            this.processManager.onRequestTestSensor(this, parameter);
        } else if (header === wsManager.appToWeb.header.responseTestSensorSMS) {
            this.processManager.onRequestTestSensorSMS(this);
        }
    }

    sendPanels(panelDatas) {
        this.sendMessage(wsManager.webToApp.header.sendPanels, panelDatas)
    }

    requestCameraLocation() {
        this.sendMessage(wsManager.webToApp.header.requestCameraLocation, null);
    }

    responseWeather(weather, degree, sunrise, sunset, windSpeed, windDirection, precipitation, cloudAmount) {
        this.sendMessage(wsManager.webToApp.header.responseWeather, wsManager.arrayToParameter([weather, degree, sunrise, sunset, windSpeed, windDirection, precipitation, cloudAmount]));
    }

    responseStartTransform(posX, posY, posZ, rotationX, rotationY, rotationZ) {
        this.sendMessage(wsManager.webToApp.header.responseStartTransform, wsManager.arrayToParameter([posX, posY, posZ, rotationX, rotationY, rotationZ]));
    }

    responseSensorList(result) {
        this.sendMessage(wsManager.webToApp.header.responseSensorList, result);
    }

    //moveCameraToSensor(sensorID) {
    //    this.sendMessage(wsManager.webToApp.header.moveCameraToSensor, sensorID);
    //}

    selectPOI(sensorID, isAlarm, isFromStatusinfo) {
        this.sendMessage(wsManager.webToApp.header.selectPOI, wsManager.arrayToParameter([sensorID, isAlarm, isFromStatusinfo]));
    }

    moveCameraToTarget(sector) {
        this.sendMessage(wsManager.webToApp.header.moveCameraToTarget, sector);
    }

    zoomCamera(zoom) {
        this.sendMessage(wsManager.webToApp.header.zoomCamera, zoom ? 1 : 0);
    }

    onAlarm(sensorID, alarmState) {
        this.sendMessage(wsManager.webToApp.header.onAlarm, wsManager.arrayToParameter([sensorID, alarmState]));
    }

    showPOI(poiType, poiShow) {
        this.sendMessage(wsManager.webToApp.header.showPOI, wsManager.arrayToParameter([poiType, poiShow]));
    }
    
    sendAlarmInfo(alarmInfoList) {
        this.sendMessage(wsManager.webToApp.header.sendAlarmInfo, alarmInfoList);
    }

    //selectPOI(sensorID, isAlarm) {
    //    this.sendMessage(wsManager.webToApp.header.selectPOI, wsManager.arrayToParameter([sensorID, isAlarm]));
    //}

    checkLogin(loginState) {
        this.sendMessage(wsManager.webToApp.header.checkLogin, loginState);
    }

    changeViewMode(viewMode) {
        this.sendMessage(wsManager.webToApp.header.changeViewMode, viewMode);
    }

    setAutoRotate(autoRotate) {
        this.sendMessage(wsManager.webToApp.header.setAutoRotaion, autoRotate ? 1 : 0);
    }

    setEditPoiMode(editMode, poiType) {
        this.sendMessage(wsManager.webToApp.header.setEditPoiMode, wsManager.arrayToParameter([editMode, poiType]));
    }

    sendMoveToSensor(sensorID, x, y, z) {
        this.sendMessage(wsManager.webToApp.header.moveToSensor, wsManager.arrayToParameter([sensorID, x, y, z]));
    }

    setViewMode(xrayMode) {
        const parameter = xrayMode ? "2" : "1";
        this.sendMessage(wsManager.webToApp.header.viewMode, parameter);
    }

    showAlarm(sensorID, x, y, z) {
        this.sendMessage(wsManager.webToApp.header.showAlarm, wsManager.arrayToParameter([sensorID, 1, x, y, z]));
    }

    hideAlarm() {
        this.sendMessage(wsManager.webToApp.header.showAlarm, wsManager.arrayToParameter([null, 0, null, null, null]));
    }

    moveToOrigin() {
        this.sendMessage(wsManager.webToApp.header.moveToOrigin);
    }

    setPoiLayer(sensorType, isShow) {
     this.sendMessage(wsManager.webToApp.header.layerOnOff, wsManager.arrayToParameter([sensorType, isShow]));
    }

    requestViewport() {
        this.sendMessage(wsManager.webToApp.header.requestViewport);
    }

    responseViewport(locationX, locationY, locationZ, rotationX, rotationY, rotationZ) {
        this.sendMessage(wsManager.webToApp.header.responseViewport, wsManager.arrayToParameter([locationX, locationY, locationZ, rotationX, rotationY, rotationZ]));
    }

    zoom(zoomIn) {
        this.sendMessage(wsManager.webToApp.header.zoomCamera, zoomIn ? "1" : "0");
    }

    setAutoRotation(autoRotation) {
        this.sendMessage(wsManager.webToApp.header.setAutoRotaion, autoRotation ? "1" : "0");
    }

    setWeatherOption(state, soundState) {
        this.sendMessage(wsManager.webToApp.header.setWeatherOption, wsManager.arrayToParameter([state, soundState]));
    }

    sendAutoRotationTime(n_time, n_use) {
        this.sendMessage(wsManager.webToApp.header.autoRotationTime, wsManager.arrayToParameter([n_time, n_use]));
    }

    sendShutDownSystem() {
        this.sendMessage(wsManager.webToApp.header.shutDownSystem);
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
}