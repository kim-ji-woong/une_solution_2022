import styled from "styled-components";

import listsFacility from '../../Common/img/imghydrogen/main/listsFacility_icon.svg';
import listsFacility_active from '../../Common/img/imghydrogen/main/listsFacility_icon_active.svg';
import dashboard from '../../Common/img/imghydrogen/main/dashboard_icon.svg';
import dashboard_active from '../../Common/img/imghydrogen/main/dashboard_icon_active.svg';
import eventInfo from '../../Common/img/imghydrogen/main/eventInfo_icon.svg';
import eventInfo_active from '../../Common/img/imghydrogen/main/eventInfo_icon_active.svg';
import eventInfo_disable from '../../Common/img/imghydrogen/main/eventInfo_icon_disable.svg';
import eventInfo_alarm from '../../Common/img/imghydrogen/main/eventInfo_icon_alarm.svg';
import eventInfo_active_alarm from '../../Common/img/imghydrogen/main/eventInfo_icon_active_alarm.svg';
import anomalyDetection from '../../Common/img/imghydrogen/main/anomalyDetection_icon.svg';
import anomalyDetection_active from '../../Common/img/imghydrogen/main/anomalyDetection_icon_active.svg';
import simulation from '../../Common/img/imghydrogen/main/simulation_icon.svg';
import simulation_active from '../../Common/img/imghydrogen/main/simulation_icon_active.svg';
import riskAnalysis from '../../Common/img/imghydrogen/main/riskAnalysis_icon.svg';
import riskAnalysis_active from '../../Common/img/imghydrogen/main/riskAnalysis_icon_active.svg';
import poiViewer from '../../Common/img/imghydrogen/main/poiViewer_icon.svg';
import poiViewer_active from '../../Common/img/imghydrogen/main/poiViewer_icon_active.svg';
import tool3D from '../../Common/img/imghydrogen/main/tool3D_icon.svg';
import tool3D_active from '../../Common/img/imghydrogen/main/tool3D_icon_active.svg';

import conductivity from '../../Common/img/imghydrogen/main/conductivity_icon_disable.svg';
import conductivity_active from '../../Common/img/imghydrogen/main/conductivity_icon.svg';
import flow from '../../Common/img/imghydrogen/main/flow_icon_disable.svg';
import flow_active from '../../Common/img/imghydrogen/main/flow_icon.svg';
import gas from '../../Common/img/imghydrogen/main/gas_icon_disable.svg';
import gas_active from '../../Common/img/imghydrogen/main/gas_icon.svg';
import h2 from '../../Common/img/imghydrogen/main/h2_icon_disable.svg';
import h2_active from '../../Common/img/imghydrogen/main/h2_icon.svg';
import h2low from '../../Common/img/imghydrogen/main/h2low_icon_disable.svg';
import h2low_active from '../../Common/img/imghydrogen/main/h2low_icon.svg';
import o2 from '../../Common/img/imghydrogen/main/o2_icon_disable.svg';
import o2_active from '../../Common/img/imghydrogen/main/o2_icon.svg';
import h2jag from '../../Common/img/imghydrogen/main/h2jag_icon_disable.svg';
import h2jag_active from '../../Common/img/imghydrogen/main/h2jag_icon.svg';
import o2jag from '../../Common/img/imghydrogen/main/o2jag_icon_disable.svg';
import o2jag_active from '../../Common/img/imghydrogen/main/o2jag_icon.svg';
import pressure from '../../Common/img/imghydrogen/main/pressure_icon_disable.svg';
import pressure_active from '../../Common/img/imghydrogen/main/pressure_icon.svg';
import temperature from '../../Common/img/imghydrogen/main/temperature_icon_disable.svg';
import temperature_active from '../../Common/img/imghydrogen/main/temperature_icon.svg'; 
import pvPanel from '../../Common/img/imghydrogen/main/pv_Panel_icon_disable.svg';
import pvPanel_active from '../../Common/img/imghydrogen/main/pv_Panel_icon.svg'; 
import home_icon from '../../Common/img/imghydrogen/main/home_icon.svg';
import home_icon_active from '../../Common/img/imghydrogen/main/home_icon_active.svg';
import centerFocus from '../../Common/img/imghydrogen/main/centerFocus.svg';
import centerFocus_active from '../../Common/img/imghydrogen/main/centerFocus_active.svg';
import zoomIn from '../../Common/img/imghydrogen/main/zoomIn.svg';
import zoomIn_active from '../../Common/img/imghydrogen/main/zoomIn_active.svg';
import zoomOut from '../../Common/img/imghydrogen/main/zoomOut.svg';
import zoomOut_active from '../../Common/img/imghydrogen/main/zoomOut_active.svg';
import rotate from '../../Common/img/imghydrogen/main/rotate_icon.svg';
import rotate_active from '../../Common/img/imghydrogen/main/rotate_icon_active.svg';


