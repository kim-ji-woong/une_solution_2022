
import styled from 'styled-components';
import ProjectResource from '../../Root/resource/id';



import CheckboxDisable from '../../Settings/image/checkBox_disable.png';
import CheckboxActive from '../../Settings/image/checkBox_active.png';
import SettingInformation from '../../Common/img/sub/setting_information.png';
import SelectArrow from '../../Common/img/common/select_arrow.png';
import SettingIcon from '../../Settings/image/settingIcon.png';
import DashboardLayerClose from '../../Common/img/sub/dashboard_layer_close.png';
import TreeArrowRight from '../../Settings/image/treeArrow_right.png';
import TreeArrowLeft from '../../Settings/image/treeArrow_left.png';
import OnoffIcon from '../../Settings/image/onoffIcon.png';
import TreeArrowIcon from '../../Settings/image/treeArrow_icon.png';
import TrashIcon from '../../Settings/image/trashIcon.png';


export const _SettingCommon = {
    busan: {


    },
    yeosu: {


    }
}

export const SettingCommon = styled.div`

    .stgList{ }
    .stgList .stgName:last-child {
         margin-bottom: 0;
     }

     .stgName input[type="checkbox"] {
         cursor:pointer;
         display: inline-block;
         vertical-align: middle;
         width: 19px;
         height: 19px;
         appearance: none;
         background: url(${ CheckboxDisable })no-repeat center center;
         background-size: 16px;
     }
    .stgName input[type="checkbox"]:checked{
         display: inline-block;
         width: 19px;
         height: 19px;
         background: url(${ CheckboxActive })no-repeat center center;
         background-size: 16px;
     }
    .stgName {
         /* border-bottom: dashed 1px rgba(165,165,165,1); */
         border-bottom: dashed 1px #707070;
         padding-bottom: 15px;
         margin-bottom: 15px;
     }
    .stgName:last-child{
         border:none;
     }
    .stgName.bdNon {
         border-bottom: none;
     }
    .stgName:after {
         content: '';
         display: table;
         clear: both;
     }
    .stgName h5 {
         display: inline-block;
         line-height: 32px;
         vertical-align: middle;
         color: #fff;
         font-family: 'Pretendard';
         font-size: 17px;
         font-weight: bold;
     }
    .stgName select {
         display: inline-block;
         width: 100px;
         /* border-color: #474b69; */
         cursor:pointer;
     }

    .stgTltp {
	    display: inline-block;
        vertical-align: middle;
        width: 16px;
        height: 16px;
        text-align: center;
	    line-height: 14px;
        color: #fff;
        font-size: 10px;
        margin-left: 5px;
        margin-right: 10px;
	    border: solid 1px #ddd;
        cursor: help;
        position: relative;
        background: url(${ SettingInformation })no-repeat center center;
	    -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
    }
    .white {
        color: #fff;
        font-family: 'Pretendard';
        /* margin: 0px 6px; */
        font-size: 14px;
    }
    .whiteCheck {
        color: #fff;
        font-family: 'Pretendard';
        /* margin: 0px 6px; */
        font-size: 14px;
        margin-right: 10px;
    }
    .stgnRset {
        display: inline-block;
        vertical-align: middle;
        height: 23px;
        line-height: 23px;
        /* background: #232c42; */
        background-image: linear-gradient(#0099FC, #004D7E);
		color: #fff;
        padding: 0 12px;
        margin-right: 5px;
        font-family: 'Pretendard';
        font-size: 13px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        cursor:pointer;
     }
    .stgnRset:hover { }
    .stgnRset.upload:before {
         /* content: ''; */
         display: inline-block;
         width: 13px;
         height: 13px;
         vertical-align: middle;
         margin-right: 5px;
         /* background: url('../img/sub/setting_upload.png')no-repeat center center; */
     }

    .dslSel {
        display: block;
        width: 100%;
        font-family: 'Pretendard';
        height: 30px;
        padding-left: 10px;
        padding-right: 30px;
        color: #fff;
        font-size: 14px;
        font-weight: 300;
        background: #393838 url(${ SelectArrow })no-repeat 92% 50%;
     }

    .dslSel.sm {
        padding-left: 5px;
        height: 28px;
        line-height: 28px;
        font-size: 11px;
        padding-right: 20px;
        background-size: 7px auto;
        background-position: right 5px center;
    }
    .dslSel.smLarge {
        padding-left: 5px;
        width: 70px;
        height: 28px;
        font-size: 11px;
        padding-right: 20px;
        background-size: 7px auto;
        background-position: right 5px center;
    }
   .stgHalfStatus{
        display: flex;
        flex-direction: initial;
        border-bottom: dashed 1px #707070;
        padding-bottom: 15px;
        margin-bottom: 15px;
    }

`;



export const _SettingCont = {
    busan: {


    },
    yeosu: {


    }
}

