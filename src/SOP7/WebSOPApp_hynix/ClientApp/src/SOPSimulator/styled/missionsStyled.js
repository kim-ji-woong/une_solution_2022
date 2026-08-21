import styled from 'styled-components';
import PR from '../../Root/resource/id';
import '../../Common/css/commonSB.scss';

import iconCheck from '../../Common/image/icon/icon-check.png'
import propagatePeople from '../../Common/image/icon/peoples.png'
import propagatePeopleHover from '../../Common/image/icon/peoples_hover.png'
import propagatePeopleHoverWonik from '../../Common/image/icon/peoples_hover_wonik.png'
import propagatePeopleHoverHydrogen from '../../Common/image/icon/peoples_hover_hydrogen.png'
import message from '../../Common/image/icon/message.png'
import email from '../../Common/image/icon/Email.png'
import selectArrow from '../../Common/img/common/select_arrow.png'
import micOn from '../../Common/image/icon/mic_on.png'
import micOff from '../../Common/image/icon/mic_off.png'
import micOn2 from '../../Common/image/icon/mic_on__.png'
import volumeOn from '../../Common/image/icon/volume_on.png'
import volumeOn2 from '../../Common/image/icon/volume_on__.png'
import volumeOff from '../../Common/image/icon/volume_off.png'
import volumeOff2 from '../../Common/image/icon/volume_off_.png'


/**********************************************************************/


export const _SectionBox = {
    soulbrain: {
        btnAllCheckBackground: '#0475d3',
        btnAllCheckHoverBackground: '#012c93',
        btnAllCheckBorder: '2px solid #fff',
        btnAllCheckLineHeight: '15px',
        btnAllCheckColor: '#fff',
        sectionBoxFlagWidth: '50px',
        sectionBoxFlagPadding: '2px 0',
        completionStatussWidth: '50px',
        btnDisablePadding: '5px 0 0 5px',
        btnAreaAPadding: '6px 0',
        propagatePeopleHover: `url(${propagatePeopleHover})`,
    },
    Wonik: {
        btnAllCheckBackground: '#1E2633',
        btnAllCheckHoverBackground: '#1E2633',
        btnAllCheckBorder: '1px solid #5398FF',
        btnAllCheckLineHeight: '19px',
        btnAllCheckColor: '#5398FF',
        sectionBoxFlagWidth: '50px',
        sectionBoxFlagPadding: '2px 0',
        completionStatussWidth: '50px',
        btnDisablePadding: '5px 0 0 5px',
        btnAreaAPadding: '6px 0',
        propagatePeopleHover: `url(${propagatePeopleHoverWonik})`,
    },
    Hydrogen: {
        btnAllCheckBackground: '#1E2633',
        btnAllCheckHoverBackground: '#1E2633',
        btnAllCheckBorder: '1px solid #00AFFF',
        btnAllCheckLineHeight: '19px',
        btnAllCheckColor: '#00AFFF',
        sectionBoxFlagWidth: 'auto',
        sectionBoxFlagPadding: '2px 10px',
        completionStatussWidth: '50px',
        sectionBoxTitStrongPaddingRight: '90px',
        btnAreaAPadding: '6px',
        propagatePeopleHover: `url(${propagatePeopleHoverHydrogen})`,
    },
    Gyeonggi: {
        btnAllCheckBackground: '#1E2633',
        btnAllCheckHoverBackground: '#1E2633',
        btnAllCheckBorder: '1px solid #5398FF',
        btnAllCheckLineHeight: '19px',
        btnAllCheckColor: '#5398FF',
        sectionBoxFlagWidth: '50px',
        sectionBoxFlagPadding: '2px 0',
        completionStatussWidth: '50px',
        btnDisablePadding: '5px 0 0 5px',
        btnAreaAPadding: '6px 0',
        propagatePeopleHover: `url(${propagatePeopleHoverWonik})`,
    }
}