export const LNBCommon = styled.div`

    #tooltip {
        cursor: help;
    }

    [data-tooltip-text]{
        position: relative;
    }

    [data-tooltip-text]:hover:before {
        content:attr(data-tooltip-text);
        position: absolute;
        top: 18%;
        left: 111%;
        height: 32px;
        line-height: 30px;
        text-align: center;
        white-space: nowrap;
        padding: 0px 8px;
        border-radius: 4px;
        background-color: #565B69;
        color: #FFFFFF;
        font-size: 14px;
        z-index: 9999;
    }

    [data-tooltip-text]:hover:after{
        content: " ";
        position: absolute;
        border-right: 7px solid #565B69;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        /* transform: translate(-40%, 130%); */
        left: 98%;
        top: 40%; 
    }

    [data-tooltip-poitext]{
        position: relative;
    }

    [data-tooltip-poitext]:hover:before {
        content:attr(data-tooltip-poitext);
        position: absolute;
        top: 14%;
        left: 111%;
        height: 32px;
        line-height: 30px;
        text-align: center;
        white-space: nowrap;
        padding: 0px 8px;
        border-radius: 4px;
        background-color: #565B69;
        color: #FFFFFF;
        font-size: 14px;
        z-index: 9999;
    }

    [data-tooltip-poitext]:hover:after{
        content: " ";
        position: absolute;
        border-right: 7px solid #565B69;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        /* transform: translate(-40%, 130%); */
        left: 98%;
        top: 40%; 
    }
`;


