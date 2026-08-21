import styled from "styled-components";

import arrow_twin_on from '../images/arrow_twin_on.png';
import arrow_twin_off from '../images/arrow_twin_off.png';
import triangle_on from '../images/triangle_on.png';
import triangle_off from '../images/triangle_off.png';
import nametag_arrow from '../images/nametag_arrow.png';
import check_background from '../images/check_background.png';


/**********************************************************************/
// SDMS root

export const SDMSComponent = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: transparent linear-gradient(270deg, #3D4A52 0%, #283138 100%) 0% 0% no-repeat padding-box;

    &::after {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 717px;
        background: transparent linear-gradient(270deg, #3B474F00 0%, #0C0E10 100%) 0% 0% no-repeat padding-box;
    }

    &::before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: url(${check_background}) no-repeat center center;
        background-size: cover;
    }

    .factoryImgWrap {
        position: absolute;
        top: 55%;
        left: 57%;
        transform: translate(-50%, -50%);
        z-index: 1;

        .factoryImg {
            height: 900px;
        }
    }

    area {
        border: 2px solid red;
    }

    #factory_area1 {
        cursor: pointer;
    }

    .tagWrap_1 {
        top: 262px;
        left: 419px;
    }

    .tagWrap_2 {
        top: 108px;
        left: 938px;
    }

    .tagWrap_3 {
        top: -39px;
        left: 269px;
    }

    .tagWrap {
        position: absolute;
        ${(props) => props.theme.flex('flex-start', 'flex-start')};
        gap: 6px;
        z-index: 2;

        &.on {
            .tagDescription {
                display: block;
            }

            .nameTag {
                border: 1px solid ${(props) => props.theme.mainColor};

                p {
                    color: ${(props) => props.theme.mainColor};

                    &::after {
                        content: '';
                        display: inline-block;
                        width: 31px;
                        height: 31px;
                        background: url(${nametag_arrow}) no-repeat center center, ${(props) => props.theme.mainColor};
                        position: absolute;
                        top: 0;
                        right: 0;
                    }
                }
            }

            &::after {
                content: '';
                display: block;
                width: 10px;
                height: 10px;
                background: #252E34;
                border: 2px solid ${(props) => props.theme.mainColor};
                position: absolute;
                top: 79px;
                left: 72px;
                border-radius: 10px;
            }
        }

        .nameTag {
            width: 153px;
            height: 33px;
            line-height: 31px;
            background: ${(props) => props.theme.darkColor};
            border: 1px solid #FFFFFF;
            border-radius: 2px;
            padding-left: 7px;
            cursor: pointer;
    
            p {
                font-size: 14px;
                font-weight: bold;
                position: relative;
    
                &::after {
                    content: '';
                    display: inline-block;
                    width: 31px;
                    height: 31px;
                    background: url(${nametag_arrow}) no-repeat center center, #fff;
                    position: absolute;
                    top: 0;
                    right: 0;
                }
            }
    
            &::before {
                content: '';
                display: block;
                width: 0;
                height: 46px;
                border: 1px dashed #252E34;
                position: absolute;
                top: 33px;
                left: 76px;
            }
    
            &::after {
                content: '';
                display: block;
                width: 10px;
                height: 10px;
                background: #252E34;
                border: 2px solid #FFFFFF;
                position: absolute;
                top: 79px;
                left: 72px;
                border-radius: 10px;
            }
        }
    }

    .tagDescription {
        display: none;
        width: 208px;
        height: auto;
        background: ${(props) => props.theme.darkColor};
        border-radius: 2px;
    
        > p {
            font-size: 12px;
            font-weight: bold;
            padding: 7px 12px;
            color: ${(props) => props.theme.mainColor};
        }
    
        ul {

            li {
                border-top: 1px dashed #525868;

                div {
                    padding: 9px 12px;
                }
            }

            .landArea,
            .buildingArea {
                ${(props) => props.theme.flex()};
                color: ${(props) => props.theme.mainColor};
                
                > div {

                    p:nth-child(1) {
                        font-size: 10px;
                    }

                    p:nth-child(2) {
                        font-size: 12px;
                        color: #CCCCCC;
                        margin-top: 5px;
                    }
                }

                > p {
                    font-size: 20px;
                    font-weight: bold;
                    position: relative;
                    padding-right: 20px;

                    &::before {
                        content: '2';
                        display: inline-block;
                        position: absolute;
                        top: 0;
                        right: 12px;
                        font-size: 12px;
                    }
                }
            }
    
            .addressArea {

                > div {

                    p:nth-child(1) {
                        font-size: 10px;
                        color: ${(props) => props.theme.mainColor};
                    }

                    p:nth-child(2) {
                        font-size: 12px;
                        color: #CCCCCC;
                        margin-top: 5px;
                    }
                }

                img {
                    margin: 0 12px 11px 12px;
                    width: 185px;
                    height: 116px;
                }
            }
        }
    }

    .tagWrapOff {
        position: absolute;
        ${(props) => props.theme.flex('flex-start', 'flex-start')};
        gap: 6px;
        z-index: 2;

        &.on {
            .tagDescription {
                display: block;
            }
        }

        .nameTag {
            width: 122px;
            height: 33px;
            line-height: 31px;
            background: ${(props) => props.theme.darkColor};
            border: 1px solid #FFFFFF;
            border-radius: 2px;
            padding-left: 7px;
            cursor: default;
    
            p {
                font-size: 14px;
                font-weight: bold;
                position: relative;
            }
    
            &::before {
                content: '';
                display: block;
                width: 0;
                height: 46px;
                border: 1px dashed #252E34;
                position: absolute;
                top: 33px;
                left: 62px;
            }
    
            &::after {
                content: '';
                display: block;
                width: 10px;
                height: 10px;
                background: #252E34;
                border: 2px solid #FFFFFF;
                position: absolute;
                top: 79px;
                left: 58px;
                border-radius: 10px;
            }
        }
    }

    section {
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        left: 58px;
        z-index: 1;

        .mainLogo {
            img {
                width: 292px;
                height: 38px;
                object-fit: none;
            }
        }

        .areaListWrap {
            margin-top: 52px;

            li {
                ${props => props.theme.flex('flex-start', 'center')};

                &::before {
                    content: '';
                    display: block;
                    background: url(${triangle_off}) no-repeat;
                    width: 10px;
                    height: 11px;
                }

                &:not(:last-child) {
                    margin-bottom: 29px;
                    cursor: pointer;
                }

                &:last-child {
                    cursor: default;
                }

                span {
                    padding: 0 9px 0 21px;
                    font-size: 18px;
                    font-weight: bold;
                    position: relative;
                    top: -1px;
                }
            }

            li:not(:last-child):hover,
            li:not(:last-child):hover.on {
                color: ${(props) => props.theme.mainColor};

                &::before {
                    content: '';
                    display: block;
                    background: url(${triangle_on}) no-repeat;
                    width: 10px;
                    height: 11px;
                }

                &::after {
                    content: '';
                    display: block;
                    background: url(${arrow_twin_on}) no-repeat;
                    width: 16px;
                    height: 13px;
                }
            }
        }

    }

