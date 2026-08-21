import React, { Component } from 'react';
//import space from './../../css/space.module.css';
import styles from '../../css/spatial.module.css';

//import $ from 'jquery';
import { EquipZoneNode } from './equipZoneNode';
import { SpaceDataManager } from '../../services/spaceDataManager';
import SensorMakerResource from '../../../resource/id';
import { SensorNode } from './sensorNode';
import { SpaceMenus } from '../../spaceMenus';
import $ from 'jquery';

export class ZoneNode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            showMenu: false
        }

        this.refBody = React.createRef();
    }

    componentDidMount() {
    }

    getUI() {
        let ui = [];
        const equipmentZoneDatas = this.props.zone.equipmentZoneDatas;
        const equipmentZoneDataCount = equipmentZoneDatas.length;
        for (let i = 0; i < equipmentZoneDataCount; i++) {
            const equipZone = equipmentZoneDatas[i];
            if (equipZone.visibleTreeView === false && this.props.searchText.length > 0) {
                continue;
            }

            ui.push(
                <EquipZoneNode
                    key={'node_equipZone_' + equipZone.id}
                    zone={this.props.zone}
                    equipZone={equipZone}
                    sensorList={this.props.sensorList}
                    selectedRows={this.props.selectedRows}
                    onChangeSensor={this.props.onChangeSensor}
                    curSensorType={this.props.curSensorType}
                    selectedNodes={this.props.selectedNodes}
                    addSelectedNodes={this.props.addSelectedNodes}
                    removeSelectedNodes={this.props.removeSelectedNodes}  
                    isEditMode={this.props.isEditMode}
                    selectedMenu={this.props.selectedMenu}
                    parentFrm={this.props.parentFrm}
                    searchText={this.props.searchText}
                    showID={this.props.showID}
                    clearSensorPosition={this.props.clearSensorPosition}
                    selectedItem={this.props.selectedItem}
                    showPopupMenu={this.props.showPopupMenu}
                />);
        }

        return ui;
    }

    onSensorNodeClick = (sensor, index) => {
        if (this.props.isEditMode) {
            this.props.addSelectedNodes([sensor]);
        }
    }

    getSensorUI(sensors, facilityType, tag) {
        const ui = [];
        let rowIndex = -1;

        for (const sensor of sensors) {
            const tempIndex = ++rowIndex;

            ui.push(
                <SensorNode
                    key={tag + sensor.id}
                    facilityType={SensorMakerResource.facilityType.FIRE}
                    sensor={sensor}
                    selectedNodes={this.props.selectedNodes}
                    addSelectedNodes={this.props.addSelectedNodes}
                    removeSelectedNodes={this.props.removeSelectedNodes}
                    onNodeClick={this.onSensorNodeClick}
                    index={tempIndex}
                    isEditMode={this.props.isEditMode}
                    selectedItem={this.props.selectedItem}
                    showPopupMenu={this.props.showPopupMenu}
                />);
        }

        return ui;
    }

    getSensorsUI() {
        const ui = [];
        /*const sensorList = this.props.sensorList;

        if (sensorList) {
            let fireIndex = 0, psmIndex = 0, etcIndex = 0, cctvIndex = 0;

            for (const sensorType in sensorList) {
                if (sensorType === SpaceDataManager.FireSensorType) {
                    ui.push(
                        <li key={"fire_" + fireIndex++}>화재
                            {
                                this.getSensorUI(sensorList[sensorType], SensorMakerResource.facilityType.FIRE, 'sensor_fire')
                            }
                        </li>
                    );
                }
                else if (sensorType === SpaceDataManager.PSMSensorType) {
                    ui.push(
                        <li key={"psm_" + psmIndex++} id={id}>누출
                            {
                                this.getSensorUI(sensorList[sensorType], SensorMakerResource.facilityType.PSM_SENSOR, 'sensor_psm')
                            }
                        </li>
                    );
                }
                else if (sensorType === SpaceDataManager.EtcSensorType) {
                    ui.push(
                        <li key={"etc_" + etcIndex++} id={id}>ETC
                            {
                                this.getSensorUI(sensorList[sensorType], SensorMakerResource.facilityType.ETC, 'sensor_etc')
                            }
                        </li>
                    );
                }
                else if (sensorType === SpaceDataManager.CCTVType) {
                    ui.push(
                        <li key={"cctv_" + cctvIndex++} id={id}>CCTV
                            {
                                this.getSensorUI(sensorList[sensorType], SensorMakerResource.facilityType.Security_Sensor, 'sensor_cctv')
                            }
                        </li>
                    );
                }
            }
        }*/

        return ui;
    }

    sensorDisplayMode() {
        if (this.props.showEquipZone) {
            return (
                <ul>
                    {
                        this.getUI()
                    }
                </ul>
            );
        }

        return (
            <ul>
                {
                    this.getSensorsUI()
                }
            </ul>
            );
    }

    onSelect = (e) => {
        // Mouse 오른쪽 버튼일때
        if (e.button === 2) {
            if (e.target === this.refBody.current) {
                this.props.showPopupMenu(e.clientX + 50, e.clientY, '이동', ZoneNode.moveToX, [this, this.props.zone], this.props.zone);
            }
            else if (e.target?.parentElement?.parentElement?.parentElement?.parentElement === this.refBody.current) {
                this.props.showPopupMenu(e.clientX + 50, e.clientY, '센서추가', ZoneNode.addSensor, [this, this.props.zone, [this.getFacilityType(e.target.innerText), e.target.id]], e.target.id);
            }
        }
    }

    getFacilityType(sensorTypeName) {
        if (sensorTypeName.startsWith("화재")) {
            return SpaceDataManager.FireSensorType;
        }
        else if (sensorTypeName.startsWith("누출")) {
            return SpaceDataManager.PSMSensorType;
        }
        else if (sensorTypeName.startsWith("ETC")) {
            return SpaceDataManager.EtcSensorType;
        }
        else if (sensorTypeName.startsWith("CCTV")) {
            return SpaceDataManager.CCTVType;
        }

        return null;
    }

    static getFacilityTypeID(facilityType) {
        if (facilityType === SpaceDataManager.FireSensorType) {
            return SensorMakerResource.facilityType.FIRE;
        }
        else if (facilityType === SpaceDataManager.PSMSensorType) {
            return SensorMakerResource.facilityType.PSM_SENSOR;
        }
        else if (facilityType === SpaceDataManager.EtcSensorType) {
            return SensorMakerResource.facilityType.ETC;
        }
        else if (facilityType === SpaceDataManager.CCTVType) {
            return SensorMakerResource.facilityType.Security_Sensor;
        }

        return null;
    }

    // return 값 : showPopupMenu 초기화 필요한가?
    static addSensor(parameter) {
        if (parameter && parameter.length >= 3) {
            const zoneNode = parameter[0];
            const zone = parameter[1];
            const facilityType = parameter[2][0];
            const targetID = parameter[2][1];

            if (zoneNode) {
                const newSensor = {
                    buildingID: zone ? zone.buildingID : null,
                    department: null,
                    departmentPhoneNumber: null,
                    enabled: null,
                    equipZoneID: null,
                    isIndoor: zone && zone.id < 20000 && zone.id > 0,
                    name: null,
                    positionName: '',
                    sensorTagInfoID: null,
                    sensorZoneID: null,
                    sensorType: ZoneNode.getFacilityTypeID(facilityType),
                    sensorTypeName: facilityType,
                    x: null,
                    y: null,
                    z: null,
                    zoneID: zone ? zone.id : -1
                };

                if (facilityType === SpaceDataManager.FireSensorType) {
                    const id = ++SpaceDataManager.fireSensorID;
                    newSensor.id = id;
                    newSensor.orgSensorID = id;
                    newSensor.sensorSubType = null;
                }
                else if (facilityType === SpaceDataManager.PSMSensorType) {
                    const id = ++SpaceDataManager.psmSensorID;
                    newSensor.id = id;
                    newSensor.orgSensorID = id;
                }
                else if (facilityType === SpaceDataManager.EtcSensorType) {
                    const id = ++SpaceDataManager.etcSensorID;
                    newSensor.id = id;
                    newSensor.orgSensorID = id;
                }
                else if (facilityType === SpaceDataManager.CCTVType) {
                    const id = ++SpaceDataManager.cctvID;
                    newSensor.id = id;
                    newSensor.orgSensorID = id;
                }
                else {
                    return true;
                }

                newSensor.name = facilityType + "_" + newSensor.id;
                newSensor.tagNo = newSensor.id + 1;

                let sensorList = zoneNode.props.sensorList[facilityType];

                if (!sensorList) {
                    sensorList = [];
                    zoneNode.props.sensorList[facilityType] = sensorList;
                }

                sensorList.push(newSensor);
                zoneNode.props.onChangeSensorList(facilityType, sensorList);

                if (targetID) {
                    const element = $('#' + targetID);

                    if (element) {
                        element.children().show();
                    }
                }
            }
        }

        return true;
    }

    // return 값 : showPopupMenu 초기화 필요한가?
    static moveToX(parameter) {
        if (parameter && parameter.length >= 2) {
            const zoneNode = parameter[0];
            const zone = parameter[1];

            if (zoneNode) {
                zoneNode.props.moveToX(SpaceMenus.Menu_MoveTo_Floor, zone);
            }
        }

        return true;
    }

    render() {
        if (this.props.sensorDisplayMode) {
            return this.sensorDisplayMode();
        }

        let zoneText = this.props.zone?.displayText;

        if (this.props.showID && this.props.zone) {
            zoneText += "(ZoneID : " + this.props.zone.id + ")";
        }

        const spanClassName = this.props.selectedItem === this.props.zone ? styles.poiTreeZoneIcon + " " + styles.selected : styles.poiTreeZoneIcon;
        const ui = this.getUI();

        return (
            <li ref={this.refBody} onMouseUp={(e) => this.onSelect(e)}>
                <span className={spanClassName}></span>{zoneText}
                {
                    this.props.dashboard ?
                     <div className={styles.treeIconImageAreaPoi}>
                       <span className={styles.goLink} onClick={this.moveToX} style={{ cursor: 'pointer' }}><a>이동</a></span>
                     </div>
                     :null
                }
                <ul>
                    {ui}
                </ul>
            </li>
        );
    }
}