import React, { Component } from 'react';

import dash from '../../Dashboard/css/dash.module.css';

import ReactApexChart from 'react-apexcharts'
import $ from 'jquery';
import ProjectResource from '../../Root/resource/id';
import VDCList from './vdsList';


class VDCProSummary extends Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.centerValues = {};

        this.state = {
            disUI: this.displayUI(),
        };
    }

    resizeUI() {
        this.setState({ disUI: this.displayUI() });
    }

    componentDidMount() {
        window.addEventListener('resize', () => this.resizeUI());
    }

    componentWillUnmount() {
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }

    getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    displayUI = () => {
        let displayUI = [];

        let widthSize = window.outerWidth;

        const dataCenters = { ...this.props.dataCenters };
        const user = ProjectResource.getUserInfo();

        if (user) {
            const centers = [];

            for (const siteName in dataCenters) {
                const site = dataCenters[siteName];

                for (const nationName in site.nations) {
                    const nation = site.nations[nationName];

                    for (const centerName in nation.centers) {
                        const center = nation.centers[centerName];

                        if (VDCList.belongToDataCenter(user, center) === false) {
                            continue;
                        }

                        centers.push(center);
                    }
                }
            }

            centers.sort((center1, center2) => {
                if (center1.usingRatio < center2.usingRatio) {
                    return 1;
                }
                else if (center1.usingRatio > center2.usingRatio) {
                    return -1;
                }

                return 0;
            });

            for (const center of centers) {
                let centerValue = center.usingRatio.toFixed(1);

                if (widthSize <= 1920) {
                    displayUI.push(
                        <div style={{ display: 'block', marginBottom: '20px', marginRight: '10px' }}>
                            <span className={dash.jeonjuTitle}>{ProjectResource.getDataCenterName(center)}</span>
                            <progress className={dash.progressJeonju} value={centerValue} min="0" max="100"></progress>
                        </div>
                    );
                }
                else if (widthSize >= 1921) {
                    displayUI.push(
                        <div style={{ display: 'block', marginBottom: '30px', marginRight: '10px' }}>
                            <span className={dash.jeonjuTitle}>{ProjectResource.getDataCenterName(center)}</span>
                            <progress className={dash.progressJeonju} value={centerValue} min="0" max="100"></progress>
                        </div>
                    );
                }
            }
        }

        return displayUI;
    }


    render() {
        let displayUI = this.state.disUI;

        return (
            <>
                <div className={dash.vdcProSummary}>
                    <span className={dash.propertySTitle}>{ProjectResource.ID.dashboard.assetSummary}</span>

                    <div className={dash.stickGraph + " " + dash.vdcStickScroll}>
                        {displayUI}
                    </div>


                </div>
            </>
        );
    }
}

export default VDCProSummary;