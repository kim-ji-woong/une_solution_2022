import styled from "styled-components";
import PR from "../../Root/resource/id";
import "../../Common/css/commonSB.scss";

import popup_close from "../../Common/img/common/popup_close.png";
import aside_ico0101_on from "../../Common/img/common/aside_ico0101_on.png";
import aside_ico0102_on from "../../Common/img/common/aside_ico0102_on.png";
import aside_ico0201_on from "../../Common/img/common/aside_ico0201_on.png";
import aside_ico0301_on from "../../Common/img/common/aside_ico0301_on.png";
import aside_ico0302_on from "../../Common/img/common/aside_ico0302_on.png";
import aside_ico0303_on from "../../Common/img/common/aside_ico0303_on.png";
import aside_ico0401_on from "../../Common/img/common/aside_ico0401_on.png";
import aside_ico0402_on from "../../Common/img/common/aside_ico0402_on.png";
import aside_ico0501_on from "../../Common/img/common/aside_ico0501_on.png";
import aside_ico0101 from "../../Common/img/common/aside_ico0101.png";
import aside_ico0102 from "../../Common/img/common/aside_ico0102.png";
import aside_ico0201 from "../../Common/img/common/aside_ico0201.png";
import aside_ico0301 from "../../Common/img/common/aside_ico0301.png";
import aside_ico0302 from "../../Common/img/common/aside_ico0302.png";
import aside_ico0303 from "../../Common/img/common/aside_ico0303.png";
import aside_ico0401 from "../../Common/img/common/aside_ico0401.png";
import aside_ico0402 from "../../Common/img/common/aside_ico0402.png";
import aside_ico0501 from "../../Common/img/common/aside_ico0501.png";
import checkbox_mask from "../../Common/img/common/checkbox_mask.png";
import sop_left_toggle_on from "../../Common/img/sub/sop_left_toggle_on.png";
import sop_tools_toggle from "../../Common/img/sub/sop_tools_toggle.png";
import sop_tools01_on from "../../Common/img/sub/sop_tools01_on.png";
import sop_tools02_on from "../../Common/img/sub/sop_tools02_on.png";
import sop_tools03_on from "../../Common/img/sub/sop_tools03_on.png";
import sop_tools04_on from "../../Common/img/sub/sop_tools04_on.png";
import sop_tools05_on from "../../Common/img/sub/sop_tools05_on.png";
import sop_step_arrow_on from "../../Common/img/sub/sop_step_arrow_on.png";
import sop_left_toggle from "../../Common/img/sub/sop_left_toggle.png";
import sop_bottom_arrow_on from "../../Common/img/sub/sop_bottom_arrow_on.png";
import sop_step_arrow from "../../Common/img/sub/sop_step_arrow.png";
import sop_left_shadow from "../../Common/img/sub/sop_left_shadow.png";
import sop_accordian_arrow from "../../Common/img/sub/sop_accordian_arrow.png";
import sop_edit01 from "../../Common/img/sub/sop_edit01.png";
import sop_edit02 from "../../Common/img/sub/sop_edit02.png";
import sop_edit03 from "../../Common/img/sub/sop_edit03.png";
import sop_edit04 from "../../Common/img/sub/sop_edit04.png";
import sop_edit05 from "../../Common/img/sub/sop_edit05.png";
import sop_edit06 from "../../Common/img/sub/sop_edit06.png";



/**********************************************************************/

export const _SopManagerCommon = {
    soulbrain: {
        sopTitleBackgrounColor: 'var(--colorBkSopTitle)',
    },
    Wonik: {
        sopTitleBackgrounColor: '#457DE9',
    },
    Hydrogen: {
        sopTitleBackgrounColor: '#457DE9',
    },
    Gyeonggi: {
        sopTitleBackgrounColor: '#457DE9',
    }
}

