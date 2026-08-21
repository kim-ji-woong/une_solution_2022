import ProjectResource from "../../Root/resource/id";

import imgCloudy from '../images/weather/cloudy.png';
import imgCloudDay from '../images/weather/cloud_day.png';
import imgCloudNight from '../images/weather/cloud_night.png';
import imgHeavySnow from '../images/weather/heavySnow.png';
import imgSnow from '../images/weather/snow.png';
import imgSnowRain from '../images/weather/snowRain.png';
import imgHeavyRain from '../images/weather/heavyRain.png';
import imgRain from '../images/weather/rain.png';
import imgSunnyDay from '../images/weather/sunny_day.png';
import imgSunnyNight from '../images/weather/sunny_night.png';
import imgThunder from '../images/weather/thunder.png';
import imgDustStorm from '../images/weather/dustStorm.png';

export default class DashboardResource {
    static get ID() {
        return DashboardResource.id[ProjectResource.targetLanguage];
    }

    static id = {
        "ko": {
            mesMenu: {
                product: "생산 현황",
                quality: "품질 현황",
                buy: "구매 현황",
                sell: "매출 현황"
            }
        }
    }
    
    static Menu = {
        Product: 0,
        Quality: 1,
        Buy: 2,
        Sell: 3
    }

    static WeatherInfo = {
        Unknown: 0,
        Sunshine: 1,
        Thunder: 2,
        SnowRain: 3,
        HeavySnow: 4,
        Snow: 5,
        HeavyRain: 6,
        Rain: 7,
        Cloudy: 8,
        Cloud: 9,
        DustStorm: 10,
        FineDust: 11,
    }

    static getWindDirection(state) {
        let windDirection = "";

        if (state === 0) {
            windDirection = "북쪽";
        } else if (state === 1) {
            windDirection = "북북동쪽";
        } else if (state === 2) {
            windDirection = "북동쪽";
        } else if (state === 3) {
            windDirection = "동북동쪽";
        } else if (state === 4) {
            windDirection = "동쪽";
        } else if (state === 5) {
            windDirection = "동남쪽";
        } else if (state === 6) {
            windDirection = "남동쪽";
        } else if (state === 7) {
            windDirection = "남남동쪽";
        } else if (state === 8) {
            windDirection = "남쪽";
        } else if (state === 9) {
            windDirection = "남남서쪽";
        } else if (state === 10) {
            windDirection = "남서쪽";
        } else if (state === 11) {
            windDirection = "서남서쪽";
        } else if (state === 12) {
            windDirection = "서쪽";
        } else if (state === 13) {
            windDirection = "서북서쪽";
        } else if (state === 14) {
            windDirection = "북서쪽";
        } else if (state === 15) {
            windDirection = "북북서쪽";
        } else  {
            windDirection = "바람 없음";
        }

        return windDirection;
    }

    static isDayLight() {
        const now = new Date();
        const hour = now.getHours();

        if (hour < 6 || hour >= 19) {
            return false;
        }

        return true;
    }

    static getStateImage(state) {
        if (state === DashboardResource.WeatherInfo.Sunshine) {
            if (DashboardResource.isDayLight()) {
                return imgSunnyDay;
            }
            else {
                return imgSunnyNight;
            }
        }
        else if (state === DashboardResource.WeatherInfo.Thunder) {
            return imgThunder;
        }
        else if (state === DashboardResource.WeatherInfo.SnowRain) {
            return imgSnowRain;
        }
        else if (state === DashboardResource.WeatherInfo.HeavySnow) {
            return imgHeavySnow;
        }
        else if (state === DashboardResource.WeatherInfo.Snow) {
            return imgSnow;
        }
        else if (state === DashboardResource.WeatherInfo.HeavyRain) {
            return imgHeavyRain;
        }
        else if (state === DashboardResource.WeatherInfo.Rain) {
            return imgRain;
        }
        else if (state === DashboardResource.WeatherInfo.Cloudy) {
            return imgCloudy;
        }
        else if (state === DashboardResource.WeatherInfo.DustStorm) {
            return imgDustStorm;
        }

        if (DashboardResource.isDayLight()) {
            return imgCloudDay;
        }

        return imgCloudNight;
    }

    static getWeatherStateString(state) {
        if (state === DashboardResource.WeatherInfo.Sunshine) {
            return "맑음";
        }
        else if (state === DashboardResource.WeatherInfo.Thunder) {
            return "천둥번개";
        }
        else if (state === DashboardResource.WeatherInfo.SnowRain) {
            return "진눈깨비";
        }
        else if (state === DashboardResource.WeatherInfo.HeavySnow) {
            return "폭설";
        }
        else if (state === DashboardResource.WeatherInfo.Snow) {
            return "눈";
        }
        else if (state === DashboardResource.WeatherInfo.HeavyRain) {
            return "폭우";
        }
        else if (state === DashboardResource.WeatherInfo.Rain) {
            return "비";
        }
        else if (state === DashboardResource.WeatherInfo.Cloudy) {
            return "구름";
        }
        else if (state === DashboardResource.WeatherInfo.DustStorm) {
            return "황사";
        }

        if (DashboardResource.isDayLight()) {
            return "구름조금";
        }

        return "밤";
    }
}