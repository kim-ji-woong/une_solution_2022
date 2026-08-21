import React, { Component } from 'react';

import { Doughnut } from 'react-chartjs-2';
import "chartjs-plugin-doughnutlabel";
import ChartDataLabels from "chartjs-plugin-datalabels";

class DoughnutChart extends Component {

    getDoughnutData = () => {
        let doughnutChartUI = [];
        const allDatas = this.props.allDatas;
        const colors = this.props.colors;
        let labels = this.props.labels;
        let datasets = this.props.datasets;
        let total = this.props.total;

        let datas = [];

        if(!allDatas) {
            return doughnutChartUI;
        }
        else {
            const options = {
                layout: {
                    padding: {
                        top: 20
                    }
                },
                responsive: false,
                aspectRatio: 1,
                cutoutPercentage: 50, // 도넛 굵기
                legend: {
                    display: true,
                    align: "start",
                    position: 'bottom',
                    labels: {
                        generateLabels: (chart) => {
                            const datasets = chart.data.datasets;
                            let labels = [];
                            
                            datasets[0].data.map((data, i) => {
                                let dataset = datasets[0].data;
                                let sum = 0;
                                dataset.map((data) => {
                                    sum += data;
                                });

                                let percentage = ((dataset[i] * 100) / sum).toFixed(1);

                                if(percentage > 0) {
                                    labels.push({
                                        text: `${chart.data.labels[i].includes('(') ? chart.data.labels[i].substring(0, chart.data.labels[i].indexOf('(')) : chart.data.labels[i]} : ${percentage}`,
                                        // text: `${chart.data.labels[i].includes('(') ? chart.data.labels[i].substring(0, chart.data.labels[i].indexOf('(')) : chart.data.labels[i]} : ${percentage[percentage.length - 3] === '0' ? percentage.slice(0, -2) : percentage}`,
                                        fillStyle: datasets[0].backgroundColor[i],
                                        index: i,
                                        hidden: chart ? chart.getDatasetMeta(0).data[i].hidden : false
                                    });
                                }
                            })

                            return labels;
                        },
                        boxWidth: 12,
                        boxHeight: 12,
                        fontSize: 12,
                        fontFamily: "Spoqa Han Sans Neo",
                        fontColor: "#fff",
                    },
                },
                tooltips: {
                    enabled: false,
                },
                hover: {
                    mode: null
                },
                plugins: {
                    datalabels: {
                        backgroundColor: '#222A31',
                        color: '#fff',
                        borderColor: function(context) {
                            const dataset = context.dataset;
                            const color = dataset.backgroundColor[context.dataIndex];
                            return color;
                        },
                        borderWidth: 2,
                        borderRadius: 4,
                        padding: function(context) {
                            const dataset = context.dataset;
                            const value = dataset.data[context.dataIndex];
                            if (value < 10) return {top: 10, bottom: 9, left: 14, right: 14};
                            return {
                                top: 3,
                                bottom: 3 - 2,
                                left: 8,
                                right: 8,
                            }
                        },
                        font: {
                            family: "Spoqa Han Sans Neo",
                            size: "14",
                        },
                        textAlign: 'center',
                        anchor: 'end',
                        clamp: false,
                        // 값이 0이면 hide
                        display: (context) => context.dataset.data[context.dataIndex] !== 0,
                        // 값 백분율 계산 후 표출
                        formatter: (value, context) => {
                            let dataset = context.dataset.data;
                            let sum = 0;
                            dataset.map((data) => {
                                sum += data;
                            });
                            let percentage = ((value * 100) / sum).toFixed(1);
                            
                            if(percentage === '-0.0' || percentage === '0.0'){
                                return null;
                            }
                            else {
                                return percentage  + " %";
                                // return percentage[percentage.length - 3] === '0' ? percentage.slice(0, -2)  + " %" : percentage  + " %";
                            }
                        },
                    },
                },
            };

            if(total > 0) {
                datas = {
                    labels,
                    datasets: [
                        { 
                            data: datasets,
                            backgroundColor: colors,
                            borderWidth: 0, // border 삭제
                        },
                    ], 
                };
            } else {
                datas = {
                    labels,
                    datasets: [
                        { 
                            data: [1],
                            backgroundColor: [
                                '#dbdbdb',
                            ],
                            borderWidth: 0, // border 삭제
                        },
                    ],
                };
            }

            return [datas, options];
        }
    }

    render() {
        const [datas, options] = this.getDoughnutData();

        return (
            <Doughnut 
                width={417}  
                height={350}
                data={datas} 
                options={options}
                plugins={[ChartDataLabels]}
            />
        );
    }
}

export default DoughnutChart;