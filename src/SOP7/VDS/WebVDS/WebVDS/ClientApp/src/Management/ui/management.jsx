import React, { Component } from 'react';
import $ from 'jquery';

import dash from '../../Dashboard/css/dash.module.css';

import SystemManagement from './systemManagement';
import PropertyManagement from './propertyManagement';
import VDCManagement from './vdcManagement';
import ManagementController from '../services/managementController';
import ConfirmDialog from '../../Common/ui/confirmDialog';
import Interchange from '../../Root/interchange';
import CommonResource from '../../Common/resource/id';
import ProjectResource from '../../Root/resource/id';
import AccountResource from '../../Account/resource/id';
import Edit from '../../PropertyEdit/ui/edit';


class Management extends Component {
    static mode = {
        newRegist: 1,
        vdcList: 2,
        itPropertyList: 3,
        itPropertyNewRegist: 4,
        userAccess: 5,
        codeManager: 6,
        multiTennant: 7,
        billing: 8,
        interface: 9
    }

    static baseID = "managementBasePopup";

    constructor(props) {
        super(props);

        this.state = {
            sites: [],
            nations: [],
            allNations: [],
            currentMode: Management.mode.vdcList,
            loading: true,
            loadingData: false,

            treeElement: {
                systemManagement: 1,
                propertyManageMent: 2,
                vdcManageMent: 3
            },

            treeVisible: {
                sysVisible: false,
                propVisible: false,
                vdcVisible: true
            },

            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null,
                icon: null
            }
        }

