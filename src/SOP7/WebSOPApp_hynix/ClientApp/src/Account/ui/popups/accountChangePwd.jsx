import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';

import uis from '../../../Common/css/ui.module.css';
import contents from '../../../Common/css/content.module.css';
import uneCommon from '../../../Common/css/uneCommon.module.css';
import accounts from '../../css/account.module.css';

import { AccountController } from '../../services/accountController';
import ProjectResource from '../../../Root/resource/id';
import ConfirmDialog from '../../../Common/ui/confirmDialog';

import { AccountChangePwdPopup } from '../../styled/accountPopupsStyled';
import { ModalBackground } from '../../../Root/styled/variables';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';

class accountChangePwd extends Component {
	constructor(props) {
		super(props);

        this.refPassword = React.createRef();
        this.refRePassword = React.createRef();
        this.refPwd = React.createRef();

		this.state = {
            showMessage: "",
            result: null,
            mode: null,
            disableID: false,

            titleID: "",        
            placeID: i18n.t('account.ID를 입력하세요'),
            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: [i18n.t('common.확인')],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null
            },
		}

        this.props = props;
    }

	componentDidUpdate(prevProps, prevState) {
        //console.log('componentDidUpdate');
	}

	componentDidMount() {
		//console.log('componentDidMount');
    }

    showConfirmDialog = (title, messages, buttons, onClickButton) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.title = title;
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

    onClick = () => {
        // 비밀번호 설정
        let error = "";

        const pwd = this.refPwd.current.value.toString().trim();
        const newPwd = this.refPassword.current.value.toString().trim();
        const newRePwd = this.refRePassword.current.value.toString().trim();

        if (pwd.length === 0) {
            error = i18n.t('account.비밀번호를 입력하세요');
        } else if (newPwd.length === 0) {
            error = i18n.t('account.새로운 비밀번호를 입력하세요');
        } else if (newRePwd.length === 0) {
            error = i18n.t('account.새로운 비밀번호를 한번 더 입력하세요');
        } else if (newPwd.length > 0 && newRePwd.length > 0 && newPwd !== newRePwd) {
            error = i18n.t('account.새로운 비밀번호가 서로 일치하지 않습니다');
        } else if (pwd === newPwd) {
            error = i18n.t('account.같은 비밀번호로 변경하실 수 없습니다');
        }

        if (error.length > 0) {
            this.showConfirmDialog(i18n.t('account.에러'), [error], null, null);
            return;
        }

        const num = newPwd.search(/[0-9]/g);
        const eng = newPwd.search(/[a-z]/ig);
        const spe = newPwd.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
        const hangulcheck = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

        if (newPwd.length < 8 || newPwd.search(/\s/) != -1 || num < 0 || spe < 0 || (eng < 0 && hangulcheck.test(newPwd) === false)) {
            error = i18n.t('account.문자, 숫자, 특수문자를 혼합하여 8자리 이상 공백없이 설정해주세요');
        } 

        if (error.length > 0) {
            this.showConfirmDialog(i18n.t('account.에러'), [error], null, null);
            return;
        }

        this.setPassword(pwd, newPwd);
    }

    async setPassword(pwd, newPwd) {
        this.setState({ showMessage: i18n.t('account.처리 중입니다') });

        // id 값 불러오기
        let user = ProjectResource.getUserInfo();
        if (user === null || user === undefined) {
            let message = i18n.t('account.유저 정보를 불러 올 수 없습니다. 관리자에게 문의바람');
            this.showConfirmDialog(i18n.t('account.에러'), [message], null, null);
            this.setState({ showMessage: message });
        }

        const [result, message] = await AccountController.setPassword(user.id, user.userID, pwd, newPwd);

        if (result === null) {
            this.setState({ showMessage: message });
            this.showConfirmDialog(i18n.t('account.에러'), [message], null, null);
        } else if (result.success === true) {
            this.setState({ showMessage: "비밀번호 변경 성공" });
            this.showConfirmDialog(i18n.t('account.성공'), [i18n.t('account.비밀번호 변경 성공')], [i18n.t('common.확인')], this.onClickCancle);
        } else if (result.success === false) {
            this.showConfirmDialog(i18n.t('account.에러'), [message], null, null);
        }
    }

    onClickCancle = () => {
        this.props.onClickCloseChangePwd();
    }

    render() {

		return (
			<ModalBackground>
                <AccountChangePwdPopup id={'popupConts'} className={'loginPopup'}>
                    <div className={'passwordConts'}>
                        <div className={'passwordBoxTitle'}>{i18n.t('account.비밀번호 변경')}</div>

                        <div className={'passwordBox'}>
                            <div className={'passwordBoxTxt'}>{this.state.showMessage}</div>
                            <table className={'tblNone'}>
                                <caption>{i18n.t('account.게시판 입니다')}</caption>
                                <colgroup>
                                    <col style={{ width: "30%" }} />
                                    <col style={{ width: "*" }} />
                                </colgroup>
                                <tbody id="userInfo" >
                                    <tr>
                                        <td>{i18n.t('account.비밀번호')}</td>
                                        <td><input type="password" ref={this.refPwd} className={'DblueInput'} placeholder={i18n.t('account.기존 비밀번호를 입력하세요')} /></td>
                                    </tr>
                                    <tr id="rowPassword">
                                        <td>{i18n.t('account.새 비밀번호')}</td>
                                        <td><input type="password" ref={this.refPassword} className={'DblueInput'} placeholder={i18n.t('account.새 비밀번호를 입력하세요')} /></td>
                                    </tr>
                                    <tr id="rowRepassword">
                                        <td>{i18n.t('account.새 비밀번호 확인')}</td>
                                        <td><input type="password" ref={this.refRePassword} className={'DblueInput'} placeholder={i18n.t('account.새 비밀번호를 입력하세요')} /></td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className={'gap20'}></div>

                            <div className={'btnArea'}>
                                <a onClick={this.onClick} className={'btnBlue'}>{i18n.t('common.확인')}</a>
                                <a onClick={this.onClickCancle} className={'btnNavy'}>{i18n.t('common.취소')}</a>
                            </div>
                        </div>

                    </div>
                </AccountChangePwdPopup>
                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
                }
			</ModalBackground>
        );
    }
}

export default withRouter(accountChangePwd);