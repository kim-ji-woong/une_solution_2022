import React, { Component } from 'react';
import space from './../../css/space.module.css';
import { SpaceMenus } from '../../spaceMenus';
import $ from 'jquery';
import { EquipZoneNode } from './equipZoneNode';
import { SensorListEdit } from '../sensorListEdit';
import { SpaceDataManager } from '../../services/spaceDataManager';

export class SensorNode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }

        this.refSensorNode = React.createRef();
        this.refText = React.createRef();
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    getSelectedNode() {
        if (this.props.selectedNodes) {
            const selectedSensors = [...this.props.selectedNodes];
            const selectedSensorCount = selectedSensors.length;
            for (let i = 0; i < selectedSensorCount; i++) {
                const selectedSensor = selectedSensors[i];
                if (this.props.selectedMenu === SpaceMenus.EditEquipZoneCCTVs) {
                    if (this.props.parentFrm.nLastSelectedNodeEquipZoneID === this.props.equipZoneID) {
                        if (selectedSensor === this.props.sensor) {
                            return true;
                        }
                    }
                }
                else {
                    if (selectedSensor === this.props.sensor) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    static hasPosition(sensor) {
        if (sensor.x !== undefined && sensor.x !== null &&
            sensor.y !== undefined && sensor.y !== null &&
            sensor.z !== undefined && sensor.z !== null) {
            return true;
        }

        return false;
    }

    static getSensorClassName(sensor, isSelected) {
        if (isSelected) {
            if (sensor && SensorNode.hasPosition(sensor)) {
                return space.selectedNode;
            }
            else {
                return space.selectedNode + " " + space.noPositionSensor;
            }
        }
        else {
            if (sensor && SensorNode.hasPosition(sensor)) {
                return null;
            }
            else {
                return space.noPositionSensor;
            }
        }
    }

    onMouseUp(e) {
        // Mouse 왼쪽 버튼일때
        if (e.button === 0) {
            this.props.onNodeClick(this.props.sensor, this.props.index)
        }
        // Mouse 오른쪽 버튼일때
        else if (e.button === 2) {
            if (e.target === this.refSensorNode.current) {
                if (this.props.showPopupMenu) {
                    this.props.showPopupMenu(e.clientX + 50, e.clientY, '이름변경', SensorNode.renameSensor, [this, this.props.sensor], null);
                }
            }
        }
    }

    // return 값 : showPopupMenu 초기화 필요한가?
    static renameSensor(parameter) {
        if (parameter && parameter.length >= 2) {
            const sensorNode = parameter[0];
            const sensor = parameter[1];
            sensorNode.props.showPopupMenu(null, null, null, null, null, sensor);
        }

        return false;
    }

    onKeyDown(e) {
        if (e.key === "Enter") {
            this.props.sensor.name = this.refText.current.value;
            this.props.showPopupMenu(null, null, null, null, null, null);
        }
    }

    getClassName(isSelected) {
        const sensor = this.props.sensor;
        return SensorNode.getSensorClassName(sensor, isSelected);
    }

    render() {
        const isSelected = this.getSelectedNode();
        const isHidden = this.props.selectedItem === this.props.sensor;

        const sensorName = isHidden ? "" : this.props.sensor.name;
        let sensorID = this.props.sensor?.id;

        if (sensorID === null || sensorID === undefined) {
            sensorID = -100;
        }

        return (
            <ul data-id={sensorID} className={this.getClassName(isSelected)}
                ref={this.refSensorNode}
                draggable={true}
                onMouseUp={(e) => this.onMouseUp(e)/*() => this.props.onNodeClick(this.props.sensor, this.props.index)*/}>
                {sensorName}
                {
                    this.props.selectedItem === this.props.sensor &&
                    <input ref={this.refText} type="text" defaultValue={this.props.sensor.name} onKeyDown={(e) => this.onKeyDown(e)} />
                }
            </ul>
        );
    }
}