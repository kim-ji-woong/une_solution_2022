import styled from 'styled-components';
import ProjectResource from '../../Root/resource/id';

import teamPlus from '../../TeamEditor/image/teamPlus.png';
import teamArrowDown from '../../TeamEditor/image/teamArrowDown.png';
import teamArrowUp from '../../TeamEditor/image/teamArrowUp.png';
import treePlus from '../../TeamEditor/image/treePlus.png';
import treeMinus from '../../TeamEditor/image/treeMinus.png';
import treeEdit from '../../TeamEditor/image/treeEdit.png';

import teamTableSearch from '../../TeamEditor/image/teamTableSearch.png';
import teamTablePlus from '../../TeamEditor/image/teamTablePlus.png';
import teamTableBin from '../../TeamEditor/image/teamTableBin.png';
import addMemberIcon from '../image/addMemberIcon.svg';
import memberFileIcon from '../image/memberFileIcon.svg';
import memberFileIcon_up from '../image/memberFileIcon_up.svg';
import check_mark_hover from '../../Common/images/check_mark_hover.png';


/*teamEditor.jsx***************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/

export const TeamSubAside = styled.div`
    display: block;
    width: 280px;
    height: 100%;
    background: #1B212C;
    position: absolute;
    left: 0;
    top: 0;
`;


/*teamMenu.jsx***************************************************************/
/****************************************************************************/
/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

export const SaRht = styled.div`
    display: block;
    float: left;
    width: 280px;
    height: calc(100% - 50px);
    position: absolute;
    left: 0;
    overflow: hidden;

    .memberInfoWrap {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;

        > button {
            ${(props) => props.theme.flex()};
            width: 100%;
            height: 56px;
            text-align: left;
            border-bottom: 1px solid #1B212C;
            background: #2A3344;
            font-weight: 700;
            padding: 0 20px;

            &:hover::after {
                filter: invert(48%) sepia(60%) saturate(5096%) hue-rotate(185deg) brightness(103%) contrast(107%);
            }
        }

        .upload::after {
            content: '';
            display: block;
            width: 24px;
            height: 24px;
            background: url(${ memberFileIcon_up }) no-repeat;
        }

        .download::after {
            content: '';
            display: block;
            width: 24px;
            height: 24px;
            background: url(${ memberFileIcon }) no-repeat;
        }
    }
`;


/***************************************************************************/

export const SarSel = styled.div`
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    width: 280px;
    cursor:pointer;

    > button{
        display: block;
        position: relative;
        width: 100%;
        height: 56px;
        text-align: left;
        background: ${(props) => props.theme.primary};
        font-size: 16px;
        font-weight: 700;
        padding-left: 20px;
        color: #1B212C;
    }

    > button:after{
        content: '';
        display: block;
        width: 16px;
        height: 9px;
        position: absolute;
        right: 25px;
        top: 50%;
        margin-top: -5px;
        background: url(${ teamArrowDown }) no-repeat;
    }

    > button.on:after {
        background: url(${ teamArrowDown }) no-repeat;
        transform: rotate(180deg);
    }

    > ul{
        position: absolute;
        left: 0;
        right: 0;
        top: 100%;
        z-index: 10;
        background: #1B212C;
        display: none;
        box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.16);
    }

    > ul > li{
        border-bottom: 1px solid #2A3344;
        font-size: 14px;
        height: 56px;

        &:hover {
            background: ${(props) => props.theme.primary};
            color: #1B212C;
        }
    }

    > ul > li > a{
        display: block;
        padding: 20px;
        font-size: 16px;
        font-weight: 700;
    }
`;

/***************************************************************************/

export const SarEdit = styled.div`
    display: flex;
    position: absolute;
    top: 56px;
    left: 0;
    width: 280px;
    height: 56px;
    cursor: pointer;
    border-bottom: 1px solid #1B212C;
    background: #2A3344;

    > button{
        display: block;
        position: relative;
        width: 100%;
        height: 56px;
        text-align: left;
        background: #2A3344;
        font-size: 16px;
        font-weight: 700;
        padding-left: 20px;
        color: ${(props) => props.theme.fontPrimary};

        &:hover::after {
            filter: invert(48%) sepia(60%) saturate(5096%) hue-rotate(185deg) brightness(103%) contrast(107%);
        }
    }

    > button:after{
        content: '';
        display: block;
        width: 24px;
        height: 24px;
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translate(0, -50%);
        background: url(${ addMemberIcon }) no-repeat;
    }
`;


/*regularMemberPage.jsx********************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/

export const SubCont = styled.div`
    display: block;

    width: calc(100% - 280px);
    height: calc(100% - 50px);
    position: absolute;
    left: 280px;
    padding: 40px;

    &::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        border-radius: 3px;
        background-color: #282828;
    }
    &::-webkit-scrollbar-thumb {
        width: 3px;
        border-radius: 3px;
        background: #0095FF;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }

    .addPointer tr:last-child{
        border: solid 3px #0095FF;
    }

`;

/******************************************************************/

export const ScWrap = styled.div`
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;

`;

