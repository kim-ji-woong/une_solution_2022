import React, { Component } from 'react';
import $ from 'jquery';
import { withRouter } from 'react-router-dom';
import { ReportComponent } from '../styled/ReportStyled';
import { Link } from 'react-router-dom';
import uis from '../../Common/css/ui.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale';
import btnCalendarBk from '../../Common/img/sub/dashboard_calendar_bk.png';
import CircularProgress from '@material-ui/core/CircularProgress';
import ConfirmDialog from '../../Common/ui/confirmDialog';

import SdmsResource from '../../SDMS/resource/id';
import ReportResource from "../resource/id";

import ReportList from '../../Report/ui/reportList';
import ReportGraph from '../../Report/ui/reportGraph';

import { SDMSController } from '../../SDMS/services/sdmsController';

import StatusInfo from '../../SDMS/ui/popups/statusInfo';
import ReportUtil from "../util/ReportUtil";

class Report extends Component {

    constructor(props) {
        super(props);

        this.state = {

            sensorList: null,
            sensorDatas: null,
            sensorDataHistories: null,
            materialLinks: null,
            materials: null,

            beginDate: new Date(),
            endDate: new Date(),
            
            dataSource: null,
            
            curSensorType: StatusInfo.EntireType,
            curZoneIDs: [],
            curMaterials: [],
            curDataPeriodType: ReportResource.dataPeriodType.minute,

            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null
            },
            
            layout: 0,
        }

        this.props = props;
        this.refDatepicker01 = React.createRef();
        this.refDatepicker02 = React.createRef();

        this.refParent = React.createRef();
        
        this.isMount = true;
        this.isLoading = false;
        
