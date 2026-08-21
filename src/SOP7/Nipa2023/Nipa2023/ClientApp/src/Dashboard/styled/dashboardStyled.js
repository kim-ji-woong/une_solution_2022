import styled from 'styled-components';

import siren_icon from '../images/siren_icon.png';
import siren_icon_off from '../images/siren_icon_off.png';
import stink_off from '../images/stink_off.png';
import gas_off from '../images/gas_off.png';
import bell_off from '../images/bell_off.png';
import cctv_off from '../images/cctv_off.png';
import stink_on from '../images/stink_on.png';
import gas_on from '../images/gas_on.png';
import bell_on from '../images/bell_on.png';
import cctv_on from '../images/cctv_on.png';
import worker_on from '../images/worker_on.png';
import worker_off from '../images/worker_off.png';
import fire_on from '../images/fire_on.png';
import fire_off from '../images/fire_off.png';
import arrow_down from '../images/arrow_down.png';
import arrow_up from '../images/arrow_up.png';



/**********************************************************************/
// 안전관리 대시보드 공통 css

export const DashboardCommon = styled.div`
    .greenTxt {
        color: ${(props) => props.theme.greenColor};
    }

    section {

        > div {
            background-color: #2E363C;
            position: relative;
            border-radius: 4px;
            overflow: hidden;

            &::before {
                content: '';
                display: block;
                width: 100%;
                height: 3px;
                background: transparent linear-gradient(270deg, #FFFFFF12 0%, #20DFA8 100%) 0% 0% no-repeat padding-box;
                opacity: 0.65;
                position: absolute;
                top: 35px;
            }

            h1 {
                color: ${(props) => props.theme.mainColor};
                font-size: 14px;
                font-weight: bold;
                padding: 12px 13px 9px 13px;
                width: 100%;
            }
        }
    }
`;

export const DashboardComponent = styled(DashboardCommon)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #3B4248;
    padding-top: 50px;

    .dashboardTop {
        ${(props) => props.theme.flex('center', 'center')};
        width: 100%;
        height: 70px;
        font-size: 18px;
        position: relative;

        .sensorWrap {
            ${(props) => props.theme.flex()};

            li {
                margin: 0 25px;

                & > span:first-child {
                    margin-right: 6px;
                }
            }
        }

        p {
            position: absolute;
            right: 30px;
        }
    }

    section {
        height: calc(100% - 75px);
        padding: 0 30px 30px 30px;

        display: grid;
        grid-template-columns: 1fr 4.1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-gap: 15px;
        grid-template-areas:
            'weatherInfo boardViewInfo sensorEventInfo'
            'weatherInfo boardViewInfo sensorEventInfo'
            'weatherInfo boardViewInfo sensorEventInfo'
            'weatherInfo boardViewInfo sensorEventInfo'
            'workerEventAlarm boardViewInfo sensorDetailInfo'
            'workerEventAlarm boardViewInfo sensorDetailInfo'
            'workerEventAlarm boardViewInfo sensorDetailInfo'
            'workerEventAlarm boardViewInfo sensorDetailInfo'
            'workerEventAlarm weeklyInfo sensorDetailInfo'
            'workerEventAlarm weeklyInfo sensorDetailInfo'
            'workerEventAlarm weeklyInfo sensorDetailInfo';
    }

    .workerEventAlarm {
        grid-area: workerEventAlarm;
    }

    .boardViewInfo {
        grid-area: boardViewInfo;
    }

    .sensorEventInfo {
        grid-area: sensorEventInfo;
    }

    .weatherInfo {
        grid-area: weatherInfo;
    }

    .weeklyInfo {
        grid-area: weeklyInfo;
    }

    .sensorDetailInfo {
        grid-area: sensorDetailInfo;
    }
