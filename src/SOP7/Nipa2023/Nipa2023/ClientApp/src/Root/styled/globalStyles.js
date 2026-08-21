import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

import check_mark from "../images/check_mark.png";

const GlobalStyles = createGlobalStyle`
    ${reset}

    a{
        text-decoration: none;
        color: inherit;
    }

    *{
        box-sizing: border-box;
    }

    html, body, div, span, h1, h2, h3, h4, h5, h6, p, 
    a, dl, dt, dd, ol, ul, li, form, label, table, button{
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 16px;
        vertical-align: baseline;
        font-family: 'Spoqa Han Sans Neo', 'Noto Sans KR', sans-serif !important;
    }

    body{
        line-height: 1;
        background-color: rgba(1,1,1,0);
        color: #fff;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    ol, ul, li {
        list-style: none;
    }

    button {
        border: 0;
        background: transparent;
        cursor: pointer;
    }

    button:focus {
        outline: none;
        border: none;
        box-shadow: 0 0 0 0;
    }

    *:focus {
        outline: 0;
    }

    input {
        border:0 solid black;
    }

    label {
        margin-left: 12px;
    }

    label,img,input,select,textarea,button,a {
        vertical-align: middle;
    }

    table {
        width:100%;border-spacing:0;border-collapse:collapse;
    }

    select { 
        appearance:none;
    }

    select::-ms-expand { 
        display:none;
    }

    input[type="search"]::-webkit-search-decoration,
    input[type="search"]::-webkit-search-cancel-button,
    input[type="search"]::-webkit-search-results-button,
    input[type="search"]::-webkit-search-results-decoration,
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button { 
        -webkit-appearance:none;
    }

    input[type="number"]{ 
        -moz-appearance:textfield;
    }

    input[type="number"],
    input[type="text"],
    input[type="password"],
    input[type="url"],
    input[type="email"],
    input[type="tel"],
    input[type="date"], 
    textarea { 
        -webkit-appearance:none; 
        -moz-appearance:none; 
        appearance:none; 
        -webkit-border-radius:0; 
        outline:0;
    }

    textarea { 
        resize: none;
    }

    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
        -webkit-text-fill-color: ${(props) => props.theme.backgroundColor};
        -webkit-box-shadow: 0 0 0px 1000px transparent inset;
        box-shadow: 0 0 0px 1000px transparent inset;
        transition: background-color 5000s ease-in-out 0s;
    }

    input:autofill,
    input:autofill:hover,
    input:autofill:focus,
    input:autofill:active {
        -webkit-text-fill-color: ${(props) => props.theme.lightGray};
        -webkit-box-shadow: 0 0 0px 1000px transparent inset;
        box-shadow: 0 0 0px 1000px transparent inset;
        transition: background-color 5000s ease-in-out 0s;
    }

    input:-webkit-autofill::first-line {
        font-size: 14px;
    }

    input[type=checkbox] {
        width: 15px;
        height: 15px;
        border: 1px solid #707070;
        border-radius: 2px;
        cursor: pointer;
        -webkit-appearance:none; 
        -moz-appearance:none; 
        appearance:none; 
        position: relative; 
        background: #fff;
    }

    input[type=checkbox]:checked {
        background: #20DFA8 url(${check_mark})no-repeat center center; 
        background-size: 9px auto !important;
        border: 0;
    }

    input[type=checkbox] + label {
        display: inline; 
        vertical-align: middle; 
        margin-left: 5px; 
        font-size: 14px; 
        font-weight: 400; 
        cursor: pointer;
    }

    input[type=radio] {
        display: inline-block;
        vertical-align: middle;
        width: 17px;
        height: 17px;
        border: solid 1px #707070;
        background-color: #fff;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        position: relative;
        cursor: pointer;
        border-radius: 50%;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
    }

    input[type=radio]:checked:after {
        content: "";
        display: block;
        background: #20DFA8;
        position: absolute;
        left: 3px;
        right: 3px;
        top: 3px;
        bottom: 3px;
        border-radius: 50%;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
    }

    input:disabled {
        background: gray;
        cursor: default;
    }

    caption, legend {
        line-height: 0;
        font-size: 1px;
        overflow: hidden;
    }

    a {
        cursor: pointer;
    }

    .dsiSel label:hover::after {
        content:attr(data-title); 
        position: absolute; 
        white-space: nowrap;
        height: 20px;
        line-height: 10px;
        top: 30px;
        left: 50%; 
        transform: translate(-50%, 0);
        padding: 5px; 
        background: transparent linear-gradient(180deg, #222A31 0%, #000000 100%) 0% 0% no-repeat padding-box;
        border-radius: 2px;
        font-size: 10px; 
        color: #fff;
        text-align: center; 
        z-index: 100;
    }
    
    #sdms-tooltip-area {
        position: absolute;
        padding: 5px;
        background: transparent linear-gradient(180deg, #222A31 0%, #000000 100%) 0% 0% no-repeat padding-box;
        color: #fff;
        font-size: 10px; 
        border-radius: 2px;
        z-index: 9999;
        white-space: nowrap;
    }
`;

export default GlobalStyles;
