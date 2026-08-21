import styled from "styled-components";

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
import settings_bin from '../../Common/img/imghydrogen/main/bin_icon.svg';
import settings_bin_hover from '../../Common/img/imghydrogen/main/bin_icon_active.svg';

import select_arrow from '../../Common/img/common/select_arrow.png';
import layoutSettingBackground from '../../Common/img/imghydrogen/main/layoutSetting_background.svg';
import treeArrow_icon from '../../Settings/image/treeArrow_icon.png';
import editAct_icon from '../../Settings/image/editAct_icon.png';
import sopLink_pen from '../../Settings/image/sopLink_pen.png';
import sopLink_pen_hover_sb from '../../Settings/image/sopLink_pen_hover_sb.png';
import sopLink_pen_hover_wonik from '../../Settings/image/sopLink_pen_hover_wonik.png';
import sopLink_pen_hydrogen from '../../Common/img/imghydrogen/H_settingPencil.png';

import H_inputChecked from '../../Common/img/imghydrogen/main/checkBox_active.svg';
import selectArrow_icon from '../../Common/img/imghydrogen/main/selectArrow_icon.svg';
import selectArrow_icon_blue from '../../Common/img/imghydrogen/main/selectArrow_icon_blue.svg';
import selectArrow_icon_disable from '../../Common/img/imghydrogen/main/selectArrow_icon_disable.svg';
import treeArrow from '../../Common/img/imghydrogen/main/treeArrow_icon.svg';
import sortIcon from '../../Common/img/imghydrogen/main/sort_Icon.svg';
import ascending_icon from '../../Common/img/imghydrogen/main/ascending_icon.svg';
import recycleBin from '../../Common/img/imghydrogen/main/recycleBin_icon.svg';
import applyIcon from '../../Common/img/imghydrogen/main/apply_icon.svg';
import apply_icon_default from '../../Common/img/imghydrogen/main/apply_icon_default.svg';


/**********************************************************************/
// Settings 공통 CSS

