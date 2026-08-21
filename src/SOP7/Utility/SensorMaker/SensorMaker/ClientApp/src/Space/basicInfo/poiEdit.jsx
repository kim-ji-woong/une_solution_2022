import React, { Component } from 'react';
import $ from 'jquery';
import space from '../css/space.module.css';
import styles from '../css/spatial.module.css';

import { BuildingGroupNode } from './buildingGroupTreeView/buildingGroupNode';
import { ZoneNode } from './buildingGroupTreeView/zoneNode';
import { SpaceDataManager } from '../services/spaceDataManager';
import { CommonScrollbar } from '../../Root/commonScrollbar';
import rootStyles from '../../Root/css/root.module.css';
import { SensorNode } from './buildingGroupTreeView/sensorNode';
import { SensorListEdit } from './sensorListEdit';
import PopupMenu from './buildingGroupTreeView/popupMenu';

export class POIEdit extends Component {
    static Mode_All_POI = 0;
    static Mode_EquipZone_POI = 1;

    static Menu_Info = 0;
    static Menu_Add = 1;
    static Menu_Move = 2;
    static Menu_Delete = 3;

    constructor(props) {
        super(props);
        this.state = {
            poiMode: POIEdit.Mode_All_POI,
            controlMenu: POIEdit.Menu_Info,
            isEditMode: true,
            dashboard: false,
            popupMenu: false,
            popupMenuParameter: [null, null, null, null, null, null]
        }

        this.lastSelectedControl = SensorListEdit.LastSelectedControlType.treeView; // 마지막으로 선택한 컨트롤 treeview, gridview (drag&drop 기능 적용할 곳 구분)

        /*this.refLayer = React.createRef();
        this.refScrollArea = React.createRef();
        this.refScrollbar = React.createRef();
        this.refTree = React.createRef();*/
        this.refScrollArea = React.createRef();
        this.refBuildingGroupArea = React.createRef();
    }

    componentDidMount() {
        const _this = this;

        $('li:not(:has(ul))').css({ cursor: 'pointer', 'list-style-image': 'none' });
        $('li:has(ul)')
            /* .css({ cursor: 'pointer', 'list-style-image': "url(../../Space/image/treePlus-01.png)" }) */
            .children().hide();

        $('li:has(ul)').click(function (event) {
            const targetName = event.target.className;

            // 팝업메뉴 닫기
            if (targetName !== space.btn && targetName !== space.spn) {
                if (_this.state.popupMenuParameter[2]) {
                    _this.showPopupMenu(null, null, null, null, null, null);
                }
            }

            if (this == event.target) {
                if ($(this).children().is(':hidden')) {
                    $(this).css('list-style-image', 'url(minus.gif)').children().slideDown();
                }
                else {
                    $(this).css('list-style-image', 'url(plus.gif)').children().slideUp();
                }
            }
            return false;
        });

        this.checkPoiCommand();
    }

    componentDidUpdate() {
        this.checkPoiCommand();
    }

    checkPoiCommand() {
        const commands = [...this.props.poiEditCommand];
        const commandCount = commands.length;

        const buildingGroups = {};
        const buildings = {};
        const zones = {};
        const equipZones = {};
        const sensors = {};

        if (commandCount > 0) {
            for (let i = 0; i < commandCount; i++) {
                const command = commands[i];

                const buildingGroupName = command[0];
                const buildingID = command[1];
                const zoneID = command[2];
                const equipZoneID = command[3];
                const sensor = command[4];

                const liCount = this.refBuildingGroupArea.current.children.length;

                if (this.props.buildingGroupList) {
                    for (let j = 0; j < liCount; j++) {
                        const element = this.refBuildingGroupArea.current.children[j];
                        const buildingGroup = this.getBuildingGroup(POIEdit.getElementText(element), this.props.buildingGroupList);

                        if (!buildingGroup) {
                            continue;
                        }

                        if (buildingGroups[buildingGroup.groupName]) {
                            continue;
                        }

                        if (buildingGroup.groupName === buildingGroupName) {
                            if ($(element).children().is(':hidden')) {
                                $(element).css('list-style-image', 'url(minus.gif)').children().slideDown();
                            }

                            this.checkBuildings(element, buildings, zones, equipZones, sensors, buildingGroup, buildingID, zoneID, equipZoneID, sensor);
                        }
                        else {
                            $(element).css('list-style-image', 'url(plus.gif)').children().slideUp();
                        }

                        buildingGroups[buildingGroup.groupName] = buildingGroup;
                    }
                }
            }

            this.props.poiEditCommand.splice(0, commandCount);
        }
    }

