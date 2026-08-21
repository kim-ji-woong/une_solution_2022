import styled, { keyframes , css } from "styled-components";

import close_icon from '../images/close_icon.svg';
import lineLeft from '../images/lineLeft.svg';
import lineRight from '../images/lineRight.svg';
import contentBoxEl from '../images/contentBoxEl.svg';
import contentBoxEl_red from '../images/contentBoxEl_red.svg';
import poi_zoneName from '../images/poi_zoneName.svg';
import poi_atmosphere from '../images/poi_atmosphere.svg';
import poi_reductionEquipment from '../images/poi_reductionEquipment.svg';
import poi_emissionFacilities from '../images/poi_emissionFacilities.svg';
import poi_weather from '../images/poi_weather.svg';
import poi_cctv from '../images/poi_cctv.svg';
import building_icon from '../images/building_icon.svg';
import treeArrow from '../images/treeArrow.svg';
import resize_icon from '../images/resize_icon.svg';
import receiver_icon from '../images/receiver_icon.svg';
import member_check_on from '../images/member_check_on.svg';
import member_check_off from '../images/member_check_off.svg';
import rangeFinding from '../images/rangeFinding.svg';
import keyMap from '../images/keyMap.svg';
import keyMap_plus from '../images/keyMap_plus.svg';
import initialSituation from '../images/initialSituation.svg';
import soundOff from '../images/soundOff.svg';
import soundOn from '../images/soundOn.svg';
import shutdown from '../images/shutdown.svg';
import nav_statusInfo from '../images/nav_statusInfo.svg';
import nav_event from '../images/nav_event.svg';
import nav_event_disable from '../images/nav_event_disable.svg';
import nav_event_on_alarm from '../images/nav_event_on_alarm.svg';
import nav_event_on_none from '../images/nav_event_on_none.svg';
import nav_event_off_alarm from '../images/nav_event_off_alarm.svg';
import nav_event_off_none from '../images/nav_event_off_none.svg';
import nav_miniMap from '../images/nav_miniMap.svg';
import nav_simulation from '../images/nav_simulation.svg';
import nav_line from '../images/nav_line.svg';


import searchIcon from '../../Account/images/searchIcon.svg';
import popup_background from '../../Settings/images/popup_background.png';
import sortIcon from '../../Settings/images/sortIcon.svg';


// 이벤트 대시보드 hide animation
const fadeOut = keyframes`
    0% {
        top: 60px;
        opacity: 1;
        display: block;
    }
    100% {
        top: 10px;
        opacity: 0;
        display: none;
    }
`

const lightAnimate = keyframes`
    0%{
        box-shadow: 0 -5px 7px 0 rgb(211,47,47,0.1), 0 5px 7px 0 rgb(211,47,47,0.1);
        box-shadow: -3px 0 7px 0 rgb(211,47,47,0.1), 5px 0 7px 0 rgb(211,47,47,0.1);
    }
    100%{
        box-shadow: 0 -5px 7px 0 rgb(211,47,47,0.3), 0 5px 7px 0 rgb(211,47,47,0.3);
        box-shadow: -3px 0 7px 0 rgb(211,47,47,0.3), 5px 0 7px 0 rgb(211,47,47,0.3);
    }
`

const lightAnimateTop = keyframes`
    0%{
        box-shadow: 4px -5px 7px 0 rgb(211,47,47,0.1);
    }
    100%{
        box-shadow: 4px -5px 7px 0 rgb(211,47,47,0.3);
    }
`

const lightAnimateBottom = keyframes`
    0%{
        box-shadow: -5px 6px 7px 0 rgb(211,47,47,0.1);
    }
    100%{
        box-shadow: -5px 6px 7px 0 rgb(211,47,47,0.3);
    }
`

// 이벤트 현황 팝업 slide animation
const slideDown = keyframes`
    0% {
        height: 0;
        display: none;
    }
    100% {
        height: 32.53px;
        display: block;
    }
`

const slideUp = keyframes`
    0% {
        height: 32.53px;
        display: block;
    }
    100% {
        height: 0;
        display: none;
    }
`

//대기센서창 
const chartAnimateBest = keyframes`
    0% {
        width: 0px;
    }
    50% {
        width: 100%;
    }
    100% {
        width: 25%;
    }
`;


const chartAnimateNormal = keyframes`
    0% {
        width: 0px;
    }
    50% {
        width: 100%;
    }
    100% {
        width: 50%;
    }
`;

const chartAnimateBad = keyframes`
    0% {
        width: 0px;
    }
    50% {
        width: 100px;
    }
    100% {
        width: 50;
    }
`;

const chartAnimateVeryBad = keyframes`
    0% {
        width: 0px;
    }
    100% {
        width: 100%;
    }
`;


/**********************************************************************/
// SDMS POPUPS 공통 CSS

export const PopupsCommon = styled.div`
    background: ${(props) => props.theme.background};
    position: relative;
    cursor: default;
    opacity: ${props => props.$opacity};
    ${(props) => props.theme.userSelect()};

    &::before {
        ${props => {
            if (props.$resize)
                return `
                    content: '';
                    display: block;
                    width: 12px;
                    height: 12px;
                    position: absolute;
                    right: 5px;
                    bottom: 5px;
                    background: url(${resize_icon}) no-repeat center center;
                `
        }}
    }

    .dslTop {
        position: relative;
        ${(props) => props.theme.flex()};
        padding: 15px 15px 0 15px;

        &::before {
            content: '';
            display: block;
            position: absolute;
            top: 39px;
            left: 15px;
            width: 56px;
            height: 2px;
            background: url(${lineLeft}) no-repeat center center;
            z-index: 2;
        }

        &::after {
            content: '';
            display: block;
            position: absolute;
            top: 39px;
            left: 15px;
            right: 15px;
            width: auto;
            height: 2px;
            background: url(${lineRight}) no-repeat center center;
            background-size: 100%;
        }

        .dslTitle {
            font-size: 14px;
            font-weight: 700;
            color: ${(props) => props.theme.primary};
        }

        input[type=range] {
            width: 50px;
            height: 3px;
            background-color: ${(props) => props.theme.primary};
            cursor: pointer; 
            -webkit-appearance: none;
            position: absolute;
            right: 50px;
            z-index: 1;
        }

        input[type=range]:focus {
            outline: none;
        }

        input[type=range]::-webkit-slider-thumb { 
            -webkit-appearance: none;
            background: ${(props) => props.theme.primary};
            cursor: pointer;
            height: 8px; 
            width: 2px;   
        }

        .dslX {
            width: 14px;
            height: 14px;
            text-indent: -9999px;
            background: url(${close_icon}) no-repeat center center;
            z-index: 1;
            cursor: pointer;
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        margin-top: 12px;
        padding: 15px;
        height: calc(100% - 42px);

        &, & * {
            font-size: 12px;
        }

        .contentBox {
            position: relative;
            padding: 15px;
            border: 1px solid rgba(56, 67, 85, 0.05);
            background: rgba(6, 9, 13, 0.80);
            box-shadow: 0px 0px 3px 0px #0095FF inset;

            &::before {
                content: '';
                display: block;
                position: absolute;
                top: -1px;
                left: -1px;
                width: 8px;
                height: 8px;
                background: url(${contentBoxEl}) no-repeat center center;
            }

            &::after {
                content: '';
                display: block;
                position: absolute;
                top: -1px;
                right: -1px;
                width: 8px;
                height: 8px;
                background: url(${contentBoxEl}) no-repeat center center;
                transform: rotate(90deg);
            }

            .contentName {
                width: calc(100% - 30px);
                font-weight: 700;
                ${(props) => props.theme.overText()};

                &::before {
                    content: '';
                    display: block;
                    position: absolute;
                    bottom: -1px;
                    left: -1px;
                    width: 8px;
                    height: 8px;
                    background: url(${contentBoxEl}) no-repeat center center;
                    transform: rotate(270deg);
                }

                &::after {
                    content: '';
                    display: block;
                    position: absolute;
                    bottom: -1px;
                    right: -1px;
                    width: 8px;
                    height: 8px;
                    background: url(${contentBoxEl}) no-repeat center center;
                    transform: rotate(180deg);
                }
            }
        }
    }

    #tooltip {
        margin-left: 5px;
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
        bottom: 130%;
        left: -50%;
        margin-bottom: 4px;
        padding: 5px 10px;
        white-space: nowrap;
        border-radius: 3px;
        background-color: ${(props) => props.theme.fontPrimary};
        color: #424242;
        font-size: 12px;
        font-weight: 500;
        content: attr(data-tooltip);
        text-align: center;
        line-height: 1.2;
    }

    [data-tooltip]:after {
        content: " ";
        position: absolute;
        bottom: 130%;
        left: 50%;
        margin-left: -5px;
        width: 0;
        border-top: 5px solid ${(props) => props.theme.fontPrimary};
        border-right: 5px solid transparent;
        border-left: 5px solid transparent;
    }
    
    [data-tooltip]:hover:before,
    [data-tooltip]:hover:after {
        visibility: visible;
        opacity: 1;
    }

    .scrollbar {
        overflow-x: hidden;
        overflow-y: auto !important;
        ${(props) => props.theme.scroll()};
    }

`;