export const SopManagerCommon = styled.div`
    #mnGnb > .mngMenu > li.on > a:after {
        background: #cc0524;
    }

    .mngBtn.on span,
    .mngBtn.on:before,
    .mngBtn.on:after {
        background: #000;
    }

    .mngBtn.on span {
        opacity: 0;
    }

    .mngBtn.on:before {
        margin-top: 0;
        transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
    }

    .mngBtn.on:after {
        margin-top: -32px;
        transform: rotate(-45deg);
        -webkit-transform: rotate(-45deg);
        -moz-transform: rotate(-45deg);
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
        background: url(${aside_ico0101_on}) no-repeat center center;
    }

    .salMenu.on .salIco.ico0102:before {
        background: url(${aside_ico0102_on}) no-repeat center center;
    }

    .salMenu.on .salIco.ico0201:before {
        background: url(${aside_ico0201_on}) no-repeat center center;
    }

    .salMenu.on .salIco.ico0301:before {
        background: url(${aside_ico0301_on}) no-repeat center center;
    }

    .salMenu.on .salIco.ico0302:before {
        background: url(${aside_ico0302_on}) no-repeat center center;
    }

    .salMenu.on .salIco.ico0303:before {
        background: url(${aside_ico0303_on}) no-repeat center center;
    }

    .salMenu.on .salIco.ico0401:before {
        background: url(${aside_ico0401_on}) no-repeat center center;
    }

    .salMenu.on .salIco.ico0402:before {
        background: url(${aside_ico0402_on}) no-repeat center center;
    }

    .salMenu.on .salIco.ico0501:before {
        background: url(${aside_ico0501_on}) no-repeat center center;
    }

    .sarSel button.on:after {
        background-position: center top;
    }

    .scTb.ds tr.on {
        background: #f7fcfb;
    }

    .scTb.ds tr.on td {
        color: #009c79;
        text-decoration: underline;
        font-weight: 500;
    }

    .scprTb tbody tr.on {
        background: #b61a33;
        color: #fff;
    }

    #spLft.on {
        left: -390px;
        transition: all 500ms;
    }

    #splTgl.on {
        background: #345bbf url(${sop_left_toggle_on}) no-repeat center center;
    }

    #spcTgl.on {
        background: #fff url(${sop_tools_toggle}) no-repeat center center;
    }

    .spcEye.on {
        background: #7a7a7a url(${sop_tools01_on}) no-repeat center center;
    }

    .spctList li a.spct02.on {
        background: url(${sop_tools02_on}) no-repeat left center;
    }

    .spctList li a.spct03.on {
        background: url(${sop_tools03_on}) no-repeat left center;
    }

    .spctList li a.spct04.on {
        background: url(${sop_tools04_on}) no-repeat left center;
    }

    .spctList li a.spct05.on {
        background: url(${sop_tools05_on}) no-repeat left center;
    }

    .sopAcdn > dt.on {
        background: #e0e6ff;
    }

    .sopAcdn > dt.on:after {
        background-position: center top;
    }

    .sopAcdn > dd {
        padding: 15px;
        display: none;
    }

    .sopAcdn > dd.on {
        display: block;
    }

    .sopEdtTb tr.on {
        background: #457de9;
        color: #fff;
    }

    .sprmAcdn > dt.on {
        background: #424242;
    }

    .sprmAcdn > dt.on:after {
        background-position: center top;
    }

    .sprmAcdn > dd.on {
        display: block;
    }

    .sprmSusik > dt.on {
        background: #424242;
    }

    .sprmSusik > dt.on:after {
        background-position: center top;
    }

    .sprmSusik > dd.on {
        display: block;
    }

    .spprCont .scTb tbody tr.on {
        background: #345bbf;
        color: #fff;
    }

    .sppsCont.on h4 {
        background: #424242 url(${sop_step_arrow_on}) no-repeat right center;
    }

    .speCont h4.on {
        background: #424242 url(${sop_step_arrow_on}) no-repeat right center;
    }

    #sqTgl.on {
        background: #5332ce url(${sop_left_toggle}) no-repeat center center;
    }

    #sqTgl.typeE.on {
        background: #009479 url(${sop_left_toggle}) no-repeat center center;
    }

    .sqlCont.on h5 {
        background: #424242;
    }

    .sqrfTgl.on {
        background: url(${sop_bottom_arrow_on}) no-repeat center center;
    }

    .dsmAcdn dt.on:after {
        background-position: center top;
    }

    .dsmAcdn dt em.on {
        color: #009c79;
    }

    .dssTop h5.on:after {
        content: "";
        display: inline-block;
        width: 6px;
        height: 6px;
        background: #009c79;
        margin-left: 7px;
        vertical-align: top;
        margin-top: 15px;
        border-radius: 50%;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
    }

    .ctvFav dt.on:after {
        background-position: center top;
    }

    #ctvTgl.on {
        background: #0094a3 url(${sop_left_toggle_on}) no-repeat center center;
    }

    .clickable {
        cursor: pointer;
    }

    .dssInfo dl dd.grn p {
        background: #ea28a3;
    }

    .dssInfo dl dd.grn span b {
        color: #ea28a3;
    }

    .scpTop.grn {
        background: #009c9e;
    }

    .ctvpBot li a.grn {
        background: #009c9e;
    }

    .ctvpBot li a.grn:hover,
    .ctvpBot li a.grn:active,
    .ctvpBot li a.grn:focus {
        background: #094754;
    }

    .scprTb tbody tr.grn {
        cursor: pointer;
    }

    .scprTb tbody tr.grn.on {
        background: #009c9e;
        color: #fff;
    }

    .salCont {
        display: none;
        padding: 30px 10px;
    }

    .salCont dt {
        margin-bottom: 15px;
    }

    .salCont dt input[type="checkbox"] {
        width: 16px;
        height: 16px;
        border: none;
        background: #fff;
    }

    .salCont dt input[type="checkbox"]:checked {
        background: url(${checkbox_mask}) no-repeat center center;
        background-size: 16px auto !important;
    }

    .salCont dt label {
        color: #fff;
        font-size: 16px;
    }

    .salCont dd {
        margin-bottom: 5px;
    }

    .salCont dd:last-child {
        margin-bottom: 0;
    }

    .salCont dd a {
        display: block;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #fff;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
        
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0px 10px;
    }

    .aslWrap.typeA .salCont dd a:hover,
    .aslWrap.typeA .salCont dd a:active,
    .aslWrap.typeA .salCont dd a:focus {
        cursor: pointer;
        background: #3c0911;
    }

    .aslWrap.typeC .salCont dd a:hover,
    .aslWrap.typeC .salCont dd a:active,
    .aslWrap.typeC .salCont dd a:focus {
        background: #0c2159;
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
`;


