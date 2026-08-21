
import styled from 'styled-components';
import ProjectResource from '../../Root/resource/id';

import popupClose from '../../SOPManager/image/popupClose.png';

/*********************************************************************/

export const SopPop_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SopPop.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SopPop.Busan;
    }
    return {};
}

export const _SopPop = {
    Cleannara: {
        divDisplay: 'block',

    },
    Busan: {
        divDisplay: 'block',

    }
}

export const SopPop = styled.div`
    display:${_SopPop[ProjectResource.styleMode].divDisplay};
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(114,114,114,0.3);
    > div{
         display: table;
         width: 100%;
         height: 100%;
    }
    > div > div{
         display: table-cell;
         vertical-align: middle;
    }
`;

/*********************************************************************/

export const SpPop_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SpPop.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SpPop.Busan;
    }
    return {};
}

export const _SpPop = {
    Cleannara: {
        divDisplay: 'block',

    },
    Busan: {
        divDisplay: 'block',

    }
}

export const SpPop = styled.div`
    display:${_SpPop[ProjectResource.styleMode].divDisplay};
    width:950px;
    height:680px;
    margin:0 auto;
    position:relative;
    padding-top:60px;
    overflow:hidden;
    -webkit-box-shadow:0px 3px 20px 0px rgba(0,0,0,0.2);
    -moz-box-shadow:0px 3px 20px 0px rgba(0,0,0,0.2);
    box-shadow:0px 3px 20px 0px rgba(0,0,0,0.2);
    border-radius:4px;-moz-border-radius:4px;-webkit-border-radius:4px;
`;

/*********************************************************************/

export const SppTop_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SppTop.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SppTop.Busan;
    }
    return {};
}

export const _SppTop = {
    Cleannara: {
        divDisplay: 'block',

    },
    Busan: {
        divDisplay: 'block',

    }
}

export const SppTop = styled.div`
    display:${_SppTop[ProjectResource.styleMode].divDisplay};
    position:absolute;
    left:0;
    right:0;
    top:0;
    background: #0D0D0D;
    > h4{
        float: left;
        height: 60px;
        line-height: 60px;
        color: #fff;
        padding-left: 15px;
        font-size: 22px;
        font-weight: 500;
    }
    > a{
        display: block;
        float: right;
        width: 60px;
        height: 60px;
        text-indent: -9999px;
        background: url(${ popupClose }) no-repeat;
        background-position: center;
        cursor:pointer;
    }
`;

/*********************************************************************/

export const SppSel_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SppSel.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SppSel.Busan;
    }
    return {};
}

export const _SppSel = {
    Cleannara: {
        divDisplay: 'block',

    },
    Busan: {
        divDisplay: 'block',

    }
}

export const SppSel = styled.div`
    display:${_SppSel[ProjectResource.styleMode].divDisplay};
    position: absolute;
    left: 0;
    right: 0;
    top: 60px;
    background: #202020;
    border-bottom: dashed 1px #eaeaea;
    padding: 10px 15px;
    color: #fff;
    z-index: 1;
    > h5{
       display: inline-block;
       vertical-align: middle;
       font-size: 18px;
       margin-right: 30px;
    }
    > label{
       cursor: pointer;
       margin-right: 20px;
    }
`;

/*********************************************************************/

export const SppCont_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SppCont.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SppCont.Busan;
    }
    return {};
}

export const _SppCont = {
    Cleannara: {
        divHeight: '100%',
        divBackground: '#202020',
        divColor: '#fff',
    },
    Busan: {
        divHeight: '100%',
        divBackground: '#202020',
        divColor: '#fff',
    }
}

export const SppCont = styled.div`
    height:${_SppCont[ProjectResource.styleMode].divHeight};
    background:${_SppCont[ProjectResource.styleMode].divBackground};
    color:${_SppCont[ProjectResource.styleMode].divColor};
`;

/*********************************************************************/

export const SppLft_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SppLft.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SppLft.Busan;
    }
    return {};
}

export const _SppLft = {
    Cleannara: {
        divWidth: '200px',
        divHeight: '98%',

    },
    Busan: {
        divWidth: '200px',
        divHeight: '98%',

    }
}

export const SppLft = styled.div`
    width: ${_SppLft[ProjectResource.styleMode].divWidth};
    height:${_SppLft[ProjectResource.styleMode].divHeight};
    float: left;
    position: relative;
    margin-top: 30px;
    -webkit-box-shadow: 0px 2px 15px 0px rgba(0,0,0,0.25);
    -moz-box-shadow: 0px 2px 15px 0px rgba(0,0,0,0.25);
    box-shadow: 0px 2px 15px 0px rgba(0,0,0,0.25);
    padding: 10px 0px 0px 10px;
    overflow-y:scroll;

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

export const SppRht_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SppRht.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SppRht.Busan;
    }
    return {};
}

export const _SppRht = {
    Cleannara: {
        divWidth: '730px',
        divHeight: '100%',

    },
    Busan: {
        divWidth: '730px',
        divHeight: '100%',

    }
}

export const SppRht = styled.div`
    width:${_SppRht[ProjectResource.styleMode].divWidth};
    height:${_SppRht[ProjectResource.styleMode].divHeight};
    float: left;
    position: relative;
    padding-bottom: 59px;
