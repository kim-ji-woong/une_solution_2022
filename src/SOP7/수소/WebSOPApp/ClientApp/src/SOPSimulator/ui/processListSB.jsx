import React, { Component } from 'react';
import $ from 'jquery';
//import { array } from '@amcharts/amcharts4/core';

// styled-components 변환 완료
import { SubSectionProgressHistoryWrap } from '../styled/sopSimulatorStyled';
import { i18n, withTranslation, i18nUtil } from '../../language/i18n';

class ProcessListSB extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sopData: null,
            prevProps: props
        }

        this.props = props;
    }

    componentDidMount() {
        // SOP 진행 내역 버튼
        $('.pgProgress').on('click', '.' + 'btnToggle', function () {
            $(this).closest('.pgProgress').toggleClass('isHidden');
        });
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
                        value.title = i18nUtil.convertText(section.text);

                        let detail = null;

                        if (history.status === 3) {
                            value.status = i18n.t('common.확인');

                            if (section.componentType === 0) {
                                // 프로세스
                                if (section.checked) {
                                    value.status = i18n.t('sopSimulator.formText.완료');
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
                                            value.status = i18n.t('sopSimulator.formText.부분 완료');
                                        }
                                    }
                                }
                            }
                            else if (section.componentType === 6) {
                                if (section.checked) {
                                    value.status = i18n.t('sopSimulator.formText.완료');
                                }
                            }
                        }
                        else if (history.status === 2) {
                            value.status = i18n.t('sopSimulator.formText.실행중');
                        }
                        else {
                            value.status = i18n.t('common.대기');
                        }

                        if (section.componentType === 0 || section.componentType === 6) {
                            if (historyDetail) {
                                if (!detail) {
                                    detail = [];
                                }

                                // 0: 체크해제, 1: 체크, 10: 문자메시지 전파, 20: 메일전파, 30: 방송전파
                                if (historyDetail.dataIndex === -1) {                                    
                                    // 전체 전파                                    
                                    detail.title = i18n.t('sopSimulator.formText.전체 임무 문자, 메일 전파');
                                }
                                else {
                                    detail.title = (historyDetail.dataIndex + 1) + i18n.t('sopSimulator.formText.번 임무') + ' ';
                                    if (historyDetail.datai === 10) {
                                        detail.title += i18n.t('sopSimulator.formText.문자 전파');
                                    }
                                    else if (historyDetail.datai === 20) {
                                        detail.title += i18n.t('sopSimulator.formText.메일 전파');
                                    }
                                    else if (historyDetail.datai === 30) {
                                        detail.title += ' ' + i18n.t('sopSimulator.formText.방송 전파');
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
                        <div key={'summaryDetail_' + j} className={'detailInfo'}>
                            <span className={'message'}>{detail.title}</span>
                        </div>
                    );
                }
            }

            historyUI.push(
                <li key={'summary_' + i} className={'list'}>
                    <a className={haveDetailClassName}>
                        <span className={'text'}>{summary.title}</span>
                        <span className={'statue'}>{summary.status}</span>
                        <span className={'time'}>{summary.time}</span>
                    </a>
                    {detailsUI}
                </li>
            );
        }

        

        return historyUI;
    }

    render() {
        const position = this.props.sopRunData.position;
        const sensorName = !this.props.sensorNames || this.props.sensorNames === null ? i18n.t('sopSimulator.formText.수동') : this.props.sensorNames;
        const type = i18nUtil.convertText(this.props.sopRunData.sopData.disaster.disasterName);
        const stepName = this.props.sopRunData.sopData?.currentActionStep?.stepName;
        let beginTime = '';
        for (var i = 0; i < this.props.sopRunData.sopData.actionStepDatas.length; i++) {
            const actionStepData = this.props.sopRunData.sopData.actionStepDatas[i];
            if (actionStepData.stepName === stepName && actionStepData._ActionStepHistory !== null) {
                beginTime = actionStepData._ActionStepHistory.beginTime.replace('T', ' ');
                break;
            }
        }

        const histroyUI = this.makeHistories();

        return (
            <>
                <SubSectionProgressHistoryWrap className={'progressHistoryWrap'}>
                    <div className={'tit'}>
                        <div>{i18n.t('sopSimulator.formText.SOP 정보')}</div>
                        <button className={'btnToggle'}><i className={'iconArrowLeft'}></i></button>
                    </div>
                    <div className={'innerSectionn'}>
                        <ul>
                            <li>{i18n.t('common.위치')} : {position}</li>
                            <li>{i18n.t('sopSimulator.formText.발생시간')} : {beginTime}</li>
                            <li>{i18n.t('sopSimulator.formText.감지센서')} : {sensorName}</li>
                            <li>{i18n.t('sopSimulator.formText.유형')} : {type}</li>
                            <li>{i18n.t('sopSimulator.formText.단계')} : {stepName}</li>
                        </ul>
                    </div>
                    <div className={'tit'}>
                        <div>{i18n.t('sopSimulator.formText.SOP 진행 내역')}</div>
                        <button className={'btnToggle'}><i className={'iconArrowLeft'}></i></button>
                    </div>
                    <div className={'innerSectionnn'}>
                        <ol className={'numList'}>
                            {histroyUI}
                        </ol>
                    </div>
                </SubSectionProgressHistoryWrap>
            </>
        );
    }
}

export default withTranslation()(ProcessListSB);