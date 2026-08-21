import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

import { WeeklyView } from '../../styled/dashboardWonik';

import SDMSResource from '../../../SDMS/resource/id';
import Dashboard from '../dashboard';

class WeeklyWonik extends Component {
    static Mode = {
        weekly: 0,
        month: 1,
    }

    constructor(props) {
        super(props);

        this.state = {
            mode: WeeklyWonik.Mode.weekly,   
            type: SDMSResource.facilityType.FIRE,
        };

        this.props = props;
    }
    
    componentDidMount()  {

    }
    
    // 차트
    getLineData(labels, values) {
        let maxValue = 10;

        if (values?.length > 0) {
            for (let i = 0; i < values.length; i++) {
                const value = values[i];

                if (maxValue < value) {
                    maxValue = value;
                }
            }

            let temp = maxValue % 5;
            temp = 5 - temp;

            if (temp !== 0 && temp !== 5) {
                maxValue += temp;
            }
        }

        let lineChartUI = [];

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            tooltips: {
                enabled: true,
                backgroundColor: '#004BB9',
                bodyFontSize: 14,
                bodyFontFamily: "Pretendard",
                padding: 2,
                displayColors: false,
                cornerRadius: 5,
                padding: 3,
                callbacks: {
                    title: function() {
                        return null; // labels hide
                    },
                    label: (context) => {
                        return `${context.value}건`;
                    }
                },
            },
            plugins: {
                title: {
                    text: 'Chart.js Line Chart',
                },
            },
            legend: {
                display: false
            },
            labels: {
                fontColor: "rgb(255,255,255)",
            },
            position: "left",
            scales: {
                x: {
                    grid: {
                        display: true,
                    },
                },
                y: {
                    gridLines: {
                        color: "#525868",
                    },
                },
                xAxes: [{
                    ticks: {
                        fontSize: 14,
                        fontColor: "#fff",
                        fontFamily: "Pretendard"
                    }
                }],
                yAxes: [{
                    ticks: {
                        min: 0,                 // 수치 최소값
                        max: maxValue,               // 수치 최대값
                        stepSize: (maxValue/5),           // 열 스탭 사이즈
                        fontSize: 14,
                        fontColor: "#fff",
                        fontFamily: "Pretendard"
                    },
                    gridLines: {
                        color: "#525868",
                    },
                }],
            },
        };

        const data = (canvas) => {
            const ctx = canvas.getContext("2d");
            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            const gradient2 = ctx.createLinearGradient(0, 0, 0, 0);
            gradient.addColorStop(0, 'rgba(0,75,185,1)');
            gradient.addColorStop(1, 'rgba(25,165,255,0)');
            gradient2.addColorStop(0, 'rgba(25,165,255,0)');
            gradient2.addColorStop(1, 'rgba(25,165,255,0)');

            return {
                labels,         // 라벨 배열
                datasets: [
                    {
                        label: '중장비',
                        data: values,        // 데이터 값 배열
                        borderColor: 'transparent',
                        backgroundColor: gradient,
                        borderWidth: 2,
                        pointBorderColor: '#fff',
                        fontFamily: 'Pretendard',
                        fontSize: '11px',
                    },
                ],
            }
        };

