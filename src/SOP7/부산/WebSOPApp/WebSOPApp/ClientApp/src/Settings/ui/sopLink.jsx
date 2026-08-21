import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { SopLinkComponent } from '../styled/settingsStyled';
import { ModalBackground } from '../../Root/styled/theme';
import close_btn from '../../Common/images/close_btn.png';
import binIcon from '../images/binIcon.svg';
import {SDMSController} from "../../SDMS/services/sdmsController";
import SdmsResource from "../../SDMS/resource/id";
import SopSimulatorResource from "../../SOPSimulator/resource/id";
import ProjectResource from "../../Root/resource/id";
import SettingsController from "../services/settingsController";


class SopLink extends Component {
	constructor(props) {
		super(props);

        this.props = props;
        
        this.state = {
            linkedSOPs: null,
            
            settings: null,
            disasterCategories: null,
            buildingGroupList: null,
            teamTreeData: null,
            teams: null,
            members: null,
            externalSensors: null,
            externalSensorTypes: null,
            
            // 선택영역
            selectedSensorType: null,
            selectedBuildingGroupID: null,
            selectedBuildingID: null,
            selectedZoneID: null,
            selectedDisasterCategoryID: null,
            selectedSubDisasterCategoryID: null,
            selectedDisasterDataID: null,
		}
        
        this.isMount = true;
    }

    componentDidMount() {
        this.init();
    }
    
    componentWillUnmount() {
        this.isMount = false;
    }
    
    _setState = (state, callback) => {
        if (this.isMount) {
            this.setState(state, callback);
        }
    }
    
    init = async () => {
        const parentProps = this.props.parentProps;
        
        if (!parentProps) {
            return;
        }
        
        this._setState({ 
            linkedSOPs: this.props.linkedSOPs,
            disasterCategories: parentProps.disasterCategories,
            settings: parentProps.settings,
            buildingGroupList: parentProps.buildingGroupList,
            teamTreeData: parentProps.teamTreeData,
            teams: parentProps.teams,
            members: parentProps.members,
            externalSensors: parentProps.externalSensors,
            externalSensorTypes: parentProps.externalSensorTypes,
        })
    }
    
    onClickBuilding = (buildingID) => {
        
        if (this.state.selectedBuildingID === buildingID) {
            this._setState({selectedBuildingID: null, selectedZoneID: null});
            return;
        }
        
        this._setState({ selectedBuildingID: buildingID, selectedZoneID: buildingID });
    }

    onClickBuildingGroup = (buildingGroupID) => {
        let ulElement = document.getElementById(buildingGroupID + "_ul_depth1");
        let divElement = document.getElementById(buildingGroupID + "_div_depth1");
        
        if (buildingGroupID === this.state.selectedBuildingGroupID) {
            let ulClassName = ulElement.className;
            let divClassName = divElement.className;
            
            if (ulClassName.includes('on') && divClassName.includes('on')) {
                ulElement.className = ulElement.className.replace('on', '');
                divElement.className = divElement.className.replace(' on', '');
            }
            
            this._setState({ selectedBuildingGroupID: null });
        } else {
            let ulClassName = ulElement.className;
            let divClassName = divElement.className;
            
            if (!ulClassName.includes('on') && !divClassName.includes('on')) {
                ulElement.className = ulElement.className + 'on';
                divElement.className = divElement.className + ' on';
            }
            
            this._setState({ selectedBuildingGroupID: buildingGroupID });
        }
    }
    
    getBuildingUI = () => {
        const buildingGroupList = this.state.buildingGroupList;
        const externalSensors = this.state.externalSensors;
        
        if (!buildingGroupList || !externalSensors) {
            return;
        }
        
        let buildingGroupListUI = [];
        
        for (let i = 0; i < buildingGroupList.length; i++) {
            const buildingGroup = buildingGroupList[i];
            const buildingDatas = buildingGroup.buildingDatas;
            
            let buildingsUI = [];
            
            for (let j = 0; j < buildingDatas.length; j++) {
                const buildingData = buildingDatas[j];
                
                const sensor = externalSensors.find(sensor => sensor.zoneID === buildingData.id); // 부산은 zoneID = buildingID
                
                if (!sensor) {
                    continue; // 센서가 없는 건물은 제외 처리 - 저감 배출 설비는 아직 센서 없음
                }
                
                if (!this.getValidSensorType(sensor.sensorType)) {
                    continue;
                }

                let depth2ClassName = 'buildingTxt depth2';
                if (buildingData.id === this.state.selectedBuildingID) {
                    depth2ClassName += ' on';
                }
                    
                let buildingElement = (
                    <li>
                        <div id={buildingData.id + "_depth2"} className={depth2ClassName} onClick={() => this.onClickBuilding(buildingData.id)}>
                            <h2>{buildingData?.buildingName}</h2>
                        </div>
                    </li>
                );
                
                buildingsUI.push(buildingElement);
            }
            
            let buildingGroupElement = (
                <li>
                    <div id={buildingGroup.id + "_div_depth1"} className={'depth1'} onClick={() => this.onClickBuildingGroup(buildingGroup.id)}>
                        <h2>{buildingGroup?.groupName}</h2>
                    </div>
                    <ul id={buildingGroup.id + "_ul_depth1"}> {/* className='on' */}
                        {buildingsUI}
                    </ul>
                </li>
            );

            buildingGroupListUI.push(buildingGroupElement);
        }

        return buildingGroupListUI;

    }
    
