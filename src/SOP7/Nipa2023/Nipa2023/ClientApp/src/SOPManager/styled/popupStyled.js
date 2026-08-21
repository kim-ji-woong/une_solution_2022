
import styled from 'styled-components';
import ProjectResource from '../../Root/resource/id';

import popupClose from '../../SOPManager/image/popupClose.png';

/*********************************************************************/

export const _SopPop = {
    default: {
        divDisplay: 'block',

    },
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

export const _SpPop = {
    default: {
        divDisplay: 'block',

    },
}

export const SpPop = styled.div`
    display:${_SpPop[ProjectResource.styleMode].divDisplay};
    width:950px;
    height:620px;
    margin:0 auto;
    position:relative;
    padding-top:30px;
    overflow:hidden;
    -webkit-box-shadow:0px 3px 20px 0px rgba(0,0,0,0.2);
    -moz-box-shadow:0px 3px 20px 0px rgba(0,0,0,0.2);
    box-shadow:0px 3px 20px 0px rgba(0,0,0,0.2);
    border-radius:4px;-moz-border-radius:4px;-webkit-border-radius:4px;
`;

/*********************************************************************/

export const _SppTop = {
    default: {
        divDisplay: 'block',

    },
}

export const SppTop = styled.div`
    display:${_SppTop[ProjectResource.styleMode].divDisplay};
    position:absolute;
    left:0;
    right:0;
    top:0;
    background: #1D2023;
    height: 50px;

    > h4{
        float: left;
        height: 50px;
        line-height: 50px;
        color: ${(props) => props.theme.mainColor};
        padding-left: 15px;
        font-size: 18px;
        font-weight: bold;
    }

    > a{
        display: block;
        float: right;
        width: 60px;
        height: 50px;
        text-indent: -9999px;
        background: url(${ popupClose }) no-repeat;
        background-position: center;
        cursor:pointer;
    }
`;

/*********************************************************************/

export const _SppSel = {
    default: {
        divDisplay: 'block',

    },
}

export const SppSel = styled.div`
    display:${_SppSel[ProjectResource.styleMode].divDisplay};
    position: absolute;
    left: 0;
    right: 0;
    top: 50px;
    background: #252E34;
    border-bottom: dashed 1px #7C8084;
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

export const _SppCont = {
    default: {
        divHeight: '100%',
        divBackground: '#252E34',
        divColor: '#fff',
    },
}

export const SppCont = styled.div`
    height:${_SppCont[ProjectResource.styleMode].divHeight};
    background:${_SppCont[ProjectResource.styleMode].divBackground};
    color:${_SppCont[ProjectResource.styleMode].divColor};
`;

/*********************************************************************/

export const _SppLft = {
    default: {
        divWidth: '200px',
        divHeight: '90%',

    },
}

export const SppLft = styled.div`
    width: ${_SppLft[ProjectResource.styleMode].divWidth};
    height:${_SppLft[ProjectResource.styleMode].divHeight};
    float: left;
    position: relative;
    margin-top: 60px;
    -webkit-box-shadow: 0px 2px 15px 0px rgba(0,0,0,0.25);
    -moz-box-shadow: 0px 2px 15px 0px rgba(0,0,0,0.25);
    box-shadow: 0px 2px 15px 0px rgba(0,0,0,0.25);
    padding: 10px 0px 0px 10px;
    overflow-y: auto;

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

    .h5 {
        font-size: 16px;
    }
    
    .treeview > li > ul h5 {
        font-size: 16px;
        position: relative;
        top: 3px;
    }

    li {
        font-size: 14px;
    }
`;


/*********************************************************************/

export const _SppRht = {
    default: {
        divWidth: '730px',
        divHeight: '100%',

    },
}

export const SppRht = styled.div`
    width:${_SppRht[ProjectResource.styleMode].divWidth};
    height:${_SppRht[ProjectResource.styleMode].divHeight};
    float: left;
    position: relative;
    padding-top: 30px;
    padding-bottom: 59px;
`;


/*********************************************************************/

export const _SppRhtDelete = {
    default: {
        divWidth: '730px',
        divHeight: '100%',

    },
}

export const SppRhtDelete = styled.div`
    width:${_SppRhtDelete[ProjectResource.styleMode].divWidth};
    height:${_SppRhtDelete[ProjectResource.styleMode].divHeight};
    float: left;
    position: relative;
    padding-bottom: 59px;
    padding-left: 20px;
    padding-top: 60px;
`;

/*********************************************************************/

export const _SpprCont = {
    default: {


    },
}

export const SpprCont = styled.div`
      /* padding: 20px;
      margin-top: 20px; */

`;

/*********************************************************************/

export const _SpprCont2 = {
    default: {


    },
}

export const SpprCont2 = styled.div`
      padding: 20px;
      margin-top: 10px;
      background: #252E34;

`;

/*********************************************************************/

export const _ScTb = {
    default: {


    },
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

export const _SpprBot = {
    default: {


    },
}

export const SpprBot = styled.div`
     text-align: right;
     padding: 10px 15px;
     position: absolute;
     left: 0;
     right: 0;
     bottom: 0;
     border-top: 1px dashed #707070;
     > a{
          display: inline-block;
          /* width: 57px; */
          height: 30px;
          line-height: 30px;
          text-align: center;
          background: #20DFA8;
          color: #000000;
          font-size: 12px;
          font-weight: 700;
          padding: 0 25px;
          border-radius: 4px; -moz-border-radius: 4px; -webkit-border-radius: 4px;
          cursor: pointer;
     }
`;


/*********************************************************************/

export const _SpprBotSave = {
    default: {


    },
}

export const SpprBotSave = styled.div`
     text-align: right;
     padding: 10px 20px;
     position: absolute;
     left: 0;
     right: 0;
     bottom: 0;
     border-top: 1px dashed #707070;

     > label{
          margin-right: 20px;
          font-size: 12px;
     }
     .save{
          display: inline-block;
          width: 57px; 
          height: 23px;
          line-height: 23px;
          text-align: center;
          background: #20DFA8;
          color: #202020;
          font-size: 12px;
          font-weight: 700;
          border-radius: 4px; -moz-border-radius: 4px; -webkit-border-radius: 4px;
          cursor: pointer;
     }
     .cancel{
          display: inline-block;
          width: 57px; 
          height: 23px;
          line-height: 23px;
          text-align: center;
          background: #000000;
          color: #B4B4B4;
          font-size: 12px;
          font-weight: 700;
          border-radius: 4px; -moz-border-radius: 4px; -webkit-border-radius: 4px;
          cursor: pointer;
          margin-right: 5px;
     }
`;