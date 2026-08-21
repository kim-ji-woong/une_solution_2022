import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { SopSetComponent } from '../styled/settingsStyled';
import tooltip_icon from '../images/tooltip-icon.png';
import ToggleSwitch from '../../Common/ui/toggleSwitch';
import Theme from '../../Root/styled/theme';
import SopLink from './sopLink';

class SopSet extends Component {
    constructor(props) {
        super(props);

		this.state = {
            useSMS: true,              // 문자전파 사용 설정
            sopAutoClose: true,        // SOP 자동종료 설정
            useResultSummary: true,    // SOP 결과 요약창 설정
            showSopLinkPopup: false    // SOP Link 팝업 표출 유무
        }
	}

    handlePopup = (isShow) => {
        this.setState({ showSopLinkPopup: isShow });
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

    setChecked = (sopType) => {
        if (sopType === 'useSMS') {
            this.setState({ useSMS: !this.state.useSMS });
        } 
        else if (sopType === 'sopAutoClose') {
            this.setState({ sopAutoClose: !this.state.sopAutoClose });
        } 
        else if (sopType === 'useResultSummary') {
            this.setState({ useResultSummary: !this.state.useResultSummary });
        } 
    }

    render() {
        let comboHourUI = this.setComboHourUI();
        let comboMinuteUI = this.setComboMinuteUI();

        return (
            <>
            <SopSetComponent>
                <ul className='contents'>
                    <li className='item'>
                        <div>
                            <p>SOP 모드 시간 설정</p>
                            <div className='selectWrap'>
                                <span className='innerTxt'>평일 주간시간</span>
                                <select className='short'>
                                    {comboHourUI}
                                </select>
                                <span className='innerTxt'>:</span>
                                <select className='short'>
                                    {comboMinuteUI}
                                </select>
                                <span className='innerTxt'>~</span>
                                <select className='short'>
                                    {comboHourUI}
                                </select>
                                <span className='innerTxt'>:</span>
                                <select className='short'>
                                    {comboMinuteUI}
                                </select>
                            </div> 
                        </div>
                        <div id='tooltip' data-tooltip="SOP모드 시간을 설정합니다." >
                            <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                        </div>
                    </li>
                    <li className='item'>
                        <div>
                            <p>문자전파 사용 설정</p>
                            <ToggleSwitch 
                                left="OFF" 
                                right="ON" 
                                leftcolor="#000" 
                                rightcolor={Theme.fontPrimary}
                                leftbgcolor="#384355" 
                                rightbgcolor={Theme.primary} 
                                sopType="useSMS"
                                setChecked={this.setChecked}
                                isChecked={this.state.useSMS}
                            />
                        </div>
                        <div id='tooltip' data-tooltip="문자전파 사용 여부를 설정합니다." >
                            <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                        </div>
                    </li>
                    <li className='item'>
                        <div>
                            <p>SOP 자동종료 설정</p>
                            <ToggleSwitch 
                                left="OFF" 
                                right="ON" 
                                leftcolor="#000" 
                                rightcolor={Theme.fontPrimary}
                                leftbgcolor="#384355" 
                                rightbgcolor={Theme.primary} 
                                sopType="sopAutoClose"
                                setChecked={this.setChecked}
                                isChecked={this.state.sopAutoClose}
                            />
                            <div>
                                <select disabled={this.state.sopAutoClose ? false : true}>
                                    <option>15분</option>
                                    <option>30분</option>
                                    <option>1시간</option>
                                </select>
                                <span className='innerTxt'>미 입력 시 SOP 자동종료</span>
                            </div>
                        </div>
                        <div id='tooltip' data-tooltip="대기상태의 SOP 자동종료를 설정합니다." >
                            <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                        </div>
                    </li>
                    <li className='item'>
                        <div>
                            <p>SOP 결과 요약창 설정</p>
                            <ToggleSwitch 
                                left="OFF" 
                                right="ON" 
                                leftcolor="#000" 
                                rightcolor={Theme.fontPrimary}
                                leftbgcolor="#384355" 
                                rightbgcolor={Theme.primary} 
                                sopType="useResultSummary"
                                setChecked={this.setChecked}
                                isChecked={this.state.useResultSummary}
                            />
                        </div>
                        <div id='tooltip' data-tooltip="SOP 결과 요약창을 설정합니다." >
                            <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                        </div>
                    </li>
                    <li className='item margin'>
                        <div>
                            <p>이벤트 발생 시 실행 SOP 설정</p>
                            <button onClick={() => this.handlePopup(true)}>고급 설정</button>
                        </div>
                        <div id='tooltip' data-tooltip="이벤트 발생 시 실행할 SOP를 설정합니다." >
                            <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                        </div>
                    </li>
                </ul>
            </SopSetComponent>
            {
                this.state.showSopLinkPopup &&
                <SopLink
                    handlePopup={this.handlePopup}
                />
            }
            </>
        );
    }
}

export default withRouter(SopSet);