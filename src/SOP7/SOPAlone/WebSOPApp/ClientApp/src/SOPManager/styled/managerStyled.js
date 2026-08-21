
import styled from 'styled-components';
import ProjectResource from '../../Root/resource/id';

/* image파일 import */
import Process from '../../SOPManager/image/process.png';
import Decision from '../../SOPManager/image/explanation.png';
import Annotation from '../../SOPManager/image/judgment.png';
import EndPoint from '../../SOPManager/image/startEnd.png';
import Internal from '../../SOPManager/image/internal.png';

import Undo from '../../SOPManager/image/undoIcon.png';
import Redo from '../../SOPManager/image/redoIcon.png';
import Copy from '../../SOPManager/image/copyIcon.png';
import Cut from '../../SOPManager/image/cutIcon.png';
import Paste from '../../SOPManager/image/pasteIcon.png';
import Del from '../../SOPManager/image/delIcon.png';
import FileOpen from '../../SOPManager/image/excelOpenIcon.png';
import FileSave from '../../SOPManager/image/excelSaveIcon.png';

import NewSopIconImage from '../../SOPManager/image/newSopIcon.png';
import SopOpenIconImage from '../../SOPManager/image/folderOpenIcon.png';
import FileOpenIconImage from '../../SOPManager/image/fileOpenIcon.png';
import sopSaveIcon_disabled from '../../SOPManager/image/sopSaveIcon_disabled.png';
import saveXMLIcon_disabled from '../../SOPManager/image/saveXMLIcon_disabled.png';


/* sopManager.jsx **********************************************/

export const SubAside_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SubAside.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SubAside.Busan;
    }
    return {};
}

export const _SubAside = {
    Cleannara: {
        divDisplay: 'block',
        divWidth: '60px',
        divHeight: '508px',
        divBackground: '#0D0D0D',
    },
    Busan: {
        divDisplay: 'block',
        divWidth: '60px',
        divHeight: '552px',
        divBackground: '#0D0D0D',
    }
}

export const SubAside = styled.div`
    display:${_SubAside[ProjectResource.styleMode].divDisplay};
    width:${_SubAside[ProjectResource.styleMode].divWidth};
    height:${_SubAside[ProjectResource.styleMode].divHeight};
    /* background:${_SubAside[ProjectResource.styleMode].divBackground}; */
    border-radius:10px;
    position: absolute;
    left: 0;
    top: -10px;
`;


/*sopManagerContent.jsx********************************************/
/******************************************************************/
/******************************************************************/
/******************************************************************/
/******************************************************************/


export const SopMLeft_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopMLeft.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopMLeft.Busan;
    }
    return {};
}

export const _SopMLeft = {
    Cleannara: {
        divWidth: '120px',
        divHeight: '100%',
    },
    Busan: {
        divWidth: '120px',
        divHeight: '100%',
    }
}

export const SopMLeft= styled.div`
    width:${_SopMLeft[ProjectResource.styleMode].divWidth};
    height:${_SopMLeft[ProjectResource.styleMode].divHeight};
    float: left;
`;


/********************************************************************/


export const SalMenu_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SalMenu.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SalMenu.Busan;
    }
    return {};
}

export const _SalMenu = {
    Cleannara: {
        divDisplay: 'block',
        divBackground: '#0D0D0D',
    },
    Busan: {
        divDisplay: 'block',
        divBackground: '#1A1A1A',
    }
}

export const SalMenu = styled.div`
    display:${_SalMenu[ProjectResource.styleMode].divDisplay};
    background:${_SalMenu[ProjectResource.styleMode].divBackground};

    dd > a > div {
        cursor: pointer;
    }
`;

/*********************************************************************/

export const SalCont_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SalCont.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SalCont.Busan;
    }
    return {};
}

export const _SalCont = {
    Cleannara: {
        divDisplay: 'block',
        divPaddingLeft: '30px',
        divBackground: '#0D0D0D',
    },
    Busan: {
        divDisplay: 'block',
        divPaddingLeft: '30px',
        divBackground: '#0D0D0D',
    }
}

export const SalCont = styled.div`
    display:${_SalCont[ProjectResource.styleMode].divDisplay};
    padding-left:${_SalCont[ProjectResource.styleMode].divPaddingLeft};
    /* background:${_SalCont[ProjectResource.styleMode].divBackground}; */
    position: relative;
`;

/*********************************************************************/


export const NewSOPIcon_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _NewSOPIcon.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _NewSOPIcon.Busan;
    }
    return {};
}

export const _NewSOPIcon = {
    Cleannara: {
        divDisplay: 'inline-block',
        divWidth: '44px',
        divHeight: '44px',
        divBackground: 'url(./../../resource/image/sopManager/newSopIcon.png) no-repeat center center;',
        divColor: '#215336',
    },
    Busan: {
        divDisplay: 'inline-block',
        divWidth: '44px',
        divHeight: '44px',
        divBackground: 'url(./../../resource/image/sopManager/newSopIcon.png) no-repeat center center;',
        divColor: '#215336',
    }
}

export const NewSOPIcon = styled.div`
    display:${_NewSOPIcon[ProjectResource.styleMode].divDisplay};
    width:${_NewSOPIcon[ProjectResource.styleMode].divWidth};
    height:${_NewSOPIcon[ProjectResource.styleMode].divHeight};
    background:${_NewSOPIcon[ProjectResource.styleMode].divBackground};
    color:${_NewSOPIcon[ProjectResource.styleMode].divColor};
    margin-bottom: 4px;
    font-size: 0px;
`;


/*********************************************************************/

export const SopOpenIcon_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopOpenIcon.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopOpenIcon.Busan;
    }
    return {};
}

export const _SopOpenIcon = {
    Cleannara: {
        divDisplay: 'inline-block',
        divWidth: '44px',
        divHeight: '44px',
        divBackground: 'url(./../../resource/image/sopManager/sopOpenIcon.png) no-repeat center center;',
        divColor: '#215336',
    },
    Busan: {
        divDisplay: 'inline-block',
        divWidth: '44px',
        divHeight: '44px',
        divBackground: 'url(./../../resource/image/sopManager/sopOpenIcon.png) no-repeat center center;',
        divColor: '#215336',
    }
}

export const SopOpenIcon = styled.div`
    display:${_SopOpenIcon[ProjectResource.styleMode].divDisplay};
    width:${_SopOpenIcon[ProjectResource.styleMode].divWidth};
    height:${_SopOpenIcon[ProjectResource.styleMode].divHeight};
    background:${_SopOpenIcon[ProjectResource.styleMode].divBackground};
    color:${_SopOpenIcon[ProjectResource.styleMode].divColor};
    margin-bottom: 4px;
    font-size: 0px;

`;


