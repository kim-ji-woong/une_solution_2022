import React, { Component } from 'react';
import $ from 'jquery';

import { ElectricInfoGGComponent, ElectricBarChart } from '../../../styled/sdmsPopupsStyled';
import SDMS from '../../sdms';
import PopupDraggable from '../popupDraggable';
import SdmsResource from '../../../resource/id';

import electric_on from '../../../../Common/img/imgGyeonggi/electric_on.svg';
import electric_off from '../../../../Common/img/imgGyeonggi/electric_off.svg';
import toggleArrow from '../../../../Common/img/imgGyeonggi/toggleArrow.svg';
import { GghController } from '../../../services/gghController';
import ProjectResource from '../../../../Root/resource/id';
import SettingsStore from '../../../../Settings/settingsStore';
import store from '../../../../Root/store';

class ElectricInfo_gg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blackoutStatus: true,           // 정전상태 확인 (true:정상, false: 정전)
            upsDatas: null,
            showReserve: false              // 팝업 토글 상태
        }

        this.initPopupState = this.initPopupState.bind(this);
    }

    componentDidMount() {
        this.unsubscribeSettingsStore = SettingsStore.subscribe(() => {
            this.resetPopupState(SettingsStore.getState());
        });
    
        this.unsubscribeStore = store.subscribe(() => {
            this.setUpsData(store.getState());
        });

        if (this.props.selectSiteID === ProjectResource.Site.GG_B) {
            GghController.StartWatchTimerUpsStatus(this.props.selectSiteID);
        }

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

        this.initBlackoutStatus();
    }

    componentDidUpdate(prevProps) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            var popup = document.getElementsByClassName('viewDashboardBoxD electricInfo')[0];
            popup.style.zIndex = this.props.zIndex;
            console.log('electricInfoGGZIndex changed', popup.style.zIndex);
        }
    }

    componentWillUnmount() {
        GghController.stopWatchTimerUpsStatus();
        store.dispatch({ type: 'UPS_INFOS', upsDatas: [] });

        if (this.unsubscribeSettingsStore) {
            this.unsubscribeSettingsStore();
        }
    
        if (this.unsubscribeStore) {
            this.unsubscribeStore();
        }
    }

    repositionPopup(popupState) {
        let data = popupState.AccessControlGG;

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

    resetPopupState = (popupState) => {
        let data = popupState;

        if (data.actionType === 'RESET_POPUP') {
            this.repositionPopup(data.popupState);
        }
    }

    initPopupState() {
        var popup = document.getElementsByClassName('viewDashboardBoxD electricInfo')[0];

        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        }

        this.setState({ popup: popup });
    }

    initBlackoutStatus = () => {
        let blackoutStatus = true;
        const {sensorAlarms, selectSiteID} = this.props; 

        if (sensorAlarms && sensorAlarms.length > 0) {
            for (let alarm of sensorAlarms) {
                if (alarm.siteID === selectSiteID && 
                    alarm.isAlarm && 
                    alarm.facilityType === SdmsResource.facilityType.BLACKOUT) {
                        blackoutStatus = false;
                        break;
                }
            }
        }

        this.setState({ blackoutStatus: blackoutStatus });
    }

    setUpsData = (storeValue) => {
        if (storeValue?.actionType === 'UPS_INFOS') {
            const data = storeValue.upsDatas;
            this.setState({ upsDatas: data });
        }
    }

    getElectricInfoUI = () => {
        let ui = [];
        const upsDatas = store.getState().upsDatas;

        if (upsDatas && upsDatas.length > 0) {
            for (let data of upsDatas) {
                let value = data.currentData;
                if (value === null) {
                    value = 0;
                }
                ui.push(
                    <ElectricBarChart key={data.id} $data={data.currentData === null ? 100 : value}>
                        <div className='description'>
                            <span>{data.name}</span>
                        </div>
                        <div className='barChart'>
                            <span>차트</span>
                            <div className='chart' style={{ width: `${value}%` }}>
                                <p className={value < 21 ? 'outside' : null}>{data.currentData === null ? '' : `${value}%`}</p>
                            </div>
                        </div>
                    </ElectricBarChart>
                );
            }
        }

        return ui;
    }

    render() {
        const { showReserve, blackoutStatus } = this.state;
        const upsUI = this.getElectricInfoUI();

        return (
            <ElectricInfoGGComponent id={this.props.popupType} className={'viewDashboardBoxD electricInfo'} $showReserve={showReserve}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={299}
                    popupMinHeight={642}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                    usePopupResize={false}
                >
                    <div className={'dslTop dslGrd'}>
                        <h5 className={'dslTitle'} >
                            전력량 정보
                        </h5>
                        <a className={'dslX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.electricInfo, false)}></a>
                    </div>

                    <div className={'dslCont'}>
                        <div className='mainWrap'>
                            <p>메인전력</p>
                            <div>
                                <img src={blackoutStatus ? electric_on : electric_off} className={blackoutStatus ? 'on' : 'off'} alt='전력 상태 아이콘' width={130} height={141} />
                                <div>
                                    <p>전력 상태</p>
                                    <div>
                                        <p className={blackoutStatus ? 'on' : null}>정상</p>
                                        <p className={!blackoutStatus ? 'on' : null}>정전</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            this.props.selectSiteID === ProjectResource.Site.GG_B &&
                            <>
                                <button className={showReserve ? 'on' : null} onClick={() => this.setState({ showReserve: !showReserve })}>
                                    <img src={toggleArrow} alt='예비전력 토글 아이콘' width={12} height={7} />
                                </button>
                                <div className='reserveWrap' style={{ display: showReserve ? 'block' : 'none' }}>
                                    <p>예비전력</p>
                                    <ul>
                                        {upsUI}
                                    </ul>
                                </div>
                            </>
                        }
                    </div>
                </PopupDraggable>
            </ElectricInfoGGComponent>
        );
    }
}

export default ElectricInfo_gg;