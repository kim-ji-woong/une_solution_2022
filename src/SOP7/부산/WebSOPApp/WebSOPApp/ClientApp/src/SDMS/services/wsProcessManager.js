import wsManager from "./wsManager";
import {SDMSController} from "./sdmsController";
import ActionStore from "./actionStore";
import SdmsResource from "../resource/id";

export default class wsProcessManager {
    
    static #POIType = {
        atmosphere: 1,
        kWeather: 2,
        weather: 3,
        electricity: 4,
        spaceName: 6
    }
    
    constructor(sdms) {
        this.sdms = sdms;
        this.titleBar = null;
    }
    
    getTitleBar = () => {
        return this.titleBar;
    }
    
    getProcessManager = () => {
        return this;
    }
    
    setTitleBar = (titleBar) => {
        this.titleBar = titleBar;
    }
    
    // ProcessManager에서 parameter로 들어오는 Content 객체 분리 및 SDMS에 전달
    
    selectPOI = (content) => {
        const spaceID = content.spaceID; // 공간 0: 외부 , 1~: 내부
        const poiID = content.POI.nodeID; // ExternalSensorsID
        
        return this.sdms.onResponseSelectPOI(spaceID, poiID);
    }

    responseSpaceList = async (wsMgr) => {
        const externalSensorGIS = await SDMSController.requestExternalSensorGIS();
        if (!externalSensorGIS) {
            return;
        }

        let spaceList = [];

        for (let i = 0; i < externalSensorGIS.length; i++) {

            const gis = externalSensorGIS[i];

            let element = {
                "spaceID": gis.id === 20000 ? 0 : gis.id,
                "spaceName": gis.positionName,
                "objectID": gis.acronym ? gis.acronym : "",
                "cameraInfo": {
                    "position": {
                        "x": parseFloat(gis.positionX),
                        "y": parseFloat(gis.positionY),
                        "z": parseFloat(gis.positionZ)
                    },
                    "rotation": {
                        "x": parseFloat(gis.rotationX),
                        "y": parseFloat(gis.rotationY),
                        "z": parseFloat(gis.rotationZ)
                    },
                    "zoom": parseFloat(gis.zoom),
                }
            }

            spaceList.push(element);
        }
        
        wsMgr.sendResponseSpaceList(spaceList);
    }
    
    responsePOIList = async (wsMgr) => {
        const externalSensorGIS = await SDMSController.requestExternalSensorGIS();
        const externalPOIInfo = await SDMSController.requestExternalPOIInfo();

        if (externalSensorGIS === null || externalSensorGIS === undefined || externalPOIInfo === null || externalPOIInfo === undefined) {
            return;
        }

        let POIs = [];

        for (let i = 0; i < externalSensorGIS.length; i++) {
            const gis = externalSensorGIS[i];
            const spaceID = gis.id;

            let poiList = [];

            for (let j = 0; j < externalPOIInfo.length; j++) {
                let poi = externalPOIInfo[j];

                if (spaceID !== poi.spaceID) {
                    continue;
                }
                
                let isIndoor = false;
                if (spaceID !== 20000 && spaceID !== 0) {
                    isIndoor = true;
                }

                const [ alarmStatus, alarmValue, isConnected ] = this.sdms.getAlarmInfoFromPoi(poi, isIndoor);
                
                let poiEl = {
                    "nodeID": poi.id,
                    "poiType": poi.poiType,
                    "poiName": poi.poiName,
                    "position": { x: poi.x, y: poi.y, z: poi.z },
                    "state": { isAlarm: alarmStatus, alarmValue: alarmValue, isConnected: isConnected }
                }

                poiList.push(poiEl);
            }

            let element = {
                "spaceID": spaceID === 20000 ? 0 : spaceID,
                "POIs": poiList
            }
            
            POIs.push(element);
        }

        const poiList = {
            "Spaces": POIs
        }
        
        wsMgr.sendResponsePOIList(poiList);
    }
    
    responseCurrentAlarmBuilding = () => {
        
    }
    
    responseCameraLocation = (content) => {
        
        let parameter = {
            "spaceID": content.spaceID,
            "locationX": content.cameraInfo.position.x,
            "locationY": content.cameraInfo.position.y,
            "locationZ": content.cameraInfo.position.z,
            "rotationX": content.cameraInfo.rotation.x,
            "rotationY": content.cameraInfo.rotation.y,
            "rotationZ": content.cameraInfo.rotation.z,
            "zoom": content.cameraInfo.zoom
        }
        
        return SDMSController.requestSaveBusanViewport(parameter);
    }

    responseMeasuredDistance = (content) => {
        if (this.titleBar) {
            this.titleBar.setTotalDistance(content.totalDistance);
        }
    }

    responseKeymapProhibited = () => {
        this.sdms.onResponseKeymapProhibited();
    }
    
    startLoading = () => {
        ActionStore.dispatch({type: 'LOADING_STATE', loadingState: true });
    }
    
    processingLoading = (value) => {
        ActionStore.dispatch({type: 'SET_LOADING_DEGREE', loadingDegree: value });
    }
    
    responseAutoRotationSettings = () => {
        this.sdms.sendResponseAutoRotationSettings();
    }
    
    responseAlarmLayerSettings = () => {
        this.sdms.sendResponseAlarmLayerSettings();
    }
    
    endLoading = () => {
        ActionStore.dispatch({type: 'LOADING_STATE', loadingState: false });
    }
    
    // Header: 51
    responseDiffusionHoursInfo = (header, parameter) => {
        this.sdms.callSimulationFunction(header, parameter);
    }
}