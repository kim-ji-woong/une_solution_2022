import React, { Component } from 'react';
import { Container } from 'reactstrap';
import $ from 'jquery';
import SelectReceiver from './selectReceiver';
import ConfirmDialog from '../../../Common/ui/confirmDialog';

import newStyles from '../../../Common/css/newStyle.module.css';
import newDefaults from '../../../Common/css/newDefault.module.css';
import settings from '../../css/settings.module.css';

import SettingResource from '../../resource/id';
import { SettingController } from '../../services/settingController';
import SessionString from '../../../Common/js/sessionString';
import SettingsStore from '../../settingsStore';
//import { array } from '@amcharts/amcharts4/core';
import SettingsResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';
import AccountResource from '../../../Account/resource/id';
import SDMSResource from '../../../SDMS/resource/id';
import { SDMSController } from '../../../SDMS/services/sdmsController';

import { SettingCommon, StgTab, Monitoring3DCont } from '../../styled/SettingStyled';
import SdmsResource from '../../../SDMS/resource/id';

class Monitoring3D extends Component {
    constructor(props) {
        super(props);

		this.state = {
			tabMenu: SettingResource.ID.monitoring3DMode.normal,
			errorMessage: false,
			currentSensorType: SettingResource.sensorType.Entire,
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

		if (this.state.tabMenu === SettingResource.ID.monitoring3DMode.normal) {
			contentUI.push(<NormalTab key="NormalTab" settings={this.props.settings} siteID={this.props.siteID} />);
		} else if (this.state.tabMenu === SettingResource.ID.monitoring3DMode.spread) {
			contentUI.push(<SpreadTab key="SpreadTab" settings={this.props.settings} buildingGroupList={this.props.buildingGroupList} spreadMessages={this.props.spreadMessages} teamTreeDatas={this.props.teamTreeDatas} teams={this.props.teams} members={this.props.members} />);
		} else if (this.state.tabMenu === SettingResource.ID.monitoring3DMode.detection) {
			contentUI.push(<DetectionTab key="DetectionTab" settings={this.props.settings} yeosuSettings={this.props.yeosuSettings} />);
        }

		return contentUI;
	}

	getAuthorTab() {
		let authorTabUI = [];
		authorTabUI.push(<React.Fragment><li><a onClick={(e) => this.onClickTab(e.target, SettingResource.ID.monitoring3DMode.normal)} className={'on'}>일반</a></li></React.Fragment>);

		let userInfo = ProjectResource.getUserInfo();
		if (userInfo === null || userInfo === undefined)
			return authorTabUI;

		if (userInfo.level === AccountResource.ID.accountLevel.admin) {
			authorTabUI.push(<React.Fragment>
				<li><a onClick={(e) => this.onClickTab(e.target, SettingResource.ID.monitoring3DMode.spread)}>이벤트초기전파</a></li>
				<li><a onClick={(e) => this.onClickTab(e.target, SettingResource.ID.monitoring3DMode.detection)}>센서알람</a></li>
			</React.Fragment>);
		}

		return authorTabUI;
	}



	onClickClose = (mode) => {
		this.state.onOffState = false;
		//console.log('onOffState: ' + this.state.onOffState);

		this.props.settingOff(mode);
	}

	render() {
		const contentUI = this.setContentUI();
		const authorTabUI = this.getAuthorTab();
		this.state.onOffState = true;

        return (
            <>
				<StgTab className={'stgTab' + " MonitoringTab"}>
					{authorTabUI}
				</StgTab>
				<Monitoring3DCont className={'stgScroll'}>
					{contentUI}
				</Monitoring3DCont>
            </>
        );
    }
}

export default Monitoring3D;

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

		this.refIdleTimeType1 = React.createRef();
		this.refIdleTimeType2 = React.createRef();
		this.refIdleTimeType3 = React.createRef();
		this.refIdleTime = React.createRef(); // 직접입력 회전 대기시간
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

		this.refWeatherStateOn = React.createRef();
		this.refWeatherStateOff = React.createRef();

		this.refWeatherSoundStateOn = React.createRef();
		this.refWeatherSoundStateOff = React.createRef();

		this.state = {
			confirmMessage: {
				visible: false,
				title: "",
				messages: [""],
				buttons: ["확인"],
				onClose: this.onCloseConfirmDialog,
				onClickButton: null
			},
		}

		this.props = props;

