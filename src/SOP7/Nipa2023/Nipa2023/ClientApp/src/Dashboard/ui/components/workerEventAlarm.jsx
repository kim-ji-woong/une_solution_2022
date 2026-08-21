import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import WorkerEventAlarmChart from './workerEventAlarmChart';

import { WorkerEventAlarmComponent } from '../../styled/dashboardStyled';

import { UserDispatch } from '../../../Root/resource/userDispatch';
import SdmsResource from '../../../SDMS/resource/id';

class WorkerEventAlarm extends Component {
    static contextType = UserDispatch;

    constructor(props) {
        super(props);
		
		this.state = {
        }

		this.props = props;
	}

    getDisplayData = () => {
        let displayData = [];

        const { alarm } = this.context;
        const alarms = alarm[0].alarmState;

        if(alarms) {
            const workerTagAlarmDatas = alarms['workerTagAlarmDatas'];

            let emergencyCall = 0, fall = 0, equipmentTightening = 0, pairTwo = 0, batteryChange = 0;
            
            if(workerTagAlarmDatas.length !== 0) {

                for(let i = 0; i < workerTagAlarmDatas.length; i++){
                    const data = workerTagAlarmDatas[i];

                    if(data.facilityType === SdmsResource.facilityType.WORKER && data.materialType === SdmsResource.facilityType.EMERGENCY_CALL){
                        emergencyCall += 1;
                    }
                    else if(data.facilityType === SdmsResource.facilityType.WORKER && data.materialType === SdmsResource.facilityType.FALL)
                    {
                        fall += 1
                    }
                    else if(data.facilityType === SdmsResource.facilityType.WORKER && data.materialType === SdmsResource.facilityType.EQUIPMENT_TIGHTENING){
                        equipmentTightening += 1
                    }
                    else if(data.facilityType === SdmsResource.facilityType.WORKER && data.materialType === SdmsResource.facilityType.PAIR_TWO){
                        pairTwo += 1
                    }
                    else if(data.facilityType === SdmsResource.facilityType.WORKER && data.materialType === SdmsResource.facilityType.BATTERY_CHANGE){
                        batteryChange += 1
                    }
                }
            }

            displayData.push(
                { index: 1, title: ((SdmsResource.ID.sensor.emergencyCall).slice(4)).slice(0, -1), data: emergencyCall },
                { index: 2, title: ((SdmsResource.ID.sensor.fall).slice(4)).slice(0, -1), data: fall },
                { index: 3, title: ((SdmsResource.ID.sensor.equipmentTightening).slice(4)).slice(0, -1), data: equipmentTightening },
                { index: 4, title: ((SdmsResource.ID.sensor.pairTwo).slice(4)).slice(0, -1), data: pairTwo },
                { index: 5, title: ((SdmsResource.ID.sensor.batteryChange).slice(4)).slice(0, -1), data: batteryChange },
            );
        }

        return displayData;
    }

    render() {
        const displayData = this.getDisplayData();

        return (
            <WorkerEventAlarmComponent className="workerEventAlarm">
                <h1>작업자 이벤트 알람</h1>
                <div className='content'>
                    <div className='chartWrap'>
                        <WorkerEventAlarmChart operationData={displayData} />
                    </div>

                    <div className='listWrap'>
                        <ul>
                            {
                                displayData.map((data) => (
                                    <li key={data.index}>
                                        <span>{data.title}</span>
                                        <div>
                                            <span>{data.data}</span>
                                            <span>건</span>
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </WorkerEventAlarmComponent>
        )
    }
}

export default withRouter(WorkerEventAlarm);