`;


/**********************************************************************/
// 실시간 작업자 관리

export const WorkerEventAlarmComponent = styled(DashboardCommon)`

    .content {
        ${(props) => props.theme.flex()};
        flex-direction: column;
        height: calc(100% - 35px);

        .chartWrap {
            width: 100%;
            margin-top: 22px;

            canvas {
                margin: 0 auto;
            }
        }

        .listWrap {
            width: 100%;
            height: 48%;

            ul {
                height: 100%;

                li:nth-child(1) > span::before {
                    content: '';
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    background-color: ${(props) => props.theme.mainColor};
                    border-radius: 4px;
                }

                li:nth-child(2) > span::before {
                    content: '';
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    background-color: #F7F7F7;
                    border-radius: 4px;
                }

                li:nth-child(3) > span::before {
                    content: '';
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    background-color: #CCCCCC;
                    border-radius: 4px;
                }

                li:nth-child(4) > span::before {
                    content: '';
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    background-color: #A5A5A5;
                    border-radius: 4px;
                }

                li:nth-child(5) > span::before {
                    content: '';
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    background-color: #797979;
                    border-radius: 4px;
                }

                li {
                    height: 20%;
                    padding: 0 18px;
                    ${(props) => props.theme.flex()};
                    border-top: 1px dashed #525868;

                    > span {
                        font-size: 14px;
                        ${(props) => props.theme.flex('flex-start', 'center')};
                        gap: 12px;
                    }

                    div {
                        position: relative;
                        top: -3px;

                        span {
                            
                            &:first-child {
                                font-size: 20px;
                                color: ${(props) => props.theme.mainColor};
                                margin-right: 3px;
                            }
                        }
                    }
                }
            }
        }
        
    }

`;


/**********************************************************************/
// 대시보드 메인

export const BoardViewInfoComponent = styled.div`
    background-color: transparent !important;
    ${(props) => props.theme.flex()};
    position: relative;
    border-radius: 0 !important;

    &::before {
        content: '';
        display: none !important;
    }

    .modelingImgWrap {
        position: absolute;
        top: 50%;
        left: 50%;

        img {
            transform: translate(-50%, -50%);
            width: 650px;
        }

        ul li {
            position: absolute;
            padding: 3px 7px;
            border-radius: 3px;
            background: #CCCCCC;
            border: 4px solid ${(props) => props.theme.darkGray};
            font-size: 20px;
            font-weight: bold;
            color: ${(props) => props.theme.darkGray};
            cursor: pointer;

            &#active {
                background: ${(props) => props.theme.mainColor};
            }

            &.on {
                background: ${(props) => props.theme.warningColor} !important;
            }

            &:nth-child(1) {
                top: 276px;
                left: -307px;
            }

            &:nth-child(2) {
                top: -136px;
                left: -48px;
            }

            &:nth-child(3) {
                top: 225px;
                left: 194px;
            }

            &:nth-child(4) {
                top: 152px;
                left: -298px;
            }

            &:nth-child(5) {
                top: 225px;
                left: 49px;
            }

            &:nth-child(6) {
                top: -129px;
                left: 282px;
            }

            &:nth-child(7) {
                top: -223px;
                left: 287px;
            }

            &:nth-child(8) {
                top: 190px;
                left: -132px;
            }
        }
    }

    .content {
        height: 100%;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        gap: 13px;
    }

    .zoneInfoWrap {
        min-height: 20%;
        width: 262px;
        background-color: ${(props) => props.theme.darkGray};
        border-radius: 2px;
        overflow: hidden;
        cursor: pointer;
        position: relative;
        border: 1px solid transparent;
        flex: auto;

        > div {
            height: 45px;
            line-height: 45px;
            border-bottom: 1px dashed #525868;
            padding: 0 15px;
            ${(props) => props.theme.flex('flex-start', 'center')};

            span {
                width: 19px;
                height: 19px;
                font-size: 16px;
                font-weight: bold;
                color: ${(props) => props.theme.darkGray};
                background-color: #CCCCCC;
                border-radius: 3px;
                margin-right: 8px;
                text-align: center;
                line-height: 19px;
            }

            h5 {
                font-size: 16px;
                font-weight: bold;
                color: #CCCCCC;
            }
        }

        &::before {
            content: '';
            display: block;
            width: 13px;
            height: 15px;
            background: url(${siren_icon_off}) no-repeat center center;
            position: absolute;
            top: 9px;
            right: 9px;
        }
        
        ul {
            padding: 15px;
            height: calc(100% - 45px);
            ${(props) => props.theme.flex('space-evenly', 'flex-start')};
            flex-direction: column;
            gap: 10px;

            .zoneInfo {
                margin: 6px 0;
    
                span {
                    font-size: 13px;
    
                    &.green {
                        color: ${(props) => props.theme.mainColor};
                    }
    
                    &.red {
                        color: ${(props) => props.theme.warningColor};
                    }
                }
            }

            .zoneInfoNone {
                font-size: 13px;
                color: ${(props) => props.theme.middleGray};
            }
        }

        &.active {
            border: 1px solid ${(props) => props.theme.mainColor};

            > div {

                span {
                    background-color: ${(props) => props.theme.mainColor};
                }

                h5 {
                    color: ${(props) => props.theme.mainColor};
                }
            }
        }    

        &.on {
            border: 1px solid ${(props) => props.theme.warningColor};
            position: relative;

            > div {

                span {
                    background-color: ${(props) => props.theme.warningColor};
                }
                
                h5 {
                    color: ${(props) => props.theme.warningColor};
                }
            }


            &::before {
                content: '';
                display: block;
                width: 13px;
                height: 15px;
                background: url(${siren_icon}) no-repeat center center;
                position: absolute;
                top: 9px;
                right: 9px;
            }
        }
    }

