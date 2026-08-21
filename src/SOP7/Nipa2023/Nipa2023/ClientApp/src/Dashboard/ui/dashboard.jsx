import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { DashboardComponent } from '../styled/dashboardStyled';
import StringUtil from '../../Common/util/StringUtil';
import ConfirmDialog from '../../Common/ui/confirmDialog';
import WorkerEventAlarm from './components/workerEventAlarm';
import BoardViewInfo from './components/boardViewInfo';
import SensorEventInfo from './components/sensorEventInfo';
import WeatherInfo from './components/weatherInfo';
import WeeklyInfo from './components/weeklyInfo';
import SensorDetailInfo from './components/sensorDetailInfo';

import { UserDispatch } from '../../Root/resource/userDispatch';
import { SdmsController } from '../../SDMS/services/sdmsController';
import { WeatherController } from '../../SDMS/services/weatherController';
import ProjectResource from '../../Root/resource/id';
import SdmsResource from '../../SDMS/resource/id';
import Clock from './components/clock';

class Dashboard extends Component {
    static contextType = UserDispatch;
    static arrDayStr = ['일', '월', '화', '수', '목', '금', '토'];

    constructor(props) {
        super(props);
		
		this.state = {
            sensorList: {},
            selectedAlarm: [],      // 센서 이벤트 알람에서 선택된 센서알람 목록
            selectedSensorName: '',
            weatherDatas: [],
            weatherWeeklyDatas: [],
            buildingGroupList: [],
            outdoorZones: [],

            confirmMessage: {
                visible: false,
                messages: [""],
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null,
                type: null
            },
        }

		this.props = props;

        this.initDatas();
        this.initWeatherDatas();
	}

    componentDidMount() {
        const { alarm } = this.context;
        const alarms = alarm[0].alarmState;

        if (alarms) {
            let defaultAlarm = alarms['gasAlarmDatas'];
            
            if(defaultAlarm) {
                this.setState({ selectedAlarm: defaultAlarm, selectedSensorName: SdmsResource.ID.sensor.gas });
            }
        }

        // 기상 정보는 5초에 한번씩 데이터를 새로 불러옴
        this.weatherInterval = setInterval(this.initWeatherDatas, 5000);
    }

    componentWillUnmount() {
        // 언마운트 될 때 interval 중지
        clearInterval(this.weatherInterval);
    }

    async initDatas() {
        const campusID = ProjectResource.campusID;
        
        if (campusID) {
             // 건물 데이터 가져오기
            const [buildingGroupList, outdoorZones, errorMessage] = await SdmsController.requestBuildingGroupList(campusID);
            
            if (buildingGroupList && outdoorZones){
                (buildingGroupList[0].buildingDatas).push(outdoorZones[0])
                this.setState({ buildingGroupList: buildingGroupList[0], outdoorZones });
            }
            else {
                this.showConfirmDialog([errorMessage], null, null, 'error');
            }

            // 센서 리스트 가져오기
            const [sensorList, sensorListMessage] = await SdmsController.requestSensorList(campusID);

            if (sensorList) {
                this.setState({ sensorList });
            }
            else {
                this.showConfirmDialog([sensorListMessage], null, null, 'error');
            }

            // 주간 알람 데이터 가져오기
            const [weeklyAlarmData, weeklyAlarmMessage] = await SdmsController.requestPastAlarmData(7);
            
            if (weeklyAlarmData) {
                this.setState({ weeklyAlarmData });
            }
            else {
                this.showConfirmDialog([weeklyAlarmMessage], null, null, 'error');
            }
        }
    }

