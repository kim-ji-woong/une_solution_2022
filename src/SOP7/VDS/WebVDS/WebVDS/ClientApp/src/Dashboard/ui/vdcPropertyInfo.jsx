import React, { Component } from 'react';

import dash from '../../Dashboard/css/dash.module.css';

import ReactApexChart from 'react-apexcharts'
import $ from 'jquery';
import ProjectResource from '../../Root/resource/id';

import Tooltip from '../../Main/ui/tooltip';

class VDCPropertyInfo extends Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            disUI: this.displayUI(),
            propertyTooltipShow: false,
            tooltipTop: 0,
            tooltipLeft: 0,
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

    handleTooltip = (param, e) => {
        const domRect = e.target.getBoundingClientRect();

        if (param === 'center') {
            this.setState({
                centerTooltipShow: !this.state.centerTooltipShow,
                tooltipTop: domRect.top - 50,
                tooltipLeft: domRect.left - 20,
            });
        } else if (param === 'property') {
            this.setState({
                propertyTooltipShow: !this.state.propertyTooltipShow,
                tooltipTop: domRect.top - 50,
                tooltipLeft: domRect.left - 20,
            });
        }
    }

    displayUI = () => {
        let displayUI = [];

        let widthSize = window.outerWidth;

        const stickData = {
            series: [{
                data: [21, 22, 10],
                position: 'top',
            }],
            options: {
                chart: {
                    height: 240,
                    type: 'bar',
                    events: {
                        click: function (chart, w, e) {

                        }
                    },
                    toolbar: {
                        show: false,
                        tools: {
                            download: false
                        }
                    }, /* 오른쪽 상단 메뉴바  */
                },
                /* colors: colors, */
                plotOptions: {
                    bar: {
                        columnWidth: '20%',
                        distributed: true, /* bar 색상 자동지정 */
                    }
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return val + "%";
                    },
                    offsetY: -20,
                    style: {
                        fontSize: '14px',
                        colors: ["#fff"]
                    }

                },
                legend: {
                    show: false /* 하단 legend */
                },
                xaxis: {
                    categories: [
                        ['RACK'],
                        ['SEVER'],
                        ['ETC'],
                    ],
                    labels: {
                        style: {
                            colors: '#fff',
                            fontSize: '14px'
                        }
                    }
                },
                yaxis: {
                    axisBorder: {
                        show: false,
                    },
                    axisTicks: {
                        show: false,
                    },
                    labels: {
                        show: false,
                        formatter: function (val) {
                            return val + "%";
                        },
                    }

                },
                grid: {
                    borderColor: '#d7d7d738',
                    strokeDashArray: 3,
                    padding: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    },
                },
                colors: [ /* bar 색상 지정 */
                    "#2B65F0",
                    "#00B5F7",
                    "#B7E9FF",
                ]
            },
        }

        if (widthSize <= 1920) {
            displayUI.push(
                <>
                    <div id="chart">
                        <ReactApexChart options={stickData.options} series={stickData.series} type="bar" height={240} />
                    </div>
                    <div className={dash.propertyNumBox}>
                        <span className={dash.rackBox}>
                            <span style={{ display: 'flex', marginBottom: '16px', justifyContent: 'center' }}><span className={dash.rackSquare}></span><p>RACK</p></span>
                            <span className={dash.rackNum}>12</span>
                        </span>
                        <span className={dash.severBox}>
                            <span style={{ display: 'flex', marginBottom: '16px', justifyContent: 'center' }}><span className={dash.severSquare}></span><p>SEVER</p></span>
                            <span className={dash.severNum}>100</span>
                        </span>
                        <span className={dash.etcBox}>
                            <span style={{ display: 'flex', marginBottom: '16px', justifyContent: 'center' }}><span className={dash.etcSquare}></span><p>ETC</p></span>
                            <span className={dash.etcNum}>08</span>
                        </span>
                    </div>
                </>
            );

        } else if (widthSize >= 1921) {
            displayUI.push(
                <>
                    <div id="chart">
                        <ReactApexChart options={stickData.options} series={stickData.series} type="bar" height={430} style={{ marginTop: '30px' }} />
                    </div>
                    <div className={dash.propertyNumBox}>
                        <span className={dash.rackBox}>
                            <span style={{ display: 'flex', marginBottom: '16px', justifyContent: 'center' }}><span className={dash.rackSquare}></span><p>RACK</p></span>
                            <span className={dash.rackNum}>12</span>
                        </span>
                        <span className={dash.severBox}>
                            <span style={{ display: 'flex', marginBottom: '16px', justifyContent: 'center' }}><span className={dash.severSquare}></span><p>SEVER</p></span>
                            <span className={dash.severNum}>100</span>
                        </span>
                        <span className={dash.etcBox}>
                            <span style={{ display: 'flex', marginBottom: '16px', justifyContent: 'center' }}><span className={dash.etcSquare}></span><p>ETC</p></span>
                            <span className={dash.etcNum}>08</span>
                        </span>
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

    getPropertyCenterName(centerName, centerNameConts, hidden) {
        if (centerName.length > 22) {
            centerNameConts = centerName;
            centerName = centerName.substring(0, 22) + "...";

            return (
                <td style={{ position: 'relative' }}>
                    <div className="tooltipPropertyName">
                        <span className="tooltipPropertyNameTitle"
                            onMouseEnter={(e) => this.handleTooltip('property', e)}
                            onMouseLeave={() => this.setState({ propertyTooltipShow: false })}>
                            {centerName}
                        </span>
                        <Tooltip
                            show={this.state.propertyTooltipShow}
                            message={this.centerNameConts}
                            top={this.state.tooltipTop}
                            left={this.state.tooltipLeft}
                            className={"tooltipPropertyNameConts tooltip-left"}
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

        if (this.props.statistics) {
            const statistics = { ...this.props.statistics };
            
            displayUI.push(
                <>
                <span>
                    {/* {centerName} */}
                    {
                      this.getPropertyCenterName(centerName, true)
                    }
                </span>
                  <span>{"총 랙 수량 : " + (statistics.totalUsedUnitCount + statistics.totalRemainUnitCount) + "U / 잔여량 : " + statistics.totalRemainUnitCount + "U"}</span>
                </>
            )
        }

        return displayUI;
    }

    getStickContents() {
        const elements = [];

        if (this.props.statistics) {
            const statistics = { ...this.props.statistics };

            for (const remain of statistics.remainUnits) {
                const ratioValue = (remain.unitSize * remain.count * 100 / statistics.totalRemainUnitCount).toFixed();

                elements.push(
                    <div className={dash.vdcUBox}>
                        <span className={dash.rackUTitle}>{remain.unitSize + "U"}</span>
                        <span className={dash.rackUStickBox}>
                            <progress className={dash.progressU3} value={ratioValue} min="0" max="100"></progress>
                        </span>
                        <span className={dash.rackUNum}>{remain.count}</span>
                    </div>
                );
            }
        }

        return elements;
    }

    render() {
        return (
            <div className={dash.vdcPropertyInfo}>
                <span className={dash.propertyTitle}>랙별 사용 및 유휴공간 분석</span>
                <div className={dash.vdcUsageSideTitle}>{this.getSideTitle()}</div>

                <div className={dash.vdcUStickContents + " " + dash.vdcUStickScrollbar}>
                    {
                        this.getStickContents()
                    }
                </div>
            </div>
        );
    }
}

export default VDCPropertyInfo;