/**********************************************************************/

export const _SopManagerContentComponent = {
    soulbrain: {

    },
    Wonik: {

    },
    Hydrogen: {
        sopManagerContentMarginTop: '10px',
    },
    Gyeonggi: {

    }
}


export const SopManagerContentComponent = styled(SopManagerCommon)`
    float: left;
    width: 120px;
    border-right: solid 1px #d9d9d9;
    height: 100%;
    margin-top: ${_SopManagerContentComponent[PR.styleMode].sopManagerContentMarginTop};

    .aslWrap.typeA {
        background: #b61a33;
    }

    .aslWrap.typeB {
        background: #ea4e30;
    }

    .aslWrap.typeC {
        background: #457de9;
    }

    .aslWrap.typeD {
        background: #0094a3;
    }

    .aslWrap.typeE {
        background: #009479;
    }

    .aslWrap.typeF {
        background: #27993f;
    }

    .aslWrap.typeG {
        background: #7044d8;
    }

    .aslWrap.typeC .salCont dd:nth-child(3),
    .aslWrap.typeC .salCont dd:nth-child(6) {
        border: ${(props) => props.$disabled === null ? '1px solid #3764BA' : 'none'};
        border-radius: 4px;
    }

    .aslWrap.typeC .salCont dd:nth-child(3) a,
    .aslWrap.typeC .salCont dd:nth-child(6) a {
        color: ${(props) => props.$disabled === null ? '#3764BA' : '#fff'};
        background: ${(props) => props.$disabled === null ? 'transparent' : 'rgba(0, 0, 0, 0.2)'};
    }

    .aslWrap.typeC .salCont dd:nth-child(3) a:hover,
    .aslWrap.typeC .salCont dd:nth-child(6) a:hover {
        background: ${(props) => props.$disabled === null ? '' : '#0c2159'};
        cursor: ${(props) => props.$disabled === null ? 'default !important' : 'pointer'};
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
`;

/**********************************************************************/


export const _SopManagerBodyComponent = {
    soulbrain: {
        sopManagerBodyTop: '0px',
    },
    Wonik: {
        sopManagerBodyTop: '0px',
    },
    Hydrogen: {
        sopManagerBodyTop: '0px',
    },
    Gyeonggi: {
        sopManagerBodyTop: '0px',
    }
}

