import React, { Component } from 'react';
import { Container } from 'reactstrap';
import $ from 'jquery';

import CheckPW from './checkPW';
import SopSet from './sopSet';
import SopLink from './sopLink';
import TeamEditor from './teamEditor';
import SystemInfo from './systemInfo';
import { SettingController } from '../../services/settingController';
import SessionString from '../../../Common/js/sessionString';
import SettingsStore from '../../settingsStore';
import ConfirmDialog from '../../../Common/ui/confirmDialog';

import newStyles from '../../../Common/css/newStyle.module.css';
import newDefaults from '../../../Common/css/newDefault.module.css';
import settings from '../../css/settings.module.css';

import SettingResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';
import AccountResource from '../../../Account/resource/id';

import { TeamEditController } from '../../../TeamEditor/services/teamEditController';
import SopController from '../../../SOPManager/services/sopController';
import SopAloneController from '../../../SOPAlone/services/sopAloneController';

import styles from '../../../Common/css/style.module.css';


class LayoutSetting extends Component {
    constructor(props) {
		super(props);

		this.state = {
			checkPW: ProjectResource.SiteID === ProjectResource.Site.Cleannara ? true : false, // 설정창 팝업시 비번 체크할지 여부
			checkPWValue: null,
			menu: ProjectResource.SiteID === ProjectResource.Site.Cleannara ? SettingResource.ID.menu.checkPW : SettingResource.ID.menu.sopSet,
			confirmMessage: {
				visible: false,
				title: "",
				messages: [""],
				buttons: ["확인"],
				onClose: this.onCloseConfirmDialog,
				onClickButton: null
			},
			onOffState: true,			// 팝업 OnOff 상태
			isSaving: false,
			isLoading: true,			// 정보 불러오기 체크

			disasterCategories: null,   // 재난 종류
			buildingGroupList: null,
			sensorTypes: null,
			teamTreeDatas: null,
			teams: null,
			members: null,

			settings: null,
			linkedSOPs: null			// 재난 종류 및 빌딩, 층에 따른 SOP 연결 정보
		}

		this.props = props;

		SettingsStore.subscribe(function () {
			let data = SettingsStore.getState();

			if (data.actionType === 'SDMS_COMMON_SETTINGS') {
				this.reloadUseSensorTypes(data.sdmsCommonSettings);
			}

		}.bind(this));

		this.init();
	}

	async init() {
		if (this.state.checkPW && this.state.menu === SettingResource.ID.menu.checkPW) {
			const [result, message] = await SettingController.requestSopCommonSetting('SettingPassword');
			if (result === null || result === undefined)
				return;

			if (!result.propertyValue || result.propertyValue === null || result.propertyValue.length === 0) {
				this.showConfirmDialog("확인", ["비밀번호가 설정되지 않았습니다 관리자에게 문의하세요."], ["확인"], this.onClickSaveClose);
            }

			this.setState({ checkPWValue: result.propertyValue })
			return;
        }

		let userInfo = await ProjectResource.initUserInfo();
		if (userInfo === null || userInfo === undefined)
			return;

		// 설정 불러오기 
		const [result, message] = await SettingController.requestSettings(userInfo.id);
		if (result === null || result === undefined)
			return;

		// 건물 정보 가져오기
		let buildingGroupList = [];
		const [buildingGroupListData, errorMessage] = await SopAloneController.requestBuildingGroupList();
		if (buildingGroupListData !== null && buildingGroupListData !== undefined)
			buildingGroupList = buildingGroupListData;

		let sensorTypes = [];
		const [sensorTypeDatas, sensorTypesMessage] = await SopAloneController.requestFacilityTypes();
		if (sensorTypeDatas !== null && sensorTypeDatas !== undefined)
			sensorTypes = sensorTypeDatas;

		// SOP 재난 정보 가져오기
		const [disasterCategories, disasterCategoriesMessage] = await SopController.disasterCategories(true);

		// SOP Link 정보 가져오기
		let linkedSOPs = [];
		const [linkedSopDatas, linkedSOPMessage] = await SopController.requestGetLinkedSOPs();
		if (linkedSopDatas !== null && linkedSopDatas !== undefined)
			linkedSOPs = linkedSopDatas;

		// 정규조직 팀, 멤버 가져오기
		const teamTreeDatas = await TeamEditController.DisplayRegular();
		const teams = await TeamEditController.GetRegular();
		const members = await TeamEditController.DisplayRegularMember();

		this.setState({ settings: result, isLoading: false, buildingGroupList, teamTreeDatas, teams, members, disasterCategories, linkedSOPs, sensorTypes });

		// 백업용 데이터 설정 데이터 불러오기 
		//this.backupData();
	}