`;


/*********************************************************************/

export const SppRhtDelete_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SppRhtDelete.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SppRhtDelete.Busan;
    }
    return {};
}

export const _SppRhtDelete = {
    Cleannara: {
        divWidth: '730px',
        divHeight: '100%',

    },
    Busan: {
        divWidth: '730px',
        divHeight: '100%',

    }
}

export const SppRhtDelete = styled.div`
    width:${_SppRhtDelete[ProjectResource.styleMode].divWidth};
    height:${_SppRhtDelete[ProjectResource.styleMode].divHeight};
    float: left;
    position: relative;
    padding-bottom: 59px;
    padding-left: 20px;
    padding-top: 50px;
`;

/*********************************************************************/

export const SpprCont_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SpprCont.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SpprCont.Busan;
    }
    return {};
}

export const _SpprCont = {
    Cleannara: {


    },
    Busan: {

    }
}

export const SpprCont = styled.div`
      /* padding: 20px;
      margin-top: 20px; */

`;

/*********************************************************************/

export const SpprCont2_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SpprCont2.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SpprCont2.Busan;
    }
    return {};
}

export const _SpprCont2 = {
    Cleannara: {


    },
    Busan: {

    }
}

export const SpprCont2 = styled.div`
      padding: 20px;
      margin-top: 20px;
      background: #202020;

`;

/*********************************************************************/

export const ScTb_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _ScTb.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _ScTb.Busan;
    }
    return {};
}

export const _ScTb = {
    Cleannara: {


    },
    Busan: {

    }
}

export const ScTb = styled.div`
    margin-top: 10px;
    background: #fff;
    color: #000000;
    padding: 6px;

    > colgroup{
       width: 100vw;
    }
    > thead{

    }
    > thead > tr{
       border-top: solid 1px #000000;
    }
    > thead > tr > th{
       border: solid 1px #ebebeb;
       background: #F7F7F7;
       border-top: solid 2px #000000;
    }
    > th, td{
       text-align: center;
       border: solid 1px #ebebeb;
       padding:5px;
    }
    > th{
       background: #f7f7f7;
       color: #888;
       padding:5px;
       font-weight: 400;
    }
    > td > select{
       display: block;
       width: 100%;
       height:30px;
    }
    > td > span{
       display: block;
       padding: 5px 0;
       text-overflow: ellipsis;
    }
`;


/*********************************************************************/

export const SpprBot_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SpprBot.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SpprBot.Busan;
    }
    return {};
}

export const _SpprBot = {
    Cleannara: {


    },
    Busan: {

    }
}

export const SpprBot = styled.div`
     text-align: right;
     padding: 10px 15px;
     position: absolute;
     left: 0;
     right: 0;
     bottom: 0;
     border-top: solid 1px #eaeaea;
     > a{
          display: inline-block;
          /* width: 57px; */
          height: 30px;
          line-height: 28px;
          text-align: center;
          background: #21EA74;
          color: #000000;
          font-size: 12px;
          font-weight: 700;
          padding: 0 25px;
          border-radius: 4px; -moz-border-radius: 4px; -webkit-border-radius: 4px;
          cursor: pointer;
     }
`;


/*********************************************************************/

export const SpprBotSave_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SpprBotSave.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SpprBotSave.Busan;
    }
    return {};
}

export const _SpprBotSave = {
    Cleannara: {


    },
    Busan: {

    }
}

export const SpprBotSave = styled.div`
     text-align: right;
     padding: 10px 15px;
     position: absolute;
     left: 0;
     right: 0;
     bottom: 0;
     border-top: solid 1px #eaeaea;
     .save{
          display: inline-block;
          /* width: 57px; */ 
          height: 30px;
          line-height: 28px;
          text-align: center;
          background: #000000;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          padding: 0 25px;
          border-radius: 4px; -moz-border-radius: 4px; -webkit-border-radius: 4px;
          margin-right: 6px;
          cursor: pointer;
     }
     .cancel{
          display: inline-block;
          /* width: 57px; */
          height: 30px;
          line-height: 28px;
          text-align: center;
          background: #21EA74;
          color: #000000;
          font-size: 12px;
          font-weight: 700;
          padding: 0 25px;
          border-radius: 4px; -moz-border-radius: 4px; -webkit-border-radius: 4px;
          cursor: pointer;
     }
`;