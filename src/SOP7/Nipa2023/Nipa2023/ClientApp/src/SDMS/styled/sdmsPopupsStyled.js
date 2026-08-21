import styled, { keyframes } from "styled-components";
import SdmsResource from "../resource/id";

import close_icon from '../../Common/images/close_icon.png';

import status_fire_on from '../images/status_fire_on.png';
import status_stink_on from '../images/status_stink_on.png';
import status_gas_on from '../images/status_gas_on.png';
import status_emergencyBell_on from '../images/status_emergencyBell_on.png';
import status_thermalImagingCamera_on from '../images/status_thermalImagingCamera_on.png';
import status_cctv_on from '../images/status_cctv_on.png';
import status_zoneName_on from '../images/status_zoneName_on.png';
import status_worker_on from '../images/status_worker_on.png';

import status_fire_off from '../images/status_fire_off.png';
import status_stink_off from '../images/status_stink_off.png';
import status_gas_off from '../images/status_gas_off.png';
import status_emergencyBell_off from '../images/status_emergencyBell_off.png';
import status_thermalImagingCamera_off from '../images/status_thermalImagingCamera_off.png';
import status_cctv_off from '../images/status_cctv_off.png';
import status_zoneName_off from '../images/status_zoneName_off.png';
import status_worker_off from '../images/status_worker_off.png';

import dashboard_location from '../images/dashboard_location.png';
import dashboard_siren from '../images/dashboard_siren.png';
import search_icon from '../images/search_icon.png';
import arrow_on from '../images/arrow_on.png';
import arrow_off from '../images/arrow_off.png';
import arrow_off_gray from '../images/arrow_off_gray.png';

import nav_statusInfo_on from '../images/nav_statusInfo_on.png';
import nav_statusInfo_off from '../images/nav_statusInfo_off.png';
import nav_dashBoard_on from '../images/nav_dashBoard_on.png';
import nav_dashBoard_off from '../images/nav_dashBoard_off.png';
import nav_event_on from '../images/nav_event_on.png';
import nav_event_off from '../images/nav_event_off.png';
import nav_workerPositioning_on from '../images/nav_workerPositioning_on.png';
import nav_workerPositioning_off from '../images/nav_workerPositioning_off.png';
import nav_equipmentFaulty_on from '../images/nav_equipmentFaulty_on.png';
import nav_equipmentFaulty_off from '../images/nav_equipmentFaulty_off.png';
import nav_equipmentStatus_on from '../images/nav_equipmentStatus_on.png';
import nav_equipmentStatus_off from '../images/nav_equipmentStatus_off.png';
import nav_monitoring from '../images/nav_monitoring.png';
import nav_equipment from '../images/nav_equipment.png';

import sop_icon_off from '../images/sop_icon_off.png';
import sop_icon_off_gray from '../images/sop_icon_off_gray.png';
import sop_icon_on from '../images/sop_icon_on.png';
import screen_move_icon_off from '../images/screen_move_icon_off.png';
import screen_move_icon_gray from '../images/screen_move_icon_gray.png';
import screen_move_icon_on from '../images/screen_move_icon_on.png';
import sound_off_icon_off from '../images/sound_off_icon_off.png';
import sound_off_icon_gray from '../images/sound_off_icon_gray.png';
import sound_off_icon_on from '../images/sound_off_icon_on.png';
import sound_on_icon_off from '../images/sound_on_icon_off.png';
import sound_on_icon_on from '../images/sound_on_icon_on.png';
import end_icon from '../images/end_icon.png';
import end_icon_on from '../images/end_icon_on.png';
import end_icon_off from '../images/end_icon_off.png';
import end_icon_off_gray from '../images/end_icon_off_gray.png';
import evtFIRE from '../images/evtFIRE.png';
import evtSTINK from '../images/evtSTINK.png';
import evtGAS from '../images/evtGAS.png';
import evtCCTV from '../images/evtCCTV.png';
import evtEMERGENCY_BELL from '../images/evtEMERGENCY_BELL.png';
import evtWORKER from '../images/evtWORKER.png';
import evtEQUIPMENT from '../images/evtEQUIPMENT.png';
import event_zoom_on from '../images/event_zoom_on.png';
import event_zoom_off from '../images/event_zoom_off.png';

import navigator_icon from '../images/navigator_icon.png';
import nav_icon1 from '../images/nav_icon1.png';
import nav_icon2 from '../images/nav_icon2.png';
import nav_icon3 from '../images/nav_icon3.png';
import nav_icon4 from '../images/nav_icon4.png';
import nav_icon5_on from '../images/nav_icon5_on.png';
import nav_icon5_off from '../images/nav_icon5_off.png';

import equip_arrow from '../images/equip_arrow.png';
import event_icon from '../images/event_icon.png';

import equipmentBuilding_on from '../images/equipmentBuilding_on.png';
import equipmentBuilding_off from '../images/equipmentBuilding_off.png';
import equipmentBuilding_active from '../images/equipmentBuilding_active.png';
import worker_people_on from '../images/worker_people_on.png';
import worker_people_off from '../images/worker_people_off.png';
import worker_people_active from '../images/worker_people_active.png';
import worker_equipment_on from '../images/worker_equipment_on.png';
import worker_equipment_off from '../images/worker_equipment_off.png';
import worker_equipment_active from '../images/worker_equipment_active.png';
import worker_facility_off from '../images/worker_facility_off.png';
import worker_facility_on from '../images/worker_facility_on.png';
import worker_facility_active from '../images/worker_facility_active.png';
import worker_plus_on from '../images/worker_plus_on.png';
import worker_plus_off from '../images/worker_plus_off.png';
import worker_ap from '../images/worker_ap.png';
import worker_tag from '../images/worker_tag.png';

import tooltip_icon from '../../Settings/images/tooltip_icon.png';
import stickBlue from '../images/stickBlue.png';
import stickGreen from '../images/stickGreen.png';
import stickOrange from '../images/stickOrange.png';
import stickRed from '../images/stickRed.png';
import stickGray from '../images/stickGray.png';

import alarm_on from '../images/alarm_on.png';
import alarm_off from '../images/alarm_off.png';
import event_alarm_icon from '../images/event_alarm_icon.png';


const fadeChart = keyframes`
    0% {
        opacity: 0;
        width: 0;
        left: 0;
    }
    100% {
        opacity: 1;
        width: 55px;
        left: 24px;
    }
`

/**********************************************************************/
// SDMS POPUPS 공통 CSS

export const PopupsCommon = styled.div`
    background: rgba(34, 42, 49, .9);
    position: relative;
    cursor: default;

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-use-select: none;
    user-select: none;

    &::before {
        content: '';
        display: block;
        width: 11px;
        height: 11px;
        border-top: 3px solid ${(props) => props.theme.mainColor};
        border-left: 3px solid ${(props) => props.theme.mainColor};
        position: absolute;
        top: -2px;
        left: -2px;
    }

    .dslTop {
        position: relative;
        
        &::after {
            content: '';
            display: block;
            width: 100%;
            height: 3px;
            background: transparent linear-gradient(270deg, #FFFFFF12 0%, #20DFA8 100%) 0% 0% no-repeat padding-box;
            opacity: .65;
        }
    }

    .dslTitle {
        padding: 10px 13px;
        height: 37px;
        line-height: 18px;
        font-size: 14px;
        color: ${(props) => props.theme.mainColor};
        font-weight: bold;
    }

    .dslTitle span {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        margin-left: 10px;
        letter-spacing: 0em;
        font-weight: 400;
    }

    .dslX {
        display: block;
        width: 12px;
        height: 12px;
        text-indent: -9999px;
        position: absolute;
        right: 13px;
        top: 51%;
        margin-top: -8px;
        background: url(${close_icon}) no-repeat center center;
        z-index: 1;
        cursor: pointer;
    }

    .dslCont {
        display: flex;
        flex-direction: column;
        padding: 13px;
        height: calc(100% - 37px);

        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-use-select: none;
        user-select: none;
    }

    .scrollbar {
        overflow-x: hidden;
        overflow-y: auto !important;
        ${(props) => props.theme.scroll()};
    }

    .tabMenu {

        ul {
            ${(props) => props.theme.flex('flex-start', 'center')};

            li {
                padding: 5px 12px;
                font-size: 12px;
                background-color: #7F7F7F;
                color: #CCCCCC;
                border-radius: 5px 5px 0 0;
                cursor: pointer;
            }

            li.on {
                background-color: #1E1E21;
                color: ${(props) => props.theme.mainColor};
                font-weight: bold;
            }
        }
    }

    .contentTable {
        height: 100%;

        .tableHead {
            ${(props) => props.theme.flex()};
            background: #1E1E21;
            height: 24px;

            li {
                font-size: 10px;
                text-align: center;

                &:nth-child(1) {
                    width: 10%;
                }

                &:nth-child(2) {
                    width: 45%;
                }

                &:nth-child(3) {
                    width: 30%;
                }

                &:nth-child(4) {
                    width: 15%;
                }
            }
        }

        .tableBody {
            margin-top: 8px;
            height: calc(100% - 50px);
            overflow-y: auto;
            ${(props) => props.theme.scroll()};

            > li {
                &:not(:last-child) {
                    border-bottom: 1px dashed #525868;
                }

                &:first-child {
                    
                    ul {
                        padding: 0 0 8px 0;
                    }
                }

                ul {
                    ${(props) => props.theme.flex()};
                    padding: 8px 0;

                    li {
                        font-size: 12px;
                        
                        &:nth-child(1) {
                            width: 10%;
                            text-align: center;
                        }

                        &:nth-child(2) {
                            width: 45%;
                            text-align: center;
                        }

                        &:nth-child(3) {
                            width: 30%;
                        }

                        &:nth-child(4) {
                            width: 15%;
                            text-align: center;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
    }

    .greenDOTT {
        width: 11px;
        height: 11px;
        background: ${(props) => props.theme.greenColor};
        border-radius: 100%;
        display: inline-block;
    }

    .grayDOTT {
        width: 11px;
        height: 11px;
        background: ${(props) => props.theme.middleGray};
        border-radius: 100%;
        display: inline-block;
    }
`;