`;

export const MonitoringComponent = styled.div`
    #dsMap {
        width: 100%;
        height: 100%;
    }

    .dsmTitle {
        position: fixed;
        z-index: 98;
        right: 53px;
        bottom: 36px;
        color: #fff;
        font-size: 30px;
        line-height: 1em;
        font-weight: 600;
    }

    .tagDescription {
        display: block;
        width: 208px;
        height: auto;
        background: ${(props) => props.theme.darkColor};
        border-radius: 2px;
        position: fixed;
        top: 134px;
        left: 20px;
    
        > p {
            font-size: 12px;
            font-weight: bold;
            padding: 7px 12px;
            color: ${(props) => props.theme.mainColor};
        }
    
        ul {

            li {
                border-top: 1px dashed #525868;

                div {
                    padding: 9px 12px;
                }
            }

            .landArea,
            .buildingArea {
                ${(props) => props.theme.flex()};
                color: ${(props) => props.theme.mainColor};
                
                > div {

                    p:nth-child(1) {
                        font-size: 10px;
                    }

                    p:nth-child(2) {
                        font-size: 12px;
                        color: #CCCCCC;
                        margin-top: 5px;
                    }
                }

                > p {
                    font-size: 20px;
                    font-weight: bold;
                    position: relative;
                    padding-right: 20px;

                    &::before {
                        content: '2';
                        display: inline-block;
                        position: absolute;
                        top: 0;
                        right: 12px;
                        font-size: 12px;
                    }
                }
            }
    
            .addressArea {

                > div {

                    p:nth-child(1) {
                        font-size: 10px;
                        color: ${(props) => props.theme.mainColor};
                    }

                    p:nth-child(2) {
                        font-size: 12px;
                        color: #CCCCCC;
                        margin-top: 5px;
                    }
                }

                img {
                    margin: 0 12px 11px 12px;
                    width: 185px;
                    height: 116px;
                }
            }
        }
    }
`;