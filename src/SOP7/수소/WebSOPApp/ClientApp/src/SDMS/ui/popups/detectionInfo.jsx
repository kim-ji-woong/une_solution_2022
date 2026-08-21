import React, { Component } from 'react';
import $ from 'jquery';
import SdmsResource from '../../resource/id';
import PopupDraggable from './popupDraggable';
import SettingsStore from '../../../Settings/settingsStore';
import SDMS from '../sdms';

import ProjectResource from '../../../Root/resource/id';
import { DetectionInfoComponent } from '../../../SDMS/styled/sdmsPopupsStyled';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';
import AnomalyChart from '../charts/anomalyChart';
import LineChart from '../charts/lineChart';
import { SDMSController } from '../../services/sdmsController';
import { ModalBackground } from '../../../Root/styled/variables';

// 이상탐지
class DetectionInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            facilityList: [],
            selectedFacilityId: "",     // 선택한 설비
            selectedSensorType: "",     // 선택한 센서유형
            selectedSensorID: "",      // 선택한 센서ID
            anomalyDatas: {sensor: null, anomalyDetections: null},
            selectedRangeInfo: {
                start: null,
                end: null,
                threshold: null,
                rows: null
            },
            anomalyChartData: null,
            anomalyTimeRange: null,

            facilityIDs: [],
            sensorIDs: []
        };
        
        this.init();
    }

    init = () => {
        // KETI 운영 설비 및 센서 데이터
        this.state.facilityIDs.push(2);
        this.state.facilityIDs.push(3);
        this.state.facilityIDs.push(6);
        this.state.facilityIDs.push(7);

        this.state.sensorIDs.push(12);
        //this.state.sensorIDs.push(18);
        this.state.sensorIDs.push(20);
        this.state.sensorIDs.push(50);
        this.state.sensorIDs.push(27);
        this.state.sensorIDs.push(29);
        this.state.sensorIDs.push(31);
        this.state.sensorIDs.push(35);
        this.state.sensorIDs.push(37);

        const facilityList = this.getFacilityList();

        this.state.facilityList = facilityList;        
    }

    searchSensorInfo = (id) => {
        const facilityList = this.state.facilityList;

        let facilityId = null;
        let sensorType = null;
        let sensorid = null;

        if (!id) {
            return [facilityId, sensorType, sensorid];
        }

        let isFind = false;

        for (const facility of facilityList) {

            for (const type in facility.sensors) {

                const sensors = facility.sensors[type];

                for (const sensor of sensors) {

                    if (sensor.id === id) {
                        facilityId = facility.id;
                        sensorType = type;
                        sensorid = id;

                        isFind = true;
                        break;
                    }
                }
                if (isFind)
                    break;
            }
            if (isFind)
                break;
        }

        return [facilityId, sensorType, sensorid];
    }

    getSensorTypeName = (type) => {
        let sensorType = null;

        if (type === 'tempSensors') {
            sensorType = i18n.t('facilityType.온도');
        }
        else if (type === 'flowSensors') {
            sensorType = i18n.t('facilityType.유량');
        }
        else if (type === 'pressureSensors') {
            sensorType = i18n.t('facilityType.압력');
        }
        else if (type === 'h2Sensors') {
            sensorType = i18n.t('facilityType.수소');
        }
        else if (type === 'o2Sensors') {
            sensorType = i18n.t('facilityType.산소');
        }
        else if (type === 'h2LowSensors') {
            sensorType = i18n.t('facilityType.저농도수소');
        }
        else if (type === 'h2JAGSensors') {
            sensorType = i18n.t('facilityType.수소가스');
        }
        else if (type === 'o2JAGSensors') {
            sensorType = i18n.t('facilityType.산소가스');
        }

        return sensorType;
    }

    getFacilityList = () => {
        let facilityList = [];

        const buildingGroupList = this.props.buildingGroupList;
        const zoneList = this.props.zoneList;
        const sensorList = this.props.sensorList;

        for (const buildingGroup of buildingGroupList) {
            const buildingDatas = buildingGroup.buildingDatas;

            // 설비 리스트
            if (buildingDatas) {
                for (const buildingData of buildingDatas) {
                    const buildingID = buildingData.id;
                    const buildingDisplayText = i18nUtil.convertText(buildingData.displayText);

                    // .TODO: KETI 설비 제한
                    if (this.state.facilityIDs.includes(buildingID) === false) {
                        continue;
                    }

                    let facility = {};
                    facility.name = buildingDisplayText;
                    facility.id = buildingID;
                    facility.sensors = {};

                    facilityList.push(facility);

                    // 장비 리스트 
                    if (zoneList) {
                        for (const zoneID in zoneList) {

                            const zone = zoneList[zoneID];

                            if (zone && zone.length === 7 && zone[1] === buildingID) {

                                // 센서 리스트
                                for (const type in sensorList) {                                    
                                    const sensors = sensorList[type];
                                    // type 다국어화
                                    const typeName = this.getSensorTypeName(type);

                                    for (const sensor of sensors) {
                                        if (sensor.zoneID.toString() === zoneID) {

                                            // .TODO: KETI 센서 제한
                                            if (this.state.sensorIDs.includes(sensor.id) === false) {
                                                continue;
                                            }

                                            if (!facility.sensors[typeName]) {
                                                facility.sensors[typeName] = [];
                                            }                                            

                                            facility.sensors[typeName].push(sensor);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return facilityList;
    }

    componentDidMount() {
        // 창이 서서히 나타나는 효과
        let cssLeft = null;
        let cssTop = null;
        let cssWidth = null;
        let cssHeight = null;

        const popup = document.getElementById(this.props.popupType);
        //const target = document.getElementById("dsBot_" + this.props.popupType);
        const target = document.getElementById("dsBot_" + SdmsResource.popupLayer.detectionInfo);
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

            $('#' + this.props.popupType).animate(
                { opacity: 1, width: cssWidth, height: cssHeight, left: cssLeft, top: cssTop },
                SdmsResource.PopupAniTime,
                () => {
                    const el = document.getElementById(this.props.popupType);
                    if (el) el.style.opacity = 1;
                }
            );
        } else {
            $('#' + this.props.popupType).animate(
                { opacity: 1 },
                SdmsResource.PopupAniTime,
                () => {
                    const el = document.getElementById(this.props.popupType);
                    if (el) el.style.opacity = 1;
                }
            );
        }

        this.unsubscribe_SettingsStore = SettingsStore.subscribe(function () {
            let data = SettingsStore.getState();
            if (data?.actionType === 'RESET_POPUP') {
                this.repositionPopup(data.popupState);
            }
        }.bind(this));


        if (this.props.selectAnomalyID) {
            const [facilityId, sensorType, sensorid] = this.searchSensorInfo(this.props.selectAnomalyID);

            if (facilityId && sensorType && sensorid) {
                this.state.selectedFacilityId = facilityId.toString();
                this.state.selectedSensorType = sensorType;
                this.state.selectedSensorID = sensorid.toString();
                
                this.getDetectionChartData();
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex && this.state.popup) {
            this.state.popup.style.zIndex = this.props.zIndex;
        }

        if (this.props.currentView !== prevProps.currentView) {
            if (this.props.currentView.buildingID === null || this.props.currentView.zoneID === null) {
                return;
            }
        }
    }

    componentWillUnmount() {
        this.unsubscribe_SettingsStore && this.unsubscribe_SettingsStore();
    }

    repositionPopup(popupState) {
        let data = popupState.detectionInfo;
        if (!data) return;

        let popup = document.getElementById(this.props.popupType);
        if (!popup) return;

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup });
    }

    handleFacilityChange = (e) => {
        this.setState({
            selectedFacilityId: e.target.value,
            selectedSensorType: "",
            selectedSensorID: ""
        });
    };

    handleSensorTypeChange = (e) => {
        this.setState({
            selectedSensorType: e.target.value,
            selectedSensorID: ""
        });
    };

    handleSensorNameChange = (e) => {
        this.setState({ selectedSensorID: e.target.value });
    };

    getDetectionChartData = async () => {
        if (!this.state.selectedSensorID) return console.log('선택된 센서가 없습니다');

        const result = await SDMSController.requestTodaySensorAnomalyDetections(this.state.selectedSensorID);

        this.setState({ anomalyDatas: {sensor: result[0].sensor, anomalyDetections: result[0].anomalyDetections} });
    }

    // 이상탐지 상세정보
    onRangeSelect = (payload) => {
        if (!payload || typeof payload !== "object") return;

        const {
            start,
            end,
            threshold,
            details = [],
            prevDetails = [],
            patternType
        } = payload;

        // ---------- 현재 선택 구간 ----------
        const rows = [];
        const labels = [];
        const sensorData = [];

        let isOverThreshold = false;

        details.forEach(d => {
            const t = new Date(d.read_data_time);

            // HH:mm
            const labelText = t.toLocaleTimeString(undefined, {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit"
            });

            // HH:mm:ss
            // 클라이언트 시스템 시간에 따라 표시로 수정
            //const timeText = t.toLocaleTimeString("de-DE", {
            //    hour12: false,
            //    hour: "2-digit",
            //    minute: "2-digit",
            //    second: "2-digit",
            //    timeZone: "Europe/Berlin"
            //});
            const timeText = t.toLocaleTimeString(undefined, {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });

            labels.push(labelText);
            sensorData.push(d.error_abs_value);

            if (d.error_abs_value >= threshold) {
                isOverThreshold = true;
            }

            rows.push({
                timeText,
                actual: d.point_value_original,
                predicted: d.point_value_reconstruct,
                err: d.error_abs_value
            });
        });

        const newState = {
            selectedRangeInfo: {
                start,
                end,
                threshold,
                rows
            },
            anomalyPatternType: patternType
        };

        // ---------- 이상 탐지 차트 ----------
        if (isOverThreshold) {
            const formatTime = (d) =>
                d.toLocaleTimeString(undefined, {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                });

            const startTime = details[0]?.read_data_time;
            const endTime = details[details.length - 1]?.read_data_time;

            const rangeString =
                startTime && endTime
                    ? `[${formatTime(new Date(startTime))}-${formatTime(new Date(endTime))}]`
                    : null;

            newState.anomalyChartData = {
                labels,
                sensorData
            };
            newState.anomalyTimeRange = rangeString;
        }

        // ---------- 비교 차트 (이전 3분) ----------
        newState.compareLineCharts = prevDetails.map(p => {
            if (!p?.details?.length) return null;

            const labels = [];
            const sensorData = [];

            p.details.forEach(d => {
                const t = new Date(d.read_data_time);
                labels.push(
                    t.toLocaleTimeString(undefined, {
                        hour12: false,
                        hour: "2-digit",
                        minute: "2-digit"
                    })
                );
                sensorData.push(d.error_abs_value);
            });

            return {
                title: p.title,
                start: p.start,
                end: p.end,
                labels,
                sensorData
            };
        }).filter(Boolean);

        this.setState(newState);
    };

    getPatternMessage = (patternType) => {
        let message = "-";

        if (patternType === "stable" || patternType === "-") {
            message = i18n.t('sdms.detect.구간에서 안정 상태 경항의 이상탐지가 발견되었습니다');
        }
        else if (patternType === "rapid_increase") {
            message = i18n.t('sdms.detect.구간에서 급격한 증가 경항의 이상탐지가 발견되었습니다');
        }
        else if (patternType === "rapid_decrease") {
            message = i18n.t('sdms.detect.구간에서 급격한 감소 경항의 이상탐지가 발견되었습니다');
        }
        else if (patternType === "gradual_increase") {
            message = i18n.t('sdms.detect.구간에서 점진적 증가 경항의 이상탐지가 발견되었습니다');
        }
        else if (patternType === "gradual_decrease") {
            message = i18n.t('sdms.detect.구간에서 점진적 감소 경항의 이상탐지가 발견되었습니다');
        }
        else if (patternType === "fluctuating") {
            message = i18n.t('sdms.detect.구간에서 불규칙한 변동 경항의 이상탐지가 발견되었습니다');
        }

        return message;
    }

    render() {
        const { facilityList, selectedFacilityId, selectedSensorType, selectedSensorID } = this.state;

        // 설비 유형 옵션
        const facilityOptions = facilityList.map(f => (
            <option key={f.id} value={f.id}>{f.name}</option>
        ));

        // 센서 유형 옵션
        const selectedFacility = facilityList.find(f => f.id.toString() === selectedFacilityId);
        const sensorTypes = selectedFacility ? Object.keys(selectedFacility.sensors) : [];
        const sensorTypeOptions = sensorTypes.map(type => (
            <option key={type} value={type}>{type}</option>
        ));

        // 센서명 옵션
        const sensorList = selectedFacility && selectedSensorType
            ? selectedFacility.sensors[selectedSensorType] || []
            : [];
        const sensorNameOptions = sensorList.map(sensor => (
            <option key={sensor.id} value={sensor.id}>{sensor.name}</option>
        ));

        return (
            <ModalBackground>
                <DetectionInfoComponent id={this.props.popupType} className={'viewDetectionSection'}>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={1400}
                        popupMinHeight={940}
                        topSize={32}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                        usePopupDrag={false}
                        usePopupResize={false}
                    >
                        <div className={'dslTop dslGrd'}>
                            <h5 className={'dslTitle'}>
                                {i18n.t('sdms.detect.이상 탐지')}
                            </h5>
                            <a
                                className={'dslX'}
                                onClick={() => this.props.setVisiblePopups(SDMS.menu.detectionInfo, false)}
                            />
                        </div>

                        <div className="contents">
                            <div className="chartWrap">
                                <p>{i18n.t('sdms.detect.이상탐지 그래프')}</p>
                                <div className="filterWrap">
                                    <ul>
                                        <li>
                                            <p>{i18n.t('sdms.detect.설비 유형')}</p>
                                            <select value={selectedFacilityId} onChange={this.handleFacilityChange}>
                                                <option value="">{i18n.t('sdms.detect.설비유형 선택')}</option>
                                                {facilityOptions}
                                            </select>
                                        </li>
                                        <li>
                                            <p>{i18n.t('sdms.detect.센서 유형')}</p>
                                            <select
                                                value={selectedSensorType}
                                                onChange={this.handleSensorTypeChange}
                                                disabled={!selectedFacility}
                                            >
                                                <option value="">{i18n.t('sdms.detect.센서유형 선택')}</option>
                                                {sensorTypeOptions}
                                            </select>
                                        </li>
                                        <li>
                                            <p>{i18n.t('sdms.detect.센서명')}</p>
                                            <select
                                                value={selectedSensorID}
                                                onChange={this.handleSensorNameChange}
                                                disabled={!selectedSensorType}
                                            >
                                                <option value="">{i18n.t('sdms.detect.센서명 선택')}</option>
                                                {sensorNameOptions}
                                            </select>
                                        </li>
                                    </ul>
                                    <button onClick={() => this.getDetectionChartData()}>{i18n.t('sdms.detect.조회')}</button>
                                </div>
                                <div className="chart">
                                    <AnomalyChart
                                        anomalyDatas={this.state.anomalyDatas}
                                        onRangeSelect={this.onRangeSelect}
                                    />
                                </div>
                            </div>

                            <div className="infoWrap">
                                <div className="detailWrap">
                                    <p>{i18n.t('sdms.detect.이상탐지 상세정보')}</p>
                                    <div>
                                        <ul className="head">
                                            <li>{i18n.t('sdms.detect.시간')}</li>
                                            <li>{i18n.t('sdms.detect.실제값')}</li>
                                            <li>{i18n.t('sdms.detect.학습값')}</li>
                                            <li>{i18n.t('sdms.detect.오차값')}</li>
                                        </ul>
                                        <ul
                                            className={`body ${((this.state.selectedRangeInfo?.rows || []).length === 0 ? "empty" : "")}`}
                                            key={`rng-${this.state.selectedRangeInfo?.start?.getTime?.() || 0}-${this.state.selectedRangeInfo?.end?.getTime?.() || 0}`}
                                        >
                                            {(() => {
                                                const info = this.state.selectedRangeInfo;
                                                const rows = info?.rows || [];
                                                const th = info?.threshold;

                                                if (rows.length === 0) {
                                                    return (
                                                        <li>
                                                            <p>{i18n.t('sdms.detect.선택된 데이터가 없습니다')}</p>
                                                        </li>
                                                    );
                                                }

                                                const fmt = (v) =>
                                                    (v == null || Number.isNaN(Number(v)))
                                                        ? "-"
                                                        : Number(v).toFixed(3);

                                                return rows.map((r, idx) => {
                                                    const isOver = th != null && r.err != null && Number(r.err) >= Number(th);
                                                    const cls = isOver ? "on" : "";   // 임계치 초과시에만 on
                                                    return (
                                                        <li key={idx} className={cls}>
                                                            <p>{r.timeText}</p>
                                                            <p>{fmt(r.actual)}</p>
                                                            <p>{fmt(r.predicted)}</p>
                                                            <p>{fmt(r.err)}</p>
                                                        </li>
                                                    );
                                                });
                                            })()}
                                        </ul>
                                    </div>
                                </div>

                                <div className="dataWrap">
                                    <p className="diagnosisTitle">{i18n.t('sdms.detect.진단 데이터')}</p>

                                    <div className="diagnosisContent">
                                        <div className="compareSection">
                                            <p>{i18n.t('sdms.detect.비교 구간')}</p>
                                            {(() => {
                                                const fallbackTitles = [i18n.t('sdms.detect.직전 1분'), i18n.t('sdms.detect.직전 2분'), i18n.t('sdms.detect.직전 3분')];

                                                const charts = (this.state.compareLineCharts ?? [])
                                                    .map((c, i) => (c && Array.isArray(c.labels) && c.labels.length > 0
                                                                    && Array.isArray(c.sensorData) && c.sensorData.length > 0
                                                        ? { i, title: c.title || fallbackTitles[i], labels: c.labels, sensorData: c.sensorData }
                                                        : null))
                                                    .filter(Boolean);

                                                const hasRows = (this.state.selectedRangeInfo?.rows ?? []).length > 0;

                                                if (!hasRows || charts.length === 0) {
                                                    return (
                                                        <div className="empty">
                                                            <span>{i18n.t('sdms.detect.선택된 데이터가 없습니다')}</span>
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <>
                                                        {charts.map(({ i, title, labels, sensorData }) => (
                                                            <LineChart
                                                                key={i}
                                                                lineColor="#0085FF"
                                                                typeName={title}
                                                                maxCount={5}
                                                                datas={{ labels, sensorData }}
                                                            />
                                                        ))}
                                                    </>
                                                );
                                            })()}
                                        </div>
                                        <div className="detailsSection">
                                            <div className="anomalyPeriod">
                                                <p>{i18n.t('sdms.detect.이상탐지 구간')}</p>
                                                {
                                                    (this.state.selectedRangeInfo?.rows || []).length === 0 ?
                                                        <div className='empty'>
                                                            <span>{i18n.t('sdms.detect.선택된 데이터가 없습니다')}</span>
                                                        </div>
                                                        :
                                                        this.state.anomalyChartData ?
                                                            <LineChart lineColor="#FF3B3B" typeName={i18n.t('sdms.detect.이상탐지')} maxCount={5} datas={this.state.anomalyChartData} />
                                                            :
                                                            <div className='empty'>
                                                                <span>{i18n.t('sdms.detect.이상탐지된 데이터가 없습니다')}</span>
                                                            </div>
                                                }
                                            </div>
                                            {
                                                this.state.anomalyChartData &&
                                                    <div className="diagnosisResult">
                                                    <p>{i18n.t('sdms.detect.이상탐지 진단 결과')}</p>
                                                        <div>
                                                            <span>
                                                                {
                                                                    this.state.anomalyTimeRange && this.state.anomalyPatternType &&
                                                                `${this.state.anomalyTimeRange} ${this.getPatternMessage(this.state.anomalyPatternType)}`
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </PopupDraggable>
                </DetectionInfoComponent>
            </ModalBackground>
        );
    }
}

export default withTranslation()(DetectionInfo);