/**********************************************************************/
// 현황정보

export const StatusInfoComponent = styled(PopupsCommon)`
    position: absolute;
    width: 304px;
    height: 500px;

    .dsiSel {
        position: relative;
    }

    .dsiSel > div {
        display: block;
        width: 100%;
        text-align: left;
        height: 26px;
        line-height: 26px;
        cursor: pointer;
    }

    .dsiSel ul {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-bottom: 12px
    }
    .dsiSel ul li {
        float: left;
        margin-right: 3px;
    }

    .dsiSel ul li label input[type="checkbox"] {
        display: none;
    }

    .dsiSel ul li label {
        display: block;
        float: left;
        cursor: pointer;
        margin-left: 4px;
        margin-right: 2px;
        position: relative;
    }

    .visibleFire {
        background: url(${status_fire_on}) no-repeat center center;
        width: 26px;
        height: 26px;
    }

    .visibleStink {
        background: url(${status_stink_on}) no-repeat center center;
        width: 26px;
        height: 26px;
    }

    .visibleGas {
        background: url(${status_gas_on}) no-repeat center center;
        width: 26px;
        height: 26px;
    }

    .visibleEmergencyBell {
        background: url(${status_emergencyBell_on}) no-repeat center center;
        width: 26px;
        height: 26px;
    }

    .visibleThermalImagingCamera {
        background: url(${status_thermalImagingCamera_on}) no-repeat center center;
        width: 26px;
        height: 26px;
    }

    .visibleCCTV {
        background: url(${status_cctv_on}) no-repeat center center;
        width: 26px;
        height: 26px;
    }

    .visibleZoneName {
        background: url(${status_zoneName_on}) no-repeat center center;
        width: 26px;
        height: 26px;
    }

    .visibleWorker {
        background: url(${status_worker_on}) no-repeat center center;
        width: 26px;
        height: 26px;
    }

    .disableFire {
        background: url(${status_fire_off}) no-repeat center center;
        width: 26px;
        height: 26px;
    }

    .disableStink {
        background: url(${status_stink_off}) no-repeat center center;
        width: 26px;
        height: 26px;
    }

    .disableGas {
        background: url(${status_gas_off}) no-repeat center center;
        width: 26px;
        height: 26px;
    }

    .disableEmergencyBell {
        background: url(${status_emergencyBell_off}) no-repeat center center;
        width: 26px;
        height: 26px;
    }

    .disableThermalImagingCamera {
        background: url(${status_thermalImagingCamera_off}) no-repeat center center;
        width: 26px;
        height: 26px;
    }

    .disableCCTV {
        background: url(${status_cctv_off}) no-repeat center center;
        width: 26px;
        height: 26px;
    }

    .disableZoneName {
        background: url(${status_zoneName_off}) no-repeat center center;
        width: 26px;
        height: 26px;
    }

    .disableWorker {
        background: url(${status_worker_off}) no-repeat center center;
        width: 26px;
        height: 26px;
    }

    .dsiSch {
        background: #161616;
        margin-top: 12px;
        position: relative;
        padding-right: 30px;
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
    }

    .dsiSch input[type="text"] {
        display: block;
        height: 30px;
        padding-left: 10px;
        background: none;
        color: #fff;
        font-size: 12px;
        width: 100%;
        border-radius: 3px;
    }

    .dsiSch a,
    .dsiSch button,
    .dsiSch input[type="submit"] {
        display: block;
        width: 30px;
        height: 30px;
        position: absolute;
        right: 0;
        top: 0;
        text-indent: -9999px;
        background: url(${search_icon}) no-repeat center center;
    }

    .dsiSch a {
        cursor: pointer;
    }

    .dsiScr {
        margin-top: 14.5px;
        height: calc(100% - 84px);
        margin-bottom: 5px;
        border-top: 1px dashed #525868;
        padding-top: 17px;
    }

    .dsiTree {
        padding-left: 10px;
        height: 100%;

        li {
            cursor: pointer;
        }

        > li {
            margin-bottom: 15px;
        }

        > li > p {
            font-size: 14px;
            color: ${(props) => props.theme.middleGray};

            &::before {
                content: '';
                display: inline-block;
                background: url(${arrow_off_gray}) no-repeat center center;
                width: 11px;
                height: 9px;
                margin-right: 6px;
                transform: rotate(-90deg);
                transition: transform .35s;
            }

            &.on {
                color: #fff;

                &::before {
                    content: '';
                    display: inline-block;
                    background: url(${arrow_off}) no-repeat center center;
                    width: 11px;
                    height: 9px;
                    margin-right: 6px;
                    transform: rotate(0deg);
                    transition: transform .35s;
                }
            }
        }
    }

    .tree-1depth {
        /* display: block; */
        display: none;

        > li {

            > div {
                ${(props) => props.theme.flex('flex-start', 'end')};

                > p {
                    padding-top: 6px;
                    padding-bottom: 2px;
                    margin-top: 4px;
                    margin-left: 6px;
                    font-size: 12px;
    
                    &::before {
                        content: '';
                        display: inline-block;
                        background: url(${arrow_off}) no-repeat center center;
                        width: 11px;
                        height: 9px;
                        margin-right: 6px;
                        transform: rotate(-90deg);
                        transition: transform .35s;
                    }
                }

                button {
                    width: 37px;
                    height: 16px;
                    background: transparent linear-gradient(180deg, #262626 0%, #000000 100%) 0% 0% no-repeat padding-box;
                    border-radius: 16px;
                    font-size: 10px;
                    color: #fff;
                    margin-left: 7px;
                    margin-top: 8px;
                }

                &.on {
                    color: ${(props) => props.theme.mainColor};

                    > p {
                        &::before {
                            content: '';
                            display: inline-block;
                            background: url(${arrow_on}) no-repeat center center;
                            width: 11px;
                            height: 9px;
                            margin-right: 6px;
                            transform: rotate(0deg);
                            transition: transform .35s;
                        }
                    }

                    button {
                        color: ${(props) => props.theme.mainColor};
                    }
                }
            }
        }
        
        &.on {
            display: block;
        }
    }

    .tree-2depth {
        /* display: block; */
        display: none;

        > li {
            font-weight: 300;
            
            > p {
                padding-top: 8.5px;
                margin-left: 16px;
                font-size: 12px;

                &::before {
                    content: '';
                    display: inline-block;
                    background: url(${arrow_off}) no-repeat center center;
                    width: 10px;
                    height: 8px;
                    margin-right: 6px;
                    background-size: contain;
                    transform: rotate(-90deg);
                    transition: transform .35s;
                }

                &.on {
                    color: ${(props) => props.theme.mainColor};

                    &::before {
                        content: '';
                        display: inline-block;
                        background: url(${arrow_on}) no-repeat center center;
                        width: 9px;
                        height: 8px;
                        margin-right: 7px;
                        transform: rotate(0deg);
                        transition: transform .35s;
                    }
                }
            }
        }

        &.on {
            display: block;
        }
    }

    .tree-3depth {
        /* display: block; */
        display: none;

        li {
            font-weight: 300;

            &:not(:last-child) {
                margin-bottom: 7px;
                margin-bottom: 10px;
            }

            &:first-child p {
                padding-top: 9.5px;
            }
            
            p {
                margin-left: 24px;
                font-size: 12px;

                &::before {
                    content: '';
                    display: inline-block;
                    background: url(${arrow_off}) no-repeat center center;
                    width: 10px;
                    height: 8px;
                    margin-right: 6px;
                    background-size: contain;
                    transform: rotate(-90deg);
                    transition: transform .35s;
                }

                &.on {
                    color: ${(props) => props.theme.mainColor};

                    &::before {
                        content: '';
                        display: inline-block;
                        background: url(${arrow_on}) no-repeat center center;
                        width: 9px;
                        height: 8px;
                        margin-right: 7px;
                        transform: rotate(0deg);
                        transition: transform .35s;
                    }
                }
            }
        }

        &.on {
            display: block;
        }

        &.last {
            margin-top: 10px;

            li {
                margin-left: 35px;
                ${(props) => props.theme.flex()};

                > span {
                    font-size: 12px;
                    position: relative;

                    &::before {
                        content: "ㆍ";
                        font-size: 12px;
                        font-weight: 600;
                        position: absolute;
                        left: -12px;
                    }

                    &#alarmOn {
                        color: #FF5D5D;
                        font-weight: bold;
                    }
                }

                > span.selected {
                    color : ${(props) => props.theme.yellowColor};
                }

                div {
                    padding-right: 18px;
                    ${(props) => props.theme.flex()};
                    gap: 14px;

                    .alarmImg {
                        width: 13px;
                        height: 14px;
                        object-fit: none;
                    }
                }
            }
        }
    }

    .tree-4depth {
        /* display: block; */
        display: none;
        margin: 10px 0;

        li {
            margin-left: 44px;
            ${(props) => props.theme.flex()};

            > span {
                font-size: 12px;
                position: relative;

                &::before {
                    content: "ㆍ";
                    font-size: 12px;
                    font-weight: 600;
                    position: absolute;
                    left: -12px;
                }

                &#alarmOn {
                    color: #FF5D5D;
                    font-weight: bold;
                }
            }

            > span.selected {
                color : ${(props) => props.theme.yellowColor};
            }

            div {
                padding-right: 18px;
                ${(props) => props.theme.flex()};
                gap: 14px;

                .alarmImg {
                    width: 13px;
                    height: 14px;
                    object-fit: none;
                }

                .greenDOTT {
                    width: 11px;
                    height: 11px;
                    background: ${(props) => props.theme.greenColor};
                    border-radius: 100%;
                    display: inline-block;
                }

                .grayDOTT {
                    width: 11px;
                    height: 11px;
                    background: ${(props) => props.theme.middleGray};
                    border-radius: 100%;
                    display: inline-block;
                }
            }
        }

        &.on {
            display: block;
        }
    }
`;


