import React, { Component, useState } from 'react';
import './../../css/popup.css';

import content from '../../../Common/css/content.module.css';
import sdmsStyle from '../../css/sdms.module.css';
import SDMS from '../sdms';
import SettingsStore from '../../../Settings/settingsStore';
import SDMSResource from '../../resource/id';
import PopupDraggable from './popupDraggable';
import $ from 'jquery';

import { VOCInfoPopupComponent } from './../../sdmsStyled';
import { SensorInfoBox, SensorDslTop, ContentPaddingBox } from './../../styled';
import { SensorTitleV, SensorDetailTitle, SensorTitleIcon, TitleTriIcon } from "../../styled";
import { SensorTitleC } from "../../styled";
import { ReferenceTime } from './../../styled';
import { SeosorCloseIcon } from "../../styled";
import { SensorNameA } from "../../styled";
import { DivideLine } from "../../styled";
import { SensorAddress } from "../../styled";
import { VOCselectBox } from "../../styled";
//import { GraphBody } from "../../styled";

import { Chart, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import { SDMSController } from '../../services/sdmsController';
import styled from 'styled-components';
import StatusInfo from './statusInfo';

const Label = styled.div`
    width: 230px;
    height: 19px;
    border: 1px solid #666666;
    background: url("./../../resource/image/sdms/searchIcon.png")no-repeat 95% 50%;
    border-radius: 12px;
    color: white;
    font-size: 11px;
    padding: 3px 0px 0px 7px;
`;

const SelectOptions = styled.ul`
    width: 230px;
    position: absolute;
    background: #1A1A1A;
    font-size: 11px;
    overflow: scroll;
    color: white;
    max-height: ${(props) => (props.show ? "300px" : "0")};
`;

const Option = styled.li`
    padding: 2px 5px;
    &:hover {
        background: #797e82;
        color: black;
    }
`;




class VOCInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            /* popupMinWidth: 350, */

            selectedSensor: this.props.selectedSensor,
            selectedAlarm: this.props.selectedAlarm,

            materials: [],
            materialType: 301, // default materialType
            materialName: '2,2-Dimethylbutane', // default materialName
            sensorName: null,
            sensorPosition: null,

            //isDanger: false,

            isShowDropdown: false,

            checkedMaterials: this.props.checkedMaterials,

        }

        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));

        this.tooltipColor = {
            bodyFontColor: null,
            titleFontColor: null,
            borderColor: null,
        }

        this.isSubscribed = true;
        this.isDanger = false;

        // 소수 비교 오차범위
        this.epsilon = 0.00000001;

    }

    static vocMaterials = {
        _2_2_Dimethylbutane: 301,
        _3_Methylpentane: 302,
        _1_Hexene: 303,
        n_Hexane: 304,
        Benzene: 305,
        Cyclohexane: 306,
        _2_Methylhexane: 307,
        _2_3_Dimethylpentane: 308,
        _3_Methylhexane: 309,
        _2_2_4_Trimethylpentane: 310,
        n_Heptane: 311,
        Methylcyclohexane: 312,
        _2_3_4_Trimethylpentane: 313,
        Toluene: 314,
        _2_Methylheptane: 315,
        _3_Methylheptane: 316,
        n_Octane: 317,
        Ethylbenzene: 318,
        m_p_Xylene: 319,
        Styrene: 320,
        o_Xylene: 321,
        n_Nonane: 322,
        i_Propylbenzene: 323,
        n_Propylbenzene: 324,
        m_Ethyltoluene: 325,
        p_Ethyltoluene: 326,
        _1_3_5_Trimethylbenzene: 327,
        o_Ethyltoluene: 328,
        _1_2_4_Trimethylbenzene: 329,
        n_Decane: 330,
        _1_2_3_Trimethylbenzene: 331,
        m_Diethylbenzene: 332,
        p_Diethylbenzene: 333,
        n_Undecane: 334,
        n_Dodecan: 335,
        Ethane: 336,
        Ethene: 337,
        Propane: 338,
        Propene: 339,
        i_Butane: 340,
        n_Butane: 341,
        Acetylene: 342,
        trans_2_Buten: 343,
        _1_Butene: 344,
        cis_2_Butene: 345,
        Cyclopentane: 346,
        i_Pentane: 347,
        n_Pentane: 348,
        Butadiene: 349,
        trans_2_Pentene: 350,
        _1_Pentene: 351,
        cis_2_Pentene: 352,
        _2_2_DimethylbutaneVOC: 353,
        Methylcyclopentane: 354,
        _2_3_Dimethylbutane: 355,
        _2_Methylpentane: 356,
        _3_MethylpentaneVOC: 357,
        n_HexaneVOC: 358,
        Isoprene: 359,
        _1_HexeneVOC: 360,
        _2_4_Dimethylpentane: 361,
    }

    componentDidMount() {
        if (this.state.checkedMaterials !== this.props.checkedMaterials) {
            this.setState({ checkedMaterials: this.props.checkedMaterials });
        }

        this.isFirstMaterial();
    }

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            var popup = document.getElementsByClassName(content.vocInfo)[0];
            this.state.popup.style.zIndex = this.props.zIndex;
        }

        if (this.props.selectedAlarm !== this.state.selectedAlarm) { // 알람 교체시
            if (this.props.selectedSensor !== prevProps.selectedSensor && this.props.selectedSensor.sensorType === StatusInfo.VocType) {
                this.setState({ materialType: this.props.selectedAlarm.materialType, materialName: this.props.selectedAlarm.materialTypeString, selectedSensor: this.props.selectedSensor, selectedAlarm: this.props.selectedAlarm, isShowDropdown: false });
            }
        }
        if (this.props.selectedAlarm !== null && this.props.selectedAlarm !== undefined) {

            if (this.props.selectedSensor.sensor.zoneID === this.props.selectedAlarm.zoneID) {

                if (this.props.selectedAlarm !== prevProps.selectedAlarm) {
                    let materialType = 301;
                    if (this.props.selectedAlarm !== null && this.props.selectedAlarm !== {}) {
                        materialType = this.props.selectedAlarm.materialType;
                    }
                    this.setState({ materialType: materialType, selectedSensor: this.props.selectedSensor, selectedAlarm: this.props.selectedAlarm });
                } else {
                    if (this.props.selectedSensor.sensor.position !== prevProps.selectedSensor.sensor.position && this.props.selectedSensor.sensorType === StatusInfo.VocType) {
                        if (this.props.selectedAlarm === prevProps.selectedAlarm) {
                            if (this.props.selectedSensor.sensor.position === this.props.selectedAlarm?.positionName) {
                                this.setState({ materialType: this.props.selectedAlarm.materialType, selectedSensor: this.props.selectedSensor, selectedAlarm: this.props.selectedAlarm, isShowDropdown: false });
                            } else {
                                this.setState({ materialType: 301, selectedSensor: this.props.selectedSensor, selectedAlarm: this.props.selectedAlarm, isShowDropdown: false });
                            }
                        } else {
                            this.setState({ materialType: this.props.selectedAlarm.materialType, selectedSensor: this.props.selectedSensor, selectedAlarm: this.props.selectedAlarm, isShowDropdown: false });
                        }
                    }
                }

                if (this.state.checkedMaterials !== this.props.checkedMaterials) {
                    this.setState({ checkedMaterials: this.props.checkedMaterials });
                }

                if (this.props.selectedAlarm !== prevProps.selectedAlarm) {
                    if (this.props.selectedAlarm) {
                        this.setState({ materialType: this.props.selectedAlarm.materialType });
                    }
                }
            }
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

    isFirstMaterial = () => {
        let checkedMaterials = this.state.checkedMaterials;
        let curSensor = this.state.selectedSensor;

        let curSensorZoneID = curSensor.sensor.zoneID;

        let vocs = checkedMaterials.vocs;

        let curMaterials = [];

        curMaterials = vocs[curSensorZoneID];

        let materialIDs = [];

        if (curMaterials === null || curMaterials === undefined)
            return;

        if (this.state.materialType !== curMaterials[0].materialType) {
            this.setState({ materialType: curMaterials[0].materialType });
        }

    }

    repositionPopup(popupState) {
        let data = popupState.vocInfo;

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

    resetPopupState = (popupState) => {
        let data = popupState;

        if (data.actionType === 'RESET_POPUP') {
            this.repositionPopup(data.popupState);
        }
    }


    //팝업 리사이즈 이벤트 리스너
    popupResizeMouseMove = (event) => {
        let sizeY = 0;

        switch (this.state.resizeType) {
            // 수직
            case 'v-b': // 바텀 수직
                sizeY = event.pageY - this.state.originalY;

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    //그리드 사이즈를 부모(팝업) 사이즈 비율대로 조절
                    const grid = this.findElementByClassName(content.viewDashboardMiniMap);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            case 'v-t': //탑 수직
                sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(content.viewDashboardMiniMap);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            // 대각
            case 'd-rb': // 오른쪽 하단 대각
                sizeY = event.pageY - this.state.originalY;

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(content.viewDashboardMiniMap);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            case 'd-rt': //오른쪽 상단 대각
                sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(content.viewDashboardMiniMap);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            case 'd-lb': //왼쪽 하단 대각
                sizeY = event.pageY - this.state.originalY;

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(content.viewDashboardMiniMap);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            case 'd-lt': //왼쪽 상단 대각
                sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(content.viewDashboardMiniMap);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            default:
        }

    }

    popupResizeMousePress = (event, resizeType) => {
        const popup = document.getElementById(this.props.popupType);

        this.setState({
            maxScreenHeight: document.getElementsByTagName('body')[0].clientHeight,
            maxScreenWidth: document.getElementsByTagName('body')[0].clientWidth,
            resizeType: resizeType,
            originalMouseX: event.pageX,
            originalMouseY: event.pageY,
            originalWidth: document.getElementById(this.props.popupType).clientWidth,
            originalHeight: document.getElementById(this.props.popupType).clientHeight,
            originalX: document.getElementById(this.props.popupType).getBoundingClientRect().left,
            originalY: document.getElementById(this.props.popupType).getBoundingClientRect().top,
        });
    }

    popupResizeMouseUp = () => {
        this.setState({ resizeType: null });
    }

    getMinute(hour, minute) {
        let rHour = null;
        let rMinute = null;

        let result = null;

        if (minute < 0) {
            if (minute === -30) {
                rHour = hour - 1;
                rMinute = 30;
            } else if (minute === -60) {
                rHour = hour - 1;
                rMinute = 0;
            } else if (minute === -90) {
                rHour = hour - 2;
                rMinute = 30;
            } else if (minute === -120) {
                rHour = hour - 2;
                rMinute = 0;
            } else if (minute === -150) {
                rHour = hour - 3;
                rMinute = 30;
            }
        } else {
            rHour = hour;
            rMinute = minute;
        }

        if (hour < 0) {
            rHour += 24;
        }

        if (rMinute === 0) {
            rMinute = "00";
        }

        result = rHour + ":" + rMinute;
        return result;
    }

    getVOCLineData(materialType, sensor) {
        let VOClineChartUI = [];

        const histories = this.props.dataHistories;

        let curSensor = sensor.sensor;

        let selectedSensorID = null;

        let sensorTypeName = null;

        if (sensor.sensorType !== StatusInfo.VocType) {
            return;
        }

        if (sensor && materialType) {
            for (let i = 0; i < curSensor.sensors.length; i++) {
                if (curSensor.sensors[i].sensorType === Number(materialType)) {
                    selectedSensorID = curSensor.sensors[i].id;
                    sensorTypeName = curSensor.sensors[i].sensorTypeName;
                    break;
                }
            }
        }

        let sensorHistories = [] // SensorID에 해당하는 History 분류

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
        let _minute = (minute - (minute % 30));

        let currentTime = null;

        if (_minute === 0) {
            currentTime = hour + ":0" + _minute.toString();
        }
        currentTime = this.getMinute(hour, _minute);
        let beforeTime1 = this.getMinute(hour, _minute - 30);
        let beforeTime2 = this.getMinute(hour, _minute - 60);
        let beforeTime3 = this.getMinute(hour, _minute - 90);
        let beforeTime4 = this.getMinute(hour, _minute - 120);
        let beforeTime5 = this.getMinute(hour, _minute - 150);

        const labels = [beforeTime5, beforeTime4, beforeTime3, beforeTime2, beforeTime1, currentTime];

        let dataSet = [];

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

        if (beforeData5) dataSet.push(beforeData5.sensorValue);
        if (beforeData4) dataSet.push(beforeData4.sensorValue);
        if (beforeData3) dataSet.push(beforeData3.sensorValue);
        if (beforeData2) dataSet.push(beforeData2.sensorValue);
        if (beforeData1) dataSet.push(beforeData1.sensorValue);
        if (currentData) dataSet.push(currentData.sensorValue);

        if (!dataSet || dataSet.length === 0) {
            dataSet = [0, 0, 0, 0, 0, 0];
        }

        const max = Math.max.apply(null, dataSet);
        const min = Math.min.apply(null, dataSet);

        const stepSize = max / 5;

        const options = this.getChartOptions(dataSet, stepSize, max); // 위험 , 정상에 따른 option 분기

        const data = (canvas) => {
            const ctx = canvas.getContext("2d");
            const gradient = ctx.createLinearGradient(0, 0, 0, 200);

            let borderColor = null;

            if (this.isDanger) {
                borderColor = '#D4282F';

                gradient.addColorStop(0, 'rgba(192,0,0,1)');
                gradient.addColorStop(1, 'rgba(192,0,0,0)');
            } else {
                borderColor = '#19A5FF';

                gradient.addColorStop(0, 'rgba(25,165,255,1)');
                gradient.addColorStop(1, 'rgba(25,165,255,0)');

            }

            return {
                labels,
                datasets: [
                    {
                        label: sensorTypeName,
                        data: dataSet,
                        borderColor: borderColor,
                        /* backgroundColor: '#c0000085', */ /* 그라데이션 추후  */
                        backgroundColor: gradient,
                        fill: true,
                        borderWidth: 1,
                        pointBorderColor: '#fff',
                        fontFamily: 'Pretendard',
                        fontSize: '11px',
                    },
                ],
            }
        };
        VOClineChartUI.push(<Line options={options} data={data} id="myChart" />)
        return [VOClineChartUI];
    }

    getDanger(value) { // 위험도 분기처리 함수

        // 오염도 전달 받으면 작업 예정

        let isDanger = false;

        let curSensorZone = this.state.materialType;

        const vocStandards = SDMSResource.thresholds;
        let materialThreshold = null;

        if (vocStandards[curSensorZone] !== null && vocStandards[curSensorZone] !== undefined) {
            materialThreshold = vocStandards[curSensorZone];
        }

        let warning = materialThreshold[2]; // 경계
        let serious = materialThreshold[3]; // 심각

        // 위험도 판별은 경계단계만 넘어가면 알람이 발생하기 때문에 심각에 대한 처리는 따로 하지 않는다.
        if (Math.round(parseFloat(warning) * 100) / 100 < Math.round(parseFloat(value) * 100) / 100) {
            isDanger = true;
        }

        return isDanger;
    }

    getStandard = (value) => {
        const isDanger = this.getDanger(value);
        // Graph Text Color
        if (isDanger) {
            this.tooltipColor.bodyFontColor = '#D4282F';
            this.tooltipColor.borderColor = '#D4282F';
            this.tooltipColor.titleFontColor = '#D4282F';
            this.isDanger = true;
        } else {
            this.tooltipColor.bodyFontColor = '#19A5FF';
            this.tooltipColor.borderColor = '#19A5FF';
            this.tooltipColor.titleFontColor = '#19A5FF';
            this.isDanger = false;
        }
    }


    makeStandard = (tooltipItem, data) => {
        const label = data.datasets[tooltipItem.datasetIndex].label || '';
        const value = tooltipItem.yLabel;

        this.getStandard(value);

        let text = null;

        if (this.isDanger) {
            text = '나쁨';
        } else {
            text = '좋음';
        }

        return [text, value];
    }

    getChartOptions(dataSet, stepSize, max) {

        const curMaterial = this.state.materialType;

        let options = null;
        // 초기에 텍스트 색상 불러오지 못해서 초기화 해줌
        if (this.tooltipColor.bodyFontColor === null || this.tooltipColor.borderColor) {
            let standardValue = parseFloat(dataSet[5]);
            let polititionNum = 0.02;

            if (Math.round(parseFloat(polititionNum) * 100) / 100 < Math.round(parseFloat(standardValue) * 100) / 100) {
                this.tooltipColor.bodyFontColor = '#D4282F';
                this.tooltipColor.borderColor = '#D4282F';
                this.tooltipColor.titleFontColor = '#D4282F';
                this.isDanger = true;
            } else {
                this.tooltipColor.bodyFontColor = '#19A5FF';
                this.tooltipColor.borderColor = '#19A5FF';
                this.tooltipColor.titleFontColor = '#19A5FF';
                this.isDanger = false;
            }
        }


        options = {
            responsive: true, /* false로 해야 크기 지정 가능 */

            tooltips: {
                mode: 'nearest',
                intersect: false,

                backgroundColor: 'white',
                bodyFontColor: this.tooltipColor.bodyFontColor,
                titleFontColor: this.tooltipColor.titleFontColor,

                borderColor: this.tooltipColor.borderColor,
                borderWidth: '1',

                displayColors: false,
                titleAlign: 'center',
                bodyAlign: 'center',

                yAlign: 'bottom',

                callbacks: {
                    // title 부분에서 data의 label이 아닌 데이터 조작이 불가능 //
                    title: function (tooltipItems, data) {
                        let result = '';
                        return result;
                    },
                    // label에서 필요한 텍스트 표출
                    label: this.makeStandard,
                } // callBacks end 

            },
            hover: {
                mode: 'nearest',
                intersect: false,
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
                    ticks: {
                        beginAtZero: true,
                        stepSize: stepSize,
                        fontSize: 11,
                        suggestedMax: max + stepSize,
                        suggestedMin: 0,
                    },
                    gridLines: {
                        color: "#666666",
                    },
                }],
            },
        };

        return options;
    }

    makeBeforeData(datas, date) {

        let targetTime = date.split(':');
        let targetHour = targetTime[0];
        let targetMinute = targetTime[1];

        if (targetHour < 10) {
            targetHour = '0' + targetHour;
        }

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

    getOptions() {
        const material = this.props.materials;

        let _materials = [];
        let materials = []; // VOC Materials
        if (material) {
            _materials = material[0];
            for (let i = 0; i < _materials.length; i++) {
                if (_materials[i].id > 300) {
                    materials.push(_materials[i]);
                }
            }
        }
        const options = this.makeOptions(materials);

        return options;
    }

    onClickMaterials = () => {

        this.setState({ isShowDropdown: !this.state.isShowDropdown });

    }
    onClickMaterial = (materialID, materialName) => {

        this.setState({ materialType: materialID, materialName: materialName, isShowDropdown: !this.state.isShowDropdown });

    }

    onChangeCheckBox = (event, materialID) => {

        let curSensor = this.state.selectedSensor.sensor;

        this.props.onChangeCheckedMaterials(event, materialID, curSensor);

    }

    makeOptions(materials) {

        let options = [];
        let curSensor = null;
        let curMaterials = null;
        let checkedMaterials = null;
        let curZoneID = null;

        if (this.state.checkedMaterials) {
            checkedMaterials = this.state.checkedMaterials.vocs;
        }

        if (this.state.selectedSensor) {
            curSensor = this.state.selectedSensor.sensor;
            curZoneID = this.state.selectedSensor.sensor.zoneID;
        }

        if (checkedMaterials[curZoneID]) {
            curMaterials = checkedMaterials[curZoneID];
        }

        let option = null;

        for (let i = 0; i < materials.length; i++) {

            let checked = false;

            if (curMaterials) {
                for (let j = 0; j < curMaterials.length; j++) {
                    if (curMaterials[j].materialType === materials[i].id) {
                        checked = true;
                        break;
                    }
                }
            }

            let sensorName = materials[i].materialName;

            if (this.state.materialType === materials[i].id) {

                option = <Option><input type="checkbox" style={{ width: '10px', height: '10px', marginRight: '4px', border: '' }} checked={checked} onChange={(e) => this.onChangeCheckBox(e, materials[i].id)} /><span onClick={() => this.onClickMaterial(materials[i].id, sensorName)}>{materials[i].materialName}</span></Option>

                options.push(option);
            } else {
                option = <Option><input type="checkbox" style={{ width: '10px', height: '10px', marginRight: '4px', border: '' }} checked={checked} onChange={(e) => this.onChangeCheckBox(e, materials[i].id)} /><span onClick={() => this.onClickMaterial(materials[i].id, sensorName)}>{materials[i].materialName}</span></Option>
                options.push(option);
            }
        }

        return options;
    }

    setSelectedValue(event) {
        this.setState({ materialType: event.target.value });
    }

    getVOCLineDataChart = () => {

        let VOClineChartUI = [];
        let materialType = this.state.materialType;

        if (this.isSubscribed) {
            if (this.props.selectedSensor.sensorType === StatusInfo.VocType) {
                return [VOClineChartUI] = this.getVOCLineData(materialType, this.props.selectedSensor);
            } else {
                return [VOClineChartUI];
            }
        } else {
            return [VOClineChartUI];
        }
    }

    getSensorName = () => {
        let sensorName, sensorPosition = '';

        if (!this.props.selectedSensor) {
            return [sensorName, sensorPosition];
        }

        sensorName = this.props.selectedSensor.sensor.position;
        sensorPosition = this.props.selectedSensor.sensor.address;

        return [sensorName, sensorPosition];
    }

    getMaterialName = () => {
        let materialName, materialType = null;

        if (!this.state.materialType) {
            materialType = 301;
        } else {
            materialType = this.state.materialType;
        }

        materialName = this.materialName;

        return [materialName, materialType];
    }

    render() {

        let [VOClineChartUI] = this.getVOCLineDataChart();

        const [materialName, materialType] = [this.state.materialName, this.state.materialType];

        const options = this.getOptions();

        const [sensorName, sensorPosition] = this.getSensorName();

        return (
            <>
                <VOCInfoPopupComponent id={this.props.popupType} className={content.vocInfo + " " + SDMSResource.UISection}>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={531}
                        popupMinHeight={410}
                        topSize={35}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                    >
                        {/* VOC 팝업창 */}
                        {/* <SensorInfoBox> */}
                        {/* <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}> */}
                        <div className={'SensorDslTop'}>
                            <span className={'sensorTitleIcon'}></span>
                            <span className={'sensorDetailTitle'}>센서 상세정보</span>
                            <span className={'seosorCloseIcon'} onClick={() => this.props.setVisiblePopups(SDMS.menu.vocInfo, false)}></span>
                        </div>
                        {/* </div> */}
                        <div className={'contentPaddingBox'}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', paddingTop: '20px' }}>
                                <span className={'sensorTitleV'}>VOC 분석시스템</span>
                                <div className={'VOCselectBox'}>
                                    {/*<select name="VOC" onChange={(event) => this.setSelectedValue(event)} value={this.state.materialType}>*/}
                                    {/*    {options}*/}
                                    {/*</select>*/}
                                    <span className={'label'} onClick={() => this.onClickMaterials()}>
                                        {materialName}
                                    </span>
                                    <span className={'selectOptions'} show={this.state.isShowDropdown}>
                                        {options}
                                    </span>
                                </div>
                            </div>
                            <span style={{ display: 'block', width: '100%', height: '1px', border: 'dashed 1px #707070', marginBottom: '6px' }}></span>
                            <div style={{ marginBottom: '40px' }}>
                                <span className={'sensorNameA'}>{sensorName}</span>
                                <span className={'divideLine'}></span>
                                <span className={'sensorAddress'}>{sensorPosition}</span>
                            </div>

                            <div>
                                {/*{(VOClineChartUI !== undefined && VOClineChartUI !== null) ? VOClineChartUI : <></>}*/}
                                {VOClineChartUI}
                            </div>
                            {/* </SensorInfoBox> */}
                        </div>
                    </PopupDraggable>
                </VOCInfoPopupComponent>
            </>
        );
    }


}
export default VOCInfo;