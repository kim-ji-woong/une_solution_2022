import styled from 'styled-components';

import close_icon from '../../Common/images/close_icon.png';
import setting_icon from '../images/setting_icon.png';
import tooltip_icon from '../images/tooltip_icon.png';
import select_arrow from '../images/select_arrow.png';
import combo_arrow from '../images/combo_arrow.png';
import binIcon from '../images/binIcon.png';
import toggle_plus from '../images/toggle_plus.png';
import toggle_minus from '../images/toggle_minus.png';
import arrow_white from '../images/arrow_white.png';
import arrow_select from '../images/arrow_select.png';
import double_arrow from '../images/double_arrow.png';
import editIcon from '../images/editIcon.png';


/**********************************************************************/
// 환경설정

export const LayoutSettingComponent = styled.div`
    width: 939px;
    height: 681px;
    background: ${(props) => props.theme.darkColor};
    position: absolute;
    left: 50%;
    top: 56%;
    transform: translate(-50%, -58%);
    padding-top: 3px;
    overflow: hidden;
    display: flex;

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-use-select: none;
    user-select: none;

    &::before {
        content: '';
        display: block;
        width: 100%;
        height: 3px;
        background: transparent linear-gradient(270deg, #FFFFFF12 0%, #20DFA8 100%) 0% 0% no-repeat padding-box;
        opacity: 0.65;
        position: absolute;
        top: 0;
        left: 0;
    }

    .closeBtn {
        display: block;
        width: 12px;
        height: 12px;
        background: url(${close_icon}) no-repeat center center;
        z-index: 1;
        cursor: pointer;
        position: absolute;
        top: 18px;
        right: 18px;
    }

    .menuWrap {
        width: 164px;
        height: 100%;
        background: #1a1f23;
        text-align: center;
        padding-top: 35px;

        h4 {
            font-size: 20px;
            font-weight: bold;
            color: ${(props) => props.theme.mainColor};
            ${(props) => props.theme.flex('center', 'center')};
            margin-bottom: 39.5px;

            &::before {
                content: '';
                display: inline-block;
                background: url(${setting_icon}) no-repeat center center;
                width: 24px;
                height: 24px;
                margin-right: 13.5px;
            }
        }

        ul {

            li {
                width: 100%;
                height: 44px;
                line-height: 44px;
                font-size: 16px;
                cursor: pointer;

                &:first-child {
                    border-bottom: 1px dashed #707070;
                }

                &.on {
                    background: rgba(255, 255, 255, .1) ;
                    color: ${(props) => props.theme.mainColor};
                }
            }
        }
    }

    .buttonWrap {
        ${(props) => props.theme.flex('center', 'center')};
        gap: 9px;
        width: calc(100% - 164px);
        position: absolute;
        bottom: 25px;
        right: 0;

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
                background-color: #1A1F23;
                color: ${(props) => props.theme.middleGray};
            }

            &.saveBtn {
                background-color: ${(props) => props.theme.mainColor};
                color: #202020;
            }
        }
    }

    nav {
        color: ${(props) => props.theme.middleGray};
        border-bottom: 1px solid rgba(165, 165, 165, .45);
        font-size: 14px;

        ul {
            ${(props) => props.theme.flex('flex-start', 'center')};
            gap: 16.5px;
            padding-left: 13px;

            li {
                padding: 6.5px 20px;
                border-bottom: 3px solid ${(props) => props.theme.middleGray};
                position: relative;
                top: 2px;
                cursor: pointer;

                &.on {
                    color: #fff;
                    border-bottom: 3px solid ${(props) => props.theme.mainColor};
                }
            }
        }
    }

    .listWrap {
        margin-top: 30px;
        font-size: 16px;

        .listItem {
            ${(props) => props.theme.flex('flex-start', 'center')};
            padding-left: 8.5px;
            height: 56px;
            border-bottom: 1px solid rgba(165, 165, 165, .25);

            &:last-child {
                border-bottom: 0;
            }

            input[type="text"]:disabled,
            select:disabled {
                cursor: default;
            }
        }

        .shortcut {
            margin-top: 20px;
            padding-left: 8.5px;

            & > div {
                ${(props) => props.theme.flex('flex-start', 'center')};
                margin-bottom: 28px;
            }

            & > ul {
                width: 100%;
                ${(props) => props.theme.flex('flex-start', 'center')};
                gap: 40px;
                margin-bottom: 16px;
                
                li {
                    width: 35%;
                    ${(props) => props.theme.flex()};
                    gap: 20px;

                    span {
                        font-size: 14px;
                    }
    
                    div {
                        span {
                            margin-right: 10px;
                            font-size: 14px;
                        }

                        .settingInput {
                            width: 46px;
                            font-size: 12px;
                        }
                    }
                }
            }
        }

        .sensorItem {
            padding: 20px 0;
            padding-left: 8.5px;
            border-bottom: 1px solid rgba(165, 165, 165, .25);

            &:last-child {
                border-bottom: 0;
            }

            & > div {
                ${(props) => props.theme.flex('flex-start', 'center')};
                margin-bottom: 18px;
            }

            & > ul {
                ${(props) => props.theme.flex('flex-start', 'center')};
                gap: 25px;
                
                span {
                    font-size: 14px;
                    margin-left: 0;
                }
    
                .settingCheckBox {
                    margin-left: 5px;
                }
            }

        }

        .spreadContent {
            ${(props) => props.theme.flex('space-between', 'flex-start')};
            gap: 7.5px;
            padding: 12px 0 0 8.5px;
        }

        .spreadItem {
            padding: 20px 0 12.5px 8.5px;
            border-bottom: 1px solid rgba(165, 165, 165, .25);
            ${(props) => props.theme.flex('flex-start', 'center')};
        }

        .spreadSelectWrap {
            display: flex;
            flex-direction: column;
            gap: 5px;

            select, button {
                width: 146px;
                height: 30px;
                background: url(${select_arrow}) no-repeat 94% center, #1A1F23;
                border-radius: 3px;
                border: 0;
                font-size: 14px;
                color: #fff;
                padding-left: 8.5px;
                cursor: pointer;
            }

            button {
                text-align: left;
                background: #1A1F23;
            }
        }

        .toolTip {
            display: inline-block;
            vertical-align: middle;
            width: 17px;
            height: 17px;
            text-align: center;
            line-height: 14px;
            color: #fff;
            font-size: 10px;
            margin-left: 5px;
            margin-right: 18px;
            border: solid 1px #ddd;
            cursor: help;
            position: relative;
            background: url(${tooltip_icon}) no-repeat center center;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
        }

        [data-tooltip] {
            position: relative;
            z-index: 2;
        }

        [data-tooltip]:before,
        [data-tooltip]:after {
            visibility: hidden;
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
            transform: translate(-50%, 0);
            padding: 4px 10px;
            white-space: nowrap;
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            border-radius: 3px;
            background-color: ${(props) => props.theme.mainColor};
            color: #000;
            font-family: "dotum", sans-serif;
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
            border-top: 5px solid ${(props) => props.theme.mainColor};
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

        .settingInput {
            width: 69px;
            height: 27px;
            background: #1A1F23;
            border-radius: 3px;
            color: #fff;
            font-size: 14px;
            text-align: center;
            margin-right: 10.5px;
        }

        .inputText {
            font-size: 14px;
            
            &.gray {
                color: #CCCCCC;
            }
        }

        .settingCheckBox {
            font-size: 14px;
            margin-left: 24px;
            margin-right: 8.5px;
        }

        .settingButton {
            height: 27px;
            font-size: 14px;
            color: #CCCCCC;
            padding: 5px 15px;
            border-radius: 3px;
            background: #1A1F23;
            margin-right: 10px;

            &:hover {
                background: ${(props) => props.theme.mainColor};
                color: #3B4248;
                font-weight: bold;
            }
        }
    }

    .loading {
        padding: 30px;
    }
`;


