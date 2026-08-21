import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';

import ProjectResource from '../../Root/resource/id';
import SettingsResource from '../resource/id';
import { SettingsController } from '../services/settingsController';
import { UserDispatch } from '../../Root/resource/userDispatch';

import ConfirmDialog from '../../Common/ui/confirmDialog';

import { Monitoring3DComponent } from '../styled/settingsStyled';

class Monitoring3D extends Component {
    constructor(props) {
        super(props);

		this.state = {
            tabMenu: 'normal',

            confirmMessage: {
                visible: false,
                messages: [""],
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null,
                type: null
            },
        }

		this.props = props;
	}


    showConfirmDialog = (messages, buttons, onClickButton, type) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.messages = messages;
		confirmMessage.buttons = buttons;
		confirmMessage.onClickButton = onClickButton;
		confirmMessage.type = type;

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

    onClickTab = (target, value) => {
		$('.menu').removeClass('on');
		$(target).addClass('on');

		this.setState({ tabMenu: value });
	}

    render() {
        
        return (
            <>
            <Monitoring3DComponent>
                <nav>
                    <ul>
                        <li className='menu on' onClick={(e) => this.onClickTab(e.target, 'normal')}>일반</li>
                        <li className='menu' onClick={(e) => this.onClickTab(e.target, 'detection')}>센서감지관리</li>
                    </ul>
                </nav>
                {
                    this.state.tabMenu === 'normal' &&
                        <NormalTab
                            showConfirmDialog={this.showConfirmDialog}
                            onCloseConfirmDialog={this.onCloseConfirmDialog}
                            option3DNormal={this.props.option3DNormal}
                            onClickClosePopup={this.props.onClickClosePopup}
                            checkPopupStateReset={this.props.checkPopupStateReset}
                        />
                }
                {
                    this.state.tabMenu === 'detection' &&
                        <DetectionTab
                            showConfirmDialog={this.showConfirmDialog}
                            onCloseConfirmDialog={this.onCloseConfirmDialog}
                            option3DSensor={this.props.option3DSensor}
                        />
                }
            </Monitoring3DComponent>
            {
                /* alert창 대신 사용 */
                this.state.confirmMessage.visible &&
                <ConfirmDialog 
                    messages={this.state.confirmMessage.messages} 
                    buttons={this.state.confirmMessage.buttons} 
                    onClose={this.state.confirmMessage.onClose}
                    onClickButton={this.state.confirmMessage.onClickButton}
                    onCloseConfirmDialog={this.onCloseConfirmDialog}
                    type={this.state.confirmMessage.type}
                />
            }
            </>
        )
    }
}

export default withRouter(Monitoring3D);


// 일반 탭
class NormalTab extends Component {
    constructor(props) {
        super(props);

		this.props = props;

        this.refIdleTime = React.createRef();
		this.refIdleTimeUse = React.createRef();
	}

    componentDidMount() {
        this.initData();
    }

    initData() {
        if(this.props.option3DNormal === null || this.props.option3DNormal === undefined)
            return;

        // 3D 회전 대기시간 입력
        let idleTime = this.props.option3DNormal.autoRotationIdleMinutes;
        let useAutoRotation = this.props.option3DNormal.useAutoRotation;

        if (idleTime === null || idleTime === undefined)
			idleTime = 10;

        this.refIdleTime.current.value = idleTime;
        this.refIdleTimeUse.current.checked = useAutoRotation;
    }

    onClickPopupReset = () => {
		// 시스템 팝업 위치/사이즈 리셋
		this.props.showConfirmDialog(['팝업창 위치/사이즈 초기화를 하시겠습니까?'], ['취소', '확인'], this.onClickDialogPopupReset, 'error');
	}

    onClickDialogPopupReset = (index) => {
		if (index === 1) {
			this.doPopupReset();
		}

		this.props.onCloseConfirmDialog();
	}

    doPopupReset = async () => {
        let userInfo = ProjectResource.getUserInfo();

        if (userInfo === null || userInfo === undefined)
            return;

        const [result, message] = await SettingsController.requestResetPopup(userInfo.id);

        if(!result) {
            this.props.showConfirmDialog([message], null, null, 'error');
        }
        else {
            this.props.showConfirmDialog(['초기화되었습니다.'], null, null, 'success');
            this.props.checkPopupStateReset(true);
        }
    }

    onChangeCheck = (e) => {
		let value = e.target.value;
		let inputValue = value.replace(/[^0-9\b]/g, '');

		if (!$.isNumeric(inputValue)) {
			this.refIdleTime.current.value = "";
		} else {
			this.refIdleTime.current.value = inputValue;
        }
	}

	onBlurCheck = (e) => {
		let value = e.value;

		if (value !== "") {
			let num = parseFloat(value);
			value = num.toString();
        } 

		if (value === "0") {
            this.props.showConfirmDialog(['0 은 입력하실 수 없습니다.'], null, null, 'error');
			value = "10";
        }

		this.refIdleTime.current.value = value;

		if (this.props.option3DNormal === null || this.props.option3DNormal === undefined)
			return;

		let use = this.refIdleTimeUse.current.checked;
		let useValue = "1";

		if (use === false)
			useValue = "0";

		value = value;
		this.props.option3DNormal.autoRotationIdleMinutes = value;
	}

