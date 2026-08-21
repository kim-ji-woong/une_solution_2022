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
     cursor: pointer;
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
     cursor: pointer;
 `


/***********************************************************************/


export const TeamSelectBox_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _TeamSelectBox.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _TeamSelectBox.yeosu;
    }
    return {};
}
export const _TeamSelectBox = {
    busan: {
        divDisplay: 'block',
    },
    yeosu: {
        divDisplay: 'block',
    }
}
export const TeamSelectBox = styled.div`
    display:${_TeamSelectBox[ProjectResource.styleMode].divDisplay};
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
        width: 470px;
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


export const TeamSearchBtn_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _TeamSearchBtn.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _TeamSearchBtn.yeosu;
    }
    return {};
}

export const _TeamSearchBtn = {
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

export const TeamSearchBtn = styled.div`
    display:${_TeamSearchBtn[ProjectResource.styleMode].divDisplay};
    width:${_TeamSearchBtn[ProjectResource.styleMode].divWidth};
    height:${_TeamSearchBtn[ProjectResource.styleMode].divHeight};
    line-height:${_TeamSearchBtn[ProjectResource.styleMode].divLineHeight};
    background: #19A5FF;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
 `


/*****************************************************************/


export const TeamTable_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _TeamTable.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _TeamTable.yeosu;
    }
    return {};
}

export const _TeamTable = {
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

export const TeamTable = styled.div`
    width:${_TeamTable[ProjectResource.styleMode].tableWidth};
    /* height:${_TeamTable[ProjectResource.styleMode].tableHeight}; */
    color:${_TeamTable[ProjectResource.styleMode].tableColor};
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
    table > tbody > tr > td {
        border-bottom: solid 1px #f5f5f5;
        border-right: solid 1px #f5f5f5;
        height: 48px;
        line-height: 48px;
    }
    table > tbody > tr > td:nth-last-child(10){
        border-right: solid 1px #fff;
    }
    .teamCheckBox{
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        border: solid 1.5px #000000;
        cursor: pointer;
        appearance: none;
        position: relative;
        border-radius: 2px;
        -moz-border-radius: 2px;
        -webkit-border-radius: 2px;
    }
    .teamCheckBox:checked{
        display: inline-block;
        background: #fff url("../../../resource/image/history/checkBox_fill_black.png")no-repeat center center;
        width: 18px;
        height: 18px;
        /* border:dashed 2px red; */
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


export const AddBtn_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _AddBtn.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _AddBtn.yeosu;
    }
    return {};
}

export const _AddBtn = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '55px',
        divHeight: '55px',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '55px',
        divHeight: '55px',
    }
}


export const AddBtn = styled.div`
    display:${_AddBtn[ProjectResource.styleMode].divDisplay};
    width:${_AddBtn[ProjectResource.styleMode].divWidth};
    height:${_AddBtn[ProjectResource.styleMode].divHeight};
    line-height:55px;
    text-align: center;
    border:solid 1px #19A5FF;
    border-radius: 5px;
    color:#19A5FF;
    margin-right:10px;
    cursor:pointer;
 `


/******************************************************************/


export const DeleteBtn_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _DeleteBtn.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _DeleteBtn.yeosu;
    }
    return {};
}

export const _DeleteBtn = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '55px',
        divHeight: '55px',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '55px',
        divHeight: '55px',
    }
}

export const DeleteBtn = styled.div`
    display:${_DeleteBtn[ProjectResource.styleMode].divDisplay};
    width:${_DeleteBtn[ProjectResource.styleMode].divWidth};
    height:${_DeleteBtn[ProjectResource.styleMode].divHeight};
    line-height:55px;
    text-align: center;
    border:solid 1px #FF5A5A;
    border-radius: 5px;
    color: #FF5A5A;
    cursor:pointer;
 `


/******************************************************************/


export const TeamMemberSelectBox_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _TeamMemberSelectBox.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _TeamMemberSelectBox.yeosu;
    }
    return {};
}
export const _TeamMemberSelectBox = {
    busan: {
        divDisplay: 'block',
    },
    yeosu: {
        divDisplay: 'block',
    }
}
export const TeamMemberSelectBox = styled.div`
    display:${_TeamMemberSelectBox[ProjectResource.styleMode].divDisplay};
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
        /* width: 160px; */
        width: 217px;
        height: 54px;
        background: #F5F5F5 url("./../../resource/image/history/arrow_drop_down_black.png")no-repeat 98% 50%;
        background-size: 20px;
        color: #000000;
        border:none;
        font-size: 14px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        padding-left: 10px;
        box-shadow: 0px 3px 6px #00000029;
    }
    select::-ms-expand {
        display: none;
    }
    /* select:checked{
        background: #fff url("./../../SOPSimulatorYeosu/image/checkBox_fill_black.png")no-repeat center center;
    } */
    select > option{
       background: #f5f5f5;
       color: #000000;
       height: 48px;
       line-height: 48px;
       font-size: 14px;
    }
 `

/*****************************************************************/


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