    getValidSensorType = (sensorType) => {
        
        const selectedSensorType = this.state.selectedSensorType;
        
        if (selectedSensorType === SopSimulatorResource.SensorType.entire || !selectedSensorType) {
            return true;
        }
        
        if (selectedSensorType === SopSimulatorResource.SensorType.atmosphere) {
            // 현재 검사중인 센서가 대기오염 센서인지 확인
            return sensorType === SdmsResource.SensorType.atmosphere ||
                sensorType === SdmsResource.SensorType.kWeather;
        } else if (selectedSensorType === SopSimulatorResource.SensorType.electricity) {
            return sensorType === SopSimulatorResource.SensorType.electricity
        }
        
        return false;
    }
    
    onChangeSensorType = (sensorType) => {
        
        if (this.state.selectedSensorType === sensorType) {
            this._setState({ selectedSensorType: null });
            return;
        }
        
        if (this.state.selectedBuildingGroupID) {
            this.onClickBuildingGroup(this.state.selectedBuildingGroupID); // 선택된 건물 그룹 해제
        }
        
        this._setState({ selectedSensorType: sensorType, selectedBuildingID: null, selectedZoneID: null });
    }
    
    getSensorTypeUI = () => {
        
        let entireClassName = 'sensorTxt';
        let atmosphereClassName = 'sensorTxt';
        let electricityClassName = 'sensorTxt';
        
        if (this.state.selectedSensorType === SopSimulatorResource.SensorType.entire) {
            entireClassName += ' on';
        }
        
        if (this.state.selectedSensorType === SopSimulatorResource.SensorType.atmosphere) {
            atmosphereClassName += ' on';
        }
        
        if (this.state.selectedSensorType === SopSimulatorResource.SensorType.electricity) {
            electricityClassName += ' on';
        }
        
        return (
            <ul className='sopTree'>
                <li>
                    <div id={'sensorType_' + SopSimulatorResource.SensorType.entire} className={entireClassName}
                         onClick={() => this.onChangeSensorType(SopSimulatorResource.SensorType.entire)}>전체
                    </div>
                </li>
                <li>
                    <div id={'sensorType_' + SopSimulatorResource.SensorType.atmosphere} className={atmosphereClassName}
                         onClick={() => this.onChangeSensorType(SopSimulatorResource.SensorType.atmosphere)}>대기유해물질 센서
                    </div>
                </li>
                <li>
                    <div id={'sensorType_' + SopSimulatorResource.SensorType.electricity} className={electricityClassName}
                        onClick={() => this.onChangeSensorType(SopSimulatorResource.SensorType.electricity)}>전류CT센서
                    </div>
                </li>
            </ul>
        );
    }
    
    getDisasterUI = () => {
        
        const disasterCategories = this.state.disasterCategories;
        if (!disasterCategories) {
            return;
        }
        
        let disasterCategoryUI = [];
        
        for (let i = 0; i < disasterCategories.length; i++) {
            const disasterCategory = disasterCategories[i];
            
            let depth1DivClassName = 'depth1';
            let depth1UlClassName = '';
            if (disasterCategory.disasterCategory.id === this.state.selectedDisasterCategoryID) {
                depth1DivClassName += ' on';
                depth1UlClassName = 'on';
            }

            let element = (
                <li>
                    <div className={depth1DivClassName} onClick={() => this.onClickDisasterCategory(disasterCategory)}>
                        <h2>{disasterCategory?.disasterCategory.categoryName}</h2>
                    </div>
                    <ul className={depth1UlClassName}>
                        {this.getSubDisasterCategoryUI(disasterCategory)}
                    </ul>
                </li>
            );
            disasterCategoryUI.push(element);
        }
        return disasterCategoryUI;
    }
    
