import React, { Component } from 'react';

import $ from 'jquery';
import SDMSResource from '../../resource/id';
import content from '../../../Common/css/content.module.css';
import PopupDraggable from './popupDraggable';
import SettingsStore from '../../../Settings/settingsStore';
import SDMS from '../sdms';


import { SensorInfoBox, SensorTitleIcon, SensorDetailTitle } from './../../styled';
import { ReferenceTime } from './../../styled';
import { SensorTitleD } from './../../styled';
import { SeosorCloseIcon } from './../../styled';
import { SensorDetailBox } from './../../styled';


class DetailInfo extends Component {

    constructor(props) {
        super(props);

        this.initPopupState = this.initPopupState.bind(this);
        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));
    }

    componentDidMount() {

        this.initPopupState();
    }

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
        }

        //this.setScrollbar();
    }

    initPopupState() {
        var popup = document.getElementsByClassName(content.detailPopup)[0];

        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        }

        this.setState({ popup: popup });
    }

    repositionPopup(popupState) {
        let data = popupState.detailInfo;

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

    //팝업 리사이즈 이벤트 리스너
    popupResizeMouseMove = (event) => {
        let sizeY = 0;

        switch (this.state.resizeType) {
            // 수직
            case 'v-b': // 바텀 수직
                sizeY = event.pageY - this.state.originalY;

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    //그리드 사이즈를 부모(팝업) 사이즈 비율대로 조절
                    const grid = this.findElementByClassName(content.detailPopup);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            case 'v-t': //탑 수직
                sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(content.detailPopup);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            // 대각
            case 'd-rb': // 오른쪽 하단 대각
                sizeY = event.pageY - this.state.originalY;

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(content.detailPopup);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            case 'd-rt': //오른쪽 상단 대각
                sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(content.detailPopup);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            case 'd-lb': //왼쪽 하단 대각
                sizeY = event.pageY - this.state.originalY;

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(content.detailPopup);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            case 'd-lt': //왼쪽 상단 대각
                sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(content.detailPopup);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            default:
        }
    }

    popupResizeMousePress = (event, resizeType) => {
        const popup = document.getElementById(this.props.popupType);

        this.setState({
            maxScreenHeight: document.getElementsByTagName('body')[0].clientHeight,
            maxScreenWidth: document.getElementsByTagName('body')[0].clientWidth,
            resizeType: resizeType,
            originalMouseX: event.pageX,
            originalMouseY: event.pageY,
            originalWidth: document.getElementById(this.props.popupType).clientWidth,
            originalHeight: document.getElementById(this.props.popupType).clientHeight,
            originalX: document.getElementById(this.props.popupType).getBoundingClientRect().left,
            originalY: document.getElementById(this.props.popupType).getBoundingClientRect().top,
        });
    }

    popupResizeMouseUp = () => {
        this.setState({ resizeType: null });
    }


    render() {
        return (
            <>
                <div id={this.props.popupType} className={content.detailPopup + " " + SDMSResource.UISection}>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={373}
                        popupMinHeight={249}
                        topSize={32}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                    >

                <SensorInfoBox>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <SensorTitleIcon></SensorTitleIcon>
                        <SensorDetailTitle>센서 상세정보</SensorDetailTitle>
                        <ReferenceTime>15:20:00 기준</ReferenceTime>
                        <SeosorCloseIcon onClick={() => this.props.setVisiblePopups(SDMS.menu.detailInfo, false)}></SeosorCloseIcon>
                    </div>

                    <SensorDetailBox>
                        <span>데이터 정보가 없습니다.</span>
                        <span>팝업창 또는 지도에서 센서정보를 활성화하세요.</span>
                    </SensorDetailBox>
                </SensorInfoBox>

                </PopupDraggable>
                </div> 

            </>

        );
    }
 
}

export default DetailInfo;

