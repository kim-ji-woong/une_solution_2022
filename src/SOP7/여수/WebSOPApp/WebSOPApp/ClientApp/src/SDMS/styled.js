
import styled from 'styled-components';
import ProjectResource from '../Root/resource/id';


/* import AtmosphereAct from './../SDMS/img/pop/atmosphereAct.png';
import AtmosphereDis from './../SDMS/img/pop/atmosphereDis.png';
import WaterQualityAct from './../SDMS/img/pop/waterQualityAct.png';
import WaterQualityDis from './../SDMS/img/pop/waterQualityDis.png';
import WeatherAct from './../SDMS/img/pop/weatherAct.png';
import WeatherDis from './../SDMS/img/pop/weatherDis.png';
import VOCAct from './../SDMS/img/pop/vocAct.png';
import VOCDis from './../SDMS/img/pop/vocDis.png';
import CCTVAct from './../SDMS/img/pop/cctvAct.png';
import CCTVDis from './../SDMS/img/pop/cctvDis.png'; */


import StatusTabImage from '../SDMS/img/bottomMenubar/sensorPop_active.png'
import StatusTabDisImage from '../SDMS/img/bottomMenubar/sensorPop_disable.png'
import EventTabImage from '../SDMS/img/bottomMenubar/eventPop_active.png'
import EventTabDisImage from '../SDMS/img/bottomMenubar/eventPop_disable.png'
import DataTabImage from '../SDMS/img/bottomMenubar/network_active.png'
import DataTabDisImage from '../SDMS/img/bottomMenubar/network_disable.png'
import DetailTabImage from '../SDMS/img/bottomMenubar/simulator_active.png'
import DetailTabDisImage from '../SDMS/img/bottomMenubar/simulator_disable.png'
import MiniTabImage from '../SDMS/img/bottomMenubar/miniPop2_active.png'
import MiniTabDisImage from '../SDMS/img/bottomMenubar/miniPop2_disable.png'
import NavTabImage from '../SDMS/img/bottomMenubar/navigation2_active.png'
import NavTabDisImage from '../SDMS/img/bottomMenubar/navigation2_disable.png'

/* import PoiEditTabImage from '../SDMS/img/bottomMenubar/sensorPop_disable.png'
import PoiEditTabDisImage from '../SDMS/img/bottomMenubar/sensorPop_disable.png' */



export const _SensorInfoBox = {
    busan: {
        divDisplay: 'block',
        divWidth: '373px',
        divHeight: '508px',
        divBackground: '#1E242B',
        divBorder: 'solid 1px #009CFF',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '373px',
        divHeight: '552px',
        divBackground: 'rgba(26,26,26,0.9)',
        divBorder: 'none',
    }
}


export const SensorInfoBox = styled.div`
    display:${_SensorInfoBox[ProjectResource.styleMode].divDisplay};
    /* width:${_SensorInfoBox[ProjectResource.styleMode].divWidth}; */
    /* height:${_SensorInfoBox[ProjectResource.styleMode].divHeight}; */
    /* height:100%; */
    background:${_SensorInfoBox[ProjectResource.styleMode].divBackground};
    border:${_SensorInfoBox[ProjectResource.styleMode].divBorder};
    border-radius:10px;
    /* padding: 15px; */
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    position: relative;

    &.active{
      color: #19A5FF;
    }
`;


/********************************************************************/

export const SensorDslTop = styled.div`
    position: relative;
    padding: 15px 15px 0px 15px;
    display: flex;
    align-items: center;
    -webkit-border-radius: 10px 10px 0px 0px;
    -moz-border-radius: 10px 10px 0px 0px;
    border-radius: 10px 10px 0px 0px;
    /* background-color: rgba(255, 255, 255, 0.1); */
    background-color: rgba(26,26,26,0.9);

    .measurementTime{
       color: #B3B3B3;
       font-size: 11px;
       letter-spacing: 0.55px;
       position: relative;
       right: 10px;
    }
`;

/********************************************************************/

export const ContentPaddingBox = styled.div`
    display: block;
    padding: 0px 15px 15px 15px;
    background-color: rgba(26,26,26,0.9);
    -webkit-border-radius: 0px 0px 10px 10px;
    -moz-border-radius: 0px 0px 10px 10px;
    border-radius: 0px 0px 10px 10px;
    height: calc(100% - 34px);
    overflow-x: hidden;
    overflow-y: auto;
    
`;

/********************************************************************/

export const ContentPaddingBoxVOC = styled.div`
    display: block;
    padding: 0px 30px 20px 30px;
    /* height: 100%; */
    background-color: rgba(26,26,26,0.9);
    -webkit-border-radius: 0px 0px 10px 10px;
    -moz-border-radius: 0px 0px 10px 10px;
    border-radius: 0px 0px 10px 10px;
    position: relative;

    .triangleShape{
       display: inline-block;
       width: 6px;
       height: 7px;
       background: url(./../../resource/image/sdms/triangle.png)no-repeat center center;
       position: absolute;
       left: 17px;
       top: 28px;
    }
`;

/********************************************************************/

export const _SensorInfoBoxPublic = {
    busan: {
        divDisplay: 'block',
        divWidth: '373px',
        divHeight: '508px',
        divBackground: '#1E242B',
        divBorder: 'solid 1px #009CFF',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '373px',
        divHeight: '100%',
        divBackground: 'rgba(26,26,26,0.9)',
        divBorder: 'none',
    }
}


export const SensorInfoBoxPublic = styled.div`
    display:${_SensorInfoBoxPublic[ProjectResource.styleMode].divDisplay};
    width:${_SensorInfoBoxPublic[ProjectResource.styleMode].divWidth};
    height:${_SensorInfoBoxPublic[ProjectResource.styleMode].divHeight};
    background:${_SensorInfoBoxPublic[ProjectResource.styleMode].divBackground};
    border:${_SensorInfoBoxPublic[ProjectResource.styleMode].divBorder};
    border-radius:10px;
    padding: 15px;
    /* opacity: 0.8; */
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);

    &.active{
      color: #19A5FF;
    }
`;

/********************************************************************/


export const _SensorInfoBoxMini = {
    busan: {
        divDisplay: 'block',
        divWidth: '373px',
        divHeight: '508px',
        divBackground: '#1E242B',
        divBorder: 'solid 1px #009CFF',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '373px',
        divHeight: '100%',
        divBackground: 'rgba(26,26,26,0.9)',
        divBorder: 'none',
    }
}


export const SensorInfoBoxMini = styled.div`
    display:${_SensorInfoBoxMini[ProjectResource.styleMode].divDisplay};
    /* width:${_SensorInfoBoxMini[ProjectResource.styleMode].divWidth}; */
    height:${_SensorInfoBoxMini[ProjectResource.styleMode].divHeight};
    background:${_SensorInfoBoxMini[ProjectResource.styleMode].divBackground};
    border:${_SensorInfoBoxMini[ProjectResource.styleMode].divBorder};
    border-radius:10px;
    padding: 15px;
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);

    &.active{
      color: #19A5FF;
    }
`;

/********************************************************************/

export const _SensorTitle = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divColor: '#009CFF',
        divFontSize: '16px',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divColor: '#19A5FF',
        divFontSize: '16px',
    }
}

export const SensorTitle = styled.div`
    display:${_SensorTitle[ProjectResource.styleMode].divDisplay};
    /* width:${_SensorTitle[ProjectResource.styleMode].divWidth}; */ 
    color:${_SensorTitle[ProjectResource.styleMode].divColor};
    font-size:${_SensorTitle[ProjectResource.styleMode].divFontSize};
    font-family:  'Pretendard';
    font-weight: 600;
    padding-left: 11px;

`

/********************************************************************/

export const _SensorTitleD = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divColor: '#19A5FF',
        divFontSize: '14px',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divColor: '#19A5FF',
        divFontSize: '14px',
    }
}

export const SensorTitleD = styled.div`
    display:${_SensorTitleD[ProjectResource.styleMode].divDisplay};
    /* width:${_SensorTitleD[ProjectResource.styleMode].divWidth}; */
    color:${_SensorTitleD[ProjectResource.styleMode].divColor};
    font-size:${_SensorTitleD[ProjectResource.styleMode].divFontSize};
    /* font-family:  'Pretendard-Bold'; */
    border-left: solid 3px #19A5FF;
    padding-left: 11px;
    margin-right: calc(100% - 150px);
    margin-bottom: 20px;
`

/********************************************************************/

export const _SensorTitleA = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divColor: '#fff',
        divFontSize: '12px',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divColor: '#fff',
        divFontSize: '12px',
    }
}

export const SensorTitleA = styled.div`
    display:${_SensorTitleA[ProjectResource.styleMode].divDisplay};
    /* width:${_SensorTitleA[ProjectResource.styleMode].divWidth}; */
    color:${_SensorTitleA[ProjectResource.styleMode].divColor};
    font-size:${_SensorTitleA[ProjectResource.styleMode].divFontSize};
    /* font-family:  'Pretendard-Bold'; */
    margin-right: calc(100% - 130px);
`

/********************************************************************/

export const _SensorTitleC = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divColor: '#19A5FF',
        divFontSize: '14px',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divColor: '#19A5FF',
        divFontSize: '14px',
    }
}

export const SensorTitleC = styled.div`
    display:${_SensorTitleC[ProjectResource.styleMode].divDisplay};
    /* width:${_SensorTitleC[ProjectResource.styleMode].divWidth}; */
    color:${_SensorTitleC[ProjectResource.styleMode].divColor};
    font-size:${_SensorTitleC[ProjectResource.styleMode].divFontSize};
    font-family:  'Pretendard';
    border-left: solid 3px #19A5FF;
    padding-left: 11px;
    margin-right: calc(100% - 218px);
    margin-bottom: 20px;
`

/********************************************************************/

export const _SensorTitleV = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divColor: '#19A5FF',
        divFontSize: '14px',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divColor: '#fff',
        divFontSize: '14px',
    }
}

export const SensorTitleV = styled.div`
    display:${_SensorTitleV[ProjectResource.styleMode].divDisplay};
    /* width:${_SensorTitleV[ProjectResource.styleMode].divWidth}; */
    color:${_SensorTitleV[ProjectResource.styleMode].divColor};
    font-size:${_SensorTitleV[ProjectResource.styleMode].divFontSize};
    font-family:  'Pretendard';
    margin-right: calc(100% - 330px);
`

/********************************************************************/

export const SensorTitleVD = styled.div`
    display: inline-block;
    color: #fff;
    font-size: 14px;
    font-family:  'Pretendard';
    margin-right: calc(100% - 156px);
    letter-spacing: 0.7px;
`

/********************************************************************/

export const _SensorTitleE = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divColor: '#19A5FF',
        divFontSize: '16px',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divColor: '#19A5FF',
        divFontSize: '16px',
    }
}

export const SensorTitleE = styled.div`
    display:${_SensorTitleE[ProjectResource.styleMode].divDisplay};
    /* width:${_SensorTitleE[ProjectResource.styleMode].divWidth}; */
    color:${_SensorTitleE[ProjectResource.styleMode].divColor};
    font-size:${_SensorTitleE[ProjectResource.styleMode].divFontSize};
    font-family:  'Pretendard';
    font-weight: 600;
    padding-left: 11px;
    margin-right: calc(100% - 140px);
`

/********************************************************************/


export const _SensorTitleIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '14px',
        divHeight: '19px',
        divBackground: 'url(./../../resource/image/sdms/poiTitle2_icon.png) no-repeat center center;'
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '14px',
        divHeight: '19px',
        divBackground: 'url(./../../resource/image/sdms/poiTitle2_icon.png) no-repeat center center;'
    }
}

export const SensorTitleIcon = styled.div`
    display:${_SensorTitleIcon[ProjectResource.styleMode].divDisplay};
    width:${_SensorTitleIcon[ProjectResource.styleMode].divWidth};
    height:${_SensorTitleIcon[ProjectResource.styleMode].divHeight};
    background:${_SensorTitleIcon[ProjectResource.styleMode].divBackground};
`

/********************************************************************/


export const _MinimapTitleIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '19px',
        divHeight: '19px',
        divBackground: 'url(./../../resource/image/sdms/miniMap_title.png) no-repeat center center;'
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '19px',
        divHeight: '19px',
        divBackground: 'url(./../../resource/image/sdms/miniMap_title.png) no-repeat center center;'
    }
}

export const MinimapTitleIcon = styled.div`
    display:${_MinimapTitleIcon[ProjectResource.styleMode].divDisplay};
    width:${_MinimapTitleIcon[ProjectResource.styleMode].divWidth};
    height:${_MinimapTitleIcon[ProjectResource.styleMode].divHeight};
    background:${_MinimapTitleIcon[ProjectResource.styleMode].divBackground};
`

/********************************************************************/

export const _EventTitleIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '19px',
        divHeight: '21px',
        divBackground: 'url(./../../resource/image/sdms/event_title.png) no-repeat center center;'
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '19px',
        divHeight: '21px',
        divBackground: 'url(./../../resource/image/sdms/event_title.png) no-repeat center center;'
    }
}

export const EventTitleIcon = styled.div`
    display:${_EventTitleIcon[ProjectResource.styleMode].divDisplay};
    width:${_EventTitleIcon[ProjectResource.styleMode].divWidth};
    height:${_EventTitleIcon[ProjectResource.styleMode].divHeight};
    background:${_EventTitleIcon[ProjectResource.styleMode].divBackground};
`

/********************************************************************/


export const _TitleTriIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '12px',
        divHeight: '21px',
        divBackground: 'url(./../../resource/image/sdms/titleTri_icon.png) no-repeat left center;'
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '12px',
        divHeight: '21px',
        divBackground: 'url(./../../resource/image/sdms/titleTri_icon.png) no-repeat left center;'
    }
}

export const TitleTriIcon = styled.div`
    display:${_TitleTriIcon[ProjectResource.styleMode].divDisplay};
    width:${_TitleTriIcon[ProjectResource.styleMode].divWidth};
    height:${_TitleTriIcon[ProjectResource.styleMode].divHeight};
    background:${_TitleTriIcon[ProjectResource.styleMode].divBackground};
`

/********************************************************************/

export const _SensorDetailTitle = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divColor: '#19A5FF',
        divFontSize: '14px',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divColor: '#19A5FF',
        divFontSize: '14px',
    }
}

export const SensorDetailTitle = styled.div`
    display:${_SensorDetailTitle[ProjectResource.styleMode].divDisplay};
    /* width:${_SensorDetailTitle[ProjectResource.styleMode].divWidth}; */
    color:${_SensorDetailTitle[ProjectResource.styleMode].divColor};
    font-size:${_SensorDetailTitle[ProjectResource.styleMode].divFontSize};
    font-family:  'Pretendard';
    font-weight: 600;
    padding-left: 11px;
    margin-right: calc(100% - 180px);
    /* margin-bottom: 15px; */
    letter-spacing: -1px;
`

export const SensorDetailTitleVOC = styled.div`
    display: inline-block;
    color: #19A5FF;
    font-size: 16px;
    font-family:  'Pretendard';
    font-weight: 600;
    padding-left: 11px;
    margin-right: calc(100% - 200px);
    letter-spacing: -1px;
`

/********************************************************************/

export const _SensorTitleW = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divColor: '#19A5FF',
        divFontSize: '12px',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divColor: '#fff',
        divFontSize: '12px',
    }
}

export const SensorTitleW = styled.div`
    display:${_SensorTitleW[ProjectResource.styleMode].divDisplay};
    /* width:${_SensorTitleW[ProjectResource.styleMode].divWidth}; */
    color:${_SensorTitleW[ProjectResource.styleMode].divColor};
    font-size:${_SensorTitleW[ProjectResource.styleMode].divFontSize};
    font-family:  'Pretendard';
    margin-right: calc(100% - 164px);
    letter-spacing: -1px;
`

/********************************************************************/

export const _SensorTitleWW = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divColor: '#19A5FF',
        divFontSize: '12px',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divColor: '#fff',
        divFontSize: '12px',
    }
}

export const SensorTitleWW = styled.div`
    display:${_SensorTitleWW[ProjectResource.styleMode].divDisplay};
    /* width:${_SensorTitleWW[ProjectResource.styleMode].divWidth}; */
    color:${_SensorTitleWW[ProjectResource.styleMode].divColor};
    font-size:${_SensorTitleWW[ProjectResource.styleMode].divFontSize};
    font-family:  'Pretendard';
    margin-right: calc(100% - 164px);
    letter-spacing: -1px;
`

/********************************************************************/

export const _SeosorCloseIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '12px',
        divHeight: '12px',
        divBackground: 'url("./../../resource/image/sdms/close_x.png")',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '17px',
        divHeight: '16px',
        divBackground: 'url("./../../resource/image/sdms/close_x.png")no-repeat center center',
    }
}

export const SeosorCloseIcon = styled.div`
    display:${_SeosorCloseIcon[ProjectResource.styleMode].divDisplay};
    width:${_SeosorCloseIcon[ProjectResource.styleMode].divWidth};
    height:${_SeosorCloseIcon[ProjectResource.styleMode].divHeight};
    background:${_SeosorCloseIcon[ProjectResource.styleMode].divBackground};
    background-size: 14px;
    position: absolute;
    z-index: 2;
    top: 17px;
    right: 15px;
    cursor: pointer;
`

/*********************************************************************/


export const _SensorIconBox = {
    busan: {
        divDisplay: 'block',
        divWidth: '100%',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '100%',
    }
}

export const SensorIconBox = styled.div`
    display:${_SensorIconBox[ProjectResource.styleMode].divDisplay};
    /* width:${_SensorIconBox[ProjectResource.styleMode].divWidth}; */
    /* width: 330px; */ 
    height: 42px;
    margin: 16px 0px 10px 0px;
    /* overflow: hidden; */

    .outer {
        height: 60px;
        margin: 0 auto;
        overflow-x: hidden;
    }
    .inner-list {
        display: flex;
        transition: .3s ease-out;
        height: 100%;
        border: dashed 1px yellow; 
    }
    .inner {
        display: inline-block;
        width: 38px;
        margin-right: 10px;
        border:dashed 1px green;
    }

    > div{
        display: inline-block;
        cursor: pointer;
    }
`

/*********************************************************************/

export const _SensorIconPOIBox = {
    busan: {
        divDisplay: 'block',
        divWidth: '100%',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '100%',
    }
}

export const SensorIconPOIBox = styled.div`
    display:${_SensorIconPOIBox[ProjectResource.styleMode].divDisplay};
    /* width:${_SensorIconPOIBox[ProjectResource.styleMode].divWidth}; */
    width: 330px; 
    height: 40px;
    overflow: hidden;
    margin: 16px 0px;
`

/*********************************************************************/


export const _Entire = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/theEntire_icon.png")',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/theEntire_icon.png")',
        imgBackgroundAct: 'url("./../../resource/image/sdms/theEntire_active.png")',
    }
}

export const Entire = styled.div`
     display:${_Entire[ProjectResource.styleMode].divDisplay};
     width:${_Entire[ProjectResource.styleMode].divWidth};
     height:${_Entire[ProjectResource.styleMode].divHeight};
     background:${_Entire[ProjectResource.styleMode].imgBackgroundAct};
     margin-right: 9px;
`

/********************************************************************/

export const _EntireDis = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/theEntire_icon.png")',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/theEntire_icon.png")',
    }
}

export const EntireDis = styled.div`
     display:${_EntireDis[ProjectResource.styleMode].divDisplay};
     width:${_EntireDis[ProjectResource.styleMode].divWidth};
     height:${_EntireDis[ProjectResource.styleMode].divHeight};
     background:${_EntireDis[ProjectResource.styleMode].imgBackground};
     margin-right: 9px;
`

/********************************************************************/

export const _Atmosphere = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/atmos_active.png")',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/atmos_active.png")',
        imgBackgroundAct: 'url("./../../resource/image/sdms/atmos_active.png")',
    }
}


export const Atmosphere = styled.div`
     display:${_Atmosphere[ProjectResource.styleMode].divDisplay};
     width:${_Atmosphere[ProjectResource.styleMode].divWidth};
     height:${_Atmosphere[ProjectResource.styleMode].divHeight};
     background:${_Atmosphere[ProjectResource.styleMode].imgBackground};
     margin-right: 9px;
     &:hover {
       background:${_Atmosphere[ProjectResource.styleMode].imgBackgroundAct};
     } 

`

/********************************************************************/

export const _AtmosphereDis = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/atmos_icon.png")',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/atmos_icon.png")',
    }
}

export const AtmosphereDis = styled.div`
     display:${_AtmosphereDis[ProjectResource.styleMode].divDisplay};
     width:${_AtmosphereDis[ProjectResource.styleMode].divWidth};
     height:${_AtmosphereDis[ProjectResource.styleMode].divHeight};
     background:${_AtmosphereDis[ProjectResource.styleMode].imgBackground};
     margin-right: 9px;
`

/********************************************************************/


export const _WaterQuality = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/water_active.png")',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/water_active.png")',
        imgBackgroundAct: 'url("./../../resource/image/sdms/water_active.png")',
    }
}

export const WaterQuality = styled.div`
    display:${_WaterQuality[ProjectResource.styleMode].divDisplay};
    width:${_WaterQuality[ProjectResource.styleMode].divWidth};
    height:${_WaterQuality[ProjectResource.styleMode].divHeight};
    background:${_WaterQuality[ProjectResource.styleMode].imgBackground};
    margin-right: 9px;
     &:hover {
       background:${_WaterQuality[ProjectResource.styleMode].imgBackgroundAct};
     }
`

/*******************************************************************/


export const _WaterQualityDis = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/water_icon2.png")',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/water_icon2.png")',
    }
}

export const WaterQualityDis = styled.div`
    display:${_WaterQualityDis[ProjectResource.styleMode].divDisplay};
    width:${_WaterQualityDis[ProjectResource.styleMode].divWidth};
    height:${_WaterQualityDis[ProjectResource.styleMode].divHeight};
    background:${_WaterQualityDis[ProjectResource.styleMode].imgBackground};
    margin-right: 9px;
`

/*******************************************************************/

export const _Weather = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/weather_active.png")',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/weather_active.png")',
        imgBackgroundAct: 'url("./../../resource/image/sdms/weather_active.png")',
    }
}

export const Weather = styled.div`
      display:${_Weather[ProjectResource.styleMode].divDisplay};
      width:${_Weather[ProjectResource.styleMode].divWidth};
      height:${_Weather[ProjectResource.styleMode].divHeight};
      background:${_Weather[ProjectResource.styleMode].imgBackground};
      margin-right:9px;
      &:hover {
          background:${_Weather[ProjectResource.styleMode].imgBackgroundAct};
      }
`
/*******************************************************************/

export const _WeatherDis = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/weather_icon2.png")',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/weather_icon2.png")',
    }
}

export const WeatherDis = styled.div`
    display:${_WeatherDis[ProjectResource.styleMode].divDisplay};
    width:${_WeatherDis[ProjectResource.styleMode].divWidth};
    height:${_WeatherDis[ProjectResource.styleMode].divHeight};
    background:${_WeatherDis[ProjectResource.styleMode].imgBackground};
    margin-right:9px;
`

/*******************************************************************/

export const _VOC = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/voc_active.png")',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/voc_active.png")',
        imgBackgroundAct: 'url("./../../resource/image/sdms/voc_active.png")',
    }
}

export const VOC = styled.div`
    display:${_VOC[ProjectResource.styleMode].divDisplay};
    width:${_VOC[ProjectResource.styleMode].divWidth};
    height:${_VOC[ProjectResource.styleMode].divHeight};
    background:${_VOC[ProjectResource.styleMode].imgBackground};
    margin-right:9px;
    &:hover {
        background:${_VOC[ProjectResource.styleMode].imgBackgroundAct};
    }
`

/*******************************************************************/

export const _VOCDis = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/voc_icon.png")',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/voc_icon.png")',
    }
}

