
import styled from 'styled-components';
import ProjectResource from '../../Root/resource/id';


import Groups from '../../SOPSimulator/img/groups.png';
import MessageIconActive from '../../SOPSimulator/img/message_icon_active2.png';
import MessageIconDisable from '../../SOPSimulator/img/messageIcon3.png';
import CheckBoxOutline from '../../SOPSimulator/img/checkBox_outline.png';
import CheckBoxChecked from '../../SOPSimulator/img/checkBox_blackActive.png';
import MailIcon from '../../SOPSimulator/img/mail_icon.png';
import EmailIcon from '../../SOPSimulator/img/email_icon.png';
import SelectArrowBlack from '../../SOPSimulator/img/selectArrow_black.png';
import MicIconActive from '../../SOPSimulator/img/mic_icon_active.png';
import VolumeIconActive from '../../SOPSimulator/img/volume_icon_active.png';



export const _SubSectionTaskListWrap = {
    busan: {
        divWidth: '151px',
        divHeight: '41px',
    },
    yeosu: {
        divWidth: '151px',
        divHeight: '41px',
    }
}

export const SubSectionTaskListWrap = styled.div`
     float:left;
     height:calc(100% + 5px);
     border-radius:4px;
     /* background: #e6e6e6; */

     width:calc(50% - 60px);
     height: calc(100% - 118px);
     margin-top: 80px;


     >.tit {
        display:block;
        padding:20px 0;
        font-size:20px;
        font-weight:700;
        border-top-left-radius:4px;
        border-top-right-radius:4px;
        letter-spacing:-0.05em;
        background-color: #fff;
        text-align:center;
        cursor:default;
        border:solid 1px #d1d1d1; 
        color: #000000;
    }

    .innerSectionnnn{
        height: 100%;
        border-radius: 5px;
        overflow-y: auto;
    }
    .taskSectionArea{
        counter-reset:taskOrder;
        background: #E6E6E6;
        border-radius: 5px;
    }
    .taskSectionArea > .sectionBox > .tit{
        display: flex;
        align-items: center;
        border-radius:3px;
    }

    .taskSectionArea .numList li{
        position:relative;
        padding-left:16px
    }

    .sectionBox > .tit{
        display: flex;
        align-items: center;
        border-radius: 3px;
    }

    .sectionCurrent > .tit{
        background: #fff;
        height: 60px;
    }
    .sectionRun > .tit{
        /* background-color:var(--colorSectionRun) */
    }
    .sectionDone > .tit{
        border-radius: 3px;
        /* height: 80px; */
    }
    .sectionDone > .titt{
        border-radius: 3px;
        /* height: 80px; */
    }
    .sectionSkip > .tit {
        border: solid 4px red;
     }
    .currentBox {
        border-left: solid 4px #19A5FF !important;
        background: #fff;
        border-radius: 3px;
        padding: 20px 0px;
        padding-left: 34px;
    }
    /* test */
    .doneBox{
        border-left: solid 4px #8691A4 !important;
        /* background: #fff; */
        border-radius: 3px;
        padding: 20px 0px;
        padding-left: 34px;
    }

    .innerscrollbar::-webkit-scrollbar {
        width: 5px;
        height: 7px;
        border-radius: 3px;
        /* background-color: #4D4D4D; */
    }
    .innerscrollbar::-webkit-scrollbar-thumb {
        width: 5px;
        border-radius: 3px;
        background: #B3B3B3 !important;
    }
    .innerscrollbar::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }


`;
 


/**********************************************************************/


export const _SectionBox = {
    busan: {


    },
    yeosu: {


    }
}