export const SopManagerBodyComponent = styled.div`
    position: absolute;
    left: 120px;
    width: Calc(100% - 115px);
    background: #fff;
    position: absolute;
    padding-top: 60px;
    /* top: 0px; */
    top: ${_SopManagerBodyComponent[PR.styleMode].sopManagerBodyTop};
    bottom: 65px;

    input[type=radio],
    input[type=checkbox],
    input[type=checkbox]:checked {
        border: solid 1px #ddd;
    }

    #sopTitle {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: 60px;
        line-height: 60px;
        padding: 0 15px;
        color: #222;
        font-size: 24px;
        font-weight: 700;
    }
`;

/**********************************************************************/


export const _SopManagerBodyMainComponent = {
    soulbrain: {
        sopModeWidth: '50px',
    },
    Wonik: {
        sopModeWidth: '50px',
    },
    Hydrogen: {
        sopModeWidth: 'auto',
        sopModePadding: '0px 20px',
    },
    Gyeonggi: {
        sopModeWidth: '50px',
    }
}


export const SopManagerBodyMainComponent = styled(SopManagerCommon)`
    position: relative;
    height: 100%;
    padding-left: 410px;
    padding-right: 410px;
    overflow: hidden;
    transition: all 500ms;

    &.on {
        padding-left: 20px;
        transition: all 500ms;
    }

    .selectSiteText{
        position: relative;
        top: 10px;
        width: 104px;
        user-select: none;
    }

    #spLft {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 390px;
        border: solid 1px #8fb1f2;
        border-left: none;
        transition: all 500ms;
    }

    #spLft:after {
        content: "";
        display: block;
        width: 12px;
        position: absolute;
        top: -1px;
        bottom: 0;
        left: 100%;
        background: url(${sop_left_shadow});
    }

    #splTgl {
        position: absolute;
        z-index: 1;
        top: -1px;
        left: 100%;
        display: block;
        width: 30px;
        height: 51px;
        background: #345bbf url(${sop_left_toggle}) no-repeat center center;
        background-size: 7px auto !important;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        text-indent: -9999px;
        border-radius: 0px 4px 4px 0px;
        -moz-border-radius: 0px 4px 4px 0px;
        -webkit-border-radius: 0px 4px 4px 0px;
        -webkit-box-shadow: 3px 3px 6px 0px rgba(0, 0, 0, 0.45);
        -moz-box-shadow: 3px 3px 6px 0px rgba(0, 0, 0, 0.45);
        box-shadow: 3px 3px 6px 0px rgba(0, 0, 0, 0.45);
    }

    .sopAcdn {
    }

    .sopAcdn > dt {
        height: 51px;
        line-height: 50px;
        background: #f6f7ff;
        border-top: solid 1px #8fb1f2;
        cursor: pointer;
        padding: 0 15px;
        font-size: 18px;
        color: #345bbf;
        font-weight: 700;
        position: relative;
        letter-spacing: -0.075em;
    }

    .sopAcdn > dt:first-child {
        border-top: none;
    }

    .sopAcdn > dt.last {
        border-bottom: solid 1px #8fb1f2;
    }

    .sopAcdn > dt:after {
        content: "";
        display: block;
        width: 12px;
        height: 7px;
        position: absolute;
        right: 15px;
        top: 50%;
        margin-top: -4px;
        background: url(${sop_accordian_arrow}) no-repeat center bottom;
        background-size: 100% auto;
    }

    .sopEdt1 .sopEdtRdo:last-child {
        padding-bottom: 0;
        border-bottom: none;
    }

    .sopEdtRdo {
        padding: 20px 0;
        border-bottom: solid 1px #eaeaea;
    }

    .sopEdtRdo:after {
        ${props => props.theme.variables.clearfix()};
    }

    .sopEdtRdo li {
        float: left;
    }

    .sopEdtRdo.col4 li {
        width: 25%;
    }

    .sopEdtRdo.inline li {
        margin-right: 39px;
    }

    .sopEdtRdo.inline li:last-child {
        margin-right: 0;
    }

    .sopEdtRdo li input[type="radio"] {
    }

    .sopEdtRdo li label {
        font-size: 16px;
    }

    .sopEdtTitle {
        margin-bottom: 10px;
    }

    .sopEdtTitle:after {
        ${props => props.theme.variables.clearfix()};
    }

    .sopEdtTitle span {
        display: block;
        width: 50px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        float: left;
        color: #fff;
        font-size: 16px;
        font-weight: 500;
        margin-right: 10px;
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
    }

    .sopEdtTitle span.grn {
        background: #4fc402;
    }

    .sopEdtTitle span.ylw {
        /*background: #c44f02;*/
        background: #ffc444;
    }

    .sopEdtTitle span.org {
        /*background: #fb6f02;*/
        background: #ff3632;
    }

    .sopEdtTitle span.hpk {
        background: #eb008e;
    }

    /*test******************/

    .sopEdtTitle span.grnTlb {
        background: #4fc402;
    }

    .sopEdtTitle span.ylwTlb {
        background: #F2BE08;
    }

    .sopEdtTitle span.orgTlb {
        background: #FF6D00;
    }

    .sopEdtTitle span.hpkTlb {
        background: #E80800;
    }

    .sopEdtTitle h4 {
        float: left;
        height: 30px;
        line-height: 30px;
        font-size: 20px;
        font-weight: 700;
    }

    .sopEdtCpnt li {
        margin-bottom: 10px;
    }

    .sopEdtCpnt li:last-child {
        margin-bottom: 0;
    }

    .sopEdtCpnt li a {
        display: block;
    }

    .sopEdtCpnt li img {
        vertical-align: middle;
        margin-right: 20px;
        width: 162px;
    }

    .sopEdtCpnt li a span {
        vertical-align: middle;
        font-size: 16px;
    }

    .sopEdtTpy {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
    }

    .sopEdtTpy span {
        display: block;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
    }

    .sopEdtTpy select {
        flex: 1;
        display: block;
        width: auto;
        height: 38px; 
        padding-right: 30px; 
        padding-left: 5px; 
        border: solid 1px #aaa; 
        font-size: 15px;
        -webkit-appearance:none; 
        -moz-appearance:none; 
        appearance:none; 
        cursor: pointer; 
        border-radius: 3px; 
        -moz-border-radius: 3px; 
        -webkit-border-radius: 3px;
        background-position-x:63px; 
    }

    .sopEdtText {
        border: solid 1px #aaa !important;
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
        resize: none;
        width: 100%;
        line-height: 200%;
    }

    .scroll-textarea.sopEdtText > .scroll-content > textarea {
        height: 198px !important;
        padding: 10px !important;
    }

    #spCent {
        height: 100%;
        border: solid 1px #888;
        position: relative;
        padding-top: 100px;
    }

    .spcTop {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
    }

    .spcTop:after {
        ${props => props.theme.variables.clearfix()};
    }

    .spcTop li {
        float: left;
        /* width: 16.6666%; */
        width: 25%;
        border-right: solid 1px #2e2e2e;
    }

    .spcTop li:last-child {
        border-right: none;
    }

    .spcTop li a {
        display: block;
        background: #424242;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff;
    }

    .spcTop li a:before {
        content: "";
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
        width: 20px;
        height: 20px;
        margin-top: -4px;
        background-size: cover !important;
    }

    .spcTop li a.spctUndo:before {
        background: url(${sop_edit01}) no-repeat center center;
    }

    .spcTop li a.spctRedo:before {
        background: url(${sop_edit02}) no-repeat center center;
    }

    .spcTop li a.spctCopy:before {
        background: url(${sop_edit03}) no-repeat center center;
    }

    .spcTop li a.spctCut:before {
        background: url(${sop_edit04}) no-repeat center center;
    }

    .spcTop li a.spctPaste:before {
        background: url(${sop_edit05}) no-repeat center center;
    }

    .spcTop li a.spctDel:before {
        background: url(${sop_edit06}) no-repeat center center;
    }

    .spcCont {
        height: 100%;
        position: relative;
        overflow: hidden;
    }

    #spRht {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 390px;
        border: solid 1px #8fb1f2;
        border-right: none;
        padding-top: 50px;
    }

    .sopMode {
        display: block;
        /* width: 50px; */
        /* padding: 0px 20px; */
        width: ${_SopManagerBodyMainComponent[PR.styleMode].sopModeWidth};
        padding: ${_SopManagerBodyMainComponent[PR.styleMode].sopModePadding};
        height: 30px;
        line-height: 27px;
        text-align: center;
        float: left;
        color: brown;
        font-size: 16px;
        font-weight: 500;
        margin-right: 10px;
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
        border: 1px solid black;
    }

    .sopTitle {
        width: 100%;
        height: 50px;
        background-color: ${_SopManagerCommon[PR.styleMode].sopTitleBackgrounColor};
        text-align: center;
        line-height: 50px;
        font-size: var(--sizeFontSopTitle);
        font-weight: bold;
        border: 2px solid black;
        position: absolute;
        top: 50px;
        left: 0;
    }

    /* ComponentProperties.jsx */
    .sprTitle {
        height: 50px;
        line-height: 50px;
        background: #f6f7ff;
        padding: 0 25px;
        font-size: 18px;
        color: #345bbf;
        font-weight: 700;
        letter-spacing: -0.075em;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
    }
`;