export const VOCDis = styled.div`
    display:${_VOCDis[ProjectResource.styleMode].divDisplay};
    width:${_VOCDis[ProjectResource.styleMode].divWidth};
    height:${_VOCDis[ProjectResource.styleMode].divHeight};
    background:${_VOCDis[ProjectResource.styleMode].imgBackground};
    margin-right:9px;
`

/*******************************************************************/

export const _CCTV = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/cctv_active.png")',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/cctv_active.png")',
        imgBackgroundAct: 'url("./../../resource/image/sdms/cctv_active.png")',
    }
}

export const CCTV = styled.div`
    display:${_CCTV[ProjectResource.styleMode].divDisplay};
    width:${_CCTV[ProjectResource.styleMode].divWidth};
    height:${_CCTV[ProjectResource.styleMode].divHeight};
    background:${_CCTV[ProjectResource.styleMode].imgBackground};
    margin-right:9px;
    &:hover {
       background:${_CCTV[ProjectResource.styleMode].imgBackgroundAct};
    }
`

/*******************************************************************/


export const _CCTVDis = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/cctv_icon2.png")',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/cctv_icon2.png")',
    }
}

export const CCTVDis = styled.div`
    display:${_CCTVDis[ProjectResource.styleMode].divDisplay};
    width:${_CCTVDis[ProjectResource.styleMode].divWidth};
    height:${_CCTVDis[ProjectResource.styleMode].divHeight};
    background:${_CCTVDis[ProjectResource.styleMode].imgBackground};
    margin-right:9px;
`

/*******************************************************************/

export const _Bacteria = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/bacteria_active.png")',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/bacteria_active.png")',
        imgBackgroundAct: 'url("./../../resource/image/sdms/bacteria_active.png")',
    }
}

export const Bacteria = styled.div`
    display:${_Bacteria[ProjectResource.styleMode].divDisplay};
    width:${_Bacteria[ProjectResource.styleMode].divWidth};
    height:${_Bacteria[ProjectResource.styleMode].divHeight};
    background:${_Bacteria[ProjectResource.styleMode].imgBackground};
    &:hover {
       background:${_Bacteria[ProjectResource.styleMode].imgBackgroundAct};
    }
`

/*******************************************************************/

export const _BacteriaDis = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/bacteria_icon2.png")',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '40px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/bacteria_icon2.png")',
    }
}

export const BacteriaDis = styled.div`
    display:${_BacteriaDis[ProjectResource.styleMode].divDisplay};
    width:${_BacteriaDis[ProjectResource.styleMode].divWidth};
    height:${_BacteriaDis[ProjectResource.styleMode].divHeight};
    background:${_BacteriaDis[ProjectResource.styleMode].imgBackground};
    /* margin-right:8px; */
`

/*******************************************************************/

export const _SensorPrevIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '18px',
        divHeight: '18px',
        imgBackground: 'url("./../../resource/image/sdms/sensorPrevHover.png")no-repeat',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '18px',
        divHeight: '18px',
        imgBackground: 'url("./../../resource/image/sdms/sensorPrevHover.png")no-repeat',
    }
}

export const SensorPrevIcon = styled.div`
    display:${_SensorPrevIcon[ProjectResource.styleMode].divDisplay};
    width:${_SensorPrevIcon[ProjectResource.styleMode].divWidth};
    /* height:${_SensorPrevIcon[ProjectResource.styleMode].divHeight}; */
    background:${_SensorPrevIcon[ProjectResource.styleMode].imgBackground};
    background-size: 18px;
    background-position: center;
`

/*******************************************************************/


export const _SensorNextIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '18px',
        divHeight: '18px',
        imgBackground: 'url("./../../resource/image/sdms/sensorNextHover.png")no-repeat',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '18px',
        divHeight: '18px',
        imgBackground: 'url("./../../resource/image/sdms/sensorNextHover.png")no-repeat',
    }
}

export const SensorNextIcon = styled.div`
    display:${_SensorNextIcon[ProjectResource.styleMode].divDisplay};
    width:${_SensorNextIcon[ProjectResource.styleMode].divWidth};
    /* height:${_SensorNextIcon[ProjectResource.styleMode].divHeight}; */
    background:${_SensorNextIcon[ProjectResource.styleMode].imgBackground};
    background-size:18px;
    background-position: center;
`

/*******************************************************************/

export const _AtmosphereBox = {
    busan: {
        divDisplay: 'block',
        divWidth: '343px',
        divHeight: '34px',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '343px',
        divHeight: '34px',
    }
}

export const AtmosphereBox = styled.div`
     display:${_AtmosphereBox[ProjectResource.styleMode].divDisplay};
     width:${_AtmosphereBox[ProjectResource.styleMode].divWidth};
     height:${_AtmosphereBox[ProjectResource.styleMode].divHeight};
`

/*******************************************************************/

export const _SensorForm = {
    busan: {
        divBackgroundColor: '#',
        divHeight: '34px',
        divPadding: '0px 12px',
        divColor: '#d7d7d7',
        divLineHeight: '34px',
    },
    yeosu: {
        divBackgroundColor: '#',
        divHeight: '34px',
        divPadding: '0px 12px',
        divColor: '#fff',
        divLineHeight: '34px',
    }
}


export const SensorForm = styled.div`
     background-color:${_SensorForm[ProjectResource.styleMode].divBackgroundColor};
     height:${_SensorForm[ProjectResource.styleMode].divHeight};
     padding:${_SensorForm[ProjectResource.styleMode].divPadding};
     color:${_SensorForm[ProjectResource.styleMode].divColor};
     line-height:${_SensorForm[ProjectResource.styleMode].divLineHeight};
     display: flex;
     font-size:12px;
     font-family: Pretendard;
     align-items: center;
     > span{
        flex: 1;
     }
`;


/******************************************************************/


export const _SensorAtmosIcon = {
    busan: {
        divWidth: '12px',
        divHeight: '10px',
        divBackground: 'url(./../../resource/image/sdms/wind_icon.png) no-repeat center center;'
    },
    yeosu: {
        divWidth: '12px',
        divHeight: '10px',
        divBackground: 'url(./../../resource/image/sdms/wind_icon.png) no-repeat center center;'
    }
}


export const SensorAtmosIcon = styled.div`
     width:${_SensorAtmosIcon[ProjectResource.styleMode].divWidth};
     height:${_SensorAtmosIcon[ProjectResource.styleMode].divHeight};
     background:${_SensorAtmosIcon[ProjectResource.styleMode].divBackground};
     margin-right: 8px;
`;

/******************************************************************/


export const _SensorBacterIcon = {
    busan: {
        divWidth: '12px',
        divHeight: '12px',
        divBackground: 'url(./../../resource/image/sdms/bacteria-icon.png) no-repeat center center;'
    },
    yeosu: {
        divWidth: '12px',
        divHeight: '12px',
        divBackground: 'url(./../../resource/image/sdms/bacteria-icon.png) no-repeat center center;'
    }
}


export const SensorBacterIcon = styled.div`
     width:${_SensorBacterIcon[ProjectResource.styleMode].divWidth};
     height:${_SensorBacterIcon[ProjectResource.styleMode].divHeight};
     background:${_SensorBacterIcon[ProjectResource.styleMode].divBackground};
     margin-right: 8px;
`;


/******************************************************************/


export const _SensorWaterIcon = {
    busan: {
        divWidth: '9px',
        divHeight: '12px',
        divBackground: 'url(./../../resource/image/sdms/droplet_icon.png) no-repeat center center;'
    },
    yeosu: {
        divWidth: '9px',
        divHeight: '12px',
        divBackground: 'url(./../../resource/image/sdms/droplet_icon.png) no-repeat center center;'
    }
}


export const SensorWaterIcon = styled.div`
     width:${_SensorWaterIcon[ProjectResource.styleMode].divWidth};
     height:${_SensorWaterIcon[ProjectResource.styleMode].divHeight};
     background:${_SensorWaterIcon[ProjectResource.styleMode].divBackground};
     margin-right: 8px;
`;


/******************************************************************/


export const _SensorWeatherIcon = {
    busan: {
        divWidth: '12px',
        divHeight: '12px',
        divBackground: 'url(./../../resource/image/sdms/sun_icon.png) no-repeat center center;'
    },
    yeosu: {
        divWidth: '12px',
        divHeight: '12px',
        divBackground: 'url(./../../resource/image/sdms/sun_icon.png) no-repeat center center;'
    }
}


export const SensorWeatherIcon = styled.div`
     width:${_SensorWeatherIcon[ProjectResource.styleMode].divWidth};
     height:${_SensorWeatherIcon[ProjectResource.styleMode].divHeight};
     background:${_SensorWeatherIcon[ProjectResource.styleMode].divBackground};
     margin-right: 8px;
`;


/******************************************************************/

export const _SensorStatisticsIcon = {
    busan: {
        divWidth: '12px',
        divHeight: '13px',
        divBackground: 'url(./../../resource/image/sdms/statistics_icon.png) no-repeat center center;'
    },
    yeosu: {
        divWidth: '12px',
        divHeight: '13px',
        divBackground: 'url(./../../resource/image/sdms/statistics_icon.png) no-repeat center center;'
    }
}


export const SensorStatisticsIcon = styled.div`
     width:${_SensorStatisticsIcon[ProjectResource.styleMode].divWidth};
     height:${_SensorStatisticsIcon[ProjectResource.styleMode].divHeight};
     background:${_SensorStatisticsIcon[ProjectResource.styleMode].divBackground};
     margin-right: 8px;
`;


/******************************************************************/


export const _SensorCCTVIcon = {
    busan: {
        divWidth: '12px',
        divHeight: '10px',
        divBackground: 'url(./../../resource/image/sdms/cctvCamera_icon.png) no-repeat center center;'
    },
    yeosu: {
        divWidth: '12px',
        divHeight: '10px',
        divBackground: 'url(./../../resource/image/sdms/cctvCamera_icon.png) no-repeat center center;'
    }
}

export const SensorCCTVIcon = styled.div`
     width:${_SensorCCTVIcon[ProjectResource.styleMode].divWidth};
     height:${_SensorCCTVIcon[ProjectResource.styleMode].divHeight};
     background:${_SensorCCTVIcon[ProjectResource.styleMode].divBackground};
     margin-right: 8px;
`;


/******************************************************************/

export const _SensorNum = {
    busan: {
        divBackgroundColor: '#000000',
        divWidth: '38px',
        divHeight: '18px',
        divColor: '#d7d7d7',
        divLineHeight: '18px',
    },
    yeosu: {
        divBackgroundColor: '#000000',
        divWidth: '38px',
        divHeight: '18px',
        divColor: '#fff',
        divLineHeight: '18px',
    }
}


export const SensorNum = styled.div`
     background-color:${_SensorNum[ProjectResource.styleMode].divBackgroundColor};
     width:${_SensorNum[ProjectResource.styleMode].divWidth};
     height:${_SensorNum[ProjectResource.styleMode].divHeight};
     color:${_SensorNum[ProjectResource.styleMode].divColor};
     line-height:${_SensorNum[ProjectResource.styleMode].divLineHeight};
     border-radius: 20px;
     font-size:10px;
     font-family: Pretendard;
     font-weight: '400';
     text-align: center;
     margin-right: 10px;
`;

/******************************************************************/

export const _ArrowDownIcon = {
    busan: {
        iconDisplay: 'inline-block',
        iconWidth: '21px',
        iconHeight: '21px',
        iconRotate: '180deg',
        imgBackground: 'url("./../../resource/image/sdms/arrowDown.png")no-repeat center center',
    },
    yeosu: {
        iconDisplay: 'inline-block',
        iconWidth: '21px',
        iconHeight: '21px',
        iconRotate: '180deg',
        imgBackground: 'url("./../../resource/image/sdms/arrowDown.png")no-repeat center center',
    }
}

export const ArrowDownIcon = styled.div`
    display:${_ArrowDownIcon[ProjectResource.styleMode].iconDisplay};
    width:${_ArrowDownIcon[ProjectResource.styleMode].iconWidth};
    height:${_ArrowDownIcon[ProjectResource.styleMode].iconHeight};
    //rotate:${_ArrowDownIcon[ProjectResource.styleMode].iconRotate};
    transform: rotate(180deg);
    background:${_ArrowDownIcon[ProjectResource.styleMode].imgBackground};
    background-size: 12px;
    float:right;
`

/*****************************************************************/

export const _ArrowUpIcon = {
    busan: {
        iconDisplay: 'inline-block',
        iconWidth: '21px',
        iconHeight: '21px',
        imgBackground: 'url("./../../resource/image/sdms/arrowDown.png")no-repeat',
    },
    yeosu: {
        iconDisplay: 'inline-block',
        iconWidth: '21px',
        iconHeight: '21px',
        imgBackground: 'url("./../../resource/image/sdms/arrowDown.png")no-repeat',
    }
}

export const ArrowUpIcon = styled.div`
    display:${_ArrowUpIcon[ProjectResource.styleMode].iconDisplay};
    width:${_ArrowUpIcon[ProjectResource.styleMode].iconWidth};
    height:${_ArrowUpIcon[ProjectResource.styleMode].iconHeight};
    //rotate:${_ArrowUpIcon[ProjectResource.styleMode].iconRotate};
    background:${_ArrowUpIcon[ProjectResource.styleMode].imgBackground};
    background-position: center center;
    //background-position-x: 10px;
    //background-position-y: 14px;
    background-size: 12px;
    float:right;
`

/*****************************************************************/

export const _BellIconActive = {
    busan: {
        iconDisplay: 'inline-block',
        iconWidth: '22px',
        iconHeight: '21px',
        imgBackground: 'url("./../../resource/image/sdms/bellActive.png")no-repeat',
    },
    yeosu: {
        iconDisplay: 'inline-block',
        iconWidth: '22px',
        iconHeight: '21px',
        imgBackground: 'url("./../../resource/image/sdms/bellActive.png")no-repeat',
    }
}

export const BellIconActive = styled.div`
    display:${_BellIconActive[ProjectResource.styleMode].iconDisplay};
    width:${_BellIconActive[ProjectResource.styleMode].iconWidth};
    height:${_BellIconActive[ProjectResource.styleMode].iconHeight};
    background:${_BellIconActive[ProjectResource.styleMode].imgBackground};
    background-size:16px;
    float:right;

`

/****************************************************************/

export const _BellIconDisable = {
    busan: {
        iconDisplay: 'inline-block',
        iconWidth: '22px',
        iconHeight: '21px',
        imgBackground: 'url("./../../resource/image/sdms/bellDisable.png")no-repeat',
    },
    yeosu: {
        iconDisplay: 'inline-block',
        iconWidth: '22px',
        iconHeight: '21px',
        imgBackground: 'url("./../../resource/image/sdms/bellDisable.png")no-repeat',
    }
}


export const BellIconDisable = styled.div`
    display:${_BellIconDisable[ProjectResource.styleMode].iconDisplay};
    width:${_BellIconDisable[ProjectResource.styleMode].iconWidth};
    height:${_BellIconDisable[ProjectResource.styleMode].iconHeight};
    background:${_BellIconDisable[ProjectResource.styleMode].imgBackground};
    background-size:16px;
    float:right;

`

/*****************************************************************/

export const _SensorIconActive = {
    busan: {
        iconDisplay: 'inline-block',
        iconWidth: '22px',
        iconHeight: '21px',
        imgBackground: 'url("./../../resource/image/sdms/sensorIcon.png")no-repeat center',
    },
    yeosu: {
        iconDisplay: 'inline-block',
        iconWidth: '22px',
        iconHeight: '21px',
        imgBackground: 'url("./../../resource/image/sdms/sensorIcon.png")no-repeat center',
    }
}

export const SensorIconActive = styled.div`
    display:${_SensorIconActive[ProjectResource.styleMode].iconDisplay};
    width:${_SensorIconActive[ProjectResource.styleMode].iconWidth};
    height:${_SensorIconActive[ProjectResource.styleMode].iconHeight};
    background:${_SensorIconActive[ProjectResource.styleMode].imgBackground};
    background-size:16px;
    float:right;
    margin-right: 6px;

`

/****************************************************************/

export const _SensorIconDisable = {
    busan: {
        iconDisplay: 'inline-block',
        iconWidth: '22px',
        iconHeight: '21px',
        imgBackground: 'url("./../../resource/image/sdms/sensorIcon_Disable.png")no-repeat center center',
    },
    yeosu: {
        iconDisplay: 'inline-block',
        iconWidth: '22px',
        iconHeight: '21px',
        imgBackground: 'url("./../../resource/image/sdms/sensorIcon_Disable.png")no-repeat center center',
    }
}


export const SensorIconDisable = styled.div`
    display:${_SensorIconDisable[ProjectResource.styleMode].iconDisplay};
    width:${_SensorIconDisable[ProjectResource.styleMode].iconWidth};
    height:${_SensorIconDisable[ProjectResource.styleMode].iconHeight};
    background:${_SensorIconDisable[ProjectResource.styleMode].imgBackground};
    background-size:16px;
    float:right;
    margin-right: 6px;
`

/****************************************************************/


export const _BlueCircle = {
    busan: {
        iconDisplay: 'inline-block',
        iconWidth: '10px',
        iconHeight: '8px',
        iconBackgroundColor: '#19A5FF',
    },
    yeosu: {
        iconDisplay: 'inline-block',
        iconWidth: '10px',
        iconHeight: '8px',
        iconBackgroundColor: '#19A5FF',
    }
}

export const BlueCircle = styled.div`
    display:${_BlueCircle[ProjectResource.styleMode].iconDisplay};
    width:${_BlueCircle[ProjectResource.styleMode].iconWidth};
    height:${_BlueCircle[ProjectResource.styleMode].iconHeight};
    background-color:${_BlueCircle[ProjectResource.styleMode].iconBackgroundColor};
    border-radius: 50%;
    margin-right: 5px;
`

/****************************************************************/

export const _RedCircle = {
    busan: {
        iconDisplay: 'inline-block',
        iconWidth: '10px',
        iconHeight: '8px',
        iconBackgroundColor: '#FF5A5A',
    },
    yeosu: {
        iconDisplay: 'inline-block',
        iconWidth: '10px',
        iconHeight: '8px',
        iconBackgroundColor: '#FF5A5A',
    }
}

export const RedCircle = styled.div`
    display:${_RedCircle[ProjectResource.styleMode].iconDisplay};
    width:${_RedCircle[ProjectResource.styleMode].iconWidth};
    height:${_RedCircle[ProjectResource.styleMode].iconHeight};
    background-color:${_RedCircle[ProjectResource.styleMode].iconBackgroundColor};
    border-radius: 50%;
    margin-right: 5px;
`

/****************************************************************/

export const _GrayCircle = {
    busan: {
        iconDisplay: 'inline-block',
        iconWidth: '10px',
        iconHeight: '8px',
        iconBackgroundColor: '#808080',
    },
    yeosu: {
        iconDisplay: 'inline-block',
        iconWidth: '10px',
        iconHeight: '8px',
        iconBackgroundColor: '#808080',
    }
}

export const GrayCircle = styled.div`
    display:${_GrayCircle[ProjectResource.styleMode].iconDisplay};
    width:${_GrayCircle[ProjectResource.styleMode].iconWidth};
    height:${_GrayCircle[ProjectResource.styleMode].iconHeight};
    background-color:${_GrayCircle[ProjectResource.styleMode].iconBackgroundColor};
    border-radius: 50%;
    margin-right: 5px; 
`
/***************************************************************/


export const _FactoryIcon = {
    busan: {
        iconDisplay: 'inline-block',
        iconWidth: '16px',
        iconHeight: '16px',
        imgBackground: 'url("./../../resource/image/sdms/factoryDis.png")',
    },
    yeosu: {
        iconDisplay: 'inline-block',
        iconWidth: '16px',
        iconHeight: '16px',
        imgBackground: 'url("./../../resource/image/sdms/factoryDis.png")',
    }
}

export const FactoryIcon = styled.div`
    display:${_FactoryIcon[ProjectResource.styleMode].iconDisplay};
    width:${_FactoryIcon[ProjectResource.styleMode].iconWidth};
    height:${_FactoryIcon[ProjectResource.styleMode].iconHeight};
    background:${_FactoryIcon[ProjectResource.styleMode].imgBackground};
    background-size: 16px;
    margin-right: 10px;
`

/***************************************************************/

export const _C360Icon = {
    busan: {
        iconDisplay: 'inline-block',
        iconWidth: '20px',
        iconHeight: '15px',
        imgBackground: 'url("./../../resource/image/sdms/360Icon.png")no-repeat center center',
    },
    yeosu: {
        iconDisplay: 'inline-block',
        iconWidth: '20px',
        iconHeight: '15px',
        imgBackground: 'url("./../../resource/image/sdms/360Icon.png")no-repeat center center',
    }
}

export const C360Icon = styled.div`
    display:${_C360Icon[ProjectResource.styleMode].iconDisplay};
    width:${_C360Icon[ProjectResource.styleMode].iconWidth};
    height:${_C360Icon[ProjectResource.styleMode].iconHeight};
    background:${_C360Icon[ProjectResource.styleMode].imgBackground};
    background-size: 14px;
    background-position: center;
    margin-right: 10px;
`

/***************************************************************/

export const _C360IconAct = {
    busan: {
        iconDisplay: 'inline-block',
        iconWidth: '20px',
        iconHeight: '15px',
        imgBackground: 'url("./../../resource/image/sdms/360Icon_active.png")no-repeat center center',
    },
    yeosu: {
        iconDisplay: 'inline-block',
        iconWidth: '20px',
        iconHeight: '15px',
        imgBackground: 'url("./../../resource/image/sdms/360Icon_active.png")no-repeat center center',
    }
}

export const C360IconAct = styled.div`
    display:${_C360IconAct[ProjectResource.styleMode].iconDisplay};
    width:${_C360IconAct[ProjectResource.styleMode].iconWidth};
    height:${_C360IconAct[ProjectResource.styleMode].iconHeight};
    background:${_C360IconAct[ProjectResource.styleMode].imgBackground};
    background-size: 14px;
    background-position: center;
    margin-right: 10px;
`

/***************************************************************/

export const _C360IconAlarm = {
    busan: {
        iconDisplay: 'inline-block',
        iconWidth: '20px',
        iconHeight: '15px',
        imgBackground: 'url("./../../resource/image/sdms/360Icon_active2.png")no-repeat center center',
    },
    yeosu: {
        iconDisplay: 'inline-block',
        iconWidth: '20px',
        iconHeight: '15px',
        imgBackground: 'url("./../../resource/image/sdms/360Icon_active2.png")no-repeat center center',
    }
}

export const C360IconAlarm = styled.div`
    display:${_C360IconAlarm[ProjectResource.styleMode].iconDisplay};
    width:${_C360IconAlarm[ProjectResource.styleMode].iconWidth};
    height:${_C360IconAlarm[ProjectResource.styleMode].iconHeight};
    background:${_C360IconAlarm[ProjectResource.styleMode].imgBackground};
    background-size: 14px;
    background-position: center;
    margin-right: 10px;
`

/***************************************************************/


export const _VOCSIcon = {
    busan: {
        iconDisplay: 'inline-block',
        iconWidth: '20px',
        iconHeight: '15px',
        imgBackground: 'url("./../../resource/image/sdms/vocIcon.png")no-repeat center center',
    },
    yeosu: {
        iconDisplay: 'inline-block',
        iconWidth: '20px',
        iconHeight: '15px',
        imgBackground: 'url("./../../resource/image/sdms/vocIcon.png")no-repeat center center',
    }
}

export const VOCSIcon = styled.div`
    display:${_VOCSIcon[ProjectResource.styleMode].iconDisplay};
    width:${_VOCSIcon[ProjectResource.styleMode].iconWidth};
    height:${_VOCSIcon[ProjectResource.styleMode].iconHeight};
    background:${_VOCSIcon[ProjectResource.styleMode].imgBackground};
    background-size: 14px;
    background-position: center;
    margin-right: 10px;
`

/***************************************************************/


