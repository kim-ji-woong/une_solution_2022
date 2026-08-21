import styled from 'styled-components';
import '../../Common/css/commonWonik.scss';

import campusImgA from '../../Common/img/imgwonik/board_view_campus_img_a.jpg'
import campusImgH from '../../Common/img/imgwonik/board_view_campus_img_h.png'
import campusImgC from '../../Common/img/imgwonik/board_view_campus_img_c.png'
import campusImgS from '../../Common/img/imgwonik/board_view_campus_img_s.png'
import campusImgV from '../../Common/img/imgwonik/board_view_campus_img_v.jpg'
import campusDetialImg from '../../Common/img/imgwonik/board_view_campus_img_1220.png'
import campusDetialImgS from '../../Common/img/imgwonik/board_view_campus_img_s_detail.png'
import peopleIcon from '../../Common/img/imgwonik/board_people_icon.png'
import humanIcon from '../../Common/img/imgwonik/board_human_icon.png'
import identificationIcon from '../../Common/img/imgwonik/board_identificationNew_icon.png'
import arrowUpIcon from '../../Common/img/imgwonik/board_arrow_up_icon.png'
import arrowDownIcon from '../../Common/img/imgwonik/board_arrow_down_icon.png'
import arrowLeftGray from '../../Common/img/imgwonik/board_arrow_left_gray_icon.png'
import arrowLeftWhite from '../../Common/img/imgwonik/board_arrow_left_white_icon.png'
import arrowRightGray from '../../Common/img/imgwonik/board_arrow_right_gray_icon.png'
import arrowRightWhite from '../../Common/img/imgwonik/board_arrow_right_white_icon.png'
import selectArrow from '../../Common/img/imgwonik/board_select_arrow.png'
import selectArrowUp from '../../Common/img/imgwonik/board_select_arrow2.png'
import cubeIcon from '../../Common/img/imgwonik/board_cube_icon.png'
import backArrow from '../../Common/img/imgwonik/board_back_arrow.png'
import bellIcon from '../../Common/img/imgwonik/board_bell_icon.png'
import minimap_arrow from '../../Common/img/imgwonik/minimap_arrow.png'
import bellIconDisabled from '../../Common/img/imgwonik/board_bell_icon_disabled.png'
import board_arrow_blue from '../../Common/img/imgwonik/board_arrow_blue.png'
import gridPlayBtn from '../../Common/img/imgwonik/gridPlay_button.png';



/**********************************************************************/

export const Dashboard = styled.section`
    color: var(--white-color);
    padding: 40px;
    overflow-x: hidden;
    height: 95vh;

    display: grid;
    grid-template-columns: 1fr 4.2fr 1fr;
    grid-template-rows: 213px 1fr 1fr 1fr;
    grid-gap: 20px;
    grid-template-areas:
        'access-area board-view-area sensor-area'
        'access-area board-view-area perception-area'
        'access-area board-view-area perception-area'
        'operation-area weekly-area weather-area';
   
    .gridMovieBox{
        position: absolute;
        z-index: 2;
        left: 440px;
        top: 16px;
        display: flex;
        color: #5398FF;
        font-size: 16px;
        font-weight: 600;
        border-left: 1px solid var(--middle-gray-color);
        padding-left: 19px;
        letter-spacing: 0px;
        cursor: pointer;
    }

    .gridPlayBtn{
        display: inline-block;
        width: 16px;
        height: 16px;
        background:url(${gridPlayBtn}) no-repeat center center;
        margin-left: 6px;
    }

    > div {
        background-color: var(--dashboard-color);
        border-radius: 10px;
    }

    .access-area {
        grid-area: access-area;
        position: relative;
    }

    .board-view-area {
        grid-area: board-view-area;
    }

    .board-view-area-security-mode {
        grid-area: 1/1/5/-1;
        z-index: 1;
    }

    .sensor-area {
        grid-area: sensor-area;
    }

    .perception-area {
        grid-area: perception-area;
    }

    .operation-area {
        grid-area: operation-area;
    }

    .weekly-area {
        grid-area: weekly-area;
    }

    .weather-area {
        grid-area: weather-area;
    }
`


