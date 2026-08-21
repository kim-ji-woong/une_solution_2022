
import styled from 'styled-components';
import ProjectResource from '../../Root/resource/id';


import UpIcon from '../../SOPManager/image/upIcon.png';
import DownIcon from '../../SOPManager/image/downIcon.png';
import AddIcon from '../../SOPManager/image/addIcon.png';
import DeleteIcon from '../../SOPManager/image/deleteIcon.png';

import RadioChecked from '../../SOPManager/image/checkBox_checked.png';
import sopMenuArrowDown from '../../SOPManager/image/sopMenuArrowDown.png';
import sopMenuArrowUp from '../../SOPManager/image/sopMenuArrowUp.png';


/*********************************************************************/

export const _SprTitle = {
    default: {
        divDisplay: 'block',
        divHeight: '46px',
        divLineHeight: '46px',
        divColor: '#20DFA8',
        divPadding: '0px 18px',
        divBackground: '#1D2023',
        divFontSize: '18px',
    },
}

export const SprTitle = styled.div`
    display:${_SprTitle[ProjectResource.styleMode].divDisplay};
    height:${_SprTitle[ProjectResource.styleMode].divHeight};
    line-height:${_SprTitle[ProjectResource.styleMode].divLineHeight};
    background:${_SprTitle[ProjectResource.styleMode].divBackground};
    color:${_SprTitle[ProjectResource.styleMode].divColor};
    padding:${_SprTitle[ProjectResource.styleMode].divPadding};
    font-size:${_SprTitle[ProjectResource.styleMode].divFontSize};
    font-family: 'Spoqa Han Sans Neo','sans-serif';
    font-weight: 700;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
`;



/*annotationProperty*********************************************************************/
/***************************************************************************************/
/***************************************************************************************/
/***************************************************************************************/
/***************************************************************************************/

export const _SprCont = {
    default: {
        divDisplay: 'block',
        divHeight: '100%',
        divPaddingTop: '190px',
        divPaddingBottom: '60px',
    },
}

export const SprCont = styled.div`
    display:${_SprCont[ProjectResource.styleMode].divDisplay};
    height:${_SprCont[ProjectResource.styleMode].divHeight};
    /* padding-top:${_SprCont[ProjectResource.styleMode].divPaddingTop}; */
    padding-bottom:${_SprCont[ProjectResource.styleMode].divPaddingBottom};
    position: relative;

    textarea, input {
        font-size: 13px;
    }
`;


/********************************************************************/

export const _ScrollContentAnnotation = {
    default: {
        divHeight: '700px',
    },
}

export const ScrollContentAnnotation = styled.div`
     height:${_ScrollContentAnnotation[ProjectResource.styleMode].divHeight};
    > textarea{
        display: block;
        width: 100%;
        height: 94%;
        /* border: solid 1px #aaa !important; */
        border-radius: 4px; -moz-border-radius: 4px; -webkit-border-radius: 4px;
        font-family: 'Spoqa Han Sans Neo','sans-serif';
        background: #252E34;
        color: #fff;
        resize: none;
        padding: 10px !important;
        font-size: 13px;
    }

    > textarea::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        border-radius: 3px;
        background-color: #282828;
    }
    > textarea::-webkit-scrollbar-thumb {
        width: 3px;
        border-radius: 3px;
        background: #20DFA8;
    }
    > textarea::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
`;


/*processProperty*********************************************************************/
/***************************************************************************************/
/***************************************************************************************/
/***************************************************************************************/
/***************************************************************************************/

export const _SprContProcess = {
    default: {
        divDisplay: 'block',
        divHeight: '100%',
        divPaddingTop: '190px',
        divPaddingBottom: '60px',
    },
}

export const SprContProcess = styled.div`
    display:${_SprContProcess[ProjectResource.styleMode].divDisplay};
    height:${_SprContProcess[ProjectResource.styleMode].divHeight};
    /* padding-top:${_SprContProcess[ProjectResource.styleMode].divPaddingTop}; */
    padding-bottom:${_SprContProcess[ProjectResource.styleMode].divPaddingBottom};
    position: relative;
    -ms-user-select: none;
    -moz-user-select: -moz-none;
    -webkit-user-select: none;
    /*-khtml-user-select: none;*/
    user-select: none;

`;

/*********************************************************************/

export const _SprTop = {
    default: {
        divDisplay: 'block',
        divHeight: '190px',
        divPadding: '15px 18px 26px 18px',
    },
}

export const SprTop = styled.div`
    display:${_SprTop[ProjectResource.styleMode].divDisplay};
    /* height:${_SprTop[ProjectResource.styleMode].divHeight}; */
    padding:${_SprTop[ProjectResource.styleMode].divPadding};
    font-family: 'Spoqa Han Sans Neo','sans-serif';

`;


/********************************************************************/

export const _SprtTitle = {
    default: {
        divDisplay: 'flex',
        divFontSize: '16px',
        divFontWeight: '600',
        divColor: '#fff',
        divMarginBottom: '20px',
    },
}

export const SprtTitle = styled.div`
    display:${_SprtTitle[ProjectResource.styleMode].divDisplay};
    color:${_SprtTitle[ProjectResource.styleMode].divColor};
    font-size:${_SprtTitle[ProjectResource.styleMode].divFontSize};
    font-weight:${_SprtTitle[ProjectResource.styleMode].divFontWeight};
    margin-bottom:${_SprtTitle[ProjectResource.styleMode].divMarginBottom};
    
    > h4 {
        font-size:${_SprtTitle[ProjectResource.styleMode].divFontSize};
        font-family: 'Spoqa Han Sans Neo','sans-serif';
        color:${_SprtTitle[ProjectResource.styleMode].divColor};
        flex: 1;
    }

    > div > label{
        color:${_SprtTitle[ProjectResource.styleMode].divColor};
        font-family: 'Spoqa Han Sans Neo','sans-serif';
        font-size: 12px;
        cursor: pointer;
        font-weight: 400;
        position: relative;
    }
`;

