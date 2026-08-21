import React, { Component } from 'react';
import space from './../../css/space.module.css';
import styles from '../../css/spatial.module.css';

import $ from 'jquery';
import { BuildingNode } from './buildingNode';
import { SpaceMenus } from '../../spaceMenus';

export class BuildingGroupNode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
        }

        this.refBody = React.createRef();
    }

    componentDidMount() {

    }

    getUI() {
        let ui = [];
        const buildingGroup = this.props.buildingGroup;
        if (!buildingGroup) {
            return null;
        }

        const buildingDataCount = buildingGroup.buildingDatas.length;
        for (let i = 0; i < buildingDataCount; i++) {
            const building = buildingGroup.buildingDatas[i];
            if (building.visibleTreeView === false && this.props.searchText.length > 0) {
                continue;
            }

            ui.push(
                <BuildingNode
                    key={'node_building_' + building.id}
                    building={building}
                    sensorList={this.props.sensorList}
                    selectedRows={this.props.selectedRows}
                    onChangeSensor={this.props.onChangeSensor}
                    onChangeSensorList={this.props.onChangeSensorList}
                    curSensorType={this.props.curSensorType}
                    selectedNodes={this.props.selectedNodes}
                    addSelectedNodes={this.props.addSelectedNodes}
                    removeSelectedNodes={this.props.removeSelectedNodes}
                    isEditMode={this.props.isEditMode}
                    dashboard={this.props.dashboard}
                    selectedMenu={this.props.selectedMenu}
                    parentFrm={this.props.parentFrm}
                    searchText={this.props.searchText}
                    showID={this.props.showID}
                    clearSensorPosition={this.props.clearSensorPosition}
                    showPopupMenu={this.props.showPopupMenu}
                    moveToX={this.props.moveToX}
                    selectedItem={this.props.selectedItem}
                />);
        }

        return ui;
    }

    onSelect = (e) => {
        // Mouse 오른쪽 버튼일때
        if (e.button === 2 && e.target === this.refBody.current) {
            this.props.showPopupMenu(e.clientX + 50, e.clientY, '외부모델로 이동', BuildingGroupNode.moveToX, this, this.props.buildingGroup);
        }
    }

    // return 값 : showPopupMenu 초기화 필요한가?
    static moveToX(parameter) {
        if (parameter) {
            const buildingGroupNode = parameter;

            if (buildingGroupNode) {
                buildingGroupNode.props.moveToX(SpaceMenus.Menu_MoveTo_Site, null);
            }
        }

        return true;
    }

    render() {
        let buildingGroupText = this.props.buildingGroup?.displayText;

        if (this.props.showID && this.props.buildingGroup) {
            buildingGroupText += "(BuildingGroupID : " + this.props.buildingGroup.id + ")";
        }

        const spanClassName = this.props.selectedItem === this.props.buildingGroup ? styles.poiTreeGroupIcon + " " + styles.selected : styles.poiTreeGroupIcon;

        const ui = this.getUI();
        return (
            <li ref={this.refBody} style={{ position: 'relative' }} onMouseUp={(e) => this.onSelect(e)}>
               <span className={spanClassName}></span>{buildingGroupText}
                {
                /*this.props.dashboard &&
                    <div className={styles.treeIconImageAreaPoi}>
                        <span className={styles.goLink} onClick={this.moveToX} style={{ cursor: 'pointer' }}><a>이동</a></span>
                    </div>*/
                }
                <ul>                    
                    {ui}
                </ul>
            </li>
        );
    }
}