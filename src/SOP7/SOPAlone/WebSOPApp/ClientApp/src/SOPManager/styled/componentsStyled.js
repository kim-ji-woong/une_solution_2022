
import styled from 'styled-components';
import ProjectResource from '../../Root/resource/id';


import UpIcon from '../../SOPManager/image/upIcon.png';
import DownIcon from '../../SOPManager/image/downIcon.png';
import AddIcon from '../../SOPManager/image/addIcon.png';
import DeleteIcon from '../../SOPManager/image/deleteIcon.png';

import RadioChecked from '../../SOPManager/image/checkBox_checked.png';


/*********************************************************************/

export const SprTitle_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprTitle.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprTitle.Busan;
    }
    return {};
}

export const _SprTitle = {
    Cleannara: {
        divDisplay: 'block',
        divHeight: '46px',
        divLineHeight: '46px',
        divColor: '#21EA74',
        divPadding: '0px 18px',
        divBackground: '#343434',
        divFontSize: '18px',
    },
    Busan: {
        divDisplay: 'block',
        divHeight: '46px',
        divLineHeight: '46px',
        divColor: '#21EA74',
        divPadding: '0px 18px',
        divBackground: '#202020',
        divFontSize: '18px',
    }
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


export const SprCont_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprCont.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprCont.Busan;
    }
    return {};
}

export const _SprCont = {
    Cleannara: {
        divDisplay: 'block',
        divHeight: '100%',
        divPaddingTop: '190px',
        divPaddingBottom: '60px',
    },
    Busan: {
        divDisplay: 'block',
        divHeight: '100%',
        divPaddingTop: '190px',
        divPaddingBottom: '60px',
    }
}

export const SprCont = styled.div`
    display:${_SprCont[ProjectResource.styleMode].divDisplay};
    height:${_SprCont[ProjectResource.styleMode].divHeight};
    /* padding-top:${_SprCont[ProjectResource.styleMode].divPaddingTop}; */
    padding-bottom:${_SprCont[ProjectResource.styleMode].divPaddingBottom};
    position: relative;

`;


/********************************************************************/


export const ScrollContentAnnotation_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _ScrollContentAnnotation.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _ScrollContentAnnotation.Busan;
    }
    return {};
}

export const _ScrollContentAnnotation = {
    Cleannara: {
        divHeight: '700px',
    },
    Busan: {
        divHeight: '700px',
    }
}

export const ScrollContentAnnotation = styled.div`
     height:${_ScrollContentAnnotation[ProjectResource.styleMode].divHeight};
    > textarea{
        display: block;
        width: 100%;
        height: 100%;
        /* border: solid 1px #aaa !important; */
        border-radius: 4px; -moz-border-radius: 4px; -webkit-border-radius: 4px;
        font-family: 'Spoqa Han Sans Neo','sans-serif';
        background: #202020;
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
        background: #21EA74;
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


export const SprContProcess_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprContProcess.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprContProcess.Busan;
    }
    return {};
}

export const _SprContProcess = {
    Cleannara: {
        divDisplay: 'block',
        divHeight: '100%',
        divPaddingTop: '190px',
        divPaddingBottom: '60px',
    },
    Busan: {
        divDisplay: 'block',
        divHeight: '100%',
        divPaddingTop: '190px',
        divPaddingBottom: '60px',
    }
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


export const SprTop_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprTop.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprTop.Busan;
    }
    return {};
}

export const _SprTop = {
    Cleannara: {
        divDisplay: 'block',
        divHeight: '190px',
        divPadding: '15px 26px',
    },
    Busan: {
        divDisplay: 'block',
        divHeight: '190px',
        divPadding: '15px 26px',
    }
}

export const SprTop = styled.div`
    display:${_SprTop[ProjectResource.styleMode].divDisplay};
    /* height:${_SprTop[ProjectResource.styleMode].divHeight}; */
    padding:${_SprTop[ProjectResource.styleMode].divPadding};
    font-family: 'Spoqa Han Sans Neo','sans-serif';

`;


/********************************************************************/

export const SprtTitle_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprtTitle.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprtTitle.Busan;
    }
    return {};
}

export const _SprtTitle = {
    Cleannara: {
        divDisplay: 'flex',
        divFontSize: '16px',
        divFontWeight: '600',
        divColor: '#fff',
        divMarginBottom: '20px',
    },
    Busan: {
        divDisplay: 'flex',
        divFontSize: '16px',
        divFontWeight: '600',
        divColor: '#fff',
        divMarginBottom: '20px',
    }
}

export const SprtTitle = styled.div`
    display:${_SprtTitle[ProjectResource.styleMode].divDisplay};
    color:${_SprtTitle[ProjectResource.styleMode].divColor};
    font-size:${_SprtTitle[ProjectResource.styleMode].divFontSize};
    font-weight:${_SprtTitle[ProjectResource.styleMode].divFontWeight};
    margin-bottom:${_SprtTitle[ProjectResource.styleMode].divMarginBottom};
    > h4{
        font-size:${_SprtTitle[ProjectResource.styleMode].divFontSize};
        font-family: 'Spoqa Han Sans Neo','sans-serif';
        color:${_SprtTitle[ProjectResource.styleMode].divColor};
        flex: 1;
    }
    > p{

    }
    > p > label{
       color:${_SprtTitle[ProjectResource.styleMode].divColor};
       font-family: 'Spoqa Han Sans Neo','sans-serif';
       font-size: 12px;
       cursor: pointer;
    }
