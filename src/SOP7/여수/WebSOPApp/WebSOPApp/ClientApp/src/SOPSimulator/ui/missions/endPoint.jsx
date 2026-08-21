import React, { Component } from 'react';

import SopSimulatorResource from "../../resource/id";
/*import styles from '../../../Common/css/style.module.css';*/
import uis from '../../../Common/css/ui.module.css';
import uneStyles from '../../../Common/css/uneCommon.module.css';
import SectionData from '../../../Common/models/sections/sectionData';
import BeginOption from '../popup/beginOption';
import SopManagerResource from '../../../SOPManager/resource/id';

import { EndSectionBox } from '../../styled/MissionListStyled';


class EndPoint extends Component {
    constructor(props) {
        super(props);

        this.state = {
            prevProps: props,
            isBegined: false,
            isBegin: this.props.isBegin,
        }

        this.props = props;

        this.runSection = this.runSection.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.content !== prevProps.content) {

            const content = this.props.content;

            console.log(content);

            if (this.props.content === SopSimulatorResource.ID.menu.beginSOPOption) {
                this.setState({ isBegined: true });
            } else {
                this.setState({ isBegined: false });
            }
        }

    }

    async runSection() {        
        await this.props.runSection(this.props.sectionData);
    }

    getBeginOption = () => {

        let result = [];

        if (this.state.isBegined) {
            const sopData = this.props.sopDatas[this.props.sopTabIndex].sopData;
            const title = sopData.disasterCategory.categoryName + ' → ' + sopData.subDisasterCategory.subCategoryName + ' → ' + sopData.disaster.disasterName + ' → ' + sopData.currentActionStep.stepName;

            const beginOption = <BeginOption beginSOP={this.props.beginSOP} title={title} />;

            result.push(beginOption);

            return result;
        } else {
            return result;
        }
    }

    render() {
        let boxClassName = "";
        let textClassName = " " + 'textNormal';

        let bAmICurrentSection = false; // 자신이 현재 세션인지 여부
        const currentSectionCount = this.props.currentSection?.length;
        for (let i = 0; i < currentSectionCount; i++) {
            const currentSection = this.props.currentSection[i];
            if (currentSection.id === this.props.sectionData.id && currentSection.componentType === this.props.sectionData.componentType) {
                bAmICurrentSection = true;
            }
        }

        if (bAmICurrentSection) {
            boxClassName = " " + 'sectionCurrent currentBox';
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
        // TODO: 테스트를 위한
        //if (!this.props.sectionData.isBegin &&
        //    this.props.currentSection.componentType === 3 && this.props.currentSection.isBegin) {
        if (!this.props.sectionData.isBegin &&
            this.props.currentSection?.length > 0 && this.props.currentSection[0].componentType === 3 && this.props.currentSection[0].isBegin) {
            // 현재 SOP가 시작되지 않았을 때 Disable
            btnNextClassName = 'btnDisable';
        }
        else if (this.props.sectionData.status === SectionData.Status_Done) {
            // 현재 임무가 완료된 상태라면 Disable
            btnNextClassName = 'btnDisable';
        }


        let [beginOption] = [];
        let [endOption] = [];

        if (this.state.isBegin) {
            [beginOption] = this.getBeginOption(); // 시작옵션 모듈
        } else {
            [endOption] = []; // 결과요약 모듈
        }
        

        return (
                <EndSectionBox className={'sectionBox' + boxClassName} id={this.props.id}>
                  <div className={'tit clfix sectionBoxStart' + textClassName}>
                    <span>{this.props.sectionData.sectionNumber}.{this.props.sectionData.text}</span>
                    <div className={'btnArea btnArea'}>
                       <a className={btnNextClassName} onClick={this.runSection} title={this.props.sectionData.text}>{this.props.sectionData.text}</a>
                    </div>

                    {/*{this.state.isBegined &&*/}
                    {/*    <div style={{ height: '150px' }}>*/}
                    {/*        {beginOption}*/}
                    {/*    </div>*/}
                    {/*}*/}

                    <div className={'completionStatus'}></div>
                  </div>

                   {this.state.isBegined &&
                            beginOption
                    }

                {/* <BeginOption beginSOP={this.props.beginSOP}/> */}
                </EndSectionBox>
        );
    }
}

export default EndPoint;