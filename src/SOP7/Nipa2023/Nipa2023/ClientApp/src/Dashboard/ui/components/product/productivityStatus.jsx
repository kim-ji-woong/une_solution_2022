import React, { Component } from 'react';

import { ProductivityStatusComponent } from '../../../styled/dashboardStyled';
import GaugeChart from '../chart/gaugeChart';

class ProductivityStatus extends Component {

    getChartData = () => {
        const performances = this.props.performances;

        let chartData = 0;
        let chartColor = "rgba(37, 207, 217, 1)";
        let chartID = "achievementRateChart";

        if(!performances) {
            return chartData;
        }
        else {
            for(let performance of performances) {
				if(performance.id === 53) {		// 합계만 표출
					chartData = performance.product;
				}
            }

            return {chartData, chartColor, chartID};
        }
    }

    render() {
        const {chartData, chartColor, chartID} = this.getChartData();

        return (
            <ProductivityStatusComponent className='productivityStatus'>
                <h5>생산성 현황</h5>
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
            </ProductivityStatusComponent>
        );
    }
}

export default ProductivityStatus;