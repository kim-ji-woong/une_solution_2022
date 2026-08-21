import React, { Component } from 'react';
import PopupDraggable from './popupDraggable';

import { RiskFactorsInfoComponent } from '../../styled/sdmsPopupsStyled';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';
import imgClose from '../../../Common/img/imghydrogen/common/closeX_icon.svg';

import { SDMSController } from '../../services/sdmsController';
import SDMS from '../sdms';

class RiskFactorsInfo extends Component {
    static Warning = "주의";
    static Alert = "경보";

    constructor(props) {
        super(props);

        this.state = {
            riskAssessInfo: {
                sensorName: null,
                parameter: null,
                deviation: null,
                cause: null,
                event_scenario: null,
                hazard_scenario: null,
                action: null,
                reference: null,
                status: null
            }
        }

        this.props = props;

        this.initRiskAssessInfo();
    }

    initRiskAssessInfo() {
        const selectedAlarm = this.props.selectedAlarm;
        if (!selectedAlarm || !selectedAlarm.etc) {
            return;
        }

        const riskID = Number(selectedAlarm.etc);
        if (riskID === NaN) {
            return;
        }

        this.loadRiskAssessInfo(riskID);
    }

    async loadRiskAssessInfo(riskID) {
        const [result, message] = await SDMSController.requestRiskAssessInfo(riskID);

        if (result !== null) {
            let riskAssessInfo = {};
            riskAssessInfo.sensorName = (result.sensorName ? result.sensorName : "-");
            riskAssessInfo.parameter = (result.parameter ? result.parameter : "-");
            riskAssessInfo.deviation = (result.deviation ? result.deviation : "-");
            riskAssessInfo.cause = (result.cause ? result.cause : "-");
            riskAssessInfo.event_scenario = (result.event_scenario ? result.event_scenario : "-");
            riskAssessInfo.hazard_scenario = (result.hazard_scenario ? result.hazard_scenario : "-");
            riskAssessInfo.action = (result.action ? result.action : "-");
            riskAssessInfo.reference = (result.reference ? result.reference : "-");
            riskAssessInfo.status = (result.status ? result.status : "-");

            this.setState({ riskAssessInfo });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.selectedAlarm !== prevProps.selectedAlarm) {
            const selectedAlarm = this.props.selectedAlarm;
            if (!selectedAlarm || !selectedAlarm.etc) {
                return;
            }

            const riskID = Number(selectedAlarm.etc);
            if (riskID === NaN) {
                return;
            }

            this.loadRiskAssessInfo(riskID);
        }
    }

    render() {

        return (
            <RiskFactorsInfoComponent id={this.props.popupType} className={'viewDashboardBoxD viewRiskFactorsInfo'}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={321}
                    popupMinHeight={598}
                    topSize={40}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >
                    <div className={'viewDashPopTitle'}>
                        <span>{i18n.t('sdms.riskFactorsInfo.실시간 위험요인')}</span>
                        <span className={'colseX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.riskFactorsInfo, false)}><a><img src={imgClose} alt={i18n.t('common.닫기')} /></a></span>
                    </div>

                    <div className={'dslCont'}>
                        <div>
                            <div className='head'>
                                <p>{(this.state.riskAssessInfo.sensorName ? this.state.riskAssessInfo.sensorName : "-")}</p>
                            </div>
                            <ul className='body'>
                                <li>
                                    <p>{i18n.t('sdms.riskFactorsInfo.상태')}</p>
                                    <p>{(this.state.riskAssessInfo.status ? i18nUtil.convertText(this.state.riskAssessInfo.status) : "-")}</p>
                                </li>
                                <li>
                                    <p>{i18n.t('sdms.riskFactorsInfo.원인')}</p>
                                    <p>{(this.state.riskAssessInfo.cause ? i18nUtil.convertText(this.state.riskAssessInfo.cause) : "-")}</p>
                                </li>
                                <li>
                                    <p>{i18n.t('sdms.riskFactorsInfo.공정 파라미터')}</p>
                                    <p>{(this.state.riskAssessInfo.parameter ? i18nUtil.convertText(this.state.riskAssessInfo.parameter) : "-")}</p>
                                </li>
                                <li>
                                    <p>{i18n.t('sdms.riskFactorsInfo.이탈')}</p>
                                    <p>{(this.state.riskAssessInfo.deviation ? i18nUtil.convertText(this.state.riskAssessInfo.deviation) : "-")}</p>
                                </li>
                                <li>
                                    <p>{i18n.t('sdms.riskFactorsInfo.이벤트 시나리오')}</p>
                                    <p>{(this.state.riskAssessInfo.event_scenario ? i18nUtil.convertText(this.state.riskAssessInfo.event_scenario) : "-")}</p>
                                </li>
                                <li>
                                    <p>{i18n.t('sdms.riskFactorsInfo.위험 시나리오')}</p>
                                    <p>{(this.state.riskAssessInfo.hazard_scenario ? i18nUtil.convertText(this.state.riskAssessInfo.hazard_scenario) : "-")}</p>
                                </li>
                                <li>
                                    <p>{(this.state.riskAssessInfo.status?.includes(RiskFactorsInfo.Alert) ? i18n.t('sdms.riskFactorsInfo.비상 조치') : i18n.t('sdms.riskFactorsInfo.예방 조치'))}</p>
                                    <p>{(this.state.riskAssessInfo.action ? i18nUtil.convertText(this.state.riskAssessInfo.action) : "-")}</p>
                                </li>
                                <li>
                                    <p>{(this.state.riskAssessInfo.status?.includes(RiskFactorsInfo.Alert) ? i18n.t('sdms.riskFactorsInfo.비상 참조') : i18n.t('sdms.riskFactorsInfo.예방 참조'))}</p>
                                    <p>{(this.state.riskAssessInfo.reference ? i18nUtil.convertText(this.state.riskAssessInfo.reference) : "-")}</p>
                                </li>
                            </ul>
                        </div>
                    </div>

                </PopupDraggable>
            </RiskFactorsInfoComponent>
        );
    }
}

export default withTranslation()(RiskFactorsInfo);