/******************************************************************/

export const ScCont = styled.div`
    display: block;
    height: 100%;

    .memberListArea {
        width: 100%;
        height: calc(100% - 52px);
        background-color: #1A1F23;
        border-radius: 4px 4px 0 0;
        margin-top: 20px;

        & * {
            font-size: 14px;
        }

        .memberList {
            height: 100%;

            &.regular {
                .head > div, 
                .body > ul > li > div {
    
                    &:nth-of-type(1) {
                        width: 3%;
                    }
    
                    &:nth-of-type(2) {
                        width: 3%;
                    }
                    
                    &:nth-of-type(3) {
                        width: 10%;
                    }
                    
                    &:nth-of-type(4) {
                        width: 10%;
                    }
                    
                    &:nth-of-type(5) {
                        width: 10%;
                    }
                    
                    &:nth-of-type(6) {
                        width: 16%;
                    }
    
                    &:nth-of-type(7) {
                        width: 16%;
                    }
    
                    &:nth-of-type(8) {
                        width: 16%;
                    }
    
                    &:nth-of-type(9) {
                        width: 16%;
                    }
                }
            }

            &.temporary {
                .head > div, 
                .body > ul > li > div {
    
                    &:nth-of-type(1) {
                        width: 3%;
                    }
    
                    &:nth-of-type(2) {
                        width: 3%;
                    }
                    
                    &:nth-of-type(3) {
                        width: 30%;
                    }
                    
                    &:nth-of-type(4) {
                        width: 12%;
                    }
                    
                    &:nth-of-type(5) {
                        width: 12%;
                    }
                    
                    &:nth-of-type(6) {
                        width: 12%;
                    }
    
                    &:nth-of-type(7) {
                        width: 30%;
                    }
                }
            }

            .head {
                background: #2A3344;
                width: calc(100% - 6px);
                ${(props) => props.theme.flex()};

                &::after {
                    content: '';
                    width: 6px;
                    height: 32px;
                    background-color: #0D121A;
                    position: absolute;
                    right: 40px;
                }

                > div {

                    &:not(:last-child) {
                        border-right: 1px solid ${(props) => props.theme.background};
                    }

                    height: 34px;
                    line-height: 33px;
                    text-align: center;
                    font-weight: 500;
                }
            }

            .body {
                background-color: #1B212C;
                overflow-y: scroll;
                height: calc(100% - 34px);

                ${(props) => props.theme.scroll()};

                ul {

                    li {
                        ${(props) => props.theme.flex()};
                        border-bottom: 1px solid #2A3344;
                        cursor: pointer;

                        &:hover {
                            background-color: ${(props) => props.theme.primary};

                            input[type=checkbox]:checked {
                                background: url(${check_mark_hover}) no-repeat center center;
                            }
                        }

                        div {
                            text-align: center;
                            border-right: 1px solid #2A3344;
                            height: 34px;
                            line-height: 34px;
                        }
                    }
                }
            }
        }
    }
`;

/******************************************************************/

export const ScTop = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    > h4 {
        display: inline-block;
        color:#0095FF;
        font-size: 16px;
        font-weight: 700;
    }
`;

/******************************************************************/

export const SctRht = styled.div`
    display: flex;
    align-items: center;

`;

/******************************************************************/

export const SctSch = styled.div`
    display: flex;
    align-items: center;
    height: 31px;

    > a {
        display: inline-block;
        width: 28px;
        height: 28px;
        background: url(${ teamTableSearch }) no-repeat;
        background-size: 28px 28px;
        cursor: pointer;
    }
`;


/******************************************************************/

export const SctAdd = styled.button`
    width: 46px;
    height: 30px;
    background-color: #1B212C;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    border-radius: 2px;
    border: 1px solid #29313E;
    margin-left: 10px;

    &:hover {
        background-color: ${(props) => props.theme.primary};
        color: #1B212C;
    }
`;


/******************************************************************/

export const SctDel = styled.button`
    width: 46px;
    height: 30px;
    background-color: #1B212C;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    border-radius: 2px;
    border: 1px solid #29313E;
    margin-left: 4px;

    &:hover {
        background-color: ${(props) => props.theme.primary};
        color: #1B212C;
    }
`;


/*treenode.jsx********************************************************/
/**********************************************************************/
/**********************************************************************/
/**********************************************************************/
/**********************************************************************/

export const EditArea = styled.div`
    display: flex;
    position:absolute;
    top: 0;
    right: 10px;
    visibility:visible;

`;


/**********************************************************************/

export const TreeEdit = styled.div`
    display: inline-block;
    width: 20px;
    height: 19px;
    background: url(${ treeEdit }) no-repeat;
    margin-right: 6px;

`;

/**********************************************************************/

export const TreeMinus = styled.div`
    display: inline-block;
    width: 20px;
    height: 19px;
    background: url(${ treeMinus }) no-repeat;
    margin-right: 6px;
`;

/**********************************************************************/

export const TreePlus = styled.div`
    display: inline-block;
    width: 19px;
    height: 19px;
    background: url(${ treePlus }) no-repeat;
`;