`;


/**********************************************************************/
// 센서 이벤트 알람

export const SensorEventInfoComponent = styled(DashboardCommon)`

    .content {
        margin-top: 3px;
        height: calc(100% - 38px);

        ul {
            height: 100%;

            li {
                height: 16.67%;
                ${(props) => props.theme.flex()};
                padding: 0 18px;
                color: ${(props) => props.theme.middleGray};
                cursor: pointer;

                &:not(:last-child) {
                    border-bottom: 1px dashed #525868;
                }

                & > span {
                    ${(props) => props.theme.flex()};
                    font-size: 14px;
                    font-weight: bold;
                }

                &.stink {
                    & > span::before {
                        content: '';
                        display: inline-block;
                        background: url(${stink_on});
                        width: 30px;
                        height: 30px;
                        margin-right: 8px;
                    }
                }

                &.gas {
                    & > span::before {
                        content: '';
                        display: inline-block;
                        background: url(${gas_on});
                        width: 30px;
                        height: 30px;
                        margin-right: 8px;
                    }
                }

                &.emergencyBell {
                    & > span::before {
                        content: '';
                        display: inline-block;
                        background: url(${bell_on});
                        width: 30px;
                        height: 30px;
                        margin-right: 8px;
                    }
                }

                &.cctv {
                    & > span::before {
                        content: '';
                        display: inline-block;
                        background: url(${cctv_on});
                        width: 30px;
                        height: 30px;
                        margin-right: 8px;
                    }
                }

                &.worker {
                    & > span::before {
                        content: '';
                        display: inline-block;
                        background: url(${worker_on});
                        width: 30px;
                        height: 30px;
                        margin-right: 8px;
                    }
                }

                &.fire {
                    & > span::before {
                        content: '';
                        display: inline-block;
                        background: url(${fire_on});
                        width: 30px;
                        height: 30px;
                        margin-right: 8px;
                    }
                }

                & > div {
                    position: relative;
                    top: -1px;

                    & > span {
                        font-size: 14px;
                        margin-left: 4px;
                        color: #fff;

                        &.gray {
                            color: ${(props) => props.theme.middleGray};
                        }
                    }
                }

                &.on {
                    background-color: rgba(255, 255, 255, .1);

                    & > div > span {
                        color: ${(props) => props.theme.mainColor};
                    }
                }

                &#gray {
                    
                    & > div > span {
                        color: ${(props) => props.theme.middleGray};
                    }

                    &.stink {
                        & > span::before {
                            content: '';
                            display: inline-block;
                            background: url(${stink_off});
                            width: 30px;
                            height: 30px;
                            margin-right: 8px;
                        }
                    }

                    &.gas {
                        & > span::before {
                            content: '';
                            display: inline-block;
                            background: url(${gas_off});
                            width: 30px;
                            height: 30px;
                            margin-right: 8px;
                        }
                    }

                    &.emergencyBell {
                        & > span::before {
                            content: '';
                            display: inline-block;
                            background: url(${bell_off});
                            width: 30px;
                            height: 30px;
                            margin-right: 8px;
                        }
                    }

                    &.cctv {
                        & > span::before {
                            content: '';
                            display: inline-block;
                            background: url(${cctv_off});
                            width: 30px;
                            height: 30px;
                            margin-right: 8px;
                        }
                    }

                    &.worker {
                        & > span::before {
                            content: '';
                            display: inline-block;
                            background: url(${worker_off});
                            width: 30px;
                            height: 30px;
                            margin-right: 8px;
                        }
                    }

                    &.fire {
                        & > span::before {
                            content: '';
                            display: inline-block;
                            background: url(${fire_off});
                            width: 30px;
                            height: 30px;
                            margin-right: 8px;
                        }
                    }
                }

                .chartWrap {

                    span {
                        width: 5px;
                        height: 16px;
                        background: #CCCCCC;
                        margin-right: 5px;
                        border-radius: 5px
                    }
                }

                &.on {
                    background-color: rgba(255, 255, 255, .1);

                    & > div > span {
                        color: ${(props) => props.theme.mainColor};
                    }

                    .chartWrap {

                        span {
                            background: #FF5D5D;
                        }
                    }
                }
            }
        }
    }