/**********************************************************************/


export const BoardView = styled.div`
    display: flex;
    overflow: hidden;

    .campusS {
        background-color: var(--board-view-background-color);
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        
        .campus-img {
            width: 100%;
            height: 100%;
            opacity: 0.5;

            &.campus-a {
                background:url(${campusImgA}) no-repeat;
                background-position-x: 51%;
                background-position-y: 50%;
                background-size: auto 108%;
            }

            &.campus-v {
                background:url(${campusImgV}) no-repeat;
                background-position-x: 32%;
                background-position-y: -46px;
                background-size: auto 108%;
            }

            &.campus-h {
                background:url(${campusImgH}) no-repeat;
                background-position-x: 10%;
                background-position-y: 80%;
                background-size: auto 108%;
            } 

            &.campus-c {
                background:url(${campusImgC}) no-repeat;
                background-position-x: 58%;
                background-position-y: 80%;
                background-size: auto 114%; 
            }

            &.campus-s {
                background:url(${campusImgS}) no-repeat;
                background-position-x: 60%;
                background-position-y: 40%;
                background-size: auto 104%;
            }

            &::before {
                content: '';
                display: block;
                position: absolute;
                width: 100%;
                height: 50%;
                position: absolute;
                top: 50%;
                background: transparent linear-gradient(180deg, #00000000 0%, #0E162D 46%, #0E162DCC 100%) 0% 0% no-repeat; 
            }
        }


        .campus-img-notShadow {
            width: 100%;
            height: 100%;
            opacity: 0.5;

            &.campus-a {
                background:url(${campusImgA}) no-repeat;
                background-position-x: 51%;
                background-position-y: 50%;
                background-size: auto 108%;
            }

            &.campus-v {
                background:url(${campusImgV}) no-repeat;
                background-position-x: 32%;
                background-position-y: -46px;
                background-size: auto 108%;
            }

            &.campus-h {
                background:url(${campusImgH}) no-repeat;
                background-position-x: 10%;
                background-position-y: 80%;
                background-size: auto 108%;
            } 

            &.campus-c {
                background:url(${campusImgC}) no-repeat;
                background-position-x: 58%;
                background-position-y: 80%;
                background-size: auto 114%; 
            }

            &.campus-s {
                background:url(${campusImgS}) no-repeat;
                background-position-x: 60%;
                background-position-y: 40%;
                background-size: auto 104%;
            }

            &::before {
                content: '';
                display: block;
                position: absolute;
                width: 100%;
                position: absolute;
                top: 50%;
                background: transparent linear-gradient(180deg, #00000000 0%, #0E162D 46%, #0E162DCC 100%) 0% 0% no-repeat;
            }
        }

        .title {
            position : absolute;
            top: 30px;
            left: 50%;
            transform: translate(-50%, 0%);
            font-size: 1.1rem;
            font-weight: bold;
        }

        .averageScore{
            display: flex;
            width: 151px;
            /* height: 28px; */
            position : absolute;
            top: 60px;
            left: 50%;
            transform: translate(-50%, 0%);
            font-size: 16px;
            font-weight: 600;
            border: solid 1px #5398FF;
            border-radius: 3px;
            box-shadow: 0px 0px 2px #5398FF;
        }

        .averageScore > span{
            display: block;
            width: 75px;
            height: 28px;
            line-height: 28px;
            background: transparent linear-gradient(90deg, #7AAFFF 0%, #2C81FF 100%) 0% 0% no-repeat padding-box;
            text-align: center;
            color: #0E162D;
            letter-spacing: 0px;
            border-radius: 2px 0 0 2px;
        }

        .averageScore > p{
            display: block;
            width: 75px;
            height: 28px;
            line-height: 28px;
            background: #0E162DCC;
            text-align: center;
            letter-spacing: 0px;
            border-radius: 0 2px 2px 0;
        }

        .averageScoreBox{
            display: block;
            width: 220px;
            height: 155px;
            background: transparent linear-gradient(180deg, #1E2F53 0%, rgba(6,9,17,0.6)) 0% 0% no-repeat padding-box;
            box-shadow: 0px 2px 4px #0000002B;
            border-radius: 3px;
            position : absolute;
            top: 70px;
            left: 50%;
            transform: translate(-50%, 0%);
        }

        .averageScoreText{
            height:36px;
            line-height: 36px;
            background: rgba(220,234,255,0.05);
            border-radius: 3px 3px 0px 0px;
            color: #fff; 
            font-size: 18px;
            font-weight: 600;
            text-align: center;
        }

        .averageFlex{
            display: flex;
            text-align: center;
            border-right: 1px solid #FFFFFF1A;
            border-bottom: 1px solid #FFFFFF1A;
        }

        .averageFlex:last-child{
            border-bottom: 0px;
        }

        .averageFlex > p{
            display: block;
            padding: 10px 16px;
            text-align: right;
            font-size: 18px;
            flex: 1;
        }

        .averageA{
            color: #5398FF;
            padding: 12px 16px;
            font-size: 16px;
        }
        .averageB{
            color: #FFD153;
            padding: 12px 16px;
            font-size: 16px;
        }
        .averageC{
            color: #FF5353;
            padding: 12px 16px;
            font-size: 16px;
        }

        .board-data-wrap {
            position : absolute;
            bottom: 0;
            left: 50%;
            transform: translate(-50%, 0%);
            width: 100%;
            padding: 10px;
            font-size: 1rem;

            .on {
                background: rgba(235, 66, 66, 0.3);
                border-radius: 5px;
                position: relative;

                &::after {
                    content: url(${bellIcon});
                    width: 28px;
                    height: 28px;
                    position: absolute;
                    top: -17px;
                    left: 0;
                    background-color: rgba(14, 22, 45, 0.8);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 50px;
                    text-align: center;
                    line-height: 33px;
                    cursor: pointer;
                }
            }

            .disabled {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 5px;
                position: relative;

                &::after {
                    content: url(${bellIconDisabled});
                    width: 28px;
                    height: 28px;
                    position: absolute;
                    top: -17px;
                    left: 0;
                    background-color: rgba(14, 22, 45, 0.8);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 50px;
                    text-align: center;
                    line-height: 33px;
                    cursor: pointer;
                }
            }
            
            .board-data {
                ${props => props.theme.variables.flex()};
                margin-top: 10px;
                width: 100%;
                height: 38px;
                /* padding: 10px 20px; */
                padding: 10px 6px;

                .board-data-detail > span {
                    margin-left: 6px;
                }

                .board-data-detail > span:nth-child(1):before {
                    content: '';
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background-color: var(--board-view-data-blue-color);
                    margin-right: 8px;
                }

                .board-data-detail > span:nth-child(2):before {
                    content: '';
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background-color: var(--white-color);
                    margin-right: 8px;
                }

                .board-data-detail > span:nth-child(3):before {
                    content: '';
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background-color: var(--pink-color);
                    margin-right: 8px;
                }
            }
        }
    }
    
    > div:hover {
        .campus-img {
            opacity: 1;
            transform: scale(1.3);
            transition: transform .35s;
        }

        .campus-img-notShadow {
            opacity: 1;
            transform: scale(1.3);
            transition: transform .35s;
        }

        .title {
            color: var(--navy-color);
        }
    }
`


