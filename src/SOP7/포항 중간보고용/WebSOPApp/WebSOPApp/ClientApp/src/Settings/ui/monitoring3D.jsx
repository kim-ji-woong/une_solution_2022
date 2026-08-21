import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Monitoring3DComponent } from '../styled/settingsStyled';
import tooltip_icon from '../images/tooltip-icon.png';
import SettingsResource from '../resource/id';
import SdmsResource from '../../SDMS/resource/id';
import ProjectResource from "../../Root/resource/id";
import Sdms from "../../SDMS/ui/sdms";

class Monitoring3D extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }

    }

    getAutoRotationSetting = () => {

        let defaultValue = SettingsResource.autoRotation.none;

        const settings = this.props.settings;
        if (!settings)
            return (
                <select onChange={(e) => this.onChangeIdleTime(e)} defaultValue={SettingsResource.autoRotation.none}>
                    <option value={SettingsResource.autoRotation.none}>사용안함</option>
                    <option value={SettingsResource.autoRotation.m15}>15분</option>
                    <option value={SettingsResource.autoRotation.m30}>30분</option>
                    <option value={SettingsResource.autoRotation.m60}>1시간</option>
                </select>
            );

        const idleTime = settings.idleTime;

        const arrIdleTime = idleTime.split(";");

        const useIdleTime = arrIdleTime[1] === "1";
        const idleTimeMinute = parseInt(arrIdleTime[0]);

        if (idleTimeMinute === 15)
            defaultValue = SettingsResource.autoRotation.m15;
        else if (idleTimeMinute === 30)
            defaultValue = SettingsResource.autoRotation.m30;
        else if (idleTimeMinute === 60)
            defaultValue = SettingsResource.autoRotation.m60;

        return (
            <div>
                <p>3D 회전 대기시간/자동회전 설정</p>
                <select onChange={(e) => this.onChangeIdleTime(e)} defaultValue={defaultValue}>
                    <option value={SettingsResource.autoRotation.none}>사용안함</option>
                    <option value={SettingsResource.autoRotation.m15}>15분</option>
                    <option value={SettingsResource.autoRotation.m30}>30분</option>
                    <option value={SettingsResource.autoRotation.m60}>1시간</option>
                </select>
            </div>
        );
    }

    onChangeIdleTime = (e) => {
        this.props.onChangeIdleTime(e.target.value);
    }

    getSensorEventSetting = () => {
        const useReceives = this.props.useReceives;
        
        let atmosChecked = false;
        let kWeatherChecked = false;
        let reductionChecked = false;
        let emissionChecked = false;

        let dicUseReceives = this.makeUseReceiveKeyValues(useReceives);

        if (dicUseReceives) {
            if (dicUseReceives["UseReceiveAtmosphere"]) {
                atmosChecked = true;
            }
            if (dicUseReceives["UseReceiveKWeather"]) {
                kWeatherChecked = true;
            }
            if (dicUseReceives["UseReceiveEmission"]) {
                emissionChecked = true;
            }
            if (dicUseReceives["UseReceiveReduction"]) {
                reductionChecked = true;
            }
        }


        return (
            <div>
                <p>센서 유형별 이벤트 발생 표시 설정 </p>
                <div>
                    <input type='checkbox' checked={atmosChecked} id={SdmsResource.SensorType.atmosphere} onChange={(e) => this.onChangeUseReceive(e)}/>
                    <label htmlFor='sensor_1'>대기센서</label>
                </div>
                <div>
                    <input type='checkbox' checked={kWeatherChecked} id={SdmsResource.SensorType.kWeather} onChange={(e) => this.onChangeUseReceive(e)}/>
                    <label htmlFor='sensor_1'>케이웨더</label>
                </div>
                <div>
                    <input type='checkbox' checked={reductionChecked} id={SdmsResource.SensorType.reduction} onChange={(e) => this.onChangeUseReceive(e)}/>
                    <label htmlFor='sensor_2'>저감설비</label>
                </div>
                <div>
                    <input type='checkbox' checked={emissionChecked} id={SdmsResource.SensorType.discharge} onChange={(e) => this.onChangeUseReceive(e)}/>
                    <label htmlFor='sensor_3'>배출설비</label>
                </div>
            </div>
        );

    }
    
    makeUseReceiveKeyValues = (useReceives) => {
        let result = {};
        
        if (!useReceives)
            return result;
        
        useReceives.forEach((useReceive) => {
            result[useReceive.propertyName] = useReceive.propertyValue;
        });
        return result;
    }

    onChangeUseReceive = (e) => {
        this.props.onChangeUseReceives(e.target.id);
    }

    getEventViewSetting = () => {
        const settings = this.props.settings;
        if (!settings)
            return;
        
        let currentChecked = false;
        let moveChecked = false;

        const moveDisplayAlarm = settings.moveDisplayAlarm;
        
        if (moveDisplayAlarm === SettingsResource.moveDisplayAlarm.currentDisplay)
            currentChecked = true;
        
        if (moveDisplayAlarm === SettingsResource.moveDisplayAlarm.moveAlarm)
            moveChecked = true;

        return (
            <div>
                <p>이벤트 발생 시 화면 자동전환 설정</p>
                <div>
                    <input type='radio' checked={currentChecked} name='eventView' id='current' onChange={(e) => this.onChangeMoveDisplay(e)}/>
                    <label htmlFor='current'>현재화면 유지</label>
                </div>
                <div>
                    <input type='radio' checked={moveChecked} name='eventView' id='move' onChange={(e) => this.onChangeMoveDisplay(e)}/>
                    <label htmlFor='move'>이벤트 발생 위치로 화면이동</label>
                </div>
            </div>
        );
    }
    
    onChangeMoveDisplay = (e) => {
        let id = e.target.id;
        if (id === "current")
            this.props.onChangeMoveDisplay(SettingsResource.moveDisplayAlarm.currentDisplay);
        else if (id === "move")
            this.props.onChangeMoveDisplay(SettingsResource.moveDisplayAlarm.moveAlarm);
    }

    onClickResetPopupPosition = () => {
        this.props.onClickResetPopupPosition()
    }

    render() {

        // 3D 회전 대기시간/자동회전 설정 UI
        const autoRotationSettings = this.getAutoRotationSetting();

        // 센서 유형별 이벤트 발생 표시 설정
        const sensorEventSettings = this.getSensorEventSetting();

        // 이벤트 발생 시 화면 자동전환 설정
        const eventViewSettings = this.getEventViewSetting();


        return (
            <Monitoring3DComponent>
                <ul className='contents'>
                    <li className='item'>
                        {autoRotationSettings}
                        <div id='tooltip' data-tooltip="3D 회전 대기시간 및 자동회전을 설정합니다." >
                            <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                        </div>
                    </li>
                    <li className='item'>
                        {sensorEventSettings}
                        <div id='tooltip' data-tooltip="센서 유형별 이벤트 발생 표시를 설정합니다.">
                            <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                        </div>
                    </li>
                    <li className='item'>
                        {eventViewSettings}
                        <div id='tooltip' data-tooltip="이벤트 시 자동 화면 전환 여부를 설정합니다.">
                            <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                        </div>
                    </li>
                    <li className='item margin'>
                        <div>
                            <p>팝업창 위치 초기화 설정</p>
                            <button onClick={() => this.onClickResetPopupPosition()}>시스템 기본값으로 재설정</button>
                        </div>
                        <div id='tooltip' data-tooltip="팝업창 위치를 초기화합니다.">
                            <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                        </div>
                    </li>
                </ul>
            </Monitoring3DComponent>
        );
    }
}

export default withRouter(Monitoring3D);