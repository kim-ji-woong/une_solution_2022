import React, { Component } from 'react';
import PopupDraggable from './popupDraggable';
import { SpeedingHistoryComponent } from '../../styled/sdmsPopupsStyled';
import SDMS from '../sdms';
import SDMSMainMenu from '../sdmsMainMenu';

class SpeedingHistory extends Component {
    constructor(props) {
        super(props);

        this.refSensorOption = React.createRef();

        this.state = {
            sensorList: [],
            selectSensor: null,
            displayItems: [],
            isLastest: true,

        };

        this.InitData();
    }    

    InitData() {        
        const speedDetectionSensors = this.props.sensorList?.speedDetectionSensors;
        const selectedPOI = this.props.selectedPOI;

        if (speedDetectionSensors?.length > 0) {
            for (let sensor of speedDetectionSensors) {
                this.state.sensorList.push(sensor.name);
            }
        }

        if (selectedPOI) {
            if (selectedPOI.length === 2 && selectedPOI[0] && selectedPOI[0].object) {
                const [sensorType, zoneID, sensorID] = SDMS.getSensorInfo(selectedPOI[0]);

                if (sensorType === SDMSMainMenu.SpeedDetection) {

                    if (speedDetectionSensors?.length > 0) {
                        for (let sensor of speedDetectionSensors) {

                            if (sensor.id === sensorID) {
                                this.state.selectSensor = sensor.name;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // 차량 과속데이터가 다를 경우
        if (this.props.speedDetectionDatas.length !== prevProps.speedDetectionDatas.length) {
            this.getDisplayTableItems();
        }

        // 선택된 센서가 다를 경우
        let selectSensor = null;

        if (this.props.selectedPOI !== prevProps.selectedPOI) {
            const selectedPOI = this.props.selectedPOI;            

            if (selectedPOI) {
                if (selectedPOI.length === 2 && selectedPOI[0] && selectedPOI[0].object) {
                    const [sensorType, zoneID, sensorID] = SDMS.getSensorInfo(selectedPOI[0]);

                    if (sensorType === SDMSMainMenu.SpeedDetection) {
                        const speedDetectionSensors = this.props.sensorList?.speedDetectionSensors;

                        if (speedDetectionSensors?.length > 0) {
                            for (let sensor of speedDetectionSensors) {

                                if (sensor.id === sensorID) {
                                    selectSensor = sensor.name;
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            // 차량 과속감지 센서가 선택 될 때만 업데이트
            if (selectSensor !== null && selectSensor !== this.state.selectSensor) {
                this.state.selectSensor = selectSensor;

                this.getDisplayTableItems();
            }            
        }
    }

    componentDidMount() {
        this.getDisplayTableItems();
    }

    getDisplayTableItems = () => {
        const speedDetectionDatas = this.props.speedDetectionDatas;

        let sensorOption = this.refSensorOption.current.value;
        let selectSensor = this.state.selectSensor;
        
        if (selectSensor === null) {
            selectSensor = "전체";
        }

        let displayItems = [];        

        if (speedDetectionDatas?.length > 0) {

            for (let data of speedDetectionDatas) {
                // 센서 선택 필터링 
                if (this.state.selectSensor !== null && this.state.selectSensor !== data.sensorName) {
                    continue;
                }

                displayItems.push(data);
            }

            // 시간 순서 필터링
            if (this.state.isLastest && displayItems.length > 1) {
                displayItems.sort((a, b) => {
                    const dateA = new Date(a.detectionTime);
                    const dateB = new Date(b.detectionTime);
                    return dateB - dateA;
                });
            }                       
        }

        if (sensorOption !== selectSensor) {
            this.refSensorOption.current.value = selectSensor;
        }

        this.setState({ displayItems });      
    }

    getDisplayUI = () => {
        let tableUI = [];
        let optionItems = [];

        let cnt = 0;
        let avgSpeed = 0;
        const displayItems = this.state.displayItems;

        if (displayItems?.length > 0) {
            cnt = displayItems.length;

            for (let item of displayItems) {
                let date = new Date(item.detectionTime);
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const seconds = date.getSeconds().toString().padStart(2, '0');

                let speed = item.speed;
                let name = item.sensorName;
                let time = `${hours}:${minutes}:${seconds}`;

                avgSpeed += speed;

                tableUI.push(
                    <li>
                        <div><span className='ellipsis'>{time}</span></div>
                        <div><span className='ellipsis'>{name}</span></div>
                        <div><span className='ellipsis'>{speed}</span></div>
                    </li>
                )
            }

            avgSpeed = Math.floor(avgSpeed / cnt);
        }
        else {
            avgSpeed = "-";
        }

        const sensorList = this.state.sensorList;

        if (sensorList?.length > 0) {
            for (let sensor of sensorList) {
                optionItems.push(
                    <option value={sensor}>{sensor}</option>
                );
            }
        }

        return [tableUI, optionItems, cnt, avgSpeed];
    }

    onChangeSensor = (e) => {
        const target = e.target;
        let sensor = target.value;

        if (sensor === "전체")
            sensor = null;

        const selectSensor = this.state.selectSensor;

        if (selectSensor !== sensor) {
            this.state.selectSensor = sensor;

            this.getDisplayTableItems();
        }
    }

    onChangeSort = (e) => {
        const target = e.target;
        let value = target.value;

        if (value === "false") {
            this.state.isLastest = false;

            this.getDisplayTableItems();
        }
        else {
            this.state.isLastest = true;

            this.getDisplayTableItems();
        }
    }

    render() {
        const [tableUI, optionItems, cnt, avgSpeed] = this.getDisplayUI();

        return (
            <SpeedingHistoryComponent id={this.props.popupType} className={'viewDashboardBoxD viewDashboard'}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={280}
                    popupMinHeight={452}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >
                    <div className={'dslTop dslGrd'}>
                        <h5 className={'dslTitle'}>과속감지 이력</h5>
                        <a className={'dslX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.speedingHistory, false)}></a>
                    </div>

                    <div className={'dslCont'}>
                        <div className='infoWrap'>
                            <p>총 {cnt}건의 과속감지가 발생했습니다.</p>
                            <p>과속평균속도 : {avgSpeed} km/h</p>
                        </div>
                        <div className='filterWrap'>
                            {/* 위치명 dropdown */}
                            <select
                                ref={this.refSensorOption}
                                name="locationFilter"
                                id="locationFilter"
                                aria-label="위치 필터"
                                onChange={this.onChangeSensor}
                            >
                                <option value={"전체"}>전체</option>
                                {optionItems}
                            </select>
                            {/* 시간 정렬 dropdown */}
                            <select
                                name="sortOrder"
                                id="sortOrder"
                                aria-label="시간 정렬"
                                onChange={this.onChangeSort}
                            >
                                <option value={true}>최신순</option>
                                <option value={false}>오래된순</option>
                            </select>
                        </div>
                        <ul className='listWrap'>
                            <li className='head'>
                                <div>시간</div>
                                <div>위치</div>
                                <div>속도</div>
                            </li>
                            <li className='body'>
                                <ul>
                                    {tableUI}
                                </ul>
                                
                            </li>
                        </ul>
                    </div>
                </PopupDraggable>
            </SpeedingHistoryComponent>
        );
    }
}

export default SpeedingHistory;