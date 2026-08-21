import styled from "styled-components";
import PR from "../../Root/resource/id";

import "../../Common/css/commonWonik.scss";

import aside_home_mask from '../../Common/img/common/aside_home_mask.png';
import aside_ico0101_on from '../../Common/img/common/aside_ico0101_on.png';
import aside_ico0102_on from '../../Common/img/common/aside_ico0102_on.png';
import aside_ico0201_on from '../../Common/img/common/aside_ico0201_on.png';
import aside_ico0301_on from '../../Common/img/common/aside_ico0301_on.png';
import aside_ico0302_on from '../../Common/img/common/aside_ico0302_on.png';
import aside_ico0303_on from '../../Common/img/common/aside_ico0303_on.png';
import aside_ico0401_on from '../../Common/img/common/aside_ico0401_on.png';
import aside_ico0402_on from '../../Common/img/common/aside_ico0402_on.png';
import aside_ico0501_on from '../../Common/img/common/aside_ico0501_on.png';
import aside_ico0101 from '../../Common/img/common/aside_ico0101.png';
import aside_ico0102 from '../../Common/img/common/aside_ico0102.png';
import aside_ico0201 from '../../Common/img/common/aside_ico0201.png';
import aside_ico0301 from '../../Common/img/common/aside_ico0301.png';
import aside_ico0302 from '../../Common/img/common/aside_ico0302.png';
import aside_ico0303 from '../../Common/img/common/aside_ico0303.png';
import aside_ico0401 from '../../Common/img/common/aside_ico0401.png';
import aside_ico0402 from '../../Common/img/common/aside_ico0402.png';
import aside_ico0501 from '../../Common/img/common/aside_ico0501.png';
import aside_select_arrow from '../../Common/img/common/aside_select_arrow.png';

import plus_gray_hover from '../image/plus-gray_hover-01.png';
import plus_gray from '../image/plus-gray-01.png';
import pencil_gray from '../image/pencil_gray-01.png'; 
import pencil_gray_hover from '../image/pencil_gray_hover-01.png'; 
import minus_gray from '../image/minus-gray-01.png';
import minus_gray_hover from '../image/minus-gray_hover-01.png';

import checkbox_pup from '../../Common/image/icon/checkbox_pup.png';
import info_ico from '../../Common/img/common/info_ico.png';
import TeamSearchIcon from '../../Common/img/imghydrogen/teamSearchIcon.png';
import TitleBarIcon from '../../Common/img/imghydrogen/H_titleBarIcon.png';

import teamUpIcon from '../../Common/img/imgGyeonggi/upLoad_icon.svg';
import teamDownIcon from '../../Common/img/imgGyeonggi/downLoad_icon.svg';

import sortIcon from '../image/sortIcon.png';
import moveMemberIcon from '../image/moveMemberIcon.svg';


/**********************************************************************/

export const _TeamEditorComponent = {
    soulbrain: {
        subAsideWidth: '430px',
        subPagePaddingLeft: '430px',
        subAsideBackground: '#fff',
        sarTreeViewiBackColor: '#333',
        sarTreeViewiFocusBackColor: '#fff',
        subAsideTop: '0px',
        sarTreeviewUlPaddingLeft: '15px',
        sarTreeViewLiUlH5MarginTop: '1px',
    },
    Wonik: {
        subAsideWidth: '430px',
        subPagePaddingLeft: '430px',
        subAsideBackground: '#fff',
        sarTreeViewiBackColor: '#333',
        sarTreeViewiFocusBackColor: '#fff',
        subAsideTop: '0px',
        sarTreeviewUlPaddingLeft: '15px',
        sarTreeViewLiUlH5MarginTop: '2px',
    },
    Hydrogen: {
        subAsideWidth: '280px',
        subPagePaddingLeft: '280px',
        subAsideBackground: '#0E212A',
        sarTreeColor: '#FFF',
        sarTreeFontSize: '14px',
        sarTreeTreeViewFontSize: '14px',
        sarTreeViewiBackColor: '#fff',
        sarTreeViewiFocusBackColor: '#000000',
        subAsideTop: '10px',
        sarTreeviewUlPaddingLeft: '24px',
        sarTreeViewLiUlH5MarginTop: '2px',
    },
    Gyeonggi: {
        subAsideWidth: '353px',
        subPagePaddingLeft: '353px',
        subAsideBackground: '#fff',
        sarTreeViewiBackColor: '#333',
        sarTreeViewiFocusBackColor: '#fff',
        subAsideTop: '0px',
        sarTreeviewUlPaddingLeft: '15px',
        sarTreeViewLiUlH5MarginTop: '2px',
    }
}