    onChangeIdleTimeUse = () => {
        if (this.props.option3DNormal === null || this.props.option3DNormal === undefined)
			return;

		let value = this.refIdleTime.current.value;
		let use = this.refIdleTimeUse.current.checked;
		let useValue = "1";

		if (use === false)
			useValue = "0";

		value = useValue;
		this.props.option3DNormal.autoRotationIdleMinutes = value;
		this.props.option3DNormal.useAutoRotation = use;
    }

    render() {

        return (
            <div className='listWrap'>
                <div className={'listItem'}>
                    <h5>3D 회전 대기시간</h5>
                    <span className={'toolTip'} data-tooltip="3D 회전 대기시간을 설정 합니다." />
                    <input type="text" ref={this.refIdleTime} className={'settingInput'} name="" id="" onChange={(e) => this.onChangeCheck(e)} onBlur={(e) => this.onBlurCheck(e.target)} />
                    <span className={'inputText gray'}>분</span>
                    <input type="checkbox" ref={this.refIdleTimeUse} className='settingCheckBox' onChange={this.onChangeIdleTimeUse} />
                    <span className={'inputText'} onChange={() => this.onChangeIdleTimeUse()}>자동회전 사용</span>
                </div>

                <div className={'listItem'}>
                    <h5>팝업창 위치/사이즈 초기화</h5>
                    <span className={'toolTip'} data-tooltip="팝업창위치 및 사이즈를 초기화 합니다." />
                    <button onClick={this.onClickPopupReset} className='settingButton'>시스템 기본값</button>
                </div>
            </div>
        )
    }
}

// 센서감지관리 탭
class DetectionTab extends Component {
    static contextType = UserDispatch;

    constructor(props) {
        super(props);

		this.state = {
        }

		this.props = props;

        this.refDisAlm01 = React.createRef();
		this.refDisAlm02 = React.createRef();
		this.refDisAlm03 = React.createRef();

		this.refUseReceiveGas = React.createRef();
		this.refUseReceiveAtmosphere = React.createRef();
		this.refUseReceiveEmergencyBell = React.createRef();
		this.refUseReceiveThermalCamera = React.createRef();
		this.refUseReceiveWorker = React.createRef();
		this.refUseReceiveFire = React.createRef();
		this.refUseReceiveFacilityError = React.createRef();
	}

    componentDidMount() {
        // this.initMoveDisplayAlarm();
        this.initReceiveType();
    }

    // initMoveDisplayAlarm() {
    //     // 이벤트 자동 화면전환 데이터 입력
    //     if (this.props.option3DSensor === null || this.props.option3DSensor === undefined)
    //         return;

    //     const moveDisplayAlarm = this.props.option3DSensor.moveDisplayAlarm;

	// 	if (moveDisplayAlarm === SettingsResource.moveDisplayAlarm.currentDisplay) {
	// 		this.refDisAlm01.current.click();
	// 	} else if (moveDisplayAlarm === SettingsResource.moveDisplayAlarm.firstAlarm) {
	// 		this.refDisAlm02.current.click();
	// 	} else if (moveDisplayAlarm === SettingsResource.moveDisplayAlarm.lastAlarm) {
	// 		this.refDisAlm03.current.click();
	// 	}
    // }

    initReceiveType() {
        // 유형별 알람 설정 데이터 입력
        const { setting } = this.context;
        const option3DSensor = setting[0].settingState;

        if(option3DSensor) {
            const receiveGasAlarm = option3DSensor.receiveGasAlarm;
            const receiveAtmosphereAlarm = option3DSensor.receiveAtmosphereAlarm;
            const receiveEmergencyBellAlarm = option3DSensor.receiveEmergencyBellAlarm;
            const receiveThermalCameraAlarm = option3DSensor.receiveThermalCameraAlarm;
            const receiveWorkerAlarm = option3DSensor.receiveWorkerAlarm;
            const receiveFireAlarm = option3DSensor.receiveFireAlarm;
            const receiveFacilityError = option3DSensor.receiveFacilityError;
    
            this.refUseReceiveGas.current.checked = receiveGasAlarm;
            this.refUseReceiveAtmosphere.current.checked = receiveAtmosphereAlarm;
            this.refUseReceiveEmergencyBell.current.checked = receiveEmergencyBellAlarm;
            this.refUseReceiveThermalCamera.current.checked = receiveThermalCameraAlarm;
            this.refUseReceiveWorker.current.checked = receiveWorkerAlarm;
            this.refUseReceiveFire.current.checked = receiveFireAlarm;
            this.refUseReceiveFacilityError.current.checked = receiveFacilityError;
        }
    }

    selectDisplayAlarm = (mode) => {
		if (mode === null || mode === undefined || this.props.option3DSensor.moveDisplayAlarm === mode)
			return;

		if (mode === SettingsResource.moveDisplayAlarm.currentDisplay || 
			mode === SettingsResource.moveDisplayAlarm.firstAlarm ||
			mode === SettingsResource.moveDisplayAlarm.lastAlarm) {
			this.props.option3DSensor.moveDisplayAlarm = mode;
		} 
	}