    initWeatherDatas = async () => {
        const campusID = ProjectResource.campusID;

        const [weatherDatas, weatherDatasMessage] = await WeatherController.requestCurrentData(campusID);
        const [weatherWeeklyDatas, weatherWeeklyDatasMessage] = await WeatherController.requestWeeklyInfo();

        if (!weatherDatas || !weatherWeeklyDatas) {

            if(!weatherDatas) {
                this.showConfirmDialog([weatherDatasMessage], null, null, 'error');
            }
            else if(!weatherWeeklyDatas) {
                this.showConfirmDialog([weatherWeeklyDatasMessage], null, null, 'error');
            }
        } 
        else {
            // 현재 시간과 api 업데이트 시간이 1시간 이상 차이날 경우 데이터 표출X
            
            // 현재시간
            let now = new Date();

            let year = now.getFullYear();
            let month = now.getMonth() + 1;                 
            let day = now.getDate();
            let hours = now.getHours();
            let minutes = now.getMinutes();

            // api 업데이트 시간
            let updateTime = weatherDatas[0].current.updateTime;
            let _updateTime = new Date(updateTime.slice(0, -1));

            let updateYear = _updateTime.getFullYear();
            let updateMonth = _updateTime.getMonth() + 1;                             
            let updateDay = _updateTime.getDate();
            let updateHours = _updateTime.getHours();
            let updateMinutes = _updateTime.getMinutes();

            let date1 = new Date(year, month, day, hours, minutes);
            let date2 = new Date(updateYear, updateMonth, updateDay, updateHours, updateMinutes);

            let elapsedMSec = date2.getTime() - date1.getTime(); 
            let elapsedMin = Math.abs(parseInt(elapsedMSec / 1000 / 60)); 

            if (elapsedMin > 59) {
                return;
            } 
            else {
                this.setState({ weatherDatas: weatherDatas, weatherWeeklyDatas: weatherWeeklyDatas });
            }
        }
    }

    showConfirmDialog = (messages, buttons, onClickButton, type) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.messages = messages;
		confirmMessage.buttons = buttons;
		confirmMessage.onClickButton = onClickButton;
		confirmMessage.type = type;

        if (!messages) {
            confirmMessage.messages = [""];
        }
        else if (Array.isArray(messages)) {
            confirmMessage.messages = messages;
        }
        else {
            confirmMessage.messages = [messages];
        }

