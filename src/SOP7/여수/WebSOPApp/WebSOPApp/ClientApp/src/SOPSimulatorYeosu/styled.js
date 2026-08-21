import styled from 'styled-components';
import ProjectResource from '../Root/resource/id';

/* let styleMode = "yeosu";

export const setMode = (mode) => {
    styleMode = mode;
}
*/


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
        divBackgroundColor: '#0D2348',
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
     border: dashed 1px red;
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
        imgBackground: 'url("../../../resource/image/sop/yeosuLogoB.png")',
    },
    yeosu: {
        imgDisplay: 'inline-block',
        imgWidth: '160px',
        imgHeight: '42px',
        imgBackgroundSize: '180px !important',
        imgBackgroundPosition: 'center',
        imgFloat: 'left',
        imgBackground: 'url("../../../resource/image/sop/yeosuLogo_W.png")',
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
`;


/***********************************************************************/


export const MenuBar_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _MenuBar.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _MenuBar.yeosu;
    }
    return {};
}

export const _MenuBar = {
    busan: {
        divDisplay: 'inline-flex',
        divWidth: '326px',
        divHeight: '39px',
        divBorderRadius: '20px',
        divBackground: 'rgba(255,255,255,0.2)',
        divMarginRight: '60px',
        divLineHeight: '39px',
        divFloat: 'right',
        divBoxShadow: '1px 1px 1px 1px rgba(215, 215, 215, 0.5)',

    },
    yeosu: {
        divDisplay: 'inline-flex',
        divWidth: '326px',
        divHeight: '39px',
        divBorderRadius: '20px',
        divBackground: 'rgba(255,255,255,0.2)',
        divMarginRight: '60px',
        divLineHeight: '39px',
        divFloat: 'right',
        divBoxShadow: ' ',
    }
}


export const MenuBar = styled.div`
     display:${_MenuBar[ProjectResource.styleMode].divDisplay};
     width:${_MenuBar[ProjectResource.styleMode].divWidth};
     height:${_MenuBar[ProjectResource.styleMode].divHeight};
     border-radius:${_MenuBar[ProjectResource.styleMode].divBorderRadius};
     background:${_MenuBar[ProjectResource.styleMode].divBackground};
     margin-right:${_MenuBar[ProjectResource.styleMode].divMarginRight};
     line-height:${_MenuBar[ProjectResource.styleMode].divLineHeight};
     float:${_MenuBar[ProjectResource.styleMode].divFloat};
     box-shadow:${_MenuBar[ProjectResource.styleMode].divBoxShadow};
     
 `;


/********************************************************************/

export const UserIcon_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _UserIcon.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _UserIcon.yeosu;
    }
    return {};
}

export const _UserIcon = {
    busan: {
        iconDisplay: 'inline-block',
        iconWidth: '100px',
        iconLineHeight: '39px',
        iconColor: '#000000',
        iconBackgroundPosition: 'center center',
        iconBackground: 'url("../../../resource/image/sop/userIcon.png")no-repeat',
    },
    yeosu: {
        iconDisplay: 'inline-block',
        iconWidth: '100px',
        iconLineHeight: '39px',
        iconColor: '#fff',
        iconBackgroundPosition: 'center center',
        iconBackground: 'url("../../../resource/image/sop/userIcon.png")no-repeat',
    }
}


export const UserIcon = styled.div`
    display:${_UserIcon[ProjectResource.styleMode].iconDisplay};
    width:${_UserIcon[ProjectResource.styleMode].iconWidth};
    line-height:${_UserIcon[ProjectResource.styleMode].iconLineHeight};
    color:${_UserIcon[ProjectResource.styleMode].iconColor};
    background-position:${_UserIcon[ProjectResource.styleMode].iconBackgroundPosition};
    background:${_UserIcon[ProjectResource.styleMode].iconBackground};
    background-position-x:16px;
    background-position-y:8px;
    > p{
       display:block;
       width: 100px;
       margin-left: 50px;
       font-size:14px;
    }
`;


/****************************************************************/


export const HamburgerIcon_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _HamburgerIcon.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _HamburgerIcon.yeosu;
    }
    return {};
}

export const _HamburgerIcon = {
    busan: {
        iconDisplay: 'inline-block',
        iconWidth: '50px',
        iconBackgroundPosition: 'center center',
        imgBackground: 'url("../../../resource/image/sop/hamburgerIconB.png")no-repeat',
    },
    yeosu: {
        iconDisplay: 'inline-block',
        iconWidth: '50px',
        iconBackgroundPosition: 'center center',
        imgBackground: 'url("../../../resource/image/sop/hamburgerIcon.png")no-repeat',
    }
}

export const HamburgerIcon = styled.div`
    display:${_HamburgerIcon[ProjectResource.styleMode].iconDisplay};
    width:${_HamburgerIcon[ProjectResource.styleMode].iconWidth};
    background:${_HamburgerIcon[ProjectResource.styleMode].imgBackground};
    background-position:${_HamburgerIcon[ProjectResource.styleMode].iconBackgroundPosition};
`;


/***************************************************************/


export const SettingIcon_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SettingIcon.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SettingIcon.yeosu;
    }
    return {};
}

export const _SettingIcon = {
    busan: {
        iconDisplay: 'inline-block',
        iconWidth: '50px',
        iconBackground: 'url("../../../resource/image/sop/settingIconB.png")no-repeat',
        iconBackgroundPosition: 'center center',
    },
    yeosu: {
        iconDisplay: 'inline-block',
        iconWidth: '50px',
        iconBackground: 'url("../../../resource/image/sop/settingIcon.png")no-repeat',
        iconBackgroundPosition: 'center center',
    }
}


export const SettingIcon = styled.div`
    display:${_SettingIcon[ProjectResource.styleMode].iconDisplay};
    width:${_SettingIcon[ProjectResource.styleMode].iconWidth};
    background-position:${_SettingIcon[ProjectResource.styleMode].iconBackgroundPosition};
    background:${_SettingIcon[ProjectResource.styleMode].iconBackground};
    background-position-x: 10px;
    background-position-y: 11px;
`;



/***************************************************************/


export const Mode_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _Mode.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _Mode.yeosu;
    }
    return {};
}

export const _Mode = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '124px',
        divHeight: '39px',
        divLineHeight: '39px',
        divBorderRadius: '20px',
        divBackground: '#1BC9FB',
        divColor: '#fff',
        divFontSize: '14px',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '124px',
        divHeight: '39px',
        divLineHeight: '39px',
        divBorderRadius: '20px',
        /* divBackgorund: 'rgba(255,255,255,0.5)', */
        divBackground: '#d7d7d75c',
        divColor: '#fff',
        divFontSize: '14px',
    }
}


export const Mode = styled.div`
     display:${_Mode[ProjectResource.styleMode].divDisplay};
     width:${_Mode[ProjectResource.styleMode].divWidth};
     height:${_Mode[ProjectResource.styleMode].divHeight};
     line-height:${_Mode[ProjectResource.styleMode].divLineHeight};
     border-radius:${_Mode[ProjectResource.styleMode].divBorderRadius};
     background:${_Mode[ProjectResource.styleMode].divBackground};
     color:${_Mode[ProjectResource.styleMode].divColor};
     font-size:${_Mode[ProjectResource.styleMode].divFontSize};
     text-align: center;
`;


/***************************************************************/



export const ArrowSmallDown_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _ArrowSmallDown.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _ArrowSmallDown.yeosu;
    }
    return {};
}

export const _ArrowSmallDown = {
    busan: {
        iconDisplay: 'inline-block',
        iconWidth: '9px',
        iconHeight: '7px',
        iconBackgroundPosition: 'center',
        iconBackground: 'url("../../../resource/image/sop/arrowSmallDown.png")',
    },
    yeosu: {
        iconDisplay: 'inline-block',
        iconWidth: '9px',
        iconHeight: '7px',
        iconBackgroundPosition: 'center',
        iconBackground: 'url("../../../resource/image/sop/arrowSmallDown.png")',
    }
}

export const ArrowSmallDown = styled.div`
    display:${_ArrowSmallDown[ProjectResource.styleMode].iconDisplay};
    width:${_ArrowSmallDown[ProjectResource.styleMode].iconWidth};
    height:${_ArrowSmallDown[ProjectResource.styleMode].iconHeight};
    background-position:${_ArrowSmallDown[ProjectResource.styleMode].iconBackgroundPosition};
    background:${_ArrowSmallDown[ProjectResource.styleMode].iconBackground};
`



/**************************************************************/


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
        divBackgroundColor: '#0D2348',
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


/*************************************************************/


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
 `


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
        iconBackground:'url("../../../resource/image/sop/returnLogo.png")no-repeat',

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
        divBackgroundColor: '#0D2348',
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
        color: ${_SopListBox[ProjectResource.styleMode].divColor};
        font-size: 20px; 
        /* font-weight: 900; */ 
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

export const SopTable_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopTable.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopTable.yeosu;
    }
    return {};
}

