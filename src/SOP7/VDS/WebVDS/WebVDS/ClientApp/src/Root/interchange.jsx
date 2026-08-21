import React, { Component } from 'react';
import Dashboard from '../Dashboard/ui/dashboard';
import Main from '../Main/ui/main';
import Edit from '../PropertyEdit/ui/edit';
import ProjectResource from './resource/id';
import wsManager from './services/wsManager';
import $ from 'jquery';
import uis from '../Common/css/ui.module.css';
import StringUtil from '../Common/util/StringUtil';
import ConfirmDialog from '../Common/ui/confirmDialog';
import { AccountController } from '../Account/services/accountController';
import AccountStore from '../Account/accountStore';
import AccountResource from '../Account/resource/id';

class Interchange extends Component {
    static Mode = {
        dashboard: 1,
        main: 2,
        main_InventoryManagement: 3,
        edit: 4
    }

    static paramType = {
        dataCenter: 1,
        dashboardSubMode: 2
    }

    constructor(props) {
        super(props);

        this.state = {
            prevMode: null,
            mode: Interchange.Mode.dashboard,
            showInventoryManagement: false,
            dataCenter: null,
            dashboardSubMode: null,
            newRegistMode: false,
            site: null,
            cameraOn: false,
            sensorOn: true,
            loading: true,

            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null,
                icon: null
            },

            licenseAlertCheck: false,
            licenseDays: -1
        };

        this.props = props;
        this.wsManager = null;

