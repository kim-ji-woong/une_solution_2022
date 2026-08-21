import React, { Component } from 'react';

import { ModalBackground } from '../../../Root/styled/theme';
import { InitialSituationManagementComponent, EditReceiverComponent } from '../../styled/sdmsPopupsStyled';

import close_btn from '../../../Common/images/close_btn.png';
import tooltip_icon from '../../../Settings/images/tooltip-icon.png';
import binIcon from '../../../Settings/images/binIcon.svg';
import TeamEditorResource from "../../../TeamEditor/resource/id";
import {TeamEditController} from "../../../TeamEditor/services/teamEditController";
import {SettingsController} from "../../../Settings/services/settingsController";
import ProjectResource from "../../../Root/resource/id";
import {SDMSController} from "../../services/sdmsController";
import SettingsResource from "../../../Settings/resource/id";
import SdmsResource from "../../resource/id";

class InitialSituationManagement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showEditReceiver: false,

            buildingList: [],
            messageType: SettingsResource.messageType.sms,
            message: "",
            receiver: "",
            selectPopupOnOff: false,
            selectFacilityType: "21",			// 전파 대상자지정 팝업창 전달용 인자
            selectBuildingGroup: "1",			// 전파 대상자지정 팝업창 전달용 인자
            selectBuilding: "",					// 전파 대상자지정 팝업창 전달용 인자
            selectRegularID: null,				// 전파 대상자지정 팝업창 전달용 인자
            selectRegularMemberID: null,		// 전파 대상자지정 팝업창 전달용 인자
            
            selectedRegularID: null,
            
            selectedSensorType: SdmsResource.SensorType.entire,
            
            buildingGroupList: null,
            teamTreeData: null,
            teams: null,
            members: null,

            spreadMessages: null,
            originSpreadMessages: null,
            
            receivers: [],
            
            isChangedSensorType: false,
            
            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null
            }
            
        }
        
        this.initTeamData();
        this.initSpreadMessage();
    }
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.selectBuilding !== this.state.selectBuilding) {
            this.changeReceiverList();
        }
    }

    initSpreadMessage = async () => {
        const [spreadResult, spreadMessage] = await SettingsController.requestGetSpreadMessage();
        
        if (spreadResult !== null && spreadResult !== undefined) {
            let receivers = null;

            for (let i = 0; i < spreadResult.length; i++) {
                const message = spreadResult[i];
                if (!message.buildingID) {
                    receivers = message.regularMemberID;
                    break;
                }
            }
            
            this.setState({spreadMessages: spreadResult, originSpreadMessages: spreadResult, receivers});
        }
    }
    initTeamData = async () => {
        
        let userInfo = await ProjectResource.initUserInfo();
        if (userInfo === null || userInfo === undefined) {
            return;
        }
        
        const siteID = ProjectResource.Site.Busan;
        
        const [buildingGroupListData, outdoorZones, errorMessage] = await SDMSController.requestBuildingGroupList();
        let buildingGroupList = [];
        
        if (buildingGroupListData !== null && buildingGroupListData !== undefined) {
            buildingGroupList = buildingGroupListData;
        }

        let spreadMessages = [];
        const [spreadResult, spreadMessage] = await SettingsController.requestGetSpreadMessage();
        if (spreadResult !== null && spreadResult !== undefined)
            spreadMessages = spreadResult;
        
        const teamTreeData = await TeamEditController.DisplayRegular();
        const teams = await TeamEditController.GetRegular();
        const members = await TeamEditController.DisplayRegularMember();
        

        this.setState({ teamTreeData, teams, members, spreadMessages, buildingGroupList });
    }
    
    changeReceiverList = () => {
        const buildingID = this.state.selectBuilding;
        const spreadMessages = this.state.spreadMessages;
        
        let receiver = [];
        
        if (!buildingID || parseInt(buildingID) === 0) {
            for (let i = 0; i < spreadMessages.length; i++) {
                const message = spreadMessages[i];
                if (!message.buildingID) {
                    receiver = message.regularMemberID;
                }
            }
        } else {
            for (let i = 0; i < spreadMessages.length; i++) {
                const message = spreadMessages[i];
                if (message.buildingID === parseInt(buildingID)) {
                    receiver = message.regularMemberID;
                }
            }
        }
        
        this.setState({ receivers: receiver });
    }
    
    handlePopup = (value) => {
        
        const spreadMessages = this.state.spreadMessages;
        const buildingID = this.state.selectBuilding;
        
        for (let i = 0; i < spreadMessages.length; i++) {
            const spread = spreadMessages[i];
            
            // 전체 선택시
            if (!buildingID) {
                if (!spread.buildingID) {
                    if (spread.message) {
                        this.setState({ showEditReceiver: value });
                        return;
                    }
                }
            }
            
            // 특정 건물 선택시
            if (spread.buildingID === parseInt(buildingID)) {
                if (spread.message) {
                    this.setState({ showEditReceiver: value });
                    return;
                }
            }
                
        }
        
        this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["메시지를 먼저 입력해주세요."], ['확인'], () => this.props.onCloseConfirmDialog());
    }

    getSensorTypesUI = () => {
        const sensorTypes = this.props.externalSensorTypes;
        if (!sensorTypes) {
            return [];
        }
        
        let types = [];
        
        types.push(<option value={SdmsResource.SensorType.entire} selected>전체</option>)
        
        for (let i = 0; i < sensorTypes.length; i++) {
            if (sensorTypes[i].id === SdmsResource.SensorType.atmosphere ||
                sensorTypes[i].id === SdmsResource.SensorType.kWeather ||
                sensorTypes[i].id === SdmsResource.SensorType.discharge ||
                sensorTypes[i].id === SdmsResource.SensorType.reduction) {
                types.push(<option value={sensorTypes[i].id}>{sensorTypes[i].name}</option>);
            }
        }
        
        return (
            <select onChange={(e) => this.onChangeSensorType(e)}>
                {types}
            </select>
        )
    }
    
    onChangeSensorType = (e) => {
        const sensorType = parseInt(e.target.value);
        this.updateBuildingBySensorType(sensorType);
    }
    
    // SensorType 변경시 BuildingID도 초기화
    updateBuildingBySensorType = (sensorType) => {
        const externalSensors = this.props.externalSensors;
        if (!externalSensors) {
            return;
        }
        
        // 센서타입 전체 선택시 BuildingID 초기화 
        if (sensorType === SdmsResource.SensorType.entire) {
            this.setState({ selectedSensorType: sensorType, selectBuilding: 0 });
            return;
        }
        
        let buildingID = null;
        
        const buildings = this.props.buildingGroupList[0].buildingDatas;

        // Sensor's zoneID = buildingID
        const currentTypeSensors = externalSensors.filter((sensor) => sensor.sensorType === sensorType );
        
        if (!currentTypeSensors || currentTypeSensors.length === 0) {
            this.setState({ selectedSensorType: sensorType, selectBuilding: 0 });
            return;
        }
        
        let currentBuildingList = [];
        
        for (let i = 0; i < currentTypeSensors.length; i++) {
            const sensor = currentTypeSensors[i];
            const zoneID = sensor.zoneID;
            
            const building = buildings.find((building) => building.id === zoneID );
            if (building) {
                currentBuildingList.push(building);
            }
        }
        
        currentBuildingList.sort((a, b) =>  a.id - b.id);

        this.setState({ selectedSensorType: sensorType, selectBuilding: currentBuildingList[0].id });
    }
    
    getBuildingUI = () => {
        
        let buildingGroup = [];
        let buildings = [];

        buildingGroup.push(<option value={SdmsResource.SensorType.entire}>전체(부산TP)</option>);
        if (!this.state.selectedSensorType || parseInt(this.state.selectedSensorType) === SdmsResource.SensorType.entire) {
            buildings.push(<option selected={this.state.selectBuilding === 0} value={SdmsResource.SensorType.entire}>전체</option>);
        }
        
        const buildingGroupList = this.props.buildingGroupList;
        
        if (!buildingGroupList) {
            return [buildingGroup, buildings]; // return null;
        }
        
        const buildingData = buildingGroupList[0].buildingDatas;
        
        const selectedSensorType = this.state.selectedSensorType;
        
        for (let i = 0; i < buildingData.length; i++) {
            const building = buildingData[i];
            if (selectedSensorType && parseInt(selectedSensorType) !== SdmsResource.SensorType.entire) {
                const sensorType = this.getSensorTypeFromBuilding(building);
                
                if (sensorType !== parseInt(selectedSensorType)) {
                    continue;
                }
            }
            
            const isSelected = this.state.selectBuilding === building.id;
            
            buildings.push(<option selected={isSelected} value={building.id}>{building.buildingName}</option>);
        }
        
        return [buildingGroup, buildings];
    }
    
    getSensorTypeFromBuilding = (building) => {
        const externalSensorTypes = this.props.externalSensorTypes;
        const externalSensors = this.props.externalSensors;
        
        if (!externalSensorTypes || !externalSensors) {
            return null;
        }
        const buildingID = building.id;
        // buildingID = zoneID
        for (const sensor of externalSensors) {
            const zoneID = sensor.zoneID;
            if (buildingID === zoneID) {
                const sensorTypeID = sensor.sensorType;
                
                const sensorType = externalSensorTypes.find((type) => {
                    return type.id === sensorTypeID;
                });
                
                return sensorType.id;
            }
        }
        
    }
    
    onChangeBuilding = (e) => {
        
        const spreadMessages = this.state.spreadMessages;
        for (let i = 0; i < spreadMessages.length; i++) {
            const message = spreadMessages[i];
            if (!message.buildingID) { // 전체
                
            } else { // 특정 빌딩
                
            }
        }
        
        this.setState({ selectBuilding: e.target.value });
    }
    
    onClickSave = async () => {
        // Save SpreadMessages
        const spreadMessages = this.state.spreadMessages;
        
        const selectedSensorType = this.state.selectedSensorType;
        const buildingID = this.state.selectBuilding;
        const regularID = this.state.selectRegularID;
        const regularMemberID = this.state.selectRegularMemberID;
        
        const message = this.state.message;
        
        if (!spreadMessages) {
            return;
        }

        const [spreadResult, spreadMessage] = await SettingsController.requestGetSpreadMessage();

        let spreadOld = [];

        if (spreadResult && spreadResult.length > 0) {
            spreadOld = spreadResult;
        }
        
        let addSpreadMessages = [];
        let updateSpreadMessages = [];
        
        for (let i = 0; i < spreadMessages.length; i++) {
            // Create, Update 분리
            const spreadMessage = spreadMessages[i];
            if (spreadMessage.id === -1) {
                addSpreadMessages.push(spreadMessage);
                continue;
            }
            
            for (let j = 0; j < spreadOld.length; j++) {
                const oldMessage = spreadOld[j];
                if (spreadMessage.id === oldMessage.id) {
                    
                    if (spreadMessage.message !== oldMessage.message ||
                        spreadMessage.buildingID !== oldMessage.buildingID ||
                        spreadMessage.regularID !== oldMessage.regularID ||
                        spreadMessage.regularMemberID !== oldMessage.regularMemberID) {
                        updateSpreadMessages.push(spreadMessage);
                    }
                    
                    spreadOld.splice(j,1);
                    break;
                }
            }
        }
        console.log(addSpreadMessages);
        console.log(updateSpreadMessages);
        console.log(spreadOld);
        console.log("spreadMessages");
        const [success, resultMessage] = await SettingsController.requestSetSpreadMessage(addSpreadMessages, updateSpreadMessages, spreadOld);
    }
    
    getSpreadMessage = () => {
        const spreadMessages = this.state.spreadMessages;
        if (!spreadMessages) {
            return "";
        }
        const selectedSensorType = this.state.selectedSensorType;
        const buildingID = this.state.selectBuilding;
        
        // Case 1. Entire SensorType, Entire Building
        if (parseInt(selectedSensorType) === SdmsResource.SensorType.entire &&
            (!buildingID || parseInt(buildingID) === 0)) {

            let temp = null;
            
            for (let i = 0; i < spreadMessages.length; i++) {
                const message = spreadMessages[i];
                if (!message.buildingID) {
                    temp = message;
                    break;
                }
            }
            
            return temp ? temp.message : "";
        }
        // Case 2. Entire SensorType, Specific Building
        if (parseInt(selectedSensorType) !== SdmsResource.SensorType.entire) {
            
            let temp = null;
            
            for (let i = 0; i < spreadMessages.length; i++) {
                const message = spreadMessages[i];
                if (message.buildingID === parseInt(buildingID)) {
                    temp = message;
                    break;
                }
            }
            
            return temp ? temp.message : "";
        }
        
        // Case 3. Entire SensorType, Specific Building
        if (parseInt(selectedSensorType) === SdmsResource.SensorType.entire &&
            parseInt(buildingID) !== 0 && buildingID) {

            let temp = null;

            for (let i = 0; i < spreadMessages.length; i++) {
                const message = spreadMessages[i];
                if (message.buildingID === parseInt(buildingID)) {
                    temp = message;
                    break;
                }
            }

            return temp ? temp.message : "";
        }
        
        return "";
        
    }
    
    handleMessageChange = (e) => {
        const type = this.state.selectFacilityType;
        const buildingGroupID = this.state.selectBuildingGroup;
        const buildingID = this.state.selectBuilding;
        const regularID = this.state.selectRegularID;
        const regularMemberID = this.state.selectRegularMemberID;
        
        const message = e.target.value;
        
        const spreadMessages = this.state.spreadMessages;
        
        if (spreadMessages && spreadMessages.length > 0) {
            let targetMessage = null;
            
            for (let i = 0; i < spreadMessages.length; i++) {
                const spreadMessage = spreadMessages[i];
                
                if (!buildingID || parseInt(buildingID) === 0) {
                    if (!spreadMessage.buildingID) {
                        targetMessage = spreadMessage;
                        break;
                    }
                }
                else {
                    if (spreadMessage.buildingID === parseInt(buildingID)) {
                        targetMessage = spreadMessage;
                        break;
                    }
                }
            }
            
            if (targetMessage) {
                targetMessage.message = message;
            }
            else {
                const newMessage = {
                    id: -1,
                    messageType: this.state.messageType,
                    facilityType: this.state.selectFacilityType,
                    buildingGroupID: this.state.selectBuildingGroup,
                    buildingID: parseInt(buildingID),
                    message: message
                }
                
                spreadMessages.push(newMessage);
            }
            
            this.setState({ message, spreadMessages });
        }
    }
    
    setRegularMember = (regularMemberIDs) => {
        let spreadMessages = this.state.spreadMessages;
        const buildingID = this.state.selectBuilding;
        
        if (spreadMessages && spreadMessages.length > 0) {
            
        }
    }
    
    deleteReceiver = (memberID) => {
        const spreadMessages = this.state.spreadMessages;
        const buildingID = this.state.selectBuilding;
        
        if (spreadMessages && spreadMessages.length > 0) {
            let targetMessage = null;
            
            for (let i = 0; spreadMessages.length; i++) {
                if (buildingID === spreadMessages[i].buildingID) {
                    targetMessage = spreadMessages[i];
                    break;
                }
            }
            
            if (targetMessage) {
                let regularMemberID = targetMessage.regularMemberID;
                
                console.log(regularMemberID);
                console.log(memberID);
                
                let newRegularMemberID = [];
                
            }
            
        }
    }
    
    addMember = (memberID) => {
        const spreadMessages = this.state.spreadMessages;
        const buildingID = this.state.selectBuilding;
        
        let receivers = this.state.receivers;
        
        if (spreadMessages && spreadMessages.length > 0) {
            
            let strRegularMemberID = '';
            
            for (let i = 0; i < spreadMessages.length; i++) {
                if (parseInt(buildingID) === spreadMessages[i].buildingID) {
                    if (!spreadMessages[i].regularMemberID) {
                        strRegularMemberID += memberID.toString();
                    }
                    else {
                        strRegularMemberID = spreadMessages[i].regularMemberID;
                        strRegularMemberID += ',' + memberID.toString();
                    }
                    spreadMessages[i].regularMemberID = strRegularMemberID;
                    break;
                }
                if (!parseInt(buildingID) && !spreadMessages[i].buildingID) {
                    let regularMemberID = spreadMessages[i].regularMemberID;
                    
                    if (!regularMemberID) {
                        strRegularMemberID += memberID.toString();
                    }
                    else {
                        strRegularMemberID = spreadMessages[i].regularMemberID;
                        strRegularMemberID += ',' + memberID.toString();
                    }
                    spreadMessages[i].regularMemberID = strRegularMemberID;
                    break;
                }
            }
            
            receivers = strRegularMemberID;
            
            this.setState({ spreadMessages , receivers });
        }
    }
    
    getReceiverUI = () => {
        const receivers = this.state.receivers;
        if (!receivers || receivers.length === 0) {
            return [];
        }
        
        let receiverUI = [];
        
        let arrReceiver = receivers.split(',');
        for (let i = 0; i < arrReceiver.length; i++) {
            let memberID = parseInt(arrReceiver[i]);
            
            let receiverName = this.getNameFromMemberID(memberID);
            
            let element = <li>{receiverName ? receiverName : ''}</li>;
            receiverUI.push(element);
        }
        
        return receiverUI;
    }
    
    getNameFromMemberID = (memberID) => {
        const members = this.state.members;
        if (!members) {
            return "";
        }
        
        for (let i = 0; i < members.length; i++) {
            if (members[i].ID === memberID) {
                return members[i].MemberName;
            }
        }
        
        return "";
    }

    onClickSaveRegularMember = (temp) => {
        
        let spreadMessages = this.state.spreadMessages;
        const buildingID = this.state.selectBuilding;
        
        if (spreadMessages && spreadMessages.length > 0) {
            let targetMessage = null;
            for (let i = 0; i < spreadMessages.length; i++) {
                if (!buildingID && !spreadMessages[i].buildingID) {
                    targetMessage = spreadMessages[i];
                    
                    if (targetMessage) {
                        spreadMessages[i].regularMemberID = temp;
                    }
                    
                    break;
                }
                else {
                    if (parseInt(buildingID) === parseInt(spreadMessages[i].buildingID)) {
                        targetMessage = spreadMessages[i];
                        
                        if (targetMessage) {
                            spreadMessages[i].regularMemberID = temp;
                        }
                        
                        break;
                    }
                }
            }
            
        }
        
        this.setState({ spreadMessages, receivers: temp });
    }

    render() {
        
        const sensorTypesUI = this.getSensorTypesUI();
        const [buildingGroup, buildings] = this.getBuildingUI();
        const message = this.getSpreadMessage();
        const receivers = this.getReceiverUI();
        
        return (
            <ModalBackground>
            <InitialSituationManagementComponent>
                <button onClick={() => this.props.handlePopups('initialSituationManagement', false)} className={'closeBtn'}>
                    <img src={close_btn} alt='닫기 버튼' width={16} height={16} />
                </button>
                <div className='menuWrap'>
                    <h2>초기상황 전파관리</h2>
                </div>
                <section>
                    <div className='filterWrap'>

                        {/* Sensor Type */}
                        {sensorTypesUI}
                        
                        {/* BuildingGroup */}
                        <select disabled>
                            {buildingGroup}
                        </select>

                        {/* Buildings */}
                        <select onChange={(e) => this.onChangeBuilding(e)}>
                            {buildings}
                        </select>
                        <button 
                            className={this.state.showEditReceiver ? 'on' : null}
                            onClick={() => this.handlePopup(true)}
                        >
                            <p>전파 대상자 지정</p>
                        </button>
                    </div>
                    <div className='receiverWrap'>
                        <p>수신자 :</p>
                        {/* Receiver */}
                        <ul>
                            {receivers}
                        </ul>
                    </div>
                    <div className='contentWrap'>
                        <div className='header'>
                            <p>문자내용 작성</p>
                            <div id='tooltip' data-tooltip="{ location } : 재난발생위치 / { date } : 재난발생시간 특수문자 사용가능" >
                                <img src={tooltip_icon} alt='도움말 아이콘' />
                            </div>
                        </div>
                        <div className='content'>
                            <textarea value={message} onChange={(e) => this.handleMessageChange(e)} />
                        </div>
                    </div>
                </section>
                <div className='btnWrap'>
                    <button className='cancle' onClick={() => this.props.handlePopups('initialSituationManagement', false)}>취소</button>
                    <button className='submit' onClick={() => this.onClickSave()}>적용</button>
                </div>
            </InitialSituationManagementComponent>
            {
                this.state.showEditReceiver &&
                <EditReceiver
                    handlePopup={this.handlePopup}
                    teamTreeData={this.state.teamTreeData}
                    teams={this.state.teams}
                    members={this.state.members}
                    facilityType={this.state.selectFacilityType}
                    buildingGroup={this.state.selectBuildingGroup}
                    building={this.state.selectBuilding}
                    regularID={this.state.selectRegularID}
                    regularMemberID={this.state.selectRegularMemberID}
                    spreadMessages={this.state.spreadMessages}
                    setRegularMember={this.setRegularMember}
                    receivers={this.state.receivers}
                    deleteReceiver={this.deleteReceiver}
                    addMember={this.addMember}
                    onClickSave={this.onClickSaveRegularMember}
                />
            }
            </ModalBackground>
        );
    }
}

