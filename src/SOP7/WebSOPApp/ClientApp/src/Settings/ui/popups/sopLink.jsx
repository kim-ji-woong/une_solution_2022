import React, { Component } from 'react';
import $ from 'jquery';

import { SopLinkComponent } from '../../styled/settingsStyled';
import ProjectResource from '../../../Root/resource/id';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';
import SdmsResource from '../../../SDMS/resource/id';

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
        $('.' + 'sopTree' + ' h5 div ').click(function () {
            if ($(this).is('.' + 'on')) {
                $(this).removeClass('on');
                $(this).parent().next().hide();
            } else {
                $(this).addClass('on');
                $(this).parent().next().show();
            };
        });

        $('.' + 'sopTree' + ' h5 span ').click(function () {
            if ($(this).is('.' + 'on')) {
                $(this).removeClass('on');
                $(this).parent().next().hide();
            } else {
                $(this).addClass('on');
                $(this).parent().next().show();
            };
        });

        //let initFacilityTypeID = null;        
        //if (this.props.sensorTypes && this.props.sensorTypes.length > 0) {
        //    initFacilityTypeID = this.props.sensorTypes[0].id;
        //}
        //let initBuildingGroup = null;
        //if (this.props.buildingGroupList && this.props.buildingGroupList.length) {
        //    initBuildingGroup = this.props.buildingGroupList[0];
        //}
                
        //if (initFacilityTypeID != null || initBuildingGroup != null) {
        //    this.setState({ selectedSensorType: initFacilityTypeID, selectedBuildingGroup: initBuildingGroup });
        //}

        let user = ProjectResource.getUserInfo();
        if (user?.siteID === ProjectResource.Site.GG_A) {
            this.props.setSOPLinkDatas(ProjectResource.Site.GG_B);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        //this.setScrollbar();
        if (prevProps.selectedSiteID !== this.props.selectedSiteID) {
            let initFacilityTypeID = null;
            if (this.props.sensorTypes && this.props.sensorTypes.length > 0) {
                initFacilityTypeID = this.props.sensorTypes[0].id;
            }
            let initBuildingGroup = null;
            if (this.props.buildingGroupList && this.props.buildingGroupList.length) {
                initBuildingGroup = this.props.buildingGroupList[0];
            }

            if (initFacilityTypeID != null || initBuildingGroup != null) {
                this.setState({ selectedSensorType: initFacilityTypeID, selectedBuildingGroup: initBuildingGroup, selectedBuilding: null, selectedZone: null });
            }
        }
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
            <ul className={'sopTree'}>
                {
                    this.props.buildingGroupList && this.props.buildingGroupList.map((val, index) => (
                        <li key={'bg_' + index}>
                            <h5>
                                <div className={(this.state.selectedBuildingGroup === val && this.state.selectedBuilding === null && this.state.selectedZone === null) ? 'treeSelect on' : null}>
                                    <p className={'sFactoryText'} onClick={() => this.onClickSpatial(val, null, null)}><span className={'arrowIcon'}></span>{i18nUtil.convertText(val.displayText)}</p>
                                </div>
                            </h5>
                            <ul>
                            {
                                val.buildingDatas && val.buildingDatas.map((val2, index2) => (
                                    <li key={'b_' + index2}>
                                        <h5 style={{ height: '30px' }}>
                                            <div style={{ padding: '0px', border: 'none' }} className={(this.state.selectedBuilding === val2 && this.state.selectedZone === null) ? 'treeSelect' : null}>
                                                <p className={'sAreaText'} onClick={() => this.onClickSpatial(val, val2, null)}><span className={'arrowIcon'}></span>{i18nUtil.convertText(val2.displayText)}</p>
                                            </div>
                                        </h5>
                                        {
                                            <ul>
                                                {
                                                    val2.zoneDatas && val2.zoneDatas.map((val3, index3) => (
                                                        <li key={'z_' + index3}>
                                                            <h5 style={{ height: '30px' }}>
                                                                <div style={{ padding: '0px', border: 'none' }} className={(this.state.selectedZone === val3) ? 'treeSelect' : null}>
                                                                    <p className={'sFloorText'} onClick={() => this.onClickSpatial(val, val2, val3)}><span className={'arrowIcon'}></span><span className={'sDisaster'}>{i18nUtil.convertText(val3.displayText)}</span></p>
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
        if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
            let sensorTypeUI = [];
            const selectedBuildingGroup = this.state.selectedBuildingGroup?.siteID;
    
            if (this.props.sensorTypes) {
                if (selectedBuildingGroup === ProjectResource.Site.GG_B) {  // 경기도청, 도의회
                    for (let val of this.props.sensorTypes) {
                        if (val.id === SdmsResource.facilityType.FIRE || val.id === SdmsResource.facilityType.BLACKOUT || val.id === SdmsResource.facilityType.WaterLevel || val.id === SdmsResource.facilityType.Earthquake) {
                            sensorTypeUI.push(
                                (this.state.selectedSensorType === val.id) ?
                                    <li key={'sensorType_' + val.id} className={'treeSelect'} onClick={() => this.onClickSensorType(val.id)}><a>{val.id === SdmsResource.facilityType.WaterLevel ? '침수' : i18nUtil.convertText(val.description)}</a></li>
                                    : <li key={'sensorType_' + val.id} onClick={() => this.onClickSensorType(val.id)}><a>{val.id === SdmsResource.facilityType.WaterLevel ? '침수' : i18nUtil.convertText(val.description)}</a></li>
                                )
                        }
                    }
                }
                else if (selectedBuildingGroup === ProjectResource.Site.GG_D) { // 경기 도서관
                    for (let val of this.props.sensorTypes) {
                        if (val.id === SdmsResource.facilityType.FIRE || val.id === SdmsResource.facilityType.BLACKOUT || val.id === SdmsResource.facilityType.WaterLevel) {
                            sensorTypeUI.push(
                                (this.state.selectedSensorType === val.id) ?
                                    <li key={'sensorType_' + val.id} className={'treeSelect'} onClick={() => this.onClickSensorType(val.id)}><a>{val.id === SdmsResource.facilityType.WaterLevel ? '침수' : i18nUtil.convertText(val.description)}</a></li>
                                    : <li key={'sensorType_' + val.id} onClick={() => this.onClickSensorType(val.id)}><a>{val.id === SdmsResource.facilityType.WaterLevel ? '침수' : i18nUtil.convertText(val.description)}</a></li>
                                )
                        }
                    }
                }
                else if (selectedBuildingGroup === ProjectResource.Site.GG_F) { // 경기 신용보증재단
                    for (let val of this.props.sensorTypes) {
                        if (val.id === SdmsResource.facilityType.FIRE || val.id === SdmsResource.facilityType.BLACKOUT || val.id === SdmsResource.facilityType.WaterLevel) {
                            sensorTypeUI.push(
                                (this.state.selectedSensorType === val.id) ?
                                    <li key={'sensorType_' + val.id} className={'treeSelect'} onClick={() => this.onClickSensorType(val.id)}><a>{val.id === SdmsResource.facilityType.WaterLevel ? '침수' : i18nUtil.convertText(val.description)}</a></li>
                                    : <li key={'sensorType_' + val.id} onClick={() => this.onClickSensorType(val.id)}><a>{val.id === SdmsResource.facilityType.WaterLevel ? '침수' : i18nUtil.convertText(val.description)}</a></li>
                                )
                        }
                    }
                }
            }

            return sensorTypeUI;
        }
        else {
            return (
                this.props.sensorTypes && this.props.sensorTypes.map((val, index) => (        
                    (this.state.selectedSensorType === val.id) ?
                        <li key={'sensorType_' + index} className={'treeSelect'} onClick={() => this.onClickSensorType(val.id)}><a>{i18nUtil.convertText(val.description)}</a></li>
                        : <li key={'sensorType_' + index} onClick={() => this.onClickSensorType(val.id)}><a>{i18nUtil.convertText(val.description)}</a></li>
                    ))
                )
        }
    }

    getDisasterUI() {
        let selectedBuildingGroupID = (this.state.selectedBuildingGroup) ? this.state.selectedBuildingGroup.id : null;
        let selectedBuildingID = (this.state.selectedBuilding) ? this.state.selectedBuilding.id : null;
        let selectedZoneID = (this.state.selectedZone) ? this.state.selectedZone.id : null;

        return (
            <ul className={'sopTree'}>
                {
                    this.props.disasterCategories && this.props.disasterCategories.map((dc, index) => (
                        <li key={'dc_' + index}>
                            <h5 style={{ height: '36px' }}>
                                <div className='on'>
                                    <p className={'sFactoryText'}><span className={'arrowIcon'}></span>{i18nUtil.convertText(dc.disasterCategory.categoryName)}</p>
                                </div>
                            </h5>
                            <ul>
                                {
                                    dc.subDisasterCategories && dc.subDisasterCategories.map((sdc, index2) => (
                                        <li key={'sdc_' + index2}>
                                            <h5 style={{ height: '30px' }}>
                                                <div className='on' style={{ padding: '0px', border: 'none' }}>
                                                    <p className={'sAreaText'}><span className={'arrowIcon'}></span>{i18nUtil.convertText(sdc.subDisasterCategory.subCategoryName)}</p>
                                                </div>
                                            </h5>
                                            <ul>
                                                {
                                                    sdc.disasterDatas && sdc.disasterDatas.map((d, index3) => (
                                                        <li key={'d_' + index3} id={'d_' + dc.disasterCategory.id + '/' + sdc.subDisasterCategory.id + '/' + d.disasterName}>
                                                            <h5>
                                                                <div style={{ padding: '0px', border: 'none' }}>
                                                                    <p className={'sFloorText'} onClick={() => this.onApply(dc.disasterCategory, sdc.subDisasterCategory, d.disasterName)}><span className={'arrowIcon'}></span><span className={'sDisaster'}>{i18nUtil.convertText(d.disasterName)}</span></p>
                                                                    {
                                                                        this.props.linkedSOPs && this.props.linkedSOPs.map((link, index4) => (
                                                                            
                                                                            (link.disasterCategoryID === dc.disasterCategory.id &&
                                                                            link.subDisasterCategoryID === sdc.subDisasterCategory.id &&
                                                                            link.disasterName === d.disasterName &&
                                                                            link.facilityTypeID === this.state.selectedSensorType &&
                                                                            link.linkedBuildingGroupID === selectedBuildingGroupID &&
                                                                            link.linkedBuildingID === selectedBuildingID &&
                                                                            link.linkedZoneID === selectedZoneID)
                                                                                ? <p className={'appliBtn'}>{i18n.t('setting.sopLink.적용')}</p>
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
                            <td>{i18nUtil.convertText(val.zoneName)}</td>
                            <td>{i18nUtil.convertText(val.facilityTypeName)}</td>
                            <td>{i18nUtil.convertText(val.categoryName)}</td>
                            <td>{i18nUtil.convertText(val.subCategoryName)}</td>
                            <td>{i18nUtil.convertText(val.disasterName)}</td>
                            <td><span className={'binIcon'} onClick={() => this.onClickRemoveLink(index)}></span></td>
                        </tr>
                    ))                
                }
            </tbody>
            )
    }

    onClickSpatial = (buildingGroup, building, zone) => {
        // (경기) 종합방재실 계정으로 로그인 한 경우
        // 입주기관 선택마다 SOP 목록을 새로 불러온다
        let user = ProjectResource.getUserInfo();
        if (user?.siteID === ProjectResource.Site.GG_A) {
            this.props.setSOPLinkDatas(buildingGroup.siteID);
        }

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
            linkedZoneID: (this.state.selectedZone) ? this.state.selectedZone.id : null,
            siteID: this.props.selectedSiteID
        }

        let sensorTypeCount = this.props.sensorTypes.length;
        for (let i = 0; i < sensorTypeCount; i++) {
            if (this.state.selectedSensorType === this.props.sensorTypes[i].id) {
                addLinkedSOP.facilityTypeName = this.props.sensorTypes[i].description;
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
            zoneName = (this.state.selectedBuildingGroup.displayText) ? i18nUtil.convertText(this.state.selectedBuildingGroup.displayText) : i18nUtil.convertText(this.state.selectedBuildingGroup.groupName);
        }
        if (this.state.selectedBuilding) {
            zoneName += "/" + (this.state.selectedBuilding.displayText) ? i18nUtil.convertText(this.state.selectedBuilding.displayText) : i18nUtil.convertText(this.state.selectedBuilding.buildingName);
        }
        if (this.state.selectedZone) {
            zoneName += "/" + (this.state.selectedZone.displayText) ? i18nUtil.convertText(this.state.selectedZone.displayText) : i18nUtil.convertText(this.state.selectedZone.zoneName);
        }

		return (
            <SopLinkComponent>
                {/*
                <ul className={'stgTab' + " SopSetTab"}>
                    <li><a>일반</a></li>
                    <li><a className={'on'}>고급</a></li>
                </ul>
                */}
                <div className={'stgList'}>
                    <span className={'stgScroll'}>
                        {
                           ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen &&
                           <span className={'stgConnectText'}>{i18n.t('setting.sopLink.SOP 연결')}</span>
                        }
                        <div className={'sopTreeArea'}>
                            <div className={'sopLocationBox'}>
                                <span className={'sopDisableText' + " " + 'sopActiveText'}>
                                    {
                                        ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen
                                        ? <>
                                            <span className={'sopLocationTitleHydrogen'}>{i18n.t('common.위치')}</span>
                                        </>
                                        : <>
                                            <span className={'sopLocationTitle'}>{i18n.t('common.위치')}</span>
                                        </>
                                    }
                                    {
                                        ProjectResource.SiteID !== ProjectResource.Site.Hydrogen &&
                                            <span className={'sopLocationZoneName'}>:{zoneName}</span>
                                    }
                                </span>
                                <div className={'sopLTree' + " " + 'sopScroll'}>
                                    {spatialUI/* vdcTree */}
                                </div> {/* sopLTree */}
                            </div> {/* sopLocationBox */}

                            <div className={'sopTypeBox'}>
                                <span className={'sopDisableText' + " " + 'sopActiveText'}>{i18n.t('setting.sopLink.센서 유형')}</span>
                                <div className={'sopLTree' + " " + 'sopScroll'}>
                                    <ul className={'sensorTypeTab'}>
                                        {sensorTypesUI}
                                    </ul>
                                </div>
                            </div>
                            <div className={'sopListBox'}>
                                <span className={'sopDisableTextF'}>
                                    <span className={'sopListFlex'}>{i18n.t('setting.sopLink.SOP목록')}</span>
                                    <span className={'editIcon'}></span>
                                </span>
                                <div className={'sopLTree' + " " + 'sopScroll'}>
                                    {disasterUI}
                                </div> {/* sopLTree */}
                            </div> {/* sopListBox */}
                        </div>  {/* sopTreeArea */}
                        <div className={'sopTableArea' + " " + 'sopScroll'}>
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{ width: "10%" }}>No</th>
                                        <th style={{ width: "20%" }}>{i18n.t('common.위치')}</th>
                                        <th style={{ width: "15%" }}>{i18n.t('setting.sopLink.센서 유형')}</th>
                                        <th style={{ width: "15%" }}>{i18n.t('setting.sopLink.재난분야')}</th>
                                        <th style={{ width: "15%" }}>{i18n.t('setting.sopLink.재난종류')}</th>
                                        <th style={{ width: "15%" }}>{i18n.t('setting.sopLink.SOP이름')}</th>
                                        <th style={{ width: "10%" }}>{i18n.t('common.삭제')}</th>
                                    </tr>
                                </thead>
                                {linkedSopDataUI}
                            </table>
                        </div> {/* sopTableArea */}
                    </span>
                </div> {/* sopContents */}
			</SopLinkComponent>
			);
    }
}


export default withTranslation()(SopLink);