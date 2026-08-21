import styled from "styled-components";
import PR from "../../Root/resource/id";

import "../../Common/css/commonWonik.scss";

import history_menu_arrow from "../../Common/img/sub/history_menu_arrow.png";
import history_menu_arrow_on from "../../Common/img/sub/history_menu_arrow_on.png";
import history_select from "../../Common/img/sub/history_select.png";
import dashboard_calendar_bk from "../../Common/img/sub/dashboard_calendar_bk.png";
import dashboard_calendar from "../../Common/img/sub/dashboard_calendar.png";
import checkbox from "../../Common/img/common/checkbox.png";
import paging_first from "../../Common/img/common/paging_first.png";
import paging_prev from "../../Common/img/common/paging_prev.png";
import paging_next from "../../Common/img/common/paging_next.png";
import paging_last from "../../Common/img/common/paging_last.png";
import paging_first_disable from "../../Common/img/common/paging_first_disable.png";
import paging_prev_disable from "../../Common/img/common/paging_prev_disable.png";
import paging_next_disable from "../../Common/img/common/paging_next_disable.png";
import paging_last_disable from "../../Common/img/common/paging_last_disable.png";
import historyMemoOn from "../../Common/img/common/historyMemoOn.png";
import historyMemoIcon from "../../Common/img/common/historyMemoIcon.png";
import close_icon from "../../Common/img/common/close_icon.png";
import search_icon from "../../Common/image/icon/search_icon.png";
import left_btn_on from "../../Common/image/icon/left_btn_on.png";
import left_btn_off from "../../Common/image/icon/left_btn_off.png";
import SelectBoxArrowDrop from '../../Common/img/imghydrogen/selectBoxArrowDrop.png';
import SelectOptionActive from '../../Common/img/imghydrogen/selectOption_active.png';
import FileDownIconImage from '../../Common/img/imghydrogen/fileDownlcon.png';
import PageArrowLeft from '../../Common/img/imghydrogen/pageArrowLeft.png';
import PageArrowRight from '../../Common/img/imghydrogen/pageArrowRight.png';

import TitleBarIcon from '../../Common/img/imghydrogen/H_titleBarIcon.png';

/**********************************************************************/
// 이력 공통 CSS