`;

/*********************************************************************/


export const SprMid_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprMid.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprMid.Busan;
    }
    return {};
}

export const _SprMid = {
    Cleannara: {
        divWidth: '100%',
        divHeight: '100%',
    },
    Busan: {
        divWidth: '100%',
        divHeight: '100%',
    }
}

export const SprMid = styled.div`
    width:${_SprMid[ProjectResource.styleMode].divWidth};
    height:${_SprMid[ProjectResource.styleMode].divHeight};
    overflow-y: scroll;
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
        background: #21EA74;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
`;


/*********************************************************************/


export const SprtIpt_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprtIpt.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprtIpt.Busan;
    }
    return {};
}

export const _SprtIpt = {
    Cleannara: {
        divDisplay: 'flex',
        divHeight: '100%',
    },
    Busan: {
        divDisplay: 'flex',
        divHeight: '100%',
    }
}

export const SprtIpt = styled.div`
    display:${_SprtIpt[ProjectResource.styleMode].divDisplay};

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
        background: #202020;
        color: #fff;
        border: none;
    }
`;


/*********************************************************************/


export const SprtIptReci_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprtIptReci.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprtIptReci.Busan;
    }
    return {};
}

export const _SprtIptReci = {
    Cleannara: {
        divDisplay: 'flex',
        divHeight: '83px',
        divMarginBottom: '10px',
    },
    Busan: {
        divDisplay: 'flex',
        divHeight: '83px',
        divMarginBottom: '10px',
    }
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
        background: #202020;
        color: #fff;
        border: none;
    }
`;


/*********************************************************************/


export const SprtIptRecipients_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprtIptRecipients.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprtIptRecipients.Busan;
    }
    return {};
}

export const _SprtIptRecipients = {
    Cleannara: {
        divDisplay: 'flex',
        divHeight: '100%',
        divMarginBottom: '10px',
    },
    Busan: {
        divDisplay: 'flex',
        divHeight: '100%',
        divMarginBottom: '10px',
    }
}

export const SprtIptRecipients = styled.div`
    display:${_SprtIptRecipients[ProjectResource.styleMode].divDisplay};
    margin-bottom:${_SprtIptRecipients[ProjectResource.styleMode].divMarginBottom};
    > dt{
        float: left;
        width: 20%;
        line-height: 38px;
        color: #fff;
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
        background: #202020;
        color: #fff;
        border: none;
    }
`;


/*********************************************************************/


export const ScrollContentReci_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _ScrollContentReci.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _ScrollContentReci.Busan;
    }
    return {};
}

export const _ScrollContentReci = {
    Cleannara: {
        divHeight: '83px',
    },
    Busan: {
        divHeight: '83px',
    }
}

export const ScrollContentReci = styled.div`
     height:${_ScrollContentReci[ProjectResource.styleMode].divHeight};
    > textarea{
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 4px; -moz-border-radius: 4px; -webkit-border-radius: 4px;
        font-family: 'Spoqa Han Sans Neo','sans-serif';
        background: #202020;
        color: #fff;
        resize: none;
        padding: 10px !important;
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
        background: #21EA74;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
`;


/*********************************************************************/


export const ScrollContent_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _ScrollContent.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _ScrollContent.Busan;
    }
    return {};
}

export const _ScrollContent = {
    Cleannara: {
        divHeight: '100%',
    },
    Busan: {
        divHeight: '100%',
    }
}

export const ScrollContent = styled.div`
    > textarea{
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 4px; -moz-border-radius: 4px; -webkit-border-radius: 4px;
        font-family: 'Spoqa Han Sans Neo','sans-serif';
        background: #202020;
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
        background: #21EA74;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
`;


/*********************************************************************/


export const ScrollContentMission_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _ScrollContentMission.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _ScrollContentMission.Busan;
    }
    return {};
}

export const _ScrollContentMission = {
    Cleannara: {
        divHeight: '100%',
    },
    Busan: {
        divHeight: '100%',
    }
}

export const ScrollContentMission = styled.div`
    > textarea{
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 4px; -moz-border-radius: 4px; -webkit-border-radius: 4px;
        font-family: 'Spoqa Han Sans Neo','sans-serif';
        background: #202020;
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
        background: #21EA74;
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
        background: #21EA74;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
`;


/*********************************************************************/


export const ScrollContentStart_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _ScrollContentStart.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _ScrollContentStart.Busan;
    }
    return {};
}

