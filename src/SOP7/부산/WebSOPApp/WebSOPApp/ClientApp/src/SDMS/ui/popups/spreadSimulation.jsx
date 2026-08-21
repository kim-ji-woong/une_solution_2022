import React, { Component } from 'react';
import $ from 'jquery';
import PopupDraggable from './popupDraggable';
import { SpreadSimulationComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/esm/locale';
import calendar_icon from '../../images/calendar_icon.svg';
import pbb_img from '../../images/ppb_img.svg';
import tooltip_icon from '../../images/tooltip_icon.svg';
import ProjectResource from "../../../Root/resource/id";

import DateCalendar from '../../../Common/ui/calendar';

class SpreadSimulation extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            opacity: 1,
            menu: true,        // true: 실시간 모델, false: 예보 모델
            play: false,        // true: 시뮬레이션 실행, false: 정지
            
            // initial date is YYYY-MM-DD
            date: new Date(),
            
            isOpenDatepicker: false,
            
            currentTime: 0,
            
            altitudes: [1.5, 15, 45, 60],
            times: [0], // 데이터가 존재하는 시간목록
            isStart: false,
            
            averageData: {
                ou: 0,
                windSpeed: 0
            },
            
            defaultValues: {
                realtime: {
                    play: false,
                    date: new Date(),
                    altitude: 1.5,
                    time: 0,
                    averageData: {
                        ou: 0,
                        windSpeed: 0
                    }
                },
                forecast: {
                    play: false,
                    date: new Date(),
                    altitude: 1.5,
                    time: 0,
                    averageData: {
                        ou: 0,
                        windSpeed: 0
                    }
                }
            },

            showCalendar: false,
            selectedDate: new Date(),
        }

        this.mounted = true;

        // this.refDatepicker = React.createRef(); // react-datepicker 미사용
    }

    onClickDate = (date) => {
        
        let korFormat = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        
        let parameter = {
            "date": korFormat,
            "type": this.getCurrentType()
        }
        
        if (this.props.wsMgr) {
            if (this.props.wsMgr.connected) {
                this.props.wsMgr.sendDiffusionInfo(parameter);
            }
        }
        
        this.setState({ selectedDate: date, showCalendar: false });
    }

    getSelectedDate = () => {
        const selectedDate = this.state.selectedDate;

        if (selectedDate) {
            const date = new Date(selectedDate);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    }
    
    componentDidMount() {
        // 최초 설정 전송
        this.sendDiffusionInfo();
    }

    setSimulationInfoFromApp = (header, content) => {
        if (header === 51) {
            let date = content.date;
            date = new Date(date);
            let times = content.hours.map(item => parseInt(item));
            
            if (!times || times.length === 0) {
                this.props.showConfirmDialog(ProjectResource.dialogTypes.INFO, ["데이터가 존재하지 않습니다."], ["확인"], this.props.onCloseConfirmDialog);
            }
            
            this._setState({ date, times })
        } 
        
        if (header === 52) {
            let currentTime = content.hour;
            let averageData = {
                ou: content.conc,
                windSpeed: content.wind
            }
            this._setState({ currentTime, averageData });
        }
    }
    
    sendDiffusionInfo = () => {
        
        let parameter = {
            "date": this.getNowDate(),
            "type": this.getCurrentType()
        }
        
        if (this.props.wsMgr) {
            if (this.props.wsMgr.connected) {
                this.props.wsMgr.sendDiffusionInfo(parameter);
            }
        }
    }
    
    getCurrentType = () => {
        if (this.state.menu) {
            // true면 실시간
            return "r";
        } 
        
        // false면 예보
        return "f";
    }

    _setState = (state, callback) => {
        if (this.mounted) {
            this.setState(state, callback);
        }
    }
    
    getNowDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        return year + '-' + month + '-' + day;
    }

    changePopupOpacity = (value) => {
        this._setState({ opacity: value });
    }
    
    changeTimeStampOnMouseUp = (e) => {
        const value = e.target.value;
        
        let parameter = {
            "hour": parseInt(value)
        };
        
        if (this.props.wsMgr && this.props.wsMgr.connected) {
            this.props.wsMgr.sendDiffusionSimulationTimeChanged(parameter);
        }
        
        this._setState({currentTime: value});
    }
    
    onClickDatepicker = (e) => {
        this.setState({ showCalendar: !this.state.showCalendar });
	}
    
    onClickAltitude = (value) => {
        let altitudes = this.state.altitudes;
        
        if (altitudes.includes(value)) {
            altitudes = altitudes.filter(item => item !== value);
            this.sendAltitude(value, 0);
        } else {
            altitudes.push(value);
            altitudes.sort((a, b) => a - b);
            this.sendAltitude(value, 1);
        }
        
        this.setState({ altitudes });
    }
    
    sendAltitude = (altitude, status) => {
        if (this.props.wsMgr && this.props.wsMgr.connected) {
            let parameter = {
                "heightType": altitude,
                "value": status
            }
            this.props.wsMgr.sendDiffusionHeightVisibleCategory(parameter);
        }
    }
    
    getAltitudeUI = () => {
        
        let altitudes = this.state.altitudes;
        let altitude = [1.5, 15, 45, 60];
        let altitudeUI = [];
        
        for (let i = 0; i < altitude.length; i++) {
            const altitudeBtnClassName = altitudes.includes(altitude[i]) ? "on" : "off";
            altitudeUI.push(
                <button className={altitudeBtnClassName} onClick={() => this.onClickAltitude(altitude[i])}>{altitude[i] + "m"}</button>
            );
        }
        
        return altitudeUI;
    }
    
    onClickPlay = () => {
        const play = this.state.play;
        /*
        * 실행시 웹소켓으로 옵션값 전송 
        */
        
        if (this.props.wsMgr && this.props.wsMgr.connected) {
            if (play) {
                // 정지
                this.props.wsMgr.sendStopDiffusionSimulation();
            } else {
                // 시작
                this.props.wsMgr.sendPlayDiffusionSimulation();
            }
        }

        this._setState({ play: !play });
    }
    
    onChangeMenu = (menu) => { // true: 실시간, false: 예보
        let parameter = {
            "date": this.getNowDate(),
            "type": menu ? "r" : "f"
        }
        
        if (this.props.wsMgr) {
            if (this.props.wsMgr.connected) {
                this.props.wsMgr.sendDiffusionInfo(parameter);
            }
        }
        
        this._setState({ 
            menu, 
            play: false, 
            times: [0], 
            currentTime: 0,
            averageData: {
                ou: 0,
                windSpeed: 0
            },
            date: new Date(),
            altitudes: [1.5, 15, 45, 60]
            
        });
    }
    
    getMinMaxTime = () => {
        const times = this.state.times;
        let min = 0;
        let max = 0;
        
        if (times.length > 0) {
            min = times[0];
            max = times[times.length - 1];
        }
        
        return [min, max];
    }

    render() {
        let { opacity, menu, play, showCalendar, selectedDate } = this.state;
        const altitudeUI = this.getAltitudeUI();
        
        const [min, max] = this.getMinMaxTime();
        
        return (
            <SpreadSimulationComponent id={this.props.popupType} className='UI_Section simulation' $opacity={opacity} $resize={false}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={300}
                    popupMinHeight={254}
                    topSize={40}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                    usePopupResize={false}
                >
                    <div className='dslTop'>
                        <h5 className='dslTitle'>
                            {SdmsResource.ID.menu.simulation}
                        </h5>
                        <div className='spreadRange'>
                            <input
                                type="range"
                                className="rangeInput"
                                min={0.1}
                                max={1}
                                color="gray"
                                step={0.1}
                                defaultValue={opacity}
                                onChange={(e) => {
                                    this.changePopupOpacity(e.target.valueAsNumber)
                                }}
                            />
                        </div>
                        {/*<button className='dslX' onClick={() => this.props.setVisiblePopups(SdmsResource.ID.menu.simulation, false)}>닫기</button>*/}
                    </div>

                    <div className={'content'}>
                        <div className='menuBtn'>
                            <button className={menu ? 'on' : null} onClick={() => this.onChangeMenu(true)}>실시간 모델</button>
                            <button className={!menu ? 'on' : null} onClick={() => this.onChangeMenu(false)}>예보 모델</button>
                        </div>
                        <div className="contentBox flex">
                            <div className='contentHeadWrap'>
                                <p className='contentName'>기본값 설정</p>
                                <div id='tooltip' data-tooltip={menu ? "특정 일자의 데이터를 실시간으로 불러올 수 있는 기능" : "한시간 뒤 데이터를 예보할 수 있는 기능"} >
                                    <img src={tooltip_icon} alt='도움말 아이콘' />
                                </div>
                            </div>
                            <ul className='defaultWrap'>
                                <li>
                                    <p>날짜</p>
                                    {
                                        menu ? 
                                            <div className={'datepicker'}>
                                                {/* <DatePicker ref={this.refDatepicker} name="datepicker01" id="datepicker01"
                                                    dateFormat="yyyy-MM-dd"
                                                    locale={ko}
                                                    minDate={new Date("2024-10-18")}
                                                    maxDate={new Date()}
                                                    selected={this.state.date}
                                                    onSelect={date => this.onChangeBegin(date)}
                                                    shouldCloseOnSelect={true}
                                                /> */}
                                                {
                                                    showCalendar ?
                                                    <DateCalendar
                                                        onClickDate={this.onClickDate}
                                                        onClickDatepicker={this.onClickDatepicker}
                                                        selectedDate={selectedDate}
                                                    /> : 
                                                    <div
                                                        onClick={(e) => this.onClickDatepicker(e)}
                                                        style={{ background: '#222A38', width: '118px', height: '26px', padding: '5px 10px', borderRadius: '2px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', cursor: 'pointer' }}
                                                    >{this.getSelectedDate()}</div>
                                                }
                                                <img src={calendar_icon} alt="" className={'btnCalendarBk'} onClick={(e) => this.onClickDatepicker(e)} style={{ cursor: 'pointer' }} />
                                            </div>
                                            : <div>{this.getNowDate()}</div>
                                    }
                                </li>
                                <li>
                                    <p>고도</p>
                                    <div>
                                        {altitudeUI}
                                    </div>
                                </li>
                                <li>
                                    <p>시뮬레이션 실행</p>
                                    <div>
                                        <p>{this.state.currentTime}</p>
                                        <button className={play ? 'off' : 'on'} onClick={() => this.onClickPlay()}>실행 버튼</button>
                                    </div>
                                </li>
                                <li>
                                    <input
                                        type="range"
                                        className="timeStampInput"
                                        min={min}
                                        max={max}
                                        color="gray"
                                        step={1}
                                        defaultValue={this.state.currentTime}
                                        onMouseUp={(e) => {
                                            this.changeTimeStampOnMouseUp(e)
                                        }}
                                        
                                    />
                                    <div>
                                        <p>{min}</p>
                                        <p>{max}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="contentBox flex">
                            <p className='contentName'>평균 데이터</p>
                            <ul className='dataWrap'>
                                <li>
                                    <p>대기유해물질</p>
                                    <p>{this.state.averageData.ou}</p>
                                </li>
                                <li>
                                    <p>풍속(m/s)</p>
                                    <p>{this.state.averageData.windSpeed}</p>
                                </li>
                            </ul>
                        </div>
                        <div className="contentBox flex">
                            <p className='contentName'>대기유해물질 범례</p>
                            <div className='legendWrap'>
                                <div>
                                    <p>0</p>
                                    <p>3</p>
                                    <p>10</p>
                                    <p>50</p>
                                    <p>100</p>
                                </div>
                                <img src={pbb_img} alt='대기유해물질 범례 이미지' />
                            </div>
                        </div>
                    </div>
                </PopupDraggable>
            </SpreadSimulationComponent>
        );
    }
}

export default SpreadSimulation;