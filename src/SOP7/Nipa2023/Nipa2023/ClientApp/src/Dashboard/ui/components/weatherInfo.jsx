import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import DashboardResource from '../../resource/id';

import { WeatherInfoComponent } from '../../styled/dashboardStyled';

import cloud_day from '../../images/weather/cloud_day.png';
import Dashboard from '../dashboard';

class WeatherInfo extends Component {
    constructor(props) {
        super(props);
		
		this.state = {
        }

		this.props = props;
	}

    getDisplayView() {
        const displayView = [];
        const displayWeeklyView = [];
        const weatherDatas = this.props.weatherDatas[0];
        const weeklyDatas = this.props.weatherWeeklyDatas[0];

        if(weatherDatas !== null && weatherDatas !== undefined) {
            const currentData = weatherDatas['current'];

            let windDirection = DashboardResource.getWindDirection(currentData.windDirection);
            let img = DashboardResource.getStateImage(currentData.state);
            let state = DashboardResource.getWeatherStateString(currentData.state);
            let temperature = currentData.temperature.toFixed(1);
            let rain = currentData.rain.toFixed(1);
            let humidity = currentData.humidity.toFixed(0);

            let displayTime = "-";
            let date = new Date();

            let year = String(date.getFullYear()).substr(2);
            
            let month = date.getMonth() + 1;
            if (month < 10)
                month = "0" + month;
    
            let day = date.getDate();
            if (day < 10)
                day = "0" + day;
    
            const dayString = Dashboard.arrDayStr[date.getDay()];

            displayTime = year + '.' + month + '.' + day + ' (' + dayString + ')';

            displayView.push(
                <ul key={'current_weather'}>
                    <li>
                        <p>{displayTime}</p>
                        <p>{temperature}°({state})</p>
                    </li>
                    <li>
                        <img src={img} alt='weather-icon' />
                    </li>
                    <li>
                        <p>바람 : {windDirection}</p>
                        <p>강수량 : {rain}mm</p>
                        <p>습도 : {humidity}%</p>
                    </li>
                </ul>
            )
        } 
        else {
            displayView.push(
                <ul key={'current_weather'}>
                    <li>
                        <p>{"데이터 없음"}</p>
                        <p>{"-"}</p>
                    </li>
                    <li>
                        <img src={cloud_day} alt='weather-icon' />
                    </li>
                    <li>
                        <p>바람 : {"-"}</p>
                        <p>강수량 : {"-"}</p>
                        <p>습도 : {"-"}</p>
                    </li>
                </ul>
            )
        }

        if(weeklyDatas !== null && weeklyDatas !== undefined) {
            const currentData = weeklyDatas['weekly'];

            let strOne, strTwo, strThree, strFour, strFive, strSix;
            let imgOne, imgTwo, imgThree, imgFour, imgFive, imgSix;

            let dt = new Date();
            dt.setDate(dt.getDate() + 1);
            strOne = Dashboard.arrDayStr[dt.getDay()];
            dt.setDate(dt.getDate() + 1);
            strTwo = Dashboard.arrDayStr[dt.getDay()];
            dt.setDate(dt.getDate() + 1);
            strThree = Dashboard.arrDayStr[dt.getDay()];
            dt.setDate(dt.getDate() + 1);
            strFour = Dashboard.arrDayStr[dt.getDay()];
            dt.setDate(dt.getDate() + 1);
            strFive = Dashboard.arrDayStr[dt.getDay()];
            dt.setDate(dt.getDate() + 1);
            strSix = Dashboard.arrDayStr[dt.getDay()];

            imgOne = DashboardResource.getStateImage(currentData.oneDayLaterState);
            imgTwo = DashboardResource.getStateImage(currentData.twoDayLaterState);
            imgThree = DashboardResource.getStateImage(currentData.threeDayLaterState);
            imgFour = DashboardResource.getStateImage(currentData.fourDayLaterState);
            imgFive = DashboardResource.getStateImage(currentData.fiveDayLaterState);
            imgSix = DashboardResource.getStateImage(currentData.sixDayLaterState);

            displayWeeklyView.push(
                <div className='weeklyWrap' key={'weekly_weather'}>
                <ul>
                    <li>
                        <img src={imgOne} alt='weather-icon' />
                        <p>{strOne}(내일)</p>
                    </li>
                    <li>
                        <img src={imgTwo} alt='weather-icon' />
                        <p>{strTwo}</p>
                    </li>
                    <li>
                        <img src={imgThree} alt='weather-icon' />
                        <p>{strThree}</p>
                    </li>
                </ul>
                <ul>
                    <li>
                        <img src={imgFour} alt='weather-icon' />
                        <p>{strFour}</p>
                    </li>
                    <li>
                        <img src={imgFive} alt='weather-icon' />
                        <p>{strFive}</p>
                    </li>
                    <li>
                        <img src={imgSix} alt='weather-icon' />
                        <p>{strSix}</p>
                    </li>
                </ul>
            </div>
            )
        }
        else {
            displayWeeklyView.push(
                <div className='weeklyWrap' key={'weekly_weather'}>
                <ul>
                    <li>
                        <img src={cloud_day} alt='weather-icon' />
                        <p>{"-"}</p>
                    </li>
                    <li>
                        <img src={cloud_day} alt='weather-icon' />
                        <p>{"-"}</p>
                    </li>
                    <li>
                        <img src={cloud_day} alt='weather-icon' />
                        <p>{"-"}</p>
                    </li>
                </ul>
                <ul>
                    <li>
                        <img src={cloud_day} alt='weather-icon' />
                        <p>{"-"}</p>
                    </li>
                    <li>
                        <img src={cloud_day} alt='weather-icon' />
                        <p>{"-"}</p>
                    </li>
                    <li>
                        <img src={cloud_day} alt='weather-icon' />
                        <p>{"-"}</p>
                    </li>
                </ul>
            </div>
            )
        }

        return [displayView, displayWeeklyView];
    }

    render() {
        const [displayView, displayWeeklyView] = this.getDisplayView();

        return (
            <WeatherInfoComponent className="weatherInfo">
                <h1>기상정보</h1>
                <div className='content'>
                    <div className='todayWrap'>
                        {displayView}
                    </div>

                    {displayWeeklyView}
                </div>
            </WeatherInfoComponent>
        )
    }
}

export default withRouter(WeatherInfo);