/*********************************************************************/

export const _SprMid = {
    default: {
        divWidth: '100%',
        divHeight: '100%',
    },
}

export const SprMid = styled.div`
    width:${_SprMid[ProjectResource.styleMode].divWidth};
    height:${_SprMid[ProjectResource.styleMode].divHeight};
    /* overflow-y: scroll; */
    border-top: dashed 1px #707070;
    &::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        border-radius: 3px;
        background-color: #282828;
    }
    &::-webkit-scrollbar-thumb {
        width: 3px;
        border-radius: 3px;
        background: #20DFA8;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
`;


/*********************************************************************/

export const _SprtIpt = {
    default: {
        divDisplay: 'flex',
        divHeight: '100%',
    },
}

export const SprtIpt = styled.div`
    display:${_SprtIpt[ProjectResource.styleMode].divDisplay};

    > dt{
        float: left;
        width: 20%;
        line-height: 32px;
        color: #fff;
        font-size: 14px;
    }
    > dd{
        float: left;
        width: 80%;
        margin-bottom: 6px;
        border: solid 1px #707070;
        border-radius: 4px;
    }
    > dd > input{
        display: block;
        width: 100%;
        height: 31px;
        border-radius: 4px;
        background: #252E34;
        color: #fff;
        border: none;
        font-size: 13px;
        padding-left: 5px;
    }
`;


/*********************************************************************/

export const _SprtIptReci = {
    default: {
        divDisplay: 'flex',
        divHeight: '83px',
        divMarginBottom: '10px',
    },
}

export const SprtIptReci = styled.div`
    display:${_SprtIptReci[ProjectResource.styleMode].divDisplay};
    height:${_SprtIptReci[ProjectResource.styleMode].divHeight};
    margin-bottom:${_SprtIptReci[ProjectResource.styleMode].divMarginBottom};
    > dt{
        float: left;
        width: 20%;
        line-height: 38px;
        color: #fff;
    }
    > dd{
        float: left;
        width: 80%;
        margin-bottom: 6px;
        border: solid 1px #707070;
        border-radius: 4px;
    }
    > dd > input{
        display: block;
        width: 100%;
        height: 31px;
        border-radius: 4px;
        background: #252E34;
        color: #fff;
        border: none;
    }
`;


/*********************************************************************/

export const _SprtIptRecipients = {
    default: {
        divDisplay: 'flex',
        divHeight: '100%',
        divMarginBottom: '10px',
    },
}

export const SprtIptRecipients = styled.div`
    display:${_SprtIptRecipients[ProjectResource.styleMode].divDisplay};
    margin-bottom:${_SprtIptRecipients[ProjectResource.styleMode].divMarginBottom};
    > dt{
        float: left;
        width: 20%;
        line-height: 38px;
        color: #fff;
        font-size: 14px;
    }
    > dd{
        float: left;
        width: 80%;
        height: 30%;
        margin-bottom: 6px;
        border: solid 1px #707070;
        border-radius: 4px;
    }
    > dd > input{
        display: block;
        width: 100%;
        height: 31px;
        border-radius: 4px;
        background: #252E34;
        color: #fff;
        border: none;
    }
`;


/*********************************************************************/

export const _ScrollContentReci = {
    default: {
        divHeight: '83px',
    },
}

export const ScrollContentReci = styled.div`
     height:${_ScrollContentReci[ProjectResource.styleMode].divHeight};
    > textarea{
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 4px; 
        -moz-border-radius: 4px; 
        -webkit-border-radius: 4px;
        font-family: 'Spoqa Han Sans Neo','sans-serif';
        background: #252E34;
        color: #fff;
        resize: none;
        padding: 10px !important;
        border: 0;
        font-size: 13px;
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
        background: #20DFA8;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
`;


/*********************************************************************/

export const _ScrollContent = {
    default: {
        divHeight: '100%',
    },
}

export const ScrollContent = styled.div`
    > textarea{
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 4px; -moz-border-radius: 4px; -webkit-border-radius: 4px;
        font-family: 'Spoqa Han Sans Neo','sans-serif';
        background: #252E34;
        color: #fff;
        resize: none;
        padding: 10px !important;
        font-size: 12px;
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
        background: #20DFA8;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
`;


/*********************************************************************/

export const _ScrollContentMission = {
    default: {
        divHeight: '100%',
    },
}

export const ScrollContentMission = styled.div`
    > textarea{
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 4px; -moz-border-radius: 4px; -webkit-border-radius: 4px;
        font-family: 'Spoqa Han Sans Neo','sans-serif';
        background: #252E34;
        color: #fff;
        resize: none;
        padding: 10px !important;
    }
    > textarea::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        border-radius: 3px;
        background-color: #282828;
    }
    > textarea::-webkit-scrollbar-thumb {
        width: 3px;
        border-radius: 3px;
        background: #20DFA8;
    }
    > textarea::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
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
        background: #20DFA8;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
`;


/*********************************************************************/

export const _ScrollContentStart = {
    default: {
        divDisplay: 'block',
        divHeight: '100%',
    },
}

export const ScrollContentStart = styled.div`
       display:${_ScrollContentStart[ProjectResource.styleMode].divDisplay};
       height:${_ScrollContentStart[ProjectResource.styleMode].divHeight};
       margin-bottom: 0;
       margin-right: 0;
       max-height: none;

    > textarea{
        display: block;
        width: 100%;
        height: 100%;
        border: solid 1px #aaa !important;
        border-radius: 4px; -moz-border-radius: 4px; -webkit-border-radius: 4px;
        background: #252E34;
        color: #fff;
        resize: none;
        padding: 10px !important;
    }

    > textarea::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        border-radius: 3px;
        background-color: #282828;
    }
    > textarea::-webkit-scrollbar-thumb {
        width: 3px;
        border-radius: 3px;
        background: #20DFA8;
    }
    > textarea::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
`;


