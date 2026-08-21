import React, { Component } from 'react';
import $ from 'jquery';

import content from '../../../Common/css/content.module.css';
import '../../css/popup.css';
import SettingsStore from '../../../Settings/settingsStore';
import SDMS from '../sdms';
import SDMSMainMenu from '../sdmsMainMenu';

import PopupDraggable from './popupDraggable';

import AtmosphereAccordion from './AtmosphereAccordion';
import BacteriaAccordion from './BacteriaAccordion';
import VOCAccordion from './VOCAccordion';
import WaterQualityAccordion from './WaterQualityAccordion';
import WeatherAccordion from './WeatherAccordion';
import CCTVAccordion from './CCTVAccordion';

import { SensorIconBox, SensorInfoBox, SensorDslTop, ContentPaddingBox, SensorTitle, SensorTitleIcon, SeosorCloseIcon } from './../../styled';

import { SensorSearchBox, SearchIcon, SensorPrevIcon, SensorNextIcon } from './../../styled';
import { Atmosphere, AtmosphereDis, Bacteria, BacteriaDis, CCTV, CCTVDis, Entire, EntireDis, VOC, VOCDis, WaterQuality, WaterQualityDis, Weather, WeatherDis } from './../../styled';
import SDMSResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';
//import DetailInfo from './detailInfo';


class StatusInfo extends Component {

    static EntireType = 0;
    static AtmosphereType = 1;
    static WaterType = 2;
    static WeatherType = 3;
    static VocType = 4;
    static BacterialType = 6;
    static CCTVType = 16;
    
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            searchText: '',
            openStatus: null,
            selectedSensor: null,
            selectedSensorType: null,

            isShowAll: true,
            isShowAtmos: true,
            isShowWater: true,
            isShowWeather: true,
            isShowVOC: true,
            isShowBac: true,
            isShowCCTV: true,
            isShowBacterial: true,