/**********************************************************************/
// 네비게이션 바

export const NavigationBarComponent = styled.div`
    width: ${(props) => props.mode === SdmsResource.mode.equipmentDetail ? '251px' : '410px'};
    height: 50px;
    background: transparent linear-gradient(180deg, rgba(34, 42, 49, 1) 0%, rgba(0, 0, 0, 1) 100%) 0% 0% no-repeat padding-box;
    border-radius: 25px;
    position: absolute;
    left: 50%;
    bottom: 29px;
    transform: translate(-51%, 0);

    ul {
        width: 100%;
        height: 50px;
        ${props => props.theme.flex('space-evenly', 'center')};

        .navHomeBtn {
            width: 61px;
            height: 61px;
            border-radius: 50%;
            background-color: ${(props) => props.theme.mainColor};
            border: 6px solid #2B353C;
            text-align: center;
            line-height: 41px;
            position: relative;
            top: -22px;

            &::before {
                ${(props) => props.mode === SdmsResource.mode.equipmentDetail ? `content: "뒤로가기"` : `content: "모드변경"`};
                width: 55px;
                display: block;
                padding: 5px;
                background: transparent linear-gradient(180deg, #222A31 0%, #000000 100%) 0% 0% no-repeat padding-box;
                color: #fff;
                font-size: 12px;
                border-radius: 2px;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-51%, -250%);
                transition: all 0.3s;
                opacity: 0;
                line-height: 1;
            }

            &:hover::before {
                opacity: 1;
            }
        }

        .navList {
            ${props => props.theme.flex('flex-start', 'center')};
        }

        & > li > ul > li {
            width: 77px;
            border-right: 1px dashed #525868;
            text-align: center;

            &:last-child {
                border-right: 0;
            }
        }

        .on.statusInfoIcon {
            background: url(${nav_statusInfo_on}) no-repeat center center;
            width: 22px;
            height: 27px;
        }

        .off.statusInfoIcon {
            background: url(${nav_statusInfo_off}) no-repeat center center;
            width: 22px;
            height: 27px;
        }

        .on.dashboardIcon {
            background: url(${nav_dashBoard_on}) no-repeat center center;
            width: 29px;
            height: 26px;
        }

        .off.dashboardIcon {
            background: url(${nav_dashBoard_off}) no-repeat center center;
            width: 29px;
            height: 26px;
        }

        .on.eventIcon {
            background: url(${nav_event_on}) no-repeat center center;
            width: 27px;
            height: 28px;
        }

        .off.eventIcon {
            background: url(${nav_event_off}) no-repeat center center;
            width: 27px;
            height: 28px;
        }

        .on.workerPositioningIcon {
            background: url(${nav_workerPositioning_on}) no-repeat center center;
            width: 28px;
            height: 23px;
        }

        .off.workerPositioningIcon {
            background: url(${nav_workerPositioning_off}) no-repeat center center;
            width: 28px;
            height: 23px;
        }

        .on.equipmentFaultyIcon {
            background: url(${nav_equipmentFaulty_on}) no-repeat center center;
            width: 33px;
            height: 28px;
        }

        .off.equipmentFaultyIcon {
            background: url(${nav_equipmentFaulty_off}) no-repeat center center;
            width: 33px;
            height: 28px;
        }

        .on.equipmentStatusIcon {
            background: url(${nav_equipmentStatus_on}) no-repeat center center;
            width: 26px;
            height: 30px;
        }

        .off.equipmentStatusIcon {
            background: url(${nav_equipmentStatus_off}) no-repeat center center;
            width: 26px;
            height: 30px;
        }
        
        .navList li button {
            position: relative;

            &::before {
                display: block;
                padding: 5px;
                background: transparent linear-gradient(180deg, #222A31 0%, #000000 100%) 0% 0% no-repeat padding-box;
                color: #fff;
                font-size: 12px;
                border-radius: 2px;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-53%, -223%);
                transition: all 0.3s;
                opacity: 0;
            }

            &:hover::before {
                opacity: 1;
            }
        }

        .statusInfoIcon::before {
            content: '현황정보 팝업창';
            width: 90px;
        }

        .dashboardIcon::before {
            content: '대시보드 팝업창';
            width: 90px;
        }

        .eventIcon::before {
            content: '이벤트 정보 팝업창';
            width: 104px;
        }

        .workerPositioningIcon::before {
            content: '작업자 정보 팝업창';
            width: 104px;
        }

        .equipmentStatusIcon::before {
            content: '사출기 현황정보 팝업창';
            width: 127px;
        }

        .equipmentFaultyIcon::before {
            content: '불량 현황정보 팝업창';
            width: 117px;
        }
    }
`;

export const NavigationModeComponent = styled.div`
    width: 160px;
    height: 100px;
    border-radius: 100px 100px 0 0;
    background-color: ${(props) => props.theme.mainColor};
    position: absolute;
    left: 50%;
    bottom: 45px;
    transform: translate(-52%, 0);

    &::before {
        content: '';
        display: block;
        width: 1px;
        height: 100px;
        border-right: 1px dashed ${(props) => props.theme.darkGray};
        position: absolute;
        left: 50%;
    }

    ul {
        ${(props) => props.theme.flex('space-around', 'center')};
        margin-top: 24px;
        padding: 0 2px;

        .monitoring {
            background: url(${nav_monitoring}) no-repeat center center;
            width: 25px;
            height: 22px;
        }

        .equipment {
            background: url(${nav_equipment}) no-repeat center center;
            width: 20px;
            height: 23px;
        }

        li button {
            position: relative;

            &:hover {
                background: none;
                transition: all 0.3s;
            }

            &::before {
                display: block;
                color: #006548;
                font-size: 12px;
                font-weight: bold;
                position: absolute;
                left: 50%;
                top: 50%;
                transition: all 0.3s;
                opacity: 0;
            }

            &:hover::before {
                opacity: 1;
                transition: all 0.3s;
            }
        }

        li:nth-child(1) > button::before {
            content: '안전';
            width: 24px;
            transform: translate(-50%, -50%);
        }

        li:nth-child(2) > button::before {
            content: '설비';
            width: 24px;
            transform: translate(-66%, -50%);
        }
    }
`