/*********************************************************************/


export const SopSaveIcon_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopSaveIcon.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopSaveIcon.Busan;
    }
    return {};
}

export const _SopSaveIcon = {
    Cleannara: {
        divDisplay: 'inline-block',
        divWidth: '44px',
        divHeight: '44px',
        divBackground: 'url(./../../resource/image/sopManager/sopSaveIcon.png) no-repeat center center;',
        divBackgroundDisabled: `url(${sopSaveIcon_disabled}) no-repeat center center`,
        divColor: '#215336',
    },
    Busan: {
        divDisplay: 'inline-block',
        divWidth: '44px',
        divHeight: '44px',
        divBackground: 'url(./../../resource/image/sopManager/sopSaveIcon.png) no-repeat center center;',
        divBackgroundDisabled: `url(${sopSaveIcon_disabled}) no-repeat center center`,
        divColor: '#215336',
    }
}

export const SopSaveIcon = styled.div`
    display:${_SopSaveIcon[ProjectResource.styleMode].divDisplay};
    width:${_SopSaveIcon[ProjectResource.styleMode].divWidth};
    height:${_SopSaveIcon[ProjectResource.styleMode].divHeight};
    background: ${(props) => props.$disabled === null ? _SopSaveIcon[ProjectResource.styleMode].divBackgroundDisabled : _SopSaveIcon[ProjectResource.styleMode].divBackground};
    color:${_SopSaveIcon[ProjectResource.styleMode].divColor};
    margin-bottom: 4px;
    font-size: 0px;
    cursor: ${(props) => props.$disabled === null ? 'default !important' : 'pointer'};
`;


/*********************************************************************/


export const SopSaveAsIcon_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopSaveAsIcon.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopSaveAsIcon.Busan;
    }
    return {};
}

export const _SopSaveAsIcon = {
    Cleannara: {
        divDisplay: 'inline-block',
        divWidth: '44px',
        divHeight: '44px',
        divBackground: 'url(./../../resource/image/sopManager/sopSaveAsIcon.png) no-repeat center center;',
        divColor: '#215336',
    },
    Busan: {
        divDisplay: 'inline-block',
        divWidth: '44px',
        divHeight: '44px',
        divBackground: 'url(./../../resource/image/sopManager/sopSaveAsIcon.png) no-repeat center center;',
        divColor: '#215336',
    }
}

export const SopSaveAsIcon = styled.div`
    display:${_SopSaveAsIcon[ProjectResource.styleMode].divDisplay};
    width:${_SopSaveAsIcon[ProjectResource.styleMode].divWidth};
    height:${_SopSaveAsIcon[ProjectResource.styleMode].divHeight};
    background:${_SopSaveAsIcon[ProjectResource.styleMode].divBackground};
    color:${_SopSaveAsIcon[ProjectResource.styleMode].divColor};
    margin-bottom: 4px;
    font-size: 0px;
`;


/*********************************************************************/

export const SopDeleteIcon_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopDeleteIcon.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopDeleteIcon.Busan;
    }
    return {};
}

export const _SopDeleteIcon = {
    Cleannara: {
        divDisplay: 'inline-block',
        divWidth: '44px',
        divHeight: '44px',
        divBackground: 'url(./../../resource/image/sopManager/sopTrashIcon.png) no-repeat center center;',
        divColor: '#215336',
    },
    Busan: {
        divDisplay: 'inline-block',
        divWidth: '44px',
        divHeight: '44px',
        divBackground: 'url(./../../resource/image/sopManager/sopTrashIcon.png) no-repeat center center;',
        divColor: '#215336',
    }
}

export const SopDeleteIcon = styled.div`
    display:${_SopDeleteIcon[ProjectResource.styleMode].divDisplay};
    width:${_SopDeleteIcon[ProjectResource.styleMode].divWidth};
    height:${_SopDeleteIcon[ProjectResource.styleMode].divHeight};
    background:${_SopDeleteIcon[ProjectResource.styleMode].divBackground};
    color:${_SopDeleteIcon[ProjectResource.styleMode].divColor};
    margin-bottom: 4px;
    font-size: 0px;
`;


/*********************************************************************/

export const SopOpenXMLIcon_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopOpenXMLIcon.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopOpenXMLIcon.Busan;
    }
    return {};
}

export const _SopOpenXMLIcon = {
    Cleannara: {
        divDisplay: 'inline-block',
        divWidth: '44px',
        divHeight: '44px',
        divBackground: 'url(./../../resource/image/sopManager/openXMLIcon.png) no-repeat center center;',
        divColor: '#215336',
    },
    Busan: {
        divDisplay: 'inline-block',
        divWidth: '44px',
        divHeight: '44px',
        divBackground: 'url(./../../resource/image/sopManager/openXMLIcon.png) no-repeat center center;',
        divColor: '#215336',
    }
}

export const SopOpenXMLIcon = styled.div`
    display:${_SopOpenXMLIcon[ProjectResource.styleMode].divDisplay};
    width:${_SopOpenXMLIcon[ProjectResource.styleMode].divWidth};
    height:${_SopOpenXMLIcon[ProjectResource.styleMode].divHeight};
    background:${_SopOpenXMLIcon[ProjectResource.styleMode].divBackground};
    color:${_SopOpenXMLIcon[ProjectResource.styleMode].divColor};
    margin-bottom: 4px;
    font-size: 0px;
`;


/*********************************************************************/


export const SopSaveXMLIcon_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopSaveXMLIcon.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopSaveXMLIcon.Busan;
    }
    return {};
}

export const _SopSaveXMLIcon = {
    Cleannara: {
        divDisplay: 'inline-block',
        divWidth: '44px',
        divHeight: '44px',
        divBackground: 'url(./../../resource/image/sopManager/saveXMLIcon.png) no-repeat center center;',
        divBackgroundDisabled: `url(${saveXMLIcon_disabled}) no-repeat center center`,
        divColor: '#215336',
    },
    Busan: {
        divDisplay: 'inline-block',
        divWidth: '44px',
        divHeight: '44px',
        divBackground: 'url(./../../resource/image/sopManager/saveXMLIcon.png) no-repeat center center;',
        divBackgroundDisabled: `url(${saveXMLIcon_disabled}) no-repeat center center`,
        divColor: '#215336',
    }
}

