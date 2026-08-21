import React, { Component } from 'react';
import { Container } from 'reactstrap';
import $ from 'jquery';
import SopLink from './sopLink';
import SettingResource from '../../resource/id';

import { SopSetComponent } from '../../styled/settingsStyled';
import { SettingsCommon } from '../../styled/settingsStyled';
import ProjectResource from '../../../Root/resource/id';
//import Tooltip from '../tooltip';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';
import SdmsResource from '../../../SDMS/resource/id';
import ToggleSwitch from '../../../Common/ui/toggleSwitch';
import Theme from '../../../Root/styled/theme';
import tooltip_icon from '../../../Common/img/imghydrogen/main/tooltip_icon.svg';


class SopSet extends Component {
    constructor(props) {
        super(props);

		this.state = {
			tabMenu: SettingResource.sopSetMode.일반,
			useSMS: true,
			sopAutoClose: true,
			useConfirm: true,
			//setUseSMS: null,
			//setSopAutoClose: null,
			//setUseResultSummary: null,
		}

		this.props = props;
		//this.formText = SettingResource.ID.textSopSet;
	}

	/* onClickTab = (target, value) => {
		$('.SopSetTab li a').removeClass('on');
		$(target).addClass('on');

		this.setState({ tabMenu: value });
	} */

	setContentUI = () => {
		let contentUI = [];

		if (this.state.tabMenu === SettingResource.sopSetMode.일반) {
			contentUI.push(
				<NormalTab key="NormalTab"
					settings={this.props.settings}
					sensorTypes={this.props.sensorTypes}
					onChangeNeedToSave={this.props.onChangeNeedToSave}
					selectedSiteID={this.props.selectedSiteID}
					buildingGroupList={this.props.buildingGroupList}
					disasterCategories={this.props.disasterCategories}
					//linkedSOPs={this.props.linkedSOPs}
					//updateLinkedSops={this.props.updateLinkedSops}
					showConfirmDialog={this.props.showConfirmDialog}
				/>
			);
		} else if (this.state.tabMenu === SettingResource.sopSetMode.고급) {
			contentUI.push(
				<SopLink key="SopLink"
					buildingGroupList={this.props.buildingGroupList}
					disasterCategories={this.props.disasterCategories}
					//linkedSOPs={this.props.linkedSOPs}
					sensorTypes={this.props.sensorTypes}
					//updateLinkedSops={this.props.updateLinkedSops}
					onChangeNeedToSave={this.props.onChangeNeedToSave}
					selectedSiteID={this.props.selectedSiteID} />
			);
		}

		return contentUI;
	}

	getAuthorTab() {
		let authorTabUI = [];
		authorTabUI.push(
			<React.Fragment key='authorTab'>
				<li><a onClick={(e) => this.onClickTab(e.target, SettingResource.sopSetMode.일반)} className={'on'}>{i18n.t('common.일반')}</a></li>
				<li><a onClick={(e) => this.onClickTab(e.target, SettingResource.sopSetMode.고급)}>{i18n.t('common.고급')}</a></li>
			</React.Fragment>);

		return authorTabUI;
	}

	render() {
		const contentUI = this.setContentUI();
		const authorTabUI = this.getAuthorTab();

        return (
            <SopSetComponent>
				{contentUI}
            </SopSetComponent>
        );
    }
}

export default withTranslation()(SopSet);

