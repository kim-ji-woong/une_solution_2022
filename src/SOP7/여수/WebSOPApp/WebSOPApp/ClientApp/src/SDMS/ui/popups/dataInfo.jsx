import React, { Component, createRef } from 'react';
import SDMSResource from '../../resource/id';
import content from '../../../Common/css/content.module.css';
import PopupDraggable from './popupDraggable';
import SettingsStore from '../../../Settings/settingsStore';
import SDMS from '../sdms';
//import ProjectResource from '../../../Root/resource/id';
import './../../css/popup.css';

import { DataInfoComponent } from './../../sdmsStyled';
import AtmosphereCityPopup from './atmosphereCityPopup';
import $ from 'jquery';

class DataInfo extends Component {

    static materialsNames = {
        co: '일산화탄소(ppm)',
        tsp: '먼지(mg/Sm㎥)',
        hcl: '염화수소(ppm)',
        hf: '불화수소(ppm)',
        nh3: '암모니아(ppm)',
        nox: '질소산화물(ppm)',
        sox: '황산화물(ppm)',
    }

    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            checkedActionData: false,

            publicDatas: null,
            airNodes: null,
            airDatas: null,
            cleanSYS: null,
            sortedCleanSYSs: null,
            kmaAsos: [],

            isOpenAirKorea: false,
            isOpenCleanSYS: false,