/**********************************************************************/


export const BoardViewSecurityOffice = styled.div`
    
    background-color: var(--navy-color) !important;
    ${props => props.theme.variables.flex()};
    gap: 16px;
    font-size: 24px;

    .board-view-wrap {
        height: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;

        .selected-building-wrap {
            width: 100%;
            position: relative;
            font-size: 28px;
            
            .scrollbar {
                overflow-x: hidden;
                overflow-y: auto;
            }

            .scrollbar::-webkit-scrollbar {
                width: 4px;
                background: #272E42;
                border-radius: 10px; 
                border: 5px solid #272E42;
            }

            .scrollbar::-webkit-scrollbar-thumb {
                background-color: #525868;
                border-radius: 6px;
            }

            .scrollbar::-webkit-scrollbar-track {
                background-color: rgba(0,0,0,0);
            }
    
            .selected-building {
                position: absolute;
                top: 0;
                width: 100%;
                height: 57px;
                background-color: var(--dashboard-color);
                border-radius: 10px;
                color: var(--title-bar-text-blue-color);
                text-align: center;
                font-weight: bold;
                cursor: pointer;

                span {
                    line-height: 57px;

                    &.building-name {
                        height: 10px;
    
                        &::after {
                            content: '';
                            background: url(${board_arrow_blue});
                            display: inline-block;
                            width: 12px;
                            height: 7px;
                            margin-left: 10px;
                            position: relative;
                            top: -5px;
                            ${(props) => (props.$show ? `transform: rotate(180deg); transition: .3s;` : `transition: .3s;`)};
                        }
                    }
                }
    
                .building-list {
                    display: block;
                    position: absolute;
                    top: 50px;
                    z-index: 2;
                    width: 100%;
                    height: 264px;
                    background-color: var(--dashboard-color);
                    color: var(--white-color);
                    font-weight: normal;

                    li {
                        padding: 12px 0;

                        &:hover {
                            color: var(--title-bar-text-blue-color);
                        }
                    }

                    li:not(:last-child) {
                        border-bottom: 1px solid var(--dark-gray-color);
                    }
                }
            }
        }

        .building-info-wrap {
            margin-top: 57px;
            height: calc(100% - 67px);

            .scrollbar {
                overflow-x: hidden;
                overflow-y: auto;
            }

            .scrollbar::-webkit-scrollbar {
                width: 5px;
                background: #0E162D;
                border-radius: 10px; 
                border: 5px solid #0e162d;
            }

            .scrollbar::-webkit-scrollbar-thumb {
                background-color: #525868;
                border-radius: 6px;
            }

            .scrollbar::-webkit-scrollbar-track {
                background-color: rgba(0,0,0,0);
            }

            .building-info-table-wrap {
                height: 100%;
                margin: 10px 0;
                table-layout: fixed;

                tr {
                    height: 69.5px;
                    line-height: 69.5px;
                    border-top: 1px solid transparent;
                    border-left: 1px solid transparent;
                    border-right: 1px solid transparent;
                    border-bottom: 1px solid rgba(255, 255, 255, .1);
    
                    td {
                        padding-left: 40px;
                        text-overflow: ellipsis; 
                        overflow: hidden; 
                        white-space: nowrap;
                    }
                }
    
                tbody {
                    tr:hover {
                        outline: 1px solid var(--title-bar-text-blue-color);
                        outline-offset: -1px;
                    }

                    tr:last-child {
                        border-bottom: 0;
                    }

                    td:nth-child(2) {
                        color: var(--settings-color);
                    }
                }
            }
        }

        &.right {
    
            .building-info-wrap {
                display: flex;
                align-items: center;
                flex-direction: column;
                height: calc(100% - 57px);

                .building-info-table-wrap {
                    height: 60%;
                    overflow: auto;
                    margin-top: 10px;
                }

                .minimap-area {
                    width: 100%;
                    ${props => props.theme.variables.flex()};
                    gap: 10px;
                    
                    > div {
                        background-color: #0E162D;
                        width: 100%;
                        height: 219px;
                        border-radius: 10px;
                        border: 1px solid #FFFFFF1A;
                        padding: 12px 20px 20px 20px;

                        p {
                            font-size: 13px;
                            margin-bottom: 10px;

                            &::before {
                                content: '';
                                display: inline-block;
                                width: 6px;
                                height: 7px;
                                background: url(${minimap_arrow});
                                margin-right: 8px;
                            }
                        }

                        > div {
                            height: 88%;
                            position: relative;
                            border-radius: 0;

                            img {
                                position: absolute;
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                }
            }
        }
    }





`


