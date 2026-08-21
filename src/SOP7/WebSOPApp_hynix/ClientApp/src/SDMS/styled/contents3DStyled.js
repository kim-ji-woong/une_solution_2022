import styled, { keyframes } from "styled-components";
import PR from "../../Root/resource/id";

import "../../Common/css/commonWonik.scss";

import quickButton_statusInfo from '../../Common/image/icon/QuickButton/quickButton_statusInfo.png';
import quickButton_cctv from '../../Common/image/icon/QuickButton/quickButton_cctv.png';
import quickButton_dashBoard from '../../Common/image/icon/QuickButton/quickButton_dashBoard.png';
import quickButton_event from '../../Common/image/icon/QuickButton/quickButton_event.png';
import quickButton_miniMap from '../../Common/image/icon/QuickButton/quickButton_miniMap.png';
import quickButton_manualReport from '../../Common/image/icon/QuickButton/quickButton_manualReport.png';
import quickButton_weatherInfo from '../../Common/image/icon/QuickButton/quickButton_weatherInfo.png';
import quickButton_editMode from '../../Common/image/icon/QuickButton/quickButton_editMode.png';
import quickButton_sensorInfo from '../../Common/image/icon/QuickButton/quickButton_sensorInfo.png';
import quickButton_safetyInfoIcon from '../../Common/image/icon/QuickButton/quickButton_safetyInfoIcon.png';


import wonik_quickButton_statusInfo_on from '../../Common/image/icon/QuickButton/wonik_quickButton_statusInfo_on.png';
import wonik_quickButton_statusInfo_off from '../../Common/image/icon/QuickButton/wonik_quickButton_statusInfo_off.png';
import wonik_quickButton_cctv_on from '../../Common/image/icon/QuickButton/wonik_quickButton_cctv_on.png';
import wonik_quickButton_cctv_off from '../../Common/image/icon/QuickButton/wonik_quickButton_cctv_off.png';
import wonik_quickButton_dashBoard_on from '../../Common/image/icon/QuickButton/wonik_quickButton_dashBoard_on.png';
import wonik_quickButton_dashBoard_off from '../../Common/image/icon/QuickButton/wonik_quickButton_dashBoard_off.png';
import wonik_quickButton_event_on from '../../Common/image/icon/QuickButton/wonik_quickButton_event_on.png';
import wonik_quickButton_event_off from '../../Common/image/icon/QuickButton/wonik_quickButton_event_off.png';
import wonik_quickButton_miniMap_on from '../../Common/image/icon/QuickButton/wonik_quickButton_miniMap_on.png';
import wonik_quickButton_miniMap_off from '../../Common/image/icon/QuickButton/wonik_quickButton_miniMap_off.png';
import wonik_manualReportIcon_on from '../../Common/image/icon/QuickButton/wonik_manualReportIcon_on.png';
import wonik_manualReportIcon_off from '../../Common/image/icon/QuickButton/wonik_manualReportIcon_off.png';
import wonik_weatherInfoIcon_on from '../../Common/image/icon/QuickButton/wonik_weatherInfoIcon_on.png';
import wonik_weatherInfoIcon_off from '../../Common/image/icon/QuickButton/wonik_weatherInfoIcon_off.png';
import wonik_editModeIcon_on from '../../Common/image/icon/QuickButton/wonik_editModeIcon_on.png';
import wonik_editModeIcon_off from '../../Common/image/icon/QuickButton/wonik_editModeIcon_off.png';
import wonik_safetyInfoIcon_on from '../../Common/image/icon/QuickButton/wonik_safetyInfoIcon_on.png';
import wonik_safetyInfoIcon_off from '../../Common/image/icon/QuickButton/wonik_safetyInfoIcon_off.png';
import wonik_workerStatusIcon_on from '../../Common/image/icon/QuickButton/wonik_workerStatusIcon_on.png';
import wonik_workerStatusIcon_off from '../../Common/image/icon/QuickButton/wonik_workerStatusIcon_off.png';
import wonik_quickButton_sensorInfo_on from '../../Common/image/icon/QuickButton/wonik_quickButton_sensorInfo_on.png';
import wonik_quickButton_sensorInfo_off from '../../Common/image/icon/QuickButton/wonik_quickButton_sensorInfo_off.png';
import wonik_quickButton_speeding_on from '../../Common/image/icon/QuickButton/wonik_quickButton_speeding_on.png';
import wonik_quickButton_speeding_off from '../../Common/image/icon/QuickButton/wonik_quickButton_speeding_off.png';

