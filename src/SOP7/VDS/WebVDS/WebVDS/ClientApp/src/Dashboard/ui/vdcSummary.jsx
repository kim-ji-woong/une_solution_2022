import React, { Component } from 'react';

import dash from '../../Dashboard/css/dash.module.css';
import ReactApexChart from 'react-apexcharts'

import { ChartDonutUtilization } from '@patternfly/react-charts';
import ProjectResource from '../../Root/resource/id';
import VDCList from './vdsList';


class VDCSummary extends Component {

    constructor(props) {
        super(props);
        this.props = props;

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

    getDataCenters() {
        const user = ProjectResource.getUserInfo();

        if (!this.props.dataCenters || !user) {
            return [];
        }

        const centers = [];
        const dataCenters = { ...this.props.dataCenters };

        for (const siteName in dataCenters) {
            const site = dataCenters[siteName];

            for (const nationName in site.nations) {
                const nation = site.nations[nationName];

                for (const centerName in nation.centers) {
                    const dataCenter = nation.centers[centerName];

                    if (VDCList.belongToDataCenter(user, dataCenter)) {
                        centers.push({
                            name: centerName,
                            ratio: dataCenter.usingRatio
                        });
                    }
                }
            }
        }

        centers.sort((center1, center2) => {
            if (center1.ratio < center2.ratio) {
                return 1;
            }
            else if (center1.ratio > center2.ratio) {
                return -1;
            }

            return 0;
        });

        return centers;
    }

    getDataCenterNameEvent1(name, nameConts, hidden) {
        if (name.length > 12) {
            nameConts = name;
            name = name.substring(0, 12) + "...";

            //console.log(name);
            //console.log(nameConts);

            return (
                <>
                    <div style={{ position: 'relative' }} style={{ display: 'block' }}>
                        <div className="tooltipUsageDataName">
                            <span className="tooltipUsageDataNameTitle">
                                {name}
                            </span>
                            <span className="tooltipUsageDataNameConts tooltip-left">
                                {nameConts}
                            </span>
                        </div>
                    </div>
                </>
            );
        } else {
            return (
                <div>{name}</div>
            );
        }

        if (hidden) {
            return (
                <div className={dash.textHidden}>{name}</div>
            );
        }

        return (
            <div>{name}</div>
        );
    }

    getDataCenterNameEvent2(name2, nameConts2, hidden) {
        if (name2.length > 8) {
            nameConts2 = name2;
            name2 = name2.substring(0, 8) + "...";

            return (
                <div style={{ position: 'relative' }} style={{ display: 'block' }}>
                    <div className="tooltipUsageData2Name">
                        <span className="tooltipUsageData2NameTitle">
                            {name2}
                        </span>
                        <span className="tooltipUsageData2NameConts tooltip-left">
                            {nameConts2}
                        </span>
                    </div>
                </div>
            );
        } else {
            return (
                <div>{name2}</div>
            );
        }

        if (hidden) {
            return (
                <div className={dash.textHidden}>{name2}</div>
            );
        }

        return (
            <div>{name2}</div>
        );
    }

    getDataCenterNameEvent3(name3, nameConts3, hidden) {
        if (name3.length > 8) {
            nameConts3 = name3;
            name3 = name3.substring(0, 8) + "...";

            return (
                <div style={{ position: 'relative' }} style={{ display: 'block' }}>
                    <div className="tooltipUsageData3Name">
                        <span className="tooltipUsageData3NameTitle">
                            {name3}
                        </span>
                        <span className="tooltipUsageData3NameConts tooltip-left">
                            {nameConts3}
                        </span>
                    </div>
                </div>
            );
        } else {
            return (
                <div>{name3}</div>
            );
        }

        if (hidden) {
            return (
                <div className={dash.textHidden}>{name3}</div>
            );
        }

        return (
            <div>{name3}</div>
        );
    }

    getDataCenterNameEvent4(name4, nameConts4, hidden) {
        if (name4.length > 8) {
            nameConts4 = name4;
            name4 = name4.substring(0, 8) + "...";

            return (
                <div style={{ position: 'relative' }} style={{ display: 'block' }}>
                    <div className="tooltipUsageData4Name">
                        <span className="tooltipUsageData4NameTitle">
                            {name4}
                        </span>
                        <span className="tooltipUsageData4NameConts tooltip-left">
                            {nameConts4}
                        </span>
                    </div>
                </div>
            );
        } else {
            return (
                <div>{name4}</div>
            );
        }

        if (hidden) {
            return (
                <div className={dash.textHidden}>{name4}</div>
            );
        }

        return (
            <div>{name4}</div>
        );
    }

    getDataCenterElement(index, dataCenters, chartData) {
        const name = dataCenters[index].name;
        const nameConts = dataCenters[index].name;
        const name2 = dataCenters[index].name;
        const nameConts2 = dataCenters[index].name;
        const name3 = dataCenters[index].name;
        const nameConts3 = dataCenters[index].name;
        const name4 = dataCenters[index].name;
        const nameConts4 = dataCenters[index].name;

        console.log(name);
        console.log(nameConts);
        console.log(name2);
        console.log(nameConts2);
        console.log(name3);
        console.log(nameConts3);
        console.log(name4);
        console.log(nameConts4);

        if (index >= dataCenters.length) {
            return <></>;
        }

        console.log(index);

        if (index === 0) {
            return (
                <div className={dash.paju}>
                    <ReactApexChart
                        options={chartData.options}
                        series={chartData.series}
                        type="donut"
                        style={{ width: '155px', height: '100px', position: 'relative' }}
                    />

                    <span className={dash.pajuTitle}>
                        {/* {dataCenters[index].name} */}
                        {
                            this.getDataCenterNameEvent1(name, nameConts)
                        }
                    </span> 
                    <div className={dash.positionNumBox}>
                        <span className={dash.pajuNum}>{dataCenters[index].ratio.toFixed(1) + "%"}</span>
                    </div>
                </div>
            );
        }
        else if (index === 1) {

            console.log(index);
            return (
                <div className={dash.jeonju}>
                    <ReactApexChart
                        options={chartData.options}
                        series={chartData.series}
                        type="donut"
                        style={{ width: '155px', height: '100px', position: 'relative' }}
                    />
                    <span className={dash.jeonjuTitle}>
                        {/* {dataCenters[index].name} */}
                        {
                            this.getDataCenterNameEvent2(name2, nameConts2)
                        }
                    </span>
                    <div className={dash.positionNumBox}>
                        <span className={dash.jeonjuNum}>{dataCenters[index].ratio.toFixed(1) + "%"}</span>
                    </div>
                </div>
            );
        }
        else if (index === 2) {
            return (
                <div className={dash.naju}>
                    <ReactApexChart
                        options={chartData.options}
                        series={chartData.series}
                        type="donut"
                        style={{ width: '155px', height: '100px', position: 'relative'  }}
                    />
                    <span className={dash.najuTitle}>
                        {/* {dataCenters[index].name} */}
                        {
                            this.getDataCenterNameEvent3(name3, nameConts3)
                        }
                    </span>
                    <div className={dash.positionNumBox}>
                        <span className={dash.najuNum}>{dataCenters[index].ratio.toFixed(1) + "%"}</span>
                    </div>
                </div>
                );
        }

        return (
                <div className={dash.changwon}>
                    <ReactApexChart
                        options={chartData.options}
                        series={chartData.series}
                        type="donut"
                        style={{ width: '155px', height: '100px', position: 'relative'  }}
                    />
                    <span className={dash.changwonTitle}>
                        {/* {dataCenters[index].name} */}
                        {
                           this.getDataCenterNameEvent4(name4, nameConts4)
                        } 
                    </span>
                    <div className={dash.positionNumBox}>
                    <span className={dash.changwonNum}>{dataCenters[index].ratio.toFixed(1) + "%"}</span>
                    </div>
                </div>
        );
    }

    getDataCenterRatio(index, dataCenters) {
        if (index < dataCenters.length) {
            const ratio = parseFloat(dataCenters[index].ratio.toFixed(1));
            return [ratio, 100 - ratio];
        }

        return [0, 100];
    }

    displayUI = () => {
        let displayUI = [];
        const dataCenters = this.getDataCenters();

        let widthSize = window.outerWidth;

        const chartData1 = {
            series: this.getDataCenterRatio(0, dataCenters),

            options: {
                chart: { type: "donut" },
                legend: { show: false },
                dataLabels: { enabled: false },
                tooltip: { enabled: false },
                fill: { colors: ["#00B5F7", "#fff"] },
                /* states: {
                  hover: { filter: { type: "lighten", value: 1 } },
                  active: { filter: { type: "none", value: 1 } }
                }, */
                stroke: { width: 0 },
                responsive: [{
                    breakpoint: 480,
                }],
                plotOptions: {
                    pie: {
                        expandOnClick: false,
                        donut: {
                            size: "90%",
                            position: "right",
                            labels: {
                                show: false,
                                name: { show: false },
                                total: {
                                    show: true,
                                    showAlways: true,
                                    formatter: function (w) {
                                        const totals = w.globals.seriesTotals;

                                        const result = totals.reduce((a, b) => a + b, 0);

                                        return (result / 1000).toFixed(3);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        const chartData2 = {
            series: this.getDataCenterRatio(1, dataCenters),

            options: {
                chart: { type: "donut" },
                legend: { show: false },
                dataLabels: { enabled: false },
                tooltip: { enabled: false },
                fill: { colors: ["#5394FF", "#fff"] },
                stroke: { width: 0 },
                responsive: [{
                    breakpoint: 480,
                }],
                plotOptions: {
                    pie: {
                        expandOnClick: false,
                        donut: {
                            size: "90%",
                            position: "right",
                            labels: {
                                show: false,
                                name: { show: false },
                                total: {
                                    show: true,
                                    showAlways: true,
                                    formatter: function (w) {
                                        const totals = w.globals.seriesTotals;

                                        const result = totals.reduce((a, b) => a + b, 0);

                                        return (result / 1000).toFixed(3);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        const chartData3 = {
            series: [1, 800],

            options: {
                chart: { type: "donut" },
                legend: { show: false },
                dataLabels: { enabled: false },
                tooltip: { enabled: false },
                fill: { colors: ["#fff", "#2BC6D9"] },
                /* states: {
                  hover: { filter: { type: "lighten", value: 1 } },
                  active: { filter: { type: "none", value: 1 } }
                }, */
                stroke: { width: 0 },
                responsive: [{
                    breakpoint: 480,
                }],
                plotOptions: {
                    pie: {
                        expandOnClick: false,
                        donut: {
                            size: "90%",
                            position: "right",
                            labels: {
                                show: false,
                                name: { show: false },
                                total: {
                                    show: true,
                                    showAlways: true,
                                    formatter: function (w) {
                                        const totals = w.globals.seriesTotals;

                                        const result = totals.reduce((a, b) => a + b, 0);

                                        return (result / 1000).toFixed(3);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        const chartData4 = {
            series: [1, 1000],

            options: {
                chart: { type: "donut" },
                legend: { show: false },
                dataLabels: { enabled: false },
                tooltip: { enabled: false },
                fill: { colors: ["#fff", "#3942B9"] },
                /* states: {
                  hover: { filter: { type: "lighten", value: 1 } },
                  active: { filter: { type: "none", value: 1 } }
                }, */
                stroke: { width: 0 },
                responsive: [{
                    breakpoint: 480,
                }],
                plotOptions: {
                    pie: {
                        expandOnClick: false,
                        donut: {
                            size: "90%",
                            position: "right",
                            labels: {
                                show: false,
                                name: { show: false },
                                total: {
                                    show: true,
                                    showAlways: true,
                                    formatter: function (w) {
                                        const totals = w.globals.seriesTotals;

                                        const result = totals.reduce((a, b) => a + b, 0);

                                        return (result / 1000).toFixed(3);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        if (widthSize <= 1920) {
            if (dataCenters.length >= 2) {
                displayUI.push(
                    <>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            {
                                this.getDataCenterElement(0, dataCenters, chartData1)
                                /*<div className={dash.paju}>
                                    <span className={dash.pajuTitle}>파주DC</span>
                                    <ReactApexChart
                                        options={chartData1.options}
                                        series={chartData1.series}
                                        type="donut"
                                        style={{ width: '160px', height: '100px', paddingLeft: '30px', position: 'relative' }}
                                    />
                                    <div className={dash.positionNumBox}>
                                        <span className={dash.pajuNum}>120</span>
                                    </div>
                                </div>*/
                            }
                            {
                                this.getDataCenterElement(1, dataCenters, chartData2)
                                /*<div className={dash.jeonju}>
                                    <span className={dash.jeonjuTitle}>전주DC</span>
                                    <ReactApexChart
                                        options={chartData2.options}
                                        series={chartData2.series}
                                        type="donut"
                                        style={{ width: '160px', height: '100px', paddingLeft: '30px', position: 'relative'  }}
                                    />
                                    <div className={dash.positionNumBox}>
                                        <span className={dash.jeonjuNum}>80</span>
                                    </div>
                                </div>*/
                            }
                        </div>
                    </>
                );
            }
            else if (dataCenters.length >= 1) {
                displayUI.push(
                    <>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            {
                                this.getDataCenterElement(0, dataCenters, chartData1)
                            }
                        </div>
                    </>
                );
            }

        } else if (widthSize >= 1921) {
            if (dataCenters.length >= 2) {
                displayUI.push(
                    <>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            {
                                this.getDataCenterElement(0, dataCenters, chartData1)
                                /*<div className={dash.paju}>
                                    <span className={dash.pajuTitle}>파주DC</span>
                                    <ReactApexChart
                                        options={chartData1.options}
                                        series={chartData1.series}
                                        type="donut"
                                        style={{ width: '160px', height: '100px', paddingLeft: '30px', position: 'relative' }}
                                    />
                                    <div className={dash.positionNumBox}>
                                        <span className={dash.pajuNum}>120</span>
                                    </div>
                                </div>*/
                            }
                            {
                                this.getDataCenterElement(1, dataCenters, chartData2)
                                /*<div className={dash.jeonju}>
                                    <span className={dash.jeonjuTitle}>전주DC</span>
                                    <ReactApexChart
                                        options={chartData2.options}
                                        series={chartData2.series}
                                        type="donut"
                                        style={{ width: '160px', height: '100px', paddingLeft: '30px', position: 'relative' }}
                                    />
                                    <div className={dash.positionNumBox}>
                                        <span className={dash.jeonjuNum}>80</span>
                                    </div>
                                </div>*/
                            }
                        </div>
                    </>
                );
            }
            else if (dataCenters.length >= 1) {
                displayUI.push(
                    <>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            {
                                this.getDataCenterElement(0, dataCenters, chartData1)
                                /*<div className={dash.paju}>
                                    <span className={dash.pajuTitle}>파주DC</span>
                                    <ReactApexChart
                                        options={chartData1.options}
                                        series={chartData1.series}
                                        type="donut"
                                        style={{ width: '160px', height: '100px', paddingLeft: '30px', position: 'relative' }}
                                    />
                                    <div className={dash.positionNumBox}>
                                        <span className={dash.pajuNum}>120</span>
                                    </div>
                                </div>*/
                            }
                        </div>
                    </>
                );
            }

        } else {
            displayUI.push(
                <></>
            );
        }

        return displayUI;
    }


    render() {
        let displayUI = this.state.disUI;

        return (
            <>
                <div id='tooltip-area'></div>
                <div className={dash.vdcSummary}>
                    <span className={dash.vdcSummaryTitle}>{ProjectResource.ID.dashboard.usageSummary}</span>
                    <span className={dash.pieGraph}>

                        {displayUI}

                    </span>
                </div>
            </>
        );
    }
}

export default VDCSummary;