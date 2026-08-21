import React from 'react';
import { Line } from 'react-chartjs-2';

const LineChart = ({ labels, datasets, materialUOM }) => {
    const options = {
        plugins: {
            title: {
                display: false,
                text: 'Chart.js Line Chart',
            },
        },
        responsive: true,
        responsiveAnimationDuration: 1000,
        maintainAspectRatio: false,
        elements: {
            point: {
                radius: 0,
            },
        },
        scales: {
            xAxes: [
                {
                    gridLines: {
                        display: false,
                    },
                    ticks: {
                        fontSize: 10,
                        fontColor: '#000000',
                        autoSkip: true,
                        maxTicksLimit: 10
                    }
                }
            ],
            yAxes: [
                {
                    gridLines: {
                        drawBorder: false,
                        // color: '#000000',
                        borderDash: [3, 2],
                    },
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        // stepSize: 20,
                        fontFamily: "Pretendard",
                        fontColor: '#000000',
                        fontSize: 10
                    }
                }
            ]
        },
        legend: {
            position: 'bottom',
            align: 'start',
            labels: {
                boxWidth: 10,
                boxHeight: 10,
                fontSize: 11,
                fontFamily: "Pretendard",
            },
        },
        tooltips: {
            bodyFontFamily: "Pretendard",
            displayColors: false,
            callbacks: {
                label: function(tooltipItem, data) {
                    return data.datasets[tooltipItem.datasetIndex].label + " : " + tooltipItem.value + materialUOM;
                }
            },
        },
    };

    const data = {
        labels,
        datasets: datasets
    };

    return <Line options={options} data={data} style={{ width: '490px', height: '401px', padding: '10px' }} />;
};

export default LineChart;