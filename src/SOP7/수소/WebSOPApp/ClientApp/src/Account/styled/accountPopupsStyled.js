import styled from "styled-components";
import PR from "../../Root/resource/id";

import "../../Common/css/commonWonik.scss";

import buleSel from "../../Common/image/icon/bule_sel.png"

import page_first_icon from '../../Common/img/imghydrogen/main/page_first_icon.svg';
import page_first_icon_active from '../../Common/img/imghydrogen/main/page_first_icon_active.svg';
import page_prev_icon from '../../Common/img/imghydrogen/main/page_prev_icon.svg';
import page_prev_icon_active from '../../Common/img/imghydrogen/main/page_prev_icon_active.svg';
import page_next_icon from '../../Common/img/imghydrogen/main/page_next_icon.svg';
import page_next_icon_active from '../../Common/img/imghydrogen/main/page_next_icon_active.svg';
import page_last_icon from '../../Common/img/imghydrogen/main/page_last_icon.svg';
import page_last_icon_active from '../../Common/img/imghydrogen/main/page_last_icon_active.svg';
import magnifier_icon from '../../Common/img/imghydrogen/main/magnifier_icon.svg';
import magnifier_icon_white from '../../Common/img/imghydrogen/main/magnifier_icon_white.svg';
import sort_icon from '../../Common/img/imghydrogen/main/sort_Icon.svg';
import selectArrow_icon_blue from '../../Common/img/imghydrogen/main/selectArrow_icon_blue.svg';
import information_icon from '../../Common/img/imghydrogen/main/information_icon.svg';
import people_icon from '../../Common/img/imghydrogen/main/people_icon.svg';
import historySelect_icon from '../../History/image/historySelect_icon.svg';

import searchClose from '../../Common/img/imghydrogen/main/searchClose.svg';