export const _SopTable = {
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

export const SopTable = styled.div`
    width:${_SopTable[ProjectResource.styleMode].tableWidth};
    /* height:${_SopTable[ProjectResource.styleMode].tableHeight}; */
    color:${_SopTable[ProjectResource.styleMode].tableColor};
    .yeosuSOPTr{
        /* display: block; */
        width: 100%;
        height: 50px; 
        line-height: 50px; 
        background-color: #d7d7d754;
        border-radius:10px;
    }
    table > tr{
        /* display: block; */
        width: 100%; 
        height: 50px; 
        line-height: 50px; 
        text-align: center;
        font-family: 'Pretendard-Regular';
        border-bottom: solid 0.5px #d7d7d738; 
    }
    table > th{
        display: block; 
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-weight: 200; 
        font-size: 14px;
    }
    table > td{
        display: inline-block; 
        width: 100%;
        height: auto;
        text-align: center;
        font-weight: 200; 
        font-size: 14px;
    }
    table > td .yeosuRedFont{
        display:inline-block;
        color: red;
    }
    &.sopTableSelect{ 
        border:dashed 1px red;
    }
 `


/*****************************************************************/


export const SOPselectBox_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SOPselectBox.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SOPselectBox.yeosu;
    }
    return {};
}

export const _SOPselectBox = {
    busan: {
        divDisplay: 'inline-block',
    },
    yeosu: {
        divDisplay: 'inline-block',
    }
}

export const SOPselectBox = styled.div`
    display:${_SOPselectBox[ProjectResource.styleMode].divDisplay};
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
       background: #26395B;
       color: #fff;
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
        divColor: '#fff',
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



export const TitleFlex_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _TitleFlex.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _TitleFlex.yeosu;
    }
    return {};
}


export const _TitleFlex = {
    busan: {
        divDisplay: 'flex',
        divWidth: '100%',
        divHeight: '31px',
        divLineHeight: '31px',
        divMarginBottom: '16px',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '100%',
        divHeight: '31px',
        divLineHeight: '31px',
        divMarginBottom: '16px',
    }
}

export const TitleFlex = styled.div`
    display:${_TitleFlex[ProjectResource.styleMode].divDisplay};
    width:${_TitleFlex[ProjectResource.styleMode].divWidth};
    height:${_TitleFlex[ProjectResource.styleMode].divHeight};
    lineHeight:${_TitleFlex[ProjectResource.styleMode].divLineHeight};
    margin-bottom:${_TitleFlex[ProjectResource.styleMode].divMarginBottom};
    float:left;
    > span{
       display:inline-block; 
       height: 31px; 
       line-height: 31px;
       color: #fff;
       font-size: 20px;
       /* font-weight: 900; */
       font-family:  'Pretendard';
       {/* letter-spacing: -1px; */}
       margin-right: 20px;
    }
`


/***************************************************************/


export const TitleActive_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _TitleActive.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _TitleActive.yeosu;
    }
    return {};
}


export const _TitleActive = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '127px',
        divHeight: '31px',
        divLineHeight: '31px',
        divMarginBottom: '',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '127px',
        divHeight: '31px',
        divLineHeight: '31px',
        divMarginBottom: '',
    }
}


export const TitleActive = styled.div`
    display:${_TitleActive[ProjectResource.styleMode].divDisplay};
    width:${_TitleActive[ProjectResource.styleMode].divWidth};
    height:${_TitleActive[ProjectResource.styleMode].divHeight};
    lineHeight:${_TitleActive[ProjectResource.styleMode].divLineHeight};
    margin-bottom:${_TitleActive[ProjectResource.styleMode].divMarginBottom};
    color: #fff;
    font-size: 18px;
    letter-spacing: -1px;
    line-height: 31px;
    background-color: #1BC9FB;
    border-radius: 4px;
    text-align: center;
    margin-right: 10px; 
  }
`


/****************************************************************/


export const TitleDisable_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _TitleDisable.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _TitleDisable.yeosu;
    }
    return {};
}


export const _TitleDisable = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '127px',
        divHeight: '31px',
        divLineHeight: '31px',
        divMarginBottom: '',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '127px',
        divHeight: '31px',
        divLineHeight: '31px',
        divMarginBottom: '',
    }
}

export const TitleDisable = styled.div`
    display:${_TitleDisable[ProjectResource.styleMode].divDisplay};
    width:${_TitleDisable[ProjectResource.styleMode].divWidth};
    height:${_TitleDisable[ProjectResource.styleMode].divHeight};
    lineHeight:${_TitleDisable[ProjectResource.styleMode].divLineHeight};
    margin-bottom:${_TitleDisable[ProjectResource.styleMode].divMarginBottom};
    color: #fff;
    font-size: 18px;
    letter-spacing: -1px;
    line-height: 31px;
    border-radius: 4px;
    text-align: center;
    background-color: #5a589094;
    margin-right: 10px;
}
`


/***************************************************************/


/* export const PlusIcon_ = () => {
    if (ProjectResource.styleMode === "default") {
        return _PlusIcon.default;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _PlusIcon.yeosu;
    }
    return {};
}

export const _PlusIcon = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '40px',
        divBackground: 'url("../../../resource/image/sop/addCircle.png")no-repeat',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '40px',
        divBackground: 'url("../../../resource/image/sop/addCircle.png")no-repeat',
    }
}


export const PlusIcon = styled.div`
     display:${_PlusIcon[ProjectResource.styleMode].divDisplay};
     width:${_PlusIcon[ProjectResource.styleMode].divWidth};
     height:${_PlusIcon[ProjectResource.styleMode].divHeight};
     background:${_PlusIcon[ProjectResource.styleMode].divBackground};
     background-position-x: 6px;
     background-position-y: 6px;
