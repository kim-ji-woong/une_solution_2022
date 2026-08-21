import React, { Component } from 'react';
import $ from 'jquery';
import SDMS from '../../sdms';
import SDMSResource from '../../../resource/id';
import content from '../../../../Common/css/content.module.css';
import PopupDraggable from '../popupDraggable';
import ProjectResource from '../../../../Root/resource/id';
import SettingsStore from '../../../../Settings/settingsStore';
import { SDMSController } from '../../../services/sdmsController';

import WorkerAccessChart from './charts/workerAccessChart';

import { WorkerStatusComponent } from '../../../styled/sdmsPopupsStyled';
import { i18n, withTranslation, i18nUtil } from '../../../../language/i18n';

class WorkerStatus extends Component {
    constructor(props) {
        super(props);

        this.state = {
            equipZonePopupID : null,
        }
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
        

        this.unsubscribe_SettingsStore = SettingsStore.subscribe(function () {
            let data = SettingsStore.getState();

            if (data?.actionType === 'RESET_POPUP') {
                this.repositionPopup(data.popupState);
            }
        }.bind(this));
    }


    componentDidUpdate(prevProps, prevState) {        
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
        }
    }

    repositionPopup(popupState) {
        let data = popupState.workerStatus;

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

    handlePopup = (id) => {
        this.setState({
            popup: id
        });
    };

    onClickShowHide = (type, id) => {
        const element = document.getElementById('workerStatus_' + type + '_' + id);

        if (!element) 
            return;

        element.classList.toggle('on');
        element.previousSibling.classList.toggle('on');
    }

    getDisplayWorkerInfoUI = () => {
        let displayWorkerInfoUI = [];
        let displayBuildingGroupWorkerInfoUI = [];

        const buildingGroupList = this.props.buildingGroupList.length > 0 ? this.props.buildingGroupList : [];
        const workerInfos = this.props.workerInfos;

        let allWorkerCnt = 0;
        let allVisitorCnt = 0;

        for (const buildingGroup of buildingGroupList) {
            const [workerCnt, visitorCnt, yesterWorkerCnt, planVisitorCnt] = this.getBuildingGroupWorkerInfo(buildingGroup.id);
            const [workerIcon, workerNum] = (!workerCnt || workerCnt === 0) ? [content.dayWorkerDisableIcon, content.dayWorkerDisableNum] : [content.dayWorkerIcon, content.dayWorkerNum];
            const [visitorIcon, visitorNum] = (!visitorCnt || visitorCnt === 0) ? [content.dayVisitorDisableIcon, content.dayVisitorDisableNum] : [content.dayVisitorIcon, content.dayVisitorNum];
            const displayBuildingWorkerInfoUI = this.getDisplayBuildingWorkerInfoUI(buildingGroup.buildingDatas);

            allWorkerCnt += workerCnt;
            allVisitorCnt += visitorCnt;

            displayBuildingGroupWorkerInfoUI.push(
                <React.Fragment key={"workinfo_buildingGroup_" + buildingGroup.id}>
                    
                        {/* 빌딩그룹 */}
                        <div className='worker-info-content'>
                            <div className='worker-info-content-title'>
                                <p>{buildingGroup.displayText}</p>
                                <div>
                                    <p>{workerCnt}</p>
                                    <button className='worker-info-content-title-show' onClick={() => this.onClickShowHide("buildingGroup",  buildingGroup.id)}></button>
                                </div>
                            </div>
                            <div id={"workerStatus_buildingGroup_" + buildingGroup.id} className={'worker-info-content-list-wrap'}>
                                <div className='worker-info-content-chart'>
                                    <WorkerAccessChart buildingGroupName={buildingGroup?.displayText}  workerCnt={workerCnt} visitorCnt={visitorCnt} chartWidth={this.props.popupState?.width}/>
                                </div>
                                <div className='worker-info-content-list'>

                                        {/* 빌딩 */}    
                                        {displayBuildingWorkerInfoUI}
                                        {/* 빌딩 */}
                                        
                                </div>
                            </div>
                        </div>
                        {/* 빌딩그룹 */}

                </React.Fragment>
            );
        }

        displayWorkerInfoUI.push(
            <React.Fragment key={"workinfo_buildingGroup"}>
                    
                    {/* 전체 */}
                    <div className={'dslCont'}>
                        <div className='worker-status-warp'>
                            <h5 className={'worker-status-title'}>{i18n.t('sdms.worker.전체 캠퍼스 작업자 입출입 현황')}</h5>
                            <div className='worker-status-content-wrap'>
                                <div className='worker-status-content'>
                                    <div className='worker-status-content-icon-people' />
                                    <p>{i18n.t('sdms.worker.총 인원')}</p>
                                    <p>{allWorkerCnt + allVisitorCnt}{i18n.t('sdms.worker.명')}</p>
                                </div>
                                <div className='worker-status-content'>
                                    <div className='worker-status-content-icon-human' />
                                    <p>{i18n.t('sdms.worker.임직원')}</p>
                                    <p>{allWorkerCnt}{i18n.t('sdms.worker.명')}</p>
                                </div>
                                <div className='worker-status-content'>
                                    <div className='worker-status-content-icon-id' />
                                    <p>{i18n.t('sdms.worker.방문객')}</p>
                                    <p>{allVisitorCnt}{i18n.t('sdms.worker.명')}</p>
                                </div>
                            </div>
                        </div>
                        <h5 className={'worker-status-title'}>{i18n.t('sdms.worker.구역별 출입자 정보')}</h5>
                        <div className='worker-info-wrap scrollbar'>
                            <div className='worker-info-content-wrap'>

                                {/* 빌딩그룹 */}
                                {displayBuildingGroupWorkerInfoUI}
                                {/* 빌딩그룹 */}

                            </div>
                        </div>
                    </div>
                    {/* 전체 */}

            </React.Fragment>
        );

        return displayWorkerInfoUI;
    }

    // BuildingGroup 인원현황(어제인원, 현재인원, 현재 내방객, 예정 내방객) 불러오기
    getBuildingGroupWorkerInfo(buildingGroupID) {
        const buildingGroupWorkerInfos = this.props.workerInfos?.buildingGroupWorkerInfos?.length > 0 ? this.props.workerInfos.buildingGroupWorkerInfos : [];
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

    getDisplayBuildingWorkerInfoUI = (buildingDatas) => {
        let displayBuildingWorkerInfoUI = [];
        let buildingWorkerInfoUI = [];

        if (buildingDatas?.length > 0) {
            const buildingGroupID = buildingDatas[0].buildingGroupID;









            // 원익 집결지 표시
            if (ProjectResource.SiteID === ProjectResource.Site.Wonik && 
                (buildingGroupID === SDMSResource.WonikWorker.CampusID_H || buildingGroupID === SDMSResource.WonikWorker.CampusID_C ||
                    buildingGroupID === SDMSResource.WonikWorker.CampusID_A || buildingGroupID === SDMSResource.WonikWorker.CampusID_V ||
                buildingGroupID === SDMSResource.WonikWorker.CampusID_S)) {

                let assemblyID = SDMSResource.WonikWorker.AssemblyID_H;
                if (buildingGroupID === SDMSResource.WonikWorker.CampusID_C)
                    assemblyID = SDMSResource.WonikWorker.AssemblyID_C;
                else if (buildingGroupID === SDMSResource.WonikWorker.CampusID_A)
                    assemblyID = SDMSResource.WonikWorker.AssemblyID_A;
                else if (buildingGroupID === SDMSResource.WonikWorker.CampusID_V)
                    assemblyID = SDMSResource.WonikWorker.AssemblyID_V;
                else if (buildingGroupID === SDMSResource.WonikWorker.CampusID_S)
                    assemblyID = SDMSResource.WonikWorker.AssemblyID_S;
                

                let [workerCnt, visitorCnt, yesterWorkerCnt, planVisitorCnt] = this.getEquipZoneWorkerInfo(assemblyID);

                if (workerCnt === null)
                    workerCnt = 0;
                if (visitorCnt === null)
                    visitorCnt = 0;

                let workerBtnClass = 'list-item-remainerBtn';
                if (assemblyID === this.props.selectedWorkerStatusPopup)
                    workerBtnClass = 'list-item-remainerBtn-active';

                displayBuildingWorkerInfoUI.push(
                    <React.Fragment>
                        <ul className='list-item-wrap'>
                            <li >{i18n.t('sdms.worker.집결지')}</li>
                            <div>
                                <li className='list-item-member'>{workerCnt}</li>
                                <li className='list-item-visitor'>{visitorCnt}</li>
                                <li className='list-item-none'><button className={workerBtnClass} onClick={() => this.onClickEquipZonePopup(assemblyID)}>{i18n.t('sdms.worker.잔류자')}</button></li>
                            </div>
                        </ul>
                    </React.Fragment>
                );
            }









            for (const building of buildingDatas) {
                const [workerCnt, visitorCnt, yesterWorkerCnt, planVisitorCnt] = this.getBuildingWorkerInfo(building.id);
                const [workerIcon, workerFont] = (!workerCnt || workerCnt === 0) ? [content.grayPeopleIcon, content.grayFont] : [content.greenPeopleIcon, content.greenFont];

                const displayZoneWorkerInfoUI = this.getDisplayZoneWorkerInfoUI(building.zoneDatas);

                displayBuildingWorkerInfoUI.push(
                    <React.Fragment>
                    {/* 빌딩 */}
                    <ul className='list-item-wrap' onClick={() => this.onClickShowHide('building', building.id)}>
                        <li className='list-item-area'>{building.displayText}</li>
                        <div>
                            <li className='list-item-member'>{workerCnt}</li>
                            <li className='list-item-visitor'>{visitorCnt}</li>
                            <li className='list-item-none'></li>
                        </div>
                    </ul>
                    <div id={"workerStatus_building_" + building.id} >

                                
                        {/* 존 */}
                        {displayZoneWorkerInfoUI}
                        {/* 존 */}


                    </div>
                    {/* 빌딩 */}
                    </React.Fragment>
                );
            }
        }

        return displayBuildingWorkerInfoUI;
    }


    // Building 인원현황(어제인원, 현재인원, 현재 내방객, 예정 내방객) 불러오기
    getBuildingWorkerInfo(buildingID) {
        const buildingWorkerInfos = this.props.workerInfos?.buildingWorkerInfos?.length > 0 ? this.props.workerInfos.buildingWorkerInfos : [];
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


    getDisplayZoneWorkerInfoUI = (zoneDatas) => {
        let displayZoneWorkerInfoUI = [];
        let zoneUI = [];

        if (zoneDatas?.length > 0) {

            for (const zone of zoneDatas) {
                const [workerCnt, visitorCnt, yesterWorkerCnt, planVisitorCnt] = this.getZoneWorkerInfo(zone.id);
                const [workerIcon, workerFont] = (!workerCnt || workerCnt === 0) ? [content.grayPeopleIcon, content.grayFont] : [content.greenPeopleIcon, content.greenFont];

                const displayEquipZoneWorkerInfoUI = this.getDisplayEquipZoneWorkerInfoUI(zone.equipmentZoneDatas);

                {/* 대피구역 관련 추가 필요 */}

                displayZoneWorkerInfoUI.push(

                    <React.Fragment>
                    {/* 존 */}
                        <ul className='list-item-wrap-1depth' onClick={() => this.onClickShowHide('zone', zone.id)}>
                            <ul className='list-item-area-1depth'>
                                <span>{zone.displayText}</span>
                                <div>
                                    <li className='list-item-member'>{workerCnt}</li>
                                    <li className='list-item-visitor'>{visitorCnt}</li>
                                    <li className='list-item-none'>
                                    {/* 작업자 버튼 >> 대피 구역 관련 기능 
                                        <button className='list-item-workerBtn'
                                            onClick={() => this.handlePopup(zone.id)}>작업자</button>
                                    */}
                                    </li>
                                </div>
                            </ul>
                        </ul>

                        <div id={"workerStatus_zone_" + zone.id} className='worker_status_zone'>
                        {/* 구역 */} 
                        
                            { displayEquipZoneWorkerInfoUI }

                        {/* 구역 */}
                        </div>

                    {/* 존 */}
                    </React.Fragment>

                );
            }
        }

        return displayZoneWorkerInfoUI;
    }


    // zone 인원현황(어제인원, 현재인원, 현재 내방객, 예정 내방객) 불러오기
    getZoneWorkerInfo(zoneID) {
        const zoneWorkerInfos = this.props.workerInfos?.zoneWorkerInfos?.length > 0 ? this.props.workerInfos.zoneWorkerInfos : [];
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


    getDisplayEquipZoneWorkerInfoUI = (equipZoneDatas) => {
        let displayEquipZoneWorkerInfoUI = [];
        let equipZoneUI = [];

        if (equipZoneDatas?.length > 0) {

            for (const equipZone of equipZoneDatas) {
                let [workerCnt, visitorCnt, yesterWorkerCnt, planVisitorCnt] = this.getEquipZoneWorkerInfo(equipZone.id);
                const [workerIcon, workerFont] = (!workerCnt || workerCnt === 0) ? [content.grayPeopleIcon, content.grayFont] : [content.greenPeopleIcon, content.greenFont];

                if (ProjectResource.SiteID === ProjectResource.Site.Wonik && workerCnt === null && visitorCnt === null)
                    continue;

                if (workerCnt === null)
                    workerCnt = 0;
                else if (visitorCnt === null)
                    visitorCnt = 0;


                let btnUI = null;
                if (ProjectResource.SiteID === ProjectResource.Site.Wonik) {
                    let workerBtnClass = 'list-item-workerBtn';
                    if (equipZone.id === this.props.selectedWorkerStatusPopup)
                        workerBtnClass = 'list-item-workerBtn-active';

                    btnUI = (<button className={workerBtnClass} onClick={() => this.onClickEquipZonePopup(equipZone.id)}>{i18n.t('sdms.worker.작업자')}</button>);
                }

                displayEquipZoneWorkerInfoUI.push(

                    <React.Fragment>

                        <ul className='list-item-wrap-2depth'>
                            <ul className='list-item-area-2depth'>
                                <span>{equipZone.displayText}</span>
                                <div>
                                    <li className='list-item-member'>{workerCnt}</li>
                                    <li className='list-item-visitor'>{visitorCnt}</li>
                                    <li>{btnUI}</li>
                                </div>
                            </ul>
                        </ul>

                    </React.Fragment>

                );
            }
        }

        return displayEquipZoneWorkerInfoUI;
    }


    // equipZone 인원현황(어제인원, 현재인원, 현재 내방객, 예정 내방객) 불러오기
    getEquipZoneWorkerInfo(equipZoneID) {
        const equipZoneWorkerInfos = this.props.workerInfos?.equipZoneWorkerInfos?.length > 0 ? this.props.workerInfos.equipZoneWorkerInfos : [];
        let workerCnt = 0;
        let visitorCnt = 0;
        let yesterWorkerCnt = 0;
        let planVisitorCnt = 0;


        if (ProjectResource.SiteID === ProjectResource.Site.Wonik) {
            workerCnt = null;
            visitorCnt = null;
            yesterWorkerCnt = null;
            planVisitorCnt = null;
        }

        if (equipZoneWorkerInfos.length === 0) {
            // 사이트별 조건
            if (ProjectResource.SiteID === ProjectResource.Site.Soulbrain) {
                visitorCnt = null;
                yesterWorkerCnt = null;
                planVisitorCnt = null;
            }

            return [workerCnt, visitorCnt, yesterWorkerCnt, planVisitorCnt];
        }



        // 해당 데이터 찾기
        const workerData = equipZoneWorkerInfos.find(x => x.spatialID === equipZoneID && x.workerType === SDMSResource.workerType.Worker);
        if (workerData)
            workerCnt = workerData.workerCount;

        const visitorData = equipZoneWorkerInfos.find(x => x.spatialID === equipZoneID && x.workerType === SDMSResource.workerType.Visitor);
        if (visitorData)
            visitorCnt = visitorData.workerCount;

        const yesterWorkerData = equipZoneWorkerInfos.find(x => x.spatialID === equipZoneID && x.workerType === SDMSResource.workerType.YesterWorker);
        if (yesterWorkerData)
            yesterWorkerCnt = yesterWorkerData.workerCount;

        const planVisitorData = equipZoneWorkerInfos.find(x => x.spatialID === equipZoneID && x.workerType === SDMSResource.workerType.PlanVisitor);
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

    onClickEquipZonePopup = (equipZoneID) => {
        if (!equipZoneID)
            return;
        //else if (this.state.equipZonePopupID !== equipZoneID) {
        //    this.setState({equipZonePopupID: equipZoneID });
        //}

        this.props.setWorkerStatusPopup(equipZoneID);
    }

    setPopupState = (popup, state) => {
        this.props.setPopupState(SDMSResource.popupLayer.workerStatus, state);
    }


    render() {
        const displayWorkerInfoUI = this.getDisplayWorkerInfoUI();

        return (
            <div>
                <WorkerStatusComponent id={this.props.popupType} className={'viewDashboardBoxD viewDashboardWorkerStatus'} style={{ zIndex: 0, opacity: 1 }}>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={320}
                        popupMinHeight={500}
                        topSize={32}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.setPopupState}
                    >
                        <div className={'dslTop dslGrd'}>
                            <h5 className={'dslTitle'} >
                                {i18n.t('sdms.worker.인원현황')}
                            </h5>
                            <a className={'dslX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.workerPath, false)}></a>
                        </div>

                        {/* 전체 /}
                        <div className={'dslCont'}>
                            <div className='worker-status-warp'>
                                <h5 className={'worker-status-title'}>전체 캠퍼스 작업자 입출입 현황</h5>
                                <div className='worker-status-content-wrap'>
                                    <div className='worker-status-content'>
                                        <div className='worker-status-content-icon-people' />
                                        <p>총 인원</p>
                                        <p>1000명</p>
                                    </div>
                                    <div className='worker-status-content'>
                                        <div className='worker-status-content-icon-human' />
                                        <p>임직원</p>
                                        <p>800명</p>
                                    </div>
                                    <div className='worker-status-content'>
                                        <div className='worker-status-content-icon-id' />
                                        <p>방문객</p>
                                        <p>200명</p>
                                    </div>
                                </div>
                            </div>
                            <div className='worker-info-wrap'>
                                <h5 className={'worker-status-title'}>구역별 출입자 정보</h5>
                                <div className='worker-info-content-wrap'>


                                    {/* 빌딩그룹 /}
                                    <div className='worker-info-content'>
                                        <div className='worker-info-content-title'>
                                            <p>캠퍼스 H</p>
                                            <div>
                                                <p>240</p>
                                                <button className='worker-info-content-title-show' onClick={() => this.setState({ campus: !this.state.campus })}></button>
                                            </div>
                                        </div>
                                        <div className={this.state.campus ? 'worker-info-content-list-wrap on' : 'worker-info-content-list-wrap'}>
                                            <div className='worker-info-content-chart'>
                                                <WorkerAccessChart />
                                            </div>
                                            <div className='worker-info-content-list'>

                                                
                                                {/* 빌딩 /}
                                                <ul className='list-item-wrap' onClick={() => this.setState({ depth1: !this.state.depth1 })}>
                                                    <li className='list-item-area'>H1동</li>
                                                    <li className='list-item-member'>30</li>
                                                    <li className='list-item-visitor'>10</li>
                                                    <li className='list-item-none'></li>
                                                </ul>
                                                <div className={this.state.depth1 ? 'on' : null}>

                                
                                                    {/* 존 /}
                                                    <ul className='list-item-wrap-1depth'>
                                                        <li className='list-item-area-1depth'>B1F</li>
                                                        <li className='list-item-member'>5</li>
                                                        <li className='list-item-visitor'>5</li>
                                                        <li><button className='list-item-btn'>작업자</button></li>
                                                    </ul>
                                                    <ul className={this.state.popup ? 'list-item-wrap-1depth on' : 'list-item-wrap-1depth'}>
                                                        <li className='list-item-area-1depth'>집결지</li>
                                                        <li className='list-item-member'>5</li>
                                                        <li className='list-item-visitor'>5</li>
                                                        <li><button className='list-item-btn'
                                                                onClick={() => this.setState({ popup: true })}>작업자</button>
                                                        </li>
                                                    </ul>
                                                    {/* 존 /}


                                                </div>
                                                {/* 빌딩 /}


                                            </div>
                                        </div>
                                    </div>
                                    {/* 빌딩그룹 /}


                                </div>
                            </div>
                        </div>
                        {/ 전체 */}

                        {displayWorkerInfoUI}

                    </PopupDraggable>
                </WorkerStatusComponent>
        </div>
        );
    }
}

export default withTranslation()(WorkerStatus);
