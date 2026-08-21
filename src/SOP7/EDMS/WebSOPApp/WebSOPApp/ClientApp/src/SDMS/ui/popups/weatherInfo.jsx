import { ui } from 'jquery';
import React, { Component } from 'react';
import content from '../../../Common/css/content.module.css';
import dash from '../../../Common/css/dash.module.css';
import SDMS from '../sdms';
import SDMSResource from '../../resource/id';
import uneStyles from '../../../Common/css/uneCommon.module.css';
import imgCloudy from '../../../Common/img/weather/cloudy.png';
import imgCloudDay from '../../../Common/img/weather/cloud_day.png';
import imgCloudNight from '../../../Common/img/weather/cloud_night.png';
import imgHeavySnow from '../../../Common/img/weather/heavySnow.png';
import imgSnow from '../../../Common/img/weather/snow.png';
import imgSnowRain from '../../../Common/img/weather/snowRain.png';
import imgHeavyRain from '../../../Common/img/weather/heavyRain.png';
import imgRain from '../../../Common/img/weather/rain.png';
import imgSunnyDay from '../../../Common/img/weather/sunny_day.png';
import imgSunnyNight from '../../../Common/img/weather/sunny_night.png';
import imgThunder from '../../../Common/img/weather/thunder.png';
import imgDustStorm from '../../../Common/img/weather/dustStorm.png';
import SettingsStore from '../../../Settings/settingsStore';
import store from '../../../Root/store';
import ProjectResource from '../../../Root/resource/id';

import PopupDraggable from './popupDraggable';
import $ from 'jquery';

class WeatherInfo extends Component {
    static Unknown = 0;
    static Sunshine = 1;
    static Thunder = 2;
    static SnowRain = 3;
    static HeavySnow = 4;
    static Snow = 5;
    static HeavyRain = 6;
    static Rain = 7;
    static Cloudy = 8;
    static Cloud = 9;
    static DustStorm = 10;
    static FineDust = 11;