export const SopSaveXMLIcon = styled.div`
    display:${_SopSaveXMLIcon[ProjectResource.styleMode].divDisplay};
    width:${_SopSaveXMLIcon[ProjectResource.styleMode].divWidth};
    height:${_SopSaveXMLIcon[ProjectResource.styleMode].divHeight};
    background: ${(props) => props.$disabled === null ? _SopSaveXMLIcon[ProjectResource.styleMode].divBackgroundDisabled : _SopSaveXMLIcon[ProjectResource.styleMode].divBackground};
    color:${_SopSaveXMLIcon[ProjectResource.styleMode].divColor};
    margin-bottom: 4px;
    font-size: 0px;
    cursor: ${(props) => props.$disabled === null ? 'default !important' : 'pointer'};
`;



/*sopManagerBodyMain.jsx*********************************************/
/*********************************************************************/
/*********************************************************************/
/*********************************************************************/
/*********************************************************************/


export const SopProcessWrap_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopProcessWrap.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopProcessWrap.Busan;
    }
    return {};
}

export const _SopProcessWrap = {
    Cleannara: {
        divDisplay: 'block',
        divHeight: '100%',
        divBackground: '#0D0D0D',
        divPaddingLeft: '320px',
        divPaddingRight: '360px',
    },
    Busan: {
        divDisplay: 'block',
        divHeight: '100%',
        divBackground: '#0D0D0D',
        divPaddingLeft: '320px',
        divPaddingRight: '360px',
    }
}

export const SopProcessWrap = styled.div`
    display:${_SopProcessWrap[ProjectResource.styleMode].divDisplay};
    height:${_SopProcessWrap[ProjectResource.styleMode].divHeight};
    background:${_SopProcessWrap[ProjectResource.styleMode].divBackground};
    padding-left:${_SopProcessWrap[ProjectResource.styleMode].divPaddingLeft};
    padding-right:${_SopProcessWrap[ProjectResource.styleMode].divPaddingRight};
    position: relative;
    overflow: hidden;
`;


/*********************************************************************/


export const SopProcessLeft_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopProcessLeft.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopProcessLeft.Busan;
    }
    return {};
}

export const _SopProcessLeft = {
    Cleannara: {
        divDisplay: 'block',
        divWidth: '303px',
        divHeight: '100%',
        divBackground: '#202020',
        divBorderRadius: '6px',
    },
    Busan: {
        divDisplay: 'block',
        divWidth: '303px',
        divHeight: '100%',
        divBackground: '#202020',
        divBorderRadius: '6px',
    }
}

export const SopProcessLeft = styled.div`
    display:${_SopProcessLeft[ProjectResource.styleMode].divDisplay};
    width:${_SopProcessLeft[ProjectResource.styleMode].divWidth};
    height:${_SopProcessLeft[ProjectResource.styleMode].divHeight};
    background:${_SopProcessLeft[ProjectResource.styleMode].divBackground};
    border-radius:${_SopProcessLeft[ProjectResource.styleMode].divBorderRadius};
    position: absolute;
    left: 0;
    top: 0;

`;


/*********************************************************************/


export const SopAcdn_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopAcdn.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopAcdn.Busan;
    }
    return {};
}

export const _SopAcdn = {
    Cleannara: {
        divDisplay: 'block',
        divWidth: '303px',
        divHeight: '880px',
        divBackground: '#202020',
        divBorderRadius: '6px',
    },
    Busan: {
        divDisplay: 'block',
        divWidth: '303px',
        divHeight: '880px',
        divBackground: '#202020',
        divBorderRadius: '6px',
    }
}

export const SopAcdn = styled.div`
    display:${_SopAcdn[ProjectResource.styleMode].divDisplay};
    width:${_SopAcdn[ProjectResource.styleMode].divWidth};
    height:${_SopAcdn[ProjectResource.styleMode].divHeight};
    background:${_SopAcdn[ProjectResource.styleMode].divBackground};
    border-radius:${_SopAcdn[ProjectResource.styleMode].divBorderRadius};
`;


/*********************************************************************/


export const SopAcdnDt_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopAcdnDt.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopAcdnDt.Busan;
    }
    return {};
}

export const _SopAcdnDt = {
    Cleannara: {
        divDisplay: 'block',
        divHeight: '56px',
        divlineHeight: '56px',
        divBackground: '#343434',
        divPadding: '0 15px',
        divFontSize: '16px',
        divColor: '#fff',
        divFontWeight: 'bold',
    },
    Busan: {
        divDisplay: 'block',
        divHeight: '56px',
        divlineHeight: '56px',
        divBackground: '#343434',
        divPadding: '0 15px',
        divFontSize: '16px',
        divColor: '#fff',
        divFontWeight: 'bold',
    }
}

export const SopAcdnDt = styled.div`
    display:${_SopAcdnDt[ProjectResource.styleMode].divDisplay};
    height:${_SopAcdnDt[ProjectResource.styleMode].divHeight};
    line-height:${_SopAcdnDt[ProjectResource.styleMode].divlineHeight};
    /* background:${_SopAcdnDt[ProjectResource.styleMode].divBackground}; */
    padding:${_SopAcdnDt[ProjectResource.styleMode].divPadding};
    font-size:${_SopAcdnDt[ProjectResource.styleMode].divFontSize};
    color:${_SopAcdnDt[ProjectResource.styleMode].divColor};
    font-weight:${_SopAcdnDt[ProjectResource.styleMode].divFontWeight};
    &:hover{
        background: #343434;
    }
    position: relative;
    &:after{
        content: '';
        display: block;
        width: 18px;
        height: 13px;
        position: absolute;
        right: 15px;
        top: 50%;
        margin-top: -4px;
        background: url('./../../resource/image/sopManager/sopMenuArrowDown.png')no-repeat center bottom;
        background-size: 100% auto;
    }
    &:last-child{
        border-top: none;
    }
    &.on{
        background: #e0e6ff;
    }
    > .last {
        border-bottom: solid 1px #8fb1f2;
    }
`;


/*********************************************************************/


export const SopAcdnDD_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopAcdnDD.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopAcdnDD.Busan;
    }
    return {};
}

export const _SopAcdnDD = {
    Cleannara: {
        divPadding: '15px',
        divBackground: '#282828',
    },
    Busan: {
        divPadding: '15px',
        divBackground: '#202020',
    }
}

export const SopAcdnDD = styled.div`
    display:${_SopAcdnDD[ProjectResource.styleMode].divDisplay};
    padding:${_SopAcdnDD[ProjectResource.styleMode].divPadding};
    background:${_SopAcdnDD[ProjectResource.styleMode].divBackground};
    /* display: none; */
    &.on{
       display: block;
    }
`;

