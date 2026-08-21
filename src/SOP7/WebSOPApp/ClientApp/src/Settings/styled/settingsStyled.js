import styled from "styled-components";
import PR from "../../Root/resource/id";
import "../../Common/css/commonSB.scss";
import "../../Common/css/commonWonik.scss";

import dashboard_layer_close from '../../Common/img/sub/dashboard_layer_close.png';
import setting_upload from '../../Common/img/sub/setting_upload.png';
import settings from '../../Common/img/sub/settings.png';
import settings_wonik from '../../Common/img/sub/settings_wonik.png';
import settings_hydrogen from '../../Common/img/imghydrogen/H_settingBlueIcon2.png';
import settings_information_button from '../../Common/img/sub/settings_information_button.png';
import settings_checked_sb from '../../Common/img/sub/settings_checked_sb.png';
import settings_checked_wonik from '../../Common/img/sub/settings_checked_wonik.png';
import setting_user_add from '../../Common/img/sub/setting_user_add.png';
import setting_user_del from '../../Common/img/sub/setting_user_del.png';
import settings_bin from '../../Common/img/sub/settings_bin.png';
import settings_bin_hover_sb from '../../Common/img/sub/settings_bin_hover_sb.png';
import settings_bin_hover_wonik from '../../Common/img/sub/settings_bin_hover_wonik.png';

import select_arrow from '../../Common/img/common/select_arrow.png';

import treeArrow_icon from '../../Settings/image/treeArrow_icon.png';
import editAct_icon from '../../Settings/image/editAct_icon.png';
import sopLink_pen from '../../Settings/image/sopLink_pen.png';
import sopLink_pen_hover_sb from '../../Settings/image/sopLink_pen_hover_sb.png';
import sopLink_pen_hover_wonik from '../../Settings/image/sopLink_pen_hover_wonik.png';
import sopLink_pen_hydrogen from '../../Common/img/imghydrogen/H_settingPencil.png';

import H_inputChecked from '../../Common/img/imghydrogen/H_inputChecked.png';

//경기 CCTV 설정창 아이콘
import gg_titlebar_select_arrow from '../../Common/img/imgGyeonggi/gg_titlebar_select_arrow.svg';
import gg_titlebar_select_arrow_disabled from '../../Common/img/imgGyeonggi/gg_titlebar_select_arrow_disabled.svg';
import search_off from '../../Account/images/search_off.png';
import search_on from '../../Account/images/search_on.png';
import update_off from '../../Account/images/update_off.png';
import update_on from '../../Account/images/update_on.png';
import delete_off from '../../Account/images/delete_off.png';
import delete_on from '../../Account/images/delete_on.png';
import checkbox from "../../Common/img/common/checkbox.png";


