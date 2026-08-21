import styled from 'styled-components';
import media from '../../Common/styled/media';

import Protecto_header_bg from '../image/Protecto_header_bg.png';

import card_icon1 from '../image/card_icon1.svg';
import card_icon2 from '../image/card_icon2.svg';
import card_icon3 from '../image/card_icon3.svg';
import tab1_check from '../image/tab1_check.svg';
import tab1_moniter from '../image/tab1_moniter.svg';
import tab2_icon1 from '../image/tab2_icon1.svg';
import tab2_icon2 from '../image/tab2_icon2.svg';
import tab2_icon3 from '../image/tab2_icon3.svg';
import tab3_icon1 from '../image/tab3_icon1.svg';
import page_check from '../image/page_check.svg';
import page_next_btn from '../image/page_next_btn.svg';
import line_blue from '../image/line_blue.svg';
import line_green from '../image/line_green.svg';
import reference_gr_1 from '../image/reference_gr_1.svg';
import reference_gr_2 from '../image/reference_gr_2.svg';
import reference_gr_3 from '../image/reference_gr_3.svg';
import reference_gr_4 from '../image/reference_gr_4.svg';
import reference_gr_5 from '../image/reference_gr_5.svg';
import reference_bl_1 from '../image/reference_bl_1.svg';
import reference_bl_2 from '../image/reference_bl_2.svg';
import reference_bl_3 from '../image/reference_bl_3.svg';
import reference_bl_4 from '../image/reference_bl_4.svg';
import reference_bl_5 from '../image/reference_bl_5.svg';
import info_icon_bg from '../image/info_icon_bg.svg';
import info_btn_icon1 from '../image/info_btn_icon1.svg';
import info_btn_icon2 from '../image/info_btn_icon2.svg';
import info_btn_icon1_white from '../image/info_btn_icon1_white.svg';
import info_btn_icon2_white from '../image/info_btn_icon2_white.svg';


