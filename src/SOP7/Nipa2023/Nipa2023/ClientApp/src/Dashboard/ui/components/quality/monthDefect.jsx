import React, { Component } from 'react';

import { Line } from 'react-chartjs-2';

import { MonthDefectComponent } from '../../../styled/dashboardStyled';

class MonthDefect extends Component {

    getlineData = () => {
        const ngs = this.props.ngs;
        let lineChartUI = [];
        let labels = [];
        let datasets = [];

        if(!ngs) {
            return lineChartUI;
        }
        else {
            for(let i = 0; i < ngs.length; i++){
                const ng = ngs[i];
                
                // 불량수량만 push
                if(ng.id === 88) {
                    datasets.push(
                        {
                            label: ng.lineName,
                            data: [ng.d01, ng.d02, ng.d03, ng.d04, ng.d05, ng.d06, ng.d07, ng.d08, ng.d09, ng.d10, ng.d11, ng.d12, ng.d13, ng.d14, ng.d15, ng.d16, ng.d17, ng.d18, ng.d19, ng.d20, ng.d21, ng.d22, ng.d23, ng.d24, ng.d25, ng.d26, ng.d27, ng.d28, ng.d29, ng.d30, ng.d31],
                            borderColor: "rgba(255, 93, 93, 1)",
                            backgroundColor: "rgba(255, 93, 93, 1)",
                            fill: false,
                            borderWidth: 1,
                            lineTension: 0,
                            pointRadius: 1.5,
                        }
                    );
                }
            }

            labels.push('D01', 'D02', 'D03', 'D04', 'D05', 'D06', 'D07', 'D08', 'D09', 'D10', 'D11', 'D12', 'D13', 'D14', 'D15', 'D16', 'D17', 'D18', 'D19', 'D20', 'D21', 'D22', 'D23', 'D24', 'D25', 'D26', 'D27', 'D28', 'D29', 'D30', 'D31');

            const data = {
                labels,
                datasets: datasets
            };

            const options = {
				responsive: true,
				maintainAspectRatio: false,
				tooltips: {
                    intersect: false,
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
								fontFamily: "Spoqa Han Sans Neo",
								fontColor: "#A5A5A5",
                                autoSkip: true,
                                maxTicksLimit: 10,
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
                                stepSize: 200,
								fontFamily: "Spoqa Han Sans Neo",
								fontColor: "#A5A5A5",
							},
						},
					],
				},
                legend: {
                    display: true,
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
    
            lineChartUI.push(<Line key={"lineChart"} options={options} data={data} />);
    
            return lineChartUI;
        }
    }

    render() {
        const lineChartUI = this.getlineData();

        return (
            <MonthDefectComponent className='monthDefect'>
                <h5>당월 불량 현황</h5>
                <div className='lineChartWrap'>
					{lineChartUI}
				</div>
            </MonthDefectComponent>
        );
    }
}

export default MonthDefect;