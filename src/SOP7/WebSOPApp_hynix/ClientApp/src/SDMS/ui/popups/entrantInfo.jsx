import React, { Component } from 'react';
import PopupDraggable from './popupDraggable';
import { EntrantInfoComponent } from '../../styled/sdmsPopupsStyled';
import SDMS from '../sdms';
import manImg from '../../img/popup/manImg.png';
import womanImg from '../../img/popup/womanImg.png';
import Loader from '../../../Settings/ui/popups/loader';
import { SDMSController } from '../../services/sdmsController';
import SdmsResource from '../../resource/id';

class EntrantInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
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
        if (!workerID && workerID !== 0) {
            this.setState({ error: '작업자 ID가 없습니다.' });
            return;
        }

        // 이미 같은 ID의 작업자를 로딩했다면 생략
        if (this.state.worker && this.state.worker.workerID === workerID) return;

        const requestWorkerInfo =
            this.props.requestWorkerInfo ||
            (typeof SDMSController !== 'undefined' && SDMSController.requestWorkerInfo);

        if (!requestWorkerInfo) {
            this.setState({ error: '작업자 정보를 가져올 수 있는 API가 설정되지 않았습니다.' });
            return;
        }

        try {
            this.setState({ loading: true, error: null });
            const result = await requestWorkerInfo(workerID);
            const worker = result?.worker || {};
            this.setState({ worker: { ...worker, workerID }, loading: false });
        } catch (e) {
            this.setState({ loading: false, error: '작업자 정보 조회 중 오류가 발생했습니다.' });
        }
    };

    formatPhone = (rawPhone = '') => {
        const digits = rawPhone.replace(/\D/g, '');
        if (digits.length === 11) return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        if (digits.length >= 9) return digits.replace(/(\d{2,3})(\d{3,4})(\d{4})/, '$1-$2-$3');
        return rawPhone || '-';
    };

    getWorkerDisplay = (workerInfo = {}) => {
        const name = workerInfo?.name ?? '정보 없음';
        const org = [workerInfo?.officeName, workerInfo?.teamName]
            .filter(Boolean)
            .join(' > ') || '근무처 정보 없음';

        // workerID >= 5 이면 womanImg, 아니면 manImg
        const workerIdNum = Number(workerInfo?.workerID);
        const defaultImg = workerIdNum >= 5 ? womanImg : manImg;

        const photoUrl = (workerInfo?.photoUrl && String(workerInfo.photoUrl).trim())
            ? workerInfo.photoUrl
            : defaultImg;

        const phone = this.formatPhone?.(workerInfo?.phoneNumber); 

        return { name, org, phone, photoUrl };
    };
    
    getEventTypeString = () => {
        let text = "-";

        const { selectedAlarm } = this.props;

        if (!selectedAlarm) return text;

        if (selectedAlarm.facilityType === SdmsResource.facilityType.CheatedTagging) {
            text = '태깅 횟수';
        }
        else if (selectedAlarm.facilityType === SdmsResource.facilityType.Untagging) {
            text = '발생 위치'; // 2
        }
        else if (selectedAlarm.facilityType === SdmsResource.facilityType.StealCard) {
            text = '발생 위치'; // 2
        }
        else if (selectedAlarm.facilityType === SdmsResource.facilityType.Stranger) {
            text = '이벤트 정보'; // 2
        }
        else if (selectedAlarm.facilityType === SdmsResource.facilityType.EvasionItem) {
            text = '이벤트 정보';
        }
        else if (selectedAlarm.facilityType === SdmsResource.facilityType.NotPermittedPerson) {
            text = '발생 위치';
        }
        else if (selectedAlarm.facilityType === SdmsResource.facilityType.NotPermittedItem) {
            text = '발생 위치';
        }
        
        return text;
    }

    render() {
        const { selectedAlarm } = this.props;
        const { worker, loading, error } = this.state;

        const display = this.getWorkerDisplay(worker || {});

        const rawParam = selectedAlarm?.sensorZoneHistoryInfos?.[0]?.param || '';
        const spaceName = rawParam.includes(',')
            ? rawParam.split(',')[1].trim()  // 두 번째 값만 사용
            : rawParam;

        const tagTime = selectedAlarm?.strDateTime || '-';
        const eventTypeString = this.getEventTypeString();

        return (
            <EntrantInfoComponent id={this.props.popupType} className={'viewDashboardBoxD viewDashboard'}>
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
                        <h5 className={'dslTitle'}>{SDMS.menu.entrantInfo}</h5>
                        {
                            selectedAlarm.facilityType === SdmsResource.facilityType.Stranger &&
                                <button type="button" onClick={() => this.props.setVisiblePopups(SDMS.menu.entranRoutetInfo, true)}>출입자 경로 상세보기 버튼</button>
                        }
                        <a className={'dslX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.entrantInfo, false)}></a>
                    </div>

                    {loading ? (
                        <div className={'dslCont loading'}>
                            <Loader size="40px" borderSize="5px" baseColor="#fff" wheelColor="#5398FF" speed="700" />
                        </div>
                    ) : (
                        <div className={'dslCont'}>
                            <div>
                                <img src={display.photoUrl} alt="출입자 사진" width={76} height={76} />
                                <div>
                                    <div>
                                        <p>{display.name}</p>
                                        <p>{display.org}</p>
                                    </div>
                                    <p>{display.phone}</p>
                                </div>
                            </div>

                            <ul>
                                <li>
                                    <p>{eventTypeString}</p>
                                    <p>{spaceName ? spaceName : '-'}</p>
                                </li>
                                <li>
                                    <p>태깅 시간</p>
                                    <p>{tagTime}</p>
                                </li>
                            </ul>
                        </div>
                    )}
                </PopupDraggable>
            </EntrantInfoComponent>
        );
    }
}

export default EntrantInfo;