    getSubDisasterCategoryUI = (disasterCategory) => {
        const subDisasterCategories = disasterCategory.subDisasterCategories;
        let subDisasterCategoryUI = [];
        for (let i = 0; i < subDisasterCategories.length; i++) {
            const subDisasterCategory = subDisasterCategories[i];

            let depth2DivClassName = 'depth2';
            let depth2UlClassName = '';
            if (subDisasterCategory.subDisasterCategory.id === this.state.selectedSubDisasterCategoryID) {
                depth2DivClassName += ' on';
                depth2UlClassName = 'on';
            }

            let subDisasterCategoryElement = (
                <li>
                    <div className={depth2DivClassName} onClick={() => this.onClickSubDisasterCategory(subDisasterCategory)}>
                        <h2>{subDisasterCategory?.subDisasterCategory.subCategoryName}</h2>
                    </div>
                    <ul className={depth2UlClassName}>
                        {this.getDisasterDataUI(subDisasterCategory, disasterCategory)}
                    </ul>
                </li>
            );
            subDisasterCategoryUI.push(subDisasterCategoryElement);
        }
        
        return subDisasterCategoryUI;
    }
    
    getDisasterDataUI = (subDisasterCategory, disasterCategory) => {
        const disasterData = subDisasterCategory.disasterDatas;
        
        let disasterDataUI = [];
        let linkedSOPs = this.state.linkedSOPs;
        let linkedCount = linkedSOPs.length;
        
        for (let i = 0; i < disasterData.length; i++) {
            const data = disasterData[i];

            let depth3DivClassName = 'depth3';
            for (let l = 0; l < linkedCount; l++) {
                const linkedSOP = linkedSOPs[l];

                if (linkedSOP.disasterCategoryID === disasterCategory.disasterCategory.id &&
                    linkedSOP.subDisasterCategoryID === subDisasterCategory.subDisasterCategory.id &&
                    linkedSOP.linkedBuildingID === this.state.selectedBuildingID &&
                    data.disasterName === linkedSOP.disasterName) {
                    depth3DivClassName += ' selected';
                    break;
                }
            }

            let disasterDataElement = (
                <li>
                    <div className={depth3DivClassName} onClick={() => this.onClickDisasterData(disasterCategory, subDisasterCategory, data)}>
                        <h2>{data?.disasterName}</h2>
                    </div>
                </li>
            );
            disasterDataUI.push(disasterDataElement);
        }
        
        return disasterDataUI;
    }
    
    onClickDisasterCategory = (disasterCategory) => {
        if (!disasterCategory) {
            return;
        }
        const disasterCategoryID = disasterCategory.disasterCategory.id;
        
        if (this.state.selectedDisasterCategoryID === disasterCategoryID) {
            this.setState({ selectedDisasterCategoryID: null, selectedSubDisasterCategoryID: null });
            return;
        }
        
        this.setState({ selectedDisasterCategoryID: disasterCategoryID });
    }
    
    onClickSubDisasterCategory = (subDisasterCategory) => {
        
        if (!subDisasterCategory) {
            return;
        }
        
        if (this.state.selectedSubDisasterCategoryID === subDisasterCategory.subDisasterCategory.id) {
            this.setState({ selectedSubDisasterCategoryID: null });
            return;
        }
        
        const subDisasterCategoryID = subDisasterCategory.subDisasterCategory.id;
        
        this.setState({ selectedSubDisasterCategoryID: subDisasterCategoryID });
    }
    
    onClickDisasterData = (disasterCategory, subDisasterCategory, disasterData) => {

        let linkedSOPs = [];
        
        if (this.state.linkedSOPs || this.state.linkedSOPs.length > 0) {
            linkedSOPs = [...this.state.linkedSOPs]
        }
        
        const selectedBuildingID = this.state.selectedBuildingID ? this.state.selectedBuildingID : null;
        if (selectedBuildingID === null) {
            this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["센서를 선택해주세요."], ["확인"], this.props.onCloseConfirmDialog);
            return;
        }
        
        const linkedCount = linkedSOPs.length;
        