/**********************************************************************/
// 대시보드

export const DashboardComponent = styled(PopupsCommon)`
    position: absolute;
    width: 1050px;
    line-height: 130%;

    &::before {
        content: '';
        display: block;
        width: 38px;
        height: 100%;
        background-color: rgba(32, 223, 168, .28);
        position: absolute;
        top: 0;
        left: 0;
        border-top: 0;
        border-left: 0;
    }

    span, li {
        font-size: 14px;
        padding: 0 1px;
    }

    .dslX {
        position: absolute;
        right: 12px;
        top: 21px;
        z-index: 1;
        cursor: pointer;
    }

    .viewDashboardSectionConts {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-use-select: none;
        user-select: none;
    }

    .viewDashboardTemperature {
        clear: both;
        text-align: center;
        overflow: hidden;
        position: relative;

        &::before {
            content: '';
            display: block;
            background: url(${dashboard_siren}) no-repeat;
            width: 21px;
            height: 21px;
            position: absolute;
            top: 9px;
            left: 9px;
        }

        .detailBtn {
            position: absolute;
            right: 11px;
            top: 7px;
            cursor: pointer;
        }
    }

    .viewDashboardTemperature ul {
        position: relative;
        padding: 9px 38px;
        white-space: wrap;
    }

    .viewDashboardTemperature ul li {
        display: inline-block;
        margin: 0 15px;
    }

    .sectionblank {
        text-align: center;
        border-bottom: 1px dashed #777777;
        display: flex;
        flex-direction: row;
        justify-content: center;
        flex-wrap: wrap;
        padding: 9px 4px 9px 15px;

        &::before {
            content: '';
            display: block;
            background: url(${dashboard_location}) no-repeat;
            width: 16px;
            height: 18px;
            position: absolute;
            top: 10px;
            left: 12px;
        }
    }

    .sectionblank > div {
        margin: 0 10px;
        color: #fff;
    }

    .greenTxt {
        color: ${(props) => props.theme.greenColor};
    }

    .grayTxt {
        color: #7F7F7F;
    }
`;


/**********************************************************************/
// 이벤트 알람 대시보드

export const EventDashboardComponent = styled.div`
    background: rgba(37, 46, 52, .9);
    border: 1px solid ${(props) => props.theme.pinkColor};
    position: absolute;
    top: 80px;
    margin: 0 auto;
    width: 1197px;
    height: 40px;
    line-height: 33px;

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-use-select: none;
    user-select: none;

    &::before {
        content: '';
        display: block;
        position: absolute;
        width: 100%;
        height: 3px;
        background: transparent linear-gradient(270deg, #FFFFFF12 0%, #FF5454 100%) 0% 0% no-repeat padding-box;
        opacity: .65;
    }

    .viewTitleTxt {
        white-space: nowrap;
        width: 100%;
        height: 100%;
        padding: 3px 22px 0 22px;
        font-weight: bold;
        color: ${(props) => props.theme.darkPinkColor};
        position: relative;

        h2 {
            font-size: 14px;
            width: 55px;
            margin-right: 34px;
            display: inline-block;
            color: ${(props) => props.theme.darkPinkColor};
        }

        span {
            font-size: 14px;
            margin-right: 45px;
        }

        .marquee-container {
            position: relative;
            top: -34px;
            margin-left: 78px;
            cursor: default;
        }
    }
`;


/**********************************************************************/
// 이벤트 정보

export const EventComponent = styled(PopupsCommon)`
    position: absolute;

    .dslCont h5 {
        color: #CCCCCC;
        font-size: 11px;
        margin-bottom: 11px;
    }

    .alarmList {
        overflow-y: hidden;
        flex: 1;

        .dseTop {
            border-right: solid 10px transparent;
        }

        .dseTop th {
            color: #fff;
            text-align: center;
            font-size: 10px;
            border: 1px solid #1E1E21;
            border-bottom: none;
            padding: 7px;
            line-height: 1.2em;
            background: #1E1E21;
            font-weight: 300;
        }

        .dseTb {
            position: relative;
            height: calc(100% - 49px);

            tr {
                cursor: pointer;

                &:hover {
                    background-color: rgba(255, 255, 255, .1);
                }
            }

            .selectedAlarm {
                background: rgba(255, 255, 255, .1);

                td {
                    color: ${(props) => props.theme.mainColor};
                }
            }

            .alarmStatusOn {
                text-indent: -9999px;
                background: url(${alarm_on}) no-repeat center center;
            }

            .alarmStatusOff {
                text-indent: -9999px;
                background: url(${alarm_off}) no-repeat center center;
            }

            .yellowTxt {
                color: #F2BE08;
            }

            .orangeTxt {
                color: #FF6D00;
            }

            .redTxt {
                color: #FF5454;
            }

            .pinkTxt {
                color: #FF6A6A;
            }

            .closedAlarm {
                /* pointer-events: none; */

                td {
                    color: ${(props) => props.theme.middleGray};
                }
            }
        }

        .dseTb td {
            color: #fff;
            text-align: center;
            font-size: 10px;
            border: 0.5px dashed #707070;
            border-bottom: none;
            padding: 3px;
            line-height: 1.2em;
            font-weight: 300;
            vertical-align: middle;
            position: relative;

            span {
                font-size: 10px;
            }
        }

        .dseTb > div {
            min-width: 294px;
        }

        .dseTb td span.grn {
            color: #6beb1a;
            font-weight: 500;
        }

        .dseTb td span.red {
            color: #EB4242;
            font-weight: 500;
        }

        .dseTb tr:nth-last-child(1) {
            border-bottom: 0.5px dashed #707070;
        }

        .scrollTable {
            width: calc(100% - 10px);
            table-layout: fixed;

            tr > td {
                
                &:nth-child(2),
                &:nth-child(3) {
                    ${(props) => props.theme.overText()};
                }
            }

            .dseInfo {
                position: absolute;
                top: 20px;
                
                div {
                    margin-left: 14px;

                    p {
                        font-size: 10px;
                        padding: 2px 0;
                    }
                }
            }
        }

        .width_10Pro {
            width: 10%;
        }
        .width_12Pro {
            width: 12%;
        }
        .width_13Pro {
            width: 13%;
        }
        .width_15Pro {
            width: 15%;
        }
        .width_20Pro {
            width: 20%;
        }
        .width_25Pro {
            width: 25%;
        }
        .width_100px {
            width: 100px;
        }
    }

    .alarmDetail {
        width: 100%;
        padding-top: 10px;
        
        .eventIconBox {
            ${(props) => props.theme.flex()};
            gap: 7px;
            margin: 25px 0 10px 0;
            width: 100%;
    
            li {
                width: 25%;
                button {
                    width: 100%;
                    height: 29px;
                    line-height: 25px;
                    text-align: center;
                    background: #3B4248;
                    border-radius: 3px;
                    font-size: 11px;
                    color: #fff;
                    padding: 0;

                    ${(props) => props.theme.flex('center', 'center')};

                    &.eIconSop::before {
                        content: '';
                        background: url(${sop_icon_off}) no-repeat center center;
                        width: 13px;
                        height: 14px;
                        display: inline-block;
                        margin-right: 10px;
                    }
    
                    &.eIconSop:hover {
                        background: transparent linear-gradient(180deg, #2AF1B7 0%, #00C98F 100%) 0% 0% no-repeat padding-box;
                        color: #262F35;
                        font-weight: bold;

                        &::before {
                            background: url(${sop_icon_on}) no-repeat center center;
                        }
                    }

                    &.eIconSop.off {
                        color: #666C70;
                        pointer-events: none;

                        &::before {
                            background: url(${sop_icon_off_gray}) no-repeat center center;
                        }
                    }

                    &.eIconScreenMove::before {
                        content: '';
                        background: url(${screen_move_icon_off}) no-repeat center center;
                        width: 12px;
                        height: 12px;
                        display: inline-block;
                        margin-right: 3px;
                    }
    
                    &.eIconScreenMove:hover {
                        background: transparent linear-gradient(180deg, #2AF1B7 0%, #00C98F 100%) 0% 0% no-repeat padding-box;
                        color: #262F35;
                        font-weight: bold;

                        &::before {
                            background: url(${screen_move_icon_on}) no-repeat center center;
                        }
                    }

                    &.eIconScreenMove.off {
                        color: #666C70;
                        pointer-events: none;

                        &::before {
                            background: url(${screen_move_icon_gray}) no-repeat center center;
                        }
                    }

                    &.eIconSoundOff::before {
                        content: '';
                        background: url(${sound_off_icon_off}) no-repeat center center;
                        width: 16px;
                        height: 13px;
                        display: inline-block;
                        margin-right: 2px;
                    }
    
                    &.eIconSoundOff:hover {
                        background: transparent linear-gradient(180deg, #2AF1B7 0%, #00C98F 100%) 0% 0% no-repeat padding-box;
                        color: #262F35;
                        font-weight: bold;

                        &::before {
                            background: url(${sound_off_icon_on}) no-repeat center center;
                        }
                    }

                    &.eIconSoundOff.off {
                        color: #666C70;
                        pointer-events: none;

                        &::before {
                            background: url(${sound_off_icon_gray}) no-repeat center center;
                        }
                    }

                    &.eIconSoundOn::before {
                        content: '';
                        background: url(${sound_on_icon_off}) no-repeat center center;
                        width: 13px;
                        height: 13px;
                        display: inline-block;
                        margin-right: 2px;
                    }
    
                    &.eIconSoundOn:hover {
                        background: transparent linear-gradient(180deg, #2AF1B7 0%, #00C98F 100%) 0% 0% no-repeat padding-box;
                        color: #262F35;
                        font-weight: bold;

                        &::before {
                            background: url(${sound_on_icon_on}) no-repeat center center;
                        }
                    }

                    &.eIconEnd::before {
                        content: '';
                        background: url(${end_icon_off}) no-repeat center center;
                        width: 15px;
                        height: 15px;
                        display: inline-block;
                        margin-right: 7px;
                    }
    
                    &.eIconEnd:hover {
                        background: transparent linear-gradient(180deg, #2AF1B7 0%, #00C98F 100%) 0% 0% no-repeat padding-box;
                        color: #262F35;
                        font-weight: bold;

                        &::before {
                            background: url(${end_icon_on}) no-repeat center center;
                        }
                    }

                    &.eIconEnd.off {
                        color: #666C70;
                        pointer-events: none;

                        &::before {
                            background: url(${end_icon_off_gray}) no-repeat center center;
                        }
                    }
                }
            }
        }

        .dseInfo {
            ${(props) => props.theme.flex('flex-start', 'center')};
            position: relative;

            em {
                min-width: 58px;
                height: 41px;
                border-radius: 5px;
                text-indent: -9999px;
            }

            .evtFIRE {
                background: url(${evtFIRE}) no-repeat center center;
            }

            .evtSTINK {
                background: url(${evtSTINK}) no-repeat center center;
            }

            .evtGAS {
                background: url(${evtGAS}) no-repeat center center;
            }

            .evtCCTV {
                background: url(${evtCCTV}) no-repeat center center;
            }

            .evtEMERGENCY_BELL {
                background: url(${evtEMERGENCY_BELL}) no-repeat center center;
            }

            .evtWORKER {
                background: url(${evtWORKER}) no-repeat center center;
            }

            .evtEQUIPMENT {
                background: url(${evtEQUIPMENT}) no-repeat center center;
            }

            div {
                margin-left: 14px;

                p {
                    font-size: 10px;
                    padding: 2px 0;
                }
            }

            button {
                position: absolute;
                top: 0;
                right: 0;
                background: url(${event_zoom_off}) no-repeat center center;
                background-size: contain;
                width: 15px;
                height: 15px;

                &:hover,
                &.on {
                    background: url(${event_zoom_on}) no-repeat center center;
                    background-size: contain;
                }
            }
        }
    }
`;