    checkBuildings(buildingGroupElement, buildings, zones, equipZones, sensors, buildingGroup, buildingID, zoneID, equipZoneID, sensor) {
        const len1 = buildingGroupElement.children.length;
        const building = this.getBuilding(buildingID, buildingGroup);

        if (!building) {
            return;
        }

        if (buildings[building.id]) {
            return;
        }

        buildings[building.id] = building;

        for (let i = 0; i < len1; i++) {
            const element = buildingGroupElement.children[i];

            if (element.tagName === "UL") {
                const len2 = element.children.length;

                for (let j = 0; j < len2; j++) {
                    const buildingElement = element.children[j];

                    if (buildingElement.tagName !== "LI") {
                        continue;
                    }

                    if (POIEdit.getElementText(buildingElement) === building.buildingName) {
                        if ($(buildingElement).children().is(':hidden')) {
                            $(buildingElement).css('list-style-image', 'url(minus.gif)').children().slideDown();
                        }

                        this.checkZones(buildingElement, zones, equipZones, sensors, building, zoneID, equipZoneID, sensor);
                    }
                    else {
                        $(buildingElement).css('list-style-image', 'url(plus.gif)').children().slideUp();
                    }
                }

                break;
            }
        }
    }

    checkZones(buildingElement, zones, equipZones, sensors, building, zoneID, equipZoneID, sensor) {
        const len1 = buildingElement.children.length;
        const zone = this.getZone(zoneID, building);

        if (!zone) {
            return;
        }

        if (zones[zone.id]) {
            return;
        }

        zones[zone.id] = zone;

        for (let i = 0; i < len1; i++) {
            const element = buildingElement.children[i];

            if (element.tagName === "UL") {
                const len2 = element.children.length;

                for (let j = 0; j < len2; j++) {
                    const zoneElement = element.children[j];

                    if (zoneElement.tagName !== "LI") {
                        continue;
                    }

                    if (POIEdit.getElementText(zoneElement) === zone.zoneName) {
                        if ($(zoneElement).children().is(':hidden')) {
                            $(zoneElement).css('list-style-image', 'url(minus.gif)').children().slideDown();
                        }

                        this.checkEquipZones(zoneElement, equipZones, sensors, zone, equipZoneID, sensor);
                    }
                    else {
                        $(zoneElement).css('list-style-image', 'url(plus.gif)').children().slideUp();
                    }
                }

                break;
            }
        }
    }

    checkEquipZones(zoneElement, equipZones, sensors, zone, equipZoneID, sensor) {
        const len1 = zoneElement.children.length;
        const equipZone = this.getEquipmentZone(equipZoneID, zone);

        if (!equipZone) {
            return;
        }

        if (equipZones[equipZone.id]) {
            return;
        }

        equipZones[equipZone.id] = equipZone;

        for (let i = 0; i < len1; i++) {
            const element = zoneElement.children[i];

            if (element.tagName === "UL") {
                const len2 = element.children.length;

                for (let j = 0; j < len2; j++) {
                    const equipZoneElement = element.children[j];

                    if (equipZoneElement.tagName !== "LI") {
                        continue;
                    }

                    if (POIEdit.getElementText(equipZoneElement) === equipZone.zoneName) {
                        if ($(equipZoneElement).children().is(':hidden')) {
                            $(equipZoneElement).css('list-style-image', 'url(minus.gif)').children().slideDown();
                        }

                        this.checkSensors(equipZoneElement, sensors, sensor);
                    }
                    else {
                        $(equipZoneElement).css('list-style-image', 'url(plus.gif)').children().slideUp();
                    }
                }

                break;
            }
        }
    }

