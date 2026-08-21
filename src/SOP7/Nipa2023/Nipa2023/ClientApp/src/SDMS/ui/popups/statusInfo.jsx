import React, { Component } from 'react';
import $ from 'jquery';
import Monitoring from '../monitoring';
import StatusInfoBuildingGroup from './statusInfoBuildingGroup';

import PopupDraggable from './popupDraggable';
import { StatusInfoComponent } from '../../styled/sdmsPopupsStyled';

import SDMSMainMenu from '../sdmsMainMenu';
import SDMSResource from '../../resource/id';
    
class StatusInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: ''
        }

        this.props = props;

        this.initPopupState = this.initPopupState.bind(this);

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

        $('.scrollbar').scrollTop(0);
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.isPopupStateReset !== this.props.isPopupStateReset) {
            this.repositionPopup();
        }

        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
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

    initPopupState() {
        var popup = document.getElementsByClassName('UI_Section statusInfo')[0];

        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        } else {
            // DB에 값이 따로 없을 경우
            let data = SDMSResource.popupResetLocation[this.props.popupType];

            popup.style.left = data.x;
            popup.style.top = data.y;
            popup.style.width = data.width;
            popup.style.height = data.height;
        }

        this.setState({ popup: popup });
    }

    repositionPopup() {

        let popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return;

        let data = SDMSResource.popupResetLocation[this.props.popupType];

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
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

    searchEnterKey = () => {
        if (window.event && window.event.keyCode === 13) {    
            this.search();
        }
    }

    search = () => {
        const text = document.getElementById('txtSearch').value;

        this.setState({ searchText: text });
    }

    onClickShowHide = (type, id) => {
        const element = document.getElementById(type + '_' + id);

        if (!element) 
            return;

        element.classList.toggle('on');
        element.previousSibling.classList.toggle('on');
    }

    getBuildingGroupUI() {
        let ui = [];
        let buildingGroupList = this.props.buildingGroupList;
        
        if (buildingGroupList === undefined || buildingGroupList === null || buildingGroupList.length === 0)
            return ui;
            
        if (this.state.searchText.length > 0) {
            this.setVisibleBuildingGroupList(buildingGroupList);
        }

        for (let i = 0; i < buildingGroupList?.length; i++) {
            const buildingGroup = buildingGroupList[i];

            if (buildingGroup.visible === false && this.state.searchText.length > 0)
                continue;

            ui.push(<StatusInfoBuildingGroup
                id={'buildingGroup_' + buildingGroup.id}
                key={buildingGroup.id}
                buildingGroup={buildingGroup}
                sensorList={this.props.sensorList}
                setCurrentView={this.props.setCurrentView}
                searchText={this.state.searchText}
                selectedSensor={this.props.selectedSensor}
                selectSensor={this.props.selectSensor}
                setVisiblePopups={this.props.setVisiblePopups}
                selectedStatusInfo={this.props.selectedStatusInfo}
                selectBuilding={this.props.selectBuilding}
                selectZone={this.props.selectZone}
            />);
        }

        if (this.props.outdoorZones) {
            // 외부영역도 검색 필터기능 추가 - K.D.R
            if (this.setVisibleOutdoor(this.props.outdoorZones)) {
                ui.push(
                    <StatusInfoBuildingGroup
                        key={'building_outdoor'}
                        id={'building_outdoor'}
                        buildingGroup={this.props.outdoorZones}
                        sensorList={this.props.sensorList}
                        setCurrentView={this.props.setCurrentView}
                        moveToOutdoor={this.props.moveToOutdoor}
                        selectedSensor={this.props.selectedSensor}
                        selectSensor={this.props.selectSensor}
                        selectedStatusInfo={this.props.selectedStatusInfo}
                        selectBuilding={this.props.selectBuilding}
                        selectZone={this.props.selectZone}
                    />
                );
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

        if (SDMSResource.ID.buildingInfo.outdoor.toLocaleLowerCase().replace(" ","").includes(this.state.searchText)) {
            outdoorVisible = true;
        }

        for (const zoneID in outdoorZones) {
            const zone = outdoorZones[zoneID];
            const zoneID_Num = zone.id;

            if (zone.displayText.includes(this.state.searchText)) {
                zone.visible = true;
            }
            else {
                let visibleCount = 0;

                if (zone.sensors?.atmosphereSensors) {
                    if (this.setVisibleSensors(zoneID_Num, zone.sensors.atmosphereSensors)) {
                        visibleCount++;
                    }
                }

                if (zone.sensors?.thermalCCTVs) {
                    if (this.setVisibleSensors(zoneID_Num, zone.sensors.thermalCCTVs)) {
                        visibleCount++;
                    }
                }

                if (zone.sensors?.emergencyBells) {
                    if (this.setVisibleSensors(zoneID_Num, zone.sensors.emergencyBells)) {
                        visibleCount++;
                    }
                }

                if (zone.sensors?.gasSensors) {
                    if (this.setVisibleSensors(zoneID_Num, zone.sensors.gasSensors)) {
                        visibleCount++;
                    }
                }

                if (zone.sensors?.thermalCCTVs) {
                    if (this.setVisibleSensors(zoneID_Num, zone.sensors.thermalCCTVs)) {
                        visibleCount++;
                    }
                }

                if (zone.sensors?.aps) {
                    if (this.setVisibleSensors(zoneID_Num, zone.sensors.aps)) {
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

            if (this.setVisibleSensors(zone.id, this.props.sensorList.atmosphereSensors)) {
                visibleCount++;
            }
            if (this.setVisibleSensors(zone.id, this.props.sensorList.cctvs)) {
                visibleCount++;
            }
            if (this.setVisibleSensors(zone.id, this.props.sensorList.emergencyBells)) {
                visibleCount++;
            }
            if (this.setVisibleSensors(zone.id, this.props.sensorList.gasSensors)) {
                visibleCount++;
            }
            if (this.setVisibleSensors(zone.id, this.props.sensorList.thermalCCTVs)) {
                visibleCount++;
            }
            if (this.setVisibleSensors(zone.id, this.props.sensorList.aps)) {
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
        const sensorsCount = sensors?.length;
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

    render() {
        const getBuildingGroupUI = this.getBuildingGroupUI();

        let visibleStinkPOI = this.props.visibleSensorTypes[SDMSMainMenu.Stink_Sensor] ? true : false;  
        let visibleGasPOI = this.props.visibleSensorTypes[SDMSMainMenu.Gas_Sensor] ? true : false;  
        let visibleEmergencyBellPOI = this.props.visibleSensorTypes[SDMSMainMenu.EmergencyBell_Sensor] ? true : false;  
        let visibleThermalImagingCameraPOI = this.props.visibleSensorTypes[SDMSMainMenu.ThermalImagingCamera_Sensor] ? true : false;  
        let visibleCCTVPOI = this.props.visibleSensorTypes[SDMSMainMenu.CCTV_Sensor] ? true : false;  
        let visibleZoneNamePOI = this.props.visibleSensorTypes[SDMSMainMenu.ZoneName_Sensor] ? true : false;  
        let visibleWorkerPOI = this.props.visibleSensorTypes[SDMSMainMenu.Worker_Sensor] ? true : false;  

        let visibleStinkClassName = (visibleStinkPOI) ? 'visibleStink' : 'disableStink';
        let visibleGasClassName = (visibleGasPOI) ? 'visibleGas' : 'disableGas';
        let visibleEmergencyBellClassName = (visibleEmergencyBellPOI) ? 'visibleEmergencyBell' : 'disableEmergencyBell';
        let visibleThermalImagingCameraClassName = (visibleThermalImagingCameraPOI) ? 'visibleThermalImagingCamera' : 'disableThermalImagingCamera';
        let visibleCCTVClassName = (visibleCCTVPOI) ? 'visibleCCTV' : 'disableCCTV';
        let visibleZoneNameClassName = (visibleZoneNamePOI) ? 'visibleZoneName' : 'disableZoneName';
        let visibleWorkerClassName = (visibleWorkerPOI) ? 'visibleWorker' : 'disableWorker';

        return (
            <StatusInfoComponent id={this.props.popupType} className='UI_Section statusInfo'>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={304}
                    popupMinHeight={600}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >
                    <div className={'dslTop'}>
                        <h5 className={'dslTitle'} >
                            현황정보
                        </h5>
                        <div className={'dslX'} onClick={() => this.props.setVisiblePopups(Monitoring.menu.statusInfo, false)}>
                            <a href="#none">닫기버튼</a>
                        </div>
                    </div>

                    <div className={'dslCont'}>
                        <div className={'dsiSel'}>
                            <div onClick={this.onClickLayer}>
                                <ul ref={this.refLayer}>
                                    <li><label className={visibleGasClassName} data-title="가스" ><input type="checkbox" checked={visibleGasPOI} onChange={() => this.onChangeVisible(SDMSMainMenu.Gas_Sensor)} /></label></li>
                                    <li><label className={visibleStinkClassName} data-title="대기오염" ><input type="checkbox" checked={visibleStinkPOI} onChange={() => this.onChangeVisible(SDMSMainMenu.Stink_Sensor)} /></label></li>
                                    <li><label className={visibleEmergencyBellClassName} data-title="비상벨" ><input type="checkbox" checked={visibleEmergencyBellPOI} onChange={() => this.onChangeVisible(SDMSMainMenu.EmergencyBell_Sensor)} /></label></li>
                                    <li><label className={visibleThermalImagingCameraClassName} data-title="열화상카메라" ><input type="checkbox" checked={visibleThermalImagingCameraPOI} onChange={() => this.onChangeVisible(SDMSMainMenu.ThermalImagingCamera_Sensor)} /></label></li>
                                    <li><label className={visibleWorkerClassName} data-title="작업자" ><input type="checkbox" checked={visibleWorkerPOI} onChange={() => this.onChangeVisible(SDMSMainMenu.Worker_Sensor)} /></label></li>
                                    <li><label className={visibleCCTVClassName} data-title="CCTV" ><input type="checkbox" checked={visibleCCTVPOI} onChange={() => this.onChangeVisible(SDMSMainMenu.CCTV_Sensor)} /></label></li>
                                    <li><label className={visibleZoneNameClassName} data-title="구역명" ><input type="checkbox" checked={visibleZoneNamePOI} onChange={() => this.onChangeVisible(SDMSMainMenu.ZoneName_Sensor)} /></label></li>
                                </ul> 
                            </div>
                        </div>

                        <div className={'dsiSch'}>
                            <input type="text" id="txtSearch" onKeyUp={this.searchEnterKey} placeholder='검색어를 입력해주세요.'/>
                            <a onClick={this.search}>검색</a>
                        </div>

                        <div ref={this.refScrollArea} className={'dsiScr'}>
                            <ul ref={this.refTree} className={'dsiTree scrollbar'}>
                                {getBuildingGroupUI}
                            </ul>
                        </div>
                    </div>
                </PopupDraggable>
            </StatusInfoComponent>
        );
    }
}

export default StatusInfo;