    constructor(props) {
        super(props);

        this.state = {
            selectedSiteIndex: 0,
            weatherInfo:
            {
                selectedIndex: 0,
                datas: store.getState().weatherDatas
            },
        }

        this.props = props;

        store.subscribe(function () {
            const data = store.getState();

            if (data === null || data === undefined || data.actionType !== 'WEATHER_CURRENT')
                return;

            this.changeWeather(data);
        }.bind(this));

        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));
    }

    componentDidMount() {
        // 창이 서서히 나타나는 효과
        //$('#' + this.props.popupType).animate({ opacity: 1 }, SDMSResource.PopupAniTime, () => {
        //    if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
        //        document.getElementById(this.props.popupType).style.opacity = 1;
        //    }
        //});
        let cssLeft = null;
        let cssTop = null;
        let cssWidth = null;
        let cssHeight = null;

        const popup = document.getElementById(this.props.popupType);
        const target = document.getElementById("dsBot_" + this.props.popupType);
        const popupState = this.props.popupState;

        if (popup !== null && popup !== undefined &&
            target !== null && target !== undefined &&
            popupState !== null && popupState !== undefined) {
            const clientRect = target.getBoundingClientRect();
            cssLeft = clientRect.left + "px";
            cssTop = clientRect.top + "px";

            popup.style.width = 0;
            popup.style.height = 0;
            popup.style.left = cssLeft;
            popup.style.top = cssTop;

            cssLeft = popupState.x;
            cssTop = popupState.y;
            cssWidth = popupState.width;
            cssHeight = popupState.height;

            $('#' + this.props.popupType).animate({ opacity: 1, width: cssWidth, height: cssHeight, left: cssLeft, top: cssTop }, SDMSResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }
        else {
            $('#' + this.props.popupType).animate({ opacity: 1 }, SDMSResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }
    }

    changeWeather(data) {
        const weatherDatas = data.weatherDatas;

        if (weatherDatas) {
            const weatherInfo =
            {
                selectedIndex: this.state.weatherInfo.selectedIndex,
                datas: weatherDatas,
            }

            this.setState({ weatherInfo });
        }
    }

    repositionPopup(popupState) {
        let data = popupState.weatherInfo;

        if (data === null || data === undefined)
            return;

        //let popup = document.getElementsByClassName(content.viewDashboardBoxD + ' ' + content.viewDashboardWeather)[0];
        let popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return;

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
    }

    resetPopupState = (popupState) => {
        let data = popupState;

        if (data.actionType === 'RESET_POPUP') {
            this.repositionPopup(data.popupState);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            var popup = document.getElementsByClassName(content.viewDashboardBoxD + ' ' + content.viewDashboardWeather)[0];
            popup.style.zIndex = this.props.zIndex;
            console.log('weatherInfoZIndex changed', popup.style.zIndex);
        }
    }

    onSelectSite = (event) => {
        const index = parseInt(event.target.value);

        if (index !== null && index !== undefined) {
            //this.props.info.selectedIndex = index;
            let weatherInfo = this.state.weatherInfo;
            weatherInfo.selectedIndex = index;

            this.setState({ selectedSiteIndex: index, weatherInfo: weatherInfo });
        }
    }

    getSiteOption(data, index, isSelected) {
        let siteName = "";

        if (ProjectResource.isGSMode !== true) {
            siteName = data.site?.name === '보정' ? '용인' : data.site?.name;
        } else {
            if (index === 0)
                siteName = "A구역";
            else if (index === 1)
                siteName = "B구역";
            else if (index === 2)
                siteName = "C구역";
        } 

        return <button key={"weatherSite_" + index} className={isSelected ? dash.weatherSiteButton + " " + dash.active : dash.weatherSiteButton} value={index} onClick={this.onSelectSite}>
            {siteName}
        </button>
    }

    getSpecialReportURL(weatherDatas, dataCount, selectedIndex) {
        let isActive = dash.down;
        let url = null;

        if (dataCount > 0 && dataCount >= selectedIndex + 1) {
            //url = weatherDatas[0]?.specialReport?.url;
            url = weatherDatas[selectedIndex]?.specialReport?.imageUrl;

            if (url !== null) {
                isActive = dash.active + " " + dash.down;
            }
        }

        return [isActive, url];
    }

    getSelectElement(updateTime) {
        //if (updateTime.length > 0 && this.props.info) {//weatherInfo
        if (updateTime.length > 0 && this.state.weatherInfo) {
            //const weatherDatas = [...this.props.info.datas];
            const weatherDatas = this.state.weatherInfo.datas;
            const dataCount = weatherDatas.length;
            const selectedIndex = this.state.selectedSiteIndex;
            const [isActive, specialReportURL] = this.getSpecialReportURL(weatherDatas, dataCount, selectedIndex);

            if (selectedIndex < dataCount) {
                return (
                    <>
                        {
                            weatherDatas.map((data, index) => this.getSiteOption(data, index, index === selectedIndex))
                        }
                    </>
                );
            }
        }

        return <></>
    }

    static onClickSpecialReport = (url) => {
        if (url === null || url === undefined)
            return;

        let specialReportURL = window.location.origin + "/specialReport?path=" + url;

        var child = window.open(specialReportURL, "기상특보", "width=800, height=700, location=no, toolbar=no, menubar=no, scrollbars=no, status=no");
        child.scrollTo(0, 40);
    }

    // ComboBox 사용하는 버전
    //getSiteOption(data, index/*, isSelected*/) {
    //    return <option key={"weatherSite_" + index} value={index}>{data.site?.name}</option>
    //}
    
    // ComboBox 사용하는 버전
    //getSelectElement(updateTime) {
    //    if (updateTime.length > 0 && this.props.info) {
    //        const weatherDatas = [...this.props.info.datas];
    //        const dataCount = weatherDatas.length;
    //        const selectedIndex = this.state.selectedSiteIndex;

    //        if (selectedIndex < dataCount) {
    //            return (
    //                <select className={content.dslSel} defaultValue={selectedIndex} onChange={this.onSelectSite}>
    //                {
    //                    weatherDatas.map((data, index) => this.getSiteOption(data, index/*, index === selectedIndex*/))
    //                }
    //                </select>
    //            );
    //        }
    //    }

    //    return <></>
    //}

    getStateImage(state) {
        if (state === WeatherInfo.Sunshine) {
            if (this.isDayLight()) {
                return imgSunnyDay;
            }
            else {
                return imgSunnyNight;
            }
            //return imgSunshine;
        }
        else if (state === WeatherInfo.Thunder) {
            return imgThunder;
        }
        else if (state === WeatherInfo.SnowRain) {
            return imgSnowRain;
        }
        else if (state === WeatherInfo.HeavySnow) {
            return imgHeavySnow;
        }
        else if (state === WeatherInfo.Snow) {
            return imgSnow;
        }
        else if (state === WeatherInfo.HeavyRain) {
            return imgHeavyRain;
        }
        else if (state === WeatherInfo.Rain) {
            return imgRain;
        }
        else if (state === WeatherInfo.Cloudy) {
            return imgCloudy;
        }
        else if (state === WeatherInfo.DustStorm) {
            return imgDustStorm;
        }

        if (this.isDayLight()) {
            return imgCloudDay;
        }

        return imgCloudNight;
    }

    isDayLight() {
        const now = new Date();
        const hour = now.getHours();

        if (hour < 6 || hour >= 19) {
            return false;
        }

        return true;
    }

    getDoubleString(num) {
        if (num < 10) {
            return "0" + num;
        }

        return num;
    }

    // time이 현재시각으로부터 minutes 만큼 더 오래전인가?
    checkTime(strTime, minutes) {
        const now = new Date();
        const prevTime = new Date(now.getTime() - minutes * 60 * 1000);
        const strPrevTime = prevTime.getFullYear() + "-" + this.getDoubleString(prevTime.getMonth() + 1) + "-" + this.getDoubleString(prevTime.getDate()) + " " + this.getDoubleString(prevTime.getHours()) + ":" + this.getDoubleString(prevTime.getMinutes()) + ":" + this.getDoubleString(prevTime.getSeconds());

        if (strTime >= strPrevTime) {
            return true;
        }

        return false;
    }

    getCurrentData() {
        //const weatherDatas = [...this.props.info.datas];
        const weatherDatas = this.state.weatherInfo.datas;

        if (!weatherDatas) {
            return ["", SDMSResource.getStateImage(0), '-', '-', '-', '-'];
        }

        const dataCount = weatherDatas.length;
        const selectedIndex = this.state.selectedSiteIndex;

        if (selectedIndex >= dataCount) {
            return ["", SDMSResource.getStateImage(0), '-', '-', '-', '-'];
        }

        const data = weatherDatas[selectedIndex];

        if (!data.current) {
            return ["", SDMSResource.getStateImage(0), '-', '-', '-', '-'];
        }

        let updateTime = "";

        if (data.current.updateTime) {
            updateTime = data.current.updateTime.replace('T', ' ');

            // 현재 시각으로부터 30분 이전에 작성된 데이터는 무시한다.
            if (this.checkTime(updateTime, 30) === false) {
                return ["", SDMSResource.getStateImage(0), '-', '-', '-', '-'];
            }
        }

        return [updateTime, SDMSResource.getStateImage(data.current.state), data.current.temperature, data.current.windSpeed, data.current.rain, data.current.humidity];
    }

    onClickClose = () => {
        // 창이 서서히 사라지는 효과
        $('#' + this.props.popupType).animate({ opacity: 0 }, 150, () => {
            if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                document.getElementById(this.props.popupType).style.opacity = 0;
            }

            this.props.setVisiblePopups(SDMS.menu.weatherInfo, false);
        });
    }

    render() {
        const [updateTime, imgIcon, temp, windSpeed, rain, humidity] = this.getCurrentData();

        return (
            <div id={this.props.popupType} className={content.viewDashboardBoxD + ' ' + content.viewDashboardWeather}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={320}
                    popupMinHeight={154}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >

                    <div className={content.dslTop + " " + content.dslGrd}>
                        <h5 className={content.dslTitle} >
                                기상정보
                            <span style={{ float: 'right', marginRight: '26px' }}>{updateTime}</span>
                        </h5>
                        <a className={content.dslX} onClick={() => this.props.setVisiblePopups(SDMS.menu.weatherInfo, false)}></a>
                    </div>
                    <div className={content.dslCont}>
                        <div>
                            {
                                this.getSelectElement(updateTime)
                            }
                            <dl className={content.dslInfo}>
                                <dt>
                                    <img className={content.weatherImage} src={imgIcon} />
                                    <h5><span>{temp}</span><em>℃</em></h5>
					            </dt>
                                <dd>
                                    <p>바람  :  {windSpeed} m/s</p>
                                    <p>강수량  : {rain} mm</p>
                                    <p>습도  : {humidity} %</p>
                                </dd>
				            </dl>
			            </div>
                    </div>

                </PopupDraggable>
            </div>
        );
    }
}

export default WeatherInfo;