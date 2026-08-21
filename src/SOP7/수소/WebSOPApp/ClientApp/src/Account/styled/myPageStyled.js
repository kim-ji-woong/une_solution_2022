import styled from 'styled-components';

import myPage_background from '../../Common/img/imghydrogen/main/myPage_background.svg';
import myPage_background_hydrogen from '../../Common/img/imghydrogen/main/myPage_background2.svg';
import changePwdIcon from '../../Common/img/imghydrogen/main/changePassword_icon.svg';
import passwordView from '../../Common/img/imghydrogen/main/passwordView_icon.svg';
import passwordView_close from '../../Common/img/imghydrogen/main/passwordView_close_icon.svg';

import password_requirement from '../../Common/img/imghydrogen/main/password_requirement_icon.svg';
import password_notClear from '../../Common/img/imghydrogen/main/password_notClear_icon.svg';
import password_clear from '../../Common/img/imghydrogen/main/password_clear_icon.svg';

/**********************************************************************/

export const MyPageComponent = styled.div`
    width: 550px;
    height: 600px;
    background: #1E1E1E;
    border-radius: 8px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    padding: 40px;
    display: flex;
    align-items: center;
    flex-direction: column;
    user-select: none;

    &::before{
        content: '';
        display: inline-block;
        width: 550px;
        height: 600px;
        background: url(${myPage_background})no-repeat center center;
        border-radius: 8px;
        opacity: 0.2;
        position: absolute;
        left: 0;
        top: 0;
    }

    &::after{
        content: '';
        display: inline-block;
        width: 550px;
        height: 600px;
        background: url(${myPage_background_hydrogen})no-repeat top center;
        border-radius: 8px;
        mix-blend-mode: overlay;
        position: absolute;
        left: 0;
        top: 0;
    }

    & * {
        font-size: 14px;
    }

    .closeBtn {
        position: absolute;
        top: 40px;
        right: 40px;
        z-index: 2;
    }

    header {
        width: calc(100% - 16px);
        display: flex;
        align-items: center;
        z-index: 1;

        &::after {
            content: '';
            display: inline-block;
            width: 150px;
            height: 117px;
        }

        > div {
            display: flex;
            flex-direction: column;
            gap: 15px;

            h2 {
                font-size: 16px;
                font-weight: 700;
                font-family: "Spoqa Han Sans Neo";
                color: #B6C6D2;
            }
    
            div {
                span {
                    display: flex;
                    font-size: 20px;
                    font-weight: 700;
                    font-family: "Spoqa Han Sans Neo";
                    color: #fff;
                    
                    > p{
                        color: #0085FF;
                        font-family: "Spoqa Han Sans Neo";
                        font-size: 20px;
                        font-weight: 700;
                        line-height: 20px;
                        margin: 0px 6px;
                    }
                }
            }
        }
    }

    section {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 1;
        
        ul {
            width: 100%;
            margin-bottom: 44px;

            li {
                display: flex;
                align-items: center;
                height: 40px;
                line-height: 39px;
                
                span {
                    padding-left: 12px;
                    
                    &:nth-child(1) {
                        flex: 1.2;
                        background-color: #323335;
                        font-weight: 400;
                        border-bottom: 1px solid #1E1E1E;
                        color: #fff;
                    }

                    &:nth-child(2) {
                        flex: 2;
                        background-color: #282829;
                        font-weight: 400;
                        border-bottom: 1px solid #1E1E1E;
                        color: #fff;
                    }
                }
            }
        }

        > button {
            display: block;
            border-radius: 6px;
            background: #0085FF url(${changePwdIcon}) no-repeat 10% center;
            padding: 0px 16px 0px 40px;
            /* width: 137px; */ 
            height: 36px;
            color: #000;
            font-family: "Spoqa Han Sans Neo";
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            line-height: 172%; 
            letter-spacing: -0.42px;
        }
    }
`;

