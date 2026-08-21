import React, { Component } from 'react';
import { Container } from 'reactstrap';
import SelectSOP from './selectSOP';
import $ from 'jquery';
import newStyles from '../../../Common/css/newStyle.module.css';
import newDefaults from '../../../Common/css/newDefault.module.css';
import settings from '../../css/settings.module.css';
import SettingsResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';
import AccountResource from '../../../Account/resource/id';
import SettingResource from '../../resource/id';

//import SelectSOP from '../../../Settings/ui/popups/selectSOP';
import AdvancedTab from './sopAdvancedTab';

import { SettingCommon, StgTab, SopSetCont } from '../../styled/SettingStyled';


class SopSet extends Component {
    constructor(props) {
        super(props);


		this.state = {
			selectSOPOnOff: false,
			tabMenu: SettingResource.ID.sopMode.general,
		}

        this.props = props;
	}

	/* test */
	onClickTab = (target, value) => {
		$('.GeneralTab li a').removeClass('on');
		$(target).addClass('on');

		this.setState({ tabMenu: value });
	}

	setContentUI = () => {
		let contentUI = [];

		if (this.state.tabMenu === SettingResource.ID.sopMode.general) {
			contentUI.push(<GeneralTab key="GeneralTab" settings={this.props.settings} />);
		} else if (this.state.tabMenu === SettingResource.ID.sopMode.advanced) {
			contentUI.push(<AdvancedTab key="AdvancedTab" settings={this.props.settings} buildingGroupList={this.props.buildingGroupList} disasterCategories={this.props.disasterCategories} spreadMessages={this.props.spreadMessages} teamTreeDatas={this.props.teamTreeDatas} teams={this.props.teams} members={this.props.members}
				linkedSOPs={this.props.linkedSOPs} updateLinkedSops={this.props.updateLinkedSops} showConfirmDialog={this.props.showConfirmDialog} />);
		} 

		return contentUI;
	}

	getAuthorTab() {
		let authorTabUI = [];
		authorTabUI.push(<React.Fragment><li><a onClick={(e) => this.onClickTab(e.target, SettingResource.ID.sopMode.general)} className={'on'}>일반</a></li></React.Fragment>);

		let userInfo = ProjectResource.getUserInfo();
		if (userInfo === null || userInfo === undefined)
			return authorTabUI;

		if (userInfo.level === AccountResource.ID.accountLevel.admin) {
			authorTabUI.push(<React.Fragment>
				<li><a onClick={(e) => this.onClickTab(e.target, SettingResource.ID.sopMode.advanced)}>고급</a></li>
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
		//let comboHourUI = this.setComboHourUI();
		//let comboMinuteUI = this.setComboMinuteUI();
		const contentUI = this.setContentUI();
		const authorTabUI = this.getAuthorTab();
		this.state.onOffState = true;


        return (
			<>
				<StgTab className={'stgTab' + " GeneralTab"}>
					{authorTabUI}
				</StgTab>
				<span className={'stgScroll'}>
					{contentUI}
				</span>
            </>
        );
    }
}

export default SopSet;


class GeneralTab extends Component {
	constructor(props) {
		super(props);

		this.refUseAutoMoveSOPScreen = React.createRef();
		//this.refUseBroadcast = React.createRef();
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
			//selectSOPOnOff: false,
			//tabMenu: SettingResource.ID.sopMode.general,
		}

		this.props = props;
	}

	componentDidMount() {
		this.initData();
		this.initWorkingHour();
		this.initWaitEndTime();
		this.initRecoverEndTime();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.settings !== this.props.settings) {
			this.initData();
			this.initWorkingHour();
			this.initWaitEndTime();
			this.initRecoverEndTime();
		}
	}

	initData() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let useAutoMoveSOPScreen = this.props.settings.useAutoMoveSOPScreen;
		let useBroadcast = this.props.settings.useBroadcast;
		let useSMS = this.props.settings.useSMS;
		let useEmail = this.props.settings.useEmail;
		let useConfirm = this.props.settings.useConfirm;
		let useResultSummary = this.props.settings.useResultSummary;

