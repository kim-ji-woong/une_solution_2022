import styled, { keyframes } from "styled-components";

import save_icon from '../images/save_icon.png';
import success_icon from '../images/success_icon.png';
import remove_icon from '../images/remove_icon.png';
import error_icon from '../images/error_icon.png';


/**********************************************************************/

const modalShow = keyframes`
    from {
        opacity: 0;
        margin-top: -50px;
    }

    to {
        opacity: 1;
        margin-top: 0;
    }
`

const modalBgShow = keyframes`
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
`

export const ConfirmDialogComponent = styled.div`
    & {
        display: none;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 9999;
    }

    & button {
        outline: none;
        cursor: pointer;
        border: 0;
        margin-left: 5px;
    }

    & > section {
        width: 100%;
        max-width: 450px;
        margin: 0 auto;
        border-radius: 6px;
        background-color: #fff;
        /* 팝업이 열릴때 스르륵 열리는 효과 */
        animation: ${modalShow} 0.3s;
        overflow: hidden;
        border: 1px solid #D6D6D6;
    }

    & > section > header {
        position: relative;
        font-weight: 700;
        margin-bottom: 30px;
    }

    & > section > header button {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 20px;
        font-size: 20px;
        font-weight: 400;
        text-align: center;
        color: black;
        background-color: transparent;
    }

    & > section > main {
        padding: 20px 40px;
        ${(props) => props.theme.flex('flex-start', 'center')};

        &::before {
            content: '';
            display: inline-block;
            width: 48px;
            height: 48px;
            margin-right: 23px;
            background: url(${save_icon}) no-repeat center center;


            background: ${(props) => {
                if(props.type === 'save')
                    return `url(${save_icon}) no-repeat center center;`
                else if(props.type === 'success')
                    return `url(${success_icon}) no-repeat center center;`
                else if(props.type === 'remove')
                    return `url(${remove_icon}) no-repeat center center;`
                else if(props.type === 'error')
                    return `url(${error_icon}) no-repeat center center;`
                else
                    return `url(${success_icon}) no-repeat center center;`
            }};
        }
    }

    & > section > main > div {
        width: 300px;
    }

    & > section > main > div > p {
        line-height: 20px;
        font-size: 14px;
        font-weight: bold;
        color: #4E4E4E;

        &:last-child {
            font-size: 16px;
            color: #000000;
        }
    }

    & > section > footer {
        height: 45px;
        padding: 11px 18px;
        text-align: right;
        background-color: #EBEBEB;
    }

    & > section > footer button {
        min-width: 57px;
        height: 23px;
        color: #FFFFFF;
        background-color: ${(props) => props.theme.darkColor};
        border-radius: 5px;
        font-size: 12px;
        opacity: 1;
        text-shadow: none;
        padding: 0 5px;

        &:last-child {
            background: ${(props) => {
                if(props.type === 'error' || props.type === 'remove')
                    return `#FF5151;`
                else
                    return `#20DFA8`;
            }};

            color: ${(props) => {
                if(props.type === 'error' || props.type === 'remove')
                    return `#fff;`
                else
                    return `#121317;`
            }};
        }
    }

    &.openModal {
        display: flex;
        align-items: center;
        /* 팝업이 열릴때 스르륵 열리는 효과 */
        animation: ${modalBgShow} 0.3s;
        color: black;
        font-size: 16px;
    }
`;