export const _VOCSIconAct = {
    busan: {
        iconDisplay: 'inline-block',
        iconWidth: '20px',
        iconHeight: '15px',
        imgBackground: 'url("./../../resource/image/sdms/vocIconClicked.png")no-repeat center center',
    },
    yeosu: {
        iconDisplay: 'inline-block',
        iconWidth: '20px',
        iconHeight: '15px',
        imgBackground: 'url("./../../resource/image/sdms/vocIconClicked.png")no-repeat center center',
    }
}

export const VOCSIconAct = styled.div`
    display:${_VOCSIconAct[ProjectResource.styleMode].iconDisplay};
    width:${_VOCSIconAct[ProjectResource.styleMode].iconWidth};
    height:${_VOCSIconAct[ProjectResource.styleMode].iconHeight};
    background:${_VOCSIconAct[ProjectResource.styleMode].imgBackground};
    background-size: 14px;
    background-position: center;
    margin-right: 10px;
`

/***************************************************************/


export const _VOCSIconAlarm = {
    busan: {
        iconDisplay: 'inline-block',
        iconWidth: '20px',
        iconHeight: '15px',
        imgBackground: 'url("./../../resource/image/sdms/vocIconAlarm.png")no-repeat center center',
    },
    yeosu: {
        iconDisplay: 'inline-block',
        iconWidth: '20px',
        iconHeight: '15px',
        imgBackground: 'url("./../../resource/image/sdms/vocIconAlarm.png")no-repeat center center',
    }
}

export const VOCSIconAlarm = styled.div`
    display:${_VOCSIconAlarm[ProjectResource.styleMode].iconDisplay};
    width:${_VOCSIconAlarm[ProjectResource.styleMode].iconWidth};
    height:${_VOCSIconAlarm[ProjectResource.styleMode].iconHeight};
    background:${_VOCSIconAlarm[ProjectResource.styleMode].imgBackground};
    background-size: 14px;
    background-position: center;
    margin-right: 10px;
`


/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/* 대기 상세정보창  */

export const _SensorInfoDetailBox = {
    busan: {
        divDisplay: 'block',
        divWidth: '373px',
        divHeight: '249px',
        divBackground: '#1A1A1A',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '373px',
        divHeight: '249px',
        divBackground: 'rgba(26,26,26,0.9)',
    }
}


export const SensorInfoDetailBox = styled.div`
    display:${_SensorInfoDetailBox[ProjectResource.styleMode].divDisplay};
    /* width:${_SensorInfoDetailBox[ProjectResource.styleMode].divWidth}; */
    /* height:${_SensorInfoDetailBox[ProjectResource.styleMode].divHeight}; */
    height: 100%;
    background:${_SensorInfoDetailBox[ProjectResource.styleMode].divBackground};
    border-radius:10px;
    padding: 15px;
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);

`;

/**************************************************************/


export const _ReferenceTime = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '69px',
        divHeight: '13px',
        divColor: '#808080',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '69px',
        divHeight: '13px',
        divColor: '#808080',
    }
}

export const ReferenceTime = styled.div`
    display:${_ReferenceTime[ProjectResource.styleMode].divDisplay};
    width:${_ReferenceTime[ProjectResource.styleMode].divWidth};
    height:${_ReferenceTime[ProjectResource.styleMode].divHeight};
    color:${_ReferenceTime[ProjectResource.styleMode].divColor};
    font-size: 11px;
    font-family: Pretendard;
    position: relative;
    right: 8px
`

/*************************************************************/


export const _SensorNameA = {
    busan: {
        divDisplay: 'inline-block',
        divHeight: '16px',
        divColor: '#FFFFFF',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divHeight: '16px',
        divColor: '#FFFFFF',
    }
}

export const SensorNameA = styled.div`
    display:${_SensorNameA[ProjectResource.styleMode].divDisplay};
    height:${_SensorNameA[ProjectResource.styleMode].divHeight};
    color:${_SensorNameA[ProjectResource.styleMode].divColor};
    font-size: 12px;
    margin-right: 10px;
    font-family: Pretendard;
`

/************************************************************/


export const _SensorAddress = {
    busan: {
        divDisplay: 'inline-block',
        divHeight: '14px',
        divColor: '#FFFFFF',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divHeight: '14px',
        divColor: '#FFFFFF',
    }
}

export const SensorAddress = styled.div`
    display:${_SensorAddress[ProjectResource.styleMode].divDisplay};
    height:${_SensorAddress[ProjectResource.styleMode].divHeight};
    color:${_SensorAddress[ProjectResource.styleMode].divColor};
    font-size: 16px;
    font-family: Pretendard;
    margin: 0px 10px 0px 10px;
`

/***********************************************************/


export const _WeatherInfoBtn = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divHeight: '19px',
        divColor: '#FFFFFF',
        divBackground: '#19A5FF',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divHeight: '19px',
        divColor: '#FFFFFF',
        divBackground: '#19A5FF',
    }
}

export const WeatherInfoBtn = styled.div`
    display:${_WeatherInfoBtn[ProjectResource.styleMode].divDisplay};
    width:${_WeatherInfoBtn[ProjectResource.styleMode].divWidth};
    height:${_WeatherInfoBtn[ProjectResource.styleMode].divHeight};
    color:${_WeatherInfoBtn[ProjectResource.styleMode].divColor};
    background:${_WeatherInfoBtn[ProjectResource.styleMode].divBackground};
    border-radius: 5px;
    line-height: 19px;
    font-size: 10px;
    text-align: center;
    float: right;
`

/***********************************************************/

export const WeatherInfoVOCBtn = styled.div`
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
    position: relative;
    left: 58px;
`

/************************************************************/


export const _SensorItemBox = {
    busan: {
        divDisplay: 'block',
        divWidth: '344px',
        divHeight: '141px',
        divBackground: '#4d4d4d54',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '344px',
        divHeight: '141px',
        divBackground: '#4d4d4d54',
    }
}

export const SensorItemBox = styled.div`
    display:${_SensorItemBox[ProjectResource.styleMode].divDisplay};
    /* width:${_SensorItemBox[ProjectResource.styleMode].divWidth}; */
    /* height:${_SensorItemBox[ProjectResource.styleMode].divHeight}; */
    background:${_SensorItemBox[ProjectResource.styleMode].divBackground};
    width: 100%; 
    border-radius: 5px;
    margin-top: 20px;
    font-size: 12px;

    /********************************************************/

   .skillProgress{
        border-radius: 10px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.089);   
    }

    .progress{
        padding : 5px;
        border-radius: 3px;
    }

    .progressLevel{
        height: 16px;
        background : linear-gradient(to right, rgb(0, 255, 255), rgb(0, 93, 233));  
	    clip-path: polygon(0% 0%, 100% 0, 100% 0%, 92% 100%, 0% 100%);
        animation: ani;
        animation-duration: 1s;                              

        animation-fill-mode: both;
    }

    @keyframes ani{
        0%{
           width: 0;   /*시작할 때만 width가 0이게만 하면 됨*/
        }
    }

    /********************************************************/

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
`

/*************************************************************/


export const _DivideLine = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '2px',
        divHeight: '14px',
        divBackground: '#808080',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '2px',
        divHeight: '14px',
        divBackground: '#808080',
    }
}

export const DivideLine = styled.div`
    display:${_DivideLine[ProjectResource.styleMode].divDisplay};
    width:${_DivideLine[ProjectResource.styleMode].divWidth};
    height:${_DivideLine[ProjectResource.styleMode].divHeight};
    background:${_DivideLine[ProjectResource.styleMode].divBackground};

`

/*************************************************************/


export const _WeatherInfoPop = {
    busan: {
        divDisplay: 'block',
        divWidth: '170px',
        divHeight: '132px',
        divBackground: '#1A1A1A',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '170px',
        divHeight: '132px',
        divBackground: 'rgba(26,26,26,0.8)',
    }
}

export const WeatherInfoPop = styled.div`
    display:${_WeatherInfoPop[ProjectResource.styleMode].divDisplay};
    width:${_WeatherInfoPop[ProjectResource.styleMode].divWidth};
    /* height:${_WeatherInfoPop[ProjectResource.styleMode].divHeight}; */
    background:${_WeatherInfoPop[ProjectResource.styleMode].divBackground};
    border-radius: 10px;
    padding: 10px;
`

/************************************************************/


export const _WeatherMiniBox = {
    busan: {
        divDisplay: 'block',
        divWidth: '70px',
        divHeight: '66px',
        divBackground: '#1A1A1A',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '70px',
        divHeight: '66px',
        divBackground: 'rgba(26,26,26,0.8)',
    }
}

export const WeatherMiniBox = styled.div`
    display:${_WeatherMiniBox[ProjectResource.styleMode].divDisplay};
    width:${_WeatherMiniBox[ProjectResource.styleMode].divWidth};
    /* height:${_WeatherMiniBox[ProjectResource.styleMode].divHeight}; */
    /* background:${_WeatherMiniBox[ProjectResource.styleMode].divBackground}; */
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
`

/************************************************************/

export const _WeatherTri = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '8px',
        divHeight: '14px',
        divBackground: '#1A1A1A',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '8px',
        divHeight: '14px',
        divBackground: 'rgba(26,26,26,0.8)',
    }
}

export const WeatherTri = styled.div`
    display:${_WeatherTri[ProjectResource.styleMode].divDisplay};
    /* width:${_WeatherTri[ProjectResource.styleMode].divWidth};
    height:${_WeatherTri[ProjectResource.styleMode].divHeight}; */
    background:${_WeatherTri[ProjectResource.styleMode].divBackground};
    
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
`

/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/* dash Message창 */


export const _SensorDashBox = {
    busan: {
        divDisplay: 'flex',
        divWidth: '1367px',
        divHeight: '40px',
        divBackground: '#1A1A1A',
        divBorderRadius: '20px',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '1367px',
        divHeight: '40px',
        divBackground: '#1A1A1A',
        divBorderRadius: '20px',
    }
}

export const SensorDashBox = styled.div`
    display:${_SensorDashBox[ProjectResource.styleMode].divDisplay};
    width:${_SensorDashBox[ProjectResource.styleMode].divWidth};
    height:${_SensorDashBox[ProjectResource.styleMode].divHeight};
    /* background:${_SensorDashBox[ProjectResource.styleMode].divBackground}; */
    border-radius:${_SensorDashBox[ProjectResource.styleMode].divBorderRadius};
    line-height: 40px;
    padding: 0px 24px;

    background: rgba(26, 26, 26, 0.9);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);

`

/************************************************************/


export const _SensorDashTitle = {
    busan: {
        divDisplay: 'block',
        divWidth: '80px',
        divColor: '#fff',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '80px',
        divColor: '#fff',
    }
}

export const SensorDashTitle = styled.div`
    display:${_SensorDashTitle[ProjectResource.styleMode].divDisplay};
    width: ${_SensorDashTitle[ProjectResource.styleMode].divWidth};
    color:${_SensorDashTitle[ProjectResource.styleMode].divColor};
    font-family: Pretendard;
    font-size: 18px;
`

/************************************************************/


export const _SensorSensing = {
    busan: {
        divDisplay: 'block',
        divWidth: '104px',
        divHeight: '32px',
        divBackground: 'linear-gradient(to bottom, #19A5FF, #0D5380)',
        divBorderRadius: '20px',
        divColor: '#fff',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '104px',
        divHeight: '32px',
        /*divBackground: 'linear-gradient(to bottom, #19A5FF, #0D5380)',*/
        divBorderRadius: '20px',
        divColor: '#fff',
    }
}

export const SensorSensing = styled.div`
    display:${_SensorSensing[ProjectResource.styleMode].divDisplay};
    width:${_SensorSensing[ProjectResource.styleMode].divWidth};
    height:${_SensorSensing[ProjectResource.styleMode].divHeight};
    background:${_SensorSensing[ProjectResource.styleMode].divBackground};
    border-radius:${_SensorSensing[ProjectResource.styleMode].divBorderRadius};
    color:${_SensorSensing[ProjectResource.styleMode].divColor};
    line-height: 32px;
    text-align: center;
    margin: 4px 20px;
    font-family: Pretendard;
`

/************************************************************/


export const _SensorEventConts = {
    busan: {
        divDisplay: 'block',
        divWidth: '100%',
        divColor: '#fff',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '100%',
        divColor: '#fff',
    }
}

export const SensorEventConts = styled.div`
    display:${_SensorEventConts[ProjectResource.styleMode].divDisplay};
    width:${_SensorEventConts[ProjectResource.styleMode].divWidth};
    color:${_SensorEventConts[ProjectResource.styleMode].divColor};
    font-family: Pretendard;
    font-size:16px;
`

/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/

/* 하단바 Menu */


export const _ModeMenu = {
    busan: {
        divDisplay: 'flex',
        divWidth: '467px',
        divHeight: '54px',
        divBorderRadius: '30px',
        divBackgroundImage: 'linear-gradient(#393939, #1d1d1d)',
        divColor: '#fff',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '587px',
        divHeight: '54px',
        divBorderRadius: '30px',
        divBackgroundImage: 'linear-gradient(#393939, #1d1d1d)',
        divColor: '#fff',
    }
}

export const ModeMenu = styled.div`
    display:${_ModeMenu[ProjectResource.styleMode].divDisplay};
    width:${_ModeMenu[ProjectResource.styleMode].divWidth};
    height:${_ModeMenu[ProjectResource.styleMode].divHeight};
    border-radius:${_ModeMenu[ProjectResource.styleMode].divBorderRadius};
    background-image:${_ModeMenu[ProjectResource.styleMode].divBackgroundImage};
    box-shadow: inset 0px 2px 4px #FFFFFF0F, 0px 5px 6px #0000004D;
    color:${_ModeMenu[ProjectResource.styleMode].divColor};
    /* padding: 0px 32px; */  
    position: fixed;
    left: 50%;
    bottom: 20px;
    margin-left: -250px;
    align-items: center;

`

/****************************************************************/


export const _StatusTab = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '20px',
        divHeight: '28px',
        imgBackground: 'url("./../../resource/image/sdms/sensorPop_active.png") no-repeat center center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '20px',
        divHeight: '28px',
        imgBackground: 'url("./../../resource/image/sdms/sensorPop_active.png") no-repeat center center',
        imgBackgroundAct: 'url("./../../resource/image/sdms/sensorPop_active.png") no-repeat center center',
    }
}

export const StatusTab = styled.div`
    display:${_StatusTab[ProjectResource.styleMode].divDisplay};
    /* width:${_StatusTab[ProjectResource.styleMode].divWidth};
    height:${_StatusTab[ProjectResource.styleMode].divHeight}; */
    width: 20px;
    height: 28px;
    margin-left: 35px;
    /* background:${_StatusTab[ProjectResource.styleMode].imgBackground};
    &:hover{
      background:${_StatusTab[ProjectResource.styleMode].imgBackgroundAct};
    } */

    background: url(${StatusTabImage})no-repeat center center;
`

/****************************************************************/


export const _StatusTabDis = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '20px',
        divHeight: '28px',
        imgBackground: 'url("./../../resource/image/sdms/sensorPop_disable.png") no-repeat center center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '20px',
        divHeight: '28px',
        imgBackground: 'url("./../../resource/image/sdms/sensorPop_disable.png") no-repeat center center',
        imgBackgroundAct: 'url("./../../resource/image/sdms/sensorPop_disable.png") no-repeat center center',
    }
}

export const StatusTabDis = styled.div`
    display:${_StatusTabDis[ProjectResource.styleMode].divDisplay};
    /* width:${_StatusTabDis[ProjectResource.styleMode].divWidth};
    height:${_StatusTabDis[ProjectResource.styleMode].divHeight}; */
    width: 20px;
    height: 28px;
    margin-left: 35px;
    /* background:${_StatusTabDis[ProjectResource.styleMode].imgBackground};
    &:hover{
       background:${_StatusTabDis[ProjectResource.styleMode].imgBackgroundAct};
    } */

    background: url(${StatusTabDisImage})no-repeat center center;
`

/****************************************************************/


export const _EventTab = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '27px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/eventPop_active.png") no-repeat center center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '27px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/eventPop_active.png") no-repeat center center',
        imgBackgroundAct: 'url("./../../resource/image/sdms/eventPop_active.png") no-repeat center center',
    }
}

export const EventTab = styled.div`
    display:${_EventTab[ProjectResource.styleMode].divDisplay};
    /* width:${_EventTab[ProjectResource.styleMode].divWidth};
    height:${_EventTab[ProjectResource.styleMode].divHeight}; */
    width: 27px;
    height: 30px;
    margin-left: 34px;
    /* background:${_EventTab[ProjectResource.styleMode].imgBackground};
    &:hover{
      background:${_EventTab[ProjectResource.styleMode].imgBackgroundAct};
    } */

    background: url(${EventTabImage})no-repeat center center;
`

/****************************************************************/


export const _EventTabDis = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '27px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/eventPop_disable.png") no-repeat center center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '27px',
        divHeight: '30px',
        imgBackground: 'url("./../../resource/image/sdms/eventPop_disable.png") no-repeat center center',
        imgBackgroundAct: 'url("./../../resource/image/sdms/eventPop_disable.png") no-repeat center center',
    }
}

export const EventTabDis = styled.div`
    display:${_EventTabDis[ProjectResource.styleMode].divDisplay};
    /* width:${_EventTabDis[ProjectResource.styleMode].divWidth};
    height:${_EventTabDis[ProjectResource.styleMode].divHeight}; */
    width: 27px;
    height: 30px;
    margin-left: 34px;
    /* background:${_EventTabDis[ProjectResource.styleMode].imgBackground};
    &:hover{
       background:${_EventTabDis[ProjectResource.styleMode].imgBackgroundAct};
    } */

    background: url(${EventTabDisImage})no-repeat center center;
`

/****************************************************************/


export const _DataTab = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '29px',
        divHeight: '29px',
        imgBackground: 'url("./../../resource/image/sdms/network_active.png") no-repeat center center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '29px',
        divHeight: '29px',
        imgBackground: 'url("./../../resource/image/sdms/network_active.png") no-repeat center center',
        imgBackgroundAct: 'url("./../../resource/image/sdms/network_active.png") no-repeat center center',
    }
}

export const DataTab = styled.div`
    display:${_DataTab[ProjectResource.styleMode].divDisplay};
    /* width:${_DataTab[ProjectResource.styleMode].divWidth};
    height:${_DataTab[ProjectResource.styleMode].divHeight}; */
    width: 29px;
    height: 29px;
    margin-left: 35px;
    /* margin-right: 35px; */
    /* background:${_DataTab[ProjectResource.styleMode].imgBackground};
    &:hover{
      background:${_DataTab[ProjectResource.styleMode].imgBackgroundAct};
    } */

    background: url(${DataTabImage})no-repeat center center;
`

/****************************************************************/


export const _DataTabDis = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '29px',
        divHeight: '29px',
        imgBackground: 'url("./../../resource/image/sdms/network_disable.png") no-repeat center center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '29px',
        divHeight: '29px',
        imgBackground: 'url("./../../resource/image/sdms/network_disable.png") no-repeat center center',
        imgBackgroundAct: 'url("./../../resource/image/sdms/network_disable.png") no-repeat center center',
    }
}

export const DataTabDis = styled.div`
    display:${_DataTabDis[ProjectResource.styleMode].divDisplay};
    /* width:${_DataTabDis[ProjectResource.styleMode].divWidth};
    height:${_DataTabDis[ProjectResource.styleMode].divHeight}; */
    width: 29px;
    height: 29px;
    line-height:${_DataTabDis[ProjectResource.styleMode].divLineHeight};
    margin-left: 35px;
    /* margin-right: 35px; */
    /* background:${_DataTabDis[ProjectResource.styleMode].imgBackground};
    &:hover{
      background:${_DataTabDis[ProjectResource.styleMode].imgBackgroundAct};
    } */

    background: url(${DataTabDisImage})no-repeat center center;
`

/****************************************************************/


export const _DetailTab = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '33px',
        divHeight: '29px',
        imgBackground: 'url("./../../resource/image/sdms/sPop_active.png") no-repeat center center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '33px',
        divHeight: '29px',
        imgBackground: 'url("./../../resource/image/sdms/simulator_active.png") no-repeat center center',
        imgBackgroundAct: 'url("./../../resource/image/sdms/simulator_active.png") no-repeat center center',
    }
}

export const DetailTab = styled.div`
    display:${_DetailTab[ProjectResource.styleMode].divDisplay};
    /* width:${_DetailTab[ProjectResource.styleMode].divWidth};
    height:${_DetailTab[ProjectResource.styleMode].divHeight}; */
    width: 33px;
    height: 29px;
    margin-left: 35px;
    /* margin-right: 28px; */
    /* background:${_DetailTab[ProjectResource.styleMode].imgBackground};
    &:hover{
      background:${_DetailTab[ProjectResource.styleMode].imgBackgroundAct};
    } */

    background: url(${DetailTabImage})no-repeat center center;
`

/****************************************************************/


export const _DetailTabDis = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '33px',
        divHeight: '29px',
        imgBackground: 'url("./../../resource/image/sdms/simulator_disable.png") no-repeat center center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '33px',
        divHeight: '29px',
        imgBackground: 'url("./../../resource/image/sdms/simulator_disable.png") no-repeat center center',
        imgBackgroundAct: 'url("./../../resource/image/sdms/simulator_disable.png") no-repeat center center',
    }
}

export const DetailTabDis = styled.div`
    display:${_DetailTabDis[ProjectResource.styleMode].divDisplay};
    /* width:${_DetailTabDis[ProjectResource.styleMode].divWidth};
    height:${_DetailTabDis[ProjectResource.styleMode].divHeight}; */
    width: 33px;
    height: 29px;
    margin-left: 35px;
    /* margin-right: 28px; */
    /* background:${_DetailTabDis[ProjectResource.styleMode].imgBackground};
    &:hover{
      background:${_DetailTabDis[ProjectResource.styleMode].imgBackgroundAct};
    } */

    background: url(${DetailTabDisImage})no-repeat center center;
`


/****************************************************************/


export const _MiniTab = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '28px',
        divHeight: '28px',
        imgBackground: 'url("./../../resource/image/sdms/miniPop2_active.png") no-repeat center center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '28px',
        divHeight: '28px',
        imgBackground: 'url("./../../resource/image/sdms/miniPop2_active.png") no-repeat center center',
        imgBackgroundAct: 'url("./../../resource/image/sdms/miniPop2_active.png") no-repeat center center',
    }
}

export const MiniTab = styled.div`
    display:${_MiniTab[ProjectResource.styleMode].divDisplay};
    /* width:${_MiniTab[ProjectResource.styleMode].divWidth};
    height:${_MiniTab[ProjectResource.styleMode].divHeight}; */
    width: 28px;
    height: 28px;
    margin-left: 35px;
    /* background:${_MiniTab[ProjectResource.styleMode].imgBackground};
    &:hover{
      background:${_MiniTab[ProjectResource.styleMode].imgBackgroundAct};
    } */

    background: url(${MiniTabImage})no-repeat center center;
`

/****************************************************************/


export const _MiniTabDis = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '28px',
        divHeight: '28px',
        imgBackground: 'url("./../../resource/image/sdms/miniPop2_disable.png") no-repeat center center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '28px',
        divHeight: '28px',
        imgBackground: 'url("./../../resource/image/sdms/miniPop2_disable.png") no-repeat center center',
        imgBackgroundAct: 'url("./../../resource/image/sdms/miniPop2_disable.png") no-repeat center center',
    }
}

export const MiniTabDis = styled.div`
    display:${_MiniTabDis[ProjectResource.styleMode].divDisplay};
    /* width:${_MiniTabDis[ProjectResource.styleMode].divWidth};
    height:${_MiniTabDis[ProjectResource.styleMode].divHeight}; */
    width: 28px;
    height: 28px;
    margin-left: 35px;
    /* background:${_MiniTabDis[ProjectResource.styleMode].imgBackground};
    &:hover{
      background:${_MiniTabDis[ProjectResource.styleMode].imgBackgroundAct};
    } */

    background: url(${MiniTabDisImage})no-repeat center center;
`

/****************************************************************/

