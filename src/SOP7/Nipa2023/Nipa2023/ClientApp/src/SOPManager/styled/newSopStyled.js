
import styled from 'styled-components';
import ProjectResource from '../../Root/resource/id';

import NextArrow from '../../SOPManager/image/sopNextIcon.png';

/*********************************************************************/

export const _SpeWrap = {
    default: {
        divDisplay: 'block',
        divHeight: '100%',
    },
}

export const SpeWrap = styled.div`
    display:${_SpeWrap[ProjectResource.styleMode].divDisplay};
    height:${_SpeWrap[ProjectResource.styleMode].divHeight};
    position: relative;
    padding: 80px 30px 50px 30px;
    border-radius: 6px;
    background: #252E34;
`;


/*********************************************************************/

export const _SpeTop = {
    default: {
        divDisplay: 'flex',
        divHeight: '50px',
    },
}

export const SpeTop = styled.div`
    display:${_SpeTop[ProjectResource.styleMode].divDisplay};
    height:${_SpeTop[ProjectResource.styleMode].divHeight};
    align-items: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    background: #1D2023;
    border-top: solid 1px #1D2023;
    padding: 10px 25px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    > h3{
       color:#20DFA8;
       flex: 1;
       font-size: 18px;
    }

    > div {

        input {
            margin-left: 20px;
        }

        label {
            margin-left: 5px;
            position: relative;
            top: -1px;
        }
    }
`;

/*********************************************************************/

export const _SpeRow = {
    default: {
        divDisplay: 'flex',
        divHeight: '97%',
    },
}

export const SpeRow = styled.div`
    display:${_SpeRow[ProjectResource.styleMode].divDisplay};
    height:${_SpeRow[ProjectResource.styleMode].divHeight};
    margin: 0 -5px;
`;


/*********************************************************************/

export const _SpeContFirst = {
    default: {
        divDisplay: 'block',
        divWidth: '33%',
        divHeight: '100%',
        divPadding: '0 5px',
        divBackground: '#EBEBEB',
    },
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
    border: solid 3px #20DFA8;
    > div > div > h4{
        height: 46px;
        line-height: 46px;
        background: #20DFA8;
        text-align: center;
        font-size: 18px;
        color: #202020;
        font-weight: bold;
    }
`;

/*********************************************************************/

export const _SpeContSecond = {
    default: {
        divDisplay: 'block',
        divWidth: '33%',
        divHeight: '100%',
        divPadding: '0 5px',
        divBackground: '#EBEBEB',
    },
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
    border: solid 3px #20DFA8;
    > div > div > h4{
        height: 46px;
        line-height: 46px;
        background: #20DFA8;
        text-align: center;
        font-size: 18px;
        color: #202020;
        font-weight: bold;
    }
`;


/*********************************************************************/

export const _SpeContThird = {
    default: {
        divDisplay: 'block',
        divWidth: '33%',
        divHeight: '100%',
        divPadding: '0 5px',
        divBackground: '#EBEBEB',
    },
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
    border: solid 3px #20DFA8;
    > div > div > h4{
        height: 46px;
        line-height: 46px;
        background: #20DFA8;
        text-align: center;
        font-size: 18px;
        color: #202020;
        font-weight: bold;
    }
`;


/*********************************************************************/

export const _NextStageIcon = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '27px',
        divHeight: '100%',
        divPadding: '0 42px',
    },
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

export const _SpeChk = {
    default: {

    },
}

export const SpeChk = styled.div`
    position: absolute;
    left: 0;
    top: 60px;
`;


/*********************************************************************/

export const _SpeScr = {
    default: {

    },
}

export const SpeScr = styled.div`
     /* padding: 20px; */
     /* display: flex; */
`;


/*********************************************************************/

export const _SpeGry = {
    default: {

    },
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
         margin-left: 0;
     }
     > li > label > span{
        margin-left: 3px;
        color: #202020;
        position: relative;
        top: 2px;
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

export const _SpeLst = {
    default: {
        divDisplay: 'block',
        divWidth: '100%',

    },
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
     > li > div > label{
        color: #202020;
        position: relative;
        top: -1px;
        margin-left: 8px;
        cursor: pointer;
     }
`;

/*********************************************************************/

export const _SpeIpt = {
    default: {
        divDisplay: 'block',
        divWidth: '100%',
    },
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

     > li > div > label{
        color: #202020;
        position: relative;
        top: -1px;
        margin-left: 8px;
        cursor: pointer;
     }
`;

/*********************************************************************/

export const _SpeBot = {
    default: {

    },
}

export const SpeBot = styled.div`
     display: block;
     position: absolute;
     left: 0;
     right: 0;
     bottom: 20px;
     height: 50px;
     text-align: right;
     padding: 10px 25px;
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
         color: #B4B4B4;
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
         background: #20DFA8;
         color: #000000;
         padding: 0 30px;
         border-radius: 4px; -moz-border-radius: 4px; -webkit-border-radius: 4px;
         cursor: pointer;
     }
`;