export const SectionBox = styled.div`
    padding-left: 34px;
    padding-top: 10px;
    padding-bottom: 10px;

    + .sectionBox{
        border-radius:3px;
        border:solid 1px #fff;
     }

    .tit.textNormal strong{
        color: #808080;
        font-family: 'Pretendard';
        font-weight: bold;
        font-size: 18px;
     }
    .tit.textCurrent strong{
        color: #19A5FF;
        font-family: 'Pretendard';
        font-weight: bold;
        font-size: 18px;
     }
    .tit.textRun strong{
        color: #808080;
     }
    .tit.textDone strong{
        color: #808080;
     }

    .tit.textNormal span{
        color: #808080;
        font-family: 'Pretendard';
        font-weight: bold;
        font-size: 18px;
     }
    .tit.textCurrent span{
        color: #19A5FF;
        font-family: 'Pretendard';
        font-weight: bold;
        font-size: 18px;
     }
    .tit.textRun span{
        color:var(--colorTextRun)
     }
    .tit.textDone span{
        color: #808080;
    }

    > .tit{
        position:relative;
        /* padding:10px 20px; */
        /* background-color:#1e2633; */
        border-radius:3px;
    }
    
   .tit strong{
        position:relative;
        font-size:18px;
        font-family: 'Pretendard';
        font-weight: bold;
    }
   .tit span{
        display: flex;
        flex: 1;
        position:relative;
        font-size:18px;
        font-family: 'Pretendard';
        font-weight: bold;
    }
   .tit.cRed strong{
        color:#e7525a;
    }
   .tit.cBlue strong{
        color:#4d55e3;
    }
   .tit.cGray strong{
        color:#9596ad;
    }
   .tit.cWhite strong{
        color:#ffffff;
    }
   .tit.cGreen strong{
        color: #18ee9e;
    }
   .tit .flag{
         display:inline-block;
         width:50px;
         height:20px;
         margin-left:10px;
         padding:2px 0;
         font-size:14px;
         font-weight:400;
         line-height:1;
         letter-spacing:-0.05em;
         color:#fff;
         border-radius:10px;
         text-align:center;
         vertical-align:top;
    }
   .tit .flagAuto{
         background-color:#0073d4;
         border:solid 1.5px #0073d4;
         color: #fff !important;
         font-size: 14px !important;
         font-weight: 400 !important;
    }
   .tit .flagBroadcast{
         background-color:#e91915;
         border:solid 1.5px #e91915;
         color: #fff !important;
         font-size: 14px !important;
         font-weight: 400 !important;
    }
   .tit .flagSms{
         background-color:#F36900;
         border:solid 1.5px #F36900;
         color: #fff !important;
         font-size: 14px !important;
         font-weight: 400 !important;
    }
   .tit .flagMail{
         background-color:#5eba7d;
         border:solid 1.5px #5eba7d;
         color: #fff !important;
         font-size: 14px !important;
         font-weight: 400 !important;
    }
   .tit .btnArea{
         text-align:center;
         font-size:0;
    }
   .tit .btnArea a{
         display:inline-block;
         width:94px;
         height:30px;
         line-height: 30px;
         font-size:14px;
         letter-spacing:-0.05em;
         border-radius:5px;
   }
   .tit .btnArea a + a{margin-left:10px}

   .tit .btnArea .btnAllCheck{
         display:inline-block;
         width: 94px;
         height: 30px;
         font-size: 16px;
         letter-spacing: -0.05em;
         cursor: pointer; color: #fff;
		 background-color: #19A5FF;
         order-radius: 5px;
         cursor:pointer;
         white-space:nowrap;
         overflow:hidden;
         text-overflow: ellipsis;
         color: #fff;
         font-family: 'Pretendard';
    }

   .tit .btnArea .btnDisable {
         display: inline-block;
         width: 94px;
         height: 30px;
         font-size: 14px;
         letter-spacing: -0.05em;
         border-radius: 5px;
		 cursor:default;
         background:#788396;
         pointer-events:none;
         text-overflow: ellipsis;
         white-space: nowrap;
         overflow: hidden;
         color: #fff;
         font-family: 'Pretendard';
    }

   .tit .btnArea .btnDisableEnd {
         display: inline-block;
         width: 94px;
         height: 30px;
         font-size: 14px;
         letter-spacing: -0.05em;
         border-radius: 5px;
		 cursor:default;
         background:#000000;
         pointer-events:none;
         text-overflow: ellipsis;
         white-space: nowrap;
         overflow: hidden;
         color: #fff;
         font-family: 'Pretendard';
    }
    
    .taskDetail{
         counter-reset:taskDetail;
         border-radius:3px;
         color: #808080;
         font-family: 'Pretendard';
         font-weight:400;
         font-size: 14px;
     }
    .taskDetail > div{
         float:left;
         width:calc(100% - 180px);
         border-radius:5px;
         color: #000000;
         border:solid 1px #808080;
         font-family: 'Pretendard';
     }
    .taskDetail > div + div{
         width:170px;
         margin-left:10px;
     }
    .taskDetail > dt .checkk {
         width:30px;
         display:inline-block;
         height:30px;
         position:relative;
         top:5px;
     }
    .taskDetail .action {
        color: #f8bd57;
    }

    dt{
        padding:4px 0px;
        font-weight:400;
        line-height:30px;
        letter-spacing:-0.05em;
        position:relative;
    }
    dd{
         display:flex;
         width: 100%;
         align-items: flex-start;
         padding:4px 0px;
         padding-right:0;
         font-weight:100;
    }
    dd p{
         line-height:26px;
         align-items:center;
         justify-content:center;
         /* color: #D27272; */
    }


    dd .tit {
        /* position: relative; 
        width: 50%;
        padding-left: 25px; */

        position: relative;
        width: calc(100% - 210px);
        padding-right: 16px;
        font-family: "Pretendard";
        font-weight: 400;
        font-size: 14px;
    }
    dd .tit:before {
        counter-increment: taskDetail;
        content: counters(taskDetail, ".") ". ";
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

    .sendMessage{
        display:flex;
        height:60px; /* justify-content:flex-end; */
        align-items: center;
     }
    .sendMessage .message{
        height:30px;
        padding: 20px;
     }
    .sendMessage .wifi{
        height:30px;
        padding:3px 5px;
    }
    .sendMessage .send{
        /* height:30px; padding:0 10px; */
     }
    .sendMessage .check{
         height:30px;
         /* flex: 1; */
         /* width: calc(100% - 210px); */
         width: calc(100% - 194px);
    }
    .sendMessage + .taskDetail{  }

    .btnMessageActive{
         display: inline-block;
         width: 94px;
         height: 30px;
         background: url(${MessageIconActive})no-repeat center center;
         margin-right: 2px;
     }
    .btnMessageDisable{
         display: inline-block;
         width: 94px;
         height: 30px;
         background: url(${MessageIconDisable})no-repeat center center;
         margin-right: 2px;
     } 

     .clfix{
        /* content:''; display:block; clear:both; */
     }
    .completionStatus{
        float:right;
        right:13px;
        width:100px;
        display:inline-block;
        z-index:2;
        /* margin-right: 4px; */
        color: #D27272;
        font-size: 14px;
        font-family: 'Pretendard';
        font-weight: 400;
        text-align: center;
    }
`;


