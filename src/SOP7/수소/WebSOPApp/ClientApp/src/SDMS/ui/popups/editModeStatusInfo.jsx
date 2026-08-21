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
import { FakeWallManager } from '../3D/fakeWallManager';
import CCTVInfo from './cctvInfo';
import { EditModeManager } from '../3D/editModeManager';
import { TextPOIManager } from '../3D/textPOIManager';
import SDMSResource from '../../resource/id';

import ProjectResource from '../../../Root/resource/id';
import { EquipZoneSensorManager } from '../3D/equipZoneSensorManager';

import PopupDraggable from './popupDraggable';

import { EditModeStatusInfoComponent } from '../../styled/sdmsPopupsStyled';
import { i18n, withTranslation } from '../../../language/i18n';

class EditModeStatusInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            selectValue: "normal",
            addClick: false,        //추가버튼 클릭 여부
            mode: SDMSMainMenu.Life
        }

        this.initPopupState = this.initPopupState.bind(this);

        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));

        this.refLayer = React.createRef();
        this.refScrollArea = React.createRef();
        this.refScrollbar = React.createRef();
        this.refTree = React.createRef();
        this.refScrollbarCCTVListArea = React.createRef();
        this.refScrollbarCCTVList = React.createRef();
        this.refCCTVList = React.createRef();

        this.prevShowNewCCTV = false;
        this.updateItem = {
            selectedNewCCTV: undefined
        };
    }

    componentDidMount() {
        // 창이 서서히 나타나는 효과
        $('#' + this.props.popupType).animate({ opacity: 1 }, SDMSResource.PopupAniTime, () => {
            if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                document.getElementById(this.props.popupType).style.opacity = 1;
            }
        });

        $(function () {
            $("." + 'tabcontent').hide();
            $("." + 'tabcontent' + ':first').show();

            $('ul.' + 'tabs' + ' li').click(function () {
                $('ul.' + 'tabs' + ' li').removeClass('active').css("color", "#fff");
                //$(this).addClass("active").css({"color": "darkred","font-weight": "bolder"});
                $(this).addClass('active').css("color", "#fff");
                $("." + 'tabcontent').hide()
                var activeTab = $(this).attr("rel");
                $("#" + activeTab).fadeIn()
            });
        })

        this.initPopupState();
        this.setScrollbar();
        this.setScrollbar2();
        this.checkUpdateItem();
    }

    setScrollbar() {
        const rect = this.refScrollArea.current.getBoundingClientRect();

        let scrollVisible = false;

        if (this.refTree.current) {
            const rectTree = this.refTree.current.getBoundingClientRect();

            if (rectTree.height > rect.height) {
                scrollVisible = true;
            }
        }

        SdmsScrollbar.setContentStyle(this.refScrollbar.current, rect.width, rect.height, scrollVisible);

        const treeArea2 = this.refScrollArea.current.getBoundingClientRect();

        if (this.props.selectedInfo && this.props.selectedInfo.buildingGroup) {
            if (this.props.selectedInfo.sensorGroups) {

                const [sensorType, zoneID, sensorID] = this.props.selectedSensor;
                if (sensorType === SDMSMainMenu.Fire_Sensor && this.props.selectedInfo.fireSensors) {
                    const ele = document.getElementById('fireSensor_' + sensorID);
                    if (!ele) {
                        return;
                    }
                    const rect = ele.getBoundingClientRect();

                    const beginY = treeArea2.y;
                    const endY = treeArea2.y + treeArea2.height;
                    if (rect.top >= beginY && rect.bottom <= endY) {
                        // 범위내에 있음
                        return;
                    }

                    const temp = document.getElementById('fireSensor_' + sensorID);
                    temp.scrollIntoView({ "behavior": "smooth", "block": "center" });
                }
                else if (sensorType === SDMSMainMenu.PSM_Sensor && this.props.selectedInfo.psmSensors) {
                    const ele = document.getElementById('psmSensor_' + sensorID);
                    if (!ele) {
                        return;
                    }
                    const rect = ele.getBoundingClientRect();

                    const beginY = treeArea2.y;
                    const endY = treeArea2.y + treeArea2.height;
                    if (rect.top >= beginY && rect.bottom <= endY) {
                        // 범위내에 있음
                        return;
                    }

                    const temp = document.getElementById('psmSensor_' + sensorID);
                    temp.scrollIntoView({ "behavior": "smooth", "block": "center" });
                }
                else if (sensorType === SDMSMainMenu.Etc_Sensor && this.props.selectedInfo.etcSensors) {
                    const ele = document.getElementById('etcSensor_' + sensorID);
                    if (!ele) {
                        return;
                    }

                    const rect = ele.getBoundingClientRect();

                    const beginY = treeArea2.y;
                    const endY = treeArea2.y + treeArea2.height;
                    if (rect.top >= beginY && rect.bottom <= endY) {
                        // 범위내에 있음
                        return;
                    }

                    const temp = document.getElementById('etcSensor_' + sensorID);
                    temp.scrollIntoView({ "behavior": "smooth", "block": "center" });
                }
                else {
                    const zone = this.props.selectedInfo.zone;
                    if (!zone || !zone.id) {
                        return;
                    }

                    const isMove = this.checkRange('sensorGroups_' + zone.id, 'sensorGroupsArea_' + zone.id, treeArea2);
                    if (!isMove) {
                        return;
                    }

                    const temp = document.getElementById('zone_' + zone.id);
                    temp.scrollIntoView({ "behavior": "smooth" });
                }
            }
            else if (this.props.selectedInfo.cctvGroups) {
                const [sensorType, zoneID, sensorID] = this.props.selectedSensor;
                if (sensorType === SDMSMainMenu.CCTV_Type && this.props.selectedInfo.cctvSubGroups) {

                    const ele = document.getElementById('cctv_' + sensorID);
                    if (!ele) {
                        return;
                    }

                    const rect = ele.getBoundingClientRect();

                    const beginY = treeArea2.y;
                    const endY = treeArea2.y + treeArea2.height;
                    if (rect.top >= beginY && rect.bottom <= endY) {
                        // 범위내에 있음
                        return;
                    }

                    const temp = document.getElementById('cctv_' + sensorID);
                    temp.scrollIntoView({ "behavior": "smooth", "block": "center" });
                }
                else {
                    const zone = this.props.selectedInfo.zone;
                    if (!zone || !zone.id) {
                        return;
                    }

                    const isMove = this.checkRange('cctvGroups_' + zone.id, 'cctvGroupsArea_' + zone.id, treeArea2);
                    if (!isMove) {
                        return;
                    }

                    const temp = document.getElementById('zone_' + zone.id);
                    temp.scrollIntoView({ "behavior": "smooth" });
                }
            }
            else if (this.props.selectedInfo.facilityGroups) {
                const facility = this.props.selectedFacility;
                if (facility.facilityID >= 1 && this.props.selectedInfo.facilitySubGroups) {

                    const ele = document.getElementById('facilityInfo_' + facility.facilityID);
                    if (!ele) {
                        return;
                    }
                    const rect = ele.getBoundingClientRect();

                    const beginY = treeArea2.y;
                    const endY = treeArea2.y + treeArea2.height;
                    if (rect.top >= beginY && rect.bottom <= endY) {
                        // 범위내에 있음
                        return;
                    }

                    const temp = document.getElementById('facilityInfo_' + facility.facilityID);
                    temp.scrollIntoView({ "behavior": "smooth", "block": "center" });
                }
                else {
                    const zone = this.props.selectedInfo.zone;
                    if (!zone || !zone.id) {
                        return;
                    }

                    const isMove = this.checkRange('facilityGroups_' + zone.id, 'facilityGroupsArea_' + zone.id, treeArea2);
                    if (!isMove) {
                        return;
                    }

                    const temp = document.getElementById('zone_' + zone.id);
                    temp.scrollIntoView({ "behavior": "smooth" });
                }
            }
            else if (this.props.selectedInfo.zone) {
                const zone = this.props.selectedInfo.zone;
                if (!zone || !zone.id) {
                    return;
                }

                const isMove = this.checkRange('zone_' + zone.id, 'zoneArea_' + zone.id, treeArea2);
                if (!isMove) {
                    return;
                }

                const building = this.props.selectedInfo.building;
                const temp = document.getElementById('building_' + building?.id);
                if (temp) {
                    temp.scrollIntoView({ "behavior": "smooth" });
                }
            }
            else if (this.props.selectedInfo.building) {
                const building = this.props.selectedInfo.building;
                if (!building || !building.id) {
                    return;
                }

                const isMove = this.checkRange('building_' + building.id, 'buildingArea_' + building.id, treeArea2);
                if (!isMove) {
                    return;
                }

                const temp = document.getElementById('building_' + building.id);
                temp.scrollIntoView({ "behavior": "smooth" });
            }
            else {
                const buildingGroup = this.props.selectedInfo.buildingGroup;
                if (!buildingGroup || !buildingGroup.id) {
                    return;
                }

                const temp = document.getElementById('buildingGroup_' + buildingGroup.id);
                temp.scrollIntoView({ "behavior": "smooth" });
            }
        }
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

    setScrollbar2() {
        if (!this.refScrollbarCCTVListArea.current) {
            return;
        }

        const rect = this.refScrollbarCCTVListArea.current.getBoundingClientRect();
        let scrollVisible = false;

        if (this.refCCTVList.current) {
            const rectList = this.refCCTVList.current.getBoundingClientRect();

            if (rectList.height > rect.height) {
                scrollVisible = true;
            }
        }

        SdmsScrollbar.setContentStyle(this.refScrollbarCCTVList.current, rect.width, rect.height, scrollVisible);
    }

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
        }

        this.setScrollbar();
        this.setScrollbar2();
        this.checkUpdateItem();
    }

    checkUpdateItem() {
        if (this.updateItem.selectedNewCCTV !== undefined) {
            const selectedNewCCTV = this.updateItem.selectedNewCCTV;
            this.updateItem.selectedNewCCTV = undefined;
            this.props.onSelectNewCCTV(selectedNewCCTV);
        }
    }

    setVisiblePoi(typeName, visible) {
        this.props.setVisiblePoi(typeName, visible);
    }

    initPopupState() {
        var popup = document.getElementsByClassName('viewDashboard' + ' ' + 'viewDashboardBoxD')[0];

        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined' && popup) {
            popup.style.left = this.props.popupState?.x;
            popup.style.top = this.props.popupState?.y;
            popup.style.width = this.props.popupState?.width;
            popup.style.height = this.props.popupState?.height;
        }

        //팝업 내 스크롤 컨텐츠 사이즈 초기화
        var viewScroll = document.getElementsByClassName('statusInfoTabContent');
        var viewScrollSize = parseFloat(getComputedStyle(popup, null).getPropertyValue('height').replace('px', '')) - 160;
        // 340 - 500
        for (var i = 0; i < viewScroll.length; i++) {
            viewScroll[i].style.height = viewScrollSize + 'px';
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

        //팝업 내 스크롤 컨텐츠 사이즈 초기화
        let viewScroll = document.getElementsByClassName('statusInfoTabContent');
        let viewScrollSize = parseFloat(getComputedStyle(popup, null).getPropertyValue('height').replace('px', '')) - 160;
        // 340 - 500
        for (var i = 0; i < viewScroll.length; i++) {
            viewScroll[i].style.height = viewScrollSize + 'px';
        }

        this.setState({ popup: popup });
    }

    resetPopupState = (popupState) => {
        let data = popupState;

        if (data.actionType === 'RESET_POPUP') {
            this.repositionPopup(data.popupState);
        }
    }

    //사이즈 드래그 할 때마다 Scroll적용된 컨텐츠 사이즈 조절(CSS에서 조절이 어려워 스크립트로 대체)
    setStatusInfoTabContent(sizeY) {
        var viewScroll = document.getElementsByClassName('statusInfoTabContent');
        var viewScrollSize = sizeY - 160;
        // 340 - 500
        for (var i = 0; i < viewScroll.length; i++) {
            viewScroll[i].style.height = viewScrollSize + 'px';
        }
    }

    searchEnterKey = () => {
        if (window.event.keyCode == 13) {
            this.search();
        }
    }

    search = () => {
        const text = document.getElementById('txtSearch').value;
        this.setState({ searchText: text });
    }

    getBuildingGroupUI() {
        let ui = [];


        let buildingGroupList = this.props.buildingGroupList;
        if (buildingGroupList === undefined || buildingGroupList === null || buildingGroupList.length === 0)
            return ui;

        if (this.state.searchText.length > 0) {
            this.setVisibleBuildingGroupList(buildingGroupList);
        }

        for (var i = 0; i < buildingGroupList.length; i++) {
            const buildingGroup = buildingGroupList[i];
            if (buildingGroup.visible === false && this.state.searchText.length > 0)
                continue;

            ui.push(<StatusInfoBuildingGroup
                id={'buildingGroup_' + buildingGroup.id}
                key={buildingGroup.id}
                sensorList={this.props.sensorList}
                buildingGroup={buildingGroup}
                zoneList={this.props.zoneList}
                buildingIDs={this.props.buildingIDs}
                indoorModels={this.props.indoorModels}
                moveToX={this.props.moveToX}
                searchText={this.state.searchText}
                onSelectSensor={this.props.onSelectSensor}
                selectedSensor={this.props.selectedSensor}
                selectedFacility={this.props.selectedFacility}
                isEditMode={true}
                multiSite={this.props.multiSite}
                selectedInfo={this.props.selectedInfo}
                onChangeBuildingGroup={this.onChangeBuildingGroup}
                site3dOptions={this.props.site3dOptions}
                useSensorTypes={this.props.useSensorTypes}
            />);
        }

        if (this.props.outdoorZones) {
            ui.push(<StatusInfoBuildingGroup
                id={'buildingGroup_outdoor'}
                key={"bg_outdoor"}
                isOutdoor={true}
                sensorList={this.props.sensorList}
                buildingGroup={this.props.outdoorZones}
                zoneList={this.props.zoneList}
                moveToX={this.props.moveToX}
                searchText={this.state.searchText}
                onSelectSensor={this.props.onSelectSensor}
                selectedSensor={this.props.selectedSensor}
                selectedFacility={this.props.selectedFacility}
                isEditMode={true}
                multiSite={this.props.multiSite}
                selectedInfo={this.props.selectedInfo}
                onChangeBuildingGroup={this.onChangeBuildingGroup}
                site3dOptions={this.props.site3dOptions}
            />);
        }

        return ui;
    }

    setVisibleBuildingGroupList(buildingGroupList) {
        let count = buildingGroupList.length;
        for (let i = 0; i < count; i++) {
            const buildingGroup = buildingGroupList[i];
            if (buildingGroup.displayText.includes(this.state.searchText)) {
                buildingGroup.visible = true;
            }
            else {
                let visible = false;
                for (let i = 0; i < buildingGroup.buildingDatas.length; i++) {
                    const buildingVisible = this.setVisibleBuildingList(buildingGroup.buildingDatas[i]);
                    if (buildingVisible === true) {
                        visible = true;
                    }
                }

                if (visible) {
                    buildingGroup.visible = true;
                }
                else {
                    buildingGroup.visible = false;
                }
            }
        }
    }

    setVisibleBuildingList(buildingData) {
        let buildingVisible = false;

        let count = buildingData.zoneDatas.length;
        for (let i = 0; i < count; i++) {
            const zone = buildingData.zoneDatas[i];
            if (zone.displayText.includes(this.state.searchText)) {
                zone.visible = true;
                buildingVisible = true;
            }
            else {
                let visibleCount = 0;
                
                if (visibleCount > 0) {
                    zone.visible = true;
                }
                else {
                    zone.visible = false;
                }

                if (zone.visible) {
                    buildingVisible = true;
                }
            }
        }

        buildingData.visible = buildingVisible;

        return buildingData.visible;
    }

    onChangeVisible(sensorType) {
        this.props.setVisiblePoi(sensorType, this.props.visibleSensorTypes[sensorType]);
    }

    onClickLayer = (event) => {
        const on = 'on';

        if (event.target.classList.contains(on)) {
            event.target.classList.remove(on);
            this.refLayer.current.classList.remove(on);
        }
        else {
            event.target.classList.add(on);
            this.refLayer.current.classList.add(on);
        }
    }

    toggleButton(sensorType) {
        let visible = false;

        // 솔브레인 iot 같은 경우 psm, etc 포함
        if (sensorType === "iot") 
            visible = this.props.visibleSensorTypes[SDMSMainMenu.Etc_Sensor];
        else
            visible = this.props.visibleSensorTypes[sensorType];

        this.props.setVisiblePoi(sensorType, visible ? false : true);
        /*if (event.target.classList.contains('on')) {
            event.target.classList.remove('on');
        }
        else {
            event.target.classList.add('on');
        }*/
    }

    getTitle() {
        const editMode = this.props.editMode;

        if (editMode === Contents3D.Edit_Mode_MovePOI) {
            return i18n.t('sdms.editModeStatusInfo.POI 편집모드');
        }
        else if (editMode === Contents3D.Edit_Mode_FakeWall) {
            return i18n.t('sdms.editModeStatusInfo.가벽 편집모드');
        }
        else if (editMode === Contents3D.Edit_Mode_Text) {
            return i18n.t('sdms.editModeStatusInfo.구역 편집모드');
        }
        else if (editMode === Contents3D.Edit_Mode_CCTVGroup) {
            return i18n.t('sdms.editModeStatusInfo.구역별 CCTV 편집모드');
        }

        return "";
    }

    getSensorTypeClassName(sensorType) {
        const visible = this.props.visibleSensorTypes[sensorType];

        if (visible) {
            return 'on';
        }

        return "";
    }

    getFakeWallClassName(upper, mode) {
        let name = "";

        if (upper) {
            if (mode === this.props.editModeParam) {
                name = 'on' + " " + 'upper';
            }
            else {
                name = 'upper';
            }
        }
        else {
            if (mode === this.props.editModeParam) {
                name = 'on';
            }
        }

        return name;
    }

    getCCTVGroupClassName(mode) {
        let name = "";

        if (mode === this.props.editModeParam) {
            name = 'on';
        }

        return name;
    }

    onClickMode(mode) {
        if (mode === this.props.editModeManager.poiEditMode) {
            return;
        } else if (mode === EditModeManager.AddIcon){
            this.setState({ addClick : true });
        } else if (mode !== EditModeManager.AddIcon){
            this.setState({ addClick : false });
        }

        this.props.editModeManager.setPoiEditMode(mode, this.state.mode);
        //this.props.editModeManager.poiEditMode = mode;
        this.setState({ searchText: this.state.searchText });
    }

    useEquipZoneArea() {
        const userInfo = ProjectResource.getUserInfo();
        return (userInfo?.options?.ui?.useEquipZoneArea === true);
    }    

    getPOISensorType = () => {
        let poiSensorTypeUI = [];

        const useSensorTypes = this.props.useSensorTypes;
        const siteID = ProjectResource.SiteID;

        if (useSensorTypes?.UseFire === true) {
            poiSensorTypeUI.push(<li key='poiSensorType_fire'><span className={this.getSensorTypeClassName(SDMSMainMenu.Fire_Sensor)} onClick={() => this.toggleButton(SDMSMainMenu.Fire_Sensor)}>{i18n.t('facilityType.화재센서')}</span></li>);
        }

        if (useSensorTypes?.UsePSM === true && siteID !== ProjectResource.Site.Soulbrain) {
            poiSensorTypeUI.push(<li key='poiSensorType_psm'><span className={this.getSensorTypeClassName(SDMSMainMenu.PSM_Sensor)} onClick={() => this.toggleButton(SDMSMainMenu.PSM_Sensor)}>{i18n.t('facilityType.누출센서')}</span></li>);
        }

        if (useSensorTypes?.UseETC === true && siteID === ProjectResource.Site.Soulbrain) {
            poiSensorTypeUI.push(<li key='poiSensorType_etc'><span className={this.getSensorTypeClassName(SDMSMainMenu.Etc_Sensor)} onClick={() => this.toggleButton("iot")}>{i18n.t('facilityType.IoT센서')}</span></li>);
        } else if (useSensorTypes?.UseETC === true) {
            poiSensorTypeUI.push(<li key='poiSensorType_etc'><span className={this.getSensorTypeClassName(SDMSMainMenu.Etc_Sensor)} onClick={() => this.toggleButton(SDMSMainMenu.Etc_Sensor)}>{i18n.t('facilityType.기타센서')}</span></li>);
        }

        if (useSensorTypes?.UseEnvironment === true) {
            poiSensorTypeUI.push(<li key='poiSensorType_environment'><span className={this.getSensorTypeClassName(SDMSMainMenu.Environment_Sensor)} onClick={() => this.toggleButton(SDMSMainMenu.Environment_Sensor)}>{i18n.t('facilityType.환경설비')}</span></li>);
        }

        if (useSensorTypes?.Manufacture_Sensor === true) {
            poiSensorTypeUI.push(<li key='poiSensorType_manufacture'><span className={this.getSensorTypeClassName(SDMSMainMenu.Manufacture_Sensor)} onClick={() => this.toggleButton(SDMSMainMenu.Manufacture_Sensor)}>{i18n.t('facilityType.제조설비')}</span></li>);
        }

        if (useSensorTypes?.UseEmergencyBell === true) {
            poiSensorTypeUI.push(<li key='poiSensorType_emergencyBell'><span className={this.getSensorTypeClassName(SDMSMainMenu.Emergency_Sensor)} onClick={() => this.toggleButton(SDMSMainMenu.Emergency_Sensor)}>{i18n.t('facilityType.비상벨')}</span></li>);
        }

        if (useSensorTypes?.UseParkingBreaker === true) {
            poiSensorTypeUI.push(<li key='poiSensorType_parkingBreaker'><span className={this.getSensorTypeClassName(SDMSMainMenu.Park)} onClick={() => this.toggleButton(SDMSMainMenu.Park)}>{i18n.t('facilityType.주차차단기')}</span></li>);
        }

        return poiSensorTypeUI;
    }

    getEditTargetButtons() {
        const editMode = this.props.editMode;
        const poiEditMode = this.props.editModeManager.poiEditMode;
        const siteID = ProjectResource.SiteID;

        if (editMode === Contents3D.Edit_Mode_MovePOI) {
            return (
                <div className={'edTgt'}>
                    <h5>{i18n.t('sdms.editModeStatusInfo.편집 대상')}</h5>
                    <ul className={'edgBtn'}>
                        {
                            siteID !== ProjectResource.Site.GG_A && 
                                <li><span className={this.getSensorTypeClassName(SDMSMainMenu.CCTV_Type)} onClick={() => this.toggleButton(SDMSMainMenu.CCTV_Type)}>{i18n.t('facilityType.CCTV')}</span></li>
                        }
                        {
                            this.getPOISensorType()
                        }
                    </ul>
                    <div className={'poiModeWrap'}>
                        <ul className={'poiMode'}>
                            <li><input type="radio" id="checkIcon" onChange={() => this.onClickMode(EditModeManager.CheckIcon)} checked={poiEditMode === EditModeManager.CheckIcon} /> <label htmlFor="checkIcon" className={'poiModeText'}>{i18n.t('sdms.editModeStatusInfo.정보 확인')}</label></li>
                            <li><input type="radio" id="moveIcon" onChange={() => this.onClickMode(EditModeManager.MoveIcon)} checked={poiEditMode === EditModeManager.MoveIcon} /> <label htmlFor="moveIcon" className={'poiModeText'}>{i18n.t('sdms.editModeStatusInfo.아이콘 이동')}</label></li>
                            {/* 구역 수정 >> 개발 미완료
                             * <li><input type="radio" id="changeEZIcon" onChange={() => this.onClickMode(EditModeManager.ChangeEquipZone)} checked={(poiEditMode === EditModeManager.ChangeEquipZone || poiEditMode === EditModeManager.ChangeEquipZone_OneClick)} /> <label htmlFor="changeEZIcon" className={'poiModeText'}>{i18n.t('sdms.editModeStatusInfo.구역 수정')}</label></li>*/}
                        </ul>
                        <ul className={'poiMode'}>
                            <li><input type="radio" id="deleteIcon" onChange={() => this.onClickMode(EditModeManager.DeleteIcon)} checked={poiEditMode === EditModeManager.DeleteIcon} /> <label htmlFor="deleteIcon" className={'poiModeText'}>{i18n.t('common.삭제')}</label></li>
                            <li><input type="radio" id="checkNDelete" onChange={() => this.onClickMode(EditModeManager.CheckNDelete)} checked={poiEditMode === EditModeManager.CheckNDelete} /> <label htmlFor="checkNDelete" className={'poiModeText'}>{i18n.t('sdms.editModeStatusInfo.확인 후 삭제')}</label></li>
                        </ul>
                    </div>
                </div>
            );
        }
        else if (editMode === Contents3D.Edit_Mode_FakeWall) {
            return (
                <div className={'edTgt'}>
                    <h5>{i18n.t('sdms.editModeStatusInfo.편집 대상')}</h5>
                    <ul className={'edgBtn'}>
                        <li><span className={this.getFakeWallClassName(true, FakeWallManager.Mode_Move)} onClick={() => this.props.setEditModeItem(Contents3D.Edit_Mode_FakeWall, FakeWallManager.Mode_Move)}>{i18n.t('sdms.editModeStatusInfo.이동')}</span></li>
                        <li><span className={this.getFakeWallClassName(true, FakeWallManager.Mode_Add_NoClick)} onClick={() => this.props.setEditModeItem(Contents3D.Edit_Mode_FakeWall, FakeWallManager.Mode_Add_NoClick)}>{i18n.t('common.추가')}</span></li>
                        <li><span className={this.getFakeWallClassName(true, FakeWallManager.Mode_Delete)} onClick={() => this.props.setEditModeItem(Contents3D.Edit_Mode_FakeWall, FakeWallManager.Mode_Delete)}>{i18n.t('common.삭제')}</span></li>
                        <li><span className={this.getFakeWallClassName(false, FakeWallManager.Mode_Resize)} onClick={() => this.props.setEditModeItem(Contents3D.Edit_Mode_FakeWall, FakeWallManager.Mode_Resize)}>{i18n.t('common.편집')}</span></li>
                        <li><span className={this.getFakeWallClassName(false, FakeWallManager.Mode_Rotate)} onClick={() => this.props.setEditModeItem(Contents3D.Edit_Mode_FakeWall, FakeWallManager.Mode_Rotate)}>{i18n.t('sdms.editModeStatusInfo.회전')}</span></li>
                    </ul>
                </div>
            );
        }
        else if (editMode === Contents3D.Edit_Mode_CCTVGroup) {
            return (
                <div className={'edTgt'}>
                    <h5>{i18n.t('sdms.editModeStatusInfo.편집 대상')}</h5>
                    <ul className={'edgBtn'}>
                        <li><span className={this.getCCTVGroupClassName(CCTVInfo.Mode_Select_Sensor)} onClick={() => this.props.setEditModeItem(Contents3D.Edit_Mode_CCTVGroup, CCTVInfo.Mode_Select_Sensor)}>{i18n.t('sdms.editModeStatusInfo.센서 선택')}</span></li>
                        <li><span className={this.getCCTVGroupClassName(CCTVInfo.Mode_Select_CCTV)} onClick={() => this.props.setEditModeItem(Contents3D.Edit_Mode_CCTVGroup, CCTVInfo.Mode_Select_CCTV)}>{i18n.t('sdms.editModeStatusInfo.CCTV 선택')}</span></li>
                        <li><span className={this.getCCTVGroupClassName(CCTVInfo.Mode_Delete_CCTV)} onClick={() => this.props.setEditModeItem(Contents3D.Edit_Mode_CCTVGroup, CCTVInfo.Mode_Delete_CCTV)}>{i18n.t('common.삭제')}</span></li>
                    </ul>
                </div>
            );
        }
        else if (editMode === Contents3D.Edit_Mode_Text) {

            if(this.useEquipZoneArea()) {
                return (
                    <div className={'edTgt'}>
                        <h5>{i18n.t('sdms.editModeStatusInfo.편집 대상')}</h5>
                        <ul className={'edgBtn'}>
                            <li><span className={this.getSensorTypeClassName(SDMSMainMenu.EquipZoneName)} onClick={() => this.toggleButton(SDMSMainMenu.EquipZoneName)}>{i18n.t('sdms.editModeStatusInfo.구역')}</span></li>
                            <li><span className={this.getSensorTypeClassName(SDMSMainMenu.EquipZoneArea)} onClick={() => this.toggleButton(SDMSMainMenu.EquipZoneArea)}>{i18n.t('sdms.editModeStatusInfo.영역')}</span></li>
                        </ul>
                        <h5>{i18n.t('sdms.editModeStatusInfo.편집 대상')}-{i18n.t('sdms.editModeStatusInfo.구역')}</h5>
                        <ul className={'edgBtn'}>
                            {/* .TODO: 미구현으로 인한 주석처리 */}
                            {/*<li><span>생성</span></li>*/}
                            <li><span className={this.getCCTVGroupClassName(TextPOIManager.Mode_MoveText)} onClick={() => this.props.setEditModeItem(Contents3D.Edit_Mode_Text, TextPOIManager.Mode_MoveText)}>{i18n.t('sdms.editModeStatusInfo.이동')}</span></li>
                            <li><span className={this.getCCTVGroupClassName(TextPOIManager.Mode_EditText)} onClick={() => this.props.setEditModeItem(Contents3D.Edit_Mode_Text, TextPOIManager.Mode_EditText)}>{i18n.t('common.편집')}</span></li>
                            {/*<li><span>삭제</span></li>*/}
                        </ul>
                        <h5>{i18n.t('sdms.editModeStatusInfo.편집 대상')}-{i18n.t('sdms.editModeStatusInfo.영역')}</h5>
                        <ul className={'edgBtn'}>
                            <li><span className={this.getCCTVGroupClassName(TextPOIManager.Mode_AddArea)} onClick={() => this.props.setEditModeItem(Contents3D.Edit_Mode_Text, TextPOIManager.Mode_AddArea)}>{i18n.t('sdms.editModeStatusInfo.생성')}</span></li>
                            <li><span className={this.getCCTVGroupClassName(TextPOIManager.Mode_RemoveArea)} onClick={() => this.props.setEditModeItem(Contents3D.Edit_Mode_Text, TextPOIManager.Mode_RemoveArea)}>{i18n.t('common.삭제')}</span></li>
                        </ul>
                    </div>
                );
            } else {
                return (
                    <div className={'edTgt'}>
                        <h5>{i18n.t('sdms.editModeStatusInfo.편집 대상')}</h5>
                        <ul className={'edgBtn'}>
                            <li><span className={this.getCCTVGroupClassName(TextPOIManager.Mode_MoveText)} onClick={() => this.props.setEditModeItem(Contents3D.Edit_Mode_Text, TextPOIManager.Mode_MoveText)}>{i18n.t('sdms.editModeStatusInfo.이동')}</span></li>
                            <li><span className={this.getCCTVGroupClassName(TextPOIManager.Mode_EditText)} onClick={() => this.props.setEditModeItem(Contents3D.Edit_Mode_Text, TextPOIManager.Mode_EditText)}>{i18n.t('sdms.editModeStatusInfo.이름 변경')}</span></li>
                        </ul>
                    </div>
                );
            }
        }

        return <></>
    }

    onClickNewCCTV(cctv) {
        if (cctv.added) {
            this.props.onSelectNewCCTV(null);
        }
        else if (this.props.selectedNewCCTV && cctv.id === this.props.selectedNewCCTV.id) {
            this.props.onSelectNewCCTV(null);
        }
        else {
            this.props.onSelectNewCCTV(cctv);
        }
    }

    searchCCTVs(cctvList) {
        const searchText = this.state.searchText.trim();

        if (searchText.length === 0) {
            return cctvList;
        }

        const cctvCount = cctvList.length;

        for (let i = cctvCount - 1; i >= 0; i--) {
            const cctv = cctvList[i];

            if (cctv.cameraName.includes(searchText) === false) {
                cctvList.splice(i, 1);
            }
        }

        return cctvList;
    }

    getNewCCTVList() {
        if (this.props.editMode === Contents3D.Edit_Mode_MovePOI) {
            const newCCTVList = this.searchCCTVs([ ...this.props.newCCTVList ]);
            const cctvCount = newCCTVList.length;

            if (cctvCount > 0) {
                if (this.prevShowNewCCTV === false) {
                    this.prevShowNewCCTV = true;
                    this.updateItem.selectedNewCCTV = null;
                    //this.props.onSelectNewCCTV(null);
                }

                this.prevShowNewCCTV = true;

                return (
                    <dl className={'edCtv'}>
                        <dt>{"추가된 CCTV - " + cctvCount + "개"}</dt>
                        <dd ref={this.refScrollbarCCTVListArea}>
                            <Scrollbars ref={this.refScrollbarCCTVList}>
                                <ul ref={this.refCCTVList} style={{ overflow : "hidden" }}>
                                    {
                                        newCCTVList.map((cctv, index) => {
                                            if (cctv.added) {
                                                return <li key={"newCCTVList_" + index}><p key={"newCCTV_" + index} className={'added'} onClick={(e) => this.onClickNewCCTV(cctv)}>{cctv.id + " - " + cctv.cameraName}</p></li>
                                            }
                                            else if (this.props.selectedNewCCTV && cctv.id === this.props.selectedNewCCTV.id) {
                                                return <li key={"newCCTVList_" + index}><p key={"newCCTV_" + index} className={'selected'} onClick={(e) => this.onClickNewCCTV(cctv)}>{cctv.id + " - " + cctv.cameraName}</p></li>
                                            }
                                            else {
                                                return <li key={"newCCTVList_" + index}><p key={"newCCTV_" + index} onClick={(e) => this.onClickNewCCTV(cctv)}>{cctv.id + " - " + cctv.cameraName}</p></li>
                                            }
                                        })
                                    }
                                    <li key={"newCCTVList_last"}><p key={"newCCTV_last"}></p></li>
                                </ul>
                            </Scrollbars>
                        </dd>
                    </dl>
                );
            }
        }

        this.prevShowNewCCTV = false;
        return <></>
    }

    getCCTVList() {
        if (this.props.editMode === Contents3D.Edit_Mode_MovePOI) {
            return (
                <dl className={'edCtv'}>
                    <dt>
                        <select>
                            <option>{i18n.t('sdms.editModeStatusInfo.화재센서 리스트')}</option>
                            <option>{i18n.t('sdms.editModeStatusInfo.가스센서 리스트')}</option>
                            <option>{i18n.t('sdms.editModeStatusInfo.환경센서 리스트')}</option>
                            <option>{i18n.t('sdms.editModeStatusInfo.CCTV 리스트')}</option>
                            <option>{i18n.t('sdms.editModeStatusInfo.제조설비 리스트')}</option>
                        </select>
                    </dt>
                    <dd ref={this.refScrollbarCCTVListArea} className={'scrollbar'}>
                        <ul ref={this.refCCTVList}>
                            <li><p className={'added'}>300-H1동 _B1F_소방펌프실</p></li>
                            <li><p className={'selected'}>300-H1동 _B1F_소방펌프실</p></li>
                            <li><p>300-H1동 _B1F_소방펌프실</p></li>
                            <li><p>300-H1동 _B1F_소방펌프실</p></li>
                            <li><p>300-H1동 _B1F_소방펌프실</p></li>
                            <li><p>300-H1동 _B1F_소방펌프실</p></li>
                            <li><p>300-H1동 _B1F_소방펌프실</p></li>
                        </ul>
                    </dd>
                </dl>
            )
        }
    }

    onChangeBuildingGroup = (value, type) => {
        this.props.onChangeBuildingGroup(value, type);
    }

    handlePopupRadioChange = (e) => {
        this.setState({
            selectValue: e.target.value
        });
    };

    onChangeMode = (mode) => {
        if (this.state.addClick) {
            this.props.editModeManager.setPoiEditMode(EditModeManager.AddIcon, mode);
        }

        this.setState({ mode: mode });
    }

    render() {
        let buildingGroupUI = this.getBuildingGroupUI();

        return (
            <EditModeStatusInfoComponent id={this.props.popupType} className={'viewDashboardBoxD viewDashboard'}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={320}
                    popupMinHeight={500}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >

                    <div className={'dslTop dslGrd'}>
                        <h5 className={'dslTitle'} >
                            {this.getTitle()}
                        </h5>
                    </div>

                    <div className={'dslCont'}>
                        {
                            this.getEditTargetButtons()
                        }
                        {
                            this.state.addClick?
                            <div>
                                <ul className={'poiAddMode'}>
                                    <li><input type="radio" name="addPoi" id="lifeIcon" onChange={() => this.onChangeMode(SDMSMainMenu.Life)} checked={this.state.mode === SDMSMainMenu.Life} /> <label htmlFor="lifeIcon" className={'poiModeText'}>인명구조기구</label></li>
                                    <li><input type="radio" name="addPoi" id="cardiacIcon" onChange={() => this.onChangeMode(SDMSMainMenu.Cardiac)} checked={this.state.mode === SDMSMainMenu.Cardiac}/> <label htmlFor="cardiacIcon" className={'poiModeText'}>심장제세동기</label></li>
                                    <li><input type="radio" name="addPoi" id="rescueIcon" onChange={() => this.onChangeMode(SDMSMainMenu.Rescue)} checked={this.state.mode === SDMSMainMenu.Rescue} /><label htmlFor="rescueIcon" className={'poiModeText'}>완강기</label></li>
                                </ul>
                            </div>
                            :
                            <></>
                        }
                        <div className={'dsiSch'}>
                            <input type="text" id="txtSearch" onKeyUp={this.searchEnterKey} />
                            <a onClick={this.search}>{i18n.t('sdms.editModeStatusInfo.조회')}</a>
                        </div>
                        {
                            this.getNewCCTVList()
                        }

                        {/* .TODO: 추가 센서 리스트 구현 미완료 주석처리
                            this.getCCTVList()
                        */}

                        <div ref={this.refScrollArea} className={'dsiScr scrollbar'}>
                                <ul ref={this.refTree} className={'dsiTree'}>
                                    {buildingGroupUI}
                                </ul>
                        </div>
                    </div>
                </PopupDraggable>

            </EditModeStatusInfoComponent>
        );
    }
}

export default withTranslation()(EditModeStatusInfo);