	componentDidMount() {
		
	}

	onClickClose = (mode) => {
		this.state.onOffState = false;
		//console.log('onOffState: ' + this.state.onOffState);

		this.props.settingOff(mode);
	}

	onClickSaveClose = () => {
		this.props.settingOff(SettingResource.closeMode.confirm);
	}

	afterReload = () => {
		this.props.settingOff(SettingResource.closeMode.afterReload);
    }

	onClickMenu = (menu, target) => {
		$('.settingMenu li a').removeClass(newStyles.on);
		$(target).addClass(newStyles.on);

		this.setState({ menu: menu });
	}

	onClickCheckPW = (pw) => {
		console.log(pw);

		if (this.state.checkPWValue === pw) {
			this.setState({ menu: SettingResource.ID.menu.sopSet }, () => this.init());
		} else {
			this.showConfirmDialog("확인", ["비밀번호가 일치하지 않습니다"], ["확인"], null);
        }		
    }


	setMenuUI = () => {
		let menuUI = [];
		let shortcutKey = null;

		if (this.state.menu === SettingResource.ID.menu.checkPW) {
			menuUI.push(
				<CheckPW key="CheckPW" settings={this.state.settings} onClickCheckPW={this.onClickCheckPW} onClickClose={this.onClickClose}/>);
		}
		else {
			if (this.state.isLoading === true) {
				menuUI.push(
					<React.Fragment key="Loading"><p className={settings.white}>설정을 불러오고 있는 중입니다...</p></React.Fragment>
				);
			} else if (this.state.menu === SettingResource.ID.menu.sopSet) {
				menuUI.push(
					<SopSet key="SopSet" settings={this.state.settings} sensorTypes={this.state.sensorTypes} />);
			} else if (this.state.menu === SettingResource.ID.menu.sopLinkSet) {
				menuUI.push(
					<SopLink key="SopLink" buildingGroupList={this.state.buildingGroupList} disasterCategories={this.state.disasterCategories} linkedSOPs={this.state.linkedSOPs} sensorTypes={this.state.sensorTypes} updateLinkedSops={this.updateLinkedSops} />
				);
			} else if (this.state.menu === SettingResource.ID.menu.teamEditor) {
				menuUI.push(
					<TeamEditor key="TeamEditor" settings={this.state.settings} />);
			} else if (this.state.menu === SettingResource.ID.menu.systemInfo) {
				menuUI.push(
					<SystemInfo key="SystemInfo" />);
			}
		}

		return menuUI;
	}

	updateLinkedSops = (linkedSOPs) => {
		this.setState({ linkedSOPs });
    }

