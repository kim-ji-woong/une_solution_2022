import styled from 'styled-components';
import ProjectResource from '../resource/id';

import user_icon from '../images/user_icon.png';
import nav_icon from '../images/nav_icon.png';
import setting_icon from '../images/setting_icon.png';

import person_icon from '../images/person_icon.png';
import lock_icon from '../images/lock_icon.png';
import logout_icon from '../images/out_icon.png';
import person_icon_on from '../images/person_icon_on.png';
import lock_icon_on from '../images/lock_icon_on.png';
import logout_icon_on from '../images/out_icon_on.png';


/**********************************************************************/

export const TitleBarComponent = styled.div`
    position: fixed;
    z-index: 3;
    background-color: ${(props) => props.theme.darkGray};
    width: 100vw;
    height: 50px;
    padding: 12px 20px;
    line-height: 26px;

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-use-select: none;
    user-select: none;

    &::before {
        content: '';
        display: ${(props) => props.$path === ProjectResource.path.sdms || props.$path === ProjectResource.path.monitoring ? 'none' : 'block'};
        width: 100%;
        height: 3px;
        background: transparent linear-gradient(270deg, #FFFFFF12 0%, #20DFA8 100%) 0% 0% no-repeat padding-box;
        opacity: 0.65;
        position: absolute;
        top: 50px;
        left: 0;
    }

    .titleWrap {
        ${props => props.theme.flex('flex-start', 'center')};
        height: 26px;
    }

    .logo {
        width: 155px;
        height: 17px;
        margin-left: 19px;
        cursor: pointer;
    }

    span {
        font-size: 18px;
        font-weight: bold;
        padding-left: 18px;
        margin-left: 18px;
        margin-right: 12px;
        border-left: 1px dashed #525868;
        cursor: default;
    }

    .homeBtn {
        width: 26px;
        height: 26px;
        cursor: pointer;
    }

    .menuWrap {
        position: absolute;
        top: 0;
        right: 20px;
        height: 50px;
        ${props => props.theme.flex('flex-end', 'center')};
        gap: 37.5px;
        
        > div > button {
            text-indent: -9999px;
        }

        .userMenu {
            > button {
                width: 21px;
                height: 21px;
                background: url(${user_icon}) no-repeat;
                position: relative;

                &::before {
                    content: '';
                    display: block;
                    width: 5px;
                    height: 5px;
                    background-color: ${(props) => props.theme.mainColor};
                    border-radius: 5px;
                    position: absolute;
                    top: -3px;
                    right: -3px;
                }
            }
            
            div {
                display: none;
                overflow: hidden;

                &.on {
                    display: flex;
                }

                position: absolute;
                top: 55px;
                left: ${(props) => props.$position === 'right' ? '-90px' : '-48px'};
                width: 118px;
                height: 113px;
                background: rgba(37, 46, 52, .9);
                border-radius: 3px;
                text-align: center;
                justify-content: space-between;
                align-items: center;
                flex-direction: column;

                span {
                    font-size: 12px;
                    color: ${(props) => props.theme.mainColor};
                    margin-top: 16px;
                    font-weight: normal;
                    border: 0;
                    padding: 0;
                }

                p {
                    font-size: 14px;
                    margin-bottom: 10px;
                }

                ul {
                    ${(props) => props.theme.flex('space-around', 'center')};
                    width: 100%;
                    padding-bottom: 4px;
                    height: 30px;
                    background-color: #1A1F23;
                    border-radius: 0 0 3px 3px;

                    li {
                        cursor: pointer;

                        &:nth-child(1) button {
                            background: url(${person_icon}) no-repeat center center;
                            width: 16px;
                            height: 17px;

                            &:hover {
                                background: url(${person_icon_on}) no-repeat center center;
                            }
                        }

                        &:nth-child(2) button {
                            background: url(${lock_icon}) no-repeat center center;
                            width: 16px;
                            height: 17px;

                            &:hover {
                                background: url(${lock_icon_on}) no-repeat center center;
                            }
                        }

                        &:nth-child(3) button {
                            background: url(${logout_icon}) no-repeat center center;
                            width: 16px;
                            height: 17px;

                            &:hover {
                                background: url(${logout_icon_on}) no-repeat center center;
                            }
                        }
                    }
                }
            }
        }

        .navMenu {
            > button {
                width: 20px;
                height: 20px;
                background: url(${nav_icon}) no-repeat;
            }

            div {
                display: none;
                overflow: hidden;
                position: absolute;
                top: 55px;
                left: 21px;
                width: 100px;
                background: #273036;
                border-radius: 4px;
                border: 1px solid ${(props) => props.theme.mainColor};

                &.on {
                    display: block;
                }

                ul {

                    li {
                        font-size: 11px;
                        font-weight: 500;
                        text-align: center;
                        width: 100%;
                        height: 30px;
                        line-height: 30px;
                        cursor: pointer;

                        &:hover {
                            color: ${(props) => props.theme.mainColor};
                        }
                    }
                }
            }
        }

        .settingMunu button {
            width: 20px;
            height: 20px;
            background: url(${setting_icon}) no-repeat;
        }
    }

    .modeName {
        width: 96px;
        height: 28px;
        border: 1px solid #707070;
        border-radius: 15px;
        font-size: 13px;
        font-weight: bold;
        text-align: center;
        position: absolute;
        top: 0;
        right: 190px;
        margin: 11px 0;
        cursor: default;
    }
    
`;