import whitePeople from '../../SDMS/img/popup/whitePeople.png';
import whitehat from '../../SDMS/img/popup/whiteHat_icon.png';

import hydrogen_quickButton_statusInfo_on from '../../Common/img/imghydrogen/HB_facilitiesListIcon_active2.png';
import hydrogen_quickButton_statusInfo_off from '../../Common/img/imghydrogen/HB_facilitiesListIcon_disable2.png';
import hydrogen_quickButton_dashboard_on from '../../Common/img/imghydrogen/HB_dashboardIcon_active2.png';
import hydrogen_quickButton_dashboard_off from '../../Common/img/imghydrogen/HB_dashboardIcon_disable2.png';
import hydrogen_quickButton_event_on from '../../Common/img/imghydrogen/HB_eventIcon_active2.png';
import hydrogen_quickButton_event_off from '../../Common/img/imghydrogen/HB_eventIcon_disable2.png';
import hydrogen_quickButton_detection_on from '../../Common/img/imghydrogen/HB_detectionIcon_active2.png';
import hydrogen_quickButton_detection_off from '../../Common/img/imghydrogen/HB_detectionIcon_disable2.png';
import hydrogen_quickButton_simulation_on from '../../Common/img/imghydrogen/HB_simulationIcon_active2.png';
import hydrogen_quickButton_simulation_off from '../../Common/img/imghydrogen/HB_simulationIcon_disable2.png';
import hydrogen_quickButton_analysis_on from '../../Common/img/imghydrogen/HB_analysisIcon_active2.png';
import hydrogen_quickButton_analysis_off from '../../Common/img/imghydrogen/HB_analysisIcon_disable2.png';

import gyeonggi_waterLevel_on from '../../Common/image/icon/QuickButton/gyeonggi_waterLevel_on.png';
import gyeonggi_waterLevel_off from '../../Common/image/icon/QuickButton/gyeonggi_waterLevel_off.png';
import gyeonggi_electric_on from '../../Common/image/icon/QuickButton/gyeonggi_electric_on.png';
import gyeonggi_electric_off from '../../Common/image/icon/QuickButton/gyeonggi_electric_off.png';
import gyeonggi_ev_on from '../../Common/image/icon/QuickButton/gyeonggi_ev_on.png';
import gyeonggi_ev_off from '../../Common/image/icon/QuickButton/gyeonggi_ev_off.png';
import gyeonggi_earthquake_on from '../../Common/image/icon/QuickButton/gyeonggi_earthquake_on.png';
import gyeonggi_earthquake_off from '../../Common/image/icon/QuickButton/gyeonggi_earthquake_off.png';
import gyeonggi_parking_on from '../../Common/image/icon/QuickButton/gyeonggi_parking_on.png';
import gyeonggi_parking_off from '../../Common/image/icon/QuickButton/gyeonggi_parking_off.png';


/**********************************************************************/


const alarmAnimation = keyframes`
    0% {
        opacity: 0;
    }
    50% {
        opacity: 0.8;
    }
    100% {
        opacity: 0;
    }
`

/**********************************************************************/


