
import styled from 'styled-components';
import ProjectResource from '../Root/resource/id';

//import '../SDMS/ui/popups/AtmosphereAccordion';
import poiTitle2 from '../Common/image/sdms/poiTitle2_icon.png';
import close_x from '../Common/image/sdms/close_x.png';
import theEntire_active from '../Common/image/sdms/theEntire_active.png';
import theEntire_icon from '../Common/image/sdms/theEntire_icon.png';
import atmos_active from '../Common/image/sdms/atmos_active.png';
import atmos_icon from '../Common/image/sdms/atmos_icon.png';
import water_active from '../Common/image/sdms/water_active.png';
import water_icon from '../Common/image/sdms/water_icon2.png';
import weather_active from '../Common/image/sdms/weather_Active.png';
import weather_icon from '../Common/image/sdms/weather_icon2.png';
import voc_active from '../Common/image/sdms/voc_active.png';
import voc_icon from '../Common/image/sdms/voc_icon.png';
import bacteria_active from '../Common/image/sdms/bacteria_active.png';
import bacteria_icon from '../Common/image/sdms/bacteria_icon2.png';

import titleTri_icon from '../Common/image/sdms/titleTri_icon.png';

import magnifyingGlass from '../Common/image/sdms/magnifying-glass.png';
import eventTitle from '../Common/image/sdms/event_title.png';
import memoIcon from '../Common/image/sdms/memoIcon2.png';
import aArea from '../Common/image/minimap/aArea.png';
import bArea from '../Common/image/minimap/bArea.png';
import cArea from '../Common/image/minimap/cArea.png';
import dArea from '../Common/image/minimap/dArea.png';
import eArea from '../Common/image/minimap/eArea.png';
import moveBtn from '../Common/image/minimap/move_Btn.png';

import dust_icon from '../Common/image/sdms/dust_icon.png';
import o3_icon from '../Common/image/sdms/o3_icon.png';
import so2_icon from '../Common/image/sdms/so2_icon.png';
import popOpen from '../Common/image/sdms/popOpen.png';
import selectDown from '../Common/image/sdms/selectDown.png';

import arrowDown from '../Common/image/sdms/arrowDown.png';
import Icon360Active2 from '../Common/image/sdms/360Icon_active2.png';
import Icon360Active from '../Common/image/sdms/360Icon_active.png';
import Icon360 from '../Common/image/sdms/360Icon.png';
import sensorIcon from '../Common/image/sdms/sensorIcon.png';
import sensorIconDisable from '../Common/image/sdms/sensorIcon_Disable.png';

import temDown from '../Common/image/sdms/temDown.png';
import temUp from '../Common/image/sdms/temUp.png';
import humidity from '../Common/image/sdms/humidity.png';
import barometricPressure from '../Common/image/sdms/barometricPressure.png';
import rainFall from '../Common/image/sdms/rainFall.png';
import solarRadiation from '../Common/image/sdms/solarRadiation.png';
//import barometricPressure from '../Common/image/sdms/barometricPressure.png';
import windDirection from '../Common/image/sdms/windDirection.png';
import windSpeed from '../Common/image/sdms/windSpeed.png';
import vocIconAlarm from '../Common/image/sdms/vocIconAlarm.png';
import vocIconClicked from '../Common/image/sdms/vocIconClicked.png';
import vocIcon from '../Common/image/sdms/vocIcon.png';
import triangle from '../Common/image/sdms/triangle.png';

import miniMapTitle from '../Common/image/sdms/miniMap_title.png';
import networkTitle from '../Common/image/sdms/networkTitle_icon.png';
import cityCloseIcon from '../Common/image/sdms/closeIcon.png';

import StatusTabImage from '../Common/image/sdms/bottomMenubar/sensorPop_active.png';
import StatusTabDisImage from '../Common/image/sdms/bottomMenubar/sensorPop_disable.png';
import EventTabImage from '../Common/image/sdms/bottomMenubar/eventPop_active.png'
import EventTabDisImage from '../Common/image/sdms/bottomMenubar/eventPop_disable.png'
import DataTabImage from '../Common/image/sdms/bottomMenubar/network_active.png'
import DataTabDisImage from '../Common/image/sdms/bottomMenubar/network_disable.png'
import DetailTabImage from '../Common/image/sdms/bottomMenubar/simulator_active.png'
import DetailTabDisImage from '../Common/image/sdms/bottomMenubar/simulator_disable.png'
import MiniTabImage from '../Common/image/sdms/bottomMenubar/miniPop2_active.png'
import MiniTabDisImage from '../Common/image/sdms/bottomMenubar/miniPop2_disable.png'
import NavTabImage from '../Common/image/sdms/bottomMenubar/navigation2_active.png'
import NavTabDisImage from '../Common/image/sdms/bottomMenubar/navigation2_disable.png'





//관제화면 팝업창 공용
export const CommonComponent = styled.div` 
    display: block;

    .sensorDslTop{
        position: relative;
        padding: 15px 15px 0px 15px;
        display: flex;
        align-items: center;
        -webkit-border-radius: 10px 10px 0px 0px;
        -moz-border-radius: 10px 10px 0px 0px;
        border-radius: 10px 10px 0px 0px;
        background-color: ${(props) => props.theme.backgroundColor};
    }
    .sensorTitleIcon{
        display: inline-block;
        width: 14px;
        height: 19px;
        background: url(${poiTitle2}) no-repeat center center;
    }
    .sensorTitle{
        display: inline-block;
        color: ${(props) => props.theme.mainColor};
        font-size: 16px;
        font-family:  'Pretendard';
        font-weight: 600;
        padding-left: 11px;
    }
    .seosorCloseIcon{
        display: block;
        width: 17px;
        height: 16px;
        background: url(${close_x}) no-repeat center center;
        background-size: 14px;
        /* z-index: 1; */
        z-index: 2;
        cursor: pointer;
        /* position: absolute;
        right: 10px; */
    }
    .contentPaddingBox{
        display: block;
        padding: 0px 15px 15px 15px;
        background-color: ${(props) => props.theme.backgroundColor};
        -webkit-border-radius: 0px 0px 10px 10px;
        -moz-border-radius: 0px 0px 10px 10px;
        border-radius: 0px 0px 10px 10px;
        height: calc(100% - 34px);
    }
`;


//센서정보창
export const StatusInfoComponent = styled(CommonComponent)`
    display: block;
    position:absolute;
    left:1.4%;
    top:22%;
    min-width:326px !important;
    /* min-height: 440px; */
    min-height: 390px;
    box-sizing:border-box;

    .sensorIconBox{
        display: flex;
        width: 100%;
        height: 42px;
        margin: 16px 0px 10px 0px;
    }
    .entire{
        display: inline-block;
        width: 40px;
        height: 30px;
        background: url(${theEntire_active}) no-repeat center center;
        margin-right: 9px;
    }
    .entireDis{
        display: inline-block;
        width: 41px;
        height: 30px;
        background: url(${theEntire_icon}) no-repeat center center;
        margin-right: 9px;
    }
    .atmosphere{
        display: inline-block;
        width: 41px;
        height: 30px;
        background: url(${atmos_active}) no-repeat center center;
        margin-right: 9px;
    }
    .atmosphereDis{
        display: inline-block;
        width: 41px;
        height: 30px;
        background: url(${atmos_icon}) no-repeat center center;
        margin-right: 9px;
     }
     .waterQuality{
        display: inline-block;
        width: 41px;
        height: 30px;
        background: url(${water_active}) no-repeat center center;
        margin-right: 9px;
     }
     .waterQualityDis{
        display: inline-block;
        width: 41px;
        height: 30px;
        background: url(${water_icon}) no-repeat center center;
        margin-right: 9px;
     }
     .weather{
        display: inline-block;
        width: 41px;
        height: 30px;
        background: url(${weather_active}) no-repeat center center;
        margin-right:9px;
     }
     .weatherDis{
        display: inline-block;
        width: 41px;
        height: 30px;
        background: url(${weather_icon}) no-repeat center center;
        margin-right:9px;
     }
     .voc{
        display: inline-block;
        width: 41px;
        height: 30px;
        background: url(${voc_active}) no-repeat center center;
        margin-right:9px;
     }
     .vocDis{
        display: inline-block;
        width: 41px;
        height: 30px;
        background: url(${voc_icon}) no-repeat center center;
        margin-right:9px;
     }
     .bacteria{
        display: inline-block;
        width: 41px;
        height: 30px;
        background: url(${bacteria_active}) no-repeat center center;
        margin-right: 9px;
     }
     .bacteriaDis{
        display: inline-block;
        width: 41px;
        height: 30px;
        background: url(${bacteria_icon}) no-repeat center center;
        margin-right: 9px;
     }

     .sensorSearchBox{
        display: flex;
        width: 100%;
        height: 34px;
        background: ${(props) => props.theme.blackColor};
        color: #fff;
        border-radius: 5px;
        opacity: 0.4;
        margin-bottom: 10.5px;

        > input[type="text"]{
            width: 339px;
            background: none;
            border:none;
            font-size: 12px;
            height: 34px;
            line-height: 34px;
            color: #fff !important;
            font-family: 'Pretendard';
            font-weight: '600';
        }
        > input[type="text"]::placeholder{
            color: #fff;
            font-size: 12px;
        }
     }
     .searchIcon{
        display: inline-block;
        width: 34px;
        height: 34px;
        background: url(${magnifyingGlass}) no-repeat center center;
        background-size: 16px;
        float: right;
     }

`;

