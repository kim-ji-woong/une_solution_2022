import React from 'react';
import { BoardWeeklyComponent } from '../../styled/dashboardGG';

import { Line } from 'react-chartjs-2';
import SdmsResource from '../../../SDMS/resource/id';

const BoardWeekly = (props) => {
    const arrDayStr = ['일', '월', '화', '수', '목', '금', '토'];

    const getData = () => {
        const weeklyAlarms = props.weeklyAlarms;
        const sensorTodayAlarm = props.sensorTodayAlarm;

        let labels = [ '-', '-', '-', '-', '-', '-', '-' ];
        let values = [ 0, 0, 0, 0, 0, 0, 0 ];
        
        let nToday = 0;
        let nOne = 0;
        let nTwo = 0;
        let nThree = 0;
        let nFour = 0;
        let nFive = 0;
        let nSix = 0;

        if (sensorTodayAlarm?.length > 0) {
            for (let alarm of sensorTodayAlarm) {
                // 지진 알람은 모든 입주기관의 이벤트이므로 +6
                alarm.facilityType === SdmsResource.facilityType.Earthquake ? nToday += 6 : nToday++;
            }
        }

        let dtToday = new Date();
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

        strToday = (dt.getMonth() + 1) + "/" + dt.getDate() + " (" + arrDayStr[dt.getDay()] + ")";
        dt.setDate(dt.getDate() - 1);
        strOne = (dt.getMonth() + 1) + "/" + dt.getDate() + " (" + arrDayStr[dt.getDay()] + ")";
        dt.setDate(dt.getDate() - 1);
        strTwo = (dt.getMonth() + 1) + "/" + dt.getDate() + " (" + arrDayStr[dt.getDay()] + ")";
        dt.setDate(dt.getDate() - 1);
        strThree = (dt.getMonth() + 1) + "/" + dt.getDate() + " (" + arrDayStr[dt.getDay()] + ")";
        dt.setDate(dt.getDate() - 1);
        strFour = (dt.getMonth() + 1) + "/" + dt.getDate() + " (" + arrDayStr[dt.getDay()] + ")";
        dt.setDate(dt.getDate() - 1);
        strFive = (dt.getMonth() + 1) + "/" + dt.getDate() + " (" + arrDayStr[dt.getDay()] + ")";
        dt.setDate(dt.getDate() - 1);
        strSix = (dt.getMonth() + 1) + "/" + dt.getDate() + " (" + arrDayStr[dt.getDay()] + ")";

        for (let i = 0; i < weeklyAlarms?.length; i++) {
            const alarm = weeklyAlarms[i];
            const date = new Date(alarm.time);
            
            if (date?.getDate() === dtOne?.getDate()) {
                alarm.facilityType === SdmsResource.facilityType.Earthquake ? nOne += 6 : nOne++;
            } else if (date?.getDate() === dtTwo?.getDate()) {
                alarm.facilityType === SdmsResource.facilityType.Earthquake ? nTwo += 6 : nTwo++;
            } else if (date?.getDate() === dtThree?.getDate()) {
                alarm.facilityType === SdmsResource.facilityType.Earthquake ? nThree += 6 : nThree++;
            } else if (date?.getDate() === dtFour?.getDate()) {
                alarm.facilityType === SdmsResource.facilityType.Earthquake ? nFour += 6 : nFour++;
            } else if (date?.getDate() === dtFive?.getDate()) {
                alarm.facilityType === SdmsResource.facilityType.Earthquake ? nFive += 6 : nFive++;
            } else if (date?.getDate() === dtSix?.getDate()) {
                alarm.facilityType === SdmsResource.facilityType.Earthquake ? nSix += 6 : nSix++;
            } 
        }

        labels = [strSix, strFive, strFour, strThree, strTwo, strOne, strToday];
        values = [nSix, nFive, nFour, nThree, nTwo, nOne, nToday];
        
        return [labels, values];
    }

    // 차트
    const getLineData = () => {
        const [labels, values] = getData();

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
                backgroundColor: '#0E162D',
                bodyFontSize: 14,
                bodyFontFamily: "Pretendard",
                padding: 3,
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
                xAxes: [{
                    gridLines: {
                        display: true,
                        color: "rgba(60, 66, 85, 1)",
                    },
                    ticks: {
                        fontSize: 14,
                        fontColor: "#fff",
                        fontFamily: "Pretendard"
                    }
                }],
                yAxes: [{
                    gridLines: {
                        display: true,
                        color: "rgba(60, 66, 85, 1)",
                        zeroLineColor: 'rgba(255, 255, 255, 1)',
                        borderDash: [3, 2],
                    },
                    ticks: {
                        min: 0,                 // 수치 최소값
                        max: maxValue,               // 수치 최대값
                        stepSize: (maxValue/5),           // 열 스탭 사이즈
                        fontSize: 14,
                        fontColor: "#fff",
                        fontFamily: "Pretendard"
                    }
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
                        label: '기간별 이벤트 발생 건수',
                        data: values,        // 데이터 값 배열
                        borderColor: 'transparent',
                        backgroundColor: gradient,
                        borderWidth: 2,
                        pointBorderColor: '#fff',
                        fontFamily: 'Pretendard',
                        fontSize: '11px',
                        lineTension: 0
                    },
                ],
            }
        };

        lineChartUI.push(<Line key={"lineChart"} options={options} data={data} style={{ position: 'absolute', width: '100vw', height: '30vh' }} />);
        return [lineChartUI];
    }

    return (
        <BoardWeeklyComponent className='weekly-area'>
            <h2>기간별 이벤트 발생 건수</h2>

            <div className='chartWrap'>
                {getLineData()}
            </div>
        </BoardWeeklyComponent>
    );
};

export default BoardWeekly;