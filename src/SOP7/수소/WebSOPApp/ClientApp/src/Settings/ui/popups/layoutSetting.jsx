import React, { Component } from 'react';
import { Container } from 'reactstrap';
import $ from 'jquery';

import Monitoring3D from './monitoring3D_Hy';
import DashboardSet from './dashboardSet';
import SopSet from './sopSet';
import TeamEditor from './teamEditor';
import SystemInfo from './systemInfo';
import { SettingController } from '../../services/settingController';
import SessionString from '../../../Common/js/sessionString';
import SettingsStore from '../../settingsStore';
import ConfirmDialog from '../../../Common/ui/confirmHydrogen';
import UserOption from './userOption';

import SettingResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';
import AccountResource from '../../../Account/resource/id';

import { SDMSController } from '../../../SDMS/services/sdmsController';
import { TeamEditController } from '../../../TeamEditor/services/teamEditController';
import SopController from '../../../SOPManager/services/sopController';

import { LayoutSettingComponent } from '../../styled/settingsStyled';
import CustomSelect from './customSelect'; 

//import Tooltip from './tooltip';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';
import { GghController } from '../../../SDMS/services/gghController';
import { simpleFaker } from '@faker-js/faker';
import Loader from './loader';

import close_btn from '../../../Common/img/imghydrogen/main/close_icon.svg';
import { ModalBackground } from '../../../Root/styled/theme';

class LayoutSetting extends Component {
    constructor(props) {
		super(props);

		this.state = {
			selectedSiteID: null,
			menu: SettingResource.setMenu._3D_관제시스템,
			confirmMessage: {
				visible: false,
				title: "",
				messages: [""],
				buttons: [''],
				onClose: this.onCloseConfirmDialog,
				onClickButton: null
			},
			onOffState: true,			// 팝업 OnOff 상태
			isSaving: false,
			isLoading: true,			// 정보 불러오기 체크

			disasterCategories: null,   // 재난 종류
			buildingGroupList: null,
			teamTreeDatas: null,
			teams: null,
			members: null,

			settings: null,
			spreadMessages: null,
			linkedSOPs: null,			// 재난 종류 및 빌딩, 층에 따른 SOP 연결 정보
			sensorTypes: null,          // 사용하는 센서 종류
			useSensorTypes: null,		// 센서별 신호 수신 여부
        }

		this.onChangeNeedToSave = this.onChangeNeedToSave.bind(this);
		this.bNeedToSave = false          // 저장이 필요한지 (사이트변경할때 저장안된내역있으면 저장하고 넘어감)
		this.props = props;

		SettingsStore.subscribe(function () {
			let data = SettingsStore.getState();

			if (data.actionType === 'SDMS_COMMON_SETTINGS') {
				this.reloadUseSensorTypes(data.sdmsCommonSettings);
			}

		}.bind(this));

		this.init();
	}