export const _ScrollContentStart = {
    Cleannara: {
        divDisplay: 'block',
        divHeight: '100%',
    },
    Busan: {
        divDisplay: 'block',
        divHeight: '100%',
    }
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
        background: #202020;
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
        background: #21EA74;
    }
    > textarea::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
`;


/*********************************************************************/


export const SprmContProcess_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprmContProcess.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprmContProcess.Busan;
    }
    return {};
}

export const _SprmContProcess = {
    Cleannara: {
        divPadding: '15px',
    },
    Busan: {
        divPadding: '15px',
    }
}

export const SprmContProcess = styled.div`
    /* padding:${_SprmContProcess[ProjectResource.styleMode].divPadding}; */

    > dl > dt > dd > h5{
       color: #fff;
    }
`;


/*********************************************************************/


export const SprmCont_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprmCont.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprmCont.Busan;
    }
    return {};
}

export const _SprmCont = {
    Cleannara: {
        divPadding: '15px',
    },
    Busan: {
        divPadding: '15px',
    }
}

export const SprmCont = styled.div`
    /* padding:${_SprmCont[ProjectResource.styleMode].divPadding}; */

    > dl > dt > dd > h5{
       color: #fff;
    }
`;


/*********************************************************************/


export const SprmAcdn_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprmAcdn.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprmAcdn.Busan;
    }
    return {};
}

export const _SprmAcdn = {
    Cleannara: {

    },
    Busan: {

    }
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

export const SprmAcdnDt_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprmAcdnDt.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprmAcdnDt.Busan;
    }
    return {};
}

export const _SprmAcdnDt = {
    Cleannara: {

    },
    Busan: {

    }
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

export const SprmAcdnDD_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprmAcdnDD.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprmAcdnDD.Busan;
    }
    return {};
}

export const _SprmAcdnDD = {
    Cleannara: {

    },
    Busan: {

    }
}

export const SprmAcdnDD = styled.div`

`;


/*********************************************************************/


export const SprmTeam_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprmTeam.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprmTeam.Busan;
    }
    return {};
}

export const _SprmTeam = {
    Cleannara: {
        divBorder: 'solid 1px #f0f0f0',
    },
    Busan: {
        divBorder: 'solid 1px #f0f0f0',
    }
}

export const SprmTeam = styled.div`
    /* border:${_SprmTeam[ProjectResource.styleMode].divBorder}; */
    padding: 0px 26px;

`;

/*********************************************************************/

export const SprmRdo_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprmRdo.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprmRdo.Busan;
    }
    return {};
}

export const _SprmRdo = {
    Cleannara: {
        divBackground: '#d4d4d40f',
        divDisplay: 'flex',
        divColor: '#fff',
        divPadding: '12px 0px',
    },
    Busan: {
        divBackground: '#d4d4d40f',
        divDisplay: 'flex',
        divColor: '#fff',
        divPadding: '12px 0px',
    }
}

export const SprmRdo = styled.div`
    display:${_SprmRdo[ProjectResource.styleMode].divDisplay};
    color:${_SprmRdo[ProjectResource.styleMode].divColor};
    padding:${_SprmRdo[ProjectResource.styleMode].divPadding};
    /* background:${_SprmRdo[ProjectResource.styleMode].divBackground}; */
    border-bottom: dashed 1px #707070;
    > li{
        float: left;
        padding: 3px 0;
        font-size: 12px;
        margin-right: 10px;
    }
    > li > label{
        cursor:pointer;
    }
`;

/*********************************************************************/

export const SprmUdn_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprmUdn.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprmUdn.Busan;
    }
    return {};
}

export const _SprmUdn = {
    Cleannara: {
        divDisplay: 'flex',
        divMargin: '6px 20px',
    },
    Busan: {
        divDisplay: 'flex',
        divMargin: '6px 20px',
    }
}

export const SprmUdn = styled.div`
   display:${_SprmUdn[ProjectResource.styleMode].divDisplay};
   margin:${_SprmUdn[ProjectResource.styleMode].divMargin};


`;

/*********************************************************************/

export const SprmUdnUp_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprmUdnUp.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprmUdnUp.Busan;
    }
    return {};
}

export const _SprmUdnUp = {
    Cleannara: {
        divDisplay: 'inline-block',
        divWidth: '26px',
        divHeight: '26px',
        divMarginRight: '6px',

    },
    Busan: {
        divDisplay: 'inline-block',
        divWidth: '26px',
        divHeight: '26px',
        divMarginRight: '6px',
    }
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

export const SprmUdnDown_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprmUdnDown.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprmUdnDown.Busan;
    }
    return {};
}

export const _SprmUdnDown = {
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

export const SprmUdnDown = styled.div`
    display:${_SprmUdnDown[ProjectResource.styleMode].divDisplay};
    width:${_SprmUdnDown[ProjectResource.styleMode].divWidth};
    height:${_SprmUdnDown[ProjectResource.styleMode].divHeight};
    text-align: center;
    background: url(${ DownIcon }) no-repeat;
    flex: 1;

