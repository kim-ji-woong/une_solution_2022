import {SDMSController} from "./sdmsController";
import store from "../../Root/store"

export default class wsProcessManager {

    static WeatherState = {

        // 기상청 단기예보 조회 기준
        NoRain: {
            Sunshine: 1, // 맑음
            Cloud: 3, // 구름 많음
            Cloudy: 4, // 흐림
        },
        Rain: {
            Rain: 1,
            SnowRain: 2,
            Snow: 3,
            Shower: 4,
        }
    }
    
    constructor(sdms) {
        this.sdms = sdms;
    }

    async onResponseViewport(parameter) {
        if (!parameter) {
            return;
        }
        const tokens = parameter.slice();
        console.log(tokens);

        //const tokens = parameter.split(',');

        if (tokens.length === 6) {
            const locationX = parseFloat(tokens[0].trim());
            const locationY = parseFloat(tokens[1].trim());
            const locationZ = parseFloat(tokens[2].trim());
            const rotationX = parseFloat(tokens[3].trim());
            const rotationY = parseFloat(tokens[4].trim());
            const rotationZ = parseFloat(tokens[5].trim());

            if ((locationX === 0 || locationX) && (locationY === 0 || locationY) && (locationZ === 0 || locationZ) &&
                (rotationX === 0 || rotationX) && (rotationY === 0 || rotationY) && (rotationZ === 0 || rotationZ)) {
                const [success, message] = await SDMSController.requestSaveViewport2(locationX, locationY, locationZ, rotationX, rotationY, rotationZ);

                if (success === false) {
                    if (message && message.length > 0) {
                        //alert(message);
                        return [null, message];
                    }
                }
            }
        }
    }

    async onRequestViewport(wsMgr) {
        const [viewport, message] = await SDMSController.requestViewport2();

        if (viewport) {
            wsMgr.responseStartTransform(viewport.locationX, viewport.locationY, viewport.locationZ, viewport.rotationX, viewport.rotationY, viewport.rotationZ);
        }
        else if (message && message.length > 0) {
            //alert(message);
            return [null, message];
        }
    }

    async onRequestSensorList(wsMgr) {

        const result = await SDMSController.requestSensorDatas();
        
        const sensorAlarms = store.getState().sensorAlarm;
        
        const sensorDatas = result.sensorDatas;

        let arrayResult = [];

        if (sensorDatas) {
            for (let el of sensorDatas) {
                let arrayElement = [];
                
                let isAlarm = false;
                
                if (sensorAlarms !== null && sensorAlarms !== undefined) {
                    for (let alarm of sensorAlarms) {
                        if (alarm.zoneID === el.sensorID && alarm.isAlarm === true) {
                            isAlarm = true;
                            break;
                        }
                    }   
                }

                arrayElement.push(el.sensorID !== null && el.sensorID !== undefined ? el.sensorID : "null");
                arrayElement.push(el.sensorType !== null && el.sensorType !== undefined ? el.sensorType : "null");
                arrayElement.push(el.x !== null && el.x !== undefined ? el.x : "null");
                arrayElement.push(el.y !== null && el.y !== undefined ? el.y : "null");
                arrayElement.push(el.longitude !== null && el.longitude !== undefined ? el.longitude : "null");
                arrayElement.push(el.latitude !== null && el.latitude !== undefined ? el.latitude : "null");
                arrayElement.push(isAlarm);

                if (el.sensorType === 0)
                    continue;
                if (el.x === null || el.x === undefined)
                    continue;
                if (el.y === null || el.y === undefined)
                    continue;
                
                arrayResult.push(arrayElement);
            }
        }

        wsMgr.responseSensorList(arrayResult);
    }

    sendWsSensorList(sensorList) {
        const atmos = sensorList.atmospheres;
        const waters = sensorList.waters;
        const weathers = sensorList.weathers;

        let _atmos = this.makeSensorList3D(atmos);;
        let _waters = this.makeSensorList3D(waters);;
        let _weathers = this.makeSensorList3D(weathers);;

        let _sensorList = [];

        _sensorList.push(_atmos);
        _sensorList.push(_waters);
        _sensorList.push(_weathers);

        let _result = _sensorList;
        let result = []

        for (let i = 0; i < _result.length; i++) {
            let list = _result[i];
            for (const sensor of list) {
                result.push(sensor);
            }

        }
        return result;
    }

    makeSensorList3D(sensors) {

        let _sensors = []

        if (sensors && sensors.length > 0) {
            for (const sensor of sensors) {
                let _sensor = [];

                for (const indiSensor of sensor.sensors) {
                    _sensor[0] = indiSensor.nSensorType;
                    _sensor[1] = indiSensor.id;
                    _sensor[2] = sensor.position;
                    _sensor[3] = indiSensor.latitude;
                    _sensor[4] = indiSensor.longitude;
                    _sensor[5] = indiSensor.X;
                    _sensor[6] = indiSensor.Y;
                    _sensor[7] = indiSensor.Z;

                    _sensors.push(_sensor);
                }
            }
        }
        return _sensors;
    }

