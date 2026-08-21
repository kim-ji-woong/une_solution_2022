import React, { Component } from 'react';

import { MesProductComponent } from '../../styled/dashboardStyled';

import ProductionPerformance from './product/productionPerformance';
import ProductivityStatus from './product/productivityStatus';
import AchievementRateLine from './product/achievementRateLine';
import ProductivityRateLine from './product/productivityRateLine';
import FacilityOperationRate from './product/facilityOperationRate';

class MesProduct extends Component {
    constructor(props) {
        super(props);
		
		this.state = {
        }

		this.props = props;
	}

    render() {

        return (
            <MesProductComponent>

                {/* 생산 계획대비 실적 현황 */}
                <ProductionPerformance
                    performances={this.props.productDatas['performances']}
                />

                {/* 생산성 현황 */}
                <ProductivityStatus
                    performances={this.props.productDatas['performances']}
                />

                {/* 라인별 달성률 */}
                <AchievementRateLine
                    performances={this.props.productDatas['performances']}
                />

                {/* 라인별 생산성 현황 */}
                <ProductivityRateLine 
                    performances={this.props.productDatas['performances']}
                />

                {/* 설비 가동률 현황 */}
                <FacilityOperationRate
                    run={this.props.productDatas['run']}
                />
                
            </MesProductComponent>
        );
    }
}

export default MesProduct;