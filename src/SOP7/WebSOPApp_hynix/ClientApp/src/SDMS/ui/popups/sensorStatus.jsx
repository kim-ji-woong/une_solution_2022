import React, { Component } from 'react';
import content from '../../../Common/css/content.module.css';
import SDMS from '../sdms';
import SDMSMainMenu from '../sdmsMainMenu';
import SDMSResource from '../../resource/id';
import popup from '../../../SDMS/css/popup.module.css';
import Contents3D from '../3D/contents3D';
import '../../../SDMS/css/pop.css';

import PopupDraggable from './popupDraggable';
import $ from 'jquery';
//import { height } from '@amcharts/amcharts4/.internal/core/utils/Utils';

import store from '../../../Root/store';
import SettingsStore from '../../../Settings/settingsStore';

import ProjectResource from '../../../Root/resource/id';

import { SensorStatusComponent } from '../../styled/sdmsPopupsStyled';
import SopManagerResource from '../../../SOPManager/resource/id';
import { i18n, withTranslation } from '../../../language/i18n';

class SensorStatus extends Component {
    // 한 페이지에 센서가 몇개까지 표시되는가?
    //static ItemCountPerPage = 10;
    static ItemCountSmall = 4;          // 작은 창에서 표시할 갯수
    static ItemCountFull = 40;          // 전체 창에서 표시할 갯수
    static ItemCount4K = 78;            // 전체 창에서 표시할 갯수
    // 페이지 번호는 화면에서 몇개까지 표시되는가?
    static PaginationCount = 5;

    static ItemCountSoulbrain = 20;      // 솔브레인 작은 창에서 표시할 갯수

    constructor(props) {
        super(props);
        this.state = {
            popupMinWidth: 190,//380,
            popupMinHeight: 230,//460,
            //pagingUI: true,                   /* 페이지 번호 */
            pageIndex: 0,
            showPsm: false,
            showEtc: false,
            //orderBySensorID: true,
            searchText: '',
            isFullPage: false,                  // 전체 창 여부
            fullSizeCount: 40,                  // 전체 창에서 표시할 갯수
            fullSizeIndex: -1,                  // 단독 창 index
            sizeLevel: 0,                       // UI 사이즈 Level
            
        };

        this.props = props;

        this.refAllView = React.createRef();
        this.refPsmButton = React.createRef();
        this.refEtcButton = React.createRef();
        this.refOrderBySensorValue = React.createRef();
        //this.refOrderBySensorID = React.createRef();
        this.refSearchText = React.createRef();

        this.maxPageNumber = 1;

        if (SDMS.UseWalkingAvatar) {
            this.refPosX = React.createRef();
            this.refPosY = React.createRef();
            this.refPosZ = React.createRef();
            this.refScaleX = React.createRef();
            this.refScaleY = React.createRef();
            this.refScaleZ = React.createRef();
        }

        store.subscribe(function () {
            let data = store.getState();

            if (data.actionType === 'RANGE_SENSORS') {
                this.setRangeSensorStatus(data);
            }

        }.bind(this));

        SettingsStore.subscribe(function () {
            let data = SettingsStore.getState();

            if (data.actionType === 'RESET_POPUP') {
                this.repositionPopup(data.popupState);
            }

        }.bind(this));
    }

