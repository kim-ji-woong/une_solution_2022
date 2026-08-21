import styled from 'styled-components';
import PR from '../../Root/resource/id';
import '../../Common/css/commonSB.scss';

import iconPlayImg from '../img/turn-back-01.png'
import iconCheck from '../../Common/image/icon/icon-check.png'
import iconLeftt from '../../Common/image/icon/leftWhite-01.png'
import iconPlus from '../../Common/image/icon/plusWhite-01.png'
import iconArrowLeft from '../../Common/image/icon/leftWhite-01.png'
import iconMod from '../../Common/image/icon/icon-mod.png'
import iconPlay from '../../Common/image/icon/icon-play.png'
import iconEnd from '../../Common/image/icon/icon-end.png'
import resetIcon from '../../Common/image/icon/reset_ico.png'
import eyeOpen from '../../Common/img/chart/eye_open.png'
import eyeCl from '../../Common/img/chart/eye_cl.png'

import btnArrowUp_normal from '../../Common/img/chart/btnArrowUp_normal.png'
import btnArrowUp_dark from '../../Common/img/chart/btnArrowUp_dark.png'
import btnArrowDown_normal from '../../Common/img/chart/btnArrowDown_normal.png'
import btnArrowDown_dark from '../../Common/img/chart/btnArrowDown_dark.png'
import btnArrowLeft_normal from '../../Common/img/chart/btnArrowLeft_normal.png'
import btnArrowLeft_dark from '../../Common/img/chart/btnArrowLeft_dark.png'
import btnArrowRight_normal from '../../Common/img/chart/btnArrowRight_normal.png'
import btnArrowRight_dark from '../../Common/img/chart/btnArrowRight_dark.png'
import check_component from '../../Common/img/section/check_component.png'

import TitleBarIcon from '../../Common/img/imghydrogen/H_titleBarIcon.png';

/**********************************************************************/
/*sopSimulatorSBcall*/


/**********************************************************************/
// 공통 Color CSS

const SopCommon = {
    soulbrain: {
        textColor1: '#ffb300',
        textColor2: '#18ee9e',
        textColor3: '#ff8500',
        backgroundColor1: '#1B2B36',
        backgroundColor2: '#131D24',
        backgroundColor3: '#1B2B36',
        backgroundColor4: '#ffb300',
        backgroundColor5: '#222b3a',
        backgroundColor6: '#4D5967',
        listLiAFontSize: '18px',
        listddBorderBottom: 'solid 1px #D1D1D1',
        listDDpadding: '20px 0',
        sectionSkipBorder: 'solid 3px #FF9900',
        numListBackgroundColor: 'rgb(30, 38, 51)',
        innerSectionnnBorder: 'solid 1px #d1d1d1',

    },
    Wonik: {
        textColor1: '#5398FF',
        textColor2: '#5398FF',
        textColor3: '#5398FF',
        backgroundColor1: '#0E162D',
        backgroundColor2: '#0E162D',
        backgroundColor3: '#272E42',
        backgroundColor4: '#5398FF',
        backgroundColor5: '#272E42',
        backgroundColor6: '#4D5967',
        listLiAFontSize: '18px',
        listddBorderBottom: 'solid 1px #D1D1D1',
        listDDpadding: '20px 0',
        sectionSkipBorder: 'solid 3px #5398FF',
        numListBackgroundColor: '#272E42',
        innerSectionnnBorder: 'solid 1px #d1d1d1',
    },
    Hydrogen: {
        textColor1: '#0085FF',
        textColor2: '#0085FF',
        textColor3: '#0085FF',
        backgroundColor1: '#000f15',
        backgroundColor2: '#000F15',
        backgroundColor3: '#282829',
        backgroundColor4: '#0085FF',
        backgroundColor5: '#282829',
        backgroundColor6: '#000F15',
        listLiAFontSize: '14px',
        listddBorderBottom: 'dashed 1px #525868',
        listDDpadding: '0',
        sectionSkipBorder: 'solid 3px #0085FF',
        numListBackgroundColor: '#282829',
        innerSectionnnBackground: '#282829',
    },
    Gyeonggi: {
        textColor1: '#5398FF',
        textColor2: '#5398FF',
        textColor3: '#5398FF',
        backgroundColor1: '#0E162D',
        backgroundColor2: '#0E162D',
        backgroundColor3: '#272E42',
        backgroundColor4: '#5398FF',
        backgroundColor5: '#272E42',
        backgroundColor6: '#4D5967',
        listLiAFontSize: '18px',
        listddBorderBottom: 'solid 1px #D1D1D1',
        listDDpadding: '20px 0',
        sectionSkipBorder: 'solid 3px #5398FF',
        numListBackgroundColor: '#272E42',
        innerSectionnnBorder: 'solid 1px #d1d1d1',
    }
}


/**********************************************************************/


export const _SimulatorSBcallSection = {
    soulbrain: {
        sectionHeight: 'calc(100vh - 50px)',
        sectionOverflowY: 'hidden',
        sectionDisplay: 'block',
        sectionClear: 'both'
    },
    Wonik: {
        sectionHeight: 'calc(100vh - 50px)',
        overflowY: 'hidden',
        sectionDisplay: 'block',
        sectionClear: 'both'
    },
    Hydrogen: {
        sectionHeight: 'calc(100vh - 50px)',
        overflowY: 'hidden',
        sectionDisplay: 'block',
        sectionClear: 'both'
    },
    Gyeonggi: {
        sectionHeight: 'calc(100vh - 50px)',
        overflowY: 'hidden',
        sectionDisplay: 'block',
        sectionClear: 'both'
    }
}

export const SimulatorSBcallSection = styled.section`
    height: ${_SimulatorSBcallSection[PR.styleMode].sectionHeight};
    overflow-y: ${_SimulatorSBcallSection[PR.styleMode].sectionOverflowY};

    &::after {
        content: '';
        display: ${_SimulatorSBcallSection[PR.styleMode].sectionDisplay};
        clear: ${_SimulatorSBcallSection[PR.styleMode].sectionClear};
    }
   
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


`;


/**********************************************************************/


export const _AppContainer = {
    soulbrain: {
        divHeight: '100%',
        divPadding: '10px 30px',
        appContainerBorderRadius: '4px',
    },
    Wonik: {
        divHeight: '100%',
        divPadding: '20px 40px',
        appContainerBorderRadius: '4px',
    },
    Hydrogen: {
        divHeight: '100%',
        divPadding: '0 40px',
        divBackground: '#1E1E1E',
        appContainerdivPaddingTop: '20px',
        appContainerBorderRadius: '0px',
    },
    Gyeonggi: {
        divHeight: '100%',
        divPadding: '20px 40px',
        appContainerBorderRadius: '4px',
    }
}

export const AppContainer = styled.div`
    height: ${_AppContainer[PR.styleMode].divHeight};
    padding: ${_AppContainer[PR.styleMode].divPadding};
    background: ${_AppContainer[PR.styleMode].divBackground};
    padding-top: ${_AppContainer[PR.styleMode].appContainerdivPaddingTop};

    > section:not(.progressHistoryWrap) {
        float:left; 
        height:100%; 
        /* border-radius:4px; */
        border-radius: ${_AppContainer[PR.styleMode].appContainerBorderRadius};
    }
`;


/**********************************************************************/