`
*/


/***************************************************************/


export const ArrowLeftIcon_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _ArrowLeftIcon.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _ArrowLeftIcon.yeosu;
    }
    return {};
}

export const _ArrowLeftIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '31px',
        divHeight: '31px',
        divBackground: 'url("../../../resource/image/sop/arrowLeftDisable.png")no-repeat',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '31px',
        divHeight: '31px',
        divBackground: 'url("../../../resource/image/sop/arrowLeftDisable.png")no-repeat',
    }
}


export const ArrowLeftIcon = styled.div`
     display:${_ArrowLeftIcon[ProjectResource.styleMode].divDisplay};
     width:${_ArrowLeftIcon[ProjectResource.styleMode].divWidth};
     height:${_ArrowLeftIcon[ProjectResource.styleMode].divHeight};
     background:${_ArrowLeftIcon[ProjectResource.styleMode].divBackground};
     /* background-position-x: 6px;
     background-position-y: 6px; */
     margin-right: 8px;
     &:hover{
        background:'url("../../../resource/image/sop/arrowLeftHover.png")no-repeat center center'
     }
`


/***************************************************************/


export const ArrowRightIcon_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _ArrowRightIcon.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _ArrowRightIcon.yeosu;
    }
    return {};
}

export const _ArrowRightIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '31px',
        divHeight: '31px',
        divBackground: 'url("../../../resource/image/sop/arrowRightDisable.png")no-repeat center center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '31px',
        divHeight: '31px',
        divBackground: 'url("../../../resource/image/sop/arrowRightHover.png")no-repeat center center',
    }
}


export const ArrowRightIcon = styled.div`
     display:${_ArrowRightIcon[ProjectResource.styleMode].divDisplay};
     width:${_ArrowRightIcon[ProjectResource.styleMode].divWidth};
     height:${_ArrowRightIcon[ProjectResource.styleMode].divHeight};
     background:${_ArrowRightIcon[ProjectResource.styleMode].divBackground};
     /* background-position-x: 6px;
     background-position-y: 6px; */
     &:hover{
        background:'url("../../../resource/image/sop/arrowRightHover.png")no-repeat center center';
     }
`

/***************************************************************/


export const SopFlowChartBox_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopFlowChartBox.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopFlowChartBox.yeosu;
    }
    return {};
}

export const _SopFlowChartBox = {
    busan: {
        divDisplay: 'block',
        divWidth: '100%',
        divColor: '#fff',
        divFontSize: '',
        divFontWeight: '',
        divMarginBottom: '',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '100%',
        divColor: '#fff',
        divFontSize: '',
        divFontWeight: '',
        divMarginBottom: '',
    }
}


export const SopFlowChartBox = styled.div`
    display:${_SopFlowChartBox[ProjectResource.styleMode].divDisplay};
    width:${_SopFlowChartBox[ProjectResource.styleMode].divWidth};
    color:${_SopFlowChartBox[ProjectResource.styleMode].divColor};
    font-size:${_SopFlowChartBox[ProjectResource.styleMode].divFontSize};
    font-weight:${_SopFlowChartBox[ProjectResource.styleMode].divFontWeight};
    margin-bottom:${_SopFlowChartBox[ProjectResource.styleMode].divMarginBottom};
    divBorder:${_SopFlowChartBox[ProjectResource.styleMode].divBorder};
    float:left;
    border:solid 1px #fff;
    border-radius: 10px;
    position:relative;
    /* height: 1080px; */

    .sopBoxTitle{
        display:block;
        width:100%;
        height: 50px;
        background: #fff;
        font-family: 'Pretendard-regular';
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        padding:0px 20px;
    }
    .sopTitle{
        display: inline-block;
        color: #000000;
        line-height: 50px;
        font-family:  'Pretendard';
        font-size: 16px;
    }
    .sopRefrush{
        display: inline-block;
        font-family:  'Pretendard';
        font-size: 16px;
        float:right;
        color: #000000;
        line-height: 50px;
    }
 `


/**************************************************************/


export const RefrushIcon_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _RefrushIcon.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _RefrushIcon.yeosu;
    }
    return {};
}

export const _RefrushIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divHeight: '50px',
        divBackground: 'url("../../../resource/image/sop/refreshIcon.png")no-repeat',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divHeight: '50px',
        divBackground: 'url("../../../resource/image/sop/refreshIcon.png")no-repeat',
    }
}


export const RefrushIcon = styled.div`
     display:${_RefrushIcon[ProjectResource.styleMode].divDisplay};
     width:${_RefrushIcon[ProjectResource.styleMode].divWidth};
     height:${_RefrushIcon[ProjectResource.styleMode].divHeight};
     background:${_RefrushIcon[ProjectResource.styleMode].divBackground};
     float:right;
     background-position-x: 6px;
     background-position-y: 16px;
`

/***************************************************************/


export const StepBar_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _StepBar.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _StepBar.yeosu;
    }
    return {};
}


export const _StepBar = {
    busan: {
        divDisplay: 'flex',
        divWidth: '100%',
        divHeight: '50px',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '100%',
        divHeight: '50px',
    }
}


export const StepBar = styled.div`
      display:${_StepBar[ProjectResource.styleMode].divDisplay};
      width:${_StepBar[ProjectResource.styleMode].divWidth};
      height:${_StepBar[ProjectResource.styleMode].divHeight};
      >span{
         display:inline-block;
         width: 100%;
         height: 50px;
         text-align:center;
      }
      .interest{
         width:100%;
         height:50px;
         line-height: 50px;
         background: #00B050;
         color:#fff;
         text-align:center;
         font-family:  'Pretendard';
      }
      .interest:hover{
         background: #0d7a3fe6;
       }
      .attention{
         width:100%;
         height:50px;
         line-height: 50px;
         background: #FAD009;
         color:#fff;
         text-align:center;
         font-family:  'Pretendard';
      }
      .danger{
         width:100%;
         height:50px;
         line-height: 50px;
         background: #FF6600;
         color:#fff;
         text-align:center;
         font-family:  'Pretendard';
      }
      .serious{
         width:100%;
         height:50px;
         line-height: 50px;
         background: #C00000;
         color:#fff;
         text-align:center;
         font-family:  'Pretendard';
      }
 `;


/**************************************************************/


export const TriangleI_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _TriangleI.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _TriangleI.yeosu;
    }
    return {};
}

export const _TriangleI = {
    busan: {
        /* divDisplay: 'inline-block',
        divWidth: '87px',
        divHeight: '87px',
        divBackground: 'url("../../../resource/image/sop/editIcon.png")no-repeat', */
    },
    yeosu: {
        /* divDisplay: 'inline-block',
        divWidth: '87px',
        divHeight: '87px',
        divBackground: 'url("../../../resource/image/sop/editIcon.png")no-repeat', */
    }
}


export const TriangleI = styled.div`
     /* display:${_TriangleI[ProjectResource.styleMode].divDisplay};
     width:${_TriangleI[ProjectResource.styleMode].divWidth};
     height:${_TriangleI[ProjectResource.styleMode].divHeight};
     background:${_TriangleI[ProjectResource.styleMode].divBackground};
     position: absolute;
     right: 0;
     bottom: 0; */

     width: 0;
     height: 0;
     border-top: 25px solid transparent;
     border-left: 24px solid #00B050;
     border-bottom: 25px solid transparent;
     background-color: #FAD009;
     &:hover{
       border-left: 24px solid #0d7a3fe6;
     }
}

