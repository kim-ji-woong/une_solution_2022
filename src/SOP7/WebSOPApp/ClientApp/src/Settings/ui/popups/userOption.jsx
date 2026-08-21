import React, { Component } from 'react';
import $ from 'jquery';
import ConfirmDialog from '../../../Common/ui/confirmDialog';

import { SettingController } from '../../services/settingController';
import SettingsStore from '../../settingsStore';
import SettingsResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';
import AccountResource from '../../../Account/resource/id';
import SdmsResource from '../../../SDMS/resource/id';
import SystemInfo from './systemInfo';

import { Monitoring3DComponent } from '../../styled/settingsStyled';
import { i18n, withTranslation } from '../../../language/i18n';

class UserOption extends Component {
    constructor(props) {
        super(props);

		this.state = {
			tabMenu: SettingsResource.userOptionMode.일반,
		}

		this.props = props;
	}

	onClickTab = (target, value) => {
		$('.MonitoringTab li a').removeClass('on');
		$(target).addClass('on');

		this.setState({ tabMenu: value});
	}

	setContentUI = () => {
		let contentUI = [];

		if (this.state.tabMenu === SettingsResource.userOptionMode.일반) {
			contentUI.push(
				<NormalTab key="NormalTab" settings={this.props.settings} onChangeNeedToSave={this.props.onChangeNeedToSave} selectedSiteID={this.props.selectedSiteID} />
			);
		} else if (this.state.tabMenu === SettingsResource.userOptionMode.시스템_정보) {
			contentUI.push(
				<SystemInfo key="SystemInfo" settings={this.props.settings} />
			);
		} 

		return contentUI;
	}

	getAuthorTab() {
		let authorTabUI = [];
		authorTabUI.push(<React.Fragment key='authorTab'>
			<li><a onClick={(e) => this.onClickTab(e.target, SettingsResource.userOptionMode.일반)} className={'on'}>{i18n.t('common.일반')}</a></li>
			<li><a onClick={(e) => this.onClickTab(e.target, SettingsResource.userOptionMode.시스템_정보)}>{i18n.t('setting.userOption.시스템 정보')}</a></li>
		</React.Fragment>);

		//let userInfo = ProjectResource.getUserInfo();
		//if (userInfo === null || userInfo === undefined)
		//	return authorTabUI;

		//if (userInfo.levelID === AccountResource.accountLevelID.master ||
		//	userInfo.levelID === AccountResource.accountLevelID.admin) {
		//	authorTabUI.push(<React.Fragment>
		//		<li><a onClick={(e) => this.onClickTab(e.target, SettingsResource.userOptionMode.시스템_정보)}>{SettingsResource.userOptionMode.시스템_정보}</a></li>
		//	</React.Fragment>);
		//}

		return authorTabUI;
	}

	render() {
		const contentUI = this.setContentUI();
		const authorTabUI = this.getAuthorTab();

        return (
            <Monitoring3DComponent>
				<ul className={'stgTab' + " MonitoringTab"}>
					{authorTabUI}
				</ul>
				<span className={'stgScroll'}>
					{contentUI}
				</span>
            </Monitoring3DComponent>
        );
    }
}

export default withTranslation()(UserOption);

class NormalTab extends Component {
	constructor(props) {
		super(props);

		this.refSDMS = React.createRef();
		this.refSOP = React.createRef();
		this.refSOPMgr = React.createRef();
		this.refTeamEdit = React.createRef();
		this.refSettings = React.createRef();
		this.refHistory = React.createRef();
		this.refDashboard = React.createRef();
		this.refHome = React.createRef();
		this.refRotation = React.createRef();

		this.refIdleTime = React.createRef();
		this.refIdleTimeUse = React.createRef();

		this.refBuildingFile = React.createRef();
		this.refGroupFile = React.createRef();
		this.refFacilityFile = React.createRef();

		this.refBuildingFileName = React.createRef();

		this.refUsePoiHighlightOn = React.createRef();
		this.refUsePoiHighlightOff = React.createRef();

		this.refTurnStart01 = React.createRef();
		this.refTurnStart02 = React.createRef();
		this.refUseAlarmTurnOn = React.createRef();
		this.refUseAlarmTurnOff = React.createRef();

		this.state = {
			confirmMessage: {
				visible: false,
				title: "",
				messages: [""],
				buttons: [''],
				onClose: this.onCloseConfirmDialog,
				onClickButton: null
			},
		}

		this.props = props;
	}

	componentDidMount() {
		this.initData();
		this.initShortcutKey();
		this.initUseAlarmTurn();

		// .TODO: 고도화 내용으로 임시 주석처리
		//this.initTurnStart();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.selectedSiteID !== this.props.selectedSiteID) {
			this.initData();
			this.initShortcutKey();
			this.initUsePoiHighlight();
			this.initUseAlarmTurn();

			// .TODO: 고도화 내용으로 임시 주석처리
			//this.initTurnStart();
		}
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

	initData() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		// 3D 모니터 회전 시간 입력 
		let idleTime = this.props.settings.properties.IdleTime;

		if (idleTime === null || idleTime === undefined)
			idleTime = "10;1";

		let arrIdleTime = idleTime.split(";");

		if (arrIdleTime.length !== 2) {
			idleTime = "10;1";
			arrIdleTime = idleTime.split(";");
        }

		this.refIdleTime.current.value = arrIdleTime[0];