export const _NavTab = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '28px',
        divHeight: '28px',
        imgBackground: 'url("./../../resource/image/sdms/navigation2_active.png") no-repeat center center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '28px',
        divHeight: '28px',
        imgBackground: 'url("./../../resource/image/sdms/navigation2_active.png") no-repeat center center',
        imgBackgroundAct: 'url("./../../resource/image/sdms/navigation2_active.png") no-repeat center center',
    }
}

export const NavTab = styled.div`
    display:${_NavTab[ProjectResource.styleMode].divDisplay};
    width:${_NavTab[ProjectResource.styleMode].divWidth};
    height:${_NavTab[ProjectResource.styleMode].divHeight};
    margin-left: 34px;
    /* background:${_NavTab[ProjectResource.styleMode].imgBackground};
    &:hover{
      background:${_NavTab[ProjectResource.styleMode].imgBackgroundAct};
    } */

    background: url(${NavTabImage})no-repeat center center;
`

/****************************************************************/


export const _NavTabDis = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '28px',
        divHeight: '28px',
        imgBackground: 'url("./../../resource/image/sdms/navigation2_disable.png") no-repeat center center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '28px',
        divHeight: '28px',
        imgBackground: 'url("./../../resource/image/sdms/navigation2_disable.png") no-repeat center center',
        imgBackgroundAct: 'url("./../../resource/image/sdms/navigation2_active.png") no-repeat center center',
    }
}

export const NavTabDis = styled.div`
    display:${_NavTabDis[ProjectResource.styleMode].divDisplay};
    width:${_NavTabDis[ProjectResource.styleMode].divWidth};
    height:${_NavTabDis[ProjectResource.styleMode].divHeight};
    margin-left: 34px;
    /* background:${_NavTabDis[ProjectResource.styleMode].imgBackground};
    &:hover{
      background:${_NavTabDis[ProjectResource.styleMode].imgBackgroundAct};
    } */

    background: url(${NavTabDisImage})no-repeat center center;
`

/****************************************************************/


export const _PoiEditTab = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divHeight: '34px',
        imgBackground: 'url("./../../resource/image/sdms/edittool_active.png") no-repeat center center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divHeight: '34px',
        imgBackground: 'url("./../../resource/image/sdms/edittool_active.png") no-repeat center center',
        imgBackgroundAct: 'url("./../../resource/image/sdms/edittool_active.png") no-repeat center center',
    }
}

export const PoiEditTab = styled.div`
    display:${_PoiEditTab[ProjectResource.styleMode].divDisplay};
    /* width:${_PoiEditTab[ProjectResource.styleMode].divWidth};
    height:${_PoiEditTab[ProjectResource.styleMode].divHeight}; */
    /* background-size: 34px; */
    /* margin-right: 10px; */
    /* background:${_PoiEditTab[ProjectResource.styleMode].imgBackground};
    &:hover{
      background:${_PoiEditTab[ProjectResource.styleMode].imgBackgroundAct};
    } */
`

/****************************************************************/

export const _PoiEditTabDis = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divHeight: '54px',
        imgBackground: 'url("./../../resource/image/sdms/edittool_disable.png") no-repeat center center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divHeight: '54px',
        imgBackground: 'url("./../../resource/image/sdms/edittool_disable.png") no-repeat center center',
        imgBackgroundAct: 'url("./../../resource/image/sdms/edittool_active.png") no-repeat center center',
    }
}

export const PoiEditTabDis = styled.div`
    display:${_PoiEditTabDis[ProjectResource.styleMode].divDisplay};
    /* width:${_PoiEditTabDis[ProjectResource.styleMode].divWidth};
    height:${_PoiEditTabDis[ProjectResource.styleMode].divHeight}; */
    width: 34px;
    height: 34px;
    line-height:${_PoiEditTabDis[ProjectResource.styleMode].divLineHeight};
    /* background-size: 34px; */
    /* margin-right: 10px; */
    /* background:${_PoiEditTabDis[ProjectResource.styleMode].imgBackground};
    &:hover{
      background:${_PoiEditTabDis[ProjectResource.styleMode].imgBackgroundAct};
    } */
`

/****************************************************************/

export const _ModeChange = {
    busan: {
        divDisplay: 'block',
        divWidth: '144px',
        divHeight: '54px',
        divLineHeight: '54px',
        divBorderRadius: '30px',
        divBackgroundImage: 'linear-gradient(#45C4E9, #2F75CA, #1C30AE)',
        divColor: '#fff',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '144px',
        divHeight: '54px',
        divLineHeight: '54px',
        divBorderRadius: '30px',
        divBackgroundImage: 'linear-gradient(#45C4E9, #2F75CA, #1C30AE)',
        divColor: '#fff',
    }
}


export const ModeChange = styled.div`
    display:${_ModeChange[ProjectResource.styleMode].divDisplay};
    width:${_ModeChange[ProjectResource.styleMode].divWidth};
    height:${_ModeChange[ProjectResource.styleMode].divHeight};
    line-height:${_ModeChange[ProjectResource.styleMode].divLineHeight};
    border-radius:${_ModeChange[ProjectResource.styleMode].divBorderRadius};
    background-image:${_ModeChange[ProjectResource.styleMode].divBackgroundImage};
    color:${_ModeChange[ProjectResource.styleMode].divColor};
    text-align:center;
    font-size: 16px;
    /* margin: 0px 10px; */
    margin-left: 35px;
`


/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/* 상세정보창 */

export const _SensorDetailBox = {
    busan: {
        divDisplay: 'block',
        divWidth: '300px',
        divHeight: '200px',
        divColor: '#fff',
        divBackground: '#4d4d4d4d',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '300px',
        divHeight: '200px',
        divColor: '#fff',
        divBackground: '#4d4d4d4d',
    }
}

export const SensorDetailBox = styled.div`
    display:${_SensorDetailBox[ProjectResource.styleMode].divDisplay};
    /* width:${_SensorDetailBox[ProjectResource.styleMode].divWidth}; */
    height:${_SensorDetailBox[ProjectResource.styleMode].divHeight};
    color:${_SensorDetailBox[ProjectResource.styleMode].divColor};
    background:${_SensorDetailBox[ProjectResource.styleMode].divBackground};
    text-align: center;

    border-radius: 10px;
    > span:nth-child(1){
       display:block;
       padding-top: 70px;
       margin-bottom:12px;
    }
    > span:nth-child(2){
       display:block;
       font-size: 12px;
       font-weight: 200;
    }
`

/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/* 기상정보 팝업창 */


export const _WeatherInfoPops = {
    busan: {
        divDisplay: 'flex',
    },
    yeosu: {
        divDisplay: 'flex',
    }
}

export const WeatherInfoPops = styled.div`
    display:${_WeatherInfoPops[ProjectResource.styleMode].divDisplay};
`


/****************************************************************/

export const _WeatherTimeBox = {
    busan: {
        divDisplay: 'flex',
    },
    yeosu: {
        divDisplay: 'flex',
    }
}

export const WeatherTimeBox = styled.div`
    display:${_WeatherTimeBox[ProjectResource.styleMode].divDisplay};
    flex-direction: column;
    text-align: end;
`


/****************************************************************/

export const _WeatherYear = {
    busan: {
        divDisplay: 'block',
        divColor: '#fff',
        divFontSize: '15px',
    },
    yeosu: {
        divDisplay: 'block',
        divColor: '#fff',
        divFontSize: '15px',
    }
}

export const WeatherYear = styled.div`
    display:${_WeatherYear[ProjectResource.styleMode].divDisplay};
    color:${_WeatherYear[ProjectResource.styleMode].divColor};
    font-size:${_WeatherYear[ProjectResource.styleMode].divFontSize};
    margin-bottom: 10px;
    margin-top: 6px;
    font-family: Pretendard;
`


/****************************************************************/

export const _WeatherTime = {
    busan: {
        divDisplay: 'block',
        divFontSize: '10px',
        divColor: '#fff',
    },
    yeosu: {
        divDisplay: 'block',
        divFontSize: '15px',
        divColor: '#fff',
    }
}

export const WeatherTime = styled.div`
    display:${_WeatherTime[ProjectResource.styleMode].divDisplay};
    font-size:${_WeatherTime[ProjectResource.styleMode].divFontSize};
    color:${_WeatherTime[ProjectResource.styleMode].divColor};
    font-family: Pretendard;
`

/****************************************************************/


export const _WeatherIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divHeight: '50px',
        divBackground: 'url("./../../resource/image/weather/cloudyday2.png")',

    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divHeight: '50px',
        divBackground: 'url("./../../resource/image/weather/cloudyday2.png")',
    }
}

export const WeatherIcon = styled.div`
    display:${_WeatherIcon[ProjectResource.styleMode].divDisplay};
    width:${_WeatherIcon[ProjectResource.styleMode].divWidth};
    height:${_WeatherIcon[ProjectResource.styleMode].divHeight};
    background:${_WeatherIcon[ProjectResource.styleMode].divBackground};
    background-size: 50px;
    margin: 0 10px;
`

/****************************************************************/


export const _WeatherTem = {
    busan: {
        divDisplay: 'flex',
    },
    yeosu: {
        divDisplay: 'flex',
    }
}

export const WeatherTem = styled.div`
    display:${_WeatherTem[ProjectResource.styleMode].divDisplay};
`


/****************************************************************/

export const _WeatherCelsius1 = {
    busan: {
        divDisplay: 'flex',
        divFontSize: '15px',
        divColor: '#19A5FF',
    },
    yeosu: {
        divDisplay: 'flex',
        divFontSize: '15px',
        divColor: '#19A5FF',
    }
}

export const WeatherCelsius1 = styled.div`
    display:${_WeatherCelsius1[ProjectResource.styleMode].divDisplay};
    font-size:${_WeatherCelsius1[ProjectResource.styleMode].divFontSize};
    color:${_WeatherCelsius1[ProjectResource.styleMode].divColor};
    width: 50px;
    line-height: 50px;
    font-family: Pretendard;
    > span{
       display: inline-block;
       width: 10px;
       /* height: 10px; */
       background:url("./../../resource/image/weather/downTri.png") no-repeat;
       background-position-y: 20px;
    }
    > p{
       margin-left: 6px;
    }
`

/****************************************************************/


export const _WeatherCelsius2 = {
    busan: {
        divDisplay: 'flex',
        divFontSize: '15px',
        divColor: '#FF5A5A',
    },
    yeosu: {
        divDisplay: 'flex',
        divFontSize: '15px',
        divColor: '#FF5A5A',
    }
}

export const WeatherCelsius2 = styled.div`
    display:${_WeatherCelsius2[ProjectResource.styleMode].divDisplay};
    font-size:${_WeatherCelsius2[ProjectResource.styleMode].divFontSize};
    color:${_WeatherCelsius2[ProjectResource.styleMode].divColor};
    width: 50px;
    line-height: 50px;
    font-family: Pretendard;
    > span {
       display: inline-block;
       width: 10px;
       /* height: 10px; */
       background:url("./../../resource/image/weather/upTri.png") no-repeat;
       background-position-y: 20px;
    }
    > p {
       margin-left: 6px;
    }
`


/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/* 통합기상 팝업창 */


export const _WeatherDayBox = {
    busan: {
        divDisplay: 'block',
    },
    yeosu: {
        divDisplay: 'block',
    }
}

export const WeatherDayBox = styled.div`
    display:${_WeatherDayBox[ProjectResource.styleMode].divDisplay};
`

/************************************************************/


export const _DayBox = {
    busan: {
        divDisplay: 'flex',
        divWidth: '343px',
        divHeight: '100px',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '343px',
        divHeight: '100px',
    }
}

export const DayBox = styled.div`
    display:${_DayBox[ProjectResource.styleMode].divDisplay};
    width:${_DayBox[ProjectResource.styleMode].divWidth};
    height:${_DayBox[ProjectResource.styleMode].divHeight};
`

/************************************************************/

export const _DayNumArea = {
    busan: {
        divDisplay: 'inline-flex',
        divWidth: '100px',
        divHeight: '30px',
    },
    yeosu: {
        divDisplay: 'inline-flex',
        divWidth: '100px',
        divHeight: '30px',
    }
}

export const DayNumArea = styled.div`
    display:${_DayNumArea[ProjectResource.styleMode].divDisplay};
    /* width:${_DayNumArea[ProjectResource.styleMode].divWidth}; */
    /* height:${_DayNumArea[ProjectResource.styleMode].divHeight}; */
    text-align: center;
    flex-direction: column;
    align-self: center;
    flex-grow: 1;
    font-family: Pretendard;
    .DayYear{
       color:#ffffff;
       font-size: 16px;
       font-family: Pretendard;
       margin-bottom: 10px;
    }
    .DayTime{
       color:#ffffff;
       font-family: Pretendard;
       font-size: 13px;
    }

`

/************************************************************/


export const _DayIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '100px',
        divHeight: '100px',
        imgBackground: 'url("./../../resource/image/weather/cloudyday3.png")no-repeat center center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '100px',
        divHeight: '100px',
        imgBackground: 'url("./../../resource/image/weather/cloudyday3.png")no-repeat center center',
    }
}

export const DayIcon = styled.div`
    display:${_DayIcon[ProjectResource.styleMode].divDisplay};
    width:${_DayIcon[ProjectResource.styleMode].divWidth};
    height:${_DayIcon[ProjectResource.styleMode].divHeight};
    background:${_DayIcon[ProjectResource.styleMode].imgBackground};
    background-size: 100px;
`

/************************************************************/

export const _TemperatureArea = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '100%',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '100%',
    }
}

export const TemperatureArea = styled.div`
    display:${_TemperatureArea[ProjectResource.styleMode].divDisplay};
    /* width:${_TemperatureArea[ProjectResource.styleMode].divWidth}; */
    text-align:center;
    align-self:center;
    flex-grow: 1;
`

/************************************************************/

export const _TemBox = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '87px',
        divHeight: '13px',
        divBackground: '#7D7D7D7a',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '87px',
        divHeight: '13px',
        divBackground: '#7D7D7D7a',
    }
}

export const TemBox = styled.div`
    display:${_TemBox[ProjectResource.styleMode].divDisplay};
    width:${_TemBox[ProjectResource.styleMode].divWidth};
    /* height:${_TemBox[ProjectResource.styleMode].divHeight}; */
    background:${_TemBox[ProjectResource.styleMode].divBackground};
    border-radius: 7px; 
    text-align:center;
    line-height: 13px;
    margin-bottom: 10px;

    .TemInfoText1{
       display:inline-block; 
       font-size: 9px;
       color: #19A5FF;
       font-family: Pretendard;
       font-weight: 800;
       margin-right: 13px;
    }
    .TemInfoText2{
       display:inline-block;
       font-size: 9px;
       color: #FF5A5A;
       font-family: Pretendard;
       font-weight: 800;
    }
`

/************************************************************/

export const _TemDownIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '6px',
        divHeight: '5px',
        imgBackground: 'url("./../../resource/image/sdms/temDown.png")no-repeat',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '6px',
        divHeight: '5px',
        imgBackground: 'url("./../../resource/image/sdms/temDown.png")no-repeat',
    }
}

export const TemDownIcon = styled.div`
    display:${_TemDownIcon[ProjectResource.styleMode].divDisplay};
    width:${_TemDownIcon[ProjectResource.styleMode].divWidth};
    height:${_TemDownIcon[ProjectResource.styleMode].divHeight};
    background:${_TemDownIcon[ProjectResource.styleMode].imgBackground};
    margin-right: 6px;
    margin-bottom: 1.5px;
`

/************************************************************/


export const _TemUpIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '6px',
        divHeight: '5px',
        imgBackground: 'url("./../../resource/image/sdms/temUp.png")no-repeat',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '6px',
        divHeight: '5px',
        imgBackground: 'url("./../../resource/image/sdms/temUp.png")no-repeat',
    }
}

export const TemUpIcon = styled.div`
    display:${_TemUpIcon[ProjectResource.styleMode].divDisplay};
    width:${_TemUpIcon[ProjectResource.styleMode].divWidth};
    height:${_TemUpIcon[ProjectResource.styleMode].divHeight};
    background:${_TemUpIcon[ProjectResource.styleMode].imgBackground};
    margin-right: 6px;
    margin-bottom: 1.5px;
`

/************************************************************/

export const _TemNum = {
    busan: {
        divDisplay: 'block',
        divWidth: '55px',
        divHeight: '30px',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '55px',
        divHeight: '30px',
    }
}

export const TemNum = styled.div`
    display:${_TemNum[ProjectResource.styleMode].divDisplay};
    /* width:${_TemNum[ProjectResource.styleMode].divWidth}; */
    height:${_TemNum[ProjectResource.styleMode].divHeight};
    font-size: 24px;
    font-weight: 800;
    color: #fff;
`

/************************************************************/

export const _WeatherIconArea = {
    busan: {
        divDisplay: 'block',
        divHeight: '80px',
    },
    yeosu: {
        divDisplay: 'block',
        divHeight: '80px',
    }
}

export const WeatherIconArea = styled.div`
    display:${_WeatherIconArea[ProjectResource.styleMode].divDisplay};
    height:${_WeatherIconArea[ProjectResource.styleMode].divHeight};

`

/************************************************************/


export const _HumidityBox = {
    busan: {
        divDisplay: 'inline-flex',
        divWidth: '48px',
        divHeight: '80px',
    },
    yeosu: {
        divDisplay: 'inline-flex',
        divWidth: '48px',
        divHeight: '80px',
    }
}

export const HumidityBox = styled.div`
    display:${_HumidityBox[ProjectResource.styleMode].divDisplay};
    width:${_HumidityBox[ProjectResource.styleMode].divWidth};
    height:${_HumidityBox[ProjectResource.styleMode].divHeight};
    flex-direction: column;
    border:solid 1px #808080;
    margin-right: 10px;
    border-radius: 3px;
    text-align:center;
    padding: 10px 0px;
    &:hover{
      background-color: #4D4D4D;
      border:none;
    }
    &:active{
      background-color: #4D4D4D;
      border:none;
    }
    > span{
      color: #ffffff;
      font-size: 11px;
      font-family: Pretendard;
      padding: 6px 0px 14px 0px;
    }
    > p{
      color:#19A5FF;
      font-size: 11px;
      font-family: Pretendard;
    }
    &.abc{
      background: #4d4d4d6e;
      border: none;
    }
`

/************************************************************/


export const _HumidityIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '17px',
        divHeight: '12px',
        imgBackground: 'url("./../../resource/image/sdms/humidity.png")no-repeat',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '17px',
        divHeight: '12px',
        imgBackground: 'url("./../../resource/image/sdms/humidity.png")no-repeat',
    }
}

export const HumidityIcon = styled.div`
    display:${_HumidityIcon[ProjectResource.styleMode].divDisplay};
    /* width:${_HumidityIcon[ProjectResource.styleMode].divWidth}; */
    height:${_HumidityIcon[ProjectResource.styleMode].divHeight};
    background:${_HumidityIcon[ProjectResource.styleMode].imgBackground};
    background-position: center center;
    padding: 10px 0px 5px 0px;
`

/************************************************************/


export const _BarometricPressureBox = {
    busan: {
        divDisplay: 'inline-flex',
        divWidth: '48px',
        divHeight: '80px',
    },
    yeosu: {
        divDisplay: 'inline-flex',
        divWidth: '48px',
        divHeight: '80px',
    }
}

export const BarometricPressureBox = styled.div`
    display:${_BarometricPressureBox[ProjectResource.styleMode].divDisplay};
    width:${_BarometricPressureBox[ProjectResource.styleMode].divWidth};
    height:${_BarometricPressureBox[ProjectResource.styleMode].divHeight};
    flex-direction: column;
    border:solid 1px #808080;
    margin-right: 10px;
    border-radius: 3px;
    text-align:center;
    padding: 10px 0px;
    &:hover{
      background-color: #4D4D4D;
      //border:none;
      border: solid 1px #4D4D4D;
    }
    > span {
        color: #ffffff;
        font-size: 11px;
        font-family: Pretendard;
        padding: 6px 0px 14px 0px;
    }
    /* .pressureNum{
        color:#19A5FF;
        font-size: 11px;
        font-family: Pretendard;
    }
    .pressureNum > p{
        color:#19A5FF;
        font-size: 11px;
        font-family: Pretendard;
    } */
    > p{
        color:#19A5FF;
        font-size: 11px;
        font-family: Pretendard;
    }
`

/************************************************************/


export const _PressureText = {
    busan: {
        divDisplay: 'block',
    },
    yeosu: {
        divDisplay: 'block',
    }
}

export const PressureText = styled.div`
    display:${_PressureText[ProjectResource.styleMode].divDisplay};
    width: 100%;
    color: #19A5FF;
    font-size: 11px;
    padding: 0px 5px;
    > p {
       display: inline-block;
       font-size: 11px;
    }
`

/************************************************************/


export const _BarometricPressureIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '17px',
        divHeight: '12px',
        imgBackground: 'url("./../../resource/image/sdms/barometricPressure.png")no-repeat',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '17px',
        divHeight: '12px',
        imgBackground: 'url("./../../resource/image/sdms/barometricPressure.png")no-repeat',
    }
}

export const BarometricPressureIcon = styled.div`
    display:${_BarometricPressureIcon[ProjectResource.styleMode].divDisplay};
    /* width:${_BarometricPressureIcon[ProjectResource.styleMode].divWidth}; */
    height:${_BarometricPressureIcon[ProjectResource.styleMode].divHeight};
    background:${_BarometricPressureIcon[ProjectResource.styleMode].imgBackground};
    background-position: center center;
    padding: 10px 0px 5px 0px;

`

/************************************************************/


export const _RainfallBox = {
    busan: {
        divDisplay: 'inline-flex',
        divWidth: '48px',
        divHeight: '80px',
    },
    yeosu: {
        divDisplay: 'inline-flex',
        divWidth: '48px',
        divHeight: '80px',
    }
}

export const RainfallBox = styled.div`
    display:${_RainfallBox[ProjectResource.styleMode].divDisplay};
    width:${_RainfallBox[ProjectResource.styleMode].divWidth};
    height:${_RainfallBox[ProjectResource.styleMode].divHeight};
    flex-direction: column;
    border:solid 1px #808080;
    margin-right: 10px;
    border-radius: 3px;
    text-align:center;
    padding: 10px 0px;
    &:hover{
      background-color: #4D4D4D;
      border:none;
    }
    > span{
        color: #ffffff;
        font-size: 11px;
        font-family: Pretendard;
        padding: 6px 0px 14px 0px;
    }
    > p{
        color:#19A5FF;
        font-size: 11px;
        font-family: Pretendard;
    }
`

/************************************************************/

export const _RainfallIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '17px',
        divHeight: '12px',
        imgBackground: 'url("./../../resource/image/sdms/rainFall.png")no-repeat',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '17px',
        divHeight: '12px',
        imgBackground: 'url("./../../resource/image/sdms/rainFall.png")no-repeat',
    }
}

export const RainfallIcon = styled.div`
    display:${_RainfallIcon[ProjectResource.styleMode].divDisplay};
    height:${_RainfallIcon[ProjectResource.styleMode].divHeight};
    background:${_RainfallIcon[ProjectResource.styleMode].imgBackground};
    background-position: center center;
    padding: 10px 0px 5px 0px;

`

/************************************************************/


export const _SolarRadiationBox = {
    busan: {
        divDisplay: 'inline-flex',
        divWidth: '48px',
        divHeight: '80px',
    },
    yeosu: {
        divDisplay: 'inline-flex',
        divWidth: '48px',
        divHeight: '80px',
    }
}

export const SolarRadiationBox = styled.div`
    display:${_SolarRadiationBox[ProjectResource.styleMode].divDisplay};
    width:${_SolarRadiationBox[ProjectResource.styleMode].divWidth};
    height:${_SolarRadiationBox[ProjectResource.styleMode].divHeight};
    flex-direction: column;
    border:solid 1px #808080;
    margin-right: 10px;
    border-radius: 3px;
    text-align:center;
    padding: 10px 0px;
    &:hover{
      background-color: #4D4D4D;
      border:none;
    }
    > span{
       color: #ffffff;
       font-size: 11px;
       font-family: Pretendard;
       padding: 6px 0px 14px 0px;
    }
    > p{
        color:#19A5FF;
        font-size: 11px;
        font-family: Pretendard;
    }
`

