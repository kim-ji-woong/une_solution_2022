import React, { Component } from 'react';

import dash from '../../Dashboard/css/dash.module.css';

//import 'bootstrap/dist/css/bootstrap.min.css';
//import { Progress } from "reactstrap"

import ApexChart from 'react-apexcharts'

import { ChartDonutUtilization } from '@patternfly/react-charts';
import ProjectResource from '../../Root/resource/id';
import DashboardController from '../services/dashboardController';

import Tooltip from '../../Main/ui/tooltip';

class VDCUsage extends Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            spacer: '',
            used: 0,
            disUI: this.displayUI(),
            vdcID: null,
            statistics: null,
            usageTooltipShow: false,
            tooltipTop: 0,
            tooltipLeft: 0,
        };
    }

    resizeUI() {
        this.setState({ disUI: this.displayUI() });
    }

    componentDidMount() {

        window.addEventListener('resize', () => this.resizeUI());

        this.interval = setInterval(() => {
            const { used } = this.state;
            const val = (used + 10) % 100;
            this.setState({
                spacer: val < 10 ? ' ' : '',
                used: val
            });
        }, 1000);

        this.checkVdcDatas();
    }

    componentDidUpdate() {
        this.checkVdcDatas();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }

    async checkVdcDatas() {
        if (!this.props.selectedCenter) {
            return;
        }

        if (this.state.vdcID !== this.props.selectedCenter.id) {
            const [statistics,] = await DashboardController.requestVdcStatistics(this.props.selectedCenter.id);

            if (statistics) {
                this.setState({ statistics, vdcID: this.props.selectedCenter.id });
            }
        }
    }

    handleTooltip = (param, e) => {
        const domRect = e.target.getBoundingClientRect();

        if (param === 'center') {
            this.setState({
                centerTooltipShow: !this.state.centerTooltipShow,
                tooltipTop: domRect.top - 50,
                tooltipLeft: domRect.left - 20,
            });
        } else if (param === 'usage') {
            this.setState({
                usageTooltipShow: !this.state.usageTooltipShow,
                tooltipTop: domRect.top - 50,
                tooltipLeft: domRect.left - 20,
            });
        }
    }

    displayUI = () => {
        let displayUI = [];

        let widthSize = window.outerWidth;

        //const { spacer, used } = this.state;

        const donutData = {
            series: [33, 33, 33],
            options: {
                chart: {
                    type: 'donut',
                },
                legend: {
                    position: 'right',
                    labels: {
                        colors: '#fff',
                        useSeriesColors: false,
                    }, /* 우측라벨 */
                    itemMargin: {
                        horizontal: 0,
                        vertical: 7
                    }, /* 라벨 간격 */
                    fontSize: '14',
                },
                /* responsive: [{
                    breakpoint: 480,
                }], */
                stroke: {
                    show: false,
                    curve: 'smooth',
                    lineCap: 'butt',
                    width: 1,
                    dashArray: 0,
                }, /* pie 테두리 */
                colors: [
                    "#2B65F0",
                    "#00B5F7",
                    "#B7E9FF",
                ], /* pie 색상 지정 */
                dataLabels: {
                    enabled: false,
                    formatter: function (val) {
                        return val + "%"
                    },
                },
                plotOptions: {
                    pie: {
                        size: 160,
                        /* customScale: 0.2, */
                        donut: {
                            /* size: '100%', */
                            labels: {
                                show: false,
                                total: {
                                    showAlways: true,
                                    show: true,
                                    label: '120',
                                    fontSize: '30px',
                                    color: '#fff',
                                    marginTop: '30px',
                                },
                                value: {
                                    fontSize: '16px',
                                    show: false,
                                    color: '#fff',
                                },
                            },
                        },
                        expandOnClick: false
                    },
                }, /* pie 동그라미 옵션 */
                labels: ["RACK", "SEVER", "ETC"],
                title: {

                },
            },
        } /* donutData */

        if (widthSize <= 1920) {
            displayUI.push(
                <>
                    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px', position: 'relative' }}>
                        <ApexChart
                            options={donutData.options}
                            series={donutData.series}
                            type="donut"
                            style={{ width: '500px', height: '150px', position: 'relative' }}
                        />
                        <div className={dash.positionUNumBox}>
                           <span className={dash.vdcUsageNum}>120</span>
                        </div>
                    </div>
                </>
            );

        } else if (widthSize >= 1921) {
            displayUI.push(
                <>
                    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px', position: 'relative' }}>
                        <ApexChart
                            options={donutData.options}
                            series={donutData.series}
                            type="donut"
                            style={{ width: '300px', height: '150px', position: 'relative' }}
                        />
                        <div className={dash.positionUNumBox}>
                          <span className={dash.vdcUsageNum}>120</span>
                        </div>
                    </div>
                </>
            );

        } else {
            displayUI.push(
                <></>
            );
        }

        return displayUI;
    }

    getUsageCenterName(centerName, centerNameConts, hidden) {
        if (centerName.length > 20) {
            centerNameConts = centerName;
            centerName = centerName.substring(0, 20) + "...";

            return (
                <td style={{ position: 'relative' }}>
                    <div className="tooltipUsageName">
                        <span className="tooltipUsageNameTitle"
                            onMouseEnter={(e) => this.handleTooltip('usage', e)}
                            onMouseLeave={() => this.setState({ usageTooltipShow: false })}>
                               {centerName}
                        </span>
                        <Tooltip
                            show={this.state.usageTooltipShow}
                            message={this.centerNameConts}
                            top={this.state.tooltipTop}
                            left={this.state.tooltipLeft}
                            className={"tooltipUsageNameConts tooltip-left"}
                        >
                            {centerNameConts}
                        </Tooltip>
                    </div>
                </td>
            );
        } else {
            return (
                <td>{centerName}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{centerName}</td>
            );
        }

        return (
            <td>{centerName}</td>
        );
    }

    getSideTitle() {
        let displayUI = [];
        const centerName = this.props.selectedCenter ? ProjectResource.getDataCenterName(this.props.selectedCenter) : "";

        if (this.state.statistics) {
            const statistics = { ...this.state.statistics };
            displayUI.push(
                <>
                  <span>
                    {/* {centerName} */}
                    {
                       this.getUsageCenterName(centerName, true)
                    }
                 </span>
                  <span>{"총 랙 수량 : " + (statistics.totalUsedUnitCount + statistics.totalRemainUnitCount) + "U / 사용량 : " + statistics.totalUsedUnitCount + "U"}</span>
                </>
            )
        }

        return displayUI;
    }

    getUsedRatio() {
        if (this.state.statistics) {
            const statistics = { ...this.state.statistics };
            return [statistics.totalUsedUnitCount, statistics.networkUnitCount, statistics.backupUnitCount, statistics.securityUnitCount, statistics.serverUnitCount, statistics.storageUnitCount, statistics.applianceUnitCount, statistics.sanSwitchUnitCount, statistics.etcUnitCount];
        }
        return [800, 100, 100, 100, 100, 100, 100, 100, 100];
    }

    render() {
        const [totalUsedUnitCount, networkUnitCount, backupUnitCount, securityUnitCount, serverUnitCount, storageUnitCount, applianceUnitCount, sanSwitchUnitCount, etcUnitCount] = this.getUsedRatio();
        const networkRatio = (networkUnitCount * 260 / totalUsedUnitCount).toFixed();
        const backupRatio = (backupUnitCount * 260 / totalUsedUnitCount).toFixed();
        const securityRatio = (securityUnitCount * 260 / totalUsedUnitCount).toFixed();
        const serverRatio = (serverUnitCount * 260 / totalUsedUnitCount).toFixed();
        const storageRatio = (storageUnitCount * 260 / totalUsedUnitCount).toFixed();
        const applianceRatio = (applianceUnitCount * 260 / totalUsedUnitCount).toFixed();
        const sanSwitchRatio = (sanSwitchUnitCount * 260 / totalUsedUnitCount).toFixed();
        const etcRatio = (etcUnitCount * 260 / totalUsedUnitCount).toFixed();

        return (
            <>
            <div id='tooltip-area'></div>
            <div className={dash.vdcUsage}>
                <span className={dash.vdcUsageTitle}>{ProjectResource.ID.dashboard.vdcUsage}</span>
                <div className={dash.vdcUsageSideTitle}>{this.getSideTitle()}</div>

                <div className={dash.vdcStickBox}>
                    {
                        networkRatio > 0 &&
                        <span className={dash.progressServer} style={{ width: networkRatio + '%' }}></span>
                    }
                    {
                        backupRatio > 0 &&
                        <span className={dash.progressSan} style={{ width: backupRatio + '%' }}></span>
                    }
                    {
                        securityRatio > 0 &&
                        <span className={dash.progressStorage1} style={{ width: securityRatio + '%' }}></span>
                    }
                    {
                        serverRatio > 0 &&
                        <span className={dash.progressStorage2} style={{ width: serverRatio + '%' }}></span>
                    }
                    {
                        storageRatio > 0 &&
                        <span className={dash.progressBackUp1} style={{ width: storageRatio + '%' }}></span>
                    }
                    {
                        applianceRatio > 0 &&
                        <span className={dash.progressBackUp2} style={{ width: applianceRatio + '%' }}></span>
                    }
                    {
                        sanSwitchRatio > 0 &&
                        <span className={dash.progressNetwork} style={{ width: sanSwitchRatio + '%' }}></span>
                    }
                    {
                        etcRatio > 0 &&
                        <span className={dash.progressRemain} style={{ width: etcRatio + '%' }}></span>
                    }
                </div> 

                <div className={dash.vdcUsageContents}>
                    <div style={{ display: 'flex' }}>
                        <div className={dash.serverBox}>
                            <span className={dash.serverSquare}></span>
                            <span className={dash.serverTitle}>네트워크</span>
                            <span className={dash.serverU}>{networkUnitCount + "U"}</span>
                        </div>
                        <div className={dash.sanBox}>
                            <span className={dash.sanSquare}></span>
                            <span className={dash.sanTitle}>백업</span>
                            <span className={dash.sanU}>{backupUnitCount + "U"}</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <div className={dash.storageBox1}>
                            <span className={dash.storageSquare1}></span>
                            <span className={dash.storageTitle1}>보안</span>
                            <span className={dash.storageU1}>{securityUnitCount + "U"}</span>
                        </div>
                        <div className={dash.storageBox2}>
                            <span className={dash.storageSquare2}></span>
                            <span className={dash.storageTitle2}>서버</span>
                            <span className={dash.storageU2}>{serverUnitCount + "U"}</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <div className={dash.backUpBox1}>
                            <span className={dash.backUpSquare1}></span>
                            <span className={dash.backUpTitle1}>스토리지</span>
                            <span className={dash.backUpU1}>{storageUnitCount + "U"}</span>
                        </div>
                        <div className={dash.backUpBox2}>
                            <span className={dash.backUpSquare2}></span>
                            <span className={dash.backUpTitle2}>어플라이언스</span>
                            <span className={dash.backUpU2}>{applianceUnitCount + "U"}</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <div className={dash.networkBox}>
                            <span className={dash.networkSquare}></span>
                            <span className={dash.networkTitle}>SAN 스위치</span>
                            <span className={dash.networkU}>{sanSwitchUnitCount + "U"}</span>
                        </div>
                        <div className={dash.remainingBox}>
                            <span className={dash.remainingSquare}></span>
                            <span className={dash.remainingTitle}>기타</span>
                            <span className={dash.remainingU}>{etcUnitCount + "U"}</span>
                        </div>
                    </div>
                </div>
            </div>
            </>
        );
    }
}

export default VDCUsage;