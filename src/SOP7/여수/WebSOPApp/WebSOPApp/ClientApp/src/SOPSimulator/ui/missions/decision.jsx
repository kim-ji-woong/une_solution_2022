import React, { Component } from 'react';
import styles from '../../../Common/css/style.module.css';
import uis from '../../../Common/css/ui.module.css';
import uneStyles from '../../../Common/css/uneCommon.module.css';
import $ from 'jquery';
import SectionData from '../../../Common/models/sections/sectionData';

import { DecisionSectionBox } from '../../styled/MissionListStyled';

class Decision extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sopData: null,
            returnValue: '',
            arrowValues: [],
            prevProps: props
        }

        this.props = props;

        this.runSection = this.runSection.bind(this);
    }

    runSection() {
        this.props.runSection(this.props.sectionData, this.state.returnValue);
    }

    onChangeValue = (e) => {
        let arrowValue = null;
        for (var i = 0; i < this.state.arrowValues.length; i++) {
            if (this.state.arrowValues[i].arrowID.toString() === e.target.value) {
                arrowValue = this.state.arrowValues[i];
                break;
            }
        }

        if (arrowValue === null || arrowValue === this.state.returnValue)
            return;

        this.setState({ returnValue: arrowValue });
    }

    componentDidMount() {

        $('html, body').css({ 'display': 'block', 'height': '100%', 'overflow': 'hidden', 'color': '#fff' });

        // Selete Box UI
        $('.seleteBox').on('click', '.' + '.seletedTxt', function () {
            $(this).closest('.seleteBox').toggleClass('isShow');
        }).on('click', '.' + "value" , function () {
                var value = $(this).closest('li').data('val');
                $(this).closest('.seleteBox').toggleClass('isShow');
                $(this).closest('.seleteBox').removeClass('.step01', '.step02', '.step03', '.step04').addClass(value);
                $(this).closest('.seleteBox').find('.seletedTxt').text($(this).text());
        });

        const arrowValues = this.getArrowValue();
        if (arrowValues && arrowValues.length > 0) {
            this.setState({ arrowValues, returnValue: arrowValues[0] });
        }
    }

    getArrowValue() {
        if (!this.props.arrows || this.props.arrows.length === 0) {
            return null;
        }

        let values = [];

        const length = this.props.arrows.length;
        for (let i = 0; i < length; i++) {
            const arrow = this.props.arrows[i];

            if (!this.props.arrows[i].beginCell) {
                continue;
            }

            if (this.props.sectionData.gridColumnIndex.toString() === this.props.arrows[i].beginCell.parentElement.dataset.index &&
                this.props.sectionData.gridRowIndex.toString() === this.props.arrows[i].beginCell.dataset.index) {
                const arrowValue = {
                    arrowID: arrow.id,
                    arrowText: arrow.text
                }

                values.push(arrowValue);
            }
        }

        return values;
    }

    getArrowText() {
        if (!this.state.arrowValues || this.state.arrowValues.length === 0) {
            return null;
        }

        let ui = [];

        const length = this.state.arrowValues.length;
        for (let i = 0; i < length; i++) {
            const arrow = this.state.arrowValues[i];
            ui.push(<option value={arrow.arrowID}>{arrow.arrowText}</option>);
        }

        return ui;
    }

    render() {
        const arrowTexts = this.getArrowText();

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
        if (!this.props.sectionData.sectionNumber) {
            // sectionNumber가 null일 때
            btnNextClassName = 'btnDisable';
        }
        else if (this.props.currentSection?.length > 0 && this.props.currentSection[0].componentType === 3 && this.props.currentSection[0].isBegin) {
            // 현재 SOP가 시작되지 않았을 때 Disable
            btnNextClassName = 'btnDisable';
        }
        else if (this.props.sectionData.status === SectionData.Status_Done) {
            // 현재 임무가 완료된 상태라면 Disable
            btnNextClassName = 'btnDisable';
        }

        var returnText = this.state.returnValue;

        return (
            <DecisionSectionBox className={'sectionBox' + boxClassName} id={this.props.id}>
                <div className={'tit clfix hasFire' + textClassName}>    
                    <strong>{this.props.sectionData.sectionNumber}.{this.props.sectionData.text}</strong>
                    {
                        /*
                        <div className={uis.seleteBox} onClick={this.onChangeValue}>
                            <button type="button" className={uis.seletedTxt}>{returnText}</button>
                            <ul>
                                <li data-val="yes"><button type="button" className="value">Yes</button></li>
                                <li data-val="no"><button type="button" className="value">No</button></li>
                            </ul>
                        </div>
                        */
                    }

                    <select className={'choiceBox'} name="" id="" onChange={(e) => this.onChangeValue(e)} >
                        {arrowTexts}
                    </select>
                    <div className={'btnArea btnArea'}>
                        <a className={btnNextClassName} onClick={this.runSection}>다음</a>
                        {/*<a>전체완료</a>*/}
                    </div>
                </div>
            </DecisionSectionBox>
        );
    }
}

export default Decision;