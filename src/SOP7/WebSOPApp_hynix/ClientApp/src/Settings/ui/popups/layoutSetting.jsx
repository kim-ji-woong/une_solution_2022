import React, { Component } from 'react';
import { Container } from 'reactstrap';
import $ from 'jquery';

import Monitoring3D from './monitoring3D';
import DashboardSet from './dashboardSet';
import SopSet from './sopSet';
import TeamEditor from './teamEditor';
import SystemInfo from './systemInfo';
import { SettingController } from '../../services/settingController';
import SessionString from '../../../Common/js/sessionString';
import SettingsStore from '../../settingsStore';
import ConfirmDialog from '../../../Common/ui/confirmDialog';
import UserOption from './userOption';
import InterWorking from './interWorking';

import newStyles from '../../../Common/css/newStyle.module.css';
import newDefaults from '../../../Common/css/newDefault.module.css';
import settings from '../../css/settings.module.css';

import SettingResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';
import AccountResource from '../../../Account/resource/id';

import { SDMSController } from '../../../SDMS/services/sdmsController';
import { TeamEditController } from '../../../TeamEditor/services/teamEditController';
import SopController from '../../../SOPManager/services/sopController';

import styles from '../../../Common/css/style.module.css';

import { LayoutSettingComponent } from '../../styled/settingsStyled';
import CustomSelect from './customSelect'; 