//대기 상태바
export const AtmosphereAccordionComponent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 5px;
    height: auto;
    /* padding: 2%; */
    transition: all 0.5s ease-in-out;
    color: #fff;
    /* width: 343px; */
    border:solid 1px #FFFFFF7D;
    margin-bottom:10px;

    .sensorForm{
       display: flex;
       height: 34px;
       padding: 0px 12px;
       color: #fff;
       line-height: 34px;
       display: flex;
       font-size:12px;
       font-family: Pretendard;
       align-items: center;
       cursor: pointer;
    }

    .sensorForm > span{
       flex: 1 1;
       font-size: 12px;
    }

    .sensorNum{
       background-color: #000000;
       width: 38px;
       height: 18px;
       color: #fff;
       line-height: 18px;
       border-radius: 20px;
       font-size:10px;
       font-family: Pretendard;
       font-weight: '400';
       text-align: center;
       margin-right: 10px;
    }
    .arrowUpIcon{
       display: inline-block;
       width: 21px;
       height: 21px;
       background: url(${arrowDown}) no-repeat center center;
       background-position: center center;
       background-size: 12px;
       float:right;
    }
    .arrowDownIcon{
       display: inline-block;
       width: 21px;
       height: 21px;
       transform: rotate(180deg);
       background: url(${arrowDown}) no-repeat center center;
       background-size: 12px;
       float:right;
    }

    .C360IconAlarm{
       display: inline-block;
       width: 20px;
       height: 15px;
       background: url(${Icon360Active2}) no-repeat center center;
       background-size: 14px;
       background-position: center;
       margin-right: 10px;
     }
     .C360IconAct{
        display: inline-block;
        width: 20px;
        height: 15px;
        background: url(${Icon360Active}) no-repeat center center;
        background-size: 14px;
        background-position: center;
        margin-right: 10px;
     }
     .C360Icon{
        display: inline-block;
        width: 20px;
        height: 15px;
        background: url(${Icon360}) no-repeat center center;
        background-size: 14px;
        background-position: center;
        margin-right: 10px;
     }
     .sensorIconActive{
        display: inline-block;
        width: 22px;
        height: 21px;
        background: url(${sensorIcon}) no-repeat center center;
        background-size: 100%;
        margin-right: 6px;
     }
     .sensorIconDisable{
        display: inline-block;
        width: 22px;
        height: 21px;
        background: url(${sensorIconDisable}) no-repeat center center;
        background-size: 100%;
        float:right;
        margin-right: 6px;
     }
     .redCircle{
        display: inline-block;
        width: 10px;
        height: 8px;
        background-color: #FF5A5A;
        border-radius: 50%;
        margin-right: 5px;
     }
     .grayCircle{
        display: inline-block;
        width: 10px;
        height: 8px;
        background-color: #808080;
        border-radius: 50%;
        margin-right: 5px;
     }
     .blueCircle{
        display: inline-block;
        width: 10px;
        height: 8px;
        background-color: ${(props) => props.theme.mainColor};
        border-radius: 50%;
        margin-right: 5px;
     }