/**********************************************************************/


export const _ProcessSectionBox = {
    busan: {


    },
    yeosu: {


    }
}

export const ProcessSectionBox = styled(SectionBox)`
    .dropFlexBox{ display: flex; }
    .dropArrow2{
        width: 0;
        height: 0;
        border-bottom: 4px solid transparent;
        border-top: 4px solid transparent;
        border-left: 8px solid transparent;
        border-right: 8px solid #808080;
        transform: rotate(358deg);
        margin-left: -3px;
        margin-top: 10px;
     }
    .processArea{
        display: flex;
        width: 100%;
        align-items: center;
        /* position: relative; */
        height: 50px;
        color: #808080;
     }
    .processArea strong{
        /* flex: 1; */
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-weight:bold;
        font-size: 18px;
     }
    .tooltip {
        /* display: inline-block; */
        display: flex;
        flex: 1 1;
        margin-left: 10px;
        position:relative;
    }
    .propagatePeople {
        background: url(${ Groups})no-repeat center center;
        background-repeat: no-repeat;
        width:36px;
        height:18px;
        align-items:center;
        cursor:pointer;
    }
    .propagatePeople:hover {
         background: url(${Groups})no-repeat center center;
         background-repeat: no-repeat;
         width:36px;
         align-items:center;
     }

    .dropBoxArea{
        /* visibility:visible; */
        visibility: hidden;
        z-index: 1;
        display: flex;
        position: absolute;
        left: 36px;
        top: -4px;
     }
    .dropBox {
        display: flex;
        /* width: 189px; */
        min-width: 189px;
        /* height: 30px; */
        height: auto;
        border: solid 1px #808080;
        border-radius: 5px;
        color: #E9EAEB;
        padding: 0;
        text-align: center;
     }
    .dropBox p{
        color: #808080;
        padding: 8px;
        font-size: 12px;
        font-family: 'Pretendard';
        font-weight: 400;
    }
    .dropBox li{
        color: #808080;
        padding: 8px;
        font-size: 12px;
        font-family: 'Pretendard';
        font-weight: 400;
    }
    /* .dropBox p:first-child { font-weight: 500; padding: 10px; border-bottom: 1px solid #5fb2af; } */

    .tooltip:hover
    .dropBoxArea { visibility:visible; }

    /* .tooltip:hover
    .dropBox { visibility:visible; } */
    .dropBox > p{ /* padding: 10px 10px; */ }
    .dropBox > p:hover{ /* background-color: #5fb2af; */ }

    .btnPropagateSelect {
         float:right;
         display:inline-block;
         margin-right:100px;
         width:94px;
         height:30px;
         cursor:pointer;
         border-radius:5px;
         font-size:14px;
         letter-spacing: -0.05em;
         text-align:center;
         color:#fff;
         background-color:#19A5FF;
     }
    .btnPropagateSelect:hover {
         background: #012c93;
     }
    .proBtnDisable {
         float:right;
         display: inline-block;
         width: 94px;
         height: 30px;
         font-size: 14px;
         letter-spacing: -0.05em;
         border-radius: 5px;
         cursor:default;
         background: #788396;
         pointer-events:none;
         align-items:center;
         text-align:center;
         color: #fff;
         margin-right: 100px;
      }

     .messagee{
         background: url(${ MailIcon })no-repeat center center;
         width: 43px;
         height:30px;
         display: inline-block;
         border-radius: 5px;
         margin-right: 10px;
     }
     .emaill{
         display: inline-block;
         background: #788396 url(${ EmailIcon })no-repeat center center padding-box;
         opacity: 1;
         width:43px;
         height:30px;
         border-radius: 5px;
      }
     .messageCurrent{
         background: url(${ MicIconActive })no-repeat center center padding-box;
         width: 43px;
         height:30px;
         display: inline-block;
         border-radius: 5px;
         margin-right: 10px;
     }
     .behaviorText{
         display: inline-flex;
         font-family: 'Pretendard';
         font-weight:400;
         font-size: 14px;
     }
     .borderSide {
         /* border-left: 1px solid #060817; border-right: 1px solid #060817; */
     }
     .checkBox2 input[type=checkbox]{
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url(${ CheckBoxOutline})no-repeat center center;
        
        margin-right: 10px;
     }
     .checkBox2 input[type=checkbox]:checked{
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url(${ CheckBoxChecked })no-repeat center center;
     } 

     .taskDetail dt span .checkBox2 input[type=checkbox]{
        display: inline-block;
        width: 16px;
        height: 16px;
        /* background: url(${ CheckBoxOutline})no-repeat center center; */
        margin-right: 10px;
     }

     .taskDetail dt span .checkBox2 input[type=checkbox]:checked{
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url(${ CheckBoxChecked })no-repeat center center;
     }

`;