export const Monitoring3DComponent = styled.section`
    width: 775px;
    height: 100%;
    padding: 35px 49px 60px 18px;

    .stgmCen {
        width: 100%;
    }

    .stgmCont {
        background: #1A1F23;
        overflow: hidden;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
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
        line-height: 38px;
        text-align: center;
        cursor: pointer;
        font-size: 14px;
        color: #fff;
        background: #313639;
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

    .stgmDtl {
        padding: 10px;
        font-size: 12px;
        display: none;
    }

    .stgmTxt {
        border: 0;
        display: block;
        width: 100%;
        resize: none;
        height: 176px;
        padding: 10px !important;
        font-family: "dotum", sans-serif;
        font-size: 12px;
        background: rgba(255, 255, 255, .1);
        color: #fff;
        font-size: 13px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        cursor: text;
        border-radius: 2px;
        -moz-border-radius: 2px;
        -webkit-border-radius: 2px;
    }

    .stgmTxt textarea {
        padding: 0;
        background: none;
    }

    .stgmTxt .scroll-bar {
        background: rgba(255, 255, 255, 0.5) !important;
    }

    .stgmTo {
        position: relative;
        padding-left: 52px;

        &:nth-child(2) {
            margin-top: 10px;
        }
    }

    .stgmTo span {
        display: block;
        color: #fff;
        height: 16px;
        line-height: 16px;
        position: absolute;
        left: 0;
        top: 3px;
        font-size: 14px;
    }

    .stgmTo p {
        display: block;
        width: 100%;
        height: 22px;
        line-height: 22px;
        padding: 0 10px;
        font-family: 'pretendard';
        font-size: 14px;
        background: #313639;
        border: 0;
        -webkit-border-radius: 2px;
        -moz-border-radius: 2px;
        border-radius: 2%;
        color: #fff;
    }

    .hidden {
        display: none;
    }

    .spreadRight {

        .description {
            width: 184px;
            height: 133px;
            background: #1A1F23;
            border-radius: 3px;
            padding: 7.5px 10px;
            margin-bottom: 10px;

            h5 {
                font-size: 12px;
                font-weight: bold;
                margin-bottom: 9px;
            }

            li {
                font-size: 12px;
                margin-bottom: 5px;
            }
        }

        button {
            width: 184px;
            height: 27px;
            background: #1A1F23;
            border: 0.5px solid ${(props) => props.theme.mainColor};
            border-radius: 4px;
            font-size: 12px;

            &:nth-child(2) {
                color: #fff;
                margin-bottom: 10px;
            }

            &:nth-child(3) {
                color: ${(props) => props.theme.mainColor};
            }
        }
    }
`;


