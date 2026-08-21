import React, { Component } from 'react';
import SDMS from '../sdms';
import SDMSResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';
import PopupDraggable from './popupDraggable';
import { DashboardPopComponent } from '../../styled/sdmsPopupsStyled';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';
import imgClose from '../../../Common/img/imghydrogen/common/closeX_icon.svg';
import $ from 'jquery';
import { Doughnut } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import eventArrowTop from '../../../Common/img/imghydrogen/dashboard/eventArrowTop.svg';
import eventArrowBottom from '../../../Common/img/imghydrogen/dashboard/eventArrowBottom.svg';
import eventArrowBar from '../../../Common/img/imghydrogen/dashboard/eventArrowBar.svg';

import { SDMSController } from '../../services/sdmsController';
import { DashboardController } from '../../../Dashboard/services/dashboardController';

import ChartDataLabels from "chartjs-plugin-datalabels";

import SettingsStore from '../../../Settings/settingsStore';

class DashboardPop extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dashPopHeight: '',
            weeklyAlarms: [],
            sensorCount: null,
        }

        this.props = props;
        this.refScrollArea = React.createRef();
        this.refScrollbar = React.createRef();
        this.refTree = React.createRef();

        this.init();

        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));
    }

    async init() {
        let weeklyAlarms = [];
        let sensorCount = null;

        // 1주일 알람 정보 가져오기
        const [weeklyAlarmData, message] = await DashboardController.requestWeeklyStatus();
        if (weeklyAlarmData)
            weeklyAlarms = weeklyAlarmData;

        const [sensorCountData, message2] = await SDMSController.requestSensorCount();
        if (sensorCountData !== null && sensorCountData !== undefined) {
            sensorCount = sensorCountData;
        }
        
        this.setState({ weeklyAlarms, sensorCount });
    }

    componentDidMount() {
        // 창이 서서히 나타나는 효과
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

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex
        }

        //this.setScrollbar();
    }

    resetPopupState = (popupState) => {
        let data = popupState;

        if (data.actionType === 'RESET_POPUP') {
            this.repositionPopup(data.popupState);
        }
    }

    repositionPopup(popupState) {
        let data = popupState.dashboardPop;

        if (data === null || data === undefined)
            return;

        //let popup = document.getElementsByClassName(content.viewDashboardBoxD + " " + content.viewDashboardSection)[0];
        let popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return;

        //popup.style.marginLeft = '0px';

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
    }

    getDoughnutUI = (doughnutData) => {
        let doughnutUI = [];
        //let labels = ['Conductivity', 'Flow', 'Gas', 'Hydrogen', 'Pressure', 'Temperature'];
        let values = [];
        let labels = [];
        let isZero = false;     // 데이터 없음 여부 확인

        for (let data of doughnutData) {
            labels.push(data?.name);

            if (data?.count > 0)
                values.push(data.count);
        }

        if (values.length === 0) {
            values.push(1);
            isZero = true;
        }

        const options = {
            responsive: false,
            aspectRatio: 1,
            cutoutPercentage: 78, 
            legend: {
                display: false,
                position: 'right',
                labels: {
                    usePointStyle: false,         
                    boxWidth: 11,
                    boxHeight: 12,                 
                    padding: (0, 8),              
                    fontSize: 12,
                    fontColor: '#d7d7d7',
                    fontDisableColor: '#000000',
                    fontFamily: 'Pretendard',
                },
            }, 
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                }
            },
            plugins: {
                datalabels: {
                    formatter: function (value) {
                        if (value == 0 || isZero === true) return "";
                        else return value + i18n.t('sdms.dashboard.건');
                    },
                    display: true,
                    //color: "#0085FF",
                    color: ['#0085FF', '#3BDCFF', '#62FFEC', '#B0FFF6', '#B0D9FF', '#89A2FF', '#9389FF', '#B789FF'],
                    anchor: "end",
                    align: "start",
                    font: {
                        family: "Pretendard",
                        size: "12",
                        weight: "bold",
                    },
                    padding: function (value) {
                        if (value) return { top: 14, bottom: 14, left: 14, right: 14 };
                        const padding = (Math.log(value) * Math.LOG10E + 1 | 0) * 4
                        return {
                            top: padding,
                            bottom: padding - 2,
                            left: 20,
                            right: 20,
                        }
                    },
                },
            },
            hover: {
                mode: null
            },
            animation: {
                duration: 0
            },
            tooltips: {
                enabled: false,
            },
        };
        
        const data = () => {

            return {
                labels: labels,
                datasets: [
                    {
                        type: 'doughnut',
                        label: '이벤트 발생',
                        data: values,
                        backgroundColor: (isZero === true ? ['#343846'] : ['#0085FF', '#3BDCFF', '#62FFEC', '#B0FFF6', '#B0D9FF', '#89A2FF']),
                        borderWidth: 1,
                        borderColor: '#000000',
                        color: '#fff',
                        fontFamily: 'Spoqa Han Sans Neo',
                        fontSize: '11px',
                    },
                ],
            }
        };

        doughnutUI.push(
            <Doughnut 
                /* key={"doughnutChart"} */
                key={doughnutData?.labels?.length}
                id={"myChart"}
                options={options} 
                data={data}
                width={140}
                height={140}
                plugins={[ChartDataLabels]}
            />);

        return [doughnutUI];
    }

    getLineChartUI = (labels, values) => {
        let lineChartUI = [];

        let maxSize = 0;
        for (let value of values) {
            if (value > maxSize)
                maxSize = value;
        }

        maxSize = Math.floor(maxSize / 10);
        maxSize = (maxSize + 1) * 10;

        let step = maxSize / 5;

        const options = {
            responsive: false,
            aspectRatio: 1,
            cutoutPercentage: 75, 
            scales: {
                xAxes: [{
                    ticks: {
                        fontSize: 12,
                        fontColor: "#939393",
                        fontFamily: "Spoqa Han Sans Neo",
                    }
                }],
                yAxes: [{
                    gridLines: {
                        display: true,
                        color: "rgba(255, 255, 255, 0.15)",
                        zeroLineColor: 'rgba(255, 255, 255, 0.15)',
                        borderDash: [3, 2],
                    },
                    ticks: {
                        min: 0,                 // 수치 최소값
                        max: maxSize,           // 수치 최대값
                        stepSize: step,         // 열 스탭 사이즈
                        fontSize: 12,
                        fontColor: "#939393",
                        fontFamily: "Spoqa Han Sans Neo",
                    },
                    position: 'left'
                }],
            },
            legend: {
                display: false,
                position: 'right',
                labels: {
                    //usePointStyle: true,       // 지정된 포인트 모양에 따라 범례 아이콘 생성
                    boxWidth: 8,
                    boxHeight: 2,
                    /* padding: (2, 8), */       // 범례들 사이의 간격
                    paddingLeft: '20px',
                    /* boxColor: "#0085FF", */
                    fontColor: '#fff',
                    fontFamily: 'Spoqa Han Sans Neo',
                }
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                },
            },
            tooltips: {
                callbacks: {
                    title: function() {
                        return null;
                    },
                    label: (context) => {
                        return `${context.value + i18n.t('sdms.dashboard.건')}`;
                    },
                },
                enabled: true,
                position: 'average',
                backgroundColor: '#fff',
                bodyFontColor: '#000000',
                bodyFontFamily: 'Spoqa Han Sans Neo',
                titleFontColor: '#000000',
                titleFontFamily: 'Spoqa Han Sans Neo',
                displayColors: false,
                cornerRadius: 3,
                padding: 5,  /* 적용안됨 */
            },
            hover: {
                mode: 'index',
            },
            animation: {
                duration: 0
            },
        };
        
        const data = (canvas) => {
            const ctx = canvas.getContext("2d");
            //const ctx = document.getElementById('lineChart').getContext('2d');

            const gradient = ctx.createLinearGradient(0, 0, 0, 50); //시작점 x, 시작점 y, 끝점 x, 끝점 y

            gradient.addColorStop(0, 'rgba(251, 68, 80, 0.50)');
            gradient.addColorStop(1, 'rgba(255,54,50,0.1)');

            /* const gradientStroke = ctx.createLinearGradient(255, 200, 255, 1);
            gradientStroke.addColorStop(0, 'rgba(251, 68, 80, 0.50)');
            gradientStroke.addColorStop(1, 'rgba(255,54,50,0.1)'); */

            return {
                labels: labels, // 가로 행 컬럼 값
                datasets: [
                    {
                        type: 'line',
                        label: '주간 이벤트 정보',
                        data: values,
                        /* data: [10, 70, 100, 30, 15, 20, 16], */
                        fontFamily: 'Spoqa Han Sans Neo',
                        fontSize: '11px',
                        backgroundColor: gradient,
                        borderColor: 'rgba(255, 54, 50, 1)',
                        pointBackgroundColor: 'rgba(255, 255, 255, 0)',
                        pointBorderColor: 'rgba(255, 255, 255, 0)',
                        hoverBackgroundColor: gradient,
                        hoverBorderColor: 'rgba(255, 54, 50, 1)',
                        pointHoverBackgroundColor: 'rgba(255, 54, 50, 1)',
                        pointHoverBorderColor: 'rgba(255, 255, 255, 1)', 
                        pointHoverBorderWidth: 1,
                        borderWidth: 1,
                        pointRadius: 5,
                        pointHoverRadius: 3,
                    },
                ],
            }
        };

        lineChartUI.push(
            <Line
                key={"lineChart"}
                options={options}
                data={data}
                width={269}
                /* height={110} */
                height={130}
            />
        );


        return [lineChartUI];
    }

    getData = () => {
        const arrDayStr = ['일', '월', '화', '수', '목', '금', '토'];

        const todayAlarms = this.props.sensorAlarms;
        const weeklyAlarms = this.state.weeklyAlarms;

        let labels = ['-', '-', '-', '-', '-', '-', '-'];
        let values = [0, 0, 0, 0, 0, 0, 0];

        const mode = this.state.mode;
        const type = this.state.type;

        let nToday = 0;
        let nOne = 0;
        let nTwo = 0;
        let nThree = 0;
        let nFour = 0;
        let nFive = 0;
        let nSix = 0;

        // 오늘 알람 갯수
        nToday = (todayAlarms?.length > 0 ? todayAlarms.length : 0);        

        const dtToday = new Date();
        let dtOne = new Date();
        let dtTwo = new Date();
        let dtThree = new Date();
        let dtFour = new Date();
        let dtFive = new Date();
        let dtSix = new Date();

        let strToday, strOne, strTwo, strThree, strFour, strFive, strSix;

        let dt = new Date();

        
        dtOne.setDate(dtToday.getDate() - 1);
        dtTwo.setDate(dtToday.getDate() - 2);
        dtThree.setDate(dtToday.getDate() - 3);
        dtFour.setDate(dtToday.getDate() - 4);
        dtFive.setDate(dtToday.getDate() - 5);
        dtSix.setDate(dtToday.getDate() - 6);

        strToday = (dt.getMonth() + 1) + "/" + dt.getDate();
        dt.setDate(dt.getDate() - 1);
        strOne = (dt.getMonth() + 1) + "/" + dt.getDate();
        dt.setDate(dt.getDate() - 1);
        strTwo = (dt.getMonth() + 1) + "/" + dt.getDate();
        dt.setDate(dt.getDate() - 1);
        strThree = (dt.getMonth() + 1) + "/" + dt.getDate();
        dt.setDate(dt.getDate() - 1);
        strFour = (dt.getMonth() + 1) + "/" + dt.getDate();
        dt.setDate(dt.getDate() - 1);
        strFive = (dt.getMonth() + 1) + "/" + dt.getDate();
        dt.setDate(dt.getDate() - 1);
        strSix = (dt.getMonth() + 1) + "/" + dt.getDate();

        for (let i = 0; i < weeklyAlarms?.length; i++) {
            const alarm = weeklyAlarms[i];
            const date = new Date(alarm.time);

            if (date?.getDate() === dtOne?.getDate()) {
                nOne++;
            } else if (date?.getDate() === dtTwo?.getDate()) {
                nTwo++;
            } else if (date?.getDate() === dtThree?.getDate()) {
                nThree++;
            } else if (date?.getDate() === dtFour?.getDate()) {
                nFour++;
            } else if (date?.getDate() === dtFive?.getDate()) {
                nFive++;
            } else if (date?.getDate() === dtSix?.getDate()) {
                nSix++;
            }
        }

        labels = [strSix, strFive, strFour, strThree, strTwo, strOne, strToday];
        values = [nSix, nFive, nFour, nThree, nTwo, nOne, nToday];

        return [labels, values];
    }

    getDoughnutData = () => {
        let doughnutData = [];
        const sensorAlarms = this.props.sensorAlarms;

        let pressureCount = 0;
        let tempCount = 0;
        let h2Count = 0;
        let h2lowCount = 0;
        let o2Count = 0;
        let flowCount = 0;
        let legendColor = 0;

        let h2GasCount = 0;
        let o2GasCount = 0;

        // let conductivityCount = 0;
        // let gasCount = 0;

        if (sensorAlarms?.length > 0) {
            for (let i = 0; i < sensorAlarms.length; i++) {
                let alarm = sensorAlarms[i];
                let facilityType = alarm.facilityType;

                if (SDMSResource.isPressureSensorType(facilityType)) {
                    pressureCount++;
                }
                else if (SDMSResource.isTempSensorType(facilityType)) {
                    tempCount++;
                }
                else if (SDMSResource.isH2SensorType(facilityType)) {
                    h2Count++;
                }
                else if (SDMSResource.isFlowSensorType(facilityType)) {
                    flowCount++;
                }

                else if (SDMSResource.isH2LowSensorType(facilityType)) {
                    h2lowCount++;
                }
                else if (SDMSResource.isO2SensorType(facilityType)) {
                    o2Count++;
                }

                else if (SDMSResource.isH2GasSensorType(facilityType)) {
                    h2GasCount++;
                }
                else if (SDMSResource.isO2GasSensorType(facilityType)) {
                    o2GasCount++;
                }

                // else if (SDMSResource.isConductivitySensorType(facilityType)) {
                //     conductivityCount++;
                // }
                // else if (SDMSResource.isGASSensorType(facilityType)) {
                //     gasCount++;
                // }
            }
        }

        doughnutData.push({ facilityType: SDMSResource.facilityType.Flow, name: i18n.t('facilityType.유량'), count: flowCount, color: legendColor });
        doughnutData.push({ facilityType: SDMSResource.facilityType.H2, name: i18n.t('facilityType.고농도수소'), count: h2Count, color: legendColor });
        doughnutData.push({ facilityType: SDMSResource.facilityType.H2Low_Senko, name: i18n.t('facilityType.저농도수소'), count: h2lowCount, color: legendColor });
        doughnutData.push({ facilityType: SDMSResource.facilityType.O2_Senko, name: i18n.t('facilityType.산소'), count: o2Count, color: legendColor });
        doughnutData.push({ facilityType: SDMSResource.facilityType.PRESSURE_SENSOR, name: i18n.t('facilityType.압력'), count: pressureCount, color: legendColor });
        doughnutData.push({ facilityType: SDMSResource.facilityType.Temp, name: i18n.t('facilityType.온도'), count: tempCount, color: legendColor });
        doughnutData.push({ facilityType: SDMSResource.facilityType.O2JAG, name: i18n.t('facilityType.수소가스'), count: h2GasCount, color: legendColor });
        doughnutData.push({ facilityType: SDMSResource.facilityType.H2JAG, name: i18n.t('facilityType.산소가스'), count: o2GasCount, color: legendColor });
        // doughnutData.push({ facilityType: SDMSResource.facilityType.Conductivity, name: i18n.t('facilityType.전도도'), count: conductivityCount, color: legendColor });
        // doughnutData.push({ facilityType: SDMSResource.facilityType.GAS, name: i18n.t('facilityType.가스'), count: gasCount, color: legendColor });

        doughnutData = doughnutData.sort((x, y) => y.count - x.count);


        if (doughnutData[0].count) {
            doughnutData[0].color = '#0085FF';
        }
        if (doughnutData[1].count) {
            doughnutData[1].color = '#3BDCFF';
        }
        if (doughnutData[2].count) {
            doughnutData[2].color = '#62FFEC';
        }
        if (doughnutData[3].count) {
            doughnutData[3].color = '#B0FFF6';
        }
        if (doughnutData[4].count) {
            doughnutData[4].color = '#B0D9FF';
        }
        if (doughnutData[5].count) {
            doughnutData[5].color = '#89A2FF';
        }
        if (doughnutData[6].count) {
            doughnutData[6].color = '#9389FF';
        }
        if (doughnutData[7].count) {
            doughnutData[7].color = '#B789FF';
        }
            

        return doughnutData;
    }

    getAlarmMessage = (values) => {
        let alarmCnt = 0;
        let alarmMessage = i18n.t('sdms.dashboard.전일과 총 이벤트 건 수가 동일합니다');
        let eventArrow = eventArrowBar;

        if (values[6] > values[5]) {
            alarmMessage = i18n.t('sdms.dashboard.전일대비 총 이벤트 건 수가 상승했습니다');
            alarmCnt = values[6] - values[5];
            eventArrow = eventArrowTop;
        }
        else if (values[6] < values[5]) {
            alarmMessage = i18n.t('sdms.dashboard.전일대비 총 이벤트 건 수가 하락했습니다');
            alarmCnt = values[5] - values[6];
            eventArrow = eventArrowBottom;
        }

        return [alarmCnt, alarmMessage, eventArrow];
    }

    doughnutLegendUI = (doughnutData) => {

        let legendUI = [];
        let legendColor = 0;

        const sortedDoughnutNums = doughnutData.sort();

        for (let i = 0; i < sortedDoughnutNums.length; i++) {
            if (sortedDoughnutNums[0].color) {
                legendColor = '#0085FF';
            }
            else if (sortedDoughnutNums[1].color) {
                legendColor = '#3BDCFF';
            }
            else if (sortedDoughnutNums[2].color) {
                legendColor = '#62FFEC';
            }
            else if (sortedDoughnutNums[3].color) {
                legendColor = '#B0FFF6';
            }
            else if (sortedDoughnutNums[4].color) {
                legendColor = '#B0D9FF';
            }
            else if (sortedDoughnutNums[5].color) {
                legendColor = '#89A2FF';
            }
            else if (sortedDoughnutNums[6].color) {
                legendColor = '#9389FF';
            }
            else if (sortedDoughnutNums[7].color) {
                legendColor = '#B789FF';
            }

            if (sortedDoughnutNums[i].count > 0) {
                legendUI.push(
                    <li className={'legendActLi'}><span className={'blueBox'} style={{ background: sortedDoughnutNums[i].color }}>{/* {sortedDoughnutNums[i].color} */}</span>{sortedDoughnutNums[i].name}</li>
                );
            } else {
                legendUI.push(
                    <li className={'legendDisableLi'}><span className={'disableBox'}></span>{sortedDoughnutNums[i].name}</li>
                );
            }
        }

        return [legendUI];
    }

    render() {
        const [labels, values] = this.getData();
        const doughnutData = this.getDoughnutData();
        const [legendUI] = this.doughnutLegendUI(doughnutData);

        const [doughnutUI] = this.getDoughnutUI(doughnutData);
        const [lineChartUI] = this.getLineChartUI(labels, values);

        const [alarmCnt, alarmMessage, eventArrow] = this.getAlarmMessage(values);

        return(
            <>
                <DashboardPopComponent id={this.props.popupType} className={'viewDashboardBoxD'} /* $dashPopHeight={dashPopHeight} */>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={321}
                        popupMinHeight={340}   /* 340 */
                        topSize={40}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                    > 
                        <div className={'viewDashPopTitle'}>
                            <span>{i18n.t('sdms.dashboard.대시보드')}</span>
                            <span className={'colseX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.dashboardPop, false)}><a><img src={imgClose} alt={i18n.t('common.닫기')} /></a></span>
                        </div>

                        <div className={'viewDashboardSection'}>
                            <div className={'weeklyChart'}>
                                <div><span>{alarmCnt}</span><img src={eventArrow} alt="이벤트 화살표"/></div>
                                <div>{alarmMessage}</div>
                                    {/* {chartList} */}
                                    <div className={'chartBox'}>
                                        {doughnutUI}
                                        <ul className={'legendUI'}>
                                            {legendUI}
                                        </ul>
                                    </div>
                            </div>
                            <div className={'weeklyEventInfo'}>
                                <span>{i18n.t('sdms.dashboard.주간 이벤트정보')}</span>
                                <div className={'lineChartBox'}>
                                    {lineChartUI}
                                </div>
                            </div>
                            <div className={'sensorEventArea'}>
                                <div>
                                    <div className={'flow'}>
                                        <div>{i18n.t('facilityType.유량')}</div>
                                        <div>
                                            <span>{i18n.t('sdms.dashboard.연결 상태')} : {(this.state.sensorCount?.flowSensorCount > 0 ? this.state.sensorCount?.flowSensorCount : 0) - (this.state.sensorCount?.disabledFlowSensorCount > 0 ? this.state.sensorCount?.disabledFlowSensorCount : 0)}/{(this.state.sensorCount?.flowSensorCount > 0 ? this.state.sensorCount?.flowSensorCount : 0)}</span>
                                            <span>{i18n.t('sdms.dashboard.이벤트')} : {doughnutData.find(x => x.facilityType === SDMSResource.facilityType.Flow)?.count} {i18n.language === "ko" ? i18n.t('sdms.dashboard.건') : ""}</span>
                                        </div>
                                    </div>
                                    <div className={'hydrogen'}>
                                        <div>{i18n.t('facilityType.고농도수소')}</div>
                                        <div>
                                            <span>{i18n.t('sdms.dashboard.연결 상태')} : {(this.state.sensorCount?.h2SensorCount > 0 ? this.state.sensorCount?.h2SensorCount : 0) - (this.state.sensorCount?.disabledH2SensorCount > 0 ? this.state.sensorCount?.disabledH2SensorCount : 0)}/{(this.state.sensorCount?.h2SensorCount > 0 ? this.state.sensorCount?.h2SensorCount : 0)}</span>
                                            <span>{i18n.t('sdms.dashboard.이벤트')} : {doughnutData.find(x => x.facilityType === SDMSResource.facilityType.H2)?.count} {i18n.language === "ko" ? i18n.t('sdms.dashboard.건') : ""}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className={'hydrogen'}>
                                        <div>{i18n.t('facilityType.저농도수소')}</div>
                                        <div>
                                            <span>{i18n.t('sdms.dashboard.연결 상태')} : {(this.state.sensorCount?.h2LowSensorCount > 0 ? this.state.sensorCount?.h2LowSensorCount : 0) - (this.state.sensorCount?.disabledH2LowSensorCount > 0 ? this.state.sensorCount?.disabledH2LowSensorCount : 0)}/{(this.state.sensorCount?.h2LowSensorCount > 0 ? this.state.sensorCount?.h2LowSensorCount : 0)}</span>
                                            <span>{i18n.t('sdms.dashboard.이벤트')} : {doughnutData.find(x => x.facilityType === SDMSResource.facilityType.H2Low_Senko)?.count} {i18n.language === "ko" ? i18n.t('sdms.dashboard.건') : ""}</span>
                                        </div>
                                    </div>
                                    <div className={'hydrogen'}>
                                        <div>{i18n.t('facilityType.산소')}</div>
                                        <div>
                                            <span>{i18n.t('sdms.dashboard.연결 상태')} : {(this.state.sensorCount?.o2SensorCount > 0 ? this.state.sensorCount?.o2SensorCount : 0) - (this.state.sensorCount?.disabledO2SensorCount > 0 ? this.state.sensorCount?.disabledO2SensorCount : 0)}/{(this.state.sensorCount?.o2SensorCount > 0 ? this.state.sensorCount?.o2SensorCount : 0)}</span>
                                            <span>{i18n.t('sdms.dashboard.이벤트')} : {doughnutData.find(x => x.facilityType === SDMSResource.facilityType.O2_Senko)?.count} {i18n.language === "ko" ? i18n.t('sdms.dashboard.건') : ""}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className={'pressure'}>
                                        <div>{i18n.t('facilityType.압력')}</div>
                                        <div>
                                            <span>{i18n.t('sdms.dashboard.연결 상태')} : {(this.state.sensorCount?.pressureSensorCount > 0 ? this.state.sensorCount?.pressureSensorCount : 0) - (this.state.sensorCount?.disabledPressureSensorCount > 0 ? this.state.sensorCount?.disabledPressureSensorCount : 0)}/{(this.state.sensorCount?.pressureSensorCount > 0 ? this.state.sensorCount?.pressureSensorCount : 0)}</span>
                                            <span>{i18n.t('sdms.dashboard.이벤트')} : {doughnutData.find(x => x.facilityType === SDMSResource.facilityType.PRESSURE_SENSOR)?.count} {i18n.language === "ko" ? i18n.t('sdms.dashboard.건') : ""}</span>
                                        </div>
                                    </div>
                                    <div className={'temperature'}>
                                        <div>{i18n.t('facilityType.온도')}</div>
                                        <div>
                                            <span>{i18n.t('sdms.dashboard.연결 상태')} : {(this.state.sensorCount?.tempSensorCount > 0 ? this.state.sensorCount?.tempSensorCount : 0) - (this.state.sensorCount?.disabledTempSensorCount > 0 ? this.state.sensorCount?.disabledTempSensorCount : 0)}/{(this.state.sensorCount?.tempSensorCount > 0 ? this.state.sensorCount?.tempSensorCount : 0)}</span>
                                            <span>{i18n.t('sdms.dashboard.이벤트')} : {doughnutData.find(x => x.facilityType === SDMSResource.facilityType.Temp)?.count} {i18n.language === "ko" ? i18n.t('sdms.dashboard.건') : ""}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className={'hydrogenGas'}>
                                        <div>{i18n.t('facilityType.수소가스')}</div>
                                        <div>
                                            <span>{i18n.t('sdms.dashboard.연결 상태')} : {(this.state.sensorCount?.h2JAGSensorCount > 0 ? this.state.sensorCount?.h2JAGSensorCount : 0) - (this.state.sensorCount?.disabledH2JAGSensorCount > 0 ? this.state.sensorCount?.disabledH2JAGSensorCount : 0)}/{(this.state.sensorCount?.h2JAGSensorCount > 0 ? this.state.sensorCount?.h2JAGSensorCount : 0)}</span>
                                            <span>{i18n.t('sdms.dashboard.이벤트')} : {doughnutData.find(x => x.facilityType === SDMSResource.facilityType.H2JAG)?.count} {i18n.language === "ko" ? i18n.t('sdms.dashboard.건') : ""}</span>
                                        </div>
                                    </div>
                                    <div className={'oxygenGas'}>
                                        <div>{i18n.t('facilityType.산소가스')}</div>
                                        <div>
                                            <span>{i18n.t('sdms.dashboard.연결 상태')} : {(this.state.sensorCount?.o2JAGSensorCount > 0 ? this.state.sensorCount?.o2JAGSensorCount : 0) - (this.state.sensorCount?.disabledO2JAGSensorCount > 0 ? this.state.sensorCount?.disabledO2JAGSensorCount : 0)}/{(this.state.sensorCount?.o2JAGSensorCount > 0 ? this.state.sensorCount?.o2JAGSensorCount : 0)}</span>
                                            <span>{i18n.t('sdms.dashboard.이벤트')} : {doughnutData.find(x => x.facilityType === SDMSResource.facilityType.O2JAG)?.count} {i18n.language === "ko" ? i18n.t('sdms.dashboard.건') : ""}</span>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className={'conductivity'}>
                                    <div>{i18n.t('facilityType.전도도')}</div>
                                    <div>
                                        <span>{i18n.t('sdms.dashboard.연결 상태')} : {(this.state.sensorCount?.conductSensorCount > 0 ? this.state.sensorCount?.conductSensorCount : 0) - (this.state.sensorCount?.disabledConductSensorCount > 0 ? this.state.sensorCount?.disabledConductSensorCount : 0)}/{(this.state.sensorCount?.conductSensorCount > 0 ? this.state.sensorCount?.conductSensorCount : 0)}</span>
                                        <span>{i18n.t('sdms.dashboard.이벤트')} : {doughnutData.find(x => x.facilityType === SDMSResource.facilityType.Conductivity)?.count} {i18n.language === "ko" ? i18n.t('sdms.dashboard.건') : ""}</span>
                                    </div>
                                </div> */}
                                {/* <div className={'gas'}>
                                    <div>{i18n.t('facilityType.가스')}</div>
                                    <div>
                                        <span>{i18n.t('sdms.dashboard.연결 상태')} : {(this.state.sensorCount?.gasSensorCount > 0 ? this.state.sensorCount?.gasSensorCount : 0) - (this.state.sensorCount?.disabledGASSensorCount > 0 ? this.state.sensorCount?.disabledGASSensorCount : 0)}/{(this.state.sensorCount?.gasSensorCount > 0 ? this.state.sensorCount?.gasSensorCount : 0)}</span>
                                        <span>{i18n.t('sdms.dashboard.이벤트')} : {doughnutData.find(x => x.facilityType === SDMSResource.facilityType.GAS)?.count} {i18n.language === "ko" ? i18n.t('sdms.dashboard.건') : ""}</span>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </PopupDraggable>
                </DashboardPopComponent>
            </>
        )
    }
}

export default withTranslation()(DashboardPop);