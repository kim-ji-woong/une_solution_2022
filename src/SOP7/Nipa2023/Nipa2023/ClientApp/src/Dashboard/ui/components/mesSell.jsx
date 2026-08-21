import React, { Component } from 'react';

import { MesSellComponent } from '../../styled/dashboardStyled';

import TodayMoney from './sell/todayMoney';
import TodayCount from './sell/todayCount';
import SellTable from './sell/sellTable';

class MesSell extends Component {
    constructor(props) {
        super(props);
		
		this.state = {
        }

		this.props = props;
	}

    render() {

        return (
            <MesSellComponent>

                {/* 당일 금액별 현황 */}
                <TodayMoney
                    sellDatas={this.props.sellDatas['sellDashboards']}
                    colors={this.props.colors}
                />

                {/* 당일 수량별 현황 */}
                <TodayCount
                    sellDatas={this.props.sellDatas['sellDashboards']}
                    colors={this.props.colors}
                />

                {/* 하단 테이블 */}
                <SellTable
                    sellDatas={this.props.sellDatas['sellDashboards']}
                />
                
            </MesSellComponent>
        );
    }
}

export default MesSell;