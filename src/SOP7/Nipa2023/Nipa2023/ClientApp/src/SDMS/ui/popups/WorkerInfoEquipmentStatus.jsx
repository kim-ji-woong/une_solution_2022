import React, { Component } from 'react';
import $ from 'jquery';
import PopupDraggable from './popupDraggable';

import ProjectResource from '../../../Root/resource/id';
import SDMSResource from '../../resource/id';

import { WorkerInfoEquipmentStatusComponent } from '../../styled/sdmsPopupsStyled';
import { SdmsController } from '../../services/sdmsController';
import SdmsResource from '../../resource/id';

// 장비현황 상세정보
class WorkerInfoEquipmentStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: SDMSResource.equipmentStatusMenu.AP
        }

        this.props = props;

        this.init();
    }

    async init() {
        const campusID = ProjectResource.campusID;

        if(campusID) {
            const [apDatas, apMessage] = await SdmsController.requestAPList(campusID);

            if(apDatas) {
                const [tagDatas, tagMessage] = await SdmsController.requestWorkerList(campusID);

                if(tagDatas) {
                    this.setState({ apDatas, tagDatas });
                }
                else {
                    this.props.showConfirmDialog([tagMessage], null, null, 'error');
                }
            }
            else {
                this.props.showConfirmDialog([apMessage], null, null, 'error');
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

        $('.scrollbar').scrollTop(0);
    }

    componentDidUpdate(prevProps, prevState) {
        const tableBody = document.getElementById('scrollTop');
        tableBody.scrollTop = 0;

        if(prevProps.isPopupStateReset !== this.props.isPopupStateReset) {
            this.repositionPopup();
        }
    }

    initPopupState() {
        var popup = document.getElementsByClassName('UI_Section workerInfoEquipmentStatus')[0];

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

    onChangeMenu = (menu) => {
        const navMenu = this.state.menu;

        if(navMenu !== menu) {
            this.setState({ menu: menu });
        }
    }

    getDatas = (menu) => {

        if(menu === SdmsResource.equipmentStatusMenu.AP) {
            const apList = [];
            const apDatas = this.state.apDatas;
            let apIndex = 1;
    
            if(apDatas) {
                for(let i = 0; i < apDatas.length; i++) {
                    const apData = apDatas[i];
    
                    apList.push(
                        <li key={apDatas[i].macAddress}>
                            <ul>
                                <li>{apIndex}</li>
                                <li>{apData.name}</li>
                                <li>{apData.powerType}</li>
                                <li>{apData.mapping ? 'Y' : 'N'}</li>
                                <li>{apData.regDate}</li>
                                <li><span className={apData.use ? 'greenDOTT' : 'grayDOTT'}>{apData.use ? '사용' : '미사용'}</span></li>
                                <li>{apData.locationName}</li>
                            </ul>
                        </li>
                    );
                    apIndex++;
                }
            }
    
            return [apList, apIndex -1];
        }
        else if (menu === SdmsResource.equipmentStatusMenu.TAG) {
            const tagList = [];
            const tagDatas = this.state.tagDatas;
            let tagIndex = 1;

            if(tagDatas) {
                for(let i = 0; i < tagDatas.length; i++) {
                    const tagData = tagDatas[i];
    
                    tagList.push(
                        <li key={tagDatas[i].macAddress}>
                            <ul>
                                <li>{tagIndex}</li>
                                <li>{tagData.name}</li>
                                <li>{tagData.powerType}</li>
                                <li>{tagData.mapping ? 'Y' : 'N'}</li>
                                <li>{tagData.regDate}</li>
                                <li><span className={tagData.use ? 'greenDOTT' : 'grayDOTT'}>{tagData.use ? '사용' : '미사용'}</span></li>
                                <li>{tagData.workerName}</li>
                            </ul>
                        </li>
                    );
                    tagIndex++;
                }
            }
    
            return [tagList, tagIndex -1];
        }
    }

    render() {
        const navMenu = this.state.menu;
        const [displayView, totalCount] = this.getDatas(navMenu);

        return (
            <WorkerInfoEquipmentStatusComponent id={this.props.popupType} className='UI_Section workerInfoEquipmentStatus'>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={470}
                    popupMinHeight={250}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >
                    <div className={'dslTop'}>
                        <h5 className={'dslTitle'} >
                            장비현황 상세정보
                        </h5>
                        <div className={'dslX'} onClick={() => this.props.handlePopup(SDMSResource.ID.menu.workerInfoEquipmentStatus, false)}>
                            <a href="#none">닫기버튼</a>
                        </div>
                    </div>

                    <div className={'dslCont'}>
                        <div className='tabMenu'>
                            <ul>
                                <li 
                                    className={navMenu === SdmsResource.equipmentStatusMenu.AP ? 'on' : null} 
                                    onClick={() => this.onChangeMenu(SdmsResource.equipmentStatusMenu.AP)}
                                >
                                    {SdmsResource.ID.equipmentStatusMenu.ap}
                                </li>
                                <li 
                                    className={navMenu === SdmsResource.equipmentStatusMenu.TAG ? 'on' : null} 
                                    onClick={() => this.onChangeMenu(SdmsResource.equipmentStatusMenu.TAG)}
                                >
                                    {SdmsResource.ID.equipmentStatusMenu.tag}
                                </li>
                            </ul>
                        </div>

                        <p className='totalCount'>
                            총 {navMenu === SdmsResource.equipmentStatusMenu.AP ? 'AP' : 'TAG'} 개수 : {totalCount}
                        </p>

                        <div className='contentTable'>
                            <ul className='tableHead'>
                                <li>No.</li>
                                <li>장비명</li>
                                <li>전원타입</li>
                                <li>매핑여부</li>
                                <li>등록일</li>
                                <li>사용여부</li>
                                <li>{navMenu === SdmsResource.equipmentStatusMenu.AP ? "구역정보" : "작업자정보"}</li>
                            </ul>
                            <ul className='tableBody' id='scrollTop'>
                                {displayView}
                            </ul>
                        </div>
                    </div>
                </PopupDraggable>
            </WorkerInfoEquipmentStatusComponent>
        );
    }
}

export default WorkerInfoEquipmentStatus;