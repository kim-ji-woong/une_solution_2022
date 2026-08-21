import React, { Component } from 'react';

import { Chart } from "chart.js";
import "chartjs-gauge";

class GaugeChart extends Component {
    constructor(props) {
		super(props);
	}

    componentDidMount() {
        this.getChartData();
    }

    componentDidUpdate() {
        this.getChartData();
    }

    getChartData = () => {
        let chartData = this.props.chartData;
        let chartColor = this.props.chartColor;
        let chartID = this.props.chartID;

        if(chartData) {
            let config = {
                type: "gauge",
                data: {
                    datasets: [
                        {
                            data: [chartData, 100],
                            value: chartData,
                            minValue: 0,
                            backgroundColor: [chartColor, "#3B4248"],
                            borderWidth: 0,
                        },
                    ],
                },
                options: {
                    responsive: false,
                    aspectRatio: 1,
                    cutoutPercentage: 65, // 도넛 굵기
                    tooltips: {
                        enabled: false,
                    },
                    legend: {
                        display: false,
                    },
                    animation: {
                        duration: 500,
                    },
                    hover: {
                        mode: null
                    },
                    needle: {
                        radiusPercentage: 2,
                        widthPercentage: 4,
                        lengthPercentage: 0.5,
                        color: chartColor,
                    },
                    valueLabel: {
                        display: false
                    }
                },
            };

            let element = document.getElementById(chartID);
            
            if(element) {
                let ctx = element.getContext("2d");
                const myGauge = new Chart(ctx, config);
                myGauge.update();
            }

            return chartID;
        }
    }

    render() {

        return (
            <canvas id={this.props.chartID} width={320} height={180} />
        );
    }
}

export default GaugeChart;