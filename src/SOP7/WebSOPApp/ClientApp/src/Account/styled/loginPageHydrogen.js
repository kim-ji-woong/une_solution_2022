import styled from 'styled-components';
import '../../Common/css/commonWonik.scss';

import login_img1 from '../../Common/img/imgwonik/login_img1.png';
import login_img2 from '../../Common/img/imgwonik/login_img2.jpg';
import login_img3 from '../../Common/img/imgwonik/login_img3.jpg';
import idIcon from '../../Common/img/imgwonik/login_id_icon.png';
import pwdIcon from '../../Common/img/imgwonik/login_pwd_icon.png';
import errorIcon from '../../Common/img/imgwonik/login_error_icon.png';
import mailIcon from '../../Common/img/imgwonik/login_mail_icon.png';


import HydrogenBackImage from '../../Common/img/imghydrogen/H_loginpageImage.png';
import HydrogenLogo from '../../Common/image/common/logo_ksms2.png';
import H_ArrowDown from '../../Common/img/imghydrogen/selectBoxArrowDrop.png';


/**********************************************************************/

// 로그인 페이지
export const LoginPageWrap = styled.div`
    font-family: 'Pretendard-regular';
    overflow: hidden;
    color: var(--white-color);
    font-size: 1rem;
    height: 100vh;


    .company-img1 {
        width: 100%;
        height: 100vh;
        background: url(${ HydrogenBackImage })no-repeat center center;
        background-position: 50% 50%;
        background-size: cover;
    }

    /* .header-wrap {
        top: 50%;
        left: 0;
        transform: translate(0%, -240%);
        margin-left: 10rem;
        display: flex;
    }

    .idFindBox{
        display: inline-block;
        width: 131px;
        height: 50px;
        line-height: 50px;
        border-radius: 5px;
        background: #00AFFF;
        color: #fff;
        cursor: pointer;
 
    }
    .passwordFindBox{
        display: inline-block;
        width: 131px;
        height: 50px;
        line-height: 50px;
        border-radius: 5px;
        background: #FFF;
        color: #474747;
        cursor: pointer;
    } */

   .content-wrap {
        position : relative;
        float: left;
        /* margin-right: 10rem; */
        margin-left: 10rem;
        top: 50%;
        left: 0;
        transform: translate(0%, -240%);
        display: flex;
        flex-direction: column;
    }

        .ksmsLogo{
            display: inline-block;
            width: 126px;
            height: 48px;
            background: url(${ HydrogenLogo })no-repeat center center;
            background-size: cover;
        }
        .ksmsTitleFlex{
            display: flex;
            align-items: flex-end;
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

        p {
            font-size: 16px;
            font-weight: 400;
            /* margin-bottom: 11px; */
            color: #474747;
            margin-right: 108px;
        }

        form {
            margin-top: 60px;

            div > label{
                display: block;
                color: #474747;
                font-size: 16px;
            }

            div {
                display: flex;
                flex-direction: column;
                margin-top: 0px;
            }

            div:nth-child(1):before { 
                content: url(${idIcon});
                position:relative; 
                left: 20px;
                top: 66px;
                width:18px; 
                height:20px;
            }

            div:nth-child(2):before { 
                content:url(${pwdIcon}); 
                position:relative; 
                left: 20px;
                top: 68px;
                width: 18px; 
                height: 24px;
            }

            input {
                width: 500px;
                height: 60px;
                border: 1px solid var(--light-gray-color);
                /* border-radius: 10px; */
                background-color: transparent;
                margin-top: 10px;
                padding-left:57px;
                color: var(--light-gray-color);
                font-size: 16px;
            }

            input:focus {
                /* border: 1px solid var(--blue-color); */
                border: solid 2px #00B0FF;
            }

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

            label:nth-child(3) {
                margin-top: 60px;
            }

            button {
                width: 500px;
                height: 60px;
                color : var(--white-color);
                background: #19A5FF;
                opacity: 1;
                margin-top: 90px;
                font-size: 1rem;
                position: relative;
            }
        }

        .error-msg {
            color: var(--pink-color);
            position: absolute;
            left: 0;

            p:before {
                content: url(${errorIcon}); 
                vertical-align: middle;
                margin-right: 8px;
                width: 18px;
                height: 18px;
            }

            p {
                font-size: 0.8rem;
                font-weight: normal;
                width: 520px;
                color: #FF3636;
                margin-top: 10px;
            }
        }

        .error-msgBox {
            border: solid 1px var(--pink-color);
        }
    }

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
    }

`;