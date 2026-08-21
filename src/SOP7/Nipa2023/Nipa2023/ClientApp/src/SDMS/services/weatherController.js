import ProjectResource from '../../Root/resource/id';
import { WeatherJsonManager } from './weatherJsonManager';

export class WeatherController {
    static async requestCurrentData(siteID) {
        try {
            const jsonData = WeatherJsonManager.makeRequestCurrentData(siteID);

            const res = await fetch(ProjectResource.baseUrl + '/SDMS/Weather/RequestCurrentData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.weatherDatas, result.message];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestCurrentData 실패"];
    }

    static async requestWeeklyInfo() {
        try {
            const jsonData = WeatherJsonManager.makeRequestWeeklyInfo();

            const res = await fetch(ProjectResource.baseUrl + '/SDMS/Weather/RequestWeeklyInfo', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.datas, result.message];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestWeeklyInfo 실패"];
    }
}