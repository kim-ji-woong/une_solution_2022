import React, { Component } from 'react';
import styled from "styled-components";
import ProjectResource from '../../../../Root/resource/id';
import Contents3D from '../../3D/contents3D';
import SdmsResource from '../../../resource/id';
import SDMS from '../../sdms';

class CCTVApp_gg extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.runApp();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.cctvList !== this.props.cctvList || prevProps.screenXY !== this.props.screenXY) {
            this.runApp();
        }
    }

    getGuid = () => {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
            (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
        );
    }

    getCurrentEquipZoneInfo() {
        if (this.props.editMode === Contents3D.Edit_Mode_CCTVGroup) {
            const editModeManager = this.props.editModeManager;

            if (editModeManager && editModeManager.cctvGroupDatas && editModeManager.cctvGroupDatas.length === 3) {
                const equipZoneID = editModeManager.cctvGroupDatas[0];
                const equipZoneName = editModeManager.cctvGroupDatas[1];

                if ((equipZoneID === 0 || equipZoneID) && equipZoneName && equipZoneName.length > 0) {
                    return [equipZoneID, equipZoneName];
                }
            }
        }

        return [null, null];
    }

    getTitle() {
        let title = "CCTV 영상정보";
        const [equipZoneID, equipZoneName] = this.getCurrentEquipZoneInfo();

        if (equipZoneName !== null) {
            title += " - " + equipZoneName;
        }
        else {
            if (this.props.alarmInfo) {
                if (this.props.alarmInfo.length >= 2) {
                    const alarmType = this.props.alarmInfo[0];
                    const selectedAlarm = this.props.alarmInfo[1];

                    title = "[" + alarmType + "] " + selectedAlarm.positionName + " - [" + selectedAlarm.dtTime.substr(5).replace('T', ' ') + "]";
                }
            }
        }

        return title;
    }

    popupWindow(width, height) {
        let popupWidth = width;
        let popupHeight = height;
        
        // 브라우저 중앙 위치 계산
        // window.screenX : 브라우저의 현재 스크린 좌측상단 X좌표
        // window.screenY : 브라우저의 현재 스크린 좌측상단 Y좌표
        // window.outerWidth  : 브라우저의 전체 가로 크기
        // window.outerHeight : 브라우저의 전체 가로 크기
        let popupX = Math.round(window.screenX + (window.outerWidth / 2) - (popupWidth / 2));
        let popupY = Math.round(window.screenY + (window.outerHeight / 2) - (popupHeight / 2));
        
        let featureWindow = {x: popupX, y: popupY};
    
        return featureWindow;
    }

    getAlarmPopupPosition = () => {
        const { menu } = this.props;
        const featureWindow = this.popupWindow(625, 778);

        let num = null;
        let positionNum = 0;

        if (menu.indexOf(SdmsResource.menu.알람_CCTV + "_") !== -1) {
            num = menu.replace(SdmsResource.menu.알람_CCTV + "_", "");
        }

        switch (num)
        {
            case '1' : positionNum = 0; break;
            case '2' : positionNum = 300; break;
            case '3' : positionNum = 600; break;
        }

        const x = featureWindow.x + positionNum;
        const y = featureWindow.y + positionNum;

        return {x: x, y: y};
    }

    runApp = async () => {
        const { alarmInfo, cctvList, screenXY, cctvAppGUID_poi, menu } = this.props;
        if (!cctvList || cctvList.length === 0) return;

        const userInfo = ProjectResource?.getUserInfo();
        const cctvIDs = cctvList.toString().replaceAll(',', '/');
        const userID = userInfo.id;
        const title = this.getTitle();
        const korStr = encodeURIComponent(title);
        const sensorZoneHistoryID = alarmInfo ? alarmInfo[1].sensorZoneHistoryID : null;
        
        let guid = null;
    
        if (alarmInfo === undefined) {
            if (!cctvAppGUID_poi) {
                guid = this.getGuid();
                this.props.setCCTVAppGuid(guid, 'poi', menu);
            } else {
                guid = cctvAppGUID_poi.guid;
            }

            this.setAlarmGuid(alarmInfo, guid);
            this.openCCTV(guid, userID, null, korStr, sensorZoneHistoryID, screenXY.x, screenXY.y, cctvIDs);
        } else {
            guid = this.getGuid();
            const position = this.getAlarmPopupPosition();
            let markNo = menu.replace(SdmsResource.menu.알람_CCTV + "_", "");

            console.log("%c alarm cctv guid : " + guid, "background: blue; color: white");

            this.setAlarmGuid(alarmInfo, guid);
            this.openCCTV(guid, userID, markNo, korStr, sensorZoneHistoryID, position.x, position.y, cctvIDs);
            this.props.setCCTVAppGuid(guid, 'alarm', menu);
        }

        this.props.setVisiblePopups(SDMS.menu.cctvApp, true);
    
        /*
        * * guid
        * * userID
        * * title
        * * SensorZoneHistoryID(없으면 null)
        * * Screen 좌표
        * * cctv1(optional)
        * * cctv2(optional)
        * * cctv3(optional)
        * * cctv4(optional)
        */
    };

    setAlarmGuid(alarmInfo, guid) {
        if (alarmInfo && alarmInfo[1]) {
            alarmInfo[1].guid = guid;
        }
    }

    openCCTV(guid, userID, markNo, title, sensorZoneHistoryID, x, y, cctvIDs) {
        const wsMgr = this.props.getWsManager();

        if (wsMgr) {
            const cctvs = cctvIDs.split('/');
            const cctv1 = cctvs.length > 0 ? parseInt(cctvs[0]) : null;
            const cctv2 = cctvs.length > 1 ? parseInt(cctvs[1]) : null;
            const cctv3 = cctvs.length > 2 ? parseInt(cctvs[2]) : null;
            const cctv4 = cctvs.length > 3 ? parseInt(cctvs[3]) : null;

            wsMgr.openCCTV(guid, userID, markNo, title, sensorZoneHistoryID, x, y, cctv1, cctv2, cctv3, cctv4)
        }
    }

    render() {
        return (
            <CCTVComponent>
                {/* <input type="button" onClick={() => this.runApp()} value="sample 실행하기" /> */}
            </CCTVComponent>
        );
    }
}

export default CCTVApp_gg;

export const CCTVComponent = styled.div`
    position: absolute;
`;