export const _SubSectionMenualListWrap = {
    soulbrain: {
        sectionFloat: 'left',
        sectionHeight: 'calc(100% + 5px)',
        sectionBorderRadius: '4px',
        sectionWidth: '370px',
        sectionMarginRight: '20px',
        sectionBorder: 'solid 1px #d1d1d1;',
        sectionMenualListWrapFontSize: '20px',
        sectionMenualListWrapBorderBottom: '1px solid #454e5d',
        sectionMenualListWrapFontWeight: '500',
        listLiAPadding: '8px 30px',
    },
    Wonik: {
        sectionFloat: 'left',
        sectionHeight: 'calc(100% + 5px)',
        sectionBorderRadius: '4px',
        sectionWidth: '370px',
        sectionMarginRight: '20px',
        sectionBorder: 'solid 1px #d1d1d1;',
        sectionMenualListWrapFontSize: '20px',
        sectionMenualListWrapBorderBottom: '1px solid #454e5d',
        sectionMenualListWrapFontWeight: '500',
        listLiAPadding: '8px 30px',
    },
    Hydrogen: {
        sectionFloat: 'left',
        sectionHeight: 'calc(100% + 5px)',
        sectionBorderRadius: '4px',
        sectionWidth: '280px',
        sectionMarginRight: '33px',
        sectionBorder: 'none',
        sectionMenualListWrapBackground: '#282829',
        sectionMenualListWrapFontSize: '16px',
        sectionMenualListWrapBorderBottom: '1px dashed #525868',
        sectionMenualListWrapFontWeight: '600',
        listLiAPadding: '10px 30px',
    },
    Gyeonggi: {
        sectionFloat: 'left',
        sectionHeight: 'calc(100% + 5px)',
        sectionBorderRadius: '4px',
        sectionWidth: '370px',
        sectionMarginRight: '20px',
        sectionBorder: 'solid 1px #d1d1d1;',
        sectionMenualListWrapFontSize: '20px',
        sectionMenualListWrapBorderBottom: '1px solid #454e5d',
        sectionMenualListWrapFontWeight: '500',
        listLiAPadding: '8px 30px',
    }
}

export const SubSectionMenualListWrap = styled.section`
    float: ${_SubSectionMenualListWrap[PR.styleMode].sectionFloat};
    height: calc(100vh - 100px) !important;
    border-radius: ${_SubSectionMenualListWrap[PR.styleMode].sectionBorderRadius};
    width: ${_SubSectionMenualListWrap[PR.styleMode].sectionWidth};
    margin-right: ${_SubSectionMenualListWrap[PR.styleMode].sectionMarginRight};
    border: ${_SubSectionMenualListWrap[PR.styleMode].sectionBorder};
    background: ${_SubSectionMenualListWrap[PR.styleMode].sectionMenualListWrapBackground};

    .list dt {
        height:60px;
        padding:20px 23px;
        /* border-bottom:1px solid #454e5d; */
        border-bottom: ${_SubSectionMenualListWrap[PR.styleMode].sectionMenualListWrapBorderBottom};
        /* font-size:20px; */
        font-size: ${_SubSectionMenualListWrap[PR.styleMode].sectionMenualListWrapFontSize};
        /* font-weight:500; */
        font-weight: ${_SubSectionMenualListWrap[PR.styleMode].sectionMenualListWrapFontWeight};
        letter-spacing:-0.05em;
        cursor:pointer;
        /* border-bottom:solid 1px #d1d1d1; */ 
        border-radius:3px;
    }

    .list dd {
        display:none;
        /* padding:20px 0; */
        padding: ${SopCommon[PR.styleMode].listDDpadding};
        background-color: ${SopCommon[PR.styleMode].backgroundColor1};
        /* border-bottom:solid 1px #d1d1d1; */
        border-bottom: ${SopCommon[PR.styleMode].listddBorderBottom};
        border-radius:3px;
        overflow-y:auto;
        max-height: calc(100vh - 270px);
    }

    .isShow dd {
        display:block;
    }

    .list dt em {
        float:right; 
        color: ${SopCommon[PR.styleMode].textColor1};
    }

    .list li a {
        display:block;
        /* padding:8px 30px; */
        padding: ${_SubSectionMenualListWrap[PR.styleMode].listLiAPadding};
        /* font-size:18px; */
        font-size: ${SopCommon[PR.styleMode].listLiAFontSize};
        cursor:pointer;
    }

    .list li a:before {
        top:16px;
        left:20px;
    }

    .list li.is-active a:before,
    .list li a:hover:before {
        background-color: ${SopCommon[PR.styleMode].textColor3};
    }

    .list li.is-active a,
    .list li a:hover {
        color: ${SopCommon[PR.styleMode].textColor3};
    }

    .bullet a {
        position:relative;
        padding-left:13px;
    }

    .bullet a:before {
        content:'';
        position:absolute;
        top:8px;
        left:4px;
        width:4px;
        height:4px;
        background-color:#fff;
        border-radius:4px;
    }

    .bullet a:before:hover {
        background-color: ${SopCommon[PR.styleMode].textColor3};
    }
`;


/**********************************************************************/


export const _SubSectionBoardListWrap = {
    soulbrain: {
        sectionFloat: 'left',
        sectionHeight: 'calc(100% + 5px)',
        sectionBorderRadius: '4px',
        sectionBoardListWrapWidth: 'calc(100% - 390px)',
        sectionBoardListWrapBorder: 'solid 1px #d1d1d1',
        sectionBoardListWrapPadding: '20px',
        sectionBoardListWrapBorderBottom: 'solid 1px #d1d1d1',
        sectionBoardListWrapFontWeight: '700',
        sectionBoardListWrapListaPadding: '30px 88px',
        sectionBoardListWrapListaFontSize: '20px',
        sectionBoardListWrapListaTop: '30px',
        sectionBoardListWrapBorderRadius: '4px',
        BoardListWrapListLiBorderBottom: 'solid 1px #D1D1D1',
    },
    Wonik: {
        sectionFloat: 'left',
        sectionHeight: 'calc(100% + 5px)',
        sectionBorderRadius: '4px',
        sectionBoardListWrapWidth: 'calc(100% - 390px)',
        sectionBoardListWrapBorder: 'solid 1px #d1d1d1',
        sectionBoardListWrapPadding: '20px',
        sectionBoardListWrapBorderBottom: 'solid 1px #d1d1d1',
        sectionBoardListWrapFontWeight: '700',
        sectionBoardListWrapListaPadding: '30px 88px',
        sectionBoardListWrapListaFontSize: '20px',
        sectionBoardListWrapListaTop: '30px',
        sectionBoardListWrapBorderRadius: '4px',
        BoardListWrapListLiBorderBottom: 'solid 1px #D1D1D1',
    },
    Hydrogen: {
        sectionFloat: 'left',
        /* sectionHeight: 'calc(100% - 300px)', */
        sectionBoardListWrapHeight: 'calc(100% - 30px) !important',
        sectionBorderRadius: '0',
        sectionBoardListWrapMarginTop: '0px',
        sectionBoardListWrapWidth: 'calc(100% - 320px)',
        sectionBoardListWrapPadding: '13px 35px',
        sectionBoardListWrapFontWeight: '700',
        sectionBoardListWrapListaPadding: '20px 88px',
        sectionBoardListWrapListaFontSize: '16px',
        sectionBoardListWrapListaTop: '20px',
        sectionBoardListWrapBorderRadius: '0px',
        BoardListWrapListLiBorderBottom: 'dashed 1px #525868',
        sectionBoardListWrapBackground: '#282829',
    },
    Gyeonggi: {
        sectionFloat: 'left',
        sectionHeight: 'calc(100% + 5px)',
        sectionBorderRadius: '4px',
        sectionBoardListWrapWidth: 'calc(100% - 390px)',
        sectionBoardListWrapBorder: 'solid 1px #d1d1d1',
        sectionBoardListWrapPadding: '20px',
        sectionBoardListWrapBorderBottom: 'solid 1px #d1d1d1',
        sectionBoardListWrapFontWeight: '700',
        sectionBoardListWrapListaPadding: '30px 88px',
        sectionBoardListWrapListaFontSize: '20px',
        sectionBoardListWrapListaTop: '30px',
        sectionBoardListWrapBorderRadius: '4px',
        BoardListWrapListLiBorderBottom: 'solid 1px #D1D1D1',
    }
}