/*********************************************************************/


export const SopEdt1_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopEdt1.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopEdt1.Busan;
    }
    return {};
}

export const _SopEdt1 = {
    Cleannara: {
        divDisplay: 'block',
        divHeight: '110px',
    },
    Busan: {
        divDisplay: 'block',
        divHeight: '110px',
    }
}

export const SopEdt1 = styled.div`
    display:${_SopEdt1[ProjectResource.styleMode].divDisplay};
    height:${_SopEdt1[ProjectResource.styleMode].divHeight};
    
`;


/*********************************************************************/


export const SopEdtTitle_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopEdtTitle.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopEdtTitle.Busan;
    }
    return {};
}

export const _SopEdtTitle = {
    Cleannara: {
        divDisplay: 'block',
        divMarginBottom: '10px',
    },
    Busan: {
        divDisplay: 'block',
        divMarginBottom: '10px',
    }
}

export const SopEdtTitle = styled.div`
    display:${_SopEdtTitle[ProjectResource.styleMode].divDisplay};
    margin-bottom:${_SopEdtTitle[ProjectResource.styleMode].divMarginBottom};
    &:after{
       content: '';
       display: table;
       clear: both;
    }
    > span{
       display: block;
       width: 64px;
       height: 25px;
       line-height: 25px;
       text-align: center;
       float: left;
       color: #fff;
       font-size: 14px;
       font-weight: 500;
       margin-right: 10px;
       border-radius: 19px;
       -moz-border-radius: 19px;
       -webkit-border-radius: 19px;
       background: #007BCC;
   } 
    
   > h4{
       float: left;
       height: 30px;
       line-height: 30px;
       font-size: 20px;
       font-weight: 700;
   }
`;


/*********************************************************************/


export const SopEdtRdo_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopEdtRdo.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopEdtRdo.Busan;
    }
    return {};
}

export const _SopEdtRdo = {
    Cleannara: {
        divDisplay: 'block',
        divPaddingBottom: '30px',
    },
    Busan: {
        divDisplay: 'block',
        divPaddingBottom: '30px',
    }
}

export const SopEdtRdo = styled.div`
    display:${_SopEdtRdo[ProjectResource.styleMode].divDisplay};
    padding-bottom:${_SopEdtRdo[ProjectResource.styleMode].divPaddingBottom};
    > li{
        float: left;
    }
    > li > label{
        color: #fff;
        font-size: 12px;
        font-weight: 400;
        margin-right: 20px;
    }
`;


/*********************************************************************/


export const SopEdtRdo2_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopEdtRdo2.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopEdtRdo2.Busan;
    }
    return {};
}

export const _SopEdtRdo2 = {
    Cleannara: {
        divDisplay: 'block',
        divPaddingTop: '10px',
    },
    Busan: {
        divDisplay: 'block',
        divPaddingTop: '10px',
    }
}

export const SopEdtRdo2 = styled.div`
    display:${_SopEdtRdo2[ProjectResource.styleMode].divDisplay};
    padding-top:${_SopEdtRdo2[ProjectResource.styleMode].divPaddingTop};
    border-top: dashed 0.5px #707070;
    > li{
        float: left;
    }
    > li > label{
        width: 64px;
        height: 25px;
        line-height: 22px;
        color: #fff;
        font-size: 12px;
        font-weight: 400;
        margin-right: 20px;
        border: solid 1px #707070;
    }
`;

/*********************************************************************/


export const SopEdt2_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopEdt2.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopEdt2.Busan;
    }
    return {};
}

export const _SopEdt2 = {
    Cleannara: {
        divDisplay: 'block',
        divHeight: '350px',
    },
    Busan: {
        divDisplay: 'block',
        divHeight: '350px',
    }
}

export const SopEdt2 = styled.div`
    display:${_SopEdt2[ProjectResource.styleMode].divDisplay};
    height:${_SopEdt2[ProjectResource.styleMode].divHeight};
    overflow-y: scroll;
    &::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        border-radius: 3px;
        background-color: #282828;
    }
    &::-webkit-scrollbar-thumb {
        width: 3px;
        border-radius: 3px;
        background: #21EA74;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
    
`;


/*********************************************************************/


export const SopEdtCpnt_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopEdtCpnt.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopEdtCpnt.Busan;
    }
    return {};
}

export const _SopEdtCpnt = {
    Cleannara: {
        divDisplay: 'block',
    },
    Busan: {
        divDisplay: 'block',
    }
}

export const SopEdtCpnt = styled.div`
    display:${_SopEdtCpnt[ProjectResource.styleMode].divDisplay};
    text-align: center;
    > li{
        margin-bottom: 10px;
        border-bottom: dashed 1px #707070;
        padding: 10px 0px 20px 0px;
    }
    > li:last-child{
        border: none;
    }
`;

/*********************************************************************/


export const ProcessShape_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _ProcessShape.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _ProcessShape.Busan;
    }
    return {};
}

export const _ProcessShape = {
    Cleannara: {
        divDisplay: 'inline-block',
        divWidth: '174px',
        divHeight: '53px',
    },
    Busan: {
        divDisplay: 'inline-block',
        divWidth: '174px',
        divHeight: '53px',
    }
}

export const ProcessShape = styled.div`
    display:${_ProcessShape[ProjectResource.styleMode].divDisplay};
    width:${_ProcessShape[ProjectResource.styleMode].divWidth};
    height:${_ProcessShape[ProjectResource.styleMode].divHeight};
    background: url(${ Process }) no-repeat;
`;

/*********************************************************************/


export const DecisionShape_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _DecisionShape.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _DecisionShape.Busan;
    }
    return {};
}

export const _DecisionShape = {
    Cleannara: {
        divDisplay: 'inline-block',
        divWidth: '174px',
        divHeight: '59px',
    },
    Busan: {
        divDisplay: 'inline-block',
        divWidth: '174px',
        divHeight: '59px',
    }
}

export const DecisionShape = styled.div`
    display:${_DecisionShape[ProjectResource.styleMode].divDisplay};
    width:${_DecisionShape[ProjectResource.styleMode].divWidth};
    height:${_DecisionShape[ProjectResource.styleMode].divHeight};
    background: url(${ Decision }) no-repeat;
`;


/*********************************************************************/


export const AnnotationShape_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _AnnotationShape.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _AnnotationShape.Busan;
    }
    return {};
}

