import styled from "styled-components";

import paging_first from '../images/paging_first.png';
import paging_prev from '../images/paging_prev.png';
import paging_next from '../images/paging_next.png';
import paging_last from '../images/paging_last.png';
import paging_first_disable from '../images/paging_first_disable.png';
import paging_prev_disable from '../images/paging_prev_disable.png';
import paging_next_disable from '../images/paging_next_disable.png';
import paging_last_disable from '../images/paging_last_disable.png';
import history_menu_arrow_on from '../images/history_menu_arrow_on.png';
import select_arrow from '../images/select_arrow.png';

import excel_icon from '../images/excel_icon.png';
import close_icon from '../../Common/images/close_icon.png';

export const HistoryComponent = styled.div`
    width: 100vw;
    height: 100vh;
    padding-top: 50px;
    overflow: hidden;
    background-color: #3B4248;
    position: absolute;
    top: 0;
    left: 0;
`;


/**********************************************************************/
// 이력관리 공통 css

export const HistorysCommon = styled.div`
    height: 100%;

    #hsLft {
        width: 280px;
        height: calc(100vh - 53px);
        margin-top: 53px;
        background-color: ${(props) => props.theme.darkColor};
        position: absolute;
        top: 0;
        left: 0;
    }

    .hslMenu li {
        border-bottom: 1px dashed #525868;
        cursor: pointer;
    }

    .hslMenu li a {
        display: block;
        height: 49px;
        line-height: 49px;
        padding: 0 15px;
        position: relative;
        font-size: 14px;
        color: ${(props) => props.theme.middleGray};
    }

    .hslMenu li a.on {
        background: #1D2023;
        color: ${(props) => props.theme.mainColor};
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
        background: url(${history_menu_arrow_on}) no-repeat center center;
    }

    .hslMenu li a.on:after {
        background: url(${history_menu_arrow_on}) no-repeat center center;
    }

    .hsScr {
        overflow: auto;
        height: 100vh;
        margin-left: 280px;
    }

    #hsCont {
        padding: 26px 33px;
        min-width: calc(100% - 280px);
    }

    .hscSch {
        background: ${(props) => props.theme.darkColor};
        padding: 18px 26px;
        padding-right: 140px;
        position: relative;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        
    }

    .hscSch label {
        font-size: 14px;
    }

    .hscSch dl {
        display: table;
        width: 100%;
        margin-top: 10px;
        padding-top: 7px;
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
    }

    .hscSch dl dd:after {
        content: "";
        display: table;
        clear: both;
    }

    label {
        margin-left: 3px;
    }

    .hscsRdo {
        ${(props) => props.theme.flex('flex-start', 'center')};
        vertical-align: middle;

        &.right {
            position: relative;
            top: 7px;
        }
    }

    .hscsRdo:after {
        content: "";
        display: table;
        clear: both;
    }

    .hscsRdo li {
        ${(props) => props.theme.flex('flex-start', 'center')};
        gap: 4px;
        margin-right: 29px;
    }

    .hscsRdo li:last-child {
        margin-right: 0;
    }

    .hscsLoc {
    }

    .hscsLoc:after {
        content: "";
        display: table;
        clear: both;
    }

    .hscsLoc li {
        float: left;
        width: 170px;
        margin-right: 19px;
    }

    .hscsLoc li:last-child {
        margin-right: 0;
    }

    .hscsLoc li select {
        width: 100%;
        cursor: pointer;
    }

    .selWh {
        display: block;
        height: 32px;
        border-color: ${(props) => props.theme.middleGray};
        background-color: transparent;
        color: #fff;
        font-size: 13px;
        padding-right: 22px;
        padding-left: 7px;
        background: url(${select_arrow}) no-repeat;
        background-position: right 8px center;
        border-radius: 3px;
    }

    option {
        background-color: ${(props) => props.theme.darkGray};
        color: #fff;
    }

    .hscsDate {
        float: left;
        margin-right: 40px;
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


    .hscsDate .datepicker input[type="text"] + label {
    }

    .hscsDate .datepicker {
    }

    .hscsDate .datepicker input[type="text"] {
        display: block;
        width: 170px;
        border: 1px solid #A5A5A5;
        background-color: transparent;
        height: 32px;
        font-size: 13px;
        padding-left: 10px;
        border-radius: 3px;
        color: #fff;
        cursor: pointer;
    }

    .btnCalendar {
        width: 17px;
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
        width: 100px;
        background: #1A1F23;
        color: #fff;
        position: absolute;
        top: 20px;
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

    #hscsSbmting {
        cursor: wait;
    }

    .hscExl {
        text-align: right;
        margin-top: 20px;
    }

    .hscExl li {
        display: inline-block;
    }

    .hscExl li a {
        display: block;
        height: 25px;
        line-height: 25px;
        background-color: ${(props) => props.theme.mainColor};
        padding: 0 10px 0 28px;
        text-align: center;
        font-size: 12px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        cursor: pointer;
        color: #1A1F23;
        font-weight: bold;
        position: relative;

        &::before {
            content: '';
            display: inline-block;
            background: url(${excel_icon}) no-repeat center center;
            width: 13px;
            height: 16px;
            position: absolute;
            top: 5px;
            left: 9px;
        }
    }

    .hscExl li a.all {
        margin-right: 10px;
    }

    .hscTb {
        margin-top: 10px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;

        tr {
            background-color: ${(props) => props.theme.darkColor};
        }
    }

    .hscTb .on {
        background-color: rgba(112, 112, 112, .1);
        color: ${(props) => props.theme.mainColor};
    }

    .hscTb tr:not(:last-child) {
        border-bottom: 1px dashed #525868;
    }

    .hscTb th,
    .hscTb td {
        padding: 5px;
        font-size: 14px;
        text-align: center;
        height: 37px;

        &:not(:last-child) {
            border-right: 1px dashed #525868;
        }
    }

    .hscTb th {
        background: #1A1F23;
        line-height: 27px;
        color: #CCCCCC;

        input[type=checkbox] {
            position: relative;
            top: -2px;
        }
    }

    .hscTb td {
        padding: 10px 5px;
        vertical-align: middle;
    }

    .hscTb td select {
        display: inline-block;
    }

    .hscTb td a {
        display: inline-block;
        border: solid 1px #ccc;
        height: 28px;
        line-height: 26px;
        font-size: 13px;
        padding: 0 10px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    .hscTb td span {
        font-size: 14px;
    }

    .scrTb {
        overflow-x: auto;
    }

    .scrTb table {
        min-width: 1400px;
        table-layout: fixed;
        position: relative;

        tr:hover {
            background-color: rgba(112, 112, 112, .1);
        }

        .noData {
            color: ${(props) => props.theme.middleGray};
            background-color: transparent;
            height: 300px;

            > td {
                cursor: default;
            }
        }
    }

    .scrTb td {
        ${(props) => props.theme.overText()};
        
        &:first-child {
            cursor: pointer;
        }

        &.memo {
            padding: 0 5px;
        }
    }

    .hscNav {
        text-align: center;
        margin-top: 20px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-use-select: none;
        user-select: none;
    }

    .hscNav a {
        display: inline-block;
        vertical-align: middle;
        width: 28px;
        height: 28px;
        line-height: 26px;
        position: relative;
        color: #999;
        font-size: 13px;
        margin: 0 2.5px;
        border-radius: 2px;
        background-color: ${(props) => props.theme.darkColor};
    }

    .hscNav > a {
        text-indent: -9999px;
    }

    .hscNav a.first {
        background: url(${paging_first}) no-repeat center center, ${(props) => props.theme.darkColor};
        cursor: pointer;
    }

    .hscNav a.prev {
        background: url(${paging_prev}) no-repeat center center, ${(props) => props.theme.darkColor};
        cursor: pointer;
    }

    .hscNav a.next {
        background: url(${paging_next}) no-repeat center center, ${(props) => props.theme.darkColor};
        cursor: pointer;
    }

    .hscNav a.last {
        background: url(${paging_last}) no-repeat center center, ${(props) => props.theme.darkColor};
        cursor: pointer;
    }

    .hscNav a.firstDisable {
        background: url(${paging_first_disable}) no-repeat center center, ${(props) => props.theme.darkColor};
    }

    .hscNav a.prevDisable {
        background: url(${paging_prev_disable}) no-repeat center center, ${(props) => props.theme.darkColor};
    }
    .hscNav a.nextDisable {
        background: url(${paging_next_disable}) no-repeat center center, ${(props) => props.theme.darkColor};
    }

    .hscNav a.lastDisable {
        background: url(${paging_last_disable}) no-repeat center center, ${(props) => props.theme.darkColor};
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
        color: ${(props) => props.theme.mainColor};
    }

    .hscsHalf {
        margin-bottom: 10px;
        padding-right: 200px;
    }
    
    .hscsHalf:after {
        content: "";
        display: table;
        clear: both;
    }

    .hscsHalf > li {
        float: left;
        width: 25%;
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
        background-color: ${(props) => props.theme.darkColor};
        border: solid 1px ${(props) => props.theme.middleGray};
        height: 32px;
        font-size: 13px;
        padding-left: 10px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        color: #fff;
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
    
    .scrTb table tbody {
        height: ${(props) => props.$tbheight ? 'auto' : '300px'};
    }
`;