export const SubSectionBoardListWrap = styled.section`
    float: ${_SubSectionBoardListWrap[PR.styleMode].sectionFloat};
    /* height: ${_SubSectionBoardListWrap[PR.styleMode].sectionHeight}; */
    height: ${_SubSectionBoardListWrap[PR.styleMode].sectionBoardListWrapHeight};
    border-radius: ${_SubSectionBoardListWrap[PR.styleMode].sectionBorderRadius};

    /* width:calc(100% - 390px); */
    width: ${_SubSectionBoardListWrap[PR.styleMode].sectionBoardListWrapWidth};
    /* border-radius: 4px; */
    border-radius: ${_SubSectionBoardListWrap[PR.styleMode].sectionBoardListWrapBorderRadius};
    /* border: solid 1px #d1d1d1; */
    border: ${_SubSectionBoardListWrap[PR.styleMode].sectionBoardListWrapBorder};
    margin-top: ${_SubSectionBoardListWrap[PR.styleMode].sectionBoardListWrapMarginTop};
    background: ${_SubSectionBoardListWrap[PR.styleMode].sectionBoardListWrapBackground};


    .tit {
        display:block;
        padding:20px 0;
        font-size:20px;
        /* font-weight:700; */
        font-weight: ${_SubSectionBoardListWrap[PR.styleMode].sectionBoardListWrapFontWeight};
        /* border-top-left-radius:4px;
        border-top-right-radius:4px; */

        border-top-left-radius: none;
        border-top-right-radius: none;
        letter-spacing:-0.05em;
        background-color: ${SopCommon[PR.styleMode].backgroundColor2};
        text-align:center;
        cursor:default;
		/* border-bottom:solid 1px #d1d1d1; */
        border-bottom: ${_SubSectionBoardListWrap[PR.styleMode].sectionBoardListWrapBorderBottom};
        border: ${_SubSectionBoardListWrap[PR.styleMode].sectionBoardListWrapBorder};
        color: ${SopCommon[PR.styleMode].textColor2};
        /* padding:20px; */
        padding: ${_SubSectionBoardListWrap[PR.styleMode].sectionBoardListWrapPadding};
    }

    .tit::after {
        content: '';
        display: ${_SimulatorSBcallSection[PR.styleMode].sectionDisplay};
        clear: ${_SimulatorSBcallSection[PR.styleMode].sectionClear};
    }

    .tit strong {
        float:left;
    }

    .tit .filterArea {
        float:right;
    }

    .tit .filterArea::after {
        content: '';
        display: ${_SimulatorSBcallSection[PR.styleMode].sectionDisplay};
        clear: ${_SimulatorSBcallSection[PR.styleMode].sectionClear};
    }

    .tit .filterArea > div {
        float:left;
    }

    .tit .filterArea > div + div {
        margin-left:40px;
    }

    .tit .filterArea input[type=checkbox] {
        width:20px;
        height:20px;
        background-color:rgba(0,0,0,0);
        border:1px solid #fff;
        vertical-align:top;
    }

    .tit .filterArea input[type=checkbox]:checked {
        background:url(${iconCheck}) no-repeat center center;
        background-size:15px auto !important;
    }

    .tit .filterArea label {
        font-size:20px;
        font-weight:500;
        line-height:1; 
        color: ${SopCommon[PR.styleMode].textColor1};
        text-align: center; 
        letter-spacing: -1px;
    }

    .tit .filterArea .cGreen label {
        color: ${SopCommon[PR.styleMode].textColor2};
    }

    .tit .iconPlay2{
        position:absolute;
        left:570px;
        width:30px;
        height:20px;
        background: url(${iconPlayImg}) no-repeat; 
        background-size:100%;
    }

    .list li {
        /* border-bottom: solid 1px #d1d1d1; */
        border-bottom: ${_SubSectionBoardListWrap[PR.styleMode].BoardListWrapListLiBorderBottom};
    }

    .list li:hover {
        background-color:rgba(0,0,0,0.2);
    }

    .list a {
        display:block;
        /* padding:30px 88px; */
        padding: ${_SubSectionBoardListWrap[PR.styleMode].sectionBoardListWrapListaPadding};
        padding-right:0;
        /* font-size:20px; */
        font-size: ${_SubSectionBoardListWrap[PR.styleMode].sectionBoardListWrapListaFontSize};
        font-weight:100;
        letter-spacing:-0.05em;
    }

    .list a:before {
        /* top:30px; */
        top: ${_SubSectionBoardListWrap[PR.styleMode].sectionBoardListWrapListaTop};
        left:35px;
    }

    .list a:after {
        content:'';
        display:block;
        clear:both;
    }

    .list a p {
        float:left;
        width:calc(100% - 400px);
    }

    input[type="checkbox"] + label {
        display: inline;
        vertical-align: middle;
        margin-left: 7px;
        cursor: pointer;
        font-family: 'Pretendard';
    }
`;


/**********************************************************************/


export const _Noti = {
    soulbrain: {
        spanFloat: 'left',
        spanWidth: '150px',
        spanFontWeight: '400',
        spanTextAlign: 'center',
        spanTextColor: '#FFB300',
    },
    Wonik: {
        spanFloat: 'left',
        spanWidth: '150px',
        spanFontWeight: '400',
        spanTextAlign: 'center',
        spanTextColor: '#5398FF',
    },
    Hydrogen: {
        spanFloat: 'left',
        spanWidth: '150px',
        spanFontWeight: '400',
        spanTextAlign: 'center',
        //spanTextColor: '#282829',
        spanTextColor: '#0085FF',
    },
    Gyeonggi: {
        spanFloat: 'left',
        spanWidth: '150px',
        spanFontWeight: '400',
        spanTextAlign: 'center',
        spanTextColor: '#5398FF',
    }
}

export const Noti = styled.span`
    float: ${_Noti[PR.styleMode].spanFloat};
    width: ${_Noti[PR.styleMode].spanWidth};
    font-weight: ${_Noti[PR.styleMode].spanFontWeight};
    /* color: ${SopCommon[PR.styleMode].textColor1}; */
    color: ${_Noti[PR.styleMode].spanTextColor};
    text-align: ${_Noti[PR.styleMode].spanTextAlign};
`;


/**********************************************************************/


export const CGreenNoti = styled(Noti)`
    color: ${SopCommon[PR.styleMode].textColor2};
`;


/**********************************************************************/


export const _Date = {
    soulbrain: {
        spanFloat: 'left',
        spanWidth: '250px',
        spanTextAlign: 'center',
    },
    Wonik: {
        spanFloat: 'left',
        spanWidth: '250px',
        spanTextAlign: 'center',
    },
    Hydrogen: {
        spanFloat: 'right',
        spanWidth: '250px',
        spanTextAlign: 'center',
    },
    Gyeonggi: {
        spanFloat: 'left',
        spanWidth: '250px',
        spanTextAlign: 'center',
    }
}

export const DateStyle = styled.span`
    float: ${_Date[PR.styleMode].spanFloat};
    width: ${_Date[PR.styleMode].spanWidth};
    text-align: ${_Date[PR.styleMode].spanTextAlign};
`;


/**********************************************************************/