export const LNBComponent = styled(LNBCommon)`
    position: fixed;
    top: 50px;
    left: 0;
    width: 68px;
    height: 100%;
    background: rgba(30, 30, 30, 0.80);
    padding: 20px 10px;
    z-index: 1;

    > ul {
        border-bottom: solid 1px #3C4143;
    }

    .on.dashboardIcon {
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        padding: 10px;
        background: #131313 url(${dashboard_active}) no-repeat center;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        margin-bottom: 24px;
        cursor: pointer;
    }
    .off.dashboardIcon {
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        padding: 10px;
        background: #131313 url(${dashboard}) no-repeat center;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        margin-bottom: 24px;
        cursor: pointer;
    }

    .off.listsFacility{
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        padding: 10px;
        background: #131313 url(${listsFacility}) no-repeat center;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        margin-bottom: 24px;
        cursor: pointer;

        &:hover{
            background: #1E1E1E url(${listsFacility}) no-repeat center;
            box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        }
    }

    .on.listsFacility{
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        padding: 10px;
        background: #131313 url(${listsFacility_active}) no-repeat center;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        margin-bottom: 24px;
        cursor: pointer;
    }

    .dashboard{
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        padding: 10px;
        background: #131313 url(${dashboard}) no-repeat center;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        margin-bottom: 24px;
        cursor: pointer;

        &:hover{
            background: #1E1E1E url(${dashboard}) no-repeat center;
            box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        }

        &.on{
            display: inline-block;
            width: 48px;
            height: 48px;
            border-radius: 8px;
            padding: 10px;
            background: #131313 url(${dashboard_active}) no-repeat center;
            box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
            margin-bottom: 24px;
            cursor: pointer;
        }
    }

    .dashboard_active {
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        padding: 10px;
        background: #131313 url(${dashboard_active}) no-repeat center;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        margin-bottom: 24px;
        cursor: pointer;
    }

    .off.eventInfo {
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        padding: 10px;
        background: #131313 url(${eventInfo}) no-repeat center center;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        margin-bottom: 24px;
        cursor: pointer;

        &:hover{
            background: #1E1E1E url(${eventInfo}) no-repeat center center;
            box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        }
    }

    .on.eventInfo {
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        padding: 10px;
        background: url(${eventInfo_active}) no-repeat center center;
        /* box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40); */
        margin-bottom: 24px;
        cursor: pointer;
    }

    .off.eventInfo.active {
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        padding: 10px;
        background: #131313 url(${eventInfo_alarm}) no-repeat center center;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        margin-bottom: 24px;
        cursor: pointer;

        &:hover{
            background: #1E1E1E url(${eventInfo_alarm}) no-repeat center center;
            box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        }
    }

    .on.eventInfo.active {
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        padding: 10px;
        background: #131313 url(${eventInfo_active_alarm}) no-repeat center center;
        /* box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40); */
        margin-bottom: 24px;
        cursor: pointer;
    }

    .off.eventInfo.disable {
        display: inline-block;
        width: 48px;
        height: 48px;
        padding: 10px;
        background: url(${eventInfo_disable}) no-repeat center;
        margin-bottom: 24px;
        pointer-events: none;
    }

    .off.anomalyDetection{
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        padding: 10px;
        background: #131313 url(${anomalyDetection}) no-repeat center;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        margin-bottom: 24px;
        cursor: pointer;

        &:hover{
            background: #1E1E1E url(${anomalyDetection}) no-repeat center;
            box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        }
    }

    .on.anomalyDetection {
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        padding: 10px;
        background: #131313 url(${anomalyDetection_active}) no-repeat center;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        margin-bottom: 24px;
        cursor: pointer;
    }

    .off.simulation {
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        padding: 10px;
        background: #131313 url(${simulation}) no-repeat center;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        margin-bottom: 30px;
        cursor: pointer;

        &:hover{
            background: #1E1E1E url(${simulation}) no-repeat center;
            box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        }
    }

    .on.simulation {
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        padding: 10px;
        background: #131313 url(${simulation_active}) no-repeat center;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        margin-bottom: 30px;
        cursor: pointer;
    }

    .off.riskAnalysis {
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        padding: 10px;
        background: #131313 url(${riskAnalysis}) no-repeat center;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        margin-bottom: 30px;
        position: relative;
        cursor: pointer;

        &:hover{
            background: #1E1E1E url(${riskAnalysis}) no-repeat center;
            box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        }
    }

    .on.riskAnalysis {
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        padding: 10px;
        background: #131313 url(${riskAnalysis_active}) no-repeat center;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        margin-bottom: 30px;
        position: relative;
        cursor: pointer;
    }

    .riskAnalysisSpan{
        display: block;
    }
`;



export const LNBToolsComponent = styled(LNBCommon)`
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 0;
    top: 544px;
    padding: 0px 10px;
    z-index: 2;

    .poiViewer{
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        padding: 10px;
        background: #131313 url(${poiViewer}) no-repeat center;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        margin-bottom: 24px;
        cursor: pointer;

        &:hover{
            background: #1E1E1E url(${poiViewer}) no-repeat center;
            box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        }
    }

    .poiViewer_active{
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        padding: 10px;
        background: #131313 url(${poiViewer_active}) no-repeat center;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        margin-bottom: 24px;
        cursor: pointer;
    }

    .tool3D{
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        padding: 10px;
        background: #131313 url(${tool3D}) no-repeat center;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        margin-bottom: 24px;
        cursor: pointer;

        &:hover{
            background: #1E1E1E url(${tool3D}) no-repeat center;
            box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        }
    }

    .tool3D_active{
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        padding: 10px;
        background: #131313 url(${tool3D_active}) no-repeat center;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        margin-bottom: 24px;
        cursor: pointer;
    }
`;


