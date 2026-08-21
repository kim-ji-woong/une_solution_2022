import styled from 'styled-components';
import PR from '../../Root/resource/id';
import '../../Common/css/commonSB.scss';
import '../../Common/css/commonWonik.scss';

import popup_close from '../../Common/image/icon/popup_close.png';
import close_icon from "../../Common/img/sub/dashboard_layer_close.png";


/**********************************************************************/

export const _BeginOptionComponent = {
    soulbrain: {
        sqpContBackground: '#1e3142',
        sqPopBorderRadius: '4px',
        background: 'rgba(0, 0, 0, 0.7)',
        sqpTopColor: '#00eaff',
        sqpBtnBackground: '#ff8400',
        sqpBtnHoverBackground: '#f28000',
        sqpBtnBackground2: '#222a43',
        sqpBtnBackBorder: 'solid 1px #3b3f5c',
        sqpBtnBackHoverground2: '#1c2235',
        sqpTopABackground: `url(${popup_close}) no-repeat center center`,
        sqpTopABackgroundSize: '20px auto',
        sqpTopH4FontWeight: '500',
        sqpTopH4FontSize: '22px',
        sqpTopH4Color: '#fff',
        sqpTopH4Padding: '15px',
        sqpTopBackground: 'rgba(29, 41, 48, 1)',
        sqpTopHeight: '50px',
        sqpTopPFontSize: '18px',
        inputRadioColor: '#1b55e2',
        sqpContWidth: '620px',
        sqpTopPMarginLeft: '30px',
    },
    Wonik: {
        sqpContBackground: 'rgba(14, 22, 45, .8)',
        sqPopBorderRadius: '5px',
        background: 'rgba(0, 0, 0, 0.7)',
        sqpTopColor: 'var(--title-bar-text-blue-color)',
        sqpBtnBackground: `transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box`,
        sqpBtnHoverBackground: `transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box`,
        sqpBtnBackground2: 'var(--navy-color)',
        sqpBtnBackBorder: 'solid 1px var(--dashboard-color)',
        sqpBtnBackHoverground2: 'var(--navy-color)',
        sqpTopABackground: `url(${close_icon}) no-repeat center center`,
        sqpTopABackgroundSize: '12px auto',
        sqpTopH4FontWeight: '600',
        sqpTopH4FontSize: '16px',
        sqpTopH4Color: 'var(--title-bar-text-blue-color)',
        sqpTopH4Padding: '20px',
        sqpTopBackground: 'rgba(255, 255, 255, .1)',
        sqpTopHeight: '40px',
        sqpTopPFontSize: '16px',
        inputRadioColor: '#5398FF',
        sqpContWidth: '620px',
        sqpTopPMarginLeft: '30px',
    },
    Hydrogen: {
        sqpContBackground: 'rgba(14, 22, 45, .8)',
        sqPopBorderRadius: '5px',
        background: 'rgba(0, 0, 0, 0.7)',
        sqpTopColor: 'var(--title-bar-text-blue-color)',
        sqpBtnBackground: `transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box`,
        sqpBtnHoverBackground: `transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box`,
        sqpBtnBackground2: 'var(--navy-color)',
        sqpBtnBackBorder: 'solid 1px var(--dashboard-color)',
        sqpBtnBackHoverground2: 'var(--navy-color)',
        sqpTopABackground: `url(${close_icon}) no-repeat center center`,
        sqpTopABackgroundSize: '12px auto',
        sqpTopH4FontWeight: '600',
        sqpTopH4FontSize: '16px',
        sqpTopH4Color: 'var(--title-bar-text-blue-color)',
        sqpTopH4Padding: '20px',
        sqpTopBackground: 'rgba(255, 255, 255, .1)',
        sqpTopHeight: '40px',
        sqpTopPFontSize: '16px',
        inputRadioColor: '#5398FF',
        sqpContWidth: '630px',
        spqTimeli1Width: '90px',
        spqTimeli3Width: '70px',
        spqTimeli5Width: '70px',
        spqTimeli7Width: '90px',
        spqTimeli9Width: '90px',
        spqTimeli2Width:'8%',
        spqTimeli4Width:'8%',
        spqTimeli6Width: '8%',
        sqpToph4Width: '180px',
        sqpTopDisplay: 'flex',
        sqpTopPWidth: '380px',
        sqpTopPFlex: '1 1',
        sqpTopPMarginLeft: '20px',
    },
    Gyeonggi: {
        sqpContBackground: 'rgba(14, 22, 45, .8)',
        sqPopBorderRadius: '5px',
        background: 'rgba(0, 0, 0, 0.7)',
        sqpTopColor: 'var(--title-bar-text-blue-color)',
        sqpBtnBackground: `transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box`,
        sqpBtnHoverBackground: `transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box`,
        sqpBtnBackground2: 'var(--navy-color)',
        sqpBtnBackBorder: 'solid 1px var(--dashboard-color)',
        sqpBtnBackHoverground2: 'var(--navy-color)',
        sqpTopABackground: `url(${close_icon}) no-repeat center center`,
        sqpTopABackgroundSize: '12px auto',
        sqpTopH4FontWeight: '600',
        sqpTopH4FontSize: '16px',
        sqpTopH4Color: 'var(--title-bar-text-blue-color)',
        sqpTopH4Padding: '20px',
        sqpTopBackground: 'rgba(255, 255, 255, .1)',
        sqpTopHeight: '40px',
        sqpTopPFontSize: '16px',
        inputRadioColor: '#5398FF',
        sqpContWidth: '620px',
        sqpTopPMarginLeft: '30px',
    }
}


