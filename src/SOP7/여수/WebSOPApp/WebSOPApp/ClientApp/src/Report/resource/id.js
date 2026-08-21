import ProjectResource from "../../Root/resource/id";
import StringUtil from '../../Common/util/StringUtil';

export default class ReportResource {
    static get ID() {
        return ReportResource.id[ProjectResource.targetLanguage];
    }

    static id = {
        "ko": {
            projectName: "보고서",

            menu:
            {
                reportYeosu: "보고서 및 통계",
            }
        }
    }

    static type = {
        Entire: 0,
        Atmosphere: 1,
        Water: 2,
        Weather: 3,
        VOC: 4,
        OU: 10,
    }

    static dataPeriodType = {
        minute: 0,
        hour: 1,
    }

    static getDate(date) {
        const dt = date;

        let mm = dt.getMonth() + 1;
        let dd = dt.getDate();
        const ymd = StringUtil.getDoubleString(mm) + '월' + StringUtil.getDoubleString(dd) + '일';
        const hms = StringUtil.getDoubleString(dt.getHours()) + ':' + StringUtil.getDoubleString(dt.getMinutes());

        return ymd + ' ' + hms;
    }
}