export default InitialSituationManagement;



// 수신자 편집
class EditReceiver extends Component {
    
    constructor(props) {
        super(props);
        
        this.props = props;
        
        this.state = {
            selectRegularID: null,
            arrRegularID: null,				// 리시버 팀 기존 리스트
            arrRegularMemberID: null,		// 리시버 팀원 기존 리스트
            arrNewRegularID: null,			// 리시버 팀 수정 리스트
            arrNewRegularMemberID: null,	// 리시버 팀원 수정 리스트
            addRegularID: null,				// 선택된 팀
            addRegularMemberID: [],			// 선택된 팀원 리스트
            removeReceiverList:[],			// 삭제할 리스트
            displayReceiverList: [],		// 리시버 리스트 (팀, 팀원 다 포함)
        };
        
        this.initData();
        
        this.tempRegularMemberID = this.props.receivers;
    }
    
    initData = () => {
        const regularID = this.props.regularID;
        const regularMemberID = this.props.regularMemberID;
        let arrRegularID = [];
        let arrRegularMemberID = [];
        const teams = this.props.teams;
        const members = this.props.members;
        const tempRegularMemberID = this.props.receivers;
        
        if (regularID) {
            arrRegularID = regularID.split(",");
        }
        
        if (regularMemberID) {
            arrRegularMemberID = regularMemberID.split(",");
        }
        
        let displayReceiverList = [];
        let idx = 1;

        if (arrRegularID !== null && arrRegularID !== undefined && arrRegularID.length > 0 &&
            teams !== null && teams !== undefined) {

            for (let j = 0; j < arrRegularID.length; j++) {
                const regularID = arrRegularID[j];

                for (let i = 0; i < teams.length; i++) {
                    const team = teams[i];

                    if (regularID === team.id.toString()) {
                        displayReceiverList.push("team_" + team.id.toString());
                        idx++;
                        break;
                    }
                }
            }

        }

        if (arrRegularMemberID !== null && arrRegularMemberID !== undefined && arrRegularMemberID.length > 0 &&
            members !== null && members !== undefined) {

            for (let i = 0; i < arrRegularMemberID.length; i++) {
                const regularMemberID = arrRegularMemberID[i];

                for (let j = 0; j < members.length; j++) {
                    const member = members[j];

                    if (regularMemberID === member.ID.toString()) {
                        displayReceiverList.push("member_" + member.ID.toString());
                        idx++;
                        break;
                    }
                }
            }
        }
        
        this.setState({
            arrRegularID,
            arrNewRegularID: arrRegularID,
            arrRegularMemberID,
            arrNewRegularMemberID: arrRegularMemberID,
            displayReceiverList,
        });
    }
    