    async onRequestTestSensor(wsMgr, state) {
        store.dispatch({
            type: 'SOCKET_ACTION',
            socketAction: {
                actionType: 2,
                parameter: parseInt(state)
            }
        });
    }

    onRequestTestSensorSMS(wsMgr) {
        store.dispatch({
            type: 'TEST_ACTION',
            testAction: 51,
        });
    }

    async onSelectPOI(wsMgr, sensorID) {
        store.dispatch({
            type: 'SOCKET_ACTION',
            socketAction: {
                actionType: 1,
                parameter: parseInt(sensorID[0])
            }
        });
    }

    async onRequestWeatherData(wsMgr) {

        const result = await this.getXmlData(wsMgr);

        if (result === "") {
            return;
        }
        else {
            console.error("onRequestWeatherData is Fail: wsProcessMAnager.js:189");
        }
    }

    getDate() {
        const today = new Date();

        const year = today.getFullYear();
        const month = ('0' + (today.getMonth() + 1)).slice(-2);
        const day = ('0' + today.getDate()).slice(-2);

        return year.toString() + month + day;
    }

    getXmlData = async (wsMgr) => {

        let strResult = "";

        let weather = null;
        let degree = null;
        let _windSpeed = null; // m/s
        let windSpeed = null; // km/h
        let windDirection = null;
        let precipitation = null;
        let cloudAmount = null;

        let sunset = null;
        let sunrise = null;

        const date = this.getDate();

        var xhr = new XMLHttpRequest();
        var url = 'https://apis.data.go.kr/B090041/openapi/service/RiseSetInfoService/getAreaRiseSetInfo'; /*URL*/
        var queryParams = '?' + encodeURIComponent('serviceKey') + '=' + 'KW%2FcL6OzW1Jp413enPnEMXuuyXoMl%2BX96URV8yof9L6M7UxvsPwkz%2F9oTw3DXjEn275QeVyUVCpPJlgyQeN7aQ%3D%3D'; /*Service Key*/
        queryParams += '&' + encodeURIComponent('locdate') + '=' + encodeURIComponent(date); /**/
        queryParams += '&' + encodeURIComponent('location') + '=' + encodeURIComponent('여수'); /**/

        xhr.open('GET', url + queryParams, false);

        xhr.onreadystatechange = async () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 400)) {
                    // 정상 처리시
                    let xmlDoc = xhr.responseXML;
                    let parser = new DOMParser();

                    if (xhr.responseXML) {
                        xmlDoc = xhr.responseXML;

                        let contentSunset = xmlDoc.getElementsByTagName("sunset");
                        let contentSunrise = xmlDoc.getElementsByTagName("sunrise");

                        sunset = contentSunset[0].innerHTML.trim();
                        sunrise = contentSunrise[0].innerHTML.trim();
                    } else {
                        //xmlDoc = parser.parseFromString(xhr.responseText, "application/xml");
                        strResult = "xhr Fail";
                    }

                } else {
                    // 에러 발생시
                    console.log("xhr.status : " + xhr.status.toString());
                    console.log("xhr.statusText : " + xhr.statusText);
                    console.log("xhr.response : " + xhr.response);
                    strResult = xhr.statusText + " , " + xhr.response;
                }
            }
        };

        xhr.send('');

        sunset = parseFloat(sunset);
        sunrise = parseFloat(sunrise);

        const weatherRequest = await SDMSController.requestWeatherInfo2();

        const weatherResult = weatherRequest?.datas[0].current2;

        degree = weatherResult.temperature;
        //weather = this.getWeatherState(weatherResult.state, weatherResult.rain);
        weather = weatherResult.state;
        _windSpeed = weatherResult.windSpeed;
        //windDirection = this.getWindDirection(weatherResult.windDirection);
        windDirection = weatherResult.windDirection;
        precipitation = weatherResult.rain;

        // 전운량은 공공데이터에서 가져온다.
        const publicDatas = await SDMSController.requestPublicData();
        
        const kmaAsos = publicDatas?.kmaAsos;

        if (kmaAsos) {
            cloudAmount = kmaAsos[0].cloudAmount;
        }

        // 풍속 k/h 변환
        windSpeed = (_windSpeed * 60 / 1000);

        wsMgr.responseWeather(weather, degree, sunrise, sunset, windSpeed, windDirection, precipitation, cloudAmount);

        return strResult;
    }

    getWindDirection(degrees) {
        let direction = null;

        const directions = [
            "북", "북동", "동", "남동", "남", "남서", "서", "북서", "북"
        ];

        // 입력된 각도를 360으로 나누어 정규화합니다.
        degrees = (degrees + 360) % 360;

        // 45도 간격으로 방향을 계산합니다.
        const index = Math.round(degrees / 45);

        // 해당 방향을 반환합니다.
        return directions[index];
    }
}