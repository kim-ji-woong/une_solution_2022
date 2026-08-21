import React, { Component } from 'react';
import { Container } from 'reactstrap';
import $ from 'jquery';
import SelectReceiver from './selectReceiver';
import ConfirmDialog from '../../../Common/ui/confirmDialog';

import newStyles from '../../../Common/css/newStyle.module.css';
import newDefaults from '../../../Common/css/newDefault.module.css';
import settings from '../../css/settings.module.css';

import { SettingController } from '../../services/settingController';
import SessionString from '../../../Common/js/sessionString';
import SettingsStore from '../../settingsStore';
//import { array } from '@amcharts/amcharts4/core';
import SettingsResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';
import AccountResource from '../../../Account/resource/id';
import SdmsResource from '../../../SDMS/resource/id';

import { Monitoring3DComponent } from '../../styled/settingsStyled';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';
//import Tooltip from '../tooltip';

class Monitoring3D extends Component {
    constructor(props) {
        super(props);

		this.state = {
			tabMenu: i18n.t('common.일반'),
		}

		this.props = props;
	}

	onClickTab = (target, value) => {
		$('.MonitoringTab li a').removeClass('on');
		$(target).addClass('on');

		this.setState({ tabMenu: value });		
	}

	setContentUI = () => {
		let contentUI = null;

		if (this.state.tabMenu === i18n.t('common.일반')) {
			contentUI = (
				<NormalTab key="NormalTab" settings={this.props.settings} onChangeNeedToSave={this.props.onChangeNeedToSave} selectedSiteID={this.props.selectedSiteID} />
			);
		} else if (this.state.tabMenu === i18n.t('setting.monitoring3D.초기상황전파관리')) {
			contentUI = (
				<SpreadTab key="SpreadTab" settings={this.props.settings} buildingGroupList={this.props.buildingGroupList}
					spreadMessages={this.props.spreadMessages} teamTreeDatas={this.props.teamTreeDatas} teams={this.props.teams}
					members={this.props.members} useSensorTypes={this.props.useSensorTypes} onChangeNeedToSave={this.props.onChangeNeedToSave}
					selectedSiteID={this.props.selectedSiteID} />
			);
		} else if (this.state.tabMenu === i18n.t('setting.monitoring3D.센서감지관리')) {
			contentUI = (
				<DetectionTab key="DetectionTab" settings={this.props.settings} useSensorTypes={this.props.useSensorTypes}
					onChangeNeedToSave={this.props.onChangeNeedToSave} selectedSiteID={this.props.selectedSiteID} />
			);
        }

		return contentUI;
	}

	getAuthorTab() {
		let authorTabUI = [];
		authorTabUI.push(<React.Fragment key={"AuthorTab_normal"}><li key={"AuthorTab_normal"}><a onClick={(e) => this.onClickTab(e.target, i18n.t('common.일반'))} className={'on'}>{i18n.t('common.일반')}</a></li></React.Fragment>);

		let userInfo = ProjectResource.getUserInfo();
		if (userInfo === null || userInfo === undefined)
			return authorTabUI;

		if (userInfo.levelID === AccountResource.accountLevelID.master ||
			userInfo.levelID === AccountResource.accountLevelID.admin) {
			authorTabUI.push(<React.Fragment key={"AuthorTab_spread"}>
				<li key={"AuthorTab_spread"}><a onClick={(e) => this.onClickTab(e.target, i18n.t('setting.monitoring3D.초기상황전파관리'))}>{i18n.t('setting.monitoring3D.초기상황전파관리')}</a></li>
				<li key={"AuthorTab_detection"}><a onClick={(e) => this.onClickTab(e.target, i18n.t('setting.monitoring3D.센서감지관리'))}>{i18n.t('setting.monitoring3D.센서감지관리')}</a></li>
			</React.Fragment>);
		}

		return authorTabUI;
	}

	render() {
		const contentUI = this.setContentUI();
		const authorTabUI = this.getAuthorTab();

		return (
			<React.Fragment key='monitoring_3d'>
				<Monitoring3DComponent>
					<ul className={'stgTab' + " MonitoringTab"}>
						{authorTabUI}
					</ul>
					<span className={'stgScroll'}>
						{contentUI}
					</span>
				</Monitoring3DComponent>
			</React.Fragment>
        );
    }
}

export default withTranslation()(Monitoring3D);

