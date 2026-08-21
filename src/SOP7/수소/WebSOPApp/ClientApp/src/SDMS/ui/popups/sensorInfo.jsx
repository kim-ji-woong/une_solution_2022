import { ui } from 'jquery';
import React, { Component } from 'react';
import content from '../../../Common/css/content.module.css';
import SDMS from '../sdms';
import SdmsResource from '../../resource/id';
import uneStyles from '../../../Common/css/uneCommon.module.css';
import SettingsStore from '../../../Settings/settingsStore';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { SdmsScrollbar } from './SdmsScrollbar';
import imgClose from '../../../Common/img/imghydrogen/common/closeX_icon.svg';
import PopupDraggable from './popupDraggable';
import $ from 'jquery';

import { SensorInfoComponent } from '../../styled/sdmsPopupsStyled';
import ProjectResource from '../../../Root/resource/id';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';

class SensorInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // 데이터 정보
            kind: "",
        }

        this.props = props;

        if (this.props.info !== null && this.props.info !== undefined) {
            this.initInfo(this.props.info);
        }

        //this.initInfo(this.props.info);

        // TODO: 샘플 데이터 예시
        //let arrInfo = new Array();
        //arrInfo[0] = SdmsResource.ID.buildingInfo.equipmentType;         // 건물 or 설비
        //arrInfo[1] = "HF 탱크";                                          // 설비 이름
        //arrInfo[2] = "HF";                                               // 취급물질(대표)
        //arrInfo[3] = "안준후";                                           // 담당자
        //arrInfo[4] = "010-123-1234";                                  // {i18n.t('sdms.formText.담당자 연락처')}

        //let arrInfo = new Array();
        //arrInfo[0] = SdmsResource.ID.buildingInfo.buildingType;         // 건물 정보인지 설비 정보인지 구별
        //arrInfo[1] = "1동";                                              // 건물 이름
        //arrInfo[2] = "CVD 공장";                                         // 건물 타입
        //arrInfo[3] = "9,501.86m2";                                         // 면적 
        //arrInfo[4] = "2012년 8월 15일";                                  // 준공일
        //this.initInfo(arrInfo);

        //this.initPopupState = this.initPopupState.bind(this);

        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));

        this.refRoot = React.createRef();
        this.refTitle = React.createRef();
        this.refScrollbar = React.createRef();
        this.refDataList = React.createRef();
    }

    componentDidMount() {
        // 창이 서서히 나타나는 효과
        $('#' + this.props.popupType).animate({ opacity: 1 }, SdmsResource.PopupAniTime, () => {
            if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                document.getElementById(this.props.popupType).style.opacity = 1;
            }
        });

        //this.initPopupState();
        this.setScrollbar();
    }

    setScrollbar() {
        if (!this.refRoot.current || !this.refTitle.current) {
            SdmsScrollbar.setContentStyle(this.refScrollbar.current, 100, 100, false);
            return;
        }

        const rectRoot = this.refRoot.current.getBoundingClientRect();
        const rectTitle = this.refTitle.current.getBoundingClientRect();
        const width = rectTitle.width - 10;
        const height = rectRoot.height - rectTitle.height - 40;

        let scrollVisible = false;

        if (this.refDataList.current) {
            const rectList = this.refDataList.current.getBoundingClientRect();

            if (rectList.height > height) {
                scrollVisible = true;
            }
        }

        SdmsScrollbar.setContentStyle(this.refScrollbar.current, width, height, scrollVisible);
    }

    /* initPopupState() {
        var popup = document.getElementsByClassName('viewDashboardBoxD viewDashboardBuilding')[0];

        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        }

        this.setState({ popup: popup });
    } */

    repositionPopup(popupState) {
        let data = popupState.sensorInfo;

        if (data === null || data === undefined)
            return;

        //let popup = document.getElementsByClassName('viewDashboardBoxD viewDashboardBuilding')[0];
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

    initInfo = (arrInfo) => {
        if (arrInfo === null || arrInfo === undefined || arrInfo.length !== 5)
            return;

        this.state.kind = arrInfo[0];
    }

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            var popup = document.getElementsByClassName('viewDashboardBoxD viewDashboardBuilding')[0];
            popup.style.zIndex = this.props.zIndex
        }

        this.setScrollbar();
    }    

    getInfoElements() {
        if (this.props.info && this.props.info.length > 0) {
            const datas = this.props.info; // as [value: string, withDot: boolean, indentDepth: number | null]

            if (datas.length >= 3) {                
                const data = i18nUtil.convertText(datas[1]);

                const arr = datas[2];
                const arrCount = arr.length;

                if (arrCount > 0) {
                    const list = [];
                    
                    for (let i = 0; i < arrCount; i++) {
                        const [value, withDot, indentDepth] = arr[i];
                        list.push(this.makeList(value, withDot, indentDepth, i));
                    }

                    return (
                        <>
                            {list}
                        </>
                        );
                }
            }            
        }

        return <span></span>;
    }

    makeList(value, withDot, depth, index) {
        const leftPadding = depth !== null && depth !== undefined && depth > 0 ? (depth * 1.8) + 'em' : null;

        if (leftPadding) {
            return <span key={"list_" + index} style={{ paddingLeft: leftPadding }}>{i18nUtil.convertText(value)}</span>;
        }

        return <span key={"list_" + index} >{i18nUtil.convertText(value)}</span>;
    }    

    render() {
        const InfoElements = this.getInfoElements();

        return (
            <SensorInfoComponent ref={this.refRoot} id={this.props.popupType} className={'viewDashboardBoxD viewDashboardBuilding'}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={320}
                    popupMinHeight={160}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                    usePopupResize={false}
                >
                    <div className={'sensorInfoTitle'}>
                        <h5 className={'dslTitle'} >
                            {i18n.t('sdms.buildingInfo.정보')}{/* {this.state.kind}{i18n.t('sdms.buildingInfo.정보')} */}
                        </h5>
                        <a className={'colseX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.sensorInfo, false)}><img src={imgClose} alt={i18n.t('common.닫기')} /></a>
                    </div>
                    <div className={'viewBuildingConts'}>
                        { InfoElements }
                    </div>
                    {/* <div className={'viewBuildingConts'}>
                        {
                            (this.props.info && this.props.info.length > 0) &&
                            <div ref={this.refTitle} className={'viewBuildingTitle'}>{facilityName[0]}</div>
                        }
                        {
                            InfoElements
                        }
                    </div> */}
                </PopupDraggable>
            </SensorInfoComponent>
        );
    }
}

export default withTranslation()(SensorInfo);