import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { WeatherView } from '../../styled/dashboardWonik';
import weatherIcon from '../../../Common/img/imgwonik/board_weather_icon.png';

import DashboardResource from '../../resource/id';
import SDMSResource from '../../../SDMS/resource/id';
import ProjectResource from '../../../Root/resource/id';

import Dashboard from '../dashboard';

class WeatherWonik extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
        }

        this.props = props;
    }


    getWeatherData = () => {
        const weatherDatas = this.props.weatherDatas;
        const weeklyDatas = this.props.weeklyDatas;

        const data = this.state.data;

        for (let i = 0; i < weatherDatas?.length; i++) {
            const weatherData = weatherDatas[i];

            if (!weatherData?.current || !weatherData?.site)
                continue;

            const current = weatherData.current;
            const updateTime = current.updateTime;
            
            if (!updateTime)
                continue;

            // 데이터 업데이트 시간 비교 >> 현재 시간보다 30분 전 데이터이라면 표시X
            let today = new Date();
            let date = new Date(updateTime);

            let second = today.getTime() - date.getTime();
            let minute = second / 1000 / 60;

            if (minute > 30) {
                 continue;
            }
        
            if (data[weatherData.site.id]) {
                data[weatherData.site.id].current = current;
            } else {
                data[weatherData.site.id] = {name: weatherData?.site?.name, current: current, weekly: null};
            }
        }

        for (let i = 0; i < weeklyDatas?.length; i++) {
            const weeklyData = weeklyDatas[i];

            if (!weeklyData?.weekly || !weeklyData?.site)
                continue;

            const weekly = weeklyData.weekly;
            const updateTime = weekly.updateTime;
            
            if (!updateTime)
                continue;

            // 데이터 업데이트 시간 비교 >> 현재 시간보다 30분 전 데이터이라면 표시X
            let today = new Date();
            let date = new Date(updateTime);

            let second = today.getTime() - date.getTime();
            let minute = second / 1000 / 60;

            if (minute > 30) {
                 continue;
            }
            
            if (data[weeklyData.site.id]) {
                data[weeklyData.site.id].weekly = weekly;
            } else {
                data[weeklyData.site.id] = {name: weeklyData?.site?.name, current: null, weekly: weekly};
            }
        }    

        return data;
    }

    getDisplayView = (weatherData) => {
        const selectSiteID = this.props.selectSiteID;
        const displayView = []; 

        if (selectSiteID === -1) {
            const temperature1 = weatherData[DashboardResource.weatherSite.GUMI]?.current?.temperature ? weatherData[DashboardResource.weatherSite.GUMI].current.temperature : "-";
            let state1 = weatherData[DashboardResource.weatherSite.GUMI]?.current?.state ? weatherData[DashboardResource.weatherSite.GUMI].current.state : 0;
            const img1 = SDMSResource.getStateImageWonik(state1);
            state1 = SDMSResource.getWeatherStateString(state1);
            let windDirection1 = weatherData[DashboardResource.weatherSite.GUMI]?.current?.windDirection ? weatherData[DashboardResource.weatherSite.GUMI].current.windDirection : -1;
            windDirection1 = DashboardResource.getWindDirection(windDirection1);     
            const rain1 = weatherData[DashboardResource.weatherSite.GUMI]?.current?.rain ? weatherData[DashboardResource.weatherSite.GUMI].current.rain : 0;
            const humidity1 = weatherData[DashboardResource.weatherSite.GUMI]?.current?.humidity ? weatherData[DashboardResource.weatherSite.GUMI].current.humidity : 0;

            displayView.push(
                <div key={"weather1"} className='weather-area-content'>
                    <div className='weather-area-content-wrap'>
                        <div className='weather-area-title'>
                            <img src={img1} alt='weather-icon' />
                            <p>구미시</p>
                            <p>{temperature1}°({state1})</p>
                        </div>
                        <div className='weather-area-detail'>
                            <p>바람 : {windDirection1}</p>
                            <p>강수량 : {rain1}mm</p>
                            <p>습도 : {humidity1}%</p>
                        </div>
                    </div>
                </div>
            );

            const temperature2 = weatherData[DashboardResource.weatherSite.ANSEONG]?.current?.temperature ? weatherData[DashboardResource.weatherSite.ANSEONG].current.temperature : "-";
            let state2 = weatherData[DashboardResource.weatherSite.ANSEONG]?.current?.state ? weatherData[DashboardResource.weatherSite.ANSEONG].current.state : 0;
            const img2 = SDMSResource.getStateImageWonik(state2);
            state2 = SDMSResource.getWeatherStateString(state1);
            let windDirection2 = weatherData[DashboardResource.weatherSite.ANSEONG]?.current?.windDirection ? weatherData[DashboardResource.weatherSite.ANSEONG].current.windDirection : -1;
            windDirection2 = DashboardResource.getWindDirection(windDirection1);     
            const rain2 = weatherData[DashboardResource.weatherSite.ANSEONG]?.current?.rain ? weatherData[DashboardResource.weatherSite.ANSEONG].current.rain : 0;
            const humidity2 = weatherData[DashboardResource.weatherSite.ANSEONG]?.current?.humidity ? weatherData[DashboardResource.weatherSite.ANSEONG].current.humidity : 0;
            
            displayView.push(
                <div key={"weather2"} className='weather-area-content'>
                    <div className='weather-area-content-wrap'>
                        <div className='weather-area-title'>
                            <img src={img2} alt='weather-icon' />
                            <p>안성시</p>
                            <p>{temperature2}°({state2})</p>
                        </div>
                        <div className='weather-area-detail'>
                            <p>바람 : {windDirection2}</p>
                            <p>강수량 : {rain2}mm</p>
                            <p>습도 : {humidity2}%</p>
                        </div>
                    </div>
                </div>
            );

        } else if (selectSiteID && selectSiteID !== -1) {
            let weatherSiteID = 1;
            if (selectSiteID === ProjectResource.Site.Wonik_V)
                weatherSiteID = 2;


            const temperature = weatherData[weatherSiteID]?.current?.temperature ? weatherData[weatherSiteID].current.temperature : "-";
            let state = weatherData[weatherSiteID]?.current?.state ? weatherData[weatherSiteID].current.state : 0;
            const img = SDMSResource.getStateImageWonik(state);
            state = SDMSResource.getWeatherStateString(state);
            let windDirection = weatherData[weatherSiteID]?.current?.windDirection ? weatherData[weatherSiteID].current.windDirection : -1;
            windDirection = DashboardResource.getWindDirection(windDirection);     
            const rain = weatherData[weatherSiteID]?.current?.rain ? weatherData[weatherSiteID].current.rain : 0;
            const humidity = weatherData[weatherSiteID]?.current?.humidity ? weatherData[weatherSiteID].current.humidity : 0;
            const siteName = weatherData[weatherSiteID]?.name ? weatherData[weatherSiteID].name : "-";
            
            displayView.push(
                <div key={"weather"} className='weather-area-content'>
                    <div className='weather-area-content-wrap'>
                        <div className='weather-area-title'>
                            <img src={img} alt='weather-icon' />
                            <p>{siteName}시</p>
                            <p>{temperature}°({state})</p>
                        </div>
                        <div className='weather-area-detail'>
                            <p>바람 : {windDirection}</p>
                            <p>강수량 : {rain}mm</p>
                            <p>습도 : {humidity}%</p>
                        </div>
                    </div>
                </div>
            );

            let strOne, strTwo, strThree, strFour, strFive, strSix;

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

            const oneDayLaterTemp = weatherData[weatherSiteID]?.weekly?.oneDayLaterTemp ? weatherData[weatherSiteID].weekly.oneDayLaterTemp : "-";
            const oneDayMiniTemp = weatherData[weatherSiteID]?.weekly?.oneDayMiniTemp ? weatherData[weatherSiteID].weekly.oneDayMiniTemp : "-";
            let oneDayLaterState = weatherData[weatherSiteID]?.weekly?.oneDayLaterState ? weatherData[weatherSiteID].weekly.oneDayLaterState : 0;
            oneDayLaterState = SDMSResource.getStateImageWonik(oneDayLaterState);

            const twoDayLaterTemp = weatherData[weatherSiteID]?.weekly?.twoDayLaterTemp ? weatherData[weatherSiteID].weekly.twoDayLaterTemp : "-";
            const twoDayMiniTemp = weatherData[weatherSiteID]?.weekly?.twoDayMiniTemp ? weatherData[weatherSiteID].weekly.twoDayMiniTemp : "-";
            let twoDayLaterState = weatherData[weatherSiteID]?.weekly?.twoDayLaterState ? weatherData[weatherSiteID].weekly.twoDayLaterState : 0;
            twoDayLaterState = SDMSResource.getStateImageWonik(twoDayLaterState);

            const threeDayLaterTemp = weatherData[weatherSiteID]?.weekly?.threeDayLaterTemp ? weatherData[weatherSiteID].weekly.threeDayLaterTemp : "-";
            const threeDayMiniTemp = weatherData[weatherSiteID]?.weekly?.threeDayMiniTemp ? weatherData[weatherSiteID].weekly.threeDayMiniTemp : "-";
            let threeDayLaterState = weatherData[weatherSiteID]?.weekly?.threeDayLaterState ? weatherData[weatherSiteID].weekly.threeDayLaterState : 0;
            threeDayLaterState = SDMSResource.getStateImageWonik(threeDayLaterState);

            const fourDayLaterTemp = weatherData[weatherSiteID]?.weekly?.fourDayLaterTemp ? weatherData[weatherSiteID].weekly.fourDayLaterTemp : "-";
            const fourDayMiniTemp = weatherData[weatherSiteID]?.weekly?.fourDayMiniTemp ? weatherData[weatherSiteID].weekly.fourDayMiniTemp : "-";
            let fourDayLaterState = weatherData[weatherSiteID]?.weekly?.fourDayLaterState ? weatherData[weatherSiteID].weekly.fourDayLaterState : 0;
            fourDayLaterState = SDMSResource.getStateImageWonik(fourDayLaterState);

            const fiveDayLaterTemp = weatherData[weatherSiteID]?.weekly?.fiveDayLaterTemp ? weatherData[weatherSiteID].weekly.fiveDayLaterTemp : "-";
            const fiveDayMiniTemp = weatherData[weatherSiteID]?.weekly?.fiveDayMiniTemp ? weatherData[weatherSiteID].weekly.fiveDayMiniTemp : "-";
            let fiveDayLaterState = weatherData[weatherSiteID]?.weekly?.fiveDayLaterState ? weatherData[weatherSiteID].weekly.fiveDayLaterState : 0;
            fiveDayLaterState = SDMSResource.getStateImageWonik(fiveDayLaterState);

            const sixDayLaterTemp = weatherData[weatherSiteID]?.weekly?.sixDayLaterTemp ? weatherData[weatherSiteID].weekly.sixDayLaterTemp : "-";
            const sixDayMiniTemp = weatherData[weatherSiteID]?.weekly?.sixDayMiniTemp ? weatherData[weatherSiteID].weekly.sixDayMiniTemp : "-";
            let sixDayLaterState = weatherData[weatherSiteID]?.weekly?.sixDayLaterState ? weatherData[weatherSiteID].weekly.sixDayLaterState : 0;
            sixDayLaterState = SDMSResource.getStateImageWonik(sixDayLaterState);

            displayView.push(
                <div key={"weather_weekly"} className='weather-area-detail-wrap'>
                    <div className='weather-area-detail-content'>
                        <div className='weather-area-detail-content-wrap'>
                            <p className='weather-detail-days'>{strOne}</p>
                            <img src={oneDayLaterState} className='weather-detail-img' alt='weather-icon' />
                            <div className='weather-detail-celcius'>
                                <span>{oneDayMiniTemp}°</span>
                                <span>/</span>
                                <span>{oneDayLaterTemp}°</span>
                            </div>
                        </div>
                        <div className='weather-area-detail-content-wrap'>
                            <p className='weather-detail-days'>{strTwo}</p>
                            <img src={twoDayLaterState} className='weather-detail-img' alt='weather-icon' />
                            <div className='weather-detail-celcius'>
                                <span>{twoDayMiniTemp}°</span>
                                <span>/</span>
                                <span>{twoDayLaterTemp}°</span>
                            </div>
                        </div>
                        <div className='weather-area-detail-content-wrap'>
                            <p className='weather-detail-days'>{strThree}</p>
                            <img src={threeDayLaterState} className='weather-detail-img' alt='weather-icon' />
                            <div className='weather-detail-celcius'>
                                <span>{threeDayMiniTemp}°</span>
                                <span>/</span>
                                <span>{threeDayLaterTemp}°</span>
                            </div>
                        </div>
                        <div className='weather-area-detail-content-wrap'>
                            <p className='weather-detail-days'>{strFour}</p>
                            <img src={fourDayLaterState} className='weather-detail-img' alt='weather-icon' />
                            <div className='weather-detail-celcius'>
                                <span>{fourDayMiniTemp}°</span>
                                <span>/</span>
                                <span>{fourDayLaterTemp}°</span>
                            </div>
                        </div>
                        <div className='weather-area-detail-content-wrap'>
                            <p className='weather-detail-days'>{strFive}</p>
                            <img src={fiveDayLaterState} className='weather-detail-img' alt='weather-icon' />
                            <div className='weather-detail-celcius'>
                                <span>{fiveDayMiniTemp}°</span>
                                <span>/</span>
                                <span>{fiveDayLaterTemp}°</span>
                            </div>
                        </div>
                        <div className='weather-area-detail-content-wrap'>
                            <p className='weather-detail-days'>{strSix}</p>
                            <img src={sixDayLaterState} className='weather-detail-img' alt='weather-icon' />
                            <div className='weather-detail-celcius'>
                                <span>{sixDayMiniTemp}°</span>
                                <span>/</span>
                                <span>{sixDayLaterTemp}°</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        
        return displayView;
    }

    render() {
        const weatherData = this.getWeatherData();
        const getDisplayView = this.getDisplayView(weatherData);

		return (
			<WeatherView className="weather-area">
                <h1>기상 정보</h1>

                 <div className='weather-area-wrap'>
                    {getDisplayView}
                </div> 


            </WeatherView>
        );
    }
}

export default withRouter(WeatherWonik);