	async init(paramSiteID) {
		let userInfo = await ProjectResource.initUserInfo();
		if (userInfo === null || userInfo === undefined)
			return;

		// Multi Site
		let selectedSiteID = paramSiteID ? paramSiteID : this.state.selectedSiteID;
		if (selectedSiteID === null && ProjectResource.sites && ProjectResource.sites.length > 0) {			
			if (userInfo.levelID === AccountResource.accountLevelID.master) {
				selectedSiteID = ProjectResource.sites[0].id;
			} else if (userInfo.levelID === AccountResource.accountLevelID.admin) {
				for (let i = 0; i < ProjectResource.sites.length; i++) {
					if (ProjectResource.sites[i].id === userInfo.siteID) {
						selectedSiteID = ProjectResource.sites[i].id;
						break;
                    }
                }
			}
        }

		// 설정 불러오기 
		const [result, message] = await SettingController.requestSettings(userInfo.id, selectedSiteID);
		if (result === null || result === undefined)
			return;

		//this.setState({ settings: result, isLoading: false });

		// 단축키 적용, sdms 회전 대기시간 적용
		//let shortcutKey = result.shortcutKey;
		let idleTime = result.idleTime;
		let moveDisplayAlarm = result.moveDisplayAlarm;
		//let turnStart = result.turnStart;
		//let useAlarmTurn = result.useAlarmTurn;
		SettingsStore.dispatch({ type: 'SETTINGS', idleTime, moveDisplayAlarm });

		// 건물 정보 가져오기
		let siteIDs = [];
		siteIDs.push(selectedSiteID);
		const [buildingGroupListData, outdoorZones, errorMessage] = await SDMSController.requestBuildingGroupList(siteIDs);
		let buildingGroupList = [];

		if (buildingGroupListData !== null && buildingGroupListData !== undefined)
			buildingGroupList = buildingGroupListData;

		// 사용중인 센서 종류
		let sensorTypes = [];
		const [sensorTypeDatas, sensorTypesMessage] = await SDMSController.getFacilityTypes();
		if (sensorTypeDatas !== null && sensorTypeDatas !== undefined)
			sensorTypes = sensorTypeDatas;

		// SOP Link 정보 가져오기
		//let linkedSOPs = [];
		//const [linkedSOPData, linkedSOPMessage] = await SopController.requestLinkedSOPs(selectedSiteID);
		//if (linkedSOPData !== null && linkedSOPData !== undefined)
		//	linkedSOPs = linkedSOPData;

		// 정규조직 팀, 멤버 가져오기
		const [teamTreeDatas, teams] = await TeamEditController.DisplayRegular(selectedSiteID, true);
		//const teams = await TeamEditController.GetRegular(selectedSiteID);
		const members = await TeamEditController.DisplayRegularMember(selectedSiteID);

		// SOP 재난 정보 가져오기
		const [disasterCategories, disasterCategoriesMessage] = await SopController.disasterCategories(true, selectedSiteID);



		this.setState({ selectedSiteID, settings: result, isLoading: false, buildingGroupList, teamTreeDatas, teams, members, disasterCategories, sensorTypes });
	}

	componentDidMount() {
		this.initUseSensorTypes();

		// 사이트 및 권한별 초기 선택 메뉴 하이라이트 효과
		this.initMenu();
	}

	initMenu() {
		// 사이트 및 권한별 초기 선택 메뉴 하이라이트 효과
		const userAuthor = ProjectResource.getUserAuthor();

		let menu = null;

		if (ProjectResource.SiteID === ProjectResource.Site.Tlb || ProjectResource.SiteID === ProjectResource.Site.Hydrogen) {
			menu = SettingResource.setMenu._3D_관제시스템;

			$('.settings-selectBox').addClass('on');
			$('#memu_sopSet').addClass('on');
		} else if (userAuthor === AccountResource.accountLevelID.master || userAuthor === AccountResource.accountLevelID.admin) {
			menu = SettingResource.setMenu._3D_관제시스템;

			$('.settings-selectBox').addClass('on');
			$('#memu_monitoring3D').addClass('on');
		} else {
			menu = SettingResource.setMenu.사용자_옵션;

			$('.stgUserOption').addClass('on');
		}

		this.setState({ menu });
    }

	initUseSensorTypes = () => {
		const sdmsCommonSettings = SettingsStore.getState().sdmsCommonSettings;

		if (sdmsCommonSettings) {
			this.reloadUseSensorTypes(sdmsCommonSettings);
		}
	}

