import React, { Component } from 'react';
import $ from 'jquery';

import { AccessControlGGComponent } from '../../../styled/sdmsPopupsStyled';
import SDMS from '../../sdms';
import PopupDraggable from '../popupDraggable';
import SdmsResource from '../../../resource/id';
import buildingImg_gg_41 from '../../../../Common/img/imgGyeonggi/accessControlBuilding_41.png';
import buildingImg_gg_43 from '../../../../Common/img/imgGyeonggi/accessControlBuilding_43.png';
import buildingImg_gg_45 from '../../../../Common/img/imgGyeonggi/accessControlBuilding_45.png';
import buildingImg_magog from '../../../../Common/img/imgmagog/accessControlBuilding.png';
import SettingsStore from '../../../../Settings/settingsStore';
import SDMSMainMenu from '../../sdmsMainMenu';
import ProjectResource from '../../../../Root/resource/id';

class AccessControl_gg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDoor: null,
        }

        this.initPopupState = this.initPopupState.bind(this);
    }

    componentDidMount() {
        this.setSelectedDoorData();

        this.unsubscribeSettingsStore = SettingsStore.subscribe(() => {
            this.resetPopupState(SettingsStore.getState());
        });

        let cssLeft = null;
        let cssTop = null;
        let cssWidth = null;
        let cssHeight = null;

        const popup = document.getElementById(this.props.popupType);
        const target = document.getElementById("dsBot_" + this.props.popupType);
        const popupState = this.props.popupState;

        if (popup !== null && popup !== undefined &&
            target !== null && target !== undefined &&
            popupState !== null && popupState !== undefined) {
            const clientRect = target.getBoundingClientRect();
            cssLeft = clientRect.left + "px";
            cssTop = clientRect.top + "px";

            popup.style.width = 0;
            popup.style.height = 0;
            popup.style.left = cssLeft;
            popup.style.top = cssTop;

            cssLeft = popupState.x;
            cssTop = popupState.y;
            cssWidth = popupState.width;
            cssHeight = popupState.height;

            $('#' + this.props.popupType).animate({ opacity: 1, width: cssWidth, height: cssHeight, left: cssLeft, top: cssTop }, SdmsResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }
        else {
            $('#' + this.props.popupType).animate({ opacity: 1 }, SdmsResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }
    }

    componentWillUnmount() {
        if (this.unsubscribeSettingsStore) {
            this.unsubscribeSettingsStore();
        }
    
        if (this.unsubscribeStore) {
            this.unsubscribeStore();
        }

        // GghController.stopWatchTimer();
    }

    repositionPopup(popupState) {
        let data = popupState.AccessControlGG;

        if (data === null || data === undefined)
            return;

        let popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return;

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
    }

    resetPopupState = (popupState) => {
        let data = popupState;

        if (data.actionType === 'RESET_POPUP') {
            this.repositionPopup(data.popupState);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.closedDoorDatas !== this.props.closedDoorDatas) {
            this.setSelectedDoorData();
        }

        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            var popup = document.getElementsByClassName('viewDashboardBoxD accessControl')[0];
            popup.style.zIndex = this.props.zIndex;
            console.log('AccessControlGGZIndex changed', popup.style.zIndex);
        }
    }

    initPopupState() {
        var popup = document.getElementsByClassName('viewDashboardBoxD accessControl')[0];

        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        }

        this.setState({ popup: popup });
    }

    setSelectedDoorData = () => {
        const { closedDoorDatas, selectedAlarm } = this.props;
    
        if (!closedDoorDatas || !selectedAlarm) {
            return;
        }

        let selectedDoor = null;
    
        for (let data in closedDoorDatas) {
            if ((closedDoorDatas[data]?.zoneID === selectedAlarm?.zoneID)
                || (closedDoorDatas[data]?.zoneID === this.state.selectedDoor?.zoneID)) {
                selectedDoor = closedDoorDatas[data];
            }
        }

        this.setState({ selectedDoor });
    }

    setSelectedDoor = (data) => {
        if (this.state.selectedDoor?.zoneID !== data.zoneID) {
            this.setState({ selectedDoor: data });
        }
    }

    getZoneDatasByZoneID = (zoneID) => {
        const buildingGroupList = this.props.buildingGroupList;

        for (let buildingGroupDatas of buildingGroupList) {
            const buildingGroup = buildingGroupDatas.buildingDatas;
            for (let buildingDatas of buildingGroup) {
                const zoneDatas = buildingDatas.zoneDatas;
                for (let zone of zoneDatas) {
                    if (zone.id === zoneID) {
                        return zone;
                    }
                }
            }
        }
    }

    moveToX = (zoneID) => {
        const zone = this.getZoneDatasByZoneID(zoneID);

        if (zone) {
            this.props.moveToX(SDMSMainMenu.Menu_MoveTo_Floor, zone);
        }
    }

    getAccessControlUI = (closedDoorDatas) => {
        const siteID = ProjectResource.siteID;

        let boundaryBoxPosition = {};

        // 경기 도청 도의회
        if (this.props.selectedAlarm?.siteID === ProjectResource.Site.GG_B) {
            boundaryBoxPosition = {
                // 공용층
                1: {zoneID: 1, floorName: "B1F", width: 313, height: 10, left: 2, bottom: 21},
                2: {zoneID: 2, floorName: "B2F", width: 313, height: 8, left: 2, bottom: 15},
                3: {zoneID: 3, floorName: "B3F", width: 313, height: 7, left: 2, bottom: 9},
                4: {zoneID: 4, floorName: "B4F", width: 313, height: 8, left: 2, bottom: 3},
                5: {zoneID: 5, floorName: "1F", width: 217, height: 8, left: 25, bottom: 30},
                6: {zoneID: 6, floorName: "2F", width: 214, height: 9, left: 25, bottom: 37},
                7: {zoneID: 7, floorName: "3F", width: 214, height: 9, left: 25, bottom: 44},
                8: {zoneID: 8, floorName: "4F", width: 213, height: 7, left: 25, bottom: 52},
        
                // 도본청
                9: {zoneID: 9, floorName: "5F", width: 102, height: 7, left: 25, bottom: 58},
                10: {zoneID: 10, floorName: "6F", width: 102, height: 7, left: 25, bottom: 64},
                11: {zoneID: 11, floorName: "7F", width: 102, height: 6, left: 25, bottom: 70},
                12: {zoneID: 12, floorName: "8F", width: 110, height: 7, left: 25, bottom: 75},
                13: {zoneID: 13, floorName: "9F", width: 102, height: 7, left: 25, bottom: 81},
                14: {zoneID: 14, floorName: "10F", width: 102, height: 6, left: 25, bottom: 87},
                15: {zoneID: 15, floorName: "11F", width: 102, height: 7, left: 25, bottom: 92},
                16: {zoneID: 16, floorName: "12F", width: 102, height: 7, left: 25, bottom: 98},
                17: {zoneID: 17, floorName: "13F", width: 102, height: 7, left: 25, bottom: 104},
                18: {zoneID: 18, floorName: "14F", width: 102, height: 7, left: 25, bottom: 110},
                19: {zoneID: 19, floorName: "15F", width: 102, height: 6, left: 25, bottom: 116},
                20: {zoneID: 20, floorName: "16F", width: 102, height: 7, left: 25, bottom: 121},
                21: {zoneID: 21, floorName: "17F", width: 102, height: 7, left: 25, bottom: 127},
                22: {zoneID: 22, floorName: "18F", width: 102, height: 7, left: 25, bottom: 133},
                23: {zoneID: 23, floorName: "19F", width: 102, height: 6, left: 25, bottom: 139},
                24: {zoneID: 24, floorName: "20F", width: 102, height: 7, left: 25, bottom: 144},
                25: {zoneID: 25, floorName: "21F", width: 102, height: 7, left: 25, bottom: 150},
                26: {zoneID: 26, floorName: "22F", width: 102, height: 6, left: 25, bottom: 156},
                27: {zoneID: 27, floorName: "23F", width: 102, height: 7, left: 25, bottom: 161},
                28: {zoneID: 28, floorName: "24F", width: 102, height: 6, left: 25, bottom: 167},
                29: {zoneID: 29, floorName: "25F", width: 102, height: 11, left: 25, bottom: 172},
                30: {zoneID: 30, floorName: "옥상", width: 102, height: 18, left: 25, bottom: 182},
        
                // 도의회 
                31: {zoneID: 31, floorName: "5F", width: 102, height: 7, left: 134, bottom: 58},
                32: {zoneID: 32, floorName: "6F", width: 100, height: 7, left: 134, bottom: 64},
                33: {zoneID: 33, floorName: "7F", width: 98, height: 6, left: 134, bottom: 70},
                34: {zoneID: 34, floorName: "8F", width: 97, height: 6, left: 134, bottom: 75},
                35: {zoneID: 35, floorName: "9F", width: 97, height: 7, left: 134, bottom: 80},
                36: {zoneID: 36, floorName: "10F", width: 97, height: 7, left: 134, bottom: 86},
                37: {zoneID: 37, floorName: "11F", width: 97, height: 7, left: 134, bottom: 92},
                38: {zoneID: 38, floorName: "12F", width: 97, height: 7, left: 134, bottom: 98},
                39: {zoneID: 39, floorName: "13F", width: 97, height: 10, left: 134, bottom: 104}
            };
        }
        // 경기 도서관
        else if (this.props.selectedAlarm?.siteID === ProjectResource.Site.GG_D) {
            boundaryBoxPosition = {
                43: {zoneID: 43, floorName: "B1F", width: 236, height: 10, left: 78, bottom: 45},
                42: {zoneID: 42, floorName: "B2F", width: 236, height: 10, left: 78, bottom: 54},
                41: {zoneID: 41, floorName: "B3F", width: 236, height: 11, left: 78, bottom: 63},
                40: {zoneID: 40, floorName: "B4F", width: 442, height: 17, left: 3, bottom: 73},
                44: {zoneID: 44, floorName: "1F", width: 194, height: 18, left: 119, bottom: 89},
                45: {zoneID: 45, floorName: "2F", width: 189, height: 10, left: 124, bottom: 106},
                46: {zoneID: 46, floorName: "3F", width: 189, height: 13, left: 124, bottom: 115},
                47: {zoneID: 47, floorName: "4F", width: 187, height: 13, left: 127, bottom: 127},
                48: {zoneID: 48, floorName: "5F", width: 189, height: 18, left: 124, bottom: 139},
                49: {zoneID: 49, floorName: "옥상", width: 157, height: 21, left: 123, bottom: 156}
            };
        }
        // 경기 신용보증재단
        else if (this.props.selectedAlarm?.siteID === ProjectResource.Site.GG_F) {
            boundaryBoxPosition = {
                54: {zoneID: 54, floorName: "B1F", width: 145, height: 19, left: 80, bottom: 1},
                53: {zoneID: 53, floorName: "B2F", width: 186, height: 9, left: 80, bottom: 19},
                52: {zoneID: 52, floorName: "B3F", width: 186, height: 9, left: 80, bottom: 27},
                51: {zoneID: 51, floorName: "B4F", width: 186, height: 12, left: 80, bottom: 35},
                50: {zoneID: 50, floorName: "B5F", width: 193, height: 14, left: 73, bottom: 46},
                55: {zoneID: 55, floorName: "1F", width: 146, height: 9, left: 83, bottom: 59},
                56: {zoneID: 56, floorName: "2F", width: 150, height: 11, left: 83, bottom: 67},
                57: {zoneID: 57, floorName: "3F", width: 150, height: 9, left: 83, bottom: 77},
                58: {zoneID: 58, floorName: "4F", width: 152, height: 14, left: 81, bottom: 85},
                59: {zoneID: 59, floorName: "5F", width: 152, height: 10, left: 81, bottom: 98},
                60: {zoneID: 60, floorName: "6F", width: 134, height: 10, left: 81, bottom: 107},
                61: {zoneID: 61, floorName: "7F", width: 134, height: 10, left: 81, bottom: 116},
                62: {zoneID: 62, floorName: "8F", width: 134, height: 10, left: 81, bottom: 125},
                63: {zoneID: 63, floorName: "9F", width: 134, height: 10, left: 81, bottom: 134},
                64: {zoneID: 64, floorName: "10F", width: 134, height: 10, left: 81, bottom: 143},
                65: {zoneID: 65, floorName: "11F", width: 137, height: 9, left: 81, bottom: 152},
                66: {zoneID: 66, floorName: "12F", width: 137, height: 11, left: 81, bottom: 160},
                67: {zoneID: 67, floorName: "13F", width: 137, height: 10, left: 81, bottom: 170},
                68: {zoneID: 68, floorName: "14F", width: 135, height: 13, left: 83, bottom: 179},
                69: {zoneID: 69, floorName: "옥상", width: 135, height: 8, left: 83, bottom: 191}
            };
        }
        // 마곡
        else if (siteID === ProjectResource.Site.Magog) {
            boundaryBoxPosition = {
                1: { zoneID: 1, floorName: "B7F", width: 313, height: 4, left: 7, bottom: 47 },
                2: { zoneID: 2, floorName: "B6F", width: 315, height: 4, left: 6, bottom: 51 },
                3: { zoneID: 3, floorName: "B5F", width: 315, height: 5, left: 6, bottom: 55 },
                4: { zoneID: 4, floorName: "B4F", width: 315, height: 5, left: 6, bottom: 60 },
                5: { zoneID: 5, floorName: "B3F", width: 315, height: 5, left: 6, bottom: 65 },
                6: { zoneID: 6, floorName: "B2F", width: 315, height: 12, left: 6, bottom: 70 },
                7: { zoneID: 7, floorName: "B1F", width: 315, height: 11, left: 6, bottom: 82 },
                8: { zoneID: 8, floorName: "1F", width: 303, height: 9, left: 12, bottom: 93 },
                9: { zoneID: 9, floorName: "2F", width: 291, height: 5, left: 18, bottom: 102 },
                10: { zoneID: 10, floorName: "3F", width: 291, height: 5, left: 18, bottom: 107 },
                11: { zoneID: 11, floorName: "4F", width: 291, height: 5, left: 18, bottom: 112 },
                12: { zoneID: 12, floorName: "5F", width: 291, height: 5, left: 18, bottom: 117 },
                13: { zoneID: 13, floorName: "6F", width: 291, height: 5, left: 18, bottom: 122 },
                14: { zoneID: 14, floorName: "7F", width: 291, height: 5, left: 18, bottom: 127 },
                15: { zoneID: 15, floorName: "8F", width: 291, height: 5, left: 18, bottom: 132 },
                16: { zoneID: 16, floorName: "9F", width: 291, height: 5, left: 18, bottom: 137 },
                17: { zoneID: 17, floorName: "10F", width: 291, height: 5, left: 18, bottom: 142 },
                18: { zoneID: 18, floorName: "11F", width: 291, height: 5, left: 18, bottom: 147 },
            };
        }

        let boxUI = [];
        let buildingUI = [];

        const currentView = this.props.currentView;

        let selectedDoor = this.state.selectedDoor;    // 선택된 층

        let haveClosedDoors = {};   // 미개폐 출입문이 존재하는 층의 미개방 출입문 데이터

        let isFireFloor = false;    // 선택된 층이 미개방 출입문을 가지고 있는지 확인

        for (let data in closedDoorDatas) {
            if (closedDoorDatas[data].closedDoors.length > 0) {
                const value = closedDoorDatas[data];
                haveClosedDoors[closedDoorDatas[data].zoneID] = value;
            }
        }

        for (let door in haveClosedDoors) {
            if (haveClosedDoors[door]?.zoneID === selectedDoor?.zoneID) {
                isFireFloor = true;
            }
        }

        if (selectedDoor) {
            boxUI.push(
                <ul key='accessControl_box'>
                    <li>
                        <p>층 정보</p>
                        <p>{isFireFloor ? selectedDoor.floorName : '-'}</p>
                    </li>
                    <li>
                        <p>총 출입문</p>
                        <p>{isFireFloor ? selectedDoor.totalDoorCount : '-'}</p>
                    </li>
                    <li>
                        <p>미개방 출입문</p>
                        <p className={isFireFloor ? 'on' : null}>{isFireFloor ? selectedDoor.closedDoors.length : '-'}</p>
                    </li>
                    <li>
                        <button 
                            className={currentView.zoneID !== selectedDoor.zoneID ? 'on' : null}
                            onClick={() => this.moveToX(selectedDoor.zoneID)}
                        >이동</button>
                    </li>
                </ul>
            );
        } 

        // 미개폐 출입문이 존재하는 모든 층에 바운더리 박스 그리기
        if (Object.keys(haveClosedDoors).length > 0) {
            for (let key in haveClosedDoors) {
                const position = boundaryBoxPosition[key];

                if (!position) {
                    return [boxUI, buildingUI];
                }

                buildingUI.push(
                    <button 
                        key={position.zoneID} 
                        className={selectedDoor?.zoneID === position.zoneID ? 'selected' : null}
                        style={{ width: position.width, height: position.height, left: position.left, bottom: position.bottom }}
                        onClick={() => this.setSelectedDoor(haveClosedDoors[key])}
                    >
                        층선택버튼
                    </button>
                );
            }
        }

        return [boxUI, buildingUI];
    }

    getBuildingImg = () => {
        let ui = [];

        let imgURL = '';
        let width = 320;
        let height = 201;

        const siteID = ProjectResource.siteID;

        if (this.props.selectedAlarm?.siteID === ProjectResource.Site.GG_B) {
            imgURL = buildingImg_gg_41;
        }
        else if (this.props.selectedAlarm?.siteID === ProjectResource.Site.GG_D) {
            imgURL = buildingImg_gg_43;
            width = 439;
        }
        else if (this.props.selectedAlarm?.siteID === ProjectResource.Site.GG_F) {
            imgURL = buildingImg_gg_45;
        }
        else if (this.props.selectedAlarm?.siteID === ProjectResource.Site.Magog || siteID === ProjectResource.Site.Magog) {
            imgURL = buildingImg_magog;
        }
        else {
            this.props.setVisiblePopups(SDMS.menu.accessControl, false);
        }

        ui.push(
            <img key='buldingImage' src={imgURL} alt='건물 이미지' width={width} height={height} />
        );

        return ui;
    }

    getTitle = () => {
        let title = '출입통제';

        if (this.props.selectedAlarm?.siteID === ProjectResource.Site.GG_B) {
            title += ' - 도청/도의회';
        }
        else if (this.props.selectedAlarm?.siteID === ProjectResource.Site.GG_D) {
            title += ' - 도서관';
        }
        else if (this.props.selectedAlarm?.siteID === ProjectResource.Site.GG_F) {
            title += ' - 신용보증재단';
        }

        return title;
    }

    render() {
        const closedDoorDatas = this.props.closedDoorDatas;
        const [boxUI, buildingUI] = this.getAccessControlUI(closedDoorDatas);
        const siteBuildingImg = this.getBuildingImg();
        const isWideUI = this.props.selectedAlarm?.siteID === ProjectResource.Site.GG_D ? true : false;
        const title = this.getTitle();

        return (
            <AccessControlGGComponent id={this.props.popupType} className={'viewDashboardBoxD accessControl'} $isWideUI={isWideUI}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={360}
                    popupMinHeight={356}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                    usePopupResize={false}
                >
                    <div className={'dslTop dslGrd'}>
                        <h5 className={'dslTitle'} >
                            {title}
                        </h5>
                        <a className={'dslX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.accessControl, false)}></a>
                    </div>

                    <div className={'dslCont'}>
                        {boxUI}
                        <div>
                            {buildingUI}
                            {siteBuildingImg}
                        </div>
                    </div>
                </PopupDraggable>
            </AccessControlGGComponent>
        );
    }
}

export default AccessControl_gg;