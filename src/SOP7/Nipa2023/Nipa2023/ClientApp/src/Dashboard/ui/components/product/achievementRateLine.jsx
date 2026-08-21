import React, { Component } from 'react';

import { HorizontalBar } from 'react-chartjs-2';
import ChartDataLabels from "chartjs-plugin-datalabels";

import { AchievementRateLineComponent } from '../../../styled/dashboardStyled';

class AchievementRateLine extends Component {

    getBarData = () => {
        const performances = this.props.performances;
        let barChartUI = [];
        let labels = [];
        let datas = [];

        if(!performances) {
            return barChartUI;
        }
        else {
            for(let performance of performances) {
				if(performance.id !== 53) {		// 합계는 표출X
					labels.push(performance.lineName);
					datas.push(performance.performanceRate);
				}
            }
            
            const data = {
                labels,
                datasets: [
                    {
                        label: '라인별 달성률',
                        data: datas,
                        borderColor: 'rgba(1, 245, 226, 1)',
                        backgroundColor: ' rgba(1, 245, 226, .6)',
                        hoverBackgroundColor: 'rgba(1, 245, 226, 1)',
                        borderWidth: 2,
                        barThickness: 15,
                    },
                ],
            };
    
            const options = {
				responsive: true,
				maintainAspectRatio: false,
				tooltips: {
					enabled: true,
				},
                scales: {
					xAxes: [
						{
							display: true,
							ticks: {
								beginAtZero: true,
								maxTicksLimit: 10, //x축에 표시할 최대 눈금 수
								stepSize: 20,
								min: 0,
								max: 120,
								fontFamily: "Spoqa Han Sans Neo",
								fontColor: "#A5A5A5",
								//y축 scale 값에 % 붙이기 위해 사용
								callback: function (value) {
									if(value === 120) {
										return "초과";
									} else{
										return value + "%";
									}
								},
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
								fontFamily: "Spoqa Han Sans Neo",
								fontColor: "#A5A5A5",
							},
						},
					],
				},
                legend: {
                    display: false,
                },
				plugins: {
					datalabels: {
						formatter: function (value) {
							return value + "%";
						},
						color: "#fff",
						anchor: "end",
						align: "end",
						fontSize: "14px",
						font: { 
							family: "Spoqa Han Sans Neo",
							weight: "bold"
						},
					}
				}
            };
    
            barChartUI.push(<HorizontalBar key={"barChart"} options={options} data={data} plugins={[ChartDataLabels]} />);
    
            return barChartUI;
        }
    }

    render() {
        const barChartUI = this.getBarData();

        return (
            <AchievementRateLineComponent className='achievementRateLine'>
                <h5>라인별 달성률</h5>
				<div className='barChartWrap'>
					{barChartUI}
				</div>
            </AchievementRateLineComponent>
        );
    }
}

export default AchievementRateLine;