/**********************************************************************/


export const BoardViewDetail = styled.div`
    background: ${props => {
        if(props.siteid === 31) 
            return `url(${campusImgA}) no-repeat;` // 캠퍼스A
        else if(props.siteid === 33)
            return `url(${campusImgV}) no-repeat;` // 캠퍼스V
        else if(props.siteid === 30)
            return `url(${campusImgH}) no-repeat;` // 캠퍼스H
        else if(props.siteid === 32)
            return `url(${campusImgC}) no-repeat;` // 캠퍼스C
        else if(props.siteid === 34)
            return `url(${campusImgS}) no-repeat;` // 캠퍼스S
        
    }};

    background-size: 100% auto;
    background-position-y: 25%;
    width: 100%;
    height: 100%;
    position: relative;
    padding: 20px;
    box-sizing: border-box;

    &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 130px;
        background: transparent linear-gradient(180deg, #00000000 0%, #0E162D66 46%, #0E162DCC 100%) 0% 0% no-repeat padding-box;
    }

    .board-view-detail-top {
        ${props => props.theme.variables.flex()};

        font-size: 18px;
        font-weight: bold;

        .board-view-detail-top-title {
            ${props => props.theme.variables.flex()};

            p {
                color: var(--navy-color);
                flex-shrink: 0;
            }

            button {
                text-indent: -9999px;
                width: 19px;
                height: 18px;
                background:url(${backArrow}) no-repeat;
                margin-left: 15px;
                flex-shrink: 0;
            }
        }

        .board-view-detail-top-btn {
            width: 125px;
            height: 38px;
            background: transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;
            box-shadow: 0px 3px 6px #00000033;
            border-radius: 60px;
            color: var(--white-color);
            font-size: 18px;
            font-weight: bold;

            span::after {
                content: url(${cubeIcon});
                margin-left: 10px;
                position: relative;
                top: 2px;
            }
        }
    }
    
    .board-view-detail-middle {
        width: 268px;
        height: auto;
        background: var(--navy-color);
        border-radius: 10px;
        opacity: 0.8;
        position: absolute;
        right: 30px;
        margin-top: 20px;

        .board-view-detail-middle-title {
            height: 50px;
            border-bottom: 1px dashed var(--dark-gray-color);
            padding: 20px 20px 10px 20px;

            h1 {
            font-size: 1rem;
            font-weight: normal;
    
                &:before {
                    content: '';
                    border-left: 4px solid var(--blue-color);
                    margin-right: 10px;
                }
            }
        }

        .board-view-detail-middle-content {
            height: auto;
            max-height: 186px;
            width: 258px;
            padding: 18px 0 20px 20px;
            font-size: 14px;
            overflow: auto;
            ${props => props.theme.variables.scroll()};
            box-sizing: border-box;
            
            ul {
                margin-left: 20px;
                height: auto;
                max-height: 183px;
                
                li {
                    line-height: 18px;
                    list-style-type: circle;

                    &:not(&:last-child) {
                        padding-bottom: 12px;
                    }
                }

                li::marker {
                    background-color: var(--navy-color);
                    font-size: 18px;
                }
            }

            
        }

    }

    .board-view-detail-bottom {
        width: 100%;
        height: 100%;
        position: relative;

        .board-view-detail-content {
            position: absolute;
            bottom: 45px;
            width: 98%;
            font-size: 16px;
            left:50%;
            transform:translateX(-50%);

            .slick-track {
                margin-top: 17px;
            }

            .slick-arrow.slick-prev {
                background: url(${arrowLeftWhite}) no-repeat !important;
                width: 8px;
                height: 100%;
                position: absolute;
                left: -13px;
                top: 57px;
            }

            .slick-arrow.slick-next {
                background: url(${arrowRightWhite}) no-repeat !important;
                width: 8px;
                height: 100%;
                position: absolute;
                left: 1165px;
                top: 57px;
            }

            .slick-prev:before,
            .slick-next:before {
                display:none;
            }

            .slick-slide {
                min-width: 224px;
                ${props => props.theme.variables.flex('center')};
                gap: 8px;

                .board-data {
                    min-width: 224px;
                    height: 38px;
                    padding: 10px 20px;
                    display: flex !important;
                    justify-content: space-between;
                    align-items: center;

                    .board-data-detail > span {
                        margin-left: 10px;
                    }

                    .board-data-detail > span:nth-child(1):before {
                        content: '';
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background-color: var(--board-view-data-blue-color);
                        margin-right: 8px;
                    }

                    .board-data-detail > span:nth-child(2):before {
                        content: '';
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background-color: var(--white-color);
                        margin-right: 8px;
                    }

                    .board-data-detail > span:nth-child(3):before {
                        content: '';
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background-color: var(--pink-color);
                        margin-right: 8px;
                    }
                }

                .on {
                    background: rgba(235, 66, 66, 0.3);
                    border-radius: 5px;
                    position: relative;
                    
                    &::after {
                        content: url(${bellIcon});
                        width: 28px;
                        height: 28px;
                        position: absolute;
                        top: -17px;
                        left: 0;
                        background-color: rgba(14, 22, 45, 0.8);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 50px;
                        text-align: center;
                        line-height: 33px;
                        cursor: pointer;
                    }
                }

                .disabled {
                    background: rgba(14, 22, 45, 0.3);
                    border-radius: 5px;
                    position: relative;

                    &::after {
                        content: url(${bellIconDisabled});
                        width: 28px;
                        height: 28px;
                        position: absolute;
                        top: -17px;
                        left: 0;
                        background-color: rgba(14, 22, 45, 0.8);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 50px;
                        text-align: center;
                        line-height: 33px;
                        cursor: pointer;
                    }
                }
            }
        }
    }
`