    getTeamList = () => {
        const teams = this.props.teams;
        const teamTreeData = this.props.teamTreeData;
        
        if (!teamTreeData || teamTreeData.length === 0) {
            return;
        }
        
        let displayTreeViewUI = [];
        
        for (let i = 0; i < teamTreeData.length; i++) {
            let node = teamTreeData[i];
            
            let depth = 1;
            
            if (node.Children && node.Children.length > 0) {
                displayTreeViewUI.push(this.getParentNode(node, depth));
            } else {
                displayTreeViewUI.push(this.getChildNode(node, depth));
            }
            
        }

        let teamListUI = (
            <div className='scroll'>
                <ul className={'teamTree'}>
                    {
                        displayTreeViewUI
                    }
                </ul>
            </div>
        );
        
        return teamListUI;
    }
    
    getParentNode = (node, depth) => {
        
        let name = node.TeamName;
        let id = node.ID;
        
        let childTree = [];
        let depthNum = depth;
        
        for (let i = 0; i < node.Children.length; i++) {
            let child = node.Children[i];
            
            if (child.Children !== null && child.Children !== undefined && child.Children.length > 0) {
                childTree.push(this.getParentNode(child, depthNum + 1));
            } else {
                childTree.push(this.getChildNode(child, depthNum + 1));
            }
        }
        
        let style = {};
        
        if (this.state.selectedRegularID === id) {
            style = { backgroundColor: '#3e93fd' };
        }
        
        return (
            <li key={id}>
                <div id={id + '_div_depth' + depth} className={'depth' + depth} style={style} onClick={(e) => this.onClickRegular(e, id, depth)}>
                    <h2>{name}</h2>
                </div>
                <ul id={id +'_ul_depth' + depth}>
                    {childTree}
                </ul>
            </li>
        );
    }
    
