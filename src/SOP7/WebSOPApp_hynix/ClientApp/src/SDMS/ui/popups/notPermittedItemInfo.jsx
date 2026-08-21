import React, { Component } from 'react';
import PopupDraggable from './popupDraggable';
import { NotPermittedItemInfoComponent } from '../../styled/sdmsPopupsStyled';
import SDMS from '../sdms';
import { SDMSController } from '../../services/sdmsController';

class NotPermittedItemInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null,
            itemNames: {},
        };
    }

    componentDidMount() {
        this.ensureItemsLoaded();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedAlarm !== this.props.selectedAlarm) {
            this.setState({ itemNames: {}, error: null }, () => this.ensureItemsLoaded());
        }
    }

    getEntries = () =>
        this.props.selectedAlarm?.sensorZoneHistoryInfos ?? [];

    getItemIdsInOrder = () =>
        this.getEntries()
            .map(e => e?.itemID)
            .filter(id => id !== undefined && id !== null);

    ensureItemsLoaded = async () => {
        const idsInOrder = this.getItemIdsInOrder();
        if (idsInOrder.length === 0) {
            this.setState({ error: 'itemID가 없습니다.' });
            return;
        }

        if (!SDMSController || typeof SDMSController.requestItemInfo !== 'function') {
            this.setState({ error: '아이템 정보를 가져올 API가 설정되지 않았습니다.' });
            return;
        }

        const uniqueToFetch = Array.from(new Set(idsInOrder))
            .filter(id => !(id in this.state.itemNames));

        if (uniqueToFetch.length === 0) return;

        this.setState({ loading: true, error: null });
        try {
            const results = await Promise.allSettled(
                uniqueToFetch.map(id => SDMSController.requestItemInfo(id))
            );

            const nextMap = { ...this.state.itemNames };
            results.forEach((res, idx) => {
                const id = uniqueToFetch[idx];
                if (res.status === 'fulfilled') {
                    const name = (res.value?.item?.name || '').trim();
                    nextMap[id] = name || '-';
                } else {
                    nextMap[id] = '-';
                }
            });

            this.setState({ itemNames: nextMap, loading: false });
        } catch (e) {
            this.setState({ loading: false, error: '아이템 정보 조회 중 오류가 발생했습니다.' });
        }
    };

    render() {
        const { itemNames, loading, error } = this.state;
        const entries = this.getEntries();

        return (
            <NotPermittedItemInfoComponent id={this.props.popupType} className={'viewDashboardBoxD viewDashboard'}>
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
                        <h5 className={'dslTitle'}>{SDMS.menu.notPermittedItemInfo}</h5>
                        <a
                            className={'dslX'}
                            onClick={() => this.props.setVisiblePopups(SDMS.menu.notPermittedItemInfo, false)}
                        ></a>
                    </div>

                    <div className={'dslCont'}>
                        <ul>
                            {loading && entries.length === 0 ? (
                                <li><p>로딩중...</p></li>
                            ) : error ? (
                                <li><p style={{ color: '#ff6464' }}>{error}</p></li>
                            ) : entries.length === 0 ? (
                                <li><p>-</p></li>
                            ) : (
                                entries.map((e, i) => (
                                    <li key={`${e.sensorZoneHistoryID}-${e.orderIndex}-${i}`}>
                                        <p>{itemNames[e.itemID] ?? (loading ? '로딩중...' : '-')}</p>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </PopupDraggable>
            </NotPermittedItemInfoComponent>
        );
    }
}

export default NotPermittedItemInfo;