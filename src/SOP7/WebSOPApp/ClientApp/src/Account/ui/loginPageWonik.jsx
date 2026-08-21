import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';

import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { LoginPageWrap } from '../styled/loginPageWonik';

import ProjectResource from '../../Root/resource/id';
import AccountResource from '../resource/id';

import { AccountController } from '../services/accountController';
import { i18n, withTranslation /*, i18nUtil*/ } from '../../language/i18n';

class LoginPageWonik extends Component {
	static FirstPageWonik = ProjectResource.path.dashboard;
	static FirstPageWonik_Safety = ProjectResource.path.sdms;
	static FirstPageGG = ProjectResource.path.sdms;

	constructor(props) {
		super(props);

		this.refID = React.createRef();
		this.refPW = React.createRef();

		this.state = {
			loginError: null,
			isFullVersion: true,
			prevBeginCode: null
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
					if (ProjectResource.SiteID === ProjectResource.Site.Wonik) {
						this.props.history.push(LoginPageWonik.FirstPageWonik);
					} else if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
						this.props.history.push(LoginPageWonik.FirstPageGG);
					}
				}
			}
		}
	}

	componentDidMount() {
		$('body').css({ 'background': '#0E162D' });
	}

	checkAutoLogin() {
		const parameters = window.location.search;

		if (parameters.length > 0) {
			return this.processBeginCode(parameters);
		}

		return false;
	}

	processBeginCode(parameters) {
		if (!parameters || parameters.length === 0) {
			return false;
		}

		parameters = parameters.substring(1).trim();

		const params = parameters.split('&');
		const paramCount = params.length;

		for (let i = 0; i < paramCount; i++) {
			const datas = params[i].split('=');

			if (datas.length !== 2) {
				continue;
			}

			const paramName = datas[0].trim();
			const paramValue = datas[1].trim();

			if (paramName.toLowerCase() === "bc") {
				const beginCode = paramValue;

				if (beginCode !== null && beginCode !== undefined && beginCode !== this.state.prevBeginCode) {
					this.autoLogin(beginCode);
					return true;
				}
			}
		}

		return false;
	}

	async autoLogin(beginCode) {
		const result = await AccountController.autoLogin(beginCode);
		this.onAutoLogin(result, beginCode);
		window.history.pushState(null, null, window.location.origin);
	}

	onAutoLogin(loginData, beginCode) {
		if (loginData?.success) {
			ProjectResource.setLoginUser(loginData.user);
			this.setState({ prevBeginCode: beginCode });

			// 다른 페이지로 이동
			if (ProjectResource.SiteID === ProjectResource.Site.Wonik) {
				this.props.history.push(LoginPageWonik.FirstPageWonik);
			} else if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
				this.props.history.push(LoginPageWonik.FirstPageGG);
			}
		}
		else {
			this.setState({ prevBeginCode: beginCode });
		}
	}

	onClickLogin = async () => {
		const isFullVersion = this.state.isFullVersion;
		const id = this.refID.current.value.toString().trim();

		if (id.length === 0) {
			this.setState({ loginError: i18n.t('account.ID를 입력하세요') });
			return;
		}

		const pw = this.refPW.current.value.toString().trim();

		if (pw.length === 0) {
			this.setState({ loginError: i18n.t('account.비밀번호를 입력하세요') });
			return;
		}

		const result = await AccountController.login(id, pw, isFullVersion);
		
		if (result === null) {
			this.setState({ loginError: i18n.t('account.가입하지 않은 ID이거나 잘못된 비밀번호 입니다') });
        }

		if (result.success == true) {
			// 로그인 성공

			// 세션 저장
			ProjectResource.setLoginUser(result.user);
			// 페이지 이동
			if (ProjectResource.SiteID === ProjectResource.Site.Wonik) {
				this.props.history.push(LoginPageWonik.FirstPageWonik);
			} else if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
				this.props.history.push(LoginPageWonik.FirstPageGG);
			}
		}
		else {
			if (result?.message && result.message.length > 0) {
				this.setState({ loginError: result.message });
			} else {
				this.setState({ loginError: i18n.t('account.가입하지 않은 ID이거나 잘못된 비밀번호 입니다') });
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

	onClickSSO = async () => {
		const [result, message] = await AccountController.requestSSOUrl();
		if (result) {
			window.location.href = result.url;
		}
		else {
			this.setState({ loginError: message });
        }
	}

	render() {
		let styleMode = ProjectResource.styleMode;
		let loginError = null;

		if (this.checkAutoLogin()) {
			return (
				<h2>{i18n.t('account.데이터를 불러오고 있습니다')}</h2>
			);
		}

		if (this.state.loginError) {
			if (ProjectResource.SiteID === ProjectResource.Site.Wonik) {
				loginError = (
					<div className='error-msgWQ' style={{ display: "on" }}>
						<p>{this.state.loginError}</p>
					</div>
				);
			} else {
				loginError = (
					<div className='error-msg' style={{ display: "on" }}>
						<p>{this.state.loginError}</p>
					</div>
				);
			}
		}

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
			<LoginPageWrap $styleMode={styleMode}>
				<Slider {...settings}>
					<div className='company-img1' />
					<div className='company-img2' />
					<div className='company-img3' />
				</Slider>
				<div className='gradient-bg' />

				<header>
					<h1 className='blind'>{i18n.t('account.비밀번호 찾기')}</h1>
					<div className='find-pwd-wrap'>
						<button className='find-pwd' onClick={this.onClickSetPwd}>{i18n.t('account.비밀번호 찾기')}</button>
						<span>비밀번호를 잊으셨나요?</span>
					</div>
				</header>

				<section className='content-wrap'>
					<h2 className='blind'>{i18n.t('account.로그인')}</h2>
					{
						ProjectResource.SiteID === ProjectResource.Site.Wonik &&
						<>
							<p>Wonik QnC</p>
							<p>스마트 재난관리 솔루션</p>
						</>
					}
					{
						ProjectResource.SiteID === ProjectResource.Site.GG_A &&
						<>
							<p>경기융합타운</p>
							<p>재난관리 시스템</p>
						</>
					}
						<form autoComplete='off'>
							<div>
								<label htmlFor='inputId'>ID</label>
								<input ref={this.refID} type='text' className='check' id='inputId' onKeyPress={(e) => this.onKeyPressLogin(e)} placeholder={i18n.t('account.ID를 입력하세요')} />
							</div>
							<div>
								<label htmlFor='inputPwd'>Password</label>
								<input ref={this.refPW} type='password' className='check' id='inputPwd' onKeyPress={(e) => this.onKeyPressLogin(e)} placeholder={i18n.t('account.비밀번호를 입력하세요')} />
							</div>
							<button type='button' onClick={this.onClickLogin}>{i18n.t('account.로그인')}</button>
							{/* 로그인 유효성 검사시 사용 */}
							{loginError}
							{
								ProjectResource.SiteID === ProjectResource.Site.Wonik &&
								<>
									<div className={'ssoline'}><span></span><p>OR</p><span></span></div>
									<button type='button' className={'ssoLoginBox'} onClick={this.onClickSSO}>통합 로그인</button>
								</>
							}
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
			</LoginPageWrap>
        );
    }
}

export default withRouter(withTranslation()(LoginPageWonik));