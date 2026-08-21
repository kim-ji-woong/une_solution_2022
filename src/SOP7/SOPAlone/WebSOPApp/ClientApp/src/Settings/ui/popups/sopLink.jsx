import React, { Component } from 'react';
import $ from 'jquery';

import settings from '../../../Settings/css/settings.module.css';

class SopLink extends Component {
	constructor(props) {
		super(props);

        this.state = {
            selectedBuildingGroup: this.props.buildingGroupList && this.props.buildingGroupList.length > 0 ? this.props.buildingGroupList[0] : null,
            selectedBuilding: null,
            selectedZone: null,
            selectedSensorType: this.props.sensorTypes && this.props.sensorTypes.length > 0 ? this.props.sensorTypes[0].facilityTypeID : null
		}

		this.props = props;
    }

    componentDidMount() {
        $('.' + settings.sopTree + ' h5 div ').click(function () {
            if ($(this).is('.' + settings.on)) {
                $(this).removeClass(settings.on);
                $(this).parent().next().hide();
            } else {
                $(this).addClass(settings.on);
                $(this).parent().next().show();
            };
        });

        $('.' + settings.sopTree + ' h5 span ').click(function () {
            if ($(this).is('.' + settings.on)) {
                $(this).removeClass(settings.on);
                $(this).parent().next().hide();
            } else {
                $(this).addClass(settings.on);
                $(this).parent().next().show();
            };
        });

        //let initFacilityTypeID = null;        
        //if (this.props.sensorTypes && this.props.sensorTypes.length > 0) {
        //    initFacilityTypeID = this.props.sensorTypes[0].facilityTypeID;
        //}
        //let initBuildingGroup = null;
        //if (this.props.buildingGroupList && this.props.buildingGroupList.length) {
        //    initBuildingGroup = this.props.buildingGroupList[0];
        //}
                
        //if (initFacilityTypeID != null || initBuildingGroup != null) {
        //    this.setState({ selectedSensorType: initFacilityTypeID, selectedBuildingGroup: initBuildingGroup });
        //}
    }

    componentDidUpdate() {
        this.setScrollbar();
    }

