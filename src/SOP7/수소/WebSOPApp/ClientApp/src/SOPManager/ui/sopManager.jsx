import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styles from '../../Common/css/style.module.css';
import bodyStyles from '../../Common/css/style.module.css';
import SopManagerContent from './sopManagerContent';

import $ from 'jquery';
import SopManagerBody from './sopManagerBody';
import Footer from './footer';

import OpenSOPOptions from './popup/openSOPOptions';
import DeleteSOPOptions from './popup/deleteSOPOptions';

import SaveSOPOptions from './popup/saveSOPOptions';
import SopController from '../services/sopController';

import SessionString from '../../Common/js/sessionString';
import SopDataManager from '../services/sopDataManager';
import { TeamEditController } from '../../TeamEditor/services/teamEditController';

import SopManagerResource from '../resource/id';
import ProjectResource from '../../Root/resource/id';
import { SDMSController } from '../../SDMS/services/sdmsController';

import ConfirmDialog from '../../Common/ui/confirmHydrogen';
import AccountResource from '../../Account/resource/id';
import RootResource from '../../Root/resource/id';

import SettingsStore from '../../Settings/settingsStore';
import { i18n, withTranslation } from '../../language/i18n';

class SopManager extends Component {    
    constructor(props)
    {
        super(props);

        this.state = {
            selectedSiteID: null,
            content: props.menu,
            menuDatas: null,
            showCascading:
            {
                actionStep: false,
                addComponent: false,
                specialCharacter: false,
                userDefined: false
            },
            loginUser: null,
            sopData: null,
            prevProps: props,

            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: [''],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null
            },
        }

        this.bNeedToSave = false // 저장이 필요한지 (사이트변경할때 저장안된내역있으면 저장하고 넘어감)
        this.props = props;
        this.refFileDialog = React.createRef();

