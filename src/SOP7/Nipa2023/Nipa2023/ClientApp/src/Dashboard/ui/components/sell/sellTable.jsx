import React, { Component } from 'react';

import { SellTableComponent } from '../../../styled/dashboardStyled';

class SellTable extends Component {
    constructor(props) {
		super(props);

		this.state = {
			showTooltip: false,
            tooltipTop: 0,
            tooltipLeft: 0,
            tooltipContent: '',
		}
	}

    handleTooltip = (e, customer) => {
        const target = e.target;
        const parent = e.target.parentElement;

        const parentNode = parent.getBoundingClientRect();
        const targetNode = target.getBoundingClientRect();

        // span.width > li.width &&
        if(targetNode.width > parentNode.width) {

            this.setState({
                showTooltip: !this.state.showTooltip,
                tooltipTop: parentNode.top + 40,
                tooltipLeft: parentNode.left,
                tooltipContent: customer
            });
        }
    }

    getDisplayView = () => {
        const sellDatas = this.props.sellDatas;
        const displayView = [];

        let totalYesterdayCount = 0;
        let totalYesterdayMoney = 0
        let totalTodayCount = 0;
        let totalTodayMoney = 0;
        let totalMonthlyCount = 0;
        let totalMonthlyMoney = 0;

        let bodyHeight = 0;

        if(!sellDatas) {
            return displayView;
        }
        else {
            let index = 1;
            for(let i = 0; i < sellDatas.length; i++){
                const sellData = sellDatas[i];

                totalYesterdayCount += sellData.yesterdayCount;
                totalYesterdayMoney += sellData.yesterdayMoney;
                totalTodayCount += sellData.todayCount;
                totalTodayMoney += sellData.todayMoney;
                totalMonthlyCount += sellData.monthlyCount;
                totalMonthlyMoney += sellData.monthlyMoney;

                let yesterdayCount = sellData.yesterdayCount.toLocaleString();
                let yesterdayMoney = sellData.yesterdayMoney.toLocaleString();
                let todayCount = sellData.todayCount.toLocaleString();
                let todayMoney = sellData.todayMoney.toLocaleString();
                let monthlyCount = sellData.monthlyCount.toLocaleString();
                let monthlyMoney = sellData.monthlyMoney.toLocaleString();

                displayView.push(
                    <li key={'sellData_' + index}>
                        <ul className='bodyContent'>
                            <li className='bodyText'>{index}</li>
                            <li className='bodyText'>
                                <span 
                                    onMouseOver={(e) => this.handleTooltip(e, sellData.customer)}
                                    onMouseLeave={() => this.setState({ showTooltip: false })}
                                >
                                    {sellData.customer}
                                </span>
                            </li>
                            <li className='bodyText'>
                                <span
                                    onMouseOver={(e) => this.handleTooltip(e, yesterdayCount)}
                                    onMouseLeave={() => this.setState({ showTooltip: false })}
                                >
                                    {yesterdayCount === '0' ? '-' : yesterdayCount}
                                </span>
                            </li>
                            <li className='bodyText'>
                                <span
                                    onMouseOver={(e) => this.handleTooltip(e, yesterdayMoney)}
                                    onMouseLeave={() => this.setState({ showTooltip: false })}
                                >
                                    {yesterdayMoney === '0' ? '-' : yesterdayMoney}
                                </span>
                            </li>
                            <li className='bodyText'>
                                <span
                                    onMouseOver={(e) => this.handleTooltip(e, todayCount)}
                                    onMouseLeave={() => this.setState({ showTooltip: false })}
                                >
                                    {todayCount === '0' ? '-' : todayCount}
                                </span>
                            </li>
                            <li className='bodyText'>
                                <span
                                    onMouseOver={(e) => this.handleTooltip(e, todayMoney)}
                                    onMouseLeave={() => this.setState({ showTooltip: false })}
                                >
                                    {todayMoney === '0' ? '-' : todayMoney}
                                </span>
                            </li>
                            <li className='bodyText'>
                                <span
                                    onMouseOver={(e) => this.handleTooltip(e, monthlyCount)}
                                    onMouseLeave={() => this.setState({ showTooltip: false })}
                                >
                                    {monthlyCount === '0' ? '-' : monthlyCount}
                                </span>
                            </li>
                            <li className='bodyText'>
                                <span
                                    onMouseOver={(e) => this.handleTooltip(e, monthlyMoney)}
                                    onMouseLeave={() => this.setState({ showTooltip: false })}
                                >
                                    {monthlyMoney === '0' ? '-' : monthlyMoney}
                                </span>
                            </li>
                        </ul>
                    </li>
                );
                index++;
            }

            bodyHeight = sellDatas.length;
            
            return [displayView, totalYesterdayCount, totalYesterdayMoney, totalTodayCount, totalTodayMoney, totalMonthlyCount, totalMonthlyMoney, bodyHeight];
        }
    }

