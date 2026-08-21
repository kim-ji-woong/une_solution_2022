import styled from "styled-components";
import PR from "../../Root/resource/id";

import "../../Common/css/commonWonik.scss";

import buleSel from "../../Common/image/icon/bule_sel.png"
import search_off from '../images/search_off.png';
import search_on from '../images/search_on.png';
import search_on_sb from '../images/search_on_sb.png';
import update_off from '../images/update_off.png';
import update_on from '../images/update_on.png';
import update_on_sb from '../images/update_on_sb.png';
import delete_off from '../images/delete_off.png';
import delete_on from '../images/delete_on.png';
import delete_on_sb from '../images/delete_on_sb.png';
import select_arrow from '../images/select_arrow.png';
import checkbox from "../../Common/img/common/checkbox.png";

import gg_titlebar_select_arrow from '../../Common/img/imgGyeonggi/gg_titlebar_select_arrow.svg';
import gg_titlebar_select_arrow_disabled from '../../Common/img/imgGyeonggi/gg_titlebar_select_arrow_disabled.svg';
import login_img1 from '../../Common/img/imgwonik/login_img1.png';

import sortIcon from '../../TeamEditor/image/sortIcon.png';

export const _AccountPopup = {
    soulbrain: {
        divPosition: 'absolute',
        divLeft: '50%',
        divTop: '50%',
        divTransform: 'translate(-50%, -50%)',
        divZIndex: 99,
        divOverflow: 'hidden',
        divBoxSizing: 'border-box',
        divHeight: '810px',

        tableTblNoneWidth: '100%',
        tableTblNoneBoxSizing: 'border-box',
        tableTblNoneMarginTop: 0,

        tableTblNoneCaptionFontSize: '0 !important',

        tableTblNoneTheadThPadding: '5px',
        tableTblNoneTheadThBackgroundColor: '#3b3f5c',
        tableTblNoneTheadThHeight: '40px',
        tableTblNoneTheadThColor: '#fff',
        tableTblNoneTheadThFontWeight: 400,

        tableTblNoneTbodyThPadding: '5px',
        tableTblNoneTbodyThColor: '#fff',
        tableTblNoneTbodyThBorderBottom: '0px dashed #3b3f5c',
        tableTblNoneTbodyThFontWeight: 400,

        tableTblNoneTbodyTdBorderBottom: '0px dashed #3b3f5c',
        tableTblNoneTbodyTdPadding: '5px',
        tableTblNoneTbodyTdColor: '#fff',
        tableTblNoneTbodyTdFontWeight: 300,
        tableTblNoneTbodyTdVerticalAlign: 'middle',

        tableTblNoneTbodyTdInputPaddingLeft: '8px',

        tableTblNoneWidth: '100%',
        tableTblNoneBoxSizing: 'border-box',
        tableTblNoneMarginTop: 0,

        tdDisplay: 'inline',
    },
    Wonik: {
        divPosition: 'absolute',
        divLeft: '50%',
        divTop: '50%',
        divTransform: 'translate(-50%, -50%)',
        divZIndex: 99,
        divOverflow: 'hidden',
        divBoxSizing: 'border-box',
        divHeight: '608px',

        tableTblNoneWidth: '100%',
        tableTblNoneBoxSizing: 'border-box',
        tableTblNoneMarginTop: 0,

        tableTblNoneCaptionFontSize: '0 !important',

        tableTblNoneTheadThPadding: '5px',
        tableTblNoneTheadThBackgroundColor: '#3b3f5c',
        tableTblNoneTheadThHeight: '40px',
        tableTblNoneTheadThColor: '#fff',
        tableTblNoneTheadThFontWeight: 400,

        tableTblNoneTbodyThPadding: '5px',
        tableTblNoneTbodyThColor: '#fff',
        tableTblNoneTbodyThBorderBottom: '0px dashed #3b3f5c',
        tableTblNoneTbodyThFontWeight: 400,

        tableTblNoneTbodyTdBorderBottom: '0px dashed #3b3f5c',
        tableTblNoneTbodyTdPadding: '5px',
        tableTblNoneTbodyTdColor: '#fff',
        tableTblNoneTbodyTdFontWeight: 300,
        tableTblNoneTbodyTdVerticalAlign: 'middle',

        tableTblNoneTbodyTdInputPaddingLeft: '8px',

        tableTblNoneWidth: '100%',
        tableTblNoneBoxSizing: 'border-box',
        tableTblNoneMarginTop: 0,
        
        tdDisplay: 'none',
    },
    Hydrogen: {
        divPosition: 'absolute',
        divLeft: '50%',
        divTop: '50%',
        divTransform: 'translate(-50%, -50%)',
        divZIndex: 99,
        divOverflow: 'hidden',
        divBoxSizing: 'border-box',
        divHeight: '608px',

        tableTblNoneWidth: '100%',
        tableTblNoneBoxSizing: 'border-box',
        tableTblNoneMarginTop: 0,

        tableTblNoneCaptionFontSize: '0 !important',

        tableTblNoneTheadThPadding: '5px',
        tableTblNoneTheadThBackgroundColor: '#3b3f5c',
        tableTblNoneTheadThHeight: '40px',
        tableTblNoneTheadThColor: '#fff',
        tableTblNoneTheadThFontWeight: 400,

        tableTblNoneTbodyThPadding: '5px',
        tableTblNoneTbodyThColor: '#fff',
        tableTblNoneTbodyThBorderBottom: '0px dashed #3b3f5c',
        tableTblNoneTbodyThFontWeight: 400,

        tableTblNoneTbodyTdBorderBottom: '0px dashed #3b3f5c',
        tableTblNoneTbodyTdPadding: '5px',
        tableTblNoneTbodyTdColor: '#fff',
        tableTblNoneTbodyTdFontWeight: 300,
        tableTblNoneTbodyTdVerticalAlign: 'middle',

        tableTblNoneTbodyTdInputPaddingLeft: '8px',

        tableTblNoneWidth: '100%',
        tableTblNoneBoxSizing: 'border-box',
        tableTblNoneMarginTop: 0,

        tdDisplay: 'none',
    },
    Gyeonggi: {
        divPosition: 'absolute',
        divLeft: '50%',
        divTop: '50%',
        divTransform: 'translate(-50%, -50%)',
        divZIndex: 99,
        divOverflow: 'hidden',
        divBoxSizing: 'border-box',
        divHeight: '608px',

        tableTblNoneWidth: '100%',
        tableTblNoneBoxSizing: 'border-box',
        tableTblNoneMarginTop: 0,

        tableTblNoneCaptionFontSize: '0 !important',

        tableTblNoneTheadThPadding: '5px',
        tableTblNoneTheadThBackgroundColor: '#3b3f5c',
        tableTblNoneTheadThHeight: '40px',
        tableTblNoneTheadThColor: '#fff',
        tableTblNoneTheadThFontWeight: 400,

        tableTblNoneTbodyThPadding: '5px',
        tableTblNoneTbodyThColor: '#fff',
        tableTblNoneTbodyThBorderBottom: '0px dashed #3b3f5c',
        tableTblNoneTbodyThFontWeight: 400,

        tableTblNoneTbodyTdBorderBottom: '0px dashed #3b3f5c',
        tableTblNoneTbodyTdPadding: '5px',
        tableTblNoneTbodyTdColor: '#fff',
        tableTblNoneTbodyTdFontWeight: 300,
        tableTblNoneTbodyTdVerticalAlign: 'middle',

        tableTblNoneTbodyTdInputPaddingLeft: '8px',

        tableTblNoneWidth: '100%',
        tableTblNoneBoxSizing: 'border-box',
        tableTblNoneMarginTop: 0,
        
        tdDisplay: 'none',
    }
};

export const AccountPopup = styled.div`
    position: ${_AccountPopup[PR.styleMode].divPosition};
    left: ${_AccountPopup[PR.styleMode].divLeft};
    top: ${_AccountPopup[PR.styleMode].divTop};
    transform: ${_AccountPopup[PR.styleMode].divTransform};
    z-index: ${_AccountPopup[PR.styleMode].divZIndex};
    overflow: ${_AccountPopup[PR.styleMode].divOverflow};
    box-sizing: ${_AccountPopup[PR.styleMode].divBoxSizing};
    height: ${_AccountPopup[PR.styleMode].divHeight};

    table.tblNone {
        width: ${_AccountPopup[PR.styleMode].tableTblNoneWidth};
        box-sizing: ${_AccountPopup[PR.styleMode].tableTblNoneBoxSizing};
        margin-top: ${_AccountPopup[PR.styleMode].tableTblNoneMarginTop};
        
    }

    table.tblNone caption {
        font-size: ${_AccountPopup[PR.styleMode].tableTblNoneCaptionFontSize};
    }

    table.tblNone thead th {
        padding: ${_AccountPopup[PR.styleMode].tableTblNoneTheadThPadding};
        background-color: ${_AccountPopup[PR.styleMode].tableTblNoneTheadThBackgroundColor};
        height: ${_AccountPopup[PR.styleMode].tableTblNoneTheadThHeight};
        color: ${_AccountPopup[PR.styleMode].tableTblNoneTheadThColor};
        font-weight: ${_AccountPopup[PR.styleMode].tableTblNoneTheadThFontWeight};
    }
    table.tblNone tbody th {
        padding: ${_AccountPopup[PR.styleMode].tableTblNoneTbodyThPadding};
        color: ${_AccountPopup[PR.styleMode].tableTblNoneTbodyThColor};
        border-bottom: ${_AccountPopup[PR.styleMode].tableTblNoneTbodyThBorderBottom};
        font-weight: ${_AccountPopup[PR.styleMode].tableTblNoneTbodyThFontWeight};
    }

    table.tblNone tbody td {
        border-bottom: ${_AccountPopup[PR.styleMode].tableTblNoneTbodyTdBorderBottom};
        padding: ${_AccountPopup[PR.styleMode].tableTblNoneTbodyTdPadding};
        color: ${_AccountPopup[PR.styleMode].tableTblNoneTbodyTdColor};
        font-weight: ${_AccountPopup[PR.styleMode].tableTblNoneTbodyTdFontWeight};
        vertical-align: ${_AccountPopup[PR.styleMode].tableTblNoneTbodyTdVerticalAlign};

        &:nth-child(odd):not(:last-child):before {
            content: '・';
            display: ${_AccountPopup[PR.styleMode].tdDisplay};
        }
    }

    table.tblNone tbody td > input {
        padding-left: ${_AccountPopup[PR.styleMode].tableTblNoneTbodyTdInputPaddingLeft};
    }

    table.tblNone {
        width: ${_AccountPopup[PR.styleMode].tableTblNoneWidth};
        box-sizing: ${_AccountPopup[PR.styleMode].tableTblNoneBoxSizing};
        margin-top: ${_AccountPopup[PR.styleMode].tableTblNoneMarginTop};
    }

    ::-webkit-scrollbar-thumb {
    background-color: #525868;
    border-radius: 17.992px;
    border: 2px solid transparent;
    cursor: pointer;
}
`;


