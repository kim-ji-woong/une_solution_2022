import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import SessionString from '../../Common/js/sessionString';
import ConfirmDialog from '../../Common/ui/confirmHydrogen';

import uis from '../../Common/css/ui.module.css';
import contents from '../../Common/css/content.module.css';
import accounts from '../css/account.module.css';
import newStyles from '../../Common/css/newStyle.module.css';

import $ from 'jquery';

import { AccountController } from '../services/accountController';

import logo from '../../Common/image/common/index_logo.png';
import Glogo from '../../Common/image/common/GCgreencross_white.png';
import sujainLogo from '../../Common/image/common/logo_sujain.png';
import wonikLogo from '../../Common/image/common/logo_wonik.png';
import senkoLogo from '../../Common/image/common/logo_senko2.png';
import magogLogo from '../../Common/image/common/logo_magog2.png';

import { SDMSController } from '../../SDMS/services/sdmsController';
import ProjectResource from '../../Root/resource/id';
import AccountResource from '../resource/id';
import { SettingController } from '../../Settings/services/settingController';
import { i18n, withTranslation } from '../../language/i18n';

class LoginPageSB extends Component {
	static FirstPage = ProjectResource.path.sdms;

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
				buttons: [i18n.t('common.확인')],
				onClose: this.onCloseConfirmDialog,
				onClickButton: null
			},
			//reload: null,
			isFullVersion: true,	// 고,저용량 선택 인자 (true: 고용량(default), false: 저용량)
			loading: true,
			logoUrl: null,
			prevBeginCode: null
		}

		this.props = props;
		//this.initSiteID();
		this.checkLogin();
	}

	componentDidMount() {
		$('body').css({ 'background': 'rgba(0,0,0,0.9)' });

		if (ProjectResource.SiteID === ProjectResource.Site.Tlb) {
			LoginPageSB.FirstPage = ProjectResource.path.sopSimulator;
        }

		this.requestLogo();
	}

	//async initSiteID() {
	//	let siteID = ProjectResource.SiteID;

	//	if (siteID === null || siteID === undefined) {
	//		// 사이트 ID 요청
	//		siteID = await ProjectResource.loadSiteID();

	//		this.setState({ reload: true });
	//	}
	//}

	async checkLogin() {
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

			// SDMS 페이지로 이동
			this.props.history.push(LoginPageSB.FirstPage);
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

		this.setState({ confirmMessage });
	}

	onCloseConfirmDialog = () => {
		const confirmMessage = { ...this.state.confirmMessage };
		confirmMessage.visible = false;

		this.setState({ confirmMessage });
	}

	requestLogo() {
		//// DB에서 읽기
		//if (ProjectResource.SiteID !== ProjectResource.Site.Soulbrain && ProjectResource.SiteID !== ProjectResource.Site.GCC
		//	&& ProjectResource.SiteID !== ProjectResource.Site.SUJAIN && ProjectResource.SiteID !== ProjectResource.Site.Wonik
		//	&& ProjectResource.SiteID !== ProjectResource.Site.Tlb) {
		//	const [sdmsSettings, sdmsMessage] = await SettingController.requestSdmsCommonSettings();

		//	if (sdmsSettings) {
		//		const targetItem = "LoginLogo";
		//		const loginLogo = sdmsSettings[targetItem];

		//		if (!loginLogo) {
		//			setTimeout(() => this.requestLogo(), 1000);
		//		}
		//		else {
		//			this.setState({ loading: false, logoUrl: loginLogo });
		//		}
		//	}
		//}
		//else {
			this.setState({ loading: false });
        //}
    }

	getLogo(){
		if (ProjectResource.SiteID === ProjectResource.Site.Soulbrain) {
			return <div className={contents.indexLoginTitlee}><img className={accounts.logoSize} src={logo} alt="soulbrain" /></div>
		} else if (ProjectResource.SiteID === ProjectResource.Site.GCC) {
			return <div className={contents.indexLoginTitle}><img className={accounts.logoSizeGC} src={Glogo} alt="녹십자" /></div>
		} else if (ProjectResource.SiteID === ProjectResource.Site.SUJAIN) {
			return <div className={contents.indexLoginTitle}><img className={accounts.logoSizeGC} src={sujainLogo} alt="수자인" /></div>
		} else if (ProjectResource.SiteID === ProjectResource.Site.Wonik) {
			return <div className={contents.indexLoginTitle}><img className={accounts.logoSizeGC} src={wonikLogo} alt="원익" /></div>
		} else if (ProjectResource.SiteID === ProjectResource.Site.Tlb) {
			//return <div className={contents.indexLoginTitle}><img className={accounts.logoSizeGC} src={wonikLogo} alt="TLB" /></div>
		} else if (ProjectResource.SiteID === ProjectResource.Site.SENKO) {
			return <div className={contents.indexLoginTitleS}><img className={accounts.logoSizeS} src={senkoLogo} alt="센코" /></div>
		} else if (ProjectResource.SiteID === ProjectResource.Site.Hydrogen) {
			return <div className={contents.indexLoginTitleS}><img className={accounts.logoSizeS} src={senkoLogo} alt="수소충전소" /></div>
		} else if (ProjectResource.SiteID === ProjectResource.Site.Magog) {
			return <div className={contents.indexLoginTitle}><img className={accounts.logoSizeMagog} src={magogLogo} alt="원그로브" /></div>
		}

		if (this.state.logoUrl) {
			return <div className={contents.indexLoginTitle}><img className={accounts.logoSize} src={logo} alt='main logo' /></div>
		}

		return <></>
    }

	onChangeSelectVer = (isFullVersion) => {
		this.setState({ isFullVersion: isFullVersion });
	}

	displayVersionUI = () => {
		// 솔브레인 버전 선택
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
		this.setState({ loading: true });

		const result = await AccountController.autoLogin(beginCode);
		this.onAutoLogin(result, beginCode);
		window.history.pushState(null, null, window.location.origin);
	}

	onAutoLogin(loginData, beginCode) {
		if (loginData?.success) {
			ProjectResource.setLoginUser(loginData.user);
			this.setState({ loading: false, prevBeginCode: beginCode });

			// 다른 페이지로 이동
			this.props.history.push(LoginPageSB.FirstPage);
		}
		else {
			this.setState({ loading: false, prevBeginCode: beginCode });
		}
	}

	render() {
		if (this.state.loginError) {
			alert(this.state.loginError);
		}

		if (this.state.loading || this.checkAutoLogin()) {
			return (
				<h2>{i18n.t('account.데이터를 불러오고 있습니다')}</h2>
			);
		}

		return (
			<>
				<div id={contents.popupConts} className={contents.loginPopup}>
					{
						this.getLogo()
                    }
					<div className={contents.indexLoginBox}>
    					<ul>
							<li><input ref={this.refID} type="text" className={contents.indexLoginId} onKeyPress={(e) => this.onKeyPressLogin(e)} placeholder="ID" /></li>
							<li><input ref={this.refPW} type="password" className={contents.indexLoginPw} onKeyPress={(e) => this.onKeyPressLogin(e)} placeholder="Password" /></li>
						</ul>
	
						<div className={accounts.loginCheck}>
							{
								this.displayVersionUI()
							}
						</div>
				
						<div className={uis.btnArea}>
							<a className={contents.btnLogin} onClick={this.onClickLogin} >{i18n.t('account.로그인')}</a>
							<a className={accounts.btnSetPwd} onClick={this.onClickSetPwd}>{i18n.t('account.비밀번호 변경')}</a>
						</div>
						<div className={accounts.verText}>
							<span className={accounts.verText1}>Ver. { ProjectResource.version }</span>
							<span className={accounts.verText2}>Copyright &nbsp; U&E &nbsp; Inc. &nbsp; All &nbsp; rights &nbsp; reserved.</span>
					    </div>
					</div>
				</div>
				<div className={uis.dim}></div>
				{
					/* alert창 대신 사용 */
					this.state.confirmMessage.visible &&
					<ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
				}
			</>
        );
    }
}

export default withRouter(withTranslation()(LoginPageSB));