export const TeamEditorComponent = styled.div`
    .teamEditorName{
        position: absolute;
        left: 165px;
        top: 24px;
        z-index: 99;
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        display: flex;
        align-items: center;
    }

    .teamEditorNameIcon{
        display: inline-block;
        width: 24px;
        height: 24px; 
        background: url(${TitleBarIcon})no-repeat 10% center;
        margin-left: 10px; 
    }

    #subPage {
        position: relative;
        width: 100%;
        height: calc(100vh - 50px);
        padding-top: 0px;
        /* padding-left: 430px; */
        padding-left: ${_TeamEditorComponent[PR.styleMode].subPagePaddingLeft};
        min-width: 1800px;
    }

    #subAside {
        position: absolute;
        left: 0;
        /* top: 0px; */
        top: ${_TeamEditorComponent[PR.styleMode].subAsideTop};
        bottom: 0;
        z-index: 9;
        /* background: #fff; */
        background: ${_TeamEditorComponent[PR.styleMode].subAsideBackground};
        /* width: 430px; */
        width: ${_TeamEditorComponent[PR.styleMode].subAsideWidth};
        -webkit-box-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.25);
        -moz-box-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.25);
        box-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.25);
    }

    #subAside:after {
        content: "";
        display: table;
        clear: both;
    }

    .addPointer tr:last-child {
        border: solid 3px #457de9;
    }

    .scrollbar {
        overflow-y: auto
    }

    .scrollbar::-webkit-scrollbar {
        width: 10px;
        background: none
    }

    .scrollbar::-webkit-scrollbar-thumb {
        background: #bbb;
        opacity: .4
    }

    .scrollbar::-webkit-scrollbar-track {
        background: none
    }

    .sarTree {
        padding: 15px;
        cursor: pointer;
        color: ${_TeamEditorComponent[PR.styleMode].sarTreeColor};
        font-size: ${_TeamEditorComponent[PR.styleMode].sarTreeFontSize};
    }
    .treeview > li {
        margin-bottom: 10px;
        position:relative;
     }  /* 0106 */
    .treeview > li:last-child {
        margin-bottom: 0;
    }
    .treeview i {
        display: inline-block;
        vertical-align: top;
        width: 20px;
        height: 20px;
        margin-right: 6px;
        border: solid 1px #888;
        position: relative;
        cursor: pointer;
        text-indent: -9999px;
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
    }
    .treeview i:before,
    .treeview i:after {
        content: '';
        display: block;
        /* background: #333; */
        background: ${_TeamEditorComponent[PR.styleMode].sarTreeViewiBackColor};
        position: absolute;
        left: 50%;
        top: 50%;
    }
    .treeview i:before {
        width: 10px;
        height: 2px;
        margin-top: -1px;
        margin-left: -5px;
    }
    .treeview i:after {
        width: 2px;
        height: 10px;
        margin-top: -5px;
        margin-left: -1px;
        display: none;
    }
    .treeview i.fa-plus:after {
        display: block;
    }
    .treeview i.fa-minus,
    .treeview i:hover,
    .treeview i:active,
    .treeview i:focus {
       /* background: #333; */
        background: ${_TeamEditorComponent[PR.styleMode].sarTreeViewiBackColor};
        border-color: #333;
    }
    .treeview i.fa-minus:before,
    .treeview i.fa-minus:after,
    .treeview i:hover:before,
    .treeview i:hover:after,
    .treeview i:active:before,
    .treeview i:active:after,
    .treeview i:focus:before,
    .treeview i:focus:after {
        /* background: #fff; */
        background: ${_TeamEditorComponent[PR.styleMode].sarTreeViewiFocusBackColor};
    }
    .treeview ul {
        margin-top: 5px;
         /* padding-left: 15px; */
        padding-left: ${_TeamEditorComponent[PR.styleMode].sarTreeviewUlPaddingLeft};
        margin-bottom: 10px;

    }
    .treeview > li > h5 {
        display: inline-block;
        vertical-align: top;
         /* font-size: 18px; */
        font-size: ${_TeamEditorComponent[PR.styleMode].sarTreeTreeViewFontSize};
        line-height: 22px;
         /* max-width: 75%; */
        margin-top: 0px;
        cursor: pointer;
         /* width: calc(100% - 10%); */
     }  /* 0106 */
    .treeview > li > h5:hover,
    .treeview > li > h5:active,
    .treeview > li > h5:focus {
        text-decoration: underline;
    }
    .treeview i:hover ~ h5,
    .treeview i:active ~ h5,
    .treeview i:focus ~ h5 {
        text-decoration: underline;
    }
    .treeview > li > ul li {
        margin-bottom: 5px;
        position:relative;
    } /* 0106 */
    .treeview > li > ul li:last-child {
        margin-bottom: 0;
    }
    .treeview a {
        display: inline-block;
        /* padding-left: 15px; */
        padding-left: 24px;
        font-size: ${_TeamEditorComponent[PR.styleMode].sarTreeTreeViewFontSize};
        padding-right: 10px;
        cursor: pointer;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow:hidden;
        max-width: calc(100% - 9%);
    }
    /* .treeview a:before {
        content: '';
        display: block;
        width: 3px;
        height: 3px;
        background: #333;
        position: absolute;
        left: 7px;
        top: 11px;
    } */ /* 0105 */
    .treeview a:focus,
    .treeview a:hover {
        text-decoration: underline;
    }
    .treeview > li > ul h5 {
        display: inline-block;
        vertical-align: top;
         /* font-size: 18px; */
        font-size: ${_TeamEditorComponent[PR.styleMode].sarTreeTreeViewFontSize};
         /* max-width: 75%; */
        max-width:82%;
         /* margin-top: -2px; */
        margin-top: ${_TeamEditorComponent[PR.styleMode].sarTreeViewLiUlH5MarginTop};
        cursor: pointer;
        /* width:calc(100% - 13%); */
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
    }  
    .treeview > li > ul h5:hover,
    .treeview > li > ul h5:active,
    .treeview > li > ul h5:focus {
        text-decoration: underline;
    }
    .treeview i ~ a {
        display: inline-block;
        vertical-align: top;
        font-size: 18px;
        line-height: 22px;
        max-width: 75%;
        margin-top: -2px;
        cursor: normal;
        padding-left: 0;
    }
    .treeview i ~ a:before {
        display: none;
    }
    .treeview i ~ a:hover,
    .treeview i ~ a:active,
    .treeview i ~ a:focus {
        text-decoration: underline;
        font-weight: 700;
        background: none;
    }

    .treeview.wk a:focus,
    .treeview.wk a:hover {
        background: #000;
        color: #fff;
        text-decoration: none;
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
    }
    .treeview.wk a:focus:before,
    .treeview.wk a:hover:before {
        background: #fff;
    }
    .treeview.wk i ~ a {
        display: inline-block;
        vertical-align: top;
        font-size: 18px;
        line-height: 22px;
        max-width: 75%;
        margin-top: -2px;
        cursor: normal;
        padding-left: 0;
    }
    .treeview.wk i ~ a:before {
        display: none;
    }
    .treeview.wk i ~ a:hover,
    .treeview.wk i ~ a:active,
    .treeview.wk i ~ a:focus {
        text-decoration: underline;
        font-weight: 700;
        background: none;
        color: #333;
    }

    .treeview.wkd a {color: #aaa;}
    .treeview.wkd a:focus {
        text-decoration: none;
        color: #000;
        font-weight: 700;
    }
`;


