import styled from 'styled-components';
import PR from "../../Root/resource/id";
import ProjectResource from '../../Root/resource/id';
import '../../Common/css/commonSB.scss';

import btnArrowUp_normal from '../../Common/img/chart/btnArrowUp_normal.png'
import btnArrowUp_dark from '../../Common/img/chart/btnArrowUp_dark.png'
import btnArrowDown_normal from '../../Common/img/chart/btnArrowDown_normal.png'
import btnArrowDown_dark from '../../Common/img/chart/btnArrowDown_dark.png'
import btnArrowLeft_normal from '../../Common/img/chart/btnArrowLeft_normal.png'
import btnArrowLeft_dark from '../../Common/img/chart/btnArrowLeft_dark.png'
import btnArrowRight_normal from '../../Common/img/chart/btnArrowRight_normal.png'
import btnArrowRight_dark from '../../Common/img/chart/btnArrowRight_dark.png'
import check_component from '../../Common/img/section/check_component.png'
import check_component_wonik from '../../Common/img/section/check_component_wonik.png'
import check_component_hydrogen from '../../Common/img/section/check_component_hydrogen.png'


/**********************************************************************/


export const ArrowButtonComponent = styled.div`
    /* Section Componnet위의 화살표 버튼 */
    .btnArrowTop {
        position: absolute;
        width: 20px;
        height: 12px;
        top: -20px;
        background-image: url(${btnArrowUp_normal});
        background-size: 20px 12px;
        opacity: 0;
        z-index: 1;
    }

    .decisionArrowBox .btnArrowTop,
    .annotationArrowBox .btnArrowTop,
    .internalArrowBox .btnArrowTop {
        top: -15px;
    }

    .btnArrowTop:hover {
        background-image: url(${btnArrowUp_dark});
    }

    .btnArrowBottom {
        position: absolute;
        width: 20px;
        height: 12px;
        bottom: -20px;
        background-image: url(${btnArrowDown_normal});
        background-size: 20px 12px;
        opacity: 0;
        z-index: 1;
    }

    .decisionArrowBox .btnArrowBottom,
    .annotationArrowBox .btnArrowBottom,
    .internalArrowBox .btnArrowBottom {
        bottom: -15px;
    }

    .btnArrowBottom:hover {
        background-image: url(${btnArrowDown_dark});
    }

    .btnArrowLeft {
        position: absolute;
        width: 12px;
        height: 20px;
        left: -20px;
        background-image: url(${btnArrowLeft_normal});
        background-size: 12px 20px;
        opacity: 0;
        z-index: 1;
    }

    .decisionArrowBox .btnArrowLeft,
    .annotationArrowBox .btnArrowLeft,
    .internalArrowBox .btnArrowLeft {
        left: -15px;
    }

    .btnArrowLeft:hover {
        background-image: url(${btnArrowLeft_dark});
    }

    .btnArrowRight {
        position: absolute;
        width: 12px;
        height: 20px;
        right: -20px;
        background-image: url(${btnArrowRight_normal});
        background-size: 12px 20px;
        opacity: 0;
        z-index: 1;
    }

    .decisionArrowBox .btnArrowRight,
    .annotationArrowBox .btnArrowRight,
    .internalArrowBox .btnArrowRight {
        right: -15px;
    }

    .btnArrowRight:hover {
        background-image: url(${btnArrowRight_dark});
    }
`


/**********************************************************************/

export const SvgComponent = styled.svg`
    .svgPolyline {
        fill: none;
        stroke-width: 2;
        stroke: blueviolet;
    }
`;


/**********************************************************************/
// sectionGrid.jsx