//POI 뷰어
export const POIViewerComponent = styled(LNBCommon)`

    .poiViewerBtn{
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        padding: 10px;
        background: #131313 url(${poiViewer}) no-repeat center;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        margin-bottom: 24px;
        cursor: pointer;

        &:hover{
            background: #1E1E1E url(${poiViewer}) no-repeat center;
            box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        }

        &.on{
            background: #131313 url(${poiViewer_active}) no-repeat center;
        }
    }

    & button.poiViewer_active{
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        padding: 10px;
        background: #131313 url(${poiViewer_active}) no-repeat center;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        margin-bottom: 24px;
        cursor: pointer;

    }

    & > div{
        display: none;
        padding: 6px;
        border-radius: 8px;
        border: 1px rgba(255, 255, 255, 0.10);
        background: linear-gradient(180deg, #131313 0%, rgba(29, 29, 29, 0.80) 100%);
        box-shadow: 0px 4px 4px 0px rgba(2, 3, 3, 0.17);
        position: absolute;
        top: 0px;
        left: 80px;

        &.on{
            display: block;
        }

        .conductivity{
            display:inline-block;
            width: 36px;
            height: 36px;
            background: url(${conductivity}) no-repeat center center;
            padding: 6px;
            margin-bottom: 6px;
            cursor: pointer;

            &:hover{
                background: #1E1E1E url(${conductivity}) no-repeat center;
                box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
            }

            &.on{
                display:inline-block;
                width: 36px;
                height: 36px;
                background: url(${conductivity_active}) no-repeat center center;
                padding: 6px;
                margin-bottom: 6px;
                cursor: pointer;
            }
        }

        .flow{
            display:inline-block;
            width: 36px;
            height: 36px;
            background: url(${flow}) no-repeat center center;
            padding: 6px;
            margin-bottom: 6px;
            cursor: pointer;

            &:hover{
                background: #1E1E1E url(${flow}) no-repeat center;
                box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
            }

            &.on{
                display:inline-block;
                width: 36px;
                height: 36px;
                background: url(${flow_active}) no-repeat center center;
                padding: 6px;
                margin-bottom: 6px;
                cursor: pointer;
            }
        }

        .gas{
            display:inline-block;
            width: 36px;
            height: 36px;
            background: url(${gas}) no-repeat center center;
            padding: 6px;
            margin-bottom: 6px;
            cursor: pointer;

            &:hover{
                background: #1E1E1E url(${gas}) no-repeat center;
                box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
            }

            &.on{
                display:inline-block;
                width: 36px;
                height: 36px;
                background: url(${gas_active}) no-repeat center center;
                padding: 6px;
                margin-bottom: 6px;
                cursor: pointer;
            }
        }

        .h2{
            display:inline-block;
            width: 36px;
            height: 36px;
            background: url(${h2}) no-repeat center center;
            padding: 6px;
            margin-bottom: 6px;
            cursor: pointer;

            &:hover{
                background: #1E1E1E url(${h2}) no-repeat center;
                box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
            }

            &.on{
                display:inline-block;
                width: 36px;
                height: 36px;
                background: url(${h2_active}) no-repeat center center;
                padding: 6px;
                margin-bottom: 6px;
                cursor: pointer;
            }
        }

        .h2low{
            display:inline-block;
            width: 36px;
            height: 36px;
            background: url(${h2low}) no-repeat center center;
            padding: 6px;
            margin-bottom: 6px;
            cursor: pointer;

            &:hover{
                background: #1E1E1E url(${h2low}) no-repeat center;
                box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
            }

            &.on{
                display:inline-block;
                width: 36px;
                height: 36px;
                background: url(${h2low_active}) no-repeat center center;
                padding: 6px;
                margin-bottom: 6px;
                cursor: pointer;
            }
        }

        .o2{
            display:inline-block;
            width: 36px;
            height: 36px;
            background: url(${o2}) no-repeat center center;
            padding: 6px;
            margin-bottom: 6px;
            cursor: pointer;

            &:hover{
                background: #1E1E1E url(${o2}) no-repeat center;
                box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
            }

            &.on{
                display:inline-block;
                width: 36px;
                height: 36px;
                background: url(${o2_active}) no-repeat center center;
                padding: 6px;
                margin-bottom: 6px;
                cursor: pointer;
            }
        }

        .pressure{
            display:inline-block;
            width: 36px;
            height: 36px;
            background: url(${pressure}) no-repeat center center;
            padding: 6px;
            margin-bottom: 6px;
            cursor: pointer;

            &:hover{
                background: #1E1E1E url(${pressure}) no-repeat center;
                box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
            }

            &.on{
                display:inline-block;
                width: 36px;
                height: 36px;
                background: url(${pressure_active}) no-repeat center center;
                padding: 6px;
                margin-bottom: 6px;
                cursor: pointer;
            }
        }

        .temperature{
            display:inline-block;
            width: 36px;
            height: 36px;
            background: url(${temperature}) no-repeat center center;
            padding: 6px;
            margin-bottom: 6px;
            cursor: pointer;

            &:hover{
                background: #1E1E1E url(${temperature}) no-repeat center;
                box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
            }

            &.on{
                display:inline-block;
                width: 36px;
                height: 36px;
                background: url(${temperature_active}) no-repeat center center;
                padding: 6px;
                margin-bottom: 6px;
                cursor: pointer;
            }
        }

        .h2jag{
            display:inline-block;
            width: 36px;
            height: 36px;
            background: url(${h2jag}) no-repeat center center;
            padding: 6px;
            margin-bottom: 6px;
            cursor: pointer;

            &:hover{
                background: #1E1E1E url(${h2jag}) no-repeat center;
                box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
            }

            &.on{
                display:inline-block;
                width: 36px;
                height: 36px;
                background: url(${h2jag_active}) no-repeat center center;
                padding: 6px;
                margin-bottom: 6px;
                cursor: pointer;
            }
        }

        .o2jag{
            display:inline-block;
            width: 36px;
            height: 36px;
            background: url(${o2jag}) no-repeat center center;
            padding: 6px;
            margin-bottom: 6px;
            cursor: pointer;

            &:hover{
                background: #1E1E1E url(${o2jag}) no-repeat center;
                box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
            }

            &.on{
                display:inline-block;
                width: 36px;
                height: 36px;
                background: url(${o2jag_active}) no-repeat center center;
                padding: 6px;
                margin-bottom: 6px;
                cursor: pointer;
            }
        }

        .pvPanel{
            display:inline-block;
            width: 36px;
            height: 36px;
            background: url(${pvPanel}) no-repeat center center;
            padding: 6px;
            cursor: pointer;

            &:hover{
                background: #1E1E1E url(${pvPanel}) no-repeat center;
                box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
            }

            &.on{
                display:inline-block;
                width: 36px;
                height: 36px;
                background: url(${pvPanel_active}) no-repeat center center;
                padding: 6px;
                cursor: pointer;
            }
        }
    }
`;


