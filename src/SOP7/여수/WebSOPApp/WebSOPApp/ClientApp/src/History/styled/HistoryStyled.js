
import styled from 'styled-components';
import ProjectResource from '../../Root/resource/id';

import Groups from '../../SOPSimulator/img/groups.png';


import UTurn from '../../SOPSimulator/img/uTurn_icon.png';
import HistorySelect from '../../Common/img/sub/history_select.png';
import DashboardCalendarBK from '../../Common/img/sub/dashboard_calendar_bk.png';
import ExcelDown from '../../Common/image/icon/excel_Down.png';
import TheadArrowBtn from '../../Common/image/icon/theadArrowBtn.png';
import CheckBoxFill from '../../Common/image/icon/checkBox_Fill.png';
import CheckBoxDisable from '../../Settings/image/checkBox_disable.png';
import CheckBoxActive from '../../Settings/image/checkBox_active.png';
import CheckBoxWhite from '../../Settings/image/checkbox_white.png';
import CheckBoxWhiteFill from '../../Settings/image/checkbox_white_checked.png';
import HistoryMemoOn from '../../Common/img/common/historyMemoOn.png';
import MemoIcon from '../../Common/image/icon/memo_icon.png';
import PagingFirst from '../../Common/img/common/paging_first.png';
import PagingPrev from '../../Common/img/common/navigate_left.png';
import PagingNext from '../../Common/img/common/navigate_right.png';
import PagingLast from '../../Common/img/common/paging_last.png';
import PagingFirstDisable from '../../Common/img/common/paging_first_disable.png';
import NavigateLeft from '../../Common/image/icon/navigate_Left.png';
import NavigateRight from '../../Common/image/icon/navigate_Right.png';
import PagingLastDisable from '../../Common/img/common/paging_last_disable.png';
//import HistorySelect from '../../Common/img/sub/history_select.png';


export const _SensorDetectHistoryUI = {
    busan: {


    },
    yeosu: {


    }
}