		this.currentIdleTime = '';
	}

	componentDidMount() {
		this.initData();
		this.initShortcutKey();

		// .TODO: 고도화 내용으로 임시 주석처리
		//this.initUsePoiHighlight();
		//this.initTurnStart();
		//this.initUseAlarmTurn();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.settings !== this.props.settings) {
			this.initData();
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
		let idleTime = this.props.settings.idleTime;

		if (idleTime === null || idleTime === undefined)
			idleTime = "15;1";

		let arrIdleTime = idleTime.split(";");

		if (arrIdleTime.length !== 2) {
			idleTime = "15;1";
			arrIdleTime = idleTime.split(";");
        }

		/*this.refIdleTime.current.value = arrIdleTime[0];*/

		const savedTime = arrIdleTime[0];
		this.currentIdleTime = arrIdleTime[0];

		if (savedTime === '15') {
			this.refIdleTimeType1.current.checked = false;
			this.refIdleTimeType2.current.checked = false;
			this.refIdleTimeType3.current.checked = true;
		} else if (savedTime === '10') {
			this.refIdleTimeType1.current.checked = false;
			this.refIdleTimeType2.current.checked = true;
			this.refIdleTimeType3.current.checked = false;
		} else if (savedTime === '5') {
			this.refIdleTimeType1.current.checked = true;
			this.refIdleTimeType2.current.checked = false;
			this.refIdleTimeType3.current.checked = false;
		} else {
			this.refIdleTimeType1.current.checked = false;
			this.refIdleTimeType2.current.checked = false;
			this.refIdleTimeType3.current.checked = false; // Default

			this.props.settings.idleTime = idleTime;
		}

		if (arrIdleTime[1] === "1")
			this.refIdleTimeUse.current.checked = true;
		else if (arrIdleTime[1] === "0")
			this.refIdleTimeUse.current.checked = false;

		let weatherState = this.props.settings.weatherState;
		let weatherSoundState = this.props.settings.weatherSoundState;

		if (weatherState === "1") {
			this.refWeatherStateOn.current.checked = true;
			this.refWeatherStateOff.current.checked = false;
		} else if (weatherState === "0") {
			this.refWeatherStateOn.current.checked = false;
			this.refWeatherStateOff.current.checked = true;
		}

		if (weatherSoundState === "1") {
			this.refWeatherSoundStateOn.current.checked = true;
			this.refWeatherSoundStateOff.current.checked = false;
		} else if (weatherSoundState === "0") {
			this.refWeatherSoundStateOn.current.checked = false;
			this.refWeatherSoundStateOff.current.checked = true;
		}
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
		if (shortcutKey.sop !== null && shortcutKey.sop !== undefined && shortcutKey.sop !== "" && ProjectResource.isGSMode !== true) {
			// sop 단축키 입력
			let keyCode = shortcutKey.sop;

			if (keyCode !== "") {
				keyCode = String.fromCharCode(keyCode);
			}

			this.refSOP.current.value = keyCode;
		}
		if (shortcutKey.sopMgr !== null && shortcutKey.sopMgr !== undefined && shortcutKey.sopMgr !== "" && ProjectResource.isGSMode !== true) {
			// sopMgr 단축키 입력
			let keyCode = shortcutKey.sopMgr;

			if (keyCode !== "") {
				keyCode = String.fromCharCode(keyCode);
			}

			this.refSOPMgr.current.value = keyCode;
		}
		if (shortcutKey.dashboard !== null && shortcutKey.dashboard !== undefined && shortcutKey.dashboard !== "" && ProjectResource.isGSMode !== true) {
			// dashBoard 단축키 입력
			let keyCode = shortcutKey.dashboard;

			if (keyCode !== "") {
				keyCode = String.fromCharCode(keyCode);
			}

			this.refDashboard.current.value = keyCode;
		}
		if (shortcutKey.history !== null && shortcutKey.history !== undefined && shortcutKey.history !== "" && ProjectResource.isGSMode !== true) {
			// history 단축키 입력
			let keyCode = shortcutKey.history;

			if (keyCode !== "") {
				keyCode = String.fromCharCode(keyCode);
			}

			this.refHistory.current.value = keyCode;
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

		if (id === SettingResource.ID.shortcutKey.sdms) {
			if (code !== "" &&
				(shortcutKey.history === code ||
					shortcutKey.sop === code ||
					shortcutKey.sopMgr === code ||
					shortcutKey.teamEdit === code ||
					shortcutKey.dashboard === code ||
					shortcutKey.settings === code ||
					shortcutKey.home === code ||
					shortcutKey.rotation === code)) {
				//alert("현재 사용 중인 단축키 입니다.");
				this.showConfirmDialog("에러", ["현재 사용 중인 단축키 입니다."], null, null);
				this.refSDMS.current.value = "";
				shortcutKey.sdms = "";

			} else {
				this.refSDMS.current.value = key;
				shortcutKey.sdms = code;
			}

			e.preventDefault();
		} else if (id === SettingResource.ID.shortcutKey.teamEdit) {
			if (code !== "" &&
				(shortcutKey.sdms === code ||
					shortcutKey.history === code ||
					shortcutKey.sop === code ||
					shortcutKey.sopMgr === code ||
					shortcutKey.dashboard === code ||
					shortcutKey.settings === code ||
					shortcutKey.home === code ||
					shortcutKey.rotation === code)) {
				//alert("현재 사용 중인 단축키 입니다.");
				this.showConfirmDialog("에러", ["현재 사용 중인 단축키 입니다."], null, null);
				this.refTeamEdit.current.value = "";
				shortcutKey.teamEdit = "";
			} else {
				this.refTeamEdit.current.value = key;
				shortcutKey.teamEdit = code;
			}

			e.preventDefault();
		} else if (id === SettingResource.ID.shortcutKey.settings) {
			if (code !== "" &&
				(shortcutKey.sdms === code ||
					shortcutKey.history === code ||
					shortcutKey.sop === code ||
					shortcutKey.sopMgr === code ||
					shortcutKey.teamEdit === code ||
					shortcutKey.dashboard === code ||
					shortcutKey.home === code ||
					shortcutKey.rotation === code)) {
				//alert("현재 사용 중인 단축키 입니다.");
				this.showConfirmDialog("에러", ["현재 사용 중인 단축키 입니다."], null, null);
				this.refSettings.current.value = "";
				shortcutKey.settings = "";
			} else {
				this.refSettings.current.value = key;
				shortcutKey.settings = code;
			}

			e.preventDefault();
		} else if (id === SettingResource.ID.shortcutKey.home) {
			if (code !== "" &&
				(shortcutKey.sdms === code ||
					shortcutKey.history === code ||
					shortcutKey.sop === code ||
					shortcutKey.sopMgr === code ||
					shortcutKey.teamEdit === code ||
					shortcutKey.dashboard === code ||
					shortcutKey.settings === code ||
					shortcutKey.rotation === code)) {
				//alert("현재 사용 중인 단축키 입니다.");
				this.showConfirmDialog("에러", ["현재 사용 중인 단축키 입니다."], null, null);
				this.refHome.current.value = "";
				shortcutKey.home = "";
			} else {
				this.refHome.current.value = key;
				shortcutKey.home = code;
			}

			e.preventDefault();
		} else if (id === SettingResource.ID.shortcutKey.rotation) {
			if (code !== "" &&
				(shortcutKey.sdms === code ||
					shortcutKey.history === code ||
					shortcutKey.sop === code ||
					shortcutKey.sopMgr === code ||
					shortcutKey.teamEdit === code ||
					shortcutKey.dashboard === code ||
					shortcutKey.home === code ||
					shortcutKey.settings === code)) {
				this.showConfirmDialog("에러", ["현재 사용 중인 단축키 입니다."], null, null);
				this.refRotation.current.value = "";
				shortcutKey.rotation = "";
			} else {
				this.refRotation.current.value = key;
				shortcutKey.rotation = code;
			}

			e.preventDefault();
		}
		// GS인증 관련 UI
		else if (id === SettingResource.ID.shortcutKey.sop && ProjectResource.isGSMode !== true) {
			if (code !== "" &&
				(shortcutKey.sdms === code ||
					shortcutKey.history === code ||
					shortcutKey.sopMgr === code ||
					shortcutKey.teamEdit === code ||
					shortcutKey.dashboard === code ||
					shortcutKey.settings === code ||
					shortcutKey.home === code ||
					shortcutKey.rotation === code)) {
				//alert("현재 사용 중인 단축키 입니다.");
				this.showConfirmDialog("에러", ["현재 사용 중인 단축키 입니다."], null, null);
				this.refSOP.current.value = "";
				shortcutKey.sop = "";
			} else {
				this.refSOP.current.value = key;
				shortcutKey.sop = code;
			}

			e.preventDefault();
		} else if (id === SettingResource.ID.shortcutKey.sopMgr && ProjectResource.isGSMode !== true) {
			if (code !== "" &&
				(shortcutKey.sdms === code ||
					shortcutKey.history === code ||
					shortcutKey.sop === code ||
					shortcutKey.teamEdit === code ||
					shortcutKey.dashboard === code ||
					shortcutKey.settings === code ||
					shortcutKey.home === code ||
					shortcutKey.rotation === code)) {
				//alert("현재 사용 중인 단축키 입니다.");
				this.showConfirmDialog("에러", ["현재 사용 중인 단축키 입니다."], null, null);
				this.refSOPMgr.current.value = "";
				shortcutKey.sopMgr = "";
			} else {
				this.refSOPMgr.current.value = key;
				shortcutKey.sopMgr = code;
			}

			e.preventDefault();
		} else if (id === SettingResource.ID.shortcutKey.dashBoard && ProjectResource.isGSMode !== true) {
			if (code !== "" &&
				(shortcutKey.sdms === code ||
					shortcutKey.history === code ||
					shortcutKey.sop === code ||
					shortcutKey.sopMgr === code ||
					shortcutKey.teamEdit === code ||
					shortcutKey.settings === code ||
					shortcutKey.home === code ||
					shortcutKey.rotation === code)) {
				//alert("현재 사용 중인 단축키 입니다.");
				this.showConfirmDialog("에러", ["현재 사용 중인 단축키 입니다."], null, null);
				this.refDashboard.current.value = "";
				shortcutKey.dashboard = "";
			} else {
				this.refDashboard.current.value = key;
				shortcutKey.dashboard = code;
			}

			e.preventDefault();
		} else if (id === SettingResource.ID.shortcutKey.history && ProjectResource.isGSMode !== true) {
			if (code !== "" &&
				(shortcutKey.sdms === code ||
					shortcutKey.sop === code ||
					shortcutKey.sopMgr === code ||
					shortcutKey.teamEdit === code ||
					shortcutKey.dashboard === code ||
					shortcutKey.settings === code ||
					shortcutKey.home === code ||
					shortcutKey.rotation === code)) {
				//alert("현재 사용 중인 단축키 입니다.");
				this.showConfirmDialog("에러", ["현재 사용 중인 단축키 입니다."], null, null);
				this.refHistory.current.value = "";
				shortcutKey.history = "";
			} else {
				this.refHistory.current.value = key;
				shortcutKey.history = code;
			}

			e.preventDefault();
		}
	}

	initUsePoiHighlight() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let usePoiHighlight = this.props.settings.usePoiHighlight;

		if (usePoiHighlight === SettingsResource.usePoiHighlight.on) {
			this.refUsePoiHighlightOn.current.click();
		} else if (usePoiHighlight === SettingsResource.usePoiHighlight.off) {
			this.refUsePoiHighlightOff.current.click();
		}
	}

	initTurnStart() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let turnStart = this.props.settings.turnStart;

		if (turnStart === SettingsResource.turnStart.LastView) {
			this.refTurnStart01.current.click();
		} else if (turnStart === SettingsResource.turnStart.StandardView) {
			this.refTurnStart02.current.click();
		}
	}

	initUseAlarmTurn() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let useAlarmTurn = this.props.settings.useAlarmTurn;

		if (useAlarmTurn === SettingsResource.useAlarmTurn.on) {
			this.refUseAlarmTurnOn.current.click();
		} else if (useAlarmTurn === SettingsResource.useAlarmTurn.off) {
			this.refUseAlarmTurnOff.current.click();
		}
	}

	onClickPopupReset = () => {
		// 시스템 팝업 위치/사이즈 리셋
		this.showConfirmDialog("확인", ["팝업창 위치/사이즈 초기화를 하시겠습니까?"], ["확인", "취소"], this.onClickDialogPopupReset);
	}

	onClickAccoutPopupSet = () => {
		// 사용자 팝업 위치/사이즈 저장
		this.showConfirmDialog("확인", ["현재 팝업창 위치/사이즈를 저장하시겠습니까?"], ["확인", "취소"], this.onClickDialogAccoutPopupSet);
	}

	onClickAccoutPopupReset = () => {
		// 사용자 팝업 위치/사이즈 리셋
		this.showConfirmDialog("확인", ["팝업창 위치/사이즈를 사용자 저장 값으로 초기화를 하시겠습니까?"], ["확인", "취소"], this.onClickDialogAccoutPopupReset);
	}

	onClickDialogPopupReset = (index) => {
		if (index === 0) {
			this.doPopupReset();
			this.onCloseConfirmDialog();
        } else if (index === 1)
			this.onCloseConfirmDialog();
	}

	onClickDialogAccoutPopupSet = (index) => {
		if (index === 0) {
			this.doAccoutPopupSet();
			this.onCloseConfirmDialog();
		} else if (index === 1)
			this.onCloseConfirmDialog();
	}

	onClickDialogAccoutPopupReset = (index) => {
		if (index === 0) {
			this.doAccoutPopupReset();
			this.onCloseConfirmDialog();
		} else if (index === 1)
			this.onCloseConfirmDialog();
	}

	selectUsePoiHighlight = (use) => {
		if (use === null || use === undefined)
			return;

		if (use === SettingsResource.usePoiHighlight.on ||
			use === SettingsResource.usePoiHighlight.off) {
			this.props.settings.usePoiHighlight = use;
		}
	}

	async doPopupReset() {
		// 데이터 팝업 위치 및 사이즈 초기화
		let popupState = [];

		let cctvInfo = SDMSResource.popupResetLocation.cctvInfo;
		let cctvInfo_1 = SDMSResource.popupResetLocation.cctvInfo_1;
		let cctvInfo_2 = SDMSResource.popupResetLocation.cctvInfo_2;
		let cctvInfo_3 = SDMSResource.popupResetLocation.cctvInfo_3;
		let weatherInfo = SDMSResource.popupResetLocation.weatherInfo;
		let statusInfo = SDMSResource.popupResetLocation.statusInfo;
		let buildingInfo = SDMSResource.popupResetLocation.buildingInfo;
		let dashboard = SDMSResource.popupResetLocation.dashboard;
		let miniMap = SDMSResource.popupResetLocation.miniMap;
		let eventInfo = SDMSResource.popupResetLocation.eventInfo;

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
			eventInfo: eventInfo,
		};

		SettingsStore.dispatch({ type: 'RESET_POPUP', popupState: popupState });

		let userInfo = ProjectResource.getUserInfo();
		if (userInfo === null || userInfo === undefined) {
			this.showConfirmDialog("에러", ["유저 정보를 불러오지 못했습니다. 다시 시도해주세요."], null, null);
			return;
        }

		// DB 값 초기화
		const [surcess, message] = await SettingController.requestResetPopup(userInfo.id, popupState);

		if (surcess === null) {
			//alert(message);
			this.showConfirmDialog("에러", [message], null, null);
			return;
		}
	}

	async doAccoutPopupSet() {
		let userInfo = ProjectResource.getUserInfo();
		if (userInfo === null || userInfo === undefined) {
			this.showConfirmDialog("에러", ["유저 정보를 불러오지 못했습니다. 다시 시도해주세요."], null, null);
			return;
		}

		// 현재 팝업 사이즈/위치 설정값 계정 팝업에 저장
		const [surcess, message] = await SettingController.requestSetAccoutPopup(userInfo.id);

		if (surcess === null) {
			this.showConfirmDialog("에러", [message], null, null);
			return;
		}
    }

	async doAccoutPopupReset() {
		let userInfo = ProjectResource.getUserInfo();
		if (userInfo === null || userInfo === undefined) {
			this.showConfirmDialog("에러", ["유저 정보를 불러오지 못했습니다. 다시 시도해주세요."], null, null);
			return;
		}

		// 계정 팝업 사이즈/위치 불러오기
		const [result, message] = await SettingController.requestResetAccoutPopup(userInfo.id);

		if (result === null) {
			this.showConfirmDialog("에러", [message], null, null);
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
		let eventInfo = null;

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
			} else if (data.category === "accountPopup" && data.subCategory === "eventInfo") {
				eventInfo = {
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
			eventInfo: eventInfo,
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

	onChangeWeatherState = (e, isOnOff) => {

		let value = e.target.checked;

		if (this.props.settings === null || this.props.settings === undefined)
			return;

		if (isOnOff === true) {
			if (value === true) {
				this.refWeatherStateOn.current.checked = true;
				this.refWeatherStateOff.current.checked = false;

				this.props.settings.weatherState = "1";

			} else if (value === false) {
				this.refWeatherStateOn.current.checked = false;
				this.refWeatherStateOff.current.checked = true;

				this.refWeatherSoundStateOn.current.checked = false;
				this.refWeatherSoundStateOff.current.checked = true;

				this.props.settings.weatherState = "0";
				this.props.settings.weatherSoundState = "0";
			}
		} else if (isOnOff === false) {
			if (value === true) {
				this.refWeatherStateOn.current.checked = false;
				this.refWeatherStateOff.current.checked = true;

				this.refWeatherSoundStateOn.current.checked = false;
				this.refWeatherSoundStateOff.current.checked = true;

				this.props.settings.weatherState = "0";
				this.props.settings.weatherSoundState = "0";

			} else if (value === false) {
				this.refWeatherStateOn.current.checked = true;
				this.refWeatherStateOff.current.checked = false;

				this.props.settings.weatherState = "1";
			}
		}

		this.setState({ errorMessage: false });

	}

	onChangeWeatherSoundState = (e, isOnOff) => {

		let value = e.target.checked;

		if (this.props.settings === null || this.props.settings === undefined)
			return;

		
		if (this.props.settings.weatherState === "0") {

			if (value === true) {

				this.refWeatherSoundStateOn.current.checked = false;
				this.refWeatherSoundStateOff.current.checked = true;

				this.props.settings.weatherSoundState = "0";

				this.setState({ errorMessage: true });
				// 안내 문구 나오게 하는 코드

				return; // weatherState가 꺼져있으면 weatherSoundState도 무조건 꺼져야함
			} else if (value === false) {

				this.refWeatherSoundStateOn.current.checked = false;
				this.refWeatherSoundStateOff.current.checked = true;

				this.props.settings.weatherSoundState = "0";

				this.setState({ errorMessage: false });

				return;
			}

		} else if (this.props.settings.weatherState === "1") {
			if (isOnOff === true) { // On box
				if (value === true) { // On check
					this.refWeatherSoundStateOn.current.checked = true;
					this.refWeatherSoundStateOff.current.checked = false;

					this.props.settings.weatherSoundState = "1";

				} else if (value === false) { // On unCheck
					this.refWeatherSoundStateOn.current.checked = false;
					this.refWeatherSoundStateOff.current.checked = true;

					this.props.settings.weatherSoundState = "0";
				}
			} else if (isOnOff === false) { // off box
				if (value === true) { // off check
					this.refWeatherSoundStateOn.current.checked = false;
					this.refWeatherSoundStateOff.current.checked = true;

					this.props.settings.weatherSoundState = "0";

				} else if (value === false) { // off unCheck
					this.refWeatherSoundStateOn.current.checked = true;
					this.refWeatherSoundStateOff.current.checked = false;

					this.props.settings.weatherSoundState = "1";
				}
			}

			this.setState({ errorMessage: false });
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
			this.showConfirmDialog("에러", ["0 은 입력하실 수 없습니다."], null, null);
			value = "";
		}

		this.refIdleTime.current.value = value;

		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let use = this.refIdleTimeUse.current.checked;
		let useValue = "1";

		if (use === false)
			useValue = "0";

		if (value === '5') {
			this.refIdleTimeType1.current.checked = true;
			this.refIdleTimeType2.current.checked = false;
			this.refIdleTimeType3.current.checked = false;
		} else if (value === '10') {
			this.refIdleTimeType1.current.checked = false;
			this.refIdleTimeType2.current.checked = true;
			this.refIdleTimeType3.current.checked = false;
		} else if (value === '15') {
			this.refIdleTimeType1.current.checked = false;
			this.refIdleTimeType2.current.checked = false;
			this.refIdleTimeType3.current.checked = true;
		} else {
			this.refIdleTimeType1.current.checked = false;
			this.refIdleTimeType2.current.checked = false;
			this.refIdleTimeType3.current.checked = false;
		}

		value = value + ";" + useValue;

		if (value !== null && value !== undefined && value !== '') {
			if (this.refIdleTime.current.value === '') {
				return;
			} else {
				this.props.settings.idleTime = value;
				return;
			}
		} 
	}

	onChangeIdleTimeUse = () => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		//let value = this.refIdleTime.current.value;
		let value = this.currentIdleTime;
		let use = this.refIdleTimeUse.current.checked;
		let useValue = "1";

		if (use === false)
			useValue = "0";

		value = value + ";" + useValue;
		this.props.settings.idleTime = value;
	}

	onClickUpload = (mode) => {
		if (mode === SettingResource.ID.excelMode.building) {
			this.refBuildingFile.current.click();
		} else if (mode === SettingResource.ID.excelMode.group) {
			this.refGroupFile.current.click();
		} else if (mode === SettingResource.ID.excelMode.facility) {
			this.refFacilityFile.current.click();
		}
	}

	onSelectBuildingFile = (event) => {
		const file = event.target.files[0];
		this.refBuildingFile.current.value = "";

		const type = /(.*?)\.(xls|xlsx)$/;

		if (!file.name.match(type)) {
			this.showConfirmDialog("에러", ["엑셀 파일(xls, xlsx)만 업로드 가능합니다."], null, null);
			return;
		} else if (file.size > 10485760) {
			this.showConfirmDialog("에러", ["최대 10MB 엑셀 파일을 업로드 할 수 있습니다."], null, null);
			return;
        }

		this.props.settings.buildingFile = file;
	}

	onSelectGroupFile = (event) => {
		const file = event.target.files[0];
		this.refGroupFile.current.value = "";

		const type = /(.*?)\.(xls|xlsx)$/;

		if (!file.name.match(type)) {
			this.showConfirmDialog("에러", ["엑셀 파일(xls, xlsx)만 업로드 가능합니다."], null, null);
			return;
		} else if (file.size > 10485760) {
			this.showConfirmDialog("에러", ["최대 10MB 엑셀 파일을 업로드 할 수 있습니다."], null, null);
			return;
		}

		this.props.settings.groupFile = file;
	}

	onSelectFacilityFile = (event) => {
		const file = event.target.files[0];
		this.refFacilityFile.current.value = "";

		const type = /(.*?)\.(xls|xlsx)$/;

		if (!file.name.match(type)) {
			this.showConfirmDialog("에러", ["엑셀 파일(xls, xlsx)만 업로드 가능합니다."], null, null);
			return;
		} else if (file.size > 10485760) {
			this.showConfirmDialog("에러", ["최대 10MB 엑셀 파일을 업로드 할 수 있습니다."], null, null);
			return;
		}

		this.props.settings.facilityFile = file;
	}

	onClickDownload = (mode) => {

		const siteID = this.props.siteID;

		//if (mode === SettingResource.ID.excelMode.building) {
		//	this.downloadBuilding(siteID);
		//} else if (mode === SettingResource.ID.excelMode.group) {
		//	this.downloadBuildingGroup(siteID);
		//} else if (mode === SettingResource.ID.excelMode.facility) {
		//	this.downloadFacility(siteID);
		//}
		this.downloadSensor();

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
		this.props.settings.idleTime = value;*/
	}

	async downloadSensor() {
		const [success, message] = await SDMSController.requestDownloadSensor();

		if (success === null) {
			this.showConfirmDialog("[에러]", [message], null, null);
		}
	}

	async downloadBuilding(siteID) {
		const [surcess, message] = await SettingController.requestDownloadBuilding(siteID);

		if (surcess === null) {
			//alert(message);
			this.showConfirmDialog("에러", [message], null, null);
        }
	}

	async downloadBuildingGroup(siteID) {
		const [surcess, message] = await SettingController.requestDownloadBuildingGroup(siteID);

		if (surcess === null) {
			//alert(message);
			this.showConfirmDialog("에러", [message], null, null);
		}
	}

	async downloadFacility(siteID) {
		const [surcess, message] = await SettingController.requestDownloadFacility(siteID);

		if (surcess === null) {
			//alert(message);
			this.showConfirmDialog("에러", [message], null, null);
		}
	}

	getAuthorUI() {
		let authorMenuUI = [];

		let userInfo = ProjectResource.getUserInfo();
		if (userInfo === null || userInfo === undefined)
			return authorMenuUI;

		if (userInfo.level === AccountResource.ID.accountLevel.admin) {
			authorMenuUI.push(<React.Fragment>
				<div className={'stgName'}>
					<h5>센서정보 다운로드</h5>
					<span className={'stgTltp'} data-tooltip="센서 정보를 엑셀로 다운로드(최대 10MB 가능)"></span>
					{/* <a onClick={() => this.onClickUpload(SettingResource.ID.excelMode.building)} className={newStyles.stgnRset + " " + newStyles.upload}>업로드</a> */}
					<a onClick={() => this.onClickDownload(SettingResource.ID.excelMode.building)} className={'stgnRset ml5'}>다운로드</a>
					<input ref={this.refBuildingFile} className={'hidden'} type='file' accept='.xls,.xlsx' onChange={this.onSelectBuildingFile} />
				</div>
				{/* <div className={newStyles.stgName}>
					<h5>건물그룹 정보 업데이트</h5>
					<span className={newStyles.stgTltp} data-tooltip="건물그룹 정보를 엑셀로 업로드/다운로드 (최대 10MB 가능)"></span>
					<a onClick={() => this.onClickUpload(SettingResource.ID.excelMode.group)} className={newStyles.stgnRset + " " + newStyles.upload}>업로드</a>
					<a onClick={() => this.onClickDownload(SettingResource.ID.excelMode.group)} className={newStyles.stgnRset + " " + newDefaults.ml5}>다운로드</a>
					<input ref={this.refGroupFile} className={settings.hidden} type='file' accept='.xls,.xlsx' onChange={this.onSelectGroupFile} />
				</div> */}
				{/* <div className={newStyles.stgName}>
					<h5>설비정보 업데이트</h5>
					<span className={newStyles.stgTltp} data-tooltip="설비 정보를 엑셀로 업로드/다운로드 (최대 10MB 가능)"></span>
					<a onClick={() => this.onClickUpload(SettingResource.ID.excelMode.facility)} className={newStyles.stgnRset + " " + newStyles.upload}>업로드</a>
					<a onClick={() => this.onClickDownload(SettingResource.ID.excelMode.facility)} className={newStyles.stgnRset + " " + newDefaults.ml5}>다운로드</a>
					<input ref={this.refFacilityFile} className={settings.hidden} type='file' accept='.xls,.xlsx' onChange={this.onSelectFacilityFile} />
				</div> */}
				<div className={'stgName'}>
					<h5>날씨 그래픽 설정</h5>
					<span className={'stgTltp'} data-tooltip="3D 날씨 그래픽을 설정합니다."></span>
					{/* <a onClick={() => this.onClickUpload(SettingResource.ID.excelMode.facility)} className={newStyles.stgnRset + " " + newStyles.upload}>업로드</a>
					<a onClick={() => this.onClickDownload(SettingResource.ID.excelMode.facility)} className={newStyles.stgnRset + " " + newDefaults.ml5}>다운로드</a>
					<input ref={this.refFacilityFile} className={settings.hidden} type='file' accept='.xls,.xlsx' onChange={this.onSelectFacilityFile} /> */}
					<input ref={this.refWeatherStateOn} type="checkbox" name="" id="" onChange={(e) => this.onChangeWeatherState(e, true)} /><label htmlFor="" style={{ margin: '0px 10px', color: '#fff' }}>ON</label>
					<input ref={this.refWeatherStateOff} type="checkbox" name="" id="" onChange={(e) => this.onChangeWeatherState(e, false)} /><label htmlFor="" style={{ margin: '0px 10px', color: '#fff' }}>OFF</label>
				</div>
				<div className={'stgName'}>
					<h5>날씨 음향 설정</h5>
					<span className={'stgTltp'} data-tooltip="날씨 그래픽 음향을 설정합니다."></span>
					{/* <a onClick={() => this.onClickUpload(SettingResource.ID.excelMode.facility)} className={newStyles.stgnRset + " " + newStyles.upload}>업로드</a>
					<a onClick={() => this.onClickDownload(SettingResource.ID.excelMode.facility)} className={newStyles.stgnRset + " " + newDefaults.ml5}>다운로드</a>
					<input ref={this.refFacilityFile} className={settings.hidden} type='file' accept='.xls,.xlsx' onChange={this.onSelectFacilityFile} /> */}
					<input ref={this.refWeatherSoundStateOn} type="checkbox" name="" id="" onChange={(e) => this.onChangeWeatherSoundState(e, true)} /><label htmlFor="" style={{ margin: '0px 10px', color: '#fff' }}>ON</label>
					<input ref={this.refWeatherSoundStateOff} type="checkbox" name="" id="" onChange={(e) => this.onChangeWeatherSoundState(e, false)} /><label htmlFor="" style={{ margin: '0px 10px', color: '#fff' }}>OFF</label>
					{
						this.state.errorMessage && 
						<p className={'weatherFont'}>날씨 그래픽 설정을 해주세요.</p>
					}
				</div>
			</React.Fragment>);
		}

		return authorMenuUI;
	}

	selectTurnStart = (mode) => {
		if (mode === null || mode === undefined)
			return;

		if (mode === SettingsResource.turnStart.LastView ||
			mode === SettingsResource.turnStart.StandardView) {
			this.props.settings.turnStart = mode;
		}
	}

	selectUseAlarmTurn = (mode) => {
		if (mode === null || mode === undefined)
			return;

		if (mode === SettingsResource.useAlarmTurn.on ||
			mode === SettingsResource.useAlarmTurn.off) {
			this.props.settings.useAlarmTurn = mode;
		}
	}

	onChangeIdleTime = (e, time) => {

		//if (this.refIdleTime.current.value !== null && this.refIdleTime.current.value !== undefined && this.refIdleTime.current.value !== '') {

		//	this.showConfirmDialog("[알림]", "입력된 값을 먼저 지워주세요", null, null);
		//	e.target.checked = false;
		//	return;
		//}

		const isChecked = e.target.checked;

		if (!isChecked)
			return;

		let strUse = '';
		let use = this.refIdleTimeUse.current.checked;
		if (use) {
			strUse = '1'
		} else {
			strUse = '0';
		}

		if (time === 5) {
			this.refIdleTimeType1.current.checked = true;
			this.refIdleTimeType2.current.checked = false;
			this.refIdleTimeType3.current.checked = false;

			this.props.settings.idleTime = '5;' + strUse;
			this.currentIdleTime = '5';
			//this.props.settings.idleTime = "5;1";
		} else if (time === 10) {
			this.refIdleTimeType1.current.checked = false;
			this.refIdleTimeType2.current.checked = true;
			this.refIdleTimeType3.current.checked = false;

			this.props.settings.idleTime = '10;' + strUse;
			this.currentIdleTime = '10';
			//this.props.settings.idleTime = "10;1";
		} else if (time === 15) {
			this.refIdleTimeType1.current.checked = false;
			this.refIdleTimeType2.current.checked = false;
			this.refIdleTimeType3.current.checked = true;

			this.props.settings.idleTime = '15;' + strUse;
			this.currentIdleTime = '15';
			//this.props.settings.idleTime = "15;1";
		}

	}

	render() {
		const authorMenuUI = this.getAuthorUI();

		// GS인증 관련 UI
		let shortcutKeyUI = null;

		if (ProjectResource.isGSMode !== true) {
			shortcutKeyUI = <React.Fragment>
				<li><dl><dt>3D 관제시스템</dt><dd><span>Alt +</span><input ref={this.refSDMS} type="text" min="0" name="" id="keySDMS" onKeyDown={(e) => this.handleKeyPress(e, SettingResource.ID.shortcutKey.sdms)} /></dd></dl></li>
				<li><dl><dt>이력</dt><dd><span>Alt +</span><input ref={this.refHistory} type="text" name="" id="keyHistory" onKeyDown={(e) => this.handleKeyPress(e, SettingResource.ID.shortcutKey.history)} /></dd></dl></li>
				<li><dl><dt>홈버튼</dt><dd><span>Alt +</span><input ref={this.refHome} type="text" name="" id="keyHome" onKeyDown={(e) => this.handleKeyPress(e, SettingResource.ID.shortcutKey.home)} /></dd></dl></li>
				<li><dl><dt>SOP 실행</dt><dd><span>Alt +</span><input ref={this.refSOP} type="text" name="" id="keySOP" onKeyDown={(e) => this.handleKeyPress(e, SettingResource.ID.shortcutKey.sop)} /></dd></dl></li>
				<li><dl><dt>조직관리</dt><dd><span>Alt +</span><input ref={this.refTeamEdit} type="text" name="" id="keyTeamEdit" onKeyDown={(e) => this.handleKeyPress(e, SettingResource.ID.shortcutKey.teamEdit)} /></dd></dl></li>
				<li><dl><dt>즉시회전</dt><dd><span>Alt +</span><input ref={this.refRotation} type="text" name="" id="keyRotation" onKeyDown={(e) => this.handleKeyPress(e, SettingResource.ID.shortcutKey.rotation)} /></dd></dl></li>
				<li><dl><dt>SOP 편집</dt><dd><span>Alt +</span><input ref={this.refSOPMgr} type="text" name="" id="keySOPMgr" onKeyDown={(e) => this.handleKeyPress(e, SettingResource.ID.shortcutKey.sopMgr)} /></dd></dl></li>
				<li><dl><dt>이벤트 알람</dt><dd><span>Alt +</span><input ref={this.refDashboard} type="text" name="" id="keyDashboard" onKeyDown={(e) => this.handleKeyPress(e, SettingResource.ID.shortcutKey.dashBoard)} /></dd></dl></li>
				<li><dl><dt>설정</dt><dd><span>Alt +</span><input ref={this.refSettings} type="text" name="" id="keySettings" onKeyDown={(e) => this.handleKeyPress(e, SettingResource.ID.shortcutKey.settings)} /></dd></dl></li>
			</React.Fragment>;
		} else {
			shortcutKeyUI = <React.Fragment>
				<li><dl><dt>3D 관제시스템</dt><dd><span>Alt +</span><input ref={this.refSDMS} type="text" min="0" name="" id="keySDMS" onKeyDown={(e) => this.handleKeyPress(e, SettingResource.ID.shortcutKey.sdms)} /></dd></dl></li>
				<li><dl><dt>조직관리</dt><dd><span>Alt +</span><input ref={this.refTeamEdit} type="text" name="" id="keyTeamEdit" onKeyDown={(e) => this.handleKeyPress(e, SettingResource.ID.shortcutKey.teamEdit)} /></dd></dl></li>
				<li><dl><dt>설정</dt><dd><span>Alt +</span><input ref={this.refSettings} type="text" name="" id="keySettings" onKeyDown={(e) => this.handleKeyPress(e, SettingResource.ID.shortcutKey.settings)} /></dd></dl></li>
				<li><dl><dt>홈 버튼</dt><dd><span>Alt +</span><input ref={this.refHome} type="text" name="" id="keyHome" onKeyDown={(e) => this.handleKeyPress(e, SettingResource.ID.shortcutKey.home)} /></dd></dl></li>
				<li><dl><dt>즉시회전</dt><dd><span>Alt +</span><input ref={this.refRotation} type="text" name="" id="keyRotation" onKeyDown={(e) => this.handleKeyPress(e, SettingResource.ID.shortcutKey.rotation)} /></dd></dl></li>
			</React.Fragment>;
        }
			
		return (
			<>
				<div className={'stgList'}>

					<div className={'stgName'}>
					<h5>3D 회전 대기시간</h5>
					<span className={'stgTltp'} data-tooltip="3D 회전 대기시간을 설정합니다."></span>
						{/*<input type="text" ref={this.refIdleTime} className={settings.settingInput} name="" id="" onChange={(e) => this.onChangeCheck(e)} onBlur={(e) => this.onBlurCheck(e.target)} /><span className={settings.white}> 분 &nbsp;&nbsp;</span> */}
						<span className={'whiteCheck'}><input type="checkbox" ref={this.refIdleTimeType1} className={'setCheckBox'} onChange={(e) => this.onChangeIdleTime(e, 5)} />5분</span>
						<span className={'whiteCheck'}><input type="checkbox" ref={this.refIdleTimeType2} className={'setCheckBox'} onChange={(e) => this.onChangeIdleTime(e, 10)} />10분</span>
						<span className={'whiteCheck'} style={{ marginRight: '16px' }}><input type="checkbox" ref={this.refIdleTimeType3} className={'setCheckBox'} onChange={(e) => this.onChangeIdleTime(e, 15)} />15분</span>
						<span className={'whiteCheck'}><input ref={this.refIdleTimeUse} type="checkbox" name="" id="" onChange={this.onChangeIdleTimeUse} className={settings.setCheckBox} />자동회전 사용 &nbsp;&nbsp;</span> 
					</div>

					{/*	.TODO: 고도화 내용으로 임시 주석처리 */}
					{/*<div className={newStyles.stgName}>*/}
					{/*	<h5>자동회전 시작점</h5>*/}
					{/*	<span className={newStyles.stgTltp} data-tooltip="자동회전 시작시 기준화면 설정">&nbsp;&nbsp;</span>*/}

					{/*	<input type="radio" ref={this.refTurnStart01} name="turnStart" id="turnStart01" onChange={() => this.selectTurnStart(SettingResource.turnStart.LastView)} />*/}
					{/*	<span className={settings.white}>&nbsp;&nbsp;마지막 위치 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>*/}

					{/*	<input type="radio" ref={this.refTurnStart02} name="turnStart" id="turnStart02" onChange={() => this.selectTurnStart(SettingResource.turnStart.StandardView)} />*/}
					{/*	<span className={settings.white}>&nbsp;&nbsp;기본뷰 &nbsp;&nbsp;</span>*/}
					{/*</div>*/}
					{/*<div className={newStyles.stgName}>*/}
					{/*	<h5>알람시 회전기능</h5>*/}
					{/*	<span className={newStyles.stgTltp} data-tooltip="알람 발생시 회전기능 사용여부">&nbsp;&nbsp;</span>*/}

					{/*	<input type="radio" ref={this.refUseAlarmTurnOn} name="useAlarmTurn" id="useAlarmTurnOn" onChange={() => this.selectUseAlarmTurn(SettingResource.useAlarmTurn.on)} />*/}
					{/*	<span className={settings.white}>&nbsp;&nbsp;사용 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>*/}

					{/*	<input type="radio" ref={this.refUseAlarmTurnOff} name="useAlarmTurn" id="useAlarmTurnOff" onChange={() => this.selectUseAlarmTurn(SettingResource.useAlarmTurn.off)} />*/}
					{/*	<span className={settings.white}>&nbsp;&nbsp;사용안함 &nbsp;&nbsp;</span>*/}
					{/*</div>*/}
					<div className={'stgName'}>
						<h5>팝업창 위치/사이즈 초기화</h5>
						<span className={'stgTltp'} data-tooltip="팝업창 위치 및 사이즈를 초기화합니다."></span>
						<a onClick={this.onClickPopupReset} className={'stgnRset'}>초기화</a>
						{/*	.TODO: 고도화 내용으로 임시 주석처리
						<a onClick={this.onClickAccoutPopupSet} className={newStyles.stgnRset}>사용자 설정</a>
						<a onClick={this.onClickAccoutPopupReset} className={newStyles.stgnRset}>사용자 초기화</a>
						*/}
					</div>

					{authorMenuUI}

					{/*	.TODO: 고도화 내용으로 임시 주석처리
					<div className={newStyles.stgName + " " + settings.settingRadio}>
						<h5>POI 하이라이트</h5>
						<span className={newStyles.stgTltp} data-tooltip="POI 선택시 선택된 POI 및 같은 공간의 POI 확대 여부를 설정 합니다"></span>
						<span className={settings.white}>&nbsp;&nbsp;사용 &nbsp;&nbsp;</span>
						<input type="radio" ref={this.refUsePoiHighlightOn} name="usePoiHighlight" id="usePoiHighlightOn" onChange={() => this.selectUsePoiHighlight(SettingResource.usePoiHighlight.on)}  />

						<span className={settings.white}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 사용안함 &nbsp;&nbsp;</span>
						<input type="radio" ref={this.refUsePoiHighlightOff} name="usePoiHighlight" id="usePoiHighlightOff" onChange={() => this.selectUsePoiHighlight(SettingResource.usePoiHighlight.off)} />

					</div>
					*/}

					{/* <div className={newStyles.stgName}>
						<h5>단축키 설정</h5>
						<span className={newStyles.stgTltp} data-tooltip="단위 시스템 불러오기 단축키 기능을 설정 합니다."></span>
						<ul className={newStyles.stgnKey}>
							{shortcutKeyUI}
						</ul>
					</div> */}

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

class SpreadTab extends Component {
	constructor(props) {
		super(props);

		this.state = {
			//buildingGroupList: null,
			buildingList: [],
			messageType: SettingResource.messageType.sms,
			message: "",
			receiver: "",
			selectPopupOnOff: false,
			selectFacilityType: "21",			// 전파 대상자지정 팝업창 전달용 인자
			selectBuildingGroup: "1",			// 전파 대상자지정 팝업창 전달용 인자
			selectBuilding: "",					// 전파 대상자지정 팝업창 전달용 인자
			selectRegularID: null,				// 전파 대상자지정 팝업창 전달용 인자
			selectRegularMemberID: null,		// 전파 대상자지정 팝업창 전달용 인자

			sensorDatas: null,

			confirmMessage: {
				visible: false,
				title: "",
				messages: [""],
				buttons: ["확인"],
				onClose: this.onCloseConfirmDialog,
				onClickButton: null
			},
		}

		this.props = props;

		this.refFacilityType = React.createRef();
		this.refBuildingGroup = React.createRef();
		this.refBuilding = React.createRef();
		this.refMessage = React.createRef();
		this.refRegularID = React.createRef();
		this.refRegularMemberID = React.createRef();
		

		//if (this.props.buildingGroupList !== null && this.props.buildingGroupList !== undefined) {
		//	this.state.buildingGroupList = this.props.buildingGroupList;
		//}
	}

	componentDidMount() {
		this.init();
	}

	componentDidUpdate(prevProps, prevState) {
		//if (this.props.buildingGroupList !== prevProps.buildingGroupList) {
		//	this.setState({ buildingGroupList: this.props.buildingGroupList });
		//}
		if (prevProps.settings !== this.props.settings) {
			this.init();
		}
	}

	async init() {
		$('.stgmTab' + " li a").click(function () {
			$('.stgmTab' + " li a").removeClass('on');
			$(this).addClass('on');

		});

		const result = await SDMSController.requestSensorDatas();

		const sensorDatas = result.sensorDatas;

		// 해당 메시지 및 전파인원 초기화 
		let type = this.getFacilityType(this.refFacilityType.current.value);
		//let buildingGroupID = this.refBuildingGroup.current.value;
		let buildingGroupID = this.state.selectBuildingGroup;
		let buildingID = this.refBuilding.current.value;

		const [message, receiver, regularID, regularMemberID] = this.getSpreadInfo(type, buildingGroupID, buildingID);

		let buildingList = [];

		if (buildingGroupID !== null && buildingGroupID !== undefined && buildingGroupID !== "") {
			for (let i = 0; i < this.props.buildingGroupList.length; i++) {
				let buildingGroup = this.props.buildingGroupList[i];

				if (buildingGroupID === buildingGroup.id.toString()) {
					for (let j = 0; j < buildingGroup.buildingDatas.length; j++) {
						let building = buildingGroup.buildingDatas[j];

						buildingList.push(<option value={building.id}>{building.displayText}</option>);
					}

					break;
				}
			}
		}

		this.setState({ receiver: receiver, sensorDatas: sensorDatas, buildingList: buildingList });
		this.refMessage.current.value = message;
		this.refRegularID.current.value = regularID;
		this.refRegularMemberID.current.value = regularMemberID;

	}


	getFacilityType = (sensorType) => {
		sensorType = parseInt(sensorType);
		if (sensorType === SettingsResource.sensorType.Entire ||
			sensorType === SettingsResource.sensorType.Atmosphere ||
			sensorType === SettingsResource.sensorType.Water ||
			sensorType === SettingsResource.sensorType.VOC ||
			sensorType === SettingsResource.sensorType.OU) {
			return SettingsResource.facilityType.ETC;
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

	updateSpreadMessage(type, buildingGroupID, buildingID, messageType, message, regularID, regularMemberID) {
		let dataType = parseInt(type);
		let dataBuildingGroupID = null;
		let dataBuildingID = null;
		let dataMessageType = messageType;
		let chk = false;

		dataType = this.getFacilityType(dataType);

		if (!dataType) {
			dataType = SettingsResource.facilityType.ETC;
		}

		if (buildingGroupID !== null && buildingGroupID !== undefined && buildingGroupID !== "")
			dataBuildingGroupID = parseInt(buildingGroupID);

		if (buildingID !== null && buildingID !== undefined && buildingID !== "")
			dataBuildingID = parseInt(buildingID);

		for (let i = 0; i < this.props.spreadMessages.length; i++) {
			let spreadMessage = this.props.spreadMessages[i];

			if (dataType === spreadMessage.facilityType &&
				spreadMessage.buildingGroupID === dataBuildingGroupID &&
				spreadMessage.buildingID === dataBuildingID &&
				spreadMessage.messageType === dataMessageType) {
				spreadMessage.message = message;
				spreadMessage.regularID = regularID;
				spreadMessage.regularMemberID = regularMemberID;
				chk = true;
				break;
			}
		}

		if (chk === false) {
			let spreadMessage = {
				id: -1,
				facilityType: dataType,
				buildingGroupID: dataBuildingGroupID,
				buildingID: dataBuildingID,
				regularID: regularID,
				regularMemberID: regularMemberID,
				messageType: dataMessageType,
				message: message,
			};

			this.props.spreadMessages.push(spreadMessage);
        }

    }

	getSpreadInfo(type, buildingGroupID, buildingID) {
		if (this.props.spreadMessages === null || this.props.spreadMessages === undefined)
			return [null, null, null, null];

		let dataType = parseInt(type);
		let dataBuildingGroupID = null;
		let dataBuildingID = null;

		dataType = this.getFacilityType(type); // 대기 수질 VOC = ETC로 판단 - 1, 2, 3 등의 값은 분류 및 정렬을 위해 사용

		if (buildingGroupID !== null && buildingGroupID !== undefined && buildingGroupID !== "")
			dataBuildingGroupID = parseInt(buildingGroupID);

		if (buildingID !== null && buildingID !== undefined && buildingID !== "")
			dataBuildingID = parseInt(buildingID);

		let message = "";
		let receiver = "";
		let regularID = "";
		let regularMemberID = "";
		const spreadMessages = this.props.spreadMessages;

		for (let i = 0; i < spreadMessages.length; i++) {
			let spreadMessage = spreadMessages[i];

			if (!spreadMessage.buildingGroupID) {
				spreadMessage.buildingGroupID = this.state.selectBuildingGroup;
			}

			if (dataType === spreadMessage.facilityType &&
				spreadMessage.buildingGroupID === dataBuildingGroupID &&
				spreadMessage.buildingID === dataBuildingID &&
				spreadMessage.messageType === this.state.messageType) {
				message = spreadMessage.message;
				regularID = spreadMessage.regularID;
				regularMemberID = spreadMessage.regularMemberID;
				break;
			}
		}

		if (regularID !== null && regularID !== undefined && regularID !== "") {
			let arrRegular = regularID.split(",");

			// 팀명 조회
			if (this.props.teams !== null && this.props.teams !== undefined && arrRegular.length > 0) {
				let teams = this.props.teams;

				for (let i = 0; i < arrRegular.length; i++) {
					let regular = arrRegular[i];

					for (let j = 0; j < teams.length; j++) {
						let team = teams[j];

						if (team.id.toString() === regular) {
							if (receiver === "")
								receiver += team.teamName;
							else
								receiver = receiver + ", " + team.teamName;

							break;
						}
					}
				}
			}
		}

		if (regularMemberID !== null && regularMemberID !== undefined && regularMemberID !== "") {
			let arrMembers = regularMemberID.split(",");

			// 멤버 조회
			if (this.props.members !== null && this.props.members !== undefined && arrMembers.length > 0) {
				let members = this.props.members;

				for (let i = 0; i < arrMembers.length; i++) {
					let arrMember = arrMembers[i];

					for (let j = 0; j < members.length; j++) {
						let member = members[j];

						if (member.ID.toString() === arrMember) {
							if (receiver === "")
								receiver += member.MemberName;
							else
								receiver = receiver + ", " + member.MemberName;

							break;
						}
					}

				}
			}
		}

		return [message, receiver, regularID, regularMemberID];
	}

	onChangeFacilityType = () => {
		
		let sensorType = this.refFacilityType.current.value;
		sensorType = parseInt(sensorType);
		//let facilityType = SettingsResource.facilityType.ETC;
		//this.refBuildingGroup.current.value = "";
		this.refBuildingGroup.current.value = this.state.selectBuildingGroup; // 빌딩 그룹 고정
		this.refBuilding.current.value = "";

		const [message, receiver, regularID, regularMemberID] = this.getSpreadInfo(sensorType, null, null);

		const buildingList = this.getBuildingListFromSensorType(sensorType);

		this.setState({ receiver: receiver, currentSensorType: sensorType, buildingList });
		this.refMessage.current.value = message;
		this.refRegularID.current.value = regularID;
		this.refRegularMemberID.current.value = regularMemberID;
	}

	getBuildingListFromSensorType = (type) => {
		const sensorDatas = this.state.sensorDatas;
		const buildingGroupID = this.state.selectBuildingGroup;

		let buildingList = [];

		if (!sensorDatas)
			return;

		for (let i = 0; i < this.props.buildingGroupList.length; i++) {
			let buildingGroup = this.props.buildingGroupList[i];

			if (buildingGroupID === buildingGroup.id.toString()) {
				for (let j = 0; j < buildingGroup.buildingDatas.length; j++) {
					let building = buildingGroup.buildingDatas[j];
					let buildingID = buildingGroup.buildingDatas[j].id;

					for (const sensorData of sensorDatas) {
						const sensorID = sensorData.sensorID;
						if (buildingID === sensorID) {
							if (type.toString() === sensorData.sensorType.toString()) {
								buildingList.push(<option value={building.id}>{building.displayText}</option>);
							}
							else if (type.toString() === SettingsResource.sensorType.Entire.toString()) {
								buildingList.push(<option value={building.id}>{building.displayText}</option>);
							}
						}
					}
				}

				break;
			}
		}

		return buildingList;

	}

	onChangeBuilding = () => {
		if (this.props.spreadMessages === null || this.props.spreadMessages === undefined)
			return;

		// 해당 메시지 및 전파인원 
		let type = this.refFacilityType.current.value;
		let buildingGroupID = this.refBuildingGroup.current.value;
		let buildingID = this.refBuilding.current.value;

		const [message, receiver, regularID, regularMemberID] = this.getSpreadInfo(type, buildingGroupID, buildingID);

		this.setState({ receiver: receiver });
		this.refMessage.current.value = message;
		this.refRegularID.current.value = regularID;
		this.refRegularMemberID.current.value = regularMemberID;
    }

	setBuildingGroupUI = () => {
		let buildingGroupUI = [];

		if (this.props.buildingGroupList !== null && this.props.buildingGroupList !== undefined) {
			const buildingGroupList = this.props.buildingGroupList;

			for (let i = 0; i < buildingGroupList.length; i++) {
				let buildingGroup = buildingGroupList[i];

				buildingGroupUI.push(<option key={"buildingGroup_" + buildingGroup.id} value={buildingGroup.id} selected>{buildingGroup.displayText}</option>);
            }

		} else {
			buildingGroupUI.push(<></>);
		}

		return buildingGroupUI;
	}
	

	onChangeBuildingGroup = () => {
		// 건물 리스트 생성
		let buildingGroupID = this.refBuildingGroup.current.value;
		this.refBuilding.current.value = "";
		let buildingList = [];

		if (buildingGroupID !== null && buildingGroupID !== undefined && buildingGroupID !== "") {
			for (let i = 0; i < this.props.buildingGroupList.length; i++) {
				let buildingGroup = this.props.buildingGroupList[i];

				if (buildingGroupID === buildingGroup.id.toString()) {
					for (let j = 0; j < buildingGroup.buildingDatas.length; j++) {
						let building = buildingGroup.buildingDatas[j];

						buildingList.push(<option value={building.id}>{building.displayText}</option>);
					}

					break;
                }
            }
        }

		this.setState({ buildingList: buildingList });

		// 해당 메시지 및 전파인원 
		let type = this.refFacilityType.current.value;

		const [message, receiver, regularID, regularMemberID] = this.getSpreadInfo(type, buildingGroupID, null);

		this.setState({ receiver: receiver });
		this.refMessage.current.value = message;
		this.refRegularID.current.value = regularID;
		this.refRegularMemberID.current.value = regularMemberID;

	}

	onClickMessageTyep = (mode) => {
		//this.setState({ messageType: mode });
		this.state.messageType = mode;

		if (this.props.spreadMessages === null || this.props.spreadMessages === undefined)
			return;

		// 해당 메시지 및 전파인원 
		let type = this.refFacilityType.current.value;
		let buildingGroupID = this.refBuildingGroup.current.value;
		let buildingID = this.refBuilding.current.value;

		const [message, receiver, regularID, regularMemberID] = this.getSpreadInfo(type, buildingGroupID, buildingID);

		this.setState({ receiver: receiver });
		this.refMessage.current.value = message;
		this.refRegularID.current.value = regularID;
		this.refRegularMemberID.current.value = regularMemberID;
    }

	onClickMsgSave = () => {
		if (this.props.spreadMessages === null || this.props.spreadMessages === undefined)
			return;

		// 해당 메시지 및 전파인원 
		let type = this.refFacilityType.current.value;
		let buildingGroupID = this.refBuildingGroup.current.value;
		let buildingID = this.refBuilding.current.value;
		let message = this.refMessage.current.value;
		let regularID = this.refRegularID.current.value;
		let regularMemberID = this.refRegularMemberID.current.value;

		this.updateSpreadMessage(type, buildingGroupID, buildingID, this.state.messageType, message, regularID, regularMemberID);

		this.showConfirmDialog("확인", ["적용되었습니다."], null, null);
	}

	onClickAllMsgSave = () => {
		if (this.props.spreadMessages === null || this.props.spreadMessages === undefined)
			return;

		// 해당 메시지 및 전파인원 
		//let type = this.refFacilityType.current.value;
		let buildingGroupID = this.refBuildingGroup.current.value;
		let buildingID = this.refBuilding.current.value;
		let regularID = this.refRegularID.current.value;
		let regularMemberID = this.refRegularMemberID.current.value;
		let message = this.refMessage.current.value;

		// 화재 초기화
		//let type = SettingsResource.facilityType.Fire;
		//this.updateSpreadMessage(type, "", "", this.state.messageType, message, regularID, regularMemberID);

		//if (this.props.buildingGroupList !== null && this.props.buildingGroupList !== undefined) {
		//	const buildingGroupList = this.props.buildingGroupList;

		//	for (let i = 0; i < buildingGroupList.length; i++) {
		//		let buildingGroup = buildingGroupList[i];

		//		this.updateSpreadMessage(type, buildingGroup.id, "", this.state.messageType, message, regularID, regularMemberID);

		//		for (let j = 0; j < buildingGroup.buildingDatas.length; j++) {
		//			let building = buildingGroup.buildingDatas[j];

		//			this.updateSpreadMessage(type, buildingGroup.id, building.id, this.state.messageType, message, regularID, regularMemberID);
		//		}
		//	}
		//}

		// 누출 초기화
		//type = SettingsResource.facilityType.PSM;
		//this.updateSpreadMessage(type, "", "", this.state.messageType, message, regularID, regularMemberID);

		//if (this.props.buildingGroupList !== null && this.props.buildingGroupList !== undefined) {
		//	const buildingGroupList = this.props.buildingGroupList;

		//	for (let i = 0; i < buildingGroupList.length; i++) {
		//		let buildingGroup = buildingGroupList[i];

		//		this.updateSpreadMessage(type, buildingGroup.id, "", this.state.messageType, message, regularID, regularMemberID);

		//		for (let j = 0; j < buildingGroup.buildingDatas.length; j++) {
		//			let building = buildingGroup.buildingDatas[j];

		//			this.updateSpreadMessage(type, buildingGroup.id, building.id, this.state.messageType, message, regularID, regularMemberID);
		//		}
		//	}
		//}

		// ETC 초기화
		let type = SettingsResource.facilityType.ETC;
		//this.updateSpreadMessage(type, "", "", this.state.messageType, message, regularID, regularMemberID);

		if (this.props.buildingGroupList !== null && this.props.buildingGroupList !== undefined) {
			const buildingGroupList = this.props.buildingGroupList;

			for (let i = 0; i < buildingGroupList.length; i++) {
				let buildingGroup = buildingGroupList[i];

				//this.updateSpreadMessage(type, buildingGroup.id, "", this.state.messageType, message, regularID, regularMemberID);

				for (let j = 0; j < buildingGroup.buildingDatas.length; j++) {
					let building = buildingGroup.buildingDatas[j];

					this.updateSpreadMessage(type, buildingGroup.id, building.id, this.state.messageType, message, regularID, regularMemberID);
				}
			}
		}

		// 지능형 영상 초기화
		//type = SettingsResource.facilityType.SVMS;
		//this.updateSpreadMessage(type, "", "", this.state.messageType, message, regularID, regularMemberID);

		//if (this.props.buildingGroupList !== null && this.props.buildingGroupList !== undefined) {
		//	const buildingGroupList = this.props.buildingGroupList;

		//	for (let i = 0; i < buildingGroupList.length; i++) {
		//		let buildingGroup = buildingGroupList[i];

		//		this.updateSpreadMessage(type, buildingGroup.id, "", this.state.messageType, message, regularID, regularMemberID);

		//		for (let j = 0; j < buildingGroup.buildingDatas.length; j++) {
		//			let building = buildingGroup.buildingDatas[j];

		//			this.updateSpreadMessage(type, buildingGroup.id, building.id, this.state.messageType, message, regularID, regularMemberID);
		//		}
		//	}
		//}

		this.showConfirmDialog("확인", ["모든 재난유형 동일하게 적용되었습니다. "], null, null);
	}

	onClickSelectReceiver = () => {
		const regularID = this.refRegularID.current.value;
		const regularMemberID = this.refRegularMemberID.current.value;

		const facilityType = this.refFacilityType.current.value;
		let facilityTypeName = "";

		//if (facilityType === SettingsResource.facilityType.Fire.toString())
		//	facilityTypeName = SettingsResource.ID.facilityType.Fire;
		//else if (facilityType === SettingsResource.facilityType.PSM.toString())
		//	facilityTypeName = SettingsResource.ID.facilityType.PSM;
		//else if (facilityType === SettingsResource.facilityType.ETC.toString())
		//	facilityTypeName = SettingsResource.ID.facilityType.ETC;
		//else if (facilityType === SettingsResource.facilityType.SVMS.toString())
		//	facilityTypeName = SettingsResource.ID.facilityType.SVMS;

		if (facilityType === SettingsResource.sensorType.Atmosphere.toString())
			facilityTypeName = SettingsResource.ID.sensorType.Atmosphere;
		else if (facilityType === SettingsResource.sensorType.Water.toString())
			facilityTypeName = SettingsResource.ID.sensorType.Water;
		else if (facilityType === SettingsResource.sensorType.VOC.toString())
			facilityTypeName = SettingsResource.ID.sensorType.VOC;

		const buildingGroup = this.refBuildingGroup.current.value;
		let buildingDatas = null;
		let buildingGroupName = "";

		if (buildingGroup !== null && buildingGroup !== undefined && buildingGroup !== "") {
			const buildingGroupList = this.props.buildingGroupList;

			for (let i = 0; i < buildingGroupList.length; i++) {
				let buildingGroupData = buildingGroupList[i];

				if (buildingGroup === buildingGroupData.id.toString()) {
					buildingGroupName = buildingGroupData.displayText;

					buildingDatas = buildingGroupData.buildingDatas;
					break;
				}
			}
		} 


		const building = this.refBuilding.current.value;
		let buildingName = "";

		if (building !== null && building !== undefined && building !== "") {

			for (let i = 0; i < buildingDatas.length; i++) {
				const buildingData = buildingDatas[i];

				if (building === buildingData.id.toString()) {
					buildingName = buildingData.displayText;
					break;
                }
            }
		} 

		this.setState({ selectPopupOnOff: true, selectFacilityType: facilityTypeName, selectBuildingGroup: buildingGroupName, selectBuilding: buildingName, selectRegularID: regularID, selectRegularMemberID: regularMemberID });
		
	}

	onClickConfirm = (regularID, regularMemberID) => {
		//const regularID = this.refRegularID.current.value;
		//const regularMemberID = this.refRegularMemberID.current.value;
		this.setSpreadReceiver(regularID, regularMemberID);

		this.setState({ selectPopupOnOff: false });
	}

	setSpreadReceiver = (regularID, regularMemberID) => {
		let receiver = "";

		if (regularID !== null && regularID !== undefined && regularID !== "") {
			let arrRegular = regularID.split(",");

			// 팀명 조회
			if (this.props.teams !== null && this.props.teams !== undefined && arrRegular.length > 0) {
				let teams = this.props.teams;

				for (let i = 0; i < arrRegular.length; i++) {
					let regular = arrRegular[i];

					for (let j = 0; j < teams.length; j++) {
						let team = teams[j];

						if (team.id.toString() === regular) {
							if (receiver === "")
								receiver += team.teamName;
							else
								receiver = receiver + ", " + team.teamName;

							break;
						}
					}
				}
			}
		}

		if (regularMemberID !== null && regularMemberID !== undefined && regularMemberID !== "") {
			let arrMembers = regularMemberID.split(",");

			// 멤버 조회
			if (this.props.members !== null && this.props.members !== undefined && arrMembers.length > 0) {
				let members = this.props.members;

				for (let i = 0; i < arrMembers.length; i++) {
					let arrMember = arrMembers[i];

					for (let j = 0; j < members.length; j++) {
						let member = members[j];

						if (member.ID.toString() === arrMember) {
							if (receiver === "")
								receiver += member.MemberName;
							else
								receiver = receiver + ", " + member.MemberName;

							break;
						}
					}

				}
			}
		}

		this.state.receiver = receiver;
		//this.refMessage.current.value = message;
		this.refRegularID.current.value = regularID;
		this.refRegularMemberID.current.value = regularMemberID;
    }

	onClickClose = () => {
		this.setState({ selectPopupOnOff: false });
    }

	displaySelect = () => {
		if (this.state.selectPopupOnOff === true) {
			return (
				<SelectReceiver
					onClickConfirm={this.onClickConfirm}
					onClickClose={this.onClickClose}
					teamTreeDatas={this.props.teamTreeDatas}
					teams={this.props.teams}
					members={this.props.members}
					facilityType={this.state.selectFacilityType}
					buildingGroup={this.state.selectBuildingGroup}
					building={this.state.selectBuilding}
					regularID={this.state.selectRegularID}
					regularMemberID={this.state.selectRegularMemberID}				/>
				);
		} else {
			return (<></>);
        }
	}

	onBlurCheck = (e) => {
		let target = e;

		let type = this.refFacilityType.current.value;
		let buildingGroupID = this.refBuildingGroup.current.value;
		let buildingID = this.refBuilding.current.value;

		let dataType = parseInt(type);
		let dataBuildingGroupID = null;
		let dataBuildingID = null;

		if (buildingGroupID !== null && buildingGroupID !== undefined && buildingGroupID !== "")
			dataBuildingGroupID = parseInt(buildingGroupID);

		if (buildingID !== null && buildingID !== undefined && buildingID !== "")
			dataBuildingID = parseInt(buildingID);

		const spreadMessages = this.props.spreadMessages;
		let chk = false;

		for (let i = 0; i < spreadMessages.length; i++) {
			let spreadMessage = spreadMessages[i];

			if (dataType === spreadMessage.facilityType &&
				spreadMessage.buildingGroupID === dataBuildingGroupID &&
				spreadMessage.buildingID === dataBuildingID &&
				spreadMessage.messageType === this.state.messageType) {

				chk = true;
				break;
			}
		}

		if (chk === false) {
			let spreadData = new Object();

			spreadData = {
				id: -1,
				buildingGroupID: dataBuildingGroupID,
				buildingID: dataBuildingID,
				facilityType: dataType,
				message: target.value,
				messageType: this.state.messageType,
				regularID: "",
				regularMemberID: ""
			}

			spreadMessages.push(spreadData);
		}

	}

	render() {
		// GS인증 관련 UI
		let optionUI = null;

		if (ProjectResource.isGSMode !== true) {
			optionUI = <React.Fragment>
				{/*<option value={SettingResource.facilityType.Fire}>대기</option>*/}
				{/*<option value={SettingResource.facilityType.PSM}>수질</option>*/}
				{/*<option value={SettingResource.facilityType.ETC}>VOC</option>*/}
				<option value={SettingResource.sensorType.Entire}>전체</option>
				<option value={SettingResource.sensorType.Atmosphere}>대기</option>
				<option value={SettingResource.sensorType.Water}>수질</option>
				<option value={SettingResource.sensorType.VOC}>VOC</option>
				<option value={SettingResource.sensorType.OU}>악취</option>
			</React.Fragment>;
		} 

		return (
			<>
				<div className={'stgList'}>
					<div className={'stgName'}>
						<h5>문자발송 설정</h5>
						<span className={'stgTltp'} data-tooltip="문자발송 옵션을 설정합니다."></span>
					</div>

					<div className={'stgmWrap'}>
						<div className={'stgmCen'}>
							<div className={'stgmCont'}>
								<ul className={'stgmTab'}>
									{/* <li><a id="sms" onClick={() => this.onClickMessageTyep(SettingResource.messageType.sms)} className={newStyles.on}>문자</a></li>
									<li><a id="email" onClick={() => this.onClickMessageTyep(SettingResource.messageType.email)}>이메일</a></li> */}
									<li><a id="sms" onClick={() => this.onClickMessageTyep(SettingResource.messageType.sms)}>내용</a></li>
								</ul>
								<div className={'stgmDtl'} id="stgmsms" style={{ "display": "block" }}>
									{/*<p className={newStyles.stgmDft}>기본 문구가 표출되는 영역(수정불가) 기본 문구가 표출되는 영역(수정불가) 기본 문구가 표출되는 영역(수정불가)</p>*/}
									<textarea ref={this.refMessage} className={'stgmTxt' + " scrollbar"} ></textarea>
									<div className={'stgmTo'}>
										<span>수신자 : </span>
										<p>{this.state.receiver}</p>
									</div>
								</div>
								{/*
								<div class={newStyles.stgmDtl} id="stgmmail">
									<p class={newStyles.stgmDft}>기본 문구가 표출되는 영역(수정불가) 기본 문구가 표출되는 영역(수정불가) 기본 문구가 표출되는 영역(수정불가)</p>
									<textarea class={newStyles.stgmTxt + " scrollbar"}></textarea>
									<div class={newStyles.stgmTo}>
										<span>수신자 : </span>
										<p>전기팀, 설비팀, 지원팀</p>
									</div>
								</div>
								*/}
								<input ref={this.refRegularID} type="text" className={'hidden'} />
								<input ref={this.refRegularMemberID} type="text" className={'hidden'} />
							</div>
						</div>

						<div style={{ display: 'flex', flexDirection: 'column' }}>
							<ul className={'stgmLft'}>
								<li>
									<select ref={this.refBuildingGroup} name="" id="" className={'dslSel'} onChange={this.onChangeBuildingGroup}>
										{this.setBuildingGroupUI()}
									</select>
								</li>
								<li>
									<select ref={this.refFacilityType} name="" id="" className={'dslSel'} onChange={this.onChangeFacilityType}>
										{optionUI}
									</select>
								</li>
								<li>
									<select ref={this.refBuilding} name="" id="" className={'dslSel'} onChange={this.onChangeBuilding}>
										<option value="">전체</option>
										{this.state.buildingList}
									</select>
								</li>
								<li><a onClick={this.onClickSelectReceiver}>전파 대상자 지정</a></li>
							</ul>

							<div className={'stgmRht'}>
								<h5>특수문자설명</h5>
								<ul>
									<li><span>재난발생위치:</span><span className={'disasterLocation'}>location</span></li>
									<li><span>재난발생시간:</span><span className={'disasterTime'}>date</span></li>
								</ul>
							</div>

							<ul className={'stgmBtn'}>
								<li><a onClick={this.onClickAllMsgSave}>모든 재난유형 동일하게 적용</a></li>
								{/*<li><a href="#">임시저장</a></li>*/}
								<li><a onClick={this.onClickMsgSave}>해당 재난유형만 적용</a></li>
							</ul>
                        </div>
					</div>
				</div>

				{
					/* alert창 대신 사용 */
					this.state.confirmMessage.visible &&
					<ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
				}

				{this.displaySelect()}
			</>
		);
	}
}

class DetectionTab extends Component {
	constructor(props) {
		super(props);

		this.state = {

		}

		this.props = props;

		this.refTimeTrem = React.createRef();

		//this.refStgAlm01 = React.createRef();
		//this.refStgAlm02 = React.createRef();
		//this.refStgAlm03 = React.createRef();

		this.refTimeUnit = React.createRef();

		this.refUseReceiveFire = React.createRef();
		this.refUseReceivePSM = React.createRef();
		this.refUseReceiveETC = React.createRef();
		this.refUseReceiveSVMS = React.createRef();

		this.refUseReceiveAtmosphere = React.createRef();
		this.refUseReceiveWater = React.createRef();
		this.refUseReceiveVOC = React.createRef();
		this.refUseReceiveOU = React.createRef();
		
		//this.eventTermDay = React.createRef();
		//this.eventTermWeek = React.createRef();
		//this.eventTermMonth = React.createRef();

		//this.UseScreenMoveTrue = React.createRef();
		//this.UseScreenMoveFalse = React.createRef();

		//this.refExeCautionSOP = React.createRef();
		//this.refExeAlartSOP = React.createRef();
		//this.refExeSeriousSOP = React.createRef();

		//this.refUseTrainingMode = React.createRef();
		//this.refUseWaterMark = React.createRef();
		//this.refUseHeadMessage = React.createRef();
		//this.refHeadMessage = React.createRef();

		this.refDisAlm01 = React.createRef();
		this.refDisAlm02 = React.createRef();
		this.refDisAlm03 = React.createRef();
		this.refDisAlm04 = React.createRef();

		this.refUseBroadcast = React.createRef();
		this.refNotUseBroadcast = React.createRef();

		this.refUsePoiFocusOn = React.createRef();
		this.refUsePoiFocusOff = React.createRef();

		this.initUseReceive = this.initUseReceive.bind(this);
	}

	componentDidMount() {
		//this.initReAlarmSet();
		this.initUseReceive();
		//this.initEventInfoDisplayTerm();
		//this.initUseScreenMove();
		this.initExeSOPSet();
		//this.initTrainingData();
		this.initMoveDisplayAlarm();

		// .TODO: 고도화 내용으로 임시 주석처리
		//this.initUsePoiFocus();


		// GS인증 관련 기능
		if (ProjectResource.isGSMode !== true) {
			//this.setAlarmBroadcast();
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.settings !== this.props.settings) {
			this.initUseReceive();
			this.initExeSOPSet();
			this.initMoveDisplayAlarm();
		}
	}

	onClickReset = () => {
		this.initUseReceive();
		this.initExeSOPSet();
		this.initMoveDisplayAlarm();
	}

	initMoveDisplayAlarm() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let moveDisplayAlarm = this.props.settings.moveDisplayAlarm;

		// 값에 따라서 클릭 
		if (moveDisplayAlarm === SettingsResource.moveDisplayAlarm.currentDisplay) {
			this.refDisAlm01.current.click();
		} else if (moveDisplayAlarm === SettingsResource.moveDisplayAlarm.moveAlarm) {
			//this.refDisAlm02.current.click();
		} else if (moveDisplayAlarm === SettingsResource.moveDisplayAlarm.firstAlarm) {
			this.refDisAlm03.current.click();
		} else if (moveDisplayAlarm === SettingsResource.moveDisplayAlarm.lastAlarm) {
			this.refDisAlm04.current.click();
		}
	}

	initUsePoiFocus() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let usePoiFocus = this.props.settings.usePoiFocus;

		if (usePoiFocus === SettingsResource.usePoiFocus.on) {
			this.refUsePoiFocusOn.current.click();
		} else if (usePoiFocus === SettingsResource.usePoiFocus.off) {
			this.refUsePoiFocusOff.current.click();
        }
    }

	/*
	initTrainingData() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let useTrainingMode = this.props.settings.useTrainingMode;
		let useWaterMark = this.props.settings.useWaterMark;
		let useHeadMessage = this.props.settings.useHeadMessage;

		if (useTrainingMode === "true") {
			this.refUseTrainingMode.current.click();
		}

		if (useWaterMark === "true") {
			this.refUseWaterMark.current.click();
		}

		if (useHeadMessage !== "false") {
			this.refHeadMessage.current.value = useHeadMessage;
			this.refUseHeadMessage.current.click();
		} 
	}
	*/

	onChangeHeadMessage = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.value;
		this.props.settings.useHeadMessage = value;

    }

	onChangeUseTrainingMode = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();
		this.props.settings.useTrainingMode = value;
	}

	onChangeUseWaterMark = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();
		this.props.settings.useWaterMark = value;
	}

	onChangeUseHeadMessage = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();

		if (value === "false") {
			this.props.settings.useHeadMessage = value;
			$('#headMessage').attr("disabled", true);
		} else {
			this.props.settings.useHeadMessage = this.refHeadMessage.current.value;
			$('#headMessage').attr("disabled", false);
        }
			
	}

	initExeSOPSet() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let exeCautionSOP = this.props.settings.exeCautionSOP;
		let exeAlartSOP = this.props.settings.exeAlartSOP;
		let exeSeriousSOP = this.props.settings.exeSeriousSOP;

		//this.refExeCautionSOP.current.value = exeCautionSOP;
		//this.refExeAlartSOP.current.value = exeAlartSOP;
		//this.refExeSeriousSOP.current.value = exeSeriousSOP;
	}
	/*
	onChangeExeCautionSOP = () => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		this.props.settings.exeCautionSOP = this.refExeCautionSOP.current.value;
	}

	onChangeExeAlartSOP = () => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		this.props.settings.exeAlartSOP = this.refExeAlartSOP.current.value;
	}

	onChangeExeSeriousSOP = () => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		this.props.settings.exeSeriousSOP = this.refExeSeriousSOP.current.value;
	}
	*/

	/*
	initUseScreenMove() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let useScreenMove = this.props.settings.useScreenMove;

		if (useScreenMove === null || useScreenMove === undefined || useScreenMove === "")
			return;

		if (useScreenMove === "true") {
			this.UseScreenMoveTrue.current.click();
		} else if (useScreenMove === "false") {
			this.UseScreenMoveFalse.current.click();
		}
	}
	*/

	onChangeUseScreenMove = (mode) => {

		if (this.props.settings === null || this.props.settings === undefined)
			return;

		this.props.settings.useScreenMove = mode;
    }
	/*
	initEventInfoDisplayTerm() {
		if (this.props.settings === null || this.props.settings === undefined) 
			return;

		let eventTerm = this.props.settings.eventInfoDisplayTerm;

		if (eventTerm === null || eventTerm === undefined || eventTerm === "")
			return;

		if (eventTerm === SettingResource.eventInfoDisplayTerm.day) {
			this.eventTermDay.current.click();
		} else if (eventTerm === SettingResource.eventInfoDisplayTerm.week) {
			this.eventTermWeek.current.click();
		} else if (eventTerm === SettingResource.eventInfoDisplayTerm.month) {
			this.eventTermMonth.current.click();
		}
    }
	*/

	initUseReceive() {
		//let useReceiveFire = "true";
		//let useReceivePSM = "true";
		//let useReceiveETC = "true";
		//let useReceiveSVMS = "true";

		let useReceiveAtmosphere = "true";
		let useReceiveWater = "true";
		let useReceiveVOC = "true";
		let useReceiveOU = "true";

		//if (this.props.settings !== null && this.props.settings !== undefined) {
		//	let fireData = this.props.settings.useReceiveFire;
		//	let psmData = this.props.settings.useReceivePSM;
		//	let etcData = this.props.settings.useReceiveETC;
		//	let svmsData = this.props.settings.useReceiveSVMS;

		//	if (fireData !== "" && fireData !== null && fireData !== undefined) {
		//		useReceiveFire = fireData;
		//	}

		//	if (psmData !== "" && psmData !== null && psmData !== undefined) {
		//		useReceivePSM = psmData;
		//	}

		//	if (etcData !== "" && etcData !== null && etcData !== undefined) {
		//		useReceiveETC = etcData;
		//	}

		//	if (svmsData !== "" && svmsData !== null && svmsData !== undefined) {
		//		useReceiveSVMS = svmsData;
		//	}
		//}

		if (this.props.yeosuSettings !== null && this.props.yeosuSettings !== undefined) {
			let atmosphereData = this.props.yeosuSettings.useReceiveAtmosphere;
			let waterData = this.props.yeosuSettings.useReceiveWater;
			let vocData = this.props.yeosuSettings.useReceiveVOC;
			let ouData = this.props.yeosuSettings.useReceiveOU;

			if (atmosphereData !== "" && atmosphereData !== null && atmosphereData !== undefined) {
				useReceiveAtmosphere = atmosphereData;
			}

			if (waterData !== "" && waterData !== null && waterData !== undefined) {
				useReceiveWater = waterData;
			}

			if (vocData !== "" && vocData !== null && vocData !== undefined) {
				useReceiveVOC = vocData;
			}

			if (ouData !== "" && ouData !== null && ouData !== undefined) {
				useReceiveOU = ouData;
			}
		}

		if (useReceiveAtmosphere === "true") {
			this.refUseReceiveAtmosphere.current.checked = true;
		} else {
			this.refUseReceiveAtmosphere.current.checked = false;
		}

		if (useReceiveWater === "true") {
			this.refUseReceiveWater.current.checked = true;
		} else {
			this.refUseReceiveWater.current.checked = false;
		}

		if (useReceiveVOC === "true") {
			this.refUseReceiveVOC.current.checked = true;
		} else {
			this.refUseReceiveVOC.current.checked = false;
		}

		if (useReceiveOU === "true") {
			this.refUseReceiveOU.current.checked = true;
		} else {
			this.refUseReceiveOU.current.checked = false;
		}

		//if (useReceiveFire === "true")
		//	this.refUseReceiveFire.current.click();

		//// GS인증 관련 기능
		//if (ProjectResource.isGSMode !== true) {
		//	if (useReceivePSM === "true")
		//		this.refUseReceivePSM.current.click();

		//	if (useReceiveETC === "true")
		//		this.refUseReceiveETC.current.click();

		//	if (useReceiveSVMS === "true")
		//		this.refUseReceiveSVMS.current.click();
		//}
		
	}

	onChangeReceiveAtmosphere = (e) => {
		if (this.props.yeosuSettings === null || this.props.yeosuSettings === undefined)
			return;

		let value = e.checked.toString();

		if (this.props.yeosuSettings.useReceiveAtmosphere !== null && this.props.yeosuSettings.useReceiveAtmosphere !== undefined)
			this.props.yeosuSettings.useReceiveAtmosphere = value;
	}

	onChangeReceiveWater = (e) => {
		if (this.props.yeosuSettings === null || this.props.yeosuSettings === undefined)
			return;

		let value = e.checked.toString();

		if (this.props.yeosuSettings.useReceiveWater !== null && this.props.yeosuSettings.useReceiveWater !== undefined)
			this.props.yeosuSettings.useReceiveWater = value;
	}

	onChangeReceiveVOC = (e) => {
		if (this.props.yeosuSettings === null || this.props.yeosuSettings === undefined)
			return;

		let value = e.checked.toString();

		if (this.props.yeosuSettings.useReceiveVOC !== null && this.props.yeosuSettings.useReceiveVOC !== undefined)
			this.props.yeosuSettings.useReceiveVOC = value;
	}

	onChangeReceiveOU = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();

		if (this.props.yeosuSettings.useReceiveOU !== null && this.props.yeosuSettings.useReceiveOU !== undefined)
			this.props.yeosuSettings.useReceiveOU = value;
	}

	onChangeReceivePSM = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();

		if (this.props.settings.useReceivePSM !== null && this.props.settings.useReceivePSM !== undefined)
			this.props.settings.useReceivePSM = value;
	}

	onChangeReceiveETC = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();

		if (this.props.settings.useReceiveETC !== null && this.props.settings.useReceiveETC !== undefined)
			this.props.settings.useReceiveETC = value;
	}

	onChangeReceiveSVMS = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();

		if (this.props.settings.useReceiveSVMS !== null && this.props.settings.useReceiveSVMS !== undefined)
			this.props.settings.useReceiveSVMS = value;
	}

	selectReAlarm = (mode) => {
		if (mode === SettingResource.reAlarm.ReAlarm) {
			$('#timeTrem').attr("disabled", true);
			$('#timeUnit').attr("disabled", true);

			if (this.props.settings !== null && this.props.settings !== undefined)
				this.props.settings.reAlarm = mode + ",0,0";
		} else if (mode === SettingResource.reAlarm.NoAlarmTerm) {
			$('#timeTrem').attr("disabled", false);
			$('#timeUnit').attr("disabled", false);

			let timeTrem = $('#timeTrem').val();
			let timeUnit = $('#timeUnit').val();

			if (this.props.settings !== null && this.props.settings !== undefined)
				this.props.settings.reAlarm = mode + "," + timeUnit + "," + timeTrem;
		} else if (mode === SettingResource.reAlarm.NoAlarm) {
			$('#timeTrem').attr("disabled", true);
			$('#timeUnit').attr("disabled", true);

			if (this.props.settings !== null && this.props.settings !== undefined)
				this.props.settings.reAlarm = mode + ",0,0";
		}
    }
	/*
	initReAlarmSet() {
		let reAlarmValue = "0,0,0";

		if (this.props.settings !== null && this.props.settings !== undefined) {
			let data = this.props.settings.reAlarm;

			if (data !== "" && data !== null && data !== undefined) {
				reAlarmValue = data;
            }
		}

		let arrReAlarm = reAlarmValue.split(",");	// 첫번째: 재알람/* 후 재알람/미알람, 두번째: 초/분/시 단위, 세번째: 시간값

		if (arrReAlarm.length !== 3) {
			reAlarmValue = "0,0,0";
			arrReAlarm = reAlarmValue.split(",");
		}

		if (arrReAlarm[0] === SettingResource.reAlarm.ReAlarm) {
			this.refStgAlm01.current.click();
		} else if (arrReAlarm[0] === SettingResource.reAlarm.NoAlarmTerm) {
			this.refStgAlm02.current.click();
		} else if (arrReAlarm[0] === SettingResource.reAlarm.NoAlarm) {
			this.refStgAlm03.current.click();
		}

		this.refTimeUnit.current.value = arrReAlarm[1];
		this.refTimeTrem.current.value = arrReAlarm[2];
	}
	*/

	onChangeNumCheck = (e) => {
		let value = e.target.value;
		let inputValue = value.replace(/[^0-9\b ]/g, '');

		this.refTimeTrem.current.value = inputValue;
	}

	onBlurCheck = (e) => {
		let value = e.value;
		/*
		if (value === "")
			value = "0";

		let reAlarmValue = "0,0,0";

		if (this.props.settings !== null && this.props.settings !== undefined) {
			let data = this.props.settings.reAlarm;

			if (data !== "" && data !== null && data !== undefined) {
				reAlarmValue = data;
			}
		}

		let arrReAlarm = reAlarmValue.split(",");	// 첫번째: 재알람/* 후 재알람/미알람, 두번째: 초/분/시 단위, 세번째: 시간값

		if (arrReAlarm.length !== 3) {
			reAlarmValue = "0,0,0";
			arrReAlarm = reAlarmValue.split(",");
		}

		let reAlarm = arrReAlarm[0] + "," + arrReAlarm[1] + "," + value;
		this.props.settings.reAlarm = reAlarm;
		*/
	}

	onChangeTimeUnit = (e) => {
		let value = e.value;

		let reAlarmValue = "0,0,0";

		if (this.props.settings !== null && this.props.settings !== undefined) {
			let data = this.props.settings.reAlarm;

			if (data !== "" && data !== null && data !== undefined) {
				reAlarmValue = data;
			}
		}

		let arrReAlarm = reAlarmValue.split(",");	// 첫번째: 재알람/* 후 재알람/미알람, 두번째: 초/분/시 단위, 세번째: 시간값

		if (arrReAlarm.length !== 3) {
			reAlarmValue = "0,0,0";
			arrReAlarm = reAlarmValue.split(",");
		}

		let reAlarm = arrReAlarm[0] + "," + value + "," + arrReAlarm[2];
		this.props.settings.reAlarm = reAlarm;
	}

	onChangeEventInfoDisplayTerm = (mode) => {

		if (this.props.settings === null || this.props.settings === undefined)
			return;

		this.props.settings.eventInfoDisplayTerm = mode;
    }

	selectDisplayAlarm = (event, mode) => {
		if (mode === null || mode === undefined)
			return;

		let value = event.target.checked;

		if (value === false) {
			event.preventDefault();
			return;
		}

		if (mode === SettingsResource.moveDisplayAlarm.currentDisplay || 
			mode === SettingsResource.moveDisplayAlarm.moveAlarm ||
			mode === SettingsResource.moveDisplayAlarm.firstAlarm ||
			mode === SettingsResource.moveDisplayAlarm.lastAlarm) {
			this.props.settings.moveDisplayAlarm = mode;
		} 

		if (mode === SettingsResource.moveDisplayAlarm.currentDisplay && value === true) {
			this.refDisAlm01.current.checked = true;
			this.refDisAlm03.current.checked = false;
			this.refDisAlm04.current.checked = false;
		} else if (mode === SettingsResource.moveDisplayAlarm.firstAlarm && value === true) {
			this.refDisAlm01.current.checked = false;
			this.refDisAlm03.current.checked = true;
			this.refDisAlm04.current.checked = false;
		} else if (mode === SettingResource.moveDisplayAlarm.lastAlarm && value === true) {
			this.refDisAlm01.current.checked = false;
			this.refDisAlm03.current.checked = false;
			this.refDisAlm04.current.checked = true;
		}

	}

	selectUsePoiFocus = (use) => {
		if (use === null || use === undefined)
			return;

		if (use === SettingsResource.usePoiFocus.on ||
			use === SettingsResource.usePoiFocus.off) {
			this.props.settings.usePoiFocus = use;
        }
    }

	/* onChangeAlarmBroadcast = (e) => {
		let use;

		if (e.target === this.refUseBroadcast.current) {
			use = this.refUseBroadcast.current.checked;
		}
		else if (e.target === this.refNotUseBroadcast.current) {
			use = !this.refNotUseBroadcast.current.checked;
		}
		else {
			return;
		}

		this.props.settings.useAlarmBroadcast = use.toString();
		this.setAlarmBroadcast();
	}

	setAlarmBroadcast() {
		let useAlarmBroadcast = this.props.settings.useAlarmBroadcast;

		if (useAlarmBroadcast) {
			useAlarmBroadcast = useAlarmBroadcast.toLowerCase();

			if (useAlarmBroadcast === "1" || useAlarmBroadcast === "true") {
				this.refUseBroadcast.current.checked = true;
				this.refNotUseBroadcast.current.checked = false;
			}
			else {
				this.refUseBroadcast.current.checked = false;
				this.refNotUseBroadcast.current.checked = true;
			}
		}
	} */

	render() {
		//const reAlarmUI = this.reAlarmUI();

		// GS인증 관련 기능
		let receiveTypeUI = null;
		let broadcastUI = null;

		if (ProjectResource.isGSMode !== true) {
			receiveTypeUI = <React.Fragment>
				<li><input ref={this.refUseReceiveAtmosphere} type="checkbox" name="stgAlt" id="stgAlt01" onChange={(e) => this.onChangeReceiveAtmosphere(e.target)} /><label htmlFor="stgAlt01"><p>대기센서</p></label></li>
				<li><input ref={this.refUseReceiveWater} type="checkbox" name="stgAlt" id="stgAlt02" onChange={(e) => this.onChangeReceiveWater(e.target)} /><label htmlFor="stgAlt02"><p>수질센서</p></label></li>
				<li><input ref={this.refUseReceiveVOC} type="checkbox" name="stgAlt" id="stgAlt03" onChange={(e) => this.onChangeReceiveVOC(e.target)} /><label htmlFor="stgAlt03"><p>VOC센서</p></label></li>
				<li><input ref={this.refUseReceiveOU} type="checkbox" name="stgAlt" id="stgAlt04" onChange={(e) => this.onChangeReceiveOU(e.target)} /><label htmlFor="stgAlt04"><p>악취측정센서</p></label></li>
			</React.Fragment>;

			broadcastUI =
				<div className={'stgName'}>
				    <h5>알람 방송</h5>
					<span className={'stgTltp'} data-tooltip="알람 발생시 자동으로 재난방송을 실시합니다."></span>
					<input ref={this.refUseBroadcast} type="checkbox" name="" id="" onChange={this.onChangeAlarmBroadcast} /><span className={'white'} style={{ marginRight: '10px' }}>&nbsp;&nbsp;사용 &nbsp;&nbsp;</span>
					<input ref={this.refNotUseBroadcast} type="checkbox" name="" id="" onChange={this.onChangeAlarmBroadcast} /><span className={'white'}>&nbsp;&nbsp;사용안함 &nbsp;&nbsp;</span> 
				</div>; 
		}

		return (
			<>
				<div className={'stgList'}>
					{/*
					<div className={newStyles.stgName}>
						<h5>오작동 처리 센서의 재알람 기준(기본값)</h5>
						<span className={newStyles.stgTltp} data-tooltip="오작동 처리 센서의 재알람 기준을 설정 합니다."></span>
						<ul className={newStyles.stgAlm}>
							<li>
								<input ref={this.refStgAlm01} type="radio" name="stgAlm" id="stgAlm01" onChange={() => this.selectReAlarm(SettingResource.reAlarm.ReAlarm)} />
								<label for="stgAlm01">모두 재알람</label>
							</li>
							<li>
								<input ref={this.refStgAlm02} type="radio" name="stgAlm" id="stgAlm02" onChange={() => this.selectReAlarm(SettingResource.reAlarm.NoAlarmTerm)} />
								<input ref={this.refTimeTrem} type="text" className={settings.settingInput} name="" id="timeTrem" onChange={this.onChangeNumCheck} onBlur={(e) => this.onBlurCheck(e.target)} />
								<select ref={this.refTimeUnit} name="" id="timeUnit" className={newStyles.dslSel} onChange={(e) => this.onChangeTimeUnit(e.target)} >
									<option value={SettingResource.timeUnit.second} >초</option>
									<option value={SettingResource.timeUnit.minute} >분</option>
									<option value={SettingResource.timeUnit.hour} >시</option>
								</select>
								<label for="stgAlm02">동안 미알람</label>
							</li>
							<li>
								<input ref={this.refStgAlm03} type="radio" name="stgAlm" id="stgAlm03" onChange={() => this.selectReAlarm(SettingResource.reAlarm.NoAlarm)} />
								<label for="stgAlm03">계속 미알람</label>
							</li>
						</ul>
					</div>
					*/}

					{/*<div className={newStyles.stgHalf}>*/}
					<div className={'stgName'}>
						<div>
							<div className={'stgName bdNon mb0'}>
								<h5>유형별 알람 설정</h5>
								<span className={'stgTltp'} data-tooltip="유형별 알람을 설정합니다."></span>
							</div>
							<ul className={'stgAlt'}>
								{receiveTypeUI}
							</ul>
						</div>
						{/*
						<div>
							<div className={newStyles.stgName + " " + newStyles.bdNon + " " + newDefaults.mb0}>
								<h5>SOP 실행</h5>
								<span className={newStyles.stgTltp} data-tooltip="SOP 실행을 설정 합니다."></span>
							</div>
							<div className={newStyles.stgmTo + " " + newDefaults.mt0}>
								<span>주의 : </span>
								<select ref={this.refExeCautionSOP} name="" id="" className={newStyles.dslSel + " " + newDefaults.h28} onChange={this.onChangeExeCautionSOP}>
									<option value={SettingResource.ExeSOPMode.false}>센서 감지시 SOP 자동실행 안함</option>
									<option value={SettingResource.ExeSOPMode.exe}>센서 감지시 SOP 자동 열기 및 실행</option>
								</select>
							</div>
							<div className={newStyles.stgmTo + " " + newDefaults.mt5}>
								<span>경계 : </span>
								<select ref={this.refExeAlartSOP} name="" id="" className={newStyles.dslSel + " " + newDefaults.h28} onChange={this.onChangeExeAlartSOP}>
									<option value={SettingResource.ExeSOPMode.false} >센서 감지시 SOP 자동실행 안함</option>
									<option value={SettingResource.ExeSOPMode.exe} >센서 감지시 SOP 자동 열기 및 실행</option>
								</select>
							</div>
							<div className={newStyles.stgmTo + " " + newDefaults.mt5}>
								<span>심각 : </span>
								<select ref={this.refExeSeriousSOP} name="" id="" className={newStyles.dslSel + " " + newDefaults.h28} onChange={this.onChangeExeSeriousSOP}>
									<option value={SettingResource.ExeSOPMode.false} >센서 감지시 SOP 자동실행 안함</option>
									<option value={SettingResource.ExeSOPMode.exe} >센서 감지시 SOP 자동 열기 및 실행</option>
								</select>
							</div>
						</div>
						*/}
					</div>

					<div className={'stgName'}>
						<h5>이벤트 발생 시 화면 자동전환 설정</h5>
						<span className={'stgTltp'} data-tooltip="이벤트 시 자동 화면 전환 여부를 설정합니다."></span>
						<ul className={'stgAlm settingRadio'}>
							<li>
								<input ref={this.refDisAlm01} type="checkbox" name="disAlm" id="disAlm01" onChange={(e) => this.selectDisplayAlarm(e, SettingResource.moveDisplayAlarm.currentDisplay)} />
								<label for="disAlm01">현재화면 유지</label>
							</li>
							{/*
							<li>
								<input ref={this.refDisAlm02} type="radio" name="disAlm" id="disAlm02" onChange={() => this.selectDisplayAlarm(SettingResource.moveDisplayAlarm.moveAlarm)} />
								<label for="disAlm02">알람마다 화면 이동</label>
							</li>
							*/}
							<li>
								<input ref={this.refDisAlm03} type="checkbox" name="disAlm" id="disAlm03" onChange={(e) => this.selectDisplayAlarm(e, SettingResource.moveDisplayAlarm.firstAlarm)} />
								<label for="disAlm03">최초 알람 화면으로 이동</label>
							</li>
							<li>
								<input ref={this.refDisAlm04} type="checkbox" name="disAlm" id="disAlm04" onChange={(e) => this.selectDisplayAlarm(e, SettingResource.moveDisplayAlarm.lastAlarm)} />
								<label for="disAlm04">마지막 알람 화면으로 이동</label>
							</li>
						</ul>
					</div>

					{/* {broadcastUI} */}

					{/* .TODO: 고도화 내용으로 임시 주석처리
					<div className={newStyles.stgName + " " + settings.settingRadio}>
						<h5>이벤트 포커싱</h5>
						<span className={newStyles.stgTltp} data-tooltip="이벤트 관련 POI에 카메라 포커싱 여부를 설정 합니다"></span>

						<span className={settings.white}>&nbsp;&nbsp;사용 &nbsp;&nbsp;</span>
						<input type="radio" ref={this.refUsePoiFocusOn} name="usePOIFocus" id="usePoiFocusOn" onChange={() => this.selectUsePoiFocus(SettingResource.usePoiFocus.on)} />
						
						<span className={settings.white}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 사용안함 &nbsp;&nbsp;</span>
						<input type="radio" ref={this.refUsePoiFocusOff} name="usePOIFocus" id="usePoiFocusOff" onChange={() => this.selectUsePoiFocus(SettingResource.usePoiFocus.off)} />
					</div>
					*/}

					{/*
					<div className={newStyles.stgHalf}>
						<div>
							<div className={newStyles.stgName + " " + newStyles.bdNon + " " + newDefaults.mb0 + " " + newDefaults.pb0}>
								<h5>이벤트 정보창 표출 리스트 기간설정</h5>
								<span className={newStyles.stgTltp} data-tooltip="이벤트 정보창 표출 리스트 기간을 설정 합니다."></span>
							</div>
							<ul className={newStyles.stgAlm + " " + newDefaults.mt0 + " " + newDefaults.mb20}>
								<li><input ref={this.eventTermDay} type="radio" name="stgDate" id="stgDate01" onChange={() => this.onChangeEventInfoDisplayTerm(SettingResource.eventInfoDisplayTerm.day)} /><label for="stgDate01">하루</label></li>
								<li><input ref={this.eventTermWeek} type="radio" name="stgDate" id="stgDate02" onChange={() => this.onChangeEventInfoDisplayTerm(SettingResource.eventInfoDisplayTerm.week)} /><label for="stgDate02">일주일</label></li>
								<li><input ref={this.eventTermMonth} type="radio" name="stgDate" id="stgDate03" onChange={() => this.onChangeEventInfoDisplayTerm(SettingResource.eventInfoDisplayTerm.month)} /><label for="stgDate03">한달</label></li>
							</ul>
							<div className={newStyles.stgName + " " + newStyles.bdNon + " " + newDefaults.mb0 + " " + newDefaults.pb0}>
								<h5>종료/오탐지시 화면 이동</h5>
								<span className={newStyles.stgTltp} data-tooltip="종료/오탐지시 화면 이동을 설정 합니다."></span>
							</div>
							<ul className={newStyles.stgAlm + " " + newDefaults.mt0}>
								<li><input ref={this.UseScreenMoveTrue} type="radio" name="stgDply" id="stgDply01" onChange={() => this.onChangeUseScreenMove("true")} /><label for="stgDply01">초기화면으로 이동</label></li>
								<li><input ref={this.UseScreenMoveFalse} type="radio" name="stgDply" id="stgDply02" onChange={() => this.onChangeUseScreenMove("false")} /><label for="stgDply02">현재화면 유지</label></li>
							</ul>
						</div>
						<div>
								<div className={newStyles.stgName + " " + newStyles.bdNon + " " + newDefaults.mb0 + " " + newDefaults.pb0}>
								<h5>훈련모드</h5>
									<span className={newStyles.stgTltp} data-tooltip="훈련모드를 설정 합니다."></span>
							</div>
								<ul className={newStyles.stgMode}>
									<li><input ref={this.refUseTrainingMode} type="checkbox" name="stgMode" id="stgMode01" onChange={(e) => this.onChangeUseTrainingMode(e.target)} /><label for="stgMode01">모든 센서 신호 수신시 훈련모드로 사용</label></li>
									<li><input ref={this.refUseWaterMark} type="checkbox" name="stgMode" id="stgMode02" onChange={(e) => this.onChangeUseWaterMark(e.target)} /><label for="stgMode02">훈련모드 워터마크 사용</label></li>
									<li><input ref={this.refUseHeadMessage} type="checkbox" name="stgMode" id="stgMode03" onChange={(e) => this.onChangeUseHeadMessage(e.target)} /><label for="stgMode03">전파 메시지 앞머리 문구 지정</label><input ref={this.refHeadMessage} type="text" name="" id="headMessage" className="" onChange={(e) => this.onChangeHeadMessage(e.target)} /></li>
							</ul>
						</div>
					</div>
					*/}

				</div>
			</>
		);
	}

}
