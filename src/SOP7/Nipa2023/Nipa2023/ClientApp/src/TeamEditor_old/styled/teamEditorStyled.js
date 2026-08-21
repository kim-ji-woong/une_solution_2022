import styled from "styled-components";

import search_on from '../../Account/images/search_on.png';
import search_off from '../../Account/images/search_off.png';
import team_plus from '../images/team_plus.png';
import team_minus from '../images/team_minus.png';

export const TeamEditorCommon = styled.div`

`


/**********************************************************************/


export const TeamEditorComponent = styled(TeamEditorCommon)`
    width: 100vw;
    height: 100vh;
    padding-top: 50px;
    overflow: hidden;
    background-color: #3B4248;
    position: absolute;
    top: 0;
    left: 0;
`


/**********************************************************************/


export const TreeMenuComponent = styled.aside`
    width: 280px;
    height: calc(100vh - 53px);
    margin-top: 53px;
    background-color: ${(props) => props.theme.darkColor};
    position: absolute;
    top: 0;
    left: 0;

    .sarSel {
        width: 100%;
    }

    .sarSel h5 {
        display: block;
        position: relative;
        width: 100%;
        height: 55px;
        line-height: 54px;
        text-align: left;
        background: transparent;
        font-size: 16px;
        font-weight: 700;
        padding-left: 30px;
        border-bottom: 1px dashed #525868;
        color: #fff;
    }

    .treeWrap {
        padding: 20px 0 20px 50px;

        ul > li:not(.treeLast) {   // 1depth
            margin-bottom: 20px;

            button {
                background: url(${team_plus}) no-repeat center center;
                width: 13px;
                height: 13px;
                display: inline;
                margin-right: 8px;
            }
            
            > h5 {
                font-size: 14px;
                color: #CCCCCC;
                cursor: pointer;
                position: relative;
                display: inline;
            }

            &:not(.treeLast).on > button {
                background: url(${team_minus}) no-repeat center center;
            }

            &:not(.treeLast).on > h5 {
                color: #fff;
            }

            > ul {
                display: none;
                padding: 15px 0 0 15px;

                &.on {
                    display: block;
                }

                > li { // 2depth
                    margin-bottom: 15px;

                    > h5 {
                        font-size: 14px;
                        color: #CCCCCC;
                        cursor: pointer;
                        display: inline;
                    }

                    > ul {
                        display: none;
                        padding: 15px 0 0 15px;

                        &.on {
                            display: block;
                        }

                        > li { // 3depth
                            margin-bottom: 15px;

                            > h5 {
                                font-size: 14px;
                                color: #fff;
                                cursor: pointer;
                                display: inline;
                            }
                        }
                    }
                }
            }

            .treeLast {
                position: relative;
                left: 6px;
            }
        }
    }

`

export const TeamListComponent = styled.section`
    width: calc(100vw - 280px);
    height: calc(100vh - 53px);
    margin-top: 53px;
    padding: 30px 40px 40px 30px;
    overflow: hidden;
    position: absolute;
    top: 0;
    right: 0;

    .headerWrap {
        ${(props) => props.theme.flex()};
        margin-bottom: 16px;
    }

    .searchWrap {
        ${(props) => props.theme.flex('flex-end', 'center')};
        gap: 7px;

        input {
            width: 600px;
            height: 27px;
            background: transparent;
            border: 1px solid #CCCCCC;
            border-radius: 3px;
            color: #fff;
            font-size: 12px;
            padding-left: 10px;
        }

        a {
            display: block;
            width: 27px;
            height: 27px;
            text-indent: -9999px;
            border-radius: 2px;
            cursor: pointer;

            &:nth-child(2) {
                background: url(${search_off}) no-repeat center center, rgba(204, 204, 204, .3);

                &:hover {
                    background: url(${search_on}) no-repeat center center, rgba(32, 223, 168, .3);
                }
            }
        }
    }

    .contentWrap {
        width: 100%;
        height: calc(100% - 43px);
        background-color: ${(props) => props.theme.darkColor};
        border-radius: 4px;

        table {
            text-align: center;
            font-size: 12px;
    
            thead {
                height: 31px !important;
                line-height: 31px;
                color: ${(props) => props.theme.middleGray};
                background-color: #1A1F23;
    
                tr {
                    td {
                        height: 31px !important;
                        &:not(:last-child){
                            border-right: 1px dashed #525868;
                        }

                        &.userId {
                            position: relative;
                        }

                        div {
                            display: inline-block;
                            position: absolute;
                            right: 5px;
                            top: 7px;
                            cursor: pointer;
                            line-height: 0;

                            &:hover {
                                p {
                                    display: block;
                                }
                            }
                            
                            p {
                                display: none;
                                position: absolute;
                                transform: translate(-50%, 40%);
                                width: 347px;
                                height: 22px;
                                line-height: 23px;
                                background: #000000;
                                border-radius: 4px;
                                font-size: 12px;
                                color: #fff;

                                &::before {
                                    content: '';
                                    display: block;
                                    width: 11px;
                                    height: 10px;
                                    clip-path: polygon(50% 29%, 0% 100%, 100% 100%);
                                    background-color: #000000;
                                    position: absolute;
                                    top: -9px;
                                    left: 176px;
                                }
                            }
                        }
                    }
                }
            }
    
            tbody {
                color: #fff;
    
                tr {
                    height: 41px;
                    line-height: 41px;
                    border-bottom: 1px dashed #525868;

                    td {
    
                        &:not(:last-child){
                            border-right: 1px dashed #525868;
                        }
                    }
                }

                tr.on {
                    background: rgba(112, 112, 112, .1);
                    color: ${(props) => props.theme.mainColor};
                }

                option {
                    color: #000000;
                }
            }
        }
    }
`;