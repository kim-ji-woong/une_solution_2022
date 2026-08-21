import styled from 'styled-components';

import close_icon from '../../Common/images/close_icon.png';
import search_off from '../images/search_off.png';
import search_on from '../images/search_on.png';
import update_off from '../images/update_off.png';
import update_on from '../images/update_on.png';
import delete_off from '../images/delete_off.png';
import delete_on from '../images/delete_on.png';
import select_arrow from '../images/select_arrow.png';
import get_teamInfo_icon from '../images/get_teamInfo_icon.png';

import pwd_popup_icon from '../images/pwd_popup_icon.png';


/**********************************************************************/
// 타이틀바 팝업 공통 CSS

export const AccountPopupCommon = styled.div`
    background-color: ${(props) => props.theme.darkColor};
    z-index: 99;
    overflow: hidden;

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
        border-top: 0;
        border-left: 0;
    }

    .buttonWrap {
        ${(props) => props.theme.flex('center', 'center')};
        gap: 9px;
        width: 100%;
        position: absolute;
        bottom: 0;

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

    .disabledCheckbox {
        display: inline-block;
        width: 15px;
        height: 15px;
        border: 1px solid #707070;
        border-radius: 2px;
        position: relative;
        top: 3px;
        background: ${(props) => props.theme.middleGray};
    }
`;


/**********************************************************************/
// 사용자계정 및 권한관리 팝업

export const AccountManagerComponent = styled(AccountPopupCommon)`
    width: 1430px;
    height: calc(100% - 230px);

    position: absolute;
    left: 50%;
    top: 57%;
    transform: translate(-50%, -58%);
    padding: 18px 25px;

    .header {
        ${(props) => props.theme.flex()};

        color: ${(props) => props.theme.mainColor};
        font-weight: bold;
        margin-bottom: 23px;

        .closeBtn {
            display: block;
            width: 12px;
            height: 12px;
            background: url(${close_icon}) no-repeat center center;
            z-index: 1;
            cursor: pointer;
        }
    }

    .content {
        height: calc(100% - 36px);
        
        nav {
            width: 100%;
            border-bottom: 1px solid rgba(165, 165, 165, .45);

            ul {
                ${(props) => props.theme.flex('flex-start', 'center')};
                gap: 16.5px;
                color: ${(props) => props.theme.middleGray};
                font-size: 14px;

                li {
                    padding: 0 15px 7.5px 15px;
                    position: relative;
                    top: 2px;
                    border-bottom: 3px solid #707070;
                    cursor: pointer;

                    &.on {
                        border-bottom: 3px solid ${(props) => props.theme.mainColor};
                        color: #fff;
                    }
                }
            }
        }

        .searchWrap {
            ${(props) => props.theme.flex('flex-end', 'center')};
            gap: 4px;
            padding: 8px 0;
            margin-right: 2px;

            &.on {
                a {
                    &:nth-child(4) {
                        background: url(${delete_on}) no-repeat center center, rgba(32, 223, 168, .3);
                    }
                }
            }

            input {
                width: 297px;
                height: 27px;
                background: rgba(255, 255, 255, .1);
                border-radius: 4px;
                color: #fff;
                font-size: 12px;
                padding-left: 10px;
            }

            a {
                display: block;
                width: 27px;
                height: 27px;
                text-indent: -9999px;
                border-radius: 2px;
                cursor: pointer;

                &:nth-child(2) {
                    background: url(${search_on}) no-repeat center center, rgba(32, 223, 168, .3);
                }

                &:nth-child(3) {
                    background: url(${update_on}) no-repeat center center, rgba(32, 223, 168, .3);
                }

                &:nth-child(4) {
                    background: url(${delete_off}) no-repeat center center, rgba(204, 204, 204, .3);

                    &.disabled {
                        cursor: default;
                    }
                }
            }
        }

        .userList, .userAdd {
            height: calc(100% - 128px);
            position: relative;

            overflow-x: hidden;
            overflow-y: auto !important;
            ${(props) => props.theme.scroll()};
    
            table {
                text-align: center;
                font-size: 12px;
    
                thead {
                    height: 31px !important;
                    line-height: 31px;
                    color: ${(props) => props.theme.middleGray};
                    background-color: #1A1F23;
    
                    tr {
                        td {
                            height: 31px !important;
                            &:not(:last-child){
                                border-right: 1px dashed #525868;
                            }

                            &.userId {
                                position: relative;
                            }

                            div {
                                display: inline-block;
                                position: absolute;
                                right: 5px;
                                top: 7px;
                                cursor: pointer;
                                line-height: 0;

                                &:hover {
                                    p {
                                        display: block;
                                    }
                                }
                                
                                p {
                                    display: none;
                                    position: absolute;
                                    transform: translate(-50%, 40%);
                                    width: 347px;
                                    height: 22px;
                                    line-height: 23px;
                                    background: #000000;
                                    border-radius: 4px;
                                    font-size: 12px;
                                    color: #fff;

                                    &::before {
                                        content: '';
                                        display: block;
                                        width: 11px;
                                        height: 10px;
                                        clip-path: polygon(50% 29%, 0% 100%, 100% 100%);
                                        background-color: #000000;
                                        position: absolute;
                                        top: -9px;
                                        left: 176px;
                                    }
                                }

                            }

                        }
                    }
                    
                }
    
                tbody {
                    color: #fff;
    
                    tr {
                        height: 41px;
                        line-height: 41px;
                        border-bottom: 1px dashed #525868;

                        &:hover {
                            background-color: rgba(112, 112, 112, .1);
                        }
    
                        td {
    
                            &:not(:last-child){
                                border-right: 1px dashed #525868;
                            }
                        }
                    }

                    tr.on {
                        background: rgba(112, 112, 112, .1);
                        color: ${(props) => props.theme.mainColor};
                    }

                    tr.trDisabled {
                        color: ${(props) => props.theme.middleGray};

                        &:hover {
                            background-color: transparent;
                        }
                    }

                    tr.trNormal {
                        color: #fff;
                    }

                    input[type="text"] {
                        width: 127px;
                        height: 26px;
                        background: transparent;
                        border: 1px solid #CCCCCC;
                        color: #fff;
                        text-align: center;
                    }

                    select {
                        width: 127px;
                        height: 26px;
                        line-height: 24px;
                        border: 1px solid #CCCCCC;
                        color: #fff;
                        text-align: center;
                        cursor: pointer;
                        background:transparent url(${select_arrow}) 95% 49% no-repeat;
                    }

                    option {
                        color: #000000;
                    }
                }
            }
        }
        
        .userList + .buttonWrap {
            bottom: 24px;
            left: 0;
        }

        .userAdd {
            height: calc(100% - 37px);

            h5 {
                margin: 10px 0 23px 0;
                position: relative;
                font-size: 14px;
                cursor: pointer;

                &::before {
                    content: '';
                    display: inline-block;
                    width: 28px;
                    height: 28px;
                    background: url(${get_teamInfo_icon}) no-repeat center center;
                    margin-right: 8px;
                    position: relative;
                    top: 8px;
                    cursor: pointer;
                }
            }

            table {
                caption {
                    display: block;
                    position: absolute;
                    right: 0;
                    top: 32px;
                    line-height: 0;
                    font-size: 12px;
                    overflow: visible;
                    color: #CCCCCC;
                }

                .userId, .userLevel {
                    color: ${(props) => props.theme.mainColor};
                }

                input, select {
                    border: 0 !important;
                }
            }
        }
    }
`;


