
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

import sopSaveIcon_disabled from '../image/sopSaveIcon_disabled.png';
import saveXMLIcon_disabled from '../image/saveXMLIcon_disabled.png';


/* sopManager.jsx **********************************************/

export const _SubAside = {
    default: {
        divDisplay: 'block',
        divWidth: '60px',
        divHeight: '508px',
        divBackground: '#222A38',
    },
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

export const _SopMLeft = {
    default: {
        divWidth: '120px',
        divHeight: '100%',
    },
}

export const SopMLeft= styled.div`
    width:${_SopMLeft[ProjectResource.styleMode].divWidth};
    height:${_SopMLeft[ProjectResource.styleMode].divHeight};
    float: left;
`;


/********************************************************************/

export const _SalMenu = {
    default: {
        divDisplay: 'block',
        divBackground: '#222A38',
    },
}

export const SalMenu = styled.div`
    display:${_SalMenu[ProjectResource.styleMode].divDisplay};
    background:${_SalMenu[ProjectResource.styleMode].divBackground};

    dd > a > div {
        cursor: pointer;
    }

    .salCont dd a:hover:before { 
        margin-right: 45px; 
        z-index: 2; 
        opacity: 1;
    } 
`;

/*********************************************************************/

export const _SalCont = {
    default: {
        divDisplay: 'block',
        divPaddingLeft: '30px',
        divBackground: '#222A38',
    },
}

export const SalCont = styled.div`
    display:${_SalCont[ProjectResource.styleMode].divDisplay};
    padding-left:${_SalCont[ProjectResource.styleMode].divPaddingLeft};
    /* background:${_SalCont[ProjectResource.styleMode].divBackground}; */
    position: relative;
`;

/*********************************************************************/

export const _NewSOPIcon = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '44px',
        divHeight: '44px',
        divBackground: 'url(./../../resource/image/sopManager/newSopIcon.png) no-repeat center center;',
        divColor: '#215336',
    },
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

export const _SopOpenIcon = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '44px',
        divHeight: '44px',
        divBackground: 'url(./../../resource/image/sopManager/sopOpenIcon.png) no-repeat center center;',
        divColor: '#215336',
    },
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

export const _SopSaveIcon = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '44px',
        divHeight: '44px',
        divBackground: 'url(./../../resource/image/sopManager/sopSaveIcon.png) no-repeat center center;',
        divBackgroundDisabled: `url(${sopSaveIcon_disabled}) no-repeat center center`,
        divColor: '#215336',
    },
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

export const _SopSaveAsIcon = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '44px',
        divHeight: '44px',
        divBackground: 'url(./../../resource/image/sopManager/sopSaveAsIcon.png) no-repeat center center;',
        divColor: '#215336',
    },
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

export const _SopDeleteIcon = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '44px',
        divHeight: '44px',
        divBackground: 'url(./../../resource/image/sopManager/sopTrashIcon.png) no-repeat center center;',
        divColor: '#215336',
    },
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

export const _SopOpenXMLIcon = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '44px',
        divHeight: '44px',
        divBackground: 'url(./../../resource/image/sopManager/openXMLIcon.png) no-repeat center center;',
        divColor: '#215336',
    },
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

export const _SopSaveXMLIcon = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '44px',
        divHeight: '44px',
        divBackground: 'url(./../../resource/image/sopManager/saveXMLIcon.png) no-repeat center center;',
        divBackgroundDisabled: `url(${saveXMLIcon_disabled}) no-repeat center center`,
        divColor: '#215336',
    },
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