export const SopSetComponent = styled.section`
    width: 775px;
    height: 100%;
    padding: 35px 49px 60px 18px;

    .sopSet {
        margin-top: 18px;

        &:first-child {
            margin-top: 40px;
        }

        padding-bottom: 18px;
        height: auto !important;
        align-items: flex-start !important;

        &:nth-child(1) > div {
            width: 50%;
        }

        & > div > div {
            ${(props) => props.theme.flex('flex-start', 'center')};
            margin-bottom: 18px;

            h5 {
                font-weight: bold;
            }

            button {
                width: 73px;
                height: 27px;
                background: #1A1F23;
                border: 0.5px solid ${(props) => props.theme.mainColor};
                border-radius: 4px;
                color: ${(props) => props.theme.mainColor};
                font-size: 12px;
            }
        }

        ul li:not(:last-child){ 
            margin-bottom: 14px;
        }

        .settingCheckBox {
            margin-left: 0;
        }

        .timeSetting {
            ${(props) => props.theme.flex('flex-start', 'flex-start')};

            > div {
                position: relative;
                top: -5px;
            }

            > div > div {
                margin-bottom: 16px;
            }
            
            .inputText {
                margin-right: 0;
            }
        }

        .combo {
            width: 61px;
            height: 27px;
            line-height: 27px;
            background: url(${combo_arrow}) no-repeat 89% center, #1A1F23;
            border: 0;
            border-radius: 3px;
            padding-left: 9px;
            font-size: 12px;
            color: #fff;
            margin: 0 12px;
            cursor: pointer;
        }

        .combo.long {
            width: 151px;
            background: url(${combo_arrow}) no-repeat 95% center, #1A1F23;
        }

        .settingInput {
            width: 61px;
            height: 27px;
            font-size: 12px;
        }

        .inputText {
            margin-right: 22px;
        }

        .autoShutdown {
            margin-bottom: 0;

            .combo {
                margin: 0 5px 0 0;
            }

            .combo.long {
                margin: 0 5px 0 12px;
            }
            
            .settingInput {
                margin: 0 5px 0 0;
            }
            
            .inputText.gray {
                margin: 0 10px 0 5px;
            }
        }
    }
`;


/**********************************************************************/
// SOP 환경 - 고급

