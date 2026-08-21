
import styled from 'styled-components';
import ProjectResource from '../../Root/resource/id';
//import HistoryStyled from '../../History/styled/HistoryStyled';

import HistorySelect from '../../Common/img/sub/history_select.png';
import DashboardCalendarBK from '../../Common/img/sub/dashboard_calendar_bk.png';
import ExcelDown from '../../Common/image/icon/excel_Down.png';
import TheadArrowBtn from '../../Common/image/icon/theadArrowBtn.png';
import ExcelFile from '../../Common/image/icon/excelFile.png';
import Fullscreen from '../../Common/image/icon/fullscreen.png';
import downSizeScreen from '../../Common/image/icon/downSizeScreen.png';
import ascendingDownIcon from '../../Common/image/icon/ascendingDownIcon.png';
import ascendingIcon from '../../Common/image/icon/ascendingIcon.png';
import CheckBoxFill from '../../Common/image/icon/checkBox_Fill.png';
import CheckBoxWhite from '../../Settings/image/checkbox_white.png';
import CheckBoxWhiteFill from '../../Settings/image/checkbox_white_checked.png';

import PagingFirst from '../../Common/img/common/paging_first.png';
import PagingPrev from '../../Common/img/common/navigate_left.png';
import PagingNext from '../../Common/img/common/navigate_right.png';
import PagingLast from '../../Common/img/common/paging_last.png';
import PagingFirstDisable from '../../Common/img/common/paging_first_disable.png';
import NavigateLeft from '../../Common/image/icon/navigate_Left.png';
import NavigateRight from '../../Common/image/icon/navigate_Right.png';
import PagingLastDisable from '../../Common/img/common/paging_last_disable.png';
import ArrowDown from '../../Common/image/icon/arrowDown.png';

