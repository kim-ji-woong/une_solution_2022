
import styled from 'styled-components';
import ProjectResource from '../../Root/resource/id';

import YeosuIcon from '../../SOPSimulator/img/yeosuLogo.png'
import YeosuIconBlack from '../../SOPSimulator/img/yeosuLogoBlack.png';


export const _TeamSubCont = {
    busan: {


    },
    yeosu: {


    }
}

export const TeamSubCont = styled.div`
     width: 100%;
     height: 100vh;
     /* background: #f7f7f7; */
     position: relative;
     overflow: hidden;
     padding-top: 100px;

    .scrollbar{
       overflow-y: auto;
       height: calc(100vh - 280px);
       margin-top: 40px;
       padding-right: 4px;
    }

    .scrollbar::-webkit-scrollbar {
        width: 4px;
        border-radius: 5px;
        background-color: #f5f5f5;
    }
    .scrollbar::-webkit-scrollbar-thumb {
        width: 4px;
        border-radius: 5px;
        background: #c8c8c8;    /* #26395B */
    }
    .scrollbar::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }

    .scWrap {
        min-height: 700px;
        padding: 15px;
     }
    .scCont {
        /* border: solid 1px #dbdde2; */
        background: #fff;
        padding: 24px;
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
     }
    .scCont:after {
        content: '';
        display: table;
        clear: both;
     }
    .scTop {}
    .scTop:after {
        content: '';
        display: table;
        clear: both;
     }
    .scTop h4 {
        /* float: left; */
        font-size: 18px;
        font-weight: 700;
        height: 38px;
        line-height: 38px;
        color:#19A5FF;
        font-family: 'Pretendard';
     }

    .sctRht {
         /* float: right; */
     }
    .sctRht:after {
        content: '';
        display: table;
        clear: both;
    }
    .sctRht button,
    .sctRht a {
	    float: left;
        display: block;
        height: 38px;
        line-height: 36px;
        text-align: center;
        border: solid 1px #ccc;
        background: #fff;
        text-align: center;
	    /* padding: 0 15px; */
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
    }
    .sctRht a:hover,
    .sctRht a:active,
    .sctRht a:focus {
        border-color: #555;
        color: #000;
     }
    .sctRht a.sctAdd {
        display: inline-block;
        width: 55px;
        height: 55px;
        line-height: 55px;
        border-radius: 5px;
        border:solid 1px #19A5FF;
		margin-right: 4px;
        cursor: pointer;
        color: #19A5ff;
        text-align: center;
     }
    .sctRht a.sctDel {
        display: inline-block;
        width: 55px;
        height: 55px;
        line-height: 55px;
        border-radius: 5px;
        border:solid 1px #FF5A5A;
		margin-right: 10px;
        cursor: pointer;
        color: #FF5A5A;
        text-align: center;
     }
    .sctSch {
        float: left;
        display: block;
        margin-right: 10px;
        cursor: pointer;
     }
    .sctSch:after {
        content: '';
        display: table;
        clear: both;
     }
    .sctSch input[type="text"] {
        display: block;
        margin-right: 4px;
        width: 470px;
        height: 54px;
        float: left;
        background: #F5F5F5;
        border-radius: 5px;
        border: solid 1px #F5F5F5;
     }
    .sctSch button,
    .sctSch a {
        background: #19A5FF;
        border-color: #19A5FF;
        color: #fff;
        width: 55px;
        height: 55px;
        line-height: 55px;
        border-radius: 5px;
    }
    .sctSch button:hover,
    .sctSch button:active,
    .sctSch button:focus,
    .sctSch a:hover,
    .sctSch a:active,
    .sctSch a:focus {
        /* background: #222; border-color: #222; color: #fff; */
    }

    .scTb input[type="checkbox"]{
         display: inline-block;
         background: none;
         width:18px;
         height:18px;
     }
    .scTb input[type="checkbox"]:checked{
         background:url(../image/icon/checkbox_pup.png) no-repeat center center;
         background-size: 18px auto !important;
     }
    .addPointer tr:last-child {
         border: solid 3px #457de9;
     }
    .scTb th .scTb td {
         border: solid 1px #dfdfdf;
     }
    .scTb {
          /*border-left: solid 2px #fff; border-right: solid 2px #fff;*/ /* border-top: solid 2px #555; */
          /* margin-top: 40px; */
     }
    .scTb th,
    .scTb td {
          text-align: center;
          height: 48px;
          vertical-align: middle;
     }
    .scTb th {
          /* background: #f7f7f7; color: #888; padding:5px; */
          font-weight: 400;
          font-family: 'Pretendard';
     }
    .scTb td { border: solid 1px #F5F5F5; }
    .scTb td input[type="checkbox"] {}
    .scTb td select {
          display: block;
          width: 100%;
          height: 48px;
          border: solid 1px #E3E3E3;
          box-shadow: 1px 2px 1px #E3E3E3;
    }
    .scTb td input[type="text"] {
          display: block;
          width: 100%;
          text-align: center;
          height:30px;
          border: none;
          font-family: 'Pretendard';
     }
    .scTb td span {
          display: block;
          padding: 5px 0;
          text-overflow: ellipsis;
          font-weight: 400;
          font-family: 'Pretendard';
          font-size: 14px;
     }
    .scTb td span.fixation {
          padding: 8px;
    }
    .scTb.ds tr th,
    .scTb.ds tr td {
          padding: 10px;
          font-size: 18px;
     }
    .scTb.ds tr.on {
          background: #f7fcfb;
     }
    .scTb.ds tr.on td {
          color: #009c79;
          text-decoration: underline;
          font-weight: 500;
     }
    .memberThead{
          background: #26395B;
          height: 44px;
          line-height: 30px;
          color: #fff;
          font-family: 'Pretendard';
          font-size: 14px;
    }


    .scTbb { border-top:none; margin-top: 10px; table-layout: fixed; word-break: break-all;}
    .scTbb th { background: #3b3f5c; border: solid 1px #3B3F5C; color: #fff;}
    .scTbb td { border: solid 1px #3B3F5C; color: #fff; max-height: 47px;}
    .scTbb input[type="text"] { background: #162235; border: solid 1px #3b3f5c; text-overflow: ellipsis;}
    .scTbb td span {text-transform: capitalize; line-height: 100%; text-overflow: ellipsis;}
    .scTbb input[type="selectbox"] {background: #0A0B17; border: none; width: 130px; height: 38px;}

    .scTbb select { background: url(../image/icon/select_arrow_.png) no-repeat; background-position: 105%; background-position-y: center;
                    background-size: 40px; background-color: #162235; border: solid 1px #3b3f5c;}

`;


export const _YeosuLogoBox = {
    busan: {
        divWidth: '151px',
        divHeight: '41px',
    },
    yeosu: {
        divWidth: '151px',
        divHeight: '41px',
    }
}

export const YeosuLogoBox = styled.div`
      display: inline-block;
      width:${_YeosuLogoBox[ProjectResource.styleMode].divWidth};
      height:${_YeosuLogoBox[ProjectResource.styleMode].divHeight};
      background: url(${YeosuIcon})no-repeat center center;
      position:absolute;
      left: 30px;
      top: 20px;
`;

export const YeosuLogoBlackBox = styled.div`
      display: inline-block;
      width: 151px;
      height: 41px;
      background: url(${YeosuIconBlack})no-repeat center center;
      position:absolute;
      left: 30px;
      top: 20px;
`;