export const _SopProcessWrap = {
    default: {
        divDisplay: 'block',
        divHeight: '100%',
        divBackground: '#222A38',
        divPaddingLeft: '320px',
        divPaddingRight: '360px',
    },
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

export const _SopProcessLeft = {
    default: {
        divDisplay: 'block',
        divWidth: '303px',
        divHeight: '100%',
        divBackground: '#1B212C',
        divBorderRadius: '6px',
    },
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

export const _SopAcdn = {
    default: {
        divDisplay: 'block',
        divWidth: '303px',
        divHeight: '880px',
        divBackground: '#1B212C',
        divBorderRadius: '6px',
    },
}

export const SopAcdn = styled.div`
    display:${_SopAcdn[ProjectResource.styleMode].divDisplay};
    width:${_SopAcdn[ProjectResource.styleMode].divWidth};
    height:${_SopAcdn[ProjectResource.styleMode].divHeight};
    background:${_SopAcdn[ProjectResource.styleMode].divBackground};
    border-radius:${_SopAcdn[ProjectResource.styleMode].divBorderRadius};
`;


/*********************************************************************/

export const _SopAcdnDt = {
    default: {
        divDisplay: 'block',
        divHeight: '56px',
        divlineHeight: '56px',
        divBackground: '#1D2023',
        divPadding: '0 15px',
        divFontSize: '16px',
        divColor: '#fff',
        divFontWeight: 'bold',
    },
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
        background: #1D2023;
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

export const _SopAcdnDD = {
    default: {
        divPadding: '15px',
        divBackground: '#282828',
    },
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

export const _SopEdt1 = {
    default: {
        divDisplay: 'block',
        divHeight: '110px',
    },
}

export const SopEdt1 = styled.div`
    display:${_SopEdt1[ProjectResource.styleMode].divDisplay};
    height:${_SopEdt1[ProjectResource.styleMode].divHeight};
    
`;


/*********************************************************************/

export const _SopEdtTitle = {
    default: {
        divDisplay: 'block',
        divMarginBottom: '10px',
    },
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

export const _SopEdtRdo = {
    default: {
        divDisplay: 'block',
        divPaddingBottom: '30px',
    },
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
        margin-left: 0;

    }
`;


/*********************************************************************/

export const _SopEdtRdo2 = {
    default: {
        divDisplay: 'block',
        divPaddingTop: '10px',
    },
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

export const _SopEdt2 = {
    default: {
        divDisplay: 'block',
        divHeight: '350px',
    },
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
        background: #0095FF;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
    
`;


/*********************************************************************/

export const _SopEdtCpnt = {
    default: {
        divDisplay: 'block',
    },
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

export const _ProcessShape = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '174px',
        divHeight: '53px',
    },
}

export const ProcessShape = styled.div`
    display:${_ProcessShape[ProjectResource.styleMode].divDisplay};
    width:${_ProcessShape[ProjectResource.styleMode].divWidth};
    height:${_ProcessShape[ProjectResource.styleMode].divHeight};
    background: url(${ Process }) no-repeat;
`;

/*********************************************************************/

export const _DecisionShape = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '174px',
        divHeight: '59px',
    },
}

export const DecisionShape = styled.div`
    display:${_DecisionShape[ProjectResource.styleMode].divDisplay};
    width:${_DecisionShape[ProjectResource.styleMode].divWidth};
    height:${_DecisionShape[ProjectResource.styleMode].divHeight};
    background: url(${ Decision }) no-repeat;
`;


/*********************************************************************/

export const _AnnotationShape = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '166px',
        divHeight: '70px',
    },
}

export const AnnotationShape = styled.div`
    display:${_AnnotationShape[ProjectResource.styleMode].divDisplay};
    width:${_AnnotationShape[ProjectResource.styleMode].divWidth};
    height:${_AnnotationShape[ProjectResource.styleMode].divHeight};
    background: url(${ Annotation }) no-repeat;
`;


/*********************************************************************/

export const _EndpointShape = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '174px',
        divHeight: '53px',
    },
}

export const EndpointShape = styled.div`
    display:${_EndpointShape[ProjectResource.styleMode].divDisplay};
    width:${_EndpointShape[ProjectResource.styleMode].divWidth};
    height:${_EndpointShape[ProjectResource.styleMode].divHeight};
    background: url(${ EndPoint }) no-repeat;
`;

/*********************************************************************/

export const _InternalShape = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '174px',
        divHeight: '53px',
    },
}

