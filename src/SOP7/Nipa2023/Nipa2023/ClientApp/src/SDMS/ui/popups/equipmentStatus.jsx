import React, { Component } from 'react';
import $ from 'jquery';
import Monitoring from '../monitoring';
import PopupDraggable from './popupDraggable';

import alarm_on from '../../images/alarm_on.png';
import alarm_off from '../../images/alarm_off.png';

import { EquipmentStatusComponent } from '../../styled/sdmsPopupsStyled';

import SDMSResource from '../../resource/id';
import { UserDispatch } from '../../../Root/resource/userDispatch';

class EquipmentStatus extends Component {
    static contextType = UserDispatch;

    constructor(props) {
        super(props);

        this.state = {
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
        var popup = document.getElementsByClassName('UI_Section EquipmentStatus')[0];

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

    goEquipmentDetail = (e, data) => {
        e.stopPropagation();
        this.props.onClickMode(SDMSResource.mode.equipmentDetail, data);

        // 이미 클릭된 사출기의 상세보기버튼 클릭 시
        // 불량 현황정보의 탭은 선택이 안되는 오류로 인해 추가
        data.id !== this.props.equipmentItem &&
            this.props.onChangeEquipmentItem(data.id);
    }

    onChangeEquipmentItem = (id) => {
        this.props.onChangeEquipmentItem(id);
        this.props.selectFacility(id);
    }

    isAlarmEquipment(data) {

        let alarmImgSrc = alarm_off;

        const { setting } = this.context;
        const option3DSensor = setting[0].settingState;

        const receiveFacilityError = option3DSensor.receiveFacilityError;

        if(!receiveFacilityError) {
            return alarmImgSrc;
        }
        else {
            const { alarm } = this.context;
            const alarms = alarm[0].alarmState;
    
            if (alarms) {
                const todayAlarms = alarms['equipmentAlarmDatas'];
    
                for (let alarm of todayAlarms) {
    
                    if (alarm.isAlarm && alarm.equipmentData.equipment.id === data.id) {
                        alarmImgSrc = alarm_on;
                    }
                }
            }
    
            return alarmImgSrc;
        }
    }

    getDisplayView = () => {
        const facilityList = this.props.facilityList;
        const equipmentItem = this.props.equipmentItem;
        const selectedFacilityID = this.props.selectedFacilityID;

        let ui = [];
        let onClassName = '';

        if(facilityList) {

            for(let data of facilityList) {

                const alarmImgSrc = this.isAlarmEquipment(data); // 알림이 발생한 사출기인가?

                if(equipmentItem === data.id || selectedFacilityID === data.id) {
                    onClassName = 'equipment on';
                }
                else {
                    onClassName = 'equipment';
                }
    
                ui.push(
                    <li className={onClassName} key={data.id} onClick={() => this.onChangeEquipmentItem(data.id)}>
                        <div className='headWrap'>
                            <div>
                                <p>{data.name}</p>
                                <button onClick={(e) => this.goEquipmentDetail(e, data)}>이동</button>
                            </div>
                            <img src={alarmImgSrc} className='alarmImg' alt='알람 아이콘' />
                        </div>
                        <div className='imageWrap'>
                            <img src={data.image} alt={data.name + '사진'} />
                        </div>
                    </li>
                );
            }
        }

        return ui;
    }

    render() {
        const ui = this.getDisplayView();

        return (
            <EquipmentStatusComponent id={this.props.popupType} className='UI_Section EquipmentStatus'>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={304}
                    popupMinHeight={630}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >
                    <div className={'dslTop'}>
                        <h5 className={'dslTitle'} >
                            설비 현황정보
                        </h5>
                        <div className={'dslX'} onClick={() => this.props.setVisiblePopups(Monitoring.menu.equipmentStatus, false)}>
                            <a href="#none">닫기버튼</a>
                        </div>
                    </div>
                    <div className='dslCont'>
                        <ul>
                            {ui}
                        </ul>
                    </div>
                </PopupDraggable>
            </EquipmentStatusComponent>
        );
    }
}

export default EquipmentStatus;