
import styled from 'styled-components';
import ProjectResource from '../../Root/resource/id';


import YeosuIcon from '../../SOPSimulator/img/yeosuLogo.png'
import YeosuIconBlack from '../../SOPSimulator/img/yeosuLogoBlack.png';
import MenualArrow from '../../SOPSimulator/img/arrowDown_icon.png';
import NavigateNext from '../../SOPSimulator/img/navigateNext.png';
import SelectArrow from '../../SOPSimulator/img/selectArrow_icon.png';
import SopSimuArrowLeft from '../../SOPSimulator/img/sopSimuArrowLeft.png';
import SopSimuArrowLeftActive from '../../SOPSimulator/img/sopSimuArrowLeft_active.png';
import SopSimuArrowRight from '../../SOPSimulator/img/sopSimuArrowRight.png'
import SopSimuArrowRightActive from '../../SOPSimulator/img/sopSimuArrowRight_active.png';
import PlusWhite from '../../Common/image/icon/plusWhite-01.png';
import ReturnIcon from '../../SOPSimulator/img/returnIcon.png';


export const _AppContainerWrapp = {
    busan: {
        divBackgroundColor: '#fff',
        divHeight: 'calc(100vh - 0px)',
        divPaddingTop: '100px',
    },
    yeosu: {
        divBackgroundColor: '#0D2348',
        divHeight: 'calc(100vh - 0px)',
        divPaddingTop: '100px',
    }
}

export const AppContainerWrapp = styled.div`
     background-color:${_AppContainerWrapp[ProjectResource.styleMode].divBackgroundColor};
     height:${_AppContainerWrapp[ProjectResource.styleMode].divHeight};
     padding-top:${_AppContainerWrapp[ProjectResource.styleMode].divPaddingTop};
     overflow-y:hidden;
`;

/**********************************************************************/


export const _YeosuLogoBox = {
    busan: {
        divWidth: '151px',
        divHeight: '41px',
    },
    yeosu: {
        divWidth: '151px',
        divHeight: '41px',
    }
}

export const YeosuLogoBox = styled.div`
      display: inline-block;
      width:${_YeosuLogoBox[ProjectResource.styleMode].divWidth};
      height:${_YeosuLogoBox[ProjectResource.styleMode].divHeight};
      background: url(${ YeosuIcon })no-repeat center center;
      position:absolute;
      left: 30px;
      top: 20px;
`;


export const YeosuLogoBlackBox = styled.div`
      display: inline-block;
      width: 151px;
      height: 41px;
      background: url(${YeosuIconBlack})no-repeat center center;
      position:absolute;
      left: 30px;
      top: 20px;
`;


/**********************************************************************/


export const _AppContainer = {
    busan: {
        divHeight: '100%',
    },
    yeosu: {
        divHeight: '100%',
    }
}

export const AppContainer = styled.div`
     height:${_AppContainer[ProjectResource.styleMode].divHeight};
     /* padding-left:340px; */
     transition:padding-left .5s ease-in-out

     .taskListWrap{
         width:calc(50% - 60px);
         height: calc(100% - 118px);
         margin-top: 80px;
     }
     .isHidden{
         padding-left:30px;
     }

`;


/**********************************************************************/


export const _AppContainerPgProgress = {
    busan: {
        divHeight: '100%',
    },
    yeosu: {
        divHeight: '100%',
    }
}

export const AppContainerPgProgress = styled.div`
     height:${_AppContainerPgProgress[ProjectResource.styleMode].divHeight};
     padding-left:340px;
     transition:padding-left .5s ease-in-out;

    .taskListWrap{
        width:calc(50% - 60px);
        height: calc(100% - 118px);
        margin-top: 100px;
     }

    .pgProgress .taskListWrap .sectionBoxStart {
        display: flex;
        height: 60px;
        align-items: center;
        /* margin: 0px 34px; */
        color: #000000;
     }
    .pgProgress .taskListWrap .sectionBoxStart strong:before {
        counter-increment:taskOrder;
        content:no-close-quote;
        position:absolute; top:0; left:0;
    }
    .pgProgress .taskListWrap .sectionBoxStart strong {
        /* margin-left: 34px; width: calc(100% - 265px); */
    }
    .isHidden{padding-left:30px}

`;


/**********************************************************************/

export const _SubSectionMenualListWrap = {
    busan: {
    },
    yeosu: {
    }
}

