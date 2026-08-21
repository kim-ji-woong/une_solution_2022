
import styled from 'styled-components';
import login_back from '../images/login_back.png';


/**********************************************************************/
// 로그인 페이지

export const LoginPageComponent = styled.div`
    background-color: ${(props) => props.theme.background};
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    .right {
        position: absolute;
        top: 0;
        right: 0;
        width: 950px;
        height: 100vh;
        background: url(${login_back}) no-repeat center center;
        ${(props) => props.theme.flex('center', 'center')};
        flex-direction: column;

        div {
            text-align: center;

            &:nth-child(2) {
                margin: 40px 0 20px 0;

                p {
                    font-size: 36px;
                    font-weight: 700;

                    &:first-child {
                        margin-bottom: 12px;
                    }
                }
            }

            &:nth-child(3) p:first-child {
                margin-bottom: 8px;
            }
        }
    }

    .left {
        position: absolute;
        top: 0;
        left: 0;
        width: calc(100vw - 950px);
        height: 100vh;
        ${(props) => props.theme.flex('center', 'center')};
        flex-direction: column;
        
        .sectionWrap {
            width: 520px;

            .titleWrap {
                margin-bottom: 60px;

                h2 {
                    color: ${(props) => props.theme.primary};
                    font-size: 28px;
                    font-weight: 700;
                    margin-bottom: 15px;
                }

                p {
                    color: ${(props) => props.theme.fontSecondary};
                    font-size: 14px;
                }
            }

            .inputWrap {
                margin-bottom: 20px;
                position: relative;

                > div {
                    ${(props) => props.theme.flex()};
                    margin-bottom: 15px;

                    > label:nth-child(1) span {
                        color: ${(props) => props.theme.warning};
                        margin-left: 3px;
                    }

                    > label:nth-child(2) input {
                        margin-right: 10px;
                        position: relative;
                        top: -1px;
                    }
                }

                input[type=text], input[type=password] {
                    height: 48px;
                    border: 1px solid ${(props) => props.theme.secondary};
                    border-radius: 0;
                    padding: 15px 55px 15px 20px;
                }

                .error {
                    border: 1px solid ${(props) => props.theme.error};
                }

                .showPwdBtn {
                    position: absolute;
                    right: 20px;
                    top: 45px;
                }
            }

            .errorMsg{
                height: 31px;

                p {
                    font-size: 12px;
                    color: ${(props) => props.theme.error};
                    margin-bottom: auto 0;
                }
            } 

            .submitBtn {
                width: 100%;
                height: 48px;
                background-color: ${(props) => props.theme.primary};
                text-align: center;
                color: ${(props) => props.theme.fontPrimary};
                font-weight: 500;
            }
            
        }

        .sectionBtn{
            margin-top: 40px;
            font-size: 14px;
        }

        > p {
            font-size: 12px;
            font-weight: 300;
            color: #616161;
            position: absolute;
            bottom: 36px;
        }
    }

`