`;

/*********************************************************************/

export const SprmUdnDel_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprmUdnDel.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprmUdnDel.Busan;
    }
    return {};
}

export const _SprmUdnDel = {
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

export const SprmUdnDel = styled.div`
    display:${_SprmUdnDel[ProjectResource.styleMode].divDisplay};
    width:${_SprmUdnDel[ProjectResource.styleMode].divWidth};
    height:${_SprmUdnDel[ProjectResource.styleMode].divHeight};
    text-align: center;
    background: url(${ DeleteIcon }) no-repeat;
`;


/*********************************************************************/

export const SprmAdd_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprmAdd.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprmAdd.Busan;
    }
    return {};
}

export const _SprmAdd = {
    Cleannara: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '40px',
        divLineHeight: '40px',
        divColor: '#fff',
        divBackground: '#21EA74',
        divMargin: '20px',
    },
    Busan: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '40px',
        divLineHeight: '40px',
        divColor: '#fff',
        divBackground: '#21EA74',
        divMargin: '20px',
    }
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
    border-radius: 4px; 
`;


/*********************************************************************/

export const SprmTb_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprmTb.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprmTb.Busan;
    }
    return {};
}

export const _SprmTb = {
    Cleannara: {
        divDisplay: 'block',
        divPadding: '0px 20px',
    },
    Busan: {
        divDisplay: 'block',
        divPadding: '0px 20px',
    }
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
`;

/*********************************************************************/

export const SprmDsc_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprmDsc.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprmDsc.Busan;
    }
    return {};
}

export const _SprmDsc = {
    Cleannara: {
        divDisplay: 'block',
        divPadding: '15px',
        divBackground: '#202020',
    },
    Busan: {
        divDisplay: 'block',
        divPadding: '15px',
        divBackground: '#202020',
    }
}

export const SprmDsc = styled.div`
    display:${_SprmDsc[ProjectResource.styleMode].divDisplay};
    padding:${_SprmDsc[ProjectResource.styleMode].divPadding};
    background:${_SprmDsc[ProjectResource.styleMode].divBackground};
    > p{
       color: #fff;
       position: relative; 
       padding-left: 17px;
       font-size: 12px;
       
    }
    > p > &:before{
       content: '※';
       display: block;
       position: absolute;
       left: 0;
       top: 0;
    }
`;

/*********************************************************************/

export const SprmIport_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprmIport.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprmIport.Busan;
    }
    return {};
}

export const _SprmIport = {
    Cleannara: {
        divDisplay: 'block',
        divPadding: '15px',
        divMargin: '20px',
        divBackground: '#21EA74',
        divColor: '#000000',
        divBorderRadius: '6px',
        
    },
    Busan: {
        divDisplay: 'block',
        divPadding: '15px',
        divMargin: '20px',
        divBackground: '#21EA74',
        divColor: '#000000',
        divBorderRadius: '6px',
    }
}

export const SprmIport = styled.div`
    display:${_SprmIport[ProjectResource.styleMode].divDisplay};
    padding:${_SprmIport[ProjectResource.styleMode].divPadding};
    margin:${_SprmIport[ProjectResource.styleMode].divMargin};
    background:${_SprmIport[ProjectResource.styleMode].divBackground};
    color:${_SprmIport[ProjectResource.styleMode].divColor};
    border-radius:${_SprmIport[ProjectResource.styleMode].divBorderRadius};

`;

/*********************************************************************/

export const Tal_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _Tal.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _Tal.Busan;
    }
    return {};
}

export const _Tal = {
    Cleannara: {
        divDisplay: 'block',
        divBackground: '#202020',
        divPadding: '6px',
        divMarginBottom: '6px',
        divBorderRadius: '4px',
    },
    Busan: {
        divDisplay: 'block',
        divBackground: '#202020',
        divPadding: '6px',
        divMarginBottom: '6px',
        divBorderRadius: '4px',
    }
}

export const Tal = styled.div`
    display:${_Tal[ProjectResource.styleMode].divDisplay};
    background:${_Tal[ProjectResource.styleMode].divBackground};
    padding:${_Tal[ProjectResource.styleMode].divPadding};
    margin-bottom:${_Tal[ProjectResource.styleMode].divMarginBottom};
    border-radius:${_Tal[ProjectResource.styleMode].divBorderRadius};
    border: solid 1px #21EA74;

    > div > div > textarea{
       font-family: 'Spoqa Han Sans Neo','sans-serif';
       background: #202020;
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
        background: #21EA74;
    }
    > div > div > textarea::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
`;


/*********************************************************************/

export const ScrollWrapper_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _ScrollWrapper.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _ScrollWrapper.Busan;
    }
    return {};
}

export const _ScrollWrapper = {
    Cleannara: {


    },
    Busan: {


    }
}

export const ScrollWrapper = styled.div`
    overflow:auto;
    padding: 0 !important;
    position: relative;
`;


/*********************************************************************/

export const ScrollWrapperStart_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _ScrollWrapperStart.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _ScrollWrapperStart.Busan;
    }
    return {};
}

export const _ScrollWrapperStart = {
    Cleannara: {


    },
    Busan: {


    }
}

export const ScrollWrapperStart = styled.div`
    overflow:auto;
    padding: 0 !important;
    position: relative;
    height: 96%;

`;


/*********************************************************************/

export const ScrollWrapperReci_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _ScrollWrapperReci.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _ScrollWrapperReci.Busan;
    }
    return {};
}

export const _ScrollWrapperReci = {
    Cleannara: {


    },
    Busan: {


    }
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
        background: #21EA74;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
`;


/*********************************************************************/

export const ScrollWrapperProcess_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _ScrollWrapperProcess.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _ScrollWrapperProcess.Busan;
    }
    return {};
}