    getChildNode = (node, depth) => {
        let name = node.TeamName;
        let id = node.ID;

        let style = {};
        if (this.state.selectedRegularID === id) {
            style = { backgroundColor: '#3e93fd' };
        }
        
        return (
            <li key={id}>
                <div id={id + '_div_depth' + depth} className={'depth' + depth} style={style} onClick={(e) => this.onClickRegular(e, id, depth)}>
                    <h2>{name}</h2>
                </div>
            </li>
        );
    }

    getMemberList = () => {
        let memberListUI = [];
        
        const members = this.props.members;
        
        const selectedRegularID = this.state.selectedRegularID;
        if (!selectedRegularID) {
            return memberListUI;
        }
        
        let tempRegularMemberID = this.tempRegularMemberID;
        
        for (let i = 0; i < members.length; i++) {
            const member = members[i];
            
            if (member.RegularID !== selectedRegularID)
                continue;

            let isSelectedClassName = '';
            
            if (tempRegularMemberID !== null && tempRegularMemberID !== undefined && tempRegularMemberID.length > 0) {
                for (let i = 0; i < tempRegularMemberID.length; i++) {
                    const receiverID = tempRegularMemberID[i]; // string[] ID array
                    if (receiverID === member.ID.toString()) {
                        isSelectedClassName = 'selected';
                        break;
                    }
                }
            }
            
            let element = // 선택시 className='selected'
                <li key={member.ID} className={isSelectedClassName} onClick={() => this.onClickMember(member.ID)}>
                    <p>{member.MemberName}</p>
                </li>
            
            memberListUI.push(element);
        }

        return memberListUI;
    }
    
