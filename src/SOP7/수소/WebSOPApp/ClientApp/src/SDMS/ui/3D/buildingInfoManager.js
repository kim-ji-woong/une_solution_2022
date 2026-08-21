import SDMSMainMenu from '../sdmsMainMenu';
import ProjectResource from "../../../Root/resource/id";
import SdmsResource from '../../resource/id';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';

export class BuildingInfoManager {
    static getBuildingInfo(type, id, siteID, _3dOptions, sensorList, currentView, poiManager) {
        if (type === SDMSMainMenu.Fire_Sensor) {
            return BuildingInfoManager.getFireSensorInfo(id, _3dOptions, sensorList);
        }
        else if (type === SDMSMainMenu.H2_Sensor || type === SDMSMainMenu.Temp_Sensor || type === SDMSMainMenu.Flow_Sensor ||
            type === SDMSMainMenu.Conduct_Sensor || type === SDMSMainMenu.GAS_Sensor || type === SDMSMainMenu.PRESSURE_Sensor ||
            type === SDMSMainMenu.H2JAG_Sensor || type === SDMSMainMenu.O2JAG_Sensor ||
            type === SDMSMainMenu.H2Low_Sensor || type === SDMSMainMenu.O2_Sensor) {
            return BuildingInfoManager.getSensorInfo(type, id, _3dOptions, sensorList);
        }
        //else if (type === SDMSMainMenu.H2_Sensor) {
        //    return BuildingInfoManager.getH2SensorInfo(id, _3dOptions, sensorList);
        //}
        //else if (type === SDMSMainMenu.Temp_Sensor) {
        //    return BuildingInfoManager.getTempSensorInfo(id, _3dOptions, sensorList);
        //}
        //else if (type === SDMSMainMenu.Flow_Sensor) {
        //    return BuildingInfoManager.getFlowSensorInfo(id, _3dOptions, sensorList);
        //}
        //else if (type === SDMSMainMenu.Conduct_Sensor) {
        //    return BuildingInfoManager.getConductSensorInfo(id, _3dOptions, sensorList);
        //}
        //else if (type === SDMSMainMenu.GAS_Sensor) {
        //    return BuildingInfoManager.getGasSensorInfo(id, _3dOptions, sensorList);
        //}
        //else if (type === SDMSMainMenu.PRESSURE_Sensor) {
        //    return BuildingInfoManager.getPressureSensorInfo(id, _3dOptions, sensorList);
        //}
        else if (type === SDMSMainMenu.CCTV_Type ||
            type === SDMSMainMenu.CCTV_PTZ_Type ||
            type === SDMSMainMenu.CCTV_SafetyI_Type) {
            return BuildingInfoManager.getCCTVInfo(id, _3dOptions, sensorList);
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
                // .TODO: 마곡 데이터 작업 임시
                if (ProjectResource.SiteID === ProjectResource.Site.Soulbrain || ProjectResource.SiteID === ProjectResource.Site.Magog)
                    arrInfo[1] = sensor.id + '. ' + sensor.cameraName;
                else
                    arrInfo[1] = sensor.cameraName;
                arrInfo[2] = datas;

                return arrInfo;
            }
        }

