
import styled from 'styled-components';
import ProjectResource from '../Root/resource/id';



export const Header_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _Header.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _Header.yeosu;
    }
    return {};
}

export const _Header = {
    busan: {
        divBackgroundColor: '#fff',
        divWidth: '100%',
        divHeight: '100px',
        divDisplay: 'block',
    },
    yeosu: {
        divBackgroundColor: '#fff',
        divWidth: '100%',
        divHeight: '100px',
        divDisplay: 'block',
    }
}


export const Header = styled.div`
     background-color:${_Header[ProjectResource.styleMode].divBackgroundColor};
     width:${_Header[ProjectResource.styleMode].divWidth};
     height:${_Header[ProjectResource.styleMode].divHeight};
     display:${_Header[ProjectResource.styleMode].divDisplay};
     padding-top: 24px;
`;


/**********************************************************************/


export const Logo_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _Logo.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _Logo.yeosu;
    }
    return {};
}

export const _Logo = {
    busan: {
        imgDisplay: 'inline-block',
        imgWidth: '160px',
        imgHeight: '50px',
        imgBackgroundSize: '160px !important',
        imgBackgroundPosition: 'center',
        imgFloat: 'left',
        imgBackground: 'url("../../../resource/image/sop/yeosuLogo_W.png")',
    },
    yeosu: {
        imgDisplay: 'inline-block',
        imgWidth: '150px',
        imgHeight: '48px',
        imgBackgroundSize: '150px !important',
        imgBackgroundPosition: 'center',
        imgFloat: 'left',
        imgBackground: 'url("../../../resource/image/sop/yeosuLogoB.png")',
    }
}


export const Logo = styled.div`
    display:${_Logo[ProjectResource.styleMode].imgDisplay};
    width:${_Logo[ProjectResource.styleMode].imgWidth};
    height:${_Logo[ProjectResource.styleMode].imgHeight};
    background-position:${_Logo[ProjectResource.styleMode].imgBackgroundPosition};
    background-size:${_Logo[ProjectResource.styleMode].imgBackgroundSize};
    float:${_Logo[ProjectResource.styleMode].imgFloat};
    background:${_Logo[ProjectResource.styleMode].imgBackground};
    margin-left: 20px;
`;


/***********************************************************************/


export const Content_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _Contents.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _Contents.yeosu;
    }
    return {};
}

export const _Contents = {
    busan: {
        divBackgroundColor: '#fff',
        divWidth: '100vw',
        divHeight: '100vh',
        divDisplay: 'flex'
    },
    yeosu: {
        divBackgroundColor: '#fff',
        divWidth: '100vw',
        divHeight: '100vh',
        divDisplay: 'flex'
    }
}


export const Contents = styled.div`
    background-color:${_Contents[ProjectResource.styleMode].divBackgroundColor};
    width:${_Contents[ProjectResource.styleMode].divWidth};
    height:${_Contents[ProjectResource.styleMode].divHeight};
    display:${_Contents[ProjectResource.styleMode].divDisplay};
`;


/*****************************************************************/


export const SideBar_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SideBar.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SideBar.yeosu;
    }
    return {};
}

export const _SideBar = {
    busan: {
        divBackgroundColor: '#0D2348',
        divWidth: '300px',
        divPaddingTop: '40px',
        divDisplay: 'block',
        divBorderTopRightRadius: '32px',
    },
    yeosu: {
        divBackgroundColor: '#26395B',
        divWidth: '300px',
        divPaddingTop: '40px',
        divDisplay: 'block',
        divBorderTopRightRadius: '32px',
    }
}


export const SideBar = styled.div`
     background-color:${_SideBar[ProjectResource.styleMode].divBackgroundColor};
     width:${_SideBar[ProjectResource.styleMode].divWidth};
     padding-top:${_SideBar[ProjectResource.styleMode].divPaddingTop};
     display:${_SideBar[ProjectResource.styleMode].divDisplay};
     border-top-right-radius:${_SideBar[ProjectResource.styleMode].divBorderTopRightRadius};
    .disasterForm{
        display: flex;
        padding: 10px 40px 10px 40px;
        align-items: flex-end;
    }
`;


/***********************************************************************/


export const BeforeBtn_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _BeforeBtn.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _BeforeBtn.yeosu;
    }
    return {};
}

export const _BeforeBtn = {
    busan: {
        divHeight: '48px',
        divLineHeight: '48px',
        divDisplay: 'flex',
        divBackGround: '',
        divBorderRadius: '10px',
        divBoxShadow: '1px 1px 1px 2px #0000001a',
        divColor: '#fff',
        divMargin: '0 auto',
        divFontSize: '16px',
        divPadding: '0px 70px',
        divFontFamily: 'Pretendard-regular',
        divPosition: 'absolute',
        divLeft: '',
        divBottom: '',

    },
    yeosu: {
        divHeight: '48px',
        divLineHeight: '48px',
        divDisplay: 'flex',
        divBackGround: '',
        divBorderRadius: '10px',
        divBoxShadow: '1px 1px 1px 2px #0000001a',
        divColor: '#fff',
        divMargin: '0 auto',
        divFontSize: '16px',
        divPadding: '0px 70px',
        divFontFamily: 'Pretendard-regular',
        divPosition: 'absolute',
        divLeft: '',
        divBottom: '',
    }
}


