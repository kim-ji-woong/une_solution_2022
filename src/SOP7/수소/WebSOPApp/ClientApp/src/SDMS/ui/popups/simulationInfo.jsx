
import React, { Component } from 'react';
import $ from 'jquery';
import SdmsResource from '../../resource/id';
import PopupDraggable from './popupDraggable';
import SettingsStore from '../../../Settings/settingsStore';
import SDMS from '../sdms';

import { SimulationInfoComponent } from '../../../SDMS/styled/sdmsPopupsStyled';
import { i18n, withTranslation } from '../../../language/i18n';
import tooltip_icon from '../../img/popup/infoIcon.svg';
import LineChart from '../charts/simulationLineChart';
import { SDMSController } from '../../services/sdmsController';
import simulationInfoIcon from '../../img/popup/simulationInfoIcon.svg';
import { ModalBackground } from '../../../Root/styled/variables';

import html2canvas from 'html2canvas';
import Loader from '../../../Settings/ui/popups/loader';

function TextField({ id, label, unit, placeholder, tooltip = "", value, onChange, min, max }) {
    const handleChange = (raw) => {
        // 숫자, 음수 부호, 소수점만 허용
        const next = String(raw).replace(/[^\d.\-\.]/g, "");

        // 공란 허용
        if (next === "" || next === "-" || next === "." || next === "-.") {
            onChange(next);
            return;
        }

        // 숫자 변환
        const num = Number(next);
        if (Number.isNaN(num)) return;

        // min/max 범위를 벗어나면 입력 반영 X
        if (min !== undefined && num < min) return;
        if (max !== undefined && num > max) return;

        onChange(next);
    };

    return (
        <li>
            <div>
                <div data-tooltip={tooltip}>
                    <img src={tooltip_icon} alt="도움말 아이콘" width={16} height={16} />
                </div>
                <label htmlFor={id}>{label}</label>
            </div>
            <div>
                <input
                    id={id}
                    type="number"
                    step="any"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder={placeholder}
                    value={value}
                    min={min}
                    max={max}
                    onChange={(e) => handleChange(e.target.value)}
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                />
                <span>{unit}</span>
            </div>
        </li>
    );
}