/************************************************************/


export const _SolarRadiationIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '17px',
        divHeight: '12px',
        imgBackground: 'url("./../../resource/image/sdms/solarRadiation.png")no-repeat',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '17px',
        divHeight: '12px',
        imgBackground: 'url("./../../resource/image/sdms/solarRadiation.png")no-repeat',
    }
}

export const SolarRadiationIcon = styled.div`
    display:${_SolarRadiationIcon[ProjectResource.styleMode].divDisplay};
    /* width:${_SolarRadiationIcon[ProjectResource.styleMode].divWidth}; */
    height:${_SolarRadiationIcon[ProjectResource.styleMode].divHeight};
    background:${_SolarRadiationIcon[ProjectResource.styleMode].imgBackground};
    background-position: center center;
    padding: 10px 0px 5px 0px;
`

/************************************************************/


export const _WindDirectionBox = {
    busan: {
        divDisplay: 'inline-flex',
        divWidth: '48px',
        divHeight: '80px',
    },
    yeosu: {
        divDisplay: 'inline-flex',
        divWidth: '48px',
        divHeight: '80px',
    }
}

export const WindDirectionBox = styled.div`
    display:${_WindDirectionBox[ProjectResource.styleMode].divDisplay};
    width:${_WindDirectionBox[ProjectResource.styleMode].divWidth};
    height:${_WindDirectionBox[ProjectResource.styleMode].divHeight};
    flex-direction: column;
    border:solid 1px #808080;
    margin-right: 10px; 
    border-radius: 3px;
    text-align:center;
    padding: 10px 0px;
    position: relative;
 
    &:hover{
      background-color: #4D4D4D;
      border:none;
    }
    > span{
       color: #ffffff;
       font-size: 11px;
       padding: 6px 0px 14px 0px;
       font-family: Pretendard;
    }
    > p{
        color:#19A5FF;
        font-size: 11px;
        font-family: Pretendard;
    }
`

/************************************************************/


export const _WindDirectionMIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '17px',
        divHeight: '12px',
        imgBackground: 'url("./../../resource/image/sdms/barometricPressure.png")no-repeat',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '17px',
        divHeight: '12px',
        imgBackground: 'url("./../../resource/image/sdms/barometricPressure.png")no-repeat',
    }
}

export const WindDirectionMIcon = styled.div`
    display:${_WindDirectionMIcon[ProjectResource.styleMode].divDisplay};
    /* width:${_WindDirectionMIcon[ProjectResource.styleMode].divWidth}; */
    height:${_WindDirectionMIcon[ProjectResource.styleMode].divHeight};
    background:${_WindDirectionMIcon[ProjectResource.styleMode].imgBackground};
    background-position: center center;
    padding: 10px 0px 5px 0px;
`


/************************************************************/


export const _WindSpeedBox = {
    busan: {
        divDisplay: 'inline-flex',
        divWidth: '48px',
        divHeight: '80px',
    },
    yeosu: {
        divDisplay: 'inline-flex',
        divWidth: '48px',
        divHeight: '80px',
    }
}

export const WindSpeedBox = styled.div`
    display:${_WindSpeedBox[ProjectResource.styleMode].divDisplay};
    width:${_WindSpeedBox[ProjectResource.styleMode].divWidth};
    height:${_WindSpeedBox[ProjectResource.styleMode].divHeight};
    flex-direction: column;
    border:solid 1px #808080;
    border-radius: 3px;
    text-align: center;
    padding: 10px 0px;
   
    &:hover{
      background-color: #4D4D4D;
      border:none;
    }
    > span{
       color: #ffffff;
       font-size: 11px;
       font-family: Pretendard;
       padding: 6px 0px 14px 0px;
    }
    > p{
        color:#19A5FF;
        font-size: 11px;
        font-family: Pretendard;
    }
`

/************************************************************/


export const _WindSpeedIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '17px',
        divHeight: '12px',
        imgBackground: 'url("./../../resource/image/sdms/windSpeed.png")no-repeat',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '17px',
        divHeight: '12px',
        imgBackground: 'url("./../../resource/image/sdms/windSpeed.png")no-repeat',
    }
}

export const WindSpeedIcon = styled.div`
    display:${_WindSpeedIcon[ProjectResource.styleMode].divDisplay};
    /* width:${_WindSpeedIcon[ProjectResource.styleMode].divWidth}; */
    height:${_WindSpeedIcon[ProjectResource.styleMode].divHeight};
    background:${_WindSpeedIcon[ProjectResource.styleMode].imgBackground};
    background-position:center center;
    padding: 10px 0px 5px 0px;

`

/************************************************************/


export const _WindDirectionIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '13px',
        divHeight: '10px',
        imgBackground: 'url("./../../resource/image/sdms/windDirection.png")no-repeat',
    },
    //yeosu: {
    //    divDisplay: 'inline-block',
    //    divWidth: '13px',
    //    divHeight: '10px',
    //    imgBackground: 'url("./../../resource/image/sdms/windDirection.png")no-repeat',
    //}
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '10px',
        divHeight: '7px',
        imgBackground: 'url("./../../resource/image/sdms/windDirection.png")no-repeat',
    }
}

export const WindDirectionIcon = styled.div`
    display:${_WindDirectionIcon[ProjectResource.styleMode].divDisplay};
    width:${_WindDirectionIcon[ProjectResource.styleMode].divWidth};
    height:${_WindDirectionIcon[ProjectResource.styleMode].divHeight};
    background:${_WindDirectionIcon[ProjectResource.styleMode].imgBackground};
    background-position: center center;
    align-self: center;
    position: absolute;
    left: 18px;
`

/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/* 이벤트 팝업창 */


export const _AlarmOnIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '16px',
        divHeight: '16px',
        imgBackground: 'url("./../../resource/image/sdms/notifications_black.png") no-repeat',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '16px',
        divHeight: '16px',
        imgBackground: 'url("./../../resource/image/sdms/notifications_black.png") no-repeat',
    }
}

export const AlarmOnIcon = styled.div`
    display:${_AlarmOnIcon[ProjectResource.styleMode].divDisplay};
    width:${_AlarmOnIcon[ProjectResource.styleMode].divWidth};
    height:${_AlarmOnIcon[ProjectResource.styleMode].divHeight};
    background:${_AlarmOnIcon[ProjectResource.styleMode].imgBackground};
    background-size: 16px;

`

/************************************************************/


export const _AlarmOffIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '16px',
        divHeight: '16px',
        imgBackground: 'url("./../../resource/image/sdms/notifications_off_black.png") no-repeat',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '16px',
        divHeight: '16px',
        imgBackground: 'url("./../../resource/image/sdms/notifications_off_black.png") no-repeat',
    }
}

export const AlarmOffIcon = styled.div`
    display:${_AlarmOffIcon[ProjectResource.styleMode].divDisplay};
    width:${_AlarmOffIcon[ProjectResource.styleMode].divWidth};
    height:${_AlarmOffIcon[ProjectResource.styleMode].divHeight};
    background:${_AlarmOffIcon[ProjectResource.styleMode].imgBackground};
    background-size: 16px;

`

/************************************************************/


export const _ResponseBox = {
    busan: {
        divDisplay: 'flex',
        divHeight: '28px',
    },
    yeosu: {
        divDisplay: 'flex',
        divHeight: '28px',
    }
}

export const ResponseBox = styled.div`
    display:${_ResponseBox[ProjectResource.styleMode].divDisplay};
    height:${_ResponseBox[ProjectResource.styleMode].divHeight};
    float: right;
    .Unresponsive{
        width: 83px;
        height: 28px;
        line-height: 28px;
        color: #ffffff;
        font-size: 12px;
        text-align: center;
    }
    .responsive{        
        width: 83px;
        height: 28px;
        line-height: 28px;
        color: #4D4D4D;
        font-size: 12px;
        /* flex-grow: 1; */
    }
    > span{
       display:inline-block;
       color: #fff;
       font-size: 11px;
       font-family: Pretendard;
    }
`

/************************************************************/

export const _CheckBox = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '12px',
        divHeight: '12px',
        divColor: '#fff',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '12px',
        divHeight: '12px',
        divColor: '#fff',
    }
}

export const CheckBox = styled.div`
    display:${_CheckBox[ProjectResource.styleMode].divDisplay};
    width:${_CheckBox[ProjectResource.styleMode].divWidth};
    height:${_CheckBox[ProjectResource.styleMode].divHeight};
    color:${_CheckBox[ProjectResource.styleMode].divColor};
    border-radius: 2px;
    border:solid 1px #fff;
    margin-right: 6px;
    > span{
       display:inline-block;
       width: 100px;
       color: #fff;
       font-size: 11px;
    }
`

/************************************************************/


export const _CheckBoxBlue = {
    busan: {
        divDisplay: 'block',
        divWidth: '12px',
        divHeight: '12px',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '12px',
        divHeight: '12px',
    }
}

export const CheckBoxBlue = styled.div`
    display:${_CheckBoxBlue[ProjectResource.styleMode].divDisplay};
    width:${_CheckBoxBlue[ProjectResource.styleMode].divWidth};
    height:${_CheckBoxBlue[ProjectResource.styleMode].divHeight};
    border:solid 1px #19A5FF;
    border-radius: 2px;
`

/************************************************************/


export const _SensorlocationBox = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '100%',
        divHeight: '150px',
        divBackground: '#4d4d4d96',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '100%',
        divHeight: '150px',
        divBackground: '#4d4d4d96',
    }
}

export const SensorlocationBox = styled.div`
    display:${_SensorlocationBox[ProjectResource.styleMode].divDisplay};
    width:${_SensorlocationBox[ProjectResource.styleMode].divWidth};
    /* height:${_SensorlocationBox[ProjectResource.styleMode].divHeight}; */
    /* background:${_SensorlocationBox[ProjectResource.styleMode].divBackground}; */
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
       border:none;
    }
    > span{
       color: #fff;
    }
    /* .eventScrollbar{
       overflow-y: scroll;
    } */
`

/************************************************************/


export const _SensorList = {
    busan: {
        divDisplay: 'flex',
        divFontSize: '11px',
        divHeight: '38px',
    },
    yeosu: {
        divDisplay: 'flex',
        divFontSize: '11px',
        divHeight: '38px',
    }
}

export const SensorList = styled.div`
    display:${_SensorList[ProjectResource.styleMode].divDisplay};
    font-size:${_SensorList[ProjectResource.styleMode].divFontSize};
    height:${_SensorList[ProjectResource.styleMode].divHeight};
    line-height:38px; 
    color: #fff;
    font-family: Pretendard;
    /* .sensorListText1{
        display:inline-block;
        width: 25%;
        border:dashed 1px red;
    }
    .sensorListText2{
        display:inline-block;
        width: 58%;
        border:dashed 1px orange;
    }
    .sensorListText3{
        display:inline-block;
        width: 15%;
        border:dashed 1px yellow;
    }
    .sensorListText4{
        display:inline-block;
        width: 25%;
        border:dashed 1px green;
    }
    .sensorListText5{
        display:inline-block;
        width: 30%;
        border:dashed 1px blue;
    }
    .sensorListText6{
        display:inline-block;
        border:dashed 1px purple; 
    } */
    .greenText{
        color: #00B050;
    }
    .redText{
        color: #ff0000;
    }
    .stepName{
        padding: 0px 10px 0px 20px;
    }
`

/************************************************************/

export const _MoveBtn = {
    busan: {
        divDisplay: 'block',
        divWidth: '50px',
        divHeight: '20px',
        divFontSize: '10px',
        divBorderRadius: '20px',
        divBackground: '#1A1A1A',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '50px',
        divHeight: '20px',
        divFontSize: '10px',
        divBorderRadius: '20px',
        divBackground: '#1A1A1A',
    }
}

export const MoveBtn = styled.div`
    display:${_MoveBtn[ProjectResource.styleMode].divDisplay};
    width:${_MoveBtn[ProjectResource.styleMode].divWidth};
    height:${_MoveBtn[ProjectResource.styleMode].divHeight};
    font-size:${_MoveBtn[ProjectResource.styleMode].divFontSize};
    border-radius:${_MoveBtn[ProjectResource.styleMode].divBorderRadius};
    background:${_MoveBtn[ProjectResource.styleMode].divBackground};
    line-height: 20px;
    border:solid 1px #666666;
    text-align: center;
    margin-top: 8px; 
    &:hover{
       background: #000000;
       cursor: pointer;
    }
`


/************************************************************/


export const _EventGageBar = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '108px',
        divHeight: '13px',
        divBackground: '#FFFFFF',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '108px',
        divHeight: '13px',
        divBackground: '#FFFFFF',
    }
}

export const EventGageBar = styled.div`
    display:${_EventGageBar[ProjectResource.styleMode].divDisplay};
    width:${_EventGageBar[ProjectResource.styleMode].divWidth};
    height:${_EventGageBar[ProjectResource.styleMode].divHeight};
    background:${_EventGageBar[ProjectResource.styleMode].divBackground};
    border:solid 1px #666666;
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
    position:relative; 
    .gageCharge{
       position:absolute;
       left: 0;
       top: 0;
       width: 98px;
       height: 11px;
       background: #808080;
    }
`

/************************************************************/

export const _SensorEventBtn = {
    busan: {
        divDisplay: 'flex',
        divWidth: '108px',
        divHeight: '13px',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '108px',
        divHeight: '13px',
    }
}

export const SensorEventBtn = styled.div`
    display:${_SensorEventBtn[ProjectResource.styleMode].divDisplay};
    /* width:${_SensorEventBtn[ProjectResource.styleMode].divWidth}; */
    height:${_SensorEventBtn[ProjectResource.styleMode].divHeight};
    /* margin: 20px 0px; */
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
    }
`


/************************************************************/


export const _SensorSeriousStepBox = {
    busan: {
        divDisplay: 'flex',
        divWidth: '69px',
        divHeight: '7px',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '69px',
        divHeight: '7px',
    }
}

export const SensorSeriousStepBox = styled.div`
    display:${_SensorSeriousStepBox[ProjectResource.styleMode].divDisplay};
    width:${_SensorSeriousStepBox[ProjectResource.styleMode].divWidth};
    height:${_SensorSeriousStepBox[ProjectResource.styleMode].divHeight};
    background:${_SensorSeriousStepBox[ProjectResource.styleMode].divBackground};
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
`

/************************************************************/

export const _SensorBoundaryStepBox = {
    busan: {
        divDisplay: 'flex',
        divWidth: '69px',
        divHeight: '7px',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '69px',
        divHeight: '7px',
    }
}

export const SensorBoundaryStepBox = styled.div`
    display:${_SensorBoundaryStepBox[ProjectResource.styleMode].divDisplay};
    width:${_SensorBoundaryStepBox[ProjectResource.styleMode].divWidth};
    height:${_SensorBoundaryStepBox[ProjectResource.styleMode].divHeight};
    background:${_SensorBoundaryStepBox[ProjectResource.styleMode].divBackground};
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
`

/************************************************************/


export const _SensorSeriousCompletionBox = {
    busan: {
        divDisplay: 'flex',
        divWidth: '69px',
        divHeight: '7px',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '69px',
        divHeight: '7px',
    }
}

export const SensorSeriousCompletionBox = styled.div`
    display:${_SensorSeriousCompletionBox[ProjectResource.styleMode].divDisplay};
    width:${_SensorSeriousCompletionBox[ProjectResource.styleMode].divWidth};
    height:${_SensorSeriousCompletionBox[ProjectResource.styleMode].divHeight};
    background:${_SensorSeriousCompletionBox[ProjectResource.styleMode].divBackground};
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
`


/************************************************************/


export const _SensorBoundaryCompletionBox = {
    busan: {
        divDisplay: 'flex',
        divWidth: '69px',
        divHeight: '7px',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '69px',
        divHeight: '7px',
    }
}

export const SensorBoundaryCompletionBox = styled.div`
    display:${_SensorBoundaryCompletionBox[ProjectResource.styleMode].divDisplay};
    width:${_SensorBoundaryCompletionBox[ProjectResource.styleMode].divWidth};
    height:${_SensorBoundaryCompletionBox[ProjectResource.styleMode].divHeight};
    background:${_SensorBoundaryCompletionBox[ProjectResource.styleMode].divBackground};
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
`


/************************************************************/


export const _MemoIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '22px',
        divHeight: '22px',
        imgBackground: 'url("./../../resource/image/sdms/memoIcon2.png")no-repeat',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '22px',
        divHeight: '22px',
        imgBackground: 'url("./../../resource/image/sdms/memoIcon2.png")no-repeat',
    }
}

export const MemoIcon = styled.div`
    display:${_MemoIcon[ProjectResource.styleMode].divDisplay};
    width:${_MemoIcon[ProjectResource.styleMode].divWidth};
    /* height:${_MemoIcon[ProjectResource.styleMode].divHeight}; */
    background:${_MemoIcon[ProjectResource.styleMode].imgBackground};
    background-size:16px;
    background-position: center center;
    cursor:pointer;
`


/************************************************************/


export const _EventMemoBox = {
    busan: {
        divDisplay: 'block',
        divWidth: '197px',
        divHeight: '197px',
        imgBackground: '#fff',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '197px',
        divHeight: '197px',
        imgBackground: '#fff',
    }
}

export const EventMemoBox = styled.div`
    /* display:${_EventMemoBox[ProjectResource.styleMode].divDisplay}; */
    width:${_EventMemoBox[ProjectResource.styleMode].divWidth};
    height:${_EventMemoBox[ProjectResource.styleMode].divHeight};
    background:${_EventMemoBox[ProjectResource.styleMode].imgBackground};
    display:block;
    border-radius: 5px;
    box-shadow: 0px 3px 6px #00000029;
    padding: 10px;
    > span{
      display: block;
      color:#19A5FF;
      text-align:center;
      margin-top: 5px;
      margin-bottom: 10px;
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
`


/************************************************************/


export const _MemoBtn = {
    busan: {
        divDisplay: 'flex',
        divWidth: '178px',
        divHeight: '24px',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '178px',
        divHeight: '24px',
    }
}

export const MemoBtn = styled.div`
    display:${_MemoBtn[ProjectResource.styleMode].divDisplay};
    width:${_MemoBtn[ProjectResource.styleMode].divWidth};
    height:${_MemoBtn[ProjectResource.styleMode].divHeight};
    margin-top: 10px;
    .cancle{
       width:85px;
       height:24px;
       line-height: 20px;
       border-radius: 5px;
       border:solid 2px #19A5FF;
       color: #19A5FF;
       text-align:center;
       margin-right: 8px;
       font-size: 14px;
       cursor:pointer;
     }
    .save{
       width:85px;
       height:24px;
       line-height: 24px;
       border-radius: 5px;
       background: #19A5FF;
       color: #fff;
       text-align:center;
       font-size: 14px;
       cursor:pointer;
    }
`

/***********************************************************/


export const _UnresponNum = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '16px',
        divHeight: '16px',
        imgBackground: 'red',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '16px',
        divHeight: '16px',
        imgBackground: 'red',
    }
}

export const UnresponNum = styled.div`
    display:${_UnresponNum[ProjectResource.styleMode].divDisplay};
    width:${_UnresponNum[ProjectResource.styleMode].divWidth};
    height:${_UnresponNum[ProjectResource.styleMode].divHeight};
    background:${_UnresponNum[ProjectResource.styleMode].imgBackground};
    line-height: 16px;
    font-size: 10px;
    border-radius: 50%;
    margin-left: 4px;
`


/***********************************************************/


export const _ResponNum = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '16px',
        divHeight: '16px',
        imgBackground: 'red',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '16px',
        divHeight: '16px',
        imgBackground: 'red',
    }
}

export const ResponNum = styled.div`
    display:${_ResponNum[ProjectResource.styleMode].divDisplay};
    width:${_ResponNum[ProjectResource.styleMode].divWidth};
    height:${_ResponNum[ProjectResource.styleMode].divHeight};
    background:${_ResponNum[ProjectResource.styleMode].imgBackground};
    line-height: 16px;
    font-size: 10px;
    border-radius: 50%;
    margin-left: 4px;
`


/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/* VOC 팝업창 */


export const _VOCselectBox = {
    busan: {
        divDisplay: 'inline-block',
    },
    yeosu: {
        divDisplay: 'inline-block',
    }
}

export const VOCselectBox = styled.div`
    
    //position: relative;
    //width: 230px;
    //height 19px;
    //border-radius: 12px;
    //border: solid 1px #666666;


    display:${_VOCselectBox[ProjectResource.styleMode].divDisplay};
    /* > select{
       background: none;
       width: 230px;
       height: 19px;
       border-radius: 12px;
       border:solid 1px #666666;
       color: #fff;
       font-size: 11px;
    } */
    > select {
        width: 230px;
        height: 19px;
        border: 1px solid #666666;
        background: url("./../../resource/image/sdms/searchIcon.png")no-repeat 95% 50%;
        border-radius: 12px;
        color: #fff;
        font-size: 11px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
    }
    > select::-ms-expand {
        display: none;
    }
    > select > option{
       background: #000000;
       color: #fff;
       height: 34px;
       line-height: 34px;
       font-size: 11px;
    }
`

/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/* VOC Detail 팝업창 */


export const VOCLocation = styled.div`
    margin-bottom: 12px;
    letter-spacing: 0.6px;

    > span:nth-child(1){
       font-size: 16px; 
       color: #FFFFFF;
       margin-right: 4px;
    }
    > span:nth-child(2){
       font-size: 16px;
       color: #FFFFFF;
    }
`;


export const _VOCTable = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '630px',
        divHeight: '160px',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '630px',
        divHeight: '160px',
    }
}

export const VOCTable = styled.div`
    /* width: 98%; */
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
`


/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/* CCTV 팝업창 */



export const _CCTVView = {
    busan: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '300px',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '300px',
    }
}

export const CCTVView = styled.div`
    display:${_CCTVView[ProjectResource.styleMode].divDisplay};
    width:${_CCTVView[ProjectResource.styleMode].divWidth};
    height:${_CCTVView[ProjectResource.styleMode].divHeight};
    color: #fff;
    > div > span{
       display: inline-block;
       width: 166px;
       height: 136px;
       /* border: solid 1px #707070; */
       background: #fff;
       margin: 4px;
    }
`

/************************************************************/


export const _CCTVlocationText = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: 'calc(100% - 102px)',
        divHeight: '29px',
        divBorderRadius: '6px',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: 'calc(100% - 102px)',
        divHeight: '29px',
        divBorderRadius: '6px',
    }
}

export const CCTVlocationText = styled.div`
    display:${_CCTVlocationText[ProjectResource.styleMode].divDisplay};
    width:${_CCTVlocationText[ProjectResource.styleMode].divWidth};
    height:${_CCTVlocationText[ProjectResource.styleMode].divHeight};
    border-radius:${_CCTVlocationText[ProjectResource.styleMode].divBorderRadius};
    margin-right: 8px;
    padding: 0px 10px;
    line-height: 29px;
    background: #000000;
    color: #fff;
    font-size: 11px;
    font-family: Pretendard;
`


/************************************************************/


export const _CameraViewBtn = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '93px',
        divHeight: '29px',
        divBorderRadius: '6px',
        /* divBackground: '#19A5FF', */
        divBackground: '#19A5FF url("./../../resource/image/sdms/cameraView.png")no-repeat right center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '93px',
        divHeight: '29px',
        divBorderRadius: '6px',
        divBackground: '#19A5FF url("./../../resource/image/sdms/cameraView.png")no-repeat right center',
    }
}