	onClickSave = () => {
		let userInfo = ProjectResource.getUserInfo();
		if (userInfo === null || userInfo === undefined)
			return;

		const settings = this.state.settings;

		const linkedSOPs = this.state.linkedSOPs;
		const regularTeamFile = settings.regularTeamFile;

		let saveData = {
			userID: userInfo.id,
			//shortcutKey: settings.shortcutKey,
			//idleTime: settings.idleTime,
			//reAlarm: settings.reAlarm,
			//useReceiveFire: settings.useReceiveFire,
			//useReceivePSM: settings.useReceivePSM,
			//useReceiveETC: settings.useReceiveETC,
			//useReceiveSVMS: settings.useReceiveSVMS,
			//useReceiveEarthquake: settings.useReceiveEarthquake,
			//useReceiveStrongWind: settings.useReceiveStrongWind,
			//eventInfoDisplayTerm: settings.eventInfoDisplayTerm,
			//useScreenMove: settings.useScreenMove,
			exeCautionSOP: settings.exeCautionSOP,
			exeAlartSOP: settings.exeAlartSOP,
			exeSeriousSOP: settings.exeSeriousSOP,
			useTrainingMode: settings.useTrainingMode,
			useWaterMark: settings.useWaterMark,
			useHeadMessage: settings.useHeadMessage,
			useAutoMoveSOPScreen: settings.useAutoMoveSOPScreen,
			useBroadcast: settings.useBroadcast,
			useSMS: settings.useSMS,
			useEmail: settings.useEmail,
			useConfirm: settings.useConfirm,
			workingBeginHour: settings.workingBeginHour,
			workingEndHour: settings.workingEndHour,
			useResultSummary: settings.useResultSummary,
			dashboardBegin: settings.dashboardBegin,
			dashboardEnd: settings.dashboardEnd,
			fireSOPWaitEndTime: settings.fireSOPWaitEndTime,
			psmsopWaitEndTime: settings.psmsopWaitEndTime,
			etcsopWaitEndTime: settings.etcsopWaitEndTime,			
			sosSOPWaitEndTime: settings.sosSOPWaitEndTime,
			svmsSOPWaitEndTime: settings.svmsSOPWaitEndTime,
			earthquakeSOPWaitEndTime: settings.earthquakeSOPWaitEndTime,
			strongWindSOPWaitEndTime: settings.strongWindSOPWaitEndTime,
			blackoutSOPWaitEndTime: settings.blackoutSOPWaitEndTime,
			collapseSOPWaitEndTime: settings.collapseSOPWaitEndTime,			
			confinedSOPWaitEndTime: settings.confinedSOPWaitEndTime,
			virtualFenceSOPWaitEndTime: settings.virtualFenceSOPWaitEndTime,
			fireSOPRecoverEndTime: settings.fireSOPRecoverEndTime,
			psmsopRecoverEndTime: settings.psmsopRecoverEndTime,
			etcsopRecoverEndTime: settings.etcsopRecoverEndTime
		};

		this.doSave(saveData, regularTeamFile, linkedSOPs);
	}