export const SettingCont = styled.div`
    position: fixed;
    z-index: 102;
    background: rgba(0,0,0,0.7);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
 
    & > div {
        display: table;
        width: 100%;
        height: 100%;
    }
    & > div > div {
        display: table-cell;
        width: 100%;
        vertical-align: middle;
    }

    .stgCont {
        margin: 0 auto;
        background: rgba(12,17,28,0.85);
        /*border: solid 1px #000;*/
        width: 962px;
        height: 750px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
     } 
    .stgCont:after {
        content: '';
        display: table;
        clear: both;
     }
    .stgLft {
        float: left;
        width: 180px;
        height: 100%;
        border-right: solid 1px #000;
        /* background:#19A5FF; */
        background-image: linear-gradient(#009BFF, #0080D3, #0065A7);
        border-radius:5px;
     }
    .settingIcon{
        display: inline-block;
        width: 26px;
        height: 26px;
        background: url(${ SettingIcon })no-repeat center center;
        background-size: 26px;
        background-position: center;
        margin-right: 14px;
     }
    .stgTitle {
        font-size: 22px;
        font-family: 'Pretendard';
        font-weight: 600;
        border-bottom: dotted 1px rgba(255,255,255,0.2);
        color: #fff;
     }

    .stgMenu {}
    .stgMenu li {
        height: 48px;
        line-height: 48px;
        /* padding: 10px 0; */
        text-align:center;
     }
    .stgMenu li:last-child {
        margin-bottom: 0;
     }
    .stgMenu li a {
        display: block;
        font-size: 14px;
        color: #fff;
        position: relative;
        cursor:pointer;
        font-size: 16px;
        font-family: 'Pretendard';
        font-weight: 500;
    }
    .stgMenu li a.on {
        color: #fff;
        font-weight: 500;
        font-size: 14px;
        cursor:pointer;
        height: 48px;
        line-height:48px;
        background-color: #30334852;
        border-right: solid 2px #fff;
        font-size: 16px;
        font-family: 'Pretendard';
        font-weight: 500;
     }
    .stgMenu li a.on:after {
        content: '';
        display: block;
        height: 48px;
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -3px;
     }
    .stgRht {
        float: left;
        width: 780px;
        height: 100%;
        padding: 25px;
        position: relative;
     }
    .stgClose {
        display: block;
        width: 30px;
        height: 30px;
        position: absolute;
        right: 20px;
        top: 20px;
        text-indent: -9999px;
        background: url(${ DashboardLayerClose })no-repeat center center;
     }

     .dspBtn {
        /*padding-top: 20px;*/
        text-align: center;
        position:absolute;
        left:270px;
        top:670px;
      }
     .dspBtn li {
        display: inline-block;
        margin: 0 3px;
      }
     .dspBtn li a {
        display: block;
        width: 108px;
        height: 36px;
        line-height: 36px;
        font-family: 'Pretendard';
        font-size: 16px;
        background: #19A5FF;
        border: solid 1px #19A5FF;
        color: #fff;
       -webkit-border-radius: 7px;
       -moz-border-radius: 7px;
        border-radius: 7px;
        cursor:pointer;
      }
     .dspBtn li:first-child a {
        background: #393838;
        border-color: #393838;
        cursor:pointer;
     }
     .systemEndBtn{
        display: block; width: 179px; height: 48px; line-height: 48px;
        background: url(${ OnoffIcon })no-repeat 27% 50%;
        color: #fff;
        border-radius: 0px 0px 5px 5px; cursor: pointer; font-family: 'Pretendard'; font-weight: bold; font-size: 16px;
        position: absolute; left: -450px; top: 32px; box-shadow: 0px -3px 6px #0000000F; padding-left: 24px;
     }
`;



export const _StgTab = {
    busan: {


    },
    yeosu: {


    }
}

export const StgTab = styled.div`
     display: block;
     /* width: 392px; background:#393838; */
     border-radius: 6px;
     margin-bottom: 20px;

     &:after {
        content: '';
        display: block;
        clear: both;
     }
     & li {
        float: left;
     }
     & li a {
        display: block;
        min-width: 120px;
        height: 36px;
        line-height: 36px;
        padding: 0 30px;
        font-family: 'Pretendard';
        font-size: 16px;
        text-align: center;
		font-weight: bold;
        border-right: none;
        color: #fff;
        cursor:pointer;
        background: #393838;
     }
     & li:first-child a {
        -webkit-border-radius: 4px 0px 0px 4px;
        -moz-border-radius: 4px 0px 0px 4px;
        border-radius: 4px 0px 0px 4px;
        cursor:pointer;
     }
     & li:last-child a {
        -webkit-border-radius: 0px 4px 4px 0px;
        -moz-border-radius: 0px 4px 4px 0px;
        border-radius: 0px 4px 4px 0px;
        border-right: solid 1px #3b3f5c;
        cursor:pointer;
     }
     &.single li a {
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
     }
     & li a.on {
        /* background: #009BFF; border-color: #009BFF; */
        background-image: linear-gradient(#0096F7, #0072BC, #005083);
        border-radius: 6px;
     }
`;


export const _Monitoring3DCont = {
    busan: {


    },
    yeosu: {


    }
}

