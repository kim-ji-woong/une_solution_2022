import React, { Component } from 'react';
/*import styles from '../../../Common/css/style.module.css';*/
import uis from '../../../Common/css/ui.module.css';
import uneStyles from '../../../Common/css/uneCommon.module.css';
import SectionData from '../../../Common/models/sections/sectionData';

import { EndPointSectionBox } from '../../styled/missionsStyled';

import ProjectResource from '../../../Root/resource/id';
import AccountResource from '../../../Account/resource/id';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';

class EndPoint extends Component {
    constructor(props) {
        super(props);

        this.state = {
            prevProps: props
        }

        this.props = props;

        this.runSection = this.runSection.bind(this);
    }

    async runSection() {        
        await this.props.runSection(this.props.sectionData);
    }

    onNextStep = () => {
        this.props.beginNextStep();
    }

    // 다음 단계가 있는지 여부
    haveNextStep() {
        if (!this.props.sectionData.isBegin) {
            let nCurrentIndex = -1;
            for (let i = 0; i < this.props.allActionStep.length; i++) {
                if (!this.props.allActionStep[i].actionStep || this.props.allActionStep[i].actionStep === null) {
                    continue;
                }

                if (this.props.allActionStep[i].actionStep.id === this.props.currentActionStep.actionStep.id) {
                    nCurrentIndex = i;
                    continue;
                }

                if (nCurrentIndex >= 0 && nCurrentIndex < i) {
                    if (this.props.allActionStep[i].actionStep !== null) {
                        return [true, this.props.allActionStep[i].stepName];
                    }
                }
            }

            return [false, ""];
        }

        return [false, ""];
    }

    getActionStepIndex() {
        if (this.props.allActionStep?.length > 0) {
            for (let i = 0; i < this.props.allActionStep.length; i++) {
                if (this.props.allActionStep[i].stepName === this.props.currentActionStep.actionStep.stepName) {
                    return i + 1;
                }
            }
        }
        return -1;
    }


    render() {
        let boxClassName = "";
        let textClassName = " " + 'textNormal';

        let bAmICurrentSection = false; // 자신이 현재 세션인지 여부
        const currentSectionCount = this.props.currentSection.length;
        for (let i = 0; i < currentSectionCount; i++) {
            const currentSection = this.props.currentSection[i];
            if (currentSection.id === this.props.sectionData.id && currentSection.componentType === this.props.sectionData.componentType) {
                bAmICurrentSection = true;
            }
        }

        if (bAmICurrentSection) {
            boxClassName = " " + 'sectionCurrent' + " " + 'currentBox';
            textClassName = " " + 'textCurrent';
        } else if (this.props.sectionData.status === SectionData.Status_Run) {
            boxClassName = " " + 'sectionRun';
            textClassName = " " + 'textRun';
        } else if (this.props.sectionData.status === SectionData.Status_Done) {
            boxClassName = " " + 'sectionDone';
            textClassName = " " + 'textDone';
        } else if (this.props.sectionData.status === SectionData.Status_Skip) {
            boxClassName = " " + 'sectionRun';
            textClassName = " " + 'textRun';
        }


        // 다음 버튼 활성화
        var btnNextClassName = 'btnAllCheck';        
        if (!this.props.sectionData.isBegin &&
            this.props.currentSection?.length > 0 && this.props.currentSection[0].componentType === 3 && this.props.currentSection[0].isBegin) {
            // 현재 SOP가 시작되지 않았을 때 Disable
            btnNextClassName = 'btnDisable';
        }
        else if (this.props.sectionData.status === SectionData.Status_Done) {
            // 현재 임무가 완료된 상태라면 Disable
            btnNextClassName = 'btnDisable';
        }

        // 권한 (사용자 등급은 실행 권한 없음)
        const userAuth = ProjectResource.getUserInfo();
        if (!userAuth || userAuth === null || userAuth.levelID === AccountResource.accountLevelID.user) {
            btnNextClassName = uis.btnDisable;
        }

        const [bNextStep, strNextStep] = this.haveNextStep();
        const nActionStepIndex = this.getActionStepIndex(); // 1:관심, 2:주의, 3:경계, 4:심각
        let elevateBtn = ''; // 격상단계 색상 스타일
        if (nActionStepIndex === 1) {
            elevateBtn = 'elevationBtn2';
        } else if (nActionStepIndex === 2) {
            elevateBtn = 'elevationBtn3';
        } else if (nActionStepIndex === 3) {
            elevateBtn = 'elevationBtn4';
        }

        const title = i18nUtil.convertText(this.props.sectionData.text);
        return (
            <EndPointSectionBox className={'sectionBox' + boxClassName} id={this.props.id}>
                <div className={'tit sectionBoxStart' + textClassName}>
                    <strong>{this.props.sectionData.sectionNumber}.{title}</strong>
                    <div className={'btnArea btnArea'}>
                        <a className={btnNextClassName} onClick={this.runSection} title={title}>{title}</a>
                        {
                            bNextStep && <a onClick={this.onNextStep} className={elevateBtn}>{strNextStep} {i18n.t('sopSimulator.formText.격상')}</a>
                        }
                    </div>
                </div>
            </EndPointSectionBox>
        );
    }
}

export default withTranslation()(EndPoint);