`;

//대기 슬라이드
export const AtmosphereWrapper = styled.div`
    width: 100%;
    max-height: ${(props) => (props.$open ? '108px' : '0')};
    transition: all 0.5s ease-in-out;
    /* background-color: #4d4d4d6e; */
    /* overflow: hidden; */
    overflow-y:scroll;

    &::-webkit-scrollbar {
        width: 2px;
        border-radius: 2px;
        background-color: #666666;
    }
    &::-webkit-scrollbar-thumb {
        width: 2px;
        border-radius: 2px;
        background: #ffffff; /* #19A5FF; */   /* 0105 */
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
    color: #fff;
    > div {
        display:flex;
        width:100%;
        height: 36px;
        line-height: 36px;
        font-size: 12px;
        font-family: 'Pretendard';
        font-weight: 100;
        text-align: left;
        /* background-color: #4d4d4d6e; */
        padding-left: 10px;
        margin:0;
        border-bottom: 0.5px dashed #666666;
        align-items: center;
        padding-right: 14px;
        cursor: pointer;
    }
    > div.activeBack{
        background: #4d4d4d6e;
    }
    > div > span{
        /* margin-right: 80px; */
        width: 100%;
        font-family: 'Pretendard';
        font-weight: 300;
        font-size: 12px;
    }
    > div > span.activeRed{
        /* color:#19A5FF; */
        color: #FF5A5A;
        font-family: 'Pretendard';
        font-weight: 300;
    }
    > div > span.activeBlue{
        color: #19A5FF;
        font-family: 'Pretendard';
        font-weight: 300;
    }
    > div > p{
        font-size: 12px;
    }
    > div:hover{
        background-color: #4d4d4d6e;
    }

`;

//대기 상세정보창
export const AtmospherePopupComponent = styled(CommonComponent)`
      display: block;
      position:absolute;
      left:21%;
      top:17%;
      width:374px;
      /* height:280px; */
      box-sizing:border-box;

     .sensorInfoDetailBox{
        display: block;
        /* width: 373px;
        height: 249px; */
        background: rgba(26,26,26,0.9);
        border-radius:10px;
        padding: 15px;
        backdrop-filter: blur(3px);
        -webkit-backdrop-filter: blur(3px);
        height: 100%;
     }

     .sensorInfoTitleBox{
        display: flex;
        justify-content: space-between;
        padding-bottom: 20px;

        position: relative;
        padding: 15px 15px 0px 15px;
        display: flex;
        align-items: center;
        -webkit-border-radius: 10px 10px 0px 0px;
        -moz-border-radius: 10px 10px 0px 0px;
        border-radius: 10px 10px 0px 0px;
        /* background-color: rgba(255, 255, 255, 0.1); */
        background-color: rgba(26,26,26,0.9);

      }

     .sensorInfoDetailTitle{
        display: flex;
        align-items: center;
      }

     .sensorDetailTitle{
        display: inline-block;
        color: ${(props) => props.theme.mainColor};
        font-size: 16px;
        font-family:  'Pretendard';
        font-weight: 600;
        padding-left: 11px;
        letter-spacing: -1px;
      }

      .sensorInfoTitleSecond{
         display: flex;
         align-items: center;
       }

      .referenceTime{
        display: inline-block;
        /* width: 69px; */
        height: 13px;
        color: #808080;
        font-size: 11px;
        font-family: Pretendard;
        margin-right: 8px;
     }

     .sensorInfoContents{
         background-color: rgba(26,26,26,0.9);
         border-radius: 0px 0px 10px 10px;
         padding: 15px;
         height: calc(100% - 43px);
     }

     .sensorInfoSecondBox{
         display: flex;
         align-items: center;
         margin-bottom: 6px;
     }

     .titleTriIcon{
        display: inline-block;
        width: 12px;
        height: 21px;
        /* background: url(./../../resource/image/sdms/titleTri_icon.png) no-repeat left center; */
        background: url(${titleTri_icon}) no-repeat center center;
     }
    .sensorTitleA{
        display: inline-block;
        /* width: 50px; */
        color: #fff;
        font-size: 12px;
        margin-right: calc(100% - 130px);
     }
     .weatherInfoBtn{
        display: inline-block;
        width: 50px;
        height: 19px;
        color: #FFFFFF;
        background: ${(props) => props.theme.mainColor};
        border-radius: 5px;
        line-height: 19px;
        font-size: 10px;
        text-align: center;
        float: right;
        cursor: pointer;
     }

     .sensorInfoThirdBox{
         .sensorNameA{
            display: inline-block;
            height: 14px;
            color: #FFFFFF;
            font-size: 16px;
            margin-right: 10px;
            font-family: Pretendard;
         }
         .divideLine{
            display: inline-block;
            width: 2px;
            height: 14px;
            background: #808080;
         }
         .sensorAddress{
            display: inline-block;
            height: 16px;
            color: #FFFFFF;
            font-size: 16px;
            font-family: Pretendard;
            margin: 0px 10px 0px 10px;
         }
     }

     .sensorItemBox{
        display: block;
        /* width: 344px;
        height: 141px; */
        background: #4d4d4d54;
        width: 100%;
        border-radius: 5px;
        margin-top: 20px;
        font-size: 12px;
     
        > table{
           width: 100%;
           color: #ffffff;
        }
        > table .itemBoxTrLine{
           /* display: block; */
           width: 100%;
           height: 34px;
           lineHeight: 34px;
           padding-left: 13px;
           color: #d7d7d7;
           border-bottom: solid 1px #d7d7d7;
        }
        > table .itemBoxTr{
           height: 34px;
           padding-left: 13px;
           color: #d7d7d7;
           line-height: 34px;
           border-bottom: 0.5px dashed #666666;
        }
        > table .itemBoxTr:last-child{
           height: 34px;
           padding-left: 13px;
           color: #d7d7d7;
           line-height: 34px;
           border: none;
        }
        > table .itemBoxTh{
           font-size: 11px;
           font-family: Pretendard;
           color: #808080;
           /* width: 200px; */
           text-align: left;
           padding-left: 13px;
           line-height: 34px;
        }
        > table .itemBoxTd1{
           width: 300px;
           text-align: left;
           padding-left: 13px;
           color: #ffffff;
           font-size: 11px;
           font-family: Pretendard;
           line-height: 34px;
        }
        > table .itemBoxTd2{
            text-align: left;
            padding-left: 13px;
            color: #ffffff;
            font-size: 11px;
            font-family: Pretendard;
            line-height: 34px;
         }
         > table .itemBoxTd3{
            /* width: 120px; */
            text-align: left;
            /* padding-left: 13px; */
            color: #ffffff;
            font-size: 11px;
            font-family: Pretendard;
            line-height: 34px;
            vertical-align: middle;
            padding-right: 5px;
         }
         > table .itemBoxTd1.active{
            color: #FF5A5A;
         }
         > table .itemBoxTd2.active{
            color: #FF5A5A;
         }
        
     }
`;

//수질 상태바
export const WaterQualityAccordionComponent = styled(AtmosphereAccordionComponent)`


`;
//수질 슬라이드
export const WaterQualityWrapper = styled(AtmosphereWrapper)`


`;
//수질 상세정보창
export const WaterQualityPopupComponent = styled(AtmospherePopupComponent)`
     position:absolute;
     left:21%;
     top:42%;
     width:373px;
     height:356px;
     box-sizing:border-box;

    .sensorInfoDetailBox{
        display: block;
        height: 100%;
        background: rgba(26,26,26,0.9);
        border-radius:10px;
        padding: 15px;
        backdrop-filter: blur(3px);
        -webkit-backdrop-filter: blur(3px);
     }
     .sensorInfoTitleBoxw{
        display: flex;
        justify-content: space-between;
        padding-bottom: 20px;

        position: relative;
        padding: 15px 15px 0px 15px;
        display: flex;
        align-items: center;
        -webkit-border-radius: 10px 10px 0px 0px;
        -moz-border-radius: 10px 10px 0px 0px;
        border-radius: 10px 10px 0px 0px;
        background-color: rgba(26,26,26,0.9);
     }
     .sensorInfoDetailTitlew{
        display: flex;
        align-items: center;
     }
    .sensorTitleW{
        display: inline-block;
        /* width: 50px; */
        color: #fff;
        font-size: 12px;
        font-family:  'Pretendard';
        margin-right: calc(100% - 164px);
        letter-spacing: -1px;
     }

     .sensorInfoContentsWater{
         background-color: rgba(26,26,26,0.9);
         border-radius: 0px 0px 10px 10px;
         padding: 15px;
         height: calc(100% - 43px);
     }
`;

//기상 상태바
export const WeatherAccordionComponent = styled(AtmosphereAccordionComponent)`

`;
//기상 슬라이드
export const WeatherWrapper = styled(AtmosphereWrapper)`

`;
//기상 상세정보창
export const WeatherPopupComponent = styled(AtmospherePopupComponent)`
     position:absolute;
     left:41%;
     top:13%;
     width:373px;
     height:502px;
     box-sizing:border-box;

    .sensorInfoTitleBoxW{
       display: flex;
       justify-content: space-between;
       padding-bottom: 20px;

       position: relative;
       padding: 15px 15px 0px 15px;
       display: flex;
       align-items: center;
       -webkit-border-radius: 10px 10px 0px 0px;
       -moz-border-radius: 10px 10px 0px 0px;
       border-radius: 10px 10px 0px 0px;
       background-color: rgba(26,26,26,0.9);
    }
    .sensorInfoDetailTitleW{
       display: flex;
       align-items: center;
    }
    .sensorInfoTitleSecondW{
       display: flex;
       align-items: center;
    }

    .sensorInfoContentsWeather{
       background-color: rgba(26,26,26,0.9);
       border-radius: 0px 0px 10px 10px;
       padding: 15px;
       height: calc(100% - 43px);
    }
    .sensorTitleWW{
        display: inline-block;
        /* width: 50px; */
        color: #fff;
        font-size: 12px;
        font-family:  'Pretendard';
        margin-right: calc(100% - 164px);
        letter-spacing: -1px;
     }

     .weatherDayBox{
         display: block;
      }
     .dayBox{
         display: flex;
         width: 343px;
         height: 100px;
      }
     .dayNumArea{
        display: inline-flex;
        width: 100px;
        height: 30px;
        text-align: center;
        flex-direction: column;
        align-self: center;
        flex-grow: 1;
        font-family: Pretendard;
     }

     .dayYear{
        color:#ffffff;
        font-size: 16px;
        font-family: Pretendard;
        margin-bottom: 10px;
     }
     .dayTime{
        color:#ffffff;
        font-family: Pretendard;
        font-size: 13px;
     }
     .weatherImage {
        width: 70px;
        height: 50px;
        background-size: contain;
        object-fit: contain;
        margin: auto;
    }
    .temperatureArea{
        display: inline-block;
        /* width: 100%; */
        text-align:center;
        align-self:center;
        flex-grow: 1;
     }
     .temBox{
        display: inline-block;
        width: 87px;
        /* height: 13px; */
        background: #7D7D7D7a;
        border-radius: 7px;
        text-align:center;
        line-height: 13px;
        margin-bottom: 10px;
     }
    .temInfoText1{
       display:inline-block;
       font-size: 9px;
       color: #19A5FF;
       font-family: Pretendard;
       font-weight: 800;
       margin-right: 13px;
    }
    .temInfoText2{
       display:inline-block;
       font-size: 9px;
       color: #FF5A5A;
       font-family: Pretendard;
       font-weight: 800;
    }
    .temDownIcon{
       display: inline-block;
       width: 6px;
       height: 5px;
       background: url(${temDown}) no-repeat center center;
       margin-right: 6px;
       margin-bottom: 1.5px;
    }
    .temUpIcon{
       display: inline-block;
       width: 6px;
       height: 5px;
       background: url(${temUp}) no-repeat center center;
       margin-right: 6px;
       margin-bottom: 1.5px;
     }
     .temNum{
        display: block;
        /* width: 55px; */
        height: 30px;
        font-size: 24px;
        font-weight: 800;
        color: #fff;
     }
     .weatherIconArea{
        display: block;
        height: 80px;
     }
    .humidityBox{
        display: inline-flex;
        width: 48px;
        height: 80px;
        flex-direction: column;
        border:solid 1px #808080;
        margin-right: 10px;
        border-radius: 3px;
        text-align:center;
        padding: 10px 0px;
        cursor: pointer;

        &:hover{
          background-color: #4D4D4D;
          border:none;
        }
        &:active{
          background-color: #4D4D4D;
          border:none;
        }
        /* > span{
          color: #ffffff;
          font-size: 11px;
          font-family: Pretendard;
          padding: 6px 0px 14px 0px;
        } */
        > p{
          color:#19A5FF;
          font-size: 11px;
          font-family: Pretendard;
        }
        &.abc{
          background: #4d4d4d6e;
          border: none;
        }
    }
    .humidityIcon{
        display: inline-block;
        /* width: 17px; */
        height: 12px;
        background: url(${humidity}) no-repeat center center;
        background-position: center center;
        /* padding: 10px 0px 5px 0px; */
        padding: 6px 0px 14px 0px;
    }
    .humidityText{
        display: block;
        height: 46px;
        line-height: 23px;
        font-size: 11px;
        font-family: Pretendard;
    }
    .barometricPressureBox{
        display: inline-flex;
        width: 48px;
        height: 80px;
        flex-direction: column;
        border:solid 1px #808080;
        margin-right: 10px;
        border-radius: 3px;
        text-align:center;
        padding: 10px 0px;
        cursor: pointer;
        &:hover{
          background-color: #4D4D4D;
          //border:none;
          border: solid 1px #4D4D4D;
        }
        /* > span {
            color: #ffffff;
            font-size: 11px;
            font-family: Pretendard;
            padding: 6px 0px 14px 0px;
        } */
        > p{
            height: auto;
            color:#19A5FF;
            font-size: 11px;
            font-family: Pretendard;
        }
    }
    .barometricPressureIcon{
        display: inline-block;
        /* width: 17px; */
        height: 12px;
        background: url(${barometricPressure}) no-repeat center center;
        background-position: center center;
        /* padding: 10px 0px 5px 0px; */
        padding: 6px 0px 14px 0px;
    }
    .barometricPressureText{
        display: block;
        height: 46px;
        line-height: 23px;
        font-size: 11px;
        font-family: Pretendard;
    }
    .pressureText{
        display: block;
        width: 100%;
        color: #19A5FF;
        font-size: 11px;
        padding: 0px 5px;
        > p {
           display: inline-block;
           font-size: 11px;
           color: #19A5FF;
        }
    }
    .rainfallBox{
        display: inline-flex;
        width: 48px;
        height: 80px;
        flex-direction: column;
        border:solid 1px #808080;
        margin-right: 10px;
        border-radius: 3px;
        text-align:center;
        padding: 10px 0px;
        cursor: pointer;

        &:hover{
          background-color: #4D4D4D;
          border:none;
        }
        /* > span{
            color: #ffffff;
            font-size: 11px;
            font-family: Pretendard;
            padding: 6px 0px 14px 0px;
        } */
        > p{
            color:#19A5FF;
            font-size: 11px;
            font-family: Pretendard;
        }
     }
     .rainfallIcon{
        display: inline-block;
        /* width: 17px; */
        height: 12px;
        background: url(${rainFall}) no-repeat center center;
        background-position: center center;
        /* padding: 10px 0px 5px 0px; */
        padding: 6px 0px 14px 0px;
     }
     .rainfallText{
        display: block;
        height: 46px;
        line-height: 23px;
        font-size: 11px;
        font-family: Pretendard;
     }
    .solarRadiationBox{
        display: inline-flex;
        width: 48px;
        height: 80px;
        flex-direction: column;
        border:solid 1px #808080;
        margin-right: 10px;
        border-radius: 3px;
        text-align:center;
        padding: 10px 0px;
        cursor: pointer;
        &:hover{
          background-color: #4D4D4D;
          border:none;
        }
        /* > span{
           color: #ffffff;
           font-size: 11px;
           font-family: Pretendard;
           padding: 6px 0px 14px 0px;
        } */
        > p{
            height: auto;
            color:#19A5FF;
            font-size: 11px;
            font-family: Pretendard;
        }
    }
    .solarRadiationIcon{
        display: inline-block;
        /* width: 17px; */
        height: 12px;
        background: url(${solarRadiation}) no-repeat center center;
        background-position: center center;
        /* padding: 10px 0px 5px 0px; */
        padding: 6px 0px 14px 0px;
    }
    .solarRadiationText{
        display: block;
        height: 46px;
        line-height: 23px;
        font-size: 11px;
        font-family: Pretendard;
    }
    .windDirectionBox{
        display: inline-flex;
        width: 48px;
        height: 80px;
        flex-direction: column;
        border:solid 1px #808080;
        margin-right: 10px;
        border-radius: 3px;
        text-align:center;
        padding: 10px 0px;
        position: relative;
        cursor: pointer;

        &:hover{
          background-color: #4D4D4D;
          border:none;
        }
        /* > span{
           color: #ffffff;
           font-size: 11px;
           padding: 6px 0px 14px 0px;
           font-family: Pretendard;
        } */
        > p{
            height: auto;
            color:#19A5FF;
            font-size: 11px;
            font-family: Pretendard;
        }
    }

   .windDirectionMIcon{
       display: inline-block;
       /* width: 17px; */
       height: 12px;
       background: url(${barometricPressure}) no-repeat center center;
       background-position: center center;
       /* padding: 10px 0px 5px 0px; */
       padding: 6px 0px 14px 0px;
   }
   .windDirectionIcon{
       display: inline-block;
       width: 10px;
       height: 7px;
       background: url(${windDirection}) no-repeat center center;
   }
   .windDirectionText{
       display: block;
       height: 46px;
       line-height: 23px;
       font-size: 11px;
       font-family: Pretendard;
   }

   .windSpeedBox{
       display: inline-flex;
       width: 48px;
       height: 80px;
       flex-direction: column;
       border:solid 1px #808080;
       border-radius: 3px;
       text-align: center;
       padding: 10px 0px;
       cursor: pointer;

       &:hover{
          background-color: #4D4D4D;
          border:none;
       }
       /* > span{
          color: #ffffff;
          font-size: 11px;
          font-family: Pretendard;
          padding: 6px 0px 14px 0px;
       } */
       > p{
          height: auto;
          color:#19A5FF;
          font-size: 11px;
          font-family: Pretendard;
       }
   }
   .windSpeedIcon{
       display: inline-block;
       /* width: 17px; */
       height: 12px;
       background: url(${windSpeed}) no-repeat center center;
       padding: 6px 0px 14px 0px;
    }
   .windSpeedText{
       display: block;
       height: 46px;
       line-height: 23px;
       font-size: 11px;
       font-family: Pretendard;
   }
 
`;
//기상 미니팝업창
export const WeatherMiniPopComponent = styled.div`
     display: block;     

    .weatherTri{
        display: inline-block;
        /* width: 8px;
        height: 14px; */
        background: rgba(26,26,26,0.8);
        position: relative;

        &::after{
            content: '';
            position: absolute;
            right: -36px;
            top: 22%;
            margin-top: -10px;
            border-top: 8px solid transparent;
            border-right: 12px solid transparent;
            border-bottom: 8px solid transparent;
            border-left: 12px solid rgba(26,26,26,0.8);
            /* rotate: 180deg; */
            transform: rotate(180deg);
        }
    }
    .weatherInfoPop{
        display: block;
        width: 170px;
        /* height: 132px; */
        background: rgba(26,26,26,0.8);
        border-radius: 10px;
        padding: 10px;
    }
    .weatherMiniBox{
        display: block;
        width: 70px;
        /* height: 66px; */ 
        /* background: rgba(26,26,26,0.8); */
        border-radius: 10px;
        color: #ffffff;
        margin-right: 10px;

        > p{
          font-family: Pretendard;
          font-size: 11px;
          margin: 0;
        }
        > span{
          display: inline-block;
          width: 70px;
          height: 33px;
          line-height: 33px;
          font-family: Pretendard;
          font-size: 11px;
          color: #19A5FF;
          border-radius: 5px;
          /* background: rgba(26,26,26,0.8); */
          background: #6b6b6b6e;
          text-align: center;
          margin-top:5px;
        }
    }
`;
//기상 미니팝업창(VOC) 
export const WeatherMiniPopVOCComponent = styled(WeatherMiniPopComponent)`
     display: block;     

    .weatherTri{
        display: inline-block;
        /* width: 8px;
        height: 14px; */
        background: rgba(26,26,26,0.8);
        position: relative;

        &::after{
            content: '';
            position: absolute;
            right: -36px;
            top: 22%;
            margin-top: -10px;
            border-top: 8px solid transparent;
            border-right: 12px solid transparent;
            border-bottom: 8px solid transparent;
            border-left: 12px solid rgba(26,26,26,0.8);
            /* rotate: 180deg; */
            transform: rotate(180deg);
        }
    }
    .weatherInfoPop{
        display: block;
        width: 170px;
        /* height: 132px; */
        background: rgba(26,26,26,0.8);
        border-radius: 10px;
        padding: 10px;
    }
    .weatherMiniBox{
        display: block;
        width: 70px;
        /* height: 66px; */ 
        /* background: rgba(26,26,26,0.8); */
        border-radius: 10px;
        color: #ffffff;
        margin-right: 10px;

        > p{
          font-family: Pretendard;
          font-size: 11px;
          margin: 0;
        }
        > span{
          display: inline-block;
          width: 70px;
          height: 33px;
          line-height: 33px;
          font-family: Pretendard;
          font-size: 11px;
          color: #19A5FF;
          border-radius: 5px;
          /* background: rgba(26,26,26,0.8); */
          background: #6b6b6b6e;
          text-align: center;
          margin-top:5px;
        }
    }
`;

//VOC 상태바
export const VOCAccordionComponent = styled(AtmosphereAccordionComponent)`

`;
//VOC 슬라이드
export const VOCWrapper = styled(AtmosphereWrapper)`

   .VOCSIconAlarm{
        display: inline-block;
        width: 20px;
        height: 15px;
        /* background: 'url("./../../resource/image/sdms/vocIconAlarm.png")no-repeat center center', */
        background: url(${vocIconAlarm}) no-repeat center center;
        background-size: 14px;
        background-position: center;
        margin-right: 10px;
    }
    .VOCSIconAct{
        display: inline-block;
        width: 20px;
        height: 15px;
        /* imgBackground: 'url("./../../resource/image/sdms/vocIconClicked.png")no-repeat center center', */
        background: url(${vocIconClicked}) no-repeat center center;
        background-size: 14px;
        background-position: center;
        margin-right: 10px;
    }
    .VOCSIcon{
        display: inline-block;
        width: 20px;
        height: 15px;
        /* imgBackground: 'url("./../../resource/image/sdms/vocIcon.png")no-repeat center center', */
        background: url(${vocIcon}) no-repeat center center;
        background-size: 14px;
        background-position: center;
        margin-right: 10px;
    }

`;
//VOC 상세정보창
export const VOCInfoPopupComponent = styled(AtmospherePopupComponent)`


`;
//VOC 상세정보창(현재 사용중)
export const VOCDetailInfoPopupComponent = styled(AtmospherePopupComponent)`
   position:absolute;
   left:68%;
   top:7%;
   width:417px;
   height:640px;
   box-sizing:border-box;

   .sensorInfoTitleBoxV{
      display: flex;
      justify-content: space-between;

      padding-bottom: 20px;
      position: relative;
      padding: 15px 15px 0px 15px;
      display: flex;
      align-items: center;
      -webkit-border-radius: 10px 10px 0px 0px;
      -moz-border-radius: 10px 10px 0px 0px;
      border-radius: 10px 10px 0px 0px;
      /* background-color: rgba(255, 255, 255, 0.1); */
      background-color: rgba(26,26,26,0.9);
   }
   .sensorInfoDetailTitleV{
       display: flex;
       align-items: center;
   }
   .sensorInfoTitleSecondV{
       display: flex;
       align-items: center;
   }

   .sensorDetailTitleVOC{
        display: inline-block;
        color: #19A5FF;
        font-size: 16px;
        font-family:  'Pretendard';
        font-weight: 600;
        padding-left: 11px;
        letter-spacing: -1px;
   }
   .measurementTime{
       color: #B3B3B3;
       font-size: 11px;
       letter-spacing: 0.55px;
       position: relative;
       right: 0px;
       margin-right: 10px !important;
   }
   .contentPaddingBoxVOC{
        display: block;
        padding: 0px 15px 0px 15px;
        -webkit-border-radius: 0px 0px 10px 10px;
        -moz-border-radius: 0px 0px 10px 10px;
        border-radius: 0px 0px 10px 10px;
        position: relative;
        height: calc(100% - 34px);

        background-color: rgba(26,26,26,0.9);
        /* border-radius: 0px 0px 10px 10px;
        padding: 15px;
        height: calc(100% - 43px); */
   }
    .triangleShape{
        display: inline-block;
        width: 6px;
        height: 7px;
        /* background: url(./../../resource/image/sdms/triangle.png)no-repeat center center; */
        background: url(${triangle}) no-repeat center center;
        position: absolute;
        left: 16px;
        top: 28px;
    }

   /* .sensorTitleVOC{
        display: inline-block;
        color: #ffffff;
        font-size: 14px;
        font-family:  'Pretendard';
        font-weight: 400;
        letter-spacing: 0.7px;
        margin-right: calc(100% - 100px);
    } */

   .weatherInfoVOCBtn{
        display:inline-block;
        width: 66px;
        height: 24px;
        color: #ffffff;
        background: #19A5FF;
        border-radius: 5px;
        line-height: 24px;
        font-size: 14px;
        font-weight: 400;
        text-align: center;
        letter-spacing: 0.7px;
        float: right;
        margin-left: 6px;
        cursor: pointer;
   }
   .VOCLocation{
        margin-bottom: 12px;
        letter-spacing: 0.6px;

        > span:nth-child(1){
           font-size: 15px;
           color: #FFFFFF;
           margin-right: 4px;
        }
        > span:nth-child(2){
           font-size: 15px;
           color: #FFFFFF;
        }
    }
   .sensorSearchBoxVOC{
         display: flex;
         width: 100%;
         height: 34px;
         background: #000000;
         color: #fff;
         border-radius: 5px;
         opacity: 0.4;
         margin-bottom: 10.5px;

         > input[type="text"]{
            width: 339px;
            background: none;
            border:none;
            font-size: 12px;
            height: 34px;
            line-height: 34px;
            color: #fff !important;
            font-family: 'Pretendard';
            font-weight: 200;
         }
         > input[type="text"]::placeholder{
            color: #fff;
            font-size: 12px;
        }
    }
    .searchIcon{
        display: inline-block;
        width: 34px;
        height: 34px;
        background: url(${magnifyingGlass}) no-repeat center center;
        background-size: 16px;
    }

    .VOCTable{
        display: inline-block;
        height: 450px;
        color: #fff;
        font-size: 11px;
        background: #333333;
        border-radius: 5px;
        overflow-y: auto;

        .titleTrLine{
            height: 33px;
            line-height: 33px;
            border-bottom: solid 1px #4d4d4d;
            text-align: left;
            font-size: 11px;
            font-family: 'Pretendard';
        }
        .titleTrLine > th{
            padding: 0px 16px;
            letter-spacing: 0.55px;
            color: #BBBBBB;
        }
        .contentTrLine{
            height: 33px;
            line-height: 33px;
            border-bottom: dashed 1px #4D4D4D;
            text-align: left;
        }
        .contentTrLine > td{
            padding: 0px 16px;
            letter-spacing: 0.55px;
            color: #FFFFFF;
            font-size: 11px;
        }
        .redText{
            color: #FF5A5A;
        }

        &::-webkit-scrollbar {
            width: 3px;
            border-radius: 3px;
            background-color: #4D4D4D;
        }
        &::-webkit-scrollbar-thumb {
            width: 3px;
            border-radius: 3px;
            background: #19A5FF;
        }
        &::-webkit-scrollbar-button{
            width: 0px;
            height: 0px;
        }
    }
`;

//악취 상태바
export const BacteriaAccordionComponent = styled(AtmosphereAccordionComponent)`

`;
//악취 슬라이드
export const BacteriaWrapper = styled(AtmosphereWrapper)`

`;


//이벤트정보창
export const EventInfoComponent = styled(AtmospherePopupComponent)`
      /* min-height: 500px; */

     .sensorInfoTitleBoxE{
        display: flex;
        justify-content: space-between;
        border-radius: 10px 10px 0px 0px;
        background-color: ${(props) => props.theme.backgroundColor};
     }

      .sensorDslTopE{
        position: relative;
        padding: 15px 15px 0px 15px;
        display: flex;
        align-items: center;
        -webkit-border-radius: 10px 10px 0px 0px;
        -moz-border-radius: 10px 10px 0px 0px;
        /* border-radius: 10px 10px 0px 0px;
        background-color: ${(props) => props.theme.backgroundColor}; */
      }

     .sensorInfoDetailTitle{
        display: flex;
        align-items: center;
     }
     .sensorInfoTitleSecondE{
        display: flex;
        align-items: center;
        padding: 15px 15px 0px;
     }

     .eventTitleIcon{
        display: inline-block;
        width: 19px;
        height: 21px;
        background: url(${eventTitle}) no-repeat center center;
     }
     .sensorTitleE{
        display: inline-block;
        /* width: 50px; */
        color: ${(props) => props.theme.mainColor};
        font-size: 16px;
        font-family:  'Pretendard';
        font-weight: 600;
        padding-left: 11px;
     }

     .alarmToolBox [data-tooltip] {
        position: relative;
        z-index: 2;
        /* right: 10px; */
        right: 4px;
     }
    .alarmToolBox [data-tooltip]:before,
    .alarmToolBox [data-tooltip]:after {
        visibility: hidden;
        -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
        filter: progid: DXImageTransform.Microsoft.Alpha(Opacity=0);
        opacity: 0;
        pointer-events: none;
    }
    .alarmToolBox [data-tooltip]:before {
	    position: absolute;
        /* top: -160%; */
        top: -110%;
        left: -80%;
        margin-top: -6px;
        margin-left: 6px;
        padding: 4px 10px;
        white-space: nowrap;
	    -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 2px;
        font-family: 'Pretendard';
        background-color: #008BE5;
        color: #FFF;
        font-size: 11px;
        font-weight:600;
        content: attr(data-tooltip);
        text-align: center;
        line-height: 1.2;
    }
    .alarmToolBox [data-tooltip]:after {
	    position: absolute;
        top: -30%;
        left: 0%;
        margin-top: -6px;
        margin-left:8px;
        margin-bottom: 10px;
        width: 0;
	    border-top: 10px solid #008BE5;
        transform:rotate(240deg);
        border-right: 5px solid transparent;
        border-left: 5px solid transparent;
        content: " ";
        font-size: 0;
        line-height: 0;
    }
    .alarmToolBox [data-tooltip]:hover:before,
    .alarmToolBox [data-tooltip]:hover:after {
	    visibility: visible;
        -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
        filter: progid: DXImageTransform.Microsoft.Alpha(Opacity=100);
        opacity: 1;
    }

    .tabs {
       position: relative;
     }
    .tabs::before,
    .tabs::after {
       content: "";
       display: table;
     }
    .tabs::after {
       clear: both;
     }
    .tab {
       float: left;
     }
    .tab-switch {
       display: none;
       margin:0;
     }
    .tab-btn-content {
       position: absolute;
       z-index: 1;
       left: 0;
       opacity: 0;
       width: 100%;
       transition: all 0.35s;
       margin-top: 34px;
       font-size: 11px;
       font-family: 'Pretendard';
     }
    .tab-btn-content .unresponsive{  }
    .tab-btn-content .responsive{  }

    .tab-scroll {
        display: inline-block;
        width: 100%;
        height: 420px;
        overflow-y: scroll;
     }
    .unresponsive:checked + label + .tab-btn-content.unresponsive {
        z-index: 2;
        opacity: 1;
        transition: all 0.35s;
        font-size: 11px;
        font-family: 'Pretendard';
     }
    .responsive:checked + label + .tab-btn-content.responsive {
        z-index: 2;
        opacity: 1;
        transition: all 0.35s;
        font-size: 11px;
        font-family: 'Pretendard';
     }

    .tabs {
        margin-top: 50px;
        padding-top: 20px;
        padding-bottom: 40px;
        margin: 0 auto;
     }
    .tabsBox{
        display: block;
        border-bottom: solid 1.5px #fff;
        height: 32px;
        line-height: 32px;
        position:relative;
    }

    .tab_item {
        width: 80px;
        height: 32px;
        line-height: 32px;
        /* font-size: 16px; */
        font-size: 12px;
        text-align: center;
        color: #808080;
        display: block;
        float: left;
        text-align: center;
        font-weight: bold;
        transition: all 0.2s ease;
        padding: 0;
        margin: 0;
     }
    .tab_item:hover {
        opacity: 0.75;
     }
    input[name="tab_item"] {
       /* display: none; */
    }
    .tab_content { }
     #unresponsive:checked ~ #unresponsive_content,
     #responsive:checked ~ #responsive_content {
        display: block;
        border: Dashed 1px red;
    }
    .tabs input:checked + .tab_item {
        border-top: 1.5px solid #fff;
        border-left: 1.5px solid #fff;
        border-right: 1.5px solid #fff;
        border-bottom: 1.5px solid rgb(26 26 26 / 90%);
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        color: #fff;
        z-index: 1;
        top: 2px;
        margin: 0px !important;
     }
    .show-memo { }

    .unresponNum{
        display: inline-block;
        width: 16px;
        height: 16px;
        background: red;
        line-height: 16px;
        font-size: 10px;
        border-radius: 50%;
        margin-left: 4px;
    }
    .responNum{
        display: inline-block;
        width: 16px;
        height: 16px;
        background: red;
        line-height: 16px;
        font-size: 10px;
        border-radius: 50%;
        margin-left: 4px;
     }

     .sensorlocationBox{
        display: inline-block;
        width: 100%;
        /* height: 150px; */
        /* background: #4d4d4d96; */
        border:solid 1px #FFFFFF85;
        padding: 6px 20px;
        border-radius: 5px;
        margin: 10px 0px 4px 0px;
        font-weight: 200;

        &:hover{
           background:#4D4D4D69;
           border:none;
        }
        &.active{
           background:#4D4D4D69;
           border:solid 1px #FFFFFF85;
        }
        > span{
           color: #fff;
        }
     }

     /* .sensorList{
        display: flex;
        font-size: 11px;
        height: 38px;
        line-height:38px;
        color: #fff;
        font-family: Pretendard;
     } */

     /* test */
     .sensorList{
        display: flex;
        align-items: center;
        font-size: 11px;
        height: 38px;
        line-height:38px;
        color: #fff;
        font-family: 'Pretendard';

        .greenText{
            color: #00B050;
        }
        .redText{
            color: #ff0000;
        }
        .stepName{
            padding: 0px 10px 0px 20px;
        }

        > span {
            font-size: 11px;
        }
     }
     
     .moveBtn{
        display: block;
        width: 50px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        font-size: 10px;
        border-radius: 20px;
        background: #1A1A1A;
        border: solid 1px #666666;
        cursor:pointer;
      }
      .memoIcon{
        display: inline-block;
        width: 22px;
        height: 22px;
        /* background: url("./../../resource/image/sdms/memoIcon2.png")no-repeat; */
        background: url(${memoIcon}) no-repeat center center;
        background-size:16px;
        background-position: center center;
        cursor:pointer;
      }

      .sensorSeriousStepBox{
        display: flex;
        width: 69px;
        height: 7px;
        padding: 16px 0px;
        margin-left: 10px;
        .seriousBox1{
           width: 16px;
           height: 7px;
           background:#C00000;
           margin-right: 4px;
        }
        .seriousBox2{
           width: 16px;
           height: 7px;
           background:#C00000;
           margin-right: 4px;
        }
        .seriousBox3{
           width: 16px;
           height: 7px;
           background:#e12222;
           margin-right: 4px;
        }
        .seriousBox4{
           width: 16px;
           height: 7px;
           background:#FF5A5A;
           margin-right: 4px;
        }
     }
     .sensorBoundaryStepBox{
        display: flex;
        align-items: center;
        width: 69px;
        height: 7px;
        padding: 16px 0px;
        margin-left: 10px;
        .boundaryBox1{
           width: 16px;
           height: 7px;
           background:#DF5200;
           margin-right: 4px;
        }
        .boundaryBox2{
           width: 16px;
           height: 7px;
           background:#DF5200;
           margin-right: 4px;
        }
        .boundaryBox3{
           width: 16px;
           height: 7px;
           background:#F39374;
           margin-right: 4px;
        }
        .boundaryBox4{
           width: 16px;
           height: 7px;
           background:#fff;
           margin-right: 4px;
        }
     }
     .sensorSeriousCompletionBox{
         display: flex;
         width: 69px;
         height: 7px;
         padding: 16px 0px;
         margin-left: 10px;
        .seriousBox1{
           width: 16px;
           height: 7px;
           background:#808080;
           margin-right: 4px;
        }
        .seriousBox2{
           width: 16px;
           height: 7px;
           background:#808080;
           margin-right: 4px;
        }
        .seriousBox3{
           width: 16px;
           height: 7px;
           background:#808080;
           margin-right: 4px;
        }
        .seriousBox4{
           width: 16px;
           height: 7px;
           background:#808080;
           margin-right: 4px;
        }
     }
     .sensorBoundaryCompletionBox{
        display: flex;
        width: 69px;
        height: 7px;
        padding: 16px 0px;
        margin-left: 10px;
        .boundaryBox1{
           width: 16px;
           height: 7px;
           background:#808080;
           margin-right: 4px;
        }
        .boundaryBox2{
           width: 16px;
           height: 7px;
           background:#808080;
           margin-right: 4px;
        }
        .boundaryBox3{
           width: 16px;
           height: 7px;
           background:#808080;
           margin-right: 4px;
        }
        .boundaryBox4{
           width: 16px;
           height: 7px;
           background:#fff;
           margin-right: 4px;
        }
     }

     .eventMemoBox{
        display: block;
        width: 197px;
        height: 197px;
        background: #fff;
        border-radius: 5px;
        box-shadow: 0px 3px 6px #00000029;
        padding: 10px;
        > span{
          display: block;
          color:${(props) => props.theme.mainColor};
          text-align:center;
          margin-top: 5px;
          margin-bottom: 10px;
        }
     }
    .memoBox{

     }
    .memoTextArea{
      width: 177px;
      height: 112px;
      background: #F5F5F5;
      color: #000000;
      padding: 8px;
      font-size: 12px;
    }
    .memoTextArea::placeholder{
      color: #CCCCCC;
      font-size: 12px;
    }
    .memoBtn{
       display: flex;
       width: 178px;
       height: 24px;
       margin-top: 10px;

        .cancle{
           display: block; 
           width:85px;
           height:24px;
           line-height: 20px;
           border-radius: 5px;
           border:solid 2px ${(props) => props.theme.mainColor};
           color: ${(props) => props.theme.mainColor};
           text-align:center;
           margin-right: 6px;
           font-size: 14px;
           cursor:pointer;
         }
        .save{
           display: block;
           width:85px;
           height:24px;
           line-height: 24px;
           border-radius: 5px;
           background: ${(props) => props.theme.mainColor};
           color: #fff;
           text-align:center;
           font-size: 14px;
           cursor:pointer;
        }
    }

    .sensorEventBtn{
       display: flex;
       /* width: 108px; */
       height: 13px;
    }
    .spreading{
        display:inline-block;
        width:160px;
        height:32px;
        line-height:32px;
        border-radius: 5px;
        background: #4D4D4D;
        color:#fff;
        text-align:center;
        font-size: 14px;
        font-family: Pretendard;
        margin-right: 9px;
        cursor: pointer;
    }
    .spreadEnd{
        display:inline-block;
        width:160px;
        height:32px;
        line-height:32px;
        border-radius: 5px;
        background: #C00000;
        color:#fff;
        text-align:center;
        font-size: 14px;
        font-family: Pretendard;
        cursor: pointer;
    }
    .historyBtn{
        display:inline-block;
        width:160px;
        height:32px;
        line-height:32px;
        border-radius: 5px;
        background: #4D4D4D;
        color:#fff;
        text-align:center;
        font-size: 14px;
        font-family: Pretendard;
        margin-right: 9px;
        cursor: pointer;
    }
    .downBtn{
        display:inline-block;
        width:160px;
        height:32px;
        line-height:32px;
        border-radius: 5px;
        background: #19A5FF;
        color:#fff;
        text-align:center;
        font-size: 14px;
        font-family: Pretendard;
        cursor: pointer;
    }