/**********************************************************************/

export const _TeamEditorContentComponent = {
    soulbrain: {
        aslWrapTypeHBackground: '#162235',
    },
    Wonik: {
        aslWrapTypeHBackground: 'var(--dashboard-color)',
    },
    Hydrogen: {
        aslWrapTypeHBackground: 'var(--dashboard-color)',
        saLeftDisplay: 'none',
    },
    Gyeonggi: {
        aslWrapTypeHBackground: 'var(--dashboard-color)',
    }
}

export const TeamEditorContentComponent = styled(TeamEditorComponent)`
    float: left;
    width: 120px;
    border-right: solid 1px #d9d9d9;
    height: 100%;
    display: ${_TeamEditorContentComponent[PR.styleMode].saLeftDisplay};

    .aslWrap.typeH {
        background: ${_TeamEditorContentComponent[PR.styleMode].aslWrapTypeHBackground};
    }

    .aslWrap.typeH .salCont dd a:hover,
    .aslWrap.typeH .salCont dd a:active,
    .aslWrap.typeH .salCont dd a:hover {
        cursor: pointer;
        background: #070d17;
    }

    .aslWrap.typeH .salCont dd {
        margin-bottom: 5px;
    }

    .aslWrap.typeH .salCont dd:last-child {
        margin-bottom: 0;
    }

    .aslWrap.typeH .salCont dd a {
        display: block;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #fff;
        background: rgba(59, 63, 92, 0.5);
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
    }

    .aslWrap.typeH .salCont dd a.disabled {
        display: block;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #8e8e8e;
        background: rgba(88, 88, 88, 0.5);
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
        cursor: default;
    }

    .salHome {
        display: block;
        height: 100px;
        border-bottom: solid 1px #eee;
        background: url(${aside_home_mask}) no-repeat center center;
        text-indent: -9999px;
    }

    .salMenu {
        background: #fff;
    }
    
    .salMenu.on {
        background: none;
    }

    .salMenu.on .salIco {
        color: #fff;
        background: none;
    }

    .salMenu.on .salIco:after {
        content: "";
        display: block;
        height: 1px;
        position: absolute;
        left: 10px;
        right: 10px;
        bottom: 0;
        background: rgba(0, 0, 0, 0.2);
    }

    .salMenu.on .salCont {
        display: block;
    }

    .salMenu.on .salIco.ico0101:before {
        background: url(${aside_ico0101_on}) no-repeat center
        center;
    }

    .salMenu.on .salIco.ico0102:before {
        background: url(${aside_ico0102_on}) no-repeat center
        center;
    }

    .salMenu.on .salIco.ico0201:before {
        background: url(${aside_ico0201_on}) no-repeat center
        center;
    }

    .salMenu.on .salIco.ico0301:before {
        background: url(${aside_ico0301_on}) no-repeat center
        center;
    }

    .salMenu.on .salIco.ico0302:before {
        background: url(${aside_ico0302_on}) no-repeat center
        center;
    }

    .salMenu.on .salIco.ico0303:before {
        background: url(${aside_ico0303_on}) no-repeat center
        center;
    }

    .salMenu.on .salIco.ico0401:before {
        background: url(${aside_ico0401_on}) no-repeat center
        center;
    }

    .salMenu.on .salIco.ico0402:before {
        background: url(${aside_ico0402_on}) no-repeat center
        center;
    }

    .salMenu.on .salIco.ico0501:before {
        background: url(${aside_ico0501_on}) no-repeat center
        center;
    }

    .salIco.ico0101:before {
        background: url(${aside_ico0101}) no-repeat center center;
    }

    .salIco.ico0102:before {
        background: url(${aside_ico0102}) no-repeat center center;
    }

    .salIco.ico0201:before {
        background: url(${aside_ico0201}) no-repeat center center;
    }

    .salIco.ico0301:before {
        background: url(${aside_ico0301}) no-repeat center center;
    }

    .salIco.ico0302:before {
        background: url(${aside_ico0302}) no-repeat center center;
    }

    .salIco.ico0303:before {
        background: url(${aside_ico0303}) no-repeat center center;
    }

    .salIco.ico0401:before {
        background: url(${aside_ico0401}) no-repeat center center;
    }

    .salIco.ico0402:before {
        background: url(${aside_ico0402}) no-repeat center center;
    }

    .salIco.ico0501:before {
        background: url(${aside_ico0501}) no-repeat center center;
    }

    .salIco {
        display: block;
        height: 100px;
        text-align: center;
        position: relative;
        font-size: 15px;
        padding-top: 22px;
        cursor: default;
    }

    .salIco:before {
        content: "";
        display: block;
        width: 34px;
        height: 34px;
        margin: 0 auto;
        margin-bottom: 3px;
    }
`;


/**********************************************************************/