/**********************************************************************/
// 툴바 (지도옵션)

export const ToolbarComponent = styled.div`
    & {
        position: fixed;
        top: 80px;
        left: 20px;
        z-index: 98;
    }

    & button {
        display: block;
        width: 40px;
        height: 40px;
        text-indent: -9999px;
        position: relative;
        z-index: 1;
        background: url(${navigator_icon}) no-repeat center center, ${(props) => props.theme.mainColor};
        cursor: pointer;
        border-radius: 50%;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
    }

    & > div {
        display: block;
        background: #1A1F23;
        width: 0;
        position: absolute;
        left: 20px;
        top: 0;
        border-radius: 0px 20px 20px 0px;
        -moz-border-radius: 0px 20px 20px 0px;
        -webkit-border-radius: 0px 20px 20px 0px;
    }

    .dsnMenu {
        padding-left: 25px;
        padding-right: 10px;
        ${(props) => props.theme.flex()};
    }

    .dsnMenu li {
        visibility: hidden;
    }

    .dsnMenu li button {
        display: block;
        height: 40px;
        cursor: pointer;
        position: relative;
        opacity: .6;
        width: 40px;
        text-indent: 0;

        &:hover {
            opacity: 1;
        }
    }

    .dsnMenu li:nth-child(1) button {
        background: url(${nav_icon1}) no-repeat center
        center;
    }


    .dsnMenu li:nth-child(2) button,
    .dsnMenu.short li:nth-child(1) button {
        background: url(${nav_icon3}) no-repeat center
        center;
    }

    .dsnMenu li:nth-child(3) button,
    .dsnMenu.short li:nth-child(2) button {
        background: url(${nav_icon4}) no-repeat center
        center;
    }

    .dsnMenu li button.on {
        background: url(${nav_icon5_on}) no-repeat center
        center;
    }

    .dsnMenu li button.off {
        background: url(${nav_icon5_off}) no-repeat center
        center;
    } 

    .dsnMenu li button:before {
        display: block;
        background: rgba(17, 25, 40, 0.7);
        color: #fff;
        opacity: 0;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
        font-size: 11px;
        font-family: "dotum", sans-serif;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, 0%);
        margin-top: 25px;
        padding: 0 10px;
        height: 24px;
        line-height: 24px;
        white-space: nowrap;
        -webkit-border-radius: 12px;
        -moz-border-radius: 12px;
        border-radius: 12px;
    }

    .dsnMenu li button:hover:before {
        opacity: 1;
        z-index: 2;
    }

    .dsnMenu li:nth-child(1) button:before {
        content: "홈화면";
    }

    /* .dsnMenu li:nth-child(2) button:before {
        content: "초기화면 설정";
    } */

    .dsnMenu li:nth-child(2) button:before,
    .dsnMenu.short li:nth-child(1) button:before {
        content: "확대";
    }

    .dsnMenu li:nth-child(3) button:before,
    .dsnMenu.short li:nth-child(2) button:before {
        content: "축소";
    }

    .dsnMenu li button.on:before {
        content: "자동회전ON";
    }

    .dsnMenu li button.off:before {
        content: "자동회전OFF";
    }

    .dsnBox {
        display: block;
        position: absolute;
        right: 100%;
        top: 30px;
        width: 52px;
        height: 940px;
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .dsnFloor {
        display: inline-block;
    }

    .dsnFloor li {
        margin-bottom: 5px;
    }

    .dsnFloor li:last-child {
        margin-bottom: 0;
    }

    .dsnFloor li a {
        display: block;
        height: 30px;
        line-height: 28px;
        border: none;
        color: #fff;
        background: rgba(14, 22, 45, 0.85);
        width: 50px;
        text-align: center;
        font-size: 13px;
        border-radius: 15px 0px 0px 15px;
        -moz-border-radius: 15px 0px 0px 15px;
        -webkit-border-radius: 15px 0px 0px 15px;
        cursor: pointer;
    }

    .dsnFloor li a.on {
        background: rgba(14, 22, 45, 0.85);
        color: white;
    }
`;


/**********************************************************************/
// 설비 현황정보