export const _Contents3DComponent = {
    soulbrain: {
        colorOn: 'rgba(255, 132, 0, 0.7)',
        colorOff: 'rgba(37, 52, 61, 0.8)',
        statusInfoIconOn: `url(${quickButton_statusInfo}) no-repeat center center, rgba(255, 132, 0, 0.7)`,
        statusInfoIconOff: `url(${quickButton_statusInfo}) no-repeat center center, rgba(37, 52, 61, 0.8)`,
        cctvInfoIconOn: `url(${quickButton_cctv}) no-repeat center center, rgba(255, 132, 0, 0.7)`,
        cctvInfoIconOff: `url(${quickButton_cctv}) no-repeat center center, rgba(37, 52, 61, 0.8)`,
        dashboardIconOn: `url(${quickButton_dashBoard}) no-repeat center center, rgba(255, 132, 0, 0.7)`,
        dashboardIconOff: `url(${quickButton_dashBoard}) no-repeat center center, rgba(37, 52, 61, 0.8)`,
        eventIconOn: `url(${quickButton_event}) no-repeat center center, rgba(255, 132, 0, 0.7)`,
        eventIconOff: `url(${quickButton_event}) no-repeat center center, rgba(37, 52, 61, 0.8)`,
        miniMapIconOn: `url(${quickButton_miniMap}) no-repeat center center, rgba(255, 132, 0, 0.7)`,
        miniMapIconOff: `url(${quickButton_miniMap}) no-repeat center center, rgba(37, 52, 61, 0.8)`,
        manualReportIconOn: `url(${quickButton_manualReport}) no-repeat center center, rgba(255, 132, 0, 0.7)`,
        manualReportIconOff: `url(${quickButton_manualReport}) no-repeat center center, rgba(37, 52, 61, 0.8)`,
        weatherInfoIconOn: `url(${quickButton_weatherInfo}) no-repeat center center, rgba(255, 132, 0, 0.7)`,
        weatherInfoIconOff: `url(${quickButton_weatherInfo}) no-repeat center center, rgba(37, 52, 61, 0.8)`,
        editModeIconOn: `url(${quickButton_editMode}) no-repeat center center, rgba(255, 132, 0, 0.7)`,
        editModeIconOff: `url(${quickButton_editMode}) no-repeat center center, rgba(37, 52, 61, 0.8)`,
        sensorInfoIconOn: `url(${quickButton_sensorInfo}) no-repeat center center, rgba(255, 132, 0, 0.7)`,
        sensorInfoIconOff: `url(${quickButton_sensorInfo}) no-repeat center center, rgba(37, 52, 61, 0.8)`,
        safetyInfoIconOn: `url(${quickButton_safetyInfoIcon}) no-repeat center center, rgba(255, 132, 0, 0.7)`,
        safetyInfoIconOff: `url(${quickButton_safetyInfoIcon}) no-repeat center center, rgba(37, 52, 61, 0.8)`,
        workerInfoIconOn: `url(${whitePeople}) no-repeat center center, rgba(255, 132, 0, 0.7)`,
        workerInfoIconOff: `url(${whitePeople}) no-repeat center center, rgba(37, 52, 61, 0.8)`,
        workerInfoSBIconOn: `url(${whitehat}) no-repeat center center, rgba(255, 132, 0, 0.7)`,
        workerInfoSBIconOff: `url(${whitehat}) no-repeat center center, rgba(37, 52, 61, 0.8)`,
        workerInfoIconSize: '35px',
        dsSoulBoTUlLiAHover: 'rgba(13, 18, 28, 0.9) !important',
        dsSoulBotUlLiASpanFontSize: '12px',
        dsSoulBotUlLiASize: '50px',
        dsSoulBotSize: '670px',
        dsSoulBotMargin: '-250px',
        dsSoulBotUlLiPadding: '0 2px',
    },
    Wonik: {
        colorOn: 'var(--board-view-data-blue-color)',
        colorOff: 'var(--dashboard-color)',
        statusInfoIconOn: `url(${wonik_quickButton_statusInfo_on}) no-repeat center center`,
        statusInfoIconOff: `url(${wonik_quickButton_statusInfo_off}) no-repeat center center`,
        cctvInfoIconOn: `url(${wonik_quickButton_cctv_on}) no-repeat center center`,
        cctvInfoIconOff: `url(${wonik_quickButton_cctv_off}) no-repeat center center`,
        dashboardIconOn: `url(${wonik_quickButton_dashBoard_on}) no-repeat center center`,
        dashboardIconOff: `url(${wonik_quickButton_dashBoard_off}) no-repeat center center`,
        eventIconOn: `url(${wonik_quickButton_event_on}) no-repeat center center`,
        eventIconOff: `url(${wonik_quickButton_event_off}) no-repeat center center`,
        miniMapIconOn: `url(${wonik_quickButton_miniMap_on}) no-repeat center center`,
        miniMapIconOff: `url(${wonik_quickButton_miniMap_off}) no-repeat center center`,
        manualReportIconOn: `url(${wonik_manualReportIcon_on}) no-repeat center center`,
        manualReportIconOff: `url(${wonik_manualReportIcon_off}) no-repeat center center`,
        weatherInfoIconOn: `url(${wonik_weatherInfoIcon_on}) no-repeat center center`,
        weatherInfoIconOff: `url(${wonik_weatherInfoIcon_off}) no-repeat center center`,
        editModeIconOn: `url(${wonik_editModeIcon_on}) no-repeat center center`,
        editModeIconOff: `url(${wonik_editModeIcon_off}) no-repeat center center`,
        sensorInfoIconOn: `url(${wonik_quickButton_sensorInfo_on}) no-repeat center center`,
        sensorInfoIconOff: `url(${wonik_quickButton_sensorInfo_off}) no-repeat center center`,
        safetyInfoIconOn: `url(${wonik_safetyInfoIcon_on}) no-repeat center center`,
        safetyInfoIconOff: `url(${wonik_safetyInfoIcon_off}) no-repeat center center`,
        workerInfoIconOn: `url(${wonik_workerStatusIcon_on}) no-repeat center center`,
        workerInfoIconOff: `url(${wonik_workerStatusIcon_off}) no-repeat center center`,
        dsSoulBoTUlLiAHover: 'rgba(39, 46, 66, 1) !important',
        dsSoulBotUlLiASpanFontSize: '12px',
        dsSoulBotUlLiASize: '50px',
        dsSoulBotMargin: '-298px',
        dsSoulBotUlLiPadding: '0 2px',
    },
    Hydrogen: {
        colorOn: 'var(--board-view-data-blue-color)',
        colorOff: 'var(--dashboard-color)',
        statusInfoIconOn: `url(${hydrogen_quickButton_statusInfo_on}) no-repeat center center`,
        statusInfoIconOff: `url(${hydrogen_quickButton_statusInfo_off}) no-repeat center center`,
        cctvInfoIconOn: `url(${wonik_quickButton_cctv_on}) no-repeat center center`,
        cctvInfoIconOff: `url(${wonik_quickButton_cctv_off}) no-repeat center center`,
        dashboardIconOn: `url(${hydrogen_quickButton_dashboard_on}) no-repeat center center`,
        dashboardIconOff: `url(${hydrogen_quickButton_dashboard_off}) no-repeat center center`,
        eventIconOn: `url(${hydrogen_quickButton_event_on}) no-repeat center center`,
        eventIconOff: `url(${hydrogen_quickButton_event_off}) no-repeat center center`,
        miniMapIconOn: `url(${wonik_quickButton_miniMap_on}) no-repeat center center`,
        miniMapIconOff: `url(${wonik_quickButton_miniMap_off}) no-repeat center center`,
        manualReportIconOn: `url(${wonik_manualReportIcon_on}) no-repeat center center`,
        manualReportIconOff: `url(${wonik_manualReportIcon_off}) no-repeat center center`,
        weatherInfoIconOn: `url(${wonik_weatherInfoIcon_on}) no-repeat center center`,
        weatherInfoIconOff: `url(${wonik_weatherInfoIcon_off}) no-repeat center center`,
        editModeIconOn: `url(${wonik_editModeIcon_on}) no-repeat center center`,
        editModeIconOff: `url(${wonik_editModeIcon_off}) no-repeat center center`,
        sensorInfoIconOn: `url(${wonik_quickButton_sensorInfo_on}) no-repeat center center`,
        sensorInfoIconOff: `url(${wonik_quickButton_sensorInfo_off}) no-repeat center center`,
        safetyInfoIconOn: `url(${wonik_safetyInfoIcon_on}) no-repeat center center`,
        safetyInfoIconOff: `url(${wonik_safetyInfoIcon_off}) no-repeat center center`,
        workerInfoIconOn: `url(${wonik_workerStatusIcon_on}) no-repeat center center`,
        workerInfoIconOff: `url(${wonik_workerStatusIcon_off}) no-repeat center center`,
        detectionIconOn: `url(${hydrogen_quickButton_detection_on}) no-repeat center center`,
        detectionIconOff: `url(${hydrogen_quickButton_detection_off}) no-repeat center center`,
        simulationIconOn: `url(${hydrogen_quickButton_simulation_on}) no-repeat center center`,
        simulationIconOff: `url(${hydrogen_quickButton_simulation_off}) no-repeat center center`,
        analysisIconOn: `url(${hydrogen_quickButton_analysis_on}) no-repeat center center`,
        analysisIconOff: `url(${hydrogen_quickButton_analysis_off}) no-repeat center center`,


        dsSoulBoTUlLiAHover: 'rgba(39, 46, 66, 1) !important',
        dsSoulBotUlLiASpanFontSize: '12px',
        dsSoulBotUlLiASize: '50px',
        dsSoulBotMargin: '-196px',
        dsSoulBotUlLiPadding: '0 2px',
    },
    Gyeonggi: {
        colorOn: 'var(--board-view-data-blue-color)',
        colorOff: 'var(--dashboard-color)',
        statusInfoIconOn: `url(${wonik_quickButton_statusInfo_on}) no-repeat center center`,
        statusInfoIconOff: `url(${wonik_quickButton_statusInfo_off}) no-repeat center center`,
        cctvInfoIconOn: `url(${wonik_quickButton_cctv_on}) no-repeat center center`,
        cctvInfoIconOff: `url(${wonik_quickButton_cctv_off}) no-repeat center center`,
        dashboardIconOn: `url(${wonik_quickButton_dashBoard_on}) no-repeat center center`,
        dashboardIconOff: `url(${wonik_quickButton_dashBoard_off}) no-repeat center center`,
        eventIconOn: `url(${wonik_quickButton_event_on}) no-repeat center center`,
        eventIconOff: `url(${wonik_quickButton_event_off}) no-repeat center center`,
        miniMapIconOn: `url(${wonik_quickButton_miniMap_on}) no-repeat center center`,
        miniMapIconOff: `url(${wonik_quickButton_miniMap_off}) no-repeat center center`,
        manualReportIconOn: `url(${wonik_manualReportIcon_on}) no-repeat center center`,
        manualReportIconOff: `url(${wonik_manualReportIcon_off}) no-repeat center center`,
        weatherInfoIconOn: `url(${wonik_weatherInfoIcon_on}) no-repeat center center`,
        weatherInfoIconOff: `url(${wonik_weatherInfoIcon_off}) no-repeat center center`,
        editModeIconOn: `url(${wonik_editModeIcon_on}) no-repeat center center`,
        editModeIconOff: `url(${wonik_editModeIcon_off}) no-repeat center center`,
        sensorInfoIconOn: `url(${wonik_quickButton_sensorInfo_on}) no-repeat center center`,
        sensorInfoIconOff: `url(${wonik_quickButton_sensorInfo_off}) no-repeat center center`,
        safetyInfoIconOn: `url(${wonik_safetyInfoIcon_on}) no-repeat center center`,
        safetyInfoIconOff: `url(${wonik_safetyInfoIcon_off}) no-repeat center center`,
        workerInfoIconOn: `url(${wonik_workerStatusIcon_on}) no-repeat center center`,
        workerInfoIconOff: `url(${wonik_workerStatusIcon_off}) no-repeat center center`,
        waterLevelOn: `url(${gyeonggi_waterLevel_on}) no-repeat center center`,
        waterLevelOff: `url(${gyeonggi_waterLevel_off}) no-repeat center center`,
        electricOn: `url(${gyeonggi_electric_on}) no-repeat center center`,
        electricOff: `url(${gyeonggi_electric_off}) no-repeat center center`,
        evOn: `url(${gyeonggi_ev_on}) no-repeat center center`,
        evOff: `url(${gyeonggi_ev_off}) no-repeat center center`,
        dsSoulBoTUlLiAHover: 'rgba(39, 46, 66, 1) !important',
        dsSoulBotUlLiASpanFontSize: '12px',
        dsSoulBotUlLiASize: '50px',
        dsSoulBotMargin: '-298px',
        dsSoulBotUlLiPadding: '0 2px',
    },
    CheongSim: {
        colorOn: 'var(--board-view-data-blue-color)',
        colorOff: 'var(--dashboard-color)',
        statusInfoIconOn: `url(${wonik_quickButton_statusInfo_on}) no-repeat center center`,
        statusInfoIconOff: `url(${wonik_quickButton_statusInfo_off}) no-repeat center center`,
        cctvInfoIconOn: `url(${wonik_quickButton_cctv_on}) no-repeat center center`,
        cctvInfoIconOff: `url(${wonik_quickButton_cctv_off}) no-repeat center center`,
        dashboardIconOn: `url(${wonik_quickButton_dashBoard_on}) no-repeat center center`,
        dashboardIconOff: `url(${wonik_quickButton_dashBoard_off}) no-repeat center center`,
        eventIconOn: `url(${wonik_quickButton_event_on}) no-repeat center center`,
        eventIconOff: `url(${wonik_quickButton_event_off}) no-repeat center center`,
        miniMapIconOn: `url(${wonik_quickButton_miniMap_on}) no-repeat center center`,
        miniMapIconOff: `url(${wonik_quickButton_miniMap_off}) no-repeat center center`,
        manualReportIconOn: `url(${wonik_manualReportIcon_on}) no-repeat center center`,
        manualReportIconOff: `url(${wonik_manualReportIcon_off}) no-repeat center center`,
        weatherInfoIconOn: `url(${wonik_weatherInfoIcon_on}) no-repeat center center`,
        weatherInfoIconOff: `url(${wonik_weatherInfoIcon_off}) no-repeat center center`,
        editModeIconOn: `url(${wonik_editModeIcon_on}) no-repeat center center`,
        editModeIconOff: `url(${wonik_editModeIcon_off}) no-repeat center center`,
        sensorInfoIconOn: `url(${wonik_quickButton_sensorInfo_on}) no-repeat center center`,
        sensorInfoIconOff: `url(${wonik_quickButton_sensorInfo_off}) no-repeat center center`,
        safetyInfoIconOn: `url(${wonik_safetyInfoIcon_on}) no-repeat center center`,
        safetyInfoIconOff: `url(${wonik_safetyInfoIcon_off}) no-repeat center center`,
        workerInfoIconOn: `url(${wonik_workerStatusIcon_on}) no-repeat center center`,
        workerInfoIconOff: `url(${wonik_workerStatusIcon_off}) no-repeat center center`,
        dsSoulBoTUlLiAHover: 'rgba(39, 46, 66, 1) !important',
        dsSoulBotUlLiASpanFontSize: '12px',
        dsSoulBotUlLiASize: '50px',
        dsSoulBotMargin: '-298px',
        dsSoulBotUlLiPadding: '0 2px',
    }
}