export const _DisplayMenuComponent = {
    soulbrain: {
        selectColor: '#329cd6',
        saRightWidth: '310px',
        sarSelButtonBackColor: '#fff',
        sarSelButtonBorderBottom: '#e5e5e5',
        sarSelButtonFontSize: '24px',
        sarSelButtonAfterBackground: `url(${aside_select_arrow}) no-repeat center bottom`,
        wordlengthFontSize: '16px',
    },
    Wonik: {
        selectColor: 'var(--title-bar-text-blue-color)',
        saRightWidth: '310px',
        sarSelButtonBackColor: '#fff',
        sarSelButtonBorderBottom: '#e5e5e5',
        sarSelButtonFontSize: '24px',
        sarSelButtonAfterBackground: `url(${aside_select_arrow}) no-repeat center bottom`,
        wordlengthFontSize: '16px',
    },
    Hydrogen: {
        selectColor: 'var(--title-bar-text-blue-color)',
        saRightWidth: '280px',
        sarSelButtonBackColor: '#0E212A',
        sarSelButtonColor: '#fff',
        sarSelButtonBorderBottom: 'dashed 1px #525868',
        sarSelButtonFontSize: '16px',
        sarSelButtonAfterBackground: 'none',
        wordlengthFontSize: 'auto',
    },
    Gyeonggi: {
        selectColor: 'var(--title-bar-text-blue-color)',
        saRightWidth: '233px',
        sarSelButtonBackColor: '#fff',
        sarSelButtonBorderBottom: '#e5e5e5',
        sarSelButtonFontSize: '24px',
        sarSelButtonAfterBackground: `url(${aside_select_arrow}) no-repeat center bottom`,
        wordlengthFontSize: '18px',
    }
}

export const DisplayMenuComponent = styled(TeamEditorComponent)`
    float: left;
    /* width: 310px; */
    width: ${_DisplayMenuComponent[PR.styleMode].saRightWidth};
    height: 100%;
    position: relative;
    /* padding-top: 110px; */
    padding-top: 60px;
    overflow: hidden;

    &.pt60 {
        padding-top: 60px;
    }

    .sarSel {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        cursor: pointer;
    }

    .sarSel button {
        display: block;
        position: relative;
        width: 100%;
        height: 60px;
        text-align: left;
        /* background: #fff; */
        background: ${_DisplayMenuComponent[PR.styleMode].sarSelButtonBackColor};
        /* font-size: 24px; */
        font-size: ${_DisplayMenuComponent[PR.styleMode].sarSelButtonFontSize};
        font-weight: 700;
        padding-left: 20px;
        /* border-bottom: solid 1px #e5e5e5; */
        border-bottom: ${_DisplayMenuComponent[PR.styleMode].sarSelButtonBorderBottom};
        color: ${_DisplayMenuComponent[PR.styleMode].sarSelButtonColor};
    }

    .sarSel button:after {
        content: "";
        display: block;
        width: 20px;
        height: 12px;
        position: absolute;
        right: 20px;
        top: 50%;
        margin-top: -5px;
        /* background: url(${aside_select_arrow}) no-repeat center bottom; */
        background: ${_DisplayMenuComponent[PR.styleMode].sarSelButtonAfterBackground};
        background-size: 100% auto;
    }

    .sarSel button.on:after {
        background-position: center top;
    }

    .sarSel ul {
        position: absolute;
        left: 0;
        right: 0;
        top: 100%;
        z-index: 10;
        background: #fff;
        display: none;
        -webkit-box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
        -moz-box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
    }

    .sarSel ul li {
        border-bottom: solid 1px #e5e5e5;
    }

    .sarSel ul li a {
        display: block;
        padding: 15px 20px;
        font-size: 18px;
    }

    .sarSel ul li a:hover {
        background: #f7f7f7;
    }

    .sarSel h3 {
        height: 60px;
        line-height: 60px;
        border-bottom: solid 1px #e5e5e5;
        font-size: 24px;
        font-weight: 700;
        padding: 0 15px;
    }

    .sarEdit {
        background: #f7f7f7;
        padding: 10px 15px;
        text-align: right;
        width: 100%;
    }

    .sarEditNone{
        display: none;
    }

    .sarEdit a {
        display: inline-block;
        width: 30px;
        height: 30px;
        background: url(${plus_gray}) no-repeat;
        background-size: 100%;
    } 

    .sarEdit a:hover {
        display: inline-block;
        width: 30px;
        height: 30px;
        background: url(${plus_gray_hover}) no-repeat;
        background-size: 100%;
    }

    .sarEdit a.left {
        float: left;
    }

    .sarEdit a:hover,
    .sarEdit a:active,
    .sarEdit a:focus {
        border-color: #555;
        color: #000;
        font-weight: 500;
    }

    .select {
        color: ${_DisplayMenuComponent[PR.styleMode].selectColor};
    }

    .selected {
        color: ${_DisplayMenuComponent[PR.styleMode].selectColor};
    }

    .selected > .editArea > .treeEdit {
        display: inline-block;
        width: 23px;
        height: 20px;
        background: url(${pencil_gray}) no-repeat;
        background-size: 65%;
        background-position-x: 10px;
        background-position-y: 1px;
        margin-left: 5px;
        margin-right: 2px;
    }
    .selected > .editArea > .treeEdit:hover {
        display: inline-block;
        width: 23px;
        height: 20px;
        background: url(${pencil_gray_hover}) no-repeat;
        background-size: 65%;
        background-position-x: 10px;
        background-position-y: 1px;
        margin-left: 5px;
        margin-right: 2px;
    }

    .selected > .editArea > .treePlus {
        display: block;
        width: 23px;
        height: 20px;
        background: url(${plus_gray}) no-repeat;
        background-size: 60%;
        background-position-x: 9px;
        background-position-y: 2px;
        float: right;
        color: #ffffff;
    }
    .selected > .editArea > .treePlus:hover {
        display: inline-block;
        width: 23px;
        height: 20px;
        background: url(${plus_gray_hover}) no-repeat;
        background-size: 60%;
        background-position-x: 9px;
        background-position-y: 2px;
        color: #ffffff;
    }

    .selected > .editArea > .treeMinus {
        display: block;
        width: 23px;
        height: 20px;
        background: url(${minus_gray}) no-repeat;
        background-size: 60%;
        background-position-x: 9px;
        background-position-y: 2px;
        float: right;
        color: #ffffff;
    }
    .selected > .editArea > .treeMinus:hover {
        display: inline-block;
        width: 23px;
        height: 20px;
        background: url(${minus_gray_hover}) no-repeat;
        background-size: 60%;
        background-position-x: 9px;
        background-position-y: 2px;
        color: #ffffff;
    }

    .selected > .editArea {
        visibility: visible;
        display: inline-block;
        position: absolute;
        right: 0;
    }

    .wordIength {
        display: inline-block;
        /* font-size: 16px; */
        /* font-size: ${_DisplayMenuComponent[PR.styleMode].wordlengthFontSize}; */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: calc(100% - 38%) !important;

    }

    .teamBtnWrap {
        position: absolute;
        bottom: 0;
        width: 100%;
    }

    .teamBtnBox{
        display: flex;
        height: 56px;
        line-height: 20px;
        padding: 19px 20px;
        background: #D9D9D9;
        font-size: 16px;
        font-weight: 500;
        border-bottom: solid 1px #fff;
        cursor: pointer;
    }

    .teamBtnBox p{
        flex: 1;
    }

    .teamBtnBox:last-child{
        border-bottom: none;
    }

    .teamUpIcon{
        display: inline-block;
        width: 18px;
        height: 18px;
        background: url(${teamUpIcon}) no-repeat;
        background-size: cover;
        cursor: pointer;
    }

    .teamDownIcon{
        display: inline-block;
        width: 18px;
        height: 18px;
        background: url(${teamDownIcon}) no-repeat;
        background-size: cover;
        cursor: pointer;
    }
`;


