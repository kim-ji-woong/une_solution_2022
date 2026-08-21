import React, { Component } from 'react';

import PopupDraggable from './popupDraggable';
import { MiniMapComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';

import miniMapImg from '../../images/miniMap_backImg.svg';
import position from '../../images/position_icon.svg';
import alarm from '../../images/alarm_icon.svg';

import proj4 from 'proj4';

class MiniMap extends Component {
    constructor(props) {
        super(props);

        this.state = {
            opacity: 1,
        }
    }

    changePopupOpacity = (value) => {
        this.setState({ opacity: value });
    }
    
    // GRS80 좌표계를 EPSG:5179 좌표계로 변환
    getEPSG5179 = (longitude, latitude) => {
        let originProjection = '+proj=longlat +ellps=GRS80 +datum=GRS80 +no_defs';
        let targetProjection = "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs";

        const convertToEPSG5179 = (longitude, latitude) => {
            return proj4(originProjection, targetProjection, [longitude, latitude]);
        };

        return [x, y] = convertToEPSG5179(longitude, latitude);
    }
    
    getIconUI = () => {
        const sensorAlarms = this.props.sensorAlarms;
        const selectedSensor = this.props.selectedSensor;
        const externalSensors = this.props.externalSensors;
        
        if (!sensorAlarms || !selectedSensor || !externalSensors) {
            return [];
        }
        
        let pois = [];
        
        let curSensor = externalSensors.find(sensor => sensor.zoneID === selectedSensor.zoneID);

        // 대동 좌표, 위경도
        const [aTop, aLeft] = [50, 95];
        const [alat, alon] = [35.0941662, 128.9582101];
        
        // 현대금형 좌표, 위경도
        const [bTop, bLeft] = [127, 98];
        const [blat, blon] = [35.0581051, 128.9573999];
        
        const calculateWebCoordinate = (longitude, latitude) => {
            const webTop = aTop + ((bTop - aTop) * (latitude - alat) * -1) / (blat - alat) + 70;
            const webLeft = aLeft + ((bLeft - aLeft) * (longitude - alon) * -1) / (blon - alon) * 0.38;
            return [webTop, webLeft];
        }
        
        for (let i = 0; i < externalSensors.length; i++) {
            
            const sensor = externalSensors[i];
            
            let [t, l] = calculateWebCoordinate(sensor.longitude, sensor.latitude);
            
            if (sensor.zoneID === curSensor.zoneID) {
                pois.push(
                    <img src={position}
                         alt='포지션 아이콘'
                         className='position'
                         style={{top: t, left: l }}
                    />);
                continue;
            }
            
            if (sensorAlarms.find(alarm => alarm.zoneID === sensor.zoneID)) {
                pois.push(
                    <img src={alarm}
                         alt='알람 아이콘'
                         className='alarm'
                         style={{ top: t, left: l }}
                    />);
            }
        }

        return pois;
    }

    render() {
        let opacity = this.state.opacity;
        let showPosition = true;
        let showAlarm = true;

        const iconUI = this.getIconUI();

        return (
            <MiniMapComponent id={this.props.popupType} className='UI_Section miniMap' $opacity={opacity}
                              $resize={false} $showPosition={showPosition} $showAlarm={showAlarm}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={300}
                    popupMinHeight={254}
                    topSize={40}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                    usePopupResize={false}
                >
                    <div className='dslTop'>
                        <h5 className='dslTitle'>
                            {SdmsResource.ID.menu.miniMap}
                        </h5>
                        <input
                            type="range"
                            className="rangeInput"
                            min={0.1}
                            max={1}
                            color="gray"
                            step={0.1}
                            defaultValue={opacity}
                            onChange={(e) => {this.changePopupOpacity(e.target.valueAsNumber)}}
                        />
                        <button className='dslX' onClick={() => this.props.setVisiblePopups(SdmsResource.ID.menu.miniMap, false)}>닫기</button>
                    </div>

                    <div className={'content'}>
                        <div>
                            <img src={miniMapImg} alt='미니맵 이미지' className='miniMode'/>
                            {iconUI}
                        </div>
                    </div>
                </PopupDraggable>
            </MiniMapComponent>
        );
    }
}

export default MiniMap;