        this.readDatas();
    }

    componentDidMount() {
        /* $(document).ready(function () {
            $('.' + dash.systemTitleBox).click(function () {
                $('.' + dash.systemContentsBox).toggle();
            });
            $('.' + dash.propertyTitleBox).click(function () {
                $('.' + dash.property3Dcontents).toggle();
            });
            $('.' + dash.vdcManageTitleBox).click(function () {
                $('.' + dash.vdcManageContents).toggle();
            });
        }); */

        $(document).ready(function () {
            $('.systemTitle').click(function () {

                /* var submenu = $(this).next('ul');

                if (submenu.is(':visible')) {
                    submenu.slideUp();
                } else {
                    submenu.slideDown();
                } */

                $('.systemContentsBox').removeClass("hide");
            });
        });
    }

    componentWillUnmount() {
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }

    async readDatas() {
        const user = ProjectResource.getUserInfo();

        if (user) {
            const [result, errorMessage] = await ManagementController.requestSiteNDataCenters(user.id);

            if (result) {
                this.setState({ sites: result.sites, nations: result.nations, allNations: result.allNations, loading: false });
            }
            else {
                this.alertMessage(errorMessage, ProjectResource.ID.messageBox.title.error);
            }
        }
    }

    setCurrentMode(mode, user) {
        if (mode === Management.mode.newRegist) {
            if (this.enableMakeDataCenter(user) === false) {
                return;
            }
        }

        this.setState({ currentMode: mode });
    }

    onClose = (param) => {
        if (param) {
            this.props.onClose(param);
        }
        else {
            if (this.props.dashboard) {
                this.props.dashboard.reloadDatas();
            }

            this.props.onClose(param);
        }
    }

    setTree = (param) => {

        let visible = this.state.treeVisible;

        if (param === this.state.treeElement.systemManagement) {
            visible.sysVisible = !this.state.treeVisible.sysVisible;
        } else if (param === this.state.treeElement.propertyManageMent) {
            visible.propVisible = !this.state.treeVisible.propVisible;
        } else {
            visible.vdcVisible = !this.state.treeVisible.vdcVisible;
        }

        this.setState({ treeVisible: visible });

    }

    enableEdit(user) {
        if (Edit.isEditableUser(user) === false) {
            return false;
        }

        return true;
    }

    enableMakeDataCenter(user) {
        if (user && user.levelID <= AccountResource.accountLevel.vdcSupervisor) {
            return true;
        }

        return false;
    }

    enableEditUser(user) {
        if (user && user.levelID <= AccountResource.accountLevel.vdcSupervisor) {
            return true;
        }

        return false;
    }

    onCloseConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        this.setState({ confirmMessage });
    }


    showConfirmDialog = (title, messages, buttons, onClickButton, icon = ConfirmDialog.icon.check) => {
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

        this.setState({ confirmMessage });
    }

    alertMessage = (message, messageType = ProjectResource.ID.messageBox.title.warning, icon = ConfirmDialog.icon.warning) => {
        this.showConfirmDialog(messageType, [message], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog(), icon);
    }

    onLoading = (loading) => {
        this.setState({ loadingData: loading });
    }

    render() {
        if (this.state.loading) {
            if (this.state.confirmMessage.visible) {
                return (
                    <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} icon={this.state.confirmMessage.icon} />
                );
            }

            return <></>;
        }

        const user = ProjectResource.getUserInfo();

        if (!user) {
            return <></>;
        }

        const enableEdit = this.enableEdit(user);

        let vdcListText = 'vdcList';
        let vdcNewRegiText = 'vdcNewRegi';
        let vdcUserManage = "userManage";
        let itPropertyList = "property3DList";

        if (this.state.currentMode === Management.mode.vdcList) {
            vdcListText = 'vdcListActive';
        }
        else if (this.state.currentMode === Management.mode.newRegist) {
            vdcNewRegiText = 'vdcNewRegiActive'
        }
        else if (this.state.currentMode === Management.mode.userAccess) {
            vdcUserManage += ' active';
        }
        else if (this.state.currentMode === Management.mode.itPropertyList) {
            itPropertyList = 'property3DListActive';
        }
        
        return (
            <>
                <div id={dash.ITpropertyPop}>
                    <div>
                        <div>
                            <div id={Management.baseID} className={dash.managementPopup + " " + CommonResource.UISection}>
                                <div className={dash.managementMenu}>
                                    <span className={dash.managementMenuBox}>
                                        <span className={dash.managementIcon}></span>
                                        <span className={dash.managementTitle}>관리페이지</span>
                                    </span>
                                    <span className={dash.underLineM}></span>

                                    <ul>
                                        <li className="systemTitleBox">
                                            <span className="systemTitle" onClick={() => this.setTree(this.state.treeElement.systemManagement)}>시스템 관리</span>

                                            {
                                                this.state.treeVisible.sysVisible && 
                                                <ul className="systemContentsBox">
                                                    <li className={vdcUserManage} onClick={() => this.setCurrentMode(Management.mode.userAccess, user)}>사용자권한관리</li>
                                                    {/*<li className="codeManage">코드관리</li>
                                                    <li className="multiManage">멀티태넌트 관리</li>
                                                    <li className="meterManage">Meter/Billing 정책관리</li>
                                                    <li className="interFaceManage">인터페이스 설정관리</li>*/}
                                                </ul>
                                            }
                                        </li>
                                        <span className={dash.underLineM}></span>

                                        <li className="propertyTitleBox">
                                            <span className="property3DTitle" onClick={() => this.setTree(this.state.treeElement.propertyManageMent)}>3D자산 Lib.관리</span>
                                            {this.state.treeVisible.propVisible &&
                                                <ul className="property3Dcontents">
                                                    <li className={itPropertyList} onClick={() => this.setCurrentMode(Management.mode.itPropertyList, user)}>3D자산 목록</li>
                                                    {/*<li className="propertyNewRegi">3D자산 신규등록</li>*/}
                                                </ul>
                                            }
                                        </li>
                                        <span className={dash.underLineM}></span>

                                        <li className="vdcManageTitleBox">
                                            <span className="vdsManageTitle" onClick={() => this.setTree(this.state.treeElement.vdcManageMent)}>VDC관리</span>
                                            {this.state.treeVisible.vdcVisible &&
                                                <ul className="vdcManageContents">
                                                    <li className={vdcListText} onClick={() => this.setCurrentMode(Management.mode.vdcList, user)}>VDC 목록</li>
                                                    <li className={vdcNewRegiText} onClick={() => this.setCurrentMode(Management.mode.newRegist, user)}>VDC 신규등록</li>
                                                </ul>
                                            }
                                        </li>
                                    </ul>
                                </div>

                                <div className={dash.managementContents}>
                                 <SystemManagement currentMode={this.state.currentMode} site={this.props.site} onClose={this.onClose} alertMessage={this.alertMessage} enableEdit={enableEdit} enableEditUser={this.enableEditUser(user)} />   {/* 시스템 관리 */}
                                    <PropertyManagement currentMode={this.state.currentMode} user={user} alertMessage={this.alertMessage} showConfirmDialog={this.showConfirmDialog} onCloseConfirmDialog={this.onCloseConfirmDialog} onClose={this.onClose} />
                                    <VDCManagement sites={this.state.sites} nations={this.state.nations} allNations={this.state.allNations} currentMode={this.state.currentMode} wsManager={this.props.wsManager} onClose={this.onClose} getRefreshSites={this.props.getRefreshSites} setRefreshSites={this.props.setRefreshSites} alertMessage={this.alertMessage} showConfirmDialog={this.showConfirmDialog} onCloseConfirmDialog={this.onCloseConfirmDialog} enableEdit={enableEdit} makeDataCenter={this.enableMakeDataCenter(user)} onLoading={this.onLoading} setCameraOnOff={this.props.setCameraOnOff} setSensorOnOff={this.props.setSensorOnOff} /> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.state.loadingData &&
                    <div className={dash.loadingPop}>
                        <div>
                            <div>
                                <div className={dash.loading}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} icon={this.state.confirmMessage.icon} />
                }
            </>
        );
    }
}

export default Management;