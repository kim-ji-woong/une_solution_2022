import React, { Component } from 'react';
import SdmsResource from '../../resource/id';

import { WeatherMiniPopComponent } from './../../sdmsStyled';
import SDMS from '../sdms';


class WeatherMiniPop extends Component {

    constructor(props) {
        super(props)

        this.state = {
            selectedSensor: this.props.selectedSensor,
            miniPopInfo: this.props.miniPopInfo,

            windDirection: 0,
            windSpeed: 0,
            temp: 0,
            humidity: 0,

            left: this.props.left,
        }

    }

    componentDidMount() {
        this.getWeather()
    }

    getWeather() {
        if (this.state.selectedSensor) {
            const _selectedSensor = this.state.selectedSensor;

            let temp = null;
            let humidity = null;
            let windDir = null;
            let windDirection = null;
            let windSpeed = null;

            const tempType = SdmsResource.materialType.Temp;
            const humiType = SdmsResource.materialType.Humi;
            const windDirType = SdmsResource.materialType.Wind_Dir;
            const windSpeedType = SdmsResource.materialType.Wind_Speed;

            const sensors = this.state.selectedSensor?.sensors;
            // 온도 200 , 습도 201, 풍향 261, 풍속 262
            if (sensors) {
                for (const sensor of sensors) {
                    const materialType = sensor.sensorType;

                    switch (sensor.sensorType) {
                        case tempType:
                            temp = sensor.value;
                            break;
                        case humiType:
                            humidity = sensor.value;
                            break;
                        case windDirType:
                            windDir = sensor.value;
                            break;
                        case windSpeedType:
                            windSpeed = sensor.value;
                            break;
                    }

                }
            }
            //windDirection = this.getWindDirection(windDir);

            this.setState({ temp: temp, humidity: humidity, windDirection: windDir, windSpeed: windSpeed });

        }
    }

    getDirection() {
        const value = this.state.windDirection;

        let strDirection = '북풍';

        if (value < 22.5) {
            strDirection = '북풍';
        } else if (value < 67.5) {
            strDirection = '북동풍';
        } else if (value < 112.5) {
            strDirection = '동풍';
        } else if (value < 157.5) {
            strDirection = '남동풍';
        } else if (value < 202.5) {
            strDirection = '남풍';
        } else if (value < 247.5) {
            strDirection = '남서풍';
        } else if (value < 292.5) {
            strDirection = '서풍';
        } else if (value < 337.5) {
            strDirection = '북서풍'
        } else {
            strDirection = '북풍';
        }

        return strDirection;
    }

    getLeftPosition() {

        let left = '';
        if (this.props.miniPopInfo) {
            //left = (this.state.left + 20) * -1;
            //left += 'px';
            left = '-185px';
        } else {
            left = this.state.left + 20
            left += 'px';
        }
        return left;
    }

    render() {

        const strDir = this.getDirection();
        const left = this.getLeftPosition();

        return (
            <>
                {!this.state.miniPopInfo &&
                    <WeatherMiniPopComponent style={{ position: 'relative', left: left, top: '-249px', display: 'block' }}>
                        <div className={'weatherTri'} style={{ position: 'absolute', top: '28px', left: '-36px' }}></div>
                        <div className={'weatherInfoPop'}>
                            <div style={{ display: 'flex', marginBottom: '10px' }}>
                                <div className={'weatherMiniBox'}>
                                    <p>풍향</p>
                                    <span>{strDir}</span>
                                </div>
                                <div className={'weatherMiniBox'}>
                                    <p>풍속</p>
                                    <span>{this.state.windSpeed}m/s</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <div className={'weatherMiniBox'}>
                                    <p>온도</p>
                                    <span>{this.state.temp}℃</span>
                                </div>
                                <div className={'weatherMiniBox'}>
                                    <p>습도</p>
                                    <span>{this.state.humidity}%</span>
                                </div>
                            </div>
                        </div>
                    </WeatherMiniPopComponent>
                }
                {this.state.miniPopInfo &&
                    <WeatherMiniPopComponent style={{ position: 'relative', left: left, top: '-249px', display: 'block' }}>
                        <div className={'weatherTri'} style={{ position: 'absolute', top: '28px', left: '205px', transform: 'scaleX(-1)' }}></div>
                        <div className={'weatherInfoPop'}>
                            <div style={{ display: 'flex', marginBottom: '10px' }}>
                                <div className={'weatherMiniBox'}>
                                    <p>풍향</p>
                                    <span>서풍</span>
                                </div>
                                <div className={'weatherMiniBox'}>
                                    <p>풍속</p>
                                    <span>{this.state.windSpeed}m/s</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <div className={'weatherMiniBox'}>
                                    <p>온도</p>
                                    <span>{this.state.temp}℃</span>
                                </div>
                                <div className={'weatherMiniBox'}>
                                    <p>습도</p>
                                    <span>{this.state.humidity}%</span>
                                </div>
                            </div>
                        </div>
                    </WeatherMiniPopComponent>
                }
            </>
        );
    }
};

export default WeatherMiniPop;