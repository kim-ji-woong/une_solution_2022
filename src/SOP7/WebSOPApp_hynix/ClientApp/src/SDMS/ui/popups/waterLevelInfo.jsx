import React, { Component } from 'react';
import $ from 'jquery';

import { WaterLevelInfoComponent } from '../../styled/sdmsPopupsStyled';
import SDMS from '../sdms';
import PopupDraggable from './popupDraggable';
import SdmsResource from '../../resource/id';
import { i18n } from '../../../language/i18n';
import SettingsStore from '../../../Settings/settingsStore';

import imgRedLightIco from '../../../Common/img/imgwonik/board_sos_icon.png';
import imgGrayLightIco from '../../../Common/img/imgwonik/board_sos_icon_gray.png';

class WaterLevelInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            waterLevel: ''
        }

        this.initPopupState = this.initPopupState.bind(this);

        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));
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

        this.initPopupState();
        this.initAlarmInfo();
    }

    initAlarmInfo() {
        let waterLevel = '';
        const {sensorAlarms, selectSiteID} = this.props;

        if (sensorAlarms && sensorAlarms.length > 0) {
            for (let alarm of sensorAlarms) {
                if (alarm.siteID === selectSiteID && 
                    alarm.isAlarm && 
                    alarm.facilityType === SdmsResource.facilityType.WaterLevel) {
                        waterLevel = SdmsResource.waterLevel.high;
                        break;
                }
            }
        }

        this.setState({ waterLevel: waterLevel });
    }

    repositionPopup(popupState) {
        let data = popupState.waterLevelInfo;

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

    componentDidUpdate(prevProps, prevState) {
        if (prevProps?.selectedAlarm?.sensorZoneHistoryID !== this.props?.selectedAlarm?.sensorZoneHistoryID) {
            this.initAlarmInfo();
        }

        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            var popup = document.getElementsByClassName('viewDashboardBoxD viewWaterLevel')[0];
            popup.style.zIndex = this.props.zIndex;
            console.log('weatherInfoZIndex changed', popup.style.zIndex);
        }
    }

    initPopupState() {
        var popup = document.getElementsByClassName('viewDashboardBoxD viewWaterLevel')[0];

        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        }

        this.setState({ popup: popup });
    }


    render() {
        const { waterLevel } = this.state;

        let chartClassName = '';
        if (waterLevel === SdmsResource.waterLevel.high) {
            chartClassName = 'high';
        } 

        return (
            <WaterLevelInfoComponent id={this.props.popupType} className={'viewDashboardBoxD viewWaterLevel'} $waterLevel={waterLevel}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={260}
                    popupMinHeight={319}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                    usePopupResize={false}
                >
                    <div className={'dslTop dslGrd'}>
                        <h5 className={'dslTitle'} >
                            {i18n.t('sdms.waterLevelInfo.집수정')}
                        </h5>
                        <a className={'dslX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.waterLevelInfo, false)}></a>
                    </div>

                    <div className={'dslCont'}>
                        <div className='chart'>
                            <div className={chartClassName} />
                        </div>
                        <ul className='sensorWrap'>
                            <li>
                                <p>{i18n.t('sdms.waterLevelInfo.고수위센서')}</p>
                                <img className={'alarmImg'} src={waterLevel === SdmsResource.waterLevel.high ? imgRedLightIco : imgGrayLightIco} />
                            </li>
                        </ul>
                    </div>
                </PopupDraggable>
            </WaterLevelInfoComponent>
        );
    }
}

export default WaterLevelInfo;