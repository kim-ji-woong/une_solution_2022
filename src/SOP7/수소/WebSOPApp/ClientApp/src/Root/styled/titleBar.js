import styled from "styled-components";
import PR from "../resource/id";

import '../../Common/css/commonWonik.scss';

import rqLogo from "../../Common/img/common/rq_logo.png";
import rqLogoHydrogen from "../../Common/img/imghydrogen/KSMS_Logo.svg";

import rqQckBtn from "../../Common/img/common/rq_quick.png";
import rqUser2 from "../../Common/img/common/rq_user2.png";
import rqUser3 from "../../Common/img/common/rq_user3.png";
import rqProfile from "../../Common/img/common/rq_profile.jpg";

import gg_titlebar_arrow_default from '../../Common/img/imgGyeonggi/gg_titlebar_arrow_default.svg';
import gg_titlebar_select_arrow from '../../Common/img/imgGyeonggi/gg_titlebar_select_arrow.svg';

import clock_icon from '../../Common/img/imghydrogen/main/clock_icon.svg';
import user_icon from '../../Common/img/imghydrogen/main/user_icon.svg';
import user_icon_active from '../../Common/img/imghydrogen/main/user_icon_active.svg';
import menu_icon from '../../Common/img/imghydrogen/main/menu_icon.svg';
//import menu_icon_active from '../../Common/img/imghydrogen/main/menu_icon_active.svg';
import setting_icon from '../../Common/img/imghydrogen/main/setting_icon.svg';
import setting_icon_active from '../../Common/img/imghydrogen/main/setting_icon_active.svg';

import management_icon from '../../Common/img/imghydrogen/main/management_icon.svg';
import logout_icon from '../../Common/img/imghydrogen/main/logout_icon.svg';
import doubleArrowRight from '../../Common/img/imghydrogen/main/doubleArrowRight.svg';
//import Umanagement from '../../Common/img/imghydrogen/main/management_icon.svg';
import userUnLock from '../../Common/img/imghydrogen/main/userUnLock_icon.svg';
import userLogout from '../../Common/img/imghydrogen/main/userLogout.svg';
import userLogout_active from '../../Common/img/imghydrogen/main/userLogout_active.svg';


/**********************************************************************/

