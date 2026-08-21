import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import ProjectResource from '../../../Root/resource/id';
import AccountResource from '../../resource/id';
import { AccountController } from '../../services/accountController';

import ConfirmDialog from '../../../Common/ui/confirmDialog';

import { AccountChangePwdComponent } from '../../styled/accountPopupStyled';
import { ModalBackground } from '../../../Root/styled/theme';

class AccountChangePwd extends Component {
	constructor(props) {
		super(props);

        this.refPwd = React.createRef();
        this.refPassword = React.createRef();
        this.refRePassword = React.createRef();

        this.state = {

            confirmMessage: {
                visible: false,
                messages: [""],
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null,
                type: null
            },
        };

        this.props = props;
    }

    showConfirmDialog = (messages, buttons, onClickButton, type) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.messages = messages;
		confirmMessage.buttons = buttons;
		confirmMessage.onClickButton = onClickButton;
		confirmMessage.type = type;

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
    

    onClickChangePwd = () => {
        let error = "";

        const pwd = this.refPwd.current.value.toString();
        const newPwd = this.refPassword.current.value.toString();
        const newRePwd = this.refRePassword.current.value.toString();

        // 비밀번호 유효성 검사
        // 5~10자의 영문 대소문자, 숫자, 특수기호 _,-만 사용 가능
        let regPwd = /^[a-zA-Z0-9_-]{5,10}$/;

        if (pwd.length === 0) {
            error = "비밀번호를 입력하세요.";
        } else if (newPwd.length === 0) {
            error = "새로운 비밀번호를 입력하세요.";
        } else if (newRePwd.length === 0) {
            error = "새로운 비밀번호를 한번 더 입력하세요.";
        } else if (newPwd.length > 0 && newRePwd.length > 0 && newPwd !== newRePwd) {
            error = "새로운 비밀번호가 서로 일치하지 않습니다.";
        } else if (pwd === newPwd) {
            error = "같은 비밀번호로 변경하실 수 없습니다.";
        } else if (!regPwd.test(newPwd)) {
            error = "5~10자의 영문 대소문자, 숫자, 특수기호 _-만 사용 가능합니다.";
        }

        if (error.length > 0) {
            this.showConfirmDialog([error], null, null, 'error');
            return;
        }

        this.setPassword(pwd, newPwd);
    }

    async setPassword(pwd, newPwd) {
        const userInfo = ProjectResource.getUserInfo();
        
        if (userInfo.userID == null || userInfo.id == undefined) {
            this.showConfirmDialog(['사용자 정보를 확인할 수 없습니다.'], null, null, 'error');
        }

        const result = await AccountController.requestChangePassword(userInfo.userID, pwd, newPwd);

        if (result === null) {
            this.showConfirmDialog([result.message], null, null, 'error');
        } else if (result.success === true) {
            this.showConfirmDialog(['비밀번호가 변경되었습니다.'], null, null, 'success');
        } else if (result.success === false) {
            this.showConfirmDialog([result.message], null, null, 'error');
        } 
    }

    render() {

        return (
            <ModalBackground className='UI_Section'>
                <AccountChangePwdComponent>
                    <div className={'header'}>
                        <div>
                            <a onClick={() => this.props.onClickClosePopup('changePwd', false)} className={'closeBtn'} />
                        </div>
                        <div>
                            <h5>비밀번호 변경</h5>
                        </div>
                    </div>
                    <div className='content'>
                        <ul>
                            <li>
                                <label htmlFor='curPwd'>기존 비밀번호</label>
                                <input type='password' id='curPwd' ref={this.refPwd} />
                            </li>
                            <li>
                                <label htmlFor='newPwd1'>새 비밀번호</label>
                                <input type='password' id='newPwd1' ref={this.refPassword} />
                            </li>
                            <li>
                                <label htmlFor='newPwd2'>새 비밀번호 확인</label>
                                <input type='password' id='newPwd2' ref={this.refRePassword} />
                            </li>
                        </ul>
                    </div>
                    <ul className={'buttonWrap'}>
                        <li className={'cancelBtn'} onClick={() => this.props.onClickClosePopup('changePwd', false)}>취소</li>
                        <li className={'saveBtn'} onClick={this.onClickChangePwd}>확인</li>
                    </ul>
                </AccountChangePwdComponent>
                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog 
                        messages={this.state.confirmMessage.messages} 
                        buttons={this.state.confirmMessage.buttons} 
                        onClose={this.state.confirmMessage.onClose}
                        onClickButton={this.state.confirmMessage.onClickButton}
                        onCloseConfirmDialog={this.onCloseConfirmDialog}
                        onClickClosePopupFindPwd={this.props.onClickClosePopup}
                        type={this.state.confirmMessage.type}
                    />
                }
            </ModalBackground>
        );
    }
}

export default withRouter(AccountChangePwd);