/**********************************************************************/


export const _ContentPageCommon = {
    soulbrain: {
        subContBackColor: '#f7f7f7',
        scContBackColor: '#fff',
        scContBorder: 'solid 1px #dbdde2',
        scTopH4FontSize: '26px',
        scTbThBackColor: '#f7f7f7',
        scTbThPadding: '5px',
        scTbTrBorder: '#525868',
        scTbThBorderColor: '1px solid rgb(235, 235, 235)',
        scTbBorderTop: 'solid 2px #555',
        sctSchInputWidth: '230px',
        sctSchInputHeight: '38px',
        sctSchABackground: '#424242',
        sctSchAColor: '#fff',
        sctRhtAHeight: '38px',
        sctSchAHoverBackground: '#222',
        sctSchAHoverColor: '#fff',
        sctSchAHoverBorderColor: '#222',
        sctSchALineHeight: '38px',
        sctAddLineHeight: '38px',
        sctDelLineHeight: '38px',
        scTbTbodyTdLastBorderRight: '1px solid rgb(235, 235, 235)',
        scTbThLastChildBorder: '1px solid rgb(235, 235, 235)',
        scWrapPadding: '15px',
        scContPadding: '20px',
        sctSchMarginRight: '10px',
    },
    Wonik: {
        subContBackColor: '#f7f7f7',
        scContBackColor: '#fff',
        scContBorder: 'solid 1px #dbdde2',
        scTopH4FontSize: '26px',
        scTbThBackColor: '#f7f7f7',
        scTbThPadding: '5px',
        scTbTrBorder: '#525868',
        scTbThBorderColor: '1px solid rgb(235, 235, 235)',
        scTbBorderTop: 'solid 2px #555',
        sctSchInputWidth: '230px',
        sctSchInputHeight: '38px',
        sctSchABackground: '#424242',
        sctSchAColor: '#fff',
        sctRhtAHeight: '38px',
        sctSchAHoverBackground: '#3B3F5C',
        sctSchAHoverColor: '#fff',
        sctSchAHoverBorderColor: '#222',
        sctSchALineHeight: '38px',
        sctAddLineHeight: '38px',
        sctDelLineHeight: '38px',
        scTbTbodyTdLastBorderRight: '1px solid rgb(235, 235, 235)',
        scTbThLastChildBorder: '1px solid rgb(235, 235, 235)',
        scWrapPadding: '15px',
        scContPadding: '20px',
        sctSchMarginRight: '10px',
    },
    Hydrogen: {
        subContBackColor: '#2D3E46',
        scContBackColor: '#2D3E46',
        scContBorder: 'none',
        scTopH4Color: '#fff',
        scTopH4FontSize: '20px',
        scTbThBackColor: '#273840',
        scTbThPadding: '11px',
        scTbTrBorder: '#525868',
        scTbThBorderColor: 'none',
        scTableBackColor: ' #0E212A',
        scTableBackHeight: 'calc(100% - 47px)',
        scTbThBorderRight: 'dashed 1px #525868',
        scTbBorderTop: 'none',
        scTbTdBorderRight: 'dashed 1px #525868',
        scTbTdBorderBottom: 'dashed 1px #525868',
        scTbTdColor: '#fff',
        sctSchInputWidth: '439px',
        sctSchInputHeight: '31px',
        sctSchInputBackground: '#2D3E46',
        sctSchInputBorderRadius: '3px',
        sctSchInputBorder: 'solid 1px #CCCCCC',
        sctSchABackground: `#424242 url(${TeamSearchIcon})no-repeat center center`,
        sctSchABackgroundSize: '100%',
        sctSchAColor: '#424242',
        sctRhtAWidth: 'auto',
        sctRhtAHeight: '31px',
        sctRhtALineHeight: '31px',
        sctSchAHoverBackground: `#424242 url(${TeamSearchIcon})no-repeat center center`,
        sctSchAHoverColor: '#424242',
        sctSchAHoverBorderColor: 'none',
        scTbTbodyTdLastBorderRight: 'none',
        scTbThLastChildBorder: 'none',
        contentPageCommonTop: '10px',
        scWrapPadding: '0px',
        scContPadding: '18px 33px',
        sctSchAPDisplay: 'none',
        sctSchMarginRight: '0px',
    },
    Gyeonggi: {
        subContBackColor: '#f7f7f7',
        scContBackColor: '#fff',
        scContBorder: 'solid 1px #dbdde2',
        scTopH4FontSize: '26px',
        scTbThBackColor: '#f7f7f7',
        scTbThPadding: '5px',
        scTbTrBorder: '#525868',
        scTbThBorderColor: '1px solid rgb(235, 235, 235)',
        scTbBorderTop: 'solid 2px #555',
        sctSchInputWidth: '230px',
        sctSchInputHeight: '38px',
        sctSchABackground: '#424242',
        sctSchAColor: '#fff',
        sctRhtAHeight: '38px',
        sctSchAHoverBackground: '#3B3F5C',
        sctSchAHoverColor: '#fff',
        sctSchAHoverBorderColor: '#222',
        sctSchALineHeight: '38px',
        sctAddLineHeight: '38px',
        sctDelLineHeight: '38px',
        scTbTbodyTdLastBorderRight: '1px solid rgb(235, 235, 235)',
        scTbThLastChildBorder: '1px solid rgb(235, 235, 235)',
        scWrapPadding: '15px',
        scContPadding: '20px',
        sctSchMarginRight: '10px',
    }
}