export const SettingsCommon = styled.div`

    input[type="checkbox"] {
        display: inline-block;
        vertical-align: middle;
        width: 16px;
        height: 16px;
        background: #FFF;
        border: none;
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
        background: url(${H_inputChecked}) no-repeat center center;
        background-size: 16px auto !important;
    } 

    input[type="checkbox"] + label {
        display: inline;
        vertical-align: middle;
        margin-left: 7px;
        color: #fff;
        font-weight: 400;
        font-size: 12px;
        cursor: pointer;
    }








    .stgScroll {
        overflow-x: hidden;
        overflow-y: scroll;
        display: inline-block;
        width: 100%;
        height: auto;
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

    /* .stgTab {
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
        height: 25px;
        line-height: 25px;
        padding: 0px 45px;
        font-size: 14px;
        border: 1px solid #ffffff1a;
        border-right: none;
        color: #A5A5A5;
        background: #2B383E;
        cursor: pointer;
        max-width: 220px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .stgTab li:first-child a {
        border-radius: 13px 0px 0px 13px;
        cursor: pointer;
    }

    .stgTab li:last-child a {
        border-radius: 0px 13px 13px 0px;
        border-right: solid 1px #3b3f5c;
        cursor: pointer;
    }

    .stgTab.single li a {
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    .stgTab li a.on {
        background: #0085FF;
        color: #343434;
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
        background: #273840;
        border: solid 1px #0085FF;
        color: #19afff;
        padding: 0 12px;
        margin-right: 5px;
        font-size: 13px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        cursor: pointer;
    }

    .stgnRset:hover {
        background: var(--title-bar-text-blue-color);
        border-color: var(--title-bar-text-blue-color);
    }

    .dslSel {
        display: block;
        width: 100%;
        border: none;
        height: 28px;
        padding-left: 10px;
        padding-right: 30px;
        color: #fff;
        font-size: 14px;
        font-weight: 300;
        background: #273840 url(${select_arrow}) no-repeat 90% 50%;
        background-position: right 10px center;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        cursor: pointer;
        border-radius: 3px;
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
        background: #273840;
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
    */

    /***************************************************************/
    // 환경설정 공통 CSS

    #tooltip {
        cursor: help;
    }
    
    [data-tooltip] {
        position: relative;
        z-index: 2;
    }

    [data-tooltip]:before,
    [data-tooltip]:after {
        visibility: hidden;
        opacity: 0;
        pointer-events: none;
    }

    [data-tooltip]:before {
        position: absolute;
        top: 50%;
        right: 170%;
        transform: translate(0, -50%);
        padding: 4px 8px;
        white-space: nowrap;
        border-radius: 4px;
        height: 32px;
        line-height: 30px;
        background-color: #565B69;
        color: #000;
        content: attr(data-tooltip);
        text-align: center;
        color: #FFF;
        font-size: 14px;
        font-weight: 500;
        letter-spacing: -0.42px;
    }

    [data-tooltip]:after {
        content: " ";
        position: absolute;
        border-left: 5px solid #565B69;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        transform: translate(0, -50%); 
        top: 50%; 
        right: 140%;
    }
    
    [data-tooltip]:hover:before,
    [data-tooltip]:hover:after {
        visibility: visible;
        opacity: 1;
    }

    .contents {

        & * {
            font-size: 14px;
            font-weight: 500;
        }

        .item {
            display: flex;
            width: 100%;
            height: 58px;
            background: rgba(182, 198, 210, 0.07);
            padding: 0 20px;
            margin-bottom: 1px;
            position: relative;

            &.margin {
                margin-top: 20px;
            }

            > div:not(.tooltipBox) {
                display: flex;
                flex: 1;
                justify-content: flex-start;
                align-items: center;

                > p {
                    margin-right: 20px;
                    color: #fff;
                }

                > div:not(:nth-child(1)) {
                    margin-right: 20px;
                }

                > select{
                    width: 172px;
                    height: 32px;
                    padding: 6px 8px;
                    border-radius: 2px;
                    background: #131313 url(${selectArrow_icon}) no-repeat 95% center;
                    color: #FFF;
                    font-size: 12px;
                    font-weight: 400;

                    &.on{
                        border: solid 1px #0085ff;
                        background: #131313 url(${selectArrow_icon_blue}) no-repeat 95% center;
                        color: #0085ff;
                    }

                    &.disable{
                        background: #3C4143 url(${selectArrow_icon_disable}) no-repeat 95% center;
                        color: #1E1E1E;
                        pointer-events: none;
                    }

                    > option{
                        color: #FFF;
                        background: #131313;
                        font-family: "Spoqa Han Sans Neo";
                        font-size: 12px;
                        font-weight: 400;
                    }
                }

                > div{
                    > select{
                        width: 172px;
                        height: 32px;
                        padding: 6px 8px;
                        border-radius: 2px;
                        background: #131313 url(${selectArrow_icon}) no-repeat 95% center;
                        color: #FFF;
                        font-size: 12px;
                        font-weight: 400;

                        &.on{
                            border: solid 1px #0085ff;
                            background: #131313 url(${selectArrow_icon_blue}) no-repeat 95% center;
                            color: #0085ff;
                        }

                        &.disable{
                            background: #3C4143 url(${selectArrow_icon_disable}) no-repeat 95% center;
                            color: #1E1E1E;
                            pointer-events: none;
                        }

                        > option{
                            color: #FFF;
                            background: #131313;
                            font-family: "Spoqa Han Sans Neo";
                            font-size: 12px;
                            font-weight: 400;
                        }
                    }
                }
            }

            .tooltipBox{
                display: flex;
                justify-content: flex-start;
                align-items: center;

                > img{
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                }
            }

            input[type=checkbox] {
                margin-right: 3px;
            }

            label {
                font-size: 12px;
                font-weight: 400;
                position: relative;
                top: -1px;
                color: #fff;
                font-family: Inter;
            }

            .selectWrap{

                > select{
                    width: 66px;
                    height: 32px;
                    padding: 6px 8px;
                    border-radius: 2px;
                    background: #131313 url(${selectArrow_icon}) no-repeat 85% center;
                    color: #FFF;
                    font-size: 12px;
                    font-weight: 400;
                    
                    &.on{
                        border: solid 1px #0085ff;
                        background: #131313 url(${selectArrow_icon_blue}) no-repeat 85% center;
                        color: #0085ff;
                    }

                    &.disable{
                        background: #3C4143 url(${selectArrow_icon_disable}) no-repeat 85% center;
                        color: #1E1E1E;
                        pointer-events: none;
                    }
                    
                    > option{
                        color: #FFF;
                        background: #131313;
                        font-family: "Spoqa Han Sans Neo";
                        font-size: 12px;
                        font-weight: 400;
                    }
                }
            }

            button {
                height: 36px;
                font-size: 14px;
                background-color: #0085FF;
                padding: 6px 16px;
                border-radius: 6px;
                color: #000;
            }

            .innerTxt {
                font-size: 12px;
                color: #fff;
                text-align: center;
                font-family: Inter;
                font-weight: 400;
                line-height: 12px;
                padding: 0 8px;
            }

            .innerTxt:nth-child(1){
                margin-right: 20px;
            }
        }
    }
`;



