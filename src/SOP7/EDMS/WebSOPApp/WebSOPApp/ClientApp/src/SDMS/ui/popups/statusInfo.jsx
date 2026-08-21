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
import { faCameraRetro } from '@fortawesome/free-solid-svg-icons';
import ProjectResource from '../../../Root/resource/id';
import SDMSResource from '../../resource/id';

import PopupDraggable from './popupDraggable';
    
class StatusInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: ''
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

        this.selectedItemElement = null;
    }

    componentDidMount() {
        // 창이 서서히 나타나는 효과
        //$('#' + this.props.popupType).animate({ opacity: 1 }, SDMSResource.PopupAniTime, () => {
        //    if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
        //        document.getElementById(this.props.popupType).style.opacity = 1;
        //    }
        //});
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

            $('#' + this.props.popupType).animate({ opacity: 1, width: cssWidth, height: cssHeight, left: cssLeft, top: cssTop }, SDMSResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }
        else {
            $('#' + this.props.popupType).animate({ opacity: 1 }, SDMSResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }

        this.initPopupState();
        this.setScrollbar();

        $('.' + sdmsStyles.scrollbar).scrollTop(0);
    }

    setScrollbar() {
        const treeArea = this.refScrollArea.current.getBoundingClientRect();

        let scrollVisible = false;

        if (this.refTree.current) {
            const rectTree = this.refTree.current.getBoundingClientRect();

            if (rectTree.height > treeArea.height) {
                scrollVisible = true;
            }
        }

        SdmsScrollbar.setContentStyle(this.refScrollbar.current, treeArea.width, treeArea.height, scrollVisible);

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
                if (facility.facilityID >= 1 && (this.props.selectedInfo.facilitySubGroups_fire || this.props.selectedInfo.facilitySubGroups_air || this.props.selectedInfo.facilitySubGroups_electric || this.props.selectedInfo.facilitySubGroups_panel)) {

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
    
    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
        }

        this.setScrollbar();

        if (this.selectedItemElement) {
            // 스크롤바가 일단 초기화된 다음에 위치 계산을 해야 하기 때문에 0.5초 기다렸다 실시한다.
            setTimeout(() => this.checkScrollElement(this.selectedItemElement), 500);
        }
    }

    checkScrollElement(element) {
        if (element && this.isElementVisible(element, this.refScrollArea.current) === false) {
            element.scrollIntoView(true);
        }
    }

    // holder : scrollbar element
    isElementVisible(el, holder) {
        const { top, bottom, height } = el.getBoundingClientRect();
        const holderRect = holder.getBoundingClientRect();

        return top <= holderRect.top
            ? holderRect.top - top <= height
            : bottom - holderRect.bottom <= height;
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

    searchEnterKey = () => {
        if (window.event && window.event.keyCode === 13) {            
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
                buildingGroup={buildingGroup}
                zoneList={this.props.zoneList}
                buildingIDs={this.props.buildingIDs}
                indoorModels={this.props.indoorModels}
                sensorList={this.props.sensorList}
                moveToX={this.props.moveToX}
                onSelectSensor={this.props.onSelectSensor}
                selectedSensor={this.props.selectedSensor}
                selectedFacility={this.props.selectedFacility}
                getFacilityID={this.props.getFacilityID}
                sensorAlarms={this.props.sensorAlarms}
                searchText={this.state.searchText}
                facilityInfos={this.props.facilityInfos}
                isEditMode={false}
                multiSite={this.props.multiSite}
                selectedInfo={this.props.selectedInfo}
                onChangeBuildingGroup={this.onChangeBuildingGroup}
                setSelectedElement={this.setSelectedElement}
            />);
        }

        if (this.props.outdoorZones) {
            // 외부영역도 검색 필터기능 추가 - K.D.R
            if (this.setVisibleOutdoor(this.props.outdoorZones)) {
                ui.push(<StatusInfoBuildingGroup
                    id={'buildingGroup_outdoor'}
                    key={"bg_outdoor"}
                    isOutdoor={true}
                    buildingGroup={this.props.outdoorZones}
                    zoneList={this.props.zoneList}
                    buildingIDs={this.props.buildingIDs}
                    indoorModels={this.props.indoorModels}
                    sensorList={this.props.sensorList}
                    moveToX={this.props.moveToX}
                    onSelectSensor={this.props.onSelectSensor}
                    selectedSensor={this.props.selectedSensor}
                    selectedFacility={this.props.selectedFacility}
                    getFacilityID={this.props.getFacilityID}
                    sensorAlarms={this.props.sensorAlarms}
                    searchText={this.state.searchText}
                    facilityInfos={this.props.facilityInfos}
                    isEditMode={false}
                    multiSite={this.props.multiSite}
                    selectedInfo={this.props.selectedInfo}
                    onChangeBuildingGroup={this.onChangeBuildingGroup}
                    setSelectedElement={this.setSelectedElement}
                />);
            }
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
            // 빌딩그룹 이름에서 조건이 true가 되면 그 하위 단계는 필터를 건너뛰어서 표시가 안되서 수정 - K.D.R
            //else {
            //    let visible = false;
            //    for (let i = 0; i < buildingGroup.buildingDatas.length; i++) {
            //        const buildingVisible = this.setVisibleBuildingList(buildingGroup.buildingDatas[i]);
            //        if (buildingVisible === true) {
            //            visible = true;
            //        }
            //    }

            //    if (visible) {
            //        buildingGroup.visible = true;
            //    }
            //    else {
            //        buildingGroup.visible = false;
            //    }
            //}
            else {
                buildingGroup.visible = false;
            }

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
        }
    }

    setVisibleOutdoor(outdoorZones) {
        let outdoorVisible = false;

        if (SDMSResource.ID.buildingInfo.outdoor.includes(this.state.searchText)) {
            outdoorVisible = true;
        }

        for (const zoneID in outdoorZones) {
            const zone = outdoorZones[zoneID];
            const zoneID_Num = Number(zoneID);

            if (zone.name.includes(this.state.searchText)) {
                zone.visible = true;
            }
            else {
                let visibleCount = 0;

                if (zone.sensors?.fire) {
                    if (this.setVisibleSensors(zoneID_Num, zone.sensors.fire)) {
                        visibleCount++;
                    }
                }
                if (zone.sensors?.psm) {
                    if (this.setVisiblePsmSensors(zoneID_Num, zone.sensors?.psm)) {
                        visibleCount++;
                    }
                }
                if (zone.sensors?.etc) {
                    if (this.setVisibleSensors(zoneID_Num, zone.sensors.etc)) {
                        visibleCount++;
                    }
                }
                if (zone.sensors?.cctv) {
                    if (this.setVisibleSensors(zoneID_Num, zone.sensors.cctv)) {
                        visibleCount++;
                    }
                }

                if (visibleCount > 0) {
                    zone.visible = true;
                }
                else {
                    zone.visible = false;
                }

                if (zone.visible) {
                    outdoorVisible = true;
                }
            }
        }

        return outdoorVisible;
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
            // 빌딩 이름에서 조건이 true가 되면 그 하위 단계는 필터를 건너뛰어서 표시가 안되서 수정 - K.D.R
            //else {
            //    let visibleCount = 0;
            //    if (this.setVisibleSensors(zone.id, this.props.sensorList.fireSensors)) {
            //        visibleCount++;
            //    }
            //    if (this.setVisibleSensors(zone.id, this.props.sensorList.etcSensors)) {
            //        visibleCount++;
            //    }
            //    if (this.setVisibleSensors(zone.id, this.props.sensorList.cctvs)) {
            //        visibleCount++;
            //    }
            //    if (this.setVisiblePsmSensors(zone.id, this.props.sensorList.psmSensors)) {
            //        visibleCount++;
            //    }
            //    if (this.setVisibleFacilityInfos(zone.id, this.props.facilityInfos)) {
            //        visibleCount++;
            //    }

            //    if (visibleCount > 0) {
            //        zone.visible = true;
            //    }
            //    else {
            //        zone.visible = false;
            //    }

            //    if (zone.visible) {
            //        buildingVisible = true;
            //    }
            //}
            else {
                zone.visible = false;
            }

            let visibleCount = 0;

            if (this.setVisibleSensors(zone.id, this.props.sensorList.fireSensors)) {
                visibleCount++;
            }
            if (this.setVisibleSensors(zone.id, this.props.sensorList.etcSensors)) {
                visibleCount++;
            }
            if (this.setVisibleSensors(zone.id, this.props.sensorList.cctvs)) {
                visibleCount++;
            }
            if (this.setVisiblePsmSensors(zone.id, this.props.sensorList.psmSensors)) {
                visibleCount++;
            }
            if (this.setVisibleFacilityInfos(zone.id, this.props.facilityInfos)) {
                visibleCount++;
            }

            if (visibleCount > 0) {
                zone.visible = true;
            }

            if (zone.visible) {
                buildingVisible = true;
            }
        }

        buildingData.visible = buildingVisible;

        return buildingData.visible;
    }

    setVisibleSensors(zoneID, sensors) {
        let visible2 = false;
        const sensorsCount = sensors.length;
        for (let j = 0; j < sensorsCount; j++) {
            const sensor = sensors[j];
            if (zoneID !== sensor.zoneID)
                continue;

            if (sensor.name.includes(this.state.searchText)) {
                sensor.visible = true;
                visible2 = true;
            }
            else {
                sensor.visible = false;
            }
        }

        return visible2;
    }

    setVisiblePsmSensors(zoneID, sensors) {
        let visible2 = false;
        const sensorsCount = sensors.length;
        for (let i = 0; i < sensorsCount; i++) {
            const sensor = sensors[i];
            if (!sensor.linkedZones)
                continue;

            for (var j = 0; j < sensor.linkedZones.length; j++) {
                if (sensor.linkedZones[j].id !== zoneID)
                    continue;

                if (sensor.name.includes(this.state.searchText)) {
                    sensor.visible = true;
                    visible2 = true;
                }
                else {
                    sensor.visible = false;
                }
                break;
            }
        }
        return visible2;
    }

    onChangeVisible(sensorType) {
        this.props.setVisiblePoi(sensorType, !this.props.visibleSensorTypes[sensorType]);
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

    setVisibleFacilityInfos(zoneID, infos) {
        let visible2 = false;
        const infosCount = infos.length;
        for (let j = 0; j < infosCount; j++) {
            const info = infos[j];
            if (zoneID !== info.zoneID)
                continue;

            if (info.facilityName.includes(this.state.searchText)) {
                info.visible = true;
                visible2 = true;
            }
            else {
                info.visible = false;
            }
        }

        return visible2;
    }

    getCCTVNotify() {
        if (this.props.newCCTVList.length > 0) {
            return (
                <div className={content.dsToast}>
                    <p>
                        CCTV 위치지정이 필요합니다.
                            <br />
                        <a className={commonStyles.clickable} onClick={() => this.props.setEditModeItem(Contents3D.Edit_Mode_MovePOI, null)}>&lt;편집모드&gt;</a>
                            에서 수정하실 수 있습니다.
                        </p>
                </div>
            );
        }

        return <></>
    }

    onChangeBuildingGroup = (value, type) => {
        this.props.onChangeBuildingGroup(value, type);
    }

    setSelectedElement = (element) => {
        if (element) {
            this.selectedItemElement = element;
        }
    }

    render() {
        this.selectedItemElement = null;
        const buildingGroupUI = this.getBuildingGroupUI();

        let visibleElectricPOI = this.props.visibleSensorTypes[SDMSMainMenu.Electric_Sensor] ? true : false;
        let visibleFireControlPOI = this.props.visibleSensorTypes[SDMSMainMenu.FireControl_Sensor] ? true : false;
        let visibleFireAlarmPOI = this.props.visibleSensorTypes[SDMSMainMenu.Fire_Sensor] ? true : false;
        let visibleCCTVPOI = this.props.visibleSensorTypes[SDMSMainMenu.CCTV_Type] ? true : false;
        let visibleExitLightPOI = this.props.visibleSensorTypes[SDMSMainMenu.ExitLight_Sensor] ? true : false;
        let visibleAirFanPOI = this.props.visibleSensorTypes[SDMSMainMenu.AirFan] ? true : false;

        let visibleElectricClassName = (visibleElectricPOI) ? content.visibleElectric : content.disableElectric;
        let visibleFireControlClassName = (visibleFireControlPOI) ? content.visibleFireControl : content.disableFireControl;
        let visibleFireAlarmClassName = (visibleFireAlarmPOI) ? content.visibleFireAlarm : content.disableFireAlarm;
        let visibleCCTVClassName = (visibleCCTVPOI) ? content.visibleFormal : content.disableFormal;
        let visibleExitLightClassName = (visibleExitLightPOI) ? content.visibleExitLight : content.disableExitLight;
        let visibleAirFanClassName = (visibleAirFanPOI) ? content.visibleAirFan : content.disableAirFan;

        return (
            <div id={this.props.popupType} className={content.viewDashboardBoxD + ' ' + content.viewDashboard}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={330}
                    popupMinHeight={500}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >

                    <div className={content.dslTop + " " + content.dslGrd}>
                        <h5 className={content.dslTitle} >
                            현황정보
                        </h5>
                        <a className={content.dslX} onClick={() => this.props.setVisiblePopups(SDMS.menu.statusInfo, false)}></a>
                    </div>

                    <div className={content.dslCont}>
                        {
                            this.getCCTVNotify()
                        }
                        <div className={content.dsiSel}>
                            <div onClick={this.onClickLayer}>
                                {/* <ul ref={this.refLayer}>
                                    <li><label className={visibleElectricClassName} title="전기" ><input type="checkbox" checked={visibleElectricPOI} onChange={() => this.onChangeVisible(SDMSMainMenu.Electric_Sensor)} /></label></li>
                                    <li><label className={visibleFireControlClassName} title="소화" ><input type="checkbox" checked={visibleFireControlPOI} onChange={() => this.onChangeVisible(SDMSMainMenu.FireControl_Sensor)} /></label></li>
                                    <li><label className={visibleFireAlarmClassName} title="화재경보"  ><input type="checkbox" checked={visibleFireAlarmPOI} onChange={() => this.onChangeVisible(SDMSMainMenu.FireAlarm_Sensor)} /></label></li>
                                    <li><label className={visibleFormalClassName} title="미분무소화"  ><input type="checkbox" checked={visibleFormalPOI} onChange={() => this.onChangeVisible(SDMSMainMenu.Formal_Sensor)} /></label></li>
                                    <li><label className={visibleExitLightClassName} title="유도등"  ><input type="checkbox" checked={visibleExitLightPOI} onChange={() => this.onChangeVisible(SDMSMainMenu.ExitLight_Sensor)} /></label></li>
                                    <li><label className={visibleAirFanClassName} title="공조"  ><input type="checkbox" checked={visibleAirFanPOI} onChange={() => this.onChangeVisible(SDMSMainMenu.AirFan)} /></label></li>
                                </ul> */}
                                {/* EDMS */}
                                <span className={content.facilitiesBox}>
                                    <p>설비</p>
                                    <ul ref={this.refLayer}>
                                        <li><label className={visibleElectricClassName} title="전기" ><input type="checkbox" checked={visibleElectricPOI} onChange={() => this.onChangeVisible(SDMSMainMenu.Electric_Sensor)} /></label></li>
                                        <li><label className={visibleFireControlClassName} title="소화" ><input type="checkbox" checked={visibleFireControlPOI} onChange={() => this.onChangeVisible(SDMSMainMenu.FireControl_Sensor)} /></label></li>
                                        <li><label className={visibleAirFanClassName} title="공조"  ><input type="checkbox" checked={visibleAirFanPOI} onChange={() => this.onChangeVisible(SDMSMainMenu.AirFan)} /></label></li>
                                    </ul>
                                </span>
                                <span className={content.poiBox}>
                                    <p>관심 지점</p>
                                    <ul ref={this.refLayer}>
                                        <li><label className={visibleExitLightClassName} title="유도등"  ><input type="checkbox" checked={visibleExitLightPOI} onChange={() => this.onChangeVisible(SDMSMainMenu.ExitLight_Sensor)} /></label></li>
                                        <li><label className={visibleFireAlarmClassName} title="화재센서"  ><input type="checkbox" checked={visibleFireAlarmPOI} onChange={() => this.onChangeVisible(SDMSMainMenu.Fire_Sensor)} /></label></li>
                                        <li><label className={visibleCCTVClassName} title="CCTV"  ><input type="checkbox" checked={visibleCCTVPOI} onChange={() => this.onChangeVisible(SDMSMainMenu.CCTV_Type)} /></label></li>
                                    </ul>
                                </span>
                            </div>
                        </div>
                        <div className={content.dsiSch}>
                                <input type="text" id="txtSearch" onKeyUp={this.searchEnterKey} />
                                <a onClick={this.search}>검색</a>
                        </div>
                        <div ref={this.refScrollArea} className={content.dsiScr + " " + sdmsStyles.scrollbar}>
                            {
                                    <ul ref={this.refTree} className={content.dsiTree}>
                                        {buildingGroupUI}
                                    </ul>
                            }
				        </div>
                    </div>
                </PopupDraggable>
            </div>
        );
    }
}

export default StatusInfo;