export const _HistorysCommon = {
    soulbrain: {
        hslMenuLiOnBackground: '#131d24',
        hslMenuLiOnColor: '#fff',
        inputRadioCheckedBackground: '#1b55e2',
        inputCheckboxBackground: `#ff8400 url(${checkbox}) no-repeat center center`,
        hscsSbmtBackground: '#131d24',
        hscsSbmtHoverBackground: '#0c1216',
        btnCalendarBkWidth: '17px',
        hsContBackColor: '#f5f5f5',
        hscSchBorder: 'solid 1px #ddd',
        hscTbBorder: 'solid 1px #ddd',
        hscSchDlWidth: '100%',
        hscsDateDatepickerBorder: 'solid 1px #ddd',
        hscsDateMarginRight: '40px',
        hsLftWidth: '200px',
        hsScrMarginLeft: '200px',
        hscsSbmtWidth: '100px',
        hscsSbmtTop: '20px',
        hscTbBackground: '#f5f5f5',
        hscTbTdBorderBottom: 'solid 1px #ddd',
        hscExlLiABorder: 'solid 1px #ccc',
        hscExlLiABackground: '#FFF',
        hscExlLiAPadding: '0px 15px',
        hscExlLiAExlBackground: '#1F7244',
        hscExlLiAExlColor: '#fff',
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
        hscNavUlLiOnColor: '#3B83F4',
        hscNavUlLiAfterBackColor: '#e2e2e2',
        hscNavMarginTop: '20px',
        selWhHeight: '32px',
        hscsHalfLiWidth: '25%',
        selWhBorderColor: '#ddd',
        selWhBackground: `url(${history_select}) no-repeat`,
        hscsHalfPaddingRight: '200px',
        hscsHalfMarginBottom: '10px',
        hscSchDlMarginTop: '10px',
        hscsRdoPaddingTop: '7px',
        hscsHalfLiInputBorder: 'solid 1px #ddd',
        hsLftTop: '50px',
        hscTbTdABorder: 'solid 1px #ccc',
    },
    Wonik: {
        hslMenuLiOnBackground: 'var(--title-bar-text-blue-color)',
        hslMenuLiOnColor: '#fff',
        inputRadioCheckedBackground: 'var(--title-bar-text-blue-color)',
        inputCheckboxBackground: `var(--title-bar-text-blue-color) url(${checkbox}) no-repeat center center`,
        hscsSbmtBackground: 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box',
        hscsSbmtHoverBackground: 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box',
        btnCalendarBkWidth: '19px',
        hsContBackColor: '#f5f5f5',
        hscSchBorder: 'solid 1px #ddd',
        hscTbBorder: 'solid 1px #ddd',
        hscSchDlWidth: '100%',
        hscsDateDatepickerBorder: 'solid 1px #ddd',
        hscsDateMarginRight: '40px',
        hsLftWidth: '200px',
        hsScrMarginLeft: '200px',
        hscsSbmtWidth: '100px',
        hscsSbmtTop: '20px',
        hscTbBackground: '#f5f5f5',
        hscTbTdBorderBottom: 'solid 1px #ddd',
        hscExlLiABorder: 'solid 1px #ccc',
        hscExlLiABackground: '#FFF',
        hscExlLiAPadding: '0px 15px',
        hscExlLiAExlBackground: '#1F7244',
        hscExlLiAExlColor: '#fff',
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
        hscNavUlLiOnColor: '#3B83F4',
        hscNavUlLiAfterBackColor: '#e2e2e2',
        hscNavMarginTop: '20px',
        selWhHeight: '32px',
        hscsHalfLiWidth: '25%',
        selWhBorderColor: '#ddd',
        selWhBackground: `url(${history_select}) no-repeat`,
        hscsHalfPaddingRight: '200px',
        hscsHalfMarginBottom: '10px',
        hscSchDlMarginTop: '10px',
        hscsRdoPaddingTop: '7px',
        hscsHalfLiInputBorder: 'solid 1px #ddd',
        hsLftTop: '50px',
        hscTbTdABorder: 'solid 1px #ccc',
    },
    Hydrogen: {
        hslMenuLiOnBackground: '#F5F5F5',
        hslMenuLiOnColor: '#00AFFF',
        inputRadioCheckedBackground: 'var(--title-bar-text-blue-color)',
        inputCheckboxBackground: `var(--title-bar-text-blue-color) url(${checkbox}) no-repeat center center`,
        hscsSbmtBackground: '#244554',
        hscsSbmtHoverBackground: '#244554',
        btnCalendarBkWidth: '19px',
        hsContBackColor: '#ffffff',
        hscSchBorder: 'none',
        hscTbBorder: 'none',
        hsLftBackColor: '#F5F5F5',
        hscSchDisplay: 'flex',
        hscSchDlWidth: 'auto',
        hscsDateDisplay: 'flex',
        hscsDateDatepickerBorder: 'none',
        hscsDateBorder: 'solid 1px #f5f5f5',
        hscsDatePaddingTop: '20px',
        hscsDateBorderRadius: '5px',
        hscsDateBackground: '#f5f5f5',
        hscsDateDatepickerBackColor: '#f5f5f5',
        hscsDateMarginRight: '20px',
        hsLftWidth: '280px',
        hsScrMarginLeft: '280px',
        hscsSbmtWidth: '55px',
        hscsSbmtHeight: '55px',
        hscsSbmtTop: '20px',
        hscTbBackground: '#244554',
        hscTbThHeight: '48px',
        hscTbThVerticalAlign: 'middle',
        hscTbThColor: '#FFF',
        hscTbThFontSize: '14px',
        hscTbTdBorderBottom: 'solid 1px #f5f5f5',
        hscExlLiABorder: 'none',
        hscExlLiABackground: `url(${FileDownIconImage}) no-repeat -5% center`,
        hscExlLiAPadding: '0px 20px',
        hscExlLiAExlBackground: `url(${FileDownIconImage}) no-repeat -5% center`,
        hscExlLiAExlColor: '#000000',
        hscNavAPrevDisable: `url(${PageArrowLeft}) no-repeat center center`,
        hscNavANextDisable: `url(${PageArrowRight}) no-repeat center center`,
        hscNavAPrev: `url(${PageArrowLeft}) no-repeat center center`,
        hscNavANext: `url(${PageArrowRight}) no-repeat center center`,
        hscExlLiAHeight: '16px',
        hscExlLiALineHeight: '14px',
        hscTbPadding: '17px 20px 0px 20px',
        hscTbMarginTop: '0px',
        hscNavABackground: 'none',
        hscNavABorder: 'none',
        hscNavABorderRadius: '5px',
        hscNavAMargin: '5px',
        hscNavUlLiBackColor: 'none',
        hscNavUlLiOnBackColor: '#244554',
        hscNavUlLiOnBorderRadius: '5px',
        hscNavUlLiOnColor: '#FFF',
        hscNavUlLiAfterBackColor: 'none',
        hscNavMarginTop: '104px',
        selWhHeight: '54px',
        selWhWidth: '100%',
        hscsHalfLiWidth: 'auto',
        selWhBorderColor: '#00AFFF',
        selWhBackground: `#F5F5F5 url(${history_select}) no-repeat`,
        hscsHalfDisplay: 'flex',
        hscsHalfPaddingRight: '0px',
        hscsHalfMarginBottom: '0px',
        hscSchDlMarginTop: '0px',
        hscsRdoPaddingTop: '0px',
        hsContMarginTop: '90px',
        hslMenuLiAFontWeight: '600',
        hscsHalfLiInputBorder: 'none',
        hsLftTop: '60px',
        hscTbTdABorder: 'solid 1px #00AFFF',
        hscTbTdAColor: '#00AFFF',
    },
    Gyeonggi: {
        hslMenuLiOnBackground: 'var(--title-bar-text-blue-color)',
        hslMenuLiOnColor: '#fff',
        inputRadioCheckedBackground: 'var(--title-bar-text-blue-color)',
        inputCheckboxBackground: `var(--title-bar-text-blue-color) url(${checkbox}) no-repeat center center`,
        hscsSbmtBackground: 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box',
        hscsSbmtHoverBackground: 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box',
        btnCalendarBkWidth: '19px',
        hsContBackColor: '#f5f5f5',
        hscSchBorder: 'solid 1px #ddd',
        hscTbBorder: 'solid 1px #ddd',
        hscSchDlWidth: '100%',
        hscsDateDatepickerBorder: 'solid 1px #ddd',
        hscsDateMarginRight: '40px',
        hsLftWidth: '200px',
        hsScrMarginLeft: '200px',
        hscsSbmtWidth: '100px',
        hscsSbmtTop: '20px',
        hscTbBackground: '#f5f5f5',
        hscTbTdBorderBottom: 'solid 1px #ddd',
        hscExlLiABorder: 'solid 1px #ccc',
        hscExlLiABackground: '#FFF',
        hscExlLiAPadding: '0px 15px',
        hscExlLiAExlBackground: '#1F7244',
        hscExlLiAExlColor: '#fff',
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
        hscNavUlLiOnColor: '#3B83F4',
        hscNavUlLiAfterBackColor: '#e2e2e2',
        hscNavMarginTop: '20px',
        selWhHeight: '32px',
        hscsHalfLiWidth: '25%',
        selWhBorderColor: '#ddd',
        selWhBackground: `url(${history_select}) no-repeat`,
        hscsHalfPaddingRight: '200px',
        hscsHalfMarginBottom: '10px',
        hscSchDlMarginTop: '10px',
        hscsRdoPaddingTop: '7px',
        hscsHalfLiInputBorder: 'solid 1px #ddd',
        hsLftTop: '50px',
        hscTbTdABorder: 'solid 1px #ccc',
    }
}

