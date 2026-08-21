import React, { Component } from 'react';
import $ from 'jquery';
import { ModalBackgroundSOPLink } from '../../styled/settingsStyled';
import { SopLinkComponent } from '../../styled/settingsStyled';
import ProjectResource from '../../../Root/resource/id';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';
import close_btn from '../../../Common/img/imghydrogen/main/close_icon.svg';
import binIcon from '../../../Common/img/imghydrogen/main/recycleBin_icon.svg';
import apply_icon from '../../../Common/img/imghydrogen/main/apply_icon.svg';

import SDMSResource from '../../../SDMS/resource/id';
import SopController from '../../../SOPManager/services/sopController';

class SopLink extends Component {
	constructor(props) {
		super(props);

        this.state = {
            selectedBuildingGroup: null,//this.props.buildingGroupList && this.props.buildingGroupList.length > 0 ? this.props.buildingGroupList[0] : null,
            selectedBuilding: null,
            selectedZone: null,
            selectedSensorType: null,//SDMSResource.facilityType.Conductivity,
            linkedSOPs: null,
            selectedNode: null
		}

        this.props = props;

        this.loadLinkedSOPs();
    }

    componentDidMount() {
        $('.link_div').click(function () {
            if ($(this).parent().next().css("display") == "none") {
                $(this).parent().next().show();
                $(this).children().children(".arrowIcon").css("transform", "rotate(90deg)");
            }
            else {
                $(this).parent().next().hide();
                $(this).children().children(".arrowIcon").css("transform", "rotate(0deg)");
            };
        });

        // 트리 기본 닫기 설정
        $('.link_div').parent().next().hide();
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
        if (!this.state.linkedSOPs || this.state.linkedSOPs.length == 0) {
            return;
        }

        let selectedBuildingGroupID = (this.state.selectedBuildingGroup) ? this.state.selectedBuildingGroup.id : null;
        let selectedBuildingID = (this.state.selectedBuilding) ? this.state.selectedBuilding.id : null;
        let selectedZoneID = (this.state.selectedZone) ? this.state.selectedZone.id : null;

        let moveToName = null;

        const linkLength = this.state.linkedSOPs.length;
        for (let i = 0; i < linkLength; i++) {
            const link = this.state.linkedSOPs[i];
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

    loadLinkedSOPs = async () => {
        // SOP Link 정보 가져오기
        let linkedSOPs = [];
        const [linkedSOPData, linkedSOPMessage] = await SopController.requestLinkedSOPs(this.props.selectedSiteID);
        if (linkedSOPData !== null && linkedSOPData !== undefined)
            linkedSOPs = linkedSOPData;

        this.setState({ linkedSOPs });
    }

    openSOPLinkClose = () => {
        this.props.openSOPLinkClose();
    }

    handleNodeClick = (nodeId) => {
        this.setState({ selectedNode: nodeId });
    };

    getSpatialUI() {
        let spatialUI = null;

        if (this.props.buildingGroupList?.length > 0) {
            // station 그룹만 조회
            let index = 0;
            let val = this.props.buildingGroupList[index];

            spatialUI = (
                <ul className={'sopTree'}>
                    <li key={'bg_' + index}>
                        <h5>
                            <div id={'rootLink'} className={'link_div' /*+ (this.state.selectedBuildingGroup === val ? 'on' : '')*/ + (this.state.selectedBuildingGroup === val && this.state.selectedBuilding === null && this.state.selectedZone === null ? ' treeSelect' : '')}>
                                <p className={'sFactoryText'} onClick={() => this.onClickSpatial(val, null, null)}><span className={'arrowIcon'}></span>{i18nUtil.convertText(val.displayText)}</p>
                            </div>
                        </h5>
                        <ul>
                            {
                                val.buildingDatas && val.buildingDatas.map((val2, index2) => (
                                    <li key={'b_' + index2}>
                                        <h5 style={{ height: '38px' }}>
                                            <div style={{ padding: '0px', border: 'none' }} className={'link_div' /*+ (this.state.selectedBuilding === val2 ? 'on' : '')*/ + (this.state.selectedBuilding === val2 && this.state.selectedZone === null ? ' treeSelect' : '')}>
                                                <p className={'sAreaText'} onClick={() => this.onClickSpatial(val, val2, null)}><span className={'arrowIcon'}></span>{i18nUtil.convertText(val2.displayText)}</p>
                                            </div>
                                        </h5>
                                        {
                                            <ul>
                                                {
                                                    val2.zoneDatas && val2.zoneDatas.map((val3, index3) => (
                                                        <li key={'z_' + index3}>
                                                            <h5 style={{ height: '38px' }}>
                                                                <div style={{ padding: '0px', border: 'none' }} className={(this.state.selectedZone === val3) ? 'treeSelect' : ''}>
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
                </ul>
            );
        } else {
            spatialUI = (
                <ul className={'sopTree'}>
                </ul>
            );
            
        }

        return spatialUI;

        
    }

    getSensorTypesUI() {
        return (
            this.props.sensorTypes && this.props.sensorTypes.map((val, index) => (        
                (this.state.selectedSensorType === val.id) ?
                    <li key={'sensorType_' + index} className={'treeSelect'} onClick={() => this.onClickSensorType(val.id)}><a>{i18nUtil.convertText(val.description)}</a></li>
                    : <li key={'sensorType_' + index} onClick={() => this.onClickSensorType(val.id)}><a>{i18nUtil.convertText(val.description)}</a></li>
                ))
            )
    }

    getDisasterUI() {
        let selectedBuildingGroupID = (this.state.selectedBuildingGroup) ? this.state.selectedBuildingGroup.id : null;
        let selectedBuildingID = (this.state.selectedBuilding) ? this.state.selectedBuilding.id : null;
        let selectedZoneID = (this.state.selectedZone) ? this.state.selectedZone.id : null;

        return (
            <ul className={'sopTree'}>
                {this.props.disasterCategories &&
                    this.props.disasterCategories.map((dc, index) => (
                        <li key={'dc_' + index}>
                            <h5 style={{ height: '38px' }}>
                                <div
                                    className={'link_div' + (this.state.selectedNode === `dc_${index}` ? ' treeSelect' : '')}
                                    onClick={() => this.handleNodeClick(`dc_${index}`)}
                                >
                                    <p className={'sFactoryText'}>
                                        <span className={'arrowIcon'}></span>
                                        {i18nUtil.convertText(dc.disasterCategory.categoryName)}
                                    </p>
                                </div>
                            </h5>
                            <ul>
                                {dc.subDisasterCategories &&
                                    dc.subDisasterCategories.map((sdc, index2) => (
                                        <li key={'sdc_' + index2}>
                                            <h5 style={{ height: '38px' }}>
                                                <div
                                                    className={'link_div' + (this.state.selectedNode === `sdc_${index}_${index2}` ? ' treeSelect' : '')}
                                                    style={{ padding: '0px', border: 'none' }}
                                                    onClick={() => this.handleNodeClick(`sdc_${index}_${index2}`)}
                                                >
                                                    <p className={'sAreaText'}>
                                                        <span className={'arrowIcon'}></span>
                                                        {i18nUtil.convertText(sdc.subDisasterCategory.subCategoryName)}
                                                    </p>
                                                </div>
                                            </h5>
                                            <ul>
                                                {sdc.disasterDatas &&
                                                    sdc.disasterDatas.map((d, index3) => (
                                                        <li key={'d_' + index3} id={`${dc.disasterCategory.id}/${sdc.subDisasterCategory.id}/${d.disasterName}`}>
                                                            <h5>
                                                                <div
                                                                    className={this.state.selectedNode === `d_${index}_${index2}_${index3}` ? 'treeSelect' : ''}
                                                                    style={{ padding: '0px', border: 'none' }}
                                                                    onClick={() => this.handleNodeClick(`d_${index}_${index2}_${index3}`)}
                                                                >
                                                                    <p
                                                                        className={'sFloorText'}
                                                                        onClick={() => this.onApply(dc.disasterCategory, sdc.subDisasterCategory, d.disasterName)}
                                                                    >
                                                                        <span className={'arrowIcon'}></span>
                                                                        <span className={'sDisaster'}>{i18nUtil.convertText(d.disasterName)}</span>
                                                                    </p>
                                                                    {this.state.linkedSOPs &&
                                                                        this.state.linkedSOPs.map((link, index4) =>
                                                                            link.disasterCategoryID === dc.disasterCategory.id &&
                                                                            link.subDisasterCategoryID === sdc.subDisasterCategory.id &&
                                                                            link.disasterName === d.disasterName &&
                                                                            link.facilityTypeID === this.state.selectedSensorType &&
                                                                            link.linkedBuildingGroupID === selectedBuildingGroupID &&
                                                                            link.linkedBuildingID === selectedBuildingID &&
                                                                            link.linkedZoneID === selectedZoneID ? (
                                                                                <span className="applyIcon" key={index4} />
                                                                            ) : null
                                                                        )}
                                                                </div>
                                                            </h5>
                                                        </li>
                                                    ))}
                                            </ul>
                                        </li>
                                    ))}
                            </ul>
                        </li>
                    ))}
            </ul>
        );
    }

    getLinkedSopDataUI() {
        let list = [];

        if (this.state.linkedSOPs && this.state.linkedSOPs?.length > 0) {
            for (let index = 0; index < this.state.linkedSOPs.length; index++) {
                const val = this.state.linkedSOPs[index];

                let zoneName = val.zoneName;

                if (!zoneName || zoneName?.length < 1) {
                    zoneName = "-";
                }
                else {
                    let arrZone = zoneName.split("/");

                    for (let i = 0; i < arrZone.length; i++) {
                        if (i === 0) {
                            zoneName = i18nUtil.convertText(arrZone[i]);
                        }
                        else {
                            zoneName += "/" + i18nUtil.convertText(arrZone[i]);
                        }
                    }
                }

                list.push(
                    <li key={'linkedSOP' + index}>
                        <div>{index + 1}</div>
                        <div>{zoneName}</div>
                        <div>{i18nUtil.convertText(val.facilityTypeName)}</div>
                        <div>{i18nUtil.convertText(val.categoryName)}</div>
                        <div>{i18nUtil.convertText(val.subCategoryName)}</div>
                        <div>{i18nUtil.convertText(val.disasterName)}</div>
                        <div><span className={'binIcon'} onClick={() => this.onClickRemoveLink(index)}></span></div>
                    </li>
                );
            }
        }

        return (
            <ul>
                {list}
            </ul>
        );
    }

    onClickSpatial = (buildingGroup, building, zone) => {
        if (this.state.selectedBuildingGroup === buildingGroup && this.state.selectedBuilding === building && this.state.selectedZone === zone) {
            this.setState({ selectedBuildingGroup: null, selectedBuilding: null, selectedZone: null });
            //if (zone !== null) {
            //    this.setState({ selectedZone: null });
            //}
            //else if (building !== null) {
            //    this.setState({ selectedBuilding: null, selectedZone: null });
            //}
            //else {
            //    this.setState({ selectedBuildingGroup: null, selectedBuilding: null, selectedZone: null });
            //}
            
            return;
        }

        this.setState({ selectedBuildingGroup: buildingGroup, selectedBuilding: building, selectedZone: zone });
    }

    onClickSensorType = (sensorType) => {
        if (this.state.selectedSensorType === sensorType) {
            return;
        }

        //this.setScrollbar();

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

        let linkedSOPs = this.state.linkedSOPs;

        const selectedBuildingID = (this.state.selectedBuilding) ? this.state.selectedBuilding.id : null;
        const selectedZoneID = (this.state.selectedZone) ? this.state.selectedZone.id : null;

        const linkedCount = linkedSOPs.length;
        for (let i = 0; i < linkedCount; i++) {
            const linkedSOP = this.state.linkedSOPs[i];
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

                        //this.props.updateLinkedSops(linkedSOPs);
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

                        //this.props.updateLinkedSops(linkedSOPs);
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
        //this.props.updateLinkedSops(linkedSOPs);
        this.setState({ linkedSOPs });
    }

    onClickRemoveLink = (index) => {
        let linkedSOPs = this.state.linkedSOPs;
        linkedSOPs.splice(index, 1);
        //this.props.updateLinkedSops(linkedSOPs);
        this.setState({ linkedSOPs });
    }

    onClickSave = async () => {
        const [success, message] = await SopController.requestSaveLinkedSops(this.state.linkedSOPs, this.props.selectedSiteID);
        if (success === null) {
            // 저장이 끝남 상태변화
            this.state.isSaving = false;

            this.props.showConfirmDialog(i18n.t('common.오류'), [message], null, null);
            return;
        }
        else {
            await this.loadLinkedSOPs();

            this.props.showConfirmDialog(i18n.t('common.확인'), [i18n.t('msg.저장되었습니다')], [i18n.t('common.확인')], null);
        }
    }

    onClickClear = async () => {
        const [success, message] = await SopController.requestClearLinkedSops();

        if (success === null) {
            // 저장이 끝남 상태변화
            this.props.showConfirmDialog(i18n.t('common.오류'), [message], null, null);
            return;
        }
        else {
            await this.loadLinkedSOPs();

            this.props.showConfirmDialog(i18n.t('common.확인'), [i18n.t('setting.sopLink.초기화 되었습니다')], [i18n.t('common.확인')], null);
        }
    }

    render() {
        const spatialUI = this.getSpatialUI();
        const sensorTypesUI = this.getSensorTypesUI();
        const disasterUI = this.getDisasterUI();
        const linkedSopDataUI = this.getLinkedSopDataUI();

        //let zoneName = '';
        //if (this.state.selectedBuildingGroup) {
        //    zoneName = (this.state.selectedBuildingGroup.displayText) ? i18nUtil.convertText(this.state.selectedBuildingGroup.displayText) : i18nUtil.convertText(this.state.selectedBuildingGroup.groupName);
        //}
        //if (this.state.selectedBuilding) {
        //    zoneName += "/" + (this.state.selectedBuilding.displayText) ? i18nUtil.convertText(this.state.selectedBuilding.displayText) : i18nUtil.convertText(this.state.selectedBuilding.buildingName);
        //}
        //if (this.state.selectedZone) {
        //    zoneName += "/" + (this.state.selectedZone.displayText) ? i18nUtil.convertText(this.state.selectedZone.displayText) : i18nUtil.convertText(this.state.selectedZone.zoneName);
        //}

		return (
            <>
                <ModalBackgroundSOPLink>
                    <SopLinkComponent>
                        {/* <div className={'stgListBack'}> */}
                            <div className={'stgList'}>
                                <span /* className={'stgScroll'} */>
                                <span className={'stgConnectText'}>{i18n.t('setting.sopLink.SOP 연결')}</span>
                                    <button onClick={this.openSOPLinkClose} className='closeBtn'>
                                        <img src={close_btn} alt='닫기 버튼' width={24} height={24} />
                                    </button>
                                    <div className={'sopTreeArea'}>
                                        <div className={'sopTypeBox'}>
                                        <span className={'sopDisableText' + " " + 'sopActiveText'}>{i18n.t('setting.sopLink.센서 유형')}</span>
                                            <div className={'sopLTree' + " " + 'sopScroll'}>
                                                <ul className={'sensorTypeTab'}>
                                                  {/* {sensorTypesUI} */}

                                                {/*<li className={(this.state.selectedSensorType === SDMSResource.facilityType.Conductivity ? 'treeSelect' : '')} onClick={() => this.onClickSensorType(SDMSResource.facilityType.Conductivity)}><a>{i18n.t('facilityType.전도도')}</a></li>*/}
                                                <li className={(this.state.selectedSensorType === SDMSResource.facilityType.Flow ? 'treeSelect' : '')} onClick={() => this.onClickSensorType(SDMSResource.facilityType.Flow)}><a>{i18n.t('facilityType.유량')}</a></li>
                                                {/*<li className={(this.state.selectedSensorType === SDMSResource.facilityType.GAS ? 'treeSelect' : '')} onClick={() => this.onClickSensorType(SDMSResource.facilityType.GAS)}><a>{i18n.t('facilityType.가스')}</a></li>*/}
                                                <li className={(this.state.selectedSensorType === SDMSResource.facilityType.H2 ? 'treeSelect' : '')} onClick={() => this.onClickSensorType(SDMSResource.facilityType.H2)}><a>{i18n.t('facilityType.고농도수소')}</a></li>
                                                <li className={(this.state.selectedSensorType === SDMSResource.facilityType.H2Low_Senko ? 'treeSelect' : '')} onClick={() => this.onClickSensorType(SDMSResource.facilityType.H2Low_Senko)}><a>{i18n.t('facilityType.저농도수소')}</a></li>
                                                <li className={(this.state.selectedSensorType === SDMSResource.facilityType.O2_Senko ? 'treeSelect' : '')} onClick={() => this.onClickSensorType(SDMSResource.facilityType.O2_Senko)}><a>{i18n.t('facilityType.산소')}</a></li>
                                                <li className={(this.state.selectedSensorType === SDMSResource.facilityType.PRESSURE_SENSOR ? 'treeSelect' : '')} onClick={() => this.onClickSensorType(SDMSResource.facilityType.PRESSURE_SENSOR)}><a>{i18n.t('facilityType.압력')}</a></li>
                                                <li className={(this.state.selectedSensorType === SDMSResource.facilityType.Temp ? 'treeSelect' : '')} onClick={() => this.onClickSensorType(SDMSResource.facilityType.Temp)}><a>{i18n.t('facilityType.온도')}</a></li>

                                                <li className={(this.state.selectedSensorType === SDMSResource.facilityType.H2JAG ? 'treeSelect' : '')} onClick={() => this.onClickSensorType(SDMSResource.facilityType.H2JAG)}><a>{i18n.t('facilityType.수소가스')}</a></li>
                                                <li className={(this.state.selectedSensorType === SDMSResource.facilityType.O2JAG ? 'treeSelect' : '')} onClick={() => this.onClickSensorType(SDMSResource.facilityType.O2JAG)}><a>{i18n.t('facilityType.산소가스')}</a></li>

                                                </ul>
                                            </div>
                                        </div>
                                        <div className={'sopLocationBox'}>
                                            <span className={'sopDisableText' + " " + 'sopActiveText'}>
                                            <span className={'sopLocationTitleHydrogen'}>{i18n.t('setting.sopLink.위치')}</span>
                                            </span>
                                            <div className={'sopLTree' + " " + 'sopScroll'}>
                                                {spatialUI}
                                            </div> 
                                        </div> 
                                        <div className={'sopListBox'}>
                                            <span className={'sopDisableTextF'}>
                                            <span className={'sopListFlex'}>{i18n.t('setting.sopLink.SOP목록 (재난분야/재난종류/SOP이름)')}</span>
                                            </span>
                                            <div className={'sopLTree' + " " + 'sopScroll'}>
                                                {disasterUI} 
                                            </div> 
                                        </div>
                                    </div>  
                                    <div className={'sopLinkListArea'}>
                                        <ul className={'sopLinkList sopLink'}>
                                            <li className={'head'}>
                                                <div style={{ width: "4%" }}>No</div>
                                            <div style={{ width: "22%" }}>{i18n.t('setting.sopLink.위치')}{/*<button className={'sort_icon'}></button>*/}</div>
                                            <div style={{ width: "15%" }}>{i18n.t('setting.sopLink.발생 유형')}{/*<button className={'sort_icon'}></button>*/}</div>
                                            <div style={{ width: "15%" }}>{i18n.t('setting.sopLink.상황 분야')}{/*<button className={'sort_icon'}></button>*/}</div>
                                            <div style={{ width: "20%" }}>{i18n.t('setting.sopLink.상황 종류')}{/*<button className={'ascending_icon'}></button>*/}</div>
                                            <div style={{ width: "20%" }}>{i18n.t('setting.sopLink.SOP 이름')}</div>
                                            <div style={{ width: "4%" }}>{i18n.t('setting.sopLink.삭제')}</div>
                                            </li>
                                        </ul>
                                        <li className={'body'}>
                                            {linkedSopDataUI}
                                        </li>
                                    </div> 
                                </span>
                            </div> 
                        {/* </div> */}

                        <div className='btnWrap sopLink'>
                            <button className='cancle' onClick={() => this.onClickClear()}>{i18n.t('setting.sopLink.초기화')}</button>
                            <button className='submit' onClick={() => this.onClickSave()}>{i18n.t('setting.sopLink.저장')}</button>
                        </div>
                    </SopLinkComponent>
                </ModalBackgroundSOPLink> 
            </>
			);
    }
}


export default withTranslation()(SopLink);