/**********************************************************************/
// 센서현황

export const StatusInfoComponent = styled(PopupsCommon)`
    position: absolute;

    .contentBox {
        
        &.flex {
            ${(props) => props.theme.flex()};
            margin-bottom: 10px;
        }

        &.sensor {
            height: calc(100% - 65px);
            padding: 15px 5px 15px 15px;
        }

        .poiWrap {
            ${(props) => props.theme.flex('flex-start', 'center')};
        }

        > ul {
            ${(props) => props.theme.flex()};
            gap: 5px;

            > li > label {
                display: block;
                position: relative;
                cursor: pointer;

                input[type="checkbox"] {
                    display: none;
                } 

                &:hover::after {
                    content:attr(data-title); 
                    position: absolute; 
                    white-space: nowrap;
                    line-height: 10px;
                    top: 32px;
                    left: 50%; 
                    transform: translate(-50%, 0);
                    padding: 7px 10px;
                    background: #fff; 
                    border-radius: 2px;
                    font-size: 12px; 
                    font-weight: 500;
                    color: #424242;
                    text-align: center; 
                    z-index: 100;
                }

                &:hover::before {
                    content: " ";
                    position: absolute;
                    border-right: 5px solid transparent;
                    border-left: 5px solid transparent;
                    border-bottom: 5px solid #fff;
                    top: 28px;
                    left: 50%; 
                    transform: translate(-50%, 0);
                }
            }
        }

        .visibleAtmosphere,
        .disableAtmosphere {
            background: url(${poi_atmosphere}) no-repeat center center;
            width: 24px;
            height: 24px;
            border-radius: 2px;
        }

        .visibleReductionEquipment,
        .disableReductionEquipment {
            background: url(${poi_reductionEquipment}) no-repeat center center;
            width: 24px;
            height: 24px;
            border-radius: 2px;
        }

        .visibleEmissionFacilities,
        .disableEmissionFacilities {
            background: url(${poi_emissionFacilities}) no-repeat center center;
            width: 24px;
            height: 24px;
            border-radius: 2px;
        }

        .visibleWeather,
        .disableWeather {
            background: url(${poi_weather}) no-repeat center center;
            width: 24px;
            height: 24px;
            border-radius: 2px;
        }

        .visibleCCTV,
        .disableCCTV {
            background: url(${poi_cctv}) no-repeat center center;
            width: 24px;
            height: 24px;
            border-radius: 2px;
        }

        .visibleZoneName,
        .disableZoneName {
            background: url(${poi_zoneName}) no-repeat center center;
            width: 24px;
            height: 24px;
            border-radius: 2px;
        }

        .visibleAtmosphere,
        .visibleReductionEquipment,
        .visibleEmissionFacilities,
        .visibleWeather,
        .visibleCCTV,
        .visibleZoneName {
            background-color: ${(props) => props.theme.primary};
        }

        .disableAtmosphere,
        .disableReductionEquipment,
        .disableEmissionFacilities,
        .disableWeather,
        .disableCCTV,
        .disableZoneName {
            background-color: #7C8DA9;
        }
    }

    .searchWrap {
        height: 30px;
        position: relative;
        padding-right: 30px;
        margin: 10px 10px 10px 0;

        input {
            height: 30px !important;
            background: none;
            color: #fff;
            font-size: 12px;
            border-radius: 2px 0 0 2px;
            border: 1px solid ${(props) => props.theme.primary};
            border-right: 0;
            padding: 0 10px;
        }

        button {
            display: block;
            width: 30px;
            height: 30px;
            position: absolute;
            right: 0;
            top: 0;
            text-indent: -9999px;
            background: ${(props) => props.theme.primary} url(${searchIcon}) no-repeat center center;
            border-radius: 0 2px 2px 0;
            border: 1px solid ${(props) => props.theme.primary};
        }
    }

    .treeWrap {
        margin-top: 5px;
        height: calc(100% - 50px);
        margin-bottom: 5px;
    }

    .tree {
        height: 100%;
        padding-right: 5px;

        li {
            cursor: pointer;
        }

        > li {
            padding: 9px 0;
            border-top: 1px solid #384355;
        }

        .building {
            font-size: 14px;
            ${(props) => props.theme.flex()};

            p {
                ${(props) => props.theme.flex('flex-start', 'center')};
                color: #7C8DA9;
                gap: 6px;
                font-size: 14px;
                font-weight: 700;

                &::before {
                    content: '';
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    background: url(${building_icon}) no-repeat center center;
                }
            }

            button {
                padding: 5px;
                background-color: #7C8DA9;
                color: ${(props) => props.theme.background};
                font-size: 10px;
                font-weight: 500;
                border-radius: 2px;
            }

            &.on {
                p {
                    color: ${(props) => props.theme.primary};

                    &::before {
                        filter: invert(42%) sepia(82%) saturate(2612%) hue-rotate(184deg) brightness(100%) contrast(108%);
                    }
                }

                button {
                    background-color: ${(props) => props.theme.primary};
                }
            }
        }
    }

    .tree-1depth {
        display: none;
        margin-top: 9px;

        > li {
            border-top: 1px dashed #384355;

            > div {
                ${(props) => props.theme.flex()};
                padding: 8px;

                > p {
                    ${(props) => props.theme.flex()};
                    font-weight: 500;

                    &:first-child::before {
                        content: '';
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        background: url(${treeArrow}) no-repeat center center;
                        transition: transform .35s;
                    }
                }

                &.on {
                    p:first-child::before {
                        transform: rotate(90deg);
                        transition: transform .35s;
                    }
                }
            }
        }
        
        &.on {
            display: block;
        }
    }

    .tree-2depth {
        display: none;
        padding: 10px 0;
        background: rgba(255, 255, 255, 0.05);
        flex-direction: column;
        gap: 12px;

        > li {
            ${(props) => props.theme.flex()};
            padding-right: 9px;
            
            > p {
                ${(props) => props.theme.flex()};
                margin-left: 29px;

                &::before {
                    content: '';
                    display: inline-block;
                    width: 2px;
                    height: 2px;
                    margin-right: 5px;
                    background-color: #D9D9D9;
                }
            }

            &.on {

                p {
                    color: ${(props) => props.theme.primary};

                    &::before {
                        background-color: ${(props) => props.theme.primary};
                    }
                }
            }

            &#alarmOn {
                p {
                    color: ${(props) => props.theme.warning};

                    &::before {
                        background-color: ${(props) => props.theme.warning};
                    }
                }
            }

            &#off {
                p {
                    color: #7C8DA9;

                    &::before {
                        background-color:#7C8DA9;
                    }
                }
            }
        }

        &.on {
            display: flex;
        }
    }
`;