export const _SettingsCommon = {
    soulbrain: {
        settingsMainColor : 'var(--settingsMainColor)',
        stgMenuLiAOnColor : 'var(--settingsColor)',
        stgTitleColor : 'var(--settingsTitleColor)',
        stgTitleBeforeContent : `url(${settings})`,
        stgTabLiAOnBackground : 'var(--settingsMainColor)',
        stgTabLiAOnBorderColor : 'var(--settingsMainColor)',
        inputCheckedIcon : `#0e162d url(${settings_checked_sb}) no-repeat center center`,
        inputRadioCheckedBackground : 'var(--settingsMainColor)',
        dspBtnLiLastChildABackground : 'var(--settingsMainColor)',
        stgmRhtH5Color : 'var(--settingsColor)',
        treeSelectBackground : 'var(--settingsMainColor)',
        appliBtn : 'var(--settingsMainColor)',
        editIcon: `url(${sopLink_pen}) no-repeat center center`,
        editIconHover: `url(${sopLink_pen_hover_sb}) no-repeat center
        center`,
        binIconHover : `url(${settings_bin_hover_sb}) no-repeat center center`,
        stgUserOptionOnBackground : 'var(--settingsMainColor)',
        stgmBtnHover: 'var(--settingsMainColor)',
        stgLftBackground: 'rgba(255, 255, 255, 0.1)',
        stgContBackground: 'var(--navy-color)',
        stgTitleHeight: '',
        stgLftPaddingTop: '20px',
        stgMenuLiBorderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        stgTabLeftBorderRadius: '5px 0px 0px 5px',
        stgTabRightBorderRadius: '0px 4px 4px 0px',
        stgTabLiABackColor: '#0e162d',
        stgTabLiAPadding: '0px 30px',
        stgTabLiAHeight: '28px',
        stgTabLiALineHeight: '28px',
        stgTabLiAFontSize: '16px',
        stgTabLiAColor: '#fff',
        stgTabLiAOnTextColor: '',
        sopDisableTextBackColor: '#0E162D',
        sopDisableTextHeight: '36px',
        sopDisableTextLiHeight: '36px',
        sopDisableTextColor: '#808080',
        sopActiveTextTextColor: '#FFFFFF',
        sopActiveTextFontsize: '16px',
        sopListFlexTextColor: '#FFF',
        sopLocationBoxBackColor: '#272E42',
        sopTypeBoxBackColor: '#272E42',
        sopListBoxBackColor: '#272E42',
        sopTableAreaBackColor: '#272E42',
        sopTableAreaTheadBackColor: '#0E162D',
        sopTableAreaTheadHeight: '36px',
        sopTableAreaTbodyTrHeight: '38px',
        sopTableAreaTheadTextColor: '#fff',
        sopTableAreaTheadTrBorderBottom: 'solid 1px #1A1F23',
        sopTableAreaTbodyTrBorderBottom: '1px solid #525868',
        sopScrollBorderColor: '5px solid rgba(39, 46, 66, 1)',
        sopScrollWidth: '14px',
        sopScrollBackColor: '#0E162D',
        sopScrollBorderLeft: '5px solid rgba(39, 46, 66, 1)',
        sopScrollBorderRight: '5px solid rgba(39, 46, 66, 1)',
        dataTooltipBackColor: '#00dd8b',
        dataTooltipTextColor: '#000',
        dataTooltipBorderTopColor: '5px solid #00DD8B',
        inputCheckBackColor: '#0e162d',
        inputCheckBorder: 'solid 2px #fff',
        inputCheckedIconBackSize: '10px auto !important',
        inputCheckWidth: '14px',
        inputCheckHeight: '14px',
        dslSelBackColor: `#272E42 url(${select_arrow}) no-repeat`,
        dslSelBorderRadius: '5px',
        dslSelBorder: '1px solid #ffffff1a',
        stgnRsetBackColor: '#232C42',
        stgnRsetBorder: 'solid 1px #474B69',
        dsrTxtBackground: '#182230',
        stgnRsetColor: '#FFF',
        dataTooltipFontFamily: '"dotum", sans-serif',
        dspBtnLiAWidth: '68px',
        dspBtnLiAHeight: '28px',
        dspBtnLiABackColor: '#0E162D',
        dspBtnLiALineHeight: '26px',
        stgContHeight: '575px',
        dspBtnPositionTop: '532px',
        stgScrollHeight: '450px',
        stgScrollPaddingTop: '20px',
        stgTitleFontSize: '18px',
        stgTitleLetterSpacing: '0.9px',
        sopTreeSpanDisplay: 'inline-flex',
        stgHalfHDivLastWidth: '45%',
    },
    Wonik: {
        settingsMainColor : 'var(--title-bar-text-blue-color)',
        stgMenuLiAOnColor : 'var(--settings-color)',
        stgTitleColor : 'var(--title-bar-text-blue-color)',
        stgTitleBeforeContent : `url(${settings_wonik})`,
        stgTabLiAOnBackground : 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;',
        inputCheckedIcon : `#0e162d url(${settings_checked_wonik}) no-repeat center center`,
        inputRadioCheckedBackground : 'var(--title-bar-text-blue-color)',
        dspBtnLiLastChildABackground : 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;',
        stgmRhtH5Color : 'var(--settings-color)',
        treeSelectBackground : 'var(--title-bar-text-blue-color)',
        appliBtn : 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box',
        editIcon: `url(${sopLink_pen}) no-repeat center center`,
        editIconHover: `url(${sopLink_pen_hover_wonik}) no-repeat center
        center`,
        binIconHover : `url(${settings_bin_hover_wonik}) no-repeat center center`,
        stgUserOptionOnBackground: 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box',
        stgLftBackground: 'rgba(255, 255, 255, 0.1)',
        stgContBackground: 'var(--navy-color)',
        stgTitleHeight: '',
        stgLftPaddingTop: '20px',
        stgMenuLiBorderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        stgTabLeftBorderRadius: '5px 0px 0px 5px',
        stgTabRightBorderRadius: '0px 4px 4px 0px',
        stgTabLiABackColor: '#0e162d',
        stgTabLiAPadding: '0px 30px',
        stgTabLiAHeight: '28px',
        stgTabLiALineHeight: '28px',
        stgTabLiAFontSize: '16px',
        stgTabLiAColor: '#fff',
        stgTabLiAOnTextColor: '',
        sopDisableTextBackColor: '#0E162D',
        sopDisableTextHeight: '36px',
        sopDisableTextLiHeight: '36px',
        sopDisableTextColor: '#808080',
        sopActiveTextTextColor: '#ffffff',
        sopActiveTextFontsize: '16px',
        sopListFlexTextColor: '#FFF',
        sopLocationBoxBackColor: '#272E42',
        sopTypeBoxBackColor: '#272E42',
        sopListBoxBackColor: '#272E42',
        sopTableAreaBackColor: '#272E42',
        sopTableAreaTheadBackColor: '#0E162D',
        sopTableAreaTheadHeight: '36px',
        sopTableAreaTbodyTrHeight: '38px',
        sopTableAreaTheadTextColor: '#fff',
        sopTableAreaTheadTrBorderBottom: 'solid 1px #1A1F23',
        sopTableAreaTbodyTrBorderBottom: '1px solid #525868',
        sopScrollBorderColor: '5px solid rgba(39, 46, 66, 1)',
        sopScrollWidth: '14px',
        sopScrollBackColor: '#0E162D',
        sopScrollBorderLeft: '5px solid rgba(39, 46, 66, 1)',
        sopScrollBorderRight: '5px solid rgba(39, 46, 66, 1)',
        dataTooltipBackColor: '#00dd8b',
        dataTooltipTextColor: '#000',
        dataTooltipBorderTopColor: '5px solid #00DD8B',
        inputCheckBackColor: '#0e162d',
        inputCheckBorder: 'solid 2px #fff',
        inputCheckedIconBackSize: '10px auto !important',
        inputCheckWidth: '14px',
        inputCheckHeight: '14px',
        dslSelBackColor: `#272E42 url(${select_arrow}) no-repeat`,
        dslSelBorderRadius: '5px',
        dslSelBorder: '1px solid #ffffff1a',
        stgnRsetBackColor: '#232C42',
        stgnRsetBorder: 'solid 1px #474B69',
        dsrTxtBackground: '#182230',
        stgnRsetColor: '#FFF',
        dataTooltipFontFamily: '"dotum", sans-serif',
        dspBtnLiAWidth: '68px',
        dspBtnLiAHeight: '28px',
        dspBtnLiABackColor: '#0E162D',
        dspBtnLiALineHeight: '26px',
        stgContHeight: '575px',
        dspBtnPositionTop: '532px',
        stgScrollHeight: '450px',
        stgScrollPaddingTop: '20px',
        stgTitleFontSize: '18px',
        stgTitleLetterSpacing: '0.9px',
        sopTreeSpanDisplay: 'inline-flex',
        stgHalfHDivLastWidth: '45%',
    },
    Hydrogen: {
        /* settingsMainColor: 'var(--title-bar-text-blue-color)', */
        stgMenuLiAOnColor: 'var(--settings-color)',
        /* stgTitleColor: 'var(--title-bar-text-blue-color)', */
        stgTitleColor: '#00AFFF',
        stgTitleBeforeContent: `url(${settings_hydrogen})`,
        /* stgTabLiAOnBackground: 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;', */
        stgTabLiAOnBackground: '#00AFFF',
        inputCheckedIcon: `url(${H_inputChecked}) no-repeat center center`,
        inputRadioCheckedBackground: 'var(--title-bar-text-blue-color)',
        dspBtnLiLastChildABackground: 'transparent linear-gradient(180deg, #00AFFF 0%, #0080FF 100%) 0% 0% no-repeat padding-box;',
        stgmRhtH5Color: 'var(--settings-color)',
        treeSelectBackground: 'var(--title-bar-text-blue-color)',
        appliBtn: 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box',
        editIcon: `url(${sopLink_pen_hydrogen}) no-repeat center center`,
        editIconHover: `url(${sopLink_pen_hover_wonik}) no-repeat center center`,
        binIconHover: `url(${settings_bin_hover_wonik}) no-repeat center center`,
        stgUserOptionOnBackground: 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box',
        stgContBackground: '#0E212A',
        stgMenuLiBackColor: '#0E212A',
        stgTitleBackColor: '#282E32',
        stgTitleRightRadius: '20px',
        stgTitleHeight: '74px',
        stgTitleLiHeight: '74px',
        stgLftPaddingTop: '',
        stgMenuLiBorderBottom: '',
        stgTabLeftBorderRadius: '13px 0px 0px 13px',
        stgTabRightBorderRadius: '0px 13px 13px 0px',
        stgTabLiABackColor: '#2B383E',
        stgTabLiAPadding: '0px 45px',
        stgTabLiAHeight: '25px',
        stgTabLiALineHeight: '25px',
        stgTabLiAFontSize: '14px',
        stgTabLiAColor: '#A5A5A5',
        stgTabLiAOnTextColor: '#343434',
        sopDisableTextBackColor: '#00AFFF',
        sopDisableTextHeight: '24px',
        sopDisableTextLiHeight: '24px',
        sopDisableTextColor: '#1A1F23',
        sopActiveTextTextColor: '#1A1F23',
        sopActiveTextFontsize: '14px',
        sopListFlexTextColor: '#1A1F23',
        sopLocationBoxBackColor: '#273840',
        sopTypeBoxBackColor: '#273840',
        sopListBoxBackColor: '#273840',
        sopTableAreaBackColor: '#273840',
        sopTableAreaTheadBackColor: '#273840',
        sopTableAreaTheadHeight: '24px',
        sopTableAreaTbodyTrHeight: '35.15px',
        sopTableAreaTheadTextColor: '#00AFFF',
        sopTableAreaTheadTrBorderBottom: 'solid 1px #1A1F23',
        sopTableAreaTbodyTrBorderBottom: '1px dashed #525868',
        sopTableAreaTheadThBorderRight: 'none',
        sopScrollBorderColor: '',
        sopScrollWidth: '',
        sopScrollBackColor: '',
        sopScrollBorderLeft: '5px solid rgba(0, 175, 255, 1)',
        sopScrollBorderRight: '5px solid rgba(0, 175, 255, 1)',
        dataTooltipBackColor: '#00AFFF',
        dataTooltipTextColor: '#FFF',
        dataTooltipBorderTopColor: '5px solid #00AFFF',
        inputCheckBackColor: '#FFF',
        inputCheckBorder: 'none',
        inputCheckedIconBackSize: '12px auto !important',
        inputCheckWidth: '12px',
        inputCheckHeight: '12px',
        dslSelBackColor: `#273840 url(${select_arrow}) no-repeat 90% 50%`,
        dslSelBorderRadius: '3px',
        dslSelBorder: 'none',
        stgnRsetBackColor: '#273840',
        stgnRsetBorder: 'solid 1px #00AFFF',
        dsrTxtBackground: '#273840',
        stgnRsetColor: '#19afff',
        stgTimeDtFontSize: '14px',
        dataTooltipFontFamily: 'pretendard',
        dspBtnLiAWidth: '83px',
        dspBtnLiAHeight: '35px',
        dspBtnLiABackColor: '#2B383E',
        dspBtnLiALineHeight: '32px',
        stgContHeight: '650px',
        dspBtnPositionTop: '586px',
        stgScrollHeight: 'auto',
        sopTreeAreaPaddingTop: '20px',
        stgScrollPaddingTop: '40px',
        stgTitleFontSize: '18px',
        stgTitleLetterSpacing: '0px',
        stgTimeLiFontSize: '14px',
        stgHalfHDivLastWidth: '50%',
    },
    Gyeonggi: {
        settingsMainColor : 'var(--title-bar-text-blue-color)',
        stgMenuLiAOnColor : 'var(--settings-color)',
        stgTitleColor : 'var(--title-bar-text-blue-color)',
        stgTitleBeforeContent : `url(${settings_wonik})`,
        stgTabLiAOnBackground : 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;',
        inputCheckedIcon : `#0e162d url(${settings_checked_wonik}) no-repeat center center`,
        inputRadioCheckedBackground : 'var(--title-bar-text-blue-color)',
        dspBtnLiLastChildABackground : 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;',
        stgmRhtH5Color : 'var(--settings-color)',
        treeSelectBackground : 'var(--title-bar-text-blue-color)',
        appliBtn : 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box',
        editIcon: `url(${sopLink_pen}) no-repeat center center`,
        editIconHover: `url(${sopLink_pen_hover_wonik}) no-repeat center
        center`,
        binIconHover : `url(${settings_bin_hover_wonik}) no-repeat center center`,
        stgUserOptionOnBackground: 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box',
        stgLftBackground: 'rgba(255, 255, 255, 0.1)',
        stgContBackground: 'var(--navy-color)',
        stgTitleHeight: '',
        stgLftPaddingTop: '20px',
        stgMenuLiBorderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        stgTabLeftBorderRadius: '5px 0px 0px 5px',
        stgTabRightBorderRadius: '0px 4px 4px 0px',
        stgTabLiABackColor: '#0e162d',
        stgTabLiAPadding: '0px 30px',
        stgTabLiAHeight: '28px',
        stgTabLiALineHeight: '28px',
        stgTabLiAFontSize: '16px',
        stgTabLiAColor: '#fff',
        stgTabLiAOnTextColor: '',
        sopDisableTextBackColor: '#0E162D',
        sopDisableTextHeight: '36px',
        sopDisableTextLiHeight: '36px',
        sopDisableTextColor: '#808080',
        sopActiveTextTextColor: '#ffffff',
        sopActiveTextFontsize: '16px',
        sopListFlexTextColor: '#FFF',
        sopLocationBoxBackColor: '#272E42',
        sopTypeBoxBackColor: '#272E42',
        sopListBoxBackColor: '#272E42',
        sopTableAreaBackColor: '#272E42',
        sopTableAreaTheadBackColor: '#0E162D',
        sopTableAreaTheadHeight: '36px',
        sopTableAreaTbodyTrHeight: '38px',
        sopTableAreaTheadTextColor: '#fff',
        sopTableAreaTheadTrBorderBottom: 'solid 1px #1A1F23',
        sopTableAreaTbodyTrBorderBottom: '1px solid #525868',
        sopScrollBorderColor: '5px solid rgba(39, 46, 66, 1)',
        sopScrollWidth: '14px',
        sopScrollBackColor: '#0E162D',
        sopScrollBorderLeft: '5px solid rgba(39, 46, 66, 1)',
        sopScrollBorderRight: '5px solid rgba(39, 46, 66, 1)',
        dataTooltipBackColor: '#00dd8b',
        dataTooltipTextColor: '#000',
        dataTooltipBorderTopColor: '5px solid #00DD8B',
        inputCheckBackColor: '#0e162d',
        inputCheckBorder: 'solid 2px #fff',
        inputCheckedIconBackSize: '10px auto !important',
        inputCheckWidth: '14px',
        inputCheckHeight: '14px',
        dslSelBackColor: `#272E42 url(${select_arrow}) no-repeat`,
        dslSelBorderRadius: '5px',
        dslSelBorder: '1px solid #ffffff1a',
        stgnRsetBackColor: '#232C42',
        stgnRsetBorder: 'solid 1px #474B69',
        dsrTxtBackground: '#182230',
        stgnRsetColor: '#FFF',
        dataTooltipFontFamily: '"dotum", sans-serif',
        dspBtnLiAWidth: '68px',
        dspBtnLiAHeight: '28px',
        dspBtnLiABackColor: '#0E162D',
        dspBtnLiALineHeight: '26px',
        stgContHeight: '575px',
        dspBtnPositionTop: '532px',
        stgScrollHeight: '450px',
        stgScrollPaddingTop: '20px',
        stgTitleFontSize: '18px',
        stgTitleLetterSpacing: '0.9px',
        sopTreeSpanDisplay: 'inline-flex',
        stgHalfHDivLastWidth: '45%',
    }
}