export const _AnnotationShape = {
    Cleannara: {
        divDisplay: 'inline-block',
        divWidth: '166px',
        divHeight: '70px',
    },
    Busan: {
        divDisplay: 'inline-block',
        divWidth: '166px',
        divHeight: '70px',
    }
}

export const AnnotationShape = styled.div`
    display:${_AnnotationShape[ProjectResource.styleMode].divDisplay};
    width:${_AnnotationShape[ProjectResource.styleMode].divWidth};
    height:${_AnnotationShape[ProjectResource.styleMode].divHeight};
    background: url(${ Annotation }) no-repeat;
`;


/*********************************************************************/


export const EndpointShape_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _EndpointShape.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _EndpointShape.Busan;
    }
    return {};
}

export const _EndpointShape = {
    Cleannara: {
        divDisplay: 'inline-block',
        divWidth: '174px',
        divHeight: '53px',
    },
    Busan: {
        divDisplay: 'inline-block',
        divWidth: '174px',
        divHeight: '53px',
    }
}

export const EndpointShape = styled.div`
    display:${_EndpointShape[ProjectResource.styleMode].divDisplay};
    width:${_EndpointShape[ProjectResource.styleMode].divWidth};
    height:${_EndpointShape[ProjectResource.styleMode].divHeight};
    background: url(${ EndPoint }) no-repeat;
`;

/*********************************************************************/


export const InternalShape_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _InternalShape.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _InternalShape.Busan;
    }
    return {};
}

export const _InternalShape = {
    Cleannara: {
        divDisplay: 'inline-block',
        divWidth: '174px',
        divHeight: '53px',
    },
    Busan: {
        divDisplay: 'inline-block',
        divWidth: '174px',
        divHeight: '53px',
    }
}

export const InternalShape = styled.div`
    display:${_InternalShape[ProjectResource.styleMode].divDisplay};
    width:${_InternalShape[ProjectResource.styleMode].divWidth};
    height:${_InternalShape[ProjectResource.styleMode].divHeight};
    background: url(${ Internal }) no-repeat;
`;


/*********************************************************************/


export const SopEdt3_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopEdt3.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopEdt3.Busan;
    }
    return {};
}

export const _SopEdt3 = {
    Cleannara: {
        divDisplay: 'block',
        divHeight: '350px',
    },
    Busan: {
        divDisplay: 'block',
        divHeight: '350px',
    }
}

export const SopEdt3 = styled.div`
    display:${_SopEdt3[ProjectResource.styleMode].divDisplay};
    /* height:${_SopEdt3[ProjectResource.styleMode].divHeight}; */
    > textarea{
        background: #202020;
        color: #fff;
    }
    overflow-y: scroll;
    &::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        border-radius: 3px;
        background-color: #282828;
    }
    &::-webkit-scrollbar-thumb {
        width: 3px;
        border-radius: 3px;
        background: #21EA74;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
    
`;


/*********************************************************************/


export const SopEdtTpy_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopEdtTpy.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopEdtTpy.Busan;
    }
    return {};
}

export const _SopEdtTpy = {
    Cleannara: {
        divDisplay: 'block',
        divPaddingLeft: '70px',
        divMarginBottom: '10px',
    },
    Busan: {
        divDisplay: 'block',
        divPaddingLeft: '70px',
        divMarginBottom: '10px',
    }
}

export const SopEdtTpy = styled.div`
    display:${_SopEdtTpy[ProjectResource.styleMode].divDisplay};
    padding-left:${_SopEdtTpy[ProjectResource.styleMode].divPaddingLeft};
    margin-bottom:${_SopEdtTpy[ProjectResource.styleMode].divMarginBottom};
    position: relative;
    > span{
        display: block;
        height: 40px;
        line-height: 40px;
        position: absolute;
        left: 0;
        top: 0;
        font-size: 14px;
        color: #fff;
    }
    > select{
        display: block;
        width: 100%;
        background: #202020;
        border: solid 1px #707070;
        color: #fff;
    }
    > select > option{
        color: #fff;
    }
`;

/*********************************************************************/


export const SopCent_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopCent.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopCent.Busan;
    }
    return {};
}

export const _SopCent = {
    Cleannara: {
        divDisplay: 'block',
        divHeight: '100%',
        divPaddingTop: '40px',

    },
    Busan: {
        divDisplay: 'block',
        divHeight: '100%',
        divPaddingTop: '40px',
    }
}

export const SopCent = styled.div`
    display:${_SopCent[ProjectResource.styleMode].divDisplay};
    height:${_SopCent[ProjectResource.styleMode].divHeight};
    padding-top:${_SopCent[ProjectResource.styleMode].divPaddingTop};
    border-radius: 4px;
    position: relative;

`;


/*********************************************************************/

export const SpcTop_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SpcTop.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SpcTop.Busan;
    }
    return {};
}

export const _SpcTop = {
    Cleannara: {
        divDisplay: 'block',
        divBackground: '#343434',
        divHeight: '46px',
        divColor: '#21EA74',
        divFontSize: '16px',
        divPaddingTop: '6px',

    },
    Busan: {
        divDisplay: 'block',
        divBackground: '#343434',
        divHeight: '46px',
        divColor: '#21EA74',
        divFontSize: '16px',
        divPaddingTop: '6px',
    }
}

export const SpcTop = styled.div`
    display:${_SpcTop[ProjectResource.styleMode].divDisplay};
    background:${_SpcTop[ProjectResource.styleMode].divBackground};
    height:${_SpcTop[ProjectResource.styleMode].divHeight};
    padding-top:${_SpcTop[ProjectResource.styleMode].divPaddingTop};
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    > li{
       display: flex;
       justify-content: center;
       float: left;
       width: 16.6%;
       border-right: dashed 1px #707070;
    }
    > li:last-child{
       border-right: none;
    }
    > li > span{
       /* width: 100%; */
       line-height: 30px;
       color:${_SpcTop[ProjectResource.styleMode].divColor};
       font-size:${_SpcTop[ProjectResource.styleMode].divFontSize};
       font-family: 'Spoqa Han Sans Neo', 'sans-serif';
       cursor: pointer;
    }
`;

/*********************************************************************/

export const SopTopUndo_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopTopUndo.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopTopUndo.Busan;
    }
    return {};
}

