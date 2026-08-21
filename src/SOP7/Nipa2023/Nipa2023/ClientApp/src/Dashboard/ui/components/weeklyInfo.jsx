import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import SdmsResource from '../../../SDMS/resource/id';
import Dashboard from '../dashboard';

import { UserDispatch } from '../../../Root/resource/userDispatch';
import { Line } from 'react-chartjs-2';

import { WeeklyInfoComponent } from '../../styled/dashboardStyled';

class WeeklyInfo extends Component {
    static contextType = UserDispatch;

    constructor(props) {
        super(props);
		
		this.state = {
            sensorType: SdmsResource.facilityType.GAS
        }

		this.props = props;
	}

    onChangeMode = (type) => {
        const sensorType = this.state.sensorType;

        if(sensorType !== type)
            this.setState({ sensorType: type });
    }

    // 차트
    getLineData(labels, values, sensorType) {
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

            if (temp !== 0) {
                maxValue += temp;
            }
        }

        let sensorName = '';
        if(sensorType === SdmsResource.facilityType.ATMOSPHERE) {
            sensorName = SdmsResource.ID.sensor.atmosphere;
        }
        else if(sensorType === SdmsResource.facilityType.GAS) {
            sensorName = SdmsResource.ID.sensor.gas;
        }
        else if(sensorType === SdmsResource.facilityType.EMERGENCYBELL) {
            sensorName = SdmsResource.ID.sensor.emergencyBell;
        }
        else if(sensorType === SdmsResource.facilityType.THERMAL_CAMERA) {
            sensorName = SdmsResource.ID.sensor.thermalCamera;
        }
        else if(sensorType === SdmsResource.facilityType.WORKER) {
            sensorName = SdmsResource.ID.sensor.worker;
        }
        else if(sensorType === SdmsResource.facilityType.FIRE) {
            sensorName = SdmsResource.ID.sensor.fire;
        }
        
        let lineChartUI = [];

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            tooltips: {
                enabled: true,
                backgroundColor: '#20DFA8',
                bodyFontSize: 14,
                bodyFontFamily: "Spoqa Han Sans Neo",
                bodyFontColor: "#000000",
                bodyFontStyle: "bold",
                padding: 2,
                displayColors: false,
                cornerRadius: 5,
                padding: 3,
                callbacks: {
                    title: function() {
                        return null; // labels hide
                    },
                    label: (context) => {
                        return `${sensorName + ' : ' + context.value}건`;
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
                        fontFamily: "Spoqa Han Sans Neo"
                    }
                }],
                yAxes: [{
                    ticks: {
                        min: 0,                 // 수치 최소값
                        max: maxValue,               // 수치 최대값
                        stepSize: (maxValue/5),           // 열 스탭 사이즈
                        fontSize: 14,
                        fontColor: "#fff",
                        fontFamily: "Spoqa Han Sans Neo"
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
            gradient.addColorStop(1, 'rgba(32, 223, 168, .4)');
            gradient.addColorStop(1, 'rgba(25,165,255,0)');
            gradient2.addColorStop(0, 'rgba(25,165,255,0)');
            gradient2.addColorStop(0, 'rgba(25,165,255,0)');

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
                        fontFamily: 'Spoqa Han Sans Neo',
                        fontSize: '11px',
                    },
                ],
            }
        };

        lineChartUI.push(<Line key={"lineChart"} options={options} data={data} style={{ position: 'absolute', width: '100vw', height: '30vh' }} />);
        return [lineChartUI];
    }

    getData = () => {
        const { alarm } = this.context;
        const alarms = alarm[0].alarmState;
        const weeklyAlarmData = this.props.weeklyAlarmData;
        const type = this.state.sensorType;

        let labels = [ '-', '-', '-', '-', '-', '-', '-' ];
        let values = [ 0, 0, 0, 0, 0, 0, 0 ];

        let nToday = 0;
        let nOne = 0;
        let nTwo = 0;
        let nThree = 0;
        let nFour = 0;
        let nFive = 0;
        let nSix = 0;

        // 오늘 알람 데이터
        if(alarms) {
            const todayAlarms = alarms['allAlarmDatas'];
            
            if(todayAlarms) {

                let now = new Date();
                let month = now.getMonth() + 1;                 
                let day = now.getDate();
                
                for (let i = 0; i < todayAlarms.length; i++) {
                    const alarm = todayAlarms[i];

                    // 오늘 날짜인지 확인
                    let eventTime = new Date(alarm.eventTime);
                    let eventMonth = eventTime.getMonth() + 1;                             
                    let eventDay = eventTime.getDate();

                    if(month === eventMonth && day === eventDay){
                        let facilityType = alarm.facilityType;
                    
                        if(facilityType !== type)
                            continue;
                    
                        nToday++;
                    }
                }
            }
        }

        // 오늘을 제외한 6일간의 데이터
        if(weeklyAlarmData){
            const weeklyAlarms = weeklyAlarmData['allAlarmDatas'];

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
                const date = new Date(alarm.eventTime);
    
                let facilityType = alarm.facilityType;
            
                if(facilityType !== type)
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

            labels = [strSix, strFive, strFour, strThree, strTwo, strOne, strToday];
            values = [nSix, nFive, nFour, nThree, nTwo, nOne, nToday];
        }

        return [labels, values];
    }

    render() {
        const sensorType = this.state.sensorType;

        const [labels, values] = this.getData();
        const [lineChartUI] = this.getLineData(labels, values, sensorType);

        return (
            <WeeklyInfoComponent className="weeklyInfo">
                <div className="headerWrap">
                    <div className="selectWrap">
                        <h5>이벤트 주간 현황</h5>
                    </div>
                    <div className="buttonWrap">
                        <button  className={sensorType === SdmsResource.facilityType.GAS ? 'isActive' : null} onClick={() => this.onChangeMode(SdmsResource.facilityType.GAS)}>{SdmsResource.ID.sensor.gas}</button>
                        <button className={sensorType === SdmsResource.facilityType.ATMOSPHERE ? 'isActive' : null} onClick={() => this.onChangeMode(SdmsResource.facilityType.ATMOSPHERE)}>{SdmsResource.ID.sensor.atmosphere}</button>
                        <button  className={sensorType === SdmsResource.facilityType.EMERGENCYBELL ? 'isActive' : null} onClick={() => this.onChangeMode(SdmsResource.facilityType.EMERGENCYBELL)}>{SdmsResource.ID.sensor.emergencyBell}</button>
                        <button  className={sensorType === SdmsResource.facilityType.THERMAL_CAMERA ? 'isActive' : null} onClick={() => this.onChangeMode(SdmsResource.facilityType.THERMAL_CAMERA)}>{SdmsResource.ID.sensor.thermalCamera}</button>
                        <button  className={sensorType === SdmsResource.facilityType.WORKER ? 'isActive' : null} onClick={() => this.onChangeMode(SdmsResource.facilityType.WORKER)}>{SdmsResource.ID.sensor.worker}</button>
                        <button  className={sensorType === SdmsResource.facilityType.FIRE ? 'isActive' : null} onClick={() => this.onChangeMode(SdmsResource.facilityType.FIRE)}>{SdmsResource.ID.sensor.fire}</button>
                    </div>
                </div>

                <div style={{ height: "calc(100% - 35px)", position: "relative", marginTop: "17px"}}>
                    {lineChartUI}
                </div>
            </WeeklyInfoComponent>
        )
    }
}

export default withRouter(WeeklyInfo);