/**********************************************************************/
// 기상센서 상세정보

export const WeatherInfoComponent = styled(PopupsCommon)`
    position: absolute;

    .contentBox {
        /* overflow: hidden; */

        &.current {
            min-height: 197px;
        }

        &.chart {
            margin-top: 10px;
            padding: 0;
            height: calc(100% - 65px);

            .contentName {
                text-indent: -9999px;
            }
        }

        .currentWrap {

            > div {
                display: flex;
                align-items: center;
                flex-direction: column;

                img {
                    width: 58px;
                    margin-top: 21px;
                }

                p {
                    font-size: 20px;
                    font-weight: 700;
                    margin-top: 10px;

                    &.on {
                        color: ${(props) => props.theme.primary};
                    }
                }
            }

            > ul {
                ${(props) => props.theme.flex()};
                margin-top: 15px;

                li {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    gap: 10px;

                    button {
                        padding: 7px 19px;
                        background-color: rgba(255, 255, 255, 0.05);
                        font-size: 10px;
                    }

                    &.on {

                        button {
                            background-color: ${(props) => props.theme.primary};
                            color: #000000;
                        }

                        p {
                            color: ${(props) => props.theme.primary};
                        }
                    }
                }
            }
        }

        .bearingWrap {
            ${(props) => props.theme.flex()};
            padding: 10px 10px 15px 10px;

            li {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
                padding: 5px 10px;

                &:not(:last-child) {
                    border-right: 1px solid rgba(255, 255, 255, 0.10);
                }
            }
        }

        .chartArea {
            padding-right: 5px;
        }
    }
`;


/**********************************************************************/
// 미니맵

export const MiniMapComponent = styled(PopupsCommon)`
    position: absolute;

    .content {
        
        > div {
            position: relative;
            width: 100%;
            height: 100%;

            img {
                width: 270px;
                height: 180px;
                position: relative;
                top: 2px;
            }

            .miniMode{
                mix-blend-mode: luminosity;
            }
    
            .position {
                display: ${props => props.$showPosition ? 'block' : 'none'};
                width: 14px;
                height: 14px;
                position: absolute;
            }
    
            .alarm {
                display: ${props => props.$showAlarm ? 'block' : 'none'};
                width: 14px;
                height: 14px;
                position: absolute;
            }
        }

    }
`;


/**********************************************************************/
// CCTV 영상정보

export const CCTVInfoComponent = styled(PopupsCommon)`
    position: absolute;

    .hidden {
        display: none;
    }

    .viewDashboardCCTVConts {
        height: calc(100% - 6px);
    }

    .viewDashboardCCTVGrid {
        width: 100%;
        height: 100%;
        display: grid;
        padding-right: 5px;
        grid-gap: 5px;
        grid-template-rows: 50% 50%;
        grid-template-columns: 50% 50%;

        > div {
            position: relative;
            background: #06090D;
            box-shadow: 0px 0px 3px 0px #0095FF inset;

            &::before {
                content: '';
                display: block;
                position: absolute;
                top: -1px;
                left: -1px;
                width: 8px;
                height: 8px;
                background: url(${contentBoxEl}) no-repeat center center;
            }

            &::after {
                content: '';
                display: block;
                position: absolute;
                top: -1px;
                right: -1px;
                width: 8px;
                height: 8px;
                background: url(${contentBoxEl}) no-repeat center center;
                transform: rotate(90deg);
            }

            > div {

                &::before {
                    content: '';
                    display: block;
                    position: absolute;
                    bottom: -1px;
                    left: -1px;
                    width: 8px;
                    height: 8px;
                    background: url(${contentBoxEl}) no-repeat center center;
                    transform: rotate(270deg);
                }

                &::after {
                    content: '';
                    display: block;
                    position: absolute;
                    bottom: -1px;
                    right: -1px;
                    width: 8px;
                    height: 8px;
                    background: url(${contentBoxEl}) no-repeat center center;
                    transform: rotate(180deg);
                }
            }
        }

        div span p {
            font-size: 10px;
            margin-bottom: 3px;
        }

        div span iframe,
        .cctv_none {
            width: 100% !important;
            height: 100% !important;
        }

        .cctv_none {
            ${(props) => props.theme.flex()};
            background: #161616;
            margin-top: 10px;

            img {
                object-fit: contain;
                width: 44px;
                height: 37px;
                margin: 0 auto;
            }
        }

        div span.on {
            p {
                color: ${(props) => props.theme.yellowColor};
            }

            iframe {
                border: 1px solid ${(props) => props.theme.yellowColor};
            }
        }

        .titleWrap {
            ${(props) => props.theme.flex()};
            width: 100%;
            padding: 5px 10px;
            background: rgba(255, 255, 255, 0.05);

            &.selected {

                p {
                    color: ${(props) => props.theme.primary};
                }

                img {
                    filter: invert(42%) sepia(82%) saturate(2612%) hue-rotate(184deg) brightness(100%) contrast(108%);
                }
            }
        }
    }

    .viewDashboardCCTVGrid .col1row1 {
        grid-column: 1;
        grid-row: 1;
        position: relative;
    }

    .viewDashboardCCTVGrid .col1row1.full {
        width: calc(200% + 5px);
        height: calc(200% + 5px);
    }

    .viewDashboardCCTVGrid .col1row1.hidden {
        display: none;
    }

    .viewDashboardCCTVGrid .col1row1 span {
        color: white;
        width: 100%;
    }
    .viewDashboardCCTVGrid .col1row1 span p {
        max-height: 19px;
        overflow: hidden;
    }

    .viewDashboardCCTVGrid .col2row1 {
        grid-column: 2;
        grid-row: 1;
        position: relative;
    }

    .viewDashboardCCTVGrid .col2row1.full {
        grid-column: 1;
        grid-row: 1;
        width: calc(200% + 10px);
        height: calc(200% + 20px);
    }

    .viewDashboardCCTVGrid .col2row1.hidden {
        display: none;
    }

    .viewDashboardCCTVGrid .col2row1 span {
        color: white;
        width: 100%;
    }

    .viewDashboardCCTVGrid .col1row2 {
        grid-column: 1;
        grid-row: 2;
        position: relative;
    }

    .viewDashboardCCTVGrid .col1row2.full {
        grid-column: 1;
        grid-row: 1;
        width: calc(200% + 10px);
        height: calc(200% + 20px);
    }

    .viewDashboardCCTVGrid .col1row2.hidden {
        display: none;
    }

    .viewDashboardCCTVGrid .col1row2 span {
        color: white;
        width: 100%;
    }

    .viewDashboardCCTVGrid .col2row2 {
        grid-column: 2;
        grid-row: 2;
        position: relative;
    }

    .viewDashboardCCTVGrid .col2row2.full {
        grid-column: 1;
        grid-row: 1;
        width: calc(200% + 10px);
        height: calc(200% + 20px);
    }

    .viewDashboardCCTVGrid .col2row2.hidden {
        display: none;
    }

    .viewDashboardCCTVGrid .col2row2 span {
        color: white;
        width: 100%;
    }

    .viewDashboardCCTVGrid div:nth-child(2n + 2) {
        margin-right: 0;
    }

    .viewDashboardCCTVGrid div span {
        position: relative;
        height: 100%;
        display: inline-block;
    }

    .viewDashboardCCTVGrid div span img {
        position: relative;
        width: 180px;
        height: 130px;
    }

    .viewDashboardCCTVGrid div span iframe {
        width: 100% !important;
        height: 100% !important;
    }

    .viewDashboardCCTVGrid div span video {
        width: 100% !important;
        height: 100% !important;
    }

    .viewDashboardCCTVGrid div span:after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
`;


