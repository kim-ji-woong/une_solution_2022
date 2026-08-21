import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';
import content from '../../../../Common/css/content.module.css';
import SettingsStore from '../../../../Settings/settingsStore';
import SDMS from '../../sdms';
import SDMSResource from '../../../resource/id';
import ProjectResource from '../../../../Root/resource/id';
import PopupDraggable from '../popupDraggable';

import sdmsStyles from '../../../css/sdms.module.css';
import newStyles from '../../../../Common/css/newStyle.module.css';

//import Chart from "react-google-charts";
import { Bar } from 'react-chartjs-2'
import $ from 'jquery';
import { i18n, withTranslation, i18nUtil } from '../../../../language/i18n';

class WorkerInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popupMinWidth: 600,
            popupMinHeight: 400,
        }

        this.props = props;

        SettingsStore.subscribe(function () {
            let data = SettingsStore.getState();

            if (data?.actionType === 'RESET_POPUP') {
                this.repositionPopup(data.popupState);
            }
        }.bind(this));

        if (SDMS.UseWalkingAvatar) {
            this.refPosX = React.createRef();
            this.refPosY = React.createRef();
            this.refPosZ = React.createRef();
            this.refScaleX = React.createRef();
            this.refScaleY = React.createRef();
            this.refScaleZ = React.createRef();
        }

        this.refTree = React.createRef();
    }


    componentDidMount() {
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



        // 트리 열고 닫기
        $('.' + content.dsiTreeW + ' h5 div ').click(function () {
            if ($(this).is('.' + content.on)) {
                $(this).removeClass(content.on);
                $(this).parent().next().hide();
            } else {
                $(this).addClass(content.on);
                $(this).parent().next().show();
            };
        });

        $('.' + content.dsiTreeW + ' h5 span ').click(function () {
            if ($(this).is('.' + content.on)) {
                $(this).removeClass(content.on);
                $(this).parent().next().hide();
            } else {
                $(this).addClass(content.on);
                $(this).parent().next().show();
            };
        });


        // 트리 선택
        $('.' + content.dsiTreeW + ' h5 div p ').click(function () {
            let targets = $('.' + content.dsiTreeCheck);

            if (targets !== null && targets !== undefined && targets.length > 0) {
                for (let i = 0; i < targets.length; i++) {
                    let target = targets[i];

                    $(target).removeClass(content.dsiTreeCheck);
                }
            }

            $(this).addClass(content.dsiTreeCheck);
        }); 

        $('.' + content.dsiTreeW + ' span ').click(function () {
            let targets = $('.' + content.dsiTreeCheck);

            if (targets !== null && targets !== undefined && targets.length > 0) {
                for (let i = 0; i < targets.length; i++) {
                    let target = targets[i];

                    $(target).removeClass(content.dsiTreeCheck);
                }
            }

            $(this).addClass(content.dsiTreeCheck);
        }); 


        //$('.' + content.workerConts1).click(function () {
        //    $('.' + content.workerConts1Tree).toggle();
        //});

        $('.' + content.workerConts2).click(function () {
            $('.' + content.workerConts2Tree).toggle();
        });
    }


    componentDidUpdate(prevProps, prevState) {        
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
        }
    }

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



    // BuildingGroup 인원현황(어제인원, 현재인원, 현재 내방객, 예정 내방객) 불러오기
    getBuildingGroupWorkerInfo(buildingGroupID) {
        const buildingGroupWorkerInfos = [...this.props.workerInfos?.buildingGroupWorkerInfos];
        let workerCnt = 0;
        let visitorCnt = 0;
        let yesterWorkerCnt = 0;
        let planVisitorCnt = 0;

        if (buildingGroupWorkerInfos.length === 0) {
            // 사이트별 조건

            return [workerCnt, visitorCnt, yesterWorkerCnt, planVisitorCnt];
        }



        // 해당 데이터 찾기
        const workerData = buildingGroupWorkerInfos.find(x => x.spatialID === buildingGroupID && x.workerType === SDMSResource.workerType.Worker);
        if (workerData)
            workerCnt = workerData.workerCount;

        const visitorData = buildingGroupWorkerInfos.find(x => x.spatialID === buildingGroupID && x.workerType === SDMSResource.workerType.Visitor);
        if (visitorData)
            visitorCnt = visitorData.workerCount;

        const yesterWorkerData = buildingGroupWorkerInfos.find(x => x.spatialID === buildingGroupID && x.workerType === SDMSResource.workerType.YesterWorker);
        if (yesterWorkerData)
            yesterWorkerCnt = yesterWorkerData.workerCount;

        const planVisitorData = buildingGroupWorkerInfos.find(x => x.spatialID === buildingGroupID && x.workerType === SDMSResource.workerType.PlanVisitor);
        if (planVisitorData)
            planVisitorCnt = planVisitorData.workerCount;




        // 사이트별 조건

        return [workerCnt, visitorCnt, yesterWorkerCnt, planVisitorCnt];
    }

    // Building 인원현황(어제인원, 현재인원, 현재 내방객, 예정 내방객) 불러오기
    getBuildingWorkerInfo(buildingID) {
        const buildingWorkerInfos = [...this.props.workerInfos?.buildingWorkerInfos];
        let workerCnt = 0;
        let visitorCnt = 0;
        let yesterWorkerCnt = 0;
        let planVisitorCnt = 0;

        if (buildingWorkerInfos.length === 0) {
            // 사이트별 조건
            if (ProjectResource.SiteID === ProjectResource.Site.Soulbrain) {
                visitorCnt = null;
                yesterWorkerCnt = null;
                planVisitorCnt = null;
            }
                

            return [workerCnt, visitorCnt, yesterWorkerCnt, planVisitorCnt];
        }



        // 해당 데이터 찾기
        const workerData = buildingWorkerInfos.find(x => x.spatialID === buildingID && x.workerType === SDMSResource.workerType.Worker);
        if (workerData)
            workerCnt = workerData.workerCount;

        const visitorData = buildingWorkerInfos.find(x => x.spatialID === buildingID && x.workerType === SDMSResource.workerType.Visitor);
        if (visitorData)
            visitorCnt = visitorData.workerCount;

        const yesterWorkerData = buildingWorkerInfos.find(x => x.spatialID === buildingID && x.workerType === SDMSResource.workerType.YesterWorker);
        if (yesterWorkerData)
            yesterWorkerCnt = yesterWorkerData.workerCount;

        const planVisitorData = buildingWorkerInfos.find(x => x.spatialID === buildingID && x.workerType === SDMSResource.workerType.PlanVisitor);
        if (planVisitorData)
            planVisitorCnt = planVisitorData.workerCount;



        // 사이트별 조건
        if (ProjectResource.SiteID === ProjectResource.Site.Soulbrain) {
            visitorCnt = null;
            yesterWorkerCnt = null;
            planVisitorCnt = null;
        }

        return [workerCnt, visitorCnt, yesterWorkerCnt, planVisitorCnt];
    }


    // zone 인원현황(어제인원, 현재인원, 현재 내방객, 예정 내방객) 불러오기
    getZoneWorkerInfo(zoneID) {
        const zoneWorkerInfos = [...this.props.workerInfos?.zoneWorkerInfos];
        let workerCnt = 0;
        let visitorCnt = 0;
        let yesterWorkerCnt = 0;
        let planVisitorCnt = 0;

        if (zoneWorkerInfos.length === 0) {
            // 사이트별 조건
            if (ProjectResource.SiteID === ProjectResource.Site.Soulbrain) {
                visitorCnt = null;
                yesterWorkerCnt = null;
                planVisitorCnt = null;
            }

            return [workerCnt, visitorCnt, yesterWorkerCnt, planVisitorCnt];
        }



        // 해당 데이터 찾기
        const workerData = zoneWorkerInfos.find(x => x.spatialID === zoneID && x.workerType === SDMSResource.workerType.Worker);
        if (workerData)
            workerCnt = workerData.workerCount;

        const visitorData = zoneWorkerInfos.find(x => x.spatialID === zoneID && x.workerType === SDMSResource.workerType.Visitor);
        if (visitorData)
            visitorCnt = visitorData.workerCount;

        const yesterWorkerData = zoneWorkerInfos.find(x => x.spatialID === zoneID && x.workerType === SDMSResource.workerType.YesterWorker);
        if (yesterWorkerData)
            yesterWorkerCnt = yesterWorkerData.workerCount;

        const planVisitorData = zoneWorkerInfos.find(x => x.spatialID === zoneID && x.workerType === SDMSResource.workerType.PlanVisitor);
        if (planVisitorData)
            planVisitorCnt = planVisitorData.workerCount;



        // 사이트별 조건
        if (ProjectResource.SiteID === ProjectResource.Site.Soulbrain) {
            visitorCnt = null;
            yesterWorkerCnt = null;
            planVisitorCnt = null;
        }

        return [workerCnt, visitorCnt, yesterWorkerCnt, planVisitorCnt];
    }



    getDisplayZoneWorkerInfoUI = (zoneDatas) => {
        let displayZoneWorkerInfoUI = [];
        let zoneUI = [];

        if (zoneDatas?.length > 0) {

            for (const zone of zoneDatas) {
                const [workerCnt, visitorCnt, yesterWorkerCnt, planVisitorCnt] = this.getZoneWorkerInfo(zone.id);
                const [workerIcon, workerFont] = (!workerCnt || workerCnt === 0) ? [content.grayPeopleIcon, content.grayFont] : [content.greenPeopleIcon, content.greenFont];

                zoneUI.push(
                    <li key={"workinfo_zone_" + zone.id}>
                        <h5>
                            <span className={content.buildingName}>{/*층 이름*/ zone.displayText}</span>
                            <p className={content.peopleNumBox}>
                                <p className={workerIcon}></p>
                                <p className={workerFont}>{/*현재 인원*/ workerCnt}</p>
                            </p>
                        </h5>
                    </li>
                );
            }

            displayZoneWorkerInfoUI.push(
                <ul key={"workinfo_zone"}>
                    {zoneUI}
                </ul>
            );
        }

        return displayZoneWorkerInfoUI;
    }



    getDisplayBuildingWorkerInfoUI = (buildingDatas) => {
        let displayBuildingWorkerInfoUI = [];
        let buildingWorkerInfoUI = [];

        if (buildingDatas?.length > 0) {
            const buildingGroupID = buildingDatas[0].buildingGroupID;

            for (const building of buildingDatas) {
                const [workerCnt, visitorCnt, yesterWorkerCnt, planVisitorCnt] = this.getBuildingWorkerInfo(building.id);
                const [workerIcon, workerFont] = (!workerCnt || workerCnt === 0) ? [content.grayPeopleIcon, content.grayFont] : [content.greenPeopleIcon, content.greenFont];

                const displayZoneWorkerInfoUI = this.getDisplayZoneWorkerInfoUI(building.zoneDatas);

                buildingWorkerInfoUI.push(
                    <li key={"workinfo_building_" + building.id}>
                        <h5 style={{ borderBottom: 'dashed 1px #d7d7d73d' }}>
                            <div>
                                <p className={content.buildingName}>{/*건물 이름*/ building.displayText}</p>
                                <p className={content.peopleNumBox}>
                                    <p className={workerIcon}></p>
                                    <p className={workerFont}>{/*현재 인원*/ workerCnt}</p>
                                </p>
                            </div>
                        </h5>

                        {displayZoneWorkerInfoUI}

                    </li>
                );
            }


            displayBuildingWorkerInfoUI.push(
                <div key={"workinfo_building"} className={content.workerConts1Tree + " buildingGroupTree_" + buildingGroupID} style={{ display: 'none' }}>
                    <div className={content.stguTree}>
                        <ul className={content.dsiTreeW}>

                            {buildingWorkerInfoUI}

                        </ul>
                    </div>
                </div>
            );
        }

        return displayBuildingWorkerInfoUI;
    }

    onClickBuildingGroup = (buildingGroupID) => {
        $(".buildingGroupTree_" + buildingGroupID).toggle();
    }

    getDisplayWorkerInfoUI = () => {
        let displayWorkerInfoUI = [];

        const buildingGroupList = [...this.props.buildingGroupList];
        const workerInfos = this.props.workerInfos;

        for (const buildingGroup of buildingGroupList) {
            const [workerCnt, visitorCnt, yesterWorkerCnt, planVisitorCnt] = this.getBuildingGroupWorkerInfo(buildingGroup.id);
            const [workerIcon, workerNum] = (!workerCnt || workerCnt === 0) ? [content.dayWorkerDisableIcon, content.dayWorkerDisableNum] : [content.dayWorkerIcon, content.dayWorkerNum];
            const [visitorIcon, visitorNum] = (!visitorCnt || visitorCnt === 0) ? [content.dayVisitorDisableIcon, content.dayVisitorDisableNum] : [content.dayVisitorIcon, content.dayVisitorNum];
            const displayBuildingWorkerInfoUI = this.getDisplayBuildingWorkerInfoUI(buildingGroup.buildingDatas);

            displayWorkerInfoUI.push(
                <React.Fragment key={"workinfo_buildingGroup_" + buildingGroup.id}>
                    <div className={content.workerConts1} onClick={() => this.onClickBuildingGroup(buildingGroup.id)}>
                        <div className={content.wFactoryBox}>
                            <p className={content.wFactoryBold}>{buildingGroup.displayText}</p>
                        </div>
                        <span className={content.peopleLine}></span>
                        <div className={content.previousDayWorkerBox}>
                            <span className={content.previousDayWorkerIcon}></span>
                            <span className={content.previousDayWorkerNum}>{/* 어제 인원 */ yesterWorkerCnt}</span>
                        </div>
                        <span className={content.peopleLine}></span>
                        <div className={content.dayWorkerBox}>
                            <span className={workerIcon}></span>
                            <span className={workerNum}>{/* 현재 인원 */ workerCnt}</span>
                        </div>
                        <span className={content.peopleLine}></span>
                        <div style={{ display: 'flex', width: '40%' }}>
                            <div className={content.dayVisitorBox}>
                                <span className={visitorIcon}></span>
                                <span className={visitorNum}>{/* 현재 내방객/예정 내방객 */ visitorCnt + "/" + planVisitorCnt}</span>
                            </div>
                            {/*
                            <div className={content.visitorCountBox}>
                                <span className={content.asArea}>
                                    <p className={content.asBox}>{/*내방객 사유/}시스템 점검</p>
                                    <p className={content.asCountNum}>{/*사유 해당 현재 내방객/예정 내방객/ visitorCnt + "/" + planVisitorCnt}</p>
                                </span>
                            </div>
                            */}
                        </div>
                    </div>

                    {displayBuildingWorkerInfoUI}

                </React.Fragment>
            );

        }

        return displayWorkerInfoUI;
    }


    setPopupState = (popup, state) => {
        this.props.setPopupState(SDMSResource.popupLayer.workerInfo, state);
    }

    render() {
        const displayWorkerInfoUI = this.getDisplayWorkerInfoUI();


        return (
            <div id={this.props.popupType} className={content.viewDashboardBoxD + ' ' + content.viewDashboardWorkerInfo}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={530}
                    popupMinHeight={380}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.setPopupState}
                >

                    <div className={content.dslTop + " " + content.dslGrd}>
                        <h5 className={content.dslTitle}>
                            {i18n.t('sdms.worker.인원현황')}
                        </h5>
                        <a className={content.dslX} onClick={() => this.props.setVisiblePopups(SDMS.menu.workerPath, false)}></a>
                    </div>

                    <div className={content.workerContents}>
                        <div className={content.workerTitle}>
                            <span className={content.wFact}>{i18n.t('sdms.worker.공장동')}</span>
                            <span className={content.peoppleLine}></span>
                            <span className={content.previousDayWorker}>{i18n.t('sdms.worker.전일 인원')}</span>
                            <span className={content.peoppleLine}></span>
                            <span className={content.dayWorker}>{i18n.t('sdms.worker.당일 인원')}</span>
                            <span className={content.peoppleLine}></span>
                            <span className={content.dayVisitor}>{i18n.t('sdms.worker.당일 내방객')}</span>
                        </div>

                        <div className={content.workerContsBox}>
                            { displayWorkerInfoUI }

                        </div>   {/* workerContsBox */}
                    </div> {/* workerContents */}
                </PopupDraggable>
            </div>
        );
    }
}
export default withTranslation()(WorkerInfo);