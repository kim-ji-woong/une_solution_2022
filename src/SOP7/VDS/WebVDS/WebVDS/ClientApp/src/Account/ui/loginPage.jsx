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

//import { SDMSController } from '../../SDMS/services/sdmsController';
import ProjectResource from '../../Root/resource/id';
import AccountResource from '../resource/id';

/* 임시 */
import { PasswordBox } from './../styled';
import { PasswordBoxTitle } from './../styled';
import { PasswordBoxContents } from './../styled';
import { PasswordConfig } from './../styled';
import { PasswordConfigGray } from './../styled';


class LoginPage extends Component {
	static FirstPage = "/vds";
	//static FirstPage = "/dashboard";

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
			loading: false,
			loadingMessage: "데이터를 불러오고 있습니다.",
			prevBeginCode: null
		}

		this.props = props;
		this.initSiteID();
		this.checkLogin();

		this.isMount = true;
	}

	componentDidUpdate() {
		// 개발 1팀 작업
		//$('body').css({ 'background': 'rgba(0,0,0,0.5)' });
		// 개발 2팀 3D Option
		$('body').css({ 'background': 'rgba(0,0,0,0)' });
	}

	componentWillUnmount() {
		this.isMount = false;
		const state = { ...this.state };
		ProjectResource.deleteObject(state);
	}

	// 개발 2팀 투명화 요청 -- alpha 값 수정 
	componentDidMount() {
		// 개발 1팀 작업
		//$('body').css({ 'background': 'rgba(0,0,0,0.5)' });
		// 개발 2팀 3D Option
		$('body').css({ 'background': 'rgba(0,0,0,0)' });
	}

	_setState(state) {
		if (this.isMount) {
			this.setState(state);
		}
    }

	async initSiteID() {
		let siteID = ProjectResource.SiteID;

		if (siteID === null || siteID === undefined) {
			siteID = 1;
			this._setState({ reload: true });
		}
	}

	async checkLogin() {
		// 세션 키를 이용해 로그인 체크
		const user = await ProjectResource.initUserInfo();

		if (user !== null && user !== undefined) {

			if (user.sessionKey !== null && user.sessionKey !== undefined) {
				// 로그인 정보가 남아있다면
				const [result, message] = await AccountController.checkLoginSession(user.id, user.sessionKey);

				if (result === AccountResource.loginState.login) {
					this.props.history.push(LoginPage.FirstPage);
                }
			}
		}
    }

	onClickLogin = () => {
		const id = this.refID.current.value.toString().trim();

		if (id.length === 0) {
			this._setState({ loginError: TeamEditorResource.ID.textLoginIDError });
			//this.showConfirmDialog("에러", [TeamEditorResource.ID.textLoginIDError], null, null);
			this.showConfirmDialog("에러", [TeamEditorResource.ID.textLoginIDError], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
			return;
		}

		const pw = this.refPW.current.value.toString().trim();

		if (pw.length === 0) {
			this._setState({ loginError: TeamEditorResource.ID.textLoginPwdError });
			//this.showConfirmDialog("에러", [TeamEditorResource.ID.textLoginPwdError], null, null);
			this.showConfirmDialog("에러", [TeamEditorResource.ID.textLoginPwdError], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
			return;
		}

		this.doLogin(id, pw);
    }

	async doLogin(id, pw) {
		const result = await AccountController.login(id, pw);
		
		if (result === null) {
			this._setState({ loginError: TeamEditorResource.ID.textLoginError });
        }

		if (result.success == true) {
			// 로그인 성공

			// 세션 저장
			ProjectResource.setLoginUser(result.user);

			this.props.history.push(LoginPage.FirstPage);
		}
		else {
			if (result?.message && result.message.length > 0) {
				this._setState({ loginError: result.message });
				this.showConfirmDialog("에러", [result.message], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
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
		this.props.history.push("/findPassword");
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
			this.props.history.push(LoginPage.FirstPage);
		}
		else {
			this._setState({ loading: false, prevBeginCode: beginCode });
		}
	}

	render() {
		//if (this.state.loginError != null) {
		//	alert(this.state.loginError);
		//	return (
		//		<h2>{this.state.loginError}</h2>
		//	);
		//	return this.showConfirmDialog("에러", [this.state.loginError], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
		//}

		if (this.state.loading || this.checkAutoLogin()) {
			return (
				<h2>{this.state.loadingMessage}</h2>
			);
		}

		return (
			<>
				<div className={contents.loginBackground}>
					{/* <div id={contents.popupConts} className={contents.loginPopup}>
				    {
					   this.getLogo()
					}
					<span className={contents.loginTitleYeosu}>Virtual Data Center Service</span>

				
					<div className={contents.loginFindBox}>
						<span className={contents.loginFindEmail}><input type="radio" /><p>Email으로 찾기</p></span>
						<span className={contents.loginFindSMS}><input type="radio" /><p>SMS으로 찾기</p></span>
					</div>
					

			        <div className={contents.indexLoginBoxY}>
						<ul>
							<li><input ref={this.refID} type="text" className={contents.indexLoginYeosu} onKeyPress={(e) => this.onKeyPressLogin(e)} placeholder="아이디" /></li>
							<li><input ref={this.refPW} type="password" className={contents.indexLoginPwYeosu} onKeyPress={(e) => this.onKeyPressLogin(e)} placeholder="비밀번호" /></li>
						</ul>
	
						 <div className={accounts.loginCheck}>
							{

								this.displayVersionUI()
							}
						</div> 
				
						<div className={uis.btnArea}>
							<a className={contents.btnLoginYeosu} onClick={this.onClickLogin} >로그인</a>
					        <a className={accounts.btnSetPwdYeosu} onClick={this.onClickSetPwd}>비밀번호 찾기</a>
						    <a className={contents.loginPageBack}>로그인 페이지로 돌아가기</a>
						</div>
					</div> 
			    </div> */}

			    {/* vds */}
			    <div className={contents.loginLeftArea}>
				    <div className={contents.loginPositionBox}>
						<div className={contents.loginTopBox}>
							<span className={contents.loginText}>Login</span>
							<span className={contents.loginSelectBox}>
								<select>
								<option>한국어</option>
								<option>영어</option>
								<option>중국어</option>
								<option>폴란드어</option>
								</select>
							</span>
						</div>
						<div className={contents.loginMiddleBox}>
							<div className={contents.idBox}>
									<span className={contents.idText}>아이디</span>
									<input type="text" ref={this.refID} onKeyPress={(e) => this.onKeyPressLogin(e)} placeholder="아이디를 입력하세요." autoFocus />
							</div>
							<div className={contents.passwordBox}>
								<span className={contents.passwordText}>비밀번호</span>
								<input type="password" ref={this.refPW} onKeyPress={(e) => this.onKeyPressLogin(e)} placeholder="비밀번호를 입력하세요." />
							</div>
							<div className={contents.loginBtnBox} onClick={() => this.onClickLogin()}>로그인</div>

						{/* <div className={contents.errorBox}>
							  <span>계정을 찾을 수 없습니다.</span>
							  <span>확인 후 입력해주세요.</span>
							</div> */}
						</div>
                    </div>
					<div className={contents.loginBottomBox}>
							<span>Copyright ⓒ U&E All Rights Reserved.</span>
					</div>
				</div> 

				<div className={contents.loginRightArea}>
					<div className={contents.loginTextBox}>
							<span>VDS(Virtual Datacenter Service) v1.0</span>
						{/*<span>전산기기 및 전산실 모니터링 시스템 구축을 통한</span>*/}
						{/*<span>기기관리 체계화 및 효율적 시스템 활용 환경 구축이 가능합니다.</span>*/}

							<span>VDS는 디지털트윈 기술을 활용한</span>
							<span>데이터센터 인프라 통합관리 서비스 입니다.</span>
                    </div>
						{/*<div className={contents.numberBox}>
						<span>01</span>
						<span></span>
						<span>02</span>
						<span>03</span>
						</div>*/}
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
			</>
        );
    }
}

export default withRouter(LoginPage);