`;


/**********************************************************************/
// 기상 정보

export const WeatherInfoComponent = styled(DashboardCommon)`
    .content {
        ${(props) => props.theme.flex('space-evenly', 'stretch')};
        flex-direction: column;
        height: calc(100% - 35px);
    
        .todayWrap {
            padding: 20px 20px;
    
            ul {
                ${(props) => props.theme.flex()};
    
                li {
    
                    &:nth-child(1) {
                        text-align: center;
                        
                        p {
                            &:first-child {
                                font-size: 12px;
                                margin-bottom: 7.6px;
                            }
    
                            &:last-child {
                                font-size: 16px;
                                font-weight: 500;
                            }
                        }
                    }
    
                    &:nth-child(2) {
    
                        img {
                            width: 72px;
                            height: 68px;
                        }
                    }
    
                    &:nth-child(3) {
                        text-align: right;
    
                        p {
                            font-size: 12px;
                            color: #CCCCCC;
    
                            &:first-child {
                                color: #A5A5A5;
                            }
    
                            &:not(:last-child) {
                                margin-bottom: 8px;
                            }
                        }
                    }
                }
            }
        }
    
        .weeklyWrap {
            padding: 20px 35px;
            border-top: 1px dashed #525868;
            
            ul {
                ${(props) => props.theme.flex()};
    
                &:first-child {
                    margin-bottom: 25px;
                }
    
                li {
                    text-align: center;
                    width: 45px;

                    img {
                        width: 40px;
                        height: 38px;
                        object-fit: contain;
                    }
    
                    p {
                        font-size: 11px;
                        margin-top: 9px;
                    }
                }
            }
        }
    }
`;


/**********************************************************************/
// 주간 현황

export const WeeklyInfoComponent = styled.div`

    &::before {
        content: '';
        display: none !important;
    }

    padding: 20px;

    .headerWrap {
        ${(props) => props.theme.flex('row', 'center')};

        .selectWrap {
            padding: 5px 9px;
            border-radius: 5px;
            background-color: #3B4349;

            h5 {
                font-size: 16px;
            }
        }

        .buttonWrap {
            margin-left: 20px;

            button {
                font-size: 16px;
                margin-right: 20px;
                color: #9EA1AA;
            }

            .isActive {
                color: #fff;
            }
        }
    }