    onChangeReceiveGas = (e) => {
		const value = e.checked;
		if (this.props.option3DSensor.receiveGasAlarm === value) {
			return;
        }
		this.props.option3DSensor.receiveGasAlarm = value;
	}

    onChangeReceiveAtmosphere = (e) => {
		const value = e.checked;
		if (this.props.option3DSensor.receiveAtmosphereAlarm === value) {
			return;
        }
		this.props.option3DSensor.receiveAtmosphereAlarm = value;
	}

    onChangeReceiveEmergencyBell = (e) => {
		const value = e.checked;
		if (this.props.option3DSensor.receiveEmergencyBellAlarm === value) {
			return;
        }
		this.props.option3DSensor.receiveEmergencyBellAlarm = value;
	}

    onChangeReceiveThermalCamera = (e) => {
		const value = e.checked;
		if (this.props.option3DSensor.receiveThermalCameraAlarm === value) {
			return;
        }
		this.props.option3DSensor.receiveThermalCameraAlarm = value;
	}

    onChangeReceiveWorker = (e) => {
		const value = e.checked;
		if (this.props.option3DSensor.receiveWorkerAlarm === value) {
			return;
        }
		this.props.option3DSensor.receiveWorkerAlarm = value;
	}

    onChangeReceiveFire = (e) => {
		const value = e.checked;
		if (this.props.option3DSensor.receiveFireAlarm === value) {
			return;
        }
		this.props.option3DSensor.receiveFireAlarm = value;
	}

    onChangeReceiveFacilityError = (e) => {
		const value = e.checked;
		if (this.props.option3DSensor.receiveFacilityError === value) {
			return;
        }
		this.props.option3DSensor.receiveFacilityError = value;
	}


    render() {

        return (
            <div className='listWrap'>
                <div className={'sensorItem'}>
                    <div>
                        <h5>유형별 알람 설정</h5>
                        <span className={'toolTip'} data-tooltip="유형별 알람을 설정 합니다." />
                    </div>
                    <ul>
                        <li>
                            <input ref={this.refUseReceiveGas} type="checkbox" className='settingCheckBox' onChange={(e) => this.onChangeReceiveGas(e.target)} />
                            <span>가스</span>
                        </li>
                        <li>
                            <input ref={this.refUseReceiveAtmosphere} type="checkbox" className='settingCheckBox' onChange={(e) => this.onChangeReceiveAtmosphere(e.target)} />
                            <span>대기오염</span>
                        </li>
                        <li>
                            <input ref={this.refUseReceiveEmergencyBell} type="checkbox" className='settingCheckBox' onChange={(e) => this.onChangeReceiveEmergencyBell(e.target)} />
                            <span>비상벨</span>
                        </li>
                        <li>
                            <input ref={this.refUseReceiveThermalCamera} type="checkbox" className='settingCheckBox' onChange={(e) => this.onChangeReceiveThermalCamera(e.target)} />
                            <span>열화상카메라</span>
                        </li>
                        <li>
                            <input ref={this.refUseReceiveWorker} type="checkbox" className='settingCheckBox' onChange={(e) => this.onChangeReceiveWorker(e.target)} />
                            <span>작업자</span>
                        </li>
                        <li>
                            <input ref={this.refUseReceiveFire} type="checkbox" className='settingCheckBox' onChange={(e) => this.onChangeReceiveFire(e.target)} />
                            <span>화재</span>
                        </li>
                        <li>
                            <input ref={this.refUseReceiveFacilityError} type="checkbox" className='settingCheckBox' onChange={(e) => this.onChangeReceiveFacilityError(e.target)} />
                            <span>불량감지</span>
                        </li>
                    </ul>
                </div>
                {/* <div className={'sensorItem'}>
                    <div>
                        <h5>이벤트 자동 화면전환</h5>
                        <span className={'toolTip'} data-tooltip="이벤트 발생시 자동 화면 전환 여부를 설정 합니다." />
                    </div>
                    <ul>
                        <li>
                            <input ref={this.refDisAlm01} type="radio" name="eventScreen" className='settingCheckBox' onChange={() => this.selectDisplayAlarm(SettingsResource.moveDisplayAlarm.currentDisplay)} />
                            <span className={'inputText'}>현재화면 유지</span>
                        </li>
                        <li>
                            <input ref={this.refDisAlm02} type="radio" name="eventScreen" className='settingCheckBox' onChange={() => this.selectDisplayAlarm(SettingsResource.moveDisplayAlarm.firstAlarm)} />
                            <span className={'inputText'}>첫번째 알람 화면으로 이동</span>
                        </li>
                        <li>
                            <input ref={this.refDisAlm03} type="radio" name="eventScreen" className='settingCheckBox' onChange={() => this.selectDisplayAlarm(SettingsResource.moveDisplayAlarm.lastAlarm)} />
                            <span className={'inputText'}>마지막 알람 화면으로 이동</span>
                        </li>
                    </ul>
                </div> */}
            </div>
        )
    }
}