export const Monitoring3DCont = styled(SettingCommon)`


     /*NormalTab**********************************************************/

    .ml5 {
         margin-left: 5px !important;
     }
    .weatherFont{
         display: block;
         color: #FF5A5A;
         margin-left: 123px;
         font-size: 14px;
         font-family: 'Pretendard';
    }


    /*SpreadTab**********************************************************/

    .stgmWrap {
         /* border-bottom: dotted 1px rgba(255,255,255,0.2); */
         padding-bottom: 15px;
     }
    .stgmWrap:after {
         content: '';
         display: table;
         clear: both;
     }
    .stgmCen {
         float: left;
         width: 74%;
         padding-right: 10px;
     }
    .stgmCont {
        background: #393838;
        /* border: solid 1px #232c3c; */
        overflow: hidden;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
     }
    .stgmTab {}
    .stgmTab:after {
         content: '';
         display: table;
         clear: both;
     }
    .stgmTab li {
         /* float: left; width: 50%; */
     }
    .stgmTab li a {
         display: block;
         height: 28px;
         line-height: 28px;
         text-align: center;
         cursor: pointer;
         font-size: 13px;
         /* border-bottom: solid 1px #232c3c; */
         color: #fff;
         background: #393838;
         cursor:pointer;
     }
    .stgmTab li:last-child a {
         border-left: solid 1px #232c3c;
         cursor:pointer;
     }
    .stgmTab li a.on {
         background: none;
         border-bottom-color: transparent;
         color: #fff;
         cursor:pointer;
     }
    .stgmDtl {
         padding: 4px 10px;
         font-family: 'dotum', sans-serif;
         font-size: 12px;
         display: none;
     }

    .stgmTxt {
	     display: block;
         width: 100%;
         resize: none;
         /* border: solid 1px #45526b; */
         height: 256px;
         padding: 5px !important;
	     font-family: 'Pretendard';
         font-size: 12px;
         background: #000000;
         color: #fff;
         font-size: 13px;
	     -webkit-appearance:none;
         -moz-appearance:none;
         appearance:none;
         /* cursor: pointer; */
	     border-radius: 4px;
         -moz-border-radius: 4px;
         -webkit-border-radius: 4px;
    }

    .stgmTxt textarea {
         padding: 0;
         background: none;
    }
    .stgmTxt .scroll-bar {
         background: rgba(255,255,255,0.5) !important;
    }
    .stgmTo {
         margin-top: 8px;
         margin-bottom: 4px;
         position: relative;
         padding-left: 45px;
     }
    .stgmTo span {
         display: block;
         color: #fff;
         height: 28px;
         line-height: 28px;
         position: absolute;
         left: 0;
         top: 0;
         font-family: 'Pretendard';
         font-size: 12px;
     }
    .stgmTo p {
         display: block;
         width: 100%;
         height: 28px;
         line-height: 26px;
         padding: 0 10px;
         font-family: 'Pretendard';
         font-size: 12px;
         /* background: rgba(0,0,0,0.2); */
		 background-color: #000000;
         /* border: solid 1px #3b3f5c; */
         -webkit-border-radius: 4px;
         -moz-border-radius: 4px;
         border-radius: 4px;
         color: #fff;
     }
    .stgmLft {
         float: left;
         /* width: 25%; */
         margin-bottom: 10px;
     }
    .stgmLft li {
         margin-bottom: 10px;
    }
    .stgmLft li:last-child {
         margin-bottom: 0;
     }
    .stgmLft li a {
         display: block;
         height: 32px;
         line-height: 30px;
         background: #393838;
         border: solid 1px #232c3c;
         color: #fff;
         font-size: 14px;
         font-family: 'Pretendard';
         padding: 0 10px;
         -webkit-border-radius: 4px;
         -moz-border-radius: 4px;
         border-radius: 4px;
         cursor:pointer;
     }
    /* .stgmLft li a:hover {
        background: #ff8400;
        border-color: #ff8400;} */

    .stgmRht {
        float: left;
        background: #393838;
        border: solid 1px #232c3c;
        padding: 10px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
     }
    .stgmRht h5 {
        font-size: 14px;
        color: #fff;
        font-family: 'Pretendard';
     }
    .stgmRht ul {
        /* padding-left: 15px; */
        margin-top: 10px;
     }
    .stgmRht ul li {
        display: flex;
        align-items: center;
        list-style: decimal;
        color: #fff;
        font-family: 'dotum', sans-serif;
        font-size: 12px;
        margin-bottom: 5px;
    }
    .stgmRht ul li:last-child {
        margin-bottom: 0;
     }
    .stgmRht ul li span {
        font-size: 12px;
        font-family: 'Pretendard';
        color: #fff;
        margin-right: 8px;
     }
    .stgmRht .disasterLocation{
        display: inline-block;
        width: 76px;
        height: 24px;
        line-height: 24px;
        border-radius: 6px;
        background-image: linear-gradient(#626161, #141313);
        text-align:center;
        margin-left: 4px;
     }
    .stgmRht .disasterTime{
        display: inline-block;
        width: 76px;
        height: 24px;
        line-height: 24px;
        border-radius: 6px;
        background-image: linear-gradient(#626161, #141313);
        text-align:center;
        margin-left: 4px;
     }
    .stgmBtn {
        float: left;
        width: 100%;
        margin-top: 20px;
        text-align: right;
     }
    .stgmBtn li {
        display: inline-block;
        margin-right: 2px;
        width: 100%;
        text-align:center;
        margin-bottom: 6px;
     }
    .stgmBtn li:last-child {
        margin-right: 0;
        cursor:pointer;
     }
    .stgmBtn li a {
        display: block;
        color: #fff;
        font-size: 13px;
        height: 23px;
        line-height: 23px;
        background-image: linear-gradient(#008BE5, #004673);
	    font-family: 'Pretendard';
        padding: 0 15px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        cursor:pointer;
     }
    .stgmBtn li a:hover {
        /* background: #ff8400; border-color: #ff8400; */
     }


    /*DetectionTab**********************************************************/

    .mb0 {
        margin-bottom: 0px !important;
     }
     
    .stgAlt {}
    .stgAlt:after {
        content: '';
        display: table;
        clear: both;
     }
    .stgAlt li {
        float: left;
        margin-right: 15px;
        padding-right: 15px;
        position: relative;
     }
    .stgAlt li:last-child {
        margin-right: 0;
        padding-right: 0;
     }
    .stgAlt li input[type="checkbox"] {
        cursor:pointer;
     }
    .stgAlt li p {
        display: inline;
        vertical-align: middle;
        margin-right: 15px;
        margin-left: 10px;
        color: #fff;
        font-family: 'Pretendard';
     }
    .stgAlt li p:after {
        /* content: ':'; */
        margin-left: 15px;
    }
    .stgAlm {
        margin-top: 10px;
     }
    .stgAlm li {
        display: inline-block;
        vertical-align: middle;
        margin-right: 30px;
     }
    .stgAlm li:last-child {
        right: 0;
     }
    .stgAlm li input[type="radio"] {
        cursor:pointer;
     }
    .stgAlm li label {
        font-family: 'Pretendard';
        color: #fff;
        margin-left: 7px;
        cursor: pointer;
        line-height: 32px;
     }
    .stgAlm li input[type="hsmDtl1ber"] {
        display: inline-block;
        vertical-align: middle;
        margin-left: 5px;
        width: 60px;
        height: 32px;
        line-height: 30px;
        background: #182230;
        border: solid 1px #232c3c;
        color: #fff;
        font-size: 12px;
        font-family: 'dotum', sans-serif;
        padding: 0 10px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
     }
    .stgAlm li select {
        display: inline-block;
        vertical-align: middle;
        width: 60px;
     }

    .settingRadio input[type=radio] {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        border: solid 1px #ddd;
        -webkit-appearance:none;
        -moz-appearance:none;
        appearance:none;
        position: relative;
        cursor: pointer;
        border-radius: 50%;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
     }
    .settingRadio input[type=radio]:checked {
        border-color: #ff8400;
     }
    .settingRadio input[type=radio]:checked:after {
        content: '';
        display: block;
        background: #ff8400;
        position: absolute;
        left: 4px;
        right: 4px;
        top: 4px;
        bottom: 4px;
        border-radius: 50%;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
     }
    .settingRadio input[type=radio] + label.settingRadio {
        display: inline;
        vertical-align: middle;
        margin-left: 7px;
        font-weight: 500;
        cursor: pointer;
        color: #fff;
        font-family: 'dotum', sans-serif;
        font-size: 12px;
    }


    /*selectReceiver********************************************************/


    #dshPop {
        position: absolute;
        z-index: 101;
        background: rgba(0,0,0,0.6);
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    #dshPop > div {
        display: table;
        width: 100%;
        height: 100%;
    }
    #dshPop > div > div {
        display: table-cell;
        width: 100%;
        vertical-align: middle;
    }
    .dspCont {
        margin: 0 auto;
        background: rgba(12,17,28,0.85);
        width: 491px;
        height:312px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
     }
    .dspTitle {
        font-size: 16px;
        font-family: 'Pretendard';
        padding-bottom: 8px;
        color: #fff;
        height: 36px;
        line-height: 36px;
        padding: 0px 20px;
	    background-image:linear-gradient(#009BFF, #0065A7);
     }

    .stguWrap {
        margin: 0 -5px;
        padding-top: 20px;
     }
    .stguWrap:after {
        content: '';
        display: table;
        clear: both;
    }
    .stguWrap > div {
        float: left;
        padding: 0 5px;
    }
    .stguWrap > div:nth-child(1) {
        width: 30%;
     }
    .stguWrap > div:nth-child(2) {
        width: 32%;
     }
    .stguWrap > div:nth-child(3) {
        width: 6%;
     }
    .stguWrap > div:nth-child(4) {
        width: 32%;
     }
    .stguWrap > div > div { color:#fff; height: 134px; background: #000000; overflow: hidden; -webkit-border-radius: 4px; -moz-border-radius: 4px; border-radius: 4px; overflow-y: scroll; }
    .stguWrap .scroll-bar {background: rgba(255,255,255,0.5) !important;}

    .stguWrapScroll::-webkit-scrollbar { /* width: 5px; border-radius: 4px; background-color: #666666; */  }
    .stguWrapScroll::-webkit-scrollbar-thumb { width: 5px; border-radius: 4px; background: #19A5FF; }
    .stguWrapScroll::-webkit-scrollbar-button { width: 0px; height: 0px; }

    .stguTree {}
    .stguTeam {}

    .sppBot .stguTh {height: 36px; border: 1px solid #4c516182; border-radius: 5px 5px 0 0; }
    .sppBot .stguTh th {font-family: 'Pretendard'; font-size: 13px; /* padding: 5px; */ height:36px; line-height: 36px; text-align: center; color: #fff; background: rgba(0,0,0,0.5); font-weight: normal;}
     

    .dsiTree {padding: 4px; font-family: 'Pretendard'; font-size: 12px;}
    .dsiTree li {}
    .dsiTree h5 {padding: 4px;}
    .dsiTree h5:hover {}
    .dsiTree span {display: block; width: 100%; height: 16px; line-height: 16px; float: left; color: #fff; cursor: pointer; font-family: 'Pretendard'; font-size: 11px; }
    .dsiTree span.on {}
    .dsiTree span:hover {color: #19A5FF;}
    .dsiTree span:before {content: '▶'; margin-right: 5px;}
    .dsiTree span.on:before {content: '▼';}
    .dsiTree a {margin-left: 10px; font-size: 11px; }
    .dsiTree ul {padding-left: 6px; display: none;}
    .dsiTree a {color: #fff; line-height: 1.8em; display: inline-block; padding-left: 5px; cursor: pointer; font-family: 'Pretendard'; font-size: 11px; }
    .dsiTree a:focus,
    .dsiTree a:active,
    .dsiTree a:hover {color: #19A5FF;}
    .dsiTree .dsiTreeCheck {color: #19A5ff; font-size: 11px; }

    .regularMemberList > tr {
        cursor: default;
        font-size: 11px;
        height: 20px;
        line-height: 18px;
    }
    .regularMemberList > tr > td {
        cursor: default;
        font-size: 11px;
    }
    .regularMemberList > tr > td > a {
        cursor: pointer;
        font-size: 11px;
    }

     .stguAdd {background: none !important; border: none !important;}
    .stguAdd > div {display: table; width: 100%; height: 100%;}
    .stguAdd > div > div {display: table-cell; width: 100%; vertical-align: middle;}
    .stguAdd ul {}
    .stguAdd ul li {margin: 10px 0;}
    .stguAdd ul li a {display: block; width: 21px; height: 21px; margin: 0 auto; text-indent: -9999px; -webkit-border-radius: 4px; -moz-border-radius: 4px; border-radius: 4px;}
    .stguAdd ul li:first-child a {
         background: url(${ TreeArrowRight })no-repeat center center;
         cursor: pointer;
     }
    .stguAdd ul li:last-child a {
         background: url(${ TreeArrowLeft })no-repeat center center;
         cursor: pointer;
     }
    .stguName {}
    .stguTh {height: 26px; border: 1px solid #4c516182; border-radius: 5px 5px 0 0; }
    .stguTh th {font-family: 'Pretendard'; /* padding: 5px; */ height:26px; line-height: 26px; text-align: center; color: #fff; background: rgba(0,0,0,0.5); font-weight: normal; font-size: 11px; }
    .stguTd {height: 175px;}
    .stguTd tr td {font-family: 'Pretendard'; font-size: 11px; padding: 8px 5px; text-align: center; color: #fff; border-bottom: solid 1px rgba(255,255,255,0.1);
                vertical-align: middle; }
    .stguTd tr td a:hover {color: #19A5FF; }

    .dspBtnNew { padding-top: 20px; text-align: center; }
    .dspBtnNew li {display: inline-block; margin: 0 3px; font-family: 'Pretendard'; }
    .dspBtnNew li a {display: block; width: 62px; height: 23px; line-height: 23px; font-family: 'Pretendard'; font-size: 12px; background: #000000; color: #fff; -webkit-border-radius: 4px; -moz-border-radius: 4px; border-radius: 4px; cursor:pointer; }
    .dspBtnNew li:first-child a {background: #009BFF; border-color: #009BFF; cursor:pointer; }


    .whiteCheck input[type="checkbox"] {
         cursor:pointer;
         display: inline-block;
         vertical-align: middle;
         width: 19px;
         height: 19px;
         appearance: none;
         background: url(${ CheckboxDisable})no-repeat center center;
         background-size: 16px;
         margin-right: 10px;
     }
    .whiteCheck input[type="checkbox"]:checked{
         display: inline-block;
         width: 19px;
         height: 19px;
         background: url(${CheckboxActive })no-repeat center center;
         background-size: 16px;
         margin-right: 10px;
     }
`;