    checkSensors(equipZoneElement, sensors, sensor) {
        const len1 = equipZoneElement.children.length;
        
        if (!sensor) {
            return;
        }

        const key = sensor.sensorType + "_" + sensor.id;

        if (sensors[key]) {
            return;
        }

        sensors[key] = sensor;

        for (let i = 0; i < len1; i++) {
            const element = equipZoneElement.children[i];

            if (element.tagName === "UL") {
                const len2 = element.children.length;

                for (let j = 0; j < len2; j++) {
                    const sensorsElement = element.children[j];

                    if (sensorsElement.tagName !== "LI") {
                        continue;
                    }

                    const sensorType = sensorsElement.dataset?.sensortype;

                    if (sensorType === null || sensorType === undefined) {
                        continue;
                    }

                    if (sensorType === sensor.sensorType.toString()) {
                        if ($(sensorsElement).children().is(':hidden')) {
                            $(sensorsElement).css('list-style-image', 'url(minus.gif)').children().slideDown();
                        }

                        this.checkSensor(sensorsElement, sensor);
                    }
                    else {
                        $(sensorsElement).css('list-style-image', 'url(plus.gif)').children().slideUp();
                    }
                }

                break;
            }
        }
    }

    checkSensor(sensorsElement, sensor) {
        const len = sensorsElement.children.length;

        for (let i = 0; i < len; i++) {
            const element = sensorsElement.children[i];

            if (element.tagName === "UL") {
                const sensorID = element.dataset?.id;

                if (sensorID === null || sensorID === undefined) {
                    continue;
                }

                if (sensorID === sensor.id.toString()) {
                    element.classList.value = SensorNode.getSensorClassName(sensor, true);
                }
                /*else {
                    element.classList.value = SensorNode.getSensorClassName(sensor, false);
                }*/
            }
        }
    }

    static getElementText(element) {
        const text = element.innerText;
        const len = text.length;

        for (let i = 0; i < len; i++) {
            if (text.charCodeAt(i) < 20) {
                return text.substring(0, i).trim();
            }
        }

        return text;
    }

    getEquipmentZone(equipZoneID, zone) {
        if (equipZoneID === null || equipZoneID === undefined || equipZoneID < 0) {
            if (zone?.equipmentZoneDatas) {
                for (const equipZone of zone.equipmentZoneDatas) {
                    if (equipZone.id < 0) {
                        return equipZone;
                    }
                }
            }

            return null;
        }

        if (zone?.equipmentZoneDatas) {
            for (const equipZone of zone.equipmentZoneDatas) {
                if (equipZone.id === equipZoneID) {
                    return equipZone;
                }
            }
        }

        return null;
    }

    getZone(zoneID, building) {
        if (zoneID === null || zoneID === undefined) {
            return null;
        }

        if (building?.zoneDatas) {
            for (const zone of building.zoneDatas) {
                if (zone.id === zoneID) {
                    return zone;
                }
            }
        }

        return null;
    }

    getBuilding(buildingID, buildingGroup) {
        if (buildingID === null || buildingID === undefined) {
            return null;
        }

        if (buildingGroup?.buildingDatas) {
            for (const buildingData of buildingGroup.buildingDatas) {
                if (buildingData.id === buildingID) {
                    return buildingData;
                }
            }
        }

        return null;
    }

    getBuildingGroup(buildingGroupName, buildingGroups) {
        if (buildingGroups) {
            for (const buildingGroup of buildingGroups) {
                if (buildingGroup.visible && buildingGroup.groupName === buildingGroupName) {
                    return buildingGroup;
                }
            }
        }

        return null;
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

        CommonScrollbar.setContentStyle(this.refScrollbar.current, treeArea.width, treeArea.height, scrollVisible);

        const treeArea2 = this.refScrollArea.current.getBoundingClientRect();

        if (this.props.selectedInfo && this.props.selectedInfo.buildingGroup) {

        }
    }

    onChangeSensor = (sensors) => {
        this.props.onChangeSensorList(sensors[0].sensorTypeName, sensors);
    }

    getBuildingGroupTreeViewUI() {
        let ui = [];
        const buildingGroupList = this.props.buildingGroupList;
        const buildingGroupCount = buildingGroupList.length;
        for (let i = 0; i < buildingGroupCount; i++) {
            const buildingGroup = buildingGroupList[i];
            if (buildingGroup.visible) {
                ui.push(
                    <BuildingGroupNode
                        selectedMenu={this.props.selectedMenu}
                        key={'node_buildingGroup_' + buildingGroup.id}
                        buildingGroup={buildingGroup} sensorList={this.props.sensorList}
                        selectedNodes={this.props.selectedNodes}
                        addSelectedNodes={this.props.addSelectedNodes}
                        removeSelectedNodes={this.props.removeSelectedNodes}
                        isEditMode={this.state.isEditMode}
                        dashboard={this.state.dashboard}
                        parentFrm={this}
                        onChangeSensor={this.onChangeSensor}
                        onChangeSensorList={this.props.onChangeSensorList}
                        clearSensorPosition={this.clearSensorPosition}
                        showPopupMenu={this.showPopupMenu}
                        moveToX={this.props.moveToX}
                        selectedItem={this.state.popupMenuParameter[5]}
                    />
                );
            }
        }

        return ui;
    }