export const InternalShape = styled.div`
    display:${_InternalShape[ProjectResource.styleMode].divDisplay};
    width:${_InternalShape[ProjectResource.styleMode].divWidth};
    height:${_InternalShape[ProjectResource.styleMode].divHeight};
    background: url(${ Internal }) no-repeat;
`;


/*********************************************************************/

export const _SopEdt3 = {
    default: {
        divDisplay: 'block',
        divHeight: '350px',
    },
}

export const SopEdt3 = styled.div`
    display:${_SopEdt3[ProjectResource.styleMode].divDisplay};
    /* height:${_SopEdt3[ProjectResource.styleMode].divHeight}; */
    > textarea{
        background: #1B212C;
        color: #fff;
        font-size: 13px;
        ${(props) => props.theme.scroll()};
    }
    &::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        border-radius: 3px;
        background-color: #282828;
    }
    &::-webkit-scrollbar-thumb {
        width: 3px;
        border-radius: 3px;
        background: #0095FF;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
    
`;


/*********************************************************************/

export const _SopEdtTpy = {
    default: {
        divDisplay: 'block',
        divPaddingLeft: '70px',
        divMarginBottom: '10px',
    },
}

export const SopEdtTpy = styled.div`
    display:${_SopEdtTpy[ProjectResource.styleMode].divDisplay};
    padding-left:${_SopEdtTpy[ProjectResource.styleMode].divPaddingLeft};
    margin-bottom:${_SopEdtTpy[ProjectResource.styleMode].divMarginBottom};
    position: relative;
    > span{
        display: block;
        height: 35px;
        line-height: 36px;
        position: absolute;
        left: 0;
        top: 0;
        font-size: 14px;
        color: #fff;
    }
    > select{
        display: block;
        width: 100%;
        height: 35px;
        border-radius: 4px;
        padding-left: 5px;
        background: #1B212C;
        border: solid 1px #707070;
        color: #fff;
        font-size: 13px;
    }
    > select > option{
        color: #fff;
    }
`;

/*********************************************************************/

export const _SopCent = {
    default: {
        divDisplay: 'block',
        divHeight: '100%',
        divPaddingTop: '40px',

    },
}

export const SopCent = styled.div`
    display:${_SopCent[ProjectResource.styleMode].divDisplay};
    height:${_SopCent[ProjectResource.styleMode].divHeight};
    padding-top:${_SopCent[ProjectResource.styleMode].divPaddingTop};
    border-radius: 4px;
    position: relative;

`;


/*********************************************************************/