function SelectField({ id, label, tooltip = "", options = [], value, onChange }) {
    return (
        <li>
            <div>
                <div data-tooltip={tooltip}>
                    <img src={tooltip_icon} alt="도움말 아이콘" width={16} height={16} />
                </div>
                <label htmlFor={id}>{label}</label>
            </div>
            <div>
                <select
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    {options.map((opt, idx) => (
                        <option key={idx} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        </li>
    );
}

const GROUP_SERIES = {
    LOW_PRESSURE: ['p_buf1', 't_buf1'],
    MID_PRESSURE: ['t_tkm', 'p_mbk', 'defuel_mbk'],
    HIGH_PRESSURE: ['p_hbk', 't_tkh', 'defuel_hbk'],
    COMPRESSOR: ['m_mcp1'],
};

const GROUP_LABEL = {
    LOW_PRESSURE: i18n.t('sdms.simualation.저압탱크'),
    MID_PRESSURE: i18n.t('sdms.simualation.중압탱크'),
    HIGH_PRESSURE: i18n.t('sdms.simualation.고압탱크'),
    COMPRESSOR: i18n.t('sdms.simualation.압축기'),
};

function parseNameLabel(nameStr) {
    if (!nameStr) return '';
    try {
        const obj = JSON.parse(nameStr);
        const lang = (i18n?.language || 'ko').startsWith('ko') ? 'ko' : 'en';
        return obj?.[lang] || obj?.ko || obj?.en || '';
    } catch {
        return String(nameStr);
    }
}

// values 객체를 {labels, sensorData}로 정규화 (labels는 숫자 키 오름차순)
function normalizeValues(values) {
    if (!values || typeof values !== 'object') return { labels: [], sensorData: [] };
    const entries = Object.entries(values).map(([k, v]) => {
        const n = Number(k);
        return { key: k, numKey: Number.isNaN(n) ? null : n, val: Number(v) };
    });
    const numeric = entries.every(e => e.numKey !== null);
    const sorted = entries.sort((a, b) => {
        if (numeric) return a.numKey - b.numKey;
        return String(a.key).localeCompare(String(b.key), undefined, { numeric: true });
    });
    const labels = sorted.map(e => (numeric ? `${e.numKey}s` : String(e.key)));
    const sensorData = sorted.map(e => e.val);
    return { labels, sensorData };
}

// unit
function guessUnit(key, nameLabel) {
    const s = `${key} ${nameLabel}`.toLowerCase();
    if (s.includes('temp') || s.includes('온도')) return '℃';
    if (s.includes('press') || s.includes('압력') || key.startsWith('p_')) return 'MPa';
    if (s.includes('rate') || s.includes('flow') || s.includes('유량')) return 'g/s';
    return '';
}

// result에서 values가 있는 시리즈만 수집
function collectSeriesFromResult(resultObj) {
    const out = [];
    if (!resultObj || typeof resultObj !== 'object') return out;
    Object.keys(resultObj).forEach((key) => {
        const node = resultObj[key];
        if (node && typeof node === 'object' && node.values && typeof node.values === 'object') {
            const nameLabel = parseNameLabel(node.name);
            const { labels, sensorData } = normalizeValues(node.values);
            out.push({
                key,
                keyLower: String(key).toLowerCase(),   // ← 추가
                title: nameLabel || key,
                unit: guessUnit(key, nameLabel),
                labels,
                sensorData
            });
        }
    });
    return out;
}

class SimulationInfo extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();

        this.chartWrapRef = React.createRef();
    }

    // 초기 input data
    getInitialState = () => ({
        isLoading: false,
        selectedFacilityType: null, // 선택한 설비유형
        selectedGroup: '', // 시뮬레이션 결과에서 선택된 설비유형 (저압탱크/중압탱크/고압탱크/압축기)

        // 기본값 설정
        tAmbC: "21",
        pHBk0: "87",
        d2On: "0",
        contOn: "0",
        tPreRun: "0",
        tPreSet1: "10",
        tPreSet2: "10",
        compMod: "2",

        // 전기분해기
        nSource: "1",
        pSource: "20",
        tSourceC: "21",
        mSource: "100",

        // 저압탱크
        vBufInd1: "5.8",
        nBuf1: "3",
        pBufMax1: "20",
        pBuf_RC1: "6",
        pBuf_01: "20",
        pBufMin1: "6",

        // 컴프레서
        nMCp: "1",
        pCpInMaxM: "93",
        pCpInMinM: "6",
        prefM: "11",
        trefCM: "35",
        mCprefM: "50.1",
        spCpM: "409.3",
        etaVM: "0.74",
        eta_CompM: "0.8",
        eta_motorM: "0.925",
        tCoolSetCM: "40",
        cOPM: "4",

        // 중압탱크
        vTkIndM: "1",
        nTkM: "0",
        pTkMaxM: "50",
        pTkMinM: "49",
        fuMoOnM: "1",
        tTk0CM: "21",

        // 고압탱크
        vTkIndH: "0.58",
        nTkH: "3",
        pTkMaxH: "87",
        pTkMinH: "86",
        tTk0CH: "21",

        // 디스펜서1
        eADisp1: "1",
        pClass1: "70",
        tBaC1: "-40",
        mHFPLim1: "60",
        tBrkMax1: "150",
        hFPMode1: "1",
        comOn1: "0",

        // 승용차
        vTkMode1: "11",
        tVL1: "174",
        tV1: "174",
        pTk01: "5",
        sOCG1: "95",
        tTk0C1: "999",

        // 디스펜서2
        eADisp2: "1",
        pClass2: "35",
        tBaC2: "-40",
        mHFPLim2: "60",
        tBrkMax2: "150",
        hFPMode2: "1",
        comOn2: "0",

        // 지게차
        vTkMode2: "11",
        tVL2: "174",
        tV2: "174",
        pTk02: "5",
        sOCG2: "95",
        tTk0C2: "999",

        // 결과 상태
        simResult: null,
        simError: true,

        series: []  // [{ key, title, unit, labels, sensorData }]
    });

    componentDidMount() {
        // 창이 서서히 나타나는 효과
        let cssLeft = null;
        let cssTop = null;
        let cssWidth = null;
        let cssHeight = null;

        const popup = document.getElementById(this.props.popupType);
        //const target = document.getElementById("dsBot_" + this.props.popupType); 
        const target = document.getElementById("dsBot_" + SdmsResource.popupLayer.simulationInfo);
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

        this.unsubscribe_SettingsStore = SettingsStore.subscribe(function () {
            let data = SettingsStore.getState();

            if (data?.actionType === 'RESET_POPUP') {
                this.repositionPopup(data.popupState);
            }
        }.bind(this));
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

    handleFieldChange = (key, val) => {
        const next = String(val).replace(/[^\d.\-]/g, "");
        this.setState({ [key]: next });
    };

    getFacilityTypeFields = () => {
        const { selectedFacilityType } = this.state;
        if (!selectedFacilityType) return null;

        const S = SdmsResource.simulationFacilityType;

        const tip = (min, max) => `Min:${min}/Max:${max}`;

        switch (selectedFacilityType) {
            // 1) 전기분해기 (electrolysis)
            case S.electrolysis:
                return (
                    <>
                        <ul>
                            <TextField
                                id="sim_nSource"
                                label="N_Source"
                                unit="(ea)"
                                placeholder={i18n.t('sdms.simualation.수량')}
                                tooltip={tip(1, 100)}
                                value={this.state.nSource}
                                min={1}
                                max={100}
                                onChange={(v) => this.handleFieldChange("nSource", v)}
                            />
                            <TextField
                                id="sim_pSource"
                                label="P_Source"
                                unit="(MPa)"
                                placeholder={i18n.t('sdms.simualation.압력')}
                                tooltip={tip(0, 39)}
                                value={this.state.pSource}
                                min={0}
                                max={39}
                                onChange={(v) => this.handleFieldChange("pSource", v)}
                            />
                        </ul>
                        <ul>
                            <TextField
                                id="sim_tSourceC"
                                label="T_SourceC"
                                unit="(℃)"
                                placeholder={i18n.t('sdms.simualation.온도')}
                                tooltip={tip(-273.15, 60)}
                                value={this.state.tSourceC}
                                min={-273.15}
                                max={60}
                                onChange={(v) => this.handleFieldChange("tSourceC", v)}
                            />
                            <TextField
                                id="sim_mSource"
                                label="m_Source"
                                unit="(kg/h)"
                                placeholder={i18n.t('sdms.simualation.유량')}
                                tooltip={tip(0, 300)}
                                value={this.state.mSource}
                                min={0}
                                max={300}
                                onChange={(v) => this.handleFieldChange("mSource", v)}
                            />
                        </ul>
                    </>
                );

            // 2) 저압탱크 (Buffer Tank)
            case S.calvera:
                return (
                    <>
                        <ul>
                            <TextField
                                id="sim_vBufInd1"
                                label="V_BufInd1"
                                unit="(m3)"
                                placeholder={i18n.t('sdms.simualation.부피')}
                                tooltip={tip(0, 9)}
                                value={this.state.vBufInd1}
                                min={0}
                                max={9}
                                onChange={(v) => this.handleFieldChange("vBufInd1", v)}
                            />
                            <TextField
                                id="sim_nBuf1"
                                label="N_Buf1"
                                unit="(ea)"
                                placeholder={i18n.t('sdms.simualation.수량')}
                                tooltip={tip(1, 9)}
                                value={this.state.nBuf1}
                                min={1}
                                max={9}
                                onChange={(v) => this.handleFieldChange("nBuf1", v)}
                            />
                        </ul>
                        <ul>
                            <TextField
                                id="sim_pBufMax1"
                                label="P_BufMax1"
                                unit="(MPa)"
                                placeholder={i18n.t('sdms.simualation.최고 압력')}
                                tooltip={tip(0, 20)}
                                value={this.state.pBufMax1}
                                min={0}
                                max={20}
                                onChange={(v) => this.handleFieldChange("pBufMax1", v)}
                            />
                            <TextField
                                id="sim_pBuf_RC1"
                                label="P_Buf_RC1"
                                unit="(MPa)"
                                placeholder={i18n.t('sdms.simualation.재충전 압력')}
                                tooltip={tip(0, 20)}
                                value={this.state.pBuf_RC1}
                                min={0}
                                max={20}
                                onChange={(v) => this.handleFieldChange("pBuf_RC1", v)}
                            />
                        </ul>
                        <ul>
                            <TextField
                                id="sim_pBuf_01"
                                label="P_Buf_01"
                                unit="(MPa)"
                                placeholder={i18n.t('sdms.simualation.초기 압력')}
                                tooltip={tip(0, 20)}
                                value={this.state.pBuf_01}
                                min={0}
                                max={20}
                                onChange={(v) => this.handleFieldChange("pBuf_01", v)}
                            />
                            <TextField
                                id="sim_pBufMin1"
                                label="P_BufMin1"
                                unit="(MPa)"
                                placeholder={i18n.t('sdms.simualation.최저 압력')}
                                tooltip={tip(0, 20)}
                                value={this.state.pBufMin1}
                                min={0}
                                max={20}
                                onChange={(v) => this.handleFieldChange("pBufMin1", v)}
                            />
                        </ul>
                    </>
                );

            // 3) 컴프레서 (Compressor)
            case S.compressor:
                return (
                    <>
                        <ul>
                            <TextField
                                id="sim_nMCp"
                                label="N_MCp"
                                unit="(ea)"
                                placeholder={i18n.t('sdms.simualation.수량')}
                                tooltip={tip(1, 1)}
                                value={this.state.nMCp}
                                min={1}
                                max={9}
                                onChange={(v) => this.handleFieldChange("nMCp", v)}
                            />
                            <TextField
                                id="sim_pCpInMaxM"
                                label="P_CpInMaxM"
                                unit="(MPa)"
                                placeholder={i18n.t('sdms.simualation.압력 상한')}
                                tooltip={tip(0, 93)}
                                value={this.state.pCpInMaxM}
                                min={0}
                                max={93}
                                onChange={(v) => this.handleFieldChange("pCpInMaxM", v)}
                            />
                        </ul>
                        <ul>
                            <TextField
                                id="sim_pCpInMinM"
                                label="P_CpInMinM"
                                unit="(MPa)"
                                placeholder={i18n.t('sdms.simualation.압력 하한')}
                                tooltip={tip(0, 93)}
                                value={this.state.pCpInMinM}
                                min={0}
                                max={93}
                                onChange={(v) => this.handleFieldChange("pCpInMinM", v)}
                            />
                            <TextField
                                id="sim_prefM"
                                label="P_refM"
                                unit="(MPa)"
                                placeholder={i18n.t('sdms.simualation.압력')}
                                tooltip={tip(0, 100)}
                                value={this.state.prefM}
                                min={0}
                                max={100}
                                onChange={(v) => this.handleFieldChange("prefM", v)}
                            />
                        </ul>
                        <ul>
                            <TextField
                                id="sim_trefCM"
                                label="T_refCM"
                                unit="(℃)"
                                placeholder={i18n.t('sdms.simualation.온도')}
                                tooltip={tip(-273.15, 60)}
                                value={this.state.trefCM}
                                min={-273.15}
                                max={60}
                                onChange={(v) => this.handleFieldChange("trefCM", v)}
                            />
                            <TextField
                                id="sim_mCprefM"
                                label="m_Cp_refM"
                                unit="(kg/h)"
                                placeholder={i18n.t('sdms.simualation.용량')}
                                tooltip={tip(0, 99.9)}
                                value={this.state.mCprefM}
                                min={0}
                                max={99.9}
                                onChange={(v) => this.handleFieldChange("mCprefM", v)}
                            />
                        </ul>
                        <ul>
                            <TextField
                                id="sim_spCpM"
                                label="Sp_CpM"
                                unit="(RPM)"
                                placeholder={i18n.t('sdms.simualation.속도')}
                                tooltip={tip(0, 999.9)}
                                value={this.state.spCpM}
                                min={0}
                                max={999.9}
                                onChange={(v) => this.handleFieldChange("spCpM", v)}
                            />
                            <TextField
                                id="sim_etaVM"
                                label="EtaVM"
                                unit=""
                                placeholder={i18n.t('sdms.simualation.용적 효율')}
                                tooltip={tip(0, 1)}
                                value={this.state.etaVM}
                                min={0}
                                max={1}
                                onChange={(v) => this.handleFieldChange("etaVM", v)}
                            />
                        </ul>
                        <ul>
                            <TextField
                                id="sim_etaCompM"
                                label="Eta_CompM"
                                unit=""
                                placeholder={i18n.t('sdms.simualation.단열 효율')}
                                tooltip={tip(0, 1)}
                                value={this.state.eta_CompM}
                                min={0}
                                max={1}
                                onChange={(v) => this.handleFieldChange("eta_CompM", v)}
                            />
                            <TextField
                                id="sim_etaMotorM"
                                label="Eta_motorM"
                                unit=""
                                placeholder={i18n.t('sdms.simualation.전동기 효율')}
                                tooltip={tip(0, 1)}
                                value={this.state.eta_motorM}
                                min={0}
                                max={1}
                                onChange={(v) => this.handleFieldChange("eta_motorM", v)}
                            />
                        </ul>
                        <ul>
                            <TextField
                                id="sim_tCoolSetCM"
                                label="T_CoolSetCM"
                                unit="(℃)"
                                placeholder={i18n.t('sdms.simualation.목표 온도')}
                                tooltip={tip(-273.15, 60)}
                                value={this.state.tCoolSetCM}
                                min={-273.15}
                                max={60}
                                onChange={(v) => this.handleFieldChange("tCoolSetCM", v)}
                            />
                            <TextField
                                id="sim_cOPM"
                                label="COPM"
                                unit=""
                                placeholder={i18n.t('sdms.simualation.성능 계수')}
                                tooltip={tip(2.5, 6)}
                                value={this.state.cOPM}
                                min={2.5}
                                max={6}
                                onChange={(v) => this.handleFieldChange("cOPM", v)}
                            />
                        </ul>
                    </>
                );

            // 4) 중압탱크 (Medium Pressure Bank)
            case S.mediumPressureTank:
                return (
                    <>
                        <ul>
                            <TextField
                                id="sim_vTkIndM"
                                label="V_TkIndM"
                                unit="(m3)"
                                placeholder={i18n.t('sdms.simualation.부피')}
                                tooltip={tip(0, 9)}
                                value={this.state.vTkIndM}
                                min={0}
                                max={9}
                                onChange={(v) => this.handleFieldChange("vTkIndM", v)}
                            />
                            <TextField
                                id="sim_nTkM"
                                label="N_TkM"
                                unit="(ea)"
                                placeholder={i18n.t('sdms.simualation.개수')}
                                tooltip={tip(0, 9)}
                                value={this.state.nTkM}
                                min={0}
                                max={9}
                                onChange={(v) => this.handleFieldChange("nTkM", v)}
                            />
                        </ul>
                        <ul>
                            <TextField
                                id="sim_pTkMaxM"
                                label="P_TkMaxM"
                                unit="(MPa)"
                                placeholder={i18n.t('sdms.simualation.최고 압력')}
                                tooltip={tip(0, 86)}
                                value={this.state.pTkMaxM}
                                min={0}
                                max={86}
                                onChange={(v) => this.handleFieldChange("pTkMaxM", v)}
                            />
                            <TextField
                                id="sim_pTkMinM"
                                label="P_TkMinM"
                                unit="(MPa)"
                                placeholder={i18n.t('sdms.simualation.최저 압력')}
                                tooltip={tip(0, 86)}
                                value={this.state.pTkMinM}
                                min={0}
                                max={86}
                                onChange={(v) => this.handleFieldChange("pTkMinM", v)}
                            />
                        </ul>
                        <ul>
                            <TextField
                                id="sim_fuMoOnM"
                                label="FuMoOnM"
                                unit=""
                                placeholder={i18n.t('sdms.simualation.연료모드 On/Off')}
                                tooltip={tip(0, 1)}
                                value={this.state.fuMoOnM}
                                min={0}
                                max={1}
                                onChange={(v) => this.handleFieldChange("fuMoOnM", v)}
                            />
                            <TextField
                                id="sim_tTk0CM"
                                label="T_Tk_0CM"
                                unit="(℃)"
                                placeholder={i18n.t('sdms.simualation.초기 온도')}
                                tooltip={tip(-273.15, 65)}
                                value={this.state.tTk0CM}
                                min={-273.15}
                                max={65}
                                onChange={(v) => this.handleFieldChange("tTk0CM", v)}
                            />
                        </ul>
                    </>
                );

            // 5) 고압탱크 (High Pressure Bank)
            case S.fiba:
                return (
                    <>
                        <ul>
                            <TextField
                                id="sim_vTkIndH"
                                label="V_TkIndH"
                                unit="(m3)"
                                placeholder={i18n.t('sdms.simualation.부피')}
                                tooltip={tip(0, 1)}
                                value={this.state.vTkIndH}
                                min={0}
                                max={1}
                                onChange={(v) => this.handleFieldChange("vTkIndH", v)}
                            />
                            <TextField
                                id="sim_nTkH"
                                label="N_TkH"
                                unit="(ea)"
                                placeholder={i18n.t('sdms.simualation.개수')}
                                tooltip={tip(1, 9)}
                                value={this.state.nTkH}
                                min={1}
                                max={9}
                                onChange={(v) => this.handleFieldChange("nTkH", v)}
                            />
                        </ul>
                        <ul>
                            <TextField
                                id="sim_pTkMaxH"
                                label="P_TkMaxH"
                                unit="(MPa)"
                                placeholder={i18n.t('sdms.simualation.최고 압력')}
                                tooltip={tip(0, 97)}
                                value={this.state.pTkMaxH}
                                min={0}
                                max={97}
                                onChange={(v) => this.handleFieldChange("pTkMaxH", v)}
                            />
                            <TextField
                                id="sim_pTkMinH"
                                label="P_TkMinH"
                                unit="(MPa)"
                                placeholder={i18n.t('sdms.simualation.최저 압력')}
                                tooltip={tip(0, 97)}
                                value={this.state.pTkMinH}
                                min={0}
                                max={97}
                                onChange={(v) => this.handleFieldChange("pTkMinH", v)}
                            />
                        </ul>
                        <ul>
                            <TextField
                                id="sim_tTk0CH"
                                label="T_Tk_0CH"
                                unit="(℃)"
                                placeholder={i18n.t('sdms.simualation.초기 온도')}
                                tooltip={tip(-273.15, 999)}
                                value={this.state.tTk0CH}
                                min={-273.15}
                                max={999}
                                onChange={(v) => this.handleFieldChange("tTk0CH", v)}
                            />
                            <li />
                        </ul>
                    </>
                );

            // 6) 디스펜서1
            case S.dispenser1:
                return (
                    <>
                        <ul>
                            <TextField
                                id="sim_eADisp1"
                                label="EA_Disp1"
                                unit="(ea)"
                                placeholder={i18n.t('sdms.simualation.개수')}
                                tooltip={tip(1, 1)}
                                value={this.state.eADisp1}
                                min={1}
                                max={1}
                                onChange={(v) => this.handleFieldChange("eADisp1", v)}
                            />
                            <TextField
                                id="sim_pClass1"
                                label="P_Class1"
                                unit="(MPa)"
                                placeholder={i18n.t('sdms.simualation.압력 등급')}
                                tooltip={tip(35, 70)}
                                value={this.state.pClass1}
                                min={35}
                                max={70}
                                onChange={(v) => this.handleFieldChange("pClass1", v)}
                            />
                        </ul>
                        <ul>
                            <TextField
                                id="sim_tBaC1"
                                label="T_BaC1"
                                unit="(℃)"
                                placeholder={i18n.t('sdms.simualation.가스 온도')}
                                tooltip={tip(-273.15, 50)}
                                value={this.state.tBaC1}
                                min={-273.15}
                                max={50}
                                onChange={(v) => this.handleFieldChange("tBaC1", v)}
                            />
                            <TextField
                                id="sim_mHFPLim1"
                                label="m_HFPLim1"
                                unit="(g/s)"
                                placeholder={i18n.t('sdms.simualation.유량 상한')}
                                tooltip={tip(60, 60)}
                                value={this.state.mHFPLim1}
                                min={60}
                                max={60}
                                onChange={(v) => this.handleFieldChange("mHFPLim1", v)}
                            />
                        </ul>
                        <ul>
                            <TextField
                                id="sim_tBrkMax1"
                                label="t_BrkMax1"
                                unit="(s)"
                                placeholder={i18n.t('sdms.simualation.준비 시간')}
                                tooltip={tip(0, 999)}
                                value={this.state.tBrkMax1}
                                min={0}
                                max={999}
                                onChange={(v) => this.handleFieldChange("tBrkMax1", v)}
                            />
                            <TextField
                                id="sim_hFPMode1"
                                label="HFPMode1"
                                unit=""
                                placeholder={i18n.t('sdms.simualation.모드')}
                                tooltip={tip(1, 3)}
                                value={this.state.hFPMode1}
                                min={1}
                                max={3}
                                onChange={(v) => this.handleFieldChange("hFPMode1", v)}
                            />
                        </ul>
                        <ul>
                            <TextField
                                id="sim_comOn1"
                                label="ComOn1"
                                unit=""
                                placeholder="ON/OFF"
                                tooltip={tip(0, 1)}
                                value={this.state.comOn1}
                                min={0}
                                max={1}
                                onChange={(v) => this.handleFieldChange("comOn1", v)}
                            />
                            <li />
                        </ul>
                    </>
                );

            // 7) 승용차 (Vehicle1)
            case S.vehicle1:
                return (
                    <>
                        <ul>
                            <TextField
                                id="sim_vTkMode1"
                                label="V_TkMode1"
                                unit=""
                                placeholder={i18n.t('sdms.simualation.모드')}
                                tooltip={tip(11, 12)}
                                value={this.state.vTkMode1}
                                min={0}
                                max={12}
                                onChange={(v) => this.handleFieldChange("vTkMode1", v)}
                            />
                            <TextField
                                id="sim_tVL1"
                                label="TVL1"
                                unit="(L)"
                                placeholder={i18n.t('sdms.simualation.최대용기부피')}
                                tooltip={tip(0, 875)}
                                value={this.state.tVL1}
                                min={0}
                                max={875}
                                onChange={(v) => this.handleFieldChange("tVL1", v)}
                            />
                        </ul>
                        <ul>
                            <TextField
                                id="sim_tV1"
                                label="TV1"
                                unit="(L)"
                                placeholder={i18n.t('sdms.simualation.용기 부피')}
                                tooltip={tip(0, 875)}
                                value={this.state.tV1}
                                min={0}
                                max={875}
                                onChange={(v) => this.handleFieldChange("tV1", v)}
                            />
                            <TextField
                                id="sim_pTk01"
                                label="P_Tk_01"
                                unit="(MPa)"
                                placeholder={i18n.t('sdms.simualation.초기 압력')}
                                tooltip={tip(0, 87.5)}
                                value={this.state.pTk01}
                                min={0}
                                max={87.5}
                                onChange={(v) => this.handleFieldChange("pTk01", v)}
                            />
                        </ul>
                        <ul>
                            <TextField
                                id="sim_sOCG1"
                                label="SOC_G1"
                                unit="(%)"
                                placeholder={i18n.t('sdms.simualation.충전 목표')}
                                tooltip={tip(0, 100)}
                                value={this.state.sOCG1}
                                min={0}
                                max={100}
                                onChange={(v) => this.handleFieldChange("sOCG1", v)}
                            />
                            <TextField
                                id="sim_tTk0C1"
                                label="T_Tk_0C1"
                                unit="(℃)"
                                placeholder={i18n.t('sdms.simualation.초기 온도')}
                                tooltip={tip(-273.15, 999)}
                                value={this.state.tTk0C1}
                                min={-273.15}
                                max={999}
                                onChange={(v) => this.handleFieldChange("tTk0C1", v)}
                            />
                        </ul>
                    </>
                );

            // 8) 디스펜서2
            case S.dispenser2:
                return (
                    <>
                        <ul>
                            <TextField
                                id="sim_eADisp2"
                                label="EA_Disp2"
                                unit="(ea)"
                                placeholder={i18n.t('sdms.simualation.개수')}
                                tooltip={tip(1, 1)}
                                value={this.state.eADisp2}
                                min={1}
                                max={1}
                                onChange={(v) => this.handleFieldChange("eADisp2", v)}
                            />
                            <TextField
                                id="sim_pClass2"
                                label="P_Class2"
                                unit="(MPa)"
                                placeholder={i18n.t('sdms.simualation.압력 등급')}
                                tooltip={tip(35, 70)}
                                value={this.state.pClass2}
                                min={35}
                                max={70}
                                onChange={(v) => this.handleFieldChange("pClass2", v)}
                            />
                        </ul>
                        <ul>
                            <TextField
                                id="sim_tBaC2"
                                label="T_BaC2"
                                unit="(℃)"
                                placeholder={i18n.t('sdms.simualation.가스 온도')}
                                tooltip={tip(-273.15, 50)}
                                value={this.state.tBaC2}
                                min={-273.15}
                                max={50}
                                onChange={(v) => this.handleFieldChange("tBaC2", v)}
                            />
                            <TextField
                                id="sim_mHFPLim2"
                                label="m_HFPLim2"
                                unit="(g/s)"
                                placeholder={i18n.t('sdms.simualation.유량 상한')}
                                tooltip={tip(60, 60)}
                                value={this.state.mHFPLim2}
                                min={60}
                                max={60}
                                onChange={(v) => this.handleFieldChange("mHFPLim2", v)}
                            />
                        </ul>
                        <ul>
                            <TextField
                                id="sim_tBrkMax2"
                                label="t_BrkMax2"
                                unit="(s)"
                                placeholder={i18n.t('sdms.simualation.준비 시간')}
                                tooltip={tip(0, 999)}
                                value={this.state.tBrkMax2}
                                min={0}
                                max={999}
                                onChange={(v) => this.handleFieldChange("tBrkMax2", v)}
                            />
                            <TextField
                                id="sim_hFPMode2"
                                label="HFPMode2"
                                unit=""
                                placeholder={i18n.t('sdms.simualation.모드')}
                                tooltip={tip(1, 3)}
                                value={this.state.hFPMode2}
                                min={1}
                                max={3}
                                onChange={(v) => this.handleFieldChange("hFPMode2", v)}
                            />
                        </ul>
                        <ul>
                            <TextField
                                id="sim_comOn2"
                                label="ComOn2"
                                unit=""
                                placeholder="ON/OFF"
                                tooltip={tip(0, 1)}
                                value={this.state.comOn2}
                                min={0}
                                max={1}
                                onChange={(v) => this.handleFieldChange("comOn2", v)}
                            />
                            <li />
                        </ul>
                    </>
                );

            // 9) 지게차 (Vehicle2)
            case S.vehicle2:
                return (
                    <>
                        <ul>
                            <TextField
                                id="sim_vTkMode2"
                                label="V_TkMode2"
                                unit=""
                                placeholder={i18n.t('sdms.simualation.모드')}
                                tooltip={tip(11, 12)}
                                value={this.state.vTkMode2}
                                min={0}
                                max={12}
                                onChange={(v) => this.handleFieldChange("vTkMode2", v)}
                            />
                            <TextField
                                id="sim_tVL2"
                                label="TVL2"
                                unit="(L)"
                                placeholder={i18n.t('sdms.simualation.최대용기부피')}
                                tooltip={tip(0, 875)}
                                value={this.state.tVL2}
                                min={0}
                                max={875}
                                onChange={(v) => this.handleFieldChange("tVL2", v)}
                            />
                        </ul>
                        <ul>
                            <TextField
                                id="sim_tV2"
                                label="TV2"
                                unit="(L)"
                                placeholder={i18n.t('sdms.simualation.용기 부피')}
                                tooltip={tip(0, 875)}
                                value={this.state.tV2}
                                min={0}
                                max={875}
                                onChange={(v) => this.handleFieldChange("tV2", v)}
                            />
                            <TextField
                                id="sim_pTk02"
                                label="P_Tk_02"
                                unit="(MPa)"
                                placeholder={i18n.t('sdms.simualation.초기 압력')}
                                tooltip={tip(0, 87.5)}
                                value={this.state.pTk02}
                                min={0}
                                max={87.5}
                                onChange={(v) => this.handleFieldChange("pTk02", v)}
                            />
                        </ul>
                        <ul>
                            <TextField
                                id="sim_sOCG2"
                                label="SOC_G2"
                                unit="(%)"
                                placeholder={i18n.t('sdms.simualation.충전 목표')}
                                tooltip={tip(0, 100)}
                                value={this.state.sOCG2}
                                min={0}
                                max={100}
                                onChange={(v) => this.handleFieldChange("sOCG2", v)}
                            />
                            <TextField
                                id="sim_tTk0C2"
                                label="T_Tk_0C2"
                                unit="(℃)"
                                placeholder={i18n.t('sdms.simualation.초기 온도')}
                                tooltip={tip(-273.15, 999)}
                                value={this.state.tTk0C2}
                                min={-273.15}
                                max={999}
                                onChange={(v) => this.handleFieldChange("tTk0C2", v)}
                            />
                        </ul>
                    </>
                );

            default:
                return null;
        }
    };

    // 문자열을 숫자 또는 null로 변환
    numOrNull = (v) => {
        if (v === "" || v === "-" || v === "." || v === "-.") return null;
        const n = Number(v);
        return Number.isNaN(n) ? null : n;
    };

    buildPayload = () => {
        const S = SdmsResource.simulationFacilityType;

        const {
            selectedFacilityType,
            // 기본값
            tAmbC, pHBk0, d2On, contOn, tPreRun, tPreSet1, tPreSet2, compMod,
            // 전기분해기
            nSource, pSource, tSourceC, mSource,
            // 저압탱크
            vBufInd1, nBuf1, pBufMax1, pBuf_RC1, pBuf_01, pBufMin1,
            // 컴프레서
            nMCp, pCpInMaxM, pCpInMinM, prefM, trefCM, mCprefM, spCpM,
            etaVM, eta_CompM, eta_motorM, tCoolSetCM, cOPM,
            // 중압탱크
            vTkIndM, nTkM, pTkMaxM, pTkMinM, fuMoOnM, tTk0CM,
            // 고압탱크
            vTkIndH, nTkH, pTkMaxH, pTkMinH, tTk0CH,
            // 디스펜서1
            eADisp1, pClass1, tBaC1, mHFPLim1, tBrkMax1, hFPMode1, comOn1,
            // 승용차
            vTkMode1, tVL1, tV1, pTk01, sOCG1, tTk0C1,
            // 디스펜서2
            eADisp2, pClass2, tBaC2, mHFPLim2, tBrkMax2, hFPMode2, comOn2,
            // 지게차
            vTkMode2, tVL2, tV2, pTk02, sOCG2, tTk0C2,
        } = this.state;

        // 1) 모든 키를 null로 초기화
        const data = {
            t_AmbC: null, p_HBk_0: null, d2On: null, contOn: null, t_PreRun: null, t_PreSet1: null, t_PreSet2: null, compMod: null,
            n_Source: null, p_Source: null, t_SourceC: null, m_Source: null,
            v_BufInd1: null, n_Buf1: null, p_BufMax1: null, p_Buf_RC1: null, p_Buf_01: null, p_BufMin1: null,
            n_MCp: null, p_CpInMaxM: null, p_CpInMinM: null, p_refM: null, t_refCM: null, m_Cp_refM: null, sp_CpM: null,
            etaVM: null, eta_CompM: null, eta_motorM: null, t_CoolSetCM: null, copm: null,
            v_TkIndM: null, n_TkM: null, p_TkMaxM: null, p_TkMinM: null, fuMoOnM: null, t_Tk_0CM: null,
            v_TkIndH: null, n_TkH: null, p_TkMaxH: null, p_TkMinH: null, t_Tk_0CH: null,
            eA_Disp1: null, p_Class1: null, t_BaC1: null, m_HFPLim1: null, t_BrkMax1: null, hfpMode1: null, comOn1: null,
            v_TkMode1: null, tvL1: null, tV1: null, p_Tk_01: null, soC_G1: null, t_Tk_0C1: null,
            eA_Disp2: null, p_Class2: null, t_BaC2: null, m_HFPLim2: null, t_BrkMax2: null, hfpMode2: null, comOn2: null,
            v_TkMode2: null, tvL2: null, tV2: null, p_Tk_02: null, soC_G2: null, t_Tk_0C2: null,
        };

        // 2) 기본값 설정 필드 -> 항상 포함
        data.t_AmbC    = this.numOrNull(tAmbC);
        data.p_HBk_0   = this.numOrNull(pHBk0);
        data.d2On      = this.numOrNull(d2On);
        data.contOn    = this.numOrNull(contOn);
        data.t_PreRun  = this.numOrNull(tPreRun);
        data.t_PreSet1 = this.numOrNull(tPreSet1);
        data.t_PreSet2 = this.numOrNull(tPreSet2);
        data.compMod   = this.numOrNull(compMod);

        // 3) 선택된 설비유형의 전용 필드만 값 채우기
        switch (selectedFacilityType) {
            case S.electrolysis:
                data.n_Source  = this.numOrNull(nSource);
                data.p_Source  = this.numOrNull(pSource);
                data.t_SourceC = this.numOrNull(tSourceC);
                data.m_Source  = this.numOrNull(mSource);
                break;
            case S.calvera: // 저압탱크
                data.v_BufInd1 = this.numOrNull(vBufInd1);
                data.n_Buf1    = this.numOrNull(nBuf1);
                data.p_BufMax1 = this.numOrNull(pBufMax1);
                data.p_Buf_RC1 = this.numOrNull(pBuf_RC1);
                data.p_Buf_01  = this.numOrNull(pBuf_01);
                data.p_BufMin1 = this.numOrNull(pBufMin1);
                break;
            case S.compressor:
                data.n_MCp      = this.numOrNull(nMCp);
                data.p_CpInMaxM = this.numOrNull(pCpInMaxM);
                data.p_CpInMinM = this.numOrNull(pCpInMinM);
                data.p_refM     = this.numOrNull(prefM);
                data.t_refCM    = this.numOrNull(trefCM);
                data.m_Cp_refM  = this.numOrNull(mCprefM);
                data.sp_CpM     = this.numOrNull(spCpM);
                data.etaVM      = this.numOrNull(etaVM);
                data.eta_CompM  = this.numOrNull(eta_CompM);
                data.eta_motorM = this.numOrNull(eta_motorM);
                data.t_CoolSetCM= this.numOrNull(tCoolSetCM);
                data.copm       = this.numOrNull(cOPM);
                break;
            case S.mediumPressureTank:
                data.v_TkIndM  = this.numOrNull(vTkIndM);
                data.n_TkM     = this.numOrNull(nTkM);
                data.p_TkMaxM  = this.numOrNull(pTkMaxM);
                data.p_TkMinM  = this.numOrNull(pTkMinM);
                data.fuMoOnM   = this.numOrNull(fuMoOnM);
                data.t_Tk_0CM  = this.numOrNull(tTk0CM);
                break;
            case S.fiba: // 고압탱크
                data.v_TkIndH  = this.numOrNull(vTkIndH);
                data.n_TkH     = this.numOrNull(nTkH);
                data.p_TkMaxH  = this.numOrNull(pTkMaxH);
                data.p_TkMinH  = this.numOrNull(pTkMinH);
                data.t_Tk_0CH  = this.numOrNull(tTk0CH);
                break;
            case S.dispenser1:
                data.eA_Disp1  = this.numOrNull(eADisp1);
                data.p_Class1  = this.numOrNull(pClass1);
                data.t_BaC1    = this.numOrNull(tBaC1);
                data.m_HFPLim1 = this.numOrNull(mHFPLim1);
                data.t_BrkMax1 = this.numOrNull(tBrkMax1);
                data.hfpMode1  = this.numOrNull(hFPMode1);
                data.comOn1    = this.numOrNull(comOn1);
                break;
            case S.vehicle1:
                data.v_TkMode1 = this.numOrNull(vTkMode1);
                data.tvL1      = this.numOrNull(tVL1);
                data.tV1       = this.numOrNull(tV1);
                data.p_Tk_01   = this.numOrNull(pTk01);
                data.soC_G1    = this.numOrNull(sOCG1);
                data.t_Tk_0C1  = this.numOrNull(tTk0C1);
                break;
            case S.dispenser2:
                data.eA_Disp2  = this.numOrNull(eADisp2);
                data.p_Class2  = this.numOrNull(pClass2);
                data.t_BaC2    = this.numOrNull(tBaC2);
                data.m_HFPLim2 = this.numOrNull(mHFPLim2);
                data.t_BrkMax2 = this.numOrNull(tBrkMax2);
                data.hfpMode2  = this.numOrNull(hFPMode2);
                data.comOn2    = this.numOrNull(comOn2);
                break;
            case S.vehicle2:
                data.v_TkMode2 = this.numOrNull(vTkMode2);
                data.tvL2      = this.numOrNull(tVL2);
                data.tV2       = this.numOrNull(tV2);
                data.p_Tk_02   = this.numOrNull(pTk02);
                data.soC_G2    = this.numOrNull(sOCG2);
                data.t_Tk_0C2  = this.numOrNull(tTk0C2);
                break;
            default:
                break;
        }

        return data;
    };

    handleRun = async () => {
        const { selectedFacilityType } = this.state;

        if (!selectedFacilityType) {
            this.props.showConfirmDialog(i18n.t('common.오류'), [i18n.t('sdms.simualation.설비 유형을 선택하세요')], null, null);
            return;
        }

        this.setState({ isLoading: true });

        try {
            const payload = this.buildPayload();
            const res = await SDMSController.requestSimulationData(payload);

            if (!res) {
                this.setState({ simResult: null, simError: true, series: [] });
                this.props.showConfirmDialog(i18n.t('common.오류'), [i18n.t('sdms.simualation.실행 요청에 실패하였습니다')], null, null);
                return;
            }

            const [result, message] = res;
            if (!result) {
                this.setState({ simResult: null, simError: true, series: [] });
                this.props.showConfirmDialog(i18n.t('common.오류'), [message || i18n.t('sdms.simualation.실행 요청에 실패하였습니다')], null, null);
                return;
            }

            const series = collectSeriesFromResult(result);

            // 첫 표시용 기본 그룹 결정: 해당 그룹에 매칭되는 시리즈가 있는 첫 그룹
            const firstGroup = Object.keys(GROUP_SERIES).find(g =>
                series.some(s => GROUP_SERIES[g].includes(s.keyLower))
            ) || '';

            this.setState({
                simResult: result,
                simError: series.length === 0,
                series,
                selectedGroup: firstGroup
            });

            if (series.length === 0) {
                this.props.showConfirmDialog(i18n.t('common.알림'), [i18n.t('sdms.simualation.values를 가진 시계열 데이터가 없어 차트를 그릴 수 없습니다')], null, null);
            }
        } finally {
            this.setState({ isLoading: false });
        }
    };

    handleReset = () => {
        this.setState(this.getInitialState());
    };

    handleDownload = async () => {
        try {
            const node = this.chartWrapRef?.current;
            if (!node) return;

            // 1) 기존 스타일/스크롤 상태 저장
            const prev = {
                height: node.style.height,
                maxHeight: node.style.maxHeight,
                overflow: node.style.overflow
            };
            const prevScrollX = window.scrollX;
            const prevScrollY = window.scrollY;

            // 2) 전체 콘텐츠가 보이도록 잠시 확장
            const fullWidth = node.scrollWidth;
            const fullHeight = node.scrollHeight;

            node.style.height = `${fullHeight}px`;
            node.style.maxHeight = 'none';
            node.style.overflow = 'visible';

            // 3) html2canvas에 전체 크기 지정
            const canvas = await html2canvas(node, {
                backgroundColor: '#111',
                scale: Math.min(2, window.devicePixelRatio || 1),
                useCORS: true,
                width: fullWidth,
                height: fullHeight,
                windowWidth: fullWidth,
                windowHeight: fullHeight,
                scrollX: 0,
                scrollY: 0
            });

            // 4) 저장
            const dataUrl = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            const ts = new Date();
            const pad = (n) => String(n).padStart(2, '0');
            const fileName =
                `simulation_result_${ts.getFullYear()}${pad(ts.getMonth()+1)}${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}.png`;

            a.href = dataUrl;
            a.download = fileName;
            a.click();

            // 5) 원상 복구
            node.style.height = prev.height;
            node.style.maxHeight = prev.maxHeight;
            node.style.overflow = prev.overflow;
            window.scrollTo(prevScrollX, prevScrollY);
        } catch (e) {
            this.props.showConfirmDialog(i18n.t('common.오류'), [i18n.t('sdms.simualation.이미지 저장에 실패했습니다')], null, null);
        }
    };

    handleGroupChange = (e) => {
        this.setState({ selectedGroup: e.target.value });
    };

    render() {
        const { selectedFacilityType, simError, series, simResult, isLoading } = this.state;

        const keysInGroup = GROUP_SERIES[this.state.selectedGroup]?.map(k => k.toLowerCase()) || [];
        const visibleSeries = keysInGroup.length
            ? series.filter(s => keysInGroup.includes(s.keyLower))
            : series; // 그룹이 비어있으면 전체

        return (
            <ModalBackground>
                <SimulationInfoComponent id={this.props.popupType} className={'viewSimulationSection'}>
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
                                {i18n.t('sdms.simualation.시뮬레이션')}
                            </h5>
                            <a
                                className={'dslX'}
                                onClick={() => this.props.setVisiblePopups(SDMS.menu.simulationInfo, false)}
                            />
                        </div>

                        <div className="contents">
                            <div className='settingsWrap'>
                                <div>
                                    <div>
                                        <p>{i18n.t('sdms.simualation.기본값 설정')}</p>
                                        <ul>
                                            <TextField
                                                id="sim_tambc"
                                                label="T_AmbC"
                                                unit="(°C)"
                                                placeholder={i18n.t('sdms.simualation.대기 온도')}
                                                tooltip="Min:-40/Max:50"
                                                value={this.state.tAmbC}
                                                min={-40}
                                                max={50}
                                                onChange={(v) => this.handleFieldChange("tAmbC", v)}
                                            />
                                            <TextField
                                                id="sim_phbk0"
                                                label="P_HBk_0"
                                                unit="(MPa)"
                                                placeholder={i18n.t('sdms.simualation.초기 압력')}
                                                tooltip="Min:0/Max:97"
                                                value={this.state.pHBk0}
                                                min={0}
                                                max={97}
                                                onChange={(v) => this.handleFieldChange("pHBk0", v)}
                                            />
                                        </ul>
                                        <ul>
                                            <SelectField
                                                id="sim_d2on"
                                                label="D2On"
                                                tooltip="Min:0/Max:1"
                                                options={[
                                                    { value: "0", label: `0(${i18n.t('sdms.simualation.미적용')})` },
                                                    { value: "1", label: `1(${i18n.t('sdms.simualation.적용')})` },
                                                ]}
                                                value={this.state.d2On}
                                                onChange={(v) => this.setState({ d2On: v })}
                                            />
                                            <SelectField
                                                id="sim_conton"
                                                label="ContOn"
                                                tooltip="Min:0/Max:1"
                                                options={[
                                                    { value: "0", label: `0(${i18n.t('sdms.simualation.미적용')})` },
                                                    { value: "1", label: `1(${i18n.t('sdms.simualation.적용')})` },
                                                ]}
                                                value={this.state.contOn}
                                                onChange={(v) => this.setState({ contOn: v })}
                                            />
                                        </ul>
                                        <ul>
                                            <TextField
                                                id="sim_tprerun"
                                                label="t_PreRun"
                                                unit="(min)"
                                                placeholder={i18n.t('sdms.simualation.충전 시간')}
                                                tooltip="Min:0/Max:1800"
                                                value={this.state.tPreRun}
                                                min={0}
                                                max={1800}
                                                onChange={(v) => this.handleFieldChange("tPreRun", v)}
                                            />
                                            <TextField
                                                id="sim_tpreset1"
                                                label="t_PreSet1"
                                                unit="(s)"
                                                placeholder={i18n.t('sdms.simualation.설정 시간')}
                                                tooltip="Min:0/Max:1800"
                                                value={this.state.tPreSet1}
                                                min={0}
                                                max={1800}
                                                onChange={(v) => this.handleFieldChange("tPreSet1", v)}
                                            />
                                        </ul>
                                        <ul>
                                            <TextField
                                                id="sim_tpreset2"
                                                label="t_PreSet2"
                                                unit="(s)"
                                                placeholder={i18n.t('sdms.simualation.설정 시간')}
                                                tooltip="Min:0/Max:1800"
                                                value={this.state.tPreSet2}
                                                min={0}
                                                max={1800}
                                                onChange={(v) => this.handleFieldChange("tPreSet2", v)}
                                            />
                                            <SelectField
                                                id="sim_compMod"
                                                label="CompMod"
                                                tooltip="Min:1/Max:2"
                                                options={[
                                                    { value: "1", label: `1(${i18n.t('sdms.simualation.cp충전스텝')})` },
                                                    { value: "2", label: `2(${i18n.t('sdms.simualation.bK압력')})` },
                                                ]}
                                                value={this.state.compMod}
                                                onChange={(v) => this.setState({ compMod: v })}
                                            />
                                        </ul>
                                    </div>
                                    <div>
                                        <p>{i18n.t('sdms.simualation.세부 설정')}</p>
                                        <div className='selectWrap'>
                                            <span>{i18n.t('sdms.simualation.설비 유형')}</span>
                                            <select
                                                value={selectedFacilityType || ""}
                                                onChange={(v) => this.setState({ selectedFacilityType: v.target.value })}
                                            >
                                                <option value="">{i18n.t('sdms.simualation.설비유형 선택')}</option>
                                                <option value={SdmsResource.simulationFacilityType.electrolysis}>{i18n.t('sdms.simualation.전기분해기')}</option>
                                                <option value={SdmsResource.simulationFacilityType.calvera}>{i18n.t('sdms.simualation.저압탱크')}</option>
                                                <option value={SdmsResource.simulationFacilityType.compressor}>{i18n.t('sdms.simualation.컴프레서')}</option>
                                                <option value={SdmsResource.simulationFacilityType.mediumPressureTank}>{i18n.t('sdms.simualation.중압탱크')}</option>
                                                <option value={SdmsResource.simulationFacilityType.fiba}>{i18n.t('sdms.simualation.고압탱크')}</option>
                                                <option value={SdmsResource.simulationFacilityType.dispenser1}>{i18n.t('sdms.simualation.디스펜서1')}</option>
                                                <option value={SdmsResource.simulationFacilityType.vehicle1}>{i18n.t('sdms.simualation.승용차')}</option>
                                                <option value={SdmsResource.simulationFacilityType.dispenser2}>{i18n.t('sdms.simualation.디스펜서2')}</option>
                                                <option value={SdmsResource.simulationFacilityType.vehicle2}>{i18n.t('sdms.simualation.지게차')}</option>
                                            </select>
                                        </div>
                                        {this.getFacilityTypeFields()}
                                    </div>
                                </div>
                                <div className='btnWrap'>
                                    <button type='button' className='reset' onClick={this.handleReset}>{i18n.t('sdms.simualation.초기화')}</button>
                                    <button type='button' className='confirm' onClick={this.handleRun}>{i18n.t('sdms.simualation.실행')}</button>
                                </div>
                            </div>

                            <div className='resultWrap'>
                                <p>{i18n.t('sdms.simualation.시뮬레이션 결과')}</p>
                                {isLoading ? (
                                    <div className='loading'>
                                        <Loader />
                                        <span>Loading...</span>
                                        <span>{i18n.t('sdms.simualation.정보를 불러오고 있어요 잠시만 기다려 주세요')}</span>
                                    </div>
                                ) : simError ? (
                                    <div className='emptyResult'>
                                        <img src={simulationInfoIcon} alt='결과없음 아이콘' />
                                            <span>{i18n.t('sdms.simualation.시뮬레이션 결과가 없어요')}</span>
                                            <span>{i18n.t('sdms.simualation.입력값 설정 후 시뮬레이션을 실행해주세요')}</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className='headWrap'>
                                            <div className='selectWrap'>
                                                <span>{i18n.t('sdms.simualation.설비 유형')}</span>
                                                <select
                                                    value={this.state.selectedGroup}
                                                    onChange={this.handleGroupChange}
                                                >
                                                    {Object.keys(GROUP_SERIES).map(g => (
                                                        <option key={g} value={g}>
                                                            {i18n.t(GROUP_LABEL[g])}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <button onClick={this.handleDownload}>{i18n.t('sdms.simualation.결과 다운로드')}</button>
                                        </div>
                                        <div className='chartWrap' ref={this.chartWrapRef}>
                                            {visibleSeries.map((s) => {
                                                const node = simResult?.[s.key]; // 원본 result의 해당 시리즈 노드
                                                const t = node && typeof node === 'object'
                                                    ? { hh: node.hh, h: node.h, l: node.l, ll: node.ll }
                                                    : null;
                                                const hasThresholds = t && [t.hh, t.h, t.l, t.ll].some(v => typeof v === 'number');

                                                let _sensorData = s?.sensorData;
                                                if (s?.key === "t_Buf1" && Array.isArray(_sensorData)) {
                                                    // 켈빈(K) → 섭씨(℃) 변환: 배열의 각 원소마다 273.15를 뺀다
                                                    _sensorData = _sensorData.map(v => v - 273.15);
                                                }

                                                return (
                                                    <div key={s.key}>
                                                        <span className='title'>{s.title}</span>
                                                        <LineChart
                                                            typeName={s.title}
                                                            maxCount={70}
                                                            unit={s.unit}
                                                            labels={s.labels}
                                                            sensorData={_sensorData}
                                                            thresholds={
                                                                hasThresholds
                                                                ? { ...t, max: node.max, min: node.min }
                                                                : null
                                                            }
                                                        />
                                                    </div>
                                                );
                                            })}

                                            <div className='chargeInfo'>
                                                <span className='title'>{i18n.t('sdms.simualation.차량 요약정보')}</span>
                                                <ul>
                                                    <li>
                                                        <span>{i18n.t('sdms.simualation.충전온도')}</span>
                                                        <div>
                                                            <span>{typeof simResult?.chargeTemp === 'number' ? simResult.chargeTemp.toFixed(1) : '-'}</span>
                                                            <span>(℃)</span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <span>{i18n.t('sdms.simualation.충전압력')}</span>
                                                        <div>
                                                            <span>{typeof simResult?.chargePressure === 'number' ? simResult.chargePressure.toFixed(1) : '-'}</span>
                                                            <span>(MPa)</span>
                                                        </div>
                                                    </li>
                                                </ul>
                                                <ul>
                                                    <li>
                                                        <span>{i18n.t('sdms.simualation.충전율')}</span>
                                                        <div>
                                                            <span>{typeof simResult?.chargeRate === 'number' ? simResult.chargeRate.toFixed(1) : '-'}</span>
                                                            <span>(%)</span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <span>{i18n.t('sdms.simualation.충전시간')}</span>
                                                        <div>
                                                            <span>{typeof simResult?.chargeTime === 'number' ? simResult.chargeTime.toFixed(1) : '-'}</span>
                                                            <span>(s)</span>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </PopupDraggable>
                </SimulationInfoComponent>
            </ModalBackground>
        );
    }
}

export default withTranslation()(SimulationInfo);