/**********************************************************************/
// Settings 공통 CSS

export const SettingsCommon = styled.div`
    a {
        cursor: pointer;
    }

    .mt0 {
        margin-top: 0px !important;
    }
    .mt5 {
        margin-top: 5px !important;
    }
    .mt10 {
        margin-top: 10px !important;
    }
    .mt15 {
        margin-top: 15px !important;
    }
    .mt20 {
        margin-top: 20px !important;
    }
    .mt25 {
        margin-top: 25px !important;
    }
    .mt30 {
        margin-top: 30px !important;
    }
    .mt40 {
        margin-top: 40px !important;
    }
    .mt50 {
        margin-top: 50px !important;
    }
    .mt60 {
        margin-top: 60px !important;
    }
    .mb60 {
        margin-bottom: 60px !important;
    }
    .mb0 {
        margin-bottom: 0px !important;
    }
    .mb5 {
        margin-bottom: 5px !important;
    }
    .mb10 {
        margin-bottom: 10px !important;
    }
    .mb20 {
        margin-bottom: 20px !important;
    }
    .mb30 {
        margin-bottom: 30px !important;
    }
    .mr10 {
        margin-right: 10px !important;
    }
    .mr20 {
        margin-right: 20px !important;
    }
    .ml5 {
        margin-left: 5px !important;
    }
    .pt0 {
        padding-top: 0 !important;
    }
    .pb0 {
        padding-bottom: 0 !important;
    }
    .pl0 {
        padding-left: 0 !important;
    }
    .tal {
        text-align: left !important;
    }
    .tar {
        text-align: right !important;
    }
    .tac {
        text-align: center !important;
    }

    .h28 {
        height: 28px !important;
    }

    .white {
        color: #fff;
    }

    .pointCursor {
        cursor: pointer;
    }

    [data-tooltip] {
        position: relative;
        z-index: 2;
    }

    [data-tooltip]:before,
    [data-tooltip]:after {
        /* visibility: hidden; */
        visibility: visible;
        -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
        filter: progid: DXImageTransform.Microsoft.Alpha(Opacity=0);
        opacity: 0;
        pointer-events: none;
    }

    [data-tooltip]:before {
        position: absolute;
        bottom: 150%;
        left: 50%;
        margin-bottom: 5px;
        transform: translate(-10%, 0);
        padding: 4px 10px;
        white-space: nowrap;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        background-color: ${_SettingsCommon[PR.styleMode].dataTooltipBackColor};
        color: ${_SettingsCommon[PR.styleMode].dataTooltipTextColor};
        font-family: ${_SettingsCommon[PR.styleMode].dataTooltipFontFamily};
        font-size: 11px;
        content: attr(data-tooltip);
        text-align: center;
        line-height: 1.2;
    }

    [data-tooltip]:after {
        position: absolute;
        bottom: 150%;
        left: 50%;
        margin-left: -5px;
        width: 0;
        border-top: ${_SettingsCommon[PR.styleMode].dataTooltipBorderTopColor};
        border-right: 5px solid transparent;
        border-left: 5px solid transparent;
        content: " ";
        font-size: 0;
        line-height: 0;
    }
    
    [data-tooltip]:hover:before,
    [data-tooltip]:hover:after {
        visibility: visible;
        -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
        filter: progid: DXImageTransform.Microsoft.Alpha(Opacity=100);
        opacity: 1;
    }

    .hidden {
        display: none;
    }

    input[type="checkbox"] {
        display: inline-block;
        vertical-align: middle;
        width: ${_SettingsCommon[PR.styleMode].inputCheckWidth};
        height: ${_SettingsCommon[PR.styleMode].inputCheckHeight};
        background: ${_SettingsCommon[PR.styleMode].inputCheckBackColor};
        border: ${_SettingsCommon[PR.styleMode].inputCheckBorder};
        cursor: pointer;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        position: relative;
        border-radius: 2px;
        -moz-border-radius: 2px;
        -webkit-border-radius: 2px;
    }

    input[type="checkbox"]:checked {
        background: ${_SettingsCommon[PR.styleMode].inputCheckedIcon};
        background-size: ${_SettingsCommon[PR.styleMode].inputCheckedIconBackSize};
    } 

    input[type="checkbox"] + label {
        display: inline;
        vertical-align: middle;
        margin-left: 7px;
        font-weight: 500;
        cursor: pointer;
        color: #fff;
        font-size: 12px;
    }

    /* 환경설정 스크롤바 */

    .stgScroll {
        overflow-x: hidden;
        overflow-y: scroll;
        display: inline-block;
        width: 675px;
        /* height: 450px; */
        height: ${_SettingsCommon[PR.styleMode].stgScrollHeight}; 
        padding-right: 15px;
        padding-top: 20px;
        /* padding-top: ${_SettingsCommon[PR.styleMode].stgScrollPaddingTop}; */  
    }

    .stgScroll {
        overflow-y: auto;
    }

    .stgScroll::-webkit-scrollbar {
        width: 4px;
        background: none;
    }

    .stgScroll::-webkit-scrollbar-thumb {
        background: rgba(82, 88, 104, 1);
        opacity: 1;
    }

    .stgScroll::-webkit-scrollbar-track {
        background: none;
    }

    .stgTab {
        /* margin-bottom: 30px; */
    }

    .stgTab:after {
        content: "";
        display: table;
        clear: both;
    }

    .stgTab li {
        float: left;
    }

    .stgTab li a {
        display: block;
        height: ${_SettingsCommon[PR.styleMode].stgTabLiAHeight};
        line-height: ${_SettingsCommon[PR.styleMode].stgTabLiALineHeight};
        padding: ${_SettingsCommon[PR.styleMode].stgTabLiAPadding};
        font-size: ${_SettingsCommon[PR.styleMode].stgTabLiAFontSize};
        border: 1px solid #ffffff1a;
        border-right: none;
        color: ${_SettingsCommon[PR.styleMode].stgTabLiAColor};
        background: ${_SettingsCommon[PR.styleMode].stgTabLiABackColor};
        cursor: pointer;
        max-width: 220px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .stgTab li:first-child a {
        border-radius: ${_SettingsCommon[PR.styleMode].stgTabLeftBorderRadius};
        cursor: pointer;
    }

    .stgTab li:last-child a {
        border-radius: ${_SettingsCommon[PR.styleMode].stgTabRightBorderRadius};
        border-right: solid 1px #3b3f5c;
        cursor: pointer;
    }

    .stgTab.single li a {
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    .stgTab li a.on {
        background: ${_SettingsCommon[PR.styleMode].stgTabLiAOnBackground};
        border-color: ${_SettingsCommon[PR.styleMode].stgTabLiAOnBorderColor};
        color: ${_SettingsCommon[PR.styleMode].stgTabLiAOnTextColor};
    }

    .stgName li input[type="checkbox"] {
        cursor: pointer;
    }

    .stgName {
        border-bottom: solid 1px rgba(255, 255, 255, 0.1);
        padding-bottom: 14px;
        margin-bottom: 14px;
    }

    .stgName.bdNon {
        border-bottom: none;
    }

    .stgName:after {
        content: "";
        display: table;
        clear: both;
    }

    .stgName h5 {
        display: inline-block;
        line-height: 32px;
        vertical-align: middle;
        color: #fff;
        font-size: 16px;
        font-weight: 400;
    }

    .stgName select {
        display: inline-block;
        width: 100px;
        border-color: #474b69;
        cursor: pointer;
    }

    .stgList .stgName:last-child {
        margin-bottom: 0;
    }

    .stgList .white {
        font-size: 16px;
        vertical-align: middle;
    }

    #tooltip-area { position: absolute; z-index: 9999; }
    .stgTltp {
        display: inline-block;
        vertical-align: middle;
        width: 12px;
        height: 12px;
        text-align: center;
        line-height: 14px;
        color: #fff;
        font-size: 10px;
        margin-left: 5px;
        margin-right: 10px;
        border: solid 1px #ddd;
        cursor: help;
        position: relative;
        background: url(${settings_information_button}) no-repeat center center;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
    }
    .stgTltpConts{
        visibility: visible;
        line-height: 26px;
        padding: 0px 20px;
        color: #000000;
        background: #00dd8b;
        font-size: 10px;
        text-align: center;
        border-radius: 3px;
        position: absolute;
        top: 30px;
        left: 20px;
        z-index: 1;  

    }
    .stgnRset {
        display: inline-block;
        vertical-align: middle;
        height: 30px;
        line-height: 28px;
        background: ${_SettingsCommon[PR.styleMode].stgnRsetBackColor};
        border: ${_SettingsCommon[PR.styleMode].stgnRsetBorder};
        color: ${_SettingsCommon[PR.styleMode].stgnRsetColor};
        padding: 0 12px;
        margin-right: 5px;
        font-size: 13px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        cursor: pointer;
    }

    .stgnRset:hover {
        background: ${_SettingsCommon[PR.styleMode].settingsMainColor};
        border-color: ${_SettingsCommon[PR.styleMode].settingsMainColor};
    }

    /* .stgnRset.upload:before {
            content: "";
            display: inline-block;
            width: 13px;
            height: 13px;
            vertical-align: middle;
            margin-right: 5px;
            background: url(${setting_upload}) no-repeat center center;
        } */

    .dslSel {
        display: block;
        width: 100%;
        border: ${_SettingsCommon[PR.styleMode].dslSelBorder};
        height: 28px;
        padding-left: 10px;
        padding-right: 30px;
        color: #fff;
        font-size: 14px;
        font-weight: 300;
        /* background: #272e42 url(${select_arrow}) no-repeat; */
        background: ${_SettingsCommon[PR.styleMode].dslSelBackColor};
        background-position: right 10px center;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        cursor: pointer;
        border-radius: ${_SettingsCommon[PR.styleMode].dslSelBorderRadius};
        cursor: pointer;
    }

    .dslSel.sm {
        padding-left: 5px;
        height: 28px;
        font-size: 14px;
        padding-right: 20px;
        background-size: 7px auto;
        background-position: right 5px center;
    }

    .stgmTo {
        position: relative;
        padding-left: 45px;

        &:nth-child(2) {
            margin-top: 10px;
        }
    }

    .stgmTo span {
        display: block;
        color: #fff;
        height: 28px;
        line-height: 28px;
        position: absolute;
        left: 0;
        top: 0;
        font-size: 14px;
    }

    .stgmTo p {
        display: block;
        width: 100%;
        height: 28px;
        line-height: 26px;
        padding: 0 10px;
        font-family: "dotum", sans-serif;
        font-size: 12px;
        background: #0e162d;
        border: 1px solid #ffffff1a;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        color: #fff;
    }

    input[type="text"].dsrTxt {
        display: block;
        width: 100%;
        border: solid 1px #232c3c;
        height: 32px;
        padding-left: 10px;
        padding-right: 10px;
        color: #fff;
        font-size: 13px;
        font-weight: 300;
        background: ${_SettingsCommon[PR.styleMode].dsrTxtBackground};
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
    }

    input[type="text"].dsrTxt.sm {
        width: 40px;
        font-family: "dotum", sans-serif;
        font-size: 11px;
        height: 28px;
        padding-left: 5px;
        padding-right: 5px;
        text-align: center;
    }

    .clickable {
        cursor: pointer;
    }
`;


