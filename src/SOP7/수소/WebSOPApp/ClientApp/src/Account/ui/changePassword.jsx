import React, { Component } from 'react';
//import React, { useRef, useState } from 'react';
import { ChangePwdComponent  } from '../styled/myPageStyled';
import { ModalBackground } from '../../Root/styled/theme';
import close_icon from '../../Common/img/imghydrogen/main/close_icon.svg';
import passwordView from '../../Common/img/imghydrogen/main/passwordView_icon.svg';
import passwordView_close from '../../Common/img/imghydrogen/main/passwordView_close_icon.svg';
//import password_close from '../../Common/img/imghydrogen/';
import cancel_icon from '../../Common/img/imghydrogen/cancel_icon.svg';
import password_requirement from '../../Common/img/imghydrogen/main/password_requirement_icon.svg';
import password_notClear from '../../Common/img/imghydrogen/main/password_notClear_icon.svg';
import password_clear from '../../Common/img/imghydrogen/main/password_clear_icon.svg';

import ConfirmDialog from '../../Common/ui/confirmHydrogen';
import { AccountController } from '../services/accountController';
import ProjectResource from '../../Root/resource/id';

import { i18n, withTranslation, i18nUtil } from '../../language/i18n';


class ChangePassword extends Component{
	constructor(props) {
        super(props);

        this.refCurrentPW = React.createRef();
        this.refNewPW1 = React.createRef();
        this.refNewPW2 = React.createRef();

        this.state = {
            popupClose: false,
            isShowCurrentPwd: false,
            isShowNewPwd1: false,
            isShowNewPwd2: false,
            currentPwdValue: '',
            newPwdValue: '',
            pwdConfirmValue: '',
            //charactersNum: false,
            charactersNum: 1,
            checkTextNum: 1,
        }

        this.props = props;
    }

    handlePWChange = (event) => {
		this.setState({ currentPwdValue: event.target.value });
	}

    handleNPWChange = (event) => {
		this.setState({ newPwdValue: event.target.value });
        console.log('입력한 값 :' + " " + event.target.value);

        let eventTextCheck = /^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?:[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]{10,16}$/;   //두 개 이상의 영어 대문자와 소문자, 숫자 및 특수 기호의 조합
        let eventLength = /^.{10,16}$/;   //최소 10자 이상 16자 이하

        if(eventTextCheck.test(event.target.value)){
            this.setState({ checkTextNum: 3 });   
        } else{
            this.setState({ checkTextNum: 2 });   
        }

        if (eventLength.test(event.target.value)) {
            this.setState({ charactersNum: 3 });   
        } else {
            this.setState({ charactersNum: 2 });   
        } 
	}