	reloadUseSensorTypes = (sdmsCommonSettings) => {
		let data = sdmsCommonSettings;
		let useSensorTypes = this.state.useSensorTypes;

		if (data?.UseFire !== undefined ||
			data?.UsePSM !== undefined ||
			data?.UseETC !== undefined ||
			data?.UseSVMS !== undefined ||
			data?.UseEarthquake !== undefined ||
			data?.UseStrongWind !== undefined ||
			data?.UseBlackOut !== undefined ||
			data?.UseBecon !== undefined ||
			data?.UseEnvironment !== undefined ||
			data?.UseManufacture !== undefined) {

			let sensorTypes = new Object();
			sensorTypes.UseFire = false;
			sensorTypes.UsePSM = false;
			sensorTypes.UseETC = false;
			sensorTypes.UseSVMS = false;
			sensorTypes.UseEarthquake = false;
			sensorTypes.UseStrongWind = false;
			sensorTypes.UseBlackOut = false;
			sensorTypes.UseBecon = false;
			sensorTypes.UseEnvironment = false;
			sensorTypes.UseManufacture = false;

			if (data.UseFire === "true")
				sensorTypes.UseFire = true;
			if (data.UsePSM === "true")
				sensorTypes.UsePSM = true;
			if (data.UseETC === "true")
				sensorTypes.UseETC = true;
			if (data.UseSVMS === "true")
				sensorTypes.UseSVMS = true;
			if (data.UseEarthquake === "true")
				sensorTypes.UseEarthquake = true;
			if (data.UseStrongWind === "true")
				sensorTypes.UseStrongWind = true;
			if (data.UseBlackOut === "true")
				sensorTypes.UseBlackOut = true;
			if (data.UseBecon === "true")
				sensorTypes.UseBecon = true;
			if (data.UseEnvironment === "true")
				sensorTypes.UseEnvironment = true;
			if (data.UseManufacture === "true")
				sensorTypes.UseManufacture = true;

			if (useSensorTypes === null ||
				useSensorTypes.UseFire !== data.UseFire ||
				useSensorTypes.UsePSM !== data.UsePSM ||
				useSensorTypes.UseETC !== data.UseETC ||
				useSensorTypes.UseSVMS !== data.UseSVMS ||
				useSensorTypes.UseEarthquake !== data.UseEarthquake ||
				useSensorTypes.UseStrongWind !== data.UseStrongWind ||
				useSensorTypes.UseBlackOut !== data.UseBlackOut ||
				useSensorTypes.UseBecon !== data.UseBecon ||
				useSensorTypes.UseEnvironment !== data.UseEnvironment ||
				useSensorTypes.UseManufacture !== data.UseManufacture) {

				this.setState({ useSensorTypes: sensorTypes });
			}
		}
	}

	onClickClose = (mode) => {
		this.state.onOffState = false;
		//console.log('onOffState: ' + this.state.onOffState);
		//console.log(this.state.onOffState); //false
		this.props.settingOff(mode);
	}

	onClickClosePopup = (value) => {
        this.setState({ cctvPopupOpen: value });
    }

	onClickSaveClose = () => {
		this.props.settingOff(SettingResource.closeMode.confirm);
	}

	afterReload = () => {
		this.props.settingOff(SettingResource.closeMode.afterReload);
    }

	onClickMenu = (menu, target) => {
		$('.settingMenu li a').removeClass('on');
		$('.stgUserOption').removeClass('on');
		$(target).addClass('on');
		$('.settings-selectBox').addClass('on');

		this.setState({ menu: menu });
    }

	onClickUserMenu = (menu, target) => {
		$('.settingMenu li a').removeClass('on');
		$('.settings-selectBox').removeClass('on');
		$(target).parent('.stgUserOption').addClass('on');

		this.setState({ menu: menu });
    }