`;


/**********************************************************************/
// 센서 이벤트 알람 상세정보

export const SensorDetailInfoComponent = styled(DashboardCommon)`

    .titleWrap {
        ${(props) => props.theme.flex()};

        h1 {
            width: auto;
        }

        p {
            font-size: 14px;
            padding: 12px 13px 9px 0;
        }
    }

    .content {
        padding-top: 3px;
        margin: 10px 5px;
        height: calc(100% - 50px);

        &.scrollbar {
            overflow-x: hidden;
            overflow-y: auto !important;
            ${(props) => props.theme.scroll()};
        }
        
        ul {

            li {

                &:nth-child(1) .mainInfoWrap {
                    height: 31px;
                    align-items: flex-start;
                }

                .mainInfoWrap {
                    ${(props) => props.theme.flex()};
                    height: 46px;
                    border-bottom: 1px dashed #525868;
                    color: #CCCCCC;
                    padding: 0 20px;
                    cursor: pointer;

                    & > div:nth-child(1) {
                        width: 65%;
                    }

                    & > div:nth-child(2) {
                        width: 35%;
                        text-align: right;

                        & > span:nth-child(1) {
                            width: 60%;
                            display: inline-block;
                            position: relative;
                            top: 2px;
                            ${(props) => props.theme.overText()};
                        }
                    }
                    
                    span {
                        font-size: 12px;
                    }
    
                    button {
                        text-indent: -9999px;
                        background: url(${arrow_down}) no-repeat center center;
                        width: 13px;
                        height: 10px;
                        margin-left: 20px;
                    }
    
                    div:first-child span:first-child {
                        margin-right: 6px;
                    }

                    &.on {
                        color: #fff;
                        font-weight: bold;

                        button {
                            background: url(${arrow_up}) no-repeat center center;
                        }
                    }
                }

                .detailInfoWrap {
                    display: none;
                    padding: 12px 20px;
                    border-bottom: 1px dashed #525868;

                    &.on {
                        display: block;
                    }

                    li {
                        font-size: 12px;
                    }

                    li:not(:last-child) {
                        margin-bottom: 10px;
                    }
                }
            }
        }
    }
`;


/**********************************************************************/
// MES대시보드

export const DashboardMesComponent = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #3B4248;
    padding-top: 50px;

    .dashboardTop {
        ${(props) => props.theme.flex()};
        width: 100%;
        height: 50px;
        font-size: 16px;
        padding: 3px 40px 0 40px;
        background: #2E363C;

        nav {

            ul {
                ${(props) => props.theme.flex('flex-start', 'center')};

                li {
                    padding: 10px 5px;
                    margin-right: 15px;
                    font-weight: bold;
                    color: #6E6E6E;
                    cursor: pointer;

                    &.on {
                        color: ${(props) => props.theme.mainColor};
                        position: relative;
                        
                        &::before {
                            content: '';
                            display: block;
                            width: 100%;
                            height: 3px;
                            background-color: ${(props) => props.theme.mainColor};
                            position: absolute;
                            bottom: -5px;
                            left: 0;
                        }
                    }
                }
            }
        }

        p {
            color: #CCCCCC;
            position: relative;
            top: -3px;
        }
    }
`;


/**********************************************************************/
// MES대시보드 공통 스타일

export const MesComponentCommon = styled.div`
    background-color: ${(props) => props.theme.darkGray};
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    padding: 16px;

    h5 {
        font-size: 16px;
        margin-bottom: 15px;
    }

    .barChartWrap {
        height: 90%;
    }

    .gaugeChartWrap {

        canvas {
            margin: 35px auto 0 auto;
        }

        .chartLabel {
            font-size: 16px;
            ${(props) => props.theme.flex()};
            width: 325px;
            margin: 0 auto;

            span:first-child {
                position: relative;
                left: 25px;
            }
        }
    }

    .valueWrap {
        width: calc(100% - 50px);
        height: 70px;
        border-radius: 9px;
        background-color: #3B4248;
        text-align: center;
        line-height: 70px;
        position: absolute;
        bottom: 25px;
        left: 25px;
    }

    .doughnutChartWrap {
        width: 100%;
        height: calc(100% - 31px);
        display: flex;
        align-items: center;
    }
`;


/**********************************************************************/
// MES대시보드 - 생산 현황

export const MesProductComponent = styled.section`
    height: calc(100% - 50px);
    width: 100%;
    padding: 35px;

    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-gap: 18px;
    grid-template-areas:
        'productionPerformance achievementRateLine facilityOperationRate'
        'productivityStatus productivityRateLine facilityOperationRate';

    .productionPerformance {
        grid-area: productionPerformance;
    }

    .productivityStatus {
        grid-area: productivityStatus;
    }

    .achievementRateLine {
        grid-area: achievementRateLine;
    }

    .productivityRateLine {
        grid-area: productivityRateLine;
    }

    .facilityOperationRate {
        grid-area: facilityOperationRate;
    }

    h5 {
        &::before {
            content: '';
            display: inline-block;
            width: 15px;
            height: 15px;
            border-radius: 3px;
            margin-right: 8px;
            position: relative;
            top: 2px;
        }
    }
`;