            currentCsName: null,
            currentStackCode: null,
            currentCsDatas: null,
        }

        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));

        this.refLayer = React.createRef();
        this.refScrollArea = React.createRef();
        this.refScrollbar = React.createRef();
        this.refTree = React.createRef();

    }

    componentDidMount() {
        this.initDatas();

        $("input:radio[name='tab_itemData']:radio[value='abc']").prop('checked', true); // 선택하기
    }

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            var popup = document.getElementsByClassName(content.vocInfo)[0];
            this.state.popup.style.zIndex = this.props.zIndex;
        }

        if (this.props.zIndexAir !== prevProps.zIndex) {
            // Air ZIndex
        }

        if (this.props.zIndexClean !== prevProps.zIndexClean) {
            // CleanSYS ZIndex
        }

        //this.setScrollbar();
        if (this.state.publicDatas !== this.props.publicDatas) {
            const newDatas = this.props.publicDatas;
            this.setState({ publicDatas: newDatas, airDatas: newDatas.airDataHistories, cleanSYS: newDatas.cleanSYSs, kmaAsos: newDatas.kmaAsos, airNodes: newDatas.airNodes, sortedCleanSYSs: newDatas.sortedCleanSYSs });
            newDatas.clear();
        }
        //
        // if (this.state.cleanSYS !== prevState.cleanSYS) {
        //     this.initDatas();
        // }
    }

    initPopupState() {
        var popup = document.getElementsByClassName(content.dataInfoPopup)[0];

        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        }

        this.setState({ popup: popup });
    }

    repositionPopup(popupState) {
        let data = popupState.dataInfo;

        if (data === null || data === undefined)
            return;

        //let popup = document.getElementsByClassName(content.viewDashboard + ' ' + content.viewDashboardBoxD)[0];
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

    initDatas = () => {
        if (this.props.publicDatas === null || this.props.publicDatas === undefined) {
            return;
        }

        const newDatas = this.props.publicDatas;
        this.setState({ publicDatas: newDatas, airDatas: newDatas.airDataHistories, cleanSYS: newDatas.cleanSYSs, kmaAsos: newDatas.kmaAsos, airNodes: newDatas.airNodes, sortedCleanSYSs: newDatas.sortedCleanSYSs });

    }

    onSelectTabData(checkedActionData) {
        this.setState({ checkedActionData });
    }

    onClickOpenDataPop = (type) => {
        // 클릭시 각 데이터 상세 정보창 ON/OFF

        let isOpenAirKorea = this.state.isOpenAirKorea;
        let isOpenCleanSYS = this.state.isOpenCleanSYS;

        if (type === 0) { // 도시대기
            if (!isOpenAirKorea) {
                isOpenCleanSYS = false;
            }
            this.setState({ isOpenAirKorea: !isOpenAirKorea, isOpenCleanSYS: isOpenCleanSYS });
        }
        else if (type === 1) { // CleanSYS
            if (!isOpenCleanSYS) {
                isOpenAirKorea = false;
            }
            this.setState({ isOpenCleanSYS: !isOpenCleanSYS, isOpenAirKorea: isOpenAirKorea });
        }
    }

    onClickCloseDataPop = (type) => {
        if (type === 0) {
            this.setState({ isOpenAirKorea: false });
        } else if (type === 1) {
            this.setState({ isOpenCleanSYS: false });
        }
    }

    getAirProgressBarWidth = () => {
        const publicDatas = this.state.publicDatas;

        let airDatas = null;

        if (publicDatas) {
            airDatas = publicDatas.airDataHistories;
        }

        return this.getAverage(airDatas);
    }

    // AirKorea Data의 각 Value 평균 구하기
    getAverage(airDatas) {
        if (!airDatas) {
            return [0, 0, 0, 0, 0, 0];
        }
        let coGrade = 0;
        let pm10Grade = 0;
        let pm25Grade = 0;
        let so2Grade = 0;
        let o3Grade = 0;
        let no2Grade = 0;

        let pm10Val = 0;
        let pm25Val = 0;
        let so2Val = 0;
        let o3Val = 0;
        let no2Val = 0;
        let coVal = 0;

        let nodeCount = 9;

        for (let i = 0; i < airDatas.length; i++) {
            let airData = airDatas[i];

            coVal += airData.coGrade;
            pm10Val += airData.pM10Grade;
            pm25Val += airData.pM25Grade;
            so2Val += airData.sO2Grade;
            o3Val += airData.o3Grade;
            no2Val += airData.nO2Grade;
        }

        pm10Grade = Math.floor(pm10Val / nodeCount);
        pm25Grade = Math.floor(pm25Val / nodeCount);
        so2Grade = Math.floor(so2Val / nodeCount);
        o3Grade = Math.floor(o3Val / nodeCount);
        no2Grade = Math.floor(no2Val / nodeCount);
        coGrade = Math.floor(coVal / nodeCount);


        let pm10Width = this.gradeToWidth(pm10Grade);
        let pm25Width = this.gradeToWidth(pm25Grade);
        let o3Width = this.gradeToWidth(o3Grade);
        let so2Width = this.gradeToWidth(so2Grade);
        let no2Width = this.gradeToWidth(no2Grade);
        let coWidth = this.gradeToWidth(coGrade);


        return [pm10Width, pm25Width, o3Width, so2Width, no2Width, coWidth];
    }

    gradeToWidth = (grade) => {
        if (grade === 0) {
            return 0;
        } else if (grade === 1) {
            return 25;
        } else if (grade === 2) {
            return 50;
        } else if (grade === 3) {
            return 75;
        } else {
            return 100;
        }
    }

    // AirKorea Data Value
    getAirValue = () => {
        const publicDatas = this.state.publicDatas;

        let airDatas = null;

        if (publicDatas) {
            airDatas = publicDatas.airDataHistories;
        } else {
            return [0, 0, 0, 0, 0, 0];
        }

        let pm10WholeVal = 0;
        let pm25WholeVal = 0;
        let so2WholeVal = 0;
        let o3WholeVal = 0;
        let noxWholeVal = 0;
        let coWholeVal = 0;
        let nodeCount = 9;

        for (let i = 0; i < airDatas.length; i++) {
            let airData = airDatas[i];

            pm10WholeVal += airData.pM10;
            pm25WholeVal += airData.pM25;
            so2WholeVal += airData.sO2;
            o3WholeVal += airData.o3;
            noxWholeVal += airData.nO2;
            coWholeVal += airData.co;
        }

        let pm10Val = (pm10WholeVal / nodeCount).toFixed(); // 정수
        let pm25Val = (pm25WholeVal / nodeCount).toFixed(); // 정수
        let so2Val = (so2WholeVal / nodeCount).toFixed(3); // 소수
        let o3Val = (o3WholeVal / nodeCount).toFixed(3); // 소수
        let noxVal = (noxWholeVal / nodeCount).toFixed(3); // 소수
        let coVal = (coWholeVal / nodeCount).toFixed(3); // 소수

        return [pm10Val, pm25Val, so2Val, o3Val, noxVal, coVal];
    }

    // CleanSYS Data Value
    getCsVal = () => {

        if (!this.state.publicDatas) {
            return [0, 0, 0, 0, 0, 0, 0];
        }

        const publicDatas = this.state.publicDatas;
        const csDatas = this.state.cleanSYS;

        const dataCount = csDatas.length;

        let tspWholeValue = 0;
        let soxWholeValue = 0;
        let noxWholeValue = 0;
        let hclWholeValue = 0;
        let hfWholeValue = 0;
        let nh3WholeValue = 0;
        let coWholeValue = 0;

        for (let i = 0; i < csDatas.length; i++) {
            let indiCsData = csDatas[i];

            tspWholeValue += this.customTryParseNum(indiCsData.tspMeasureValue);
            soxWholeValue += this.customTryParseNum(indiCsData.soxMeasureValue);
            noxWholeValue += this.customTryParseNum(indiCsData.noxMeasureValue);
            hclWholeValue += this.customTryParseNum(indiCsData.hclMeasureValue);
            hfWholeValue += this.customTryParseNum(indiCsData.hfMeasureValue);
            nh3WholeValue += this.customTryParseNum(indiCsData.nh3MeasureValue);
            coWholeValue += this.customTryParseNum(indiCsData.coMeasureValue);
        }

        let tspMeasureValue, soxMeasureValue, noxMeasureValue, hclMeasureValue, hfMeasureValue, nh3MeasureValue, coMeasureValue = null;

        tspMeasureValue = (tspWholeValue / dataCount).toFixed(2);
        soxMeasureValue = (soxWholeValue / dataCount).toFixed(2);
        noxMeasureValue = (noxWholeValue / dataCount).toFixed(2);
        hclMeasureValue = (hclWholeValue / dataCount).toFixed(2);
        hfMeasureValue = (hfWholeValue / dataCount).toFixed(2);
        nh3MeasureValue = (nh3WholeValue / dataCount).toFixed(2);
        coMeasureValue = (coWholeValue / dataCount).toFixed(2);

        return [tspMeasureValue, soxMeasureValue, noxMeasureValue, hclMeasureValue, hfMeasureValue, nh3MeasureValue, coMeasureValue];
    }

    customTryParseNum = (param) => {
        let num = parseInt(param);
        return isNaN(num) ? null : num;
    }

    // KmaAsos Data Value
    getWeatherValue = () => {

        let wd = 0;
        let ws = 0;
        let pressure = 0;
        let sealevelpressure = 0;
        let temperature = 0;
        let dewpointtemp = 0;
        let humidity = 0;
        let evaporation = 0;
        let rainfall = 0;
        let snowfall3hr = 0;
        let snowfallday = 0;
        let snowfallcover = 0;
        let currentweather = 0;
        let cloudamount = 0;
        let cloudamountmid = 0;
        let cloudheightmin = 0;
        let visibility = 0;
        let hoursunshine = 0;
        let hoursolarradiation = 0;
        let grounstatuscode = 0;
        let grounttemp = 0;
        let temperature005m = 0;
        let temperature01m = 0;
        let temperature02m = 0;
        let temperature03m = 0;
        let rainfallday = 0;

        let dateTime = [];

        if (!this.state.publicDatas) {
            return [wd, ws, pressure, sealevelpressure, temperature, dewpointtemp, humidity, evaporation, rainfall, snowfall3hr, snowfallday, snowfallcover, currentweather, cloudamount, cloudamountmid, cloudheightmin, visibility, hoursunshine, hoursolarradiation, grounstatuscode, grounttemp, temperature005m, temperature01m, temperature02m, temperature03m, rainfallday, dateTime];
        }

        if (this.state.kmaAsos.length === 0) {
            return ["Null", ws, pressure, sealevelpressure, temperature, dewpointtemp, humidity, evaporation,
                rainfall, snowfall3hr, snowfallday, snowfallcover, "Null", "Null", "Null", "Null",
                visibility, hoursunshine, hoursolarradiation, grounstatuscode, grounttemp, temperature005m, temperature01m, temperature02m, temperature03m, rainfallday, dateTime];
        }

        let weathers = this.state.kmaAsos[0];

        wd = weathers?.wd ? weathers.wd : 0;
        ws = weathers?.ws ? weathers.ws : 'Null';
        pressure = weathers?.pressure ? weathers.pressure : 'Null';
        sealevelpressure = weathers?.seaLevelPressure ? weathers.seaLevelPressure : 'Null';
        temperature = weathers?.temperature ? weathers.temperature : 'Null';
        dewpointtemp = weathers?.dewPointTemp ? weathers.dewPointTemp : 'Null';
        humidity = weathers?.humidity ? weathers.humidity : 'Null';
        evaporation = weathers?.evaporation ? weathers.evaporation : 'Null';
        rainfall = weathers?.rainfall ? weathers.rainfall : 'Null';
        snowfall3hr = weathers?.snowfall3hr ? weathers.snowfall3hr : 'Null';
        snowfallday = weathers?.snowfallDay ? weathers.snowfallDay : 'Null';
        snowfallcover = weathers?.snowfallCover ? weathers.snowfallCover : 'Null';
        currentweather = weathers?.currentWeather ? weathers.currentWeather : 0;
        cloudamount = weathers?.cloudamount ? weathers.cloudamount : 0;
        cloudamountmid = weathers?.cloudamountmid ? weathers.cloudamountmid : 'Null';
        cloudheightmin = weathers?.cloudheightmin ? weathers.cloudheightmin : 'Null';
        visibility = weathers?.visibility ? weathers.visibility : 'Null';
        hoursunshine = weathers?.hourSunshine ? weathers.hourSunshine : 'Null';
        hoursolarradiation = weathers?.hoursolarRadiation ? weathers.hoursolarRadiation : 'Null';
        grounstatuscode = weathers?.grounStatusCode ? weathers.grounStatusCode : 'Null';
        grounttemp = weathers?.grounttemp ? weathers.grounttemp : 'Null';
        temperature005m = weathers?.temperature005m ? weathers.temperature005m : 'Null';
        temperature01m = weathers?.temperature01m ? weathers.temperature01m : 'Null';
        temperature02m = weathers?.temperature02m ? weathers.temperature02m : 'Null';
        temperature03m = weathers?.temperature03m ? weathers.temperature03m : 'Null';
        rainfallday = weathers?.rainfallDay ? weathers.rainfallDay : 'Null';

        let logDate = weathers?.logDate;

        let year = logDate.substring(0, 4);
        let month = logDate.substring(4, 6);
        let day = logDate.substring(6, 8);
        let hours = logDate.substring(8, 10);
        let minutes = '00'

        let date = year + "." + month + "." + day;
        let time = hours + ":" + minutes;

        dateTime = [date, time]

        return [this.getWindDirection(wd), ws, pressure, sealevelpressure, temperature, dewpointtemp, humidity, evaporation,
            rainfall, snowfall3hr, snowfallday, snowfallcover, this.getCurrentWeather(currentweather), this.getCloudAmount(cloudamount), this.getCloudAmount(cloudamountmid), this.getCloudAmount(cloudheightmin),
            visibility, hoursunshine, hoursolarradiation, grounstatuscode, grounttemp, temperature005m, temperature01m, temperature02m, temperature03m, rainfallday, dateTime];

    }

    getWindDirection = (direction) => {

        let strDirection = '';

        if (!direction) {
            return strDirection;
        }

        // 현재 풍향 코드에 따른 문자열 반환
        switch (direction) {
            case 36:
                strDirection = '북'
                break;
            case 2:
                strDirection = '북북동';
                break;
            case 5:
                strDirection = '북동';
                break;
            case 7:
                strDirection = '동북동';
                break;
            case 9:
                strDirection = '동';
                break;
            case 11:
                strDirection = '동남동';
                break;
            case 14:
                strDirection = '남동';
                break;
            case 16:
                strDirection = '남남동';
                break;
            case 18:
                strDirection = '남';
                break;
            case 20:
                strDirection = '남남서';
                break;
            case 23:
                strDirection = '남서';
                break;
            case 25:
                strDirection = '서남서';
                break;
            case 27:
                strDirection = '서';
                break;
            case 29:
                strDirection = '서북서';
                break;
            case 32:
                strDirection = '북서';
                break;
            case 34:
                strDirection = '북북서';
                break;
            case 0:
                strDirection = 'Calm';
                break;
            case 99:
                strDirection = '다변화';
                break;
            default:
                strDirection = '알수없음';
                break;
        }

        return strDirection;
    }

    getCurrentWeather = (code) => {

        let strCurrentWeather = null;

        // 현재 날씨 코드에 따른 문자열 반환
        switch (code) {
            case 0:
                strCurrentWeather = "구름없음";
                break;
            case 1:
                strCurrentWeather = "구름감소";
                break;
            case 2:
                strCurrentWeather = "하늘상태 변화없음";
                break;
            case 3:
                strCurrentWeather = "구름발달";
                break;
            case 4:
                strCurrentWeather = "연기";
                break;
            case 5:
                strCurrentWeather = "연무";
                break;
            case 6:
                strCurrentWeather = "황사";
                break;
            case 7:
                strCurrentWeather = "먼지, 모래 날림";
                break;
            case 8:
                strCurrentWeather = "회오리바람";
                break;
            case 9:
                strCurrentWeather = "먼지보라";
                break;
            case 10:
                strCurrentWeather = "박무";
                break;
            case 11:
                strCurrentWeather = "낮은 안개가 산재됨";
                break;
            case 12:
                strCurrentWeather = "낮은 안개가 연속";
                break;
            case 13:
                strCurrentWeather = "번개";
                break;
            case 14:
                strCurrentWeather = "시계내 강수";
                break;
            case 15:
                strCurrentWeather = "시계내 강수(5km이상밖)";
                break;
            case 16:
                strCurrentWeather = "시계내 강수";
                break;
            case 17:
                strCurrentWeather = "뇌전, 강수없음";
                break;
            case 18:
                strCurrentWeather = "스콜";
                break;
            case 19:
                strCurrentWeather = "용오름";
                break;
            case 20:
                strCurrentWeather = "이슬비 끝";
                break;
            case 21:
                strCurrentWeather = "비 끝";
                break;
            case 22:
                strCurrentWeather = "눈 끝";
                break;
            case 23:
                strCurrentWeather = "진눈개비 끝";
                break;
            case 24:
                strCurrentWeather = "어는 비 끝";
                break;
            case 25:
                strCurrentWeather = "소나기 끝";
                break;
            case 40:
                strCurrentWeather = "시계내 안개";
                break;
            case 41:
                strCurrentWeather = "부분 안개";
                break;
            case 42:
                strCurrentWeather = "안개 엷어짐";
                break;
            case 43:
                strCurrentWeather = "안개 엷어짐";
                break;
            case 44:
                strCurrentWeather = "안개 변화없음";
                break;
            case 45:
                strCurrentWeather = "안개 변화없음";
                break;
            case 46:
                strCurrentWeather = "안개 짙어짐";
                break;
            case 47:
                strCurrentWeather = "안개 짙어짐";
                break;
            case 48:
                strCurrentWeather = "무빙";
                break;
            case 49:
                strCurrentWeather = "무빙";
                break;
            case 50:
                strCurrentWeather = "약한 이슬비 단속적";
                break;
            case 51:
                strCurrentWeather = "약한 이슬비 연속적";
                break;
            case 52:
                strCurrentWeather = "보통 이슬비 단속적";
                break;
            case 53:
                strCurrentWeather = "보통 이슬비 연속적";
                break;
            case 54:
                strCurrentWeather = "강한 이슬비 단속적";
                break;
            case 55:
                strCurrentWeather = "강한 이슬비 연속적";
                break;
            case 56:
                strCurrentWeather = "약한 어는 이슬비";
                break;
            case 57:
                strCurrentWeather = "강한 어는 이슬비";
                break;
            case 58:
                strCurrentWeather = "약한 이슬비와 비";
                break;
            case 59:
                strCurrentWeather = "강한 이슬비와 비";
                break;
            case 60:
                strCurrentWeather = "약한 비 단속적";
                break;
            case 61:
                strCurrentWeather = "약한 비 연속적";
                break;
            case 62:
                strCurrentWeather = "보통 비 단속적";
                break;
            case 63:
                strCurrentWeather = "보통 비 연속적";
                break;
            case 64:
                strCurrentWeather = "강한 비 단속적";
                break;
            case 65:
                strCurrentWeather = "강한 비 연속적";
                break;
            case 80:
                strCurrentWeather = "약한 소나기";
                break;
            case 81:
                strCurrentWeather = "보통 소나기";
                break;
            case 82:
                strCurrentWeather = "강한 소나기";
                break;
            case 83:
                strCurrentWeather = "약한 진눈깨비";
                break;
            case 84:
                strCurrentWeather = "강한 진눈깨비";
                break;
            case 85:
                strCurrentWeather = "약한 소낙눈";
                break;
            case 86:
                strCurrentWeather = "강한 소낙눈";
                break;
            case 87:
                strCurrentWeather = "약한 싸락눈";
                break;
            case 88:
                strCurrentWeather = "강한 싸락눈";
                break;
            case 89:
                strCurrentWeather = "약한 우박";
                break;
            case 90:
                strCurrentWeather = "강한 우박";
                break;
            case 91:
                strCurrentWeather = "뇌전 끝, 약한 비";
                break;
            case 92:
                strCurrentWeather = "뇌전 끝, 강한 비";
                break;
            case 93:
                strCurrentWeather = "뇌전 끝, 약한 눈";
                break;
            case 94:
                strCurrentWeather = "뇌전 끝, 강한 우박";
                break;
            case 95:
                strCurrentWeather = "뇌전, 비";
                break;
            case 96:
                strCurrentWeather = "뇌전, 우박";
                break;
            case 97:
                strCurrentWeather = "뇌전, 눈";
                break;
            case 98:
                strCurrentWeather = "뇌전, 먼지보라";
                break;
            case 99:
                strCurrentWeather = "강한 뇌전, 우박";
                break;
            default:
                strCurrentWeather = "알 수 없는 상태";
                break;
        }

        return strCurrentWeather;
    }

    getCloudAmount = (param) => {
        let strCloudAmount = '';
        if (param >= 0) {
            strCloudAmount = '맑음'
        } else if (param >= 6) {
            strCloudAmount = '구름많음';
        } else if (param >= 9) {
            strCloudAmount = '흐림';
        } else {
            strCloudAmount = 'Undefined';
        }

        return strCloudAmount;
    }

    // CleanSYS UI
    getCleanSYS = () => {
        if (this.state.cleanSYS === null || this.state.cleanSYS === undefined) {
            return;
        }

        if (this.state.sortedCleanSYSs === null || this.state.sortedCleanSYSs === undefined) {
            return;
        }
        
        const csDatas = this.state.cleanSYS;
        const csDataList = this.state.sortedCleanSYSs;

        let factoryNames = [];
        let factoryIDs = [];
        let factoryOptions = [];

        let stackCodeOptions = [];

        for (const [key, values] of Object.entries(csDataList)) {

            let csID = parseInt(key) + 1;
            let factoryName = Object.keys(values)[0];

            factoryIDs.push(csID);
            factoryNames.push(factoryName);
            
        }

        const factoryDefaultOption = <option key="default" value="default" disabled hidden>지역을 선택해주세요.</option>;
        factoryOptions.push(factoryDefaultOption);

        // 측정소 위치 Select Option
        for (let i = 0; i < factoryNames.length; i++) {
            let factoryOption = <option key={factoryNames[i]} value={factoryNames[i]}>{factoryNames[i]}</option>

            factoryOptions.push(factoryOption);
        }

        if (!this.state.currentStackCode) {
            const factoryStackCodeDefaultOption = <option key="default" value="default" disabled hidden>배출구</option>;
            stackCodeOptions.push(factoryStackCodeDefaultOption);
        }

        // 배출구 Select Option
        if (this.state.currentCsName !== null) {

            let csIndex = parseInt(this.state.currentStackCode) - 1;

            //if (this.state.sortedCleanSYSs[csIndex] !== null && this.state.sortedCleanSYSs[csIndex] !== undefined) {
            //if (this.isThereCsIndexByName(csIndex, this.state.currentCsName)) {
            //    //for (const cs in this.state.sortedCleanSYSs[this.state.currentCsName]) {
            //    //    let element = <option value={cs.stackCode}>배출구{cs.stackCode}</option>
            //    //    stackCodeOptions.push(element);
            //    //}
            //    for (let k = 0; k < this.state.sortedCleanSYSs.length; k++) {
            //        let csList = this.state.sortedCleanSYSs[k];
            //        let cs = csList[this.state.currentCsName];

            //        if (cs !== null && cs !== undefined) {
            //            for (let m = 0; m < cs.length; m++) {
            //                cs = cs.sort((a, b) => a.stackCode - b.stackCode);
            //                let element = <option key={cs[m].stackCode} value={cs[m].stackCode}>배출구{cs[m].stackCode}</option>
            //                stackCodeOptions.push(element);
            //            }
            //            break;
            //        }

            //    }
            //}

            for (let k = 0; k < this.state.sortedCleanSYSs.length; k++) {
                let csList = this.state.sortedCleanSYSs[k];
                let cs = csList[this.state.currentCsName];

                if (cs !== null && cs !== undefined) {
                    for (let m = 0; m < cs.length; m++) {
                        cs = cs.sort((a, b) => a.stackCode - b.stackCode);
                        let element = <option key={cs[m].stackCode} value={cs[m].stackCode}>배출구{cs[m].stackCode}</option>
                        stackCodeOptions.push(element);
                    }
                    break;
                }

            }
        }

        let materialElements = [];

        // material
        // standard
        // value

        let targetCs = [];

        if (this.state.currentCsName !== null && this.state.currentCsName !== undefined) {
            if (this.state.currentStackCode !== null && this.state.currentStackCode !== undefined) {

                targetCs = this.state.currentCsDatas;

                targetCs.sort((a, b) => a.stackCode - b.stackCode);

                for (let i = 0; i < targetCs.length; i++) {
                    // 각 배출구 Material 정보 만들기
                    materialElements = this.makeCsMaterialsUI(targetCs);
                }
            }
        }

        let ui = // CleanSYS Data Layer
            <div className={'tab-btn-contentData cleanSYS'}>
                <div className={'cleanFlex'}>
                    
                    {/* <CleanSearch>*/}
                    {/*    <label for="numbers"><CleanSearchIcon></CleanSearchIcon></label>*/}
                    {/*    */}{/*<input type="text" list="list" id="numbers" value={this.state.currentCsName} onChange={this.onChangeCsName} />*/}
                    {/*    <select id="numbers" value={this.state.currentCsName} onChange={this.onChangeCsName} className="datalist" id="list"> */}
                    {/*        {factoryOptions}*/}
                    {/*    </select>*/}
                    {/*</CleanSearch>*/}
                    
                    <div className={'cleanSelectPlace'}>
                        <select defaultValue="default" onChange={(e) => this.onChangeCsName(e)} /* ref={} onChange={(e) => (e.target)} */>
                            {factoryOptions}
                        </select>
                    </div>
                    <div className={'cleanSelect'}>
                        <select defaultValue="default" onChange={this.onChangeStackCode}>
                            {stackCodeOptions}
                        </select>
                    </div>
                </div>

                <div className={'tab_contentData'}>
                    <div className={'tabCleanScroll'}>
                        <div className={'cleanSYSTable'}>
                            <table>
                                <tbody>
                                    <tr className={'itemBoxTr'}>
                                        <th>항목(단위)</th>
                                        <th>배출 허용 기준</th>
                                        <th>농도</th>
                                    </tr>
                                    {materialElements}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/*<PopOpenIcon onClick={() => this.onClickOpenDataPop(1)}></PopOpenIcon>*/}
                {/*{*/}
                {/*    this.state.isOpenCleanSYS &&*/}
                {/*    <CleanSYSPopup*/}
                {/*        onClickCloseDataPop={this.onClickCloseDataPop}*/}
                {/*        cleanSYS={this.state.cleanSYS}>*/}
                {/*    </CleanSYSPopup>*/}
                {/*}*/}
            </div>

        return ui;
    }

    isThereCsIndexByName = (index, currentCsName) => {

        const sortedCsList = this.state.sortedCleanSYSs;

        for (let i = 0; i < sortedCsList?.length; i++) {
            const cs = sortedCsList[i];

            console.log(cs);
        }

        return true;
    }

    makeCsMaterialsUI = (csDatas) => {
        let resultArray = [];

        const currentStackCode = parseInt(this.state.currentStackCode);

        let targetCs = null;

        for (let i = 0; i < csDatas.length; i++) {
            let csData = csDatas[i];
            let csStackCode = parseInt(csData.stackCode);
            if (csStackCode === currentStackCode) {
                targetCs = csData;
                break;
            }
        }

        let materials = {
            co: {
                name: DataInfo.materialsNames.co,
                standard: targetCs.coExhstpermstdValue,
                value: targetCs.coMeasureValue
            },

            hcl: {
                name: DataInfo.materialsNames.hcl,
                standard: targetCs.hclExhstpermstdValue,
                value: targetCs.hclMeasureValue
            },

            hf: {
                name: DataInfo.materialsNames.hf,
                standard: targetCs.hfExhstpermstdValue,
                value: targetCs.hfMeasureValue
            },

            nh3: {
                name: DataInfo.materialsNames.nh3,
                standard: targetCs.nh3ExhstpermstdValue,
                value: targetCs.nh3MeasureValue
            },

            nox: {
                name: DataInfo.materialsNames.nox,
                standard: targetCs.noxExhstpermstdValue,
                value: targetCs.noxMeasureValue
            },

            sox: {
                name: DataInfo.materialsNames.sox,
                standard: targetCs.soxExhstpermstdValue,
                value: targetCs.soxMeasureValue
            },

            tsp: {
                name: DataInfo.materialsNames.tsp,
                standard: targetCs.tspExhstpermstdValue,
                value: targetCs.tspMeasureValue
            }
        }

        for (const key in materials) {
            if (materials.hasOwnProperty(key)) {
                const indiCs = materials[key];

                let name = indiCs.name;
                let standard = indiCs.standard;
                let value = indiCs.value;

                if (standard === '' || standard === null || value === undefined)
                    continue;

                if (value === '' || value === null || value === undefined)
                    continue;

                if (value === '측정자료확인중(가동중지)') {
                    value = '측정자료확인중';
                }

                let element =
                    <tr className={'itemBoxBodyTr'} key={name}>
                        <td>{name}</td>
                        <td>{standard}</td>
                        <td className={'itemBlueText'}>{value}</td>
                    </tr>

                resultArray.push(element);
            }
        }

        return resultArray;

    }

    onChangeCsName = (event) => {
        const input = event.target;
        const value = input.value;

        let firstStackCode = null;

        if (value === null || value === undefined || value === '') {
            this.setState({
                currentCsName: null,
                currentStackCode: null,
                currentCsDatas: null,
            });
            return;
        }

        if (this.state.sortedCleanSYSs === null || this.state.sortedCleanSYSs === undefined)
            return;

        const csList = this.state.sortedCleanSYSs;

        let csDatas = null;

        for (let i = 0; i < csList.length; i++) {
            let cs = csList[i];
            if (cs[value] !== null && cs[value] !== undefined) {
                csDatas = cs[value];
                break;
            }
        }

        if (csDatas !== null && csDatas !== undefined) {
            firstStackCode = parseInt(csDatas[0].stackCode);
        }

        this.setState({
            currentCsName: value,
            currentStackCode: firstStackCode,
            currentCsDatas: csDatas,
        });

    }

    onChangeStackCode = (event) => {
        const input = event.target;
        const value = input.value;

        this.setState({ currentStackCode: value });
    }


    render() {
        const checkedActionData = this.state.checkedActionData;
        //const elementCount = [0, 0];

        // Air Data Value (Average)
        const [pm10Val, pm25Val, so2Val, o3Val, coVal, noxVal] = this.getAirValue();

        // Air Progress Bar Width
        const [pm10Width, pm25Width, o3Width, so2width, noxWidth, coWidth] = this.getAirProgressBarWidth(pm10Val, pm25Val, so2Val, o3Val, coVal, noxVal);

        // CleanSYS Value 
        const csDatas = this.getCleanSYS();

        // KmaAsos Value
        const [wd, ws, pressure, sealevelpressure, temperature, dewpointtemp, humidity, evaporation, rainfall, snowfall3hr, snowfallday, snowfallcover, currentweather, cloudamount, cloudamountmid, cloudheightmin, visibility, hoursunshine, hoursolarradiation, grounstatuscode, grounttemp, temperature005m, temperature01m, temperature02m, temperature03m, rainfallday, dateTime] = this.getWeatherValue();

        let test = null;

        return (
            <>
                <DataInfoComponent id={this.props.popupType} className={content.dataInfoPopup + " " + SDMSResource.UISection}>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={373}
                        popupMinHeight={545}
                        topSize={35}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                    >

                      {/* <div className={'sensorInfoBoxPublic'}> */}
                        <div className={'sensorDslTop'} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className={'sensorInfoDetailTitleD'}>
                              <span className={'networkTitleIcon'}></span>
                              <span className={'sensorTitle'}>공공데이터</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span className={'seosorCloseIcon'} onClick={() => this.props.setVisiblePopups(SDMS.menu.dataInfo, false)}></span>
                            </div>
                        </div>

                         <div className={'contentPaddingBox'} style={{ minHeight: '500px' }}>
                            <div className={'tabsData'}>
                                <span className={'tabsBoxData'}>
                                    {
                                        !checkedActionData &&
                                        <input id="atmosphereCity" type="radio" name="tab_itemData" style={{ display: 'none' }} value="abc" className={'tab-switchData atmosphereCity'}  />
                                    }
                                    {
                                        checkedActionData &&
                                        <input id="atmosphereCity" type="radio" name="tab_itemData" style={{ display: 'none' }} className={'tab-switchData atmosphereCity'} />
                                    }
                                    <label className={'tab_itemData'} htmlFor="atmosphereCity">도시대기측정망</label>
                                    {
                                        // Air Data Layer
                                        <div className={'tab-btn-contentData atmosphereCity'}>
                                            <div className={'tab_contentData'}>
                                                <div className={'tabCityScroll'}>
                                                <div style={{ display: 'flex', marginBottom: '20px' }}>
                                                    <span className={'IconDustBox'}></span>
                                                    <div className={'dataBoxArea'}>
                                                       <span className={'dataBoxText'}>PM2.5</span>
                                                       <span className={'dataUnit'}>{pm25Val}㎍/㎥</span>
                                                    </div>
                                                  {/* <div className={content.progressBox}>
                                                      <div className={content.progress}>
                                                            <div className={content.progressValue} style={{ width: `${pm25Width}%`} }></div>
                                                      </div>
                                                   </div> */}
                                                    <div className={'progressBox'}>
                                                        <div className={'progress'}>
                                                            <div className={'progressValue'} style={{ width: `${pm25Width}%` }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', marginBottom: '20px' }}>
                                                    <span className={'IconDustBox'}></span>
                                                    <div className={'dataBoxArea'}>
                                                       <span className={'dataBoxText'}>PM10</span>
                                                       <span className={'dataUnit'}>{pm10Val}㎍/㎥</span>
                                                    </div>
                                                   {/* <div className={content.progressBox}>
                                                        <div className={content.progress}>
                                                            <div className={content.progressValue} style={{ width: `${pm10Width}%` }}></div>
                                                        </div>
                                                    </div> */}
                                                    <div className={'progressBox'}>
                                                        <div className={'progress'}>
                                                            <div className={'progressValue'} style={{ width: `${pm10Width}%` }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', marginBottom: '20px' }}>
                                                    <span className={'IconO3Box'}></span>
                                                    <div className={'dataBoxArea'}>
                                                        <span className={'dataBoxText'}>O3</span>
                                                        <span className={'dataUnit'}>{o3Val}㎍/㎥</span>
                                                    </div>
                                                    <div className={'progressBox'}>
                                                        <div className={'progress'}>
                                                            <div className={'progressValue'} style={{ width: `${o3Width}%` }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', marginBottom: '20px' }}>
                                                    <span className={'IconSO2Box'}></span>
                                                    <div className={'dataBoxArea'}>
                                                        <span className={'dataBoxText'}>SO2</span>
                                                        <span className={'dataUnit'}>{so2Val}㎍/㎥</span>
                                                    </div>
                                                    <div className={'progressBox'}>
                                                        <div className={'progress'}>
                                                            <div className={'progressValue'} style={{ width: `${so2width}%` }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', marginBottom: '20px' }}>
                                                    <span className={'IconSO2Box'}></span>
                                                    <div className={'dataBoxArea'}>
                                                        <span className={'dataBoxText'}>Nox</span>
                                                        <span className={'dataUnit'}>{noxVal}㎍/㎥</span>
                                                    </div>
                                                    <div className={'progressBox'}>
                                                        <div className={'progress'}>
                                                            <div className={'progressValue'} style={{ width: `${noxWidth}%` }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', marginBottom: '20px' }}>
                                                    <span className={'IconSO2Box'}></span>
                                                    <div className={'dataBoxArea'}>
                                                        <span className={'dataBoxText'}>CO</span>
                                                        <span className={'dataUnit'}>{coVal}㎍/㎥</span>
                                                    </div>
                                                    <div className={'progressBox'}>
                                                        <div className={'progress'}>
                                                            <div className={'progressValue'} style={{ width: `${coWidth}%` }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                              </div>
                                            </div>

                                            <span style={{ display: 'block', border: 'dashed 1px #414141', height: '1px' }}></span>
                                            <div className={'popOpenIcon'} onClick={() => this.onClickOpenDataPop(0)}></div>
                                        </div>
                                    }

                                    {
                                        checkedActionData &&
                                        <input id="weatherPlace" type="radio" name="tab_itemData" style={{ display: 'none' }} className={'tab-switchData weatherPlace'} />
                                    }
                                    {
                                        !checkedActionData &&
                                        <input id="weatherPlace" type="radio" name="tab_itemData" style={{ display: 'none' }} className={'tab-switchData weatherPlace'} />
                                    }
                                    <label className={'tab_itemData'} htmlFor="weatherPlace">기상청</label>

                                    {
                                        // Kma Asos Data Layer
                                        <div className={'tab-btn-contentData weatherPlace'}>
                                            <div className={'tab_contentData'}>
                                                <div className={'tabWeatherScroll'}>
                                                <div style={{ display: 'flex' }}>
                                                    <div className={'weatherPlaceBox'}>
                                                       <span className={'weatherNum'}>1</span>
                                                       <div style={{ display: 'block' }}>
                                                         <span className={'weatherPlaceTitle'}>측정 일시</span>
                                                         <span className={'weatherPlaceDate'}>{dateTime[0]}</span>
                                                         <span className={'weatherPlaceTime'}>{dateTime[1]}</span>
                                                       </div>
                                                    </div>
                                                    <div className={'weatherPlaceBox'}>
                                                        <span className={'weatherNum'}>2</span>
                                                        <div style={{ display: 'block' }}>
                                                           <span className={'weatherPlaceTitle'}>풍향</span>
                                                           <span className={'weatherPlaceDate'}>{wd}</span>
                                                        </div>
                                                    </div>
                                                    <div className={'weatherPlaceBox'}>
                                                        <span className={'weatherNum'}>3</span>
                                                        <div style={{ display: 'block' }}>
                                                           <span className={'weatherPlaceTitle'}>풍속</span>
                                                           <span className={'weatherPlaceDate'}>{ws}m/s</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', marginTop: '14px' }}>
                                                    <div className={'weatherPlaceBox'}>
                                                        <span className={'weatherNum'}>4</span>
                                                        <div style={{ display: 'block' }}>
                                                           <span className={'weatherPlaceTitle'}>현지기압</span>
                                                           <span className={'weatherPlaceDate'}>{pressure}hPa</span>
                                                        </div>
                                                    </div>
                                                    <div className={'weatherPlaceBox'}>
                                                        <span className={'weatherNum'}>5</span>
                                                        <div style={{ display: 'block' }}>
                                                           <span className={'weatherPlaceTitle'}>해면기압</span>
                                                           <span className={'weatherPlaceDate'}>{sealevelpressure}hPa</span>
                                                        </div>
                                                    </div>
                                                    <div className={'weatherPlaceBox'}>
                                                        <span className={'weatherNum'}>6</span>
                                                        <div style={{ display: 'block' }}>
                                                            <span className={'weatherPlaceTitle'}>기온</span>
                                                            <span className={'weatherPlaceDate'}>{temperature}℃</span>
                                                        </div>
                                                     </div>
                                                </div>

                                                <div style={{ display: 'flex', marginTop: '14px' }}>
                                                    <div className={'weatherPlaceBox'}>
                                                        <span className={'weatherNum'}>7</span>
                                                        <div style={{ display: 'block' }}>
                                                            <span className={'weatherPlaceTitle'}>이슬점</span>
                                                            <span className={'weatherPlaceDate'}>{dewpointtemp}℃</span>
                                                        </div>
                                                    </div>
                                                    <div className={'weatherPlaceBox'}>
                                                        <span className={'weatherNum'}>8</span>
                                                        <div style={{ display: 'block' }}>
                                                            <span className={'weatherPlaceTitle'}>습도</span>
                                                            <span className={'weatherPlaceDate'}>{humidity}%</span>
                                                        </div>
                                                    </div>
                                                    <div className={'weatherPlaceBox'}>
                                                        <span className={'weatherNum'}>9</span>
                                                        <div style={{ display: 'block' }}>
                                                            <span className={'weatherPlaceTitle'}>증기압</span>
                                                            <span className={'weatherPlaceDate'}>{evaporation}hPa</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', marginTop: '14px' }}>
                                                    <div className={'weatherPlaceBox'}>
                                                        <span className={'weatherNum'}>10</span>
                                                        <div style={{ display: 'block' }}>
                                                            <span className={'weatherPlaceTitle'}>강수량</span>
                                                            <span className={'weatherPlaceDate'}>{rainfall}mm</span>
                                                        </div>
                                                    </div>
                                                    <div className={'weatherPlaceBox'}>
                                                        <span className={'weatherNum'}>11</span>
                                                        <div style={{ display: 'block' }}>
                                                            <span className={'weatherPlaceTitle'}>적설(3시간)</span>
                                                            <span className={'weatherPlaceDate'}>{snowfall3hr}cm</span>
                                                        </div>
                                                    </div>
                                                    <div className={'weatherPlaceBox'}>
                                                        <span className={'weatherNum'}>12</span>
                                                        <div style={{ display: 'block' }}>
                                                            <span className={'weatherPlaceTitle'}>적설(일)</span>
                                                            <span className={'weatherPlaceDate'}>{snowfallday}cm</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', marginTop: '14px' }}>
                                                    <div className={'weatherPlaceBox'}>
                                                        <span className={'weatherNum'}>13</span>
                                                        <div style={{ display: 'block' }}>
                                                            <span className={'weatherPlaceTitle'}>적설(누적)</span>
                                                            <span className={'weatherPlaceDate'}>{snowfallcover}cm</span>
                                                        </div>
                                                    </div>
                                                    <div className={'weatherPlaceBox'}>
                                                        <span className={'weatherNum'}>14</span>
                                                        <div style={{ display: 'block' }}>
                                                            <span className={'weatherPlaceTitle'}>현재일기</span>
                                                            <span className={'weatherPlaceDate'}>{currentweather}</span>
                                                        </div>
                                                    </div>
                                                    <div className={'weatherPlaceBox'}>
                                                        <span className={'weatherNum'}>15</span>
                                                        <div style={{ display: 'block' }}>
                                                            <span className={'weatherPlaceTitle'}>전운량</span>
                                                            <span className={'weatherPlaceDate'}>{cloudamount}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', marginTop: '14px' }}>
                                                    <div className={'weatherPlaceBox'}>
                                                        <span className={'weatherNum'}>16</span>
                                                        <div style={{ display: 'block' }}>
                                                            <span className={'weatherPlaceTitle'}>중하층운량</span>
                                                            <span className={'weatherPlaceDate'}>{cloudamountmid}</span>
                                                        </div>
                                                    </div>
                                                    <div className={'weatherPlaceBox'}>
                                                        <span className={'weatherNum'}>17</span>
                                                        <div style={{ display: 'block' }}>
                                                            <span className={'weatherPlaceTitle'}>최저운고</span>
                                                            <span className={'weatherPlaceDate'}>{cloudheightmin}</span>
                                                        </div>
                                                    </div>
                                                    <div className={'weatherPlaceBox'}>
                                                        <span className={'weatherNum'}>18</span>
                                                        <div style={{ display: 'block' }}>
                                                            <span className={'weatherPlaceTitle'}>시정</span>
                                                            <span className={'weatherPlaceDate'}>{visibility}(10m)</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', marginTop: '14px' }}>
                                                    <div className={'weatherPlaceBox'}>
                                                        <span className={'weatherNum'}>19</span>
                                                        <div style={{ display: 'block' }}>
                                                            <span className={'weatherPlaceTitle'}>일조</span>
                                                            <span className={'weatherPlaceDate'}>{hoursunshine}/hr</span>
                                                        </div>
                                                    </div>
                                                    <div className={'weatherPlaceBox'}>
                                                        <span className={'weatherNum'}>20</span>
                                                        <div style={{ display: 'block' }}>
                                                            <span className={'weatherPlaceTitle'}>일사</span>
                                                            <span className={'weatherPlaceDate'}>{hoursolarradiation}MJ/㎡</span>
                                                        </div>
                                                    </div>
                                                    <div className={'weatherPlaceBox'}>
                                                        <span className={'weatherNum'}>21</span>
                                                        <div style={{ display: 'block' }}>
                                                            <span className={'weatherPlaceTitle'}>지면상태</span>
                                                            <span className={'weatherPlaceDate'}>{grounstatuscode}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', marginTop: '14px' }}>
                                                    <div className={'weatherPlaceBox'}>
                                                        <span className={'weatherNum'}>22</span>
                                                        <div style={{ display: 'block' }}>
                                                            <span className={'weatherPlaceTitle'}>지면온도</span>
                                                            <span className={'weatherPlaceDate'}>{grounttemp}℃</span>
                                                        </div>
                                                    </div>
                                                    <div className={'weatherPlaceBox'}>
                                                        <span className={'weatherNum'}>23</span>
                                                        <div style={{ display: 'block' }}>
                                                            <span className={'weatherPlaceTitle'}>지중온도</span>
                                                            <span className={'weatherPlaceDate'}>(0.05m)</span>
                                                            <span className={'weatherPlaceTime'}>{temperature005m}℃</span>
                                                        </div>
                                                    </div>
                                                    <div className={'weatherPlaceBox'}>
                                                        <span className={'weatherNum'}>24</span>
                                                        <div style={{ display: 'block' }}>
                                                            <span className={'weatherPlaceTitle'}>지중온도</span>
                                                            <span className={'weatherPlaceDate'}>(0.1m)</span>
                                                            <span className={'weatherPlaceTime'}>{temperature01m}℃</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', marginTop: '14px' }}>
                                                    <div className={'weatherPlaceBox'}>
                                                        <span className={'weatherNum'}>25</span>
                                                        <div style={{ display: 'block' }}>
                                                            <span className={'weatherPlaceTitle'}>지중온도</span>
                                                            <span className={'weatherPlaceDate'}>(0.2m)</span>
                                                            <span className={'weatherPlaceTime'}>{temperature02m}℃</span>
                                                        </div>
                                                    </div>
                                                    <div className={'weatherPlaceBox'}>
                                                        <span className={'weatherNum'}>26</span>
                                                        <div style={{ display: 'block' }}>
                                                            <span className={'weatherPlaceTitle'}>지중온도</span>
                                                            <span className={'weatherPlaceDate'}>(0.3m)</span>
                                                            <span className={'weatherPlaceTime'}>{temperature03m}℃</span>
                                                        </div>
                                                    </div>
                                                    <div className={'weatherPlaceBox'}>
                                                        <span className={'weatherNum'}>27</span>
                                                        <div style={{ display: 'block' }}>
                                                            <span className={'weatherPlaceTitle'}>일강수량</span>
                                                            <span className={'weatherPlaceDate'}>{rainfallday}mm</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                </div>
                                            </div> {/* tab_contentData */}
                                        </div>
                                    }

                                    {
                                        checkedActionData &&
                                        <input id="cleanSYS" type="radio" name="tab_itemData" style={{ display: 'none' }} className={'tab-switchData cleanSYS'} />
                                    }
                                    {
                                        !checkedActionData &&
                                        <input id="cleanSYS" type="radio" name="tab_itemData" style={{ display: 'none' }} className={'tab-switchData cleanSYS'} />
                                    }
                                    <label className={'tab_itemData'} htmlFor="cleanSYS">CleanSYS</label>
                                    {
                                        // CleanSYS Data Layer
                                        csDatas
                                    }
                                </span> {/* tabsBoxData */}
                            </div> {/* tabsData */}
                         </div>
                     {/* </div> */}
                    </PopupDraggable>
                </DataInfoComponent>

                {
                    this.state.isOpenAirKorea &&
                    <AtmosphereCityPopup
                        onClickCloseDataPop={this.onClickCloseDataPop}
                        airDatas={this.state.airDatas}
                        airNodes={this.state.airNodes}>
                    </AtmosphereCityPopup>
                }

                {/* <AtmosphereCityPopup /> */}
                {/* <CleanSYSPopup /> */}
            </>
        );
    }


};

export default DataInfo;