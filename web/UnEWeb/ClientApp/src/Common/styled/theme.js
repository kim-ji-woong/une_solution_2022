import { css, styled } from "styled-components";
import CommonResource from "../resource/id";

const theme = {
    background: CommonResource.colors.background,
    primary: CommonResource.colors.primary,
    secondary: CommonResource.colors.secondary,
    fontPrimary: CommonResource.colors.fontPrimary,
    fontSecondary: CommonResource.colors.fontSecondary,

    flex: (justify= 'space-between', align= 'center') => css `
        display: flex;
        justify-content:${justify};
        align-items:${align};
    `,

    scroll: (backgroundColor= CommonResource.colors.primary) => css `
        &::-webkit-scrollbar {
            width: 4px;
        }
        
        &::-webkit-scrollbar-thumb {
            background-color: ${backgroundColor};
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
//  ${(props) => props.theme.userSelect()};

export const ModalBackground = styled.div`
    position: fixed;
    top: 0; 
    left: 0; 
    bottom: 0; 
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    opacity: 1;
    z-index: 99;
`