export const EquipmentStatusComponent = styled(PopupsCommon)`
    position: absolute;

    .dslCont {
        padding: 0;
        height: calc(100% - 40px);
        overflow: hidden;

        > ul {
            height: 100%;
            width: 100%;
            ${(props) => props.theme.flex('space-between', 'flex-start')};
            flex-direction: column;

            .equipment {
                width: 100%;
                height: 100%;
                padding: 10px 13px 20px 13px;
                ${(props) => props.theme.flex('space-between', 'flex-start')};
                flex-direction: column;
                cursor: pointer;
                position: relative;

                &:not(:last-child) {
                    border-bottom: 1px dashed #525868;
                }

                .headWrap {
                    ${(props) => props.theme.flex()};
                    width: 100%;
                    
                    div {
                        ${(props) => props.theme.flex('flex-start', 'center')};

                        p {
                            font-size: 14px;
                        }
        
                        button {
                            font-size: 10px;
                            color: #fff;
                            background: transparent linear-gradient(180deg, #262626 0%, #000000 100%) 0% 0% no-repeat padding-box;
                            width: 37px;
                            height: 16px;
                            border-radius: 10px;
                            padding: 3px;
                            margin-left: 6px;
                        }
                    }

                }

                .imageWrap {
                    width: 100%;
                    text-align: center;

                    img {
                        width: 69%;
                    }
                }

                ul {
                    width: 100%;
                    ${(props) => props.theme.flex()};
                    flex-direction: row;

                    li {
                        font-size: 12px;

                        &:nth-child(2) {
                            width: 75%;

                            div {
                                width: 100%;
                                padding: 0 3px;
                                
                                span {
                                    text-indent: -9999px;
                                    display: block;
                                    position: relative;
                                    top: 4px;

                                    &:nth-child(1) {
                                        width: 100%;
                                        height: 9px;
                                        background: #707070;
                                        border-radius: 8px;
                                    }

                                    &:nth-child(2) {
                                        height: 9px;
                                        border-radius: 8px;
                                        position: relative;
                                        top: -5px;
                                        background: #CCCCCC;
                                    }
                                }
                            }
                        }

                        &:nth-child(3) {
                            text-align: right;
                        }
                    }
                }

                &.on {
                    background-color: rgba(255, 255, 255, .1);

                    p, .headWrap > div > button {
                        color: ${(props) => props.theme.mainColor};
                    }

                    ul {
                        li {
                            &:nth-child(2) {
                                div {
                                    span {
                                        &:nth-child(2) {
                                            background: ${(props) => props.theme.mainColor};
                                        }
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
// 불량 현황정보

export const EquipmentFaultyComponent = styled(PopupsCommon)`
    position: absolute;
    width: 410px;
    height: 460px;

    .dslCont {
        height: calc(100% - 40px);
        padding: 10px;

        .moreInfo {
            text-indent: -9999px;
            background: url(${event_zoom_off}) no-repeat center center;
            background-size: contain;
            width: 15px;
            height: 15px;
        }

        .tableBody {
            text-align: center;
            margin-top: 0;

            > li {
                cursor: pointer;

                &:hover {
                    background: rgba(255, 255, 255, .1);
                }

                &.on {
                    color: ${(props) => props.theme.mainColor};
                    background: rgba(255, 255, 255, .1);

                    .moreInfo {
                        width: 15px;
                        height: 15px;
                        background: url(${event_zoom_on}) no-repeat center center;
                        background-size: contain;
                    }
                }
            }

            > li:first-child ul {
                padding: 8px 0;
            }
        }

        .nodata {
            color: ${(props) => props.theme.middleGray};
            font-size: 12px;
            margin-top: 40px;
        }
    }
`;


/**********************************************************************/
// 설비 상세정보

export const EquipmentDetailComponent = styled(PopupsCommon)`
    position: absolute;
    top: 50px;
    left: 0;
    background-color: rgba(1,1,1,0);

    &::before {
        content: '';
        display: none;
    }

    .dslCont {
        width: 100vw;
        height: 100vh;
        padding: 20px 23px;
        text-align: right;
    }
`;


/**********************************************************************/
// 불량 상세이미지

export const EquipmentFaultyImageComponent = styled(PopupsCommon)`
    position: absolute;
    border: 1px solid ${(props) => props.theme.mainColor} !important;

    &::before {
        content: '';
        display: none;
    }

    .dslCont {
        height: calc(100% - 40px);
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        gap: 9px;

        .imageWrap {
            width: 100%;
            height: calc(100% - 190px);

            img {
                width: 100%;
                object-fit: contain;
            }
        }

        .detailWrap {
            div {
                ${(props) => props.theme.flex()};
                height: 21px;
                background: #1E1E21;
                padding: 0 9px;
                
                span {
                    font-size: 10px;
                }
            }

            ul {
                border: 1px solid #525868;

                li {
                    height: 21px;
                    width: 100%;

                    &:not(:last-child) {
                        border-bottom: 1px dashed #525868;
                    }

                    span {
                        height: 100%;
                        line-height: 21px;
                        font-size: 10px;
                        display: inline-block;
                        text-align: center;

                        &:not(:last-child) {
                            border-right: 1px dashed #525868;
                        }

                        &.head {
                            background: rgba(82, 88, 104, .2);
                            width: 20%;
                        }

                        &.body {
                            width: 30%;
                        }
                    }
                }
            }
        }
    }
