import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import $, { valHooks } from 'jquery';

import SettingsResource from '../resource/id';

import SopLink from './sopLink';

import { SopSetComponent } from '../styled/settingsStyled';

class SopSet extends Component {
    constructor(props) {
        super(props);
		
		this.state = {
            tabMenu: 'normal'
        }
	}

    onClickTab = (target, value) => {
		$('.menu').removeClass('on');
		$(target).addClass('on');

		this.setState({ tabMenu: value });
	}

    render() {

        return (
            <SopSetComponent>
                <nav>
                    <ul>
                        <li className='menu on' onClick={(e) => this.onClickTab(e.target, 'normal')}>일반</li>
                        <li className='menu' onClick={(e) => this.onClickTab(e.target, 'sopLink')}>고급</li>
                    </ul>
                </nav>
                {
                    this.state.tabMenu === 'normal' &&
                        <NormalTab
                            optionSopNormal={this.props.optionSopNormal}
                            showConfirmDialog={this.props.showConfirmDialog}
                        />
                }
                {
                    this.state.tabMenu === 'sopLink' &&
                        <SopLink
                            buildingGroupList={this.props.buildingGroupList}
                            sensorTypes={this.props.sensorTypes}
                            disasterCategories={this.props.disasterCategories}
                            linkedSOPs={this.props.linkedSOPs}
                            updateLinkedSOPs={this.props.updateLinkedSOPs}
                            showConfirmDialog={this.props.showConfirmDialog}
                            updateLinkedSops={this.props.updateLinkedSops}
                            onClickClosePopup={this.props.onClickClosePopup}
                        />
                }
            </SopSetComponent>
        )
    }
}

export default withRouter(SopSet);


// 일반 탭
class NormalTab extends Component {
    constructor(props) {
        super(props);

		this.state = {
        }

        this.refUseAutoMoveSOPScreen = React.createRef();
        this.refUseSms = React.createRef();

        this.refWorkingBeginHour = React.createRef();
		this.refWorkingBeginMinute = React.createRef();
		this.refWorkingEndHour = React.createRef();
		this.refWorkingEndMinute = React.createRef();

		this.refUseWaitEndTime = React.createRef();
		this.refNotUseWaitEndTime = React.createRef();
		this.refWaitTime = React.createRef();
		this.refWaitTimeUnit = React.createRef();
        
        this.refUseResultSummary = React.createRef();
        this.refNotUseResultSummary = React.createRef();
	}

    componentDidMount() {
        this.initSOPNormal();
        this.initWorkingHour();
        this.initSOPAutoClose();
        this.initSOPResultSummary();
    }

    initSOPNormal() {
        if(this.props.optionSopNormal === null || this.props.optionSopNormal === undefined)
        return;

        // 실행중인 컴포넌트로 자동 화면 이동 항목 입력
        const useAutoMoveSOPScreen = this.props.optionSopNormal.useAutoMoveSOPScreen;
        this.refUseAutoMoveSOPScreen.current.checked = useAutoMoveSOPScreen;

        // 문자전파 사용하기 항목 입력
        const useSms = this.props.optionSopNormal.useSms;
        this.refUseSms.current.checked = useSms;
    }

    initWorkingHour() {
        if(this.props.optionSopNormal === null || this.props.optionSopNormal === undefined)
        return;

        // 시간설정 항목 입력
        const workingBeginHour = this.props.optionSopNormal.workingBeginHour;
        const workingBeginMinute = this.props.optionSopNormal.workingBeginMinute;
        const workingEndHour = this.props.optionSopNormal.workingEndHour;
        const workingEndMinute = this.props.optionSopNormal.workingEndMinute;

        this.refWorkingBeginHour.current.value = workingBeginHour;
		this.refWorkingBeginMinute.current.value = workingBeginMinute;

		this.refWorkingEndHour.current.value = workingEndHour;
		this.refWorkingEndMinute.current.value = workingEndMinute;
    }

    initSOPAutoClose() {
        if(this.props.optionSopNormal === null || this.props.optionSopNormal === undefined)
        return;

        // SOP 자동종료 항목 입력
        const useSopAutoClose = this.props.optionSopNormal.useSopAutoClose;

        if(useSopAutoClose) {
            this.refUseWaitEndTime.current.click();
        }
        else {
            this.refNotUseWaitEndTime.current.click();
        }

        const autoCloseTime = this.props.optionSopNormal.autoCloseTime;
        this.refWaitTime.current.value = autoCloseTime;

        const autoCloseTimeUnit = this.props.optionSopNormal.autoCloseTimeUnit;
        this.refWaitTimeUnit.current.value = autoCloseTimeUnit;
    }

