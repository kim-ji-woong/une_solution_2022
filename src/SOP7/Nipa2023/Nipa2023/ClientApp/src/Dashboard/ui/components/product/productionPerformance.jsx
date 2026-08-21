import React, { Component } from 'react';

import { ProductionPerformanceComponent } from '../../../styled/dashboardStyled';
import GaugeChart from '../chart/gaugeChart';

class productionPerformance extends Component {

    getChartData = () => {
        const performances = this.props.performances;

        let chartData = 0;
        let chartColor = "rgba(1, 245, 226, 1)";
        let chartID = "productivityChart";

        if(!performances) {
            return chartData;
        }
        else {
            for(let performance of performances) {
				if(performance.id === 53) {		// 합계만 표출
					chartData = performance.performanceRate;
				}
            }

            return {chartData, chartColor, chartID};
        }
    }

    render() {
        const {chartData, chartColor, chartID} = this.getChartData();

        return (
            <ProductionPerformanceComponent className='productionPerformance'>
                <h5>생산 계획대비 실적 현황</h5>
                <div className='gaugeChartWrap'>
                    <GaugeChart
                        chartData={chartData}
                        chartColor={chartColor}
                        chartID={chartID}
                    />
                    <div className='chartLabel'>
                        <span>0</span>
                        <span>100 (%)</span>
                    </div>
				</div>
                <div className='valueWrap'>
                    <p>{`${chartData} %`}</p>
                </div>
            </ProductionPerformanceComponent>
        );
    }
}

export default productionPerformance;