export const ChangePwdComponent = styled(MyPageComponent)`

    header {
        &::after {
        }

        > div > div > span > p{
            color: #0085FF;
        }
    }

    section {
        height: 100%;
        margin-top: 23px;

        ul {
            
            li {
                input {
                    width: 90%;
                    height: 23px;
                    padding: 3px;
                    font-size: 14px;
                    background: #282829;
                    color: #fff;
                    border: 0;
                    position: relative;
                    top: -1px;
                }

                span {
                    &:nth-child(1){
                        display: flex;
                        align-items: center;
                        height: 40px;
                        line-height: 39px;
                        color: #FFF;
                        font-family: "Spoqa Han Sans Neo";
                        font-size: 14px;
                        font-weight: 500;
                    }

                    &:nth-child(2) {
                        display: flex;
                        align-items: center;
                        height: 40px;
                        line-height: 39px;
                        padding-right: 12px;
                        background: #282829;
                        color: var(--grayscale-g-300888-c-94, #888C94);
                        font-family: "Spoqa Han Sans Neo";
                        font-weight: 500;       
                    }

                    img{
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                    }

                    .passwordView_img{
                        margin-right: 8px;
                    }
                }
            }
        }
        
        .infoWrap {
            width: 100%;
            padding: 15px 12px;
            display: flex;
            flex-direction: column;
            margin-bottom: 10px;

            .passwordTitle {
                /* color: var(--grayscale-g-300888-c-94, #888C94);
                font-family: "Spoqa Han Sans Neo";
                font-size: 12px;
                font-weight: 400; */

                color: var(--grayscale-g-300888-c-94, #888C94);
                font-family: "Spoqa Han Sans Neo";
                font-size: 14px;
                font-weight: 500;
                margin-bottom: 20px;
            }

            div{
                display: flex;
                margin-bottom: 0px;

                img{
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    margin-top: 1px;
                    margin-right: 8px;
                }

                .checkIcon{
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    background: url(${password_requirement})no-repeat center center;
                    margin-top: 1px;

                    &.on{
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        background: url(${password_notClear})no-repeat center center;
                        margin-top: 1px;
                    }
                }

                .checkLengthIcon{
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    background: url(${password_requirement})no-repeat center center;
                    margin-top: 1px;

                    &.on{
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        background: url(${password_notClear})no-repeat center center;
                        margin-top: 1px;
                    }
                }

                .notClearIcon{
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    background: url(${password_notClear})no-repeat center center;
                    margin-top: 1px;
                }

                .checkClearIcon{
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    background: url(${password_clear})no-repeat center center;
                    margin-top: 1px;
                }

                .requirements_1{
                    color: var(--grayscale-g-300888-c-94, #888C94);
                    font-family: "Spoqa Han Sans Neo";
                    font-size: 12px;
                    font-weight: 400;
                    padding-right: 46px;
                    padding-left: 12px;
                    margin-bottom: 13px;
                    line-height: normal;
                }

                .requirements_2{
                    color: var(--grayscale-g-300888-c-94, #888C94);
                    font-family: "Spoqa Han Sans Neo";
                    font-size: 12px;
                    font-weight: 400;
                    padding-right: 46px;
                    padding-left: 8px;
                    line-height: normal;
                }
            }
        }

        .btnWrap {
            margin-top: 100px;
        }
    }

    .btnWrap {
        display: flex;
        position: absolute;
        bottom: 23px;
        left: 50%;
        transform: translate(-50%, -50%);

        button {
            display: inline-block;
            width: 74px;
            height: 36px;
            padding: 0px 16px;
            border-radius: 6px;
        }

        .cancle {
            border: 1px solid var(--grayscale-g-300888-c-94, #888C94);
            margin-right: 8px; 
            color: #888C94;
        }

        .submit {
            background-color: ${(props) => props.theme.primary};
            border: 1px solid var(--grayscale-g-800313644, #313644);
            color: #313644;
            cursor: default;

            &.on{
                border: 1px solid var(--grayscale-g-300888-c-94, #888C94);
                color: #888C94;
            }
        }

        .submitOn{
            background-color: ${(props) => props.theme.primary};
            border: 1px solid var(--grayscale-g-300888-c-94, #888C94);
            color: #888C94;
            cursor: pointer;
        }
    }
`;