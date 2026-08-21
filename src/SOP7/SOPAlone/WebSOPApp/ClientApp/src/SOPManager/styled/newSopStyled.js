
import styled from 'styled-components';
import ProjectResource from '../../Root/resource/id';

import NextArrow from '../../SOPManager/image/sopNextIcon.png';

/*********************************************************************/

export const SpeWrap_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SpeWrap.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SpeWrap.Busan;
    }
    return {};
}

export const _SpeWrap = {
    Cleannara: {
        divDisplay: 'block',
        divHeight: '100%',
    },
    Busan: {
        divDisplay: 'block',
        divHeight: '100%',
    }
}

export const SpeWrap = styled.div`
    display:${_SpeWrap[ProjectResource.styleMode].divDisplay};
    height:${_SpeWrap[ProjectResource.styleMode].divHeight};
    position: relative;
    padding: 70px 15px 50px;
    border-radius: 6px;
`;


/*********************************************************************/

export const SpeTop_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SpeTop.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SpeTop.Busan;
    }
    return {};
}

export const _SpeTop = {
    Cleannara: {
        divDisplay: 'flex',
        divHeight: '50px',
    },
    Busan: {
        divDisplay: 'flex',
        divHeight: '50px',
    }
}

export const SpeTop = styled.div`
    display:${_SpeTop[ProjectResource.styleMode].divDisplay};
    height:${_SpeTop[ProjectResource.styleMode].divHeight};
    align-items: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    background: #343434;
    border-top: solid 1px #343434;
    padding: 10px 15px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    > h3{
       color:#21EA74;
       flex: 1;
       font-size: 18px;
    }
`;

/*********************************************************************/

export const SpeRow_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SpeRow.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SpeRow.Busan;
    }
    return {};
}

export const _SpeRow = {
    Cleannara: {
        divDisplay: 'flex',
        divHeight: '96%',
    },
    Busan: {
        divDisplay: 'flex',
        divHeight: '96%',
    }
}

export const SpeRow = styled.div`
    display:${_SpeRow[ProjectResource.styleMode].divDisplay};
    height:${_SpeRow[ProjectResource.styleMode].divHeight};
    margin: 0 -5px;
`;


/*********************************************************************/

export const SpeContFirst_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SpeContFirst.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SpeContFirst.Busan;
    }
    return {};
}

export const _SpeContFirst = {
    Cleannara: {
        divDisplay: 'block',
        divWidth: '30%',
        divHeight: '100%',
        divPadding: '0 5px',
        divBackground: '#EBEBEB',
    },
    Busan: {
        divDisplay: 'block',
        divWidth: '30%',
        divHeight: '100%',
        divPadding: '0 5px',
        divBackground: '#EBEBEB',
    }
}

export const SpeContFirst = styled.div`
    display:${_SpeContFirst[ProjectResource.styleMode].divDisplay};
    width:${_SpeContFirst[ProjectResource.styleMode].divWidth};
    height:${_SpeContFirst[ProjectResource.styleMode].divHeight};
    /* padding:${_SpeContFirst[ProjectResource.styleMode].divPadding}; */
    background:${_SpeContFirst[ProjectResource.styleMode].divBackground};
    float: left;
    position: relative;
    border-radius: 6px;
    border: solid 3px #21EA74;
    > div > div > h4{
        height: 46px;
        line-height: 46px;
        background: #21EA74;
        text-align: center;
        font-size: 18px;
    }
`;

/*********************************************************************/

export const SpeContSecond_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SpeContSecond.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SpeContSecond.Busan;
    }
    return {};
}

export const _SpeContSecond = {
    Cleannara: {
        divDisplay: 'block',
        divWidth: '35%',
        divHeight: '100%',
        divPadding: '0 5px',
        divBackground: '#EBEBEB',
    },
    Busan: {
        divDisplay: 'block',
        divWidth: '35%',
        divHeight: '100%',
        divPadding: '0 5px',
        divBackground: '#EBEBEB',
    }
}

export const SpeContSecond = styled.div`
    display:${_SpeContSecond[ProjectResource.styleMode].divDisplay};
    width:${_SpeContSecond[ProjectResource.styleMode].divWidth};
    height:${_SpeContSecond[ProjectResource.styleMode].divHeight};
    /* padding:${_SpeContSecond[ProjectResource.styleMode].divPadding}; */
    background:${_SpeContFirst[ProjectResource.styleMode].divBackground};
    float: left;
    position: relative;
    border-radius: 6px;
    border: solid 3px #21EA74;
    > div > div > h4{
        height: 46px;
        line-height: 46px;
        background: #21EA74;
        text-align: center;
        font-size: 18px;
    }
`;


/*********************************************************************/

export const SpeContThird_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SpeContThird.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SpeContThird.Busan;
    }
    return {};
}

export const _SpeContThird = {
    Cleannara: {
        divDisplay: 'block',
        divWidth: '35%',
        divHeight: '100%',
        divPadding: '0 5px',
        divBackground: '#EBEBEB',
    },
    Busan: {
        divDisplay: 'block',
        divWidth: '35%',
        divHeight: '100%',
        divPadding: '0 5px',
        divBackground: '#EBEBEB',
    }
}

export const SpeContThird = styled.div`
    display:${_SpeContThird[ProjectResource.styleMode].divDisplay};
    width:${_SpeContThird[ProjectResource.styleMode].divWidth};
    height:${_SpeContThird[ProjectResource.styleMode].divHeight};
    /* padding:${_SpeContThird[ProjectResource.styleMode].divPadding}; */
    background:${_SpeContFirst[ProjectResource.styleMode].divBackground};
    float: left;
    position: relative;
    border-radius: 6px;
    border: solid 3px #21EA74;
    > div > div > h4{
        height: 46px;
        line-height: 46px;
        background: #21EA74;
        text-align: center;
        font-size: 18px;
    }
`;