/**********************************************************************/
// 이벤트 대시보드

export const EventDashboardComponent = styled(PopupsCommon)`
    position: absolute;
    width: 600px;
    top: 60px;
    left: 50%;
    transform: translate(-50%, 0);
    box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.20), 0px 0px 3px 0px #D32F2F inset;
    will-change: transform;

    &.closePopup {
        animation: ${fadeOut} .3s ease-out;
    }

    &::before {
        content: '';
        display: block;
        position: absolute;
        top: -1px;
        left: -1px;
        width: 8px;
        height: 8px;
        background: url(${contentBoxEl_red}) no-repeat center center;
    }
        
    &::after {
        content: '';
        display: block;
        position: absolute;
        top: -1px;
        right: -1px;
        width: 8px;
        height: 8px;
        background: url(${contentBoxEl_red}) no-repeat center center;
        transform: rotate(90deg);
    }

    > div {
        padding: 15px 20px;
        ${(props) => props.theme.flex()};
        
        &::before {
            content: '';
            display: block;
            position: absolute;
            bottom: -1px;
            left: -1px;
            width: 8px;
            height: 8px;
            background: url(${contentBoxEl_red}) no-repeat center center;
            transform: rotate(270deg);
        }

        &::after {
            content: '';
            display: block;
            position: absolute;
            bottom: -1px;
            right: -1px;
            width: 8px;
            height: 8px;
            background: url(${contentBoxEl_red}) no-repeat center center;
            transform: rotate(180deg);
        }

        > div {
            ${(props) => props.theme.flex('flex-start', 'center')};
            gap: 10px;

            .eventIcon {
                width: 60px;
                height: 60px;
            }
            
            .contentWrap {
                
                .time {
                    font-weight: 500;
                    margin-bottom: 8px;
                }
                
                .text {
                    ${(props) => props.theme.flex('flex-start', 'center')};
                    gap: 3px;
                    margin-bottom: 12px;
                    
                    p {
                        font-size: 14px;
                        font-weight: 700;
                        
                        &:nth-child(1),
                        &:nth-child(3) {
                            color: ${(props) => props.theme.warning};
                        }
                    }
                }
                
                .autoClose {
                    color: #55595E;
                    font-weight: 500;
                    font-size: 12px;
                }
            }
        }

        .iconWrap{
            margin-right: 20px; 
        }

        .atmosphereImage{
            position: absolute;
            top: 20px;
            left: 23px;
            z-index: 2;
        }

        .lightAni {
            position: relative;
            width: 45px;
            height: 26px;
            margin: 10px 0;
            border-left: solid 1px #b6b6b6; 
            border-right: solid 1px #b6b6b6;
            float:left;
            left: 5px;
            animation: ${lightAnimate} 1s infinite;
        }

        .lightAni:before,
        .lightAni:after {
            content: "";
            position: absolute;
            z-index: 1;
            width: 30px;
            height: 30px;
            background: #0D121A;
            transform: scaleY(0.5774) rotate(-45deg);
            left: 7px;
        }

        .lightAni:before {
            top: -15px;
            border-top: solid 1.4142px #b6b6b6; 
            border-right: solid 1.4142px #b6b6b6; 
            animation: ${lightAnimateTop} 1s infinite;
        }

        .lightAni:after {
            bottom: -15px;
            border-bottom: solid 1.4142px #b6b6b6; 
            border-left: solid 1.4142px #b6b6b6; 
            animation: ${lightAnimateBottom} 1s infinite;
        }

        .dslX {
            width: 14px;
            height: 14px;
            text-indent: -9999px;
            z-index: 1;
            cursor: pointer;
            
            background-color: #fff;
            -webkit-mask-image: url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='free-icon-reject-3705787 1' clip-path='url(%23clip0_625_4990)'%3E%3Cg id='Group'%3E%3Cpath id='Vector' d='M14 1.30003L12.7 0L7 5.69997L1.30003 0L0 1.30003L5.69997 7L0 12.7L1.30003 14L7 8.30003L12.7 14L14 12.7L8.30003 7L14 1.30003Z' fill='%237C8DA9'/%3E%3C/g%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_625_4990'%3E%3Crect width='14' height='14' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
            -webkit-mask-repeat: no-repeat;
            -webkit-mask-position: center center;
            mask-image: url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='free-icon-reject-3705787 1' clip-path='url(%23clip0_625_4990)'%3E%3Cg id='Group'%3E%3Cpath id='Vector' d='M14 1.30003L12.7 0L7 5.69997L1.30003 0L0 1.30003L5.69997 7L0 12.7L1.30003 14L7 8.30003L12.7 14L14 12.7L8.30003 7L14 1.30003Z' fill='%237C8DA9'/%3E%3C/g%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_625_4990'%3E%3Crect width='14' height='14' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
            mask-repeat: no-repeat;
            mask-position: center center;
        }
    }
`;