/**********************************************************************/


export const AccessView = styled.div`

    overflow: hidden;
    padding: 20px 10px 20px 20px;

    h1 {
        font-size: 1rem;
        font-weight: normal;
        margin-bottom: 20px;

        &:before {
            content: '';
            border-left: 4px solid var(--blue-color);
            margin-right: 10px;
        }
    }

    .access-area-wrap {
        position: relative;
        padding-bottom: 10px;
        height: 97%;
        
        .access-area-top {
            margin: 10px 10px 0 0;
            padding: 0 10px 12px 10px;
            ${props => props.theme.variables.flex()};
            border-bottom: 1px solid var(--dark-gray-color);

            .access-area-content {
                text-align: center;

                div {
                    width: 58px;
                    height: 58px;
                    border-radius: 50%;
                    background-color: var(--navy-color);
                    margin-bottom: 10px;
                }

                P {
                    margin-top: 4px;
                }

                .access-area-content-icon-people:before {
                    content: url(${peopleIcon});
                    position:relative; 
                    top: 17px;
                }

                .access-area-content-icon-human:before {
                    content: url(${humanIcon});
                    position:relative; 
                    top: 14px;
                }

                .access-area-content-icon-id:before {
                    content: url(${identificationIcon});
                    position:relative; 
                    top: 14px;
                }
            }
        }

        .access-area-chart {
            width: ${(props) => props.chartwidth > 300 ? `420px` : `318px`};
            margin: 12px auto;
            position: absolute; 
            left: -58px;
            height: calc(100% - 138px);
            overflow-x: hidden;
            overflow-y: auto;
            ${props => props.theme.variables.scroll()}
        }
    }
`


