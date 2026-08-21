import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';

import Monitoring3D from './monitoring3D';
import SopSet from './sopSet';
import ConfirmDialog from '../../Common/ui/confirmDialog';

import ProjectResource from '../../Root/resource/id';

import { LayoutSettingComponent } from '../styled/settingsStyled';
import { ModalBackground } from '../../Root/styled/theme';
import { SettingsController } from '../services/settingsController';
import { SdmsController } from '../../SDMS/services/sdmsController';
import SettingsResource from '../resource/id';

class LayoutSetting extends Component {
    constructor(props) {
        super(props);
		
		this.state = {
            menu: SettingsResource.menu.monitoring3D,
            isLoading: false,

            buildingGroupList: null,
            sensorTypes: null,          // 사용하는 센서 종류
            disasterCategories: null,   // 재난 종류
            
            linkedSOPs: null,			// 재난 종류 및 빌딩, 층에 따른 SOP 연결 정보
            updateLinkedSOPs: [],       // 업데이트할 SOP 연결 정보 리스트

            confirmMessage: {
                visible: false,
                messages: [""],
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null,
                type: null
            },
        }

		this.props = props;

        this.init();
	}

    async init() {
        const campusID = ProjectResource.campusID;
        const userInfo = ProjectResource.getUserInfo();

        if (userInfo === null || userInfo === undefined || campusID === null || campusID === undefined)
            return;

        // 건물 정보 가져오기
        const [buildingGroupList, outdoorZones, buildingMessage] = await SdmsController.requestBuildingGroupList(campusID);

        if (buildingGroupList) {
            this.setState({ buildingGroupList, outdoorZones });
        }
        else {
            this.showConfirmDialog([buildingMessage], null, null, 'error');
        }

        // 센서유형 가져오기
        const [sensorList, sensorMessage] = await SdmsController.requestSensorList(campusID);

        if(sensorList) {
            this.setState({ sensorTypes: sensorList });
        }
        else {
            this.showConfirmDialog([sensorMessage], null, null, 'error');
        }

        // SOP Link 정보 가져오기
        const [linkedSOPs, linkedSOPmessage] = await SettingsController.requestLinkedSOPList(campusID);
        
        if(linkedSOPs) {

            let newLinkedSOPs = [];

            for(let sop of linkedSOPs) {

                let addSOP = {
                    campusID: campusID,
                    facilityTypeID : sop.facilityType,
                    disasterCategoryID : sop.disasterCategoryID,
                    subDisasterCategoryID : sop.subDisasterCategoryID,
                    disasterName : sop.disasterName,
                    linkedBuildingID: sop.linkedBuildingID,
                    linkedZoneID: sop.lInkedZoneID
                }

                newLinkedSOPs.push(addSOP);
            }

            this.setState({ linkedSOPs, updateLinkedSOPs: newLinkedSOPs });
        }
        else {
            this.showConfirmDialog([linkedSOPmessage], null, null, 'error');
        }

        // 재난 종류 가져오기
        const [SOPLists, sopMessage] = await SettingsController.requestSOPList(campusID);

        if(SOPLists) {
            this.setState({ disasterCategories: SOPLists });
        }
        else {
            this.showConfirmDialog([sopMessage], null, null, 'error');
        }
    }

    showConfirmDialog = (messages, buttons, onClickButton, type) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.messages = messages;
		confirmMessage.buttons = buttons;
		confirmMessage.onClickButton = onClickButton;
		confirmMessage.type = type;

        if (!messages) {
            confirmMessage.messages = [""];
        }
        else if (Array.isArray(messages)) {
            confirmMessage.messages = messages;
        }
        else {
            confirmMessage.messages = [messages];
        }