export const ReportComponent = styled.div`
     height:100vh;
     margin: 0;
     padding:0;
     background-color:#ffffff;
     padding-left: 40px;
     padding-top: 121px;

    .hsScr {
         height: 100vh;
         /* margin-left: 40px;
         margin-top: 121px; */
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
         margin-bottom: 41px;
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
         margin-right: 20px;
     }
    .hscSch dl:first-child {
         margin-top: 0;
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
    .measuringBox{
         display: block;
         width: 358px;
         height: 54px;
         border-radius: 5px;
         /* margin-right: 10px; */
         position: relative;
     }
    .measuringTitle{
         position: absolute;
         left: 6px;
         top: 6px;
         font-size: 11px;
         font-family: 'Pretendard';
         font-weight: 400;
         color: #808080;
     }
    .measuringSelect{
         display: block;
         width: 100%;
         height: 54px;
         padding-top: 14px;
         font-size: 14px;
		 background: url(${ HistorySelect})no-repeat 96% 70%;
         font-family: 'Pretendard';
     }
     .measuringSelect > option{
         font-size: 14px;
         font-weight: 400;
         font-family: 'Pretendard';

         background: #F5F5F5;
         color: #000000;
         height: 48px;
         line-height: 48px;
     }
    .measuringPlaceBox{
         display: block;
         width: 532px;
         height: 54px;
         border-radius: 5px;
         position: relative;
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

     /* selectbox test */

    .measuringPlaceSelect {
         display: block;
         width: 100%;
         height: 54px;
         border-color: #ddd;
         font-size: 14px;
         padding-right: 22px;
		 background: url(${HistorySelect})no-repeat 96% 70%;
         /* background-position: right 8px center; */
         padding-top: 14px;
         font-family: 'Pretendard';
         cursor: pointer;
     }
    .measuringPlaceTitle{
         position: absolute;
         left: 6px;
         top: 6px;
         font-size: 11px;
         font-family: 'Pretendard';
         font-weight: 400;
         color: #808080;
     }
    .measuringPlaceSelect select {
        width: 100%;
        background: #f5f5f5 url(${HistorySelect})no-repeat 100% 70%;
        font-weight: 500;
        font-size: 14px;
    }
    .measuringPlaceSelect option {
        width: 100%;
    }
    .overSelect {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }

    #multiselectCheckboxes{
        display: flex;
        flex-direction: column;
        width: 100%;
        background: #fff;
        z-index: 1;
        position: absolute;
        left: 0px;
        top: 54px;
        border: solid 1px #f5f5f5;
        background: #f5f5f5;
    }
    #multiselectCheckboxes label {
        display: flex;
        align-items: center;
        color: #000000;
        height: 35px;
        line-height: 35px;
        font-size: 14px;
        margin-left: 0px;
        padding-left: 10px;
    }
    #multiselectCheckboxes label:hover {
       /* background: #225789 url(${ CheckBoxWhite })no-repeat;
        background-position-x: 10px;
        background-position-y: 10px;
        background-size: 12px; */
        background: #225789;
        color: #fff;
        font-size: 14px;
    }
    #multiselectCheckboxes.selected{
        background: #CFCFCF;
        color: #000000;
        font-size: 14px;
    }
    #multiselectCheckboxes input[type=checkbox] {
        display:inline-block;
        width: 14px;
        height: 14px;
        margin-right: 22.5px;
        border: solid 1px #000000;
        border-radius: 0;
        font-size: 14px;
    }
    #multiselectCheckboxes input[type=checkbox]:checked{
        width:14px;
        height:14px;
        background: url(${ CheckBoxFill })no-repeat center center;
        background-position: center;
    }

    /* #multiselectCheckboxes input[type=checkbox]:hover {
         border: 1px solid #fff; 
         background: #225789; 
    }

    #multiselectCheckboxed input[type=checkbox]:checked:hover{
        display: inline-block;
        width:14px;
        height:14px;
        background: url(${ CheckBoxWhiteFill })no-repeat center center;
        background-position: center;
    } */

    .measuringData{
         display: block;
         width: 256px;
         height: 54px;
         border-radius: 5px;
         position: relative;
     }

    .measuringDataSelect {
         display: block;
         width: 100%;
         height: 54px;
         border-color: #ddd;
         font-size: 14px;
         padding-right: 22px;
		 /* background: url(${HistorySelect})no-repeat 96% 70%; */
         /* background-position: right 8px center; */
         padding-top: 14px;
         font-family: 'Pretendard';
         cursor: pointer;
     }
    .measuringDataTitle{
         position: absolute;
         left: 6px;
         top: 6px;
         font-size: 11px;
         font-family: 'Pretendard';
         font-weight: 400;
         color: #808080;
     }
    .measuringDataSelect select {
        width: 100%;
        background: #f5f5f5 url(${HistorySelect})no-repeat 100% 70%;
        font-weight: 500;
        font-size: 14px;
    }
    .measuringDataSelect option {
        width: 100%;
    }

    #dataSelectCheckboxes{
        display: flex;
        flex-direction: column;
        width: 100%;
        z-index: 1;
        position: absolute;
        left: 0px;
        top: 54px;
        border: solid 1px #f5f5f5;
        background: #F5F5F5;
    }
    #dataSelectCheckboxes label {
        display: flex;
        align-items: center;
        color: #000000;
        height: 35px;
        line-height: 35px;
        font-size: 14px;
        margin-left: 0px;
        padding-left: 10px;
    }
    #dataSelectCheckboxes label:hover {
       /* background: #225789 url(${ CheckBoxWhite})no-repeat;
        background-position-x: 10px;
        background-position-y: 10px;
        background-size: 12px; */
        background: #225789;
        color: #fff;
        font-size: 14px;
    }
    #dataSelectCheckboxes.selected{
        background: #CFCFCF;
        color: #000000;
        font-size: 14px;
    }
    #dataSelectCheckboxes input[type=checkbox] {
        display:inline-block;
        width: 14px;
        height: 14px;
        margin-right: 22.5px;
        border: solid 1px #000000;
        border-radius: 0;
        font-size: 14px;
    }
    #dataSelectCheckboxes input[type=checkbox]:checked{
        width:14px;
        height:14px;
        background: url(${CheckBoxFill})no-repeat center center;
        background-position: center;
    }

    /* #dataSelectCheckboxes input[type=checkbox]:hover {
         border: 1px solid #fff; 
         background: #225789; 
    }

    #dataSelectCheckboxes input[type=checkbox]:checked:hover{
        display: inline-block;
        width:14px;
        height:14px;
        background: url(${CheckBoxWhiteFill })no-repeat center center;
        background-position: center;
    } */

    .aggregationMethod{
         display: block;
         width: 256px;
         height: 54px;
         border-radius: 5px;
         position: relative;
    }
    .aggregationMethod > select{
         width: 256px;
         height: 54px;
         background: #f5f5f5;
         font-size: 14px;
         font-weight: 500;
         padding-top: 16px;
    }
    .aggregationMethodTitle{
         position: absolute;
         left: 6px;
         top: 6px;
         font-size: 11px;
         font-family: 'Pretendard';
         font-weight: 400;
         color: #808080;
     }

    .aggregationDayBox{
         display: block;
         width: 283px;
         height: 54px;
         border-radius: 5px;
         position: relative;
    }
    .aggregationDayTitle{
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
         padding-right: 25px;
         border:none;
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
         font-size: 14px;
         padding-left: 10px;
		 -webkit-border-radius: 4px;
         -moz-border-radius: 4px;
         border-radius: 4px;
         font-family: 'Pretendard';
     }
    .hscsDatee .datepicker input[type="text"] + label {
         background: url(${DashboardCalendarBK})no-repeat center center;
     }
    .btnCalendarBk {
         width: 17px;
         height: 17px;
         display: inline-block;
         z-index: 1;
         position: absolute;
         right: -30px;
         top: 8px;
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
         background: url(${ExcelDown})no-repeat center center;
         margin-right: 6px;
     }
    .entireArea{ }
    .entireArea:hover{
         background: #225789;
         cursor: pointer;
     }
    .theadArrowIcon{
         display: inline-block;
         width: 12px;
         height: 12px;
         background: url(${TheadArrowBtn })no-repeat center center;
         margin-left: 4px;
         background-position-y: 5px;
     }

`;


