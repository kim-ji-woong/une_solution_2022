import React, { Component } from 'react';

import { FacilityOperationRateComponent } from '../../../styled/dashboardStyled';
import GaugeChart from '../chart/gaugeChart';

class FacilityOperationRate extends Component {

    getGaugeChartData = () => {
        const run = this.props.run;

        let chartData = 0;
        let chartColor = "rgba(60, 185, 253, 1)";
        let chartID = "facilityOperationChart";

        if(!run) {
            return chartData;
        }
        else {
            chartData = run.runPercentage;
            return {chartData, chartColor, chartID};
        }
    }

    getBarChartData = () => {
        const run = this.props.run;
        let barChart = [];

        if(!run) {
            return barChart;
        }
        else {
            barChart.push(
                <ul className='barChartArea' key='barChart'>
                    <li key='run_totalCount'>
                        <div className='description'>
                            <span>대수</span>
                            <span>{run.totalCount}</span>
                        </div>
                        <div className='barChart'>
                            <span>차트</span>
                            <span className='chart' style={{ width: `${run.totalCount > 100 ? '100' : run.totalCount}%` }}>차트</span>
                        </div>
                    </li>
                    <li key='run_notRun'>
                        <div className='description'>
                            <span>비가동</span>
                            <span>{run.notRun}</span>
                        </div>
                        <div className='barChart'>
                            <span>차트</span>
                            <span className='chart' style={{ width: `${run.notRun > 100 ? '100' : run.notRun}%` }}>차트</span>
                        </div>
                    </li>
                    <li key='run_runCount'>
                        <div className='description'>
                            <span>가동</span>
                            <span>{run.runCount}</span>
                        </div>
                        <div className='barChart'>
                            <span>차트</span>
                            <span className='chart' style={{ width: `${run.runCount > 100 ? '100' : run.runCount}%` }}>차트</span>
                        </div>
                    </li>
                    <li key='run_ready'>
                        <div className='description'>
                            <span>준비</span>
                            <span>{run.ready}</span>
                        </div>
                        <div className='barChart'>
                            <span>차트</span>
                            <span className='chart' style={{ width: `${run.ready > 100 ? '100' : run.ready}%` }}>차트</span>
                        </div>
                    </li>
                    <li key='run_noPlan'>
                        <div className='description'>
                            <span>계획없음</span>
                            <span>{run.noPlan}</span>
                        </div>
                        <div className='barChart'>
                            <span>차트</span>
                            <span className='chart' style={{ width: `${run.noPlan > 100 ? '100' : run.noPlan}%` }}>차트</span>
                        </div>
                    </li>
                </ul>
            );

            return barChart;
        }
    }

    render() {
        const {chartData, chartColor, chartID} = this.getGaugeChartData();
        const barChart = this.getBarChartData();

        return (
            <FacilityOperationRateComponent className='facilityOperationRate'>
                <h5>설비 가동률 현황</h5>
                <div>
                    <div className='gaugechartArea'>
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
                    </div>
                    {barChart}
                </div>
            </FacilityOperationRateComponent>
        );
    }
}

export default FacilityOperationRate;