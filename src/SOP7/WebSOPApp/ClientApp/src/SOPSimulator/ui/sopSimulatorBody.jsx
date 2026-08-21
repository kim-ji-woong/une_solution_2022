import React, { Component } from 'react';
import '../../Common/css/scroll.css';
import $ from 'jquery';
import { TabContent } from 'reactstrap';

import uis from '../../Common/css/ui.module.css';
import uneStyles from '../../Common/css/uneCommon.module.css';
import uneCommon from '../../Common/css/uneCommon.module.css';

import SopSimulatorController from '../services/sopSimulatorController';
import SopController from '../../SOPManager/services/sopController';

import ProcessListSB from './processListSB';
import SopSimulatorSBChart from './sopSimulatorSBChart';
import MissionListSB from './missionListSB';

import BeginOption from './popup/beginOption';
import SummarySOP from './popup/endPopup';

import SectionData from '../../Common/models/sections/sectionData';
import SessionString from '../../Common/js/sessionString';

import ProjectResource from '../../Root/resource/id';
import AccountResource from '../../Account/resource/id';
import SopManagerResource from '../../SOPManager/resource/id';
import SopSimulatorResource from '../resource/id';
import onGoingSopImg from '../../Common/image/icon/onGoingSopRedImg.png';

import { SimulatorBodySection, AppContainerPgProgress, TabArea, Squaree, Leftt, Rightt } from '../styled/sopSimulatorStyled';
import { i18n, withTranslation, i18nUtil } from '../../language/i18n';