        this.searchBeginDate = null;
        this.searchEndDate = null;
    }

    componentDidMount() {
        this.init();
        const strWindDirection = this.getStringWindDirection(152.98);
    }

    componentWillUnmount() {
        this.isMount = false;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        
    }

    _setState = (state, callback) => {
        if (this.isMount) {
            this.setState(state, callback)
        }
    }

    showConfirmDialog = (title, messages, buttons, onClickButton) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.title = title;
        confirmMessage.buttons = buttons;
        confirmMessage.onClickButton = onClickButton;

        if (!messages) {
            confirmMessage.messages = [""];
        }
        else if (Array.isArray(messages)) {
            confirmMessage.messages = messages;
        }
        else {
            confirmMessage.messages = [messages];
        }

        this._setState({ confirmMessage });
    }

    onCloseConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        this._setState({ confirmMessage });
    }

    async init() {
        let sensorDatas = await SDMSController.requestSensorDatas();

        if (sensorDatas !== null && sensorDatas !== undefined) {
            sensorDatas = this.modifySensorDatas(sensorDatas.sensorDatas);
        }

        let sensorDataHistories = await SDMSController.requestSensorDataHistory();

        if (sensorDataHistories !== null && sensorDataHistories !== undefined) {
            sensorDataHistories = sensorDataHistories.etcSensorDataHistories;
        }

        let materialLinks = await SDMSController.requestMaterialLink();

        if (materialLinks !== null && materialLinks !== undefined) {
            materialLinks = materialLinks.materialLinks;
        }
        
        //#region request sensor list
        const [result, message] = await SDMSController.requestAllSensors();
        const sensorList = {};
        if (result.fireSensors) {
            sensorList['fireSensors'] = result.fireSensors;
        }

        if (result.psmSensors) {
            sensorList['psmSensors'] = result.psmSensors;
        }

        if (result.etcSensors) {
            sensorList['etcSensors'] = result.etcSensors;
        }

        if (result.cctvs) {
            sensorList['cctvs'] = result.cctvs;
        }

        if (result.atmospheres) {
            sensorList['atmospheres'] = result.atmospheres;
        }

        if (result.waters) {
            sensorList['waters'] = result.waters;
        }

        if (result.weathers) {
            sensorList['weathers'] = result.weathers;
        }

        if (result.vocs) {
            sensorList['vocs'] = result.vocs;
        }

        if (result.stinks) {
            sensorList['stinks'] = result.stinks;
        }
        //#endregion

        let materials = await SDMSController.requestMaterials();

        if (materials !== null && materials !== undefined) {
            materials = materials[0];
        }
        
        this.getInitDatas(sensorList, materials);
        
        this._setState({ sensorDatas, sensorDataHistories, materialLinks, materials, sensorList });
    }
    
    modifySensorDatas = (sensorDatas) => {
        let modifiedSensorDatas = [];
        for (const sensorData of sensorDatas) {
            let modifiedSensorData = {};
            modifiedSensorData.zoneID = sensorData.sensorID;
            modifiedSensorData.sensorType = sensorData.sensorType;
            modifiedSensorData.sensorName = sensorData.sensorName;
            modifiedSensorDatas.push(modifiedSensorData);
        }
        return modifiedSensorDatas;    
    }

    getInitDatas = (sensorList, materials) => {
        // 처음 시작 단계의 ZoneID와 MaterialID 목록 가져오기
        let curZoneIDs = [];
        let curMaterials = [];
        
        const targetSensorList = this.getTargetSensorList(parseInt(this.state.curSensorType), sensorList);
        curZoneIDs = this.getZoneIDList(targetSensorList);
        curMaterials = this.getMaterialIDList(targetSensorList);

        //this._setState({ curZoneIDs, curMaterials }, () => this.onClickSearch(curZoneIDs, curMaterials));
        this._setState({ curZoneIDs, curMaterials });
    }
    
    // 센서 객체 배열에서 전체 MaterialID 추출
    getMaterialIDList = (targetSensorList) => {
        let materialIDs = [];
        for (let i = 0; i < targetSensorList.length; i++) {
            for (let j = 0; j < targetSensorList[i].sensors.length; j++) {
                materialIDs.push(targetSensorList[i].sensors[j].sensorType);
            }
        }
        
        // get rid of duplicate materialID
        materialIDs = materialIDs.filter((id, index) => materialIDs.indexOf(id) === index); // 중복 제거
        materialIDs.sort((a, b) => a - b); // 정렬
        
        return materialIDs;
    }
    // 센서 객체 배열에서 ZoneID 추출
    getZoneIDList = (targetSensorList) => {
        let zoneIDs = [];
        for (const sensor of targetSensorList) {
            zoneIDs.push(sensor.zoneID);
        }
        return zoneIDs;
    }

    // 측정기 타입에 따라 측정기 목록 가져오기
    getTargetSensorList = (sensorType, sensorList) => {
        const nSensorType = parseInt(sensorType);
        let targetSensorList = [];
        //if (sensorList === null || sensorList === undefined) return [];
        if (sensorList === null || sensorList === undefined) {
            if (this.state.sensorList === null || this.state.sensorList === undefined) return [];
            sensorList = this.state.sensorList;
        }
        switch (nSensorType) {
            case StatusInfo.AtmosphereType:
                targetSensorList = [...sensorList.atmospheres];
                break;
            case StatusInfo.WaterType:
                targetSensorList = [...sensorList.waters];
                break;
            case StatusInfo.WeatherType:
                targetSensorList = [...sensorList.weathers];
                break;
            case StatusInfo.VocType:
                targetSensorList = [...sensorList.vocs];
                break;
            case StatusInfo.BacterialType:
                targetSensorList = [...sensorList.stinks];
                break;
            default:
                targetSensorList = [...sensorList.atmospheres, ...sensorList.waters, ...sensorList.weathers, ...sensorList.vocs, ...sensorList.stinks];
                break;
        }
        return targetSensorList;
    }

    // 풍향 String 구하기
    getStringWindDirection = (degree) => {
        const directions = [
            "북", "북북동", "북동", "동북동",
            "동", "동남동", "남동", "남남동",
            "남", "남남서", "남서", "서남서",
            "서", "서북서", "북서", "북북서"
        ];

        const angle = (degree % 360 + 360) % 360;

        const index = Math.floor(angle / 22.5);
        return directions[index];
    }

    onClickSearch = async (curZoneIDs, curMaterials) => {
        this.isLoading = true;
        
        let beginDate = this.state.beginDate;
        let endDate = this.state.endDate;
        
        if (curZoneIDs === null || curZoneIDs === undefined) {
            curZoneIDs = this.state.curZoneIDs;
        }
        if (curMaterials === null || curMaterials === undefined) {
            curMaterials = this.state.curMaterials;
        }

        if (beginDate) {
            beginDate = this.getDateFormat(beginDate);
        }

        if (endDate) {
            endDate = this.getDateFormat(endDate);
        }

        const curSensorType = this.state.curSensorType;
        
        const curDataPeriodType = this.state.curDataPeriodType;
        
        let dateSource = null; // 결과 데이터 state

        
        if (curZoneIDs.length === 0) {
            this.showConfirmDialog("알림", "측정소를 선택해주세요.", ["확인"], this.onCloseConfirmDialog);
            return;
        }
        
        if (curDataPeriodType === null || curDataPeriodType === undefined) {
            this.showConfirmDialog("알림", "집계방식을 선택해주세요.", ["확인"], this.onCloseConfirmDialog);
            return;
        }
        
        if (curMaterials.length === 0) {
            this.showConfirmDialog("알림", "측정값을 선택해주세요.", ["확인"], this.onCloseConfirmDialog);
            return;
        }
        
        let datas = null;
        
        const result = await SDMSController.requestSensorDataHistoryByConditions(curSensorType, curZoneIDs, curMaterials, curDataPeriodType, beginDate, endDate).then((result) => {
            // then logic
            if (result === null || result === undefined) {
                this.showConfirmDialog("알림", "조회 결과가 없습니다.", ["확인"], this.onCloseConfirmDialog);
                this.isLoading = false;
                return [];
            }
            datas = result.etcSensorDataHistories;
        }).catch((error) => {
            // catch logic
            this.showConfirmDialog("알림", "조회에 실패하였습니다.", ["확인"], this.onCloseConfirmDialog);
            this.isLoading = false;
            return [];
        }) ?? [];
        
        this.isLoading = false;
        
        this.searchBeginDate = beginDate;
        this.searchEndDate = endDate;
        
        this.makeDataSource(datas); // setState in makeDataSource
    }
    
    makeDataSource = (datas) => {
        
        // data in datas property : sensorID, timeStamp, sensorValue;
        const materials = this.state.materials;
        const sensorDatas = this.state.sensorDatas;
        
        const rawSensorList = this.getEtcs();
        
        if (datas === null || datas === undefined) {
            return [];
        }
        
        let zones = [];

        // 시간 데이터 만들어야 함
        for (const data of datas) {
            let element = {};
            let zoneID = rawSensorList.find((sensor) => sensor.id === data.sensorID).zoneID;

            element.sensorID = data.sensorID;
            element.timeStamp = data.timeStamp;
            element.materialID = rawSensorList.find((sensor) => sensor.id === data.sensorID).sensorType;
            element.materialName = rawSensorList.find((sensor) => sensor.id === data.sensorID).sensorTypeName;
            element.materialUOM = rawSensorList.find((sensor) => sensor.id === data.sensorID).uoM;
            element.sensorValue = data.sensorValue;

            // make zones : 1:{element}
            if (zones[zoneID] === null || zones[zoneID] === undefined) {
                //if (!Object.keys(zones).includes(zoneID)) {  
                zones[zoneID] = [];
                zones[zoneID].push(element);
            } else {
                zones[zoneID].push(element);
            }
        }
        
        if (this.state.curDataPeriodType === ReportResource.dataPeriodType.hour) {
            let hourlyDatas = [];
            let prevTimeStamp = new Date();
            
            for (const zoneID in zones) {
                let zone = zones[zoneID];
                // ZoneID별로 데이터를 시간별로 묶어야 함
                const hourlyData = this.makeHourlyData(zone);
                hourlyDatas[zoneID] = hourlyData;
            }
            const noneRangeDataSources = this.makeNoneRangeData(hourlyDatas);
            this._setState({ dataSource: noneRangeDataSources });
            return;
        }
        
        this._setState({ dataSource: zones }, () => zones = null);
    }
    
    makeNoneRangeData = (datas) => {
        let noneRangeDatas = [];
        for (const zoneID in datas) {
            const zone = datas[zoneID];
            noneRangeDatas[zoneID] = [];
            for (const data of zone) {
                for (let i = 0; i < data.length; i++) {
                    const sensor = data[i];
                    noneRangeDatas[zoneID].push(sensor);
                }
            }
        }
        return noneRangeDatas;
    }
    
    makeHourlyData = (datas) => {
        let hourlyDatas = [];
        let sensorIDs = []
        for (const data of datas) {
            data.sensorID = parseInt(data.sensorID);
            sensorIDs.push(data.sensorID);
        }
        sensorIDs = sensorIDs.filter((id, index) => sensorIDs.indexOf(id) === index);
        
        for (const sensorID of sensorIDs) {
            let sensors = [];
            for (let i = 0; i < datas.length; i++) {
                let data = datas[i];
                if (data.sensorID === sensorID) {
                    sensors.push(data); // 5분 단위 데이터 배열
                }
            }
            let hourlyData = this.makeHourlyDataInZone(sensors); // 시간 단위 데이터 배열 변환
            hourlyDatas.push(hourlyData);
        }
        return hourlyDatas;
    }
    
    makeHourlyDataInZone = (sensors) => {
        
        let hourlyData = [];
        let totalCount = 0;
        let totalValue = 0;
        let prevTimeStamp = sensors[0].timeStamp.toString("yyyy-MM-dd HH:00:00").replace("T", " "); // 기본 형식 잡기
        let sameDtData = [];
        
        for (let i = 0; i < sensors.length; i++) {
            const sensor = sensors[i];
            
            if (i === 0) {
                sameDtData.push(sensor);
            }
            
            if (i > 0) {
                const timeStamp = sensor.timeStamp.toString("yyyy-MM-dd HH:00:00").replace("T", " ");
                
                const originPrevTimeStamp = new Date(prevTimeStamp);
                const originTimeStamp = new Date(timeStamp);
                if (originPrevTimeStamp.getFullYear() === originTimeStamp.getFullYear() &&
                    originPrevTimeStamp.getMonth() === originTimeStamp.getMonth() &&
                    originPrevTimeStamp.getDate() === originTimeStamp.getDate() &&
                    originPrevTimeStamp.getHours() === originTimeStamp.getHours()) {
                    sameDtData.push(sensor);
                    
                    if (i === sensors.length - 1) {
                        const averageValue = this.getAverageValue(sameDtData);
                        hourlyData.push({ sensorID:sensor.sensorID, timeStamp: prevTimeStamp.toString("yyyy-MM-dd MM:00:00"), sensorValue: averageValue , materialID: sensor.materialID, materialName: sensor.materialName, materialUOM: sensor.materialUOM });
                    }
                }
                else {
                    const averageValue = this.getAverageValue(sameDtData);
                    hourlyData.push({ sensorID:sensor.sensorID, timeStamp: prevTimeStamp.toString("yyyy-MM-dd MM:00:00"), sensorValue: averageValue, materialID: sensor.materialID, materialName: sensor.materialName, materialUOM: sensor.materialUOM });
                    sameDtData = [];
                    sameDtData.push(sensor);
                    prevTimeStamp = timeStamp.toString("yyyy-MM-dd HH:00:00").replace("T", " ");
                }
            }
            
        }
        return hourlyData; 
    }
    
    getAverageValue = (sensors) => {
        let totalValue = 0;
        let totalCount = 0;
        for (const sensor of sensors) {
            totalValue += parseFloat(sensor.sensorValue);
            totalCount++;
        }
        return (totalValue / totalCount).toFixed(2);
    }
    
    getEtcs = () => {
        const sensorList = this.state.sensorList;
        
        if (sensorList === null && sensorList === undefined) {
            return [];
        }
            
        let rawSensorList = [];
        for (const key in sensorList) {
            const indiSensors = sensorList[key];
            for (const sensor of indiSensors) {
                const sensors = sensor.sensors;
                for (let s of sensors) {
                    s.zoneID = sensor.zoneID;
                    rawSensorList.push(s);
                }
            }
        }
        return rawSensorList;
    }

    getDateFormat = (date) => {
        const year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');

        const formattedDate = `${year}${month}${day}`;
        return formattedDate;
    }

    showPositionCheckboxes = () => {
        let checkboxes = document.getElementById("multiselectCheckboxes");

        if (checkboxes.style.display === 'block') {
            checkboxes.style.display = 'none';
        } else if (checkboxes.style.display === 'none') {
            checkboxes.style.display = 'block'
            checkboxes.style.height = '500px';
            checkboxes.style.overflowY = 'scroll';
        }

        //this.setState({ expandVDCCheckBoxList: !this.state.expandVDCCheckBoxList });
    }

    showDataCheckboxes = () => {
        let checkboxes = document.getElementById("dataSelectCheckboxes");

        if (checkboxes.style.display === 'block') {
            checkboxes.style.display = 'none';
        } else if (checkboxes.style.display === 'none') {
            checkboxes.style.display = 'block'
            checkboxes.style.height = '500px';
            checkboxes.style.overflowY = 'scroll';
        }

    }

    onChangeDateTimeRange = (value) => { // value: string (day week month year)

        // today
        const today = new Date();

        // 1week ago
        let weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7)

        // 1month ago
        let monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);

        // 1year ago
        let yearAgo = new Date(today);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);

        let result;

        if (value === 'day') result = today;
        if (value === 'week') result = weekAgo;
        if (value === 'month') result = monthAgo;
        if (value === 'year') result = yearAgo;

        this.refDatepicker01.current.setSelected(result);
    }

    onChangeDataPeriodType = (curDataPeriodType) => { // 데이터 집계 방식 5분 , 1시간
        const nCurDataPeriodType = parseInt(curDataPeriodType);
        this._setState({ curDataPeriodType: nCurDataPeriodType });
    }

    onClickDatepicker01 = () => {
        this.refDatepicker01.current.setOpen(true);
    }

    onClickDatepicker02 = () => {
        this.refDatepicker02.current.setOpen(true);
    }

    onChangeBegin = (date) => {

        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        let korFormat = year + "-" + month + "-" + day;

        const endDate = this.state.endDate;

        if (date > endDate) {
            this.showConfirmDialog("알림", "시작일은 종료일보다 클 수 없습니다.", ["확인"], this.onCloseConfirmDialog);
            this._setState({ beginDate: endDate, endDate: endDate });
            return;
        }
        
        this._setState({ beginDate: date });
    }

    onChangeEnd = (date) => {

        let year = date.getFullYear();
        //let month = date.getMonth() + 1;
        let month = date.getMonth();
        let day = date.getDate();

        let korFormat = year + "-" + month + "-" + day;

        const beginDate = this.state.beginDate;

        const targetTime = date.getTime();
        const beginTime = beginDate.getTime();
        
        // 선택한 날짜 (date) 보다 하루 전 날짜와 현재 저장된 beginDate 비교 하여 beginDate가 더 이르면 beginDate를 Date(year, month, day - 1)로 설정
        let oneDayAgo = new Date(year, month, day - 1);
        const oneDayAgoTime = oneDayAgo.getTime();
        
        if (beginTime > targetTime) {
            this._setState({ beginDate: date, endDate: date });
            return;
        } 
        
        if (beginTime < oneDayAgoTime) {
            this._setState({ beginDate: oneDayAgo, endDate: date });
            return;
        }
        
        this._setState({ endDate: date });
    }

    handleAllCheckPlace = (value, targetSensorList) => {
        let curZoneIDs = [];
        if (value === true) {
            if (targetSensorList === null || targetSensorList === undefined) {
                targetSensorList = this.getTargetSensorList(parseInt(this.state.curSensorType));
            }
            for (let i = 0; i < targetSensorList.length; i++) {
                curZoneIDs = [...curZoneIDs, targetSensorList[i].zoneID];
            }
        } else {
            curZoneIDs = [];
        }

        // get rid of duplicate zoneID
        curZoneIDs = curZoneIDs.filter((id, index) => curZoneIDs.indexOf(id) === index);

        this._setState({ curZoneIDs });
    }

    handleSingleCheckPlace = (value, zoneID, targetSensorList) => {
        let curZoneIDs = this.state.curZoneIDs;

        if (value === false) {
            curZoneIDs = curZoneIDs.filter((id) => id !== zoneID); // 해당 zoneID를 제외한 나머지 zoneID들을 배열로 만들어준다.
        } else {
            if (!curZoneIDs.includes(zoneID)) { // zoneID가 없으면 추가
                curZoneIDs = [...curZoneIDs, zoneID];
            }
        }

        // get rid of duplicate zoneID
        curZoneIDs = curZoneIDs.filter((id, index) => curZoneIDs.indexOf(id) === index);

        this._setState({ curZoneIDs });
    }

    getAllSensorList = (sensorList) => {
        let allSensorList = [];
        for (const key in sensorList) {
            allSensorList = [...sensorList[key]];
        }
        return allSensorList;
    }

    getMeasuringPlaceUI = () => {
        const sensorList = this.state.sensorList;
        const curSensorType = this.state.curSensorType;
        let elements = [];
        let isEntireChecked = false;
        
        let targetSensorList = this.getTargetSensorList(parseInt(curSensorType), sensorList) ?? [];
        const curZoneIDs = this.state.curZoneIDs ?? [];
        
        if (targetSensorList.length === curZoneIDs.length) {
            isEntireChecked = true;
        }
        
        let allCheckElement = 
            <label htmlFor="entire">
                <input type="checkbox" id="entire" defaultChecked
                    onChange={(e) => this.handleAllCheckPlace(e.target.checked)} checked={isEntireChecked}/>
                전체
            </label>;
        
        elements.push(allCheckElement);
        
        let strFirstMeasurePlace = "";
        let etcMeasurePlaceCount = 0;
        let allMeasurePlaceCount = targetSensorList.length;

        for (const sensor of targetSensorList) {
            if (strFirstMeasurePlace === "") {
                strFirstMeasurePlace = sensor.position;
            }
            else {
                etcMeasurePlaceCount++;
            }
            let isChecked = curZoneIDs.includes(sensor.zoneID); // 개별판별
            if (isEntireChecked) isChecked = true; // 전체선택시 개별선택은 무조건 true
            let element = 
                <label htmlFor={sensor.zoneID}>
                    <input type="checkbox" id={sensor.zoneID} checked={isChecked} onChange={(e) => this.handleSingleCheckPlace(e.target.checked, sensor.zoneID)}/>
                    {sensor.position}
                </label>;
            elements.push(element);
        }

        const placeInfo =
            <form>
                <div className={'measuringPlaceSelect'} onClick={() => this.showPositionCheckboxes()}>
                    <p className={'measuringPlaceTitle'}>측정소</p>
                    <select>
                        <option>
                            {allMeasurePlaceCount > 1 ? `${strFirstMeasurePlace} 외 ${etcMeasurePlaceCount.toString()}개소` 
                            : strFirstMeasurePlace}
                        </option>
                    </select>
                    <div className={'overSelect'}></div>
                </div>
                <div id={'multiselectCheckboxes'} style={{ display: 'none' }}>
                    {elements}
                </div>
            </form>

        return placeInfo;

    }

    handleAllCheckMaterial = (value) => {
        let curMaterials = this.state.curMaterials ?? [];
        if (!value) curMaterials = [];
        else curMaterials = this.getMaterialIDList(this.getTargetSensorList(parseInt(this.state.curSensorType)));

        this._setState({ curMaterials });

    }

    handleSingleCheckMaterial = (value, targetId) => {
        let curMaterials = this.state.curMaterials ?? [];
        if (!value) {
            curMaterials = curMaterials.filter((id) => id !== targetId);
        }
        else {
            curMaterials.push(targetId);
            curMaterials.sort((a, b) => a - b);
        }
        
        this._setState({ curMaterials });
    }

    getMaterialTypeUI = () => {
        const curZoneIDs = this.state.curZoneIDs ?? [];
        const curMaterials = this.state.curMaterials ?? [];
        const materials = this.state.materials ?? [];
        
        let elements = [];
        
        let entireCheckBox = 
            <label htmlFor="entire">
                <input type="checkbox" id="entire" defaultChecked onChange={(e) => this.handleAllCheckMaterial(e.target.checked)} checked={curMaterials.length === materials.length} />
                전체
            </label>;

        let strFirstMaterialName = "";
        let nMaterialCount = 0;
        let totalMaterialCount = materials.length;

        for (const material of materials) {
            
            if (material.id === 400 || material.id === 203)
                continue;
            
            let isChecked = curMaterials.includes(material.id);
            for (const curMaterial of curMaterials) {
                if (curMaterial === material.id) {
                    if (strFirstMaterialName === "") {
                        strFirstMaterialName = material.materialName;
                    }
                    else {
                        nMaterialCount++;
                    }
                }
            }
            const element =
                <label htmlFor={material.id}>
                    <input type="checkbox" id={material.id} checked={isChecked} onChange={(e) => this.handleSingleCheckMaterial(e.target.checked, material.id)}/>{material.materialName}
                </label>
            elements.push(element);
        }
        
        const materialTypeUI =
            <form>
                <div className={'measuringDataSelect'} onClick={() => this.showDataCheckboxes()}>
                    <p className={'measuringDataTitle'}>측정값</p>
                    <select>
                        <option>
                            {curMaterials.length > 1 ?
                                `${strFirstMaterialName} 외 ${nMaterialCount}개` :
                                strFirstMaterialName}
                        </option>
                    </select>
                    <div className={'overSelect'}></div>
                </div>
                <div id={'dataSelectCheckboxes'} style={{ display: 'none' }}>
                    {elements}
                </div>
            </form>

        return materialTypeUI;
    }

    onClickFacilityType = (value) => {
        const nSensorType = parseInt(value);
        
        // make curZoneIDs with sensorType
        const sensorList = this.state.sensorList;
        const targetSensorList = this.getTargetSensorList(nSensorType, sensorList);
        const curZoneIDs = this.getZoneIDList(targetSensorList);
        const curMaterials = this.getMaterialIDList(targetSensorList);
        
        this._setState({ curSensorType: nSensorType , curZoneIDs }, () => {
        });
    }
    
    handleLayout = (layout) => {
        if(layout === this.state.layout) {
            this.setState({ layout: 0 });
        }
        else {
            this.setState({ layout: layout });
        }
    }

    getMinDate = () => {
        if (this.state.endDate === null || this.state.endDate === undefined) {
            return this.state.endDate;
        }
        
        const year = this.state.endDate.getFullYear();
        const month = this.state.endDate.getMonth();
        const day = this.state.endDate.getDate();
        
        let minDate = new Date(year, month, day - 1);
        
        return minDate;
    }

    onClickDownloadExcel = () => {
        const dataSources = this.state.dataSource;
        
        if (dataSources === null || dataSources === undefined) {
            return;
        }
        
        if (this.searchBeginDate === null || this.searchEndDate === undefined) {
            this.showConfirmDialog("다운로드 실패", "시작 날짜를 설정해주세요.", null, this.onCloseConfirmDialog);
            return;
        }
        
        if (this.searchEndDate === null || this.searchEndDate === undefined) {
            this.showConfirmDialog("다운로드 실패", "종료 날짜를 설정해주세요.", null, this.onCloseConfirmDialog);
            return;
        }
        
        const sensorDatas = this.state.sensorDatas;
        if (sensorDatas === null || sensorDatas === undefined) {
            this.showConfirmDialog("다운로드 실패", "측정기 정보 목록을 가져오는데 실패하였습니다.", null, this.onCloseConfirmDialog);
        }
        
        const materials = this.state.materials;
        if (materials === null || materials === undefined) {
            this.showConfirmDialog("다운로드 실패", "측정값 정보 목록을 가져오는데 실패하였습니다.", null, this.onCloseConfirmDialog);
        }

        let dateTime = new Date();
        let dt = dateTime.getFullYear() + "-" + (dateTime.getMonth() + 1) + "-" + dateTime.getDate();

        const title = "보고서 및 통계_" + this.searchBeginDate + "~" + this.searchEndDate;
        if (!ReportUtil.downloadExcelFile(dataSources, title, this.searchBeginDate, this.searchEndDate, this.state.curZoneIDs, this.state.curmaterials, sensorDatas, materials)) {
            this.showConfirmDialog("다운로드 실패", "엑셀 파일을 다운로드 하는데 실패하였습니다.", null, this.onCloseConfirmDialog);
            return;
        }
    }

    render() {

        const measuringPlaceUI = this.getMeasuringPlaceUI();
        const materialTypeUI = this.getMaterialTypeUI();

        return (
            <>
                <ReportComponent ref={this.refParent} className={SdmsResource.UISection} id={'reportback'}>
                    <Link to="/sdms"><span className={uis.yeosuLogoBox}></span></Link>

                    <div className={'hsScr hsScr'}>
                        <span className={'detectTitle'}>보고서 및 통계</span>
                        <div id={'hsCont'}>
                            <form action="">
                                <div className={'hscSch'}>
                                    <dl>
                                        <dd className={'measuringBox'}>
                                            <p className={'measuringTitle'}>측정기</p>
                                            <select className={'measuringSelect'} onChange={(e) => this.onClickFacilityType(e.target.value)}>
                                                <option value={StatusInfo.EntireType}>전체</option>
                                                <option value={StatusInfo.AtmosphereType}>대기유해물질측정기</option>
                                                <option value={StatusInfo.WaterType}>수질측정기</option>
                                                <option value={StatusInfo.WeatherType}>통합기상측정기</option>
                                                <option value={StatusInfo.VocType}>VOC분석기</option>
                                                <option value={StatusInfo.BacterialType}>악취측정기</option>
                                            </select>
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dd className={'measuringPlaceBox'}>
                                            <ul className={'hscsLoc'}>
                                                {measuringPlaceUI}
                                            </ul>
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dd className={'measuringData'}>
                                            {materialTypeUI}
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dd className={'aggregationMethod'}>
                                            <p className={'aggregationMethodTitle'}>집계방식</p>
                                            <select defaultValue="minute" onChange={(e) => this.onChangeDataPeriodType(e.target.value)}>
                                                <option value={ReportResource.dataPeriodType.minute}>5분 데이터</option>
                                                <option value={ReportResource.dataPeriodType.hour}>시간 데이터</option>
                                            </select>
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dd className={'aggregationDayBox'}>
                                            <p className={'aggregationDayTitle'}>집계날짜</p>
                                            <ul className={'hscsDatee'}>
                                                <li>
                                                    <div className={'datepicker'}>
                                                        <DatePicker ref={this.refDatepicker01} name="datepicker01" id="datepicker01"
                                                            dateFormat="yyyy-MM-dd"
                                                            locale={ko}
                                                            maxDate={this.state.endDate} 
                                                            minDate={this.getMinDate()}        
                                                            selected={this.state.beginDate}
                                                            onChange={date => this.onChangeBegin(date)}
                                                            onClick={this.onClickDatepicker01}
                                                            onKeyDown={(e) => { e.preventDefault(); }}
                                                        />
                                                    </div>
                                                </li>
                                                <li>~</li>
                                                <li>
                                                    <div className={'datepicker'}>
                                                        <DatePicker ref={this.refDatepicker02} name="datepicker02" id="datepicker02"
                                                            dateFormat="yyyy-MM-dd"
                                                            locale={ko}
                                                            maxDate={new Date()}
                                                            selected={this.state.endDate}
                                                            onChange={date => this.onChangeEnd(date)}
                                                            onKeyDown={(e) => { e.preventDefault(); }}
                                                        />
                                                        <img src={btnCalendarBk} alt="" className={'btnCalendarBk'} onClick={this.onClickDatepicker02} />
                                                    </div>
                                                </li>
                                            </ul>
                                        </dd>
                                    </dl>
                                    {
                                        this.isLoading === true ?
                                        // this.state.loadingIndicator === true ?
                                            <a className={'hscsSbmt'} id={'hscsSbmting'}><span><span><CircularProgress className="spinner" /></span></span></a>
                                            :
                                            <a onClick={() => this.onClickSearch(null, null)} className={'hscsSbmt'}><span><span>검색</span></span></a>
                                    }
                                </div>
                            </form>
                        </div>
                        <div style={{ display: 'flex', width: 'calc(100% - 30px)' }}>
                            <ReportList 
                                dataSource={this.state.dataSource}
                                sensorDatas={this.state.sensorDatas}
                                sensorList={this.state.sensorList}
                                materials={this.state.materials}
                                curDataPeriodType={this.state.curDataPeriodType}
                                getStringWindDirection={this.getStringWindDirection}
                                layout={this.state.layout}
                                handleLayout={this.handleLayout}
                                onClickDownloadExcel={this.onClickDownloadExcel}
                            /> {/* 보고서 리스트 */}
                            <ReportGraph 
                                dataSource={this.state.dataSource}
                                sensorDatas={this.state.sensorDatas}
                                sensorList={this.state.sensorList}
                                materials={this.state.materials}
                                curDataPeriodType={this.state.curDataPeriodType}
                                getStringWindDirection={this.getStringWindDirection}
                                layout={this.state.layout}
                                handleLayout={this.handleLayout}
                            /> {/* 보고서 그래프 */}
                        </div>
                    </div>
                </ReportComponent>
                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
                }
            </>
        );
    }
}

export default Report;