export const _ScrollWrapperProcess = {
    Cleannara: {


    },
    Busan: {


    }
}

export const ScrollWrapperProcess = styled.div`
    overflow:auto;
    padding: 0 !important;
    position: relative;
    height: calc(100% - 220px);

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


export const ScrollWrapperArrow_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _ScrollWrapperArrow.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _ScrollWrapperArrow.Busan;
    }
    return {};
}

export const _ScrollWrapperArrow = {
    Cleannara: {


    },
    Busan: {


    }
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
        background: #21EA74;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }

`;



/*********************************************************************/

export const SprmBtn_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprmBtn.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprmBtn.Busan;
    }
    return {};
}

export const _SprmBtn = {
    Cleannara: {
        divPadding: '15px',

    },
    Busan: {
        divPadding: '15px',

    }
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
         color: #457de9;
         border: solid 1px #457de9;
         border-radius: 4px; -moz-border-radius: 4px; -webkit-border-radius: 4px;
         cursor:pointer;
    }
`;

/*********************************************************************/

export const SprBot_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprBot.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprBot.Busan;
    }
    return {};
}

export const _SprBot = {
    Cleannara: {
        divHeight: '60px',
        divPadding: '10px 15px',
        divBorderTop: 'solid 1px #ccc',

    },
    Busan: {
        divHeight: '60px',
        divPadding: '10px 15px',
        divBorderTop: 'solid 1px #ccc',

    }
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
    }
     > a:nth-child(2){
         display: inline-block;
         width: 57px;
         height: 23px;
         line-height: 23px;
         text-align: center;
         border-radius: 4px;
         background: #21EA74;
         color: #000000;
         cursor: pointer;
    }
`;


/*decisionProperty.jsx***************************************************/
/*************************************************************************/
/*************************************************************************/
/*************************************************************************/
/*************************************************************************/


export const SprContDecision_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprContDecision.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprContDecision.Busan;
    }
    return {};
}

export const _SprContDecision = {
    Cleannara: {
        divDisplay: 'block',
        divHeight: '100%',
        divPaddingTop: '190px',
        divPaddingBottom: '60px',
    },
    Busan: {
        divDisplay: 'block',
        divHeight: '100%',
        divPaddingTop: '190px',
        divPaddingBottom: '60px',
    }
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

`;

/************************************************************************/


export const SskChk_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SskChk.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SskChk.Busan;
    }
    return {};
}

export const _SskChk = {
    Cleannara: {


    },
    Busan: {


    }
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


export const SprMidDecision_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprMidDecision.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprMidDecision.Busan;
    }
    return {};
}

export const _SprMidDecision = {
    Cleannara: {
        divWidth: '100%',
        divHeight: '78%',
    },
    Busan: {
        divWidth: '100%',
        divHeight: '78%',
    }
}

export const SprMidDecision = styled.div`
    width:${_SprMidDecision[ProjectResource.styleMode].divWidth};
    height:${_SprMidDecision[ProjectResource.styleMode].divHeight};
    overflow-y: scroll;
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
        background: #21EA74;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
`;

/*********************************************************************/


export const TableTitle_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _TableTitle.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _TableTitle.Busan;
    }
    return {};
}

export const _TableTitle = {
    Cleannara: {
        divHeight: '30px',
        divLineHeight: '30px',
        divColor: '#fff',
        divPadding: '0px 20px',
    },
    Busan: {
        divHeight: '30px',
        divLineHeight: '30px',
        divColor: '#fff',
        divPadding: '0px 20px',
    }
}

export const TableTitle = styled.div`
     height:${_TableTitle[ProjectResource.styleMode].divHeight};
     line-height:${_TableTitle[ProjectResource.styleMode].divLineHeight};
     color:${_TableTitle[ProjectResource.styleMode].divColor};
     padding:${_TableTitle[ProjectResource.styleMode].divPadding};
`;

/*********************************************************************/


export const SopEdtTb_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopEdtTb.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopEdtTb.Busan;
    }
    return {};
}

export const _SopEdtTb = {
    Cleannara: {
        divColor: '#fff',
        divFontSize: '13px',
        divFontWeight: '600',

    },
    Busan: {
        divColor: '#fff',
        divFontSize: '13px',
        divFontWeight: '600',
    }
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

     }
     > table > tbody{
         color:${_SopEdtTb[ProjectResource.styleMode].divColor};
         font-size: 13px;
     }
     > table > th,td{
         text-align: center;
         border-bottom: solid 1px #ebebeb5e;
         padding: 5px 0;
     }
     > table > th{
         background: #f7f7f7;
         border-top: solid 1px #555;
     } 

`;


/*********************************************************************/


export const ScrollContentModify_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _ScrollContentModify.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _ScrollContentModify.Busan;
    }
    return {};
}