/**********************************************************************/
// 센서 탐지 이력

export const SensorDetectHistoryComponent = styled(HistorysCommon)`

    .HisMemoOn {
        display: block;
        height: 20px;
        width: 40px;
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
        background-position: 50%;
        background-position-y: 1px;
        background-size: 28px;
        height: 20px;
        width: 40px;
        margin: 0 auto;
    }

`;


/**********************************************************************/
// 센서 탐지 분석

export const SensorDetectAnalysisComponent = styled(HistorysCommon)`

    .hscChtWrap {
        background: ${(props) => props.theme.darkColor};
        margin: 18px 0;
        text-align: center;
        font-size: 18px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    .hscWng {
        border-bottom: 1px dashed #525868;
        padding: 17px 0;
        font-size: 18px;
    }

    .hscWng span {
        color: ${(props) => props.theme.mainColor};
        font-size: 18px;
    }

    .hscCht {
        padding: 20px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    .hscCht > div {
        padding: 100px;
        text-align: center;
    }
`;


/**********************************************************************/
// SOP 이력

export const SOPHistoryComponent = styled(HistorysCommon)`

    .detailBtn {
        width: 69px;
        height: 23px;
        line-height: 23px;
        background: transparent linear-gradient(180deg, #222A31 0%, #000000 100%) 0% 0% no-repeat padding-box;
        border-radius: 4px;
        font-size: 12px;
        color: #fff;
    }
`;