    onClickMember = (memberID) => {
        
        let tempRegularMemberID = this.tempRegularMemberID;
        
        if (!tempRegularMemberID || tempRegularMemberID.length === 0) {
            tempRegularMemberID = memberID.toString();
        }
        else {
            let arrTempRegularMemberID = tempRegularMemberID.split(',');
            for (let i = 0; i < arrTempRegularMemberID.length; i++) {
                if (arrTempRegularMemberID[i] === memberID.toString()) {
                    return;
                    }
            }
            
            tempRegularMemberID += ',' + memberID.toString();
        }
            
        
        this.tempRegularMemberID = tempRegularMemberID;
    }

    getCurrentReceiverList = () => {
        
        const receivers = this.tempRegularMemberID;
        const members = this.props.members;
        if (members === null || members === undefined || members.length === 0) {
            return [];
        }
        
        if (receivers === null || receivers === undefined || receivers.length === 0) {
            return [];
        }
        
        const arrReceiver = receivers.split(",");
        
        let selectedMemberListUI = [];
        
        for (let i = 0; i < receivers.length; i++) {
            const receiver = receivers[i];
            
            let element = null;
            
            for (let j = 0; j < members.length; j++) {
                const member = members[j];
                
                if (receiver === member.ID.toString()) {
                    element =
                        <li key={member.ID}>
                            <div>1</div>
                            <div>{member.MemberName}</div>
                            <div onClick={() => this.deleteReceiver(member.ID)}>
                                <button className={'binIcon'}>
                                    <img src={binIcon} alt='삭제 아이콘' />
                                </button>
                            </div>
                        </li>
                    
                    break;
                }
            }
            
            if (element !== null) {
                selectedMemberListUI.push(element);
            }
        }
        
        return selectedMemberListUI;
    }
    