export const SectionBox = styled.div`
    + .sectionBox{
        margin-top:20px; 
        border-radius:5px;
        /* border:solid 1px #060817; */
    }

    .hasFire strong{
        width:calc(100% - 280px);
    }

    .tit.textNormal strong {
        color: var(--colorTextNormal);
    }

    .tit.textCurrent strong {
        color: var(--colorTextCurrent);
    }

    .tit.textRun strong {
        color: var(--colorTextRun);
    }

    .tit.textDone strong {
        color: var(--colorTextDone);
    }


    > .tit{ 
        position:relative; 
        padding:10px 20px; 
        background-color:#1e2633;
        border-radius:3px; 
    }

    .tit:after{
        ${props => props.theme.variables.clearfix()};
    }

    .tit strong {
        float: left;
        position: relative;
        width: calc(100% - 180px);
        font-size: 20px;
        line-height: 30px;
        font-weight: 500;
        /* padding-right: 90px; */
        padding-right: ${_SectionBox[PR.styleMode].sectionBoxTitStrongPaddingRight};
    }

    .tit.cRed strong {
        color: #e7525a;
    }

    .tit.cBlue strong {
        color: #4d55e3;
    }

    .tit.cGray strong {
        color: #9596ad;
    }

    .tit.cWhite strong {
        color: #ffffff;
    }

    .tit.cGreen strong {
        color: #18ee9e;
    }

    .tit .flag {
        display: inline-block;
        /* width: 50px; */
        width: ${_SectionBox[PR.styleMode].sectionBoxFlagWidth};
        height: 20px;
        margin-top: 5px;
        margin-left: 10px;
        /* padding: 2px 0; */
        padding: ${_SectionBox[PR.styleMode].sectionBoxFlagPadding};
        font-size: 14px;
        font-weight: 400;
        line-height: 1;
        letter-spacing: -0.05em;
        color: #fff;
        border-radius: 10px;
        text-align: center;
        vertical-align: top;
    }

    .tit .flagAuto {
        background-color: #0073d4;
        border: solid 1.5px #0073d4;
    }

    .tit .flagBroadcast {
        background-color: #e91915;
        border: solid 1.5px #e91915;
    }

    .tit .flagSms {
        background-color: #ffa500;
        border: solid 1.5px #ffa500;
    }

    .tit .flagMail {
        background-color: #5eba7d;
        border: solid 1.5px #5eba7d;
    }

    .tit .btnArea {
        float: right;
        text-align: center;
        font-size: 0;
        display: flex;
    }

    .tit .btnArea a {
        display: inline-block;
        width: 80px;
        height: 30px;
        /* padding: 6px 0; */
        padding: ${_SectionBox[PR.styleMode].btnAreaAPadding};
        border: 2px solid #fff;
        font-size: 14px;
        letter-spacing: -0.05em;
        border-radius: 4px;
    }

    /*활성화*/
    .tit .btnArea .btnAllCheck {
        display: inline-block;
        width: 80px;
        height: 30px;
        line-height: ${_SectionBox[PR.styleMode].btnAllCheckLineHeight};
        border: ${_SectionBox[PR.styleMode].btnAllCheckBorder};
        font-size: 14px;
        letter-spacing: -0.05em;
        background: ${_SectionBox[PR.styleMode].btnAllCheckBackground};
        border-radius: 15px;
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 16px;
        color: ${_SectionBox[PR.styleMode].btnAllCheckColor};
    }

    .tit .btnArea .btnAllCheck:hover {
        background: ${_SectionBox[PR.styleMode].btnAllCheckHoverBackground};
    }

    /*비활성화*/
    .tit .btnArea .btnDisable {
        display: inline-block;
        width: 80px;
        height: 30px;
        line-height: 16px;
        /* padding: 5px 0 0 5px; */
        padding: ${_SectionBox[PR.styleMode].btnDisablePadding};
        border: 2px solid #fff;
        font-size: 14px;
        letter-spacing: -0.05em;
        border-radius: 15px;
        opacity: 0.3;
        cursor: default;
        background: none;
        pointer-events: none;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        margin-right: 16px;
    }

    .seleteBox {
        float: left;
        width: 100px;
    }

    .seleteBox button {
        padding: 6px 10px;
    }

    .seleteBox .seletedTxttt:after {
        top: 7px;
    }

    .seleteBox.isShow .seletedTxttt:after {
        top: 13px;
    }

    .hasFire strong {
        width: calc(100% - 300px);
    }

    .taskDetail {
        counter-reset: taskDetail;
        border-radius: 3px;
    }
    .taskDetail > div {
        float: left;
        width: calc(100% - 180px);
        border: 1px solid #060817;
        border-radius: 3px;
    }
    .taskDetail > div + div {
        width: 170px;
        margin-left: 10px;
    }
    .taskDetail > dt .checkk {
        width: 30px;
        display: inline-block;
        height: 30px;
        /* margin-left: 380px; */
        position: relative;
        top: 5px;
    }
    .taskDetail > dt .taskDetailText{
        display: inline-block;
        width: 100px;
        margin-left: 40px;
    } 

    /* 0516 */
    .taskDetailBehavior {
        counter-reset: taskDetailBehavior;
        border: solid 1px #d1d1d1;
        border-radius: 3px;
    }

    @media screen and (min-width: 0px) and (max-width: 1920px) {
        .taskDetail > dt .checkk {
        width: 30px;
        display: inline-block;
        height: 30px;
        /* margin-left: calc(100% - 45%); */
        position: absolute;
        padding: 10px 10px;
        }
        .taskDetailBehavior > dt .checkk {
        width: 30px;
        display: inline-block;
        height: 30px;
        margin-left: calc(100% - 45%);
        position: absolute;
        }
        dd .check {
        height: 30px;
        padding: 5px 10px;
        /* margin-left: 89px; */
        /* margin-right: 30px; */
        }
    }

    @media screen and (min-width: 1921px) {
        .taskDetail > dt .checkk {
        width: 30px;
        display: inline-block;
        height: 30px;
        /* margin-left: calc(100% - 31%); */
        position: absolute;
        padding: 10px;
        }
        .taskDetailBehavior > dt .checkk {
        width: 30px;
        display: inline-block;
        height: 30px;
        margin-left: calc(100% - 46.5%);
        position: absolute;
        }
        dd .check {
        height: 30px;
        padding: 5px 10px;
        /* margin-left: 250px; */
        /* margin-right: 30px; */
        }
    }

    .taskDetail .action {
        color: #f8bd57;
    }

    .taskDetailBehavior .action {
        color: #f8bd57;
    }

    dt {
        padding: 10px;
        font-weight: 400;
        line-height: 30px;
        background-color: #060817;
        letter-spacing: -0.05em;
        position: relative;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    dd {
        display: flex;
        align-items: center;
        padding: 10px;
        padding-right: 0;
        font-weight: 100;
        border-bottom: 1px solid #060817;
        -webkit-flex-wrap: wrap;
        flex-wrap: wrap;
    }

    dd p {
        line-height: 30px;
        align-items: center;
        justify-content: center;
    }

    dd .tit {
        position: relative; /*flex:5;*/
        width: 65%;
        flex: 1 1;
        padding-left: 25px;
    }

    dd .tit:before {
        counter-increment: taskDetail;
        content: counters(taskDetail, ".") ". ";
        position: absolute;
        top: 0;
        left: 0;
    }

    /* 0516 test */
    .taskDetailBehavior dd .tit {
        position: relative;
        width: 50%;
        padding-left: 25px;
    }

    .taskDetailBehavior dd .tit:before {
        counter-increment: taskDetailBehavior;
        content: counters(taskDetailBehavior, ".") ". ";
        position: absolute;
        top: 0;
        left: 0;
    }

    dd .send {
        height: 30px;
        padding: 5px 10px;
    }

    dd .send button {
        vertical-align: top;
    }

    .checkBox input[type="checkbox"] {
        width: 20px;
        height: 20px;
        background-color: rgba(0, 0, 0, 0);
        border: 1px solid #fff;
        vertical-align: top;
    }

    .checkBox input[type="checkbox"]:checked {
        background: url(${iconCheck}) no-repeat center center;
        background-size: 15px auto !important;
    }

    .sendMessage {
        display: flex;
        height: 40px;
        justify-content: flex-end;
        margin-top: 5px;
        align-items: center;
        margin-right: 20px;
    }

    .sendMessage .message {
        // height: 30px;
        padding-top: 5px;
    }

    .sendMessage .wifi {
        height: 30px;
        padding: 3px 5px;
    }

    .sendMessage .send {
        height: 30px;
        padding: 0 10px;
    }

    .sendMessage .check {
        height: 30px;
        padding: 5px 20px;
        flex: 1 1;
    }

    .sendMessage + .taskDetail {
        margin-top: 8px;
    }

    .taskSubSection {
        display: flex;
    }

    .taskSub {
        word-break: keep-all;
    }

    .taskSub dd {
        height: 130px;
        padding: 15px 20px;
        line-height: 25px;
        border-bottom: 0;
        overflow-y: auto;
    }

    .taskSub .taskMessage {
        height: 130px;
        padding: 15px 20px;
        line-height: 25px;
        border-bottom: 0;
        overflow-y: auto;
        background-color: transparent;
        width: 100%;
        color: white;
        border-color: transparent;
        text-align: start;
    }

    .taskSubList dd {
        /* padding: 0 10px; */
        padding: 0;
    }

    .taskSub dd.all {
        justify-content: center;
    }

    .taskSub dd:not(.all) {
        align-items: baseline;
    }

    .taskSub ul{
        display: block;
        width: 100%;
    }

    .taskSub ul li {
        padding: 10px 10px;
        line-height: 20px;
        border-bottom: dashed 1px #ffffff96;
        font-size: 14px;
    }

    .taskSub ul li + li {
        border-top: 1px solid #162235;
    }

    .taskSub ul li input[type="checkbox"] {
        width: 16px;
        height: 16px;
        border-color: #fff;
        background: none;
        border-radius: 2px;
        float: right;
    }

    .taskSub ul li input[type="checkbox"]:checked {
        background-size: 16px auto !important;
        background: url(${iconCheck}) no-repeat center center;
    }


    .propagatePeople {
        float: right;
        position: absolute;
        background-image: url(${propagatePeople});
        background-repeat: no-repeat;
        width: 25px;
        height: 25px;
        align-items: center;
        top: -8px;
        right: 5px;
        cursor: pointer;
    }
    
    .propagatePeople:hover {
        background-image: ${_SectionBox[PR.styleMode].propagatePeopleHover};
        background-repeat: no-repeat;
        width: 25px;
        align-items: center;
    }
    
    .propagatePeoplee {
        float: left;
        display: inline-block;
        background: url(${propagatePeople});
        background-repeat: no-repeat;
        width: 25px;
        height: 25px;
        align-items: center;
        margin: 5px 10px 0 5px;
    }

    .btnArea {
        float:right; 
        /* margin-right:85px; */ 
        text-align:center; 
        font-size:0;
        width: 178px;
    }

    .btnAreaDisable {
        float:right; 
        /* margin-right:95px; */
        margin-right: 106px;
        text-align:center; 
        font-size:0;
    }

    .elevationBtn2{
        display: inline-block;
        width: 75px;
        height: 29px;
        line-height: 16px;
        padding: 5px 0 0 5px;
        border: 2px solid #fff;
        font-size: 14px;
        letter-spacing: -0.05em;
        border-radius: 15px !important;
        cursor: pointer;
        background: #F2BE08;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        margin-right: 16px;
    }

    .elevationBtn3{
        display: inline-block;
        width: 75px;
        height: 29px;
        line-height: 16px;
        padding: 5px 0 0 5px;
        border: 2px solid #fff;
        font-size: 14px;
        letter-spacing: -0.05em;
        border-radius: 15px !important;
        cursor: pointer;
        background: #ff8500;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        margin-right: 16px;
    }

    .elevationBtn4{
        display: inline-block;
        width: 75px;
        height: 29px;
        line-height: 16px;
        padding: 5px 0 0 5px;
        border: 2px solid #fff;
        font-size: 14px;
        letter-spacing: -0.05em;
        border-radius: 15px !important;
        cursor: pointer;
        background: #E80800;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        margin-right: 16px;
    }

    .completionStatus{ 
        /* margin-right:15px; */
        margin-left: 15px;
        margin-right: 30px;
    }

    .completionStatuss{ 
        float:right; 
        right:13px; 
        position:absolute; 
        top:17px; 
        /* width:50px; */
        width: ${_SectionBox[PR.styleMode].completionStatussWidth}; 
        display:inline-block; 
        z-index:1; 
        margin-right: 4px; 
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;


/**********************************************************************/


export const _ProcessSectionBox = {
    soulbrain: {
        dropBoxBorder: 'solid 1px #5fb2af',
    },
    Wonik: {
        dropBoxBorder: 'solid 1px #5398FF',
    },
    Hydrogen: {
        dropBoxBorder: 'solid 1px #8CE5FF',
    },
    Gyeonggi: {
        dropBoxBorder: 'solid 1px #5398FF',
    }
}

export const ProcessSectionBox = styled(SectionBox)`
    .tit strong {
        float: left;
    }

    .tit::after {
        ${props => props.theme.variables.clearfix()};
    }

    .tooltip {
        position: relative;
        display: inline-block;
        left: -55px;
        top: 0;
    }

    .dropBox {
        visibility: hidden;
        position: absolute;
        z-index: 1;
        width: 140px;
        height: 110px;
        border: ${_ProcessSectionBox[PR.styleMode].dropBoxBorder};
        background: #1a1c2c;
        border-radius: 5px;
        color: #e9eaeb;
        padding: 0;
        margin-top: 15px;
        margin-left: -85px;
        text-align: center;
        overflow-y: auto;
    }
    .tooltip:hover
    .dropBox {
        visibility:visible;
    }

    .dropBox > p{ 
        padding: 10px 10px;
    }

    .dropBox > p:hover{ 
        background-color: #5fb2af; 
    }

    .dropBox > p:nth-child(1):hover{ 
        background-color:#1a1c2c; 
        border-radius:3px;
    }

    .dropBox > p:nth-child(1) {
        font-weight: 500; 
        padding:10px; 
        border-bottom: ${_ProcessSectionBox[PR.styleMode].dropBoxBorder};
    }

    .dropBox > p:nth-child(2) {
        line-height:20px;
    }

    .dropBox > p:nth-child(3) {
        line-height:20px;
    }

    .dropBox > p:nth-child(4) {
        line-height:20px;
    }

    .borderSide {
        border-left: 1px solid #060817;
        border-right: 1px solid #060817;
    }
    
    .processTextarea { 
        display: block; 
        min-height: 100px; 
        line-height: 25px;
        border-bottom: 0;
        overflow-x: hidden;
        overflow-y: auto;
        resize: none;
        padding-right: 10px;
        background-color: transparent;
        width: 100%; 
        color: white;
        border-color: transparent; 
        text-align: start; 
    }

    .btnPropagateSelect {
        float: right;
        display: inline-block;
        border: solid 2px #fff;
        margin-right: 107px;
        width: 80px;
        height: 30px;
        line-height: 27px;
        cursor: pointer;
        border-radius: 15px;
        font-size: 14px;
        letter-spacing: -0.05em;
        text-align: center;
        color: #fff;
        background-color: ${_SectionBox[PR.styleMode].btnAllCheckBackground};
    }

    .btnPropagateSelect:hover {
        background: ${_SectionBox[PR.styleMode].btnAllCheckHoverBackground};
    }

    /*전체전파 비활성화*/
    .proBtnDisable {
        float: right;
        display: inline-block;
        width: 80px;
        height: 30px;
        line-height: 27px;
        border: 2px solid #fff;
        font-size: 14px;
        letter-spacing: -0.05em;
        border-radius: 15px;
        opacity: 0.3;
        cursor: default;
        background: none;
        pointer-events: none;
        align-items: center;
        text-align: center;
        color: #fff;
    }

    /*정렬 test*/
    .messagee {
        background: url(${message}) 0 0 no-repeat;
        width: 23px;
        height: 16px;
        display: inline-block;
        margin-left: 14px;
        margin-right: 20px;
        margin-top: 3px;
    }
    
    .emaill {
        display: inline-block;
        background: transparent url(${email}) 0% 0% no-repeat
        padding-box;
        opacity: 1;
        width: 23px;
        height: 23px;
        margin-right: 40px;
    }
