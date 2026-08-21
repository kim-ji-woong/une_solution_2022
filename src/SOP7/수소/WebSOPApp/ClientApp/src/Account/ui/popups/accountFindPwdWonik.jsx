import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';

import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import ConfirmDialog from '../../../Common/ui/confirmDialog';

import AcoountResource from '../../resource/id';
import { AccountController } from '../../services/accountController';

import { AccountFindPwdWrap } from '../../styled/loginPageWonik';
import { i18n /*, withTranslation, i18nUtil*/ } from '../../../language/i18n';
import ProjectResource from '../../../Root/resource/id';

class accountFindPwdWonik extends Component {
	constructor(props) {
		super(props);

		this.refID = React.createRef();
        this.refEmail = React.createRef();
        this.refPhone = React.createRef();
        this.refEmailMode = React.createRef();
        this.refSMSMode = React.createRef();

		this.state = {
			mode: AcoountResource.findMode.email,
            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: [i18n.t('common.확인')],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null
            },
            errorMessage: "",
		}

        this.props = props;
	}

    componentDidMount() {
		$('body').css({ 'background': '#0E162D' });
	}

    onClickCancle = () => {
        // 메인 페이지 이동
        this.props.history.push('/');
    }

	onCloseConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        this.setState({ confirmMessage });
    }

	displayInputUI = () => {
		let displayInputUI = [];

		displayInputUI.push(
			<div>
                <label htmlFor='inputName'>{i18n.t('account.이름')}</label>
                <input type='text' ref={this.refID} className='check' id='inputName' placeholder={i18n.t('account.이름을 입력하세요')} />
			</div>);

		if (this.state.mode === AcoountResource.findMode.email) {
			displayInputUI.push(
				<div>
                    <label htmlFor='inputEmail'>{i18n.t('common.메일')}</label>
                    <input type='text' ref={this.refEmail} className='check' id='inputEmail' placeholder={i18n.t('account.Email를 입력하세요')} />
				</div>);
		} else {
			displayInputUI.push(
				<div>
                    <label htmlFor='inputSMS'>{i18n.t('account.SMS')}</label>
                    <input type='text' ref={this.refPhone} className='check' id='inputSMS' onChange={(e) => this.onChangeCheck(e.target)} placeholder={i18n.t('account.핸드폰 번호를 입력하세요')} />
				</div>);
		}

		return displayInputUI;
    }

    onChangeCheck = (e) => {
        let target = e;
        if (!target)
            return;

        let value = target.value;
        let inputValue = value.replace(/[^0-9]/g, '');           

        if (inputValue.length >= 11) {
            inputValue = inputValue.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        }
        else if (inputValue.length >= 10) {
            inputValue = inputValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        }
        else if (inputValue.length >= 8) {
            inputValue = inputValue.replace(/(\d{3})(\d{4})(\d{1})/, '$1-$2-$3');
        }
        else if (inputValue.length >= 4) {
            inputValue = inputValue.replace(/(\d{3})(\d{1})/, '$1-$2');
        }

        target.value = inputValue;      
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

	onChangeMode = (mode) => {
        const currentMode = this.state.mode;

        if (mode !== currentMode) {
            this.setState({ mode });
        }
    }

	onClick = async () => {
        let value = null;
        const name = this.refID.current.value.toString().trim();
        
        if (name.length === 0) {
            //this.showConfirmDialog(i18n.t('account.에러'), [i18n.t('account.이름을 입력하세요')], null, null);
            this.setState({ errorMessage: i18n.t('account.이름을 입력하세요') });
            return;
        }

        if (this.state.mode === AcoountResource.findMode.email) {            
            value = this.refEmail.current.value.toString().trim();

            if (value.length === 0) {
                //this.showConfirmDialog(i18n.t('account.에러'), [i18n.t('account.Email를 입력하세요')], null, null);
                this.setState({ errorMessage: i18n.t('account.Email를 입력하세요') });
                return;
            }

            // eslint-disable-next-line
            const patternEmail = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
            const emailValid = patternEmail.test(value);

            if (!emailValid) {
                //this.showConfirmDialog(i18n.t('account.에러'), [i18n.t('account.이메일 주소 형식이 아닙니다')], null, null);
                this.setState({ errorMessage: i18n.t('account.이메일 주소 형식이 아닙니다') });
                return;
            }

        } else if (this.state.mode === AcoountResource.findMode.sms) {
            value = this.refPhone.current.value.toString().trim();

            if (value.length === 0) {
                //this.showConfirmDialog(i18n.t('account.에러'), [i18n.t('account.핸드폰 번호를 입력하세요')], null, null);
                this.setState({ errorMessage: i18n.t('account.핸드폰 번호를 입력하세요') });
                return;
            }

            const patternPhone = /01[016789]-[^0][0-9]{2,3}-[0-9]{3,4}/;
            const phoneValid = patternPhone.test(value);

            if (!phoneValid) {
                //this.showConfirmDialog(i18n.t('account.에러'), [i18n.t('account.핸드폰 번호 형식이 아닙니다')], null, null);
                this.setState({ errorMessage: i18n.t('account.핸드폰 번호 형식이 아닙니다') });
                return;
            }
        }
        
        const [result, message] = await AccountController.changePassword(name, value, this.state.mode);

        if (result === null) {
            //this.showConfirmDialog(i18n.t('account.에러'), [message], null, null);
            this.setState({ errorMessage: message });
        } else if (result.success === true) {
            this.setState({ errorMessage: "" });
            this.showConfirmDialog(i18n.t('account.성공'), [message], [i18n.t('common.확인')], this.onClickCancle);
        }
        else {
            //this.showConfirmDialog(i18n.t('account.실패'), [message], null, null);
            this.setState({ errorMessage: message });
        }
    }

	render() {
		const displayInputUI = this.displayInputUI();
        let styleMode = ProjectResource.styleMode;

        const settings = {
			dots: true,
			fade: true,
			infinite: true,
			slidesToShow: 1,
			slidesToScroll: 1,
			autoplay: true,
			speed: 500,
			pauseOnHover: false
		};

		return (
			<AccountFindPwdWrap $styleMode={styleMode}>
				<Slider {...settings}>
					<div className='company-img1' />
					<div className='company-img2' />
					<div className='company-img3' />
				</Slider>
				<div className='gradient-bg' />

				<section className='content-wrap'>
                    <h2 className='blind'>{i18n.t('account.비밀번호 찾기')}</h2>
                    <p>{i18n.t('account.비밀번호 찾기')}</p>
                    <p className='description'>{i18n.t('account.비밀번호 찾을 계정 정보를 입력해주세요')}</p>

                    <ul>
                        <li>
                            <input type="radio" ref={this.refEmailMode} name='findPwd' onChange={() => this.onChangeMode(AcoountResource.findMode.email)} defaultChecked />
                            <span>{i18n.t('account.Email로 찾기')}</span>
                        </li>
                        <li>
                            <input type="radio" ref={this.refSMSMode} name='findPwd' onChange={() => this.onChangeMode(AcoountResource.findMode.sms)} />
                            <span>{i18n.t('account.SMS로 찾기')}</span>
                        </li>
                    </ul>

					<form autoComplete='off'>

						{displayInputUI}
                        {
                            this.state.errorMessage?.length > 0 &&
                            <div className='error-msg' style={{ display: "on" }}>
                                <p>{this.state.errorMessage}</p>
                            </div>
                        }
                        <div className='button-wrap'>
                            <button type='button' onClick={this.onClick}>{i18n.t('common.확인')}</button>
                            <button type='button' onClick={this.onClickCancle}>{i18n.t('common.취소')}</button>
                        </div>
					</form>
				</section>

                <footer>
					{
						ProjectResource.SiteID === ProjectResource.Site.Wonik &&
						<p>COPYRIGHT 2023 © WONIK QnC Corporation. ALL RIGHTS RESERVED.</p>
					}
					{
						ProjectResource.SiteID === ProjectResource.Site.GG_A &&
						<p>Copyright 2024. UNE inc. all rights reserved.</p>
					}
				</footer>

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
			</AccountFindPwdWrap>
        );
    }
}

export default withRouter(accountFindPwdWonik);