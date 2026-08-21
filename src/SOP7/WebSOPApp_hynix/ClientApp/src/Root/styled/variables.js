import { css } from "styled-components";
import styled, { keyframes } from "styled-components";

const variables = {
    gap: (height= '20px') => css `
        height:${height};
        clear:both;
        overflow:hidden;
    `,

    width: (props) => css `
        width:${props} !important;
    `,

    flex: (justify= 'space-between', align= 'center') => css `
        display: flex;
        justify-content:${justify};
        align-items:${align};
    `,

    clearfix: () => css `
        display: block;
        content: '';
        clear: both;
    `,

    scroll: () => css `
        &::-webkit-scrollbar-thumb {
            background-color: var(--dark-gray-color);
        }

        &::-webkit-scrollbar-track {
            background-color: var(--navy-color);
            border-radius: 10px;
    }
    `
}

export default variables;


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