import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

class LineChart extends Component {

    getLineData = () => {
        const labels = this.props.labels;
        const data = this.props.data;
        
        const datas = {
            labels,
            datasets: [{
                label: 'line chart',
                data: data,
                borderColor: '#0095FF',
                backgroundColor: '#0095FF',
                fill: false,
                borderWidth: 1,
                lineTension: 0,
                pointStyle:'rect',
                pointBorderColor: '#fff'
            }]
        };

        const options = {
            // responsive: false,
            maintainAspectRatio: false,
            drawTicks: false,
            scales: {
                xAxes: [
                    {
                        gridLines: {
                            display: false,
                        },
                        ticks: {
                            fontSize: 10,
                            fontColor: 'lightgrey'
                        }
                    }
                ],
                yAxes: [
                    {
                        gridLines: {
                            drawBorder: false,
                            color: "rgba(255, 255, 255, 0.20)",
                            borderDash: [3, 2],
                        },
                        ticks: {
                            beginAtZero: true,
                            min: 0,
                            stepSize: 2,
                            fontFamily: "Spoqa Han Sans Neo",
                            fontColor: "rgba(0, 0, 0, 0)",
                            fontSize: 10
                        }
                    }
                ]
            },
            legend: {
                display: false,
            },
            tooltips: {
                enabled: true,
                backgroundColor: '#fff',
                bodyFontSize: 12,
                bodyFontFamily: "Spoqa Han Sans Neo",
                bodyFontColor: "#424242",
                bodyFontStyle: "bold",
                padding: 2,
                displayColors: false,
                cornerRadius: 2,
                padding: 3,
                callbacks: {
                    title: function() {
                        return null; // labels hide
                    },
                    label: (context) => {
                        return `${context.value}${this.props.unit}`;
                    }
                },
            },
        };

        return [datas, options];
    }

    render() {
        const [datas, options] = this.getLineData();

        return (
            <Line 
                key='lineChart'
                data={datas}
                options={options}
                height={90}
            />
        );
    }
}

export default LineChart;