/**********************************************************************/
// MES대시보드 - 생산 현황 - 생산 계획대비 실적 현황

export const ProductionPerformanceComponent = styled(MesComponentCommon)`

    h5::before {
        background-color: #01F5E2;
    }

    .valueWrap > p {
        color: #01F5E2;
        font-size: 40px;
        font-weight: bold;
    }
`;


/**********************************************************************/
// MES대시보드 - 생산 현황 - 생산성 현황

export const ProductivityStatusComponent = styled(MesComponentCommon)`

    h5::before {
        background-color: #25CFD9;
    }

    .valueWrap > p {
        color: #25CFD9;
        font-size: 40px;
        font-weight: bold;
    }
`;


/**********************************************************************/
// MES대시보드 - 생산 현황 - 라인별 달성률

export const AchievementRateLineComponent = styled(MesComponentCommon)`

    h5::before {
        background-color: #01F5E299;
        border: 2px solid #01F5E2;
    }
`;


/**********************************************************************/
// MES대시보드 - 생산 현황 - 라인별 생산성 현황

export const ProductivityRateLineComponent = styled(MesComponentCommon)`
    
    h5::before {
        background-color: #23C2D799;
        border: 2px solid #23C2D7;
    }
`;


/**********************************************************************/
// MES대시보드 - 생산 현황 - 설비 가동률 현황

export const FacilityOperationRateComponent = styled(MesComponentCommon)`
    height: 100%;

    h5::before {
        background-color: #3CB9FD;
    }

    > div {
        display: flex;
        flex-direction: column;
        padding: 13px;
        height: calc(100% - 37px);
        
    }

    .gaugechartArea {
        border-bottom: 1px dashed #525868;
        padding-bottom: 40px;
        margin-bottom: 40px;
    }

    .barChartArea {
        width: 100%;
        height: 50%;
        display: flex;
        justify-content: space-between;
        flex-direction: column;

        li {
            flex: auto;
        }

        .description {
            ${(props) => props.theme.flex()};

            span {
                font-size: 14px;
            }
        }

        .barChart {
            width: 100%;
            margin-top: 10px;
                
            span {
                text-indent: -9999px;
                display: block;
                height: 15px;

                &:nth-child(1) {
                    width: 100%;
                    background: #3B4248;
                }
        
                &:nth-child(2) {
                    position: relative;
                    top: -15px;
                    background: rgba(60, 185, 253, 0.6);
                    border: 2px solid #3CB9FD;
                }
            }
        }
    }

    .valueWrap {
        position: static;
        width: 100%;
        margin-top: 50px
    }

    .valueWrap > p {
        color: #3CB9FD;
        font-size: 40px;
        font-weight: bold;
    }
`;


/**********************************************************************/
// MES대시보드 - 품질 현황
export const MesQualityComponent = styled.section`
    height: calc(100% - 50px);
    width: 100%;
    padding: 35px;

    display: grid;
    grid-template-columns: 1.5fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    grid-gap: 18px;
    grid-template-areas:
        'processDefect monthProcessDefect'
        'defectItem monthProcessDefect'
        'monthDefect monthProcessDefect';

    .processDefect {
        grid-area: processDefect;
    }

    .defectItem {
        grid-area: defectItem;
    }

    .monthDefect {
        grid-area: monthDefect;
    }

    .monthProcessDefect {
        grid-area: monthProcessDefect;
    }

    .lineChartWrap {
        height: 90%;
        width: calc(100% - 31px);
        position: absolute;
        top: 28px;
    }
`;


/**********************************************************************/
// MES대시보드 - 품질 현황 - 공정별 불량 현황

export const ProcessDefectComponent = styled(MesComponentCommon)`

`;


/**********************************************************************/
// MES대시보드 - 품질 현황 - 불량 항목별 현황

export const DefectItemComponent = styled(MesComponentCommon)`

`;


/**********************************************************************/
// MES대시보드 - 품질 현황 - 당월 불량 현황

export const MonthDefectComponent = styled(MesComponentCommon)`

`;


/**********************************************************************/
// MES대시보드 - 품질 현황 - 당월 공정별 불량 현황

