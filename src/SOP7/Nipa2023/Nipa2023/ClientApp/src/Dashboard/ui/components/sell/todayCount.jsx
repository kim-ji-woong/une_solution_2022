import React, { Component } from 'react';

import { TodayCountComponent } from '../../../styled/dashboardStyled';
import DoughnutChart from '../chart/doughnutChart';

class TodayCount extends Component {
    
    getChart = () => {
        const sellDatas = this.props.sellDatas;
        const colors = this.props.colors;
        let labels = [];
        let datasets = [];
        let total = 0;

        if(!sellDatas) {
            return [];
        }
        else {
            for(let sellData of sellDatas) {
                datasets.push(sellData.todayCount);
                labels.push(sellData.customer);

                total += sellData.todayCount;
            }

            return [sellDatas, colors, labels, datasets, total];
        }
    }

    render() {

        const [sellDatas, colors, labels, datasets, total] = this.getChart();

        return (
            <TodayCountComponent className='todayCount'>
                <h5>당일 수량별 현황 (%)</h5>
                <div className='doughnutChartWrap'>
                    <DoughnutChart
                        allDatas={sellDatas}
                        colors={colors}
                        labels={labels}
                        datasets={datasets}
                        total={total}
                    />
                </div>
            </TodayCountComponent>
        );
    }
}

export default TodayCount;