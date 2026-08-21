import React, { Component } from 'react';
import styled from "styled-components";
import HistoryResource from "../../resource/id";

export const CheckboxOptionsComponent = styled.div`
    width: 100%;
    height: 500px;
    overflow: auto;
    ${(props) => props.theme.scroll()};
    background-color: #222A38;
    position: absolute;
    z-index: 9999;

    > div {
        padding: 10px;

        &:hover {
            background-color: #1B212C;
        }
    }
`;

class CheckboxOptions extends Component {
    
    static EntireType = -1;
    
    constructor(props) {
        super(props);

    }

    checkSelectedValue = (id, arr) => {
        if (arr.includes(id)) {
            return true;
        }

        return false;
    }

    getBuildingUI = () => {
        let ui = [];

        const buildingGroupList = this.props.buildingGroupList;
        
        const selectedBuildings = this.props.selectedBuildings;
        let isAllChecked = selectedBuildings.includes(CheckboxOptions.EntireType);
        
        const sensorType = this.props.sensorType;
        const externalSensors = this.props.externalSensors;

        if (buildingGroupList) {
            ui.push(
                <div key={CheckboxOptions.EntireType}>
                    <input type='checkbox' id={CheckboxOptions.EntireType.toString()} 
                           onChange={(e) => this.props.setSelectedBuildings(e, CheckboxOptions.EntireType)} 
                           checked={isAllChecked} 
                    />
                    <label htmlFor={CheckboxOptions.EntireType.toString()}>전체</label>
                </div>
            )
            for (let building of buildingGroupList[0].buildingDatas) {
                let isChecked = this.checkSelectedValue(building.id, this.props.selectedBuildings);
                
                let targetSensor = externalSensors.find(sensor => sensor.zoneID === building.id);
                
                if (!targetSensor) {
                    continue;
                }
                
                if (sensorType !== CheckboxOptions.EntireType && targetSensor.sensorType !== sensorType) {
                    continue;
                }
                
                if (targetSensor.sensorType === HistoryResource.ExternalSensorTypes.Weather) {
                    continue;
                }
                
                if (isAllChecked) {
                   isChecked = true; 
                }

                ui.push(
                    <div key={building.id}>
                        <input type='checkbox' id={building.id} onChange={(e) => this.props.setSelectedBuildings(e, building.id)} checked={isChecked} />
                        <label htmlFor={building.id}>{building.buildingName}</label>
                    </div>
                )
            }
        }

        return ui;
    }

    getMaterialUI = () => {
        let ui = [];

        const materials = this.props.materials;
        
        const selectedMaterials = this.props.selectedMaterials;
        let isAllChecked = selectedMaterials.includes(CheckboxOptions.EntireType);

        if (materials) {
            ui.push(
                <div key={CheckboxOptions.EntireType}>
                    <input type='checkbox' id={CheckboxOptions.EntireType.toString()} 
                           onChange={(e) => this.props.setSelectedMaterials(e, CheckboxOptions.EntireType)} 
                           checked={isAllChecked} 
                    />
                    <label htmlFor={CheckboxOptions.EntireType.toString()}>전체</label>
                </div>
            )
            for (let material of materials) {
                let isChecked = this.checkSelectedValue(material.id, this.props.selectedMaterials);
                
                if (isAllChecked) {
                    isChecked = true; 
                }
                
                ui.push(
                    <div key={material.id}>
                        <input type='checkbox' id={material.id} onChange={(e) => this.props.setSelectedMaterials(e, material.id)} checked={isChecked} />
                        <label htmlFor={material.id}>{material.materialName}</label>
                    </div>
                )
            }
        }

        return ui;
    }

    render() {
        return (
            <CheckboxOptionsComponent>
                { this.props.type === 'building' && this.getBuildingUI() }
                { this.props.type === 'material' && this.getMaterialUI() }
            </CheckboxOptionsComponent>
        );
    }
}

export default CheckboxOptions;