/**********************************************************************/
// 타이틀바 > 환경설정

export const LayoutSettingComponent = styled(SettingsCommon)`
    position: fixed;
    z-index: 99;
    width: 1060px;
    height: 754px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    padding: 40px;
    user-select: none;
    /* background: #1E1E1E; */
    background: url(${ layoutSettingBackground })no-repeat;
    border-radius: 8px;

    .closeBtn {
        position: absolute;
        top: 40px;
        right: 40px;
    }

    .menuWrap {

        h2 {
            margin-bottom: 10px;
            color: #B6C6D2;
            font-family: "Spoqa Han Sans Neo";
            font-size: 16px;
            font-weight: 700;
            line-height: 16px;
        }

        ul {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            position: relative;
            margin-bottom: 20px;

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
                padding: 10px 6px;
                text-align: center;
                border-bottom: 3px solid #3C4143;
                font-family: "Spoqa Han Sans Neo";
                font-weight: 500;
                cursor: pointer;

                &.on {
                    color: #0085FF;
                    border-bottom: 3px solid #0085FF;
                    z-index: 1;
                }
            }

            li:nth-child(2){
                padding: 10px 25px; 
            }
        }
    }

    .btnWrap {
        position: absolute;
        /* bottom: 40px; */
        bottom: 22px;
        left: 50%;
        transform: translate(-50%, -50%);

        button {
            width: 74px;
            height: 36px;
            border-radius: 6px;
            font-family: "Spoqa Han Sans Neo";
            font-size: 14px;
            font-weight: 400;
            margin: 0 4px;
            padding: 6px 16px;
            color: #888C94;
        }

        .cancle {
            border: 1px solid #888C94;
        }

        .submit {
            border: 1px solid #888C94;
        }
    }
`;


/**********************************************************************/
// 3D 관제 시스템

export const Monitoring3DComponent = styled(SettingsCommon)`
    /* .stgnKey {
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
        background: var(--title-bar-text-blue-color);
        border-color: var(--title-bar-text-blue-color);
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
        color: var(--settings-color);
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
    } */
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
        width: 50%;
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
        font-size: 14px;
    }

    .stgTime dd {
        float: left;
    }

    .stgTime li {
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
        font-size: 14px;
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
        color: #0085FF;
    }

    .dspX {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: url(${dashboard_layer_close}) no-repeat center;
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
            background: url(${settings_bin_hover}) no-repeat; 
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

export const ModalBackgroundSOPLink = styled.div`
    position: fixed;
    top:0; 
    left: 0; 
    bottom: 0; 
    right: 0;
    background: rgba(0, 0, 0, 0.6);
    opacity: 1;
    z-index: 100;
