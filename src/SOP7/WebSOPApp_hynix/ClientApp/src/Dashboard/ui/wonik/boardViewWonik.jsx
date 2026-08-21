import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { BoardView } from '../../styled/dashboardWonik';
import { BoardViewDetail } from '../../styled/dashboardWonik';

import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import ProjectResource from '../../../Root/resource/id';
import AccountResource from '../../../Account/resource/id';
import SDMSResource from '../../../SDMS/resource/id';

class BoardViewWonik extends Component {
    constructor(props) {
        super(props);
		
		this.state = {
            siteDetailData: [],     // 캠퍼스 정보
        }

        this.props = props;

        this.init();
	}    

    init = () => {
        // 캠퍼스 정보 초기화
        const siteDetailData = this.state.siteDetailData;

        siteDetailData[ProjectResource.Site.Wonik] = (
            <ul>
                <li>주소 : 경북 구미시 옥계2공단로 63</li>
                <li>동 정보 : H1동, H2동, H3동, H4동 H5동(폐수처리장), H6동</li>
                <li>면적 : 18,593.91 m2</li>
                <li>집결지 위치 : H2동 앞 집결지(옥외),H4동 앞 집결지(옥외),H1동 입구(옥내)</li>
            </ul>
        );

        siteDetailData[ProjectResource.Site.Wonik_A] = (
            <ul>
                <li>주소 : 경북 구미시 옥계2공단로 117</li>
                <li>동 정보 : A1동, A2동, A3동, A4동</li>
                <li>면적 : 11,450.50 m2</li>
            </ul>
        );

        siteDetailData[ProjectResource.Site.Wonik_C] = (
            <ul>
                <li>주소 : 경북 구미시 4공단로 161-8</li>
                <li>동 정보 : C1동, C2동, C3동, C4동</li>
                <li>면적 : 17,437.00 m2</li>
                <li>집결지 위치 : C2동 앞 집결지(옥외),C3동 앞 집결지(옥외)</li>
            </ul>
        );

        siteDetailData[ProjectResource.Site.Wonik_V] = (
            <ul>
                <li>주소 : 경기 안성시 미양면 협동단지길44</li>
                <li>동 정보 : V1동, V2동, V3동, V4동, V5동, V6동, V7동, V8동, V16동, V18동, V19동, V20동, V21동, VC동</li>
                <li>면적 : 20,013.00 m2</li>
            </ul>
        );

        siteDetailData[ProjectResource.Site.Wonik_S] = (
            <ul>
                <li>주소 : 경북 구미시 산동읍 5공단3로 14</li>
                <li>동 정보 : S1동, S2동, 보안동, 사무동, 폐수동</li>
                <li>면적 : 84,382.95 m2</li>
            </ul>
        );

        this.state.siteDetailData = siteDetailData;
    }