/**********************************************************************/


export const SensorView = styled.div`
    overflow: hidden;
    padding: 20px;

    h1 {
        font-size: 1rem;
        font-weight: normal;

        &:before {
            content: '';
            border-left: 4px solid var(--blue-color);
            margin-right: 10px;
        }
    }

    .sensor-area-wrap {
        margin-top: 20px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 10px;
        font-size: 14px;
        height: 80%;

        .sensor-area-content {
            /* width: 120px; */
            height: 38px;
            background-color: var(--navy-color);
            border-radius: 5px;
            padding: 10px;
            ${props => props.theme.variables.flex()};
            /*
            &:last-child {
                grid-column: 1 / 3;
                width: 100%;
            }
            */
        }

        .up > span:last-child::after {
            content: url(${arrowUpIcon});
            padding-left: 8px;
            position: relative;
            top: -2px;
        }

        .down > span:last-child::after {
            content: url(${arrowDownIcon});
            padding-left: 8px;
            position: relative;
            top: -2px;
        }

        .same > span:last-child::after {
            content: '-';
            padding-left: 8px;
            position: relative;
            top: -1px;
        }
    }
`


/**********************************************************************/


export const PerceptionView = styled.div`
    overflow: hidden;
    padding: 20px 10px 20px 20px;

    h1 {
        font-size: 1rem;
        font-weight: normal;

        &:before {
            content: '';
            border-left: 4px solid var(--blue-color);
            margin-right: 10px;
        }
    }

    .perception-area-wrap {
        margin-top: 10px;
        height: 95%;
        overflow-y: auto;

        &::-webkit-scrollbar-thumb {
            background-color: var(--dark-gray-color);
        }

        &::-webkit-scrollbar-track {
            background-color: var(--navy-color);
            border-radius: 10px;
        }

        .perception-area-content {
            ${props => props.theme.variables.flex()};
            padding: 10px 20px 10px 0;
            position: relative;
        }

        .perception-area-content:not(:last-child):before {
            content: "";
            position: absolute;
            left    : 0;
            bottom  : 0;
            height  : 1px;
            width   : 93%;
            border-bottom: 1px solid var(--dark-gray-color);
        }
    }
`


