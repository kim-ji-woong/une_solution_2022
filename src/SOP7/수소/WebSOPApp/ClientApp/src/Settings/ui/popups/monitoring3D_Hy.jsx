import React, { Component } from 'react';
import { Container } from 'reactstrap';
import $ from 'jquery';
import SelectReceiver from './selectReceiver';
import ConfirmDialog from '../../../Common/ui/confirmHydrogen';

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
import tooltip_icon from '../../../Common/img/imghydrogen/main/tooltip_icon.svg';

class Monitoring3D_Hy extends Component {
    constructor(props) {
        super(props);

		this.state = {
			tabMenu: i18n.t('common.일반'),
		}

		this.props = props;
	}

	setContentUI = () => {
		let contentUI = null;

		if (this.state.tabMenu === i18n.t('common.일반')) {
			contentUI = (
				<NormalTab_Hy key="NormalTab" settings={this.props.settings} onChangeNeedToSave={this.props.onChangeNeedToSave} selectedSiteID={this.props.selectedSiteID} />
			);
		}
		//else if (this.state.tabMenu === i18n.t('setting.monitoring3D.초기상황전파관리')) {
		//	contentUI = (
		//		<SpreadTab key="SpreadTab" settings={this.props.settings} buildingGroupList={this.props.buildingGroupList}
		//			spreadMessages={this.props.spreadMessages} teamTreeDatas={this.props.teamTreeDatas} teams={this.props.teams}
		//			members={this.props.members} useSensorTypes={this.props.useSensorTypes} onChangeNeedToSave={this.props.onChangeNeedToSave}
		//			selectedSiteID={this.props.selectedSiteID} />
		//	);
		//}
		//else if (this.state.tabMenu === i18n.t('setting.monitoring3D.센서감지관리')) {
		//	contentUI = (
		//		<DetectionTab key="DetectionTab" settings={this.props.settings} useSensorTypes={this.props.useSensorTypes}
		//			onChangeNeedToSave={this.props.onChangeNeedToSave} selectedSiteID={this.props.selectedSiteID} />
		//	);
		//}

		return contentUI;
	}

	render() {
		const contentUI = this.setContentUI();

		return (
			<React.Fragment key='monitoring_3d'>
				<Monitoring3DComponent>
					<span className={'stgScroll'}>
						{contentUI}
					</span>
				</Monitoring3DComponent>
			</React.Fragment>
        );
    }
}

export default withTranslation()(Monitoring3D_Hy);

class NormalTab_Hy extends Component {
	static MoveDisplayAlarm = {
		current: 0,
		move: 3
    }

	static AlarmAutoEnd = {
		keep: 0,
		end24: 1
    }

	constructor(props) {
		super(props);

		this.refIdleTime = React.createRef();

		this.refUseReceiveH2 = React.createRef();
		this.refUseReceiveTemp = React.createRef();
		this.refUseReceiveFlow = React.createRef();
		this.refUseReceiveConductivity = React.createRef();
		this.refUseReceivePressure = React.createRef();
		this.refUseReceiveGAS = React.createRef();

		this.refMoveDisplayAlarm = React.createRef();

		this.refMoveDisplayAlarm0 = React.createRef();
		this.refMoveDisplayAlarm3 = React.createRef();

		this.refAlarmAutoEnd0 = React.createRef();
		this.refAlarmAutoEnd1 = React.createRef();

		this.state = {
			confirmMessage: {
				visible: false,
				title: "",
				messages: [""],
				buttons: [i18n.t('common.확인')],
				onClose: this.onCloseConfirmDialog,
				onClickButton: null,
				titleTooltipShow: true,
				typeTooltipShow: true,
				nameTooltipShow: true,
				tooltipTop: 0,
				tooltipLeft: 0,
			},
		}

		this.props = props;
	}

	componentDidMount() {
		this.init();
	}

	componentDidUpdate(prevProps, prevState) {

	}