        for (let i = 0; i < linkedCount; i++) {
            const linkedSOP = linkedSOPs[i];

            if (selectedBuildingID === linkedSOP.linkedBuildingID) {
                this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["이미 연동이 완료된 센서입니다. 삭제 후 다시 시도해주세요."], ["확인"], this.props.onCloseConfirmDialog);
                return;
            }
        }
        
        let sopData = {};
        sopData.id = -1;
        sopData.facilityTypeID = SdmsResource.facilityType.ETC
        sopData.disasterCategoryID = disasterCategory.disasterCategory.id;
        sopData.subDisasterCategoryID = subDisasterCategory.subDisasterCategory.id;
        sopData.linkedBuildingID = selectedBuildingID;
        sopData.linkedZoneID = selectedBuildingID;
        
        sopData.description = null;
        sopData.disasterName = disasterData.disasterName;
        
        linkedSOPs.push(sopData);
        
        // props로 처리해야 할듯
        
        this.setState({ selectedDisasterDataID: disasterData.id, linkedSOPs: linkedSOPs });
    }
    
    getLinkedSOPDataUI = () => {
        
        const linkedSOPs = this.state.linkedSOPs;
        if (!linkedSOPs) {
            return;
        }
        
        const disasterCategories = this.state.disasterCategories;
        const externalSensors = this.state.externalSensors;
        if (!disasterCategories || !externalSensors) {
            return;
        }
        
        let linkedSOPDataUI = [];
        
        for (let i = 0; i < linkedSOPs.length; i++) {
            const linkedSOP = linkedSOPs[i];
            
            const disasterCategory = disasterCategories.find(disasterCategory => disasterCategory.disasterCategory.id === linkedSOP.disasterCategoryID);
            const subDisasterCategory = disasterCategory.subDisasterCategories.find(subDisasterCategory => subDisasterCategory.subDisasterCategory.id === linkedSOP.subDisasterCategoryID);
            
            console.log(disasterCategory);
            
            const sensor = externalSensors.find(sensor => sensor.zoneID === linkedSOP.linkedZoneID); // 부산은 zoneID = buildingID
            
            if (!sensor) {
                continue; // 센서가 없는 건물은 제외 처리 - 저감 배출 설비는 아직 센서 없음
            }
            
            let strSensorType = '';
            if (sensor.sensorType === SdmsResource.SensorType.atmosphere || sensor.sensorType === SdmsResource.SensorType.kWeather) {
                strSensorType = '대기유해물질 센서';
            } else if (sensor.sensorType === SdmsResource.SensorType.electricity || sensor.sensorType === SdmsResource.SensorType.electricity) {
                strSensorType = '전류CT센서';
            }
            
            let element = (
                <li>
                    <div>{i + 1}</div> 
                    <div>{strSensorType}</div>
                    <div>{sensor.name}</div>
                    <div>{disasterCategory.disasterCategory.categoryName}</div>
                    <div>{subDisasterCategory.subDisasterCategory.subCategoryName}</div>
                    <div>{linkedSOP.disasterName}</div>
                    <div>
                        <button className={'binIcon'} onClick={() => this.deleteLinkedSOP(i)}>
                            <img src={binIcon} alt='삭제 아이콘'/>
                        </button>
                    </div>
                </li>
            );
            linkedSOPDataUI.push(element);
        }
        
        return linkedSOPDataUI;
    }
    
    deleteLinkedSOP = (index) => {
        const linkedSOPs = this.state.linkedSOPs;
        const modifiedLinkedSOPs = linkedSOPs.splice(index, 1);
        this.setState({ linkedSOPs: modifiedLinkedSOPs });
    }
    
    doSave = async () => {
        const linkedSOPs = this.state.linkedSOPs;
        
        if (!linkedSOPs) {
            return;
        }
        
        let linkedSOPOld = [];
        if (this.props.linkedSOPs) {
            linkedSOPOld = this.props.linkedSOPs;
        }
        
        let addLinkedSOP = [];
        let updateLinkedSOP = [];
        
        for (let i = 0; i < linkedSOPs.length; i++) {
            const linkedSOP = linkedSOPs[i];
            let chk = false;
            
            for (let j = 0; j < linkedSOPOld.length; j++) {
                const sopOld = linkedSOPOld[j];

                if (linkedSOP.facilityTypeID === sopOld.facilityTypeID &&
                    (linkedSOP.linkedBuildingID === sopOld.linkedBuildingID || ((linkedSOP.linkedBuildingID === 0 || linkedSOP.linkedBuildingID === -1) && (sopOld.linkedBuildingID === 0 || sopOld.linkedBuildingID === -1))) &&
                    (linkedSOP.linkedZoneID === sopOld.linkedZoneID || ((linkedSOP.linkedZoneID === 0 || linkedSOP.linkedZoneID === -1) && (sopOld.linkedZoneID === 0 || sopOld.linkedZoneID === -1)))) {
                    chk = true;

                    if (linkedSOP.disasterCategoryID !== sopOld.disasterCategoryID ||
                        linkedSOP.subDisasterCategoryID !== sopOld.subDisasterCategoryID ||
                        linkedSOP.disasterName !== sopOld.disasterName) {

                        linkedSOP.SiteID = ProjectResource.Site.Yeosu;

                        updateLinkedSOP.push(linkedSOP);
                    }

                    linkedSOPOld.splice(j, 1);
                    break;
                }
            }
            
            if (!chk) {
                linkedSOP.siteID = ProjectResource.Site.Busan;
                addLinkedSOP.push(linkedSOP);
            }
        }
        
        const [success, message] = await SettingsController.requestUpdateLinkedSOPs(addLinkedSOP, updateLinkedSOP, linkedSOPOld);
        
        if (!success)
            this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["저장에 실패하였습니다. [Error Message] : " + message], ["확인"], this.props.onCloseConfirmDialog);
        else 
            this.props.showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, ["저장되었습니다."], ["확인"], this.props.onCloseConfirmDialog);
        
        this.props.applyLinkedSOPs(linkedSOPs);
    }
    
    resetLinkedSOPs = () => {
        const originLinkedSOPs = this.props.linkedSOPs;
        this.setState({ linkedSOPs: originLinkedSOPs });
    }

    render() {

        const buildingUI = this.getBuildingUI();
        const sensorTypeUI = this.getSensorTypeUI();
        const disasterUI = this.getDisasterUI();
        const linkedSOPDataUI = this.getLinkedSOPDataUI();

        return (
            <ModalBackground>
                <SopLinkComponent>
                    <div className='listWrap'>
                        <h5>이벤트 발생 시 실행 SOP 설정</h5>
                        <button onClick={() => this.props.handlePopup(false)} className='closeBtn'>
                            <img src={close_btn} alt='닫기 버튼' width={16} height={16}/>
                        </button>
                    </div>

                    <div className='stgList'>

                        <div className='sopTreeArea'>
                            <div className='sopTreeBox sopTypeBox'>
                                <span className='sopDisableText sopActiveText'>센서유형 : </span>
                                <div className='sopLTree sopScroll'>
                                    <ul className='sopTree'>
                                        {sensorTypeUI}
                                    </ul>
                                </div>
                            </div>
                            <div className='sopTreeBox sopLocationBox'>
                                <span className='sopDisableText sopActiveText'>
                                    위치 : <span>{/*zoneName*/}</span>
                                </span>
                                <div className='sopLTree sopScroll'>
                                    {/* 데이터 가져온 후 ui 다시 잡을 것 */}
                                    <ul className={'sopTree'}>
                                        {buildingUI}
                                    </ul>
                                </div>
                            </div>
                            <div className='sopTreeBox sopListBox'>
                            <span className='sopDisableTextF'>
                                <span className='sopListFlex'>SOP 목록 (상황분야 &gt; 상황종류 &gt; SOP 이름)</span>
                                <span className='editIcon'></span>
                            </span>
                                <div className='sopLTree sopScroll'>
                                    {/* {disasterUI} */}
                                    <ul className={'sopTree'}>
                                        {disasterUI}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className='sopListArea'>
                            <ul className='sopList'>
                                <li className='head'>
                                    <div>NO</div>
                                    <div>
                                        <div className='sort'>
                                            <span>센서유형</span>
                                            <button className='sortBtn az'/>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='sort'>
                                            <span>위치</span>
                                            <button className='sortBtn az'/>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='sort'>
                                            <span>상황분야</span>
                                            <button className='sortBtn az'/>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='sort'>
                                            <span>상황종류</span>
                                            {/*
                                            className='az' -> 가나다라 순
                                            className='za' -> 역순
                                        */}
                                            <button className='sortBtn za'/>
                                        </div>
                                    </div>
                                    <div>SOP 이름</div>
                                    <div>삭제</div>
                                </li>
                                {/* {linkedSopDataUI} */}
                                <li className='body'>
                                    <ul>
                                        {linkedSOPDataUI}
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className='btnWrap sopLink'>
                        <button className='cancle' onClick={() => this.resetLinkedSOPs()}>초기화</button>
                        <button className='submit' onClick={() => this.doSave()}>적용</button>
                    </div>
                </SopLinkComponent>
            </ModalBackground>
        );
    }
}

export default withRouter(SopLink);