/*********************************************************************/

export const _SprmContProcess = {
    default: {
        divPadding: '15px',
    },
}

export const SprmContProcess = styled.div`

    > dl > dt > dd > h5{
        color: #fff;
    }
`;


/*********************************************************************/

export const _SprmCont = {
    default: {
        divPadding: '15px',
    },
}

export const SprmCont = styled.div`
    /* padding:${_SprmCont[ProjectResource.styleMode].divPadding}; */

    > dl > dt > dd > h5{
       color: #fff;
    }

    > dl > dt {
        position: relative;
        font-size: 16px;
        font-weight: bold;
        line-height: 50px;

        &:after {
            content: '';
            display: block;
            width: 18px;
            height: 13px;
            position: absolute;
            right: 15px;
            top: 46%;
            margin-top: -4px;
            background: url(${sopMenuArrowDown})no-repeat center bottom;
            background-size: 100% auto;
        }
    }
`;


/*********************************************************************/

export const _SprmAcdn = {
    default: {

    },
}

export const SprmAcdn = styled.div`

    > dt{
        position: relative;
        height: 44px;
        line-height: 44px;
        padding: 0 15px;
        color: #fff;
        background: #bbb;
        cursor: pointer;
        margin-top: 1px;
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
    }
    > dt > &.on{
        background: red;
    }
    > dt > &::after{
        content: '';
        display: block;
        width: 13px;
        height: 7px;
        position: absolute;
        right: 15px;
        top: 50%;
        margin-top: -4px;
        background-size: 100% auto;
        
    }
    > dd{
        /* display: none; */
    }
    > dt > dd{
        border-left: solid 1px #ccc;
        border-right: solid 1px #ccc;
        padding: 15px 20px;
    }
`;


/*********************************************************************/

export const _SprmAcdnDt = {
    default: {

    },
}

export const SprmAcdnDt = styled.div`
    position: relative;
    height: 56px;
    line-height: 56px;
    padding: 0 15px;
    color: #fff;
    background: #bbb;
    cursor: pointer;
    border-radius: 4px;
    -moz-border-radius: 4px;
    -webkit-border-radius: 4px;

    &.on{
        background: #424242;
        display: block;
    }
    &.on:after{
        background-position: center top;
    }
    &::after{
        content: '';
        display: block;
        width: 18px;
        height: 13px;
        position: absolute;
        right: 15px;
        top: 42%;
        background-size: 100% auto;
        background: url('./../../resource/image/sopManager/sopMenuArrowDown.png')no-repeat center bottom;
    }
`;

/*********************************************************************/

export const _SprmAcdnDD = {
    default: {

    },
}

export const SprmAcdnDD = styled.div`

`;


/*********************************************************************/

export const _SprmTeam = {
    default: {
        divBorder: 'solid 1px #f0f0f0',
    },
}

export const SprmTeam = styled.div`
    /* border:${_SprmTeam[ProjectResource.styleMode].divBorder}; */

`;

/*********************************************************************/

export const _SprmRdo = {
    default: {
        divBackground: '#d4d4d40f',
        divDisplay: 'flex',
        divColor: '#fff',
        divPadding: '12px 0px',
    },
}

export const SprmRdo = styled.div`
    display:${_SprmRdo[ProjectResource.styleMode].divDisplay};
    justify-content: space-between;
    align-items: center;
    color:${_SprmRdo[ProjectResource.styleMode].divColor};
    padding:${_SprmRdo[ProjectResource.styleMode].divPadding};
    /* background:${_SprmRdo[ProjectResource.styleMode].divBackground}; */
    border-bottom: dashed 1px #707070;
    > li{
        float: left;
        padding: 3px 0;
        font-size: 12px;

        &:first-child {
            margin-left: 15px;
        }

        &:last-child {
            margin-right: 10px;
        }
    }
    > li > label{
        cursor:pointer;
        font-size: 12px;
        margin-left: 0;
    }
`;

/*********************************************************************/

export const _SprmUdn = {
    default: {
        divDisplay: 'flex',
        divMargin: '6px 20px',
    },
}

export const SprmUdn = styled.div`
   display:${_SprmUdn[ProjectResource.styleMode].divDisplay};
   margin:${_SprmUdn[ProjectResource.styleMode].divMargin};

   & > div {
    cursor: pointer;
   }

`;

/*********************************************************************/

export const _SprmUdnUp = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '26px',
        divHeight: '26px',
        divMarginRight: '6px',

    },
}

export const SprmUdnUp = styled.div`
    display:${_SprmUdnUp[ProjectResource.styleMode].divDisplay};
    width:${_SprmUdnUp[ProjectResource.styleMode].divWidth};
    height:${_SprmUdnUp[ProjectResource.styleMode].divHeight};
    margin-right:${_SprmUdnUp[ProjectResource.styleMode].divMarginRight};
    text-align: center;
    background: url(${ UpIcon }) no-repeat;
`;


/*********************************************************************/

export const _SprmUdnDown = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '26px',
        divHeight: '26px',
    },
}

export const SprmUdnDown = styled.div`
    display:${_SprmUdnDown[ProjectResource.styleMode].divDisplay};
    width:${_SprmUdnDown[ProjectResource.styleMode].divWidth};
    height:${_SprmUdnDown[ProjectResource.styleMode].divHeight};
    text-align: center;
    background: url(${ DownIcon }) no-repeat;
    flex: 1;

`;

