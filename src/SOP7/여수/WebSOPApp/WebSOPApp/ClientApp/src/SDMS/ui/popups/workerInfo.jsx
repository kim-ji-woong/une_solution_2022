import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';
import content from '../../../Common/css/content.module.css';
import SettingsStore from '../../../Settings/settingsStore';
import SDMS from '../sdms';
import SDMSResource from '../../resource/id';
import PopupDraggable from './popupDraggable';

//import Chart from "react-google-charts";
import { Bar } from 'react-chartjs-2'
import $ from 'jquery';


class WorkerInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popupMinWidth: 600,
            popupMinHeight: 400,
        }

       //this.initPopupState = this.initPopupState.bind(this);

        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));

        if (SDMS.UseWalkingAvatar) {
            this.refPosX = React.createRef();
            this.refPosY = React.createRef();
            this.refPosZ = React.createRef();
            this.refScaleX = React.createRef();
            this.refScaleY = React.createRef();
            this.refScaleZ = React.createRef();
        }
    }


    componentDidMount() {
        const doughnut = document.getElementById('doughnut');
        const Bar = document.getElementById('bar');

        // 창이 서서히 나타나는 효과
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

            $('#' + this.props.popupType).animate({ opacity: 1, width: cssWidth, height: cssHeight, left: cssLeft, top: cssTop }, SDMSResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }
        else {
            $('#' + this.props.popupType).animate({ opacity: 1 }, SDMSResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }

        //this.initPopupState();
    }


    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
        }
    }

    /* initPopupState() {
        var popup = document.getElementsByClassName(content.viewDashboardBoxD + ' ' + content.viewDashboardWorkerInfo)[0];

        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        }

        this.setState({ popup: popup });
    } */


    repositionPopup(popupState) {
        let data = popupState.workerInfo;

        if (data === null || data === undefined)
            return;

        //let popup = document.getElementsByClassName(content.viewDashboardBoxD + ' ' + content.viewDashboardWorkerInfo)[0];
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

    getDountData() {
        let dountChartUI = [];

        const DATA_COUNT = 5;
        const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 };
        const data = {
            /* labels: [
                'Red',
                'Blue',
                'Yellow'
            ], */
            datasets: [{
                type: 'doughnut',
                data: [300, 50, 100],
                backgroundColor: [
                    'rgb(27, 190, 96)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                ],
                hoverOffset: 4,
                borderColor: "#122229",
                /* border: 'none', */
                width: '100%',
                height: '100%',
            }]
        };

        const dountOption = {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Chart.js Doughnut Chart'
                    }
                }
            },
        };

        dountChartUI.push(<Doughnut key={'doughnut'} id='doughnut' data={data} option={dountOption}  />)
        return [dountChartUI];
    }


    getBarData() {
        let barChartUI = [];

        const barOptions = {
            /* legend: {
                display: false, // label 보이기 여부
            },*/
            responsive: true,
            borderRadius: 10,
            barThickness: 55,
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0, // y축 스케일에 대한 최소값 설정
                        stepSize: 1, // y축 그리드 한 칸당 수치
                        barRadius: 10, 
                    }
                }]
            },

            // false : 사용자 정의 크기에 따라 그래프 크기가 결정됨.
            // true : 크기가 알아서 결정됨.
            maintainAspectRatio: false
        }
        const data = {
            labels: ['일반', '화기', '전기', '중장비', '굴착', '고소'],
            datasets: [
                {
                    borderWidth: 1, // 테두리 두께
                    data: [1, 2, 3, 4, 5, 6], // 수치
                    backgroundColor: ['#f6be00', '#1bbe60', '#1bbe60', '#1bbe60', '#1bbe60', '#1bbe60'],
                    borderRadius: 10,
                }
            ]
        };

        barChartUI.push(<Bar data={data} option={barOptions} height={300} />)
        return [barChartUI];
    }


    render() {

        const [dountChartUI] = this.getDountData();
        const [barChartUI] = this.getBarData();

        return(
            <div id={this.props.popupType} className={content.viewDashboardBoxD + ' ' + content.viewDashboardWorkerInfo + " " + SDMSResource.UISection}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={350}
                    popupMinHeight={260}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >

                <div className={content.dslTop + " " + content.dslGrd}>
                    <h5 className={content.dslTitle}>
                        작업자현황
                    </h5>
                    <a className={content.dslX} onClick={() => this.props.setVisiblePopups(SDMS.menu.workerInfo, false)}></a>
                </div>

                <div className={content.workerContents}>
                    <div className={content.workerTitle}>
                        <span className={content.wFact}>공장동</span>
                        <span className={content.fWorker}>전일 작업자</span>
                        <span className={content.sWorker}>당일 작업자</span>
                        <span className={content.oType}>작업 종류</span>
                    </div>
                    <div className={content.workerConts}>
                        <div className={content.wFactoryBox}>
                            <p className={content.wFactoryBold}>2공장동</p>
                            <p>(T2)</p>
                        </div>
                        <div className={content.fullWorkerBox}>
                            <span className={content.fullWorkerNum}>50</span>
                            <span className={content.numberBox}><span className={content.wUpIcon}></span>9</span>
                        </div>
                        <div className={content.sameWorkerBox}>
                            <span className={content.circleGraph} style={{ position: "relative", width: "8vw", height: "8vh" }}>
                                {dountChartUI}
                            </span>
                            <span className={content.circlePercent}>50%</span>
                            <span className={content.sWorkerBox}>
                                <span className={content.sWorker}>
                                  <span className={content.wPeopleIcon}></span>
                                  <p><p className={content.wGreenText}>25</p>/50</p>
                                </span>
                            </span>
                        </div>
                        <div className={content.operTypeBox}>
                            {/* <span className={content.operGraph} style={{ width: "100%", height: "100%" }}>
                                {barChartUI}
                            </span> */}
                            <span className={content.operGraphBox}>
                                <span className={content.wGeneralBar}><p className={content.wGeneralNum}>10</p></span>
                                <span className={content.wFirearmsBar}><p className={content.wFirearmsNum}>2</p></span>
                                <span className={content.wElectricityBar}><p className={content.wElectNum}>2</p></span>
                                <span className={content.wHeavyEquipmentBar}><p className={content.wHeavyEquipmentNum}>8</p></span>
                                <span className={content.wExcavationBar}><p className={content.wExcavationNum}>3</p></span>
                                <span className={content.wAccusationBar}><p className={content.wAccusationNum}>5</p></span>
                            </span>
                            <span className={content.iconBox}>
                                <span className={content.wGeneralIcon}></span>
                                <span className={content.wFirearmsIcon}></span>
                                <span className={content.wElectricityIcon}></span>
                                <span className={content.wHeavyEquipmentIcon}></span>
                                <span className={content.wExcavationIcon}></span>
                                <span className={content.wAccusationIcon}></span>
                            </span>
                        </div>
                    </div>
                    <div className={content.workerConts}>
                        <div className={content.wFactoryBox}>
                            <p className={content.wFactoryBold}>2공장동</p>
                            <p>(T2)</p>
                        </div>
                        <div className={content.fullWorkerBox}>
                            <span className={content.fullWorkerNum}>50</span>
                            <span className={content.numberBox}><span className={content.wUpIcon}></span>9</span>
                        </div>
                        <div className={content.sameWorkerBox}>
                            <span className={content.circleGraph} style={{ width: "90px", height: "100%" }}>
                                {dountChartUI}
                            </span>
                            <span className={content.circlePercent}>50%</span>
                            <span className={content.sameWorker}><span className={content.wPeopleIcon}></span><span className={content.wGreenText}>25</span>/50</span>
                        </div>
                        <div className={content.operTypeBox}>
                            {/* <span className={content.operGraph} style={{ width: "100%", height: "100%" }}>
                                {barChartUI}
                            </span> */}
                            <span className={content.operGraphBox}>
                                <span className={content.wGeneralBar}><p className={content.wGeneralNum}>10</p></span>
                                <span className={content.wFirearmsBar}><p className={content.wFirearmsNum}>2</p></span>
                                <span className={content.wElectricityBar}><p className={content.wElectNum}>2</p></span>
                                <span className={content.wHeavyEquipmentBar}><p className={content.wHeavyEquipmentNum}>8</p></span>
                                <span className={content.wExcavationBar}><p className={content.wExcavationNum}>3</p></span>
                                <span className={content.wAccusationBar}><p className={content.wAccusationNum}>5</p></span>
                            </span>
                            <span className={content.iconBox}>
                                <span className={content.wGeneralIcon}></span>
                                <span className={content.wFirearmsIcon}></span>
                                <span className={content.wElectricityIcon}></span>
                                <span className={content.wHeavyEquipmentIcon}></span>
                                <span className={content.wExcavationIcon}></span>
                                <span className={content.wAccusationIcon}></span>
                            </span>
                        </div>
                    </div>

                    {/* <div className={content.viewScroll}>
                        <ul className={content.viewListDo}>
                            <li className={content.posiRelative}>
                                <div className={content.switchBtn}>
                                    <label className={content.switch}>
                                        <input type="checkbox" />
                                        <span className={content.slider + ' ' + content.round}></span>
                                    </label>
                                </div>
                                <div className={content.viewListHeadWrap}><span className={content.viewListHead}>화재센서</span></div>
                            </li>
                            <li className={content.posiRelative}>
                                <div className={content.switchBtn}>
                                    <label className={content.switch}>
                                        <input type="checkbox"  />
                                        <span className={content.slider + ' ' + content.round}></span>
                                    </label>
                                </div>
                                <div className={content.viewListHeadWrap}><span className={content.viewListHead}>CCTV</span></div>
                            </li>
                        </ul>
                    </div> */}
                    </div>
                </PopupDraggable>
            </div>
        );
    }
}
export default WorkerInfo;