/**********************************************************************/


export const OperationView = styled.div`
    overflow: hidden;
    position: relative;
    padding: 20px 10px 20px 20px;

    .operation-area-top {
        margin-bottom: 10px;
        ${props => props.theme.variables.flex()}

        h1 {
            font-size: 1rem;
            font-weight: normal;
    
            &:before {
                content: '';
                border-left: 4px solid var(--blue-color);
                margin-right: 10px;
            }
        }

        .button-wrap {
            padding-right: 10px;
            /* z-index: 99; */

            button {
                width: 8px;
                height: 14px;
            }

            .left-btn {
                background:url(${arrowLeftGray}) no-repeat;
            }

            .left-btn-active{
                background:url(${arrowLeftWhite}) no-repeat;
            }

            .right-btn {
                background:url(${arrowRightGray}) no-repeat;
                margin-left: 20px;
            }

            .right-btn-active {
                background:url(${arrowRightWhite}) no-repeat;
                margin-left: 20px;
            }
        }
    }

    .operation-area-wrap {
        position: relative;
        /* width: 260px; */
        height: 95%;
        margin: 0 auto;

        .operation-chart-wrap {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            canvas {
                margin-right: 10px;
            }
        }

        .operation-board-wrap {
            height: 95%;
            padding: 10px 17px 0 0;
            overflow-y: auto;

            ${props => props.theme.variables.scroll()}
            
            .operation-board {
                ${props => props.theme.variables.flex()}
                font-size: 14px;

                &:not(&:last-child) {
                    margin-bottom: 8px;
                }

                .operation-board-title {
                    ${props => props.theme.variables.flex()};

                    & > li:first-child {
                        width: 18px;
                        height: 18px; 
                        font-size: 14px;
                        background: var(--navy-color);
                        border-radius: 3px;
                        text-align: center;
                        line-height: 19px;
                        margin-right: 8px;
                    }
                }

                .operation-board-data {
                    width: 168px;
                    ${props => props.theme.variables.flex()};

                    .line {
                        width: 122px;
                        height: 1px;
                        border-bottom: 1px dashed var(--dark-gray-color);
                    }
                }
            }
        }
    }
`