export const BeginOptionComponent = styled.div`
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${_BeginOptionComponent[PR.styleMode].background};
    color: #333;

    & > div {
        display: table;
        width: 100%;
        height: 100%;
    }
    & > div > div {
        display: table-cell;
        vertical-align: middle;
    }

    .sqPop {
        background: ${_BeginOptionComponent[PR.styleMode].sqpContBackground};
        /* width: 620px; */ 
        width: ${_BeginOptionComponent[PR.styleMode].sqpContWidth}; 
        margin: 0 auto;
        position: relative;
        overflow: hidden;
        -webkit-box-shadow: 0px 3px 20px 0px rgba(0, 0, 0, 0.2);
        -moz-box-shadow: 0px 3px 20px 0px rgba(0, 0, 0, 0.2);
        box-shadow: 0px 3px 20px 0px rgba(0, 0, 0, 0.2);
        border-radius: ${_BeginOptionComponent[PR.styleMode].sqPopBorderRadius};
        -moz-border-radius: ${_BeginOptionComponent[PR.styleMode].sqPopBorderRadius};
        -webkit-border-radius: ${_BeginOptionComponent[PR.styleMode].sqPopBorderRadius};
    }

    .sqpTop {
        background-color: ${_BeginOptionComponent[PR.styleMode].sqpTopBackground};
        /* display: flex; */
        display: ${_BeginOptionComponent[PR.styleMode].sqpTopDisplay};
    }

    .sqpTop:after {
        content: "";
        display: table;
        clear: both;
    }

    .sqpTop h4 {
        float: left;
        width: ${_BeginOptionComponent[PR.styleMode].sqpToph4Width};
        height: ${_BeginOptionComponent[PR.styleMode].sqpTopHeight};
        line-height: ${_BeginOptionComponent[PR.styleMode].sqpTopHeight};
        color: ${_BeginOptionComponent[PR.styleMode].sqpTopH4Color};
        padding-left: ${_BeginOptionComponent[PR.styleMode].sqpTopH4Padding};
        font-size: ${_BeginOptionComponent[PR.styleMode].sqpTopH4FontSize};
        font-weight: ${_BeginOptionComponent[PR.styleMode].sqpTopH4FontWeight};
    }

    .sqpTop p {
        float: left;
        width: ${_BeginOptionComponent[PR.styleMode].sqpTopPWidth};
        height: ${_BeginOptionComponent[PR.styleMode].sqpTopHeight};
        line-height: ${_BeginOptionComponent[PR.styleMode].sqpTopHeight};
        color: ${_BeginOptionComponent[PR.styleMode].sqpTopColor};
        margin-left: ${_BeginOptionComponent[PR.styleMode].sqpTopPMarginLeft};
        font-size: ${_BeginOptionComponent[PR.styleMode].sqpTopPFontSize};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: ${_BeginOptionComponent[PR.styleMode].sqpTopPFlex};
    }

    .sqpTop a {
        display: block;
        float: right;
        width: 40px;
        height: ${_BeginOptionComponent[PR.styleMode].sqpTopHeight};
        text-indent: -9999px;
        background: ${_BeginOptionComponent[PR.styleMode].sqpTopABackground};
        background-size: ${_BeginOptionComponent[PR.styleMode].sqpTopABackgroundSize};
        cursor: pointer;
    }

    .sqpUp {
        padding: 20px;
        color: #000000;
    }

    .sqpSel {
        display: block;
        width: 100%;
        border-radius: 3px !important;
        color: #fff;
    }

    .sqpChk {
        margin-top: 15px;
    }

    .sqpRdo {
        padding-bottom: 20px;
        margin-bottom: 20px;
        border-bottom: solid 1px #eaeaea;
    }

    .sqpRdo li {
        margin-bottom: 10px;
        color: #fff;
    }

    .sqpRdo li:last-child {
        margin-bottom: 0;
    }

    .sqpRdo li input[type="radio"] {
        color: #000000;
    }

    .sqpRdoWord {
        color: black;
    }

    .sqpDown {
        padding: 20px;
        color: #000000;
    }

    .sqpTime {
        margin: 0 -3px;
        height: 34px;
    }

    .sqpTime:after {
        content: "";
        display: table;
        clear: both;
    }

    .sqpTime li {
        float: left;
        line-height: 40px;
        padding: 0 3px;
        font-size: 14px;
    }

    .sqpTime li select {
        display: block;
        width: 100%;
        height: 34px;
        border-radius: 3px;
        padding-left: 6px;
    }

    .sqpTime li input[type="text"] {
        display: block;
        width: 100%;
    }

    .sqpTime li:nth-child(1) {
        width: 20%;
    }

    .sqpTime li:nth-child(2) {
        /* width: 5%; */
        width: ${_BeginOptionComponent[PR.styleMode].spqTimeli2Width};
        color: #fff;
    }

    .sqpTime li:nth-child(3) {
        width: 20%;
    }

    .sqpTime li:nth-child(4) {
        /* width: 5%; */
        width: ${_BeginOptionComponent[PR.styleMode].spqTimeli4Width};
        color: #fff;
    }

    .sqpTime li:nth-child(5) {
        width: 20%;
    }

    .sqpTime li:nth-child(6) {
        /* width: 5%; */
        width: ${_BeginOptionComponent[PR.styleMode].spqTimeli6Width};
        color: #fff;
    }

    .sqpTime li:nth-child(7) {
        width: 11%;
    }

    .sqpTime li:nth-child(8) {
        width: 3%;
        text-align: center;
        color: #fff;
    }

    .sqpTime li:nth-child(9) {
        width: 11%;
    }

    .sqpTime li:nth-child(1) {
        /* width: 100px; */
        width: ${_BeginOptionComponent[PR.styleMode].spqTimeli1Width};
    }

    .sqpTime li:nth-child(3) {
        /* width: 80px; */
         width: ${_BeginOptionComponent[PR.styleMode].spqTimeli3Width};
    }

    .sqpTime li:nth-child(5) {
        /* width: 80px; */
        width: ${_BeginOptionComponent[PR.styleMode].spqTimeli5Width};
    }

    .sqpTime li:nth-child(7) {
        /* width: 100px; */
        margin-left: 10px;
        width: ${_BeginOptionComponent[PR.styleMode].spqTimeli7Width};
    }

    .sqpTime li:nth-child(9) {
        /* width: 100px; */
        width: ${_BeginOptionComponent[PR.styleMode].spqTimeli9Width};
    }

    .sqpBtn {
        padding-top: 20px;
        margin: 0 -2px;
    }

    .sqpBtn:after {
        content: "";
        display: table;
        clear: both;
    }

    .sqpBtn li {
        float: left;
        width: 50%;
        padding: 0 2px;
    }

    .sqpBtn li a {
        display: block;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #fff;
        font-size: 16px;
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
    }

    .sqpBtn li a.bk {
        background: ${_BeginOptionComponent[PR.styleMode].sqpBtnBackground};
        cursor: pointer;
    }

    .sqpBtn li a.bk:hover,
    .sqpBtn li a.bk:active,
    .sqpBtn li a.bk:focus {
        background: ${_BeginOptionComponent[PR.styleMode].sqpBtnHoverBackground};
    }

    .sqpBtn li a.gry {
        background: ${_BeginOptionComponent[PR.styleMode].sqpBtnBackground2};
        border: ${_BeginOptionComponent[PR.styleMode].sqpBtnBackBorder};
        cursor: pointer;
    }

    .sqpBtn li a.gry:hover,
    .sqpBtn li a.gry:active,
    .sqpBtn li a.gry:focus {
        background: ${_BeginOptionComponent[PR.styleMode].sqpBtnBackHoverground2};
    }

    input[type="radio"]:checked:after {
        content: '';
        display: block;
        background: ${_BeginOptionComponent[PR.styleMode].inputRadioColor};
        position: absolute;
        left: 4px;
        right: 4px;
        top: 4px;
        bottom: 4px;
        border-radius: 50%;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
    }
`;