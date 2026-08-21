import SDMSMainMenu from '../sdmsMainMenu';
import ProjectResource from "../../../Root/resource/id";
import SdmsResource from '../../resource/id';

export class BuildingInfoManager {
    static getBuildingInfo(type, id, siteID, _3dOptions, sensorList, currentView, poiManager) {
        if (type === SDMSMainMenu.Fire_Sensor) {
            return BuildingInfoManager.getFireSensorInfo(id, _3dOptions, sensorList);
        }
        else if (type === SDMSMainMenu.Etc_Sensor) {
            return BuildingInfoManager.getEtcSensorInfo(id, _3dOptions, sensorList);
        }
        else if (type === SDMSMainMenu.PSM_Sensor) {
            return BuildingInfoManager.getPSMSensorInfo(id, _3dOptions, sensorList);
        }
        else if (type === SDMSMainMenu.Environment_Sensor) {
            return BuildingInfoManager.getEnvironmentSensorInfo(id, _3dOptions, sensorList);
        }
        else if (type === SDMSMainMenu.Manufacture_Sensor) {
            return BuildingInfoManager.getManufactureSensorInfo(id, _3dOptions, sensorList);
        }
        else if (type === SDMSMainMenu.Emergency_Sensor) {
            return BuildingInfoManager.getEmergencySensorInfo(id, _3dOptions, sensorList);
        }
        else if (type === SDMSMainMenu.CCTV_Type ||
            type === SDMSMainMenu.CCTV_PTZ_Type ||
            type === SDMSMainMenu.CCTV_SafetyI_Type) {
            return BuildingInfoManager.getCCTVInfo(id, _3dOptions, sensorList);
        }
        else if (type === SDMSMainMenu.Door_Sensor) {
            return BuildingInfoManager.getDoorInfo(type, id, currentView, poiManager);
        }
        else if (type === SDMSMainMenu.Exit) {
            return BuildingInfoManager.getExitInfo(type, id, currentView, poiManager);
        }
        else if (type === SDMSMainMenu.Life ||
            type === SDMSMainMenu.Cardiac ||
            type === SDMSMainMenu.Rescue) {
            return BuildingInfoManager.getFirstAidEquipmentInfo(type, id, _3dOptions, currentView);
        }

        return null;
    }

    static getFirstAidEquipmentInfo(type, id, _3dOptions, currentView, zoneIDs = null, index = null) {
        let zoneID = currentView.zoneID;

        if (zoneID) {
            let zone = _3dOptions.zones[zoneID];

            if (!zone) {
                if (!zoneIDs) {
                    zoneIDs = [];

                    for (const _zoneID in _3dOptions.outdoorZones) {
                        zoneIDs.push(_zoneID);
                    }

                    if (zoneIDs.length > 0) {
                        index = 0;
                        zoneID = zoneIDs[index];
                    }
                }
                else {
                    if (index >= zoneIDs.length) {
                        return null;
                    }
                    else {
                        zoneID = zoneIDs[index];
                    }
                }

                zone = _3dOptions.outdoorZones[zoneID];
            }

            if (zone) {
                const equipments = zone.sensors[type];

                if (equipments) {
                    const equipmentID = Number(id);

                    for (const equipment of equipments) {
                        if (equipment.id === equipmentID) {
                            const datas = [];
                            const zoneName = zone.name ? zone.name : zone[3];

                            datas.push(['위치 : ' + zoneName, true, null]);
                            datas.push(['종류 : ' + BuildingInfoManager.getFirstAidEquipmentTypeName(type), true, null]);

                            const arrInfo = new Array();

                            arrInfo[0] = '장비정보';
                            arrInfo[1] = equipment.equipmentName;
                            arrInfo[2] = datas;

                            return arrInfo;
                        }
                    }
                }
            }
        }

        if (zoneIDs) {
            return BuildingInfoManager.getFirstAidEquipmentInfo(type, id, _3dOptions, currentView, zoneIDs, index + 1);
        }

        return null;
    }