`;


//미니맵
export const MiniMapComponent = styled(CommonComponent)`

    .sensorInfoDetailTitleM{
       display: flex;
       align-items: center;
    }

    .sensorInfoTitleSecondM{
       display: flex;
       align-items: center;
    }

    .minimapTitleIcon{
       display: inline-block;
       width: 19px;
       height: 19px;
       /* background: url(./../../resource/image/sdms/miniMap_title.png) no-repeat center center; */
       background: url(${miniMapTitle}) no-repeat center center;
    }

    .minimapBox{
       display: block;
       /* width: 359px; */
       height: 224px;

       &.on{
          display: block;
          width: 100%;
          height: 100%;
       }
    }

    .imgBox{
       display: block;
    }
    .imgArea{
       display:inline-block;
       /* width:90%; */
       width: 280px;
       height: 210px;
       opacity: 0.5;
       position: absolute;
       left: 41px;
       top: 35px;
    }

    .aZoneBtn{
       display: block;
       width: 40px;
       height: 16px;
       position: absolute;
       left: 54px;
       top: 150px; 

       &.on{
           display: block;
           width: 68px;
           height: 110px;
           background: url(${aArea}) no-repeat center center;
           background-size: 100%;
           position: absolute;
           left: 46px;
           top: 110px;
           transform: rotate(0deg);
           cursor: pointer;
           z-index: 1;
       }

    }
    .aMoveBtn{
        display: none;
        width: 40px;
        height: 16px;
        background: url(${moveBtn}) no-repeat center center;
        background-size: 100%;
        position: absolute;
        left: 54px;
        top: 150px;
        cursor: pointer;
        z-index: 2;

        &.on{
            display: inline-block;
            width: 40px;
            height: 16px;
            background: url(${moveBtn}) no-repeat center center;
            background-size: 100%;
            position: absolute;
            left: 54px;
            top: 150px;
            cursor: pointer;
            z-index: 2;
        }
    }

    .bZoneBtn{
       display: block;
       width: 40px;
       height: 16px;
       position: absolute;
       left: 90px;
       top: 160px;

       &.on{
            display: block;
            width: 78px;
            height: 110px;
            background: url(${bArea}) no-repeat center center;
            background-size: 100%;
            position: absolute;
            left: 64px;
            top: 126px;
            transform: rotate(0deg);
            cursor: pointer;
            z-index: 1;
       }
    }
    .bMoveBtn{
        display: none;
        width: 40px;
        height: 16px;
        background: url(${moveBtn}) no-repeat center center;
        background-size: 100%;
        position: absolute;
        left: 90px;
        top: 160px;
        cursor: pointer;
        z-index: 2;

        &.on{
            display: inline-block;
            width: 40px;
            height: 16px;
            background: url(${moveBtn}) no-repeat center center;
            background-size: 100%;
            position: absolute;
            left: 90px;
            top: 160px;
            cursor: pointer;
            z-index: 2;
        }
    }

    .cZoneBtn{
       display: block;
       width: 40px;
       height: 16px;
       position: absolute;
       left: 130px;
       top: 100px;

       &.on{
            display: block;
            width: 66px;
            height: 104px;
            background: url(${cArea}) no-repeat center center;
            background-size: 100%;
            position: absolute;
            left: 112px;
            top: 67px;
            transform: rotate(0deg);
            cursor: pointer;
            z-index: 1;
       }
    }

    .cMoveBtn{
        display: none;
        width: 40px;
        height: 16px;
        background: url(${moveBtn}) no-repeat center center;
        background-size: 100%;
        position: absolute;
        left: 130px;
        top: 100px;
        cursor: pointer;
        z-index: 2;

        &.on{
            display: inline-block;
            width: 40px;
            height: 16px;
            background: url(${moveBtn}) no-repeat center center;
            background-size: 100%;
            position: absolute;
            left: 130px;
            top: 100px;
            cursor: pointer;
            z-index: 2;
        }
    }

    .dZoneBtn{
       display: block;
       width: 40px;
       height: 16px;
       position: absolute;
       left: 180px;
       top: 90px;

       &.on{
            display: block;
            width: 90px;
            height: 66px;
            background: url(${dArea}) no-repeat center center;
            background-size: 100%;
            position: absolute;
            left: 156px;
            top: 73px;
            transform: rotate(0deg);
            cursor: pointer;
            z-index: 1;
       }
    }

    .dMoveBtn{
        display: none;
        width: 40px;
        height: 16px;
        background: url(${moveBtn}) no-repeat center center;
        background-size: 100%;
        position: absolute;
        left: 180px;
        top: 90px;
        cursor: pointer;
        z-index: 2;

        &.on{
            display: inline-block;
            width: 40px;
            height: 16px;
            background: url(${moveBtn}) no-repeat center center;
            background-size: 100%;
            position: absolute;
            left: 180px;
            top: 90px;
            cursor: pointer;
            z-index: 2;
        }
     }

    .eZoneBtn{
       display: block;
       width: 40px;
       height: 16px;
       position: absolute;
       left: 250px;
       top: 90px;

       &.on{
            display: block;
            width: 78px;
            height: 66px;
            background: url(${eArea}) no-repeat center center;
            background-size: 100%;
            position: absolute;
            left: 243px;
            top: 66px;
            transform: rotate(0deg);
            cursor: pointer;
            z-index: 1;
       }
    }

    .eMoveBtn{
        display: none;
        width: 40px;
        height: 16px;
        background: url(${moveBtn}) no-repeat center center;
        background-size: 100%;
        position: absolute;
        left: 250px;
        top: 90px;
        cursor: pointer;
        z-index: 2;

        &.on{
            display: inline-block;
            width: 40px;
            height: 16px;
            background: url(${moveBtn}) no-repeat center center;
            background-size: 100%;
            position: absolute;
            left: 250px;
            top: 90px;
            cursor: pointer;
            z-index: 2;
        }
    }

    /* 
    .cZoneBtn{
       display: block;
       width: 82px;
       height: 130px;
       position: absolute;
       left: 105px;
       top: 54px;
       transform: rotate(360deg);
       background-size: 80%;
       cursor: pointer;

       &:hover {
         background: url(${cArea}) no-repeat center center;
         background-size: 80%;
       }
       &.active{
         background: url(${cArea}) no-repeat center center;
         background-size: 80%;
       } 
     }

    .dZoneBtn{
        display: block;
        width: 96px;
        height: 106px;
        position: absolute;
        left: 153px;
        top: 53px;
        transform: rotate(0deg);
        background-size: 92%;
        cursor: pointer;

        &:hover {
           background: url(${dArea}) no-repeat center center;
           background-size: 92%;
         }
        &.active{
           background: url(${dArea}) no-repeat center center;
           background-size: 92%;
        } 
    }
    .eZoneBtn{
        display: block;
        width: 79px;
        height: 69px;
        position: absolute;
        left: 242px;
        top: 64px;
        transform: rotate(0deg);
        background-size: 92%;
        cursor: pointer;

        &:hover {
           background: url(${eArea}) no-repeat center center;
           background-size: 92%;
         }
        &.active{
           background: url(${eArea}) no-repeat center center;
           background-size: 92%;
        }  
    }
    */ 
