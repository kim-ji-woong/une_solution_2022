import React, { Component } from 'react';
/*import styles from '../../Common/css/style.module.css';*/
import uneStyles from '../../Common/css/uneCommon.module.css';
import '../../Common/css/scroll.css';
import $ from 'jquery';
import { TabContent } from 'reactstrap';
/*import 'bootstrap/dist/css/bootstrap.min.css';*/

import uis from '../../Common/css/ui.module.css';

import Process from './missions/process';
import EndPoint from './missions/endPoint';
import Decision from './missions/decision';
import Internal from './missions/internal';

import { SubSectionTaskListWrap } from '../styled/sopSimulatorStyled';
import { i18n, withTranslation, i18nUtil } from '../../language/i18n';

class MissionListSB extends Component {
    constructor(props) {
        super(props);

        this.state = {
            prevProps: null
        }

        this.props = props;

        this.runSection = this.runSection.bind(this);
    }

    componentDidMount() {
        $('html, body').css({ 'display': 'block', 'height': '100%', 'overflow': 'hidden' });
        // 각 페이지 별로 클래스 초기화
        $('#subPage').removeClass('sop');

        $('.scrollbar').scrollTop(0);


        //현재 시간 >> currentTime 클래스에 담아야됨
/*      let today = new Date();

        document.write(today.toLocaleDateString() + '<br>');
        document.write(today.toLocaleTimeString() + '<br>');*/
        
    }

    componentDidUpdate() {
        if (!this.props.currentSection) {
            return;
        }
        if (this.props.commonSettings.UseAutoMoveSOPScreen === 'true') {
            let currentSectionID = -1;
            let currentSectionType = -1;

            if (this.props.currentSection?.length > 0) {
                const lastIndex = this.props.currentSection.length - 1;
                currentSectionID = this.props.currentSection[lastIndex].id;
                currentSectionType = this.props.currentSection[lastIndex].componentType;
            }
            else {
                currentSectionID = this.props.currentSection.id;
                currentSectionType = this.props.currentSection.componentType;
            }

            let height = 0;
            for (let i = 0; i < this.props.sections?.length; i++) {
                if (this.props.sections[i] === undefined)
                    continue;

                if (this.props.sections[i].id === currentSectionID && this.props.sections[i].componentType === currentSectionType) {
                    break;
                }

                var height2 = $('#section_' + this.props.sopTabIndex + '_' + i).height();
                if (height !== undefined)
                    height += height2;
            }

            //$('.' + uis.scrollbar).scrollTop(height);
            // 애니메이션 효과
            $('.scrollbar').animate({ scrollTop: height }, 500);
        }
    }

    runSection(section, decisionResult) {       
        this.props.runSection(section, decisionResult);
    }

    setMissionUI() {
        let list = [];

        const sectionsLength =  this.props.sections?.length;
        for (let i = 0; i < sectionsLength; i++) {
            const sectionID = this.props.sections[i].id;
            if (this.props.sections[i].componentType === 0) {
                list.push(
                    <Process
                        key={'section_' + sectionID + '_' + i}
                        id={'section_' + this.props.sopTabIndex + '_' + i}
                        sectionData={this.props.sections[i]}
                        runSection={this.runSection}
                        currentSection={this.props.currentSection}
                        onProgressMission={this.props.onProgressMission}
                        runSectionFromChart={this.props.runSectionFromChart}
                        onProgressSpread={this.props.onProgressSpread}
                        onExcuteExternalProgram={this.props.onExcuteExternalProgram}
                        teamDatas={this.props.teamDatas}
                        showConfirmDialog={this.props.showConfirmDialog}
                        onCloseConfirmDialog={this.props.onCloseConfirmDialog}
                        commonSettings={this.props.commonSettings}
                    />
                );
            }
            else if (this.props.sections[i].componentType === 1) {
                // 판단
                list.push(
                    <Decision
                        key={'section_' + sectionID + '_' + i}
                        id={'section_' + this.props.sopTabIndex + '_' + i}
                        sectionData={this.props.sections[i]}
                        runSection={this.runSection}
                        currentSection={this.props.currentSection}
                        arrows={this.props.arrows}
                    />
                );
            }
            else if (this.props.sections[i].componentType === 3) {
                // 시작, 종료
                list.push(
                    <EndPoint
                        key={'section_' + sectionID + '_' + i}
                        id={'section_' + this.props.sopTabIndex + '_' + i}
                        sectionData={this.props.sections[i]}
                        runSection={this.runSection}
                        currentSection={this.props.currentSection}
                        currentActionStep={this.props.currentActionStep}
                        allActionStep={this.props.allActionStep}
                        beginNextStep={this.props.beginNextStep}
                    />
                );
            }
            else if (this.props.sections[i].componentType === 6) {
                // 상황 전파
                list.push(
                    <Internal
                        key={'section_' + sectionID + '_' + i}
                        id={'section_' + this.props.sopTabIndex + '_' + i}
                        sectionData={this.props.sections[i]}
                        runSection={this.runSection}
                        currentSection={this.props.currentSection}
                        onProgressMission={this.props.onProgressMission}
                        runSectionFromChart={this.props.runSectionFromChart}
                        onProgressSpread={this.props.onProgressSpread}
                        teamDatas={this.props.teamDatas}
                        showConfirmDialog={this.props.showConfirmDialog}
                        onCloseConfirmDialog={this.props.onCloseConfirmDialog}
                        commonSettings={this.props.commonSettings}
                    />
                );
            }
        }
        return list;
    }


    render() {
        const listUI = this.setMissionUI();

        return (
            <>
                { /*soulBrainMission*/ }
                <SubSectionTaskListWrap className={'taskListWrap'}>
                    <strong className={'tit'}>{i18n.t('sopSimulator.formText.SOP 임무 목록')}</strong>
                       <div className={'innerSectionnnn scrollbar'}>
                       <div className={'taskSectionArea'}>
                           {listUI}
                       </div> {/*taskSectionArea*/}
                    </div> {/*innerSection*/}
                </SubSectionTaskListWrap> {/*soulBrainMission */}     
            </>
        );
    }
}

export default withTranslation()(MissionListSB);