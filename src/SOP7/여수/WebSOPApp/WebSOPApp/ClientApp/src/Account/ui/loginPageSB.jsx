import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import SessionString from '../../Common/js/sessionString';
import ConfirmDialog from '../../Common/ui/confirmDialog';

import uis from '../../Common/css/ui.module.css';
import contents from '../../Common/css/content.module.css';
import accounts from '../css/account.module.css';
import newStyles from '../../Common/css/newStyle.module.css';

import $ from 'jquery';

import TeamEditorResource from '../resource/id';
import { AccountController } from '../services/accountController';

import logo from '../../Common/image/common/index_logo.png';
import Glogo from '../../Common/image/common/GCgreencross_white.png';
import Ylogo from '../../Common/image/common/yeosuLogo_W.png';

import { SDMSController } from '../../SDMS/services/sdmsController';
import ProjectResource from '../../Root/resource/id';
import AccountResource from '../resource/id';

/* 임시 */
import { PasswordBox } from './../styled';
import { PasswordBoxTitle } from './../styled';
import { PasswordBoxContents } from './../styled';
import { PasswordConfig } from './../styled';
import { PasswordConfigGray } from './../styled';
import wsManager from '../../SDMS/services/wsManager';
import AccountFindPwd from '../ui/popups/accountFindPwd';


class LoginPageSB extends Component {
	static FirstPage = "/sdms";

	constructor(props) {
		super(props);

		this.refID = React.createRef();
		this.refPW = React.createRef();

		this.refHighVer = React.createRef();
		this.refLightVer = React.createRef();

		this.state = {
			loginError: null,
			confirmMessage: {
				visible: false,
				title: "",
				messages: [""],
				buttons: ["확인"],
				onClose: this.onCloseConfirmDialog,
				onClickButton: null
			},
			reload: null,
			isFullVersion: true,	// 고,저용량 선택 인자 (true: 고용량(default), false: 저용량)
			loading: false,
			loadingMessage: "데이터를 불러오고 있습니다.",
			prevBeginCode: null,
			changePw: false,
		}

		this.props = props;
		this.initSiteID();
		this.checkLogin();

		this.isMount = true;

		// GS인증에 따른 
		if (ProjectResource.isGSMode === true)
			this.state.isFullVersion = false;
	}

	componentDidUpdate(prevProps, prevState) {
		//console.log('componentDidUpdate');
	}

	componentWillUnmount() {
		this.isMount = false;
	}

	// 개발 2팀 투명화 요청 -- alpha 값 수정 
	componentDidMount() {

		// 개발 1팀 작업 환경
		//$('body').css({ 'background': 'rgba(0,0,0,0.3)' });
		// 개발 2팀 3D Option
		$('body').css({ 'background': 'rgba(0,0,0,0)' });
	}

	_setState(state, callback) {
		if (this.isMount) {
			this.setState(state, callback);
		}
    }

	async initSiteID() {
		let siteID = ProjectResource.SiteID;

		if (siteID === null || siteID === undefined) {
			// 사이트 ID 요청
			//const [result, message] = await SDMSController.requestGetSiteID();

			//if (result !== null && result !== undefined) {
			//	ProjectResource.SiteID = result;
			//}
			siteID = await ProjectResource.loadSiteID();

			this._setState({ reload: true });
		}
	}


	async checkLogin() {
		//const [useAutoLogin, siteID] = await AccountController.checkAutoLogin();
		const loginInfo = await AccountController.checkAutoLogin();
		const useAutoLogin = loginInfo?.[0];
		const siteID = loginInfo?.[1];

		if (siteID) {
			ProjectResource.SiteID = siteID;
        }

		if (useAutoLogin) {
			// 세션 키를 이용해 로그인 체크
			const user = await ProjectResource.initUserInfo();

			if (user !== null && user !== undefined) {

				if (user.sessionKey !== null && user.sessionKey !== undefined) {
					// 로그인 정보가 남아있다면
					const [result, message] = await AccountController.checkLoginSession(user.id, user.sessionKey);

					if (result === AccountResource.loginState.login) {
						// SDMS 페이지로 이동
						this.props.history.push(LoginPageSB.FirstPage);
						//this.props.history.push("/sdms");
						//this.props.history.push("/dashboard");
						//this.props.history.push("/history");
						//this.props.history.push("/sop-simulator");
						//this.props.history.push("/team-editor");
					}
				}
			}
		}
		else {
			await ProjectResource.clearLoginUser();
        }
    }