export const MonthProcessDefectComponent = styled(MesComponentCommon)`

    .barChartWrap {
        height: calc(100% - 31px);
        padding: 10px;
    }

`;


/**********************************************************************/
// MES대시보드 - 구매 현황

export const MesBuyComponent = styled.section`
    height: calc(100% - 50px);
    width: 100%;
    padding: 35px;

    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-gap: 18px;
    grid-template-areas:
        'dailyStock orderStock orderStock orderStock'
        'buyTable buyTable buyTable buyTable';

    .dailyStock {
        grid-area: dailyStock;
    }

    .orderStock {
        grid-area: orderStock;
    }

    .buyTable {
        grid-area: buyTable;
    }
`;


/**********************************************************************/
// MES대시보드 - 구매 현황 - 일일 입고 현황

export const DailyStockComponent = styled(MesComponentCommon)`

`;


/**********************************************************************/
// MES대시보드 - 구매 현황 - 발주 대비 입고량

export const OrderStockComponent = styled(MesComponentCommon)`

    h5 {
        margin-bottom: 0;
    }

    .barChartWrap {
        height: calc(100% - 14px);
    }
`;


/**********************************************************************/
// MES대시보드 - 구매 현황 - 하단 테이블

export const BuyTableComponent = styled(MesComponentCommon)`
    padding: 0;
    ${(props) => props.$bodyHeight > 10 ? "background-color: #fff;" : null}

    > ul {
        width: 100%;
    }

    .head {
        ${(props) => props.theme.flex()};
        ${(props) => props.$bodyHeight > 10 ? "padding-right: 14px;" : null}
        height: 46px;
        background-color: ${(props) => props.theme.darkGray};

        li:not(:last-child) {
            border-right: 1px dashed #525868;
        }

        li {
            text-align: center;
            line-height: 46px;
            font-size: 18px;

            &:nth-child(1) {
                width: 3%;
            }

            &:nth-child(2) {
                width: 19.4%;
            }

            &:nth-child(3) {
                width: 19.4%;
            }

            &:nth-child(4) {
                width: 19.4%;
            }

            &:nth-child(5) {
                width: 19.4%;
            }

            &:nth-child(6) {
                width: 19.4%;
            }
        }
    }

    .body {
        width: ${(props) => props.$bodyHeight > 10 ? "calc(100% - 6px)" : null};
        height: calc(100% - 46px);
        overflow: auto;
        background-color: #fff;
        ${(props) => props.theme.scrollDark()};
        
        li {
            ${(props) => props.$bodyHeight < 10 ? "background-color: #fff;" : null}

            .bodyContent li {
                border-bottom: 1px dashed #525868;
            }
        }

        .bodyContent {
            ${(props) => props.theme.flex()};
            height: 40px;
            

            li:not(:last-child) {
                border-right: 1px dashed #525868;
            }

            li {
                text-align: center;
                height: 100%;
                line-height: 40px;
                color: ${(props) => props.theme.darkGray};
                font-size: 14px;
                

                &:nth-child(1) {
                    width: 3%;
                }

                &:nth-child(2) {
                    width: 19.4%;
                }

                &:nth-child(3) {
                    width: 19.4%;
                }

                &:nth-child(4) {
                    width: 19.4%;
                }

                &:nth-child(5) {
                    width: 19.4%;
                }

                &:nth-child(6) {
                    width: 19.4%;
                }
            }
        }
    }
`;


/**********************************************************************/
// MES대시보드 - 매출 현황

export const MesSellComponent = styled.section`
    height: calc(100% - 50px);
    width: 100%;
    padding: 35px;

    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-gap: 18px;
    grid-template-areas:
        'todayMoney sellTable sellTable sellTable'
        'todayCount sellTable sellTable sellTable';

    .todayMoney {
        grid-area: todayMoney;
    }

    .todayCount {
        grid-area: todayCount;
    }

    .sellTable {
        grid-area: sellTable;
    }
`;


/**********************************************************************/
// MES대시보드 - 매출 현황 - 당일 금액별 현황

export const TodayMoneyComponent = styled(MesComponentCommon)`

`;


/**********************************************************************/
// MES대시보드 - 매출 현황 - 당일 수량별 현황