        this.setState({ confirmMessage });
    }

    onCloseConfirmDialog = () => {
		const confirmMessage = { ...this.state.confirmMessage };
		confirmMessage.visible = false;

		this.setState({ confirmMessage });
	}

    getSensorCount() {
        const sensorList = this.state.sensorList;

        // 전체 센서 수
        let atmosphereSensorCount = 0;
        let gasSensorCount = 0;
        let emergencyBellSensorCount = 0;
        let thermalCameraSensorCount = 0;
        let workerSensorCount = 0;
        let fireSensorCount = 0;
        let cctvSensorCount = 0;

        // 활성화된 센서 수
        let atmosphereSensorEnabledCount = 0;
        let gasSensorEnabledCount = 0;
        let emergencyBellSensorEnabledCount = 0;
        let thermalCameraSensorEnabledCount = 0;
        let workerSensorEnabledCount = 0;
        let fireSensorEnabledCount = 0;
        let cctvSensorEnabledCount = 0;

        if (sensorList) {
            for (const sensor in sensorList) {

                if (sensor === 'atmosphereSensors') {
                    atmosphereSensorCount = sensorList[sensor].length;

                    atmosphereSensorEnabledCount = this.getSensorEnabledCount(atmosphereSensorCount, sensorList[sensor]);
                }
                else if (sensor === 'gasSensors') {
                    gasSensorCount = sensorList[sensor].length;

                    gasSensorEnabledCount = this.getSensorEnabledCount(gasSensorCount, sensorList[sensor]);
                }
                else if (sensor === 'emergencyBells') {
                    emergencyBellSensorCount = sensorList[sensor].length;

                    emergencyBellSensorEnabledCount = this.getSensorEnabledCount(emergencyBellSensorCount, sensorList[sensor]);
                }
                else if (sensor === 'thermalCCTVs') {
                    thermalCameraSensorCount = sensorList[sensor].length;

                    thermalCameraSensorEnabledCount = this.getSensorEnabledCount(thermalCameraSensorCount, sensorList[sensor]);
                }
                else if (sensor === 'aps') {
                    workerSensorCount = sensorList[sensor].length;

                    workerSensorEnabledCount = this.getSensorEnabledCount(workerSensorCount, sensorList[sensor]);
                }
                else if (sensor === 'fireSensors') {
                    fireSensorCount = sensorList[sensor].length;

                    fireSensorEnabledCount = this.getSensorEnabledCount(fireSensorCount, sensorList[sensor]);
                }
                else if (sensor === 'cctvs') {
                    cctvSensorCount = sensorList[sensor].length;

                    cctvSensorEnabledCount = this.getSensorEnabledCount(cctvSensorCount, sensorList[sensor]);
                }
            }
        }

        return [atmosphereSensorCount, gasSensorCount, emergencyBellSensorCount,thermalCameraSensorCount, workerSensorCount, fireSensorCount, cctvSensorCount, atmosphereSensorEnabledCount, gasSensorEnabledCount, emergencyBellSensorEnabledCount, thermalCameraSensorEnabledCount, workerSensorEnabledCount, fireSensorEnabledCount, cctvSensorEnabledCount];
    }

    // 활성화된 센서 수 구하기
    getSensorEnabledCount = (allSensorsCount, sensors) => {
        let count = 0;

        if (sensors) {
            for (let i = 0; i < allSensorsCount; i++) {
                
                if (sensors[i].enabled){
                    count++;
                }
            }
        }
        
        return count;
    }

    onSelectedAlarm = (alarm, sensorName) => {
        if (this.state?.selectedAlarm === alarm) {
            return;
        }

        this.setState({ selectedAlarm: alarm, selectedSensorName: sensorName });
    }

    render() {
        const [atmosphereSensorCount, gasSensorCount, emergencyBellSensorCount,thermalCameraSensorCount, workerSensorCount, fireSensorCount, cctvSensorCount, atmosphereSensorEnabledCount, gasSensorEnabledCount, emergencyBellSensorEnabledCount, thermalCameraSensorEnabledCount, workerSensorEnabledCount, fireSensorEnabledCount, cctvSensorEnabledCount] = this.getSensorCount();

        return (
            <>
            <DashboardComponent className='UI_Section'>
                <div className='dashboardTop'>
                    <ul className='sensorWrap'>
                        <li>
                            <span>{SdmsResource.ID.sensor.gas}</span>
                            <span className='greenTxt'>{gasSensorEnabledCount} </span>
                            <span>/ {gasSensorCount}</span>
                        </li>
                        <li>
                            <span>{SdmsResource.ID.sensor.atmosphere}</span>
                            <span className='greenTxt'>{atmosphereSensorEnabledCount} </span>
                            <span>/ {atmosphereSensorCount}</span>
                        </li>
                        <li>
                            <span>{SdmsResource.ID.sensor.emergencyBell}</span>
                            <span className='greenTxt'>{emergencyBellSensorEnabledCount} </span>
                            <span>/ {emergencyBellSensorCount}</span>
                        </li>
                        <li>
                            <span>{SdmsResource.ID.sensor.thermalCamera}</span>
                            <span className='greenTxt'>{thermalCameraSensorEnabledCount} </span>
                            <span>/ {thermalCameraSensorCount}</span>
                        </li>
                        <li>
                            <span>{SdmsResource.ID.sensor.worker}</span>
                            <span className='greenTxt'>{workerSensorEnabledCount} </span>
                            <span>/ {workerSensorCount}</span>
                        </li>
                        <li>
                            <span>{SdmsResource.ID.sensor.fire}</span>
                            <span className='greenTxt'>{fireSensorEnabledCount} </span>
                            <span>/ {fireSensorCount}</span>
                        </li>
                        <li>
                            <span>{SdmsResource.ID.sensor.cctv}</span>
                            <span className='greenTxt'>{cctvSensorEnabledCount} </span>
                            <span>/ {cctvSensorCount}</span>
                        </li>
                    </ul>
                    <Clock />
                </div>
                <section>
                    {/* 작업자 이벤트 알람 */}
                    <WorkerEventAlarm />

                    {/* 대시보드 메인 */}
                    <BoardViewInfo
                        buildingGroupList={this.state.buildingGroupList}
                        sensorList={this.state.sensorList}
                    />

                    {/* 센서 이벤트 알람 */}
                    <SensorEventInfo
                        onSelectedAlarm={this.onSelectedAlarm}
                    />

                    {/* 기상정보 */}
                    <WeatherInfo 
                        weatherDatas={this.state.weatherDatas}
                        weatherWeeklyDatas={this.state.weatherWeeklyDatas}
                    />

                    {/* 주간 현황 */}
                    <WeeklyInfo
                        weeklyAlarmData={this.state.weeklyAlarmData}
                    />

                    {/* 센서 이벤트 알람 상세정보 */}
                    <SensorDetailInfo
                        selectedAlarm={this.state.selectedAlarm}
                        selectedSensorName={this.state.selectedSensorName}
                    />
                </section>
            </DashboardComponent>
            {
                /* alert창 대신 사용 */
                this.state.confirmMessage.visible &&
                <ConfirmDialog 
                    messages={this.state.confirmMessage.messages} 
                    buttons={this.state.confirmMessage.buttons} 
                    onClose={this.state.confirmMessage.onClose}
                    onClickButton={this.state.confirmMessage.onClickButton}
                    onCloseConfirmDialog={this.onCloseConfirmDialog}
                    type={this.state.confirmMessage.type}
                />
            }
            </>
        )
    }
}

export default withRouter(Dashboard);