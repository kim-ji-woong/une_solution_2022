import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';

import { LoginPageWrap } from '../styled/loginPageHydrogen';

import ProjectResource from '../../Root/resource/id';
import AccountResource from '../resource/id';

import { AccountController } from '../services/accountController';
import { i18n, withTranslation } from '../../language/i18n';

import pwd_show from '../../Common/img/imghydrogen/pwd_show.svg';
import pwd_hide from '../../Common/img/imghydrogen/pwd_hide.svg';
import viewIcon from '../../Common/img/imghydrogen/view_icon_white2.svg';
import cancelIcon from '../../Common/img/imghydrogen/cancel_icon.svg';

class LoginPageHydrogen extends Component {
	static FirstPage = ProjectResource.path.sdms;
	//static FirstPage = ProjectResource.path.history;

	constructor(props) {
		super(props);

		this.refID = React.createRef();
		this.refPW = React.createRef();

		this.state = {
			loginError: null,
			loginErrorInputBox: null,
			isFullVersion: true,
			idValue: '',
			pwdValue: '',
			isShowPwd: false,
		}

		this.props = props;

		this.checkLogin();
	}

	async checkLogin() {
		// 세션 키를 이용해 로그인 체크
		const user = await ProjectResource.initUserInfo();
		if (user !== null && user !== undefined) {

			if (user.sessionKey !== null && user.sessionKey !== undefined) {
				// 로그인 정보가 남아있다면
				const [result, message] = await AccountController.checkLoginSession(user.id, user.sessionKey);

				if (result === AccountResource.loginState.login) {
					this.props.history.push(LoginPageHydrogen.FirstPage);
				}
			}
		}
	}

	componentDidMount() {
		$('body').css({ 'background': '#0E162D' });
	}

	onClickLogin = async () => {
		const isFullVersion = this.state.isFullVersion;
		const id = this.refID.current.value.toString().trim();

		if (id.length === 0) {
			this.setState({ loginError: i18n.t('account.아이디를 입력하세요') });
			this.setState({ loginErrorInputBox: i18n.t('account.아이디를 입력하세요') });
			return;
		}

		const pw = this.refPW.current.value.toString().trim();

		if (pw.length === 0) {
			this.setState({ loginError: i18n.t('account.비밀번호를 입력하세요') });
			this.setState({ loginErrorInputBox: i18n.t('account.비밀번호를 입력하세요') });
			return;
		}

		const result = await AccountController.login(id, pw, isFullVersion);

		if (result === null) {
			this.setState({ loginError: i18n.t('account.가입하지 않은 ID이거나 잘못된 비밀번호 입니다') });
			this.setState({ loginErrorInputBox: i18n.t('account.가입하지 않은 ID이거나 잘못된 비밀번호 입니다') });
		}

		if (result.success) {
			// 로그인 성공

			// 세션 저장
			ProjectResource.setLoginUser(result.user);
			ProjectResource.setLanguage(i18n.language);
			// 페이지 이동
			this.props.history.push(LoginPageHydrogen.FirstPage);
		}
		else {

			//if (result?.message && result.message.length > 0) {
			//	this.setState({ loginError: result.message });
			//	this.setState({ loginErrorInputBox: result.message });
			//} else {
				this.setState({ loginError: i18n.t('account.가입하지 않은 ID이거나 잘못된 비밀번호 입니다') });
				this.setState({ loginErrorInputBox: i18n.t('account.가입하지 않은 ID이거나 잘못된 비밀번호 입니다') });
			//}
		}
	}

	onKeyPressLogin = (e) => {
		if (e.key === 'Enter') {
			this.onClickLogin();
		}
	}

	handleIDChange = (event) => {
		this.setState({ idValue: event.target.value });
	}

	handlePWChange = (event) => {
		this.setState({ pwdValue: event.target.value });
	}

	onClickSetPwd = () => {
		this.props.history.push(ProjectResource.path.findPassword);
	}

	onChangeLang = (e) => {
		//if (e.target.value === "en" || e.target.value === "ko") {			
		//	i18n.changeLanguage(e.target.value);
		//}
		if (e === "ko" && i18n.language === "en") {
			i18n.changeLanguage("ko");
		}
		else if (e === "en" && i18n.language === "ko") {
			i18n.changeLanguage("en");
        }
	}

	clearInputText = (type) => {
		if (type === 'id') {
			const id = this.refID.current;
			if (id) {
				id.value = '';
				id.focus();
				this.setState({ idValue: '' });
			}
		}

		else if (type === 'pwd') {
			const pw = this.refPW.current;
			if (pw) {
				pw.value = '';
				this.refPW.current.type = 'password';
				pw.focus();
				this.setState({ pwdValue: '', isShowPwd: false });
			}
		}
	}

	handleShowPwChecked = () => {
		const password = this.refPW.current;
		if (password === null)
			return;

		if (!this.state.isShowPwd) {
			password.type = 'text';
		} else {
			password.type = 'password';
		}

		this.setState({ isShowPwd: !this.state.isShowPwd });
	}