	async doSave(saveData, regularTeamFile, linkedSOPs) {
		// 설정 값이 이미 저장 중 일 경우
		if (this.state.isSaving === true)
			return;

		// 저장 중 상태 변화
		this.state.isSaving = true;

		let [success, message] = await SettingController.requestSaveSettings(saveData);

		//if (success === true) {
		//	// 설정 적용
		//	let idleTime = saveData.idleTime;
		//	let moveDisplayAlarm = saveData.moveDisplayAlarm;
		//	let turnStart = saveData.turnStart;
		//	let useAlarmTurn = saveData.useAlarmTurn;
		//	SettingsStore.dispatch({ type: 'SETTINGS', idleTime, moveDisplayAlarm, turnStart, useAlarmTurn });
  //      } else {
		//	//alert(message);
		//	this.showConfirmDialog("에러", [message], null, null);
		//}

		// 상황별 sop 설정
		[success, message] = await SopController.requestSaveLinkedSops(linkedSOPs, ProjectResource.SiteID);

		if (success === null) {
			// 저장이 끝남 상태변화
			this.state.isSaving = false;

			this.showConfirmDialog("에러", [message], null, null);
			return;
		}

		
		// 조직 정보 업로드
		if (regularTeamFile !== null && regularTeamFile !== undefined) {
			[success, message] = await SettingController.requestUploadRegularTeamFile(regularTeamFile);
			if (success !== true) {
				// 저장이 끝남 상태변화
				this.state.isSaving = false;

				//alert("조직 정보 업로드 실패:" + message);
				this.showConfirmDialog("에러", ["조직 정보 업로드 실패 : " + message], null, null);
				return;
			} else if (success === true) {
				this.state.settings.regularTeamFile = null;
			}
        }

		const settingOnOff = this.props.settingOnOff;
		// 창이 닫힌 상태
		if (this.state.onOffState === false) {
			//this.props.reloadSetting();
			this.afterReload();
        }

		// 저장이 끝남 상태변화
		this.state.isSaving = false;

		// 설정 완료 팝업
		//alert("설정이 저장되었습니다.");
		// 닫기
		//this.onClickClose(SettingResource.closeMode.confirm);
		this.showConfirmDialog("확인", ["설정이 저장되었습니다."], ["확인"], this.onClickSaveClose);
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

	getAuthorMenu() {
		let authorMenuUI = [];
		// SOP 환경
		authorMenuUI.push(<React.Fragment key={"memuCommon"}>
			<li><a onClick={(e) => this.onClickMenu(SettingResource.ID.menu.sopSet, e.target)} className={newStyles.on}>{SettingResource.ID.menu.sopSet}</a></li>
		</React.Fragment>);

		// SOP 연결
		authorMenuUI.push(<React.Fragment key={"memuSopLink"}>
			<li><a onClick={(e) => this.onClickMenu(SettingResource.ID.menu.sopLinkSet, e.target)}>{SettingResource.ID.menu.sopLinkSet}</a></li>
		</React.Fragment>);

		// 조직관리
		if (ProjectResource.SiteID !== ProjectResource.Site.Cleannara) {
			const userAuthor = ProjectResource.getUserAuthor();
			if (userAuthor === AccountResource.ID.accountLevel.admin) {
				authorMenuUI.push(<React.Fragment key={"memuAdmin"}>
					<li><a onClick={(e) => this.onClickMenu(SettingResource.ID.menu.teamEditor, e.target)}>{SettingResource.ID.menu.teamEditor}</a></li>
				</React.Fragment>);
			}
		}

		// 시스템 정보
		if (ProjectResource.SiteID !== ProjectResource.Site.Cleannara) {
			authorMenuUI.push(<React.Fragment key={"memuInfo"}>
				<li><a onClick={(e) => this.onClickMenu(SettingResource.ID.menu.systemInfo, e.target)}>{SettingResource.ID.menu.systemInfo}</a></li>
			</React.Fragment>);
		}

		return authorMenuUI;
    }

	render() {
		const menuUI = this.setMenuUI();
		const authorMenuUI = this.getAuthorMenu();
		this.state.onOffState = true;

		
        return (
            <>
				<div id={newStyles.stgPop}>
					<div>
						<div>
							<div className={newStyles.stgCont}>
								<div className={newStyles.stgLft}>
									<h4 className={newStyles.stgTitle}><span className={newStyles.setIcon}></span><p className={newStyles.setTitle}>환경설정</p></h4>
									<ul className={newStyles.stgMenu + " settingMenu"}>
										{authorMenuUI}
									</ul>
								</div>
								<div className={newStyles.stgRht}>
									<a onClick={() => this.onClickClose(SettingResource.closeMode.cancle)} className={newStyles.stgClose}>닫기</a>
									  {menuUI}
									<ul className={newStyles.dspBtn}>
										<li><a className={settings.pointCursor} onClick={this.onClickSave}>확인</a></li>
										<li><a className={settings.pointCursor} onClick={() => this.onClickClose(SettingResource.closeMode.cancle)}>취소</a></li>
									</ul>
								</div>
							</div>
						</div>
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

export default LayoutSetting;