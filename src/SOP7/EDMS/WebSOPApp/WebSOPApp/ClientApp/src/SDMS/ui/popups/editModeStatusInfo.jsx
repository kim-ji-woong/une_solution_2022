import { ui } from 'jquery';
import React, { Component } from 'react';
import content from '../../../Common/css/content.module.css';
import uis from '../../../Common/css/ui.module.css';
import imgClose from '../../../Common/image/icon/close_x.png';
import imgZoomIco from '../../../Common/image/icon/zoom_ico.png';
import SDMS from '../sdms';
import StatusInfoBuildingGroup from './statusInfoBuildingGroup';
import SDMSMainMenu from '../sdmsMainMenu';
import commonStyles from '../../../Common/css/style.module.css';
import sdmsStyles from '../../css/sdms.module.css';
import $ from 'jquery';
import { array } from '@amcharts/amcharts4/core';
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

class EditModeStatusInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: ''
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
            $("." + content.tabcontent).hide();
            $("." + content.tabcontent + ':first').show();

            $('ul.' + content.tabs + ' li').click(function () {
                $('ul.' + content.tabs + ' li').removeClass(content.active).css("color", "#fff");
                //$(this).addClass("active").css({"color": "darkred","font-weight": "bolder"});
                $(this).addClass(content.active).css("color", "#fff");
                $("." + content.tabcontent).hide()
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
                const temp = document.getElementById('building_' + building.id);
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
        var popup = document.getElementsByClassName(content.viewDashboard + ' ' + content.viewDashboardBoxD)[0];

        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
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
        const on = content.on;

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
            visible = this.props.visibleSensorTypes["etc"];
        else
            visible = this.props.visibleSensorTypes[sensorType];

        this.props.setVisiblePoi(sensorType, visible ? false : true);
        /*if (event.target.classList.contains(content.on)) {
            event.target.classList.remove(content.on);
        }
        else {
            event.target.classList.add(content.on);
        }*/
    }

    getTitle() {
        const editMode = this.props.editMode;

        if (editMode === Contents3D.Edit_Mode_MovePOI) {
            return "POI 편집모드";
        }
        else if (editMode === Contents3D.Edit_Mode_FakeWall) {
            return "가벽 편집모드";
        }
        else if (editMode === Contents3D.Edit_Mode_Text) {
            return "구역명 편집모드";
        }
        else if (editMode === Contents3D.Edit_Mode_CCTVGroup) {
            return "구역별 CCTV 편집모드";
        }

        return "";
    }

    getSensorTypeClassName(sensorType) {
        const visible = this.props.visibleSensorTypes[sensorType];

        if (visible) {
            return content.on;
        }

        return "";
    }

    getFakeWallClassName(upper, mode) {
        let name = "";

        if (upper) {
            if (mode === this.props.editModeParam) {
                name = content.on + " " + content.upper;
            }
            else {
                name = content.upper;
            }
        }
        else {
            if (mode === this.props.editModeParam) {
                name = content.on;
            }
        }

        return name;
    }

    getCCTVGroupClassName(mode) {
        let name = "";

        if (mode === this.props.editModeParam) {
            name = content.on;
        }

        return name;
    }

    onClickMode(mode) {
        if (mode === this.props.editModeManager.poiEditMode) {
            return;
        }

        this.props.editModeManager.poiEditMode = mode;
        this.setState({ searchText: this.state.searchText });
    }

    getEditTargetButtons() {
        const editMode = this.props.editMode;
        const poiEditMode = this.props.editModeManager.poiEditMode;

        // GS인증 관련 UI
        let editTargetButton = null;

        if (ProjectResource.isGSMode !== true) {
            editTargetButton = <li><span className={this.getSensorTypeClassName("etc")} onClick={() => this.toggleButton("iot")}>IoT센서</span></li>;
        }

        if (editMode === Contents3D.Edit_Mode_MovePOI) {
            return (
                <div className={content.edTgt}>
                    <h5>편집대상</h5>
                    <ul className={content.edgBtn}>
                        <li><span className={this.getSensorTypeClassName("cctv")} onClick={() => this.toggleButton("cctv")}>CCTV</span></li>
                        <li><span className={this.getSensorTypeClassName("fire")} onClick={() => this.toggleButton("fire")}>화재센서</span></li>
                        {editTargetButton}
                    </ul>
                    <ul className={content.poiMode}>
                        <li><input type="radio" id="checkIcon" onChange={() => this.onClickMode(EditModeManager.CheckIcon)} checked={poiEditMode === EditModeManager.CheckIcon} /> <label htmlFor="checkIcon" className={content.poiModeText}>정보확인</label></li>
                        <li><input type="radio" id="moveIcon" onChange={() => this.onClickMode(EditModeManager.MoveIcon)} checked={poiEditMode === EditModeManager.MoveIcon} /> <label htmlFor="moveIcon" className={content.poiModeText}>아이콘 이동</label></li>
                    </ul>
                    <ul className={content.poiMode}>
                        <li><input type="radio" id="deleteIcon" onChange={() => this.onClickMode(EditModeManager.DeleteIcon)} checked={poiEditMode === EditModeManager.DeleteIcon} /> <label htmlFor="deleteIcon" className={content.poiModeText}>삭제</label></li>
                        <li><input type="radio" id="checkNDelete" onChange={() => this.onClickMode(EditModeManager.CheckNDelete)} checked={poiEditMode === EditModeManager.CheckNDelete} /> <label htmlFor="checkNDelete" className={content.poiModeText}>확인후 삭제</label></li>
                    </ul>
                </div>
            );
        }
        else if (editMode === Contents3D.Edit_Mode_FakeWall) {
            return (
                <div className={content.edTgt}>
                    <h5>편집대상</h5>
                    <ul className={content.edgBtn}>
                        <li><span className={this.getFakeWallClassName(true, FakeWallManager.Mode_Move)} onClick={() => this.props.setEditModeItem(Contents3D.Edit_Mode_FakeWall, FakeWallManager.Mode_Move)}>이동</span></li>
                        <li><span className={this.getFakeWallClassName(true, FakeWallManager.Mode_Add_NoClick)} onClick={() => this.props.setEditModeItem(Contents3D.Edit_Mode_FakeWall, FakeWallManager.Mode_Add_NoClick)}>추가</span></li>
                        <li><span className={this.getFakeWallClassName(true, FakeWallManager.Mode_Delete)} onClick={() => this.props.setEditModeItem(Contents3D.Edit_Mode_FakeWall, FakeWallManager.Mode_Delete)}>삭제</span></li>
                        <li><span className={this.getFakeWallClassName(false, FakeWallManager.Mode_Resize)} onClick={() => this.props.setEditModeItem(Contents3D.Edit_Mode_FakeWall, FakeWallManager.Mode_Resize)}>수정</span></li>
                        <li><span className={this.getFakeWallClassName(false, FakeWallManager.Mode_Rotate)} onClick={() => this.props.setEditModeItem(Contents3D.Edit_Mode_FakeWall, FakeWallManager.Mode_Rotate)}>회전</span></li>
                    </ul>
                </div>
            );
        }
        else if (editMode === Contents3D.Edit_Mode_CCTVGroup) {
            return (
                <div className={content.edTgt}>
                    <h5>편집대상</h5>
                    <ul className={content.edgBtn}>
                        <li><span className={this.getCCTVGroupClassName(CCTVInfo.Mode_Select_Sensor)} onClick={() => this.props.setEditModeItem(Contents3D.Edit_Mode_CCTVGroup, CCTVInfo.Mode_Select_Sensor)}>센서 선택</span></li>
                        <li><span className={this.getCCTVGroupClassName(CCTVInfo.Mode_Select_CCTV)} onClick={() => this.props.setEditModeItem(Contents3D.Edit_Mode_CCTVGroup, CCTVInfo.Mode_Select_CCTV)}>CCTV 선택</span></li>
                        <li><span className={this.getCCTVGroupClassName(CCTVInfo.Mode_Delete_CCTV)} onClick={() => this.props.setEditModeItem(Contents3D.Edit_Mode_CCTVGroup, CCTVInfo.Mode_Delete_CCTV)}>삭제</span></li>
                    </ul>
                </div>
            );
        }
        else if (editMode === Contents3D.Edit_Mode_Text) {
            return (
                <div className={content.edTgt}>
                    <h5>편집대상</h5>
                    <ul className={content.edgBtn}>
                        <li><span className={this.getCCTVGroupClassName(TextPOIManager.Mode_MoveText)} onClick={() => this.props.setEditModeItem(Contents3D.Edit_Mode_Text, TextPOIManager.Mode_MoveText)}>이동</span></li>
                        <li><span className={this.getCCTVGroupClassName(TextPOIManager.Mode_EditText)} onClick={() => this.props.setEditModeItem(Contents3D.Edit_Mode_Text, TextPOIManager.Mode_EditText)}>이름변경</span></li>
                    </ul>
                </div>
            );
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
                    <dl className={content.edCtv}>
                        <dt>{"추가된 CCTV - " + cctvCount + "개"}</dt>
                        <dd ref={this.refScrollbarCCTVListArea}>
                            <Scrollbars ref={this.refScrollbarCCTVList}>
                                <ul ref={this.refCCTVList} style={{ overflow : "hidden" }}>
                                    {
                                        newCCTVList.map((cctv, index) => {
                                            if (cctv.added) {
                                                return <li key={"newCCTVList_" + index}><p key={"newCCTV_" + index} className={content.added} onClick={(e) => this.onClickNewCCTV(cctv)}>{cctv.id + " - " + cctv.cameraName}</p></li>
                                            }
                                            else if (this.props.selectedNewCCTV && cctv.id === this.props.selectedNewCCTV.id) {
                                                return <li key={"newCCTVList_" + index}><p key={"newCCTV_" + index} className={content.selected} onClick={(e) => this.onClickNewCCTV(cctv)}>{cctv.id + " - " + cctv.cameraName}</p></li>
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

    onChangeBuildingGroup = (value, type) => {
        this.props.onChangeBuildingGroup(value, type);
    }

    render() {
        let buildingGroupUI = this.getBuildingGroupUI();

        return (
            <div id={this.props.popupType} className={content.viewDashboardBoxD + ' ' + content.viewDashboard}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={320}
                    popupMinHeight={500}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >

                    <div className={content.dslTop + " " + content.dslGrd}>
                        <h5 className={content.dslTitle} >
                            {this.getTitle()}
                        </h5>
                    </div>

                    <div className={content.dslCont}>
                        {
                            this.getEditTargetButtons()
                        }
                        <div className={content.dsiSch}>
                            <input type="text" id="txtSearch" onKeyUp={this.searchEnterKey} />
                            <a onClick={this.search}>검색</a>
                        </div>
                        {
                            this.getNewCCTVList()
                        }
                        <div ref={this.refScrollArea} className={content.dsiScr + " " + sdmsStyles.scrollbar}>
                                <ul ref={this.refTree} className={content.dsiTree}>
                                    {buildingGroupUI}
                                </ul>
                        </div>
                    </div>
                </PopupDraggable>
            </div>
        );
    }
}

export default EditModeStatusInfo;