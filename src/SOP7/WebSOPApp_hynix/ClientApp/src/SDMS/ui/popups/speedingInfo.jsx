import React, { Component } from 'react';
import PopupDraggable from './popupDraggable';
import { SpeedingInfoComponent } from '../../styled/sdmsPopupsStyled';
import SDMS from '../sdms';

class SpeedingInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            speed: 0,
            name: '-',
            time: '00:00:00'
        };

        //this.InitData();
    }

    InitData() {
        const speedDetectionDatas = this.props.speedDetectionDatas;

        if (speedDetectionDatas.length > 0) {
            let speedDetectionData = speedDetectionDatas[speedDetectionDatas.length - 1];

            let date = new Date(speedDetectionData.detectionTime);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');

            this.state.speed = speedDetectionData.speed;
            this.state.name = speedDetectionData.sensorName;
            this.state.time = `${hours}:${minutes}:${seconds}`;
        }
    }

    componentDidMount() {
        const speedDetectionDatas = this.props.speedDetectionDatas;

        this.updateSpeedDetection(speedDetectionDatas);
    }

    componentDidUpdate(prevProps, prevState) {
        // 차량 과속데이터가 다를 경우
        if (this.props.speedDetectionDatas.length !== prevProps.speedDetectionDatas.length) {
            const speedDetectionDatas = this.props.speedDetectionDatas;

            this.updateSpeedDetection(speedDetectionDatas);
        }
    }

    updateSpeedDetection = (speedDetectionDatas) => {
        if (speedDetectionDatas.length > 0) {
            let speedDetectionData = speedDetectionDatas[speedDetectionDatas.length - 1];

            let date = new Date(speedDetectionData.detectionTime);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
            
            const speed = speedDetectionData.speed;
            const name = speedDetectionData.sensorName;
            const time = `${hours}:${minutes}:${seconds}`;

            this.setState({ speed, name, time });
        }
    }
   
    render() {

        return (
            <SpeedingInfoComponent id={this.props.popupType} className={'viewDashboardBoxD viewDashboard'}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={280}
                    popupMinHeight={452}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                    usePopupResize={false}
                >
                    <div className={'dslTop dslGrd'}>
                        <h5 className={'dslTitle'}>과속감지 알림</h5>
                        <a className={'dslX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.SpeedingInfo, false)}></a>
                    </div>

                    <div className={'dslCont'}>
                        <p>{this.state.speed}</p>
                        <p>{this.state.name}</p>
                        <p>{this.state.time}</p>
                        <p>제한 속도가 초과되었습니다</p>
                    </div>
                </PopupDraggable>
            </SpeedingInfoComponent>
        );
    }
}

export default SpeedingInfo;