export const BeforeBtn = styled.div`  
      height:${_BeforeBtn[ProjectResource.styleMode].divHeight};
      line-height:${_BeforeBtn[ProjectResource.styleMode].divLineHeight};
      display:${_BeforeBtn[ProjectResource.styleMode].divDisplay};
      background:${_BeforeBtn[ProjectResource.styleMode].divBackGround};
      border-radius:${_BeforeBtn[ProjectResource.styleMode].divBorderRadius};
      box-shadow:${_BeforeBtn[ProjectResource.styleMode].divBoxShadow};
      color:${_BeforeBtn[ProjectResource.styleMode].divColor};
      margin:${_BeforeBtn[ProjectResource.styleMode].divMargin};
      font-size:${_BeforeBtn[ProjectResource.styleMode].divFontSize};
      padding:${_BeforeBtn[ProjectResource.styleMode].divPadding};
      font-family:${_BeforeBtn[ProjectResource.styleMode].divFontFamily};
      position:absolute;
      left:20px;
      bottom:30px;
 `



/********************************************************************/


export const ReturnIcon_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _ReturnIcon.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _ReturnIcon.yeosu;
    }
    return {};
}

export const _ReturnIcon = {
    busan: {
        iconWidth: '28px',
        iconHeight: '48px',
        iconDisplay: 'inline-block',
        iconBackgroundPosition: 'center',
        iconMarginRight: '12px',
        iconBackground: 'url("../../../resource/image/sop/returnLogo.png")no-repeat',

    },
    yeosu: {
        iconWidth: '28px',
        iconHeight: '48px',
        iconDisplay: 'inline-block',
        iconBackgroundPosition: 'center',
        iconMarginRight: '12px',
        iconBackground: 'url("../../../resource/image/sop/returnLogo.png")no-repeat',
    }
}

export const ReturnIcon = styled.div`
     width:${_ReturnIcon[ProjectResource.styleMode].iconWidth};
     height:${_ReturnIcon[ProjectResource.styleMode].iconHeight};
     display:${_ReturnIcon[ProjectResource.styleMode].iconDisplay};
     background:${_ReturnIcon[ProjectResource.styleMode].iconBackground};
     background-position:${_ReturnIcon[ProjectResource.styleMode].iconBackgroundPosition};
     margin-right:${_ReturnIcon[ProjectResource.styleMode].iconMarginRight};
`


/******************************************************************/


export const SopListBox_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopListBox.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopListBox.yeosu;
    }
    return {};
}

export const _SopListBox = {
    busan: {
        divBackgroundColor: '#fff',
        divWidth: '100%',
        divPadding: '40px',
        divColor: '#000000',
    },
    yeosu: {
        divBackgroundColor: '#fff',
        divWidth: '100%',
        divPadding: '40px',
        divColor: '#fff',
    }
}


export const SopListBox = styled.div`
    background-color:${_SopListBox[ProjectResource.styleMode].divBackgroundColor};
    width:${_SopListBox[ProjectResource.styleMode].divWidth};
    padding:${_SopListBox[ProjectResource.styleMode].divPadding};
    color:${_SopListBox[ProjectResource.styleMode].divColor};
    > span{
        display: inline-block; 
        color: #1BC9FB;
        font-size: 18px; 
        font-weight: 900;
        margin-bottom: 20px; 
        font-family:  'Pretendard';
        text-align:left; 
    }
    .blueColor{
        display:inline-block;
        color: #1BC9FB;
    }
`;


/****************************************************************/


export const SensorAlarmText_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SensorAlarmText.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SensorAlarmText.yeosu;
    }
    return {};
}

export const _SensorAlarmText = {
    busan: {
        divWidth: '100%',
        divPadding: '40px',
        divColor: '#000000',
    },
    yeosu: {
        divWidth: '100%',
        divPadding: '40px',
        divColor: '#000000',
    }
}


export const SensorAlarmText = styled.div`
    width:${_SensorAlarmText[ProjectResource.styleMode].divWidth};
    /* padding:${_SensorAlarmText[ProjectResource.styleMode].divPadding}; */
    color:${_SensorAlarmText[ProjectResource.styleMode].divColor};
    text-align: center;
    position: absolute;
    > span {
        display: inline-block; 
        color: #1BC9FB;
        font-size: 14px; 
        font-family:  'Pretendard';
        font-weight: 600;
        text-align:left; 
    }
`;


/****************************************************************/



export const PageNation_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _pageNation.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _pageNation.yeosu;
    }
    return {};
}