// 사용자 권한 관리 팝업
export const _AccountManagerPopup = {
    soulbrain: {
        divHeight: "auto !important;",

        popupBoxPosition: 'relative',
        popupBoxWidth: '1160px',
        popupBoxHeight: '100%',
        popupBoxBackground: 'rgba(6, 8, 23, 1)',
        popupBoxBorder: '1px solid #3b3f5c',
        popupBoxBorderRadius: '20px',
        popupBoxPadding: '30px 35px',
        popupBoxBoxSizing: 'border-box',

        popupBoxTitleFontSize: '22px',
        popupBoxTitleColor: '#fff',
        popupBoxTitleFontWeight: 600,
        popupBoxTitleMarginBottom: '15px',

        popupBoxXPosition: 'absolute',
        popupBoxXRight: '30px',
        popupBoxXTop: '20px',

        popupBoxXImgWidth: '25px',

        boxTypeBlueBackground: '#162235',

        blueInputBackground: '#0a0c1b',
        blueInputWidth: '100%',
        blueInputHeight: '50px !important',
        blueInputBorderRadius: '5px !important',
        blueInputBorder: 'none !important',
        blueInputColor: '#fff',

        blueInputTdPaddingLeft: '10px',

        inputBlueInputMsInputPlaceholderColor: '#fff',

        inputBlueInputWebkitInputPlaceholderColor: '#fff',

        inputBlueInputMozInputPlaceholderColor: '#fff',

        blueSelBackground: `#0a0c1b url(${buleSel}) 95% 49% no-repeat`,
        blueSelWidth: '100%',
        blueSelHeight: '50px !important',
        blueSelBorderRadius: '5px',
        blueSelBorder: 'none !important',
        blueSelColor: '#fff',
        blueSelFontSize: '14px',
        blueSelPaddingLeft: '8px',

        searchBlueBtnBackground: '#3b3f5c',
        searchBlueBtnBorderRadius: '5px',
        searchBlueBtnFontSize: '20px',
        searchBlueBtnColor: '#fff',
        searchBlueBtnTextAlign: 'center',
        searchBlueBtnWidth: '100%',
        searchBlueBtnHeight: '110px',
        searchBlueBtnLineHeight: '110px',
        searchBlueBtnDisplay: 'block',
        searchBlueBtnCursor: 'pointer',

        searchBlueBtnHoberBackground: '#272b47',

        tel3colClear: 'both',

        tel3colLiWidth: '32.5%',
        tel3colLiFloat: 'left',
        tel3colLiMarginRight: '2%',

        tel3colLiFirstChildPosition: 'relative',
        tel3colLiFirstChildPaddingRight: '15px',
        tel3colLiFirstChildMarginRight: 0,

        tel3colLiFirstChildSpanPosition: 'absolute',
        tel3colLiFirstChildSpanRight: 0,
        tel3colLiFirstChildSpanTop: '30%',
        tel3colLiFirstChildSpanWidth: '15px',
        tel3colLiFirstChildSpanDisplay: 'inline-block',
        tel3colLiFirstChildSpanTextAlign: 'center',

        tel3colLiLastChildMarginRight: '0%',

        darkNaveBtnDisplay: 'inline-block',
        darkNaveBtnWidth: '80px',
        darkNaveBtnHeight: '30px',
        darkNaveBtnLineHeight: '25px',
        darkNaveBtnBackground: '#162235',
        darkNaveBtnBorder: '2px solid #fff',
        darkNaveBtnBorderRadius: '5px',
        darkNaveBtnFontSize: '14px',
        darkNaveBtnTextAlign: 'center',
        darkNaveBtnBoxSizing: 'border-box',
        darkNaveBtnMarginLeft: '5px',
        darkNaveBtnColor: '#fff',
        darkNaveBtnCursor: 'pointer',

        darkNaveBtnHoverBackground: '#0f2953',

        lightNaveBtnDisplay: 'inline-block',
        lightNaveBtnWidth: '80px',
        lightNaveBtnHeight: '30px',
        lightNaveBtnLineHeight: '25px',
        lightNaveBtnBackground: '#3b3f5c',
        lightNaveBtnBorder: '2px solid #fff',
        lightNaveBtnBorderRadius: '5px',
        lightNaveBtnFontSize: '14px',
        lightNaveBtnTextAlign: 'center',
        lightNaveBtnBoxSizing: 'border-box',
        lightNaveBtnMarginLeft: '5px',
        lightNaveBtnColor: '#fff',
        lightNaveBtnCursor: 'pointer',

        lightNaveBtnHoverBackground: '#131941',

        lightBlueBtnDisplay: 'inline-block',
        lightBlueBtnWidth: '80px',
        lightBlueBtnHeight: '30px',
        lightBlueBtnLineHeight: '25px',
        lightBlueBtnBackground: '#1b55e2',
        lightBlueBtnBorder: '2px solid #fff',
        lightBlueBtnBorderRadius: '5px',
        lightBlueBtnFontSize: '14px',
        lightBlueBtnTextAlign: 'center',
        lightBlueBtnBoxSizing: 'border-box',
        lightBlueBtnMarginLeft: '5px',
        lightBlueBtnColor: '#fff',
        lightBlueBtnCursor: 'pointer',

        lightBlueBtnHoverBackground: '#1043be',

        tableHeadClear: 'both',
        tableHeadWidth: '100%',

        tableHeadUlClear: 'both',
        tableHeadUlWidth: '100%',
        tableHeadUlBackgroundColor: '#0a0c1b',

        tableHeadUlLiFloat: 'left',
        tableHeadUlLiFlex: 1,
        tableHeadUlLiColor: '#fff',
        tableHeadUlLiFontWeight: 400,
        tableHeadUlLiTextAlign: 'center',
        tableHeadUlLiPadding: '0 5px',
        tableHeadUlLiHeight: '50px',
        tableHeadUlLiLineHeight: '50px',

        tableHeadUlLiTableCheckWidth: '70px !important',
        tableHeadUlLiTableCheckFlex: 'none',

        tablebodyClear: 'both',
        tablebodyWidth: '100%',

        tablebodyUlClear: 'both',
        tablebodyUlBorderBottom: '1px solid #0a0c1b',

        tablebodyUlLiFloat: 'left',
        tablebodyUlLiFlex: 1,
        tablebodyUlLiColor: '#fff',
        tablebodyUlLiFontWeight: 300,
        tablebodyUlLiTextAlign: 'center',
        tablebodyUlLiVerticalAlign: 'middle',
        tablebodyUlLiMinHeight: '30px',
        tablebodyUlLiPadding: '12px 5px',
        tablebodyUlLiBoxSizing: 'border-box',

        tablebodyUlLitableCheckWidth: '70px !important',
        tablebodyUlLitableCheckFlex: 'none',
        tablebodyUlLitableCheckTextAlign: 'center',

        checkboxCssEtcPosition: 'relative',
        checkboxCssEtcCursor: 'pointer',
        checkboxCssEtcColor: '#666',
        checkboxCssEtcFontWeight: 500,
        checkboxCssEtcWebkitUserSelect: 'none',
        checkboxCssEtcMozUserSelect: 'none',
        checkboxCssEtcMsUserSelect: 'none',
        checkboxCssEtcUserSelect: 'none',
        checkboxCssEtcPadding: '0 5px',
        checkboxCssEtcLineHeight: '27px',

        checkboxCssEtcInputPosition: 'absolute',
        checkboxCssEtcInputOpacity: 0,
        checkboxCssEtcInputCursor: 'pointer',
        checkboxCssEtcInputHeight: 0,
        checkboxCssEtcInputWidth: 0,

        checkmarkEtcPosition: 'absolute',
        checkmarkEtcTop: 0,
        checkmarkEtcLeft: 0,
        checkmarkEtcHeight: '22px',
        checkmarkEtcWidth: '22px',
        checkmarkEtcLineHeight: '22px',
        checkmarkEtcBackgroundColor: 'transparent',
        checkmarkEtcBorder: '1px solid #fff',
        checkmarkEtcBorderRadius: 0,
        checkmarkEtcBoxSizing: 'border-box',

        checkboxCssBHoverInputCheckmarkBBackgroundColor: 'transparent',

        checkboxCssEtcInputCheckedCheckmarkEtcBackgroundColor: 'transparent',
        checkboxCssEtcInputCheckedCheckmarkEtcBorder: '1px solid #c0c0c0',

        checkmarkEtcAfterPosition: 'absolute',
        checkmarkEtcAfterDisplay: 'none',

        checkboxCssEtcInputCheckedCheckmarkEtcAfterDisplay: 'block',

        checkboxCssEtcCheckmarkEtcAfterLeft: '7px',
        checkboxCssEtcCheckmarkEtcAfterTop: 0,
        checkboxCssEtcCheckmarkEtcAfterWidth: '5px',
        checkboxCssEtcCheckmarkEtcAfterHeight: '13px',
        checkboxCssEtcCheckmarkEtcAfterBorder: 'solid #fff',
        checkboxCssEtcCheckmarkEtcAfterBorderWidth: '0 2px 2px 0',
        checkboxCssEtcCheckmarkEtcAfterWebkitTransform: 'rotate(45deg)',
        checkboxCssEtcCheckmarkEtcAfterMsTransform: 'rotate(45deg)',
        checkboxCssEtcCheckmarkEtcAfterTransform: 'rotate(45deg)',
        tableScrollHeight: '260px',
    },
    Wonik: {
        order: '1',
        marginBottom: '20px',
        divHeight: "auto !important;",

        popupBoxPosition: 'relative',
        popupBoxWidth: '811px',
        popupBoxHeight: '100%',
        popupBoxBackground: 'rgba(14, 22, 45, 1)',
        popupBoxBorder: '1px solid #FFFFFF1A',
        popupBoxBorderRadius: '6px',
        popupBoxPadding: '60px 20px 20px 20px',
        popupBoxBoxSizing: 'border-box',
        popupBoxDisplay: 'flex',
        popupBoxFlexDirection: 'column',

        popupboxLineBackgroundColor: 'rgba(255, 255, 255, 0.1)',
        popupboxLineWidth: '100%',
        popupboxLineHeight: '40px',
        popupboxLinePosition: 'absolute',
        popupboxLineTop: 0,
        popupboxLineLeft: 0,
        popupboxLineBorderRadius: '5px 5px 0 0',

        popupBoxTitleFontSize: '16px',
        popupBoxTitleColor: '#5398FF',
        popupBoxTitleFontWeight: 600,
        popupBoxTitleMarginBottom: '15px',
        popupBoxTitleHeight: '40px',
        popupBoxTitleLineHeight: '40px',
        popupBoxTitlePosition: 'absolute',
        popupBoxTitleTop: 0,
        popupBoxTitleLeft: '20px',

        popupBoxXPosition: 'absolute',
        popupBoxXRight: '20px',
        popupBoxXTop: '14px',

        popupBoxXImgWidth: '12px',

        boxTypeBlueBackground: '#272E42',
        boxTypeBlueBorder: '1px solid #525868',
        boxTypeBlueBorderRadius: '5px',
        boxTypeBluePadding: '15px',
        boxTypeBlueTablePadding: '0',

        blueInputBackground: '#0E162D',
        blueInputWidth: '100%',
        blueInputHeight: '38px !important',
        blueInputBorderRadius: '5px !important',
        blueInputBorder: 'none !important',
        blueInputColor: '#fff',

        blueInputTdPaddingLeft: '10px',

        inputBlueInputMsInputPlaceholderColor: '#fff',

        inputBlueInputWebkitInputPlaceholderColor: '#fff',

        inputBlueInputMozInputPlaceholderColor: '#fff',

        blueSelBackground: `#0E162D url(${buleSel}) 95% 49% no-repeat`,
        blueSelLongBackground: `#0E162D url(${buleSel}) 98% 49% no-repeat`,
        blueSelShortBackground: `#0E162D url(${buleSel}) 89% 49% no-repeat`,
        blueSelWidth: '100%',
        blueSelHeight: '38px !important',
        blueSelBorderRadius: '5px',
        blueSelBorder: 'none !important',
        blueSelColor: '#fff',
        blueSelFontSize: '14px',
        blueSelPaddingLeft: '8px',

        searchBlueBtnBackground: 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;',
        searchBlueBtnBorderRadius: '5px',
        searchBlueBtnFontSize: '16px',
        searchBlueBtnColor: '#fff',
        searchBlueBtnTextAlign: 'center',
        searchBlueBtnWidth: '100%',
        searchBlueBtnHeight: '134px',
        searchBlueBtnLineHeight: '134px',
        searchBlueBtnDisplay: 'block',
        searchBlueBtnCursor: 'pointer',

        searchBlueBtnHoberBackground: '#1043be',

        tel3colClear: 'both',

        tel3colLiWidth: '32.5%',
        tel3colLiFloat: 'left',
        tel3colLiMarginRight: '2%',

        tel3colLiFirstChildPosition: 'relative',
        tel3colLiFirstChildPaddingRight: '15px',
        tel3colLiFirstChildMarginRight: 0,

        tel3colLiFirstChildSpanPosition: 'absolute',
        tel3colLiFirstChildSpanRight: 0,
        tel3colLiFirstChildSpanTop: '30%',
        tel3colLiFirstChildSpanWidth: '15px',
        tel3colLiFirstChildSpanDisplay: 'inline-block',
        tel3colLiFirstChildSpanTextAlign: 'center',

        tel3colLiLastChildMarginRight: '0%',

        gapDisplay: 'none',

        darkNaveBtnDisplay: 'inline-block',
        darkNaveBtnWidth: '68px',
        darkNaveBtnHeight: '28px',
        darkNaveBtnLineHeight: '24px',
        darkNaveBtnBackground: '#0E162D',
        darkNaveBtnBorder: '1px solid #FFFFFF1A',
        darkNaveBtnBorderRadius: '5px',
        darkNaveBtnFontSize: '14px',
        darkNaveBtnTextAlign: 'center',
        darkNaveBtnBoxSizing: 'border-box',
        darkNaveBtnMarginLeft: '10px',
        darkNaveBtnColor: '#fff',
        darkNaveBtnCursor: 'pointer',

        darkNaveBtnHoverBackground: '#0E162D',

        lightNaveBtnDisplay: 'inline-block',
        lightNaveBtnWidth: '68px',
        lightNaveBtnHeight: '28px',
        lightNaveBtnLineHeight: '24px',
        lightNaveBtnBackground: '#0E162D',
        lightNaveBtnBorder: '1px solid #FFFFFF1A',
        lightNaveBtnBorderRadius: '5px',
        lightNaveBtnFontSize: '14px',
        lightNaveBtnTextAlign: 'center',
        lightNaveBtnBoxSizing: 'border-box',
        lightNaveBtnMarginLeft: '10px',
        lightNaveBtnColor: '#fff',
        lightNaveBtnCursor: 'pointer',

        lightNaveBtnHoverBackground: '#0E162D',

        lightBlueBtnDisplay: 'inline-block',
        lightBlueBtnWidth: '68px',
        lightBlueBtnHeight: '28px',
        lightBlueBtnLineHeight: '24px',
        lightBlueBtnBackground: 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;',
        lightBlueBtnBorder: '1px solid #FFFFFF1A',
        lightBlueBtnBorderRadius: '5px',
        lightBlueBtnFontSize: '14px',
        lightBlueBtnTextAlign: 'center',
        lightBlueBtnBoxSizing: 'border-box',
        lightBlueBtnMarginLeft: '10px',
        lightBlueBtnColor: '#fff',
        lightBlueBtnCursor: 'pointer',

        lightBlueBtnHoverBackground: 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;',

        tableHeadClear: 'both',
        tableHeadWidth: '100%',

        tableHeadUlClear: 'both',
        tableHeadUlWidth: '100%',
        tableHeadUlBackgroundColor: '#0E162D',
        tableHeadBorderRadius: '5px',
        tableHeadOutLine: '1px solid var(--navy-color)',

        tableHeadUlLiFloat: 'left',
        tableHeadUlLiFlex: 1,
        tableHeadUlLiColor: '#fff',
        tableHeadUlLiFontWeight: 400,
        tableHeadUlLiTextAlign: 'center',
        tableHeadUlLiPadding: '0 5px',
        tableHeadUlLiHeight: '38px',
        tableHeadUlLiLineHeight: '38px',

        tableHeadUlLiTableCheckWidth: '50px !important',
        tableHeadUlLiTableCheckFlex: 'none',

        tablebodyClear: 'both',
        tablebodyWidth: '100%',

        tablebodyUlClear: 'both',
        tablebodyUlBorderBottom: '1px solid rgba(255, 255, 255, .1)',

        tablebodyUlLiFloat: 'left',
        tablebodyUlLiFlex: 1,
        tablebodyUlLiColor: '#fff',
        tablebodyUlLiFontWeight: 300,
        tablebodyUlLiTextAlign: 'center',
        tablebodyUlLiVerticalAlign: 'middle',
        tablebodyUlLiMinHeight: '30px',
        tablebodyUlLiPadding: '10px 5px',
        tablebodyUlLiBoxSizing: 'border-box',

        tablebodyUlLitableCheckWidth: '50px !important',
        tablebodyUlLitableCheckFlex: 'none',
        tablebodyUlLitableCheckTextAlign: 'center',

        checkboxCssEtcPosition: 'relative',
        checkboxCssEtcCursor: 'pointer',
        checkboxCssEtcColor: '#666',
        checkboxCssEtcFontWeight: 500,
        checkboxCssEtcWebkitUserSelect: 'none',
        checkboxCssEtcMozUserSelect: 'none',
        checkboxCssEtcMsUserSelect: 'none',
        checkboxCssEtcUserSelect: 'none',
        checkboxCssEtcPadding: '0 5px',

        checkboxCssEtcInputPosition: 'absolute',
        checkboxCssEtcInputOpacity: 0,
        checkboxCssEtcInputCursor: 'pointer',
        checkboxCssEtcInputHeight: 0,
        checkboxCssEtcInputWidth: 0,

        checkmarkEtcPosition: 'absolute',
        checkmarkEtcTop: '2px',
        checkmarkEtcLeft: 0,
        checkmarkEtcHeight: '14px',
        checkmarkEtcWidth: '14px',
        checkmarkEtcLineHeight: '14px',
        checkmarkEtcBackgroundColor: 'transparent',
        checkmarkEtcBorder: '1px solid #fff',
        checkmarkEtcBorderRadius: 0,
        checkmarkEtcBoxSizing: 'border-box',

        checkboxCssBHoverInputCheckmarkBBackgroundColor: 'transparent',

        checkboxCssEtcInputCheckedCheckmarkEtcBackgroundColor: 'transparent',
        checkboxCssEtcInputCheckedCheckmarkEtcBorder: '1px solid #c0c0c0',

        checkmarkEtcAfterPosition: 'absolute',
        checkmarkEtcAfterDisplay: 'none',

        checkboxCssEtcInputCheckedCheckmarkEtcAfterDisplay: 'block',

        checkboxCssEtcCheckmarkEtcAfterLeft: '3px',
        checkboxCssEtcCheckmarkEtcAfterTop: '-3px',
        checkboxCssEtcCheckmarkEtcAfterWidth: '5px',
        checkboxCssEtcCheckmarkEtcAfterHeight: '10px',
        checkboxCssEtcCheckmarkEtcAfterBorder: 'solid #fff',
        checkboxCssEtcCheckmarkEtcAfterBorderWidth: '0 2px 2px 0',
        checkboxCssEtcCheckmarkEtcAfterWebkitTransform: 'rotate(45deg)',
        checkboxCssEtcCheckmarkEtcAfterMsTransform: 'rotate(45deg)',
        checkboxCssEtcCheckmarkEtcAfterTransform: 'rotate(45deg)',

        tableScrollHeight: '212px',
    },
    Hydrogen: {
        order: '1',
        marginBottom: '20px',
        divHeight: "auto !important;",

        popupBoxPosition: 'relative',
        popupBoxWidth: '811px',
        popupBoxHeight: '100%',
        popupBoxBackground: 'rgba(14, 22, 45, 1)',
        popupBoxBorder: '1px solid #FFFFFF1A',
        popupBoxBorderRadius: '6px',
        popupBoxPadding: '60px 20px 20px 20px',
        popupBoxBoxSizing: 'border-box',
        popupBoxDisplay: 'flex',
        popupBoxFlexDirection: 'column',

        popupboxLineBackgroundColor: 'rgba(255, 255, 255, 0.1)',
        popupboxLineWidth: '100%',
        popupboxLineHeight: '40px',
        popupboxLinePosition: 'absolute',
        popupboxLineTop: 0,
        popupboxLineLeft: 0,
        popupboxLineBorderRadius: '5px 5px 0 0',

        popupBoxTitleFontSize: '16px',
        popupBoxTitleColor: '#5398FF',
        popupBoxTitleFontWeight: 600,
        popupBoxTitleMarginBottom: '15px',
        popupBoxTitleHeight: '40px',
        popupBoxTitleLineHeight: '40px',
        popupBoxTitlePosition: 'absolute',
        popupBoxTitleTop: 0,
        popupBoxTitleLeft: '20px',

        popupBoxXPosition: 'absolute',
        popupBoxXRight: '20px',
        popupBoxXTop: '14px',

        popupBoxXImgWidth: '12px',

        boxTypeBlueBackground: '#272E42',
        boxTypeBlueBorder: '1px solid #525868',
        boxTypeBlueBorderRadius: '5px',
        boxTypeBluePadding: '15px',
        boxTypeBlueTablePadding: '0',

        blueInputBackground: '#0E162D',
        blueInputWidth: '100%',
        blueInputHeight: '38px !important',
        blueInputBorderRadius: '5px !important',
        blueInputBorder: 'none !important',
        blueInputColor: '#fff',

        blueInputTdPaddingLeft: '10px',

        inputBlueInputMsInputPlaceholderColor: '#fff',

        inputBlueInputWebkitInputPlaceholderColor: '#fff',

        inputBlueInputMozInputPlaceholderColor: '#fff',

        blueSelBackground: `#0E162D url(${buleSel}) 95% 49% no-repeat`,
        blueSelLongBackground: `#0E162D url(${buleSel}) 98% 49% no-repeat`,
        blueSelShortBackground: `#0E162D url(${buleSel}) 89% 49% no-repeat`,
        blueSelWidth: '100%',
        blueSelHeight: '38px !important',
        blueSelBorderRadius: '5px',
        blueSelBorder: 'none !important',
        blueSelColor: '#fff',
        blueSelFontSize: '14px',
        blueSelPaddingLeft: '8px',

        searchBlueBtnBackground: 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;',
        searchBlueBtnBorderRadius: '5px',
        searchBlueBtnFontSize: '16px',
        searchBlueBtnColor: '#fff',
        searchBlueBtnTextAlign: 'center',
        searchBlueBtnWidth: '100%',
        searchBlueBtnHeight: '134px',
        searchBlueBtnLineHeight: '134px',
        searchBlueBtnDisplay: 'block',
        searchBlueBtnCursor: 'pointer',

        searchBlueBtnHoberBackground: '#1043be',

        tel3colClear: 'both',

        tel3colLiWidth: '32.5%',
        tel3colLiFloat: 'left',
        tel3colLiMarginRight: '2%',

        tel3colLiFirstChildPosition: 'relative',
        tel3colLiFirstChildPaddingRight: '15px',
        tel3colLiFirstChildMarginRight: 0,

        tel3colLiFirstChildSpanPosition: 'absolute',
        tel3colLiFirstChildSpanRight: 0,
        tel3colLiFirstChildSpanTop: '30%',
        tel3colLiFirstChildSpanWidth: '15px',
        tel3colLiFirstChildSpanDisplay: 'inline-block',
        tel3colLiFirstChildSpanTextAlign: 'center',

        tel3colLiLastChildMarginRight: '0%',

        gapDisplay: 'none',

        darkNaveBtnDisplay: 'inline-block',
        darkNaveBtnWidth: '68px',
        darkNaveBtnHeight: '28px',
        darkNaveBtnLineHeight: '24px',
        darkNaveBtnBackground: '#0E162D',
        darkNaveBtnBorder: '1px solid #FFFFFF1A',
        darkNaveBtnBorderRadius: '5px',
        darkNaveBtnFontSize: '14px',
        darkNaveBtnTextAlign: 'center',
        darkNaveBtnBoxSizing: 'border-box',
        darkNaveBtnMarginLeft: '10px',
        darkNaveBtnColor: '#fff',
        darkNaveBtnCursor: 'pointer',

        darkNaveBtnHoverBackground: '#0E162D',

        lightNaveBtnDisplay: 'inline-block',
        lightNaveBtnWidth: '68px',
        lightNaveBtnHeight: '28px',
        lightNaveBtnLineHeight: '24px',
        lightNaveBtnBackground: '#0E162D',
        lightNaveBtnBorder: '1px solid #FFFFFF1A',
        lightNaveBtnBorderRadius: '5px',
        lightNaveBtnFontSize: '14px',
        lightNaveBtnTextAlign: 'center',
        lightNaveBtnBoxSizing: 'border-box',
        lightNaveBtnMarginLeft: '10px',
        lightNaveBtnColor: '#fff',
        lightNaveBtnCursor: 'pointer',

        lightNaveBtnHoverBackground: '#0E162D',

        lightBlueBtnDisplay: 'inline-block',
        lightBlueBtnWidth: '68px',
        lightBlueBtnHeight: '28px',
        lightBlueBtnLineHeight: '24px',
        lightBlueBtnBackground: 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;',
        lightBlueBtnBorder: '1px solid #FFFFFF1A',
        lightBlueBtnBorderRadius: '5px',
        lightBlueBtnFontSize: '14px',
        lightBlueBtnTextAlign: 'center',
        lightBlueBtnBoxSizing: 'border-box',
        lightBlueBtnMarginLeft: '10px',
        lightBlueBtnColor: '#fff',
        lightBlueBtnCursor: 'pointer',

        lightBlueBtnHoverBackground: 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;',

        tableHeadClear: 'both',
        tableHeadWidth: '100%',

        tableHeadUlClear: 'both',
        tableHeadUlWidth: '100%',
        tableHeadUlBackgroundColor: '#0E162D',
        tableHeadBorderRadius: '5px',
        tableHeadOutLine: '1px solid var(--navy-color)',

        tableHeadUlLiFloat: 'left',
        tableHeadUlLiFlex: 1,
        tableHeadUlLiColor: '#fff',
        tableHeadUlLiFontWeight: 400,
        tableHeadUlLiTextAlign: 'center',
        tableHeadUlLiPadding: '0 5px',
        tableHeadUlLiHeight: '38px',
        tableHeadUlLiLineHeight: '38px',

        tableHeadUlLiTableCheckWidth: '50px !important',
        tableHeadUlLiTableCheckFlex: 'none',

        tablebodyClear: 'both',
        tablebodyWidth: '100%',

        tablebodyUlClear: 'both',
        tablebodyUlBorderBottom: '1px solid rgba(255, 255, 255, .1)',

        tablebodyUlLiFloat: 'left',
        tablebodyUlLiFlex: 1,
        tablebodyUlLiColor: '#fff',
        tablebodyUlLiFontWeight: 300,
        tablebodyUlLiTextAlign: 'center',
        tablebodyUlLiVerticalAlign: 'middle',
        tablebodyUlLiMinHeight: '30px',
        tablebodyUlLiPadding: '10px 5px',
        tablebodyUlLiBoxSizing: 'border-box',

        tablebodyUlLitableCheckWidth: '50px !important',
        tablebodyUlLitableCheckFlex: 'none',
        tablebodyUlLitableCheckTextAlign: 'center',

        checkboxCssEtcPosition: 'relative',
        checkboxCssEtcCursor: 'pointer',
        checkboxCssEtcColor: '#666',
        checkboxCssEtcFontWeight: 500,
        checkboxCssEtcWebkitUserSelect: 'none',
        checkboxCssEtcMozUserSelect: 'none',
        checkboxCssEtcMsUserSelect: 'none',
        checkboxCssEtcUserSelect: 'none',
        checkboxCssEtcPadding: '0 5px',

        checkboxCssEtcInputPosition: 'absolute',
        checkboxCssEtcInputOpacity: 0,
        checkboxCssEtcInputCursor: 'pointer',
        checkboxCssEtcInputHeight: 0,
        checkboxCssEtcInputWidth: 0,

        checkmarkEtcPosition: 'absolute',
        checkmarkEtcTop: '2px',
        checkmarkEtcLeft: 0,
        checkmarkEtcHeight: '14px',
        checkmarkEtcWidth: '14px',
        checkmarkEtcLineHeight: '14px',
        checkmarkEtcBackgroundColor: 'transparent',
        checkmarkEtcBorder: '1px solid #fff',
        checkmarkEtcBorderRadius: 0,
        checkmarkEtcBoxSizing: 'border-box',

        checkboxCssBHoverInputCheckmarkBBackgroundColor: 'transparent',

        checkboxCssEtcInputCheckedCheckmarkEtcBackgroundColor: 'transparent',
        checkboxCssEtcInputCheckedCheckmarkEtcBorder: '1px solid #c0c0c0',

        checkmarkEtcAfterPosition: 'absolute',
        checkmarkEtcAfterDisplay: 'none',

        checkboxCssEtcInputCheckedCheckmarkEtcAfterDisplay: 'block',

        checkboxCssEtcCheckmarkEtcAfterLeft: '3px',
        checkboxCssEtcCheckmarkEtcAfterTop: '-3px',
        checkboxCssEtcCheckmarkEtcAfterWidth: '5px',
        checkboxCssEtcCheckmarkEtcAfterHeight: '10px',
        checkboxCssEtcCheckmarkEtcAfterBorder: 'solid #fff',
        checkboxCssEtcCheckmarkEtcAfterBorderWidth: '0 2px 2px 0',
        checkboxCssEtcCheckmarkEtcAfterWebkitTransform: 'rotate(45deg)',
        checkboxCssEtcCheckmarkEtcAfterMsTransform: 'rotate(45deg)',
        checkboxCssEtcCheckmarkEtcAfterTransform: 'rotate(45deg)',

        tableScrollHeight: '212px',
    },
    Gyeonggi: {
        order: '1',
        marginBottom: '20px',
        divHeight: "auto !important;",

        popupBoxPosition: 'relative',
        popupBoxWidth: '811px',
        popupBoxHeight: '100%',
        popupBoxBackground: 'rgba(14, 22, 45, 1)',
        popupBoxBorder: '1px solid #FFFFFF1A',
        popupBoxBorderRadius: '6px',
        popupBoxPadding: '60px 20px 20px 20px',
        popupBoxBoxSizing: 'border-box',
        popupBoxDisplay: 'flex',
        popupBoxFlexDirection: 'column',

        popupboxLineBackgroundColor: 'rgba(255, 255, 255, 0.1)',
        popupboxLineWidth: '100%',
        popupboxLineHeight: '40px',
        popupboxLinePosition: 'absolute',
        popupboxLineTop: 0,
        popupboxLineLeft: 0,
        popupboxLineBorderRadius: '5px 5px 0 0',

        popupBoxTitleFontSize: '16px',
        popupBoxTitleColor: '#5398FF',
        popupBoxTitleFontWeight: 600,
        popupBoxTitleMarginBottom: '15px',
        popupBoxTitleHeight: '40px',
        popupBoxTitleLineHeight: '40px',
        popupBoxTitlePosition: 'absolute',
        popupBoxTitleTop: 0,
        popupBoxTitleLeft: '20px',

        popupBoxXPosition: 'absolute',
        popupBoxXRight: '20px',
        popupBoxXTop: '14px',

        popupBoxXImgWidth: '12px',

        boxTypeBlueBackground: '#272E42',
        boxTypeBlueBorder: '1px solid #525868',
        boxTypeBlueBorderRadius: '5px',
        boxTypeBluePadding: '15px',
        boxTypeBlueTablePadding: '0',

        blueInputBackground: '#0E162D',
        blueInputWidth: '100%',
        blueInputHeight: '38px !important',
        blueInputBorderRadius: '5px !important',
        blueInputBorder: 'none !important',
        blueInputColor: '#fff',

        blueInputTdPaddingLeft: '10px',

        inputBlueInputMsInputPlaceholderColor: '#fff',

        inputBlueInputWebkitInputPlaceholderColor: '#fff',

        inputBlueInputMozInputPlaceholderColor: '#fff',

        blueSelBackground: `#0E162D url(${buleSel}) 95% 49% no-repeat`,
        blueSelLongBackground: `#0E162D url(${buleSel}) 98% 49% no-repeat`,
        blueSelShortBackground: `#0E162D url(${buleSel}) 89% 49% no-repeat`,
        blueSelWidth: '100%',
        blueSelHeight: '38px !important',
        blueSelBorderRadius: '5px',
        blueSelBorder: 'none !important',
        blueSelColor: '#fff',
        blueSelFontSize: '14px',
        blueSelPaddingLeft: '8px',

        searchBlueBtnBackground: 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;',
        searchBlueBtnBorderRadius: '5px',
        searchBlueBtnFontSize: '16px',
        searchBlueBtnColor: '#fff',
        searchBlueBtnTextAlign: 'center',
        searchBlueBtnWidth: '100%',
        searchBlueBtnHeight: '134px',
        searchBlueBtnLineHeight: '134px',
        searchBlueBtnDisplay: 'block',
        searchBlueBtnCursor: 'pointer',

        searchBlueBtnHoberBackground: '#1043be',

        tel3colClear: 'both',

        tel3colLiWidth: '32.5%',
        tel3colLiFloat: 'left',
        tel3colLiMarginRight: '2%',

        tel3colLiFirstChildPosition: 'relative',
        tel3colLiFirstChildPaddingRight: '15px',
        tel3colLiFirstChildMarginRight: 0,

        tel3colLiFirstChildSpanPosition: 'absolute',
        tel3colLiFirstChildSpanRight: 0,
        tel3colLiFirstChildSpanTop: '30%',
        tel3colLiFirstChildSpanWidth: '15px',
        tel3colLiFirstChildSpanDisplay: 'inline-block',
        tel3colLiFirstChildSpanTextAlign: 'center',

        tel3colLiLastChildMarginRight: '0%',

        gapDisplay: 'none',

        darkNaveBtnDisplay: 'inline-block',
        darkNaveBtnWidth: '68px',
        darkNaveBtnHeight: '28px',
        darkNaveBtnLineHeight: '24px',
        darkNaveBtnBackground: '#0E162D',
        darkNaveBtnBorder: '1px solid #FFFFFF1A',
        darkNaveBtnBorderRadius: '5px',
        darkNaveBtnFontSize: '14px',
        darkNaveBtnTextAlign: 'center',
        darkNaveBtnBoxSizing: 'border-box',
        darkNaveBtnMarginLeft: '10px',
        darkNaveBtnColor: '#fff',
        darkNaveBtnCursor: 'pointer',

        darkNaveBtnHoverBackground: '#0E162D',

        lightNaveBtnDisplay: 'inline-block',
        lightNaveBtnWidth: '68px',
        lightNaveBtnHeight: '28px',
        lightNaveBtnLineHeight: '24px',
        lightNaveBtnBackground: '#0E162D',
        lightNaveBtnBorder: '1px solid #FFFFFF1A',
        lightNaveBtnBorderRadius: '5px',
        lightNaveBtnFontSize: '14px',
        lightNaveBtnTextAlign: 'center',
        lightNaveBtnBoxSizing: 'border-box',
        lightNaveBtnMarginLeft: '10px',
        lightNaveBtnColor: '#fff',
        lightNaveBtnCursor: 'pointer',

        lightNaveBtnHoverBackground: '#0E162D',

        lightBlueBtnDisplay: 'inline-block',
        lightBlueBtnWidth: '68px',
        lightBlueBtnHeight: '28px',
        lightBlueBtnLineHeight: '24px',
        lightBlueBtnBackground: 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;',
        lightBlueBtnBorder: '1px solid #FFFFFF1A',
        lightBlueBtnBorderRadius: '5px',
        lightBlueBtnFontSize: '14px',
        lightBlueBtnTextAlign: 'center',
        lightBlueBtnBoxSizing: 'border-box',
        lightBlueBtnMarginLeft: '10px',
        lightBlueBtnColor: '#fff',
        lightBlueBtnCursor: 'pointer',

        lightBlueBtnHoverBackground: 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;',

        tableHeadClear: 'both',
        tableHeadWidth: '100%',

        tableHeadUlClear: 'both',
        tableHeadUlWidth: '100%',
        tableHeadUlBackgroundColor: '#0E162D',
        tableHeadBorderRadius: '5px',
        tableHeadOutLine: '1px solid var(--navy-color)',

        tableHeadUlLiFloat: 'left',
        tableHeadUlLiFlex: 1,
        tableHeadUlLiColor: '#fff',
        tableHeadUlLiFontWeight: 400,
        tableHeadUlLiTextAlign: 'center',
        tableHeadUlLiPadding: '0 5px',
        tableHeadUlLiHeight: '38px',
        tableHeadUlLiLineHeight: '38px',

        tableHeadUlLiTableCheckWidth: '50px !important',
        tableHeadUlLiTableCheckFlex: 'none',

        tablebodyClear: 'both',
        tablebodyWidth: '100%',

        tablebodyUlClear: 'both',
        tablebodyUlBorderBottom: '1px solid rgba(255, 255, 255, .1)',

        tablebodyUlLiFloat: 'left',
        tablebodyUlLiFlex: 1,
        tablebodyUlLiColor: '#fff',
        tablebodyUlLiFontWeight: 300,
        tablebodyUlLiTextAlign: 'center',
        tablebodyUlLiVerticalAlign: 'middle',
        tablebodyUlLiMinHeight: '30px',
        tablebodyUlLiPadding: '10px 5px',
        tablebodyUlLiBoxSizing: 'border-box',

        tablebodyUlLitableCheckWidth: '50px !important',
        tablebodyUlLitableCheckFlex: 'none',
        tablebodyUlLitableCheckTextAlign: 'center',

        checkboxCssEtcPosition: 'relative',
        checkboxCssEtcCursor: 'pointer',
        checkboxCssEtcColor: '#666',
        checkboxCssEtcFontWeight: 500,
        checkboxCssEtcWebkitUserSelect: 'none',
        checkboxCssEtcMozUserSelect: 'none',
        checkboxCssEtcMsUserSelect: 'none',
        checkboxCssEtcUserSelect: 'none',
        checkboxCssEtcPadding: '0 5px',

        checkboxCssEtcInputPosition: 'absolute',
        checkboxCssEtcInputOpacity: 0,
        checkboxCssEtcInputCursor: 'pointer',
        checkboxCssEtcInputHeight: 0,
        checkboxCssEtcInputWidth: 0,

        checkmarkEtcPosition: 'absolute',
        checkmarkEtcTop: '2px',
        checkmarkEtcLeft: 0,
        checkmarkEtcHeight: '14px',
        checkmarkEtcWidth: '14px',
        checkmarkEtcLineHeight: '14px',
        checkmarkEtcBackgroundColor: 'transparent',
        checkmarkEtcBorder: '1px solid #fff',
        checkmarkEtcBorderRadius: 0,
        checkmarkEtcBoxSizing: 'border-box',

        checkboxCssBHoverInputCheckmarkBBackgroundColor: 'transparent',

        checkboxCssEtcInputCheckedCheckmarkEtcBackgroundColor: 'transparent',
        checkboxCssEtcInputCheckedCheckmarkEtcBorder: '1px solid #c0c0c0',

        checkmarkEtcAfterPosition: 'absolute',
        checkmarkEtcAfterDisplay: 'none',

        checkboxCssEtcInputCheckedCheckmarkEtcAfterDisplay: 'block',

        checkboxCssEtcCheckmarkEtcAfterLeft: '3px',
        checkboxCssEtcCheckmarkEtcAfterTop: '-3px',
        checkboxCssEtcCheckmarkEtcAfterWidth: '5px',
        checkboxCssEtcCheckmarkEtcAfterHeight: '10px',
        checkboxCssEtcCheckmarkEtcAfterBorder: 'solid #fff',
        checkboxCssEtcCheckmarkEtcAfterBorderWidth: '0 2px 2px 0',
        checkboxCssEtcCheckmarkEtcAfterWebkitTransform: 'rotate(45deg)',
        checkboxCssEtcCheckmarkEtcAfterMsTransform: 'rotate(45deg)',
        checkboxCssEtcCheckmarkEtcAfterTransform: 'rotate(45deg)',

        tableScrollHeight: '212px',
    }
};