export const _SectionGridComponent = {
    soulbrain: {
        sectionComponentProcessRoundLineHeight: '72px',
        sectionComponentInternalLineHeight: '72px',
        sectionMarkLineHeight: '27px',
        sectionComponentEndPointLineHeight: '72px',
        runComponentBackground: `var(--colorRunComponentFill)`,
        runComponentBorder: `var(--sizeBorderLine) solid var(--colorRunComponentBorder)`,
        doneComponentBackground: `var(--colorDoneComponentFill)`,
        doneComponentBorder: `var(--sizeBorderLine) solid var(--colorDoneComponentBorder)`,
        skipComponentBackground: `var(--colorDoneComponentFill)`,
        skipComponentBorder: `var(--sizeBorderLine) solid var(--colorCurrentSectionBorder)`,
        decisionOuterBackground: `var(--colorCurrentSectionBorder)`,
        internalOuterCurrentBackground: `var(--colorRunComponentBorder)`,
        checkComponent: `url(${check_component}) 50% 50% no-repeat`,
        checkComponentSize: '40px',
        internalOuterDoneBorder: `var(--colorDoneComponentBorder)`,
    },
    Wonik: {
        sectionComponentProcessRoundLineHeight: '72px',
        sectionComponentInternalLineHeight: '72px',
        sectionMarkLineHeight: '27px',
        sectionComponentEndPointLineHeight: '72px',
        runComponentBackground: `#5398FF`,
        runComponentBorder: `var(--sizeBorderLine) solid #5398FF`,
        doneComponentBackground: `#4D5967`,
        doneComponentBorder: `var(--sizeBorderLine) solid #4D5967`,
        skipComponentBackground: `#4D5967`,
        skipComponentBorder: `var(--sizeBorderLine) solid #5398FF`,
        decisionOuterBackground: `#5398FF`,
        internalOuterCurrentBackground: `#5398FF`,
        checkComponent: `url(${check_component_wonik}) 50% 50% no-repeat`,
        checkComponentSize: '30px',
        internalOuterDoneBorder: `var(--colorDoneComponentBorder)`,
    },
    Hydrogen: {
        sectionComponentProcessRoundLineHeight: '20px',
        sectionComponentInternalLineHeight: '20px',
        sectionMarkLineHeight: '27px',
        sectionComponentEndPointLineHeight: '20px',
        sectionComponentDecisionLineHeight: '20px !important',
        sectionComponentDecisionPadding: '40px',
        sectionComponentEndPointPadding: '20px',
        runComponentBackground: `#0085FF`,
        runComponentBorder: `var(--sizeBorderLine) solid #0085FF`,
        doneComponentBackground: `#000F15`,
        doneComponentBorder: `var(--sizeBorderLine) solid #000F15`,
        skipComponentBackground: `#000F15`,
        skipComponentBorder: `var(--sizeBorderLine) solid #0085FF`,
        decisionOuterBackground: `#0085FF`,
        internalOuterCurrentBackground: `#0085FF`,
        checkComponent: `url(${check_component_hydrogen}) 50% 50% no-repeat`,
        checkComponentSize: '28px',
        internalOuterDoneBorder: `#000F15`,
    },
    Gyeonggi: {
        sectionComponentProcessRoundLineHeight: '72px',
        sectionComponentInternalLineHeight: '72px',
        sectionMarkLineHeight: '27px',
        sectionComponentEndPointLineHeight: '72px',
        runComponentBackground: `#5398FF`,
        runComponentBorder: `var(--sizeBorderLine) solid #5398FF`,
        doneComponentBackground: `#4D5967`,
        doneComponentBorder: `var(--sizeBorderLine) solid #4D5967`,
        skipComponentBackground: `#4D5967`,
        skipComponentBorder: `var(--sizeBorderLine) solid #5398FF`,
        decisionOuterBackground: `#5398FF`,
        internalOuterCurrentBackground: `#5398FF`,
        checkComponent: `url(${check_component_wonik}) 50% 50% no-repeat`,
        checkComponentSize: '30px',
        internalOuterDoneBorder: `var(--colorDoneComponentBorder)`,
    }
}


