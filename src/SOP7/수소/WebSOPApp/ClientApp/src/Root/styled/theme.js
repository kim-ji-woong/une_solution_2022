import { css, styled } from "styled-components";

const theme = {
    primary: "#0085FF",
    secondary: "#757575",
    fontPrimary: "#fff",
    fontSecondary: "#9E9E9E",
    defaultFontColor: "#000000",
    warning: "#D32F2F",
    error: "#FF0000",
    background: "#0D121A",
    systemMainBackground: "#222A38",
    sopBoxBackground: "#1B212C",
    sopTitleBackground: "#1D2023",
    sopGridBtnBackground: "#424242",
    

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
            background-color: #3C4143;
        }

        &::-webkit-scrollbar-track {
            background-color: rgba(0,0,0,0);
        }

        &::-webkit-scrollbar-corner {
            display: none;
        }
    `,

    overText: () => css `
        white-space: nowrap; 
        text-overflow: ellipsis; 
        overflow: hidden;
    `, 

    userSelect: () => css `
        user-select: none;
    `
};

export default theme;

//  ${(props) => props.theme.fontPrimary};
//  ${(props) => props.theme.scroll()};

export const ModalBackground = styled.div`
    position: fixed;
    top:0; 
    left: 0; 
    bottom: 0; 
    right: 0;
    background: rgba(0, 0, 0, 0.3);
    opacity: 1;
    z-index: 100;
`