import React, { Component } from 'react';
import $ from 'jquery';
import PopupDraggable from './popupDraggable';

import SDMSResource from '../../resource/id';

import { StatusPsmSensorInfoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';

    
class StatusPsmSensorInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        var popup = document.getElementsByClassName('UI_Section statusPsmSensorInfo')[0];

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

    // 툴팁 띄우기
    onTooltip = (value) => {
        const target = document.getElementsByClassName('toolTipContent');
        
        if (value) {
            target[0].classList.add('on');
        } else {
            target[0].classList.remove('on');
        }
    }

    getSensorInfo = () => {
        let title = '';
        const table = [];
        const tooltipContent = [];

        const sensorDetailInfo = this.props.sensorDetailInfo;
        const sensorInfos = sensorDetailInfo['sensorInfos'];
        const facilityType = sensorDetailInfo['facilityType'];

        if(facilityType === SDMSResource.facilityType.ATMOSPHERE) {
            title = '대기오염센서 상세정보';

            if (sensorInfos?.length > 0) {
            
                for(let i = 0; i < sensorInfos.length; i++){
                    let data = sensorInfos[i];
    
                    if (data.materialName === 'OU') {
                        data.materialName = '복합악취(' + data.materialName + ')'; 
                    }
                    else if (data.materialName === '휘발성 유기화합물') {
                        data.materialName = data.materialName + '(VOC)'; 
                    }
    
                    let sticksClassName = '';
                    if (!data.status) {
                        sticksClassName = 'stickGray';
                    }
                    else if (data.status === 1) {
                        sticksClassName = 'stickBlue';
                    }
                    else if (data.status === 2) {
                        sticksClassName = 'stickGreen';
                    }
                    else if (data.status === 3) {
                        sticksClassName = 'stickOrange';
                    }
                    else if (data.status === 4) {
                        sticksClassName = 'stickRed';
                    }
    
                    table.push(
                        <li className={data.status === 4 ? 'body red' : 'body'} key={'sensorDetailInfo_' + i}>
                            <span>{data.materialName}</span>
                            <span>{data.data !== null ? data.data + data.uoM : '-'}</span>
                            <span className='stick'>
                                <span className={sticksClassName}></span>
                            </span>
                        </li>
                    )
                }
            }

            tooltipContent.push(
                <div className='toolTipContent' key="toolTipContent">
                    <ul className='toolTipHead'>
                        <li><span>측정항목</span></li>
                        <li><span>단계</span></li>
                    </ul>
                    <ul className='toolTipBody'>
                        <li><span>초미세먼지(PM2.5)</span></li>
                        <li>
                            <ul className='chart'>
                                <li>
                                    <div><span className='blueTxt'>좋음</span><span>0-15</span></div>
                                    <div><span className='greenTxt'>보통</span><span>16-35</span></div>
                                    <div><span className='yellowTxt'>나쁨</span><span>36-75</span></div>
                                    <div><span className='redTxt'>매우나쁨</span><span>76-</span></div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <ul className='toolTipBody'>
                        <li><span>미세먼지(PM10)</span></li>
                        <li>
                            <ul className='chart'>
                                <li>
                                    <div><span className='blueTxt'>좋음</span><span>0-30</span></div>
                                    <div><span className='greenTxt'>보통</span><span>31-80</span></div>
                                    <div><span className='yellowTxt'>나쁨</span><span>81-150</span></div>
                                    <div><span className='redTxt'>매우나쁨</span><span>151-</span></div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <ul className='toolTipBody'>
                        <li><span>복합악취(OU)</span></li>
                        <li>
                            <ul className='chart'>
                                <li>
                                    <div><span className='blueTxt'>좋음</span><span>0-5</span></div>
                                    <div><span className='greenTxt'>보통</span><span>6-10</span></div>
                                    <div><span className='yellowTxt'>나쁨</span><span>11-15</span></div>
                                    <div><span className='redTxt'>매우나쁨</span><span>16-</span></div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <ul className='toolTipBody'>
                        <li><span>휘발성 유기 화합물(VOC)</span></li>
                        <li>
                            <ul className='chart'>
                                <li>
                                    <div><span className='blueTxt'>좋음</span><span>0-1.2</span></div>
                                    <div><span className='greenTxt'>보통</span><span>1.3-3.6</span></div>
                                    <div><span className='yellowTxt'>나쁨</span><span>3.7-10.8</span></div>
                                    <div><span className='redTxt'>매우나쁨</span><span>10.9-</span></div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            )
        }
        else if(facilityType === SDMSResource.facilityType.GAS) {
            title = '가스센서 상세정보';

            if (sensorInfos?.length > 0) {
            
                for(let i = 0; i < sensorInfos.length; i++){
                    let data = sensorInfos[i];
    
                    if (data.materialName === 'O2') {
                        data.materialName = '산소(O₂)'; 
                    }
                    else if (data.materialName === 'CO') {
                        data.materialName = '일산화탄소(' + data.materialName + ')'; 
                    }
                    else if (data.materialName === 'CO2') {
                        data.materialName = '이산화탄소(CO₂)'; 
                    }
                    else if (data.materialName === 'H2S') {
                        data.materialName = '황화수소(' + data.materialName + ')'; 
                    }
                    else if (data.materialName === 'CH4') {
                        data.materialName = '가연성가스(CH₄)'; 
                    }
    
                    let sticksClassName = '';
                    if (!data.status) {
                        sticksClassName = 'stickGray';
                    }
                    else if (data.status === 1) {
                        sticksClassName = 'stickBlue';
                    }
                    else if (data.status > 1) {
                        sticksClassName = 'stickRed';
                    }
    
                    table.push(
                        <li className={data.status > 1 ? 'body red' : 'body'} key={'sensorDetailInfo_' + i}>
                            <span>{data.materialName}</span>
                            <span>{data.data !== null ? data.data + data.uoM : '-'}</span>
                            <span className='stick'>
                                <span className={sticksClassName}></span>
                            </span>
                        </li>
                    )
                }
            }

            tooltipContent.push(
                <div className='toolTipContent'>
                    <ul className='toolTipHead'>
                        <li><span>측정항목</span></li>
                        <li><span>단계</span></li>
                    </ul>
                    <ul className='toolTipBody'>
                        <li><span>산소(O₂)</span></li>
                        <li>
                            <ul className='chart'>
                                <li>
                                    <div><span className='blueTxt'>좋음</span><span>18-23.4</span></div>
                                    <div><span className='redTxt'>위험</span><span>0-17 / 23.5-</span></div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <ul className='toolTipBody'>
                        <li><span>일산화탄소(CO)</span></li>
                        <li>
                            <ul className='chart'>
                                <li>
                                    <div><span className='blueTxt'>좋음</span><span>0-29</span></div>
                                    <div><span className='redTxt'>위험</span><span>30-</span></div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <ul className='toolTipBody'>
                        <li><span>이산화탄소(CO₂)</span></li>
                        <li>
                            <ul className='chart'>
                                <li>
                                    <div><span className='blueTxt'>좋음</span><span>0-1.4</span></div>
                                    <div><span className='redTxt'>위험</span><span>1.5-</span></div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <ul className='toolTipBody'>
                        <li><span>황화수소(H2S)</span></li>
                        <li>
                            <ul className='chart'>
                                <li>
                                    <div><span className='blueTxt'>좋음</span><span>0-9</span></div>
                                    <div><span className='redTxt'>위험</span><span>10-</span></div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <ul className='toolTipBody'>
                        <li><span>가연성가스(CH₄)</span></li>
                        <li>
                            <ul className='chart'>
                                <li>
                                    <div><span className='blueTxt'>좋음</span><span>0-9</span></div>
                                    <div><span className='redTxt'>위험</span><span>10-</span></div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            )
        }

        return [table, title, tooltipContent, facilityType];
    }

    render() {
        const [table, title, tooltipContent, facilityType] = this.getSensorInfo();

        return (
            <StatusPsmSensorInfoComponent id={this.props.popupType} className='UI_Section statusPsmSensorInfo' $facilityType={facilityType}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={304}
                    popupMinHeight={220}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >
                    <div className={'dslTop'}>
                        <div className='titleWrap'>
                            <h5 className={'dslTitle'} >
                                {title}
                            </h5>
                        </div>
                        <div className={'dslX'} onClick={() => this.props.handlePopup(SdmsResource.ID.menu.statusPsmSensorInfo, false)}>
                            <a href="#none">닫기버튼</a>
                        </div>
                    </div>

                    <div className={'dslCont'}>
                        <ul>
                            <li className='head'>
                                <span>측정항목</span>
                                <span>수치</span>
                                <div className='toolTipWrap'>
                                    <span className='stick'>위험도</span>
                                    <span className='toolTip' 
                                        onMouseEnter={() => this.onTooltip(true)}
                                        onMouseOut={() => this.onTooltip(false)}
                                    >위험도 상세보기</span>
                                    {tooltipContent}
                                </div>
                            </li>
                            <li>
                                <ul className='bodyWrap'>
                                    {table}
                                </ul>
                            </li>
                        </ul>
                    </div>
                </PopupDraggable>
            </StatusPsmSensorInfoComponent>
        );
    }
}

export default StatusPsmSensorInfo;