export const AccountManagerPopup = styled(AccountPopup)`
    height: ${_AccountManagerPopup[PR.styleMode].divHeight};

    .order {
        order: ${_AccountManagerPopup[PR.styleMode].order};
    }

    .marginBottom {
        margin-bottom: ${_AccountManagerPopup[PR.styleMode].marginBottom};
    }

    .btn-wrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        margin-top: 20px;
    }

    .popupBox {
        position: ${_AccountManagerPopup[PR.styleMode].popupBoxPosition};
        width: ${_AccountManagerPopup[PR.styleMode].popupBoxWidth};
        height: ${_AccountManagerPopup[PR.styleMode].popupBoxHeight};
        background: ${_AccountManagerPopup[PR.styleMode].popupBoxBackground};
        border: ${_AccountManagerPopup[PR.styleMode].popupBoxBorder};
        border-radius: ${_AccountManagerPopup[PR.styleMode].popupBoxBorderRadius};
        padding: ${_AccountManagerPopup[PR.styleMode].popupBoxPadding};
        box-sizing: ${_AccountManagerPopup[PR.styleMode].popupBoxBoxSizing};
        display: ${_AccountManagerPopup[PR.styleMode].popupBoxDisplay};
        flex-direction: ${_AccountManagerPopup[PR.styleMode].popupBoxFlexDirection};
    }
    .popupboxLine {
        background-color: ${_AccountManagerPopup[PR.styleMode].popupboxLineBackgroundColor};
        width: ${_AccountManagerPopup[PR.styleMode].popupboxLineWidth};
        height: ${_AccountManagerPopup[PR.styleMode].popupboxLineHeight};
        position: ${_AccountManagerPopup[PR.styleMode].popupboxLinePosition};
        top: ${_AccountManagerPopup[PR.styleMode].popupboxLineTop};
        left: ${_AccountManagerPopup[PR.styleMode].popupboxLineLeft};
        border-radius: ${_AccountManagerPopup[PR.styleMode].popupboxLineBorderRadius};
    }

    .popupBoxTitle {
        font-size: ${_AccountManagerPopup[PR.styleMode].popupBoxTitleFontSize};
        color: ${_AccountManagerPopup[PR.styleMode].popupBoxTitleColor};
        font-weight: ${_AccountManagerPopup[PR.styleMode].popupBoxTitleFontWeight};
        margin-bottom: ${_AccountManagerPopup[PR.styleMode].popupBoxTitleMarginBottom};
        height: ${_AccountManagerPopup[PR.styleMode].popupBoxTitleHeight};
        line-height: ${_AccountManagerPopup[PR.styleMode].popupBoxTitleLineHeight};
        position: ${_AccountManagerPopup[PR.styleMode].popupBoxTitlePosition};
        top: ${_AccountManagerPopup[PR.styleMode].popupBoxTitleTop};
        left: ${_AccountManagerPopup[PR.styleMode].popupBoxTitleLeft};
    }

    .popupBoxX {
        position: ${_AccountManagerPopup[PR.styleMode].popupBoxXPosition};
        right: ${_AccountManagerPopup[PR.styleMode].popupBoxXRight};
        top: ${_AccountManagerPopup[PR.styleMode].popupBoxXTop};
        cursor: pointer;
    }
    
    .popupBoxX img {
        width: ${_AccountManagerPopup[PR.styleMode].popupBoxXImgWidth};
    }

    .boxTypeBlue {
        background: ${_AccountManagerPopup[PR.styleMode].boxTypeBlueBackground};
        border: ${_AccountManagerPopup[PR.styleMode].boxTypeBlueBorder};
        border-radius: ${_AccountManagerPopup[PR.styleMode].boxTypeBlueBorderRadius};
        padding: ${_AccountManagerPopup[PR.styleMode].boxTypeBluePadding};
        
        &.table {
            padding: ${_AccountManagerPopup[PR.styleMode].boxTypeBlueTablePadding};
        }
    }

    .blueInput {
        background: ${_AccountManagerPopup[PR.styleMode].blueInputBackground};
        width: ${_AccountManagerPopup[PR.styleMode].blueInputWidth};
        height: ${_AccountManagerPopup[PR.styleMode].blueInputHeight};
        border-radius: ${_AccountManagerPopup[PR.styleMode].blueInputBorderRadius};
        border: ${_AccountManagerPopup[PR.styleMode].blueInputBorder};
        color: ${_AccountManagerPopup[PR.styleMode].blueInputColor};
    }

    .blueInput td {
        padding-left: ${_AccountManagerPopup[PR.styleMode].blueInputTdPaddingLeft};
    }

    input.blueInput::-ms-input-placeholder {
        color: ${_AccountManagerPopup[PR.styleMode].inputBlueInputMsInputPlaceholderColor};
    }

    input.blueInput::-webkit-input-placeholder {
        color: ${_AccountManagerPopup[PR.styleMode].inputBlueInputWebkitInputPlaceholderColor};
    }

    input.blueInput::-moz-placeholder {
        color: ${_AccountManagerPopup[PR.styleMode].inputBlueInputMozInputPlaceholderColor};
    }

    .w90p {
        ${props => props.theme.variables.width('90%')};
    }

    .blueSel {
        background: ${_AccountManagerPopup[PR.styleMode].blueSelBackground};
        width: ${_AccountManagerPopup[PR.styleMode].blueSelWidth};
        height: ${_AccountManagerPopup[PR.styleMode].blueSelHeight};
        border-radius: ${_AccountManagerPopup[PR.styleMode].blueSelBorderRadius};
        border: ${_AccountManagerPopup[PR.styleMode].blueSelBorder};
        color: ${_AccountManagerPopup[PR.styleMode].blueSelColor};
        font-size: ${_AccountManagerPopup[PR.styleMode].blueSelFontSize};
        padding-left: ${_AccountManagerPopup[PR.styleMode].blueSelPaddingLeft};
        
        &.long {
            background: ${_AccountManagerPopup[PR.styleMode].blueSelLongBackground};
        }

        &.short {
            background: ${_AccountManagerPopup[PR.styleMode].blueSelShortBackground};
        }
    }

    .w100p {
        ${props => props.theme.variables.width('100%')};
    }

    .searchBlueBtn {
        background: ${_AccountManagerPopup[PR.styleMode].searchBlueBtnBackground};
        border-radius: ${_AccountManagerPopup[PR.styleMode].searchBlueBtnBorderRadius};
        font-size: ${_AccountManagerPopup[PR.styleMode].searchBlueBtnFontSize};
        color: ${_AccountManagerPopup[PR.styleMode].searchBlueBtnColor};
        text-align: ${_AccountManagerPopup[PR.styleMode].searchBlueBtnTextAlign};
        width: ${_AccountManagerPopup[PR.styleMode].searchBlueBtnWidth};
        height: ${_AccountManagerPopup[PR.styleMode].searchBlueBtnHeight};
        line-height: ${_AccountManagerPopup[PR.styleMode].searchBlueBtnLineHeight};
        display: ${_AccountManagerPopup[PR.styleMode].searchBlueBtnDisplay};
        cursor: ${_AccountManagerPopup[PR.styleMode].searchBlueBtnCursor};
    }

    .searchBlueBtn:hover {
        background: ${_AccountManagerPopup[PR.styleMode].searchBlueBtnHoberBackground};
    }


    .tel3col {
        clear: ${_AccountManagerPopup[PR.styleMode].tel3colClear};
    }

    .tel3col li {
        width: ${_AccountManagerPopup[PR.styleMode].tel3colLiWidth};
        float: ${_AccountManagerPopup[PR.styleMode].tel3colLiFloat};
        margin-right: ${_AccountManagerPopup[PR.styleMode].tel3colLiMarginRight};
    }

    .tel3col li:first-child {
        position: ${_AccountManagerPopup[PR.styleMode].tel3colLiFirstChildPosition};
        padding-right: ${_AccountManagerPopup[PR.styleMode].tel3colLiFirstChildPaddingRight};
        margin-right: ${_AccountManagerPopup[PR.styleMode].tel3colLiFirstChildMarginRight};
    }

    .tel3col li:first-child span {
        position: ${_AccountManagerPopup[PR.styleMode].tel3colLiFirstChildSpanPosition};
        right: ${_AccountManagerPopup[PR.styleMode].tel3colLiFirstChildSpanRight};
        top: ${_AccountManagerPopup[PR.styleMode].tel3colLiFirstChildSpanTop};
        width: ${_AccountManagerPopup[PR.styleMode].tel3colLiFirstChildSpanWidth};
        display: ${_AccountManagerPopup[PR.styleMode].tel3colLiFirstChildSpanDisplay};
        text-align: ${_AccountManagerPopup[PR.styleMode].tel3colLiFirstChildSpanTextAlign};
    }

    .tel3col li:last-child {
        margin-right: ${_AccountManagerPopup[PR.styleMode].tel3colLiLastChildMarginRight};
    }

    .gap20 {
        ${props => props.theme.variables.gap('20px')}
        display: ${_AccountManagerPopup[PR.styleMode].gapDisplay};
    }

    .darkNaveBtn {
        display: ${_AccountManagerPopup[PR.styleMode].darkNaveBtnDisplay};
        width: ${_AccountManagerPopup[PR.styleMode].darkNaveBtnWidth};
        height: ${_AccountManagerPopup[PR.styleMode].darkNaveBtnHeight};
        line-height: ${_AccountManagerPopup[PR.styleMode].darkNaveBtnLineHeight};
        background: ${_AccountManagerPopup[PR.styleMode].darkNaveBtnBackground};
        border: ${_AccountManagerPopup[PR.styleMode].darkNaveBtnBorder};
        border-radius: ${_AccountManagerPopup[PR.styleMode].darkNaveBtnBorderRadius};
        font-size: ${_AccountManagerPopup[PR.styleMode].darkNaveBtnFontSize};
        text-align: ${_AccountManagerPopup[PR.styleMode].darkNaveBtnTextAlign};
        box-sizing: ${_AccountManagerPopup[PR.styleMode].darkNaveBtnBoxSizing};
        margin-left: ${_AccountManagerPopup[PR.styleMode].darkNaveBtnMarginLeft};
        color: ${_AccountManagerPopup[PR.styleMode].darkNaveBtnColor};
        cursor: ${_AccountManagerPopup[PR.styleMode].darkNaveBtnCursor};
    }

    .darkNaveBtn:hover {
        background: ${_AccountManagerPopup[PR.styleMode].darkNaveBtnHoverBackground};
    }

    .lightNaveBtn {
        display: ${_AccountManagerPopup[PR.styleMode].lightNaveBtnDisplay};
        width: ${_AccountManagerPopup[PR.styleMode].lightNaveBtnWidth};
        height: ${_AccountManagerPopup[PR.styleMode].lightNaveBtnHeight};
        line-height: ${_AccountManagerPopup[PR.styleMode].lightNaveBtnLineHeight};
        background: ${_AccountManagerPopup[PR.styleMode].lightNaveBtnBackground};
        border: ${_AccountManagerPopup[PR.styleMode].lightNaveBtnBorder};
        border-radius: ${_AccountManagerPopup[PR.styleMode].lightNaveBtnBorderRadius};
        font-size: ${_AccountManagerPopup[PR.styleMode].lightNaveBtnFontSize};
        text-align: ${_AccountManagerPopup[PR.styleMode].lightNaveBtnTextAlign};
        box-sizing: ${_AccountManagerPopup[PR.styleMode].lightNaveBtnBoxSizing};
        margin-left: ${_AccountManagerPopup[PR.styleMode].lightNaveBtnMarginLeft};
        color: ${_AccountManagerPopup[PR.styleMode].lightNaveBtnColor};
        cursor: ${_AccountManagerPopup[PR.styleMode].lightNaveBtnCursor};
    }

    .lightNaveBtn:hover {
        background: ${_AccountManagerPopup[PR.styleMode].lightNaveBtnHoverBackground};
    }

    .lightBlueBtn {
        display: ${_AccountManagerPopup[PR.styleMode].lightBlueBtnDisplay};
        width: ${_AccountManagerPopup[PR.styleMode].lightBlueBtnWidth};
        height: ${_AccountManagerPopup[PR.styleMode].lightBlueBtnHeight};
        line-height: ${_AccountManagerPopup[PR.styleMode].lightBlueBtnLineHeight};
        background: ${_AccountManagerPopup[PR.styleMode].lightBlueBtnBackground};
        border: ${_AccountManagerPopup[PR.styleMode].lightBlueBtnBorder};
        border-radius: ${_AccountManagerPopup[PR.styleMode].lightBlueBtnBorderRadius};
        font-size: ${_AccountManagerPopup[PR.styleMode].lightBlueBtnFontSize};
        text-align: ${_AccountManagerPopup[PR.styleMode].lightBlueBtnTextAlign};
        box-sizing: ${_AccountManagerPopup[PR.styleMode].lightBlueBtnBoxSizing};
        margin-left: ${_AccountManagerPopup[PR.styleMode].lightBlueBtnMarginLeft};
        color: ${_AccountManagerPopup[PR.styleMode].lightBlueBtnColor};
        cursor: ${_AccountManagerPopup[PR.styleMode].lightBlueBtnCursor};
    }

    .lightBlueBtn:hover {
        background: ${_AccountManagerPopup[PR.styleMode].lightBlueBtnHoverBackground};
    }

    .tableHead {
        clear: ${_AccountManagerPopup[PR.styleMode].tableHeadClear};
        width: ${_AccountManagerPopup[PR.styleMode].tableHeadWidth};
    }

    .tableHead ul {
        clear: ${_AccountManagerPopup[PR.styleMode].tableHeadUlClear};
        width: ${_AccountManagerPopup[PR.styleMode].tableHeadUlWidth};
        background-color: ${_AccountManagerPopup[PR.styleMode].tableHeadUlBackgroundColor};
        border-radius: ${_AccountManagerPopup[PR.styleMode].tableHeadBorderRadius};
        ${props => props.theme.variables.flex()}
        outline: ${_AccountManagerPopup[PR.styleMode].tableHeadOutLine};
    }

    .tableHead ul li {
        float: ${_AccountManagerPopup[PR.styleMode].tableHeadUlLiFloat};
        flex: ${_AccountManagerPopup[PR.styleMode].tableHeadUlLiFlex};
        color: ${_AccountManagerPopup[PR.styleMode].tableHeadUlLiColor};
        font-weight: ${_AccountManagerPopup[PR.styleMode].tableHeadUlLiFontWeight};
        text-align: ${_AccountManagerPopup[PR.styleMode].tableHeadUlLiTextAlign};
        padding: ${_AccountManagerPopup[PR.styleMode].tableHeadUlLiPadding};
        height: ${_AccountManagerPopup[PR.styleMode].tableHeadUlLiHeight};
        line-height: ${_AccountManagerPopup[PR.styleMode].tableHeadUlLiLineHeight};
    }

    .tableHead ul li.tableCheck {
        width: ${_AccountManagerPopup[PR.styleMode].tableHeadUlLiTableCheckWidth};
        flex: ${_AccountManagerPopup[PR.styleMode].tableHeadUlLiTableCheckFlex};
    }

    .tablebody {
        clear: ${_AccountManagerPopup[PR.styleMode].tablebodyClear};
        width: ${_AccountManagerPopup[PR.styleMode].tablebodyWidth};
    }

    .tablebody ul {
        clear: ${_AccountManagerPopup[PR.styleMode].tablebodyUlClear};
        border-bottom: ${_AccountManagerPopup[PR.styleMode].tablebodyUlBorderBottom};
        ${props => props.theme.variables.flex()}
    }

    .tablebody ul li {
        float: ${_AccountManagerPopup[PR.styleMode].tablebodyUlLiFloat};
        flex: ${_AccountManagerPopup[PR.styleMode].tablebodyUlLiFlex};
        color: ${_AccountManagerPopup[PR.styleMode].tablebodyUlLiColor};
        font-weight: ${_AccountManagerPopup[PR.styleMode].tablebodyUlLiFontWeight};
        text-align: ${_AccountManagerPopup[PR.styleMode].tablebodyUlLiTextAlign};
        vertical-align: ${_AccountManagerPopup[PR.styleMode].tablebodyUlLiVerticalAlign};
        min-height: ${_AccountManagerPopup[PR.styleMode].tablebodyUlLiMinHeight};
        padding: ${_AccountManagerPopup[PR.styleMode].tablebodyUlLiPadding};
        box-sizing: ${_AccountManagerPopup[PR.styleMode].tablebodyUlLiBoxSizing};
    } 
    
    .tablebody ul li.tableCheck {
        width: ${_AccountManagerPopup[PR.styleMode].tablebodyUlLitableCheckWidth};
        flex: ${_AccountManagerPopup[PR.styleMode].tablebodyUlLitableCheckFlex};
        text-align: ${_AccountManagerPopup[PR.styleMode].tablebodyUlLitableCheckTextAlign};
    }

    .checkboxCssEtc {
        position: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcPosition};
        cursor: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcCursor};
        color: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcColor};
        font-weight: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcFontWeight};
        -webkit-user-select: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcWebkitUserSelect};
        -moz-user-select: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcMozUserSelect};
        -ms-user-select: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcMsUserSelect};
        user-select: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcUserSelect};
        padding: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcPadding};
        line-height: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcLineHeight};
    }

    .checkboxCssEtc input {
        position: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcInputPosition};
        opacity: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcInputOpacity};
        cursor: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcInputCursor};
        height: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcInputHeight};
        width: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcInputWidth};
    }

    .checkmarkEtc {
        position: ${_AccountManagerPopup[PR.styleMode].checkmarkEtcPosition};
        top: ${_AccountManagerPopup[PR.styleMode].checkmarkEtcTop};
        left: ${_AccountManagerPopup[PR.styleMode].checkmarkEtcLeft};
        height: ${_AccountManagerPopup[PR.styleMode].checkmarkEtcHeight};
        width: ${_AccountManagerPopup[PR.styleMode].checkmarkEtcWidth};
        line-height: ${_AccountManagerPopup[PR.styleMode].checkmarkEtcLineHeight};
        background-color: ${_AccountManagerPopup[PR.styleMode].checkmarkEtcBackgroundColor};
        border: ${_AccountManagerPopup[PR.styleMode].checkmarkEtcBorder};
        border-radius: ${_AccountManagerPopup[PR.styleMode].checkmarkEtcBorderRadius};
        box-sizing: ${_AccountManagerPopup[PR.styleMode].checkmarkEtcBoxSizing};
    }

    .checkboxCssB:hover input ~ .checkmarkB {
        background-color: ${_AccountManagerPopup[PR.styleMode].checkboxCssBHoverInputCheckmarkBBackgroundColor};
    }

    .checkboxCssEtc input:checked ~ .checkmarkEtc {
        background-color: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcInputCheckedCheckmarkEtcBackgroundColor};
        border: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcInputCheckedCheckmarkEtcBorder};
    }

    .checkmarkEtc:after {
        content: "";
        position: ${_AccountManagerPopup[PR.styleMode].checkmarkEtcAfterPosition};
        display: ${_AccountManagerPopup[PR.styleMode].checkmarkEtcAfterDisplay};
    }

    .checkboxCssEtc input:checked ~ .checkmarkEtc:after {
        display: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcInputCheckedCheckmarkEtcAfterDisplay};
    }

    .checkboxCssEtc .checkmarkEtc:after {
        left: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcCheckmarkEtcAfterLeft};
        top: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcCheckmarkEtcAfterTop};
        width: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcCheckmarkEtcAfterWidth};
        height: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcCheckmarkEtcAfterHeight};
        border: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcCheckmarkEtcAfterBorder};
        border-width: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcCheckmarkEtcAfterBorderWidth};
        -webkit-transform: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcCheckmarkEtcAfterWebkitTransform};
        -ms-transform: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcCheckmarkEtcAfterMsTransform};
        transform: ${_AccountManagerPopup[PR.styleMode].checkboxCssEtcCheckmarkEtcAfterTransform};
    }

    .tableScroll {
        min-height: ${_AccountManagerPopup[PR.styleMode].tableScrollHeight};
        max-height: ${_AccountManagerPopup[PR.styleMode].tableScrollHeight};
        overflow-y: auto;
    }
`;


