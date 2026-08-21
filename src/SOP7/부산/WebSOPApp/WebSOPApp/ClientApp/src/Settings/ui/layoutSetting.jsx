import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { LayoutSettingComponent } from "../styled/settingsStyled";
import SettingsResource from "../resource/id";
import { ModalBackground } from "../../Root/styled/theme";
import Monitoring3D from "./monitoring3D";
import SopSet from "./sopSet";
import SettingEtc from "./settingEtc";

import SettingController from "../../Settings/services/settingsController";
import SopController from "../../SOPManager/services/sopController";

import close_btn from "../../Common/images/close_btn.png";
import ProjectResource from "../../Root/resource/id";
import { SDMSController } from "../../SDMS/services/sdmsController";
import SdmsResource from "../../SDMS/resource/id";

import SettingsStore from "../settingsStore";

import ConfirmDialog from "../../Common/ui/confirmDialog";
import { TeamEditController } from "../../TeamEditor/services/teamEditController";

class LayoutSetting extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            menu: SettingsResource.menu.monitoring3D,

            siteID: null,

            settings: null,
            tempSettings: null,

            linkedSOPs: null,
            disasterCategories: null,
            useReceives: null,
            buildingGroupList: null,
            teamTreeData: null,
            teams: null,
            members: null,

            externalSensors: null,
            externalSensorTypes: null,

            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null,
            },
        };

        this.wsMgr = this.props.getWebSocket();

        this.init();

        this.isSaving = false;
    }

    init = async () => {
        let userInfo = await ProjectResource.initUserInfo();
        if (!userInfo) return;

        const siteID = ProjectResource.Site.Busan;

        // 설정 불러오기
        const [result, message] = await SettingController.requestSettings(
            userInfo.id
        );

        if (!result) return;

        // SOP Link 정보 가져오기
        const [linkedSOPData, linkedSOPMessage] =
            await SettingController.requestLinkedSOPList();
        let linkedSOPs = [];
        if (linkedSOPData && linkedSOPData.length > 0) linkedSOPs = linkedSOPData;

        // SOP 재난 정보 가져오기
        const [disasterCategories, disasterCategoriesMessage] =
            await SopController.disasterCategories(true);

        // 센서 알람 사용 유무 가져오기
        let useReceives = await SDMSController.requestBusanSdmsOptions();
        if (!useReceives) useReceives = [];

        const [buildingGroupListData, outdoorZones, errorMessage] =
            await SDMSController.requestBuildingGroupList();
        let buildingGroupList = [];
        if (buildingGroupListData && buildingGroupListData.length > 0)
            buildingGroupList = buildingGroupListData;

        const teamTreeData = await TeamEditController.DisplayRegular();
        const teams = await TeamEditController.GetRegular();
        const members = await TeamEditController.DisplayRegularMember();

        const externalSensors = await SDMSController.requestExternalSensors();
        const externalSensorTypes =
            await SDMSController.requestExternalSensorTypes();

        // 설정 적용
        this.setState({
            settings: result,
            tempSettings: result,
            isLoading: false,
            disasterCategories,
            linkedSOPs,
            siteID,
            useReceives,
            buildingGroupList,
            teamTreeData,
            teams,
            members,
            externalSensors,
            externalSensorTypes,
        });
    };

    onChangeSOPEndTime = (value) => {
        let settings = { ...this.state.settings };
        settings.etcsopRecoverEndTime = value;

        this.setState({ settings });
    };

    onChangeUseSMS = (value) => {
        let settings = { ...this.state.settings };
        settings.useSMS = value;

        this.setState({ settings });
    };

    onChangeUseResultSummary = (value) => {
        let settings = { ...this.state.settings };
        settings.useResultSummary = value;

        this.setState({ settings });
    };

    onClickMenu = (menu) => {
        this.setState({ menu: menu });
    };

    onChangeIdleTime = (value) => {
        let idleTime = "";
        value = parseInt(value);
        if (value === SettingsResource.autoRotation.none) idleTime = "0;" + "0";
        else if (value === SettingsResource.autoRotation.m15)
            idleTime = "15;" + "1";
        else if (value === SettingsResource.autoRotation.m30)
            idleTime = "30;" + "1";
        else if (value === SettingsResource.autoRotation.m60)
            idleTime = "60;" + "1";

        if (!this.state.settings) {
            return this.showConfirmDialog(
                ProjectResource.dialogTypes.WARNING,
                ["설정 정보가 없습니다."],
                ["확인"],
                this.onCloseConfirmDialog()
            );
        }

        const settings = { ...this.state.settings };
        settings.idleTime = idleTime;

        this.setState({ settings });
    };

    onChangeUseReceives = (value) => {
        const useReceives = this.state.useReceives;
        if (!useReceives) return;

        value = parseInt(value);
        let targetString = "";

        if (value === SdmsResource.SensorType.atmosphere) {
            targetString = "UseReceiveAtmosphere";
        } else if (value === SdmsResource.SensorType.kWeather) {
            targetString = "UseReceiveKWeather";
        } else if (value === SdmsResource.SensorType.electricity) {
            targetString = "UseReceiveElectricity";
        }

        let newUseReceives = [...useReceives];

        for (let i = 0; i < newUseReceives.length; i++) {
            if (newUseReceives[i].propertyName === targetString) {
                newUseReceives[i].propertyValue = !newUseReceives[i].propertyValue;
                break;
            }
        }

        this.setState({ useReceives: newUseReceives });
    };

    onChangeMoveDisplay = (value) => {
        if (!this.state.settings) {
            return this.showConfirmDialog(
                ProjectResource.dialogTypes.WARNING,
                ["설정 정보가 없습니다."],
                ["확인"],
                this.onCloseConfirmDialog()
            );
        }

        const settings = { ...this.state.settings };
        settings.moveDisplayAlarm = value;

        this.setState({ settings });
    };

    onClickResetPopupPosition = () => {
        this.showConfirmDialog(
            ProjectResource.dialogTypes.QUESTION,
            ["팝업 위치를 초기화 하시겠습니까?"],
            ["확인", "취소"],
            this.onClickResetPopupPositionConfirm
        );
    };

    onClickResetPopupPositionConfirm = (buttonIndex) => {
        if (buttonIndex === 0) {
            this.popupReset();
        }

        this.onCloseConfirmDialog();
    };

    async popupReset() {
        // 데이터 팝업 위치 및 사이즈 초기화
        let popupState = [];

        let statusInfo = SdmsResource.popupResetLocation.statusInfo;
        let weatherInfo = SdmsResource.popupResetLocation.weatherInfo;
        let miniMap = SdmsResource.popupResetLocation.miniMap;
        let cctvInfo = SdmsResource.popupResetLocation.cctvInfo;
        let event = SdmsResource.popupResetLocation.event;
        let statusPsmSensorInfo =
            SdmsResource.popupResetLocation.statusPsmSensorInfo;
        let simulation = SdmsResource.popupResetLocation.simulation;

        popupState = {
            cctvInfo: cctvInfo,
            weatherInfo: weatherInfo,
            statusInfo: statusInfo,
            miniMap: miniMap,
            event: event,
            statusPsmSensorInfo: statusPsmSensorInfo,
            simulation: simulation,
        };

        SettingsStore.dispatch({ type: "RESET_POPUP", popupState: popupState });

        let userInfo = ProjectResource.getUserInfo();
        if (userInfo === null || userInfo === undefined) {
            this.showConfirmDialog(
                ProjectResource.dialogTypes.ERROR,
                ["유저 정보를 불러오지 못했습니다. 다시 시도해주세요."],
                null,
                null
            );
            return;
        }

        // DB 값 초기화
        const [success, message] = await SDMSController.requestResetPopup(
            userInfo.id,
            popupState
        );

        if (success === false) {
            return this.showConfirmDialog(
                ProjectResource.dialogTypes.ERROR,
                [message],
                null,
                null
            );
        }

        return;
    }

    onClickExit = () => {
        this.showConfirmDialog(
            ProjectResource.dialogTypes.QUESTION,
            ["시스템을 종료하시겠습니까?"],
            ["확인", "취소"],
            this.onClickExitConfirm
        );
    };

    onClickExitConfirm = (buttonIndex) => {
        if (buttonIndex === 0) {
            this.exitSystem();
        }

        this.onCloseConfirmDialog();
    };

    exitSystem = () => {
        this.onCloseConfirmDialog();
        if (this.wsMgr) {
            if (this.wsMgr.connected) {
                return this.wsMgr.sendCheckExit();
            }
        }

        return this.showConfirmDialog(
            ProjectResource.dialogTypes.ERROR,
            ["웹소켓 연결이 되어있지 않습니다."],
            null,
            null
        );
    };

    applyLinkedSOPs = (linkedSOPs) => {
        this.setState({ linkedSOPs });
    };

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
        } else if (this.state.menu === SettingsResource.menu.sopSet) {
            ui.push(
                <SopSet
                    key="LayoutSetting_SopSet"
                    linkedSOPs={this.state.linkedSOPs}
                    disasterCategories={this.state.disasterCategories}
                    settings={this.state.settings}
                    buildingGroupList={this.state.buildingGroupList}
                    teamTreeData={this.state.teamTreeData}
                    teams={this.state.teams}
                    members={this.state.members}
                    externalSensors={this.state.externalSensors}
                    externalSensorTypes={this.state.externalSensorTypes}
                    showConfirmDialog={this.showConfirmDialog}
                    onCloseConfirmDialog={this.onCloseConfirmDialog}
                    applyLinkedSOPs={this.applyLinkedSOPs}
                    onChangeSOPEndTime={this.onChangeSOPEndTime}
                    onChangeUseSMS={this.onChangeUseSMS}
                    onChangeUseResultSummary={this.onChangeUseResultSummary}
                />
            );
        } else if (this.state.menu === SettingsResource.menu.etc) {
            ui.push(
                <SettingEtc key="LayoutSetting_etc" onClickExit={this.onClickExit} />
            );
        }

        return ui;
    };

    showConfirmDialog = (type, messages, buttons, onClickButton) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.type = type;
        confirmMessage.messages = messages;
        confirmMessage.buttons = buttons;
        confirmMessage.onClickButton = onClickButton;

        if (!messages) {
            confirmMessage.messages = [""];
        } else if (Array.isArray(messages)) {
            confirmMessage.messages = messages;
        } else {
            confirmMessage.messages = [messages];
        }

        this.setState({ confirmMessage });
    };

    onCloseConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        this.setState({ confirmMessage });
    };

    onClickSave = async () => {
        if (this.isSaving) {
            return;
        }

        this.isSaving = true;

        let userInfo = ProjectResource.getUserInfo();
        if (userInfo === null || userInfo === undefined) {
            this.showConfirmDialog(
                ProjectResource.dialogTypes.ERROR,
                ["유저 정보를 불러오지 못했습니다. 다시 시도해주세요."],
                null,
                null
            );
            return;
        }

        const settings = this.state.settings;
        const useReceives = this.state.useReceives;

        if (!settings || !useReceives) {
            this.showConfirmDialog(
                ProjectResource.dialogTypes.ERROR,
                ["설정 정보를 불러오지 못했습니다. 다시 시도해주세요."],
                null,
                null
            );
            return;
        }

        const saveData = this.makeSaveData(userInfo, settings);

        const [success, message] = await SettingController.requestSaveSettings(
            saveData
        );
        const [success2, message2] = await SDMSController.requestUpdateUseReceives(
            useReceives
        );

        if (!success) {
            this.showConfirmDialog(
                ProjectResource.dialogTypes.ERROR,
                ["설정 저장에 실패하였습니다.", "Message: " + message],
                ["확인"],
                this.onCloseConfirmDialog
            );
            return;
        }

        if (!success2) {
            this.showConfirmDialog(
                ProjectResource.dialogTypes.ERROR,
                ["센서 알람 사용 유무 저장에 실패하였습니다.", "Message: " + message2],
                ["확인"],
                this.onCloseConfirmDialog
            );
            return;
        }

        this.isSaving = false;

        this.showConfirmDialog(
            ProjectResource.dialogTypes.INFO,
            ["설정이 저장되었습니다."],
            ["확인"],
            this.onCloseConfirmDialog
        );

        this.sendSettingsToApp(useReceives, settings);
    };

    sendSettingsToApp = (useReceives, settings) => {
        // 1: 대기(센코) , 2: 케이웨더 , 4: 전류센서
        let options = [];
        for (let i = 0; i < useReceives.length; i++) {
            let poiType = 0;
            if (useReceives[i].propertyName === "UseReceiveAtmosphere") {
                poiType = 1;
            } else if (useReceives[i].propertyName === "UseReceiveKWeather") {
                poiType = 2;
            } else if (useReceives[i].propertyName === "UseReceiveElectricity") {
                poiType = 4;
            }
            let option = {
                poiType: poiType,
                value: useReceives[i].propertyValue,
            };
        }

        let useReceiveParameter = {
            allowEvents: options,
        };

        if (this.wsMgr && this.wsMgr.connected) {
            this.wsMgr.sendResponseAlarmLayerSettings(useReceiveParameter);
        }

        let idleTimeParameter = {
            autoRotation: {
                active: settings.idleTime.split(";")[1] === "1",
                minute: parseInt(settings.idleTime.split(";")[0]),
            },
        };

        if (this.wsMgr && this.wsMgr.connected) {
            this.wsMgr.sendResponseAutoRotationSettings(idleTimeParameter);
        }
    };

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

        return {
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
    };

    render() {
        const { menu } = this.state;
        const ui = this.getDisplayView();

        return (
            <ModalBackground>
                <LayoutSettingComponent className={"UI_Section"}>
                    <button
                        onClick={() => this.props.handlePopup("setting", false)}
                        className={"closeBtn"}
                    >
                        <img src={close_btn} alt="닫기 버튼" width={16} height={16} />
                    </button>
                    <div className="menuWrap">
                        <h2>환경설정</h2>
                        <ul>
                            <li
                                className={
                                    menu === SettingsResource.menu.monitoring3D ? "on" : null
                                }
                                onClick={() =>
                                    this.onClickMenu(SettingsResource.menu.monitoring3D)
                                }
                            >
                                {SettingsResource.ID.menu.monitoring3D}
                            </li>
                            <li
                                className={menu === SettingsResource.menu.sopSet ? "on" : null}
                                onClick={() => this.onClickMenu(SettingsResource.menu.sopSet)}
                            >
                                {SettingsResource.ID.menu.sopSet}
                            </li>
                            <li
                                className={menu === SettingsResource.menu.etc ? "on" : null}
                                onClick={() => this.onClickMenu(SettingsResource.menu.etc)}
                            >
                                {SettingsResource.ID.menu.etc}
                            </li>
                        </ul>
                    </div>
                    {ui}
                    <div className="btnWrap">
                        <button className="cancle">취소</button>
                        <button className="submit" onClick={() => this.onClickSave()}>
                            적용
                        </button>
                    </div>

                    {
                        /* alert창 대신 사용 */
                        this.state.confirmMessage.visible && (
                            <ConfirmDialog
                                type={this.state.confirmMessage.type}
                                messages={this.state.confirmMessage.messages}
                                buttons={this.state.confirmMessage.buttons}
                                onClickButton={this.state.confirmMessage.onClickButton}
                                onClose={() => this.onCloseConfirmDialog()}
                            />
                        )
                    }
                </LayoutSettingComponent>
            </ModalBackground>
        );
    }
}

export default withRouter(LayoutSetting);
