import React, { Component } from 'react';
import $ from 'jquery';
import SdmsResource from '../../resource/id';
import PopupDraggable from './popupDraggable';
import SettingsStore from '../../../Settings/settingsStore';
import SDMS from '../sdms';

import { AnalysisInfoComponent } from '../../../SDMS/styled/sdmsPopupsStyled';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';
import { ModalBackground } from '../../../Root/styled/variables';

import Tube_Trailer from '../../img/popup/analysisImg/Tube_Trailer.png';
import car from '../../img/popup/analysisImg/car.png';
import forklift from '../../img/popup/analysisImg/forklift.png';
import Electrolyzer from '../../img/popup/analysisImg/Electrolyzer.png';
import air_Compressor from '../../img/popup/analysisImg/air_Compressor.png';
import Dispenser from '../../img/popup/analysisImg/Dispenser.png';
import cooling_unit from '../../img/popup/analysisImg/cooling_unit.png';
import fiba from '../../img/popup/analysisImg/fiba.png';
import Calvera from '../../img/popup/analysisImg/Calvera.png';
import pipe from '../../img/popup/analysisImg/pipe.png';
import Pre_comp from '../../img/popup/analysisImg/Pre-comp.webm';
import node_1 from '../../img/popup/analysisImg/nodes/node_1.png';
import node_2 from '../../img/popup/analysisImg/nodes/node_2.png';
import node_3_1 from '../../img/popup/analysisImg/nodes/node_3_1.png';
import node_3_2 from '../../img/popup/analysisImg/nodes/node_3_2.png';
import node_3_3 from '../../img/popup/analysisImg/nodes/node_3_3.png';
import node_4 from '../../img/popup/analysisImg/nodes/node_4.png';
import node_5 from '../../img/popup/analysisImg/nodes/node_5.png';
import node_6_1 from '../../img/popup/analysisImg/nodes/node_6_1.png';
import node_6_2 from '../../img/popup/analysisImg/nodes/node_6_2.png';
import node_6_3 from '../../img/popup/analysisImg/nodes/node_6_3.png';
import node_7 from '../../img/popup/analysisImg/nodes/node_7.png';
import node_8 from '../../img/popup/analysisImg/nodes/node_8.png';
import node_9 from '../../img/popup/analysisImg/nodes/node_9.png';
import node_10 from '../../img/popup/analysisImg/nodes/node_10.png';
import node_obj from '../../img/popup/analysisImg/nodes/node_obj.png';
import node_1_off from '../../img/popup/analysisImg/nodes/node_1_off.png';
import node_2_off from '../../img/popup/analysisImg/nodes/node_2_off.png';
import node_3_1_off from '../../img/popup/analysisImg/nodes/node_3_1_off.png';
import node_3_2_off from '../../img/popup/analysisImg/nodes/node_3_2_off.png';
import node_3_3_off from '../../img/popup/analysisImg/nodes/node_3_3_off.png';
import node_4_off from '../../img/popup/analysisImg/nodes/node_4_off.png';
import node_5_off from '../../img/popup/analysisImg/nodes/node_5_off.png';
import node_6_1_off from '../../img/popup/analysisImg/nodes/node_6_1_off.png';
import node_6_2_off from '../../img/popup/analysisImg/nodes/node_6_2_off.png';
import node_6_3_off from '../../img/popup/analysisImg/nodes/node_6_3_off.png';
import node_7_off from '../../img/popup/analysisImg/nodes/node_7_off.png';
import node_8_off from '../../img/popup/analysisImg/nodes/node_8_off.png';
import node_9_off from '../../img/popup/analysisImg/nodes/node_9_off.png';
import node_10_off from '../../img/popup/analysisImg/nodes/node_10_off.png';
import node_obj_off from '../../img/popup/analysisImg/nodes/node_obj_off.png';

import { SDMSController } from '../../services/sdmsController';
import simulationInfoIcon from '../../img/popup/simulationInfoIcon.svg';

const NODE_IMAGES = {
    node1: { on: node_1, off: node_1_off },
    node2: { on: node_2, off: node_2_off },
    node3_1: { on: node_3_1, off: node_3_1_off },
    node3_2: { on: node_3_2, off: node_3_2_off },
    node3_3: { on: node_3_3, off: node_3_3_off },
    node4: { on: node_4, off: node_4_off },
    node5: { on: node_5, off: node_5_off },
    node6_1: { on: node_6_1, off: node_6_1_off },
    node6_2: { on: node_6_2, off: node_6_2_off },
    node6_3: { on: node_6_3, off: node_6_3_off },
    node7: { on: node_7, off: node_7_off },
    node8: { on: node_8, off: node_8_off },
    node9: { on: node_9, off: node_9_off },
    node10: { on: node_10, off: node_10_off },
    nodeObj: { on: node_obj, off: node_obj_off }
};

export const FACILITY_TAGS = [
    { key: "m_compressor", i18nKey: 'sdms.analysisInfo.중압 압축기' },
    { key: "h_compressor", i18nKey: 'sdms.analysisInfo.고압 압축기' },
    { key: "coolingUnit", i18nKey: 'sdms.analysisInfo.냉각기' },
    { key: "fiba1", i18nKey: 'sdms.analysisInfo.고압탱크1' },
    { key: "fiba2", i18nKey: 'sdms.analysisInfo.고압탱크2' },
    { key: "fiba3", i18nKey: 'sdms.analysisInfo.고압탱크3' },
    { key: "calvera1", i18nKey: 'sdms.analysisInfo.저압탱크1' },
    { key: "calvera2", i18nKey: 'sdms.analysisInfo.저압탱크2' },
    { key: "calvera3", i18nKey: 'sdms.analysisInfo.저압탱크3' }
];



class AnalysisInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFirstRender: true,

            selectedMenu: 0,

            selectedIgnitionType: SdmsResource.analysisIgnitionType.explosion, // 선택한 발화유형 (기본값: 폭발)
            selectedFacilityType: SdmsResource.analysisFacilityType.전체, // 선택한 설비유형 (기본값: 전체)
            selectedProcessParamType: SdmsResource.analysisProcessParamType.압력, // 선택한 공정파라미터 (기본값: 압력)
            selectedDeviationType: SdmsResource.analysisDeviationType.상승, // 선택한 이탈유형 (기본값: 상승)
            
            riskDatas: null,    // 조회된 위험도 예측 데이터
            selectedCardData: null,  // 선택한 위험도 예측 카드 데이터
            selectedNodeKey: null,

            damageScopeDatas: null,     // 조회된 피해범위 예측 데이터

            sortDesc: true, // true = 위험도높은순(기본값)
        };

        this.cardRefs = {};

        this.damageType = null; // 피해범위 요청 타입
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

    handleSubmit = () => {
        const { selectedMenu, selectedIgnitionType, selectedFacilityType, selectedProcessParamType, selectedDeviationType } = this.state;

        this.setState({ 
            selectedCardData: null,
            selectedNodeKey: null,
            sortDesc: true
        });

        if (selectedMenu === 0) {
            if (!selectedIgnitionType) {
                this.props.showConfirmDialog(i18n.t('common.오류'), [i18n.t('sdms.analysisInfo.발화유형을 선택해주세요')], null, null);
                return;
            }
            else if (!selectedFacilityType) {
                this.props.showConfirmDialog(i18n.t('common.오류'), [i18n.t('sdms.analysisInfo.설비유형을 선택해주세요')], null, null);
                return;
            }
            else if (!selectedProcessParamType) {
                this.props.showConfirmDialog(i18n.t('common.오류'), [i18n.t('sdms.analysisInfo.공정파라미터를 선택해주세요')], null, null);
                return;
            }
            else if (!selectedDeviationType) {
                this.props.showConfirmDialog(i18n.t('common.오류'), [i18n.t('sdms.analysisInfo.이탈유형을 선택해주세요')], null, null);
                return;
            }

            this.requestRisk(selectedIgnitionType, selectedFacilityType, selectedProcessParamType, selectedDeviationType);
        }
        else if (selectedMenu === 1) {
            if (!selectedIgnitionType) {
                this.props.showConfirmDialog(i18n.t('common.오류'), [i18n.t('sdms.analysisInfo.발화유형을 선택해주세요')], null, null);
                return;
            }
            else if (!selectedFacilityType) {
                this.props.showConfirmDialog(i18n.t('common.오류'), [i18n.t('sdms.analysisInfo.설비유형을 선택해주세요')], null, null);
                return;
            }

            this.requestDamageScope(selectedIgnitionType, selectedFacilityType, selectedProcessParamType, selectedDeviationType);

            this.damageType = selectedIgnitionType;
        }
    }

    requestRisk = async (mode, node, param, deviation) => {
        const language = i18n.language;

        const [result, message] = await SDMSController.requestRisk(mode, node, param, deviation, language);

        if (result === null) {
            this.props.showConfirmDialog(i18n.t('common.오류'), [message], null, null);
            return;
        }

        // 결과값에서 success, message 제외, value가 null인 값 제외
        const entries = Object.entries(result).filter(
            ([key, value]) => key !== "success" && key !== "message" && value !== null
        );

        // 객체가 비면 null, 아니면 객체로 변환
        const riskDatas = entries.length > 0 ? Object.fromEntries(entries) : null;

        this.setState({ riskDatas, isFirstRender: false });
    }

    requestDamageScope = async (mode, node) =>{
        const [result, message] = await SDMSController.requestDamageScope(mode, node);

        if (result === null) {
            this.props.showConfirmDialog(i18n.t('common.오류'), [message], null, null);
            return;
        }

        // 결과값에서 success, message 제외, value가 null인 값 제외
        const entries = Object.entries(result).filter(
            ([key, value]) => key !== "success" && key !== "message" && value !== null
        );

        // 객체가 비면 null, 아니면 객체로 변환
        const damageScopeDatas = entries.length > 0 ? Object.fromEntries(entries) : null;

        this.setState({ damageScopeDatas, isFirstRender: false });
    }

    getRiskDatas = () => {
        const { riskDatas, selectedCardData, sortDesc } = this.state;

        const selectedFacilityName = this.getFacilityName(selectedCardData?.node);

        // object를 array로 변환
        const arr = Object.entries(riskDatas)
            .filter(([key, data]) => data.risk >= 1); // 보통위험부터만 표시

        // 정렬 적용
        arr.sort((a, b) => {
            const dataA = a[1];
            const dataB = b[1];

            return this.state.sortDesc
                ? dataA.risk - dataB.risk
                : dataB.risk - dataA.risk;
        });

        const count = arr.length;

        return (
            <>
                <div className='infos'>
                    <p>{i18n.t('sdms.analysisInfo.전체 ')}<span>{count}{i18n.t('sdms.analysisInfo.건')}&nbsp;</span>{i18n.t('sdms.analysisInfo.의 정보가 조회되었습니다')}</p>
                    <div>
                        <p>{i18n.t('sdms.analysisInfo.위험도순')}</p>
                        <button className={`sortBtn ${sortDesc ? 'za' : 'az'}`} onClick={this.toggleSort}/>
                    </div>
                </div>

                <ul className='cards'>
                    {arr.map(([key, data]) => {
                        const facilityName = this.getFacilityName(data.node);

                        return (
                            <li
                                key={key}
                                ref={el => (this.cardRefs[key] = el)}
                                className={selectedFacilityName === facilityName ? 'on' : ''}
                                onClick={() => {
                                    const parsed = JSON.parse(data.node);
                                    const nodeKey = parsed.ko.toLowerCase().replace(/-/g, "_");

                                    this.setState({
                                        selectedCardData: data,
                                        selectedNodeKey: nodeKey
                                    });
                                }}
                            >
                                <div className='head'>
                                    {this.riskBadge(data.risk)}
                                    <p className='name'>{facilityName}</p>
                                </div>

                                <ul className='body'>
                                    <li><p>{i18n.t('sdms.analysisInfo.설명')}</p><p>{data.nodeInfo || '-'}</p></li>
                                    <li><p>{i18n.t('sdms.analysisInfo.공정 파라미터')}</p><p>{data.proc_param || '-'}</p></li>
                                    <li><p>{i18n.t('sdms.analysisInfo.이탈')}</p><p>{data.break_away || '-'}</p></li>
                                    <li><p>{i18n.t('sdms.analysisInfo.원인')}</p><p>{data.cause || '-'}</p></li>
                                    <li><p>{i18n.t('sdms.analysisInfo.이벤트 시나리오')}</p><p>{data.event_scenario || '-'}</p></li>
                                    <li><p>{i18n.t('sdms.analysisInfo.위험 시나리오')}</p><p>{data.hazard_scenario || '-'}</p></li>
                                    <li><p>{i18n.t('sdms.analysisInfo.예방 조치')}</p><p>{data.preventive_action || '-'}</p></li>
                                    <li><p>{i18n.t('sdms.analysisInfo.예방 참조')}</p><p>{data.preventive_reference || '-'}</p></li>
                                    <li><p>{i18n.t('sdms.analysisInfo.비상 대응')}</p><p>{data.emergency_response || '-'}</p></li>
                                    <li><p>{i18n.t('sdms.analysisInfo.비상 참조')}</p><p>{data.emergency_reference || '-'}</p></li>
                                </ul>
                            </li>
                        );
                    })}
                </ul>
            </>
        );
    }

    getDamageScopeDatas = () => {
        const { damageScopeDatas, selectedCardData } = this.state;

        const selectedFacilityName = this.getFacilityName(selectedCardData?.node);

        // object를 array로 변환
        const arr = Object.entries(damageScopeDatas);

        const count = arr.length;

        let typeText = (<p>{i18n.t('sdms.analysisInfo.화재강도')}</p>);

        let typeRisk1 = "r@4kW/m²(m)";
        let typeRisk2 = "r@8kW/m²(m)";
        let typeRisk3 = "r@12.5kW/m²(m)";
        let typeRisk4 = "r@25kW/m²(m)";
        let typeRisk5 = "r@37.5kW/m²(m)";

        if (this.damageType === SdmsResource.analysisIgnitionType.explosion) {
            typeText = (<p>{i18n.t('sdms.analysisInfo.폭발강도')}</p>);

            typeRisk1 = "r@6.9kPa(m)";
            typeRisk2 = "r@20.7kPa(m)";
            typeRisk3 = "r@34.5kPa(m)";
            typeRisk4 = "r@48kPa(m)";
            typeRisk5 = "r@96kPa(m)";
        }

        return (
            <>
                <div className='infos'>
                    <p>전체 <span>{count}건</span>의 정보가 조회되었습니다</p>
                    <div />
                </div>

                <ul className='cards'>
                    {arr.map(([key, data]) => {
                        const facilityName = this.getFacilityName(data.node);

                        return (
                            <li
                                key={key}
                                ref={el => (this.cardRefs[key] = el)}
                                className={selectedFacilityName === facilityName ? 'on' : ''}
                                onClick={() => {
                                    const parsed = JSON.parse(data.node);
                                    const nodeKey = parsed.ko.toLowerCase().replace(/-/g, "_");

                                    // 이미 선택된 카드인지 확인
                                    const isSame =
                                        this.state.selectedNodeKey === nodeKey &&
                                        this.state.selectedCardData === data;

                                    if (isSame) {
                                        // 동일한 카드 클릭 -> 선택 해제
                                        this.setState({
                                            selectedCardData: null,
                                            selectedNodeKey: null
                                        });
                                    } else {
                                        // 새로운 카드 선택
                                        this.setState({
                                            selectedCardData: data,
                                            selectedNodeKey: nodeKey
                                        });
                                    }
                                }}
                            >
                                <div className='head'>
                                    <p className='name'>{facilityName}</p>
                                </div>

                                <ul className='body'>
                                    <li><p>{i18n.t('sdms.analysisInfo.압력')}(Mpa)</p><p>{data.pressure ?? '-'}</p></li>
                                    <li><p>{i18n.t('sdms.analysisInfo.온도')}(℃)</p><p>{data.temperature ?? '-'}</p></li>
                                    <li><p>{i18n.t('sdms.analysisInfo.누출구 크기')}(mm)</p><p>{data.crack_size ?? '-'}</p></li>
                                    <li><p>{i18n.t('sdms.analysisInfo.누출 면적')}(m²)</p><p>{data.leak_area ?? '-'}</p></li>
                                    <li><p>{i18n.t('sdms.analysisInfo.누출량')}(kg/s)</p><p>{data.leak_amount ?? '-'}</p></li>
                                    <li>
                                        <p>{typeText}</p>
                                        <div>
                                            <div className='intensityWrap card'>
                                                <span className='circle c5' />
                                                <span className='circle c4' />
                                                <span className='circle c3' />
                                                <span className='circle c2' />
                                                <span className='circle c1' />
                                            </div>
                                            <ul className='intensityLegend'>
                                                <li><span className="dot risk5"></span> {typeRisk1} : {data.risk_5?.outer_radius || '-'}</li>
                                                <li><span className="dot risk4"></span> {typeRisk2} : {data.risk_4?.outer_radius || '-'}</li>
                                                <li><span className="dot risk3"></span> {typeRisk3} : {data.risk_3?.outer_radius || '-'}</li>
                                                <li><span className="dot risk2"></span> {typeRisk4} : {data.risk_2?.outer_radius || '-'}</li>
                                                <li><span className="dot risk1"></span> {typeRisk5} : {data.risk_1?.outer_radius || '-'}</li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        );
                    })}
                </ul>
            </>
        );
    }

    riskBadge = (risk) => {
        if (risk === 5) return <p className='risk risk5'>{i18n.t('sdms.analysisInfo.매우낮은위험')}</p>;
        if (risk === 4) return <p className='risk risk4'>{i18n.t('sdms.analysisInfo.낮은위험')}</p>;
        if (risk === 3) return <p className='risk risk3'>{i18n.t('sdms.analysisInfo.보통위험')}</p>;
        if (risk === 2) return <p className='risk risk2'>{i18n.t('sdms.analysisInfo.높은위험')}</p>;
        if (risk === 1) return <p className='risk risk1'>{i18n.t('sdms.analysisInfo.매우높은위험')}</p>;
        return null;
    };

    getFacilityName = (node) => i18nUtil.convertText(node);

    toggleSort = () => {
        this.setState(prev => ({ sortDesc: !prev.sortDesc }));
    }

    getRiskClassByKoName = (name) => {
        const { isFirstRender, selectedMenu, riskDatas, damageScopeDatas } = this.state;

        if (isFirstRender) return "";

        // --- 위험도 예측 모드 ---
        if (selectedMenu === 0) {
            if (!riskDatas) return "off";

            for (const key in riskDatas) {
                const item = riskDatas[key];
                if (!item || typeof item.node !== "string") continue;

                const parsed = JSON.parse(item.node);
                if (parsed.ko === name) {
                    return `risk${item.risk}`;     // risk3, risk4, risk5
                }
            }
            return "off";   // 위험도 데이터 없음 > off
        }

        // --- 피해범위 예측 모드 ---
        if (selectedMenu === 1) {
            if (!damageScopeDatas) return "off";

            for (const key in damageScopeDatas) {
                const item = damageScopeDatas[key];
                if (!item || typeof item.node !== "string") continue;

                const parsed = JSON.parse(item.node);
                if (parsed.ko === name) {
                    return "";                   // 데이터 있음 > class 없음 (off 불가)
                }
            }

            return "off"; // 데이터 자체가 없으면 off
        }

        return "";
    };

    getOpacityWithFirstRender = (names = []) => {
        const { isFirstRender } = this.state;
        if (isFirstRender) return 1;   // 첫 렌더는 무조건 1

        return this.hasActiveTags(names) ? 1 : 0.3;
    }

    getOpacityWithoutFirstRender = (names = []) => {
        return this.hasActiveTags(names) ? 1 : 0.3;
    }

    getOpacity = (names = []) => {
        const { isFirstRender, selectedMenu, riskDatas, damageScopeDatas } = this.state;

        if (isFirstRender) return 1;

        // --- 위험도 예측 ---
        if (selectedMenu === 0) {
            return this.hasActiveTags(names) ? 1 : 0.3;
        }

        // --- 피해범위 예측 ---
        if (selectedMenu === 1) {
            if (!damageScopeDatas) return 0.3;

            const exists = names.some(name =>
                Object.values(damageScopeDatas).some(item => {
                    const parsed = JSON.parse(item.node);
                    return parsed.ko === name;
                })
            );

            return exists ? 1 : 0.3;
        }

        return 1;
    };

    hasActiveTags = (names = []) => {
        const { selectedMenu, riskDatas, damageScopeDatas } = this.state;

        // 위험도 예측 모드
        if (selectedMenu === 0) {
            if (!riskDatas) return false;
            for (const name of names) {
                const cls = this.getRiskClassByKoName(name);
                if (cls && cls !== "off") return true;
            }
            return false;
        }

        // 피해범위 모드
        if (selectedMenu === 1) {
            if (!damageScopeDatas) return false;

            return names.some(name =>
                Object.values(damageScopeDatas).some(item => {
                    const parsed = JSON.parse(item.node);
                    return parsed.ko === name;
                })
            );
        }

        return false;
    };

    getMaxRisk = (names = []) => {
        const { riskDatas } = this.state;
        if (!riskDatas) return null;

        let maxRisk = null;

        for (const key in riskDatas) {
            const item = riskDatas[key];
            if (!item || typeof item.node !== "string") continue;

            const parsed = JSON.parse(item.node);

            // ko 값과 names 배열 내용이 일치하는지 확인
            if (names.includes(parsed.ko)) {
                if (maxRisk === null || item.risk > maxRisk) {
                    maxRisk = item.risk;
                }
            }
        }

        return maxRisk; // 존재하면 risk(1~5), 없으면 null
    }

    getWrapperClass = (names = []) => {
        const { selectedMenu, riskDatas, damageScopeDatas } = this.state;

        // --- 위험도 예측 ---
        if (selectedMenu === 0) {
            // 기존 로직
            const opacity = this.getOpacity(names);
            if (opacity !== 1) return "";

            const risk = this.getMaxRisk(names);
            if (!risk) return "";

            return `riskBorder${risk}`;
        }

        // --- 피해범위 예측 ---
        if (selectedMenu === 1) {
            if (!damageScopeDatas) return "";

            const exists = names.some(name =>
                Object.values(damageScopeDatas).some(item => {
                    const parsed = JSON.parse(item.node);
                    return parsed.ko === name;
                })
            );

            return exists ? "borderOn" : "";
        }

        return "";
    };

    onNodeClick = (koName) => {
        const { selectedMenu, riskDatas, damageScopeDatas } = this.state;

        const dataSource = selectedMenu === 0 ? riskDatas : damageScopeDatas;
        if (!dataSource) return;

        const nodeKey = koName.toLowerCase().replace(/-/g, "_");

        let matchedKey = null;
        let matchedData = null;

        for (const key in dataSource) {
            const item = dataSource[key];

            if (!item || typeof item.node !== "string") continue;

            const parsed = JSON.parse(item.node);
            if (parsed.ko === koName) {
                matchedKey = key;
                matchedData = item;
                break;
            }
        }

        if (matchedData) {
            this.setState({
                selectedCardData: matchedData,
                selectedNodeKey: nodeKey
            }, () => {
                const target = this.cardRefs[matchedKey];
                if (target) {
                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            });
        }
        else {
            this.setState({ selectedNodeKey: nodeKey });
        }
        
    };

    getAnimateClassByKoName = (name) => {
        const { selectedNodeKey } = this.state;

        // koName > nodeKey 형태로 변환
        const key = name
            .toLowerCase()
            .replace(/-/g, "_");  // "Node3-1" 대응용

        return selectedNodeKey === key ? "animate" : "";
    }

    handleMenu = (menu) => {
        if (this.state.selectedMenu === menu) return;
        
        this.setState({
            isFirstRender: true,
            selectedMenu: menu,
            selectedIgnitionType: SdmsResource.analysisIgnitionType.explosion,
            selectedFacilityType: SdmsResource.analysisFacilityType.전체,
            selectedProcessParamType: SdmsResource.analysisProcessParamType.압력,
            selectedDeviationType: SdmsResource.analysisDeviationType.상승,
            riskDatas: null,
            selectedCardData: null,
            selectedNodeKey: null,
            damageScopeDatas: null,
            sortDesc: true,
        });
    }

    hasNodeData = (nodeKey) => {
        const { riskDatas, damageScopeDatas } = this.state;

        const match = (dataSource) => {
            return Object.entries(dataSource).some(([key, val]) => {
                if (!val?.node) return false;
                const parsed = JSON.parse(val.node);
                const parsedKey = parsed.ko.toLowerCase().replace(/-/g, "_");
                return parsedKey === nodeKey;
            });
        };

        if (riskDatas && match(riskDatas)) return true;
        if (damageScopeDatas && match(damageScopeDatas)) return true;

        return false;
    }

    renderDamageCirclesByKoName(koName) {
        const { selectedMenu, damageScopeDatas, selectedNodeKey } = this.state;
        if (selectedMenu !== 1) return null;
        if (!damageScopeDatas) return null;

        const entry = Object.entries(damageScopeDatas).find(([key, val]) => {
            if (!val?.node) return false;
            const parsed = JSON.parse(val.node);
            return parsed.ko === koName;
        });

        if (!entry) return null;

        const [dataKey, data] = entry;

        const isSelected = selectedNodeKey === koName.toLowerCase().replace(/-/g, "_");
        const opacity = isSelected ? 1 : 0.5;
        const zIndex = isSelected ? 9999 : 1;

        const levels = [
            { cls: "c5", val: data.risk_5?.outer_radius, label: "4(m)" },
            { cls: "c4", val: data.risk_4?.outer_radius, label: "8(m)" },
            { cls: "c3", val: data.risk_3?.outer_radius, label: "12.5(m)" },
            { cls: "c2", val: data.risk_2?.outer_radius, label: "25(m)" },
            { cls: "c1", val: data.risk_1?.outer_radius, label: "37.5(m)" }
        ];

        return (
            <div
                className={`intensityWrap chart ${isSelected ? "selected" : ""}`}
                style={{
                    opacity,
                    zIndex,
                    pointerEvents: isSelected ? "auto" : "none",
                    position: "relative"
                }}
            >
                {levels.map(({ cls, val, label }) => {
                    const size = (val || 0) * 14;

                    return (
                        <span
                            key={cls}
                            className={`circle ${cls}`}
                            style={{
                                width: size + "px",
                                height: size + "px",
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                borderRadius: "50%",
                                boxSizing: "border-box",
                                pointerEvents: isSelected ? "auto" : "none"
                            }}
                            onMouseEnter={(e) => {
                                if (!isSelected) return;

                                const rect = e.target.getBoundingClientRect();
                                const wrapRect = e.target.parentNode.getBoundingClientRect();

                                this.setState({
                                    hoverInfo: {
                                        x: rect.left - wrapRect.left + rect.width / 2,
                                        y: rect.top - wrapRect.top + rect.height / 2,
                                        text: `${label} : ${val ?? "-"}`
                                    }
                                });
                            }}
                            onMouseLeave={() => {
                                if (!isSelected) return;
                                this.setState({ hoverInfo: null });
                            }}
                        />
                    );
                })}

                {/* tooltip */}
                {isSelected && this.state.hoverInfo && (
                    <div
                        className="chartTooltip"
                        style={{
                            top: this.state.hoverInfo.y,
                            left: this.state.hoverInfo.x,
                        }}
                    >
                        {this.state.hoverInfo.text}
                    </div>
                )}
            </div>
        );
    }

    hasDataByKoName = (koName) => {
        const dataSource = this.state.selectedMenu === 0
            ? this.state.riskDatas
            : this.state.damageScopeDatas;

        if (!dataSource) return false;

        return Object.values(dataSource).some(item => {
            if (!item?.node) return false;
            const parsed = JSON.parse(item.node);
            return parsed.ko === koName;
        });
    };

    render() {
        const { isFirstRender, selectedMenu, selectedIgnitionType, selectedFacilityType, selectedProcessParamType, selectedDeviationType, riskDatas, damageScopeDatas } = this.state;

        return (
            <ModalBackground>
                <AnalysisInfoComponent id={this.props.popupType} className={'viewAnalysisSection'}>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={1378}
                        popupMinHeight={806}
                        topSize={32}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                        usePopupDrag={false}
                        usePopupResize={false}
                    >
                        <div className={'dslTop dslGrd'}>
                            <h5 className={'dslTitle'}>
                                {i18n.t('sdms.analysisInfo.위험성 평가 예측')}
                            </h5>
                            <a 
                                className={'dslX'} 
                                onClick={() => this.props.setVisiblePopups(SDMS.menu.analysisInfo, false)}
                            />
                        </div>

                        <div className="contents">
                            <section>
                                <div className='searchWrap'>
                                    <ul className='menus'>
                                        <li 
                                            className={selectedMenu === 0 ? 'on' : null}
                                            onClick={() => this.handleMenu(0)}
                                        >
                                            {i18n.t('sdms.analysisInfo.위험도 예측')}
                                        </li>
                                        <li 
                                            className={selectedMenu === 1 ? 'on' : null}
                                            onClick={() => this.handleMenu(1)}
                                        >
                                            {i18n.t('sdms.analysisInfo.피해범위 예측')}
                                        </li>
                                    </ul>
                                    <ul className='options'>
                                        <li>
                                            <p>{i18n.t('sdms.analysisInfo.발화유형')}</p>
                                            <select
                                                value={selectedIgnitionType || ""}
                                                onChange={(v) => this.setState({ selectedIgnitionType: v.target.value })}
                                            >
                                                <option value={SdmsResource.analysisIgnitionType.fire}>{i18n.t('sdms.analysisInfo.화재')}</option>
                                                <option value={SdmsResource.analysisIgnitionType.explosion}>{i18n.t('sdms.analysisInfo.폭발')}</option>
                                            </select>
                                        </li>
                                        <li>
                                            <p>{i18n.t('sdms.analysisInfo.설비유형')}</p>
                                            <select
                                                value={selectedFacilityType || ""}
                                                onChange={(v) => this.setState({ selectedFacilityType: v.target.value })}
                                            >
                                                <option value={SdmsResource.analysisFacilityType.전체}>{i18n.t('sdms.analysisInfo.전체')}</option>
                                                <option value={SdmsResource.analysisFacilityType.Node1}>Node1</option>
                                                <option value={SdmsResource.analysisFacilityType.Node2}>Node2</option>
                                                <option value={SdmsResource.analysisFacilityType.Node3_1}>Node3-1</option>
                                                <option value={SdmsResource.analysisFacilityType.Node3_2}>Node3-2</option>
                                                <option value={SdmsResource.analysisFacilityType.Node3_3}>Node3-3</option>
                                                <option value={SdmsResource.analysisFacilityType.Node4}>Node4</option>
                                                <option value={SdmsResource.analysisFacilityType.Node5}>Node5</option>
                                                <option value={SdmsResource.analysisFacilityType.Node6_1}>Node6-1</option>
                                                <option value={SdmsResource.analysisFacilityType.Node6_2}>Node6-2</option>
                                                <option value={SdmsResource.analysisFacilityType.Node6_3}>Node6-3</option>
                                                <option value={SdmsResource.analysisFacilityType.Node7}>Node7</option>
                                                <option value={SdmsResource.analysisFacilityType.Node8}>Node8</option>
                                                <option value={SdmsResource.analysisFacilityType.Node9}>Node9</option>
                                                <option value={SdmsResource.analysisFacilityType.Node10}>Node10</option>
                                                <option value={SdmsResource.analysisFacilityType.E1}>{i18n.t('sdms.analysisInfo.중압 압축기')}</option>
                                                <option value={SdmsResource.analysisFacilityType.E2}>{i18n.t('sdms.analysisInfo.고압 압축기')}</option>
                                                <option value={SdmsResource.analysisFacilityType.E3_1}>{i18n.t('sdms.analysisInfo.저압탱크1')}</option>
                                                <option value={SdmsResource.analysisFacilityType.E3_2}>{i18n.t('sdms.analysisInfo.저압탱크2')}</option>
                                                <option value={SdmsResource.analysisFacilityType.E3_3}>{i18n.t('sdms.analysisInfo.저압탱크3')}</option>
                                                <option value={SdmsResource.analysisFacilityType.E4_1}>{i18n.t('sdms.analysisInfo.고압탱크1')}</option>
                                                <option value={SdmsResource.analysisFacilityType.E4_2}>{i18n.t('sdms.analysisInfo.고압탱크2')}</option>
                                                <option value={SdmsResource.analysisFacilityType.E4_3}>{i18n.t('sdms.analysisInfo.고압탱크3')}</option>
                                                <option value={SdmsResource.analysisFacilityType.E5}>{i18n.t('sdms.analysisInfo.냉각기')}</option>
                                            </select>
                                        </li>
                                        {selectedMenu === 0 &&
                                            <>
                                                <li>
                                                <p>{i18n.t('sdms.analysisInfo.공정파라미터')}</p>
                                                    <select
                                                        value={selectedProcessParamType || ""}
                                                        onChange={(v) => this.setState({ selectedProcessParamType: v.target.value })}
                                                    >
                                                    <option value={SdmsResource.analysisProcessParamType.밸브개도율}>{i18n.t('sdms.analysisInfo.밸브개도율')}</option>
                                                    <option value={SdmsResource.analysisProcessParamType.산소농도}>{i18n.t('sdms.analysisInfo.산소농도')}(O₂%)</option>
                                                    <option value={SdmsResource.analysisProcessParamType.수소농도}>{i18n.t('sdms.analysisInfo.수소농도')}(LEL%)</option>
                                                    <option value={SdmsResource.analysisProcessParamType.압력}>{i18n.t('sdms.analysisInfo.압력')}</option>
                                                    <option value={SdmsResource.analysisProcessParamType.압력강하율}>{i18n.t('sdms.analysisInfo.압력강하율(누설지표)')}</option>
                                                    <option value={SdmsResource.analysisProcessParamType.온도}>{i18n.t('sdms.analysisInfo.온도')}</option>
                                                    <option value={SdmsResource.analysisProcessParamType.유량}>{i18n.t('sdms.analysisInfo.유량')}</option>
                                                    <option value={SdmsResource.analysisProcessParamType.진동}>{i18n.t('sdms.analysisInfo.진동')}</option>
                                                    <option value={SdmsResource.analysisProcessParamType.차압}>{i18n.t('sdms.analysisInfo.차압')}</option>
                                                    </select>
                                                </li>
                                                <li>
                                                <p>{i18n.t('sdms.analysisInfo.이탈유형')}</p>
                                                    <select
                                                        value={selectedDeviationType || ""}
                                                        onChange={(v) => this.setState({ selectedDeviationType: v.target.value })}
                                                    >
                                                    <option value={SdmsResource.analysisDeviationType.오동작}>{i18n.t('sdms.analysisInfo.오동작')}</option>
                                                    <option value={SdmsResource.analysisDeviationType.밸브_닫힘_고착}>{i18n.t('sdms.analysisInfo.밸브 닫힘 고착')}</option>
                                                    <option value={SdmsResource.analysisDeviationType.밸브_열림_고착}>{i18n.t('sdms.analysisInfo.밸브 열림 고착')}</option>
                                                    <option value={SdmsResource.analysisDeviationType.고유량}>{i18n.t('sdms.analysisInfo.고유량(High)')}</option>
                                                    <option value={SdmsResource.analysisDeviationType.맥동_요동}>{i18n.t('sdms.analysisInfo.맥동 / 요동')}</option>
                                                    <option value={SdmsResource.analysisDeviationType.무압}>{i18n.t('sdms.analysisInfo.무압')}(Zero)</option>
                                                    <option value={SdmsResource.analysisDeviationType.무유량}>{i18n.t('sdms.analysisInfo.무유량(No Flow)')}</option>
                                                    <option value={SdmsResource.analysisDeviationType.미검출}>{i18n.t('sdms.analysisInfo.미검출(센서 고장)')}</option>
                                                    <option value={SdmsResource.analysisDeviationType.상승}>{i18n.t('sdms.analysisInfo.상승')}(High)</option>
                                                    <option value={SdmsResource.analysisDeviationType.역류}>{i18n.t('sdms.analysisInfo.역류(Reverse)')}</option>
                                                    <option value={SdmsResource.analysisDeviationType.저유량}>{i18n.t('sdms.analysisInfo.저유량(Low)')}</option>
                                                    <option value={SdmsResource.analysisDeviationType.저하}>{i18n.t('sdms.analysisInfo.저하')}(Low)</option>
                                                    <option value={SdmsResource.analysisDeviationType.증가}>{i18n.t('sdms.analysisInfo.증가')}(High)</option>
                                                    </select>
                                                </li>
                                            </>
                                        }
                                    </ul>
                                    <button type='button' onClick={this.handleSubmit}>{i18n.t('sdms.analysisInfo.조회')}</button>
                                </div>

                                <div
                                    className='resultWrap'
                                    style={{ height: selectedMenu === 0 ? 'calc(100% - 359px)' : 'calc(100% - 255px)' }}
                                >
                                    {!riskDatas && !damageScopeDatas ?
                                        <div className='emptyResult'>
                                            <img src={simulationInfoIcon} alt='결과없음 아이콘' />
                                            <span>{i18n.t('sdms.analysisInfo.조회된 항목이 없어요')}</span>
                                            <span>{i18n.t('sdms.analysisInfo.조회하기 버튼을 눌러 데이터를 확인하세요')}</span>
                                        </div>
                                        : selectedMenu === 0 ?
                                            this.getRiskDatas() : this.getDamageScopeDatas()
                                    }
                                </div>
                            </section>

                            <section className='diagramWrap'>
                                <div className='title'>
                                    <p>{i18n.t('sdms.analysisInfo.개략도')}</p>
                                    <ul>
                                        <li>{i18n.t('sdms.analysisInfo.매우낮은위험')}</li>
                                        <li>{i18n.t('sdms.analysisInfo.낮은위험')}</li>
                                        <li>{i18n.t('sdms.analysisInfo.보통위험')}</li>
                                        <li>{i18n.t('sdms.analysisInfo.높은위험')}</li>
                                        <li>{i18n.t('sdms.analysisInfo.매우높은위험')}</li>
                                        <li>{i18n.t('sdms.analysisInfo.공정흐름')}</li>
                                    </ul>
                                </div>
                                <div className='diagram'>
                                    <div 
                                        className='nodeAnimation'
                                        style={{ display: isFirstRender ? 'block' : 'none' }}
                                    >
                                        <video 
                                            src={Pre_comp} 
                                            autoPlay 
                                            loop 
                                            muted 
                                            playsInline 
                                        />
                                    </div>

                                    {/* 노드 이미지 */}
                                    <div className='nodes'
                                        style={{ display: !isFirstRender ? 'block' : 'none' }}
                                    >
                                        {[
                                            "node1", "node2", "node3_1", "node3_2", "node3_3",
                                            "node4", "node5", "node6_1", "node6_2", "node6_3",
                                            "node7", "node8", "node9", "node10", "nodeObj"
                                        ].map(nodeKey => (
                                            <img
                                                key={nodeKey}
                                                src={
                                                    this.hasNodeData(nodeKey)
                                                        ? NODE_IMAGES[nodeKey].on     // 데이터 있음 > normal 이미지
                                                        : NODE_IMAGES[nodeKey].off    // 데이터 없음 > off 이미지
                                                }
                                                className={nodeKey}
                                            />
                                        ))}
                                    </div>

                                    {/* 노드 네임택 */}
                                    <div className='nameTags'>
                                        {[
                                            "node1", "node2", "node3_1", "node3_2", "node3_3",
                                            "node4", "node5", "node6_1", "node6_2", "node6_3",
                                            "node7", "node8", "node9", "node10"
                                        ].map(nodeKey => {
                                            const dataSource = selectedMenu === 1 ? damageScopeDatas : riskDatas;
                                            const item = dataSource?.[nodeKey];

                                            let statusClass = "";
                                            if (!isFirstRender) {
                                                if (selectedMenu === 0) statusClass = item ? `risk${item.risk}` : "off";
                                                else statusClass = item ? "" : "off";
                                            }

                                            const name = item?.node
                                                ? JSON.parse(item.node).ko
                                                : nodeKey.charAt(0).toUpperCase() + nodeKey.slice(1);

                                            return (
                                                <div key={nodeKey} className={`tagWrapper ${nodeKey}`}>
                                                    <span
                                                        className={`tag ${statusClass} ${(this.state.selectedNodeKey === nodeKey &&
                                                        this.hasDataByKoName(name))
                                                        ? "animate" : ""}`}
                                                        onClick={() => this.onNodeClick(name)}
                                                    >
                                                        {name}
                                                    </span>

                                                    {selectedMenu === 1 && this.renderDamageCirclesByKoName(name)}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* 설비 네임택 */}
                                    <div className="facilityNameTags">
                                        {FACILITY_TAGS.map(f => {
                                            const koName = i18n.t(f.i18nKey);
                                            const dataSource = this.state.selectedMenu === 1
                                                ? this.state.damageScopeDatas
                                                : this.state.riskDatas;

                                            const riskItem = Object.values(dataSource ?? {}).find(item => {
                                                if (!item?.node) return false;
                                                const parsed = JSON.parse(item.node);
                                                return parsed.ko === koName;
                                            });

                                            let statusClass = "";
                                            if (!this.state.isFirstRender) {
                                                if (this.state.selectedMenu === 0)
                                                    statusClass = riskItem ? `risk${riskItem.risk}` : "off";
                                                else
                                                    statusClass = riskItem ? "" : "off";
                                            }

                                            const nodeKey = koName.toLowerCase().replace(/-/g, "_");

                                            return (
                                                <div key={f.key} className={`tagWrapper ${f.key}`}>
                                                    <span
                                                        className={`tag ${statusClass} ${
                                                            (this.state.selectedNodeKey === nodeKey &&
                                                            this.hasDataByKoName(koName))
                                                            ? "animate" : ""
                                                        }`}
                                                        onClick={() => this.onNodeClick(koName)}
                                                    >
                                                        {koName}
                                                    </span>

                                                    {this.state.selectedMenu === 1 &&
                                                        this.renderDamageCirclesByKoName(koName)
                                                    }
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className='facilityItems'>
                                        {/* 트레일러 / 승용차 / 지게차 */}
                                        <section className='top'>
                                            <article className='first'>
                                                <div className='trailer'>
                                                    <img src={Tube_Trailer} alt='트레일러 이미지' style={{ opacity: isFirstRender ? 1 : 0.3 }} />
                                                    <div className='nameTag'>
                                                        <div>
                                                            <span className={!isFirstRender ? "off" : ""}>{i18n.t('sdms.analysisInfo.트레일러 H2')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                            <article className='second'>
                                                <div className='car'>
                                                    <img src={car} alt='승용차 이미지' style={{ opacity: isFirstRender ? 1 : 0.3 }} />
                                                    <div className='nameTag'>
                                                        <div>
                                                            <span className={!isFirstRender ? "off" : ""}>{i18n.t('sdms.analysisInfo.승용차')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                            <article className='third'>
                                                <div className='truck'>
                                                    <img src={forklift} alt='지게차 이미지' style={{ opacity: isFirstRender ? 1 : 0.3 }} />
                                                    <div className='nameTag'>
                                                        <div>
                                                            <span className={!isFirstRender ? "off" : ""}>{i18n.t('sdms.analysisInfo.지게차')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        </section>

                                        {/* 전기분해기 / 중압압축기 / 에어컴프레서 / 디스펜서 / 고압압축기 / 냉각기 */}
                                        <section className='middle'>
                                            <article className='first'>
                                                <div className={`electrolysis ${this.getWrapperClass(["중압 압축기"])}`}>
                                                    <img
                                                        src={Electrolyzer}
                                                        alt='전기분해기 이미지'
                                                        style={{ opacity: this.getOpacityWithFirstRender(["중압 압축기"]) }}
                                                    />
                                                    <div className='nameTag'>
                                                        <div>
                                                            <span className={!isFirstRender ? "off" : ""}>{i18n.t('sdms.analysisInfo.전기분해기')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                            <article className='second'>
                                                <div className={`airCompressor ${this.getWrapperClass(["에어 컴프레서"])}`}>
                                                    <img
                                                        src={air_Compressor}
                                                        alt='에어 컴프레서 이미지'
                                                        style={{ opacity: this.getOpacityWithFirstRender(["에어 컴프레서"]) }}
                                                    />
                                                    <div className='nameTag'>
                                                        <div>
                                                            <span className={!isFirstRender ? "off" : ""}>{i18n.t('sdms.analysisInfo.에어 컴프레서')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                            <article className='third'>
                                                <div className={`dispenser ${this.getWrapperClass(["고압 압축기"])}`}>
                                                    <img
                                                        src={Dispenser}
                                                        alt='디스펜서 이미지'
                                                        style={{ opacity: this.getOpacityWithFirstRender(["고압 압축기"]) }}
                                                    />
                                                    <div className='nameTag'>
                                                        <div>
                                                            <span className={!isFirstRender ? "off" : ""}>{i18n.t('sdms.analysisInfo.디스펜서')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                            <article className='fourth'>
                                                <div className={`coolingUnit ${this.getWrapperClass(["냉각기"])}`}>
                                                    <img
                                                        src={cooling_unit}
                                                        alt='냉각기 이미지'
                                                        style={{ opacity: this.getOpacityWithFirstRender(["냉각기"]) }}
                                                    />
                                                </div>
                                            </article>
                                        </section>

                                        {/* 고압탱크1 / 고압탱크2 / 고압탱크3 / 저압탱크1 / 저압탱크2 / 저압탱크3 */}
                                        <section className='bottom'>
                                            <article className='first'>
                                                <div className={`fiba1 ${this.getWrapperClass(["고압탱크1", "고압탱크2", "고압탱크3"])}`}>
                                                    <img
                                                        src={fiba}
                                                        alt='고압탱크 이미지'
                                                        style={{ opacity: this.getOpacity(["고압탱크1", "고압탱크2", "고압탱크3"]) }}
                                                    />
                                                </div>
                                            </article>

                                            <article className='second'>
                                                <div className={`calvera ${this.getWrapperClass(["저압탱크1", "저압탱크2", "저압탱크3"])}`}>
                                                    <img
                                                        src={Calvera}
                                                        alt='저압탱크 이미지'
                                                        style={{ opacity: this.getOpacity(["저압탱크1", "저압탱크2", "저압탱크3"]) }}
                                                    />
                                                </div>
                                            </article>
                                        </section>

                                        <img src={pipe} className='pipeObj' />
                                    </div>
                                </div>
                            </section>
                        </div>
                    </PopupDraggable>
                </AnalysisInfoComponent>
            </ModalBackground>
        );
    }
}

export default withTranslation()(AnalysisInfo);