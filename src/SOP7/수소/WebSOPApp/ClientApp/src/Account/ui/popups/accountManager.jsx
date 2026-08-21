import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';

import { AccountController } from '../../services/accountController';
import { TeamEditController } from '../../../TeamEditor/services/teamEditController';

import ProjectResource from "../../../Root/resource/id";
import AccountResource from '../../resource/id';

import { AccountManagerComponent } from '../../styled/accountPopupsStyled.js';
import { ModalBackground } from '../../../Root/styled/variables';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';
import close_btn from '../../../Common/img/imghydrogen/main/close_icon.svg';
import AccountList from './accountList';
import AccountAddUser from './accountAddUser';


class AccountManager extends Component {

	constructor(props) {
		super(props);

		this.state = {
            /* mode: i18n.t('account.사용자 권한 관리'), */
            menu: AccountResource.menu.accountList,
            levels: [],
            //isLoading: true,
		}

        this.props = props;

        this.init();
    }

	componentDidUpdate(prevProps, prevState) {
        //console.log('componentDidUpdate');
	}

	componentDidMount() {
		//console.log('componentDidMount');
    }

    async init() {
        let siteID = null;
        const userInfo = await ProjectResource?.initUserInfo();

        const accountLevels = await AccountController.getAccountLevels();
        this.state.accountLevels = accountLevels;

        let temp = { value: -1, name: "-" };

        const levels = [];
        levels.push(temp);

        for (let i = 0; i < accountLevels?.length; i++) {
            const item = { value: accountLevels[i].id, name: accountLevels[i].levelName };
            levels.push(item);
        }

        //this.state.levels = levels;
        this.setState({ levels });
    }

    setMenuUI = () => {
        let menuUI = [];

        if (this.state.menu === AccountResource.menu.accountList) {
			menuUI.push(
                <AccountList key="AccountList" levels={this.state.levels} accountUsers={this.props.accountUsers} />
			);
		} else if (this.state.menu === AccountResource.menu.accountAddUser) {
            menuUI.push(
                <AccountAddUser key="AccountAddUser" levels={this.state.levels} accountUsers={this.props.accountUsers} />
            );
        }

        return menuUI;
    }

    onClickMenu = (menu) => {
        this.setState({ menu : menu });
    }

    render() {

        const menuUI = this.setMenuUI();

		return (
			<ModalBackground>
                <AccountManagerComponent>
                    <button onClick={() => this.props.onClickCloseAccountMgr()} className={'closeBtn'}>
                        <img src={close_btn} alt='닫기 버튼' width={24} height={24} />
                    </button>
                    <div className='menuWrap'>
                        <h2>{i18n.t('account.계정 및 권한관리')}</h2>
                        <ul>
                            <li className={this.state.menu === AccountResource.menu.accountList ? 'on' : null} onClick={() => this.onClickMenu(AccountResource.menu.accountList)}>{i18n.t('account.목록')}</li>
                            <li className={this.state.menu === AccountResource.menu.accountAddUser ? 'on' : null} onClick={() => this.onClickMenu(AccountResource.menu.accountAddUser)}>{i18n.t('account.신규 등록')}</li>
                        </ul>
                    </div>
                    {menuUI}
                </AccountManagerComponent>
                {/* {
                    confirmMessage.visible &&
                    <ConfirmDialog 
                        type={confirmMessage.type}
                        messages={confirmMessage.messages} 
                        buttons={confirmMessage.buttons} 
                        onClickButton={confirmMessage.onClickButton}
                        onCloseConfirmDialog={onCloseConfirmDialog}
                    />
                } */}
            </ModalBackground>
        );
    }
}

export default withRouter(AccountManager);