import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { SensorView } from '../../styled/dashboardWonik';

import SDMSResource from '../../../SDMS/resource/id';
import ProjectResource from '../../../Root/resource/id';

class SensorWonik extends Component {
    constructor(props) {
        super(props);

        this.state = {
            alarmCount: [],         // key: facilityType, value: 알람 갯수
            alarmUpDown: [],        // key: facilityType, value: 0~2 (0: -, 1: 증가, 2: 감소)
        }

        this.props = props;

        this.isInit = true;

        this.alarmState();
    }

    alarmState() {
        const alarmCount = this.state.alarmCount;
        const alarmUpDown = this.state.alarmUpDown;

        const alarmCount_new = [];
        const alarmUpDown_new = [];

        const todayAlarms = this.props.todayAlarms;

        if (todayAlarms?.length > 0) {
            for (let i = 0; i < todayAlarms.length; i++) {
                const todayAlarm = todayAlarms[i];

                if (todayAlarm.isAlarm !== true)
                    continue;

                let facilityType = todayAlarm.facilityType;

                // CCTV 경우 알람 타입 처리
                if (facilityType === SDMSResource.facilityType.Intrusion_S1 ||
                    facilityType === SDMSResource.facilityType.Loiter_S1 ||
                    facilityType === SDMSResource.facilityType.Collapse_S1 ||
                    facilityType === SDMSResource.facilityType.Theft_S1 ||
                    facilityType === SDMSResource.facilityType.Neglect_S1 ||
                    facilityType === SDMSResource.facilityType.VirtualFence_S1 ||
                    facilityType === SDMSResource.facilityType.Fire_S1) {
                    facilityType = SDMSResource.facilityType.Intrusion_S1;
                }
                else if (facilityType === SDMSResource.facilityType.Becon_Stay ||
                    facilityType === SDMSResource.facilityType.Becon_SOS) {
                    facilityType = SDMSResource.facilityType.Becon_Stay;
                }
                // .TODO: 환경, 제조설비 또한 타입 처리 필요


                if (alarmCount_new[facilityType]) {
                    alarmCount_new[facilityType] = alarmCount_new[facilityType] + 1;
                } else {
                    alarmCount_new[facilityType] = 1;
                }
            }
        }


        for (const key in alarmCount_new) {
            if (alarmCount[key]) {
                let count_new = alarmCount_new[key];
                let count = alarmCount[key];
                if (!count)
                    count = 0;

                if (count_new > count)
                    alarmUpDown_new[key] = 1;
                else if (count_new < count)
                    alarmUpDown_new[key] = 2;
                else 
                    alarmUpDown_new[key] = 0;
            } else {
                alarmUpDown_new[key] = 1;
            }
        }
        
        if (this.isInit) {
            this.isInit = false;
            this.state.alarmCount = alarmCount_new;
            this.state.alarmUpDown = alarmUpDown_new;
            return;
        } 

        this.setState({alarmCount: alarmCount_new, alarmUpDown: alarmUpDown_new});    
    }

    componentDidUpdate(prevProps, prevState) {
        // 알람 체크
        this.CheckChangeAlarm(this.props.todayAlarms, prevProps.todayAlarms);

    }

    CheckChangeAlarm = (newAlarms, oldAlarms) => {
        let checkChange = false;
    
        if (newAlarms?.length !== oldAlarms?.length) {
            checkChange = true;
        } else if (newAlarms && oldAlarms && newAlarms.length === oldAlarms.length 
            && newAlarms.length > 0 && oldAlarms.length > 0) {
            for (let i = 0; i < newAlarms.length; i++) {
                let chk = false;
                let newAlarm = newAlarms[i];

                for (let j = 0; j < oldAlarms.length; j++) {
                    let oldAlarm = oldAlarms[j];

                    if (newAlarm.sensorZoneID === oldAlarm.sensorZoneID &&
                        newAlarm.time === oldAlarm.time && newAlarm.isAlarm === oldAlarm.isAlarm) {
                        chk = true;
                        break;
                    }
                }   

                if (chk === false) {
                    checkChange = true; 
                    break;
                }          
            }
        }

        if (checkChange)
            this.alarmState();
    }

