import React, { Component } from 'react';

import content from '../../../Common/css/content.module.css';
import sdmsStyle from '../../css/sdms.module.css';
import SDMS from '../sdms';
import SettingsStore from '../../../Settings/settingsStore';
import SDMSResource from '../../resource/id';
import PopupDraggable from './popupDraggable';
import $ from 'jquery';
import StatusInfo from './statusInfo';

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


import { WeatherPopupComponent } from './../../sdmsStyled';
import store from '../../../Root/store';

import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import ProjectResource from '../../../Root/resource/id';
import SdmsResource from '../../resource/id';


class WeatherPopup extends Component {

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

    static wheather = {
        Unknown: 0,
        Sunshine: 1,
    }

    constructor(props) {
        super(props);
        this.state = {
            popupMinWidth: 350,
            selectedSiteIndex: 0,
            selectedSensor: {},
            weatherInfo:
            {
                selectedIndex: 0,
                datas: store.getState().weatherDatas
            },

            ATM: 0,
            temp: 0,
            humidity: 0,
            rainfall: 0,
            radiation: 0,
            windDirection: 0,
            windSpeed: 0,

            sensorType: null,
            materialType: SDMSResource.materialType.Humi,
        }

        this.isSubscribed = true;
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
        this.setState({ selectedSensor: this.props.selectedSensorInfo.sensor }, () => this.getMaterialValue())
    }

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
            console.log('miniMapZIndex changed', this.state.popup.style.zIndex);
        }

        if (this.props.selectedSensorInfo !== prevProps.selectedSensorInfo) {
            if (this.props.selectedSensorInfo.sensorType === StatusInfo.WeatherType) {

                this.setState({ selectedSensor: this.props.selectedSensorInfo.sensor }, () => this.getMaterialValue());

            }
        }

        if (this.props.sensorHistories !== prevProps.sensorHistories) {
            console.log("sensorHistories update : " + this.props.sensorHistories);
            this.getLineData();
        }

        if (this.props.sensorList !== prevProps.sensorList) {
            this.getNewMaterialValue(prevProps.selectedSensor);
        }
    }

    componentWillUnmount() {
        this.isSubscribed = false;
    }

    setState = (state, callback) => {
        if (this.isSubscribed) {
            super.setState(state, callback);
        }
    }

    getNewMaterialValue(prevSensor) {
        if (this.state.selectedSensor) {

            const weatherSensors = this.props.sensorList.weathers;
            const curZoneID = this.state.selectedSensor.zoneID;

            let curSensor = null;

            for (const sensor of weatherSensors) {
                if (curZoneID === sensor.zoneID) {
                    curSensor = sensor;
                }
            }

            this.setState({ selectedSensor: curSensor }, this.getMaterialValue);
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

            this.setState({ weatherInfo }, () => this.getWeatherInfo);
        }
    }

    repositionPopup(popupState) {
        let data = popupState.weatherPopup;

        if (data === null || data === undefined)
            return;

        //let popup = document.getElementsByClassName(content.viewDashboardBoxD + ' ' + content.viewDashboardMiniMap)[0];
        let popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return;

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
    }

    getWeatherInfo() {

        let index = null;
        //let curUpdateDate = null;

        const _data = this.state.weatherInfo.datas[0];
        
        let sensors = null;
        if (this.state.selectedSensor) {
            sensors = this.state.selectedSensor.sensors;
        }
        
        let data = null;
        if (_data) {
            data = _data.current2;
        }

        //let curDate = null;
        //let curTime = null;
        let tempHigh = null;
        let tempLow = null;
        let curTemp = null;
        let curState = 1;


        if (data) {
            if (data !== {} || data !== []) {
                //curUpdateDate = data.updateTime;
                tempHigh = data.temperatureHigh;
                tempLow = data.temperatureLow;
                curState = data.state;
                curTemp = data.temperature;
            }
        }
        
        if (sensors) {
            for (let i = 0; i < sensors.length; i++) {
                if (sensors[i].sensorType === SDMSResource.materialType.Temp) {
                    curTemp = parseInt(sensors[i].value); // 현재 온도 센서 값 사용
                }
            }
        }

        // if (curUpdateDate) {
        //
        //     index = curUpdateDate.indexOf('T');
        //
        //     curDate = curUpdateDate.substr(0, index);
        //
        //     curTime = curUpdateDate.substr(index + 1);
        //     curDate = curDate.replaceAll('-', '.');
        // }
        
        const dtNow = new Date();
        const year = dtNow.getFullYear();
        const month = dtNow.getMonth() + 1;
        const day = dtNow.getDate();
        const hour = dtNow.getHours();
        const minute = dtNow.getMinutes();
        const second = dtNow.getSeconds();
        
        const date = year + '.' + month + '.' + day;
        const time = hour + ':' + minute + ':' + second;
        
        return [date, time, this.getStateImage2(curState), tempHigh, tempLow, curTemp]

    }

    resetPopupState = (popupState) => {
        let data = popupState;

        if (data.actionType === 'RESET_POPUP') {
            this.repositionPopup(data.popupState);
        }
    }

    materialClick(material) {
        this.setState({ materialType: material });
    }

    getHistories(histories, sensorID) {

        let sensors = [];

        for (let i = 0; i < histories.length; i++) {
            if (histories[i].sensorID === sensorID) {
                sensors.push(histories[i]);
            }
        }
        return sensors;
    }

    getTime(hour, minute) {

        let result = null;

        if (minute < 0) {
            hour -= 1;
            minute += 60;
        }

        if (minute < 10) {
            minute = '0' + minute;
        }

        if (hour < 10) {
            hour = '0' + hour;
        }

        result = hour.toString() + ':' + minute.toString();

        return result;
    }

    getToolTip = (tooltipItem, data) => {

        let result = '좋음';
        return result;
    }

    getLineData(materialType, sensor) {
        let lineChartUI = [];

        if (materialType === SDMSResource.materialType.Wind_Dir) {
            return [];
        }

        if (sensor === null || sensor === undefined)
            return [];

        const curSensor = sensor?.sensor;
        const histories = this.props.dataHistories; // history property - sensorID , timeStamp, sensorValue

        let dataSet = [];

        let selectedSensorID = null;
        let sensorTypeName = null;

        if (sensor && materialType) {
            for (let i = 0; i < curSensor.sensors.length; i++) {
                if (curSensor.sensors[i].sensorType === Number(materialType)) {
                    selectedSensorID = curSensor.sensors[i].id;
                    sensorTypeName = curSensor.sensors[i].sensorTypeName;
                    break;
                }
            }
        }

        let sensorHistories = []

        if (selectedSensorID) {
            for (let i = 0; i < histories.length; i++) {
                if (histories[i].sensorID === selectedSensorID) {
                    sensorHistories.push(histories[i]);
                }
            }
        }

        let date = new Date();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let _minute = (minute - (minute % 5));

        let currentTime = this.getTime(hour, _minute);
        if (_minute < 5) {
            hour -= 1;
        }
        let beforeTime1 = this.getTime(hour, (_minute - 5));
        let beforeTime2 = this.getTime(hour, (_minute - 10));
        let beforeTime3 = this.getTime(hour, (_minute - 15));
        let beforeTime4 = this.getTime(hour, (_minute - 20));
        let beforeTime5 = this.getTime(hour, (_minute - 25));

        const labels = [beforeTime5, beforeTime4, beforeTime3, beforeTime2, beforeTime1, currentTime];

        let currentData = this.makeBeforeData(sensorHistories, currentTime);
        let beforeData1 = this.makeBeforeData(sensorHistories, beforeTime1);
        let beforeData2 = this.makeBeforeData(sensorHistories, beforeTime2);
        let beforeData3 = this.makeBeforeData(sensorHistories, beforeTime3);
        let beforeData4 = this.makeBeforeData(sensorHistories, beforeTime4);
        let beforeData5 = this.makeBeforeData(sensorHistories, beforeTime5);

        if (!beforeData5) dataSet.push('0');
        if (!beforeData4) dataSet.push('0');
        if (!beforeData3) dataSet.push('0');
        if (!beforeData2) dataSet.push('0');
        if (!beforeData1) dataSet.push('0');
        if (!currentData) dataSet.push('0');

        if (beforeData5) dataSet.push(beforeData5.sensorValue)
        if (beforeData4) dataSet.push(beforeData4.sensorValue)
        if (beforeData3) dataSet.push(beforeData3.sensorValue)
        if (beforeData2) dataSet.push(beforeData2.sensorValue)
        if (beforeData1) dataSet.push(beforeData1.sensorValue)
        if (currentData) dataSet.push(currentData.sensorValue)

        if (dataSet.length === 0 || !dataSet) {
            dataSet = [0, 0, 0, 0, 0, 0];
        }

        const max = Math.max.apply(null, dataSet);
        const min = Math.min.apply(null, dataSet);

        //const stepSize = (max + min) / 5;
        const stepSize = max / 5;


        const options = {
            responsive: true, /* false로 해야 크기 지정 가능 */
            tooltips: {
                backgroundColor: 'white',
                position: 'average',
                bodyFontColor: '#19A5FF',
                borderColor: '#19A5FF',
                displayColors: false,
                titleAlign: 'center',

                callbacks: {
                    label: function (tooltipItems, data) {
                        const value = tooltipItems.yLabel;
                        return value;
                    },
                    title: function (tooltipItems, data) {
                        return '';
                    }
                } // callBacks end 

            },
            plugins: {
                title: {
                    text: 'Chart.js Line Chart',
                },
            },
            legend: {
                display: false,
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                },
                y: {
                    gridLines: {
                        color: "rgb(57,72,81)",
                    },
                },
                xAxes: [{
                    ticks: {
                        fontSize: 11,
                    },
                }],
                yAxes: [{
                    min: min,
                    max: max,
                    ticks: {
                        beginAtZero: true,
                        stepSize: stepSize,
                        fontSize: 11,
                        //max: max,
                        suggestedMax: max,
                        suggestedMin: 0,
                    },
                    gridLines: {
                        color: "#666666",
                    },
                }],
            },
            /* options: {
                responsive: false,
                aspectRatio: 1,
                legend: false,
                maintainAspectRatio: false, 
            } */
        };

        const data = (canvas) => {
            const ctx = canvas.getContext("2d");
            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            gradient.addColorStop(0, 'rgba(25,165,255,1)');
            gradient.addColorStop(1, 'rgba(25,165,255,0)');

            return {
                labels,
                datasets: [
                    {
                        label: sensorTypeName,
                        //data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
                        data: dataSet,
                        borderColor: '#19A5FF',
                        backgroundColor: gradient,
                        borderWidth: 1,
                        pointBorderColor: '#fff',
                        fontFamily: 'Pretendard',
                        fontSize: '11px',
                    },
                ],
            }
        };
        lineChartUI.push(<Line key={selectedSensorID} options={options} data={data} />)
        return [lineChartUI];
    }

    makeBeforeData(datas, date) {
        let targetTime = date.split(':');
        let targetHour = targetTime[0];
        let targetMinute = targetTime[1];

        let result = null;

        for (let i = 0; i < datas.length; i++) {
            let st = datas[i].timeStamp;
            let devideStr = st.split('T');
            let devideStr2 = devideStr[1].split(':');

            let hisHour = devideStr2[0];
            let hisMinute = devideStr2[1];

            if (hisHour === targetHour && hisMinute === targetMinute) {
                result = datas[i];
                break;
            }
        }

        return result;
    }
    
    static WeatherType = {
        Sunny: 1,
        Cloudy: 2,
        Cloud: 5,
        Rain: 3,
        Snow: 4
    }
    
    getStateImage2(state) {
        if (state === WeatherPopup.WeatherType.Sunny) {
            if (this.isDayLight()) {
                return imgSunnyDay;
            } else {
                return imgSunnyNight;
            }
        }
        
        if (state === WeatherPopup.WeatherType.Cloud || state === WeatherPopup.WeatherType.Cloudy) {
            return imgCloudy
        }
        
        if (state === WeatherPopup.WeatherType.Rain) {
            return imgRain;
        }
        
        if (state === WeatherPopup.WeatherType.Snow) {
            return imgSnow;
        }
    }

    getStateImage(state) { // 수정해야함 2023-07-14;
        if (state === WeatherPopup.Sunshine) {
            if (this.isDayLight()) {
                console.log("맑음 이미지 예정");
                return imgSunnyDay;
            }
            else {
                return imgSunnyNight;
            }
            //return imgSunshine;
        }
        else if (state === WeatherPopup.Thunder) {
            console.log("구름 많음 이미지 예정");
            return imgCloudy;
        }
        else if (state === WeatherPopup.SnowRain) {
            console.log("흐림 이미지 예정");
            return imgCloudDay;
        }
        else if (state === WeatherPopup.HeavySnow) {
            console.log("비 이미지 예정");
            return imgHeavyRain;
        }
        else if (state === WeatherPopup.Snow) {
            console.log("눈비 이미지 예정");
            return imgSnowRain;
        }
        else if (state === WeatherPopup.HeavyRain) {
            console.log("눈 이미지 예정");
            return imgSnow;
        }
        else if (state === WeatherPopup.Rain) {
            console.log("약한 비 이미지 예정");
            return imgRain;
        }
        else if (state === WeatherPopup.Cloudy) {
            console.log("진눈깨비 이미지 예정");
            return imgSnowRain;
        }
        else if (state === WeatherPopup.DustStorm) {
            console.log("눈날림 이미지 예정");
            return imgSnow;
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

    getMaterialValue() {

        if (this.state.selectedSensor) {
            if (this.state.selectedSensor.sensors || this.state.selectedSensor.sensors != undefined) {
                const itemValues = this.state.selectedSensor.sensors;

                let ATM = null;
                let temp = null;
                let humidity = null;
                let rainfall = null;
                let radiation = null;
                let windDirection = null;
                let windSpeed = null;
                /*
                 * 207 = 기압  263 = 강수량
                 * 200 = 온도  264 = 일사량
                 * 201 = 습도  261 = 풍향
                 * 262 = 풍속
                 */
                for (const sensor of itemValues) {
                    if (sensor.sensorType === 207) ATM = sensor.value;
                    if (sensor.sensorType === 200) temp = sensor.value;
                    if (sensor.sensorType === 201) humidity = sensor.value;;
                    if (sensor.sensorType === 263) rainfall = sensor.value;;
                    if (sensor.sensorType === 264) radiation = sensor.value;;
                    if (sensor.sensorType === 261) windDirection = sensor.value;;
                    if (sensor.sensorType === 262) windSpeed = sensor.value;;
                }

                this.setState({ ATM: ATM, temp: temp, humidity: humidity, rainfall: rainfall, radiation: radiation, windDirection: windDirection, windSpeed: windSpeed }, () => {
                });

            }
        }
    }

    getDirection(value) {
        let dirStyle = null;
        let dirString = '북풍';
        // 북풍 Default
        if (value < 22.5) {
            dirStyle = {
                marginTop: '3.5px',
            }
            dirString = '북풍';
        } else if (value < 67.5) {
            dirStyle = {
                marginTop: '4.5px',
                transformOrigin: 'center center',
                transform: 'rotate(45deg)',
                overflow: 'hidden'
            }
            dirString = '북동풍';
        } else if (value < 112.5) {
            dirStyle = {
                marginTop: '3.5px',
                transformOrigin: 'center center',
                transform: 'rotate(90deg)',
                overflow: 'hidden'
            }
            dirString = '동풍';
        } else if (value < 157.5) {
            dirStyle = {
                marginTop: '3px',
                transformOrigin: 'center center',
                transform: 'rotate(135deg)',
                overflow: 'hidden'
            }
            dirString = '남동풍';
        } else if (value < 202.5) {
            dirStyle = {
                marginTop: '3.5px',
                transformOrigin: 'center center',
                transform: 'rotate(180deg)',
                overflow: 'hidden'
            }
            dirString = '남풍';
        } else if (value < 247.5) {
            dirStyle = {
                marginTop: '3.5px',
                marginLeft: '1px',
                transformOrigin: 'center center',
                transform: 'rotate(225deg)',
                overflow: 'hidden'
            }
            dirString = '남서풍';
        } else if (value < 292.5) {
            dirStyle = {
                marginTop: '3.5px',
                transformOrigin: 'center center',
                transform: 'rotate(270deg)',
                overflow: 'hidden'
            }
            dirString = '서풍';
        } else if (value < 337.5) {
            dirStyle = {
                marginTop: '3.5px',
                marginLeft: '1px',
                transformOrigin: 'center center',
                transform: 'rotate(315deg)',
                overflow: 'hidden'
            }
            dirString = '북서풍';
        } else {
            dirStyle = {
                marginTop: '3.5px',
            }
        }

        return [dirStyle, dirString];
    }

    getWindChart() {
        const histories = this.props.dataHistories;
        const sensor = this.props.selectedSensor;

        const curSensor = sensor.sensor;
        const materialType = SDMSResource.materialType.Wind_Dir;

        let selectedSensorID = null;

        if (sensor && materialType) {
            for (let i = 0; i < curSensor.sensors.length; i++) {
                if (curSensor.sensors[i].sensorType === Number(materialType)) {
                    selectedSensorID = curSensor.sensors[i].id;
                    break;
                }
            }
        }

        let date = new Date();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let _minute = (minute - (minute % 5));

        let currentTime = this.getTime(hour, _minute);

        let beforeTime1 = this.getTime(hour, (_minute - 5));
        let beforeTime2 = this.getTime(hour, (_minute - 10));
        let beforeTime3 = this.getTime(hour, (_minute - 15));
        let beforeTime4 = this.getTime(hour, (_minute - 20));
        let beforeTime5 = this.getTime(hour, (_minute - 25));

        let sensorHistories = []

        if (selectedSensorID) {
            for (let i = 0; i < histories.length; i++) {
                if (histories[i].sensorID === selectedSensorID) {
                    sensorHistories.push(histories[i]);
                }
            }
        }

        let currentData = this.makeBeforeData(sensorHistories, currentTime);
        let beforeData1 = this.makeBeforeData(sensorHistories, beforeTime1);
        let beforeData2 = this.makeBeforeData(sensorHistories, beforeTime2);
        let beforeData3 = this.makeBeforeData(sensorHistories, beforeTime3);
        let beforeData4 = this.makeBeforeData(sensorHistories, beforeTime4);
        let beforeData5 = this.makeBeforeData(sensorHistories, beforeTime5);

        let timeSet = [beforeTime5, beforeTime4, beforeTime3, beforeTime2, beforeTime1, currentTime];

        let dataSet = [];

        if (!beforeData5) dataSet.push('0');
        if (!beforeData4) dataSet.push('0');
        if (!beforeData3) dataSet.push('0');
        if (!beforeData2) dataSet.push('0');
        if (!beforeData1) dataSet.push('0');
        if (!currentData) dataSet.push('0');

        if (beforeData5) dataSet.push(beforeData5.sensorValue);
        if (beforeData4) dataSet.push(beforeData4.sensorValue);
        if (beforeData3) dataSet.push(beforeData3.sensorValue);
        if (beforeData2) dataSet.push(beforeData2.sensorValue);
        if (beforeData1) dataSet.push(beforeData1.sensorValue);
        if (currentData) dataSet.push(currentData.sensorValue);

        if (dataSet.length === 0 || !dataSet) {
            dataSet = [120, 20, 83, 94, 155, 306]; // example.
        }

        let elements = [];

        let element = null;

        for (let i = 0; i < dataSet.length; i++) {

            let timeString = timeSet[i];

            if (dataSet[i] == '0') {
                element = <p style={{ fontSize: '11px', width: '30px', height: '60px', margin: '30px 0px' }}>Data<br />Null<br /><br /><span style={{ color: 'white', fontSize: '11px' }}>{timeString}</span></p>
                elements.push(element);
            } else {
                const [dirStyle, dirString] = this.getDirection(dataSet[i]);
                element = <p style={{ fontSize: '11px', width: '30px', height: '60px', margin: '30px 0px' }}>{dirString}<br /><span className={'windDirectionIcon'} style={dirStyle}></span><br /><br /><span style={{ color: 'white', fontSize: '11px' }}>{timeString}</span></p>
                elements.push(element);
            }
        }

        let divStyle = { display: 'flex', color: '#19A5FF', margin: 'auto', textAlign: 'center', justifyContent: 'space-around' };
        let divArea = <div style={divStyle} >{elements}</div>;

        return divArea;

    }

    getCurMaterial = () => {

    }

    render() {
        let [lineChartUI] = [];
        let windDirectionChart = null;

        if (this.state.materialType !== SDMSResource.materialType.Wind_Dir) {
            [lineChartUI] = this.getLineData(this.state.materialType, this.props.selectedSensor);
        } else {
            windDirectionChart = this.getWindChart();
        }

        const [curDate, curTime, stateImg, tempHigh, tempLow, curTemp] = this.getWeatherInfo();

        const [dirStyle, dirString] = this.getDirection(this.state.windDirection);

        let atmStandard = null;

        if (this.state.ATM < 1000) {
            atmStandard = true;
        } else {
            atmStandard = false;
        }

        const isSelectedStyle = {
            backgroundColor: '#4D4D4D',
            border: 'none'
        }

        let humiStyle = this.state.materialType === SDMSResource.materialType.Humi ? isSelectedStyle : null;
        let pressureStyle = this.state.materialType === SDMSResource.materialType.AirPress ? isSelectedStyle : null;
        let rainStyle = this.state.materialType === SDMSResource.materialType.Rainfall ? isSelectedStyle : null;
        let solarStyle = this.state.materialType === SDMSResource.materialType.Solar ? isSelectedStyle : null;
        let windDirStyle = this.state.materialType === SDMSResource.materialType.Wind_Dir ? isSelectedStyle : null;
        let windSpeedStyle = this.state.materialType === SDMSResource.materialType.Wind_Speed ? isSelectedStyle : null;


        return (
            <>
                <WeatherPopupComponent id={this.props.popupType} className={content.weatherPopup + " " + SDMSResource.UISection}>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={373}
                        popupMinHeight={502}
                        topSize={35}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                    >
                     {/* <div className={'sensorInfoDetailBox'}> */}
                            <div className={'sensorInfoTitleBoxW'}>
                                <div className={'sensorInfoDetailTitleW'} /* style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }} */>
                                   <span className={'sensorTitleIcon'}></span>
                                   <span className={'sensorDetailTitle'}>센서 상세정보</span>
                                </div>
                                <div className={'sensorInfoTitleSecondW'}>
                                   <span className={'seosorCloseIcon'} onClick={() => this.props.setVisiblePopups(SDMS.menu.weatherPopup, false, true)}></span>
                                </div>
                           </div>

                            <div className={'sensorInfoContentsWeather'}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span className={'titleTriIcon'}></span>
                                    <span className={'sensorTitleWW'}>통합기상 상세정보</span>
                                </div>
                                <span style={{ display: 'block', width: '100%', height: '1px', border: 'dashed 1px #707070', marginBottom: '6px' }}></span>
                                <div className={'sensorInfoThirdBox'}>
                                    <span className={'sensorNameA'}>{this.state.selectedSensor && this.state.selectedSensor.position}</span>
                                    <span className={'divideLine'}></span>
                                    <span className={'sensorAddress'}>{this.state.selectedSensor && this.state.selectedSensor.address}</span>
                                </div>
                                <div className={'weatherDayBox'}>
                                    <div className={'dayBox'}>
                                        <div className={'dayNumArea'}>
                                            <span className={'dayYear'}>{curDate}</span>
                                            <span className={'dayTime'}>{curTime}</span>
                                        </div>
                                        {/*<DayIcon></DayIcon>*/}
                                        <img className={'weatherImage'} src={stateImg} />
                                        <div className={'temperatureArea'}>
                                            <div className={'temBox'}>
                                                <span className={'temInfoText1'}><span className={'temDownIcon'}></span>{tempLow}&deg;C</span>
                                                <span className={'temInfoText2'}><span className={'temUpIcon'}></span>{tempHigh}&deg;C</span>
                                            </div>
                                            <div className={'temNum'}>{curTemp}℃</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={'weatherIconArea'} style={{ color: "white" }}>
                                    <div className={'humidityBox'} style={humiStyle} onClick={() => this.materialClick(SDMSResource.materialType.Humi)}>
                                        <span className={'humidityIcon'} style={{}}></span>
                                        <span className={'humidityText'}>습도</span>
                                        <p>{this.state.humidity}%</p>
                                    </div>
                                    <div className={'barometricPressureBox'} style={pressureStyle} onClick={() => this.materialClick(SDMSResource.materialType.AirPress)}>
                                        <span className={'barometricPressureIcon'}></span>
                                        {atmStandard ?
                                            <span className={'barometricPressureText'}>기압</span> :
                                            <span className={'barometricPressureText'} /* style={{ padding: '6px 0px 6px 0px' }} */>기압</span>
                                        }
                                        <div className={'pressureText'}>
                                            <p>{this.state.ATM}</p>
                                            <p>hpa</p>
                                        </div>
                                    </div>
                                    <div className={'rainfallBox'} style={rainStyle} onClick={() => this.materialClick(SDMSResource.materialType.Rainfall)}>
                                        <span className={'rainfallIcon'}></span>
                                        <span className={'rainfallText'}/* style={{ padding: '6px 0px 6px 0px' }} */>강수량</span>
                                        <p>{this.state.rainfall}mm</p>
                                    </div>
                                    <div className={'solarRadiationBox'} style={solarStyle} onClick={() => this.materialClick(SDMSResource.materialType.Solar)}>
                                        <span className={'solarRadiationIcon'}></span>
                                        <span className={'solarRadiationText'} /* style={{ padding: '6px 0px 6px 0px' }} */>일사량</span>
                                        <p>{this.state.radiation}W㎡</p>
                                    </div>
                                    <div className={'windDirectionBox'} style={windDirStyle} onClick={() => this.materialClick(SDMSResource.materialType.Wind_Dir)}>
                                        <span className={'windDirectionMIcon'}></span>
                                        <span className={'windDirectionText'} /* style={{ padding: '6px 0px 6px 0px' }} */>풍향</span>
                                        <p style={{ fontSize: '11px' }}>{dirString}<br /><span className={'windDirectionIcon'} style={dirStyle}></span></p>
                                    </div>
                                    <div className={'windSpeedBox'} style={windSpeedStyle} onClick={() => this.materialClick(SDMSResource.materialType.Wind_Speed)}>
                                        <span className={'windSpeedIcon'}></span>
                                        <span className={'windSpeedText'}>풍속</span>
                                        <p>{this.state.windSpeed}m/s</p>
                                    </div>
                                </div>

                                <div style={{ marginTop: '30px' }}>
                                    {this.state.materialType === SDMSResource.materialType.Wind_Dir ? windDirectionChart : lineChartUI}
                                    {/* {lineChartUI} */}
                                </div>
                            </div>
                        {/* </div> */}
                    </PopupDraggable>
                </WeatherPopupComponent>
            </>
        );
    }

};

export default WeatherPopup;