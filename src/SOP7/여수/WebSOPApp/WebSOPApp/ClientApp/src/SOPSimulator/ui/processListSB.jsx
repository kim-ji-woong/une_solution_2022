import React, { Component, version } from 'react';
import uis from '../../Common/css/ui.module.css';

import uneStyles from '../../Common/css/uneCommon.module.css';
import $ from 'jquery';
//import { array } from '@amcharts/amcharts4/core';
import SopSimulatorController from '../services/sopSimulatorController';
import SopController from '../../SOPManager/services/sopController';
import { Link } from 'react-router-dom';

import { SubSectionSopInfoProgressHistoryWrap, InnerSectionnn } from '../styled/ProcessListStyled.js';

class ProcessListSB extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sopData: null,
            prevProps: props,

            disasterCategories: [],
            disasterCategoriesEmergency: [],
            isNormal: true,
            isEmergency: false,

            selectedDisasterCategory: null, // 재난분야
            selectedSubDisasterCategory: null,      // 재난종류
            selectedDisaster: null,         // 재난상황
            selectedVersion: null,          // 선택 SOP
        }

        this.props = props;
    }

    componentDidMount() {
        // SOP 진행 내역 버튼
        /* $('.' + uis.pgProgress).on('click', '.' + uis.btnToggle, function () {
            $(this).closest('.' + uis.pgProgress).toggleClass(uis.isHidden);
        }); */

        // SOP 진행 내역 목록
        //$('.' + uis.progressHistoryWrap + ' ' + '.' + uis.numList).on('click', '.' + uis.btnList, function () {
        //    $(this).closest('.' + uis.list).toggleClass(uis.isShow);
        //    $(this).siblings('.' + uis.detailInfo).slideToggle();
        //}); 


        $('.' + uis.progressHistoryWrap).on('click', 'dt', function () {
            $(this).closest('.' + uis.list).toggleClass(uis.isShow).siblings().removeClass(uis.isShow);
        });

        // 재난분야 버튼 이벤트
        $('.category dd ul').on('click', 'li', function () {
            //console.log("재난분야 버튼 테스트");

            // 재난분야 메뉴 닫기
            $('.category').removeClass(uis.isShow);
            // 재난종류 메뉴 열기
            $('.subCategory').addClass(uis.isShow);
        });

        // 재난종류 버튼 이벤트
        $('.subCategory dd ul').on('click', 'li', function () {
            //console.log("재난종류 버튼 테스트");
        });

        this.getDisasterCategories();
    }

    getHMS(time) {
        const now = new Date(time);

        //const year = now.getFullYear();
        //const month = now.getMonth();
        //const day = now.getDate();
        const hour = now.getHours();
        const min = now.getMinutes();
        const sec = now.getSeconds();

        const strHour = hour >= 10 ? hour.toString() : "0" + hour;
        const strMin = min >= 10 ? min.toString() : "0" + min;
        const strSec = sec >= 10 ? sec.toString() : "0" + sec;

        return strHour + ':' + strMin + ':' + strSec;
    }

    makeHistories() {
        let historyUI = [];

        let summaries = new Array();

        const actionStepDatasLength = this.props.sopRunData.sopData.actionStepDatas.length;
        for (let i = 0; i < actionStepDatasLength; i++) {
            const actionStepData = this.props.sopRunData.sopData.actionStepDatas[i];
            if (!actionStepData.actionStep) {
                continue;
            }

            if (actionStepData.actionStep.id !== this.props.sopRunData.sopData.currentActionStep.actionStep.id) {
                continue;
            }

            if (!actionStepData.componentHistoryData) {
                continue;
            }

            const histroyLength = actionStepData.componentHistoryData.length;
            for (let j = 0; j < histroyLength; j++) {
                const history = actionStepData.componentHistoryData[j].componentHistory;
                const historyDetail = actionStepData.componentHistoryData[j]._ComponentHistoryDetails;

                if (historyDetail && historyDetail.datai < 2) {
                    continue;
                }

                const sectionLength = actionStepData.stepMemberDatas[0].sections.length;
                for (let k = 0; k < sectionLength; k++) {
                    const section = actionStepData.stepMemberDatas[0].sections[k];
                    if (section.id === history.componentID && section.componentType === history.componentType) {
                        const key = section.componentType + '_' + section.id;
                        const value = [];
                        value.key = key;
                        value.time = this.getHMS(history.time);
                        value.title = section.text;

                        let detail = null;

                        if (history.status === 3) {
                            value.status = '확인';

                            if (section.componentType === 0) {
                                // 프로세스
                                if (section.checked) {
                                    value.status = "완료";
                                }
                                else {
                                    if (section.missions) {
                                        let checked = false;
                                        for (let q = 0; q < section.missions.length; q++) {
                                            if (section.missions[q].checked) {
                                                checked = true;
                                                break;
                                            }
                                        }
                                        if (checked) {
                                            value.status = "부분 완료";
                                        }
                                    }
                                }
                            }
                            else if (section.componentType === 6) {
                                if (section.checked) {
                                    value.status = "완료";
                                }
                            }
                        }
                        else if (history.status === 2) {
                            value.status = '실행중';
                        }
                        else {
                            value.status = '대기';
                        }

                        if (section.componentType === 0 || section.componentType === 6) {
                            if (historyDetail) {
                                if (!detail) {
                                    detail = [];
                                }

                                // 0: 체크해제, 1: 체크, 10: 문자메시지 전파, 20: 메일전파, 30: 방송전파
                                if (historyDetail.dataIndex === -1) {                                    
                                    // 전체 전파                                    
                                    detail.title = '전체 임무 문자메시지, 메일 전파';
                                }
                                else {
                                    detail.title = (historyDetail.dataIndex + 1) + '번 임무 ';
                                    if (historyDetail.datai === 10) {
                                        detail.title += ' 문자메시지 전파';
                                    }
                                    else if (historyDetail.datai === 20) {
                                        detail.title += ' 메일 전파';
                                    }
                                    else if (historyDetail.datai === 30) {
                                        detail.title += ' 방송 전파';
                                    }
                                }
                            }
                        }

                        let match = false;
                        for (let q = 0; q < summaries.length; q++) {
                            if (key === summaries[q].key) {
                                value.details = [];
                                if (summaries[q].details) {
                                    value.details = summaries[q].details;
                                } 

                                if (detail) {
                                    value.details.push(detail);
                                }

                                summaries[q] = value;
                                
                                match = true;
                                break;
                            }
                        }

                        if (!match) {
                            summaries.push(value);
                        }

                        break;
                    }
                }       
            }
        }

        for (let i = 0; i < summaries.length; i++) {
            const summary = summaries[i];
            
            let detailsUI = [];
            let haveDetailClassName = 'btnList';
            if (summary.details) {
                haveDetailClassName = 'btnList';
                for (let j = 0; j < summary.details.length; j++) {
                    const detail = summary.details[j];

                    detailsUI.push(
                        <div key={'summaryDetail_' + j} className={'detailInfo clfix'}>
                            <span className={'message'}>{detail.title}</span>
                            {/*<span className={uis.target}>통합방재실</span>*/}
                        </div>
                    );
                }
            }

            historyUI.push(
                <li key={'summary_' + i} className={uis.list}>
                    <a /* className={haveDetailClassName} */ className={'btnList'}>
                        {/* <span style={{ display: 'flex' }}> */}
                           <span className={'text'}>{summary.title}</span>
                           <span className={'statue'}>{summary.status}</span>
                           <span className={'time'}>{summary.time}</span>
                        {/* </span> */}
                    </a>
                    {detailsUI}
                </li>
            );
        }

        return historyUI;
    }

    async getDisasterCategories() {
        const [disasterCategories, message] = await SopController.disasterCategories(true);
        const [disasterCategoriesEmergency, message2] = await SopController.disasterCategories(false);

        //const isNormal = await this.getWorkingTime();
        //const isEmergency = !isNormal;

        const isNormal = true;
        const isEmergency = false;

        this.setState({ disasterCategories, disasterCategoriesEmergency, isNormal, isEmergency });
    }

    getCheckBoxList = () => {

        if (this.state.disasterCategories === [] || this.state.disasterCategoriesEmergency === []) {
            return;
        }

        let elements = [];

        let sopDatas = this.props.sopDatas; // 지금 선택된 SOP

        if (this.state.isNormal) {
            for (var i = 0; i < this.state.disasterCategories?.length; i++) {

                const dc = this.state.disasterCategories[i];

                for (var j = 0; j < dc.subDisasterCategories?.length; j++) {

                    const sdc = dc.subDisasterCategories[j];

                    if (this.state.selectedDisasterCategory === null || this.state.selectedDisasterCategory.id === sdc.subDisasterCategory.disasterCategoryID) {

                        for (var k = 0; k < sdc.disasterDatas?.length; k++) {

                            const d = sdc.disasterDatas[k];
                            const allVersions = [];

                            for (var q = 0; q < d.disasterDatas?.length; q++) {
                                if (this.state.selectedSubDisasterCategory === null || this.state.selectedSubDisasterCategory.id === d.disasterDatas[q].disaster.subDisasterCategoryID) {
                                    const isNormal = d.disasterDatas[q].version.isNormal;
                                    if ((isNormal && this.state.isNormal) || (!isNormal && this.state.isEmergency)) {
                                        allVersions.push(d.disasterDatas[q].version);
                                    }
                                }
                            }

                            let lastAccessVersion = (allVersions.length > 0) ? allVersions[0] : null;
                            for (var q = 0; q < allVersions?.length; q++) {
                                if (allVersions?.length - 1 >= q + 1) {
                                    if (lastAccessVersion < allVersions[q + 1].lastAccessTime) {
                                        lastAccessVersion = allVersions[q + 1];
                                    }
                                }
                            }

                            if (lastAccessVersion !== null) {
                                const lastAccessTime = lastAccessVersion.lastAccessTime.replace('T', ' '); //this.getMakeDateTime(lastAccessVersion.lastAccessTime);

                                let isChecked = this.getCheckedState(lastAccessVersion.id);

                                const element = <li className={'missionSelectBox'}><input type="checkBox" checked={isChecked} onChange={(e) => this.onCheckSop(e, lastAccessVersion.id)} />{d.disasterName}</li>;

                                elements.push(element);

                            }
                        }
                    }
                }
            }
        }

        return elements;
    }

    getCheckedState = (versionID) => {
        let checkedList = this.props.sopDatas !== null ? this.props.sopDatas : [];

        if (checkedList === null || checkedList === undefined || checkedList.length === 0)
            return false;

        for (let i = 0; i < checkedList.length; i++) {
            let indiKey = checkedList[i].key;

            const parts = indiKey.split('/');
            const number = parts.length >= 3 ? parseInt(parts[2]) : null;

            if (versionID === number)
                return true;
        }

        return false;

    }

    onCheckSop = (event, versionID) => {

        let checkedList = [];

        const isChecked = event.target.checked;

        if (!isChecked) {

            checkedList = this.props.sopDatas;

            for (let i = 0; i < checkedList.length; i++) {

                let curSop = checkedList[i];
                let version = curSop.sopData.version.id;
                if (curSop !== null && curSop !== undefined) {
                    if (curSop.position !== null && curSop.position !== undefined) {
                        if (versionID === version) {
                            return this.props.showConfirmDialog("에러", ["알람 발생중인 SOP를 종료해주세요."], null, () => this.props.onCloseConfirmDialog()); // 알람 발생중인 Sop 존재시 체크박스 해제 불가.
                        }
                    }
                }
            }

            if (checkedList.length === 1) {
                return this.props.showConfirmDialog("에러", ["최소 한개 이상의 SOP가 선택되어야 합니다."], null, () => this.props.onCloseConfirmDialog());
            } else { // Check 해제시 sopDatas에서 빼줘야 함

                // closeSOP들어갈 자리
                const tabIndex = this.props.sopTabIndex;
                
                const sopDatas = this.props.sopDatas;

                let index = null;

                for (let i = 0; i < sopDatas.length; i++) {
                    if (sopDatas[i].sopData.disaster.versionID === versionID) {
                        index = i;
                    }
                }

                this.props.closeSOP2(index);

            }

        }

        if (isChecked)
            return this.props.openDB(versionID, null);

        // isChecked가 아닌경우 

        return;
    }

    render() {

        var categoryName = (this.state.selectedDisasterCategory === null) ? '전체' : this.state.selectedDisasterCategory.categoryName;
        var subCategoryName = (this.state.selectedSubDisasterCategory === null) ? '전체' : this.state.selectedSubDisasterCategory.subCategoryName;

        const position = this.props.sopRunData.position;
        const sensorName = this.state.sensorName;
        const type = this.props.sopRunData.sopData.disaster.disasterName;
        const stepName = this.props.sopRunData.sopData.currentActionStep.stepName;
        let beginTime = '';
        for (var i = 0; i < this.props.sopRunData.sopData.actionStepDatas.length; i++) {
            const actionStepData = this.props.sopRunData.sopData.actionStepDatas[i];
            if (actionStepData.stepName === stepName && actionStepData._ActionStepHistory !== null) {
                beginTime = actionStepData._ActionStepHistory.beginTime.replace('T', ' ');
                break;
            }
        }

        const histroyUI = this.makeHistories();

        const checkBoxList = this.getCheckBoxList();

        return (
            <>
              <SubSectionSopInfoProgressHistoryWrap className={'subSectionSopInfo' + " " + uis.progressHistoryWrap}>
                <div /* style={{ display: 'block', height: 'calc(100% - 170px)' }} */>
                  <dl>
                    {/*SOP 정보*/}
                    <div className={uis.list + ' category'}>
                        <dt><span className={'leftBorder'}>SOP 정보</span><em className={'menualArrow'}></em></dt>
                        <dd>
                            <ul>
                               <li>위치 : {position}</li>
                               <li>발생시간 : {beginTime}</li>
                               <li>감지센서 : {this.props.sensorNames}</li>
                               <li>유형 : {type}</li>
                               <li>단계 : {stepName}</li>
                            </ul>
                        </dd>
                    </div>
                    {/*SOP 진행내역*/}
                    <div className={uis.list + " " + uis.clfix + ' subCategory'}>
                        <dt><span className={'leftBorder'}>SOP 진행 내역</span><em className={'menualArrow'}></em></dt>
                        <dd>
                        <ul>
                           <p id={uis.progressList}>
                              <InnerSectionnn className={'innerSectionnn' + 'scrollbar'}>
                                <ol className={'numList'}>
                                    {histroyUI}
                                </ol>
                              </InnerSectionnn>
                           </p>
                        </ul>
                        </dd> 
                    </div>
                    {/*SOP 임무추가*/}
                    <div className={uis.list + " " + uis.missionAddBox + ' subCategorys'}>
                        <dt><span className={'leftBorder'}>SOP 임무 추가</span><em className={'menualArrow'}></em></dt>
                        <dd>
                            <ul className={'missionSelectBox'}>
                               {checkBoxList}
                            {/*<li><input type="checkBox" />기상특보</li>*/}
                            {/*<li><input type="checkBox" />건물화재</li>*/}
                            {/*<li><input type="checkBox" />화재_자동</li>*/}
                            {/*<li><input type="checkBox" />화재_수동</li>*/}
                            {/*<li><input type="checkBox" />누출_수동</li>*/}
                            {/*<li><input type="checkBox" />누출_자동</li>*/}
                            {/*<li><input type="checkBox" />안전사고_자동</li>*/}
                            </ul>
                        </dd>
                    </div>
                  </dl>
                </div>
              </SubSectionSopInfoProgressHistoryWrap>
           </>
        );
    }
}

export default ProcessListSB;