		if (useAutoMoveSOPScreen === "true") {
			this.refUseAutoMoveSOPScreen.current.checked = true;
		} else if (useAutoMoveSOPScreen === "false") {
			this.refUseAutoMoveSOPScreen.current.checked = false;
		}
		//this.refUseAutoMoveSOPScreen.current.click();

		if (useBroadcast === "true") {

		}
		//this.refUseBroadcast.current.click();

		if (useSMS === "true") {
			this.refUseSMS.current.checked = true;
		} else if (useSMS === "false") {
			this.refUseSMS.current.checked = false;
		}			
		//this.refUseSMS.current.click();

		//if (useEmail === "true")
		//	this.refUseEmail.current.checked = true;
		//else if (useEmail === "false")
		//	this.refUseEmail.current.checked = false;
			//this.refUseEmail.current.click();

		if (useConfirm === "true")
			this.refUseConfirm.current.checked = true;
		else if (useConfirm === "false")
			this.refUseConfirm.current.checked = false;
			//this.refUseConfirm.current.click();

		if (useResultSummary === "true")
			this.refUseResultSummary.current.checked = true;
		else if (useResultSummary === "false")
			this.refUseResultSummary.current.checked = false;
			//this.refUseResultSummary.current.click();
	}

	initWaitEndTime() {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let data = null;
		data = this.props.settings.fireSOPWaitEndTime;

		let arrData = data.split(";");

		if (arrData.length !== 3) {
			data = "10;1;2";
			arrData = data.split(";");
		}

		this.refWaitEndTime.current.value = SettingResource.facilityType.Fire.toString();
		this.refWaitTime.current.value = arrData[0];
		this.refWaitTimeUnit.current.value = arrData[1];
		this.refWaitEndMode.current.value = arrData[2];
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

		this.refRecoverEndTime.current.value = SettingResource.facilityType.Fire.toString();
		this.refRecoverTime.current.value = arrData[0];
		this.refRecoverTimeUnit.current.value = arrData[1];
		this.refRecoverEndMode.current.value = arrData[2];
	}

	onChangeWaitEndTime = () => {
		let type = this.refWaitEndTime.current.value;
		let data = null;

		if (this.props.settings === null || this.props.settings === undefined)
			return;

		if (type === SettingResource.facilityType.Fire.toString()) {
			data = this.props.settings.fireSOPWaitEndTime;
		} else if (type === SettingResource.facilityType.PSM.toString()) {
			data = this.props.settings.psmsopWaitEndTime;
		} else if (type === SettingResource.facilityType.ETC.toString()) {
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

		if (type === SettingResource.facilityType.Fire.toString()) {
			data = this.props.settings.fireSOPRecoverEndTime;
		} else if (type === SettingResource.facilityType.PSM.toString()) {
			data = this.props.settings.psmsopRecoverEndTime;
		} else if (type === SettingResource.facilityType.ETC.toString()) {
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


	initWorkingHour() {
		if (this.props.settings === null || this.props.settings === undefined)
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

	onChangeWorkingBeginHour = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.value;
		let workingBeginMinute = this.refWorkingBeginMinute.current.value;

		this.props.settings.workingBeginHour = value + ":" + workingBeginMinute;
	}

	onChangeWorkingBeginMinute = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.value;
		let workingBeginHour = this.refWorkingBeginHour.current.value;

		this.props.settings.workingBeginHour = workingBeginHour + ":" + value;
	}

	onChangeWorkingEndHour = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.value;
		let workingEndMinute = this.refWorkingEndMinute.current.value;

		this.props.settings.workingEndHour = value + ":" + workingEndMinute;
	}

	onChangeWorkingEndMinute = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.value;
		let workingEndHour = this.refWorkingEndHour.current.value;

		this.props.settings.workingEndHour = workingEndHour + ":" + value;
	}

	onChangeUseAutoMoveSOPScreen = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();

		this.props.settings.useAutoMoveSOPScreen = value;
	}

	onChangeUseBroadcast = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();

		this.props.settings.useBroadcast = value;
	}

	onChangeUseSMS = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();

		this.props.settings.useSMS = value;
	}

	onChangeUseEmail = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();

		this.props.settings.useEmail = value;
	}

	onChangeUseConfirm = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();

		this.props.settings.useConfirm = value;
	}

	onChangeUseResultSummary = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let value = e.checked.toString();

		this.props.settings.useResultSummary = value;
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

		if (type === SettingResource.facilityType.Fire.toString()) {
			this.props.settings.fireSOPWaitEndTime = value;
		} else if (type === SettingResource.facilityType.PSM.toString()) {
			this.props.settings.psmsopWaitEndTime = value;
		} else if (type === SettingResource.facilityType.ETC.toString()) {
			this.props.settings.etcsopWaitEndTime = value;
		}
	}

	onChangeRecover = (e) => {
		if (this.props.settings === null || this.props.settings === undefined)
			return;

		let type = this.refRecoverEndTime.current.value;
		let time = this.refRecoverTime.current.value;
		let timeUnit = this.refRecoverTimeUnit.current.value;
		let endMode = this.refRecoverEndMode.current.value;

		let value = time + ";" + timeUnit + ";" + endMode;

		if (type === SettingResource.facilityType.Fire.toString()) {
			this.props.settings.fireSOPRecoverEndTime = value;
		} else if (type === SettingResource.facilityType.PSM.toString()) {
			this.props.settings.psmsopRecoverEndTime = value;
		} else if (type === SettingResource.facilityType.ETC.toString()) {
			this.props.settings.etcsopRecoverEndTime = value;
		}
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
	}

	/* onClickSelectSOP = () => {
		this.setState({ selectSOPOnOff: true });
	}

	displaySelectSOP = () => {
		if (this.state.selectSOPOnOff === true)
			return (<> <SelectSOP selectSOPOff={this.selectSOPOff} buildingGroupList={this.props.buildingGroupList} disasterCategories={this.props.disasterCategories} linkedSOPs={this.props.linkedSOPs} /> </>);
	}
	selectSOPOff = () => {
		this.setState({ selectSOPOnOff: false });
	} */

	render() {
		let comboHourUI = this.setComboHourUI();
		let comboMinuteUI = this.setComboMinuteUI();
		//const contentUI = this.setContentUI();
		//const authorTabUI = this.getAuthorTab();
		//this.state.onOffState = true;


		return (
			<>
				{/* <ul className={newStyles.stgTabSOP + " " + newStyles.single}>
					<li><a className={newStyles.on}>일반</a></li>
					<li><a onClick={this.onClickSelectSOP}>고급설정</a></li>
				</ul> */}

				<SopSetCont className={'stgList'}>
					{/* <span className={newStyles.stgScroll}> */}
					<div className={'stgHalfGeneral'}>
					    <div style={{ display : 'flex' }}>
							<div className={'stgName bdNon mb0 pb0'}>
								<h5>일반 설정</h5>
								<span className={'stgTltp'} data-tooltip="자동 화면 이동을 설정합니다."></span>
							</div>
							<ul className={'stgMode'}>
								<li><input ref={this.refUseAutoMoveSOPScreen} type="checkbox" name="stgCpnt" id="stgCpnt" onChange={(e) => this.onChangeUseAutoMoveSOPScreen(e.target)} /><label>실행중인 컴포넌트로 자동 화면 이동</label></li>
							</ul>
						</div>
						<div>
							{/* <div className={'stgName bdNon mb0 pb0'}>
								<span className={'stgTltp'} data-tooltip="상황 전파 옵션을 설정 합니다."></span>
							</div> */}
							<ul className={'stgMode'}>
							{/* <li><input ref={this.refUseBroadcast} type="checkbox" name="stgStat" id="stgStat01" onChange={(e) => this.onChangeUseBroadcast(e.target)} /><label htmlFor="stgStat01">방송전파</label></li> */}
								<li><input ref={this.refUseSMS} type="checkbox" name="stgStat" id="stgStat02" onChange={(e) => this.onChangeUseSMS(e.target)} /><label htmlFor="stgStat02">문자전파</label></li>
							{/*	<li><input ref={this.refUseEmail} type="checkbox" name="stgStat" id="stgStat03" onChange={(e) => this.onChangeUseEmail(e.target)} /><label htmlFor="stgStat03">이메일전파</label></li> */}
								<li><input ref={this.refUseConfirm} type="checkbox" name="stgStat" id="stgStat04" onChange={(e) => this.onChangeUseConfirm(e.target)} /><label htmlFor="stgStat04">상황전파시 확인단계 거치기</label></li>
							</ul>
						</div>
					</div>

					<div className={'stgScreenBox'}>
						<div className={'stgScreenMove'}>
						   <h5>SOP 자동 화면 이동</h5>
						   <span className={'stgTltp'} data-tooltip="SOP 자동 화면 이동을 설정합니다."></span>
						</div>
						<ul className={'stgScreenCheck'}>
							<li><input type="checkbox" name="stgStat" id="stgStat01" /><label htmlFor="stgStat01">ON</label></li>
							<li><input type="checkbox" name="stgStat" id="stgStat02" /><label htmlFor="stgStat02">OFF</label></li>
						</ul>
				    </div>

					<div className={'stgHalf'}>
						<div>
							<div className={'stgName bdNon mb0 pb0'}>
								<h5>시간 설정</h5>
								<span className={'stgTltp'} data-tooltip="시간 설정 옵션을 설정합니다."></span>
							</div>
							<dl className={'stgTime'}>
								<dt>평일 주간 시간대</dt>
								<dd>
							        <ul style={{ display: 'inline-block', marginRight: '16px' }}>
										<li>
											<select ref={this.refWorkingBeginHour} style={{ width:"50px"}} className={'dslSel sm'} onChange={(e) => this.onChangeWorkingBeginHour(e.target)} >
												{comboHourUI}
											</select>
										</li>
										<li>시</li>
										<li>
											<select ref={this.refWorkingBeginMinute} style={{ width: "50px" }} className={'dslSel sm'} onChange={(e) => this.onChangeWorkingBeginMinute(e.target)}>
												{comboMinuteUI}
											</select>
										</li>
										<li>분 부터</li>
									</ul>
									<ul style={{ display: 'inline-block' }}>
										<li>
											<select ref={this.refWorkingEndHour} style={{ width: "50px" }} className={'dslSel sm'} onChange={(e) => this.onChangeWorkingEndHour(e.target)}>
												{comboHourUI}
											</select>
										</li>
										<li>시</li>
										<li>
											<select ref={this.refWorkingEndMinute} style={{ width: "50px" }} className={'dslSel sm'} onChange={(e) => this.onChangeWorkingEndMinute(e.target)}>
												{comboMinuteUI}
											</select>
										</li>
										<li>분 까지</li>
									</ul>
								</dd>
							</dl>
						</div>
				    </div>

				    {/* <div className={newStyles.stgHalf}>
						<div style={{ display: 'flex' , flexDirection: 'initial' }}>
							<div className={newStyles.stgName + " " + newStyles.bdNon + " " + newDefaults.mb0 + " " + newDefaults.pb0}>
								<h5>고급 설정</h5>
								<span className={newStyles.stgTltp} data-tooltip="고급 설정 옵션을 설정 합니다."></span>
							</div>
							<div className={newStyles.stgHigh}>
								<p className={newDefaults.mr10}>센서 신호별 실행SOP 설정하기</p>
								<a className={newStyles.stgnRset} onClick={this.onClickSelectSOP}>설정</a>
							</div>
						</div>
				    </div> */}

					<div className={'stgHalfStatus mb0'}>
				        <div style={{ flexGrow: '1' }}>
							<div className={'stgName bdNon mb0'}>
								<h5>대기상태 SOP 자동종료</h5>
								<span className={'stgTltp'} data-tooltip="대기상태 SOP 자동 종료를 설정합니다."></span>
								<a onClick={this.onClickWaitEndAllSave} className={'stgnRset'}>모두 적용</a>
							</div>
							<ul className={'stgRstr'}>
								<li>
									<select ref={this.refWaitEndTime} name="" id="" className={'dslSel sm'} onChange={this.onChangeWaitEndTime}>
										<option value={SettingResource.facilityType.Fire}>화재</option>
										<option value={SettingResource.facilityType.PSM}>누출</option>
										<option value={SettingResource.facilityType.ETC}>기타</option>
									</select>
								</li>
								<li><input ref={this.refWaitTime} type="text" name="" id="" className={'dsrTxt sm'} onChange={this.onChangeWaitNumCheck} onBlur={this.onChangeWait} /></li>
								<li>
									<select ref={this.refWaitTimeUnit} name="" id="" className={'dslSel sm'} onChange={this.onChangeWait}>
										<option value={SettingResource.timeUnit.second} >초</option>
										<option value={SettingResource.timeUnit.minute} >분</option>
										<option value={SettingResource.timeUnit.hour} >시</option>
									</select>
								</li>
								<li className={newDefaults.mr20}>동안 미입력시</li>
								<li>
									<select ref={this.refWaitEndMode} name="" id="" className={'dslSel smLarge'} onChange={this.onChangeWait}>
										<option value={SettingResource.sopEndMode.end}>자동 종료</option>
										<option value={SettingResource.sopEndMode.confirm}>확인 후 자동종료</option>
										<option value={SettingResource.sopEndMode.notEnd}>종료 안함</option>
									</select>
								</li>
							</ul>
						</div>

						<div style={{ flexGrow: '1' }}>
							<div className={'stgName bdNon mb0'}>
								<h5>센서신호 복구시 SOP 자동 종료</h5>
								<span className={'stgTltp'} data-tooltip="센서 신호 복구 시 SOP 자동 종료를 설정합니다."></span>
								<a onClick={this.onClickRecoverEndAllSave} className={'stgnRset'}>모두 적용</a>
							</div>
							<ul className={'stgRstr'}>
								<li>
									<select ref={this.refRecoverEndTime} name="" id="" className={'dslSel sm'} onChange={this.onChangeRecoverEndTime} >
										<option value={SettingResource.facilityType.Fire}>화재</option>
										<option value={SettingResource.facilityType.PSM}>누출</option>
										<option value={SettingResource.facilityType.ETC}>기타</option>
									</select>
								</li>
								<li className={newDefaults.mr20}>센서 신호 복구 후</li>
								<li><input ref={this.refRecoverTime} type="text" name="" id="" className={'dsrTxt sm'} onChange={this.onChangeRecoverNumCheck} onBlur={this.onChangeRecover} /></li>
								<li>
									<select ref={this.refRecoverTimeUnit} name="" id="" className={'dslSel sm'} onChange={this.onChangeRecover}>
										<option value={SettingResource.timeUnit.second} >초</option>
										<option value={SettingResource.timeUnit.minute} >분</option>
										<option value={SettingResource.timeUnit.hour} >시</option>
									</select>
								</li>
								<li className={'mr20'}>뒤</li>
								<li>
									<select ref={this.refRecoverEndMode} name="" id="" className={'dslSel sm'} onChange={this.onChangeRecover}>
										<option value={SettingResource.sopEndMode.end}>자동 종료</option>
										<option value={SettingResource.sopEndMode.confirm}>확인 후 자동종료</option>
										<option value={SettingResource.sopEndMode.notEnd}>종료 안함</option>
									</select>
								</li>
							</ul>
					    </div>
				    </div>

					<div style={{ display: 'flex', flexDirection: 'initial', alignItems: 'center', marginTop: '15px' }}>
						<div className={'stgName bdNon mb0 pb0'}>
							<h5>SOP 결과 요약창 설정</h5>
							<span className={'stgTltp'} data-tooltip="SOP 결과 요약창을 설정합니다."></span>
						</div>
						<ul className={'stgMode'}>
							<li><input ref={this.refUseResultSummary} type="checkbox" name="stgMode" id="stgMode01" onChange={(e) => this.onChangeUseResultSummary(e.target)} /><label htmlFor="stgMode01">SOP 결과요약창 설정</label></li>
						</ul>
					</div>
					{/* </span> */}
				</SopSetCont>

				{/* {this.displaySelectSOP()} */}
			</>
		);
	}
}