    deleteReceiver = (memberID) => {
        const tempRegularMemberID = this.tempRegularMemberID;
        
        if (!tempRegularMemberID) {
            return;
        }
        
        let arrTempRegularMemberID = tempRegularMemberID.split(',');
        
        for (let i = 0; i < arrTempRegularMemberID.length; i++) {
            if (arrTempRegularMemberID[i] === memberID.toString()) {
                arrTempRegularMemberID.splice(i, 1);
                break;
            }
        }
        
        this.tempRegularMemberID = arrTempRegularMemberID.join(',');
        
    }

    onClickRegular = (e, id, depth) => {
        let isChecked = false;
        let divElement = document.getElementById(id + '_div_depth' + depth);
        
        if (!divElement) {
            this.setState({ selectedRegularID: id });
            return;
        }
        
        if (divElement.className.includes('on')) {
            divElement.className = divElement.className.replace(' on', '');
            isChecked = true;
        } else {
            divElement.className += ' on';
        }
        
        let ulElement = document.getElementById(id + '_ul_depth' + depth);
        
        if (!ulElement) {
            if (isChecked) {
                this.setState({ selectedRegularID: null });
                return;
            }
            
            this.setState({ selectedRegularID: id });
            return;
        }
        
        if (ulElement.className.includes('on') && isChecked) {
            ulElement.className = ulElement.className.replace(' on', '');
        } else {
            ulElement.className += ' on';
        }
        
        if (isChecked) {
            if (this.state.selectedRegularID !== id) {
                this.setState({ selectedRegularID: id });
                return;
            }
            
            // 하위 <div> tag의 className 중 'on' 제거
            let divs = ulElement.getElementsByTagName('div');
            if (divs) {
                for (let i = 0; i < divs.length; i++) {
                    let div = divs[i];
                    if (div.className.includes('on')) {
                        div.className = div.className.replace(' on', '');
                    }
                }
            }

            // 트리가 열려있으면 selectedRegularID를 null로 변경
            this.setState({ selectedRegularID: null });
            
            return;
        }
        
        this.setState({ selectedRegularID: id });
    }
    