export const ContentPageCommon = styled.div`
    width: 100%; /*height: 100%;*/
    height: 100vh;
    /* background: #f7f7f7; */
    background: ${_ContentPageCommon[PR.styleMode].subContBackColor};
    position: relative;
    overflow: hidden;
    top: ${_ContentPageCommon[PR.styleMode].contentPageCommonTop};

    &.sq {
        padding-top: 80px;
    }

    &.bgFFF {
        background: #fff;
    }

    .scrollbar {
        overflow-y: auto;
    }

    .scrollbar::-webkit-scrollbar {
        width: 10px;
        background: none;
    }

    .scrollbar::-webkit-scrollbar-thumb {
        background: #bbb;
        opacity: 0.4;
    }

    .scrollbar::-webkit-scrollbar-track {
        background: none;
    }

    .scWrap {
        min-height: 700px;
        /* padding: 15px; */
        padding: ${_ContentPageCommon[PR.styleMode].scWrapPadding};
        height: 100%;
    }

    .scCont {
        /* border: solid 1px #dbdde2; */
        border: ${_ContentPageCommon[PR.styleMode].scContBorder};
        /* background: #fff; */
        background: ${_ContentPageCommon[PR.styleMode].scContBackColor};
        /* padding: 20px; */
        padding: ${_ContentPageCommon[PR.styleMode].scContPadding};
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
        /* height: 100%; */
    }

    .scCont:after {
        content: "";
        display: table;
        clear: both;
    }

    .scTop {
    }

    .scTop:after {
        content: "";
        display: table;
        clear: both;
    }

    .scTop h4 {
        float: left;
        /* font-size: 26px; */
        font-size: ${_ContentPageCommon[PR.styleMode].scTopH4FontSize};
        font-weight: 700;
        height: 38px;
        line-height: 38px;
        color: ${_ContentPageCommon[PR.styleMode].scTopH4Color};
    }

    .sctRht {
        float: right;
    }

    .sctRht:after {
        content: "";
        display: table;
        clear: both;
    }

    .sctRht button,
    .sctRht a {
        float: left;
        display: block;
        /* height: 38px; */
        width: ${_ContentPageCommon[PR.styleMode].sctRhtAWidth};
        height: ${_ContentPageCommon[PR.styleMode].sctRhtAHeight};
        /* line-height: 36px; */
        line-height: ${_ContentPageCommon[PR.styleMode].sctRhtALineHeight};
        text-align: center;
        border: solid 1px #ccc;
        background: #fff;
        text-align: center;
        padding: 0 15px;
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
        margin-right: 4px;
        cursor: pointer;
        line-height: ${_ContentPageCommon[PR.styleMode].sctAddLineHeight};
    }

    .sctRht a.sctDel {
        margin-right: 10px;
        cursor: pointer;
        line-height: ${_ContentPageCommon[PR.styleMode].sctDelLineHeight};
    }

    .sctRht a.sctDwn {
        margin-right: 4px;
        border-color: #888;
        cursor: pointer;
    }

    .sctRht a.sctDwn:hover,
    .sctRht a.sctDwn:active,
    .sctRht a.sctDwn:focus {
        border-color: #222;
    }

    .sctRht a.sctUld {
        background: #029189;
        border-color: #029189;
        color: #fff;
        cursor: pointer;
    }

    .sctRht a.sctUld:hover,
    .sctRht a.sctUld:active,
    .sctRht a.sctUld:focus {
        background: #126f6e;
    }

    .sctSch {
        float: left;
        display: block;
        /* margin-right: 10px; */
        margin-right: ${_ContentPageCommon[PR.styleMode].sctSchMarginRight};
        cursor: pointer;
    }

    .sctSch:after {
        content: "";
        display: table;
        clear: both;
    }

    .sctSch input[type="text"] {
        display: block;
        margin-right: 4px;
        /* width: 230px;
        height: 38px; */
        width: ${_ContentPageCommon[PR.styleMode].sctSchInputWidth};
        height: ${_ContentPageCommon[PR.styleMode].sctSchInputHeight};
        background: ${_ContentPageCommon[PR.styleMode].sctSchInputBackground};
        border-radius: ${_ContentPageCommon[PR.styleMode].sctSchInputBorderRadius};
        border: ${_ContentPageCommon[PR.styleMode].sctSchInputBorder};
        float: left;
    }

    .sctSch button,
    .sctSch a {
        /* background: #424242; */
        background: ${_ContentPageCommon[PR.styleMode].sctSchABackground};
        background-size: ${_ContentPageCommon[PR.styleMode].sctSchABackgroundSize};
        border-color: #424242;
        /* color: #fff; */
        color: ${_ContentPageCommon[PR.styleMode].sctSchAColor};
        line-height: ${_ContentPageCommon[PR.styleMode].sctSchALineHeight};
    }

    .sctSch button:hover,
    .sctSch button:active,
    .sctSch button:focus,
    .sctSch a:hover,
    .sctSch a:active,
    .sctSch a:focus {
        /* background: #222; */
        /* border-color: #222; */
        /* color: #fff; */
        background: ${_ContentPageCommon[PR.styleMode].sctSchAHoverBackground};
        background-size: ${_ContentPageCommon[PR.styleMode].sctSchABackgroundSize};
        border-color: ${_ContentPageCommon[PR.styleMode].sctSchAHoverBorderColor};
        color: ${_ContentPageCommon[PR.styleMode].sctSchAHoverColor};
    }

    .sctSch a > p {
        /* display: none; */
        display: ${_ContentPageCommon[PR.styleMode].sctSchAPDisplay};
    }

    .scTableBack{
        display: block;
        /* background: #0E212A;
        height: calc(100% - 47px); */
        background: ${_ContentPageCommon[PR.styleMode].scTableBackColor};
        height: ${_ContentPageCommon[PR.styleMode].scTableBackHeight};
    }

    .scTb {
        /*border-left: solid 2px #fff; border-right: solid 2px #fff;*/
        /* border-top: solid 2px #555; */
        border-top: ${_ContentPageCommon[PR.styleMode].scTbBorderTop};
        margin-top: 10px;
    }
    .scTb tr{
        /* border: solid 1px #525868; */
        border: ${_ContentPageCommon[PR.styleMode].scTbTrBorder};
    }

    .scTb th,
    .scTb td {
        text-align: center;
        /* border: solid 1px #ebebeb; */
        border:  ${_ContentPageCommon[PR.styleMode].scTbThBorderColor};
        padding: 5px;
    }

    .scTb tbody td:last-child{
        /* border-right: none; */
        border-right: ${_ContentPageCommon[PR.styleMode].scTbTbodyTdLastBorderRight};
    }

    .scTb th {
        /* background: #f7f7f7; */
        background: ${_ContentPageCommon[PR.styleMode].scTbThBackColor};
        color: #888;
        /* padding: 5px; */
        padding: ${_ContentPageCommon[PR.styleMode].scTbThPadding};
        font-weight: 400;
        border-right: ${_ContentPageCommon[PR.styleMode].scTbThBorderRight};
    }

    .scTb th:last-child{
        /* border: none; */
        border: ${_ContentPageCommon[PR.styleMode].scTbThLastChildBorder};
    }

    .scTb tbody td {
        border-right: ${_ContentPageCommon[PR.styleMode].scTbTdBorderRight};
        border-bottom: ${_ContentPageCommon[PR.styleMode].scTbTdBorderBottom};
        color: ${_ContentPageCommon[PR.styleMode].scTbTdColor};
    }

    .scTb th .sortBtn {
        text-indent: -9999px;
        width: 15px;
        height: 15px;
        background: url(${sortIcon}) no-repeat center center;
        margin-left: 5px;

    }

    .scTb td input[type="checkbox"] {
    }

    .scTb td select {
        display: block;
        width: 100%;
        height: 30px;
    }

    .scTb td input[type="text"] {
        display: block;
        width: 100%;
        text-align: center;
        height: 30px;
    }

    .scTb td span {
        display: block;
        padding: 5px 0;
        text-overflow: ellipsis;
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

    .addPointer tr:last-child {
        border: solid 3px #457de9;
    }
`;


