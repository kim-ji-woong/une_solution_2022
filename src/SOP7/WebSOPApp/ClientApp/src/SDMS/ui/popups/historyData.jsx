import React, { Component } from 'react';
import $ from 'jquery';
import { Bar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import SDMSResource from '../../resource/id';
import PopupDraggable from './popupDraggable';
import SettingsStore from '../../../Settings/settingsStore';
import store from '../../../Root/store';
import SDMS from '../sdms';
import { SDMSController } from '../../services/sdmsController';
import HistoryController from '../../../History/services/historyController';
import { AssessmentController } from '../../services/assessmentController';

import ProjectResource from '../../../Root/resource/id';
import AccountResource from '../../../Account/resource/id';

import { HistoryDataComponent } from '../../styled/sdmsPopupsStyled';
import { i18n, withTranslation } from '../../../language/i18n';



class HistoryData extends Component {

    constructor(props) {
        super(props);

        this.state = {
            todayAllAlarms: store.getState().sensorAllAlarm,
            yearAlarms: [],
            scores: [],
            zoneScores: [],
            lastZoneScores: [],

            buildingGroupID: -1,
            buildingID: -1,
            zoneID: -1,
            equipZoneID: -1,
            siteID: null,
        };

        this.InitBuildingData();
        this.LoadYearStatus();
        this.LoadScoreData();
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

        this.unsubscribe = store.subscribe(function () {
            let data = store.getState();

            if (data.sensorAllAlarm && data.actionType === 'SENSOR_ALARM') {
                this.changeAlarm(data.sensorAllAlarm);
            }

        }.bind(this));

        this.unsubscribe_SettingsStore = SettingsStore.subscribe(function () {
            let data = SettingsStore.getState();

            if (data?.actionType === 'RESET_POPUP') {
                this.repositionPopup(data.popupState);
            }
        }.bind(this));       

        /* $('.safetyChecklistBoxUl_B').click(function () {
           $('.safetyChecklistBoxUl_B').toggle('safetyChecklistBoxUl_B_On');
        }); */

    }

    componentDidUpdate(prevProps, prevState) {
        let isUpdate = false;
        let siteID = this.state.siteID;
        let buildingGroupID = this.state.buildingGroupID;
        let buildingID = this.state.buildingID;
        let zoneID = this.state.zoneID;
        let equipZoneID = -1;
       
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
        }

        if (this.props.currentSiteID !== prevProps.currentSiteID || (siteID === null && this.props.currentSiteID !== null)) {
            const currentSiteID = parseInt(this.props.currentSiteID);
            if (currentSiteID !== NaN && siteID !== currentSiteID) {
                siteID = currentSiteID;
                isUpdate = true;
            }
        }

        let selectEquipZoneID = this.props.selectEquipZoneID;
        if (selectEquipZoneID === null) {
            selectEquipZoneID = -1;
        }
        if (this.props.selectEquipZoneID !== prevProps.selectEquipZoneID) {
            isUpdate = true;
        }        

        if (this.props.currentView) {
            let currentBuildingID = this.props.currentView.buildingID;
            if (currentBuildingID === null) {
                currentBuildingID = -1;
            }

            let currentZoneID = this.props.currentView.zoneID;
            if (currentZoneID === null)
                currentZoneID = -1;

            if (currentBuildingID !== buildingID) {
                buildingID = currentBuildingID;
                isUpdate = true;
            }

            if (currentZoneID !== zoneID) {
                zoneID = currentZoneID;
                isUpdate = true;
            }

            // 외곽 공간일 경우
            if (currentZoneID >= 20000
                && this.props.selectEquipZoneID !== null
                && this.props.selectEquipZoneID !== prevProps.selectEquipZoneID) {
                equipZoneID = this.props.selectEquipZoneID;
            }

            let currentBuildingGroupID = -1;

            const buildingGroupList = this.props.buildingGroupList;

            if (currentBuildingID !== -1) {
                for (let i = 0; i < buildingGroupList?.length; i++) {
                    const buildingGroup = buildingGroupList[i];
                    let isChk = false;

                    for (let j = 0; j < buildingGroup?.buildingDatas?.length; j++) {
                        const building = buildingGroup?.buildingDatas[j];

                        if (building?.id === currentBuildingID) {
                            currentBuildingGroupID = buildingGroup.id;

                            for (let k = 0; k < building.zoneDatas?.length; k++) {
                                const zone = building.zoneDatas[k];

                                if (zone.id === zoneID) {
                                    for (let z = 0; z < zone.equipmentZoneDatas?.length; z++) {
                                        const equipmentZone = zone.equipmentZoneDatas[z];

                                        if (equipmentZone.id === selectEquipZoneID) {
                                            equipZoneID = selectEquipZoneID;
                                            isChk = true;
                                            break;
                                        }
                                    }
                                }

                                if (isChk === true)
                                    break;
                            }                            
                        }

                        if (isChk === true)
                            break;
                    }

                    if (isChk === true)
                        break;
                }
            }

            if (currentBuildingGroupID !== buildingGroupID) {
                buildingGroupID = currentBuildingGroupID;
                isUpdate = true;
            }
        }

        if (isUpdate) {
            this.state.siteID = siteID;
            this.state.buildingGroupID = buildingGroupID;
            this.state.buildingID = buildingID;
            this.state.zoneID = zoneID;
            this.state.equipZoneID = equipZoneID;

            this.LoadScoreData();
        }

    }

    componentWillUnmount() {
        this.unsubscribe();
        this.unsubscribe_SettingsStore();
    }

    InitBuildingData() {
        let siteID = null;

        if (this.props.currentSiteID !== null) {
            const currentSiteID = parseInt(this.props.currentSiteID);
            if (currentSiteID !== NaN) 
                siteID = currentSiteID;
        }

        let buildingID = this.props.currentView.buildingID;
        if (buildingID === null) 
            buildingID = -1;        

        let zoneID = this.props.currentView.zoneID;
        if (zoneID === null)
            zoneID = -1;

        let selectEquipZoneID = this.props.selectEquipZoneID;
        if (selectEquipZoneID === null)
            selectEquipZoneID = -1;

        let equipZoneID = -1;

        const buildingGroupList = this.props.buildingGroupList;
        let buildingGroupID = -1;

        if (buildingID !== -1) {
            for (let i = 0; i < buildingGroupList?.length; i++) {
                const buildingGroup = buildingGroupList[i];
                let isChk = false;

                for (let j = 0; j < buildingGroup?.buildingDatas?.length; j++) {
                    const building = buildingGroup?.buildingDatas[j];

                    if (building?.id === buildingID) {
                        buildingGroupID = buildingGroup.id;

                        for (let k = 0; k < building.zoneDatas?.length; k++) {
                            const zone = building.zoneDatas[k];

                            if (zone.id === zoneID) {

                                for (let z = 0; z < zone.equipmentZoneDatas?.length; z++) {
                                    const equipmentZone = zone.equipmentZoneDatas[z];

                                    if (equipmentZone.id === selectEquipZoneID) {
                                        equipZoneID = selectEquipZoneID;
                                        isChk = true;
                                        break;
                                    }
                                }

                                if (isChk === true)
                                    break;
                            }                          
                        }

                        if (isChk === true)
                            break;
                    }
                }

                if (isChk === true)
                    break;
                else if (buildingGroupID !== -1)
                    break;
            }
        }


        this.state.buildingGroupID = buildingGroupID;
        this.state.buildingID = buildingID;
        this.state.zoneID = zoneID;
        this.state.equipZoneID = equipZoneID;
    }

    changeAlarm(todayAllAlarms) {
        this.setState({ todayAllAlarms });
    }

    async LoadYearStatus() {
        // 11개월 알람 정보 가져오기
        const [yearAlarms, message] = await SDMSController.requestYearStatus();
        if (yearAlarms) {
            this.setState({ yearAlarms});
        }
    }

    async LoadScoreData() {
        const siteID = this.state.siteID;
        if (siteID === null)
            return;

        const buildingGroupID = this.state.buildingGroupID;
        const buildingID = this.state.buildingID;
        const zoneID = this.state.zoneID;
        let equipZoneID = this.state.equipZoneID
        if (equipZoneID === -1)
            equipZoneID = null;

        const dtToday = new Date();
        let dtAgo11 = new Date();
        dtAgo11.setMonth(dtToday.getMonth() - 11);
        dtAgo11.setDate(1);

        const beginDate = this.getMakeDateTime(dtAgo11) + ' 00:00:00';
        const endDate = this.getMakeDateTime(dtToday) + ' 23:59:59';

        const selectedScore = -1;       // 평가등급 조건
        const selectedEvaluator = "";   // 담당자

        let scores = [];
        let zoneScores = [];
        let lastZoneScores = [];

        const scoresData = await HistoryController.DisplayAssessmentHistories(
            beginDate, endDate, buildingGroupID, buildingID, zoneID, selectedScore, selectedEvaluator, siteID, equipZoneID);

        if (scoresData)
            scores = scoresData;


        // .TODO : 층별 그래프 생성하지 않도록 요청 - 2025.05.24
        if (equipZoneID !== null) {
            const [suc, zoneScoresData, lastScoresData] = await AssessmentController.LoadZoneAssessmentHistories(beginDate, endDate, zoneID, siteID, equipZoneID);

            if (suc) {
                zoneScores = zoneScoresData;
                lastZoneScores = lastScoresData;
            }
        }

        this.setState({ scores, zoneScores, lastZoneScores });
    }

    getMakeDateTime(dateTime) {
        let year = dateTime.getFullYear();
        let month = 1 + dateTime.getMonth();
        month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
        let day = dateTime.getDate();                   //d
        day = day >= 10 ? day : '0' + day;

        let strDate = year + '-' + month + '-' + day;
        return strDate;
    }

    getAlarmData(equipZoneData) {
        const yearAlarms = this.state.yearAlarms;
        const todayAlarms = this.state.todayAllAlarms;

        const siteID = this.state.siteID;
        const buildingGroupID = this.state.buildingGroupID;
        const buildingID = this.state.buildingID;
        const zoneID = this.state.zoneID;
        const equipZoneID = this.state.equipZoneID;

        let agoData = {};

        const dtToday = new Date();
        dtToday.setDate(1);
        let dtAgo1 = new Date();
        let dtAgo2 = new Date();
        let dtAgo3 = new Date();
        let dtAgo4 = new Date();
        let dtAgo5 = new Date();
        let dtAgo6 = new Date();
        let dtAgo7 = new Date();
        let dtAgo8 = new Date();
        let dtAgo9 = new Date();
        let dtAgo10 = new Date();
        let dtAgo11 = new Date();

        dtAgo1.setMonth(dtToday.getMonth() - 1);
        dtAgo2.setMonth(dtToday.getMonth() - 2);
        dtAgo3.setMonth(dtToday.getMonth() - 3);
        dtAgo4.setMonth(dtToday.getMonth() - 4);
        dtAgo5.setMonth(dtToday.getMonth() - 5);
        dtAgo6.setMonth(dtToday.getMonth() - 6);
        dtAgo7.setMonth(dtToday.getMonth() - 7);
        dtAgo8.setMonth(dtToday.getMonth() - 8);
        dtAgo9.setMonth(dtToday.getMonth() - 9);
        dtAgo10.setMonth(dtToday.getMonth() - 10);
        dtAgo11.setMonth(dtToday.getMonth() - 11);

        let nAgo = 0;
        let facilityType = null;



        // 오늘 알람 갯수
        for (let i = 0; i < todayAlarms?.length; i++) {
            const alarm = todayAlarms[i];

            facilityType = alarm.facilityType;

            if (facilityType !== SDMSResource.facilityType.FIRE &&
                facilityType !== SDMSResource.facilityType.PSM_SENSOR &&
                facilityType !== SDMSResource.facilityType.Environment &&
                facilityType !== SDMSResource.facilityType.Manufacture)
                continue;

           
            if (alarm.siteID !== siteID ||
                (buildingGroupID !== -1 && alarm.buildingGroupID !== buildingGroupID) ||
                (buildingID !== -1 && alarm.buildingID !== buildingID) ||
                (zoneID !== -1 && alarm.zoneID !== zoneID) ||
                (equipZoneID !== -1 && alarm.equipZoneID !== equipZoneID))
                continue;


            if (!agoData[nAgo])
                agoData[nAgo] = {};

            if (!agoData[nAgo][facilityType])
                agoData[nAgo][facilityType] = 1;
            else
                agoData[nAgo][facilityType] += 1;
        }

        // 11개월 알람 갯수
        for (let i = 0; i < yearAlarms?.length; i++) {
            const alarm = yearAlarms[i];
            const date = new Date(alarm.time);

            nAgo = 0;
            facilityType = alarm.facilityType;

            if (facilityType !== SDMSResource.facilityType.FIRE &&
                facilityType !== SDMSResource.facilityType.PSM_SENSOR &&
                facilityType !== SDMSResource.facilityType.Environment &&
                facilityType !== SDMSResource.facilityType.Manufacture)
                continue;


            if (alarm.siteID !== siteID ||
                (buildingGroupID !== -1 && alarm.buildingGroupID !== buildingGroupID) ||
                (buildingID !== -1 && alarm.buildingID !== buildingID) ||
                (zoneID !== -1 && alarm.zoneID !== zoneID) ||
                (equipZoneID !== -1 && alarm.equipZoneID !== equipZoneID))
                continue;



            if (date?.getMonth() === dtAgo1?.getMonth()) {
                nAgo = 1;
            } else if (date?.getMonth() === dtAgo2?.getMonth()) {
                nAgo = 2;
            } else if (date?.getMonth() === dtAgo3?.getMonth()) {
                nAgo = 3;
            } else if (date?.getMonth() === dtAgo4?.getMonth()) {
                nAgo = 4;
            } else if (date?.getMonth() === dtAgo5?.getMonth()) {
                nAgo = 5;
            } else if (date?.getMonth() === dtAgo6?.getMonth()) {
                nAgo = 6;
            } else if (date?.getMonth() === dtAgo7?.getMonth()) {
                nAgo = 7;
            } else if (date?.getMonth() === dtAgo8?.getMonth()) {
                nAgo = 8;
            } else if (date?.getMonth() === dtAgo9?.getMonth()) {
                nAgo = 9;
            } else if (date?.getMonth() === dtAgo10?.getMonth()) {
                nAgo = 10;
            } else if (date?.getMonth() === dtAgo11?.getMonth()) {
                nAgo = 11;
            }

            if (!agoData[nAgo])
                agoData[nAgo] = {};

            if (!agoData[nAgo][facilityType])
                agoData[nAgo][facilityType] = 1;
            else
                agoData[nAgo][facilityType] += 1;
        }

        return agoData;
    }

    repositionPopup(popupState) {
        let data = popupState.historyData;

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

    onClickSafetyShow = async (assessmentID) => {
        const trActive = document.getElementById('safetyChecklistBoxUl_' + assessmentID);
        const area = document.getElementById('safetyHistoryArea_' + assessmentID);

        if (!trActive || !area)
            return;

        area.innerHTML = "";

        trActive.classList.toggle('on');

        if (!trActive.classList.contains('on'))
            return;

        const siteID = this.state.siteID;
        const [aList, memberScores] = await HistoryController.DisplayAssessmentDetail(assessmentID, siteID);

        let memberScoreUI = [];

        for (let i = 0; i < memberScores?.length; i++) {            
            const memberScore = memberScores[i];        
            const aItems = memberScore.aItems;

            const element = document.createElement("div");
            element.setAttribute("class", "safetyInspectArea safetyInspectionContentWrap");
            area.appendChild(element);

            const element2 = document.createElement("div");
            element2.setAttribute("class", "safetyInspectionWrapPadding");
            element.appendChild(element2);

            const safetyInspectionContents = document.createElement("div");
            safetyInspectionContents.setAttribute("class", "safetyInspectionContents");
            element2.appendChild(safetyInspectionContents);

            const safetyInspectionBox = document.createElement("div");
            safetyInspectionBox.setAttribute("class", "safetyInspectionBox");

            const spanTag = document.createElement("span");
            spanTag.setAttribute("class", "safetyInspectionTitle");
            if (memberScore.type === SDMSResource.assessmentType.eqZone) 
                spanTag.innerHTML = "ZONE";
            else if (memberScore.type === SDMSResource.assessmentType.environ) 
                spanTag.innerHTML = "안전";

            else if (memberScore.type === SDMSResource.assessmentType.currentJob)
                spanTag.innerHTML = "현업";
            else if (memberScore.type === SDMSResource.assessmentType.safety)
                spanTag.innerHTML = "안전/보건";
            else if (memberScore.type === SDMSResource.assessmentType.prevention)
                spanTag.innerHTML = "방재/환경";

            else 
                spanTag.innerHTML = "-";
            safetyInspectionBox.appendChild(spanTag);

            const spanTag2 = document.createElement("span");
            spanTag2.setAttribute("class", "safetyInspectionName");
            spanTag2.innerHTML = memberScore.memberName + " : " + memberScore.scoreClass;
            safetyInspectionBox.appendChild(spanTag2);

            safetyInspectionContents.appendChild(safetyInspectionBox);                   


            // 대분류 항목
            let subClassBox1 = null;
            let subClassBox2 = null;
            // 소분류 항목
            let subClassConts1 = null;
            let subClassConts2 = null;
            let subClassConts3 = null;


            // .TODO: 대분류/소분류 UI 설정
            for (let j = 0; j < aItems?.length; j++) {
                const item = aItems[j];

                if (memberScore.type === SDMSResource.assessmentType.eqZone) {
                    
                    if (j === 0) {
                        const safetyInspectionFlex = document.createElement("div");
                        safetyInspectionFlex.setAttribute("class", "safetyInspectionFlex");

                        const safetyInspectionSquare = document.createElement("span");
                        safetyInspectionSquare.setAttribute("class", "safetyInspectionSquare");
                        safetyInspectionFlex.appendChild(safetyInspectionSquare);

                        const pTag = document.createElement("p");
                        pTag.innerHTML = "공통 항목";
                        safetyInspectionFlex.appendChild(pTag);

                        safetyInspectionContents.appendChild(safetyInspectionFlex);

                        subClassBox1 = document.createElement("div");
                        subClassBox1.setAttribute("class", "subClassBox");

                        const subClassTitle = document.createElement("span");
                        subClassTitle.setAttribute("class", "subClassTitle");
                        subClassTitle.innerHTML = "환경";
                        subClassBox1.appendChild(subClassTitle);

                        subClassConts1 = document.createElement("div");
                        subClassConts1.setAttribute("class", "subClassConts");
                        subClassBox1.appendChild(subClassConts1);

                        safetyInspectionContents.appendChild(subClassBox1);
                    }
                    else if (j === 3) {
                        const subClassTitle = document.createElement("span");
                        subClassTitle.setAttribute("class", "subClassTitle");
                        subClassTitle.innerHTML = "방재";
                        subClassBox1.appendChild(subClassTitle);

                        subClassConts2 = document.createElement("div");
                        subClassConts2.setAttribute("class", "subClassConts");
                        subClassBox1.appendChild(subClassConts2);
                    }
                    else if (j === 10) {
                        const subClassTitle = document.createElement("span");
                        subClassTitle.setAttribute("class", "subClassTitle");
                        subClassTitle.innerHTML = "안전보건";
                        subClassBox1.appendChild(subClassTitle);

                        subClassConts3 = document.createElement("div");
                        subClassConts3.setAttribute("class", "subClassConts");
                        subClassBox1.appendChild(subClassConts3);
                    }

                    if (j < 3) {
                        const subLineBox = document.createElement("div");
                        subLineBox.setAttribute("class", "subLineBox");

                        const spanTag = document.createElement("span");
                        spanTag.innerHTML = item.contents;
                        subLineBox.appendChild(spanTag);

                        const spanTag2 = document.createElement("span");
                        spanTag2.innerHTML = (item.score >= 0 ? item.score + "점" : "-");
                        subLineBox.appendChild(spanTag2);

                        subClassConts1.appendChild(subLineBox);


                        const subTextBox = document.createElement("div");
                        subTextBox.setAttribute("class", "subTextBox");
                        subTextBox.innerHTML = item.memo;

                        subClassConts1.appendChild(subTextBox);
                    }
                    else if (j < 10) {
                        const subLineBox = document.createElement("div");
                        subLineBox.setAttribute("class", "subLineBox");

                        const spanTag = document.createElement("span");
                        spanTag.innerHTML = item.contents;
                        subLineBox.appendChild(spanTag);

                        const spanTag2 = document.createElement("span");
                        spanTag2.innerHTML = (item.score >= 0 ? item.score + "점" : "-");
                        subLineBox.appendChild(spanTag2);

                        subClassConts2.appendChild(subLineBox);

                        const subTextBox = document.createElement("div");
                        subTextBox.setAttribute("class", "subTextBox");
                        subTextBox.innerHTML = item.memo;

                        subClassConts2.appendChild(subTextBox);
                    }
                    else {
                        const subLineBox = document.createElement("div");
                        subLineBox.setAttribute("class", "subLineBox");

                        const spanTag = document.createElement("span");
                        spanTag.innerHTML = item.contents;
                        subLineBox.appendChild(spanTag);

                        const spanTag2 = document.createElement("span");
                        spanTag2.innerHTML = (item.score >= 0 ? item.score + "점" : "-");
                        subLineBox.appendChild(spanTag2);

                        subClassConts3.appendChild(subLineBox);

                        const subTextBox = document.createElement("div");
                        subTextBox.setAttribute("class", "subTextBox");
                        subTextBox.innerHTML = item.memo;

                        subClassConts3.appendChild(subTextBox);
                    }
                }
                else if (memberScore.type === SDMSResource.assessmentType.environ) {
                    if (j === 0) {
                        const safetyInspectionFlex = document.createElement("div");
                        safetyInspectionFlex.setAttribute("class", "safetyInspectionFlex");

                        const safetyInspectionSquare = document.createElement("span");
                        safetyInspectionSquare.setAttribute("class", "safetyInspectionSquare");
                        safetyInspectionFlex.appendChild(safetyInspectionSquare);

                        const pTag = document.createElement("p");
                        pTag.innerHTML = "안전환경평가 항목";
                        safetyInspectionFlex.appendChild(pTag);

                        safetyInspectionContents.appendChild(safetyInspectionFlex);

                        subClassBox1 = document.createElement("div");
                        subClassBox1.setAttribute("class", "subClassBox");

                        const subClassTitle = document.createElement("span");
                        subClassTitle.setAttribute("class", "subClassTitle");
                        subClassTitle.innerHTML = "안전환경";
                        subClassBox1.appendChild(subClassTitle);

                        subClassConts1 = document.createElement("div");
                        subClassConts1.setAttribute("class", "subClassConts");
                        subClassBox1.appendChild(subClassConts1);

                        safetyInspectionContents.appendChild(subClassBox1);
                    }
                                        
                    const subLineBox = document.createElement("div");
                    subLineBox.setAttribute("class", "subLineBox");

                    const spanTag = document.createElement("span");
                    spanTag.innerHTML = item.contents;
                    subLineBox.appendChild(spanTag);

                    const spanTag2 = document.createElement("span");
                    spanTag2.innerHTML = (item.score >= 0 ? item.score + "점" : "-");
                    subLineBox.appendChild(spanTag2);

                    subClassConts1.appendChild(subLineBox);

                    const subTextBox = document.createElement("div");
                    subTextBox.setAttribute("class", "subTextBox");
                    subTextBox.innerHTML = item.memo;

                    subClassConts1.appendChild(subTextBox);
                }
                else if (memberScore.type === SDMSResource.assessmentType.currentJob) {
                    if (j === 0) {
                        const safetyInspectionFlex = document.createElement("div");
                        safetyInspectionFlex.setAttribute("class", "safetyInspectionFlex");

                        const safetyInspectionSquare = document.createElement("span");
                        safetyInspectionSquare.setAttribute("class", "safetyInspectionSquare");
                        safetyInspectionFlex.appendChild(safetyInspectionSquare);

                        const pTag = document.createElement("p");
                        pTag.innerHTML = "현업평가 항목";
                        safetyInspectionFlex.appendChild(pTag);

                        safetyInspectionContents.appendChild(safetyInspectionFlex);

                        subClassBox1 = document.createElement("div");
                        subClassBox1.setAttribute("class", "subClassBox");

                        const subClassTitle = document.createElement("span");
                        subClassTitle.setAttribute("class", "subClassTitle");
                        subClassTitle.innerHTML = "현업";
                        subClassBox1.appendChild(subClassTitle);

                        subClassConts1 = document.createElement("div");
                        subClassConts1.setAttribute("class", "subClassConts");
                        subClassBox1.appendChild(subClassConts1);

                        safetyInspectionContents.appendChild(subClassBox1);
                    }

                    const subLineBox = document.createElement("div");
                    subLineBox.setAttribute("class", "subLineBox");

                    const spanTag = document.createElement("span");
                    spanTag.innerHTML = item.contents;
                    subLineBox.appendChild(spanTag);

                    const spanTag2 = document.createElement("span");
                    spanTag2.innerHTML = (item.score >= 0 ? item.score + "점" : "-");
                    subLineBox.appendChild(spanTag2);

                    subClassConts1.appendChild(subLineBox);

                    const subTextBox = document.createElement("div");
                    subTextBox.setAttribute("class", "subTextBox");
                    subTextBox.innerHTML = item.memo;

                    subClassConts1.appendChild(subTextBox);
                }
                else if (memberScore.type === SDMSResource.assessmentType.safety) {
                    if (j === 0) {
                        const safetyInspectionFlex = document.createElement("div");
                        safetyInspectionFlex.setAttribute("class", "safetyInspectionFlex");

                        const safetyInspectionSquare = document.createElement("span");
                        safetyInspectionSquare.setAttribute("class", "safetyInspectionSquare");
                        safetyInspectionFlex.appendChild(safetyInspectionSquare);

                        const pTag = document.createElement("p");
                        pTag.innerHTML = "안전/보건평가 항목";
                        safetyInspectionFlex.appendChild(pTag);

                        safetyInspectionContents.appendChild(safetyInspectionFlex);

                        subClassBox1 = document.createElement("div");
                        subClassBox1.setAttribute("class", "subClassBox");

                        const subClassTitle = document.createElement("span");
                        subClassTitle.setAttribute("class", "subClassTitle");
                        subClassTitle.innerHTML = "안전/보건";
                        subClassBox1.appendChild(subClassTitle);

                        subClassConts1 = document.createElement("div");
                        subClassConts1.setAttribute("class", "subClassConts");
                        subClassBox1.appendChild(subClassConts1);

                        safetyInspectionContents.appendChild(subClassBox1);
                    }

                    const subLineBox = document.createElement("div");
                    subLineBox.setAttribute("class", "subLineBox");

                    const spanTag = document.createElement("span");
                    spanTag.innerHTML = item.contents;
                    subLineBox.appendChild(spanTag);

                    const spanTag2 = document.createElement("span");
                    spanTag2.innerHTML = (item.score >= 0 ? item.score + "점" : "-");
                    subLineBox.appendChild(spanTag2);

                    subClassConts1.appendChild(subLineBox);

                    const subTextBox = document.createElement("div");
                    subTextBox.setAttribute("class", "subTextBox");
                    subTextBox.innerHTML = item.memo;

                    subClassConts1.appendChild(subTextBox);
                }
                else if (memberScore.type === SDMSResource.assessmentType.prevention) {
                    if (j === 0) {
                        const safetyInspectionFlex = document.createElement("div");
                        safetyInspectionFlex.setAttribute("class", "safetyInspectionFlex");

                        const safetyInspectionSquare = document.createElement("span");
                        safetyInspectionSquare.setAttribute("class", "safetyInspectionSquare");
                        safetyInspectionFlex.appendChild(safetyInspectionSquare);

                        const pTag = document.createElement("p");
                        pTag.innerHTML = "방재/환경평가 항목";
                        safetyInspectionFlex.appendChild(pTag);

                        safetyInspectionContents.appendChild(safetyInspectionFlex);

                        subClassBox1 = document.createElement("div");
                        subClassBox1.setAttribute("class", "subClassBox");

                        const subClassTitle = document.createElement("span");
                        subClassTitle.setAttribute("class", "subClassTitle");
                        subClassTitle.innerHTML = "방재/환경";
                        subClassBox1.appendChild(subClassTitle);

                        subClassConts1 = document.createElement("div");
                        subClassConts1.setAttribute("class", "subClassConts");
                        subClassBox1.appendChild(subClassConts1);

                        safetyInspectionContents.appendChild(subClassBox1);
                    }

                    const subLineBox = document.createElement("div");
                    subLineBox.setAttribute("class", "subLineBox");

                    const spanTag = document.createElement("span");
                    spanTag.innerHTML = item.contents;
                    subLineBox.appendChild(spanTag);

                    const spanTag2 = document.createElement("span");
                    spanTag2.innerHTML = (item.score >= 0 ? item.score + "점" : "-");
                    subLineBox.appendChild(spanTag2);

                    subClassConts1.appendChild(subLineBox);

                    const subTextBox = document.createElement("div");
                    subTextBox.setAttribute("class", "subTextBox");
                    subTextBox.innerHTML = item.memo;

                    subClassConts1.appendChild(subTextBox);
                }
            }
           
            element.classList.toggle('on');            
        }
    }

    getBarData(agoData){
        let barChartUI = [];     
        let dt = new Date();
        dt.setDate(1);

        let strToday, strAgo1, strAgo2, strAgo3, strAgo4, strAgo5, strAgo6, strAgo7, strAgo8, strAgo9, strAgo10, strAgo11;
        //let nMonth = dt.getMonth();

        strToday = (dt.getMonth() + 1) + i18n.t('sdms.safetyAreaAssessment.월');
        dt.setMonth(dt.getMonth() - 1);
        strAgo1 = (dt.getMonth() + 1) + i18n.t('sdms.safetyAreaAssessment.월');
        dt.setMonth(dt.getMonth() - 1);
        strAgo2 = (dt.getMonth() + 1) + i18n.t('sdms.safetyAreaAssessment.월');
        dt.setMonth(dt.getMonth() - 1);
        strAgo3 = (dt.getMonth() + 1) + i18n.t('sdms.safetyAreaAssessment.월');
        dt.setMonth(dt.getMonth() - 1);
        strAgo4 = (dt.getMonth() + 1) + i18n.t('sdms.safetyAreaAssessment.월');
        dt.setMonth(dt.getMonth() - 1);
        strAgo5 = (dt.getMonth() + 1) + i18n.t('sdms.safetyAreaAssessment.월');
        dt.setMonth(dt.getMonth() - 1);
        strAgo6 = (dt.getMonth() + 1) + i18n.t('sdms.safetyAreaAssessment.월');
        dt.setMonth(dt.getMonth() - 1);
        strAgo7 = (dt.getMonth() + 1) + i18n.t('sdms.safetyAreaAssessment.월');
        dt.setMonth(dt.getMonth() - 1);
        strAgo8 = (dt.getMonth() + 1) + i18n.t('sdms.safetyAreaAssessment.월');
        dt.setMonth(dt.getMonth() - 1);
        strAgo9 = (dt.getMonth() + 1) + i18n.t('sdms.safetyAreaAssessment.월');
        dt.setMonth(dt.getMonth() - 1);
        strAgo10 = (dt.getMonth() + 1) + i18n.t('sdms.safetyAreaAssessment.월');
        dt.setMonth(dt.getMonth() - 1);
        strAgo11 = (dt.getMonth() + 1) + i18n.t('sdms.safetyAreaAssessment.월');

        const labels = [strAgo11, strAgo10, strAgo9, strAgo8, strAgo7, strAgo6, strAgo5, strAgo4, strAgo3, strAgo2, strAgo1, strToday];

        const arrFire = [];
        const arrPSM = [];
        const arrEnviron = [];
        const arrManufact = [];

        let maxCnt = 10;

        for (let i = 11; i >= 0; i--) {
            let fireCnt = 0;
            let psmCnt = 0;
            let environCnt = 0;
            let manufactCnt = 0;

            if (agoData) {
                const ago = agoData[i];

                if (ago) {
                    const fireData = ago[SDMSResource.facilityType.FIRE];
                    if (fireData > 0)
                        fireCnt = fireData;

                    const psmData = ago[SDMSResource.facilityType.PSM_SENSOR];
                    if (psmData > 0)
                        psmCnt = psmData;

                    const environData = ago[SDMSResource.facilityType.Environment];
                    if (environData > 0)
                        environCnt = environData;

                    const manufactData = ago[SDMSResource.facilityType.Manufacture];
                    if (manufactData > 0)
                        manufactCnt = manufactData;

                    environCnt += manufactCnt;
                }
            }
            
            arrFire.push(fireCnt);
            arrPSM.push(psmCnt);
            arrEnviron.push(environCnt);

            if (maxCnt < fireCnt)
                maxCnt = fireCnt;
            if (maxCnt < psmCnt)
                maxCnt = psmCnt;
            if (maxCnt < environCnt)
                maxCnt = environCnt;
        }

        if (maxCnt > 10) {
            let temp = maxCnt % 5;
            temp = 5 - temp;

            if (temp !== 0 && temp !== 5) {
                maxCnt += temp;
            }
        }


        const options = {
            responsive: true,
            legend: {
                display: false,
                position: 'top',
                labels: {
                    fontColor: 'rgb(255,255,255)',
                    fontSize: 10
                },
                font: {
                    family: "'Pretendard', 'serif'",
                    lineHeight: 1,
                },
            },
            labels: {
                fontColor: "rgb(255,255,255)",
            },
            title: {
                display: false,
                text: 'Chart.js Bar Chart',
            },
            scales: { //x,y축 설정
                x: {
                    grid: {
                        display: true,
                    },
                    gridLines: {
                        color: "#525868",
                    },
                },
                y: {
                    grid: {
                        display: true,
                    },
                    gridLines: {
                        color: "#525868",
                    },
                },
                xAxes: [{
                    ticks: {
                        fontColor: 'rgba(255, 255, 255, 1)',
                        fontSize: 12,
                        stepSize: 10,
                        barWidth: 5,
                    },
                    gridLines: {
                        color: "rgba(82, 88, 104, 1)",
                        lineWidth: 1
                    }
                }],
                yAxes: [{
                    ticks: {
                        min: 0,                             // 수치 최소값
                        max: maxCnt,                      // 수치 최대값
                        stepSize: (maxCnt / 5),           // 열 스탭 사이즈
                        fontColor: 'rgba(255, 255, 255, 1)',
                        fontSize: 12,
                        barWidth: 5,
                    },
                    gridLines: {//y축 라인 스타일 설정
                        borderDash: [2, 2],
                        borderDashOffset: 0.1,
                        color: "rgba(82, 88, 104, 1)",
                        lineWidth: 1
                    }
                }],
            },
        };

        const data = {
            labels,
            datasets: [
                {
                    label: i18n.t('facilityType.소방'),
                    data: arrFire,
                    backgroundColor: 'rgba(255, 83, 83, 1)',
                },
                {
                    label: i18n.t('facilityType.설비'),
                    data: arrPSM,
                    backgroundColor: 'rgba(83, 169, 255, 1)',
                },
                {
                    label: i18n.t('facilityType.가스'),
                    data: arrEnviron,
                    backgroundColor: 'rgba(83, 255, 169, 1)',
                },
            ],
        };

        barChartUI.push(<Bar key={'barChart'} id='barChart' data={data} options={options} />);

        return [barChartUI];
    }

    getBarData2() {
        // 평가이력

        let zoneScores = this.state.zoneScores;

        let barChartUI = [];
        let dt = new Date();
        dt.setDate(1);

        let strToday, strAgo1, strAgo2, strAgo3, strAgo4, strAgo5, strAgo6, strAgo7, strAgo8, strAgo9, strAgo10, strAgo11;
        //let nMonth = dt.getMonth();

        strToday = (dt.getMonth() + 1) + i18n.t('sdms.safetyAreaAssessment.월');
        dt.setMonth(dt.getMonth() - 1);
        strAgo1 = (dt.getMonth() + 1) + i18n.t('sdms.safetyAreaAssessment.월');
        dt.setMonth(dt.getMonth() - 1);
        strAgo2 = (dt.getMonth() + 1) + i18n.t('sdms.safetyAreaAssessment.월');
        dt.setMonth(dt.getMonth() - 1);
        strAgo3 = (dt.getMonth() + 1) + i18n.t('sdms.safetyAreaAssessment.월');
        dt.setMonth(dt.getMonth() - 1);
        strAgo4 = (dt.getMonth() + 1) + i18n.t('sdms.safetyAreaAssessment.월');
        dt.setMonth(dt.getMonth() - 1);
        strAgo5 = (dt.getMonth() + 1) + i18n.t('sdms.safetyAreaAssessment.월');
        dt.setMonth(dt.getMonth() - 1);
        strAgo6 = (dt.getMonth() + 1) + i18n.t('sdms.safetyAreaAssessment.월');
        dt.setMonth(dt.getMonth() - 1);
        strAgo7 = (dt.getMonth() + 1) + i18n.t('sdms.safetyAreaAssessment.월');
        dt.setMonth(dt.getMonth() - 1);
        strAgo8 = (dt.getMonth() + 1) + i18n.t('sdms.safetyAreaAssessment.월');
        dt.setMonth(dt.getMonth() - 1);
        strAgo9 = (dt.getMonth() + 1) + i18n.t('sdms.safetyAreaAssessment.월');
        dt.setMonth(dt.getMonth() - 1);
        strAgo10 = (dt.getMonth() + 1) + i18n.t('sdms.safetyAreaAssessment.월');
        dt.setMonth(dt.getMonth() - 1);
        strAgo11 = (dt.getMonth() + 1) + i18n.t('sdms.safetyAreaAssessment.월');

        const labels = [strAgo11, strAgo10, strAgo9, strAgo8, strAgo7, strAgo6, strAgo5, strAgo4, strAgo3, strAgo2, strAgo1, strToday];

        const arrAvg = [];
        /*
        dt = new Date();
        let month = dt.getMonth() + 1;

        for (let i = 0; i < 12; i++) {
            let avg = 0;

            for (let j = 0; j < zoneScores?.length; j++) {
                const zoneScore = zoneScores[j];

                if (zoneScore.month === month) {
                    // 존평가(50), 안전평가(50) 합산으로 변경 - 20240430 원익 공민수 요청
                    avg += zoneScore.avgScore * 0.5;
                }
            }

            //arrAvg.unshift(avg);

            month--;
            if (month < 1)
                month += 12;
        }
        */


        // 마지막 평가 점수로 적용
        dt = new Date();
        let month = dt.getMonth() + 2;

        let lastEnv = 0;
        let lastSafe = 0;
        let lastJob = 0;

        // 조회 기간(this.state.lastZoneScores) 이전 타입별 마지막 평가 점수로 초기값 설정
        // - 조회 기간 안에 현업/안전보건/방재환경 데이터가 한 번도 없어도 직전값을 적용할 수 있도록 함
        const lastZoneScores = this.state.lastZoneScores;
        for (let i = 0; i < lastZoneScores?.length; i++) {
            const ls = lastZoneScores[i];

            if (ls.type === SDMSResource.assessmentType.currentJob)        // 현업(3)
                lastJob = ls.avgScore * 0.4;
            else if (ls.type === SDMSResource.assessmentType.safety)       // 안전/보건(4)
                lastSafe = ls.avgScore * 0.28;
            else if (ls.type === SDMSResource.assessmentType.prevention)   // 방재/환경(5)
                lastEnv = ls.avgScore * 0.32;
            // eqZone(1)/environ(2)은 seed 대상 아님 - env 슬롯은 방재/환경(5)만 사용
        }

        for (let i = 0; i < 12; i++) {
            let avg = 0;
            let chkEnv = false;
            let chkSafe = false;
            let chkJob = false;

            for (let j = 0; j < zoneScores?.length; j++) {
                const zoneScore = zoneScores[j];
                let score = 0;

                if (zoneScore.month === month) {

                    if (zoneScore.type === SDMSResource.assessmentType.eqZone) {
                        score = zoneScore.avgScore * 0.68;
                    }
                    else if (zoneScore.type === SDMSResource.assessmentType.environ) {
                        lastEnv = zoneScore.avgScore * 0.32;
                        score = zoneScore.avgScore * 0.32;
                        chkEnv = true;
                    }
                    else if (zoneScore.type === SDMSResource.assessmentType.currentJob) {
                        score = zoneScore.avgScore * 0.4;
                        lastJob = zoneScore.avgScore * 0.4;
                        chkJob = true;
                    }
                    else if (zoneScore.type === SDMSResource.assessmentType.safety) {
                        lastSafe = zoneScore.avgScore * 0.28;
                        score = zoneScore.avgScore * 0.28;
                        chkSafe = true;
                    }
                    else if (zoneScore.type === SDMSResource.assessmentType.prevention) {
                        lastEnv = zoneScore.avgScore * 0.32;
                        score = zoneScore.avgScore * 0.32;
                        chkEnv = true;
                    }

                    // 존평가(50), 안전평가(50) 합산으로 변경 - 20250430 원익 공민수 요청
                    // 합산 비율로 계산 - 20250703
                    //avg += zoneScore.avgScore * 0.5;
                    avg += score;
                }
            }

            // (환경 또는 방재/환경) 평가 점수가 없다면 마지막 (환경 또는 방재/환경) 평가 점수 적용
            if (chkEnv === false) {
                avg += lastEnv;
            }
            // 안전/보건 평가 점수가 없다면 마지막 안전/보건 평가 점수 적용
            if (chkSafe === false) {
                avg += lastSafe;
            }
            // 현업 평가 점수도 없다면 마지막 현업 평가 점수 적용 - 20250818 공민수 과장 요청
            if (chkJob === false) {
                avg += lastJob;
            }

            if (avg > 0) {
                // 소수점 반올림
                avg = Math.round(avg);
            }

            arrAvg.push(avg);

            month++;
            if (month > 12)
                month -= 12;
        }





        const maxCnt = 100;

        const options = {
            responsive: true,
            legend: {
                display: false,
                position: 'top',
                labels: {
                    fontColor: 'rgb(255,255,255)',
                    fontSize: 10
                },
                font: {
                    family: "'Pretendard', 'serif'",
                    lineHeight: 1,
                },
            },
            labels: {
                fontColor: "rgb(255,255,255)",
            },
            title: {
                display: false,
                text: 'Chart.js Bar Chart',
            },
            scales: { //x,y축 설정
                x: {
                    grid: {
                        display: true,
                    },
                    gridLines: {
                        color: "#525868",
                    },
                },
                y: {
                    grid: {
                        display: true,
                    },
                    gridLines: {
                        color: "#525868",
                    },
                },
                xAxes: [{
                    ticks: {
                        fontColor: 'rgba(255, 255, 255, 1)',
                        fontSize: 12,
                        stepSize: 10,
                        barWidth: 5,
                    },
                    gridLines: {
                        color: "rgba(82, 88, 104, 1)",
                        lineWidth: 1
                    }
                }],
                yAxes: [{
                    ticks: {
                        min: 0,                             // 수치 최소값
                        max: maxCnt,                      // 수치 최대값
                        stepSize: (maxCnt / 5),           // 열 스탭 사이즈
                        fontColor: 'rgba(255, 255, 255, 1)',
                        fontSize: 12,
                        barWidth: 5,
                    },
                    gridLines: {//y축 라인 스타일 설정
                        borderDash: [2, 2],
                        borderDashOffset: 0.1,
                        color: "rgba(82, 88, 104, 1)",
                        lineWidth: 1
                    }
                }],
            },
        };

        const data = {
            labels,
            datasets: [
                {
                    label: "안전평가",
                    data: arrAvg,
                    //backgroundColor: 'rgba(255, 83, 83, 1)',
                    backgroundColor: 'rgba(83, 169, 255, 1)',
                },
                //{
                //    label: i18n.t('facilityType.설비'),
                //    data: [],
                //    backgroundColor: 'rgba(83, 169, 255, 1)',
                //},
                //{
                //    label: i18n.t('facilityType.가스'),
                //    data: [],
                //    backgroundColor: 'rgba(83, 255, 169, 1)',
                //},
            ],
        };

        barChartUI.push(<Bar key={'barChart'} id='barChart' data={data} options={options} />);

        return [barChartUI];
    }

    getTableData = () => {
        const scores = this.state.scores;
        const tableUI = [];

        if (scores?.length > 1) {
            scores.sort((a, b) => new Date(a.sendDate) - new Date(b.sendDate));
        }

        for (let i = scores?.length; i > 0; i--) {
            const data = scores[i - 1];

            // 평가를 하지 않는 것은 제외
            if (!data?.assessmentID || data?.score === "-")
                continue;

            let date = data.updateDate;
            if (!date || date === "-")
                date = data.sendDate;

            tableUI.push(
                <React.Fragment key={"scoreList_" + data?.assessmentID}>
                    <ul className={'safetyChecklistBoxUl_B'} id={"safetyChecklistBoxUl_" + data?.assessmentID}  onClick={() => this.onClickSafetyShow(data?.assessmentID)} >
                        <li style={{ width: '28%' }}>{date}</li>
                        <li style={{ width: '28%' }}>{data?.zoneName}</li>
                        {/*<li style={{ width: '30%' }}>{data?.title}</li>*/}
                            <li style={{ width: '28%' }}>{data.evaluator}</li>
                        <li style={{ width: '16%' }}>{data?.score}</li>
                    </ul>
                    <div id={"safetyHistoryArea_" + data?.assessmentID}>                    
                    
                    </div>

                </React.Fragment>
            );
        }

        return tableUI;
    }

    getTitle = () => {
        let title = "";

        const siteID = this.state.siteID;
        const buildingGroupID = this.state.buildingGroupID;
        const buildingID = this.state.buildingID;
        const zoneID = this.state.zoneID;
        const equipZoneID = this.state.equipZoneID;

        //let equipZoneData = -1;

        const buildingGroupList = this.props.buildingGroupList;
        const sites = ProjectResource.sites;

        let chkSite = false;
        let chkBuildingGroup = false;
        let chkBuilding = false;
        let chkZone = false;
        let chkEquipZone = false;

        if (siteID === null)
            return title;

        for (let i = 0; i < sites?.length; i++) {
            const site = sites[i];

            if (site.id === siteID && chkSite === false) {
                title = site.siteName;
                chkSite = true;
            }
        }

        for (let i = 0; i < buildingGroupList?.length; i++) {
            const buildingGroup = buildingGroupList[i];

            if (buildingGroup.id === buildingGroupID) {
                if (chkBuildingGroup === false) {
                    title = buildingGroup.displayText;
                    chkBuildingGroup = true;
                }

                for (let j = 0; j < buildingGroup?.buildingDatas.length; j++) {
                    const building = buildingGroup?.buildingDatas[j];

                    if (building.id === buildingID) {
                        if (chkBuilding === false) {
                            title = building.displayText;
                            chkBuilding = true;
                        }

                        for (let k = 0; k < building.zoneDatas?.length; k++) {
                            const zone = building.zoneDatas[k];

                            if (zone.id === zoneID) {
                                if (chkZone === false) {
                                    title = zone.displayText;
                                    chkZone = true;
                                }

                                for (let z = 0; z < zone.equipmentZoneDatas?.length; z++) {
                                    const equipmentZone = zone.equipmentZoneDatas[z];

                                    if (equipmentZone.id === equipZoneID) {
                                        if (chkEquipZone === false) {
                                            title = equipmentZone.displayText;
                                            //equipZoneData = equipZoneID;
                                            chkEquipZone = true;
                                            break;
                                        }
                                    }
                                }
                            }

                            if (chkZone === true)
                                break;
                        }                                 
                    }

                    if (chkBuilding === true) 
                        break;
                }                
            }

            if (chkBuildingGroup === true)
                break;
        }

        if (chkBuildingGroup === false && zoneID >= 20000) {
            // 외곽일 경우
            chkZone = false;
            chkEquipZone = false;

            const outdoorZones = this.props.outdoorZones;

            for (let outZoneID in outdoorZones) {
                outZoneID = Number(outZoneID);

                if (outZoneID === zoneID) {
                    chkZone = true;

                    const outdoorZone = outdoorZones[outZoneID];

                    title = outdoorZone.name;

                    if (outdoorZone.equipZones?.length > 0) {

                        for (let outEquipZoneID in outdoorZone.equipZones) {
                            const equipZone = outdoorZone.equipZones[outEquipZoneID];

                            if (equipZone[0] === equipZoneID) {
                                title = equipZone[1];
                                break;
                            }
                        }
                    }
                }

                if (chkZone === true)
                    break;
            }
        }

        return title;
    }

    render() {
        const title = this.getTitle();
        //const agoData = this.getAlarmData();
        //const [barChartUI] = this.getBarData(agoData);
        const [barChartUI] = this.getBarData2();

        const tableUI = this.getTableData();

        return (
            <HistoryDataComponent
                id={this.props.popupType}
                className={'viewDashboardBoxD viewDashboardHistoryData'}
                >
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={432}
                    popupMinHeight={741}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >
                    <div className={'dslTop dslGrd'}>
                        <h5 className={'dslTitle'}>
                            이력데이터_{title}
                        </h5>
                        <a className={'dslX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.historyData, false)}></a>
                    </div>
                    <div /* className={'dslCont'} */ style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px 10px 60px 20px' }}>
                        <div className={'safetyGraphArea'}>
                            <div style={{ display: 'flex' }}>
                                <span className={'alarmDetectTitle'}>{i18n.t('sdms.safetyAreaAssessment.안전점검 현황')}</span>
                                <span className={'alarmDetectLabel'}>
                                   {/*<span className={'alarmLabelLine1'}></span><p className={'labelText1'}>{i18n.t('facilityType.소방')}</p>*/}
                                   {/*<span className={'alarmLabelLine2'}></span><p className={'labelText2'}>{i18n.t('facilityType.설비')}</p>*/}
                                   {/*<span className={'alarmLabelLine3'}></span><p className={'labelText3'}>{i18n.t('facilityType.가스')}</p>*/}
                                </span>
                            </div>
                            <div className={'alarmDetectGraph'}>
                               {barChartUI}
                            </div>
                        </div>
                        <div className={'safetyChecklistArea'}>
                            <span className={'safetyChecklistTitle'}>{i18n.t('sdms.safetyAreaAssessment.안전점검표 이력')}</span>
                            <div className={'safetyChecklistBox'}>
                                <div>
                                    <ul className={'safetyChecklistBoxUl'}>
                                        <li style={{ width: '28%' }}>{i18n.t('sdms.safetyAreaAssessment.날짜')}</li>
                                        <li style={{ width: '28%' }}>{i18n.t('sdms.safetyAreaAssessment.구역명')}</li>
                                        {/*<li style={{ width: '30%' }}>항목명</li>*/}
                                        <li style={{ width: '28%' }}>수신자</li>
                                        <li style={{ width: '16%' }}>{i18n.t('sdms.safetyAreaAssessment.평가등급')}</li>
                                    </ul>
                                </div>
                                
                                <div className={'safetyChecklistScrollbar scrollbar'}>
                                    {tableUI}
                                </div> {/* safetyChecklistScrollbar */}
                            </div> {/* safetyChecklistBox */}
                        </div>
                        {/* </div> */} {/* scrollbar */}
                    </div> {/* dslCont */}
                </PopupDraggable>
            </HistoryDataComponent>
        );

    }
}

export default withTranslation()(HistoryData);

