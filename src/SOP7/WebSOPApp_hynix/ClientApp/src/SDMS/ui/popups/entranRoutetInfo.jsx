import React, { Component } from 'react';
import PopupDraggable from './popupDraggable';
import { EntranRoutetInfoComponent } from '../../styled/sdmsPopupsStyled';
import SDMS from '../sdms';
import { SDMSController } from '../../services/sdmsController';
import SdmsResource from '../../resource/id';

class EntranRoutetInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            worker: null,
        };
    }

    componentDidMount() {
        this.ensureWorkerLoaded();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedAlarm !== this.props.selectedAlarm) {
            this.setState({ worker: null, error: null }, () => this.ensureWorkerLoaded());
        }
    }

    getWorkerId = () => this.props.selectedAlarm?.sensorZoneHistoryInfos?.[0]?.workerID;

    ensureWorkerLoaded = async () => {
        const workerID = this.getWorkerId();
        if (workerID === undefined || workerID === null) return;
        if (this.state.worker && this.state.worker.workerID === workerID) return;

        const requestWorkerInfo =
            this.props.requestWorkerInfo ||
            (typeof SDMSController !== 'undefined' && SDMSController.requestWorkerInfo);

        if (!requestWorkerInfo) {
            this.setState({ error: '작업자 정보를 가져올 수 있는 API가 없습니다.' });
            return;
        }

        try {
            const result = await requestWorkerInfo(workerID);
            const worker = result?.worker || {};
            this.setState({ worker: { ...worker, workerID } });
        } catch (e) {
            this.setState({ error: '작업자 정보 조회 실패' });
        }
    };

    parseParam = (param) => {
        if (!param) return { datetime: '', desc: '' };
        const parts = param.split(',').map(s => s.trim());
        return {
            datetime: parts[0] || '',
            desc: parts[1] || ''
        };
    };

    formatTime = (datetime) => {
        if (!datetime) return '-';
        const d = new Date(datetime.replace(/-/g, '/'));
        if (isNaN(d)) return datetime;
        const h = String(d.getHours()).padStart(2, '0');
        const m = String(d.getMinutes()).padStart(2, '0');
        return `${h}시 ${m}분`;
    };

    getWorkerName = () => this.state.worker?.name || '이름 정보 없음';
    getWorkerOrg = () => {
        const w = this.state.worker || {};
        const org = [w.officeName, w.teamName].filter(Boolean).join(' > ');
        return org || '근무처·부서 정보 없음';
    };

    render() {
        const { selectedAlarm } = this.props;
        const entries = selectedAlarm?.sensorZoneHistoryInfos ?? [];

        return (
            <EntranRoutetInfoComponent id={this.props.popupType} className={'viewDashboardBoxD viewDashboard'}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={328}
                    popupMinHeight={256}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                    usePopupResize={false}
                >
                    <div className={'dslTop dslGrd'}>
                        <h5 className={'dslTitle'}>{SDMS.menu.entranRoutetInfo}</h5>
                        <a className={'dslX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.entranRoutetInfo, false)}></a>
                    </div>

                    <div className={'dslCont'}>
                        <div>
                            <p>{this.getWorkerName()}</p>
                            <p>{this.getWorkerOrg()}</p>
                        </div>
                        <ul>
                            {entries.length === 0 ? (
                                <li><p>-</p><button type="button">CCTV 버튼</button></li>
                            ) : (
                                entries.map((e, idx) => {
                                    const { datetime, desc } = this.parseParam(e.param);
                                    const timeLabel = this.formatTime(datetime);
                                    const line = desc ? `${timeLabel} : ${desc}` : `${timeLabel}`;
                                    return (
                                        <li key={`${e.sensorZoneHistoryID}-${idx}`}>
                                            <p>{line}</p>
                                            <button type="button" onClick={() => this.props.setHinixCCTVInfo(SdmsResource.facilityType.Stranger, idx + 1)}>CCTV 버튼</button>
                                        </li>
                                    );
                                })
                            )}
                        </ul>
                    </div>
                </PopupDraggable>
            </EntranRoutetInfoComponent>
        );
    }
}

export default EntranRoutetInfo;