/**********************************************************************/
// 타이틀바 > 환경설정

export const LayoutSettingComponent = styled(SettingsCommon)`
    position: fixed;
    z-index: 999;
    background: rgba(0, 0, 0, 0.7);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    & > div {
        display: table;
        width: 100%;
        height: 100%;
    }

    & > div > div {
        display: table-cell;
        width: 100%;
        vertical-align: middle;
    }

    .stgCont {
        margin: 0 auto;
        background: ${_SettingsCommon[PR.styleMode].stgContBackground};
        width: 865px;
        /* height: 575px; */
        height: ${_SettingsCommon[PR.styleMode].stgContHeight};
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 4px;
        border: 1px solid #FFFFFF1A;
        border-radius: 5px;
    }

    .stgCont:after {
        content: "";
        display: table;
        clear: both;
    }

    .stgLft {
        float: left;
        width: 160px;
        height: 100%;
        border-radius: 4px 0 0 4px;
        /* padding-top: 20px; */
        background: ${_SettingsCommon[PR.styleMode].stgLftBackground};
        padding-top: ${_SettingsCommon[PR.styleMode].stgLftPaddingTop};
    }

    .stgTitle {
        /* font-size: 18px; */
        font-size: ${_SettingsCommon[PR.styleMode].stgTitleFontSize};
        padding: 0 0 20px 19px;
        color: ${_SettingsCommon[PR.styleMode].stgTitleColor};
        /* letter-spacing: 0.9px; */
        letter-spacing: ${_SettingsCommon[PR.styleMode].stgTitleLetterSpacing};
        background: ${_SettingsCommon[PR.styleMode].stgTitleBackColor};
        border-bottom-right-radius: ${_SettingsCommon[PR.styleMode].stgTitleRightRadius};
        height: ${_SettingsCommon[PR.styleMode].stgTitleHeight};
        line-height: ${_SettingsCommon[PR.styleMode].stgTitleLiHeight};

        &::before {
            content: ${_SettingsCommon[PR.styleMode].stgTitleBeforeContent};
            margin-right: 8.38px;
            position: relative;
            top: 4px;
        }
    }

    .stgMenu {
    }

    .stgMenu li {
        width: 100%;
        padding: 12px 0 12px 30px;
        border-bottom: ${_SettingsCommon[PR.styleMode].stgMenuLiBorderBottom};
        background: ${_SettingsCommon[PR.styleMode].stgMenuLiBackColor};
    }

    .stgMenu li:last-child {
        margin-bottom: 0;
        border-bottom: none;
    }

    .stgMenu li a {
        display: block;
        font-size: 16px;
        color: #fff;
        position: relative;
        cursor: pointer;
        font-weight: 400;
    }

    .stgMenu li a.on {
        color: ${_SettingsCommon[PR.styleMode].stgMenuLiAOnColor};
        font-weight: 500;
        font-size: 16px;
        cursor: pointer;
    }

    .blankSquare{
        display: block;
        background: #282E32;
        height: 535px;
        border-top-right-radius: 20px;
     }

    .stgUserOption {
        margin-top: 40px;
        background: #525868;
        color: #FFFFFF;
        padding: 12px 0 12px 19px !important;

        &.on {
            background: ${_SettingsCommon[PR.styleMode].stgUserOptionOnBackground};
        }

        a {
            font-size: 18px !important;
        }

        a.on {
            color: white !important;
        }


    }

    .stgRht {
        float: left;
        width: 701px;
        height: 100%;
        padding: 20px;
        position: relative;
    }

    .stgClose {
        display: block;
        width: 30px;
        height: 30px;
        position: absolute;
        right: 20px;
        top: 20px;
        text-indent: -9999px;
        background: url(${dashboard_layer_close}) no-repeat center
        center;
    }

    .dspBtn {
        text-align: center;
        position: absolute;
        left: 270px;
        /* top: 532px; */
        top: ${_SettingsCommon[PR.styleMode].dspBtnPositionTop};
    } 
    .dspBtn li {
        display: inline-block;
        margin: 0 5px;
    }

    .dspBtn li a {
        display: block;
        width: ${_SettingsCommon[PR.styleMode].dspBtnLiAWidth};
        height: ${_SettingsCommon[PR.styleMode].dspBtnLiAHeight};
        line-height: ${_SettingsCommon[PR.styleMode].dspBtnLiALineHeight};
        font-size: 14px;
        background: ${_SettingsCommon[PR.styleMode].dspBtnLiABackColor};
        border: 1px solid #FFFFFF1A;
        color: #fff;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        cursor: pointer;
    }

    .dspBtn li:last-child a {
        background: ${_SettingsCommon[PR.styleMode].dspBtnLiLastChildABackground};
        border-color: ${_SettingsCommon[PR.styleMode].dspBtnLiLastChildABackground};
        cursor: pointer;
    }

    .dspBtnNew {
        padding-top: 20px;
        text-align: right;
    }

    .dspBtnNew li {
        display: inline-block;
        text-align: center;

        &:nth-child(1) {
            margin: 0 10px;
        }
    }

    .dspBtnNew li a {
        display: block;
        width: 68px;
        height: 28px;
        line-height: 26px;
        font-size: 14px;
        background: #222a43;
        border: 1px solid #FFFFFF1A;
        color: #fff;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        cursor: pointer;
    }

    .dspBtnNew li:first-child a {
        background: ${_SettingsCommon[PR.styleMode].dspBtnLiLastChildABackground};
        border-color: ${_SettingsCommon[PR.styleMode].dspBtnLiLastChildABackground};
        cursor: pointer;
    }
`;


/**********************************************************************/
// 3D 관제 시스템

