import { ui } from 'jquery';
import React, { Component } from 'react';
import SDMS from '../../sdms';
import StatusInfoBuildingGroup from '../statusInfoBuildingGroup';
import SDMSMainMenu from '../../sdmsMainMenu';
import $ from 'jquery';
import SettingsStore from '../../../../Settings/settingsStore';
import { SdmsScrollbar } from '../SdmsScrollbar';
import Contents3D from '../../3D/contents3D';
import ProjectResource from '../../../../Root/resource/id';
import SdmsResource from '../../../resource/id';
import AccountResource from '../../../../Account/resource/id';

import PopupDraggable from '../popupDraggable';

import { StatusInfoComponent } from '../../../styled/sdmsPopupsStyled';
import { i18n, withTranslation, i18nUtil } from '../../../../language/i18n';
import { isEqual } from 'lodash';
    
class StatusInfo_gg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            tooltip: {
                tooltipShow: false,
                tooltipTop: 0,
                tooltipLeft: 0
            }
        }

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
        this.setScrollbar();

        $('.scrollbar').scrollTop(0);
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
                else if (sensorType === SDMSMainMenu.Emergency_Sensor && this.props.selectedInfo.emergencyBellSensors) {
                    const ele = document.getElementById('emergencyBellSensor_' + sensorID);
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

                    const temp = document.getElementById('emergencyBellSensor_' + sensorID);
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
                else if (sensorType === SDMSMainMenu.Laser_Sensor && this.props.selectedInfo.laser) {
                    const ele = document.getElementById('laserSensor_' + sensorID);
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
                    
                    const temp = document.getElementById('laserSensor_' + sensorID);
                    temp.scrollIntoView({ "behavior": "smooth", "block": "center" });
                    
                }
                else if (sensorType === SDMSMainMenu.Door_Sensor && this.props.selectedInfo.door) {
                    const ele = document.getElementById('doorSensor_' + sensorID);
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
                    
                    const temp = document.getElementById('doorSensor_' + sensorID);
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
            else if (this.props.selectedInfo.cctvGroups)
            {
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

                if (temp) {
                    temp.scrollIntoView({ "behavior": "smooth" });
                }
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
            console.log('statusInfoZIndex changed', this.state.popup.style.zIndex)
        }

        const compare = isEqual(prevProps.selectedSensor, this.props.selectedSensor);
        if (!compare) {
            this.setScrollbar();
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

        // 현재 선택된 입주기관
        const selectSiteID = this.props.selectSiteID;
        
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

            // 현재 선택된 입주기관이 종합방재실일 경우 모든 입주기관 데이터 표출
            // 특정 입주기관이 선택된 경우 해당 입주기관 데이터만 표출
            if (selectSiteID === ProjectResource.Site.GG_A || buildingGroup.siteID === selectSiteID) {
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
                    useSensorTypes={this.props.useSensorTypes}
                    site3dOptions={this.props.site3dOptions}
                    changeSelectSiteID={this.props.changeSelectSiteID}
                    loading3D={this.props.loading3D}
                />);
            }
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
                    useSensorTypes={this.props.useSensorTypes}
                    site3dOptions={this.props.site3dOptions}
                    changeSelectSiteID={this.props.changeSelectSiteID}
                    loading3D={this.props.loading3D}
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

        if (i18n.t('sdms.statusInfo.외부 영역').includes(this.state.searchText)) {
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

    onChangeBuildingGroup = (value, type) => {
        this.props.onChangeBuildingGroup(value, type);
    }

    handleTooltip = (e) => {
		const domRect = e.target.getBoundingClientRect();

		this.setState({
            tooltip: {
                tooltipShow: !this.state.tooltipShow,
                tooltipTop: domRect.top - 24,
                tooltipLeft: domRect.left - 30,
            }
        });
	}

    render() {
        const userInfo = ProjectResource.getUserInfo();
        const buildingGroupUI = this.getBuildingGroupUI();

        let visibleFirePOI = this.props.visibleSensorTypes[SDMSMainMenu.Fire_Sensor] ? true : false;        
        let visibleCctvPOI = this.props.visibleSensorTypes[SDMSMainMenu.CCTV_Type] ? true : false;
        let visibleEquipZoneName = this.props.visibleSensorTypes[SDMSMainMenu.EquipZoneName] ? true : false;
        let visibleEmergencyBell = this.props.visibleSensorTypes[SDMSMainMenu.Emergency_Sensor] ? true : false;  
        let visiblePark = this.props.visibleSensorTypes[SDMSMainMenu.Park] ? true : false; 
        let visibleLife = this.props.visibleSensorTypes[SDMSMainMenu.Life] ? true : false;
        let visibleCardiac = this.props.visibleSensorTypes[SDMSMainMenu.Cardiac] ? true : false;
        let visibleRescue = this.props.visibleSensorTypes[SDMSMainMenu.Rescue] ? true : false;

        let visibleFireClassName = (visibleFirePOI) ? 'visibleFire' : 'disableFire';
        let visibleCctvClassName = (visibleCctvPOI) ? 'visibleCCTV' : 'disableCCTV';
        let visibleEquipZoneNameClassName = (visibleEquipZoneName) ? 'visibleEquip' : 'disableEquip';
        let visibleEmergencyBellClassName = (visibleEmergencyBell) ? 'visibleEmergencyBell' : 'disableEmergencyBell';
        let visibleParkClassName = (visiblePark) ? 'visiblePark' : 'disablePark';
        let visibleLifeClassName = (visibleLife) ? 'visibleLife' : 'disableLife';
        let visibleCardiacClassName = (visibleCardiac) ? 'visibleCardiac' : 'disableCardiac';
        let visibleRescueClassName = (visibleRescue) ? 'visibleRescue' : 'disableRescue';


        let poiSensorList = [];
        const selectSiteID = this.props.selectSiteID;

        if (selectSiteID && selectSiteID === ProjectResource.Site.GG_A) {
            poiSensorList.push(
                <ul ref={this.refLayer} key="poiSensorList">
                    <li key="visibleCctvType"><label className={visibleCctvClassName} title={i18n.t('facilityType.CCTV')}><input type="checkbox" checked={visibleCctvPOI} onChange={() => this.onChangeVisible(SDMSMainMenu.CCTV_Type)} /></label></li>
                    <li key="visibleParkType"><label className={visibleParkClassName} title={i18n.t('facilityType.주차차단기')}><input type="checkbox" checked={visiblePark} onChange={() => this.onChangeVisible(SDMSMainMenu.Park)} /></label></li>
                    <li key="visibleLifeSaving"><label className={visibleLifeClassName} title={i18n.t('facilityType.인명구조기구')}><input type="checkbox" checked={visibleLife} onChange={() => this.onChangeVisible(SDMSMainMenu.Life)} /></label></li>
                    <li key="visibleCardiacDefibrillator"><label className={visibleCardiacClassName} title={i18n.t('facilityType.심장제세동기')}><input type="checkbox" checked={visibleCardiac} onChange={() => this.onChangeVisible(SDMSMainMenu.Cardiac)} /></label></li>
                    <li key="visibleRescueTeam"><label className={visibleRescueClassName} title={i18n.t('facilityType.완강기')}><input type="checkbox" checked={visibleRescue} onChange={() => this.onChangeVisible(SDMSMainMenu.Rescue)} /></label></li>
                    <li key="visibleEquipZoneNameTpye"><label className={visibleEquipZoneNameClassName} title={i18n.t('sdms.statusInfo.공간정보 명칭')}><input type="checkbox" checked={visibleEquipZoneName} onChange={() => this.onChangeVisible(SDMSMainMenu.EquipZoneName)} /></label></li>
                </ul>
            );
        }
        else if (selectSiteID >= ProjectResource.Site.GG_B && selectSiteID <= ProjectResource.Site.GG_H) {
            poiSensorList.push(
                <ul ref={this.refLayer} key="poiSensorList">
                    <li key="visibleFireType"><label className={visibleFireClassName} title={i18n.t('facilityType.화재')}><input type="checkbox" checked={visibleFirePOI} onChange={() => this.onChangeVisible(SDMSMainMenu.Fire_Sensor)} /></label></li>
                    <li key="visibleCctvType"><label className={visibleCctvClassName} title={i18n.t('facilityType.CCTV')}><input type="checkbox" checked={visibleCctvPOI} onChange={() => this.onChangeVisible(SDMSMainMenu.CCTV_Type)} /></label></li>
                    <li key="visibleEmergencyBellType"><label className={visibleEmergencyBellClassName} title={i18n.t('facilityType.비상벨')}><input type="checkbox" checked={visibleEmergencyBell} onChange={() => this.onChangeVisible(SDMSMainMenu.Emergency_Sensor)} /></label></li>
                    <li key="visibleParkType"><label className={visibleParkClassName} title={i18n.t('facilityType.주차차단기')}><input type="checkbox" checked={visiblePark} onChange={() => this.onChangeVisible(SDMSMainMenu.Park)} /></label></li>
                    <li key="visibleLifeSaving"><label className={visibleLifeClassName} title={i18n.t('facilityType.인명구조기구')}><input type="checkbox" checked={visibleLife} onChange={() => this.onChangeVisible(SDMSMainMenu.Life)} /></label></li>
                    <li key="visibleCardiacDefibrillator"><label className={visibleCardiacClassName} title={i18n.t('facilityType.심장제세동기')}><input type="checkbox" checked={visibleCardiac} onChange={() => this.onChangeVisible(SDMSMainMenu.Cardiac)} /></label></li>
                    <li key="visibleRescueTeam"><label className={visibleRescueClassName} title={i18n.t('facilityType.완강기')}><input type="checkbox" checked={visibleRescue} onChange={() => this.onChangeVisible(SDMSMainMenu.Rescue)} /></label></li>
                    <li key="visibleEquipZoneNameTpye"><label className={visibleEquipZoneNameClassName} title={i18n.t('sdms.statusInfo.공간정보 명칭')}><input type="checkbox" checked={visibleEquipZoneName} onChange={() => this.onChangeVisible(SDMSMainMenu.EquipZoneName)} /></label></li>
                </ul>
            );
        }

        return (
            <StatusInfoComponent id={this.props.popupType} className={'viewDashboardBoxD viewDashboard'} $siteID={userInfo.siteID}>
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
                        <h5 className={'dslTitle'}>{i18n.t('sdms.statusInfo.현황정보')}</h5>
                        <a className={'dslX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.statusInfo, false)}></a>
                    </div>

                    <div className={'dslCont'}>
                        <div className={'dsiSel'}>
                            <div onClick={this.onClickLayer}>
                            {poiSensorList}
                            </div>
                        </div> 
                        <div className={'dsiSch'}>
                            <input type="text" id="txtSearch" onKeyUp={this.searchEnterKey} />
                            <a onClick={this.search}>{i18n.t('sdms.statusInfo.검색')}</a>
                        </div>

                        <div ref={this.refScrollArea} className={'dsiScr scrollbar'}>
                            {
                                <ul ref={this.refTree} className={'dsiTree'}>
                                    {
                                        (selectSiteID === ProjectResource.Site.GG_A) &&
                                        <div className={'viewListHeadWrap'} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span className={'viewListHead title'} style={{ cursor: "default" }}>경기융합타운</span>
                                            <span className={'tooltipGG'} 
                                                onMouseEnter={(e) => this.handleTooltip(e)}
                                                onMouseLeave={() => this.setState({ tooltip: {tooltipShow: false} })}
                                            />
                                        </div>
                                    }
                                    {buildingGroupUI}
                                </ul>
                            }
                        </div>
                    </div>
                    {
                        // 경기도 종합방재실 tooltip
                        this.state.tooltip.tooltipShow &&
                        <p className='tooltipGG-content'>입주기관의 개별 상세정보는 <br /> 입주기관 진입 시 확인할 수 있습니다.</p>
                    }
                </PopupDraggable>
            </StatusInfoComponent>
        );
    }
}

export default withTranslation()(StatusInfo_gg);