`;


/**********************************************************************/


export const _DecisionSectionBox = {
    soulbrain: {
        choiceBoxBorder: 'solid 1px #5fb2af',
    },
    Wonik: {
        choiceBoxBorder: 'solid 1px #5398FF',
    },
    Hydrogen: {
        choiceBoxBorder: 'solid 1px #00AFFF',
    },
    Gyeonggi: {
        choiceBoxBorder: 'solid 1px #5398FF',
    }
}

export const DecisionSectionBox = styled(SectionBox)`
    strong {
        width: calc(100% - 280px);
    }

    /*yes/no*/
    .choiceBox {
        padding: 6px 0;
        background-color: #060817;
        color: #fff;
        text-align: left;
        margin-right: 10px;
        user-select: none;
        border: ${_DecisionSectionBox[PR.styleMode].choiceBoxBorder};
        width: 110px;
        text-align: center;
    }

    .choiceBox option {
        background-color: #060817;
    }

    .choiceBox option:hover {
        background-color: #5fb2af !important;
    }

    .choiceBox .choiceOp:hover {
        background-color: #5fb2af;
    }

    .choiceBox .decorated option:hover {
        box-shadow: 0 0 10px 100px #1882a8 inset;
    }

    .choiceBoxx {
        color: #000000;
        text-align: left;
        margin-right: 10px;
        user-select: none;
        background: #fff url(${selectArrow}) no-repeat right
        center;
    }

    .seleteBox {
        position: relative;
        z-index: 50;
        font-size: 16px;
        font-weight: 100;
        background-color: #1a1c2c;
        border-radius: 4px;
    }

    .seleteBox button {
        width: 100%;
        padding: 11px 10px;
        padding-right: 40px;
        font-weight: 100;
        text-align: left;
        vertical-align: top;
        color: white;
    }

    .seleteBox .seletedTxt:after {
        content: "";
        position: absolute;
        top: 13px;
        right: 12px;
        width: 8px;
        height: 8px;
        border-left: 2px solid #5f616c;
        border-bottom: 2px solid #5f616c;
        transform: rotate(-45deg);
    }

    .seleteBox ul {
        display: none;
        position: absolute;
        width: 100%;
        padding: 10px 0;
        background-color: #1a1c2c;
        z-index: 99;
    }

    .seleteBox.isShow {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }

    .seleteBox.isShow .seletedTxt:after {
        top: 17px;
        transform: rotate(135deg);
    }

    .seleteBox.isShow ul {
        display: block;
    }