export const ProductSectionComponent = styled.div`
    font-family: "SUIT-Regular";

    .header {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 280px;
        text-align: center;
        background: url(${Protecto_header_bg}) no-repeat;
        background-size: contain;

        ${media.smallMobile`
            background-size: 120% 60%;   
        `};

        > span {
            display: block;
            width: 100%;
        }

        > span:first-child {
            font-size: 52px;
            font-weight: 600;
            padding-top: 85.5px;
            padding-bottom: 16px;
            font-family: "SUIT-SemiBold";
            font-style: normal;
            color: #fff;

            ${media.mobile`
                font-size: 40px;  
                padding-top: 105.5px;      
            `};

            ${media.smallMobile`
                font-size: 24px;  
                padding-top: 56px;
                padding-bottom: 6px;    
            `};
        }

        > span:nth-child(2) {
            font-weight: 400;
            font-family: "SUIT-Regular";
            font-size: 22px;
            color: #f9f9f9;
            height: 28px;
            line-height: 28px;

            ${media.mobile`
                font-size: 20px;  
                max-width: 90%;
                word-break: keep-all;  
            `};

            ${media.smallMobile`
                font-size: 12px;  
            `};
        }
    }

    .body {
        display: block;
        width: 100%;
        padding-top: 240px;
        margin: 0 auto;
        overflow-x: hidden;

        ${media.mobile`
            padding-top: 200px;                
        `};

        ${media.smallMobile`
            padding-top: 0;                
        `};

        .contentBox {
            display: block;
            height: 100%;
            margin: 0 auto;

            .title {
                display: block;
                width: 100%;
                font-family: "SUIT-SemiBold";
                font-size: 34px;
                text-align: center;
                margin-bottom: 72px;
                font-weight: 600;

                ${media.smallMobile`
                    font-size: 20px;  
                    margin-bottom: 40px;          
                `};
            }

            .content {
                display: flex;
                flex-direction: column;
                align-items: center;

                > h1 {
                    font-size: 22px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: 34px;
                    text-align: center;
                    color: #333333;

                    ${media.mobile`
                        max-width: 90%;
                        word-break: keep-all;
                    `};

                    ${media.smallMobile`
                        font-size: 12px;
                        line-height: 18px;             
                    `};

                    .highlight {
                        color: #4D8DE8;
                    }
                }

                .cardsWrap {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: row;
                    gap: 12px;
                    margin: 72px 0 260px 0;

                    &.second {
                        ${media.tablet`
                            margin: 40px 0 334px 0; 
                        `};

                        ${media.smallMobile`
                            margin: 30px 0 200px 0; 
                        `};
                    }

                    ${media.tablet`
                        flex-direction: column;
                    `};

                    ${media.mobile`
                        margin: 40px 0 80px 0; 
                    `};
    
                    .card {
                        width: 445px;
                        height: 614px;
                        border-radius: 8px;
                        box-shadow: 0px 0px 12px 0px rgba(2, 26, 79, 0.06);
                        padding: 52px 0;

                        ${media.tablet`
                            width: calc(100vw - 100px);
                            height: auto;
                        `};

                        ${media.mobile`
                            min-height: 304px;
                            padding: 40px 0;
                            overflow: hidden;
                        `};

                        ${media.smallMobile`
                            width: calc(100vw - 40px);
                            min-height: 240px;
                            padding: 30px 0;
                        `};
    
                        > p {
                            font-size: 18px;
                            font-weight: 500;
                            line-height: 26px;
                            border-radius: 0px 20px 20px 0px;
                            background: #F4F8FD;
                            color: #2976E3;
                            width: 175px;
                            height: 40px;
                            padding: 0px 0px 0px 40px;
                            display: flex;
                            align-items: center;
                            margin-bottom: 52px;

                            ${media.mobile`
                                margin-bottom: 40px;
                            `};

                            ${media.smallMobile`
                                font-size: 12px;
                                width: 130px;
                                height: 32px;
                                padding: 0 24px;
                                margin-bottom: 30px;
                            `};
                        }

                        > div {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            align-items: flex-start;

                            ${media.tablet`
                                flex-direction: row;
                                padding: 0 43px;
                            `};

                            ${media.smallMobile`
                                padding: 0 20px;
                            `};

                            > img {
                                width: 282px;
                                height: 224px;
                                margin: 0 auto;

                                ${media.tablet`
                                    width: 180px;
                                    height: 144px;
                                    flex: 1;
                                `};

                                ${media.smallMobile`
                                    display: none;
                                `};
                            }
        
                            .description {
                                padding: 0px 44px;
                                margin-top: 52px;

                                ${media.tablet`
                                    padding: 0 0 0 40px;
                                    margin-top: 0;
                                    flex: 2;
                                `};

                                ${media.smallMobile`
                                    padding: 0;
                                `};
        
                                .head {
                                    color: #333;
                                    font-size: 20px;
                                    line-height: 30px;
                                    display: flex;
                                    align-items: center;
                                    gap: 16px;
                                    margin-bottom: 20px;

                                    ${media.smallMobile`
                                        font-size: 14px;
                                        margin-bottom: 0;
                                        gap: 10px;
                                    `};
        
                                    &::before {
                                        content: '';
                                        display: inline-block;
                                        min-width: 28px;
                                        width: 28px;
                                        height: 28px;
                                        background-size: contain;

                                        ${media.smallMobile`
                                            min-width: 14px;
                                            width: 14px;
                                            height: 14px;
                                        `};
                                    }
                                }
    
                                .head_roadmap {
                                    color: #333;
                                    font-size: 20px;
                                    line-height: 30px;
                                    display: flex;
                                    align-items: center;
                                    gap: 16px;
                                    margin-bottom: 20px;

                                    ${media.smallMobile`
                                        font-size: 14px;
                                        margin-bottom: 0;
                                    `};
    
                                    &::before {
                                        content: '';
                                        display: inline-block;
                                        min-width: 28px;
                                        width: 28px;
                                        height: 28px;
                                        background: url(${page_check}) no-repeat center center;

                                        ${media.smallMobile`
                                            min-width: 14px;
                                            width: 14px;
                                            height: 14px;
                                        `};
                                    }
                                }
        
                                .substance {
                                    color: #888;
                                    font-size: 18px;
                                    line-height: 30px;
                                    display: flex;
                                    gap: 8px;

                                    ${media.smallMobile`
                                        font-size: 12px;
                                    `};
        
                                    &::before {
                                        content: '-';
                                        display: inline-block;
                                    }
                                }
                            }
                        }

                        &:nth-child(1) > div > .description > .head::before {
                            background: url(${card_icon1}) no-repeat center center;
                            background-size: contain;
                        }
    
                        &:nth-child(2) > div > .description > .head::before {
                            background: url(${card_icon2}) no-repeat center center;
                            background-size: contain;
                        }
    
                        &:nth-child(3) > div > .description > .head::before {
                            background: url(${card_icon3}) no-repeat center center;
                            background-size: contain;
                        }
                    }
                }

                .cardsContainer {
                    position: relative;

                    .cardDescription {
                        font-size: 16px;
                        line-height: 22px;
                        color: #4D8DE8;
                        position: absolute;
                        right: 0;
                        bottom: 220px;

                        ${media.tablet`
                            bottom: 300px;
                        `};

                        ${media.smallMobile`
                            font-size: 12px;
                            line-height: 20px;
                            bottom: 175px;
                        `};
                    }
                }

                .gifWrap {
                    display: flex;
                    gap: 250px;
                    margin: 72px 0 380px 0;
                    flex-direction: row;

                    ${media.tablet`
                        flex-direction: column;
                        gap: 100px;
                    `};

                    ${media.mobile`
                        margin: 80px 0 300px 0;
                        gap: 80px;
                    `};

                    ${media.smallMobile`
                        margin: 80px 0 200px 0;
                    `};

                    .item {
                        display: flex;
                        flex-direction: column;
                        align-items: center;

                        &::before {
                            content: '';
                            display: block;
                            width: 280px;
                            height: 280px;
                            border-radius: 280px;
                            background: #F4F8FD;
                            position: absolute;
                        }

                        > img {
                            width: 172px;
                            height: 172px;
                            z-index: 2;
                            margin-top: 54px;
                        }

                        .description {
                            text-align: center;
                            margin-top: 102px;

                            ${media.smallMobile`
                                margin-top: 80px;
                            `};

                            .head {
                                color: #134A97;
                                font-size: 24px;
                                font-weight: 600;
                                line-height: 38px;

                                ${media.smallMobile`
                                    font-size: 16px;
                                `};
                            }

                            .substance {
                                white-space: pre-line;
                                color: #888;
                                font-size: 18px;
                                font-weight: 400;
                                line-height: 30px;

                                ${media.smallMobile`
                                    font-size: 14px;
                                    line-height: 18px;
                                `};
                            }
                        }
                    }
                }

                .folderWrap {
                    margin: 72px 0 260px 0;

                    &.moblie {
                        display: flex;
                        flex-direction: column;
                        gap: 80px;
                        align-items: center;
                        margin: 72px 0 300px 0;

                        ${media.smallMobile`
                            margin: 40px 0 200px 0;
                        `};
                    }

                    .tabs {
                        display: flex;
                        justify-content: space-between;

                        > div {
                            display: flex;
    
                            .tab {
                                width: 240px;
                                height: 64px;
                                padding: 10px 20px;
                                background-color: #F0F0F0;
                                color: #999999;
                                border-radius: 8px 8px 0px 0px;
                                cursor: pointer;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                font-size: 20px;
                                line-height: 30px;
    
                                &.active {
                                    background-color: #F4F8FD;
                                    border-top: 2px solid #4D8DE8;
                                    color: #4D8DE8;
                                    font-weight: 500;
                                }
                            }
                        }
                    }

                    .item {
                        display: flex;
                        flex-direction: column;
                        width: 1360px;
                        height: 680px;
                        padding: 100px;
                        background-color: #F4F8FD;
                        border-radius: 0px 0px 8px 8px;
                        position: relative;

                        h2 {
                            font-size: 32px;
                            font-weight: 500;
                            line-height: 50px;
                            color: #333;

                            .highlight {
                                color: #4D8DE8;
                                font-size: 40px;
                                font-weight: 700;
                            }
                        }

                        &.first {
                            &::before {
                                content: '';
                                width: 431px;
                                height: 378px;
                                display: inline-block;
                                background: url(${tab1_moniter}) no-repeat center center;
                                position: absolute;
                                right: 100px;
                                top: 50%;
                                transform: translate(0, -50%);
                            }
    
                            .checklist {
                                margin-top: 102px;
    
                                li {
                                    font-size: 20px;
                                    line-height: 30px;
                                    margin-bottom: 30px;
                                    display: flex;
                                    align-items: center;
                                    gap: 20px;
    
                                    &::before {
                                        content: '';
                                        min-width: 32px;
                                        width: 32px;
                                        height: 32px;
                                        display: inline-block;
                                        background: url(${tab1_check}) no-repeat center center;
                                    }
                                }
                            }
                        }

                        &.second,
                        &.third {
                            position: relative;

                            &::before {
                                content: '';
                                display: block;
                                width: 680px;
                                height: 1px;
                                background-color: #A4C5F3;
                                position: absolute;
                                right: 100px;
                                top: 150px;
                            }

                            &::after {
                                content: '';
                                display: block;
                                width: 12px;
                                height: 12px;
                                background-color: #4D8DE8;
                                border-radius: 50%;
                                position: absolute;
                                right: 776px;
                                top: 145px;
                            }

                            > ul {
                                display: flex;
                                gap: 103px;
                                margin: 70px auto 0 auto;

                                > li {
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    position: relative;

                                    > img:nth-child(2) {
                                        position: absolute;
                                        top: 102px;
                                        right: 10px;
                                    }

                                    p {
                                        &:nth-child(3) {
                                            color: #185BBC;
                                            font-size: 20px;
                                            font-weight: 500;
                                            line-height: 30px;
                                            width: 264px;
                                            padding: 8px 32px;
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            gap: 12px;
                                            border-radius: 46px;
                                            background: #fff;
                                            box-shadow: 0px 0px 12px 0px rgba(2, 26, 79, 0.06);
                                            margin: 23px 0 12px 0;
                                        }

                                        &:nth-child(4) {
                                            color: #666666;
                                            font-size: 18px;
                                            line-height: 30px;
                                        }
                                    }

                                    &:nth-child(1) > p:nth-child(3)::before {
                                        content: '';
                                        display: inline-block;
                                        width: 21px;
                                        height: 20px;
                                        background: url(${tab2_icon1}) no-repeat center center;
                                    }

                                    &:nth-child(2) > p:nth-child(3)::before {
                                        content: '';
                                        display: inline-block;
                                        width: 20px;
                                        height: 20px;
                                        background: url(${tab2_icon2}) no-repeat center center;
                                    }

                                    &:nth-child(3) > p:nth-child(3)::before {
                                        content: '';
                                        display: inline-block;
                                        width: 26px;
                                        height: 16px;
                                        background: url(${tab2_icon3}) no-repeat center center;
                                    }
                                }
                            }
                        }

                        &.third {
                            position: relative;

                            &::before {
                                content: '';
                                display: block;
                                width: 600px;
                                height: 1px;
                                background-color: #A4C5F3;
                                position: absolute;
                                left: 100px;
                                top: 150px;
                            }

                            &::after {
                                content: '';
                                display: block;
                                width: 12px;
                                height: 12px;
                                background-color: #4D8DE8;
                                border-radius: 50%;
                                position: absolute;
                                left: 689px;
                                top: 145px;
                            }

                            h2 {
                                text-align: right;
                            }

                            > ul {
                                gap: 200px;

                                > li {
                                    &:nth-child(1) > p:nth-child(3)::before {
                                        content: '';
                                        display: inline-block;
                                        width: 26px;
                                        height: 16px;
                                        background: url(${tab3_icon1}) no-repeat center center;
                                    }

                                    &:nth-child(2) > p:nth-child(3)::before {
                                        content: '';
                                        display: inline-block;
                                        width: 26px;
                                        height: 16px;
                                        background: url(${tab2_icon3}) no-repeat center center;
                                    }
                                }
                            }
                        }

                        &.fourth {
                            align-items: center;

                            > video {
                                width: 850px;
                                height: 478px;
                                border-radius: 8px;
                            }
                        }
                    }

                    .moblieItem {
                        width: calc(100vw - 100px);
                        height: auto;
                        min-height: 388px;
                        border-radius: 8px 8px 0px 0px;
                        background-color: #F4F8FD;
                        border-top: 2px solid #4D8DE8;
                        padding: 0 44px 40px 44px;

                        ${media.smallMobile`
                            width: calc(100vw - 40px);
                            min-height: 250px;
                            padding: 0 20px 20px 20px;
                        `};

                        h1 {
                            text-align: center;
                            line-height: 22px;
                            color: #4D8DE8;
                            padding: 14px;
                            margin-bottom: 40px;

                            ${media.smallMobile`
                                margin-bottom: 20px;
                            `};
                        }

                        h2 {
                            font-size: 20px;
                            font-weight: 400;
                            line-height: 30px;
                            color: #333;

                            ${media.smallMobile`
                                font-size: 12px;
                                line-height: 20px;
                            `};

                            .highlight {
                                color: #4D8DE8;
                                font-size: 24px;
                                font-weight: 600;

                                ${media.smallMobile`
                                    font-size: 16px;
                                `};
                            }
                        }

                        &.first {
                            .checklist {
                                margin-top: 20px;
    
                                li {
                                    font-size: 18px;
                                    line-height: 30px;
                                    display: flex;
                                    align-items: center;
                                    gap: 20px;

                                    ${media.smallMobile`
                                        font-size: 12px;
                                        line-height: 20px;
                                        gap: 10px;
                                    `};

                                    &:not(:last-child) {
                                        margin-bottom: 16px;
                                    }
    
                                    &::before {
                                        content: '';
                                        min-width: 24px;
                                        width: 24px;
                                        height: 24px;
                                        display: inline-block;
                                        background: url(${tab1_check}) no-repeat center center;
                                        background-size: contain;

                                        ${media.smallMobile`
                                            min-width: 16px;
                                            width: 16px;
                                            height: 16px;
                                        `};
                                    }
                                }
                            }
                        }

                        &.second,
                        &.third {
                            > ul {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                flex-wrap: wrap;
                                gap: 25.5px;
                                margin: 40px auto 0 auto;

                                > li {
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;

                                    p {
                                        &:nth-child(2) {
                                            color: #185BBC;
                                            font-size: 14px;
                                            font-weight: 400;
                                            line-height: 22px;
                                            width: 175px;
                                            padding: 4px 0;
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            gap: 12px;
                                            border-radius: 46px;
                                            background: #fff;
                                            box-shadow: 0px 0px 12px 0px rgba(2, 26, 79, 0.06);
                                            margin: 15px 0 8px 0;
                                        }

                                        &:nth-child(3) {
                                            color: #666666;
                                            font-size: 12px;
                                            line-height: 22px;
                                        }
                                    }

                                    &:nth-child(1) > p:nth-child(2)::before {
                                        content: '';
                                        display: inline-block;
                                        width: 14px;
                                        height: 14px;
                                        background: url(${tab2_icon1}) no-repeat center center;
                                        background-size: contain;
                                    }

                                    &:nth-child(2) > p:nth-child(2)::before {
                                        content: '';
                                        display: inline-block;
                                        width: 14px;
                                        height: 14px;
                                        background: url(${tab2_icon2}) no-repeat center center;
                                        background-size: contain;
                                    }

                                    &:nth-child(3) > p:nth-child(2)::before {
                                        content: '';
                                        display: inline-block;
                                        width: 26px;
                                        height: 16px;
                                        background: url(${tab2_icon3}) no-repeat center center;
                                        background-size: contain;
                                    }
                                }
                            }
                        }

                        &.third {
                            h2 {
                                text-align: right;
                            }

                            > ul {
                                gap: 80px;

                                > li {
                                    &:nth-child(1) > p:nth-child(2)::before {
                                        content: '';
                                        display: inline-block;
                                        width: 26px;
                                        height: 16px;
                                        background: url(${tab3_icon1}) no-repeat center center;
                                    }

                                    &:nth-child(2) > p:nth-child(2)::before {
                                        content: '';
                                        display: inline-block;
                                        width: 26px;
                                        height: 16px;
                                        background: url(${tab2_icon3}) no-repeat center center;
                                    }
                                }
                            }
                        }

                        &.fourth {
                            align-items: center;

                            > video {
                                width: 100%;
                                min-height: 262.759px;
                                border-radius: 8px;

                                ${media.smallMobile`
                                    min-height: 150px;
                                `};
                            }
                        }
                    }
                }

                .pageWrap {
                    display: flex;
                    flex-direction: column;
                    gap: 260px;
                    margin-bottom: 380px;

                    ${media.mobile`
                        gap: 160px;
                        margin-bottom: 300px;
                    `};

                    ${media.smallMobile`
                        gap: 100px;
                        margin-bottom: 200px;
                    `};

                    > li {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;

                        ${media.tablet`
                            align-items: center;
                        `};

                        > h2 {
                            color: #333;
                            font-size: 24px;
                            font-weight: 600;
                            line-height: 38px;
                            display: flex;
                            gap: 10px;
                            align-items: center;
                            margin-bottom: 12px;

                            ${media.smallMobile`
                                font-size: 16px;
                            `};

                            &::before {
                                content: '';
                                display: inline-block;
                                width: 30px;
                                height: 30px;
                                background: url(${tab2_icon2}) no-repeat center center;
                                background-size: contain;

                                ${media.smallMobile`
                                    width: 16px;
                                    height: 16px;
                                `};
                            }

                            .highlight {
                                color: #888;
                                font-size: 18px;
                                font-weight: 500;
                                line-height: 26px;
                                display: flex;
                                gap: 10px;
                                align-items: center;

                                ${media.smallMobile`
                                    font-size: 12px;
                                `};

                                &::before {
                                    content: '';
                                    display: inline-block;
                                    width: 1px;
                                    height: 16px;
                                    background-color: #888;

                                    ${media.smallMobile`
                                        height: 12px;
                                    `};
                                }
                            }
                        }

                        > h3 {
                            color: #333;
                            font-size: 18px;
                            line-height: 26px;
                            margin-bottom: 24px;
                            padding: 0;
                            word-break: keep-all;
                            text-align: left;

                            ${media.mobile`
                                padding: 0 50px;
                                text-align: center;
                            `};

                            ${media.smallMobile`
                                font-size: 12px;
                                line-height: 20px;
                            `};

                            .highlight {
                                color: #4D8DE8;
                                font-weight: 500;
                                font-size: 18px;

                                ${media.smallMobile`
                                    font-size: 12px;
                                `};
                            }
                        }

                        .content {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            flex-direction: row;
                            gap: 23px;

                            ${media.tablet`
                                flex-direction: column;
                            `};

                            .imgWrap {
                                width: 926px;
                                position: relative;

                                ${media.tablet`
                                    width: calc(100vw - 100px);
                                `};

                                ${media.smallMobile`
                                    width: calc(100vw - 40px);
                                `};

                                &::before {
                                    content: '';
                                    width: 100%;
                                    height: 100%;
                                    background: #000;
                                    display: inline-block;
                                    border-radius: 8px;
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    transition: opacity 0.3s ease-in-out;
                                    opacity: 0;
                                }

                                &:hover {
                                    &::before {
                                        opacity: .1;

                                        ${media.tablet`
                                            opacity: 0;
                                        `};
                                    }

                                    button {
                                        opacity: 1;
                                    }
                                }

                                > img {
                                    width: 100%;

                                    ${media.tablet`
                                        width: calc(100vw - 100px);
                                    `};

                                    ${media.smallMobile`
                                        width: calc(100vw - 40px);
                                    `};
                                }

                                button {
                                    text-indent: -9999px;
                                    width: 32px;
                                    height: 32px;
                                    position: absolute;
                                    top: 50%;
                                    background: url(${page_next_btn}) no-repeat center center;
                                    background-size: contain;
                                    opacity: 0;
                                    transition: opacity 0.3s ease-in-out;

                                    ${media.tablet`
                                        opacity: 1;
                                    `};

                                    ${media.smallMobile`
                                        width: 20px;
                                        height: 20px;
                                    `};

                                    &.prev {
                                        left: 24px;
                                        transform: scaleX(-1);

                                        ${media.smallMobile`
                                            left: 10px;
                                        `};
                                    }

                                    &.next {
                                        right: 24px;

                                        ${media.smallMobile`
                                            right: 10px;
                                        `};
                                    }
                                }
                            }

                            .card {
                                width: 411px;
                                height: 522px;
                                border-radius: 8px;
                                box-shadow: 0px 0px 12px 0px rgba(2, 26, 79, 0.06);
                                padding: 52px 0;

                                ${media.tablet`
                                    width: calc(100vw - 100px);
                                    min-height: 296px;
                                    height: auto;
                                    padding: 40px 0;
                                `};

                                ${media.smallMobile`
                                    width: calc(100vw - 40px);
                                    min-height: 230px;
                                    padding: 30px 0;
                                `};

                                &::before {
                                    content: '';
                                    width: 110px;
                                    height: 110px;
                                    display: block;
                                    background: url(${tab2_icon2}) no-repeat center center;
                                    background-size: contain;
                                    opacity: .1;
                                    position: absolute;
                                    right: 24px;
                                    bottom: 24px;
                                }

                                > p {
                                    font-size: 18px;
                                    line-height: 26px;
                                    border-radius: 0px 20px 20px 0px;
                                    background: #F4F8FD;
                                    color: #4D8DE8;
                                    width: 175px;
                                    height: 40px;
                                    padding: 0px 0px 0px 40px;
                                    display: flex;
                                    align-items: center;
                                    margin-bottom: 52px;

                                    ${media.smallMobile`
                                        font-size: 12px;
                                        width: 130px;
                                        height: 32px;
                                        padding: 0 24px;
                                        margin-bottom: 30px;
                                    `};

                                    &:not(:last-child) {
                                        margin-bottom: 40px;

                                        ${media.smallMobile`
                                            margin-bottom: 30px;
                                        `};
                                    }
                                }

                                .description {
                                    padding: 0 44px;

                                    ${media.smallMobile`
                                        padding: 0 20px;
                                    `};

                                    > p {
                                        font-size: 18px;
                                        line-height: 30px;
                                        color: #333;
                                        display: flex;
                                        gap: 16px;
                                        white-space: pre-line;

                                        &:not(:last-child) {
                                            margin-bottom: 28px;

                                            ${media.smallMobile`
                                                margin-bottom: 18px;
                                            `};
                                        }

                                        ${media.tablet`
                                            white-space: normal;
                                        `};

                                        ${media.smallMobile`
                                            font-size: 12px;
                                            line-height: 20px;
                                            gap: 10px;
                                        `};

                                        &::before {
                                            content: '';
                                            display: inline-block;
                                            min-width: 28px;
                                            width: 28px;
                                            height: 28px;
                                            background: url(${page_check}) no-repeat center center;
                                            background-size: contain;
                                            position: relative;
                                            top: 2px;

                                            ${media.smallMobile`
                                                min-width: 20px;
                                                width: 20px;
                                                height: 20px;
                                            `};
                                        }
                                    }
                                }
                            }
                        }

                        &:nth-child(2) {
                            > h2 {
                                &::before {
                                    background: url(${tab2_icon1}) no-repeat center center;
                                    background-size: contain;
                                }
                            }

                            .card  {
                                &::before {
                                    width: 113px;
                                    height: 109px;
                                    background: url(${tab2_icon1}) no-repeat center center;
                                    background-size: contain;
                                }
                            }
                        }

                        &:nth-child(3) {
                            > h2 {
                                &::before {
                                    width: 43px;
                                    height: 26px;
                                    background: url(${tab3_icon1}) no-repeat center center;
                                    background-size: contain;

                                    ${media.smallMobile`
                                        width: 21px;
                                        height: 13px;
                                    `};
                                }
                            }

                            .card  {
                                &::before {
                                    width: 136px;
                                    height: 84px;
                                    background: url(${tab3_icon1}) no-repeat center center;
                                    background-size: contain;
                                }
                            }
                        }

                        &:nth-child(4) {
                            > h2 {
                                &::before {
                                    width: 42px;
                                    height: 26px;
                                    background: url(${tab2_icon3}) no-repeat center center;
                                    background-size: contain;

                                    ${media.smallMobile`
                                        width: 21px;
                                        height: 13px;
                                    `};
                                }
                            }

                            .card  {
                                &::before {
                                    width: 137px;
                                    height: 84px;
                                    background: url(${tab2_icon3}) no-repeat center center;
                                    background-size: contain;
                                }
                            }
                        }
                    }
                }

                .referenceWrap {
                    display: flex;
                    align-items: center;
                    gap: 46px;
                    margin: 72px 0 260px 0;
                    flex-direction: row;

                    ${media.tablet`
                        width: calc(100vw - 100px);
                        flex-direction: column;
                        margin: 40px 0 160px 0;
                    `};

                    ${media.smallMobile`
                        width: calc(100vw - 40px);
                        margin: 30px 0 100px 0;
                    `};

                    > div {
                        text-align: right;

                        > p:first-child {
                            color: #006FFF;
                            font-size: 32px;
                            font-weight: 600;
                            line-height: 50px;

                            ${media.smallMobile`
                                font-size: 20px;
                                line-height: 30px;
                            `};
                        }

                        > p:last-child {
                            color: #888888;
                            font-size: 18px;
                            font-weight: 400;
                            line-height: 30px;
                            white-space: pre-line;

                            ${media.smallMobile`
                                font-size: 12px;
                                line-height: 20px;
                            `};
                        }

                        > span {
                            width: 570px;
                            height: 2px;
                            background: url(${line_blue}) no-repeat center center;
                            background-size: contain;
                            display: block;
                            position: relative;
                            margin: 12px 0;

                            ${media.mobile`
                                width: calc(100vw - 100px);
                            `};

                            ${media.smallMobile`
                                width: calc(100vw - 40px);
                            `};

                            &::before {
                                content: '';
                                width: 8px;
                                height: 8px;
                                background: #006FFF;
                                border-radius: 50%;
                                display: block;
                                position: absolute;
                                right: -1px;
                                top: -3px;
                            }
                        }
                    }

                    > ul {
                        display: flex;
                        justify-content: center;
                        flex-wrap: wrap;
                        gap: 32px;

                        ${media.mobile`
                            gap: 13.5px;
                        `};

                        > li {
                            width: 122px;
                            height: 166px;
                            border-radius: 8px;
                            border: 0.5px solid #BEC4D9;
                            box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            position: relative;

                            &::before {
                                content: '';
                                display: block;
                                width: 74px;
                                height: 74px;
                                position: absolute;
                                top: 16px;
                                right: 16px;
                            }

                            > p {
                                font-size: 16px;
                                line-height: 22px;
                                color: #333333;
                                position: absolute;
                                bottom: 20px;

                                ${media.smallMobile`
                                    font-size: 12px;
                                    line-height: 20px;
                                `};
                            }

                            &:nth-child(1)::before {
                                background: url(${reference_bl_1}) no-repeat center center;
                            }

                            &:nth-child(2)::before {
                                background: url(${reference_bl_2}) no-repeat center center;
                            }

                            &:nth-child(3)::before {
                                background: url(${reference_bl_3}) no-repeat center center;
                            }

                            &:nth-child(4)::before {
                                background: url(${reference_bl_4}) no-repeat center center;
                            }

                            &:nth-child(5)::before {
                                background: url(${reference_bl_5}) no-repeat center center;
                            }
                        }
                    }

                    &:nth-child(3) {
                        margin-top: 0;

                        ${media.mobile`
                            margin-bottom: 300px;
                        `};

                        ${media.smallMobile`
                            margin-bottom: 200px;
                        `};

                        > div {
                            text-align: left;
                            order: 2;

                            ${media.tablet`
                                order: 1;
                            `};

                            > p:first-child {
                                color: #37B44A;
                            }

                            > span {
                                background: url(${line_green}) no-repeat center center;
                                background-size: contain;

                                &::before {
                                    background: #37B44A;
                                    left: -1px;
                                }
                            }
                        }

                        > ul {
                            order: 1;

                            ${media.tablet`
                                order: 2;
                            `};

                            > li {
                                &:nth-child(1)::before {
                                    background: url(${reference_gr_1}) no-repeat center center;
                                }

                                &:nth-child(2)::before {
                                    background: url(${reference_gr_2}) no-repeat center center;
                                }

                                &:nth-child(3)::before {
                                    background: url(${reference_gr_3}) no-repeat center center;
                                }

                                &:nth-child(4)::before {
                                    background: url(${reference_gr_4}) no-repeat center center;
                                }

                                &:nth-child(5)::before {
                                    background: url(${reference_gr_5}) no-repeat center center;
                                }
                            }
                        }
                    }
                }

                .infoWrap {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: row;
                    gap: 48px;
                    margin: 72px 0 240px 0;

                    ${media.tablet`
                        flex-direction: column;
                        margin: 30px 0 10px 0;
                    `};

                    ${media.smallMobile`
                        gap: 20px;
                        margin: 30px 0 200px 0;
                    `};

                    > li {
                        width: 520px;
                        height: 684px;
                        border-radius: 8px;
                        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
                        display: flex;
                        flex-direction: column;
                        align-items: center;

                        ${media.tablet`
                            width: calc(100vw - 100px);
                            height: auto;
                            min-height: 304px;
                            flex-direction: row;
                        `};

                        ${media.smallMobile`
                            width: calc(100vw - 40px);
                            min-height: 304px;
                            flex-direction: column;
                        `};

                        .imgArea {
                            width: 100%;
                            height: 400px;
                            background-color: #ECEEF4;
                            border-radius: 8px 8px 0 0;
                            position: relative;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            overflow: hidden;

                            ${media.tablet`
                                height: auto;
                                min-height: 304px;
                            `};

                            ${media.smallMobile`
                                min-height: 190px;
                            `};

                            &::before {
                                content: '';
                                width: 100%;
                                height: 400px;
                                background: url(${info_icon_bg}) no-repeat center center;
                                position: absolute;
                                bottom: -50px;
                                right: -88px;

                                ${media.tablet`
                                    bottom: -145px;
                                    right: -185px;
                                `};
                            }

                            img {
                                z-index: 2;

                                ${media.tablet`
                                    width: 140px;
                                    height: 140px;
                                `};

                                ${media.smallMobile`
                                    width: 80px;
                                    height: 80px;
                                `};
                            }
                        }

                        .infoArea {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            padding: 0 25px;

                            p:nth-child(1) {
                                color: #888888;
                                font-size: 34px;
                                font-weight: 600;
                                line-height: 50px;
                                margin-top: 48px;
                                margin-bottom: 20px;

                                ${media.tablet`
                                    font-size: 26px;
                                    line-height: 42px;
                                `};

                                ${media.smallMobile`
                                    font-size: 16px;
                                    line-height: 20px;
                                    margin-top: 30px;
                                    margin-bottom: 10px;
                                `};
                            }
    
                            p:nth-child(2) {
                                color: #888888;
                                font-size: 16px;
                                line-height: 22px;
                                margin-bottom: 48px;
                                width: 284px;
                                text-align: center;
                                word-break: keep-all;

                                ${media.tablet`
                                    font-size: 14px;
                                    line-height: 22px;
                                    margin-bottom: 36px;
                                `};

                                ${media.smallMobile`
                                    font-size: 12px;
                                    line-height: 20px;
                                    margin-bottom: 20px;
                                `};
                            }
    
                            button {
                                display: flex;
                                padding: 12px 48px;
                                justify-content: center;
                                align-items: center;
                                gap: 8px;
                                background-color: #fff;
                                border-radius: 48px;
                                border: 1px solid #BEC4D9;
                                color: #BEC4D9;
                                font-size: 18px;
                                font-weight: 500;
                                line-height: 26px;
                                margin-bottom: 48px;

                                ${media.smallMobile`
                                    font-size: 12px;
                                    line-height: 20px;
                                    padding: 9px 25px;
                                    margin-bottom: 30px;
                                `};
    
                                &::after {
                                    content: '';
                                    width: 13px;
                                    height: 13px;
                                    display: inline-block;
                                }
                            }
                        }


                        &:nth-child(1) button::after {
                            background: url(${info_btn_icon1}) no-repeat center center;
                        }

                        &:nth-child(2) button::after {
                            background: url(${info_btn_icon2}) no-repeat center center;
                        }

                        &:hover {
                            .imgArea {
                                img {
                                    filter: invert(39%) sepia(100%) saturate(4895%) hue-rotate(206deg) brightness(100%) contrast(109%);
                                }
                            }

                            button {
                                background-color: #006EFF;
                                border: 1px solid #006EFF;
                                color: #fff;
                            }

                            &:nth-child(1) button::after {
                                background: url(${info_btn_icon1_white}) no-repeat center center;
                            }

                            &:nth-child(2) button::after {
                                background: url(${info_btn_icon2_white}) no-repeat center center;
                            }
                        }
                    }
                }
            }
        }
    }
`;