import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { AccountManagerComponent } from '../styled/accountManagerStyled';
import { ModalBackground } from '../../Root/styled/theme';
import AccountResource from '../resource/id';
import ConfirmDialog from '../../Common/ui/confirmDialog';

import close_btn from '../../Common/images/close_btn.png';
import AccountList from './accountList';
import AccountAddUser from './accountAddUser';
import {AccountController} from "../services/accountController";
import ProjectResource from "../../Root/resource/id";
import {TeamEditController} from "../../TeamEditor/services/teamEditController";
import {SDMSController} from "../../SDMS/services/sdmsController";
import SDMS from "../../SDMS/ui/sdms";

class AccountManager extends Component {
    constructor(props) {
        super(props);
		
		this.state = {
            menu: AccountResource.menu.accountList,
            
            accountUsers: [],
            members: [],
            jobLevels: [],
            jobPositions: [],
            regular: [],
            accountLevels: [],
            
            confirmMessage: {
                visible: false,
                type: null,
                messages: [""],
                buttons: ["확인"],
                onClickButton: null
            },
            
            userMemos: null,
        }
	}
    
    componentDidMount() {
        this.init();
    }
    
    init = async () => {
        //const accountUsers = await AccountController.getAccountUsers(ProjectResource.Site.Busan);
        const accountUsers = await AccountController.getBusanTPAccountUsers();
        const members = await TeamEditController.DisplayRegularMember();
        const userMemos = await SDMSController.requestUserMemos();
        const jobLevels = await TeamEditController.GetJobLevels();
        const jobPositions = await TeamEditController.GetJobPositions();
        const regular = await TeamEditController.GetRegular();
        const accountLevels = await AccountController.getAccountLevels();
        
        const userInfo = ProjectResource.getUserInfo();
        
        if (!accountUsers || !members) {
            this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["계정 및 권한 정보를 불러오는데 실패하였습니다."], null, null);
            return;
        }
        
        this.setState({ accountUsers, members, userMemos, jobLevels, jobPositions, regular, accountLevels });
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

    onClickMenu = (menu) => {
        this.setState({ menu: menu });
    }
    
    sortAccountUsers = (sortType, sortOrder) => {
        const { accountUsers } = this.state;
        let sortedUsers = [...accountUsers];
        
        if (!sortedUsers || sortedUsers.length === 0) {
            return;
        }

        switch (sortType) {
            case AccountList.sortType.id:
                sortedUsers.sort((a, b) => sortOrder === 'desc' ? a.id - b.id : b.id - a.id);
                break;
            case AccountList.sortType.regular:
                sortedUsers.sort((a, b) => sortOrder === 'desc' ? a.regular.id - b.regular.id : b.regular.id - a.regular.id);
                break;
            case AccountList.sortType.jobLevel:
                sortedUsers.sort((a, b) => sortOrder === 'desc' ? a.jobLevel.name.localeCompare(b.jobLevel.name) : b.jobLevel.name.localeCompare(a.jobLevel.name));
                break;
            case AccountList.sortType.userLevel:
                sortedUsers.sort((a, b) => sortOrder === 'desc' ? a.accountLevel.levelName.localeCompare(b.accountLevel.levelName) : b.accountLevel.levelName.localeCompare(a.accountLevel.levelName));
                break;
            default:
                break;
        }
        
        this.setState({ accountUsers: sortedUsers });
    }
    
    saveUserInfo = async (user, userMemo) => {
        
        let userInfo = ProjectResource.getUserInfo();
        
        if (!userInfo) {
            this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["사용자 정보를 불러오는데 실패하였습니다."], ['확인'], this.onCloseConfirmDialog);
            return;
        }
        
        const result = await SDMSController.requestSaveUser(user.accountID, userMemo, user.accountLevel.id);
        
        if (!result.success) {
            this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["사용자 정보를 저장하는데 실패하였습니다. " + result.message], ['확인'], this.onCloseConfirmDialog);
            return;
        }

        const userMemos = await SDMSController.requestUserMemos();
        
        this.setState({ userMemos });
        
        this.showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, ["사용자 정보를 저장하였습니다."], ['확인'], this.onCloseConfirmDialog);
    }
    
    deleteUser = async (user) => {
        if (!user)
            return this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["사용자 정보를 불러오는데 실패하였습니다."], ['확인'], this.onCloseConfirmDialog);
        
        if (user.password === "")
            return this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["삭제할 수 없는 사용자입니다. 관리자에게 문의해주세요."], ['확인'], this.onCloseConfirmDialog);
        
        const result = await AccountController.deleteUser(user.accountID);
        
        if (!result.success) {
            return this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["사용자 정보를 삭제하는데 실패하였습니다. " + result.message], ['확인'], this.onCloseConfirmDialog);
        }
        
        return this.init();
    }

    getDisplayView = () => {
        let ui = [];

        if (this.state.menu === AccountResource.menu.accountList) {
            ui.push(
                <AccountList
                    key="AccountManager_AccountList"
                    showConfirmDialog={this.showConfirmDialog}
                    onCloseConfirmDialog={this.onCloseConfirmDialog}
                    accountUsers={this.state.accountUsers}
                    members={this.state.members}
                    sortAccountUsers={this.sortAccountUsers}
                    saveUserInfo={this.saveUserInfo}
                    deleteUser={this.deleteUser}
                    userMemos={this.state.userMemos}
                />
            );
        }
        else if (this.state.menu === AccountResource.menu.accountAddUser) {
            ui.push(
                <AccountAddUser
                    key="AccountManager_AccountAddUser"
                    showConfirmDialog={this.showConfirmDialog}
                    onCloseConfirmDialog={this.onCloseConfirmDialog}
                    accountUsers={this.state.accountUsers}
                    members={this.state.members}
                    jobLevels={this.state.jobLevels}
                    jobPositions={this.state.jobPositions}
                    regular={this.state.regular}
                    accountLevels={this.state.accountLevels}
                    init={this.init}
                />
            );
        }
        
        return ui;
    }

    render() {
        const { menu } = this.state;
        const ui = this.getDisplayView();

        return (
            <ModalBackground className={"UI_Section"}>
            <AccountManagerComponent className={"UI_Section"}>
            <button onClick={() => this.props.handlePopup('accountManager', false)} className={'closeBtn'}>
                <img src={close_btn} alt='닫기 버튼' width={16} height={16} />
            </button>
            <div className='menuWrap'>
                <h2>계정 및 권한관리</h2>
                <ul>
                    <li className={menu === AccountResource.menu.accountList ? 'on' : null} onClick={() => this.onClickMenu(AccountResource.menu.accountList)}>{AccountResource.ID.menu.accountList}</li>
                    <li className={menu === AccountResource.menu.accountAddUser ? 'on' : null} onClick={() => this.onClickMenu(AccountResource.menu.accountAddUser)}>{AccountResource.ID.menu.accountAddUser}</li>
                </ul>
            </div>
            {ui}
            </AccountManagerComponent>
            {
                /* alert창 대신 사용 */
                this.state.confirmMessage.visible &&
                <ConfirmDialog 
                    type={this.state.confirmMessage.type}
                    messages={this.state.confirmMessage.messages} 
                    buttons={this.state.confirmMessage.buttons} 
                    onClickButton={this.state.confirmMessage.onClickButton}
                    onCloseConfirmDialog={this.onCloseConfirmDialog}
                />
            } 
            </ModalBackground>
        );
    }
}

export default withRouter(AccountManager);