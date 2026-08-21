import React, { Component } from 'react';
import $ from 'jquery';
import styled from 'styled-components';

import { ParkingInfoGGComponent } from '../../../styled/sdmsPopupsStyled';
import SDMS from '../../sdms';
import PopupDraggable from '../popupDraggable';
import SdmsResource from '../../../resource/id';

import parking_on from '../../../../Common/img/imgGyeonggi/parking_on.svg';
import parking_off from '../../../../Common/img/imgGyeonggi/parking_off.svg';
import parking_none from '../../../../Common/img/imgGyeonggi/parking_none.svg';
import parking_error from '../../../../Common/img/imgGyeonggi/parking_error.svg';
import { GghController } from '../../../services/gghController';
import SettingsStore from '../../../../Settings/settingsStore';
import store from '../../../../Root/store';
import Loader from '../../../../Settings/ui/popups/loader';

class ParkingInfo_gg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parkingDatas: [],
            useParkingUplock: null
        }

        this.initPopupState = this.initPopupState.bind(this);
    }

    componentDidMount() {
        this.unsubscribeSettingsStore = SettingsStore.subscribe(() => {
            this.resetPopupState(SettingsStore.getState());
        });
    
        this.unsubscribeStore = store.subscribe(() => {
            let data = store.getState();
            if (data.parkingDatas) {
                this.setParkingData(data.parkingDatas);
            }
        });

        GghController.StartWatchTimerParking();

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

        this.initParkingUplock();
    }

    componentWillUnmount() {
        if (this.unsubscribeSettingsStore) {
            this.unsubscribeSettingsStore();
        }
    
        if (this.unsubscribeStore) {
            this.unsubscribeStore();
        }

        GghController.stopWatchTimerParking();
    }

    initParkingUplock = async () => {
        const result = await GghController.requestUseParkingUplock();

        if (result && result.success) {
            this.setState({ useParkingUplock: result.use });
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

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            var popup = document.getElementsByClassName('viewDashboardBoxD parkingInfo')[0];
            popup.style.zIndex = this.props.zIndex;
            console.log('ParkingInfoGGZIndex changed', popup.style.zIndex);
        }
    }

    initPopupState() {
        var popup = document.getElementsByClassName('viewDashboardBoxD parkingInfo')[0];

        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        }

        this.setState({ popup: popup });
    }

    setParkingData = (data) => {
        this.setState({ parkingDatas: data });
    }

    getParkingStatusIcon = (data) => {
        let url = null;

        // Closed(1) : 닫힘 (회색 아이콘)
        // Opened(2) : 열림 (초록 아이콘)
        // CloseError(3) : 통신오류 (빨간색 테두리 아이콘)

        switch(data)
        {
            case 0 : url = parking_error; break;
            case 1 : url = parking_on; break;
            case 2 : url = parking_off; break;
            case 3 : url = parking_error; break;
        }

        return url;
    }

    setChecked = async (use) => {
        if (this.state.useParkingUplock === use) return;

        const result = await GghController.updateParkingUplock(use);

        if (result.success) {
            this.setState({ useParkingUplock: use });
        }
        else {
            console.log(result.message);
        }
    }

    render() {
        return (
            <ParkingInfoGGComponent id={this.props.popupType} className={'viewDashboardBoxD parkingInfo'}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={310}
                    popupMinHeight={496}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                    usePopupResize={false}
                >
                    <div className={'dslTop dslGrd'}>
                        <h5 className={'dslTitle'} >
                            주차관제
                        </h5>
                        <a className={'dslX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.parkingInfo, false)}></a>
                    </div>
                    <div className={'dslCont'}>
                        <div className='upLockWrap'>
                            <p>자동 Up-Lock</p>
                            <ToggleSwitch
                                left="OFF" 
                                right="ON" 
                                leftcolor="#7D7E84" 
                                rightcolor="#7D7E84"
                                leftbgcolor="#0E162D" 
                                rightbgcolor="#0E162D"
                                setChecked={this.setChecked}
                                isChecked={this.state.useParkingUplock}
                            />
                        </div>
                        {
                            this.state.parkingDatas.length > 0 ?
                            <>
                                <ul className='headWrap'> 
                                    <li>
                                        <div>이벤트 발생</div>
                                        <div>입차</div>
                                        <div>출차</div>
                                    </li>
                                </ul>
                                <ul className='bodyWrap'>
                                    <li>
                                        <div>GATE1</div>
                                        <div><img src={this.getParkingStatusIcon(this.state.parkingDatas[0].status)} alt='입차 상태 아이콘' /></div>
                                        <div><img src={this.getParkingStatusIcon(this.state.parkingDatas[1].status)} alt='출차 상태 아이콘' /></div>
                                    </li>
                                    <li>
                                        <div>GATE2</div>
                                        <div><img src={this.getParkingStatusIcon(this.state.parkingDatas[2].status)} alt='입차 상태 아이콘' /></div>
                                        <div><img src={this.getParkingStatusIcon(this.state.parkingDatas[3].status)} alt='출차 상태 아이콘' /></div>
                                    </li>
                                    <li>
                                        <div>GATE3</div>
                                        <div><img src={this.getParkingStatusIcon(this.state.parkingDatas[4].status)} alt='입차 상태 아이콘' /></div>
                                        <div>
                                            <img src={this.getParkingStatusIcon(this.state.parkingDatas[5].status)} alt='출차 상태 아이콘' />
                                            <img src={this.getParkingStatusIcon(this.state.parkingDatas[6].status)} alt='출차 상태 아이콘' />
                                        </div>
                                    </li>
                                    <li>
                                        <div>GATE4</div>
                                        <div>
                                            <img src={this.getParkingStatusIcon(this.state.parkingDatas[7].status)} alt='입차 상태 아이콘' />
                                            <img src={this.getParkingStatusIcon(this.state.parkingDatas[8].status)} alt='입차 상태 아이콘' />
                                        </div>
                                        <div><img src={parking_none} alt='출차 상태 아이콘' /></div>
                                    </li>
                                    <li>
                                        <div>GATE5</div>
                                        <div><img src={this.getParkingStatusIcon(this.state.parkingDatas[9].status)} alt='입차 상태 아이콘' /></div>
                                        <div><img src={this.getParkingStatusIcon(this.state.parkingDatas[10].status)} alt='출차 상태 아이콘' /></div>
                                    </li>
                                    <li>
                                        <div>GATE6</div>
                                        <div><img src={this.getParkingStatusIcon(this.state.parkingDatas[11].status)} alt='입차 상태 아이콘' /></div>
                                        <div><img src={this.getParkingStatusIcon(this.state.parkingDatas[12].status)} alt='출차 상태 아이콘' /></div>
                                    </li>
                                    <li>
                                        <div>환승게이트</div>
                                        <div><img src={this.getParkingStatusIcon(this.state.parkingDatas[13].status)} alt='입차 상태 아이콘' /></div>
                                        <div><img src={this.getParkingStatusIcon(this.state.parkingDatas[14].status)} alt='출차 상태 아이콘' /></div>
                                    </li>
                                    
                                </ul>
                            </> :
                            <Loader
                                size="40px"
                                borderSize="5px"
                                baseColor="#fff"
                                wheelColor="#5398FF"
                                speed="700"
                            />
                        }
                    </div>
                </PopupDraggable>
            </ParkingInfoGGComponent>
        );
    }
}