    onClickSave = () => {
        this.props.onClickSave(this.tempRegularMemberID);
        this.props.handlePopup(false);
    }

    render() {

        const teamListUI = this.getTeamList();
        const memberListUI = this.getMemberList();
        const selectedMemberListUI = this.getCurrentReceiverList();

        return (
            <ModalBackground>
                <EditReceiverComponent>
                    <button onClick={() => this.props.handlePopup(false)} className={'closeBtn'}>
                        <img src={close_btn} alt='닫기 버튼' width={16} height={16}/>
                    </button>
                    <h2>수신자 편집</h2>

                    <section>
                        <div className='selectWrap'>
                            <div className='teamList'>
                                <p>부산산단</p>
                                {teamListUI}
                            </div>
                            <div className='memberList'>
                                <p>팀원</p>
                                <ul className='scroll'>
                                    {memberListUI}
                                </ul>
                            </div>
                </div>
                
                <div className='selectedMemberList'>
                    <ul className='selectedMember'>
                        <li className='head'>
                            <div>NO</div>
                            <div>
                                <div className='sort'>
                                    <span>이름</span>
                                    {/*
                                        className='az' -> 가나다라 순
                                        className='za' -> 역순
                                    */}
                                    <button className='sortBtn az' />
                                </div>
                            </div>
                            <div>삭제</div>
                        </li>
                        {/* {linkedSopDataUI} */}
                        <li className='body'>
                            <ul>
                                {selectedMemberListUI}
                            </ul>
                        </li>
                    </ul>
                </div>
            </section>

            <div className='btnWrap'>
                <button className='cancle' onClick={() => this.props.handlePopup(false)}>초기화</button>
                <button className='submit' onClick={() => this.onClickSave()}>적용</button>
            </div>
        </EditReceiverComponent>
        </ModalBackground>
        );
    }
}