export const RegularMemberPageConponent = styled(ContentPageCommon)`
    .scTb input[type="checkbox"] {
        display: inline-block;
        background: none;
        width: 18px;
        height: 18px;
    }

    .scTb input[type="checkbox"]:checked {
        background: url(${checkbox_pup}) no-repeat center center;
        background-size: 16px auto !important;
    }

    .addPointer tr:last-child {
        border: solid 3px #457de9;
    }

    .scTb th .scTb td {
        border: solid 1px #dfdfdf;
    }
`;

export const _TemporaryMemberPageConponent = {
    soulbrain: {
        sctSchALineHeight: '38px',
    },
    Wonik: {
        sctSchALineHeight: '38px',
    },
    Hydrogen: {
        sctSchADisplay: 'none',
    },
    Gyeonggi: {
        sctSchALineHeight: '38px',
    }
}


export const TemporaryMemberPageConponent = styled(ContentPageCommon)`
    .sctRht a.sctUld {
        background: #3b3f5c;
        border-color: #3b3f5c;
        color: #fff;
        cursor: pointer;
    }

    .sctRht a.sctUld:hover,
    .sctRht a.sctUld:active,
    .sctRht a.sctUld:focus {
        background: #363a54;
        border-color: #363a54;
    }

    .sctSch {
        float: left;
        display: block;
        margin-right: 10px;
        cursor: pointer;
    }

    .sctSch:after {
        content: "";
        display: table;
        clear: both;
    }

    .sctSch input[type="text"] {
        display: block;
        margin-right: 4px;
        width: 230px;
        height: 38px;
        float: left;
    }

    .sctSch button{
        background: #3b3f5c;
        border-color: #3b3f5c;
        color: #fff;
        line-height: ${_TemporaryMemberPageConponent[PR.styleMode].sctSchALineHeight};
    }

    .sctSch a {
        background: #3b3f5c;
        border-color: #3b3f5c;
        color: #fff;
        line-height: ${_TemporaryMemberPageConponent[PR.styleMode].sctSchALineHeight};
        /* display: ${_TemporaryMemberPageConponent[PR.styleMode].sctSchADisplay}; */
    }

    .sctSch button:hover,
    .sctSch button:active,
    .sctSch button:focus,
    .sctSch a:hover,
    .sctSch a:active,
    .sctSch a:focus {
        background: #363a54;
        border-color: #363a54;
        color: #fff;
    }
`;