export const _AccountPopup = {
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



/***************************************************************************************/
/***************************************************************************************/
/***************************************************************************************/
/***************************************************************************************/
/***************************************************************************************/
/***************************************************************************************/
/**********************************************************************/

export const AccountCommon = styled.div`
    user-select: none;

    & * {
        font-size: 14px;
    }
    
    .searchWrap{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-bottom: 8px;

        .searchWrapInput{
            width: 292px;
        }
    }

    .listWrap {
        height: 100%;

        .accountList {
            /* height: 446px; */

            .head > div, 
            .body > ul > li > div {

                &:nth-of-type(1) {
                    width: 5%;
                }

                &:nth-of-type(2) {
                    width: 19%;
                }
                
                &:nth-of-type(3) {
                    width: 19%;
                }
                
                &:nth-of-type(4) {
                    width: 19%;
                }
                
                &:nth-of-type(5) {
                    width: 19%;
                }
                
                &:nth-of-type(6) {
                    width: 19%;
                }
            }

            .head {
                background: #323234;
                display: flex;

                > div {

                    &:not(:last-child) {
                        border-right: 1px solid #1B212C;
                    }

                    height: 34px;
                    line-height: 34px;
                    text-align: center;
                    font-weight: 500;
                    color: #fff;

                    .sort {
                        height: 34px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 5px;

                        button {
                            width: 15px;
                            height: 10px;

                            &.az {
                                background: url(${sort_icon})no-repeat center center;
                            }

                            &.za {
                                transform: rotate(180deg);
                                background: url(${sort_icon})no-repeat center center;
                            }
                        }
                    }

                    &.required::after {
                        content: "*";
                        color: #FF3632;
                        margin-left: 4px;
                    }
                }
            }

            .body {
                background-color: #282829;
                height: 476px;
                overflow: hidden;

                ul {

                    li {
                        display: flex;
                        height: 34px;
                        border-bottom: 1px solid #1E1E1E;
                        color: #fff;
                        cursor: pointer;

                        &.selectUser {
                            background: #0085ff;
                        }

                        &:hover{
                            background: #0085ff;
                        }

                        div {
                            text-align: center;
                            height: 34px;
                            line-height: 32px;
                            padding: 0 5px;
                            ${(props) => props.theme.variables.overText()};

                            &:not(:last-child) {
                                border-right: 1px solid #1E1E1E;
                            }

                            .binIcon {
                                position: relative;
                                top: -2px;

                                &:hover > img {
                                    filter: invert(42%) sepia(82%) saturate(2612%) hue-rotate(184deg) brightness(100%) contrast(108%);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .pagenation {
        text-align: center;
        margin-top: 24px;

        button {
            width: 30px;
            height: 30px;
            color: #fff;
            font-size: 14px;
            font-weight: 600;
            margin: 0 2.5px;
            border-radius: 2px;
            border: 1px solid #29313E;

            &.first {
                background: url(${page_first_icon_active}) no-repeat center center;
            }

            &.prev {
                background: url(${page_prev_icon_active}) no-repeat center center;
            }

            &.next {
                background: url(${page_next_icon_active}) no-repeat center center;
            }

            &.last {
                background: url(${page_last_icon_active}) no-repeat center center;
            }

            &.firstDisable {
                background: url(${page_prev_icon}) no-repeat center center;
                cursor: default;
            }

            &.prevDisable {
                background: url(${page_first_icon}) no-repeat center center;
                cursor: default;
            }

            &.nextDisable {
                background: url(${page_next_icon}) no-repeat center center;
                cursor: default;
            }

            &.lastDisable {
                background: url(${page_last_icon}) no-repeat center center;
                cursor: default;
            }
        }

        > button {
            text-indent: -9999px;
        }

        ul {
            display: inline-block;
            vertical-align: middle;
        }

        ul li {
            display: inline-block;
            vertical-align: middle;
        }

        ul li.on button {
            color: #000;
            background-color: #0085ff;
        }
    }

    .btnWrap {
        position: absolute;
        bottom: 23px;
        left: 50%;
        transform: translate(-50%, -50%);

        button {
            height: 36px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 400;
            margin: 0 4px;
            padding: 6px 20px;
        }

        .cancle {
            border: 1px solid #888C94;
            color: #888C94;
        }

        .submit {
            background-color: #0085FF;
            color: #000000;
        }
    }
`;


// 계정 및 권한관리
export const AccountManagerComponent = styled.div`
    width: 1060px;
    height: 754px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #1E1E1E;
    overflow: hidden;
    padding: 40px;
    user-select: none;

    .closeBtn {
        position: absolute;
        top: 40px;
        right: 40px;
    }

    .menuWrap {

        h2 {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 10px;
            color: #B6C6D2;
        }

        ul {
            display: flex;
            align-items: flex-start;
            position: relative;

            &::before {
                content: '';
                width: 100%;
                height: 1px;
                background-color: #3C4143;
                position: absolute;
                top: 35px;
                right: 0;
            }

            li {
                color: #3C4143;
                font-size: 14px;
                font-weight: 500;
                /* width: 60px; */
                /* padding: 10px 0; */
                padding: 10px 24px;
                text-align: center;
                border-bottom: 3px solid #3C4143;
                cursor: pointer;

                &.on {
                    color: #0085ff;
                    border-bottom: 3px solid #0085ff;
                    z-index: 1;
                }
            }
        }
    }
`;


export const AccountListComponent = styled(AccountCommon)`
    margin-top: 10px;
`;


/**********************************************************************/
// 신규등록
export const AccountAddUserComponent = styled(AccountCommon)`
    margin-top: 20px;

    .head > div,
    .body > ul > li > div {
        width: 20% !important;
    }

    .body {
        /* height: auto !important; */
        height: 100% !important;

        ul > li {
            cursor: default !important;
        }

        > div {
            text-align: center;
            margin: 205px 0;

            button {
                font-size: 12px;
                background: #0085ff url(${ people_icon })no-repeat 8% 50%;
                padding: 6px 16px 6px 40px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
            }
        }
    }

    .body > ul > li > div {

        input{
            width: 178px;
            height: 28px;
            border: 1px solid #0095ff;
            color: #fff;
            border-radius: 0;
            text-align: center;
        }

        .authoritySelect{
            width: 178px;
            height: 28px;
            border: 1px solid #0095ff;
            color: #fff;
            border-radius: 0;
            background: #323335 url(${historySelect_icon}) no-repeat 98% 50%;
            text-align: left;
        }

        select {
            font-size: 14px !important;
            line-height: 17px;

            option {
                background-color: #1B212C;
                font-size: 14px !important;
            }
        }
    }

    .infoWrap {
        width: 100%;
        background: rgba(182, 198, 210, 0.07);
        color: #888C94;
        padding: 15px 12px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 10px;

        p {

            &:nth-child(1) {
                font-weight: 500;
            }

            &:not(:nth-child(1)) {
                font-size: 12px;

                &::before {
                    content: '';
                    display: inline-block;
                    margin: 0 7px 0 0;
                    width: 16px;
                    height: 16px;
                    border-radius: 3px;
                    background: url(${ information_icon })no-repeat center center;
                    position: relative;
                    top: 3px;
                }
            }
        }
    }

    .listWrapNewRegistration {
        height: 100%;

        & * {
            font-size: 12px;
        }

        .accountList {
            .head > div, 
            .body > ul > li > div {

                &:nth-of-type(1) {
                    width: 20%;
                }
                
                &:nth-of-type(2) {
                    width: 20%;
                }
                
                &:nth-of-type(3) {
                    width: 20%;
                }
                
                &:nth-of-type(4) {
                    width: 20%;
                }
                
                &:nth-of-type(5) {
                    width: 20%;
                }
            }

            .head {
                background: #323234;
                display: flex;
                font-weight: 500;

                &::after {
                    content: '';
                    width: 6px;
                    height: 34px;
                    position: absolute;
                    right: 40px;
                }

                > div{

                    &:not(:last-child) {
                        border-right: 1px solid #1B212C;
                    }

                    height: 34px;
                    line-height: 34px;
                    text-align: center;
                    font-weight: 500;
                    font-size: 14px;
                    color: #fff;
                }

                > div:nth-child(4){
                    &::after{
                        content: '*';
                        display: inline-block;
                        color: #FF3632;
                        padding-left: 4px;
                    }
                }

                > div:nth-child(5){
                    &::after{
                        content: '*';
                        display: inline-block;
                        color: #FF3632;
                        padding-left: 4px;
                    }
                }
            }

            .body {
                height: auto;
                background-color: #282829;
                overflow: hidden;

                ul {

                    li {
                        display: flex;
                        height: 40px;
                        line-height: 40px;
                        border-bottom: 1px solid #1E1E1E;
                        text-align: center;
                        color: #fff;
                        font-size: 14px;
                        font-weight: 400;
                        cursor: default;

                        > div{
                            text-align: center;
                            height: 40px;
                            line-height: 40px;
                            font-size: 14px;
                            font-weight: 400;
                        }

                        > div:nth-child(4){
                            padding: 4px 5px;

                            input{
                                display: block;
                                height: 34px;
                                background: none;
                                border: solid 1px #0085FF;
                                border-radius: 2px;
                                color: #fff;
                                font-size: 14px;
                            }
                        }

                        > div:nth-child(5){
                            padding: 4px 5px;

                            select {
                                display: block;
                                width: 100%;
                                height: 34px;
                                font-size: 14px !important;
                                border: 1px solid #0085FF;
                                border-radius: 2px;
                                padding-left: 8px;
                                background: url(${ selectArrow_icon_blue }) no-repeat 97% 50%;
                                color: #fff;
                            }
                            option {
                                background-color: #1B212C;
                                font-size: 14px !important;
                            }
                        }

                    }
                }
            }
        }
    }
`;


/**********************************************************************/
// 목록 - 사용자 선택 팝업

export const AccountUpdateUserComponent = styled.div`
    width: 450px;
    height: 680px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    border: 1px solid var(--grayscale-g-800313644, #313644);
    overflow: hidden;
    background: #1E1E1E;
    padding: 40px;
    user-select: none;
    z-index: 1;

    header {
        
        h2 {
            font-weight: 700;
            font-size: 16px;
            color: #B6C6D2;
        }
    }

    .closeBtn {
        position: absolute;
        top: 35px;
        right: 40px;
    }

    section {

        & * {
            font-size: 14px;
            flex: 1;
        }

        > div {
            margin: 20px 0;
            text-align: right;

            button {
                font-size: 12px;
                padding: 5px 10px;
                border-radius: 2px;
                background: #282828;
                margin-left: 6px;
                color: #fff;

                &:nth-child(1).on {
                    background-color: #0095ff;
                    color: #000000;
                }
            }

            .editModeBtn{
                &.on{
                    background: #0085ff;
                    color: #000000;
                }
            }

            .deleteBtn{
                &.on{
                    background: #0085ff;
                    color: #000000;
                }
            }
        }

        ul {

            li {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
                color: #fff;

                div {
                    font-size: 14px;
                    font-weight: 500;

                    &:nth-child(1) {

                        span {
                            color: #fff;
                            margin-left: 3px;
                        }
                    }

                    &:nth-child(2) {
                        width: 254px;
                        position: relative;

                        p, select {
                            width: 254px;
                            height: 30px;
                            /* border: 1px solid #384355; */
                            border-radius: 2px;
                            padding: 8px;
                            font-size: 14px;
                            font-weight: 400;
                        }

                        select {
                            display: block;
                            border: 1px solid #0085FF;
                            border-radius: 2px;
                            padding: 0 40px 0 8px;
                            background: url(${ selectArrow_icon_blue }) no-repeat 97% 50%;
                            color: #fff;
                        }
                        
                        option {
                            background-color: #1B212C;
                            font-size: 14px !important;
                        }

                        textarea {
                            border-radius: 2px;
                            border: 1px solid #1E1E1E;
                            width: 254px;
                            height: 120px;
                            padding: 10px 8px;
                            background-color: #1E1E1E !important;
                            color: #fff; 
                            user-select: none;
                            resize: none;
                        }

                        img {
                            position: absolute;
                            top: 7px;
                            right: 5px;
                            cursor: help;
                        }

                        .errorMsg{
                            height: 31px;
                            position: absolute;
                            top: 35px;

                            p {
                                font-size: 10px;
                                color: red;
                                border: 0;
                                padding: 0;
                            }
                        } 

                        .edit {
                            border: 1px solid #0085ff;
                        }
                    }
                }
            }
        }
    }

    .btnWrap {
        position: absolute;
        bottom: 23px;
        left: 50%;
        transform: translate(-50%, -50%);

        button {
            width: 74px;
            height: 36px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 400;
            margin: 0 4px;
            padding: 6px 16px;
        }

        .cancle {
            border: 1px solid #888C94;
            color: #888C94;
        }

        .submit {
            background-color: #0085FF;
            color: #000000;

            &.disabled {
                border: 1px solid #313644;
                color: #313644;
                background-color: transparent;
                cursor: default;
                user-select: none;
            }
        }
    }
`;


/**********************************************************************/
// 신규등록 - 조직정보 불러오기 팝업

export const AccountFindMemberComponent = styled(AccountCommon)`
    width: 980px;
    height: 450px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    background: #1E1E1E;
    border-radius: 8px;
    border: solid 1px #313644;
    padding: 40px;

    header {
        
        h2 {
            font-size: 16px;
            font-weight: 700;
        }
    }

    section {
        padding: 20px 0;

        .searchWrap {

            .searchWrapInput {
                width: 100%;
            }
        }

        .listWrap {
            height: auto;

            & * {
                font-size: 12px;
            }

            .accountList {
                .head > div, 
                .body > ul > li > div {

                    &:nth-of-type(1) {
                        width: 7%;
                    }
                    
                    &:nth-of-type(2) {
                        width: 16%;
                    }
                    
                    &:nth-of-type(3) {
                        width: 16%;
                    }
                    
                    &:nth-of-type(4) {
                        width: 12%;
                    }
                    
                    &:nth-of-type(5) {
                        width: 17%;
                    }
                    
                    &:nth-of-type(6) {
                        width: 17%;
                    }
                    
                    &:nth-of-type(7) {
                        width: 15%;
                    }
                }

                .head {
                    font-weight: 500;

                    &::after {
                        content: '';
                        width: 6px;
                        height: 34px;
                        position: absolute;
                        right: 40px;
                    }

                    > div{
                        font-size: 14px;
                        font-weight: 400;
                    }
                }

                .body {
                    height: 272px;
                    /* height: auto; */
                    overflow: auto;

                    ul {

                        li {
                            cursor: default;
                        }
                    }

                    > div {
                        text-align: center;

                        p {
                            color: #888C94;
                            font-size: 12px;
                            font-weight: 400;
                            padding: 112px 0;
                            ${props => props.theme.variables.flex('center', 'center')};
                            gap: 8px;
                            
                            &::before{
                                content: "";
                                display: inline-block;
                                width: 16px;
                                height: 16px;
                                background: url(${information_icon})no-repeat center center;
                            }
                        }
                    }
                }
            }
        }
    }
`;





















// 비밀번호 변경 팝업
export const _AccountChangePwdPopup = {
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
