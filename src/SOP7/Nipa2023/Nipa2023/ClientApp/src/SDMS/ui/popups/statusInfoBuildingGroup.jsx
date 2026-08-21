import React, { Component } from 'react';
// import StatusInfoBuilding from './statusInfoBuilding';
// import SDMSMainMenu from '../sdmsMainMenu';
import SDMS from '../sdms';
import SDMSResource from '../../resource/id';

import StatusInfoBuilding from './statusInfoBuilding';


class StatusInfoBuildingGroup extends Component {
    constructor(props) {
        super(props);

    }

    getBuildingUI() {
        let ui = [];

        let buildingClass = '';
        let buildingChildClass = '';

        if (this.props.buildingGroup.buildingDatas) {
            const buildingDatas = this.props.buildingGroup.buildingDatas;

            if (buildingDatas === undefined || buildingDatas === null || buildingDatas.length === 0)
                return ui;

            for (var i = 0; i < buildingDatas.length; i++) {
                const building = buildingDatas[i];
                if (building.visible === false && this.props.searchText.length > 0)
                    continue;

                if (this.props.selectedStatusInfo.building !== building.id) {
                    buildingClass = '';
                    buildingChildClass = 'tree-1depth';
                }
                else {
                    buildingClass = 'on';
                    buildingChildClass = 'tree-1depth on';
                }

                ui.push(
                    <li key={'building_' + building.id}>
                        <p className={buildingClass} onClick={() => this.onClickShowHide("buildingGroup", building.id)}>
                            {building.displayText}
                        </p>
                        <ul className={buildingChildClass} id={'buildingGroup_' + building.id}>
                            <StatusInfoBuilding
                                id={'building_' + building.id}
                                key={building.id}
                                building={building}
                                sensorList={this.props.sensorList}
                                setCurrentView={this.props.setCurrentView}
                                selectedSensor={this.props.selectedSensor}
                                selectSensor={this.props.selectSensor}
                                setVisiblePopups={this.props.setVisiblePopups}
                                selectedStatusInfo={this.props.selectedStatusInfo}
                                selectZone={this.props.selectZone}
                            />
                        </ul>
                    </li>
                );
            }
        }
        else {
            const outdoorZones = this.props.buildingGroup;

            for (const zone of outdoorZones) {

                if (this.props.selectedStatusInfo.building !== zone.id) {
                    buildingClass = '';
                    buildingChildClass = 'tree-1depth';
                }
                else {
                    buildingClass = 'on';
                    buildingChildClass = 'tree-1depth on';
                }

                ui.push(
                    <li key={'building_' + zone.id}>
                        <p className={buildingClass} onClick={() => this.onClickShowHide("buildingGroup", zone.id)}>
                            {zone.displayText}
                        </p>
                        <ul className={buildingChildClass} id={'buildingGroup_' + zone.id}>
                            <StatusInfoBuilding
                                key={'building_outdoor_' + zone.id}
                                id={zone.id}
                                building={outdoorZones}
                                sensorList={this.props.sensorList}
                                setCurrentView={this.props.setCurrentView}
                                selectedSensor={this.props.selectedSensor}
                                selectSensor={this.props.selectSensor}
                                selectedStatusInfo={this.props.selectedStatusInfo}
                                selectZone={this.props.selectZone}
                                moveToOutdoor={this.props.moveToOutdoor}
                            />
                        </ul>
                    </li>
                );

                // ù��° �ܺο����� Tree�� ǥ���Ѵ�.
                break;
            }/*)*/
            

        }
        
        return ui;
    }

    onClickShowHide = (type, id) => {
        this.props.selectBuilding(id);
    }

    render() {
        let buildingUI = this.getBuildingUI();

        return (
            <>
                {buildingUI}
            </>
        );
    }
}

export default StatusInfoBuildingGroup;