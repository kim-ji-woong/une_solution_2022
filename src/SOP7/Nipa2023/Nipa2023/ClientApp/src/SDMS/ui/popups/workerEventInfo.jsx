import React, { Component } from 'react';
import $ from 'jquery';
import PopupDraggable from './popupDraggable';

import { WorkerEventInfoComponent } from '../../styled/sdmsPopupsStyled';
import ProjectResource from '../../../Root/resource/id';
import SDMSResource from '../../resource/id';
import { SdmsController } from '../../services/sdmsController';

import modelingImg from '../../images/worker_event_img.jpg';
import under_modelingImg from '../../images/worker_event_img_under.png';
import focusIcon from '../../images/focusIcon.png';

class WorkerEventInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }

        this.props = props;

        this.init();
    }

    async init() {
        const campusID = ProjectResource.campusID;

        if(campusID) {

            const [tagDatas, tagMessage] = await SdmsController.requestWorkerList(campusID);

            if(tagDatas) {
                this.setState({ tagDatas });
            }
            else {
                this.props.showConfirmDialog([tagMessage], null, null, 'error');
            }
        }
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
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.isPopupStateReset !== this.props.isPopupStateReset) {
            this.repositionPopup();
        }
    }

    initPopupState() {
        var popup = document.getElementsByClassName('UI_Section workerEventInfo')[0];

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

    displayView() {
        let displayView = [];

        const selectedAlarm = this.props.selectedAlarm;
        const tagDatas = this.state.tagDatas;
        
        if(selectedAlarm && tagDatas) {

            displayView.push(
                <ul>
                    <li>유형 : {selectedAlarm.facilityTypeName}</li>
                    <li>TAG 번호 : {selectedAlarm.workerTag}</li>
                    <li>발생위치 : {selectedAlarm.positionName + '_' + selectedAlarm.sensorName}</li>
                    <li>기타사항 : {selectedAlarm.etc ? selectedAlarm.etc : '-'}</li>
                </ul>
            );
        }

        return displayView;
    }

    getModelingImg = () => {
        const selectedAlarm = this.props.selectedAlarm;

        const AP_Position = [
            {id: 'AP01', top: '-2%', left: '-4%'},
            {id: 'AP02', top: '-13%', left: '41%'},
            {id: 'AP03', top: '-13%', left: '62%'},
            {id: 'AP04', top: '-10%', left: '93%'},
            {id: 'AP05', top: '82%', left: '38%'},
            {id: 'AP06', top: '70%', left: '80%'},
            {id: 'AP07', top: '-2%', left: '80%'},
            {id: 'AP08', top: '70%', left: '67%'},
            {id: 'AP09', top: '-2%', left: '67%'},
            {id: 'AP10', top: '15%', left: '69%'},
            {id: 'AP11', top: '34%', left: '66%'},
            {id: 'AP12', top: '22%', left: '62%'},
            {id: 'AP13', top: '22%', left: '62%'},
            {id: 'AP14', top: '13%', left: '50%'},
        ]

        if(selectedAlarm) {
            for(let position of AP_Position) {
                if(position.id === selectedAlarm.sensorName) {
                    console.log(selectedAlarm.sensorName);

                    return (
                        <div>
                            {
                                selectedAlarm.positionName === '지하공동구' ?
                                    <div className='under_modelingImg_wrap'>
                                        <p>지하공동구</p>
                                        <img src={under_modelingImg} alt='대형사출라인 모델링 사진' className='modelingImg_under' />
                                    </div> :
                                    <img src={modelingImg} alt='대형사출라인 모델링 사진' className='modelingImg' />
                            }
                            <img 
                                src={focusIcon} 
                                alt='위치 아이콘' 
                                className='focusIcon'
                                style={{ top: position.top, left: position.left }}
                            />
                        </div>
                    );
                }
            }
        }

        return <></>;
    }

    render() {
        const displayView = this.displayView();
        const modelingImg = this.getModelingImg();

        return (
            <WorkerEventInfoComponent id={this.props.popupType} className='UI_Section workerEventInfo'>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={340}
                    popupMinHeight={308}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >
                <div className={'dslTop'}>
                    <h5 className={'dslTitle'} >
                        작업자 이벤트 상세정보
                    </h5>
                    <div className={'dslX'} onClick={() => this.props.handlePopup(SDMSResource.ID.menu.workerEventInfo, false)}>
                        <a href="#none">닫기버튼</a>
                    </div>
                </div>

                <div className='dslCont'>
                    {modelingImg}
                    {displayView}
                </div>
                </PopupDraggable>
            </WorkerEventInfoComponent>
        );
    }
}


export default WorkerEventInfo;