export const _pageNation = {
    busan: {
        divDisplay: 'flex',
        divWidth: '100%',
        divHeight: '30px',
        divPadding: '',
        divColor: '#000000',
        divMarginTop: '46px',
        divTextAlign: 'center',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '100%',
        divHeight: '30px',
        divPadding: '',
        divColor: '#000000',
        divMarginTop: '46px',
        divTextAlign: 'center',
    }
}


export const PageNation = styled.div`
     display:${_pageNation[ProjectResource.styleMode].divDisplay};
     width:${_pageNation[ProjectResource.styleMode].divWidth};
     height:${_pageNation[ProjectResource.styleMode].divHeight};
     padding:${_pageNation[ProjectResource.styleMode].divPadding};
     color:${_pageNation[ProjectResource.styleMode].divColor};
     margin-top:${_pageNation[ProjectResource.styleMode].divMarginTop};
     text-align:${_pageNation[ProjectResource.styleMode].divTextAlign};
     justify-content: center;
     > span {
        display: inline-block;
        width: 28px;
        height: 28px;
        line-height: 28px;
        border-radius:6px;
        font-size: 14px;
        margin-right: 6px;
        color: ${_pageNation[ProjectResource.styleMode].divColor};
        text-align: center;
        cursor: pointer;
     }
     .active{
        display: inline-block;
        width: 28px;
        height: 28px;
        line-height: 28px;
        background: #1BC9FB; 
        border-radius:6px;
        font-size: 14px;
        margin-right: 6px;
        color: #fff;
        text-align: center;
     }
`

/******************************************************************/


export const PageLeftArrowIcon_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _PageLeftArrowIcon.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _PageLeftArrowIcon.yeosu;
    }
    return {};
}

export const _PageLeftArrowIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '20px',
        divHeight: '34px',
        divBackground: 'url("../../../resource/image/sop/navigate_before_left_white.png")no-repeat center center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '20px',
        divHeight: '34px',
        divBackground: 'url("../../../resource/image/sop/navigate_before_left_white.png")no-repeat center center',
    },
}


export const PageLeftArrowIcon = styled.div`
     display:${_PageLeftArrowIcon[ProjectResource.styleMode].divDisplay};
     width:${_PageLeftArrowIcon[ProjectResource.styleMode].divWidth};
     /* height:${_PageLeftArrowIcon[ProjectResource.styleMode].divHeight}; */
     background:${_PageLeftArrowIcon[ProjectResource.styleMode].divBackground};
     background-size: 12px;
     margin-right: 12px;
     cursor:pointer;
`


/******************************************************************/


export const PageLeftArrowIconB_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _PageLeftArrowIconB.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _PageLeftArrowIconB.yeosu;
    }
    return {};
}

export const _PageLeftArrowIconB = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '20px',
        divHeight: '34px',
        divBackground: 'url("../../../resource/image/sop/navigate_before_left_black.png")no-repeat center center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '20px',
        divHeight: '34px',
        divBackground: 'url("../../../resource/image/sop/navigate_before_left_black.png")no-repeat center center',
    },
}


export const PageLeftArrowIconB = styled.div`
     display:${_PageLeftArrowIconB[ProjectResource.styleMode].divDisplay};
     width:${_PageLeftArrowIconB[ProjectResource.styleMode].divWidth};
     /* height:${_PageLeftArrowIconB[ProjectResource.styleMode].divHeight}; */
     background:${_PageLeftArrowIconB[ProjectResource.styleMode].divBackground};
     background-size: 10px;
     margin-right: 12px;
     cursor:pointer;
`


/******************************************************************/



export const PageRightArrowIcon_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _PageRightArrowIcon.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _PageRightArrowIcon.yeosu;
    }
    return {};
}

export const _PageRightArrowIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '20px',
        divHeight: '34px',
        divBackground: 'url("../../../resource/image/sop/navigate_before_right_white.png")no-repeat center center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '20px',
        divHeight: '34px',
        divBackground: 'url("../../../resource/image/sop/navigate_before_right_white.png")no-repeat center center',
    }
}


export const PageRightArrowIcon = styled.div`
     display:${_PageRightArrowIcon[ProjectResource.styleMode].divDisplay};
     width:${_PageRightArrowIcon[ProjectResource.styleMode].divWidth};
     /* height:${_PageRightArrowIcon[ProjectResource.styleMode].divHeight}; */ 
     background:${_PageRightArrowIcon[ProjectResource.styleMode].divBackground};
     background-size: 12px;
     cursor:pointer;
     margin-left: 6px;
`


/******************************************************************/


export const PageRightArrowIconB_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _PageRightArrowIconB.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _PageRightArrowIconB.yeosu;
    }
    return {};
}

export const _PageRightArrowIconB = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '20px',
        divHeight: '34px',
        divBackground: 'url("../../../resource/image/sop/navigate_before_right_black.png")no-repeat center center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '20px',
        divHeight: '34px',
        divBackground: 'url("../../../resource/image/sop/navigate_before_right_black.png")no-repeat center center',
    }
}


