import React, { Component } from 'react';

import { TodayMoneyComponent } from '../../../styled/dashboardStyled';
import DoughnutChart from '../chart/doughnutChart';

class TodayMoney extends Component {

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
                datasets.push(sellData.todayMoney);
                labels.push(sellData.customer);

                total += sellData.todayMoney;
            }

            return [sellDatas, colors, labels, datasets, total];
        }
    }

    render() {

        const [sellDatas, colors, labels, datasets, total] = this.getChart();

        return (
            <TodayMoneyComponent className='todayMoney'>
                <h5>당일 금액별 현황 (%)</h5>
                <div className='doughnutChartWrap'>
                    <DoughnutChart
                        allDatas={sellDatas}
                        colors={colors}
                        labels={labels}
                        datasets={datasets}
                        total={total}
                    />
                </div>
            </TodayMoneyComponent>
        );
    }
}

export default TodayMoney;