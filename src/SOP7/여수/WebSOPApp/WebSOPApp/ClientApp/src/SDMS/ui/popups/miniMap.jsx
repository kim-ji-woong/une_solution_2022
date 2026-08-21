import React, { Component } from 'react';
import content from '../../../Common/css/content.module.css';
import sdmsStyle from '../../css/sdms.module.css';
import SDMS from '../sdms';
import SettingsStore from '../../../Settings/settingsStore';
import SDMSResource from '../../resource/id';
import proj4 from 'proj4';

import PopupDraggable from './popupDraggable';
import $, { event } from 'jquery';

import { MiniMapComponent } from './../../sdmsStyled';
import { SensorInfoBoxMini, SensorDslTop, ContentPaddingBox } from "../../styled";
import { SensorTitle, MinimapTitleIcon } from "../../styled";
import { SeosorCloseIcon } from "../../styled";
import { MinimapBox } from "../../styled";
import { AZoneBtn, BZoneBtn, CZoneBtn, DZoneBtn, EZoneBtn } from "../../styled";
import { MinimapPOI, MinimapPOIAlarmed } from '../../styled';

import Terrain from '../../img/miniMap/terrain2.png';


class MiniMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentZone: null,
            selectedSensor: null,
            sensorAlarms: null,
            sensorDatas: null,
        }

        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));
    }


    componentDidMount() {

        proj4.defs('EPSG:5179', '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=1000000 +y_0=2000000 +ellps=WGS84 +units=m +no_defs'); // elips = bessel

    }

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
        }

        if (this.props.selectedSensor !== prevProps.selectedSensor) {
            this.setState({ selectedSensor: this.props.selectedSensor })
        }
    }

    repositionPopup(popupState) {
        let data = popupState.miniMap;

        if (data === null || data === undefined)
            return;

        //let popup = document.getElementsByClassName(content.viewDashboardBoxD + ' ' + content.viewDashboardMiniMap)[0];
        let popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return;

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
    }

    resetPopupState = (popupState) => {
        let data = popupState;

        if (data.actionType === 'RESET_POPUP') {
            this.repositionPopup(data.popupState);
        }
    }

    /* getImageTitle() {
        if (this.props.currentView.zoneName.length === 0) {
            return <></>;
        }
        return <p>{this.props.currentView.zoneName}</p>;
    } */
    moveCameraToTarget(sector) {
        if (this.props.wsMgr) {
            this.props.moveCameraToTarget(sector);
        }
    }

    onClickSector = (sector) => {
        this.setState({ currentZone: sector }, () => this.moveCameraToTarget(sector));
    }

    onClickTest = (event) => {

        const target = event.target;

        let element = document.getElementById("imgArea");
        let rect = element.getBoundingClientRect();
        let standardX = rect.left;
        let standardY = rect.top;

    }

    getPOI = () => {
        if (this.props.selectedSensor === null || this.props.selectedSensor === undefined)
            return;

        if (this.props.sensorDatas === null || this.props.sensorDatas === undefined)
            return;

        let result = [];

        const curSensor = this.props.selectedSensor.sensor;
        let sensorDatas = this.props.sensorDatas;
        let curSensorData = null;

        for (let i = 0; i < sensorDatas.length; i++) {
            const sensorData = sensorDatas[i];

            if (curSensor.zoneID === sensorData.sensorID) {
                curSensorData = sensorData;
                break;
            }
        }

        if (curSensorData.latitude === null || curSensorData.latitude === undefined)
            return;

        if (curSensorData.longitude === null || curSensorData.longitude === undefined)
            return;

        // POI 좌표 변환
        const aTop = 125;
        const aLeft = 132;
        const bTop = 161;
        const bLeft = 90;

        const aLatitude = 34.8392;
        const aLongitude = 127.6943;
        const bLatitude = 34.8559;
        const bLongitude = 127.7069;

        const calculateWebCoords = (latitude, longitude) => {
            const webTop = aTop + ((bTop - aTop) * (latitude - aLatitude) * -1) / (bLatitude - aLatitude) * 1.15 - 27;
            const webLeft = aLeft + ((bLeft - aLeft) * (longitude - aLongitude) * -1) / (bLongitude - aLongitude) * 0.65 + 17;
            return { top: webTop, left: webLeft };
        };

        const curSensorLongitude = curSensorData.longitude;
        const curSensorLatitude = curSensorData.latitude;

        const webCoords = calculateWebCoords(curSensorLatitude, curSensorLongitude);

        let webTop = webCoords.top + 5;
        let webLeft = webCoords.left + 17;

        // 알람 센서 판별
        let sensorAlarms = [];
        if (this.props.alarms !== null && this.props.alarms !== undefined) {
            sensorAlarms = this.props.alarms;
        }

        if (sensorAlarms.length !== 0) {
            for (let i = 0; i < sensorAlarms.length; i++) {
                const alarm = sensorAlarms[i];

                if (alarm.zoneID === curSensorData.sensorID && alarm.isAlarm === true) {
                    const el = <MinimapPOIAlarmed id={curSensorData.sensorID} key={alarm.zoneID} style={{ top: webTop, left: webLeft }}></MinimapPOIAlarmed>
                    result.push(el);

                    return result;
                }
            }
        }

        const el = <MinimapPOI id={curSensorData.sensorID} key={curSensorData.sensorID} style={{ top: webTop, left: webLeft }}></MinimapPOI>
        result.push(el);

        return result;

    }

    zoneMouseEvent = () => {
        const changeZone = document.getElementById('abc');

        changeZone.classList.toggle('on');
    }

    
    showZoneImage = () => {
        const aMoveBtn = document.getElementById('aMoveBtn');
        const bMoveBtn = document.getElementById('bMoveBtn');
        const cMoveBtn = document.getElementById('cMoveBtn');
        const dMoveBtn = document.getElementById('dMoveBtn');
        const eMoveBtn = document.getElementById('eMoveBtn');

        aMoveBtn.classList.add('on');
        bMoveBtn.classList.add('on');
        cMoveBtn.classList.add('on');
        dMoveBtn.classList.add('on');
        eMoveBtn.classList.add('on');
        
    }

    showOutZoneImage = () => {
        const aMoveBtn = document.getElementById('aMoveBtn');
        const bMoveBtn = document.getElementById('bMoveBtn');
        const cMoveBtn = document.getElementById('cMoveBtn');
        const dMoveBtn = document.getElementById('dMoveBtn');
        const eMoveBtn = document.getElementById('eMoveBtn');

        aMoveBtn.classList.remove('on');
        bMoveBtn.classList.remove('on');
        cMoveBtn.classList.remove('on');
        dMoveBtn.classList.remove('on');
        eMoveBtn.classList.remove('on');
    } 

    showMapImageA = () => {
        const aZoneBtn = document.getElementById('aZoneBtn');
        aZoneBtn.classList.add('on');
    }

    showOutMapImageA = () => {
        const aZoneBtn = document.getElementById('aZoneBtn');
        aZoneBtn.classList.remove('on');
    }

    showMapImageB = () => {
        const bZoneBtn = document.getElementById('bZoneBtn');
        bZoneBtn.classList.add('on');
    }

    showOutMapImageB = () => {
        const bZoneBtn = document.getElementById('bZoneBtn');
        bZoneBtn.classList.remove('on');
    }

    showMapImageC = () => {
        const cZoneBtn = document.getElementById('cZoneBtn');
        cZoneBtn.classList.add('on');
    }

    showOutMapImageC = () => {
        const cZoneBtn = document.getElementById('cZoneBtn');
        cZoneBtn.classList.remove('on');
    }

    showMapImageD = () => {
        const dZoneBtn = document.getElementById('dZoneBtn');
        dZoneBtn.classList.add('on');
    }

    showOutMapImageD = () => {
        const dZoneBtn = document.getElementById('dZoneBtn');
        dZoneBtn.classList.remove('on');
    }

    showMapImageE = () => {
        const eZoneBtn = document.getElementById('eZoneBtn');
        eZoneBtn.classList.add('on');
    }

    showOutMapImageE = () => {
        const eZoneBtn = document.getElementById('eZoneBtn');
        eZoneBtn.classList.remove('on');
    }


    render() {

        const POI = this.getPOI();

        return (
            <MiniMapComponent id={this.props.popupType} className={content.miniMapPopup + " " + SDMSResource.UISection}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={360}
                    popupMinHeight={270}
                    topSize={35}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >

                    {/* <SensorInfoBoxMini> */}
                    <div className={'sensorDslTop'} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className={'sensorInfoDetailTitleM'}>
                            <span className={'minimapTitleIcon'}></span>
                            <span className={'sensorTitle'}>미니맵</span>
                        </div>
                        <div className={'sensorInfoTitleSecondM'}>
                           <span className={'seosorCloseIcon'} onClick={() => this.props.setVisiblePopups(SDMS.menu.miniMap, false)}></span>
                        </div>
                    </div>
                    <div className={'contentPaddingBox'}>
                        <div className={'minimapBox'} id="miniMapBox" onMouseOver={() => this.showZoneImage()} onMouseOut={() => this.showOutZoneImage()}>
                            {/* <span>[ 대기유해물질측정기 ]</span> */}
                            <div className={'imgBox'}>
                                <img className={'imgArea'} id="imgArea" sync="true" importance="high" /* src={url} */ src={Terrain} alt="미니맵" onClick={(event) => this.onClickTest(event)} />
                                {/* <MinimapPOI></MinimapPOI> */}
                                {POI}
                                {
                                    this.state.currentZone === 2 ?
                                        <>
                                          <div className={'aZoneBtn'} id="aZoneBtn"></div>
                                          <button className={'aMoveBtn'} id="aMoveBtn" onMouseOver={() => this.showMapImageA()} onMouseOut={() => this.showOutMapImageA()} onClick={() => this.onClickSector(2)}></button>
                                        </> :
                                        <>
                                          <div className={'aZoneBtn'} id="aZoneBtn"></div>
                                          <button className={'aMoveBtn'} id="aMoveBtn" onMouseOver={() => this.showMapImageA()} onMouseOut={() => this.showOutMapImageA()} onClick={() => this.onClickSector(2)}></button>
                                        </>
                                }
                                {
                                    this.state.currentZone === 1 ?
                                        <>
                                            <div className={'bZoneBtn'} id="bZoneBtn"></div>
                                            <button className={'bMoveBtn'} id="bMoveBtn" onMouseOver={() => this.showMapImageB()} onMouseOut={() => this.showOutMapImageB()} onClick={() => this.onClickSector(1)}></button>
                                        </> :
                                        <>
                                            <div className={'bZoneBtn'} id="bZoneBtn"></div>
                                            <button className={'bMoveBtn'} id="bMoveBtn" onMouseOver={() => this.showMapImageB()} onMouseOut={() => this.showOutMapImageB()} onClick={() => this.onClickSector(1)}></button>
                                        </>
                                }
                                {
                                    this.state.currentZone === 3 ?
                                        <>
                                            <div className={'cZoneBtn'} id="cZoneBtn"></div>
                                            <button className={'cMoveBtn'} id="cMoveBtn" onMouseOver={() => this.showMapImageC()} onMouseOut={() => this.showOutMapImageC()} onClick={() => this.onClickSector(3)}></button>
                                        </> :
                                        <>
                                            <div className={'cZoneBtn'} id="cZoneBtn"></div>
                                            <button className={'cMoveBtn'} id="cMoveBtn" onMouseOver={() => this.showMapImageC()} onMouseOut={() => this.showOutMapImageC()} onClick={() => this.onClickSector(3)}></button>
                                        </>
                                }
                                {
                                    this.state.currentZone === 4 ?
                                        <>
                                            <div className={'dZoneBtn'} id="dZoneBtn"></div>
                                            <button className={'dMoveBtn'} id="dMoveBtn" onMouseOver={() => this.showMapImageD()} onMouseOut={() => this.showOutMapImageD()} onClick={() => this.onClickSector(4)}></button>
                                        </> :
                                        <>
                                            <div className={'dZoneBtn'} id="dZoneBtn"></div>
                                            <button className={'dMoveBtn'} id="dMoveBtn" onMouseOver={() => this.showMapImageD()} onMouseOut={() => this.showOutMapImageD()} onClick={() => this.onClickSector(4)}></button>
                                        </>
                                }
                                {
                                    this.state.currentZone === 5 ?
                                        <>
                                            <div className={'eZoneBtn'} id="eZoneBtn"></div>
                                            <button className={'eMoveBtn'} id="eMoveBtn" onMouseOver={() => this.showMapImageE()} onMouseOut={() => this.showOutMapImageE()} onClick={() => this.onClickSector(5)}></button>
                                        </> :
                                        <>
                                            <div className={'eZoneBtn'} id="eZoneBtn"></div>
                                            <button className={'eMoveBtn'} id="eMoveBtn" onMouseOver={() => this.showMapImageE()} onMouseOut={() => this.showOutMapImageE()} onClick={() => this.onClickSector(5)}></button>
                                        </>
                                }

                            </div>
                        </div>
                    </div>
                    {/* </SensorInfoBoxMini> */}

                </PopupDraggable>
            </MiniMapComponent>
        );
    }
}

export default MiniMap;