import styled from "styled-components";
import PR from "../../Root/resource/id";

import history_menu_arrow from "../../Common/img/sub/history_menu_arrow.png";
import history_menu_arrow_on from "../../Common/img/sub/history_menu_arrow_on.png";
import history_select from "../../Common/img/sub/history_select.png";
import dashboard_calendar_bk from "../../Common/img/sub/dashboard_calendar_bk.png";
import dashboard_calendar from "../../Common/img/sub/dashboard_calendar.png";
import checkbox from "../../Common/img/common/checkbox_vector.png";
import paging_first from "../../Common/img/common/paging_first_B_active.png";
import paging_prev from "../../Common/img/common/paging_prev_B_active.png";
import paging_next from "../../Common/img/common/paging_next_B_active.png";
import paging_last from "../../Common/img/common/paging_last_B_active.png";
import paging_first_disable from "../../Common/img/common/paging_first_B.png";
import paging_prev_disable from "../../Common/img/common/paging_prev_B.png";
import paging_next_disable from "../../Common/img/common/paging_next_B.png";
import paging_last_disable from "../../Common/img/common/paging_last_B.png";
import historyMemoOn from "../../Common/img/common/history_memo_On.png";
import historyMemoIcon from "../../Common/img/common/history_memo_Off.png";
import close_icon from "../../Common/img/common/close_icon.png";
import search_icon from "../../Common/image/icon/search_icon.png";
import left_btn_on from "../../Common/image/icon/left_btn_on.png";
import left_btn_off from "../../Common/image/icon/left_btn_off.png";
import SelectBoxArrowDrop from '../../History/images/selectBoxArrowDrop.png';
//import SelectOptionActive from '../../Common/img/imghydrogen/selectOption_active.png';
//import FileDownIconImage from '../../Common/img/imghydrogen/fileDownlcon.png';
//import PageArrowLeft from '../../Common/img/imghydrogen/pageArrowLeft.png';
//import PageArrowRight from '../../Common/img/imghydrogen/pageArrowRight.png';

//import TitleBarIcon from '../../Common/img/imghydrogen/H_titleBarIcon.png';
import select_arrow from '../../Common/images/select_arrow.png';
import list_Icon from '../images/list_Icon.svg';
import checkBox_active from '../images/checkbox_active.svg';
import closeMemo_icon from '../images/closeMemo_icon.svg';


/**********************************************************************/
// 이력 공통 CSS

export const _HistorysCommon = {
    default: {
        hslMenuLiOnBackground: '#0095FF',
        hslMenuLiOnColor: '#1B212C',
        inputRadioCheckedBackground: '#0095FF',
        inputCheckboxBackground: `url(${checkBox_active}) no-repeat center center`,
        hscsSbmtBackground: '#131d24',
        hscsSbmtHoverBackground: '#0c1216',
        btnCalendarBkWidth: '17px',
        hsContBackColor: '#222A38',
        hscSchBorder: 'solid 1px #ddd',
        hscTbBorder: 'solid 1px #ddd',
        hscSchDlWidth: '100%',
        hscsDateDatepickerBorder: 'solid 1px #ddd',
        hscsDateMarginRight: '30px',
        hsLftWidth: '280px',
        hsScrMarginLeft: '280px',
        hscsSbmtWidth: '100px',
        hscsSbmtTop: '42px',
        hscTbBackground: '#2A3344',
        hscTbTdBorderBottom: 'solid 1px #ddd',
        hscExlLiABorder: 'solid 1px #2A3344',
        hscExlLiABackground: '#1B212C',
        hscExlLiAPadding: '5px 10px',
        hscExlLiAExlBackground: '#0095FF',
        hscExlLiAExlColor: '#000000',
        hscNavAPrevDisable: `url(${paging_prev_disable}) no-repeat center center`,
        hscNavANextDisable: `url(${paging_next_disable}) no-repeat center center`,
        hscNavAPrev: `url(${paging_prev_disable}) no-repeat center center`,
        hscNavANext: `url(${paging_next_disable}) no-repeat center center`,
        hscExlLiAHeight: '32px',
        hscExlLiALineHeight: '30px',
        hscTbPadding: '30px 20px',
        hscTbMarginTop: '10px',
        hscNavABackground: '#FFF',
        hscNavABorder: '#ccc',
        hscNavUlLiBackColor: '#e2e2e2',
        hscNavUlLiOnColor: '#000000',
        hscNavUlLiAfterBackColor: '#e2e2e2',
        hscNavMarginTop: '38px',
        selWhHeight: '32px',
        hscsHalfLiWidth: '25%',
        selWhBorderColor: '#ddd',
        selWhBackground: `url(${history_select}) no-repeat`,
        hscsHalfPaddingRight: '200px',
        hscsHalfMarginBottom: '10px',
        hscSchDlMarginTop: '14px',
        hscsRdoPaddingTop: '7px',
        hscsHalfLiInputBorder: 'solid 1px #ddd',
        hsLftTop: '50px',
        hscTbTdABorder: 'solid 1px #ccc',
        hsLftBackColor: '#1B212C',
    },
}