    initSOPResultSummary() {
        if(this.props.optionSopNormal === null || this.props.optionSopNormal === undefined)
        return;

        // SOP결과 요약창
        const useSopResultSummary = this.props.optionSopNormal.useSopResultSummary;

        if(useSopResultSummary) {
            this.refUseResultSummary.current.click();
        }
        else {
            this.refNotUseResultSummary.current.click();
        }
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

    leadingZeros(n, digits) {
		var zero = '';
		n = n.toString();

		if (n.length < digits) {
			for (var i = 0; i < digits - n.length; i++)
				zero += '0';
		}
		return zero + n;
	}

    onChangeUseAutoMoveSOPScreen = (e) => {
		if (this.props.optionSopNormal === null || this.props.optionSopNormal === undefined)
			return;

		let value = e.checked;
		this.props.optionSopNormal.useAutoMoveSOPScreen = value;
	}

    onChangeUseSMS = (e) => {
		if (this.props.optionSopNormal === null || this.props.optionSopNormal === undefined)
			return;

		let value = e.checked;
		this.props.optionSopNormal.useSms = value;
	}

    onChangeWorkingBeginHour = (e) => {
		if (this.props.optionSopNormal === null || this.props.optionSopNormal === undefined)
			return;

		let value = e.value;

		this.props.optionSopNormal.workingBeginHour = Number(value);
	}

	onChangeWorkingBeginMinute = (e) => {
		if (this.props.optionSopNormal === null || this.props.optionSopNormal === undefined)
			return;

		let value = e.value;

		this.props.optionSopNormal.workingBeginMinute = Number(value);
	}

	onChangeWorkingEndHour = (e) => {
		if (this.props.optionSopNormal === null || this.props.optionSopNormal === undefined)
			return;

		let value = e.value;

		this.props.optionSopNormal.workingEndHour = Number(value);
	}

	onChangeWorkingEndMinute = (e) => {
		if (this.props.optionSopNormal === null || this.props.optionSopNormal === undefined)
			return;

		let value = e.value;

		this.props.optionSopNormal.workingEndMinute = Number(value);
	}

    selectUseWaitEndTime = (value) => {
        if (this.props.optionSopNormal === null || this.props.optionSopNormal === undefined)
            return;

        this.props.optionSopNormal.useSopAutoClose = value;

        if (value) {
            this.refWaitTime.current.disabled = false;
            this.refWaitTimeUnit.current.disabled = false;
        } else {
            this.refWaitTime.current.disabled = true;
            this.refWaitTimeUnit.current.disabled = true;
        }
    }

    onChangeWait = () => {
        if (this.props.optionSopNormal === null || this.props.optionSopNormal === undefined)
            return;

        let time = this.refWaitTime.current.value;
        let timeUnit = this.refWaitTimeUnit.current.value;

        this.props.optionSopNormal.autoCloseTime = time;
        this.props.optionSopNormal.autoCloseTimeUnit = timeUnit;
    }

    selectUseResultSummary = (value) => {
        if (this.props.optionSopNormal === null || this.props.optionSopNormal === undefined)
            return;

        this.props.optionSopNormal.useSopResultSummary = value;
    }

    onChangeCheck = (e) => {
        if (this.props.optionSopNormal === null || this.props.optionSopNormal === undefined)
        return;

		let value = e.target.value;
		let inputValue = value.replace(/[^0-9\b]/g, '');

		if (!$.isNumeric(inputValue)) {
			this.refWaitTime.current.value = "";
		} else {
			this.refWaitTime.current.value = inputValue;
            this.props.optionSopNormal.autoCloseTime = inputValue;
        }

	}

    onBlurCheck = (e) => {
        if (this.props.optionSopNormal === null || this.props.optionSopNormal === undefined)
            return;

		let value = e.value;

		if (value !== "") {
			let num = parseFloat(value);
			value = num.toString();
        } 

		if (value === "0") {
            this.props.showConfirmDialog(['0 은 입력하실 수 없습니다.'], null, null, 'error');
			value = "10";
        }

		this.refWaitTime.current.value = value;
        this.props.optionSopNormal.autoCloseTime = value;
	}

    render() {
        let comboHourUI = this.setComboHourUI();
        let comboMinuteUI = this.setComboMinuteUI();

        return (
            <div className='listWrap'>
                <div className={'listItem sopSet'}>
                    <div className='left'>
                        <div>
                            <h5>일반</h5>
                            <span className={'toolTip'} data-tooltip="컴포넌트 자동 화면 이동을 설정 합니다." />
                        </div>
                        <ul>
                            <li>
                                <input ref={this.refUseAutoMoveSOPScreen} type="checkbox" className='settingCheckBox' onChange={(e) => this.onChangeUseAutoMoveSOPScreen(e.target)} />
                                <span className={'inputText'}>실행중인 컴포넌트로 자동 화면 이동</span>
                            </li>
                            <li>
                                <input ref={this.refUseSms} type="checkbox" className='settingCheckBox' onChange={(e) => this.onChangeUseSMS(e.target)} />
                                <span className={'inputText'}>문자전파 사용하기</span>
                            </li>
                        </ul>
                    </div>
                    <div className='right'>
                        <div>
                            <h5>시간설정</h5>
                            <span className={'toolTip'} data-tooltip="시간 설정 옵션을 설정 합니다." />
                        </div>
                        <ul>
                            <li className='timeSetting'>
                                <span className={'inputText'}>평일 주간 시간대</span>
                                <div>
                                    <div>
                                        <select ref={this.refWorkingBeginHour} className={'combo'} onChange={(e) => this.onChangeWorkingBeginHour(e.target)}>
                                            {comboHourUI}
                                        </select>
                                        <span className={'inputText gray'}>시</span>
                                        <select ref={this.refWorkingBeginMinute} className={'combo'} onChange={(e) => this.onChangeWorkingBeginMinute(e.target)}>
                                            {comboMinuteUI}
                                        </select>
                                        <span className={'inputText gray'}>분 부터</span>
                                    </div>
                                    <div>
                                        <select ref={this.refWorkingEndHour} className={'combo'} onChange={(e) => this.onChangeWorkingEndHour(e.target)}>
                                            {comboHourUI}
                                        </select>
                                        <span className={'inputText gray'}>시</span>
                                        <select ref={this.refWorkingEndMinute} className={'combo'} onChange={(e) => this.onChangeWorkingEndMinute(e.target)}>
                                            {comboMinuteUI}
                                        </select>
                                        <span className={'inputText gray'}>분 까지</span>
                                    </div>
                                </div>
                            </li>

                        </ul>
                    </div>
                </div>

                <div className={'listItem sopSet'}>
                    <div>
                        <div>
                            <h5>SOP 자동종료</h5>
                            <span className={'toolTip'} data-tooltip="대기상태 SOP 자동종료를 설정 합니다." />
                        </div>
                        <div className='autoShutdown'>
                            <input ref={this.refUseWaitEndTime} type="radio" name="sopAutoEnd" className='settingCheckBox' onChange={() => this.selectUseWaitEndTime(true)} />
                            <span className={'inputText'}>사용</span>
                            <input ref={this.refWaitTime} type="text" className={'settingInput'} onChange={(e) => this.onChangeCheck(e)} onBlur={(e) => this.onBlurCheck(e.target)} />
                            <select ref={this.refWaitTimeUnit} className={'combo'} onChange={() => this.onChangeWait()} >
                                <option value={SettingsResource.timeUnit.second}>초</option>
                                <option value={SettingsResource.timeUnit.minute}>분</option>
                                <option value={SettingsResource.timeUnit.hour}>시</option>
                            </select>
                            <span className={'inputText gray'}>동안 미실행 시 자동종료</span>
                            <input ref={this.refNotUseWaitEndTime} type="radio" name="sopAutoEnd" className='settingCheckBox' onChange={() => this.selectUseWaitEndTime(false)} />
                            <span className={'inputText'}>사용안함</span>
                        </div>
                    </div>
                </div>

                <div className={'listItem sopSet'}>
                    <div>
                        <div>
                            <h5>SOP결과 요약창</h5>
                            <span className={'toolTip'} data-tooltip="SOP 결과 요약창을 설정 합니다." />
                            <input ref={this.refUseResultSummary} type="radio" name="sopResult" className='settingCheckBox' onChange={() => this.selectUseResultSummary(true)} />
                            <span className={'inputText'}>사용</span>
                            <input ref={this.refNotUseResultSummary} type="radio" name="sopResult" className='settingCheckBox' onChange={() => this.selectUseResultSummary(false)} />
                            <span className={'inputText'}>사용안함</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}