export const Monitoring3DComponent = styled(SettingsCommon)`
    .stgnKey {
        margin: 0 -10px;
    }

    .stgnKey:after {
        content: "";
        display: table;
        clear: both;
    }

    .stgnKey li {
        float: left;
        width: 33.3333%;
        padding: 5px 10px;
    }

    .stgnKey li dl {
    }

    .stgnKey li dl dt {
        display: inline-block;
        vertical-align: middle;
        color: #fff;
        width: 50%;
        font-size: 14px;
        font-weight: 500;
    }

    .stgnKey li dl dd {
        display: inline-block;
        vertical-align: middle;
        width: 50%;
    }

    .stgnKey li dl dd span {
        color: #fff;
        vertical-align: middle;
        margin-right: 5px;
        font-size: 14px;
    }

    .stgnKey li dl dd input[type="text"] {
        display: inline-block;
        vertical-align: middle;
        width: 34px;
        height: 28px;
        text-align: center;
        font-size: 12px;
        background: #232c42;
        border: solid 1px #474b69;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        color: #fff;
    }

    .stgmTab {
    }

    .stgmTab:after {
        content: "";
        display: table;
        clear: both;
    }

    .stgmTab li {
        float: left;
        width: 50%;
    }

    .stgmTab li a {
        display: block;
        height: 38px;
        line-height: 36px;
        text-align: center;
        cursor: pointer;
        font-size: 16px;
        border-bottom: solid 1px #232c3c;
        color: #fff;
        background: #0E162D;
        cursor: pointer;
    }

    .stgmTab li:last-child a {
        border-left: solid 1px #232c3c;
        cursor: pointer;
    }

    .stgmTab li a.on {
        background: none;
        border-bottom-color: transparent;
        color: #fff;
        cursor: pointer;
    }

    .stgmWrap {
        border-bottom: solid 1px rgba(255, 255, 255, 0.1);
        padding: 6px 0 20px 0;
    }

    .stgmWrap:after {
        content: "";
        display: table;
        clear: both;
    }

    .stgmLft {
        float: left;
        width: 25%;
    }

    .stgmLft li {
        margin-bottom: 10px;
    }

    .stgmLft li:last-child {
        margin-bottom: 0;
    }

    .stgmLft li a {
        display: block;
        height: 28px;
        line-height: 26px;
        background: #272E42;
        border: 1px solid #FFFFFF1A;
        color: #fff;
        font-size: 14px;
        padding: 0 10px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 5px;
        cursor: pointer;
    }

    .stgmLft li a:hover {
        background: ${_SettingsCommon[PR.styleMode].treeSelectBackground};
        border-color: ${_SettingsCommon[PR.styleMode].treeSelectBackground};
    }

    .stgmCen {
        float: left;
        width: 50%;
        padding: 0 10px;
    }

    .stgmCont {
        background: #272E42;
        border: 1px solid #FFFFFF1A;
        overflow: hidden;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
    }

    .stgmDtl {
        padding: 10px;
        font-size: 12px;
        display: none;
    }

    .stgmTxt {
        display: block;
        width: 100%;
        resize: none;
        border: 1px solid #FFFFFF1A;
        height: 154px;
        padding: 5px !important;
        font-family: "dotum", sans-serif;
        font-size: 12px;
        background: #0E162D;
        color: #fff;
        font-size: 13px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        cursor: pointer;
        border-radius: 5px;
        -moz-border-radius: 5px;
        -webkit-border-radius: 5px;
    }

    .stgmTxt textarea {
        padding: 0;
        background: none;
    }

    .stgmTxt .scroll-bar {
        background: rgba(255, 255, 255, 0.5) !important;
    }

    .stgmRht {
        float: left;
        width: 25%;
        min-height: 158px;
        background: #272E42;
        border: 1px solid #FFFFFF1A;
        padding: 10px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
    }

    .stgmRht h5 {
        font-size: 16px;
        letter-spacing: 0.8px;
        color: ${_SettingsCommon[PR.styleMode].stgmRhtH5Color};
    }

    .stgmRht ul {
        padding-left: 15px;
        margin-top: 10px;
    }

    .stgmRht ul li {
        list-style: decimal;
        color: #fff;
        font-size: 14px;
        letter-spacing: 0.7px;
        line-height: 16px;
        margin-bottom: 5px;
    }

    .stgmRht ul li:last-child {
        margin-bottom: 0;
    }

    .stgmRht ul li span {
        font-size: 13px;
    }

    .stgmBtn {
        float: left;
        width: 100%;
        margin-top: 20px;
        text-align: right;
    }

    .stgmBtn li {
        display: inline-block;
        margin-right: 10px;
    }

    .stgmBtn li:last-child {
        margin-right: 0;
        cursor: pointer;
    }

    .stgmBtn li a {
        display: block;
        color: #fff;
        font-size: 14px;
        height: 28px;
        line-height: 26px;
        border: solid 1px #535775;
        padding: 0 15px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        cursor: pointer;
    }

    .stgmBtn li a:hover {
        background: ${_SettingsCommon[PR.styleMode].stgmBtnHover};
        border-color: ${_SettingsCommon[PR.styleMode].stgmBtnHover};
    }

    .stgAlt {
        font-size: 16px;
    }

    .stgAlt:after {
        content: "";
        display: table;
        clear: both;
    }

    .stgAlt li {
        float: left;
        margin-right: 15px;
        padding-right: 15px;
        position: relative;
    }

    .stgAlt li:last-child {
        margin-right: 0;
        padding-right: 0;
    }

    .stgAlt li input[type="checkbox"] {
        cursor: pointer;
    }

    .stgAlt li p {
        display: inline;
        vertical-align: middle;
        margin-right: 8px;
        color: #fff;
    }

    .receiveTypeGG {
        display: flex;
        flex-direction: column;
        border: 1px solid #525868;
        border-radius: 5px;
        width: 100%;

        > li {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-right: 0;

            &:not(:last-child) {
                border-bottom: 1px solid #525868;
            }

            > div {
                width: 200px;
                background-color: #272E42;
                color: #fff;
                padding: 9px 14px;
                border-radius: 5px 0 0 5px;
            }

            > ul {
                padding-left: 15px;
            }
        }
    }

    .stgAlm {
    }

    .stgAlm li {
        display: inline-block;
        vertical-align: middle;
        margin-right: 20px;
    }

    .stgAlm li:last-child {
        right: 0;
    }

    .stgAlm li input[type="radio"] {
        cursor: pointer;
    }

    .stgAlm li label {
        font-family: 'pretendard';
        font-size: 16px;
        color: #fff;
        margin-left: 7px;
        cursor: pointer;
        line-height: 32px;
    }

    .stgAlm li input[type="hsmDtl1ber"] {
        display: inline-block;
        vertical-align: middle;
        margin-left: 5px;
        width: 60px;
        height: 32px;
        line-height: 30px;
        background: #182230;
        border: solid 1px #232c3c;
        color: #fff;
        font-size: 12px;
        padding: 0 10px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    .stgAlm li select {
        display: inline-block;
        vertical-align: middle;
        width: 60px;
    }

    input[type="text"].settingInput {
        display: inline-block;
        vertical-align: middle;
        width: 60px;
        height: 28px;
        text-align: center;
        font-size: 12px;
        background: #232c42;
        border: solid 1px #474b69;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        color: #fff;
    }

    .settingRadio input[type="radio"] {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        border: solid 1px #ddd;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        position: relative;
        cursor: pointer;
        border-radius: 50%;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
    }

    .settingRadio input[type="radio"]:checked {
        border-color: #fff;
    }

    .settingRadio input[type="radio"]:checked:after {
        content: "";
        display: block;
        background: ${_SettingsCommon[PR.styleMode].inputRadioCheckedBackground};
        position: absolute;
        left: 4px;
        right: 4px;
        top: 4px;
        bottom: 4px;
        border-radius: 50%;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
    }

    .settingRadio input[type="radio"] + label.settingRadio {
        display: inline;
        vertical-align: middle;
        margin-left: 7px;
        font-weight: 500;
        cursor: pointer;
        color: #fff;
        /* font-family: "dotum", sans-serif; */
        font-size: 12px;
    }

`;


/**********************************************************************/
// SOP 환경 - 일반

export const SopSetComponent = styled(SettingsCommon)`
    .stgHalf {
        border-bottom: solid 1px rgba(255, 255, 255, 0.1);
        padding-bottom: 20px;
        margin-bottom: 20px;
    }

    .stgHalf:after {
        content: "";
        display: table;
        clear: both;
    }

    .stgHalf > div {
        float: left;
        width: 55%;
    }

    .stgHalf > div:last-child {
        width: 45%;
    }

    .stgHalfH{
       display: flex;
       padding-bottom: 20px;
       /* border-bottom: solid 1px #4E636D; */
       border-bottom: solid 1px rgba(255, 255, 255, 0.1); 
    }

    .stgHalfH:after {
        content: "";
        display: table;
        clear: both;
    }

    .stgHalfH > div {
        float: left;
        width: 55%;
    }

    .stgHalfH > div:last-child {
        /* width: 45%; */
        width: ${_SettingsCommon[PR.styleMode].stgHalfHDivLastWidth};
    }

    .stgMode {
        margin-top: 5px;
    }

    .stgMode li {
        margin-bottom: 7px;
    }

    .stgMode li:last-child {
        margin-bottom: 0;
    }

    .stgMode li input[type="text"] {
        display: inline-block;
        vertical-align: middle;
        margin-left: 10px;
        width: 100px;
        height: 28px;
        font-size: 12px;
        background: #232c42;
        border: solid 1px #474b69;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        color: #fff;
    }

    .stgMode li label {
        font-family: 'pretendard';
        font-size: 16px;
        color: #fff;
        margin-right: 8px;
    }

    .stgModeH {
        margin-top: 5px;
    }

    .stgModeH li {
        margin-bottom: 18px;
    }

    .stgModeH li:last-child {
        margin-bottom: 0;
    }

    .stgModeH li input[type="text"] {
        display: inline-block;
        vertical-align: middle;
        margin-left: 10px;
        width: 100px;
        height: 28px;
        font-size: 12px;
        background: #232c42;
        border: solid 1px #474b69;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        color: #fff;
    }

    .stgModeH li label {
        font-family: 'pretendard';
        font-size: 14px;
        font-weight: 400;
        color: #fff;
        margin-right: 8px;
    }

    .stgTime {
        color: #fff;
        font-size: 16px;
    }

    .stgTime:after {
        content: "";
        display: table;
        clear: both;
    }

    .stgTime dt {
        float: left;
        line-height: 30px;
        margin-right: 10px;
        font-size: ${_SettingsCommon[PR.styleMode].stgTimeDtFontSize};
    }

    .stgTime dd {
        float: left;
    }

    .stgTime li {
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
        font-size: ${_SettingsCommon[PR.styleMode].stgTimeLiFontSize};
    }

    .stgTime li:last-child {
        margin-right: 0;
    }

    .stgTime li:nth-child(3) {
        margin-left: 10px;
    }

    .stgRstr {
    }

    .stgRstr:after {
        content: "";
        display: table;
        clear: both;
    }

    .stgRstr li {
        float: left;
        line-height: 28px;
        font-size: 16px;
        color: #fff;
        margin-right: 5px;
    }

    .stgRstr li:last-child {
        margin-right: 0;
    }
`;


