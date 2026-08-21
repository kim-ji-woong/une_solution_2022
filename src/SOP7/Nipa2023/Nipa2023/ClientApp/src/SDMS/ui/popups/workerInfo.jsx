import React, { Component } from 'react';
import $ from 'jquery';
import Monitoring from '../monitoring';
import PopupDraggable from './popupDraggable';

import SDMSResource from '../../resource/id';

import { WorkerInfoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';

    
class WorkerInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeType: -1
        }

        this.props = props;
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
        var popup = document.getElementsByClassName('UI_Section workerInfo')[0];

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
        let workerView = [];
        let equipmentView = [];
        let apCount = 0;
        let tagCount = 0;

        const apStatistics = this.props.apStatistics;
        const workerStatistics = this.props.workerStatistics;
        const selectedSensor = this.props.selectedSensor;

        if(apStatistics) {

            let factoryClassName = 'on';
            let undergroundClassName = 'on';

            if(selectedSensor?.positionName.replace(/(\s*)/g, "") === SdmsResource.ID.workerAPs.equipment22 || 
                selectedSensor?.positionName.replace(/(\s*)/g, "") === SdmsResource.ID.workerAPs.equipmentTightening || 
                selectedSensor?.positionName.replace(/(\s*)/g, "") === SdmsResource.ID.workerAPs.equipment23 ||
                selectedSensor?.positionName.replace(/(\s*)/g, "") === SdmsResource.ID.workerAPs.equipmentBuilding) {
                undergroundClassName = '';
                
            }
            else if(selectedSensor?.positionName.replace(/(\s*)/g, "") === SdmsResource.ID.workerAPs.underground) {
                factoryClassName = '';
            }

            workerView.push(
                <ul key='workerSensor_info'>
                    <li className={factoryClassName} id={selectedSensor?.positionName.replace(/(\s*)/g, "") === SdmsResource.ID.workerAPs.equipmentBuilding ? 'active' : null}>
                        <p>사출신동</p>
                        <p>{apStatistics.locationWorkerCount[SdmsResource.ID.workerAPs.equipmentBuilding] ? apStatistics.locationWorkerCount[SdmsResource.ID.workerAPs.equipmentBuilding] : 0}명</p>
                    </li>
                    <li className={factoryClassName} id={selectedSensor?.positionName.replace(/(\s*)/g, "") === SdmsResource.ID.workerAPs.equipment22 ? 'active' : null}>
                        <p>사출22호기</p>
                        <p>{apStatistics.locationWorkerCount[SdmsResource.ID.workerAPs.equipment22] ? apStatistics.locationWorkerCount[SdmsResource.ID.workerAPs.equipment22] : 0}명</p>
                    </li>
                    <li className={factoryClassName} id={selectedSensor?.positionName.replace(/(\s*)/g, "") === SdmsResource.ID.workerAPs.equipmentTightening ? 'active' : null}>
                        <p>장비협착</p>
                        <p>{apStatistics.locationWorkerCount[SdmsResource.ID.workerAPs.equipmentTightening] ? apStatistics.locationWorkerCount[SdmsResource.ID.workerAPs.equipmentTightening] : 0}명</p>
                    </li>
                    <li className={factoryClassName} id={selectedSensor?.positionName.replace(/(\s*)/g, "") === SdmsResource.ID.workerAPs.equipment23 ? 'active' : null}>
                        <p>사출23호기</p>
                        <p>{apStatistics.locationWorkerCount[SdmsResource.ID.workerAPs.equipment23] ? apStatistics.locationWorkerCount[SdmsResource.ID.workerAPs.equipment23] : 0}명</p>
                    </li>
                    <li className={undergroundClassName} id={selectedSensor?.positionName.replace(/(\s*)/g, "") === SdmsResource.ID.workerAPs.underground && selectedSensor.facilityType === SdmsResource.facilityType.WORKER ? 'active' : null}>
                        <p>지하공동구</p>
                        <p>{apStatistics.locationWorkerCount[SdmsResource.ID.workerAPs.underground] ? apStatistics.locationWorkerCount[SdmsResource.ID.workerAPs.underground] : 0}명</p>
                    </li>
                </ul>
            );

            if(workerStatistics) {
                apCount = apStatistics.normalCount + apStatistics.lowCount + apStatistics.changingCount;
                tagCount= workerStatistics.normalCount + workerStatistics.changingCount;

                equipmentView.push(
                    <div className='chartWrap' key='workerCount_info'>
                        <div>
                            <div>
                                <span className='title'>Safe-AP</span>
                                <span className='count'>{apCount}</span>
                            </div>
                            <ul key='apStatistics_count'>
                                <li className={apStatistics.normalCount > 0 ? 'normal' : 'gray'}>
                                    정상 : {apStatistics.normalCount > 0 ? apStatistics.normalCount : '-'}
                                </li>
                                <li className={apStatistics.changingCount > 0 ? 'change' : 'gray'}>
                                    교체 : {apStatistics.changingCount > 0 ? apStatistics.changingCount : '-'}
                                </li>
                            </ul>
                        </div>
                        <div>
                            <div>
                                <span className='title'>Safe-TAG</span>
                                <span className='count'>{tagCount}</span>
                            </div>
                            <ul key='workerStatistics_count'>
                                <li className={workerStatistics.normalCount > 0 ? 'normal' : 'gray'}>
                                    정상 : {workerStatistics.normalCount > 0 ? workerStatistics.normalCount : '-'}
                                </li>
                                <li className={workerStatistics.changingCount > 0 ? 'change' : 'gray'}>
                                    교체 : {workerStatistics.changingCount > 0 ? workerStatistics.changingCount : '-'}
                                </li>
                            </ul>
                        </div>
                    </div>
                );


            }
        }

        return [workerView, equipmentView];
    }

    render() {

        const [workerView, equipmentView] = this.getDisplayView();

        return (
            <WorkerInfoComponent id={this.props.popupType} className='UI_Section workerInfo'>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={340}
                    popupMinHeight={315}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >
                    <div className={'dslTop'}>
                        <h5 className={'dslTitle'} >
                            작업자 정보
                        </h5>
                        <div className={'dslX'} onClick={() => this.props.setVisiblePopups(Monitoring.menu.workerInfo, false)}>
                            <a href="#none">닫기버튼</a>
                        </div>
                    </div>

                    <div className={'dslCont'}>
                        <div className='workerWrap'>
                            <h5>구역별 작업자 현황</h5>
                            {workerView}
                        </div>
                        <div className='equipmentWrap'>
                            <div className='titleWrap'>
                                <h5>장비 현황</h5>
                                <button 
                                    className={this.props.WorkerInfoEquipmentStatusPopupOpen ? 'on' : null}
                                    onClick={() => this.props.handlePopup(SDMSResource.ID.menu.workerInfoEquipmentStatus, true)
                                }>자세히보기</button>
                            </div>
                            {equipmentView}
                        </div>
                    </div>
                </PopupDraggable>
            </WorkerInfoComponent>
        );
    }
}

export default WorkerInfo;