export const SubSectionMenualListWrap= styled.div`
      float:left;
      height:calc(100% + 5px);
      border-radius:4px;
      width: 300px;
      margin-right: 40px;
      border-top-right-radius: 30px;
      background: #26395B;

      dl {
        margin-top: 36px;
      }

     .list dt {
        display: flex;
        padding:20px 23px;
        cursor:pointer;
        border-radius:3px;
        font-family: 'Pretendard';
        font-weight: 400;
        font-size: 18px;
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
     .list dd{
         display:none;
         background-color: #26395B;
         border-radius:3px;
         list-style: none;
         font-family: 'Pretendard';
         font-weight: 400;
         font-size: 14px;
      }
     .isShow dd{
         display:block
      }
     .list dt em{
         float:right; color:#ffb300;
      }
     .list li:hover{
         background:#225789;
      }
     .list li a{
         display:block;
         padding:18px 38px;
         font-size:14px;
         font-family: 'Pretendard';
         font-weight: 400;
         cursor:pointer;
      }
     .list li a:before{
         top:16px;
         left:20px;
      }
     .list li.is-active a:before,
     .list li a:hover:before{
          background-color:#ff8500;
      }
     .list li.is-active a,

     .bullet a{
          position:relative;
          padding-left:13px;
      }
     .bullet a:before{ /* content:''; */
          position:absolute;
          top:8px;
          left:4px;
          width:4px;
          height:4px;
          background-color:#fff;
          border-radius:4px;
      }
     .bullet a:before:hover{
          background-color:#ff8500;
      }

`;


/**********************************************************************/

export const _SubSectionnBoardListWrap = {
    busan: {
    },
    yeosu: {
    }
}

export const SubSectionnBoardListWrap = styled.div`
      float:left;
      height:calc(100% + 5px);
      border-radius:4px;
      background: #0D2348 !important;
      margin-top: 26px;
      width:calc(100% - 370px);

     .boardListWrap .tit{
          /* padding: 20px; */
          padding: 20px 20px 20px 0px;
          margin-bottom: 10px;
      }
     .tit{
          padding:20px;
          padding-left: 0;
      }
     .tit strong{
          float:left;
          font-family: 'Pretendard';
          font-size: 18px;
          font-weight: bold;
          color: #19A5FF;
      }
      .returnSOPBtn{
         display: inline-block;
         width: 16px;
         height: 16px;
         background: url(${ ReturnIcon })no-repeat center center;
         margin-left: 10px; cursor: pointer;
      }
     .tit .filterArea{
          float:right;
      }

     .titFirst{
          padding:20px
      }
     .titFirst strong{
          float:left;
     }
     .titFirst .filterArea{
          float:right;
     }

     .list li{
          border-bottom: solid 1px #d1d1d1;
      }
     .list li:hover {
          background-color:rgba(0,0,0,0.2);
      }
     .list a{
          font-family: 'Pretendard';
          font-weight: 400;
          font-size: 14px;
          color: #fff;
      }
     .list a p{
          float:left;
          width:calc(100% - 400px);
      }
     .list .noti{
          float:left;
          width:150px;
          font-family: 'Pretendard';
          font-weight: 400;
          font-size: 14px;
          color:#fff;
          text-align:center;
     }
     .list .noti.cGreen{
          color: #18ee9e;
     }
     .list .date{
          /* float:left;
          width:250px;
          text-align:center */
     }
     .innerSectionSOP{
         /* height: 86%; */
         overflow-y:auto;
         cursor:pointer;
     }
      
`;

/**********************************************************************/


export const _InnerSectionSOP = {
    busan: {
    },
    yeosu: {
    }
}

export const InnerSectionSOP = styled.div`
    overflow-y:auto;
    cursor:pointer;
`;

/**********************************************************************/


export const _SopListTable= {
    busan: {
    },
    yeosu: {
    }
}

export const SopListTable = styled.div`
    display: table;
    width: 100%;
    height: 100%;

    thead{
       height: 48px;
       line-height: 48px;
    }
    thead tr{  }
    thead tr th{
       font-family: 'Pretendard';
       font-weight: 400;
       font-size: 14px;
       color: #fff;
       background: #26395B;
    }
    tbody{  }
    tbody tr{ }
    tbody tr td{
       height: 48px;
       vertical-align: middle;
       text-align: center;
       border-bottom: solid 1px #7070706e;
       font-family: 'Pretendard';
       font-weight: 400;
       font-size: 14px;
       color: #fff;
    }
    tbody tr td p{
       font-family: 'Pretendard';
       font-weight: 400;
       font-size: 14px;
       color: #fff;
    }
   .sopSelectBox{
       display: block;
       width: 150px;
       height: 48px;
       line-height: 48px;
       /* background: #225789 url('../../SOPSimulator/img/selectArrow_icon.png')no-repeat 68% 50%; */
       background: #225789 url(${ SelectArrow })no-repeat 68% 50%;
       background-size: 10px;
       color: #fff;
       border-radius: 0px;
       text-align: center;
       padding-left: 50px;
    }
    .sopSelectBox option{
       width: 150px;
    }
      
`;

/**********************************************************************/


export const _PageNum = {
    busan: {
    },
    yeosu: {
    }
}

export const PageNum = styled.div`
    display: flex;
    text-align: center;
    justify-content: center;
    height:28px;
    line-height: 28px;
    margin-top: 50px;

    span{
       width: 28px;
       height: 28px;
       font-family: 'Pretendard';
       font-weight: 400;
       font-size: 14px;
       color: #fff;
       cursor: pointer;
       margin-right: 10px;
    }
    span:hover{
       width: 28px;
       height:28px;
       background: #39a7de;
       border-radius: 5px;
    }
    span.active{
       width: 28px;
       height:28px;
       background: #39a7de;
       border-radius: 5px;
    }
`;


/**********************************************************************/