export const PageRightArrowIconB = styled.div`
     display:${_PageRightArrowIconB[ProjectResource.styleMode].divDisplay};
     width:${_PageRightArrowIconB[ProjectResource.styleMode].divWidth};
     /* height:${_PageRightArrowIconB[ProjectResource.styleMode].divHeight}; */ 
     background:${_PageRightArrowIconB[ProjectResource.styleMode].divBackground};
     background-size: 10px;
     cursor:pointer;
     margin-left: 6px;
`


/******************************************************************/



export const Stick_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _Stick.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _Stick.yeosu;
    }
    return {};
}

export const _Stick = {
    busan: {
        divWidth: '3px',
        divHeight: '21px',
        divDisplay: 'inline-block',
        divBackGround: '#1BC9FB',
        divMarginRight: '10px',
    },
    yeosu: {
        divWidth: '3px',
        divHeight: '21px',
        divDisplay: 'inline-block',
        divBackGround: '#1BC9FB',
        divMarginRight: '10px',
    }
}

export const Stick = styled.div`
     width:${_Stick[ProjectResource.styleMode].divWidth};
     height:${_Stick[ProjectResource.styleMode].divHeight};
     display:${_Stick[ProjectResource.styleMode].divDisplay};
     background:${_Stick[ProjectResource.styleMode].divBackGround};
     margin-right:${_Stick[ProjectResource.styleMode].divMarginRight};
`


/**************************************************************/


export const Text_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _Text.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _Text.yeosu;
    }
    return {};
}

export const _Text = {
    busan: {
        divFontSize: '18px',
        divMarginRight: '50px',
        divWidth: '130px',
        divTextAlign: 'left',

    },
    yeosu: {
        divFontSize: '18px',
        divMarginRight: '50px',
        divWidth: '130px',
        divTextAlign: 'left',
    }
}

export const Text = styled.div`
     font-size:${_Text[ProjectResource.styleMode].divFontSize};
     margin-right:${_Text[ProjectResource.styleMode].divMarginRight};
     width:${_Text[ProjectResource.styleMode].divWidth};
     text-align:${_Text[ProjectResource.styleMode].divTextAlign};
`


/**************************************************************/


export const ArrowDownIcon_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _ArrowDownIcon.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _ArrowDownIcon.yeosu;
    }
    return {};
}


export const _ArrowDownIcon = {
    busan: {
        iconWidth: '21px',
        iconHeight: '21px',
        iconBackgroundPosition: 'center',
        iconRotate: '180deg',
        iconDisplay: 'inline-block',
        iconBackground: 'url("../../../resource/image/sop/arrowDown.png")no-repeat',
    },
    yeosu: {
        iconWidth: '21px',
        iconHeight: '21px',
        iconBackgroundPosition: 'center',
        iconRotate: '180deg',
        iconDisplay: 'inline-block',
        iconBackground: 'url("../../../resource/image/sop/arrowDown.png")no-repeat',
    }
}


export const ArrowDownIcon = styled.div`
     width:${_ArrowDownIcon[ProjectResource.styleMode].iconWidth};
     height:${_ArrowDownIcon[ProjectResource.styleMode].iconHeight};
     background-position:${_ArrowDownIcon[ProjectResource.styleMode].iconBackgroundPosition};
     rotate:${_ArrowDownIcon[ProjectResource.styleMode].iconRotate};
     display:${_ArrowDownIcon[ProjectResource.styleMode].iconDisplay};
     background:${_ArrowDownIcon[ProjectResource.styleMode].iconBackground};
     background-position: center;
 `


/***********************************************************************/


export const DisasterForm_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _DisasterForm.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _DisasterForm.yeosu;
    }
    return {};
}


export const _DisasterForm = {
    busan: {
        divBackgroundColor: '#',
        divWidth: '',
        divPadding: '20px 40px 20px 40px',
        divColor: '#d7d7d7',
        divDisplay: 'flex',
        divLineHeight: '21px',
    },
    yeosu: {
        divBackgroundColor: '#',
        divWidth: '',
        divPadding: '20px 40px 20px 40px',
        divColor: '#fff',
        divDisplay: 'flex',
        divLineHeight: '21px',
    }
}


export const DisasterForm = styled.div`
     background-color:${_DisasterForm[ProjectResource.styleMode].divBackgroundColor};
     width:${_DisasterForm[ProjectResource.styleMode].divWidth};
     padding:${_DisasterForm[ProjectResource.styleMode].divPadding};
     color:${_DisasterForm[ProjectResource.styleMode].divColor};
     display:${_DisasterForm[ProjectResource.styleMode].divDisplay};
     line-height:${_DisasterForm[ProjectResource.styleMode].divLineHeight};
`;


/*************************************************************/


export const HistoryTable_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _HistoryTable.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _HistoryTable.yeosu;
    }
    return {};
}

export const _HistoryTable = {
    busan: {
        tableWidth: '100%',
        tableHeight: '100%',
        tableColor: '#000000',
    },
    yeosu: {
        tableWidth: '100%',
        tableHeight: '100%',
        tableColor: '#fff',
    }
}