`

export const SopLinkComponent = styled(SettingsCommon)`
    /* width: 1060px;
    height: 755px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.60);
    z-index: 2; */
    width: 980px;
    height: 675px;    
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #181818;
    border-radius: 8px;
    padding: 40px;
    z-index: 2;

    .stgListBack{
    }

    /* .listWrap {
        display: flex;
        margin-top: 0;
        margin-bottom: 20px;

        h5 {
            color: #B6C6D2;
            font-family: "Spoqa Han Sans Neo";
            font-size: 16px;
            font-weight: 700;
        }

        .closeBtn {
            position: absolute;
            top: 40px;
            right: 40px;
        }
    }

    .sopTreeArea {
        display: flex;
        gap: 10px;
        height: 226px;
        margin-bottom: 20px;
    }

    .sopTreeBox {
        height: 226px;
    }

    .sopLocationBox, .sopTypeBox {
        width: 240px;
        flex: auto;
        display: block;
        background: rgba(182, 198, 210, 0.05);
    }

    .sopListBox {
        width: 280px;
    }

    .sopDisableText, .sopDisableTextF {
        display: flex;
        height: 36px;
        background: rgba(182, 198, 210, 0.10);
        color: #0085FF;
        font-weight: 400;
        font-size: 12px;
        padding: 12px 10px;
    }

    .sopActiveText,
    .sopActiveText span {
        color: #FFF;
        font-size: 12px;
        font-weight: 500;
        font-family: "Spoqa Han Sans Neo";

        span {
            margin-left: 3px;
        }
    }

    .sopLTree {
        display: block;
        overflow-y: auto;
    }

    .sopScroll {
        height: calc(100% - 36px);
        overflow-x: hidden;
        overflow-y: auto;
    }

    .sopTypeBox {
        display: block;
        background: rgba(182, 198, 210, 0.05);
    }

    .sopListBox {
        display: block;
        background: rgba(182, 198, 210, 0.05);

        .sFactoryText {
            position: relative;
            top: 2px;

            .toggleIcon {
                display: inline-block;
                width: 30px;
                height: 30px;
            }
        }

        h5 { 
            height: 30px;
        }
    }

    .sopListFlex {
        flex: 1;
        color: #fff;
        font-size: 12px;
        font-weight: 500;
    }

    .editIcon {
        display: inline-block;
        width: 12px;
        height: 23px;
        margin-right: 14px;
        cursor: pointer;
    }

    .editIconAct {
        display: inline-block;
        width: 31px;
        height: 31px;
    }

    .sopListArea {
        width: 100%;
        background-color: rgba(182, 198, 210, 0.05);
        border-radius: 4px 4px 0 0;
        margin-top: 10px;

        & * {
            font-size: 12px;
        }

        .sopList {

            .head > div, 
            .body > ul > li > div {

                &:nth-of-type(1) {
                    width: 6%;
                }

                &:nth-of-type(2) {
                    width: 16%;
                }
                
                &:nth-of-type(3) {
                    width: 16%;
                }
                
                &:nth-of-type(4) {
                    width: 16%;
                }
                
                &:nth-of-type(5) {
                    width: 16%;
                }
                
                &:nth-of-type(6) {
                    width: 24%;
                }

                &:nth-of-type(7) {
                    width: 6%;
                }
            }

            .head {
                background: rgba(182, 198, 210, 0.05);
                width: calc(100% - 6px);
                display: flex;
                color: #fff;

                &::after {
                    content: '';
                    width: 6px;
                    height: 32px;
                    background-color: #2A3344;
                    position: absolute;
                    right: 40px;
                }

                > div {

                    &:not(:last-child) {
                        border-right: 1px solid #131313;
                    }

                    height: 32px;
                    line-height: 32px;
                    text-align: center;
                    font-weight: 500;

                    .sort {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 5px;

                        span {
                            font-size: 12px;
                        }

                        button {
                            width: 15px;
                            height: 10px;

                            &.az {
                                background: url(${sortIcon}) no-repeat center center;
                            }

                            &.za {
                                transform: rotate(180deg);
                                background: url(${sortIcon}) no-repeat center center;
                            }
                        }
                    }
                }
            }

            .body {
                background-color: rgba(182, 198, 210, 0.05);
                overflow-y: scroll;
                height: 240px;
                color: #fff;

                ul {

                    li {
                        display: flex;
                        height: 38px;
                        border-bottom: 1px solid #1B212C;

                        div {
                            text-align: center;
                            border-right: 1px solid #1B212C;
                            height: 38px;
                            line-height: 38px;

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

    .sopTree {

        & * {
            font-size: 12px;
        }
        
        > li {

            div {
                height: 38px;
                line-height: 37px;
                border-bottom: 1px solid #1B212C;
                background: rgba(182, 198, 210, 0.05);
                cursor: pointer;

                &:hover {
                }

                &.depth1, &.sensorTxt {
                    padding: 0 10px;
                    color: #fff;
                }

                &.depth2 {
                    padding: 0 10px 0 15px;
                }

                &.depth3 {
                    padding: 0 10px 0 20px;
                }

                h2:before {
                    content: '';
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    background: url(${treeArrow}) no-repeat center center;
                    position: relative;
                    top: 5px;
                    margin-right: 10px;
                }

                &.on {

                    h2:before {
                        content: '';
                        transform: rotate(90deg);
                        transition: transform .35s;
                    }
                }
            }

        }
    } */



    /* 예전 styled *************************************************************/
    /***************************************************************************/

    .stgConnectText{
        color: #B6C6D2;
        font-family: "Spoqa Han Sans Neo";
        font-size: 16px;
        font-weight: 700;
    }

    .sopTreeArea {
        display: flex;
        width: 100%;
        /* height: 228px; */
        margin-bottom: 12px;
        padding-top: 28px;
    }

    .sopLocationBox {
        display: block;
        width: 292px;
        height: 226px;
        /* background: rgba(182, 198, 210, 0.05); */
        background: #202121;
        margin-right: 12px;
        border-radius: 4px;

        /* h5 {
            height: 36px;
        } */
    }

    .sopDisableText {
        display: flex;
        height: 24px;
        line-height: 24px;
        /* background: rgba(182, 198, 210, 0.10); */
        background: #282A2B;
        color: #1A1F23;
        font-weight: 400;
        font-size: 14px;
        padding-left: 10px;
        border-radius: 5px 5px 0 0;
    }

    .sopActiveText {
        height: 36px;
        line-height: 36px;
        color: #FFF;
        text-overflow: ellipsis;
        font-family: "Spoqa Han Sans Neo";
        font-size: 12px;
        font-weight: 500;

        span {
            margin-left: 4px;
        }
    }

    /* .sopLocationTitle{
        display: block;
        width: 30px;
    } */
    .sopLocationTitleHydrogen{
        display: block;
    }
    /* .sopLocationZoneName{
        display: block;
        width: 120px;
        text-overflow:ellipsis;
        white-space:nowrap;
        overflow:hidden;
    } */

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
        width: '';
        background: '';
        border-radius: 10px; 
        border: '';
    }

    .sopScroll::-webkit-scrollbar-thumb {
        background: #3C4143;
        border-radius: 6px; 
        border-left: 5px solid #3C4143;
        border-right: 5px solid #3C4143;
        border-top: 0;
        border-bottom: 0;
    }

    .sopScroll::-webkit-scrollbar-track {
        background-color: rgba(0,0,0,0);
    }

    .sopTypeBox {
        display: block;
        width: 216px;
        height: 226px;
        /* background: rgba(182, 198, 210, 0.05); */
        background: #202121;
        margin-right: 12px;
        border-radius: 4px;
    }

    .sensorTypeTab {
    }

    .sensorTypeTab li {
        display: flex;
        list-style: none;
        border-bottom: 1px solid #131313;
        padding: 12px 16px;
        align-items: center;
        height: 38px;
    }

    .sensorTypeTab li a {
        font-weight: 400;
        font-size: 12px;
        color: #fff;
    }

    .sensorTypeTab li:hover {
        background: #0085FF;
        color: #fff;
        cursor: pointer;
    }

    .sopListBox {
        display: block;
        width: 368px;
        height: 226px;
        /* background: rgba(182, 198, 210, 0.05); */
        background: #202121;
        /* margin-right: 12px; */
        border-radius: 4px;

        .sFactoryText {
            position: relative;
            top: 2px;
        }

        h5 { 
            height: 38px;
        }
    }

    .sopDisableTextF {
        display: flex;
        height: 36px;
        line-height: 36px;
        /* background: rgba(182, 198, 210, 0.10); */ 
        background: #282A2B;
        color: #fff;
        padding-left: 10px;
        border-radius: 5px 5px 0 0;
        align-items: center;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: "Spoqa Han Sans Neo";
        font-size: 12px;
        font-weight: 500;
    }

    .sopListFlex {
        flex: 1;
        color: #fff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        
    }

    .editIcon {
        display: inline-block;
        width: 14px;
        height: 14px;
        background: url(${sopLink_pen_hydrogen}) no-repeat center center;
        margin-right: 14px;
        cursor: pointer;
    }

    .editIcon:hover {
        display: inline-block;
        width: 14px;
        height: 14px;
        background: url(${sopLink_pen_hover_wonik}) no-repeat center center;
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
        /* width: 646px; */
        height: 224px;
        /* background: rgba(182, 198, 210, 0.05); */
        background: #202121;
        border-radius: 4px;
        margin-top: 10px;

    }

    .sopTableArea table {
        display: table;
        width: 100%;
        height: 100%;
    }

    .sopTableArea table thead {
        color: #0085FF;
        font-weight: 500;
        font-size: 14px;
        text-align: center;
        /* background: rgba(182, 198, 210, 0.10); */
        background: #282A2B;
        height: 32px;
    }

    .sopTableArea table thead th:first-child {
        border-radius: 5px 0 0 0;
    }

    .sopTableArea table thead th:last-child {
        border-radius: 0 5px 0 0;
        border-right: none;
    }

    .sopTableArea table thead tr {
        height: 32px;
        border-radius: 5px 5px 0 0;
        border-bottom: solid 1px #1A1F23;
    }

    .sopTableArea table thead tr th {
        height: 32px;
        text-align: center;
        vertical-align: middle;
        color: #fff;
        font-size: 12px;
        font-weight: 500;
        border-right: solid 1px #1A1F23;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .sort_icon{
        display: inline-block;
        width: 15px;
        height: 15px;
        background: url(${sortIcon})no-repeat center center;
        margin-left: 5px;
    }

    .ascending_icon{
        display: inline-block;
        width: 15px;
        height: 15px;
        background: url(${ascending_icon})no-repeat center center;
        margin-left: 5px;
    }

    /* test */
    .sopTableArea table tbody {
        /* display: block;
        max-height: 224px;
        overflow-y: scroll; */
    }

    .stgTbodyArea{
        overflow-y: scroll;
        display: block;
        max-height: 160px;
    }

    .stgTbody{

    }

    .sopTableArea table tbody tr {
        height: 32px;
        border-bottom: 1px dashed #131313;
    }

    .sopTableArea table tbody tr td {
        color: #fff;
        font-weight: 400;
        font-size: 12px;
        text-align: center;
        vertical-align: middle;
        border-right: 1px solid #131313;
        border-bottom: 1px solid #131313;
        padding: 0px 10px;
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
        height: 38px;
        border-bottom: solid 1px #131313;
    }

    .sopTree h5:hover {
        background: var(--title-bar-text-blue-color);
    }

    .sopTree ul {
        text-align: left;
        color: #fff;

        .treeSelect {
            background: var(--title-bar-text-blue-color);
            height: 38px;
        }
    }

    .sopTree li {
        display: block;
        text-align: left;
    }

    .sopTree > li {
        border-bottom: 1px dashed #131313;
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
        flex-direction: row;
        align-items: center;
        align-content: center;
        font-size: 12px;
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
        flex: 1;
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

    .sopTree {
        .treeSelect {
            .applyIcon {
                background: url(${applyIcon}) no-repeat center center;
            }
        }

        .applyIcon {
            background: url(${apply_icon_default}) no-repeat center center;
            width: 16px;
            height: 16px;
            position: relative;
            right: 10px;

            &:hover {
                
            }
        }

        h5:hover {
            .applyIcon {
                background: url(${applyIcon}) no-repeat center center;
            }
        }
    }

    .treeSelect {
        background: var(--title-bar-text-blue-color);
        height: 36px;
    }

    .sFactoryText {
        font-weight: 400;
        font-size: 12px;
        color: #fff;
        letter-spacing: 0.7px;
    }

    .sAreaText {
        font-weight: 400;
        font-size: 12px;
        color: #fff;
        padding-left: 10px; /* 18px */
    }

    .sFloorText {
        font-weight: 400;
        font-size: 12px;
        color: #fff;
        padding-left: 20px;  /* 36px */
    }

    .sDisaster{
        display: block;
        width: 100%;
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

    .arrowIconHydrogen{
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 10px;
    }

    .appliBtn {
        display: block !important;
        width: 48px;
        height: 18px;
        line-height: 18px;
        background: transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;
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
        background: url(${settings_bin_hover}) no-repeat center center;
        cursor: pointer;
    } 


    /* table 변경 */

    .sopLinkListArea {
        width: 100%;
        height: calc(100% - 123px);
        border-radius: 4px 4px 0 0;
        margin-top: 20px;

        & * {
            font-size: 14px;
        }

        .sopLinkList {
            height: 100%;

            &.sopLink {
                .head > div, 
                .body > ul > li > div > div{
    
                    &:nth-of-type(1) {
                        width: 4%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
    
                    &:nth-of-type(2) {
                        width: 22%;
                    }
                    
                    &:nth-of-type(3) {
                        width: 15%;
                    }
                    
                    &:nth-of-type(4) {
                        width: 15%;
                    }
                    
                    &:nth-of-type(5) {
                        width: 20%;
                    }
                    
                    &:nth-of-type(6) {
                        width: 20%;
                    }
    
                    &:nth-of-type(7) {
                        width: 4%;
                    }
                }
            }
        }

        .head {
            background: #2B2D2E;
            width: calc(100% - 4px);
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 4px 0 0 0;

            &::after {
                content: '';
                width: 4px;
                height: 32px;
                background-color: #2B2D2E;
                border-radius: 0 4px 0 0;
                position: absolute;
                right: 40px;
            }

            > div {
                height: 32px;
                line-height: 31px;
                text-align: center;
                font-size: 12px; 
                font-weight: 500;
                color: #fff;

                &:not(:last-child) {
                    border-right: 1px solid #131313;
                }

            }
        }

        .body {
            /* background: rgba(182, 198, 210, 0.07); */
            background: #232425;
            overflow-y: scroll;
            height: 224px;

            &::-webkit-scrollbar {
                width: 4px;
                background: #232425;
            }
            
            &::-webkit-scrollbar-thumb {
                background-color: #3C4143;
                border-radius: none;
            }

            &::-webkit-scrollbar-track {
                background: #232425;
            }

            &::-webkit-scrollbar-corner {
                display: none;
            }

            ul {

                li {
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #131313;

                    div:not(:last-child) {
                        border-right: 1px solid #131313;
                    }

                    div {
                        height: 32px;
                        padding: 5px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px; 
                        font-weight: 400;
                        color: #fff;

                        &:nth-of-type(1) {
                            width: 4%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
        
                        &:nth-of-type(2) {
                            width: 22%;
                        }
                        
                        &:nth-of-type(3) {
                            width: 15%;
                        }
                        
                        &:nth-of-type(4) {
                            width: 15%;
                        }
                        
                        &:nth-of-type(5) {
                            width: 20%;
                        }
                        
                        &:nth-of-type(6) {
                            width: 20%;
                        }
        
                        &:nth-of-type(7) {
                            width: 4%;
                        }
                    }
                }
            }
        }
    }
`;

