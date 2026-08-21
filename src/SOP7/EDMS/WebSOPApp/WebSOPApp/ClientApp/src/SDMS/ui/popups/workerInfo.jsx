import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';
import content from '../../../Common/css/content.module.css';
import SettingsStore from '../../../Settings/settingsStore';
import SDMS from '../sdms';
import SDMSResource from '../../resource/id';
import PopupDraggable from './popupDraggable';
import RootResource from '../../../Root/resource/id';

//import Chart from "react-google-charts";
import { Bar } from 'react-chartjs-2'
import $ from 'jquery';


class WorkerInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popupMinWidth: 200,
            popupMinHeight: 140,
        }

        //this.initPopupState = this.initPopupState.bind(this);

        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));

        if (SDMS.UseWalkingAvatar) {
            this.refPosX = React.createRef();
            this.refPosY = React.createRef();
            this.refPosZ = React.createRef();
            this.refScaleX = React.createRef();
            this.refScaleY = React.createRef();
            this.refScaleZ = React.createRef();
        }
    }


    componentDidMount() {
        //const doughnut = document.getElementById('doughnut');
        //const Bar = document.getElementById('bar');

        // 창이 서서히 나타나는 효과
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

        //this.initPopupState();
    }


    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
        }
    }


    /* initPopupState() {
        var popup = document.getElementsByClassName(content.viewDashboardBoxD + ' ' + content.viewDashboardWorkerInfo)[0];

        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        }

        this.setState({ popup: popup });
    } */


    repositionPopup(popupState) {
        let data = popupState.workerInfo;

        if (data === null || data === undefined)
            return;

        //let popup = document.getElementsByClassName(content.viewDashboardBoxD + ' ' + content.viewDashboardWorkerInfo)[0];
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

    onClickDetail = () => {
        this.setState({ dashboardDetail: true });
        let url = window.location.origin + RootResource.path.dashboard;
        window.open(url, "_blank");
    }

    render() {

        return(
            <div id={this.props.popupType} className={content.viewDashboardBoxD + ' ' + content.viewDashboardWorkerInfo}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={240}
                    popupMinHeight={140}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >

                <div className={content.dslTop + " " + content.dslGrd}>
                    <h5 className={content.dslTitle}>
                        작업자정보
                    </h5>
                    <a className={content.dslX} onClick={() => this.props.setVisiblePopups(SDMS.menu.workerInfo, false)}></a>
                </div>

                <div className={content.workerTopBox}>
                  <span className={content.workerPlace}>P10_8층 전기실</span>
                  <span className={content.nextIcon} onClick={this.onClickDetail}></span>
                </div>
                <div className={content.workerDetailBox}>
                   <span className={content.workerIcon}></span>
                   <span className={content.workerNum}>10</span>
                </div>
                </PopupDraggable>
            </div>
        );
    }
}

export default WorkerInfo;