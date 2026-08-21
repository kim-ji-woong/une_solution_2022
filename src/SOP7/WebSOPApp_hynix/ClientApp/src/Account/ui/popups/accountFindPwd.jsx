import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';

import uis from '../../../Common/css/ui.module.css';
import contents from '../../../Common/css/content.module.css';
import uneCommon from '../../../Common/css/uneCommon.module.css';
import accounts from '../../css/account.module.css';

import { AccountController } from '../../services/accountController';
import { TeamEditController } from '../../../TeamEditor/services/teamEditController';

import AcoountResource from '../../resource/id';
import SessionString from '../../../Common/js/sessionString';

import ProjectResource from '../../../Root/resource/id';
import ConfirmDialog from '../../../Common/ui/confirmDialog';

import { SDMSController } from '../../../SDMS/services/sdmsController';
import AccountResource from '../../resource/id';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';

class accountFindPwd extends Component {
	constructor(props) {
		super(props);

        this.refID = React.createRef();
        this.refEmail = React.createRef();
        this.refPhone = React.createRef();
        this.refEmailMode = React.createRef();
        this.refSMSMode = React.createRef();

		this.state = {
            showMessage: "",
            result: null,
            mode: null,
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
            reload: null,
            prevValue: "",
		}

        this.props = props;
        this.initSiteID();

        this.textPlaceName = i18n.t('account.이름을 입력하세요');
        this.textPlaceEmail = i18n.t('account.Email를 입력하세요');
        this.textPlacePhone = i18n.t('account.핸드폰 번호를 입력하세요');
        this.textWrongEmail = i18n.t('account.이메일 주소 형식이 아닙니다');
        this.textWrongPhone = i18n.t('account.핸드폰 번호 형식이 아닙니다');

        this.textProcessing = i18n.t('account.처리 중입니다');
        this.textSuccess = i18n.t('account.성공');
        this.textFail = i18n.t('account.실패');
        this.textError = i18n.t('account.에러');
    }

	componentDidUpdate(prevProps, prevState) {
        //console.log('componentDidUpdate');

        //this.setUI();
	}

	componentDidMount() {
		//console.log('componentDidMount');

        this.checkParamsCode();
    }