        this.deleteDB = this.deleteDB.bind(this);
        this.loadActionStepNames();
    }

    componentDidMount()
    {
        const lang = ProjectResource.getLanguage();
        if (lang !== i18n.language) {
            i18n.changeLanguage(lang);
        }

        $('html, body').css({ 'display': 'block', 'height': '100%', 'overflow': 'hidden', 'color': '#000', 'font-size': '14px' });
        $('#subPage').css({ background:'#fff'});

        // 각 페이지 별로 클래스 초기화
        $('#subPage').addClass('sop');

        this.initUserInfo();
        this.processGetParameters(window.location.search);

        this.unsubscribe_SettingsStore = SettingsStore.subscribe(function () {
            let data = SettingsStore.getState();

            if (data.actionType === 'SELECT_SITEID') {
                this.changeSelectSiteID(data.selectSiteID);
            }
        }.bind(this));
    }

    componentWillUnmount() {
        this.unsubscribe_SettingsStore();
	}

    changeSelectSiteID = (siteID) => {
        const selectedSiteID = this.state.selectedSiteID;

        if (siteID && siteID !== selectedSiteID) {
			this.onChangeSite(siteID);
		}

    }

    async loadActionStepNames() {
        // 각 사이트별 단계배열 및 단계명 초기화
        await SopController.loadActionStepNames();
    }

    processGetParameters(parameters) {
        if (!parameters || parameters.length === 0) {
            return;
        }

        parameters = parameters.substring(1).trim();

        const params = parameters.split('&');
        const paramCount = params.length;

        for (let i = 0; i < paramCount; i++) {
            const datas = params[i].split('=');

            if (datas.length !== 2) {
                continue;
            }

            const paramName = datas[0].trim();
            const paramValue = datas[1].trim();

            if (paramName.toLowerCase() === "sop") {
                const versionID = parseInt(paramValue);

                if (versionID !== null && versionID !== undefined && isNaN(versionID) === false) {
                    this.openDB(versionID);
                    break;
                }
            }
        }
    }

    async initUserInfo() {
        // 권한 체크
        const userInfo = await ProjectResource.initUserInfo();
        if (!userInfo || userInfo === null) {
            this.showConfirmDialog(i18n.t('common.권한'), [i18n.t('sopManager.formText.로그인 정보가 없습니다')], [i18n.t('common.확인')], this.onClickFalseConfirm, this.onClickFalseConfirm);
            return;
        }

        if (userInfo.levelID !== AccountResource.accountLevelID.master &&
            userInfo.levelID !== AccountResource.accountLevelID.admin) {
            this.showConfirmDialog(i18n.t('common.권한'), [i18n.t('sopManager.formText.권한이 없습니다')], [i18n.t('common.확인')], this.onClickFalseConfirm, this.onClickFalseConfirm);
        }

        // Multi Site
        let selectedSiteID = this.state.selectedSiteID;
        if (selectedSiteID === null && ProjectResource.sites && ProjectResource.sites.length > 0) {            
            if (userInfo.levelID === AccountResource.accountLevelID.master) {
                selectedSiteID = ProjectResource.sites[0].id;
            } else if (userInfo.levelID === AccountResource.accountLevelID.admin) {
                for (let i = 0; i < ProjectResource.sites.length; i++) {
                    if (ProjectResource.sites[i].id === userInfo.siteID) {
                        selectedSiteID = ProjectResource.sites[i].id;
                        break;
                    }
                }
            }
        }

        this.setState({ loginUser: userInfo, selectedSiteID });
    }

    onClickFalseConfirm = () => {
        // 루트로 이동
        this.props.history.push(RootResource.path.root);
    }

    async reloadSiteID() {
        let siteID = ProjectResource.SiteID;

        if (siteID === null || siteID === undefined) {
            // 사이트 ID 요청
            const [result, message] = await SDMSController.requestGetSiteID();

            if (result !== null && result !== undefined) {
                siteID = result;
            }
        }

        return siteID;
    }

    static getDerivedStateFromProps(props, state) {
        if (props === state.prevProps) {
            return state;
        }

        return {
            content: state.content,
            menuDatas: state.menuDatas,
            showCascading:
            {
                actionStep: state.showCascading.actionStep,
                addComponent: state.showCascading.addComponent,
                specialCharacter: state.showCascading.specialCharacter,
                userDefined: state.showCascading.userDefined
            },
            loginUser: state.loginUser,
            sopData: state.sopData,
            prevProps: props
        };
    }

    changeContent = (content, menuDatas, showDlg) => {
        if (content === SopManagerResource.menu.SOP_편집) {
            if (menuDatas) {
                this.setState(
                    {
                        content: content,
                        sopData: menuDatas,
                        menuDatas: menuDatas,
                        showCascading:
                        {
                            actionStep: true,
                            addComponent: this.state.showCascading.addComponent,
                            specialCharacter: this.state.showCascading.specialCharacter,
                            userDefined: this.state.showCascading.userDefined
                        }
                    }
                );
            }
            else {
                this.setState({ content: content, sopData: menuDatas, menuDatas: menuDatas });
            }
        }
        else if (content === SopManagerResource.menu.저장) {
            if (showDlg) {
                this.setState({ content: content, sopData: menuDatas, menuDatas: menuDatas });
            }
            else {
                this.saveDB(menuDatas);
            }
        }
        else if (content === SopManagerResource.menu.파일_저장) {
            this.saveXML(menuDatas);
        }
        else if (content === SopManagerResource.menu.열기) {
            if (menuDatas === null) {
                this.setState({ content: content, menuDatas: menuDatas });
            }
            else {
                this.openDB(menuDatas);
            }
        }
        else if (content === SopManagerResource.menu.삭제) {
            if (menuDatas !== null) {
                this.onDeleteDB(menuDatas);
            }

            this.setState({ content: content, menuDatas: menuDatas });
        }
        else if (content === SopManagerResource.menu.파일_열기) {
            this.openXML();
        }
        else {
            this.setState({ content: content, menuDatas: menuDatas });
        }
    }

    onDeleteDB = async (menuDatas) => {
        const versionIDs = menuDatas[0];
        const obj = menuDatas[1];
        const isNormal = menuDatas[2];
        const [resultVersionIDs, message2] = await SopController.requestLoadLinkedSopVersions(this.state.selectedSiteID, versionIDs);
        if (resultVersionIDs === null) {
            alert(message2);
            return;
        }

        this.confirmDialogData = menuDatas;
        if (resultVersionIDs.length > 0) {
            // 연결된거있음

            let message = "";
            if (resultVersionIDs.length === 1) {
                message = i18n.t('sopManager.formText.알람 발생시 자동실행이 연결된 SOP입니다. 그래도 삭제할까요?');
            }
            else {
                message = i18n.t('sopManager.formText.알람 발생시 자동실행이 연결된 SOP가 있습니다. 그래도 삭제할까요?');
            }

            this.showConfirmDialog("", [message], [i18n.t('common.삭제'), i18n.t('common.취소')], this.deleteDB);
        }
        else {
            this.deleteDB(0);
        }
    }

    async deleteDB(index) {
        this.onCloseConfirmDialog();
        if (index !== 0) {
            return;
        }

        const params = this.confirmDialogData
        const versionIDs = params[0];
        const obj = params[1];
        const isNormal = params[2];
        const [success, message] = await SopController.requestDeleteDB(versionIDs);

        if (success) {
            DeleteSOPOptions.postDeleteMethod(obj, isNormal);

            if (this.isCurrentVersion(versionIDs)) {
                this.clearSOP();
            }

            alert(i18n.t('sopManager.formText.삭제되었습니다'));
        }

        else {
            if (message && message.length > 0) {
                alert(message);
            }
        }
    }

    isCurrentVersion(versionIDs) {
        if (!versionIDs) {
            return false;
        }

        const sopData = this.state.sopData;

        if (sopData?.disaster) {
            const disaster = { ...sopData.disaster };

            for (const versionID of versionIDs) {
                if (versionID === disaster.versionID) {
                    return true;
                }
            }
        }

        return false;
    }

    async openDB(versionID) {
        const [sopDataResult, message] = await SopController.requestOpenDB(versionID);

        if (sopDataResult && sopDataResult.success) {
            // 새로 읽어들인 SopData를 새로운 Grid에 그리기 위하여 이전 Grid는 삭제한다.
            this.clearSOP();

            // 수신자 정보를 알아내기 위하여 팀 정보를 미리 얻어온다.
            sopDataResult.sopData.teamAllTreeDatas = await this.getAllTreeDatas();
            SopDataManager.setReceiverNames(sopDataResult.sopData);

            this.setCurrentActionStep(sopDataResult.sopData);
            this.checkArrows(sopDataResult.sopData);
            await this.checkStepMembers(sopDataResult.sopData);
            this.setState(
                {
                    content: SopManagerResource.menu.SOP_편집,
                    sopData: sopDataResult.sopData,
                    menuDatas: sopDataResult.sopData,
                    showCascading:
                    {
                        actionStep: true,
                        addComponent: this.state.showCascading.addComponent,
                        specialCharacter: this.state.showCascading.specialCharacter,
                        userDefined: this.state.showCascading.userDefined
                    }
                });
        }
        else {
            this.setState({ content: SopManagerResource.menu.SOP_편집, menuDatas: this.state.sopData });
            alert(message);
        }
    }

    async getAllTreeDatas() {
        const teamAllTreeDatas = {};
        
        teamAllTreeDatas.regular = await TeamEditController.DisplayRegular(this.state.selectedSiteID);
        teamAllTreeDatas.normal = await TeamEditController.DisplayTemporary(true, this.state.selectedSiteID);
        teamAllTreeDatas.emergency = await TeamEditController.DisplayTemporary(false, this.state.selectedSiteID);

        return teamAllTreeDatas;
    }

    openXML() {
        this.refFileDialog.current.click();
    }

    async checkStepMembers(sopData) {
        if (sopData) {
            const actionStepCount = sopData.actionStepDatas.length;
            
            for (let i = 0; i < actionStepCount; i++) {
                const actionStepData = sopData.actionStepDatas[i];

                if (actionStepData.stepMemberDatas.length === 0) {
                    const [stepMemberData, message] = await SopController.requestDefaultStepMemberData(actionStepData, this.state.selectedSiteID);

                    if (!stepMemberData) {
                        alert(message);
                        break;
                    }
                }
            }
        }
    }

    checkArrows(sopData) {
        if (sopData) {
            const actionStepCount = sopData.actionStepDatas.length;

            for (let i = 0; i < actionStepCount; i++) {
                const actionStepData = sopData.actionStepDatas[i];
                const stepMemberCount = actionStepData.stepMemberDatas.length;

                for (let j = 0; j < stepMemberCount; j++) {
                    const stepMemberData = actionStepData.stepMemberDatas[j];

                    if (stepMemberData.arrows.length > 0) {
                        stepMemberData.resetArrows = true;
                    }
                }
            }
        }
    }

    setCurrentActionStep(sopData) {
        sopData.actionStepDatas.map(actionStepData => {
            if (actionStepData.actionStep) {
                sopData.currentActionStep = actionStepData;
            }
        });
    }

    changeCascadingMode = (cascading, show) => {
        if (cascading === SopManagerResource.cascadingMenu.SOP_단계) {
            this.setState({
                showCascading:
                {
                    actionStep: show,
                    addComponent: this.state.showCascading.addComponent,
                    specialCharacter: this.state.showCascading.specialCharacter,
                    userDefined: this.state.showCascading.userDefined
                }
            });
        }
        else if (cascading === SopManagerResource.cascadingMenu.컴포넌트_추가) {
            this.setState({
                showCascading:
                {
                    actionStep: this.state.showCascading.actionStep,
                    addComponent: show,
                    specialCharacter: this.state.showCascading.specialCharacter,
                    userDefined: this.state.showCascading.userDefined
                }
            });
        }
        else if (cascading === SopManagerResource.cascadingMenu.특수문자_입력_형식) {
            this.setState({
                showCascading:
                {
                    actionStep: this.state.showCascading.actionStep,
                    addComponent: this.state.showCascading.addComponent,
                    specialCharacter: show,
                    userDefined: this.state.showCascading.userDefined
                }
            });
        }
        else if (cascading === SopManagerResource.cascadingMenu.사용자_정의_인자) {
            this.setState({
                showCascading:
                {
                    actionStep: this.state.showCascading.actionStep,
                    addComponent: this.state.showCascading.addComponent,
                    specialCharacter: this.state.showCascading.specialCharacter,
                    userDefined: show
                }
            });
        }
    }

    onSelectFile = (event) => {
        const file = event.target.files[0];
        this.refFileDialog.current.value = "";
        this._openXML(file);
    }

    async _openXML(file) {
        if (file) {
            const [sopDataResult, message] = await SopController.requestOpenXML(file);

            if (sopDataResult && sopDataResult.success) {
                // 새로 읽어들인 SopData를 새로운 Grid에 그리기 위하여 이전 Grid는 삭제한다.
                this.clearSOP();

                // 수신자 정보를 알아내기 위하여 팀 정보를 미리 얻어온다.
                sopDataResult.sopData.teamAllTreeDatas = await this.getAllTreeDatas();
                SopDataManager.setReceiverNames(sopDataResult.sopData);

                this.setCurrentActionStep(sopDataResult.sopData);
                this.checkArrows(sopDataResult.sopData);
                await this.checkStepMembers(sopDataResult.sopData);
                this.setState(
                    {
                        content: SopManagerResource.menu.SOP_편집,
                        sopData: sopDataResult.sopData,
                        menuDatas: sopDataResult.sopData,
                        showCascading:
                        {
                            actionStep: true,
                            addComponent: this.state.showCascading.addComponent,
                            specialCharacter: this.state.showCascading.specialCharacter,
                            userDefined: this.state.showCascading.userDefined
                        }
                    });
            }
            else {
                this.setState({ content: SopManagerResource.menu.SOP_편집, menuDatas: this.state.sopData });
                alert(message);
            }
        }
    }

    clearSOP() {
        this.setState(
            {
                content: SopManagerResource.menu.SOP_편집,
                sopData: null,
                menuDatas: null,
                showCascading:
                {
                    actionStep: true,
                    addComponent: this.state.showCascading.addComponent,
                    specialCharacter: this.state.showCascading.specialCharacter,
                    userDefined: this.state.showCascading.userDefined
                }
            });
    }

    async saveXML(sopData) {
        if (!sopData) {
            return;
        }

        const userID = this.state.loginUser ? this.state.loginUser.id : -1;
        const [sopDataResult, message] = await SopController.requestSaveXML(userID, sopData);

        if (sopDataResult === null) {
            alert(message);
        }
    }

    async saveDB(sopData) {
        if (!sopData) {
            return;
        }

        const userID = this.state.loginUser ? this.state.loginUser.id : -1;
        const [sopDataResult, message] = await SopController.requestSaveDB(userID, sopData);

        if (sopDataResult && sopDataResult.success) {
            this.checkArrows(sopDataResult.sopData);
            await this.checkStepMembers(sopDataResult.sopData);

            // 수신자 정보를 알아내기 위하여 팀 정보를 미리 얻어온다.
            sopDataResult.sopData.teamAllTreeDatas = await this.getAllTreeDatas();
            SopDataManager.setReceiverNames(sopDataResult.sopData);

            this.setState(
                {
                    content: SopManagerResource.menu.SOP_편집,
                    menuDatas: sopDataResult.sopData,
                    showCascading:
                    {
                        actionStep: true,
                        addComponent: this.state.showCascading.addComponent,
                        specialCharacter: this.state.showCascading.specialCharacter,
                        userDefined: this.state.showCascading.userDefined
                    },
                    sopData: sopDataResult.sopData
                }
            );
        }
        else {
            this.setState({ content: SopManagerResource.menu.SOP_편집, menuDatas: sopData });
            alert(message);
        }
    }

    getPopup() {
        if (this.state.content === SopManagerResource.menu.열기) {
            return <OpenSOPOptions sopData={this.state.sopData} content={this.changeContent} selectedSiteID={this.state.selectedSiteID} />;
        }
        else if (this.state.content === SopManagerResource.menu.삭제) {
            return <DeleteSOPOptions sopData={this.state.sopData} content={this.changeContent} showConfirmDialog={this.showConfirmDialog} onCloseConfirmDialog={this.onCloseConfirmDialog} selectedSiteID={this.state.selectedSiteID} />;
        }
        /*else if (this.state.content === SopManagerResource.menu.저장) {
            return <SaveSOPOptions sopData={this.state.sopData} content={this.changeContent} />;
        }*/

        return <></>;
    }

    showConfirmDialog = (title, messages, buttons, onClickButton, onClickClose) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.title = title;
        confirmMessage.buttons = buttons;
        confirmMessage.onClickButton = onClickButton;

        if (onClickClose !== null && onClickClose !== undefined)
            confirmMessage.onClose = onClickClose;

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

    closeConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;
        this.setState({ confirmMessage });
    }

    onCloseConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        this.setState({ confirmMessage });
    }

    getSiteList() {
        // 총괄관리자: 전체 건물 다 봄
        // 관리자: 해당하는 siteID만 봄(실행 권한 있음)
        // 사용자: 해당하는 SiteID만 봄(실행 권한 없음)
        const userAuthor = ProjectResource.getUserAuthor();
        if (userAuthor === AccountResource.accountLevelID.master) {
            return (
                ProjectResource.sites && ProjectResource.sites.map((site, index) => (
                    <li onClick={() => this.onChangeSite(site.id)}>{site.siteName}</li>
                ))
            );
        } else if (userAuthor === AccountResource.accountLevelID.admin) {
            const userInfo = ProjectResource.getUserInfo();
            console.log(userInfo);

            return (
                ProjectResource.sites && ProjectResource.sites.map((site, index) => (
                    site.id === userInfo.siteID &&
                    <li>{site.siteName}</li>
                ))
            );
        }
    }

    onChangeSite = (siteID) => {
        if (this.state.selectedSiteID === siteID) {
            return;
        }

        if (this.bNeedToSave) {
            this.showConfirmDialog(i18n.t('common.저장'), [i18n.t('sopManager.formText.변경된 내용이 있습니다. 저장할까요?')], [i18n.t('sopManager.formText.변경된 내용 저장'), i18n.t('sopManager.formText.변경된 내용 취소')], this.onNeedToSave);
        }

        this.setState({ selectedSiteID: siteID, content: SopManagerResource.menu.SOP_편집, sopData: null, menuDatas: null });
    }

    onNeedToSave = (index) => {
        if (index === 0) {
            //this.onClickSave();
        }

        this.onCloseConfirmDialog();
    }

    render() {
        //let siteList = this.getSiteList();

        return (
            <div id="subPage">
                
                <input ref={this.refFileDialog} className={bodyStyles.hidden} type='file' accept='.sop' onChange={this.onSelectFile} />
                <div id={styles.subAside} className={styles.sop}>
                    {/*siteList*/}
                    <SopManagerContent sopData={this.state.sopData} content={this.changeContent} loginUser={this.state.loginUser} />
                </div>
                <SopManagerBody
                    selectedSiteID={this.state.selectedSiteID}
                    menu={this.state.content}
                    menuDatas={this.state.menuDatas}
                    sopData={this.state.sopData}
                    showCascading={this.state.showCascading}
                    changeCascadingMode={this.changeCascadingMode}
                    content={this.changeContent}
                    loginUser={this.state.loginUser}
                    showConfirmDialog={this.showConfirmDialog}
                    onCloseConfirmDialog={this.onCloseConfirmDialog}/>
                {/*<Footer />*/}
                {
                    this.getPopup()
                }

                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
                }
            </div>



        );
    }
}

export default withRouter(withTranslation()(SopManager));