export const _InnerSection = {
    soulbrain: {
        sectionHeight: 'calc(100vh - 50px)',
        InnerSectionMaxHeight: 'calc(100% - 60px)',
        innerSectionBoxShadow: '0px 0px 4.5px 0.5px rgba(0, 0, 0, 0.5)',
    },
    Wonik: {
        sectionHeight: 'calc(100vh - 50px)',
        InnerSectionMaxHeight: 'calc(100% - 60px)',
        innerSectionBoxShadow: '0px 0px 4.5px 0.5px rgba(0, 0, 0, 0.5)',
    },
    Hydrogen: {
        sectionHeight: 'calc(100vh - 50px)',
        InnerSectionMaxHeight: 'calc(100% - 50px)',
        innerSectionBoxShadow: 'none',
    },
    Gyeonggi: {
        sectionHeight: 'calc(100vh - 50px)',
        InnerSectionMaxHeight: 'calc(100% - 60px)',
        innerSectionBoxShadow: '0px 0px 4.5px 0.5px rgba(0, 0, 0, 0.5)',
    }
}

export const InnerSection = styled.div`
    /* max-height:calc(100% - 60px); */
    max-height: ${_InnerSection[PR.styleMode].InnerSectionMaxHeight};
    overflow-y:auto; 
    background-color: ${SopCommon[PR.styleMode].backgroundColor3};
    border-radius:4px;
    /* box-shadow:0px 0px 4.5px 0.5px rgba(0, 0, 0, 0.5); */
    box-shadow: ${_InnerSection[PR.styleMode].innerSectionBoxShadow};
    cursor:pointer;

    &::-webkit-scrollbar {
        width:5.5px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: rgb(125, 131, 137); 
        opacity:.4
    }
    &::-webkit-scrollbar-track {
        background-color: rgb(61, 63, 71);
        border-radius:3px;
    }
    &::-webkit-scrollbar-corner {
        display:none;
    }
`;


/**********************************************************************/

export const NumList = styled.ol`
    counter-reset:number;

    a {
        position:relative;
        padding-left:16px;
    }

    a:before {
        counter-increment:number;
        content:counters(number, '.')". ";
        position:absolute;
        top:0;
        left:0
    }
`;

/*sopSimulatorSBcall*/
/***********************************************************************/
/*sopSimulatorBody*/


export const _SimulatorBodySection = {
    soulbrain: {
        sectionHeight: 'calc(100vh - 60px)',
        sectionOverflowY: 'hidden',
        sectionPaddingTop: '60px',
    },
    Wonik: {
        sectionHeight: 'calc(100vh - 60px)',
        sectionOverflowY: 'hidden',
        sectionPaddingTop: '60px',
    },
    Hydrogen: {
        sectionHeight: 'calc(100vh - 50px)',
        sectionOverflowY: 'hidden',
        sectionPaddingTop: '80px',
        sectionBackColor: '#1E1E1E',
    },
    Gyeonggi: {
        sectionHeight: 'calc(100vh - 60px)',
        sectionOverflowY: 'hidden',
        sectionPaddingTop: '60px',
    }
}

export const SimulatorBodySection = styled.section`
    height: ${_SimulatorBodySection[PR.styleMode].sectionHeight};
    overflow-y: ${_SimulatorBodySection[PR.styleMode].sectionOverflowY};
    padding-top: ${_SimulatorBodySection[PR.styleMode].sectionPaddingTop};
    background: ${_SimulatorBodySection[PR.styleMode].sectionBackColor};


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
    


`;


/**********************************************************************/


export const _AppContainerPgProgress = {
    soulbrain: {
        sectionPaddingLeft: '380px',
        isHiddenPaddingLeft: '30px',
    },
    Wonik: {
        sectionPaddingLeft: '390px',
        isHiddenPaddingLeft: '40px',
    },
    Hydrogen: {
        sectionPaddingLeft: '390px',
        isHiddenPaddingLeft: '40px',
    },
    Gyeonggi: {
        sectionPaddingLeft: '390px',
        isHiddenPaddingLeft: '40px',
    }
}

export const AppContainerPgProgress = styled(AppContainer)`
    position:relative;
    padding-left: ${_AppContainerPgProgress[PR.styleMode].sectionPaddingLeft};
    transition:padding-left .5s ease-in-out;

    &.isHidden {
        padding-left: ${_AppContainerPgProgress[PR.styleMode].isHiddenPaddingLeft};
    }

    &.isHidden .progressHistoryWrap {
        position:absolute;
        left:-340px;
        overflow:visible;
    }

    &.isHidden .progressHistoryWrap .btnToggle {
        right:-40px;
        padding-left:10px;
        border-bottom-right-radius:4px;
    }

    &.isHidden .btnToggle .iconArrowLeft {
        width:28px; 
        height:28px; 
        background:url(${iconArrowLeft}) no-repeat;
        background-size:25px; 
        transform: rotate(180deg);
    }

    &.isHidden .progressViewWrap {
        width:calc(50% - 10px);
    }

    &.isHidden .taskListWrap {
        width:calc(50% - 10px);
    }
`;


/**********************************************************************/


export const _TabArea = {
    soulbrain: {
        TabAreaPadding: '0 30px',
        TabAreaTop: '-51px',
        liAPosiAbsolute: '-50px',
        TabAreaLiAPadding: '15px 0',
        liABorder: '1px solid #d1d1d1',
    },
    Wonik: {
        TabAreaPadding: '0 40px',
        TabAreaTop: '-51px',
        liAPosiAbsolute: '-50px',
        TabAreaLiAPadding: '15px 0',
        liABorder: '1px solid #d1d1d1',
    },
    Hydrogen: {
        TabAreaPadding: '0 40px',
        TabAreaTop: '-56px',
        liAPosiAbsolute: '-50px',
        TabAreaLiAPadding: '15px 10px',
        liABorder: '1px solid #0085FF',
    },
    Gyeonggi: {
        TabAreaPadding: '0 40px',
        TabAreaTop: '-51px',
        liAPosiAbsolute: '-50px',
        TabAreaLiAPadding: '15px 0',
        liABorder: '1px solid #d1d1d1',
    }
}

export const TabArea = styled.div`
    position:absolute;
    /* top:-51px; */
    top: ${_TabArea[PR.styleMode].TabAreaTop};
    left:0; 
    width:100%; 
    padding: ${_TabArea[PR.styleMode].TabAreaPadding};

    ul {
        max-width: 97vw;  
        white-space:nowrap; 
        overflow-x:hidden; 
        display:block;
    }

    li {
        display:inline-block; 
        cursor:pointer;
    }

    li + li {
        margin-left:9px;
    }

    li a {
        display:block;
        width:270px;
        height:51px;
        /* padding:15px 0; */
        padding: ${_TabArea[PR.styleMode].TabAreaLiAPadding};
        font-size:18px; 
        border: ${_TabArea[PR.styleMode].liABorder};
        border-radius:3px; 
        text-align:center;
        color: #fff; 
        background-color:#2e303b;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    li a:hover {
        background:rgba(0,0,0,0.2);
    }

    li.isActive a {
        font-weight:600; 
        color:#000000; 
        background-color: ${SopCommon[PR.styleMode].backgroundColor4};

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .onGoingSopImg {
        position: relative;
        top: -40px;
        left: 250px;
        width: 7px;
        height: 7px;
    }

    li:last-child {
        text-overflow:ellipsis;
    }

    li a.plus {
        display:block; 
        border: ${_TabArea[PR.styleMode].liABorder};
        position: absolute; 
        width: 50px; 
        height: 49px; 
        border-radius: 5px;  
        background-color: ${SopCommon[PR.styleMode].backgroundColor1};
        background-image: url(${iconPlus});
        background-repeat: no-repeat; 
        background-size:25px; 
        background-position:center;
    }

    li a.plus:hover {
        background-color:#182630;
    }

    li a.posiAbsolute {
        position:absolute; 
        /* top:-30px; */
        top: ${_TabArea[PR.styleMode].liAPosiAbsolute};
    }

    li.posiRelative {
        position: relative;
    }


`;


