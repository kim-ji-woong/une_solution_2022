import React, { Component } from 'react';
import { Container } from 'reactstrap';
import $ from 'jquery';
import SopLink from './sopLink';

import newStyles from '../../../Common/css/newStyle.module.css';
import newDefaults from '../../../Common/css/newDefault.module.css';

import SettingResource from '../../resource/id';

import { SopSetComponent } from '../../styled/settingsStyled';
import { SettingsCommon } from '../../styled/settingsStyled';
import ProjectResource from '../../../Root/resource/id';
//import Tooltip from '../tooltip';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';
import SdmsResource from '../../../SDMS/resource/id';

class SopSet extends Component {
    constructor(props) {
        super(props);

		this.state = {
			tabMenu: SettingResource.sopSetMode.일반,
			titleTooltipShow: false,
			typeTooltipShow: false,
			nameTooltipShow: false,
			tooltipTop: 0,
			tooltipLeft: 0,
		}

		this.props = props;
		//this.formText = SettingResource.ID.textSopSet;
	}

	onClickTab = (target, value) => {
		$('.SopSetTab li a').removeClass('on');
		$(target).addClass('on');

		this.setState({ tabMenu: value });
	}

	setContentUI = () => {
		let contentUI = [];

		if (this.state.tabMenu === SettingResource.sopSetMode.일반) {
			contentUI.push(
				<NormalTab key="NormalTab" settings={this.props.settings} sensorTypes={this.props.sensorTypes} onChangeNeedToSave={this.props.onChangeNeedToSave} selectedSiteID={this.props.selectedSiteID} />
			);
		} else if (this.state.tabMenu === SettingResource.sopSetMode.고급) {
			contentUI.push(
				<SopLink key="SopLink" buildingGroupList={this.props.buildingGroupList} disasterCategories={this.props.disasterCategories}
					linkedSOPs={this.props.linkedSOPs} sensorTypes={this.props.sensorTypes} updateLinkedSops={this.props.updateLinkedSops}
					onChangeNeedToSave={this.props.onChangeNeedToSave} selectedSiteID={this.props.selectedSiteID}
					setSOPLinkDatas={this.props.setSOPLinkDatas} />
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
				<ul className={'stgTab' + " SopSetTab"}>
					{authorTabUI}
				</ul>

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

		this.refWorkingBeginHour = React.createRef();
		this.refWorkingBeginMinute = React.createRef();
		this.refWorkingEndHour = React.createRef();
		this.refWorkingEndMinute = React.createRef();

		this.refWaitEndTime = React.createRef();
		this.refWaitTime = React.createRef();
		this.refWaitTimeUnit = React.createRef();
		this.refWaitEndMode = React.createRef();

		this.refRecoverEndTime = React.createRef();
		this.refRecoverTime = React.createRef();
		this.refRecoverTimeUnit = React.createRef();
		this.refRecoverEndMode = React.createRef();

		this.state = {
		}

		this.props = props;
		//this.formText = SettingResource.ID.textSopSet;
	}

	componentDidMount() {
		this.initData();
		this.initWorkingHour();
		this.initWaitEndTime();
		this.initRecoverEndTime();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.selectedSiteID !== this.props.selectedSiteID) {
			this.initData();
			this.initWorkingHour();
			this.initWaitEndTime();
			this.initRecoverEndTime();
		}
    }

	initData() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let useAutoMoveSOPScreen = this.props.settings.properties.UseAutoMoveSOPScreen;
		let useBroadcast = this.props.settings.properties.UseBroadcast;
		let useSMS = this.props.settings.properties.UseSMS;
		let useEmail = this.props.settings.properties.UseEmail;
		let useConfirm = this.props.settings.properties.UseConfirm;
		let useResultSummary = this.props.settings.properties.UseResultSummary;

		if (useAutoMoveSOPScreen === "true")
			this.refUseAutoMoveSOPScreen.current.checked = true;
		else
			this.refUseAutoMoveSOPScreen.current.checked = false;
		
		if (useBroadcast === "true") 
			this.refUseBroadcast.current.checked = true;
		else
			this.refUseBroadcast.current.checked = false;

		if (useSMS === "true")
			this.refUseSMS.current.checked = true;
		else
			this.refUseSMS.current.checked = false;

		if (useEmail === "true")
			this.refUseEmail.current.checked = true;
		else
			this.refUseEmail.current.checked = false;

		if (useConfirm === "true")
			this.refUseConfirm.current.checked = true;
		else
			this.refUseConfirm.current.checked = false;

		if (useResultSummary === "true")
			this.refUseResultSummary.current.checked = true;
		else
			this.refUseResultSummary.current.checked = false;
	}
		
