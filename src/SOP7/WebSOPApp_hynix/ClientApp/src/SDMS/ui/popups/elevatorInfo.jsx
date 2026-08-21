import React, { Component } from 'react';
import $ from 'jquery';

import { ElevatorInfoComponent, ElevatorElementComponent } from '../../styled/sdmsPopupsStyled';
import SDMS from '../sdms';
import PopupDraggable from './popupDraggable';
import SdmsResource from '../../resource/id';
import { i18n } from '../../../language/i18n';
import SettingsStore from '../../../Settings/settingsStore';
import store from '../../../Root/store';

import up from '../../img/popup/elevatorInfo_up.png';
import up_run from '../../img/popup/elevatorInfo_up_run.png';
import down from '../../img/popup/elevatorInfo_down.png';
import down_run from '../../img/popup/elevatorInfo_down_run.png';
import ProjectResource from '../../../Root/resource/id';
import { SDMSController } from '../../services/sdmsController';
import Loader from '../../../Settings/ui/popups/loader';

class ElevatorInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            elevatorDatas: [],
        }

        this.initPopupState = this.initPopupState.bind(this);
    }

    componentDidMount() {
        this.unsubscribeSettingsStore = SettingsStore.subscribe(() => {
            this.resetPopupState(SettingsStore.getState());
        });
    
        this.unsubscribeStore = store.subscribe(() => {
            let data = store.getState();
            if (data.elevatorDatas) {
                this.setElevatorsData(data.elevatorDatas);
            }
        });

        SDMSController.StartWatchTimerElevator(this.props.selectSiteID);

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
        
        SDMSController.stopWatchTimer();
    }

    repositionPopup(popupState) {
        let data = popupState.elevatorInfo;

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
            var popup = document.getElementsByClassName('viewDashboardBoxD viewElevator')[0];
            popup.style.zIndex = this.props.zIndex;
            console.log('elevatorInfoZIndex changed', popup.style.zIndex);
        }
    }

    initPopupState() {
        var popup = document.getElementsByClassName('viewDashboardBoxD viewElevator')[0];

        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        }

        this.setState({ popup: popup });
    }

    setElevatorsData = (data) => {
        this.setState({ elevatorDatas: data });
    }

    setElevatorsUI = () => {
        const { elevatorDatas } = this.state;
        const { selectSiteID } = this.props;

        let ui = [];

        if (elevatorDatas.length > 0) {
            if (selectSiteID === ProjectResource.Site.GG_B && elevatorDatas.length < 23 && elevatorDatas.length > 9) {
                let mainOfficeUI = [];
                let councilUI = [];

                mainOfficeUI.push(
                    <ul key='mainOffice'>
                        <li>
                            <div className='elementWrap'>
                                <ElevatorElement
                                    index={0}
                                    name={elevatorDatas[0].name}
                                    upDown={elevatorDatas[0].up}
                                    floor={elevatorDatas[0].floorIndex}
                                    status={elevatorDatas[0].isOpened}
                                    elevatorType={elevatorDatas[0].isNormal ? 'normal' : 'emergency'}
                                />
                                <ElevatorElement
                                    index={1}
                                    name={elevatorDatas[1].name}
                                    upDown={elevatorDatas[1].up}
                                    floor={elevatorDatas[1].floorIndex}
                                    status={elevatorDatas[1].isOpened}
                                    elevatorType={elevatorDatas[1].isNormal ? 'normal' : 'emergency'}
                                />
                                <ElevatorElement
                                    index={2}
                                    name={elevatorDatas[2].name}
                                    upDown={elevatorDatas[2].up}
                                    floor={elevatorDatas[2].floorIndex}
                                    status={elevatorDatas[2].isOpened}
                                    elevatorType={elevatorDatas[2].isNormal ? 'normal' : 'emergency'}
                                />
                            </div>
                            <div className='elementWrap'>
                                <ElevatorElement
                                    index={3}
                                    name={elevatorDatas[3].name}
                                    upDown={elevatorDatas[3].up}
                                    floor={elevatorDatas[3].floorIndex}
                                    status={elevatorDatas[3].isOpened}
                                    elevatorType={elevatorDatas[3].isNormal ? 'normal' : 'emergency'}
                                />
                                <ElevatorElement
                                    index={4}
                                    name={elevatorDatas[4].name}
                                    upDown={elevatorDatas[4].up}
                                    floor={elevatorDatas[4].floorIndex}
                                    status={elevatorDatas[4].isOpened}
                                    elevatorType={elevatorDatas[4].isNormal ? 'normal' : 'emergency'}
                                />
                                <ElevatorElement
                                    index={5}
                                    name={elevatorDatas[5].name}
                                    upDown={elevatorDatas[5].up}
                                    floor={elevatorDatas[5].floorIndex}
                                    status={elevatorDatas[5].isOpened}
                                    elevatorType={elevatorDatas[5].isNormal ? 'normal' : 'emergency'}
                                />
                            </div>
                        </li>
                        <li>
                            <div className='elementWrap'>
                                <ElevatorElement
                                    index={6}
                                    name={elevatorDatas[6].name}
                                    upDown={elevatorDatas[6].up}
                                    floor={elevatorDatas[6].floorIndex}
                                    status={elevatorDatas[6].isOpened}
                                    elevatorType={elevatorDatas[6].isNormal ? 'normal' : 'emergency'}
                                />
                                <ElevatorElement
                                    index={7}
                                    name={elevatorDatas[7].name}
                                    upDown={elevatorDatas[7].up}
                                    floor={elevatorDatas[7].floorIndex}
                                    status={elevatorDatas[7].isOpened}
                                    elevatorType={elevatorDatas[7].isNormal ? 'normal' : 'emergency'}
                                />
                            </div>
                            <div className='elementWrap'>
                                <ElevatorElement
                                    index={8}
                                    name={elevatorDatas[8].name}
                                    upDown={elevatorDatas[8].up}
                                    floor={elevatorDatas[8].floorIndex}
                                    status={elevatorDatas[8].isOpened}
                                    elevatorType={elevatorDatas[8].isNormal ? 'normal' : 'emergency'}
                                />
                                <ElevatorElement
                                    index={9}
                                    name={elevatorDatas[9].name}
                                    upDown={elevatorDatas[9].up}
                                    floor={elevatorDatas[9].floorIndex}
                                    status={elevatorDatas[9].isOpened}
                                    elevatorType={elevatorDatas[9].isNormal ? 'normal' : 'emergency'}
                                />
                            </div>
                            <div className='elementWrap'>
                                <ElevatorElement
                                    index={10}
                                    name={elevatorDatas[10].name}
                                    upDown={elevatorDatas[10].up}
                                    floor={elevatorDatas[10].floorIndex}
                                    status={elevatorDatas[10].isOpened}
                                    elevatorType={elevatorDatas[10].isNormal ? 'normal' : 'emergency'}
                                />
                                <ElevatorElement
                                    index={11}
                                    name={elevatorDatas[11].name}
                                    upDown={elevatorDatas[11].up}
                                    floor={elevatorDatas[11].floorIndex}
                                    status={elevatorDatas[11].isOpened}
                                    elevatorType={elevatorDatas[11].isNormal ? 'normal' : 'emergency'}
                                />
                            </div>
                        </li>
                    </ul>
                );
    
                councilUI.push(
                    <ul key='council'>
                        <li>
                            <div className='elementWrap'>
                                <ElevatorElement
                                    index={12}
                                    name={elevatorDatas[12].name}
                                    upDown={elevatorDatas[12].up}
                                    floor={elevatorDatas[12].floorIndex}
                                    status={elevatorDatas[12].isOpened}
                                    elevatorType={elevatorDatas[12].isNormal ? 'normal' : 'emergency'}
                                />
                                <ElevatorElement
                                    index={13}
                                    name={elevatorDatas[13].name}
                                    upDown={elevatorDatas[13].up}
                                    floor={elevatorDatas[13].floorIndex}
                                    status={elevatorDatas[13].isOpened}
                                    elevatorType={elevatorDatas[13].isNormal ? 'normal' : 'emergency'}
                                />
                            </div>
                            <div className='elementWrap'>
                                <ElevatorElement
                                    index={14}
                                    name={elevatorDatas[14].name}
                                    upDown={elevatorDatas[14].up}
                                    floor={elevatorDatas[14].floorIndex}
                                    status={elevatorDatas[14].isOpened}
                                    elevatorType={elevatorDatas[14].isNormal ? 'normal' : 'emergency'}
                                />
                                <ElevatorElement
                                    index={15}
                                    name={elevatorDatas[15].name}
                                    upDown={elevatorDatas[15].up}
                                    floor={elevatorDatas[15].floorIndex}
                                    status={elevatorDatas[15].isOpened}
                                    elevatorType={elevatorDatas[15].isNormal ? 'normal' : 'emergency'}
                                />
                            </div>
                            <div className='elementWrap'>
                                <ElevatorElement
                                    index={16}
                                    name={elevatorDatas[16].name}
                                    upDown={elevatorDatas[16].up}
                                    floor={elevatorDatas[16].floorIndex}
                                    status={elevatorDatas[16].isOpened}
                                    elevatorType={elevatorDatas[16].isNormal ? 'normal' : 'emergency'}
                                />
                                <ElevatorElement
                                    index={17}
                                    name={elevatorDatas[17].name}
                                    upDown={elevatorDatas[17].up}
                                    floor={elevatorDatas[17].floorIndex}
                                    status={elevatorDatas[17].isOpened}
                                    elevatorType={elevatorDatas[17].isNormal ? 'normal' : 'emergency'}
                                />
                            </div>
                        </li>
                        <li>
                            <div className='elementWrap'>
                                <ElevatorElement
                                    index={18}
                                    name={elevatorDatas[18].name}
                                    upDown={elevatorDatas[18].up}
                                    floor={elevatorDatas[18].floorIndex}
                                    status={elevatorDatas[18].isOpened}
                                    elevatorType={elevatorDatas[18].isNormal ? 'normal' : 'emergency'}
                                />
                                <ElevatorElement
                                    index={19}
                                    name={elevatorDatas[19].name}
                                    upDown={elevatorDatas[19].up}
                                    floor={elevatorDatas[19].floorIndex}
                                    status={elevatorDatas[19].isOpened}
                                    elevatorType={elevatorDatas[19].isNormal ? 'normal' : 'emergency'}
                                />
                            </div>
                            <div className='elementWrap'>
                                <ElevatorElement
                                    index={20}
                                    name={elevatorDatas[20].name}
                                    upDown={elevatorDatas[20].up}
                                    floor={elevatorDatas[20].floorIndex}
                                    status={elevatorDatas[20].isOpened}
                                    elevatorType={elevatorDatas[20].isNormal ? 'normal' : 'emergency'}
                                />
                                <ElevatorElement
                                    index={21}
                                    name={elevatorDatas[21].name}
                                    upDown={elevatorDatas[21].up}
                                    floor={elevatorDatas[21].floorIndex}
                                    status={elevatorDatas[21].isOpened}
                                    elevatorType={elevatorDatas[21].isNormal ? 'normal' : 'emergency'}
                                />
                            </div>
                            <div className='description'>
                                <ul>
                                    <li>{i18n.t('sdms.elevatorInfo.일반 승강기')}</li>
                                    <li>{i18n.t('sdms.elevatorInfo.비상 승강기')}</li>
                                    <li>{i18n.t('sdms.elevatorInfo.상향 운행')}</li>
                                    <li>{i18n.t('sdms.elevatorInfo.하향 운행')}</li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                );

                ui.push(
                    <React.Fragment key='elevator_41'>
                        <section>
                            <h4>{i18n.t('sdms.elevatorInfo.경기도청')}</h4>
                            {mainOfficeUI}
                        </section>
                        <section>
                            <h4>{i18n.t('sdms.elevatorInfo.경기도의회')}</h4>
                            {councilUI}
                        </section>
                    </React.Fragment>
                );
            }
            else if (selectSiteID === ProjectResource.Site.GG_F && elevatorDatas.length < 10 && elevatorDatas.length > 5) {
                ui.push(
                    <section key='elevator_45'>
                        <h4>신용보증재단</h4>
                        <ul key='mainOffice'>
                            <li>
                                <div className='elementWrap alone'>
                                    <ElevatorElement
                                        index={0}
                                        name={elevatorDatas[0].name}
                                        upDown={elevatorDatas[0].up}
                                        floor={elevatorDatas[0].floorIndex}
                                        status={elevatorDatas[0].isOpened}
                                        elevatorType={elevatorDatas[0].isNormal ? 'normal' : 'emergency'}
                                    />
                                </div>
                                <div className='elementWrap alone'>
                                    <ElevatorElement
                                        index={1}
                                        name={elevatorDatas[1].name}
                                        upDown={elevatorDatas[1].up}
                                        floor={elevatorDatas[1].floorIndex}
                                        status={elevatorDatas[1].isOpened}
                                        elevatorType={elevatorDatas[1].isNormal ? 'normal' : 'emergency'}
                                    />
                                </div>
                                <div className='elementWrap'>
                                    <ElevatorElement
                                        index={2}
                                        name={elevatorDatas[2].name}
                                        upDown={elevatorDatas[2].up}
                                        floor={elevatorDatas[2].floorIndex}
                                        status={elevatorDatas[2].isOpened}
                                        elevatorType={elevatorDatas[2].isNormal ? 'normal' : 'emergency'}
                                    />
                                    <ElevatorElement
                                        index={3}
                                        name={elevatorDatas[3].name}
                                        upDown={elevatorDatas[3].up}
                                        floor={elevatorDatas[3].floorIndex}
                                        status={elevatorDatas[3].isOpened}
                                        elevatorType={elevatorDatas[3].isNormal ? 'normal' : 'emergency'}
                                    />
                                </div>
                                <div className='description'>
                                    <ul>
                                        <li>{i18n.t('sdms.elevatorInfo.일반 승강기')}</li>
                                        <li>{i18n.t('sdms.elevatorInfo.비상 승강기')}</li>
                                        <li>{i18n.t('sdms.elevatorInfo.상향 운행')}</li>
                                        <li>{i18n.t('sdms.elevatorInfo.하향 운행')}</li>
                                    </ul>
                                </div>
                            </li>
                            <li className='left'>
                                <div className='elementWrap left'>
                                    <ElevatorElement
                                        index={4}
                                        name={elevatorDatas[4].name}
                                        upDown={elevatorDatas[4].up}
                                        floor={elevatorDatas[4].floorIndex}
                                        status={elevatorDatas[4].isOpened}
                                        elevatorType={elevatorDatas[4].isNormal ? 'normal' : 'emergency'}
                                    />
                                    <ElevatorElement
                                        index={5}
                                        name={elevatorDatas[5].name}
                                        upDown={elevatorDatas[5].up}
                                        floor={elevatorDatas[5].floorIndex}
                                        status={elevatorDatas[5].isOpened}
                                        elevatorType={elevatorDatas[5].isNormal ? 'normal' : 'emergency'}
                                    />
                                    <ElevatorElement
                                        index={6}
                                        name={elevatorDatas[6].name}
                                        upDown={elevatorDatas[6].up}
                                        floor={elevatorDatas[6].floorIndex}
                                        status={elevatorDatas[6].isOpened}
                                        elevatorType={elevatorDatas[6].isNormal ? 'normal' : 'emergency'}
                                    />
                                </div>
                                <div className='elementWrap left'>
                                    <ElevatorElement
                                        index={7}
                                        name={elevatorDatas[7].name}
                                        upDown={elevatorDatas[7].up}
                                        floor={elevatorDatas[7].floorIndex}
                                        status={elevatorDatas[7].isOpened}
                                        elevatorType={elevatorDatas[7].isNormal ? 'normal' : 'emergency'}
                                    />
                                    <ElevatorElement
                                        index={8}
                                        name={elevatorDatas[8].name}
                                        upDown={elevatorDatas[8].up}
                                        floor={elevatorDatas[8].floorIndex}
                                        status={elevatorDatas[8].isOpened}
                                        elevatorType={elevatorDatas[8].isNormal ? 'normal' : 'emergency'}
                                    />
                                </div>
                            </li>
                        </ul>
                    </section>
                );
            }
            else if (selectSiteID === ProjectResource.Site.GG_D && elevatorDatas.length < 6) {
                ui.push(
                    <section key='elevator_43'>
                        <h4>도서관</h4>
                        <ul key='mainOffice'>
                            <li>
                                <div className='elementWrap'>
                                    <ElevatorElement
                                        index={0}
                                        name={elevatorDatas[0].name}
                                        upDown={elevatorDatas[0].up}
                                        floor={elevatorDatas[0].floorIndex}
                                        status={elevatorDatas[0].isOpened}
                                        elevatorType={elevatorDatas[0].isNormal ? 'normal' : 'emergency'}
                                    />
                                </div>
                                <div className='elementWrap'>
                                    <ElevatorElement
                                        index={1}
                                        name={elevatorDatas[1].name}
                                        upDown={elevatorDatas[1].up}
                                        floor={elevatorDatas[1].floorIndex}
                                        status={elevatorDatas[1].isOpened}
                                        elevatorType={elevatorDatas[1].isNormal ? 'normal' : 'emergency'}
                                    />
                                </div>
                                <div className='elementWrap'>
                                    <ElevatorElement
                                        index={2}
                                        name={elevatorDatas[2].name}
                                        upDown={elevatorDatas[2].up}
                                        floor={elevatorDatas[2].floorIndex}
                                        status={elevatorDatas[2].isOpened}
                                        elevatorType={elevatorDatas[2].isNormal ? 'normal' : 'emergency'}
                                    />
                                </div>
                                <div className='elementWrap'>
                                    <ElevatorElement
                                        index={3}
                                        name={elevatorDatas[3].name}
                                        upDown={elevatorDatas[3].up}
                                        floor={elevatorDatas[3].floorIndex}
                                        status={elevatorDatas[3].isOpened}
                                        elevatorType={elevatorDatas[3].isNormal ? 'normal' : 'emergency'}
                                    />
                                </div>
                                <div className='elementWrap'>
                                    <ElevatorElement
                                        index={4}
                                        name={elevatorDatas[4].name}
                                        upDown={elevatorDatas[4].up}
                                        floor={elevatorDatas[4].floorIndex}
                                        status={elevatorDatas[4].isOpened}
                                        elevatorType={elevatorDatas[4].isNormal ? 'normal' : 'emergency'}
                                    />
                                </div>
                                <div className='description'>
                                    <ul className='ggd'>
                                        <li>{i18n.t('sdms.elevatorInfo.상향 운행')}</li>
                                        <li>{i18n.t('sdms.elevatorInfo.하향 운행')}</li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </section>
                );
            }

            return ui;
        }
        else {
            return <Loader
                        size="40px"
                        borderSize="5px"
                        baseColor="#fff"
                        wheelColor="#5398FF"
                        speed="700"
                    />
        }
    }

    render() {
        const ui = this.setElevatorsUI();

        return (
            <ElevatorInfoComponent id={this.props.popupType} className={'viewDashboardBoxD viewElevator'} $siteID={this.props.selectSiteID}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={430}
                    popupMinHeight={624}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                    usePopupResize={false}
                >
                    <div className={'dslTop dslGrd'}>
                        <h5 className={'dslTitle'} >
                            {i18n.t('sdms.elevatorInfo.엘리베이터 위치 현황')}
                        </h5>
                        <a className={'dslX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.elevatorInfo, false)}></a>
                    </div>

                    <div className={'dslCont'}>
                        {ui}
                    </div>
                </PopupDraggable>
            </ElevatorInfoComponent>
        );
    }
}