export const HistoryTable = styled.div`
    width:${_HistoryTable[ProjectResource.styleMode].tableWidth};
    /* height:${_HistoryTable[ProjectResource.styleMode].tableHeight}; */
    color:${_HistoryTable[ProjectResource.styleMode].tableColor};
    table > thead {
        width: 100%;
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-family: 'Pretendard-Regular';
        border-bottom: solid 0.5px #d7d7d738;
        color: #fff;
        background: #26395B;
    }
    table > tbody{
        width: 100%;
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-family: 'Pretendard-Regular';
        border-bottom: solid 0.5px #d7d7d738;
        color: #000000;
    }
    table > tbody > tr{
        border-bottom: solid 1px #f5f5f5;

    }
    &.sopTableSelect{

    }
    .memoIcon{
       display: inline-block;
       width: 18px;
       height: 18px;
       background: url("./../../resource/image/history/memoIcon_black.png")no-repeat;
       vertical-align: middle;
    }
 `


/*****************************************************************/


export const HistoryAnalysisTables_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _HistoryAnalysisTables.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _HistoryAnalysisTables.yeosu;
    }
    return {};
}

export const _HistoryAnalysisTables = {
    busan: {
        tableWidth: '100%',
        tableHeight: '100%',
        tableColor: '#000000',
    },
    yeosu: {
        tableWidth: '100%',
        tableHeight: '100%',
        tableColor: '#fff',
    }
}

export const HistoryAnalysisTables = styled.div`
    width:${_HistoryAnalysisTables[ProjectResource.styleMode].tableWidth};
    /* height:${_HistoryAnalysisTables[ProjectResource.styleMode].tableHeight}; */
    color:${_HistoryAnalysisTables[ProjectResource.styleMode].tableColor};
    /* margin-top: 80px; */
    table > thead{
        width: 100%;
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-family: 'Pretendard-Regular';
        border-bottom: solid 0.5px #d7d7d738;
        color: #fff;
        background: #26395B;
    }
    table > tbody{
        width: 100%;
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-family: 'Pretendard-Regular';
        border-bottom: solid 0.5px #d7d7d738;
        color: #000000;
    }
    &.sopTableSelect{

    }
    .memoIcon{
       display: inline-block;
       width: 18px;
       height: 18px;
       background: url("./../../resource/image/history/memoIcon_black.png")no-repeat;
       vertical-align: middle;
    }
 `


/*****************************************************************/


export const HistorySOPTables_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _HistorySOPTables.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _HistorySOPTables.yeosu;
    }
    return {};
}

export const _HistorySOPTables = {
    busan: {
        tableWidth: '100%',
        tableHeight: '100%',
        tableColor: '#000000',
    },
    yeosu: {
        tableWidth: '100%',
        tableHeight: '100%',
        tableColor: '#fff',
    }
}

export const HistorySOPTables = styled.div`
    width:${_HistorySOPTables[ProjectResource.styleMode].tableWidth};
    /* height:${_HistorySOPTables[ProjectResource.styleMode].tableHeight}; */
    color:${_HistorySOPTables[ProjectResource.styleMode].tableColor};
    table > thead{
        width: 100%;
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-family: 'Pretendard-Regular';
        border-bottom: solid 0.5px #d7d7d738;
        color: #fff;
        background: #26395B;
    }
    table > tbody{
        width: 100%;
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-family: 'Pretendard-Regular';
        border-bottom: solid 0.5px #d7d7d738;
        color: #000000;
    }

    &.sopTableSelect{

    }
    .memoIcon{
       display: inline-block;
       width: 18px;
       height: 18px;
       background: url("./../../resource/image/history/memoIcon_black.png")no-repeat;
       vertical-align: middle;
    }
 `


/*****************************************************************/



export const DownBox_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _DownBox.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _DownBox.yeosu;
    }
    return {};
}

export const _DownBox = {
    busan: {
        divDisplay: 'flex',
    },
    yeosu: {
        divDisplay: 'flex',
    }
}

export const DownBox = styled.div`
    display:${_DownBox[ProjectResource.styleMode].divDisplay};
    float: right;
    margin-bottom: 12px;
    > span{
      display: inline-block;
      width: 124px;
      height: 30px;
      line-height: 30px;
      color: #000000;
      padding-left: 36px;
   }
 `


/******************************************************************/

export const HistorySelectBox_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _HistorySelectBox.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _HistorySelectBox.yeosu;
    }
    return {};
}

export const _HistorySelectBox = {
    busan: {
        divDisplay: 'inline-block',
    },
    yeosu: {
        divDisplay: 'inline-block',
    }
}

