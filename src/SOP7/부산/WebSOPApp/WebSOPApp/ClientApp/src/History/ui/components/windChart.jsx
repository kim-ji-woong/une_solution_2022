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
    responsiveAnimationDuration: 1000,  // 크기 조정 이벤트 후 새 크기로 애니메이션하는 데 걸리는 시간(밀리 초) (defalut : 0)
    maintainAspectRatio: false,  // (width / height) 크기를 조정할 떄 원래 캔버스 종횡비를 유지 (defalut : true)
    elements: {
        point: {
            radius: 0,
        },
    },
    tooltips: {
        enabled: true,
        mode: "nearest",
        position: "average",
        intersect: false
    },
    scales: {
        xAxes: [
            {
                position: "bottom", //default는 bottom
                display: true,
                // categoryPercentage: 0.7,
                scaleLabel: {
                    display: true,
                    fontColor: "#fff",
                    fontFamily: 'Pretendard',
                },
                ticks: {
                    // beginAtZero: true,
                    //maxTicksLimit: 50,              // 표시할 최대 눈금 수
                    //color: "rgb(190,190,190)",
                    fontFamily: 'Pretendard',
                    fontColor: "#fff",             //라벨 텍스트 컬러
                    fontSize: 11,                     // 눈금 텍스트 사이즈
                    //beginAtZero: true,              // 0부터 시작
                },
                gridLines: {
                    color: "#fff",           // 눈금 라인 컬러
                    lineWidth: 1,
                    //borderDashOffset: 2,
                    //borderDash: [2, 2],
                },
            },
        ],
        yAxes: [
            {
                display: true,
                //padding: 10,
                scaleLabel: {
                    display: true,
                    fontColor: "#fff",
                    fontFamily: 'Pretendard',
                },
                ticks: {
                    beginAtZero: true,
                    stepSize: 5,
                    maxTicksLimit: 10,
                    min: 0,
                    // max: 25,
                    fontColor: "#fff",
                    //borderDash: [2, 2],
                    //borderDashOffset: 2,
                },
                gridLines: {
                    color: "#fff",
                    //borderDash: [2, 2],
                    //borderDashOffset: 2,
                },
            },
        ],
    },

    legend: { // 범례
        position: 'bottom',
        align: 'center',
        labels: {
            //usePointStyle: true,   // 지정된 포인트 모양에 따라 범례 아이콘 생성
            padding: (0, 12),             // 범례들 사이의 간격
            fontColor: '#fff',
            fontFamily: 'Pretendard',
            boxWidth: 12,
            boxHeight: 12,
            fontSize: 12,
        }
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
        const directionValue = getStringWindDirection(direction);

        processData(directionValue, speed);
    }

    const windData = {
        labels,
        datasets: windDataArrays.map(dataObj => ({
            label: dataObj.label,
            data: dataObj.data,
            backgroundColor: dataObj.backgroundColor,
            barThickness: 5,
            bar: { categoryPercentage: 0.7, barPercentage: 0.9 }
        }))
    };

    return <Bar options={options} data={windData} style={{ width: '490px', height: '700px', padding: '20px', border: 'dashed 1px #000000 !important' }} />;
};

export default WindChart;