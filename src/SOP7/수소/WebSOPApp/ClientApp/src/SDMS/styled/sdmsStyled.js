import styled from "styled-components";
import PR from "../resource/id";

import "../../Common/css/commonWonik.scss";


/**********************************************************************/
// SDMS root

export const SDMSComponent = styled.div`
    display: flex;
    flex-direction: row-reverse;

    /* 활성화 */
    .dslGrdAct {
        /* background-color: #136b9bc7; */
        background-color: #007abdc7;
    }

    .posiHeaderWrap {
        position: absolute;
        right: 0;
        top: 0;
        height: 60px;
        padding: 8px 20px 0;
        display: inline-block;
        z-index: 2;
    }
    
    .posiHeaderWrap:after {
        content: "";
        position: absolute;
        right: 0;
        top: 0;
        width: 100%;
        border-left: 50px solid transparent;
        border-top: 60px solid #060817;
        z-index: 1;
    }

    .appHeaderWrap {
        width: 100%;
        height: 90px;
        padding: 20px 30px;
        background-color: #060817;
    }

    .appHeaderWrap a,
    em,
    h2 {
        color: #fff;
    }

    .normalTextBox{
        display: block;
        height: 27px;
        border: solid 1px #fff;
        border-radius: 21px;
        background: linear-gradient(180deg, #FFFFFF, #DBDBDB)no-repeat;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.6px;
        text-align: center;
        padding: 7px 10px; 
        position: absolute;
        left: 0;
        top: 0;
        z-index: 99;
    }

    .activeTextBox{
        display: block;
        height: 41px;
        border: solid 1px #fff;
        border-radius: 21px;
        background: linear-gradient(180deg, #5398FF, #0085FF)no-repeat;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.8px;
        color: #000000;
        text-align: center;
        padding: 11px 20px; 
        position: absolute;
        left: 0;
        top: 30px;
        z-index: 99;
    }
`;


/**********************************************************************/
// earthTooltip 팝업

export const EarthPopComponent = styled.div`
    position: absolute;
    left: 28px;
    top: -24px;
    width: 222px;
    height: 214px;
    background: #0E162DE0;
    border-radius: 10px;
    padding: 10px;
    z-index: 2;

    &::after {
        border-top: 7px solid transparent;
        border-left: 0px solid transparent;
        border-right: 10px solid #0E162DE0;
        border-bottom: 7px solid transparent;
        content: "";
        position: absolute;
        top: 24px;
        left: -10px;
}

    .earthPopTitleFlex{
        display: flex;
        align-items: center;
        color: #fff;
        font-size: 10px;
        margin-bottom: 5px;
    }

    .earthPopTitleFlex > span{
        flex: 1;
    }

    .earthPopTitleFlex > div{
        display: flex;
        align-items: center;
        font-size: 8px;
    }
    .interestBox{
        display: block;
        width: 5px;
        height: 5px;
        background: #007FFF;
        margin-right: 5px;
    }
    .cautionBox{
        display: block;
        width: 5px;
        height: 5px;
        background: #FFEE00;
        margin: 0px 5px 0px 5px;
    }
    .boundaryBox{
        display: block;
        width: 5px;
        height: 5px;
        background: #FF8800;
        margin: 0px 5px 0px 5px;
    }
    .seriousBox{
        display: block;
        width: 5px;
        height: 5px;
        background: #FF3838;
        margin: 0px 5px 0px 5px;
    }

    .earthTable{
        color: #fff;
        font-size: 10px; 
    }
    .earthTable thead tr{
        height: 15px;
        line-height: 15px;
    }
    
    .earthTable thead td{
        text-align: center;
        border: solid 1px #fff;
        background: #4C5161;
    }
    
    .earthTable tbody tr{
        height: 15px;
        line-height: 15px;
    }
    
    .earthTable tbody tr:nth-child(1){
        background: #1A2232;
    }

    .earthTable tbody tr:nth-child(2){
        background: #1A2232;
    }

    .earthTable tbody tr:nth-child(3){
        background: #15345B;
    }

    .earthTable tbody tr:nth-child(4){
        background: #474B27;
    }

    .earthTable tbody tr:nth-child(5){
        background: #484B28;
    }

    .earthTable tbody tr:nth-child(6){
        background: #473627;
    }

    .earthTable tbody tr:nth-child(7){
        background: #473627;
    }

    .earthTable tbody tr:nth-child(8){
        background: #472632;
    }

    .earthTable tbody tr:nth-child(9){
        background: #472632;
    }

    .earthTable tbody tr:nth-child(10){
        background: #472632;
    }

    .earthTable tbody td{
        border: solid 1px #fff;
        text-align: center;
    } 
`;