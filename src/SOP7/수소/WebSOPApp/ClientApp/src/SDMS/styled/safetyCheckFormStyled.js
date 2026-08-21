import styled from "styled-components";


import safetyIcon from '../../Common/img/imgwonik/safety_Icon.png'
import memoIcon from '../../Common/img/imgwonik/memo_Icon.png';
import memoActiveIcon from '../../Common/img/imgwonik/memoActive_Icon.png';
import safetyArrowIcon from '../../Common/img/imgwonik/safetyArrow_Icon.png';
import safetyArrowWhiteIcon from '../../Common/img/imgwonik/safetyArrowUp.png';
import safetySubmitIcon from '../../Common/img/imgwonik/safetySubmit_Icon.png';



export const SafetyCheckFormComponent = styled.div`
    width: 780px;
    margin: 0 auto;
    padding-top: 90px;
    margin-bottom: 92px;

    .headerBox{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 17px;
    }

    .headerFlex{
        display: flex;
        align-items: center;
    }

    .headerFlex h1 {
        font-size: 40px;
        font-weight: bold;
    }

    .headerFlex p{
        display: inline-block;
        width: 21px;
        height: 20px; 
        background: url(${ safetyIcon }) no-repeat center center;
        cursor: pointer;
        margin-left: 10px; 
    }

    .headerBtnBox button:first-child {
        width: 68px;
        height: 32px;
        border: 1px solid #5398FF;
        color: #5398FF;
        border-radius: 5px;
        background: none;
        font-size: 16px;
        letter-spacing: 0.8px;
        cursor: pointer;

    }

    .headerBtnBox button:last-child {
        width: 68px;
        height: 32px;
        background: transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;
        border: 1px solid #FFFFFF1A;
        border-radius: 5px;
        letter-spacing: 0.8px;
        color: #FFFFFF;
        margin-left: 10px;
        font-size: 16px;
        letter-spacing: 0.8px;
        cursor: pointer;
    }

   .zoneTitle{
        display: block;
        width: 100%;
        height: 28px;
        padding: 7px 10px;
        background: #272E42;
        border-radius: 3px;
        font-size: 12px;
        letter-spacing: 0px;
        color: #fff;

        &.on{
           border-radius: 3px 3px 0px 0px;
        }
    }

    .zoneTitle > p {
        display: inline-block;
    }

    .zoneTitleArrow{
        display: inline-block;
        width: 12px;
        height: 14px;
        background: url(${ safetyArrowWhiteIcon }) no-repeat center center;
        transform: rotate(180deg);
        float: right;

        &.on{
           background: url(${ safetyArrowWhiteIcon }) no-repeat center center;
           transform: rotate(0deg);
        }
    }

    .minimapConts{
        display: none;

        &.on{
            display: block;
            width: 780px;
            height: 600px;
            background: #272E42;
            border-radius: 0px 0px 3px 3px;
            padding: 0px 10px 10px 10px;
        }
    }

    .minimapConts > span{
        display: block;
        width: 100%;
        height: 100%; 
        background: #fff;
    }

    .mainCategoryBox{
        margin-top: 10px;
    }

    .safetySelectBox{
        display: block;
        width: 100%;
        height: 38px;
        background: #E9E9E9 url(${ safetyArrowIcon }) no-repeat 98.7% 50%;
        border-radius: 3px;
        padding: 9px 10px;
        font-size: 16px;
        border-bottom: solid 1px #0000000D;
    }
    .safetySelectBox > option{
        background: #fff;
    }

    select:last-child{
        border: none; 
    }

    .safetySelectBoxx{
        display: block;
        width: 100%;
        height: 38px;
        background: #E9E9E9 url(${ safetyArrowIcon }) no-repeat 98% 50%;
        border-radius: 3px;
        padding: 9px 10px;
        font-size: 16px;
    }
    .safetySelectBoxx > option{
        background: #fff;
    }

    .squareTitleBox{
        display: flex;
        align-items: center;
        color: #5398FF;
        font-size: 16px;
        font-weight: 600;
        margin-top: 20px;
        margin-bottom: 15px;
    }
    .squareBox{
        display: block;
        width: 4px;
        height: 4px;
        background: #5398FF;
        margin-right: 6px;
    }
    .subClassBox{
        margin-bottom: 20px;
        background: #F5F5F5;
    }
    .subClassTitleBox{
        display: block;
        height: 36px;
        background: #E9E9E9;
        padding: 10px;
        font-size: 14px;
        letter-spacing: 0px;
    }
    .subClassFlex{
        display: flex;
        align-items: center;
        /* height: 56px; */
        border-bottom: solid 1px #0000000D;
        padding: 14px 10px;
        font-size: 14px; 
        letter-spacing: 0px;
    }
    .subClassFlex:last-child{
        border-bottom: none;
    }
    .subClassFlex > span:first-child{
        flex: 1;
    }
    .subClassFlex > span:last-child{
    
    }
    .subClassContsFlex{
        display: flex;
    }
    .numBox{
        display: block;
        width: 75px;
        height: 28px;
        line-height: 26px;
        text-align: center; 
        background: #fff;
        border-radius: 3px;
        margin-right: 7px;
        cursor: pointer; 
    }
    .numBoxActive{
        display: block;
        width: 75px;
        height: 28px;
        line-height: 26px;
        text-align: center;
        background: #5398FF;
        border-radius: 3px;
        margin-right: 7px;
        color: #fff;
        cursor: pointer;
    }
    .memoBox{
        display: block;
        width: 75px;
        height: 28px;
        border: solid 1px #E9E9E9;
        background: url(${ memoIcon }) no-repeat center center;
        border-radius: 3px;
        cursor: pointer;

        &.on{
            display: block;
            width: 75px;
            height: 28px;
            border: solid 1px #E9E9E9;
            background: url(${ memoActiveIcon }) no-repeat center center;
            border-radius: 3px;
            cursor: pointer;
        }
    }

    /* .memoActiveBox{
        display: block;
        width: 75px;
        height: 28px;
        border: solid 1px #E9E9E9;
        background: url(${ memoActiveIcon }) no-repeat center center;
        border-radius: 3px;
    } */

    .subClassContsMemo{
        display: none;

        ::placeholder{
           font-size: 12px;
           color: #989898;
        }
        &.on{
           display: block;
           padding: 10px;
        }
    }

    .subTextArea{
        display: block;
        width: 100%;
        height: 80px;
        border-radius: 3px;
        border: solid 1px #E9E9E9;
        background: #f5f5f5;
        padding: 10px;
    }

    section {
        margin-top: 40px;
        /* padding-bottom: 90px; */
        padding-bottom: 20px;
        margin-bottom: 100px;
        padding-right: 20px;
        /* height: 1611px; */
    }

    section > span {
        display: block;
        height: 48px;
        line-height: 48px;
        background: #EEEEEE;
        border-left: solid 4px #5398FF;
        padding-left: 16px;
        letter-spacing: 0px;
        font-size: 18px;
        font-weight: 600;
    }

    section > ul {
        height: 68px;
        background: #EEEEEE 0% 0% no-repeat padding-box;
        border-radius: 5px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-left: 23px;
        margin-bottom: 20px;
    }

    section > ul li {
        margin-right: 20px;
    }

    section > div > ul {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 0;
        font-size: 16px;
        font-weight: 300;
        margin-bottom: 10px;
    }

    section > div > ul:not(:last-child){
        border-bottom: 1px solid #EEEEEE;
    }

    section > div > ul > li > ul {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    section > div > ul > li > ul > input {
        margin-left: 12px;
        cursor: pointer;
    }

    section > div > ul > li > ul > span {
        margin-left: 8px;
    }

    .fListTextBox{
        display: flex;
        flex-direction: column;
    }
    
    .fListTextBox > textarea {
        /* width: 755px; */
        width: 100%;
        height: 120px;
        border: 1px solid #000000;
        margin-bottom: 10px;
        padding: 10px 8px;
    }

    .fListTextBox > span {
        display: block;
        width: 217px;
        height: 22px;
        line-height: 22px;
        background: #FF5353 0% 0% no-repeat padding-box;
        color: #FFFFFF;
        font-size: 12px;
        font-weight: 400;
        text-align: center;
        letter-spacing: 0px;
        align-self: flex-end;
        cursor: pointer;
    }

    .facilityUl:last-child{
        border: none;
    }

    .safetyScrollBox{
        display: block;
        margin-bottom: 100px;
        height: calc(100vh - 150px);
    }

    .safetyScrollbar{
        overflow-x: hidden;
        overflow-y: scroll;
        height: calc(100% - 40px);
    }

    .safetyScrollbar::-webkit-scrollbar {
        width: 5.5px;
    }

    .safetyScrollbar::-webkit-scrollbar-thumb {
        background-color: #000000;
        opacity: 0.4;
    }

    .safetyScrollbar::-webkit-scrollbar-track {
        background-color: #EEEEEE;
        border-radius: 10px;
    }

    .safetyScrollbar::-webkit-scrollbar-corner {
        display: none;
    }


    /* mobile test ********************************************************************/

    @media screen and (max-width: 767px){
        display: block;
        width: 100%;
        height: 100%;
        padding: 20px 10px;

    .headerBox {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 17px;
    }
    .headerFlex{
        display: flex;
        align-items: center;
    }

    .headerFlex h1 {
        display: block; 
        font-size: 24px;
        font-weight: bold;
    }

    .headerFlex p{
        display: inline-block;
        width: 14px;
        height: 14px;
        background: url(${ safetyIcon }) no-repeat center center;
        background-size: 14px;
        cursor: pointer;
    }

    .headerBtnBox {
        display: flex;
        align-items: center;
    }

    .headerBtnBox > button:first-child {
        width: 68px;
        height: 32px;
        border: 1px solid #5398FF;
        color: #5398FF;
        border-radius: 5px;
        background: none;
        cursor: pointer;
        font-size: 16px;
        letter-spacing: 0.8px;
    }

    .headerBtnBox > button:last-child {
        width: 68px;
        height: 32px;
        background: transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;
        border: 1px solid #FFFFFF1A;
        border-radius: 5px;
        letter-spacing: 0.8px;
        color: #FFFFFF;
        margin-left: 10px;
        cursor: pointer;
        font-size: 16px;
        letter-spacing: 0.8px;
    }

   .zoneTitle{
        display: block;
        width: 100%;
        height: 28px;
        padding: 7px 10px;
        background: #272E42;
        border-radius: 3px;
        color: #fff;
        font-size: 12px;
        font-weight: 400;
        letter-spacing: 0px;

        &.on{
           border-radius: 3px 3px 0px 0px;
       }
    }

    .zoneTitle > p {
        display: inline-block;
    }

    .zoneTitleArrow{
        display: inline-block;
        width: 12px;
        height: 14px;
        background: url(${ safetyArrowWhiteIcon}) no-repeat center center;
        transform: rotate(180deg);
        float: right;

        &.on{
           background: url(${safetyArrowWhiteIcon }) no-repeat center center;
           transform: rotate(0deg);
        }
    }

    .minimapConts{
        display: none;

        &.on{
            display: block;
            width: 100%;
            height: 261px;
            background: #272E42;
            border-radius: 0px 0px 3px 3px;
            padding: 0px 10px 10px 10px;
        }
    }

    .minimapConts > span{
        display: block;
        width: 100%;
        height: 100%;
        background: #fff;
    }

    .minimapConts > img{
        display: inline-block;
        width: 100%;
        height: 100%;
        object-fit: fill;
    }

    .mainCategoryBox{
        margin-top: 10px;
    }

    .safetySelectBox{
        display: block;
        width: 100%;
        height: 38px;
        background: #E9E9E9 url(${safetyArrowIcon}) no-repeat 97% 50%;
        border-radius: 3px;
        padding: 9px 10px;
        border-bottom: solid 1px #0000000D;
        font-size: 16px;
        font-weight: 400;
        letter-spacing: 0px;
    }

    .safetySelectBox > option{
        background: #fff;
    }

    select:last-child{
        border: none; 
    }

    .safetySelectBoxx{
        display: block;
        width: 100%;
        height: 38px;
        background: #E9E9E9 url(${safetyArrowIcon}) no-repeat 98% 50%;
        border-radius: 3px;
        padding: 9px 10px;
        border-bottom: solid 1px #0000000D;
        font-size: 16px;
        font-weight: 400;
        letter-spacing: 0px;
    }

    .safetySelectBoxx > option{
        background: #fff;
    }

    .squareTitleBox{
        display: flex;
        align-items: center;
        color: #5398FF;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 0px;
        margin-top: 20px;
        margin-bottom: 15px;
    }
    .squareBox{
        display: block;
        width: 4px;
        height: 4px;
        background: #5398FF;
        margin-right: 6px;
    }
    .subClassBox{
        margin-bottom: 20px;
        background: #F5F5F5;
    }
    .subClassTitleBox{
        display: block;
        height: 36px;
        background: #E9E9E9;
        padding: 10px;
        border-radius: 3px;
        letter-spacing: 0px;
        font-size: 14px;
    }
    .subClassFlex{
        display: block;
        align-items: center;
        height: 78px; 
        border-bottom: solid 1px #0000000D;
        padding: 14px 10px;
        font-size: 14px;
        letter-spacing: 0px;
    }
    .subClassFlex:last-child{
        border-bottom: none;
    }
    .subClassFlex > span:first-child{
        flex: 1;
    }
    .subClassFlex > span:last-child{
    
    }
    .subClassContsFlex{
        display: flex;
        margin-top: 10px;
        margin-bottom: 12px;
    }
    .numBox{
        display: block;
        width: 75px;
        height: 28px;
        line-height: 26px;
        text-align: center; 
        background: #fff;
        border-radius: 3px;
        margin-right: 7px;
        cursor: pointer; 
    }
    .numBoxActive{
        display: block;
        width: 75px;
        height: 28px;
        line-height: 26px;
        text-align: center;
        background: #5398FF;
        border-radius: 3px;
        margin-right: 7px;
        color: #fff;
        cursor: pointer;
    }

    .memoBox{
        display: block;
        width: 75px;
        height: 28px;
        border: solid 1px #E9E9E9;
        background: url(${memoIcon}) no-repeat center center;
        border-radius: 3px;
        cursor: pointer;

        &.on{
            display: block;
            width: 75px;
            height: 28px;
            border: solid 1px #E9E9E9;
            background: url(${memoActiveIcon}) no-repeat center center;
            border-radius: 3px;
            cursor: pointer;
        }
    }

    .subClassContsMemo{
        display: none;

        ::placeholder{
           font-size: 12px;
           color: #989898;
        }

        &.on{
           display: block;
           padding: 10px;
        }
    }

    .subTextArea{
        display: block;
        width: 100%;
        height: 80px;
        border-radius: 3px;
        border: solid 1px #E9E9E9;
        background: #f5f5f5;
        padding: 10px;
      }
    }
`