`


/**************************************************************/



export const TriangleA_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _TriangleA.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _TriangleA.yeosu;
    }
    return {};
}

export const _TriangleA = {
    busan: {
        /* divDisplay: 'inline-block',
        divWidth: '87px',
        divHeight: '87px',
        divBackground: 'url("../../../resource/image/sop/editIcon.png")no-repeat', */
    },
    yeosu: {
        /* divDisplay: 'inline-block',
        divWidth: '87px',
        divHeight: '87px',
        divBackground: 'url("../../../resource/image/sop/editIcon.png")no-repeat', */
    }
}


export const TriangleA = styled.div`
     /* display:${_TriangleA[ProjectResource.styleMode].divDisplay};
     width:${_TriangleA[ProjectResource.styleMode].divWidth};
     height:${_TriangleA[ProjectResource.styleMode].divHeight};
     background:${_TriangleA[ProjectResource.styleMode].divBackground};
     position: absolute;
     right: 0;
     bottom: 0; */

     width: 0;
     height: 0;
     border-top: 25px solid transparent;
     border-left: 24px solid #FAD009;
     border-bottom: 25px solid transparent;
     background-color: #FF6600;


`

/**************************************************************/


export const TriangleD_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _TriangleD.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _TriangleD.yeosu;
    }
    return {};
}

export const _TriangleD = {
    busan: {
        /* divDisplay: 'inline-block',
        divWidth: '87px',
        divHeight: '87px',
        divBackground: 'url("../../../resource/image/sop/editIcon.png")no-repeat', */
    },
    yeosu: {
        /* divDisplay: 'inline-block',
        divWidth: '87px',
        divHeight: '87px',
        divBackground: 'url("../../../resource/image/sop/editIcon.png")no-repeat', */
    }
}


export const TriangleD = styled.div`
     /* display:${_TriangleD[ProjectResource.styleMode].divDisplay};
     width:${_TriangleD[ProjectResource.styleMode].divWidth};
     height:${_TriangleD[ProjectResource.styleMode].divHeight};
     background:${_TriangleD[ProjectResource.styleMode].divBackground};
     position: absolute;
     right: 0;
     bottom: 0; */

     width: 0;
     height: 0;
     border-top: 25px solid transparent;
     border-left: 24px solid #FF6600;
     border-bottom: 25px solid transparent;
     background-color:#C00000;


`

/**************************************************************/


export const TriangleS_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _TriangleS.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _TriangleS.yeosu;
    }
    return {};
}

export const _TriangleS = {
    busan: {
        /* divDisplay: 'inline-block',
        divWidth: '87px',
        divHeight: '87px',
        divBackground: 'url("../../../resource/image/sop/editIcon.png")no-repeat', */
    },
    yeosu: {
        /* divDisplay: 'inline-block',
        divWidth: '87px',
        divHeight: '87px',
        divBackground: 'url("../../../resource/image/sop/editIcon.png")no-repeat', */
    }
}


export const TriangleS = styled.div`
     /* display:${_TriangleS[ProjectResource.styleMode].divDisplay};
     width:${_TriangleS[ProjectResource.styleMode].divWidth};
     height:${_TriangleS[ProjectResource.styleMode].divHeight};
     background:${_TriangleS[ProjectResource.styleMode].divBackground};
     position: absolute;
     right: 0;
     bottom: 0; */

     width: 0;
     height: 0;
     border-top: 25px solid transparent;
     border-left: 24px solid #C00000;
     border-bottom: 25px solid transparent;
     background: #c00000;

`

/**************************************************************/



export const EditIcon_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _EditIcon.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _EditIcon.yeosu;
    }
    return {};
}

export const _EditIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '75px',
        divHeight: '75px',
        divBackground: 'url("../../../../resource/image/sop/editCircle.png")no-repeat center center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '75px',
        divHeight: '75px',
        divBackground: 'url("../../../../resource/image/sop/editCircle.png")no-repeat center center',
    }
}


export const EditIcon = styled.div`
     display:${_EditIcon[ProjectResource.styleMode].divDisplay};
     width:${_EditIcon[ProjectResource.styleMode].divWidth};
     height:${_EditIcon[ProjectResource.styleMode].divHeight};
     background:${_EditIcon[ProjectResource.styleMode].divBackground};
     position: absolute;
     right: 30px;
     bottom: 20px;

`


/* icon TEST */
/* export const EditIcon2 = styled.div`
     background-image: url(${EditIcon2});
` */


/**************************************************************/


export const SopStageBox_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopStageBox.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopStageBox.yeosu;
    }
    return {};
}


export const _SopStageBox = {
    busan: {
        divDisplay: 'block',
        divWidth: '50%',
        divBorderRadius: '10px',
        divBackgroundColor: '#e8e8e8',
        divMargin: '0px 30px',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '50%',
        divBorderRadius: '10px',
        divBackgroundColor: '#e8e8e8',
        divMargin: '0px 30px',
    }
}

export const SopStageBox = styled.div`
      display:${_SopStageBox[ProjectResource.styleMode].divDisplay};
      width:${_SopStageBox[ProjectResource.styleMode].divWidth};
      border-radius:${_SopStageBox[ProjectResource.styleMode].divBorderRadius};
      background-color:${_SopStageBox[ProjectResource.styleMode].divBackgroundColor};
      margin:${_SopStageBox[ProjectResource.styleMode].divMargin};
      /* height: 100%; */
      height: fit-content;
 `;


/*************************************************************/


export const SopStartBox_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopStartBox.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopStartBox.yeosu;
    }
    return {};
}


export const _SopStartBox = {
    busan: {
        divDisplay: 'flex',
        divWidth: '100%',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '100%',
    }
}

export const SopStartBox = styled.div`
    display:${_SopStartBox[ProjectResource.styleMode].divDisplay};
    width:${_SopStartBox[ProjectResource.styleMode].divWidth};
    /* flex-direction: column; */
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    /* color:#000000; */

    &.active{
       background: #fff;
       border-left: solid 7px #19A5FF;
    }
`;


/******************************************************************/


export const SopFlexBox_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopFlexBox.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopFlexBox.yeosu;
    }
    return {};
}

export const _SopFlexBox = {
    busan: {
        divDisplay: 'flex',
        divWidth: '100%',
        divPadding: '10px 0px',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '100%',
        divPadding: '10px 0px',
    }
}


export const SopFlexBox = styled.div`
    display:${_SopFlexBox[ProjectResource.styleMode].divDisplay};
    width:${_SopFlexBox[ProjectResource.styleMode].divWidth};
    padding:${_SopFlexBox[ProjectResource.styleMode].divPadding};
    align-items: center;
    > p {
      color: #908c8c;
      line-height: 30px;
      /* width: 100%; */
       width: calc(100% - 420px);
    }
    &.test{
       /* display:block; */ 
    }