/**********************************************************************/
// 초기상황 전파관리

export const InitialSituationManagementComponent = styled.div`
    width: 1060px;
    height: 754px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    background: url(${popup_background}) no-repeat;
    padding: 40px;
    ${(props) => props.theme.userSelect()};

    .closeBtn {
        position: absolute;
        top: 40px;
        right: 40px;
    }

    .btnWrap {
        position: absolute;
        bottom: 23px;
        left: 50%;
        transform: translate(-50%, -50%);

        button {
            height: 34px;
            border-radius: 2px;
            font-size: 14px;
            font-weight: 500;
            margin: 0 2.5px;
            padding: 10px 20px;
        }

        .cancle {
            border: 1px solid #29313E;
        }

        .submit {
            background-color: ${(props) => props.theme.primary};
            color: #000000;
        }
    }

    .menuWrap {
        h2 {
            font-weight: 700;
            margin-bottom: 20px;
        }
    }

    section {
        height: calc(100% - 100px);

        .filterWrap {
            ${(props) => props.theme.flex()};
            gap: 11px;
            margin-bottom: 10px;

            > select, button {
                width: 25%;
                height: 30px;
                background-color: #1B212C;
                font-size: 14px !important;
            }

            select {
                background-position-x: 97%;
            }

            select:disabled {
                color: #384355;
            }

            > button {
                border-radius: 2px;
                text-align: left;
                padding-left: 10px;
                position: relative;

                &::before {
                    content: '';
                    display: inline-block;
                    background: url(${receiver_icon}) no-repeat center center;
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    width: 20px;
                    height: 20px;
                }

                &.on {
                    &::before {
                        filter: invert(42%) sepia(82%) saturate(2612%) hue-rotate(184deg) brightness(100%) contrast(108%);
                    }
                }
            }
        }

        .receiverWrap {
            ${(props) => props.theme.flex('flex-start', 'center')};
            gap: 5px ;
            width: 100%;
            background-color: #1B212C;
            padding: 10px;
            margin-bottom: 20px;

            p {
                font-size: 14px;
                min-width: 46px;
            }

            ul {
                ${(props) => props.theme.flex('flex-start', 'center')};
                flex-wrap: wrap;
                gap: 5px ;

                li {
                    font-size: 12px;
                    background-color: ${(props) => props.theme.primary};
                    border-radius: 2px;
                    color: ${(props) => props.theme.background};
                    padding: 5px;
                }
            }
        }

        .contentWrap {
            background-color: #1B212C;
            height: calc(100% - 95px);
            
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
                left: 24px;
                transform: translate(0, -50%);
                padding: 5px 10px;
                white-space: nowrap;
                border-radius: 3px;
                background-color: ${(props) => props.theme.fontPrimary};
                color: #000;
                font-size: 12px;
                font-weight: 500;
                content: attr(data-tooltip);
                text-align: center;
                line-height: 1.2;
            }

            [data-tooltip]:after {
                content: " ";
                position: absolute;
                border-right: 5px solid ${(props) => props.theme.fontPrimary};
                border-top: 5px solid transparent;
                border-bottom: 5px solid transparent;
                transform: translate(0, -50%);
                top: 50%;
                left: 20px;
            }
            
            [data-tooltip]:hover:before,
            [data-tooltip]:hover:after {
                visibility: visible;
                opacity: 1;
            }

            .header {
                width: 100%;
                height: 36px;
                background: #2A3344;
                ${(props) => props.theme.flex('center', 'center')};
                gap: 10px;

                > p {
                    font-size: 14px;
                    font-weight: 500;
                }
            }

            .content {
                width: 100%;
                height: calc(100% - 36px);
                padding: 20px;

                textarea {
                    width: 100%;
                    height: 100%;
                    background-color: transparent;
                    border: 1px solid #384355;
                    padding: 10px;
                    color: #fff;
                    font-size: 12px;
                    line-height: 15px;
                    ${(props) => props.theme.scroll()};
                }
            }
        }
    }
`;


/**********************************************************************/
// 수신자 편집

const eventIconStyles = css`
    background: url(${nav_event_disable}) no-repeat center center;
    width: 22px;
    height: 24px;
    
    &.off_none {
        background: url(${nav_event_off_none}) no-repeat center center;
    }
    
    &.on_alarm {
        background: url(${nav_event_on_alarm}) no-repeat center center;
    }
    
    &.on_none {
        background: url(${nav_event_on_none}) no-repeat center center;
    }
    
    &.off_alarm {
        background: url(${nav_event_off_alarm}) no-repeat center center;
    }
`

export const EditReceiverComponent = styled.div`
    width: 860px;
    height: 619px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    padding: 40px;
    background: #1B212C;
    ${(props) => props.theme.userSelect()};

    .closeBtn {
        position: absolute;
        top: 40px;
        right: 40px;
    }

    > h2 {
        font-weight: 700;
        margin-bottom: 20px;
    }

    .btnWrap {
        position: absolute;
        bottom: 23px;
        left: 50%;
        transform: translate(-50%, -50%);

        button {
            height: 34px;
            border-radius: 2px;
            font-size: 14px;
            font-weight: 500;
            margin: 0 2.5px;
            padding: 10px 20px;
        }

        .cancle {
            border: 1px solid #29313E;
        }

        .submit {
            background-color: ${(props) => props.theme.primary};
            color: #000000;
        }
    }

    section {
        .scroll {
            height: 190px;
            overflow-x: hidden;
            overflow-y: auto;
            ${(props) => props.theme.scroll()};
        }

        .selectWrap {
            ${(props) => props.theme.flex('', 'flex-start')};
            gap: 10px;

            .teamList {
                flex: 2;
    
                > p {
                    background: #2A3344;
                    padding: 10px;
                    font-size: 12px;
                    font-weight: 500;
                    height: 36px;
                    display: flex;
                    align-items: center;
                }

                .teamTree {

                    & * {
                        font-size: 12px;
                    }

                    ul {
                        display: none;

                        &.on {
                            display: block;
                        }
                    }

                    > li {

                        div {
                            height: 38px;
                            line-height: 37px;
                            border-bottom: 1px solid #1B212C;
                            background: ${(props) => props.theme.background};
                            cursor: pointer;

                            &:hover {
                                background-color: ${(props) => props.theme.primary};
                            }

                            &.depth1, &.sensorTxt {
                                padding: 0 10px;
                            }

                            &.depth2 {
                                padding: 0 10px 0 15px;
                            }

                            &.depth3 {
                                padding: 0 10px 0 20px;
                            }

                            &.depth4 {
                                padding: 0 10px 0 25px;
                            }

                            &.depth5 {
                                padding: 0 10px 0 30px;
                            }

                            &.depth6 {
                                padding: 0 10px 0 35px;
                            }

                            &.depth7 {
                                padding: 0 10px 0 40px;
                            }

                            &.depth8 {
                                padding: 0 10px 0 45px;
                            }

                            &.depth9 {
                                padding: 0 10px 0 50px;
                            }

                            &.depth10 {
                                padding: 0 10px 0 55px;
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
                }
            }
    
            .memberList {
                flex: 1;

                > p {
                    background: #2A3344;
                    padding: 10px;
                    font-size: 12px;
                    font-weight: 500;
                    height: 36px;
                    display: flex;
                    align-items: center;
                }

                ul {
                    background: ${(props) => props.theme.background};

                    li {
                        height: 38px;
                        border-bottom: 1px solid #1B212C;
                        font-size: 12px;
                        padding: 10px;
                        ${(props) => props.theme.flex()};
                        cursor: pointer;

                        &:hover {
                            background-color: ${(props) => props.theme.primary};
                        }

                        &.selected {

                            &::after {
                                content: '';
                                display: inline-block;
                                background: url(${member_check_off});
                                width: 16px;
                                height: 16px;
                            }

                            &:hover {
                                &::after {
                                    background: url(${member_check_on});
                                }
                            }
                        }
                    }
                }
            }
        }
        
        .selectedMemberList {
            width: 100%;
            background-color: #1A1F23;
            margin-top: 10px;

            & * {
                font-size: 12px;
            }

            .selectedMember {

                .head > div, 
                .body > ul > li > div {

                    &:nth-of-type(1) {
                        width: 6%;
                    }

                    &:nth-of-type(2) {
                        width: 88%;
                    }
                    
                    &:nth-of-type(3) {
                        width: 6%;
                    }
                }

                .head {
                    background: #2A3344;
                    width: calc(100% - 6px);
                    ${(props) => props.theme.flex()};

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
                            border-right: 1px solid ${(props) => props.theme.background};
                        }

                        height: 32px;
                        line-height: 32px;
                        text-align: center;
                        font-weight: 500;

                        .sort {
                            ${(props) => props.theme.flex('center', 'center')};
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
                                    background: url(${sortIcon}) no-repeat center center;
                                    transform: rotate(180deg);
                                }
                            }
                        }
                    }
                }

                .body {
                    background-color: ${(props) => props.theme.background};
                    overflow-y: scroll;
                    height: 170px;

                    ${(props) => props.theme.scroll()};

                    ul {

                        li {
                            ${(props) => props.theme.flex()};
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
    }
`;


