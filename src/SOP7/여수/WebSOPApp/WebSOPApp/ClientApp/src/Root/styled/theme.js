import { css, styled } from "styled-components";

const theme = {
    mainColor: "#19A5FF",
    backgroundColor: "rgba(26,26,26,0.9)",
    redColor: "#FF5A5A",
    blueColor: "#19A5FF",
    grayColor: "#808080",
    lightGrayColor: "#4d4d4d54",
    blackColor: "#000000",
    borderColor: "#666666",




    /* width: (props) => css`
        width:${props} !important;
    `,

    flex: (justify = 'space-between', align = 'center') => css`
        display: flex;
        justify-content:${justify};
        align-items:${align};
    `,

    scroll: () => css`
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

    scrollDark: () => css`
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

    overText: () => css`
        white-space: nowrap; 
        text-overflow: ellipsis; 
        overflow: hidden;
    ` */

    fontStyle: (size = '16px', weight = '400', family = 'Noto Sans KR', lineHeight = '15px') => css`
       font-size: ${size};
       font-weight: ${weight};
       font-family: ${family};
       line-height: ${lineHeight};
    `,

    textStyle: (align = 'center', spacing = '3px') => css`
       text-align: ${align};
       letter-spacing: ${spacing};
    `,

    backgroundOption: (repeat = 'no-repeat', position = 'center center') => css`
       background-repeat: ${repeat};
       background-position: ${position};
    `,

    tableStyle: (border = '1px solid #808080') => css`
       display: table;
       width: 100%;
       border-collapse: collapse;
       border-spacing: 0;
       border: ${border};
    `


};

export default theme;