export const SafetyCheckSubmitComponent = styled.div`
    width: 780px;
    margin: 0 auto;
    padding-top: 90px;

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 22px;
    }

    header button{
        width: 68px;
        height: 32px;
        background: transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;
        border: 1px solid #FFFFFF1A;
        border-radius: 5px;
        letter-spacing: 0.8px;
        color: #FFFFFF;
        margin-left: 15px;
        cursor: pointer;
    }

    header h1 {
        font-size: 40px;
        font-weight: bold;
    }

    section {
        margin-top: 20px;
        height: 68px;
        background: #EEEEEE 0% 0% no-repeat padding-box;
        border-radius: 5px;
        padding-left: 23px;
        /* display: flex;
        justify-content: flex-start;
        align-items: center; */
        padding: 14px 10px;
    }

    section div{
        line-height: 16px;
        margin-bottom: 8px;
        font-weight: 600;
    }

    section div:last-child{
        font-size: 16px;
        font-weight: 800;
        color: #5398FF;
        cursor: pointer;
    }

    section div span{
        display: inline-block;
        width: 8px;
        height: 12px;
        background: url(${ safetySubmitIcon }) no-repeat center center;
        margin-left: 6px;
    }



    /* mobile test ********************************************************************/

    @media screen and (max-width: 767px){
        display: block;
        width: 100%;
        height: 100%;
        padding: 20px 10px;

        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 22px;
        }

        header button{
            width: 68px;
            height: 32px;
            background: transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;
            border: 1px solid #FFFFFF1A;
            border-radius: 5px;
            letter-spacing: 0.8px;
            color: #FFFFFF;
            font-size: 16px; 
            margin-left: 15px;
            cursor: pointer;
        }

        header h1 {
            font-size: 24px;
            font-weight: bold;
        }

        p{
            font-size: 12px;
        }

        section {
            margin-top: 20px;
            height: 68px;
            background: #EEEEEE 0% 0% no-repeat padding-box;
            border-radius: 5px;
            padding-left: 23px;
            /* display: flex;
            justify-content: flex-start;
            align-items: center; */
            padding: 14px 10px;
        }

        section div{
            line-height: 16px;
            margin-bottom: 8px;
            font-weight: 600;
            font-size: 14px;
        }

        section div:last-child{
            font-size: 16px;
            font-weight: 800;
            color: #5398FF;
        }

        section div span{
            display: inline-block;
            width: 8px;
            height: 12px;
            background: url(${ safetySubmitIcon }) no-repeat center center;
            margin-left: 6px;
        }
    }

`