export const HistorysCommon = styled.div`
    height: 100vh;
    margin: 0;
    padding: 0;
    background-color: #ffffff;

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
        background: url(${TitleBarIcon})no-repeat 10% center;
        margin-left: 10px;
    }


    #hsLft {
        position: fixed;
        left: 0; /*top: 90px;*/
        /* top: 50px; */
        top: ${_HistorysCommon[PR.styleMode].hsLftTop};
        bottom: 0;
        width: ${_HistorysCommon[PR.styleMode].hsLftWidth};
        border-right: solid 1px #ddd;
        background: ${_HistorysCommon[PR.styleMode].hsLftBackColor};
    }

    .hslMenu {
    }

    .hslMenu li {
        border-bottom: solid 1px #eaeaea;
        cursor: pointer;
    }

    .hslMenu li a {
        display: block;
        height: 49px;
        line-height: 49px;
        padding: 0 15px;
        position: relative;
        font-size: 14px;
        font-weigth: ${_HistorysCommon[PR.styleMode].hslMenuLiAFontWeight};
    }

    .hslMenu li a.on {
        background: ${_HistorysCommon[PR.styleMode].hslMenuLiOnBackground}; 
        color: ${_HistorysCommon[PR.styleMode].hslMenuLiOnColor};
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
        overflow: auto;
        height: 100vh;
        margin-left: ${_HistorysCommon[PR.styleMode].hsScrMarginLeft};
    }

    #hsCont {
        background: ${_HistorysCommon[PR.styleMode].hsContBackColor};
        padding: 20px 15px 60px;
        min-width: 1200px;
        margin-top: ${_HistorysCommon[PR.styleMode].hsContMarginTop};
    }

    .hscSch {
        background: #fff;
        border: ${_HistorysCommon[PR.styleMode].hscSchBorder};
        padding: 20px;
        padding-right: 140px;
        position: relative;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        display: ${_HistorysCommon[PR.styleMode].hscSchDisplay};
    }

    .hscSch dl {
        display: table;
        width: ${_HistorysCommon[PR.styleMode].hscSchDlWidth};
        /* margin-top: 10px; */
        margin-top: ${_HistorysCommon[PR.styleMode].hscSchDlMarginTop};
    }

    .hscSch dl:first-child {
        margin-top: 0;
    }

    .hscSch dl dt {
        display: table-cell;
        vertical-align: middle;
        width: 120px;
        font-size: 15px;
        font-weight: 500;
    }

    .hscSch dl dd {
        display: table-cell;
        vertical-align: middle;

        position: relative;
    }

    .hscSch dl dd:after {
        content: "";
        display: table;
        clear: both;
    }

    .hscSch dl dd input[type="text"] {
        display: block;
        width: 38%;
        border: ${_HistorysCommon[PR.styleMode].hscsHalfLiInputBorder};
        height: 32px;
        font-size: 13px;
        padding-left: 10px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    .hscsRdo {
        float: left;
        /* padding-top: 7px; */
        padding-top: ${_HistorysCommon[PR.styleMode].hscsRdoPaddingTop};
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
        color: #222;
    }

    .hscsRdo input[type="radio"]:checked:after {
        content: "";
        display: block;
        background: ${_HistorysCommon[PR.styleMode].inputRadioCheckedBackground};
        position: absolute;
        left: 4px;
        right: 4px;
        top: 4px;
        bottom: 4px;
        border-radius: 50%;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
    }

    /* hydrogen */
    .sensorTypeSelectTitle{
        font-size: 11px;
        color: #808080;
        background: #f5f5f5;
        position: absolute;
        left: 10px;
        top: 10px;
    }

    .sensorTypeSelect{
        display: block;
        width: 470px;
        height: 54px;
        border-radius: 5px;
        border: solid 1px #F5F5F5;
        background: #f5f5f5;
        padding: 10px;
        padding-top: 26px;
        font-size: 14px;
        margin-right: 20px; 
    }
 
    .selectBoxArrowDrop{
        display: inline-block;
        width: 18px;
        height: 18px;
        background: url(${SelectBoxArrowDrop}) no-repeat;
        position: absolute;
        right: 30px;
        bottom: 10px;
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
        width: 170px;
        margin-right: 10px;
    }

    .hscsLoc li:last-child {
        margin-right: 0;
    }

    .hscsLoc li select {
        width: 100%;
    }

    /* hydrogen */
    .locationTypeSelectTitle{
        font-size: 11px;
        color: #808080;
        background: #f5f5f5;
        position: absolute;
        left: 10px;
        top: 10px;
    }
    .sensorDetectHSelect{
       display: block;
       width: 470px;
       height: 54px;
       border-radius: 5px;
       border: solid 1px #f5f5f5;
       background: #f5f5f5;
       padding: 10px;
       padding-top: 26px;
       font-size: 14px;
       margin-right: 20px;

       #select0::after {
        content: '';
        display: inline-block;
        background: url(${SelectOptionActive}) no-repeat center center;
        width: 10px;
        height: 10px;
        margin: 0 10px;
        position: relative;
        top: 1px;
       }

       #select1::after {
        content: '';
        display: inline-block;
        background: url(${SelectOptionActive}) no-repeat center center;
        width: 10px;
        height: 10px;
        margin: 0 10px;
        position: relative;
        top: 1px;
       }
    }
    .sensorDetectOptionBox{
       display: flex;
       width: 470px;
       height: 323px;
       background: #f5f5f5;
       border-radius: 5px;
       border: solid 1px #00AFFF;
       margin-top: 4px;
       /* padding: 14px 20px; */
       position: absolute;
       z-index: 1;
    }
    .sensorDetectFirstOption{
       display: inline-block;
       width: 156.5px;
       height: 300px;
       border-right: dashed 1px #CBCBCB;
       margin: 10px 0px;
       overflow: auto;
    }
    .sensorDetectFirstOption span{
       display: block;
       color: #575757;
       height: 32.3px;
       line-height: 32.3px;
       padding-left: 20px;
    }
    .sensorDetectFirstOption span:hover{
       color: #00AFFF;
       background: #ECECEC url(${SelectOptionActive}) no-repeat 96% 50%;
    }
    .sensorDetectSecondOption{
       display: inline-block;
       width: 156.5px;
       height: 300px;
       margin: 10px 0px;
       overflow: auto;
       border-right: dashed 1px #CBCBCB;
    }
    .sensorDetectSecondOption span{
       display: block;
       color: #575757;
       height: 32.3px;
       line-height: 32.3px;
       padding-left: 20px;
       padding-right: 10px;
       white-space: nowrap;
       overflow: hidden;
       text-overflow: ellipsis;

    }
    .sensorDetectThirdOption{
       display: inline-block;
       width: 156.5px;
       height: 300px;
       margin: 10px 0px;
       margin-right: 4px;
       overflow: auto;
    }
    .sensorDetectThirdOption span{
       display: block;
       color: #575757;
       height: 32.3px;
       line-height: 32.3px;
       padding-left: 20px;
       padding-right: 10px;
       white-space: nowrap;
       overflow: hidden;
       text-overflow: ellipsis;
    }
    .activeOption1: hover{
       color: #00AFFF;
       background: #ECECEC url(${SelectOptionActive}) no-repeat 96% 50%;
    }

    .activeOption1Active{
       color: #00AFFF !important;
       background: #ECECEC url(${SelectOptionActive}) no-repeat 96% 50% !important;
    }

    .activeOption2: hover{
       color: #00AFFF;
       background: #ECECEC url(${SelectOptionActive}) no-repeat 96% 50%;
    }

    .activeOption2Active{
       color: #00AFFF !important;
       background: #ECECEC url(${SelectOptionActive}) no-repeat 96% 50% !important;
    }

    .activeOption3: hover{
       color: #00AFFF;
       background: #ECECEC url(${SelectOptionActive}) no-repeat 96% 50%;
    }

    .activeOption3Active{
       color: #00AFFF !important;
       background: #ECECEC url(${SelectOptionActive}) no-repeat 96% 50% !important;
    }


    .selWh {
        display: block;
        height: 32px;
        /* width: ${_HistorysCommon[PR.styleMode].selWhWidth}; */
        /* height: ${_HistorysCommon[PR.styleMode].selWhHeight}; */
        border-color: #ddd;
        /* border-color: ${_HistorysCommon[PR.styleMode].selWhBorderColor}; */
        font-size: 13px;
        padding-right: 22px;
        background: url(${history_select}) no-repeat;
        /* background: ${_HistorysCommon[PR.styleMode].selWhBackground}; */
        background-position: right 8px center;
        border: solid 1px #ddd;
        border-radius: 4px;
        padding-left: 10px;
    }
        
    .subjectEvaluation{
        width: 120px;
        font-size: 15px;
        font-weight: 500;
    }

    .hscsDate {
        float: left;
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

    .hscsDate .datepicker {
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
    }

    .hscsDate .datepicker {
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
       /* padding: 14px 20px; */
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
        height: 17px;
        display: inline-block;
        z-index: 1;
        position: absolute;
        right: 10px;
        top: 8px;
        cursor: pointer;
    }

    .hscsSbmt {
        display: block;
        width: ${_HistorysCommon[PR.styleMode].hscsSbmtWidth};
        height: ${_HistorysCommon[PR.styleMode].hscsSbmtHeight};
        background: ${_HistorysCommon[PR.styleMode].hscsSbmtBackground};
        color: #fff;
        position: absolute;
        /* top: 20px; */
        top: ${_HistorysCommon[PR.styleMode].hscsSbmtTop};
        right: 20px;
        bottom: 20px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        cursor: pointer;
    }

    .hscsSbmt > span {
        display: table;
        width: 100%;
        height: 100%;
    }

    .hscsSbmt > span > span {
        display: table-cell;
        width: 100%;
        vertical-align: middle;
        text-align: center;
        color: #fff;
        font-size: 16px;
    }

    .hscsSbmt > span > span:hover {
        background: ${_HistorysCommon[PR.styleMode].hscsSbmtHoverBackground};
        border-radius: 4px;
    } /*0720 수정*/

    #hscsSbmting {
        cursor: wait;
    }

    .hscExl {
        text-align: right;
        margin-top: 20px;
    }

    .hscExl li {
        display: inline-block;
        margin-right: 5px;
    } /*0720 수정*/

    .hscExl li a {
        display: block;
        /* height: 32px;
        line-height: 30px; */
        height: ${_HistorysCommon[PR.styleMode].hscExlLiAHeight};
        line-height: ${_HistorysCommon[PR.styleMode].hscExlLiALineHeight};
        border: ${_HistorysCommon[PR.styleMode].hscExlLiABorder};
        background: ${_HistorysCommon[PR.styleMode].hscExlLiABackground};
        padding: ${_HistorysCommon[PR.styleMode].hscExlLiAPadding};
        text-align: center;
        font-size: 13px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        cursor: pointer;
    }

    .hscExl .report {
        margin-right: 25px;
    }

    .hscExl .report a {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        position: relative;
    }

    .hscExl .report a::after {
        content: '';
        display: inline-block;
        width: 1px;
        height: 20px;
        background-color: #ccc;
        position: absolute;
        right: -14px;
    }

    .hscExl li a.exl {
        /* background: #1f7244; */
        background: ${_HistorysCommon[PR.styleMode].hscExlLiAExlBackground};
        border-color: #1f7244;
        /* color: #fff; */
        color: ${_HistorysCommon[PR.styleMode].hscExlLiAExlColor};
    }

    .hscTb {
        background: #fff;
        /* border: solid 1px #ddd; */
        border: ${_HistorysCommon[PR.styleMode].hscTbBorder};
        /* padding: 30px 20px;
        margin-top: 10px; */
        padding: ${_HistorysCommon[PR.styleMode].hscTbPadding};
        margin-top: ${_HistorysCommon[PR.styleMode].hscTbMarginTop};
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    .hscTb table {
        border-top: solid 2px #333;
    }

    .hscTb tr:hover {
        background: #fafafa;
    }

    .hscTb th,
    .hscTb td {
        padding: 5px;
        /* border-bottom: solid 1px #ddd; */
        border-bottom: ${_HistorysCommon[PR.styleMode].hscTbTdBorderBottom};
        font-size: 13px;
        text-align: center;
    }

    .hscTb th {
        /* background: #f5f5f5; */
        background: ${_HistorysCommon[PR.styleMode].hscTbBackground};
        font-weight: 500;
        /* height: 48px;
        vertical-align: middle;
        color: #FFF;
        font-size: 14px; */
        height: ${_HistorysCommon[PR.styleMode].hscTbThHeight};
        vertical-align: ${_HistorysCommon[PR.styleMode].hscTbThVerticalAlign};
        color: ${_HistorysCommon[PR.styleMode].hscTbThColor};
        font-size: ${_HistorysCommon[PR.styleMode].hscTbThFontSize};
    }

    .hscTb td {
        padding: 10px 5px;
    }

    .hscTb input[type="checkbox"] {
        background: #fff;
        border-color: #bbb;
    }

    .hscTb input[type="checkbox"]:checked {
        background: ${_HistorysCommon[PR.styleMode].inputCheckboxBackground};
        background-size: 14px auto !important;
    } /*0730 수정*/

    .hscTb td select {
        display: inline-block;
    }

    .hscTb td a {
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

    .scrTb {
        overflow-x: auto;
    }

    .scrTb table {
        min-width: 1400px;
    }

    .scrTb td {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        cursor: pointer;
    } /*0720 수정*/

    .hscNav {
        text-align: center;
        /* margin-top: 20px; */
        margin-top: ${_HistorysCommon[PR.styleMode].hscNavMarginTop};
    }

    .hscNav a {
        display: inline-block;
        vertical-align: middle;
        width: 28px;
        height: 28px;
        line-height: 26px;
        /* background: #fff; */
        background: ${_HistorysCommon[PR.styleMode].hscNavABackground};
        /* border: solid 1px #ccc; */
        border: ${_HistorysCommon[PR.styleMode].hscNavABorder};
        border-radius: ${_HistorysCommon[PR.styleMode].hscNavABorderRadius};
        position: relative;
        font-family: "Roboto", sans-serif;
        color: #999;
        font-size: 13px;
        margin: ${_HistorysCommon[PR.styleMode].hscNavAMargin};
        user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;  
    }

    .hscNav > a {
        text-indent: -9999px;
    }

    .hscNav a.first {
        background: url(${paging_first}) no-repeat center center;
        cursor: pointer;
    }

    .hscNav a.prev {
        /* background: url(${paging_prev}) no-repeat center center; */
        background: ${_HistorysCommon[PR.styleMode].hscNavAPrev};
        cursor: pointer;
    }

    .hscNav a.next {
        /* background: url(${paging_next}) no-repeat center center; */
        background: ${_HistorysCommon[PR.styleMode].hscNavANext};
        cursor: pointer;
    }

    .hscNav a.last {
        background: url(${paging_last}) no-repeat center center;
        cursor: pointer;
    }

    .hscNav a.firstDisable {
        background: url(${paging_first_disable}) no-repeat center center;
    }

    .hscNav a.prevDisable {
        /* background: url(${paging_prev_disable}) no-repeat center center; */
           background: ${_HistorysCommon[PR.styleMode].hscNavAPrevDisable};
    }
    .hscNav a.nextDisable {
        /* background: url(${paging_next_disable}) no-repeat center center; */
           background: ${_HistorysCommon[PR.styleMode].hscNavANextDisable};
    }

    .hscNav a.lastDisable {
        background: url(${paging_last_disable}) no-repeat center center;
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
    }

    .hscNav ul li.on a {
        font-weight: 700;
        /* color: #3b83f4; */
        color: ${_HistorysCommon[PR.styleMode].hscNavUlLiOnColor};
        background: ${_HistorysCommon[PR.styleMode].hscNavUlLiOnBackColor};
        border-radius: ${_HistorysCommon[PR.styleMode].hscNavUlLiOnBorderRadius};
    }

    .hscsHalf {
        /* margin-bottom: 10px; */
        margin-bottom: ${_HistorysCommon[PR.styleMode].hscsHalfMarginBottom};
        /* padding-right: 200px; */
        padding-right: ${_HistorysCommon[PR.styleMode].hscsHalfPaddingRight};
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
        width: 100px;
    }

    .hscsHalf > li:first-child dl dt {
        text-align: left;
        width: 120px;
    }

    .hscsHalf > li input[type="text"] {
        display: block;
        width: 100%;
        /* border: solid 1px #ddd; */
        border: ${_HistorysCommon[PR.styleMode].hscsHalfLiInputBorder};
        height: 32px;
        font-size: 13px;
        padding-left: 10px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
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
        border: solid 1px #ddd;
        height: 32px;
        font-size: 13px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }
`;