export const SensorDetectHistoryUI = styled.div`
     height:100vh;
     margin: 0;
     padding:0;
     background-color:#ffffff;

     #hsty {
         position: relative;
         height: 100vh;
         overflow: hidden;
     } 
     #hsLft{
         position: fixed;
         left: 0;
         top: 100px;
         bottom: 0;
		 width: 300px;
         margin-right: 20px;
         border-top-right-radius: 30px;
         background: #26395B;
    }

    .hslMenu {
         margin-top: 36px;
         height: calc(100% - 120px);
    }
    .hslMenu li {
         cursor:pointer;
         padding: 14px 23px;
    }
    .hslMenu li a {
         display: block;
         padding-left:15px;
         position: relative;
         border-left: solid 3px #39A7DE;
		 font-family: Pretendard;
         font-weight: 400;
         font-size: 18px;
         letter-spacing: -1px;
         color: #fff;
     }
    .hslMenu li a.on {
         color: #fff;
         font-family: Pretendard;
         font-weight: 400;
         font-size: 18px; }

    .returnArea{
         display: flex;
         width: 260px;
         height: 48px;
         line-height: 48px;
         font-family: 'Pretendard';
         font-weight: 400;
         font-size: 18px;
         text-align: center;
         border-radius: 5px;
         box-shadow:0px 3px 20px 0px rgba(0,0,0,0.2);
         cursor: pointer;
         align-items: center;
         justify-content: center;
         color: #fff;
         margin-left: 18px;
     }
     .returnArea > a{
         font-size: 18px;
     }
    .returnBtn{
         display: inline-block;
         width: 24px;
         height: 24px;
         background: url(${ UTurn })no-repeat center center;
         margin-right: 10px;
     }
    .hsScr {
         overflow: auto;
         /*width: 100vh;*/
         height: 100vh;
         margin-left:340px;
         margin-top: 150px;
    }
    .detectTitle{
         font-family: 'Pretendard';
         font-weight: bold;
         font-size: 18px;
         color: #19A5FF;
    }
    #hsCont {
         /* background: #f5f5f5; padding: 20px 15px 60px; min-width: 1200px; */
         margin-right: 30px;
     }
    .hscSch {
         display: flex;
         background: #fff;
         padding-top: 22px;
         padding-right: 60px;
         position: relative;
         -webkit-border-radius: 4px;
         -moz-border-radius: 4px;
         border-radius: 4px;
         align-items: center;
     }
    .hscSch dl {
         /* display: table; */
         width: 100%;
         margin-right: 14px;
     }
    .hscSchFirst {
         margin-top: 0;
     }
    .hscSchSecond {

     }
    .hscSchThird {
         width: calc(100% - 700px) !important;
     }
    .hscSchFourth {
         width: calc(100% - 700px) !important;
     }

    .hscSch dl dt {
         /* display: table-cell; vertical-align: middle; */
         width: 120px;
         font-size: 15px;
         font-weight: 500;
     }
    .hscSch dl dd {
         /* display: table-cell; vertical-align: middle; */
         background: #F5F5F5;
     }
    .disasterTypeBox{
         display: block;
         /* width: 470px; */
         height: 54px;
         border-radius: 5px;
         /* margin-right: 10px; */
         position: relative;
     }
    .disasterTypeTitle{
         position: absolute;
         left: 6px;
         top: 6px;
         font-size: 11px;
         font-family: 'Pretendard';
         font-weight: 400;
         color: #808080;
     }
    .disasterSelect{
         display: block;
         width: 100%;
         height: 54px;
         padding-top: 14px;
         font-size: 13px;
		 background: url(${ HistorySelect })no-repeat 96% 70%;
         font-family: 'Pretendard';
     }
     .disasterSelect > option{
         font-size: 14px;
         font-weight: 400;
         font-family: 'Pretendard';

         background: #F5F5F5;
         color: #000000;
         height: 48px;
         line-height: 48px;
     }
    .locationTypeBox{
         display: block;
         /* width: 470px; */
         height: 54px;
         border-radius: 5px;
         position: relative;
     }
    .locationTitle{
         position: absolute;
         left: 6px;
         top: 6px;
         font-size: 11px;
         font-family: 'Pretendard';
         font-weight: 400;
         color: #808080;
     }
    .hscsLoc { /* padding-top: 20px; */ }
    .hscsLoc:after {
         content: '';
         display: table;
         clear: both;
     }
    .hscsLoc li {
         float: left;
         /* width: 170px; */
         width: 100%;
         margin-right: 10px;
     }
    .hscsLoc li:last-child {
         margin-right: 0;
     }
    .hscsLoc li select {
         width: 100%;
     }

    .locationSelect {
         display: block;
         width: 100%;
         height: 54px;
         border-color: #ddd;
         font-size: 13px;
         padding-right: 22px;
		 background: url(${ HistorySelect })no-repeat 96% 70%;
         /* background-position: right 8px center; */
         padding-top: 14px;
         font-family: 'Pretendard';
     }

    .inquiryPeriodBox{
         display: block;
         height: 54px;
         border-radius: 5px;
         position: relative;
     }
    .inquiryPeriodTitle{
         position: absolute;
         left: 6px;
         top: 6px;
         font-size: 11px;
         font-family: 'Pretendard';
         font-weight: 400;
         color: #808080;
     }
    .hscsDatee {
         float: left;
         /* margin-right: 40px; */
         margin-top: 20px;
     }
    .hscsDatee:after {
         content: '';
         display: table;
         clear: both;
     }
    .hscsDatee li {
         float: left;
         color: #000000;
     }
    .hscsDatee li:nth-child(2) {
         line-height: 32px;
         padding: 0 5px;
     }

    .datepicker {
         position: relative;
    }

    .datepicker input[type="text"] {
         padding-right: 32px;
         border:none;
         width: 115px;
    } 
    .datepicker input[type="text"] + label {
         display: block;
         width: 32px;
         height: 32px;
         position: absolute;
         right: 0;
         top: 0;
         cursor: pointer;
         text-indent: -9999px;
         background: url('../img/sub/dashboard_calendar.png')no-repeat center center;
     }

    .hscsDatee .datepicker {}
    .hscsDatee .datepicker input[type="text"] {
         display: block;
         width: 110px;
         background: #f5f5f5;
         height: 32px;
         font-size: 13px;
         padding-left: 10px;
		 -webkit-border-radius: 4px;
         -moz-border-radius: 4px;
         border-radius: 4px;
         font-family: 'Pretendard';
     }
    .hscsDatee .datepicker input[type="text"] + label {
         background: url(${ DashboardCalendarBK })no-repeat center center;
     }
    .btnCalendarBk {
         width: 17px;
         height: 17px;
         display: inline-block;
         z-index: 1;
         position: absolute;
         right: 10px;
         top: 8px;
     }
    .inquiryChoice{
         display: block;
         /* width: 218px; */
         height: 54px;
         border-radius: 5px;
         position: relative;
    }
    .inquiryChoice > select{
         /* width: 218px; */
         width: 100%;
         height: 54px;
         background: #f5f5f5 url(${ HistorySelect })no-repeat 96% 70%;
         font-size: 13px;
         font-weight: 500;
         padding-top: 16px;
    }
    .inquiryChoiceTitle{
         position: absolute;
         left: 6px;
         top: 6px;
         font-size: 11px;
         font-family: 'Pretendard';
         font-weight: 400;
         color: #808080;
     }

    .hscsSbmt {
         display: block;
         width: 55px;
         height: 55px;
         background: #19A5FF;
         color: #fff;
         position: absolute;
         top: 20px;
         right: 0px;
         bottom: 20px;
         -webkit-border-radius: 4px;
         -moz-border-radius: 4px;
         border-radius: 4px;
         cursor:pointer;
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
         font-family: 'Pretendard';
     }
    .hscsSbmt > span > span:hover{
         background: #19A5FF;
         border-radius:4px;
    }
    #hscsSbmting {cursor: wait;}

    .hscExl {
         display: flex;
         flex-flow: row-reverse;
         margin-top: 28px;
         /* margin-right: 24px; */
     }
    .hscExl li {
         display: flex;
         margin-right: 18px;
         align-items: center;
     }
    .hscExl li a {
         display: block;
         height: 32px;
         line-height: 30px;
         color: #000000;
         /* padding: 0 15px; */
         text-align: center;
         font-size: 13px;
         -webkit-border-radius: 4px;
         -moz-border-radius: 4px;
         border-radius: 4px;
         cursor:pointer;
         font-size: 14px;
         font-family: 'Pretendard';
         font-weight: 400;
     }
    .hscExl li a.all {  }
    .hscExl li a.exl {
         /* background: #1f7244; border-color: #1f7244; color: #fff; */
    }
    .downIcon{
         display: inline-block;
         width: 18px;
         height: 18px;
         background: url(${ ExcelDown })no-repeat center center;
         margin-right: 6px;
     }
    /* .entireArea{ }
    .entireArea:hover{
         background: #225789;
         cursor: pointer;
     } */
    .sensorHistorySelect{
         display: block;
         width: 105px;
         height: 48px;
         background: none;
         text-align: center;
         border-radius: 0px;
         padding: 0;
         color: #fff;
         background: url(${ TheadArrowBtn })no-repeat 84% 50%;
     }
     .sensorHistorySelect:hover{
         background: #225789 url(${ TheadArrowBtn })no-repeat 84% 50%;
         cursor: pointer;
     }
     .sensorHistorySelect > option{
         color: #000000;
         background: #F5F5F5;
     }
     /* .theadArrowIcon{
         display: inline-block;
         width: 12px;
         height: 12px;
         background: url(${ TheadArrowBtn })no-repeat center center;
         margin-left: 4px;
         background-position-y: 5px;
     } */
    .hscTb {
         background: #fff;
         /* padding: 30px 20px; */
         margin-top: 10px;
         -webkit-border-radius: 4px;
         -moz-border-radius: 4px;
         border-radius: 4px;
     }
    .hscTb table {
         border-top: solid 2px #333;
     }
    .hscTb tr:hover {
         /* background: #fafafa; */
     }
    .hscTb th,
    .hscTb td {
         padding: 0px 5px;
         border-bottom: solid 1px #dddddd6e;
         font-size: 14px;
         text-align: center;
         font-family: 'Pretendard';
     }
    .hscTb th {
         /* background: #f5f5f5; */
         font-weight: 500;
         font-family: 'Pretendard';
         height: 48px;
         line-height: 46px;
     }
    .hscTb td {
         font-family: 'Pretendard';
         height: 48px;
         vertical-align: middle;
     }
    .hscTb input[type="checkbox"] {
         background: #fff;
         width: 18px;
         height: 18px;
    }
    .hscTb input[type="checkbox"]:checked {
         background: url(${ CheckBoxFill })no-repeat center center;
         background-size: 18px auto !important;
     } 
    .hscTb td select {
         display: inline-block;
     }
    .hscTb td a {
         display: inline-block;
         height: 28px;
         line-height: 26px;
         font-size: 13px;
         padding: 0 10px;
         -webkit-border-radius: 4px;
         -moz-border-radius: 4px;
         border-radius: 4px;
     }

    .scrTb {
         font-family: 'Pretendard';
         font-weight: 400;
     }
    .scrTb table {
         min-width: 1400px;
     }
    .scrTb table thead {
        background: #26395B;
        height: 44px;
        line-height: 30px;
        color: #fff;
    }
    .scrTb td{
        text-overflow:ellipsis;
        white-space:nowrap;
        overflow:hidden;
        cursor:pointer;
        color: #000000;
        font-family: 'Pretendard';
        font-weight: 400;
     }
    .scrTb td > input[type="checkbox"]{
        display: inline-block;
        width: 18px;
        height: 18px;
        border: solid 1px #000000;
        border-radius: 2px;
     }
    .scrTb td > input[type="checkbox"]:checked {  }

    .detectHTd input[type=checkbox]{
        cursor:pointer;
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        appearance: none;
        background: url(${ CheckBoxDisable })no-repeat center center;
        background-size: 16px;
     }
    .detectHTd input[type=checkbox]:checked{
        display: inline-block;
        width: 18px;
        height: 18px;
        background: url(${ CheckBoxActive })no-repeat center center;
        background-size: 18px;
     }
    .whiteCheckBox input[type=checkbox]{
        cursor:pointer;
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        appearance: none;
        background: url(${ CheckBoxWhite })no-repeat center center;
        background-size: 18px;
     }
    .whiteCheckBox input[type=checkbox]:checked{
        display: inline-block;
        width: 18px;
        height: 18px;
        background: url(${ CheckBoxWhiteFill })no-repeat center center;
        background-size: 18px;
     }
    .HisMemoOn {
        display: block;
        height: 20px;
        width: 40px;
        background: url(${ HistoryMemoOn })no-repeat center center;
        background-position: 50%;
	    background-position-y: 1px;
        background-size: 28px;
        margin: 0 auto;
     }
    .HisMemoOff {
        display: block;
        height: 18px;
        width: 18px;
        background: url(${ MemoIcon })no-repeat center center;
        background-position: 50%;
	    background-position-y: 1px;
        background-size: 18px;
        height: 20px;
        width: 40px;
        margin: 0 auto;
     }

    .hscNav {
        text-align:center;
        margin-top: 40px;
        position: absolute;
        bottom: 50px;
        left: 53%;
     }
    .hscNav a {
        display: inline-block;
        vertical-align: middle;
        width: 28px;
        height: 28px;
        line-height: 26px;
        background: #fff;
        position: relative;
		font-size: 14px;
        font-family: 'Pretendard';
        font-weight: 400;
        color: #000000;
     }
    .hscNav > a {
        text-indent:-9999px;
     }
    .hscNav a.first {
        background: url(${ PagingFirst })no-repeat center center;
        cursor:pointer;
     }
    .hscNav a.prev {
        background: url(${ PagingPrev })no-repeat center center;
        cursor:pointer;
        margin-right: 10px;
     }
    .hscNav a.next {
        background: url(${ PagingNext })no-repeat center center;
        cursor:pointer;
        margin-left: 6px;
     }
    .hscNav a.last {
        background: url(${ PagingLast })no-repeat center center;
        cursor:pointer;
     }
    .hscNav a.firstDisable {
        background: url(${ PagingFirstDisable })no-repeat center center;
     }
    .hscNav a.prevDisable {
        background: url(${ NavigateLeft })no-repeat center center;
        margin-right: 10px;
     }
    .hscNav a.nextDisable {
        background: url(${ NavigateRight })no-repeat center center;
        margin-left: 10px;
     }
    .hscNav a.lastDisable {
        background: url(${ PagingLastDisable })no-repeat center center;
     }
    .hscNav ul {
        display:inline-block;
        vertical-align:middle;
        cursor:pointer;
     }
    .hscNav ul li {
        display:inline-block;
        vertical-align:middle;
        position: relative;
        margin-right: 6px;
     }
    .hscNav ul li:before {
        content: '';
        display: block;
        width: 1px;
        height: 12px;
        background: #e2e2e2;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -6px;
    }
    .hscNav ul li.on a {
        /* font-weight: 700; */
        color: #fff;
        background: #19A5FF;
        border-radius: 5px;
    }
    
`;


