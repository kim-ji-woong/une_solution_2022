import React from 'react';
import { Bar } from 'react-chartjs-2';

export const options = {
    plugins: {
        title: {
            display: true,
            text: 'Chart.js Bar Chart - Stacked',
        },
    },
    responsive: true,
    scales: {
        xAxes: [{
            stacked: true,
            ticks: {
                fontFamily: 'Pretendard',
                fontSize: 10
            }
        }],
        yAxes: [{
            stacked: true,
            ticks: {
                fontFamily: 'Pretendard',
                fontSize: 10
            }
        }]
    },
    legend: {
        labels: {
            boxWidth: 12,
            boxHeight: 12,
            fontSize: 12,
            fontFamily: "Pretendard",
        },
    }
};

const WindChart = ({ windDirectionDatas, windSpeedDatas, getStringWindDirection }) => {
    const labels = ['북', '북북동', '북동', '동북동', '동', '동남동', '남동', '남남동', '남', '남남서', '남서', '서남서', '서', '서북서', '북서', '북북서'];

    const windDataArrays = [
        { label: '2㎧ 미만', data: Array(labels.length).fill(0), backgroundColor: 'rgb(103, 185, 238)' },
        { label: '2~4㎧', data: Array(labels.length).fill(0), backgroundColor: 'rgb(206, 237, 165)' },
        { label: '4~6㎧', data: Array(labels.length).fill(0), backgroundColor: 'rgb(159, 106, 225)' },
        { label: '6~8㎧', data: Array(labels.length).fill(0), backgroundColor: 'rgb(254, 162, 110)' },
        { label: '8~10㎧', data: Array(labels.length).fill(0), backgroundColor: 'rgb(107, 164, 143)' },
        { label: '10㎧ 초과', data: Array(labels.length).fill(0), backgroundColor: 'rgb(234, 53, 53)' }
    ];

    const processData = (directionValue, speedValue) => {
        const directionIndex = labels.indexOf(directionValue);

        if (directionIndex !== -1) {
            for (let i = 0; i < windDataArrays.length; i++) {
                const dataObj = windDataArrays[i];

                if (speedValue < 2 * (i + 1)) {
                    dataObj.data[directionIndex]++;
                    break;
                }
            }
        }
    };

    for (let i = 0; i < windDirectionDatas.length; i++) {
        const direction = windDirectionDatas[i];
        const speed = windSpeedDatas[i];

        // 방위 명 가져오기
        const directionValue = getStringWindDirection(direction.sensorValue);

        processData(directionValue, speed.sensorValue);
    }

    const windData = {
        labels,
        datasets: windDataArrays.map(dataObj => ({
            label: dataObj.label,
            data: dataObj.data,
            backgroundColor: dataObj.backgroundColor,
            barThickness: 10
        }))
    };

    return <Bar options={options} data={windData} style={{ width: '490px', height: '401px', padding: '10px', border: 'dashed 1px #000000 !important' }} />;
};

export default WindChart;