        this.setState({ confirmMessage });
    }

    onCloseConfirmDialog = () => {
		const confirmMessage = { ...this.state.confirmMessage };
		confirmMessage.visible = false;

		this.setState({ confirmMessage });
	}

    onClickSave = async () => {
        const campusID = ProjectResource.campusID;
        const userInfo = ProjectResource.getUserInfo();

        if (userInfo === null || userInfo === undefined || campusID === null || campusID === undefined)
        return;

        const { option3DNormal, option3DSensor, optionSopNormal } = this.props;
        const { updateLinkedSOPs } = this.state;

        const [result, message] = await SettingsController.updateSettings(userInfo.id, campusID, option3DNormal, option3DSensor, optionSopNormal, updateLinkedSOPs);

        if(result) {
            this.showConfirmDialog(['저장되었습니다.'], ['닫기'], this.onClickClosePopup, 'success');
            this.props.getSettingsOption(userInfo);
        }
        else {
            this.showConfirmDialog([message], null, null, 'error');
        }
    }

    onClickClosePopup = () => {
        this.props.onClickClosePopup('settings', false);
    }

    onClickMenu = (menu, target) => {
		$('.menuWrap ul li').removeClass('on');
		$(target).addClass('on');

		this.setState({ menu: menu });
    }

    getDisplayView = () => {
        let ui = [];

        if(this.state.isLoading) {
            ui.push(
                <>
                    <p key="Loading" className={'loading'}>설정을 불러오고 있습니다.</p>
                </>
            );
        }
        else if(this.state.menu === SettingsResource.menu.monitoring3D) {
            ui.push(
                <Monitoring3D
                    key="LayoutSetting_Monitoring3D"
                    option3DNormal={this.props.option3DNormal}
                    option3DSensor={this.props.option3DSensor}
                    onClickClosePopup={this.onClickClosePopup}
                    checkPopupStateReset={this.props.checkPopupStateReset}
                />
            );
        }
        else if(this.state.menu === SettingsResource.menu.sopSet) {
            ui.push(
                <SopSet
                    key="LayoutSetting_SopSet"
                    optionSopNormal={this.props.optionSopNormal}
                    showConfirmDialog={this.showConfirmDialog}
                    buildingGroupList={this.state.buildingGroupList}
                    sensorTypes={this.state.sensorTypes}
                    disasterCategories={this.state.disasterCategories}
                    linkedSOPs={this.state.linkedSOPs}
                    updateLinkedSOPs={this.state.updateLinkedSOPs}
                    updateLinkedSops={this.updateLinkedSops}
                    onClickClosePopup={this.props.onClickClosePopup}
                />
            );
        }

        return ui;
    }

    updateLinkedSops = (linkedSOPs, updateLinkedSOPs) => {
		this.setState({ linkedSOPs, updateLinkedSOPs: updateLinkedSOPs });
	}

    render() {

        const ui = this.getDisplayView();

        return (
            <>
            <ModalBackground className='UI_Section'>
                <LayoutSettingComponent>
                    <div>
                        <button onClick={() => this.props.onClickClosePopup('settings', false)} className={'closeBtn'} />
                    </div>
                    <div className='menuWrap'>
                        <h4>환경설정</h4>
                        <ul>
                            <li className='on' onClick={(e) => this.onClickMenu(SettingsResource.menu.monitoring3D, e.target)}>3D 관제 시스템</li>
                            <li onClick={(e) => this.onClickMenu(SettingsResource.menu.sopSet, e.target)}>SOP 환경</li>
                        </ul>
                    </div>
                    {ui}
                    <ul className={'buttonWrap'}>
                        <li className={'cancelBtn'} onClick={() => this.props.onClickClosePopup('settings', false)}>취소</li>
                        <li className={'saveBtn'} onClick={() => this.showConfirmDialog(['저장하시겠습니까?'], ['취소', '확인'], this.onClickSave, 'save')}>확인</li>
                    </ul>
                </LayoutSettingComponent>
            </ModalBackground>
            {
                /* alert창 대신 사용 */
                this.state.confirmMessage.visible &&
                <ConfirmDialog 
                    messages={this.state.confirmMessage.messages} 
                    buttons={this.state.confirmMessage.buttons} 
                    onClose={this.state.confirmMessage.onClose}
                    onClickButton={this.state.confirmMessage.onClickButton}
                    onCloseConfirmDialog={this.onCloseConfirmDialog}
                    type={this.state.confirmMessage.type}
                />
            }
            </>
        )
    }
}

export default withRouter(LayoutSetting);