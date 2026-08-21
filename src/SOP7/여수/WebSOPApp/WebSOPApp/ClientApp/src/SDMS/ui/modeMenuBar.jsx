import React, { Component } from 'react';

import styles from '../../Common/css/ui.module.css';
import SdmsResource from '../resource/id';
import $ from 'jquery';
import sdms from '../../SDMS/css/sdms.module.css';
import SDMS from './sdms';

import { ModeMenuBarComponent } from '../../SDMS/sdmsStyled';
/* import { ModeMenu } from "../styled";
import { NavTab, NavTabDis } from "../styled";
import { StatusTab, StatusTabDis } from "../styled";
import { DetailTab, DetailTabDis } from "../styled";
import { EventTab, EventTabDis } from "../styled";
import { MiniTab, MiniTabDis } from "../styled";
import { PoiEditTab, PoiEditTabDis } from "../styled";
import { DataTab, DataTabDis } from "../styled";
import { ModeChange } from "../styled"; */


class ModeMenuBar extends Component {
    constructor(props) {
        super(props);

        this.props = props;
    }

    componentDidMount() {
       //this.popupBtm();
    }

    popupBtm = () => {
        const buttons = this.refQuickButton.current;

        if (buttons) {
            if (buttons.classList.contains('off')) {
                buttons.classList.add('on');
                buttons.classList.remove('off');
                $(buttons).slideUp();
            }
            else {
                buttons.classList.add('off');
                buttons.classList.remove('on');
                $(buttons).slideDown();
            }
        }
    } 

    setVisiblePopups(menu) {
        this.props.setVisiblePopups(menu);
    }

    getQuickButtonClassName(name) {
        if (this.props.visiblePopups[name]) {
            return styles.on;
        }

        return styles.off;
    }

    toggleViewMode() {
        if (this.props.xrayMode) {
            this.props.setXrayMode(false);
        }
        else {
            this.props.setXrayMode(true);
        }
    }

    getViewModeText() {
        if (this.props.xrayMode) {
            return "X-RAY 모드";
        }

        return "일반 모드";
    }