// 센서 탐지 이력
export const SensorDetectHistoryComponent = styled(HistorysCommon)`

    .HisMemoOn {
        display: block;
        height: 20px;
        width: 40px;
        background: url(${historyMemoOn}) no-repeat;
        background-position: 50%;
        background-position-y: 1px;
        background-size: 28px;
        height: 20px;
        width: 40px;
        margin: 0 auto;
    }

    .HisMemoOff {
        display: block;
        height: 20px;
        width: 40px;
        background: url(${historyMemoIcon}) no-repeat;
        background-position: 50%;
        background-position-y: 1px;
        background-size: 28px;
        height: 20px;
        width: 40px;
        margin: 0 auto;
    }
`;


// 센서 탐지 분석
export const SensorDetectAnalysisComponent = styled(HistorysCommon)`

    .hscWng {
        background: #fff;
        border: solid 1px #ddd;
        padding: 20px;
        margin-top: 10px;
        text-align: center;
        font-size: 16px;
        font-weight: 500;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    .hscWng span {
        color: #ff8400;
        font-size: 18px;
    }

    .hscCht {
        background: #fff;
        border: solid 1px #ddd;
        padding: 20px;
        margin-top: 10px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    .hscCht > div {
        padding: 100px;
        text-align: center;
    }
`;