export const CameraViewBtn = styled.div`
    display:${_CameraViewBtn[ProjectResource.styleMode].divDisplay};
    width:${_CameraViewBtn[ProjectResource.styleMode].divWidth};
    height:${_CameraViewBtn[ProjectResource.styleMode].divHeight};
    border-radius:${_CameraViewBtn[ProjectResource.styleMode].divBorderRadius};
    background:${_CameraViewBtn[ProjectResource.styleMode].divBackground};
    background-position-x: 72px;
    line-height: 29px;
    color: #fff;
    font-family: Pretendard;
    font-size: 11px;
    padding: 0px 8px;
`


/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/* 미니맵 팝업창 */


export const _MinimapBox = {
    busan: {
        divDisplay: 'block',
        divWidth: '359px',
        divHeight: '224px',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '359px',
        divHeight: '224px',
    }
}

export const MinimapBox = styled.div`
    display:${_MinimapBox[ProjectResource.styleMode].divDisplay};
    width:${_MinimapBox[ProjectResource.styleMode].divWidth};
    height:${_MinimapBox[ProjectResource.styleMode].divHeight};
    /* padding-top: 16px; */
    > span{
       color:#808080;
       font-size: 12px;
    }
    .imgBox{
       display: block;
       /* padding: 40px 0px; */
     }
    .imgBackArea{
       display: inline-block;
       border:dashed 1px red;
       position: relative;
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
`

/************************************************************/


export const _MinimapBoxView = {
    busan: {
        divDisplay: 'block',
        divWidth: '360px',
        divHeight: '270px',
        divBackground: '#000000',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '360px',
        divHeight: '270px',
        divBackground: '#000000',
    }
}

export const MinimapBoxView = styled.div`
    display:${_MinimapBoxView[ProjectResource.styleMode].divDisplay};
    width:${_MinimapBoxView[ProjectResource.styleMode].divWidth};
    height:${_MinimapBoxView[ProjectResource.styleMode].divHeight};
    background:${_MinimapBoxView[ProjectResource.styleMode].divBackground};
    border-radius: 15px;
    padding-top: 16px;
    position: absolute;
    right: 20px;
    bottom: 90px;
    /* z-index: 102; */
    z-index: 4;
    > span{
       color:#808080;
       font-size: 12px;
    }
    .imgBox{
       display: block;
       padding: 40px 0px;
     }
    .imgArea{
       display:inline-block;
       width:90%;
     }
`


/************************************************************/


export const _MinimapImage = {
    busan: {
        divDisplay: 'block',
        divWidth: '360px',
        divHeight: '270px',
        //divBackground: 'url("./../../resource/image/minimap/minimap_Back.png")no-repeat center center',
        divBackground: 'url("./../../resource/image/minimap/terrain2.png")no-repeat center center',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '360px',
        divHeight: '270px',
        //divBackground: 'url("./../../resource/image/minimap/minimap_Back.png")no-repeat center center',
        divBackground: 'url("./../../resource/image/minimap/terrain2.png")no-repeat center center',
    }
}

export const MinimapImage = styled.div`
    display:${_MinimapImage[ProjectResource.styleMode].divDisplay};
    width:${_MinimapImage[ProjectResource.styleMode].divWidth};
    height:${_MinimapImage[ProjectResource.styleMode].divHeight};
    background:${_MinimapImage[ProjectResource.styleMode].divBackground};
    background-size: 90%;
    background-position-x: 24px;
    background-position-y: -3px;
`

/************************************************************/


export const _MinimapPOI = {
    busan: {
        divDisplay: 'block',
        divWidth: '34px',
        divHeight: '34px',
        divBackground: 'url("./../../resource/image/sdms/poi_active.png")no-repeat center center',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '34px',
        divHeight: '34px',
        divBackground: 'url("./../../resource/image/sdms/poi_active.png")no-repeat center center',
    }
}
export const MinimapPOI = styled.div`
    display:${_MinimapPOI[ProjectResource.styleMode].divDisplay};
    width:${_MinimapPOI[ProjectResource.styleMode].divWidth};
    height:${_MinimapPOI[ProjectResource.styleMode].divHeight};
    background:${_MinimapPOI[ProjectResource.styleMode].divBackground};
    position: absolute;
    left: 80px;
    top: 100px;
    z-index: 1;
`

export const _MinimapPOI_alarmed = {
    busan: {
        divDisplay: 'block',
        divWidth: '34px',
        divHeight: '34px',
        divBackground: 'url("./../../resource/image/sdms/poi_alarmed.png")no-repeat center center',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '34px',
        divHeight: '34px',
        divBackground: 'url("./../../resource/image/sdms/poi_alarmed.png")no-repeat center center',
    }
}

export const MinimapPOIAlarmed = styled.div`
    display:${_MinimapPOI_alarmed[ProjectResource.styleMode].divDisplay};
    width:${_MinimapPOI_alarmed[ProjectResource.styleMode].divWidth};
    height:${_MinimapPOI_alarmed[ProjectResource.styleMode].divHeight};
    background:${_MinimapPOI_alarmed[ProjectResource.styleMode].divBackground};
    position: absolute;
    left: 80px;
    top: 100px;
    z-index: 3;
    background-size: contain;
`

/************************************************************/


export const _AZoneBtn = {
    busan: {
        divDisplay: 'block',
        divWidth: '85px',
        divHeight: '160px',
        divBackground: 'url("./../../resource/image/minimap/aArea.png")no-repeat center center',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '85px',
        divHeight: '160px',
        divBackground: 'url("./../../resource/image/minimap/aArea.png")no-repeat center center',
        divBackgroundAct: 'url("./../../resource/image/minimap/aArea.png")no-repeat center center',
    }
}

export const AZoneBtn = styled.div`
    display:${_AZoneBtn[ProjectResource.styleMode].divDisplay};
    width:${_AZoneBtn[ProjectResource.styleMode].divWidth};
    height:${_AZoneBtn[ProjectResource.styleMode].divHeight};
    /* background:${_AZoneBtn[ProjectResource.styleMode].divBackground}; */
    background-size: 78%;
    position: absolute;
    left: 38px;
    top: 84px;
    transform: rotate(0deg);
    &:hover {
       background:${_AZoneBtn[ProjectResource.styleMode].divBackgroundAct};
       background-size: 78%;
     }
    &.active{
       background:${_AZoneBtn[ProjectResource.styleMode].divBackgroundAct};
       background-size: 78%;
    }
`

/************************************************************/


export const _BZoneBtn = {
    busan: {
        divDisplay: 'block',
        divWidth: '74px',
        divHeight: '124px',
        divBackground: 'url("./../../resource/image/minimap/bArea.png")no-repeat center center',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '74px',
        divHeight: '124px',
        divBackground: 'url("./../../resource/image/minimap/bArea.png")no-repeat center center',
        divBackgroundAct: 'url("./../../resource/image/minimap/bArea.png")no-repeat center center',
    }
}

export const BZoneBtn = styled.div`
    display:${_BZoneBtn[ProjectResource.styleMode].divDisplay};
    width:${_BZoneBtn[ProjectResource.styleMode].divWidth};
    height:${_BZoneBtn[ProjectResource.styleMode].divHeight};
    /* background:${_BZoneBtn[ProjectResource.styleMode].divBackground}; */
    background-size: 106%;
    position: absolute;
    left: 64px;
    top: 119px;
    transform: rotate(0deg);
    &:hover {
       background:${_BZoneBtn[ProjectResource.styleMode].divBackgroundAct};
       background-size: 106%;
     }
    &.active{
       background:${_BZoneBtn[ProjectResource.styleMode].divBackgroundAct};
       background-size: 106%;
    }
`

/************************************************************/


export const _CZoneBtn = {
    busan: {
        divDisplay: 'block',
        divWidth: '82px',
        divHeight: '130px',
        divBackground: 'url("./../../resource/image/minimap/cArea.png")no-repeat center center',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '82px',
        divHeight: '130px',
        divBackground: 'url("./../../resource/image/minimap/cArea.png")no-repeat center center',
        divBackgroundAct: 'url("./../../resource/image/minimap/cArea.png")no-repeat center center',
    }
}

export const CZoneBtn = styled.div`
    display:${_CZoneBtn[ProjectResource.styleMode].divDisplay};
    width:${_CZoneBtn[ProjectResource.styleMode].divWidth};
    height:${_CZoneBtn[ProjectResource.styleMode].divHeight};
    /* background:${_CZoneBtn[ProjectResource.styleMode].divBackground}; */
    position: absolute;
    left: 105px;
    top: 54px;
    transform: rotate(360deg);
    background-size: 80%;
    &:hover {
       background:${_CZoneBtn[ProjectResource.styleMode].divBackgroundAct};
       background-size: 80%;
     }
    &.active{
       background:${_CZoneBtn[ProjectResource.styleMode].divBackgroundAct};
       background-size: 80%;
    }
`

/************************************************************/


export const _DZoneBtn = {
    busan: {
        divDisplay: 'block',
        divWidth: '96px',
        divHeight: '106px',
        divBackground: 'url("./../../resource/image/minimap/dArea.png")no-repeat center center',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '96px',
        divHeight: '106px',
        divBackground: 'url("./../../resource/image/minimap/dArea.png")no-repeat center center',
        divBackgroundAct: 'url("./../../resource/image/minimap/dArea.png")no-repeat center center',
    }
}

export const DZoneBtn = styled.div`
    display:${_DZoneBtn[ProjectResource.styleMode].divDisplay};
    width:${_DZoneBtn[ProjectResource.styleMode].divWidth};
    height:${_DZoneBtn[ProjectResource.styleMode].divHeight};
    /* background:${_DZoneBtn[ProjectResource.styleMode].divBackground}; */
    position: absolute;
    left: 153px;
    top: 53px;
    transform: rotate(0deg);
    background-size: 92%;
    &:hover {
       background:${_DZoneBtn[ProjectResource.styleMode].divBackgroundAct};
       background-size: 92%;
     }
    &.active{
       background:${_DZoneBtn[ProjectResource.styleMode].divBackgroundAct};
       background-size: 92%;
    }
`

/************************************************************/


export const _EZoneBtn = {
    busan: {
        divDisplay: 'block',
        divWidth: '79px',
        divHeight: '69px',
        divBackground: 'url("./../../resource/image/minimap/eArea.png")no-repeat center center',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '79px',
        divHeight: '69px',
        divBackground: 'url("./../../resource/image/minimap/eArea.png")no-repeat center center',
        divBackgroundAct: 'url("./../../resource/image/minimap/eArea.png")no-repeat center center',
    }
}

export const EZoneBtn = styled.div`
    display:${_EZoneBtn[ProjectResource.styleMode].divDisplay};
    width:${_EZoneBtn[ProjectResource.styleMode].divWidth};
    height:${_EZoneBtn[ProjectResource.styleMode].divHeight};
    /* background:${_EZoneBtn[ProjectResource.styleMode].divBackground}; */
    position: absolute;
    left: 242px;
    top: 64px;
    transform: rotate(0deg);
    background-size: 92%;
    &:hover {
        background:${_EZoneBtn[ProjectResource.styleMode].divBackgroundAct};
        background-size: 92%;
     }
    &.active{
        background:${_EZoneBtn[ProjectResource.styleMode].divBackgroundAct};
        background-size: 92%;
    }
}
`


/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/* 공공데이터 팝업창 */


export const _NetworkTitleIcon = {
    busan: {
        divDisplay: 'block',
        divWidth: '19px',
        divHeight: '19px',
        divBackground: 'url("./../../resource/image/sdms/networkTitle_icon.png")no-repeat center center',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '19px',
        divHeight: '19px',
        divBackground: 'url("./../../resource/image/sdms/networkTitle_icon.png")no-repeat center center',
        divBackgroundAct: 'url("./../../resource/image/sdms/networkTitle_icon.png")no-repeat center center',
    }
}

export const NetworkTitleIcon = styled.div`
    display:${_NetworkTitleIcon[ProjectResource.styleMode].divDisplay};
    width:${_NetworkTitleIcon[ProjectResource.styleMode].divWidth};
    height:${_NetworkTitleIcon[ProjectResource.styleMode].divHeight};
    background:${_NetworkTitleIcon[ProjectResource.styleMode].divBackground};
    &:hover {
       background:${_NetworkTitleIcon[ProjectResource.styleMode].divBackgroundAct};
     }
    &.active{
       background:${_NetworkTitleIcon[ProjectResource.styleMode].divBackgroundAct};
    }
}
`

/************************************************************/


export const _IconDustBox = {
    busan: {
        divDisplay: 'flex',
        divWidth: '40px',
        divHeight: '40px',
        divBackground: 'url("./../../resource/image/sdms/dust_icon.png")no-repeat center center',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '40px',
        divHeight: '40px',
        divBackground: 'url("./../../resource/image/sdms/dust_icon.png")no-repeat center center',
        divBackgroundAct: 'url("./../../resource/image/sdms/dust_icon.png")no-repeat center center',
    }
}

export const IconDustBox = styled.div`
    display:${_IconDustBox[ProjectResource.styleMode].divDisplay};
    width:${_IconDustBox[ProjectResource.styleMode].divWidth};
    height:${_IconDustBox[ProjectResource.styleMode].divHeight};
    background:${_IconDustBox[ProjectResource.styleMode].divBackground};
    margin-right: 14px;
    &:hover {
       background:${_IconDustBox[ProjectResource.styleMode].divBackgroundAct};
     }
    &.active{
       background:${_IconDustBox[ProjectResource.styleMode].divBackgroundAct};
    }
}
`

/************************************************************/


export const _IconO3Box = {
    busan: {
        divDisplay: 'flex',
        divWidth: '40px',
        divHeight: '40px',
        divBackground: 'url("./../../resource/image/sdms/o3_icon.png")no-repeat center center',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '40px',
        divHeight: '40px',
        divBackground: 'url("./../../resource/image/sdms/o3_icon.png")no-repeat center center',
        divBackgroundAct: 'url("./../../resource/image/sdms/o3_icon.png")no-repeat center center',
    }
}

export const IconO3Box = styled.div`
    display:${_IconO3Box[ProjectResource.styleMode].divDisplay};
    width:${_IconO3Box[ProjectResource.styleMode].divWidth};
    height:${_IconO3Box[ProjectResource.styleMode].divHeight};
    background:${_IconO3Box[ProjectResource.styleMode].divBackground};
    margin-right: 14px;
    &:hover {
       background:${_IconO3Box[ProjectResource.styleMode].divBackgroundAct};
     }
    &.active{
       background:${_IconO3Box[ProjectResource.styleMode].divBackgroundAct};
    }
}
`


/************************************************************/


export const _IconSO2Box = {
    busan: {
        divDisplay: 'flex',
        divWidth: '40px',
        divHeight: '40px',
        divBackground: 'url("./../../resource/image/sdms/so2_icon.png")no-repeat center center',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '40px',
        divHeight: '40px',
        divBackground: 'url("./../../resource/image/sdms/so2_icon.png")no-repeat center center',
        divBackgroundAct: 'url("./../../resource/image/sdms/so2_icon.png")no-repeat center center',
    }
}

export const IconSO2Box = styled.div`
    display:${_IconSO2Box[ProjectResource.styleMode].divDisplay};
    width:${_IconSO2Box[ProjectResource.styleMode].divWidth};
    height:${_IconSO2Box[ProjectResource.styleMode].divHeight};
    background:${_IconSO2Box[ProjectResource.styleMode].divBackground};
    margin-right: 14px;
    &:hover {
       background:${_IconSO2Box[ProjectResource.styleMode].divBackgroundAct};
     }
    &.active{
       background:${_IconSO2Box[ProjectResource.styleMode].divBackgroundAct};
    }
}
`

/************************************************************/


export const _DataBoxArea = {
    busan: {
        divDisplay: 'flex',
        divWidth: '50px',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '50px',
    }
}

export const DataBoxArea = styled.div`
    display:${_DataBoxArea[ProjectResource.styleMode].divDisplay};
    width:${_DataBoxArea[ProjectResource.styleMode].divWidth};
    flex-direction: column;
}
`

/************************************************************/


export const _DataBoxText = {
    busan: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '19px',
        divColor: '#fff',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '19px',
        divColor: '#fff',
    }
}

export const DataBoxText = styled.div`
    display:${_DataBoxText[ProjectResource.styleMode].divDisplay};
    width:${_DataBoxText[ProjectResource.styleMode].divWidth};
    height:${_DataBoxText[ProjectResource.styleMode].divHeight};
    color:${_DataBoxText[ProjectResource.styleMode].divColor};
    line-height:19px;
}
`

/************************************************************/

export const _DataUnit = {
    busan: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '19px',
        divColor: '#fff',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '19px',
        divColor: '#fff',
    }
}

export const DataUnit = styled.div`
    display:${_DataUnit[ProjectResource.styleMode].divDisplay};
    width:${_DataUnit[ProjectResource.styleMode].divWidth};
    height:${_DataUnit[ProjectResource.styleMode].divHeight};
    color:${_DataUnit[ProjectResource.styleMode].divColor};
    line-height:19px;
}
`

/*cleanSYS***********************************************************/


export const _CleanFlex = {
    busan: {
        divDisplay: 'flex',
        divWidth: '100%',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '100%',
    }
}

export const CleanFlex = styled.div`
    display:${_CleanFlex[ProjectResource.styleMode].divDisplay};
    width:${_CleanFlex[ProjectResource.styleMode].divWidth};
    margin-right: 12px;
    margin-top: 10px;
}
`

/************************************************************/


export const _CleanSearch = {
    busan: {
        divDisplay: 'flex',
        divWidth: '245px',
        divHeight: '34px',
        divBackground: '#000000',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '245px',
        divHeight: '34px',
        divBackground: '#000000',
    }
}

export const CleanSearch = styled.div`
    display:${_CleanSearch[ProjectResource.styleMode].divDisplay};
    width:${_CleanSearch[ProjectResource.styleMode].divWidth};
    height:${_CleanSearch[ProjectResource.styleMode].divHeight};
    background:${_CleanSearch[ProjectResource.styleMode].divBackground};
    background-position: center;
    border-radius: 5px;
    margin-right: 12px;
    > input{
        width: 210px;
        height: 34px;
        background: #000000;
        color: #CCCCCC;
        font-family: 'Pretendard';
        font-size:12px;
        border: none;
    }
    /* .datalist{
        width: 210px;
        height: 34px;
        background: #000000;
        color: #CCCCCC;
        font-family: 'Pretendard';
        font-size:12px;
        border: none;
    } */
    datalist > option{
       width: 245px;
       background: #000000;
       color: #fff;
    }
}
`

/************************************************************/


export const _CleanSearchIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '18px',
        divHeight: '34px',
        divBackground: 'url("./../../resource/image/sdms/search.png")no-repeat center center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '18px',
        divHeight: '34px',
        divBackground: 'url("./../../resource/image/sdms/search.png")no-repeat center center',
    }
}

export const CleanSearchIcon = styled.div`
    display:${_CleanSearchIcon[ProjectResource.styleMode].divDisplay};
    width:${_CleanSearchIcon[ProjectResource.styleMode].divWidth};
    height:${_CleanSearchIcon[ProjectResource.styleMode].divHeight};
    background:${_CleanSearchIcon[ProjectResource.styleMode].divBackground};
    margin-left: 8px;
}
`

/************************************************************/

export const _CleanSelect = {
    busan: {
        divDisplay: 'block',
        divWidth: '86px',
        divHeight: '34px',
        imgBackgroundSelect: '#000000 url("./../../resource/image/sdms/selectDown.png")no-repeat 90% 50%'
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '86px',
        divHeight: '34px',
        imgBackgroundSelect: '#000000 url("./../../resource/image/sdms/selectDown.png")no-repeat 90% 50%'
    }
}


export const CleanSelect = styled.div`
    display:${_CleanSelect[ProjectResource.styleMode].divDisplay};
    width:${_CleanSelect[ProjectResource.styleMode].divWidth};
    height:${_CleanSelect[ProjectResource.styleMode].divHeight};
    > select{
       width: 86px;
       height: 34px;
       background:${_CleanSelect[ProjectResource.styleMode].imgBackgroundSelect};
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
`

/************************************************************/


export const _CleanSelectPlace = {
    busan: {
        divDisplay: 'block',
        divWidth: '245px',
        divHeight: '34px',
        imgBackgroundSelect: '#000000 url("./../../resource/image/sdms/selectDown.png")no-repeat 92% 50%'
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '245px',
        divHeight: '34px',
        imgBackgroundSelect: '#000000 url("./../../resource/image/sdms/selectDown.png")no-repeat 92% 50%'
    }
}

export const CleanSelectPlace = styled.div`
    display:${_CleanSelectPlace[ProjectResource.styleMode].divDisplay};
    width:${_CleanSelectPlace[ProjectResource.styleMode].divWidth};
    height:${_CleanSelectPlace[ProjectResource.styleMode].divHeight};
    margin-right: 10px;
    > select{
       width: 245px;
       height: 34px;
       background:${_CleanSelectPlace[ProjectResource.styleMode].imgBackgroundSelect};
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
`

/************************************************************/


export const _CleanSYSTable = {
    busan: {
        divDisplay: 'block',
    },
    yeosu: {
        divDisplay: 'block',
    }
}

export const CleanSYSTable = styled.div`
    display:${_CleanSYSTable[ProjectResource.styleMode].divDisplay};
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
       color: #19A5FF;
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
        background: #19A5FF;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
`

/************************************************************/


export const _PopOpenIcon = {
    busan: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '19px',
        divBackground: 'url("./../../resource/image/sdms/popOpen.png")no-repeat center center',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '19px',
        divBackground: 'url("./../../resource/image/sdms/popOpen.png")no-repeat center center',
    }
}

export const PopOpenIcon = styled.div`
    display:${_PopOpenIcon[ProjectResource.styleMode].divDisplay};
    width:${_PopOpenIcon[ProjectResource.styleMode].divWidth};
    height:${_PopOpenIcon[ProjectResource.styleMode].divHeight};
    background:${_PopOpenIcon[ProjectResource.styleMode].divBackground};
    background-position: right;
    margin-top: 21px;
    cursor: pointer;
}
`

/************************************************************/


export const _WeatherPlaceBox = {
    busan: {
        divDisplay: 'flex',
        divWidth: '33.3%',
        divHeight: '50px',
        divColor: '#fff',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '33.3%',
        divHeight: '50px',
        divColor: '#fff',
    }
}

export const WeatherPlaceBox = styled.div`
    display:${_WeatherPlaceBox[ProjectResource.styleMode].divDisplay};
    width:${_WeatherPlaceBox[ProjectResource.styleMode].divWidth};
    height:${_WeatherPlaceBox[ProjectResource.styleMode].divHeight};
    color:${_WeatherPlaceBox[ProjectResource.styleMode].divColor};
    margin-bottom: 6px;
}
`

/************************************************************/


export const _WeatherNum = {
    busan: {
        divDisplay: 'block',
        divWidth: '18px',
        divHeight: '18px',
        divLineHeight: '18px',
        divColor: '#fff',
        divBackgroundColor: '#000000',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '18px',
        divHeight: '18px',
        divLineHeight: '18px',
        divColor: '#fff',
        divBackgroundColor: '#000000',
    }
}

export const WeatherNum = styled.div`
    display:${_WeatherNum[ProjectResource.styleMode].divDisplay};
    width:${_WeatherNum[ProjectResource.styleMode].divWidth};
    height:${_WeatherNum[ProjectResource.styleMode].divHeight};
    line-height:${_WeatherNum[ProjectResource.styleMode].divLineHeight};
    color:${_WeatherNum[ProjectResource.styleMode].divColor};
    background-color:${_WeatherNum[ProjectResource.styleMode].divBackgroundColor};
    border-radius: 3px;
    text-align: center;
    margin-right: 8px;
}
`

/************************************************************/


export const _WeatherPlaceTitle = {
    busan: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '19px',
        divColor: '#fff',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '19px',
        divColor: '#fff',
    }
}

export const WeatherPlaceTitle = styled.div`
    display:${_WeatherPlaceTitle[ProjectResource.styleMode].divDisplay};
    width:${_WeatherPlaceTitle[ProjectResource.styleMode].divWidth};
    height:${_WeatherPlaceTitle[ProjectResource.styleMode].divHeight};
    color:${_WeatherPlaceTitle[ProjectResource.styleMode].divColor};
    line-height:19px;
}
`


