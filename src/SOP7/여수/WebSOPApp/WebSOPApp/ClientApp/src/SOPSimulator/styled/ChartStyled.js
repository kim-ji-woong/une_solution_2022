
import styled from 'styled-components';
import ProjectResource from '../../Root/resource/id';

import IconStepArrowBottom from '../../Common/image/icon/icon-step-arrow-bottom.png';


export const _SubSectionProgressViewWrap = {
    busan: {
        divWidth: '151px',
        divHeight: '41px',
    },
    yeosu: {
        divWidth: '151px',
        divHeight: '41px',
    }
}

export const SubSectionProgressViewWrap = styled.div`
     float:left;
     /* height:calc(100% + 5px); */
     border-radius:4px;


     width:calc(50% + 10px);
     margin-right:20px;
     height: calc(100vh - 210px);
     margin-top: 100px;

    .tit{
        padding: 0px 20px;
        height: 48px;
        line-height: 48px;
        background: #fff;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }
    .tit strong{
        flex: 1;
        float:left;
        font-family: 'Pretendard';
        font-weight:400;
        font-size: 16px;
        color: #000000;
     }
    .chartTitle{
        display: flex;
     }
    .btnArea{
        font-size:0
     }
    .btnArea button + button{
        margin-left:30px;
    }
    .infoList{
        width: 100%;
        height: 48px;
        display: flex;
        position: relative;
    }
    .infoList button {
        width: 100%;
        /* width: 200px; */
        height: 48px;
        font-size: 16px;
        font-weight:400;
        color:#fff;
		text-align:center;
        cursor: default;
        z-index:2;
        position:relative;
        font-family: 'Pretendard';
     }

    .infoList .actCircle{
        border-radius: 50%;
        color:red;
        list-style: disc;
     }
    .infoList li + li{
        /* z-index:2; */
     }
    .infoList li{
        display: block;
        /* width: 30%; */
     }
    .isActive button{
       background-color:#39a7de;
       color:#fff;
    }

`;

/**********************************************************************/

export const _ChartWrap = {
    busan: {
        divWidth: '151px',
        divHeight: '41px',
    },
    yeosu: {
        divWidth: '151px',
        divHeight: '41px',
    }
}

export const ChartWrap = styled.div`
     position:relative;
     height:calc(100% - 55px);
     border-radius: 4px;
     border: solid 1px #d1d1d1;
`;

/**********************************************************************/

export const _ChartArea = {
    busan: {
        divWidth: '151px',
        divHeight: '41px',
    },
    yeosu: {
        divWidth: '151px',
        divHeight: '41px',
    }
}

export const ChartArea = styled.div`
     /* height:100%;overflow-y:auto;
	 padding: 90px 0; */
     width: 100%;
     height: calc(100% - 49px);
     overflow-y: hidden;
     background: #162234;

    .diagram + .diagram:after{
         content:'';
         display:block;
         position:absolute;
         top:-50px;
         width:26px;
         height:30px;
         background: url(${ IconStepArrowBottom })no-repeat center center;
     }
    .title,
    .diagram{
         position:relative;
         display:flex;
         align-items:center;
         justify-content:center;
         margin:0 auto;
     }
    .title,
    .diagram a{
         display:block;
         display:flex;
         align-items:center;
         justify-content:center;
         flex-flow:column;
         padding:15px 0;
         letter-spacing:-0.05em;
         text-align:center;
     }
     .tit{
         font-size:20px;
     }
     .txt{
         font-size:14px;
         line-height:25px;
         margin-top:10px;
     }
    .title{
         width:390px;
         min-height:80px;
         border-radius:80px;
         background-color:#0b205c;
     }
    .diagram{
         margin-top:70px;
    }
    .diagram a p{
         position:relative;
         z-index:10;
    }
    .item01 a{
         width:350px;
         min-height:90px;
         background-color:#596ba6;
     }
    .item02 a{
         position:relative;
         width:350px;
         min-height:40px;
         margin-top:30px;
         margin-bottom:30px;
         padding:0;
         background-color:#39a7de;
     }
    .item02 a:before{
         content:'';
         position:absolute;
         top:-30px;
         left:0;
         width:0;
         height:0;
         border-style:solid;
         border-width:0 0 30px 350px;
         border-color:transparent transparent #39a7de transparent;
     }
    .item02 a:after{
         content:'';
         position:absolute;
         bottom:-30px;
         left:0;
         width:0;
         height:0;
         border-style:solid;
         border-width:0 350px 30px 0;
         border-color:transparent #39a7de transparent transparent;
     }
    .item03 a{
         width:350px;
         min-height:90px;
         background-color:#003d98;
    }
    .item04 a{
         position:relative;
         width:350px;
         min-height:110px;
     }
    .item04 a:before{
         content:'';
         position:absolute;
         top:55px;
         left:0;
         width:0;
         height:0;
         border-style:solid;
         border-width:55px 175px 0 175px;
         border-color:#3b3f5c transparent transparent transparent
     }
    .item04 a:after{
         content:'';
         position:absolute;
         bottom:55px;
         left:0;
         width:0;
         height:0;
         border-style:solid;
         border-width:0 175px 55px 175px;
         border-color:transparent transparent #3b3f5c transparent;
     }

`; 

/**********************************************************************/

export const _PanelAreas = {
    busan: {
        divWidth: '151px',
        divHeight: '41px',
    },
    yeosu: {
        divWidth: '151px',
        divHeight: '41px',
    }
}

export const PanelAreas = styled.div`
     width: 100%;
     height: 100%;
     display: flex;
     flex-direction: column;

`;

/**********************************************************************/

export const _SectionPanels = {
    busan: {
        divWidth: '151px',
        divHeight: '41px',
    },
    yeosu: {
        divWidth: '151px',
        divHeight: '41px',
    }
}

export const SectionPanels = styled.div`




    .chartScrollbar::-webkit-scrollbar {
        width: 5px;
        height: 7px;
        border-radius: 3px;
        /* background-color: #4D4D4D; */
    }
    .chartScrollbar::-webkit-scrollbar-thumb {
        width: 5px;
        border-radius: 3px;
        background: #ffffff !important;
    }
    .chartScrollbar::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }

`;

/**********************************************************************/



