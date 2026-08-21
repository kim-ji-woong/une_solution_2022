import React, { Component } from 'react';
import PopupDraggable from './popupDraggable';
import { ForcedDoorOpenInfoComponent } from '../../styled/sdmsPopupsStyled';
import SDMS from '../sdms';
import manImg from '../../img/popup/manImg.png';
import womanImg from '../../img/popup/womanImg.png';
import { SDMSController } from '../../services/sdmsController';
import Loader from '../../../Settings/ui/popups/loader';

class ForcedDoorOpenInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            index: 0,                 // 현재 보고 있는 "그룹"(workerID 단위) 인덱스
            workerCache: {},          // { [workerID]: workerInfo }
            loading: false,
            error: null
        };
    }

    componentDidMount() {
        this.ensureWorkerLoaded();
    }

    componentDidUpdate(prevProps, prevState) {
        // 선택 알람이 바뀌면 인덱스/캐시 초기화
        if (prevProps.selectedAlarm !== this.props.selectedAlarm) {
            this.setState({ index: 0, workerCache: {}, error: null }, () => {
                this.ensureWorkerLoaded();
            });
            return;
        }

        // 인덱스(그룹)이 바뀌면 해당 worker 정보 로드
        if (prevState.index !== this.state.index) {
            this.ensureWorkerLoaded();
        }
    }

    getRawList = () => this.props.selectedAlarm?.sensorZoneHistoryInfos ?? [];

    getTotalCount = () => this.getRawList().length;

    getGroups = () => {
        const list = this.getRawList();
        const map = new Map();

        list.forEach((e, idx) => {
            if (!map.has(e.workerID)) {
                map.set(e.workerID, { workerID: e.workerID, entries: [], firstIndex: idx });
            }
            map.get(e.workerID).entries.push(e);
        });

        return Array.from(map.values()).sort((a, b) => a.firstIndex - b.firstIndex);
    };

    getPageCount = () => this.getGroups().length;

    getCurrentGroup = () => {
        const groups = this.getGroups();
        if (!groups.length) return null;
        const safe = Math.max(0, Math.min(this.state.index, groups.length - 1));
        return groups[safe];
    };

    // '2025-09-18 22:01:33, IN, T1-1 1층' -> { datetime, status, space }
    parseParam = (param) => {
        if (!param) return { datetime: '', status: '', space: '' };
        const parts = param.split(',').map(s => s.trim());
        return {
            datetime: parts[0] || '',
            status: parts[1] || '',
            space: parts[2] || ''
        };
    };

    formatDateTime = (datetime, status) => {
        return datetime ? `${datetime}${status ? ` (${status})` : ''}` : '';
    };

    getSameWorkerEntries = () => {
        const group = this.getCurrentGroup();
        if (!group) return [];
        return [...group.entries].sort((a, b) => (a.param || '').localeCompare(b.param || ''));
    };

    goPrev = () => this.setState((s) => ({ index: Math.max(0, s.index - 1) }));
    goNext = () => this.setState((s) => ({ index: Math.min(this.getPageCount() - 1, s.index + 1) }));

    ensureWorkerLoaded = async () => {
        const group = this.getCurrentGroup();
        if (!group) return;

        const { workerID } = group;
        if (!workerID) return;

        if (this.state.workerCache[workerID]) return;

        const requestWorkerInfo =
            this.props.requestWorkerInfo ||
            (typeof SDMSController !== 'undefined' && SDMSController.requestWorkerInfo);

        if (!requestWorkerInfo) {
            this.setState({ error: '작업자 정보를 가져올 수 있는 API가 설정되지 않았습니다.' });
            return;
        }

        try {
            this.setState({ loading: true, error: null });
            const result = await requestWorkerInfo(workerID); // Promise 가정
            this.setState((prev) => ({
                workerCache: { ...prev.workerCache, [workerID]: result?.worker || {} },
                loading: false
            }));
        } catch (e) {
            this.setState({ loading: false, error: '작업자 정보 조회 중 오류가 발생했습니다.' });
        }
    };

    getWorkerDisplay = (workerInfo) => {
        const name = workerInfo?.name ?? '이름 정보 없음';
        const org = [workerInfo?.officeName, workerInfo?.teamName].filter(Boolean).join(' > ') || '근무처·부서 정보 없음';

        // 전화번호 포맷팅
        const rawPhone = workerInfo?.phoneNumber ?? '';
        const digitsOnly = rawPhone.replace(/\D/g, '');
        let formattedPhone = '-';
        if (digitsOnly.length === 11) {
            formattedPhone = digitsOnly.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        } else if (digitsOnly.length >= 9) {
            formattedPhone = digitsOnly.replace(/(\d{2,3})(\d{3,4})(\d{4})/, '$1-$2-$3');
        } else if (digitsOnly) {
            formattedPhone = rawPhone;
        }

        // workerID >= 5 이면 womanImg, 아니면 manImg
        const workerIdNum = Number(workerInfo?.workerID);
        const defaultImg = workerIdNum >= 5 ? womanImg : manImg;

        const photoUrl = (workerInfo?.photoUrl && String(workerInfo.photoUrl).trim())
            ? workerInfo.photoUrl
            : defaultImg;

        return { name, org, phone: formattedPhone, photoUrl };
    };

    render() {
        const group = this.getCurrentGroup();
        const entries = this.getSameWorkerEntries();
        const tagCount = entries.length;

        const firstEntry = entries[0];
        const { space: spaceFromParam } = this.parseParam(firstEntry?.param);
        const spaceName = spaceFromParam || this.props.selectedAlarm?.spaceName || '정보 없음';

        // 현재 그룹의 worker 표시 정보
        const workerID = group?.workerID;
        const workerInfo = workerID ? this.state.workerCache[workerID] : null;
        const display = this.getWorkerDisplay(workerInfo || {});

        const pageCount = this.getPageCount();
        const { loading } = this.state;

        return (
            <ForcedDoorOpenInfoComponent id={this.props.popupType} className={'viewDashboardBoxD viewDashboard'}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={392}
                    popupMinHeight={328}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                    usePopupResize={false}
                >
                    <div className={'dslTop dslGrd'}>
                        <h5 className={'dslTitle'}>출입자 상세정보</h5>
                        <p>{`총 ${pageCount} 건`}</p>
                        <a
                            className={'dslX'}
                            onClick={() => this.props.setVisiblePopups(SDMS.menu.forcedDoorOpenInfo, false)}
                        ></a>
                    </div>
                    {loading ? 
                        <div className={'dslCont loading'}>
                            <Loader
                                size="40px"
                                borderSize="5px"
                                baseColor="#fff"
                                wheelColor="#5398FF"
                                speed="700"
                            />
                        </div> :
                        <div className={'dslCont'}>
                            <div className='titleWrap'>
                                <img src={display.photoUrl} alt='출입자 사진' width={76} height={76} />
                                <div>
                                    <div>
                                        <p>{display.name}</p>
                                        <p>{display.org}</p>
                                    </div>
                                    <p>{display.phone}</p>
                                </div>
                            </div>

                            <div className='infoWrap'>
                                <ul>
                                    <li>
                                        <p>발생위치</p>
                                        <p>{spaceName}</p>
                                    </li>

                                    <li>
                                        <p>태깅 횟수</p>
                                        <p>{tagCount} 건</p>
                                    </li>

                                    <li className='tagInfo'>
                                        <p>태깅 정보</p>
                                        <div>
                                            {tagCount === 0 ? (
                                                <p>-</p>
                                            ) : (
                                                entries.map((e, i) => {
                                                    const { datetime, status } = this.parseParam(e.param);
                                                    return (
                                                        <span key={`${e.sensorZoneHistoryID}-${e.orderIndex}-${i}`}>
                                                            {this.formatDateTime(datetime, status)}
                                                        </span>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className='btnWrap'>
                                <button
                                    type="button"
                                    className="navArrow left"
                                    onClick={this.goPrev}
                                    disabled={this.state.index <= 0}
                                    aria-label="이전"
                                >
                                    이전
                                </button>
                                <button
                                    type="button"
                                    className="navArrow right"
                                    onClick={this.goNext}
                                    disabled={this.state.index >= pageCount - 1}
                                    aria-label="다음"
                                >
                                    다음
                                </button>
                            </div>

                            
                        </div>
                    }

                </PopupDraggable>
            </ForcedDoorOpenInfoComponent>
        );
    }
}

export default ForcedDoorOpenInfo;