export const _SopTopUndo = {
    Cleannara: {
        divDisplay: 'block',
        divWidth: '30px',
        divHeight: '30px',
        divLineHeight: '30px',
        divBackground: '#424242',
        divColor: '#21EA74',
        divFontSize: '16px',
        divMarginRight: '4px',

    },
    Busan: {
        divDisplay: 'block',
        divWidth: '30px',
        divHeight: '30px',
        divLineHeight: '30px',
        divBackground: '#424242',
        divColor: '#21EA74',
        divFontSize: '16px',
        divMarginRight: '4px',
    }
}

export const SopTopUndo = styled.div`
    display:${_SopTopUndo[ProjectResource.styleMode].divDisplay};
    width:${_SopTopUndo[ProjectResource.styleMode].divWidth};
    height:${_SopTopUndo[ProjectResource.styleMode].divHeight};
    line-height:${_SopTopUndo[ProjectResource.styleMode].divLineHeight};
    background:${_SopTopUndo[ProjectResource.styleMode].divBackground};
    color:${_SopTopUndo[ProjectResource.styleMode].divColor};
    font-size:${_SopTopUndo[ProjectResource.styleMode].divFontSize};
    margin-right:${_SopTopUndo[ProjectResource.styleMode].divMarginRight};
    text-align: center;
    background: url(${ Undo }) no-repeat center center;
    font-family: 'Spoqa Han Sans Neo', 'sans-serif';
    cursor: pointer;

`;

/*********************************************************************/

export const SopTopRedo_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopTopRedo.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopTopRedo.Busan;
    }
    return {};
}

export const _SopTopRedo = {
    Cleannara: {
        divDisplay: 'block',
        divWidth: '30px',
        divHeight: '30px',
        divLineHeight: '30px',
        divBackground: '#424242',
        divColor: '#21EA74',
        divFontSize: '16px',
        divMarginRight: '4px',

    },
    Busan: {
        divDisplay: 'block',
        divWidth: '30px',
        divHeight: '30px',
        divLineHeight: '30px',
        divBackground: '#424242',
        divColor: '#21EA74',
        divFontSize: '16px',
        divMarginRight: '4px',
    }
}

export const SopTopRedo = styled.div`
    display:${_SopTopRedo[ProjectResource.styleMode].divDisplay};
    width:${_SopTopRedo[ProjectResource.styleMode].divWidth};
    height:${_SopTopRedo[ProjectResource.styleMode].divHeight};
    line-height:${_SopTopRedo[ProjectResource.styleMode].divLineHeight};
    background:${_SopTopRedo[ProjectResource.styleMode].divBackground};
    color:${_SopTopRedo[ProjectResource.styleMode].divColor};
    font-size:${_SopTopRedo[ProjectResource.styleMode].divFontSize};
    margin-right:${_SopTopRedo[ProjectResource.styleMode].divMarginRight};
    text-align: center;
    background: url(${ Redo }) no-repeat center center;
    cursor: pointer;

`;

/*********************************************************************/

export const SopTopCopy_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopTopCopy.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopTopCopy.Busan;
    }
    return {};
}

export const _SopTopCopy = {
    Cleannara: {
        divDisplay: 'block',
        divWidth: '30px',
        divHeight: '30px',
        divLineHeight: '30px',
        divBackground: '#424242',
        divColor: '#21EA74',
        divFontSize: '16px',
        divMarginRight: '4px',

    },
    Busan: {
        divDisplay: 'block',
        divWidth: '30px',
        divHeight: '30px',
        divLineHeight: '30px',
        divBackground: '#424242',
        divColor: '#21EA74',
        divFontSize: '16px',
        divMarginRight: '4px',
    }
}

export const SopTopCopy = styled.div`
    display:${_SopTopCopy[ProjectResource.styleMode].divDisplay};
    width:${_SopTopCopy[ProjectResource.styleMode].divWidth};
    height:${_SopTopCopy[ProjectResource.styleMode].divHeight};
    line-height:${_SopTopCopy[ProjectResource.styleMode].divLineHeight};
    background:${_SopTopCopy[ProjectResource.styleMode].divBackground};
    color:${_SopTopCopy[ProjectResource.styleMode].divColor};
    font-size:${_SopTopCopy[ProjectResource.styleMode].divFontSize};
    margin-right:${_SopTopCopy[ProjectResource.styleMode].divMarginRight};
    text-align: center;
    background: url(${ Copy }) no-repeat center center;
    cursor: pointer;
`;

/*********************************************************************/

export const SopTopCut_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopTopCut.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopTopCut.Busan;
    }
    return {};
}

export const _SopTopCut = {
    Cleannara: {
        divDisplay: 'block',
        divWidth: '30px',
        divHeight: '30px',
        divLineHeight: '30px',
        divBackground: '#424242',
        divColor: '#21EA74',
        divFontSize: '16px',
        divMarginRight: '4px',

    },
    Busan: {
        divDisplay: 'block',
        divWidth:'30px',
        divHeight: '30px',
        divLineHeight: '30px',
        divBackground: '#424242',
        divColor: '#21EA74',
        divFontSize: '16px',
        divMarginRight: '4px',
    }
}

export const SopTopCut = styled.div`
    display:${_SopTopCut[ProjectResource.styleMode].divDisplay};
    width:${_SopTopCut[ProjectResource.styleMode].divWidth};
    height:${_SopTopCut[ProjectResource.styleMode].divHeight};
    line-height:${_SopTopCut[ProjectResource.styleMode].divLineHeight};
    background:${_SopTopCut[ProjectResource.styleMode].divBackground};
    color:${_SopTopCut[ProjectResource.styleMode].divColor};
    font-size:${_SopTopCut[ProjectResource.styleMode].divFontSize};
    margin-right:${_SopTopCut[ProjectResource.styleMode].divMarginRight};
    text-align: center;
    background: url(${ Cut }) no-repeat center center;
    cursor: pointer;

`;

/*********************************************************************/

export const SopTopPaste_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopTopPaste.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopTopPaste.Busan;
    }
    return {};
}

export const _SopTopPaste = {
    Cleannara: {
        divDisplay: 'block',
        divWidth: '30px',
        divHeight: '30px',
        divLineHeight: '30px',
        divBackground: '#424242',
        divColor: '#21EA74',
        divFontSize: '16px',
        divMarginRight: '4px',

    },
    Busan: {
        divDisplay: 'block',
        divWidth: '30px',
        divHeight: '30px',
        divLineHeight: '30px',
        divBackground: '#424242',
        divColor: '#21EA74',
        divFontSize: '16px',
        divMarginRight: '4px',
    }
}

