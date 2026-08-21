import React, { Component } from 'react';
import $ from 'jquery';
import Monitoring from '../monitoring';
import PopupDraggable from './popupDraggable';

import { EquipmentFaultyImageComponent } from '../../styled/sdmsPopupsStyled';

import SDMSResource from '../../resource/id';
import SdmsResource from '../../resource/id';

class EquipmentFaultyImage2 extends Component {
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
        var popup = document.getElementsByClassName('UI_Section equipmentFaultyImage2')[0];

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

    getDisplayView = () => {
        let gridUI = [];
        const alarm = this.props.selectedFacilityEvent;
        
        if(alarm) {
            const dt = new Date(alarm.equipmentData.data.shotTime);
            const [ymd, hms] = SdmsResource.getDate(dt);

            gridUI.push(
                <>
                <div className='imageWrap'>
                    <img src={alarm.equipmentData.imagePath} alt='불량품 사진' />
                </div>
                <div className='detailWrap'>
                    <div>
                        <span>{alarm.sensorName}</span>
                        <span>샷 기록시간 : {ymd + ' ' + hms}</span>
                    </div>
                    <ul>
                        <li>
                            <span className='head'>샷카운트</span>
                            <span className='body'>{alarm.equipmentData.data.shotCount} shots</span>
                            <span className='head'>계량시간</span>
                            <span className='body'>{alarm.equipmentData.data.measureTime} sec</span>
                        </li>
                        <li>
                            <span className='head'>전체공정시간</span>
                            <span className='body'>{alarm.equipmentData.data.processTime} sec</span>
                            <span className='head'>계량시작위치</span>
                            <span className='body'>{alarm.equipmentData.data.measureStartPos} mm</span>
                        </li>
                        <li>
                            <span className='head'>쿠션위치</span>
                            <span className='body'>{alarm.equipmentData.data.cushionPos} mm</span>
                            <span className='head'>계량완료위치</span>
                            <span className='body'>{alarm.equipmentData.data.measureEndPos} mm</span>
                        </li>
                        <li>
                            <span className='head'>최대압력</span>
                            <span className='body'>{alarm.equipmentData.data.maxPressure} bar</span>
                            <span className='head'>냉각시간</span>
                            <span className='body'>{alarm.equipmentData.data.icingTime} sec</span>
                        </li>
                        <li>
                            <span className='head'>절환위치</span>
                            <span className='body'>{alarm.equipmentData.data.transferPos} mm</span>
                            <span className='head'>형개시간</span>
                            <span className='body'>{alarm.equipmentData.data.moldOpenTime} sec</span>
                        </li>
                        <li>
                            <span className='head'>절환압력</span>
                            <span className='body'>{alarm.equipmentData.data.transferPressure} bar</span>
                            <span className='head'>형폐시간</span>
                            <span className='body'>{alarm.equipmentData.data.moldCloseTime} sec</span>
                        </li>
                        <li>
                            <span className='head'>사출시간</span>
                            <span className='body'>{alarm.equipmentData.data.injectTime} sec</span>
                            <span className='head'>압출전진시간</span>
                            <span className='body'>{alarm.equipmentData.data.fowardTime} sec</span>
                        </li>
                        <li>
                            <span className='head'>보압시간</span>
                            <span className='body'>{alarm.equipmentData.data.holdingPressure} sec</span>
                            <span className='head'>압출후진시간</span>
                            <span className='body'>{alarm.equipmentData.data.backwardTime} sec</span>
                        </li>
                    </ul>
                </div>
                </>
            );
        }

        return gridUI;
    }

    render() {
        const gridUI = this.getDisplayView();

        return (
            <EquipmentFaultyImageComponent id={this.props.popupType} className='UI_Section equipmentFaultyImage2'>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={345}
                    popupMinHeight={450}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >
                    <div className={'dslTop'}>
                        <h5 className={'dslTitle'} >
                            불량 상세정보
                        </h5>
                        <div className={'dslX'} onClick={() => this.props.setVisiblePopups(Monitoring.menu.equipmentFaultyImage2, false)}>
                            <a href="#none">닫기버튼</a>
                        </div>
                    </div>
                    <div className='dslCont'>
                        {gridUI}
                    </div>
                </PopupDraggable>
            </EquipmentFaultyImageComponent>
        );
    }
}

export default EquipmentFaultyImage2;