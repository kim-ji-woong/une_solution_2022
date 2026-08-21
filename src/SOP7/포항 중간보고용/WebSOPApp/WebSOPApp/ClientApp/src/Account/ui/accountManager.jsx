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

class AccountManager extends Component {
    constructor(props) {
        super(props);
		
		this.state = {
            menu: AccountResource.menu.accountList,
            
            accountUsers: [],
            members: [],

            confirmMessage: {
                visible: false,
                type: null,
                messages: [""],
                buttons: ["확인"],
                onClickButton: null
            },
        }
	}
    
    componentDidMount() {
        this.init();
    }
    
    init = async () => {
        const accountUsers = await AccountController.getAccountUsers(ProjectResource.Site.Busan);
        const members = await TeamEditController.DisplayRegularMember();
        
        if (!accountUsers || !members) {
            this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["계정 및 권한 정보를 불러오는데 실패하였습니다."], null, null);
            return;
        }
        
        this.setState({ accountUsers, members });
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
    
    sortAccountUsers = (sortType) => {
        const { accountUsers } = this.state;
        let sortedUsers = [...accountUsers];
        
        switch (sortType) {
            case AccountList.sortType.id:
                sortedUsers.sort((a, b) => a.id - b.id);
                break;
            case AccountList.sortType.regular:
                sortedUsers.sort((a, b) => a.regular.id - b.regular.id);
                break;
            case AccountList.sortType.jobLevel:
                sortedUsers.sort((a, b) => a.jobLevel.localeCompare(b.jobLevel));
                break;
            case AccountList.sortType.userLevel:
                sortedUsers.sort((a, b) => a.userLevel.localeCompare(b.userLevel));
                break;
            default:
                break;
        }
        
        this.setState({ accountUsers: sortedUsers });
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