export const _SopSetCont = {
    busan: {


    },
    yeosu: {


    }
}

export const SopSetCont = styled(SettingCommon)`



    /*GeneralTab**********************************************************/


    .stgHalfGeneral{
         border-bottom: dashed 1px #707070;
         padding-bottom: 15px;
         margin-bottom: 15px;
     }
    .mb0 {
         margin-bottom: 0px !important;
     }
    .pb0 {
         padding-bottom: 0 !important;
     }

    .stgMode {
         margin-top: 5px;
         display: flex;
     }
    .stgMode li {
         margin-bottom: 6px;
         /* margin-right: 28px; */
         color: #fff;
         font-family: 'Pretendard';
     }
    .stgMode li label {
         margin-bottom: 6px;
         margin-left: 10px;
         margin-right: 28px;
         color: #fff;
         font-family: 'Pretendard';
     }
    .stgMode li:last-child {
         margin-bottom: 0;
     }
    .stgMode li input[type="text"]{
         display: inline-block;
         vertical-align: middle;
         margin-left: 10px;
         width: 100px;
         height: 28px;
         font-size: 12px;
         background: #232c42;
         border: solid 1px #474b69;
         -webkit-border-radius: 4px;
         -moz-border-radius: 4px;
         border-radius: 4px;
         color: #fff;
     }
    .stgMode li input[type="checkbox"] {
         cursor:pointer;
         display: inline-block;
         vertical-align: middle;
         width: 19px;
         height: 19px;
         appearance: none;
         background: url(${ CheckboxDisable })no-repeat center center;
         background-size: 16px;
     }
    .stgMode li input[type="checkbox"]:checked{
         display: inline-block;
         width: 19px;
         height: 19px;
         background: url(${ CheckboxActive })no-repeat center center;
         background-size: 16px;
     }

    .stgScreenBox{
         display: flex;
         border-bottom: dashed 1px #707070;
         margin-bottom: 15px;
     }
    .stgScreenMove{
         padding-bottom: 15px;
     }
    .stgScreenMove h5{
         display: inline-block;
         line-height: 32px;
         vertical-align: middle;
         color: #fff;
         font-family: 'Pretendard';
         font-size: 17px;
         font-weight: bold;
     }
    .stgScreenCheck {
         margin-top: 5px;
         display: flex;
     }
    .stgScreenCheck li {
         margin-bottom: 6px;
         /* margin-right: 28px; */
         color: #fff;
         font-family: 'Pretendard';
     }
    .stgScreenCheck li label {
         margin-bottom: 6px;
         margin-left: 10px;
         margin-right: 12px;
         color: #fff;
         font-family: 'Pretendard';
     }
    .stgScreenCheck li input[type="checkbox"] {
         cursor:pointer;
         display: inline-block;
         vertical-align: middle;
         width: 19px;
         height: 19px;
         appearance: none;
         background: url(${ CheckboxDisable })no-repeat center center;
         background-size: 16px;
     }
    .stgScreenCheck li input[type="checkbox"]:checked{
         display: inline-block;
         width: 19px;
         height: 19px;
         background: url(${ CheckboxActive })no-repeat center center;
         background-size: 16px;
     }
    .stgHalf {
         border-bottom: dashed 1px #707070;
         padding-bottom: 15px;
         margin-bottom: 15px;
     }
    .stgHalf:after {
         content: '';
         display: table;
         clear: both;
     }
    .stgHalf > div {
         float: left;
         width: 100%;
         display: flex;
         flex-direction: column;
     }
    .stgHalf > div:last-child {
         width: 100%;
         display: flex;
     }
    .stgTime {
         color: #fff;
         font-size: 12px;
         font-family: 'Pretendard';
     }
    .stgTime:after {
         content: '';
         display: table;
         clear: both;
     }
    .stgTime dt {
         float: left;
         line-height: 30px;
         margin-right: 10px;
         font-family: 'Pretendard';
         font-size: 14px;
     }
    .stgTime dd {
         float: left;
     }
    .stgTime li {
         display: inline-block;
         vertical-align: middle;
         margin-right: 5px;
         font-family: 'Pretendard';
         font-size: 14px;
     }
    .stgTime li:last-child {
         margin-right: 0;
     }
    .stgRstr {}
    .stgRstr:after {
         content: '';
         display: table;
         clear: both;
     }
    .stgRstr li {
         float: left;
         line-height: 28px;
         font-family: 'Pretendard';
         font-size: 14px;
         color: #fff;
         margin-right: 5px;
     }
    .stgRstr li:last-child {
         margin-right: 0;
     }

     input[type=text].dsrTxt {
         display: block;
         width: 100%;
         border: solid 1px #232c3c;
         height: 32px;
         padding-left: 10px;
         padding-right: 10px;
         color: #fff;
         font-size: 13px;
         font-weight: 300;
         background: #182230;
         -webkit-appearance:none;
         -moz-appearance:none;
         appearance:none;
         border-radius: 4px;
         -moz-border-radius: 4px;
         -webkit-border-radius: 4px;
      }
     input[type=text].dsrTxt.sm {
         width: 40px;
         font-family: 'Pretendard';
         font-size: 11px;
         height: 28px;
         padding-left: 5px;
         padding-right: 5px;
         text-align: center;
     }

    .mr20 {
         margin-right: 20px !important;
     }

     /*AdvancedTab**********************************************************/

     .sppRow {
         display: flex;
         /* margin: 0 -5px; */
         /* padding-top: 15px; */
         height: 220px;
      }
     .sppRow:after {
         content: '';
         display: table;
         clear: both;
      }
     .sppCol {
         display: block;
         width: 220px;
      }
     .sopTypeBox {
         display: block;
         margin-right: 10px;
         border-radius: 2px;
     }
     .sopDisableText {
         display: flex;
         height: 38px;
         line-height: 38px;
         background: #161515;
         color: #808080;
         font-weight: 400;
         font-size: 16px;
	     padding-left: 10px;
         border-radius: 4px 4px 0 0;
         font-family: 'Pretendard';
         border: 1px solid #4c516182;
      }
     .sopActiveText {
         color: #FFFFFF;
         font-weight: 400;
         font-size: 16px;
         font-family: 'Pretendard';
      }
     .sopLTree{
         display: block;
         overflow-y: scroll;
         background: #202020;
     }

     .sopScroll {
         height: calc(100% - 37px);
         overflow-x: hidden;
         overflow-y: auto;
         background: #393838;
         border-radius: 0 0 5px 5px;
      }
     .sopScroll::-webkit-scrollbar {
         width: 17.997px;
         height: 6.01px;
      }
     .sopScroll::-webkit-scrollbar-thumb {
         background-color: #d4d4d4;
         border-radius: 17.992px;
         background-clip: padding-box;
         border: 7px solid transparent;
      }
     .sopScroll::-webkit-scrollbar-track {
         background-color: #000000;
         background-clip: padding-box;
         border-radius: 17.992px;
         border: 7px solid transparent;
      }

     .sensorTypeTab {
         height:182px;
         /* background: #393838; */
         border-bottom-left-radius: 5px;
         border-bottom-right-radius: 5px;
      }
     .sensorTypeTab li {
         display: flex;
         list-style: none;
         border-bottom: 1px dashed #525868;
         padding: 12px 12px;
         align-items: center;
         height: 36px;
      }
     .sensorTypeTab li a {
         font-weight: 400;
         font-size: 14px;
         color: #fff;
         font-family: 'Pretendard';
      }
     .sensorTypeTab li:hover {
         background-image:linear-gradient(#008BE5, #004673);
         color: #fff;
         cursor: pointer;
      }

     .sppCol2 {
         display: block;
         width: 220px;
      }
     .sppCol3 {
         display: block;
         width: 285px;
         background: #393838;
         border-radius: 5px;
      }
     .spcDep11 {
         /* padding-right: 10px; */
         position: relative;
         border: 1px solid #4c516182;
         border-radius: 5px 5px 0 0;
      }
     .spcDep11 h4 {
         height: 34px;
         font-family: 'Pretendard';
         line-height: 34px;
         padding-left: 15px;
         background: #161515;
         position: relative;
         /* text-align: center; */
         color: #fff;
         font-size: 14px;
         font-weight: 400;
      }
     .spcDep11 h4:after {
         display: none;
      }
     .spcDep11 a {
         display: block;
         height: 20px;
         line-height: 20px;
         /* border: solid 1px #fff; */
         background: url('../../Settings/image/penIcon.png')no-repeat center center;
         cursor:pointer;
	     padding: 0 10px;
         color: #fff;
         font-family: 'Pretendard';
         font-size: 11px;
         position: absolute;
         right: 20px;
         top: 50%;
         margin-top: -10px;
         -webkit-border-radius: 4px;
         -moz-border-radius: 4px;
         border-radius: 4px;
      }
     .spcDep11 a:hover {
          /* border-color: #ff8400; background: #ff8400; color: #fff; */
      }

     .sopTree {
          /* padding: 4px; */
          height: 18px;
          line-height: 18px;
          font-size: 14px;
          color: #fff;
          font-family: 'NanumSquare', sans-serif;
          /* padding-right: 10px; */
       }
      .sopTree h5 {
           font-size: 14px;
           font-weight: 400;
       }
      .sopTree h5:after {
           content: '';
           display: table;
           clear: both;
       }
      .sopTree h5 div{
           padding: 4px;
           cursor: pointer;
           display: inline-flex;
           flex-direction: row;
           align-items: center;
           align-content: center;
           width: 100%;
           border-bottom: dashed 1px #7e7e7e75;
       }
      .sopTree h5:hover{ }
      .sopTree ul {
           /* display: none; */
           text-align: left;
           color: #fff;
       }
      .sopTree li{
           display: block;
           text-align: left;
       }
      .sopTree h5 div.on{ }
      .sopTree h5 div p.on{
           color: red;
       }
      .sopTree h5 span.on{ }
      .sopTree span{
          cursor: pointer;
          display: inline-flex;
          flex-direction: row;
          align-items: center;
          align-content: center;
          font-size: 12px;
          color: #fff;
          cursor:pointer;
       }
      .sopTree span.on {}
      .sopTree span:before {
          margin-right: 5px;
       }
      .sopTree p{
          display: flex;
          align-items: center;
       }
      .sopTree p.on{}
      .sopTree a {
          margin-left: 10px;
       }
      .sopTree a{
          display: inline-block;
          width: 100%;
          height: 16px;
          line-height: 16px;
          color: #fff;
          cursor: pointer;
          text-align: left;
       }
      .sFactoryText{
          font-family: 'Spoqa Han Sans Neo', 'sans-serif';
          font-weight: 400;
          font-size: 14px;
          color: #fff;
       }
      .arrowIcon{
          display: inline-block;
          width: 30px;
          height: 30px;
          background: url(${TreeArrowIcon}) no-repeat center center;
          background-size: 8px;
       }
      .trashIcon{
          display: inline-block;
          width: 30px;
          height: 30px;
          background: url(${TrashIcon}) no-repeat center center;
      }
      .sAreaText{
          font-family: 'Spoqa Han Sans Neo', 'sans-serif';
          font-weight: 400;
          font-size: 12px;
          color: #fff;
          padding-left: 18px;
       }
      .sFloorText{
          font-family: 'Spoqa Han Sans Neo', 'sans-serif';
          font-weight: 400;
          font-size: 12px;
          color: #fff; padding-left: 36px; }

      .appliBtn{
          display: block !important;
          width: 39px;
          height: 14px;
          line-height: 14px;
          background-image: linear-gradient(#0099FC, #004D7E);
          border-radius: 7px;
          text-align: center;
          margin-left: 6px;
          font-size: 10px;
          font-family: 'Spoqa Han Sans Neo', 'sans-serif';
          font-weight: 400;
          cursor: pointer;
       }
      .sppBot {
           /* border: solid 1px rgba(255,255,255,0.2); */
           height: 310px;
           margin-top: 10px;
           background: #393838;
           border-radius: 5px;
       }
      .sppBot .scroll-bar {
           background: rgba(255,255,255,0.5) !important;
       }

      .stguTd {
           /* height: 113px; */
           height: 270px;
       }
      .stguTd a {
           display: inline-block;
           border: solid 1px #fff;
           font-size: 11px;
           padding: 2px 5px;
           margin: 0 2px;
           -webkit-border-radius: 4px;
           -moz-border-radius: 4px;
           border-radius: 4px;
       }
      .stguTd a:hover {
           border-color: #ff8400;
           background: #ff8400;
           color: #fff;
       }
      .stguTd {
           height: 175px;
       }
      .stguTd td {
           font-family: 'Pretendard';
           font-size: 14px;
           padding: 8px 5px;
           text-align: center;
           color: #fff;
           border-bottom: solid 1px rgba(255,255,255,0.1);
           vertical-align: middle;
       }
      .stguTd td a:hover {
           color: #19A5FF;
       }

      .scrollbar  {
           overflow-y: auto;
      }

     .scrollbar::-webkit-scrollbar { width: 4px; background: none}
     .scrollbar::-webkit-scrollbar-thumb { background: #bbb; opacity: .4}
     .scrollbar::-webkit-scrollbar-track { background: none}

     .binIcon{
           display: inline-block;
           width: 18px;
           height: 18px;
           background: url('../../Settings/image/trashIcon.png')no-repeat center center;
      }
     .sppBot .stguTh {
          height: 36px;
          border: 1px solid #4c516182;
          border-radius: 5px 5px 0 0;
     }
     .sppBot .stguTh th {
          font-family: 'Pretendard';
          font-size: 13px;
          /* padding: 5px; */
          height:36px;
          line-height: 36px;
          text-align: center;
          color: #fff;
          background: rgba(0,0,0,0.5);
          font-weight: normal;
     }
    .collapsible {
          background-color: #777;
          color: white;
          cursor: pointer;
          padding: 18px;
          width: 100%;
          border: none;
          text-align: left;
          outline: none;
          font-size: 15px;
    }

    .active, .collapsible:hover {
          background-color: #555;
    }
    .content {
          padding: 0 18px;
          display: none;
          overflow: hidden;
          background-color: #f1f1f1;
    }


`;