    getCurrentZone() {
        const currentView = this.props.currentView;

        if (currentView) {
            if (currentView.zoneID !== null && currentView.zoneID !== undefined) {
                const zoneData = SpaceDataManager.findZone(currentView.zoneID, this.props._3dOptions);

                if (zoneData) {
                    return [zoneData, currentView.zoneID];
                }
            }
        }

        return [null, null];
    }

    getCurrentZoneName(zoneData) {
        if (zoneData && zoneData.length >= 3) {
            return zoneData[2];
        }

        return "외부영역";
    }

    getZoneData(zoneID, buildingID) {
        const buildingData = this.props._3dOptions.buildingIDs[buildingID];

        if (buildingData && buildingData.length >= 2) {
            const buildingGroupName = buildingData[1];
            const buildingGroupList = this.props.buildingGroupList;

            if (buildingGroupList) {
                for (const buildingGroup of buildingGroupList) {
                    if (buildingGroup.visible && buildingGroup.groupName === buildingGroupName) {
                        for (const building of buildingGroup.buildingDatas) {
                            if (building.id === buildingID) {
                                for (const zoneData of building.zoneDatas) {
                                    if (zoneData.id === zoneID) {
                                        return zoneData;
                                    }
                                }

                                break;
                            }
                        }

                        break;
                    }
                }
            }
        }

        return null;
    }

    getZoneUI(zone, zoneID) {
        if (!zone) {
            return <></>;
        }

        const zoneData = zone.length >= 2 ? this.getZoneData(zoneID, zone[1]) : null;

        if (zoneData === null) {
            return <></>;
        }

        return (
            <ZoneNode
                key={'node_zone_' + zoneID}
                zone={zoneData}
                sensorList={zone.sensors}
                curSensorType={this.props.curSensorType}
                selectedNodes={this.props.selectedNodes}
                addSelectedNodes={this.props.addSelectedNodes}
                removeSelectedNodes={this.props.removeSelectedNodes}
                isEditMode={this.state.isEditMode}
                dashboard={this.state.dashboard}
                selectedMenu={this.props.selectedMenu}
                sensorDisplayMode={true}
                showEquipZone={this.state.poiMode === POIEdit.Mode_EquipZone_POI}
                clearSensorPosition={this.clearSensorPosition}
            />);
    }

    onClickMode(mode) {
        if (this.state.poiMode !== mode) {
            this.setState({ poiMode: mode });
        }
    }

    onClickMenu(menu) {
        if (this.state.controlMenu !== menu) {
            this.props.poiManager.selectPOI(null, true, null);
            this.props.poiManager.hideTempPOI();
            this.props.poiManager.CurrentMode = menu;
            this.setState({ controlMenu: menu });
        }
    }

    clearSensorPosition = (sensor) => {
        sensor.x = null;
        sensor.y = null;
        sensor.z = null;

        this.props.poiManager.removePOI(sensor.sensorTypeName, sensor.zoneID, sensor.id);
    }

    refresh() {
        this.setState({ poiMode: this.state.poiMode });
    }

    showPopupMenu = (x, y, btnText, method, parameter, obj) => {
        if (btnText && btnText.length > 0) {
            this.setState({ popupMenu: true, popupMenuParameter: [x, y, btnText, method, parameter, obj] });
        }
        else {
            this.setState({ popupMenu: false, popupMenuParameter: [null, null, null, null, null, obj] });
        }
    }