    static getFirstAidEquipmentTypeName(type) {
        if (type === SDMSMainMenu.Life) {
            return "인명구조기구";
        }
        else if (type === SDMSMainMenu.Cardiac) {
            return "심장제세동기";
        }
        else if (type === SDMSMainMenu.Rescue) {
            return "완강기";
        }

        return "";
    }

    static getExitInfo(type, id, currentView, poiManager) {
        const datas = [];
        const arrInfo = new Array();

        const zoneID = currentView?.zoneID;

        if (zoneID) {
            const sensorID = parseInt(id);
            const icon = poiManager.getZoneIcon(zoneID, type, sensorID);

            if (icon) {
                datas.push(["위치 : " + icon.positionName, true, null]);
                datas.push(["비상구", true, null]);

                arrInfo.push("센서정보");
                arrInfo.push(icon.name);
                arrInfo.push(datas);

                return arrInfo;
            }
        }

        return null;
    }

    static getDoorInfo(type, id, currentView, poiManager) {
        const datas = [];
        const arrInfo = new Array();

        const zoneID = currentView?.zoneID;

        if (zoneID) {
            const sensorID = parseInt(id);
            const icon = poiManager.getZoneIcon(zoneID, type, sensorID);

            if (icon) {
                datas.push(["위치 : " + icon.positionName, true, null]);
                datas.push(["열리지 않은 출입구", true, null]);

                arrInfo.push("센서정보");
                arrInfo.push(icon.name);
                arrInfo.push(datas);

                return arrInfo;
            }
        }

        return null;
    }

    static getCCTVInfo(id, _3dOptions, sensorList) {
        const datas = [];
        const arrInfo = new Array();

        const sensorCount = sensorList['cctvs'].length;
        const sensorID = Number(id);

        for (let i = 0; i < sensorCount; i++) {
            const sensor = sensorList['cctvs'][i];

            if (sensorID === sensor.id) {
                let zoneID = sensor.zoneID;

                if (sensor.zoneID === null || sensor.zoneID === undefined) {
                    zoneID = this.poiManager.getSensorZoneID(sensor.id, SDMSMainMenu.CCTV_Type);

                    if (isNaN(zoneID) || zoneID === null || zoneID === undefined) {
                        continue;
                    }
                }

                //if (Number(id) === sensor.id && sensor.zoneID !== null && sensor.zoneID !== undefined) {
                let zone = _3dOptions.zones[zoneID.toString()];
                if (!zone) {
                    zone = _3dOptions.outdoorZones[zoneID.toString()];
                    if (zone)
                        datas.push(['위치 : ' + zone.name, true, null]);
                }
                else {
                    datas.push(['위치 : ' + zone[3], true, null]);
                }

                if (sensor.cameraName.indexOf('PTZ') > 0) {
                    datas.push(['CCTV 종류 : PTZ', true, null]);
                }
                else {
                    datas.push(['CCTV 종류 : ' + sensor.type, true, null]);
                }

                if (sensor.cameraIP && sensor.cameraIP.length > 0) {
                    datas.push(['IP : ' + sensor.cameraIP, true, null]);
                }

                if (sensor.cameraCompanyName && sensor.cameraCompanyName.length > 0) {
                    datas.push(['제조사 : ' + sensor.cameraCompanyName, true, null]);
                }

                if (sensor.cameraModelName && sensor.cameraModelName.length > 0) {
                    datas.push(['모델명 : ' + sensor.cameraModelName, true, null]);
                }

                arrInfo[0] = '센서정보';
                arrInfo[1] = sensor.id + '. ' + sensor.cameraName;
                if (ProjectResource.SiteID === ProjectResource.Site.Soulbrain)
                    arrInfo[1] = sensor.id + '. ' + sensor.cameraName;
                else
                    arrInfo[1] = sensor.cameraName;
                arrInfo[2] = datas;

                return arrInfo;
            }
        }

        return null;
    }