// 비밀번호 변경 팝업
export const _AccountChangePwdPopup = {
    soulbrain: {
        passwordContsWidth: '570px',
        passwordContsHeight: '420px',
        passwordContsBackground: '#162235',
        passwordContsBorder: '1px solid #3b3f5c',
        passwordContsBorderRadius: 0,

        passwordBoxTitleHeight: '60px',
        passwordBoxTitleBackground: '#3b3f5c',
        passwordBoxTitleFontSize: '26px',
        passwordBoxTitleColor: '#fff',
        passwordBoxTitleTextAlign: 'center',

        DblueInputBackground: '#0a0c1b',
        DblueInputHeight: '50px !important',
        btnBlueBackground: '#359ace',
        btnBlueWidth: '100px',
        btnBlueHeight: '40px',
        btnBlueHover: '#3389b6',
        btnBlueMarginRight: '8px',

        btnNavyBackground: '#3b3f5c',
        btnNavyHover: '#2b2f49',

        passwordBoxTxtPaddingTop: '10px',
        passwordBoxTxtPaddingBottom: '30px',
    },
    Wonik: {
        passwordContsWidth: '453px',
        passwordContsBackground: 'rgba(14, 22, 45, 0.8)',
        passwordContsBorder: '1px solid rgba(255, 255, 255, 0.1)',
        passwordContsBorderRadius: '5px',

        passwordBoxTitleHeight: '40px',
        passwordBoxTitleBackground: 'rgba(255, 255, 255, .1)',
        passwordBoxTitleFontSize: '16px',
        passwordBoxTitleColor: 'var(--title-bar-text-blue-color)',
        passwordBoxTitleFontWeight: '600',
        passwordBoxTitleTextAlign: 'left',
        passwordBoxTitlePaddingLeft: '20px',
        passwordBoxTitleBorder: '4px 4px 0 0',

        DblueInputBackground: '#0E162D',
        DblueInputHeight: '38px !important',
        passwordBoxFontSize: '16px',
        btnBlueBackground: `transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;`,
        btnBlueWidth: '68px',
        btnBlueHeight: '28px',
        btnBlueFontSize: '14px',
        btnBlueHover: `transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;`,
        btnBlueMarginRight: '10px',

        btnNavyBackground: 'var(--navy-color)',
        btnNavyHover: 'var(--navy-color)',

        passwordBoxTxtPaddingBottom: '10px',
    },
    Hydrogen: {
        passwordContsWidth: '453px',
        passwordContsBackground: 'rgba(14, 22, 45, 1)',
        passwordContsBorder: '1px solid rgba(255, 255, 255, 0.1)',
        passwordContsBorderRadius: '5px',

        passwordBoxTitleHeight: '40px',
        passwordBoxTitleBackground: 'rgba(255, 255, 255, .1)',
        passwordBoxTitleFontSize: '16px',
        passwordBoxTitleColor: 'var(--title-bar-text-blue-color)',
        passwordBoxTitleFontWeight: '600',
        passwordBoxTitleTextAlign: 'left',
        passwordBoxTitlePaddingLeft: '20px',
        passwordBoxTitleBorder: '4px 4px 0 0',

        DblueInputBackground: 'var(--navy-color)',
        DblueInputHeight: '38px !important',
        passwordBoxFontSize: '16px',
        btnBlueBackground: `transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;`,
        btnBlueWidth: '68px',
        btnBlueHeight: '28px',
        btnBlueFontSize: '14px',
        btnBlueHover: `transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;`,
        btnBlueMarginRight: '10px',

        btnNavyBackground: 'var(--navy-color)',
        btnNavyHover: 'var(--navy-color)',

        passwordBoxTxtPaddingBottom: '10px',
    },
    Gyeonggi: {
        passwordContsWidth: '453px',
        passwordContsBackground: 'rgba(14, 22, 45, 1)',
        passwordContsBorder: '1px solid rgba(255, 255, 255, 0.1)',
        passwordContsBorderRadius: '5px',

        passwordBoxTitleHeight: '40px',
        passwordBoxTitleBackground: 'rgba(255, 255, 255, .1)',
        passwordBoxTitleFontSize: '16px',
        passwordBoxTitleColor: 'var(--title-bar-text-blue-color)',
        passwordBoxTitleFontWeight: '600',
        passwordBoxTitleTextAlign: 'left',
        passwordBoxTitlePaddingLeft: '20px',
        passwordBoxTitleBorder: '4px 4px 0 0',

        DblueInputBackground: 'var(--navy-color)',
        DblueInputHeight: '38px !important',
        passwordBoxFontSize: '16px',
        btnBlueBackground: `transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;`,
        btnBlueWidth: '68px',
        btnBlueHeight: '28px',
        btnBlueFontSize: '14px',
        btnBlueHover: `transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;`,
        btnBlueMarginRight: '10px',

        btnNavyBackground: 'var(--navy-color)',
        btnNavyHover: 'var(--navy-color)',

        passwordBoxTxtPaddingBottom: '10px',
    }
}

