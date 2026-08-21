import React, { Component } from 'react';

import { MesBuyComponent } from '../../styled/dashboardStyled';

import DailyStock from './buy/dailyStock';
import OrderStock from './buy/orderStock';
import BuyTable from './buy/buyTable';

class MesBuy extends Component {
    constructor(props) {
        super(props);
		
		this.state = {
        }

		this.props = props;
	}

    render() {

        // console.log(this.props.buyDatas);
        
        return (
            <MesBuyComponent>
                
                {/* 일일 입고 현황 */}
                <DailyStock
                    buyDatas={this.props.buyDatas['buyDashboards']}
                    colors={this.props.colors}
                />

                {/* 발주 대비 입고량 */}
                <OrderStock
                    buyDatas={this.props.buyDatas['buyDashboards']}
                />

                {/* 하단 테이블 */}
                <BuyTable
                    buyDatas={this.props.buyDatas['buyDashboards']}
                />

            </MesBuyComponent>
        );
    }
}

export default MesBuy;