class NormalTab extends Component {
    constructor(props) {
        super(props);

		this.refUseAutoMoveSOPScreen = React.createRef();
		this.refUseBroadcast = React.createRef();
		this.refUseSMS = React.createRef();
		this.refUseEmail = React.createRef();
		this.refUseConfirm = React.createRef();
		this.refUseResultSummary = React.createRef();

		//this.refWorkingBeginHour = React.createRef();
		//this.refWorkingBeginMinute = React.createRef();
		//this.refWorkingEndHour = React.createRef();
		//this.refWorkingEndMinute = React.createRef();

		this.refWaitEndTime = React.createRef();
		this.refWaitTime = React.createRef();
		this.refWaitTimeUnit = React.createRef();
		this.refWaitEndMode = React.createRef();

		this.refRecoverEndTime = React.createRef();
		this.refRecoverTime = React.createRef();
		this.refRecoverTimeUnit = React.createRef();
		this.refRecoverEndMode = React.createRef();

		this.refSopAutoClose = React.createRef();

		this.dropdownRefs = [
			//this.refWorkingBeginHour,
			//this.refWorkingBeginMinute,
			//this.refWorkingEndHour,
			//this.refWorkingEndMinute,
			this.refSopAutoClose
		];

		this.state = {
			openSOPLink: false,
			sopAutoClose: true,		// SOP 자동종료 설정
			useConfirm: true		// 상황 전파시 확인 여부 설정
		}

		this.props = props;
		//this.formText = SettingResource.ID.textSopSet;
	}