/**********************************************************************/

export const _DecisionSectionBox = {
    busan: {


    },
    yeosu: {


    }
}

export const DecisionSectionBox = styled(SectionBox)`
    .hasFire strong {
        width: calc(100% - 310px);
    }
    .choiceBox {
        padding: 6px 45px 6px 35px;
        background: url(${ SelectArrowBlack })no-repeat 70% 50%;
        background-repeat: no-repeat;
		color: #000000;
        text-align: left;
        margin-right: 10px;
        user-select:none;
        border:solid 1px #19A5FF;
     }
    .choiceBox option{ background-color:#fff; }

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

export const _InternalSectionBox = {
    busan: {
        divWidth: '151px',
        divHeight: '41px',
    },
    yeosu: {
        divWidth: '151px',
        divHeight: '41px',
    }
}

export const InternalSectionBox = styled(SectionBox)`
    .sendMessage .message{
        margin-left:15px;
        margin-top:2px;
    }
    .sendMessage .email{
        margin-left:20px;
    }
    .sendMessage .mic{
        /* margin-left:20px; */
    }
    .sendMessage .volume{
        /* margin-left:20px; */
    }
    .soundInfo{
        position:relative;
    }
    .soundInfo.isShow .soundInfoList{
        display:block;
    }
    .soundInfo .soundInfoList{
        display:none;
        position:absolute;
        top:38px;
        right:-35px;
        z-index:1;
        width:100px;
        height:100px;
        background-color:#060817;
        border:1px solid #3b3f5c;
    }
    .soundInfo .soundInfoList li + li{
        border-top:1px solid #3b3f5c;
    }
    .soundInfo .soundInfoList button{
        width:100%;
        font-size:14px;
        line-height:50px;
        color:#fff;
        text-align:center;
    }
    .soundInfo .soundInfoList button[data-value="N"]{
        color:#369ed2;
    }
    .soundInfo.isOn .soundInfoList button[data-value="Y"]{
        color:#00ff4e;
     }
    .soundInfo.isOn .soundInfoList button[data-value="N"]{
        color:#fff;
     }
    .micInfo{
        position:relative;
        margin-left: 16px;
     }
    .micInfo.isShow .micInfoList{
        display:block;
     }
    .micInfo .micInfoList{
        display:none;
        position:absolute;
        top:38px;
        right:-40px;
        z-index:1;
        width:100px;
        height:100px;
        background-color:#060817;
        border:1px solid #3B3F5C;
     }
    .micInfo .micInfoList li + li{
        border-top:1px solid #3B3F5C;
    }
    .micInfo .micInfoList button{
        width:100%;
        font-size:14px;
        line-height:50px;
        color:#fff;
        text-align:center;
     }
    .micInfo .micInfoList button[data-value="N"] {
        color:#fff;
     }
    .micInfo .micInfoList button[data-value="N"]{
        color:#39A7DE;
     }
    .micInfoOn {
    }

    .micInfoOff {
    }
    .isOn .mic{
        display:inline-block;
        vertical-align:top;
        background: url(${ MicIconActive })no-repeat center center;
     }
    .isOn .volume{
        display:inline-block;
        vertical-align:top;
        background: url(${ VolumeIconActive })no-repeat center center;
     }

    .volumeInfoOn{ color:#39A7DE !important;}
    .volumeInfoOff{}  /*0722 추가*/

    .volumeInfo{
       position:relative;
    }
    .volumeInfo.isShow .volumeInfoList{
       display:block;
    }
    .volumeInfo .volumeInfoList{
       display:none;
       position:absolute;
       top:36px;
       right:-10px;
       z-index:1;
       width:100px;
       height:100px;
       background-color:#060817;
       border:1px solid #3B3F5C;
     }
    .volumeInfo .volumeInfoList li + li{
       border-top:1px solid #3B3F5C;
     }
    .volumeInfo .volumeInfoList button{
       width:100%;
       font-size:14px;
       line-height:50px;
       color:#fff;
       text-align:center;
     }
     .volumeInfo .volumeInfoList button[data-value="N"]{
        color:#369ed2;
     }
     .volumeInfo .volumeInfoList button[data-value="N"]{
       color:#fff;
     }
     .volumeInfo .volumeInfoList button[data-value="N"]{
      color:#39A7DE;
     }
     .checkBox2 input[type=checkbox]{
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url(${ CheckBoxOutline})no-repeat center center;
        
        margin-right: 10px;
     }
    .checkBox2 input[type=checkbox]:checked{
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url(${ CheckBoxChecked })no-repeat center center;
     }

     .taskSubSection{
        display:flex;
        margin-right: 34px;
        flex-direction: column;
     }
    .taskSub{
        word-break:keep-all;
     }
    .taskSub dd{
        height:130px;
        padding:15px 20px;
        line-height:25px;
        border-bottom:0;
        overflow-y:auto;
     }
    .taskSub dt{
        padding-left: 20px;
     }
    .taskSub .taskMessage{
        height:130px;
        padding:15px 20px;
        line-height:25px;
        border-bottom:0;
        overflow-y:auto;
        background-color:transparent;
        width:100%;
        color: #808080;
        border-color:transparent;
        text-align:start;
    }
    .taskSubList dd{
        padding:0 10px;
     }
    .taskSub dd.all{
        justify-content:center;
    }
    .taskSub dd:not(.all){
        align-items:baseline;
    }
    .taskSub ul li{
        padding:10px 10px;
        line-height:20px;
    }
    .taskSub ul li + li{
        border-top:1px solid #162235;
    }

    .propagatePeople {
        background: url(${ Groups})no-repeat center center;
        background-repeat: no-repeat;
        width:36px;
        height:18px;
        align-items:center;
        cursor:pointer;
    }
    .propagatePeople:hover {
         background: url(${Groups})no-repeat center center;
         background-repeat: no-repeat;
         width:36px;
         align-items:center;
     }
    .propagatePeoplee{
        display:inline-block;
        background: url(${Groups })no-repeat center center;
        background-repeat: no-repeat;
        width:36px;
        height:18px;
        align-items:center;
     }
    .btnArea {
        /* float:right;
        margin-right:85px; */
        text-align:center;
        font-size:0;
    }
    .btnAreaDisable {
        float:right;
        margin-right: 100px;
        text-align:center;
        font-size:0;
    }

   /*******************************/

    .tooltip {
        /* display: inline-block; */
        display: flex;
        flex: 1 1;
        margin-left: 10px;
        position:relative;
    }
    .dropBoxArea{
        /* visibility:visible; */
        visibility: hidden;
        z-index: 1;
        display: flex;
        position: absolute;
        left: 36px;
        top: -4px;
     }
     .dropArrow2{
        width: 0;
        height: 0;
        border-bottom: 4px solid transparent;
        border-top: 4px solid transparent;
        border-left: 8px solid transparent;
        border-right: 8px solid #808080;
        transform: rotate(358deg);
        margin-left: -3px;
        margin-top: 10px;
     }

    .dropBox {
        display: flex;
        /* width: 189px; */
        min-width: 189px;
        /* height: 30px; */
        height: auto;
        border: solid 1px #808080;
        border-radius: 5px;
        color: #E9EAEB;
        padding: 0;
        text-align: center;
     }
    .dropBox p{
        color: #808080;
        padding: 8px;
        font-size: 12px;
        font-family: 'Pretendard';
        font-weight: 400;
    }
    .dropBox li{
        color: #808080;
        padding: 8px;
        font-size: 12px;
        font-family: 'Pretendard';
        font-weight: 400;
    }
    .tooltip:hover
    .dropBoxArea { visibility:visible; }


`;


/**********************************************************************/

export const _EndSectionBox = {
    busan: {

    },
    yeosu: {

    }
}

export const EndSectionBox = styled(SectionBox)`
    .sectionBoxStart {
        display: flex;
        height: 60px;
        align-items: center;
        /* margin: 0px 34px; */
        color: #000000;
     }
    .sectionBoxStart strong:before {
        counter-increment:taskOrder;
        content:no-close-quote;
        position:absolute;
        top:0;
        left:0;
     }
    .sectionBoxStart strong {
        /* margin-left: 34px; width: calc(100% - 265px); */
     }

`;

/**********************************************************************/