/*********************************************************************/

export const NextStageIcon_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _NextStageIcon.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _NextStageIcon.Busan;
    }
    return {};
}

export const _NextStageIcon = {
    Cleannara: {
        divDisplay: 'inline-block',
        divWidth: '27px',
        divHeight: '100%',
        divPadding: '0 42px',
    },
    Busan: {
        divDisplay: 'inline-block',
        divWidth: '27px',
        divHeight: '100%',
        divPadding: '0 42px',
    }
}

export const NextStageIcon = styled.div`
    display:${_NextStageIcon[ProjectResource.styleMode].divDisplay};
    width:${_NextStageIcon[ProjectResource.styleMode].divWidth};
    height:${_NextStageIcon[ProjectResource.styleMode].divHeight};
    padding:${_NextStageIcon[ProjectResource.styleMode].divPadding};
    background: url(${ NextArrow }) no-repeat;
    background-position: center;

`;


/*********************************************************************/

export const SpeChk_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SpeChk.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SpeChk.Busan;
    }
    return {};
}

export const _SpeChk = {
    Cleannara: {

    },
    Busan: {

    }
}

export const SpeChk = styled.div`
    position: absolute;
    left: 0;
    top: 60px;
`;


/*********************************************************************/

export const SpeScr_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SpeScr.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SpeScr.Busan;
    }
    return {};
}

export const _SpeScr = {
    Cleannara: {

    },
    Busan: {

    }
}

export const SpeScr = styled.div`
     /* padding: 20px; */
     display: flex;
`;


/*********************************************************************/

export const SpeGry_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SpeGry.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SpeGry.Busan;
    }
    return {};
}

export const _SpeGry = {
    Cleannara: {

    },
    Busan: {

    }
}

export const SpeGry = styled.div`
     /* margin: -15px -20px; */
     > li{
         float: left;
         width: 100%;
         padding: 15px 20px;
         border-bottom: dashed 1px #B4B4B4;
     }
     > li > label{
         display: block;
         cursor: pointer;
         font-size: 16px;
         margin-right: 15px;
     }
     > li > label > span{
         margin-left: 10px; 
     }
     > li > img{
         display: block;
         width: 100px;
         margin-bottom: 5px;
     }
     > li > span{
         font-size: 16px;
         margin-left: 10px;
         vertical-align: middle;
     }
      
`;

/*********************************************************************/

export const SpeLst_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SpeLst.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SpeLst.Busan;
    }
    return {};
}

export const _SpeLst = {
    Cleannara: {
        divDisplay: 'block',
        divWidth: '100%',

    },
    Busan: {
        divDisplay: 'block',
        divWidth: '100%',
    }
}

export const SpeLst = styled.div`
     /* border-top: solid 1px #f4f4f4; */
     display:${_SpeLst[ProjectResource.styleMode].divDisplay};
     width:${_SpeLst[ProjectResource.styleMode].divWidth};
     > li{
          display: flex;
          height: 50px;
          line-height: 50px;
          align-items: center;
          border-bottom: dashed 1px #B4B4B4;
          position: relative;
          /* padding: 10px; */
          padding-left: 20px;
     }
     > li > label{
          margin-right: 10px;
     }
`;

/*********************************************************************/

export const SpeIpt_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SpeIpt.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SpeIpt.Busan;
    }
    return {};
}

export const _SpeIpt = {
    Cleannara: {
        divDisplay: 'block',
        divWidth: '100%',
    },
    Busan: {
        divDisplay: 'block',
        divWidth: '100%',
    }
}

export const SpeIpt = styled.div`
     /* border-top: solid 1px #f4f4f4; */
     display:${_SpeLst[ProjectResource.styleMode].divDisplay};
     width:${_SpeLst[ProjectResource.styleMode].divWidth};

     > li{
          display: flex;
          align-items: center;
          position: relative;
          height: 50px;
          line-height: 50px;
          padding-left: 20px;
          border-bottom: dashed 1px #B4B4B4;
     }
`;

/*********************************************************************/

export const SpeBot_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SpeBot.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SpeBot.Busan;
    }
    return {};
}

export const _SpeBot = {
    Cleannara: {

    },
    Busan: {

    }
}

export const SpeBot = styled.div`
     display: block;
     position: absolute;
     left: 0;
     right: 0;
     bottom: 20px;
     height: 50px;
     text-align: right;
     padding: 10px 16px;
     border-bottom-left-radius: 6px;
     border-bottom-right-radius: 6px;

     > a:nth-child(1){
         display: inline-block;
         width: 150px;
         height: 40px;
         line-height: 40px;
         text-align: center;
         font-size: 14px;
         background: #0D0D0D;
         color: #fff;
         padding: 0 30px;
         border-radius: 4px; -moz-border-radius: 4px; -webkit-border-radius: 4px;
         cursor: pointer;
         margin-right: 6px;
     }
     > a:nth-child(2){
         display: inline-block;
         width: 150px;
         height: 40px;
         line-height: 40px;
         text-align: center;
         font-size: 14px;
         background: #21EA74;
         color: #000000;
         padding: 0 30px;
         border-radius: 4px; -moz-border-radius: 4px; -webkit-border-radius: 4px;
         cursor: pointer;
     }
`;