    setScrollbar() {
        if (!this.props.linkedSOPs || this.props.linkedSOPs.length == 0) {
            return;
        }

        let selectedBuildingGroupID = (this.state.selectedBuildingGroup) ? this.state.selectedBuildingGroup.id : null;
        let selectedBuildingID = (this.state.selectedBuilding) ? this.state.selectedBuilding.id : null;
        let selectedZoneID = (this.state.selectedZone) ? this.state.selectedZone.id : null;

        let moveToName = null;

        const linkLength = this.props.linkedSOPs.length;
        for (let i = 0; i < linkLength; i++) {
            const link = this.props.linkedSOPs[i];
            if (link.facilityTypeID === this.state.selectedSensorType &&
                link.linkedBuildingGroupID === selectedBuildingGroupID &&
                link.linkedBuildingID === selectedBuildingID &&
                link.linkedZoneID === selectedZoneID) {
                moveToName = link.disasterCategoryID + '/' + link.subDisasterCategoryID + '/' + link.disasterName;
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

    getSpatialUI() {        
        return (
            <ul className={settings.sopTree}>
                {
                    this.props.buildingGroupList && this.props.buildingGroupList.map((val, index) => (
                        <li key={'bg_' + index}>
                            <h5>
                                <div onClick={() => this.onClickSpatial(val, null, null)} className={(this.state.selectedBuildingGroup === val && this.state.selectedBuilding === null && this.state.selectedZone === null) ? settings.treeSelect : null}>
                                    <p className={settings.sFactoryText}><span className={settings.arrowIcon}></span>{val.displayText}</p>
                                </div>
                            </h5>
                            <ul>
                            {
                                val.buildingDatas && val.buildingDatas.map((val2, index2) => (
                                    <li key={'b_' + index2}>
                                        <h5 style={{ height: '28px' }}>
                                            <div style={{ padding: '0px', border: 'none' }} onClick={() => this.onClickSpatial(val, val2, null)} className={(this.state.selectedBuilding === val2 && this.state.selectedZone === null) ? settings.treeSelect : null}>
                                                <p className={settings.sAreaText}><span className={settings.arrowIcon}></span>{val2.displayText}</p>
                                            </div>
                                        </h5>
                                        {
                                            <ul>
                                                {                                                    
                                                    val2.zones && val2.zones.map((val3, index3) => (
                                                        <li key={'z_' + index3}>
                                                            <h5 style={{ height: '24px' }}>
                                                                <div style={{ padding: '0px', border: 'none' }} onClick={() => this.onClickSpatial(val, val2, val3)} className={(this.state.selectedZone === val3) ? settings.treeSelect : null}>
                                                                    <p className={settings.sFloorText}><span className={settings.arrowIcon}></span>{val3.displayText}</p>
                                                                </div>
                                                            </h5>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        }
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

    getSensorTypesUI() {
        return (
            this.props.sensorTypes && this.props.sensorTypes.map((val, index) => (        
                (this.state.selectedSensorType === val.facilityTypeID) ?
                    <li key={'sensorType_' + index} className={settings.treeSelect} onClick={() => this.onClickSensorType(val.facilityTypeID)}><a>{val.displayText}</a></li>
                    : <li key={'sensorType_' + index} onClick={() => this.onClickSensorType(val.facilityTypeID)}><a>{val.displayText}</a></li>
                ))
            )
    }

    getDisasterUI() {
        let selectedBuildingGroupID = (this.state.selectedBuildingGroup) ? this.state.selectedBuildingGroup.id : null;
        let selectedBuildingID = (this.state.selectedBuilding) ? this.state.selectedBuilding.id : null;
        let selectedZoneID = (this.state.selectedZone) ? this.state.selectedZone.id : null;

        return (
            <ul className={settings.sopTree}>
                {
                    this.props.disasterCategories && this.props.disasterCategories.map((dc, index) => (
                        <li key={'dc_' + index}>
                            <h5>
                                <div>
                                    <p className={settings.sFactoryText}><span className={settings.arrowIcon}></span>{dc.disasterCategory.categoryName}</p>
                                </div>
                            </h5>
                            <ul>
                                {
                                    dc.subDisasterCategories && dc.subDisasterCategories.map((sdc, index2) => (
                                        <li key={'sdc_' + index2}>
                                            <h5 style={{ height: '28px' }}>
                                                <div style={{ padding: '0px', border: 'none' }}>
                                                    <p className={settings.sAreaText}><span className={settings.arrowIcon}></span>{sdc.subDisasterCategory.subCategoryName}</p>
                                                </div>
                                            </h5>
                                            <ul>
                                                {
                                                    sdc.disasterDatas && sdc.disasterDatas.map((d, index3) => (
                                                        <li key={'d_' + index3} id={'d_' + dc.disasterCategory.id + '/' + sdc.subDisasterCategory.id + '/' + d.disasterName}>
                                                            <h5 style={{ height: '24px' }}>
                                                                <div style={{ padding: '0px', border: 'none' }}>
                                                                    <p className={settings.sFloorText} onClick={() => this.onApply(dc.disasterCategory, sdc.subDisasterCategory, d.disasterName)}><span className={settings.arrowIcon}></span>{d.disasterName}</p>
                                                                    {
                                                                        this.props.linkedSOPs && this.props.linkedSOPs.map((link, index4) => (
                                                                            
                                                                            (link.disasterCategoryID === dc.disasterCategory.id &&
                                                                            link.subDisasterCategoryID === sdc.subDisasterCategory.id &&
                                                                            link.disasterName === d.disasterName &&
                                                                            link.facilityTypeID === this.state.selectedSensorType &&
                                                                            link.linkedBuildingGroupID === selectedBuildingGroupID &&
                                                                            link.linkedBuildingID === selectedBuildingID &&
                                                                            link.linkedZoneID === selectedZoneID)
                                                                                ? <p className={settings.appliBtn}>적용</p>
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

    getLinkedSopDataUI() {
        return (
              <tbody>
                {
                    this.props.linkedSOPs && this.props.linkedSOPs.map((val, index) => (
                        <tr key={'linkedSOP' + index}>
                            <td>{index + 1}</td>
                            <td>{val.zoneName}</td>
                            <td>{val.facilityTypeName}</td>
                            <td>{val.categoryName}</td>
                            <td>{val.subCategoryName}</td>
                            <td>{val.disasterName}</td>
                            <td><span className={settings.binIcon} onClick={() => this.onClickRemoveLink(index)}></span></td>
                        </tr>
                    ))                
                }
              </tbody>
            )
    }

    onClickSpatial = (buildingGroup, building, zone) => {
        if (this.state.selectedBuildingGroup === buildingGroup && this.state.selectedBuilding === building && this.state.selectedZone === zone) {
            this.setState({ selectedBuildingGroup: null, selectedBuilding: null, selectedZone: null });
            return;
        }

        this.setScrollbar();

        this.setState({ selectedBuildingGroup: buildingGroup, selectedBuilding: building, selectedZone: zone });
    }

    onClickSensorType = (sensorType) => {
        if (this.state.selectedSensorType === sensorType) {
            return;
        }

        this.setScrollbar();

        this.setState({ selectedSensorType: sensorType });
    }

    onApply = (dc, sdc, dName) => {
        let bNoSpatial = false;
        if (this.state.selectedBuildingGroup === null && this.state.selectedBuilding === null && this.state.selectedZone === null) {
            // 공간정보 없음
            bNoSpatial = true;
        }
        if (this.state.selectedSensorType === null) {
            return;
        }

        let linkedSOPs = this.props.linkedSOPs;

        const selectedBuildingID = (this.state.selectedBuilding) ? this.state.selectedBuilding.id : null;
        const selectedZoneID = (this.state.selectedZone) ? this.state.selectedZone.id : null;

        const linkedCount = linkedSOPs.length;
        for (let i = 0; i < linkedCount; i++) {
            const linkedSOP = this.props.linkedSOPs[i];
            if (!bNoSpatial) {
                if (linkedSOP.linkedBuildingGroupID === this.state.selectedBuildingGroup.id &&
                    linkedSOP.linkedBuildingID === selectedBuildingID &&
                    linkedSOP.linkedZoneID === selectedZoneID &&
                    linkedSOP.facilityTypeID === this.state.selectedSensorType) {
                    if (linkedSOP.disasterCategoryID === dc.id &&
                        linkedSOP.subDisasterCategoryID === sdc.id &&
                        linkedSOP.disasterName === dName) {
                        return;
                    } else {
                        linkedSOP.disasterCategoryID = dc.id;
                        linkedSOP.subDisasterCategoryID = sdc.id;
                        linkedSOP.categoryName = dc.categoryName;
                        linkedSOP.subCategoryName = sdc.subCategoryName;
                        linkedSOP.disasterName = dName;

                        this.props.updateLinkedSops(linkedSOPs);
                        return;
                    }
                }
            } else {
                if (linkedSOP.facilityTypeID === this.state.selectedSensorType) {
                    if (linkedSOP.disasterCategoryID === dc.id &&
                        linkedSOP.subDisasterCategoryID === sdc.id &&
                        linkedSOP.disasterName === dName) {
                        return;
                    } else {
                        linkedSOP.disasterCategoryID = dc.id;
                        linkedSOP.subDisasterCategoryID = sdc.id;
                        linkedSOP.categoryName = dc.categoryName;
                        linkedSOP.subCategoryName = sdc.subCategoryName;
                        linkedSOP.disasterName = dName;

                        this.props.updateLinkedSops(linkedSOPs);
                        return;
                    }
                }
            }
        }

        let addLinkedSOP = {
            linkID : -1,
            facilityTypeID : this.state.selectedSensorType,
            disasterCategoryID : dc.id,
            subDisasterCategoryID : sdc.id,
            categoryName : dc.categoryName,
            subCategoryName : sdc.subCategoryName,
            disasterName : dName,
            linkedBuildingGroupID: (this.state.selectedBuildingGroup) ? this.state.selectedBuildingGroup.id : null,
            linkedBuildingID: (this.state.selectedBuilding) ? this.state.selectedBuilding.id : null,
            linkedZoneID: (this.state.selectedZone) ? this.state.selectedZone.id : null
        }

        let sensorTypeCount = this.props.sensorTypes.length;
        for (let i = 0; i < sensorTypeCount; i++) {
            if (this.state.selectedSensorType === this.props.sensorTypes[i].facilityTypeID) {
                addLinkedSOP.facilityTypeName = this.props.sensorTypes[i].displayText;
                break;
            }
        }

        if (!bNoSpatial) {
            addLinkedSOP.zoneName = (this.state.selectedBuildingGroup.displayText) ? this.state.selectedBuildingGroup.displayText : this.state.selectedBuildingGroup.groupName;
            if (this.state.selectedBuilding) {
                addLinkedSOP.zoneName += "/" + ((this.state.selectedBuilding.displayText) ? this.state.selectedBuilding.displayText : this.state.selectedBuilding.buildingName);
            }
            if (this.state.selectedZone) {
                addLinkedSOP.zoneName += "/" + ((this.state.selectedZone.displayText) ? this.state.selectedZone.displayText : this.state.selectedZone.zoneName);
            }
        }
        else {
            addLinkedSOP.zoneName = '';
        }

        linkedSOPs.push(addLinkedSOP);
        this.props.updateLinkedSops(linkedSOPs);
    }

    onClickRemoveLink = (index) => {
        let linkedSOPs = this.props.linkedSOPs;
        linkedSOPs.splice(index, 1);
        this.props.updateLinkedSops(linkedSOPs);
    }

    render() {
        const spatialUI = this.getSpatialUI();
        const sensorTypesUI = this.getSensorTypesUI();
        const disasterUI = this.getDisasterUI();
        const linkedSopDataUI = this.getLinkedSopDataUI();

        let zoneName = '';
        if (this.state.selectedBuildingGroup) {
            zoneName = (this.state.selectedBuildingGroup.displayText) ? this.state.selectedBuildingGroup.displayText : this.state.selectedBuildingGroup.groupName;
        }
        if (this.state.selectedBuilding) {
            zoneName += "/" + ((this.state.selectedBuilding.displayText) ? this.state.selectedBuilding.displayText : this.state.selectedBuilding.buildingName);
        }
        if (this.state.selectedZone) {
            zoneName += "/" + ((this.state.selectedZone.displayText) ? this.state.selectedZone.displayText : this.state.selectedZone.zoneName);
        }

		return (
			<>
                <div className={settings.sopContents}>
                    <span className={settings.sopTitle}>
                        {/* <span className={settings.sopSetIcon}></span> */}
                        <span className={settings.sopSetText}>SOP 연결</span>
                    </span>
                    <div className={settings.sopTreeArea}>
                        <div className={settings.sopLocationBox}>
                            <span className={ /* settings.sopDisableText + " " +  */settings.sopActiveText}>위치 : <span className={settings.sopLocationText}>{zoneName}</span></span>
                            <div className={settings.sopLTree + " " + settings.sopScroll}>
                                {spatialUI/* vdcTree */}
                            </div> {/* sopLTree */}
                        </div> {/* sopLocationBox */}

                        <div className={settings.sopTypeBox}>
                            <span className={ /* settings.sopDisableText + " " + */settings.sopActiveText}>센서유형</span>
                            <ul className={settings.sensorTypeTab + " " + settings.sensorTypeScroll}>
                                {sensorTypesUI}
                            </ul>
                        </div>
                        <div className={settings.sopListBox}>
                            <span className={settings.sopDisableTextF}>
                                <span className={settings.sopListFlex}>SOP목록 (재난분야/재난종류/SOP이름)</span>
                                <span className={settings.editIcon}></span>
                            </span>
                            <div className={settings.sopLTree + " " + settings.sopScroll}>
                                {disasterUI}
                            </div> {/* sopLTree */}
                        </div> {/* sopListBox */}
                    </div>  {/* sopTreeArea */}
                    <div className={settings.sopTableArea + " " + settings.sopTableScroll}>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: '5%' }}>NO</th>
                                    <th style={{ width: '25%' }}>위치(공장/건물/층)</th>
                                    <th style={{ width: '15%' }}>센서유형</th>
                                    <th style={{ width: '10%' }}>재난분야</th>
                                    <th style={{ width: '15%' }}>재난종류</th>
                                    <th style={{ width: '25%' }}>SOP이름</th>
                                    <th style={{ width: '5%' }}>삭제</th>
                                </tr>
                            </thead>
                            {linkedSopDataUI}
                        </table>
                    </div> {/* sopTableArea */}
                </div> {/* sopContents */}
			</>
			);
    }
}


export default SopLink;