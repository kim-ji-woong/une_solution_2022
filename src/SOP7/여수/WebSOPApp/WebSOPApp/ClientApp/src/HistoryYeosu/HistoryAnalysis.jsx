import React, { Component } from 'react';

import { Header } from "./styled";
import { Logo } from "./styled";
import { Contents } from "./styled";
import { SideBar } from "./styled";
import { BeforeBtn } from "./styled";
import { ReturnIcon } from "./styled";
import { SopListBox } from "./styled";
import { SensorAlarmText } from "./styled";
import { PageNation } from "./styled";
import { PageLeftArrowIconB } from "./styled";
import { PageRightArrowIconB } from "./styled";


//import MenuBar from './SOPHeader/Menubar/Menubar';
import SensorHistoryAccordion from './HistoryContents/Sidebar/sensorHistoryAccordion';
import SensorAnalysisAccordion from './HistoryContents/Sidebar/sensorAnalysisAccordion';
import SopHistoryAccordion from './HistoryContents/Sidebar/sopHistoryAccordion';
import SensorDetectSelect from './HistoryContents/Historybody/SensorDetectSelect';
import HistoryAnalysisTable from '../HistoryYeosu/HistoryContents/Historybody/HistoryAnalysisTable';


import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';


class HistoryAnalysis extends Component {
    constructor(props) {
        super(props);

    }

    getLineData() {
        let lineChartUI = [];

        const options = {
            responsive: true,
            plugins: {
                title: {
                    text: 'Chart.js Line Chart',
                },
            },
            legend: {
                display: true,
            },
            labels: {
                fontColor: "rgb(255,255,255)",
            },
            position: "left",
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
                    }
                }],
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 50,
                        stepSize: 25,
                        fontSize: 11,
                    },
                    gridLines: {
                        color: "#666666",
                    },
                }],
            },
        };

        const labels = [ '도성 간이양로원', '삼일동주민센터', '대포3구회관', '대평노인회관', '묘도동주민센터' ];

        const data = (canvas) => {
            const ctx = canvas.getContext("2d");
            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            const gradient2 = ctx.createLinearGradient(0, 0, 0, 0);
            gradient.addColorStop(0, 'rgba(25,165,255,1)');
            gradient.addColorStop(1, 'rgba(25,165,255,0)');
            gradient2.addColorStop(0, 'rgba(25,165,255,0)');
            gradient2.addColorStop(1, 'rgba(25,165,255,0)');

            return {
                labels,
                datasets: [
                    {
                        label: '탐지 횟수',
                        data: labels.map(() => faker.datatype.number({ min: 0, max: 50 })),
                        borderColor: '#d7d7d7',
                        backgroundColor: gradient,
                        borderWidth: 2,
                        pointBorderColor: '#fff',
                        fontFamily: 'Pretendard',
                        fontSize: '11px',
                    },
                    {
                        label: '누적 탐지율',
                        data: labels.map(() => faker.datatype.number({ min: 0, max: 50 })),
                        borderColor: 'red',
                        backgroundColor: gradient2,
                        borderWidth: 2,
                        pointBorderColor: 'red',
                        fontFamily: 'Pretendard',
                        fontSize: '11px',
                    },
                ],
            }
        };
        lineChartUI.push(<Line options={options} data={data} style={{ position: 'absolute', width: '100vw', height: '30vh' }} options={{ maintainAspectRatio: false }} />);
        return [lineChartUI];
    }


    render() {
        const [lineChartUI] = this.getLineData();

        return (
            <>
                <Header>
                  <Logo></Logo>
                </Header>
                <Contents>
                    <SideBar>
                        <SensorHistoryAccordion />
                        <SensorAnalysisAccordion />
                        <SopHistoryAccordion />

                        <BeforeBtn>
                            <ReturnIcon></ReturnIcon>
                            이전페이지
                        </BeforeBtn>
                    </SideBar>

                    <SopListBox style={{ position: 'relative' }}>
                        <span>센서탐지 분석</span>

                        <SensorDetectSelect />

                        <SensorAlarmText>
                          <span>2021-12-20 ~ 2022-12-27</span>동안 전체의 센서 탐지 횟수는 <span>9회</span>이며 오작동률은 <span>33.33%</span>입니다. 가장 많은 오작동을 일으킨 센서는 <span>T1-2 질산정제실 발신기</span>입니다.
                        </SensorAlarmText>

                        <div style={{ marginTop: '20px', height: '30vh', position: 'relative' /* , boxshadow: '0px 7px 14px #00000012' */ }}>
                           {lineChartUI}
                        </div>

                        <HistoryAnalysisTable />

                        <PageNation>
                            <PageLeftArrowIconB></PageLeftArrowIconB>
                            <span className="active">1</span>
                            <span>2</span>
                            <span>3</span>
                            <PageRightArrowIconB></PageRightArrowIconB>
                        </PageNation>
                    </SopListBox>
                </Contents>
            </>
        );
    }
}

export default HistoryAnalysis;