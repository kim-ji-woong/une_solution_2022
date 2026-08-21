import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import "chartjs-plugin-doughnutlabel";

import ChartDataLabels from "chartjs-plugin-datalabels";

const getOperationChartData = (operationData) => {
    let operationChartData = {};

    const labelDatas = [];
    const valueDatas = [];
    const colorDatas = [];

    let total = 0;
    

    for (let i = 0; i < operationData?.length; i++) {
        const data = operationData[i];
        const color = getColor(data.index);

        labelDatas.push(data.title);
        valueDatas.push(data.data);
        colorDatas.push(color);

        total += data.data;
    }

    if (labelDatas.length > 0) {
        operationChartData = {
            labels: labelDatas,
            datasets: [
                { 
                    data: valueDatas,
                    backgroundColor: colorDatas,
                    borderWidth: 0, // border 삭제
                },
            ],    
        };
    } else {
        // 데이터가 없을 경우
        operationChartData = {
            labels: labelDatas,
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

    return [operationChartData, total];
}

const getColor = (num) => {
    let color = '#004BB9';
    const idx = num % 4;

    if (idx === 1) {
        color = '#005FEC';
    } else if (idx === 2) {
        color = '#207AFF';
    } else if (idx === 3) {
        color = '#5398FF';
    } 

    return color;
}

const getOptions = (operationChartData, total) => {
    let tooltipData = { enabled: false };
    let datalabelData = { display: false };

    if (operationChartData?.labels?.length > 0) {
        tooltipData = {
            enabled: true,
            backgroundColor: '#0E162D',
            borderColor: '#fff',
            borderWidth: 1,
            cornerRadius: 0,
            bodyFontSize: 14,
            bodyFontFamily: "Pretendard",
            padding: 2,
            displayColors: false,
            callbacks: {
                label: (context) => operationChartData.labels[context.index] 
            },
        };

        datalabelData = {
            backgroundColor: '#fff',
            color: 'black',
            borderRadius: 100,
            padding: function(context) {
                // background를 원 형태로 만들기 위해
                const dataset = context.dataset;
                const value = dataset.data[context.dataIndex];
                if (value < 10) return {top: 10, bottom: 9, left: 14, right: 14};
                const padding = (Math.log(value) * Math.LOG10E + 1 | 0) * 4
                return {
                    top: padding,
                    bottom: padding - 2,
                    left: 8,
                    right: 8,
                }
            },
            font: {
                family: "Pretendard",
                size: "14",
                weight: "bold",
            },
            textAlign: 'center',
            anchor: 'end',
            clamp: false,
        };
    } 

    const strTotal = total + "건";

    const options = {
        responsive: false,
        aspectRatio: 1,
        // maintainAspectRatio: false,
        cutoutPercentage: 65, // 도넛 굵기
        // rotation: 23,
        legend: {
            display: false
        },
        layout: {
            padding: {
                left: 25,
                right: 25,
            }
        },
        tooltips: tooltipData,
        plugins: {
            // center text
            doughnutlabel: {
                labels: [
                    {
                        text: "총 작업수",
                        font: {
                            family: "Pretendard",
                            size: "16",
                            weight: "normal"
                        },
                        color: "white"
                    },
                    {
                        text: strTotal,
                        font: {
                            family: "Pretendard",
                            size: "16",
                            weight: "bold"
                        },
                        color: "white"
                    }
                ]
            },

            datalabels: datalabelData
        },
    };

    return options;
}

export default function OperationChart(props) {
    const [operationChartData, total] = getOperationChartData(props.operationData);
    const options = getOptions(operationChartData, total);

    return <Doughnut 
                key={operationChartData?.labels?.length}
                width={220} 
                height={220}
                data={operationChartData} 
                options={options}
                plugins={[ChartDataLabels]}
            />
}