    getViewData = () => {
        const selectSiteID = this.props.selectSiteID;
        const buildingGroupList = this.props.buildingGroupList;
        const useSensorList = this.props.useSensorList;
        const useSensorTypes = this.props.useSensorTypes;
        const todayAlarms = this.props.todayAlarms;
        const siteScores = this.props.siteScores;
        const outdoorZones = this.props.outdoorZones;

        const siteID = ProjectResource.SiteID;

        let data = [];
        
        if (selectSiteID === -1) {
            for (let i = 0; i < buildingGroupList?.length; i++) {
                const buildingGroup = buildingGroupList[i];

                let buildingGroupData = { siteID: buildingGroup.siteID, buildingGroupName: buildingGroup.displayText, sensorList: [], score: null };
                data[buildingGroup.siteID] = buildingGroupData;

                let fireListData = { titlt: "화재", data1: 0, data2: 0, data3: 0 };
                let psmListData = { titlt: "가스", data1: 0, data2: 0, data3: 0 };
                let cctvListData = { titlt: "CCTV", data1: 0, data2: 0, data3: 0 };
                
                let environmentListData = {titlt: "환경", data1: 0, data2: 0, data3: 0};
                let manufactureListData = { titlt: "제조설비", data1: 0, data2: 0, data3: 0 };

                let beconListData = { titlt: "비콘", data1: 0, data2: 0, data3: 0 };

                let outZoneID = null;
                if (siteID) {
                    outZoneID = 20000 + (buildingGroup.siteID - siteID);

                    for (let k = 0; k < todayAlarms?.length; k++) {
                        const todayAlarm = todayAlarms[k];
                        let facilityType = todayAlarm.facilityType;

                        // CCTV 경우 알람 타입 처리
                        if (facilityType === SDMSResource.facilityType.Intrusion_S1 ||
                            facilityType === SDMSResource.facilityType.Loiter_S1 ||
                            facilityType === SDMSResource.facilityType.Collapse_S1 ||
                            facilityType === SDMSResource.facilityType.Theft_S1 ||
                            facilityType === SDMSResource.facilityType.Neglect_S1 ||
                            facilityType === SDMSResource.facilityType.VirtualFence_S1 ||
                            facilityType === SDMSResource.facilityType.Fire_S1) {
                            facilityType = SDMSResource.facilityType.Intrusion_S1;
                        }
                        else if (facilityType === SDMSResource.facilityType.Becon_Stay ||
                            facilityType === SDMSResource.facilityType.Becon_SOS) {
                            facilityType = SDMSResource.facilityType.Becon_Stay;
                        }

                        if (todayAlarm.isAlarm && todayAlarm.zoneID === outZoneID) {
                            if (facilityType === SDMSResource.facilityType.FIRE) {
                                fireListData.data3++;
                            } else if (facilityType === SDMSResource.facilityType.PSM_SENSOR) {
                                psmListData.data3++;
                            } else if (facilityType === SDMSResource.facilityType.Intrusion_S1) {
                                cctvListData.data3++;
                            } else if (facilityType === SDMSResource.facilityType.Becon_Stay) {
                                beconListData.data3++;
                            } else if (facilityType === SDMSResource.facilityType.Environment) {
                                environmentListData.data3++;
                            } else if (facilityType === SDMSResource.facilityType.Manufacture) {
                                manufactureListData.data3++;
                            }
                        }
                    }


                    // 외곽존 센서 숫자 체크
                    if (useSensorTypes?.UseFire === true && useSensorList?.fireSensors?.length > 0) {
                        for (let f = 0; f < useSensorList.fireSensors?.length; f++) {
                            const fireSensor = useSensorList.fireSensors[f];

                            if (fireSensor.zoneID === outZoneID) {
                                fireListData.data2++;
                            }
                        }

                        for (let g = 0; g < useSensorList.disabledFireSensors?.length; g++) {
                            const disabledFireSensor = useSensorList.disabledFireSensors[g];

                            if (disabledFireSensor.zoneID === outZoneID) {
                                fireListData.data1++;
                            }
                        }
                    }

                    if (useSensorTypes?.UsePSM === true && useSensorList?.psmSensors?.length > 0) {
                        for (let f = 0; f < useSensorList.psmSensors?.length; f++) {
                            const psmSensor = useSensorList.psmSensors[f];

                            if (psmSensor.zoneID === outZoneID && psmSensor.x !== null && psmSensor.y !== null && psmSensor.z !== null) {
                                psmListData.data2++;
                            }
                        }

                        for (let g = 0; g < useSensorList.disabledPSMSensors?.length; g++) {
                            const disabledPSMSensor = useSensorList.disabledPSMSensors[g];

                            if (disabledPSMSensor.zoneID === outZoneID) {
                                psmListData.data1++;
                            }
                        }
                    }

                    if (useSensorList?.cctvs?.length > 0) {
                        for (let f = 0; f < useSensorList.cctvs.length; f++) {
                            const cctv = useSensorList.cctvs[f];

                            if (cctv.zoneID === outZoneID) {
                                cctvListData.data2++;
                            }
                        }

                        for (let g = 0; g < useSensorList.disabledCCTVs?.length; g++) {
                            const disabledCCTV = useSensorList.disabledCCTVs[g];

                            if (disabledCCTV.zoneID === outZoneID) {
                                cctvListData.data1++;
                            }
                        }
                    }

                    if (useSensorTypes?.UseEnvironment === true && useSensorList?.environmentSensors?.length > 0) {
                        for (let f = 0; f < useSensorList.environmentSensors?.length; f++) {
                            const environmentSensor = useSensorList.environmentSensors[f];

                            if (environmentSensor.zoneID === outZoneID && environmentSensor.x !== null && environmentSensor.y !== null && environmentSensor.z !== null) {
                                environmentListData.data2++;
                            }
                        }

                        for (let g = 0; g < useSensorList.disabledEnvironmentSensors?.length; g++) {
                            const disabledEnvironmentSensor = useSensorList.disabledEnvironmentSensors[g];

                            if (disabledEnvironmentSensor.zoneID === outZoneID && disabledEnvironmentSensor.x !== null && disabledEnvironmentSensor.y !== null && disabledEnvironmentSensor.z !== null) {
                                environmentListData.data1++;
                            }
                        }
                    }

                    if (useSensorTypes?.UseManufacture === true && useSensorList?.manufactureSensors?.length > 0) {
                        for (let f = 0; f < useSensorList.manufactureSensors?.length; f++) {
                            const manufactureSensor = useSensorList.manufactureSensors[f];

                            if (manufactureSensor.zoneID === outZoneID && manufactureSensor.x !== null && manufactureSensor.y !== null && manufactureSensor.z !== null) {
                                manufactureListData.data2++;
                            }
                        }

                        for (let g = 0; g < useSensorList.disabledManufactureSensors?.length; g++) {
                            const disabledManufactureSensor = useSensorList.disabledManufactureSensors[g];

                            if (disabledManufactureSensor.zoneID === outZoneID && disabledManufactureSensor.x !== null && disabledManufactureSensor.y !== null && disabledManufactureSensor.z !== null) {
                                manufactureListData.data1++;
                            }
                        }
                    }
                }

                let avg = 0;
                let classCnt = null;

                for (let s = 0; s < siteScores?.length; s++) {
                    const siteScore = siteScores[s];

                    if (buildingGroup.siteID === siteScore.siteID) {
                        avg = siteScore.avg;
                        if (avg > 0) {
                            // 타입별 비율 합산
                            //avg *= 25;
                            avg = Math.floor(avg);
                        }

                        if (siteScore.classCnt)
                            classCnt = siteScore.classCnt;

                        break;
                    }
                }

                data[buildingGroup.siteID].score = avg;
                data[buildingGroup.siteID].classCnt = classCnt;

                if (buildingGroup.buildingDatas?.length > 0) {
                    for (let j = 0; j < buildingGroup.buildingDatas.length; j++) {
                        const building = buildingGroup.buildingDatas[j];

                        if (building.zoneDatas?.length > 0) {
                            for (let z = 0; z < building.zoneDatas.length; z++) {
                                const zone = building.zoneDatas[z];

                                if (useSensorTypes?.UseFire === true && useSensorList?.fireSensors?.length > 0) {
                                    for (let f = 0; f < useSensorList.fireSensors?.length; f++) {
                                        const fireSensor = useSensorList.fireSensors[f];

                                        if (fireSensor.zoneID === zone.id) {
                                            fireListData.data2++; 
                                        }
                                    }

                                    for (let g = 0; g < useSensorList.disabledFireSensors?.length; g++) {
                                        const disabledFireSensor = useSensorList.disabledFireSensors[g];

                                        if (disabledFireSensor.zoneID === zone.id) {
                                            fireListData.data1++; 
                                        }
                                    }
                                }

                                if (useSensorTypes?.UsePSM === true && useSensorList?.psmSensors?.length > 0) {
                                    for (let f = 0; f < useSensorList.psmSensors?.length; f++) {
                                        const psmSensor = useSensorList.psmSensors[f];

                                        if (psmSensor.zoneID === zone.id && psmSensor.x !== null && psmSensor.y !== null && psmSensor.z !== null) {
                                            psmListData.data2++; 
                                        }
                                    }

                                    for (let g = 0; g < useSensorList.disabledPSMSensors?.length; g++) {
                                        const disabledPSMSensor = useSensorList.disabledPSMSensors[g];

                                        if (disabledPSMSensor.zoneID === zone.id) {
                                            psmListData.data1++; 
                                        }
                                    }
                                }

                                if (useSensorList?.cctvs?.length > 0) {
                                    for (let f = 0; f < useSensorList.cctvs.length; f++) {
                                        const cctv = useSensorList.cctvs[f];

                                        if (cctv.zoneID === zone.id) {
                                            cctvListData.data2++; 
                                        }
                                    }

                                    for (let g = 0; g < useSensorList.disabledCCTVs?.length; g++) {
                                        const disabledCCTV = useSensorList.disabledCCTVs[g];

                                        if (disabledCCTV.zoneID === zone.id) {
                                            cctvListData.data1++; 
                                        } 
                                    }
                                }

                                if (useSensorTypes?.UseEnvironment === true && useSensorList?.environmentSensors?.length > 0) {
                                    for (let f = 0; f < useSensorList.environmentSensors?.length; f++) {
                                        const environmentSensor = useSensorList.environmentSensors[f];

                                        if (environmentSensor.zoneID === zone.id && environmentSensor.x !== null && environmentSensor.y !== null && environmentSensor.z !== null) {
                                            environmentListData.data2++;
                                        }
                                    }

                                    for (let g = 0; g < useSensorList.disabledEnvironmentSensors?.length; g++) {
                                        const disabledEnvironmentSensor = useSensorList.disabledEnvironmentSensors[g];

                                        if (disabledEnvironmentSensor.zoneID === zone.id && disabledEnvironmentSensor.x !== null && disabledEnvironmentSensor.y !== null && disabledEnvironmentSensor.z !== null) {
                                            environmentListData.data1++;
                                        }
                                    }
                                }

                                if (useSensorTypes?.UseManufacture === true && useSensorList?.manufactureSensors?.length > 0) {
                                    for (let f = 0; f < useSensorList.manufactureSensors?.length; f++) {
                                        const manufactureSensor = useSensorList.manufactureSensors[f];

                                        if (manufactureSensor.zoneID === zone.id && manufactureSensor.x !== null && manufactureSensor.y !== null && manufactureSensor.z !== null) {
                                            manufactureListData.data2++;
                                        }
                                    }

                                    for (let g = 0; g < useSensorList.disabledManufactureSensors?.length; g++) {
                                        const disabledManufactureSensor = useSensorList.disabledManufactureSensors[g];

                                        if (disabledManufactureSensor.zoneID === zone.id && disabledManufactureSensor.x !== null && disabledManufactureSensor.y !== null && disabledManufactureSensor.z !== null) {
                                            manufactureListData.data1++;
                                        }
                                    }
                                }
                                
                                for (let k = 0; k < todayAlarms?.length; k++) {
                                    const todayAlarm = todayAlarms[k];
                                    let facilityType = todayAlarm.facilityType;

                                    // CCTV 경우 알람 타입 처리
                                    if (facilityType === SDMSResource.facilityType.Intrusion_S1 ||
                                        facilityType === SDMSResource.facilityType.Loiter_S1 ||
                                        facilityType === SDMSResource.facilityType.Collapse_S1 ||
                                        facilityType === SDMSResource.facilityType.Theft_S1 ||
                                        facilityType === SDMSResource.facilityType.Neglect_S1 ||
                                        facilityType === SDMSResource.facilityType.VirtualFence_S1 ||
                                        facilityType === SDMSResource.facilityType.Fire_S1) {
                                        facilityType = SDMSResource.facilityType.Intrusion_S1;
                                    } 
                                    else if (facilityType === SDMSResource.facilityType.Becon_Stay ||
                                        facilityType === SDMSResource.facilityType.Becon_SOS) {
                                        facilityType = SDMSResource.facilityType.Becon_Stay;
                                    }                                    
                                    
                                    if (todayAlarm.isAlarm && todayAlarm.zoneID === zone.id) {
                                        if (facilityType === SDMSResource.facilityType.FIRE) {
                                            fireListData.data3++;
                                        } else if (facilityType === SDMSResource.facilityType.PSM_SENSOR) {
                                            psmListData.data3++;
                                        } else if (facilityType === SDMSResource.facilityType.Intrusion_S1) {
                                            cctvListData.data3++;
                                        } else if (facilityType === SDMSResource.facilityType.Becon_Stay) {
                                            beconListData.data3++;
                                        } else if (facilityType === SDMSResource.facilityType.Environment) {
                                            environmentListData.data3++;
                                        } else if (facilityType === SDMSResource.facilityType.Manufacture) {
                                            manufactureListData.data3++;
                                        }
                                    }    
                                }
                            }
                        }
                    }
                }

                fireListData.data1 = fireListData.data2 - fireListData.data1;
                psmListData.data1 = psmListData.data2 - psmListData.data1;
                cctvListData.data1 = cctvListData.data2 - cctvListData.data1;
                environmentListData.data1 = environmentListData.data2 - environmentListData.data1;
                manufactureListData.data1 = manufactureListData.data2 - manufactureListData.data1;

                if (useSensorTypes?.UseFire === true) {
                    buildingGroupData.sensorList.push(fireListData);
                }
                if (useSensorTypes?.UsePSM === true) {
                    buildingGroupData.sensorList.push(psmListData);
                }

                buildingGroupData.sensorList.push(cctvListData);

                if (useSensorTypes?.UseEnvironment === true) {
                    buildingGroupData.sensorList.push(environmentListData);
                }

                if (useSensorTypes?.UseManufacture === true) {
                    buildingGroupData.sensorList.push(manufactureListData);
                }
                
                //if (useSensorTypes?.UseBecon === true) {
                //    buildingGroupData.sensorList.push(beconListData);
                //}
            }

        } else if (selectSiteID && selectSiteID !== -1) {
            
            for (let i = 0; i < buildingGroupList?.length; i++) {
                const buildingGroup = buildingGroupList[i];

                if (selectSiteID !== buildingGroup.siteID) 
                    continue;

                let buildingGroupData = { siteID: buildingGroup.siteID, buildingGroupName: buildingGroup.displayText, sensorList: [] };
                data[buildingGroup.siteID] = buildingGroupData;

                let fireListData = { titlt: "화재", data1: 0, data2: 0, data3: 0 };
                let psmListData = { titlt: "가스", data1: 0, data2: 0, data3: 0 };
                let cctvListData = { titlt: "CCTV", data1: 0, data2: 0, data3: 0 };
                
                let environmentListData = {titlt: "환경", data1: 0, data2: 0, data3: 0};
                let manufactureListData = { titlt: "제조설비", data1: 0, data2: 0, data3: 0 };

                let beconListData = { titlt: "비콘", data1: 0, data2: 0, data3: 0 };

                if (buildingGroup.buildingDatas?.length > 0) {
                    for (let j = 0; j < buildingGroup.buildingDatas.length; j++) {
                        const building = buildingGroup.buildingDatas[j];

                        if (building.zoneDatas?.length > 0) {
                            for (let z = 0; z < building.zoneDatas.length; z++) {
                                const zone = building.zoneDatas[z];

                                if (useSensorTypes?.UseFire === true && useSensorList?.fireSensors?.length > 0) {
                                    for (let f = 0; f < useSensorList.fireSensors?.length; f++) {
                                        const fireSensor = useSensorList.fireSensors[f];

                                        if (fireSensor.zoneID === zone.id) {
                                            fireListData.data2++; 
                                        }
                                    }

                                    for (let g = 0; g < useSensorList.disabledFireSensors?.length; g++) {
                                        const disabledFireSensor = useSensorList.disabledFireSensors[g];

                                        if (disabledFireSensor.zoneID === zone.id) {
                                            fireListData.data1++; 
                                        }
                                    }
                                }

                                if (useSensorTypes?.UsePSM === true && useSensorList?.psmSensors?.length > 0) {
                                    for (let f = 0; f < useSensorList.psmSensors?.length; f++) {
                                        const psmSensor = useSensorList.psmSensors[f];

                                        if (psmSensor.zoneID === zone.id) {
                                            psmListData.data2++; 
                                        }
                                    }

                                    for (let g = 0; g < useSensorList.disabledPSMSensors?.length; g++) {
                                        const disabledPSMSensor = useSensorList.disabledPSMSensors[g];

                                        if (disabledPSMSensor.zoneID === zone.id) {
                                            psmListData.data1++; 
                                        }
                                    }
                                }

                                if (useSensorList?.cctvs?.length > 0) {
                                    for (let f = 0; f < useSensorList.cctvs.length; f++) {
                                        const cctv = useSensorList.cctvs[f];

                                        if (cctv.zoneID === zone.id) {
                                            cctvListData.data2++; 
                                        }
                                    }

                                    for (let g = 0; g < useSensorList.disabledCCTVs?.length; g++) {
                                        const disabledCCTV = useSensorList.disabledCCTVs[g];

                                        if (disabledCCTV.zoneID === zone.id) {
                                            cctvListData.data1++; 
                                        }
                                    }
                                }
                                
                                if (useSensorTypes?.UseEnvironment === true && useSensorList?.environmentSensors?.length > 0) {
                                    for (let f = 0; f < useSensorList.environmentSensors?.length; f++) {
                                        const environmentSensor = useSensorList.environmentSensors[f];

                                        if (environmentSensor.zoneID === zone.id && environmentSensor.x !== null && environmentSensor.y !== null && environmentSensor.z !== null) {
                                            environmentListData.data2++;
                                        }
                                    }

                                    for (let g = 0; g < useSensorList.disabledEnvironmentSensors?.length; g++) {
                                        const disabledEnvironmentSensor = useSensorList.disabledEnvironmentSensors[g];

                                        if (disabledEnvironmentSensor.zoneID === zone.id && disabledEnvironmentSensor.x !== null && disabledEnvironmentSensor.y !== null && disabledEnvironmentSensor.z !== null) {
                                            environmentListData.data1++;
                                        }
                                    }
                                }

                                if (useSensorTypes?.UseManufacture === true && useSensorList?.manufactureSensors?.length > 0) {
                                    for (let f = 0; f < useSensorList.manufactureSensors?.length; f++) {
                                        const manufactureSensor = useSensorList.manufactureSensors[f];

                                        if (manufactureSensor.zoneID === zone.id && manufactureSensor.x !== null && manufactureSensor.y !== null && manufactureSensor.z !== null) {
                                            manufactureListData.data2++;
                                        }
                                    }

                                    for (let g = 0; g < useSensorList.disabledManufactureSensors?.length; g++) {
                                        const disabledManufactureSensor = useSensorList.disabledManufactureSensors[g];

                                        if (disabledManufactureSensor.zoneID === zone.id && disabledManufactureSensor.x !== null && disabledManufactureSensor.y !== null && disabledManufactureSensor.z !== null) {
                                            manufactureListData.data1++;
                                        }
                                    }
                                }

                                for (let k = 0; k < todayAlarms?.length; k++) {
                                    const todayAlarm = todayAlarms[k];
                                    let facilityType = todayAlarm.facilityType;

                                    // CCTV 경우 알람 타입 처리
                                    if (facilityType === SDMSResource.facilityType.Intrusion_S1 ||
                                        facilityType === SDMSResource.facilityType.Loiter_S1 ||
                                        facilityType === SDMSResource.facilityType.Collapse_S1 ||
                                        facilityType === SDMSResource.facilityType.Theft_S1 ||
                                        facilityType === SDMSResource.facilityType.Neglect_S1 ||
                                        facilityType === SDMSResource.facilityType.VirtualFence_S1 ||
                                        facilityType === SDMSResource.facilityType.Fire_S1) {
                                        facilityType = SDMSResource.facilityType.Intrusion_S1;
                                    } 
                                    else if (facilityType === SDMSResource.facilityType.Becon_Stay ||
                                        facilityType === SDMSResource.facilityType.Becon_SOS) {
                                        facilityType = SDMSResource.facilityType.Becon_Stay;
                                    }        
        
                                    if (todayAlarm.isAlarm && todayAlarm.zoneID === zone.id) {
                                        if (facilityType === SDMSResource.facilityType.FIRE) {
                                            fireListData.data3++;
                                        } else if (facilityType === SDMSResource.facilityType.PSM_SENSOR) {
                                            psmListData.data3++;
                                        } else if (facilityType === SDMSResource.facilityType.Intrusion_S1) {
                                            cctvListData.data3++;
                                        } else if (facilityType === SDMSResource.facilityType.Becon_Stay) {
                                            beconListData.data3++;
                                        } else if (facilityType === SDMSResource.facilityType.Environment) {
                                            environmentListData.data3++;
                                        } else if (facilityType === SDMSResource.facilityType.Manufacture) {
                                            manufactureListData.data3++;
                                        }
                                    }    
                                }
                            }
                        }
                    }
                }

                fireListData.data1 = fireListData.data2 - fireListData.data1;
                psmListData.data1 = psmListData.data2 - psmListData.data1;
                cctvListData.data1 = cctvListData.data2 - cctvListData.data1;

                environmentListData.data1 = environmentListData.data2 - environmentListData.data1;
                manufactureListData.data1 = manufactureListData.data2 - manufactureListData.data1;

                if (useSensorTypes?.UseFire === true) {
                    buildingGroupData.sensorList.push(fireListData);
                }
                if (useSensorTypes?.UsePSM === true) {
                    buildingGroupData.sensorList.push(psmListData);
                }

                buildingGroupData.sensorList.push(cctvListData);

                if (useSensorTypes?.UseEnvironment === true) {
                    buildingGroupData.sensorList.push(environmentListData);
                }

                if (useSensorTypes?.UseManufacture === true) {
                    buildingGroupData.sensorList.push(manufactureListData);
                }

                //if (useSensorTypes?.UseBecon === true) {
                //    buildingGroupData.sensorList.push(beconListData);
                //}
            }
        }

        return data;
    }