            selectedAlarm: this.props.selectedAlarm,
            isSameAlarm: null,
        }

        this.initPopupState = this.initPopupState.bind(this);
        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));

        this.refLayer = React.createRef();
        this.refScrollArea = React.createRef();
        this.refScrollbar = React.createRef();
        this.refTree = React.createRef();

        this.initSiteID();

        this.searchText = '';

        this.isSubscribed = true;
    }

    componentDidMount() {
        let cssLeft = null;
        let cssTop = null;
        let cssWidth = null;
        let cssHeight = null;

        const popup = document.getElementById(this.props.popupType);
        const target = document.getElementById("dsBot_" + this.props.popupType);
        const popupState = this.props.popupState;

        if (popup !== null && popup !== undefined &&
            target !== null && target !== undefined &&
            popupState !== null && popupState !== undefined) {
            const clientRect = target.getBoundingClientRect();
            cssLeft = clientRect.left + "px";
            cssTop = clientRect.top + "px";

            popup.style.width = 0;
            popup.style.height = 0;
            popup.style.left = cssLeft;
            popup.style.top = cssTop;

            cssLeft = popupState.x;
            cssTop = popupState.y;
            cssWidth = popupState.width;
            cssHeight = popupState.height;

            $('#' + this.props.popupType).animate({ opacity: 1, width: cssWidth, height: cssHeight, left: cssLeft, top: cssTop }, SDMSResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }
        else {
            $('#' + this.props.popupType).animate({ opacity: 1 }, SDMSResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }

        this.initPopupState();
    }


    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
            console.log('statusInfoZIndex changed', this.state.popup.style.zIndex)
        }

        //this.setScrollbar();

        if (this.props.visiblePopups !== prevProps.visiblePopups && this.state.selectedSensor !== null) {
            this.setState({ selectedSensor: {} });
        }


        // 기존 알람과 이전알람이 다르면 새로운 알람으로 센서 선택 , 최초 실행시에 센서 선택
        if (this.state.selectedAlarm !== this.props.selectedAlarm) {


            return this.setState({ selectedAlarm: this.props.selectedAlarm });
        }

        // 알람 및 센서 변경시(클릭)
        if (this.props.selectedSensor !== prevProps.selectedSensor) {
            if (this.props.selectedSensor !== null && this.props.selectedSensor !== undefined) {
                this.setState({
                    selectedSensor: this.props.selectedSensor,
                    selectedSensorType: this.props.selectedSensor.sensorType,
                    openStatus: this.props.selectedSensor.sensorType
                });
            }
        }

        // EventInfo에서 기존 선택된 알람 선택시 Accordion 트리 해당 센서 이동
        if (this.props.onClickSameAlarm === false) {
            if (this.props.onClickSameAlarm !== prevProps.onClickSameAlarm) {
                this.setState({ isSameAlarm: this.props.onClickSameAlarm });
            }
        }
    }

    componentWillUnmount() {
        this.isSubscribed = false;
    }

    setState = (state, callback) => {
        if (this.isSubscribed) {
            super.setState(state, callback);
        }
    }

    getAlarmSensor(alarmSensor) {

        const sensorList = this.props.sensorList;

        for (let i = 0; i < sensorList.length; i++) {
            for (let j = 0; j < sensorList[i].length; j++) {
                if (alarmSensor.zoneID === sensorList[i].zoneID) {
                    return sensorList[i];
                }
            }
        }

    }

    setVisiblePoi(typeName, visible) {
        this.props.setVisiblePoi(typeName, visible);
    }

    initPopupState() {
        var popup = document.getElementsByClassName(content.statusInfo)[0];

        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        }

        this.setState({ popup: popup });
    }

    repositionPopup(popupState) {
        let data = popupState.statusInfo;

        if (data === null || data === undefined)
            return;

        //let popup = document.getElementsByClassName(content.viewDashboard + ' ' + content.viewDashboardBoxD)[0];
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

    searchEnterKey = (event) => {
        if (window.event && window.event.keyCode === 13) {
            this.search(this.searchText);
        }

        if (event.key === 'Enter') {
            this.search(this.searchText);
        }
    }

    onChangeSearchText = (event) => {
        this.searchText = event.target.value;
    }

    search = (text) => {
        if (text !== null && text !== undefined) {
            this.setState({ searchText: this.searchText });
        }
    }

    selectSensor = (sensorType, sensor, openStatus) => {

        if (sensorType && (openStatus !== undefined)) {

            if (sensor) {
                return this.setState(
                    {
                        selectedSensor:
                        {
                            sensor: sensor,
                            sensorType: sensorType
                        },
                        selectedSensorType: sensorType,
                        openStatus: sensorType
                    }, this.props.onSelectedSensor(sensorType, sensor, null, null, true));
            }
        }
        else {

            sensor = null;

            return this.setState({ selectedSensor: sensor, selectedSensorType: sensorType, openStatus: sensorType }, this.props.onSelectedSensor(sensorType, sensor));
        }
    }

    isShowPoi(sensorType) {

        let isShow = null;

        if (sensorType === null || sensorType === undefined) {
            return
        }

        /*
         *                                  WebSocket
         *                                  
         *  Poi Type : 0(전체), 1(대기), 2(수질), 3(기상), // 보류 상태 : 4(VOC), 5(CCTV), 6(악취)
         *  
         *  Show/Hide : 1(Show : true) , 0(Hide : false) 
         *  
         *  
         */


        if (sensorType === StatusInfo.EntireType) {
            isShow = !this.state.isShowAll;
        } else if (sensorType === StatusInfo.AtmosphereType) {
            isShow = !this.state.isShowAtmos;
        } else if (sensorType === StatusInfo.WaterType) {
            isShow = !this.state.isShowWater;
        } else if (sensorType === StatusInfo.WeatherType) {
            isShow = !this.state.isShowWeather;
        } else if (sensorType === StatusInfo.VocType) {
            isShow = !this.state.isShowVOC;
        } else if (sensorType === StatusInfo.CCTVType) {
            isShow = !this.state.isShowCCTV;
        } else if (sensorType === StatusInfo.BacterialType) {
            isShow = !this.state.isShowBacterial;
        }

        let isShowAll = this.state.isShowAll;
        let isShowAtmos = this.state.isShowAtmos;
        let isShowWater = this.state.isShowWater;
        let isShowWeather = this.state.isShowWeather;
        let isShowVOC = this.state.isShowVOC;
        let isShowCCTV = this.state.isShowCCTV;
        let isShowBacterial = this.state.isShowBacterial;

        if (sensorType === StatusInfo.EntireType) {
            if (this.state.isShowAll) {
                return this.setState({ isShowAll: !this.state.isShowAll, isShowAtmos: false, isShowWater: false, isShowWeather: false, isShowVOC: false, isShowCCTV: false, isShowBacterial: false }, () => {
                    this.props.setPoiLayer(sensorType, isShow);
                });
            } else if (!this.state.isShowAll) {
                return this.setState({ isShowAll: !this.state.isShowAll, isShowAtmos: true, isShowWater: true, isShowWeather: true, isShowVOC: true, isShowCCTV: true, isShowBacterial: true }, () => {
                    this.props.setPoiLayer(sensorType, isShow);
                });
            }
        }

        if (sensorType === StatusInfo.AtmosphereType) {

            isShowAtmos = !this.state.isShowAtmos;
            if ((isShowAtmos && isShowWater && isShowWeather && isShowVOC && isShowCCTV && isShowBacterial) === true) {
                isShowAll = true;
            }

        } else if (sensorType === StatusInfo.WaterType) {

            isShowWater = !this.state.isShowWater;
            if ((isShowAtmos && isShowWater && isShowWeather && isShowVOC && isShowCCTV && isShowBacterial) === true) {
                isShowAll = true;
            }

        } else if (sensorType === StatusInfo.WeatherType) {

            isShowWeather = !this.state.isShowWeather;
            if ((isShowAtmos && isShowWater && isShowWeather && isShowVOC && isShowCCTV && isShowBacterial) === true) {
                isShowAll = true;
            }
        } else if (sensorType === StatusInfo.VocType) {

            isShowVOC = !this.state.isShowVOC;
            if ((isShowAtmos && isShowWater && isShowWeather && isShowVOC && isShowCCTV && isShowBacterial) === true) {
                isShowAll = true;
            }
        } else if (sensorType === StatusInfo.CCTVType) {

            isShowCCTV = !this.state.isShowCCTV;
            if ((isShowAtmos && isShowWater && isShowWeather && isShowVOC && isShowCCTV && isShowBacterial) === true) {
                isShowAll = true;
            }
        } else if (sensorType === StatusInfo.BacterialType) {

            isShowBacterial = !this.state.isShowBacterial;
            if ((isShowAtmos && isShowWater && isShowWeather && isShowVOC && isShowCCTV && isShowBacterial) === true) {
                isShowAll = true;
            }
        }

        if (!isShowAtmos || !isShowWater || !isShowWeather || !isShowVOC || !isShowCCTV || !isShowBacterial) {
            isShowAll = false;
        }

        this.setState({ isShowAll: isShowAll, isShowAtmos: isShowAtmos, isShowWater: isShowWater, isShowWeather: isShowWeather, isShowVOC: isShowVOC, isShowCCTV: isShowCCTV, isShowBacterial: isShowBacterial }, () => {
            this.props.setPoiLayer(sensorType, isShow);
        })
    }

    async initSiteID() {
        let siteID = ProjectResource.SiteID;
        if (siteID === null || siteID === undefined) {
            // 사이트 ID 요청
            siteID = await ProjectResource.loadSiteID();
            this.setState({ reload: true });
        }
    }

    /* displayUI = () => {

        let visibleFirePOI = this.props.visibleSensorTypes[SDMSMainMenu.Fire_Sensor] ? true : false;
        let visibleCctvPOI = this.props.visibleSensorTypes[SDMSMainMenu.CCTV_Type] ? true : false;
        let visiblePSMPOI = this.props.visibleSensorTypes[SDMSMainMenu.PSM_Sensor] ? true : false;
        let visibleEtcPOI = this.props.visibleSensorTypes[SDMSMainMenu.Etc_Sensor] ? true : false;
        let visibleEquipZoneName = this.props.visibleSensorTypes[SDMSMainMenu.EquipZoneName] ? true : false;

        let visibleFireClassName = (visibleFirePOI) ? content.visibleFire : content.disableFire;
        let visibleCctvClassName = (visibleCctvPOI) ? content.visibleCCTV : content.disableCCTV;
        let visiblePSMClassName = (visiblePSMPOI) ? content.visiblePsm : content.disablePsm;
        let visibleEtcClassName = (visibleEtcPOI) ? content.visibleEtc : content.disableEtc;
        let visibleEquipZoneNameClassName = (visibleEquipZoneName) ? content.visibleEquip : content.disableEquip;

        let entireStyle = null;
        let entireDisStyle = null;

        let atmosStyle = null;
        let atmosDisStyle = null;

        let waterStyle = null;
        let waterDisStyle = null;

        let weatherStyle = null;
        let weatherDisStyle = null;

        let vocStyle = null;
        let vocDisStyle = null;

        let CCTVStyle = null;
        let CCTVDisStyle = null;


        if (this.state.isShowAll) {
            entireStyle = {
                display: 'inline-block'
            };
            entireDisStyle = {
                display: 'contents',
                position: 'absolute',
                left: '-9999',
                top: '-9999'
            }
        } else {
            entireStyle = {
                display: 'contents',
                position: 'absolute',
                left: '-9999',
                top: '-9999'
            };
            entireDisStyle = {
                display: 'inline-block'
            }
        }

        if (this.state.isShowAtmos) {
            atmosStyle = {
                display: 'inline-block'
            };
            atmosDisStyle = {
                display: 'contents',
                position: 'absolute',
                left: '-9999',
                top: '-9999'
            }
        } else {
            atmosStyle = {
                display: 'contents',
                position: 'absolute',
                left: '-9999',
                top: '-9999'
            };
            atmosDisStyle = {
                display: 'inline-block'
            }
        }

        if (this.state.isShowWater) {
            waterStyle = {
                display: 'inline-block'
            };
            waterDisStyle = {
                display: 'contents',
                position: 'absolute',
                left: '-9999',
                top: '-9999'
            }
        } else {
            waterStyle = {
                display: 'contents',
                position: 'absolute',
                left: '-9999',
                top: '-9999'
            };
            waterDisStyle = {
                display: 'inline-block'
            }
        }

        if (this.state.isShowWeather) {
            weatherStyle = {
                display: 'inline-block'
            };
            weatherDisStyle = {
                display: 'contents',
                position: 'absolute',
                left: '-9999',
                top: '-9999'
            }
        } else {
            weatherStyle = {
                display: 'contents',
                position: 'absolute',
                left: '-9999',
                top: '-9999'
            };
            weatherDisStyle = {
                display: 'inline-block'
            }
        }

        if (this.state.isShowVOC) {
            vocStyle = {
                display: 'inline-block'
            };
            vocDisStyle = {
                display: 'contents',
                position: 'absolute',
                left: '-9999',
                top: '-9999'
            }
        } else {
            vocStyle = {
                display: 'contents',
                position: 'absolute',
                left: '-9999',
                top: '-9999'
            };
            vocDisStyle = {
                display: 'inline-block'
            }
        }

        if (this.state.isShowCCTV) {
            CCTVStyle = {
                display: 'inline-block'
            };
            CCTVDisStyle = {
                display: 'contents',
                position: 'absolute',
                left: '-9999',
                top: '-9999'
            }
        } else {
            CCTVStyle = {
                display: 'contents',
                position: 'absolute',
                left: '-9999',
                top: '-9999'
            };
            CCTVDisStyle = {
                display: 'inline-block'
            }
        }


        if (ProjectResource.SiteID === ProjectResource.Site.Yeosu) {
            return
            <>
                <SensorIconBox>
                    <Entire style={entireStyle} onClick={() => this.isShowPoi(StatusInfo.EntireType)}></Entire>
                    <EntireDis style={entireDisStyle} onClick={() => this.isShowPoi(StatusInfo.EntireType)}></EntireDis>

                    <Atmosphere style={atmosStyle} onClick={() => this.isShowPoi(StatusInfo.AtmosphereType)}></Atmosphere>
                    <AtmosphereDis style={atmosDisStyle} onClick={() => this.isShowPoi(StatusInfo.AtmosphereType)}></AtmosphereDis>

                    <WaterQuality style={waterStyle} onClick={() => this.isShowPoi(StatusInfo.WaterType)}></WaterQuality>
                    <WaterQualityDis style={waterDisStyle} onClick={() => this.isShowPoi(StatusInfo.WaterType)}></WaterQualityDis>

                    <Weather style={weatherStyle} onClick={() => this.isShowPoi(StatusInfo.WeatherType)}></Weather>
                    <WeatherDis style={weatherDisStyle} onClick={() => this.isShowPoi(StatusInfo.WeatherType)}></WeatherDis>

                    <VOC style={vocStyle} onClick={() => this.isShowPoi(StatusInfo.VocType)}></VOC>
                    <VOCDis style={vocDisStyle} onClick={() => this.isShowPoi(StatusInfo.VocType)}></VOCDis>

                    <CCTV style={CCTVStyle} onClick={() => this.isShowPoi(StatusInfo.CCTVType)}></CCTV>
                    <CCTVDis style={CCTVDisStyle} onClick={() => this.isShowPoi(StatusInfo.CCTVType)}></CCTVDis>

                </SensorIconBox>

                <AtmosphereAccordion selectSensor={this.selectSensor} sensors={this.props.sensorList?.atmospheres} openStatus={this.state.openStatus} isSelected={this.state.selectedSensorType === StatusInfo.AtmosphereType} selectedSensor={this.state.selectedSensor} selectedAlarm={this.state.selectedAlarm} isSameAlarm={this.state.isSameAlarm} isSameAlarmTrue={this.props.isSameAlarmTrue}></AtmosphereAccordion>
                <WaterQualityAccordion selectSensor={this.selectSensor} sensors={this.props.sensorList?.waters} openStatus={this.state.openStatus} isSelected={this.state.selectedSensorType === StatusInfo.WaterType} selectedSensor={this.state.selectedSensor} selectedAlarm={this.state.selectedAlarm} isSameAlarm={this.state.isSameAlarm} isSameAlarmTrue={this.props.isSameAlarmTrue}></WaterQualityAccordion>
                <WeatherAccordion selectSensor={this.selectSensor} sensors={this.props.sensorList?.weathers} openStatus={this.state.openStatus} isSelected={this.state.selectedSensorType === StatusInfo.WeatherType} selectedSensor={this.state.selectedSensor}></WeatherAccordion>
                <VOCAccordion selectSensor={this.selectSensor} sensors={this.props.sensorList?.voss} openStatus={this.state.openStatus} isSelected={this.state.selectedSensorType === StatusInfo.VocType} selectedSensor={this.state.selectedSensor}></VOCAccordion>
                <BacteriaAccordion selectSensor={this.selectSensor} sensors={this.props.sensorList?.bacterias} openStatus={this.state.openStatus} isSelected={this.state.selectedSensorType === StatusInfo.BacteriaType} selectedSensor={this.state.selectedSensor}></BacteriaAccordion>
            </>
        } else if (ProjectResource.SiteID === ProjectResource.Site.Busan) {
            return
            <></>
        }
        return <></>
    } */


    render() {

        let visibleFirePOI = this.props.visibleSensorTypes[SDMSMainMenu.Fire_Sensor] ? true : false;
        let visibleCctvPOI = this.props.visibleSensorTypes[SDMSMainMenu.CCTV_Type] ? true : false;
        let visiblePSMPOI = this.props.visibleSensorTypes[SDMSMainMenu.PSM_Sensor] ? true : false;
        let visibleEtcPOI = this.props.visibleSensorTypes[SDMSMainMenu.Etc_Sensor] ? true : false;
        let visibleEquipZoneName = this.props.visibleSensorTypes[SDMSMainMenu.EquipZoneName] ? true : false;

        let visibleFireClassName = (visibleFirePOI) ? content.visibleFire : content.disableFire;
        let visibleCctvClassName = (visibleCctvPOI) ? content.visibleCCTV : content.disableCCTV;
        let visiblePSMClassName = (visiblePSMPOI) ? content.visiblePsm : content.disablePsm;
        let visibleEtcClassName = (visibleEtcPOI) ? content.visibleEtc : content.disableEtc;
        let visibleEquipZoneNameClassName = (visibleEquipZoneName) ? content.visibleEquip : content.disableEquip;

        let entireStyle = null;
        let entireDisStyle = null;

        let atmosStyle = null;
        let atmosDisStyle = null;

        let waterStyle = null;
        let waterDisStyle = null;

        let weatherStyle = null;
        let weatherDisStyle = null;

        let vocStyle = null;
        let vocDisStyle = null;

        let CCTVStyle = null;
        let CCTVDisStyle = null;

        let BacterialStyle = null;
        let BacterialDisStyle = null;


        if (this.state.isShowAll) {
            entireStyle = {
                display: 'inline-block'
            };
            entireDisStyle = {
                display: 'contents',
                position: 'absolute',
                left: '-9999',
                top: '-9999'
            }
        } else {
            entireStyle = {
                display: 'contents',
                position: 'absolute',
                left: '-9999',
                top: '-9999'
            };
            entireDisStyle = {
                display: 'inline-block'
            }
        }

        if (this.state.isShowAtmos) {
            atmosStyle = {
                display: 'inline-block'
            };
            atmosDisStyle = {
                display: 'contents',
                position: 'absolute',
                left: '-9999',
                top: '-9999'
            }
        } else {
            atmosStyle = {
                display: 'contents',
                position: 'absolute',
                left: '-9999',
                top: '-9999'
            };
            atmosDisStyle = {
                display: 'inline-block'
            }
        }

        if (this.state.isShowWater) {
            waterStyle = {
                display: 'inline-block'
            };
            waterDisStyle = {
                display: 'contents',
                position: 'absolute',
                left: '-9999',
                top: '-9999'
            }
        } else {
            waterStyle = {
                display: 'contents',
                position: 'absolute',
                left: '-9999',
                top: '-9999'
            };
            waterDisStyle = {
                display: 'inline-block'
            }
        }

        if (this.state.isShowWeather) {
            weatherStyle = {
                display: 'inline-block'
            };
            weatherDisStyle = {
                display: 'contents',
                position: 'absolute',
                left: '-9999',
                top: '-9999'
            }
        } else {
            weatherStyle = {
                display: 'contents',
                position: 'absolute',
                left: '-9999',
                top: '-9999'
            };
            weatherDisStyle = {
                display: 'inline-block'
            }
        }

        if (this.state.isShowVOC) {
            vocStyle = {
                display: 'inline-block'
            };
            vocDisStyle = {
                display: 'contents',
                position: 'absolute',
                left: '-9999',
                top: '-9999'
            }
        } else {
            vocStyle = {
                display: 'contents',
                position: 'absolute',
                left: '-9999',
                top: '-9999'
            };
            vocDisStyle = {
                display: 'inline-block'
            }
        }

        if (this.state.isShowCCTV) {
            CCTVStyle = {
                display: 'inline-block'
            };
            CCTVDisStyle = {
                display: 'contents',
                position: 'absolute',
                left: '-9999',
                top: '-9999'
            }
        } else {
            CCTVStyle = {
                display: 'contents',
                position: 'absolute',
                left: '-9999',
                top: '-9999'
            };
            CCTVDisStyle = {
                display: 'inline-block'
            }
        }

        if (this.state.isShowBacterial) {
            BacterialStyle = {
                display: 'inline-block'
            };
            BacterialDisStyle = {
                display: 'contents',
                position: 'absolute',
                left: '-9999',
                top: '-9999'
            }
        } else {
            BacterialStyle = {
                display: 'contents',
                position: 'absolute',
                left: '-9999',
                top: '-9999'
            };
            BacterialDisStyle = {
                display: 'inline-block'
            }
        }

        return (
            <>
                <div id={this.props.popupType} className={content.statusInfo + " " + SDMSResource.UISection}>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={322}
                        popupMinHeight={390}
                        topSize={35}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                    >

                        {/* <SensorInfoBox> */}
                        <SensorDslTop>
                            <SensorTitleIcon></SensorTitleIcon>
                            <SensorTitle>센서정보</SensorTitle>
                            <SeosorCloseIcon onClick={() => this.props.setVisiblePopups(SDMS.menu.statusInfo, false)}></SeosorCloseIcon>
                        </SensorDslTop>

                        {/*  {
                            this.displayUI()
                        }  */}
                        <ContentPaddingBox className={content.scrollbar}>
                            <div style={{ display: 'flex' }} className="statusDiv">
                                {/* <SensorPrevIcon></SensorPrevIcon> */}
                                <SensorIconBox>
                                    {/*이미지 Preload 적용*/}
                                    <div data-tooltip="전체"><Entire style={entireStyle} onClick={() => this.isShowPoi(StatusInfo.EntireType)}></Entire></div>
                                    <div data-tooltip="전체"><EntireDis style={entireDisStyle} onClick={() => this.isShowPoi(StatusInfo.EntireType)}></EntireDis></div>

                                    <div data-tooltip="대기"><Atmosphere style={atmosStyle} onClick={() => this.isShowPoi(StatusInfo.AtmosphereType)}></Atmosphere></div>
                                    <div data-tooltip="대기"><AtmosphereDis style={atmosDisStyle} onClick={() => this.isShowPoi(StatusInfo.AtmosphereType)}></AtmosphereDis></div>

                                    <div data-tooltip="수질"><WaterQuality style={waterStyle} onClick={() => this.isShowPoi(StatusInfo.WaterType)}></WaterQuality></div>
                                    <div data-tooltip="수질"><WaterQualityDis style={waterDisStyle} onClick={() => this.isShowPoi(StatusInfo.WaterType)}></WaterQualityDis></div>

                                    <div data-tooltip="기상"><Weather style={weatherStyle} onClick={() => this.isShowPoi(StatusInfo.WeatherType)}></Weather></div>
                                    <div data-tooltip="기상"><WeatherDis style={weatherDisStyle} onClick={() => this.isShowPoi(StatusInfo.WeatherType)}></WeatherDis></div>

                                    <div data-tooltip="VOC"><VOC style={vocStyle} onClick={() => this.isShowPoi(StatusInfo.VocType)}></VOC></div>
                                    <div data-tooltip="VOC"><VOCDis style={vocDisStyle} onClick={() => this.isShowPoi(StatusInfo.VocType)}></VOCDis></div>

                                    {/*<div data-tooltip="CCTV"><CCTV style={CCTVStyle} onClick={() => this.isShowPoi(StatusInfo.CCTVType)}></CCTV></div>*/}
                                    {/*<div data-tooltip="CCTV"><CCTVDis style={CCTVDisStyle} onClick={() => this.isShowPoi(StatusInfo.CCTVType)}></CCTVDis></div>*/}

                                    <div data-tooltip="악취"><Bacteria style={BacterialStyle} onClick={() => this.isShowPoi(StatusInfo.BacterialType)}></Bacteria></div>
                                    <div data-tooltip="악취"><BacteriaDis style={BacterialDisStyle} onClick={() => this.isShowPoi(StatusInfo.BacterialType)}></BacteriaDis></div>

                                </SensorIconBox>
                                {/* <SensorNextIcon></SensorNextIcon> */}
                            </div>

                            {/* <span style={{ display: 'block', width: '100%', height: '1px', border: 'dashed 0.5px #707070', marginBottom: '10px' }}></span>  */}

                            {/* <div className={}>
                           <span><input type="text" placeholder="검색어를 입력해주세요."  /></span>
                        </div> */}
                            <SensorSearchBox /* className="abc" */>
                                <SearchIcon></SearchIcon>
                                <input type="text" placeholder="검색어를 입력해주세요" onKeyPress={(event) => this.searchEnterKey(event)} onChange={(event) => this.onChangeSearchText(event)} />
                            </SensorSearchBox>

                            <div>
                                <AtmosphereAccordion
                                    selectSensor={this.selectSensor}
                                    sensors={this.props.sensorList?.atmospheres}
                                    openStatus={this.state.openStatus}
                                    isSelected={this.state.selectedSensorType === StatusInfo.AtmosphereType}
                                    selectedSensor={this.props.selectedSensor}
                                    selectedAlarm={this.props.selectedAlarm}
                                    isSameAlarm={this.state.isSameAlarm}
                                    isSameAlarmTrue={this.props.isSameAlarmTrue}
                                    onClick360={this.props.onClick360}
                                    materialLinks={this.props.materialLinks}
                                    searchText={this.state.searchText}
                                    testParam={this.props.testParam}
                                >

                                </AtmosphereAccordion>

                                <WaterQualityAccordion
                                    selectSensor={this.selectSensor}
                                    sensors={this.props.sensorList?.waters}
                                    openStatus={this.state.openStatus}
                                    isSelected={this.state.selectedSensorType === StatusInfo.WaterType}
                                    selectedSensor={this.state.selectedSensor}
                                    selectedAlarm={this.state.selectedAlarm}
                                    isSameAlarm={this.state.isSameAlarm}
                                    isSameAlarmTrue={this.props.isSameAlarmTrue}
                                    onClick360={this.props.onClick360}
                                    materialLinks={this.props.materialLinks}
                                    searchText={this.state.searchText}
                                    testParam={this.props.testParam}>
                                </WaterQualityAccordion>

                                <WeatherAccordion
                                    selectSensor={this.selectSensor}
                                    sensors={this.props.sensorList?.weathers}
                                    openStatus={this.state.openStatus}
                                    isSelected={this.state.selectedSensorType === StatusInfo.WeatherType}
                                    selectedSensor={this.state.selectedSensor}
                                    onClick360={this.props.onClick360}
                                    searchText={this.state.searchText}
                                    testParam={this.props.testParam}>
                                </WeatherAccordion>

                                <VOCAccordion
                                    selectSensor={this.selectSensor}
                                    sensors={this.props.sensorList?.vocs}
                                    openStatus={this.state.openStatus}
                                    isSelected={this.state.selectedSensorType === StatusInfo.VocType}
                                    selectedSensor={this.state.selectedSensor}
                                    selectedAlarm={this.state.selectedAlarm}
                                    isSameAlarm={this.state.isSameAlarm}
                                    isSameAlarmTrue={this.props.isSameAlarmTrue}
                                    materialLinks={this.props.materialLinks}
                                    onClick360={this.props.onClick360}
                                    searchText={this.state.searchText}
                                    testParam={this.props.testParam}>
                                </VOCAccordion>

                                {/*<CCTVAccordion*/}
                                {/*    selectSensor={this.selectSensor}*/}
                                {/*    sensors={this.props.sensorList?.cctvs}*/}
                                {/*    openStatus={this.state.openStatus}*/}
                                {/*    isSelected={this.state.selectedSensorType === StatusInfo.CCTVType}*/}
                                {/*    selectedSensor={this.state.selectedSensor}*/}
                                {/*    searchText={this.state.searchText}>*/}
                                {/*</CCTVAccordion> */}

                                <BacteriaAccordion
                                    selectSensor={this.selectSensor}
                                    sensors={this.props.sensorList?.stinks}
                                    openStatus={this.state.openStatus}
                                    isSelected={this.state.selectedSensorType === StatusInfo.BacterialType}
                                    selectedSensor={this.props.selectedSensor}
                                    selectedAlarm={this.props.selectedAlarm}
                                    isSameAlarm={this.state.isSameAlarm}
                                    isSameAlarmTrue={this.props.isSameAlarmTrue}
                                    onClick360={this.props.onClick360}
                                    materialLinks={this.props.materialLinks}
                                    searchText={this.state.searchText}
                                    testParam={this.props.testParam}>
                                </BacteriaAccordion>
                            </div>

                        </ContentPaddingBox>
                        {/* </SensorInfoBox> */}
                    </PopupDraggable>

                    {/* <DetailInfo /> */}

                </div>
            </>
        );
    }
}

export default StatusInfo;