    handleConPWChange = (event) => {
		this.setState({ pwdConfirmValue: event.target.value });
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

    clearInputText = (type) => {
		if (type === 'currentPwdValue') {
			const cPwd = this.refCurrentPW.current;
			if (cPwd) {
				cPwd.value = '';
				cPwd.focus();
				this.setState({ currentPwdValue: '', isShowCurrentPwd : false});
			}
		}

        else if (type === 'newPwdValue') {
			const nPwd = this.refNewPW1.current;
			if (nPwd) {
				nPwd.value = '';
				this.refNewPW1.current.type = 'password';
				nPwd.focus();
				this.setState({ newPwdValue: '', isShowNewPwd1: false });
			}
		}

        else if (type === 'pwdConfirmValue') {
			const conPwd = this.refNewPW2.current;
			if (conPwd) {
				conPwd.value = '';
				this.refNewPW2.current.type = 'password';
				conPwd.focus();
				this.setState({ pwdConfirmValue: '', isShowNewPwd2: false });
			}
		}
    }

    getIconTextUI = () => {
        let iconTextUI = [];

        if(this.state.checkTextNum === 1){
            iconTextUI.push(<span className={'checkLengthIcon'}></span>);
        }
        else if(this.state.checkTextNum === 2){
            iconTextUI.push(<span className={'notClearIcon'}></span>);
        }
        else if(this.state.checkTextNum === 3){
            iconTextUI.push(<span className={'checkClearIcon'}></span>);
        }
        return iconTextUI;
    }

    getIconNumUI = () => {
        let iconUI = [];

        if(this.state.charactersNum === 1){
            iconUI.push(<span className={'checkLengthIcon'}></span>);
        } 
        else if(this.state.charactersNum === 2){
            iconUI.push(<span className={'notClearIcon'}></span>);
        }
        else if(this.state.charactersNum === 3){
            iconUI.push(<span className={'checkClearIcon'}></span>);
        }
        return iconUI;
    }

    onClickSave = async () => {
        const cPwd = this.refCurrentPW.current.value;
        const nPwd = this.refNewPW1.current.value;
        const conPwd = this.refNewPW2.current.value;

        if (nPwd !== conPwd) {
            // 암호 일치 하지 않음 오류
            this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [i18n.t('account.새로운 비밀번호가 서로 일치하지 않습니다'), ''], null, null);
        }
        else {
            // id 값 불러오기
            let user = ProjectResource.getUserInfo();

            // DB 비밀번호 업데이트 요청
            const [result, message] = await AccountController.setPassword(user.id, user.userID, cPwd, nPwd);
            if (result === null || result.success === false) {
                // 다국어 메시지로 전환
                let errorMsg = message;
                
                if (errorMsg === "기존 비밀번호가 맞지 않습니다. 확인바랍니다.") {
                    errorMsg = i18n.t('현재 비밀번호가 일치하지 않습니다');
                }
                else if (errorMsg === "비밀번호 업데이트를 실패하였습니다.") {
                    errorMsg = i18n.t('비밀번호 업데이트를 실패하였습니다');
                }
                else {
                    errorMsg = i18n.t('비밀번호를 변경할 수 없습니다. 관리자에게 문의해주세요');
                }

                this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [errorMsg, ''], null, null);
            }
            else if (result.success === true) {
                this.props.showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, [i18n.t('account.비밀번호가 변경되었습니다'), ''], [i18n.t('common.확인')], () => {
                    this.props.onCloseConfirmDialog();
                    this.props.reLoadOpenMyPage();
                });
            }
        }       
    }

    render(){
        const { currentPwdValue, newPwdValue, pwdConfirmValue, isShowCurrentPwd, isShowNewPwd1, isShowNewPwd2 } = this.state;
        const iconTextUI = this.getIconTextUI();
        const iconNumUI = this.getIconNumUI();

        let messageUI = (<div><span>Please set a <p>new password</p></span></div>);
        if (i18n.language === "ko") {
            messageUI = (<div><span><p>새 비밀번호</p>를 설정하세요</span></div>);
        }

        return (
            <ModalBackground>
                <ChangePwdComponent>
                    <header>
                        <div>
                            <h2>{i18n.t('account.비밀번호 변경')}</h2>
                            {messageUI}
                        </div>
                        <button onClick={() => this.props.onClickCloseChangePassword()} className={'closeBtn'}>
                            <img src={close_icon} alt='닫기 버튼' width={24} height={24} />
                        </button>
                    </header>
                    <section>
                        <ul>
                            <li>
                                <span>{i18n.t('account.현재 비밀번호')}</span>
                                <span>
                                    <input ref={this.refCurrentPW} type='password' placeholder={i18n.t('account.현재 비밀번호 입력')} value={currentPwdValue} onChange={this.handlePWChange}/>
                                    <button 
                                        type='button'
                                        className='showPwdBtn'
                                        onClick={() => this.handleShowPwChecked(this.refCurrentPW, 'isShowCurrentPwd')}
                                        style={{ display: currentPwdValue.length > 0 ? 'inline-block' : 'none' }}
                                    >
                                        <img src={isShowCurrentPwd ? passwordView : passwordView_close} className={'passwordView_img'} alt='비밀번호 보기 버튼' />
                                    </button>
                                    <button 
                                        type='button'
                                        onClick={() => this.clearInputText('currentPwdValue')}
                                        style={{ display: currentPwdValue.length > 0 ? 'inline-block' : 'none' }}
                                    >
                                        <img src={cancel_icon} alt='비밀번호 닫기 버튼' />
                                    </button>
                                </span>
                            </li>
                            <li>
                                <span>{i18n.t('account.새 비밀번호')}</span>
                                <span>
                                    <input ref={this.refNewPW1} type='password' placeholder={i18n.t('account.새 비밀번호 입력')} value={newPwdValue} onChange={this.handleNPWChange} />
                                    <button 
                                        type='button'
                                        className='showPwdBtn'
                                        onClick={() => this.handleShowPwChecked(this.refNewPW1, 'isShowNewPwd1')} 
                                        style={{ display: newPwdValue.length > 0 ? 'inline-block' : 'none' }}
                                    >
                                        <img src={isShowNewPwd1 ? passwordView : passwordView_close} className={'passwordView_img'} alt='비밀번호 보기 버튼' />
                                    </button>
                                    <button 
                                        type='button'
                                        onClick={() => this.clearInputText('newPwdValue')}
                                        style={{ display: newPwdValue.length > 0 ? 'inline-block' : 'none' }}
                                    >
                                        <img src={cancel_icon} alt='비밀번호 닫기 버튼' />
                                    </button>
                                </span>
                            </li>
                            <li>
                                <span>{i18n.t('account.새 비밀번호 확인')}</span>
                                <span>
                                    <input ref={this.refNewPW2} type='password' placeholder={i18n.t('account.새 비밀번호 확인')} value={pwdConfirmValue} onChange={this.handleConPWChange} />
                                    <button 
                                        type='button'
                                        className='showPwdBtn'
                                        onClick={() => this.handleShowPwChecked(this.refNewPW2, 'isShowNewPwd2')} 
                                        style={{ display: pwdConfirmValue.length > 0 ? 'inline-block' : 'none' }}
                                    >
                                        <img src={isShowNewPwd2 ? passwordView : passwordView_close} className={'passwordView_img'} alt='비밀번호 보기 버튼' />
                                    </button>
                                    <button 
                                        type='button'
                                        onClick={() => this.clearInputText('pwdConfirmValue')}
                                        style={{ display: pwdConfirmValue.length > 0 ? 'inline-block' : 'none' }}
                                    >
                                        <img src={cancel_icon} alt='비밀번호 닫기 버튼' />
                                    </button>
                                </span>
                            </li>
                        </ul>
                        <div className='infoWrap'>
                            <p className='passwordTitle'>{i18n.t('account.비밀번호 요구사항')} :</p>
                            {/* <span><img src={password_requirement} alt='비밀번호 유의사항' /><p>Combination of two or more of English upper and lower case letters, numbers, and special symbols</p></span>
                            <span><img src={password_requirement} alt='비밀번호 유의사항' /><p>10 to 16 characters</p></span> */}
                            <div>
                                {iconTextUI}
                                <p className={'requirements_1'}>{i18n.t('account.영문 대소문자,숫자,특수기호 중 2가지 이상 조합')}</p>
                            </div>
                            <div>
                                {iconNumUI}
                                <p className={'requirements_2'}>{i18n.t('account.10~16자')}</p>
                            </div>
                        </div>
                        <div className='btnWrap'>
                            <button className='cancle' onClick={() => this.props.reLoadOpenMyPage()}>{i18n.t('common.취소')}</button>
                            {
                                (currentPwdValue && this.state.checkTextNum === 3 && this.state.charactersNum === 3 && pwdConfirmValue) ?
                                    <button className='submitOn' onClick={() => this.onClickSave()}>{i18n.t('common.저장')}</button>
                                    : <button className='submit'>{i18n.t('common.저장')}</button>
                            }
                        </div>
                    </section>
                </ChangePwdComponent>
            </ModalBackground>
        );
    }
}

export default ChangePassword;