`;

//공공데이터창
export const DataInfoComponent = styled(CommonComponent)`

    .sensorDslTop{
        position: relative;
        padding: 15px 15px 0px 15px;
        display: flex;
        align-items: center;
        -webkit-border-radius: 10px 10px 0px 0px;
        -moz-border-radius: 10px 10px 0px 0px;
        border-radius: 10px 10px 0px 0px;
        background-color: ${(props) => props.theme.backgroundColor};
    }
    .sensorInfoDetailTitleD{
       display: flex;
       align-items: center;
    }
    .contentPaddingBox{
        display: block;
        padding: 0px 15px 15px 15px;
        /* height: 100%; */
        background-color: ${(props) => props.theme.backgroundColor};
        -webkit-border-radius: 0px 0px 10px 10px;
        -moz-border-radius: 0px 0px 10px 10px;
        border-radius: 0px 0px 10px 10px;
    }
     .sensorInfoTitleBox{
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
     }
     .sensorInfoDetailTitle{
        display: flex;
        align-items: center;
      }

    .networkTitleIcon{
        display: block;
        width: 19px;
        height: 19px;
        /* background: url("./../../resource/image/sdms/networkTitle_icon.png")no-repeat center center;
        divBackgroundAct: 'url("./../../resource/image/sdms/networkTitle_icon.png")no-repeat center center', */ 
        background: url(${networkTitle}) no-repeat center center;
     }
     .sensorTitle{
        display: inline-block;
        color: ${(props) => props.theme.mainColor};
        font-size: 16px;
        font-family:  'Pretendard';
        font-weight: 600;
        padding-left: 11px;
     }
     .sensorInfoTitleSecond{
         display: flex;
         align-items: center;
     }
     .seosorCloseIcon{
        display: inline-block;
        width: 17px;
        height: 16px;
        background: url(${close_x}) no-repeat center center;
        background-size: 14px;
        z-index: 1;
        cursor: pointer;
     }
    
     /* test */

    .tabsData {
        position: relative;
        padding-top: 20px;
     }
    .tabsData::before,
    .tabsData::after {
        content: "";
        display: table;
     }
    .tabsData::after {
        clear: both;
    }
    .tab-switchData{
        display: none;
        margin:0;
    }
    .tabsBoxData{
        display: block;
        border-bottom: solid 1.5px #fff;
        height: 32px;
        line-height: 32px;
        position:relative;
     }
    .tab_itemData {
        width: 100px;
        height: 32px;
        line-height: 32px;
        font-size: 12px;
        text-align: center;
        color: #808080;
        display: block;
        float: left;
        text-align: center;
        font-weight: bold;c
        transition: all 0.2s ease;
        padding: 0;
        margin: 0;
        font-family: 'Pretendard';
    }
    .tab_itemData:hover {
        opacity: 0.75;
        border-bottom: none;
    }
    input[name="tab_itemData"] {
        display: none;
     }

    .tab-btn-contentData {
        position: absolute;
        z-index: 1;
        left: 0;
        opacity: 0;
        width: 100%;
        transition: all 0.35s;
        margin-top: 34px;
        font-size: 11px;
        font-family: 'Pretendard';
     }
    .tab-btn-contentData .atmosphereCity{ }
    .tab-btn-contentData .weatherPlace{ }
    .tab-btn-contentData .cleanSYS{ }

    .tab_contentData{  }
     #atmosphereCity:checked ~ #atmosphereCity_content,
     #weatherPlace:checked ~ #weatherPlace_content,
     #cleanSYS:checked ~ #cleanSYS_content {
         display: block;
     }
    .tabsData input:checked + .tab_itemData {
         border-top: 1.5px solid #fff;
         border-left: 1.5px solid #fff;
         border-right: 1.5px solid #fff;
         border-bottom: 1.5px solid rgb(26 26 26 / 90%);
         border-top-left-radius: 6px;
         border-top-right-radius: 6px;
         color: #fff;
         z-index: 1;
         top: 2px;
         margin: 0px !important;
         font-family: 'Pretendard';
     }
    .tab-switchData {
         display: none;
         margin:0;
     }
    .atmosphereCity:checked + label + .tab-btn-contentData.atmosphereCity {
         z-index: 2;
         opacity: 1;
         transition: all 0.35s;
         font-size: 11px;
         font-family: 'Pretendard';
     }
    .weatherPlace:checked + label + .tab-btn-contentData.weatherPlace {
         z-index: 2;
         opacity: 1;
         transition: all 0.35s;
         font-size: 11px;
         font-family: 'Pretendard';
     }
    .cleanSYS:checked + label + .tab-btn-contentData.cleanSYS {
         z-index: 2;
         opacity: 1; transition: all 0.35s;
         font-size: 11px;
         font-family: 'Pretendard';
     }
    .areaText {
         color: #fff;
         font-size: 12px;
         float: right;
         font-family: 'Pretendard';
         font-weight: 200;
     }

    .tabCityScroll{
         height: 390px;
         overflow-x: hidden;
         overflow-y: scroll;
         padding-right: 10px;
         padding-top: 20px;
     }
    .tabWeatherScroll{
         height: 430px;
         overflow-x: hidden;
         overflow-y: scroll;
         padding-right: 10px;
         padding-top: 20px;
    }
    .tabCleanScroll{
         height: 390px;
         overflow-x: hidden;
         overflow-y: scroll;
         padding-right: 10px;
         padding-top: 20px;
    }

    #atmosphereCity2{ }


    .IconDustBox{
        display: flex;
        width: 40px;
        height: 40px;
        background: url(${dust_icon}) no-repeat center center;
        margin-right: 14px;

        &:hover {
          background: url(${dust_icon}) no-repeat center center;
         }
        &.active{
          background: url(${dust_icon}) no-repeat center center;
        }
    }

    .IconO3Box{
        display: flex;
        width: 40px;
        height: 40px;
        background: url(${o3_icon}) no-repeat center center;
        margin-right: 14px;

        &:hover {
           background: url(${o3_icon}) no-repeat center center;
         }
        &.active{
           background: url(${o3_icon}) no-repeat center center;
        }
    }
    .IconSO2Box{
        display: flex;
        width: 40px;
        height: 40px;
        background: url(${so2_icon}) no-repeat center center;
        margin-right: 14px;
        &:hover {
           background: url(${so2_icon}) no-repeat center center;
         }
        &.active{
           background: url(${so2_icon}) no-repeat center center;
        }
    }

    .dataBoxArea{
        display: flex;
        width: 50px;
        flex-direction: column;
    }
    .dataBoxText{
        display: block;
        width: 100%;
        height: 19px;
        line-height:19px;
        color: #fff;
        font-size: 11px;
    }
    .dataUnit{
        display: block;
        width: 100%;
        height: 19px;
        line-height:19px;
        color: #fff;
        font-size: 11px;
    }
    .progressBox{
        display: flex;
        width: calc(100% - 110px);
        height: 34px;
        align-items: flex-end;
        margin-left: 15px;
    }
    .progress{
        background: #808080;
        justify-content: flex-start;
        border-radius: 100px;
        align-items: center;
        position: relative;
        display: flex;
        height: 8px;
        width: 100%;
    }
    .progressValue{
        animation: load 3s normal forwards;
        box-shadow: 0 10px 40px -10px #fff;
        border-radius: 100px;
        background-image: linear-gradient(#19A5FF, #0D5380);
        height: 8px;
        width: 0;
    }
    .popOpenIcon{
        display: block;
        width: 100%;
        height: 19px;
        background: url(${popOpen}) no-repeat center center;
        background-position: right;
        margin-top: 21px;
        cursor: pointer;
    }

    /************************************************************************************/

    .weatherPlaceBox{
        display: flex;
        width: 33.3%;
        height: 50px;
        color: #fff;
        margin-bottom: 6px;
    }
    .weatherNum{
        display: block;
        width: 18px;
        height: 18px;
        line-height: 18px;
        color: #fff;
        background-color: #000000;
        border-radius: 3px;
        text-align: center;
        margin-right: 8px;
        font-size: 11px;
    }
    .weatherPlaceTitle{
        display: block;
        width: 100%;
        height: 19px;
        color: #fff;
        line-height:19px;
        font-size: 11px;
    }
    .weatherPlaceDate{
        display: block;
        width: 100%;
        height: 19px;
        color: #fff;
        line-height:19px;
        font-size: 11px;
    }
    .weatherPlaceTime{
        display: block;
        width: 100%;
        height: 19px;
        color: #fff;
        line-height:19px;
        font-size: 11px;
    }

    /************************************************************************************/

    .cleanFlex{
        display: flex;
        width: 100%;
        margin-right: 12px;
        margin-top: 10px;
    }
    .cleanSelectPlace{
        display: block;
        width: 245px;
        height: 34px;
        background: url(${selectDown}) no-repeat 92% 50%;
        margin-right: 10px;

        > select{
           display: block;
           width: 245px;
           height: 34px;
           background: #000000 url(${selectDown}) no-repeat 92% 50%;
           border-radius: 5px;
           color: #B3B3B3;
           font-family: 'Pretendard';
           font-size:12px;
       }
       > option{
           color: #B3B3B3;
           height: 34px;
           line-height: 34px;
           font-size: 11px;
        }
       option:hover{
          background: #4d4d4d;
          color: #B3B3B3;
       }
    }
    .cleanSelect{
        display: block;
        width: 86px;
        height: 34px;
        background: url(${selectDown}) no-repeat 90% 50%;

        > select{
           display: block;
           width: 86px;
           height: 34px;
           background: #000000 url(${selectDown}) no-repeat 90% 50%;
           border-radius: 5px;
           color: #B3B3B3;
           font-family: 'Pretendard';
           font-size:12px;
       }
       option:hover{
          background: #4d4d4d;
          color: #B3B3B3;
       }
    }
    .cleanSYSTable{
        display: block;

        > table{
           display: table;
           width: 100%;
           color: #ffffff;
           font-size: 12px;
           font-family: Pretendard;
           font-weight: 400;
        }
        > table .itemBoxTr{
           padding-left: 13px;
           height: 40px;
           line-height: 40px;
           color: #d7d7d7;
           border-bottom: 2px solid #4D4D4D;
           border-top: 2px solid #4D4D4D;
           font-size: 12px;
           font-family: Pretendard;
           font-weight: 400;
        }
         > table .itemBoxBodyTr{
           height: 40px;
           line-height: 40px;
           font-size: 12px;
           font-family: Pretendard;
           font-weight: 400;
           color: #fff;
           text-align: center;
           border-bottom: dashed 1px #808080;
        }
        > table .itemBlueText{
           color: ${(props) => props.theme.mainColor};
        }
        > table .itemRedText{
           color: #FF5A5A;
        }
        &::-webkit-scrollbar {
            width: 7px;
            height: 7px;
            border-radius: 3px;
            background-color: #4D4D4D;
        }
        &::-webkit-scrollbar-thumb {
            width: 3px;
            border-radius: 3px;
            background: ${(props) => props.theme.mainColor};
        }
        &::-webkit-scrollbar-button{
            width: 0px;
            height: 0px;
        }
    }
`;

//도시대기측정망 팝업창
export const AtmosphereCityPopupComponent = styled(CommonComponent)`

    .sensorInfoDetailTitleA{
        display: flex;
        align-items: center;
    }
    .sensorInfoTitleSecondA{
        display: flex;
        align-items: center;
    }
    .atmosphereCityPopupTop{
       display: flex;
       width: 1050px;
       height: 60px;
       line-height: 60px;
       background: linear-gradient(to bottom, #009BFF, #0065A7);
       border-top-left-radius: 9px;
       border-top-right-radius: 9px;
       padding: 0px 10px;
    }

    .sensorCityTitle{
       display: inline-flex;
       /* width: 50px; */
       color: #fff;
       font-size: 16px;
       flex: 1;
       font-family:  'Pretendard';
       font-weight: 600;
       padding-left: 11px;
    }
    .sensorCityTime{
       display: inline-block;
       /* width: 50px; */
       color: #fff;
       font-size: 16px;
       font-family:  'Pretendard';
       font-weight: 600;
       padding-left: 11px;
       margin-right: 10px; 
    }
    .cityCloseIcon{
       display: inline-block;
       width: 16px;
       height: 60px;
       /* background: url("./../../resource/image/sdms/closeIcon.png")no-repeat; */
       background: url(${cityCloseIcon}) no-repeat center center;
       cursor: pointer;
    }
    .atmosphereCityTable{
       display: block;
       width: 98%;
       height: 720px;
       color: #fff;
       font-size: 16px;
       overflow-x: scroll;
       overflow-y: scroll;
       margin: 14px;

        > table{
           min-width: 620%;
           color: #ffffff;
           /* margin: 10px; */
        }
        > table .itemBoxTrLine{
           width: 100%;
           height: 50px;
           lineHeight: 50px;
           color: #d7d7d7;
           border-bottom: solid 1px #d7d7d7;
        }
        > table .itemBoxTr{
           padding-left: 13px;
           height: 50px;
           color: #d7d7d7;
           border-bottom: 0.5px dashed #666666;
        }
        > table .itemBoxTh{
           height: 50px;
           line-height: 50px;
           font-size: 16px;
           font-family: Pretendard;
           color: #fff;
           text-align: center;
        }
        > table .itemBoxTdLine{
           border-bottom:dashed 1px #666666;
        }
        > table .itemBoxTd1{
           width: 280px;
           height: 50px;
           line-height: 50px;
           text-align: center;
           color: #ffffff;
           font-size: 16px;
           font-family: Pretendard;
        }
        &::-webkit-scrollbar {
            width: 7px;
            height: 7px;
            border-radius: 3px;
            background-color: #4D4D4D;
        }
        &::-webkit-scrollbar-thumb {
            width: 3px;
            border-radius: 3px;
            background: #19A5FF;
        }
        &::-webkit-scrollbar-button{
            width: 0px;
            height: 0px;
        }

    }

`;


//상단 이벤트알림창
export const MainEventInfoComponent = styled(CommonComponent)`
     /* position:fixed;
     left: 48%; 
     top:2.5%;
     width: 1367px;
     height: 40px;
     transform: translate(-50%, 0%);
     box-sizing:border-box; */

    .sensorDashBox{
        display: flex;
        width: 1330px; /* 1367px */
        height: 40px;
        background: #1A1A1A;
        border-radius: 20px;
        line-height: 40px;
        padding: 0px 24px;

        background: rgba(26, 26, 26, 0.9);
        backdrop-filter: blur(3px);
        -webkit-backdrop-filter: blur(3px);
    }
    .sensorDashTitle{
        display: block;
        width: 82px;
        color: #fff;
        font-family: Pretendard;
        font-size: 18px;
    }
    .sensorSensing{
        display: block;
        width: 104px;
        height: 32px;
        border-radius: 20px;
        color: #fff;
        line-height: 32px;
        text-align: center;
        margin: 4px 20px;
        font-family: Pretendard;
    }
    .sensorEventConts{
        display: block;
        width: 100%;
        color: #fff;
        font-family: Pretendard;
        font-size:16px;
    }
    .eventTitle{
        font-size:16px;
        position: relative;
        width: 100%;
        max-width:100%;
        height:40px;
        overflow-x: hidden;
        overflow-y: hidden;
    }
    .eventTrack{
        position: absolute;
        white-space: nowrap;
        will-change: transform;
        width: 100%;
        animation: textRoading 30s linear infinite;
    }
    .eventContents{
        -webkit-transform: translateY(calc(100% - 8rem));
        transform: translateY(calc(100% - 8rem));
    }

    @keyframes textRoading {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }

`;


//하단 모드메뉴바
export const ModeMenuBarComponent = styled.div`
     display: flex;
     width: 587px;
     height: 54px;
     border-radius: 30px;
     background-Image: linear-gradient(#393939, #1d1d1d);
     color: #fff;
     box-shadow: inset 0px 2px 4px #FFFFFF0F, 0px 5px 6px #0000004D;
     position: fixed;
     left: 50%;
     bottom: 0px; 
     /* margin-left: -250px; */
     align-items: center;
     transform: translate(-50%, -50%);

    > div {
      cursor: pointer;
    }

    .statusTab{
       display: inline-block;
       width: 20px;
       height: 28px;
       margin-left: 35px;
       background: url(${StatusTabImage})no-repeat center center;
    }

    .statusTabDis{
       display: inline-block;
       width: 20px;
       height: 28px;
       margin-left: 35px;
       background: url(${StatusTabDisImage})no-repeat center center;
    }

    .eventTab{
        display: inline-block;
        width: 27px;
        height: 30px;
        margin-left: 34px;
        background: url(${EventTabImage})no-repeat center center;
     }

     .eventTabDis{
        display: inline-block;
        width: 27px;
        height: 30px;
        margin-left: 34px;
        background: url(${EventTabDisImage})no-repeat center center;
     }

     .dataTab{
        display: inline-block;
        width: 29px;
        height: 29px;
        margin-left: 35px;
        background: url(${DataTabImage})no-repeat center center;
     }

     .dataTabDis{
        display: inline-block;
        width: 29px;
        height: 29px;
        margin-left: 35px;
        background: url(${DataTabDisImage})no-repeat center center;
     }
     .detailTab{
        display: inline-block;
        width: 33px;
        height: 29px;
        margin-left: 35px;
        background: url(${DetailTabImage})no-repeat center center;
     }
     .detailTabDis{
        display: inline-block;
        width: 33px;
        height: 29px;
        margin-left: 35px;
        background: url(${DetailTabDisImage})no-repeat center center;
     }
     .miniTab{
        display: inline-block;
        width: 28px;
        height: 28px;
        margin-left: 35px;
        background: url(${MiniTabImage})no-repeat center center;
     }
     .miniTabDis{
        display: inline-block;
        width: 28px;
        height: 28px;
        margin-left: 35px;
        background: url(${MiniTabDisImage})no-repeat center center;
     }
     .navTab{
        display: inline-block;
        width: 28px;
        height: 28px;
        margin-left: 34px;
        background: url(${NavTabImage})no-repeat center center;
     }
     .navTabDis{
        display: inline-block;
        width: 28px;
        height: 28px;
        margin-left: 34px;
        background: url(${NavTabDisImage})no-repeat center center;
     }
     .modeChange{
        display: block;
        width: 144px;
        height: 54px;
        line-height: 54px;
        border-radius: 30px;
        background-Image: linear-gradient(#45C4E9, #2F75CA, #1C30AE);
        color: #fff;
        text-align:center;
        font-size: 16px;
        margin-left: 35px;
     }
`;