export const HistorysCommon = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    background-color: #FFFFFF;

    .teamEditorName{
        position: absolute;
        left: 165px;
        top: 24px;
        z-index: 99;
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        display: flex;
        align-items: center;
     }
    .teamEditorNameIcon{
        display: inline-block;
        width: 24px;
        height: 24px;
        margin-left: 10px;
    }

    #hsLft {
        position: fixed;
        left: 0; 
        top: ${_HistorysCommon[PR.styleMode].hsLftTop};
        bottom: 0;
        width: ${_HistorysCommon[PR.styleMode].hsLftWidth};
        background: ${_HistorysCommon[PR.styleMode].hsLftBackColor};
    }

    .hslMenu {
    }

    .hslMenu li {
        border-bottom: solid 1px #29313E;
        cursor: pointer;
        padding: 20px;
        height: 58px;
        line-height: 58px;
    }

    .hslMenu li.on {
        background: ${_HistorysCommon[PR.styleMode].hslMenuLiOnBackground}; 
        color: ${_HistorysCommon[PR.styleMode].hslMenuLiOnColor};
    }

    .hslMenu li a {
        display: block;
        position: relative;
        font-family: "Spoqa Han Sans Neo";
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 18px;
    }

    .hslMenu li a:after {
        content: "";
        display: block;
        width: 5px;
        height: 8px;
        position: absolute;
        right: 15px;
        top: 50%;
        margin-top: -4px;
        /* background: url(${history_menu_arrow}) no-repeat center center; */
    }

    .hslMenu li a.on:after {
        /* background: url(${history_menu_arrow_on}) no-repeat center center; */
        color: ${_HistorysCommon[PR.styleMode].hslMenuLiOnColor};
    }

    .hsScr {
        /* overflow: auto; */
        height: 100vh;
        margin-left: ${_HistorysCommon[PR.styleMode].hsScrMarginLeft};
        margin-top: 50px;
    }

    #hsCont {
        background: ${_HistorysCommon[PR.styleMode].hsContBackColor};
        padding: 40px;
        min-width: 1200px;
        height: 100vh;
        margin-top: ${_HistorysCommon[PR.styleMode].hsContMarginTop};
    }

    .hsContTitle{
        display: block;
        color: #0095FF;
        font-family: "Spoqa Han Sans Neo";
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 16px;
        margin-bottom: 20px;
     }

    .hscSch {
        background: #1B212C;
        /* border: ${_HistorysCommon[PR.styleMode].hscSchBorder}; */
        padding: 20px;
        padding-right: 140px;
        position: relative;
        display: ${_HistorysCommon[PR.styleMode].hscSchDisplay};
    }

    .hscSch dl {
        display: table;
        width: ${_HistorysCommon[PR.styleMode].hscSchDlWidth};
        height: 26px;
        /* margin-top: 10px; */
        margin-top: ${_HistorysCommon[PR.styleMode].hscSchDlMarginTop};
    }

    .hscSch dl:first-child {
        margin-top: 0;
    }

    .hscSch dl dt {
        display: table-cell;
        vertical-align: middle;
        /* width: 120px; */
        width: 92px;
        height: 26px;
        color: #FFF;
        font-family: "Spoqa Han Sans Neo";
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 14px;
    }

    .hscSch dl dd {
        display: table-cell;
        vertical-align: middle;
        height: 26px;
        position: relative;
    }

    .hscSch dl dd:after {
        content: "";
        display: table;
        clear: both;
    }

    .hscsRdo {
        float: left;
        /* padding-top: 7px; */
        /* padding-top: ${_HistorysCommon[PR.styleMode].hscsRdoPaddingTop}; */
        vertical-align: middle;
        position: relative;
    } /*0719 수정*/

    .hscsRdo:after {
        content: "";
        display: table;
        clear: both;
    }

    .hscsRdo li {
        float: left;
        margin-right: 15px;
    }

    .hscsRdo li:last-child {
        margin-right: 0;
    }

    .hscsRdo input[type="radio"] {
    }

    .hscsRdo input[type="radio"] + label {
        color: #fff;
        text-align: center;
        font-family: Inter;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 12px;
        margin-left: 8px; 
    }

    .hscsRdo input[type="radio"]:checked:after {
        content: "";
        display: block;
        background: ${_HistorysCommon[PR.styleMode].inputRadioCheckedBackground};
        position: absolute;
        left: 3px;
        right: 3px;
        top: 3px;
        bottom: 3px;
        border-radius: 50%;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
    }

    .hscsRdoPeriod {
        float: left;
        height: 26px;
        padding-top: 4px;
        /* padding-top: ${_HistorysCommon[PR.styleMode].hscsRdoPaddingTop}; */
        vertical-align: middle;
        position: relative;
    } /*0719 수정*/

    .hscsRdoPeriod:after {
        content: "";
        display: table;
        clear: both;
    }

    .hscsRdoPeriod li {
        float: left;
        margin-right: 15px;
    }

    .hscsRdoPeriod li:last-child {
        margin-right: 0;
    }

    .hscsRdoPeriod input[type="radio"] {
    }

    .hscsRdoPeriod input[type="radio"] + label {
        color: #fff;
        text-align: center;
        font-family: Inter;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 12px;
        margin-left: 8px; 
    }

    .hscsRdoPeriod input[type="radio"]:checked:after {
        content: "";
        display: block;
        background: ${_HistorysCommon[PR.styleMode].inputRadioCheckedBackground};
        position: absolute;
        left: 3px;
        right: 3px;
        top: 3px;
        bottom: 3px;
        border-radius: 50%;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
    }

    .hscsLoc {
        position: relative;
    }

    .hscsLoc:after {
        content: "";
        display: table;
        clear: both;
    }

    .hscsLoc li {
        float: left;
        width: 120px;
        margin-right: 10px;
    }

    .hscsLoc li:last-child {
        margin-right: 0;
    }

    .hscsLoc li select {
        width: 100%;
    }

    .selWh {
        display: block;
        height: 26px;
        line-height: 24px; 
        border-radius: 2px;
        border: 0;
        /* border-color: ${_HistorysCommon[PR.styleMode].selWhBorderColor}; */
        font-size: 12px;
        padding: 0 27px 0 10px;
        background: #222A38 url(${select_arrow}) 95% 49% no-repeat;
        /* padding-left: 10px; */
    }
        
    .subjectEvaluation{
        width: 120px;
        font-size: 15px;
        font-weight: 500;
    }

    .hscsDate {
        float: left;
        height: 26px;
        margin-right: ${_HistorysCommon[PR.styleMode].hscsDateMarginRight};
        display: ${_HistorysCommon[PR.styleMode].hscsDateDisplay};
        border: ${_HistorysCommon[PR.styleMode].hscsDateBorder};
        padding-top: ${_HistorysCommon[PR.styleMode].hscsDatePaddingTop};
        border-radius: ${_HistorysCommon[PR.styleMode].hscsDateBorderRadius};
        /* position: relative; */
        position: static;
        background: ${_HistorysCommon[PR.styleMode].hscsDateBackground};
    }

    .hscsDate:after {
        content: "";
        display: table;
        clear: both;
    }

    .hscsDate li {
        float: left;
    }

    .hscsDate li:nth-child(2) {
        line-height: 32px;
        padding: 0 5px;
    }

    .datepicker {
        position: relative;
    }

    .datepicker input[type="text"] {
        padding-right: 32px;
        border: none;
    } /* 0518 */

    .datepicker input[type="text"] + label {
        display: block;
        width: 32px;
        height: 32px;
        position: absolute;
        right: 0;
        top: 0;
        cursor: pointer;
        text-indent: -9999px;
        background: url(${dashboard_calendar}) no-repeat center center;
    }

    /* .hscsDate .datepicker {
    }

    .hscsDate .datepicker input[type="text"] {
        display: block;
        width: 120px;
        border: ${_HistorysCommon[PR.styleMode].hscsDateDatepickerBorder};
        background: ${_HistorysCommon[PR.styleMode].hscsDateDatepickerBackColor};
        height: 32px;
        font-size: 13px;
        padding-left: 10px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    .hscsDate .datepicker input[type="text"] + label {
        background: url(${dashboard_calendar_bk}) no-repeat center center;
    } */

    .hscsDate .datepicker {
    }

    .hscsDate .datepicker input[type="text"] {
        display: block;
        width: 120px;
        /* border: ${_HistorysCommon[PR.styleMode].hscsDateDatepickerBorder}; */
        /* background: ${_HistorysCommon[PR.styleMode].hscsDateDatepickerBackColor}; */
        background: #222A38;
        height: 26px;
        font-size: 12px;
        padding-left: 10px;
    }

    .hscsDate .datepicker input[type="text"] + label {
        background: url(${dashboard_calendar_bk}) no-repeat center center;
    }

    .react-datepicker{
        font-size: 10px;
    }

    .react-datepicker__header {
        text-align: center;
        background-color: #f0f0f0;
        border-bottom: 1px solid #aeaeae;
        border-top-left-radius: 0.3rem;
        padding: 12px 8px;
        position: relative;

        /* .react-datepicker__day-names {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 40px;

        .react-datepicker__day-name {
                color: #5b5b5b;
                width: 36px;
            }
        } */

        .react-datepicker__current-month{
            margin-top: 0;
            color: #000;
            font-weight: bold;
            font-size: 13px;
            margin-bottom: 4px;
        }
    }

    .react-datepicker__day-name{
        color: #000;
        display: inline-block;
        width: 2.2rem;
        line-height: 2.0rem;
        text-align: center;
        margin: 0.4rem;
        font-size: 12px;
    }

    .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name {
        color: #000;
        display: inline-block;
        width: 2.2rem;
        line-height: 2.0rem;
        text-align: center;
        margin: 0.4rem;
        font-size: 12px;
    }

    .react-datepicker__day--selected,
    .react-datepicker__day--in-selecting-range,
    .react-datepicker__day--in-range,
    .react-datepicker__month-text--selected,
    .react-datepicker__month-text--in-selecting-range,
    .react-datepicker__month-text--in-range,
    .react-datepicker__quarter-text--selected,
    .react-datepicker__quarter-text--in-selecting-range,
    .react-datepicker__quarter-text--in-range,
    .react-datepicker__year-text--selected,
    .react-datepicker__year-text--in-selecting-range,
    .react-datepicker__year-text--in-range {
        border-radius: 0.3rem;
        background: #0095FF;
        color: #fff !important;
        /* padding: 4px; */
    }

    .dateTypeSelectTitle{
        font-size: 11px;
        color: #808080;
        background: #f5f5f5;
        position: absolute;
        left: 10px;
        top: 10px;
    }

    .hscsDay {
        float: left;
        vertical-align: middle;
    }

    .dateTypeChiceTitle{
        font-size: 11px;
        color: #808080;
        background: #f5f5f5;
        position: absolute;
        left: 10px;
        top: 10px;
    }

    .sensorDetectHDaySelect{
        display: block;
        width: 218px;
        height: 54px;
        border-radius: 5px;
        border: solid 1px #f5f5f5;
        background: #f5f5f5;
        padding: 10px;
        padding-top: 26px;
        font-size: 14px;
        margin-right: 20px;
    }

    .sensorDetectDayOptionBox{
       display: block;
       width: 218px;
       height: 138px;
       background: #f5f5f5;
       border-radius: 5px;
       border: solid 1px #00AFFF;
       margin-top: 4px;
       position: absolute;
       z-index: 1;
    }

    .sensorDetectDayOptionBox span{
       display: block;
       color: #575757;
       height: 32.3px;
       line-height: 32.3px;
       padding-left: 20px;
    }

    .btnCalendarBk {
        width: ${_HistorysCommon[PR.styleMode].btnCalendarBkWidth};
        height: 18px;
        display: inline-block;
        z-index: 1;
        position: absolute;
        right: 10px;
        top: 4px;
        cursor: pointer;
    }

    .hscsSbmt {
        display: block;
        width: 70px;
        height: 56px; 
        background: ${_HistorysCommon[PR.styleMode].hscsSbmtBackground};
        color: #fff;
        position: absolute;
        top: 42px;
        right: 20px;
        -webkit-border-radius: 2px;
        -moz-border-radius: 2px;
        border-radius: 2px;
        cursor: pointer;
    }

    .hscsSbmt > span {
    }

    .hscsSbmt > span > span {
        display: block;
        width: 70px;
        height: 56px;
        vertical-align: middle;
        text-align: center;
        color: #000000;
        font-size: 16px;
        font-weight: 500;
        /* padding: 20px; */
        padding-top: 20px;
        justify-content: center;
        align-items: center;
        background: #0095FF;
        border-radius: 2px;
    }

    .hscsSbmtSOP {
        display: block;
        width: 70px;
        height: 56px;
        background: ${_HistorysCommon[PR.styleMode].hscsSbmtBackground};
        color: #fff;
        position: absolute;
        top: 20px;
        right: 20px;
        -webkit-border-radius: 2px;
        -moz-border-radius: 2px;
        border-radius: 2px;
        cursor: pointer;
    }

    .hscsSbmtSOP > span {
    }

    .hscsSbmtSOP > span > span {
        display: block;
        width: 70px;
        height: 56px;
        vertical-align: middle;
        text-align: center;
        color: #000000;
        font-size: 16px;
        font-weight: 500;
        /* padding: 20px; */
        padding-top: 20px;
        justify-content: center;
        align-items: center;
        background: #0095FF;
        border-radius: 2px;
    }

    /* .hscsSbmt > span > span:hover {
        background: ${_HistorysCommon[PR.styleMode].hscsSbmtHoverBackground};
        border-radius: 4px;
    } */

    #hscsSbmting {
        cursor: wait;
    }

    .hscExl {
        text-align: right;
        margin-top: 20px;
        margin-bottom: 16px;
    }

    .hscExl li {
        display: inline-block;
        margin-right: 5px;
    }

    .hscExl li a {
        display: block;
        width: 101px; 
        height: 30px;
        line-height: 18px; 
        /* height: ${_HistorysCommon[PR.styleMode].hscExlLiAHeight};
        line-height: ${_HistorysCommon[PR.styleMode].hscExlLiALineHeight}; */
        border: ${_HistorysCommon[PR.styleMode].hscExlLiABorder};
        background: ${_HistorysCommon[PR.styleMode].hscExlLiABackground};
        padding: ${_HistorysCommon[PR.styleMode].hscExlLiAPadding};
        text-align: center;
        color: #FFF;
        font-family: "Spoqa Han Sans Neo";
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        -webkit-border-radius: 2px;
        -moz-border-radius: 2px;
        border-radius: 2px;
        cursor: pointer;
    }

    .hscExl li a:hover {
        background: #0095FF;
        border-radius: 2px;
    }

    .hscExl li a.all {
    }

    .hscExl li a.exl {
        /* background: #1f7244; */
        background: ${_HistorysCommon[PR.styleMode].hscExlLiAExlBackground};
        color: ${_HistorysCommon[PR.styleMode].hscExlLiAExlColor};
    }

    .hscTb {
        display: block;
    }

    .hscTb table {
    }

    .hscTb tr:hover {
        background: #0095FF;

       .recentlyCheckbox:checked {
            display: inline-block;
            background: url(${ checkBox_active }) no-repeat center center !important;
            background-size: 16px auto !important;
            z-index: 1;
            border: solid 1px #1B212C !important;
        }

        .activeCheckbox:checked {
            /* background: url(${ checkbox }) no-repeat center center; */
            display: inline-block;
            width: 16px;
            height: 16px;
            border-radius: 3px;
            /* background: #000000; */
            border: solid 1px #fff !important;
        }

        input[type=checkbox]:checked {
            display: inline-block;
            width: 16px;
            height: 16px;
            border-radius: 3px;
            border: solid 1px #fff;
        }
    } 

    .hscTb th,
    .hscTb td {
        font-size: 14px;
        text-align: center;
    }

    .hscTb th {
        background: ${_HistorysCommon[PR.styleMode].hscTbBackground};
        font-weight: 500;
        height: ${_HistorysCommon[PR.styleMode].hscTbThHeight};
        vertical-align: ${_HistorysCommon[PR.styleMode].hscTbThVerticalAlign};
        color: ${_HistorysCommon[PR.styleMode].hscTbThColor};
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
        align-items: center;
        border-right: solid 1px #1B212C;
        padding: 9px 10px;
    }

    .hscTb th:last-child{
        border: none;
    }

    .hscTb td {

    }
 
    .recentlyBoxArea{

        &.on{
          background: #0095FF;
          color: #1B212C;
        }
    }

    .activeBoxArea{

        &.on{
          color: #0095FF;
        }
    }

    .activeBoxArea:hover{
        color: #ffffff;
    } 

    .activeMemoArea{

        &.on{
          background: #0095FF;
        }
    }

    .recentlyCheckbox:checked {

        &.on{
            display: inline-block;
            background: url(${ checkBox_active }) no-repeat center center !important;
            background-size: 16px auto !important;
            z-index: 1;
        }
    }

    .activeCheckbox:checked {

        &.on{
            display: inline-block;
            background: url(${ checkbox }) no-repeat center center;
            background-size: 16px;
            border: 0 !important;
            z-index: 1;
        }
    }

    .hscTb td select {
        display: inline-block;
    }

    .hscTb td a {
        display: inline-block;
        border: ${_HistorysCommon[PR.styleMode].hscTbTdABorder};
        color: ${_HistorysCommon[PR.styleMode].hscTbTdAColor};
        height: 28px;
        line-height: 26px;
        font-size: 13px;
        padding: 0 10px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    .scrTb {
        overflow-x: auto;
    }

    .scrTb table {
        min-width: 1400px;
        background: #1B212C;
    }

    .scrTb td {
        padding: 7px 10px; 
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        cursor: pointer;
        font-size: 14px;
        font-weight: 400;
        border-right: solid 1px #2A3344;
        border-bottom: solid 1px #2A3344;
    } 

    .scrTb td:last-child{
        border-right: none;         
    }

    .detailInfo{
        align-items: center;
        width: 72px;
        padding: 2px 10px;
        border: 1px solid #2A3344;
        border-radius: 2px;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
    }

    .hscNav {
        text-align: center;
        margin-top: ${_HistorysCommon[PR.styleMode].hscNavMarginTop};
        position: absolute;
        bottom: 40px;
        left: 50%;
    }

    .hscNav a {
        display: inline-block;
        vertical-align: middle;
        width: 28px;
        height: 28px;
        line-height: 26px;
        border: ${_HistorysCommon[PR.styleMode].hscNavABorder};
        position: relative;
        font-family: "Roboto", sans-serif;
        color: #999;
        font-size: 13px;
        margin: ${_HistorysCommon[PR.styleMode].hscNavAMargin};
        /* border: solid 1px #2A3344; */
        border-radius: 2px !important;
    }

    .hscNav > a {
        text-indent: -9999px;
    }

    .hscNav a.first {
        background: url(${paging_first}) no-repeat center center;
        border: solid 1px #2A3344;
        cursor: pointer;
        margin-right: 6px;
    }

    .hscNav a.prev {
        background: url(${paging_prev}) no-repeat center center;
        border: solid 1px #2A3344;
        /* background: ${_HistorysCommon[PR.styleMode].hscNavAPrev}; */
        cursor: pointer;
        margin-right: 6px;
    }

    .hscNav a.next {
        background: url(${paging_next}) no-repeat center center;
        border: solid 1px #2A3344;
        /* background: ${_HistorysCommon[PR.styleMode].hscNavANext}; */
        cursor: pointer;
        margin-right: 6px;
    }

    .hscNav a.last {
        background: url(${paging_last}) no-repeat center center;
        border: solid 1px #2A3344;
        cursor: pointer;
    }

    .hscNav a.firstDisable {
        background: url(${paging_first_disable}) no-repeat center center;
        border: solid 1px #2A3344;
    }

    .hscNav a.prevDisable {
        /* background: url(${paging_prev_disable}) no-repeat center center; */
           background: ${_HistorysCommon[PR.styleMode].hscNavAPrevDisable};
           border: solid 1px #2A3344;
    }
    .hscNav a.nextDisable {
        /* background: url(${paging_next_disable}) no-repeat center center; */
           background: ${_HistorysCommon[PR.styleMode].hscNavANextDisable};
           border: solid 1px #2A3344;
    }

    .hscNav a.lastDisable {
        background: url(${paging_last_disable}) no-repeat center center;
        border: solid 1px #2A3344;
    }

    .hscNav ul {
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
    }

    .hscNav ul li {
        display: inline-block;
        vertical-align: middle;
        position: relative;
        margin-right: 6px;
        border: solid 1px #2A3344;
    }

    .hscNav ul li:before {
        content: "";
        display: block;
        width: 1px;
        height: 12px;
        /* background: #e2e2e2; */
        /* background: ${_HistorysCommon[PR.styleMode].hscNavUlLiBackColor}; */
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -6px;
    }

    .hscNav ul li:last-child:after {
        content: "";
        display: block;
        width: 1px;
        height: 12px;
        /* background: #e2e2e2; */
        /* background: ${_HistorysCommon[PR.styleMode].hscNavUlLiAfterBackColor}; */
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -6px;
    }

    .hscNav ul li.on a {
        display: block;
        font-weight: 700;
        color: ${_HistorysCommon[PR.styleMode].hscNavUlLiOnColor};
        /* background: ${_HistorysCommon[PR.styleMode].hscNavUlLiOnBackColor}; */
        background: #0095FF;
        border-radius: 2px;
    }

    .hscsHalf {
        margin-bottom: ${_HistorysCommon[PR.styleMode].hscsHalfMarginBottom};
        display: ${_HistorysCommon[PR.styleMode].hscsHalfDisplay};
    }
    
    .hscsHalf:after {
        content: "";
        display: table;
        clear: both;
    }

    .hscsHalf > li {
        float: left;
        /* width: 25%; */
        width: ${_HistorysCommon[PR.styleMode].hscsHalfLiWidth};
    }

    .hscsHalf > li select {
        display: block;
        width: 100%;
    }

    .hscsHalf > li dl dt {
        text-align: right;
        padding-right: 20px;
        /* width: 100px; */
    }

    .hscsHalf > li:first-child dl dt {
        text-align: left;
        /* width: 120px; */
    }

    .hscsHalf > li input[type="text"] {
        display: block;
        width: 100%;
        /* border: ${_HistorysCommon[PR.styleMode].hscsHalfLiInputBorder}; */
        border: none;
        background: #222A38;
        height: 26px;
        font-size: 13px;
        padding-left: 10px;
        -webkit-border-radius: 2px;
        -moz-border-radius: 2px;
        border-radius: 2px;
        padding: 5px 5px 5px 10px;
        align-items: center;
    }

    .hscsIpt {
        position: relative;
        padding-left: 170px;
        width: 600px;
    }

    .hscsIpt select {
        position: absolute;
        left: 0;
        top: 0;
        width: 160px;
    }

    .hscsIpt input[type="text"] {
        display: block;
        width: 100%;
        border: none;
        /* height: 32px; */
        height: 26px; 
        font-size: 13px;
        padding: 5px 5px 5px 10px;
        -webkit-border-radius: 2px;
        -moz-border-radius: 2px;
        border-radius: 2px;
    }
`;


// 이벤트 정보 -> 메모
export const _SensorDetectHistoryMemoComponent = {
    default: {
        memoContentsMargin: '10px 15px',
        memoBtnBackground: '#222a43',
        hsMmoRight: '750px',
        hsMmoTop: '300px',
    },
}

export const SensorDetectHistoryMemoComponent = styled.div`
    /* position: absolute;
    right: 120px;
    top: 540px;
    width: 300px;
    height: 300px;
    overflow: hidden;
    opacity: 1; */

    .dslTopMemo{
        position: relative;
        display: flex;
        align-items: center;
        height: 44px;
        padding: 0 15px;
        border-bottom: solid 1px #29313E;
    }

    .squareIcon{
        display: inline-block;
        width: 4px;
        height: 4px;
        background: #0095FF;
        margin-right: 4px;
    }

    .squareTitle{
        display: inline-flex;
        flex: 1;
        font-size: 14px;
        font-weight: 700;
        color: #0095FF;
    }

    .dslX{
        width: 14px;
        height: 14px;
        text-indent: -9999px;
        background: url(${closeMemo_icon}) no-repeat center center;
        z-index: 1;
        cursor: pointer;
    }

    .memoContents {
        display: block;
        height: calc(100% - 42px);
        margin: ${_SensorDetectHistoryMemoComponent.memoContentsMargin};
        padding: 15px;
    }

    .memoContents > textarea{
        background: #1B212C;
        border: none;
        font-family: 'Spoqa Han Sans Neo';
        font-size: 12px;
        font-weight: 400;
        line-height: 12px;
        letter-spacing: 0em;
        color: #fff;
    }

    .memoTxt {
        height: 240px;
        border: solid 1px #ddd;
        margin-top: 10px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        border: dashed 1px red;
    }

    .memoTxt .scroll-bar {
        background: rgba(0, 0, 0, 0.2) !important;
    }

    textarea.memoTxt {
        padding: 10px !important;
    }

    #hsMmo {
        position: fixed;
        width: 300px;
        height: 300px;
        right: ${_SensorDetectHistoryMemoComponent.hsMmoRight};
        top: ${_SensorDetectHistoryMemoComponent.hsMmoTop};
        left: ${_SensorDetectHistoryMemoComponent.hsMmoLeft};
        transform: ${_SensorDetectHistoryMemoComponent.hsMmoTransform};
        z-index: 1;
        background: #0D121A;
        border-radius: 5px; 
    }

    .hsMemoBox{

       &.on{
         position: absolute;
         right: 120px;
         top: 540px;
         /* position: fixed; */
         width: 300px;
         height: 300px;
         right: ${_SensorDetectHistoryMemoComponent.hsMmoRight};
         top: ${_SensorDetectHistoryMemoComponent.hsMmoTop};
         left: ${_SensorDetectHistoryMemoComponent.hsMmoLeft};
         transform: ${_SensorDetectHistoryMemoComponent.hsMmoTransform};
         z-index: 1;
         background: #0D121A;
         border-radius: 5px;
       }
    }