export default ParkingInfo_gg;


function ToggleSwitch({ left, right, leftcolor, rightcolor, leftbgcolor, rightbgcolor, setChecked, isChecked }) {

    const handleChecked = () => {
        setChecked(!isChecked);
    }


    return (
        <Wrapper>
            <CheckBox
                $left={left}
                $right={right}
                $leftcolor={leftcolor}
                $rightcolor={rightcolor}
                $leftbgcolor={leftbgcolor}
                $rightbgcolor={rightbgcolor}
                onChange={() => handleChecked()}
                type="checkbox"
                checked={isChecked || ""}
            />
        </Wrapper>
    );
}


// css
const Wrapper = styled.div`
    justify-content: center;
    align-items: center;
    /* display: flex; */
    z-index: 0;
`;

const CheckBox = styled.input`
    width: 46px !important;
    height: 16px !important;
    background: ${(props) => props.$leftbgcolor ?? '#0E162D'} !important;
    border-radius: 13px !important;
    border: 0 !important;
    cursor: ${(props) => props.$pointer ? "default" : "pointer"} !important;

    &:disabled {
        background-color: ${(props) => props.$leftbgcolor ?? '#0E162D'} !important;
    }

    /* OFF 텍스트 */
    &::before {
        position: absolute;
        content: '${(props) => props.$left ?? 'OFF'}';
        padding-left: 2px;
        /* width: 46px; */
        height: 16px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: ${(props) => props.$leftcolor ?? '#7D7E84'};
        background: #0E162D;
        font-weight: 700;
        font-size: 10px;
        left: 22px;

        /* 텍스트 트랜지션 */
        transition: all 0.2s ease-in-out;
    }

    /* OFF 원 */
    &::after {
        position: relative;
        content: '';
        display: block;
        width: 22px;
        height: 22px;
        top: -3px;
        left: 0px;
        border-radius: 50%;
        background: #fff;

        /* 원 이동 트랜지션 */
        transition: all 0.2s ease-in-out;
    }

    &:checked {
        width: 46px !important;
        height: 16px !important;
        border-radius: 13px !important;
        border: 0 !important;
        background: ${(props) => props.$rightbgcolor ?? '#0E162D'}!important;

        /* 배경색 변경 트랜지션 */
        transition: all 0.2s ease-in-out;

        /* ON 텍스트 */
        &::before {
            position: absolute;
            content: '${(props) => props.$right ?? 'ON'}';
            align-items: center;
            justify-content: flex-end;
            color: ${(props) => props.$rightcolor ?? '#7D7E84'};
            left: 4px;
        }

        /* ON 원 */
        &::after {
            content: '';
            z-index: 2;
            width: 22px;
            height: 22px;
            top: -3px;
            left: 24px;
            display: block;
            border-radius: 50%;
            background: #5398FF;
            position: relative;
        }
    }
`;