export const AccountChangePwdPopup = styled(AccountPopup)`
    height: auto !important;

    .passwordConts {
        position: relative;
        width: ${_AccountChangePwdPopup[PR.styleMode].passwordContsWidth};
        height: ${_AccountChangePwdPopup[PR.styleMode].passwordContsHeight};
        background: ${_AccountChangePwdPopup[PR.styleMode].passwordContsBackground};
        border: ${_AccountChangePwdPopup[PR.styleMode].passwordContsBorder};
        border-radius: ${_AccountChangePwdPopup[PR.styleMode].passwordContsBorderRadius};
        padding: 0;
        box-sizing: border-box;
    }

    .passwordBoxTitle {
        height: ${_AccountChangePwdPopup[PR.styleMode].passwordBoxTitleHeight};
        line-height: ${_AccountChangePwdPopup[PR.styleMode].passwordBoxTitleHeight};
        text-align: ${_AccountChangePwdPopup[PR.styleMode].passwordBoxTitleTextAlign};
        color: ${_AccountChangePwdPopup[PR.styleMode].passwordBoxTitleColor};
        font-size: ${_AccountChangePwdPopup[PR.styleMode].passwordBoxTitleFontSize};
        background: ${_AccountChangePwdPopup[PR.styleMode].passwordBoxTitleBackground};
        font-weight: ${_AccountChangePwdPopup[PR.styleMode].passwordBoxTitleFontWeight};
        padding-left: ${_AccountChangePwdPopup[PR.styleMode].passwordBoxTitlePaddingLeft};
        border-radius: ${_AccountChangePwdPopup[PR.styleMode].passwordBoxTitleBorder};
    }

    .passwordBox {
        padding: 20px;
        font-size: ${_AccountChangePwdPopup[PR.styleMode].passwordBoxFontSize};
    }

    .passwordBoxTxt {
        font-size: 18px;
        padding-top: ${_AccountChangePwdPopup[PR.styleMode].passwordBoxTxtPaddingTop};
        padding-bottom: ${_AccountChangePwdPopup[PR.styleMode].passwordBoxTxtPaddingBottom};
        color: #fff;
    }

    .DblueInput {
        background: ${_AccountChangePwdPopup[PR.styleMode].DblueInputBackground};
        width: 100%;
        height: ${_AccountChangePwdPopup[PR.styleMode].DblueInputHeight};
        border-radius: 5px;
        border: none !important;
        color: #fff;
        width: 100% !important;
    }

    input.DblueInput::-ms-input-placeholder {
        color: rgba(255, 255, 255, 0.5);
    }

    input.DblueInput::-webkit-input-placeholder {
        color: rgba(255, 255, 255, 0.5);
    }

    input.DblueInput::-moz-placeholder {
        color: rgba(255, 255, 255, 0.5);
    }

    .gap20 {
        height: 20px;
        clear: both;
        overflow: hidden;
    }

    .btnBlue {
        background: ${_AccountChangePwdPopup[PR.styleMode].btnBlueBackground};
        border-radius: 5px;
        width: ${_AccountChangePwdPopup[PR.styleMode].btnBlueWidth};
        height: ${_AccountChangePwdPopup[PR.styleMode].btnBlueHeight};
        line-height: ${_AccountChangePwdPopup[PR.styleMode].btnBlueHeight};
        text-align: center;
        color: #fff;
        display: inline-block;
        margin-right: ${_AccountChangePwdPopup[PR.styleMode].btnBlueMarginRight};
        cursor: pointer;
        font-size: ${_AccountChangePwdPopup[PR.styleMode].btnBlueFontSize};
    }

    .btnBlue:hover {
        background: ${_AccountChangePwdPopup[PR.styleMode].btnBlueHover};
        cursor: pointer;
    }

    .btnNavy {
        background: ${_AccountChangePwdPopup[PR.styleMode].btnNavyBackground};
        border-radius: 5px;
        width: ${_AccountChangePwdPopup[PR.styleMode].btnBlueWidth};
        height: ${_AccountChangePwdPopup[PR.styleMode].btnBlueHeight};
        line-height: ${_AccountChangePwdPopup[PR.styleMode].btnBlueHeight};
        text-align: center;
        color: #fff;
        display: inline-block;
        cursor: pointer;
        font-size: ${_AccountChangePwdPopup[PR.styleMode].btnBlueFontSize};
    }

    .btnNavy:hover {
        background: ${_AccountChangePwdPopup[PR.styleMode].btnNavyHover};
        cursor: pointer;
    }

    .btnArea {
        text-align: center;
    }
`;


