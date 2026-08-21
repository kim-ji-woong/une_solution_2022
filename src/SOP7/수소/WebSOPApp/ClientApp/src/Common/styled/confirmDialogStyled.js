import styled, { keyframes } from "styled-components";
import PR from "../../Root/resource/id";

import "../../Common/css/commonWonik.scss";


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

export const _ConfirmDialogComponent = {
    Hydrogen: {
        sectionBorder: '1px solid #FFFFFF1A',
        sectionFontSize: '16px',
        sectionBackground: 'rgba(14, 22, 45, .8)',
        headerBackground: 'rgba(255, 255, 255, .1)',
        headerPadding: '11px 64px 10px 20px',
        fontColor: 'var(--white-color)',
        titleColor: 'var(--title-bar-text-blue-color)',
        sectionMainPadding: '20px',
        sectionMainBorderBottom: '1px solid var(--dark-gray-color)',
        footerButtonBackground: 'var(--navy-color)',
        footerFontSize: '14px',
        footerPadding: '20px',
        footerButtonLastBackground: `transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box`,
        headerXFontSize: '26px',
        headerXColor: '#fff',
        headerXTop: '2px',
        headerXRight: '11px',
        headerXFontWeight: '500',
        buttonMargin: '10px',
    },
}

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
        margin-left: 10px;
    }

    & > section {
        width: 90%;
        max-width: 450px;
        margin: 0 auto;
        border-radius: 10px;
        background-color: 'rgba(14, 22, 45, .8)';
        /* 팝업이 열릴때 스르륵 열리는 효과 */
        animation: ${modalShow} 0.3s;
        overflow: hidden;
        border: 1px solid #FFFFFF1A;
    }

    & > section > header {
        position: relative;
        padding: 11px 64px 10px 20px;
        background-color: rgba(255, 255, 255, .1);
        font-weight: 700;
        color: var(--title-bar-text-blue-color);
    }

    & > section > header button {
        position: absolute;
        top: 2px;
        right: 11px;
        width: 30px;
        font-size: 26px;
        font-weight: 500;
        text-align: center;
        color: #fff;
        background-color: transparent;
    }

    & > section > main {
        padding: 20px;
        border-bottom: 1px solid var(--dark-gray-color);
    }

    & > section > main > p {
        line-height: 20px;
    }

    & > section > main > div {
        margin-top: 12px;
        display: flex;
        
        input[type="text"] {
            width: 86%;
            height: 28px;
            padding-left: 10px;
            margin-left: 10px;
            background: none;
            color: #fff;
            font-size: 14px;
            border: solid 1px var(--white-color);
            border-radius: 5px;
        }
    }

    & > section > footer {
        padding: 20px;
        text-align: right;
    }

    & > section > footer button {
        padding: 6px 12px;
        color: #fff;
        background-color: 'var(--navy-color)';
        border-radius: 5px;
        font-size: 14px;

        &:last-child {
            background: transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;
        }
    }

    &.openModal {
        display: flex;
        align-items: center;
        /* 팝업이 열릴때 스르륵 열리는 효과 */
        animation: ${modalBgShow} 0.3s;
        color: var(--white-color);
        font-size: 16px;
    }
`;