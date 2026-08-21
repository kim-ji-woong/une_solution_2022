import React, { Component } from 'react';

import SDMSResource from '../../resource/id';

import { EquipmentEventAlarmComponent } from '../../styled/sdmsPopupsStyled';

class EquipmentEventAlarm extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }

        this.props = props;
    }

    getDisplayView = () => {
        const alarmData = this.props.alarmData;
        let displayView = [];

        if(alarmData){

            // 상황유형
            let alarmType = '';
            if (alarmData.facilityType === SDMSResource.facilityType.FIRE) {
                alarmType = SDMSResource.ID.sensor.fire;
            }
            else if (alarmData.facilityType === SDMSResource.facilityType.ATMOSPHERE) {
                alarmType = SDMSResource.ID.sensor.atmosphere;
            }
            else if (alarmData.facilityType === SDMSResource.facilityType.EMERGENCYBELL) {
                alarmType = SDMSResource.ID.sensor.emergencyBell;
            }
            else if (alarmData.facilityType === SDMSResource.facilityType.THERMAL_CAMERA) {
                alarmType = SDMSResource.ID.sensor.thermalCamera;
            }
            else if (alarmData.facilityType === SDMSResource.facilityType.GAS) {
                alarmType = SDMSResource.ID.sensor.gas;
            }
            else if (alarmData.facilityType === SDMSResource.facilityType.WORKER && alarmData.materialType === SDMSResource.facilityType.EMERGENCY_CALL) {
                alarmType = SDMSResource.ID.sensor.emergencyCall;
            }
            else if (alarmData.facilityType === SDMSResource.facilityType.WORKER && alarmData.materialType === SDMSResource.facilityType.FALL) {
                alarmType = SDMSResource.ID.sensor.fall;
            }
            else if (alarmData.facilityType === SDMSResource.facilityType.WORKER && alarmData.materialType === SDMSResource.facilityType.EQUIPMENT_TIGHTENING) {
                alarmType = SDMSResource.ID.sensor.equipmentTightening;
            }
            else if (alarmData.facilityType === SDMSResource.facilityType.WORKER && alarmData.materialType === SDMSResource.facilityType.PAIR_TWO) {
                alarmType = SDMSResource.ID.sensor.pairTwo;
            }
            else if (alarmData.facilityType === SDMSResource.facilityType.WORKER && alarmData.materialType === SDMSResource.facilityType.BATTERY_CHANGE) {
                alarmType = SDMSResource.ID.sensor.batteryChange;
            }
            else if (alarmData.facilityType === SDMSResource.facilityType.EQUIPMENT) {
                alarmType = SDMSResource.ID.sensor.equipment;
            }

            let [ymd, hms] = SDMSResource.getDate(new Date(alarmData.eventTime));

            displayView.push(
                <ul>
                    <li>{alarmData.positionName}</li>
                    <li>{ymd + ' ' + hms}</li>
                    <li>{alarmType}</li>
                </ul>
            );

            return displayView;
        }
    }

    render() {
        const displayView = this.getDisplayView();

        return (
            <EquipmentEventAlarmComponent id={this.props.popupType} className='UI_Section equipmentEventAlarm' style={{ zIndex: 1 }}>
                <div className={'dslTop'}>
                    <h5 className={'dslTitle'} >
                        이벤트 발생
                    </h5>
                    <div className={'dslX'} onClick={() => this.props.handleAlarmPopup(false)}>
                        <a href="#none">닫기버튼</a>
                    </div>
                </div>

                <div className='dslCont'>
                    {displayView}
                </div>
            </EquipmentEventAlarmComponent>
        );
    }
}

export default EquipmentEventAlarm;