/**********************************************************************/

export const Squaree = styled.div`
    float:left; 
    display: flex; 
    height:50px; 
    width:65px; 
    margin-right:10px; 
    border-radius:5px;
    border:solid 1px #d1d1d1; 
    border-radius: 5px; 
    background-color: ${SopCommon[PR.styleMode].backgroundColor1};
`;


/**********************************************************************/

export const Leftt = styled.section`
    width: 50%;  
    background-image: url(${iconLeftt}); 
    background-repeat: no-repeat; 
    background-size: 25px;
    background-position: center; 
    background-position-x: 8px; 
    cursor:pointer;

    &:hover {
        background-color:#182630; 
        border-radius:3px;
    }
`;


/**********************************************************************/

export const Rightt = styled.section`
    flex-grow: 1; 
    background-image: url(${iconLeftt}); 
    background-repeat: no-repeat;
    background-size: 25px; 
    background-position: center; 
    transform: rotate(180deg); 
    background-position-x: 8px; 
    cursor:pointer;

    &:hover {
        background-color:#182630; 
        border-radius:3px;
    }
`;


/**********************************************************************/


export const _SubSectionProgressHistoryWrap = {
    soulbrain: {
        sectionFloat: 'left',
        sectionHeight: 'calc(100% - 15px)',
        sectionBorderRadius: '4px',
        sectionLeft: '30px',
        titBorder: 'solid 1px #d1d1d1',
    },
    Wonik: {
        sectionFloat: 'left',
        sectionHeight: 'calc(100% - 34px)',
        sectionBorderRadius: '4px',
        sectionLeft: '40px',
        titBorder: 'solid 1px #d1d1d1',
    },
    Hydrogen: {
        sectionFloat: 'left',
        sectionHeight: 'calc(100% - 44px)',
        sectionBorderRadius: '4px',
        sectionLeft: '40px',
    },
    Gyeonggi: {
        sectionFloat: 'left',
        sectionHeight: 'calc(100% - 34px)',
        sectionBorderRadius: '4px',
        sectionLeft: '40px',
        titBorder: 'solid 1px #d1d1d1',
    }
}

export const SubSectionProgressHistoryWrap = styled.section`
    float: ${_SubSectionProgressHistoryWrap[PR.styleMode].sectionFloat};
    border-radius: ${_SubSectionProgressHistoryWrap[PR.styleMode].sectionBorderRadius};

    position:absolute;
    left:${_SubSectionProgressHistoryWrap[PR.styleMode].sectionLeft};
    width:330px; 
    height: ${_SubSectionProgressHistoryWrap[PR.styleMode].sectionHeight};
    margin-right:20px;
    transition:left .5s ease-in-out;

    .tit {
        position:relative;
        font-size:20px;
        font-weight:700;
        border-top-left-radius:4px;
        border-top-right-radius:4px;
        letter-spacing:-0.05em;
        background-color: ${SopCommon[PR.styleMode].backgroundColor2};
        text-align:center;
        cursor:default;
		border: ${_SubSectionProgressHistoryWrap[PR.styleMode].titBorder};
        color: ${SopCommon[PR.styleMode].textColor2};
        padding: 20px 40px 20px 0px;
    }

    .tit::after {
        content: '';
        display: ${_SimulatorSBcallSection[PR.styleMode].sectionDisplay};
        clear: ${_SimulatorSBcallSection[PR.styleMode].sectionClear};
    }

    .tit strong {
        float:left;
    }

    .btnToggle {
        position:absolute;
        top:0;
        right:0;
        width:40px;
        height:60px;
        text-align:center; 
		background-color: ${SopCommon[PR.styleMode].textColor3};
        border-top-right-radius:4px;
        transition:right .5s ease-in-out;
    }

    .iconArrowLeft {
        display:block; 
        width:28px; 
        height:28px; 
        background:url(${iconArrowLeft}) no-repeat; 
        background-size: 25px;
        background-position-x:7px; 
        background-position-y: 2px;
    }

    .innerSectionn {
        overflow-y:auto; 
        padding:15px; 
        line-height:25px; 
        font-weight:400; 
        font-size:15px; 
        margin-bottom: 10px;  
        background-color: ${SopCommon[PR.styleMode].backgroundColor5};
        border-radius:4px;
        box-shadow:0px 0px 4.5px 0.5px rgba(0, 0, 0, 0.5); 
        border: ${SopCommon[PR.styleMode].innerSectionnnBorder};
    }

    .innerSectionn ul li {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .innerSectionnn {
        max-height:calc(100% - 290px); 
        overflow-y: auto;  
        border-radius: 4px; 
        box-shadow: 0px 0px 4.5px 0.5px rgb(0 0 0 / 50%);
        border: ${SopCommon[PR.styleMode].innerSectionnnBorder};
        height: 100%;
        background-color: ${SopCommon[PR.styleMode].innerSectionnnBackground};
    }

    .numList {
        counter-reset:number;
        background-color: ${SopCommon[PR.styleMode].numListBackgroundColor};
    }

    .numList li {
        border-bottom: 1px solid #d1d1d1;
    }

    .numList .btnList {
        display:table;
        width:100%;
        padding: 20px 30px 20px 50px;
        border-bottom: solid 1px #d1d1d1;
    }
    
    .numList .btnList:before {
        position: absolute;
        top: 20px;
        left: 20px;
        font-weight: 500;
        counter-increment: number;
        content: counters(number,".")". ";
    }

    .numList .btnList > span:nth-child(1) {
        width: 100px;
    }

    .numList .btnList > span:nth-child(2) {
        width: 60px;
    }

    .numList .btnList:last-child {
        border: none;
    }

    .numList .btnList span {
        display:table-cell;
        font-weight:500;
    }

    .numList .btnList span:not(.text) {
        text-align:center;
    }

    .numList .btnList .text {
        max-width:100px; 
        white-space: nowrap; 
        text-overflow:ellipsis; 
        overflow:hidden;
    }

    .numList .detailInfo {
        display:none;
        background-color:#0e1829;
    }

    .numList .detailInfo > span {
        display:table-cell;
        width:50%;
        padding:20px;
        line-height:20px;
        font-weight:300;
        vertical-align:middle;
        word-break:keep-all;
    }

    .numList .detailInfo:after {
        content:'';
        display:block; 
        clear:both;
    }

    .numList .isShow .btnList:after {
        transform:rotateX(180deg);
    }

    .list li {
        border-bottom: solid 1px #d1d1d1;
    }

    .list li:hover {
        background-color:rgba(0,0,0,0.2);
    }

    .list a {
        position: relative;
    }

    // .list a:before {
    //     top:30px;
    //     left:35px;
    // }

    // .list a:after {
    //     content:'';
    //     display:block;
    //     clear:both;
    // }

    // .list a p {
    //     float:left;
    //     width:calc(100% - 400px);
    // }
`;


/**********************************************************************/


/**********************************************************************/


export const _SubSectionProgressViewWrap = {
    soulbrain: {
        sectionFloat: 'left',
        sectionHeight: 'calc(100% + 5px)',
        sectionBorderRadius: '4px',
    },
    Wonik: {
        sectionFloat: 'left',
        sectionHeight: 'calc(100% + 5px)',
        sectionBorderRadius: '4px',
    },
    Hydrogen: {
        sectionFloat: 'left',
        sectionHeight: 'calc(100% - 40px) !important',
        sectionBorderRadius: '4px',
    },
    Gyeonggi: {
        sectionFloat: 'left',
        sectionHeight: 'calc(100% + 5px)',
        sectionBorderRadius: '4px',
    }
}