    componentDidMount() {
        // 창이 서서히 나타나는 효과
        let cssLeft = null;
        let cssTop = null;
        let cssWidth = null;
        let cssHeight = null;

        const popupInfo = document.getElementById(this.props.popupType);
        const target = document.getElementById("dsBot_" + this.props.popupType);
        const popupState = this.props.popupState;

        if (popupInfo !== null && popupInfo !== undefined &&
            target !== null && target !== undefined &&
            popupState !== null && popupState !== undefined) {
            const clientRect = target.getBoundingClientRect();
            cssLeft = clientRect.left + "px";
            cssTop = clientRect.top + "px";

            popupInfo.style.width = 0;
            popupInfo.style.height = 0;
            popupInfo.style.left = cssLeft;
            popupInfo.style.top = cssTop;

            cssLeft = popupState.x;
            cssTop = popupState.y;
            cssWidth = popupState.width;
            cssHeight = popupState.height;

            $('#' + this.props.popupType).animate({ opacity: 1, width: cssWidth, height: cssHeight, left: cssLeft, top: cssTop }, SDMSResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;

                    // 화면 크기에 따라서 각각 UI 변동 필요
                    this.checkSizeLevel();
                }
            });
        }
        else {
            $('#' + this.props.popupType).animate({ opacity: 1 }, SDMSResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }

        // 수치 업데이트
        this.updateRangeSensors();
    }


    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popupInfo.style.zIndex = this.props.zIndex;
        }

        // 수치 업데이트
        this.updateRangeSensors();        
    }

    componentWillUpdate(nextProps, nextState) {
        // 선택된 센서가 달라질 경우
        // 알람이 달라질 경우
        if ((this.props.selectedSensors?.length !== nextProps.selectedSensors?.length && nextProps.selectedSensors?.length > 0) ||
            (nextProps.alarmSensor && this.props.alarmSensor !== nextProps.alarmSensor)) {

            // 선택된 센서 타입 해제
            this.state.showPsm = false;
            this.state.showEtc = false;

            const refPsmButton = document.getElementById("refPsmButton");

            if (refPsmButton && this.refPsmButton.current.classList.contains('selected')) {
                this.refPsmButton.current.classList.remove('selected');
            }

            const refEtcButton = document.getElementById("refEtcButton");

            if (refEtcButton && this.refEtcButton.current.classList.contains('selected')) {
                this.refEtcButton.current.classList.remove('selected');
            }

            // 전체버튼 해제
            const allButton = document.getElementById("allButton");
            if (allButton?.checked) {
                allButton.checked = false;
            }


            // 알람이 달라질 경우
            if (nextProps.alarmSensor && this.props.alarmSensor !== nextProps.alarmSensor) {
                // 전체창 해제
                this.state.isFullPage = false;
                this.state.pageIndex = 0;
            }
        }
    }

    repositionPopup(popupState) {
        let data = popupState.sensorStatus;

        if (data === null || data === undefined)
            return;

        let popupInfo = document.getElementById(this.props.popupType);
        if (popupInfo === null || popupInfo === undefined)
            return;

        popupInfo.style.left = data.x;
        popupInfo.style.top = data.y;
        popupInfo.style.width = data.width;
        popupInfo.style.height = data.height;

        this.setState({ popupInfo: popupInfo });
    }

    setRangeSensorStatus(storeValue) {
        if (storeValue.rangeSensors) {
            // 현재 수치값과 비교
            if (this.isSameRangeSensors(storeValue.rangeSensors) === false) {
                // 수치값 UI 업데이트 
                this.updateRangeSensors();
            }
        }
    }

    onClickFullPage = () => {
        // 팝업창 우선순위
        this.props.setActiveDragPopup(this.props.popupType);

        // 전체모드 및 축소 경우 fullSizeIndex 초기화
        let isFullPage = this.state.isFullPage;
        this.setState({ isFullPage: !isFullPage, fullSizeIndex: -1, pageIndex: 0 });
    }

    updateRangeSensors() {
        let selectedSensors = [...this.props.selectedSensors];
        const isFullPage = this.state.isFullPage;
        const fullSizeIndex = this.state.fullSizeIndex;
        const showPsm = this.state.showPsm;
        const showEtc = this.state.showEtc;

        const alarmSensor = this.props.alarmSensor;
        let isAlarm = false;

        // 알람 여부 확인
        if (alarmSensor) {
            isAlarm = true;
            selectedSensors = [alarmSensor];

        } else if (showPsm === true && showEtc == false) {
            // 누출센서 타입이 선택된 경우
            let _sensors = [];

            _sensors = this.getAllSensors(SDMSResource.facilityType.PSM_SENSOR);
            if (_sensors)
                selectedSensors = _sensors;
        } else if (showPsm === false && showEtc == true) {
            // 기타센서 타입이 선택된 경우
            let _sensors = [];

            _sensors = this.getAllSensors(SDMSResource.facilityType.ETC);
            if (_sensors)
                selectedSensors = _sensors;
        } else if (showPsm === true && showEtc == true) {
            // 누출,기타센서 타입이 선택된 경우
            let _sensors = [];

            _sensors = this.getAllSensors();
            if (_sensors)
                selectedSensors = _sensors;
        }

        // 검색 필터 
        if (isAlarm === false && this.state.searchText.length > 0) {
            selectedSensors = this.filterSensors(selectedSensors, this.state.searchText);
        }

        const sensorCount = selectedSensors.length;


        // 페이징 관련 처리 >> 보여지는 센서 UI만 업데이트
        let ItemCount = SensorStatus.ItemCountSmall;

        // 솔브레인 경우 최대 20개까지
        if (this.state.isFullPage === false &&
            ProjectResource.siteID === ProjectResource.Site.Soulbrain) {
            ItemCount = SensorStatus.ItemCountSoulbrain;
        } else if (this.state.isFullPage === true) {
            ItemCount = this.state.fullSizeCount;
        }


        const beginIndex = ItemCount * this.state.pageIndex;
        const endIndex = ItemCount * (this.state.pageIndex + 1);


        let j = 1;  // 표시중인 센서 순서

        for (let i = 0; i < sensorCount; i++) {
            const sensor = selectedSensors[i];

            // 페이징 처리 X >> 20230314 - K.D.R
            // 센서개수를 세기 위하여 이렇게 한다.
            //if (i < beginIndex || i >= endIndex) {
            //    continue;
            //} else if (fullSizeIndex !== -1 &&
            //    (i < beginIndex + (fullSizeIndex - 1) || i >= endIndex - (ItemCount - fullSizeIndex))) {
            //    j++;
            //    continue;
            //}
            // 단독 센서 인덱스값 외에 제외
            if (fullSizeIndex !== -1 &&
                (i < beginIndex + (fullSizeIndex - 1) || i >= endIndex - (ItemCount - fullSizeIndex))) {
                j++;
                continue;
            }
                
            // 수치 UI 업데이트 jQurey 적용
            this.updateRangeUI(sensor, j);

            j++;
        }
    }

    updateRangeUI(sensor, idx) {
        if (!sensor || !idx)
            return;

        const [range, values, alarmLevel] = this.getSensorRange(sensor);
        const angleValue = this.getAngle(range, values, sensor, alarmLevel);

        const currentValue = this.getSensorValue(sensor);
        const [alarmIconClass, fontClassName, figureIconClass, gageColor, gageBackClass, sensorInfoBoxLine] = this.getAlarmIconClass(alarmLevel, sensor.enabled);




        // 수치 각도 UI 관련 업데이트
        let arrow = document.getElementById("figureSign_" + idx);
        let gage = document.querySelector("#chartSkills_" + idx + " li");
        let gageBack = document.getElementById("chartSkills_" + idx);

        // 화살표 
        if (arrow) {
            let arrowPlay = arrow.animate({ transform: "rotate(" + angleValue + "deg)" }, 500);
            arrowPlay.addEventListener('finish', function () {
                arrow.style.transform = "rotate(" + angleValue + "deg)";
            });
        }
        // 게이지
        if (gage) {
            let gagePlay = gage.animate({ transform: "rotate(" + angleValue + "deg)" }, 500);
            gage.style.color = gageColor;
            gagePlay.addEventListener('finish', function () {
                gage.style.transform = "rotate(" + angleValue + "deg)";
            });
        }
        // 게이지 배경 
        if (gageBack) {
            gageBack.classList.value = gageBackClass;
        }
            

            
     


        // 수치 업데이트
        let currentValueUI = document.getElementById("currentValue_" + idx);
        if (currentValueUI)
            currentValueUI.innerHTML = currentValue;

        // 센서 상태 아이콘 업데이트
        if (currentValueUI)
            currentValueUI.className = fontClassName;

        // 알람 아이콘 >> 전원 아이콘 수정
        let alarmIconUI = document.getElementById("alarmIcon_" + idx);
        if (alarmIconUI)
            alarmIconUI.className = alarmIconClass;

        let figureSignUI = document.getElementById("figureSign_" + idx);
        if (figureSignUI)
            figureSignUI.className = figureIconClass

        // 알람 관련 테두리 
        let sensorInfoBoxUI = document.getElementById("sensorInfoBox_" + idx);
        if (sensorInfoBoxUI) {
            // 기존 삭제
            sensorInfoBoxUI.classList.remove('sensorInfoBoxInterestLine');
            sensorInfoBoxUI.classList.remove('sensorInfoBoxCautionLine');
            sensorInfoBoxUI.classList.remove('sensorInfoBoxBoundaryLine');
            sensorInfoBoxUI.classList.remove('sensorInfoBoxSeriousLine');

            // 현재 레벨 추가
            if (sensorInfoBoxLine)
                sensorInfoBoxUI.classList.add(sensorInfoBoxLine);
        }
    }


    isSameRangeSensors(rangeSensors) {
        const psmSensors = rangeSensors?.rangePsmSensors?.length > 0 ? rangeSensors.rangePsmSensors : [];
        const etcSensors = rangeSensors?.rangeEtcSensors?.length > 0 ? rangeSensors.rangeEtcSensors : [];
        const showPsm = this.state.showPsm;
        const showEtc = this.state.showEtc;
        const alarmSensor = this.props.alarmSensor;
        


        // 선택된 센서 중 값 변경이 있는지 확인
        let selectedRangeSensors = [...this.props.selectedSensors];


        // 알람 여부 확인
        let isAlarm = false;

        if (alarmSensor) {
            isAlarm = true;
            selectedRangeSensors = [alarmSensor];

        } else if (showPsm === true && showEtc == false) {
            // 누출센서 타입이 선택된 경우
            let _sensors = [];

            _sensors = this.getAllSensors(SDMSResource.facilityType.PSM_SENSOR);
            if (_sensors)
                selectedRangeSensors = _sensors;
        } else if (showPsm === false && showEtc == true) {
            // 기타센서 타입이 선택된 경우
            let _sensors = [];

            _sensors = this.getAllSensors(SDMSResource.facilityType.ETC);
            if (_sensors)
                selectedRangeSensors = _sensors;
        } else if (showPsm === true && showEtc == true) {
            // 누출,기타센서 타입이 선택된 경우
            let _sensors = [];

            _sensors = this.getAllSensors();
            if (_sensors)
                selectedRangeSensors = _sensors;
        }

        // 검색 필터 
        if (isAlarm === false && this.state.searchText.length > 0) {
            selectedRangeSensors = this.filterSensors(selectedRangeSensors, this.state.searchText);
        }




        let isSame = true;

        for (const sensor of selectedRangeSensors) {
            if (sensor.sensorTypeID === SDMSResource.facilityType.PSM_SENSOR) {
                const selectedSensor = psmSensors.find(x => x.id === sensor.id);

                if (selectedSensor) {
                    if (selectedSensor.currentData !== sensor.currentData) {
                        sensor.currentData = selectedSensor.currentData;
                        isSame = false;
                    }
                } else {
                    isSame = false;
                }
            } else if (sensor.sensorTypeID === SDMSResource.facilityType.ETC) {
                const selectedSensor = etcSensors.find(x => x.id === sensor.id);

                if (selectedSensor) {
                    if (selectedSensor.currentData !== sensor.currentData) {
                        sensor.currentData = selectedSensor.currentData;
                        isSame = false;
                    }
                } else {
                    isSame = false;
                }
            }
        }
       
        return isSame;
    }

    onClickAllView() {
        const allButton = document.getElementById("allButton");
        if (!allButton)
            return;

        let showPsm = true;
        let showEtc = true;

        // 페이징, fullSizeIndex, (알람정보) 초기화
        this.state.fullSizeIndex = -1;
        this.state.pageIndex = 0;


        if (allButton.checked) {
            // 체크한 경우

            // 누출,ETC 체크
            if (this.refPsmButton.current.classList.contains('selected') === false) {
                this.refPsmButton.current.classList.add('selected');
            }
            if (this.refEtcButton && this.refEtcButton.current.classList.contains('selected') === false) {
                this.refEtcButton.current.classList.add('selected');
            }

            // 선택된 센서 해제
            const sensors = [];
            this.props.setRangeSensors(sensors);

        } else {
            // 해제한 경우
           
            // 누출,ETC 체크해제
            if (this.refPsmButton.current.classList.contains('selected')) {
                this.refPsmButton.current.classList.remove('selected');
            }
            if (this.refEtcButton && this.refEtcButton.current.classList.contains('selected')) {
                this.refEtcButton.current.classList.remove('selected');
            }

            showPsm = false;
            showEtc = false;

        }

        this.setState({ showPsm, showEtc });
    }

    togglePsmIcon() {
        let showPsm = true;
        const allButton = document.getElementById("allButton");

        // 페이징, fullSizeIndex, (알람정보) 초기화
        this.state.fullSizeIndex = -1;
        this.state.pageIndex = 0;

        if (this.refPsmButton.current.classList.contains('selected')) {
            // 해제한 경우
            this.refPsmButton.current.classList.remove('selected');
            showPsm = false;

            if (this.refEtcButton.current.classList.contains('selected')) {
                // ETC가 체크된 상태이라면
                // 전체보기 선택해제
                if (allButton?.checked === true)
                    allButton.checked = false;

            } 
        }
        else {
            // 체크한 경우
            this.refPsmButton.current.classList.add('selected');

            // 선택된 센서 해제
            const sensors = [];
            this.props.setRangeSensors(sensors);

            if (this.refEtcButton.current.classList.contains('selected')) {
                // ETC가 체크된 상태이라면

                if (allButton?.checked === false)
                    allButton.checked = true;

            } 
        }

        this.setState({ showPsm: showPsm });
    }

    toggleEtcIcon() {
        let showEtc = true;
        const allButton = document.getElementById("allButton");

        // 페이징, fullSizeIndex, (알람정보) 초기화
        this.state.fullSizeIndex = -1;
        this.state.pageIndex = 0;

        if (this.refEtcButton.current.classList.contains('selected')) {
            // 해제한 경우
            this.refEtcButton.current.classList.remove('selected');
            showEtc = false;

            if (this.refPsmButton.current.classList.contains('selected')) {
                // PSM 체크된 상태이라면

                // 전체보기 선택해제
                if (allButton?.checked === true)
                    allButton.checked = false;
            } 
        }
        else {
            // 체크한 경우
            this.refEtcButton.current.classList.add('selected');

            // 선택된 센서 해제
            const sensors = [];
            this.props.setRangeSensors(sensors);

            if (this.refPsmButton.current.classList.contains('selected')) {
                // PSM 체크된 상태이라면

                // 전체보기 체크되지 않는 상태이라면 체크상태로 변환
                if (allButton?.checked === false) 
                    allButton.checked = true;

            } 
        }

        this.setState({ showEtc: showEtc });
    }
    /*
    changeOrder(orderBySensorID) {
        if (orderBySensorID) {
            if (this.refOrderBySensorID.current.classList.contains(popup.sensorSeq)) {
                return;
            }
        }
        else {
            if (this.refOrderBySensorValue.current.classList.contains(popup.sensorSeq)) {
                return;
            }
        }

        this.setState({ orderBySensorID });
    }
    */

    onKeyPressSearch = (e) => {
        if (e.key === 'Enter') {
            this.onClickSearch();
        }

        return;
    }

    onClickSearch() {
        const searchText = this.refSearchText.current.value;

        if (searchText) {
            this.setState({ searchText: searchText.trim(), pageIndex: 0 });
        }
        else {
            this.setState({ searchText: '' });
        }
    }

    displaySensorCountUI = (enablePsmSensorCount, enableEtcSensorCount) => {
        let displaySensorCountUI = [];
        const sensors = { ...this.props.sensors };
        const alarmSensor = this.props.alarmSensor;

        // 알람 여부 확인
        if (alarmSensor) {
            return displaySensorCountUI;
        }

        const psmSensorCount = sensors?.rangePsmSensors?.length > 0 ? sensors.rangePsmSensors.length : 0;
        const etcSensorCount = sensors?.rangeEtcSensors?.length > 0 ? sensors.rangeEtcSensors.length : 0;

        if (enablePsmSensorCount > 0) {
            displaySensorCountUI.push(
                <div key={"psmCount"} className={'leakNumBox'}>
                    <span className={'leckCheckIcon'}></span>
                    <span className={'leckNum'}>{i18n.t('facilityType.누출')} ({enablePsmSensorCount}/{psmSensorCount})</span>
                </div>);
        }
        if (enableEtcSensorCount > 0) {
            displaySensorCountUI.push(
                <div key={"etcCount"} className={'etcNumBox'}>
                    <span className={'etcCheckIcon'}></span>
                    <span className={'etcNum'}>{i18n.t('facilityType.기타')} ({enableEtcSensorCount}/{etcSensorCount})</span>
                </div>
            );
        }

        return displaySensorCountUI;
    }


    displayUI = (enablePsmSensorCount, enableEtcSensorCount) => {
        let displayUI = [];

        const psmIconClassName = this.state.showPsm ? 'psmIcon' + " " + 'selected' : 'psmIcon';
        const etcIconClassName = this.state.showEtc ? 'etcIcon' + " " + 'selected' : 'etcIcon';


        displayUI.push(
            <>
                <div className={'sensorIconFlex'}>
                    <div className={'sensorIconBox'}>
                        <span ref={this.refPsmButton} id={"refPsmButton"} className={psmIconClassName} onClick={() => this.togglePsmIcon()}></span>
                        <span ref={this.refEtcButton} id={"refEtcButton"} className={etcIconClassName} onClick={() => this.toggleEtcIcon()}></span>
                    </div>
                    <span className={'fullView'}>
                        <label>
                            <input ref={this.refAllView} type="checkbox" id="allButton" name="" value="" onClick={() => this.onClickAllView()} />
                            <span>{i18n.t('sdms.sensorStatus.센서 전체보기')}</span>
                        </label>
                    </span>
                </div>
                <div className={'sensorSearchBox'}>
                    <input ref={this.refSearchText} type="text" className={'sensorSearchBlank'} onKeyPress={(e) => this.onKeyPressSearch(e)} />
                    <span className={'sensorSearch'} onClick={() => this.onClickSearch()}></span>
                </div>
                <div className={'sensorNumBox'}>
                    { this.displaySensorCountUI(enablePsmSensorCount, enableEtcSensorCount) }
                </div>
            </>
        );

        return displayUI;
    } 

    isNumeric = (str) => {
        if (typeof str != "string" && typeof str != "number") return false // we only process strings!
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }

    getSensorRange(sensor) {
        let min = null, max = null;

        let range = 0;
        const values = [];
        let alarmLevel = 0;

        let limitUses = null;
        let limitValues = null;

        let limits = sensor.limitValue?.split('|');
        if (limits?.length >= 2) {
            limitUses = limits[0]?.split(',');
            limitValues = limits[1]?.split(',');
        }


       
        // limitType 일반형 경우
        if (sensor.limitType === 1 || sensor.limitType === 2) {
            // 1. 수치 정보가 숫자인지 문자인지 확인 >> limitBase 확인
            if (this.isNumeric(sensor.limitBase)) {
                // 숫자일 경우
                // min, max 차이 구하기 - range
                // 현재 알람 상태 구하기 - alarmLevel
                // 각 단계별로 임계치 값 - values


                // 단계 사용여부 배열에 따라
                if (limitUses?.length > 0) {
                    let limitBase = parseFloat(sensor.limitBase);
                    min = limitBase;
                    max = limitBase;

                    for (let i = 0; i < limitUses.length; i++) {
                        if (limitUses[i] === "True" && this.isNumeric(limitValues[i])) {
                            let num = parseFloat(limitValues[i]);
                            let base = parseFloat(sensor.limitBase);

                            let currentData = 0;
                            if (parseFloat(sensor.currentData) !== NaN)
                                currentData = parseFloat(sensor.currentData);

                            // 단계별 임계치 값 배열
                            values.push([i + 1, num]);

                            // min, max  값 구하기
                            if (min === null || min > num) {
                                min = num;
                            }
                            if (max === null || max < num) {
                                max = num;
                            }

                            // 현재 알람상태 구하기
                            if ((num > base && currentData >= num) ||
                                (num < base && currentData <= num)) {
                                alarmLevel = i + 1;
                            }
                        }
                    }
                } else {
                    // 임계치가 없을 경우
                    if (sensor.status !== null && sensor.status !== undefined)
                        alarmLevel = sensor.status;
                }


            } else {
                // 문자일 경우
                // range 값은 null
                // 현재값과 임계치와 일치하는 알람 상태 - alarmLevel
                // 각 단계별로 임계치 값 - values

                // 단계 사용여부 배열에 따라
                if (limitUses?.length > 0) {
                    for (let i = 0; i < limitUses.length; i++) {
                        if (limitUses[i] === "True") {
                            let currentData = sensor.currentData;

                            // 단계별 임계치 값 배열
                            values.push([i + 1, limitValues[i]]);

                            // 현재 알람상태 구하기
                            if (currentData === limitValues[i]) {
                                alarmLevel = i + 1;
                            }
                        }
                    }
                } else {
                    // 임계치가 없는 경우
                    if (sensor.status !== null && sensor.status !== undefined)
                        alarmLevel = sensor.status;
                }

            }
        }

        if (max !== null && min !== null)
            range = max - min;

        return [range, values, alarmLevel];
    }



    getClassName(range, value, min) {
        const num = value[0];
        const data = value[1] - min;
        const isFullPage = this.state.isFullPage;
        const fullSizeIndex = this.state.fullSizeIndex;
        const alarmSensor = this.props.alarmSensor;
        
        let isAlarm = false;
        // 알람 여부 확인
        if (alarmSensor) {
            isAlarm = true;
        }

        let halfCircleText = "halfCircleText_"; 

        //if ((fullSizeIndex !== -1 || isAlarm) && isFullPage === false)
        //    halfCircleText = "halfCircleTextL_"; 

        // 화면 크기에 따라서 각각 UI 변동 필요
        const element = document.getElementById(this.props.popupType);

        if (element && isFullPage === false) {
            const clientWidth = element.clientWidth;
            const clientHeight = element.clientHeight;

            if (clientWidth > 2840 && clientHeight > 2780) {
                if (fullSizeIndex !== -1 || isAlarm) {
                    halfCircleText = "halfCircleText5L_";
                } else {
                    halfCircleText = "halfCircleText5L_";
                }
            } else if (clientWidth > 2400 && clientHeight > 2040) {
                if (fullSizeIndex !== -1 || isAlarm) {
                    halfCircleText = "halfCircleText5L_";
                } else {
                    halfCircleText = "halfCircleText4L_";
                }
            } else if (clientWidth > 1980 && clientHeight > 1500) {
                if (fullSizeIndex !== -1 || isAlarm) {
                    halfCircleText = "halfCircleText5L_";
                } else {
                    halfCircleText = "halfCircleText3L_";
                }
            } else if (clientWidth > 1300 && clientHeight > 1300) {
                if (fullSizeIndex !== -1 || isAlarm) {
                    halfCircleText = "halfCircleText5L_";
                } else {
                    halfCircleText = "halfCircleText2L_";
                }
            } else if (clientWidth > 1040 && clientHeight > 1040) {
                if (fullSizeIndex !== -1 || isAlarm) {
                    halfCircleText = "halfCircleText4L_";
                } else {
                    halfCircleText = "halfCircleText2L_";
                }
            } else if (clientWidth > 720 && clientHeight > 790) {
                if (fullSizeIndex !== -1 || isAlarm) {
                    halfCircleText = "halfCircleText3L_";
                } else {
                    halfCircleText = "halfCircleTextL_";
                }
            } else if (clientWidth > 620 && clientHeight > 680) {
                if (fullSizeIndex !== -1 || isAlarm) {
                    halfCircleText = "halfCircleText2L_";
                } else {
                    halfCircleText = "halfCircleTextL_";
                }
            } else if (clientWidth > 520 && clientHeight > 540) {
                if (fullSizeIndex !== -1 || isAlarm) {
                    halfCircleText = "halfCircleText2L_";
                }
            } else if (clientWidth > 380 && clientHeight > 460) {
                if (fullSizeIndex !== -1 || isAlarm) {
                    halfCircleText = "halfCircleTextL_";
                }
            }
        }


        let angle = parseInt(data * 180 / range);

        if (angle < 0)
            angle = 0;
        else if (angle > 180)
            angle = 180;

        return [halfCircleText + angle, num];
    }

    getAlarmValues(range, values) {
        const items = [];

        for (const value of values) {
            const [className, num] = this.getClassName(range, value);
            items.push(<span class={className}>{num}</span>);
        }

        return items;
    }

    getChartItems(range, values, sensor) {
        const isFullPage = this.state.isFullPage;
        const alarmSensor = this.props.alarmSensor;

        let isAlarm = false;
        // 알람 여부 확인
        if (alarmSensor) {
            isAlarm = true;
        }

        const items = [];

        
        let sensorInfoBox = 'sensorInfoBoxSmall';
        let sizeLevel = 0;

        const fullSizeIndex = this.state.fullSizeIndex;
        let halfCircleText = "halfCircleText_";

        let sensorInfoGrid = "sensorInfoNoGrid";        

        if ((fullSizeIndex !== -1 || isAlarm) && isFullPage === false) {
        //    halfCircleText = "halfCircleTextL_";
            sensorInfoBox = 'sensorInfoBox';            
        }
            

        // 화면 크기에 따라서 각각 UI 변동 필요
        const element = document.getElementById(this.props.popupType);

        if (element && isFullPage === false) {
            const clientWidth = element.clientWidth;
            const clientHeight = element.clientHeight;

            if (clientWidth > 2840 && clientHeight > 2780) {
                sizeLevel = 9;

                if (fullSizeIndex !== -1 || isAlarm) {
                    halfCircleText = "halfCircleText5L_";
                    sensorInfoBox = 'sensorInfoBox5L';
                } else {
                    halfCircleText = "halfCircleText5L_";
                    sensorInfoBox = 'sensorInfoBox5L';
                }

                sensorInfoGrid = "sensorInfoGrid";
            } else if (clientWidth > 2400 && clientHeight > 2040) {
                sizeLevel = 8;

                if (fullSizeIndex !== -1 || isAlarm) {
                    halfCircleText = "halfCircleText5L_";
                    sensorInfoBox = 'sensorInfoBox5L';
                } else {
                    halfCircleText = "halfCircleText4L_";
                    sensorInfoBox = 'sensorInfoBox4L';
                }

                sensorInfoGrid = "sensorInfoGrid";
            } else if (clientWidth > 1980 && clientHeight > 1500) {
                sizeLevel = 7;

                if (fullSizeIndex !== -1 || isAlarm) {
                    halfCircleText = "halfCircleText5L_";
                    sensorInfoBox = 'sensorInfoBox5L';
                } else {
                    halfCircleText = "halfCircleText3L_";
                    sensorInfoBox = 'sensorInfoBox3L';
                }

                sensorInfoGrid = "sensorInfoGrid";
            } else if (clientWidth > 1300 && clientHeight > 1300) {
                sizeLevel = 6;

                if (fullSizeIndex !== -1 || isAlarm) {
                    halfCircleText = "halfCircleText5L_";
                    sensorInfoBox = 'sensorInfoBox5L';
                } else {
                    halfCircleText = "halfCircleText3L_";
                    sensorInfoBox = 'sensorInfoBox3L';
                }

                sensorInfoGrid = "sensorInfoGrid";
            } else if (clientWidth > 1040 && clientHeight > 1040) {
                sizeLevel = 5;

                if (fullSizeIndex !== -1 || isAlarm) {
                    halfCircleText = "halfCircleText4L_";
                    sensorInfoBox = 'sensorInfoBox4L';
                } else {
                    halfCircleText = "halfCircleText2L_";
                    sensorInfoBox = 'sensorInfoBox2L';
                }

                sensorInfoGrid = "sensorInfoGrid";
            } else if (clientWidth > 720 && clientHeight > 790) {
                sizeLevel = 4;

                if (fullSizeIndex !== -1 || isAlarm) {
                    halfCircleText = "halfCircleText3L_";
                    sensorInfoBox = 'sensorInfoBox3L';
                } else {
                    halfCircleText = "halfCircleTextL_";
                    sensorInfoBox = 'sensorInfoBoxL';
                }

                sensorInfoGrid = "sensorInfoGrid";
            } else if (clientWidth > 620 && clientHeight > 680) {
                sizeLevel = 3;

                if (fullSizeIndex !== -1 || isAlarm) {
                    halfCircleText = "halfCircleText2L_";
                    sensorInfoBox = 'sensorInfoBox2L';
                } else {
                    halfCircleText = "halfCircleTextL_";
                    sensorInfoBox = 'sensorInfoBoxL';
                }

                sensorInfoGrid = "sensorInfoGrid";
            } else if (clientWidth > 520 && clientHeight > 540) {
                sizeLevel = 2;

                if (fullSizeIndex !== -1 || isAlarm) {
                    halfCircleText = "halfCircleText2L_";
                    sensorInfoBox = 'sensorInfoBox2L';
                } else {
                    sensorInfoBox = 'sensorInfoBox';
                }

                sensorInfoGrid = "sensorInfoGrid";
            } else if (clientWidth > 380 && clientHeight > 460) {
                sizeLevel = 1;

                if (fullSizeIndex !== -1 || isAlarm) {
                    halfCircleText = "halfCircleTextL_";
                    sensorInfoBox = 'sensorInfoBoxL';
                } else {
                    sensorInfoBox = 'sensorInfoBox';
                }

                sensorInfoGrid = "sensorInfoGrid";
            }
        }

        this.state.sizeLevel = sizeLevel;


        // limitType 일반형 경우
        if (sensor.limitType === 1) {
            
            // 1. 수치 정보가 숫자인지 문자인지 확인 >> limitBase 확인
             if (this.isNumeric(sensor.limitBase) && values?.length > 0) {
                // 숫자인 경우
                let min = 0, max = 0;
                
                // 임계치 배열 중에서 좌,우에 배치할 min, max 값을 구한다.

                let limitBase = parseFloat(sensor.limitBase);

                let currentData = 0;
                if (this.isNumeric(sensor.currentData))
                    currentData = parseFloat(sensor.currentData);


                min = limitBase;
                max = limitBase;

                for (const value of values) {
                    if (this.isNumeric(value[1])) {
                        let num = parseFloat(value[1]);

                        if (min > num)
                            min = num;
                        else if (max < num)
                            max = num;
                    }
                }

                // range를 확인하여 limitBase 및 임계치 각 단계 별로 각도를 구하여 items를 구성
                 let chkLimitBase = false;      // limitBase 포함 여부 체크

                // min 경우
                if (min === limitBase) {
                    items.push(<span key={sensor.id + "_" + sensor.sensorTypeID + "_0"} className={halfCircleText + "0"}>0</span>);
                    chkLimitBase = true;
                } else {
                    for (const value of values) {
                        if (this.isNumeric(value[1])) {
                            let num = parseFloat(value[1]);
                            let level = value[0];

                            if (min === num) {
                                items.push(<span key={sensor.id + "_" + sensor.sensorTypeID + "_" + level} className={halfCircleText + "0"}>{level}</span>);
                                break;
                            }
                        }
                    }
                }

                // max 경우
                if (max === limitBase) {
                    items.push(<span key={sensor.id + "_" + sensor.sensorTypeID + "_0"} className={halfCircleText + "180"}>0</span>);
                    chkLimitBase = true;
                } else {
                    for (const value of values) {
                        if (this.isNumeric(value[1])) {
                            let num = parseFloat(value[1]);
                            let level = value[0];

                            if (max === num) {
                                items.push(<span key={sensor.id + "_" + sensor.sensorTypeID + "_" + level} className={halfCircleText + "180"}>{level}</span>);
                                break;
                            }
                        }
                    }
                }

                 // items에 limitBase가 포함되지 않았다면
                 if (chkLimitBase === false) {
                     const value = [0, limitBase];
                     const [className, level] = this.getClassName(range, value, min);
                     items.push(<span key={sensor.id + "_" + sensor.sensorTypeID + "_" + level} className={className}>{level}</span>);
                 }

                for (const value of values) {
                    if (this.isNumeric(value[1])) {
                        let num = parseFloat(value[1]);

                        if (min === parseFloat(value[1]) ||
                            max === parseFloat(value[1]))
                            continue;

                        const [className, level] = this.getClassName(range, value, min);
                        items.push(<span key={sensor.id + "_" + sensor.sensorTypeID + "_" + level} className={className}>{level}</span>);
                    }
                }

            } else {
                // 문자인 경우               
                 if (values?.length > 0) {
                     // 임계치가 있을 경우 임계치 갯수 만큼 나눠 각도를 구하여 items를 구성
                     let cnt = values?.length;
                     let split = 180;
                     let angle = 0;

                     split = Math.floor(180 / cnt);

                     items.push(<span key={sensor.id + "_" + sensor.sensorTypeID + "_0"} className={halfCircleText + "0"}>0</span>);

                     for (let i = 0; i < values.length; i++) {
                         let value = values[i];

                         angle += split;
                         let level = value[0];

                         items.push(<span key={sensor.id + "_" + sensor.sensorTypeID + "_" + level} className={halfCircleText + angle}>{level}</span>);
                     }
                 }
                 else {
                     // 임계치가 없을 경우 관심(45), 주의(90), 경계(135), 심각(180)로 임의로 잡아 items를 구성
                     items.push(<span key={sensor.id + "_" + sensor.sensorTypeID + "_0"} className={halfCircleText + "0"}>0</span>);
                     items.push(<span key={sensor.id + "_" + sensor.sensorTypeID + "_1"} className={halfCircleText + "45"}>1</span>);
                     items.push(<span key={sensor.id + "_" + sensor.sensorTypeID + "_2"} className={halfCircleText + "90"}>2</span>);
                     items.push(<span key={sensor.id + "_" + sensor.sensorTypeID + "_3"} className={halfCircleText + "135"}>3</span>);
                     items.push(<span key={sensor.id + "_" + sensor.sensorTypeID + "_4"} className={halfCircleText + "180"}>4</span>);
                 }
            }
        }

        //return [items, stickItems];
        return [items, sensorInfoBox, sensorInfoGrid];
    }

    getAngle(range, values, sensor, alarmLevel) {
        let retAngle = 0;

        // limitType 일반형 경우
        if (sensor.limitType === 1) {

            // 1. 수치 정보가 숫자인지 문자인지 확인 >> limitBase 확인
            if (this.isNumeric(sensor.limitBase) && values?.length > 0) {
                // 숫자인 경우
                let min = 0, max = 0;

                // min, max 값을 구한다.
                let limitBase = parseFloat(sensor.limitBase);

                let currentData = 0;
                if (this.isNumeric(sensor.currentData))
                    currentData = parseFloat(sensor.currentData);

                min = limitBase;
                max = limitBase;

                for (const value of values) {
                    if (this.isNumeric(value[1])) {
                        let num = parseFloat(value[1]);

                        if (min > num)
                            min = num;
                        else if (max < num)
                            max = num;
                    }
                }


                let data = currentData - min;
                let angle = parseInt(data * 180 / range);

                if (angle < 0)
                    angle = 0;
                else if (angle > 180)
                    angle = 180;


                retAngle = angle;

            } else {
                // 문자인 경우               
                if (values?.length > 0) {
                    // 임계치가 있을 경우 임계치 갯수 만큼 나눠 각도를 구하여 items를 구성
                    let cnt = values.length;
                    let split = 180;
                    let angle = 0;

                    split = Math.floor(180 / cnt);

                    for (let i = 0; i < cnt; i++) {
                        let value = values[i];
                        angle += split;

                        if (value[1] === sensor.currentData) {
                            retAngle = angle;
                            break;
                        }
                    }
                }
                else {
                    // 임계치가 없을 경우 관심(45), 주의(90), 경계(135), 심각(180)로 임의로 잡아 items를 구성
                    if (sensor.status === 1) {
                        // 관심
                        retAngle = 45;
                    } else if (sensor.status === 2) {
                        // 주의
                        retAngle = 90;
                    } else if (sensor.status === 3) {
                        // 경계
                        retAngle = 135;
                    } else if (sensor.status === 4) {
                        // 심각
                        retAngle = 180;
                    }
                }
            }
        }

        return retAngle;
    }

    initAlarmIcon(alarmLevel, idx, enabled) {
        let alarmIcon = <span id={"alarmIcon_" + idx.toString()} className={'sensorStepNormal'}></span>;    // 전원여부 아이콘으로 수정
        let figureIcon = <span id={"figureSign_" + idx.toString()} className={'figureSignNormal'}></span>;
        let fontClassName = 'numBoldNormal';
        let sensorInfoBoxLine = "";

        if (alarmLevel === 1) {
            //alarmIcon = <span id={"alarmIcon_" + idx.toString()} className={popup.sensorStepInterest}></span>;
            figureIcon = <span id={"figureSign_" + idx.toString()} className={'figureSignInterest'}></span>;
            fontClassName = 'numBoldInterest';
            sensorInfoBoxLine = 'sensorInfoBoxInterestLine';
        } else if (alarmLevel === 2) {
            //alarmIcon = <span id={"alarmIcon_" + idx.toString()} className={popup.sensorStepCaution}></span>;
            figureIcon = <span id={"figureSign_" + idx.toString()} className={'figureSignCaution'}></span>;
            fontClassName = 'numBoldCaution';
            sensorInfoBoxLine = 'sensorInfoBoxCautionLine';
        } else if (alarmLevel === 3) {
            //alarmIcon = <span id={"alarmIcon_" + idx.toString()} className={popup.sensorStepBoundary}></span>;
            figureIcon = <span id={"figureSign_" + idx.toString()} className={'figureSignBoundary'}></span>;
            fontClassName = 'numBoldBoundary';
            sensorInfoBoxLine = 'sensorInfoBoxBoundaryLine';
        } else if (alarmLevel === 4) {
            //alarmIcon = <span id={"alarmIcon_" + idx.toString()} className={popup.sensorStepSerious}></span>;
            figureIcon = <span id={"figureSign_" + idx.toString()} className={'figureSignSerious'}></span>;
            fontClassName = 'numBoldSerious';
            sensorInfoBoxLine = 'sensorInfoBoxSeriousLine';
        }

        if (enabled === false) {
            alarmIcon = <span id={"alarmIcon_" + idx.toString()} className={'sensorStepNone'}></span>;
            figureIcon = <span id={"figureSign_" + idx.toString()} className={'figureSignNone'}></span>;
            fontClassName = 'numBoldNone';
            sensorInfoBoxLine = "";
        }

        return [alarmIcon, figureIcon, fontClassName, sensorInfoBoxLine];
    }

    getAlarmIconClass(alarmLevel, enabled) {
        let alarmIconClass = 'sensorStepNormal';
        let fontClassName = 'numBoldNormal';
        let figureIconClass = 'figureSignNormal';
        let gageColor = "#17C572";
        let gageBackClass = 'chartSkills' + " " + 'backNormal';
        let sensorInfoBoxLine = null;

        if (alarmLevel === 1) {
            //alarmIconClass = popup.sensorStepInterest;
            fontClassName = 'numBoldInterest';
            figureIconClass = 'figureSignInterest';
            gageColor = "#2e47ff";
            gageBackClass = 'chartSkills' + " " + 'backInterest';
            sensorInfoBoxLine = 'sensorInfoBoxInterestLine';
        } else if (alarmLevel === 2) {
            //alarmIconClass = popup.sensorStepCaution;
            fontClassName = 'numBoldCaution';
            figureIconClass = 'figureSignCaution';
            gageColor = "#fff100";
            gageBackClass = 'chartSkills' + " " + 'backCaution';
            sensorInfoBoxLine = 'sensorInfoBoxCautionLine';
        } else if (alarmLevel === 3) {
            //alarmIconClass = popup.sensorStepBoundary;
            fontClassName = 'numBoldBoundary';
            figureIconClass = 'figureSignBoundary';
            gageColor = "#F67B00";
            gageBackClass = 'chartSkills' + " " + 'backBoundary';
            sensorInfoBoxLine = 'sensorInfoBoxBoundaryLine';
        } else if (alarmLevel === 4) {
            //alarmIconClass = popup.sensorStepSerious;
            fontClassName = 'numBoldSerious';
            figureIconClass = 'figureSignSerious';
            gageColor = "#fe022e";
            gageBackClass = 'chartSkills' + " " + 'backSerious';
            sensorInfoBoxLine = 'sensorInfoBoxSeriousLine';
        }

        if (enabled === false) {
            alarmIconClass = 'sensorStepNone';
            figureIconClass = 'figureSignNone';
            fontClassName = 'numBoldNone';
            gageBackClass = 'chartSkills' + " " + 'backNormal';
            gageColor = "#223641";
            sensorInfoBoxLine = null;
        }

        return [alarmIconClass, fontClassName, figureIconClass, gageColor, gageBackClass, sensorInfoBoxLine];
    }

    // 오름차순
    static compareSensorByValue(sensor1, sensor2) {
        if (sensor1.currentData === null || sensor1.currentData === undefined) {
            if (sensor2.currentData === null || sensor2.currentData === undefined)
                return 0;
            else
                return 1;
        }
        else if (sensor2.currentData === null || sensor2.currentData === undefined)
            return 1;

        if (sensor1.currentData < sensor2.currentData)
            return 1;
        else if (sensor1.currentData > sensor2.currentData)
            return -1;

        return 0;
    }

    // 센서 이름 오름차순
    static compareSensorByName(sensor1, sensor2) {
        if (sensor1.name === null || sensor1.name === undefined) {
            if (sensor2.name === null || sensor2.name === undefined)
                return 0;
            else
                return 1;
        }
        else if (sensor2.name === null || sensor2.name === undefined)
            return 1;

        if (sensor1.name < sensor2.name)
            return 1;
        else if (sensor1.name > sensor2.name)
            return -1;

        return 0;
    }

    filterSensors(sensors, searchText) {
        const _sensors = [];

        for (const sensor of sensors) {
            if (sensor.name.includes(searchText)) {
                _sensors.push(sensor);
            }
            else {
                const subData = this.getSensorSubData(sensor);

                if (subData.includes(searchText)) {
                    _sensors.push(sensor);
                }
            }
        }

        return _sensors;
    }

    getSensorSubData(sensor) {
        let data = sensor.materialType;

        /*if (sensor.buildingName !== null && sensor.buildingName.length > 0)
            data += ", " + sensor.buildingName;*/

        if (sensor.zoneName !== null && sensor.zoneName.length > 0)
            data += ", " + sensor.zoneName;

        return data;
    }

    getAllSensors = (type) => {
        const sensors = { ...this.props.sensors };
        let _sensors = [];

        const psmSensors = sensors?.rangePsmSensors?.length > 0 ? sensors.rangePsmSensors : [];
        const etcSensors = sensors?.rangeEtcSensors?.length > 0 ? sensors.rangeEtcSensors : [];

        if (type === null || type === undefined || type === SDMSResource.facilityType.PSM_SENSOR) {
            for (const sensor of psmSensors) {
                _sensors.push(sensor);
            }
        }

        if (type === null || type === undefined || type === SDMSResource.facilityType.ETC) {
            for (const sensor of etcSensors) {
                _sensors.push(sensor);
            }
        }
        
        // 센서 이름 오름차순
        _sensors.sort(SensorStatus.compareSensorByName);

        return _sensors;
    }

    getSensorItems() {
        const items = [];
        let _items = [];

        const showPsm = this.state.showPsm;
        const showEtc = this.state.showEtc;
        const isFullPage = this.state.isFullPage;

        const fullSizeIndex = this.state.fullSizeIndex;
        

        let psmSensorCount = 0, etcSensorCount = 0;

        const alarmSensor = this.props.alarmSensor;

        let isQuadrant = false;

        // 알람여부 판단
        let isAlarm = false;

        // 센서 표시
        let sensors = [...this.props.selectedSensors];

        // 알람 센서가 우선
        if (alarmSensor) {
            isAlarm = true;
            sensors = [alarmSensor];
        } else if (showPsm === true && showEtc === false) {
            // 누출센서 타입이 선택된 경우
            let _sensors = [];

            _sensors = this.getAllSensors(SDMSResource.facilityType.PSM_SENSOR);
            if (_sensors)
                sensors = _sensors;
        } else if (showPsm === false && showEtc === true) {
            // 기타센서 타입이 선택된 경우
            let _sensors = [];

            _sensors = this.getAllSensors(SDMSResource.facilityType.ETC);
            if (_sensors)
                sensors = _sensors;
        } else if (showPsm === true && showEtc === true) {
            // 누출,기타센서 타입이 선택된 경우
            let _sensors = [];

            _sensors = this.getAllSensors();
            if (_sensors)
                sensors = _sensors;
        }

        // 검색 필터 
        if (isAlarm === false && this.state.searchText.length > 0) {
            sensors = this.filterSensors(sensors, this.state.searchText);
        }

        const sensorCount = sensors.length;


        // 페이징 관련 처리 
        let ItemCount = SensorStatus.ItemCountSmall;

        // 솔브레인 경우 최대 20개까지
        if (this.state.isFullPage === false && 
            ProjectResource.siteID === ProjectResource.Site.Soulbrain) {
            ItemCount = SensorStatus.ItemCountSoulbrain;
        } else if (this.state.isFullPage === true) {
            ItemCount = this.state.fullSizeCount;
        }

        const beginIndex = ItemCount * this.state.pageIndex;
        const endIndex = ItemCount * (this.state.pageIndex + 1);
        
        let j = 1;  // 표시하고 있는 센서 순서

        let chkSmall = false;

        for (let i = 0; i < sensorCount; i++) {
            const sensor = sensors[i];

            if (sensor.sensorType === SDMSMainMenu.PSM_Sensor) {
                psmSensorCount++;
            }
            if (sensor.sensorType === SDMSMainMenu.Etc_Sensor) {
                etcSensorCount++;
            }
            
            // 페이징 처리 X >> 20230314 - K.D.R
            // 센서개수를 세기 위하여 이렇게 한다.
            //if (i < beginIndex || i >= endIndex) {
            //    continue;
            //} else if (fullSizeIndex !== -1 &&
            //    (i < beginIndex + (fullSizeIndex - 1) || i >= endIndex - (ItemCount - fullSizeIndex))) {
            //    j++;
            //    continue;
            //}
            // 단독 센서 인덱스값 외에 제외
            if (fullSizeIndex !== -1 &&
                (i < beginIndex + (fullSizeIndex - 1) || i >= endIndex - (ItemCount - fullSizeIndex))) {
                j++;
                continue;
            }

            const [range, values, alarmLevel] = this.getSensorRange(sensor);                                        // 센서 임계치 및 알람 단계 정보 가져오기
            const currentValue = this.getSensorValue(sensor);                                                       // 현재 값, 단위 가져오기
            const [chartItems, sensorInfoBox, sensorInfoGrid] = this.getChartItems(range, values, sensor);                          // 사이즈 별 임계치 눈금 UI 가져오기
            const [alarmIcon, figureIcon, fontClassName, sensorInfoBoxLine] = this.initAlarmIcon(alarmLevel, j, sensor.enabled);       // 알람단계에 따른 아이콘 정보 가져오기

            const index = j;

            chkSmall = chkSmall | (sensorInfoGrid === "sensorContsSmall");

            if ((isAlarm || fullSizeIndex !== -1) && isFullPage === false) {
                let btnUI = null;

                if (isAlarm) {
                    btnUI = <span className={'sensorCheck'} onClick={() => this.clearAlarmRangeSensor()}>확인</span>;
                }

                // 알람 표시 또는 센서 풀사이즈
                items.push(                                                                  /* 클래스 변동해야함 : sensorInfoBox -> sensorInfoBoxSmall */
                    <div key={"sensorInfoBoxUIOne_" + j} id={"sensorInfoBox_" + j.toString()} className={sensorInfoBox + " " + sensorInfoBoxLine} onDoubleClick={(e) => this.showFullSizeSensor(index)}>
                        <span className={'sensorTopBox'}>
                            <span className={'sensorTitleBox'}>
                                <span className={'sensorTitle1'}>{sensor.name}</span>
                            </span>
                            {alarmIcon}
                        </span>
                        <span className={'chartArea'}>
                            <span className={'chartBox'}>

                                {chartItems}

                                <ul id={"chartSkills_" + j.toString()} className={'chartSkills' + " " + 'backNormal'}>
                                    <li></li>
                                </ul>
                                {figureIcon}
                                 <div className={'figure'}><span className={'figureType'}>{sensor.materialType}</span><span className={'line'}></span><span id={"currentValue_" + j.toString()} className={fontClassName}>{currentValue}</span></div>
                            </span>
                        </span> 
                        {btnUI} {/* 이게 원본 */}
                        {/* <span className={'sensorCheck'} onClick={() => this.clearAlarmRangeSensor()}>확인</span> */}
                    </div>
                );
            } else {
                // 평상시 
                let gridClass = "";
                isQuadrant = true;

                let num = index;
                if (num > 4) {
                    num = num % 4;
                }
                   
                if (num === 1) {
                    _items = [];
                    gridClass = 'sensorGrid1';
                } else if (num === 2) {
                    gridClass = 'sensorGrid2';
                } else if (num === 3) {
                    gridClass = 'sensorGrid3';
                } else if (num === 4) {
                    gridClass = 'sensorGrid4';
                }

                _items.push(
                    <div key={"sensorInfoBoxUI_" + gridClass} className={gridClass}>    {/* 클래스 변동해야함 : sensorInfoBox -> sensorInfoBoxSmall */}
                        <div id={"sensorInfoBox_" + j.toString()} className={sensorInfoBox + " " + sensorInfoBoxLine} onDoubleClick={(e) => this.showFullSizeSensor(index)}>
                            <span className={'sensorTopBox'}>
                                <span className={'sensorTitleBox'}>
                                    <span className={'sensorTitle1'}>{sensor.name}</span>
                                </span>
                                {alarmIcon}
                            </span>

                            <span className={'chartArea'}>
                                <span className={'chartBox'}>
                             
                                    {chartItems}

                                    <ul id={"chartSkills_" + j.toString()} className={'chartSkills' + " " + 'backNormal'}>
                                        <li></li>
                                    </ul>
                                    {figureIcon}
                                    <div className={'figure'}><span className={'figureType'}>{sensor.materialType}</span><span className={'line'}></span><span id={"currentValue_" + j.toString()} className={fontClassName}>{currentValue}</span></div>
                                </span>
                            </span>
                        </div>
                    </div>
                );

                if (num === 4 || index === sensorCount) {
                    items.push(
                        <div key={"sensorInfoBoxUIkey_" + sensor.id} className={sensorInfoGrid}> {/* 클래스 변동해야함 : sensorInfoGrid >> sensorInfoNoGrid */}
                            {_items}
                        </div>
                    );
                }
            }

            j++;

        }

        this.maxPageNumber = parseInt((psmSensorCount + etcSensorCount) / ItemCount);

        if ((psmSensorCount + etcSensorCount) % ItemCount > 0)
            this.maxPageNumber += 1;

        let sensorConts = chkSmall === true ? "sensorContsSmall" : "sensorConts";

        return [items, psmSensorCount, etcSensorCount, sensorConts];
    }

    clearAlarmRangeSensor = () => {
        const sensors = this.props.selectedSensors;
        this.props.setRangeSensors(sensors);
    }

    showFullSizeSensor(index) {
        let fullSizeIndex = this.state.fullSizeIndex;
        const isFullPage = this.state.isFullPage;
        const alarmSensor = this.props.alarmSensor;

        if (alarmSensor)
            return;

        if (index === fullSizeIndex || isFullPage === true) {
            this.setState({ fullSizeIndex: -1 });
        } else {
            this.setState({ fullSizeIndex: index });
        }
    }

    getSensorValue(sensor) {
        const currentData = sensor.currentData;
        if (currentData === null || currentData === undefined) 
            return "";
        
        let result = currentData;

        if (sensor.uom !== null && sensor.uom !== undefined)
            result += " " + sensor.uom;

        return result;
    }

    onClickPage(pageIndex) {
        this.setState({ pageIndex });
    }

    getPageContents(obj) {
        const currentPageIndex = this.state.pageIndex + 1;
        const isFullPage = this.state.isFullPage;

        // 전체창 아닌 경우 페이징 처리X 
        if ((currentPageIndex <= 1 && this.maxPageNumber <= 1)
            || isFullPage === false) {
            obj.showPagination = false;
            return <></>;
        }

        let beginPageIndex = currentPageIndex % SensorStatus.PaginationCount === 0 ? parseInt(currentPageIndex / SensorStatus.PaginationCount) : parseInt(currentPageIndex / SensorStatus.PaginationCount) + 1;
        beginPageIndex = SensorStatus.PaginationCount * (beginPageIndex - 1) + 1;
        let endPageIndex = beginPageIndex + SensorStatus.PaginationCount - 1;

        if (endPageIndex > this.maxPageNumber)
            endPageIndex = this.maxPageNumber;

        const pageItems = [];

        if (beginPageIndex > 1) {
            const pageIndex = beginPageIndex - 2;
            pageItems.push(<li><a className={'arrowLeft'} onClick={() => this.onClickPage(pageIndex)}></a></li>);
        }

        for (let i = beginPageIndex; i <= endPageIndex; i++) {
            const pageIndex = i - 1;

            if (i === currentPageIndex) {
                pageItems.push(<li><a className={'num' + " " + 'active'} onClick={() => this.onClickPage(pageIndex)}>{i}</a></li>);
            }
            else {
                pageItems.push(<li><a className={'num'} onClick={() => this.onClickPage(pageIndex)}>{i}</a></li>);
            }
        }

        if (endPageIndex < this.maxPageNumber) {
            pageItems.push(<li><a className={'arrowRight'} onClick={() => this.onClickPage(endPageIndex)}></a></li>);
        }

        obj.showPagination = true;

        return (
            <div className={'sensorPaging'}>
                <ul className={'pagination' + " " + 'modal'}>
                    {
                        pageItems
                    }
                </ul>
            </div>
        );
    }

    //팝업 리사이즈 이벤트 리스너
    popupResizeMouseMove = (event) => {
        //// 화면 크기에 따라서 각각 UI 변동 필요
        //const element = document.getElementById(this.props.popupType);

        //const sizeLevel = this.state.sizeLevel;
        //let currentLevel = 0;

        //if (element) {
        //    const clientWidth = element.clientWidth;
        //    const clientHeight = element.clientHeight;

        //    if (clientWidth > 2840 && clientHeight > 2780) {
        //        currentLevel = 9;
        //    } else if (clientWidth > 2400 && clientHeight > 2040) {
        //        currentLevel = 8;
        //    } else if (clientWidth > 1980 && clientHeight > 1500) {
        //        currentLevel = 7;
        //    } else if (clientWidth > 1300 && clientHeight > 1300) {
        //        currentLevel = 6;
        //    } else if (clientWidth > 1040 && clientHeight > 1040) {
        //        currentLevel = 5;
        //    } else if (clientWidth > 720 && clientHeight > 790) {
        //        currentLevel = 4;
        //    } else if (clientWidth > 620 && clientHeight > 680) {
        //        currentLevel = 3;
        //    } else if (clientWidth > 520 && clientHeight > 540) {
        //        currentLevel = 2;
        //    } else if (clientWidth > 360 && clientHeight > 460) {
        //        currentLevel = 1;
        //    }

        //}

        //if (sizeLevel !== currentLevel) {
        //    console.log("change level");
        //    this.setState({ sizeLevel: currentLevel })
        //}
        this.checkSizeLevel();
    }

    checkSizeLevel = () => {
        // 화면 크기에 따라서 각각 UI 변동 필요
        const element = document.getElementById(this.props.popupType);

        const sizeLevel = this.state.sizeLevel;
        let currentLevel = 0;

        if (element) {
            const clientWidth = element.clientWidth;
            const clientHeight = element.clientHeight;

            if (clientWidth > 2840 && clientHeight > 2780) {
                currentLevel = 9;
            } else if (clientWidth > 2400 && clientHeight > 2040) {
                currentLevel = 8;
            } else if (clientWidth > 1980 && clientHeight > 1500) {
                currentLevel = 7;
            } else if (clientWidth > 1300 && clientHeight > 1300) {
                currentLevel = 6;
            } else if (clientWidth > 1040 && clientHeight > 1040) {
                currentLevel = 5;
            } else if (clientWidth > 720 && clientHeight > 790) {
                currentLevel = 4;
            } else if (clientWidth > 620 && clientHeight > 680) {
                currentLevel = 3;
            } else if (clientWidth > 520 && clientHeight > 540) {
                currentLevel = 2;
            } else if (clientWidth > 360 && clientHeight > 460) {
                currentLevel = 1;
            }

        }

        if (sizeLevel !== currentLevel) {
            console.log("change level");
            this.setState({ sizeLevel: currentLevel })
        }
    }

    getDangerStepUI = () => {
        const actionStep = SopManagerResource.actionStep;
        let dangerStepUI = <div className={'dangerSteps'}>
            <span className={'normal'}><span className={'normalCircle'}></span>{actionStep._0st}</span>
            <span className={'interest'}><span className={'interestCircle'}></span>{actionStep._1st}</span>
            <span className={'caution'}><span className={'cautionCircle'}></span>{actionStep._2nd}</span>
            <span className={'boundary'}><span className={'boundaryCircle'}></span>{actionStep._3rd}</span>
            <span className={'serious'}><span className={'seriousCircle'}></span>{actionStep._4st}심각</span>
        </div>;

        // 화면 크기에 따라서 각각 UI 변동 필요
        const element = document.getElementById(this.props.popupType);

        if (element) {
            const clientWidth = element.clientWidth;
            const clientHeight = element.clientHeight;

            if (clientWidth > 1300 && clientHeight > 1300) {
                dangerStepUI = <div className={'dangerSteps'}>
                    <span className={'normal5L'}><span className={'normalCircle5L'}></span>{actionStep._0st}</span>
                    <span className={'interest5L'}><span className={'interestCircle5L'}></span>{actionStep._1st}</span>
                    <span className={'caution5L'}><span className={'cautionCircle5L'}></span>{actionStep._2nd}</span>
                    <span className={'boundary5L'}><span className={'boundaryCircle5L'}></span>{actionStep._3rd}</span>
                    <span className={'serious5L'}><span className={'seriousCircle5L'}></span>{actionStep._4st}심각</span>
                </div>;
            } else if (clientWidth > 1040 && clientHeight > 1040) {
                dangerStepUI = <div className={'dangerSteps'}>
                    <span className={'normal4L'}><span className={'normalCircle4L'}></span>{actionStep._0st}</span>
                    <span className={'interest4L'}><span className={'interestCircle4L'}></span>{actionStep._1st}</span>
                    <span className={'caution4L'}><span className={'cautionCircle4L'}></span>{actionStep._2nd}</span>
                    <span className={'boundary4L'}><span className={'boundaryCircle4L'}></span>{actionStep._3rd}</span>
                    <span className={'serious4L'}><span className={'seriousCircle4L'}></span>{actionStep._4st}심각</span>
                </div>;
            } else if (clientWidth > 720 && clientHeight > 750) {
                dangerStepUI = <div className={'dangerSteps'}>
                    <span className={'normal3L'}><span className={'normalCircle3L'}></span>{actionStep._0st}</span>
                    <span className={'interest3L'}><span className={'interestCircle3L'}></span>{actionStep._1st}</span>
                    <span className={'caution3L'}><span className={'cautionCircle3L'}></span>{actionStep._2nd}</span>
                    <span className={'boundary3L'}><span className={'boundaryCircle3L'}></span>{actionStep._3rd}</span>
                    <span className={'serious3L'}><span className={'seriousCircle3L'}></span>{actionStep._4st}심각</span>
                </div>;
            } else if (clientWidth > 520 && clientHeight > 540) {
                dangerStepUI = <div className={'dangerSteps'}>
                    <span className={'normal2L'}><span className={'normalCircle2L'}></span>{actionStep._0st}</span>
                    <span className={'interest2L'}><span className={'interestCircle2L'}></span>{actionStep._1st}</span>
                    <span className={'caution2L'}><span className={'cautionCircle2L'}></span>{actionStep._2nd}</span>
                    <span className={'boundary2L'}><span className={'boundaryCircle2L'}></span>{actionStep._3rd}</span>
                    <span className={'serious2L'}><span className={'seriousCircle2L'}></span>{actionStep._4st}심각</span>
                </div>;
            } /* else if (clientWidth > 360 && clientHeight > 460) {
                dangerStepUI = <div className={'dangerSteps'}>
                    <span className={'normal2L'}><span className={'normalCircle2L'}></span>{actionStep._0st}</span>
                    <span className={'interest2L'}><span className={'interestCircle2L'}></span>{actionStep._1st}</span>
                    <span className={'caution2L'}><span className={'cautionCircle2L'}></span>{actionStep._2nd}</span>
                    <span className={'boundary2L'}><span className={'boundaryCircle2L'}></span>{actionStep._3rd}</span>
                    <span className={'serious2L'}><span className={'seriousCircle2L'}></span>{actionStep._4st}심각</span>
                </div>;
            } */
        }

        return dangerStepUI;
    }

    render() {
        const [sensorItems, psmSensorCount, etcSensorCount, sensorConts] = this.getSensorItems();
        const displayUI = this.displayUI(psmSensorCount, etcSensorCount);
        const dangerStepUI = this.getDangerStepUI();

        const obj = { showPagination: false };
        const pageContents = this.getPageContents(obj);
        const sensorContsClassName = obj.showPagination ? "viewSensorConts noPage" : "viewSensorConts";

        //let contentsClassName = obj.showPagination ? "content noPage" : "content";
        //contentsClassName += this.state.isFullPage ? " fullPage" : "";

        return (
                <SensorStatusComponent id={this.props.popupType} className={'viewDashboardBoxD viewDashboardSensorBox'}>
                {/* <div id="effect" class={contentsClassName}> */}
                        <PopupDraggable
                            id={this.props.popupType}
                            popupMinWidth={190/*380*/}  
                            popupMinHeight={230/*460*/}  
                            topSize={32}
                            popupState={this.props.popupState}
                            setActiveDragPopup={this.props.setActiveDragPopup}
                            setPopupState={this.props.setPopupState}
                            popupResizeMouseMove={this.popupResizeMouseMove}
                        >
                            <div className={'dslTop dslGrd'} style={{ height: '35px' }}>
                        <h5 className={'dslTitle'}>{i18n.t('sdms.sensorStatus.센서정보 현황')}</h5>
                                {/* <a className={popup.dslX} id="fullButton" class="default corner" onClick={this.onClickFullPage}></a> */}
                                <a className={'dslX'} onClick={() => this.props.closeRangeSensors()}></a>
                            </div>

                        <div className={'sensorContsBox'}>  
                        <div className={sensorConts}>  {/* 클래스 변동해야함 :sensorConts >> sensorContsSmall */}
                            <div className={sensorContsClassName}>
                                {sensorItems}


                            {/* test */}
                            {/* <div className={'sensorInfoGrid'}>
                                    <div className={'sensorGrid1'}>
                                        <div className={popup.sensorInfoBox}>
                                            <span className={'sensorTopBox'}>
                                                <span className={'sensorTitleBox'}>
                                                    <span className={'sensorTitle1'}>센서01</span>
                                                </span>
                                                <span className={'sensorStepNormal'}></span>
                                            </span>
                                            <span className={'chartArea'}>
                                                <span className={'chartBox'}>
                                                    <ul className={'chartSkills'+ " " + 'backSerious'}>
                                                        <li></li>
                                                    </ul>
                                                    <span className={popup.sensorText0}></span>
                                                    <span className={popup.sensorText3}></span>
                                                    <span className={'figureSignInterest'}></span>
                                                </span>
                                            </span>
                                            <div className={'figure'}><span className={'figureType' + " " + popup.sensorName}>ETC</span><span className={'line'}></span><span className={'numBoldSerious'}>0123456</span></div>
                                        </div>
                                    </div>
                                    <div className={'sensorGrid2'}>
                                        <div className={popup.sensorInfoBox}>
                                            <span className={'sensorTopBox'}>
                                                <span className={'sensorTitleBox'}>
                                                    <span className={'sensorTitle1'}>센서01</span>
                                                </span>
                                                <span className={'sensorStepNormal'}></span>
                                            </span>
                                            <span className={'chartArea'}>
                                                <span className={'chartBox'}>
                                                    <ul className={'chartSkills' + " " + 'backSerious'}>
                                                        <li></li>
                                                    </ul>
                                                    <span className={'figureSignInterest'}></span>
                                                </span>
                                            </span>
                                            <div className={'figure'}><span className={'figureType' + " " + popup.sensorName}>ETC</span><span className={'line'}></span><span className={'numBoldSerious'}>0123456</span></div>
                                        </div>
                                    </div>
                                    <div className={'sensorGrid3'}>
                                        <div className={popup.sensorInfoBox}>
                                            <span className={'sensorTopBox'}>
                                                <span className={'sensorTitleBox'}>
                                                    <span className={'sensorTitle1'}>센서01</span>
                                                </span>
                                                <span className={'sensorStepNormal'}></span>
                                            </span>
                                            <span className={'chartArea'}>
                                                <span className={'chartBox'}>
                                                    <ul className={'chartSkills' + " " + 'backSerious'}>
                                                        <li></li>
                                                    </ul>
                                                    <span className={'figureSignInterest'}></span>
                                                </span>
                                            </span>
                                            <div className={'figure'}><span className={'figureType' + " " + popup.sensorName}>ETC</span><span className={'line'}></span><span className={'numBoldSerious'}>0123456</span></div>
                                        </div>
                                    </div>
                                    <div className={'sensorGrid4'}>
                                        <div className={popup.sensorInfoBox}>
                                            <span className={'sensorTopBox'}>
                                                <span className={'sensorTitleBox'}>
                                                    <span className={'sensorTitle1'}>센서01</span>
                                                </span>
                                                <span className={'sensorStepNormal'}></span>
                                            </span>
                                            <span className={'chartArea'}>
                                                <span className={'chartBox'}>
                                                    <ul className={'chartSkills' + " " + 'backSerious'}>
                                                        <li></li>
                                                    </ul>
                                                    <span className={'figureSignInterest'}></span>
                                                </span>
                                            </span>
                                            <div className={'figure'}><span className={'figureType' + " " + popup.sensorName}>ETC</span><span className={'line'}></span><span className={'numBoldSerious'}>0123456</span></div>
                                        </div>
                                    </div>
                               </div> 


                                <div className={'sensorInfoGrid'} >
                                    <div className={'sensorGrid1'}>
                                        <div className={popup.sensorInfoBox}>
                                            <span className={'sensorTopBox'}>
                                                <span className={'sensorTitleBox'}>
                                                    <span className={'sensorTitle1'}>센서01</span>
                                                </span>
                                                <span className={'sensorStepNormal'}></span>
                                            </span>
                                            <span className={'chartArea'}>
                                                <span className={'chartBox'}>
                                                    <ul className={'chartSkills' + " " + 'backSerious'}>
                                                        <li></li>
                                                    </ul>
                                                    <span className={'figureSignInterest'}></span>
                                                </span>
                                            </span>
                                            <div className={'figure'}><span className={'figureType' + " " + popup.sensorName}>ETC</span><span className={'line'}></span><span className={'numBoldSerious'}>0123456</span></div>
                                        </div>
                                    </div>
                                    <div className={'sensorGrid2'}>
                                        <div className={popup.sensorInfoBox}>
                                            <span className={'sensorTopBox'}>
                                                <span className={'sensorTitleBox'}>
                                                    <span className={'sensorTitle1'}>센서01</span>
                                                </span>
                                                <span className={'sensorStepNormal'}></span>
                                            </span>
                                            <span className={'chartArea'}>
                                                <span className={'chartBox'}>
                                                    <ul className={'chartSkills' + " " + 'backSerious'}>
                                                        <li></li>
                                                    </ul>
                                                    <span className={'figureSignInterest'}></span>
                                                </span>
                                            </span>
                                            <div className={'figure'}><span className={'figureType' + " " + popup.sensorName}>ETC</span><span className={'line'}></span><span className={'numBoldSerious'}>0123456</span></div>
                                        </div>
                                    </div>
                                    <div className={'sensorGrid3'}>
                                        <div className={popup.sensorInfoBox}>
                                            <span className={'sensorTopBox'}>
                                                <span className={'sensorTitleBox'}>
                                                    <span className={'sensorTitle1'}>센서01</span>
                                                </span>
                                                <span className={'sensorStepNormal'}></span>
                                            </span>
                                            <span className={'chartArea'}>
                                                <span className={'chartBox'}>
                                                    <ul className={'chartSkills' + " " + 'backSerious'}>
                                                        <li></li>
                                                    </ul>
                                                    <span className={'figureSignInterest'}></span>
                                                </span>
                                            </span>
                                            <div className={'figure'}><span className={'figureType' + " " + popup.sensorName}>ETC</span><span className={'line'}></span><span className={'numBoldSerious'}>0123456</span></div>
                                        </div>
                                    </div>
                                    <div className={'sensorGrid4'}>
                                        <div className={popup.sensorInfoBox}>
                                            <span className={'sensorTopBox'}>
                                                <span className={'sensorTitleBox'}>
                                                    <span className={'sensorTitle1'}>센서01</span>
                                                </span>
                                                <span className={'sensorStepNormal'}></span>
                                            </span>
                                            <span className={'chartArea'}>
                                                <span className={'chartBox'}>
                                                    <ul className={'chartSkills' + " " + 'backSerious'}>
                                                        <li></li>
                                                    </ul>
                                                    <span className={'figureSignInterest'}></span>
                                                </span>
                                            </span>
                                            <div className={'figure'}><span className={'figureType' + " " + popup.sensorName}>ETC</span><span className={'line'}></span><span className={'numBoldSerious'}>0123456</span></div>
                                        </div>
                                    </div>
                                 </div> */} {/* sensorInfoGrid */}


                                {/* 센서 OFF */}
                                {/* <div className={'sensorInfoBox5L'}>
                                    <span className={'sensorTopBox'}>
                                        <span className={'sensorTitleBox'}>
                                            <span className={'sensorTitle1'}>센서01</span>
                                        </span>
                                        <span className={'sensorStepNormal'}></span>
                                    </span>
                                    <span className={'chartArea'}>
                                        <span className={'chartBox'}>
                                            <ul className={'chartSkills' + " " + 'backSerious'}>
                                                <li></li>
                                            </ul>
                                            <span className={'figureSignInterest'}></span>
                                        </span>
                                    </span>
                                    <div className={'figure'}><span className={'figureType' + " " + popup.sensorName}>ETC</span><span className={'line'}></span><span className={'numBoldSerious'}>0123456</span></div>
                                </div> */}

                             </div>
                            </div>

                            {dangerStepUI}
                            {pageContents}

                            </div>
                        </PopupDraggable>
                {/*  </div> */}
                </SensorStatusComponent>
            );
        }
    }

export default withTranslation()(SensorStatus);