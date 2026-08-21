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
    soulbrain: {
        sectionBackground: '#fff',
        headerBackground: '#f1f1f1',
        headerPadding: '16px 64px 16px 16px',
        fontColor: '#000000',
        sectionMainPadding: '16px',
        sectionMainBorderBottom: '1px solid #dee2e6',
        sectionMainBorderTop: '1px solid #dee2e6',
        footerButtonBackground: '#6c757d',
        footerFontSize: '13px',
        footerPadding: '12px 16px',
        headerXFontSize: '21px',
        headerXColor: '#999',
        headerXTop: '15px',
        headerXRight: '15px',
        headerXFontWeight: '700',
        buttonMargin: '5px',
    },
    Wonik: {
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
    Gyeonggi: {
        sectionBorder: '1px solid #FFFFFF1A',
        sectionFontSize: '16px',
        sectionBackground: 'rgba(14, 22, 45, 1)',
        headerBackground: 'rgba(255, 255, 255, .1)',
        headerPadding: '11px 64px 10px 20px',
        fontColor: 'var(--white-color)',
        titleColor: 'var(--title-bar-text-blue-color)',
        sectionMainPadding: '20px',
        sectionMainBorderBottom: '1px solid var(--dark-gray-color)',
        footerButtonBackground: 'var(--navy-color)',
        footerFontSize: '14px',
        footerPadding: '20px',
        footerBorder: '1px solid #FFFFFF1A',
        headerXFontSize: '26px',
        headerXColor: '#fff',
        headerXTop: '2px',
        headerXRight: '11px',
        headerXFontWeight: '500',
        headerXDisplay: 'none',
        buttonMargin: '10px',
    }
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
        margin-left: ${_ConfirmDialogComponent[PR.styleMode].buttonMargin};
    }

    & > section {
        width: 90%;
        max-width: 450px;
        margin: 0 auto;
        border-radius: 10px;
        background-color: ${_ConfirmDialogComponent[PR.styleMode].sectionBackground};
        /* 팝업이 열릴때 스르륵 열리는 효과 */
        animation: ${modalShow} 0.3s;
        overflow: hidden;
        border: ${_ConfirmDialogComponent[PR.styleMode].sectionBorder};
    }

    & > section > header {
        position: relative;
        padding: ${_ConfirmDialogComponent[PR.styleMode].headerPadding};
        background-color: ${_ConfirmDialogComponent[PR.styleMode].headerBackground};
        font-weight: 700;
        color: ${_ConfirmDialogComponent[PR.styleMode].titleColor};
    }

    & > section > header button {
        position: absolute;
        top: ${_ConfirmDialogComponent[PR.styleMode].headerXTop};
        right: ${_ConfirmDialogComponent[PR.styleMode].headerXRight};
        width: 30px;
        font-size: ${_ConfirmDialogComponent[PR.styleMode].headerXFontSize};
        font-weight: ${_ConfirmDialogComponent[PR.styleMode].headerXFontWeight};
        text-align: center;
        color: ${_ConfirmDialogComponent[PR.styleMode].headerXColor};
        background-color: transparent;
        display: ${_ConfirmDialogComponent[PR.styleMode].headerXDisplay};
    }

    & > section > main {
        padding: ${_ConfirmDialogComponent[PR.styleMode].sectionMainPadding};
        border-bottom: ${_ConfirmDialogComponent[PR.styleMode].sectionMainBorderBottom};
        border-top: ${_ConfirmDialogComponent[PR.styleMode].sectionMainBorderTop};
    }

    & > section > main > p {
        line-height: 20px;
    }

    & > section > main > div {
        margin-top: 12px;
        ${props => props.theme.variables.flex()};
        
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
        padding: ${_ConfirmDialogComponent[PR.styleMode].footerPadding};
        text-align: right;
    }

    & > section > footer button {
        padding: 6px 12px;
        color: #fff;
        background-color: ${_ConfirmDialogComponent[PR.styleMode].footerButtonBackground};
        border-radius: 5px;
        font-size: ${_ConfirmDialogComponent[PR.styleMode].footerFontSize};
        border: ${_ConfirmDialogComponent[PR.styleMode].footerBorder};

        &:last-child {
            background: ${_ConfirmDialogComponent[PR.styleMode].footerButtonLastBackground};
        }
    }

    &.openModal {
        display: flex;
        align-items: center;
        /* 팝업이 열릴때 스르륵 열리는 효과 */
        animation: ${modalBgShow} 0.3s;
        color: ${_ConfirmDialogComponent[PR.styleMode].fontColor};
        font-size: ${_ConfirmDialogComponent[PR.styleMode].sectionFontSize};
    }
`;