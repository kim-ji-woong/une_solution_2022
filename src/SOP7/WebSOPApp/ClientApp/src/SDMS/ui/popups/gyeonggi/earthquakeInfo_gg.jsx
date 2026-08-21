import React, { Component } from 'react';
import $ from 'jquery';
import { EarthquakeInfoGGComponent } from '../../../styled/sdmsPopupsStyled';
import { EarthPopComponent } from '../../../styled/sdmsPopupsStyled';
import SDMS from '../../sdms';
import PopupDraggable from '../popupDraggable';
import SdmsResource from '../../../resource/id';
import { Line } from 'react-chartjs-2';
import { GghController } from '../../../services/gghController';
import store from '../../../../Root/store';
import { isEqual } from 'lodash';
import SettingsStore from '../../../../Settings/settingsStore';


class EarthquakeInfo_gg extends Component{
    constructor(props) {
        super(props);
        this.state = {
            labels: [],
            galDatas: [],
            intensityDatas: [],
            intensityChartDatas: [],

            earthquakeHistories: [],
            
            tooltip:{
                tooltipShow: false,
                tooltipTop: 0,
                tooltipLeft: 0
            },
            earthChartPage : 0,  //지진 현재페이지
        }

        this.currentHour = 0;

        this.initPopupState = this.initPopupState.bind(this);
    }