`;


/**********************************************************************/

export const EndPointSectionBox = styled(SectionBox)`

    .sectionBoxStart strong:before {
        counter-increment: taskOrder;
        content: no-close-quote;
        position: absolute;
        top: 0;
        left: 0;
    }

    .sectionBoxStart strong {
        padding-left: 0;
    }
`;


/**********************************************************************/

export const InternalSectionBox = styled(SectionBox)`
    /* .completionStatuss {
        float: right;
        right: 13px;
        position: absolute;
        top: 17px;
        width: 50px;
        display: inline-block;
        z-index: 2;
        margin-right: 4px;
    } */

    .sendMessage .message {
        margin-left: 15px;
        margin-top: 2px;
    }

    .sendMessage .email {
        margin-left: 20px;
    }

    .sendMessage .mic {
        margin-left: 20px;
    }

    .sendMessage .volume {
        margin-left: 20px;
    }

    .scrollbar {
        overflow-x: scroll;
        overflow-y: scroll;
    }

    .scrollbar::-webkit-scrollbar {
        width: 5.5px;
    }

    .scrollbar::-webkit-scrollbar-thumb {
        background-color: rgb(125, 131, 137);
        opacity: 0.4;
    }

    .scrollbar::-webkit-scrollbar-track {
        background-color: rgb(61, 63, 71);
        border-radius: 3px;
    }

    .scrollbar::-webkit-scrollbar-corner {
        display: none;
    }

    .clfix:after {
        ${props => props.theme.variables.clearfix()};
    }

    .soundInfo {
        position: relative;
    }

    .soundInfo.isShow .soundInfoList {
        display: block;
    }

    .soundInfo .soundInfoList {
        display: none;
        position: absolute;
        top: 38px;
        right: -35px;
        z-index: 1;
        width: 100px;
        height: 100px;
        background-color: #060817;
        border: 1px solid #3b3f5c;
    }

    .soundInfo .soundInfoList li + li {
        border-top: 1px solid #3b3f5c;
    }

    .soundInfo .soundInfoList button {
        width: 100%;
        font-size: 14px;
        line-height: 50px;
        color: #fff;
        text-align: center;
    }

    .soundInfo .soundInfoList button[data-value="N"] {
        color: #369ed2;
    }

    .soundInfo.isOn .soundInfoList button[data-value="Y"] {
        color: #00ff4e;
    }

    .soundInfo.isOn .soundInfoList button[data-value="N"] {
        color: #fff;
    }

    /*방송, 알람 on/off*/
    .micInfo {
        position: relative;
    }

    .micInfo.isShow .micInfoList {
        display: block;
    }

    .micInfo .micInfoList {
        display: none;
        position: absolute;
        top: 38px;
        right: -40px;
        z-index: 1;
        width: 100px;
        height: 100px;
        background-color: #060817;
        border: 1px solid #3b3f5c;
    }

    .micInfo .micInfoList li + li {
        border-top: 1px solid #3b3f5c;
    }

    .micInfo .micInfoList button {
        width: 100%;
        font-size: 14px;
        line-height: 50px;
        color: #fff;
        text-align: center;
    }

    .micInfo .micInfoList button[data-value="N"] {
        color: #fff;
    }

    .micInfo .micInfoList button[data-value="N"] {
        color: #39a7de;
    } /*0722 수정*/

    .micInfoOn {
    }

    .micInfoOff {
    }

    .isOn .mic {
        display: inline-block;
        vertical-align: top;
        background-image: url(${micOn});
    }

    .volume {
        display: inline-block;
        background: transparent url(${volumeOff}) 0 0 no-repeat
        padding-box;
        opacity: 1;
        width: 30px;
        height: 19px;
    }

    .isOn .volume {
        display: inline-block;
        vertical-align: top;
        background-image: url(${volumeOn});
    }

    .volumeInfoOn {
        color: #39a7de !important;
    }

    .volumeInfoOff {
    } /*0722 추가*/

    .volumeInfo {
        position: relative;
    }

    .volumeInfo.isShow .volumeInfoList {
        display: block;
    }

    .volumeInfo .volumeInfoList {
        display: none;
        position: absolute;
        top: 36px;
        right: -10px;
        z-index: 1;
        width: 100px;
        height: 100px;
        background-color: #060817;
        border: 1px solid #3b3f5c;
    }

    .volumeInfo .volumeInfoList li + li {
        border-top: 1px solid #3b3f5c;
    }

    .volumeInfo .volumeInfoList button {
        width: 100%;
        font-size: 14px;
        line-height: 50px;
        color: #fff;
        text-align: center;
    }

    .volumeInfo .volumeInfoList button[data-value="N"] {
        color: #369ed2;
    }

    .volumeInfo .volumeInfoList button[data-value="N"] {
        color: #fff;
    }

    .volumeInfo .volumeInfoList button[data-value="N"] {
        color: #39a7de;
    } /*0722 수정*/

    .message {
        background: url(${message}) 0 0 no-repeat;
        width: 23px;
        height: 16px;
        display: inline-block;
    }

    .email {
        display: inline-block;
        background: transparent url(${email}) 0% 0% no-repeat
        padding-box;
        opacity: 1;
        width: 23px;
        height: 23px;
    }

    .mic {
        display: inline-block;
        background: url(${micOff}) 0% 0% no-repeat;
        width: 16px;
        height: 25px;
    }

    .isOn .mic {
        display: inline-block;
        vertical-align: top;
        background-image: url(${micOn2});
    }

    .volume {
        display: inline-block;
        background: transparent url(${volumeOff2}) 0 0 no-repeat
        padding-box;
        opacity: 1;
        width: 30px;
        height: 19px;
    }

    .isOn .volume {
        display: inline-block;
        vertical-align: top;
        background-image: url(${volumeOn2});
    }
`;