    async initSiteID() {
        const siteID = ProjectResource.SiteID;

        if (siteID === null || siteID === undefined) {
            // 사이트 ID 요청
            const [result, message] = await SDMSController.requestGetSiteID();

            if (result !== null && result !== undefined) {
                ProjectResource.SiteID = result;
            }

            this.setState({ reload: true });
        }
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

    async checkParamsCode() {
        const search = window.location.search.substring(1);

        if (!search) {
            // 값이 없을 경우
            // 사용자 정보 입력 모드
            this.setState({
                mode: AcoountResource.findMode.email,
                showMessage: i18n.t('account.비밀번호 찾을 계정 정보를 입력해주세요'),
                titleID: i18n.t('account.이름'),
                placeID: i18n.t('account.이름을 입력하세요'),
            });

            return;
        }
    }

    onClick = () => {
        if (this.state.mode === AcoountResource.findMode.email) {
            const name = this.refID.current.value.toString().trim();
            const email = this.refEmail.current.value.toString().trim();

            if (name.length === 0) {
                this.showConfirmDialog(this.textError, [this.textPlaceName], null, null);
                return;
            }
            else if (email.length === 0) {
                this.showConfirmDialog(this.textError, [this.textPlaceEmail], null, null);
                return;
            }

            const patternEmail = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
            const emailValid = patternEmail.test(email);

            if (!emailValid) {
                this.showConfirmDialog(this.textError, [this.textWrongEmail], null, null);
                return;
            }

            this.changePassword(name, email, AcoountResource.findMode.email);

        } else if (this.state.mode === AcoountResource.findMode.sms) {
            const name = this.refID.current.value.toString().trim();
            const phone = this.refPhone.current.value.toString().trim();

            if (name.length === 0) {
                this.showConfirmDialog(this.textError, [this.textPlaceName], null, null);
                return;
            }
            else if (phone.length === 0) {
                this.showConfirmDialog(this.textError, [this.textPlacePhone], null, null);
                return;
            }

            const patternPhone = /01[016789]-[^0][0-9]{2,3}-[0-9]{3,4}/;
            const phoneValid = patternPhone.test(phone);

            if (!phoneValid) {
                this.showConfirmDialog(this.textError, [this.textWrongPhone], null, null);
                return;
            }

            this.changePassword(name, phone, AcoountResource.findMode.sms);
        }

    }

    async changePassword(name, value, mode) {
        this.setState({ showMessage: this.textProcessing });

        const [result, message] = await AccountController.changePassword(name, value, mode);

        if (result === null) {
            this.setState({ showMessage: message });
            this.showConfirmDialog(this.textError, [message], null, null);
        } else if (result.success === true) {
            this.setState({ showMessage: message });
            this.showConfirmDialog(this.textSuccess, [message], [this.textConfirm], this.onClickCancle);
        }
        else {
            this.setState({ showMessage: message });
            this.showConfirmDialog(this.textFail, [message], null, null);
        }
    }

    onClickCancle = () => {
        // 메인 페이지 이동
        this.props.history.push('/');
    }

    setUI = () => {
        // 모드에 따른 UI 변경
        if (this.state.mode === AcoountResource.findMode.email) {
            $('#userInfo').show();
            $('#rowEmail').show();
            $('#rowPhone').hide();
        } else if (this.state.mode === AcoountResource.findMode.sms) {
            $('#userInfo').show();
            $('#rowEmail').hide();
            $('#rowPhone').show();
        } 
    }

    displayInputUI = () => {
        let displayInputUI = [];

        if (this.state.mode === AcoountResource.findMode.sms) {
            displayInputUI.push(
                <>
                    <tr key={"userID"}>
                        <td>・ {this.state.titleID}</td>
                        <td><input type="text" ref={this.refID} id="userID" className={contents.DblueInput + " " + contents.w100p} placeholder={this.state.placeID} /></td>
                    </tr>
                    <tr key={"userPhone"} id="rowPhone">
                        <td>・ {i18n.t('account.핸드폰 번호')}</td>
                        <td>
                            <input
                                type="text"
                                ref={this.refPhone}
                                className={contents.DblueInput + " " + contents.w100p}
                                placeholder={i18n.t('account.핸드폰 번호를 입력하세요')}
                                onChange={(e) => this.onChangeCheck(e.target)} />
                        </td>
                    </tr>
                </>);
        } else {
            displayInputUI.push(
                <>
                    <tr key={"userID"}>
                        <td>・ {this.state.titleID}</td>
                        <td><input type="text" ref={this.refID} id="userID" className={contents.DblueInput + " " + contents.w100p} placeholder={this.state.placeID} /></td>
                    </tr>
                    <tr key={"userEmail"} id="rowEmail">
                        <td>・ {i18n.t('common.메일')}</td>
                        <td>
                            <input
                            type="text"
                            ref={this.refEmail}
                            className={contents.DblueInput + " " + contents.w100p}
                            placeholder={i18n.t('account.Email를 입력하세요')} />
                        </td>
                    </tr>
                </>);
        }

        return displayInputUI;
    }

    onChangeMode = (mode) => {
        const currentMode = this.state.mode;

        if (mode !== currentMode) {
            this.setState({ mode: mode });
        }
    }

    onChangeCheck = (e) => {
        let target = e;

        // 휴대전화일 경우 숫자 및 자릿수 제한
        const regex = /^[0-9\b -]{0,13}$/;
        let prevValue = this.state.prevValue;

        if (regex.test(target.value)) {
            let value = target.value;
            let inputValue = value.replace(/-/g, '');

            if (inputValue.length === 4) {
                inputValue = inputValue.replace(/(\d{3})(\d{1})/, '$1-$2');
            } else if (inputValue.length === 8) {
                inputValue = inputValue.replace(/(\d{3})(\d{4})(\d{1})/, '$1-$2-$3');
            } else if (inputValue.length === 10) {
                inputValue = inputValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            } else if (inputValue.length === 11) {
                inputValue = inputValue.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            } else if (inputValue.length < 12) {
                inputValue = value;
            }

            this.refPhone.current.value = inputValue;
            this.state.prevValue = inputValue;
        } else {
            this.refPhone.current.value = prevValue;
        }

        return;
    }

    displaySelectModeUI = () => {
        let displaySelectModeUI = [];

        if (ProjectResource.SiteID === ProjectResource.Site.GCC) {
            // 녹십자
            displaySelectModeUI.push(
                <div className={accounts.findCheck}>
                    <li>
                        <input ref={this.refEmailMode} type="radio" name="mode" id="EmailMode" onChange={() => this.onChangeMode(AcoountResource.findMode.email)} defaultChecked />
                        <label htmlFor="EmailMode">{i18n.t('account.카카오웍스로 찾기')}</label>
                    </li>
                    <li className={accounts.disabledCursor}>
                        <input ref={this.refSMSMode} type="radio" name="mode" id="SMSMode" onChange={() => this.onChangeMode(AcoountResource.findMode.sms)} disabled />
                        <label htmlFor="SMSMode">{i18n.t('account.SMS으로 찾기')}</label>
                    </li>
                </div>
            );
            
        } else {
            displaySelectModeUI.push(
                <div className={accounts.findCheck}>
                    <li>
                        <input ref={this.refEmailMode} type="radio" name="mode" id="EmailMode" onChange={() => this.onChangeMode(AcoountResource.findMode.email)} defaultChecked />
                        <label htmlFor="EmailMode">{i18n.t('account.Email로 찾기')}</label>
                    </li>
                    <li>
                        <input ref={this.refSMSMode} type="radio" name="mode" id="SMSMode" onChange={() => this.onChangeMode(AcoountResource.findMode.sms)} />
                        <label htmlFor="SMSMode">{i18n.t('account.SMS로 찾기')}</label>
                    </li>
                </div>
            );
        }

        return displaySelectModeUI;
    }
        

    render() {

        let displayInputUI = this.displayInputUI();
        let displaySelectModeUI = this.displaySelectModeUI();

		return (
			<>
                <div id={contents.popupConts} className={contents.loginPopup}>
                    <div className={contents.passwordConts}>
                        <div className={contents.passwordBoxTitle}>{i18n.t('account.비밀번호 찾기')}</div>

                        <div className={contents.passwordBox}>
                            <div className={contents.passwordBoxTxt}>{this.state.showMessage}</div>

                            {displaySelectModeUI}

                            <table className={contents.tblNone}>
                                <caption>{i18n.t('account.게시판 입니다')}</caption>
                                <colgroup>
                                    <col style={{ width: "30%" }} />
                                    <col style={{ width: "*" }} />
                                </colgroup>
                                <tbody id="userInfo" >
                                    {displayInputUI}
                                </tbody>
                            </table>

                            <div className={contents.gap20}></div>

                            <div className={uis.btnArea + " " + uis.alignC}>
                                <a onClick={this.onClick} className={contents.btnBlue}>{i18n.t('common.확인')}</a>
                                <a onClick={this.onClickCancle} className={contents.btnNavy}>{i18n.t('common.취소')}</a>
                            </div>
                        </div>

                    </div>
                </div>
                <div className={contents.dim}></div>
                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog
                        title={this.state.confirmMessage.title}
                        messages={this.state.confirmMessage.messages}
                        buttons={this.state.confirmMessage.buttons}
                        onClose={this.state.confirmMessage.onClose}
                        onClickButton={this.state.confirmMessage.onClickButton} />
                }
			</>
        );
    }
}

export default withRouter(accountFindPwd);