/**********************************************************************/
// 거리측정 팝업
export const RangeFindingComponent = styled(PopupsCommon)`
    position: absolute;
    top: 60px;
    right: 10px;
    width: 180px;
    height: 266px;
    background-color: ${(props) => props.theme.background};

    .dslTop {
        padding: 10px 10px 0 10px;

        &::after {
            background-size: auto;
            top: 32px;
            left: 10px;
            right: 10px;
        }

        &::before {
            background-size: auto;
            top: 32px;
            left: 10px;
        }
    }

    .dslTitle {
        display: flex;
        align-items: center;

        &::before {
            content: '';
            display: inline-block;
            width: 12px;
            height: 12px;
            background: url(${rangeFinding}) no-repeat center center;
            margin-right: 5px;
        }
    }

    .rangeContent {
        padding-top: 9px;

        & * {
            font-size: 12px;
        }

        .total, .range {

            li {
                ${(props) => props.theme.flex()};
                padding: 13px 10px;

                p {
                    font-weight: 500;
                    color: #7C8DA9;
                }
            }
        }

        .total {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;

            li {
                background-color: rgba(255, 255, 255, 0.05);
                border-top: 1px solid #384355;

                &.on p {
                    color: ${(props) => props.theme.primary};
                }
            }
        }

        .range {
            width: 100%;
            display: flex;
            justify-content: ${props => props.$spot !== null ? '' : 'center'};
            align-items: ${props => props.$spot !== null ? '' : 'center'};
            flex-direction: ${props => props.$spot !== null ? 'column' : ''};

            li {
                display: flex;
                align-items: center;

                &.nodata {
                    text-align: center;
                    color: #7C8DA9;
                    line-height: 17px;
                    position: relative;
                    top: 45px;
                }

                &.on p {
                    color: ${(props) => props.theme.fontPrimary};
                }

                &:not(:last-child) {
                    border-bottom: 1px dashed #384355;
                }
            }
        }
    }
`;


/**********************************************************************/
// 키맵 팝업
export const KeyMapComponent = styled(PopupsCommon)`
    position: absolute;
    top: 60px;
    right: 10px;
    width: 180px;
    background-color: ${(props) => props.theme.background};

    .dslTop {
        padding: 10px 10px 0 10px;

        &::after {
            background-size: auto;
            top: 32px;
            left: 10px;
            right: 10px;
        }

        &::before {
            background-size: auto;
            top: 32px;
            left: 10px;
        }
    }

    .dslTitle {
        display: flex;
        align-items: center;

        &::before {
            content: '';
            display: inline-block;
            width: 12px;
            height: 12px;
            background: url(${keyMap}) no-repeat center center;
            margin-right: 5px;
        }
    }

    .keyMapContent {
        padding-top: 9px;

        & * {
            font-size: 12px;
            font-weight: 500;
        }

        ul {

            li {
                ${(props) => props.theme.flex()};
                padding: 10px;

                &:not(:first-child) {
                    border-top: 1px solid #384355;
                }

                > div {
                    ${(props) => props.theme.flex()};
                    gap: 22px;
                    position: relative;

                    > p:first-child {
                        color: ${(props) => props.theme.primary};
                        border-radius: 2px;
                        border: 1px solid ${(props) => props.theme.primary};
                        padding: 3px 5px;
                        font-size: 10px;
                    }

                    > p:last-child {
                        padding: 3px 5px;
                        color: #000000;
                        border-radius: 2px;
                        background: ${(props) => props.theme.primary};
                        font-size: 10px;

                        &::before {
                            content: '';
                            display: inline-block;
                            width: 12px;
                            height: 12px;
                            background: url(${keyMap_plus}) no-repeat center center;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(0, -50%);
                        }
                    }
                }
            }
        }
    }
`;