export const _SpcTop = {
    default: {
        divDisplay: 'block',
        divBackground: '#1D2023',
        divHeight: '46px',
        divColor: '#0095FF',
        divFontSize: '16px',
        divPaddingTop: '8px',

    },

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
       width: 25%;
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

export const _SopTopUndo = {
    default: {
        divDisplay: 'block',
        divWidth: '30px',
        divHeight: '30px',
        divLineHeight: '30px',
        divBackground: '#424242',
        divColor: '#0095FF',
        divFontSize: '16px',
        divMarginRight: '4px',

    },
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

export const _SopTopRedo = {
    default: {
        divDisplay: 'block',
        divWidth: '30px',
        divHeight: '30px',
        divLineHeight: '30px',
        divBackground: '#424242',
        divColor: '#0095FF',
        divFontSize: '16px',
        divMarginRight: '4px',

    },
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

export const _SopTopCopy = {
    default: {
        divDisplay: 'block',
        divWidth: '30px',
        divHeight: '30px',
        divLineHeight: '30px',
        divBackground: '#424242',
        divColor: '#0095FF',
        divFontSize: '16px',
        divMarginRight: '4px',

    },
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

export const _SopTopCut = {
    default: {
        divDisplay: 'block',
        divWidth: '30px',
        divHeight: '30px',
        divLineHeight: '30px',
        divBackground: '#424242',
        divColor: '#0095FF',
        divFontSize: '16px',
        divMarginRight: '4px',

    },
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

export const _SopTopPaste = {
    default: {
        divDisplay: 'block',
        divWidth: '30px',
        divHeight: '30px',
        divLineHeight: '30px',
        divBackground: '#424242',
        divColor: '#0095FF',
        divFontSize: '16px',
        divMarginRight: '4px',

    },
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

export const _SopTopDel = {
    default: {
        divDisplay: 'block',
        divWidth: '30px',
        divHeight: '30px',
        divLineHeight: '30px',
        divBackground: '#424242',
        divColor: '#0095FF',
        divFontSize: '16px',
        divMarginRight: '4px',

    },
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

export const _SopTopFileOpen = {
    default: {
        divDisplay: 'block',
        divWidth: '30px',
        divHeight: '30px',
        divLineHeight: '30px',
        divBackground: '#424242',
        divColor: '#0095FF',
        divFontSize: '16px',
        divMarginRight: '4px',

    },
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

export const _SopTopFileSave = {
    default: {
        divDisplay: 'block',
        divWidth: '30px',
        divHeight: '30px',
        divLineHeight: '30px',
        divBackground: '#424242',
        divColor: '#0095FF',
        divFontSize: '16px',
        divMarginRight: '4px',

    },
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

export const _SpcWrap = {
    default: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '100%',
        divBackground: '#1B212C',
        divPaddingLeft: '20px',
        divPaddingRight: '20px',
        divBorderRadius: '4px',

    },
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

export const _SopTitle = {
    default: {
        divDisplay: 'block',
        divHeight: '50px',
        divLineHeight: '50px',
        divBackground: '#1B212C',
        divColor: '#0095FF',
        divFontSize: '18px',

    },
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

export const _SpcCont = {
    default: {
        divDisplay: 'block',
        divHeight:'91%',
        divColor: '#505050',
        divBackground: '#fff',

    },
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
        background: #0095FF;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
`;


/*********************************************************************/

export const _SpRht = {
    default: {
        divDisplay: 'block',
        divWidth: '341px',
        divColor: '#505050',
        divPaddingTop: '50px',
        divBackground: '#1B212C',
        divBorderRadius: '4px',

    },
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

export const _DefaultButtonAreaH = {
    default: {
        divDisplay: 'flex',
        divWidth: '350px',
        divHeight: '100%',

    },
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
        color: #0095FF;
        background: #1B212C;
        border-radius: 7px;
        font-size: 16px;
        font-weight: bold;
        box-shadow: 0px 6px 6px #00000029;

        &:not(:last-child) {
            margin-right: 20px;
        }
    } 
`;


/**********************************************************************/

export const _NewSopIconN = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '26px',
        divHeight: '26px',

    },
}

export const NewSopIconN = styled.div`
    display:${_NewSopIconN[ProjectResource.styleMode].divDisplay};
    width:${_NewSopIconN[ProjectResource.styleMode].divWidth};
    height:${_NewSopIconN[ProjectResource.styleMode].divHeight};
    background: url(${ NewSopIconImage }) no-repeat center center;
    margin-right: 6px;
`;


/**********************************************************************/

export const _SopOpenIconN = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '26px',
        divHeight: '26px',

    },
}

export const SopOpenIconN = styled.div`
    display:${_SopOpenIconN[ProjectResource.styleMode].divDisplay};
    width:${_SopOpenIconN[ProjectResource.styleMode].divWidth};
    height:${_SopOpenIconN[ProjectResource.styleMode].divHeight};
    background: url(${ SopOpenIconImage }) no-repeat center center;
    margin-right: 6px;
`;

/**********************************************************************/

export const _FileOpenIconP = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '26px',
        divHeight: '26px',

    },
}

export const FileOpenIconP = styled.div`
    display:${_FileOpenIconP[ProjectResource.styleMode].divDisplay};
    width:${_FileOpenIconP[ProjectResource.styleMode].divWidth};
    height:${_FileOpenIconP[ProjectResource.styleMode].divHeight};
    background: url(${ FileOpenIconImage }) no-repeat;
    margin-right: 6px;
`;