/**********************************************************************/


export const PanelAreasComponent = styled.section`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .sectionPanels {
        width: 100%;
        height: 100%;
        display: flex;
    }

    .sectionPanels
        > .sectionPanel
        > ._sectionGrid_
        > .sectionGridColumn
        > .sectionGridCell:hover:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        border: 2px solid yellow;
    }
`;


/**********************************************************************/


export const NewSOPOptionsComponent = styled(SopManagerCommon)`
    position: relative;
    padding: 70px 15px 50px;
    height: 100%;

    &:after {
        ${props => props.theme.variables.clearfix()};
    }

    /* speTop 영역 */
    .speTop {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: 50px;
        background: #e0e6ff;
        border-top: solid 1px #8fb1f2;
        padding: 10px 15px;
    }

    .speTop:after {
        ${props => props.theme.variables.clearfix()};
    }

    .speTop h3 {
        display: inline-block;
        vertical-align: middle;
        font-size: 20px;
        color: #345bbf;
        margin-right: 20px;
        height: 30px;
        line-height: 30px;
    }

    .speTop input[type="radio"] + label {
        color: #345bbf;
        font-size: 16px;
        margin-right: 20px;
    }

    .speTop a {
        display: block;
        float: right;
        height: 36px;
        line-height: 36px;
        text-align: center;
        font-size: 16px;
        margin-top: -4px;
        background: #457de9;
        color: #fff;
        padding: 0 20px;
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
    }

    .speTop a:hover,
    .speTop a:active,
    .speTop a:focus {
        background: #213e88;
    }

    /* speRow 영역 */
    .speRow {
        margin: 0 -5px;
        height: 100%;
    }

    .speRow:after {
        ${props => props.theme.variables.clearfix()};
    }

    .speCont {
        padding: 0 5px;
        float: left;
        width: 33.3333%;
        height: 100%;
        position: relative;
    }

    .speCont > div {
        height: 100%;
        position: relative;
        padding-top: 90px;
    }

    .speCont > div > div {
        border: solid 1px #ccc;
        height: 100%;
    }
    
    .speCont.edt > div {
        padding-left: 50px;
    }

    .speCont h4 {
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        font-size: 20px;
        font-weight: 500;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        background: #aaa url(${sop_step_arrow}) no-repeat right center;
        border-radius: 5px 0px 0px 5px;
        -moz-border-radius: 5px 0px 0px 5px;
        -webkit-border-radius: 5px 0px 0px 5px;
        background-size: auto 100% !important;
    }

    .speCont h4.on {
        background: #424242 url(${sop_step_arrow_on}) no-repeat right
        center;
    }

    .speChk {
        position: absolute;
        left: 0;
        top: 60px;
    }

    .speScr {
        padding: 20px;
    }

    .speGry {
        margin: -15px -20px;
    }

    .speGry:after {
        ${props => props.theme.variables.clearfix()};
    }

    .speGry li {
        float: left;
        width: 33.3333%;
        padding: 15px 20px;
    }

    .speGry li label {
        display: block;
        cursor: pointer;
    }

    .speGry li img {
        display: block;
        width: 100px;
        margin-bottom: 5px;
    }

    .speGry li span {
        font-size: 16px;
        margin-left: 5px;
        vertical-align: middle;
    }

    .speLst {
        border-top: solid 1px #f4f4f4;
    }

    .speLst li {
        border-bottom: solid 1px #f4f4f4;
        position: relative;
        padding: 10px;
    }

    .speLst li input[type="radio"] {
        position: absolute;
        left: 15px;
        top: 50%;
        margin-top: -9px;
    }

    .speLst li input[type="radio"] + label {
        display: block;
        padding: 15px;
        padding-left: 40px;
        cursor: pointer;
        font-size: 16px;
        margin-left: 0;
        color: #000;
    } 

    .speLst li input[type="radio"]:checked + label {
        background: #f6f8fe;
        text-decoration: underline;
        color: #457de9;
    }

    .speLst li span {
        vertical-align: middle;
        margin-left: 5px;
        font-size: 20px;
    }

    .speIpt {
        border-top: solid 1px #f4f4f4;
    }

    .speIpt li {
        position: relative;
        padding: 10px;
        border-bottom: solid 1px #f4f4f4;
    }

    .speIpt input[type="checkbox"] {
        display: block;
        position: absolute;
        left: 15px;
        top: 50%;
        margin-top: -10px;
        z-index: 1;
    }

    .speIpt input[type="checkbox"] + label {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin-left: 0;
    }

    .speIpt input[type="checkbox"]:checked + label {
        background: #f6f8fe;
    }

    .speIpt input[type="radio"] {
        display: block;
        position: absolute;
        left: 15px;
        top: 50%;
        margin-top: -10px;
        z-index: 1;
    }

    .speIpt li input[type="radio"] + label {
        display: block;
        padding: 15px;
        padding-left: 40px;
        cursor: pointer;
        font-size: 16px;
        margin-left: 0;
        color: #000;
    } 

    .speIpt input[type="radio"]:checked + label {
        background: #f6f8fe;
        text-decoration: underline;
        color: #457de9;
    }

    .speIpt input[type="text"] {
        display: block;
        width: 100%;
        position: relative;
        z-index: 1;
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
    }

    .speIpt.del li {
        padding-right: 55px;
    }

    .speIpt.del li a {
        display: block;
        width: 50px;
        height: 38px;
        line-height: 38px;
        background: #686868;
        color: #fff;
        text-align: center;
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -19px;
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
    }

    .speIpt.del li a:hover,
    .speIpt.del li a:active,
    .speIpt.del li a:focus {
        background: #222;
    }

    /* speBot 영역 */
    .speBot {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 50px;
        text-align: right;
        padding: 10px 20px 0;
    }

    .speBot a {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 16px;
        background: #345bbf;
        color: #fff;
        padding: 0 30px;
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
    }

    .speBot a:hover,
    .speBot a:active,
    .speBot a:focus {
        background: #213e88;
    }



    .fullText {
        position: relative;
        left: 50px;
        width: Calc(100% - 50px);
    }
`;