    render() {
        const {showTooltip, tooltipTop, tooltipLeft, tooltipContent} = this.state;

        const [displayView, totalYesterdayCount, totalYesterdayMoney, totalTodayCount, totalTodayMoney, totalMonthlyCount, totalMonthlyMoney, bodyHeight] = this.getDisplayView();

        return (
            <SellTableComponent className='sellTable' $bodyHeight={bodyHeight}>
                {
                    showTooltip &&
                    <div id='tooltip-area' style={{ top: tooltipTop, left: tooltipLeft }}>
                        {tooltipContent}
                    </div>
                }
                <ul className='head'>
                    <li>NO</li>
                    <li>거래처</li>
                    <li>전일수량</li>
                    <li>전일금액</li>
                    <li>당일수량</li>
                    <li>당일금액</li>
                    <li>월간수량</li>
                    <li>월간금액</li>
                </ul>
                <ul className='body'>
                    {displayView}
                </ul>
                <ul className='total'>
                    <li>TOTAL</li>
                    <li>
                        <span
                            onMouseOver={(e) => this.handleTooltip(e, Number(bodyHeight).toLocaleString())}
                            onMouseLeave={() => this.setState({ showTooltip: false })}
                        >
                            {Number(bodyHeight).toLocaleString()}
                        </span>
                    </li>
                    <li>
                        <span
                            onMouseOver={(e) => this.handleTooltip(e, Number(totalYesterdayCount).toLocaleString())}
                            onMouseLeave={() => this.setState({ showTooltip: false })}
                        >
                            {Number(totalYesterdayCount).toLocaleString()}
                        </span>
                    </li>
                    <li>
                        <span
                            onMouseOver={(e) => this.handleTooltip(e, Number(totalYesterdayMoney).toLocaleString())}
                            onMouseLeave={() => this.setState({ showTooltip: false })}
                        >
                            {Number(totalYesterdayMoney).toLocaleString()}
                        </span>
                    </li>
                    <li>
                        <span
                            onMouseOver={(e) => this.handleTooltip(e, Number(totalTodayCount).toLocaleString())}
                            onMouseLeave={() => this.setState({ showTooltip: false })}
                        >
                            {Number(totalTodayCount).toLocaleString()}
                        </span>
                    </li>
                    <li>
                        <span
                            onMouseOver={(e) => this.handleTooltip(e, Number(totalTodayMoney).toLocaleString())}
                            onMouseLeave={() => this.setState({ showTooltip: false })}
                        >
                            {Number(totalTodayMoney).toLocaleString()}
                        </span>
                    </li>
                    <li>
                        <span
                            onMouseOver={(e) => this.handleTooltip(e, Number(totalMonthlyCount).toLocaleString())}
                            onMouseLeave={() => this.setState({ showTooltip: false })}
                        >
                            {Number(totalMonthlyCount).toLocaleString()}
                        </span>
                    </li>
                    <li>
                        <span
                            onMouseOver={(e) => this.handleTooltip(e, Number(totalMonthlyMoney).toLocaleString())}
                            onMouseLeave={() => this.setState({ showTooltip: false })}
                        >
                            {Number(totalMonthlyMoney).toLocaleString()}
                        </span>
                    </li>
                </ul>
            </SellTableComponent>
        );
    }
}

export default SellTable;