export const SubSectionProgressViewWrap = styled.section`
    float: ${_SubSectionProgressViewWrap[PR.styleMode].sectionFloat};
    height: ${_SubSectionProgressViewWrap[PR.styleMode].sectionHeight};
    border-radius: ${_SubSectionProgressViewWrap[PR.styleMode].sectionBorderRadius};

    width:calc(50% + 10px);
    margin-right:20px;

    .tit {
        display:block;
        padding:10px 20px;
        font-size:20px;
        font-weight:700;
        border-top-left-radius:4px;
        border-top-right-radius:4px;
        letter-spacing:-0.05em;
        background-color: ${SopCommon[PR.styleMode].backgroundColor2};
        text-align:center;
        cursor:default;
		border: ${SopCommon[PR.styleMode].innerSectionnnBorder};
        color: ${SopCommon[PR.styleMode].textColor2};
    }

    .tit strong {
        float:left;
        font-weight:700;
        line-height:40px;
    }

    .tit::after {
        content: '';
        display: ${_SimulatorSBcallSection[PR.styleMode].sectionDisplay};
        clear: ${_SimulatorSBcallSection[PR.styleMode].sectionClear};
    }

    .btnArea {
        float:right;
        padding:10px 0;
        font-size:0;
    }

    .btnArea button + button {
        margin-left:30px;
    }


    .isActive button {
        background-color:#39a7de;
        color:#fff;
    }

    .iconMod {
        display:inline-block;
        vertical-align:top;
        width:20px;
        height:20px;
        background:url(${iconMod}) no-repeat;
    }

    .iconPlay {
        display:inline-block;
        vertical-align:top;
        width:17px;
        height:20px;
        background:url(${iconPlay}) no-repeat;
    }

    .iconEnd {
        display:inline-block;
        vertical-align:top;
        width:21px;
        height:20px;
        background:url(${iconEnd}) no-repeat
    }
`;


/**********************************************************************/


export const _ChartWrap = {
    soulbrain: {
        chartAreaBackground: '#162234',
    },
    Wonik: {
        chartAreaBackground: 'rgb(14, 22, 45)',
    },
    Hydrogen: {
        chartAreaBackground: '#282829',
    },
    Gyeonggi: {
        chartAreaBackground: 'rgb(14, 22, 45)',
    }
}



export const ChartWrap = styled.div`
    position: relative;
    height: calc(100% - 55px);
    border-radius: 4px;
    border: ${SopCommon[PR.styleMode].innerSectionnnBorder};

    .infoList {
        position: absolute;
        top: 30px;
        left: 30px;
        z-index: 2;
    }

    .infoList button {
        width: 90px;
        height: 40px;
        font-size: 18px;
        font-weight: 700;
        color: #c6c6c6;
        border: 2px solid rgba(198, 198, 198, 0.5);
        text-align: center;
        border-radius: 20px;
        cursor: default;
        z-index: 2;
        position: relative;
    }

    .infoList .actCircle {
        border-radius: 50%;
        color: red;
        list-style: disc;
    }

    .infoList li + li {
        margin-top: 10px;
        z-index: 2;
    }

    .chartArea {
        width: 100%;
        height: 100%;
        overflow-y: hidden;
        background: ${_ChartWrap[PR.styleMode].chartAreaBackground};
    }

    .panelAreas {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    #refresh {
        width: 60px;
        height: 40px;
        padding: 8px 3px;
        cursor: pointer;
        position: absolute;
        top: 30px;
        right: 10px;
        z-index: 2;
        background-image: url(${resetIcon});
        background-repeat: no-repeat;
    }

    .sectionPanels {
        width: 100%;
        height: 100%;
        display: flex;
    }

    .sectionPanel {
        border: 2px solid black;
        display: flex;
        flex-direction: column;
        overflow: auto;
    }

    .class1st.unActive button {
        background-color: #39a7de;
        color: #fff;
        cursor: pointer;
        opacity: 0.5;
        border: none;
        cursor: pointer;
    }

    .class2nd.unActive button {
        /*background-color: #f3ee0c;*/
        background-color: #ffc444;
        color: #fff;
        cursor: pointer;
        opacity: 0.5;
        border: none;
        cursor: pointer;
    }
    .class3rd.unActive button {
        /*background-color: #ffbc36;*/
        background-color: #ff3632;
        color: #fff;
        cursor: pointer;
        opacity: 0.5;
        border: none;
        cursor: pointer;
    }
    .class4th.unActive button {
        background-color: #da4b4d;
        color: #fff;
        cursor: pointer;
        opacity: 0.5;
        border: none;
        cursor: pointer;
    }
    .class1st.isActive button {
        background-color: #39a7de;
        color: #fff;
        border: none;
        text-shadow: 1px 1px 1px black;
        cursor: pointer;
    }
    .class2nd.isActive button {
        /*background-color: #f3ee0c;*/
        background-color: #ffc444;
        color: #fff;
        border: none;
        text-shadow: 1px 1px 1px black;
        cursor: pointer;
    }
    .class3rd.isActive button {
        /*background-color: #ffbc36;*/
        background-color: #ff3632;
        color: #fff;
        border: none;
        text-shadow: 1px 1px 1px black;
        cursor: pointer;
    }
    .class4th.isActive button {
        background-color: #da4b4d;
        color: #fff;
        border: none;
        text-shadow: 1px 1px 1px black;
        cursor: pointer;
    }

    /*test**********************************/

    .class1stTlb.unActive button {
        background-color: #39a7de;
        color: #fff;
        cursor: pointer;
        opacity: 0.5;
        border: none;
        cursor: pointer;
    }

    .class2ndTlb.unActive button {
        background-color: #F2BE08;
        color: #fff;
        cursor: pointer;
        opacity: 0.4;
        border: none;
        cursor: pointer;
    }
    .class3rdTlb.unActive button {
        background-color: #FF6D00;
        color: #fff;
        cursor: pointer;
        opacity: 0.4;
        border: none;
        cursor: pointer;
    }
    .class4thTlb.unActive button {
        background-color: #E80800;
        color: #fff;
        cursor: pointer;
        opacity: 0.4;
        border: none;
        cursor: pointer;
    }
    .class1stTlb.isActive button {
        background-color: #39a7de;
        color: #fff;
        border: none;
        cursor: pointer;
    }
    .class2ndTlb.isActive button {
        background-color: #F2BE08;
        color: #fff;
        border: none;
        cursor: pointer;
    }
    .class3rdTlb.isActive button {
        background-color: #FF6D00;
        color: #fff;
        border: none;
        cursor: pointer;
    }
    .class4thTlb.isActive button {
        background-color: #E80800;
        color: #fff;
        border: none;
        cursor: pointer;
    }
`;


/**********************************************************************/


export const _SectionPanelComponent = {
    soulbrain: {
        selectedComponentBackground: `var(--colorRunComponentFill)`,
        selectedComponentBorder: `var(--sizeBorderLine) solid var(--colorRunComponentFill)`,
    },
    Wonik: {
        selectedComponentBackground: `#5398FF`,
        selectedComponentBorder: `var(--sizeBorderLine) solid #5398FF`,
    },
    Hydrogen: {
        selectedComponentBackground: `#0085FF`,
        selectedComponentBorder: `var(--sizeBorderLine) solid #0085FF`,
    },
    Gyeonggi: {
        selectedComponentBackground: `#5398FF`,
        selectedComponentBorder: `var(--sizeBorderLine) solid #5398FF`,
    }
};


