import React, { Component } from 'react';

import { DailyStockComponent } from '../../../styled/dashboardStyled';
import DoughnutChart from '../chart/doughnutChart';

class DailyStock extends Component {
    
    getChart = () => {
        const buyDatas = this.props.buyDatas;
        const colors = this.props.colors;
        let labels = [];
        let datasets = [];
        let total = 0;

        if(!buyDatas) {
            return [];
        }
        else {
            for(let buyData of buyDatas) {
                datasets.push(buyData.incomeCount);
                labels.push(buyData.customer);

                total += buyData.incomeCount;
            }

            return [buyDatas, colors, labels, datasets, total];
        }
    }

    render() {
        const [buyDatas, colors, labels, datasets, total] = this.getChart();

        return (
            <DailyStockComponent className='dailyStock'>
                <h5>일일 입고 현황 (%)</h5>
                <div className='doughnutChartWrap'>
                    <DoughnutChart
                        allDatas={buyDatas}
                        colors={colors}
                        labels={labels}
                        datasets={datasets}
                        total={total}
                    />
                </div>
            </DailyStockComponent>
        );
    }
}

export default DailyStock;