    onClickSelectSite = (siteID) => {
        this.props.onClickSelectSite(siteID);
    }

    useEquipZoneAssess() {
        const userInfo = ProjectResource.getUserInfo();
        return (userInfo?.options?.ui?.useEquipZoneAssess === true);
    }

    getDisplayView = (viewData) => {
        const selectSiteID = this.props.selectSiteID;
        const siteID = ProjectResource.SiteID;
        const userInfo = ProjectResource.getUserInfo();        

        let displayView = null;
        
        if (selectSiteID === -1 && viewData) {
            displayView = <>
                <div className="campusS" onClick={() => this.props.onClickSelectSite(ProjectResource.Site.Wonik_A)}>
                    <div className={"campus-img" + (userInfo.levelID === AccountResource.accountLevelID.wonikCEO ? "-notShadow" : "") + " campus-a"} />
                    <p className='title'>{viewData[ProjectResource.Site.Wonik_A]?.buildingGroupName}</p>
                    {
                        this.useEquipZoneAssess() &&                                               
                        <>
                            {/*
                            <div className='averageScore'><span>안전평가</span><p>{viewData[ProjectResource.Site.Wonik_A]?.score >= 0 ? viewData[ProjectResource.Site.Wonik_A].score + "점" : "-"}</p></div>
                            */}                           
                            <div className={'averageScoreBox'}>
                                <div className={'averageScoreText'}>안전평가 {viewData[ProjectResource.Site.Wonik_A]?.score >= 0 ? viewData[ProjectResource.Site.Wonik_A].score + "점" : "-"}</div>
                                <div className={'averageFlex'}><span className={'averageA'}>A등급</span><p>{viewData[ProjectResource.Site.Wonik_A]?.classCnt?.A >= 0 ? viewData[ProjectResource.Site.Wonik_A].classCnt.A : "0"}구역</p></div>
                                <div className={'averageFlex'}><span className={'averageB'}>B등급</span><p>{viewData[ProjectResource.Site.Wonik_A]?.classCnt?.B >= 0 ? viewData[ProjectResource.Site.Wonik_A].classCnt.B : "0"}구역</p></div>
                                <div className={'averageFlex'}><span className={'averageC'}>C등급</span><p>{viewData[ProjectResource.Site.Wonik_A]?.classCnt?.C >= 0 ? viewData[ProjectResource.Site.Wonik_A].classCnt.C : "0"}구역</p></div>
                            </div>                                                     
                        </>                        
                    }                    
                    <div className='board-data-wrap'>
                        {
                            userInfo.levelID !== AccountResource.accountLevelID.wonikCEO && userInfo.levelID !== AccountResource.accountLevelID.wonikSafety && userInfo.levelID !== AccountResource.accountLevelID.wonikSafeAdmin &&
                            viewData[ProjectResource.Site.Wonik_A]?.sensorList.map((data, index) =>
                            <div key={index} className={"board-data" + (data.data3>0 ? " on" : "")}>
                                <div className='board-data-title'>
                                    <p>{data.titlt}</p>
                                </div>
                                <div className='board-data-detail'>
                                    <span>{data.data1}</span>
                                    <span>{data.data2}</span>
                                    <span>{data.data3}</span>
                                </div>
                            </div>)
                        }
                    </div>
                </div>
                <div className="campusS" onClick={() => this.props.onClickSelectSite(ProjectResource.Site.Wonik_C)}>
                    <div className={"campus-img" + (userInfo.levelID === AccountResource.accountLevelID.wonikCEO ? "-notShadow" : "") + " campus-c"} />
                    <p className='title'>{viewData[ProjectResource.Site.Wonik_C]?.buildingGroupName}</p>
                    {
                        this.useEquipZoneAssess() &&                      
                        <>
                            {/*
                            <div className='averageScore'><span>안전평가</span><p>{viewData[ProjectResource.Site.Wonik_C]?.score >= 0 ? viewData[ProjectResource.Site.Wonik_C].score + "점" : "-"}</p></div>
                            */}                            
                            <div className={'averageScoreBox'}>
                                <div className={'averageScoreText'}>안전평가 {viewData[ProjectResource.Site.Wonik_C]?.score >= 0 ? viewData[ProjectResource.Site.Wonik_C].score + "점" : "-"}</div>
                                <div className={'averageFlex'}><span className={'averageA'}>A등급</span><p>{viewData[ProjectResource.Site.Wonik_C]?.classCnt?.A >= 0 ? viewData[ProjectResource.Site.Wonik_C].classCnt.A : "0"}구역</p></div>
                                <div className={'averageFlex'}><span className={'averageB'}>B등급</span><p>{viewData[ProjectResource.Site.Wonik_C]?.classCnt?.B >= 0 ? viewData[ProjectResource.Site.Wonik_C].classCnt.B : "0"}구역</p></div>
                                <div className={'averageFlex'}><span className={'averageC'}>C등급</span><p>{viewData[ProjectResource.Site.Wonik_C]?.classCnt?.C >= 0 ? viewData[ProjectResource.Site.Wonik_C].classCnt.C : "0"}구역</p></div>
                            </div>                            
                        </>                                                
                    }                    
                    <div className='board-data-wrap'>
                        {
                            userInfo.levelID !== AccountResource.accountLevelID.wonikCEO && userInfo.levelID !== AccountResource.accountLevelID.wonikSafety && userInfo.levelID !== AccountResource.accountLevelID.wonikSafeAdmin &&
                            viewData[ProjectResource.Site.Wonik_C]?.sensorList.map((data, index) =>
                            <div key={index} className={"board-data" + (data.data3>0 ? " on" : "")}>
                                <div className='board-data-title'>
                                    <p>{data.titlt}</p>
                                </div>
                                <div className='board-data-detail'>
                                    <span>{data.data1}</span>
                                    <span>{data.data2}</span>
                                    <span>{data.data3}</span>
                                </div>
                            </div>)
                        }
                    </div>
                </div>
                <div className="campusS" onClick={() => this.props.onClickSelectSite(ProjectResource.Site.Wonik)}>
                    <div className={"campus-img" + (userInfo.levelID === AccountResource.accountLevelID.wonikCEO ? "-notShadow" : "") + " campus-h"} />
                    <p className='title'>{viewData[ProjectResource.Site.Wonik]?.buildingGroupName}</p>
                    {
                        this.useEquipZoneAssess() &&                                                
                        <>
                            {/*
                            <div className='averageScore'><span>안전평가</span><p>{viewData[ProjectResource.Site.Wonik]?.score >= 0 ? viewData[ProjectResource.Site.Wonik].score + "점" : "-"}</p></div>                            
                            */}
                            <div className={'averageScoreBox'}>
                                <div className={'averageScoreText'}>안전평가 {viewData[ProjectResource.Site.Wonik]?.score >= 0 ? viewData[ProjectResource.Site.Wonik].score + "점" : "-"}</div>
                                <div className={'averageFlex'}><span className={'averageA'}>A등급</span><p>{viewData[ProjectResource.Site.Wonik]?.classCnt?.A >= 0 ? viewData[ProjectResource.Site.Wonik].classCnt.A : "0"}구역</p></div>
                                <div className={'averageFlex'}><span className={'averageB'}>B등급</span><p>{viewData[ProjectResource.Site.Wonik]?.classCnt?.B >= 0 ? viewData[ProjectResource.Site.Wonik].classCnt.B : "0"}구역</p></div>
                                <div className={'averageFlex'}><span className={'averageC'}>C등급</span><p>{viewData[ProjectResource.Site.Wonik]?.classCnt?.C >= 0 ? viewData[ProjectResource.Site.Wonik].classCnt.C : "0"}구역</p></div>
                            </div>                            
                        </>                                                
                    }                    
                    <div className='board-data-wrap'>
                        {
                            userInfo.levelID !== AccountResource.accountLevelID.wonikCEO && userInfo.levelID !== AccountResource.accountLevelID.wonikSafety && userInfo.levelID !== AccountResource.accountLevelID.wonikSafeAdmin &&
                            viewData[ProjectResource.Site.Wonik]?.sensorList.map((data, index) =>
                            <div key={index} className={"board-data" + (data.data3>0 ? " on" : "")}>
                                <div className='board-data-title'>
                                    <p>{data.titlt}</p>
                                </div>
                                <div className='board-data-detail'>
                                    <span>{data.data1}</span>
                                    <span>{data.data2}</span>
                                    <span>{data.data3}</span>
                                </div>
                            </div>)
                        }
                    </div>
                </div>
                <div className="campusS" onClick={() => this.props.onClickSelectSite(ProjectResource.Site.Wonik_S)}>
                    <div className={"campus-img" + (userInfo.levelID === AccountResource.accountLevelID.wonikCEO ? "-notShadow" : "") + " campus-s"} />
                    <p className='title'>{viewData[ProjectResource.Site.Wonik_S]?.buildingGroupName}</p>
                    {
                        this.useEquipZoneAssess() &&                                                
                        <>
                            {/*
                            <div className='averageScore'><span>안전평가</span><p>{viewData[ProjectResource.Site.Wonik_S]?.score >= 0 ? viewData[ProjectResource.Site.Wonik_S].score + "점" : "-"}</p></div>
                            */}
                            <div className={'averageScoreBox'}>
                                <div className={'averageScoreText'}>안전평가 {viewData[ProjectResource.Site.Wonik_S]?.score >= 0 ? viewData[ProjectResource.Site.Wonik_S].score + "점" : "-"}</div>
                                <div className={'averageFlex'}><span className={'averageA'}>A등급</span><p>{viewData[ProjectResource.Site.Wonik_S]?.classCnt?.A >= 0 ? viewData[ProjectResource.Site.Wonik_S].classCnt.A : "0"}구역</p></div>
                                <div className={'averageFlex'}><span className={'averageB'}>B등급</span><p>{viewData[ProjectResource.Site.Wonik_S]?.classCnt?.B >= 0 ? viewData[ProjectResource.Site.Wonik_S].classCnt.B : "0"}구역</p></div>
                                <div className={'averageFlex'}><span className={'averageC'}>C등급</span><p>{viewData[ProjectResource.Site.Wonik_S]?.classCnt?.C >= 0 ? viewData[ProjectResource.Site.Wonik_S].classCnt.C : "0"}구역</p></div>
                            </div>                        
                        </>
                        
                    }
                    <div className='board-data-wrap'>
                        {
                            userInfo.levelID !== AccountResource.accountLevelID.wonikCEO && userInfo.levelID !== AccountResource.accountLevelID.wonikSafety && userInfo.levelID !== AccountResource.accountLevelID.wonikSafeAdmin &&
                            viewData[ProjectResource.Site.Wonik_S]?.sensorList.map((data, index) =>
                            <div key={index} className={"board-data" + (data.data3>0 ? " on" : "")}>
                                <div className='board-data-title'>
                                    <p>{data.titlt}</p>
                                </div>
                                <div className='board-data-detail'>
                                    <span>{data.data1}</span>
                                    <span>{data.data2}</span>
                                    <span>{data.data3}</span>
                                </div>
                            </div>)
                        }
                    </div>
                </div>
                <div className="campusS" onClick={() => this.props.onClickSelectSite(ProjectResource.Site.Wonik_V)}>
                    <div className={"campus-img" + (userInfo.levelID === AccountResource.accountLevelID.wonikCEO ? "-notShadow" : "") + " campus-v"} />
                    <p className='title'>{viewData[ProjectResource.Site.Wonik_V]?.buildingGroupName}</p>
                    {
                        this.useEquipZoneAssess() &&
                        <>
                            {/*
                            <div className='averageScore'><span>안전평가</span><p>{viewData[ProjectResource.Site.Wonik_V]?.score >= 0 ? viewData[ProjectResource.Site.Wonik_V].score + "점" : "-"}</p></div>
                             */}
                            <div className={'averageScoreBox'}>
                                <div className={'averageScoreText'}>안전평가 {viewData[ProjectResource.Site.Wonik_V]?.score >= 0 ? viewData[ProjectResource.Site.Wonik_V].score + "점" : "-"}</div>
                                <div className={'averageFlex'}><span className={'averageA'}>A등급</span><p>{viewData[ProjectResource.Site.Wonik_V]?.classCnt?.A >= 0 ? viewData[ProjectResource.Site.Wonik_V].classCnt.A : "0"}구역</p></div>
                                <div className={'averageFlex'}><span className={'averageB'}>B등급</span><p>{viewData[ProjectResource.Site.Wonik_V]?.classCnt?.B >= 0 ? viewData[ProjectResource.Site.Wonik_V].classCnt.B : "0"}구역</p></div>
                                <div className={'averageFlex'}><span className={'averageC'}>C등급</span><p>{viewData[ProjectResource.Site.Wonik_V]?.classCnt?.C >= 0 ? viewData[ProjectResource.Site.Wonik_V].classCnt.C : "0"}구역</p></div>
                            </div>                           
                        </>
                    }                    
                    <div className='board-data-wrap'>
                        {
                            userInfo.levelID !== AccountResource.accountLevelID.wonikCEO && userInfo.levelID !== AccountResource.accountLevelID.wonikSafety && userInfo.levelID !== AccountResource.accountLevelID.wonikSafeAdmin &&
                            viewData[ProjectResource.Site.Wonik_V]?.sensorList.map((data, index) =>
                            <div key={index} className={"board-data" + (data.data3>0 ? " on" : "")}>
                                <div className='board-data-title'>
                                    <p>{data.titlt}</p>
                                </div>
                                <div className='board-data-detail'>
                                    <span>{data.data1}</span>
                                    <span>{data.data2}</span>
                                    <span>{data.data3}</span>
                                </div>
                            </div>)
                        }
                    </div>
                </div>
            </>;



        } else if (selectSiteID && selectSiteID !== -1 && viewData && viewData[selectSiteID]) {
            let backBtn = null;
            const siteDetailData = this.state.siteDetailData;

            const detailViewUI = siteDetailData[selectSiteID];

            const userInfo = ProjectResource.getUserInfo();
            if (userInfo.levelID === AccountResource.accountLevelID.master || 
                userInfo.levelID === AccountResource.accountLevelID.wonikCEO ||
                userInfo.levelID === AccountResource.accountLevelID.wonikSafety ||
                userInfo.levelID === AccountResource.accountLevelID.wonikSafeAdmin) {
                backBtn = <button onClick={() => this.props.onClickSelectSite(-1)}>back</button>;
            }

            let maxSlidesToShow = 5;
            if(maxSlidesToShow > viewData[selectSiteID].sensorList.length) {
                maxSlidesToShow = viewData[selectSiteID].sensorList.length;
            }

            const settings = {
                dots: false,
                infinite: true,
                speed: 500,
                slidesToShow: maxSlidesToShow,
                slidesToScroll: 1,
            };

            displayView = <BoardViewDetail className="board-view-detail-area" siteid={viewData[selectSiteID].siteID}>
                <div className='board-view-detail-top'>
                    <div className='board-view-detail-top-title'>
                        <p>{viewData[selectSiteID].buildingGroupName}</p>
                        {backBtn}
                    </div>
                    <button type="button" className='board-view-detail-top-btn' onClick={this.onClick3D}>
                        <span>3D 관제</span>
                    </button>
                </div>
                <div className='board-view-detail-middle'>
                    <div className='board-view-detail-middle-title'>
                        <h1>캠퍼스 정보</h1>
                    </div>
                    <div className='board-view-detail-middle-content'>
                        {detailViewUI}
                    </div>
                </div>
                <div className='board-view-detail-bottom'>
                    <Slider {...settings} className='board-view-detail-content'>
                        {
                            userInfo.levelID !== AccountResource.accountLevelID.wonikCEO && userInfo.levelID !== AccountResource.accountLevelID.wonikSafety && userInfo.levelID !== AccountResource.accountLevelID.wonikSafeAdmin &&
                            viewData[selectSiteID].sensorList.map((data, index) => 
                            <div key={index} className={"board-data " + (data.data3>0 ? " on" : "")}>
                                <div className='board-data-title'>
                                <p>{data.titlt}</p>
                                </div>
                                <div className='board-data-detail'>
                                    <span>{data.data1}</span>
                                    <span>{data.data2}</span>
                                    <span>{data.data3}</span>
                                </div>
                            </div>)
                        }
                    </Slider>
                </div>
            </BoardViewDetail>
        }

        return displayView;
    }

    onClick3D = () => {
        const selectSiteID = this.props.selectSiteID;
        const chk = ProjectResource.setShowSiteID(selectSiteID);
        
        // SDMS 페이지 띄우기
        if (chk === true) {
            window.open(ProjectResource.path.sdms);
        }
    }

    render() {
        const viewData = this.getViewData();
        const displayView = this.getDisplayView(viewData);

        const userInfo = ProjectResource.getUserInfo();
        const viewClass = ((userInfo.levelID !== AccountResource.accountLevelID.wonikSafety && userInfo.levelID !== AccountResource.accountLevelID.wonikSafeAdmin) ? "board-view-area" : "board-view-area-security-mode")

		return (
            <BoardView className={viewClass}>
                {displayView}
            </BoardView>
        );
    }
}

export default withRouter(BoardViewWonik);