/**********************************************************************/


export const WeatherView = styled.div`
    overflow: hidden;
    padding: 20px;

    h1 {
        font-size: 1rem;
        font-weight: normal;
        margin-bottom: 20px;

        &:before {
            content: '';
            border-left: 4px solid var(--blue-color);
            margin-right: 10px;
        }
    }

    .weather-area-wrap{ 
        height: 100%;
        margin-top: 5%;
        ${props => props.theme.variables.flex('space-between', 'flex-start')}
        text-align: center;

        .weather-area-content {
            width: 47%;
            /* width: 50%; */
            height: 88%;
            background-color: var(--navy-color);
            border-radius: 10px;
            font-size: 1rem;
            position: relative;
            margin-right: 20px;

            .weather-area-content-wrap {
                width: 100%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            
            .weather-area-title {
                margin-bottom: 10.5px;

                img {
                    width: 38px;
                    height: 36px;
                    object-fit: none;
                    margin: 10px auto;
                    object-fit: contain;
                }

                p {
                    margin-bottom: 5px;
                }
            }

            .weather-area-detail{
                width: 87%;
                margin: 0 auto;
                font-size: 12px;
                color: var(--board-gray-color);
                font-weight: lighter;
                padding-top: 10.5px;
                border-top: 1px dashed var(--dark-gray-color);

                p {
                    margin-bottom: 7px;
                }
            }
        }

        .weather-area-detail-wrap {
            /* padding: 10px 25px; */
            padding: 10px 10px;
            /* width: 135px; */
            width: 50%;
            height: 88%;
            position: relative;

            .weather-area-detail-content { 
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                
                .weather-area-detail-content-wrap {
                    font-size: 14px;
                    ${props => props.theme.variables.flex()};

                    & > * {
                        flex-shrink: 0;
                    }

                    &:not(&:last-child) {
                        margin-bottom: 13px;
                    }

                    .weather-detail-img {
                        margin-left: 20px;
                        width: 18px;
                        height: 17px;
                    }

                    .weather-detail-celcius {
                        margin-left: 20px;
                        span:first-child {
                            font-size: 12px;
                        }
                        span:last-child {
                            color: var(--red-color);
                        }
                    }
                }
            }
        }
    }
`


/**********************************************************************/


export const WeeklyView = styled.div`
    padding: 20px;

    .weekly-area-top {
        ${props => props.theme.variables.flex('row', 'center')};

        .weekly-select-wrap {
           .weekly-selectBox {
                display: inline-block;
                width: 91px;
                height: 27px;
                background: #0E162D url(${selectArrow}) no-repeat 94% 50% !important;
                background-color: var(--navy-color); 
                color: var(--white-color);
                border: 0;
                border-radius: 5px;
                font-size: 1rem;
                padding-left: 6px;

                &.on{
                    display: inline-block;
                    width: 91px;
                    height: 27px;
                    background: #0E162D url(${selectArrowUp}) no-repeat 94% 50% !important;
                    background-color: var(--navy-color); 
                    color: var(--white-color);
                    border-radius: 5px;
                }
            }
        }
        
        .weekly-status-wrap {
            margin-left: 20px;

            button {
                font-size: 1rem;
                margin-right: 20px;
            }

            .btn {
                color: var(--board-gray-color);
            }

            .isActive {
                color: var(--white-color);
            }
        }
    }
`