export const ReportListComponent = styled.div`
    display: inline-flex;
    flex-direction: column;

    ${props => {
        if(props.$layout === 0)
            return `width: calc(100% - 560px);`
        else if(props.$layout === 1)
            return `width: 100%;`
        else if(props.$layout === 2)
            return `width: 0;`
    }}

    height: calc(100vh - 290px);
    background: #F5F5F5;
    border-radius: 5px;
    margin-right: ${props => props.$layout === 0 ? '20px' : '0'};
    position: relative;
    transition: all .9s ease-in-out;

    -ms-user-select: none;
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    user-select: none;

    .reportListTable{
        display: block;
        width: 100%;
        height: 100%;
    }
    .reportListTitle{
        display: block;
        width: 100%;
        height: 48px;
        line-height: 48px; 
        background: #26395B;
        border-radius: 5px 5px 0px 0px;
    }
    .reportListTitle > tr{
        display: flex;
        width: 100%;
        height: 48px;
        line-height: 48px;
    }
    .reportListTitle > tr > th{
        text-align: left;
        padding-left: 20px;
        font-size: 14px; 
    }
    .reportListTbody{
        display: block;
        width: 100%;
        color: #000000;
        overflow-y: auto;
        height: calc(100% + 20px);
        margin-top: 2px;
        
        &::-webkit-scrollbar {
            width: 4px;
            border-radius: 5px;
            background-color: #f5f5f5;
        }
        &::-webkit-scrollbar-thumb {
            width: 4px;
            border-radius: 5px;
            background: #26395B; 
        }
        &::-webkit-scrollbar-button{
            width: 0px;
            height: 0px;
        }
    }
    .reportListTbody > tr{
        display: flex;
        width: 100%;
        height: 48px;
        line-height: 48px;
        border-bottom: solid 1px #DCDCDC;
    }
    .reportListTbodyTr{
        display: flex;
        width: 100%;
        height: 48px;
        line-height: 48px;
        border-bottom: solid 1px #DCDCDC;
        cursor: pointer;

        &.on {
            .reportArrowIcon {
                background: url(${ ArrowDown })no-repeat center center;
                transform: rotate(180deg);
                transition: all .2s;
            }
        }
    }
    .reportListTbody > tr > td{
        text-align: left;
        padding-left: 20px;
        font-size: 14px;
    }
    .reportListTbodyTrTd{
        text-align: left;
        padding-left: 20px;
        font-size: 14px;
    }
    .excelIcon{
         display: inline-block;
         width: 18px;
         height: 48px;
         background: url(${ ExcelFile })no-repeat center center;
         cursor: pointer;
         margin-right: 20px;
    }
    .wideScreenIcon{
         display: inline-block;
         width: 18px;
         height: 48px;
         background: url(${ Fullscreen })no-repeat center center;
         cursor: pointer;
         padding-right: 20px;
         margin-right: 20px;
    }
    .wideScreenIcon2{
         display: inline-block;
         width: 18px;
         height: 48px;
         background: url(${ Fullscreen })no-repeat center center;
         cursor: pointer;
         padding-right: 20px;
    }

    .downSizeScreenIcon {
        display: inline-block;
        width: 18px;
        height: 48px;
        background: url(${ downSizeScreen })no-repeat center center;
        cursor: pointer;
        padding-right: 20px;
    }

    .reportArrowIcon{
        display: inline-block;
        width: 14px;
        height: 48px;
        background: url(${ ArrowDown })no-repeat center center;
        cursor: pointer;
        padding-right: 20px; 
        transition: all .2s;
    }

    .reportTdContents{
        display: none;
        height: 358px;
        margin: 20px;
        overflow: scroll;

        &::-webkit-scrollbar {
            width: 4px;
            border-radius: 5px;
            background-color: #f5f5f5;
        }
        &::-webkit-scrollbar-thumb {
            width: 4px;
            border-radius: 5px;
            background: #26395B; 
        }
        &::-webkit-scrollbar-button{
            width: 0px;
            height: 0px;
        }

        &.showTable {
            display: block;

            .reportListTbodyTr {
                cursor: default;
            }
        }
    }

    .reportInnerTable{
        width: calc(100% - 10px);
        height: auto;
        border-left: solid 1px #DCDCDC;
        border-right: solid 1px #DCDCDC;
        border-bottom: solid 1px #DCDCDC;
        background: #fff;
        margin-right: 4px;
        margin-top: 2px;
    }
    .reportInnerTitle{
        /* display: block;
        width: 100%; */
        height: 40px;
        line-height: 40px;
    }
    .reportInnerTitle > tr{
        display: flex;
        width: 100%;
        height: 40px;
        line-height: 40px;
    }
    .reportInnerTitle > tr > th{
        display: flex;
        justify-content: center;
        width: 100%;
        min-width: 180px;
        text-align: left;
        font-size: 14px;
        border-right: solid 1px #DCDCDC;
        border-top: solid 1px #DCDCDC;
        border-bottom: solid 1px #DCDCDC;
        background: #fff;
    }
    .reportInnerTitle > tr > th:last-child{
        border-right: none;
    }
    .reportInnerTitle > tr > th > p{
        margin-right: 4px;
    }
    .reportInnerTbody{
        color: #000000;
    }
    .reportInnerTbody > tr{
        display: flex;
        width: 100%;
        height: 60px;
        line-height: 60px;
        align-items: center;

        &:not(:last-child) td {
            border-bottom: solid 1px #DCDCDC;
        }
    }
    .reportInnerTbody > tr > td{
        text-align: center;
        width: 100%;
        min-width: 180px;
        height: 60px;
        line-height: 60px;
        font-size: 14px;
        background: #fff;
        white-space: nowrap;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
    } 
    .reportInnerTbodyTr{
        display: flex;
        width: 100%;
        height: 60px;
        line-height: 60px;
        align-items: center;
    }
    .reportInnerTbodyTrTd{
        width: 100%;
        min-width: 117px;
        height: 60px;
        line-height: 60px;
        text-align: left;
        padding-left: 20px;
        font-size: 14px;
        border-bottom: solid 1px #DCDCDC;
    }
    .reportInnerTbody > tr > td:nth-child(1){
        display: flex;
        flex-direction: column;
        /* line-height: normal; */
        height: 60px;
        vertial-align: middle;
        padding-top: 10px;
    }
    .reportInnerTbody > tr > td > p{
        font-size: 14px;
        height: 20px;
        line-height: 20px;
    }
     .ascendingOrderIcon{
         display: inline-block;
         width: 14px;
         height: 39px;
         background: url(${ ascendingDownIcon })no-repeat center center;
         cursor: pointer;
     }
     .descendingOrderIcon{
         display: inline-block;
         width: 14px;
         height: 39px;
         background: url(${ ascendingIcon })no-repeat center center;
         cursor: pointer;
     }

    .hscNav {
        text-align:center;
        position: absolute;
        left: 45%;
        bottom: 20px;
     }
    .hscNav a {
        display: inline-block;
        vertical-align: middle;
        width: 28px;
        height: 28px;
        line-height: 26px;
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
        background: url(${ PagingFirst})no-repeat center center;
        cursor:pointer;
     }
    .hscNav a.prev {
        background: url(${PagingPrev})no-repeat center center;
        cursor:pointer;
        margin-right: 10px;
     }
    .hscNav a.next {
        background: url(${PagingNext})no-repeat center center;
        cursor:pointer;
        margin-left: 6px;
     }
    .hscNav a.last {
        background: url(${PagingLast})no-repeat center center;
        cursor:pointer;
     }
    .hscNav a.firstDisable {
        background: url(${PagingFirstDisable})no-repeat center center;
     }
    .hscNav a.prevDisable {
        background: url(${NavigateLeft})no-repeat center center;
        margin-right: 10px;
     }
    .hscNav a.nextDisable {
        background: url(${NavigateRight})no-repeat center center;
        margin-left: 10px;
     }
    .hscNav a.lastDisable {
        background: url(${PagingLastDisable })no-repeat center center;
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


export const ReportGraphComponent = styled(ReportListComponent)`
    display: inline-flex;

    ${props => {
        if(props.$layout === 0)
            return `width: calc(100% - 100px);`
        else if(props.$layout === 1)
            return `width: 0;`
        else if(props.$layout === 2)
            return `width: 100%;`
    }}

    height: calc(100vh - 290px);
    background: #F5F5F5;
    border-radius: 5px;
    margin-right: 0;
    transition: all .9s ease-in-out;
    overflow: hidden;

    .reportGraphTitle{
        display: flex;
        flex-direction: row-reverse;
        width: 100%;
        height: 48px;
        background: #26395B;
        border-radius: 5px 5px 0px 0px;
        padding-right: 20px;
    }
    .reportGraphContents{
        display: block;
        height: calc(100vh - 290px);
        padding: 20px;
        margin-top: 2px;
        overflow-x: hidden;
        overflow-y: scroll;
        text-align: center;

        &::-webkit-scrollbar {
            width: 4px;
            border-radius: 5px;
            background-color: #ffffff;
        }
        &::-webkit-scrollbar-thumb {
            width: 4px;
            border-radius: 5px;
            background: #26395B;
        }
        &::-webkit-scrollbar-button{
            width: 0px;
            height: 0px;
        }
    }

    .reportGraphBox{
       display: inline-block;
       margin-right: 10px;
       margin-bottom: 20px;
       text-align: left;
    }
    .reportGraphBox > span{
       display: block;
       font-size: 16px;
       color: #000000;
       margin-bottom: 10px;
    }
    .reportGraphArea{
       display: block;
       /* width: 499px; */
       width: 490px;
       height: 401px;
       border: solid 1px #DCDCDCF7;
       background: #FFFFFF;
    }
    .reportGraphPolarArea{
       display: block;
       /* width: 499px; */
       width: 490px;
       height: 259px;
       border: solid 1px #DCDCDCF7;
       background: #FFFFFF;
    }
`;