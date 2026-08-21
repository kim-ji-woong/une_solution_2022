import React, { Component } from 'react';

import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js';

import { MonthProcessDefectComponent } from '../../../styled/dashboardStyled';

class MonthProcessDefect extends Component {

    getBarData = () => {
        const ngs = this.props.ngs;
        let barChartUI = [];
        let labels = [];
        let datas = [];
        let borderColor = [
            'rgba(125, 176, 255, 1)',
            'rgba(44, 242, 185, 1)',
            'rgba(36, 111, 250, 1)',
            'rgba(235, 212, 0, 1)',
            'rgba(136, 230, 255, 1)',
            'rgba(246, 138, 49, 1)',
            'rgba(196, 251, 85, 1)',
            'rgba(231, 255, 183, 1)',
            'rgba(1, 245, 226, 1)',
            'rgba(189, 137, 254, 1)'
        ];
        let backgroundColor = [
            'rgba(125, 176, 255, 0.6)',
            'rgba(44, 242, 185, 0.6)',
            'rgba(36, 111, 250, 0.6)',
            'rgba(235, 212, 0, 0.6)',
            'rgba(136, 230, 255, 0.6)',
            'rgba(246, 138, 49, 0.6)',
            'rgba(196, 251, 85, 0.6)',
            'rgba(231, 255, 183, 0.6)',
            'rgba(1, 245, 226, 0.6)',
            'rgba(189, 137, 254, 0.6)'
        ];

        if(!ngs) {
            return barChartUI;
        }
        else {
            for(let ng of ngs){
                if(ng.id !== 88) {
                    labels.push(ng.lineName);
                    datas.push(ng.total);
                }
            }

            const data = {
                labels,
                datasets: [
                    {
                        label: '공정별 불량 현황',
                        data: datas,
                        borderColor: borderColor,
                        backgroundColor: backgroundColor,
                        hoverBackgroundColor: borderColor,
                        borderWidth: 2,
                        barThickness: 30,
                    },
                ],
            };

            // 값이 y축 max값을 넘을 경우 툴팁이 안보이는 오류로 인해 추가
            Chart.Tooltip.positioners.custom = (elements, eventPosition) => {
                return {
                    x: eventPosition.x,
                    y: eventPosition.y
                };
            }

            const options = {
				responsive: true,
				maintainAspectRatio: false,
				tooltips: {
					position : 'custom', 
                    callbacks: {
						label: function (tooltipItem, data) {
                            let labelValue = data.datasets[tooltipItem.datasetIndex].label;
                            let tooltipValue = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                            return labelValue + " : " + parseInt(tooltipValue).toLocaleString();
                        }
					}
				},
                scales: {
					xAxes: [
						{
							display: true,
							ticks: {
								beginAtZero: true,
								maxTicksLimit: 10, //x축에 표시할 최대 눈금 수
								fontFamily: "Spoqa Han Sans Neo",
								fontColor: "#A5A5A5",
							},
							gridLines:{
								color: "rgba(82, 88, 104, 1)",
								borderDash: [2, 2],
							},
						},
					],
					yAxes: [
						{
							display: true,
							gridLines:{
								color: "rgba(82, 88, 104, 1)",
								borderDash: [2, 2],
							},
							ticks: {
                                maxTicksLimit: 11,
								fontFamily: "Spoqa Han Sans Neo",
								fontColor: "#A5A5A5",
                                stepSize: 200,
								min: 0,
								max: 1800,
							},
						},
					],
				},
                legend: {
                    display: false,
                },
            };
    
            barChartUI.push(<Bar key={"barChart"} options={options} data={data} />);
    
            return barChartUI;
        }
    }

    render() {
        const barChartUI = this.getBarData();
        
        return (
            <MonthProcessDefectComponent className='monthProcessDefect'>
                <h5>당월 공정별 불량 현황</h5>
                <div className='barChartWrap'>
					{barChartUI}
				</div>
            </MonthProcessDefectComponent>
        );
    }
}

export default MonthProcessDefect;