        this.removeBackground = false;
        this.refreshSites = false;
        this.refreshMode = null;
    }

    componentDidMount() {
        this.initWebSocket();
    }

    componentWillUnmount() {
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }

    componentDidUpdate() {
        if (this.refreshMode) {
            this.setState({ mode: this.refreshMode });
            this.refreshMode = null;
        }
    }

    async initWebSocket() {
        const userInfo = await ProjectResource.initUserInfo();

        if (userInfo?.options?.webSocketPort) {
            this.wsManager = new wsManager(userInfo.options.webSocketPort);
        }

        this.setState({ loading: false });
    }

    /*setWSManager = (wsManager) => {
        this.wsManager = wsManager;
    }*/

    onChangeMode = (mode, parameter) => {
        let dataCenter = this.state.dataCenter;
        let dashboardSubMode = this.state.dashboardSubMode;

        if (parameter) {
            if (Array.isArray(parameter)) {
                for (const param of parameter) {
                    if (param.type === Interchange.paramType.dataCenter) {
                        dataCenter = param.data;
                    }
                    else if (param.type === Interchange.paramType.dashboardSubMode) {
                        dashboardSubMode = param.data;
                    }
                }
            }
            else {
                if (parameter.type === Interchange.paramType.dataCenter) {
                    dataCenter = parameter.data;
                }
                else if (parameter.type === Interchange.paramType.dashboardSubMode) {
                    dashboardSubMode = parameter.data;
                }
            }
        }

        let showInventoryManagement = false;

        if (mode === Interchange.Mode.main_InventoryManagement) {
            mode = Interchange.Mode.main;
            showInventoryManagement = true;
        }

        if (mode === Interchange.Mode.edit) {
            if (this.state.mode === mode) {
                this.refreshMode = mode;
                this.setState({ mode: Interchange.Mode.dashboard, dataCenter, dashboardSubMode, prevMode: this.state.mode, newRegistMode: false, showInventoryManagement, cameraOn: true });
            }
            else {
                this.setState({ mode, dataCenter, dashboardSubMode, prevMode: this.state.mode, newRegistMode: false, showInventoryManagement, cameraOn: true });
            }
        }
        else {
            this.setState({ mode, dataCenter, dashboardSubMode, prevMode: this.state.mode, newRegistMode: false, showInventoryManagement });
        }
    }

    setNewRegistMode = (mode) => {
        if (mode === false) {
            if (this.state.mode === Interchange.Mode.main || this.state.mode === Interchange.Mode.edit) {
                this.removeBackground = true;
            }
        }

        this.setState({ newRegistMode: mode });
    }

    getBackgroundOption = () => {
        const removeBackground = this.removeBackground;
        this.removeBackground = false;
        return removeBackground;
    }

    setRefreshSites = () => {
        this.refreshSites = true;
    }

    getRefreshSites = () => {
        const refreshSites = this.refreshSites;
        this.refreshSites = false;
        return refreshSites;
    }

    static makeParameter(parameterType, parameter) {
        const param = {
            type: parameterType,
            data: parameter
        }

        return param;
    }

    onCloseConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        this.setState({ confirmMessage });
    }


    showConfirmDialog = (title, messages, buttons, onClickButton, icon) => {
        const confirmMessage = this.getConfirmMessage(title, messages, buttons, onClickButton, icon);
        this.setState({ confirmMessage });
    }

    getConfirmMessage(title, messages, buttons, onClickButton, icon) {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.title = title;
        confirmMessage.buttons = buttons;
        confirmMessage.onClickButton = onClickButton;
        confirmMessage.icon = icon;

        if (!messages) {
            confirmMessage.messages = [""];
        }
        else if (Array.isArray(messages)) {
            confirmMessage.messages = messages;
        }
        else {
            confirmMessage.messages = [messages];
        }

        return confirmMessage;
    }

    getDateString(date) {
        const index1 = date.indexOf('-');

        if (index1 < 0) {
            return "";
        }

        const index2 = date.indexOf('-', index1 + 1);

        if (index2 < index1) {
            return "";
        }

        const year = date.substring(0, index1);
        const month = date.substring(index1 + 1, index2);
        const day = date.substring(index2 + 1, index2 + 3);

        return year + "." + month + "." + day;
    }

    showRootMessageBox = (state, message) => {
        const user = ProjectResource.getUserInfo();

        if (user) {
            if (state === AccountResource.loginState.licenseExpired) {
                if (user.siteData?.serviceEndDate) {
                    this.setState({ confirmMessage: this.getConfirmMessage(ProjectResource.ID.messageBox.title.warning, [message, "만료일 : " + this.getDateString(user.siteData.serviceEndDate)], [], this.onCloseConfirmDialog, ConfirmDialog.icon.warning) });
                }
            }
            else if (state === AccountResource.loginState.licenseWait) {
                if (user.siteData?.serviceBeginDate) {
                    this.setState({ confirmMessage: this.getConfirmMessage(ProjectResource.ID.messageBox.title.warning, [message, "개시일 : " + this.getDateString(user.siteData.serviceBeginDate)], [], this.onCloseConfirmDialog, ConfirmDialog.icon.warning) });
                }
            }
            else if (state === AccountResource.loginState.licenseAlert) {
                if (!this.state.licenseAlertCheck && user.siteData?.serviceEndDate) {
                    this.setState({ licenseAlertCheck: true, confirmMessage: this.getConfirmMessage(ProjectResource.ID.messageBox.title.info, [message, "만료일 : " + this.getDateString(user.siteData.serviceEndDate)], ["확인"], this.onCloseConfirmDialog, ConfirmDialog.icon.check) });
                }
            }
        }
    }

    closeRootMessageBox = () => {
        if (this.state.confirmMessage.visible) {
            this.onCloseConfirmDialog();
        }
    }

    getCameraOnOff = () => {
        return this.state.cameraOn;
    }

    setCameraOnOff = (on, sendMessage = true) => {
        if (this.state.cameraOn !== on) {
            if (sendMessage) {
                if (this.wsManager) {
                    this.wsManager.cameraOnOff(on ? 1 : 0);
                }
            }

            this.setState({ cameraOn: on });
        }
    }

    getSensorOnOff = () => {
        return this.state.sensorOn;
    }

    setSensorOnOff = (on, sendMessage = true) => {
        if (this.state.sensorOn !== on) {
            if (sendMessage) {
                if (this.wsManager) {
                    this.wsManager.sensorOnOff(on ? 1 : 0);
                }
            }

            this.setState({ sensorOn: on });
        }
    }

    render() {
        if (this.state.loading) {
            return <></>;
        }

        if (this.state.mode === Interchange.Mode.dashboard) {
            return (
                <>
                    <Dashboard menuEvent={this.props.dashboardVDSEvent} dataCenter={this.state.dataCenter} prevMode={this.state.prevMode} subMode={this.state.dashboardSubMode} wsManager={this.wsManager} onChangeMode={this.onChangeMode} makeParameter={Interchange.makeParameter} isNewRegist={this.state.newRegistMode} setNewRegistMode={this.setNewRegistMode} getRefreshSites={this.getRefreshSites} setRefreshSites={this.setRefreshSites} closeRootMessageBox={this.closeRootMessageBox} showRootMessageBox={this.showRootMessageBox} getCameraOnOff={this.getCameraOnOff} setCameraOnOff={this.setCameraOnOff} getSensorOnOff={this.getSensorOnOff} setSensorOnOff={this.setSensorOnOff} />
                    {
                        this.state.confirmMessage.visible &&
                        <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} icon={this.state.confirmMessage.icon} />
                    }
                </>
            );
        }
        else if (this.state.mode === Interchange.Mode.main) {
            return (
                <>
                    <Main menuEvent={this.state.mainEvent} dataCenter={this.state.dataCenter} onChangeMode={this.onChangeMode} wsManager={this.wsManager} makeParameter={Interchange.makeParameter} isNewRegist={this.state.newRegistMode} setNewRegistMode={this.setNewRegistMode} getBackgroundOption={this.getBackgroundOption} getRefreshSites={this.getRefreshSites} setRefreshSites={this.setRefreshSites} closeRootMessageBox={this.closeRootMessageBox} showRootMessageBox={this.showRootMessageBox} getCameraOnOff={this.getCameraOnOff} setCameraOnOff={this.setCameraOnOff} getSensorOnOff={this.getSensorOnOff} setSensorOnOff={this.setSensorOnOff} showInventoryManagement={this.state.showInventoryManagement} />
                    {
                        this.state.confirmMessage.visible &&
                        <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} icon={this.state.confirmMessage.icon} />
                    }
                </>
            );
        }
        else if (this.state.mode === Interchange.Mode.edit) {
            return (
                <>
                    <Edit menuEvent={this.state.editEvent} dataCenter={this.state.dataCenter} onChangeMode={this.onChangeMode} wsManager={this.wsManager} makeParameter={Interchange.makeParameter} isNewRegist={this.state.newRegistMode} setNewRegistMode={this.setNewRegistMode} getBackgroundOption={this.getBackgroundOption} getRefreshSites={this.getRefreshSites} setRefreshSites={this.setRefreshSites} closeRootMessageBox={this.closeRootMessageBox} showRootMessageBox={this.showRootMessageBox} getCameraOnOff={this.getCameraOnOff} setCameraOnOff={this.setCameraOnOff} getSensorOnOff={this.getSensorOnOff} setSensorOnOff={this.setSensorOnOff} />
                    {
                        this.state.confirmMessage.visible &&
                        <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} icon={this.state.confirmMessage.icon} />
                    }
                </>
            );
        }

        return <></>;
    }
}

export default Interchange;