/************************************************************/


export const _WeatherPlaceDate = {
    busan: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '19px',
        divColor: '#fff',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '19px',
        divColor: '#fff',
    }
}

export const WeatherPlaceDate = styled.div`
    display:${_WeatherPlaceDate[ProjectResource.styleMode].divDisplay};
    width:${_WeatherPlaceDate[ProjectResource.styleMode].divWidth};
    height:${_WeatherPlaceDate[ProjectResource.styleMode].divHeight};
    color:${_WeatherPlaceDate[ProjectResource.styleMode].divColor};
    line-height:19px;
}
`


/************************************************************/


export const _WeatherPlaceTime = {
    busan: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '19px',
        divColor: '#fff',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '19px',
        divColor: '#fff',
    }
}

export const WeatherPlaceTime = styled.div`
    display:${_WeatherPlaceTime[ProjectResource.styleMode].divDisplay};
    width:${_WeatherPlaceTime[ProjectResource.styleMode].divWidth};
    height:${_WeatherPlaceTime[ProjectResource.styleMode].divHeight};
    color:${_WeatherPlaceTime[ProjectResource.styleMode].divColor};
    line-height:19px;
}
`

/************************************************************/


export const _LessArrowDown = {
    busan: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '8px',
        divBackground: 'url("./../../resource/image/sdms/lessArrowDown.png")no-repeat',

    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '8px',
        divBackground: 'url("./../../resource/image/sdms/lessArrowDown.png")no-repeat',
    }
}

export const LessArrowDown = styled.div`
    display:${_LessArrowDown[ProjectResource.styleMode].divDisplay};
    width:${_LessArrowDown[ProjectResource.styleMode].divWidth};
    height:${_LessArrowDown[ProjectResource.styleMode].divHeight};
    background:${_LessArrowDown[ProjectResource.styleMode].divBackground};
    background-position: center;
    position: absolute;
    bottom: -30px;
}
`


/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/* 도시대기측정망 팝업창 */


export const _AtmosphereCityPopupTop = {
    busan: {
        divDisplay: 'flex',
        divWidth: '1050px',
        divHeight: '60px',
        divLineHeight: '60px',
        divBackground: 'linear-gradient(to bottom, #009BFF, #0065A7)',

    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '1050px',
        divHeight: '60px',
        divLineHeight: '60px',
        divBackground: 'linear-gradient(to bottom, #009BFF, #0065A7)',
    }
}

export const AtmosphereCityPopupTop = styled.div`
    display:${_AtmosphereCityPopupTop[ProjectResource.styleMode].divDisplay};
    width:${_AtmosphereCityPopupTop[ProjectResource.styleMode].divWidth};
    height:${_AtmosphereCityPopupTop[ProjectResource.styleMode].divHeight};
    line-height:${_AtmosphereCityPopupTop[ProjectResource.styleMode].divLineHeight};
    background:${_AtmosphereCityPopupTop[ProjectResource.styleMode].divBackground};
    border-top-left-radius: 9px;
    border-top-right-radius: 9px;
    padding: 0px 10px;
}
`

/********************************************************************/


export const _SensorCityTitle = {
    busan: {
        divDisplay: 'inline-flex',
        divWidth: '50px',
        divColor: '#fff',
        divFontSize: '16px',
    },
    yeosu: {
        divDisplay: 'inline-flex',
        divWidth: '50px',
        divColor: '#fff',
        divFontSize: '16px',
    }
}

export const SensorCityTitle = styled.div`
    display:${_SensorCityTitle[ProjectResource.styleMode].divDisplay};
    /* width:${_SensorCityTitle[ProjectResource.styleMode].divWidth}; */
    color:${_SensorCityTitle[ProjectResource.styleMode].divColor};
    font-size:${_SensorCityTitle[ProjectResource.styleMode].divFontSize};
    flex: 1;
    font-family:  'Pretendard';
    font-weight: 600;
    padding-left: 11px;

`

/********************************************************************/


export const _SensorCityTime = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divColor: '#fff',
        divFontSize: '16px',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '50px',
        divColor: '#fff',
        divFontSize: '16px',
    }
}

export const SensorCityTime = styled.div`
    display:${_SensorCityTime[ProjectResource.styleMode].divDisplay};
    /* width:${_SensorCityTime[ProjectResource.styleMode].divWidth}; */
    color:${_SensorCityTime[ProjectResource.styleMode].divColor};
    font-size:${_SensorCityTime[ProjectResource.styleMode].divFontSize};
    font-family:  'Pretendard';
    font-weight: 600;
    padding-left: 11px;
`

/********************************************************************/


export const _CityCloseIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '16px',
        divHeight: '60px',
        divBackground: 'url("./../../resource/image/sdms/closeIcon.png")no-repeat',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '16px',
        divHeight: '60px',
        divBackground: 'url("./../../resource/image/sdms/closeIcon.png")no-repeat',
    }
}

export const CityCloseIcon = styled.div`
    display:${_CityCloseIcon[ProjectResource.styleMode].divDisplay};
    width:${_CityCloseIcon[ProjectResource.styleMode].divWidth};
    height:${_CityCloseIcon[ProjectResource.styleMode].divHeight};
    background:${_CityCloseIcon[ProjectResource.styleMode].divBackground};
    background-position: center center;
    margin-left: 20px;
    margin-right: 10px;

`

/********************************************************************/


export const _AtmosphereCityTable = {
    busan: {
        divDisplay: 'block',
        divWidth: '98%',
        divHeight: '720px',
        divColor: '#fff',
        divFontSize: '16px',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '98%',
        divHeight: '720px',
        divColor: '#fff',
        divFontSize: '16px',
    }
}

export const AtmosphereCityTable = styled.div`
    /* display:${_AtmosphereCityTable[ProjectResource.styleMode].divDisplay}; */
    width:${_AtmosphereCityTable[ProjectResource.styleMode].divWidth};
    height:${_AtmosphereCityTable[ProjectResource.styleMode].divHeight};
    color:${_AtmosphereCityTable[ProjectResource.styleMode].divColor};
    font-size:${_AtmosphereCityTable[ProjectResource.styleMode].divFontSize};
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
`

/********************************************************************/


export const _CleanTable = {
    busan: {
        divDisplay: 'block',
        divWidth: '98%',
        divHeight: '720px',
        divColor: '#fff',
        divFontSize: '16px',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '98%',
        divHeight: '720px',
        divColor: '#fff',
        divFontSize: '16px',
    }
}

export const CleanTable = styled.div`
    /* display:${_CleanTable[ProjectResource.styleMode].divDisplay}; */
    width:${_CleanTable[ProjectResource.styleMode].divWidth};
    height:${_CleanTable[ProjectResource.styleMode].divHeight};
    color:${_CleanTable[ProjectResource.styleMode].divColor};
    font-size:${_CleanTable[ProjectResource.styleMode].divFontSize};
    overflow-y: scroll;
    margin: 14px;

    > table{
       min-width: 100%;
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
`


/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/* 360VIEW 팝업창 */


export const _View360Box = {
    busan: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '100vh',
        /*imgBackground: 'url("./../../resource/image/sdms/360Image.png")',*/
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '100%',
        divHeight: '100vh',
        /*imgBackground: 'url("./../../resource/image/sdms/360Image.png")',*/
    }
}

export const View360Box = styled.div`
    display:${_View360Box[ProjectResource.styleMode].divDisplay};
    width:${_View360Box[ProjectResource.styleMode].divWidth};
    height:${_View360Box[ProjectResource.styleMode].divHeight};
    /*background:${_View360Box[ProjectResource.styleMode].imgBackground};*/
    position: fixed;
    /* z-index: 101; */
    z-index: 3;
    /*padding: 10px;*/

`

/********************************************************************/


export const _Viewarea = {
    busan: {
        divDisplay: 'block',
        divWidth: '100vw !important',
        divHeight: '100vh !important',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '100vw !important',
        divHeight: '100vh !important',
    }
}

export const Viewarea = styled.div`
    display:${_Viewarea[ProjectResource.styleMode].divDisplay};
    width:${_Viewarea[ProjectResource.styleMode].divWidth};
    height:${_Viewarea[ProjectResource.styleMode].divHeight};

`

/********************************************************************/


export const _ViewBottomBar = {
    busan: {
        divDisplay: 'flex',
        divWidth: '100%',
        divHeight: '46px',
        divLineHeight: '46px',
        divBackground: '#000000',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '100%',
        divHeight: '46px',
        divLineHeight: '46px',
        divBackground: '#000000',
    }
}

export const ViewBottomBar = styled.div`
    display:${_ViewBottomBar[ProjectResource.styleMode].divDisplay};
    width:${_ViewBottomBar[ProjectResource.styleMode].divWidth};
    height:${_ViewBottomBar[ProjectResource.styleMode].divHeight};
    line-height:${_ViewBottomBar[ProjectResource.styleMode].divLineHeight};
    background:${_ViewBottomBar[ProjectResource.styleMode].divBackground};
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 101;
`

/********************************************************************/


export const _ViewLeftBox = {
    busan: {
        divDisplay: 'flex',
        divWidth: '100%',
        divColor: '#fff',
        divFontSize: '12px',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '100%',
        divColor: '#fff',
        divFontSize: '12px',
    }
}

export const ViewLeftBox = styled.div`
    display:${_ViewLeftBox[ProjectResource.styleMode].divDisplay};
    width:${_ViewLeftBox[ProjectResource.styleMode].divWidth};
    color:${_ViewLeftBox[ProjectResource.styleMode].divColor};
    font-size:${_ViewLeftBox[ProjectResource.styleMode].divFontSize};
    margin-left: 20px;
    > span {
       display: inline-flex;
       margin-right: 6px;

    }
`

/********************************************************************/

export const _ViewRightBox = {
    busan: {
        divDisplay: 'flex',
        divHeight: '46px',
    },
    yeosu: {
        divDisplay: 'flex',
        divHeight: '46px',
    }
}

export const ViewRightBox = styled.div`
    display:${_ViewRightBox[ProjectResource.styleMode].divDisplay};
    height:${_ViewRightBox[ProjectResource.styleMode].divHeight};
    align-items: center;
}

`

/********************************************************************/


export const _ViewPlusIcon = {
    busan: {
        divDisplay: 'block',
        divWidth: '24px',
        divHeight: '24px',
        imgBackground: 'url("./../../resource/image/sdms/zoom_in.png")',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '24px',
        divHeight: '24px',
        imgBackground: 'url("./../../resource/image/sdms/zoom_in.png")',
    }
}

export const ViewPlusIcon = styled.div`
    display:${_ViewPlusIcon[ProjectResource.styleMode].divDisplay};
    width:${_ViewPlusIcon[ProjectResource.styleMode].divWidth};
    height:${_ViewPlusIcon[ProjectResource.styleMode].divHeight};
    background:${_ViewPlusIcon[ProjectResource.styleMode].imgBackground};
    margin-right: 16px;

`

/********************************************************************/


export const _ViewMinusIcon = {
    busan: {
        divDisplay: 'block',
        divWidth: '24px',
        divHeight: '24px',
        imgBackground: 'url("./../../resource/image/sdms/zoom_out.png")',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '24px',
        divHeight: '24px',
        imgBackground: 'url("./../../resource/image/sdms/zoom_out.png")',
    }
}

export const ViewMinusIcon = styled.div`
    display:${_ViewMinusIcon[ProjectResource.styleMode].divDisplay};
    width:${_ViewMinusIcon[ProjectResource.styleMode].divWidth};
    height:${_ViewMinusIcon[ProjectResource.styleMode].divHeight};
    background:${_ViewMinusIcon[ProjectResource.styleMode].imgBackground};
    margin-right: 16px;

`

/********************************************************************/


export const _ViewEntire = {
    busan: {
        divDisplay: 'block',
        divWidth: '24px',
        divHeight: '24px',
        imgBackground: 'url("./../../resource/image/sdms/fullscreen_icon.png")',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '24px',
        divHeight: '24px',
        imgBackground: 'url("./../../resource/image/sdms/fullscreen_icon.png")',
    }
}

export const ViewEntire = styled.div`
    display:${_ViewEntire[ProjectResource.styleMode].divDisplay};
    width:${_ViewEntire[ProjectResource.styleMode].divWidth};
    height:${_ViewEntire[ProjectResource.styleMode].divHeight};
    background:${_ViewEntire[ProjectResource.styleMode].imgBackground};
    margin-right: 16px;

`

/********************************************************************/

export const _ViewMinimap = {
    busan: {
        divDisplay: 'block',
        divWidth: '24px',
        divHeight: '24px',
        imgBackground: 'url("./../../resource/image/sdms/miniMap_view.png")',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '24px',
        divHeight: '24px',
        imgBackground: 'url("./../../resource/image/sdms/miniMap_view.png")',
    }
}

export const ViewMinimap = styled.div`
    display:${_ViewMinimap[ProjectResource.styleMode].divDisplay};
    width:${_ViewMinimap[ProjectResource.styleMode].divWidth};
    height:${_ViewMinimap[ProjectResource.styleMode].divHeight};
    background:${_ViewMinimap[ProjectResource.styleMode].imgBackground};
    margin-right: 20px;
`


/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/* POI편집모드 팝업창 */


export const _POIadd = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        imgBackground: 'url("./../../resource/image/sdms/add_active.png")',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        imgBackground: 'url("./../../resource/image/sdms/add_active.png")',
        imgBackgroundAct: 'url("./../../resource/image/sdms/add_active.png")',
    }
}


export const POIadd = styled.div`
     display:${_POIadd[ProjectResource.styleMode].divDisplay};
     width:${_POIadd[ProjectResource.styleMode].divWidth};
     height:${_POIadd[ProjectResource.styleMode].divHeight};
     background:${_POIadd[ProjectResource.styleMode].imgBackground};
     background-size:38px;
     margin-right: 10px;
     &:hover {
       background:${_POIadd[ProjectResource.styleMode].imgBackgroundAct};
       background-size:38px;
     } 

`

/********************************************************************/

export const _POIaddDis = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        imgBackground: 'url("./../../resource/image/sdms/add.png")',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        imgBackground: 'url("./../../resource/image/sdms/add.png")',
    }
}

export const POIaddDis = styled.div`
     display:${_POIaddDis[ProjectResource.styleMode].divDisplay};
     width:${_POIaddDis[ProjectResource.styleMode].divWidth};
     height:${_POIaddDis[ProjectResource.styleMode].divHeight};
     background:${_POIaddDis[ProjectResource.styleMode].imgBackground};
     background-size:38px;
     margin-right: 10px;
`


/********************************************************************/


export const _POIdelete = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        imgBackground: 'url("./../../resource/image/sdms/remove_active.png")',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        imgBackground: 'url("./../../resource/image/sdms/remove_active.png")',
        imgBackgroundAct: 'url("./../../resource/image/sdms/remove_active.png")',
    }
}


export const POIdelete = styled.div`
     display:${_POIdelete[ProjectResource.styleMode].divDisplay};
     width:${_POIdelete[ProjectResource.styleMode].divWidth};
     height:${_POIdelete[ProjectResource.styleMode].divHeight};
     background:${_POIdelete[ProjectResource.styleMode].imgBackground};
     background-size:38px;
     margin-right: 10px;
     &:hover {
       background:${_POIdelete[ProjectResource.styleMode].imgBackgroundAct};
       background-size:38px;
     } 
`

/********************************************************************/


export const _POIdeleteDis = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        imgBackground: 'url("./../../resource/image/sdms/remove.png")',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        imgBackground: 'url("./../../resource/image/sdms/remove.png")',
    }
}

export const POIdeleteDis = styled.div`
     display:${_POIdeleteDis[ProjectResource.styleMode].divDisplay};
     width:${_POIdeleteDis[ProjectResource.styleMode].divWidth};
     height:${_POIdeleteDis[ProjectResource.styleMode].divHeight};
     background:${_POIdeleteDis[ProjectResource.styleMode].imgBackground};
     background-size:38px;
     margin-right: 10px;
`


/********************************************************************/


export const _POIchange = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        imgBackground: 'url("./../../resource/image/sdms/changeAct.png")',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        imgBackground: 'url("./../../resource/image/sdms/changeAct.png")',
        imgBackgroundAct: 'url("./../../resource/image/sdms/changeAct.png")',
    }
}


export const POIchange = styled.div`
     display:${_POIchange[ProjectResource.styleMode].divDisplay};
     width:${_POIchange[ProjectResource.styleMode].divWidth};
     height:${_POIchange[ProjectResource.styleMode].divHeight};
     background:${_POIchange[ProjectResource.styleMode].imgBackground};
     background-size:38px;
     margin-right: 10px;
     &:hover {
       background:${_POIchange[ProjectResource.styleMode].imgBackgroundAct};
       background-size:38px;
     } 

`

/********************************************************************/


export const _POIchangeDis = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        imgBackground: 'url("./../../resource/image/sdms/changeDis.png")',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        imgBackground: 'url("./../../resource/image/sdms/changeDis.png")',
    }
}

export const POIchangeDis = styled.div`
     display:${_POIchangeDis[ProjectResource.styleMode].divDisplay};
     width:${_POIchangeDis[ProjectResource.styleMode].divWidth};
     height:${_POIchangeDis[ProjectResource.styleMode].divHeight};
     background:${_POIchangeDis[ProjectResource.styleMode].imgBackground};
     background-size:38px;
     margin-right: 10px;
`


/********************************************************************/


export const _POImove = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        imgBackground: 'url("./../../resource/image/sdms/move_active.png")',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        imgBackground: 'url("./../../resource/image/sdms/move_active.png")',
        imgBackgroundAct: 'url("./../../resource/image/sdms/move_active.png")',
    }
}


export const POImove = styled.div`
     display:${_POImove[ProjectResource.styleMode].divDisplay};
     width:${_POImove[ProjectResource.styleMode].divWidth};
     height:${_POImove[ProjectResource.styleMode].divHeight};
     background:${_POImove[ProjectResource.styleMode].imgBackground};
     background-size:38px;
     margin-right: 10px;
     &:hover {
       background:${_POImove[ProjectResource.styleMode].imgBackgroundAct};
       background-size:38px;
     } 

`

/********************************************************************/


export const _POImoveDis = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        imgBackground: 'url("./../../resource/image/sdms/move.png")',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        imgBackground: 'url("./../../resource/image/sdms/move.png")',
    }
}

export const POImoveDis = styled.div`
     display:${_POImoveDis[ProjectResource.styleMode].divDisplay};
     width:${_POImoveDis[ProjectResource.styleMode].divWidth};
     height:${_POImoveDis[ProjectResource.styleMode].divHeight};
     background:${_POImoveDis[ProjectResource.styleMode].imgBackground};
     background-size:38px;
     margin-right: 10px;
`

/********************************************************************/


export const _SensorSearchBox = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '100%',
        divHeight: '34px',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '100%',
        divHeight: '34px',
    }
}

export const SensorSearchBox = styled.div`
     display:${_SensorSearchBox[ProjectResource.styleMode].divDisplay};
     width:${_SensorSearchBox[ProjectResource.styleMode].divWidth};
     height:${_SensorSearchBox[ProjectResource.styleMode].divHeight}; 
     background: #000000;
     color: #fff;
     border-radius: 5px;
     /* opacity: 0.4; */
     margin-bottom: 10.5px;
     > input[type="text"]{
        width: 339px;
        background: none;
        border:none;
        font-size: 12px;
        height: 34px;
        line-height: 34px;
        color: #B3B3B3 !important;
        font-family: 'Pretendard';
        font-weight: '600';
     }
     > input[type="text"]::placeholder{
        color: #B3B3B3;
        font-size: 12px;
    }
`

/********************************************************************/

export const SensorSearchBoxVOC = styled.div`
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
`


/********************************************************************/


export const _SearchIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '45px',
        divHeight: '34px',
        divBackground: 'url("./../../resource/image/sdms/search.png")no-repeat center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '45px',
        divHeight: '34px',
        divBackground: 'url("./../../resource/image/sdms/magnifying-glass.png")no-repeat center',
    }
}

export const SearchIcon = styled.div`
     display:${_SearchIcon[ProjectResource.styleMode].divDisplay};
     width:${_SearchIcon[ProjectResource.styleMode].divWidth};
     height:${_SearchIcon[ProjectResource.styleMode].divHeight};
     background:${_SearchIcon[ProjectResource.styleMode].divBackground};
     background-size: 16px;
     float: right; 
`

/********************************************************************/


export const _SensorList2 = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '100%',
        divHeight: '288px',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '100%',
        divHeight: '288px',
    }
}

export const SensorList2 = styled.div`
     display:${_SensorList2[ProjectResource.styleMode].divDisplay};
     width:${_SensorList2[ProjectResource.styleMode].divWidth};
     height:${_SensorList2[ProjectResource.styleMode].divHeight};
     border:dashed 1px #4D4D4D66;
     border-radius: 10px;
     > span {
         color: #fff;
     }

`

/********************************************************************/


export const _SensorListTitle = {
    busan: {
        divDisplay: 'flex',
        divWidth: '343px',
        divHeight: '34px',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '343px',
        divHeight: '34px',
    }
}

export const SensorListTitle = styled.div`
     display:${_SensorListTitle[ProjectResource.styleMode].divDisplay};
     /* width:${_SensorListTitle[ProjectResource.styleMode].divWidth}; */
     height:${_SensorListTitle[ProjectResource.styleMode].divHeight}; 
     padding: 4px 16px;
     border-bottom: dashed 1px #4d4d4d;
     > span{
        color: #fff;
        font-size: 12px;
        flex-grow :1;
        width: 100%;
        margin-top: 8px;
     }
     > .selectBox{
        display: inline-block;
        width: 56px;
        height: 19px;
        background: #19A5FF;
        border-radius: 5px;
        color: #fff;
        font-size: 10px;
        padding: 4px 8px;
        float: right;
    }
`

/********************************************************************/


export const _SensorselectBox = {
    busan: {
        divDisplay: 'inline-block',
    },
    yeosu: {
        divDisplay: 'inline-block',
    }
}

export const SensorselectBox = styled.div`
    display:${_SensorselectBox[ProjectResource.styleMode].divDisplay};
    select {
        width: 56px;
        height: 19px;
        background: #19A5FF url("./../../resource/image/sdms/arrow_drop_down.png")no-repeat 94% 50%;
        background-size: 20px;
        /* transform: rotate(90deg); */
        border-radius: 5px;
        color: #fff;
        border:none;
        font-size: 11px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
    }
    select::-ms-expand {
        display: none;
    }
    select > option{
       background: #fff;
       color: #000000;
       height: 34px;
       line-height: 34px;
       font-size: 11px;
    }
`

/************************************************************/


export const _SensorListContents = {
    busan: {
        divDisplay: 'block',
        divWidth: '343px',
        divHeight: '250px',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '343px',
        divHeight: '250px',
    }
}


export const SensorListContents = styled.div`
     display:${_SensorListContents[ProjectResource.styleMode].divDisplay};
     /* width:${_SensorListContents[ProjectResource.styleMode].divWidth}; */
     height:${_SensorListContents[ProjectResource.styleMode].divHeight};
     overflow-y:scroll;
    &::-webkit-scrollbar {
        width: 5px;
        border-radius: 2px;
        background-color: #666666;
    }
    &::-webkit-scrollbar-thumb {
        width: 5px;
        border-radius: 2px;
        background: #19A5FF;  /* 0105 */
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
     .SensorListLine {
        /* height: 36px;
        line-height: 36px; */
        display: flex;
        align-items: center;
        padding: 10px 12px;
        border-bottom: dashed 1px #4d4d4d;
     }
     .SensorListLine:hover{
        background:#4D4D4D66;
     }
     .SensorListLine::-webkit-scrollbar {
        width: 2px;
        border-radius: 2px;
        background-color: #666666;
    }
    .SensorListLine::-webkit-scrollbar-thumb {
        width: 2px;
        border-radius: 2px;
        background: #19A5FF;  /* 0105 */
    }
    .SensorListLine::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
     > div > span{
        color: #fff;
        font-size: 11px;
     }
     > div > span > input {
        background: none;
        color: #ffffff;
        font-size: 11px;
        border:none;
        height: 16px;
        cursur: pointer;
        /* line-height: 34px; */
     }
`

