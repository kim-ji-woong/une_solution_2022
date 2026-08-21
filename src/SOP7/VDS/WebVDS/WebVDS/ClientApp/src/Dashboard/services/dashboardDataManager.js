import ProjectResource from "../../Root/resource/id";

export default class DashboardDataManager {
    static rebuildDataCenters(dataCenters, siteDatas) {
        const sites = {};
        const kor = ProjectResource.targetLanguage === "ko";

        for (const dataCenter of dataCenters) {
            const siteName = kor ? dataCenter.site.name : dataCenter.site.engName;
            const nationName = kor ? dataCenter.nation.name : dataCenter.nation.engName;
            const centerName = kor ? dataCenter.name : dataCenter.engName;

            siteDatas[siteName] = dataCenter.site;

            let site = sites[siteName];

            if (!site) {
                site = {
                    nations: {}
                };
                sites[siteName] = site;
            }

            let nation = site.nations[nationName];

            if (!nation) {
                nation = {
                    centers: {}
                };
                site.nations[nationName] = nation;
            }

            nation.centers[centerName] = dataCenter;
        }

        return sites;
    }
}