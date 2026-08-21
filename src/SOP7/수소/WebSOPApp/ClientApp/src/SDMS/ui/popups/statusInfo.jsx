import { ui } from 'jquery';
import React, { Component } from 'react';
import content from '../../../Common/css/content.module.css';
import uis from '../../../Common/css/ui.module.css';
import imgClose from '../../../Common/image/icon/close_x.svg';
import imgZoomIco from '../../../Common/image/icon/zoom_ico.png';
import SDMS from '../sdms';
import StatusInfoBuildingGroup from './statusInfoBuildingGroup';
import SDMSMainMenu from '../sdmsMainMenu';
import commonStyles from '../../../Common/css/style.module.css';
import sdmsStyles from '../../css/sdms.module.css';
import $ from 'jquery';
//import { array } from '@amcharts/amcharts4/core';
import { SDMSController } from '../../services/sdmsController';
import SettingsStore from '../../../Settings/settingsStore';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { SdmsScrollbar } from './SdmsScrollbar';
import Contents3D from '../3D/contents3D';
import { faCameraRetro } from '@fortawesome/free-solid-svg-icons';
import ProjectResource from '../../../Root/resource/id';
import SdmsResource from '../../resource/id';
import AccountResource from '../../../Account/resource/id';

import PopupDraggable from './popupDraggable';

import { StatusInfoNewComponent } from '../../styled/sdmsPopupsStyled';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';
import SearchInput from '../../../Common/ui/searchInput';
    
class StatusInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            selectedInfoID: {
                buildingID: null,
                zoneID: null,
                sensorID: null,
            },
        }

        let updateScrollTop = false;
        let scrollTop = 0;

        this.initPopupState = this.initPopupState.bind(this);
        SettingsStore.subscribe(function () { 
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));

        this.refLayer = React.createRef();
        this.refScrollArea = React.createRef();
        this.refScrollbar = React.createRef();
        this.refTree = React.createRef();
    }

    componentDidMount() {
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

        this.initPopupState();
        this.setScrollbar(this.props.selectedInfoID);

        $('.scrollbar').scrollTop(0);


        $('#mainSB').click(function (e) {
            if ($('.searchWrapInput').hasClass('on')) {
                let targetName = e.target.className;

                if (targetName === "") {
                    $('.searchWrapInput').removeClass('on');
                    $('.searchBtn').removeClass('on');
                }
            }
        });
    }

    setScrollbar = (selectedInfoID) => {
        if (!selectedInfoID)
            return;

        const data = Object.assign({}, selectedInfoID);

        // .TODO: 트리 열기 및 포인트 기능 추가 필요      
        if (data.sensorID !== null) {
            // 센서 선택

            // 설비 선택
            this.openBuildingTree(data.buildingID);
            // 장비 선택
            this.openZoneTree(data.zoneID);
            // 센서 선택
            this.openSensorTree(data.sensorID);
        }
        else if (data.zoneID !== null) {
            // 장비 선택

            // 센서 선택 닫기
            this.openSensorTree(null);
            // 설비 선택
            this.openBuildingTree(data.buildingID);
            // 장비 선택
            this.openZoneTree(data.zoneID);
        }
        else if (data.buildingID !== null) {
            // 설비 선택

            // 센서 선택 닫기
            this.openSensorTree(null);
            // 장비 선택 닫기
            this.openZoneTree(null);
            // 설비 선택
            this.openBuildingTree(data.buildingID);
        }
        else if (data.sensorID === null && data.zoneID === null && data.buildingID === null) {
            // 센서 선택 닫기
            this.openSensorTree(null);
            // 장비 선택 닫기
            this.openZoneTree(null);
            // 설비 선택 닫기
            this.openBuildingTree(null);
        }


        // .TODO: 스크롤 기능 필요시 이 부분 추가


        //this.state.selectedInfoID = selectedInfoID;
        this.setState({selectedInfoID : data});
    }    

    // node가 보이는 범위내에 있는지 체크한다
    checkRange(titleID, areaID, targetRect) {
        const titleEle = document.getElementById(titleID);
        const areaEle = document.getElementById(areaID);
        if (!titleEle || !areaEle) {
            return false;
        }        

        const titleRect = titleEle.getBoundingClientRect();
        const areaRect = areaEle.getBoundingClientRect();

        const beginY = targetRect.y;
        const endY = targetRect.y + targetRect.height;
        if (titleRect.top >= beginY && areaRect.bottom <= endY) {
            // 범위내에 있음
            return false;
        }

        return true;
    }
    
    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
            console.log('statusInfoZIndex changed', this.state.popup.style.zIndex)
        }
        if (this.props.selectedInfoID.buildingID !== this.state.selectedInfoID.buildingID ||
            this.props.selectedInfoID.zoneID !== this.state.selectedInfoID.zoneID ||
            this.props.selectedInfoID.sensorID !== this.state.selectedInfoID.sensorID) {
            this.setScrollbar(this.props.selectedInfoID);
        }
    }

    setVisiblePoi(typeName, visible) {
        this.props.setVisiblePoi(typeName, visible);
    }
    
    initPopupState() {
        var popup = document.getElementsByClassName('viewDashboardBoxD viewDashboard')[0];

        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        }

        this.setState({ popup: popup });
    }

    repositionPopup(popupState) {
        let data = popupState.statusInfo;

        if (data === null || data === undefined)
            return;

        //let popup = document.getElementsByClassName(content.viewDashboard + ' ' + content.viewDashboardBoxD)[0];
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

    search = () => {
        let text = document.getElementById('searchWrapInput').value;

        if (!text) {
            text = "";
        }
            
        if (this.state.searchText !== text)
            this.setState({ searchText: text }, () => this.setScrollbar(this.props.selectedInfoID));
    }              

    openBuildingTree = (buildingID) => {        
        const facilityHeadWrap = document.getElementById('facilityHeadWrap_' + buildingID);
        const arrowIcon = document.getElementById('arrowIcon_' + buildingID);
        const facilityListHead = document.getElementById('facilityListHead_' + buildingID);
        const facilityListConts = document.getElementById('facilityListConts_' + buildingID);

        if (buildingID !== null && !facilityHeadWrap && !arrowIcon && !facilityListHead) {
            // 해당 설비가 없을 경우
            return;
        }
        else if (buildingID !== null && facilityHeadWrap.classList.contains('on')) {
            // 이미 선택된 경우
            return;
        }

        // 다른 설비 항목 닫기
        const facilityHeadWraps = document.getElementsByClassName('facilityHeadWrap on');
        if (facilityHeadWraps) {
            for (const _facilityHeadWrap of facilityHeadWraps) {
                _facilityHeadWrap.classList.remove('on');
            }
        }
        const arrowIcons = document.getElementsByClassName('arrowIcon on');
        if (arrowIcons) {
            for (const _arrowIcon of arrowIcons) {
                _arrowIcon.classList.remove('on');
            }
        }
        const facilityListHeads = document.getElementsByClassName('facilityListHead on');
        if (facilityListHeads) {
            for (const _facilityListHead of facilityListHeads) {
                _facilityListHead.classList.remove('on');
            }
        }
        const facilityListConts2 = document.getElementsByClassName('facilityListConts on');
        if (facilityListConts2) {
            for (const _facilityListConts of facilityListConts2) {
                _facilityListConts.classList.remove('on');
            }
        }

        // ID 값이 NULL 경우, 닫기
        if (buildingID === null)
            return;             

        // 해당 설비 항목 UI 열기
        if (facilityListConts)
            facilityListConts.classList.add('on');

        facilityHeadWrap.classList.add('on');
        facilityListHead.classList.add('on');
        arrowIcon.classList.add('on');

        facilityHeadWrap.classList.add('textOn');
    }

    headOpenTree = (building) => {
        // 센서 선택 닫기
        this.openSensorTree(null);
        // 장비 선택 닫기
        this.openZoneTree(null);
        // 설비 선택
        this.openBuildingTree(building.id);

        // .TODO: 해당 설비 선택 정보 넣기 필요  

        this.state.selectedInfoID.buildingID = building ? building.id : null;
        this.state.selectedInfoID.zoneID = null;
        this.state.selectedInfoID.sensorID = null;

        this.props.setStatusInfoID(this.state.selectedInfoID);

        // 해당 설비 화면 이동
        this.props.moveToX(SDMSMainMenu.Menu_MoveTo_Building, [building.buildingName]);
    }

    openZoneTree = (zoneID) => {
        const facilityList1Depth = document.getElementById('facilityList1Depth_' + zoneID);
        const depthArrowIcon = document.getElementById('depthArrowIcon_' + zoneID);
        const facilityList2Depth = document.getElementById('facilityList2Depth_' + zoneID);
        
        if (zoneID !== null && !facilityList1Depth && !depthArrowIcon) {
            // 해당 장비가 없을 경우
            return;
        }
        else if (zoneID !== null && facilityList1Depth.classList.contains('on')) {
            // 이미 선택된 경우
            return;
        }

        // 다른 장비 항목 닫기
        const facilityList1Depths = document.getElementsByClassName('facilityList1Depth on');
        if (facilityList1Depths) {
            for (const _facilityList1Depth of facilityList1Depths) {
                _facilityList1Depth.classList.remove('on');
            }
        }
        const depthArrowIcons = document.getElementsByClassName('depthArrowIcon on');
        if (depthArrowIcons) {
            for (const _depthArrowIcon of depthArrowIcons) {
                _depthArrowIcon.classList.remove('on');
            }
        }
        const facilityList2Depths = document.getElementsByClassName('facilityList2Depth on');
        if (facilityList2Depths) {
            for (const _facilityList2Depth of facilityList2Depths) {
                _facilityList2Depth.classList.remove('on');
            }
        }

        // ID 값이 null 경우, 닫기
        if (zoneID === null)
            return;       

        // 해당 장비 항목 UI 열기
        if (facilityList2Depth)
            facilityList2Depth.classList.add('on');

        depthArrowIcon.classList.add('on');
        facilityList1Depth.classList.add('on');
    }

    depth1Tree = (buildingID, zoneID) => {
        // 센서 닫기
        this.openSensorTree(null);
        // 설비 선택
        this.openBuildingTree(buildingID);
        // 장비 선택
        this.openZoneTree(zoneID);

        this.state.selectedInfoID.buildingID = buildingID;
        this.state.selectedInfoID.zoneID = zoneID;
        this.state.selectedInfoID.sensorID = null;

        this.props.setStatusInfoID(this.state.selectedInfoID);

        // 설비 선택
        //this.props.moveToX(SDMSMainMenu.Menu_MoveTo_Facility, [this.props.zone.id, sensorID, this.props.zone?.siteID]);
    }

    openSensorTree = (sensorID) => {
        const facilityList2DepthP = document.getElementById('facilityList2DepthP_' + sensorID);

        if (sensorID !== null && !facilityList2DepthP) {
            // 해당 센서가 없는 경우
            return;
        }            
        else if (sensorID !== null && facilityList2DepthP.classList.contains('sensorText_blue')) {
            // 이미 선택된 경우
            return;
        }

        // 해당 센서 외 선택 제거
        const facilityList2DepthPs = document.getElementsByClassName('facilityList2DepthP sensorText_blue');
        if (facilityList2DepthPs) {
            for (const _facilityList2DepthP of facilityList2DepthPs) {
                _facilityList2DepthP.classList.remove('sensorText_blue');
            }
        }

        // ID 값이 null 경우, 닫기
        if (sensorID === null)
            return;               

        // 해당 센서 선택
        facilityList2DepthP.classList.add('sensorText_blue');
    }

    depth2Tree = (buildingID, zoneID, sensorID, sensorType, alarmSensor = null) => {        
        // 설비 선택
        this.openBuildingTree(buildingID);
        // 장비 선택
        this.openZoneTree(zoneID);
        // 센서 닫기
        this.openSensorTree(sensorID);

        this.state.selectedInfoID.buildingID = buildingID;
        this.state.selectedInfoID.zoneID = zoneID;
        this.state.selectedInfoID.sensorID = sensorID;

        this.props.setStatusInfoID(this.state.selectedInfoID);

        // .TODO: 3D 센서 선택
        if (alarmSensor) {
            //this.props.moveToX(SDMSMainMenu.Menu_Show_Alarm, [zoneID, sensorType, sensorID, alarmDepth, isAlarm]);
            this.props.onSelectedAlarm(alarmSensor);
        }
        else {
            this.props.moveToX(SDMSMainMenu.Menu_MoveTo_POI, [zoneID, sensorType, sensorID, null]);
        }
    }

    getEquipmentUI = () => {
        let EquipmentUI = [];

        const buildingGroupList = this.props.buildingGroupList;
        const zoneList = this.props.zoneList;
        const sensorAlarms = this.props.sensorAlarms;
        const searchText = this.state.searchText;

        const _searchText = searchText.toLowerCase();

        for (const buildingGroup of buildingGroupList) {
            const buildingDatas = buildingGroup.buildingDatas;

            // 설비 리스트
            if (buildingDatas) {
                for (const buildingData of buildingDatas) {
                    const buildingID = buildingData.id;
                    const buildingDisplayText = i18nUtil.convertText(buildingData.displayText);
                    let isSearchZone = false;


                    // 장비 리스트
                    let zoneUI = [];
                    if (zoneList) {
                        for (const zoneID in zoneList) {
                            const zone = zoneList[zoneID];
                            let isSearchSensor = false;                            

                            if (zone && zone.length === 7 && zone[1] === buildingID) {                                
                                const _zoneName = zone[3];
                                let zoneName = i18nUtil.convertText(_zoneName);

                                let isSensorList = false;
                                const _zoneID = Number(zoneID);
                                if (_zoneID === buildingID) {
                                    zoneName = i18n.t('sdms.statusInfo.센서');
                                    isSensorList = true;
                                }
                                    

                                // 센서 리스트
                                let sensorUI = [];
                                const sensors = zone.sensors;
                                if (sensors) {
                                    for (const type in sensors) {
                                        const sensorDatas = sensors[type];

                                        for (const sensor of sensorDatas) {
                                            const sensorName = i18nUtil.convertText(sensor.name);
                                            let isAlarm = false;

                                            const alarmSensor = sensorAlarms.find(x => x.isAlarm === true && x.orgSensorID === sensor.id);
                                            if (alarmSensor) {
                                                isAlarm = true;
                                            }                                                

                                            let textClass = isAlarm ? 'facilityList2DepthP sensorText_red' : 'facilityList2DepthP';

                                            if (_searchText === "" || sensorName?.toLowerCase().indexOf(_searchText) !== -1) {
                                                isSearchSensor = true;
                                                sensorUI.push(<div key={"sensor_" + sensor.id + "_" + searchText} className={'facilityList2DepthSpen'} onClick={() => this.depth2Tree(buildingID, zoneID, sensor.id, type, alarmSensor)}><span className={'sensorIcon_active'}></span><p id={'facilityList2DepthP_' + sensor.id} className={textClass}>{sensorName}</p><span className={isAlarm ? 'activeCircle' : '_activeCircle'}></span></div>);
                                            }                                            
                                        }
                                    }
                                }
                                
                                if (_searchText === "" || isSearchSensor || zoneName?.toLowerCase().indexOf(_searchText) !== -1) {
                                    isSearchZone = true;

                                    if (sensorUI.length > 0) {
                                        zoneUI.unshift(
                                            <>
                                                <div key={"zone_" + zoneID + "_" + searchText} className={'facilityList1Depth'} id={'facilityList1Depth_' + zoneID} onClick={() => this.depth1Tree(buildingID, zoneID)}>
                                                    <span className={'depthArrowIcon'} id={'depthArrowIcon_' + zoneID}></span>
                                                    <span className={'facilityList1DepthSP'} id={'facilityList1DepthSP'}>{zoneName}</span>
                                                </div>
                                                <ul className={'facilityList2Depth'} id={'facilityList2Depth_' + zoneID}>
                                                    <li>
                                                        <div className={'facilityList2DepthHead'}>
                                                            {sensorUI}
                                                        </div>
                                                    </li>
                                                </ul>
                                            </>
                                        );
                                    }
                                    else if (isSensorList === true && sensorUI.length === 0) {
                                        // 센서 리스트이면서 센서가 없다면 표출하지 않도록
                                    }
                                    else {
                                        zoneUI.unshift(
                                            <>
                                                <div key={"zone_" + zoneID + "_" + searchText} className={'facilityList1Depth'} id={'facilityList1Depth_' + zoneID} onClick={() => this.depth1Tree(buildingID,zoneID)}>
                                                    <span className={'depthArrowIcon'} id={'depthArrowIcon_' + zoneID}></span>
                                                    <span className={'facilityList1DepthSP'} id={'facilityList1DepthSP' + zoneID}>{zoneName}</span>
                                                </div>
                                            </>
                                        );
                                    }
                                }                               
                            }                             
                        }
                    }

                    if (_searchText === "" || isSearchZone || buildingDisplayText?.toLowerCase().indexOf(_searchText) !== -1) {
                        if (zoneUI.length > 0) {
                            EquipmentUI.push(
                                <>
                                    <div key={"building_" + buildingID + "_" + searchText} className={'facilityHeadWrap'} id={'facilityHeadWrap_' + buildingID} onClick={() => this.headOpenTree(buildingData)}>
                                        <span className={'arrowIcon'} id={'arrowIcon_' + buildingID}></span>
                                        <span className={'facilityListHead'} id={'facilityListHead_' + buildingID}>{buildingDisplayText}</span>
                                    </div>
                                    <div className={'facilityListConts'} id={'facilityListConts_' + buildingID}>
                                        <ul>
                                            <li>
                                                {zoneUI}
                                            </li>
                                        </ul>
                                    </div>
                                </>
                            );

                        }
                        else {
                            EquipmentUI.push(
                                <>
                                    <div key={"building_" + buildingID + "_" + searchText} className={'facilityHeadWrap'} id={'facilityHeadWrap_' + buildingID} onClick={() => this.headOpenTree(buildingData)}>
                                        <span className={'arrowIcon'} id={'arrowIcon_' + buildingID}></span>
                                        <span className={'facilityListHead'} id={'facilityListHead_' + buildingID}>{buildingDisplayText}</span>
                                    </div>
                                </>
                            );
                        }
                    }                    
                }
            }
        }

        return EquipmentUI;
    }

    render() {
        const userInfo = ProjectResource.getUserInfo();
        const equipmentUI = this.getEquipmentUI();

        return (
            <StatusInfoNewComponent id={this.props.popupType} className={'viewDashboardBoxD viewDashboard'} $siteID={userInfo.siteID}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={320}
                    popupMinHeight={340}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >

                    <div className={'statusInfoTitle'}>
                        <span>{i18n.t('sdms.statusInfo.설비리스트')}</span>
                        <span className={'colseX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.statusInfo, false)}><a><img src={imgClose} alt={i18n.t('common.닫기')} /></a></span>
                    </div>

                    <div className={'dslContStatus'}>
                        <SearchInput
                            search={this.search}
                        />
                        <div ref={this.refScrollArea} className={'dsiScr scrollbar'}>
                            <ul ref={this.refTree} className={'dsiTree'}>
                                <li>
                                    { equipmentUI }
                                </li>
                            </ul>
                        </div>
                    </div>
                </PopupDraggable>
            </StatusInfoNewComponent>
        );
    }
}

export default withTranslation()(StatusInfo);