//import Tooltip from './tooltip';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';
import { GghController } from '../../../SDMS/services/gghController';
import { simpleFaker } from '@faker-js/faker';
import Loader from './loader';


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

			deleteOption: null,			// 보존기간 경과한 로그파일 삭제옵션 (deleteOptions : 0 => 그냥 삭제, 1 : 압축보관후 삭제)
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

		if (userInfo.siteID >= ProjectResource.Site.GG_B && userInfo.siteID <= ProjectResource.Site.GG_H) {
			selectedSiteID = userInfo.siteID;
		}

		// 설정 불러오기 
		const [result, message] = await SettingController.requestSettings(userInfo.id, selectedSiteID);
		if (result === null || result === undefined)
			return;

		const transformedSettings = {
			...result,
			properties: result.properties.reduce((acc, prop) => {
				acc[prop.name] = prop.value;
				return acc;
			}, {})
		};

		if (userInfo.siteID === ProjectResource.Site.GG_A) {
			const [sdmsSettings, _] = await SettingController.requestSdmsCommonSettings(selectedSiteID);

			transformedSettings.useReceiveSensorTypesGroups = sdmsSettings.useReceiveSensorTypesGroups;
			transformedSettings.useSensorTypesGroups = sdmsSettings.useSensorTypesGroups;
		}

		//this.setState({ settings: result, isLoading: false });

		// 단축키 적용, sdms 회전 대기시간 적용
		let shortcutKey = result.shortcutKey;
		let idleTime = transformedSettings.properties.IdleTime;
		let moveDisplayAlarm = transformedSettings.properties.MoveDisplayAlarm;
		let turnStart = transformedSettings.properties.TurnStart;
		let useAlarmTurn = transformedSettings.properties.UseAlarmTurn;
		SettingsStore.dispatch({ type: 'SETTINGS', idleTime, moveDisplayAlarm, turnStart, useAlarmTurn });

		// 건물 정보 가져오기
		let siteIDs = [];
		if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
            if (userInfo?.siteID === ProjectResource.Site.GG_A) {
                // 통합방재실 > 모든 공간
                siteIDs = [];
                siteIDs.push(ProjectResource.Site.GG_A);
                siteIDs.push(ProjectResource.Site.GG_B);
                siteIDs.push(ProjectResource.Site.GG_C);
                siteIDs.push(ProjectResource.Site.GG_D);
                siteIDs.push(ProjectResource.Site.GG_E);
                siteIDs.push(ProjectResource.Site.GG_F);
                siteIDs.push(ProjectResource.Site.GG_G);
                siteIDs.push(ProjectResource.Site.GG_H);
            }
            else {
                // 그 외 > 공통으로 사용하는 지하층만 포함
                siteIDs = [];
                siteIDs.push(ProjectResource.Site.GG_A); // 지하층
                siteIDs.push(userInfo.siteID);
            }
        }
		else {
			siteIDs.push(selectedSiteID);
		}
		
		const [buildingGroupListData, outdoorZones, errorMessage] = await SDMSController.requestBuildingGroupList(siteIDs);
		let buildingGroupList = [];

		if (buildingGroupListData !== null && buildingGroupListData !== undefined)
			buildingGroupList = buildingGroupListData;

		// 사용중인 센서 종류
		let sensorTypes = [];
		const [sensorTypeDatas, sensorTypesMessage] = await SDMSController.getFacilityTypes();
		if (sensorTypeDatas !== null && sensorTypeDatas !== undefined)
			sensorTypes = sensorTypeDatas;

		// 초기 상황전파 메시지 가져오기
		let spreadMessages = [];
		const [spreadResult, spreadMessage] = await SettingController.requestGetSpreadMessage();
		if (spreadResult !== null && spreadResult !== undefined)
			spreadMessages = spreadResult;

		// SOP Link 정보 가져오기
		let linkedSOPs = [];
		const [linkedSOPData, linkedSOPMessage] = await SopController.requestLinkedSOPs(selectedSiteID);
		if (linkedSOPData !== null && linkedSOPData !== undefined)
			linkedSOPs = linkedSOPData;

		// 정규조직 팀, 멤버 가져오기
		const [teamTreeDatas, teams] = await TeamEditController.DisplayRegular(selectedSiteID, true);
		//const teams = await TeamEditController.GetRegular(selectedSiteID);
		const members = await TeamEditController.DisplayRegularMember(selectedSiteID);

		// SOP 재난 정보 가져오기
		const [disasterCategories, disasterCategoriesMessage] = await SopController.disasterCategories(true, selectedSiteID);

		// CCTV 설정 정보 가져오기 (경기)
		if (selectedSiteID >= ProjectResource.Site.GG_A && selectedSiteID <= ProjectResource.Site.GG_H) {
			let nvrList = [];
			const [cctvSetting, cctvSettingMessage] = await GghController.requestNvrList();

			if (cctvSetting?.length === 0) {
				this.showConfirmDialog(i18n.t('common.오류'), [cctvSettingMessage], null, null);
			} else {
				nvrList = cctvSetting;
			}

			this.setState({ nvrList });
		}

		const [deleteOption, deleteOptionMessage] = await SettingController.requestLogDeletePolicy();

		if (deleteOption === null) {
			console.log(deleteOptionMessage);
		}

		this.setState({ selectedSiteID, settings: transformedSettings, isLoading: false, buildingGroupList, teamTreeDatas, teams, members, disasterCategories, spreadMessages, linkedSOPs, sensorTypes, deleteOption });
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
			menu = SettingResource.setMenu.SOP_환경;

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
			data?.UseManufacture !== undefined ||
			data?.UseEmergencyBell !== undefined ||
			data?.UseSubmerge !== undefined) {

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
			sensorTypes.UseEmergencyBell = false;
			sensorTypes.UseSubmerge = false;

			if (data.UseFire?.toLowerCase() === "true")
				sensorTypes.UseFire = true;
			if (data.UsePSM?.toLowerCase() === "true")
				sensorTypes.UsePSM = true;
			if (data.UseETC?.toLowerCase() === "true")
				sensorTypes.UseETC = true;
			if (data.UseSVMS?.toLowerCase() === "true")
				sensorTypes.UseSVMS = true;
			if (data.UseEarthquake?.toLowerCase() === "true")
				sensorTypes.UseEarthquake = true;
			if (data.UseStrongWind?.toLowerCase() === "true")
				sensorTypes.UseStrongWind = true;
			if (data.UseBlackOut?.toLowerCase() === "true")
				sensorTypes.UseBlackOut = true;
			if (data.UseBecon?.toLowerCase() === "true")
				sensorTypes.UseBecon = true;
			if (data.UseEnvironment?.toLowerCase() === "true")
				sensorTypes.UseEnvironment = true;
			if (data.UseManufacture?.toLowerCase() === "true")
				sensorTypes.UseManufacture = true;
			if (data.UseEmergencyBell?.toLowerCase() === "true")
				sensorTypes.UseEmergencyBell = true;
			if (data.UseSubmerge?.toLowerCase() === "true")
				sensorTypes.UseSubmerge = true;

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
				useSensorTypes.UseManufacture !== data.UseManufacture ||
				useSensorTypes.UseEmergencyBell !== data.UseEmergencyBell ||
				useSensorTypes.UseSubmerge !== data.UseSubmerge) {

				this.setState({ useSensorTypes: sensorTypes });
			}
		}

		const userInfo = ProjectResource.getUserInfo();
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
				<Monitoring3D key="Monitoring3D" settings={this.state.settings} buildingGroupList={this.state.buildingGroupList} spreadMessages={this.state.spreadMessages}
					teamTreeDatas={this.state.teamTreeDatas} teams={this.state.teams} members={this.state.members} showConfirmDialog={this.showConfirmDialog} useSensorTypes={this.state.useSensorTypes}
					onChangeNeedToSave={this.onChangeNeedToSave} selectedSiteID={this.state.selectedSiteID} deleteOption={this.state.deleteOption} onChangeDeleteOption={this.onChangeDeleteOption} />
			);
		} else if (this.state.menu === SettingResource.setMenu.대시보드) {
			menuUI.push(
				<DashboardSet key="DashboardSet" settings={this.state.settings} onChangeNeedToSave={this.onChangeNeedToSave} />
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
					linkedSOPs={this.state.linkedSOPs}
					updateLinkedSops={this.updateLinkedSops}
					setSOPLinkDatas={this.setSOPLinkDatas}
				/>
			);
		} else if (this.state.menu === SettingResource.setMenu.조직관리) {
			menuUI.push(
				<TeamEditor key="TeamEditor" settings={this.state.settings} onChangeNeedToSave={this.onChangeNeedToSave} selectedSiteID={this.state.selectedSiteID} />
			);
		}
		else if (this.state.menu === SettingResource.setMenu.사용자_옵션) {
			menuUI.push(
				<UserOption key="UserOption" settings={this.state.settings} onChangeNeedToSave={this.onChangeNeedToSave}/>
			);
		}
		else if (this.state.menu === SettingResource.setMenu.연동_서비스_설정) {
			menuUI.push(
				<InterWorking key="CCTVSetting" 
					nvrList={this.state.nvrList}
					updateCCTVSettings={this.updateCCTVSettings}
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

		const spreadMessages = this.state.spreadMessages;
		const linkedSOPs = this.state.linkedSOPs;
		const buildingFile = settings.properties.BuildingFile;
		const groupFile = settings.properties.GroupFile;
		const facilityFile = settings.properties.FacilityFile;
		const regularTeamFile = settings.properties.RegularTeamFile;
		const deleteOption = this.state.deleteOption;

		const usePropertyDatas = [];
		const properTypeSDMS = 0;
		const properTypeSOP = 1;
		const properTypeAccount = 2;

		let useReceiveFire = {};
		let useReceiveFire_41, useReceiveFire_43, useReceiveFire_44, useReceiveFire_45, useReceiveFire_46, useReceiveFire_47;

		let useReceiveEmergencyBell = {};
		let useReceiveEmergencyBell_41, useReceiveEmergencyBell_43, useReceiveEmergencyBell_44, useReceiveEmergencyBell_45, useReceiveEmergencyBell_46, useReceiveEmergencyBell_47;

		let useReceiveBlackOut = {};
		let useReceiveBlackOut_41, useReceiveBlackOut_43, useReceiveBlackOut_44, useReceiveBlackOut_45, useReceiveBlackOut_46, useReceiveBlackOut_47;
		
		let useReceiveSubmerge = {};
		let useReceiveSubmerge_41, useReceiveSubmerge_43, useReceiveSubmerge_45;

		let useReceiveEarthquake = {};
		let useReceiveEarthquake_41, useReceiveEarthquake_43, useReceiveEarthquake_45;

		useReceiveFire = {
			"name": "useReceiveFire",
			"subName": null,
			"value": settings.properties.UseReceiveFire.toLowerCase() === "true" ? true : false,
			"properType": properTypeSDMS,
			"siteID": this.state.selectedSiteID
		}

		useReceiveEmergencyBell = {
			"name": "useReceiveEmergencyBell",
			"subName": null,
			"value": settings.properties.UseReceiveEmergencyBell.toLowerCase() === "true" ? true : false,
			"properType": properTypeSDMS,
			"siteID": this.state.selectedSiteID
		}

		useReceiveBlackOut = {
			"name": "useReceiveBlackOut",
			"subName": null,
			"value": settings.properties.UseReceiveBlackOut.toLowerCase() === "true" ? true : false,
			"properType": properTypeSDMS,
			"siteID": this.state.selectedSiteID
		}

		useReceiveSubmerge = {
			"name": "useReceiveSubmerge",
			"subName": null,
			"value": settings.properties.UseReceiveSubmerge.toLowerCase() === "true" ? true : false,
			"properType": properTypeSDMS,
			"siteID": this.state.selectedSiteID
		}

		useReceiveEarthquake = {
			"name": "useReceiveEarthquake",
			"subName": null,
			"value": settings.properties.UseReceiveEarthquake.toLowerCase() === "true" ? true : false,
			"properType": properTypeSDMS,
			"siteID": this.state.selectedSiteID
		}

		const useReceivePSM = {
			"name": "useReceivePSM",
			"subName": null,
			"value": settings.properties.UseReceivePSM.toLowerCase() === "true" ? true : false,
			"properType": properTypeSDMS,
			"siteID": this.state.selectedSiteID
		}

		const useReceiveETC = {
			"name": "useReceiveETC",
			"subName": null,
			"value": settings.properties.UseReceiveETC.toLowerCase() === "true" ? true : false,
			"properType": properTypeSDMS,
			"siteID": this.state.selectedSiteID
		}

		const useReceiveEnvironment = {
			"name": "useReceiveEnvironment",
			"subName": null,
			"value": settings.properties.UseReceiveEnvironment.toLowerCase() === "true" ? true : false,
			"properType": properTypeSDMS,
			"siteID": this.state.selectedSiteID
		}

		const useReceiveManufacture = {
			"name": "useReceiveManufacture",
			"subName": null,
			"value": settings.properties.UseReceiveManufacture.toLowerCase() === "true" ? true : false,
			"properType": properTypeSDMS,
			"siteID": this.state.selectedSiteID
		}

		const useReceiveSVMS = {
			"name": "useReceiveSVMS",
			"subName": null,
			"value": settings.properties.UseReceiveSVMS.toLowerCase() === "true" ? true : false,
			"properType": properTypeSDMS,
			"siteID": this.state.selectedSiteID
		}

		const useReceiveStrongWind = {
			"name": "useReceiveStrongWind",
			"subName": null,
			"value": settings.properties.UseReceiveStrongWind.toLowerCase() === "true" ? true : false,
			"properType": properTypeSDMS,
			"siteID": this.state.selectedSiteID
		}

		const useScreenMove = {
			"name": "useScreenMove",
			"subName": null,
			"value": settings.properties.UseScreenMove.toLowerCase() === "true" ? true : false,
			"properType": properTypeSDMS,
			"siteID": this.state.selectedSiteID
		}

		const useTrainingMode = {
			"name": "useTrainingMode",
			"subName": null,
			"value": settings.properties.UseTrainingMode.toLowerCase() === "true" ? true : false,
			"properType": properTypeSDMS,
			"siteID": this.state.selectedSiteID
		}

		const useWaterMark = {
			"name": "useWaterMark",
			"subName": null,
			"value": settings.properties.UseWaterMark.toLowerCase() === "true" ? true : false,
			"properType": properTypeSDMS,
			"siteID": this.state.selectedSiteID
		}

		const useHeadMessage = {
			"name": "useHeadMessage",
			"subName": null,
			"value": settings.properties.UseHeadMessage.toLowerCase() === "true" ? true : false,
			"properType": properTypeSDMS,
			"siteID": this.state.selectedSiteID
		}

		const useAutoMoveSOPScreen = {
			"name": "useAutoMoveSOPScreen",
			"subName": null,
			"value": settings.properties.UseAutoMoveSOPScreen.toLowerCase() === "true" ? true : false,
			"properType": properTypeSOP,
			"siteID": this.state.selectedSiteID
		}

		const useBroadcast = {
			"name": "useBroadcast",
			"subName": null,
			"value": settings.properties.UseBroadcast.toLowerCase() === "true" ? true : false,
			"properType": properTypeSOP,
			"siteID": this.state.selectedSiteID
		}

		const useSMS = {
			"name": "useSMS",
			"subName": null,
			"value": settings.properties.UseSMS.toLowerCase() === "true" ? true : false,
			"properType": properTypeSOP,
			"siteID": this.state.selectedSiteID
		}

		const useEmail = {
			"name": "useEmail",
			"subName": null,
			"value": settings.properties.UseEmail.toLowerCase() === "true" ? true : false,
			"properType": properTypeSOP,
			"siteID": this.state.selectedSiteID
		}

		const useConfirm = {
			"name": "useConfirm",
			"subName": null,
			"value": settings.properties.UseConfirm.toLowerCase() === "true" ? true : false,
			"properType": properTypeSOP,
			"siteID": this.state.selectedSiteID
		}

		const useResultSummary = {
			"name": "useResultSummary",
			"subName": null,
			"value": settings.properties.UseResultSummary.toLowerCase() === "true" ? true : false,
			"properType": properTypeSOP,
			"siteID": this.state.selectedSiteID
		}

		const useAlarmBroadcast = {
			"name": "useAlarmBroadcast",
			"subName": null,
			"value": settings.properties.UseAlarmBroadcast.toLowerCase() === "true" ? true : false,
			"properType": properTypeSDMS,
			"siteID": this.state.selectedSiteID
		}

		const usePoiFocus = {
			"name": "usePoiFocus",
			"subName": null,
			"value": settings.properties.UsePoiFocus.toLowerCase() === "true" ? true : false,
			"properType": properTypeSDMS,
			"siteID": this.state.selectedSiteID
		}

		const usePoiHighlight = {
			"name": "usePoiHighlight",
			"subName": null,
			"value": settings.properties.UsePoiHighlight.toLowerCase() === "true" ? true : false,
			"properType": properTypeSDMS,
			"siteID": this.state.selectedSiteID
		}

		const useAlarmTurn = {
			"name": "useAlarmTurn",
			"subName": null,
			"value": settings.properties.UseAlarmTurn.toLowerCase() === "true" ? true : false,
			"properType": properTypeAccount,
			"siteID": this.state.selectedSiteID
		}

		const useAlarmArea = {
			"name": "useAlarmArea",
			"subName": null,
			"value": settings.properties.UseAlarmArea.toLowerCase() === "true" ? true : false,
			"properType": properTypeSDMS,
			"siteID": this.state.selectedSiteID
		}

		usePropertyDatas.push(useScreenMove);
		usePropertyDatas.push(useTrainingMode);
		usePropertyDatas.push(useWaterMark);
		usePropertyDatas.push(useHeadMessage);
		usePropertyDatas.push(useAutoMoveSOPScreen);
		usePropertyDatas.push(useBroadcast);
		usePropertyDatas.push(useSMS);
		usePropertyDatas.push(useEmail);
		usePropertyDatas.push(useConfirm);
		usePropertyDatas.push(useResultSummary);
		usePropertyDatas.push(useAlarmBroadcast);
		usePropertyDatas.push(usePoiFocus);
		usePropertyDatas.push(usePoiHighlight);
		usePropertyDatas.push(useAlarmTurn);
		usePropertyDatas.push(useAlarmArea);
		usePropertyDatas.push(useReceivePSM);
		usePropertyDatas.push(useReceiveETC);
		usePropertyDatas.push(useReceiveEnvironment);
		usePropertyDatas.push(useReceiveManufacture);
		usePropertyDatas.push(useReceiveSVMS);
		usePropertyDatas.push(useReceiveStrongWind);
		usePropertyDatas.push(useReceiveFire);
		usePropertyDatas.push(useReceiveEmergencyBell);
		usePropertyDatas.push(useReceiveBlackOut);
		usePropertyDatas.push(useReceiveSubmerge);
		usePropertyDatas.push(useReceiveEarthquake);

		let saveData = {
			userID: userInfo.id,
			shortcutKey: settings.shortcutKey,
			idleTime: settings.properties.IdleTime,
			reAlarm: settings.properties.ReAlarm,
			eventInfoDisplayTerm: settings.properties.EventInfoDisplayTerm,
			exeCautionSOP: settings.properties.ExeCautionSOP,
			exeAlartSOP: settings.properties.ExeAlartSOP,
			exeSeriousSOP: settings.properties.ExeSeriousSOP,
			workingBeginHour: settings.properties.WorkingBeginHour,
			workingEndHour: settings.properties.WorkingEndHour,
			dashboardBegin: settings.properties.DashboardBegin,
			dashboardEnd: settings.properties.DashboardEnd,
			fireSOPWaitEndTime: settings.properties.FireSOPWaitEndTime,
			psmsopWaitEndTime: settings.properties.PSMSOPWaitEndTime,
			etcsopWaitEndTime: settings.properties.ETCSOPWaitEndTime,
			fireSOPRecoverEndTime: settings.properties.FireSOPRecoverEndTime,
			psmsopRecoverEndTime: settings.properties.PSMSOPRecoverEndTime,
			etcsopRecoverEndTime: settings.properties.ETCSOPRecoverEndTime,
			moveDisplayAlarm: settings.properties.MoveDisplayAlarm,
			turnStart: settings.properties.TurnStart,
			alarmSoundOffTime: settings.properties.AlarmSoundOffTime,
			usePropertyDatas: usePropertyDatas,
		};

		this.doSave(saveData, buildingFile, groupFile, facilityFile, regularTeamFile, spreadMessages, linkedSOPs, deleteOption);
	}

	async doSave(saveData, buildingFile, groupFile, facilityFile, regularTeamFile, spreadMessages, linkedSOPs, deleteOption) {
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

			let spreadTemp = spreadMessages;
			// 초기 상황전파 메시지 가져오기
			let spreadOld = [];
			const [spreadResult, spreadMessage] = await SettingController.requestGetSpreadMessage();
			if (spreadResult !== null && spreadResult !== undefined)
				spreadOld = spreadResult;

			// 변경점 비교하기
			let addSpread = [];
			let updateSpread = [];

			if (spreadTemp !== null && spreadTemp !== undefined) {
				for (let i = 0; i < spreadTemp.length; i++) {
					let spread = spreadTemp[i];

					if (spread.id === -1) {
						addSpread.push(spread);
						continue;
					}

					for (let j = 0; j < spreadResult.length; j++) {
						let spreadData = spreadResult[j];

						if (spread.id === spreadData.id) {
							if (spread.regularID !== spreadData.regularID ||
								spread.regularMemberID !== spreadData.regularMemberID ||
								spread.message !== spreadData.message) {
								updateSpread.push(spread);
							}

							spreadResult.splice(j, 1);
							break;
						}
					}
				}
			}

			[success, message] = await SettingController.requestSetSpreadMessage(addSpread, updateSpread, spreadResult);

			if (success === null) {
				// 저장이 끝남 상태변화
				this.state.isSaving = false;

				this.showConfirmDialog(i18n.t('common.오류'), [message], null, null);
				return;
			}

			// 상황별 sop 설정		
			[success, message] = await SopController.requestSaveLinkedSops(linkedSOPs, this.state.selectedSiteID);
			if (success === null) {
				// 저장이 끝남 상태변화
				this.state.isSaving = false;

				this.showConfirmDialog(i18n.t('common.오류'), [message], null, null);
				return;
			}

			// 건물 정보 업로드
			if (buildingFile !== null && buildingFile !== undefined) {
				[success, message] = await SettingController.requestUploadBuildingFile(buildingFile, this.state.selectedSiteID);
				if (success !== true) {
					// 저장이 끝남 상태변화
					this.state.isSaving = false;

					//alert("건물정보 업로드 실패:" + message);
					this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.formText.건물 정보 업로드 실패 :') + message], null, null);
					return;
				} else if (success === true) {
					this.state.settings.properties.BuildingFile = null;
				}
			}

			// 건물그룹 정보 업로드
			if (groupFile !== null && groupFile !== undefined) {
				[success, message] = await SettingController.requestUploadBuildingGroupFile(groupFile, this.state.selectedSiteID);
				if (success !== true) {
					// 저장이 끝남 상태변화
					this.state.isSaving = false;

					//alert("건물그룹 정보 업로드 실패:" + message);
					this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.formText.건물 정보 업로드 실패 :') + message], null, null);
					return;
				} else if (success === true) {
					this.state.settings.properties.GroupFile = null;
				}
			}

			// 설비 정보 업로드
			if (facilityFile !== null && facilityFile !== undefined) {
				[success, message] = await SettingController.requestUploadFacilityFile(facilityFile, this.state.selectedSiteID);
				if (success !== true) {
					// 저장이 끝남 상태변화
					this.state.isSaving = false;

					//alert("설비 정보 업로드 실패:" + message);
					this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.formText.설비 정보 업로드 실패 :') + message], null, null);
					return;
				} else if (success === true) {
					this.state.settings.properties.FacilityFile = null;
				}
			}

			// 조직 정보 업로드
			if (regularTeamFile !== null && regularTeamFile !== undefined) {
				[success, message] = await SettingController.requestUploadRegularTeamFile(regularTeamFile, this.state.selectedSiteID);
				if (success !== true) {
					// 저장이 끝남 상태변화
					this.state.isSaving = false;

					//alert("조직 정보 업로드 실패:" + message);
					this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.formText.조직 정보 업로드 실패 :') + message], null, null);
					return;
				} else if (success === true) {
					this.state.settings.properties.RegularTeamFile = null;
				}
			}

			// 로그파일 삭제
			[success, message] = await SettingController.saveLogDeletePolicy(deleteOption, this.state.selectedSiteID);
			if (success === null) {
				// 저장이 끝남 상태변화
				this.state.isSaving = false;

				this.showConfirmDialog(i18n.t('common.오류'), [message], null, null);
				return;
			}
		}

		// 창이 닫힌 상태
		if (this.state.onOffState === false) {
			//this.props.reloadSetting();
			this.afterReload();
        }

		// 저장이 끝남 상태변화
		this.state.isSaving = false;

		this.showConfirmDialog(i18n.t('common.확인'), [i18n.t('msg.저장되었습니다')], [i18n.t('common.확인')], this.onClickSaveClose);
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

		if (siteID === ProjectResource.Site.Hydrogen /* && ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen */) {
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

			// 정규조직 수정여부 확인
			if (siteID !== ProjectResource.Site.GG_A && (userInfo.options?.teamEditor?.useRegularEditor !== false && 
				(userAuthor === AccountResource.accountLevelID.master || userAuthor === AccountResource.accountLevelID.admin))) {
				authorMenuUI.push(
				 <React.Fragment key={'memuAdmin_team'}>
					<li key={'memuAdmin_team'}><a onClick={(e) => this.onClickMenu(SettingResource.setMenu.조직관리, e.target)}>{i18n.t('setting.menu.조직관리')}</a></li>
				 </React.Fragment>);
			}

			// 정규조직 수정여부 확인
			if (siteID === ProjectResource.Site.GG_A) {
				authorMenuUI.push(
				 <React.Fragment key={'memuAdmin_cctv'}>
					<li key={'memuAdmin_cctv'}>
						{/* <a onClick={(e) => this.onClickCCTVMenu(SettingResource.setMenu.연동_서비스_설정, e.target)}>{i18n.t('setting.menu.연동 서비스 설정')}</a> */}
						<a onClick={(e) => this.onClickMenu(SettingResource.setMenu.연동_서비스_설정, e.target)}>연동 서비스 설정</a>
					</li>
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

	setSOPLinkDatas = async (siteID) => {
		const [disasterCategories] = await SopController.disasterCategories(true, siteID);
		const [linkedSOPs] = await SopController.requestLinkedSOPs(siteID);

		this.setState({ disasterCategories, linkedSOPs });
	}

	onChangeDeleteOption = (deleteOption) => {
		this.setState({ deleteOption });
	}

	render() {
		const menuUI = this.setMenuUI();
		const authorMenuUI = this.getAuthorMenu();
		this.state.onOffState = true;

		const userAuthor = ProjectResource.getUserAuthor();
		
        return (
			<>
				{/* <div id='tooltip-area'></div> */}
				<LayoutSettingComponent id={'stgPop'}>
				{
					(this.state.isSaving && ProjectResource.SiteID === ProjectResource.Site.GG_A) &&
					<div style={{ width: "100vw", height: "100vh", background: "rgba(0, 0, 0, 0.5)", position: "absolute", top: 0, left: 0, zIndex: 9999}}>
						<Loader
							size="40px"
							borderSize="5px"
							baseColor="#fff"
							wheelColor="#5398FF"
							speed="700"
						/>
					</div>
				}
					<div>
						<div>
							<div className={'stgCont'}>
								<div className={'stgLft'}>
									<h4 className={'stgTitle'}>{i18n.t('setting.menu.환경설정')}</h4>
									{
										((ProjectResource.styleMode === ProjectResource.StyleType.Soulbrain || ProjectResource.styleMode === ProjectResource.StyleType.Wonik) &&
										(userAuthor === AccountResource.accountLevelID.master || userAuthor === AccountResource.accountLevelID.admin)) &&
										<div key='custom_select'>
											<CustomSelect
												key='custom_select'
												selectedSiteID={this.state.selectedSiteID}
												onChangeSite={this.onChangeSite}
											/>
										</div>
									}
									<ul className={"stgMenu settingMenu"}>
										{authorMenuUI}
									</ul>
								</div>
								<div className={'stgRht'}>
									<a onClick={() => this.onClickClose(SettingResource.closeMode.cancle)} className={'stgClose'}>{i18n.t('common.닫기')}</a>
										{menuUI}
									<ul className={'dspBtn'}>
										<li><a className={'pointCursor'} onClick={() => this.onClickClose(SettingResource.closeMode.cancle)}>{i18n.t('common.취소')}</a></li>
										<li><a className={'pointCursor'} onClick={this.onClickSave}>{i18n.t('common.저장')}</a></li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</LayoutSettingComponent>
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