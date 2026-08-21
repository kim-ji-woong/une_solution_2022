import { css } from "styled-components";

const sizes = {
    // desktop: 1360, // 데스크탑
    tablet: 1359,  // 태블릿
    mobile: 768,   // 모바일
    smallMobile: 431
};

export default Object.keys(sizes).reduce((acc, label) => {
    acc[label] = (...args) => css`
        @media screen and (max-width: ${sizes[label]}px) {
            ${css(...args)};
        }
    `;
    
    return acc;
}, {});