export const _DashboardSetCont = {
    busan: {


    },
    yeosu: {


    }
}

export const DashboardSetCont = styled(SettingCommon)`

    .stgProd {
         padding-top: 10px;
    }
    .stgProd:after {
         content: '';
         display: table;
         clear: both;
     }
    .stgProd li {
         float: left;
     }
    .stgProd li:nth-child(1) {
         width: 140px;
     }
    .stgProd li:nth-child(2) {
         width: 20px;
         text-align: center;
         line-height: 32px;
         color: #fff;
     }
    .stgProd li:nth-child(3) {
         width: 140px;
     }
    .stgProd li:nth-child(4) {
         width: 120px;
         margin-left: 10px;
         margin-right: 40px;
     }
    .stgProd li:nth-child(5) {
         margin-right: 20px;
     }
    .stgProd li:nth-child(6) {
         margin-right: 20px;
     }
    .stgProd li:nth-child(7) {}
    .stgProd li a {
         display: block;
         text-align: center;
         height: 32px;
         line-height: 30px;
         border: solid 1px rgba(255,255,255,0.5);
         color: #fff;
         font-size: 12px;
         font-family: 'dotum', sans-serif;
         padding: 0 10px;
         -webkit-border-radius: 4px;
         -moz-border-radius: 4px;
         border-radius: 4px;
     }
    .stgProd li a:hover {
         border-color: #fff;
     }
    .stgProd li label {
         line-height: 32px;
    }

`;


export const _TeamEditorCont = {
    busan: {


    },
    yeosu: {


    }
}

export const TeamEditorCont = styled(SettingCommon)`




`;


export const _SystemInfoCont = {
    busan: {


    },
    yeosu: {


    }
}

export const SystemInfoCont = styled(SettingCommon)`




`;





