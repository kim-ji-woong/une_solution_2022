import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { SopLinkComponent } from '../styled/settingsStyled';
import ProjectResource from '../../Root/resource/id';
import SdmsResource from '../../SDMS/resource/id';
import AccountResource from '../../Account/resource/id';

class SopLink extends Component {
	constructor(props) {
		super(props);

        this.state = {
            selectedBuilding: null,
            selectedZone: null,
            selectedSensorType: null,
		}

    }

    componentDidUpdate() {
        this.setScrollbar();
    }

    setScrollbar() {
        if (!this.props.linkedSOPs || this.props.linkedSOPs.length === 0) {
            return;
        }

        let selectedBuildingID = (this.state.selectedBuilding) ? this.state.selectedBuilding.id : null;
        let selectedZoneID = (this.state.selectedZone) ? this.state.selectedZone.id : null;

        let moveToName = null;

        const linkLength = this.props.linkedSOPs.length;
        for (let i = 0; i < linkLength; i++) {
            const link = this.props.linkedSOPs[i];
            if (link.facilityType === this.state.selectedSensorType &&
                link.linkedBuildingID === selectedBuildingID &&
                link.lInkedZoneID === selectedZoneID) {
                moveToName = link.subDisasterCategoryID + '/' + link.disasterName;
                break;
            }
        }

        if (moveToName !== null) {
            const temp = document.getElementById('d_' + moveToName);
            if (temp) {
                temp.scrollIntoView({ "behavior": "smooth", "block": "center" });
            }
        }
    }

    onClickSpatial = (building, zone) => {
        if (this.state.selectedBuilding === building && this.state.selectedZone === zone) {
            this.setState({ selectedBuildingGroup: null, selectedBuilding: null, selectedZone: null });
            return;
        }

        this.setScrollbar();

        this.setState({ selectedBuilding: building, selectedZone: zone });
    }

