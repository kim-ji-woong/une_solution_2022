import styled from 'styled-components';

import tap_element from '../images/tap_element.png';
import id_icon from '../images/id_icon.png';
import pwd_icon from '../images/pwd_icon.png';
import find_pwd_icon from '../images/find_pwd_icon.png';
import phone_icon from '../images/phone_icon.png';


/**********************************************************************/

export const AccountCommon = styled.div`
    background-color: ${(props) => props.theme.backgroundColor};
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    color: #fff;

    > div {
        position: fixed;
        top: 0;
        left: 0;
        width: 677px;
        height: 100%;

        img {
            height: 100vh;
        }
    }

    .slick-prev::before,
    .slick-next::before {
        opacity: 0;
        display: none;
    }

    .slick-slider {
        height: 100%;
    }

    .slick-dots {
        position: absolute;
        right: 17px;
        bottom: 23px;
        display: block;
        width: 90px;
        padding: 0;
        margin: 0;
        list-style: none;

        li {
            position: relative;
            left: 0px;
            bottom: 4px;
            display: inline-block;
            padding: 0;
            cursor: pointer;

            button {
                font-size: 0;
                line-height: 0;
                display: block;
                padding: 5px;
                cursor: pointer;
                color: transparent;
                border: 0;
                outline: none;
                background: transparent;

                &:before {
                    position: absolute;
                    top: 0;
                    left: 0;
                    content: '';
                    width: 11px;
                    height: 11px;
                    background-color: #CCCCCC;
                    opacity: 1;
                    border-radius: 10px;
                }
            }
        }

        li.slick-active {
            button:before {
                opacity: 1;
                background-color: ${(props) => props.theme.mainColor};
            }
        }
    }

    nav {
        position: absolute;
        top: 250px;
        left: 524px;
            
        ul {
            li {
                width: 153px;
                height: 64px;
                text-align: right;
                line-height: 64px;
                position: relative;
                opacity: 0.6;
                cursor: pointer;

                span {
                    position: relative;
                    right: 22px;
                }
    
                &:first-child {
                    padding-right: 43px;
                }
    
                &:nth-child(2) {
                    padding-right: 19px;
                }
                
                &.on {
                    border-radius: 32px 0 0 32px;
                    opacity: 1;
                    color: ${(props) => props.theme.mainColor};
                    font-weight: bold;
                    transition: all 0.3s;
                }
            }
        }
    }

    footer {
        position: absolute;
        width: 677px;
        bottom: 64px;
        left: 0;
        text-align: right;

        p {
            opacity: 0.8;
            margin-bottom: 9px;
        }

        p:first-child {
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 23px;
            opacity: 1;
            position: relative;
            margin-right: 28px;
        }

        p:not(:first-child) {
            margin-right: 28px;
        }
    }

    .errorMsg {
        position: absolute;
        width: 433px;
        text-align: center;
        margin-top: 34px;
        color: ${(props) => props.theme.warningColor};
        word-break:break-all;
        line-height: 20px;
    }
`;


/**********************************************************************/
// 로그인 페이지

export const LoginPageComponent = styled(AccountCommon)`
    .hori-selector{
        background-color: #293239;
        border-radius: 32px 0 0 32px;
        opacity: 1;
        color: #20DFA8;
        font-weight: bold;
        position: absolute;
        transition-duration:0.6s;
	    transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);

        &::after {
            content: '';
            display: block;
            width: 50.02px;
            height: 104.08px;
            background-image: url(${tap_element});
            position: absolute;
            top: -19px;
            right: -32px;
        }
    }

    .loginWrap {
        width: 433px;
        position: absolute;
        top: 49%;
        left: 50%;
        transform: translate(30%, -50%);
        display: flex;
        flex-direction: column;

        .mainLogo {
            width: 100%;
            text-align: center;
            margin-bottom: 50px;

            img {
                width: 293px;
                height: 32px;
                object-fit: none;
            }
        }

        form {
            position: relative;

            div:nth-child(1):before { 
                content: '';
                background: url(${id_icon}) no-repeat;
                position: absolute; 
                left: 0;
                top: 33px;
                width: 27px; 
                height:27px;
            }

            div:nth-child(2):before { 
                content: '';
                background:url(${pwd_icon}) no-repeat; 
                position: absolute; 
                left: 3px;
                top: 103px;
                width: 21px;
                height: 27px;
            }

            input {
                width: 100%;
                height: 50px;
                border-bottom: 1px solid ${(props) => props.theme.lightGray};
                background-color: transparent !important;
                margin-top: 20px;
                padding-left:43px;
                color: ${(props) => props.theme.lightGray};
                font-size: 14px;
            }

            input:focus {
                border-bottom: 1px solid ${(props) => props.theme.lightGray};
            }

            button {
                width: 100%;
                height: 46px;
                color : ${(props) => props.theme.backgroundColor};
                background: ${(props) => props.theme.mainColor};
                border-radius: 5px;
                opacity: 1;
                margin-top: 61.5px;
                font-size: 18px;
                font-weight: bold;
            }
        }
    }

    .findPwdWrap {
        width: 433px;
        position: absolute;
        top: 46%;
        left: 50%;
        transform: translate(30%, -50%);
        display: flex;
        flex-direction: column;

        h1 {
            font-size: 25px;
            font-weight: bold;
            margin: 0 auto 20px auto;

            &::before {
                content: '';
                display: block;
                background: url(${find_pwd_icon}) no-repeat;
                width: 35px;
                height: 46px;
                margin: 0 auto 16.5px auto;
            }
        }

        & > p {
            font-size: 14px;
            opacity: 0.6;
            margin: 0 auto 12px auto;
        }

        form {
            position: relative;

            div:nth-child(1):before { 
                content: '';
                background: url(${id_icon}) no-repeat;
                position: absolute; 
                left: 5px;
                top: 33px;
                width: 27px; 
                height:27px;
            }

            div:nth-child(2):before { 
                content: '';
                background:url(${phone_icon}) no-repeat; 
                position: absolute; 
                left: 11px;
                top: 102px;
                width: 16px;
                height: 27px;
            }

            input {
                width: 100%;
                height: 50px;
                border-bottom: 1px solid ${(props) => props.theme.lightGray};
                background-color: transparent !important;
                margin-top: 20px;
                padding-left:43px;
                color: ${(props) => props.theme.lightGray};
                font-size: 14px;
            }

            input:focus {
                border-bottom: 1px solid ${(props) => props.theme.lightGray};
            }

            button {
                width: 100%;
                height: 46px;
                color : ${(props) => props.theme.backgroundColor};
                background: ${(props) => props.theme.mainColor};
                border-radius: 5px;
                opacity: 1;
                margin-top: 60px;
                font-size: 18px;
                font-weight: bold;
            }
        }
        
        .confirmMsg {
            position: absolute;
            width: 433px;
            text-align: center;
            margin-top: 34px;
            color: ${(props) => props.theme.mainColor};
            word-break:break-all;
            line-height: 20px;
        }
    }
`;