class NormalTab extends Component {
	constructor(props) {
		super(props);

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
				buttons: [i18n.t('common.확인')],
				onClose: this.onCloseConfirmDialog,
				onClickButton: null,
				titleTooltipShow: false,
				typeTooltipShow: false,
				nameTooltipShow: false,
				tooltipTop: 0,
				tooltipLeft: 0,
			},
		}

		this.props = props;
	}

	componentDidMount() {
		this.initUsePoiHighlight();

		// .TODO: 고도화 내용으로 임시 주석처리
		//this.initTurnStart();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.selectedSiteID !== this.props.selectedSiteID) {
			this.initUsePoiHighlight();

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

	selectUsePoiHighlight = (use) => {
		if (use === null || use === undefined)
			return;

		if (use === SettingsResource.usePoiHighlight.on ||
			use === SettingsResource.usePoiHighlight.off) {
			this.props.settings.properties.UsePoiHighlight = use;
		}
	}

	onClickUpload = (mode) => {
		if (mode === i18n.t('setting.monitoring3D.건물정보 업데이트')) {
			this.refBuildingFile.current.click();
		} else if (mode === i18n.t('setting.monitoring3D.건물그룹 정보 업데이트')) {
			this.refGroupFile.current.click();
		} else if (mode === i18n.t('setting.monitoring3D.설비정보 업데이트')) {
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

		if (mode === i18n.t('setting.monitoring3D.건물정보 업데이트')) {
			this.downloadBuilding(selectedSiteID);
		} else if (mode === i18n.t('setting.monitoring3D.건물그룹 정보 업데이트')) {
			this.downloadBuildingGroup(selectedSiteID);
		} else if (mode === i18n.t('setting.monitoring3D.설비정보 업데이트')) {
			this.downloadFacility(selectedSiteID);
		}
	}

	onChangeBroadcastUse = (use) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		this.refUseBroadcast.current.checked = !this.refUseBroadcast.current.checked;
		this.refNotUseBroadcast.current.checked = !this.refNotUseBroadcast.current.checked;
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

	/* handleTooltip = (param, e) => {
		const domRect = e.target.getBoundingClientRect();

		if (param === 'title') {
			this.setState({
				titleTooltipShow: !this.state.titleTooltipShow,
				tooltipTop: domRect.top - 24,
				tooltipLeft: domRect.left - 30,
			});
		} else if (param === 'type') {
			this.setState({
				typeTooltipShow: !this.state.typeTooltipShow,
				tooltipTop: domRect.top - 24,
				tooltipLeft: domRect.left - 30,
			});
		} else if (param === 'name') {
			this.setState({
				nameTooltipShow: !this.state.nameTooltipShow,
				tooltipTop: domRect.top - 24,
				tooltipLeft: domRect.left - 30,
			});
		}
	} */


	/* buildingTooltip() {

		return (
			<>
			    <span className={'stgTltp'} 
					onMouseEnter={(e) => this.handleTooltip('title', e)}
					onMouseLeave={() => this.setState({ titleTooltipShow: false })}></span>
				<Tooltip
					show={this.state.titleTooltipShow}
					top={this.state.tooltipTop}
					left={this.state.tooltipLeft}
					className={'stgTltpConts'} 
				>
				   <p>건물 정보를 엑셀로 업로드/다운로드 (최대 10MB 가능)</p>
				</Tooltip>
			</>
	    )
	}

	buildingGroupTooltip() {

		return (
			<>
				<span className={'stgTltp'}
					onMouseEnter={(e) => this.handleTooltip('title', e)}
					onMouseLeave={() => this.setState({ titleTooltipShow: false })}></span>
				<Tooltip
					show={this.state.titleTooltipShow}
					top={this.state.tooltipTop}
					left={this.state.tooltipLeft}
					className={'stgTltpConts'}
				>
					<p>설비 정보를 엑셀로 업로드/다운로드 (최대 10MB 가능)</p>
				</Tooltip>
			</>
		)
	}

	facilityTooltip() {

		return (
			<>
				<span className={'stgTltp'} 
					onMouseEnter={(e) => this.handleTooltip('title', e)}
					onMouseLeave={() => this.setState({ titleTooltipShow: false })}></span>
				<Tooltip
					show={this.state.titleTooltipShow}
					top={this.state.tooltipTop}
					left={this.state.tooltipLeft}
					className={'stgTltpConts'}
				>
					<p>건물그룹 정보를 엑셀로 업로드/다운로드 (최대 10MB 가능)</p>
				</Tooltip>
			</>
		)
	} */


	getAuthorUI() {
		let authorMenuUI = [];

		let userInfo = ProjectResource.getUserInfo();
		if (userInfo === null || userInfo === undefined)
			return authorMenuUI;

		if (userInfo.levelID === AccountResource.accountLevelID.master ||
			userInfo.levelID === AccountResource.accountLevelID.admin) {
			authorMenuUI.push(<React.Fragment key={"authorMenuUI"}>
 				<div key={"authorMenuUI_building"} className={'stgName'}>
					<h5>{i18n.t('setting.monitoring3D.건물정보 업데이트')}</h5>
					<span className={'stgTltp'} data-tooltip={i18n.t('setting.monitoring3D.건물 정보를 엑셀로 업로드/다운로드 (최대 10MB 가능)')}></span>
					<a onClick={() => this.onClickUpload(i18n.t('setting.monitoring3D.건물정보 업데이트'))} className={'stgnRset' + " " + 'upload'}>{i18n.t('setting.monitoring3D.업로드')}</a>
					<a onClick={() => this.onClickDownload(i18n.t('setting.monitoring3D.건물정보 업데이트'))} className={'stgnRset' + " " + 'ml5'}>{i18n.t('setting.monitoring3D.다운로드')}</a>
					<input ref={this.refBuildingFile} className={'hidden'} type='file' accept='.xls,.xlsx' onChange={this.onSelectBuildingFile} />
				</div>
				<div key={"authorMenuUI_group"} className={'stgName'}>
					<h5>{i18n.t('setting.monitoring3D.건물그룹 정보 업데이트')}</h5>
					<span className={'stgTltp'} data-tooltip={i18n.t('setting.monitoring3D.건물그룹 정보를 엑셀로 업로드/다운로드 (최대 10MB 가능)')}></span>
					<a onClick={() => this.onClickUpload(i18n.t('setting.monitoring3D.건물그룹 정보 업데이트'))} className={'stgnRset' + " " + 'upload'}>{i18n.t('setting.monitoring3D.업로드')}</a>
					<a onClick={() => this.onClickDownload(i18n.t('setting.monitoring3D.건물그룹 정보 업데이트'))} className={'stgnRset' + " " + 'ml5'}>{i18n.t('setting.monitoring3D.다운로드')}</a>
					<input ref={this.refGroupFile} className={'hidden'} type='file' accept='.xls,.xlsx' onChange={this.onSelectGroupFile} />
				</div>
				<div key={"authorMenuUI_facility"} className={'stgName'}>
					<h5>{i18n.t('setting.monitoring3D.설비정보 업데이트')}</h5>
					<span className={'stgTltp'} data-tooltip={i18n.t('setting.monitoring3D.설비 정보를 엑셀로 업로드/다운로드 (최대 10MB 가능)')}></span>
					<a onClick={() => this.onClickUpload(i18n.t('setting.monitoring3D.설비정보 업데이트'))} className={'stgnRset' + " " + 'upload'}>{i18n.t('setting.monitoring3D.업로드')}</a>
					<a onClick={() => this.onClickDownload(i18n.t('setting.monitoring3D.설비정보 업데이트'))} className={'stgnRset' + " " + 'ml5'}>{i18n.t('setting.monitoring3D.다운로드')}</a>
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

	doCCTVAppDownload = async () => {
		const pathname = '/resource/install/UnEcctv_Setup.zip';
		const url = window.location.origin + pathname;
		const response = await fetch(url);
		const file = await response.blob(); 
		const downloadUrl = window.URL.createObjectURL(file); // 해당 file을 가리키는 url 생성
		
		const anchorElement = document.createElement('a');
		document.body.appendChild(anchorElement);
		anchorElement.download = 'UnEcctv_Setup';
		anchorElement.href = downloadUrl;
		anchorElement.click();
		document.body.removeChild(anchorElement); // cleanup
		window.URL.revokeObjectURL(file);
	}

	render() {
		const authorMenuUI = this.getAuthorUI();
		const userInfo = ProjectResource.getUserInfo();

		return (
			<>
				<div className={'stgList'}>
					{/*	.TODO: 고도화 내용으로 임시 주석처리 */}
					{/*<div className={'stgName'}>*/}
					{/*	<h5>자동회전 시작점</h5>*/}
					{/*	<span className={'stgTltp'} data-tooltip="자동회전 시작시 기준화면 설정">&nbsp;&nbsp;</span>*/}

					{/*	<input type="radio" ref={this.refTurnStart01} name="turnStart" id="turnStart01" onChange={() => this.selectTurnStart(SettingsResource.turnStart.LastView)} />*/}
					{/*	<span className={'white'}>&nbsp;&nbsp;마지막 위치 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>*/}

					{/*	<input type="radio" ref={this.refTurnStart02} name="turnStart" id="turnStart02" onChange={() => this.selectTurnStart(SettingsResource.turnStart.StandardView)} />*/}
					{/*	<span className={'white'}>&nbsp;&nbsp;기본뷰 &nbsp;&nbsp;</span>*/}
					{/*</div>*/}
					{
						(ProjectResource.SiteID === ProjectResource.Site.GG_A) ?
						<>
							<div className={'stgName' + " " + 'settingRadio'}>
								<h5>{i18n.t('setting.monitoring3D.POI 하이라이트')}</h5>
								<span className={'stgTltp'} data-tooltip={i18n.t('setting.monitoring3D.POI 선택시 선택된 POI 및 같은 공간의 POI 확대 여부를 설정 합니다')}></span>
								<input type="radio" ref={this.refUsePoiHighlightOn} name="usePoiHighlight" id="usePoiHighlightOn" onChange={() => this.selectUsePoiHighlight(SettingsResource.usePoiHighlight.on)}  />
								<span className={'white'}>&nbsp;&nbsp;{i18n.t('common.사용')}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>

								<input type="radio" ref={this.refUsePoiHighlightOff} name="usePoiHighlight" id="usePoiHighlightOff" onChange={() => this.selectUsePoiHighlight(SettingsResource.usePoiHighlight.off)} />
								<span className={'white'}>&nbsp;&nbsp;{i18n.t('common.사용안함')} &nbsp;&nbsp;</span>
							</div>
							<div className={'stgName' + " " + 'settingRadio'}>
								<h5>{i18n.t('setting.monitoring3D.CCTV 앱 다운로드')}</h5>
								<span className={'stgTltp'} data-tooltip={i18n.t('setting.monitoring3D.다운로드를 통해 CCTV 앱 실행이 가능합니다')}></span>
								<a className={'stgnRset' + " " + 'ml5'} onClick={() => this.doCCTVAppDownload()}>{i18n.t('setting.monitoring3D.다운로드')}</a>
							</div>
						</>
						:
						<>
							{authorMenuUI}

							<div className={'stgName' + " " + 'settingRadio'}>
								<h5>{i18n.t('setting.monitoring3D.POI 하이라이트')}</h5>
								<span className={'stgTltp'} data-tooltip={i18n.t('setting.monitoring3D.POI 선택시 선택된 POI 및 같은 공간의 POI 확대 여부를 설정 합니다')}></span>
								<input type="radio" ref={this.refUsePoiHighlightOn} name="usePoiHighlight" id="usePoiHighlightOn" onChange={() => this.selectUsePoiHighlight(SettingsResource.usePoiHighlight.on)}  />
								<span className={'white'}>&nbsp;&nbsp;{i18n.t('common.사용')}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>

								<input type="radio" ref={this.refUsePoiHighlightOff} name="usePoiHighlight" id="usePoiHighlightOff" onChange={() => this.selectUsePoiHighlight(SettingsResource.usePoiHighlight.off)} />
								<span className={'white'}>&nbsp;&nbsp;{i18n.t('common.사용안함')} &nbsp;&nbsp;</span>
							</div>
						</>
					}

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
			messageType: SettingsResource.messageType.sms,
			message: "",
			receiver: "",
			selectPopupOnOff: false,
			selectFacilityType: "",			// 전파 대상자지정 팝업창 전달용 인자
			selectBuildingGroup: "",		// 전파 대상자지정 팝업창 전달용 인자
			selectBuilding: "",				// 전파 대상자지정 팝업창 전달용 인자
			selectRegularID: null,			// 전파 대상자지정 팝업창 전달용 인자
			selectRegularMemberID: null,	// 전파 대상자지정 팝업창 전달용 인자

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

		this.refFacilityType = React.createRef();
		this.refBuildingGroup = React.createRef();
		this.refBuilding = React.createRef();
		this.refMessage = React.createRef();
		this.refRegularID = React.createRef();
		this.refRegularMemberID = React.createRef();

	}

	componentDidMount() {
		$('.stgmTab' + " li a").click(function() {
			$('.stgmTab' + " li a").removeClass('on');
			$(this).addClass('on');
			
		});

		// 해당 메시지 및 전파인원 초기화 
		let type = this.refFacilityType.current.value;
		let buildingGroupID = this.refBuildingGroup.current.value;
		let buildingID = this.refBuilding.current.value;

		const [message, receiver, regularID, regularMemberID] = this.getSpreadInfo(type, buildingGroupID, buildingID);

		this.setState({ receiver: receiver });
		this.refMessage.current.value = message;
		this.refRegularID.current.value = regularID;
		this.refRegularMemberID.current.value = regularMemberID;
	}

	componentDidUpdate(prevProps, prevState) {

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
			this.props.onChangeNeedToSave();
        }

    }

	getSpreadInfo(type, buildingGroupID, buildingID) {
		if (this.props.spreadMessages === null || this.props.spreadMessages === undefined)
			return [null, null, null, null];

		let dataType = parseInt(type);
		let dataBuildingGroupID = null;
		let dataBuildingID = null;

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
		let type = this.refFacilityType.current.value;
		this.refBuildingGroup.current.value = "";
		this.refBuilding.current.value = "";

		const [message, receiver, regularID, regularMemberID] = this.getSpreadInfo(type, null, null);

		this.setState({ receiver: receiver });
		this.refMessage.current.value = message;
		this.refRegularID.current.value = regularID;
		this.refRegularMemberID.current.value = regularMemberID;
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

				buildingGroupUI.push(<option key={"buildingGroup_" + buildingGroup.id} value={buildingGroup.id}>{buildingGroup.displayText}</option>);
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

						buildingList.push(<option key={building.id} value={building.id}>{building.displayText}</option>);
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

		this.showConfirmDialog(i18n.t('common.확인'), [i18n.t('msg.적용되었습니다')], null, null);
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

		let type = null;

		// 화재 초기화
		if (this.props.useSensorTypes?.UseFire === true) {
			type = SdmsResource.facilityType.FIRE;
			this.updateSpreadMessage(type, "", "", this.state.messageType, message, regularID, regularMemberID);

			if (this.props.buildingGroupList !== null && this.props.buildingGroupList !== undefined) {
				const buildingGroupList = this.props.buildingGroupList;

				for (let i = 0; i < buildingGroupList.length; i++) {
					let buildingGroup = buildingGroupList[i];

					this.updateSpreadMessage(type, buildingGroup.id, "", this.state.messageType, message, regularID, regularMemberID);

					for (let j = 0; j < buildingGroup.buildingDatas.length; j++) {
						let building = buildingGroup.buildingDatas[j];

						this.updateSpreadMessage(type, buildingGroup.id, building.id, this.state.messageType, message, regularID, regularMemberID);
					}
				}
			}
		}		

		// 누출 초기화
		if (this.props.useSensorTypes?.UsePSM === true) {
			type = SdmsResource.facilityType.PSM_SENSOR;
			this.updateSpreadMessage(type, "", "", this.state.messageType, message, regularID, regularMemberID);

			if (this.props.buildingGroupList !== null && this.props.buildingGroupList !== undefined) {
				const buildingGroupList = this.props.buildingGroupList;

				for (let i = 0; i < buildingGroupList.length; i++) {
					let buildingGroup = buildingGroupList[i];

					this.updateSpreadMessage(type, buildingGroup.id, "", this.state.messageType, message, regularID, regularMemberID);

					for (let j = 0; j < buildingGroup.buildingDatas.length; j++) {
						let building = buildingGroup.buildingDatas[j];

						this.updateSpreadMessage(type, buildingGroup.id, building.id, this.state.messageType, message, regularID, regularMemberID);
					}
				}
			}
		}		

		// ETC 초기화
		if (this.props.useSensorTypes?.UseETC === true) {
			type = SdmsResource.facilityType.ETC;
			this.updateSpreadMessage(type, "", "", this.state.messageType, message, regularID, regularMemberID);

			if (this.props.buildingGroupList !== null && this.props.buildingGroupList !== undefined) {
				const buildingGroupList = this.props.buildingGroupList;

				for (let i = 0; i < buildingGroupList.length; i++) {
					let buildingGroup = buildingGroupList[i];

					this.updateSpreadMessage(type, buildingGroup.id, "", this.state.messageType, message, regularID, regularMemberID);

					for (let j = 0; j < buildingGroup.buildingDatas.length; j++) {
						let building = buildingGroup.buildingDatas[j];

						this.updateSpreadMessage(type, buildingGroup.id, building.id, this.state.messageType, message, regularID, regularMemberID);
					}
				}
			}
		}		

		// 지능형 영상 초기화
		if (this.props.useSensorTypes?.UseSVMS === true) {
			type = SdmsResource.facilityType.Intrusion_S1;
			this.updateSpreadMessage(type, "", "", this.state.messageType, message, regularID, regularMemberID);

			if (this.props.buildingGroupList !== null && this.props.buildingGroupList !== undefined) {
				const buildingGroupList = this.props.buildingGroupList;

				for (let i = 0; i < buildingGroupList.length; i++) {
					let buildingGroup = buildingGroupList[i];

					this.updateSpreadMessage(type, buildingGroup.id, "", this.state.messageType, message, regularID, regularMemberID);

					for (let j = 0; j < buildingGroup.buildingDatas.length; j++) {
						let building = buildingGroup.buildingDatas[j];

						this.updateSpreadMessage(type, buildingGroup.id, building.id, this.state.messageType, message, regularID, regularMemberID);
					}
				}
			}
		}

		// 지진
		if (this.props.useSensorTypes?.UseEarthquake === true) {
			type = SdmsResource.facilityType.Earthquake;
			this.updateSpreadMessage(type, "", "", this.state.messageType, message, regularID, regularMemberID);

			if (this.props.buildingGroupList !== null && this.props.buildingGroupList !== undefined) {
				const buildingGroupList = this.props.buildingGroupList;

				for (let i = 0; i < buildingGroupList.length; i++) {
					let buildingGroup = buildingGroupList[i];

					this.updateSpreadMessage(type, buildingGroup.id, "", this.state.messageType, message, regularID, regularMemberID);

					for (let j = 0; j < buildingGroup.buildingDatas.length; j++) {
						let building = buildingGroup.buildingDatas[j];

						this.updateSpreadMessage(type, buildingGroup.id, building.id, this.state.messageType, message, regularID, regularMemberID);
					}
				}
			}
		}

		// 태풍
		if (this.props.useSensorTypes?.UseStrongWind === true) {
			type = SdmsResource.facilityType.STRONG_WIND;
			this.updateSpreadMessage(type, "", "", this.state.messageType, message, regularID, regularMemberID);

			if (this.props.buildingGroupList !== null && this.props.buildingGroupList !== undefined) {
				const buildingGroupList = this.props.buildingGroupList;

				for (let i = 0; i < buildingGroupList.length; i++) {
					let buildingGroup = buildingGroupList[i];

					this.updateSpreadMessage(type, buildingGroup.id, "", this.state.messageType, message, regularID, regularMemberID);

					for (let j = 0; j < buildingGroup.buildingDatas.length; j++) {
						let building = buildingGroup.buildingDatas[j];

						this.updateSpreadMessage(type, buildingGroup.id, building.id, this.state.messageType, message, regularID, regularMemberID);
					}
				}
			}
		}

		// 정전
		if (this.props.useSensorTypes?.UseBlackOut === true) {
			type = SdmsResource.facilityType.BLACKOUT;
			this.updateSpreadMessage(type, "", "", this.state.messageType, message, regularID, regularMemberID);

			if (this.props.buildingGroupList !== null && this.props.buildingGroupList !== undefined) {
				const buildingGroupList = this.props.buildingGroupList;

				for (let i = 0; i < buildingGroupList.length; i++) {
					let buildingGroup = buildingGroupList[i];

					this.updateSpreadMessage(type, buildingGroup.id, "", this.state.messageType, message, regularID, regularMemberID);

					for (let j = 0; j < buildingGroup.buildingDatas.length; j++) {
						let building = buildingGroup.buildingDatas[j];

						this.updateSpreadMessage(type, buildingGroup.id, building.id, this.state.messageType, message, regularID, regularMemberID);
					}
				}
			}
		}

		// 비콘
		if (this.props.useSensorTypes?.UseBecon === true) {
			type = SdmsResource.facilityType.Becon_Stay;
			this.updateSpreadMessage(type, "", "", this.state.messageType, message, regularID, regularMemberID);

			if (this.props.buildingGroupList !== null && this.props.buildingGroupList !== undefined) {
				const buildingGroupList = this.props.buildingGroupList;

				for (let i = 0; i < buildingGroupList.length; i++) {
					let buildingGroup = buildingGroupList[i];

					this.updateSpreadMessage(type, buildingGroup.id, "", this.state.messageType, message, regularID, regularMemberID);

					for (let j = 0; j < buildingGroup.buildingDatas.length; j++) {
						let building = buildingGroup.buildingDatas[j];

						this.updateSpreadMessage(type, buildingGroup.id, building.id, this.state.messageType, message, regularID, regularMemberID);
					}
				}
			}
		}

		// 환경설비
		if (this.props.useSensorTypes?.UseEnvironment === true) {
			type = SdmsResource.facilityType.Environment;
			this.updateSpreadMessage(type, "", "", this.state.messageType, message, regularID, regularMemberID);

			if (this.props.buildingGroupList !== null && this.props.buildingGroupList !== undefined) {
				const buildingGroupList = this.props.buildingGroupList;

				for (let i = 0; i < buildingGroupList.length; i++) {
					let buildingGroup = buildingGroupList[i];

					this.updateSpreadMessage(type, buildingGroup.id, "", this.state.messageType, message, regularID, regularMemberID);

					for (let j = 0; j < buildingGroup.buildingDatas.length; j++) {
						let building = buildingGroup.buildingDatas[j];

						this.updateSpreadMessage(type, buildingGroup.id, building.id, this.state.messageType, message, regularID, regularMemberID);
					}
				}
			}
		}

		// 제조설비
		if (this.props.useSensorTypes?.UseManufacture === true) {
			type = SdmsResource.facilityType.Manufacture;
			this.updateSpreadMessage(type, "", "", this.state.messageType, message, regularID, regularMemberID);

			if (this.props.buildingGroupList !== null && this.props.buildingGroupList !== undefined) {
				const buildingGroupList = this.props.buildingGroupList;

				for (let i = 0; i < buildingGroupList.length; i++) {
					let buildingGroup = buildingGroupList[i];

					this.updateSpreadMessage(type, buildingGroup.id, "", this.state.messageType, message, regularID, regularMemberID);

					for (let j = 0; j < buildingGroup.buildingDatas.length; j++) {
						let building = buildingGroup.buildingDatas[j];

						this.updateSpreadMessage(type, buildingGroup.id, building.id, this.state.messageType, message, regularID, regularMemberID);
					}
				}
			}
		}

		this.showConfirmDialog(i18n.t('common.확인'), [i18n.t('setting.monitoring3D.모든 재난유형 동일하게 적용되었습니다')], null, null);
	}

	onClickSelectReceiver = () => {
		const regularID = this.refRegularID.current.value;
		const regularMemberID = this.refRegularMemberID.current.value;

		const facilityType = this.refFacilityType.current.value;
		let facilityTypeName = "";

		if (facilityType === SdmsResource.facilityType.FIRE.toString())
			facilityTypeName = i18n.t('facilityType.화재');
		else if (facilityType === SdmsResource.facilityType.PSM_SENSOR.toString())
			facilityTypeName = i18n.t('facilityType.누출');
		else if (facilityType === SdmsResource.facilityType.ETC.toString())
			facilityTypeName = i18n.t('facilityType.기타');
		else if (facilityType === SdmsResource.facilityType.Intrusion_S1.toString())
			facilityTypeName = i18n.t('facilityType.지능형 영상');
		else if (facilityType === SdmsResource.facilityType.STRONG_WIND.toString())
			facilityTypeName = i18n.t('facilityType.지진');
		else if (facilityType === SdmsResource.facilityType.Earthquake.toString())
			facilityTypeName = i18n.t('facilityType.강풍');

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
					regularMemberID={this.state.selectRegularMemberID} />
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
			this.props.onChangeNeedToSave();
		}

	}

	getOptionUI = () => {
		const optionUI = [];

		if (this.props.useSensorTypes?.UseFire === true) {
			optionUI.push(<option key={"optionUI_Fire"} value={SdmsResource.facilityType.FIRE} >{i18n.t('facilityType.화재')}</option >);
		}
		if (this.props.useSensorTypes?.UsePSM === true) {
			optionUI.push(<option key={"optionUI_PSM"} value={SdmsResource.facilityType.PSM_SENSOR}>{i18n.t('facilityType.누출')}</option>);
		}
		if (this.props.useSensorTypes?.UseETC === true) {
			optionUI.push(<option key={"optionUI_ETC"} value={SdmsResource.facilityType.ETC}>{i18n.t('facilityType.기타')}</option>);
		}
		if (this.props.useSensorTypes?.UseSVMS === true) {
			optionUI.push(<option key={"optionUI_SVMS"} value={SdmsResource.facilityType.Intrusion_S1}>{i18n.t('facilityType.지능형 영상')}</option>);
		}
		if (this.props.useSensorTypes?.UseEarthquake === true) {
			optionUI.push(<option key={"optionUI_Earthquake"} value={SdmsResource.facilityType.Earthquake}>{i18n.t('facilityType.지진')}</option>);
		}
		if (this.props.useSensorTypes?.UseStrongWind === true) {
			optionUI.push(<option key={"optionUI_StrongWind"} value={SdmsResource.facilityType.STRONG_WIND}>{i18n.t('facilityType.강풍')}</option>);
		}
		if (this.props.useSensorTypes?.UseBlackOut === true) {
			optionUI.push(<option key={"optionUI_BlackOut"} value={SdmsResource.facilityType.BLACKOUT}>{i18n.t('facilityType.정전')}</option>);
		}
		if (this.props.useSensorTypes?.UseBecon === true) {
			optionUI.push(<option key={"optionUI_Becon"} value={SdmsResource.facilityType.Becon_Stay}>{i18n.t('facilityType.비콘')}</option>);
		}
		if (this.props.useSensorTypes?.UseEnvironment === true) {
			optionUI.push(<option key={"optionUI_Environment"} value={SdmsResource.facilityType.Environment}>{i18n.t('facilityType.환경설비')}</option>);
		}
		if (this.props.useSensorTypes?.UseManufacture === true) {
			optionUI.push(<option key={"optionUI_Manufacture"} value={SdmsResource.facilityType.Manufacture}>{i18n.t('facilityType.제조설비')}</option>);
		}

		return optionUI;
    }


	render() {
		const optionUI = this.getOptionUI();

		return (
			<>
				<div className={'stgList'}>
					<div className={'stgName'}>
						<h5>{i18n.t('setting.monitoring3D.문자/이메일발송설정')}</h5>
						<span className={'stgTltp'} data-tooltip={i18n.t('setting.formText.문자/이메일 발송 옵션을 설정 합니다')}></span>
					</div>

					<div className={'stgmWrap'}>
						<ul className={'stgmLft'}>
							<li>
								<select ref={this.refFacilityType} name="" id="" className={'dslSel'} onChange={this.onChangeFacilityType}>
									{optionUI}
								</select>
							</li>
							<li>
								<select ref={this.refBuildingGroup} name="" id="" className={'dslSel'} onChange={this.onChangeBuildingGroup}>
									<option value="">{i18n.t('common.전체')}</option>
									{this.setBuildingGroupUI()}
								</select>
							</li>
							<li>
								<select ref={this.refBuilding} name="" id="" className={'dslSel'} onChange={this.onChangeBuilding}>
									<option value="">{i18n.t('common.전체')}</option>
									{this.state.buildingList}
								</select>
							</li>
							<li><a onClick={this.onClickSelectReceiver}>{i18n.t('setting.monitoring3D.전파 대상자 지정')}</a></li>
						</ul>
						<div className={'stgmCen'}>
							<div className={'stgmCont'}>
								<ul className={'stgmTab'}>
									<li><a id="sms" onClick={() => this.onClickMessageTyep(SettingsResource.messageType.sms)} className={'on'}>{i18n.t('common.문자')}</a></li>
									<li><a id="email" onClick={() => this.onClickMessageTyep(SettingsResource.messageType.email)}>{i18n.t('common.메일')}</a></li>
								</ul>
								<div className={'stgmDtl'} id="stgmsms" style={{ "display": "block" }}>
									{/*<p className={newStyles.stgmDft}>기본 문구가 표출되는 영역(수정불가) 기본 문구가 표출되는 영역(수정불가) 기본 문구가 표출되는 영역(수정불가)</p>*/}
									<textarea ref={this.refMessage} className={'stgmTxt' + " scrollbar"} ></textarea>
									<div className={'stgmTo'}>
										<span>{i18n.t('setting.monitoring3D.수신자')} : </span>
										<p>{this.state.receiver}</p>
									</div>
								</div>
								{/*
								<div class={newStyles.stgmDtl} id="stgmmail">
									<p class={newStyles.stgmDft}>기본 문구가 표출되는 영역(수정불가) 기본 문구가 표출되는 영역(수정불가) 기본 문구가 표출되는 영역(수정불가)</p>
									<textarea class={'stgmTxt' + " scrollbar"}></textarea>
									<div class={'stgmTo'}>
										<span>수신자 : </span>
										<p>전기팀, 설비팀, 지원팀</p>
									</div>
								</div>
								*/}
								<input ref={this.refRegularID} type="text" className={'hidden'} />
								<input ref={this.refRegularMemberID} type="text" className={'hidden'} />
							</div>
						</div>
						<div className={'stgmRht'}>
							<h5>{i18n.t('setting.monitoring3D.특수문자설명')}</h5>
							<ul>
								<li><span> &#123;location&#125; : </span><br />{i18n.t('setting.monitoring3D.재난발생위치')}</li>
								<li><span> &#123;date&#125; : </span><br />{i18n.t('setting.monitoring3D.재난발생시간')}</li>
							</ul>
						</div>
						<ul className={'stgmBtn'}>
							<li><a onClick={this.onClickAllMsgSave}>{i18n.t('setting.monitoring3D.모든 재난유형 동일하게 적용하기')}</a></li>
							{/*<li><a href="#">{i18n.t('setting.monitoring3D.임시저장'}</a></li>*/}
							<li><a onClick={this.onClickMsgSave}>{i18n.t('setting.monitoring3D.적용')}</a></li>
						</ul>
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
			confirmMessage: {
				visible: false,
				title: "",
				messages: [""],
				buttons: [i18n.t('common.확인')],
				onClose: this.onCloseConfirmDialog,
				onClickButton: null,
				titleTooltipShow: false,
				typeTooltipShow: false,
				nameTooltipShow: false,
				tooltipTop: 0,
				tooltipLeft: 0,
			},
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
		this.refUseEarthquake = React.createRef();
		this.refUseStrongWind = React.createRef();
		this.refUseEmergencyBell = React.createRef();
		this.refUseSubmerge = React.createRef();
		this.refUseBlackOut = React.createRef();

		this.refUseReceiveFire_GG = {};
		this.refUseReceiveEmergencyBell_GG = {};
		this.refUseReceiveBlackOut_GG = {};
		this.refUseReceiveSubmerge_GG = {};
		this.refUseReceiveEarthquake_GG = {};

		this.refUseReceiveEnvironment = React.createRef();
		this.refUseReceiveManufacture = React.createRef();

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

		this.refUseAlarmAreaOn = React.createRef();
		this.refUseAlarmAreaOff = React.createRef();
		
		this.refSoundOffTime = React.createRef();
		this.refSoundOffTimeUse = React.createRef();

	}

	componentDidMount() {
		//this.initReAlarmSet();
		this.initUseReceive();
		//this.initEventInfoDisplayTerm();
		//this.initUseScreenMove();
		this.initExeSOPSet();
		//this.initTrainingData();
		this.initMoveDisplayAlarm();
		this.initUsePoiFocus();
		this.setAlarmBroadcast();
		this.initUseAlarmArea();

		this.initSoundOffTime();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.selectedSiteID !== this.props.selectedSiteID) {
			//this.initReAlarmSet();
			this.initUseReceive();
			//this.initEventInfoDisplayTerm();
			//this.initUseScreenMove();
			this.initExeSOPSet();
			//this.initTrainingData();
			this.initMoveDisplayAlarm();
			this.initUsePoiFocus();
			this.setAlarmBroadcast();
		}
	}

	initMoveDisplayAlarm() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let moveDisplayAlarm = this.props.settings.properties.MoveDisplayAlarm;

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

		let usePoiFocus = this.props.settings.properties.UsePoiFocus;

		if (usePoiFocus === SettingsResource.usePoiFocus.on) {
			this.refUsePoiFocusOn.current.click();
		} else if (usePoiFocus === SettingsResource.usePoiFocus.off) {
			this.refUsePoiFocusOff.current.click();
        }
    }

	initUseAlarmArea() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		// appsettings 옵션처리
		if (this.useEquipZoneArea() === false)
			return;

		let useAlarmArea = this.props.settings.properties.UseAlarmArea;

		if (useAlarmArea === SettingsResource.useAlarmArea.on) {
			this.refUseAlarmAreaOn.current.click();
		} else if (useAlarmArea === SettingsResource.useAlarmArea.off) {
			this.refUseAlarmAreaOff.current.click();
        }
    }

	/*
	initTrainingData() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let useTrainingMode = this.props.settings.properties.UseTrainingMode;
		let useWaterMark = this.props.settings.properties.UseWaterMark;
		let useHeadMessage = this.props.settings.properties.UseHeadMessage;

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
		this.props.settings.properties.UseHeadMessage = value;
		this.props.onChangeNeedToSave();
    }

	onChangeUseTrainingMode = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();
		this.props.settings.properties.UseTrainingMode = value;
		this.props.onChangeNeedToSave();
	}

	onChangeUseWaterMark = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();
		this.props.settings.properties.UseWaterMark = value;
		this.props.onChangeNeedToSave();
	}

	onChangeUseHeadMessage = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();

		if (value === "false") {
			this.props.settings.properties.UseHeadMessage = value;
			$('#headMessage').attr("disabled", true);
		} else {
			this.props.settings.properties.UseHeadMessage = this.refHeadMessage.current.value;
			$('#headMessage').attr("disabled", false);
		}

		this.props.onChangeNeedToSave();
	}

	initExeSOPSet() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let exeCautionSOP = this.props.settings.properties.ExeCautionSOP;
		let exeAlartSOP = this.props.settings.properties.ExeAlartSOP;
		let exeSeriousSOP = this.props.settings.properties.ExeSeriousSOP;

		//this.refExeCautionSOP.current.value = exeCautionSOP;
		//this.refExeAlartSOP.current.value = exeAlartSOP;
		//this.refExeSeriousSOP.current.value = exeSeriousSOP;
	}
	/*
	onChangeExeCautionSOP = () => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		this.props.settings.properties.exeCautionSOP = this.refExeCautionSOP.current.value;
	}

	onChangeExeAlartSOP = () => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		this.props.settings.properties.exeAlartSOP = this.refExeAlartSOP.current.value;
	}

	onChangeExeSeriousSOP = () => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		this.props.settings.properties.exeSeriousSOP = this.refExeSeriousSOP.current.value;
	}
	*/

	/*
	initUseScreenMove() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let useScreenMove = this.props.settings.properties.UseScreenMove;

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

		this.props.settings.properties.UseScreenMove = mode;
		this.props.onChangeNeedToSave();
    }
	/*
	initEventInfoDisplayTerm() {
		if (this.props.settings === null || this.props.settings === undefined) 
			return;

		let eventTerm = this.props.settings.properties.eventInfoDisplayTerm;

		if (eventTerm === null || eventTerm === undefined || eventTerm === "")
			return;

		if (eventTerm === SettingsResource.eventInfoDisplayTerm.day) {
			this.eventTermDay.current.click();
		} else if (eventTerm === SettingsResource.eventInfoDisplayTerm.week) {
			this.eventTermWeek.current.click();
		} else if (eventTerm === SettingsResource.eventInfoDisplayTerm.month) {
			this.eventTermMonth.current.click();
		}
    }
	*/

	initUseReceive() {
		const userInfo = ProjectResource.getUserInfo();

		if (userInfo.siteID === ProjectResource.Site.GG_A) {
			const { settings } = this.props;

			for (const siteID in settings.useSensorTypesGroups) {
				if (this.refUseReceiveFire_GG[siteID] && this.refUseReceiveFire_GG[siteID].current) {
					this.refUseReceiveFire_GG[siteID].current.checked =
						settings.useSensorTypesGroups[siteID].UseFire === "true" && settings.useReceiveSensorTypesGroups[siteID].UseReceiveFire === "true";
				}

				if (this.refUseReceiveEmergencyBell_GG[siteID] && this.refUseReceiveEmergencyBell_GG[siteID].current) {
					this.refUseReceiveEmergencyBell_GG[siteID].current.checked =
						settings.useSensorTypesGroups[siteID].UseEmergencyBell === "true" && settings.useReceiveSensorTypesGroups[siteID].UseReceiveEmergencyBell === "true";
				}

				if (this.refUseReceiveBlackOut_GG[siteID] && this.refUseReceiveBlackOut_GG[siteID].current) {
					this.refUseReceiveBlackOut_GG[siteID].current.checked =
						settings.useSensorTypesGroups[siteID].UseBlackOut === "true" && settings.useReceiveSensorTypesGroups[siteID].UseReceiveBlackOut === "true";
				}

				if (this.refUseReceiveSubmerge_GG[siteID] && this.refUseReceiveSubmerge_GG[siteID].current) {
					this.refUseReceiveSubmerge_GG[siteID].current.checked =
						settings.useSensorTypesGroups[siteID].UseSubmerge === "true" && settings.useReceiveSensorTypesGroups[siteID].UseReceiveSubmerge === "true";
				}

				if (this.refUseReceiveEarthquake_GG[siteID] && this.refUseReceiveEarthquake_GG[siteID].current) {
					this.refUseReceiveEarthquake_GG[siteID].current.checked =
						settings.useSensorTypesGroups[siteID].UseEarthquake === "true" && settings.useReceiveSensorTypesGroups[siteID].UseReceiveEarthquake === "true";
				}
			}
		}
		else {
			let useReceiveFire = "true";
			let useReceivePSM = "true";
			let useReceiveETC = "true";
			let useReceiveSVMS = "true";
			let useReceiveEarthquake = "true";
			let useReceiveStrongWind = "true";
			let useReceiveEnvironment = "true";
			let useReceiveManufacture = "true";
			let useReceiveEmergencyBell = "true";
			let useReceiveSubmerge = "true";
			let useReceiveBlackOut = "true";
	
			if (this.props.settings !== null && this.props.settings !== undefined) {
				let fireData = this.props.settings.properties.UseReceiveFire;
				let psmData = this.props.settings.properties.UseReceivePSM;
				let etcData = this.props.settings.properties.UseReceiveETC;
				let svmsData = this.props.settings.properties.UseReceiveSVMS;
				let earthquakeData = this.props.settings.properties.UseReceiveEarthquake;
				let strongWindData = this.props.settings.properties.UseReceiveStrongWind;
				let environmentData = this.props.settings.properties.UseReceiveEnvironment;
				let manufactureData = this.props.settings.properties.UseReceiveManufacture;
				let emergencyBellData = this.props.settings.properties.UseReceiveEmergencyBell;
				let submergeData = this.props.settings.properties.UseReceiveSubmerge;
				let blackOutData = this.props.settings.properties.UseReceiveBlackOut;
	
				if (fireData) 
					useReceiveFire = fireData;
				if (psmData) 
					useReceivePSM = psmData;
				if (etcData) 
					useReceiveETC = etcData;
				if (svmsData) 
					useReceiveSVMS = svmsData;
				if (earthquakeData)
					useReceiveEarthquake = earthquakeData;
				if (strongWindData)
					useReceiveStrongWind = strongWindData;
				if (environmentData)
					useReceiveEnvironment = environmentData;
				if (manufactureData)
					useReceiveManufacture = manufactureData;
				if (emergencyBellData)
					useReceiveEmergencyBell = emergencyBellData;
				if (submergeData)
					useReceiveSubmerge = submergeData;
				if (blackOutData)
					useReceiveBlackOut = blackOutData;
			}
	
			if (this.refUseReceiveFire.current)
				this.refUseReceiveFire.current.checked = this.props.useSensorTypes?.UseFire === true && useReceiveFire.toLowerCase() === "true" ? true : false;
	
			if (this.refUseReceivePSM.current)
				this.refUseReceivePSM.current.checked = this.props.useSensorTypes?.UsePSM === true && useReceivePSM.toLowerCase() === "true" ? true : false;
	
			if (this.refUseReceiveETC.current)
				this.refUseReceiveETC.current.checked = this.props.useSensorTypes?.UseETC === true && useReceiveETC.toLowerCase() === "true" ? true : false;
	
			if (this.refUseReceiveEnvironment.current)
				this.refUseReceiveEnvironment.current.checked = this.props.useSensorTypes?.UseEnvironment === true && useReceiveEnvironment.toLowerCase() === "true" ? true : false;

			if (this.refUseReceiveManufacture.current)
				this.refUseReceiveManufacture.current.checked = this.props.useSensorTypes?.UseManufacture === true && useReceiveManufacture.toLowerCase() === "true" ? true : false;
	
			if (this.refUseReceiveSVMS.current)
				this.refUseReceiveSVMS.current.checked = this.props.useSensorTypes?.UseSVMS === true && useReceiveSVMS.toLowerCase() === "true" ? true : false;
	
			if (this.refUseEarthquake.current)
				this.refUseEarthquake.current.checked = this.props.useSensorTypes?.UseEarthquake === true && useReceiveEarthquake.toLowerCase() === "true" ? true : false;
	
			if (this.refUseStrongWind.current)
				this.refUseStrongWind.current.checked = this.props.useSensorTypes?.UseStrongWind === true && useReceiveStrongWind.toLowerCase() === "true" ? true : false;			
	
			if (this.refUseEmergencyBell.current)
				this.refUseEmergencyBell.current.checked = this.props.useSensorTypes?.UseEmergencyBell === true && useReceiveEmergencyBell.toLowerCase() === "true" ? true : false;			
	
			if (this.refUseSubmerge.current)
				this.refUseSubmerge.current.checked = this.props.useSensorTypes?.UseSubmerge === true && useReceiveSubmerge.toLowerCase() === "true" ? true : false;			
	
			if (this.refUseBlackOut.current)
				this.refUseBlackOut.current.checked = this.props.useSensorTypes?.UseBlackOut === true && useReceiveBlackOut.toLowerCase() === "true" ? true : false;			
		}
	}

	onChangeReceiveFire = (e, siteID) => {
		const value = e.checked.toString();
		if (!siteID && this.props.settings.properties.UseReceiveFire === value) {
			return;
        }

		if (siteID && siteID >= ProjectResource.Site.GG_B && siteID <= ProjectResource.Site.GG_H) {
			this.props.settings.useReceiveSensorTypesGroups[siteID].UseReceiveFire = value;
		}
		else {
			this.props.settings.properties.UseReceiveFire = value;
		}

		this.props.onChangeNeedToSave();
	}

	onChangeReceivePSM = (e) => {
		const value = e.checked.toString();
		if (this.props.settings.properties.UseReceivePSM === value) {
			return;
        }
		this.props.settings.properties.UseReceivePSM = value;
		this.props.onChangeNeedToSave();
	}

	onChangeReceiveETC = (e) => {
		const value = e.checked.toString();
		if (this.props.settings.properties.UseReceiveETC === value) {
			return;
        }
		this.props.settings.properties.UseReceiveETC = value;
		this.props.onChangeNeedToSave();
	}

	onChangeReceiveEnvironment = (e) => {
		const value = e.checked.toString();
		if (this.props.settings.properties.UseReceiveEnvironment === value) {
			return;
		}
		this.props.settings.properties.UseReceiveEnvironment = value;
		this.props.onChangeNeedToSave();
	}

	onChangeReceiveManufacture = (e) => {
		const value = e.checked.toString();
		if (this.props.settings.properties.UseReceiveManufacture === value) {
			return;
		}
		this.props.settings.properties.UseReceiveManufacture = value;
		this.props.onChangeNeedToSave();
	}

	onChangeReceiveSVMS = (e) => {
		const value = e.checked.toString();
		if (this.props.settings.properties.UseReceiveSVMS === value) {
			return;
        }
		this.props.settings.properties.UseReceiveSVMS = value;
		this.props.onChangeNeedToSave();
	}

	onChangeReceiveEarthquake = (e, siteID) => {
		const value = e.checked.toString();
		if (!siteID && this.props.settings.properties.UseReceiveEarthquake === value) {
			return;
        }

		if (siteID && siteID >= ProjectResource.Site.GG_B && siteID <= ProjectResource.Site.GG_H) {
			this.props.settings.useReceiveSensorTypesGroups[siteID].UseReceiveEarthquake = value;
		}
		else {
			this.props.settings.properties.UseReceiveEarthquake = value;
		}

		this.props.onChangeNeedToSave();
	}

	onChangeReceiveStrongWind = (e) => {
		const value = e.checked.toString();
		if (this.props.settings.properties.UseReceiveStrongWind === value) {
			return;
        }
		this.props.settings.properties.UseReceiveStrongWind = value;
		this.props.onChangeNeedToSave();
	}

	onChangeReceiveEmergencyBell = (e, siteID) => {
		const value = e.checked.toString();
		if (!siteID && this.props.settings.properties.UseReceiveEmergencyBell === value) {
			return;
        }

		if (siteID && siteID >= ProjectResource.Site.GG_B && siteID <= ProjectResource.Site.GG_H) {
			this.props.settings.useReceiveSensorTypesGroups[siteID].UseReceiveEmergencyBell = value;
		}
		else {
			this.props.settings.properties.UseReceiveEmergencyBell = value;
		}

		this.props.onChangeNeedToSave();
	}

	onChangeReceiveSubmerge = (e, siteID) => {
		const value = e.checked.toString();
		if (!siteID && this.props.settings.properties.UseReceiveSubmerge === value) {
			return;
        }

		if (siteID && siteID >= ProjectResource.Site.GG_B && siteID <= ProjectResource.Site.GG_H) {
			this.props.settings.useReceiveSensorTypesGroups[siteID].UseReceiveSubmerge = value;
		}
		else {
			this.props.settings.properties.UseReceiveSubmerge = value;
		}

		this.props.onChangeNeedToSave();
	}

	onChangeReceiveBlackOut = (e, siteID) => {
		const value = e.checked.toString();
		if (!siteID && this.props.settings.properties.UseReceiveBlackOut === value) {
			return;
        }

		if (siteID && siteID >= ProjectResource.Site.GG_B && siteID <= ProjectResource.Site.GG_H) {
			this.props.settings.useReceiveSensorTypesGroups[siteID].UseReceiveBlackOut = value;
		}
		else {
			this.props.settings.properties.UseReceiveBlackOut = value;
		}

		this.props.onChangeNeedToSave();
	}

	selectReAlarm = (mode) => {
		if (mode === SettingsResource.reAlarm.ReAlarm) {
			$('#timeTrem').attr("disabled", true);
			$('#timeUnit').attr("disabled", true);

			if (this.props.settings !== null && this.props.settings !== undefined)
				this.props.settings.properties.ReAlarm = mode + ",0,0";
		} else if (mode === SettingsResource.reAlarm.NoAlarmTerm) {
			$('#timeTrem').attr("disabled", false);
			$('#timeUnit').attr("disabled", false);

			let timeTrem = $('#timeTrem').val();
			let timeUnit = $('#timeUnit').val();

			if (this.props.settings !== null && this.props.settings !== undefined)
				this.props.settings.properties.ReAlarm = mode + "," + timeUnit + "," + timeTrem;
		} else if (mode === SettingsResource.reAlarm.NoAlarm) {
			$('#timeTrem').attr("disabled", true);
			$('#timeUnit').attr("disabled", true);

			if (this.props.settings !== null && this.props.settings !== undefined)
				this.props.settings.properties.ReAlarm = mode + ",0,0";
		}
    }
	/*
	initReAlarmSet() {
		let reAlarmValue = "0,0,0";

		if (this.props.settings !== null && this.props.settings !== undefined) {
			let data = this.props.settings.properties.reAlarm;

			if (data !== "" && data !== null && data !== undefined) {
				reAlarmValue = data;
            }
		}

		let arrReAlarm = reAlarmValue.split(",");	// 첫번째: 재알람/* 후 재알람/미알람, 두번째: 초/분/시 단위, 세번째: 시간값

		if (arrReAlarm.length !== 3) {
			reAlarmValue = "0,0,0";
			arrReAlarm = reAlarmValue.split(",");
		}

		if (arrReAlarm[0] === SettingsResource.reAlarm.ReAlarm) {
			this.refStgAlm01.current.click();
		} else if (arrReAlarm[0] === SettingsResource.reAlarm.NoAlarmTerm) {
			this.refStgAlm02.current.click();
		} else if (arrReAlarm[0] === SettingsResource.reAlarm.NoAlarm) {
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
			let data = this.props.settings.properties.reAlarm;

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
		this.props.settings.properties.reAlarm = reAlarm;
		*/
	}

	onChangeTimeUnit = (e) => {
		let value = e.value;

		let reAlarmValue = "0,0,0";

		if (this.props.settings !== null && this.props.settings !== undefined) {
			let data = this.props.settings.properties.ReAlarm;

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
		this.props.settings.properties.ReAlarm = reAlarm;
		this.props.onChangeNeedToSave();
	}

	onChangeEventInfoDisplayTerm = (mode) => {

		if (this.props.settings === null || this.props.settings === undefined)
			return;

		this.props.settings.properties.EventInfoDisplayTerm = mode;
		this.props.onChangeNeedToSave();
    }

	selectDisplayAlarm = (mode) => {
		if (mode === null || mode === undefined || this.props.settings.properties.MoveDisplayAlarm === mode)
			return;

		if (mode === SettingsResource.moveDisplayAlarm.currentDisplay || 
			mode === SettingsResource.moveDisplayAlarm.moveAlarm ||
			mode === SettingsResource.moveDisplayAlarm.firstAlarm ||
			mode === SettingsResource.moveDisplayAlarm.lastAlarm) {
			this.props.settings.properties.MoveDisplayAlarm = mode;
			this.props.onChangeNeedToSave();
		} 
	}

	selectUsePoiFocus = (use) => {
		if (use === null || use === undefined || this.props.settings.properties.UsePoiFocus === use)
			return;

		if (use === SettingsResource.usePoiFocus.on ||
			use === SettingsResource.usePoiFocus.off) {
			this.props.settings.properties.UsePoiFocus = use;
			this.props.onChangeNeedToSave();
        }
    }

	selectUseAlarmArea = (use) => {
		if (use === null || use === undefined || this.props.settings.properties.UseAlarmArea === use)
			return;

		if (use === SettingsResource.useAlarmArea.on ||
			use === SettingsResource.useAlarmArea.off) {
			this.props.settings.properties.UseAlarmArea = use;
			this.props.onChangeNeedToSave();
        }
    }

	onChangeAlarmBroadcast = (e) => {
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

		this.props.settings.properties.UseAlarmBroadcast = use.toString();
		this.props.onChangeNeedToSave();
		this.setAlarmBroadcast();
	}

	setAlarmBroadcast() {
		let useAlarmBroadcast = this.props.settings.properties.UseAlarmBroadcast;

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
	}

	getReceiveTypeUI = () => {
		const userInfo = ProjectResource.getUserInfo();

		const receiveTypeUI = [];

		if (userInfo.siteID === ProjectResource.Site.GG_A) {
			const ui = this.getReceiveTypeUI_GG();
			receiveTypeUI.push(ui);
		}
		else {
			if (this.props.useSensorTypes?.UseFire === true) {
				receiveTypeUI.push(<li key={"receiveTypeUI_Fire"}><p>{i18n.t('facilityType.화재')}</p><input ref={(el) => (this.refUseReceiveFire = { current: el })} type="checkbox" name="stgAlt" id="stgAlt01" onChange={(e) => this.onChangeReceiveFire(e.target)} /><label htmlFor="stgAlt01">{i18n.t('setting.monitoring3D.수신')}</label></li>);
			}

			if (this.props.useSensorTypes?.UsePSM === true) {
				receiveTypeUI.push(<li key={"receiveTypeUI_PSM"}><p>{i18n.t('facilityType.누출')}</p><input ref={(el) => (this.refUseReceivePSM = { current: el })} type="checkbox" name="stgAlt" id="stgAlt02" onChange={(e) => this.onChangeReceivePSM(e.target)} /><label htmlFor="stgAlt02">{i18n.t('setting.monitoring3D.수신')}</label></li>);
			}

			if (this.props.useSensorTypes?.UseETC === true) {
				receiveTypeUI.push(<li key={"receiveTypeUI_ETC"}><p>{i18n.t('facilityType.기타')}</p><input ref={(el) => (this.refUseReceiveETC = { current: el })} type="checkbox" name="stgAlt" id="stgAlt03" onChange={(e) => this.onChangeReceiveETC(e.target)} /><label htmlFor="stgAlt03">{i18n.t('setting.monitoring3D.수신')}</label></li>);
			}
	
			if (this.props.useSensorTypes?.UseEnvironment === true) {
				receiveTypeUI.push(<li key={"receiveTypeUI_Environment"}><p>{i18n.t('facilityType.환경설비')}</p><input ref={(el) => (this.refUseReceiveEnvironment = { current: el })} type="checkbox" name="stgAlt" id="stgAlt07" onChange={(e) => this.onChangeReceiveEnvironment(e.target)} /><label htmlFor="stgAlt07">{i18n.t('setting.monitoring3D.수신')}</label></li>);
			}

			if (this.props.useSensorTypes?.UseManufacture === true) {
				receiveTypeUI.push(<li key={"receiveTypeUI_Manufacture"}><p>{i18n.t('facilityType.제조설비')}</p><input ref={(el) => (this.refUseReceiveManufacture = { current: el })} type="checkbox" name="stgAlt" id="stgAlt08" onChange={(e) => this.onChangeReceiveManufacture(e.target)} /><label htmlFor="stgAlt08">{i18n.t('setting.monitoring3D.수신')}</label></li>);
			}
	
			if (this.props.useSensorTypes?.UseSVMS === true) {
				receiveTypeUI.push(<li key={"receiveTypeUI_SVMS"}><p>{i18n.t('setting.monitoring3D.SVMS')}</p><input ref={(el) => (this.refUseReceiveSVMS = { current: el })} type="checkbox" name="stgAlt" id="stgAlt04" onChange={(e) => this.onChangeReceiveSVMS(e.target)} /><label htmlFor="stgAlt04">{i18n.t('setting.monitoring3D.수신')}</label></li>);
			}

			if (this.props.useSensorTypes?.UseEarthquake === true) {
				receiveTypeUI.push(<li key={"receiveTypeUI_Earthquake"}><p>{i18n.t('facilityType.지진')}</p><input ref={(el) => (this.refUseEarthquake = { current: el })} type="checkbox" name="stgAlt" id="stgAlt05" onChange={(e) => this.onChangeReceiveEarthquake(e.target)} /><label htmlFor="stgAlt05">{i18n.t('setting.monitoring3D.수신')}</label></li>);
			}
			
			if (this.props.useSensorTypes?.UseStrongWind === true) {
				receiveTypeUI.push(<li key={"receiveTypeUI_StrongWind"}><p>{i18n.t('facilityType.강풍')}</p><input ref={(el) => (this.refUseStrongWind = { current: el })} type="checkbox" name="stgAlt" id="stgAlt06" onChange={(e) => this.onChangeReceiveStrongWind(e.target)} /><label htmlFor="stgAlt06">{i18n.t('setting.monitoring3D.수신')}</label></li>);
			}

			if (this.props.useSensorTypes?.UseEmergencyBell === true) {
				receiveTypeUI.push(<li key={"receiveTypeUI_EmergencyBell"}><p>{i18n.t('facilityType.비상벨')}</p><input ref={(el) => (this.refUseEmergencyBell = { current: el })} type="checkbox" name="stgAlt" id="stgAlt07" onChange={(e) => this.onChangeReceiveEmergencyBell(e.target)} /><label htmlFor="stgAlt07">{i18n.t('setting.monitoring3D.수신')}</label></li>);
			}

			if (this.props.useSensorTypes?.UseSubmerge === true) {
				receiveTypeUI.push(<li key={"receiveTypeUI_Submerge"}><p>{i18n.t('facilityType.침수')}</p><input ref={(el) => (this.refUseSubmerge = { current: el })} type="checkbox" name="stgAlt" id="stgAlt08" onChange={(e) => this.onChangeReceiveSubmerge(e.target)} /><label htmlFor="stgAlt08">{i18n.t('setting.monitoring3D.수신')}</label></li>);
			}

			if (this.props.useSensorTypes?.UseBlackOut === true) {
				receiveTypeUI.push(<li key={"receiveTypeUI_BlackOut"}><p>{i18n.t('facilityType.정전')}</p><input ref={(el) => (this.refUseBlackOut = { current: el })} type="checkbox" name="stgAlt" id="stgAlt09" onChange={(e) => this.onChangeReceiveBlackOut(e.target)} /><label htmlFor="stgAlt09">{i18n.t('setting.monitoring3D.수신')}</label></li>);
			}
		}

		return receiveTypeUI;
	}

	getReceiveTypeUI_GG = () => {

		const { settings } = this.props;

		let ui = [];
		let uiGroups = {
			[ProjectResource.Site.GG_B]: [],
			[ProjectResource.Site.GG_D]: [],
			[ProjectResource.Site.GG_E]: [],
			[ProjectResource.Site.GG_F]: [],
			[ProjectResource.Site.GG_G]: [],
			[ProjectResource.Site.GG_H]: []
		};

		const generateUIForSite = (siteID, uiList) => {
			if (settings.useSensorTypesGroups && settings.useSensorTypesGroups[siteID]?.UseFire) {
				uiList.push(
					<li key={`receiveTypeUI_Fire_${siteID}`}>
						<p>{i18n.t('facilityType.화재')}</p>
						<input ref={(el) => (this.refUseReceiveFire_GG[siteID] = { current: el })} type="checkbox" name="stgAlt" id={`stgAlt01_${siteID}`} onChange={(e) => this.onChangeReceiveFire(e.target, siteID)} />
					</li>
				);
			}
			
			if (settings.useSensorTypesGroups && settings.useSensorTypesGroups[siteID]?.UseEmergencyBell) {
				uiList.push(
					<li key={`receiveTypeUI_EmergencyBell_${siteID}`}>
						<p>{i18n.t('facilityType.비상벨')}</p>
						<input ref={(el) => (this.refUseReceiveEmergencyBell_GG[siteID] = { current: el })} type="checkbox" name="stgAlt" id={`stgAlt01_${siteID}`} onChange={(e) => this.onChangeReceiveEmergencyBell(e.target, siteID)} />
					</li>
				);
			}
			
			if (settings.useSensorTypesGroups && settings.useSensorTypesGroups[siteID]?.UseBlackOut) {
				uiList.push(
					<li key={`receiveTypeUI_BlackOut_${siteID}`}>
						<p>{i18n.t('facilityType.정전')}</p>
						<input ref={(el) => (this.refUseReceiveBlackOut_GG[siteID] = { current: el })} type="checkbox" name="stgAlt" id={`stgAlt01_${siteID}`} onChange={(e) => this.onChangeReceiveBlackOut(e.target, siteID)} />
					</li>
				);
			}
			
			if (settings.useSensorTypesGroups && settings.useSensorTypesGroups[siteID]?.UseSubmerge) {
				uiList.push(
					<li key={`receiveTypeUI_Submerge_${siteID}`}>
						<p>{i18n.t('facilityType.침수')}</p>
						<input ref={(el) => (this.refUseReceiveSubmerge_GG[siteID] = { current: el })} type="checkbox" name="stgAlt" id={`stgAlt05_${siteID}`} onChange={(e) => this.onChangeReceiveSubmerge(e.target, siteID)} />
					</li>
				);
			}
			
			if (settings.useSensorTypesGroups && settings.useSensorTypesGroups[siteID]?.UseEarthquake) {
				uiList.push(
					<li key={`receiveTypeUI_Earthquake_${siteID}`}>
						<p>{i18n.t('facilityType.지진')}</p>
						<input ref={(el) => (this.refUseReceiveEarthquake_GG[siteID] = { current: el })} type="checkbox" name="stgAlt" id={`stgAlt05_${siteID}`} onChange={(e) => this.onChangeReceiveEarthquake(e.target, siteID)} />
					</li>
				);
			}
		};

		const sites = ProjectResource.sites;

		if (sites.length > 0) {
			for (const site of sites) {
				if (uiGroups[site.id]) {
					generateUIForSite(site.id, uiGroups[site.id]);
				}
			}

			for (const site of sites) {
				if (uiGroups[site.id]) {
					ui.push(
						<li key={`receiveTypeGG_${site.id}`}>
							<div>{site.siteName.trim()}</div>
							<ul>
								{uiGroups[site.id]}
							</ul>
						</li>
					)
				}
			}
		}

		return <li key='receiveTypeGG' style={{ width: '100%' }}>
					<ul className='receiveTypeGG'>
						{ui}
					</ul>
				</li>;
	}

	useEquipZoneArea() {
        const userInfo = ProjectResource.getUserInfo();
        return (userInfo?.options?.ui?.useEquipZoneArea === true);
    }

	getUseAlarmAreaUI = () => {
		let useAlarmAreaUI = null;

		if (this.useEquipZoneArea() === true) {
			useAlarmAreaUI = (
				<div className={'stgName' + " " + 'settingRadio'}>
					<h5>{i18n.t('setting.monitoring3D.이벤트 영역 표시')}</h5>
					<span className={'stgTltp'} data-tooltip={i18n.t('setting.monitoring3D.이벤트 관련 영역 표시 여부를 설정 합니다')}></span>
					<ul className={'stgAlm' + " " + 'settingRadio'}>
						<li>
							<input type="radio" ref={this.refUseAlarmAreaOn} name="useAlarmArea" id="useAlarmAreaOn" onChange={() => this.selectUseAlarmArea(SettingsResource.useAlarmArea.on)} />
							<label htmlFor="useAlarmAreaOn">{i18n.t('common.사용')}</label>
						</li>
						<li>
							<input type="radio" ref={this.refUseAlarmAreaOff} name="useAlarmArea" id="useAlarmAreaOff" onChange={() => this.selectUseAlarmArea(SettingsResource.useAlarmArea.off)} />
							<label htmlFor="useAlarmAreaOff">{i18n.t('common.사용안함')}</label>
						</li>
					</ul>
				</div>
			);
		}

		return useAlarmAreaUI;
	}

	initSoundOffTime() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let alarmSoundOffTime = this.props.settings.properties.AlarmSoundOffTime;

		if (alarmSoundOffTime === null || alarmSoundOffTime === undefined || alarmSoundOffTime === "0") {
			this.refSoundOffTimeUse.current.checked = false;
			this.refSoundOffTime.current.disabled = true;
			this.refSoundOffTime.current.value = "";
		}
		else {
			this.refSoundOffTimeUse.current.checked = true;
			this.refSoundOffTime.current.disabled = false;
			this.refSoundOffTime.current.value = alarmSoundOffTime;
        }
	}

	onChangeCheck = (e) => {
		let value = e.target.value;
		let inputValue = value.replace(/[^0-9\b .]/g, '');

		if (!$.isNumeric(inputValue)) {
			this.refSoundOffTime.current.value = "";
		} else {
			//let num = parseFloat(inputValue);
			//inputValue = num.toString();
			this.refSoundOffTime.current.value = inputValue;
		}
	}

	onBlurSoundOffTime = (e) => {
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

		this.refSoundOffTime.current.value = value;
		this.props.settings.properties.AlarmSoundOffTime = value;

		this.props.onChangeNeedToSave();
	}

	onChangeSoundOffTimeUse = () => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = this.refSoundOffTime.current.value;
		let use = this.refSoundOffTimeUse.current.checked;
		let soundOffTime = "10";

		if (use === true && (value === null || value === undefined || value === "" || value === "0")) {
			this.refSoundOffTime.current.value = soundOffTime;
			this.refSoundOffTime.current.disabled = false;
		}
		else if (use === true) {
			soundOffTime = value;
			this.refSoundOffTime.current.disabled = false;
		}
		else if (use === false) {
			soundOffTime = "0";
			this.refSoundOffTime.current.disabled = true;
        }
			
		this.props.settings.properties.AlarmSoundOffTime = soundOffTime;

		this.props.onChangeNeedToSave();
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

	render() {
		//const reAlarmUI = this.reAlarmUI();
		const receiveTypeUI = this.getReceiveTypeUI();
		const useAlarmAreaUI = this.getUseAlarmAreaUI();
		
		return (
			<>
				<div className={'stgList'}>
					{/*
					<div className={'stgName'}>
						<h5>오작동 처리 센서의 재알람 기준(기본값)</h5>
						<span className={'stgTltp'} data-tooltip="오작동 처리 센서의 재알람 기준을 설정 합니다."></span>
						<ul className={newStyles.stgAlm}>
							<li>
								<input ref={this.refStgAlm01} type="radio" name="stgAlm" id="stgAlm01" onChange={() => this.selectReAlarm(SettingsResource.reAlarm.ReAlarm)} />
								<label htmlFor="stgAlm01">모두 재알람</label>
							</li>
							<li>
								<input ref={this.refStgAlm02} type="radio" name="stgAlm" id="stgAlm02" onChange={() => this.selectReAlarm(SettingsResource.reAlarm.NoAlarmTerm)} />
								<input ref={this.refTimeTrem} type="text" className={'settingInput'} name="" id="timeTrem" onChange={this.onChangeNumCheck} onBlur={(e) => this.onBlurCheck(e.target)} />
								<select ref={this.refTimeUnit} name="" id="timeUnit" className={'dslSel'} onChange={(e) => this.onChangeTimeUnit(e.target)} >
									<option value={SettingsResource.timeUnit.second} >초</option>
									<option value={SettingsResource.timeUnit.minute} >분</option>
									<option value={SettingsResource.timeUnit.hour} >시</option>
								</select>
								<label htmlFor="stgAlm02">동안 미알람</label>
							</li>
							<li>
								<input ref={this.refStgAlm03} type="radio" name="stgAlm" id="stgAlm03" onChange={() => this.selectReAlarm(SettingsResource.reAlarm.NoAlarm)} />
								<label htmlFor="stgAlm03">계속 미알람</label>
							</li>
						</ul>
					</div>
					*/}

					{/*<div className={newStyles.stgHalf}>*/}
					<div className={'stgName'}>
						<div>
							<div className={'stgName' + " " + 'bdNon' + " " + 'mb0'}>
								<h5>{i18n.t('setting.monitoring3D.유형별 알람 수신 설정')}</h5>
								<span className={'stgTltp'} data-tooltip={i18n.t('setting.monitoring3D.유형별 알람을 설정 합니다')}></span>
							</div>
							<ul className={'stgAlt'}>
								{receiveTypeUI}
							</ul>
						</div>
						{/*
						<div>
							<div className={'stgName' + " " + newStyles.bdNon + " " + 'mb0'}>
								<h5>SOP 실행</h5>
								<span className={'stgTltp'} data-tooltip="SOP 실행을 설정 합니다."></span>
							</div>
							<div className={'stgmTo' + " " + newDefaults.mt0}>
								<span>주의 : </span>
								<select ref={this.refExeCautionSOP} name="" id="" className={'dslSel' + " " + newDefaults.h28} onChange={this.onChangeExeCautionSOP}>
									<option value={SettingsResource.ExeSOPMode.false}>센서 감지시 SOP 자동실행 안함</option>
									<option value={SettingsResource.ExeSOPMode.exe}>센서 감지시 SOP 자동 열기 및 실행</option>
								</select>
							</div>
							<div className={'stgmTo' + " " + newDefaults.mt5}>
								<span>경계 : </span>
								<select ref={this.refExeAlartSOP} name="" id="" className={'dslSel' + " " + newDefaults.h28} onChange={this.onChangeExeAlartSOP}>
									<option value={SettingsResource.ExeSOPMode.false} >센서 감지시 SOP 자동실행 안함</option>
									<option value={SettingsResource.ExeSOPMode.exe} >센서 감지시 SOP 자동 열기 및 실행</option>
								</select>
							</div>
							<div className={'stgmTo' + " " + newDefaults.mt5}>
								<span>심각 : </span>
								<select ref={this.refExeSeriousSOP} name="" id="" className={'dslSel' + " " + newDefaults.h28} onChange={this.onChangeExeSeriousSOP}>
									<option value={SettingsResource.ExeSOPMode.false} >센서 감지시 SOP 자동실행 안함</option>
									<option value={SettingsResource.ExeSOPMode.exe} >센서 감지시 SOP 자동 열기 및 실행</option>
								</select>
							</div>
						</div>
						*/}
					</div>

					<div className={'stgName'}>
						<h5>{i18n.t('setting.monitoring3D.이벤트 자동 화면 전환')}</h5>
						<span className={'stgTltp'} data-tooltip={i18n.t('setting.monitoring3D.이벤트시 자동 화면 전환 여부를 설정 합니다.')}></span>
						<ul className={'stgAlm' + " " + 'settingRadio'}>
							<li>
								<input ref={this.refDisAlm01} type="radio" name="disAlm" id="disAlm01" onChange={() => this.selectDisplayAlarm(SettingsResource.moveDisplayAlarm.currentDisplay)} />
								<label htmlFor="disAlm01">{i18n.t('setting.monitoring3D.현재화면 유지')}</label>
							</li>
							{/*
							<li>
								<input ref={this.refDisAlm02} type="radio" name="disAlm" id="disAlm02" onChange={() => this.selectDisplayAlarm(SettingsResource.moveDisplayAlarm.moveAlarm)} />
								<label htmlFor="disAlm02">알람마다 화면 이동</label>
							</li>
							*/}
							<li>
								<input ref={this.refDisAlm03} type="radio" name="disAlm" id="disAlm03" onChange={() => this.selectDisplayAlarm(SettingsResource.moveDisplayAlarm.firstAlarm)} />
								<label htmlFor="disAlm03">{i18n.t('setting.monitoring3D.첫번째 알람 화면으로 이동')}</label>
							</li>
							<li>
								<input ref={this.refDisAlm04} type="radio" name="disAlm" id="disAlm04" onChange={() => this.selectDisplayAlarm(SettingsResource.moveDisplayAlarm.lastAlarm)} />
								<label htmlFor="disAlm04">{i18n.t('setting.monitoring3D.마지막 알람 화면으로 이동')}</label>
							</li>
						</ul>
					</div>

					<div className={'stgName'}>
						<h5>{i18n.t('setting.monitoring3D.알람 방송')}</h5>
						<span className={'stgTltp'} data-tooltip={i18n.t('setting.monitoring3D.알람 발생시 자동으로 재난방송을 실시합니다.')}></span>
						<ul className={'stgAlm' + " " + 'settingRadio'}>
							<li>
								<input type="radio" ref={this.refUseBroadcast} name="" id="UseBroadcast01" onChange={this.onChangeAlarmBroadcast} />
								<label htmlFor="UseBroadcast01">{i18n.t('common.사용')}</label>
							</li>
							<li>
								<input type="radio" ref={this.refNotUseBroadcast} name="" id="UseBroadcast02" onChange={this.onChangeAlarmBroadcast} />
								<label htmlFor="UseBroadcast02">{i18n.t('common.사용안함')}</label>
							</li>
						</ul>
					</div>

					<div className={'stgName' + " " + 'settingRadio'}>
						<h5>{i18n.t('setting.monitoring3D.이벤트 포커싱')}</h5>
						<span className={'stgTltp'} data-tooltip={i18n.t('setting.monitoring3D.이벤트 포커싱')}></span>
						<ul className={'stgAlm' + " " + 'settingRadio'}>
							<li>
								<input type="radio" ref={this.refUsePoiFocusOn} name="usePOIFocus" id="usePoiFocusOn" onChange={() => this.selectUsePoiFocus(SettingsResource.usePoiFocus.on)} />
								<label htmlFor="usePoiFocusOn">{i18n.t('common.사용')}</label>
							</li>
							<li>
								<input type="radio" ref={this.refUsePoiFocusOff} name="usePOIFocus" id="usePoiFocusOff" onChange={() => this.selectUsePoiFocus(SettingsResource.usePoiFocus.off)} />
								<label htmlFor="usePoiFocusOff">{i18n.t('common.사용안함')}</label>
							</li>
						</ul>
					</div>

					<div className={'stgName'}>
						<h5>{i18n.t('setting.monitoring3D.알람소리 자동OFF')}</h5>
						<span className={'stgTltp'} data-tooltip={i18n.t('setting.monitoring3D.알람 발생시 몇 초 후에 자동으로 알람소리 OFF 설정')}></span>
						<input type="text" ref={this.refSoundOffTime} className={'settingInput'} name="" id="" onChange={(e) => this.onChangeCheck(e)} onBlur={(e) => this.onBlurSoundOffTime(e.target)} /><span className={'white'}> {i18n.t('setting.monitoring3D.초')} &nbsp;&nbsp;</span>
						<span className={'white'}>&nbsp;&nbsp;{i18n.t('setting.monitoring3D.자동 OFF 사용')} &nbsp;&nbsp;</span><input type="checkbox" ref={this.refSoundOffTimeUse} name="" id="" onChange={this.onChangeSoundOffTimeUse} />
					</div>

					{useAlarmAreaUI}


					{/* .TODO: 고도화 내용으로 임시 주석처리
					<div className={newStyles.stgHalf}>
						<div>
							<div className={'stgName' + " " + newStyles.bdNon + " " + 'mb0' + " " + newDefaults.pb0}>
								<h5>이벤트 정보창 표출 리스트 기간설정</h5>
								<span className={'stgTltp'} data-tooltip="이벤트 정보창 표출 리스트 기간을 설정 합니다."></span>
							</div>
							<ul className={newStyles.stgAlm + " " + newDefaults.mt0 + " " + newDefaults.mb20}>
								<li><input ref={this.eventTermDay} type="radio" name="stgDate" id="stgDate01" onChange={() => this.onChangeEventInfoDisplayTerm(SettingsResource.eventInfoDisplayTerm.day)} /><label htmlFor="stgDate01">하루</label></li>
								<li><input ref={this.eventTermWeek} type="radio" name="stgDate" id="stgDate02" onChange={() => this.onChangeEventInfoDisplayTerm(SettingsResource.eventInfoDisplayTerm.week)} /><label htmlFor="stgDate02">일주일</label></li>
								<li><input ref={this.eventTermMonth} type="radio" name="stgDate" id="stgDate03" onChange={() => this.onChangeEventInfoDisplayTerm(SettingsResource.eventInfoDisplayTerm.month)} /><label htmlFor="stgDate03">한달</label></li>
							</ul>
							<div className={'stgName' + " " + newStyles.bdNon + " " + 'mb0' + " " + newDefaults.pb0}>
								<h5>종료/오탐지시 화면 이동</h5>
								<span className={'stgTltp'} data-tooltip="종료/오탐지시 화면 이동을 설정 합니다."></span>
							</div>
							<ul className={newStyles.stgAlm + " " + newDefaults.mt0}>
								<li><input ref={this.UseScreenMoveTrue} type="radio" name="stgDply" id="stgDply01" onChange={() => this.onChangeUseScreenMove("true")} /><label htmlFor="stgDply01">초기화면으로 이동</label></li>
								<li><input ref={this.UseScreenMoveFalse} type="radio" name="stgDply" id="stgDply02" onChange={() => this.onChangeUseScreenMove("false")} /><label htmlFor="stgDply02">현재화면 유지</label></li>
							</ul>
						</div>
						<div>
							<div className={'stgName' + " " + newStyles.bdNon + " " + 'mb0' + " " + newDefaults.pb0}>
								<h5>훈련모드</h5>
									<span className={'stgTltp'} data-tooltip="훈련모드를 설정 합니다."></span>
							</div>
							<ul className={newStyles.stgMode}>
								<li><input ref={this.refUseTrainingMode} type="checkbox" name="stgMode" id="stgMode01" onChange={(e) => this.onChangeUseTrainingMode(e.target)} /><label htmlFor="stgMode01">모든 센서 신호 수신시 훈련모드로 사용</label></li>
								<li><input ref={this.refUseWaterMark} type="checkbox" name="stgMode" id="stgMode02" onChange={(e) => this.onChangeUseWaterMark(e.target)} /><label htmlFor="stgMode02">훈련모드 워터마크 사용</label></li>
								<li><input ref={this.refUseHeadMessage} type="checkbox" name="stgMode" id="stgMode03" onChange={(e) => this.onChangeUseHeadMessage(e.target)} /><label htmlFor="stgMode03">전파 메시지 앞머리 문구 지정</label><input ref={this.refHeadMessage} type="text" name="" id="headMessage" className="" onChange={(e) => this.onChangeHeadMessage(e.target)} /></li>
							</ul>
						</div>
					</div>
					*/}

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