    getSpatialUI() {        
        return (
            <ul className={'sopTree'}>
                {
                    this.props.buildingGroupList && this.props.buildingGroupList.map((val) => (
                        val.buildingDatas && val.buildingDatas.map((val2, index2) => (
                            <li key={'b_' + index2}>
                                <h5 className="buildingText">
                                    <div style={{ padding: '0px', border: 'none' }} className={(this.state.selectedBuilding === val2) ? 'treeSelect on' : 'treeSelect'}>
                                        <p className={'sAreaText'} onClick={() => this.onClickSpatial(val2, null)}><span className={'toggleIcon'}></span>{val2.displayText}</p>
                                    </div>
                                </h5>
                                {
                                    <ul className={(this.state.selectedBuilding === val2) ? 'on' : ''}>
                                        {
                                            val2.zoneDatas && val2.zoneDatas.map((val3, index3) => (
                                                <li key={'z_' + index3}>
                                                    <h5 style={{ height: '30px' }}>
                                                        <div style={{ padding: '0px', border: 'none' }} className={(this.state.selectedZone === val3) ? 'treeSelect on' : 'treeSelect'}>
                                                            <p className={'sFloorText'} onClick={() => this.onClickSpatial(val2, val3)}><span className={'arrowIcon'}></span>{val3.displayText}</p>
                                                        </div>
                                                    </h5>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                }
                            </li>
                        ))
                    ))
                }
            </ul>
        );
    }

    onClickSensorType = (sensorType) => {
        if (this.state.selectedSensorType === sensorType) {
            return;
        }

        this.setScrollbar();

        this.setState({ selectedSensorType: sensorType });
    }

    getSensorTypesUI() {

        const sensorTypes = [
            {id: SdmsResource.facilityType.GAS, description: SdmsResource.ID.sensor.gas}, 
            {id: SdmsResource.facilityType.ATMOSPHERE, description: SdmsResource.ID.sensor.atmosphere}, 
            {id: SdmsResource.facilityType.EMERGENCYBELL, description: SdmsResource.ID.sensor.emergencyBell}, 
            {id: SdmsResource.facilityType.THERMAL_CAMERA, description: SdmsResource.ID.sensor.thermalCamera}, 
            {id: SdmsResource.facilityType.WORKER, description: SdmsResource.ID.sensor.worker}, 
            {id: SdmsResource.facilityType.FIRE, description: SdmsResource.ID.sensor.fire}, 
        ];

        return (
            sensorTypes && sensorTypes.map((val, index) => (        
                (this.state.selectedSensorType === val.id) ?
                    <li key={'sensorType_' + index} className={'treeSelect'} onClick={() => this.onClickSensorType(val.id)}><a>{val.description}</a></li>
                    : <li key={'sensorType_' + index} onClick={() => this.onClickSensorType(val.id)}><a>{val.description}</a></li>
                )
            )
        )
    }

    onHandleTree = (e) => {
        const element = e.currentTarget;
        const nextElement = element.nextSibling;

        if(element) {
            element.classList.toggle('on');
            nextElement.classList.toggle('on');
        }
    }

    onApply = (dc, sdc, dName) => {
        const campusID = ProjectResource.campusID;
        
        let bNoSpatial = false;
        if (this.state.selectedBuilding === null && this.state.selectedZone === null) {
            // 공간정보 없음
            bNoSpatial = true;
        }
        if (this.state.selectedSensorType === null) {
            this.props.showConfirmDialog(['센서유형을 선택해주세요.'], null, null, 'error');
            return;
        }

        let linkedSOPs = this.props.linkedSOPs;
        let updateLinkedSOPs = this.props.updateLinkedSOPs;
        
        let addLinkedSOP = {
            campusID: campusID,
            facilityType : this.state.selectedSensorType,
            disasterCategoryID : dc.id,
            subDisasterCategoryID : sdc.id,
            disasterCategoryName : dc.categoryName,
            subDisasterCategoryName : sdc.subCategoryName,
            disasterName : dName,
            linkedBuildingID: (this.state.selectedBuilding) ? this.state.selectedBuilding.id : null,
            linkedZoneID: (this.state.selectedZone) ? this.state.selectedZone.id : null,
        }

        const selectedBuildingID = (this.state.selectedBuilding) ? this.state.selectedBuilding.id : null;
        const selectedZoneID = (this.state.selectedZone) ? this.state.selectedZone.id : null;

        for(let i = 0; i < linkedSOPs.length; i++) {
            const linkedsop = this.props.linkedSOPs[i];

            if (!bNoSpatial) {

                // 선택한 위치와 센서유형이 이미 list에 존재하는지 체크
                if(linkedsop.linkedBuildingID === selectedBuildingID &&
                    (linkedsop.lInkedZoneID === selectedZoneID || linkedsop.linkedZoneID === selectedZoneID) &&
                    linkedsop.facilityType === this.state.selectedSensorType) {
                        
                    // sop목록이 동일한지 체크
                    if (linkedsop.disasterCategoryID === dc.id &&
                        linkedsop.subDisasterCategoryID === sdc.id &&
                        linkedsop.disasterName === dName) {
                        return;
                    } else {
                        linkedsop.disasterCategoryID = dc.id;
                        linkedsop.subDisasterCategoryID = sdc.id;
                        linkedsop.disasterCategoryName = dc.categoryName;
                        linkedsop.subDisasterCategoryName = sdc.subCategoryName;
                        linkedsop.disasterName = dName;
    
                        updateLinkedSOPs[i].disasterCategoryID = dc.id;
                        updateLinkedSOPs[i].subDisasterCategoryID = sdc.id;
                        updateLinkedSOPs[i].categoryName = dc.categoryName;
                        updateLinkedSOPs[i].subCategoryName = sdc.subCategoryName;
                        updateLinkedSOPs[i].disasterName = dName;
    
                        this.props.updateLinkedSops(linkedSOPs, updateLinkedSOPs);
                        return;
                    }
                }
            } else {
                if(linkedsop.linkedBuildingID === null && (linkedsop.lInkedZoneID === null || linkedsop.linkedZoneID === null)){
                    if (linkedsop.facilityType === this.state.selectedSensorType) {
                        if (linkedsop.disasterCategoryID === dc.id &&
                            linkedsop.subDisasterCategoryID === sdc.id &&
                            linkedsop.disasterName === dName) {
                            return;
                        } else {
                            linkedsop.disasterCategoryID = dc.id;
                            linkedsop.subDisasterCategoryID = sdc.id;
                            linkedsop.disasterCategoryName = dc.categoryName;
                            linkedsop.subDisasterCategoryName = sdc.subCategoryName;
                            linkedsop.disasterName = dName;
        
                            updateLinkedSOPs[i].disasterCategoryID = dc.id;
                            updateLinkedSOPs[i].subDisasterCategoryID = sdc.id;
                            updateLinkedSOPs[i].categoryName = dc.categoryName;
                            updateLinkedSOPs[i].subCategoryName = sdc.subCategoryName;
                            updateLinkedSOPs[i].disasterName = dName;
    
                            this.props.updateLinkedSops(linkedSOPs, updateLinkedSOPs);
                            return;
                        }
                    }
                }
            }
        }

        let addUpdateLinkedSOP = {
            campusID: campusID,
            facilityTypeID : this.state.selectedSensorType,
            disasterCategoryID : dc.id,
            subDisasterCategoryID : sdc.id,
            disasterName : dName,
            linkedBuildingID: (this.state.selectedBuilding) ? this.state.selectedBuilding.id : null,
            linkedZoneID: (this.state.selectedZone) ? this.state.selectedZone.id : null,
        }

        if (!bNoSpatial) {
            if (this.state.selectedBuilding) {
                addLinkedSOP.linkedPosition = (this.state.selectedBuilding.displayText) ? this.state.selectedBuilding.displayText : this.state.selectedBuilding.buildingName;
            }
            if (this.state.selectedZone) {
                addLinkedSOP.linkedPosition += "/" + ((this.state.selectedZone.displayText) ? this.state.selectedZone.displayText : this.state.selectedZone.zoneName);
            }
        }
        else {
            addLinkedSOP.linkedPosition = '';
        }

        linkedSOPs.push(addLinkedSOP);
        updateLinkedSOPs.push(addUpdateLinkedSOP);

        this.props.updateLinkedSops(linkedSOPs, updateLinkedSOPs);
    }

    onClickRemoveLink = (index) => {
        let linkedSOPs = this.props.linkedSOPs;
        let updateLinkedSOPs = this.props.updateLinkedSOPs;

        linkedSOPs.splice(index, 1);
        updateLinkedSOPs.splice(index, 1);

        this.props.updateLinkedSops(linkedSOPs, updateLinkedSOPs);
    }

    onClickGoSopManager = () => {
        let userInfo = ProjectResource.getUserInfo();

        if(userInfo && userInfo !== null && (parseInt(userInfo.levelID) === AccountResource.accountLevelID.master || parseInt(userInfo.levelID) === AccountResource.accountLevelID.generalAdmin)) {
            this.props.history.push(ProjectResource.path.sopManager);
            this.props.onClickClosePopup('settings', false);
        } 
        else {
            this.props.showConfirmDialog(['권한이 없습니다.'], null, null, 'error');
        }
    }

    getDisasterUI() {

        let selectedBuildingID = (this.state.selectedBuilding) ? this.state.selectedBuilding.id : null;
        let selectedZoneID = (this.state.selectedZone) ? this.state.selectedZone.id : null;

        return (
            <ul className={'sopTree'}>
                {
                    this.props.disasterCategories && this.props.disasterCategories.map((dc, index) => (
                        <li key={'dc_' + index}>
                            <h5 style={{ height: '30px' }} onClick={(e) => this.onHandleTree(e)}>
                                <div>
                                    <p className={'sFactoryText'}><span className={'toggleIcon'}></span>{dc.categoryName}</p>
                                </div>
                            </h5>
                            <ul>
                                {
                                    dc.subDisasterCategories && dc.subDisasterCategories.map((sdc, index2) => (
                                        <li key={'sdc_' + index2}>
                                            <h5 style={{ height: '30px' }} onClick={(e) => this.onHandleTree(e)}>
                                                <div className='on' style={{ paddingLeft: '14px', border: 'none' }}>
                                                    <p className={'sFactoryText'}><span className={'toggleIcon'}></span>{sdc.subCategoryName}</p>
                                                </div>
                                            </h5>
                                            <ul>
                                                {
                                                    sdc.disasters && sdc.disasters.map((d, index3) => (
                                                        <li key={'d_' + index3} id={'d_' + dc.id + '/' + sdc.id + '/' + d.disasterName}>
                                                            <h5>
                                                                <div style={{ paddingLeft: '14px', border: 'none' }}>
                                                                    <p className={'sFloorText'} onClick={() => this.onApply(dc, sdc, d.disasterName)}><span className={'arrowIcon'}></span>{d.disasterName}</p>
                                                                    {
                                                                        this.props.linkedSOPs && this.props.linkedSOPs.map((link, index4) => (
                                                                            
                                                                            (link.disasterCategoryID === dc.id &&
                                                                            link.subDisasterCategoryID === sdc.id &&
                                                                            link.disasterName === d.disasterName &&
                                                                            link.facilityType === this.state.selectedSensorType &&
                                                                            link.linkedBuildingID === selectedBuildingID &&
                                                                            link.lInkedZoneID === selectedZoneID)
                                                                                ? <p className={'appliBtn'}>적용</p>
                                                                                : <></>
                                                                            ))
                                                                            
                                                                    }
                                                                </div>
                                                            </h5>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </li>
                                    ))
                                }
                            </ul>
                        </li>
                    ))
                }
            </ul>
        );
    }

    getPositionNameFromID(buildingID, zoneID) {

        if(buildingID === null && zoneID === null) {
            return '';
        }

        const buildingGroupList = [...this.props.buildingGroupList];

        for (const buildingGroup of buildingGroupList) {
            for (const buildingData of buildingGroup.buildingDatas) {
                if(buildingData.id === buildingID) {
                    if(zoneID === null) {
                        return buildingData.displayText;
                    }
                    else {
                        for (const zoneData of buildingData.zoneDatas) {
                            if (zoneData.id === zoneID) {
                                return buildingData.displayText + '/' + zoneData.displayText;
                            }
                        }
                    }
                }
            }
        }

        return '';
    }

    getLinkedSopDataUI() {
        const linkedSOPs = this.props.linkedSOPs;

        let linkedSopDataUI = [];

        let index = 1;

        if(linkedSOPs) {

            for(let i = 0; i < linkedSOPs.length; i++) {
                const val = linkedSOPs[i];

                let positionName = this.getPositionNameFromID(val.linkedBuildingID, val.lInkedZoneID)
                
                let sensorType = '';
                if(val.facilityType === SdmsResource.facilityType.GAS)
                    sensorType = SdmsResource.ID.sensor.gas;
                else if(val.facilityType === SdmsResource.facilityType.ATMOSPHERE)
                    sensorType = SdmsResource.ID.sensor.atmosphere;
                else if(val.facilityType === SdmsResource.facilityType.EMERGENCYBELL)
                    sensorType = SdmsResource.ID.sensor.emergencyBell;
                else if(val.facilityType === SdmsResource.facilityType.THERMAL_CAMERA)
                    sensorType = SdmsResource.ID.sensor.thermalCamera;
                else if(val.facilityType === SdmsResource.facilityType.WORKER)
                    sensorType = SdmsResource.ID.sensor.worker;
                else if(val.facilityType === SdmsResource.facilityType.FIRE)
                    sensorType = SdmsResource.ID.sensor.fire;

                linkedSopDataUI.push(
                    <tr key={'linkedSOP' + i}>
                        <td>{index}</td>
                        {
                            val.linkedPosition ? 
                            <td>{val.linkedPosition}</td> :
                            <td>{positionName}</td>
                        }
                        <td>{sensorType}</td>
                        <td>{val.disasterCategoryName + " > " + val.subDisasterCategoryName + " > " + val.disasterName}</td>
                        <td><span className={'binIcon'} onClick={() => this.onClickRemoveLink(i)}></span></td>
                    </tr>
                );

                index++;
            }
        }

        return linkedSopDataUI;
    }

    render() {
        const spatialUI = this.getSpatialUI();
        const sensorTypesUI = this.getSensorTypesUI();
        const disasterUI = this.getDisasterUI();
        const linkedSopDataUI = this.getLinkedSopDataUI();

        let zoneName = '';
        if (this.state.selectedBuilding) {
            zoneName = (this.state.selectedBuilding.displayText) ? this.state.selectedBuilding.displayText : this.state.selectedBuilding.buildingName;
        }
        if (this.state.selectedZone) {
            zoneName += "/" + ((this.state.selectedZone.displayText) ? this.state.selectedZone.displayText : this.state.selectedZone.zoneName);
        }

		return (
            <SopLinkComponent>
                <div className='listWrap'>
                    <h5>SOP연결</h5>
                </div>
                <div className={'stgList'}>
                    <div className={'sopTreeArea'}>
                        <div className={'sopLocationBox'}>
                            <span className={'sopDisableText sopActiveText'}>위치 : <span>{zoneName}</span></span>
                            <div className={'sopLTree sopScroll'}>
                                {spatialUI}
                            </div>
                        </div>
                        <div className={'sopTypeBox'}>
                            <span className={'sopDisableText sopActiveText'}>센서유형</span>
                            <div className={'sopLTree sopScroll'}>
                                <ul className={'sensorTypeTab'}>
                                    {sensorTypesUI}
                                </ul>
                            </div>
                        </div>
                        <div className={'sopListBox'}>
                            <span className={'sopDisableTextF'}>
                                <span className={'sopListFlex'}>SOP목록 (상황분야/상황종류/SOP이름)</span>
                                <span className={'editIcon'} onClick={() => this.onClickGoSopManager()}></span>
                            </span>
                            <div className={'sopLTree sopScroll'}>
                                {disasterUI}
                            </div>
                        </div>
                    </div>

                    <div className={'sopTableArea'}>
                        <table className='sopThead'>
                            <thead>
                                <tr>
                                    <th>NO</th>
                                    <th>위치</th>
                                    <th>센서유형</th>
                                    <th>SOP 목록 (상황분야 {'>'} 상황종류 {'>'} SOP 이름)</th>
                                    <th>삭제</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className={'sopTableAreaBody'}>
                        <table className='sopTbody'>
                            <tbody>
                                {linkedSopDataUI}
                            </tbody>
                        </table>
                    </div>
                </div>
			</SopLinkComponent>
		);
    }
}

export default withRouter(SopLink);