/*********************************************************************/

export const _SprmUdnDel = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '26px',
        divHeight: '26px',
    },
}

export const SprmUdnDel = styled.div`
    display:${_SprmUdnDel[ProjectResource.styleMode].divDisplay};
    width:${_SprmUdnDel[ProjectResource.styleMode].divWidth};
    height:${_SprmUdnDel[ProjectResource.styleMode].divHeight};
    text-align: center;
    background: url(${ DeleteIcon }) no-repeat;
`;


/*********************************************************************/

export const _SprmAdd = {
    default: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '40px',
        divLineHeight: '40px',
        divColor: '#232B33',
        divBackground: '#20DFA8',
        divMargin: '15px 20px',
    },
}

export const SprmAdd = styled.div`
    display:${_SprmAdd[ProjectResource.styleMode].divDisplay};
    /* width:${_SprmAdd[ProjectResource.styleMode].divWidth}; */
    height:${_SprmAdd[ProjectResource.styleMode].divHeight};
    line-height:${_SprmAdd[ProjectResource.styleMode].divLineHeight};
    color:${_SprmAdd[ProjectResource.styleMode].divColor};
    background:${_SprmAdd[ProjectResource.styleMode].divBackground};
    margin:${_SprmAdd[ProjectResource.styleMode].divMargin};
    text-align: center;
    border-radius: 3px; 
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
`;


/*********************************************************************/

export const _SprmTb = {
    default: {
        divDisplay: 'block',
        divPadding: '0px 20px',
    },
}

export const SprmTb = styled.div`
    display:${_SprmTb[ProjectResource.styleMode].divDisplay};
    padding:${_SprmTb[ProjectResource.styleMode].divPadding};
    > td{
       text-align: center;
       padding: 5px 0;
    }
    > colgroup{
       width: 100%;
    }
    > colgroup > col:nth-child(1){
       width: 10%;
    }
    > colgroup > col:nth-child(2){
       width: 85%;
    }
    > tbody > tr > td{
       vertical-align: top;
    }
    > tbody > tr > td > input{
       width: 13px;
       height: 13px;
    }
    > tbody textarea {
        border: 0;
        font-size: 13px;
    }
`;

/*********************************************************************/

export const _SprmDsc = {
    default: {
        divDisplay: 'block',
        divPadding: 'padding: 0 15px 15px 15px;',
        divBackground: '#252E34',
    },
}

export const SprmDsc = styled.div`
    display:${_SprmDsc[ProjectResource.styleMode].divDisplay};
    padding:${_SprmDsc[ProjectResource.styleMode].divPadding};
    background:${_SprmDsc[ProjectResource.styleMode].divBackground};

    > p{
       color: #B4B4B4;
       position: relative; 
       padding-left: 22px;
       font-size: 12px;
       line-height: 18px;
       letter-spacing: 0.54px;
    }
`;

/*********************************************************************/

export const _SprmIport = {
    default: {
        divDisplay: 'block',
        divPadding: '15px',
        divMargin: '20px',
        divBackground: '#20DFA8',
        divColor: '#232B33',
        divBorderRadius: '6px',
        
    },
}

export const SprmIport = styled.div`
    display:${_SprmIport[ProjectResource.styleMode].divDisplay};
    padding:${_SprmIport[ProjectResource.styleMode].divPadding};
    margin:${_SprmIport[ProjectResource.styleMode].divMargin};
    background:${_SprmIport[ProjectResource.styleMode].divBackground};
    color:${_SprmIport[ProjectResource.styleMode].divColor};
    border-radius:${_SprmIport[ProjectResource.styleMode].divBorderRadius};
    font-size: 14px;
    cursor: pointer;
    font-weight: bold;
    text-align: center;
`;

/*********************************************************************/

export const _Tal = {
    default: {
        divDisplay: 'block',
        divBackground: '#252E34',
        divPadding: '6px',
        divMarginBottom: '15px',
        divBorderRadius: '4px',
    },
}

export const Tal = styled.div`
    display:${_Tal[ProjectResource.styleMode].divDisplay};
    background:${_Tal[ProjectResource.styleMode].divBackground};
    padding:${_Tal[ProjectResource.styleMode].divPadding};
    margin-bottom:${_Tal[ProjectResource.styleMode].divMarginBottom};
    border-radius:${_Tal[ProjectResource.styleMode].divBorderRadius};
    border: solid 1px #20DFA8;

    > div > div > textarea{
       font-family: 'Spoqa Han Sans Neo','sans-serif';
       background: #252E34;
       color: #fff;
       height: 83px;
       font-size: 14px;
    }
    > div > div > textarea::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        border-radius: 3px;
        background-color: #282828;
    }
    > div > div > textarea::-webkit-scrollbar-thumb {
        width: 3px;
        border-radius: 3px;
        background: #20DFA8;
    }
    > div > div > textarea::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
`;


/*********************************************************************/

export const _ScrollWrapper = {
    default: {


    },
}

export const ScrollWrapper = styled.div`
    overflow:auto;
    padding: 0 !important;
    position: relative;
`;


/*********************************************************************/

export const _ScrollWrapperStart = {
    default: {


    },
}

export const ScrollWrapperStart = styled.div`
    overflow:auto;
    padding: 0 !important;
    position: relative;
    height: 96%;

`;


/*********************************************************************/

export const _ScrollWrapperReci = {
    default: {


    },
}

export const ScrollWrapperReci = styled.div`
    overflow:auto;
    padding: 0 !important;
    position: relative;
    height: 83px;

    &::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        border-radius: 3px;
        background-color: #282828;
    }
    &::-webkit-scrollbar-thumb {
        width: 3px;
        border-radius: 3px;
        background: #20DFA8;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
`;


/*********************************************************************/