	initWaitEndTime() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let data = null;
		data = this.props.settings.properties.FireSOPWaitEndTime;

		let arrData = data.split(";");

		if (arrData.length !== 3) {
			data = "10;1;2";
			arrData = data.split(";");
		}

		this.refWaitEndTime.current.value = SdmsResource.facilityType.FIRE.toString();
		this.refWaitTime.current.value = arrData[0];
		this.refWaitTimeUnit.current.value = arrData[1];
		this.refWaitEndMode.current.value = arrData[2];
	}

	initRecoverEndTime() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let data = null;
		data = this.props.settings.properties.FireSOPRecoverEndTime;

		let arrData = data.split(";");

		if (arrData.length !== 3) {
			data = "10;1;2";
			arrData = data.split(";");
		}

		this.refRecoverEndTime.current.value = SdmsResource.facilityType.FIRE.toString();
		this.refRecoverTime.current.value = arrData[0];
		this.refRecoverTimeUnit.current.value = arrData[1];
		this.refRecoverEndMode.current.value = arrData[2];
    }

	initWorkingHour() {
		if (this.props.settings === null || this.props.settings === undefined ||
			!this.refWorkingBeginHour.current || !this.refWorkingBeginMinute.current ||
			!this.refWorkingEndHour.current || !this.refWorkingEndMinute.current)
			return;

		let workingBeginHour = this.props.settings.properties.WorkingBeginHour;
		let workingEndHour = this.props.settings.properties.WorkingEndHour;

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
			data = this.props.settings.properties.FireSOPWaitEndTime;
		} else if (type === SdmsResource.facilityType.PSM_SENSOR.toString()) {
			data = this.props.settings.properties.PSMSOPWaitEndTime;
		} else if (type === SdmsResource.facilityType.ETC.toString()) {
			data = this.props.settings.properties.ETCSOPWaitEndTime;
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
			data = this.props.settings.properties.FireSOPRecoverEndTime;
		} else if (type === SdmsResource.facilityType.PSM_SENSOR.toString()) {
			data = this.props.settings.properties.PSMSOPRecoverEndTime;
		} else if (type === SdmsResource.facilityType.ETC.toString()) {
			data = this.props.settings.properties.ETCSOPRecoverEndTime;
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

		let value = e.value;
		let workingBeginMinute = this.refWorkingBeginMinute.current.value;

		this.props.settings.properties.WorkingBeginHour = value + ":" + workingBeginMinute;
		this.props.onChangeNeedToSave();
	}

	onChangeWorkingBeginMinute = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.value;
		let workingBeginHour = this.refWorkingBeginHour.current.value;

		this.props.settings.properties.WorkingBeginHour = workingBeginHour + ":" + value;
		this.props.onChangeNeedToSave();
	}

	onChangeWorkingEndHour = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.value;
		let workingEndMinute = this.refWorkingEndMinute.current.value;

		this.props.settings.properties.WorkingEndHour = value + ":" + workingEndMinute;
		this.props.onChangeNeedToSave();
	}

	onChangeWorkingEndMinute = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.value;
		let workingEndHour = this.refWorkingEndHour.current.value;
		this.props.settings.properties.WorkingEndHour = workingEndHour + ":" + value;
		this.props.onChangeNeedToSave();
	}

	onChangeUseAutoMoveSOPScreen = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();
		this.props.settings.properties.UseAutoMoveSOPScreen = value;
		this.props.onChangeNeedToSave();
	}

	onChangeUseBroadcast = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();
		this.props.settings.properties.UseBroadcast = value;
		this.props.onChangeNeedToSave();
	}

	onChangeUseSMS = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();
		this.props.settings.properties.UseSMS = value;
		this.props.onChangeNeedToSave();
	}

	onChangeUseEmail = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();
		this.props.settings.properties.UseEmail = value;
		this.props.onChangeNeedToSave();
	}

	onChangeUseConfirm = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();
		this.props.settings.properties.UseConfirm = value;
		this.props.onChangeNeedToSave();
	}

	onChangeUseResultSummary = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();
		this.props.settings.properties.UseResultSummary = value;
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
			this.props.settings.properties.FireSOPWaitEndTime = value;
		} else if (type === SdmsResource.facilityType.PSM_SENSOR.toString()) {
			this.props.settings.properties.PSMSOPWaitEndTime = value;
		} else if (type === SdmsResource.facilityType.ETC.toString()) {
			this.props.settings.properties.ETCSOPWaitEndTime = value;
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
			this.props.settings.properties.FireSOPRecoverEndTime = value;
		} else if (type === SdmsResource.facilityType.PSM_SENSOR.toString()) {
			this.props.settings.properties.PSMSOPRecoverEndTime = value;
		} else if (type === SdmsResource.facilityType.ETC.toString()) {
			this.props.settings.properties.ETCSOPRecoverEndTime = value;
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

		this.props.settings.properties.FireSOPWaitEndTime = value;
		this.props.settings.properties.PSMSOPWaitEndTime = value;
		this.props.settings.properties.ETCSOPWaitEndTime = value;
		this.props.onChangeNeedToSave();
    }

	onClickRecoverEndAllSave = () => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let time = this.refRecoverTime.current.value;
		let timeUnit = this.refRecoverTimeUnit.current.value;
		let endMode = this.refRecoverEndMode.current.value;

		let value = time + ";" + timeUnit + ";" + endMode;

		this.props.settings.properties.FireSOPRecoverEndTime = value;
		this.props.settings.properties.PSMSOPRecoverEndTime = value;
		this.props.settings.properties.ETCSOPRecoverEndTime = value;
		this.props.onChangeNeedToSave();
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


	render() {
		let comboHourUI = this.setComboHourUI();
		let comboMinuteUI = this.setComboMinuteUI();

        return (
			<>
				<div className={'stgList'}>
					<span className={'stgScroll'}>
						{
							ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen
								? <>
									<div className={'stgHalfH'}>
										<div>
											<div className={'stgName' + " " + 'bdNon' + " " + 'mb0' + " " + 'pb0'}>
												<h5>{i18n.t('common.일반')}</h5>
												<span className={'stgTltp'} data-tooltip={i18n.t('setting.sopSet.컴포넌트 자동 화면 이동을 설정합니다.')}></span>
											</div>
											<ul className={'stgModeH'}>												
												<li><input ref={this.refUseAutoMoveSOPScreen} type="checkbox" name="stgCpnt" id="stgCpnt" onChange={(e) => this.onChangeUseAutoMoveSOPScreen(e.target)} /><label>{i18n.t('setting.sopSet.실행중인 컴포넌트로 자동 화면 이동')}</label></li>
												<li><input ref={this.refUseBroadcast} type="checkbox" name="stgStat" id="stgStat01" onChange={(e) => this.onChangeUseBroadcast(e.target)} /><label htmlFor="stgStat01">{i18n.t('setting.sopSet.방송 전파 사용하기')}</label></li>
												<li style={{ display: 'none' }}><input ref={this.refUseSMS} type="checkbox" name="stgStat" id="stgStat02" onChange={(e) => this.onChangeUseSMS(e.target)} /><label htmlFor="stgStat02">{i18n.t('setting.sopSet.문자 전파 사용하기')}</label></li>
												<li style={{ display: 'none' }}><input ref={this.refUseEmail} type="checkbox" name="stgStat" id="stgStat03" onChange={(e) => this.onChangeUseEmail(e.target)} /><label htmlFor="stgStat03">{i18n.t('setting.sopSet.이메일 전파 사용하기')}</label></li>
												<li><input ref={this.refUseConfirm} type="checkbox" name="stgStat" id="stgStat04" onChange={(e) => this.onChangeUseConfirm(e.target)} /><label htmlFor="stgStat04">{i18n.t('setting.sopSet.상황 전파시 확인단계 거치기')}</label></li>													
											</ul>
										</div>										
									</div>
								</>
								: <>
									<div className={'stgHalf'}>
										<div>
											<div className={'stgName' + " " + 'bdNon' + " " + 'mb0' + " " + 'pb0'}>
												<h5>{i18n.t('common.일반')}</h5>
												<span className={'stgTltp'} data-tooltip={i18n.t('setting.sopSet.컴포넌트 자동 화면 이동을 설정합니다.')}></span>
											</div>
											<ul className={'stgMode'}>
												<li>
													<label>{i18n.t('setting.sopSet.실행중인 컴포넌트로 자동 화면 이동')}</label>
													<input ref={this.refUseAutoMoveSOPScreen} type="checkbox" name="stgCpnt" id="stgCpnt" onChange={(e) => this.onChangeUseAutoMoveSOPScreen(e.target)} />
												</li>
											</ul>
										</div>
										<div>
											<div className={'stgName' + " " + 'bdNon' + " " + 'mb0' + " " + 'pb0'}>
												<h5>{i18n.t('common.일반')}</h5>
												<span className="stgTltp" data-tooltip={i18n.t('setting.sopSet.상황 전파 옵션을 설정합니다')}></span>
											</div>
											<ul className={'stgMode'}>
												<li><label htmlFor="stgStat01">{i18n.t('setting.sopSet.방송 전파 사용하기')}</label><input ref={this.refUseBroadcast} type="checkbox" name="stgStat" id="stgStat01" onChange={(e) => this.onChangeUseBroadcast(e.target)} /></li>
												<li><label htmlFor="stgStat02">{i18n.t('setting.sopSet.문자 전파 사용하기')}</label><input ref={this.refUseSMS} type="checkbox" name="stgStat" id="stgStat02" onChange={(e) => this.onChangeUseSMS(e.target)} /></li>
												<li><label htmlFor="stgStat03">{i18n.t('setting.sopSet.이메일 전파 사용하기')}</label><input ref={this.refUseEmail} type="checkbox" name="stgStat" id="stgStat03" onChange={(e) => this.onChangeUseEmail(e.target)} /></li>
												<li><label htmlFor="stgStat04">{i18n.t('setting.sopSet.상황 전파시 확인단계 거치기')}</label><input ref={this.refUseConfirm} type="checkbox" name="stgStat" id="stgStat04" onChange={(e) => this.onChangeUseConfirm(e.target)} /></li>
											</ul>
										</div>
									</div>
									<div className={'stgHalf'}>
										<div style={{ width: "100%" }}>
											<div className={'stgName' + " " + 'bdNon' + " " + 'mb0' + " " + 'pb0'}>
												<h5>{i18n.t('setting.sopSet.시간 설정')}</h5>
												<span className={'stgTltp'} data-tooltip={i18n.t('setting.sopSet.시간 설정 옵션을 설정합니다.')}></span>
											</div>
											<dl className={'stgTime'}>
												<dt>{i18n.t('setting.sopSet.평일 주간 시간대')}</dt>
												<dd>
													<ul className={'mb10'}>
														<li>
															<select ref={this.refWorkingBeginHour} style={{ width: "68px" }} className={'dslSel' + " " + 'sm'} onChange={(e) => this.onChangeWorkingBeginHour(e.target)} >
																{comboHourUI}
															</select>
														</li>
														<li>{i18n.t('setting.sopSet.시')}</li>
														<li>
															<select ref={this.refWorkingBeginMinute} style={{ width: "68px" }} className={'dslSel' + " " + 'sm'} onChange={(e) => this.onChangeWorkingBeginMinute(e.target)}>
																{comboMinuteUI}
															</select>
														</li>
														<li>{i18n.t('setting.sopSet.분 부터')}</li>
													</ul>
													<ul>
														<li>
															<select ref={this.refWorkingEndHour} style={{ width: "68px" }} className={'dslSel' + " " + 'sm'} onChange={(e) => this.onChangeWorkingEndHour(e.target)}>
																{comboHourUI}
															</select>
														</li>
														<li>{i18n.t('setting.sopSet.시')}</li>
														<li>
															<select ref={this.refWorkingEndMinute} style={{ width: "68px" }} className={'dslSel' + " " + 'sm'} onChange={(e) => this.onChangeWorkingEndMinute(e.target)}>
																{comboMinuteUI}
															</select>
														</li>
														<li>{i18n.t('setting.sopSet.분 까지')}</li>
													</ul>
												</dd>
											</dl>
										</div>
									</div>
								</>
						}
						<div className={'stgHalf' + " " + 'mb0'}>
							<div style={{ width: "100%", borderBottom: "solid 1px rgba(255, 255, 255, 0.1)", padding: "20px 0px 20px 0px" }}>
								<div className={'stgName' + " " + 'bdNon' + " " + 'mb0'}>
									<h5>{i18n.t('setting.sopSet.대기상태 SOP 자동종료')}</h5>
									<span className={'stgTltp'} data-tooltip={i18n.t('setting.sopSet.대기상태 SOP 자동종료를 설정합니다.')}></span>
									<a onClick={this.onClickWaitEndAllSave} className={'stgnRset'}>{i18n.t('setting.monitoring3D.모든 재난유형 동일하게 적용하기')}</a>
								</div>

								<ul className={'stgRstr'}>
									{
										i18n.language === "en" && <li className={'mr20'}>{i18n.t('setting.sopSet.동안 미입력시')}</li>
									}
									<li>
										<select ref={this.refWaitEndTime} style={{ width: "68px" }} name="" id="" className={'dslSel' + " " + 'sm'} onChange={this.onChangeWaitEndTime}>
											<option value={SdmsResource.facilityType.FIRE}>{i18n.t('facilityType.화재')}</option>
											<option value={SdmsResource.facilityType.PSM_SENSOR}>{i18n.t('facilityType.누출')}</option>
											<option value={SdmsResource.facilityType.ETC}>{i18n.t('facilityType.기타')}</option>
										</select>
									</li>
									<li><input ref={this.refWaitTime} style={{ width: "68px" }} type="text" name="" id="" className={'dsrTxt' + " " + 'sm'} onChange={this.onChangeWaitNumCheck} onBlur={this.onChangeWait} /></li>

									<li>
										<select ref={this.refWaitTimeUnit} style={{ width: "68px" }} name="" id="" className={'dslSel' + " " + 'sm'} onChange={this.onChangeWait}>
											<option value={SettingResource.timeUnit.second}>{i18n.t('setting.sopSet.초')}</option>
											<option value={SettingResource.timeUnit.minute}>{i18n.t('setting.sopSet.분')}</option>
											<option value={SettingResource.timeUnit.hour} >{i18n.t('setting.sopSet.시')}</option>
										</select>
									</li>
									{
										i18n.language === "ko" && <li className={'mr20'}>{i18n.t('setting.sopSet.동안 미입력시')}</li>
									}


									<li>
										<select ref={this.refWaitEndMode} style={{ width: "135px" }} name="" id="" className={'dslSel' + " " + 'sm'} onChange={this.onChangeWait}>
											<option value={SettingResource.sopEndMode.end}>{i18n.t('setting.sopSet.자동 종료')}</option>
											<option value={SettingResource.sopEndMode.confirm}>{i18n.t('setting.sopSet.확인 후 자동 종료')}</option>
											<option value={SettingResource.sopEndMode.notEnd}>{i18n.t('setting.sopSet.종료 안함')}</option>
										</select>
									</li>
								</ul>
							</div>

							<div style={{ width: "100%", borderBottom: "solid 1px rgba(255, 255, 255, 0.1)", padding: "20px 0px 20px 0px" }}>
								<div className={'stgName' + " " + 'bdNon' + " " + 'mb0'/* + " " + 'mt40'*/}>
									<h5>{i18n.t('setting.sopSet.센서신호 복구시 SOP 자동 종료')}</h5>
									<span className={'stgTltp'} data-tooltip={i18n.t('setting.sopSet.센서신호 복구시 SOP 자동 종료를 설정합니다.')}></span>
									<a onClick={this.onClickRecoverEndAllSave} className={'stgnRset'}>{i18n.t('setting.monitoring3D.모든 재난유형 동일하게 적용하기')}</a>
								</div>

								<ul className={'stgRstr'}>
									<li>
										<select style={{ width: "68px" }} ref={this.refRecoverEndTime} name="" id="" className={'dslSel' + " " + 'sm'} onChange={this.onChangeRecoverEndTime} >
											<option value={SdmsResource.facilityType.FIRE}>{i18n.t('facilityType.화재')}</option>
											<option value={SdmsResource.facilityType.PSM_SENSOR}>{i18n.t('facilityType.누출')}</option>
											<option value={SdmsResource.facilityType.ETC}>{i18n.t('facilityType.기타')}</option>
										</select>
									</li>
									<li className={'mr20'}>{/* {this.formText.closeSignalRecoveryAfter} */}</li>
									<li><input ref={this.refRecoverTime} style={{ width: "68px" }} type="text" name="" id="" className={'dsrTxt' + " " + 'sm'} onChange={this.onChangeRecoverNumCheck} onBlur={this.onChangeRecover} /></li>
									<li>
										<select ref={this.refRecoverTimeUnit} style={{ width: "68px" }} name="" id="" className={'dslSel' + " " + 'sm'} onChange={this.onChangeRecover}>
											<option value={SettingResource.timeUnit.second}>{i18n.t('setting.sopSet.초')}</option>
											<option value={SettingResource.timeUnit.minute}>{i18n.t('setting.sopSet.분')}</option>
											<option value={SettingResource.timeUnit.hour}>{i18n.t('setting.sopSet.시')}</option>
										</select>
									</li>
									<li className={'mr20'}>{i18n.t('setting.sopSet.뒤')}</li>
									<li>
										<select ref={this.refRecoverEndMode} style={{ width: "135px" }} name="" id="" className={'dslSel' + " " + 'sm'} onChange={this.onChangeRecover}>
											<option value={SettingResource.sopEndMode.end}>{i18n.t('setting.sopSet.자동 종료')}</option>
											<option value={SettingResource.sopEndMode.confirm}>{i18n.t('setting.sopSet.확인 후 자동 종료')}</option>
											<option value={SettingResource.sopEndMode.notEnd}>{i18n.t('setting.sopSet.종료 안함')}</option>
										</select>
									</li>
								</ul>
							</div>

							<div style={{ width: "100%", padding: "20px 0px 20px 0px" }}>
								<div className={'stgName' + " " + 'bdNon' + " " + 'mb0'/*  + " " + 'mt40' */}>
									<h5>{i18n.t('setting.sopSet.결과 요약창 설정')}</h5>
									<span className={'stgTltp'} data-tooltip={i18n.t('setting.sopSet.SOP 결과 요약창을 설정합니다.')}></span>
								</div>
								<ul className={'stgMode'}>
									<li><label htmlFor="stgMode01">{i18n.t('setting.sopSet.SOP 결과요약창')}</label><input ref={this.refUseResultSummary} type="checkbox" name="stgMode" id="stgMode01" onChange={(e) => this.onChangeUseResultSummary(e.target)} /></li>
								</ul>
							</div>
						</div>
					</span>
				</div>
			</>
        );
    }
}