export const HistorySelectBox = styled.div`
    display:${_HistorySelectBox[ProjectResource.styleMode].divDisplay};
    select {
        width: 150px;
        height: 48px;
        background: #225789 url("./../../resource/image/sdms/arrow_drop_down.png")no-repeat 70% 50%;
        background-size: 30px;
        color: #fff;
        border:none;
        font-size: 14px;
        text-align: center;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
    }
    select::-ms-expand {
        display: none;
    }
    select > option{
       background: #F5F5F5;
       color: #000000;
       height: 48px;
       line-height: 48px;
       font-size: 14px;
    }
 `

/*****************************************************************/


export const SensorDetectBox_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SensorDetectBox.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SensorDetectBox.yeosu;
    }
    return {};
}

export const _SensorDetectBox = {
    busan: {
        divDisplay: 'flex',
    },
    yeosu: {
        divDisplay: 'flex',
    }
}

export const SensorDetectBox = styled.div`
    display:${_SensorDetectBox[ProjectResource.styleMode].divDisplay};
    padding: 10px 0px 30px 0px;

 `

/*****************************************************************/

export const DisasterType_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _DisasterType.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _DisasterType.yeosu;
    }
    return {};
}

export const _DisasterType = {
    busan: {
        divDisplay: 'block',
    },
    yeosu: {
        divDisplay: 'block',
    }
}

export const DisasterType = styled.div`
    display:${_DisasterType[ProjectResource.styleMode].divDisplay};
    position: relative;
    margin-right: 20px; 
    > span {
        color:#808080;
        font-size: 11px;
        z-index: 1;
        position: absolute;
        left: 10px;
        top: 10px;
    }
    select {
        width: 470px;
        height: 54px;
        background: #F5F5F5 url("./../../resource/image/history/arrow_drop_down_black.png")no-repeat 98% 70%;
        background-size: 20px;
        color: #000000;
        border:none;
        font-size: 14px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border-radius: 5px;
        padding: 20px 0px 0px 10px;
    }
    select::-ms-expand {
        display: none;
    }
    select > option{
       background: #f5f5f5;
       color: #000000;
       height: 48px;
       line-height: 48px;
       font-size: 14px;
    }
 `

/*****************************************************************/


export const Location_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _Location.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _Location.yeosu;
    }
    return {};
}

export const _Location = {
    busan: {
        divDisplay: 'block',
    },
    yeosu: {
        divDisplay: 'block',
    }
}

export const Location = styled.div`
    display:${_Location[ProjectResource.styleMode].divDisplay};
    position: relative;
    margin-right: 20px;
    > span {
        color:#808080;
        font-size: 11px;
        z-index: 1;
        position: absolute;
        left: 10px;
        top: 10px;
    }
    select {
        width: 470px;
        height: 54px;
        background: #F5F5F5 url("./../../resource/image/history/arrow_drop_down_black.png")no-repeat 98% 70%;
        background-size: 20px;
        color: #000000;
        border:none;
        font-size: 14px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border-radius: 5px;
        padding: 20px 0px 0px 10px;
    }
    select::-ms-expand {
        display: none;
    }
    select > option{
       background: #f5f5f5;
       color: #000000;
       height: 48px;
       line-height: 48px;
       font-size: 14px;
    }
 `

/*****************************************************************/


export const CriticalStage_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _CriticalStage.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _CriticalStage.yeosu;
    }
    return {};
}

export const _CriticalStage = {
    busan: {
        divDisplay: 'block',
    },
    yeosu: {
        divDisplay: 'block',
    }
}

export const CriticalStage = styled.div`
    display:${_CriticalStage[ProjectResource.styleMode].divDisplay};
    position: relative;
    margin-right: 20px; 
    > span {
        color:#808080;
        font-size: 11px;
        z-index: 1;
        position: absolute;
        left: 10px;
        top: 10px;
    }
    select {
        width: 143px;
        height: 54px;
        background: #F5F5F5 url("./../../resource/image/history/arrow_drop_down_black.png")no-repeat 98% 70%;
        background-size: 20px;
        color: #000000;
        border:none;
        font-size: 14px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border-radius: 5px;
        padding: 20px 0px 0px 10px;
    }
    select::-ms-expand {
        display: none;
    }
    select > option{
       background: #f5f5f5;
       color: #000000;
       height: 48px;
       line-height: 48px;
       font-size: 14px;
    }
 `

/*****************************************************************/


export const ModeSelect_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _ModeSelect.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _ModeSelect.yeosu;
    }
    return {};
}

export const _ModeSelect = {
    busan: {
        divDisplay: 'block',
    },
    yeosu: {
        divDisplay: 'block',
    }
}

export const ModeSelect = styled.div`
    display:${_ModeSelect[ProjectResource.styleMode].divDisplay};
    position: relative;
    margin-right: 20px; 
    > span {
        color:#808080;
        font-size: 11px;
        z-index: 1;
        position: absolute;
        left: 10px;
        top: 10px;
    }
    select {
        width: 143px;
        height: 54px;
        background: #F5F5F5 url("./../../resource/image/history/arrow_drop_down_black.png")no-repeat 98% 70%;
        background-size: 20px;
        color: #000000;
        border:none;
        font-size: 14px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border-radius: 5px;
        padding: 20px 0px 0px 10px;
    }
    select::-ms-expand {
        display: none;
    }
    select > option{
       background: #f5f5f5;
       color: #000000;
       height: 48px;
       line-height: 48px;
       font-size: 14px;
    }
 `

