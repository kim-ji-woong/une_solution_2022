
import React, { Component } from 'react';
import $ from 'jquery';
import SdmsResource from '../../resource/id';
import PopupDraggable from './popupDraggable';
import SettingsStore from '../../../Settings/settingsStore';
import SDMS from '../sdms';

import { SimulationInfoComponent } from '../../../SDMS/styled/sdmsPopupsStyled';
import { i18n, withTranslation } from '../../../language/i18n';

class SimulationInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isToggleOn: true,
            isRunSimulationOn: true,
            selectValue: []
        };

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        // 창이 서서히 나타나는 효과
        let cssLeft = null;
        let cssTop = null;
        let cssWidth = null;
        let cssHeight = null;

        const popup = document.getElementById(this.props.popupType);
        //const target = document.getElementById("dsBot_" + this.props.popupType); 
        const target = document.getElementById("dsBot_" + SdmsResource.popupLayer.simulationInfo);
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

            $('#' + this.props.popupType).animate({ opacity: 1, width: cssWidth, height: cssHeight, left: cssLeft, top: cssTop }, SdmsResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }
        else {
            $('#' + this.props.popupType).animate({ opacity: 1 }, SdmsResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }

        this.unsubscribe_SettingsStore = SettingsStore.subscribe(function () {
            let data = SettingsStore.getState();

            if (data?.actionType === 'RESET_POPUP') {
                this.repositionPopup(data.popupState);
            }
        }.bind(this));

        //this.init();

        $('.simuSelect').click(function () {
            $('.simuOptionBox').toggle();
        });

        $('.activeOption2').click(function () {
            $('.simuOptionBox').toggle();
        });

        $('.activeOption1').click(function () {
            $('.activeOption1').addClass('activeOption1Active');
        });

        $('.activeOption2').click(function () {
            $('.activeOption2').addClass('activeOption2Active');
        });

    }


    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            //var popup = document.getElementsByClassName('viewDashboardBoxD viewDashboardWeather')[0];
            //popup.style.zIndex = this.props.zIndex;
            this.state.popup.style.zIndex = this.props.zIndex;
        }

        if (this.props.currentView !== prevProps.currentView) {
            if (this.props.currentView.buildingID === null || this.props.currentView.zoneID === null) {
                return;
            }

            const eqZoneDatas = this.getEqZoneDatas();
            this.setState({ eqZoneDatas, searchEqZoneText: '', showEqZoneDropDown: false, searchEqZoneDatas: [], selectedEqZone: null });
        }
    }

    repositionPopup(popupState) {
        let data = popupState.simulationInfo;

        if (data === null || data === undefined)
            return;

        let popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return;

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
    }

    handleClick() {
        this.setState(prevState => ({
            isRunSimulationOn: !prevState.isRunSimulationOn
        }));
    }

    setSelectValue = (target) => {
        const value = target.textContent;
        let selectValue = this.state.selectValue;

        if (selectValue.length === 2) {
            let newValue = [];
            newValue.push(value);
            this.setState({ selectValue: newValue });
        }
        else {
            selectValue.push(value);
            this.setState({ selectValue: selectValue });
        }
    }

    displayRunSimulation = () => {
        let simulationChangeUI = [];
        const selectValue = this.state.selectValue;

        if (this.state.isRunSimulationOn === true) {
            simulationChangeUI.push(
                <>
                    {/* <select className={'simulationSelect'}>
                    <option>전기분해기</option>
                    <option>전기분해기2</option>
                    <option>전기분해기3</option>
                </select> */}

                    <div className={'simuSelect'}>
                        {
                            selectValue.length > 0 &&
                            selectValue.map((data, index) => <span id={'select' + index}>{data}</span>)
                        }
                    </div>
                    <div className={'simuOptionBox'} style={{ display: 'none' }}>
                        <div className={'simuFirstOption'}>
                            <span className={'activeOption1'} onClick={(e) => this.setSelectValue(e.target)}>{i18n.language === "ko" ? '전기분해기' : 'Electrolyzer'}</span>
                            <span>{i18n.language === "ko" ? '전기분해기 생산 수소 공급' : 'Electrolyzer Production Hydrogen Supply'}</span>
                            <span>{i18n.language === "ko" ? '수소 트레일러용 하역 터미널' : 'Unloading-Terminal Tube Trailer'}</span>
                            <span>{i18n.language === "ko" ? '질소 정화 시스템' : 'N₂ Purging System'}</span>
                            <span>{i18n.language === "ko" ? '압력용기' : 'Medium Pressure Vesse'}</span>
                            <span>{i18n.language === "ko" ? '압축기' : 'Compression System'}</span>
                            <span>{i18n.language === "ko" ? '냉각 시스템' : 'Cooling System'}</span>
                            <span>{i18n.language === "ko" ? '디스펜서' : 'Dispenser'}</span>
                        </div>
                        <div className={'simuSecondOption'}>
                            <span className={'activeOption2'} onClick={(e) => this.setSelectValue(e.target)}>{i18n.language === "ko" ? '수처리 장치' : 'Water Treatment Device'}</span>
                            <span>{i18n.language === "ko" ? '수질 정화용 압력용기' : 'Pressure Vessel For Water Purification'}</span>
                            <span>{i18n.language === "ko" ? '수질 정화용 펌프' : 'Water Treatment Device Pressure Vessel Pump'}</span>
                            <span>{i18n.language === "ko" ? '냉각용 열교환기' : 'Cooling Heat Exchanger'}</span>
                            <span>{i18n.language === "ko" ? '냉각용 펌프' : 'Cooling pump'}</span>
                            <span>{i18n.language === "ko" ? '냉각용 압력용기' : 'Cooling pressure vessel'}</span>
                            <span>{i18n.language === "ko" ? '질소 정화 시스템' : 'N₂Purging System'}</span>
                            <span>{i18n.language === "ko" ? 'ELY 모듈' : 'Ely Module'}</span>
                            <span>{i18n.language === "ko" ? '드라이어' : 'Dryer'}</span>
                            <span>{i18n.language === "ko" ? '드라이어' : 'Dryer'}</span>
                            <span>{i18n.language === "ko" ? '드라이어' : 'Dryer'}</span>
                        </div>
                    </div>

                    <div className={'simulationInputBox'}>
                        <div><span style={{ fontSize: '5px', marginRight: '10px' }}>◆</span><span>Vehicle&nbsp;Type :</span><input type="text" /></div>
                        <div><span style={{ fontSize: '5px', marginRight: '10px' }}>◆</span><span>Fueling SOC&nbsp;(%) :</span><input type="text" /></div>
                        <div><span style={{ fontSize: '5px', marginRight: '10px' }}>◆</span><span>P Class&nbsp;(MPa) :</span><input type="text" /></div>
                    </div>
                    <div className={'runSimulationBtn'} onClick={this.handleClick}>Run Simulation</div>

                </>);
        }else if(this.state.isRunSimulationOn === false) {
            simulationChangeUI.push(
                <>
                    <div className={'lineGraphBox'}></div>
                    <div>
                        <span className={'simulationInputInforTitle'}>Simulation Input Information</span>
                        <div className={'simulationInputInformation'}>
                            <div style={{ display: 'flex' }}><div style={{ width: '50%' }}><span style={{ fontSize: '5px', marginRight: '10px' }}>◆</span><span>Number of Compressor :</span><span className={'boldNumText'}>1</span></div><div style={{ width: '50%' }}><span style={{ fontSize: '5px', marginRight: '10px' }}>◆</span><span>Reference Mass Flow Rate(㎏/h) :</span><span className={'boldNumText'}>80</span></div></div>
                            <div style={{ display: 'flex' }}><div style={{ width: '50%' }}><span style={{ fontSize: '5px', marginRight: '10px' }}>◆</span><span>Compressor Speed(RPM) :</span><span className={'boldNumText'}>70</span></div><div style={{ width: '50%' }}><span style={{ fontSize: '5px', marginRight: '10px' }}>◆</span><span>Reference Pressure(MPa) :</span><span className={'boldNumText'}>2</span></div></div>
                            <div style={{ display: 'flex' }}><div style={{ width: '50%' }}><span style={{ fontSize: '5px', marginRight: '10px' }}>◆</span><span>Volumetric Efficiency(%) :</span><span className={'boldNumText'}>95</span></div><div style={{ width: '50%' }}><span style={{ fontSize: '5px', marginRight: '10px' }}>◆</span><span>Reference Temperature(K) :</span><span className={'boldNumText'}>21</span></div></div>
                        </div>
                    </div>
                </>
            );
        }

        return simulationChangeUI;
    }


    render() {
        const simulationChangeUI = this.displayRunSimulation();

        //const selectValue = this.state.selectValue;

        return (
            <SimulationInfoComponent id={this.props.popupType} className={'viewSimulationSection'}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={470}
                    popupMinHeight={432}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >

                    <div className={'dslTop dslGrd'}>
                        <h5 className={'dslTitle'} >
                            {i18n.language === "ko" ? '시뮬레이션' : 'Simulation'}
                        </h5>
                        <a className={'dslX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.simulationInfo, false)}></a>
                    </div>
                    <div className={'dslContSimulation'}>
                        {simulationChangeUI}
                        {/* <div className={'runSimulationBtn'} onClick={this.handleClick}>Run Simulation</div> */}
                    </div>


                </PopupDraggable>
            </SimulationInfoComponent>
        );
    }
}

export default withTranslation()(SimulationInfo);