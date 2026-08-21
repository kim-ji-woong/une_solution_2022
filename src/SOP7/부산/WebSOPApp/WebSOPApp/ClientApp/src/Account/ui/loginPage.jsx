import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { LoginPageComponent } from '../styled/loginPageStyled';
import LoginSection from './loginSection';
import FindPwdSection from './findPwdSection';
import AccountResource from '../resource/id';
import { AccountController } from '../services/accountController';

import busan_logo from '../images/busan_logo.png';
import ProjectResource from "../../Root/resource/id";
import wsManager from "../../SDMS/services/wsManager";
import SDMS from "../../SDMS/ui/sdms";
import sha256 from "crypto-js/sha256";
class LoginPage extends Component {
	static FirstPage = "/sdms";
	constructor(props) {
		super(props);

		this.state = {
			current: 0,
			errorMsg: '',
		}

		this.props = props;
		
		this.isMount = true;

		this.initSiteID();
		this.checkLogin();
		
		this.wsMgr = null;
	}
	
	componentDidMount() {
	}

	componentWillUnmount() {
		this.isMount = false;
	}
	
	_setState = (state, callback) => {
		if (this.isMount) {
			this.setState(state, callback);
		}
	}
	
	async initSiteID() {
		let siteID = ProjectResource.SiteID;
		
		if (siteID === null || siteID === undefined) {
			// 사이트 ID 요청
			siteID = await ProjectResource.loadSiteID();
			
		}
	}
	
	async checkLogin() {
		const loginInfo = await AccountController.checkAutoLogin();
		const useAutoLogin = loginInfo?.[0];
		const siteID = loginInfo?.[1];
		
		if (siteID) {
			ProjectResource.SiteID = siteID;
		}
		
		if (useAutoLogin) {
			const user = await ProjectResource.initUserInfo();

			if (user !== null && user !== undefined) {
				if (user.sessionKey !== null && user.sessionKey !== undefined) {
					// 로그인 정보가 남아있다면
					const [result , message] = await AccountController.checkLoginSession(user.id, user.sessionKey);
					
					if (result === AccountResource.loginState.login) {
						// SDMS 페이지 이동
						this.props.history.push(LoginPage.FirstPage);
					}
				}
			}
		}
		else {
			await ProjectResource.clearLoginUser();
		}
	}

	onChangeSection = (section) => {
		this.setState({ current: section, errorMsg: null });
	}

	onClickLogin = (id, pw, isSavedID) => {
		if (id.length === 0) {
			this.setState({ errorMsg: AccountResource.ID.textLoginIDError });
			return;
		}

		if (pw.length === 0) {
			this.setState({ errorMsg: AccountResource.ID.textLoginPwdError });
			return;
		}

		this.doLogin(id, pw, isSavedID);
	}

	async doLogin(id, pw, isSavedID) {
		const result = await AccountController.login(id, pw);

		if (result === null) {
			this.setState({ errorMsg: AccountResource.ID.textLoginError });
		}

		if (result.success === true) {
			// 로그인 성공
			if (isSavedID) {
				localStorage.setItem('id', id);
			}
			else {
				localStorage.removeItem('id');
			}
			// 세션 저장
			ProjectResource.setLoginUser(result.user);
			
			this.wsMgr = null;
			
			const user = ProjectResource.getUserInfo();
			if (user?.options) {
				this.wsMgr = new wsManager(user.options.webSocketPort, null); // TODO: SDMS 라우팅시 변경 null => SDMS
				
				if (this.wsMgr) {
					this.props.setWebSocket(this.wsMgr);
				}
				
			}
			
			// 다음 페이지로 이동
			this.props.history.push(LoginPage.FirstPage);
		}
		else {
			this.setState({ errorMsg: AccountResource.ID.textLoginError });
		}
	}

	onClickFindPwd = async (name, phone) => {
		if (name.length === 0) {
			this.setState({ errorMsg: AccountResource.ID.textPlaceName });
			return;
		}

		if (phone.length === 0) {
			this.setState({ errorMsg: AccountResource.ID.textPlacePhone });
			return;
		}
		
		console.log("onClickFindPwd", name, phone);
		
		// (num = tick, name, data = phone, mode = 1)
		const result = await AccountController.requestFindPw(name, phone, AccountResource.findMode.sms);
		
		if (result) {
			
		}
	}
	
	render() {

		return (
			<LoginPageComponent>
				<section className='left'>
				{
					this.state.current === 0 &&
					<>
						<LoginSection
							onClickLogin={this.onClickLogin}
							errorMsg={this.state.errorMsg}
						/>
						<button 
							type='button' 
							className='sectionBtn'
							onClick={(e) => this.onChangeSection(1)}
						>
							{AccountResource.ID.textPwdFind}
						</button>
					</>
				}
				{
					this.state.current === 1 &&
					<>
						<FindPwdSection
							onClickFindPwd={this.onClickFindPwd}
							errorMsg={this.state.errorMsg}
						/>
						<button 
							type='button' 
							className='sectionBtn'
							onClick={(e) => this.onChangeSection(0)}
						>
							{AccountResource.ID.textGoLoginPage}
						</button>
					</>
				}

					<p>COPYRIGHT 2024 © Busan TP. ALL RIGHTS RESERVED.</p>
				</section>
				<section className='right'>
					<img src={busan_logo} alt='부산_로고' width={200} height={200} />
					<div>
						<p>BUSAN TP</p>
						<p>MONITORING SYSTEM</p>
					</div>
					<div>
						<p>부산 산업단지 내의 대기 환경 개선과 배출 저감 지원 효과의 극대화를 위한</p>
						<p>실시간 모니터링 및 IOT기반 통합 플랫폼입니다.</p>
					</div>
				</section>
			</LoginPageComponent>
		);
	}
}

export default withRouter(LoginPage);