export const SectionGridComponent = styled.div`
    
    position: relative;
    width: var(--sizeGridInitWidth);
    height: var(--sizeGridInitHeight);
    display: flex;
    flex-wrap: nowrap;
    margin-top: 50px;
    margin-left: 50px;

    > .sectionGridColumn > .sectionGridCell:after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-right: 1px dotted #eb134b;
        border-bottom: 1px dotted #eb134b;
    }

    &.disableBorder > .sectionGridColumn > .sectionGridCell:after {
        border: 0;
    }

    .sectionGridColumn {
        width: var(--sizeCellDefaultWidth);
        height: 100%;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        flex-shrink: 0;
    }

    .sectionGridColumn {
        flex-wrap: nowrap;
    }

    .sectionGridCell {
        position: relative;
        width: 100%;
        height: var(--sizeCellDefaultHeight);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .sectionGridCell.selected {
        background-color: rgba(180, 180, 180, 0.3);
    }

    > .sectionGridColumn > .sectionGridCell {
        flex-shrink: 0;
    }

    > svg {
        width: 10000px;
        height: 10000px;
    }

    > .sectionGridColumn > .sectionGridCell:first-child {
        border-top: 0;
    }

    /* Section Component */
    .sectionComponent {
        position: relative;
        width: calc(100% - var(--sizeSectionLeftMargin) - var(--sizeSectionRightMargin));
        height: calc(100% - var(--sizeSectionTopMargin) - var(--sizeSectionBottomMargin));
        background-color: var(--colorSectionFill);
        border: var(--sizeBorderLine) solid var(--colorSectionBorder);
        box-sizing: border-box;
        /* color: var(--colorComponentFont); */
        /* color:#000000 !important; */
        text-align: center;
        font-size: 1.2em;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        /*z-index: 0.6;*/
        word-break: keep-all;
    }

    .sectionGridCell:hover .decisionArrowBox .btnArrowTop,
    .sectionGridCell:hover .decisionArrowBox .btnArrowBottom,
    .sectionGridCell:hover .decisionArrowBox .btnArrowLeft,
    .sectionGridCell:hover .decisionArrowBox .btnArrowRight,
    .sectionGridCell:hover .internalArrowBox .btnArrowTop,
    .sectionGridCell:hover .internalArrowBox .btnArrowBottom,
    .sectionGridCell:hover .internalArrowBox .btnArrowLeft,
    .sectionGridCell:hover .internalArrowBox .btnArrowRight,
    .sectionComponent:hover .btnArrowTop,
    .sectionComponent:hover .btnArrowBottom,
    .sectionComponent:hover .btnArrowLeft,
    .sectionComponent:hover .btnArrowRight,
    .internalArrowBox:hover .btnArrowTop,
    .internalArrowBox:hover .btnArrowBottom,
    .internalArrowBox:hover .btnArrowLeft,
    .internalArrowBox:hover .btnArrowRight,
    .annotationArrowBox:hover .btnArrowTop,
    .annotationArrowBox:hover .btnArrowBottom,
    .annotationArrowBox:hover .btnArrowLeft,
    .annotationArrowBox:hover .btnArrowRight,
    .decisionArrowBox:hover .btnArrowTop,
    .decisionArrowBox:hover .btnArrowBottom,
    .decisionArrowBox:hover .btnArrowLeft,
    .decisionArrowBox:hover .btnArrowRight {
        opacity: 1;
    }

    .sectionProcess {
        width: calc(100% - var(--sizeSectionLeftMargin) - var(--sizeSectionRightMargin));
        height: calc(100% - var(--sizeSectionTopMargin) - var(--sizeSectionBottomMargin));
    }

    .sectionComponent.process.round {
        width: 100%;
        height: 100%;
        border-radius: var(--sizeBorderRoundEdge);
        /* line-height: 72px; */
        line-height: ${_SectionGridComponent[PR.styleMode].sectionComponentProcessRoundLineHeight};
    } 
    
    .sectionInternal {
        position: relative;
        width: calc(100% - var(--sizeSectionLeftMargin) - var(--sizeSectionRightMargin));
        height: calc(100% - var(--sizeSectionTopMargin) - var(--sizeSectionBottomMargin));
    }
    
    .sectionMarkArea {
        position: relative;
        display: flex;
        width: 100%;
        height: 30px;
    }

    .sectionMarkArea.process {
        margin-top: -30px;
    }

    .sectionMark {
        position: relative;
        border-radius: 50%;
        border: 2px solid black;
        /* width: 30px;
           height: 30px; */
        min-width: ${_SectionGridComponent[PR.styleMode].checkComponentSize}; 
        min-height: 30px;
        text-align: center;
        /* line-height: 27px; */
        line-height: ${_SectionGridComponent[PR.styleMode].sectionMarkLineHeight}; 
        font-size: 11px;
        font-weight: bold;
        z-index: 2;
    }

    .markBoardCast{
        display: block;
    }

    .sectionMark.broad {
        border: 1px solid #e91915;
        background-color: #e91915;

        color: #fff;
        /* padding-top: 3px; */
        padding: 0px 4px;
    }

    .sectionMark.broad.internal {
        left: -12px;
        top: -5px;
    }

    .sectionMark.sms {
        border: 1px solid #ffa500;
        background-color: #ffa500;
    }

    .sectionMark.sms.internal {
        left: -12px;
        top: -5px;
    }

    .sectionMark.email {
        border: 1px solid #5eba7d;
        background-color: #5eba7d;
    }

    .sectionMark.email.internal {
        left: -12px;
        top: -5px;
    }

    .sectionMark.auto {
        border: 1px solid #0073d4;
        background-color: #0073d4;
        color: white;
        display: inline-block;
    }

    .sectionMark.auto.internal {
        left: -12px;
        bottom: 55px;
    }

    .sectionMark.auto.process {
        left: -12px;
        bottom: 18px;
    }

    .sectionMark.internal.checkComponent {
        position: absolute;
        float: right;
        right: -12px;
        top: -5px;
        border: none;
        background: ${_SectionGridComponent[PR.styleMode].checkComponent}; 
        background-size: ${_SectionGridComponent[PR.styleMode].checkComponentSize}; 
    }

    .sectionMark.process.checkComponent {
        position: absolute;
        float: right;
        right: -12px;
        top: 20px;
        border: none;
        background: ${_SectionGridComponent[PR.styleMode].checkComponent}; 
        background-size: ${_SectionGridComponent[PR.styleMode].checkComponentSize}; 
    }

    .internalArrowBox {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        top: -30px;
        z-index: 1;
    }
    
    .internalOuter {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: var(--colorSectionBorder);
        clip-path: polygon(0 8px, 0 calc(100% - 8px), 100% 100%, 100% 0);
        z-index: 1;
    }

    .internalOuter.selected,
    .internalOuter.runBorder.selected,
    .internalOuter.doneBorder.selected {
        background-color: var(--colorSelectedSectionBorder);
    }

    .internalOuter.current {
        background-color: ${_SectionGridComponent[PR.styleMode].internalOuterCurrentBackground};
    }

    .sectionComponent.internal {
        position: absolute;
        margin-bottom: 0px;
        top: 0;
        width: 100%;
        height: 100%;
        clip-path: polygon(0 12px, 0 calc(100% - 12px), 100% calc(100% - 5px), 100% 5px);
        /* line-height: 72px; */
        line-height:  ${_SectionGridComponent[PR.styleMode].sectionComponentInternalLineHeight};
    }

    .sectionComponent.internal.selected {
        border: var(--sizeBorderLine) solid var(--colorSelectedSectionBorder);
        /*background-color: var(--colorSelectedSectionFill);*/
    }
/* 
    .sectionComponent.internal.current {
        border: var(--sizeBorderLine) solid var(--colorRunComponentBorder);
    } */

    .annotationArrowBox {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: calc(100% - var(--sizeSectionLeftMargin) - var(--sizeSectionRightMargin));
        height: calc(100% - var(--sizeSectionTopMargin) - var(--sizeSectionBottomMargin));
    }
    
    .sectionComponent.annotation {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: var(--colorSectionBorder);
        clip-path: polygon(0 0, 0 100%, 100% 100%, 100% 30px, calc(100% - 27px) 0);
    }

    .sectionComponent.annotation.selected,
    .sectionComponent.annotation.runAnnoBorder.selected {
        background-color: var(--colorSelectedSectionBorder);
    }

    .sectionComponent.annotation.selected .inner,
    .sectionComponent.annotation .inner {
        width: 100%;
        height: 100%;
        background-color: var(--colorSectionFill);
        clip-path: polygon(0 0, 0 100%, 100% 100%, 100% 27px, calc(100% - 25px) 0);
    }

    .sectionComponent.annotation.selected .edge,
    .sectionComponent.annotation .edge {
        width: 25px;
        height: 27px;
        position: absolute;
        top: 0px;
        right: 0px;
        border-left: var(--sizeBorderLine) solid var(--colorSectionBorder);
        border-bottom: var(--sizeBorderLine) solid var(--colorSectionBorder);
    }

    .sectionComponent.endpoint {
        border-radius: 50px;
        /* line-height: 72px; */
        line-height: ${_SectionGridComponent[PR.styleMode].sectionComponentEndPointLineHeight};
        padding:${_SectionGridComponent[PR.styleMode].sectionComponentEndPointPadding};
    }
    
    .decisionArrowBox {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: calc(100% - var(--sizeSectionLeftMargin) - var(--sizeSectionRightMargin));
        height: calc(100% - var(--sizeSectionTopMargin));
        z-index: 1;
    }
    
    .decisionOuter {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: var(--colorSectionBorder);
        clip-path: polygon(50% 0, 0 50%, 50% 100%, 100% 50%);
        z-index: 1;
    }
    
    .decisionOuter.selected,
    .decisionOuter.runBorder.selected,
    .decisionOuter.doneBorder.selected {
        background-color: var(--colorSelectedSectionBorder);
    }

    .decisionOuter.exec {
        background-color: ${_SectionGridComponent[PR.styleMode].decisionOuterBackground};
    }

    .sectionComponent.decision {
        width: 100%;
        height: 100%;
        margin-bottom: 0;
        z-index: 1;
        line-height: ${_SectionGridComponent[PR.styleMode].sectionComponentDecisionLineHeight};
        padding: ${_SectionGridComponent[PR.styleMode].sectionComponentDecisionPadding};
    }
    
    .decisionInner {
        position: absolute;
        margin: auto;
        font-size: 1.5em;
    }

    .sectionGridFix .sectionGridRow {
        position: absolute;
        top: 50px;
        left: 0;
        width: 50px;
        height: var(--sizeGridInitHeight);
    }

    .sectionGridFix .sectionGridColumn {
        position: absolute;
        top: 0;
        left: 50px;
        width: 300px;
        height: 50px;
    }

    .sectionGridFix > .sectionGridRow > .sectionGridCell, 
    .sectionGridFix > .sectionGridColumn > .sectionGridCell {
        background: #efefef;
    }


    .sectionGridFix > .sectionGridRow > .sectionGridCell.selected {
        background: #d8d8d8;
    }


    .sectionGridFix > .sectionGridColumn > .sectionGridCell.selected {
        background: #d8d8d8;
    }


    .sectionGridFix > .sectionGridRow > .sectionGridCell {
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
    }

    .sectionGridFix > .sectionGridColumn > .sectionGridCell {
        border-top: 1px solid #ccc;
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        display: flex;
    }

    .sectionGridFix > .sectionGridRow > .sectionGridCell:first-child {
        border-top: 1px solid #ccc;
    }

    .sectionGridFix > .sectionGridColumn > .sectionGridCell:first-child {
        border-left: 1px solid #ccc;
    }

    #selectedComponent {
        border: var(--sizeBorderLine) solid var(--colorSelectedSectionBorder);
    }
    
    /* #currentComponent {
        border: var(--sizeBorderLine) solid var(--colorCurrentSectionBorder);
    } */
    
    .runComponent {
        background-color: ${_SectionGridComponent[PR.styleMode].runComponentBackground};
        border: ${_SectionGridComponent[PR.styleMode].runComponentBorder};
        color: var(--colorRunComponentFont);
    }
    
    .doneComponent {
        background-color: ${_SectionGridComponent[PR.styleMode].doneComponentBackground};
        border: ${_SectionGridComponent[PR.styleMode].doneComponentBorder};
        color: var(--colorDoneComponentFont);
    }
    
    .waitComponent {
        background-color: var(--colorWaitComponentFill);
        border: var(--sizeBorderLine) solid var(--colorWaitComponentBorder);
        color: var(--colorWaitComponentFont);
    }

    .skipComponent {
        background-color: ${_SectionGridComponent[PR.styleMode].skipComponentBackground};
        border: ${_SectionGridComponent[PR.styleMode].skipComponentBorder};
        color: var(--colorDoneComponentFont);
    }
    
    
    /* decision 컴포넌트 */
    .decisionOuter.runBorder {
        background-color: var(--colorRunComponentBorder);
    }
    
    .decisionOuter.doneBorder {
        background-color: var(--colorDoneComponentBorder);
    }
    
    .decisionOuter.waitBorder {
        background-color: var(--colorWaitComponentBorder);
    }
    
    /*.decision.selected,*/
    .decision.selected.runComponent,
    .decision.selected.doneComponent {
        background-color: var(--colorSelectedSectionFill);
    }
    
    /* internal 컴포넌트 */
    .internalOuter.runBorder {
        background-color: var(--colorRunComponentBorder);
    }
    
    .internalOuter.current.runBorder {
        background-color: var(--colorCurrentSectionBorder);
    }
    
    .internalOuter.doneBorder {
        background-color: ${_SectionGridComponent[PR.styleMode].internalOuterDoneBorder};
    }
    
    .internalOuter.waitBorder {
        background-color: var(--colorWaitComponentBorder);
    }

    .internalOuter.exec {
        background-color: ${_SectionGridComponent[PR.styleMode].decisionOuterBackground};
    }
    
    /* annotation 컴포넌트 */
    .sectionComponent.annotation.selected .inner.selected.waitAnnoFill,
    .sectionComponent.annotation .inner.selected.waitAnnoFill,
    .sectionComponent.annotation .inner.waitAnnoFill {
        background-color: var(--colorWaitComponentFill);
        color: var(--colorWaitComponentFont);
    }
    
    .sectionComponent.annotation.selected .inner.runAnnoFill,
    .sectionComponent.annotation .inner.runAnnoFill {
        background-color: var(--colorRunComponentFill);
    }
    
    .sectionComponent.annotation.selected .inner.doneAnnoFill,
    .sectionComponent.annotation .inner.doneAnnoFill {
        background-color: var(--colorDoneComponentFill);
    }
    
    .sectionComponent.annotation.runAnnoBorder {
        border: var(--sizeBorderLine) solid var(--colorRunComponentBorder);
        background-color: var(--colorRunComponentBorder);
    }
    
    .sectionComponent.annotation.waitAnnoBorder {
        border: var(--sizeBorderLine) solid var(--colorWaitComponentBorder);
        background-color: var(--colorWaitComponentBorder);
    }
    
    .sectionComponent.annotation.runAnnoBorder .edge {
        width: 25px;
        height: 27px;
        position: absolute;
        top: 0px;
        right: 0px;
        border-left: var(--sizeBorderLine) solid var(--colorRunComponentBorder);
        border-bottom: var(--sizeBorderLine) solid var(--colorRunComponentBorder);
    }
    
    .sectionComponent.annotation.waitAnnoBorder .edge {
        width: 25px;
        height: 27px;
        position: absolute;
        top: 0px;
        right: 0px;
        border-left: var(--sizeBorderLine) solid var(--colorWaitComponentBorder);
        border-bottom: var(--sizeBorderLine) solid var(--colorWaitComponentBorder);
    }
    
    .sectionComponent.annotation.doneAnnoBorder {
        border: var(--sizeBorderLine) solid var(--colorDoneComponentBorder);
        background-color: var(--colorDoneComponentBorder);
    }

    .sectionComponent.annotation.doneAnnoBorder .edge {
        width: 25px;
        height: 27px;
        position: absolute;
        top: 0px;
        right: 0px;
        border-left: var(--sizeBorderLine) solid var(--colorDoneComponentBorder);
        border-bottom: var(--sizeBorderLine) solid var(--colorDoneComponentBorder);
    }

    .arrowText {
        fill: #F7F7F7;
    }
    
    .noDrag {
        -ms-user-select: none;
        -moz-user-select: -moz-none;
        -webkit-user-select: none;
        user-select: none;
    }
    
    .svgPolyline {
        fill: none;
        stroke-width: 2;
        stroke: blueviolet;
    }
    
    .defaultGrid {
        margin-top: 50px;
        margin-left: 50px;
        width: 100%;
        height: 100%;
        /* z-index: 101; */
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    
    .defaultGridArea {
        width: 60%;
        height: 60%;
        background-color: gray;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border: 3px dashed black;
    }
    
    .defaultButtonAreaV {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: center;
    }
    
    .defaultButtonAreaH {
        width: 350px;
        height: 100%;
        display: flex;
        justify-content: space-between;
    }

    .defaultButtonAreaH button {
        width: 100px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #fff;
        background: #3764BA;
        border-radius: 4px;
    }
`;



/**********************************************************************/
// sectionGridColumn.jsx

export const SectionGridColumnComponent = styled.div`

`


/**********************************************************************/
// sectionGridCell.jsx

export const SectionGridCellComponent = styled.div`

`


/**********************************************************************/
// endpoint.jsx

export const EndPointComponent = styled.div`
    position: relative;
    width: calc(
        100% - var(--sizeSectionLeftMargin) - var(--sizeSectionRightMargin)
    );
    height: calc(
        100% - var(--sizeSectionTopMargin) - var(--sizeSectionBottomMargin)
    );
    background-color: var(--colorSectionFill);
    border: var(--sizeBorderLine) solid var(--colorSectionBorder);
    box-sizing: border-box;
    text-align: center;
    font-size: 1.2em;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: 50px;
    line-height: 72px;

    &:hover .btnArrowTop,
    &:hover .btnArrowBottom,
    &:hover .btnArrowLeft,
    &:hover .btnArrowRight {
        opacity: 1;
    }
`;