export const _AppContainerWrapSop = {
    busan: {
    },
    yeosu: {
    }
}

export const AppContainerWrapSop = styled.div`
      height: calc(100vh - 0px); 
      overflow-y:hidden;
      background:#0D2348;
      padding-top: 100px;

`;


/**********************************************************************/

export const _TabArea = {
    busan: {
    },
    yeosu: {
    }
}

export const TabArea = styled.div`
    position:absolute;
    top: 154px;
    /* left:300px; */
    display: flex;
    width: calc(100% - 1120px);
    height: 31px;
    line-height: 31px;
    /* padding:0 30px; */
    
    ul{
      max-width: 97vw;
      white-space:nowrap;
      display:block; }
    li{
      display:inline-block;
      cursor:pointer;
      /* vertical-align: middle; */
    }
    li + li{
      margin-left:9px;
    }
    li a{
      display:block;
      /* width:140px; */
      height:31px;
      line-height: 31px;
      font-size:18px;
      text-align:center;
      color: #fff;
      /* background-color:#19A5FF; */
      background-color:#5487a1;
      font-family: 'Pretendard';
      font-weight: bold;
      border-radius: 5px;
      padding: 0px 10px;
    }
    li.isActive a{
      font-weight:600;
      color:#fff;
      background-color: #19A5FF;
    }
    li:last-child{
      text-overflow:ellipsis;
    }
    /* li.isActive a{
       font-weight:700;
       border-bottom:1px solid #1a1c2c;
       color:#39a7de;
       font-family: 'Spoqa Han Sans Neo', 'sans-serif';
       font-weight: 400;
       font-size: 18px;
     } */
    .tabAreaLeft {
        float:left;
        display: inline-block;
        width:100px;
        height:48px;
        padding:15px 0;
        border: 1px solid #3b3f5c;
        margin-right:10px;
        border-radius:5px;
     }
    .squaree {
        float:left;
        display: flex;
        border-radius:5px;
    }
    .leftt {
        width: 31px;
        height: 31px;
        background: url(${ SopSimuArrowLeft })no-repeat center center;
        background-position: center;
        cursor:pointer;
        margin-right: 6px;
    }
    .leftt:hover{
        background: url(${ SopSimuArrowLeftActive })no-repeat center center;
        background-repeat: no-repeat;
    }
    .rightt {
        flex-grow: 1;
        width: 31px;
        height: 31px;
        background: url(${ SopSimuArrowRight })no-repeat center center;
        background-repeat: no-repeat;
        background-position: center;
        cursor:pointer;
    }
    .rightt:hover{
        background: url(${ SopSimuArrowRightActive })no-repeat center center;
        background-repeat: no-repeat;
    }
    li a.plus {
        display:block;
        border:solid 1px #d1d1d1;
        position: absolute;
        width: 50px;
        height: 49px;
        border-radius: 5px;
        background-color:#1b2b36;
        background: url(${ PlusWhite })no-repeat center center;
        background-repeat: no-repeat;
        background-size:25px;
        background-position:center;
    }
    li a.plus:hover {
        background-color:#182630;
    }
    .posiRelative { position: relative;}
    .posiAbsolute{ position:absolute; top:-30px;}

    li:last-child{text-overflow:ellipsis; }

    .tabTitle{
        display: flex;
        width: 200px;
        font-family: 'Pretendard';
        font-weight: bold;
        font-size: 18px;
        align-items: center;
        color: #19A5ff;
     }
    .tabBox{
        /* max-width: calc(100% - 240px) !important; */
        width: 600px;
        overflow-x: auto;
        overflow-y: hidden;
        max-width: 550px !important;
        margin-right: 10px;
     }
    .tabBox::-webkit-scrollbar {
        display:none /* Chrome Safari Opera */
    }
    .onGoingSopImg {
        position: relative;
        top: -28px;
        left: 110px;
        width: 7px;
        height: 7px;
     }
    .menualArrowRight{
        display:inline-block;
        width: 24px;
        height: 24px;
        background: url(${ NavigateNext })no-repeat center center;
        cursor: pointer;
    }


`;


export const _TabAreaS = {
    busan: {
    },
    yeosu: {
    }
}

export const TabAreaS = styled.div`
    .tabArea li:last-child{
         text-overflow:ellipsis;
     }
    .tabArea li a{
         display:block;
         font-size:18px;
         /* background-color:#1a1c2c */
     }
    .tabArea li.isActive a{
         font-weight:700;
         border-bottom:1px solid #1a1c2c;
         color:#39a7de;
         font-family: 'Spoqa Han Sans Neo', 'sans-serif';
         font-weight: 400;
         font-size: 18px;
     }
    .tabArea li a.plus {
         display:block;
         border:solid 1px #d1d1d1;
         position: absolute;
         width: 50px;
         height: 49px;
         border-radius: 5px;
         background-color:#1b2b36;
         background-image:url(../../Common/image/icon/plusWhite-01.png);
         background-repeat: no-repeat;
         background-size:25px;
         background-position:center;
     }
    .tabArea li a.plus:hover {
         background-color:#182630;
     }
`;