export const Contents3DComponent = styled.main`
    min-width: 1900px;
    width: 100%;
    height: 100vh;
    overflow: hidden;

    .clfix:after {
        ${(props) => props.theme.variables.clearfix()};
    }

    #dsSoulBot {
        position: fixed;
        z-index: 1; /* 0518 */
        left: 50%;
        transform: translate(-50%, 0);
        bottom: 20px; /* width: calc(100% - 1400px); */
        width: ${_Contents3DComponent[PR.styleMode].dsSoulBotSize}; 
    }

    #dsSoulBot button {
        display: block;
        background: #25343d;
        width: 100%;
        height: 20px;
        cursor: pointer;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
    }

    #dsSoulBot button.edit {
        width: 70%;
        position: absolute;
        left: 50%;
        top: -20px;
        transform: translateX(-50%);
    }

    #dsSoulBot ~ ul {
        position: absolute;
        left: 50%;
        bottom: 30px;
        transform: translate(-50%, 0);
        z-index: 2;

        display: ${props => (props.$siteID === PR.Site.Wonik || props.$siteID === PR.Site.Wonik_A || props.$siteID === PR.Site.Wonik_C || props.$siteID === PR.Site.Wonik_V || props.$siteID === PR.Site.Wonik_S || props.$siteID === PR.Site.Hydrogen || (props.$siteID >= PR.Site.GG_A && props.$siteID <= PR.Site.GG_H)) ? 'flex !important' : null};

        justify-content: center;
        align-items: center;
    }

    #dsSoulBot ~ ul.edit {
        left: 114px;
    }

    #dsSoulBot ~ ul:after {
        content: "";
        display: table;
        clear: both;
    }

    #dsSoulBot ~ ul li {
        float: left;
        padding: ${_Contents3DComponent[PR.styleMode].dsSoulBotUlLiPadding};
        position: relative;
        cursor: pointer;
    }

    #dsSoulBot ~ ul li a {
        display: table;
        width: ${_Contents3DComponent[PR.styleMode].dsSoulBotUlLiASize};
        height: ${_Contents3DComponent[PR.styleMode].dsSoulBotUlLiASize};
        border: solid 1px #fff;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    #dsSoulBot ~ ul li a span {
        display: table-cell;
        width: 100%;
        vertical-align: middle;
        text-align: center;
        color: #fff;
        font-size: ${_Contents3DComponent[PR.styleMode].dsSoulBotUlLiASpanFontSize};
        line-height: 1.1em;
    }

    #dsSoulBot ~ ul li a span em {
        display: none;
    }

    #dsSoulBot ~ ul li a:hover {
        background: ${_Contents3DComponent[PR.styleMode].dsSoulBoTUlLiAHover};
    }

    #dsSoulBot ~ ul li a:hover em {
        display: block;
    }

    /* #dsSoulBot ul li a.on {
        background-color: ${_Contents3DComponent[PR.styleMode].colorOn};
    }

    #dsSoulBot ul li a.off {
        background-color: ${_Contents3DComponent[PR.styleMode].colorOff};
    } */

    .shortCut {
        position: absolute;
        background: #222222;
        color: #fff;
        border: solid 0.5px #737373;
        width: 30px;
        height: 20px;
        left: -5px;
        top: -5px;
        z-index: 1;
        text-align: center;
        padding-top: 8%;
        font-size: 10px;
        opacity: 0.8;
    }

    .hideKey {
        visibility: hidden;
    }

    .on.statusInfoIcon {
        background: ${_Contents3DComponent[PR.styleMode].statusInfoIconOn};
        position: relative;
    }

    .off.statusInfoIcon {
        background: ${_Contents3DComponent[PR.styleMode].statusInfoIconOff};
        position: relative;
    }

    .on.cctvInfoIcon {
        background: ${_Contents3DComponent[PR.styleMode].cctvInfoIconOn};
        position: relative;
    }

    .off.cctvInfoIcon {
        background: ${_Contents3DComponent[PR.styleMode].cctvInfoIconOff};
        position: relative;
    }

    .on.dashboardIcon {
        background: ${_Contents3DComponent[PR.styleMode].dashboardIconOn};
        position: relative;
    }

    .off.dashboardIcon {
        background: ${_Contents3DComponent[PR.styleMode].dashboardIconOff};
        position: relative;
    }

    .on.eventIcon {
        background: ${_Contents3DComponent[PR.styleMode].eventIconOn};
        position: relative;
    }

    .off.eventIcon {
        background: ${_Contents3DComponent[PR.styleMode].eventIconOff};
        position: relative;
    }

    .on.miniMapIcon {
        background: ${_Contents3DComponent[PR.styleMode].miniMapIconOn};
        position: relative;
    }

    .off.miniMapIcon {
        background: ${_Contents3DComponent[PR.styleMode].miniMapIconOff};
        position: relative;
    }

    .on.manualReportIcon {
        background: ${_Contents3DComponent[PR.styleMode].manualReportIconOn};
        position: relative;
    }

    .off.manualReportIcon {
        background: ${_Contents3DComponent[PR.styleMode].manualReportIconOff};
        position: relative;
    }

    .on.weatherInfoIcon {
        background: ${_Contents3DComponent[PR.styleMode].weatherInfoIconOn};
        position: relative;
    }

    .off.weatherInfoIcon {
        background: ${_Contents3DComponent[PR.styleMode].weatherInfoIconOff};
        position: relative;
    }

    .on.editModeIcon {
        background: ${_Contents3DComponent[PR.styleMode].editModeIconOn};
        position: relative;
    }

    .off.editModeIcon {
        background: ${_Contents3DComponent[PR.styleMode].editModeIconOff};
        position: relative;
    }

    .on.sensorInfoIcon {
        background: ${_Contents3DComponent[PR.styleMode].sensorInfoIconOn};
        background-size: ${_Contents3DComponent[PR.styleMode].workerInfoIconSize};
    }

    .off.sensorInfoIcon {
        background: ${_Contents3DComponent[PR.styleMode].sensorInfoIconOff};
        background-size: ${_Contents3DComponent[PR.styleMode].workerInfoIconSize};
    }

    .on.workerInfoIcon {
        background: ${_Contents3DComponent[PR.styleMode].workerInfoIconOn};
        position: relative;
        background-size: ${_Contents3DComponent[PR.styleMode].workerInfoIconSize};
    }

    .off.workerInfoIcon {
        background: ${_Contents3DComponent[PR.styleMode].workerInfoIconOff};
        position: relative;
        background-size: ${_Contents3DComponent[PR.styleMode].workerInfoIconSize};
    }

    .on.workerInfoSBIcon {
        background: ${_Contents3DComponent[PR.styleMode].workerInfoSBIconOn};
        position: relative;
        background-size: ${_Contents3DComponent[PR.styleMode].workerInfoSBIconSize};
    }

    .off.workerInfoSBIcon {
        background: ${_Contents3DComponent[PR.styleMode].workerInfoSBIconOff};
        position: relative;
        background-size: ${_Contents3DComponent[PR.styleMode].workerInfoSBIconSize};
    }

    .on.safetyInfoIcon {
        background: ${_Contents3DComponent[PR.styleMode].safetyInfoIconOn};
        position: relative;
    }

    .off.safetyInfoIcon {
        background: ${_Contents3DComponent[PR.styleMode].safetyInfoIconOff};
        position: relative;
    }

    .on.workerStatusIcon {
        background: ${_Contents3DComponent[PR.styleMode].workerStatusIconOn};
        position: relative;
    }

    .off.workerStatusIcon {
        background: ${_Contents3DComponent[PR.styleMode].workerStatusIconOff};
        position: relative;
    }

    .on.speedingIcon {
        background: url(${wonik_quickButton_speeding_on}) no-repeat center center;
        position: relative;
    }

    .off.speedingIcon {
        background: url(${wonik_quickButton_speeding_off}) no-repeat center center;
        position: relative;
    }

    /* hydrogen */
    .on.detectionIcon {
        background: ${_Contents3DComponent[PR.styleMode].detectionIconOn}; /* 임시 */
        position: relative;
    }

    .off.detectionIcon {
        background: ${_Contents3DComponent[PR.styleMode].detectionIconOff};
        position: relative;
    }

    .on.simulationIcon {
        background: ${_Contents3DComponent[PR.styleMode].simulationIconOn}; /* 임시 */
        position: relative;
    }

    .off.simulationIcon {
        background: ${_Contents3DComponent[PR.styleMode].simulationIconOff};
        position: relative;
    }

    .on.analysisIcon {
        background: ${_Contents3DComponent[PR.styleMode].analysisIconOn}; /* 임시 */
        position: relative;
    }

    .off.analysisIcon {
        background: ${_Contents3DComponent[PR.styleMode].analysisIconOff};
        position: relative;
    }

    /* 경기 */
    .on.waterLevelIcon {
        background: ${_Contents3DComponent[PR.styleMode].waterLevelOn};
        position: relative;
    }
    .off.waterLevelIcon {
        background: ${_Contents3DComponent[PR.styleMode].waterLevelOff};
        position: relative;
    }
    .on.electricIcon {
        background: ${_Contents3DComponent[PR.styleMode].electricOn};
        position: relative;
    }
    .off.electricIcon {
        background: ${_Contents3DComponent[PR.styleMode].electricOff};
        position: relative;
    }
    .on.elevatorIcon {
        background: ${_Contents3DComponent[PR.styleMode].evOn};
        position: relative;
    }
    .off.elevatorIcon {
        background: ${_Contents3DComponent[PR.styleMode].evOff};
        position: relative;
    }
    .on.earthquakeIcon {
        background: url(${gyeonggi_earthquake_on}) no-repeat center center;
        position: relative;
    }
    .off.earthquakeIcon {
        background: url(${gyeonggi_earthquake_off}) no-repeat center center;
        position: relative;
    }
    .on.parkingIcon {
        background: url(${gyeonggi_parking_on}) no-repeat center center;
        position: relative;
    }
    .off.parkingIcon {
        background: url(${gyeonggi_parking_off}) no-repeat center center;
        position: relative;
    }


    .contents3DArea {
        /*메인배경*/
        display: flex;
        flex-direction: column;
        /*justify-content: space-around;*/
        flex-wrap: wrap;
        background-color: #f8faff;
        top: -20px;
        height: 100%;
        /*width: calc(100% -50px);*/
        width: 100%;
        /*padding-left:50px;*/
        align-content: center;
        padding-top: 20px;
        position: relative;
        /*box-shadow: 0px 2px 15px 0px rgb(0 0 0 / 10%);*/
        cursor: default;
    }

    .contents3DArea.loading {
        cursor: wait;
    }
    
    .contents3DArea canvas {
        position: absolute;
        left: 0;
    }

    #areaInput {
        position: absolute;
        border-radius: 5px;
        display: block;
        border: solid 2px #3999ed;
        width: 100px !important;
    }

    #areaInputHidden {
        display: none;
    }

    .alarmedPoiImgs {
        width: 32px !important;
        height: 32px !important;
        border: #ff0000 2px solid;
        z-index: 4;
        position: absolute;
        pointer-events: auto !important;
    }

    .alarmedPoiImgs_img {
        width: 32px;
        height: 32px;
        position: absolute;
        background: #ff0000;
        z-index: 5;
        animation: ${alarmAnimation} 1s infinite ;
    }

    .safetyGrade{
        display: flex;
        width: 316px;
        height: 42px;
        padding: 11px 17px;
        background: transparent linear-gradient(180deg, #1E2F53 0%, #060911 100%) 0% 0% no-repeat padding-box;
        border-radius: 3px;
        box-shadow: 0px 2px 4px #0000002B;
        font-size: 17px;
        color: #fff;    
        position: absolute;
        top: 150px;
        right: 30px;
        z-index: 2;
    }

    .safetyGrade > div {
        display: flex;
        margin-right: 17px; 
    }
    .safetyGrade > div:last-child{
        margin-right: 0px; 
    }
    .safetyFirst{
        color: #5398FF;
    }
    .safetySecond{
        color: #FFD153;
    }
    .safetyThird{
        color: #FF5353;
    }
    .safetyBlank{
        padding: 0px 6px;
    }

    .fpsInfo {
        position: absolute;
        left: 30px;
        bottom: 30px;
        color: #fff;
        font-weight: 600;
    }
`;