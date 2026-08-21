import React, { Component } from 'react';
import { ChangePwdComponent  } from '../styled/myPageStyled';
import { ModalBackground } from '../../Root/styled/theme';
import close_btn from '../../Common/images/close_btn.png';

import pwd_hide from '../images/pwd_hide.png';
import pwd_show from '../images/pwd_show.png';
import ConfirmDialog from '../../Common/ui/confirmDialog';
import ProjectResource from '../../Root/resource/id';
import { AccountController } from "../services/accountController";


class changePwd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowCurrentPwd: false,
            isShowNewPwd1: false,
            isShowNewPwd2: false,
            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: ['확인'],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null
            },
        }

        this.refCurrentPW = React.createRef();
        this.refNewPW1 = React.createRef();
        this.refNewPW2 = React.createRef();
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

    handleShowPwChecked = (refType, stateType) => {
        const password = refType.current;
        if (password === null)
            return;

        if (stateType === 'isShowCurrentPwd') {
            if(!this.state.isShowCurrentPwd) {
                password.type = 'text';
            } else {
                password.type = 'password';
            }
            this.setState({ isShowCurrentPwd: !this.state.isShowCurrentPwd });
        }
        else if (stateType === 'isShowNewPwd1') {
            if(!this.state.isShowNewPwd1) {
                password.type = 'text';
            } else {
                password.type = 'password';
            }
            this.setState({ isShowNewPwd1: !this.state.isShowNewPwd1 });
        }
        else if (stateType === 'isShowNewPwd2') {
            if(!this.state.isShowNewPwd2) {
                password.type = 'text';
            } else {
                password.type = 'password';
            }
            this.setState({ isShowNewPwd2: !this.state.isShowNewPwd2 });
        }
    }

    onClickChangePW = () => {
        // 비밀번호 설정
        let error = "";

        const pwd = this.refCurrentPW.current.value.toString().trim();
        const newPwd = this.refNewPW1.current.value.toString().trim();
        const newRePwd = this.refNewPW2.current.value.toString().trim();

        if (pwd.length === 0) {
            error = '비밀번호를 입력하세요';
        } else if (newPwd.length === 0) {
            error = '새로운 비밀번호를 입력하세요';
        } else if (newRePwd.length === 0) {
            error = '새로운 비밀번호를 한번 더 입력하세요';
        } else if (newPwd.length > 0 && newRePwd.length > 0 && newPwd !== newRePwd) {
            error = '새로운 비밀번호가 서로 일치하지 않습니다';
        } else if (pwd === newPwd) {
            error = '같은 비밀번호로 변경하실 수 없습니다';
        }

        if (error.length > 0) {
            this.showConfirmDialog('에러', [error], null, null);
            return;
        }

        const num = newPwd.search(/[0-9]/g);
        const eng = newPwd.search(/[a-z]/ig);
        const spe = newPwd.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
        const hangulcheck = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

        if (newPwd.length < 5 || newPwd.length > 20 || newPwd.search(/\s/) != -1 || num < 0 || spe < 0 || (eng < 0 && hangulcheck.test(newPwd) === false)) {
            error = '문자, 숫자, 특수문자를 혼합하여 5자리 이상 20자리 이하로 공백없이 설정해주세요';
        }

        if (error.length > 0) {
            this.showConfirmDialog('에러', [error], null, null);
            return;
        }

        this.setPassword(pwd, newPwd);
    }

    async setPassword(pwd, newPwd) {
        this.setState({ showMessage: '처리 중입니다' });

        // id 값 불러오기
        let user = ProjectResource.getUserInfo();
        console.log(user);

        if (user === null || user === undefined) {
            let message = '유저 정보를 불러 올 수 없습니다. 관리자에게 문의바람';
            this.showConfirmDialog('에러', [message], null, null);
            this.setState({ showMessage: message });
        }

        const [result, message] = await AccountController.setPassword(user.id, user.userID, pwd, newPwd);
        console.log(result); //null


        if (result === null) {
            this.setState({ showMessage: message });
            this.showConfirmDialog('에러', [message], null, null);
        } else if (result.success === true) {
            this.setState({ showMessage: "비밀번호 변경 성공" });
            this.showConfirmDialog('성공', ['비밀번호 변경 성공'], ['확인'], this.onClickCancle);
        } else if (result.success === false) {
            this.showConfirmDialog('에러', [message], null, null);
        }
    }

    render() {
        return (
            <ModalBackground>
            <ChangePwdComponent>
                <header>
                    <div>
                        <h2>비밀번호 변경</h2>
                        <div>
                            <span>새 비밀번호</span>
                            <span>를 설정하세요</span>
                        </div>
                    </div>
                    <button onClick={() => this.props.handlePopup('changePwd', false)} className={'closeBtn'}>
                        <img src={close_btn} alt='닫기 버튼' width={16} height={16} />
                    </button>
                </header>
                <section>
                    <div className='infoWrap'>
                        <p>비밀번호 변경 시 유의사항</p>
                        <p>비밀번호는 5~10자 이내로 입력</p>
                        <p>영문 대소문자, 숫자, 특수기호 _ , - 만 사용가능</p>
                    </div>
                    <ul>
                        <li>
                            <span>현재 비밀번호</span>
                            <span>
                                <input ref={this.refCurrentPW} type='password' />
                                <button 
                                    type='button'
                                    className='showPwdBtn' 
                                    onClick={() => this.handleShowPwChecked(this.refCurrentPW, 'isShowCurrentPwd')}
                                >
                                    <img src={this.state.isShowCurrentPwd ? pwd_show : pwd_hide} alt='비밀번호 보기 버튼' />
                                </button>
                            </span>
                        </li>
                        <li>
                            <span>새 비밀번호</span>
                            <span>
                                <input ref={this.refNewPW1} type='password' />
                                <button 
                                    type='button'
                                    className='showPwdBtn' 
                                    onClick={() => this.handleShowPwChecked(this.refNewPW1, 'isShowNewPwd1')}
                                >
                                    <img src={this.state.isShowNewPwd1 ? pwd_show : pwd_hide} alt='비밀번호 보기 버튼' />
                                </button>
                            </span>
                        </li>
                        <li>
                            <span>새 비밀번호 확인</span>
                            <span>
                                <input ref={this.refNewPW2} type='password' />
                                <button 
                                    type='button'
                                    className='showPwdBtn' 
                                    onClick={() => this.handleShowPwChecked(this.refNewPW2, 'isShowNewPwd2')}
                                >
                                    <img src={this.state.isShowNewPwd2 ? pwd_show : pwd_hide} alt='비밀번호 보기 버튼' />
                                </button>
                            </span>
                        </li>
                    </ul>
                    <div className='btnWrap'>
                        <button className='cancle' onClick={() => this.props.handlePopup('myPage', true)}>마이페이지로 돌아가기</button>
                        <button className='submit' onClick={() => this.onClickChangePW()} >변경</button>
                    </div>
                </section>
                </ChangePwdComponent>
                {
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog
                        title={this.state.confirmMessage.title}
                        messages={this.state.confirmMessage.messages}
                        buttons={this.state.confirmMessage.buttons}
                        onClose={this.state.confirmMessage.onClose}
                        onClickButton={this.state.confirmMessage.onClickButton}
                        onCloseConfirmDialog={this.onCloseConfirmDialog}
                    />
                }
            </ModalBackground>
        );
    }
}

export default changePwd;