/**********************************************************************/
// 조직관리

export const TeamEditorComponent = styled(SettingsCommon)`

`


/**********************************************************************/
// 시스템 정보

export const SystemInfoComponent = styled(SettingsCommon)`
    .stgHigh {
    }

    .stgHigh p {
        display: inline;
        vertical-align: middle;
        color: #fff;
        font-size: 12px;
        font-family: "dotum", sans-serif;
    }

    .stgHigh span {
        display: inline;
        vertical-align: middle;
        color: #fff;
        font-size: 16px;
    }
`;


/**********************************************************************/
// 수신자 편집

export const SelectReceiverComponent = styled(SettingsCommon)`
    #dshPop {
        position: fixed;
        z-index: 101;
        background: rgba(0, 0, 0, 0.6);
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    #dshPop > div {
        display: table;
        width: 100%;
        height: 100%;
    }

    #dshPop > div > div {
        display: table-cell;
        width: 100%;
        vertical-align: middle;
    }

    .dspCont {
        margin: 0 auto;
        background: rgba(14, 22, 45, 0.8);
        width: 854px;
        height: 476px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
    }

    .dspTop {
        height: 40px;
        background: rgba(255, 255, 255, 0.1) 0% 0% no-repeat padding-box;
        border-radius: 5px 5px 0px 0px;
        padding: 10px 20px;
        padding-bottom: 8px;
        ${props => props.theme.variables.flex()};
    }

    .dspTitle {
        font-size: 16px;
        font-weight: 600;
        color: ${_SettingsCommon[PR.styleMode].stgTitleColor};
    }

    .dspX {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: url(${dashboard_layer_close}) no-repeat center
        center;
    }

    .dspBottom {
        padding: 20px;

        .stgmTo span {
            display: block;
            color: #fff;
            height: 28px;
            line-height: 28px;
            position: absolute;
            left: 0;
            top: 3px;
            font-size: 16px;
        }

        .stgmTo p {
            display: block;
            width: 100%;
            height: 34px;
            line-height: 32px;
            padding: 0 10px;
            font-family: 'pretendard';
            font-size: 16px;
            background: #0E162D;
            border: 1px solid #ffffff1a;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            border-radius: 5px;
            color: #fff;
        }
    }

    .stguWrap {
        margin: 0 -5px;
        padding-top: 20px;
    }

    .stguWrap:after {
        content: "";
        display: table;
        clear: both;
    }

    .stguWrap > div {
        float: left;
        padding: 0 5px;
    }

    .stguWrap > div:nth-child(1) {
        width: 30%;
    }

    .stguWrap > div:nth-child(2) {
        width: 32%;
    }

    .stguWrap > div:nth-child(3) {
        width: 6%;
    }

    .stguWrap > div:nth-child(4) {
        width: 32%;
    }

    .stguWrap > div > div {
        border: 1px solid #525868;
        height: 250px;
        background: #272E42;
        overflow: hidden;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
    }

    .stguWrap .scroll-bar {
        background: rgba(255, 255, 255, 0.5) !important;
    }

    .dsiTree {
        padding: 4px;
        font-family: "dotum", sans-serif;
        font-size: 11px;
    }

    .dsiTree h5 {
        font-size: 11px;
        font-weight: 400;
    }

    .dsiTree h5:after {
        content: "";
        display: table;
        clear: both;
    }

    .dsiTree li {
    }

    .dsiTree h5 {
        padding: 4px;
    }

    .dsiTree h5:hover {
    }

    .dsiTree span {
        display: block;
        height: 16px;
        line-height: 16px;
        float: left;
        color: #fff;
        cursor: pointer;
    }

    .dsiTree span.on {
    }

    .dsiTree span:hover {
        color: #e4ad2b;
    }

    .dsiTree span:before {
        content: "▶";
        margin-right: 5px;
    }

    .dsiTree span.on:before {
        content: "▼";
    }

    .dsiTree a {
        margin-left: 10px;
    }

    .dsiTree ul {
        padding-left: 6px;
        display: none;
    }

    .dsiTree a {
        color: #fff;
        line-height: 1.8em;
        display: inline-block;
        padding-left: 5px;
        cursor: pointer;
    }

    .dsiTree a:focus,
    .dsiTree a:active,
    .dsiTree a:hover {
        color: #e4ad2b;
    }

    .dsiTree .dsiTreeCheck {
        color: #e4ad2b;
    }

    .stguTh {
        height: 28px;
    }

    .stguTh th {
        font-size: 16px;
        padding: 5px;
        text-align: center;
        color: #fff;
        background: #0E162D;
        font-weight: normal;
    }

    .stguTd {
        height: 210px;
    }

    .stguTd td {
        /* font-family: "dotum", sans-serif; */ 
        font-size: 12px;
        padding: 5px;
        text-align: center;
        color: #fff;
        border-bottom: solid 1px rgba(255, 255, 255, 0.1);
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    
    .stguTd td a:hover {
        color: #e4ad2b;
    }
    
    .delete-icon {
        padding: 0 !important;
        vertical-align: middle;
    }

    .delete-icon a {
        background: url(${settings_bin}) no-repeat;
        display: block;
        background-size: contain;
        width: 14px;
        height: 14px;
        margin: 0 auto;

        &:hover {
            background: url(${settings_bin_hover_wonik}) no-repeat; 
            display: block;
            background-size: contain;
            width: 14px;
            height: 14px;
            margin: 0 auto;
        }
    }

    .sppBot .stguTd {
        height: 113px;
    }

    .sppBot .stguTd a {
        display: inline-block;
        border: solid 1px #fff;
        font-size: 11px;
        padding: 2px 5px;
        margin: 0 2px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    .sppBot .stguTd a:hover {
        border-color: #ff8400;
        background: #ff8400;
        color: #fff;
    }

    .stguAdd {
        background: none !important;
        border: none !important;
    }

    .stguAdd > div {
        display: table;
        width: 100%;
        height: 100%;
    }

    .stguAdd > div > div {
        display: table-cell;
        width: 100%;
        vertical-align: middle;
    }

    .stguAdd ul {
    }

    .stguAdd ul li {
        margin: 10px 0;
    }

    .stguAdd ul li a {
        display: block;
        width: 30px;
        height: 30px;
        border: solid 1px #ddd;
        margin: 0 auto;
        text-indent: -9999px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    .stguAdd ul li:first-child a {
        background: url(${setting_user_add}) no-repeat center center;
    }

    .stguAdd ul li:last-child a {
        background: url(${setting_user_del}) no-repeat center center;
    }

    .stguAddIcon{
        background: url(${setting_user_add}) no-repeat center center !important; 
    }

    .regularMemberCheck {
        color: #e4ad2b;
    }

    .scrollbar {
        overflow-y: auto !important;
    }

    .scrollbar::-webkit-scrollbar {
        width: 17.997px;
        height: 6.01px;
    }

    .scrollbar::-webkit-scrollbar-thumb {
        background-color: #8d97bc;
        border-radius: 17.992px;
        background-clip: padding-box;
        border: 6px solid transparent;
    }

    .scrollbar::-webkit-scrollbar-track {
        background-color: #273353;
        background-clip: padding-box;
        border-radius: 17.992px;
        border: 6px solid transparent;
    }

    .pointDefault {
        cursor: default;
    }

    .regularMemberList > tr > td {
        cursor: default;
    }

    .regularMemberList > tr > td > a {
        cursor: pointer;
    }
`;


/**********************************************************************/
// SOP 환경 - 고급