/**********************************************************************/
// 이벤트
export const EventComponent = styled(PopupsCommon)`
    position: absolute;

    .content {
        position: relative;
        padding: 15px 5px 15px 15px;

        .sortWrap {
            ${(props) => props.theme.flex()};
            padding-right: 10px;
    
            ul {
                ${(props) => props.theme.flex('flex-start', 'center')};
                gap: 12px;
    
                li {
                    ${(props) => props.theme.flex('flex-start', 'center')};
                    gap: 4px;
    
                    input[type=radio] {
                        border: solid 1.5px #7C8DA9;
                    }
    
                    input[type=radio]:checked+label {
                        color: ${(props) => props.theme.fontPrimary};
                    }
    
                    label {
                        color: #7C8DA9;
                    }
                }
            }
    
            select {
                width: 75px;
                background-color: rgba(255, 255, 255, 0.10);
                font-size: 10px;
    
                option {
                    background-color: ${(props) => props.theme.background};
                }
            }
        }

        .eventWrap {
            margin: 15px 0;
            display: flex;
            flex-direction: column;
            gap: 10px;
            height: calc(100% - 88px);
            padding-right: 5px;

            .eventItem {
                background: rgba(255, 255, 255, 0.05);
                cursor: pointer;

                header {
                    ${(props) => props.theme.flex('flex-start', 'center')};
                    gap: 10px;
                    padding: 15px 15px 10px 15px;

                    > p:nth-child(1) {
                        padding: 4px;
                        border-radius: 2px;
                        background: ${(props) => props.theme.warning};
                        font-size: 10px;
                        font-weight: 700;
                    }

                    > p:nth-child(2) {
                        font-weight: 700;
                    }
                }

                section {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    padding: 0 15px 15px 15px;

                    p {
                        font-size: 10px;
                        ${(props) => props.theme.flex('flex-start', 'center')};

                        &::before {
                            content: '';
                            display: inline-block;
                            width: 2px;
                            height: 2px;
                            background: #FFF;
                            margin-right: 5px;
                        }
                    }
                }

                footer {
                    display: none;
                    height: 0;
                    animation: ${slideUp} .2s ease-out;
                    overflow: hidden;

                    > div {
                        ${(props) => props.theme.flex()};
                        border-top: 1px solid rgba(255, 255, 255, 0.10);
    
                        button {
                            flex: 1;
                            padding: 10px;
    
                            &:not(:last-child) {
                                border-right: 1px solid rgba(255, 255, 255, 0.10);
                            }
                        }
                    }
                }

                &#onEvent {
                    position: relative;
                    box-shadow: 0px 0px 3px 0px #0095FF inset;

                    footer {
                        display: block;
                        height: 32.53px;
                        overflow: hidden;
                        animation: ${slideDown} .2s ease-out;
                    }
                }

                &.closed {
                    pointer-events: none;

                    & * {
                        color: #7C8DA9;
                    }

                    header {
                        > p:nth-child(1) {
                            background: #7C8DA9;
                            color: #191E26;
                        }
                    }

                    section {
                        p {

                            &::before {
                                background: #7C8DA9;
                            }
                        }
                    }
                }
            }
        }
    
        .btnWrap {
            width: calc(100% - 30px);
            ${(props) => props.theme.flex()};
            gap: 5px;
            position: absolute;
            bottom: 15px;
    
            button {
                text-indent: -9999px;
                border-radius: 2px;
                border: 1px solid #29313E;
                flex: 1;
                height: 32px;
    
                &:nth-child(1) {
                    background: url(${initialSituation}) no-repeat center center;
                }
    
                &:nth-child(2) {
                    &.on {
                        background: url(${soundOn}) no-repeat center center;
                    }

                    &.off {
                        background: url(${soundOff}) no-repeat center center;
                    }
                }
    
                &:nth-child(3) {
                    background: url(${shutdown}) no-repeat center center;
                }
            }
        }
    }
`;


/**********************************************************************/
// 이벤트 메모
export const EventMemoComponent = styled(PopupsCommon)`
    position: absolute;
    width: 300px;
    height: 300px;
    top: 63%;
    left: 30%;

    .dslTop {
        &::before {
            content: '';
            display: block;
            position: absolute;
            top: 44px;
            left: 0;
            width: 100%;
            height: 1px;
            background: #29313E;
            z-index: 2;
        }

        &::after {
            display: none;
        }

        .dslTitle {
            ${(props) => props.theme.flex('flex-start', 'center')};

            &::before {
                content: '';
                display: inline-block;
                width: 2px;
                height: 2px;
                background-color: ${(props) => props.theme.primary};
                margin-right: 4px;
            }
        }
    }

    .content {

        textarea {
            width: 100%;
            height: 177px;
            background: #1B212C;
            border: 0;
            padding: 8px 10px;
            color: ${(props) => props.theme.fontPrimary};
            ${(props) => props.theme.scroll()};
        }

        .btnWrap {
            width: 100%;
            ${(props) => props.theme.flex()};
            gap: 5px;
            margin-top: 15px;

            button {
                height: 34px;
                border-radius: 2px;
                font-size: 14px;
                font-weight: 500;
                padding: 10px 20px;
                flex: 1;
            }

            .cancle {
                border: 1px solid #29313E;
            }

            .submit {
                background-color: ${(props) => props.theme.primary};
                color: #000000;
            }
        }
    }
`;


/**********************************************************************/
// 네비게이션 바

export const NavigationBarComponent = styled.div`
    width: 400px;
    height: 50px;
    background: ${(props) => props.theme.background};
    border-radius: 25px 25px 0 0;
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 0);

    ul {
        width: 100%;
        height: 50px;
        ${props => props.theme.flex('space-evenly', 'center')};

        .navList > li:hover,
        .navHomeBtn:hover {
            &::after {
                content:attr(data-title); 
                position: absolute; 
                white-space: nowrap;
                line-height: 10px;
                top: -45px;
                left: 50%; 
                transform: translate(-50%, 0);
                padding: 7px 10px;
                background: #000 !important;
                border-radius: 2px;
                font-size: 12px; 
                font-weight: 500;
                color: ${(props) => props.theme.fontPrimary} !important;
                text-align: center; 
                z-index: 100;
            }

            &::before {
                content: " ";
                position: absolute;
                border-right: 5px solid transparent;
                border-left: 5px solid transparent;
                border-top: 5px solid #000 !important;
                top: -22px;
                left: 50%; 
                transform: translate(-50%, 0);
            }
        }

        .navHomeBtn {
            text-align: center;
            line-height: 41px;
            position: relative;
            top: -18px;

            &::after {
                top: -20px !important;
            }

            &::before {
                top: 4px !important;
            }
        }

        .navList {
            ${props => props.theme.flex('flex-start', 'center')};

            li {
                position: relative;
            }

            li:hover {

                button {
                    &::before {
                        content: '';
                        display: block;
                        background: url(${nav_line}) no-repeat center center;
                        position: absolute;
                        bottom: -12px;
                        left: 50%;
                        transform: translate(-53%, 0);
                        width: 44px;
                        height: 2px;
                    }
                }
            }
        }

        & > li > ul > li {
            width: 77px;
            border-right: 1px dashed #525868;
            text-align: center;

            &:last-child {
                border-right: 0;
            }
        }

        .statusInfoIcon {
            background: url(${nav_statusInfo}) no-repeat center center;
            width: 24px;
            height: 24px;
        }

        .on.statusInfoIcon {
            filter: invert(42%) sepia(82%) saturate(2612%) hue-rotate(184deg) brightness(100%) contrast(108%);
        }

        .eventIcon {
            // background: url(${nav_event}) no-repeat center center;
            // width: 22px;
            // height: 24px;
            ${eventIconStyles}
        }

        .on.eventIcon {
            filter: invert(42%) sepia(82%) saturate(2612%) hue-rotate(184deg) brightness(100%) contrast(108%);
        }

        .miniMapIcon {
            background: url(${nav_miniMap}) no-repeat center center;
            width: 24px;
            height: 24px;
        }

        .on.miniMapIcon {
            filter: invert(42%) sepia(82%) saturate(2612%) hue-rotate(184deg) brightness(100%) contrast(108%);
        }

        .simulationIcon {
            background: url(${nav_simulation}) no-repeat center center;
            width: 24px;
            height: 24px;
        }

        .on.simulationIcon {
            filter: invert(42%) sepia(82%) saturate(2612%) hue-rotate(184deg) brightness(100%) contrast(108%);
        }
    }
`;


