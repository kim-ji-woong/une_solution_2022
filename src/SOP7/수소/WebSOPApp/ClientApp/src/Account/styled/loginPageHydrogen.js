import styled from 'styled-components';
import '../../Common/css/commonWonik.scss';

import HydrogenBackImage from '../../Common/img/imghydrogen/login_Image.png';
import HydrogenBackBlackImage from '../../Common/img/imghydrogen/login_Image_black.svg';
import HydrogenLogo from '../../Common/img/imghydrogen/KSMS_Logo.svg';
import HydrogenTextLogo from '../../Common/img/imghydrogen/K-SMS.svg';
import H_ArrowDown from '../../Common/img/imghydrogen/selectBoxArrowDrop.png';
import cancel_icon from '../../Common/img/imghydrogen/cancel_icon.svg';
import view_icon from '../../Common/img/imghydrogen/view_icon_white.svg';


/**********************************************************************/

// 로그인 페이지
export const LoginPageWrap = styled.div`
    font-family: 'Pretendard-regular';
    overflow: hidden;
    color: var(--white-color);
    font-size: 1rem;
    height: 100vh;

    .language-box{
        display: block;
        width: 100%;
        height: 50px;
        position: fixed;
        z-index: 1;
        padding: 18px 32px;

        > div{
            display: flex;
            align-items: center;
            flex-direction: row-reverse;

            .krBtn{
                display: flex;
                align-items: center;
                height: 14px;
                color: #9E9E9E;
                font-family: "Spoqa Han Sans Neo";
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 14px;
                cursor: pointer;

                &.on{
                    color: #FFF;
                    font-weight: 500;
                }
            }
            
            .krBtn::before{
                content: " ";
                display: block;
                width: 1px;
                height: 12px;
                margin-left: 12px;
                margin-right: 12px;
                background: #9E9E9E;
            }

            .engBtn{
                height: 14px;
                color: #9E9E9E;
                font-family: "Spoqa Han Sans Neo";
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 14px;
                cursor: pointer;

                &.on{
                    color: #FFF;
                    font-weight: 500;
                }
            }
        }
    }

    .company-img1 {
        width: 100%;
        height: 100vh;
        background: #000000;
        opacity: 0.7;
    }
    
    .company-img1::after {
        width: 100%;
        height: 100vh;
        content: "";
        background: url(${ HydrogenBackImage }) black 0px -99.34px / 100% 118.489% no-repeat;
        background-position: 50% 50%;
        background-size: cover;
        mix-blend-mode: difference; 
        opacity: 0.35;
        position: absolute;
        top: 0;
        left: 0;
    }

    .content-wrap {
        position : absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;

        .ksmsLogoBox{
            align-items: center;
            justify-items: center;
            margin-bottom: 10px;

            span:nth-child(1){
                display: inline-block;
                width: 31px;
                height: 31px;
                background: url(${ HydrogenLogo })no-repeat center center;
                margin-right: 9px; 
            }
            span:nth-child(2){
                display: inline-block;
                width: 93px;
                height: 28px; 
                background: url(${ HydrogenTextLogo })no-repeat center center;
            }
        }
        
        .ksmsTitleFlex{

            > p{
                color: #9E9E9E;
                font-family: "Spoqa Han Sans Neo";
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 14px;
                margin-bottom: 40px;
            }
        }

        .langageSelectBox > select{
            display: block;
            width: 92px;
            height: 30px;
            font-size: 14px;
            color: #5E6367;
            background: url(${ H_ArrowDown })no-repeat center center;
            background-position: 96% 50%;
        }
        
        form {
            div {
                display: flex;
                flex-direction: column;
                position: relative;

                &:first-child{
                    margin-bottom: 20px;
                }

                > label{
                    position: absolute;
                    left: 20px;
                    top: 12px;
                    color: #FFF;
                    font-family: "Spoqa Han Sans Neo";
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 16px; 
                }

                input {
                    width: 520px;
                    height: 68px;
                    border-radius: 4px;
                    background: rgba(0, 0, 0, 0.50);
                    padding-top: 24px;
                    padding-left: 20px;
                    padding-right: 48px;
                    color: var(--light-gray-color);
                    border: none;
                    font-size: 16px;

                    &:focus{
                        border: solid 1px #0085FF !important;
                    }
                }

                input:nth-child(2){
                    width: 520px;
                    height: 68px;
                    border-radius: 4px;
                    background: rgba(0, 0, 0, 0.50);
                    padding-top: 24px;
                    padding-left: 20px;
                    padding-right: 80px;
                    color: var(--light-gray-color);
                    border: none;
                    font-size: 16px;

                    &:focus{
                        border: solid 1px #0085FF !important;
                    }
                }
                
                /* input:focus {
                    border: solid 1px #0085FF;
                } */

                input:-webkit-autofill,
                input:-webkit-autofill:hover,
                input:-webkit-autofill:focus,
                input:-webkit-autofill:active {
                    -webkit-text-fill-color: var(--light-gray-color);
                    -webkit-box-shadow: 0 0 0px 1000px transparent inset;
                    box-shadow: 0 0 0px 1000px transparent inset;
                    transition: background-color 5000s ease-in-out 0s;
                }
                
                input:autofill,
                input:autofill:hover,
                input:autofill:focus,
                input:autofill:active {
                    -webkit-text-fill-color: var(--light-gray-color);
                    -webkit-box-shadow: 0 0 0px 1000px transparent inset;
                    box-shadow: 0 0 0px 1000px transparent inset;
                    transition: background-color 5000s ease-in-out 0s;
                }

                input:-webkit-autofill::first-line {
                    font-size: 16px;
                }

                .input-close-icon{
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    background: url(${ cancel_icon })no-repeat center center;
                    position: absolute;
                    right: 20px;
                    bottom: 12px;
                    cursor: pointer;
                }
                
                .input-closePW-icon{
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    background: url(${ cancel_icon })no-repeat center center;
                    position: absolute;
                    top: 36px;
                    right: 20px;
                    cursor: pointer;
                }
                
                .input-preView-icon{
                    display: none;
                    display: inline-block;
                    width: 20px;
                    height: 20px; 
                    /* background: url(${ view_icon })no-repeat center center; */
                    position: absolute;
                    top: 36px;
                    right: 52px;
                    cursor: pointer;

                    &.on{
                        display: block;
                    }
                }

                img {
                    display: inline-block;
                    width: 20px;
                    height: 20px; 
                    position: absolute;
                    top: 36px;
                    right: 52px;
                    cursor: pointer;
                    content: "";
                }
            }
            
            .loginButton {
                width: 520px;
                height: 48px;
                color: #FFF;
                background: #0085FF;
                border-radius: 4px;
                opacity: 1;
                margin-top: 54px;
                font-size: 16px;
                font-weight: 500;
                position: relative;
            }
        }
        
        .error-msg {
            color: var(--pink-color);
            position: absolute;
            left: 0;

            p {
                color: #FF3632;
                font-family: "Spoqa Han Sans Neo";
                font-size: 12px;
                font-weight: 400;
                line-height: 12px;
                text-align: left;
                margin-top: 30px;
                margin-bottom: 12px;
            }
        }
        
        .error-msgBox {
            border: solid 1px var(--pink-color) !important;
        }
    }
    
    /*
    > footer {
        height: 80px;
        position: absolute;
        bottom: 0px;
        
        p {
            font-weight: 300;
            color : var(--white-color);
            opacity: 0.3;
            font-weight: lighter;
            letter-spacing: 0.5px;
        }
    } */
`;