	init() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		this.initIdleTime();
		this.initReceiveData();
		this.initMoveDisplayAlarm();
		this.initAlarmAutoEnd();
    }

	initIdleTime = () => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		// 3D 모니터 회전 시간 입력 
		let idleTime = this.props.settings.idleTime;

		if (idleTime === null || idleTime === undefined)
			idleTime = "15";

		// 값에 따라 회전시간 드랍박스 설정
		this.refIdleTime.current.value = idleTime;
	}

	initReceiveData = () => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let useReceiveH2 = this.props.settings.useReceiveH2;	
		let useReceiveTemp = this.props.settings.useReceiveTemp;
		let useReceiveFlow = this.props.settings.useReceiveFlow;
		let useReceiveConductivity = this.props.settings.useReceiveConductivity;
		let useReceivePressure = this.props.settings.useReceivePressure;
		let useReceiveGAS = this.props.settings.useReceiveGAS;

		if (useReceiveH2 === null || useReceiveH2 === undefined)
			useReceiveH2 = "true";
		if (useReceiveTemp === null || useReceiveTemp === undefined)
			useReceiveTemp = "true";
		if (useReceiveFlow === null || useReceiveFlow === undefined)
			useReceiveFlow = "true";
		if (useReceiveConductivity === null || useReceiveConductivity === undefined)
			useReceiveConductivity = "true";
		if (useReceivePressure === null || useReceivePressure === undefined)
			useReceivePressure = "true";
		if (useReceiveGAS === null || useReceiveGAS === undefined)
			useReceiveGAS = "true";

		if (useReceiveH2 === "true") {
			this.refUseReceiveH2.current.checked = true;
        }
		if (useReceiveTemp === "true") {
			this.refUseReceiveTemp.current.checked = true;
		}
		if (useReceiveFlow === "true") {
			this.refUseReceiveFlow.current.checked = true;
		}
		if (useReceiveConductivity === "true") {
			this.refUseReceiveConductivity.current.checked = true;
		}
		if (useReceivePressure === "true") {
			this.refUseReceivePressure.current.checked = true;
		}
		if (useReceiveGAS === "true") {
			this.refUseReceiveGAS.current.checked = true;
		}
	}

	initMoveDisplayAlarm = () => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let moveDisplayAlarm = this.props.settings.moveDisplayAlarm;
		if (moveDisplayAlarm === null || moveDisplayAlarm === undefined)
			moveDisplayAlarm = "3";

		if (moveDisplayAlarm === "0") {
			this.refMoveDisplayAlarm0.current.checked = true;
		}
		else {
			this.refMoveDisplayAlarm3.current.checked = true;
        }
	}

	initAlarmAutoEnd = () => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let alarmAutoEnd = this.props.settings.alarmAutoEnd;
		if (alarmAutoEnd === null || alarmAutoEnd === undefined)
			alarmAutoEnd = "1";

		if (alarmAutoEnd === "0") {
			this.refAlarmAutoEnd0.current.checked = true;
		}
		else {
			this.refAlarmAutoEnd1.current.checked = true;
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

	onClickSelect = () => {
		const monitoringSelect = document.getElementById('monitoringSelect');

		monitoringSelect.classList.toggle('on');		
	}

	onChangeIdleTime = () => {
		// 값 넣기
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = this.refIdleTime.current.value;

		this.props.settings.idleTime = value;
		this.props.onChangeNeedToSave();
	}

	onClickReceive = (type) => {
		if (type === SdmsResource.facilityType.H2) {
			if (this.refUseReceiveH2.current.checked)
				this.props.settings.useReceiveH2 = "true";
			else
				this.props.settings.useReceiveH2 = "false";
		}
		else if (type === SdmsResource.facilityType.Temp) {
			if (this.refUseReceiveTemp.current.checked)
				this.props.settings.useReceiveTemp = "true";
			else
				this.props.settings.useReceiveTemp = "false";
		}
		else if (type === SdmsResource.facilityType.Flow) {
			if (this.refUseReceiveFlow.current.checked)
				this.props.settings.useReceiveFlow = "true";
			else
				this.props.settings.useReceiveFlow = "false";
		}
		else if (type === SdmsResource.facilityType.Conductivity) {
			if (this.refUseReceiveConductivity.current.checked)
				this.props.settings.useReceiveConductivity = "true";
			else
				this.props.settings.useReceiveConductivity = "false";
		}
		else if (type === SdmsResource.facilityType.PRESSURE_SENSOR) {
			if (this.refUseReceivePressure.current.checked)
				this.props.settings.useReceivePressure = "true";
			else
				this.props.settings.useReceivePressure = "false";
		}
		else if (type === SdmsResource.facilityType.GAS) {
			if (this.refUseReceiveGAS.current.checked)
				this.props.settings.useReceiveGAS = "true";
			else
				this.props.settings.useReceiveGAS = "false";
		}

		this.props.onChangeNeedToSave();
    }

	onClickMoveDisplayAlarm = (type) => {
		if (type === NormalTab_Hy.MoveDisplayAlarm.current) {
			this.props.settings.moveDisplayAlarm = "0";
		}
		else if (type === NormalTab_Hy.MoveDisplayAlarm.move) {
			this.props.settings.moveDisplayAlarm = "3";
		}		

		this.props.onChangeNeedToSave();
	}

	onClickAlarmAutoEnd = (type) => {
		if (type === NormalTab_Hy.AlarmAutoEnd.keep) {
			this.props.settings.alarmAutoEnd = "0";
		}
		else if (type === NormalTab_Hy.AlarmAutoEnd.end24) {
			this.props.settings.alarmAutoEnd = "1";
		}

		this.props.onChangeNeedToSave();
	}

	onClickPopupReset = () => {
		// 시스템 팝업 위치/사이즈 리셋
		this.showConfirmDialog(i18n.t('common.확인'), [i18n.t('setting.userOption.팝업창 위치/사이즈 초기화를 하시겠습니까?')], [i18n.t('common.취소'), i18n.t('common.확인')], this.confirmPopupReset);
	}

	confirmPopupReset = (index) => {
		if (index === 1) {
			this.doPopupReset();
		}

		this.onCloseConfirmDialog();
	}

	async doPopupReset() {
		// 데이터 팝업 위치 및 사이즈 초기화
		let popupState = [];


		let statusInfo = SdmsResource.popupResetLocation.statusInfoNew;
		let dashboardPop = SdmsResource.popupResetLocation.dashboardPop;
		let eventInfoNew = SdmsResource.popupResetLocation.eventInfoNew;
		let compoundData = SdmsResource.popupResetLocation.compoundData;

		popupState = {
			statusInfo: statusInfo,
			dashboardPop: dashboardPop,
			eventInfoNew: eventInfoNew,
			compoundData: compoundData
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

	render() {

		return (
			<>
				<Monitoring3DComponent>
					<ul className='contents'>
						<li className='item'>
							<div>
								<p>{i18n.t('setting.monitoring3D.3D 회전 대기시간/자동회전 설정')}</p>
								<select ref={this.refIdleTime} id={'monitoringSelect'} onClick={this.onClickSelect} onChange={this.onChangeIdleTime}>
									<option value={"15"}>{i18n.t('setting.monitoring3D.15분')}</option>
									<option value={"30"}>{i18n.t('setting.monitoring3D.30분')}</option>
									<option value={"60"}>{i18n.t('setting.monitoring3D.1시간')}</option>
								</select>
							</div>
							<div className={'tooltipBox'} id='tooltip' data-tooltip={i18n.t('setting.monitoring3D.3D 회전 대기시간 및 자동회전을 설정합니다')} >
								<img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
							</div>
						</li>
						<li className='item'>
							<div>
								<p>{i18n.t('setting.monitoring3D.센서 유형별 이벤트 발생 표시 설정')}</p>
								<div>
									<input ref={this.refUseReceiveConductivity} type='checkbox' id='sensor_1' onClick={() => this.onClickReceive(SdmsResource.facilityType.Conductivity)} />
									<label htmlFor='sensor_1'>{i18n.t('facilityType.전도도')}</label>
								</div>
								<div>
									<input ref={this.refUseReceiveFlow} type='checkbox' id='sensor_2' onClick={() => this.onClickReceive(SdmsResource.facilityType.Flow)} />
									<label htmlFor='sensor_2'>{i18n.t('facilityType.유량')}</label>
								</div>
								<div>
									<input ref={this.refUseReceiveGAS} type='checkbox' id='sensor_3' onClick={() => this.onClickReceive(SdmsResource.facilityType.GAS)} />
									<label htmlFor='sensor_3'>{i18n.t('facilityType.가스')}</label>
								</div>
								<div>
									<input ref={this.refUseReceiveH2} type='checkbox' id='sensor_4' onClick={() => this.onClickReceive(SdmsResource.facilityType.H2)} />
									<label htmlFor='sensor_4'>{i18n.t('facilityType.수소')}</label>
								</div>
								<div>
									<input ref={this.refUseReceivePressure} type='checkbox' id='sensor_5' onClick={() => this.onClickReceive(SdmsResource.facilityType.PRESSURE_SENSOR)} />
									<label htmlFor='sensor_5'>{i18n.t('facilityType.압력')}</label>
								</div>
								<div>
									<input ref={this.refUseReceiveTemp} type='checkbox' id='sensor_6' onClick={() => this.onClickReceive(SdmsResource.facilityType.Temp)} />
									<label htmlFor='sensor_6'>{i18n.t('facilityType.온도')}</label>
								</div>
							</div>
							<div className={'tooltipBox'} id='tooltip' data-tooltip={i18n.t('setting.monitoring3D.센서 유형별 이벤트 발생 표시를 설정합니다')}>
								<img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
							</div>
						</li>
						<li className='item'>
							<div>
								<p>{i18n.t('setting.monitoring3D.이벤트 발생 시 화면 자동전환 설정')}</p>
								<div>
									<input ref={this.refMoveDisplayAlarm0} type='radio' name='eventView' id='current' onClick={() => this.onClickMoveDisplayAlarm(NormalTab_Hy.MoveDisplayAlarm.current)} />
									<label htmlFor='current'>{i18n.t('setting.monitoring3D.현재화면 유지')}</label>
								</div>
								<div>
									<input ref={this.refMoveDisplayAlarm3} type='radio' name='eventView' id='move' onClick={() => this.onClickMoveDisplayAlarm(NormalTab_Hy.MoveDisplayAlarm.move)} />
									<label htmlFor='move'>{i18n.t('setting.monitoring3D.이벤트 발생 위치로 화면이동')}</label>
								</div>
							</div>
							<div className={'tooltipBox'} id='tooltip' data-tooltip={i18n.t('setting.monitoring3D.이벤트 발생 시 화면 자동전환 여부를 설정합니다')}>
								<img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
							</div>
						</li>
						<li className='item'>
							<div>
								<p>{i18n.t('setting.monitoring3D.이벤트 발생 시 알람 자동종료 설정')}</p>
								<div>
									<input ref={this.refAlarmAutoEnd0} type='radio' name='alarmEnd' id='alarmEnd01' onClick={() => this.onClickAlarmAutoEnd(NormalTab_Hy.AlarmAutoEnd.keep)} />
									<label htmlFor='alarmEnd01'>{i18n.t('setting.monitoring3D.알람 유지')}</label>
								</div>
								<div>
									<input ref={this.refAlarmAutoEnd1} type='radio' name='alarmEnd' id='alarmEnd02' onClick={() => this.onClickAlarmAutoEnd(NormalTab_Hy.AlarmAutoEnd.end24)} />
									<label htmlFor='alarmEnd02'>{i18n.t('setting.monitoring3D.24시간 이후 알람 자동종료')}</label>
								</div>
							</div>
							<div className={'tooltipBox'} id='tooltip' data-tooltip={i18n.t('setting.monitoring3D.이벤트 발생 시 알람 자동종료 여부를 설정합니다')}>
								<img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
							</div>
						</li>
						<li className='item margin'>
							<div>
								<p>{i18n.t('setting.monitoring3D.팝업창 크기 및 위치 초기화 설정')}</p>
								<button onClick={this.onClickPopupReset}>{i18n.t('setting.monitoring3D.시스템 기본값으로 재설정')}</button>
							</div>
								<div className={'tooltipBox'} id='tooltip' data-tooltip={i18n.t('setting.monitoring3D.팝업창 크기 및 위치를 초기화합니다')} >
								<img src={tooltip_icon} alt='도움말 아이콘' width={24} height={24} />
							</div>
						</li>
					</ul>
				</Monitoring3DComponent>
				{
					/* alert창 대신 사용 */
					this.state.confirmMessage.visible &&
					<ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
				}
			</>
		);
	}
}