export const _ScrollContentModify = {
    Cleannara: {
        divHeight: '93px',
        divMargin: '20px',
    },
    Busan: {
        divHeight: '93px',
        divMargin: '20px',
    }
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
        background: #202020;
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
        background: #21EA74;
    }
    > textarea::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
`;


/*********************************************************************/


export const ScrollContentDecision_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _ScrollContentDecision.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _ScrollContentDecision.Busan;
    }
    return {};
}

export const _ScrollContentDecision = {
    Cleannara: {
        divHeight: '63px',
    },
    Busan: {
        divHeight: '63px',
    }
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
        background: #202020;
        color: #fff;
        height: 100%;
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
        background: #21EA74;
    }
    > textarea::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
`;

/*********************************************************************/

export const ScrollContentJudgment_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _ScrollContentJudgment.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _ScrollContentJudgment.Busan;
    }
    return {};
}

export const _ScrollContentJudgment = {
    Cleannara: {
        divHeight: '93px',
    },
    Busan: {
        divHeight: '93px',
    }
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
        background: #202020;
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
        background: #21EA74;
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


export const SprtIptTitleInter_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprtIptTitleInter.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprtIptTitleInter.Busan;
    }
    return {};
}

export const _SprtIptTitleInter = {
    Cleannara: {
        divDisplay: 'flex',
        divHeight: '100%',
    },
    Busan: {
        divDisplay: 'flex',
        divHeight: '100%',
    }
}

export const SprtIptTitleInter = styled.div`
    display:${_SprtIptTitleInter[ProjectResource.styleMode].divDisplay};
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
        background: #202020;
        color: #fff;
        border: none;
    }
`;

/*********************************************************************/

export const SprmSms_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprmSms.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprmSms.Busan;
    }
    return {};
}

export const _SprmSms = {
    Cleannara: {
        divHeight: '34px',
        divLineHeight: '34px',
        divColor: '#fff',
        divPadding: '10px 26px',
    },
    Busan: {
        divHeight: '34px',
        divLineHeight: '34px',
        divColor: '#fff',
        divPadding: '10px 26px',
    }
}

export const SprmSms = styled.div`
     /* height:${_SprmSms[ProjectResource.styleMode].divHeight};
     line-height:${_SprmSms[ProjectResource.styleMode].divLineHeight}; */
     color:${_SprmSms[ProjectResource.styleMode].divColor};
     padding:${_SprmSms[ProjectResource.styleMode].divPadding};
     background: #343434a1;
     > label{
        margin-right: 10px;
        font-size: 12px;
        cursor: pointer;
     }
`;


/**********************************************************************/


export const LabelInput_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _LabelInput.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _LabelInput.Busan;
    }
    return {};
}

export const _LabelInput = {
    Cleannara: {
        divDisplay: 'inline-block',
        divHeight: '34px',
        divLineHeight: '34px',
        divColor: '#fff',
        divFontSize: '12px',
    },
    Busan: {
        divDisplay: 'inline-block',
        divHeight: '34px',
        divLineHeight: '34px',
        divColor: '#fff',
        divFontSize: '12px',
    }
}

export const LabelInput = styled.div`
     display:${_LabelInput[ProjectResource.styleMode].divDisplay};
     /* height:${_LabelInput[ProjectResource.styleMode].divHeight}; */
     /* line-height:${_LabelInput[ProjectResource.styleMode].divLineHeight}; */
     color:${_LabelInput[ProjectResource.styleMode].divColor};
     font-size:${_LabelInput[ProjectResource.styleMode].divFontSize};
     margin-right: 5px;
     > input[type=checkbox] {
         position: relative;
         top: -2px;
         width: 13px;
         height: 13px;
         cursor: pointer;
         margin-right: 5px;
     }
     > input[type=checkbox]:checked {
        width: 13px;
        height: 13px;
        border: none;
        background: url(${ RadioChecked }) no-repeat center center;
        background-size: 13px;
     }
`;


/**********************************************************************/


export const LabelInputCheckbox_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _LabelInputCheckbox.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _LabelInputCheckbox.Busan;
    }
    return {};
}

export const _LabelInputCheckbox = {
    Cleannara: {
        divDisplay: 'inline-block',
        divHeight: '34px',
        divLineHeight: '34px',
        divColor: '#fff',
        divFontSize: '12px',
    },
    Busan: {
        divDisplay: 'inline-block',
        divHeight: '34px',
        divLineHeight: '34px',
        divColor: '#fff',
        divFontSize: '12px',
    }
}