	render() {
		let loginError = null;
		let loginErrorInputBox = null;
		const { idValue, pwdValue, isShowPwd } = this.state;

		if (this.state.loginError) {
			loginError = (
				<>
					<div className='error-msg' style={{ display: "on" }}>
						<p>{i18n.t('account.ID 또는 비밀번호가 맞지 않습니다. 다시 확인하세요')}</p>
					</div>
				</>
			);
		}

		if (this.state.loginErrorInputBox) {
			loginErrorInputBox = (
				<>
					<div>
						<label htmlFor='inputId'>ID</label>
						<input ref={this.refID} type='text' className='check error-msgBox' id='inputId' placeholder={i18n.t('account.아이디를 입력하세요')} value={idValue} onChange={this.handleIDChange} />
						<button
							type='button'
							onClick={() => this.clearInputText('id')}
							style={{ display: idValue.length > 0 ? 'inline-block' : 'none' }}>
								<img className={'input-close-icon'} src={cancelIcon} />
						</button>
					</div>
					<div>
						<label htmlFor='inputPwd'>Password</label>
						<input ref={this.refPW} type='password' className='check error-msgBox' id='inputPwd' onKeyPress={(e) => this.onKeyPressLogin(e)} placeholder={i18n.t('account.비밀번호를 입력하세요')} value={pwdValue} onChange={this.handlePWChange} />
						<button
							type='button'
							style={{ display: pwdValue.length > 0 ? 'inline-block' : 'none' }}
							onClick={() => this.handleShowPwChecked()}
						>
							<img /* className={'input-preView-icon'} */ src={isShowPwd ? pwd_show : pwd_hide} />
						</button>
						<button
							type='button'
							style={{ display: pwdValue.length > 0 ? 'inline-block' : 'none' }}
							onClick={() => this.clearInputText('pwd')}
						>
							<img className={'input-closePW-icon'} src={cancelIcon}  />
						</button>
					</div>
				</>
			);
		} else {
			loginErrorInputBox = (
				<>
					<div>
						<label htmlFor='inputId'>ID</label>
						<input ref={this.refID} type='text' className='check' id='inputId' placeholder={i18n.t('account.아이디를 입력하세요')} value={idValue} onChange={this.handleIDChange} />
						<button
							type='button'
							onClick={() => this.clearInputText('id')}
							style={{ display: idValue.length > 0 ? 'inline-block' : 'none' }}>
								<img className={'input-close-icon'} src={cancelIcon} />
						</button>
					</div>
					<div>
						<label htmlFor='inputPwd'>Password</label>
						<input ref={this.refPW} type='password' className='check' id='inputPwd' onKeyPress={(e) => this.onKeyPressLogin(e)} placeholder={i18n.t('account.비밀번호를 입력하세요')} value={pwdValue} onChange={this.handlePWChange}  />
						<button
							type='button'
							style={{ display: pwdValue.length > 0 ? 'inline-block' : 'none' }}
							onClick={() => this.handleShowPwChecked()}
						>
							<img /* className={'input-preView-icon'} */ src={isShowPwd ? pwd_show : pwd_hide} />
						</button>
						<button
							type='button'
							style={{ display: pwdValue.length > 0 ? 'inline-block' : 'none' }}
							onClick={() => this.clearInputText('pwd')}
						>
							<img className={'input-closePW-icon'} src={cancelIcon} />
						</button>
					</div>
				</>
			);
		}

		return (
			<LoginPageWrap>
				<div className='language-box'>
					<div>
						<span className={'krBtn' + (i18n.language === "ko" ? " on" : "")} onClick={() => this.onChangeLang("ko")}>KR</span>
						<span className={'engBtn' + (i18n.language === "en" ? " on" : "")} onClick={() => this.onChangeLang("en")}>ENG</span>
					</div>
				</div>

				<div className='company-img1' />

				<section className='content-wrap'>

					<div className='ksmsLogoBox'>
						<span></span>
						<span></span>
					</div>

					<div className='ksmsTitleFlex'>
						<p>{i18n.t('account.수소충전소 모니터링 시스템')}</p>
				    </div>

					{/* <span className='langageSelectBox'>
						<select value={i18n.language} onChange={(e) => this.onChangeLang(e)}>
							<option value={"ko"}>한국어</option>
							<option value={"en"}>English</option>
						</select>
					</span> */}

					<form autoComplete='off'>
						{/* <div>
							<label htmlFor='inputId'>ID</label>
							<input ref={this.refID} type='text' className='check' id='inputId' onKeyPress={(e) => this.onKeyPressLogin(e)} placeholder='아이디를 입력하세요.' />
						</div>
						<div>
							<label htmlFor='inputPwd'>Password</label>
							<input ref={this.refPW} type='password' className='check' id='inputPwd' onKeyPress={(e) => this.onKeyPressLogin(e)} placeholder='비밀번호를 입력하세요.' />
						</div> */}
						{loginErrorInputBox}

						{/* 로그인 유효성 검사시 사용 */}
						{loginError}

						<button className='loginButton' type='button' onClick={this.onClickLogin}>{i18n.t('account.로그인')}</button>

					</form>
				</section>
			</LoginPageWrap>
		);
	}
}

export default withRouter(withTranslation()(LoginPageHydrogen));