/********************************************************************/


export const _AtmosphereIconL = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '16px',
        divHeight: '16px',
        divBackground: 'url("./../../resource/image/sdms/Atmosphere_icon.png")no-repeat center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '16px',
        divHeight: '16px',
        divBackground: 'url("./../../resource/image/sdms/Atmosphere_icon.png")no-repeat center',
    }
}

export const AtmosphereIconL = styled.div`
     display:${_AtmosphereIconL[ProjectResource.styleMode].divDisplay};
     width:${_AtmosphereIconL[ProjectResource.styleMode].divWidth};
     height:${_AtmosphereIconL[ProjectResource.styleMode].divHeight};
     background:${_AtmosphereIconL[ProjectResource.styleMode].divBackground};
     background-size: 16px;
     margin-right: 10px;
`

/********************************************************************/


export const _WaterQualityIconL = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '16px',
        divHeight: '16px',
        divBackground: 'url("./../../resource/image/sdms/water_icon.png")no-repeat center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '16px',
        divHeight: '16px',
        divBackground: 'url("./../../resource/image/sdms/water_icon.png")no-repeat center',
    }
}

export const WaterQualityIconL = styled.div`
     display:${_WaterQualityIconL[ProjectResource.styleMode].divDisplay};
     width:${_WaterQualityIconL[ProjectResource.styleMode].divWidth};
     height:${_WaterQualityIconL[ProjectResource.styleMode].divHeight};
     background:${_WaterQualityIconL[ProjectResource.styleMode].divBackground};
     background-size: 16px;
     margin-right: 10px;
`


/********************************************************************/


export const _WeatherIconL = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '16px',
        divHeight: '16px',
        divBackground: 'url("./../../resource/image/sdms/weather_icon.png")no-repeat center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '16px',
        divHeight: '16px',
        divBackground: 'url("./../../resource/image/sdms/weather_icon.png")no-repeat center',
    }
}

export const WeatherIconL = styled.div`
     display:${_WeatherIconL[ProjectResource.styleMode].divDisplay};
     width:${_WeatherIconL[ProjectResource.styleMode].divWidth};
     height:${_WeatherIconL[ProjectResource.styleMode].divHeight};
     background:${_WeatherIconL[ProjectResource.styleMode].divBackground};
     background-size: 16px;
     margin-right: 10px;
`


/********************************************************************/


export const _VOCIconL = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '16px',
        divHeight: '16px',
        divBackground: 'url("./../../resource/image/sdms/analysis_icon.png")no-repeat center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '16px',
        divHeight: '16px',
        divBackground: 'url("./../../resource/image/sdms/analysis_icon.png")no-repeat center',
    }
}

export const VOCIconL = styled.div`
     display:${_VOCIconL[ProjectResource.styleMode].divDisplay};
     width:${_VOCIconL[ProjectResource.styleMode].divWidth};
     height:${_VOCIconL[ProjectResource.styleMode].divHeight};
     background:${_VOCIconL[ProjectResource.styleMode].divBackground};
     background-size: 16px;
     margin-right: 10px;
`

/********************************************************************/


export const _CCTVIconL = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '16px',
        divHeight: '16px',
        divBackground: 'url("./../../resource/image/sdms/cctv_icon.png")no-repeat center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '16px',
        divHeight: '16px',
        divBackground: 'url("./../../resource/image/sdms/cctv_icon.png")no-repeat center',
    }
}

export const CCTVIconL = styled.div`
     display:${_CCTVIconL[ProjectResource.styleMode].divDisplay};
     width:${_CCTVIconL[ProjectResource.styleMode].divWidth};
     height:${_CCTVIconL[ProjectResource.styleMode].divHeight};
     background:${_CCTVIconL[ProjectResource.styleMode].divBackground};
     background-size: 16px;
     margin-right: 10px;
`

/********************************************************************/


export const _BacteriaIconL = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '16px',
        divHeight: '16px',
        divBackground: 'url("./../../resource/image/sdms/bacteria_icon.png")no-repeat center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '16px',
        divHeight: '16px',
        divBackground: 'url("./../../resource/image/sdms/bacteria_icon.png")no-repeat center',
    }
}

export const BacteriaIconL = styled.div`
     display:${_BacteriaIconL[ProjectResource.styleMode].divDisplay};
     width:${_BacteriaIconL[ProjectResource.styleMode].divWidth};
     height:${_BacteriaIconL[ProjectResource.styleMode].divHeight};
     background:${_BacteriaIconL[ProjectResource.styleMode].divBackground};
     background-size: 16px;
     margin-right: 10px;
`


/********************************************************************/


export const _POIAddBox = {
    busan: {
        divDisplay: 'block',
        divWidth: '197px',
        divHeight: '425px',
        divBackground: '#fff',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '197px',
        divHeight: '425px',
        divBackground: '#fff',
    }
}

export const POIAddBox = styled.div`
     display:${_POIAddBox[ProjectResource.styleMode].divDisplay};
     width:${_POIAddBox[ProjectResource.styleMode].divWidth};
     height:${_POIAddBox[ProjectResource.styleMode].divHeight};
     background:${_POIAddBox[ProjectResource.styleMode].divBackground};
     border-radius: 5px;
     padding: 10px;
     box-shadow: 0px 3px 6px #00000029;
     > span{
       display:block;
       padding: 10px 0px;
       color:#19A5FF;
       text-align: center;
       font-family: 'Pretendard';
       font-size:14px;
       font-weight: 600;
     }
`

/********************************************************************/


export const _POIAddWaterBox = {
    busan: {
        divDisplay: 'block',
        divWidth: '197px',
        divHeight: '461px',
        divBackground: '#fff',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '197px',
        divHeight: '461px',
        divBackground: '#fff',
    }
}

export const POIAddWaterBox = styled.div`
     display:${_POIAddWaterBox[ProjectResource.styleMode].divDisplay};
     width:${_POIAddWaterBox[ProjectResource.styleMode].divWidth};
     height:${_POIAddWaterBox[ProjectResource.styleMode].divHeight};
     background:${_POIAddWaterBox[ProjectResource.styleMode].divBackground};
     border-radius: 5px;
     padding: 10px;
     box-shadow: 0px 3px 6px #00000029;
     > span{
       display:block;
       padding: 10px 0px;
       color:#19A5FF;
       text-align: center;
       font-family: 'Pretendard';
       font-size:14px;
       font-weight: 600;
     }
`

/********************************************************************/


export const _SClassification = {
    busan: {
        divDisplay: 'block',
        divWidth: '177px',
        divHeight: '50px',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '177px',
        divHeight: '50px',
    }
}

export const SClassification = styled.div`
     display:${_SClassification[ProjectResource.styleMode].divDisplay};
     width:${_SClassification[ProjectResource.styleMode].divWidth};
     height:${_SClassification[ProjectResource.styleMode].divHeight};
     font-family:  'Pretendard';
     font-size:12px;
     margin-bottom: 7px;
     > span {
        display: block;
        color: #000000;
        font-family: 'Pretendard';
        font-size:12px;
        font-weight: 600;
        margin-bottom: 4px;
     }
     > select{
        width: 177px;
        height: 30px;
        background: #F5F5F5 url("./../../resource/image/sdms/expand_downArrow_Gray.png")no-repeat 94% 50%;
        background-size: 14px;
        color: #CCCCCC;
        font-family: 'Pretendard';
        font-size:12px;
     }
     > select > option{
        color: #000000;
        font-family: 'Pretendard';
        font-size:12px;
     }
`


/********************************************************************/


export const _SBranchName = {
    busan: {
        divDisplay: 'block',
        divWidth: '177px',
        divHeight: '50px',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '177px',
        divHeight: '50px',
    }
}

export const SBranchName = styled.div`
     display:${_SBranchName[ProjectResource.styleMode].divDisplay};
     width:${_SBranchName[ProjectResource.styleMode].divWidth};
     height:${_SBranchName[ProjectResource.styleMode].divHeight};
     font-family:  'Pretendard';
     font-size:12px;
     margin-bottom: 7px;
     > span {
        display: block;
        color: #000000;
        font-family: 'Pretendard';
        font-size:12px;
        font-weight: 600;
        margin-bottom: 4px;
     }
     > input{
        width: 177px;
        height: 30px;
        background: #F5F5F5;
        color: #CCCCCC;
        font-family: 'Pretendard';
        font-size:12px;
        border: none;
     }
`


/********************************************************************/


export const _SAddress = {
    busan: {
        divDisplay: 'block',
        divWidth: '177px',
        divHeight: '50px',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '177px',
        divHeight: '50px',
    }
}

export const SAddress = styled.div`
     display:${_SAddress[ProjectResource.styleMode].divDisplay};
     width:${_SAddress[ProjectResource.styleMode].divWidth};
     height:${_SAddress[ProjectResource.styleMode].divHeight};
     font-family:  'Pretendard';
     font-size:12px;
     margin-bottom: 7px;
     > span {
        display: block;
        color: #000000;
        font-family: 'Pretendard';
        font-size:12px;
        font-weight: 600;
        margin-bottom: 4px;
     }
     > input{
        width: 177px;
        height: 30px;
        background: #F5F5F5;
        color: #CCCCCC;
        font-family: 'Pretendard';
        font-size:12px;
        border: none;
    }
`


/********************************************************************/


export const _Scategory = {
    busan: {
        divDisplay: 'block',
        divWidth: '177px',
        divHeight: '140px',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '177px',
        divHeight: '140px',
    }
}

export const Scategory = styled.div`
     display:${_Scategory[ProjectResource.styleMode].divDisplay};
     width:${_Scategory[ProjectResource.styleMode].divWidth};
     height:${_Scategory[ProjectResource.styleMode].divHeight};
     font-family:  'Pretendard';
     font-size:12px;
     margin-bottom: 7px;
     > span {
        display: block;
        color: #000000;
        font-family: 'Pretendard';
        font-size:12px;
        font-weight: 600;
        margin-bottom: 4px;
     }
     > input{
        width: 177px;
        height: 30px;
        background: #F5F5F5;
        color: #CCCCCC;
        font-family: 'Pretendard';
        font-size:12px;
        border: none;
        margin-bottom: 4px;
     }
     > select{
        width: 177px;
        height: 30px;
        background: #F5F5F5 url("./../../resource/image/sdms/expand_downArrow_Gray.png")no-repeat 94% 50%;
        background-size: 14px;
        color: #CCCCCC;
        font-family: 'Pretendard';
        font-size:12px;
        margin-bottom: 4px;
     }
     > select > option{
        color: #000000;
        font-family: 'Pretendard';
        font-size:12px;
     }
`

/********************************************************************/


export const _ScategoryWater = {
    busan: {
        divDisplay: 'block',
        divWidth: '177px',
        divHeight: '176px',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '177px',
        divHeight: '176px',
    }
}

export const ScategoryWater = styled.div`
     display:${_ScategoryWater[ProjectResource.styleMode].divDisplay};
     width:${_ScategoryWater[ProjectResource.styleMode].divWidth};
     height:${_ScategoryWater[ProjectResource.styleMode].divHeight};
     font-family:  'Pretendard';
     font-size:12px;
     margin-bottom: 7px;
     > span {
        display: block;
        color: #000000;
        font-family: 'Pretendard';
        font-size:12px;
        font-weight: 600;
        margin-bottom: 4px;
     }
     > input{
        width: 177px;
        height: 30px;
        background: #F5F5F5;
        color: #CCCCCC;
        font-family: 'Pretendard';
        font-size:12px;
        border: none;
        margin-bottom: 4px;
     }
     > select{
        width: 177px;
        height: 30px;
        background: #F5F5F5 url("./../../resource/image/sdms/expand_downArrow_Gray.png")no-repeat 94% 50%;
        background-size: 14px;
        color: #CCCCCC;
        font-family: 'Pretendard';
        font-size:12px;
        margin-bottom: 4px;
     }
     > select > option{
        color: #000000;
        font-family: 'Pretendard';
        font-size:12px;
     }
`

/********************************************************************/


export const _POIBtn = {
    busan: {
        divDisplay: 'flex',
        divWidth: '177px',
        divHeight: '50px',
    },
    yeosu: {
        divDisplay: 'flex',
        divWidth: '177px',
        divHeight: '50px',
    }
}

export const POIBtn = styled.div`
     display:${_POIBtn[ProjectResource.styleMode].divDisplay};
     width:${_POIBtn[ProjectResource.styleMode].divWidth};
     height:${_POIBtn[ProjectResource.styleMode].divHeight};
     font-family:  'Pretendard';
     font-size:12px;
     padding: 20px 0px;
     .reset{
        display: inline-block;
        width: 85px;
        height: 24px;
        line-height: 24px;
        text-align: center; 
        border-radius: 5px;
        border:solid 1px #19A5FF;
        cursor: pointer;
        color: #19A5FF;
        margin-right: 8px;
     }
     .save{
        display: inline-block;
        width: 85px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        border-radius: 5px;
        background: #19A5FF;
        cursor: pointer;
        color:#fff;
     }
`

/********************************************************************/


export const _TriBox = {
    busan: {
        divWidth: '0px',
        divHeight: '0px',
    },
    yeosu: {
        divWidth: '0px',
        divHeight: '0px',
    }
}

export const TriBox = styled.div`
     width:${_TriBox[ProjectResource.styleMode].divWidth};
     height:${_TriBox[ProjectResource.styleMode].divHeight};
     border-bottom: 10px solid transparent;
     border-top: 10px solid transparent;
     border-left: 10px solid #fff;
     border-right:10px solid transparent;
     position: absolute;
     left: 197px;
     top: 90px;
`


/********************************************************************/


export const _TriBox2 = {
    busan: {
        divWidth: '0px',
        divHeight: '0px',
    },
    yeosu: {
        divWidth: '0px',
        divHeight: '0px',
    }
}

export const TriBox2 = styled.div`
     width:${_TriBox2[ProjectResource.styleMode].divWidth};
     height:${_TriBox2[ProjectResource.styleMode].divHeight};
     border-bottom: 10px solid transparent;
     border-top: 10px solid transparent;
     border-left: 10px solid #fff;
     border-right:10px solid transparent;
     position: absolute;
     left: 197px;
     top: 90px;
`


/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/* nav 팝업창 */


export const _NavbarArea = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '255px',
        divHeight: '38px',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '255px',
        divHeight: '38px',
    }
}

export const NavbarArea = styled.div`
     display:${_NavbarArea[ProjectResource.styleMode].divDisplay};
     /* width:${_NavbarArea[ProjectResource.styleMode].divWidth}; */
     height:${_NavbarArea[ProjectResource.styleMode].divHeight};
     background:#000000;
     border-radius: 20px;
`


/********************************************************************/


export const _NaviIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '34px',
        divHeight: '34px',
        divBackground: 'url("./../../resource/image/sdms/navCircle.png")no-repeat',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '34px',
        divHeight: '34px',
        divBackground: 'url("./../../resource/image/sdms/navCircle.png")no-repeat',
    }
}

export const NaviIcon = styled.div`
     display:${_NaviIcon[ProjectResource.styleMode].divDisplay};
     width:${_NaviIcon[ProjectResource.styleMode].divWidth};
     height:${_NaviIcon[ProjectResource.styleMode].divHeight};
     background:${_NaviIcon[ProjectResource.styleMode].divBackground};
     background-size: 38px;
     float:left;
`


/********************************************************************/


export const _NaviIconDis = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '34px',
        divHeight: '34px',
        divBackground: '#19A5FF url("./../../resource/image/sdms/navigation.png")no-repeat',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '34px',
        divHeight: '34px',
        divBackground: '#19A5FF url("./../../resource/image/sdms/navigation.png")no-repeat',
    }
}


export const NaviIconDis = styled.div`
     display:${_NaviIconDis[ProjectResource.styleMode].divDisplay};
     width:${_NaviIconDis[ProjectResource.styleMode].divWidth};
     height:${_NaviIconDis[ProjectResource.styleMode].divHeight};
     background:${_NaviIconDis[ProjectResource.styleMode].divBackground};
     background-size: 38px;
     margin-right: 18px;
     border-radius: 50%;
     /* margin-left: 30px; */
`

/********************************************************************/


export const _HomeIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        divBackground: 'url("./../../resource/image/sdms/home_black_active.png")no-repeat center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        divBackground: 'url("./../../resource/image/sdms/home_black_active.png")no-repeat center',
    }
}

export const HomeIcon = styled.div`
     display:${_HomeIcon[ProjectResource.styleMode].divDisplay};
     width:${_HomeIcon[ProjectResource.styleMode].divWidth};
     height:${_HomeIcon[ProjectResource.styleMode].divHeight};
     background:${_HomeIcon[ProjectResource.styleMode].divBackground};
     background-size: 24px;
`

/********************************************************************/


export const _HomeIconDis = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        divBackground: 'url("./../../resource/image/sdms/home_black.png")no-repeat center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        divBackground: 'url("./../../resource/image/sdms/home_black.png")no-repeat center',
    }
}

export const HomeIconDis = styled.div`
     display:${_HomeIconDis[ProjectResource.styleMode].divDisplay};
     width:${_HomeIconDis[ProjectResource.styleMode].divWidth};
     height:${_HomeIconDis[ProjectResource.styleMode].divHeight};
     background:${_HomeIconDis[ProjectResource.styleMode].divBackground};
`

/********************************************************************/


export const _ViewIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        divBackground: 'url("./../../resource/image/sdms/view_active.png")no-repeat center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        divBackground: 'url("./../../resource/image/sdms/view_active.png")no-repeat center',
    }
}

export const ViewIcon = styled.div`
     display:${_ViewIcon[ProjectResource.styleMode].divDisplay};
     width:${_ViewIcon[ProjectResource.styleMode].divWidth};
     height:${_ViewIcon[ProjectResource.styleMode].divHeight};
     background:${_ViewIcon[ProjectResource.styleMode].divBackground};
     background-size: 24px;
`

/********************************************************************/


export const _ViewIconDis = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        divBackground: 'url("./../../resource/image/sdms/view.png")no-repeat center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        divBackground: 'url("./../../resource/image/sdms/view.png")no-repeat center',
    }
}

export const ViewIconDis = styled.div`
     display:${_ViewIconDis[ProjectResource.styleMode].divDisplay};
     width:${_ViewIconDis[ProjectResource.styleMode].divWidth};
     height:${_ViewIconDis[ProjectResource.styleMode].divHeight};
     background:${_ViewIconDis[ProjectResource.styleMode].divBackground};
     background-size: 24px;
`

/********************************************************************/


export const _ZoomInIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        divBackground: 'url("./../../resource/image/sdms/zoom_in_active.png")no-repeat center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        divBackground: 'url("./../../resource/image/sdms/zoom_in_active.png")no-repeat center',
    }
}

export const ZoomInIcon = styled.div`
     display:${_ZoomInIcon[ProjectResource.styleMode].divDisplay};
     width:${_ZoomInIcon[ProjectResource.styleMode].divWidth};
     height:${_ZoomInIcon[ProjectResource.styleMode].divHeight};
     background:${_ZoomInIcon[ProjectResource.styleMode].divBackground};
     background-size: 24px;
`

/********************************************************************/


export const _ZoomInIconDis = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        divBackground: 'url("./../../resource/image/sdms/zoom_in.png")no-repeat center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        divBackground: 'url("./../../resource/image/sdms/zoom_in.png")no-repeat center',
    }
}

export const ZoomInIconDis = styled.div`
     display:${_ZoomInIconDis[ProjectResource.styleMode].divDisplay};
     width:${_ZoomInIconDis[ProjectResource.styleMode].divWidth};
     height:${_ZoomInIconDis[ProjectResource.styleMode].divHeight};
     background:${_ZoomInIconDis[ProjectResource.styleMode].divBackground};
     background-size: 24px;
`

/********************************************************************/


export const _ZoomOutIcon = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        divBackground: 'url("./../../resource/image/sdms/zoom_out_active.png")no-repeat center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        divBackground: 'url("./../../resource/image/sdms/zoom_out_active.png")no-repeat center',
    }
}

export const ZoomOutIcon = styled.div`
     display:${_ZoomOutIcon[ProjectResource.styleMode].divDisplay};
     width:${_ZoomOutIcon[ProjectResource.styleMode].divWidth};
     height:${_ZoomOutIcon[ProjectResource.styleMode].divHeight};
     background:${_ZoomOutIcon[ProjectResource.styleMode].divBackground};
     background-size: 24px;
`

/********************************************************************/

export const _ZoomOutIconDis = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        divBackground: 'url("./../../resource/image/sdms/zoom_out.png")no-repeat center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        divBackground: 'url("./../../resource/image/sdms/zoom_out.png")no-repeat center',
    }
}

export const ZoomOutIconDis = styled.div`
     display:${_ZoomOutIconDis[ProjectResource.styleMode].divDisplay};
     width:${_ZoomOutIconDis[ProjectResource.styleMode].divWidth};
     height:${_ZoomOutIconDis[ProjectResource.styleMode].divHeight};
     background:${_ZoomOutIconDis[ProjectResource.styleMode].divBackground};
     background-size: 24px;
`

/********************************************************************/


export const _TurnOn = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        divBackground: 'url("./../../resource/image/sdms/turnon_active.png")no-repeat center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        divBackground: 'url("./../../resource/image/sdms/turnon_active.png")no-repeat center',
    }
}

export const TurnOn = styled.div`
     display:${_TurnOn[ProjectResource.styleMode].divDisplay};
     width:${_TurnOn[ProjectResource.styleMode].divWidth};
     height:${_TurnOn[ProjectResource.styleMode].divHeight};
     background:${_TurnOn[ProjectResource.styleMode].divBackground};
     background-size: 24px;
     margin-right: 18px;
`

/********************************************************************/


export const _TurnOnDis = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        divBackground: 'url("./../../resource/image/sdms/turnon.png")no-repeat center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        divBackground: 'url("./../../resource/image/sdms/turnon.png")no-repeat center',
    }
}

export const TurnOnDis = styled.div`
     display:${_TurnOnDis[ProjectResource.styleMode].divDisplay};
     width:${_TurnOnDis[ProjectResource.styleMode].divWidth};
     height:${_TurnOnDis[ProjectResource.styleMode].divHeight};
     background:${_TurnOnDis[ProjectResource.styleMode].divBackground};
     background-size: 24px;
     margin-right: 18px;
`

/********************************************************************/

export const _TurnOff = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        divBackground: 'url("./../../resource/image/sdms/turnoff_active.png")no-repeat center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        divBackground: 'url("./../../resource/image/sdms/turnoff_active.png")no-repeat center',
    }
}

export const TurnOff = styled.div`
     display:${_TurnOff[ProjectResource.styleMode].divDisplay};
     width:${_TurnOff[ProjectResource.styleMode].divWidth};
     height:${_TurnOff[ProjectResource.styleMode].divHeight};
     background:${_TurnOff[ProjectResource.styleMode].divBackground};
     background-size: 24px;
     margin-right: 18px;
`

/********************************************************************/


export const _TurnOffDis = {
    busan: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        divBackground: 'url("./../../resource/image/sdms/turnoff.png")no-repeat center',
    },
    yeosu: {
        divDisplay: 'inline-block',
        divWidth: '38px',
        divHeight: '38px',
        divBackground: 'url("./../../resource/image/sdms/turnoff.png")no-repeat center',
    }
}

export const TurnOffDis = styled.div`
     display:${_TurnOffDis[ProjectResource.styleMode].divDisplay};
     width:${_TurnOffDis[ProjectResource.styleMode].divWidth};
     height:${_TurnOffDis[ProjectResource.styleMode].divHeight};
     background:${_TurnOffDis[ProjectResource.styleMode].divBackground};
     background-size: 24px;
     margin-right: 18px;
`