export const SopTopPaste = styled.div`
    display:${_SopTopPaste[ProjectResource.styleMode].divDisplay};
    width:${_SopTopPaste[ProjectResource.styleMode].divWidth};
    height:${_SopTopPaste[ProjectResource.styleMode].divHeight};
    line-height:${_SopTopPaste[ProjectResource.styleMode].divLineHeight};
    background:${_SopTopPaste[ProjectResource.styleMode].divBackground};
    color:${_SopTopPaste[ProjectResource.styleMode].divColor};
    font-size:${_SopTopPaste[ProjectResource.styleMode].divFontSize};
    margin-right:${_SopTopPaste[ProjectResource.styleMode].divMarginRight};
    text-align: center;
    background: url(${ Paste }) no-repeat center center;
    cursor: pointer;

`;

/*********************************************************************/

export const SopTopDel_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopTopDel.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopTopDel.Busan;
    }
    return {};
}

export const _SopTopDel = {
    Cleannara: {
        divDisplay: 'block',
        divWidth: '30px',
        divHeight: '30px',
        divLineHeight: '30px',
        divBackground: '#424242',
        divColor: '#21EA74',
        divFontSize: '16px',
        divMarginRight: '4px',

    },
    Busan: {
        divDisplay: 'block',
        divWidth: '30px',
        divHeight: '30px',
        divLineHeight: '30px',
        divBackground: '#424242',
        divColor: '#21EA74',
        divFontSize: '16px',
        divMarginRight: '4px',
    }
}

export const SopTopDel = styled.div`
    display:${_SopTopDel[ProjectResource.styleMode].divDisplay};
    width:${_SopTopDel[ProjectResource.styleMode].divWidth};
    height:${_SopTopDel[ProjectResource.styleMode].divHeight};
    line-height:${_SopTopDel[ProjectResource.styleMode].divLineHeight};
    background:${_SopTopDel[ProjectResource.styleMode].divBackground};
    color:${_SopTopDel[ProjectResource.styleMode].divColor};
    font-size:${_SopTopDel[ProjectResource.styleMode].divFontSize};
    margin-right:${_SopTopDel[ProjectResource.styleMode].divMarginRight};
    text-align: center;
    background: url(${ Del }) no-repeat center center;
    cursor: pointer;

`;

/*********************************************************************/

export const SopTopFileOpen_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopTopFileOpen.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopTopFileOpen.Busan;
    }
    return {};
}

export const _SopTopFileOpen = {
    Cleannara: {
        divDisplay: 'block',
        divWidth: '30px',
        divHeight: '30px',
        divLineHeight: '30px',
        divBackground: '#424242',
        divColor: '#21EA74',
        divFontSize: '16px',
        divMarginRight: '4px',

    },
    Busan: {
        divDisplay: 'block',
        divWidth: '30px',
        divHeight: '30px',
        divLineHeight: '30px',
        divBackground: '#424242',
        divColor: '#21EA74',
        divFontSize: '16px',
        divMarginRight: '4px',
    }
}

export const SopTopFileOpen = styled.div`
    display:${_SopTopFileOpen[ProjectResource.styleMode].divDisplay};
    width:${_SopTopFileOpen[ProjectResource.styleMode].divWidth};
    height:${_SopTopFileOpen[ProjectResource.styleMode].divHeight};
    line-height:${_SopTopFileOpen[ProjectResource.styleMode].divLineHeight};
    background:${_SopTopFileOpen[ProjectResource.styleMode].divBackground};
    color:${_SopTopFileOpen[ProjectResource.styleMode].divColor};
    font-size:${_SopTopFileOpen[ProjectResource.styleMode].divFontSize};
    margin-right:${_SopTopFileOpen[ProjectResource.styleMode].divMarginRight};
    text-align: center;
    background: url(${ FileOpen }) no-repeat center center;
    cursor: pointer;

`;

/*********************************************************************/

export const SopTopFileSave_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopTopFileSave.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopTopFileSave.Busan;
    }
    return {};
}

export const _SopTopFileSave = {
    Cleannara: {
        divDisplay: 'block',
        divWidth: '30px',
        divHeight: '30px',
        divLineHeight: '30px',
        divBackground: '#424242',
        divColor: '#21EA74',
        divFontSize: '16px',
        divMarginRight: '4px',

    },
    Busan: {
        divDisplay: 'block',
        divWidth: '30px',
        divHeight: '30px',
        divLineHeight: '30px',
        divBackground: '#424242',
        divColor: '#21EA74',
        divFontSize: '16px',
        divMarginRight: '4px',
    }
}

export const SopTopFileSave = styled.div`
    display:${_SopTopFileSave[ProjectResource.styleMode].divDisplay};
    width:${_SopTopFileSave[ProjectResource.styleMode].divWidth};
    height:${_SopTopFileSave[ProjectResource.styleMode].divHeight};
    line-height:${_SopTopFileSave[ProjectResource.styleMode].divLineHeight};
    background:${_SopTopFileSave[ProjectResource.styleMode].divBackground};
    color:${_SopTopFileSave[ProjectResource.styleMode].divColor};
    font-size:${_SopTopFileSave[ProjectResource.styleMode].divFontSize};
    margin-right:${_SopTopFileSave[ProjectResource.styleMode].divMarginRight};
    text-align: center;
    background: url(${ FileSave }) no-repeat center center;
    cursor: pointer;
`;


/*********************************************************************/

export const SpcWrap_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SpcWrap.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SpcWrap.Busan;
    }
    return {};
}

export const _SpcWrap = {
    Cleannara: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '100%',
        divBackground: '#202020',
        divPaddingLeft: '20px',
        divPaddingRight: '20px',
        divBorderRadius: '4px',

    },
    Busan: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '100%',
        divBackground: '#343434',
        divPaddingLeft: '20px',
        divPaddingRight: '20px',
        divBorderRadius: '4px',
    }
}

export const SpcWrap = styled.div`
    display:${_SpcWrap[ProjectResource.styleMode].divDisplay};
    width:${_SpcWrap[ProjectResource.styleMode].divWidth};
    height:${_SpcWrap[ProjectResource.styleMode].divHeight};
    background:${_SpcWrap[ProjectResource.styleMode].divBackground};
    padding-left:${_SpcWrap[ProjectResource.styleMode].divPaddingLeft};
    padding-right:${_SpcWrap[ProjectResource.styleMode].divPaddingRight};
    border-radius:${_SpcWrap[ProjectResource.styleMode].divBorderRadius};

`;


/*********************************************************************/

export const SopTitle_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopTitle.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopTitle.Busan;
    }
    return {};
}