export const _AccountManagerNewPopup = {
    soulbrain: {
        mainColor: '#ff8400',
        searchHover: `url(${search_on_sb}) no-repeat center center, rgba(255, 132, 0, .3)`,
        updateHover: `url(${update_on_sb}) no-repeat center center, rgba(255, 132, 0, .3)`,
        deleteHover: `url(${delete_on_sb}) no-repeat center center, rgba(255, 132, 0, .3)`,
    },
    Wonik: {
        mainColor: 'var(--title-bar-text-blue-color)',
        searchHover: `url(${search_on}) no-repeat center center, rgba(83, 152, 255, .3)`,
        updateHover: `url(${update_on}) no-repeat center center, rgba(83, 152, 255, .3)`,
        deleteHover: `url(${delete_on}) no-repeat center center, rgba(83, 152, 255, .3)`,
    },
    Hydrogen: {
        mainColor: 'var(--title-bar-text-blue-color)',
        searchHover: `url(${search_on}) no-repeat center center, rgba(83, 152, 255, .3)`,
        updateHover: `url(${update_on}) no-repeat center center, rgba(83, 152, 255, .3)`,
        deleteHover: `url(${delete_on}) no-repeat center center, rgba(83, 152, 255, .3)`,
    },
    Gyeonggi: {
        mainColor: 'var(--title-bar-text-blue-color)',
        searchHover: `url(${search_on}) no-repeat center center, rgba(83, 152, 255, .3)`,
        updateHover: `url(${update_on}) no-repeat center center, rgba(83, 152, 255, .3)`,
        deleteHover: `url(${delete_on}) no-repeat center center, rgba(83, 152, 255, .3)`,
    }
}