export const TitleBar = styled.div`
    & {
        position: fixed;
        z-index: 2;
        background: #131313;
        height: 50px;
        padding: 9px 16px;
        width: 100vw;
        color: var(--white-color);
        display: flex;
        align-items: center;
        cursor: default;
    }

    &:after {
        ${props => props.theme.variables.clearfix()};
    }

    .rqLogoWrap {
        display: flex;
        align-items: center;
        
        p{
            color: #FFF;
            font-family: "Spoqa Han Sans Neo";
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            line-height: 172%; 
            letter-spacing: -0.42px;
        }
        span {
            font-size: 18px;
            padding-left: 20px;
            margin-left: 20px; 
            border-left: 20px;
        }
    }

    .rqTimeWrap{
        display: flex;
        align-items: center;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        .timeBox{
            display: flex;
            align-items: center;
            color: var(--grayscale-g-50-ebebed, #EBEBED);
            font-family: "Spoqa Han Sans Neo";
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            line-height: 172%; 
            letter-spacing: -0.42px;
            margin-left: 8px;
            margin-right: 16px;

            &::before{
                display: inline-block;
                content: '';
                width: 16px;
                height: 16px;
                background: url(${clock_icon}) no-repeat center;
                background-position: center;
                margin-right: 8px;
            }
        }
        .dayBox{
            color: var(--grayscale-g-50-ebebed, #EBEBED);
            font-family: "Spoqa Han Sans Neo";
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            line-height: 172%;
            letter-spacing: -0.42px;
        }
    }

    .rqBtnWrap {
        position: absolute;
        right: 0;
        margin-right: 12px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .rqQckBtn {
        display: none;
    }

    .logoShortCut {
        position: absolute;
        background: #222222;
        color: #fff;
        border: solid 0.5px #737373;
        width: 30px;
        height: 20px;
        left: -20px;
        top: 5px;
        z-index: 2;
        text-align: center;
        padding-top: 5px;
        font-size: 10px;
        font-weight: 400;
        opacity: 0.8;
    }

    .hideKey {
        visibility: hidden;
    }

    .rqLogo {
        display: block;
        float: left;
        width: 140px;
        height: 22px;
        background: url(${rqLogo}) no-repeat center center;
        cursor: pointer;
        top: 19px;
    }

    .rqLogoHydrogen {
        display: inline-block;
        float: left;
        width: 32px;
        height: 32px;
        margin-right: 16px;
        background: url(${rqLogoHydrogen}) no-repeat center;
        background-size: 100%;
        cursor: pointer;
    }

    .rqQck {
        display: none;
        float: left;
        position: relative;
        margin-right: 20px;
    }

    .rqQck button {
        display: block;
        width: 30px;
        height: 30px;
        cursor: pointer;
        text-indent: -9999px;
        background: url(${rqQckBtn}) no-repeat center center;
    }

    .rqApp {
        /* float: left;
        position: relative; */
        order: 2;
        padding: 0 8px;
        cursor: pointer;
    }

    .rqApp button {
        display: block;
        width: 36px;
        height: 36px;
        text-indent: -9999px;
        background: url(${menu_icon}) no-repeat center center;
        cursor: pointer;
        /* position: relative;
        top: -1px; */
    }

    .rqApp ul {
        display: none;
        position: absolute;
        top: 100%;
        right: 0%;
        min-width: 120px;
        margin-top: 16px;
        margin-left: -140px;
        background: #131313;
        border-radius: 4px;
    } 

    .rqApp ul li {
        position: relative;
    } 

    .rqApp ul li a {
        display: block;
        color: #B6C6D2;
        text-align: left;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        height: 38px;
        padding: 12px;
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
        padding-right: 40px;

        &:hover{
            color: #0085FF;
            &:after{
                content: "";
                display: inline-block;
                width: 20px;
                height: 20px;
                background: url(${doubleArrowRight}) no-repeat center bottom;
                position: absolute;
                right: 10px;
                top: 10px;
            }
        }
    }

    .rqApp ul li a:hover {
       /*  background: var(--dashboard-color);
        color: #0085FF; */
    }

    .menuShortCut {
        position: absolute;
        background: #222222;
        color: #fff;
        border: solid 0.5px #737373;
        width: 30px;
        height: 20px;
        left: -10px;
        z-index: 1;
        text-align: center;
        padding-top: 6%;
        font-size: 10px;
        opacity: 0.8;
    }

    .hideKey {
        visibility: hidden;
    }

    .rqUsr {
        /* float: left;
        position: relative; */
        margin-right: 0px;
        order: 1;

        &.on button:before {
            background: url(${user_icon_active}) no-repeat center center;
        }
    }

    .rqUsr button {
        /* display: block;
        height: 22px;
        background: none;
        color: var(--middle-gray-color);
        cursor: pointer;
        position: relative;
        top: -1px; */
    }

    .rqUsr button:before {
        content: "";
        display: inline-block;
        vertical-align: middle;
        width: 36px;
        height: 36px;
        background: url(${user_icon}) no-repeat center center;
    }

    .rqUsr button span {
        margin: 5px 10px 5px 5px;
        font-size: 14px;
        font-weight: bold;
    }

    .rqUsrSpan.on:after {
        background-position: center top;
    }
    .rqUsrSpan p{
        display: inline-block;
        margin-right: 10px;
    }

    /* hydrogen */
    .rqContectNation{
        display: block;
        color: #D9D9D9;
        font-size: 10px;
        font-family: Pretendard;
        text-align: left;
        margin-top: 2.5px;
    }

    .rqUsr div {
        display: none;
        position: absolute;
        width: 167px;
        /* height: 76px; */
        top: 100%;
        right: 20px;
        margin-top: 11px;
        margin-left: -66px;
        border-radius: 4px;
        background: #131313;
        box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.17);
        overflow: hidden;
        /* padding: 12px; */
    }

    .rqIDBox{
        cursor: pointer;
    }

    .rqUsr .rqIDBox span {
        display: block;
        color: #B6C6D2;
        font-family: "Spoqa Han Sans Neo";
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
        margin:12px 0px 11px 12px;

        &:hover{
            color: #0085FF;

            &:after{
                content: "";
                display: inline-block;
                width: 20px;
                height: 20px;
                background: url(${doubleArrowRight}) no-repeat center bottom;
                position: absolute;
                right: 10px;
                top: 10px;
            }
        }
    }

    .rqUsr .rqIDBox p {
        display: block;
        color: #7E878B;
        font-family: "Spoqa Han Sans Neo";
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 12px;
        margin-left: 12px;
    }

    .rqUsr div ul {
        margin-top: 12px;
    }

    .rqUsr div ul:after {
        ${props => props.theme.variables.clearfix()};
    }

    .rqUsr div ul li {
        background: #131313;
        padding: 12px;
        color: #B6C6D2;
        font-family: "Spoqa Han Sans Neo";
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
        cursor: pointer;
    }

    .rqUsr div ul li:nth-child(1) {
        background: #131313 url(${management_icon})no-repeat 8% 50%;
        padding: 12px 12px 12px 38px;
        color: #B6C6D2;
        font-family: "Spoqa Han Sans Neo";
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
        cursor: pointer;

        &:hover{
            color: #0085FF;
            background: url(${userUnLock})no-repeat 8% 50%;
            z-index: 1;

            &:after{
                content: "";
                display: inline-block;
                width: 20px;
                height: 20px;
                background: url(${doubleArrowRight}) no-repeat center bottom;
                position: absolute;
                right: 10px;
                top: 70px;
            }
        }
    }

    .rqUsr div ul li:nth-child(2) {
        background: #131313 url(${userLogout})no-repeat 8% 50%;
        padding: 12px 12px 12px 38px;
        color: #B6C6D2;
        font-family: "Spoqa Han Sans Neo";
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
        cursor: pointer;

        &:hover{
            color: #0085FF;
            background: url(${userLogout_active})no-repeat 5.5% 80%;
            z-index: 1;

            &:after{
                content: "";
                display: inline-block;
                width: 20px;
                height: 20px;
                background: url(${doubleArrowRight}) no-repeat center bottom;
                position: absolute;
                right: 10px;
                top: 108px;
            }
        }
    }


    .adminIconArea{
        display: block;
    }

    /* .adminIconArea .adminIconAreaLi{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        font-size: 12px;
        color: #D8D8D8;
        background: #244554;
    }
    .adminIconArea .adminIconAreaLi a{
        background: #244554;
    } */

    .rqUsr div ul li a {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 10px;
        cursor: pointer;
    }

    .rqUsr div ul li .Alogout {
        display: inline-block;
        width: 16px;
        height: 16px;
    }

    .rqUsr div ul .rqli {
        float: left;
        width: 50%;
        background: #1a212e;
    }

    .rqUsr div ul .rqli .Upassword {
        width: 15px;
        height: 12px;
        margin-left: 3px;
        margin-top: 9px;
        display: inline-block;
    }

    .rqUsr div ul .rqli .Ulogout {
        width: 13px;
        height: 12px;
        margin-left: 3px;
        margin-top: 8.5px;
        display: inline-block;
    }

    .rqStng {
        display: block;
        width: 36px;
        height: 36px;
        /* background: url(${setting_icon}) no-repeat center center; */
        order: 3;
        cursor: pointer;
    }

    .rqUsr.deputy button:before {
        background: url(${rqUser2}) no-repeat center center;
    }

    .rqUsr.deputy div {
        border: solid 1px #44addf;
    }

    .rqUsr.deputy div em {
        border: solid 2px #44addf;
    }

    .rqUsr.deputy div span {
        color: #44addf;
    }

    .rqUsr.deputy div ul li {
        width: 100%;
    }

    .rqUsr.deputy div ul li a {
        font-size: 12px;
    }

    .rqUsr.deputy div ul li a:hover {
        background: #44addf;
    }

    .rqUsr.user button:before {
        background: url(${rqUser3}) no-repeat center center;
    }

    .rqUsr.user div {
        border: solid 1px #fc8b07;
    }

    .rqUsr.user div em {
        border: solid 2px #fc8b07;
    }

    .rqUsr.user div span {
        color: #fc8b07;
    }

    .rqUsr.user div ul li a {
        font-size: 12px;
    }

    .rqUsr.user div ul li a:hover {
        background: #fc8b07;
    }

    .adminProfile {
        background: url(${rqProfile}) no-repeat center center;
    }

    .adminUserName{
        display: block;
        font-size: 16px !important;
        text-align: center;
    }

    .adminContectNation{
        display: block;
        font-size: 10px !important;
        color: #ffffff;
        padding: 3px;
    }

    .setShortCut {
        position: absolute;
        background: #222222;
        color: #fff;
        border: solid 0.5px #737373;
        width: 30px;
        height: 20px;
        right: 30px;
        top: 7px;
        z-index: 1;
        text-align: center;
        padding-top: 1.6%;
        font-size: 10px;
        opacity: 0.8;
    } 
`;