export const _ScrollWrapperProcess = {
    default: {


    },
}

export const ScrollWrapperProcess = styled.div`
    overflow:auto;
    padding: 0 !important;
    position: relative;
    height: calc(100% - 120px);

    &::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        border-radius: 3px;
        background-color: #282828;
    }
    &::-webkit-scrollbar-thumb {
        width: 3px;
        border-radius: 3px;
        background: #20DFA8;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }

`;


/*********************************************************************/

export const _ScrollWrapperDecision = {
    default: {


    },
}

export const ScrollWrapperDecision = styled.div`
    overflow:auto;
    padding: 0 !important;
    position: relative;
    height: calc(100% - 120px);

    &::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        border-radius: 3px;
        background-color: #282828;
    }
    &::-webkit-scrollbar-thumb {
        width: 3px;
        border-radius: 3px;
        background: #20DFA8;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }

`;


/*********************************************************************/

export const _ScrollWrapperArrow = {
    default: {


    },
}

export const ScrollWrapperArrow = styled.div`
    overflow:auto;
    padding: 0 !important;
    position: relative;
    height: 96%;

    &::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        border-radius: 3px;
        background-color: #282828;
    }
    &::-webkit-scrollbar-thumb {
        width: 3px;
        border-radius: 3px;
        background: #20DFA8;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }

`;



/*********************************************************************/

export const _SprmBtn = {
    default: {
        divPadding: '15px',

    },
}

export const SprmBtn = styled.div`
     padding:${_SprmBtn[ProjectResource.styleMode].divPadding};
     text-align: center;
     > li{
         display: inline-block;
         margin: 0 1px;
     }
     > li > a{
         display: block;
         height: 36px;
         line-height: 34px;
         padding: 0 20px;
         text-align: center;
         color: #20DFA8;
         border: solid 1px #20DFA8;
         border-radius: 4px; -moz-border-radius: 4px; -webkit-border-radius: 4px;
         cursor:pointer;
         font-size: 13px;
    }
`;

/*********************************************************************/

export const _SprBot = {
    default: {
        divHeight: '60px',
        divPadding: '10px 15px',
        divBorderTop: 'solid 1px #ccc',

    },
}

export const SprBot = styled.div`
     height:${_SprBot[ProjectResource.styleMode].divHeight};
     padding:${_SprBot[ProjectResource.styleMode].divPadding};
     /* border-top:${_SprBot[ProjectResource.styleMode].divBorderTop}; */
     text-align: right;
     position: absolute;
     left: 0;
     right: 10px;
     bottom: -6px;

     > a:nth-child(1){
         display: inline-block;
         width: 57px;
         height: 23px;
         line-height: 23px;
         text-align: center;
         border-radius: 4px;
         background: #0D0D0D;
         color: #B4B4B4;
         margin-right: 6px;
         cursor: pointer;
         font-size: 13px;
    }
     > a:nth-child(2){
         display: inline-block;
         width: 57px;
         height: 23px;
         line-height: 23px;
         text-align: center;
         border-radius: 4px;
         background: #20DFA8;
         color: #000000;
         cursor: pointer;
         font-size: 13px;
    }
`;


/*decisionProperty.jsx***************************************************/
/*************************************************************************/
/*************************************************************************/
/*************************************************************************/
/*************************************************************************/

export const _SprContDecision = {
    default: {
        divDisplay: 'block',
        divHeight: '100%',
        divPaddingTop: '190px',
        divPaddingBottom: '60px',
    },
}

export const SprContDecision = styled.div`
    display:${_SprContDecision[ProjectResource.styleMode].divDisplay};
    height:${_SprContDecision[ProjectResource.styleMode].divHeight};
    /* padding-top:${_SprContDecision[ProjectResource.styleMode].divPaddingTop}; */
    padding-bottom:${_SprContDecision[ProjectResource.styleMode].divPaddingBottom};
    position: relative;
    -ms-user-select: none;
    -moz-user-select: -moz-none;
    -webkit-user-select: none;
    /*-khtml-user-select: none;*/
    user-select: none;

    label, div {
        font-size: 14px;
    }

    textarea, td, p {
        font-size: 13px;
    }

    .nwrp {white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 200px;}
`;

/************************************************************************/

export const _SskChk = {
    default: {


    },
}

export const SskChk = styled.div`
     margin-top: 10px;
     > label{
         color: #fff;
         cursor:pointer;
     }
     > label > input{
         position: relative;
         top: -2px;
         cursor: pointer;
         margin-right: 5px;
     }
`;


/*********************************************************************/

export const _SprMidDecision = {
    default: {
        divWidth: '100%',
        divHeight: '78%',
    },
}

export const SprMidDecision = styled.div`
    width:${_SprMidDecision[ProjectResource.styleMode].divWidth};
    height:${_SprMidDecision[ProjectResource.styleMode].divHeight};
    border-top: dashed 1px #707070;
    &::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        border-radius: 3px;
        background-color: #282828;
    }
    &::-webkit-scrollbar-thumb {
        width: 3px;
        border-radius: 3px;
        background: #20DFA8;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
`;

/*********************************************************************/

export const _TableTitle = {
    default: {
        divHeight: '30px',
        divLineHeight: '30px',
        divColor: '#fff',
        divPadding: '0px 20px',
    },
}

export const TableTitle = styled.div`
     height:${_TableTitle[ProjectResource.styleMode].divHeight};
     line-height:${_TableTitle[ProjectResource.styleMode].divLineHeight};
     color:${_TableTitle[ProjectResource.styleMode].divColor};
     padding:${_TableTitle[ProjectResource.styleMode].divPadding};
`;

/*********************************************************************/

export const _SopEdtTb = {
    default: {
        divColor: '#fff',
        divFontSize: '13px',
        divFontWeight: '600',

    },
}