    static getEmergencySensorInfo(id, _3dOptions, sensorList) {
        const datas = [];
        const arrInfo = new Array();

        const sensorCount = sensorList['emergencyBellSensors'].length;
        const sensorID = Number(id);

        for (let i = 0; i < sensorCount; i++) {
            const sensor = sensorList['emergencyBellSensors'][i];

            if (sensorID === sensor.id) {
                let zone = _3dOptions.zones[sensor.zoneID.toString()];
                if (!zone) {
                    zone = _3dOptions.outdoorZones[sensor.zoneID.toString()];
                    datas.push(['위치 : ' + zone.name, true, null]);
                } else {
                    datas.push(['위치 : ' + zone[3], true, null]);
                }

                arrInfo[0] = '센서정보';
                //arrInfo[1] = sensor.id + ". " + sensor.name;
                arrInfo[1] = sensor.name;
                arrInfo[2] = datas;

                return arrInfo;
            }
        }

        return null;
    }

    static getManufactureSensorInfo(id, _3dOptions, sensorList) {
        const datas = [];
        const arrInfo = new Array();

        const sensorCount = sensorList['manufactureSensors'].length;
        const sensorID = Number(id);

        for (let i = 0; i < sensorCount; i++) {
            const sensor = sensorList['manufactureSensors'][i];
            if (Number(id) === sensor.id) {
                let zone = _3dOptions.zones[sensor.zoneID.toString()];
                if (!zone) {
                    zone = _3dOptions.outdoorZones[sensor.zoneID.toString()];
                    datas.push(['위치 : ' + zone.name, true, null]);
                } else {
                    datas.push(['위치 : ' + zone[3], true, null]);
                }

                if (ProjectResource.SiteID === ProjectResource.Site.Wonik && sensor.department) {
                    const arr = sensor.department.split("\r\n");
                    if (arr?.length > 0) {
                        datas.push(['담당자', true, null]);

                        for (let i = 0; i < arr.length; i++) {
                            const data = arr[i];

                            datas.push([data, false, 1]);
                        }
                    }
                }

                arrInfo[0] = '센서정보';
                //arrInfo[1] = sensor.id + ". " + sensor.name;
                arrInfo[1] = sensor.name;
                arrInfo[2] = datas;

                return arrInfo;
            }
        }

        return null;
    }

    static getEnvironmentSensorInfo(id, _3dOptions, sensorList) {
        const datas = [];
        const arrInfo = new Array();

        const sensorCount = sensorList['environmentSensors'].length;
        const sensorID = Number(id);

        for (let i = 0; i < sensorCount; i++) {
            const sensor = sensorList['environmentSensors'][i];
            if (sensorID === sensor.id) {
                let zone = _3dOptions.zones[sensor.zoneID.toString()];
                if (!zone) {
                    zone = _3dOptions.outdoorZones[sensor.zoneID.toString()];
                    datas.push(['위치 : ' + zone.name, true, null]);
                } else {
                    datas.push(['위치 : ' + zone[3], true, null]);
                }

                if (ProjectResource.SiteID === ProjectResource.Site.Wonik && sensor.department) {
                    const arr = sensor.department.split("\r\n");
                    if (arr?.length > 0) {
                        datas.push(['담당자', true, null]);

                        for (let i = 0; i < arr.length; i++) {
                            const data = arr[i];

                            datas.push([data, false, 1]);
                        }
                    }
                }

                arrInfo[0] = '센서정보';
                //arrInfo[1] = sensor.id + ". " + sensor.name;
                arrInfo[1] = sensor.name;
                arrInfo[2] = datas;

                return arrInfo;
            }
        }

        return null;
    }

