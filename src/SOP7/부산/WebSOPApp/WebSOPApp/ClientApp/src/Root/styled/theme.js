import { css, styled } from "styled-components";

const theme = {
    primary: "#0095FF",
    secondary: "#757575",
    fontPrimary: "#fff",
    fontSecondary: "#9E9E9E",
    warning: "#D32F2F",
    error: "#FF0000",
    background: "#0D121A",
    

    flex: (justify= 'space-between', align= 'center') => css `
        display: flex;
        justify-content:${justify};
        align-items:${align};
    `,

    scroll: (backgroundColor= theme.background, barColor= theme.primary) => css `
        &::-webkit-scrollbar {
            width: 6px;
            background: ${backgroundColor};
        }
        
        &::-webkit-scrollbar-thumb {
            background-color: ${barColor};
        }

        &::-webkit-scrollbar-track {
            background-color: rgba(0,0,0,0);
        }
`,

    overText: () => css `
        white-space: nowrap; 
        text-overflow: ellipsis; 
        overflow: hidden;
    `,

    userSelect: () => css `
        -ms-user-select: none;
        -moz-user-select: -moz-none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        user-select: none;
    `
};

export default theme;

//  ${(props) => props.theme.primary};
//  ${(props) => props.theme.flex()};

export const ModalBackground = styled.div`
    position: fixed;
    top:0; 
    left: 0; 
    bottom: 0; 
    right: 0;
    background: rgba(0, 0, 0, 0.3);
    opacity: 1;
    z-index: 99;
`