/**********************************************************************/


export const _SensorDetectAnalysisUI = {
    busan: {


    },
    yeosu: {


    }
}

export const SensorDetectAnalysisUI = styled(SensorDetectHistoryUI)`
    .hscWngBack{
        display: block;
        width: 100%;
        height: 277px;
        box-shadow: 1px 1px 5px 4px #F5F5F5;
        margin-bottom: 20px;
        border-radius: 5px;
     }
    .hscWng {
        background: #fff;
        /* border: solid 1px #ddd; */
        padding: 20px;
        margin-top: 10px;
        text-align: center;
        font-size: 12px;
        font-weight: 500;
        font-family: 'Pretendard';
		-webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }
   .hscWng span {
        color: #19A5FF;
        font-size: 16px;
        font-family: 'Pretendard';
        font-weight: 400;
    }
   .hscCht {
        background: #fff;
        /* border: solid 1px #ddd; */
        padding: 20px;
        margin-top: 10px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }
   .hscCht > div {
        padding:100px;
        text-align:center;
    } 


`;


/**********************************************************************/


export const _SOPHistoryUI = {
    busan: {


    },
    yeosu: {


    }
}

export const SOPHistoryUI = styled(SensorDetectHistoryUI)`
    .hscsHalf {
         /* margin-bottom: 10px; */
         /* padding-right: 200px; */
         /* width: 300%; */
         display: flex;
     }
    .hscsHalf:after {
         content: '';
         display: table;
         clear: both;
     }
    .hscsHalf > li {
         float: left;
         /* width: 25%; */
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
        height: 32px;
        font-size: 13px;
        padding-left: 10px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
     }
    .dangerTypeBox{
        display: block;
        width: 143px;
        height: 54px;
        border-radius: 5px;
        /* margin-right: 10px; */
        position: relative;
     }
    .dangerTypeTitle{
        position: absolute;
        left: 6px;
        top: 6px;
        font-size: 11px;
        font-family: 'Pretendard';
        font-weight: 400;
        color: #808080;
     }
    .dangerTypeSelect{
        display: block;
        width: 100%;
        height: 54px;
        padding-top: 14px;
        font-size: 13px;
        background: url(${HistorySelect}) no-repeat 92% 70%;
        font-family: 'Pretendard';
     }
    .modeBox{
        display: block;
        width: 143px;
        height: 54px;
        border-radius: 5px;
        /* margin-right: 10px; */
        position: relative;
    }
    .modeTitle{
        position: absolute;
        left: 6px;
        top: 6px;
        font-size: 11px;
        font-family: 'Pretendard';
        font-weight: 400;
        color: #808080;
    }
    .modeSelect{
        display: block;
        width: 100%;
        height: 54px;
        padding-top: 14px;
        font-size: 13px;
	    background: url(${HistorySelect}) no-repeat 92% 70%;
        font-family: 'Pretendard';
     }
    .writePeopleBox{
        display: block;
        width: 147px;
        height: 54px;
        border-radius: 5px;
        /* margin-right: 10px; */
        position: relative;
        padding-top: 20px;
     }
    .writePeopleTitle{
        position: absolute;
        left: 6px;
        top: 6px;
        font-size: 11px;
        font-family: 'Pretendard';
        font-weight: 400;
        color: #808080;
     }
    .writePeopleBox input[type="text"] {
        display: block;
        width: 120px;
        background: #f5f5f5;
        height: 32px;
        font-size: 13px;
        padding-left: 10px;
		-webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        border:none;
        font-family: 'Pretendard';
     }
    .startTimeBox{
        display: block;
        /* width: 237px; */
        height: 54px;
        border-radius: 5px;
        /* margin-right: 10px; */
        position: relative;
     }
    .startTimeTitle{
        position: absolute;
        left: 6px;
        top: 6px;
        font-size: 11px;
        font-family: 'Pretendard';
        font-weight: 400;
        color: #000000;
     }
`;