export const SopLinkComponent = styled(SettingsCommon)`
    .stgConnectText{
        color: #fff;
        font-size: 16px;
    }

    .sopTreeArea {
        display: flex;
        width: 100%;
        height: 220px;
        margin-bottom: 5px;
        padding-top: ${_SettingsCommon[PR.styleMode].sopTreeAreaPaddingTop};
    }

    .sopLocationBox {
        display: block;
        width: 179px;
        background: ${_SettingsCommon[PR.styleMode].sopLocationBoxBackColor};
        margin-right: 10px;
        border: 1px solid #525868;
        border-radius: 5px;

        h5 {
            height: 36px;
        }
    }

    .sopDisableText {
        display: flex;
        height: ${_SettingsCommon[PR.styleMode].sopDisableTextHeight};
        line-height: ${_SettingsCommon[PR.styleMode].sopDisableTextLiHeight};
        background: ${_SettingsCommon[PR.styleMode].sopDisableTextBackColor};
        color: ${_SettingsCommon[PR.styleMode].sopDisableTextColor};
        font-weight: 400;
        font-size: 14px;
        padding-left: 10px;
        border-radius: 5px 5px 0 0;
    }

    .sopActiveText {
        color: ${_SettingsCommon[PR.styleMode].sopActiveTextTextColor};
        font-weight: 400;
        font-size: ${_SettingsCommon[PR.styleMode].sopActiveTextFontsize};

        span {
            margin-left: 4px;
        }
    }

    .sopLocationTitle{
        display: block;
        width: 30px;
    }
    .sopLocationTitleHydrogen{
        display: block;
    }
    .sopLocationZoneName{
        display: block;
        width: 120px;
        text-overflow:ellipsis;
        white-space:nowrap;
        overflow:hidden;
    }

    .sopLTree {
        display: block;
        overflow-y: auto;
    }

    .sopScroll {
        height: calc(100% - 37px);
        overflow-x: hidden;
        overflow-y: auto;
    }

    .sopScroll::-webkit-scrollbar {
        width: ${_SettingsCommon[PR.styleMode].sopScrollWidth};
        background: ${_SettingsCommon[PR.styleMode].sopScrollBackColor};
        border-radius: 10px; 
        border: ${_SettingsCommon[PR.styleMode].sopScrollBorderColor};
    }

    .sopScroll::-webkit-scrollbar-thumb {
        background: rgba(82, 88, 104, 1);
        border-radius: 6px; 
        border-left: ${_SettingsCommon[PR.styleMode].sopScrollBorderLeft};
        border-right: ${_SettingsCommon[PR.styleMode].sopScrollBorderRight};
        border-top: 0;
        border-bottom: 0;
    }

    .sopScroll::-webkit-scrollbar-track {
        background-color: rgba(0,0,0,0);
    }

    .sopTypeBox {
        display: block;
        width: 164px;
        background: ${_SettingsCommon[PR.styleMode].sopTypeBoxBackColor};
        margin-right: 10px;
        border: 1px solid #525868;
        border-radius: 5px;
    }

    .sensorTypeTab {
    }

    .sensorTypeTab li {
        display: flex;
        list-style: none;
        border-bottom: 1px dashed #525868;
        padding: 12px 16px;
        align-items: center;
        height: 36px;
    }

    .sensorTypeTab li a {
        font-weight: 400;
        font-size: 14px;
        color: #fff;
    }

    .sensorTypeTab li:hover {
        background: ${_SettingsCommon[PR.styleMode].treeSelectBackground};
        color: #fff;
        cursor: pointer;
    }

    .sopListBox {
        display: block;
        width: 284px;
        background: ${_SettingsCommon[PR.styleMode].sopListBoxBackColor};
        margin-right: 10px;
        border: 1px solid #525868;
        border-radius: 5px;

        .sFactoryText {
            position: relative;
            top: 2px;
        }

        h5 { 
            height: 30px;
        }
    }

    .sopDisableTextF {
        display: flex;
        height: ${_SettingsCommon[PR.styleMode].sopDisableTextHeight};
        line-height: ${_SettingsCommon[PR.styleMode].sopDisableTextLiHeight};
        background: ${_SettingsCommon[PR.styleMode].sopDisableTextBackColor};
        color: ${_SettingsCommon[PR.styleMode].sopDisableTextColor};
        font-size: ${_SettingsCommon[PR.styleMode].sopActiveTextFontsize};
        font-weight: 400;
        padding-left: 10px;
        border-radius: 5px 5px 0 0;
        align-items: center;
    }

    .sopListFlex {
        flex: 1;
        color: ${_SettingsCommon[PR.styleMode].sopListFlexTextColor};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        
    }

    .editIcon {
        display: inline-block;
        width: 14px;
        height: 14px;
        background: ${_SettingsCommon[PR.styleMode].editIcon};
        center;
        margin-right: 14px;
        cursor: pointer;
    }

    .editIcon:hover {
        display: inline-block;
        width: 14px;
        height: 14px;
        background: ${_SettingsCommon[PR.styleMode].editIconHover};
        margin-right: 14px;
    }

    .editIconAct {
        display: inline-block;
        width: 31px;
        height: 31px;
        background: url(${editAct_icon}) no-repeat center
        center;
    }

    .sopTableArea {
        display: block;
        width: 646px;
        height: 220px;
        background: ${_SettingsCommon[PR.styleMode].sopTableAreaBackColor};
        border: 1px solid #525868;
        border-radius: 5px;
        margin-top: 10px;

    }

    .sopTableArea table {
        display: table;
        width: 100%;
    }

    .sopTableArea table thead {
        color: ${_SettingsCommon[PR.styleMode].sopTableAreaTheadTextColor};
        font-weight: 400;
        font-size: 14px;
        text-align: center;
        background: ${_SettingsCommon[PR.styleMode].sopTableAreaTheadBackColor};
        height: ${_SettingsCommon[PR.styleMode].sopTableAreaTheadHeight};
    }

    .sopTableArea table thead th:first-child {
        border-radius: 5px 0 0 0;
    }

    .sopTableArea table thead th:last-child {
        border-radius: 0 5px 0 0;
        border-right: ${_SettingsCommon[PR.styleMode].sopTableAreaTheadThBorderRight};
    }

    .sopTableArea table thead tr {
        height: 30px;
        border-radius: 5px 5px 0 0;
        border-bottom: ${_SettingsCommon[PR.styleMode].sopTableAreaTheadTrBorderBottom};
    }

    .sopTableArea table thead tr th {
        height: 30px;
        text-align: center;
        vertical-align: middle;
        font-weight: 400;
        border-right: solid 1px #1A1F23;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .sopTableArea table tbody {
    }

    .sopTableArea table tbody tr {
        height: ${_SettingsCommon[PR.styleMode].sopTableAreaTbodyTrHeight};
        border-bottom: ${_SettingsCommon[PR.styleMode].sopTableAreaTbodyTrBorderBottom};
    }

    .sopTableArea table tbody tr td {
        color: #fff;
        font-weight: 400;
        font-size: 14px;
        text-align: center;
        vertical-align: middle;
    }

    .sopTree {
        height: 18px;
        line-height: 18px;
        font-size: 13px;
        color: #fff;
    }

    .sopTree h5 {
        font-size: 13px;
        font-weight: 400;
    }

    .sopTree h5:after {
        content: "";
        display: table;
        clear: both;
    }

    .sopTree h5 div {
        cursor: pointer;
        display: inline-flex;
        flex-direction: row;
        align-items: center;
        align-content: center;
        width: 100%;
    }

    .sopTree h5:hover {
        background: ${_SettingsCommon[PR.styleMode].treeSelectBackground};
    }

    .sopTree ul {
        /* display: none; */
        text-align: left;
        color: #fff;

       .treeSelect {
            background: ${_SettingsCommon[PR.styleMode].treeSelectBackground};
            height: 30px;
       }
    }

    .sopTree li {
        display: block;
        text-align: left;
    }

    .sopTree > li {
        border-bottom: 1px dashed #525868;
    }

    .sopTree h5 div.on {

    }

    .sopTree h5 div p.on {
        color: red;
    }

    .sopTree h5 span.on {
    }

    .sopTree span {
        cursor: pointer;
        /* display: inline-flex; */
        display: ${_SettingsCommon[PR.styleMode].sopTreeSpanDisplay};
        flex-direction: row;
        align-items: center;
        align-content: center;
        font-size: 11px;
        color: #fff;
        cursor: pointer;
    }

    .sopTree span.on {
    }

    .sopTree span:before {
        margin-right: 5px;
    }

    .sopTree p {
        display: flex;
        align-items: center;
    }

    .sopTree p.on {
    }

    .sopTree a {
        margin-left: 10px;
    }

    .sopTree a {
        display: inline-block;
        width: 100%;
        height: 16px;
        line-height: 16px;
        color: #fff;
        cursor: pointer;
        text-align: left;
    }

    .treeSelect {
        background: ${_SettingsCommon[PR.styleMode].treeSelectBackground};
        height: 36px;
    }

    .sFactoryText {
        font-weight: 400;
        font-size: 14px;
        color: #fff;
        letter-spacing: 0.7px;
    }

    .sAreaText {
        font-weight: 400;
        font-size: 12px;
        color: #fff;
        padding-left: 18px;
    }

    .sFloorText {
        font-weight: 400;
        font-size: 12px;
        color: #fff;
        padding-left: 36px;
    }

    .sDisaster{
        display: block;
        width: 100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .arrowIcon {
        display: inline-block;
        width: 30px;
        height: 30px;
        background: url(${treeArrow_icon}) no-repeat center
        center;
        background-size: 6px;
    }

    .arrowIcon.on {
        display: inline-block;
        width: 30px;
        height: 30px;
        background: url(${treeArrow_icon}) no-repeat center
        center;
        transform: rotate(90deg);
        background-size: 6px;
    }

    .appliBtn {
        display: block !important;
        width: 48px;
        height: 18px;
        line-height: 18px;
        background: ${_SettingsCommon[PR.styleMode].appliBtn};
        border-radius: 30px;
        text-align: center;
        margin-left: 8px;
        font-size: 12px;
        font-weight: 400;
    }

    .binIcon {
        display: inline-block;
        width: 16px;
        height: 18px;
        background: url(${settings_bin}) no-repeat center center;
        cursor: pointer;
    }

    .binIcon:hover {
        display: inline-block;
        width: 16px;
        height: 18px;
        background: ${_SettingsCommon[PR.styleMode].binIconHover};
        cursor: pointer;
    }
`;


