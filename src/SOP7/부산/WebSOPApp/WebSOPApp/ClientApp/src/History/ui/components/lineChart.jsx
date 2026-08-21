import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const LineChart = (props) => {

    useEffect(() => {
        // console.log(props.data);
    }, [])

    const options = {
        //responsive: false, // 컨테이너가 수행 할 때 차트 캔버스의 크기를 조정(dafalut : true)
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
                    categoryPercentage: 0.7,
                    scaleLabel: {
                        display: true,
                        fontColor: "#fff",
                        fontFamily: 'Pretendard',
                    },
                    ticks: {
                        beginAtZero: true,
                        //maxTicksLimit: 50,              // 표시할 최대 눈금 수
                        //color: "rgb(190,190,190)",
                        fontFamily: 'Pretendard',
                        fontColor: "#fff",             //라벨 텍스트 컬러
                        fontSize: 11,                     // 눈금 텍스트 사이즈
                        //beginAtZero: true,              // 0부터 시작
                        borderDash: [2, 2],
                        borderDashOffset: 2,
                        maxTicksLimit: 4,
                        maxRotation: 0,
                    },
                    gridLines: {
                        color: "#fff",           // 눈금 라인 컬러
                        lineWidth: 1,
                        borderDash: [2, 2],
                        borderDashOffset: 2,
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
                        stepSize: 50,
                        //maxTicksLimit: 40,
                        min: 0,
                        // max: 100,
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

    const data = props.data;

    return <Line options={options} data={data} style={{ display: 'block', width: '490px', height: '270px' }} />;
};

export default LineChart;