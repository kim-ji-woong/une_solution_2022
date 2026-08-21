import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';

import { LoginPageWrap } from '../styled/loginPageHydrogen';

import ProjectResource from '../../Root/resource/id';
import AccountResource from '../resource/id';

import { AccountController } from '../services/accountController';
import { i18n, withTranslation } from '../../language/i18n';

class LoginPageHydrogen extends Component {
	static FirstPage = ProjectResource.path.sdms;

	constructor(props) {
		super(props);

		this.refID = React.createRef();
		this.refPW = React.createRef();

		this.state = {
			loginError: null,
			loginErrorInputBox: null,
			isFullVersion: true
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
			this.setState({ loginError: i18n.t('account.ID를 입력하세요') });
			this.setState({ loginErrorInputBox: i18n.t('account.ID를 입력하세요') });
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
			if (result?.message && result.message.length > 0) {
				this.setState({ loginError: result.message });
				this.setState({ loginErrorInputBox: result.message });
			} else {
				this.setState({ loginError: i18n.t('account.가입하지 않은 ID이거나 잘못된 비밀번호 입니다') });
				this.setState({ loginErrorInputBox: i18n.t('account.가입하지 않은 ID이거나 잘못된 비밀번호 입니다') });
			}
		}
	}

	onKeyPressLogin = (e) => {
		if (e.key === 'Enter') {
			this.onClickLogin();
		}
	}

	onClickSetPwd = () => {
		this.props.history.push(ProjectResource.path.findPassword);
	}

	onChangeLang = (e) => {
		if (e.target.value === "en" || e.target.value === "ko") {			
			i18n.changeLanguage(e.target.value);
		}
    }

	render() {
		let loginError = null;
		let loginErrorInputBox = null;

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
						<input ref={this.refID} type='text' className='check error-msgBox' id='inputId' placeholder={i18n.t('account.ID를 입력하세요')} />
					</div>
					<div>
						<label htmlFor='inputPwd'>Password</label>
						<input ref={this.refPW} type='password' className='check error-msgBox' id='inputPwd' onKeyPress={(e) => this.onKeyPressLogin(e)} placeholder={i18n.t('account.비밀번호를 입력하세요')} />
					</div>
				</>
			);
		} else {
			loginErrorInputBox = (
				<>
					<div>
						<label htmlFor='inputId'>ID</label>
						<input ref={this.refID} type='text' className='check' id='inputId' placeholder={i18n.t('account.ID를 입력하세요')} />
					</div>
					<div>
						<label htmlFor='inputPwd'>Password</label>
						<input ref={this.refPW} type='password' className='check' id='inputPwd' onKeyPress={(e) => this.onKeyPressLogin(e)} placeholder={i18n.t('account.비밀번호를 입력하세요')} />
					</div>
				</>
			);
		}

		return (
			<LoginPageWrap>
				<div className='company-img1' />

				<section className='content-wrap'>

					<div className='ksmsLogo'></div>
					<div className='ksmsTitleFlex'>
						<p>Hydrogen Refueling Station Monitoring System</p>
						<span className='langageSelectBox'>
							<select value={i18n.language} onChange={(e) => this.onChangeLang(e)}>
								<option value={"ko"}>한국어</option>
								<option value={"en"}>English</option>
							</select>
						</span>
				    </div>

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

						<button type='button' onClick={this.onClickLogin}>{i18n.t('account.로그인')}</button>

					</form>
				</section>

				<footer>
					<p></p>
				</footer>
			</LoginPageWrap>
		);
	}
}

export default withRouter(withTranslation()(LoginPageHydrogen));