export const SopLinkComponent = styled.section`
    width: 775px;
    height: 100%;
    padding: 35px 49px 60px 3px;

    .listWrap {
        ${(props) => props.theme.flex('flex-start', 'center')};
        margin-top: 0;
        margin-bottom: 15px;

        h5 {
            font-weight: bold;
        }
    }

    .stgList .stgName:last-child {
        margin-bottom: 0;
    }

    .stgList .white {
        font-size: 16px;
        vertical-align: middle;
    }

    .sopTreeArea {
        display: flex;
        width: 100%;
        height: 240px;
        margin-bottom: 5px;
    }

    .sopLocationBox {
        display: block;
        width: 210px;
        background: #1A1F23;
        margin-right: 10px;
        border-radius: 4px;
    }

    .sopDisableText {
        display: flex;
        height: 23px;
        line-height: 23px;
        background: ${(props) => props.theme.mainColor};
        color: #808080;
        font-weight: 400;
        font-size: 14px;
        padding-left: 10px;
        border-radius: 4px 4px 0 0;
    }

    .sopActiveText,
    .sopActiveText span {
        color: #1A1F23;
        font-size: 12px;
        font-weight: bold;

        span {
            margin-left: 4px;
        }
    }

    .sopLTree {
        display: block;
        overflow-y: auto;
    }

    .sopScroll {
        height: calc(100% - 25px);
        overflow-x: hidden;
        overflow-y: auto;

        &::-webkit-scrollbar {
            width: 14px;
            background: #1A1F23;
            border-radius: 10px;
            border: 5px solid #1A1F23;
        }
        
        &::-webkit-scrollbar-thumb {
            background-color: #22CF9F;
            border-radius: 15px; 
            border: 5px solid #1A1F23;
        }

        &::-webkit-scrollbar-track {
            background-color: rgba(0,0,0,0);
        }
    }

    .sopTypeBox {
        display: block;
        width: 120px;
        background: #1A1F23;
        margin-right: 10px;
        border-radius: 4px;
    }

    .sensorTypeTab {

        .treeSelect {
            ${(props) => props.theme.flex()};

            a {
                color: ${(props) => props.theme.mainColor};
                ${(props) => props.theme.overText()};
            }

            &::after {
                content: '';
                display: inline-block;
                width: 13px;
                height: 13px;
                background: url(${double_arrow}) no-repeat center center;
            }
        }
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
        font-size: 12px;
        color: #fff;
    }

    .sensorTypeTab li:hover {
        background: rgba(112, 112, 112, .1);
        color: #fff;
        cursor: pointer;
    }

    .sopListBox {
        display: block;
        width: 356px;
        background: #1A1F23;
        margin-right: 10px;
        border-radius: 4px;

        .sFactoryText {
            position: relative;
            top: 2px;

            .toggleIcon {
                display: inline-block;
                width: 30px;
                height: 30px;
                background: url(${toggle_plus}) no-repeat center center;
            }
        }

        h5 { 
            height: 30px;
        }
    }

    .sopDisableTextF {
        display: flex;
        height: 23px;
        line-height: 23px;
        background: ${(props) => props.theme.mainColor};
        color: #1A1F23;
        font-weight: bold;
        font-size: 12px;
        padding-left: 10px;
        border-radius: 4px 4px 0 0;
    }

    .sopListFlex {
        flex: 1;
        color: #1A1F23;
        font-size: 12px;
        font-weight: bold;
    }

    .editIcon {
        display: inline-block;
        width: 12px;
        height: 23px;
        background: url(${editIcon}) no-repeat center center;
        margin-right: 14px;
        cursor: pointer;
    }

    .editIconAct {
        display: inline-block;
        width: 31px;
        height: 31px;
    }

    .sopTableArea {
        display: block;
        width: 706px;
        background-color: #1A1F23;
        border-radius: 4px 4px 0 0;
        margin-top: 10px;
    }

    .sopTableAreaBody {
        display: block;
        width: 706px;
        background-color: #1A1F23;
        border-radius: 0 0 4px 4px;
        overflow-y: auto;
        height: 190px;

        &::-webkit-scrollbar {
            width: 14px;
            background: #1A1F23;
            border-radius: 10px;
            border: 5px solid #1A1F23;
        }
        
        &::-webkit-scrollbar-thumb {
            background-color: #22CF9F;
            border-radius: 15px; 
            border: 5px solid #1A1F23;
        }

        &::-webkit-scrollbar-track {
            background-color: rgba(0,0,0,0);
        }
    }

    .sopTableArea .sopThead,
    .sopTableAreaBody .sopTbody {
        display: table;
        width: 100%;
    }

    .sopTableArea .sopThead thead {
        color: ${(props) => props.theme.mainColor};
        font-weight: bold;
        font-size: 12px;
        text-align: center;
        background: #32363A;
        height: 26px;
    }

    .sopTableArea .sopThead thead th:first-child {
        border-radius: 4px 0 0 0;
    }

    .sopTableArea .sopThead thead th:last-child {
        border-radius: 0 4px 0 0;
    }

    .sopTableArea .sopThead thead tr {
        max-height: 30px;
        border-radius: 4px 4px 0 0;
    }

    .sopTableArea .sopThead thead tr th {
        height: 30px;
        text-align: center;
        vertical-align: middle;
        font-weight: bold;
    }

    .sopTableArea .sopThead thead tr th,
    .sopTableAreaBody .sopTbody tbody tr td {
        max-height: 30px;

        &:nth-of-type(1) {
            width: 10%;
        }

        &:nth-of-type(2) {
            width: 20%;
        }

        &:nth-of-type(3) {
            width: 15%;
        }

        &:nth-of-type(4) {
            width: 45%;
        }

        &:nth-of-type(5) {
            width: 10%;
        }
    }

    .sopTableAreaBody .sopTbody tbody tr {
        height: 38px;
        width: 706px;

        &:not(:last-child) {
            border-bottom: 1px dashed #525868;
        }
    }

    .sopTableAreaBody .sopTbody tbody tr td {
        color: #fff;
        font-weight: 400;
        font-size: 14px;
        text-align: center;
        vertical-align: middle;
    }

    .sopTree {
        height: 18px;
        line-height: 18px;
        font-size: 12px;
        color: #fff;
    }

    .sopTree h5 {
        font-size: 12px;

        &.on {

            .sFactoryText {
                color: ${(props) => props.theme.mainColor};
            }
            
            .toggleIcon {
                display: inline-block;
                width: 30px;
                height: 30px;
                background: url(${toggle_minus}) no-repeat center center;
            }
        }
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
        background: rgba(112, 112, 112, .1);
    }

    .sopTree ul {
        display: none;
        text-align: left;
        color: #fff;

        &.on {
            display: block;
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
        display: inline-flex;
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
        font-size: 12px;
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

        .toggleIcon {
            display: inline-block;
            width: 30px;
            height: 30px;
            background: url(${toggle_plus}) no-repeat center center;
        }
    }

    .treeSelect.on {
        p {
            color: ${(props) => props.theme.mainColor};
        }

        .toggleIcon {
            display: inline-block;
            width: 30px;
            height: 30px;
            background: url(${toggle_minus}) no-repeat center center;
        }

        .arrowIcon {
            background: url(${arrow_select}) no-repeat center center;
        }
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
    }

    .sFloorText {
        font-weight: 400;
        font-size: 12px;
        color: #fff;
        padding-left: 14px;
        ${(props) => props.theme.overText()};
    }


    .arrowIcon {
        display: inline-block;
        width: 16px;
        height: 30px;
        background: url(${arrow_white}) no-repeat center center;
    }

    .arrowIcon.on {
        display: inline-block;
        width: 30px;
        height: 30px;
        transform: rotate(90deg);
    }

    .appliBtn {
        display: block !important;
        width: 37px;
        height: 16px;
        line-height: 16px;
        background: ${(props) => props.theme.mainColor};
        border-radius: 16px;
        text-align: center;
        margin-left: 8px;
        font-size: 10px !important;
        font-weight: bold;
        color : ${(props) => props.theme.backgroundColor};
    }

    .binIcon {
        display: inline-block;
        width: 16px;
        height: 18px;
        cursor: pointer;
        background: url(${binIcon}) no-repeat center center;
    }

    .binIcon:hover {
        display: inline-block;
        width: 16px;
        height: 18px;
        cursor: pointer;
    }

    .buildingText {
        height: 30px;
        line-height: 30px;
    }
`;