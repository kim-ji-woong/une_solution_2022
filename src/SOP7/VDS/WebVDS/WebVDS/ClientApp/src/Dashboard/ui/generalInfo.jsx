import React, { Component } from 'react';

import dash from '../../Dashboard/css/dash.module.css';
import ProjectResource from '../../Root/resource/id';
import wsManager from '../../Root/services/wsManager';


class GeneralInfoBox extends Component {
    getDate(regDate) {
        if (!regDate) {
            return "";
        }

        const index = regDate.indexOf('T');

        if (index > 0) {
            return regDate.substring(0, index);
        }

        return "";
    }

    getSiteInfo() {
        if (!this.props.dataCenters) {
            return [0, [], []];
        }

        const sites = [];
        const siteMaps = {};
        const centers = [];
        const dataCenters = { ...this.props.dataCenters };

        for (const siteName in dataCenters) {
            const site = dataCenters[siteName];

            for (const nationName in site.nations) {
                const nation = site.nations[nationName];

                for (const centerName in nation.centers) {
                    const dataCenter = nation.centers[centerName];
                    centers.push(dataCenter);

                    if (dataCenter.site) {
                        siteMaps[dataCenter.site.id] = dataCenter.site;
                    }
                }
            }
        }

        for (const siteID in siteMaps) {
            const site = siteMaps[siteID];
            sites.push(site);
        }

        if (sites.length === 0) {
            if (this.props.site) {
                return [1, [], [this.props.site]];
            }
        }

        return [sites.length, centers, sites];
    }

    getDataCenterSize(dataCenter) {
        return this.getSizeString(dataCenter.width, dataCenter.unitOfLength) + " X " + this.getSizeString(dataCenter.length, dataCenter.unitOfLength) + " X " + this.getSizeString(dataCenter.height, dataCenter.unitOfLength) + " (M)";
    }

    getSizeString(data, unit) {
        if (unit === wsManager.unitOfLength.mm) {
            data = data / 1000;
        }
        else if (unit === wsManager.unitOfLength.cm) {
            data = data / 100;
        }

        const str = data.toFixed(1).toString();

        if (str.includes('.') === false) {
            return str;
        }

        for (let i = str.length - 1; i >= 0; i--) {
            if (str[i] !== '0') {
                if (str[i] === '.') {
                    return str.substring(0, i);
                }
                else {
                    return str.substring(0, i + 1);
                }
            }
        }

        return str;
    }

    getDate(date) {
        if (!date) {
            return "";
        }

        const index1 = date.indexOf('-');

        if (index1 < 0) {
            return "";
        }

        const index2 = date.indexOf('-', index1 + 1);

        if (index2 < index1) {
            return "";
        }

        const year = date.substring(0, index1);
        const month = date.substring(index1 + 1, index2);
        const day = date.substring(index2 + 1, index2 + 3);

        return year + "." + month + "." + day;
    }

    getCompany(dataCenter) {
        if (!dataCenter.data) {
            return "-";
        }

        if (!dataCenter.data.company) {
            return "-";
        }

        return dataCenter.data.company;
    }

    getDataCenterManager(dataCenter) {
        const team = dataCenter.data?.managerTeam ? dataCenter.data.managerTeam.trim() : "";
        const manager = dataCenter.data?.manager ? dataCenter.data.manager.trim() : "";

        if (team.length > 0 && manager.length > 0) {
            return team + " / " + manager;
        }
        else if (team.length > 0) {
            return team;
        }

        return manager;
    }

    render() {
        const [siteCount, centers, sites] = this.getSiteInfo();

        if (siteCount === 1) {
            const selectedCenter = this.props.selectedCenter;

            if (selectedCenter) {
                const manager = this.getDataCenterManager(selectedCenter);

                return (
                    <>
                        <div className={dash.generalInfoBox}>
                            <span className={dash.generalInfoTitle}>{ProjectResource.ID.dashboard.generalInfo}</span>
                            <div className={dash.generalContents}>
                                <span>{ProjectResource.ID.dashboard.generalInfoDetail.companyName + " : " + ProjectResource.getSiteName(selectedCenter.site)}</span>
                                <span>{ProjectResource.ID.dashboard.generalInfoDetail.creationType + " : " + selectedCenter.creationType}</span>
                                <span>{ProjectResource.ID.dashboard.generalInfoDetail.vdcCompany + " : " + this.getCompany(selectedCenter)}</span>
                                <span>{ProjectResource.ID.dashboard.generalInfoDetail.size + " : " + this.getDataCenterSize(selectedCenter)}</span>
                                <span>{ProjectResource.ID.dashboard.generalInfoDetail.adminUser + " : " + manager}</span>
                                <span>{ProjectResource.ID.dashboard.generalInfoDetail.beginDate + " : " + this.getDate(sites[0].data.serviceBeginDate) + ", " + ProjectResource.ID.dashboard.generalInfoDetail.endDate + " : " + this.getDate(sites[0].data.serviceEndDate)}</span>
                            </div>
                        </div>
                    </>
                );
            }
            else {
                const manager = sites[0].data?.manager ? sites[0].data.manager : "";
                const address = sites[0].data?.address ? sites[0].data.address : "";

                return (
                    <>
                        <div className={dash.generalInfoBox}>
                            <span className={dash.generalInfoTitle}>{ProjectResource.ID.dashboard.generalInfo}</span>
                            <div className={dash.generalContents}>
                                <span>{ProjectResource.ID.dashboard.generalInfoDetail.companyName + " : " + ProjectResource.getSiteName(sites[0])}</span>
                                <div style={{ display: 'flex' }}><span>{ProjectResource.ID.dashboard.generalInfoDetail.address + " : "}</span><p className={dash.generalAddress}>{address}</p></div>
                                <span>{ProjectResource.ID.dashboard.generalInfoDetail.adminUser + " : " + manager}</span>
                                <span>{ProjectResource.ID.dashboard.generalInfoDetail.vdcCount + " : " + centers.length}</span>
                                <span>{ProjectResource.ID.dashboard.generalInfoDetail.beginDate + " : " + this.getDate(sites[0].data.serviceBeginDate)}</span>
                                <span>{ProjectResource.ID.dashboard.generalInfoDetail.endDate + " : " + this.getDate(sites[0].data.serviceEndDate)}</span>
                            </div>
                        </div>
                    </>
                );
            }
        }

        return (
            <>
                <div className={dash.generalInfoBox}>
                    <span className={dash.generalInfoTitle}>{ProjectResource.ID.dashboard.generalInfo}</span>
                    <div className={dash.generalContents}>
                        <span>{ProjectResource.ID.dashboard.generalInfoDetail.companyName + " : "}</span>
                        <span>{ProjectResource.ID.dashboard.generalInfoDetail.address + " : "}</span>
                        <span>{ProjectResource.ID.dashboard.generalInfoDetail.adminUser + " : "}</span>
                    </div>
                </div>
            </>
        )
    }
}

export default GeneralInfoBox;