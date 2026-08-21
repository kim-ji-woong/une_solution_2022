import { css, styled } from "styled-components";

const theme = {
    mainColor: "#20DFA8",
    backgroundColor: "#293239",
    lightGray: "#A9ADB0",
    middleGray: "#A5A5A5",
    darkGray: "#222A31",
    darkColor: "#252E34",
    warningColor: "#FF5454",
    yellowColor: "#FFFF00",
    greenColor: "#54FF00",
    pinkColor: "#FF9191",
    darkPinkColor: "#FF6A6A",


    width: (props) => css `
        width:${props} !important;
    `,

    flex: (justify= 'space-between', align= 'center') => css `
        display: flex;
        justify-content:${justify};
        align-items:${align};
    `,

    scroll: () => css `
        &::-webkit-scrollbar {
            width: 4px;
        }
        
        &::-webkit-scrollbar-thumb {
            background-color: #22CF9F;
            border-radius: 50px;
        }

        &::-webkit-scrollbar-track {
            background-color: transparent;
            border-radius: 10px;
        }
    `,

    scrollDark: () => css `
        &::-webkit-scrollbar {
            width: 8px;
        }
        
        &::-webkit-scrollbar-thumb {
            background-color: #222A31;
            border-radius: 50px;
        }

        &::-webkit-scrollbar-track {
            background-color: transparent;
            border-radius: 10px;
        }
    `,

    overText: () => css `
        white-space: nowrap; 
        text-overflow: ellipsis; 
        overflow: hidden;
    `
};

export default theme;

//  ${(props) => props.theme.mainColor};
//  ${(props) => props.theme.flex()};

export const ModalBackground = styled.div`
    position: fixed;
    top:0; 
    left: 0; 
    bottom: 0; 
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    opacity: 1;
    z-index: 99;
`

export const BlurBackground = styled.div`
    position: fixed;
    top:0; 
    left: 0; 
    bottom: 0; 
    right: 0;
    background: rgba(0, 0, 0, 0.1);
    opacity: 1;
    backdrop-filter: blur(29px);
    -webkit-backdrop-filter: blur(29px);
    z-index: 99;
`