    render() {
        const [currentZone, zoneID] = this.getCurrentZone();
        const buildingGroupTreeViewUI = this.getBuildingGroupTreeViewUI();
        const poiMode = this.state.poiMode;
        const ctrlMenu = this.state.controlMenu;
        const scrollAreaStyle = this.props.modeling ? styles.dsiScr + " " + styles.short + " " + rootStyles.scrollbar : styles.dsiScr + " " + rootStyles.scrollbar;
        const scrollAreaStyles = this.props.modeling ? styles.dsiScrr + " " + styles.short + " " + rootStyles.scrollbar : styles.dsiScrr + " " + rootStyles.scrollbar;
        const scrollAreaStyless = this.props.modeling ? styles.dsiScrr + " " + styles.short + " " + rootStyles.scrollbar : styles.dsiScrrr + " " + rootStyles.scrollbar; 
        this.props.poiManager.PoiEdit = this;

        if (this.props.poiManager) {
            this.props.poiManager.CurrentMode = this.state.controlMenu;
        }

        return (
            <div className={space.poiListArea}>
                <div className={space.poiListBox}>
                    <div className={space.poiListTitleBox}>
                        <span className={space.poiListTitleText}>POI 편집</span>
                        <ul className={space.poiRadioBox3}>
                            <li onClick={() => this.onClickMenu(POIEdit.Menu_Info)}><input type="radio" id="iconInfo" className={space.poiRadioCtrl} onChange={() => this.onClickMenu(POIEdit.Menu_Info)} checked={ctrlMenu === POIEdit.Menu_Info} /> <label htmlFor="iconInfo" className={space.poiRadioText}>정보확인</label></li>
                            <li onClick={() => this.onClickMenu(POIEdit.Menu_Add)}><input type="radio" id="iconAdd" className={space.poiRadioCtrl} onChange={() => this.onClickMenu(POIEdit.Menu_Add)} checked={ctrlMenu === POIEdit.Menu_Add} /> <label htmlFor="iconAdd" className={space.poiRadioText}>추가</label></li>
                            <li onClick={() => this.onClickMenu(POIEdit.Menu_Move)}><input type="radio" id="iconMove" className={space.poiRadioCtrl} onChange={() => this.onClickMenu(POIEdit.Menu_Move)} checked={ctrlMenu === POIEdit.Menu_Move} /> <label htmlFor="iconMove" className={space.poiRadioText}>이동</label></li>
                            <li onClick={() => this.onClickMenu(POIEdit.Menu_Delete)}><input type="radio" id="iconDelete" className={space.poiRadioCtrl} onChange={() => this.onClickMenu(POIEdit.Menu_Delete)} checked={ctrlMenu === POIEdit.Menu_Delete} /> <label htmlFor="iconDelete" className={space.poiRadioText}>삭제</label></li>
                        </ul>
                        <div className={space.poiSelectBox}>
                            <span className={space.poiListSelect}></span>
                        </div>
                        <div className={space.poiListContent} className={scrollAreaStyles}>
                        {/* <div className={space.poiListContent}> */}
                            <ul ref={this.refBuildingGroupArea}/* className={space.poiListContentUl} */>
                                {buildingGroupTreeViewUI}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={space.poiSpaceListBox}>
                    <div className={space.poiListTitleBox}>
                        <span className={space.poiListTitleText}>{this.getCurrentZoneName(currentZone)}</span>
                        <ul className={space.poiRadioBox}>
                            <li><input type="radio" id="checkIcon" className={space.poiRadioCtrl} onChange={() => this.onClickMode(POIEdit.Mode_All_POI)} checked={poiMode === POIEdit.Mode_All_POI} /> <label htmlFor="checkIcon" className={space.poiRadioText}>전체보기</label></li>
                            <li><input type="radio" id="moveIcon" className={space.poiRadioCtrl} onChange={() => this.onClickMode(POIEdit.Mode_EquipZone_POI)} checked={poiMode === POIEdit.Mode_EquipZone_POI} /> <label htmlFor="moveIcon" className={space.poiRadioText}>구역별 보기</label></li>
                        </ul>
                        <div className={space.poiListContent2} className={scrollAreaStyless}>
                        {/* <div className={space.poiListContent}> */}
                            {/*  <span className={space.poiListScrollbar}> */}
                                <ul /* className={space.poiListContentUl} */ >
                                    {this.getZoneUI(currentZone, zoneID)}
                                </ul>
                            {/* </span> */}
                        </div>
                    </div>
                </div>
                {
                    this.state.popupMenu &&
                    <PopupMenu
                        x={this.state.popupMenuParameter[0]}
                        y={this.state.popupMenuParameter[1]}
                        text={this.state.popupMenuParameter[2]}
                        method={this.state.popupMenuParameter[3]}
                        parameter={this.state.popupMenuParameter[4]}
                        showPopupMenu={this.showPopupMenu}
                    />
                }
            </div>
        );
    }
}