export const SopEdtTb = styled.div`
     > table{

     }
     > table > colgroup > col:nth-child(1){
         width:25%;
     }
     > table > colgroup > col:nth-child(2){
         width:25%;
     }
     > table > colgroup > col:nth-child(3){
         width:50%;
     }
     > table > thead{
         color:${_SopEdtTb[ProjectResource.styleMode].divColor};
         font-size:${_SopEdtTb[ProjectResource.styleMode].divFontSize};
         font-weight:${_SopEdtTb[ProjectResource.styleMode].divFontWeight};
         height: 32px;
         line-height: 32px;
         border-top: solid 1px #fff;
         background: #d4d4d421;
         text-align: center;

     }
     > table > tbody{
         color:${_SopEdtTb[ProjectResource.styleMode].divColor};
         font-size: 13px;
     }
     > table > th,td{
         text-align: center;
         border-bottom: solid 1px #ebebeb5e;
         padding: 5px 0;
         ${(props) => props.theme.overText()};
     }
     > table > th{
         background: #f7f7f7;
         border-top: solid 1px #555;
     } 

`;


/*********************************************************************/

export const _ScrollContentModify = {
    default: {
        divHeight: '93px',
        divMargin: '20px',
    },
}

export const ScrollContentModify = styled.div`
    height:${_ScrollContentModify[ProjectResource.styleMode].divHeight};
    margin:${_ScrollContentModify[ProjectResource.styleMode].divMargin};
    > textarea{
        font-family: 'Spoqa Han Sans Neo','sans-serif';
        box-sizing: border-box;
        height: 100% !important;
        max-height: none !important;
        max-width: none !important;
        overflow-y: auto !important;
        padding: 5px;
        width: 100% !important;
        background: #252E34;
        color: #fff;
        height: 100%;
        /* margin-top: 20px; */
        border: solid 1px #707070;
        border-radius: 4px;
    }

    > textarea::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        border-radius: 3px;
        background-color: #282828;
    }
    > textarea::-webkit-scrollbar-thumb {
        width: 3px;
        border-radius: 3px;
        background: #20DFA8;
    }
    > textarea::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
`;


/*********************************************************************/

export const _ScrollContentDecision = {
    default: {
        divHeight: '94px',
    },
}

export const ScrollContentDecision = styled.div`
    height:${_ScrollContentDecision[ProjectResource.styleMode].divHeight};
    > textarea{
        font-family: 'Spoqa Han Sans Neo','sans-serif';
        box-sizing: border-box;
        height: 100% !important;
        max-height: none !important;
        max-width: none !important;
        overflow-y: auto !important;
        padding: 5px;
        width: 100% !important;
        background: #252E34;
        color: #fff;
        height: 100%;
        border: solid 1px #707070;
        border-radius: 4px;
        font-size: 13px;
    }
    > textarea::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        border-radius: 3px;
        background-color: #282828;
    }
    > textarea::-webkit-scrollbar-thumb {
        width: 3px;
        border-radius: 3px;
        background: #20DFA8;
    }
    > textarea::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
`;

/*********************************************************************/

export const _ScrollContentJudgment = {
    default: {
        divHeight: '93px',
    },
}

export const ScrollContentJudgment = styled.div`
    height:${_ScrollContentJudgment[ProjectResource.styleMode].divHeight};
    margin: 20px;
    > textarea{
        font-family: 'Spoqa Han Sans Neo','sans-serif';
        box-sizing: border-box;
        height: 100% !important;
        max-height: none !important;
        max-width: none !important;
        overflow-y: auto !important;
        padding: 5px;
        width: 100% !important;
        background: #252E34;
        color: #fff;
        height: 100%;
        /* margin-top: 20px; */
        border: solid 1px #707070;
        border-radius: 4px;
    }

    > textarea::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        border-radius: 3px;
        background-color: #282828;
    }
    > textarea::-webkit-scrollbar-thumb {
        width: 3px;
        border-radius: 3px;
        background: #20DFA8;
    }
    > textarea::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
    > textarea::-webkit-scrollbar-corner{
        /* display: none; */
    }

`;

/*internalProperty.jsx***************************************************/
/*************************************************************************/
/*************************************************************************/
/*************************************************************************/
/*************************************************************************/

export const _SprtIptTitleInter = {
    default: {
        divDisplay: 'flex',
        divHeight: '100%',
    },
}

export const SprtIptTitleInter = styled.div`
    display:${_SprtIptTitleInter[ProjectResource.styleMode].divDisplay};
    > dt{
        float: left;
        width: 20%;
        line-height: 31px;
        color: #fff;
        font-size: 14px;
    }
    > dd{
        float: left;
        width: 80%;
        margin-bottom: 6px;
        border: solid 1px #707070;
        border-radius: 4px;
    }
    > dd > input{
        display: block;
        width: 100%;
        height: 31px;
        border-radius: 4px;
        background: #252E34;
        color: #fff;
        border: none;
    }
`;

/*********************************************************************/

export const _SprmSms = {
    default: {
        divHeight: '34px',
        divLineHeight: '34px',
        divColor: '#fff',
        divPadding: '10px 26px',
    },
}

export const SprmSms = styled.div`
     /* height:${_SprmSms[ProjectResource.styleMode].divHeight};
     line-height:${_SprmSms[ProjectResource.styleMode].divLineHeight}; */
     color:${_SprmSms[ProjectResource.styleMode].divColor};
     padding:${_SprmSms[ProjectResource.styleMode].divPadding};
     background: #1D2023a1;
     > label{
        margin-right: 10px;
        font-size: 12px;
        cursor: pointer;
     }
`;


/**********************************************************************/