/*****************************************************************/


export const WriterBox_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _WriterBox.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _WriterBox.yeosu;
    }
    return {};
}

export const _WriterBox = {
    busan: {
        divDisplay: 'block',
    },
    yeosu: {
        divDisplay: 'block',
    }
}

export const WriterBox = styled.div`
    display:${_WriterBox[ProjectResource.styleMode].divDisplay};
    position: relative;
    margin-right: 20px; 
    > span {
        color:#808080;
        font-size: 11px;
        z-index: 1;
        position: absolute;
        left: 10px;
        top: 10px;
    }
    input {
        width: 147px;
        height: 54px;
        background: #F5F5F5;
        color: #000000;
        border:none;
        font-size: 14px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border-radius: 5px;
        padding: 20px 0px 0px 10px;
    }
    select::-ms-expand {
        display: none;
    }
 `

/*****************************************************************/


export const InquiryPeriod_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _InquiryPeriod.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _InquiryPeriod.yeosu;
    }
    return {};
}

export const _InquiryPeriod = {
    busan: {
        divDisplay: 'block',
        divWidth: '237px',
        divHeight: '54px',
        divBackground: '#f5f5f5',

    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '237px',
        divHeight: '54px',
        divBackground: '#f5f5f5',
    }
}

export const InquiryPeriod = styled.div`
    display:${_InquiryPeriod[ProjectResource.styleMode].divDisplay};
    width:${_InquiryPeriod[ProjectResource.styleMode].divWidth};
    height:${_InquiryPeriod[ProjectResource.styleMode].divHeight};
    background:${_InquiryPeriod[ProjectResource.styleMode].divBackground};
    border-radius: 5px;
    color: #000000;
    position: relative; 
    margin-right: 20px;
    > span {
        color:#808080;
        font-size: 11px;
        z-index: 1;
        position: absolute;
        left: 10px;
        top: 10px;
    }
    > label{
        display: block;
        padding: 30px 0px 0px 10px;
        cursor: pointer;
    }
    > label > input{
        background: #f5f5f5;
    }
 `

/*****************************************************************/

export const InquiryPeriodSelect_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _InquiryPeriodSelect.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _InquiryPeriodSelect.yeosu;
    }
    return {};
}

export const _InquiryPeriodSelect = {
    busan: {
        divDisplay: 'block',
        divWidth: '218px',
        divHeight: '54px',
        divBackground: '#f5f5f5',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '218px',
        divHeight: '54px',
        divBackground: '#f5f5f5',
    }
}

export const InquiryPeriodSelect = styled.div`
    display:${_InquiryPeriodSelect[ProjectResource.styleMode].divDisplay};
    width:${_InquiryPeriodSelect[ProjectResource.styleMode].divWidth};
    height:${_InquiryPeriodSelect[ProjectResource.styleMode].divHeight};
    background:${_InquiryPeriodSelect[ProjectResource.styleMode].divBackground};
    border-radius: 5px;
    color: #000000;
    position: relative;
    margin-right: 20px;
    > span {
        color:#808080;
        font-size: 11px;
        z-index: 1;
        position: absolute;
        left: 10px;
        top: 10px;
    }
    > label{
        display: block;
        padding: 30px 0px 0px 10px;
        cursor: pointer;
    }
    > label > input{
        background: #f5f5f5;
    }

 `

/*****************************************************************/


export const SearchBtn_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SearchBtn.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SearchBtn.yeosu;
    }
    return {};
}

export const _SearchBtn = {
    busan: {
        divDisplay: 'block',
        divWidth: '55px',
        divHeight: '55px',
        divLineHeight: '55px',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '55px',
        divHeight: '55px',
        divLineHeight: '55px',
    }
}

export const SearchBtn = styled.div`
    display:${_SearchBtn[ProjectResource.styleMode].divDisplay};
    width:${_SearchBtn[ProjectResource.styleMode].divWidth};
    height:${_SearchBtn[ProjectResource.styleMode].divHeight};
    line-height:${_SearchBtn[ProjectResource.styleMode].divLineHeight};
    background: #19A5FF;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
 `

/*****************************************************************/


export const SopDetailBox_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopDetailBox.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopDetailBox.yeosu;
    }
    return {};
}

export const _SopDetailBox = {
    busan: {
        divDisplay: 'block',
        divWidth: '594px',
        divHeight: '395px',
        divColor: '#19A5FF',
        divFontSize: '14px',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '594px',
        divHeight: '395px',
        divColor: '#19A5FF',
        divFontSize: '14px',
    }
}