    getDisplayAlarm = () => {
        const todayAlarms = this.props.todayAlarms;

        let fireAlarmCount = 0;
        let psmAlarmCount = 0;
        let cctvAlarmCount = 0;
        let environAlarmCount = 0;
        let beconAlarmCount = 0;

        if (todayAlarms?.length > 0) {
            for (let i = 0; i < todayAlarms.length; i++) {
                const todayAlarm = todayAlarms[i];

                if (todayAlarm.facilityType === SDMSResource.facilityType.FIRE) {
                    fireAlarmCount++;
                } else if (todayAlarm.facilityType === SDMSResource.facilityType.PSM_SENSOR) {
                    psmAlarmCount++;
                } else if (todayAlarm.facilityType === SDMSResource.facilityType.Intrusion_S1 ||
                    todayAlarm.facilityType === SDMSResource.facilityType.Loiter_S1 ||
                    todayAlarm.facilityType === SDMSResource.facilityType.Collapse_S1 ||
                    todayAlarm.facilityType === SDMSResource.facilityType.Theft_S1 ||
                    todayAlarm.facilityType === SDMSResource.facilityType.Neglect_S1 ||
                    todayAlarm.facilityType === SDMSResource.facilityType.VirtualFence_S1 ||
                    todayAlarm.facilityType === SDMSResource.facilityType.Fire_S1) {
                    cctvAlarmCount++;
                } else if (todayAlarm.facilityType === SDMSResource.facilityType.Becon_Stay ||
                    todayAlarm.facilityType === SDMSResource.facilityType.Becon_SOS) {
                    beconAlarmCount++;
                } 
            }
        }

        return [fireAlarmCount, psmAlarmCount, cctvAlarmCount, environAlarmCount, beconAlarmCount];
    }

