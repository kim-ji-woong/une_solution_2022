import React, { Component } from 'react';

import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js';

import { OrderStockComponent } from '../../../styled/dashboardStyled';

class OrderStock extends Component {

    getBarData = () => {
        const buyDatas = this.props.buyDatas
        let barChartUI = [];
        let labels = [];
        let incomeDatas = [];
        let requestDatas = [];

        if(!buyDatas) {
            return barChartUI;
        }
        else {
            for(let buyData of buyDatas){
                incomeDatas.push(buyData.incomeCount);
                requestDatas.push(buyData.requestCount);
                labels.push(buyData.customer);
            }

            const data = {
                labels,
                datasets: [
                    {
                        label: '발주',
                        data: requestDatas,
                        borderColor: 'rgba(17, 219, 227, 1)',
                        backgroundColor:'rgba(17, 219, 227, 0.6)',
                        hoverBackgroundColor: 'rgba(17, 219, 227, 1)',
                        borderWidth: 2,
                        barThickness: 25,
                    },
                    {
                        label: '입고',
                        data: incomeDatas,
                        borderColor: 'rgba(240, 89, 125, 1)',
                        backgroundColor: 'rgba(240, 89, 125, 0.6)',
                        hoverBackgroundColor: 'rgba(240, 89, 125, 1)',
                        borderWidth: 2,
                        barThickness: 25,
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
                                beginAtZero: true,
                                maxTicksLimit: 11,
								fontFamily: "Spoqa Han Sans Neo",
								fontColor: "#A5A5A5",
                                stepSize: 10000,
								min: 0,
								max: 50000,
							},
						},
					],
				},
                legend: {
                    align: "end",
                    labels: {
                        boxWidth: 10,
                        boxHeight: 10,
                        fontSize: 10,
                        fontFamily: "Spoqa Han Sans Neo",
                        fontColor: "#fff",
                    }
                },
            };
    
            barChartUI.push(<Bar key={"barChart"} options={options} data={data} />);
    
            return barChartUI;
        }
    }

    render() {
        const barChartUI = this.getBarData();

        return (
            <OrderStockComponent className='orderStock'>
                <h5>발주 대비 입고량</h5>
                <div className='barChartWrap'>
					{barChartUI}
				</div>
            </OrderStockComponent>
        );
    }
}

export default OrderStock;