export const AccountManagerNewPopup = styled(AccountPopup)`
    height: 823px;
    top: 52%;
    transform: translate(-50%, -52%);
    
    .popupBox {
        position: ${_AccountManagerPopup[PR.styleMode].popupBoxPosition};
        width: 1434px;
        height: 823px;
        background: ${_AccountManagerPopup[PR.styleMode].popupBoxBackground};
        border: ${_AccountManagerPopup[PR.styleMode].popupBoxBorder};
        border-radius: ${_AccountManagerPopup[PR.styleMode].popupBoxBorderRadius};
        padding: ${_AccountManagerPopup[PR.styleMode].popupBoxPadding};
        box-sizing: ${_AccountManagerPopup[PR.styleMode].popupBoxBoxSizing};
        display: ${_AccountManagerPopup[PR.styleMode].popupBoxDisplay};
        flex-direction: ${_AccountManagerPopup[PR.styleMode].popupBoxFlexDirection};
    }

    .popupboxLine {
        background-color: ${_AccountManagerPopup[PR.styleMode].popupboxLineBackgroundColor};
        width: ${_AccountManagerPopup[PR.styleMode].popupboxLineWidth};
        height: ${_AccountManagerPopup[PR.styleMode].popupboxLineHeight};
        position: ${_AccountManagerPopup[PR.styleMode].popupboxLinePosition};
        top: ${_AccountManagerPopup[PR.styleMode].popupboxLineTop};
        left: ${_AccountManagerPopup[PR.styleMode].popupboxLineLeft};
        border-radius: ${_AccountManagerPopup[PR.styleMode].popupboxLineBorderRadius};
    }

    .popupBoxTitle {
        font-size: ${_AccountManagerPopup[PR.styleMode].popupBoxTitleFontSize};
        color: ${_AccountManagerPopup[PR.styleMode].popupBoxTitleColor};
        font-weight: ${_AccountManagerPopup[PR.styleMode].popupBoxTitleFontWeight};
        margin-bottom: ${_AccountManagerPopup[PR.styleMode].popupBoxTitleMarginBottom};
        height: ${_AccountManagerPopup[PR.styleMode].popupBoxTitleHeight};
        line-height: ${_AccountManagerPopup[PR.styleMode].popupBoxTitleLineHeight};
        position: ${_AccountManagerPopup[PR.styleMode].popupBoxTitlePosition};
        top: ${_AccountManagerPopup[PR.styleMode].popupBoxTitleTop};
        left: ${_AccountManagerPopup[PR.styleMode].popupBoxTitleLeft};
    }

    .popupBoxX {
        position: ${_AccountManagerPopup[PR.styleMode].popupBoxXPosition};
        right: ${_AccountManagerPopup[PR.styleMode].popupBoxXRight};
        top: ${_AccountManagerPopup[PR.styleMode].popupBoxXTop};
        cursor: pointer;
    }
    
    .popupBoxX img {
        width: ${_AccountManagerPopup[PR.styleMode].popupBoxXImgWidth};
    }

    .popupContent {
        height: calc(100% - 36px);
        
        .menuWrap {
            width: 100%;
            border-bottom: 1px solid #A5A5A5;

            p {
                color: #fff;
                font-size: 14px;
                width: 60px;
                padding: 0 15px 7px 15px;
                border-bottom: 3px solid ${_AccountManagerNewPopup[PR.styleMode].mainColor};
                text-align: center;
                position: relative;
                bottom: -2px;
            }
        }

        .searchWrap {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 4px;
            padding: 8px 0;
            margin-right: 2px;

            input {
                width: 297px;
                height: 27px;
                background: rgba(255, 255, 255, .1);
                border-radius: 4px;
                color: #fff;
                font-size: 12px;
                padding-left: 10px;
                border: 0;
            }

            a {
                display: block;
                width: 27px;
                height: 27px;
                text-indent: -9999px;
                border-radius: 2px;
                cursor: pointer;

                &:nth-child(2) {
                    background: url(${search_off}) no-repeat center center, rgba(204, 204, 204, .3);

                    &:hover {
                        background: ${_AccountManagerNewPopup[PR.styleMode].searchHover};
                    }
                }

                &:nth-child(3) {
                    background: url(${update_off}) no-repeat center center, rgba(204, 204, 204, .3);

                    &:hover {
                        background: ${_AccountManagerNewPopup[PR.styleMode].updateHover};
                    }
                }

                &:nth-child(4) {
                    background: url(${delete_off}) no-repeat center center, rgba(204, 204, 204, .3);

                    &:hover {
                        background: ${_AccountManagerNewPopup[PR.styleMode].deleteHover};
                    }
                }
            }
        }

        .userList {
            height: calc(100% - 128px);
            position: relative;

            overflow-x: hidden;
            overflow-y: auto !important;
    
            table {
                text-align: center;
                font-size: 12px;
    
                thead {
                    height: 31px !important;
                    line-height: 31px;
                    color: #A5A5A5;
                    background-color: #272E42;

                    tr {
                        td {
                            height: 31px !important;
                            &:not(:last-child){
                                border-right: 1px dashed #525868;
                            }

                            &.userId {
                                position: relative;
                            }

                            div {
                                display: inline-block;
                                position: absolute;
                                right: 5px;
                                top: 7px;
                                cursor: pointer;
                                line-height: 0;

                                &:hover {
                                    p {
                                        display: block;
                                    }
                                }
                                
                                p {
                                    display: none;
                                    position: absolute;
                                    transform: translate(-50%, 40%);
                                    width: 347px;
                                    height: 22px;
                                    line-height: 23px;
                                    background: #000000;
                                    border-radius: 4px;
                                    font-size: 12px;
                                    color: #fff;

                                    &::before {
                                        content: '';
                                        display: block;
                                        width: 11px;
                                        height: 10px;
                                        clip-path: polygon(50% 29%, 0% 100%, 100% 100%);
                                        background-color: #000000;
                                        position: absolute;
                                        top: -9px;
                                        left: 176px;
                                    }
                                }
                            }

                            .sortBtn {
                                text-indent: -9999px;
                                width: 15px;
                                height: 15px;
                                background: url(${sortIcon}) no-repeat center center;
                                margin-left: 5px;
                            }
                        }
                    }
                    
                }
    
                tbody {
                    color: #fff;
    
                    tr {
                        height: 41px;
                        line-height: 41px;
                        border-bottom: 1px dashed #525868;

                        &:hover {
                            background-color: rgba(112, 112, 112, .1);
                        }
    
                        td {
    
                            &:not(:last-child){
                                border-right: 1px dashed #525868;
                            }
                        }
                    }

                    tr.on {
                        background: rgba(112, 112, 112, .1);
                        color: #fff;
                    }

                    input[type="text"] {
                        width: 127px;
                        height: 26px;
                        background: transparent;
                        border: 1px solid #CCCCCC;
                        color: #fff;
                        text-align: center;
                    }

                    select {
                        width: 104px;
                        height: 26px;
                        line-height: 24px;
                        border: 1px solid #CCCCCC;
                        border-radius: 0;
                        color: #fff;
                        font-size: 12px;
                        text-align: center;
                        cursor: pointer;
                        background:transparent url(${select_arrow}) 95% 49% no-repeat;
                    }

                    option {
                        color: #000000;
                    }
                }

                input[type="checkbox"] {
                    width: 12px;
                    height: 12px;
                    background: #fff;
                    border-color: #bbb;
                }

                input[type="checkbox"]:checked {
                    background: ${_AccountManagerNewPopup[PR.styleMode].mainColor} url(${checkbox}) no-repeat center center;
                    background-size: 14px auto !important;
                }
            }
        }

        .buttonWrap {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 9px;
            width: 100%;
            position: absolute;
            bottom: 0;

            li {
                width: 96px;
                height: 35px;
                border-radius: 4px;
                line-height: 35px;
                text-align: center;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;

                &.cancelBtn {
                    background-color: var(--background-color);
                    color: #A5A5A5;
                }

                &.saveBtn {
                    background-color: ${_AccountManagerNewPopup[PR.styleMode].mainColor};
                    color: #fff;
                }
            }
        }
        
        .userList + .buttonWrap {
            bottom: 24px;
            left: 0;
        }
    }

    .filterWrap {
        display: flex;
        align-items: center;
    }

    .selectSite{
        padding: 8px 0;
        display: inline-flex;
        margin-right: 20px;

        select{
            display: block;
            width: 156px;
            height: 28px;
            background: #0E162D url(${gg_titlebar_select_arrow}) 95% 49% no-repeat;
            border: 1px solid #525868;
            border-radius: 5px;
            color: #fff;
            font-size: 14px;
            padding-left: 10px;
            padding-right: 28px;
            cursor: pointer;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;

            &:hover {
                border: 1px solid #3B83F4;
            }

            &.on,
            &:active {
                border: 1px solid #4F96FE;
            }

            &:disabled {
                background: #0E162D url(${gg_titlebar_select_arrow_disabled}) 95% 49% no-repeat !important;
                color: #A5A5A5 !important;
                border: 1px solid #FFFFFF1A !important;
                pointer-events: none;
            }
        }

        option{

        }
    }
`;



export const AccessSSOPopup = styled(AccountPopup)`
    display: contents;
    width: 100%;
    height: 100vh;
    position: relative;

    .wonik-background{
        width: 100%;
        height: 100vh;
        background-image: url(${login_img1});
        background-position: 50% 50%;
        background-size: cover;
        opacity: 0.15;
        position: absolute;
        z-index: 2;
    }

    #spinner {
      margin: calc(50% - 25px) auto;
      width: 80px;
      height: 80px;
      box-sizing: border-box;
      border: 5px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 100%;
      z-index: 3;
      position: absolute;
      left: 48%;
      top: -55%;

      animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
      100%
      {
        transform: rotate(360deg);
      }
    }

    > p {
        display: inline-block;
        color: #fff;
        font-size: 36px;
        font-weight: bold;
        position: absolute;
        left: 45%;
        top: 55%;
        z-index: 3;
    }
    
    .gradient-bg {
        position: fixed;
        top: 0px;
        left: 0px;
        width: 150vw;
        height: 100vh;
        background: transparent linear-gradient(270deg, #1C232D00 0%, #0E162DB3 24%, #0E162D 59%, #0E162DE6 100%) no-repeat padding-box;
        position: absolute;
        z-index: 1;
    }
`;