        lineChartUI.push(<Line key={"lineChart"} options={options} data={data} style={{ position: 'absolute', width: '100vw', height: '30vh' }} />);
        return [lineChartUI];
    }
    
    getData = () => {
        const todayAlarms = this.props.todayAlarms;
        const weeklyAlarms = this.props.weeklyAlarms;
        const monthAlarms = this.props.monthAlarms;

        let alarms = [];

        let labels = [ '-', '-', '-', '-', '-', '-', '-' ];
        let values = [ 0, 0, 0, 0, 0, 0, 0 ];

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
        for (let i = 0; i < todayAlarms?.length; i++) {
            const alarm = todayAlarms[i];
            let facilityType = alarm.facilityType;

            // CCTV 경우 알람 타입 처리
            if (facilityType === SDMSResource.facilityType.Intrusion_S1 ||
                facilityType === SDMSResource.facilityType.Loiter_S1 ||
                facilityType === SDMSResource.facilityType.Collapse_S1 ||
                facilityType === SDMSResource.facilityType.Theft_S1 ||
                facilityType === SDMSResource.facilityType.Neglect_S1 ||
                facilityType === SDMSResource.facilityType.VirtualFence_S1 ||
                facilityType === SDMSResource.facilityType.Fire_S1) {
                facilityType = SDMSResource.facilityType.Intrusion_S1;
            }
            else if (facilityType === SDMSResource.facilityType.Becon_Stay ||
                facilityType === SDMSResource.facilityType.Becon_SOS) {
                facilityType = SDMSResource.facilityType.Becon_Stay;
            }     

            if (facilityType !== type)
                continue;

            nToday++;
        }
    
        const dtToday = new Date();
        let dtOne = new Date();
        let dtTwo = new Date();
        let dtThree = new Date();
        let dtFour = new Date();
        let dtFive = new Date();
        let dtSix = new Date();

        let strToday, strOne, strTwo, strThree, strFour, strFive, strSix;

        let dt = new Date();
        
        if (mode === WeeklyWonik.Mode.weekly) {
            dtOne.setDate(dtToday.getDate() - 1);
            dtTwo.setDate(dtToday.getDate() - 2);
            dtThree.setDate(dtToday.getDate() - 3);
            dtFour.setDate(dtToday.getDate() - 4);
            dtFive.setDate(dtToday.getDate() - 5);
            dtSix.setDate(dtToday.getDate() - 6);

            strToday = (dt.getMonth() + 1) + "/" + dt.getDate() + " (" + Dashboard.arrDayStr[dt.getDay()] + ")";
            dt.setDate(dt.getDate() - 1);
            strOne = (dt.getMonth() + 1) + "/" + dt.getDate() + " (" + Dashboard.arrDayStr[dt.getDay()] + ")";
            dt.setDate(dt.getDate() - 1);
            strTwo = (dt.getMonth() + 1) + "/" + dt.getDate() + " (" + Dashboard.arrDayStr[dt.getDay()] + ")";
            dt.setDate(dt.getDate() - 1);
            strThree = (dt.getMonth() + 1) + "/" + dt.getDate() + " (" + Dashboard.arrDayStr[dt.getDay()] + ")";
            dt.setDate(dt.getDate() - 1);
            strFour = (dt.getMonth() + 1) + "/" + dt.getDate() + " (" + Dashboard.arrDayStr[dt.getDay()] + ")";
            dt.setDate(dt.getDate() - 1);
            strFive = (dt.getMonth() + 1) + "/" + dt.getDate() + " (" + Dashboard.arrDayStr[dt.getDay()] + ")";
            dt.setDate(dt.getDate() - 1);
            strSix = (dt.getMonth() + 1) + "/" + dt.getDate() + " (" + Dashboard.arrDayStr[dt.getDay()] + ")";

            for (let i = 0; i < weeklyAlarms?.length; i++) {
                const alarm = weeklyAlarms[i];
                const date = new Date(alarm.time);

                let facilityType = alarm.facilityType;
                
                // CCTV 경우 알람 타입 처리
                if (facilityType === SDMSResource.facilityType.Intrusion_S1 ||
                    facilityType === SDMSResource.facilityType.Loiter_S1 ||
                    facilityType === SDMSResource.facilityType.Collapse_S1 ||
                    facilityType === SDMSResource.facilityType.Theft_S1 ||
                    facilityType === SDMSResource.facilityType.Neglect_S1 ||
                    facilityType === SDMSResource.facilityType.VirtualFence_S1 ||
                    facilityType === SDMSResource.facilityType.Fire_S1) {
                    facilityType = SDMSResource.facilityType.Intrusion_S1;
                }
                else if (facilityType === SDMSResource.facilityType.Becon_Stay ||
                    facilityType === SDMSResource.facilityType.Becon_SOS) {
                    facilityType = SDMSResource.facilityType.Becon_Stay;
                }  
                // .TODO: 환경, 제조설비 또한 타입 처리 필요
                
                if (facilityType !== type)
                    continue;
                
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

        } else if (mode ===  WeeklyWonik.Mode.month) {
            dtOne.setMonth(dtToday.getMonth() - 1);
            dtTwo.setMonth(dtToday.getMonth() - 2);
            dtThree.setMonth(dtToday.getMonth() - 3);
            dtFour.setMonth(dtToday.getMonth() - 4);
            dtFive.setMonth(dtToday.getMonth() - 5);
            dtSix.setMonth(dtToday.getMonth() - 6);

            strToday = (dt.getMonth() + 1) + "월";
            dt.setMonth(dt.getMonth() - 1);
            strOne = (dt.getMonth() + 1) + "월";
            dt.setMonth(dt.getMonth() - 1);
            strTwo = (dt.getMonth() + 1) + "월";
            dt.setMonth(dt.getMonth() - 1);
            strThree = (dt.getMonth() + 1) + "월";
            dt.setMonth(dt.getMonth() - 1);
            strFour = (dt.getMonth() + 1) + "월";
            dt.setMonth(dt.getMonth() - 1);
            strFive = (dt.getMonth() + 1) + "월";
            dt.setMonth(dt.getMonth() - 1);
            strSix = (dt.getMonth() + 1) + "월";

            for (let i = 0; i < monthAlarms?.length; i++) {
                const alarm = monthAlarms[i];
                const date = new Date(alarm.time);

                let facilityType = alarm.facilityType;
                
                // CCTV 경우 알람 타입 처리
                if (facilityType === SDMSResource.facilityType.Intrusion_S1 ||
                    facilityType === SDMSResource.facilityType.Loiter_S1 ||
                    facilityType === SDMSResource.facilityType.Collapse_S1 ||
                    facilityType === SDMSResource.facilityType.Theft_S1 ||
                    facilityType === SDMSResource.facilityType.Neglect_S1 ||
                    facilityType === SDMSResource.facilityType.VirtualFence_S1 ||
                    facilityType === SDMSResource.facilityType.Fire_S1) {
                    facilityType = SDMSResource.facilityType.Intrusion_S1;
                }
                else if (facilityType === SDMSResource.facilityType.Becon_Stay ||
                    facilityType === SDMSResource.facilityType.Becon_SOS) {
                    facilityType = SDMSResource.facilityType.Becon_Stay;
                }  
                // .TODO: 환경, 제조설비 또한 타입 처리 필요
                
                if (facilityType !== type)
                    continue;

                if (date?.getMonth() === dtToday?.getMonth()) {
                    nToday++;
                } else if (date?.getMonth() === dtOne?.getMonth()) {
                    nOne++;
                } else if (date?.getMonth() === dtTwo?.getMonth()) {
                    nTwo++;
                } else if (date?.getMonth() === dtThree?.getMonth()) {
                    nThree++;
                } else if (date?.getMonth() === dtFour?.getMonth()) {
                    nFour++;
                } else if (date?.getMonth() === dtFive?.getMonth()) {
                    nFive++;
                } else if (date?.getMonth() === dtSix?.getMonth()) {
                    nSix++;
                } 
            }
        }

        labels = [strSix, strFive, strFour, strThree, strTwo, strOne, strToday];
        values = [nSix, nFive, nFour, nThree, nTwo, nOne, nToday];
        
        return [labels, values];
    }

    getBtnUI = () => {
        const type = this.state.type;
        const btnUI = [];

        if (type === SDMSResource.facilityType.FIRE) {
            btnUI.push(<button key={"fire_active"} className="btn isActive">화재</button>);
        } else {
            btnUI.push(<button key={"fire"} className="btn" onClick={() => this.onClickType(SDMSResource.facilityType.FIRE)}>화재</button>);
        }
        if (type === SDMSResource.facilityType.PSM_SENSOR) {
            btnUI.push(<button key={"psm_active"} className="btn isActive">가스</button>);
        } else {
            btnUI.push(<button key={"psm"} className="btn" onClick={() => this.onClickType(SDMSResource.facilityType.PSM_SENSOR)}>가스</button>);
        }

        if (type === SDMSResource.facilityType.Intrusion_S1) {
            btnUI.push(<button key={"cctv_active"} className="btn isActive">CCTV</button>);
        } else {
            btnUI.push(<button key={"cctv"} className="btn" onClick={() => this.onClickType(SDMSResource.facilityType.Intrusion_S1)}>CCTV</button>);
        }

        if (type === SDMSResource.facilityType.Environment) {
            btnUI.push(<button key={"environment_active"} className="btn isActive">환경</button>);
        } else {
            btnUI.push(<button key={"environment"} className="btn" onClick={() => this.onClickType(SDMSResource.facilityType.Environment)}>환경</button>);
        }
        if (type === SDMSResource.facilityType.Manufacture) {
            btnUI.push(<button key={"manufacture_active"} className="btn isActive">제조설비</button>);
        } else {
            btnUI.push(<button key={"manufacture"} className="btn" onClick={() => this.onClickType(SDMSResource.facilityType.Manufacture)}>제조설비</button>);
        }

        if (type === SDMSResource.facilityType.Becon_Stay) {
            btnUI.push(<button key={"becon_active"} className="btn isActive">비콘</button>);
        } else {
            btnUI.push(<button key={"becon"} className="btn" onClick={() => this.onClickType(SDMSResource.facilityType.Becon_Stay)}>비콘</button>);
        }

        return btnUI;
    }

    onClickType = (facilityType) => {
        const type = this.state.type;

        if (type !== facilityType)
            this.setState({type: facilityType});
    }

    onChangeMode = (target) => {
        const mode = this.state.mode;
        let value = target.value;

        value = parseInt(value);

        if (!value)
            value = WeeklyWonik.Mode.weekly;

        if (mode !== value) 
            this.setState({ mode: value });
    }

    changeArrow = () => {
        const changeArrow = document.getElementById('weekly-select');

        changeArrow.classList.toggle('on');
    }

    render() {
        const [labels, values] = this.getData();
        const [lineChartUI] = this.getLineData(labels, values);
        const btnUI = this.getBtnUI();

		return (
			<WeeklyView className="weekly-area">
                <div className="weekly-area-top">
                    <div className="weekly-select-wrap">
                        <select name="weekly-select" id="weekly-select" className={'weekly-selectBox'} onChange={(e) => this.onChangeMode(e.target)} onClick={() => this.changeArrow()}>
                            <option value={WeeklyWonik.Mode.weekly}>주간 현황</option>
                            <option value={WeeklyWonik.Mode.month}>월별 현황</option>
                        </select>
                    </div>
                    <div className="weekly-status-wrap">
                        {btnUI}
                    </div>
                </div>

                <div style={{ height: "18vh", position: "relative", marginTop: "20px"}}>
                    {lineChartUI}
                </div>

            </WeeklyView>
        );
    }
}

export default withRouter(WeeklyWonik);