	setMenuUI = () => {
		let menuUI = [];
		let shortcutKey = null;

		if (this.state.isLoading === true) {
			menuUI.push(
				<React.Fragment key="Loading"><p key="Loading" className={'white'}>{i18n.t('setting.formText.설정을 불러오고 있는 중입니다...')}</p></React.Fragment>
			);
		} else if (this.state.menu === SettingResource.setMenu._3D_관제시스템) {
			menuUI.push(
				<Monitoring3D key="Monitoring3D"
					settings={this.state.settings}
					buildingGroupList={this.state.buildingGroupList}
					spreadMessages={this.state.spreadMessages}
					teamTreeDatas={this.state.teamTreeDatas}
					teams={this.state.teams}
					members={this.state.members}
					showConfirmDialog={this.showConfirmDialog}
					useSensorTypes={this.state.useSensorTypes}
					onChangeNeedToSave={this.onChangeNeedToSave}
					selectedSiteID={this.state.selectedSiteID}
				/>
			);
		} else if (this.state.menu === SettingResource.setMenu.SOP_환경) {
			menuUI.push(
				<SopSet key="SopSet"
					settings={this.state.settings}
					sensorTypes={this.state.sensorTypes}
					onChangeNeedToSave={this.onChangeNeedToSave}
					selectedSiteID={this.state.selectedSiteID}

					buildingGroupList={this.state.buildingGroupList}
					disasterCategories={this.state.disasterCategories}
					//linkedSOPs={this.state.linkedSOPs}
					//updateLinkedSops={this.updateLinkedSops}
					showConfirmDialog={this.showConfirmDialog}
				/>
			);
		}

		return menuUI;
	}

	updateLinkedSops = (linkedSOPs) => {
		this.onChangeNeedToSave();
		this.setState({ linkedSOPs });
	}

	updateCCTVSettings = (nvrList) => {
		this.onChangeNeedToSave();
		this.setState({ nvrList });
	}