export const SopDetailBox = styled.div`
    display:${_SopDetailBox[ProjectResource.styleMode].divDisplay};
    width:${_SopDetailBox[ProjectResource.styleMode].divWidth};
    height:${_SopDetailBox[ProjectResource.styleMode].divHeight};
    color:${_SopDetailBox[ProjectResource.styleMode].divColor};
    font-size:${_SopDetailBox[ProjectResource.styleMode].divFontSize};
    font-family:  'Pretendard';
    background: #fff;
    box-shadow: 0px 3px 6px #00000029;
    border-radius: 10px;
    padding: 15px;
    color: black;

`

/********************************************************************/


export const SensorTitle_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SensorTitle.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SensorTitle.yeosu;
    }
    return {};
}

export const _SensorTitle = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divColor: '#19A5FF',
        divFontSize: '14px',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divColor: '#19A5FF',
        divFontSize: '14px',
    }
}

export const SensorTitle = styled.div`
    display:${_SensorTitle[ProjectResource.styleMode].divDisplay};
    /* width:${_SensorTitle[ProjectResource.styleMode].divWidth}; */ 
    color:${_SensorTitle[ProjectResource.styleMode].divColor};
    font-size:${_SensorTitle[ProjectResource.styleMode].divFontSize};
    font-family:  'Pretendard-SemiBold';
    font-weight: 600;
    border-left: solid 3px #19A5FF;
    padding-left: 11px;
    /* margin-right: 267px; */

`

/********************************************************************/



export const SeosorCloseIcon_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SeosorCloseIcon.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SeosorCloseIcon.yeosu;
    }
    return {};
}

export const _SeosorCloseIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '12px',
        divHeight: '12px',
        divBackground: 'url("./../../resource/image/sdms/close_x.png")',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '12px',
        divHeight: '12px',
        divBackground: 'url("./../../resource/image/sdms/close_x.png")',
    }
}

export const SeosorCloseIcon = styled.div`
    display:${_SeosorCloseIcon[ProjectResource.styleMode].divDisplay};
    width:${_SeosorCloseIcon[ProjectResource.styleMode].divWidth};
    height:${_SeosorCloseIcon[ProjectResource.styleMode].divHeight};
    background:${_SeosorCloseIcon[ProjectResource.styleMode].divBackground};
    background-size: 12px;
    float:right; /* 0106 */
    position:absolute;
    z-index:1;
    right: 14px;
`


/*********************************************************************/


export const SopDetailTable_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopDetailTable.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopDetailTable.yeosu;
    }
    return {};
}

export const _SopDetailTable = {
    busan: {
        divDisplay: 'block',
        tableWidth: '100%',
        divHeight: '12px',
    },
    yeosu: {
        divDisplay: 'block',
        tableWidth: '100%',
        divHeight: '12px',
    }
}

export const SopDetailTable = styled.div`
    display:${_SopDetailTable[ProjectResource.styleMode].divDisplay};
    width:${_SopDetailTable[ProjectResource.styleMode].tableWidth};
    /* height:${_SopDetailTable[ProjectResource.styleMode].tableHeight}; */
    color:${_SopDetailTable[ProjectResource.styleMode].tableColor};
    margin-top: 30px;
    table > thead{
        /* display: block; */
        width: 100%; 
        height: 30px; 
        line-height: 30px; 
        text-align: center;
        font-family: 'Pretendard-Regular';
        color: #000000;
        background: #F5F5F5;
    }
    table > thead > tr > th{
        font-size: 12px;
        font-weight: 600;
    }
    table > tbody{
        /* display: block; */
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-family: 'Pretendard-Regular';
        color: #000000;
        font-size: 12px;
    }
    table > tbody > tr{
        height: 30px;
        border-bottom: solid 1px #F5F5F5;
    }
`

/*********************************************************************/


export const SopSpreadTable_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopSpreadTable.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopSpreadTable.yeosu;
    }
    return {};
}

export const _SopSpreadTable = {
    busan: {
        divDisplay: 'block',
        tableWidth: '100%',
        divHeight: '12px',
    },
    yeosu: {
        divDisplay: 'block',
        tableWidth: '100%',
        divHeight: '12px',
    }
}

export const SopSpreadTable = styled.div`
    display:${_SopSpreadTable[ProjectResource.styleMode].divDisplay};
    width:${_SopSpreadTable[ProjectResource.styleMode].tableWidth};
    /* height:${_SopSpreadTable[ProjectResource.styleMode].tableHeight}; */
    color:${_SopSpreadTable[ProjectResource.styleMode].tableColor};
    margin-top: 50px;
    table > thead{
        /* display: block; */
        width: 100%; 
        height: 30px; 
        line-height: 30px; 
        text-align: center;
        font-family: 'Pretendard-Regular';
        color: #000000;
        background: #F5F5F5;
    }
    table > thead > tr > th{
        font-size: 12px;
        font-weight: 600;
    }
    table > tbody{
        /* display: block; */
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-family: 'Pretendard-Regular';
        color: #000000;
    }
    table > tbody > tr{
        height: 30px;
        border-bottom: solid 1px #F5F5F5;
    }

`


/*********************************************************************/