// SOP 이력
export const SOPHistoryComponent = styled(HistorysCommon)`

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


// 데이터 수정 이력
export const UserHistoryComponent = styled(HistorysCommon)`
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

`;


// 데이터 수정 이력
export const SpreadHistoryComponent = styled(HistorysCommon)`
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



`;



// 안전구역 평가 이력
export const SafetyAreaHistoryComponent = styled(HistorysCommon)`

    .managerArea {
        ${props => props.theme.variables.flex('flex-start', 'center')};
        width: 300px !important;
        margin-left: 20px;

        .managerInput {
            width: 170px;
            margin-right: 10px;
            height: 32px;
            border-color: #ddd;
            font-size: 13px;
            margin-left: 20px;
            border-radius: 3px;
        }
    }

    .hscTb td {
        padding: 9px 5px;
    }

    .detailBtn {
        width: 64px;
        height: 28px;
        border: 1px solid #DDDDDD;
        border-radius: 4px;
        font-size: 13px;
    }

`;


// 안전구역 평가 이력 상세정보 팝업
export const SafetyAreaHistoryPopupComponent = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    width: 800px;
    height: 590px;
    background: #FFFFFF 0% 0% no-repeat padding-box;
    box-shadow: 0px 5px 10px #00000012;
    border-radius: 5px;
    padding: 20px 0;
    overflow: hidden;

    header {
        ${props => props.theme.variables.flex()};
        border-bottom: 1px solid #EAEAEA;
        padding: 0 23px 20px 23px;

        div:first-child {
            width: 290px;
            ${props => props.theme.variables.flex()};

            h1 {
                font-size: 22px;
                font-weight: bold;
            }

            button {
                width: 98px;
                height: 32px;
                background: #1F7244;
                border-radius: 4px;
                font-size: 13px;
                line-height: 13px;
                color: var(--white-color);
            }
        }

        div:last-child {
            .close {
                display: inline-block;
                width: 14px;
                margin-left: 15px;
                text-indent: -9999px;
                background: url(${close_icon}) no-repeat center center;
                cursor: pointer;
            }
        }
    }

    section {
        ${props => props.theme.variables.flex('flex-start', 'flex-start')};
        font-size: 14px;
        padding-right: 10px;

        aside {
            width: 196px;
            border-right: 1px solid #EEEEEE;
            height: 100%;

            ul {
                height: 100%;

                li {
                    cursor: pointer;
                    width: 100%;
                    height: 40px;
                    border-bottom: 1px solid #EEEEEE;
                    line-height: 40px;
                    padding-left: 40px;

                    &::before {
                        content: '';
                        display: inline-block;
                        background: url(${left_btn_off}) no-repeat;
                        width: 5px;
                        height: 8px;
                        position: relative;
                        right: -133px;
                        top: -2px;
                    }
                }

                li.on {
                    background-color: #5398FF;
                    color: #FFFFFF;
                    
                    &::before {
                        content: '';
                        display: inline-block;
                        background: url(${left_btn_on}) no-repeat;
                        width: 5px;
                        height: 8px;
                        position: relative;
                        right: -133px;
                        top: -2px;
                    }
                }
            }

            .search-area {
                margin-top: 20px;
                text-align: center;
                height: 257px;
                
                input[type="text"] {
                    width: 156px;
                    height: 32px;
                    padding-right: 32px;
                    border: 1px solid #DDDDDD;
                    position: relative;
                    left: 8px;
                } 

                a {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    background: url(${search_icon}) no-repeat;
                    text-indent: -9999px;
                    position: relative;
                    top: 0;
                    right: 15px;
                    cursor: pointer;
                }
            }
        }

        .content-wrap {
            margin: 20px 0;
            padding: 0 20px;
            width: 594px;
            height: 477px;

            > div:not(:first-child) {
                margin-top: 40px;
            }

            .user-info {
                ${props => props.theme.variables.flex('flex-start', 'center')};
                gap: 10px;
                margin-bottom: 20px;

                img {
                    width: 48px;
                    height: 48px;
                }

                ul {
                    > li:first-child {
                        margin-bottom: 6px;
                    }

                    > li:last-child {
                        font-weight: bold;
                    }

                    .grade-wrap {
                        
                        ${props => props.theme.variables.flex('flex-start', 'center')};
                        gap: 20px;

                        .chart img {
                            width: 360px;
                            height: 10px;
                        }
                    }
                }
            }

            .scroe-info {
                /* margin-bottom: 922px; */

                .scoreZoneBox{
                     display: block;
                }
                .scoreZoneBox > div{
                     display: flex;
                     align-items: center;
                     height: 36px;
                     background: #EEEEEE;
                     padding: 10px;
                     font-size: 14px;
                     font-weight: 500;
                }
                .scoreZoneBox > div > span{
                     display: inline-block;
                     width: 4px;
                     height: 8px;
                     background: #000000;
                     margin-right: 6px;
                }
                ul {
                     padding: 10px 0px;

                    li {
                        ${props => props.theme.variables.flex()};
                        /* margin-bottom: 20px; */
                        font-size: 14px;
                        font-weight: 300;
                    }
                }

                .scoreFacilityBox{
                     display: block;
                }
                .scoreFacilityBox > div{
                     display: flex;
                     align-items: center;
                     height: 36px;
                     background: #EEEEEE;
                     padding: 10px;
                     font-size: 14px;
                     font-weight: 500;
                }
                .scoreFacilityBox > div > span{
                     display: inline-block;
                     width: 4px;
                     height: 8px;
                     background: #000000;
                     margin-right: 6px;
                }

                .scoreFacilityDiv{
                     display: block;
                     border: solid 1px #000000;
                     height: 120px;
                     background: #fff;
                     color: #000000;
                     overflow: auto;
                     padding: 6px;
                     line-height: 16px;
                }


                 /* test */
                .squareTitleBox{
                    display: flex;
                    align-items: center;
                    color: #5398FF;
                    font-size: 16px;
                    font-weight: 600;
                    margin-top: 20px;
                    margin-bottom: 15px;
                }
                .squareBox{
                    display: block;
                    width: 4px;
                    height: 4px;
                    background: #5398FF;
                    margin-right: 6px;
                }
                .subClassBox{
                    margin-bottom: 20px;
                    background: #F5F5F5;
                }
                .subClassTitleBox{
                    display: block;
                    height: 36px;
                    background: #E9E9E9;
                    border-radius: 3px;
                    padding: 10px;
                    font-size: 14px;
                    letter-spacing: 0px;
                }
                .subClassFlex{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 14px;
                    letter-spacing: 0px;
                }
                .subClassFlex:last-child{
                    border-bottom: none;
                }
                /* .subClassFlex > span:first-child{
                    flex: 1;
                }
                .subClassFlex > span:last-child{

                } */
                .subClassContsFlex{
                    display: block;
                    padding: 12px 10px;
                    border-bottom: solid 1px #0000000D;
                }
                .memoBox{
                    display: block;
                    width: 100%;
                    height: 35px;
                    font-size: 12px;
                    border: solid 1px #E9E9E9;
                    padding: 10px;
                    margin-top: 10px;
                    overflow-y: auto;
                }

                .memoBox::-webkit-scrollbar {
                    /* width: 4px; */
                    background: #EEEEEE;
                    border-radius: 10px;
                    border: 5px solid #EEEEEE;
                }

                .memoBox::-webkit-scrollbar-thumb {
                    background-color: #000000;
                    border-radius: 6px;
                }

                .memoBox::-webkit-scrollbar-track {
                    background-color: rgba(0,0,0,0);
                }
            }
        }
    }

    .scrollbar {
        overflow-x: hidden;
        overflow-y: auto;
    }

    .scrollbar::-webkit-scrollbar {
        width: 4px;
        background: #EEEEEE;
        border-radius: 10px; 
        border: 5px solid #EEEEEE;
    }

    .scrollbar::-webkit-scrollbar-thumb {
        background-color: #000000;
        border-radius: 6px;
    }

    .scrollbar::-webkit-scrollbar-track {
        background-color: rgba(0,0,0,0);
    }

    input[type="radio"] {
        display: inline-block;
        vertical-align: middle;
        width: 16px;
        height: 16px;
        border: solid 1px #000000;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        position: relative;
        cursor: pointer;
        border-radius: 50%;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
    }

    input[type="radio"]:checked:after {
        content: "";
        display: block;
        background: #000000;
        position: absolute;
        left: 2px;
        right: 2px;
        top: 2px;
        bottom: 2px;
        border-radius: 50%;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
    }
`;



