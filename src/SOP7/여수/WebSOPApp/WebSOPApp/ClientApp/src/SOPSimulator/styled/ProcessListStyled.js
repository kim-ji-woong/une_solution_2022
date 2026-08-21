
import styled from 'styled-components';
import ProjectResource from '../../Root/resource/id';


import MenualArrow from '../../SOPSimulator/img/arrowDown_icon.png';
import LeftWhite from '../../Common/image/icon/leftWhite-01.png';

import CheckboxActive from '../../SOPSimulator/img/checkBox_active.png';
import CheckboxDisableS from '../../Settings/image/checkBox_disable.png';
import CheckboxActiveS from '../../Settings/image/checkBox_active.png';


export const _SubSectionSopInfoProgressHistoryWrap = {
    busan: {
        divWidth: '151px',
        divHeight: '41px',
    },
    yeosu: {
        divWidth: '151px',
        divHeight: '41px',
    }
}

export const SubSectionSopInfoProgressHistoryWrap = styled.div`
    float:left;
    height:calc(100% + 5px);
    border-radius:4px;
    background: #0D2348 !important;

    position:absolute;
    left:0px;
    width:300px;
    height:calc(100% - 15px);
    margin-right:20px;
    transition:left .5s ease-in-out;
    background: #26395B !important;
    border-top-right-radius: 30px;
    padding-top: 36px;

   .tit{
       position:relative;
       padding-right:40px;
   }
   .btnToggle{
       position:absolute;
       top:0;
       right:0;
       width:40px;
       height:60px;
       text-align:center;
	   background-color:#ff8500;
       border-top-right-radius:4px;
       transition:right .5s ease-in-out;
    }
   .btnToggle .iconArrowLeft{
       display:block;
       width:28px;
       height:28px;
       background: url(${ LeftWhite })no-repeat center center;
       background-size: 25px;
       background-position-x: 7px;
       background-position-y: 2px;
    }

    .list dt{
       display: flex;
       padding: 20px 23px 10px 23px;
    }
    .leftBorder{
        display: inline-flex;
        flex: 1;
        border-left: solid 3px #39a7de;
        padding-left: 14px;
        font-family: 'Pretendard';
        font-weight: 400;
        font-size: 18px;
    }
    .menualArrow{
        display:inline-block;
        width: 20px;
        height: 20px;
        cursor: pointer; 
        background: url(${ MenualArrow })no-repeat center center;
    }

   .list dd{ /* padding: 16px 40px; */ }
   .isShow dd{
       display: block;
   }
   .list dd > ul > li{
        line-height: 32px;
        font-family: 'Pretendard';
        font-weight: 400;
        font-size: 14px;
        padding: 4px 40px;
   }
   .list dd > ul > li:hover{
       /* background: #225789; */
   }
   .list li.is-active a:before,
   .list li a:hover:before{
       /* background-color:#ff8500; */
   }
   .list li.is-active a,

    
   .missionAddBox dd li input[type=checkbox] {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        border: solid 1px #ddd;
        cursor: pointer;
        margin-right: 10px;
        position: relative;
        border-radius: 2px;
        background: none;
    }
   .missionAddBox dd li input[type=checkbox]:checked {
        background: url(${ CheckboxActive })no-repeat center center;
        background-size: 18px auto !important;
        border: solid 1px #19a5ff;
    }
   .missionAddBox dd li input[type=checkbox] + label {
        display: inline;
        vertical-align: middle;
        /* margin-left: 7px; */
        font-weight: 500;
        cursor: pointer;
        color: #fff;
        font-family: 'dotum', sans-serif;
        font-size: 12px;
    }

   .missionSelectBox{
        max-height: 160px;
        overflow-y: auto;
    }
   .missionSelectBox input[type=checkbox]{
        cursor:pointer;
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        appearance: none;
        background: url(${ CheckboxDisableS })no-repeat center center;
        background-size: 16px;
     }
    .missionSelectBox input[type=checkbox]:checked{
        display: inline-block;
        width: 18px;
        height: 18px;
        background: url(${ CheckboxActiveS })no-repeat center center;
        background-size: 16px;
     }
    .missionSelectBox input[type=checkbox] + label {  }


    .missionSelectBox li input[type=checkbox]{
        cursor:pointer;
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        appearance: none;
        background: url(${ CheckboxDisableS })no-repeat center center;
        background-size: 16px;
        margin-right: 10px;
     }
    .missionSelectBox li input[type=checkbox]:checked{
        display: inline-block;
        width: 18px;
        height: 18px;
        background: url(${ CheckboxActiveS })no-repeat center center;
        background-size: 16px;
     }

`;


/**********************************************************************/


export const _InnerSectionnn = {
    busan: {
        divHeight: '100%',
    },
    yeosu: {
        divHeight: '100%',
    }
}

export const InnerSectionnn = styled.div`
     max-height: 220px;
     overflow-y: auto;

     .numList{
        /* background-color: #1e2633; */
     }
     .numList li{
        /* border-bottom: 1px solid #d1d1d1; */
        padding: 4px 0px;
        font-family: 'Pretendard';
        font-size: 14px;
     }
    .numList .btnList{
        display:table;
        width:100%;
        /* padding-top:10px;
        padding-bottom:10px; */
        padding-left:50px;
        padding-right:30px;
     }
    .numList .btnList > span:nth-child(1){
        width: 100px;
        font-family: 'Pretendard';
        font-size: 14px;
     }
    .numList .btnList > span:nth-child(2){
        width: 60px;
        font-family: 'Pretendard';
        font-size: 14px;
     }
    .numList .btnList:last-child{
        border: none;
    }
    .numList .btnList:before{
        top:2px;
        left:20px;
        font-weight:500;
     }
    .numList .btnList span{
        display:table-cell;
        font-weight:500;
        font-size: 14px;
     }
    .numList .btnList span:not(.text){
        text-align:center;
        font-size: 14px;
    }
    .numList .btnList .text{
        max-width:100px;
        white-space: nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
        font-size: 14px;
    }
    .numList .detailInfo{
        display:none;
        background-color:#0e1829;
    }
    .numList .detailInfo > span{
        display:table-cell;
        width:50%;
        padding:20px;
        line-height:20px;
        font-weight:300;
        vertical-align:middle;
        word-break:keep-all;
     }
    .numList .isShow .btnList:after{
        transform:rotateX(180deg);
    }

    .numList{
        counter-reset:number
     }
    .numList a{
        position:relative;
        padding-left:16px;
    }
    .numList a:before{
        counter-increment:number;
        content:counters(number, '.')". ";
        position:absolute;
        top:0;
        left:0;
    }
`;