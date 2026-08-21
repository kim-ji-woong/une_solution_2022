import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { PerceptionView } from '../../styled/dashboardWonik';

import SDMSResource from '../../../SDMS/resource/id';

class PerceptionWonik extends Component {
    
    getPerceptionData = () => {
        const perceptionData = [];
        let total = 0;

        const todayAlarms = this.props.todayAlarms;

        for (let i = 0; i < todayAlarms?.length; i++) {
            const todayAlarm = todayAlarms[i];

            if (perceptionData[todayAlarm.facilityType]) {
                perceptionData[todayAlarm.facilityType].data2 += 1;
            } else {
                perceptionData[todayAlarm.facilityType] = {data1: SDMSResource.getFacilityTypeString(todayAlarm.facilityType), data2: 1};
            }

            total++;
        }
        
        return [perceptionData, total];
    }

    render() {
        const [perceptionData, total] =  this.getPerceptionData();

		return (
			<PerceptionView className="perception-area">
                <h1>감지항목별 알림현황({total}건)</h1>
				
                <div className='perception-area-wrap'>
                    {
                        perceptionData.map((data, index) => 
                            <div key={index} className='perception-area-content'>
                                <span>{data.data1}</span>
                                <span>{data.data2}</span>
                            </div>
                        )
                    }
                </div>
            </PerceptionView>
        );
    }
}

export default withRouter(PerceptionWonik);