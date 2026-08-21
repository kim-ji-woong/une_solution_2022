import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { LayoutSettingComponent } from '../styled/settingsStyled';
import SettingsResource from '../resource/id';
import { ModalBackground } from '../../Root/styled/theme';
import Monitoring3D from './monitoring3D';
import SopSet from './sopSet';
import SettingEtc from './settingEtc';

import SettingController from '../../Settings/services/settingsController';
import SopController from '../../SOPManager/services/sopController';

import close_btn from '../../Common/images/close_btn.png';
import ProjectResource from '../../Root/resource/id';
import { SDMSController } from '../../SDMS/services/sdmsController';
import SdmsResource from "../../SDMS/resource/id";

import SettingsStore from "../settingsStore";

import ConfirmDialog from '../../Common/ui/confirmDialog';

class LayoutSetting extends Component {
    constructor(props) {
        super(props);

        this.props = props;
        
        this.state = {
            menu: SettingsResource.menu.monitoring3D,

            siteID: null,

            settings: null,
            linkedSOPs: null,
            disasterCategories: null,
            useReceives: null,

            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null
            },
        }

        this.wsMgr = this.props.getWebSocket();

        this.init();
        
        this.isSaving = false;
    }

    init = async () => {
        let userInfo = await ProjectResource.initUserInfo();
        if (!userInfo)
            return;

        const siteID = ProjectResource.Site.Busan;

        // 설정 불러오기
        const [result, message] = await SettingController.requestSettings(userInfo.id);

        if (!result)
            return;

        // SOP Link 정보 가져오기
        const [linkedSOPData, linkedSOPMessage] = await SettingController.requestLinkedSOPList()
        let linkedSOPs = [];
        if (linkedSOPData && linkedSOPData.length > 0)
            linkedSOPs = linkedSOPData;

        // SOP 재난 정보 가져오기
        const [disasterCategories, disasterCategoriesMessage] = await SopController.disasterCategories(true);

        // 센서 알람 사용 유무 가져오기
        let useReceives = await SDMSController.requestBusanSdmsOptions();
        if (!useReceives)
            useReceives = [];

        // 설정 적용
        this.setState({ settings: result, isLoading: false, disasterCategories, linkedSOPs, siteID, useReceives })


    }

    onClickMenu = (menu) => {
        this.setState({ menu: menu });
    }

    onChangeIdleTime = (value) => {
        let idleTime = "";
        value = parseInt(value);
        if (value === SettingsResource.autoRotation.none)
            idleTime = ("0;" + "0");
        else if (value === SettingsResource.autoRotation.m15)
            idleTime = ("15;" + "1");         
        else if (value === SettingsResource.autoRotation.m30)
            idleTime = ("30;" + "1");
        else if (value === SettingsResource.autoRotation.m60)
            idleTime = ("60;" + "1");

        if (!this.state.settings) {
            return this.showConfirmDialog(ProjectResource.dialogTypes.WARNING, ["설정 정보가 없습니다."], ["확인"], this.onCloseConfirmDialog());
        }
        
        const settings = { ...this.state.settings };
        settings.idleTime = idleTime;
        
        this.setState({ settings });
    }
    
    onChangeUseReceives = (value) => {
        const useReceives = this.state.useReceives;
        if (!useReceives)
            return;
        
        value = parseInt(value);
        let targetString = "";
        
        if (value === SdmsResource.SensorType.atmosphere) {
            targetString = "UseReceiveAtmosphere";
        } else if (value === SdmsResource.SensorType.kWeather) {
            targetString = "UseReceiveKWeather";
        } else if (value === SdmsResource.SensorType.reduction) {
            targetString = "UseReceiveReduction";
        } else if (value === SdmsResource.SensorType.discharge) {
            targetString = "UseReceiveEmission";
        }
        
        let newUseReceives = [...useReceives];
        
        for (let i = 0; i < newUseReceives.length; i++) {
            if (newUseReceives[i].propertyName === targetString) {
                newUseReceives[i].propertyValue = !newUseReceives[i].propertyValue;
                break;
            }
        }
        
        this.setState({ useReceives: newUseReceives });
    }
    
    onChangeMoveDisplay = (value) => {
        if (!this.state.settings) {
            return this.showConfirmDialog(ProjectResource.dialogTypes.WARNING, ["설정 정보가 없습니다."], ["확인"], this.onCloseConfirmDialog());
        }
        
        const settings = { ...this.state.settings };
        settings.moveDisplayAlarm = value;
        
        this.setState({ settings });
    }

    onClickResetPopupPosition = () => {
        this.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ["팝업 위치를 초기화 하시겠습니까?"], ["확인", "취소"], this.onClickResetPopupPositionConfirm);
    }
    
    onClickResetPopupPositionConfirm = (buttonIndex) => {
        if (buttonIndex === 0) {
            this.popupReset();
        }
        
        this.onCloseConfirmDialog();
    }

    async popupReset() {
        // 데이터 팝업 위치 및 사이즈 초기화
        let popupState = [];

        let statusInfo = SdmsResource.popupResetLocation.statusInfo;
        let weatherInfo = SdmsResource.popupResetLocation.weatherInfo;
        let miniMap = SdmsResource.popupResetLocation.miniMap;
        let cctvInfo = SdmsResource.popupResetLocation.cctvInfo;
        let event = SdmsResource.popupResetLocation.event;
        let statusPsmSensorInfo = SdmsResource.popupResetLocation.statusPsmSensorInfo;

        popupState = {
            cctvInfo: cctvInfo,
            weatherInfo: weatherInfo,
            statusInfo: statusInfo,
            miniMap: miniMap,
            event: event,
            statusPsmSensorInfo: statusPsmSensorInfo
        };

        SettingsStore.dispatch({ type: 'RESET_POPUP', popupState: popupState });

        let userInfo = ProjectResource.getUserInfo();
        if (userInfo === null || userInfo === undefined) {
            this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["유저 정보를 불러오지 못했습니다. 다시 시도해주세요."], null, null);
            return;
        }

        // DB 값 초기화
        const [success, message] = await SDMSController.requestResetPopup(userInfo.id, popupState);

        if (success === false) {
            return this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
        
        return;
    }

    getDisplayView = () => {
        let ui = [];

        if (this.state.menu === SettingsResource.menu.monitoring3D) {
            ui.push(
                <Monitoring3D
                    key="LayoutSetting_Monitoring3D"
                    settings={this.state.settings}
                    useReceives={this.state.useReceives}
                    onChangeIdleTime={this.onChangeIdleTime}
                    onChangeUseReceives={this.onChangeUseReceives}
                    onChangeMoveDisplay={this.onChangeMoveDisplay}
                    onClickResetPopupPosition={this.onClickResetPopupPosition}
                />
            );
        }
        else if (this.state.menu === SettingsResource.menu.sopSet) {
            ui.push(
                <SopSet
                    key="LayoutSetting_SopSet"
                />
            );
        }
        else if (this.state.menu === SettingsResource.menu.etc) {
            ui.push(
                <SettingEtc                
                    key="LayoutSetting_etc"
                />
            );
        }

        return ui;
    }

    showConfirmDialog = (type, messages, buttons, onClickButton) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.type = type;
        confirmMessage.messages = messages;
        confirmMessage.buttons = buttons;
        confirmMessage.onClickButton = onClickButton;

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
        
        if (this.isSaving) {
            return;
        }
        
        this.isSaving = true;
        
        let userInfo = ProjectResource.getUserInfo();
        if (userInfo === null || userInfo === undefined) {
            this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["유저 정보를 불러오지 못했습니다. 다시 시도해주세요."], null, null);
            return;
        }
        
        const settings = this.state.settings;
        const useReceives = this.state.useReceives;
        
        if (!settings || !useReceives) {
            this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["설정 정보를 불러오지 못했습니다. 다시 시도해주세요."], null, null);
            return;
        }
        
        const saveData = this.makeSaveData(userInfo, settings);
        
        const [success, message] = await SettingController.requestSaveSettings(saveData);
        const [success2, message2] = await SDMSController.requestUpdateUseReceives(useReceives);
        
        if (!success) {
            this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["설정 저장에 실패하였습니다." , "Message: " + message], null, null);
            return;
        }
        
        if (!success2) {
            this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["센서 알람 사용 유무 저장에 실패하였습니다." , "Message: " + message2], null, null);
            return;
        }
        
        this.isSaving = false;
    }
    
    makeSaveData = (userInfo, settings) => {

        let idleTime = settings.idleTime.split(";");
        
        // IdleTiem 유효성 체크
        if (idleTime[0] !== "15" || idleTime[0] !== "30" || idleTime[0] !== "60") {
            if (idleTime[1] === "0") {
                idleTime[0] = "0";
            }
                
            idleTime[0] = "15";
            idleTime[1] = "1";
        }
        
        settings.idleTime = idleTime[0] + ";" + idleTime[1];
        
        return  {
            userID: userInfo.id,
            shortcutKey: settings.shortcutKey,
            idleTime: settings.idleTime,
            reAlarm: settings.reAlarm,
            useReceiveFire: settings.useReceiveFire,
            useReceivePSM: settings.useReceivePSM,
            useReceiveETC: settings.useReceiveETC,
            useReceiveSVMS: settings.useReceiveSVMS,
            eventInfoDisplayTerm: settings.eventInfoDisplayTerm,
            useScreenMove: settings.useScreenMove,
            exeCautionSOP: settings.exeCautionSOP,
            exeAlartSOP: settings.exeAlartSOP,
            exeSeriousSOP: settings.exeSeriousSOP,
            useTrainingMode: settings.useTrainingMode,
            useWaterMark: settings.useWaterMark,
            useHeadMessage: settings.useHeadMessage,
            useAutoMoveSOPScreen: settings.useAutoMoveSOPScreen,
            useBroadcast: settings.useBroadcast,
            useSMS: settings.useSMS,
            useEmail: settings.useEmail,
            useConfirm: settings.useConfirm,
            workingBeginHour: settings.workingBeginHour,
            workingEndHour: settings.workingEndHour,
            useResultSummary: settings.useResultSummary,
            dashboardBegin: settings.dashboardBegin,
            dashboardEnd: settings.dashboardEnd,
            fireSOPWaitEndTime: settings.fireSOPWaitEndTime,
            psmsopWaitEndTime: settings.psmsopWaitEndTime,
            etcsopWaitEndTime: settings.etcsopWaitEndTime,
            fireSOPRecoverEndTime: settings.fireSOPRecoverEndTime,
            psmsopRecoverEndTime: settings.psmsopRecoverEndTime,
            etcsopRecoverEndTime: settings.etcsopRecoverEndTime,
            moveDisplayAlarm: settings.moveDisplayAlarm,
            useAlarmBroadcast: settings.useAlarmBroadcast,
            usePoiFocus: settings.usePoiFocus,
            usePoiHighlight: settings.usePoiHighlight,
            turnStart: settings.turnStart,
            useAlarmTurn: settings.useAlarmTurn,
            weatherState: settings.weatherState,
            weatherSoundState: settings.weatherSoundState,
        };
    }

    render() {
        const { menu } = this.state;
        const ui = this.getDisplayView();

        return (
            <ModalBackground className={"UI_Section"}>
            <LayoutSettingComponent className={"UI_Section"}>
                <button onClick={() => this.props.handlePopup('setting', false)} className={'closeBtn'}>
                    <img src={close_btn} alt='닫기 버튼' width={16} height={16} />
                </button>
                <div className='menuWrap'>
                    <h2>환경설정</h2>
                    <ul>
                        <li className={menu === SettingsResource.menu.monitoring3D ? 'on' : null} onClick={() => this.onClickMenu(SettingsResource.menu.monitoring3D)}>{SettingsResource.ID.menu.monitoring3D}</li>
                        <li className={menu === SettingsResource.menu.sopSet ? 'on' : null} onClick={() => this.onClickMenu(SettingsResource.menu.sopSet)}>{SettingsResource.ID.menu.sopSet}</li>
                        <li className={menu === SettingsResource.menu.etc ? 'on' : null} onClick={() => this.onClickMenu(SettingsResource.menu.etc)}>{SettingsResource.ID.menu.etc}</li>
                    </ul>
                </div>
                {ui}
                <div className='btnWrap'>
                    <button className='cancle'>취소</button>
                    <button className='submit' onClick={() => this.onClickSave()}>적용</button>
                </div>

                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog
                        type={this.state.confirmMessage.type}
                        messages={this.state.confirmMessage.messages}
                        buttons={this.state.confirmMessage.buttons}
                        onClickButton={this.state.confirmMessage.onClickButton}
                        onClose={() => this.onCloseConfirmDialog()}
                    />
                }
            </LayoutSettingComponent>
            </ModalBackground>

        );
    }
}

export default withRouter(LayoutSetting);