    static getPSMSensorInfo(id, _3dOptions, sensorList) {
        const datas = [];
        const arrInfo = new Array();

        const sensorCount = sensorList['psmSensors'].length;
        const sensorID = Number(id);

        for (let i = 0; i < sensorCount; i++) {
            const sensor = sensorList['psmSensors'][i];
            if (sensorID === sensor.id) {
                let zone = _3dOptions.zones[sensor.zoneID.toString()];
                if (!zone) {
                    zone = _3dOptions.outdoorZones[sensor.zoneID.toString()];
                    datas.push(['위치 : ' + zone.name, true, null]);
                } else {
                    datas.push(['위치 : ' + zone[3], true, null]);
                }

                const typeName = SdmsResource.getFacilityTypeString(sensor.facilityType);
                datas.push(['센서 종류 : ' + typeName, true, null]);

                if (ProjectResource.SiteID === ProjectResource.Site.Wonik && sensor.department) {
                    const arr = sensor.department.split("\r\n");
                    if (arr?.length > 0) {
                        datas.push(['담당자', true, null]);

                        for (let i = 0; i < arr.length; i++) {
                            const data = arr[i];

                            datas.push([data, false, 1]);
                        }
                    }
                }

                arrInfo[0] = '센서정보';
                //arrInfo[1] = sensor.id + ". " + sensor.name;
                arrInfo[1] = sensor.name;
                arrInfo[2] = datas;

                return arrInfo;
            }
        }

        return null;
    }

    static getEtcSensorInfo(id, _3dOptions, sensorList) {
        const datas = [];
        const arrInfo = new Array();

        const sensorCount = sensorList['etcSensors'].length;
        const sensorID = Number(id);

        for (let i = 0; i < sensorCount; i++) {
            const sensor = sensorList['etcSensors'][i];

            if (sensorID === sensor.id) {
                let zone = _3dOptions.zones[sensor.zoneID.toString()];
                if (!zone) {
                    zone = _3dOptions.outdoorZones[sensor.zoneID.toString()];
                    datas.push(['위치 : ' + zone.name, true, null]);
                } else {
                    datas.push(['위치 : ' + zone[3], true, null]);
                }

                arrInfo[0] = '센서정보';
                //arrInfo[1] = sensor.id + ". " + sensor.name;
                arrInfo[1] = sensor.name;
                arrInfo[2] = datas;

                return arrInfo;
            }
        }

        return null;
    }

    static getFireSensorInfo(id, _3dOptions, sensorList) {
        const datas = [];
        const arrInfo = new Array();

        const sensorCount = sensorList['fireSensors'].length;
        const sensorID = Number(id);

        for (let i = 0; i < sensorCount; i++) {
            const sensor = sensorList['fireSensors'][i];
            if (sensorID === sensor.id) {
                let zone = _3dOptions.zones[sensor.zoneID.toString()];
                if (!zone) {
                    zone = _3dOptions.outdoorZones[sensor.zoneID.toString()];

                    const zoneName = zone ? zone.name : "";
                    datas.push(['위치 : ' + zoneName, true, null]);
                } else {
                    datas.push(['위치 : ' + zone[3], true, null]);
                }

                if ((ProjectResource.SiteID === ProjectResource.Site.Soulbrain || ProjectResource.SiteID === ProjectResource.Site.Wonik)
                    && sensor.tagNo > 0) {
                    let tagNo = sensor.tagNo;   
                    tagNo = tagNo - (Math.floor(tagNo / 10000000) * 10000000);

                    datas.push(['수신기번호 : ' + tagNo, true, null]);
                }                

                if (sensor.sensorSubType === 0) {
                    datas.push(['감지기 종류 : 열 감지기', true, null]);
                } else if (sensor.sensorSubType === 1) {
                    datas.push(['감지기 종류 : 연기 감지기', true, null]);
                } else if (sensor.sensorSubType === 2) {
                    datas.push(['감지기 종류 : 불꽃 감지기', true, null]);
                } else {
                    datas.push(['감지기 종류 : 일반 감지기', true, null]);
                }

                if (ProjectResource.SiteID === ProjectResource.Site.Wonik && sensor.department) {
                    const arr = sensor.department.split("\r\n");
                    if (arr?.length > 0) {
                        datas.push(['담당자', true, null]);

                        for (let i = 0; i < arr.length; i++) {
                            const data = arr[i];

                            datas.push([data, false, 1]);
                        }
                    }
                }

                arrInfo[0] = '센서정보';
                //arrInfo[1] = sensor.id + ". " + sensor.name;
                arrInfo[1] = sensor ? sensor.name : "";
                arrInfo[2] = datas;

                return arrInfo;
            }
        }

        return null;
    }
}