/**********************************************************************/


export const SaveSOPOptionsComponent = styled(SopManagerCommon)`
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);

    > div {
        display: table;
        width: 100%;
        height: 100%;
    }

    > div > div {
        display: table-cell;
        vertical-align: middle;
    }

    .spPop {
        width: 950px;
        height: 680px;
        background: #fff;
        margin: 0 auto;
        position: relative;
        padding-top: 60px;
        overflow: hidden;
        -webkit-box-shadow: 0px 3px 20px 0px rgba(0, 0, 0, 0.2);
        -moz-box-shadow: 0px 3px 20px 0px rgba(0, 0, 0, 0.2);
        box-shadow: 0px 3px 20px 0px rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
    }

    .spPop.sopOpen {
        padding-top: 107px;
    }

    .spPop.sopSave {
        padding-bottom: 59px;
    }

    .sppTop {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        background: #345bbf;
    }

    .sppTop:after {
        ${props => props.theme.variables.clearfix()};
    }

    .sppTop h4 {
        float: left;
        height: 60px;
        line-height: 60px;
        color: #fff;
        padding-left: 15px;
        font-size: 22px;
        font-weight: 500;
    }

    .sppTop a {
        display: block;
        float: right;
        width: 60px;
        height: 60px;
        text-indent: -9999px;
        background: url(${popup_close}) no-repeat center center;
        background-size: 20px auto;
    }

    .sppSel {
        position: absolute;
        left: 0;
        right: 0;
        top: 60px;
        background: #f7f7f7;
        border-bottom: solid 1px #eaeaea;
        padding: 10px 15px;
        z-index: 1;
    }

    .sppSel h5 {
        display: inline-block;
        vertical-align: middle;
        font-size: 18px;
        margin-right: 30px;
    }

    .sppSel input[type="radio"] + label {
        font-weight: 400;
        margin-right: 15px;
    }

    .sppCont2 {
        position: absolute;
        top: 67px;
        height: calc(100% - 67px);
    }

    .sppCont:after,
    .sppCont2:after {
        ${props => props.theme.variables.clearfix()};
    }

    .spprCont {
        padding: 20px;
    }

    .spprCont .scTb {
        margin-top: 0;
    }

    .spprCont .scTb tbody tr {
        cursor: pointer;
    }

    .scTb {
        /*border-left: solid 2px #fff; border-right: solid 2px #fff;*/
        border-top: solid 2px #555;
        margin-top: 10px;
    }

    .scTb th,
    .scTb td {
        text-align: center;
        border: solid 1px #ebebeb;
        padding: 5px;
    }

    .scTb th {
        background: #f7f7f7;
        color: #888;
        padding: 5px;
        font-weight: 400;
    }

    .scTb td {
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

    .spprBot {
        text-align: right;
        padding: 10px 15px;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        border-top: solid 1px #eaeaea;
    }

    .spprBot:after {
        ${props => props.theme.variables.clearfix()};
    }

    .spprBot a {
        display: inline-block;
        height: 38px;
        line-height: 36px;
        text-align: center;
        border: solid 1px #888;
        padding: 0 25px;
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
    }

    .spprBot a:hover,
    .spprBot a:active,
    .spprBot a:focus {
        border-color: #457de9;
        color: #457de9;
    }

    .spprBot a.blu {
        background: #457de9;
        border-color: #457de9;
        color: #fff;
        margin-left: 30px;
        margin-right: 3px;
        cursor: pointer;
    }

    .spprBot a.blu:hover,
    .spprBot a.blu:active,
    .spprBot a.blu:focus {
        background: #213e88;
        border-color: #213e88;
    }

    .spprBot a.gry {
        background: #686868;
        border-color: #686868;
        color: #fff;
    }

    .spprBot a.gry:hover,
    .spprBot a.gry:active,
    .spprBot a.gry:focus {
        background: #222;
        border-color: #222;
    }

    .spprBot a.grn {
        background: #009c9e;
        border-color: #009c9e;
        color: #fff;
        margin-left: 30px;
        margin-right: 3px;
    }

    .spprBot a.grn:hover,
    .spprBot a.grn:active,
    .spprBot a.grn:focus {
        background: #094754;
        border-color: #094754;
    }

    .spprBot a.lft {
        float: left;
    }

    .spprBot p {
        float: left;
    }

    .sprmTb tr.blu {
        background: #f6f7ff;
    }

    .sppsIpt a.blu {
        background: #457de9;
        right: 0;
    }

    .sppsIpt a.blu:hover,
    .sppsIpt a.blu:active,
    .sppsIpt a.blu:focus {
        background: #213e88;
        border-color: #213e88;
    }

    .sppsEdt li a.blu {
        border: solid 1px #457de9;
        color: #457de9;
    }

    .sppsEdt li a.blu:hover,
    .sppsEdt li a.blu:active,
    .sppsEdt li a.blu:focus {
        background: #457de9;
        border-color: #457de9;
        color: #fff;
    }

    .speBtn.blu {
        background: #457de9;
    }

    .speBtn.blu:hover,
    .speBtn.blu:active,
    .speBtn.blu:focus {
        background: #213e88;
    }

    .dssInfo dl dd.blu p {
        background: #457de9;
    }

    .dssInfo dl dd.blu span b {
        color: #457de9;
    }

    .tal {
        text-align: left !important;
    }

    .labelInput {
        position: relative;
        top: -2px;
        cursor: pointer;
        margin-right: 5px;
        margin-left: 15px;
    }
`;