export default ElevatorInfo;

class ElevatorElement extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        {/* 
        * name : 몇호기인지?
        * up/down : 아래 위 화살표 아이콘
        *      -> up : 미운행 윗쪽
        *      -> up_run : 운행중 윗쪽
        *      -> down : 미운행 아랫쪽
        *      -> down_run : 운행중 아랫쪽
        * floor : 몇층인지?
        * status : 닫힘 or 열림 표시
        * elevatorType : 일반 승강기 or 비상 승강기 표시
        *      -> normal : 일반 승강기 (defualt)
        *      -> emergency : 비상 승강기
        */}

        let floor = 0;
        if(this.props.floor < 0) {
            floor = (this.props.floor).toString().replace('-', 'B');
        }
        else {
            floor = this.props.floor + 1;
        }

        return (
            <ElevatorElementComponent $elevatorType={this.props.elevatorType} key={this.props.index}>
                <div>
                    <p>{this.props.name}</p>
                    <div>
                        <img src={this.props.upDown === true ? up_run: up} alt='엘리베이터 상향표시 아이콘' width={16} height={10} />
                        <p>{floor}F</p>
                        <img src={this.props.upDown === false ? down_run: down} alt='엘리베이터 하향표시 아이콘' width={16} height={10} />
                    </div>
                </div>
                <p>{this.props.status ? i18n.t('sdms.elevatorInfo.열림') : i18n.t('sdms.elevatorInfo.닫힘')}</p>
            </ElevatorElementComponent>
        );
    }
}