        return null;
    }

    static getSensorInfo(type, id, _3dOptions, sensorList) {
        const datas = [];
        const arrInfo = new Array();

        let sensors = [];
        if (type === SDMSMainMenu.H2_Sensor) {
            sensors = sensorList['h2Sensors'];
        }
        else if (type === SDMSMainMenu.Temp_Sensor) {
            sensors = sensorList['tempSensors'];
        }
        else if (type === SDMSMainMenu.Flow_Sensor) {
            sensors = sensorList['flowSensors'];
        }
        else if (type === SDMSMainMenu.Conduct_Sensor) {
            sensors = sensorList['conductSensors'];
        }
        else if (type === SDMSMainMenu.GAS_Sensor) {
            sensors = sensorList['gasSensors'];
        }
        else if (type === SDMSMainMenu.PRESSURE_Sensor) {
            sensors = sensorList['pressureSensors'];
        }
        else if (type === SDMSMainMenu.O2_Sensor) {
            sensors = sensorList['o2Sensors'];
        }
        else if (type === SDMSMainMenu.H2Low_Sensor) {
            sensors = sensorList['h2LowSensors'];
        }
        else if (type === SDMSMainMenu.H2JAG_Sensor) {
            sensors = sensorList['h2JAGSensors'];
        }
        else if (type === SDMSMainMenu.O2JAG_Sensor) {
            sensors = sensorList['o2JAGSensors'];
        }

        const sensorCount = sensors.length;
        const sensorID = Number(id);

        for (let i = 0; i < sensorCount; i++) {
            const sensor = sensors[i];

            if (sensorID === sensor.id) {
                datas.push([i18n.t('sdms.buildingInfo.센서 ID') + ' : ' + sensor.name, true, null]);

                // 센서 종류
                const facilityString = SdmsResource.getFacilityTypeString(sensor.facilityType);
                datas.push([i18n.t('sdms.buildingInfo.센서 종류') + ' : ' + i18nUtil.convertText(facilityString), true, null]);

                // 위치
                let zone = _3dOptions.zones[sensor.zoneID.toString()];
                if (!zone) {
                    zone = _3dOptions.outdoorZones[sensor.zoneID.toString()];
                    datas.push([i18n.t('sdms.buildingInfo.위치') + ' : ' + i18nUtil.convertText(zone.name), true, null]);
                } else {
                    datas.push([i18n.t('sdms.buildingInfo.위치') + ' : ' + i18nUtil.convertText(zone[3]), true, null]);
                }

                // 센서 값
                let value = sensor.currentData;
                if (Number.isNaN(parseFloat(value)) === false) {
                    value = parseFloat(value);
                    value = Math.floor(value * 1000) / 1000;
                }
                else {
                    value = "-";
                }

                datas.push([i18n.t('sdms.buildingInfo.센서 값') + ' : ' + value, true, null]);

                arrInfo[0] = '센서정보';
                //arrInfo[1] = sensor.id + ". " + sensor.name;
                arrInfo[1] = sensor.name;
                arrInfo[2] = datas;

                return arrInfo;
            }
        }

        return null;
    }

    //static getH2SensorInfo(id, _3dOptions, sensorList) {
    //    const datas = [];
    //    const arrInfo = new Array();

    //    const sensorCount = sensorList['h2Sensors'].length;
    //    const sensorID = Number(id);

    //    for (let i = 0; i < sensorCount; i++) {
    //        const sensor = sensorList['h2Sensors'][i];

    //        if (sensorID === sensor.id) {
    //            // 센서 종류
    //            const facilityString = SdmsResource.getFacilityTypeString(sensor.facilityType);
    //            datas.push([i18n.t('sdms.buildingInfo.센서 종류') + ' : ' + i18nUtil.convertText(facilityString), true, null]);

    //            // 위치
    //            let zone = _3dOptions.zones[sensor.zoneID.toString()];
    //            if (!zone) {
    //                zone = _3dOptions.outdoorZones[sensor.zoneID.toString()];
    //                datas.push([i18n.t('sdms.buildingInfo.위치') + ' : ' + i18nUtil.convertText(zone.name), true, null]);
    //            } else {
    //                datas.push([i18n.t('sdms.buildingInfo.위치') + ' : ' + i18nUtil.convertText(zone[3]), true, null]);
    //            }

    //            // 센서 값
    //            datas.push([i18n.t('sdms.buildingInfo.센서 값') + ' : ' + (sensor.currentData === null ? '-' : sensor.currentData), true, null]);

    //            arrInfo[0] = '센서정보';
    //            //arrInfo[1] = sensor.id + ". " + sensor.name;
    //            arrInfo[1] = sensor.name;
    //            arrInfo[2] = datas;

    //            return arrInfo;
    //        }
    //    }

    //    return null;
    //}

    //static getTempSensorInfo(id, _3dOptions, sensorList) {
    //    const datas = [];
    //    const arrInfo = new Array();

    //    const sensorCount = sensorList['tempSensors'].length;
    //    const sensorID = Number(id);

    //    for (let i = 0; i < sensorCount; i++) {
    //        const sensor = sensorList['tempSensors'][i];

    //        if (sensorID === sensor.id) {
    //            // 센서 종류
    //            const facilityString = SdmsResource.getFacilityTypeString(sensor.facilityType);
    //            datas.push([i18n.t('sdms.buildingInfo.센서 종류') + ' : ' + i18nUtil.convertText(facilityString), true, null]);

    //            // 위치
    //            let zone = _3dOptions.zones[sensor.zoneID.toString()];
    //            if (!zone) {
    //                zone = _3dOptions.outdoorZones[sensor.zoneID.toString()];
    //                datas.push([i18n.t('sdms.buildingInfo.위치') + ' : ' + i18nUtil.convertText(zone.name), true, null]);
    //            } else {
    //                datas.push([i18n.t('sdms.buildingInfo.위치') + ' : ' + i18nUtil.convertText(zone[3]), true, null]);
    //            }

    //            // 센서 값
    //            datas.push([i18n.t('sdms.buildingInfo.센서 값') + ' : ' + (sensor.currentData === null ? '-' : sensor.currentData), true, null]);

    //            arrInfo[0] = '센서정보';
    //            //arrInfo[1] = sensor.id + ". " + sensor.name;
    //            arrInfo[1] = sensor.name;
    //            arrInfo[2] = datas;

    //            return arrInfo;
    //        }
    //    }

    //    return null;
    //}

    //static getFlowSensorInfo(id, _3dOptions, sensorList) {
    //    const datas = [];
    //    const arrInfo = new Array();

    //    const sensorCount = sensorList['flowSensors'].length;
    //    const sensorID = Number(id);

    //    for (let i = 0; i < sensorCount; i++) {
    //        const sensor = sensorList['flowSensors'][i];

    //        if (sensorID === sensor.id) {
    //            // 센서 종류
    //            const facilityString = SdmsResource.getFacilityTypeString(sensor.facilityType);
    //            datas.push([i18n.t('sdms.buildingInfo.센서 종류') + ' : ' + i18nUtil.convertText(facilityString), true, null]);

    //            // 위치
    //            let zone = _3dOptions.zones[sensor.zoneID.toString()];
    //            if (!zone) {
    //                zone = _3dOptions.outdoorZones[sensor.zoneID.toString()];
    //                datas.push([i18n.t('sdms.buildingInfo.위치') + ' : ' + i18nUtil.convertText(zone.name), true, null]);
    //            } else {
    //                datas.push([i18n.t('sdms.buildingInfo.위치') + ' : ' + i18nUtil.convertText(zone[3]), true, null]);
    //            }

    //            // 센서 값
    //            datas.push([i18n.t('sdms.buildingInfo.센서 값') + ' : ' + (sensor.currentData === null ? '-' : sensor.currentData), true, null]);

    //            arrInfo[0] = '센서정보';
    //            //arrInfo[1] = sensor.id + ". " + sensor.name;
    //            arrInfo[1] = sensor.name;
    //            arrInfo[2] = datas;

    //            return arrInfo;
    //        }
    //    }

    //    return null;
    //}

    //static getConductSensorInfo(id, _3dOptions, sensorList) {
    //    const datas = [];
    //    const arrInfo = new Array();

    //    const sensorCount = sensorList['conductSensors'].length;
    //    const sensorID = Number(id);

    //    for (let i = 0; i < sensorCount; i++) {
    //        const sensor = sensorList['conductSensors'][i];

    //        if (sensorID === sensor.id) {
    //            // 센서 종류
    //            const facilityString = SdmsResource.getFacilityTypeString(sensor.facilityType);
    //            datas.push([i18n.t('sdms.buildingInfo.센서 종류') + ' : ' + i18nUtil.convertText(facilityString), true, null]);

    //            // 위치
    //            let zone = _3dOptions.zones[sensor.zoneID.toString()];
    //            if (!zone) {
    //                zone = _3dOptions.outdoorZones[sensor.zoneID.toString()];
    //                datas.push([i18n.t('sdms.buildingInfo.위치') + ' : ' + i18nUtil.convertText(zone.name), true, null]);
    //            } else {
    //                datas.push([i18n.t('sdms.buildingInfo.위치') + ' : ' + i18nUtil.convertText(zone[3]), true, null]);
    //            }

    //            // 센서 값
    //            datas.push([i18n.t('sdms.buildingInfo.센서 값') + ' : ' + (sensor.currentData === null ? '-' : sensor.currentData), true, null]);

    //            arrInfo[0] = '센서정보';
    //            //arrInfo[1] = sensor.id + ". " + sensor.name;
    //            arrInfo[1] = sensor.name;
    //            arrInfo[2] = datas;

    //            return arrInfo;
    //        }
    //    }

    //    return null;
    //}

    //static getGasSensorInfo(id, _3dOptions, sensorList) {
    //    const datas = [];
    //    const arrInfo = new Array();

    //    const sensorCount = sensorList['gasSensors'].length;
    //    const sensorID = Number(id);

    //    for (let i = 0; i < sensorCount; i++) {
    //        const sensor = sensorList['gasSensors'][i];

    //        if (sensorID === sensor.id) {
    //            // 센서 종류
    //            const facilityString = SdmsResource.getFacilityTypeString(sensor.facilityType);
    //            datas.push([i18n.t('sdms.buildingInfo.센서 종류') + ' : ' + i18nUtil.convertText(facilityString), true, null]);

    //            // 위치
    //            let zone = _3dOptions.zones[sensor.zoneID.toString()];
    //            if (!zone) {
    //                zone = _3dOptions.outdoorZones[sensor.zoneID.toString()];
    //                datas.push([i18n.t('sdms.buildingInfo.위치') + ' : ' + i18nUtil.convertText(zone.name), true, null]);
    //            } else {
    //                datas.push([i18n.t('sdms.buildingInfo.위치') + ' : ' + i18nUtil.convertText(zone[3]), true, null]);
    //            }

    //            // 센서 값
    //            datas.push([i18n.t('sdms.buildingInfo.센서 값') + ' : ' + (sensor.currentData === null ? '-' : sensor.currentData), true, null]);

    //            arrInfo[0] = '센서정보';
    //            //arrInfo[1] = sensor.id + ". " + sensor.name;
    //            arrInfo[1] = sensor.name;
    //            arrInfo[2] = datas;

    //            return arrInfo;
    //        }
    //    }

    //    return null;
    //}

    //static getPressureSensorInfo(id, _3dOptions, sensorList) {
    //    const datas = [];
    //    const arrInfo = new Array();

    //    const sensorCount = sensorList['pressureSensors'].length;
    //    const sensorID = Number(id);

    //    for (let i = 0; i < sensorCount; i++) {
    //        const sensor = sensorList['pressureSensors'][i];
            
    //        if (sensorID === sensor.id) {
    //            // 센서 종류
    //            const facilityString = SdmsResource.getFacilityTypeString(sensor.facilityType);
    //            datas.push([i18n.t('sdms.buildingInfo.센서 종류') + ' : ' + i18nUtil.convertText(facilityString), true, null]);

    //            // 위치
    //            let zone = _3dOptions.zones[sensor.zoneID.toString()];
    //            if (!zone) {
    //                zone = _3dOptions.outdoorZones[sensor.zoneID.toString()];
    //                datas.push([i18n.t('sdms.buildingInfo.위치') + ' : ' + i18nUtil.convertText(zone.name), true, null]);
    //            } else {
    //                datas.push([i18n.t('sdms.buildingInfo.위치') + ' : ' + i18nUtil.convertText(zone[3]), true, null]);
    //            }

    //            // 센서 값
    //            datas.push([i18n.t('sdms.buildingInfo.센서 값') + ' : ' + (sensor.currentData === null ? '-' : sensor.currentData), true, null]);

    //            arrInfo[0] = '센서정보';
    //            //arrInfo[1] = sensor.id + ". " + sensor.name;
    //            arrInfo[1] = sensor.name;
    //            arrInfo[2] = datas;

    //            return arrInfo;
    //        }
    //    }

    //    return null;
    //}

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
                    datas.push(['위치 : ' + zone.name, true, null]);
                } else {
                    datas.push(['위치 : ' + zone[3], true, null]);
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
                arrInfo[1] = sensor.name;
                arrInfo[2] = datas;

                return arrInfo;
            }
        }

        return null;
    }
}