export const SOPHistoryDetailBoxs = styled(HistorysCommon)`

#hsMmo {position: fixed; /* right: 750px; top: 300px; */ left: 50%; top: 50%; transform: translate(-50%, -50%);  z-index: 1; background: #efefef; border-radius:5px; } /* 0627 */
.hsmCont {background: #fff; width: 400px; margin: 0 auto; padding: 20px; -webkit-border-radius: 4px; -moz-border-radius: 4px; border-radius: 4px;}
.hsmCont.sop {width: 800px;}
.hsmTitle:after {content: ''; display: table; clear: both;}
.hsmTitle h3 {float: left; height: 30px; line-height: 30px; font-size: 22px;}
.hsmCls {display: block; float: right; width: 30px; height: 30px; text-indent: -9999px; background: url('../img/sub/setting_close.png')no-repeat center center;
          z-index: 1; position: absolute; right: 20px; }
.hsmExl {display: block; height: 30px; line-height: 30px; padding: 0 15px; float: left; margin-left: 15px; background: #1f7244; border-color: #1f7244; color: #fff; font-size: 13px; -webkit-border-radius: 4px; -moz-border-radius: 4px; border-radius: 4px;}
.hsmExl:hover{background: #175533;} /*0720 수정*/
.hsmTxt {height: 240px; border: solid 1px #ddd; margin-top: 10px; -webkit-border-radius: 4px; -moz-border-radius: 4px; border-radius: 4px;}
.hsmTxt .scroll-bar {background: rgba(0,0,0,0.2) !important;}
textarea.hsmTxt {padding: 10px !important;}
.hsmDsc {font-size: 14px; margin-top: 5px;}
.hsmDsc:before {
	content: 'i'; display: inline-block; vertical-align: middle; width: 14px; height: 14px; line-height: 12px; text-align: center;
	border: solid 1px #aaa; color: #666; font-size: 12px; margin-right: 5px;
	-webkit-border-radius: 50%; -moz-border-radius: 50%; border-radius: 50%;
}
.hsmDsc span {vertical-align: middle;}
.hsmBtn {padding-top: 20px; text-align: center;}
.hsmBtn li {display: inline-block; margin: 0 3px;}
.hsmBtn li a {display: block; width: 100px; height: 40px; line-height: 38px; font-size: 14px; background: #131d24; border: solid 1px #131d24; color: #fff; -webkit-border-radius: 4px; -moz-border-radius: 4px; border-radius: 4px;}
.hsmBtn li:first-child a {background: #f5f5f5; border-color: #ddd; color: #333;}



`;