	componentDidMount() {
		//this.initWorkingHour();
		this.initWaitEndTime();
		this.initUseConfirm();
		//this.initRecoverEndTime();

		document.addEventListener("click", this.handleClickOutside);
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.selectedSiteID !== this.props.selectedSiteID) {
			//this.initWorkingHour();
			this.initWaitEndTime();
			this.initUseConfirm();
			//this.initRecoverEndTime();
		}
    }

	componentWillUnmount() {
        document.removeEventListener("click", this.handleClickOutside);
    }

	// 드롭다운박스 이외의 영역 클릭 시 focus 효과 삭제
	handleClickOutside = (e) => {
		this.dropdownRefs.forEach((ref) => {
			if (ref.current && !ref.current.contains(e.target)) {
				ref.current.classList.remove('on');
			}
		});
	};

	openSOPLink = () => {
		this.setState({ openSOPLink : true });
	}
		
	initWaitEndTime() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let data = null;
		data = this.props.settings.sopWaitEndTime;
		//SOP 대기 자동 종료 설정 [ 시간 / 시간단위(0:초,1:분,2:시간) / 종료모드(0:자동종료, 1:확인 후 종료, 2:종료안함) ]

		let arrData = data?.split(";");

		if (!arrData || arrData.length !== 3) {
			data = "30;1;0";
			arrData = data.split(";");
		}

		// 자동종료 ON/OFF 설정
		let sopAutoClose = arrData[2];
		if (sopAutoClose === "0") {
			sopAutoClose = true;
		}
		else {
			sopAutoClose = false;
        }

		// 분 설정
		this.refSopAutoClose.current.value = Number(arrData[0]);

		this.setState({ sopAutoClose });
	}

	initUseConfirm() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let useConfirm = this.props.settings.useConfirm;

		if (useConfirm === "true") {
			useConfirm = true;
		}
		else {
			useConfirm = false;
		}

		this.setState({ useConfirm });
    }

	initRecoverEndTime() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let data = null;
		data = this.props.settings.fireSOPRecoverEndTime;

		let arrData = data.split(";");

		if (arrData.length !== 3) {
			data = "10;1;2";
			arrData = data.split(";");
		}

		//this.refRecoverEndTime.current.value = SdmsResource.facilityType.FIRE.toString();
		//this.refRecoverTime.current.value = arrData[0];
		//this.refRecoverTimeUnit.current.value = arrData[1];
		//this.refRecoverEndMode.current.value = arrData[2];
    }

	initWorkingHour() {
		if (this.props.settings === null || this.props.settings === undefined ||
			!this.refWorkingBeginHour.current || !this.refWorkingBeginMinute.current ||
			!this.refWorkingEndHour.current || !this.refWorkingEndMinute.current)
			return;

		let workingBeginHour = this.props.settings.workingBeginHour;
		let workingEndHour = this.props.settings.workingEndHour;

		let arrWorkingBeginHour = workingBeginHour.split(":");
		let arrWorkingEndHour = workingEndHour.split(":");

		if (arrWorkingBeginHour.length !== 2) {
			workingBeginHour = "9:0";
			arrWorkingBeginHour = workingBeginHour.split(":");
		}

		if (arrWorkingEndHour.length !== 2) {
			workingEndHour = "8:0"
			arrWorkingEndHour = workingEndHour.split(":");
		}
				
		this.refWorkingBeginHour.current.value = Number(arrWorkingBeginHour[0]);
		this.refWorkingBeginMinute.current.value = Number(arrWorkingBeginHour[1]);

		this.refWorkingEndHour.current.value = Number(arrWorkingEndHour[0]);
		this.refWorkingEndMinute.current.value = Number(arrWorkingEndHour[1]);
	}

	onChangeWaitEndTime = () => {
		let type = this.refWaitEndTime.current.value;
		let data = null;

		if (this.props.settings === null || this.props.settings === undefined)
			return;

		if (type === SdmsResource.facilityType.FIRE.toString()) {
			data = this.props.settings.fireSOPWaitEndTime;
		} else if (type === SdmsResource.facilityType.PSM_SENSOR.toString()) {
			data = this.props.settings.psmsopWaitEndTime;
		} else if (type === SdmsResource.facilityType.ETC.toString()) {
			data = this.props.settings.etcsopWaitEndTime;
		}

		let arrData = data.split(";");

		if (arrData.length !== 3) {
			data = "10;1;2";
			arrData = data.split(";");
		}

		this.refWaitTime.current.value = arrData[0];
		this.refWaitTimeUnit.current.value = arrData[1];
		this.refWaitEndMode.current.value = arrData[2];
    }

	onChangeRecoverEndTime = () => {
		let type = this.refRecoverEndTime.current.value;
		let data = null;

		if (this.props.settings === null || this.props.settings === undefined)
			return;

		if (type === SdmsResource.facilityType.FIRE.toString()) {
			data = this.props.settings.fireSOPRecoverEndTime;
		} else if (type === SdmsResource.facilityType.PSM_SENSOR.toString()) {
			data = this.props.settings.psmsopRecoverEndTime;
		} else if (type === SdmsResource.facilityType.ETC.toString()) {
			data = this.props.settings.etcsopRecoverEndTime;
		}

		let arrData = data.split(";");

		if (arrData.length !== 3) {
			data = "10;1;2";
			arrData = data.split(";");
		}

		this.refRecoverTime.current.value = arrData[0];
		this.refRecoverTimeUnit.current.value = arrData[1];
		this.refRecoverEndMode.current.value = arrData[2];
    }
	
	onChangeWorkingBeginHour = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.target.value;
		let workingBeginMinute = this.refWorkingBeginMinute.current.value;

		this.props.settings.workingBeginHour = value + ":" + workingBeginMinute;
		this.props.onChangeNeedToSave();
	}

	onChangeWorkingBeginMinute = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.target.value;
		let workingBeginHour = this.refWorkingBeginHour.current.value;

		this.props.settings.workingBeginHour = workingBeginHour + ":" + value;
		this.props.onChangeNeedToSave();
	}

	onChangeWorkingEndHour = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.target.value;
		let workingEndMinute = this.refWorkingEndMinute.current.value;

		this.props.settings.workingEndHour = value + ":" + workingEndMinute;
		this.props.onChangeNeedToSave();
	}

	onChangeWorkingEndMinute = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.target.value;
		let workingEndHour = this.refWorkingEndHour.current.value;
		this.props.settings.workingEndHour = workingEndHour + ":" + value;
		this.props.onChangeNeedToSave();
	}

	onChangeUseAutoMoveSOPScreen = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();
		this.props.settings.useAutoMoveSOPScreen = value;
		this.props.onChangeNeedToSave();
	}

	onChangeUseBroadcast = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();
		this.props.settings.useBroadcast = value;
		this.props.onChangeNeedToSave();
	}

	onChangeUseSMS = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();
		this.props.settings.useSMS = value;
		this.props.onChangeNeedToSave();
	}

	onChangeUseEmail = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();
		this.props.settings.useEmail = value;
		this.props.onChangeNeedToSave();
	}

	onChangeUseConfirm = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();
		this.props.settings.useConfirm = value;
		this.props.onChangeNeedToSave();
	}

	setComboHourUI() {
		let comboHourUI = [];

		for (let i = 1; i < 25; i++) {
			let hour = this.leadingZeros(i, 2);

			comboHourUI.push(
				<option key={i} value={i}>{hour}</option>
			);
        }

		return comboHourUI;
	}

	leadingZeros(n, digits) {
		var zero = '';
		n = n.toString();

		if (n.length < digits) {
			for (var i = 0; i < digits - n.length; i++)
				zero += '0';
		}
		return zero + n;
	}

	setComboMinuteUI() {
		let comboMinuteUI = [];

		for (let i = 0; i < 60; i += 5) {
			let minute = this.leadingZeros(i, 2);

			comboMinuteUI.push(
				<option key={i} value={i}>{minute}</option>
			);
		}

		return comboMinuteUI;
	}

	
	onChangeWaitNumCheck = (e) => {
		let value = e.target.value;
		let inputValue = value.replace(/[^0-9\b ]/g, '');

		this.refWaitTime.current.value = inputValue;
	}

	onChangeRecoverNumCheck = (e) => {
		let value = e.target.value;
		let inputValue = value.replace(/[^0-9\b ]/g, '');

		this.refRecoverTime.current.value = inputValue;
	}

	onChangeWait = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let type = this.refWaitEndTime.current.value;
		let time = this.refWaitTime.current.value;
		let timeUnit = this.refWaitTimeUnit.current.value;
		let endMode = this.refWaitEndMode.current.value;

		let value = time + ";" + timeUnit + ";" + endMode;

		if (type === SdmsResource.facilityType.FIRE.toString()) {
			this.props.settings.fireSOPWaitEndTime = value;
		} else if (type === SdmsResource.facilityType.PSM_SENSOR.toString()) {
			this.props.settings.psmsopWaitEndTime = value;
		} else if (type === SdmsResource.facilityType.ETC.toString()) {
			this.props.settings.etcsopWaitEndTime = value;
		} else
			return;

		this.props.onChangeNeedToSave();
	}

	onChangeRecover = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let type = this.refRecoverEndTime.current.value;
		let time = this.refRecoverTime.current.value;
		let timeUnit = this.refRecoverTimeUnit.current.value;
		let endMode = this.refRecoverEndMode.current.value;

		let value = time + ";" + timeUnit + ";" + endMode;

		if (type === SdmsResource.facilityType.FIRE.toString()) {
			this.props.settings.fireSOPRecoverEndTime = value;
		} else if (type === SdmsResource.facilityType.PSM_SENSOR.toString()) {
			this.props.settings.psmsopRecoverEndTime = value;
		} else if (type === SdmsResource.facilityType.ETC.toString()) {
			this.props.settings.etcsopRecoverEndTime = value;
		} else
			return;

		this.props.onChangeNeedToSave();
	}
	

	onClickWaitEndAllSave = () => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let time = this.refWaitTime.current.value;
		let timeUnit = this.refWaitTimeUnit.current.value;
		let endMode = this.refWaitEndMode.current.value;

		let value = time + ";" + timeUnit + ";" + endMode;

		this.props.settings.fireSOPWaitEndTime = value;
		this.props.settings.psmsopWaitEndTime = value;
		this.props.settings.etcsopWaitEndTime = value;
		this.props.onChangeNeedToSave();
    }

	onClickRecoverEndAllSave = () => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let time = this.refRecoverTime.current.value;
		let timeUnit = this.refRecoverTimeUnit.current.value;
		let endMode = this.refRecoverEndMode.current.value;

		let value = time + ";" + timeUnit + ";" + endMode;

		this.props.settings.fireSOPRecoverEndTime = value;
		this.props.settings.psmsopRecoverEndTime = value;
		this.props.settings.etcsopRecoverEndTime = value;
		this.props.onChangeNeedToSave();
	}

	setChecked = (sopType) => {
		if (sopType === 'sopAutoClose') {
			let data = this.props.settings.sopWaitEndTime;
			let arrData = data.split(";");

			const sopAutoClose = !this.state.sopAutoClose;
			let isAutoClose = 2;

			if (sopAutoClose)
				isAutoClose = 0;

			this.props.settings.sopWaitEndTime = arrData[0] + ";" + arrData[1] + ";" + isAutoClose;

			this.props.onChangeNeedToSave();

			this.setState({ sopAutoClose: !this.state.sopAutoClose });
        } 
		else if (sopType === 'useConfirm') {
			const useConfirmData = !this.state.useConfirm;

			if (useConfirmData) {
				this.props.settings.useConfirm = "true";
			}
			else {
				this.props.settings.useConfirm = "false";
            }

			this.setState({ useConfirm: useConfirmData });
        } 
    }

	openSOPLinkClose = () => {
        this.setState({ openSOPLink: false });
    }

	onClickFocusSelectBox = (e) => {
		const el = e.currentTarget;
		el.classList.toggle('on');
	};

	onChangeSOPAutoCloseTime = () => {
		// 값 넣기
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = this.refSopAutoClose.current.value;

		let data = this.props.settings.sopWaitEndTime;
		let arrData = data.split(";");

		this.props.settings.sopWaitEndTime = value + ";" + arrData[1] + ";" + arrData[2];

		this.props.onChangeNeedToSave();
    }

	render() {
		let comboHourUI = this.setComboHourUI();
		let comboMinuteUI = this.setComboMinuteUI();

        return (
			<>
			<SopSetComponent>
				<ul className='contents'>
					{/*<li className='item'>
						<div>
							<p>{i18n.t('setting.sopSet.시간 설정')}</p>
							<div className='selectWrap'>
									<span className='innerTxt'>{i18n.t('setting.sopSet.평일 주간 시간')}</span>
									<select className='short' id={'hourSelect'} ref={this.refWorkingBeginHour} onClick={(e) => this.onClickFocusSelectBox(e)} onChange={(e) => this.onChangeWorkingBeginHour(e)}>
									{comboHourUI}
								</select>
								<span className='innerTxt'>:</span>
									<select className='short' id={'minuteSelect'} ref={this.refWorkingBeginMinute} onClick={(e) => this.onClickFocusSelectBox(e)} onChange={(e) => this.onChangeWorkingBeginMinute(e)}>
									{comboMinuteUI}
								</select>
								<span className='innerTxt'>~</span>
									<select className='short' id={'hourSelects'} ref={this.refWorkingEndHour} onClick={(e) => this.onClickFocusSelectBox(e)} onChange={(e) => this.onChangeWorkingEndHour(e)}>
									{comboHourUI}
								</select>
								<span className='innerTxt'>:</span>
									<select className='short' id={'minuteSelects'} ref={this.refWorkingEndMinute} onClick={(e) => this.onClickFocusSelectBox(e)} onChange={(e) => this.onChangeWorkingEndMinute(e)}>
									{comboMinuteUI}
								</select>
							</div> 
						</div>
							<div className={'tooltipBox'} id='tooltip' data-tooltip={i18n.t('setting.sopSet.SOP모드 시간을 설정합니다')} >
							<img src={tooltip_icon} alt='도움말 아이콘' width={24} height={24} />
						</div>
					</li>*}
					{/* <li className='item'>
						<div>
							<p>Use text message</p>
							<ToggleSwitch 
								left="OFF" 
								right="ON" 
								leftcolor="#000" 
								rightcolor={Theme.fontPrimary}
								leftbgcolor="#384355" 
								rightbgcolor={Theme.primary} 
								sopType="useSMS"
								setChecked={this.setChecked}
								isChecked={this.useSMS}
							/>
						</div>
						<div className={'tooltipBox'} id='tooltip' data-tooltip="문자전파 사용 여부를 설정합니다." >
							<img src={tooltip_icon} alt='도움말 아이콘' width={24} height={24} />
						</div>
					</li> */}
					<li className='item'>
						<div>
							<p>{i18n.t('setting.sopSet.SOP 자동종료 설정')}</p>
							<ToggleSwitch 
								left="OFF" 
								right="ON" 
								leftcolor="#1E1E1E" 
								rightcolor={Theme.fontPrimary}
								leftbgcolor="#3C4143" 
								rightbgcolor={Theme.primary} 
								sopType="sopAutoClose"
								setChecked={this.setChecked}
								isChecked={this.state.sopAutoClose}
							/>
							<div>
									<select className={!this.state.sopAutoClose ? 'disable' : null} disabled={this.state.sopAutoClose ? false : true} id={'automaticSelect'} ref={this.refSopAutoClose} onClick={(e) => this.onClickFocusSelectBox(e)} onChange={this.onChangeSOPAutoCloseTime}>
										<option value={15}>{i18n.t('setting.sopSet.15분')}</option>
										<option value={30}>{i18n.t('setting.sopSet.30분')}</option>
										<option value={60}>{i18n.t('setting.sopSet.1시간')}</option>
								</select>
									<span className='innerTxt'>{i18n.t('setting.sopSet.미 입력 시 SOP 자동종료')}</span>
							</div>
						</div>
							<div className={'tooltipBox'} id='tooltip' data-tooltip={i18n.t('setting.sopSet.대기상태의 SOP 자동종료를 설정합니다')} >
							<img src={tooltip_icon} alt='도움말 아이콘' width={24} height={24} />
						</div>
					</li>
					<li className='item'>
						<div>
							<p>{i18n.t('setting.sopSet.상황 전파시 확인단계 거치기')}</p>
							<ToggleSwitch 
								left="OFF" 
								right="ON" 
								leftcolor="#000" 
								rightcolor={Theme.fontPrimary}
								leftbgcolor="#384355" 
								rightbgcolor={Theme.primary} 
								sopType="useConfirm"
								setChecked={this.setChecked}
								isChecked={this.state.useConfirm}
							/>
						</div>
							<div className={'tooltipBox'} id='tooltip' data-tooltip={i18n.t('setting.sopSet.상황 전파 시 확인단계 거치기 여부를 설정합니다')} >
							<img src={tooltip_icon} alt='도움말 아이콘' width={24} height={24} />
						</div>
					</li>
					<li className='item margin'>
						<div>
							<p>{i18n.t('setting.sopSet.이벤트 발생 시 실행 SOP 설정')}</p>
								<button /* onClick={() => handlePopup(true)} */ onClick={this.openSOPLink}>{i18n.t('setting.sopSet.고급 설정')}</button>
						</div>
							<div className={'tooltipBox'} id='tooltip' data-tooltip={i18n.t('setting.sopSet.이벤트 발생 시 실행할 SOP를 설정합니다')} >
							<img src={tooltip_icon} alt='도움말 아이콘' width={24} height={24} />
						</div>
					</li>
				</ul>
			</SopSetComponent>
			{
				this.state.openSOPLink &&
					<SopLink key="SopLink"
						buildingGroupList={this.props.buildingGroupList}
						disasterCategories={this.props.disasterCategories}
						//linkedSOPs={this.props.linkedSOPs}
						sensorTypes={this.props.sensorTypes}
						//updateLinkedSops={this.props.updateLinkedSops}
						onChangeNeedToSave={this.props.onChangeNeedToSave}
						selectedSiteID={this.props.selectedSiteID}
						openSOPLinkClose={this.openSOPLinkClose}
						showConfirmDialog={this.props.showConfirmDialog}
					/>
			}
			</>
        );
    }
}