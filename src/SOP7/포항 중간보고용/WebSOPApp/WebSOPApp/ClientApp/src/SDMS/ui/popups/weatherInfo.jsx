import React, { Component } from 'react';

import PopupDraggable from './popupDraggable';
import { WeatherInfoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import LineChart from '../charts/lineChart';

import cloud_day from '../../images/weather/cloud_day.svg';
import bearing_icon from '../../images/bearing_icon.svg';

class WeatherInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            opacity: 1,
            weatherProperty: SdmsResource.weatherProperty.default
        }
    }

    changePopupOpacity = (value) => {
        this.setState({ opacity: value });
    }

    changeWeatherProp = (prop) => {
        if(prop === this.state.weatherProperty) {
            this.setState({ weatherProperty: SdmsResource.weatherProperty.default });
        }
        else {
            this.setState({ weatherProperty: prop });
        }
    }

    getWeatherChart = () => {
        let weatherProperty = this.state.weatherProperty;
        let chartUI = [];

        if (weatherProperty === SdmsResource.weatherProperty.default) {
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

    render() {
        let opacity = this.state.opacity;
        let weatherProperty = this.state.weatherProperty;
        const chartUI = this.getWeatherChart();

        return (
            <WeatherInfoComponent id={this.props.popupType} className='UI_Section weatherInfo' $opacity={opacity} $resize={true}>
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
                        onChange={(e) => {this.changePopupOpacity(e.target.valueAsNumber)}}
                    />
                    <button className='dslX'>닫기</button>
                </div>

                <div className={'content'}>
                    <div className='contentBox current'>
                        <p className='contentName'>기상정보</p>
                        <div className='currentWrap'>
                            <div>
                                <img src={cloud_day} alt='weather-icon' />
                                <p className={weatherProperty === SdmsResource.weatherProperty.default ? 'on' : null}>3.2℃ 흐림</p>
                            </div>
                            <ul>
                                <li className={weatherProperty === SdmsResource.weatherProperty.windDirection ? 'on' : null}>
                                    <button onClick={() => this.changeWeatherProp(SdmsResource.weatherProperty.windDirection)}>풍향</button>
                                    <p>남동풍</p>
                                </li>
                                <li className={weatherProperty === SdmsResource.weatherProperty.windSpeed ? 'on' : null}>
                                    <button onClick={() => this.changeWeatherProp(SdmsResource.weatherProperty.windSpeed)}>풍속</button>
                                    <p>10m/s</p>
                                </li>
                                <li className={weatherProperty === SdmsResource.weatherProperty.humidity ? 'on' : null}>
                                    <button onClick={() => this.changeWeatherProp(SdmsResource.weatherProperty.humidity)}>습도</button>
                                    <p>35%</p>
                                </li>
                                <li className={weatherProperty === SdmsResource.weatherProperty.barometric ? 'on' : null}>
                                    <button onClick={() => this.changeWeatherProp(SdmsResource.weatherProperty.barometric)}>기압</button>
                                    <p>1000hpa</p>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className='contentBox chart'>
                        <p className='contentName'>차트</p>
                        <div className='chartArea'>
                            {chartUI}
                        </div>
                    </div>
                </div>
                </PopupDraggable>
            </WeatherInfoComponent>
        );
    }
}

export default WeatherInfo;