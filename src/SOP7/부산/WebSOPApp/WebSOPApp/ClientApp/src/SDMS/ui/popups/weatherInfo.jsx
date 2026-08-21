import React, { Component } from 'react';

import PopupDraggable from './popupDraggable';
import { WeatherInfoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from "../../resource/id";
import LineChart from '../charts/lineChart';

import bearing_icon from '../../images/bearing_icon.svg';

import {SDMSController} from "../../services/sdmsController";

class WeatherInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            opacity: 1,
            weatherProperty: SdmsResource.weatherProperty.temperature,
            dataHistory: null,
        }
        
        this.delay = 1000 * 3;
        
        this.dataTimer = null;
    }
    
    componentDidMount() {
        this.updateWeatherHistory(this.props.selectedSensor.zoneID);
        
        // do this.updateWeatherHistory every 3 seconds
        this.dataTimer = setInterval(() => {
            this.updateWeatherHistory(this.props.selectedSensor.zoneID).catch((error) => {
                console.error("UpdateWeatherHistory failed : weatherInfo.jsx line:34 / Message : " + error);
            });
        }, this.delay);
    }
    
    componentWillUnmount() {
        clearInterval(this.dataTimer);
    }
    
    updateWeatherHistory = async (zoneID) => {
        const weatherHistory = await SDMSController.RequestWeatherHistory(zoneID);
        
        if (!weatherHistory || !weatherHistory.sensorDataHistories) {
            return null;
        }
        
        const data = weatherHistory.sensorDataHistories ? weatherHistory.sensorDataHistories : null;
        
        this.setState({
            dataHistory: data
        });
        
    }

    // 기상정보 팝업 속성
    // static weatherProperty = {
    //     temperature: 1,             // 온도
    //     windDirection: 13,           // 풍향
    //     windSpeed: 14,               // 풍속
    //     humidity: 2,                // 습도
    //     barometric: 16,              // 기압
    //     insolation: 17               // 일사량
    // }
    
    changePopupOpacity = (value) => {
        this.setState({ opacity: value });
    }

    changeWeatherProp = (prop) => {
        this.setState({ weatherProperty: prop });
    }
    
    groupBySensorID = (data) => {
        const boundHistories = data.reduce((acc, cur) => {
            if (acc[cur.sensorID]) {
                acc[cur.sensorID].push(cur);
            } else {
                acc[cur.sensorID] = [cur];
            }
            return acc;
        }, {});
        
        const zoneID = this.props.selectedSensor.zoneID;
        const sensorList = this.props.sensorList?.weathers;
        const selectedSensorList = sensorList.filter(sensor => sensor.zoneID === zoneID);
        
        return  {
            sensorList: selectedSensorList,
            histories: boundHistories
        }
        
    }

    getWeatherChart = () => {
        let weatherProperty = this.state.weatherProperty;
        let chartUI = [];
        
        const sensorList = this.props.sensorList;
        const selectedSensor = this.props.selectedSensor;
        if (!selectedSensor || !sensorList) {
            return null;
        }
        
        const sensors = selectedSensor.sensors;
        if (!sensors) {
            return null;
        }
        
        const dataHistory = this.state.dataHistory ? this.groupBySensorID(this.state.dataHistory) : null;
        if (!dataHistory) {
            return null;
        }
        
        
        
        if (weatherProperty === SdmsResource.weatherProperty.temperature) {
            const labels = ['00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00'];
            const data = [1, 3.5, 6, 7, 2, 5, 1];

            chartUI.push(
                <LineChart 
                    key='lineChart_weather'
                    labels={labels}
                    data={data}
                    unit={'℃'}
                />
            );

            return chartUI;
        }
        else if (weatherProperty === SdmsResource.weatherProperty.windSpeed) {
            const labels = ['00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00'];
            const data = [1, 2, 3, 4, 5, 6, 7];

            chartUI.push(
                <LineChart 
                    key='lineChart_windSpeed'
                    labels={labels}
                    data={data}
                    unit={'m/s'}
                />
            );

            return chartUI;
        }
        else if (weatherProperty === SdmsResource.weatherProperty.humidity) {
            const labels = ['00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00'];
            const data = [7, 6, 5, 4, 3, 2, 1];

            chartUI.push(
                <LineChart 
                    key='lineChart_humidity'
                    labels={labels}
                    data={data}
                    unit={'%'}
                />
            );

            return chartUI;
        }
        else if (weatherProperty === SdmsResource.weatherProperty.barometric) {
            const labels = ['00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00'];
            const data = [1, 1, 2, 2, 3, 3, 4];

            chartUI.push(
                <LineChart 
                    key='lineChart_barometric'
                    labels={labels}
                    data={data}
                    unit={'hpa'}
                />
            );

            return chartUI;
        }
        else if (weatherProperty === SdmsResource.weatherProperty.insolation) {
            const labels = ['00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00'];
            const data = [7, 6, 5, 4, 3, 2, 1];

            chartUI.push(
                <LineChart 
                    key='lineChart_barometric'
                    labels={labels}
                    data={data}
                    unit={'hpa'}
                />
            );

            return chartUI;
        }
        else if (weatherProperty === SdmsResource.weatherProperty.windDirection) {
            const datas = [
                { data1: 5, data2: "00:00" },
                { data1: 6, data2: "00:00" },
                { data1: 2, data2: "00:00" },
                { data1: 3, data2: "00:00" },
                { data1: 4, data2: "00:00" }
            ];
            
            let element = [];
            for(let data of datas) {
                let [name, rotate] = this.getBearingInfo(data.data1);

                element.push(
                    <li key={`windDirection${data.data1}`}>
                        <img 
                            src={bearing_icon}
                            alt={'방위 아이콘'}
                            style={{ rotate: rotate }}
                        />
                        <p>{name}</p>
                        <p>{data.data2}</p>
                    </li>
                );
            }

            chartUI.push(
                <ul className='bearingWrap'>
                    {element}
                </ul>
            );

            return chartUI;
        }
    }

    getBearingInfo = (bearing) => {
        if(bearing === SdmsResource.weatherBearing.east) {
            return ['동', '90deg'];
        }
        else if(bearing === SdmsResource.weatherBearing.southEast) {
            return ['남동', '135deg'];
        }
        else if (bearing === SdmsResource.weatherBearing.northEast) {
            return ['북동', '45deg'];
        }
        else if(bearing === SdmsResource.weatherBearing.south) {
            return ['남', '180deg'];
        }
        else if(bearing === SdmsResource.weatherBearing.southWest) {
            return ['남서', '225deg'];
        }
        else if(bearing === SdmsResource.weatherBearing.west) {
            return ['서', '270deg'];
        }
        else if(bearing === SdmsResource.weatherBearing.northWest) {
            return ['북서', '315deg'];
        }
        else if(bearing === SdmsResource.weatherBearing.north) {
            return ['북', '0deg'];
        }
        else {
            return ['알수없음', '0'];
        }
    }
    
    getPanelUI = () => {
        
        const weatherSensorList = this.props.sensorList?.weathers;
        
        if (!weatherSensorList || weatherSensorList.length === 0 || !this.props.selectedSensor) {
            return null;
        }
        
        const weatherProperty = this.state.weatherProperty;
        
        const zoneID = this.props.selectedSensor.zoneID;
        
        const sensorList = weatherSensorList.find(sensor => sensor.zoneID === zoneID);
        const sensors = sensorList.sensors;
        
        const [tempValue, tempUom] = this.getPanelDataFromSensor(sensors, SdmsResource.weatherProperty.temperature);
        const [humidityValue, humidityUom] = this.getPanelDataFromSensor(sensors, SdmsResource.weatherProperty.humidity);
        const [windDirectionValue, windDirectionUom] = this.getPanelDataFromSensor(sensors, SdmsResource.weatherProperty.windDirection);
        const [windSpeedValue, windSpeedUom] = this.getPanelDataFromSensor(sensors, SdmsResource.weatherProperty.windSpeed);
        const [barometricValue, barometricUom] = this.getPanelDataFromSensor(sensors, SdmsResource.weatherProperty.barometric);
        const [insolationValue, insolationUom] = this.getPanelDataFromSensor(sensors, SdmsResource.weatherProperty.insolation);
        
        return (
            <div className='currentWrap'>
                <ul>
                    <li
                        className={weatherProperty === SdmsResource.weatherProperty.temperature ? 'on' : null}
                        onClick={() => this.changeWeatherProp(SdmsResource.weatherProperty.temperature)}
                    >
                        <p>온도</p>
                        <p>{parseFloat(tempValue).toFixed(2) + tempUom}</p>
                    </li>
                    <li
                        className={weatherProperty === SdmsResource.weatherProperty.humidity ? 'on' : null}
                        onClick={() => this.changeWeatherProp(SdmsResource.weatherProperty.humidity)}
                    >
                        <p>습도</p>
                        <p>{parseFloat(humidityValue).toFixed(2) + humidityUom}</p>
                    </li>
                    <li
                        className={weatherProperty === SdmsResource.weatherProperty.windDirection ? 'on' : null}
                        onClick={() => this.changeWeatherProp(SdmsResource.weatherProperty.windDirection)}
                    >
                        <p>풍향</p>
                        <p>{this.getWindDirectionString(windDirectionValue)}</p>
                    </li>
                </ul>
                <ul>
                    <li
                        className={weatherProperty === SdmsResource.weatherProperty.windSpeed ? 'on' : null}
                        onClick={() => this.changeWeatherProp(SdmsResource.weatherProperty.windSpeed)}
                    >
                        <p>풍속</p>
                        <p>{parseFloat(windSpeedValue).toFixed(2) + windSpeedUom}</p>
                    </li>
                    <li
                        className={weatherProperty === SdmsResource.weatherProperty.barometric ? 'on' : null}
                        onClick={() => this.changeWeatherProp(SdmsResource.weatherProperty.barometric)}
                    >
                        <p>기압</p>
                        <p>{parseFloat(barometricValue).toFixed(2) + barometricUom}</p>
                    </li>
                    <li
                        className={weatherProperty === SdmsResource.weatherProperty.insolation ? 'on' : null}
                        onClick={() => this.changeWeatherProp(SdmsResource.weatherProperty.insolation)}
                    >
                        <p>일사량</p>
                        <p>{parseFloat(insolationValue).toFixed(3) + insolationUom}</p>
                    </li>
                </ul>
            </div>
        );
        
    }
    
    getWindDirectionString = (windDirection) => {
        // windDirection = 0~359 8방위 문자열로 표현
        switch (true) {
            case (windDirection >= 337.5 || windDirection < 22.5):
                return '북';
            case (windDirection >= 22.5 && windDirection < 67.5):
                return '북동';
            case (windDirection >= 67.5 && windDirection < 112.5):
                return '동';
            case (windDirection >= 112.5 && windDirection < 157.5):
                return '남동';
            case (windDirection >= 157.5 && windDirection < 202.5):
                return '남';
            case (windDirection >= 202.5 && windDirection < 247.5):
                return '남서';
            case (windDirection >= 247.5 && windDirection < 292.5):
                return '서';
            case (windDirection >= 292.5 && windDirection < 337.5):
                return '북서';
            default:
                return '알수없음';
        }
    }
    
    getPanelDataFromSensor = (sensors, property) => {
        if (!sensors) {
            return [null, null];
        }
        
        const sensor = sensors.find(sensor => sensor.sensorType === property);
        
        if (!sensor) {
            return [null, null];
        }
        
        return [sensor.value, sensor.uoM];
    }

    render() {
        let opacity = this.state.opacity;
        const panelUI = this.getPanelUI();
        const chartUI = this.getWeatherChart();

        return (
            <WeatherInfoComponent id={this.props.popupType} className='UI_Section weatherInfo' $opacity={opacity}
                                  $resize={true}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={300}
                    popupMinHeight={390}
                    topSize={40}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >
                    <div className='dslTop'>
                        <h5 className='dslTitle'>
                            {SdmsResource.ID.menu.weatherInfo}
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
                        <button className='dslX' onClick={() => this.props.setVisiblePopups()}>닫기</button>
                    </div>

                    <div className={'content'}>
                        <div className='contentBox current'>
                            <p className='contentName'>기상정보</p>
                            {panelUI}
                        </div>

                        <div className='contentBox chart'>
                            <p className='contentName'>차트</p>
                            {/* 데이터가 존재할 경우 */}
                            <div className='chartArea'>
                                {chartUI}
                            </div>

                            {/* 데이터가 없을 경우 */}
                            {/* <div className='noData'>
                            <p>데이터 값이 없습니다.</p>
                        </div> */}
                        </div>
                    </div>
                </PopupDraggable>
            </WeatherInfoComponent>
        );
    }
}

export default WeatherInfo;