		if (arrIdleTime[1] === "1")
			this.refIdleTimeUse.current.checked = true;
		else if (arrIdleTime[1] === "0")
			this.refIdleTimeUse.current.checked = false;
	}

	initShortcutKey() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		const shortcutKey = this.props.settings.shortcutKey;

		if (shortcutKey.sdms !== null && shortcutKey.sdms !== undefined && shortcutKey.sdms !== "") {
			// SDMS 단축키 입력
			let keyCode = shortcutKey.sdms;

			if (keyCode !== "") {
				keyCode = String.fromCharCode(keyCode);
			}

			this.refSDMS.current.value = keyCode;
		}
		if (shortcutKey.teamEdit !== null && shortcutKey.teamEdit !== undefined && shortcutKey.teamEdit !== "") {
			// teamEdit 단축키 입력
			let keyCode = shortcutKey.teamEdit;

			if (keyCode !== "") {
				keyCode = String.fromCharCode(keyCode);
			}

			this.refTeamEdit.current.value = keyCode;
		}
		if (shortcutKey.settings !== null && shortcutKey.settings !== undefined && shortcutKey.settings !== "") {
			// settings 단축키 입력
			let keyCode = shortcutKey.settings;

			if (keyCode !== "") {
				keyCode = String.fromCharCode(keyCode);
			}

			this.refSettings.current.value = keyCode;
		}
		if (shortcutKey.home !== null && shortcutKey.home !== undefined && shortcutKey.home !== "") {
			// home 단축키 입력
			let keyCode = shortcutKey.home;

			if (keyCode !== "") {
				keyCode = String.fromCharCode(keyCode);
			}

			this.refHome.current.value = keyCode;
		}
		if (shortcutKey.rotation !== null && shortcutKey.rotation !== undefined && shortcutKey.rotation !== "") {
			// rotation 단축키 입력
			let keyCode = shortcutKey.rotation;

			if (keyCode !== "") {
				keyCode = String.fromCharCode(keyCode);
			}

			this.refRotation.current.value = keyCode;
		}
		// GS인증 관련 UI
		if (shortcutKey.sop !== null && shortcutKey.sop !== undefined && shortcutKey.sop !== "") {
			// sop 단축키 입력
			let keyCode = shortcutKey.sop;

			if (keyCode !== "") {
				keyCode = String.fromCharCode(keyCode);
			}

			this.refSOP.current.value = keyCode;
		}
		if (shortcutKey.sopMgr !== null && shortcutKey.sopMgr !== undefined && shortcutKey.sopMgr !== "") {
			// sopMgr 단축키 입력
			let keyCode = shortcutKey.sopMgr;

			if (keyCode !== "") {
				keyCode = String.fromCharCode(keyCode);
			}

			this.refSOPMgr.current.value = keyCode;
		}
		if (shortcutKey.dashboard !== null && shortcutKey.dashboard !== undefined && shortcutKey.dashboard !== "") {
			// dashBoard 단축키 입력
			let keyCode = shortcutKey.dashboard;

			if (keyCode !== "") {
				keyCode = String.fromCharCode(keyCode);
			}

			this.refDashboard.current.value = keyCode;
		}
		if (shortcutKey.history !== null && shortcutKey.history !== undefined && shortcutKey.history !== "") {
			// history 단축키 입력
			let keyCode = shortcutKey.history;

			if (keyCode !== "") {
				keyCode = String.fromCharCode(keyCode);
			}

			this.refHistory.current.value = keyCode;
		}
	}

	initUsePoiHighlight() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let usePoiHighlight = this.props.settings.properties.UsePoiHighlight;

		if (usePoiHighlight === SettingsResource.usePoiHighlight.on) {
			this.refUsePoiHighlightOn.current.click();
		} else if (usePoiHighlight === SettingsResource.usePoiHighlight.off) {
			this.refUsePoiHighlightOff.current.click();
		}
	}

	initTurnStart() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let turnStart = this.props.settings.properties.TurnStart;

		if (turnStart === SettingsResource.turnStart.LastView) {
			this.refTurnStart01.current.click();
		} else if (turnStart === SettingsResource.turnStart.StandardView) {
			this.refTurnStart02.current.click();
		}
	}

	initUseAlarmTurn() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let useAlarmTurn = this.props.settings.properties.UseAlarmTurn;

		if (useAlarmTurn === SettingsResource.useAlarmTurn.on) {
			this.refUseAlarmTurnOn.current.click();
		} else if (useAlarmTurn === SettingsResource.useAlarmTurn.off) {
			this.refUseAlarmTurnOff.current.click();
		}
	}

	handleKeyPress = (e, id) => {
		let key = "";
		let code = "";
		let keyCode = null;

		// 숫자 또는 알파벳 또는 숫자 패드의 숫자 아니면 제외
		if (!(e.keyCode > 47 && e.keyCode < 58) && !(e.keyCode > 64 && e.keyCode < 91) && !(e.keyCode > 95 && e.keyCode < 106) && !(e.keyCode === 8 || e.keyCode === 46)) {
			e.preventDefault();
			return;
		}

		if (e.keyCode > 95 && e.keyCode < 106) {
			// 키패드 숫자
			keyCode = e.keyCode - 48;
			key = String.fromCharCode(keyCode);
			code = keyCode.toString();
		} else if (e.keyCode !== 8 && e.keyCode !== 46) {
			// 백스페이스 및 delete 키는 공백으로
			keyCode = e.keyCode;
			key = String.fromCharCode(keyCode);
			code = keyCode.toString();
		} else if (e.keyCode === 8 || e.keyCode === 46) {
			// 백스페이스 및 delete 키는 공백으로
			keyCode = e.keyCode;
			//key = String.fromCharCode(keyCode);
			//code = keyCode.toString();
		}

		if (keyCode === null && (code === "" || key === "")) {
			e.preventDefault();
			return;
		}

		let shortcutKey = this.props.settings.shortcutKey;

		if (id === SettingsResource.shortcutKey._3D_관제시스템) {
			if (code !== "" &&
				(shortcutKey.history === code ||
					shortcutKey.sop === code ||
					shortcutKey.sopMgr === code ||
					shortcutKey.teamEdit === code ||
					shortcutKey.dashboard === code ||
					shortcutKey.settings === code ||
					shortcutKey.home === code ||
					shortcutKey.rotation === code)) {
				this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.userOption.현재 사용 중인 단축키입니다')], null, null);
				this.refSDMS.current.value = "";
				shortcutKey.sdms = "";

			} else {
				this.refSDMS.current.value = key;
				shortcutKey.sdms = code;
			}

			e.preventDefault();
		} else if (id === SettingsResource.shortcutKey.조직관리) {
			if (code !== "" &&
				(shortcutKey.sdms === code ||
					shortcutKey.history === code ||
					shortcutKey.sop === code ||
					shortcutKey.sopMgr === code ||
					shortcutKey.dashboard === code ||
					shortcutKey.settings === code ||
					shortcutKey.home === code ||
					shortcutKey.rotation === code)) {
				this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.userOption.현재 사용 중인 단축키입니다')], null, null);
				this.refTeamEdit.current.value = "";
				shortcutKey.teamEdit = "";
			} else {
				this.refTeamEdit.current.value = key;
				shortcutKey.teamEdit = code;
			}

			e.preventDefault();
		} else if (id === SettingsResource.shortcutKey.설정) {
			if (code !== "" &&
				(shortcutKey.sdms === code ||
					shortcutKey.history === code ||
					shortcutKey.sop === code ||
					shortcutKey.sopMgr === code ||
					shortcutKey.teamEdit === code ||
					shortcutKey.dashboard === code ||
					shortcutKey.home === code ||
					shortcutKey.rotation === code)) {
				this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.userOption.현재 사용 중인 단축키입니다')], null, null);
				this.refSettings.current.value = "";
				shortcutKey.settings = "";
			} else {
				this.refSettings.current.value = key;
				shortcutKey.settings = code;
			}

			e.preventDefault();
		} else if (id === SettingsResource.shortcutKey.홈버튼) {
			if (code !== "" &&
				(shortcutKey.sdms === code ||
					shortcutKey.history === code ||
					shortcutKey.sop === code ||
					shortcutKey.sopMgr === code ||
					shortcutKey.teamEdit === code ||
					shortcutKey.dashboard === code ||
					shortcutKey.settings === code ||
					shortcutKey.rotation === code)) {
				this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.userOption.현재 사용 중인 단축키입니다')], null, null);
				this.refHome.current.value = "";
				shortcutKey.home = "";
			} else {
				this.refHome.current.value = key;
				shortcutKey.home = code;
			}

			e.preventDefault();
		} else if (id === SettingsResource.shortcutKey.즉시회전) {
			if (code !== "" &&
				(shortcutKey.sdms === code ||
					shortcutKey.history === code ||
					shortcutKey.sop === code ||
					shortcutKey.sopMgr === code ||
					shortcutKey.teamEdit === code ||
					shortcutKey.dashboard === code ||
					shortcutKey.home === code ||
					shortcutKey.settings === code)) {
				this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.userOption.현재 사용 중인 단축키입니다')], null, null);
				this.refRotation.current.value = "";
				shortcutKey.rotation = "";
			} else {
				this.refRotation.current.value = key;
				shortcutKey.rotation = code;
			}

			e.preventDefault();
		}
		else if (id === SettingsResource.shortcutKey.SOP_실행) {
			if (code !== "" &&
				(shortcutKey.sdms === code ||
					shortcutKey.history === code ||
					shortcutKey.sopMgr === code ||
					shortcutKey.teamEdit === code ||
					shortcutKey.dashboard === code ||
					shortcutKey.settings === code ||
					shortcutKey.home === code ||
					shortcutKey.rotation === code)) {
				this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.userOption.현재 사용 중인 단축키입니다')], null, null);
				this.refSOP.current.value = "";
				shortcutKey.sop = "";
			} else {
				this.refSOP.current.value = key;
				shortcutKey.sop = code;
			}

			e.preventDefault();
		} else if (id === SettingsResource.shortcutKey.SOP_편집) {
			if (code !== "" &&
				(shortcutKey.sdms === code ||
					shortcutKey.history === code ||
					shortcutKey.sop === code ||
					shortcutKey.teamEdit === code ||
					shortcutKey.dashboard === code ||
					shortcutKey.settings === code ||
					shortcutKey.home === code ||
					shortcutKey.rotation === code)) {
				this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.userOption.현재 사용 중인 단축키입니다')], null, null);
				this.refSOPMgr.current.value = "";
				shortcutKey.sopMgr = "";
			} else {
				this.refSOPMgr.current.value = key;
				shortcutKey.sopMgr = code;
			}

			e.preventDefault();
		} else if (id === SettingsResource.shortcutKey.대시보드) {
			if (code !== "" &&
				(shortcutKey.sdms === code ||
					shortcutKey.history === code ||
					shortcutKey.sop === code ||
					shortcutKey.sopMgr === code ||
					shortcutKey.teamEdit === code ||
					shortcutKey.settings === code ||
					shortcutKey.home === code ||
					shortcutKey.rotation === code)) {
				this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.userOption.현재 사용 중인 단축키입니다')], null, null);
				this.refDashboard.current.value = "";
				shortcutKey.dashboard = "";
			} else {
				this.refDashboard.current.value = key;
				shortcutKey.dashboard = code;
			}

			e.preventDefault();
		} else if (id === SettingsResource.shortcutKey.이력) {
			if (code !== "" &&
				(shortcutKey.sdms === code ||
					shortcutKey.sop === code ||
					shortcutKey.sopMgr === code ||
					shortcutKey.teamEdit === code ||
					shortcutKey.dashboard === code ||
					shortcutKey.settings === code ||
					shortcutKey.home === code ||
					shortcutKey.rotation === code)) {
				this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.userOption.현재 사용 중인 단축키입니다')], null, null);
				this.refHistory.current.value = "";
				shortcutKey.history = "";
			} else {
				this.refHistory.current.value = key;
				shortcutKey.history = code;
			}

			e.preventDefault();
		}
	}

	onClickPopupReset = () => {
		// 시스템 팝업 위치/사이즈 리셋
		this.showConfirmDialog(i18n.t('common.확인'), [i18n.t('setting.userOption.팝업창 위치/사이즈 초기화를 하시겠습니까?')], [i18n.t('common.취소'), i18n.t('common.확인')], this.onClickDialogPopupReset);
	}

	onClickAccoutPopupSet = () => {
		// 사용자 팝업 위치/사이즈 저장
		this.showConfirmDialog(i18n.t('common.확인'), [i18n.t('setting.userOption.현재 팝업창 위치/사이즈를 저장하시겠습니까?')], [i18n.t('common.취소'), i18n.t('common.확인')], this.onClickDialogAccoutPopupSet);
	}

	onClickAccoutPopupReset = () => {
		// 사용자 팝업 위치/사이즈 리셋
		this.showConfirmDialog(i18n.t('common.확인'), [i18n.t('setting.userOption.팝업창 위치/사이즈를 사용자 저장 값으로 초기화를 하시겠습니까?')], [i18n.t('common.취소'), i18n.t('common.확인')], this.onClickDialogAccoutPopupReset);
	}

	onClickDialogPopupReset = (index) => {
		if (index === 1) {
			this.doPopupReset();
		}

		this.onCloseConfirmDialog();
	}

	onClickDialogAccoutPopupSet = (index) => {
		if (index === 1) {
			this.doAccoutPopupSet();
		}

		this.onCloseConfirmDialog();
	}

	onClickDialogAccoutPopupReset = (index) => {
		if (index === 1) {
			this.doAccoutPopupReset();
		}

		this.onCloseConfirmDialog();
	}

	selectUsePoiHighlight = (use) => {
		if (use === null || use === undefined)
			return;

		if (use === SettingsResource.usePoiHighlight.on ||
			use === SettingsResource.usePoiHighlight.off) {
			this.props.settings.properties.UsePoiHighlight = use;
		}
	}

	async doPopupReset() {
		// 데이터 팝업 위치 및 사이즈 초기화
		let popupState = [];

		let cctvInfo = SdmsResource.popupResetLocation.cctvInfo;
		let cctvInfo_1 = SdmsResource.popupResetLocation.cctvInfo_1;
		let cctvInfo_2 = SdmsResource.popupResetLocation.cctvInfo_2;
		let cctvInfo_3 = SdmsResource.popupResetLocation.cctvInfo_3;
		let weatherInfo = SdmsResource.popupResetLocation.weatherInfo;
		let statusInfo = SdmsResource.popupResetLocation.statusInfo;
		let buildingInfo = SdmsResource.popupResetLocation.buildingInfo;
		let dashboard = SdmsResource.popupResetLocation.dashboard;
		let miniMap = SdmsResource.popupResetLocation.miniMap;
		let event = SdmsResource.popupResetLocation.event;
		let workerInfo = SdmsResource.popupResetLocation.workerInfo;
		let sensorStatus = SdmsResource.popupResetLocation.sensorStatus;
		let workerStatus = SdmsResource.popupResetLocation.workerStatus;
		let safetyAreaAssessment = SdmsResource.popupResetLocation.safetyAreaAssessment;
		let waterLevelInfo = SdmsResource.popupResetLocation.waterLevelInfo;
		let elevatorInfo = SdmsResource.popupResetLocation.elevatorInfo;

		popupState = {
			cctvInfo: cctvInfo,
			cctvInfo_1: cctvInfo_1,
			cctvInfo_2: cctvInfo_2,
			cctvInfo_3: cctvInfo_3,
			weatherInfo: weatherInfo,
			statusInfo: statusInfo,
			buildingInfo: buildingInfo,
			dashboard: dashboard,
			miniMap: miniMap,
			event: event,
			workerInfo: workerInfo,
			sensorStatus: sensorStatus,
			workerStatus: workerStatus,
			safetyAreaAssessment: safetyAreaAssessment,
			waterLevelInfo: waterLevelInfo,
			elevatorInfo: elevatorInfo
		};

		SettingsStore.dispatch({ type: 'RESET_POPUP', popupState: popupState });

		let userInfo = ProjectResource.getUserInfo();
		if (userInfo === null || userInfo === undefined) {
			this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.userOption.유저 정보를 불러오지 못했습니다.다시 시도해주세요')], null, null);
			return;
        }

		// DB 값 초기화
		const [surcess, message] = await SettingController.requestResetPopup(userInfo.id, popupState);

		if (surcess === null) {
			//alert(message);
			this.showConfirmDialog(i18n.t('common.오류'), [message], null, null);
			return;
		}
	}

	async doAccoutPopupSet() {
		let userInfo = ProjectResource.getUserInfo();
		if (userInfo === null || userInfo === undefined) {
			this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.userOption.유저 정보를 불러오지 못했습니다.다시 시도해주세요')], null, null);
			return;
		}

		// 현재 팝업 사이즈/위치 설정값 계정 팝업에 저장
		const [surcess, message] = await SettingController.requestSetAccoutPopup(userInfo.id);

		if (surcess === null) {
			this.showConfirmDialog(i18n.t('common.오류'), [message], null, null);
			return;
		}
    }

	async doAccoutPopupReset() {
		let userInfo = ProjectResource.getUserInfo();
		if (userInfo === null || userInfo === undefined) {
			this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.userOption.유저 정보를 불러오지 못했습니다.다시 시도해주세요')], null, null);
			return;
		}

		// 계정 팝업 사이즈/위치 불러오기
		const [result, message] = await SettingController.requestResetAccoutPopup(userInfo.id);

		if (result === null) {
			this.showConfirmDialog(i18n.t('common.오류'), [message], null, null);
			return;
		}

		// 계정 팝업 위치/사이즈 초기화
		let popupState = [];

		let cctvInfo = null;
		let cctvInfo_1 = null;
		let cctvInfo_2 = null;
		let cctvInfo_3 = null;
		let weatherInfo = null;
		let statusInfo = null;
		let buildingInfo = null;
		let dashboard = null;
		let miniMap = null;
		let event = null;
		let workerInfo = null;
		let sensorStatus = null;
		let workerStatus = null;

		for (let i = 0; i < result.length; i++) {
			const data = result[i];

			if (data.category === "accountPopup" && data.subCategory === "cctvInfo") {
				cctvInfo = {
					x: data.propertyValue1, y: data.propertyValue2, height: data.propertyValue3, width: data.propertyValue4
				};
			} else if (data.category === "accountPopup" && data.subCategory === "cctvInfo_1") {
				cctvInfo_1 = {
					x: data.propertyValue1, y: data.propertyValue2, height: data.propertyValue3, width: data.propertyValue4
				};
			} else if (data.category === "accountPopup" && data.subCategory === "cctvInfo_2") {
				cctvInfo_2 = {
					x: data.propertyValue1, y: data.propertyValue2, height: data.propertyValue3, width: data.propertyValue4
				};
			} else if (data.category === "accountPopup" && data.subCategory === "cctvInfo_3") {
				cctvInfo_3 = {
					x: data.propertyValue1, y: data.propertyValue2, height: data.propertyValue3, width: data.propertyValue4
				};
			} else if (data.category === "accountPopup" && data.subCategory === "weatherInfo") {
				weatherInfo = {
					x: data.propertyValue1, y: data.propertyValue2, height: data.propertyValue3, width: data.propertyValue4
				};
			} else if (data.category === "accountPopup" && data.subCategory === "statusInfo") {
				statusInfo = {
					x: data.propertyValue1, y: data.propertyValue2, height: data.propertyValue3, width: data.propertyValue4
				};
			} else if (data.category === "accountPopup" && data.subCategory === "buildingInfo") {
				buildingInfo = {
					x: data.propertyValue1, y: data.propertyValue2, height: data.propertyValue3, width: data.propertyValue4
				};
			} else if (data.category === "accountPopup" && data.subCategory === "dashboard") {
				dashboard = {
					x: data.propertyValue1, y: data.propertyValue2, height: data.propertyValue3, width: data.propertyValue4
				};
			} else if (data.category === "accountPopup" && data.subCategory === "miniMap") {
				miniMap = {
					x: data.propertyValue1, y: data.propertyValue2, height: data.propertyValue3, width: data.propertyValue4
				};
			} else if (data.category === "accountPopup" && data.subCategory === "event") {
				event = {
					x: data.propertyValue1, y: data.propertyValue2, height: data.propertyValue3, width: data.propertyValue4
				};
			} else if (data.category === "accountPopup" && data.subCategory === "workerInfo") {
				workerInfo = {
					x: data.propertyValue1, y: data.propertyValue2, height: data.propertyValue3, width: data.propertyValue4
				};
			} else if (data.category === "accountPopup" && data.subCategory === "sensorStatus") {
				sensorStatus = {
					x: data.propertyValue1, y: data.propertyValue2, height: data.propertyValue3, width: data.propertyValue4
				};
			} else if (data.category === "accountPopup" && data.subCategory === "workerStatus") {
				workerStatus = {
					x: data.propertyValue1, y: data.propertyValue2, height: data.propertyValue3, width: data.propertyValue4
				};
			}
        }
		
		popupState = {
			cctvInfo: cctvInfo,
			cctvInfo_1: cctvInfo_1,
			cctvInfo_2: cctvInfo_2,
			cctvInfo_3: cctvInfo_3,
			weatherInfo: weatherInfo,
			statusInfo: statusInfo,
			buildingInfo: buildingInfo,
			dashboard: dashboard,
			miniMap: miniMap,
			event: event,
			workerInfo: workerInfo,
			sensorStatus: sensorStatus,
			workerStatus: workerStatus,
		};

		SettingsStore.dispatch({ type: 'RESET_POPUP', popupState: popupState });
	}

	onChangeCheck = (e) => {
		let value = e.target.value;
		let inputValue = value.replace(/[^0-9\b .]/g, '');

		if (!$.isNumeric(inputValue)) {
			this.refIdleTime.current.value = "";
		} else {
			//let num = parseFloat(inputValue);
			//inputValue = num.toString();
			this.refIdleTime.current.value = inputValue;
        }
			
	}

	onBlurCheck = (e) => {
		let value = e.value;

		if (value !== "") {
			let num = parseFloat(value);
			value = num.toString();
        } 

		if (value === "0") {
			//alert("0 은 입력하실 수 없습니다.");
			this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.userOption.0 은 입력할 수 없습니다')], null, null);
			value = "";
        }

		this.refIdleTime.current.value = value;

		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let use = this.refIdleTimeUse.current.checked;
		let useValue = "1";

		if (use === false)
			useValue = "0";

		value = value + ";" + useValue;
		this.props.settings.properties.IdleTime = value;

		this.props.onChangeNeedToSave();
	}

	onChangeIdleTimeUse = () => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = this.refIdleTime.current.value;
		let use = this.refIdleTimeUse.current.checked;
		let useValue = "1";

		if (use === false)
			useValue = "0";

		value = value + ";" + useValue;
		this.props.settings.properties.IdleTime = value;

		this.props.onChangeNeedToSave();
	}

	onClickUpload = (mode) => {
		if (mode === SettingsResource.excelMode.건물정보_업데이트) {
			this.refBuildingFile.current.click();
		} else if (mode === SettingsResource.excelMode.건물그룹정보_업데이트) {
			this.refGroupFile.current.click();
		} else if (mode === SettingsResource.excelMode.설비정보_업데이트) {
			this.refFacilityFile.current.click();
		}
	}

	onSelectBuildingFile = (event) => {
		const file = event.target.files[0];
		this.refBuildingFile.current.value = "";

		const type = /(.*?)\.(xls|xlsx)$/;

		if (!file.name.match(type)) {
			this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.userOption.엑셀 파일(xls, xlsx)만 업로드 가능합니다')], null, null);
			return;
		} else if (file.size > 10485760) {
			this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.userOption.최대 10MB 엑셀 파일을 업로드 할 수 있습니다')], null, null);
			return;
        }

		this.props.settings.properties.BuildingFile = file;
		this.props.onChangeNeedToSave();
	}

	onSelectGroupFile = (event) => {
		const file = event.target.files[0];
		this.refGroupFile.current.value = "";

		const type = /(.*?)\.(xls|xlsx)$/;

		if (!file.name.match(type)) {
			this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.userOption.엑셀 파일(xls, xlsx)만 업로드 가능합니다')], null, null);
			return;
		} else if (file.size > 10485760) {
			this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.userOption.최대 10MB 엑셀 파일을 업로드 할 수 있습니다')], null, null);
			return;
		}

		this.props.settings.properties.GroupFile = file;
		this.props.onChangeNeedToSave();
	}

	onSelectFacilityFile = (event) => {
		const file = event.target.files[0];
		this.refFacilityFile.current.value = "";

		const type = /(.*?)\.(xls|xlsx)$/;

		if (!file.name.match(type)) {
			this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.userOption.엑셀 파일(xls, xlsx)만 업로드 가능합니다')], null, null);
			return;
		} else if (file.size > 10485760) {
			this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.userOption.최대 10MB 엑셀 파일을 업로드 할 수 있습니다')], null, null);
			return;
		}

		this.props.settings.properties.FacilityFile = file;
		this.props.onChangeNeedToSave();
	}

	onClickDownload = (mode) => {
		const selectedSiteID = this.props.selectedSiteID;

		if (mode === SettingsResource.excelMode.건물정보_업데이트) {
			this.downloadBuilding(selectedSiteID);
		} else if (mode === SettingsResource.excelMode.건물정보_업데이트) {
			this.downloadBuildingGroup(selectedSiteID);
		} else if (mode === SettingsResource.excelMode.설비정보_업데이트) {
			this.downloadFacility(selectedSiteID);
		}
	}

	onChangeBroadcastUse = (use) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		this.refUseBroadcast.current.checked = !this.refUseBroadcast.current.checked;
		this.refNotUseBroadcast.current.checked = !this.refNotUseBroadcast.current.checked;

		/*if (use) {
			this.refUseBroadcast.current.value = true;
			this.refNotUseBroadcast.current.value = false;
		}
		else {
			this.refUseBroadcast.current.value = false;
			this.refNotUseBroadcast.current.value = true;
        }*/

		/*let value = this.refIdleTime.current.value;
		let use = this.refIdleTimeUse.current.checked;
		let useValue = "1";

		if (use === false)
			useValue = "0";

		value = value + ";" + useValue;
		this.props.settings.properties.IdleTime = value;*/
	}

	async downloadBuilding(selectedSiteID) {
		const [surcess, message] = await SettingController.requestDownloadBuilding(selectedSiteID);

		if (surcess === null) {
			//alert(message);
			this.showConfirmDialog(i18n.t('common.오류'), [message], null, null);
        }
	}

	async downloadBuildingGroup(selectedSiteID) {
		const [surcess, message] = await SettingController.requestDownloadBuildingGroup(selectedSiteID);

		if (surcess === null) {
			//alert(message);
			this.showConfirmDialog(i18n.t('common.오류'), [message], null, null);
		}
	}

	async downloadFacility(selectedSiteID) {
		const [surcess, message] = await SettingController.requestDownloadFacility(selectedSiteID);

		if (surcess === null) {
			//alert(message);
			this.showConfirmDialog(i18n.t('common.오류'), [message], null, null);
		}
	}

	getAuthorUI() {
		let authorMenuUI = [];

		let userInfo = ProjectResource.getUserInfo();
		if (userInfo === null || userInfo === undefined)
			return authorMenuUI;

		if (userInfo.levelID === AccountResource.accountLevelID.master ||
			userInfo.levelID === AccountResource.accountLevelID.admin) {

			const excelMode = AccountResource.excelMode;

			authorMenuUI.push(<React.Fragment key='authorMenu'>
				<div className={'stgName'}>
					<h5>{i18n.t('setting.userOption.건물 정보 업데이트')}</h5>
					<span className={'stgTltp'} data-tooltip={i18n.t('setting.userOption.건물 정보를 엑셀로 업로드/다운로드 (최대 10MB 가능)')}></span>
					<a onClick={() => this.onClickUpload(excelMode.건물정보_업데이트)} className={'stgnRset' + " " + 'upload'}>{i18n.t('setting.userOption.업로드')}</a>
					<a onClick={() => this.onClickDownload(excelMode.건물정보_업데이트)} className={'stgnRset' + " " + 'ml5'}>{i18n.t('setting.userOption.다운로드')}</a>
					<input ref={this.refBuildingFile} className={'hidden'} type='file' accept='.xls,.xlsx' onChange={this.onSelectBuildingFile} />
				</div>
				<div className={'stgName'}>
					<h5>{i18n.t('setting.userOption.건물 그룹 정보 업데이트')}</h5>
					<span className={'stgTltp'} data-tooltip={i18n.t('setting.userOption.건물그룹 정보를 엑셀로 업로드/다운로드 (최대 10MB 가능)')}></span>
					<a onClick={() => this.onClickUpload(excelMode.건물정보_업데이트)} className={'stgnRset' + " " + 'upload'}>{i18n.t('setting.userOption.업로드')}</a>
					<a onClick={() => this.onClickDownload(excelMode.건물정보_업데이트)} className={'stgnRset' + " " + 'ml5'}>{i18n.t('setting.userOption.다운로드')}</a>
					<input ref={this.refGroupFile} className={'hidden'} type='file' accept='.xls,.xlsx' onChange={this.onSelectGroupFile} />
				</div>
				<div className={'stgName'}>
					<h5>{i18n.t('setting.userOption.설비 정보 업데이트')}</h5>
					<span className={'stgTltp'} data-tooltip={i18n.t('setting.userOption.설비 정보를 엑셀로 업로드/다운로드 (최대 10MB 가능)')}></span>
					<a onClick={() => this.onClickUpload(excelMode.설비정보_업데이트)} className={'stgnRset' + " " + 'upload'}>{i18n.t('setting.userOption.업로드')}</a>
					<a onClick={() => this.onClickDownload(excelMode.설비정보_업데이트)} className={'stgnRset' + " " + 'ml5'}>{i18n.t('setting.userOption.다운로드')}</a>
					<input ref={this.refFacilityFile} className={'hidden'} type='file' accept='.xls,.xlsx' onChange={this.onSelectFacilityFile} />
				</div>
			</React.Fragment>);
		}

		return authorMenuUI;
	}

	selectTurnStart = (mode) => {
		if (mode === null || mode === undefined || this.props.settings.properties.TurnStart === mode)
			return;

		if (mode === SettingsResource.turnStart.LastView ||
			mode === SettingsResource.turnStart.StandardView) {
			this.props.settings.properties.TurnStart = mode;
			this.props.onChangeNeedToSave();
		}
	}

	selectUseAlarmTurn = (mode) => {
		if (mode === null || mode === undefined || this.props.settings.properties.UseAlarmTurn === mode)
			return;

		if (mode === SettingsResource.useAlarmTurn.on ||
			mode === SettingsResource.useAlarmTurn.off) {
			this.props.settings.properties.UseAlarmTurn = mode;
			this.props.onChangeNeedToSave();
		}
	}

	render() {
		const authorMenuUI = this.getAuthorUI();

		const textKey = SettingsResource.shortcutKey;
		let shortcutKeyUI = <React.Fragment>
			<li><dl><dt>{textKey._3D_관제시스템}</dt><dd><span>Alt +</span><input ref={this.refSDMS} type="text" min="0" name="" id="keySDMS" onKeyDown={(e) => this.handleKeyPress(e, textKey._3D_관제시스템)} /></dd></dl></li>
			<li><dl><dt>{textKey.이력}</dt><dd><span>Alt +</span><input ref={this.refHistory} type="text" name="" id="keyHistory" onKeyDown={(e) => this.handleKeyPress(e, textKey.이력)} /></dd></dl></li>
			<li><dl><dt>{textKey.대시보드}</dt><dd><span>Alt +</span><input ref={this.refDashboard} type="text" name="" id="keyDashboard" onKeyDown={(e) => this.handleKeyPress(e, textKey.대시보드)} /></dd></dl></li>
			<li><dl><dt>{textKey.조직관리}</dt><dd><span>Alt +</span><input ref={this.refTeamEdit} type="text" name="" id="keyTeamEdit" onKeyDown={(e) => this.handleKeyPress(e, textKey.조직관리)} /></dd></dl></li>
			<li><dl><dt>{textKey.SOP_실행}</dt><dd><span>Alt +</span><input ref={this.refSOP} type="text" name="" id="keySOP" onKeyDown={(e) => this.handleKeyPress(e, textKey.SOP_실행)} /></dd></dl></li>
			<li><dl><dt>{textKey.설정}</dt><dd><span>Alt +</span><input ref={this.refSettings} type="text" name="" id="keySettings" onKeyDown={(e) => this.handleKeyPress(e, textKey.설정)} /></dd></dl></li>
			<li><dl><dt>{textKey.SOP_편집}</dt><dd><span>Alt +</span><input ref={this.refSOPMgr} type="text" name="" id="keySOPMgr" onKeyDown={(e) => this.handleKeyPress(e, textKey.SOP_편집)} /></dd></dl></li>
			<li><dl><dt>{textKey.홈버튼}</dt><dd><span>Alt +</span><input ref={this.refHome} type="text" name="" id="keyHome" onKeyDown={(e) => this.handleKeyPress(e, textKey.홈버튼)} /></dd></dl></li>
			<li><dl><dt>{textKey.즉시회전}</dt><dd><span>Alt +</span><input ref={this.refRotation} type="text" name="" id="keyRotation" onKeyDown={(e) => this.handleKeyPress(e, textKey.즉시회전)} /></dd></dl></li>
		</React.Fragment>;

		if (ProjectResource.SiteID === ProjectResource.Site.SUJAIN) {
			shortcutKeyUI = <React.Fragment>
				<li><dl><dt>{textKey._3D_관제시스템}</dt><dd><span>Alt +</span><input ref={this.refSDMS} type="text" min="0" name="" id="keySDMS" onKeyDown={(e) => this.handleKeyPress(e, textKey._3D_관제시스템)} /></dd></dl></li>
				<li><dl><dt>{textKey.이력}</dt><dd><span>Alt +</span><input ref={this.refHistory} type="text" name="" id="keyHistory" onKeyDown={(e) => this.handleKeyPress(e, textKey.이력)} /></dd></dl></li>
				<li><dl><dt>{textKey.조직관리}</dt><dd><span>Alt +</span><input ref={this.refTeamEdit} type="text" name="" id="keyTeamEdit" onKeyDown={(e) => this.handleKeyPress(e, textKey.조직관리)} /></dd></dl></li>
				<li><dl><dt>{textKey.SOP_실행}</dt><dd><span>Alt +</span><input ref={this.refSOP} type="text" name="" id="keySOP" onKeyDown={(e) => this.handleKeyPress(e, textKey.SOP_실행)} /></dd></dl></li>
				<li><dl><dt>{textKey.설정}</dt><dd><span>Alt +</span><input ref={this.refSettings} type="text" name="" id="keySettings" onKeyDown={(e) => this.handleKeyPress(e, textKey.설정)} /></dd></dl></li>
				<li><dl><dt>{textKey.SOP_편집}</dt><dd><span>Alt +</span><input ref={this.refSOPMgr} type="text" name="" id="keySOPMgr" onKeyDown={(e) => this.handleKeyPress(e, textKey.SOP_편집)} /></dd></dl></li>
				<li><dl><dt>{textKey.홈버튼}</dt><dd><span>Alt +</span><input ref={this.refHome} type="text" name="" id="keyHome" onKeyDown={(e) => this.handleKeyPress(e, textKey.홈버튼)} /></dd></dl></li>
				<li><dl><dt>{textKey.즉시회전}</dt><dd><span>Alt +</span><input ref={this.refRotation} type="text" name="" id="keyRotation" onKeyDown={(e) => this.handleKeyPress(e, textKey.즉시회전)} /></dd></dl></li>
			</React.Fragment>;
		}


		return (
			<>
				<div className={'stgList'}>
					<div className={'stgName'}>
						<h5>{i18n.t('setting.userOption.3D 회전 대기시간')}</h5>
						<span className={'stgTltp'} data-tooltip={i18n.t('setting.userOption.3D 회전 대기시간을 설정 합니다')}></span>
						<input type="text" ref={this.refIdleTime} className={'settingInput'} name="" id="" onChange={(e) => this.onChangeCheck(e)} onBlur={(e) => this.onBlurCheck(e.target)} /><span className={'white'}>{i18n.t('setting.userOption.분')} &nbsp;&nbsp;</span>
						<span className={'white'}>&nbsp;&nbsp;{i18n.t('setting.userOption.자동회전 사용')} &nbsp;&nbsp;</span><input ref={this.refIdleTimeUse} type="checkbox" name="" id="" onChange={this.onChangeIdleTimeUse} />
					</div>
					<div className={'stgName' + " " + 'settingRadio'}>
						<h5>{i18n.t('setting.userOption.알람시 회전기능')}</h5>
						<span className={'stgTltp'} data-tooltip={i18n.t('setting.userOption.알람 발생시 회전기능 사용여부')}>&nbsp;&nbsp;</span>

						<input type="radio" ref={this.refUseAlarmTurnOn} name="useAlarmTurn" id="useAlarmTurnOn" onChange={() => this.selectUseAlarmTurn(SettingsResource.useAlarmTurn.on)} />
						<span className={'white'}>&nbsp;&nbsp;{i18n.t('setting.userOption.사용')} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>

						<input type="radio" ref={this.refUseAlarmTurnOff} name="useAlarmTurn" id="useAlarmTurnOff" onChange={() => this.selectUseAlarmTurn(SettingsResource.useAlarmTurn.off)} />
						<span className={'white'}>&nbsp;&nbsp;{i18n.t('setting.userOption.사용안함')} &nbsp;&nbsp;</span>
					</div>
					<div className={'stgName'}>
						<h5>{i18n.t('setting.userOption.팝업창 위치/사이즈 초기화')}</h5>
						<span className={'stgTltp'} data-tooltip={i18n.t('setting.userOption.팝업창 위치 및 사이즈를 초기화 합니다')}></span>
						<a onClick={this.onClickPopupReset} className={'stgnRset'}>{i18n.t('setting.userOption.시스템 기본값')}</a>
						<a onClick={this.onClickAccoutPopupSet} className={'stgnRset ml5'}>{i18n.t('setting.userOption.사용자 설정')}</a>
						<a onClick={this.onClickAccoutPopupReset} className={'stgnRset ml5'}>{i18n.t('setting.userOption.사용자 기본값')}</a>
					</div>

					<div className={'stgName'}>
						<h5>{i18n.t('setting.userOption.단축키 설정')}</h5>
						<span className={'stgTltp'} data-tooltip={i18n.t('setting.userOption.단위 시스템 불러오기 단축키 기능을 설정 합니다')}></span>
						<ul className={'stgnKey'}>
							{shortcutKeyUI}
						</ul>
					</div>

				</div>
				{
					/* alert창 대신 사용 */
					this.state.confirmMessage.visible &&
					<ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
				}
			</>
		);
	}
}