/**********************************************************************/
// 대기센서 상세정보
export const StatusPsmSensorInfoComponent = styled(PopupsCommon)`
    position: absolute;
    
    .content {
        justify-content: space-between;
        gap: 10px;
        height: calc(100% - 50px);

        .contentBox {

            &.chart {
                height: calc(100% - 105px);
                padding: 15px 5px 15px 15px;

                #tooltip {
                    position: absolute;
                    top: 15px;
                    right: 15px;

                    #toolTipContent {
                        display: none;
                        position: absolute;
                        top: -5px;
                        left: 50px;
                        width: 485px;
                        border: 1px solid #252930;
                        cursor: default;

                        &.on {
                            display: block;
                        }

                        &::after {
                            position: absolute;
                            top: 7.5px;
                            left: 0;
                            margin-left: -5px;
                            width: 0;
                            border-top: 5px solid transparent;
                            border-right: 5px solid #232B32;
                            border-bottom: 5px solid transparent;
                            content: " ";
                            font-size: 0;
                            line-height: 0;
                        }

                        span {
                            white-space: nowrap;
                        }

                        > ul {
                            width: 100%;
                            height: 20%;

                            li {
                                ${(props) => props.theme.flex()};
                                text-align: center;
                                height: 22px;

                                div {
                                    height: 22px;
                                    line-height: 22px;
                                }

                                > div:nth-child(1) {
                                    flex: 2;
                                }

                                > div:nth-child(2) {
                                    flex: 1;
                                }

                                > div:nth-child(3) {
                                    flex: 1;
                                }

                                > div:nth-child(4) {
                                    flex: 1;
                                }

                                > div:nth-child(5) {
                                    flex: 1;
                                }
                            }

                            li, li > span {
                                color: #CCCCCC;
                                font-size: 12px;
                                width: 100%;
                            }
                        }

                        .toolTipHead {
                            background: #252930;

                            > div:not(:last-child)  {
                                border-right: 1px solid #10141C;
                            }

                            .blueTxt, .greenTxt, .yellowTxt, .redTxt {
                                margin-right: 4px;

                                &::before {
                                    content: '';
                                    display: inline-block;
                                    width: 8px;
                                    height: 8px;
                                    border-radius: 50%;
                                    margin-right: 3px;
                                }
                            }

                            .blueTxt {
                                &::before {
                                    background: ${(props) => props.theme.primary};
                                }
                            }

                            .yellowTxt {
                                &::before {
                                    background: #F9A825;
                                }
                            }

                            .redTxt {
                                &::before {
                                    background: ${(props) => props.theme.warning};
                                }
                            }
                        }

                        .toolTipBody {
                            background: ${(props) => props.theme.background};

                            > div:not(:last-child) {
                                border-right: 1px solid #252930;
                            }

                            &:not(:last-child) {
                                border-bottom: 1px solid #252930;
                            }
                        }
                    }
                }

                .head {
                    margin-top: 10px;
                    padding-right: 10px;

                    li {
                        ${(props) => props.theme.flex()};
                        text-align: center;
                        background: rgba(255, 255, 255, 0.05);

                        p {
                            flex: 1;
                            padding: 7px;
                            font-size: 10px;
                        }
                    }
                }

                .body {
                    height: calc(100% - 34px);
                    padding-right: 5px;

                    li {
                        ${(props) => props.theme.flex()};
                        /* text-align: center; */

                        &:not(:last-child) {
                            border-bottom: 1px dashed rgba(255, 255, 255, 0.10);
                        }
                        
                        > div {
                            flex: 1;
                            padding: 7px;
                        }

                        > div > span {
                            display: block;
                            text-align: center;
                        }

                        &.warning {
                            p span {
                                color: ${(props) => props.theme.warning};
                            }
                        }

                        &.noData {
                            height: 135px;

                            span {
                                color: #7C8DA9;
                            }
                        }

                        .chartArea{
                            width: 46px;
                            height: 12px;
                            margin-left: 10px;
                            position: relative;
                            overflow: hidden;
                        }

                        .blackStickBox{
                            position: absolute;
                            left: 0px;
                            top: 0px;
                            display: block;
                            width: 50px;
                            height: 12px;
                            padding-left: 4px;
                        }

                        .chartStickBlack{
                            display: inline-block;
                            width: 2px;
                            height: 13px;
                            background-color: #06090D;
                            margin-right: 4px;
                            position: relative;
                            z-index: 2;
                        }

                        .chartStickBox{
                            position: absolute;
                            left: 0px;
                            top: 0px;
                            display: block;
                            width: 50px;
                            height: 12px;
                        }

                        .chartStickNormal{
                            display: inline-block;
                            width: 4px;
                            height: 13px;
                            background-color: #393C3F;
                            margin-right: 2px;
                            position: relative;
                            z-index: 1;
                        }

                        .chartAnimate1{
                            display: block;
                            background-color: #0095ff;
                            width: 10px;
                            height: 12px;
                            padding-left: 2px;
                            position: absolute;
                            z-index: 1;

                            animation: ${chartAnimateBest} 1s cubic-bezier(0.965, 0.005, 0.080, 1.015);
                        }

                        .chartAnimate2{
                            display: block;
                            background-color: #0095ff;
                            width: 22px;
                            height: 12px;
                            padding-left: 2px;
                            position: absolute;
                            z-index: 1;

                            animation: ${chartAnimateNormal} 1s cubic-bezier(0.965, 0.005, 0.080, 1.015);
                        }

                        .chartAnimate3{
                            display: block;
                            background-color: #F9A825;
                            width: 34px;
                            height: 12px;
                            padding-left: 2px;
                            position: absolute;
                            z-index: 1;

                            animation: ${chartAnimateBad} 1s cubic-bezier(0.965, 0.005, 0.080, 1.015);                  
                        }

                        .chartAnimate4{
                            display: block;
                            background-color: #D32F2F;
                            width: 58px;
                            height: 12px;
                            padding-left: 2px;
                            position: absolute;
                            z-index: 1;

                            animation: ${chartAnimateVeryBad} .5s ease-in-out;
                        }
                    }
                }
            }

            &.weather {

                ul {
                    margin-top: 10px;

                    li {
                        ${(props) => props.theme.flex()};
                        text-align: center;
                        
                        &:first-child {
                            background: rgba(255, 255, 255, 0.05);
                        }

                        &:last-child {
                            p {
                                font-size: 12px;
                            }
                        }

                        p {
                            flex: 1;
                            padding: 7px 0;
                            font-size: 10px;
                            
                            &.noData {
                                color: #7C8DA9;
                            }
                        }
                    }
                }
            }
        }
    }
`;

