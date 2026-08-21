import React, { Component } from 'react';
import space from './../../css/space.module.css';
import styles from '../../css/spatial.module.css';

import $ from 'jquery';
import { SensorNode } from './sensorNode';
import SensorMakerResource from '../../../resource/id';
import { SpaceDataManager } from '../../services/spaceDataManager';
import { DeliveryManager } from '../worker/deliveryManager';
import { SensorListEdit } from '../sensorListEdit';
import { SpaceBody } from '../../spaceBody';
import { SpaceMenus } from '../../spaceMenus';

export class EquipZoneNode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSelectedNode: false
        }

        this.deliveryManager = new DeliveryManager(this);
        this.refNode = React.createRef();
    }

    componentDidMount() {
        this.deliveryManager.initDragEvents(this.refNode.current);

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.deliveryManager.initDragDrop === false) {
            this.deliveryManager.initDragEvents(this.refNode.current);
        }
    }

    componentWillUnmount() {        
        this.deliveryManager.resetDragEvents(this.refNode.current);
    }

    onChangeSensorZone = (chgSensors) => {
        if (!chgSensors || chgSensors.length === 0) {
            return;
        }

        if (this.props.isEditMode) {
            const chgSensorCount = chgSensors.length;
            const allSensors = this.props.sensorList[chgSensors[0].sensorTypeName];
            //const allSensorCount = allSensors.length;

            for (let i = 0; i < chgSensorCount; i++) {
                // chgSensors와 allSensors는 같은 객체를 공유하기 때문에 굳이 allSensors를 다시 검색할 필요가 없다.
                //for (let j = 0; j < allSensorCount; j++) {
                    
                    //if (chgSensors[i].id === allSensors[j].id) {
                if (this.props.selectedMenu === SpaceMenus.EditSensorList || this.props.selectedMenu === SpaceMenus.EditPois) {
                    // zone이 바뀌면 위치를 null로 만들고 poi를 없앤다.
                    if (chgSensors[i].zoneID !== this.props.zone.id) {
                        this.props.clearSensorPosition(chgSensors[i]);
                        chgSensors[i].zoneID = this.props.zone.id;
                    }

                    // EquipZone 변경
                    chgSensors[i].buildingID = this.props.zone.buildingID;
                    chgSensors[i].equipZoneID = this.props.equipZone.id;
                }
                else if (this.props.selectedMenu === SpaceMenus.EditEquipZoneCCTVs) {
                    // EquipZone에 추가
                    if (!chgSensors[i].equipZoneIDs) {
                        chgSensors[i].equipZoneIDs = [];
                    }

                    if (chgSensors[i].equipZoneIDs.indexOf(this.props.equipZone.id) === -1) {
                        chgSensors[i].equipZoneIDs.push(this.props.equipZone.id);
                    }
                }

                    //    break;
                    //}
                //}
            }
            this.props.onChangeSensor(allSensors);
        }

        // 여러 종류의 타입
        //if (this.props.isEditMode) {
        //    const chgSensorCount = chgSensors.length;

        //    for (let i = 0; i < chgSensorCount; i++) {
        //        const chgSensor = chgSensors[i];

        //        const allSensors = this.props.sensorList[chgSensor.sensorTypeName];
        //        const allSensorCount = allSensors.length;

        //        for (let j = 0; j < allSensorCount; j++) {
        //            if (chgSensor.id === allSensors[j].id) {
        //                if (this.props.selectedMenu === SpaceMenus.EditEquipZoneCCTVs) {
        //                    // EquipZone에 추가
        //                    if (!allSensors[j].equipZoneIDs) {
        //                        allSensors[j].equipZoneIDs = [];
        //                    }

        //                    if (allSensors[j].equipZoneIDs.indexOf(this.props.equipZone.id) === -1) {
        //                        allSensors[j].equipZoneIDs.push(this.props.equipZone.id);
        //                    }
        //                }
        //                else {
        //                    // EquipZone 변경
        //                    allSensors[j].buildingID = this.props.zone.buildingID;
        //                    allSensors[j].zoneID = this.props.zone.id;
        //                    allSensors[j].equipZoneID = this.props.equipZone.id;
        //                }

        //                break;
        //            }
        //        }
        //    }
        //    this.props.onChangeSensor(allSensors);
        //}
    }

    onNodeClick = (sensor, index) => {        
        const selectedSensors = [...this.props.selectedNodes];
        if (selectedSensors.length === 1 && selectedSensors[0] === sensor) {
            // 같은 Node click
            return;
        }

        let selectedSensorType = SpaceDataManager.FireSensorType;
        if (SensorMakerResource.isPSMSensorType(sensor.sensorType)) {
            selectedSensorType = SpaceDataManager.PSMSensorType;
        }
        else if (SensorMakerResource.isETCSensorType(sensor.sensorType)) {
            selectedSensorType = SpaceDataManager.EtcSensorType;
        }
        else if (SensorMakerResource.isSVMSSensorType(sensor.sensorType)) {
            selectedSensorType = SpaceDataManager.CCTVType;
        }

        if (SpaceBody.keyPress === SpaceBody.keyPressShift) {
            // 구벽열 cctv 편집 메뉴에서는 CCTV가 실제 존재하는 EquipZone이 아닌 포함되어 있는 EquipZoneIDs의 내용과 비교한다
            if (this.props.selectedMenu === SpaceMenus.EditEquipZoneCCTVs) {
                if (sensor.equipZoneIDs.indexOf(this.props.parentFrm.nLastSelectedNodeEquipZoneID) >= 0) {
                    let sameEquipZoneSensors = [];
                    const allSensors = this.props.sensorList[selectedSensorType];
                    const allSensorCount = allSensors.length;
                    for (let i = 0; i < allSensorCount; i++) {
                        const allSensor = allSensors[i];
                        if (allSensor.equipZoneIDs.indexOf(this.props.parentFrm.nLastSelectedNodeEquipZoneID) >= 0) {
                            sameEquipZoneSensors.push(allSensor);
                        }
                    }

                    let beginIndex = this.props.parentFrm.nIndexLastSelectedNode < index ? this.props.parentFrm.nIndexLastSelectedNode : index;
                    let endIndex = this.props.parentFrm.nIndexLastSelectedNode > index ? this.props.parentFrm.nIndexLastSelectedNode : index;

                    for (let i = beginIndex; i <= endIndex; i++) {
                        const sensor2 = sameEquipZoneSensors[i];
                        selectedSensors.push(sensor2);
                    }
                }
                else {
                    selectedSensors.length = 0;
                    selectedSensors.push(sensor);
                }
            }
            else {
                // 같은 구역의 센서인가?
                if (this.props.parentFrm.nLastSelectedNodeEquipZoneID === sensor.equipZoneID) {

                    // 같은 타입의 센서인가?
                    if (selectedSensors[0].sensorTypeName !== sensor.sensorTypeName) {
                        selectedSensors.length = 0;
                        selectedSensors.push(sensor);
                    }
                    else {
                        let sameEquipZoneSensors = [];
                        const allSensors = this.props.sensorList[selectedSensorType];
                        const allSensorCount = allSensors.length;
                        for (let i = 0; i < allSensorCount; i++) {
                            const allSensor = allSensors[i];
                            if (allSensor.equipZoneID === sensor.equipZoneID) {
                                sameEquipZoneSensors.push(allSensor);
                            }
                        }

                        let beginIndex = this.props.parentFrm.nIndexLastSelectedNode < index ? this.props.parentFrm.nIndexLastSelectedNode : index;
                        let endIndex = this.props.parentFrm.nIndexLastSelectedNode > index ? this.props.parentFrm.nIndexLastSelectedNode : index;

                        for (let i = beginIndex; i <= endIndex; i++) {
                            const sensor2 = sameEquipZoneSensors[i];
                            if (selectedSensors.includes(sensor2)) {
                                continue;
                            }

                            selectedSensors.push(sensor2);
                        }
                    }
                }
                else {
                    selectedSensors.length = 0;
                    selectedSensors.push(sensor);
                }
            }
        }
        else if (SpaceBody.keyPress === SpaceBody.keyPressControl) {
            let alreadySelected = false;
            const selectedSensorCount = selectedSensors.length;
            for (let i = 0; i < selectedSensorCount; i++) {
                const selectedSensor = selectedSensors[i];
                if (selectedSensor === sensor) {
                    selectedSensors.splice(i, 1);
                    alreadySelected = true;
                    break;
                }
            }

            if (!alreadySelected) {
                selectedSensors.push(sensor);
            }
        }
        else {
            selectedSensors.length = 0;
            selectedSensors.push(sensor);
        }

        if (this.props.parentFrm) {
            this.props.parentFrm.nLastSelectedNodeEquipZoneID = this.props.equipZone.id;//sensor.equipZoneID;
            this.props.parentFrm.nIndexLastSelectedNode = index;
        }

        this.props.addSelectedNodes(selectedSensors);
    }

    getUI() {
        let fireSensorUI = [];
        let psmSensorUI = [];
        let etcSensorUI = [];
        let cctvUI = [];
        let fireSensorType = "none";
        let psmSensorType = "none";
        let etcSensorType = "none";
        let cctvType = "none";

        const searchText = this.props.searchText ? this.props.searchText : "";

        if (this.props.selectedMenu === SpaceMenus.EditSensorList || this.props.selectedMenu === SpaceMenus.EditPois) {
            if (this.props.sensorList[SpaceDataManager.FireSensorType]) {
                const fireSensors = this.props.sensorList[SpaceDataManager.FireSensorType];

                let rowIndex = -1;

                const fireSensorCount = fireSensors.length;
                for (let i = 0; i < fireSensorCount; i++) {
                    const fireSensor = fireSensors[i];
                    if (fireSensor.equipZoneID === this.props.equipZone.id ||
                        (fireSensor.equipZoneID === null && this.props.equipZone.id < 0 && this.props.equipZone.linkedZoneIDs.includes(fireSensor.zoneID))) {
                        if (/*fireSensor.visibleTreeView === false && */searchText.length > 0) {
                            if (fireSensor.name.includes(searchText) === false)
                                continue;
                        }

                        fireSensorType = fireSensor.sensorType;

                        const tempIndex = ++rowIndex;
                        fireSensorUI.push(
                            <SensorNode
                                key={'sle_fire_' + fireSensor.id}
                                facilityType={SensorMakerResource.facilityType.FIRE}
                                sensor={fireSensor}
                                selectedNodes={this.props.selectedNodes}
                                addSelectedNodes={this.props.addSelectedNodes}
                                removeSelectedNodes={this.props.removeSelectedNodes}
                                onNodeClick={this.onNodeClick}
                                index={tempIndex}
                                isEditMode={this.props.isEditMode}
                                selectedItem={this.props.selectedItem}
                                showPopupMenu={this.props.showPopupMenu}
                            />);
                    }
                }
            }

            if (this.props.sensorList[SpaceDataManager.PSMSensorType]) {
                const psmSensors = this.props.sensorList[SpaceDataManager.PSMSensorType];

                let rowIndex = -1;

                const psmSensorCount = psmSensors.length;
                for (let i = 0; i < psmSensorCount; i++) {
                    const psmSensor = psmSensors[i];
                    if (psmSensor.equipZoneID === this.props.equipZone.id ||
                        (psmSensor.equipZoneID === null && this.props.equipZone.id < 0 && this.props.equipZone.linkedZoneIDs.includes(psmSensor.zoneID))) {
                        if (/*psmSensor.visibleTreeView === false && */searchText.length > 0) {
                            if (psmSensor.name.includes(searchText) === false)
                                continue;
                        }

                        psmSensorType = psmSensor.sensorType;

                        const tempIndex = ++rowIndex;
                        psmSensorUI.push(
                            <SensorNode
                                key={'sle_psm_' + psmSensor.id}
                                facilityType={SensorMakerResource.facilityType.PSM_SENSOR}
                                sensor={psmSensor}
                                selectedNodes={this.props.selectedNodes}
                                addSelectedNodes={this.props.addSelectedNodes}
                                removeSelectedNodes={this.props.removeSelectedNodes}
                                onNodeClick={this.onNodeClick}
                                index={tempIndex}
                                isEditMode={this.props.isEditMode}
                                selectedItem={this.props.selectedItem}
                                showPopupMenu={this.props.showPopupMenu}
                            />);
                    }
                }
            }

            if (this.props.sensorList[SpaceDataManager.EtcSensorType]) {
                const etcSensors = this.props.sensorList[SpaceDataManager.EtcSensorType];

                let rowIndex = -1;

                const etcSensorCount = etcSensors.length;
                for (let i = 0; i < etcSensorCount; i++) {
                    const etcSensor = etcSensors[i];
                    if (etcSensor.visibleTreeView === false && searchText.length > 0) {
                        continue;
                    }
                    if (etcSensor.equipZoneID === this.props.equipZone.id ||
                        (etcSensor.equipZoneID === null && this.props.equipZone.id < 0 && this.props.equipZone.linkedZoneIDs.includes(etcSensor.zoneID))) {
                        if (searchText.length > 0) {
                            if (etcSensor.name.includes(searchText) === false)
                                continue;
                        }

                        etcSensorType = etcSensor.sensorType;

                        const tempIndex = ++rowIndex;
                        etcSensorUI.push(
                            <SensorNode
                                key={'sle_etc_' + etcSensor.id}
                                facilityType={SensorMakerResource.facilityType.ETC}
                                sensor={etcSensor}
                                selectedNodes={this.props.selectedNodes}
                                addSelectedNodes={this.props.addSelectedNodes}
                                removeSelectedNodes={this.props.removeSelectedNodes}
                                onNodeClick={this.onNodeClick}
                                index={tempIndex}
                                isEditMode={this.props.isEditMode}
                                selectedItem={this.props.selectedItem}
                                showPopupMenu={this.props.showPopupMenu}
                            />);
                    }
                }
            }

            if (this.props.sensorList[SpaceDataManager.CCTVType]) {
                const cctvs = this.props.sensorList[SpaceDataManager.CCTVType];

                let rowIndex = -1;

                const cctvCount = cctvs.length;
                for (let i = 0; i < cctvCount; i++) {
                    const cctv = cctvs[i];
                    if (cctv.visibleTreeView === false && searchText.length > 0) {
                        continue;
                    }

                    if (cctv.equipZoneID === this.props.equipZone.id ||
                        (cctv.equipZoneID === null && this.props.equipZone.id < 0 && this.props.equipZone.linkedZoneIDs.includes(cctv.zoneID))) {
                        if (searchText.length > 0) {
                            if (cctv.name.includes(searchText) === false)
                                continue;
                        }

                        cctvType = cctv.sensorType;

                        const tempIndex = ++rowIndex;
                        cctvUI.push(
                            <SensorNode
                                key={'sle_cctv_' + cctv.id}
                                facilityType={SensorMakerResource.facilityType.Security_Sensor}
                                sensor={cctv}
                                selectedNodes={this.props.selectedNodes}
                                addSelectedNodes={this.props.addSelectedNodes}
                                removeSelectedNodes={this.props.removeSelectedNodes}
                                onNodeClick={this.onNodeClick}
                                index={tempIndex}
                                isEditMode={this.props.isEditMode}                                
                                selectedItem={this.props.selectedItem}
                                showPopupMenu={this.props.showPopupMenu}
                            />);
                    }
                }
            }
        }
        else if (this.props.selectedMenu === SpaceMenus.EditEquipZoneCCTVs) {
            if (this.props.sensorList[SpaceDataManager.CCTVType]) {
                const cctvs = this.props.sensorList[SpaceDataManager.CCTVType];

                let rowIndex = -1;

                const cctvCount = cctvs.length;
                for (let i = 0; i < cctvCount; i++) {
                    const cctv = cctvs[i];                    
                    if (cctv.equipZoneIDs.indexOf(this.props.equipZone.id) >= 0) {
                        const tempIndex = ++rowIndex;
                        cctvUI.push(
                            <SensorNode
                                key={'sle_ez_' + this.props.equipZone.id + '_cctv_' + cctv.id}
                                facilityType={SensorMakerResource.facilityType.Security_Sensor}
                                sensor={cctv}
                                selectedNodes={this.props.selectedNodes}
                                addSelectedNodes={this.props.addSelectedNodes}
                                removeSelectedNodes={this.props.removeSelectedNodes}
                                onNodeClick={this.onNodeClick}
                                index={tempIndex}
                                isEditMode={this.props.isEditMode}
                                curSensorType={this.props.curSensorType}
                                selectedMenu={this.props.selectedMenu}
                                equipZoneID={this.props.equipZone.id}                                
                                parentFrm={this.props.parentFrm}
                                searchText={searchText}
                                selectedItem={this.props.selectedItem}
                                showPopupMenu={this.props.showPopupMenu}
                            />);
                    }
                }
            }
        }

        return [fireSensorUI, psmSensorUI, etcSensorUI, cctvUI, fireSensorType, psmSensorType, etcSensorType, cctvType];
    }

    render() {
        let equipZoneText = this.props.equipZone?.displayText;
        const equipZoneID = this.props.equipZone ? this.props.equipZone.id : -1;

        if (this.props.showID && this.props.equipZone) {
            equipZoneText += "(EquipZoneID : " + this.props.equipZone.id + ")";
        }

        const [fireSensorUI, psmSensorUI, etcSensorUI, cctvUI, fireSensorType, psmSensorType, etcSensorType, cctvType] = this.getUI();

        let selectedRowClassName = (this.state.isSelectedNode) ? space.selectedRow : null;

        return (
            <li ref={this.refNode} className={selectedRowClassName}><span className={styles.poiTreeEquipIcon}></span>
                {equipZoneText}
                <ul>
                    {
                        this.props.selectedMenu === SpaceMenus.EditEquipZoneCCTVs ?
                            <li><span className={styles.poiTreeCCTVIcon}></span>CCTV
                                {cctvUI}
                            </li>
                            :
                            <>
                                <li data-sensortype={fireSensorType} id={"fire_" + equipZoneID}><span className={styles.poiTreeFireIcon}></span>화재
                                    {fireSensorUI}
                                </li>
                                <li data-sensortype={psmSensorType} id={"psm_" + equipZoneID}><span className={styles.poiTreeLeakIcon}></span>누출
                                    {psmSensorUI}
                                </li>
                                <li data-sensortype={etcSensorType} id={"etc_" + equipZoneID}><span className={styles.poiTreeETCIcon}></span>ETC
                                    {etcSensorUI}
                                </li>
                                <li data-sensortype={cctvType} id={"cctv_" + equipZoneID}><span className={styles.poiTreeCCTVIcon}></span>CCTV
                                    {cctvUI}
                                </li>
                            </>
                    }
                </ul>
            </li>
        );
    }
}