/**********************************************************************/
// SOP 상세정보 팝업

export const SOPHistoryDetailInfoComponent = styled.div`
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;

    &::before {
        content: '';
        display: block;
        width: 100%;
        height: 3px;
        background: transparent linear-gradient(270deg, #FFFFFF12 0%, #20DFA8 100%) 0% 0% no-repeat padding-box;
        opacity: .65;
        left: 0;
        border: 0;
    }

    .hsmCont {
        background: #3B4248;
        margin: 0 auto;
        padding: 20px;
    }

    .hsmCont.sop {
        width: 800px;
    }

    .hsmTitle:after {
        content: "";
        display: table;
        clear: both;
    }

    .hsmTitle h3 {
        float: left;
        height: 30px;
        line-height: 30px;
        font-size: 16px;
        font-weight: bold;
        color: ${(props) => props.theme.mainColor};
    }

    .hsmExl {
        display: inline-block;
        height: 25px;
        line-height: 25px;
        background-color: ${(props) => props.theme.mainColor};
        padding: 0 10px 0 28px;
        margin-left: 15px;
        text-align: center;
        font-size: 12px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        cursor: pointer;
        color: #1A1F23;
        font-weight: bold;
        position: relative;
        top: 3px;

        &::before {
            content: '';
            display: inline-block;
            background: url(${excel_icon}) no-repeat center center;
            width: 13px;
            height: 16px;
            position: absolute;
            top: 5px;
            left: 9px;
        }
    }

    .hsmCls {
        display: block;
        float: right;
        width: 12px;
        height: 12px;
        text-indent: -9999px;
        background: url(${close_icon}) no-repeat center center;
        z-index: 1;
        cursor: pointer;
    }

    .scroll-wrapper {
        overflow: auto;
        padding: 0 !important;
        position: relative;
    }

    .scroll-wrapper > .scroll-content {
        border: none !important;
        box-sizing: content-box !important;
        height: auto;
        left: 0;
        margin: 0;
        max-height: none;
        max-width: none !important;
        overflow: scroll !important;
        padding: 0;
        position: relative !important;
        top: 0;
        width: auto !important;
    }

    .scroll-wrapper > .scroll-content::-webkit-scrollbar {
        height: 0;
        width: 0;
    }

    .scroll-wrapper::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background: none;
     }
    .scroll-wrapper::-webkit-scrollbar-thumb {
        background: #22CF9F;
        border-radius: 6px;
        opacity: .4
     }
    .scroll-wrapper::-webkit-scrollbar-track {
        background: none
    }

    .hsmPrc {
        margin-top: 13px;
        height: 240px;
        background-color: ${(props) => props.theme.darkColor};
    }

    .hsmPrc .scroll-bar {
        background: rgba(0, 0, 0, 0.2) !important;
    }

    .hsmTb {
    }

    .hsmTb th,
    .hsmTb td {
        padding: 10px 5px;
        text-align: center;
        font-size: 13px;
    }

    .hsmTb th {
        background: #1A1F23;
        font-size: 14px;
    }

    .hsmTb td {
        padding: 10px;
        border-bottom: 1px dashed #525868;
    }

    .hsmTb tbody tr:hover {
        background: rgba(112, 112, 112, .1);
        cursor: pointer;
    } 

    .hsmDtl {
        margin-top: 16px;
        height: 240px;
        background-color: ${(props) => props.theme.darkColor};
    }

    .hsmDtl .scroll-bar {
        background: rgba(0, 0, 0, 0.2) !important;
    }

    .hsmScr {
        height: 90px;
        border: 1px solid #525868;
        text-align: left;
        line-height: 1.6em;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        font-size: 13px;
    }

    .hsmScr .scroll-bar {
        background: rgba(0, 0, 0, 0.2) !important;
    }

    .hsmScr.scroll-content {
        padding: 5px !important;
    }
    .hsmScrBox{
        display: block;
        font-size: 13px;
        padding: 6px;
    }
`;