`;


/******************************************************************/


export const SopFlexBoxS1_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopFlexBoxS1.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopFlexBoxS1.yeosu;
    }
    return {};
}

export const _SopFlexBoxS1 = {
    busan: {
        divDisplay: 'flex',
        divWidth: '60%',
        divPadding: '20px 0px 20px 40px',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '60%',
        divPadding: '20px 0px 20px 40px',
    }
}


export const SopFlexBoxS1 = styled.div`
    display:${_SopFlexBoxS1[ProjectResource.styleMode].divDisplay};
    width:${_SopFlexBoxS1[ProjectResource.styleMode].divWidth};
    padding:${_SopFlexBoxS1[ProjectResource.styleMode].divPadding};
    flex-direction: column;
    border-right: solid 1px #d7d7d7;

    > div > p {
      color: #808080;
      line-height: 30px;
      width: 540px; 
      /* overflow:hidden;
	  text-overflow:ellipsis;
	  white-space:nowrap; */
      font-family:  'Pretendard';
    }
    > div > p.active {
       color: #000000; 
    }
`;


/******************************************************************/


export const SopFlexBoxS2_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopFlexBoxS2.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopFlexBoxS2.yeosu;
    }
    return {};
}

export const _SopFlexBoxS2 = {
    busan: {
        divDisplay: 'flex',
        divWidth: '20%',
        divPadding: '10px 0px',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '20%',
        divPadding: '10px 0px',
    }
}


export const SopFlexBoxS2 = styled.div`
    display:${_SopFlexBoxS2[ProjectResource.styleMode].divDisplay};
    width:${_SopFlexBoxS2[ProjectResource.styleMode].divWidth};
    padding:${_SopFlexBoxS2[ProjectResource.styleMode].divPadding};
    align-items: center; 
    flex-direction: column;
    border-right: solid 1px #d7d7d7;
    > p {
      color: #908c8c;
      line-height: 30px;
      /* width: 100%; */
      font-family:  'Pretendard';
    }
`;


/******************************************************************/


export const SopFlexBoxS3_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopFlexBoxS3.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopFlexBoxS3.yeosu;
    }
    return {};
}

export const _SopFlexBoxS3 = {
    busan: {
        divDisplay: 'flex',
        divWidth: '20%',
        divPadding: '10px 0px',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '20%',
        divPadding: '10px 0px',
    }
}


export const SopFlexBoxS3 = styled.div`
    display:${_SopFlexBoxS3[ProjectResource.styleMode].divDisplay};
    width:${_SopFlexBoxS3[ProjectResource.styleMode].divWidth};
    padding:${_SopFlexBoxS3[ProjectResource.styleMode].divPadding};
    align-items: center;
    flex-direction: column;

    > p {
      color: #908c8c;
      line-height: 30px;
      /* width: 100%; */
    }
`;


/******************************************************************/


export const SopActiveFlexBox_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopActiveFlexBox.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopActiveFlexBox.yeosu;
    }
    return {};
}

export const _SopActiveFlexBox = {
    busan: {
        divDisplay: 'flex',
        divWidth: '100%',
        divPadding: '10px 0px',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '100%',
        divPadding: '10px 0px',
    }
}


export const SopActiveFlexBox = styled.div`
    display:${_SopActiveFlexBox[ProjectResource.styleMode].divDisplay};
    width:${_SopActiveFlexBox[ProjectResource.styleMode].divWidth};
    padding:${_SopActiveFlexBox[ProjectResource.styleMode].divPadding};
    align-items: center;
    background:#fff;
    > p {
      color: #908c8c;
      line-height: 30px;
      width: 100%;
    }
`;


/******************************************************************/


export const SopStartTitle_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopStartTitle.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopStartTitle.yeosu;
    }
    return {};
}

export const _SopStartTitle = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '100%',
        divColor: '#727272',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '100%',
        divColor: '#727272',
    }
}


export const SopStartTitle = styled.div`
    display:${_SopStartTitle[ProjectResource.styleMode].divDisplay};
    width:${_SopStartTitle[ProjectResource.styleMode].divWidth};
    color:${_SopStartTitle[ProjectResource.styleMode].divColor};
    /* line-height:100px; */
    font-size: 18px;
    font-weight: 600;
    padding: 20px 0px;
    border-right: solid 1px #d7d7d75c;
    font-family:  'Pretendard';
    &.active{
      color: #19A5FF;
    }

`;


/******************************************************************/


export const SopEndTitle_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopEndTitle.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopEndTitle.yeosu;
    }
    return {};
}

export const _SopEndTitle = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '100%',
        divColor: '#727272',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '100%',
        divColor: '#727272',
    }
}


export const SopEndTitle = styled.div`
    display:${_SopEndTitle[ProjectResource.styleMode].divDisplay};
    width:${_SopEndTitle[ProjectResource.styleMode].divWidth};
    color:${_SopEndTitle[ProjectResource.styleMode].divColor};
    /* line-height:100px; */
    font-size: 18px;
    font-weight: 600;
    padding: 20px 0px;
    border-right: solid 1px #d7d7d75c;
    font-family:  'Pretendard';
    &.active{
      color: #C00000;
      padding: 20px 0px;

    }
`;


/******************************************************************/


export const SopDisableTitle_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopDisableTitle.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopDisableTitle.yeosu;
    }
    return {};
}

export const _SopDisableTitle = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '100%',
        divColor: '#727272',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '100%',
        divColor: '#727272',
    }
}


export const SopDisableTitle = styled.div`
    display:${_SopDisableTitle[ProjectResource.styleMode].divDisplay};
    width:${_SopDisableTitle[ProjectResource.styleMode].divWidth};
    color:${_SopDisableTitle[ProjectResource.styleMode].divColor};
    /* line-height:100px; */
    font-size: 18px;
    font-weight: 600;
    padding: 14px 0px;
    border-right: solid 1px #d7d7d75c;
    font-family:  'Pretendard';
    &.active{
      color: #19A5FF;
    }
`;


/******************************************************************/


export const SopStartBtn_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopStartBtn.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopStartBtn.yeosu;
    }
    return {};
}

export const _SopStartBtn = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '94px',
        divHeight: '30px',
        divLineHeight: '30px',
        divColor: '#fff',
        divBackground: '#788396',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '94px',
        divHeight: '30px',
        divLineHeight: '30px',
        divColor: '#fff',
        divBackground: '#788396',
    }
}


export const SopStartBtn = styled.div`
    display:${_SopStartBtn[ProjectResource.styleMode].divDisplay};
    width:${_SopStartBtn[ProjectResource.styleMode].divWidth};
    height:${_SopStartBtn[ProjectResource.styleMode].divHeight};
    line-height:${_SopStartBtn[ProjectResource.styleMode].divLineHeight};
    color:${_SopStartBtn[ProjectResource.styleMode].divColor};
    background:${_SopStartBtn[ProjectResource.styleMode].divBackground};
    text-align:center;
    border-radius: 6px;
    cursor:pointer;
    font-family:  'Pretendard';
    font-weight: 600;
    &.active{
      background: #19A5FF;
    }