	onClickLogin = () => {
		const id = this.refID.current.value.toString().trim();

		if (id.length === 0) {
			this._setState({ loginError: TeamEditorResource.ID.textLoginIDError });
			//this.showConfirmDialog("에러", [TeamEditorResource.ID.textLoginIDError], null, null);
			return;
		}

		const pw = this.refPW.current.value.toString().trim();

		if (pw.length === 0) {
			this._setState({ loginError: TeamEditorResource.ID.textLoginPwdError });
			//this.showConfirmDialog("에러", [TeamEditorResource.ID.textLoginPwdError], null, null);
			return;
		}

		this.doLogin(id, pw);
    }

	 //async doLogin(id, pw) {
	doLogin = async (id, pw) => {
		//const siteID = ProjectResource.SiteID;
		const isFullVersion = this.state.isFullVersion;
		const result = await AccountController.login(id, pw, isFullVersion);
		
		if (result === null) {
			this._setState({ loginError: TeamEditorResource.ID.textLoginError });
			//this.showConfirmDialog("에러", [TeamEditorResource.ID.textLoginError], null, null);
        }

		if (result.success == true) {
			// 로그인 성공

			// 세션 저장
			ProjectResource.setLoginUser(result.user);

			const user = ProjectResource.getUserInfo();
			if (user?.options) {
				//this.wsMgr = new wsManager(user.options.webSocketPort, this);
				//if (this.wsMgr[0] === null) {
				//	this.showConfirmDialog("Error", ["WebSocket.OnMessage Error"], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
				//	return;
				//} else {
				//	this.wsMgr.sendIsLogined(1);
				//}

				const wsMgr = new wsManager(user.options.webSocketPort, this);
				if (wsMgr) {
					this.props.setWebSocket(wsMgr);

					wsMgr.checkLogin(1);
				} else {
					this.showConfirmDialog("Error", ["WebSocket.OnMessage Error"], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
				}
			}

			// SDMS 페이지로 이동
			this.props.history.push(LoginPageSB.FirstPage);
		}
		else {
			if (result?.message && result.message.length > 0) {
				this._setState({ loginError: result.message });

				this.showConfirmDialog("실패", this.state.loginError, this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
			}
			else {
				this._setState({ loginError: TeamEditorResource.ID.textLoginError });
				//this.showConfirmDialog("에러", [TeamEditorResource.ID.textLoginError], null, null);
			}
        }
	}

	onKeyPressLogin = (e) => {
		if (e.key === 'Enter') {
			this.onClickLogin();
		}

		return;
	}

	onClickSetPwd = () => {
		/*this.props.history.push("/findPassword");*/
		this.setState({ changePw: true });
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

		this._setState({ confirmMessage });
	}

	onCloseConfirmDialog = () => {
		const confirmMessage = { ...this.state.confirmMessage };
		confirmMessage.visible = false;

		this._setState({ confirmMessage });
	}

	getLogo(){
		if (ProjectResource.SiteID === ProjectResource.Site.Soulbrain) {
			return <div className={contents.indexLoginTitlee}><img className={accounts.logoSize} src={logo} alt="솔브레인" /></div>
		}
		else if (ProjectResource.SiteID === ProjectResource.Site.GCC) {
			return <div className={contents.indexLoginTitle}><img className={accounts.logoSizeGC} src={Glogo} alt="녹십자" /></div>
		}
		else if (ProjectResource.SiteID === ProjectResource.Site.Yeosu) {
			return <div className={contents.indexLoginTitle}><img className={accounts.logoSizeYeosu} src={Ylogo} alt="여수" /></div>
		}
		return <></>
    }

	onChangeSelectVer = (isFullVersion) => {
		this._setState({ isFullVersion: isFullVersion });
	}

	displayVersionUI = () => {
		// 솔브레인 버전 선택
		// GS인증에 따른 버전 표시
		if (ProjectResource.isGSMode !== true) {
			if (ProjectResource.SiteID === ProjectResource.Site.Soulbrain) {
				return (
					<React.Fragment>
						<li>
							<input ref={this.refHighVer} type="radio" name="version" id="HighVer" onChange={() => this.onChangeSelectVer(true)} defaultChecked />
							<label htmlFor="HighVer">Full ver.</label>
						</li>
						<li>
							<input ref={this.refLightVer} type="radio" name="version" id="LightVer" onChange={() => this.onChangeSelectVer(false)} />
							<label htmlFor="LightVer">Light ver.</label>
						</li>
					</React.Fragment>);
			}
        }
		
		return <></>;
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
		this._setState({ loading: true });

		const result = await AccountController.autoLogin(beginCode);
		this.onAutoLogin(result, beginCode);
		window.history.pushState(null, null, window.location.origin);
	}

	onAutoLogin(loginData, beginCode) {
		if (loginData?.success) {
			ProjectResource.setLoginUser(loginData.user);
			this._setState({ loading: false, prevBeginCode: beginCode });

			// 다른 페이지로 이동
			this.props.history.push(LoginPageSB.FirstPage);
		}
		else {
			this._setState({ loading: false, prevBeginCode: beginCode });
		}
	}

	onCloseChangePW = () => {
		this.setState({ changePw: false });
	}

	render() {
		//if (this.state.loginError != null) {
		//	//alert(this.state.loginError);
		//	this.showConfirmDialog("실패", [this.state.loginError], null, null);
		//}

		if (this.state.loading || this.checkAutoLogin()) {
			return (
				<h2>{this.state.loadingMessage}</h2>
			);
		}

		return (
			<>
				<div className={contents.loginBackground}>
				<div id={contents.popupConts} className={contents.loginPopup}>
				    {/* {
				       this.getLogo()
					} */}
				    <span className={contents.yeosuLogo}></span>
					<span className={contents.loginTitleYeosu}>여수산단 환경 모니터링 시스템</span>

					{/*
						<div className={contents.loginFindBox}>
							<span className={contents.loginFindEmail}><input type="radio" /><p>Email으로 찾기</p></span>
							<span className={contents.loginFindSMS}><input type="radio" /><p>SMS으로 찾기</p></span>
						</div>
					*/}

			        <div className={contents.indexLoginBoxY}>
						{/* yeosu */}
						<ul>
							<li><input ref={this.refID} type="text" className={contents.indexLoginYeosu} onKeyPress={(e) => this.onKeyPressLogin(e)} placeholder="아이디" /></li>
							<li><input ref={this.refPW} type="password" className={contents.indexLoginPwYeosu} onKeyPress={(e) => this.onKeyPressLogin(e)} placeholder="비밀번호" /></li>
						</ul>
	
						{/* <div className={accounts.loginCheck}>
							{

								this.displayVersionUI()
							}
						</div> */}
				
							<div className={uis.btnArea}>
								<a className={contents.btnLoginYeosu} onClick={this.onClickLogin} >로그인</a>
								<a className={accounts.btnSetPwdYeosu} onClick={this.onClickSetPwd}>비밀번호 찾기</a>
								{/*<a className={contents.loginPageBack}>로그인 페이지로 돌아가기</a>*/}
							</div>

					</div>
					</div>

			    {/* 로그인화면 popup 임시 */}
			    {/* <PasswordBox>
				   <PasswordBoxTitle>성공</PasswordBoxTitle>
				   <PasswordBoxContents>비밀번호 변경안내 메일이 발송되었습니다. 메일을 확인해 주세요.</PasswordBoxContents>
				   <PasswordConfig>확인</PasswordConfig>
			    </PasswordBox>

				<PasswordBox>
					<PasswordBoxTitle>에러</PasswordBoxTitle>
					<PasswordBoxContents>핸드폰 번호 형식이 아닙니다. 다시 한번 확인해주세요.</PasswordBoxContents>
					<PasswordConfigGray>확인</PasswordConfigGray>
				</PasswordBox>

				<PasswordBox>
					<PasswordBoxTitle>에러</PasswordBoxTitle>
					<PasswordBoxContents>이메일 주소 형식이 아닙니다. 다시 한번 확인해주세요.</PasswordBoxContents>
					<PasswordConfigGray>확인</PasswordConfigGray>
				</PasswordBox>

				<PasswordBox>
					<PasswordBoxTitle>실패</PasswordBoxTitle>
					<PasswordBoxContents>존재하지 않는 계정입니다. 입력한 정보를 다시 확인해주세요.</PasswordBoxContents>
					<PasswordConfigGray>확인</PasswordConfigGray>
				</PasswordBox> */}


				<div className={uis.dim}></div>
				{
					/* alert창 대신 사용 */	
					this.state.confirmMessage.visible &&
					<ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
			    }
				</div>
				<div className={uis.dim}>
					{
						this.state.changePw &&
						<AccountFindPwd
							onCloseChangePW={() => this.onCloseChangePW()} >
						</AccountFindPwd>
					}
				</div>
			</>
        );
    }
}

export default withRouter(LoginPageSB);