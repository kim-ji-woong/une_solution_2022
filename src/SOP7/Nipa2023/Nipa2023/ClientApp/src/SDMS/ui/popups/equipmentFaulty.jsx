import React, { Component } from 'react';
import $ from 'jquery';
import Monitoring from '../monitoring';
import PopupDraggable from './popupDraggable';

import { EquipmentFaultyComponent } from '../../styled/sdmsPopupsStyled';

import SDMSResource from '../../resource/id';
import { UserDispatch } from '../../../Root/resource/userDispatch';
import SdmsResource from '../../resource/id';

class EquipmentFaulty extends Component {
    static contextType = UserDispatch;

    constructor(props) {
        super(props);

        this.state = {
            selectAlarmData: null
        }

        this.props = props;

        this.initPopupState = this.initPopupState.bind(this);

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

        $('.scrollbar').scrollTop(0);
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.isPopupStateReset !== this.props.isPopupStateReset) {
            this.repositionPopup();
        }
    }

    initPopupState() {
        var popup = document.getElementsByClassName('UI_Section EquipmentFaulty')[0];

        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        } else {
            // DB에 값이 따로 없을 경우
            let data = SDMSResource.popupResetLocation[this.props.popupType];

            popup.style.left = data.x;
            popup.style.top = data.y;
            popup.style.width = data.width;
            popup.style.height = data.height;
        }

        this.setState({ popup: popup });
    }

    repositionPopup() {

        let popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return;

        let data = SDMSResource.popupResetLocation[this.props.popupType];

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
    }

    onChangeEquipmentItem = (id) => {
        this.props.onChangeEquipmentItem(id);
        this.props.selectFacility(id);
    }

    getDisplayView = () => {
        const facilityList = this.props.facilityList;
        const equipmentItem = this.props.equipmentItem;
        const selectedFacilityID = this.props.selectedFacilityID;

        let menuUI = [];
        let onClassName = '';
        let gridUI = [];

        if(facilityList) {
        
            for(let data of facilityList) {
                if(equipmentItem === data.id || selectedFacilityID === data.id) {
                    onClassName = 'on';
                }
                else {
                    onClassName = '';
                }

                menuUI.push(
                    <li 
                        key={data.id}
                        className={onClassName} 
                        onClick={() => this.onChangeEquipmentItem(data.id)}>{data.name.substr(4, 6)}
                    </li>
                );
            }
        }

        const { alarm } = this.context;
        const alarms = alarm[0].alarmState;

        if (alarms) {
            const alarm = alarms['equipmentAlarmDatas'];

            if(equipmentItem === 0) {
                gridUI.push(
                    <p className='nodata'>불량현황을 조회하고자 하는 호기를 선택하세요.</p>
                );
            } else {
                let index14 = 1;
                let index22 = 1;
                let index23 = 1;

                for(let data of alarm) {
                    if(data?.equipmentData?.equipment?.id === equipmentItem) {

                        const dt = new Date(data.eventTime);
                        const [ymd, hms] = SdmsResource.getDate(dt);

                        let index = 0;
                        if(data?.equipmentData?.equipment?.id === 14) {
                            index = index14;
                        } else if(data?.equipmentData?.equipment?.id === 22) {
                            index = index22;
                        } else if(data?.equipmentData?.equipment?.id === 23) {
                            index = index23;
                        }

                        gridUI.push(
                            <li 
                                key={data.sensorZoneHistoryID}
                                className={this.props.selectedFacilityEvent?.orgSensorID === data.orgSensorID ? 'on' : null}
                            >
                                <ul>
                                    <li>{index}</li>
                                    <li>{ymd + '/' + hms}</li>
                                    <li>{data?.equipmentData?.alarmType}</li>
                                    <li>
                                        <button className='moreInfo' onClick={() => this.onClickShowImage(data)}>사진보기</button>
                                    </li>
                                </ul>
                            </li>
                        );
                    }

                    if(data?.equipmentData?.equipment?.id === 14) {
                        index14++;
                    } else if(data?.equipmentData?.equipment?.id === 22) {
                        index22++;
                    } else if(data?.equipmentData?.equipment?.id === 23) {
                        index23++;
                    }
                }
            }
        }

        return [menuUI, gridUI];
    }

    onClickShowImage = (data) => {
        this.props.onSelectedFacilityEvent(data)
        this.props.setVisiblePopups(Monitoring.menu.equipmentFaultyImage2, true);
    }

    render() {
        const [menuUI, gridUI] = this.getDisplayView();

        return (
            <EquipmentFaultyComponent id={this.props.popupType} className='UI_Section EquipmentFaulty'>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={365}
                    popupMinHeight={263}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >
                    <div className={'dslTop'}>
                        <h5 className={'dslTitle'} >
                            불량 현황정보
                        </h5>
                        <div className={'dslX'} onClick={() => this.props.setVisiblePopups(Monitoring.menu.equipmentFaulty, false)}>
                            <a href="#none">닫기버튼</a>
                        </div>
                    </div>
                    <div className='dslCont'>
                        <div className='tabMenu'>
                            <ul>
                                {menuUI}
                            </ul>
                        </div>
                        <div className='contentTable'>
                            <ul className='tableHead'>
                                <li>No.</li>
                                <li>발생일 / 시간</li>
                                <li>불량유형</li>
                                <li>상세이미지</li>
                            </ul>
                            <ul className='tableBody'>
                                {
                                    gridUI.length > 0 ?
                                        gridUI :
                                        <p className='nodata'>조회된 데이터가 없습니다.</p>
                                }
                            </ul>
                        </div>
                    </div>
                </PopupDraggable>
            </EquipmentFaultyComponent>
        );
    }
}

export default EquipmentFaulty;