`;


/******************************************************************/



export const SopNextBtn_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopNextBtn.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopNextBtn.yeosu;
    }
    return {};
}

export const _SopNextBtn = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '94px',
        divHeight: '30px',
        divLineHeight: '30px',
        divColor: '#e6e6e6',
        divBackground: '#788396',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '94px',
        divHeight: '30px',
        divLineHeight: '30px',
        divColor: '#e6e6e6',
        divBackground: '#788396',
    }
}


export const SopNextBtn = styled.div`
    display:${_SopNextBtn[ProjectResource.styleMode].divDisplay};
    width:${_SopNextBtn[ProjectResource.styleMode].divWidth};
    height:${_SopNextBtn[ProjectResource.styleMode].divHeight};
    line-height:${_SopNextBtn[ProjectResource.styleMode].divLineHeight};
    color:${_SopNextBtn[ProjectResource.styleMode].divColor};
    background:${_SopNextBtn[ProjectResource.styleMode].divBackground};
    text-align:center;
    border-radius: 6px;
    margin: 14px 40px;
    cursor:pointer;
    font-family:  'Pretendard';
    font-weight: 600;
    &.active{
       background: #19A5FF;
       color:#fff;
    }
`;


/******************************************************************/



export const SoptotalBtn_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SoptotalBtn.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SoptotalBtn.yeosu;
    }
    return {};
}

export const _SoptotalBtn = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '94px',
        divHeight: '30px',
        divLineHeight: '30px',
        divColor: '#e6e6e6',
        divBackground: '#788396',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '94px',
        divHeight: '30px',
        divLineHeight: '30px',
        divColor: '#e6e6e6',
        divBackground: '#788396',
    }
}


export const SoptotalBtn = styled.div`
    display:${_SoptotalBtn[ProjectResource.styleMode].divDisplay};
    width:${_SoptotalBtn[ProjectResource.styleMode].divWidth};
    height:${_SoptotalBtn[ProjectResource.styleMode].divHeight};
    line-height:${_SoptotalBtn[ProjectResource.styleMode].divLineHeight};
    color:${_SoptotalBtn[ProjectResource.styleMode].divColor};
    background:${_SoptotalBtn[ProjectResource.styleMode].divBackground};
    text-align:center;
    border-radius: 6px;
    margin: 0px 40px;
    cursor:pointer;
    font-family:  'Pretendard';
    font-weight: 600;
    &.active{
      background: #0D2348;
      color:#fff;
    }
`;


/******************************************************************/


export const SopCompletion_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopCompletion.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopCompletion.yeosu;
    }
    return {};
}

export const _SopCompletion = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '150px',
        divHeight: '30px',
        divLineHeight: '30px',
        divColor: '#FF5A5A',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '150px',
        divHeight: '30px',
        divLineHeight: '30px',
        divColor: '#FF5A5A',
    }
}


export const SopCompletion = styled.div`
    display:${_SopCompletion[ProjectResource.styleMode].divDisplay};
    width:${_SopCompletion[ProjectResource.styleMode].divWidth};
    height:${_SopCompletion[ProjectResource.styleMode].divHeight};
    line-height:${_SopCompletion[ProjectResource.styleMode].divLineHeight};
    color:${_SopCompletion[ProjectResource.styleMode].divColor};
    text-align:center;
    padding: 14px 0px;
    font-family:  'Pretendard';
`;


/******************************************************************/


export const SopIncomplete_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopIncomplete.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopIncomplete.yeosu;
    }
    return {};
}

export const _SopIncomplete = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '150px',
        divHeight: '30px',
        divLineHeight: '30px',
        divColor: '#D27272',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '150px',
        divHeight: '30px',
        divLineHeight: '30px',
        divColor: '#D27272',
    }
}


export const SopIncomplete = styled.div`
    display:${_SopIncomplete[ProjectResource.styleMode].divDisplay};
    width:${_SopIncomplete[ProjectResource.styleMode].divWidth};
    height:${_SopIncomplete[ProjectResource.styleMode].divHeight};
    line-height:${_SopIncomplete[ProjectResource.styleMode].divLineHeight};
    color:${_SopIncomplete[ProjectResource.styleMode].divColor};
    text-align:center;
    padding: 14px 0px;
    font-family:  'Pretendard';
`;



/*****************************************************************/



export const SopDLocation_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopDLocation.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopDLocation.yeosu;
    }
    return {};
}

export const _SopDLocation = {
    busan: {
        divDisplay: 'flex',
        divWidth: '100%',
        divHeight: '30px',
        divLineHeight: '30px',
        divColor: '#808080',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '100%',
        divHeight: '30px',
        divLineHeight: '30px',
        divColor: '#808080',
    }
}


export const SopDLocation = styled.div`
    display:${_SopDLocation[ProjectResource.styleMode].divDisplay};
    width:${_SopDLocation[ProjectResource.styleMode].divWidth};
    height:${_SopDLocation[ProjectResource.styleMode].divHeight};
    line-height:${_SopDLocation[ProjectResource.styleMode].divLineHeight};
    color:${_SopDLocation[ProjectResource.styleMode].divColor};
    font-family:  'Pretendard';
    &.active{
        color: #000000; 
    }
    font-size: 14px;
    > input{
        width: 460px;
        height: 34px;
        border-radius: 6px;
        border:solid 1.5px #808080;
        margin-right: 8px;
        margin-left: 16px;
        background-color: #E6E6E6;
        color: #808080;
    }
    > input.active{
       background: #fff;
       color: #000000;
       border:solid 1.5px #000000;
    }
`;


/******************************************************************/


/* export const InputBoxD_ = () => {
    if (ProjectResource.styleMode === "default") {
        return _InputBoxD.default;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _InputBoxD.yeosu;
    }
    return {};
}


export const _InputBoxD = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '400px',
        divHeight: '30px',
        divLineHeight: '30px',
        divColor: '#d7d7d7',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '400px',
        divHeight: '30px',
        divLineHeight: '30px',
        divColor: '#d7d7d7',
    }
}


export const InputBoxD = styled.div`
    display:${_InputBoxD[ProjectResource.styleMode].divDisplay};
    width:${_InputBoxD[ProjectResource.styleMode].divWidth};
    height:${_InputBoxD[ProjectResource.styleMode].divHeight};
    line-height:${_InputBoxD[ProjectResource.styleMode].divLineHeight};
    color:${_InputBoxD[ProjectResource.styleMode].divColor};
    border:solid 1.5px #000000;
    border-radius: 6px;
    margin-left: 16px;
`;
*/


/******************************************************************/



export const SopTabArea_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopTabArea.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopTabArea.yeosu;
    }
    return {};
}


export const _SopTabArea = {
    busan: {
        divDisplay: 'inline-block',
    },
    yeosu: {
        divDisplay: 'inline-block',
    }
}


export const SopTabArea = styled.div`
    display:${_SopTabArea[ProjectResource.styleMode].divDisplay};
    margin-top: 24px;
    font-size: 14px;

    .tabs {
      width: 528px; 
      color: #808080;
    }
    .tabs-nav{
      display: block;
      height: 38px;
      border-bottom: solid 1.5px #808080;
    }
    .tabs-nav li {
      float: left;
      width: 50%;
    }
    a {
      /* border: 1.5px solid #000000; */
      display: block;
      font-weight: 600;
      padding: 10px 0;
      text-align: center;
      text-decoration: none;
      font-family:  'Pretendard';
    }
    a:hover {
      /* color: #ff7b29; */
    }
    .tab-active a {
      /* background: #fff; */
      border-top: solid 1.5px #808080;
      border-left: solid 1.5px #808080;
      border-right: solid 1.5px #808080;
      border-bottom: solid 2px #e9e9e9;
      cursor: default;
      position:relative;
      z-index: 1;
      height: 39px;
    }
    .tabs-stage {
      border-top: 0;
      clear: both;
      padding: 24px 0px 0px 0px;
      position: relative;
      top: -1px;
      display:flex;
    }
    .tabTextBox{
      display:inline-block;
      margin-right: 12px;
    }
    .tabTextBox > input{
      width: 90px;
      height: 34px;
      border-radius: 6px;
      border:solid 1.5px #808080;
      margin-right: 8px;
      background-color: #E6E6E6;
      color: #808080;
      /* padding-left: 10px; */
      text-align: center;
    }
     .tabTextBox > input.active{
        display: inline-block;
        background: #fff;
     }
    .tabBtn{
      display:inline-block;
      width:50px;
      height:30px;
      line-height:30px;
      color:#fff;
      background:#788396;
      border-radius: 6px;
      text-align:center;
    }
    .tabBtn.active{
       background:#19A5FF;
     }