export const TodayCountComponent = styled(MesComponentCommon)`

`;


/**********************************************************************/
// MES대시보드 - 매출 현황 - 하단 테이블

export const SellTableComponent = styled(MesComponentCommon)`
    padding: 0;
    ${(props) => props.$bodyHeight > 20 ? "background-color: #fff;" : null}
    position: static;

    #tooltip-area {
        padding: 10px;
        background-color: rgba(93, 88, 89, .9);
        color: #fff;
        font-size: 14px;
        position: absolute;
        border-radius: 5px;
        z-index: 9999;

        &::before {
            content: '';
            display: block;
            width: 11px;
            height: 10px;
            clip-path: polygon(50% 29%, 0% 100%, 100% 100%);
            background-color: rgba(93, 88, 89, .9);
            position: absolute;
            top: -9px;
            left: 20px;
        }
    }

    > ul {
        width: 100%;
    }

    .head {
        ${(props) => props.theme.flex()};
        ${(props) => props.$bodyHeight > 20 ? "padding-right: 14px;" : null}
        height: 46px;
        background-color: ${(props) => props.theme.darkGray};

        li:not(:last-child) {
            border-right: 1px dashed #525868;
        }

        li {
            text-align: center;
            line-height: 46px;
            font-size: 18px;

            &:nth-child(1) {
                width: 5%;
            }

            &:nth-child(2) {
                width: 13.9%;
            }

            &:nth-child(3) {
                width: 13.9%;
            }

            &:nth-child(4) {
                width: 13.9%;
            }

            &:nth-child(5) {
                width: 13.9%;
            }

            &:nth-child(6) {
                width: 13.9%;
            }

            &:nth-child(7) {
                width: 13.9%;
            }

            &:nth-child(8) {
                width: 13.9%;
            }
        }
    }

    .body {
        width: ${(props) => props.$bodyHeight > 20 ? "calc(100% - 6px)" : null};
        height: calc(100% - 86px);
        overflow: auto;
        background-color: #fff;
        ${(props) => props.theme.scrollDark()};
        
        li {
            ${(props) => props.$bodyHeight < 20 ? "background-color: #fff;" : null}

            .bodyContent li {
                border-bottom: 1px dashed #525868;
            }
        }

        .bodyContent {
            ${(props) => props.theme.flex()};
            height: 40px;

            li:not(:last-child) {
                border-right: 1px dashed #525868;
            }

            li {
                text-align: center;
                height: 100%;
                line-height: 40px;
                color: ${(props) => props.theme.darkGray};
                font-size: 14px;
                padding: 0 3px;
                position: relative;
                cursor: default;
                ${(props) => props.theme.overText()};

                span {
                    font-size: 14px;
                }

                &:nth-child(1) {
                    width: 5%;
                }

                &:nth-child(2) {
                    width: 13.9%;
                }

                &:nth-child(3) {
                    width: 13.9%;
                }

                &:nth-child(4) {
                    width: 13.9%;
                }

                &:nth-child(5) {
                    width: 13.9%;
                }

                &:nth-child(6) {
                    width: 13.9%;
                }

                &:nth-child(7) {
                    width: 13.9%;
                }

                &:nth-child(8) {
                    width: 13.9%;
                }
            }
        }
    }

    .total {
        background-color: #E1E1E1;
        ${(props) => props.theme.flex()};
        ${(props) => props.$bodyHeight > 20 ? "padding-right: 14px;" : null}
        height: 40px;

        li:not(:last-child) {
            border-right: 1px dashed #525868;
        }

        li {
            text-align: center;
            line-height: 40px;
            font-weight: bold;
            color: ${(props) => props.theme.darkGray};
            ${(props) => props.theme.overText()};

            span {
                font-size: 14px;
            }

            &:nth-child(1) {
                width: 5%;
            }

            &:nth-child(2) {
                width: 13.9%;
            }

            &:nth-child(3) {
                width: 13.9%;
            }

            &:nth-child(4) {
                width: 13.9%;
            }

            &:nth-child(5) {
                width: 13.9%;
            }

            &:nth-child(6) {
                width: 13.9%;
            }

            &:nth-child(7) {
                width: 13.9%;
            }

            &:nth-child(8) {
                width: 13.9%;
            }
        }
    }
`;