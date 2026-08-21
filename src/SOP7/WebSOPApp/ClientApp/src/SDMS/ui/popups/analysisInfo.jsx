import React, { Component } from 'react';
import $ from 'jquery';
import SdmsResource from '../../resource/id';
import PopupDraggable from './popupDraggable';
import SettingsStore from '../../../Settings/settingsStore';
import SDMS from '../sdms';

import ProjectResource from '../../../Root/resource/id';

import { AnalysisInfoComponent } from '../../../SDMS/styled/sdmsPopupsStyled';
import { i18n, withTranslation } from '../../../language/i18n';

class AnalysisInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {


        };
    }

    componentDidMount() {
        // 창이 서서히 나타나는 효과
        let cssLeft = null;
        let cssTop = null;
        let cssWidth = null;
        let cssHeight = null;

        const popup = document.getElementById(this.props.popupType);
        //const target = document.getElementById("dsBot_" + this.props.popupType);
        const target = document.getElementById("dsBot_" + SdmsResource.popupLayer.analysisInfo);
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
            cssTop = "50%";
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

        this.unsubscribe_SettingsStore = SettingsStore.subscribe(function () {
            let data = SettingsStore.getState();

            if (data?.actionType === 'RESET_POPUP') {
                this.repositionPopup(data.popupState);
            }
        }.bind(this));

        //this.init();
    }


    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
        }

        if (this.props.currentView !== prevProps.currentView) {
            if (this.props.currentView.buildingID === null || this.props.currentView.zoneID === null) {
                return;
            }

            const eqZoneDatas = this.getEqZoneDatas();
            this.setState({ eqZoneDatas, searchEqZoneText: '', showEqZoneDropDown: false, searchEqZoneDatas: [], selectedEqZone: null });
        }
    }

    repositionPopup(popupState) {
        let data = popupState.analysisInfo;

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



    render() {
        return (
            <AnalysisInfoComponent id={this.props.popupType} className={'viewAnalysisSection'}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={1378}
                    popupMinHeight={806}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >

                    <div className={'dslTop dslGrd'}>
                        <h5 className={'dslTitle'}>
                            {i18n.t('sdms.analysisInfo.위험도 분석')}
                        </h5>
                        <a className={'dslX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.analysisInfo, false)}></a>
                    </div>
                    <div className={'dslContAnalysis'}>
                        <div className={'analysisImage'}></div>
                    </div>
                </PopupDraggable>
            </AnalysisInfoComponent>
        );
    }
}

export default withTranslation()(AnalysisInfo);