export const _LabelInput = {
    default: {
        divDisplay: 'inline-block',
        divHeight: '34px',
        divLineHeight: '34px',
        divColor: '#fff',
        divFontSize: '12px',
    },
}

export const LabelInput = styled.div`
     display:${_LabelInput[ProjectResource.styleMode].divDisplay};
     /* height:${_LabelInput[ProjectResource.styleMode].divHeight}; */
     /* line-height:${_LabelInput[ProjectResource.styleMode].divLineHeight}; */
     color:${_LabelInput[ProjectResource.styleMode].divColor};
     font-size:${_LabelInput[ProjectResource.styleMode].divFontSize};
     margin-right: 5px;
`;


/**********************************************************************/

export const _LabelInputCheckbox = {
    default: {
        divDisplay: 'inline-block',
        divHeight: '34px',
        divLineHeight: '34px',
        divColor: '#fff',
        divFontSize: '12px',
    },
}

export const LabelInputCheckbox = styled.div`
     display:${_LabelInputCheckbox[ProjectResource.styleMode].divDisplay};
     /* height:${_LabelInputCheckbox[ProjectResource.styleMode].divHeight}; */
     /* line-height:${_LabelInputCheckbox[ProjectResource.styleMode].divLineHeight}; */
     color:${_LabelInputCheckbox[ProjectResource.styleMode].divColor};
     font-size:${_LabelInputCheckbox[ProjectResource.styleMode].divFontSize};
`;


/**********************************************************************/

export const _LabelInputRadio = {
    default: {
        divDisplay: 'inline-block',
        divHeight: '13px',
        divLineHeight: '13px',
        divColor: '#fff',
        divFontSize: '12px',
        divBackground: 'url(./../../resource/image/sopManager/checkBox_checked.png) no-repeat'

    },
}

export const LabelInputRadio = styled.div`
     display:${_LabelInputRadio[ProjectResource.styleMode].divDisplay};
     /* height:${_LabelInputRadio[ProjectResource.styleMode].divHeight}; */
     /* line-height:${_LabelInputRadio[ProjectResource.styleMode].divLineHeight}; */
     color:${_LabelInputRadio[ProjectResource.styleMode].divColor};
     font-size:${_LabelInputRadio[ProjectResource.styleMode].divFontSize};
     margin-right: 5px;
`;


/**********************************************************************/

export const _LabelInputText = {
    default: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '31px',
        divLineHeight: '31px',
        divColor: '#fff',
        divFontSize: '12px',
        divPadding: '0px 15px',

    },
}

export const LabelInputText = styled.div`
     display:${_LabelInputText[ProjectResource.styleMode].divDisplay};
     width:${_LabelInputText[ProjectResource.styleMode].divWidth};
     height:${_LabelInputText[ProjectResource.styleMode].divHeight};
     line-height:${_LabelInputText[ProjectResource.styleMode].divLineHeight};
     color:${_LabelInputText[ProjectResource.styleMode].divColor};
     font-size:${_LabelInputText[ProjectResource.styleMode].divFontSize};
     /* padding:${_LabelInputText[ProjectResource.styleMode].divPadding}; */
     margin-right: 5px;

     > input[type=text] {
         position: relative;
         top: -1px;
         width:${_LabelInputText[ProjectResource.styleMode].divWidth};
         height:${_LabelInputText[ProjectResource.styleMode].divHeight};
         line-height:${_LabelInputText[ProjectResource.styleMode].divLineHeight};
         border: 0.5px solid #707070;
         border-radius: 3px;
         background:none;
         color: #B4B4B4;
         padding-left: 5px;
     }
`;


/**********************************************************************/

export const _LabelInputTextBlack = {
    default: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '31px',
        divLineHeight: '31px',
        divColor: '#fff',
        divFontSize: '12px',
        divPadding: '0px 15px',

    },
}

export const LabelInputTextBlack = styled.div`
     display:${_LabelInputTextBlack[ProjectResource.styleMode].divDisplay};
     width:${_LabelInputTextBlack[ProjectResource.styleMode].divWidth};
     height:${_LabelInputTextBlack[ProjectResource.styleMode].divHeight};
     line-height:${_LabelInputTextBlack[ProjectResource.styleMode].divLineHeight};
     color:${_LabelInputTextBlack[ProjectResource.styleMode].divColor};
     font-size:${_LabelInputTextBlack[ProjectResource.styleMode].divFontSize};
     /* padding:${_LabelInputTextBlack[ProjectResource.styleMode].divPadding}; */
     margin-right: 5px;
     > input[type=text] {
         position: relative;
         width: calc(100% - 20px);
         height:${_LabelInputTextBlack[ProjectResource.styleMode].divHeight};
         line-height:${_LabelInputTextBlack[ProjectResource.styleMode].divLineHeight};
         cursor: pointer;
         border-radius: 4px;
         background:none;
         border: 1px solid #B4B4B4;
         margin-left: 3px;
         padding-left: 5px;
     }
`;


/**********************************************************************/

export const _SprmSprd = {
    default: {
        divHeight: '34px',
        divLineHeight: '34px',
        divColor: '#fff',
        divBackground: '#d4d4d421',
        divMargin: '10px 20px',
    },
}

export const SprmSprd = styled.div`
     /* height:${_SprmSprd[ProjectResource.styleMode].divHeight}; */
     line-height:${_SprmSprd[ProjectResource.styleMode].divLineHeight};
     color:${_SprmSprd[ProjectResource.styleMode].divColor};
     background:${_SprmSprd[ProjectResource.styleMode].divBackground};
     margin:${_SprmSprd[ProjectResource.styleMode].divMargin};
     > h5{
        border-bottom: solid 1px #d7d7d7;
        text-align: center;
        line-height: 36px;
        font-size: 14px;
    }
`;

/*********************************************************************/