//3D 조작툴
export const Tools3DComponent = styled(LNBCommon)`

    .tool3DBtn{
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        padding: 10px;
        background: #131313 url(${tool3D}) no-repeat center;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        margin-bottom: 24px;
        cursor: pointer;

        &:hover{
            background: #1E1E1E url(${tool3D}) no-repeat center;
            box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        }

        &.on{
            background: #131313 url(${tool3D_active}) no-repeat center;
        }
    }

    & button.poiViewer_active{
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        padding: 10px;
        background: #131313 url(${tool3D_active}) no-repeat center;
        box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
        margin-bottom: 24px;
        cursor: pointer;

    }

    & > div{
        display: none;
        padding: 6px;
        border-radius: 8px;
        border: 1px rgba(255, 255, 255, 0.10);
        background: linear-gradient(180deg, #131313 0%, rgba(29, 29, 29, 0.80) 100%);
        box-shadow: 0px 4px 4px 0px rgba(2, 3, 3, 0.17);
        position: absolute;
        top: 70px;
        left: 80px;

        &.on{
            display: block;
        }

        .home{
            display:inline-block;
            width: 36px;
            height: 36px;
            background: url(${home_icon}) no-repeat center center;
            padding: 6px;
            margin-bottom: 6px;
            cursor: pointer;

            &:hover{
                background: #1E1E1E url(${home_icon}) no-repeat center;
                box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
            }

            &:active{
                display:inline-block;
                width: 36px;
                height: 36px;
                background: url(${home_icon_active}) no-repeat center center;
                background-color: rgba(235, 246, 255, 0.07);
                border-radius: 4px;
                padding: 6px;
                margin-bottom: 6px;
                cursor: pointer;
            }
        }

        .basicView{
            display:inline-block;
            width: 36px;
            height: 36px;
            background: url(${centerFocus}) no-repeat center center;
            padding: 6px;
            margin-bottom: 6px;
            cursor: pointer;

            &:hover{
                background: #1E1E1E url(${centerFocus}) no-repeat center;
                box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
            }

            &:active{
                display:inline-block;
                width: 36px;
                height: 36px;
                background: url(${centerFocus_active}) no-repeat center center;
                background-color: rgba(235, 246, 255, 0.07);
                border-radius: 4px;
                padding: 6px;
                margin-bottom: 6px;
                cursor: pointer;
            }
        }

        .zoomIn{
            display:inline-block;
            width: 36px;
            height: 36px;
            background: url(${zoomIn}) no-repeat center center;
            padding: 6px;
            margin-bottom: 6px;
            cursor: pointer;

            &:hover{
                background: #1E1E1E url(${zoomIn}) no-repeat center;
                box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
            }

            &:active{
                display:inline-block;
                width: 36px;
                height: 36px;
                background: url(${zoomIn_active}) no-repeat center center;
                background-color: rgba(235, 246, 255, 0.07);
                border-radius: 4px;
                padding: 6px;
                margin-bottom: 6px;
                cursor: pointer;
            }
        }

        .zoomOut{
            display:inline-block;
            width: 36px;
            height: 36px;
            background: url(${zoomOut}) no-repeat center center;
            padding: 6px;
            margin-bottom: 6px;
            cursor: pointer;

            &:hover{
                background: #1E1E1E url(${zoomOut}) no-repeat center;
                box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
            }

            &:active{
                display:inline-block;
                width: 36px;
                height: 36px;
                background: url(${zoomOut_active}) no-repeat center center;
                background-color: rgba(235, 246, 255, 0.07);
                border-radius: 4px;
                padding: 6px;
                margin-bottom: 6px;
                cursor: pointer;
            }
        }

        .rotate{
            display:inline-block;
            width: 36px;
            height: 36px;
            background: url(${rotate}) no-repeat center center;
            padding: 6px;
            cursor: pointer;

            &:hover{
                background: #1E1E1E url(${rotate}) no-repeat center;
                box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
            }

            &.on{
                display:inline-block;
                width: 36px;
                height: 36px;
                background: url(${rotate_active}) no-repeat center center;
                //background-color: rgba(235, 246, 255, 0.07);
                border-radius: 4px;
                padding: 6px;
                cursor: pointer;
            }
        }
    }
`;