    getDisplaySensorView = () => {
        let displaySensorView = [];

        const siteID = ProjectResource.SiteID;
        const useSensorTypes = this.props.useSensorTypes;

        const alarmCount = this.state.alarmCount;
        const alarmUpDown = this.state.alarmUpDown;

        if (useSensorTypes?.UseFire === true) {
            let count = 0;
            let upDown = 0;

            let upDownClass = "sensor-area-content same";

            if (alarmCount) {
                count = alarmCount[SDMSResource.facilityType.FIRE];
                if (!count)
                    count = 0;
            }
            if (alarmUpDown) {
                upDown = alarmUpDown[SDMSResource.facilityType.FIRE];
                if (!upDown)
                    upDown = 0;
            }

            if (upDown === 1) {
                upDownClass = "sensor-area-content up";
            } else if (upDown === 2) {
                upDownClass = "sensor-area-content down";
            }

            displaySensorView.push(
                <div key={"fire_" + count} className={upDownClass}>
                    <span>화재</span>
                    <span>{count}건</span>
                </div>);
        }

        if (useSensorTypes?.UsePSM === true) {
            let count = 0;
            let upDown = 0;

            let upDownClass = "sensor-area-content same";

            if (alarmCount) {
                count = alarmCount[SDMSResource.facilityType.PSM_SENSOR];
                if (!count)
                    count = 0;
            }
            if (alarmUpDown) {
                upDown = alarmUpDown[SDMSResource.facilityType.PSM_SENSOR];
                if (!upDown)
                    upDown = 0;
            }

            if (upDown === 1) {
                upDownClass = "sensor-area-content up";
            } else if (upDown === 2) {
                upDownClass = "sensor-area-content down";
            }

            displaySensorView.push(
                <div key={"psm_" + count} className={upDownClass}>
                    <span>가스</span>
                    <span>{count}건</span>
                </div>);
        }




        if (useSensorTypes?.UseEnvironment === true) {
            let count = 0;
            let upDown = 0;

            let upDownClass = "sensor-area-content same";

            if (alarmCount) {
                count = alarmCount[SDMSResource.facilityType.Environment];
                if (!count)
                    count = 0;
            }
            if (alarmUpDown) {
                upDown = alarmUpDown[SDMSResource.facilityType.Environment];
                if (!upDown)
                    upDown = 0;
            }

            if (upDown === 1) {
                upDownClass = "sensor-area-content up";
            } else if (upDown === 2) {
                upDownClass = "sensor-area-content down";
            }

            displaySensorView.push(
                <div key={"environment_" + count} className={upDownClass}>
                    <span>환경</span>
                    <span>{count}건</span>
                </div>);
        }


        if (useSensorTypes?.UseManufacture === true) {
            let count = 0;
            let upDown = 0;

            let upDownClass = "sensor-area-content same";

            if (alarmCount) {
                count = alarmCount[SDMSResource.facilityType.Manufacture];
                if (!count)
                    count = 0;
            }
            if (alarmUpDown) {
                upDown = alarmUpDown[SDMSResource.facilityType.Manufacture];
                if (!upDown)
                    upDown = 0;
            }

            if (upDown === 1) {
                upDownClass = "sensor-area-content up";
            } else if (upDown === 2) {
                upDownClass = "sensor-area-content down";
            }

            displaySensorView.push(
                <div key={"manufacture_" + count} className={upDownClass}>
                    <span>제조설비</span>
                    <span>{count}건</span>
                </div>);
        }






        if (useSensorTypes?.UseSVMS === true) {
            let count = 0;
            let upDown = 0;

            let upDownClass = "sensor-area-content same";

            if (alarmCount) {
                count = alarmCount[SDMSResource.facilityType.Intrusion_S1];
                if (!count)
                    count = 0;
            }
            if (alarmUpDown) {
                upDown = alarmUpDown[SDMSResource.facilityType.Intrusion_S1];
                if (!upDown)
                    upDown = 0;
            }

            if (upDown === 1) {
                upDownClass = "sensor-area-content up";
            } else if (upDown === 2) {
                upDownClass = "sensor-area-content down";
            }

            displaySensorView.push(
                <div key={"cctv_" + count} className={upDownClass}>
                    <span>CCTV</span>
                    <span>{count}건</span>
                </div>);
        }

        if (useSensorTypes?.UseBecon === true) {
            let count = 0;
            let upDown = 0;

            let upDownClass = "sensor-area-content same";

            if (alarmCount) {
                count = alarmCount[SDMSResource.facilityType.Becon_Stay];
                if (!count)
                    count = 0;
            }
            if (alarmUpDown) {
                upDown = alarmUpDown[SDMSResource.facilityType.Becon_Stay];
                if (!upDown)
                    upDown = 0;
            }

            if (upDown === 1) {
                upDownClass = "sensor-area-content up";
            } else if (upDown === 2) {
                upDownClass = "sensor-area-content down";
            }

            displaySensorView.push(
                <div key={"becon_" + count} className={upDownClass}>
                    <span>비콘</span>
                    <span>{count}건</span>
                </div>);
        }

        return displaySensorView;
    }

    render() {
        //const [fireAlarmCount, psmAlarmCount, cctvAlarmCount, environAlarmCount] = this.getDisplayAlarm();
        const getDisplaySensorView = this.getDisplaySensorView();        

		return (
			<SensorView className="sensor-area">
                <h1>이상 센서 알람</h1>
				
                <div className='sensor-area-wrap'>
                    {getDisplaySensorView}
                </div>
            </SensorView>

        //     <SensorView className="sensor-area">
        //     <h1>이상 센서 알람</h1>
            
        //     <div className='sensor-area-wrap'>
        //         <div className='sensor-area-content up'>
        //             <span>화재</span>
        //             <span>0건</span>
        //         </div>
        //         <div className='sensor-area-content down'>
        //             <span>가스</span>
        //             <span>1건</span>
        //         </div>
        //         <div className='sensor-area-content same'>
        //             <span>환경</span>
        //             <span>2건</span>
        //         </div>
        //         <div className='sensor-area-content up'>
        //             <span>CCTV</span>
        //             <span>3건</span>
        //         </div>
        //         <div className='sensor-area-content same'>
        //             <span>제조설비</span>
        //             <span>0건</span>
        //         </div>
        //     </div>
        // </SensorView>
        );
    }
}

export default withRouter(SensorWonik);