export const _ScrollContentInternal = {
    default: {
        divHeight: '93%',
    },
}

export const ScrollContentInternal = styled.div`
    height:${_ScrollContentInternal[ProjectResource.styleMode].divHeight};

`;


/*********************************************************************/

export const _ScrollContentSpread = {
    default: {
        divHeight: '238px',
    },
}

export const ScrollContentSpread = styled.div`
    height:${_ScrollContentSpread[ProjectResource.styleMode].divHeight};
    background:#000000;
    > textarea{
       font-family: 'Spoqa Han Sans Neo','sans-serif';
       background: #252E34;
       border: solid 1px #707070 !important;
       color: #fff;
       font-size: 14px;
       padding: 10px;
    }
`;


/*********************************************************************/

export const _ScrollContentView = {
    default: {
        divHeight: '238px',
    },
}

export const ScrollContentView = styled.div`
    height:${_ScrollContentView[ProjectResource.styleMode].divHeight};
    background:#000000;
    > textarea{
       font-family: 'Spoqa Han Sans Neo','sans-serif';
       background: #252E34;
       border: solid 1px #707070 !important;
       color: #fff;
       font-size: 14px;
       padding: 10px;
    }
`;

/*********************************************************************/

export const _SprmSpBtn = {
    default: {
        divHeight: '100%',
    },
}

export const SprmSpBtn = styled.div`
    height:${_SprmSpBtn[ProjectResource.styleMode].divHeight};
     > a:nth-child(1){
         display: inline-block;
         height: 23px;
         line-height: 23px;
         text-align: center;
         border-radius: 4px;
         background: #3B4248;
         color: #B4B4B4;
         font-size: 14px;
         margin-right: 18px;
    }
     > a:nth-child(2){
         display: inline-block;
         height: 23px;
         line-height: 23px;
         text-align: center;
         border-radius: 4px;
         background: #20DFA8;
         color: #000000;
         font-size: 14px;
    }
`;

/*********************************************************************/

export const _SprMidInternal = {
    default: {
        divWidth: '100%',
        divHeight: '70%',
    },
}

export const SprMidInternal = styled.div`
    width:${_SprMidInternal[ProjectResource.styleMode].divWidth};
    height:${_SprMidInternal[ProjectResource.styleMode].divHeight};
    overflow-y: auto;
    border-top: dashed 1px #707070;
    &::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        border-radius: 3px;
        background-color: #282828;
    }
    &::-webkit-scrollbar-thumb {
        width: 3px;
        border-radius: 3px;
        background: #20DFA8;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
`;

/*endpointProperty.jsx***************************************************/
/*************************************************************************/
/*************************************************************************/
/*************************************************************************/
/*************************************************************************/

export const _SprmExp = {
    default: {
        divWidth: '100%',
        divHeight: '100%',
        divPadding: '15px 18px',
    },
}

export const SprmExp = styled.div`
    /* width:${_SprmExp[ProjectResource.styleMode].divWidth}; */
    height:${_SprmExp[ProjectResource.styleMode].divHeight};
    /* padding:${_SprmExp[ProjectResource.styleMode].divPadding}; */

`;


/*********************************************************************/

export const _SprStartBox = {
    default: {
        divWidth: '100%',
        divHeight: '97%',
        divPadding: '15px 18px',
    },
}

export const SprStartBox = styled.div`
    /* width:${_SprStartBox[ProjectResource.styleMode].divWidth}; */
    height:${_SprStartBox[ProjectResource.styleMode].divHeight};
    padding:${_SprStartBox[ProjectResource.styleMode].divPadding};
    > h4{
        font-family: 'Spoqa Han Sans Neo','sans-serif';
        font-size: 16px;
        color: #fff;
        margin-bottom: 20px;
    }

    label {
        font-size: 14px;

        > div {
            margin-right: 0px;
        }
    }

    textarea {
        font-size: 13px;
    }
`;


/*********************************************************************/

export const _ArrowBox = {
    default: {
        divWidth: '100%',
        divHeight: '100%',
        divPadding: '15px 18px',
    },
}

export const ArrowBox = styled.div`
    /* width:${_ArrowBox[ProjectResource.styleMode].divWidth}; */
    height:${_ArrowBox[ProjectResource.styleMode].divHeight};
    padding:${_ArrowBox[ProjectResource.styleMode].divPadding};
    
    > h4{
        font-family: 'Spoqa Han Sans Neo','sans-serif';
        font-size: 16px;
        color: #fff;
        margin-bottom: 20px;
    }
`;

/*********************************************************************/

export const _SprmStend = {
    default: {
        divWidth: '100%',
        divHeight: '34px',
    },
}

export const SprmStend = styled.div`
    height:${_SprmStend[ProjectResource.styleMode].divHeight};
    line-height: 34px;
    > li{
       float: left;
       margin-right: 20px;
       color: #fff;
    }
`;


/*arrowProperty.jsx*****************************************************/
/*************************************************************************/
/*************************************************************************/
/*************************************************************************/
/*************************************************************************/

export const _ScrollContentArrow = {
    default: {
        divDisplay: 'block',
    },
}

export const ScrollContentArrow = styled.div`
    display:${_ScrollContentArrow[ProjectResource.styleMode].divDisplay};
       height: 100%;
       margin-bottom: 0;
       margin-right: 0;
       max-height: none;

    > textarea{
        font-family: 'Spoqa Han Sans Neo','sans-serif';
        box-sizing: border-box;
        height: 100% !important;
        margin: 0;
        max-height: none !important;
        max-width: none !important;
        overflow-y: auto !important;
        padding: 5px;
        position: relative !important;
        top: 0;
        width: 100% !important;
        background: #252E34;
        color: #fff;
        height: 100%;
    }
`;