`;


/******************************************************************/


export const SopTabAreaActive_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopTabAreaActive.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopTabAreaActive.yeosu;
    }
    return {};
}


export const _SopTabAreaActive = {
    busan: {
        divDisplay: 'inline-block',
    },
    yeosu: {
        divDisplay: 'inline-block',
    }
}

export const SopTabAreaActive = styled.div`
    display:${_SopTabAreaActive[ProjectResource.styleMode].divDisplay};
    margin-top: 24px;
    font-size: 14px;

    .tabs {
      width: 528px; 
      color: #000000;
    }
    .tabs-nav{
      display: block;
      height: 38px;
      border-bottom: solid 1.5px #000000;
    }
    .tabs-nav li {
      float: left;
      width: 50%;
    }
    a {
      /* border: 1.5px solid #000000; */
      display: block;
      font-weight: 600;
      padding: 10px 0;
      text-align: center;
      text-decoration: none;
    }
    a:hover {
      /* color: #ff7b29; */
    }
    .tab-active a {
      /* background: #fff; */ 
      border-top: solid 1.5px #000000;
      border-left: solid 1.5px #000000;
      border-right: solid 1.5px #000000;
      border-bottom: solid 2px #fff;
      cursor: default;
      position:relative;
      z-index: 1;
      height: 39px;
    }
    .tabs-stage {
      border-top: 0;
      clear: both;
      padding: 24px 0px 0px 0px;
      position: relative;
      top: -1px;
      display:flex;
    }
    .tabTextBox{
      display:inline-block;
      margin-right: 12px;
    }
    .tabTextBox > input{
      width: 90px;
      height: 34px;
      border-radius: 6px;
      border:solid 1.5px #000000;
      margin-right: 8px;
      background-color: #E6E6E6;
    }
     .tabTextBox > input.active{
        display: inline-block;
        background: #fff;
     }
    .tabBtn{
      display:inline-block;
      width:50px;
      height:30px;
      line-height:30px;
      color:#fff;
      background:#788396;
      border-radius: 6px;
      text-align:center;
    }
    .tabBtn.active{
       background:#19A5FF;
     }
`;


/******************************************************************/


/* export const ApplicationBtn_ = () => {
    if (ProjectResource.styleMode === "default") {
        return _ApplicationBtn.default;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _ApplicationBtn.yeosu;
    }
    return {};
}


export const _ApplicationBtn = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '200px',
        divHeight: '30px',
        divLineHeight: '30px',
        divColor: '#fff',
        divBackground: '#097AB2',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '200px',
        divHeight: '30px',
        divLineHeight: '30px',
        divColor: '#fff',
        divBackground: '#097AB2',
    }
}


export const ApplicationBtn = styled.div`
    display:${_ApplicationBtn[ProjectResource.styleMode].divDisplay};
    width:${_ApplicationBtn[ProjectResource.styleMode].divWidth};
    height:${_ApplicationBtn[ProjectResource.styleMode].divHeight};
    line-height:${_ApplicationBtn[ProjectResource.styleMode].divLineHeight};
    color:${_ApplicationBtn[ProjectResource.styleMode].divColor};
    background:${_ApplicationBtn[ProjectResource.styleMode].divBackground};
    border-radius: 6px;
`;
*/


/******************************************************************/


export const SopSituationBox_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopSituationBox.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopSituationBox.yeosu;
    }
    return {};
}

export const _SopSituationBox = {
    busan: {
        divDisplay: 'flex',
        divWidth: '100%',
        divBackground: '#e8e8e8',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '100%',
        divBackground: '#e8e8e8',
    }
}


export const SopSituationBox = styled.div`
    display:${_SopSituationBox[ProjectResource.styleMode].divDisplay};
    width:${_SopSituationBox[ProjectResource.styleMode].divWidth};
    background:${_SopSituationBox[ProjectResource.styleMode].divBackground};
    color: #727272;
    border-bottom:solid 1px #d7d7d7;
    position:relative;

    /* flex-direction: column; */
    flex-direction: revert;
    &.active{
       background: #fff;
       border-left: solid 7px #19A5FF;
    }
`;


/*******************************************************************/


export const PersonIcon_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _PersonIcon.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _PersonIcon.yeosu;
    }
    return {};
}

export const _PersonIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '36px',
        divHeight: '18px',
        divBackground: 'url("../../../resource/image/sop/groupsPeople.png")no-repeat',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '36px',
        divHeight: '18px',
        divBackground: 'url("../../../resource/image/sop/groupsPeople.png")no-repeat',
    }
}


export const PersonIcon = styled.div`
    display:${_PersonIcon[ProjectResource.styleMode].divDisplay};
    width:${_PersonIcon[ProjectResource.styleMode].divWidth};
    height:${_PersonIcon[ProjectResource.styleMode].divHeight};
    background:${_PersonIcon[ProjectResource.styleMode].divBackground};
    margin-left: 10px;
    &:hover{
       
    },
    &.active{
       background: url("../../../resource/image/sop/groupsPeopleB.png")no-repeat;
    }

`;


/*******************************************************************/


export const SmallTri_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SmallTri.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SmallTri.yeosu;
    }
    return {};
}

export const _SmallTri = {
    busan: {

    },
    yeosu: {

    }
}


export const SmallTri = styled.div`
    width: 0;
    height: 0;
    border-bottom: 5px solid transparent;
    border-top: 5px solid transparent;
    border-left: 8px solid #727272;
    border-right: 8px solid transparent;
    transform: rotate( 180deg );
    margin-top: 10px;
   
`;


/*******************************************************************/



export const PersonDropBox_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _PersonDropBox.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _PersonDropBox.yeosu;
    }
    return {};
}

export const _PersonDropBox = {
    busan: {

    },
    yeosu: {

    }
}


export const PersonDropBox = styled.div`
     /* visibility: hidden; */
     width: 190px;
     height: 180px;
     border: solid 1.5px #727272;
     border-radius: 5px;
     background: #fff;
     color: #727272;
     padding: 10px;
     overflow-y:scroll;
     /* position:absolute;
     z-index:1; */ 
     > p{
         font-size: 12px;
         height: 30px;
         font-family:  'Pretendard';
     }
