import React, { Component } from 'react';

import { MesQualityComponent } from '../../styled/dashboardStyled';

import ProcessDefect from './quality/processDefect';
import DefectItem from './quality/defectItem';
import MonthDefect from './quality/monthDefect';
import MonthProcessDefect from './quality/monthProcessDefect';

class MesQuality extends Component {
    constructor(props) {
        super(props);
		
		this.state = {
        }

		this.props = props;
	}

    render() {
        
        return (
            <MesQualityComponent>

                {/* 공정별 불량 현황 */}
                <ProcessDefect
                    ngs={this.props.qualityDatas['ngs']}
                    colors={this.props.colors}
                />

                {/* 불량 항목별 현황 */}
                <DefectItem
                    ngCategories={this.props.qualityDatas['ngCategories']}
                    colors={this.props.colors}
                />

                {/* 당월 불량 현황 */}
                <MonthDefect
                    ngs={this.props.qualityDatas['ngs']}
                />

                {/* 당월 공정별 불량 현황 */}
                <MonthProcessDefect
                    ngs={this.props.qualityDatas['ngs']}
                />
                
            </MesQualityComponent>
        );
    }
}

export default MesQuality;