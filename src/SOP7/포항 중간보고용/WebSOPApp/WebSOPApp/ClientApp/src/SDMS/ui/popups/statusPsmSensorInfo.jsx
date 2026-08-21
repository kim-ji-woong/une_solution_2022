
import React, { Component } from 'react';

import PopupDraggable from './popupDraggable';
import { StatusPsmSensorInfoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';

import tooltip_icon from '../../images/tooltip_icon.svg';
import SDMS from "../sdms";

class StatusPsmSensorInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            opacity: 1,
            sensorIsNull: false,
            weatherIsNull: false
        }
    }

    changePopupOpacity = (value) => {
        this.setState({ opacity: value });
    }
    

    // 임계치 툴팁 띄우기
    onTooltip = (value) => {
        const target = document.getElementById('toolTipContent');

        if (value) {
            target.classList.add('on');
        } else {
            target.classList.remove('on');
        }
    }

    getCriticalMass = (sensors) => {
        const criticalMassContent = [];
        
        const externalMaterials = this.props.externalMaterials;
        if (externalMaterials === null || externalMaterials === undefined) {
            // 임계치 정보 없음.
            return;
        }
        
        let element = [];
        
        for (const externalMaterial of externalMaterials) {
            
            if (!sensors.find(sensor => sensor.sensorType === externalMaterial.materialID))
                continue;
            
            // if (externalMaterial.materialID === SdmsResource.busanExternalMaterialType.Temp ||
            //     externalMaterial.materialID === SdmsResource.busanExternalMaterialType.Humi ||
            //     externalMaterial.materialID === SdmsResource.busanExternalMaterialType.WindDirection ||
            //     externalMaterial.materialID === SdmsResource.busanExternalMaterialType.WindSpeed)
            //     continue;

            if (externalMaterial.materialID === SdmsResource.busanExternalMaterialType.WindDirection ||
                externalMaterial.materialID === SdmsResource.busanExternalMaterialType.WindSpeed)
                continue;
            
            let alarmLevel1, alarmLevel2, alarmLevel3, alarmLevel4;
            
            const materialName = externalMaterial.materialName;
            if (externalMaterial.direction === 3) {
                [alarmLevel1, alarmLevel2, alarmLevel3, alarmLevel4] = this.getAlarmLevelFromJson(externalMaterial);
            }
            else 
            {
                if (externalMaterial.min1 === null || externalMaterial.min1 === undefined
                    || externalMaterial.max1 === null || externalMaterial.max1 === undefined
                    || externalMaterial.min2 === null || externalMaterial.min2 === undefined
                    || externalMaterial.max2 === null || externalMaterial.max2 === undefined)
                    continue;
                
                alarmLevel1 = externalMaterial.min1 + ' - ' + externalMaterial.max1;
                alarmLevel2 = externalMaterial.max1 + ' - ' + externalMaterial.min2;
                alarmLevel3 = externalMaterial.min2 + ' - ' + externalMaterial.max2;
                alarmLevel4 = externalMaterial.max2 + ' - ';
            }
            const el =
                <li className='toolTipBody' key={externalMaterial?.materialID}>
                    <div><span>{materialName}</span></div>
                    <div><span>{alarmLevel1}</span></div>
                    <div><span>{alarmLevel2}</span></div>
                    <div><span>{alarmLevel3}</span></div>
                    <div><span>{alarmLevel4}</span></div>
                </li>
            
            element.push(el);
        }

        criticalMassContent.push(
            <div id='toolTipContent' key="toolTipContent">
                <ul>
                    <li className='toolTipHead'>
                        <div><span>측정항목</span></div>
                        <div><span className='blueTxt'>좋음</span></div>
                        <div><span className='blueTxt'>보통</span></div>
                        <div><span className='yellowTxt'>나쁨</span></div>
                        <div><span className='redTxt'>매우나쁨</span></div>
                    </li>
                    {element}
                </ul>
            </div>
        );

        return criticalMassContent;
    }
    
    getAlarmLevelFromJson = (externalMaterial) => {
        let alarmLevel1, alarmLevel2, alarmLevel3, alarmLevel4;
        
        let thresholdInfo = JSON.parse(externalMaterial.info);

        let strArrAlarmLevel1 = thresholdInfo[1].split(",");
        let strArrAlarmLevel2 = thresholdInfo[2].split(",");
        let strArrAlarmLevel3 = thresholdInfo[3].split(",");

        alarmLevel1 = strArrAlarmLevel1[0] + '-' + strArrAlarmLevel1[1]; // n~n
        alarmLevel2 = strArrAlarmLevel2[0] + "-" + strArrAlarmLevel1[0] + " , " + strArrAlarmLevel1[1] + "-" + strArrAlarmLevel2[1]; // n~n, n~n
        alarmLevel3 = strArrAlarmLevel3[0] + "-" + strArrAlarmLevel2[0] + " , " + strArrAlarmLevel2[1] + "-" + strArrAlarmLevel3[1]; // n~n, n~n
        alarmLevel4 = strArrAlarmLevel3[0] + "↓ " + strArrAlarmLevel3[1] + "↑" // n 미만, n 초과

        return [alarmLevel1, alarmLevel2, alarmLevel3, alarmLevel4];
    }
    
    getSensorDatas = (sensors) => {

        let normalSensors = [];
        let weatherSensors = [];
        
        for (let i = 0; i < sensors.length; i++) {
            const sensor = sensors[i];
            if (sensor.sensorType === SdmsResource.busanExternalMaterialType.WindDirection ||
                sensor.sensorType === SdmsResource.busanExternalMaterialType.WindSpeed) {
                weatherSensors.push(sensor);
            }
            else if (sensor.sensorType === SdmsResource.busanExternalMaterialType.Temp ||
                sensor.sensorType === SdmsResource.busanExternalMaterialType.Humi) {
                weatherSensors.push(sensor);
                normalSensors.push(sensor);
            }    
            else {
                normalSensors.push(sensor);
            }
        }
        
        let normalIdx = 1;
        let status = 1;
        let normalDatas = [];
        for (const sensor of normalSensors) {
            status = this.props.getAlarmLevelFromSensor(sensor);
            let element = { 
                index: normalIdx, 
                category: sensor.sensorTypeName, 
                value: parseFloat(sensor.value).toFixed(2), 
                status: status 
            };
            normalIdx++;
            normalDatas.push(element);
        }
        
        // test data
        // const datas = [
        //     {index: 1, category: 'PM2.5', value: '15㎍', status: 1},
        //     {index: 2, category: 'PM2.5', value: '15㎍', status: 2},
        //     {index: 3, category: 'PM2.5', value: '15㎍', status: 3},
        //     {index: 4, category: 'PM2.5', value: '15㎍', status: 4}
        // ];

        const chart_back = Array.from({length: 8}, (_, i) => <span key={i} className={'chartStickNormal'}></span>);
        const chart_stick = Array.from({length: 7}, (_, i) => <span key={i} className={'chartStickBlack'}></span>);
        
        let weatherIsNull = false;

        const sensorUI = normalDatas.length < 1 ? (
            <li className='noData'>
                <p><span>데이터 값이 없습니다.</span></p>
            </li>
        ) : normalDatas.map(data => (
            <li className={data.status === 4 ? 'warning' : null} key={data.index}>
                <div><span>{data.category}</span></div>
                <div><span>{data.value}</span></div>
                <div>
                    <div className={'chartArea'}>
                        <div className={'blackStickBox'}>
                            {chart_stick}
                        </div>
                        <div className={'chartStickBox'}>
                            {chart_back}
                        </div>
                        <div className={'chartAnimate' + data.status}></div>
                    </div>
                </div>
            </li>
        ));
        
        // 대기센서에서 날씨 관련 센서 종류: 온도, 습도, 풍향, 풍속
        let temp = weatherSensors.find(sensor => sensor.sensorType === SdmsResource.busanExternalMaterialType.Temp) ? 
            weatherSensors.find(sensor => sensor.sensorType === SdmsResource.busanExternalMaterialType.Temp).value : "N/A";
        let humi = weatherSensors.find(sensor => sensor.sensorType === SdmsResource.busanExternalMaterialType.Humi) ?
            weatherSensors.find(sensor => sensor.sensorType === SdmsResource.busanExternalMaterialType.Humi).value : "N/A";
        let windDirection = weatherSensors.find(sensor => sensor.sensorType === SdmsResource.busanExternalMaterialType.WindDirection) ?
            weatherSensors.find(sensor => sensor.sensorType === SdmsResource.busanExternalMaterialType.WindDirection).value : "N/A";
        let windSpeed = weatherSensors.find(sensor => sensor.sensorType === SdmsResource.busanExternalMaterialType.WindSpeed) ?
            weatherSensors.find(sensor => sensor.sensorType === SdmsResource.busanExternalMaterialType.WindSpeed).value : "N/A";
        
        windDirection = this.getWindDirection(windDirection); // value => string direction
        
        temp = parseFloat(temp).toFixed(2);
        humi = parseFloat(humi).toFixed(2);
        windSpeed = parseFloat(windSpeed).toFixed(2);
        
        let weatherUI =
            <div className="contentBox weather">
                <p className='contentName'>기상정보</p>
                <ul>
                    <li>
                        <p>온도</p>
                        <p>습도</p>
                        <p>풍향</p>
                        <p>풍속</p>
                    </li>
                    <li>
                        {
                            weatherIsNull ?
                                <p className='noData'>데이터 값이 없습니다.</p> :
                                <>
                                    <p>{temp}</p>
                                    <p>{humi}</p>
                                    <p>{windDirection}</p>
                                    <p>{windSpeed}m/s</p>
                                </>
                        }
                    </li>
                </ul>
            </div>

        return [sensorUI, weatherUI];
    }
    
    getWindDirection = (value) => {
        const compassPoints = ["북", "북북동", "북동", "동북동", "동", "동남동", "남동", "남남동", "남", "남남서", "남서", "서남서", "서", "서북서", "북서", "북북서"];
        const index = Math.round(((value %= 360) < 0 ? value + 360 : value) / 22.5) % 16;
        return compassPoints[index];
    }

    IsValidSensor = (sensors) => {
        // 기본값 True => 데이터가 없을 경우 , False => 데이터가 있을 경우
        let sensorIsNull = true;
        let weatherIsNull = true;

        if (sensors.length !== 0) sensorIsNull = false;

        for (let i = 0; i < sensors.length; i++) {
            const sensor = sensors[i];

            if (sensor.sensorType === SdmsResource.busanExternalMaterialType.Temp ||
                sensor.sensorType === SdmsResource.busanExternalMaterialType.Humi ||
                sensor.sensorType === SdmsResource.busanExternalMaterialType.WindDirection ||
                sensor.sensorType === SdmsResource.busanExternalMaterialType.WindSpeed) {
                weatherIsNull = false;
                break;
            }
        }

        return [sensorIsNull, weatherIsNull];
    }
    
    getContentsUI = () => {
        const selectedSensor = this.props.selectedSensor;
        const selectedSensorType = this.props.selectedSensorType;
        
        if (selectedSensor === null || selectedSensor === undefined) {
            return;
        }
        
        if (selectedSensorType === null || selectedSensorType === undefined) {
            return;
        }
        
        let sensorIsNull = false;
        let weatherIsNull = false;
        
        let sensors = selectedSensor.sensors;
        
        [sensorIsNull, weatherIsNull] = this.IsValidSensor(sensors);
        
        let getCriticalMass = this.getCriticalMass(sensors);
        let [sensorUI, weatherUI] = this.getSensorDatas(sensors);
        
        let title = selectedSensorType.id === SdmsResource.SensorType.atmosphere ? '센코 대기오염측정기' : 'K-Weather 측정기';
        title += ' - ' + selectedSensor.position;
        
        let entireUI =
            <div className={'content'}>
                <div className="contentBox chart">
                    <p className='contentName'>{title}</p>
                    {
                        !sensorIsNull &&
                        <div id='tooltip'>
                            <img src={tooltip_icon}
                                 alt='임계치 보기 아이콘'
                                 onMouseEnter={() => this.onTooltip(true)}
                                 onMouseOut={() => this.onTooltip(false)}
                            />
                            {getCriticalMass}
                        </div>
                    }
                    <div id='tooltip'>
                        <img src={tooltip_icon}
                             alt='임계치 보기 아이콘'
                             onMouseEnter={() => this.onTooltip(true)}
                             onMouseOut={() => this.onTooltip(false)}
                        />
                        {getCriticalMass}
                    </div>
                    <ul className='head'>
                        <li>
                            <p>항목</p>
                            <p>수치</p>
                            <p>위험도</p>
                        </li>
                    </ul>
                    <ul className='body scrollbar'>
                        {sensorUI}
                    </ul>
                </div>
                {weatherUI}
            </div>

        return entireUI;
    }

    render() {
        let opacity = this.state.opacity;
        //const sensorIsNull = this.state.sensorIsNull;
        //const weatherIsNull = this.state.weatherIsNull;
        //const getCriticalMass = this.getCriticalMass();
        //const sensorUI = this.getSensorDatas();

        const contents = this.getContentsUI();

        return (
            <StatusPsmSensorInfoComponent id={this.props.popupType} className='UI_Section statusPsmSensorInfo'
                                          $opacity={opacity} $resize={true}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={300}
                    popupMinHeight={400}
                    topSize={40}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >
                    <div className='dslTop'>
                        <h5 className='dslTitle'>
                            {SdmsResource.ID.menu.statusPsmSensorInfo}
                        </h5>
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
                        <button className='dslX'
                                onClick={() => this.props.setVisiblePopups(SDMS.menu.statusPsmSensorInfo, false)}>닫기
                        </button>
                    </div>

                    {contents}
                </PopupDraggable>
            </StatusPsmSensorInfoComponent>
        );
    }
}

export default StatusPsmSensorInfo;