`;


/**********************************************************************/
// 이벤트 알람 (설비모드일 때)

export const EquipmentEventAlarmComponent = styled(PopupsCommon)`
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 249px;
    height: 258px;

    border: 1px solid ${(props) => props.theme.warningColor};

    &::before {
        border-top: 3px solid ${(props) => props.theme.warningColor};
        border-left: 3px solid ${(props) => props.theme.warningColor};
    }

    .dslTop {
        &::after {
            background: transparent linear-gradient(270deg, #FFFFFF12 0%, #FF5454 100%) 0% 0% no-repeat padding-box;
        }
    }

    .dslTitle {
        color: ${(props) => props.theme.warningColor};
    }

    .dslCont {
        position: relative;

        &::before {
            content: '';
            display: block;
            background: url(${event_icon}) no-repeat center center;
            width: 67px;
            height: 67px;
            margin: 11px auto 0 auto;
        }

        ul {
            position: absolute;
            bottom: 35px;
            left: 0;
            text-align: center;
            width: 100%;
            margin: 0 auto;

            li {

                &:nth-child(1) {
                    font-size: 14px;
                    margin-bottom: 9px;
                }

                &:nth-child(2) {
                    font-size: 12px;
                    margin-bottom: 10px;
                }

                &:nth-child(3) {
                    font-size: 18px;
                    font-weight: bold;
                    color: ${(props) => props.theme.warningColor};
                }
            }
        }
    }
`;


/**********************************************************************/
// 대기오염센서/가스센서 상세정보

export const StatusPsmSensorInfoComponent = styled(PopupsCommon)`
    position: absolute;
    border: 1px solid ${(props) => props.theme.mainColor} !important;

    &::before {
        content: '';
        display: none;
    }

    .dslCont {

        > ul {
            width: 100%;
            height: calc(100% - 30px);

            li {
                ${(props) => props.theme.flex()};
                width: 100%;
                height: 100%;
                text-align: center;

                span:nth-child(1) {
                    width: 45%;
                }
                
                span:nth-child(2) {
                    width: 20%;
                }

                span:nth-child(3) {
                    width: 102px;
                }
            }

            .head {
                height: 28px;
                border-bottom: 1px solid #525868;
                background-color: rgba(22, 22, 22, .5);

                span {
                    font-size: 10px;
                }
            }

            .bodyWrap {
                width: 100%;
                height: 100%;
                ${(props) => props.theme.flex()};
                flex-direction: column;
                background-color: rgba(22, 22, 22, .5);

                .stick {
                    height: 13px;
                    position: relative;
                }

                .stickBlue {
                    display: inline-block;
                    background: url(${stickBlue}) no-repeat center center;
                    width: 55px;
                    height: 13px;
                    position: absolute;
                    left: 24px;
                    animation: ${fadeChart} 0.3s;
                }

                .stickGreen {
                    display: inline-block;
                    background: url(${stickGreen}) no-repeat center center;
                    width: 55px;
                    height: 13px;
                    position: absolute;
                    left: 24px;
                    animation: ${fadeChart} 0.3s;
                }

                .stickOrange {
                    display: inline-block;
                    background: url(${stickOrange}) no-repeat center center;
                    width: 55px;
                    height: 13px;
                    position: absolute;
                    left: 24px;
                    animation: ${fadeChart} 0.3s;
                }

                .stickRed {
                    display: inline-block;
                    background: url(${stickRed}) no-repeat center center;
                    width: 55px;
                    height: 13px;
                    position: absolute;
                    left: 24px;
                    animation: ${fadeChart} 0.3s;
                }

                .stickGray {
                    display: inline-block;
                    background: url(${stickGray}) no-repeat center center;
                    width: 55px;
                    height: 13px;
                    position: absolute;
                    left: 24px;
                    animation: ${fadeChart} 0.3s;
                }
            }

            .body {

                &:not(:last-child) {
                    border-bottom: 1px dashed #525868;
                }

                span {
                    font-size: 12px;
                }

                &.red span {
                    color: #FF5D5D;
                }
            }
        }
    }

    .toolTipWrap {
        width: 102px;
        ${(props) => props.theme.flex('center', 'center')};
        position: relative;

        .toolTip {
            display: inline-block;
            vertical-align: middle;
            width: 17px !important;
            height: 17px;
            text-align: center;
            line-height: 14px;
            color: #fff;
            border: solid 1px #ddd;
            cursor: help;
            position: relative;
            background: url(${tooltip_icon}) no-repeat center center;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
            text-indent: -9999px;
            z-index: 999;
        }

        .toolTipContent {
            display: none;
            position: absolute;
            top: -5px;
            left: 126px;
            background: #232B32;
            border-radius: 4px;

            &.on {
                display: block;
            }

            &::after {
                position: absolute;
                top: 7%;
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
                ${(props) => props.theme.flex()};
                width: 100%;
                height: 20%;

                li {
                    margin: 0 auto;
                }

                li, li > span {
                    color: #CCCCCC;
                    font-size: 10px;
                    width: 100%;
                }

                > li:nth-child(1) {
                    width: ${(props) => props.$facilityType === SdmsResource.facilityType.ATMOSPHERE ? '27%' : '37%'};
                }

                > li:nth-child(2) {
                    width: ${(props) => props.$facilityType === SdmsResource.facilityType.ATMOSPHERE ? '73%' : '63%'};
                }
            }

            .toolTipHead {
                border-bottom: 1px solid #525868;
                height: 26px;

                > li:first-child {
                    border-right: 1px dashed #525868;
                }
            }

            .toolTipBody {
                height: 26px;

                > li:first-child {
                    border-right: 1px dashed #525868;
                }

                &:not(:last-child) {
                    border-bottom: 1px dashed #525868;
                }

                span {
                    color: #fff;
                }

                .chart {
                    width: 100%;

                    li {
                        padding: 0 5px;
                    }

                    div {
                        width: ${(props) => props.$facilityType === SdmsResource.facilityType.ATMOSPHERE ? '90px' : '110px'};
                        line-height: 0;
                        text-align: left;
                    }
                    
                    .blueTxt, .greenTxt, .yellowTxt, .redTxt {
                        margin-right: 4px;

                        &::before {
                            content: '';
                            display: inline-block;
                            width: 6px;
                            height: 6px;
                            border-radius: 50%;
                            margin-right: 5px;
                        }
                    }
                }

                .blueTxt {
                    color: #9FD3FF;

                    &::before {
                        background: #9FD3FF;
                    }
                }

                .greenTxt {
                    color: #68F894;

                    &::before {
                        background: #68F894;
                    }
                }

                .yellowTxt {
                    color: #FBC128;

                    &::before {
                        background: #FBC128;
                    }
                }

                .redTxt {
                    color: #FF7979;

                    &::before {
                        background: #FF7979;
                    }
                }
            }
        }
    }
`;


/**********************************************************************/
// 작업자 정보

export const WorkerInfoComponent = styled(PopupsCommon)`
    position: absolute;

    .dslCont {
        padding: 13px 0 0 0;

        .workerWrap {
            border-bottom: 1px dashed #525868;
            height: calc(100% - 40px);

            h5 {
                padding: 0 13px;
                color: #CCCCCC;
                font-size: 12px;
            }

            ul {
                padding: 15px 13px;
                ${(props) => props.theme.flex()};
                gap: 6px;

                li {
                    text-align: center;
                    width: 25%;
                    color: ${(props) => props.theme.middleGray};

                    &.on {
                        color: #fff;
                    }

                    &#active {
                        color: ${(props) => props.theme.mainColor};

                        p:nth-child(1) {
                            border: 1px solid ${(props) => props.theme.mainColor};
                        }
                    }

                    p:nth-child(1) {
                        font-size: 10px;
                        margin-bottom: 7px;
                        background: #3C454B;
                        border-radius: 4px;
                        height: 56px;
                        ${(props) => props.theme.flex('space-evenly', 'center')};
                        flex-direction: column;

                        > p:first-child::after {
                            display: block;
                            margin: 0 auto;
                        }
                    }
                    
                    &:nth-child(1) > p:first-child::after {
                        content: '';
                        background-image: url(${equipmentBuilding_off});
                        background-size: contain;
                        width: 40px;
                        height: 19px;
                    }

                    &:nth-child(2) > p:first-child::after,
                    &:nth-child(4) > p:first-child::after {
                        content: '';
                        background-image: url(${worker_facility_off});
                        background-size: contain;
                        width: 44px;
                        height: 16px;
                    }

                    &:nth-child(3) > p:first-child::after {
                        content: '';
                        background-image: url(${worker_equipment_off});
                        background-size: contain;
                        width: 32px;
                        height: 17px;
                    }

                    &:nth-child(5) > p:first-child::after {
                        content: '';
                        background-image: url(${worker_people_off});
                        background-size: contain;
                        width: 25px;
                        height: 19px;
                    }

                    &.on:nth-child(1) > p:first-child::after {
                        background-image: url(${equipmentBuilding_on});
                    }

                    &.on:nth-child(2) > p:first-child::after,
                    &.on:nth-child(4) > p:first-child::after {
                        background-image: url(${worker_facility_on});
                    }

                    &.on:nth-child(3) > p:first-child::after {
                        background-image: url(${worker_equipment_on});
                    }

                    &.on:nth-child(5) > p:first-child::after {
                        background-image: url(${worker_people_on});
                    }

                    &#active:nth-child(1) > p:first-child::after {
                        background-image: url(${equipmentBuilding_active});
                    }

                    &#active:nth-child(2) > p:first-child::after,
                    &#active:nth-child(4) > p:first-child::after {
                        background-image: url(${worker_facility_active});
                    }

                    &#active:nth-child(3) > p:first-child::after {
                        background-image: url(${worker_equipment_active});
                    }

                    &#active:nth-child(5) > p:first-child::after {
                        background-image: url(${worker_people_active});
                    }

                    p:nth-child(2) {
                        font-size: 16px;
                        font-weight: bold;
                    }
                }
            }
        }

        .equipmentWrap {
            padding: 13px;
            
            .titleWrap {
                ${(props) => props.theme.flex()};

                h5 {
                    color: #CCCCCC;
                    font-size: 12px;
                }

                button {
                    text-indent: -9999px;
                    background: url(${worker_plus_off}) no-repeat center center;
                    width: 18px;
                    height: 18px;

                    &.on,
                    &:hover {
                        background: url(${worker_plus_on}) no-repeat center center;
                    }
                }
            }

            .chartWrap {
                padding: 8px 0;

                > div {
                    padding: 7px 0px;
                    ${(props) => props.theme.flex()};
                    gap: 11.5px;

                    > div {
                        ${(props) => props.theme.flex()};
                        width: 44%;

                        &:nth-child(1) > .title::before {
                            content: '';
                            display: inline-block;
                            background: url(${worker_ap}) no-repeat center center;
                            width: 23px;
                            height: 21px;
                            margin-right: 9px;
                            position: relative;
                            top: 3px;
                        }
    
                        &:nth-child(2) > .title::before {
                            content: '';
                            display: inline-block;
                            background: url(${worker_tag}) no-repeat center center;
                            width: 23px;
                            height: 15px;
                            margin-right: 9px;
                            position: relative;
                            top: 3px;
                        }
                    }

                    .title {
                        position: relative;
                        top: -3px;
                    }

                    .count {
                        padding: 3px 5px;
                        background-color: rgba(255, 255, 255, .15);
                        border-radius: 2px;
                    }

                    span {
                        font-size: 14px;
                        font-weight: bold;
                    }

                    ul {
                        ${(props) => props.theme.flex('flex-start', 'center')};
                        gap: 17px;
                        padding: 5px 9px;
                        background-color: #161616;
                        border-radius: 3px;

                        li {
                            font-size: 12px;

                            &.normal {
                                color: #53BAFF;

                                &::before {
                                    content: '';
                                    display: inline-block;
                                    width: 10px;
                                    height: 10px;
                                    border-radius: 2px;
                                    background: #53BAFF;
                                    margin-right: 7px;
                                    position: relative;
                                    top: 1px;
                                }
                            }

                            &.gray {
                                color: ${(props) => props.theme.middleGray};

                                &::before {
                                    content: '';
                                    display: inline-block;
                                    width: 10px;
                                    height: 10px;
                                    border-radius: 2px;
                                    background: ${(props) => props.theme.middleGray};
                                    margin-right: 7px;
                                    position: relative;
                                    top: 1px;
                                }
                            }

                            &.change {
                                color: #FF5D5D;

                                &::before {
                                    content: '';
                                    display: inline-block;
                                    width: 10px;
                                    height: 10px;
                                    border-radius: 2px;
                                    background: #FF5D5D;
                                    margin-right: 7px;
                                    position: relative;
                                    top: 1px;
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
// 장비현황 상세정보

export const WorkerInfoEquipmentStatusComponent = styled(PopupsCommon)`
    position: absolute;
    border: 1px solid ${(props) => props.theme.mainColor} !important;

    &::before {
        content: '';
        display: none;
    }

    .dslCont {
        height: calc(100% - 43px);
        position: relative;

        .totalCount {
            font-size: 10px;
            position: absolute;
            top: 15px;
            right: 20px;
        }
    }

    .contentTable {
        height: 100%;

        .tableHead {

            li {

                &:nth-child(1) {
                    width: 5%;
                }

                &:nth-child(2) {
                    width: 15%;
                }

                &:nth-child(3) {
                    width: 15%;
                }

                &:nth-child(4) {
                    width: 15%;
                }

                &:nth-child(5) {
                    width: 20%;
                }

                &:nth-child(6) {
                    width: 15%;
                }

                &:nth-child(7) {
                    width: 15%;
                }
            }
        }

        .tableBody {

            > li {

                ul {

                    li {
                        text-align: center;
                        ${(props) => props.theme.overText()};

                        &:nth-child(1) {
                            width: 5%;
                        }

                        &:nth-child(2) {
                            width: 15%;
                        }

                        &:nth-child(3) {
                            width: 15%;
                        }

                        &:nth-child(4) {
                            width: 15%;
                        }

                        &:nth-child(5) {
                            width: 20%;
                        }

                        &:nth-child(6) {
                            width: 15%;
                        }

                        &:nth-child(7) {
                            width: 15%;
                        }
                    }
                }
            }

            .greenDOTT, .grayDOTT {
                text-indent: -9999px;
                position: relative;
                top: 2px;
            }
        }
    }
`;


/**********************************************************************/
// 이벤트 종료시 조치사항 팝업

export const EventExitMemoComponent = styled(PopupsCommon)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 460px;
    height: 280px;
    z-index: 99;
    background: #232B33;
    
    .dslTop::after {
        display: none;
    }

    .dslTop {
        top: -1px;
    }

    &::before {
        content: '';
        display: block;
        width: 100%;
        height: 3px;
        background: transparent linear-gradient(270deg, #FFFFFF12 0%, #20DFA8 100%) 0% 0% no-repeat padding-box;
        opacity: .65;
        left: 0;
        border: 0;
    }

    .dslCont {
        padding-top: 0;
        align-items: flex-end;

        form {
            width: 100%;
        }

        textarea {
            border: 0;
            display: block;
            width: 100%;
            resize: none;
            height: 191px;
            padding: 10px !important;
            font-family: "dotum", sans-serif;
            font-size: 13px;
            background: #1A1F23;
            color: #fff;
            font-size: 12px;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            cursor: text;
            border-radius: 4px;
            -moz-border-radius: 4px;
            -webkit-border-radius: 4px;
        }

        .eIconEnd {
            width: 68px;
            height: 23px;
            line-height: 22px;
            text-align: center;
            border-radius: 2px;
            font-size: 11px;
            font-weight: bold;
            padding: 0;
            ${(props) => props.theme.flex('center', 'center')};
            margin-top: 12px;
            position: absolute;
            right: 13px;
            bottom: 13px;
            background: #666C70;
            color: #A5A5A5;
            cursor: default;

            &::before {
                content: '';
                background: url(${end_icon}) no-repeat center center;
                width: 15px;
                height: 15px;
                display: inline-block;
                margin-right: 4px;
            }

            &.on {
                background: ${(props) => props.theme.mainColor};
                color: #262F35;
                cursor: pointer;

                &::before {
                    background: url(${end_icon_on}) no-repeat center center;
                }
            }
        }

        &.history {
            padding: 0 13px;

            div {
                width: 100%;
                height: calc(100% - 12px);
                padding: 10px;
                background: #1A1F23;
                border-radius: 4px;
                overflow-y: auto;
                overflow-x: hidden;
                ${(props) => props.theme.scroll()};
                
                p {
                    font-size: 12px;
                }
            }
        }
    }
`;


/**********************************************************************/
// 이벤트 발생시 알람 화면

export const EventAlarmPageComponent = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .8);
    z-index: 99;

    .content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;

        &::before {
            content: '';
            display: block;
            background: url(${event_alarm_icon}) no-repeat center center;
            width: 47px;
            height: 44px;
            margin: 0 auto 15px auto;
        }

        h1 {
            font-size: 40px;
            font-weight: bold;

            &::before {
                content: '';
                display: block;
                width: 442px;
                height: 4px;
                background: transparent linear-gradient(90deg, #00000000 0%, #FF3939 73%, #00000000 100%) 0% 0% no-repeat padding-box;
                margin: 0 auto 20px auto;
            }

            &::after {
                content: '';
                display: block;
                width: 442px;
                height: 4px;
                background: transparent linear-gradient(90deg, #00000000 0%, #FF3939 28%, #00000000 100%) 0% 0% no-repeat padding-box;
                margin: 20px auto 0 auto;
            }
        }

        p {
            font-size: 16px;
            margin: 15px 0 20px 0;
        }

        button {
            width: 69px;
            height: 28px;
            background: transparent linear-gradient(180deg, #FFFFFF 0%, #DBDBDB 100%) 0% 0% no-repeat padding-box;
            border-radius: 6px;
            color: #222A31;
            font-size: 16px;
            font-weight: bold;
        }
    }

`;


/**********************************************************************/
// 작업자 이벤트 상세정보 팝업

export const WorkerEventInfoComponent = styled(PopupsCommon)`
    position: absolute;
    border: 1px solid ${(props) => props.theme.mainColor} !important;

    &::before {
        content: '';
        display: none;
    }

    .dslCont {
        height: calc(100% - 40px);
        overflow: hidden;

        div {
            position: relative;
            width: 312px;
            height: 116.5px;
            margin: 0 auto;
            text-align: center;

            .modelingImg {
                width: 312px;
                object-fit: cover;
            }

            .under_modelingImg_wrap {
                width: 100%;
                height: 100%;
                background-color: #1A1F23;
                border-radius: 4px;

                p {
                    position: absolute;
                    top: 9px;
                    left: 9px;
                    font-size: 12px;
                    font-weight: bold;
                }
            }

            .modelingImg_under {
                width: 118px;
                height: 119px;
            }
            
            .focusIcon {
                position: absolute;
                width: 34.5px;
                height: 34.5px;
                top: 0;
                left: 0;
            }
        }

        ul {
            width: 100%;
            border-radius: 4px;
            background-color: #1A1F23;
            padding: 15px 20px;
            margin-top: 15px;

            li {
                font-size: 12px;

                &:not(:last-child) {
                    margin-bottom: 10px;
                }
            }
        }
    }
`;


/**********************************************************************/
// 열화상카메라 영상정보

export const ThermalImagingCameraComponent = styled(PopupsCommon)`
    position: absolute;
    border: 1px solid ${(props) => props.theme.mainColor} !important;

    &::before {
        content: '';
        display: none;
    }

    .hidden {
        display: none;
    }

    .closeUpBtn {
        position: absolute;
        top: 9px;
        right: 38px;
        z-index: 2;
    }

    .dslTop div {
        ${(props) => props.theme.flex()};
        padding-right: 61px;
        
        p {
            font-size: 12px;
        }
    }

    .dslX {
        right: -12px;
    }

    .viewDashboardCCTVConts {
        height: calc(100% - 73px);
        padding: 10px;
    }

    .viewDashboardCCTVGrid {
        width: 100%;
        height: 100%;
        display: grid;
        padding-right: 10px;
        grid-gap: 10px;
        grid-row-gap: 20px;
        grid-template-rows: 50% 50%;
        grid-template-columns: 50% 50%;

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
        }
    }

    .viewDashboardCCTVGrid .col1row1 {
        grid-column: 1;
        grid-row: 1;
        position: relative;
    }

    .viewDashboardCCTVGrid .col1row1.full {
        width: calc(200% + 10px);
        height: calc(200% + 20px);
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