export const _SopTitle = {
    Cleannara: {
        divDisplay: 'block',
        divHeight: '50px',
        divLineHeight: '50px',
        divBackground: '#202020',
        divColor: '#21EA74',
        divFontSize: '18px',

    },
    Busan: {
        divDisplay: 'block',
        divHeight: '50px',
        divLineHeight: '50px',
        divBackground: '#424242',
        divColor: '#21EA74',
        divFontSize: '18px',
    }
}

export const SopTitle = styled.div`
    display:${_SopTitle[ProjectResource.styleMode].divDisplay};
    height:${_SopTitle[ProjectResource.styleMode].divHeight};
    line-height:${_SopTitle[ProjectResource.styleMode].divLineHeight};
    background:${_SopTitle[ProjectResource.styleMode].divBackground};
    color:${_SopTitle[ProjectResource.styleMode].divColor};
    font-size:${_SopTitle[ProjectResource.styleMode].divFontSize};
    text-align: left;
    font-weight: bold;
`;


/*********************************************************************/

export const SpcCont_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SpcCont.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SpcCont.Busan;
    }
    return {};
}

export const _SpcCont = {
    Cleannara: {
        divDisplay: 'block',
        divHeight:'91%',
        divColor: '#505050',
        divBackground: '#fff',

    },
    Busan: {
        divDisplay: 'block',
        divHeight: '91%',
        divColor: '#21EA74',
        divBackground: '#fff',
    }
}

export const SpcCont = styled.div`
    display:${_SpcCont[ProjectResource.styleMode].divDisplay};
    height:${_SpcCont[ProjectResource.styleMode].divHeight};
    background:${_SpcCont[ProjectResource.styleMode].divBackground};
    color:${_SpcCont[ProjectResource.styleMode].divColor};
    position: relative;
    &::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        border-radius: 3px;
        background-color: #282828;
    }
    &::-webkit-scrollbar-thumb {
        width: 3px;
        border-radius: 3px;
        background: #21EA74;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
`;


/*********************************************************************/

export const SpRht_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SpRht.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SpRht.Busan;
    }
    return {};
}

export const _SpRht = {
    Cleannara: {
        divDisplay: 'block',
        divWidth: '341px',
        divColor: '#505050',
        divPaddingTop: '50px',
        divBackground: '#202020',
        divBorderRadius: '4px',

    },
    Busan: {
        divDisplay: 'block',
        divWidth: '341px',
        divColor: '#21EA74',
        divPaddingTop: '50px',
        divBackground: '#202020',
        divBorderRadius: '4px',
    }
}

export const SpRht = styled.div`
    display:${_SpRht[ProjectResource.styleMode].divDisplay};
    width:${_SpRht[ProjectResource.styleMode].divWidth};
    background:${_SpRht[ProjectResource.styleMode].divBackground};
    color:${_SpRht[ProjectResource.styleMode].divColor};
    padding-top:${_SpRht[ProjectResource.styleMode].divPaddingTop};
    border-radius:${_SpRht[ProjectResource.styleMode].divBorderRadius};
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
`;


/*SectionGridDefault.jsx***************************************************/


export const DefaultButtonAreaH_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _DefaultButtonAreaH.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _DefaultButtonAreaH.Busan;
    }
    return {};
}

export const _DefaultButtonAreaH = {
    Cleannara: {
        divDisplay: 'flex',
        divWidth: '350px',
        divHeight: '100%',

    },
    Busan: {
        divDisplay: 'flex',
        divWidth: '350px',
        divHeight: '100%',
    }
}

export const DefaultButtonAreaH = styled.div`
    display:${_DefaultButtonAreaH[ProjectResource.styleMode].divDisplay};
    /* width:${_DefaultButtonAreaH[ProjectResource.styleMode].divWidth}; */
    height:${_DefaultButtonAreaH[ProjectResource.styleMode].divHeight};
    justify-content: space-between;
    > button{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 153px;
        height: 47px;
        line-height: 47px;
        text-align: center;
        color: #21EA74;
        background: #202020;
        border-radius: 7px;
        margin-right: 20px;
        font-size: 16px;
        font-weight: bold;
    } 
`;


/**********************************************************************/


export const NewSopIconN_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _NewSopIconN.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _NewSopIconN.Busan;
    }
    return {};
}

export const _NewSopIconN = {
    Cleannara: {
        divDisplay: 'inline-block',
        divWidth: '26px',
        divHeight: '26px',

    },
    Busan: {
        divDisplay: 'inline-block',
        divWidth: '26px',
        divHeight: '26px',
    }
}

export const NewSopIconN = styled.div`
    display:${_NewSopIconN[ProjectResource.styleMode].divDisplay};
    width:${_NewSopIconN[ProjectResource.styleMode].divWidth};
    height:${_NewSopIconN[ProjectResource.styleMode].divHeight};
    background: url(${ NewSopIconImage }) no-repeat center center;
    margin-right: 6px;
`;


/**********************************************************************/


export const SopOpenIconN_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopOpenIconN.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopOpenIconN.Busan;
    }
    return {};
}

export const _SopOpenIconN = {
    Cleannara: {
        divDisplay: 'inline-block',
        divWidth: '26px',
        divHeight: '26px',

    },
    Busan: {
        divDisplay: 'inline-block',
        divWidth: '26px',
        divHeight: '26px',
    }
}

export const SopOpenIconN = styled.div`
    display:${_SopOpenIconN[ProjectResource.styleMode].divDisplay};
    width:${_SopOpenIconN[ProjectResource.styleMode].divWidth};
    height:${_SopOpenIconN[ProjectResource.styleMode].divHeight};
    background: url(${ SopOpenIconImage }) no-repeat center center;
    margin-right: 6px;
`;

/**********************************************************************/


export const FileOpenIconP_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _FileOpenIconP.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _FileOpenIconP.Busan;
    }
    return {};
}

export const _FileOpenIconP = {
    Cleannara: {
        divDisplay: 'inline-block',
        divWidth: '26px',
        divHeight: '26px',

    },
    Busan: {
        divDisplay: 'inline-block',
        divWidth: '26px',
        divHeight: '26px',
    }
}

export const FileOpenIconP = styled.div`
    display:${_FileOpenIconP[ProjectResource.styleMode].divDisplay};
    width:${_FileOpenIconP[ProjectResource.styleMode].divWidth};
    height:${_FileOpenIconP[ProjectResource.styleMode].divHeight};
    background: url(${ FileOpenIconImage }) no-repeat;
    margin-right: 6px;
`;