`;





// 센서 탐지 이력
export const SensorDetectHistoryComponent = styled(HistorysCommon)`

    .HisMemoOn {
        display: inline-block;
        height: 16px;
        width: 16px;
        background: url(${historyMemoOn}) no-repeat;
        background-position: 50%;
        background-size: 16px;
        background-position-y: 1px;
        margin: 0 auto;

        &.on{
           background: url(${historyMemoIcon}) no-repeat;
       }
    }

    .HisMemoOff {
        display: inline-block;
        height: 16px;
        width: 16px;
        background: url(${historyMemoIcon}) no-repeat;
        background-position: 50%;
        background-size: 16px;
        background-position-y: 1px;
        margin: 0 auto;
    }
`;


// 센서 탐지 분석
export const SensorDetectAnalysisComponent = styled(HistorysCommon)`

    .hscTb {
    }

    .hscTb table {
    }

    .hscTb tr:hover {
        background: #0095FF;
       .recentlyCheckbox:checked {
            display: inline-block;
            background: url(${ checkBox_active}) no-repeat center center !important;
            background-size: 16px auto !important;
            z-index: 1;
            border: solid 1px #1B212C !important;
        }
        .activeCheckbox:checked {
            /* background: url(${checkbox }) no-repeat center center; */
            display: inline-block;
            width: 16px;
            height: 16px;
            border-radius: 3px;
            /* background: #000000; */
            border: solid 1px #fff !important;
        }
        input[type=checkbox]:checked {
            display: inline-block;
            width: 16px;
            height: 16px;
            border-radius: 3px;
            border: solid 1px #fff;
        }
    }

    .hscTb th,
    .hscTb td {
        font-size: 14px;
        text-align: center;
    }

    .hscTb th {
        background: ${_HistorysCommon[PR.styleMode].hscTbBackground};
        font-weight: 500;
        height: ${_HistorysCommon[PR.styleMode].hscTbThHeight};
        vertical-align: ${_HistorysCommon[PR.styleMode].hscTbThVerticalAlign};
        color: ${_HistorysCommon[PR.styleMode].hscTbThColor};
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
        align-items: center;
        border-right: solid 1px #1B212C;
    }

    .hscTb th:last-child{
        border: none;
    }

    .hscTb td {

    }

    .hscTb input[type="checkbox"] {
        border-color: #fff;
    }

    /* .hscTb input[type="checkbox"]:checked {
        background: ${_HistorysCommon[PR.styleMode].inputCheckboxBackground};
        background-size: 14px auto !important;
    } */

    .hscTb td select {
        display: inline-block;
    }

    .hscTb td a {
        display: inline-block;
        border: ${_HistorysCommon[PR.styleMode].hscTbTdABorder};
        color: ${_HistorysCommon[PR.styleMode].hscTbTdAColor};
        height: 28px;
        line-height: 26px;
        font-size: 13px;
        padding: 0 10px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    .scrAnalysisTb {
        overflow-x: auto;
        overflow-y: auto;
        display: block;
        height: calc(100% - 140px);
    }

    .scrAnalysisTb::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background-color: #0D121A;
    }
    .scrAnalysisTb::-webkit-scrollbar-thumb {
        width: 6px;
        background: #0095FF;
    }
    .scrAnalysisTb::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }

    .scrAnalysisTb table {
        min-width: 1400px;
        background: #1B212C;
    }

    .scrAnalysisTb td {
        padding: 9px 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        cursor: pointer;
        /* background: #1B212C; */
        font-size: 14px;
        font-weight: 400;
        border-right: solid 1px #2A3344;
        border-bottom: solid 1px #2A3344;
    }

    .scrAnalysisTb td:last-child{
        border-right: none;
    }

    .hscWng {
        background: #2A3344;
        height: 70px;
        line-height: 20px;
        padding: 20px;
        margin-top: 10px;
        text-align: center;
        font-size: 16px;
        font-weight: 500;
        /* -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px; */
    }

    .hscWng span {
        color: #0095FF;
        font-size: 20px;
        line-height: 20px;
    }

    .hscCht {
        background: #1B212C;
        /* border: solid 1px #ddd; */
        padding: 20px;
        margin-top: 10px;
        margin-bottom: 20px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }
`;


// SOP 이력
export const SOPHistoryComponent = styled(HistorysCommon)`

    .hscSOPTb {
        display: block;
    }
    .hscSOPTb table {
    }

    .hscSOPTb tr:hover {
        background: #0095FF;

        .recentlyCheckbox:checked {
            display: inline-block;
            background: url(${ checkBox_active}) no-repeat center center !important;
            background-size: 16px auto !important;
            z-index: 1;
            border: solid 1px #1B212C !important;
        }
        .activeCheckbox:checked {
            /* background: url(${checkbox }) no-repeat center center; */
            display: inline-block;
            width: 16px;
            height: 16px;
            border-radius: 3px;
            /* background: #000000; */
            border: solid 1px #fff !important;
        }
        input[type=checkbox]:checked {
            display: inline-block;
            width: 16px;
            height: 16px;
            border-radius: 3px;
            border: solid 1px #fff;
        }
    }

    .hscSOPTb th,
    .hscSOPTb td {
        font-size: 14px;
        text-align: center;
        padding: 9px 10px;
    }

    .hscSOPTb th {
        background: ${_HistorysCommon.default.hscTbBackground};
        font-weight: 500;
        height: ${_HistorysCommon.default.hscTbThHeight};
        vertical-align: ${_HistorysCommon.default.hscTbThVerticalAlign};
        color: ${_HistorysCommon.default.hscTbThColor};
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
        align-items: center;
        border-right: solid 1px #1B212C;
    }

    .hscSOPTb th:last-child{
        border: none;
    }

    .hscSOPTb td {

    }

    .hscTb input[type="checkbox"] {
        border-color: #fff;
    }

    /* .hscSOPTb input[type="checkbox"]:checked {
        background: ${_HistorysCommon[PR.styleMode].inputCheckboxBackground};
        background-size: 14px auto !important;
    } */

    .hscSOPTb td select {
        display: inline-block;
    }

    .hscSOPTb td a {
        display: inline-block;
        /* border: solid 1px #ccc; */
        border: ${_HistorysCommon[PR.styleMode].hscTbTdABorder};
        color: ${_HistorysCommon[PR.styleMode].hscTbTdAColor};
        height: 28px;
        line-height: 26px;
        font-size: 13px;
        padding: 0 10px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    .scrSOPTb {
        overflow-x: auto;
        overflow-y: auto;
        display: block;
        height: calc(100% - 0px);
    }

    .scrSOPTb table {
        min-width: 1400px;
        background: #1B212C;
    }

    .scrSOPTb td {
        padding: 9px 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        cursor: pointer;
        /* background: #1B212C; */
        font-size: 14px;
        font-weight: 400;
        border-right: solid 1px #2A3344;
        border-bottom: solid 1px #2A3344;
    }

    .scrSOPTb td:last-child{
        border-right: none;
    }

    .selectedTr {
        border: solid;
        border-color: green;
    }

    .disasterTypeSelectTitle{
        font-size: 11px;
        color: #808080;
        background: #f5f5f5;
        position: absolute;
        left: 10px;
        top: 10px;
     }

    .disasterTypeSelect{
        display: block;
        width: 470px !important;
        height: 54px;
        border-radius: 5px;
        border: solid 1px #F5F5F5;
        background: #f5f5f5;
        padding: 10px;
        padding-top: 26px;
        font-size: 14px;
        margin-right: 20px;
    }

    .crisisStageSelectTitle{
        font-size: 11px;
        color: #808080;
        background: #f5f5f5;
        position: absolute;
        left: 10px;
        top: 10px;
    }

    .crisisStageSelect{
        display: block;
        width: 143px !important;
        height: 54px;
        border-radius: 5px;
        border: solid 1px #F5F5F5;
        /* background: #f5f5f5; */
        background: #f5f5f5 url(${SelectBoxArrowDrop}) no-repeat 92% 80%; 
        padding: 10px;
        padding-top: 26px;
        font-size: 14px;
        margin-right: 20px;
    }

    .modeSelectTitle{
        font-size: 11px;
        color: #808080;
        background: #f5f5f5;
        position: absolute;
        left: 10px;
        top: 10px;
    }

    .modeSelect{
        display: block;
        width: 143px !important;
        height: 54px;
        border-radius: 5px;
        border: solid 1px #F5F5F5;
        /* background: #f5f5f5; */
        background: #f5f5f5 url(${SelectBoxArrowDrop}) no-repeat 92% 80%;
        padding: 10px;
        padding-top: 26px;
        font-size: 14px;
        margin-right: 20px;
    }

    .writePersonTitle{
        font-size: 11px;
        color: #808080;
        background: #f5f5f5;
        position: absolute;
        left: 10px;
        top: 10px;
    }

    .writePersonInput{
        display: block;
        width: 147px !important;
        height: 54px !important;
        border-radius: 5px;
        border: solid 1px #F5F5F5;
        background: #f5f5f5;
        padding: 10px;
        padding-top: 26px;
        font-size: 14px;
        margin-right: 20px;
    }
`


// 보고서 이력
export const ReportHistoryComponent = styled(HistorysCommon)`

      .hscTb2{
        display: block;
        width: calc(100% - 0px);
        height: calc(100% - 326px);
        overflow: hidden;
      }

      .hsTbFlex{
        display: flex;
        width: 100%;
        height: 100%;
      }

      .hsTbFlex::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background-color: #0D121A;
      }
      .hsTbFlex::-webkit-scrollbar-thumb {
        width: 6px;
        background: #0095FF;
      }
      .hsTbFlex::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
      } 

     .hsTbConts{
        width: 20%;
        height: 100%;
        margin-right: 11px;
        background: #1B212C;
     }

     .hsTbConts table {
        background: #1B212C;
     }

     .hsTbConts tr:hover{
        background: #0095FF;

       .recentlyCheckbox:checked {
            display: inline-block;
            background: url(${ checkBox_active}) no-repeat center center !important;
            background-size: 16px auto !important;
            z-index: 1;
            border: solid 1px #1B212C !important;
       }
       .activeCheckbox:checked {
            /* background: url(${checkbox }) no-repeat center center; */
            display: inline-block;
            width: 16px;
            height: 16px;
            border-radius: 3px;
            /* background: #000000; */
            border: solid 1px #fff !important;
       }
       input[type=checkbox]:checked {
            display: inline-block;
            width: 16px;
            height: 16px;
            border-radius: 3px;
            border: solid 1px #fff;
       }

     }

     /* .recentlyBoxArea{

        &.on{
          background: #0095FF;
          color: #1B212C;
        }
     } */


     .hsTbConts th {
        padding: 9px 12px;
        font-size: 13px;
        text-align: center;
        background: #2A3344;
        font-weight: 500;
        border-right: solid 1px #1B212C;
        text-align: center;
     }

     .hsTbConts td {
        height: 34px;
        padding: 8px 12px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        cursor: pointer;
        /* background: #1B212C; */
        font-size: 14px;
        font-weight: 400;
        border-right: solid 1px #2A3344;
        border-bottom: solid 1px #2A3344;
        text-align: center;
     }

     .hsTbConts td:last-child{
         border-right: none;
     }

     .checkDisable{
         color: #485875;
     }

     .checkDisable input[type="checkbox"] {
        border-color: #485875;
     }
     .checkDisable input[type="checkbox"]:checked {
        background: ${_HistorysCommon[PR.styleMode].inputCheckboxBackground};
        background-size: 14px auto !important;
     } 


     .hsTbContsNum::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background-color: #0D121A;
     }
     .hsTbContsNum::-webkit-scrollbar-thumb {
        width: 6px;
        background: #0095FF;
     }
     .hsTbContsNum::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
     }

      
    .hsTbContsNum {
        /* width: calc(100% - 320px); */
        width: 100%;
        height: 100%;
        background: #1B212C;
        overflow: auto;

        .hsTbContList {

           .hsTbContListHead {
                display: flex;
                width: 100%;

                &::after {
                    content: '';
                    width: 6px;
                    height: 34px;
                    background-color: #0D121A;
                    position: absolute;
                    right: 40px;
                }

                > div {
                    display: flex;
                    justify-content: center;
                    width: 100%;
                    height: 34px;
                    line-height: 14px;
                    text-align: center;
                    font-weight: 400;
                    padding: 10px 12px;
                    font-size: 14px;
                    /* min-width: 96px; */
                    min-width: 110px;
                    background: #2A3344;

                    /* &:nth-of-type(1) {
                        width: 110px;
                    }

                    &:nth-of-type(2) {
                        width: 96px;
                    }

                    &:nth-of-type(3) {
                        width: 96px;
                    }

                    &:nth-of-type(4) {
                        width: 96px;
                    }

                    &:nth-of-type(5) {
                        width: 96px;
                    }

                    &:nth-of-type(6) {
                        width: 96px;
                    }

                    &:nth-of-type(7) {
                        width: 96px;
                    }

                    &:nth-of-type(8) {
                        width: 96px;
                    }

                    &:nth-of-type(9) {
                        width: 96px;
                    }

                    &:nth-of-type(10) {
                       width: 96px;
                    }

                    &:nth-of-type(11) {
                        width: 96px;
                    }

                    &:nth-of-type(12) {
                        width: 96px;
                    }

                    &:nth-of-type(13) {
                        width: 96px;
                    }

                    &:nth-of-type(14) {
                        width: 96px;
                    }

                    &:nth-of-type(15) {
                        width: 96px;
                    }

                    &:nth-of-type(16) {
                        width: 96px;
                    } */

                    &:not(:last-child) {
                        border-right: 1px solid ${(props) => props.theme.background};
                    }

                }
            } 

             .listText{
                 display: inline-block;
                 text-overflow: ellipsis;
                 white-space: nowrap;
                 overflow: hidden;
                 /* max-width: 80px; */
             }

             .listIcon{
                display: inline-block;
                width: 15px;
                height: 16px;
                background: url(${ list_Icon }) no-repeat;
                background-position: center;
                margin-left: 5px;
             }

            .hsTbContListBody {
                width: 100%;
                height: calc(100% - 34px);

                ${(props) => props.theme.scroll()};

                ul {
                    li {
                        display: flex;
                        height: 34px;
                        border-bottom: #2A3344;
                        cursor: pointer;
                        border-bottom: solid 1px #2A3344;

                        div {
                            text-align: center;
                            width: 100%;
                            height: 34px;
                            padding: 10px 12px;
                            /* min-width: 96px; */
                            min-width: 110px;
                            font-size: 14px;
                            font-weight: 400;
                            position: relative;
                            background: #1B212C;
                            border-bottom: solid 1px #2A3344;

                            /* &:nth-of-type(1) {
                                width: 110px;
                            }

                            &:nth-of-type(2) {
                                width: 96px;
                            }

                            &:nth-of-type(3) {
                                width: 96px;
                            }

                            &:nth-of-type(4) {
                                width: 96px;
                            }

                            &:nth-of-type(5) {
                                width: 96px;
                            }

                            &:nth-of-type(6) {
                                width: 96px;
                            }

                            &:nth-of-type(7) {
                                width: 96px;
                            }

                            &:nth-of-type(8) {
                                width: 96px;
                            }

                            &:nth-of-type(9) {
                                width: 96px;
                            }

                            &:nth-of-type(10) {
                                width: 96px;
                            }

                            &:nth-of-type(11) {
                                width: 96px;
                            }

                            &:nth-of-type(12) {
                                width: 96px;
                            }

                            &:nth-of-type(13) {
                                width: 96px;
                            }

                            &:nth-of-type(14) {
                                width: 96px;
                            }

                            &:nth-of-type(15) {
                                width: 96px;
                            }

                            &:nth-of-type(16) {
                                width: 96px;
                            } */
                        }
                        div > p {
                            display: inline-block;
                            font-size: 14px;
                            font-weight: 400;
                            position: absolute;
                            left: 0;
                            top: 2px;
                        }
                    }
                }
            }
        }

     .hsTbContsNone{
         display: block;
         width: 100%;
         height: 684px;
     }

     .hsTbContsNone > span{
         display: block;
         height: 34px;
         background: #2A3344;
     }

     .hsTbContsNone > div{
         display: block;
         width: 100%;
         height: 100%;
         background: #1B212C;
         text-align: center;
         padding-top: 340px;
         font-size: 14px;
         font-weight: 400;
         color: #7C8DA9;
     }

     .locationSelectTitle{
        font-size: 11px;
        color: #808080;
        background: #f5f5f5;
        position: absolute;
        left: 10px;
        top: 10px;
     }
     .locationSelect{
        display: block;
        width: 470px !important;
        height: 54px;
        border-radius: 5px;
        border: solid 1px #F5F5F5;
        /* background: #f5f5f5; */
        background: #f5f5f5 url(${SelectBoxArrowDrop}) no-repeat 92% 80%;
        padding: 10px;
        padding-top: 26px;
        font-size: 14px;
        margin-right: 20px;
     }

    .InquiryPeriodSelectTitle{
        font-size: 11px;
        color: #808080;
        background: #f5f5f5;
        position: absolute;
        left: 10px;
        top: 10px;
     } 
    }
`;


// 통계 이력
export const StatisticsHistoryComponent = styled(HistorysCommon)`

     .hscTb{
        display: block;
        width: 100%;
        height: 100%;
     }

     .hsGraphConts{
        display: block;
        width: 100%;
        height: calc(100vh - 400px);
        background: #1B212C;
        padding: 16px;
     }

     .hsGraphBox{
        display: inline-block;
        width: 372px;
        /* height: calc(100% - 280px); */
        height: 49%;
        padding: 10px;
        margin-right: 10px;
        margin-bottom: 10px;
        background: #222A38;
     }

     .hsGraphTitle{
        display: block;
        font-size: 14px;
        font-weight: 700;
        line-height: 14px;
        color: #0095FF;
        margin-bottom: 20px;
     }

     .hsGraphArea{
        display: block;
        height: 90%;
     }

     .hsLocationdGraphArea{
        display: block;
        height: 90%;
        margin-right: 6px;
     }
`;