/**********************************************************************/
// 조직정보 불러오기 팝업

export const AddMemberPopupComponent = styled.div`
    width: 1215px;
    height: 431px;
    border: 1px solid #20DFA8;
    border-radius: 3px;
    background-color: ${(props) => props.theme.darkColor};

    position: absolute;
    left: 52%;
    top: 50%;
    transform: translate(-52%, -52%);
    z-index: 99;
    overflow: hidden;
    padding: 0 13px;

    .header {
        ${(props) => props.theme.flex()};
        margin-bottom: 17px;

        h5 {
            position: relative;
            top: 4px;
            font-size: 14px;
    
            &::before {
                content: '';
                display: inline-block;
                width: 28px;
                height: 28px;
                background: url(${get_teamInfo_icon}) no-repeat center center;
                margin-right: 8px;
                position: relative;
                top: 8px;
                cursor: pointer;
            }
        }
    
        .closeBtn {
            display: block;
            width: 13px;
            height: 13px;
            background: url(${close_icon}) no-repeat center center;
            z-index: 1;
            cursor: pointer;
            position: relative;
            top: 4px;
        }
    }
    
    .content {

        .searchWrap {
            ${(props) => props.theme.flex('flex-start', 'center')};
            gap: 8px;
            padding: 8px 0;
            margin-bottom: 10px;

            input {
                width: 531px;
                height: 27px;
                background: rgba(255, 255, 255, .1);
                border-radius: 4px;
                color: #fff;
                font-size: 12px;
                padding-left: 10px;
            }
        }
    }

`;


/**********************************************************************/
// 비밀번호 변경 팝업

export const AccountChangePwdComponent = styled(AccountPopupCommon)`
    width: 462px;
    height: 503px;
    
    position: absolute;
    left: 50%;
    top: 56%;
    transform: translate(-50%, -61%);
    padding: 18px 24px;
    padding-bottom: 100px;

    .header {

        div:first-child {
            ${(props) => props.theme.flex('flex-end', 'center')};

                .closeBtn {
                display: block;
                width: 12px;
                height: 12px;
                background: url(${close_icon}) no-repeat center center;
                z-index: 1;
                cursor: pointer;
            }
        }

        div:last-child {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 17px 0 35px 0;

            h5 {
                color: ${(props) => props.theme.mainColor};
                font-weight: bold;

                &::before {
                    content: '';
                    display: block;
                    width: 64px;
                    height: 64px;
                    background: url(${pwd_popup_icon});
                    margin: 0 auto 11px auto;
                }
            }
        }
        
    }

    .content {
        padding: 0 10px;

        ul {

            li {
                position: relative;
                margin-bottom: 40px;

                label {
                    position: absolute;
                    font-size: 14px;
                    margin-left: 0;
                    top: 11px;
                }

                input {
                    width: 100%;
                    background-color: transparent;
                    border-bottom: 0.5px solid ${(props) => props.theme.lightGray};
                    padding-left: 110px;
                    color: #fff;
                    font-size: 14px;
                    height: 34px;
                }
            }
        }
    }

    .buttonWrap {
        bottom: 21px;
        left: 0px;
    }
`;