    componentDidMount() {

        this.initEarthChartPage();

        GghController.StartWatchTimerLastEarthquake();

        this.unsubscribeSettingsStore = SettingsStore.subscribe(() => {
            this.resetPopupState(SettingsStore.getState());
        });

        this.unsubscribeStore = store.subscribe(() => {
            this.setEarthquakeDatas(store.getState().earthquake);
        });


        let cssLeft = null;
        let cssTop = null;
        let cssWidth = null;
        let cssHeight = null;

        const popup = document.getElementById(this.props.popupType);
        const target = document.getElementById("dsBot_" + this.props.popupType);
        const popupState = this.props.popupState;

        if (popup !== null && popup !== undefined &&
            target !== null && target !== undefined &&
            popupState !== null && popupState !== undefined) {
            const clientRect = target.getBoundingClientRect();
            cssLeft = clientRect.left + "px";
            cssTop = clientRect.top + "px";

            popup.style.width = 0;
            popup.style.height = 0;
            popup.style.left = cssLeft;
            popup.style.top = cssTop;

            cssLeft = popupState.x;
            cssTop = popupState.y;
            cssWidth = popupState.width;
            cssHeight = popupState.height;

            $('#' + this.props.popupType).animate({ opacity: 1, width: cssWidth, height: cssHeight, left: cssLeft, top: cssTop }, SdmsResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }
        else {
            $('#' + this.props.popupType).animate({ opacity: 1 }, SdmsResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }
    }

    componentWillUnmount() {
        if (this.unsubscribeSettingsStore) {
            this.unsubscribeSettingsStore();
        }
        
        if (this.unsubscribeStore) {
            this.unsubscribeStore();
        }

        GghController.stopWatchTimerLastEarthquake();
    }

    repositionPopup(popupState) {
        let data = popupState.AccessControlGG;

        if (data === null || data === undefined)
            return;

        let popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return;

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
    }

    resetPopupState = (popupState) => {
        let data = popupState;

        if (data.actionType === 'RESET_POPUP') {
            this.repositionPopup(data.popupState);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            var popup = document.getElementsByClassName('viewDashboardBoxD EarthquakeInfo')[0];
            popup.style.zIndex = this.props.zIndex;
            console.log('EarthquakeInfoGGZIndex changed', popup.style.zIndex);
        }
    }

    handleTooltip = (e) => {
		const domRect = e.target.getBoundingClientRect();

		this.setState({
            tooltip: {
                tooltipShow: !this.state.tooltipShow,
                tooltipTop: domRect.top - 24,
                tooltipLeft: domRect.left - 30,
            }
        });
	}

    initPopupState() {
        var popup = document.getElementsByClassName('viewDashboardBoxD EarthquakeInfo')[0];

        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        }

        this.setState({ popup: popup });
    }

    loadChartData = async () => {
        const { labels, galDatas, intensityDatas, intensityChartDatas } = await this.getChartDatas();
        this.setState({ labels, galDatas, intensityDatas, intensityChartDatas });
    };

    initEarthChartPage = () => {
        const now = new Date();
        const hours = now.getHours();

        let hour = 0;
        if (hours >= 0 && hours < 6) hour = 1;
        if (hours >= 6 && hours < 12) hour = 2;
        if (hours >= 12 && hours < 18) hour = 3;
        if (hours >= 18 && hours < 24) hour = 4;

        if (hour > 0) {
            this.setState({ earthChartPage: hour }, () => {
                this.currentHour = hour;
                this.loadChartData();
            });
        }
    }

    setEarthquakeDatas = (data) => {
        const currentLastData = this.state.earthquakeHistories.find((x) => x.timeStamp === data.timeStamp);

        if (currentLastData && data) {
            let compare = isEqual(data, currentLastData);

            if (!compare) {
                this.loadChartData();
            }
        }
    }

    getChartDatas = async () => {
        const quaterNo = this.state.earthChartPage;
        let labels = [];
        let galDatas = [];
        let intensityDatas = [];
        let intensityChartDatas = [];

        if (quaterNo > 0) {
            const [earthquakeHistories, message] = await GghController.requestEarthquakeHistory(quaterNo);

            if (message.length > 0) {
                this.props.showConfirmDialog('오류', [message], null, null);
            }
            else if (earthquakeHistories && earthquakeHistories.length > 0) {
                for (let data of earthquakeHistories) {
                    // 시, 분, 초 문자열만 추출
                    let time = data.timeStamp.replace(/^.*T(\d{2}:\d{2}:\d{2}).*$/, '$1');
                    labels.push(time);

                    galDatas.push(data.gal);
                    intensityDatas.push(data.intensity);

                    const intensityChartData = this.getIntensityFromGal(data.gal);
                    intensityChartDatas.push(intensityChartData);
                }
            }

            this.setState({ earthChartPage: quaterNo, earthquakeHistories });
        }
        else {
            this.props.showConfirmDialog('오류', ['데이터를 불러오지 못했습니다.'], null, null);
        }

        return { labels, galDatas, intensityDatas, intensityChartDatas };
    }

    getIntensityFromGal = (gal) => {
        if (!gal) return null;

        let intensity = null;

        if (0 < gal && gal < 0.68) {
            intensity = 1 + (gal / 0.68) * 0.9;
        } else if (0.68 <= gal && gal < 2.25) {
            intensity = 2 + ((gal - 0.68) / (2.25 - 0.68)) * 0.9;
        } else if (2.25 <= gal && gal < 7.45) {
            intensity = 3 + ((gal - 2.25) / (7.45 - 2.25)) * 0.9;
        } else if (7.45 <= gal && gal < 25.11) {
            intensity = 4 + ((gal - 7.45) / (25.11 - 7.45)) * 0.9;
        } else if (25.11 <= gal && gal < 67.29) {
            intensity = 5 + ((gal - 25.11) / (67.29 - 25.11)) * 0.9;
        } else if (67.29 <= gal && gal < 144.50) {
            intensity = 6 + ((gal - 67.29) / (144.50 - 67.29)) * 0.9;
        } else if (144.50 <= gal && gal < 310.58) {
            intensity = 7 + ((gal - 144.50) / (310.58 - 144.50)) * 0.9;
        } else if (310.58 <= gal && gal < 667.17) {
            intensity = 8 + ((gal - 310.58) / (667.17 - 310.58)) * 0.9;
        } else if (667.17 <= gal && gal < 1433.63) {
            intensity = 9 + ((gal - 667.17) / (1433.63 - 667.17)) * 0.9;
        } else if (1433.63 <= gal && gal < 3080.34) {
            intensity = 10 + ((gal - 1433.63) / (3080.34 - 1433.63)) * 0.9;
        } else if (3080.34 <= gal) {
            intensity = 11;
        }

        return Number(intensity.toFixed(1));
    }

    onClickPrePage(earthChartPage){
        if(earthChartPage !== 1){
            this.setState({ earthChartPage: this.state.earthChartPage - 1 }, () => {
                this.loadChartData();
            });
        }
    }

    onClickNextPage(earthChartPage){
        if(earthChartPage !== 4){
            this.setState({ earthChartPage: this.state.earthChartPage + 1 }, () => {
                this.loadChartData();
            });
        }
    }

    render(){
        const { earthChartPage, labels, galDatas, intensityDatas, intensityChartDatas } = this.state;

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            type: 'line',
            tooltips: {
                enabled: true,
                position: 'nearest',
                backgroundColor: '#0E162D',
                borderColor: '#FFFFFF4D',
                bodyFontSize: 12,
                bodyFontFamily: "Pretendard",
                displayColors: false,
                cornerRadius: 1,
                padding: 20,
                callbacks: {
                    title: function() {
                        return null; // labels hide
                    },
                    label: (context, data) => {
                        let intensity = data.datasets[1].data[context.index];
                        let gal = data.datasets[2].data[context.index];

                        return `[${context.label}] gal : ${gal.toLocaleString()} / 진도 : ${intensity}`;
                    }
                }
            },
            plugins: {
                title: {
                    text: 'Chart.js Line Chart',
                },
            },
            legend: {
                display: false,
            },
            labels: {
                fontColor: "rgb(255,255,255)",
            },
            position: "left",
            scales: {
                x: {
                    display: false,
                    type: 'time',
                    beginAtZero: true,
                    grid: {
                        display: true,
                    },
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        display: true,
                    },
                    gridLines: {
                        color: "#6D7382",
                    },
                },
                xAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true,
                        autoSkip: false,                  // 자동으로 숫자 건너뛰기
                        precision: 0,
                        fontSize: 12,
                        fontColor: "#fff",
                        borderColor: "#fff",
                        fontFamily: "Pretendard",
                        tickBorderDash: "1",
                        stepSize: 1,
                        maxRotation: 0,
                        callback: (value) => {
                            // 정각을 제외한 나머지 시간 label 숨김
                            if (value && value.endsWith('00:00')) {
                                const hour = value.slice(0, -6) + 'H';
                                return hour;
                            } else {
                                return '';
                            }
                        }
                    },
                    gridLines: {
                        color: "rgb(57,72,81)",         // 눈금 라인 컬러
                        lineWidth: 1,                     // 눈금 라인 두께
                        drawBorder: false,
                        borderDash: [3, 2],
                    },
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 1,                   // 수치 최소값
                        max: 11,                  // 수치 최대값
                        stepSize: 1,
                        fontSize: 12,
                        fontColor: "#fff",
                        fontFamily: "Pretendard",
                        callback: (value) => {
                            return value.toLocaleString(); // 천단위 쉼표 구분
                        }
                    },
                    gridLines: {
                        color: "#525868",
                    },
                }],
            },
        };

        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'intensityChartDatas',
                    data: intensityChartDatas,
                    borderColor: '#fff',
                    backgroundColor: false,
                    borderWidth: 1,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 1,
                    pointRadius: 1,
                    fontFamily: 'Pretendard',
                    fontSize: '11px',
                    fill: false,
                    tension: 0
                },
                {
                    label: 'intensity',
                    data: intensityDatas,
                    hidden: true
                },
                {
                    label: 'gal',
                    data: galDatas,
                    hidden: true
                },
            ],
        };

        return(
            <EarthquakeInfoGGComponent id={this.props.popupType} className={'viewDashboardBoxD earthquakeInfo'}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={1207}
                    popupMinHeight={291}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                    usePopupResize={false}
                >
                <div className={'dslTop dslGrd'}>
                    <h5 className={'dslTitle'}>
                        지진 계측 정보
                    </h5>
                    <a className={'dslX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.earthquakeInfo, false)}></a>
                </div>
                <div className={'dslContEarthquake'}>
                    <div className={'dslEarthquakeFlex'}>
                        <div className={'earthPageBox'}>
                            <span className={earthChartPage === 1 ? 'chartArrowLeftDisable' : 'chartArrowLeftActive'} onClick={() => this.onClickPrePage(earthChartPage)}></span>
                            <span className={'numBox'}>{earthChartPage}/4</span>
                            <span className={earthChartPage === 4 || earthChartPage === this.currentHour ? 'chartArrowRightDisable' : 'chartArrowRightActive'} onClick={() => this.onClickNextPage(earthChartPage)}></span>
                        </div>
                        <div className={'earthTooltipIcon'}
                            style={{ position: 'relative !important' }}
                            onMouseEnter={(e) => this.handleTooltip(e)}
                            onMouseLeave={() => this.setState({ tooltip: {tooltipShow: false} })}   
                        >
                        {
                            this.state.tooltip.tooltipShow &&
                            <EarthPopComponent>
                                <div className={'earthPopTitleFlex'}>
                                    <span>* 진도 등급</span>
                                    <div><span className={'interestBox'}></span>관심</div>
                                    <div><span className={'cautionBox'}></span>주의</div>
                                    <div><span className={'boundaryBox'}></span>경계</div>
                                    <div><span className={'seriousBox'}></span>심각</div>
                                </div>
                                <div className={'earthPopTable'}>
                                    <table className={'earthTable'}>
                                        <colgroup>
                                            <col style={{ width: "20%" }} />
                                            <col style={{ width: "*" }} />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <td>진도</td>
                                                <td>최대지반가속도</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>gal ＜ 0.68</td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>0.68 ≤ gal ＜ 2.25</td>
                                            </tr>
                                            <tr>
                                                <td>3</td>
                                                <td>2.25 ≤ gal ＜ 7.45</td>
                                            </tr>
                                            <tr>
                                                <td>4</td>
                                                <td>7.45 ≤ gal ＜ 25.11</td>
                                            </tr>
                                            <tr>
                                                <td>5</td>
                                                <td>25.11 ≤ gal ＜ 67.29</td>
                                            </tr>
                                            <tr>
                                                <td>6</td>
                                                <td>67.29 ≤ gal ＜ 144.50</td>
                                            </tr>
                                            <tr>
                                                <td>7</td>
                                                <td>144.50 ≤ gal ＜ 310.58</td>
                                            </tr>
                                            <tr>
                                                <td>8</td>
                                                <td>310.58 ≤ gal ＜ 677.17</td>
                                            </tr>
                                            <tr>
                                                <td>9</td>
                                                <td>677.17 ≤ gal ＜ 1,433.63</td>
                                            </tr>
                                            <tr>
                                                <td>10</td>
                                                <td>1,433.63 ≤ gal ＜ 3,080.34</td>
                                            </tr>
                                            <tr>
                                                <td>11</td>
                                                <td rowSpan='2'>3,080.34 ≤ gal</td>
                                            </tr>
                                            <tr>
                                                <td>12</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </EarthPopComponent>
                        }
                        </div>
                    </div>
                    <span className='rangeName'>진도</span>
                    <div style={{ position: 'absolute', width: 'calc(100% - 40px)', height: 'calc(100% - 70px)' }}>
                        <Line options={options} data={data} />
                    </div>
                </div>
                </PopupDraggable>
            </EarthquakeInfoGGComponent>
        );
    }
}

export default EarthquakeInfo_gg;