	checkCCTVSettings = (nvrList) => {
		// let regIPv4 = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]){1}([:][1-9][0-9][0-9][0-9][0-9]?)$/;
		let regIPv4 = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]){1}([:][1-9]{1}[0-9]{2,4}?)$/;

		let count = 0;
		for(let i = 0; i < nvrList?.length; i++){
			if(!regIPv4.test(nvrList[i].url)) {
				count++;
			}
		}

		return count;
	}

	onClickSave = () => {
		this.bNeedToSave = false;

		let userInfo = ProjectResource.getUserInfo();
		if (userInfo === null || userInfo === undefined)
			return;

		const settings = this.state.settings;

		//const spreadMessages = this.state.spreadMessages;
		//const linkedSOPs = this.state.linkedSOPs;
		//const buildingFile = settings.buildingFile;
		//const groupFile = settings.groupFile;
		//const facilityFile = settings.facilityFile;
		//const regularTeamFile = settings.regularTeamFile;

		let saveData = {
			userID: userInfo.id,
			//shortcutKey: settings.shortcutKey,
			idleTime: settings.idleTime,
			useReceiveH2: settings.useReceiveH2,
			useReceiveFlow: settings.useReceiveFlow,
			useReceiveConductivity: settings.useReceiveConductivity,
			useReceiveTemp: settings.useReceiveTemp,
			useReceivePressure: settings.useReceivePressure,
			useReceiveGAS: settings.useReceiveGAS,
			useScreenMove: settings.useScreenMove,
			exeCautionSOP: settings.exeCautionSOP,
			exeAlartSOP: settings.exeAlartSOP,
			exeSeriousSOP: settings.exeSeriousSOP,
			useAutoMoveSOPScreen: settings.useAutoMoveSOPScreen,
			//useBroadcast: settings.useBroadcast,
			useSMS: settings.useSMS,
			useEmail: settings.useEmail,
			useConfirm: settings.useConfirm,
			workingBeginHour: settings.workingBeginHour,
			workingEndHour: settings.workingEndHour,
			useResultSummary: settings.useResultSummary,
			sopWaitEndTime: settings.sopWaitEndTime,
			moveDisplayAlarm: settings.moveDisplayAlarm,
			usePoiFocus: settings.usePoiFocus,
			//usePoiHighlight: settings.usePoiHighlight,
			//useAlarmArea: settings.useAlarmArea,
			alarmAutoEnd: settings.alarmAutoEnd
		};

		//this.doSave(saveData, buildingFile, groupFile, facilityFile, regularTeamFile, spreadMessages, linkedSOPs);
		this.doSave(saveData);
	}

	async doSave(saveData) {
		// 설정 값이 이미 저장 중 일 경우
		if (this.state.isSaving === true)
			return;

		// 저장 중 상태 변화
		// this.state.isSaving = true;
		this.setState({ isSaving: true });

		let [success, message] = await SettingController.requestSaveSettings(saveData, this.state.selectedSiteID);

		if (success === true) {
			// 설정 적용
			let idleTime = saveData.idleTime;
			let moveDisplayAlarm = saveData.moveDisplayAlarm;
			let turnStart = saveData.turnStart;
			let useAlarmTurn = saveData.useAlarmTurn;
			SettingsStore.dispatch({ type: 'SETTINGS', idleTime, moveDisplayAlarm, turnStart, useAlarmTurn });
        } else {
			//alert(message);
			this.showConfirmDialog(i18n.t('common.오류'), [message], null, null);
		}

		// 총괄관리자 및 관리자 저장 기능
		if (this.state.selectedSiteID !== null) {

			// 초기 상황 전파
			//let spreadTemp = spreadMessages;

			//// 변경점 비교하기
			//let addSpread = [];
			//let updateSpread = [];

			//if (spreadTemp !== null && spreadTemp !== undefined) {
			//	for (let i = 0; i < spreadTemp.length; i++) {
			//		let spread = spreadTemp[i];

			//		if (spread.id === -1) {
			//			addSpread.push(spread);
			//			continue;
			//		}

			//		for (let j = 0; j < spreadResult.length; j++) {
			//			let spreadData = spreadResult[j];

			//			if (spread.id === spreadData.id) {
			//				if (spread.regularID !== spreadData.regularID ||
			//					spread.regularMemberID !== spreadData.regularMemberID ||
			//					spread.message !== spreadData.message) {
			//					updateSpread.push(spread);
			//				}

			//				spreadResult.splice(j, 1);
			//				break;
			//			}
			//		}
			//	}
			//}

			//[success, message] = await SettingController.requestSetSpreadMessage(addSpread, updateSpread, spreadResult);
			//if (success === null) {
			//	// 저장이 끝남 상태변화
			//	this.state.isSaving = false;

			//	this.showConfirmDialog(i18n.t('common.오류'), [message], null, null);
			//	return;
			//}

			// 상황별 sop 설정		
			//[success, message] = await SopController.requestSaveLinkedSops(linkedSOPs, this.state.selectedSiteID);
			//if (success === null) {
			//	// 저장이 끝남 상태변화
			//	this.state.isSaving = false;

			//	this.showConfirmDialog(i18n.t('common.오류'), [message], null, null);
			//	return;
			//}

			// 건물 정보 업로드
			//if (buildingFile !== null && buildingFile !== undefined) {
			//	[success, message] = await SettingController.requestUploadBuildingFile(buildingFile, this.state.selectedSiteID);
			//	if (success !== true) {
			//		// 저장이 끝남 상태변화
			//		this.state.isSaving = false;

			//		//alert("건물정보 업로드 실패:" + message);
			//		this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.formText.건물 정보 업로드 실패 :') + message], null, null);
			//		return;
			//	} else if (success === true) {
			//		this.state.settings.buildingFile = null;
			//	}
			//}

			// 건물그룹 정보 업로드
			//if (groupFile !== null && groupFile !== undefined) {
			//	[success, message] = await SettingController.requestUploadBuildingGroupFile(groupFile, this.state.selectedSiteID);
			//	if (success !== true) {
			//		// 저장이 끝남 상태변화
			//		this.state.isSaving = false;

			//		//alert("건물그룹 정보 업로드 실패:" + message);
			//		this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.formText.건물 정보 업로드 실패 :') + message], null, null);
			//		return;
			//	} else if (success === true) {
			//		this.state.settings.groupFile = null;
			//	}
			//}

			// 설비 정보 업로드
			//if (facilityFile !== null && facilityFile !== undefined) {
			//	[success, message] = await SettingController.requestUploadFacilityFile(facilityFile, this.state.selectedSiteID);
			//	if (success !== true) {
			//		// 저장이 끝남 상태변화
			//		this.state.isSaving = false;

			//		//alert("설비 정보 업로드 실패:" + message);
			//		this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.formText.설비 정보 업로드 실패 :') + message], null, null);
			//		return;
			//	} else if (success === true) {
			//		this.state.settings.facilityFile = null;
			//	}
			//}

			// 조직 정보 업로드
			//if (regularTeamFile !== null && regularTeamFile !== undefined) {
			//	[success, message] = await SettingController.requestUploadRegularTeamFile(regularTeamFile, this.state.selectedSiteID);
			//	if (success !== true) {
			//		// 저장이 끝남 상태변화
			//		this.state.isSaving = false;

			//		//alert("조직 정보 업로드 실패:" + message);
			//		this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.formText.조직 정보 업로드 실패 :') + message], null, null);
			//		return;
			//	} else if (success === true) {
			//		this.state.settings.regularTeamFile = null;
			//	}
			//}

		}

		// 창이 닫힌 상태
		if (this.state.onOffState === false) {
			//this.props.reloadSetting();
			this.afterReload();
        }

		// 저장이 끝남 상태변화
		this.state.isSaving = false;

		const userAuthor = ProjectResource.getUserAuthor();
		if (userAuthor === AccountResource.accountLevelID.master) {
			if (ProjectResource.sites && ProjectResource.sites.length > 0) {
				this.showConfirmDialog(i18n.t('common.확인'), [i18n.t('msg.저장되었습니다')], [i18n.t('common.확인')], null);
			}
		} else {
			this.showConfirmDialog(i18n.t('common.확인'), [i18n.t('msg.저장되었습니다')], [i18n.t('common.확인')], this.onClickSaveClose);
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

	getAuthorMenu() {
		const userInfo = ProjectResource.getUserInfo();
		const siteID = ProjectResource.SiteID;
		let authorMenuUI = [];

		if (siteID === ProjectResource.Site.Hydrogen) {
			authorMenuUI.push(
				<React.Fragment key={'memuAdmin_sop'}>
					<React.Fragment key={'memuAdmin_sop'}>
						<li key={'memuAdmin_sop'}><a onClick={(e) => this.onClickMenu(SettingResource.setMenu.SOP_환경, e.target)}>{i18n.t('setting.menu.SOP 환경')}</a></li>
					</React.Fragment>
					<span className={'blankSquare'}></span>
			    </React.Fragment>
			);
		} else {
			const userAuthor = ProjectResource.getUserAuthor();

			// TLB > SDMS 없음
			if (siteID !== ProjectResource.Site.Tlb && 
				(userAuthor === AccountResource.accountLevelID.master || userAuthor === AccountResource.accountLevelID.admin)) {
				authorMenuUI.push(
					<React.Fragment key={'memuCommon'}>
						<li key={'memuCommon'}><a id={"memu_monitoring3D"} onClick={(e) => this.onClickMenu(SettingResource.setMenu._3D_관제시스템, e.target)}>{i18n.t('setting.menu.3D 관제 시스템')}</a></li>
					</React.Fragment>);
            }
			
			if (userAuthor === AccountResource.accountLevelID.master || userAuthor === AccountResource.accountLevelID.admin) {
				authorMenuUI.push(
				<React.Fragment key={'memuAdmin_sop'}>
					{/*<li><a onClick={(e) => this.onClickMenu(SettingResource.ID.menu.dashboardSet, e.target)}>{SettingResource.ID.menu.dashboardSet}</a></li>*/}
						<li key={'memuAdmin_sop'}><a id={"memu_sopSet"} onClick={(e) => this.onClickMenu(SettingResource.setMenu.SOP_환경, e.target)}>{i18n.t('setting.menu.SOP 환경')}</a></li>
				</React.Fragment>);
			}

			authorMenuUI.push(
				<React.Fragment key={'memuAdmin_user'}>
					<li key={'memuAdmin_user'} className='stgUserOption'><a id={"memu_userOption"} onClick={(e) => this.onClickUserMenu(SettingResource.setMenu.사용자_옵션, e.target)}>{i18n.t('setting.menu.사용자 옵션')}</a></li>
				</React.Fragment>);
		}
		return authorMenuUI;
	}

	onChangeSite = (siteID) => {
		if (this.state.selectedSiteID === siteID) {
			return;
		}

		this.confirmDialogData = siteID;
		if (this.bNeedToSave) {
			this.showConfirmDialog(i18n.t('common.저장'), [i18n.t('setting.formText.변경된 내용이 있습니다. 저장할까요?')], [i18n.t('setting.formText.변경된 내용 저장'), i18n.t('setting.formText.변경된 내용 취소')], this.onNeedToSave);
			return;
		}
		else {
			this.onNeedToSave(1);
        }
		
		//this.setState({ selectedSiteID: siteID }, () => this.init());
	}

	// 사이트변경시 변경된 내용이 있는지 체크함
	onChangeNeedToSave() {
		this.bNeedToSave = true;
	}

	onNeedToSave = async (index) => {
		if (index === 0) {
			this.onClickSave();
		}

		this.bNeedToSave = false;

		//this.state.selectedSiteID = this.confirmDialogData;
		await this.init(this.confirmDialogData);
		await this.onCloseConfirmDialog();
    }

	render() {
		const menuUI = this.setMenuUI();
		const authorMenuUI = this.getAuthorMenu();
		this.state.onOffState = true;

		const userAuthor = ProjectResource.getUserAuthor();
		
        return (
			<>
				{/* <div id='tooltip-area'></div> */}
				<ModalBackground>
					<LayoutSettingComponent id={'stgPop'}>
						<button onClick={() => this.onClickClose(SettingResource.closeMode.cancle)} className={'closeBtn'}>
							<img src={close_btn} alt='닫기 버튼' width={24} height={24} />
						</button>
						<div className='menuWrap'>
							<h2>{i18n.t('setting.menu.환경설정')}</h2>
							<ul>
								<li className={this.state.menu === SettingResource.setMenu._3D_관제시스템 ? 'on' : null} onClick={(e) => this.onClickMenu(SettingResource.setMenu._3D_관제시스템, e.target)}>{i18n.t('setting.menu.3D 관제 시스템')}</li>
								<li className={this.state.menu === SettingResource.setMenu.SOP_환경 ? 'on' : null} onClick={(e) => this.onClickMenu(SettingResource.setMenu.SOP_환경, e.target)}>SOP</li>
							</ul>
						</div>
							{menuUI}
						<div className='btnWrap'>
							<button className='cancle' onClick={() => this.onClickClose(SettingResource.closeMode.cancle)}>{i18n.t('common.취소')}</button>
							<button className='submit' onClick={this.onClickSave}>{i18n.t('common.저장')}</button>
						</div>
					{/* {
						<div>
							<div>
								<div className={'stgCont'}>
									<div className={'stgLft'}>
										<h4 className={'stgTitle'}>{i18n.t('setting.menu.환경설정')}</h4>
										<ul className={"stgMenu settingMenu"}>
											{authorMenuUI}
										</ul>
									</div>
									<div className={'stgRht'}>
										<a onClick={() => this.onClickClose(SettingResource.closeMode.cancle)} className={'stgClose'}>{i18n.t('common.닫기')}</a>
											{menuUI}
										<ul className={'dspBtn'}>
											<li><a className={'pointCursor'} onClick={() => this.onClickClose(SettingResource.closeMode.cancle)}>{i18n.t('common.취소')}</a></li>
											<li><a className={'pointCursor'} onClick={this.onClickSave}>{i18n.t('common.확인')}</a></li>
										</ul>
									</div>
								</div>
							</div>
						</div> */}
					</LayoutSettingComponent>
				</ModalBackground>
				{
					/* alert창 대신 사용 */
					this.state.confirmMessage.visible &&
					<ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
				}
				
            </>
        );
    }
}

export default withTranslation()(LayoutSetting);