export const CampusBarComponent = styled.div`
    position: absolute;
    top: -8px;
    right: 220px;
    z-index: 3;
    color: #D3D5D9;
    margin-right: 40px;

    .rqCampus {
        position: fixed;
        left: 50%;
        top: 15px;
        transform: translate(-50%, 0);
        
        h5 {
            color: #5398FF;
            font-size: 20px;
            font-weight: 600;
        }
    }

    ul {
        ${props => props.theme.variables.flex()};
        font-size: 14px;
        position: relative;
        top: 3px;

        li {
            width: 76px;
            height: 28px;
            line-height: 27px;
            text-align: center;
            letter-spacing: 0.8px;
            border: 1px solid var(--dark-gray-color);
            border-radius: 5px;
            margin-left: 10px;
            cursor: pointer;

            &.on {
                background: transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;
                color: #fff;
            }
        }
    }

    > p {
        position: relative;
        top: 10px;
        width: 112px;
        user-select: none;
    }

    .rqCampus_gg {
        ${props => props.theme.variables.flex('flex-start', 'center')}
        gap: 10px;

        .allBtn {
            width: 142px;
            height: 36px;
            background: #525868 0% 0% no-repeat padding-box;
            border-radius: 5px;
            ${props => props.theme.variables.flex('center', 'center')}

            span {
                color: #fff;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 10px;

                &::after {
                    content: '';
                    display: inline-block;
                    background: url(${gg_titlebar_arrow_default}) no-repeat center center;
                    width: 16px;
                    height: 11px;
                }
            }

            &:hover {
                background: #5398FF;
            }

            &:active {
                background: transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;
            }
        }

        .leftBtn {
            width: 156px;
            height: 36px;
            background: #272E42 url(${gg_titlebar_select_arrow}) 95% 49% no-repeat;
            border: 1px solid #525868;
            border-radius: 5px;
            color: #fff;
            font-size: 14px;
            padding-left: 10px;
            padding-right: 28px;
            cursor: pointer;
            white-space: nowrap; 
            text-overflow: ellipsis; 
            overflow: hidden;

            &:hover {
                border: 1px solid #3B83F4;
            }

            &.on,
            &:active {
                border: 1px solid #4F96FE;
            }
        }

        ul {
            display: none;
            width: 156px;
            background: #0E162D;
            border: 1px solid #FFFFFF38;
            font-size: 14px;
            position: absolute;
            top: 36px;
            right: 0;
            
            li {
                width: 100%;
                height: 26px;
                line-height: 26px;
                text-align: center;
                letter-spacing: 0.3px;
                border: 0;
                border-radius: 0;
                margin-left: 0;
                font-size: 14px !important;
                color: #fff;
                cursor: pointer;

                &:hover {
                    background: #FFFFFF38;
                }
            }

            &.on {
                display: block;
            }
        }
    }
`;