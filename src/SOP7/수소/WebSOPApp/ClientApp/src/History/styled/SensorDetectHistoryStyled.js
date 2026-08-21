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

import historySelect_icon from '../../History/image/historySelect_icon.svg';
import historyMemo_disable from '../../History/image/historyMemo_disable.svg';
import historyMemo_active from '../../History/image/historyMemo_active.svg';
import selectBox_Active from '../../History/image/selectBox_Active.svg';
import page_first_disable from '../../History/image/page_first_disable.svg';
import page_prev_disable from '../../History/image/page_prev_disable.svg';
import page_next_disable from '../../History/image/page_next_disable.svg';
import page_last_disable from '../../History/image/page_last_disable.svg';
import page_first_active from '../../History/image/page_first_active.svg';
import page_prev_active from '../../History/image/page_prev_active.svg';
import page_next_active from '../../History/image/page_next_active.svg';
import page_last_active from '../../History/image/page_last_active.svg';

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
        hslMenuLiOnBackground: '#0085FF',
        hslMenuLiOnColor: '#282829',
        inputRadioCheckedBackground: 'var(--title-bar-text-blue-color)',
        inputCheckboxBackground: `url(${selectBox_Active}) no-repeat center center`,
        hscsSbmtBackground: '#0085FF',
        hscsSbmtHoverBackground: '#244554',
        btnCalendarBkWidth: '19px',
        hsContBackColor: '#1e1e1e',
        hscSchBorder: 'none',
        hscTbBorder: 'none',
        hsLftBackColor: '#282829',
        hscSchDisplay: 'flex',
        hscSchDlWidth: 'auto',
        hscsDateDisplay: 'flex',
        hscsDateDatepickerBorder: 'none',
        hscsDateBorder: 'solid 1px #f5f5f5',
        hscsDatePaddingTop: '20px',
        hscsDateBorderRadius: '5px',
        hscsDateBackground: '#f5f5f5',
        hscsDateDatepickerBackColor: '#323335',
        hscsDateMarginRight: '20px',
        hsLftWidth: '280px',
        hsScrMarginLeft: '280px',
        hscsSbmtWidth: '70px',
        hscsSbmtHeight: '56px',
        hscsSbmtTop: '42px',
        hscTbBackground: '#323335',
        hscTbThHeight: '34px',
        hscTbThVerticalAlign: 'middle',
        hscTbThColor: '#FFF',
        hscTbThFontSize: '14px',
        hscTbTdBorderBottom: 'solid 1px #f5f5f5',
        hscExlLiABorder: 'none',
        hscExlLiABackground: `url(${FileDownIconImage}) no-repeat -5% center`,
        hscExlLiAPadding: '5px 10px',
        hscExlLiAExlBackground: `url(${FileDownIconImage}) no-repeat -5% center`,
        hscExlLiAExlColor: '#000000',
        hscNavAPrevDisable: `url(${PageArrowLeft}) no-repeat center center`,
        hscNavANextDisable: `url(${PageArrowRight}) no-repeat center center`,
        hscNavAPrev: `url(${PageArrowLeft}) no-repeat center center`,
        hscNavANext: `url(${PageArrowRight}) no-repeat center center`,
        hscExlLiAHeight: '16px',
        hscExlLiALineHeight: '14px',
        hscTbPadding: '0px',
        hscTbMarginTop: '0px',
        hscNavABackground: 'none',
        hscNavABorder: 'solid 1px #313644',
        hscNavABorderRadius: '2px !important',
        hscNavAMargin: '5px',
        hscNavUlLiBackColor: 'none',
        hscNavUlLiOnBackColor: '#0085FF',
        hscNavUlLiOnBorderRadius: '2px',
        hscNavUlLiOnColor: '#000000',
        hscNavUlLiAfterBackColor: 'none',
        hscNavMarginTop: '38px',
        selWhHeight: '54px',
        selWhWidth: '100%',
        hscsHalfLiWidth: 'auto',
        selWhBorderColor: '#0085FF',
        selWhBackground: `#F5F5F5 url(${history_select}) no-repeat`,
        hscsHalfDisplay: 'flex',
        hscsHalfPaddingRight: '0px',
        hscsHalfMarginBottom: '0px',
        hscSchDlMarginTop: '0px',
        hscsRdoPaddingTop: '0px',
        hsContMarginTop: '20px',
        hslMenuLiAFontWeight: '600',
        hscsHalfLiInputBorder: 'none',
        hsLftTop: '50px',
        hscTbTdABorder: 'solid 1px #1e1e1e',
        hscTbTdAColor: '#ffffff',
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
        left: 210px;
        top: 16px;
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
        left: 0;
        top: ${_HistorysCommon[PR.styleMode].hsLftTop};
        bottom: 0;
        width: ${_HistorysCommon[PR.styleMode].hsLftWidth};
        background: ${_HistorysCommon[PR.styleMode].hsLftBackColor};
    }

    .hslMenu {
    }

    .hslMenu li {
        border-bottom: solid 1px #1e1e1e;
        cursor: pointer;
    }

    .hslMenu li a {
        display: block;
        height: 58px;
        line-height: 58px;
        padding: 0 15px;
        position: relative;
        font-size: 16px;
        font-weight: ${_HistorysCommon[PR.styleMode].hslMenuLiAFontWeight};
        color: #ffffff;
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
        background: #1e1e1e;
    }

    #hsCont {
        background: ${_HistorysCommon[PR.styleMode].hsContBackColor};
        padding: 20px 40px 60px;
        min-width: 1200px;
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
        background: #282829;
        /* border: ${_HistorysCommon[PR.styleMode].hscSchBorder}; */
        padding: 20px;
        padding-right: 140px;
        position: relative;
    }

    .hscSch dl {
        display: table;
        width: ${_HistorysCommon[PR.styleMode].hscSchDlWidth};
        height: 26px !important;
        margin-top: ${_HistorysCommon[PR.styleMode].hscSchDlMarginTop};
        margin-bottom: 11px;
    }

    .hscSch dl:first-child {
        margin-top: 0;
    }

    .secondDl{
        margin-bottom: 0 !important;
    }

    .thirdDl{
        margin-bottom: 0 !important;
    }

    .hscSch dl dt {
        display: table-cell;
        vertical-align: middle;
        /* width: 120px; */
        /* width: 92px; */
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

    .hscsRdo input[type="radio"] + label {
        color: #ffffff;
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

    /* hydrogen */
    .sensorTypeSelectTitle{
        font-size: 12px;
        color: #ffffff;
        position: absolute;
        left: 10px;
        top: 8px;
    }

    .sensorTypeSelect{
        display: block;
        width: 268px;
        height: 26px;
        border-radius: 2px;
        background: #323335;
        /* padding: 5px 5px 5px 10px; */
        padding-top: 26px;
        font-size: 12px;
        margin-right: 20px;

        > option{
            color: #ffffff;
        }
    }
 
    .selectBoxArrowDrop{
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url(${historySelect_icon}) no-repeat;
        position: absolute;
        right: 5px;
        bottom: 5px;
    }

    .hscsLoc {
        position: relative;
        margin-left: 26px;
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

    .hscsLoc2 {
        position: relative;
    }

    .hscsLoc2:after {
        content: "";
        display: table;
        clear: both;
    }

    .hscsLoc2 li {
        float: left;
        width: 120px;
        margin-right: 10px;
    }

    .hscsLoc2 li:last-child {
        margin-right: 0;
    }

    .hscsLoc2 li select {
        width: 100%;
    }

    /* hydrogen */
    .locationTypeSelectTitle{
        font-size: 12px;
        color: #FFFFFF;
        position: absolute;
        left: 10px;
        top: 8px;
    }
    .sensorDetectHSelect{
        display: block;
        width: 268px !important;
        height: 26px;
        border-radius: 2px;
        background: #323335 url(${historySelect_icon}) no-repeat 98% 50%;
        /* padding: 5px 5px 5px 10px; */
        padding-top: 26px;
        font-size: 12px;
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
       border: solid 1px #0085FF;
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
       color: #0085FF;
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
       color: #0085FF;
       background: #ECECEC url(${SelectOptionActive}) no-repeat 96% 50%;
    }

    .activeOption1Active{
       color: #0085FF !important;
       background: #ECECEC url(${SelectOptionActive}) no-repeat 96% 50% !important;
    }

    .activeOption2: hover{
       color: #0085FF;
       background: #ECECEC url(${SelectOptionActive}) no-repeat 96% 50%;
    }

    .activeOption2Active{
       color: #0085FF !important;
       background: #ECECEC url(${SelectOptionActive}) no-repeat 96% 50% !important;
    }

    .activeOption3: hover{
       color: #0085FF;
       background: #ECECEC url(${SelectOptionActive}) no-repeat 96% 50%;
    }

    .activeOption3Active{
       color: #0085FF !important;
       background: #ECECEC url(${SelectOptionActive}) no-repeat 96% 50% !important;
    }


    .selWh {
        display: block;
        width: 120px;
        height: 26px;
        line-height: 24px;
        border-radius: 2px;
        border: 0;
        color: #fff;
        background: #323335 url(${historySelect_icon}) no-repeat 96% 50%;
        font-size: 12px;
        padding: 0 27px 0 10px;

        &.button {
            width: 100%;
            text-align: left;
        }
    }

    .selWhSOP {
        display: block;
        width: 268px !important;
        height: 26px;
        line-height: 24px;
        border-radius: 2px;
        border: 0;
        color: #fff;
        background: #323335 url(${historySelect_icon}) no-repeat 98% 50%;
        font-size: 12px;
        padding: 0 27px 0 10px;
        margin-right: 20px;

        &.button {
            width: 100%;
            text-align: left;
        }
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
        border-radius: ${_HistorysCommon[PR.styleMode].hscsDateBorderRadius};
        /* position: relative; */
        position: static;

        .react-datepicker {
            font-size: 1em;
        }

        .react-datepicker__header {
            padding-top: 0.8em;
        }

        .react-datepicker__month {
            margin: 0.4em 1em;
        }

        .react-datepicker__day-name, .react-datepicker__day {
            width: 1.9em;
            line-height: 1.9em;
            margin: 0.166em;
        }

        .react-datepicker__current-month {
            font-size: 1em;
        }

        .react-datepicker__navigation {
            top: .6em;
            line-height: 1.7em;
            border: none;
        }

        .react-datepicker__navigation--previous {
            border-right-color: #ccc;
            left: 1em;
        }
        
        .react-datepicker__navigation--next {
            border-left-color: #ccc;
            right: 1em;
        }
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
        padding: 0 12px;
        color: #ffffff;
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
        height: 26px;
        font-size: 12px;
        padding-left: 10px;
        border-radius: 2px;
        color: #ffffff;
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
        height: 26px;
        font-size: 12px;
        padding-left: 10px;
        border-radius: 2px;
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
       border: solid 1px #0085FF;
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
        right: 3px;
        top: 4px;
        cursor: pointer;
    }

    .hscsSbmt {
        display: block;
        width: ${_HistorysCommon[PR.styleMode].hscsSbmtWidth};
        height: ${_HistorysCommon[PR.styleMode].hscsSbmtHeight};
        background: ${_HistorysCommon[PR.styleMode].hscsSbmtBackground};
        color: #000000;
        position: absolute;
        /* top: 20px; */
        top: ${_HistorysCommon[PR.styleMode].hscsSbmtTop};
        right: 20px;
        bottom: 20px;
        border-radius: 2px;
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
        color: #000000;
        font-size: 16px;
    }

    .hscsSbmt > span > span:hover {
        /* background: ${_HistorysCommon[PR.styleMode].hscsSbmtHoverBackground}; */
        border-radius: 2px;
    }

    .hscsSbmtSecond {
        display: block;
        width: ${_HistorysCommon[PR.styleMode].hscsSbmtWidth};
        height: ${_HistorysCommon[PR.styleMode].hscsSbmtHeight};
        background: ${_HistorysCommon[PR.styleMode].hscsSbmtBackground};
        color: #000000;
        position: absolute;
        top: 27px;
        right: 20px;
        bottom: 20px;
        border-radius: 2px;
        cursor: pointer;
    }

    .hscsSbmtSecond > span {
        display: table;
        width: 100%;
        height: 100%;
    }

    .hscsSbmtSecond > span > span {
        display: table-cell;
        width: 100%;
        vertical-align: middle;
        text-align: center;
        color: #000000;
        font-size: 16px;
    }

    .hscsSbmtSecond > span > span:hover {
        /* background: ${_HistorysCommon[PR.styleMode].hscsSbmtHoverBackground}; */
        border-radius: 2px;
    }

    #hscsSbmting {
        cursor: wait;
    }

    .hscExl {
        text-align: right;
        margin-top: 20px;
        margin-bottom: 10px;
    }

    .hscExl li {
        display: inline-block;
        margin-right: 10px;
        color: #fff;
        padding: ${_HistorysCommon[PR.styleMode].hscExlLiAPadding};
        text-align: center;
        font-size: 13px;
        border-radius: 2px;
        border: 1px solid #464B4E;
        background: #282829;
        cursor: pointer;

        &:hover, &:focus {
            background-color: #0085FF;
            color: #1E1E1E;
        }
    }

    .hscExl li:last-child{
        margin-right: 0;
    }

    .hscExl li a {
        display: block;
        height: ${_HistorysCommon[PR.styleMode].hscExlLiAHeight};
        line-height: ${_HistorysCommon[PR.styleMode].hscExlLiALineHeight};
    }

    .hscTb {
        border: ${_HistorysCommon[PR.styleMode].hscTbBorder};
        padding: ${_HistorysCommon[PR.styleMode].hscTbPadding};
        margin-top: ${_HistorysCommon[PR.styleMode].hscTbMarginTop};
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    .hscTb > tbody tr:hover {
        background: #0085FF;
        color: #1e1e1e !important;
    }

    .hscTb tr:hover {
        background: #0085FF;
        color: #1e1e1e !important;
    }

    .hscTb th,
    .hscTb td {
        /* border-bottom: ${_HistorysCommon[PR.styleMode].hscTbTdBorderBottom}; */
        font-size: 14px;
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
        border-right: solid 1px #1e1e1e;
    }

    .hscTb td {
        padding: 7px 12px !important;
    }

    .hscTb input[type="checkbox"] {
        background: none;
        border-color: #fff;
    }

    .hscTb input[type="checkbox"]:checked {
        background: ${_HistorysCommon[PR.styleMode].inputCheckboxBackground};
        /* background-size: 16px !important; */
    } 

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

    .scrTb > tbody tr:hover{
        background: #0085ff;
    }

    .scrTb td {
        padding: 7px 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        cursor: pointer;
        background: #282829;
        color: #fff;
        border-right: solid 1px #1e1e1e;
        border-bottom: solid 1px #1e1e1e;
    } 

    .memoActive{
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url(${historyMemo_active}) no-repeat center center;
        position: relative;
    }

    .memoDisable{
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url(${historyMemo_disable}) no-repeat center center;
    }

    .hscNav {
        text-align: center;
        /* margin-top: 20px; */
        margin-top: ${_HistorysCommon[PR.styleMode].hscNavMarginTop};
        position: absolute;
        bottom: 40px;
        left: 50%;
    }

    .hscNav a {
        display: inline-block;
        vertical-align: middle;
        width: 30px;
        height: 30px;
        line-height: 28px;
        /* background: #fff; */
        background: ${_HistorysCommon[PR.styleMode].hscNavABackground};
        /* border: solid 1px #ccc; */
        border: ${_HistorysCommon[PR.styleMode].hscNavABorder};
        border-radius: ${_HistorysCommon[PR.styleMode].hscNavABorderRadius};
        position: relative;
        font-family: "Roboto", sans-serif;
        color: #ffffff;
        font-size: 13px;
        margin: ${_HistorysCommon[PR.styleMode].hscNavAMargin};
    }

    .hscNav > a {
        text-indent: -9999px;
    }

    .hscNav a.first {
        background: url(${page_first_active}) no-repeat center center;
        cursor: pointer;
    }

    .hscNav a.prev {
        background: url(${page_prev_active}) no-repeat center center;
        /* background: ${_HistorysCommon[PR.styleMode].hscNavAPrev}; */
        cursor: pointer;
    }

    .hscNav a.next {
        background: url(${page_next_active}) no-repeat center center;
        /* background: ${_HistorysCommon[PR.styleMode].hscNavANext}; */
        cursor: pointer;
    }

    .hscNav a.last {
        background: url(${page_last_active}) no-repeat center center;
        cursor: pointer;
    }

    .hscNav a.firstDisable {
        background: url(${page_first_disable}) no-repeat center center;
    }

    .hscNav a.prevDisable {
        background: url(${page_prev_disable}) no-repeat center center;
        /* background: ${_HistorysCommon[PR.styleMode].hscNavAPrevDisable}; */
    }
    .hscNav a.nextDisable {
        background: url(${page_next_disable}) no-repeat center center;
        /* background: ${_HistorysCommon[PR.styleMode].hscNavANextDisable}; */
    }

    .hscNav a.lastDisable {
        background: url(${page_last_disable}) no-repeat center center;
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

    .hscNav ul li:before {
        content: "";
        display: block;
        width: 1px;
        height: 12px;
        /* background: #e2e2e2; */
        background: ${_HistorysCommon[PR.styleMode].hscNavUlLiBackColor};
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
        background: ${_HistorysCommon[PR.styleMode].hscNavUlLiAfterBackColor};
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -6px;
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
        padding-right: 40px;
        /* width: 100px; */
    }

    .hscsHalf > li:first-child dl dt {
        text-align: left;
        /* width: 120px; */
    }

    .hscsHalf > li input[type="text"] {
        display: block;
        width: 100%;
        border: ${_HistorysCommon[PR.styleMode].hscsHalfLiInputBorder};
        background: #323335;
        height: 32px;
        font-size: 13px;
        padding-left: 10px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        color: #ffffff;
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
        font-size: 12px;
        color: #FFFFFF;
        position: absolute;
        left: 10px;
        top: 8px;
     }

    .disasterTypeSelect{
        display: block;
        width: 268px !important;
        height: 26px;
        border-radius: 2px;
        background: #323335 url(${historySelect_icon}) no-repeat 98% 50%;
        padding-top: 26px;
        font-size: 12px;
        margin-right: 20px;

        > option{
            color: #FFFFFF;
        }
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
        font-size: 12px;
        color: #FFFFFF;
        position: absolute;
        left: 10px;
        top: 10px;
    }

    .modeSelect{
        display: block;
        width: 268px !important;
        height: 26px;
        border-radius: 2px;
        background: #323335 url(${historySelect_icon}) no-repeat 98% 50%;
        padding: 5px 5px 5px 10px;
        padding-top: 26px;
        font-size: 12px;
        margin-right: 20px;

        > option{
            color: #fff;
        }
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
        font-size: 12px;
        color: #FFFFFF;
        position: absolute;
        left: 10px;
        top: 8px;
     }
     .locationSelect{
        display: block;
        width: 272px !important;
        height: 26px;
        border-radius: 2px;
        background: #323335 url(${historySelect_icon}) no-repeat 98% 50%;
        font-size: 12px;
        margin-right: 20px;
        margin-left: 14px;
        color: #FFFFFF;

        > option {
            color: #FFFFFF;
        }
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
export const SpreadHistoryComponent = styled(UserHistoryComponent)`
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