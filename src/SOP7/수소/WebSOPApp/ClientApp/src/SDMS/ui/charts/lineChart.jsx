import React from 'react';
import { Line } from 'react-chartjs-2';

const LineChart = ({
    typeName = '-',
    lineColor = '#1465EF',
    fill = true,
    lineTension = 0,
    height = 110,
    showLegend = false,
    datas = null
}) => {
    const data = {
        labels: datas?.labels,
        datasets: [{
            label: typeName,
            data: datas?.sensorData,
            lineTension,
            borderColor: lineColor,
            backgroundColor: 'rgba(0,0,0,0)',
            borderWidth: 1, // 1px 라인
            fill,
            // 포인트 스타일
            pointRadius: 3,                // width/height ≈ 6px (반지름 3px)
            pointHoverRadius: 4,           // hover 시 조금 더 크게
            pointBorderColor: '#FFF',    // stroke 색상
            pointBorderWidth: 0.5,         // stroke-width
            pointBackgroundColor: lineColor, // 내부 색상 (선 색상과 맞춤)
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 1000,
        legend: { display: showLegend, position: 'top', labels: { fontColor: '#fff' } },
        tooltips: {
            enabled: true,
            mode: 'nearest',
            position: 'average',
            intersect: false,
            displayColors: false,
        },
        hover: { mode: 'nearest', intersect: true },
        scales: {
            xAxes: [{
                display: true,
                ticks: {
                    autoSkip: false, // 라벨 자동 생략 끄기
                    minRotation: 0, // 라벨 회전 각도
                    maxRotation: 45,
                    fontColor: 'rgb(213,214,214)',
                    padding: 8, // 라벨과 차트 사이 여백
                },
                gridLines: {
                    drawBorder: false, // 축 기준선 끄기
                    drawTicks: false,  // 축 눈금 표시 끄기
                    tickMarkLength: 0, // 자투리 선 제거
                    color: 'rgba(255,255,255,0.15)',
                    lineWidth: 1,
                    borderDash: [4, 4],
                    zeroLineColor: 'rgba(255,255,255,0.15)',
                    zeroLineWidth: 1,
                    zeroLineBorderDash: [4, 4],
                },
            }],
            yAxes: [{
                display: true,
                ticks: {
                    beginAtZero: false, // 0 고정 해제
                    // min: 0,
                    // max: maxCount,
                    maxTicksLimit: 6,
                    fontColor: 'rgb(213,214,214)',
                    padding: 8, // 라벨과 차트 사이 여백
                },
                gridLines: {
                    drawBorder: false, // 축 기준선 끄기
                    drawTicks: false,
                    tickMarkLength: 0,
                    color: 'rgba(255,255,255,0.15)',
                    lineWidth: 1,
                    borderDash: [4, 4],
                    zeroLineColor: 'rgba(255,255,255,0.15)',
                    zeroLineWidth: 1,
                    zeroLineBorderDash: [4, 4],
                },
            }],
        },
    };

    return (
        <div style={{ width: '100%', height, marginBottom: '5px' }}>
            <Line data={data} options={options} />
        </div>
    );
};

export default LineChart;