export const LabelInputCheckbox = styled.div`
     display:${_LabelInputCheckbox[ProjectResource.styleMode].divDisplay};
     /* height:${_LabelInputCheckbox[ProjectResource.styleMode].divHeight}; */
     /* line-height:${_LabelInputCheckbox[ProjectResource.styleMode].divLineHeight}; */
     color:${_LabelInputCheckbox[ProjectResource.styleMode].divColor};
     font-size:${_LabelInputCheckbox[ProjectResource.styleMode].divFontSize};
     > input[type=checkbox] {
         position: relative;
         top: -2px;
         width: 13px;
         height: 13px;
         cursor: pointer;
         background: #fff;
     }
     > input[type=checkbox]:checked {
        width: 13px;
        height: 13px;
        border: none;
        background: url(${RadioChecked}) no-repeat center center;
        background-size: 13px !important;
     }
`;


/**********************************************************************/


export const LabelInputRadio_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _LabelInputRadio.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _LabelInputRadio.Busan;
    }
    return {};
}

export const _LabelInputRadio = {
    Cleannara: {
        divDisplay: 'inline-block',
        divHeight: '13px',
        divLineHeight: '13px',
        divColor: '#fff',
        divFontSize: '12px',
        divBackground: 'url(./../../resource/image/sopManager/checkBox_checked.png) no-repeat'

    },
    Busan: {
        divDisplay: 'inline-block',
        divHeight: '13px',
        divLineHeight: '13px',
        divColor: '#fff',
        divFontSize: '12px',
        divBackground: 'url(./../../resource/image/sopManager/checkBox_checked.png) no-repeat'
    }
}

export const LabelInputRadio = styled.div`
     display:${_LabelInputRadio[ProjectResource.styleMode].divDisplay};
     /* height:${_LabelInputRadio[ProjectResource.styleMode].divHeight}; */
     /* line-height:${_LabelInputRadio[ProjectResource.styleMode].divLineHeight}; */
     color:${_LabelInputRadio[ProjectResource.styleMode].divColor};
     font-size:${_LabelInputRadio[ProjectResource.styleMode].divFontSize};
     margin-right: 5px;
     > input[type=radio] {
         position: relative;
         width: 13px;
         height: 13px;
         cursor: pointer;
         border-radius: 2px;
     }
     > input[type=radio]:checked {
        width: 13px;
        height: 13px;
        border: none;
        background: url(${ RadioChecked }) no-repeat center center;
     }
     > label:nth-child(1){
        margin-right: 40px;
     }
`;


/**********************************************************************/


export const LabelInputText_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _LabelInputText.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _LabelInputText.Busan;
    }
    return {};
}

export const _LabelInputText = {
    Cleannara: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '31px',
        divLineHeight: '31px',
        divColor: '#fff',
        divFontSize: '12px',
        divPadding: '0px 15px',

    },
    Busan: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '31px',
        divLineHeight: '31px',
        divColor: '#fff',
        divFontSize: '12px',
        divPadding: '0px 15px',
    }
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
         width:${_LabelInputText[ProjectResource.styleMode].divWidth};
         height:${_LabelInputText[ProjectResource.styleMode].divHeight};
         line-height:${_LabelInputText[ProjectResource.styleMode].divLineHeight};
         cursor: pointer;
         border-radius: 4px;
         background:none;
         color: #fff;
     }
`;


/**********************************************************************/


export const LabelInputTextBlack_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _LabelInputTextBlack.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _LabelInputTextBlack.Busan;
    }
    return {};
}

export const _LabelInputTextBlack = {
    Cleannara: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '31px',
        divLineHeight: '31px',
        divColor: '#fff',
        divFontSize: '12px',
        divPadding: '0px 15px',

    },
    Busan: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '31px',
        divLineHeight: '31px',
        divColor: '#fff',
        divFontSize: '12px',
        divPadding: '0px 15px',
    }
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
         width:${_LabelInputTextBlack[ProjectResource.styleMode].divWidth};
         height:${_LabelInputTextBlack[ProjectResource.styleMode].divHeight};
         line-height:${_LabelInputTextBlack[ProjectResource.styleMode].divLineHeight};
         cursor: pointer;
         border-radius: 4px;
         background:none;
     }
`;


/**********************************************************************/

export const SprmSprd_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprmSprd.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprmSprd.Busan;
    }
    return {};
}

export const _SprmSprd = {
    Cleannara: {
        divHeight: '34px',
        divLineHeight: '34px',
        divColor: '#fff',
        divBackground: '#d4d4d421',
        divMargin: '10px 20px',
    },
    Busan: {
        divHeight: '34px',
        divLineHeight: '34px',
        divColor: '#fff',
        divBackground: '#d4d4d421',
        divMargin: '10px 20px',
    }
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


export const ScrollContentInternal_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _ScrollContentInternal.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _ScrollContentInternal.Busan;
    }
    return {};
}