export const SchedulePageConponent = styled(ContentPageCommon)`
    .sctrSel {
        display: block;
        width: 130px;
        height: 40px;
        float: left;
        margin-right: 4px;
    }

    .scSec {
    }

    .scSec:after {
        content: "";
        display: table;
        clear: both;
    }

    .scsLft {
        float: left;
        width: 75%;
        padding-right: 30px;
    }

    .scsRht {
        float: left;
        width: 25%;
    }

    .scAtcl {
        margin-top: 30px;
    }

    .scAtcl h5 {
        font-size: 20px;
    }

    .sctEdt {
        position: relative;
        padding-right: 45px;
    }

    .sctEdt p {
        line-height: 30px;
    }

    .sctEdt a {
        display: block;
        width: 40px;
        height: 30px;
        line-height: 30px;
        font-size: 13px;
        background: #686868;
        color: #fff;
        position: absolute;
        right: 0;
        top: 0;
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
    }

    .sctEdt a:hover,
    .sctEdt a:active,
    .sctEdt a:focus {
        background: #222;
    }

    .sccInfo {
        display: table;
        width: 100%;
    }

    .sccInfo dt {
        display: table-cell;
        vertical-align: top;
        width: 260px;
        padding: 40px;
        position: relative;
    }

    .sccInfo dt:after {
        content: "";
        display: block;
        width: 120px;
        height: 114px;
        position: absolute;
        right: 0;
        bottom: 20px;
        background: url(${info_ico}) no-repeat center center;
    }

    .sccInfo dt h5 {
        font-size: 30px;
        font-weight: 500;
        line-height: 1.2em;
    }

    .sccInfo dd {
        display: table-cell;
        vertical-align: top;
        background: #fbfbfb;
        padding: 40px;
    }

    .sccInfo dd ul {
        padding-left: 15px;
    }

    .sccInfo dd ul li {
        list-style: decimal;
        margin-bottom: 5px;
    }

    .sccInfo dd p {
        color: #b61a33;
        margin-top: 10px;
        font-weight: 500;
    }
`;

export const MoveMembersComponent = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
    overflow: hidden;
    width: 389px;
    height: 599px;

    .popupBox {
        position: relative;
        width: 389px;
        height: 100%;
        background: rgba(14, 22, 45, 1);
        border: 1px solid #FFFFFF1A;
        border-radius: 6px;
        padding: 60px 20px 20px 20px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
    }

    .popupboxLine {
        background-color: rgba(255, 255, 255, 0.1);
        width: 100%;
        height: 40px;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 5px 5px 0 0;
    }

    .popupBoxTitle {
        font-size: 16px;
        color: #5398FF;
        font-weight: 600;
        margin-bottom: 15px;
        height: 40px;
        line-height: 40px;
        position: absolute;
        top: 0;
        left: 20px;
    }

    .popupBoxX {
        position: absolute;
        right: 20px;
        top: 14px;
        cursor: pointer;
    }
    
    .popupBoxX img {
        width: 12px;
    }

    section {
        .selectedInfo {
            ${props => props.theme.variables.flex('flex-start', 'center')};
            gap: 2px;
            margin-bottom: 12px;

            &::before {
                content: '';
                width: 16px;
                height: 16px;
                background: url(${moveMemberIcon}) no-repeat center center;
                margin-right: 6px;
            }

            p {
                color: #A5A5A5;
                font-size: 12px;
                font-weight: 500;
            }
        }

        .teamInfo {
            width: 100%;
            height: 459px;
            border-radius: 5px;
            border: 1px solid #525868;
            background: #272E42;
            margin-bottom: 8px;

            .head {
                ${props => props.theme.variables.flex('flex-start', 'center')};
                gap: 3px;
                padding: 10px 16px;
                background: #0E162D;
                border-radius: 5px 5px 0 0;

                p {
                    font-size: 14px;
                    line-height: 172%;
                    color: #FFFFFF;
                }
            }

            .body {
                & * {
                    color: #FFFFFF;
                    font-size: 16px;
                    font-weight: 500;
                }
                
                padding: 8px 16px;
                overflow: auto;
                height: calc(100% - 50px);
                ${props => props.theme.variables.scroll()};

                .treeview {

                    > li {
                        margin-bottom: 16px;
                    }

                    a {

                        &.on {
                            color: #5398FF;
                        }
                    }

                    i.fa-minus, i.fa-plus {
                        background: #0E162D;
                        border-color: #0E162D;
                    }
    
                    i::before, i::after {
                        background: #fff;
                    }
                }
            }
        }

        .submit {
            width: 100%;
            text-align: center;

            > button {
                width: 96px;
                height: 35px;
                padding: 9px 23px;
                border-radius: 5px;
                background: linear-gradient(180deg, #5398FF 0%, #005FEC 100%);
                font-size: 14px;
                font-weight: 700;
                color: #FFFFFF;
            }
        }
    }
`;