export const SectionPanelComponent = styled.section`
    border: 2px solid black;
    display: flex;
    flex-direction: column;
    overflow: auto;


    .sectionGridFix {
        position: relative;
        width: var(--sizeGridInitWidth);
        height: 0;
        z-index: 10;
    }

        .sectionGridFix .btnToggleBorder {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 100;
            width: 50px;
            height: 50px;
            margin: 0;
            padding: 0;
            border: 0;
            background: #efefef url(${eyeOpen}) 50% 50% no-repeat;
        }
    
            .sectionGridFix .btnToggleBorder.isClose {
                background-image: url(${eyeCl});
            }
    
        .sectionGridFix .sectionGridRow {
            position: absolute;
            top: 50px;
            left: 0;
            width: 50px;
            height: var(--sizeGridInitHeight);
        }
    
        .sectionGridFix .sectionGridColumn {
            position: absolute;
            top: 0;
            left: 50px;
            width: 300px;
            height: 50px;
        }

        ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell:after {
            border: 0;
            /*background-color: #162234;*/
            /*z-index:1;*/
        }

        .sectionGridCell {
            position: relative;
            width: 100%;
            height: var(--sizeCellDefaultHeight);
            display: flex;
            justify-content: center;
            align-items: center;
            /*z-index: 0;*/
        }
        
            .sectionGridCell.selected {
                background-color: rgba(180, 180, 180, 0.3);
            }


            /* Section Componnet위의 화살표 버튼 */
            .btnArrowTop {
                position: absolute;
                width: 20px;
                height: 12px;
                top: -20px;
                background-image: url(${btnArrowUp_normal});
                background-size: 20px 12px;
                opacity: 0;
                z-index: 1;
            }
        
            .decisionArrowBox .btnArrowTop,
            .annotationArrowBox .btnArrowTop,
            .internalArrowBox .btnArrowTop {
                top: -15px;
            }
        
            .btnArrowTop:hover {
                background-image: url(${btnArrowUp_dark});
            }
        
            .btnArrowBottom {
                position: absolute;
                width: 20px;
                height: 12px;
                bottom: -20px;
                background-image: url(${btnArrowDown_normal});
                background-size: 20px 12px;
                opacity: 0;
                z-index: 1;
            }
        
            .decisionArrowBox .btnArrowBottom,
            .annotationArrowBox .btnArrowBottom,
            .internalArrowBox .btnArrowBottom {
                bottom: -15px;
            }
        
            .btnArrowBottom:hover {
                background-image: url(${btnArrowDown_dark});
            }
        
            .btnArrowLeft {
                position: absolute;
                width: 12px;
                height: 20px;
                left: -20px;
                background-image: url(${btnArrowLeft_normal});
                background-size: 12px 20px;
                opacity: 0;
                z-index: 1;
            }
        
            .decisionArrowBox .btnArrowLeft,
            .annotationArrowBox .btnArrowLeft,
            .internalArrowBox .btnArrowLeft {
                left: -15px;
            }
        
            .btnArrowLeft:hover {
                background-image: url(${btnArrowLeft_dark});
            }
        
            .btnArrowRight {
                position: absolute;
                width: 12px;
                height: 20px;
                right: -20px;
                background-image: url(${btnArrowRight_normal});
                background-size: 12px 20px;
                opacity: 0;
                z-index: 1;
            }
        
            .decisionArrowBox .btnArrowRight,
            .annotationArrowBox .btnArrowRight,
            .internalArrowBox .btnArrowRight {
                right: -15px;
            }
        
            .btnArrowRight:hover {
                background-image: url(${btnArrowRight_dark});
            }

            .sectionGridCell:hover .decisionArrowBox .btnArrowTop,
            .sectionGridCell:hover .decisionArrowBox .btnArrowBottom,
            .sectionGridCell:hover .decisionArrowBox .btnArrowLeft,
            .sectionGridCell:hover .decisionArrowBox .btnArrowRight,
            .sectionGridCell:hover .internalArrowBox .btnArrowTop,
            .sectionGridCell:hover .internalArrowBox .btnArrowBottom,
            .sectionGridCell:hover .internalArrowBox .btnArrowLeft,
            .sectionGridCell:hover .internalArrowBox .btnArrowRight,
            .sectionComponent:hover .btnArrowTop,
            .sectionComponent:hover .btnArrowBottom,
            .sectionComponent:hover .btnArrowLeft,
            .sectionComponent:hover .btnArrowRight,
            .internalArrowBox:hover .btnArrowTop,
            .internalArrowBox:hover .btnArrowBottom,
            .internalArrowBox:hover .btnArrowLeft,
            .internalArrowBox:hover .btnArrowRight,
            .annotationArrowBox:hover .btnArrowTop,
            .annotationArrowBox:hover .btnArrowBottom,
            .annotationArrowBox:hover .btnArrowLeft,
            .annotationArrowBox:hover .btnArrowRight,
            .decisionArrowBox:hover .btnArrowTop,
            .decisionArrowBox:hover .btnArrowBottom,
            .decisionArrowBox:hover .btnArrowLeft,
            .decisionArrowBox:hover .btnArrowRight {
                opacity: 1;
            }

            ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell:after {
                border: 0;
            }


            .sectionGridFix > .sectionGridRow > .sectionGridCell, 
    .sectionGridFix > .sectionGridColumn > .sectionGridCell {
        background: #efefef;
    }


    .sectionGridFix > .sectionGridRow > .sectionGridCell.selected {
        background: #d8d8d8;
    }


    .sectionGridFix > .sectionGridColumn > .sectionGridCell.selected {
        background: #d8d8d8;
    }


    .sectionGridFix > .sectionGridRow > .sectionGridCell {
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
    }

    .sectionGridFix > .sectionGridColumn > .sectionGridCell {
        border-top: 1px solid #ccc;
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        display: flex;
    }

    .sectionGridFix > .sectionGridRow > .sectionGridCell:first-child {
        border-top: 1px solid #ccc;
    }

    .sectionGridFix > .sectionGridColumn > .sectionGridCell:first-child {
        border-left: 1px solid #ccc;
    }

    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell > #selectedComponent {
        border: ${_SectionPanelComponent[PR.styleMode].selectedComponentBorder};
        background-color: ${_SectionPanelComponent[PR.styleMode].selectedComponentBackground};
        color: var(--colorCurrentSectionFont);
    }

    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell > .annotationArrowBox > .sectionComponent.annotation.selected .inner.selected,
._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell > .annotationArrowBox > .sectionComponent.annotation .inner.selected {
    background-color: var(--colorSelectedSectionFill);
}



    
        .sectionGridFix > .sectionGridRow > .sectionGridCell, 
        .sectionGridFix > .sectionGridColumn > .sectionGridCell {
            background: #efefef;
        }
    
    
        .sectionGridFix > .sectionGridRow > .sectionGridCell.selected {
            background: #d8d8d8;
        }
    
    
        .sectionGridFix > .sectionGridColumn > .sectionGridCell.selected {
            background: #d8d8d8;
        }
    
    
        .sectionGridFix > .sectionGridRow > .sectionGridCell {
            border-right: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
        }
    
        .sectionGridFix > .sectionGridColumn > .sectionGridCell {
            border-top: 1px solid #ccc;
            border-right: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
            display: flex;
        }
    
        .sectionGridFix > .sectionGridRow > .sectionGridCell:first-child {
            border-top: 1px solid #ccc;
        }
    
        .sectionGridFix > .sectionGridColumn > .sectionGridCell:first-child {
            border-left: 1px solid #ccc;
        }

        .sectionGridColumn {
            width: var(--sizeCellDefaultWidth);
            height: 100%;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            flex-shrink: 0;
        }
        
        ._sectionGrid_ .sectionGridColumn {
            flex-wrap: nowrap;
            /*z-index:2;*/
        }

    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell:after {
        border: 0;
    }

    /* ._sectionGrid_.disableBorder > svg {
        background-color: #162234;
    } */

    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell > .internalArrowBox > .internalOuter.selected {
        background-color: var(--colorCurrentSectionBorder);
    }
    
    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell > .internalArrowBox > .internalOuter.runBorder {
        background-color: var(--colorRunComponentBorder);
    }

    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell > .internalArrowBox > .internalOuter > .sectionComponent.internal.selected {
        border: var(--sizeBorderLine) solid var(--colorCurrentSectionBorder);
        background-color: var(--colorCurrentSectionFill);
        color: var(--colorCurrentSectionFont);
    }
    
    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell > .internalArrowBox > .internalOuter > .sectionComponent.internal.runComponent {
        border: var(--sizeBorderLine) solid var(--colorRunComponentBorder);
        background-color: ${_SectionPanelComponent[PR.styleMode].selectedComponentBackground};
        color: var(--colorRunComponentFont);
    }
    
    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell > .internalArrowBox > .internalOuter.selected > .sectionComponent.internal.runComponent {
        border: var(--sizeBorderLine) solid var(--colorCurrentSectionBorder);
    }

    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell > .decisionArrowBox > .decisionOuter.selected {
        background-color: ${_SectionPanelComponent[PR.styleMode].selectedComponentBackground};
    }

    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell:after {
        border: 0;
    }

    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell > #selectedComponent {
        /* border: var(--sizeBorderLine) solid var(--colorCurrentSectionBorder); */
        /*background-color: var(--colorCurrentSectionFill);*/
        color: var(--colorCurrentSectionFont);
    }

    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell > .decisionArrowBox > .decisionOuter > .decision.selected {
        /* background-color: var(--colorCurrentSectionFill); */
        color: var(--colorCurrentSectionFont);
    }
    
    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell > .decisionArrowBox > .decisionOuter > .decision.selected.runComponent {
        background-color: ${_SectionPanelComponent[PR.styleMode].selectedComponentBackground};
        color: var(--colorCurrentSectionFont);
    }

    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell > .annotationArrowBox > .sectionComponent.annotation.selected .inner.selected,
    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell > .annotationArrowBox > .sectionComponent.annotation .inner.selected {
        background-color: var(--colorSelectedSectionFill);
    }

    #invisible {
        display: none;
    }

    #stopDrag {
        -ms-user-select: none;
        -moz-user-select: -moz-none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        user-select: none;
    }

    .staticContextMenu {
        position: absolute;
        background-color: #242424;
        width: 190px;
        height: 240px;
        border-radius: 2px;
        box-sizing: border-box;
        border: 1px solid #e8e8e829;
        z-index: 100;
    }
    
    .staticContextMenu.row3 {
        height: 100px;
    }

    .menuBody ul {
        all: unset;
        display: table;
        width: 100%;
        list-style: none;
        border-bottom: 1px solid #e8e8e829;
        padding: 5px 7px;
        /* padding: 5px 2px 5px 0; */
        box-sizing: border-box;
        letter-spacing: -1px;
    }
    
        .menuBody ul:last-child {
            border: none;
        }
    
    
    .menuBody li {
        box-sizing: border-box;
        padding: 5px 6px;
    }
    
        .menuBody li:hover {
            background-color: #e8e8e829;
            border-radius: 5px;
        }
    
    .menuBody ul li span {
        font-size: 13px;
        line-height: 18px;
        color: #e6e6e6;
        margin-left: 5px;
        cursor: pointer;
    }


`;