export const _ScrollContentInternal = {
    Cleannara: {
        divHeight: '100%',
    },
    Busan: {
        divHeight: '100%',
    }
}

export const ScrollContentInternal = styled.div`
    height:${_ScrollContentInternal[ProjectResource.styleMode].divHeight};

`;


/*********************************************************************/

export const ScrollContentSpread_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _ScrollContentSpread.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _ScrollContentSpread.Busan;
    }
    return {};
}

export const _ScrollContentSpread = {
    Cleannara: {
        divHeight: '238px',
    },
    Busan: {
        divHeight: '238px',
    }
}

export const ScrollContentSpread = styled.div`
    height:${_ScrollContentSpread[ProjectResource.styleMode].divHeight};
    background:#000000;
    > textarea{
       font-family: 'Spoqa Han Sans Neo','sans-serif';
       background: #202020;
       border: solid 1px #707070 !important;
       color: #fff;
       font-size: 14px;
       padding: 10px;
    }
`;


/*********************************************************************/

export const ScrollContentView_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _ScrollContentView.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _ScrollContentView.Busan;
    }
    return {};
}

export const _ScrollContentView = {
    Cleannara: {
        divHeight: '238px',
    },
    Busan: {
        divHeight: '238px',
    }
}

export const ScrollContentView = styled.div`
    height:${_ScrollContentView[ProjectResource.styleMode].divHeight};
    background:#000000;
    > textarea{
       font-family: 'Spoqa Han Sans Neo','sans-serif';
       background: #202020;
       border: solid 1px #707070 !important;
       color: #fff;
       font-size: 14px;
       padding: 10px;
    }
`;

/*********************************************************************/


export const SprmSpBtn_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprmSpBtn.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprmSpBtn.Busan;
    }
    return {};
}

export const _SprmSpBtn = {
    Cleannara: {
        divHeight: '100%',
    },
    Busan: {
        divHeight: '100%',
    }
}

export const SprmSpBtn = styled.div`
    height:${_SprmSpBtn[ProjectResource.styleMode].divHeight};
     > a:nth-child(1){
         display: inline-block;
         height: 23px;
         line-height: 23px;
         text-align: center;
         border-radius: 4px;
         background: #0D0D0D;
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
         background: #21EA74;
         color: #000000;
         font-size: 14px;
    }
`;

/*********************************************************************/


export const SprMidInternal_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprMidInternal.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprMidInternal.Busan;
    }
    return {};
}

export const _SprMidInternal = {
    Cleannara: {
        divWidth: '100%',
        divHeight: '74%',
    },
    Busan: {
        divWidth: '100%',
        divHeight: '74%',
    }
}

export const SprMidInternal = styled.div`
    width:${_SprMidInternal[ProjectResource.styleMode].divWidth};
    height:${_SprMidInternal[ProjectResource.styleMode].divHeight};
    overflow-y: scroll;
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
        background: #21EA74;
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


export const SprmExp_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprmExp.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprmExp.Busan;
    }
    return {};
}

export const _SprmExp = {
    Cleannara: {
        divWidth: '100%',
        divHeight: '100%',
        divPadding: '15px 26px',
    },
    Busan: {
        divWidth: '100%',
        divHeight: '100%',
        divPadding: '15px 26px',
    }
}

export const SprmExp = styled.div`
    /* width:${_SprmExp[ProjectResource.styleMode].divWidth}; */
    height:${_SprmExp[ProjectResource.styleMode].divHeight};
    /* padding:${_SprmExp[ProjectResource.styleMode].divPadding}; */

`;


/*********************************************************************/

export const SprStartBox_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprStartBox.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprStartBox.Busan;
    }
    return {};
}

export const _SprStartBox = {
    Cleannara: {
        divWidth: '100%',
        divHeight: '100%',
        divPadding: '15px 26px',
    },
    Busan: {
        divWidth: '100%',
        divHeight: '100%',
        divPadding: '15px 26px',
    }
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
`;


/*********************************************************************/

export const ArrowBox_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _ArrowBox.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _ArrowBox.Busan;
    }
    return {};
}

export const _ArrowBox = {
    Cleannara: {
        divWidth: '100%',
        divHeight: '100%',
        divPadding: '15px 26px',
    },
    Busan: {
        divWidth: '100%',
        divHeight: '100%',
        divPadding: '15px 26px',
    }
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


export const SprmStend_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SprmStend.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SprmStend.Busan;
    }
    return {};
}

export const _SprmStend = {
    Cleannara: {
        divWidth: '100%',
        divHeight: '34px',
    },
    Busan: {
        divWidth: '100%',
        divHeight: '34px',
    }
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


export const ScrollContentArrow_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _ScrollContentArrow.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _ScrollContentArrow.Busan;
    }
    return {};
}

export const _ScrollContentArrow = {
    Cleannara: {
        divDisplay: 'block',
    },
    Busan: {
        divDisplay: 'block',
    }
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
        background: #202020;
        color: #fff;
        height: 100%;
    }
`;
