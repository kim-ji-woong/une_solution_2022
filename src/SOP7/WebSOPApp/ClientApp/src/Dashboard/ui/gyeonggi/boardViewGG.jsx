import React from 'react';
import { withRouter } from 'react-router-dom';

import { BoardViewComponent } from '../../styled/dashboardGG';
import SDMSResource from '../../../SDMS/resource/id';
import ProjectResource from '../../../Root/resource/id';

const BoardView = (props) => {

    const getViewData = () => {
        const buildingGroupList = props.buildingGroupList;
        const useSensorList = props.useSensorList;
        const useSensorTypes = props.useSensorTypes;
        const todayAllAlarms = props.todayAllAlarms;

        const siteID = ProjectResource.SiteID;

        let data = [];

        if (buildingGroupList !== undefined && buildingGroupList !== null) {
            for (let i = 0; i < buildingGroupList?.length; i++) {
                const buildingGroup = buildingGroupList[i];
    
                let buildingGroupData = { siteID: buildingGroup.siteID, buildingGroupName: buildingGroup.displayText, sensorList: [] };
                data[buildingGroup.siteID] = buildingGroupData;
    
                let fireListData = { type: SDMSResource.facilityType.FIRE, title: "화재", data1: 0, data2: 0, data3: 0, isAlarm: false };
                let cctvListData = { type: SDMSResource.facilityType.CCTV, title: "CCTV", data1: 0, data2: 0, data3: 0, isAlarm: false };
                let earthquakeListData = { type: SDMSResource.facilityType.Earthquake, title: "지진", data1: 0, data2: 0, data3: 0, isAlarm: false };
                let emergencyBellListData = { type: SDMSResource.facilityType.EmergencyBell, title: "비상벨", data1: 0, data2: 0, data3: 0, isAlarm: false };
                let electricListData = { type: SDMSResource.facilityType.BLACKOUT, title: "전력", data1: 0, data2: 0, data3: 0, isAlarm: false };
                let waterLevelListData = { type: SDMSResource.facilityType.WaterLevel, title: "침수", data1: 0, data2: 0, data3: 0, isAlarm: false };
                let terrorListData = { type: SDMSResource.facilityType.Terror, title: "테러", data1: 0, data2: 0, data3: 0, isAlarm: false };
                let psmListData = { type: SDMSResource.facilityType.PSM_SENSOR, title: "가스누출", data1: 0, data2: 0, data3: 0, isAlarm: false };

                if (siteID) {
                    for (let k = 0; k < todayAllAlarms?.length; k++) {
                        const todayAlarm = todayAllAlarms[k];
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
                        // 전력일 경우 알람 타입 처리
                        else if (facilityType === SDMSResource.facilityType.BLACKOUT ||
                            facilityType === SDMSResource.facilityType.LowBattery) {
                            facilityType = SDMSResource.facilityType.BLACKOUT
                        }
    
                        if (facilityType === SDMSResource.facilityType.FIRE && todayAlarm.siteID === buildingGroup.siteID) {
                            fireListData.data3++;
                            fireListData.isAlarm = todayAlarm.isAlarm || fireListData.isAlarm;
                        } else if (facilityType === SDMSResource.facilityType.Intrusion_S1 && todayAlarm.siteID === buildingGroup.siteID) {
                            cctvListData.data3++;
                            cctvListData.isAlarm = todayAlarm.isAlarm || cctvListData.isAlarm;
                        } else if (facilityType === SDMSResource.facilityType.Earthquake && todayAlarm.siteID === buildingGroup.siteID) {
                            earthquakeListData.data3++;
                            earthquakeListData.isAlarm = todayAlarm.isAlarm || earthquakeListData.isAlarm;
                        } else if (facilityType === SDMSResource.facilityType.EmergencyBell && todayAlarm.siteID === buildingGroup.siteID) {
                            emergencyBellListData.data3++;
                            emergencyBellListData.isAlarm = todayAlarm.isAlarm || emergencyBellListData.isAlarm;
                        } else if (facilityType === SDMSResource.facilityType.BLACKOUT && todayAlarm.siteID === buildingGroup.siteID) {
                            electricListData.data3++;
                            electricListData.isAlarm = todayAlarm.isAlarm || electricListData.isAlarm;
                        } else if (facilityType === SDMSResource.facilityType.WaterLevel && todayAlarm.siteID === buildingGroup.siteID) {
                            waterLevelListData.data3++;
                            waterLevelListData.isAlarm = todayAlarm.isAlarm || waterLevelListData.isAlarm;
                        } else if (facilityType === SDMSResource.facilityType.Terror && todayAlarm.siteID === buildingGroup.siteID) {
                            terrorListData.data3++;
                            terrorListData.isAlarm = todayAlarm.isAlarm || terrorListData.isAlarm;
                        } else if (facilityType === SDMSResource.facilityType.PSM_SENSOR && todayAlarm.siteID === buildingGroup.siteID) {
                            psmListData.data3++;
                            psmListData.isAlarm = todayAlarm.isAlarm || psmListData.isAlarm;
                        } 
                    }
    
                    if (useSensorTypes?.UseFire && useSensorList?.fireSensors?.length > 0) {
                        for (let f = 0; f < useSensorList.fireSensors?.length; f++) {
                            const fireSensor = useSensorList.fireSensors[f];
    
                            if (fireSensor.siteID === buildingGroup.siteID) {
                                fireListData.data2++;
                            }
                        }
    
                        for (let g = 0; g < useSensorList.disabledFireSensors?.length; g++) {
                            const disabledFireSensor = useSensorList.disabledFireSensors[g];
    
                            if (disabledFireSensor.siteID === buildingGroup.siteID) {
                                fireListData.data1++;
                            }
                        }
                    }
    
                    if (useSensorList?.cctvs?.length > 0) {
                        for (let f = 0; f < useSensorList.cctvs.length; f++) {
                            const cctv = useSensorList.cctvs[f];
    
                            if (cctv.siteID === buildingGroup.siteID) {
                                cctvListData.data2++;
                            }
                        }
    
                        for (let g = 0; g < useSensorList.disabledCCTVs?.length; g++) {
                            const disabledCCTV = useSensorList.disabledCCTVs[g];
    
                            if (disabledCCTV.siteID === buildingGroup.siteID) {
                                cctvListData.data1++;
                            }
                        }
                    }

                    fireListData.data1 = fireListData.data2 - fireListData.data1;
                    cctvListData.data1 = cctvListData.data2 - cctvListData.data1;
    
                    buildingGroupData.sensorList.push(fireListData);
                    buildingGroupData.sensorList.push(cctvListData);
                    buildingGroupData.sensorList.push(earthquakeListData);
                    buildingGroupData.sensorList.push(emergencyBellListData);
                    buildingGroupData.sensorList.push(electricListData);
                    buildingGroupData.sensorList.push(waterLevelListData);
                    buildingGroupData.sensorList.push(terrorListData);
                    buildingGroupData.sensorList.push(psmListData);
                }
            }
        }

        return data;
    }

    const onClickGoSDMS = (siteID) => {
        const chk = ProjectResource.setShowSiteID(siteID);
        
        // SDMS 페이지 띄우기
        if (chk === true) {
            window.open(ProjectResource.path.sdms);
        }
    }

    const getDisplayView = () => {
        let ui_41 = []; // 도청도의회
        let ui_43 = []; // 대표도서관
        let ui_45 = []; // 신용보증재단
        let ui_46 = []; // 교육청
        let ui_44 = []; // 복합시설관
        let ui_47 = []; // 주택도시공사 신사옥

        
        const data = getViewData();
        const data_41 = data[ProjectResource.Site.GG_B];
        const data_43 = data[ProjectResource.Site.GG_D];
        const data_45 = data[ProjectResource.Site.GG_F];
        const data_46 = data[ProjectResource.Site.GG_G];
        const data_44 = data[ProjectResource.Site.GG_E];
        const data_47 = data[ProjectResource.Site.GG_H];

        let isAlarm_41 = false;
        let isAlarm_43 = false;
        let isAlarm_45 = false;
        let isAlarm_46 = false;
        let isAlarm_44 = false;
        let isAlarm_47 = false;

        if (data_41) {
            for (let sensor of data_41.sensorList) {
                if (sensor.isAlarm) {
                    isAlarm_41 = true;
                    break;
                }
            }

            ui_41.push(
                <div className='board-data-wrap'>
                    {
                        data_41.sensorList.map((data) => {
                            if (data.type === SDMSResource.facilityType.FIRE || data.type === SDMSResource.facilityType.CCTV) {
                                return (
                                    <div className="board-data" key={data.title}>
                                        <div className="board-data-title">
                                        <p>{data.title}</p>
                                        </div>
                                        <div className="board-data-detail">
                                        <span>{data.data1}</span>
                                        <span>{data.data2}</span>
                                        <span>{data.data3}</span>
                                        </div>
                                    </div>
                                );
                            } else {
                                return null;
                            }
                        })
                    }
                </div>
            );
        }

        if (data_43) {
            for (let sensor of data_43.sensorList) {
                if (sensor.isAlarm) {
                    isAlarm_43 = true;
                    break;
                }
            }

            ui_43.push(
                <div className='board-data-wrap'>
                    {
                        data_43.sensorList.map((data) => {
                            if (data.type === SDMSResource.facilityType.FIRE || data.type === SDMSResource.facilityType.CCTV) {
                                return (
                                    <div className="board-data" key={data.title}>
                                        <div className="board-data-title">
                                        <p>{data.title}</p>
                                        </div>
                                        <div className="board-data-detail">
                                        <span>{data.data1}</span>
                                        <span>{data.data2}</span>
                                        <span>{data.data3}</span>
                                        </div>
                                    </div>
                                );
                            } else {
                                return null;
                            }
                        })
                    }
                </div>
            );
        }

        if (data_45) {
            for (let sensor of data_45.sensorList) {
                if (sensor.isAlarm) {
                    isAlarm_45 = true;
                    break;
                }
            }

            ui_45.push(
                <div className='board-data-wrap'>
                    {
                        data_45.sensorList.map((data) => {
                            if (data.type === SDMSResource.facilityType.FIRE || data.type === SDMSResource.facilityType.CCTV) {
                                return (
                                    <div className="board-data" key={data.title}>
                                        <div className="board-data-title">
                                        <p>{data.title}</p>
                                        </div>
                                        <div className="board-data-detail">
                                        <span>{data.data1}</span>
                                        <span>{data.data2}</span>
                                        <span>{data.data3}</span>
                                        </div>
                                    </div>
                                );
                            } else {
                                return null;
                            }
                        })
                    }
                </div>
            );
        }

        if (data_46) {
            for (let sensor of data_46.sensorList) {
                if (sensor.isAlarm) {
                    isAlarm_46 = true;
                    break;
                }
            }

            ui_46.push(
                <div className='board-data-wrap'>
                    {
                        data_46.sensorList.map((data) => {
                            if (data.type === SDMSResource.facilityType.FIRE || data.type === SDMSResource.facilityType.CCTV) {
                                return (
                                    <div className="board-data" key={data.title}>
                                        <div className="board-data-title">
                                        <p>{data.title}</p>
                                        </div>
                                        <div className="board-data-detail">
                                        <span>{data.data1}</span>
                                        <span>{data.data2}</span>
                                        <span>{data.data3}</span>
                                        </div>
                                    </div>
                                );
                            } else {
                                return null;
                            }
                        })
                    }
                </div>
            );
        }

        if (data_44) {
            for (let sensor of data_44.sensorList) {
                if (sensor.isAlarm) {
                    isAlarm_44 = true;
                    break;
                }
            }

            ui_44.push(
                <div className='board-data-wrap'>
                    {
                        data_44.sensorList.map((data) => {
                            if (data.type === SDMSResource.facilityType.FIRE || data.type === SDMSResource.facilityType.CCTV) {
                                return (
                                    <div className="board-data" key={data.title}>
                                        <div className="board-data-title">
                                        <p>{data.title}</p>
                                        </div>
                                        <div className="board-data-detail">
                                        <span>{data.data1}</span>
                                        <span>{data.data2}</span>
                                        <span>{data.data3}</span>
                                        </div>
                                    </div>
                                );
                            } else {
                                return null;
                            }
                        })
                    }
                </div>
            );
        }

        if (data_47) {
            for (let sensor of data_47.sensorList) {
                if (sensor.isAlarm) {
                    isAlarm_47 = true;
                    break;
                }
            }

            ui_47.push(
                <div className='board-data-wrap'>
                    {
                        data_47.sensorList.map((data) => {
                            if (data.type === SDMSResource.facilityType.FIRE || data.type === SDMSResource.facilityType.CCTV) {
                                return (
                                    <div className="board-data" key={data.title}>
                                        <div className="board-data-title">
                                        <p>{data.title}</p>
                                        </div>
                                        <div className="board-data-detail">
                                        <span>{data.data1}</span>
                                        <span>{data.data2}</span>
                                        <span>{data.data3}</span>
                                        </div>
                                    </div>
                                );
                            } else {
                                return null;
                            }
                        })
                    }
                </div>
            );
        }

        return [ui_41, isAlarm_41, ui_43, isAlarm_43, ui_45, isAlarm_45, ui_46, isAlarm_46, ui_44, isAlarm_44, ui_47, isAlarm_47];
    }

    const [ui_41, isAlarm_41, ui_43, isAlarm_43, ui_45, isAlarm_45, ui_46, isAlarm_46, ui_44, isAlarm_44, ui_47, isAlarm_47] = getDisplayView();

    return (
        <BoardViewComponent className='board-view-area'>
            <section>
                <div 
                    className={isAlarm_41 ? "campusS on" : "campusS"} 
                    onClick={() => onClickGoSDMS(ProjectResource.Site.GG_B)}
                >
                    <div className={"campus-img" + " campus-a"} />
                    <p className='title'>경기도청/도의회</p>
                    {ui_41}
                </div>
                <div 
                    className={isAlarm_43 ? "campusS on" : "campusS"} 
                    onClick={() => onClickGoSDMS(ProjectResource.Site.GG_D)}
                >
                    <div className={"campus-img" + " campus-b"} />
                    <p className='title'>대표도서관</p>
                    {ui_43}
                </div>
                <div 
                    className={isAlarm_45 ? "campusS on" : "campusS"} 
                    onClick={() => onClickGoSDMS(ProjectResource.Site.GG_F)}
                >
                    <div className={"campus-img" + " campus-c"} />
                    <p className='title'>신용보증재단</p>
                    {ui_45}
                </div>
            </section>
            <section>
                <div 
                    className={isAlarm_46 ? "campusS on" : "campusS"} 
                    onClick={() => onClickGoSDMS(ProjectResource.Site.GG_G)}
                >
                    <div className={"campus-img" + " campus-e"} />
                    <p className='title'>교육청</p>
                    {ui_46}
                </div>
                <div 
                    className={isAlarm_44 ? "campusS on" : "campusS"} 
                    onClick={() => onClickGoSDMS(ProjectResource.Site.GG_E)}
                >
                    <div className={"campus-img" + " campus-d"} />
                    <p className='title'>복합시설관</p>
                    {ui_44}
                </div>
                <div 
                    className={isAlarm_47 ? "campusS on" : "campusS"} 
                    onClick={() => onClickGoSDMS(ProjectResource.Site.GG_H)}
                >
                    <div className={"campus-img" + " campus-f"} />
                    <p className='title'>주택도시공사 신사옥</p>
                    {ui_47}
                </div>
            </section>
        </BoardViewComponent>
    );
};

export default withRouter(BoardView);