    render() {
        const showNavInfo = this.props.visiblePopups[SDMS.menu.navInfo];
        const showStatusInfo = this.props.visiblePopups[SDMS.menu.statusInfo];
        const showDetailInfo = this.props.visiblePopups[SDMS.menu.detailInfo];
        const showEventInfo = this.props.visiblePopups[SDMS.menu.eventInfo];
        const showMiniMap = this.props.visiblePopups[SDMS.menu.miniMap];
        const showPoiEdit = this.props.visiblePopups[SDMS.menu.poiEditInfo];
        const showDataInfo = this.props.visiblePopups[SDMS.menu.dataInfo];

        return (
            <>
                {/* (this.props.isEditMode === false) && */ }
                {/* {
                    <div id={styles.dsSoulBot}>
                    <button onClick={this.popupBtm}></button>
                      <ul ref={this.refQuickButton}>
                        <li><a id={"dsBot_" + SdmsResource.popupLayer.navInfo} onClick={() => this.props.setVisiblePopups(SDMS.menu.navInfo)}></a></li>
                        <li><a id={"dsBot_" + SdmsResource.popupLayer.statusInfo} onClick={() => this.props.setVisiblePopups(SDMS.menu.statusInfo)}></a></li>
                        <li><a id={"dsBot_" + SdmsResource.popupLayer.detailInfo} onClick={() => {}}></a></li>
                        <li><a id={"dsBot_" + SdmsResource.popupLayer.detailInfo} onClick={() => this.props.setVisiblePopups(SDMS.menu.detailInfo)}></a></li>
                        <li><span className={sdms.modeChange} onClick={() => this.toggleViewMode()}>{this.getViewModeText()}</span></li>
                        <li><a id={"dsBot_" + SdmsResource.popupLayer.eventInfo} onClick={() => this.props.setVisiblePopups(SDMS.menu.eventInfo)}></a></li>
                        <li><a id={"dsBot_" + SdmsResource.popupLayer.miniMap} onClick={() => this.props.setVisiblePopups(SDMS.menu.miniMap)}></a></li>
                        <li><a id={"dsBot_" + SdmsResource.popupLayer.poiEditInfo} onClick={() => {}}></a></li>
                        <li><a id={"dsBot_" + SdmsResource.popupLayer.poiEditInfo} onClick={() => this.props.setVisiblePopups(SDMS.menu.poiEditInfo)}></a></li>
                      </ul>
                </div> */}

                <ModeMenuBarComponent className={SdmsResource.UISection + " " + "modeMenu"}>
                    {
                        showStatusInfo &&
                        <div data-tooltip="센서정보"><span className={'statusTab'} onClick={() => this.props.setVisiblePopups(SDMS.menu.statusInfo)}></span></div>
                    }
                    {
                        !showStatusInfo &&
                        <div data-tooltip="센서정보"><span className={'statusTabDis'} onClick={() => this.props.setVisiblePopups(SDMS.menu.statusInfo)}></span></div>
                    }
                    {
                        showEventInfo &&
                        <div data-tooltip="이벤트정보"><span className={'eventTab disable'} onClick={() => this.props.setVisiblePopups(SDMS.menu.eventInfo)}></span></div>
                    }
                    {
                        !showEventInfo &&
                        <div data-tooltip="이벤트정보"><span className={'eventTabDis disable'} onClick={() => this.props.setVisiblePopups(SDMS.menu.eventInfo)}></span></div>
                    }

                    {
                        showDataInfo &&
                        <div data-tooltip="공공데이터"><span className={'dataTab disable'} onClick={() => this.props.setVisiblePopups(SDMS.menu.dataInfo)}></span></div>
                    }
                    {
                        !showDataInfo &&
                        <div data-tooltip="공공데이터"><span className={'dataTabDis disable'} onClick={() => this.props.setVisiblePopups(SDMS.menu.dataInfo)}></span></div>
                    }

                    {/*   {
                        showPoiEdit &&
                        <PoiEditTab onClick={() => this.props.setVisiblePopups(SDMS.menu.poiEditInfo)}></PoiEditTab>
                    }
                    {
                        !showPoiEdit &&
                        <PoiEditTabDis onClick={() => this.props.setVisiblePopups(SDMS.menu.poiEditInfo)}></PoiEditTabDis>
                    } */}

                    <div className="modeChangeBox"><div data-tooltip="모드변경"><div className={'modeChange'} onClick={() => this.toggleViewMode()}><span>{this.getViewModeText()}</span></div></div></div>
                    {/* <DetailTab onClick={() => this.props.setVisiblePopups(SDMS.menu.detailInfo)}></DetailTab> */}
                    {
                        showDetailInfo &&
                        <div data-tooltip="시뮬레이션"><span className={'detailTab'} onClick={() => { }}></span></div>
                    }
                    {
                        !showDetailInfo &&
                        <div data-tooltip="시뮬레이션"><span className={'detailTabDis'} onClick={() => { }}></span></div>
                    }
                    {
                        showMiniMap &&
                        <div data-tooltip="미니맵"><span className={'miniTab'} onClick={() => this.props.setVisiblePopups(SDMS.menu.miniMap)}></span></div>
                    }
                    {
                        !showMiniMap &&
                        <div data-tooltip="미니맵"><span className={'miniTabDis'} onClick={() => this.props.setVisiblePopups(SDMS.menu.miniMap)}></span></div>
                    }
                    {
                        showNavInfo &&
                        <div data-tooltip="네비게이션"><span className={'navTab'} onClick={() => this.props.setVisiblePopups(SDMS.menu.navInfo)}></span></div>
                    }
                    {
                        !showNavInfo &&
                        <div data-tooltip="네비게이션"><span className={'navTabDis'} onClick={() => this.props.setVisiblePopups(SDMS.menu.navInfo)}></span></div>
                    }

                  {/* <PoiEditTab onClick={() => { }}></PoiEditTab> */}
                </ModeMenuBarComponent>
            </>
        );
    }
}
export default ModeMenuBar;