/**********************************************************************/


export const _SubSectionTaskListWrap = {
    soulbrain: {
        sectionCurrentBackgroundColor: 'var(--colorSectionCurrent)',
        currentBoxBorderColor: 'solid 2px var(--colorSectionCurrent)',
    },
    Wonik: {
        sectionCurrentBackgroundColor: '#5398FF',
        currentBoxBorderColor: 'solid 2px #5398FF'
    },
    Hydrogen: {
        sectionCurrentBackgroundColor: '#0085FF',
        currentBoxBorderColor: 'solid 2px #0085FF',
        subSectionTaskListWrapHeight: 'calc(100% - 40px) !important',
    },
    Gyeonggi: {
        sectionCurrentBackgroundColor: '#5398FF',
        currentBoxBorderColor: 'solid 2px #5398FF'
    }
}

export const SubSectionTaskListWrap = styled.section`
    width:calc(50% - 30px);
    border-radius: 4px; 
    height: ${_SubSectionTaskListWrap[PR.styleMode].subSectionTaskListWrapHeight};

    >.tit {
        display:block;
        padding:20px 0;
        font-size:20px;
        font-weight:700;
        border-top-left-radius:4px;
        border-top-right-radius:4px;
        letter-spacing:-0.05em;
        background-color: ${SopCommon[PR.styleMode].backgroundColor2};
        text-align:center;
        cursor:default;
        border: ${SopCommon[PR.styleMode].innerSectionnnBorder};
        color: ${SopCommon[PR.styleMode].textColor2};
    }

    .innerSectionnnn { 
        height:100%; 
        max-height:calc(100% - 56px); 
        border: ${SopCommon[PR.styleMode].innerSectionnnBorder};
        border-radius: 3px; 
        overflow-y:auto; 
        background-color: ${SopCommon[PR.styleMode].innerSectionnnBackground};
    }

    .taskSectionArea{
        counter-reset:taskOrder;
        padding:10px;

        & * {
            word-break:keep-all;
        }
    }

    .taskSectionArea > .sectionBox > .tit{ 
        position:relative; 
        padding:10px 20px; 
        // background-color:#1e2633;
        border-radius:3px; 
    }

    .taskSectionArea .numList li{
        position:relative;
        padding-left:16px
    }

    .currentBox { 
        border: ${_SubSectionTaskListWrap[PR.styleMode].currentBoxBorderColor};
        border-radius: 5px; 
    }

    .sectionCurrent > .tit {
        background-color: ${_SubSectionTaskListWrap[PR.styleMode].sectionCurrentBackgroundColor};
    }

    .sectionRun > .tit {
        background-color: ${SopCommon[PR.styleMode].backgroundColor6};
        border: ${SopCommon[PR.styleMode].sectionSkipBorder};
    }

    .sectionDone > .tit {
        background-color: ${SopCommon[PR.styleMode].backgroundColor6};
        /* border: solid 1px #d1d1d1; */
        border-radius: 3px;
    }
    .sectionSkip > .tit {
        background-color: ${SopCommon[PR.styleMode].backgroundColor6};
        border: ${SopCommon[PR.styleMode].sectionSkipBorder};
    }
`;


/**********************************************************************/


export const _DefaultGrid = {
    soulbrain: {
        sectionHeight: 'calc(100vh - 50px)',
    },
    Wonik: {
        sectionHeight: 'calc(100vh - 50px)',
    },
    Hydrogen: {
        sectionHeight: 'calc(100vh - 50px)',
    },
    Gyeonggi: {
        sectionHeight: 'calc(100vh - 50px)',
    }
}

export const DefaultGrid = styled.div`
    margin-top: 50px;
    margin-left: 50px;
    width: 100%;
    height: 100%;
    /* z-index: 101; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .defaultGridArea {
        width: 60%;
        height: 60%;
        background-color: gray;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border: 3px dashed black;
    }

    .defaultButtonAreaV {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: center;
    }

    .defaultButtonAreaH {
        width: 350px;
        height: 100%;
        display: flex;
        justify-content: space-between;
    }

    .defaultButtonAreaH button {
        width: 100px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #fff;
        background: #3764BA;
        border-radius: 4px;
    }

`;