`;


/*******************************************************************/



export const SopCheckBox_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopCheckBox.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopCheckBox.yeosu;
    }
    return {};
}

export const _SopCheckBox = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '16px',
        divHeight: '16px',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '16px',
        divHeight: '16px',
    }
}


export const SopCheckBox = styled.div`
    display:${_SopCheckBox[ProjectResource.styleMode].divDisplay};
    width:${_SopCheckBox[ProjectResource.styleMode].divWidth};
    height:${_SopCheckBox[ProjectResource.styleMode].divHeight};
    border:solid 1.5px #808080;
    margin-right: 10px;
    &.active{
      color: #000000;
      border:solid 1.5px #000000;
    }
`;


/*******************************************************************/


export const SopSMSBtn_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopSMSBtn.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopSMSBtn.yeosu;
    }
    return {};
}

export const _SopSMSBtn = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '94px',
        divHeight: '30px',
        divBackground: 'url("../../../resource/image/sop/mailIcon.png")no-repeat',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '94px',
        divHeight: '30px',
        divBackground: 'url("../../../resource/image/sop/mailIcon.png")no-repeat',
    }
}


export const SopSMSBtn = styled.div`
    display:${_SopSMSBtn[ProjectResource.styleMode].divDisplay};
    width:${_SopSMSBtn[ProjectResource.styleMode].divWidth};
    height:${_SopSMSBtn[ProjectResource.styleMode].divHeight};
    background:${_SopSMSBtn[ProjectResource.styleMode].divBackground};
    background-color: #788396;
    border-radius: 6px;
    background-position: center center;
    /* margin-right: 8px; */
    cursor: pointer;
    &.active{
      background-color: #0D2348;
    }
`;


/********************************************************************/


export const SopEmailBtn_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopEmailBtn.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopEmailBtn.yeosu;
    }
    return {};
}

export const _SopEmailBtn = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '43px',
        divHeight: '30px',
        divBackground: 'url("../../../resource/image/sop/emailIcon.png")no-repeat',

    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '43px',
        divHeight: '30px',
        divBackground: 'url("../../../resource/image/sop/emailIcon.png")no-repeat',
    }
}


export const SopEmailBtn = styled.div`
    display:${_SopEmailBtn[ProjectResource.styleMode].divDisplay};
    width:${_SopEmailBtn[ProjectResource.styleMode].divWidth};
    height:${_SopEmailBtn[ProjectResource.styleMode].divHeight};
    background:${_SopEmailBtn[ProjectResource.styleMode].divBackground};
    background-color: #788396;
    border-radius: 6px;
    background-position: center center;
    cursor:pointer; 
    &.active{
      background-color: #0D2348;
    }
`;


/*******************************************************************/


export const SopProcessBox_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopProcessBox.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopProcessBox.yeosu;
    }
    return {};
}

export const _SopProcessBox = {
    busan: {
        divDisplay: 'flex',
        divWidth: '100%',
        divBackground: '#e8e8e8',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '100%',
        divBackground: '#e8e8e8',

    }
}


export const SopProcessBox = styled.div`
    display:${_SopProcessBox[ProjectResource.styleMode].divDisplay};
    width:${_SopProcessBox[ProjectResource.styleMode].divWidth};
    background:${_SopProcessBox[ProjectResource.styleMode].divBackground};
    flex-direction: initial;
    border-bottom:solid 1px #d7d7d7;
    color: #727272;
    position: relative;

    &.active{
       background: #fff;
       border-left: solid 7px #19A5FF;
   }
`


/*******************************************************************/


export const SopEndBox_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopEndBox.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopEndBox.yeosu;
    }
    return {};
}


export const _SopEndBox = {
    busan: {
        divDisplay: 'flex',
        divWidth: '100%',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '100%',
    }
}


export const SopEndBox = styled.div`
    display:${_SopEndBox[ProjectResource.styleMode].divDisplay};
    width:${_SopEndBox[ProjectResource.styleMode].divWidth};
    /* flex-direction: column; */
    flex-direction: revert;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;

    &.active{
       background: #fff;
       border-left: solid 7px #C00000;
    }
`;


/******************************************************************/


export const SopEndBtn_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopEndBtn.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopEndBtn.yeosu;
    }
    return {};
}

export const _SopEndBtn = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '94px',
        divHeight: '30px',
        divLineHeight: '30px',
        divColor: '#fff',
        divBackground: '#646778',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '94px',
        divHeight: '30px',
        divLineHeight: '30px',
        divColor: '#fff',
        divBackground: '#646778',
    }
}


export const SopEndBtn = styled.div`
    display:${_SopEndBtn[ProjectResource.styleMode].divDisplay};
    width:${_SopEndBtn[ProjectResource.styleMode].divWidth};
    height:${_SopEndBtn[ProjectResource.styleMode].divHeight};
    line-height:${_SopEndBtn[ProjectResource.styleMode].divLineHeight};
    color:${_SopEndBtn[ProjectResource.styleMode].divColor};
    background:${_SopEndBtn[ProjectResource.styleMode].divBackground};
    text-align:center;
    border-radius: 6px;
    margin: 0px 20px;
    &.active{
      background-color: #C00000;
      margin: 0px 20px;
   }
`;


/******************************************************************/


export const SopResultBox_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopResultBox.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopResultBox.yeosu;
    }
    return {};
}

export const _SopResultBox = {
    busan: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '30px',
        divLineHeight: '30px',
        divColor: '#fff',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '30px',
        divLineHeight: '30px',
        divColor: '#fff',
    }
}


export const SopResultBox = styled.div`
    display:${_SopResultBox[ProjectResource.styleMode].divDisplay};
    width:${_SopResultBox[ProjectResource.styleMode].divWidth};
    /* height:${_SopResultBox[ProjectResource.styleMode].divHeight}; */
    line-height:${_SopResultBox[ProjectResource.styleMode].divLineHeight};
    color:${_SopResultBox[ProjectResource.styleMode].divColor};
    margin-bottom: 20px;
    padding-top: 10px;
    border-top: solid 1px #d7d7d761;
    > span{
       display: block;
       font-size: 12px;
    }
`;


/******************************************************************/



export const SopMissonBox_ = () => {
    if (ProjectResource.styleMode === "busan") {
        return _SopMissonBox.busan;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _SopMissonBox.yeosu;
    }
    return {};
}

export const _SopMissonBox = {
    busan: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '38px',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '38px',
    }
}

export const SopMissonBox = styled.div`
     display:${_SopMissonBox[ProjectResource.styleMode].divDisplay};
     width:${_SopMissonBox[ProjectResource.styleMode].divWidth};
     /* height:${_SopMissonBox[ProjectResource.styleMode].divHeight}; */
     padding: 10px 30px;
     .missonFirst{
        width: 20px;
        height: 20px;
        line-height: 20px;
        background-color: #26395B;
        border-radius: 6px;
        margin-right: 6px;
     }
     .missonFirst:hover{
        background-color: #26395B;
        border-radius: 6px;
     }
     .missonSecond{
        width: 160px;
        display: flex;
        flex-direction: column;
        text-align: initial;
     }
     .missonSecond > span:nth-child(1){
        margin-bottom: 6px;
     }
     .missonSecond > span:nth-child(2){
        font-size: 12px;
     }
     .missonThird{
       display: inline-block;
       width: 40px;
       text-align: end;
     }
     &:hover{
       background-color: #225789;
     }
`