/**********************************************************************/
// NVR 설정 (경기도청)

export const ModalBackgroundNVR = styled.div`
    position: fixed;
    top:0; 
    left: 0; 
    bottom: 0; 
    right: 0;
    background: rgba(0, 0, 0, 0.3);
    opacity: 1;
    z-index: 100;

    .tooltipGGNVR-content {
        position: absolute;
        color: #000000;
        padding: 4px 10px;
        border-radius: 3px;
        background: #00DD8B 0% 0% no-repeat padding-box;
        font-size: 11px;
        letter-spacing: 0.6px;
        line-height: 1.2;
        z-index: 9999;
    }

    .tooltipGGNVR-content:after {
        position: absolute;
        bottom: -25%;
        left: 20px;
        margin-left: -4px;
        width: 0;
        border-top: 5px solid #00DD8B;
        border-right: 5px solid transparent;
        border-left: 5px solid transparent;
        content: " ";
        font-size: 0;
        line-height: 0;
    }
`

export const NVRSettingComponent = styled(SettingsCommon)`
    width: 860px;
    height: 580px;
    position: absolute;
    left: 50%;
    top: 52%;
    transform: translate(-50%, -52%);
    z-index: 99;
    overflow: hidden;
    box-sizing: border-box;
    background: #0E162D;
    border: 1px solid #FFFFFF1A;

    .dslTop {
        padding: 15px 30px;
        position: relative;
        border-radius: 5px 5px 0px 0px;
        border-bottom: none;
        display: flex;
    }

    .dslGrd {
        background: #272E42;
    }

    .dslTitle {
        height: 16px;
        line-height: 16px;
        font-size: 16px;
        color: #5398FF;
        font-weight: 600;
        flex: 1;
        white-space: nowrap; 
        text-overflow: ellipsis; 
        overflow: hidden;
        padding-right: 10px;
    }

    .dslX {
        display: block;
        width: 16px;
        height: 16px;
        text-indent: -9999px;
        position: absolute;
        right: 26px;
        top: 50%;
        margin-top: -8px;
        background: url(${dashboard_layer_close}) no-repeat center center;
        z-index: 1; 
        cursor: pointer;
    }

    .nvrSelectBox{
        padding: 8px 0;
        display: inline-flex;
        /* flex: 1; */
        margin-right: 20px;
        margin-left: 34px; 

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

            &.on{
                /* background: #272E42 url(${gg_titlebar_select_arrow}) 95% 49% no-repeat;
                transform: rotate(180deg); */
                border: solid 1px #3B83F4;
            }
        }

        option{

        }
    }

    .nvrSelectP{
        display: block;
        width: 156px;
        height: 28px;
        color: #fff;
        font-size: 16px;
        margin-left: 34px;
        padding: 8px 0;
    }    

    .stgList{
        background: #0E162D;
        padding: 0px 34px;
    }

    .stgList .white {
        font-size: 16px;
        vertical-align: middle;
    }

    .stgScroll {
        width: 100%;
        height: 440px;
        padding-top: 0px;
        padding-right: 0px;
    }

    .stgName {
        margin-bottom: 8px;
        padding-bottom: 8px;
    }

    .server {
        display: inline-block;
        margin-left: 20px;

        & * {
            color: #fff;
        }

        > div {
            display: inline-block;
            margin-right: 20px;

            label {
                margin-right: 10px;
            }

            input,
            input:disabled {
                width: 270px;
                height: 28px;
                border-radius: 5px;
                text-align: center;
            }

            input {
                background: #272E42;
                border: 1px solid #FFFFFF33;
            }

            input:disabled {
                background: #FFFFFF0D !important;
                color: #fff !important;
                border: none !important;
            }
        }

        > div:last-child{
            margin-right: 0;
        }
    }

    .buttonWrap {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 9px;
        width: 100%;
        position: absolute;
        bottom: 15px;

        li {
            width: 69px;
            height: 28px;
            border-radius: 4px;
            line-height: 28px;
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;

            &.cancelBtn {
                background-color: #0E162D;
                border: 1px solid #FFFFFF38;
                color: #FFFFFF;
            }

            &.saveBtn {
                background: transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;
                border: 1px solid #FFFFFF38;
                color: #fff;
            }
        }
    }

    [data-tooltip] {
        position: relative;
        z-index: 2;
    }

    [data-tooltip]:before,
    [data-tooltip]:after {
        /* visibility: hidden; */
        visibility: visible;
        -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
        filter: progid: DXImageTransform.Microsoft.Alpha(Opacity=0);
        opacity: 0;
        pointer-events: none;
    }

    [data-tooltip]:before {
        position: absolute;
        bottom: 150%;
        left: 50%;
        margin-bottom: 5px;
        transform: translate(-10%, 0);
        padding: 4px 10px;
        white-space: nowrap;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        background-color: ${_SettingsCommon[PR.styleMode].dataTooltipBackColor};
        color: ${_SettingsCommon[PR.styleMode].dataTooltipTextColor};
        font-family: ${_SettingsCommon[PR.styleMode].dataTooltipFontFamily};
        font-size: 11px;
        content: attr(data-tooltip);
        text-align: center;
        line-height: 1.2;
    }

    [data-tooltip]:after {
        position: absolute;
        bottom: 150%;
        left: 50%;
        margin-left: -5px;
        width: 0;
        border-top: ${_SettingsCommon[PR.styleMode].dataTooltipBorderTopColor};
        border-right: 5px solid transparent;
        border-left: 5px solid transparent;
        content: " ";
        font-size: 0;
        line-height: 0;
    }
    
    [data-tooltip]:hover:before,
    [data-tooltip]:hover:after {
        visibility: visible;
        -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
        filter: progid: DXImageTransform.Microsoft.Alpha(Opacity=100);
        opacity: 1;
    }

    .tooltipGGNVR {
        display: inline-block;
        vertical-align: middle;
        width: 12px;
        height: 12px;
        text-align: center;
        line-height: 14px;
        color: #fff;
        font-size: 10px;
        margin-left: 5px;
        margin-right: 10px;
        border: solid 1px #ddd;
        cursor: help;
        background: url(${settings_information_button}) no-repeat center center;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
    }
`;


/**********************************************************************/
// 연동 서비스 설정 (경기도청)

export const InterWorkingComponent = styled(SettingsCommon)`
    .stgScroll {
        overflow-x: hidden;
        overflow-y: scroll;
        display: inline-block;
        width: 675px;
        height: 450px;
        padding-right: 15px;
        padding-top: 47px;
    }
`;


/**********************************************************************/
// 센서 설정 (경기도청)

export const SensorSetComponent = styled.div`
    height: 823px;
    position: absolute;
    left: 50%;
    top: 52%;
    transform: translate(-50%, -52%);
    z-index: 99;
    overflow: hidden;
    box-sizing: border-box;
    

    .popupBox {
        position: relative;
        width: 1434px;
        height: 823px;
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
                border-bottom: 3px solid #5398FF;
                text-align: center;
                position: relative;
                bottom: -2px;
            }
        }

        .cctvSetFlex{
            display: flex;
        }

        .cctvSetBox{
            display: flex;
            flex: 1;
            align-items: center;

            > p {
                display: block;
                color: ${(props) => props.$isEditMode ? "#A5A5A5" : "#5398FF"};
                border-left: ${(props) => props.$isEditMode ? "solid 2px #A5A5A5" : "solid 2px #5398FF"};
                padding-left: 5px;
                margin-right: 10px;
            }
        }            

        .cctvSetSelect{
            padding: 8px 0;
            display: inline-flex;
            /* flex: 1; */
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
    
                &.on{
                    /* background: #272E42 url(${gg_titlebar_select_arrow}) 95% 49% no-repeat;
                    transform: rotate(180deg); */
                    border: solid 1px #3B83F4;
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
                color: #A5A5A5;
                font-size: 12px;
                padding-left: 10px;
                border: 0;

                &:disabled {
                    background: rgba(255, 255, 255, .1) !important;
                    color: #A5A5A5 !important;
                    pointer-events: none;
                }
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
                        background: url(${search_on}) no-repeat center center, rgba(83, 152, 255, .3);
                    }
                }

                &:nth-child(3) {
                    background: url(${update_off}) no-repeat center center, rgba(204, 204, 204, .3);

                    &.on, &:hover {
                        background: url(${update_on}) no-repeat center center, rgba(83, 152, 255, .3);
                    }
                }

                &:nth-child(4) {
                    background: url(${delete_off}) no-repeat center center, rgba(204, 204, 204, .3);

                    &:hover {
                        background: url(${delete_on}) no-repeat center center, rgba(83, 152, 255, .3);
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
                        width: 90%; 
                        height: 26px;
                        background: #000000 !important;
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
                    background: #272E42;
                    border-color: #bbb;
                }

                input[type="checkbox"]:checked {
                    background: #FF8400 url(${checkbox}) no-repeat center center; 
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
                    background-color: #0E162D;
                    border: 1px solid #FFFFFF38;
                    color: #FFFFFF;
                }

                &.saveBtn {
                    background: transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;
                    border: 1px solid #FFFFFF38;
                    color: #fff;
                }
            }
        }
        
        .userList + .buttonWrap {
            bottom: 24px;
            left: 0;
        }
    }
`;