class SopSimulatorBody extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            content: '',
            
            arrows: null,
            currentSection: null,      // 현재 임무 Data            
            currentActionStepHistoryID:-1,            
            sections: null,
            loginUser: null,            
            endPopup: null,

            sensorNames: '',

            prevProps: null,

            tabMaxCount: 6, // 한 페이지에 표시할 탭 최대 개수
            summarySOPKey: -1 // SOP요약창 표시할 SOP
        }

        this.props = props;

        this.runSection = this.runSection.bind(this);
        this.runSectionFromChart = this.runSectionFromChart.bind(this);
        this.excuteSOP = this.excuteSOP.bind(this);
        this.onProgressMission = this.onProgressMission.bind(this);
        this.onProgressSpread = this.onProgressSpread.bind(this);
        this.beginSopData = this.beginSopData.bind(this);
        this.beginSOP = this.beginSOP.bind(this);
        this.closeSOP = this.closeSOP.bind(this);
        this.beginNextStep = this.beginNextStep.bind(this);
    }

    componentDidMount() {
        let userInfo = ProjectResource.getUserInfo();
        if (userInfo !== null || userInfo !== undefined) {
            this.setState({ loginUser: userInfo });
        }

        // Top Menu
        $('.tabArea').on('click', 'a', function () {
            $(this).closest('li').addClass('isActive').siblings().removeClass('isActive');
        });

        // 판단문 yes or no combobox
        $('.seleteBox').on('click', '.seletedTxt', function () {
            $(this).closest('.seleteBox').toggleClass('isShow');
        })
            .on('click', '.' + "value", function () {
                let value = $(this).closest('li').data('val');
                $(this).closest('.seleteBox').toggleClass('isShow');
                $(this).closest('.seleteBox').removeClass('.step01', '.step02', '.step03', '.step04').addClass(value);
                $(this).closest('.seleteBox').find('.seletedTxt').text($(this).text());
            });

        // 페이지 타이틀 
        $('#pageTitle').text("");


/*        $('.' + uneStyles.rightt).click(function () {
            $('.' + uneStyles.tabArea).append(uneStyles.testt);
        });*/

        this.requestSensorName(this.props.sopDatas[this.props.sopTabIndex].sensorZoneHistoryID);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps === prevState.prevProps) {
            return prevState;
        }

        let sections = prevState.sections;
        let arrows = prevState.arrows;
        let currentSection = prevState.currentSection;
        let currentActionStepHistoryID = -1;

        if (nextProps.sopDatas !== null && nextProps.sopDatas.length - 1 >= nextProps.sopTabIndex && nextProps.sopTabIndex > -1) {
            let sopRunData = nextProps.sopDatas[nextProps.sopTabIndex];
            const stepLength = sopRunData.sopData.actionStepDatas.length;
            for (let i = 0; i < stepLength; i++) {
                const actionStepData = sopRunData.sopData.actionStepDatas[i];
                if (!actionStepData.actionStep)
                    continue;

                if (actionStepData.actionStep.id === sopRunData.sopData.currentActionStep.actionStep.id) {
                    sections = actionStepData.stepMemberDatas[0].sections;
                    arrows = actionStepData.stepMemberDatas[0].arrows;
                    currentSection = actionStepData.currentSection;

                    if (actionStepData._ActionStepHistory !== null)
                        currentActionStepHistoryID = actionStepData._ActionStepHistory.id;

                    // 임무 상태 (status)값 할당
                    if (actionStepData.componentHistoryData !== null) {
                        for (let j = 0; j < actionStepData.stepMemberDatas[0].sections.length; j++) {
                            const section = actionStepData.stepMemberDatas[0].sections[j];
                            for (let k = 0; k < actionStepData.componentHistoryData.length; k++) {
                                const componentHistory = actionStepData.componentHistoryData[k].componentHistory;
                                if (componentHistory.componentID === section.id && componentHistory.componentType === section.componentType) {
                                    section.status = componentHistory.status;
                                }
                            }
                        }
                    }
                    else {
                        // 진행 이력이 없으므로 첫번째 임무로 지정한다
                        currentSection = [];
                        currentSection.push(actionStepData.stepMemberDatas[0].sections[0]);
                    }

                    break;
                }
            }
        }

        return {
            sections: sections,
            arrows: arrows,
            currentSection: currentSection,
            currentActionStepHistoryID: currentActionStepHistoryID,
            prevProps: nextProps
        };
    }

    runSectionFromChart(selectSection) {
        if (this.state.currentActionStepHistoryID === -1 && !selectSection.isBegin) {
            // SOP가 시작하지 않았는데 시작이 아닌 다른 세션을 눌렀을 때 
            return false;
        }

        if (this.state.currentActionStepHistoryID > 0 && selectSection.componentType === 3 && selectSection.isBegin) {
            // SOP 시작했는데 시작section 눌렀을 때
            return false;
        }

        if (selectSection.componentType === 3 && selectSection.isBegin) {
            // 시작한 경우 다음 세션을 찾아야하므로 runSection 함수에 넘긴다
            this.runSection(selectSection);
        }
        else if (selectSection.componentType === 3 && !selectSection.isBegin) {
            // 종료 컴포넌트 선택시 종료
            this.closeSOP(false);
        }
        else {
            //var preSection = this.state.currentSection;
            //this.runSection2(selectSection, preSection, true);

            this.runSection(selectSection, undefined, true);
        }

        return true;
    }

    async requestSensorName(sensorZoneHistoryID) {
        let sensorName = null;
        if (sensorZoneHistoryID && sensorZoneHistoryID > 0) {
            sensorName = await SopSimulatorController.requestSensorName(sensorZoneHistoryID);
            sensorName = i18nUtil.convertText(sensorName);
        }
        this.setState({ sensorNames: sensorName });
    }

    // decisionResult 는 판단문일때만 있음    
    async runSection(section, decisionValue, fromChart) {
        if (section.componentType === 3 && !section.isBegin) {
            // 종료 컴포넌트 선택시 종료
            this.closeSOP(false);
            return;
        }

        const sopKey = this.props.currentSopTabKey;
        const actionStepID = this.props.sopDatas[this.props.sopTabIndex].sopData.currentActionStep.actionStep.id;
        const actionStepHistoryID = this.state.currentActionStepHistoryID;
        const userID = this.state.loginUser.id;

        if (this.props.sopDatas[this.props.sopTabIndex].position === null && this.state.currentActionStepHistoryID === -1) {
            this.changeContent(SopSimulatorResource.menu.SOP_시작_옵션);
        }
        else {
            let isSkip = true; // 건너뛰기
            if (!fromChart) {
                if (this.state.currentSection?.length > 0) {
                    const currentSection = this.state.currentSection;
                    for (let i = 0; i < currentSection.length; i++) {
                        if (currentSection[i].componentType === section.componentType && currentSection[i].id === section.id) {
                            isSkip = false;
                            break;
                        }
                    }
                }
            }
            else {
                isSkip = false;
            }

            const history = await SopSimulatorController.runSection(sopKey, actionStepID, actionStepHistoryID, section, userID, decisionValue, isSkip);
            return history;
        }
    }

    async beginSOP(beginDate, position) {
        const sopRunData = this.props.sopDatas[this.props.sopTabIndex];

        //const date = this.getMakeDateTime(beginDate);

        // sop 시작
        await this.excuteSOP(beginDate, sopRunData.sopData.version.id, sopRunData.sopData.currentActionStep.actionStep.id, position, this.state.loginUser.id, sopRunData.sensorZoneHistoryID);

        this.changeContent('');
    }

    async beginNextStep() {
        if (this.state.currentActionStepHistoryID === -1) {
            // SOP가 시작하지 않았는데 시작이 아닌 다른 세션을 눌렀을 때 
            return false;
        }

        // 권한 (사용자 등급은 실행 권한 없음)
        const userAuth = ProjectResource.getUserInfo();
        if (!userAuth || userAuth === null || userAuth.levelID === AccountResource.accountLevelID.user) {
            this.props.showConfirmDialog(i18n.t('common.권한'), i18n.t('sopSimulator.formText.해당 로그인 사용자는 권한이 없습니다'), [i18n.t('common.확인')], null);
            return;
        }

        const sopRunData = this.props.sopDatas[this.props.sopTabIndex];
        let nCurrentIndex = -1;
        let nNextActionStepID = -1;
        let strNextActionStepName = "";
        for (let i = 0; i < sopRunData.sopData.actionStepDatas.length; i++) {
            if (!sopRunData.sopData.actionStepDatas[i].actionStep || sopRunData.sopData.actionStepDatas[i].actionStep === null) {
                continue;
            }

            if (sopRunData.sopData.actionStepDatas[i].actionStep.id === this.props.currentActionStep.actionStep.id) {
                nCurrentIndex = i;
                continue;
            }

            if (nCurrentIndex >= 0 && nCurrentIndex < i) {
                if (sopRunData.sopData.actionStepDatas[i].actionStep !== null) {
                    nNextActionStepID = sopRunData.sopData.actionStepDatas[i].actionStep.id;
                    strNextActionStepName = sopRunData.sopData.actionStepDatas[i].actionStep.stepName;
                    break;
                }
            }
        }

        if (nNextActionStepID > 0) {
            const userID = this.state.loginUser.id;
            await SopSimulatorController.nextActionStep(this.props.currentSopTabKey, nNextActionStepID, this.props.currentActionStep.actionStep.id, userID);
            this.props.onChangeStep(nNextActionStepID, strNextActionStepName);
        }
    }

    getMakeDateTime(dateTime) {
        let year = dateTime.getFullYear();
        let month = 1 + dateTime.getMonth();
        month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
        let day = dateTime.getDate();                   //d
        day = day >= 10 ? day : '0' + day;

        let hour = dateTime.getHours();
        hour = hour >= 10 ? hour : '0' + hour;
        let min = dateTime.getMinutes();
        min = min >= 10 ? min : '0' + min;
        let sec = dateTime.getSeconds();
        sec = sec >= 10 ? sec : '0' + sec;

        let strDate = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;

        return strDate;
    }

    async excuteSOP(beginDate, versionID, actionStepID, position, userID, sensorZoneHistoryID) {
        const actionStepHistoryID = await SopSimulatorController.excuteSOP(beginDate, versionID, actionStepID, position, userID, sensorZoneHistoryID);
        return actionStepHistoryID;
    }

    //async progressSOP(actionStepHistoryID, componentID, componentType, status) {
    //    const userID = 1;
    //    const history = await SopSimulatorController.progressSOP(actionStepHistoryID, componentID, componentType, userID, status);
    //    return history;
    //}

    onChangeTab(index) {
        if (index === this.props.sopTabIndex)
            return;

        this.props.onChangeTab(index);

        this.requestSensorName(this.props.sopDatas[index].sensorZoneHistoryID);
    }

    // SOP Chart에서 단계 변경
    onChangeActionStep = (stepName, stepID) => {
        this.props.onChangeStep(stepID, stepName);
    }

    // 임무 체크
    async onProgressMission(checked, section, dataIndex) {
        let nStatus = section.status;
        if (!nStatus)
            nStatus = SectionData.Status_Normal;

        const sopKey = this.props.currentSopTabKey;
        const actionStepHistoryID = this.state.currentActionStepHistoryID;
        const userID = this.state.loginUser.id;

        // section 뒤져서 완료된 임무라면status(3), 실행한적 없는 임무라면 status(1) 현재임무라면 status(2)로 insert
        
        await SopSimulatorController.progressMission(
            sopKey,
            actionStepHistoryID,
            section.componentType, section.id,
            dataIndex, nStatus, userID, checked);
    }

    // 상황 전파
    async onProgressSpread(section, dataIndex, isSMS, isEmail, isBroadcast, isSiren, message, teams) {
        let nStatus = section.status;
        if (!nStatus)
            nStatus = SectionData.Status_Normal;

        const sopKey = this.props.currentSopTabKey;
        const actionStepHistoryID = this.state.currentActionStepHistoryID;
        const userID = this.state.loginUser.id;

        // 전파
        if (section.componentType === 0) {
            await SopSimulatorController.progressSpread(
                sopKey,
                actionStepHistoryID,
                section.componentType, section.id,
                dataIndex, nStatus, userID,
                isSMS, isEmail, isBroadcast, isSiren,
                message);
        }
        else {
            await SopSimulatorController.progressInternalSpread(
                sopKey,
                actionStepHistoryID,
                section.componentType, section.id,
                dataIndex, nStatus, userID,
                isSMS, isEmail, isBroadcast, isSiren,
                message, teams);
        }
    }

    onExcuteExternalProgram = async(section, dataIndex) =>{
        let nStatus = section.status;
        if (!nStatus)
            nStatus = SectionData.Status_Normal;

        const sopKey = this.props.currentSopTabKey;
        const actionStepHistoryID = this.state.currentActionStepHistoryID;
        const userID = this.state.loginUser.id;
                
        await SopSimulatorController.excuteExternalProgram(
            sopKey,
            actionStepHistoryID,
            section.componentType, section.id,
            dataIndex, nStatus, userID);
    }

    beginSopData() {
        if (this.state.currentSection?.length > 0) {
            if (this.state.currentSection[0].componentType === 3 && this.state.currentSection[0].isBegin) {
                // 권한 (사용자 등급은 실행 권한 없음)
                const userAuth = ProjectResource.getUserInfo();
                if (!userAuth || userAuth === null || userAuth.levelID === AccountResource.accountLevelID.user) {
                    this.props.showConfirmDialog(i18n.t('common.권한'), i18n.t('sopSimulator.formText.해당 로그인 사용자는 권한이 없습니다'), [i18n.t('common.확인')], null);
                    return;
                }

                this.runSectionFromChart(this.state.currentSection[0]);
            }
        }
    }

    async closeSOP(ignoreSummary) {
        // 권한 (사용자 등급은 실행 권한 없음)
        const userAuth = ProjectResource.getUserInfo();
        if (!userAuth || userAuth === null || userAuth.levelID === AccountResource.accountLevelID.user) {
            this.props.showConfirmDialog(i18n.t('common.권한'), i18n.t('sopSimulator.formText.해당 로그인 사용자는 권한이 없습니다'), [i18n.t('common.확인')], null);
            return;
        }

        const sopRunData = this.props.sopDatas[this.props.sopTabIndex];
        const actionStepHistory = sopRunData.sopData.currentActionStep?._ActionStepHistory;
        if (actionStepHistory && actionStepHistory !== null) {

            const endTime = this.getMakeDateTime(new Date());

            actionStepHistory.endTime = endTime;
            // SOP 결과 요약창 사용?
            if (this.props.commonSettings.UseResultSummary === 'true' && !ignoreSummary) {
                this.setState({ content: SopSimulatorResource.menu.SOP_요약, summarySOPKey: sopRunData.key });
            }
            else {
                await this.props.closeSOP(this.props.sopTabIndex, actionStepHistory.id, actionStepHistory.endTime);
            }
        }
        else {
            // 시작 전 SOP는 탭만 없애준다
            await this.props.closeSOP(this.props.sopTabIndex, null, null, null);
        }
    }

    // 열려있는 SOP 탭 만들기
    getSopTabUI() {
        if (this.props.sopDatas === null || this.props.sopDatas.length === 0)
            return null;

        let sopTabUI = [];

        let beginIndex = 0;
        let endIndex = 0;
        if (this.props.sopDatas.length <= this.state.tabMaxCount) {
            beginIndex = 0;
            endIndex = this.props.sopDatas.length;
        }
        else {            
            let value = parseInt(this.props.sopDatas.length / this.state.tabMaxCount);
            let remainder = this.props.sopDatas.length % this.state.tabMaxCount;
            
            let bundle = parseInt((this.props.sopTabIndex) / this.state.tabMaxCount);
            beginIndex = bundle * this.state.tabMaxCount;
            endIndex = beginIndex + 6;
        }
        
        for (let i = beginIndex; i < endIndex; i++) {

            if (this.props.sopDatas.length - 1 < i) {
                continue;
            }

            const disasterName = i18nUtil.convertText(this.props.sopDatas[i].sopData.disaster.disasterName);
            const stepName = (this.props.sopDatas[i].sopData.currentActionStep) ? this.props.sopDatas[i].sopData.currentActionStep.stepName : '';
            const className = (this.props.sopTabIndex === i) ? 'isActive' : null;
            const index = i;

            // position 값이 있으면 실행중임
            if (this.props.sopDatas[i].position) {
                sopTabUI.push(<li className={className} key={i}><a onClick={() => this.onChangeTab(index)}>{disasterName}({stepName})</a><img className={'onGoingSopImg'} src={onGoingSopImg} /></li>);
            }
            else {
                sopTabUI.push(<li className={className} key={i}><a onClick={() => this.onChangeTab(index)}>{disasterName}({stepName})</a></li>);
            }            
        }

        sopTabUI.push(<li className={'posiRelative'} key={'tabPlus'} onClick={() => this.props.changeContent(SopSimulatorResource.menu.SOP_불러오기)}><a className={'plus posiAbsolute'}></a></li>);

        return sopTabUI;
    }

    changeContent = (content) => {
        this.setState({ content: content });
    }

    onClickPrevTab = () => {
        const curIndex = this.props.sopTabIndex;
        if (curIndex - 1 < 0 || this.props.sopDatas.length - 1 < curIndex - 1)
            return;

        this.props.onChangeTab(curIndex - 1);
    }

    onClickNextTab = () => {
        const curIndex = this.props.sopTabIndex;
        if (this.props.sopDatas.length - 1 < curIndex + 1)
            return;

        this.props.onChangeTab(curIndex + 1);
    }

    getPopup() {
        if (this.state.content === SopSimulatorResource.menu.SOP_시작_옵션) {
            const sopData = this.props.sopDatas[this.props.sopTabIndex].sopData;
            const title = i18nUtil.convertText(sopData.disasterCategory.categoryName) + ' → ' +
                          i18nUtil.convertText(sopData.subDisasterCategory.subCategoryName) + ' → ' +
                          i18nUtil.convertText(sopData.disaster.disasterName) + ' → ' +
                          i18nUtil.convertText(sopData.currentActionStep.stepName);
            return <BeginOption changeContent={this.changeContent} beginSOP={this.beginSOP} title={title}/>
        }
        else if (this.state.content === SopSimulatorResource.menu.SOP_요약) {
            const sopRunData = this.props.sopDatas[this.props.sopTabIndex];
            if (this.state.summarySOPKey === sopRunData.key) {
                return <SummarySOP changeContent={this.changeContent} closeSOP={this.props.closeSOP} sopRunData={sopRunData} loginUser={this.state.loginUser} />
            }
        }

        return <></>;
    }

    render() {
        const tabUI = this.getSopTabUI();

        let squareeUI = null;

        if (ProjectResource.styleMode !== ProjectResource.StyleType.Hydrogen) {
            squareeUI = (<Squaree>
                <Leftt onClick={this.onClickPrevTab}></Leftt>
                <Rightt onClick={this.onClickNextTab}></Rightt>
            </Squaree>);
        }

        return (
            <>                 
                <SimulatorBodySection>
                   {
				       ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen &&
				     	<div className={'teamEditorName'}><span>SOP</span>{/* <span className={'teamEditorNameIcon'}></span> */}</div>
				    }
                    <AppContainerPgProgress className={'pgProgress'}>
                        <TabArea>
                            {squareeUI}
                            <ul>
                                {tabUI}
                            </ul>
                        </TabArea>

                        <ProcessListSB sopRunData={this.props.sopDatas[this.props.sopTabIndex]} sensorNames={this.state.sensorNames} />
                        
                        <SopSimulatorSBChart
                            sopData={this.props.sopDatas[this.props.sopTabIndex].sopData}
                            onChangeActionStep={this.onChangeActionStep}
                            onSelectComponent={this.runSectionFromChart}
                            currentSection={this.state.currentSection}
                            sopTabIndex={this.props.sopTabIndex}
                            beginSopData={this.beginSopData}
                            closeSOP={this.closeSOP}
                            currentActionStep={this.props.currentActionStep}
                            showConfirmDialog={this.props.showConfirmDialog}
                            onCloseConfirmDialog={this.props.onCloseConfirmDialog}
                            commonSettings={this.props.commonSettings}
                        />
                        
                        <MissionListSB
                            arrows={this.state.arrows}
                            currentSection={this.state.currentSection}
                            runSection={this.runSection}
                            onProgressSpread={this.onProgressSpread}
                            onExcuteExternalProgram={this.onExcuteExternalProgram}
                            runSectionFromChart={this.runSectionFromChart}
                            onProgressMission={this.onProgressMission}
                            sopTabIndex={this.props.sopTabIndex}

                            sopDatas={this.props.sopDatas}
                            currentActionStep={this.props.sopDatas[this.props.sopTabIndex].sopData.currentActionStep}
                            allActionStep={this.props.sopDatas[this.props.sopTabIndex].sopData.actionStepDatas}

                            sections={this.state.sections}
                            displaySopTabKey={this.props.displaySopTabKey}
                            teamDatas={this.props.teamDatas}
                            showConfirmDialog={this.props.showConfirmDialog}
                            onCloseConfirmDialog={this.props.onCloseConfirmDialog}
                            commonSettings={this.props.commonSettings}
                            beginNextStep={this.beginNextStep}
                        />
                        
                        
                    </AppContainerPgProgress>
                </SimulatorBodySection>
                {                    
                    this.getPopup()
                }
        	</>
		);
	}
}

export default withTranslation()(SopSimulatorBody);