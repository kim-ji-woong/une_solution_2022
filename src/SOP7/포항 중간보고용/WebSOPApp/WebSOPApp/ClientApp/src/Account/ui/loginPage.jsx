import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { LoginPageComponent } from '../styled/loginPageStyled';
import LoginSection from './loginSection';
import FindPwdSection from './findPwdSection';
import AccountResource from '../resource/id';
import { AccountController } from '../services/accountController';

import pohang_logo from '../../Common/images/pohang_logo.svg';
import pohang_logo2 from '../../Common/images/pohang_logo2.svg';
import ProjectResource from "../../Root/resource/id";
import wsManager from "../../SDMS/services/wsManager";
import SDMS from "../../SDMS/ui/sdms";
class LoginPage extends Component {
	static FirstPage = ProjectResource.path.sopSimulator;
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
			this.setState({ errorMsg: result.message });
		}
	}

	onClickFindPwd = (name, phone) => {
		if (name.length === 0) {
			this.setState({ errorMsg: AccountResource.ID.textPlaceName });
			return;
		}

		if (phone.length === 0) {
			this.setState({ errorMsg: AccountResource.ID.textPlacePhone });
			return;
		}
	}
	
	render() {

		return (
			<LoginPageComponent>
				<section className='left'>
					<img src={pohang_logo2} alt='한국산업단지공단_로고' width={128} height={26} />
					<img src={pohang_logo} alt='포항_로고' width={80} height={26} />
					<div>
						<div>
							<span>POHANG</span>
							<span>industrial complex</span>
						</div>
						<div> 
							<span>MONITORING</span>
							<span>SYSTEM</span>
						</div>
						<div>
							<p>Lorem ipsum dolor sit amet consectetur. Vel leo lobortis odio non et nam </p>
							<p>scelerisque. Risus cursus tempor vitae etiam</p>
						</div>
					</div>
					<p>COPYRIGHT 2024 © Pohang Corporation. ALL RIGHTS RESERVED.</p>
				</section>

				<section className='right'>
					<button className='serviceBtn'>안전보건 서비스 바로가기</button>
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
				</section>
			</LoginPageComponent>
		);
	}
}

export default withRouter(LoginPage);