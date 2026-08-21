import React, { Component, useState } from 'react';
import { BrowserRouter as Route, Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import '../../css/popup.css';
import $ from 'jquery';
import SDMSResource from '../../resource/id';
import content from '../../../Common/css/content.module.css';
import PopupDraggable from './popupDraggable';
import SettingsStore from '../../../Settings/settingsStore';
import SDMS from '../sdms';


import { EventInfoComponent } from './../../sdmsStyled';
/* import { AlarmOnIcon } from './../../styled';
import { AlarmOffIcon } from './../../styled';

import { ResponseBox } from './../../styled';
import { CheckBox } from './../../styled';
import { CheckBoxBlue } from './../../styled';
import { SensorlocationBox } from './../../styled';
import { SensorList } from './../../styled';
import { MoveBtn } from './../../styled';
import { UnresponNum } from './../../styled';
import { ResponNum } from './../../styled';

import { SensorSeriousStepBox, SensorSeriousCompletionBox } from './../../styled';
import { SensorBoundaryStepBox, SensorBoundaryCompletionBox } from './../../styled';
import { EventGageBar } from './../../styled';
import { SensorEventBtn } from './../../styled';
import { MemoIcon } from './../../styled';
import { EventMemoBox } from './../../styled';
import { MemoBtn } from './../../styled'; */

import StringUtil from '../../../Common/util/StringUtil';
import SdmsResource from '../../resource/id';
import HistoryController from '../../../History/services/historyController';
import ProjectResource from '../../../Root/resource/id';
import AccountResource from '../../../Account/resource/id';
import { SDMSController } from '../../services/sdmsController';
import ConfirmDialog from '../../../Common/ui/confirmDialog';

import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import AlarmOn from '../../../SDMS/img/pop/notifications_black.png';
import AlarmOff from '../../../SDMS/img/pop/notifications_off_black.png';
import StatusInfo from './statusInfo';



class EventInfo extends Component {

    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            checkedAction: false,
            memoInfo: null,
            postMemo: null,

            // 엑셀 다운로드 상태 값
            dataSource: null,

            minID: 0,
            maxID: 0,
            currentLastID: 0,
            searchBeginDate: new Date(),
            searchEndDate: new Date(),
            searchFacilityType: -1,
            searchBuildingGroupID: -1,
            searchBuildingID: -1,
            searchZoneID: -1,

            selectedBuildingGroupID: -1,
            selectedBuildingID: -1,
            selectedZoneID: -1,
            dateType: 'today',

            searchZoneName: '-',

            beginDate: new Date(),
            endDate: new Date(),

            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null
            },

            testSensorState: this.props.testParam,
        }

        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));

        this.refMemo = React.createRef();

        this.alarmOnNum = 0;
        this.alarmOffNum = 0;
    }


    componentDidMount() {
        this.getSensorZoneHistory();

        $(function () {
            let num = 0;

            $('#pic').click(function () {
                if (num == 0) {
                    $(this).attr('src', AlarmOn);
                    //$(this).attr('data-tooltip', "음소거");
                    num = 1;
                } else {
                    $(this).attr('src', AlarmOff);
                    //$(this).attr('data-tooltip', "음소거 해제");
                    num = 0;
                }
            });
        });

        this.checkAlarmStatus();
        
    }

    checkAlarmStatus = () => {

        if (this.props.sensorAlarms === null || this.props.sensorAlarms === undefined)
            return;

        const alarmList = this.props.sensorAlarms;

        let isAlarmed = false;

        for (let i = 0; i < alarmList.length; i++) {
            const alarm = alarmList[i];

            if (alarm.isAlarm === true) {
                isAlarmed = true;
                return;
            }

        }

        if (!isAlarmed) {
            this.onSelectTab(true);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            var popup = document.getElementsByClassName(content.eventInfoPopup)[0];
            this.state.popup.style.zIndex = this.props.zIndex;
        }

        if (this.state.postMemo) {
            this.setState({ memoInfo: this.state.postMemo, postMemo: null });
        }

        //if (this.props.selectedAlarm) {
        //    if (this.props.selectedAlarm !== prevProps.selectedAlarm) {
        //        this.isAlarmed();
        //    }
        //}

        if (this.props.selectedAlarm !== prevProps.selectedAlarm) {
            this.isAlarmed();
        }

        if (prevProps.testParam !== this.props.testParam) {
            this.setState({ testSensorState: this.props.testParam });
        }
        //this.setScrollbar();
        if (this.props.sensorAlarms !== prevProps.sensorAlarms) {
            this.sendAlarmInfo();
        }
    }

    sendAlarmInfo = () => {
        const alarmList = this.props.sensorAlarms;
        const sensorDatas = this.props.sensorDatas;
        if (alarmList === null || alarmList === undefined) {
            return;
        }
        
        if (sensorDatas === null || sensorDatas === undefined) {
            return;
        }
        
        let result = [];
        
        for (let i = 0; i < sensorDatas.length; i++) {
            const sensor = sensorDatas[i];
            let isAlarm = false;
            for (let i = 0; i < alarmList.length; i++) {
                const alarm = alarmList[i];
                if (alarm.isAlarm) {
                    if (sensor.sensorID === alarm.zoneID) {
                        isAlarm = true;
                        break;
                    }
                }
            }
            let element = [sensor.sensorID, isAlarm];
            result.push(element);
        }
        
        if (this.props.wsMgr) {
            this.props.wsMgr.sendAlarmInfo(result);
        }
    }

    initPopupState() {
        var popup = document.getElementsByClassName(content.eventInfoPopup)[0];

        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        }

        this.setState({ popup: popup });
    }


    onCloseConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        this.setState({ confirmMessage });
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

        this.setState({ confirmMessage });
    }

    repositionPopup(popupState) {
        let data = popupState.eventInfo;

        if (data === null || data === undefined)
            return;

        //let popup = document.getElementsByClassName(content.viewDashboard + ' ' + content.viewDashboardBoxD)[0];
        let popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return;

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
    }

    resetPopupState = (popupState) => {
        let data = popupState;

        if (data.actionType === 'RESET_POPUP') {
            this.repositionPopup(data.popupState);
        }
    }

    getAlarmStepBox(noAction, alarmDepth, zoneID) {
        const elements = [];
        if (noAction) {
            if (alarmDepth > 3) {
                elements.push(<span className={'stepName'} key={zoneID}>단계 : 심각</span>);
                elements.push(
                    <div className={'sensorSeriousStepBox'} key={"sensorSeriousStepBox" + zoneID}>
                        <span className={'seriousBox1'}></span>
                        <span className={'seriousBox2'}></span>
                        <span className={'seriousBox3'}></span>
                        <span className={'seriousBox4'}></span>
                    </div>
                );
            }
            else if (alarmDepth === 3) {
                elements.push(<span className={'stepName'} key={zoneID}>단계 : 경계</span>);
                elements.push(
                    <div className={'sensorBoundaryStepBox'} key={"sensorSeriousStepBox" + zoneID} >
                        <span className={'boundaryBox1'}></span>
                        <span className={'boundaryBox2'}></span>
                        <span className={'boundaryBox3'}></span>
                        <span className={'boundaryBox4'}></span>
                    </div>
                );
            }
        }
        else {
            if (alarmDepth > 3) {
                elements.push(<span className={'stepName'} key={zoneID}>단계 : 심각</span>);
                elements.push(
                    <div className={'sensorSeriousCompletionBox'} key={"sensorSeriousStepBox" + zoneID} >
                        <span className={'seriousBox1'}></span>
                        <span className={'seriousBox2'}></span>
                        <span className={'seriousBox3'}></span>
                        <span className={'seriousBox4'}></span>
                    </div>
                );
            }
            else if (alarmDepth === 3) {
                elements.push(<span className={'stepName'} key={zoneID}>단계 : 경계</span>);
                elements.push(
                    <div className={'sensorBoundaryCompletionBox'} key={"sensorSeriousStepBox" + zoneID} >
                        <span className={'boundaryBox1'}></span>
                        <span className={'boundaryBox2'}></span>
                        <span className={'boundaryBox3'}></span>
                        <span className={'boundaryBox4'}></span>
                    </div>
                );
            }
        }

        return elements;
    }

    getMakeDateTime(dateTime) {
        let year = dateTime.getFullYear();
        let month = 1 + dateTime.getMonth();
        month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
        let day = dateTime.getDate();                   //d
        day = day >= 10 ? day : '0' + day;

        let strDate = year + '-' + month + '-' + day;
        return strDate;
    }
    getMakeTime(dateTime) {
        let hour = dateTime.getHours();
        hour = hour >= 10 ? hour : '0' + hour;
        let min = dateTime.getMinutes();
        min = min >= 10 ? min : '0' + min;
        let sec = dateTime.getSeconds();
        sec = sec >= 10 ? sec : '0' + sec;

        let strDate = hour + ':' + min + ':' + sec;
        return strDate;
    }

    async getMinMaxIndex(beginDate, endDate, facilityType, buildingGroupID, buildingID, zoneID) {
        const [minID, maxID] = await HistoryController.GetMinMaxIndex(beginDate, endDate, facilityType, buildingGroupID, buildingID, zoneID);

        return [minID, maxID];
    }

    async getSensorZoneHistory() {
        const beginDate = this.getMakeDateTime(this.state.beginDate) + ' 00:00:00';
        const endDate = this.getMakeDateTime(this.state.endDate) + ' 23:59:59';

        const buildingGroupID = this.state.selectedBuildingGroupID;
        const buildingID = this.state.selectedBuildingID;
        const zoneID = this.state.selectedZoneID;
        const facilityType = this.state.facilityType;

        const [minID, maxID] = await this.getMinMaxIndex(beginDate, endDate, facilityType, buildingGroupID, buildingID, zoneID);

        //const [dataSource, currentLastID, sensorZoneHistories] = await HistoryController.DisplaySensorDetectHistories(
        //    beginDate, endDate, facilityType, buildingGroupID, buildingID, zoneID,
        //    -1, this.state.maxRowCount * this.state.maxPageCount, true);

        const [dataSource, currentLastID, sensorZoneHistories] = await HistoryController.DisplaySensorDetectHistories(
            beginDate, endDate, facilityType, buildingGroupID, buildingID, zoneID,
            -1, 50, true);

        //let searchZoneName = '-';
        let searchZoneName = '전체';

        this.setState({
            dataSource, minID, maxID,
            searchBeginDate: beginDate, searchEndDate: endDate, searchFacilityType: facilityType,
            searchBuildingGroupID: buildingGroupID, searchBuildingID: buildingID, searchZoneID: zoneID, searchZoneName,
            currentLastID
        });
    }

    async onClickDownload() {
        const title = '센서 탐지 이력';

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(title); // sheet 이름

        // title		
        let titleRow = worksheet.getCell('A1');
        titleRow.value = title;

        titleRow.font = { name: '맑은 고딕', family: 4, size: 20, bold: true };
        worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.mergeCells('A1:K2');
        worksheet.getCell('A1:H2').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }

        const beginDate = this.getMakeDateTime(this.state.beginDate);
        const endDate = this.getMakeDateTime(this.state.endDate);
        worksheet.addRow(['조회기간 : ' + beginDate + ' ~ ' + endDate]);
        worksheet.addRow(['조회범위 : ' + this.state.searchZoneName]);
        worksheet.addRow([]);

        // column
        let columnRow = worksheet.addRow(['No', '일시', '종료일시', '유형', '센서명', '위치', '실제/테스트', '탐지 유형', '탐지 정보', '위험경보 단계', '대응 SOP']);
        columnRow.eachCell((cell, number) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '#A24B40' }
            };
            cell.style = {
                alignment: { vertical: 'middle', horizontal: 'center' }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }

        });

        // column key 설정 
        worksheet.columns = [
            { key: "no", width: 5 },
            { key: "time", width: 20 },
            { key: "endTime", width: 20 },
            { key: "type", width: 15 },
            { key: "sensorName", width: 25 },
            { key: "zoneName", width: 30 },
            { key: "realMode", width: 15 },
            { key: "detectType", width: 15 },
            { key: "detectInfo", width: 15 },
            { key: "alarmLevel", width: 15 },
            { key: "sopName", width: 40 }
        ];

        const [dataSource, currentLastID, sensorZoneHistories] = await HistoryController.DisplaySensorDetectHistories(
            this.state.searchBeginDate, this.state.searchEndDate, this.state.searchFacilityType
            , this.state.searchBuildingGroupID, this.state.searchBuildingID, this.state.searchZoneID,
            -1, -1, true);

        if (dataSource.length === 0) {
            //return window.alert("대응 완료된 이벤트가 없습니다.");
            return this.showConfirmDialog("에러", ["대응 완료된 이벤트가 없습니다."], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
        }

        let isNullArray = false;

        if (dataSource) {
            let arrDatas = [];
            const dataLength = dataSource.length;
            for (let i = 0; i < dataLength; i++) {
                const data = [];

                //const checked = dataSource[i].checked;
                //if (isCheckedDownload && !checked) {
                //	continue;
                //}

                const alarms = this.props.sensorAlarms;
                let sensorType = null;
                let strSensorName = null;

                for (const alarm of alarms) {
                    if (alarm.sensorZoneHistoryID === dataSource[i].sensorZoneHistoryID) {
                        sensorType = this.getTypeFromZoneID(alarm.zoneID);
                        strSensorName = alarm.materialTypeString
                    }
                }

                const no = arrDatas.length + 1;
                const time = dataSource[i].time;
                const endTime = dataSource[i].endTime;
                const type = dataSource[i].type;
                const sensorName = dataSource[i].sensorName;
                const zoneName = dataSource[i].zoneName;
                const realMode = dataSource[i].realMode;
                const detectType = dataSource[i].detectType;
                const detectInfo = dataSource[i].detectInfo;
                const alarmLevel = dataSource[i].alarmLevel;
                const sopName = dataSource[i].sopName;

                if (endTime === '') {
                    continue;
                }

                data.no = no;
                data.time = time;
                data.endTime = endTime;
                //data.type = type;
                //data.sensorName = sensorName;
                data.type = sensorType;
                data.sensorName = strSensorName;
                data.zoneName = zoneName;
                data.realMode = (realMode === '1') ? '실제' : '테스트';
                data.detectType = detectType;
                data.detectInfo = detectInfo;
                data.alarmLevel = alarmLevel;
                data.sopName = (sopName.length > 0) ? sopName : '-';

                arrDatas.push(data);

                if (arrDatas.length >= 1) {
                    isNullArray = true;
                }
            }

            arrDatas.forEach(function (item, index) {
                worksheet.addRow({
                    no: item.no,
                    time: item.time,
                    endTime: item.endTime,
                    type: item.type,
                    sensorName: item.sensorName,
                    zoneName: item.zoneName,
                    realMode: item.realMode,
                    detectType: item.detectType,
                    detectInfo: item.detectInfo,
                    alarmLevel: item.alarmLevel,
                    sopName: item.sopName
                }).alignment = { vertical: 'middle', horizontal: 'center' };
            })
        }

        // 다운로드 
        const mimeType = { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], mimeType);

        const dtNow = new Date();
        const date = this.getMakeDateTime(dtNow).replace(/-/gi, '');
        const time = this.getMakeTime(dtNow).replace(/:/gi, '');

        if (window.confirm("전체 센서 이벤트를 Excel파일로 받으시겠습니까?")) {
            if (isNullArray) {
                saveAs(blob, title + '_' + date + '_' + time + ".xlsx");
            } else {
                //return window.alert("대응 완료된 이벤트가 없습니다.");
                return this.showConfirmDialog("에러", ["대응 완료된 이벤트가 없습니다."], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
            }
        } else {
            return;
        }
        
    } // 전체 다운로드

    async onClickSelectDownload() {
        const title = '센서 탐지 이력';
         
        //if (!this.props.selectedAlarm) {
        //    return alert("선택된 항목이 없습니다.");
        //}

        if (this.props.selectedSensor?.sensor.zoneID !== this.props.selectedAlarm?.zoneID) {
            this.showConfirmDialog("에러", ["선택된 항목이 없습니다. 센서 이벤트를 선택해주세요."], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(title); // sheet 이름

        let confirmLocation = null;

        // title		
        let titleRow = worksheet.getCell('A1');
        titleRow.value = title;

        titleRow.font = { name: '맑은 고딕', family: 4, size: 20, bold: true };
        worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.mergeCells('A1:K2');
        worksheet.getCell('A1:H2').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }

        const beginDate = this.getMakeDateTime(this.state.beginDate);
        const endDate = this.getMakeDateTime(this.state.endDate);
        worksheet.addRow(['조회기간 : ' + beginDate + ' ~ ' + endDate]);
        worksheet.addRow(['조회범위 : ' + this.state.searchZoneName]);
        worksheet.addRow([]);

        // column
        let columnRow = worksheet.addRow(['No', '일시', '종료 일시', '유형', '센서명', '위치', '실제/테스트', '탐지 유형', '탐지 정보', '위험경보 단계', '대응 SOP']);
        columnRow.eachCell((cell, number) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '#A24B40' }
            };
            cell.style = {
                alignment: { vertical: 'middle', horizontal: 'center' }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }

        });

        // column key 설정 
        worksheet.columns = [
            { key: "no", width: 5 },
            { key: "time", width: 20 },
            { key: "endTime", width: 20 },
            { key: "type", width: 15 },
            { key: "sensorName", width: 25 },
            { key: "zoneName", width: 30 },
            { key: "realMode", width: 15 },
            { key: "detectType", width: 15 },
            { key: "detectInfo", width: 15 },
            { key: "alarmLevel", width: 15 },
            { key: "sopName", width: 40 }
        ];

        const [dataSource, currentLastID, sensorZoneHistories] = await HistoryController.DisplaySensorDetectHistories(
            this.state.searchBeginDate, this.state.searchEndDate, this.state.searchFacilityType
            , this.state.searchBuildingGroupID, this.state.searchBuildingID, this.state.searchZoneID,
            -1, -1, true);

        let isOkDownload = true;

        if (dataSource) {
            let arrDatas = [];
            //const dataLength = this.state.dataSource.length;
            const dataLength = dataSource.length;
            for (let i = 0; i < dataLength; i++) {
                const data = [];

                /* 기존 체크박스 선택 영역 
                 * selectedAlarm과 history공통 항목 비교하여 일치한 history 엑셀 출력
                 */
                //const checked = this.state.dataSource[i].checked;
                //if (!checked) {
                //    continue;
                //}

                const selectedAlarm = this.props.selectedAlarm;
                const selectedSensor = this.props.selectedSensor;

                // SensorZoneHistoryID로 비교하여야 함 
                // 선택한 알람과 이벤트가 일치하는지 => X 
                //if (selectedSensor?.sensor.position !== dataSource[i]?.sensorName) {
                //    continue;
                //}

                if (selectedAlarm?.sensorZoneHistoryID !== dataSource[i]?.sensorZoneHistoryID) {
                    continue;
                }

                // 동일한 센서에서 발생시 가장 최근 이벤트만 다운로드
                if (arrDatas.length !== 0) {
                    continue;
                }

                const no = arrDatas.length + 1;
                const time = dataSource[i].time;
                const endTime = dataSource[i].endTime;
                const type = dataSource[i].type;
                const sensorName = dataSource[i].sensorName;
                const zoneName = dataSource[i].zoneName;
                const realMode = dataSource[i].realMode;
                const detectType = dataSource[i].detectType;
                const detectInfo = dataSource[i].detectInfo;
                const alarmLevel = dataSource[i].alarmLevel;
                const sopName = dataSource[i].sopName;

                const strSensorType = this.getTypeFromZoneID(selectedAlarm?.zoneID);

                data.no = no;
                data.time = time;
                data.endTime = endTime;
                data.type = strSensorType;
                //data.sensorName = sensorName;
                //data.zoneName = zoneName;
                data.sensorName = selectedAlarm.materialTypeString;
                data.zoneName = sensorName;
                data.realMode = (realMode === '1') ? '실제' : '테스트';
                data.detectType = detectType;
                data.detectInfo = detectInfo;
                data.alarmLevel = alarmLevel;
                data.sopName = (sopName.length > 0) ? sopName : '-';

                confirmLocation = data.sensorName;

                if (endTime === '') {
                    isOkDownload = false;
                } else {
                    arrDatas.push(data);
                }
               
            }

            arrDatas.forEach(function (item, index) {
                worksheet.addRow({
                    no: item.no,
                    time: item.time,
                    endTime: item.endTime,
                    type: item.type,
                    sensorName: item.sensorName,
                    zoneName: item.zoneName,
                    realMode: item.realMode,
                    detectType: item.detectType,
                    detectInfo: item.detectInfo,
                    alarmLevel: item.alarmLevel,
                    sopName: item.sopName
                }).alignment = { vertical: 'middle', horizontal: 'center' };
            })
        }

        if (!isOkDownload) {
            //window.alert("선택하신 이벤트는 미대응 상태입니다.\n대응 완료된 이벤트를 선택해주세요.");
            this.showConfirmDialog("에러", ["선택하신 이벤트는 미대응 상태입니다.\n대응 완료된 이벤트를 선택해주세요."], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
            return;
        }

        // 다운로드 
        const mimeType = { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], mimeType); 

        const dtNow = new Date();
        const date = this.getMakeDateTime(dtNow).replace(/-/gi, '');
        const time = this.getMakeTime(dtNow).replace(/:/gi, '');

        if (!confirmLocation) {
            //window.alert("선택된 이벤트가 존재하지 않습니다. \r 대응 완료된 이벤트를 선택해주세요.");
            this.showConfirmDialog("에러", ["선택된 이벤트가 존재하지 않습니다. \r 대응 완료된 이벤트를 선택해주세요."], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
            return;
        } else {
            if (window.confirm(confirmLocation + "에서 발생한 알람을 Excel파일로 받으시겠습니까?")) {
                return saveAs(blob, title + '_' + date + '_' + time + ".xlsx");
            }
        }
    } // 선택 다운로드

    getTypeFromZoneID = (zoneID) => {
        const sensorList = this.props.sensorList;

        if (!zoneID) {
            return '기타';
        }

        if (sensorList === null || sensorList === undefined) {
            return '기타';
        }

        const atmospheres = sensorList.atmospheres
        const waters = sensorList.waters;
        const vocs = sensorList.vocs;

        for (const atmos of atmospheres) {
            if (atmos.zoneID === zoneID) {
                return '대기';
            }
        }

        for (const water of waters) {
            if (water.zoneID === zoneID) {
                return '수질';
            }
        }

        for (const voc of vocs) {
            if (voc.zone === zoneID) {
                return 'VOC';
            }
        }
    }

    getElements(noAction, elementCount) { // noAction : 대응 = false , 미대응 = true 
        const elements = [];

        if (this.props.sensorAlarms === null || this.props.sensorAlarms.length === 0) {

            this.alarmOnNum = 0;
            this.alarmOffNum = 0;

            return <></>;
        }
        const els = [];

        // 시나리오용
        const testKey = 10000;
        //#region
        els.push(<span className={'stepName'} key={testKey}>단계 : 심각</span>);
        els.push(
            <div className={'sensorSeriousStepBox'} key="testStepBox">
                <span className={'seriousBox1'}></span>
                <span className={'seriousBox2'}></span>
                <span className={'seriousBox3'}></span>
                <span className={'seriousBox4'}></span>
            </div>
        );

        const testDt = new Date();
        const dtDay = testDt.getDate();
        const dth = testDt.getHours();
        const dtm = testDt.getMinutes();
        const dts = testDt.getSeconds();

        const dthms = dtDay.toString() + " " + dth.toString() + dtm.toString() + dts.toString();
        
        const testAlarm = <div className={'sensorlocationBox'} className={content.redTxt + " active"} /* onClick={() => this.props.onSelectedAlarm(alarm, false)}*/>
            <div className={'sensorList'}>
                <span style={{ width: '20%' }}>센서위치</span>
                <span style={{ width: '62%' }}>여수산단2로</span>
                <span className={'moveBtn'}>이동</span>
            </div>
            <div className={'sensorList'}>
                <span style={{ width: '20%' }}>발생일시</span>
                <span style={{ width: '80%' }}>{dthms}</span>
            </div>
            <div className={'sensorList'}>
                <span style={{ width: '20%' }}>상황유형</span>
                <span style={{ width: '17%' }}>대기오염</span>

                {
                    els
                }

            </div>
            <div className={'sensorList'}>
                <span style={{ width: '20%' }}>대응상태</span>
                <span style={{ width: '24%' }} className="redText">미대응</span>
                <span style={{ width: '14%' }}>SOP</span>
                <span style={{ width: '24%', flex: '1' }}>미대응</span>
                <span className={'memoIcon'} /*onClick={() => this.showMemo(alarm, sensor)}*/></span>
            </div>
        </div>

        if (this.props.testParam && noAction) {
            elements.push(testAlarm);
        }
        //#endregion

        const alarms = this.props.sensorAlarms;

        this.alarmOnNum = 0;
        this.alarmOffNum = 0;

        for (let i = 0; i < alarms.length; i++) {
            const alarm = alarms[i];
            const dt = new Date(alarm.dtTime);
            let mm = dt.getMonth() + 1;
            let dd = dt.getDate();
            let ss = dt.getSeconds();
            const ymd = dt.getFullYear() + '.' + StringUtil.getDoubleString(mm) + '.' + StringUtil.getDoubleString(dd);
            const hms = StringUtil.getDoubleString(dt.getHours()) + ':' + StringUtil.getDoubleString(dt.getMinutes()) + ':' + StringUtil.getDoubleString(ss);

            const alarmSensorZoneIDs = alarm.alarmSensorZoneIDs; // 이유는 모르겠으나 이 값이 비어 있어 알람 종료 시에도 대응이 되지 않음 => 표출 안하기로 함
            
            if (alarmSensorZoneIDs.length === 0)
                continue;
            
            const [sensorGroupData, sensor] = this.props.getAlarmSensor(alarm);

            if (!sensorGroupData || !sensor) {
                continue;
            }

            let sopStatusClassName = content.redTxt;
            let sopStatusText = '미대응';
            let statusClassName = content.red;
            let alarmStatusText = '미대응';

            if (alarm.sopStatus === 1) {
                //sopStatusClassName = content.greenTxt;
                sopStatusClassName = content.redTxt;
                sopStatusText = '대응중';
                //statusClassName = content.grn;
                statusClassName = content.red;
            }
            else if (alarm.sopStatus === 2) {
                sopStatusClassName = content.whiteTxt;
                sopStatusText = 'SOP종료';
                statusClassName = '';
            }

            let textColorClassName = "greenText";

            if (alarm.isAlarm) {
                alarmStatusText = '알람진행';
                textColorClassName = 'redText'
                this.alarmOnNum += 1;
            }

            if (alarm.isAlarm === false) {
                sopStatusClassName = content.whiteTxt;
                sopStatusText = '알람종료';
                alarmStatusText = '알람종료';
                statusClassName = '';
                this.alarmOffNum += 1;
            }

            if (sopStatusText === '미대응' || sopStatusText === '대응중') {
                if (noAction === false || alarm.isAlarm === false) {
                    continue;
                }
                textColorClassName = "redText";
            }
            else {
                if (noAction) {
                    if (!alarm.isAlarm) {
                        continue;
                    }

                } else {
                    if (alarm.isAlarm) {
                        textColorClassName = "redText";
                        continue;
                    }
                }
            }

            const inputID = "check_btn_" + noAction + "_" + i;

            let sensorBoxClassName = null;

            // StatusInfo 트리에서 센서 선택시 알람 선택 해제
            if (this.props.selectedSensor) {
                if (this.props.selectedSensor?.sensor.zoneID === this.props.selectedAlarm?.zoneID) {
                    if (this.props.selectedAlarm?.zoneID === alarm?.zoneID) {
                        if (this.props.selectedAlarm?.sensorZoneHistoryID === alarm?.sensorZoneHistoryID)
                        sensorBoxClassName = "active";
                    }
                } else {
                    sensorBoxClassName = "";
                }
                
            }
            //const sensorBoxClassName = this.props.selectedAlarm === alarm ? "active" : "";

            /*elements.push(
                <div className="check_wrap">
                    <input type="checkbox" id={inputID} />
                    <label htmlFor={inputID}></label>
                </div>
            );*/

            if (this.props.testParam) {
                sensorBoxClassName = "";
            }

            elements.push(
                <div /* className={'sensorlocationBox'} */ className={'sensorlocationBox' + " " + sensorBoxClassName} onClick={() => this.props.onSelectedAlarm(alarm, false, alarm.isAlarm)} key={alarm.sensorZoneHistoryID}>
                    <div className={'sensorList'}>
                        <span style={{ width: '20%' }}>센서위치</span>
                        <span style={{ width: '62%' }}>{alarm.positionName}</span>
                        {/*<span className={'moveBtn'} onClick={() => this.onClickMoveToSensor(sensor, alarm)}>이동</span>*/}
                        <span className={'moveBtn'} onClick={() => this.props.onSelectedAlarm(alarm, false, alarm.isAlarm)}>이동</span>
                    </div>
                    <div className={'sensorList'}>
                        <span style={{ width: '20%' }}>발생일시</span>
                        <span style={{ width: '80%' }}>{ymd + " " + hms}</span>
                    </div>
                    <div className={'sensorList'}>
                        <span style={{ width: '20%' }}>상황유형</span>
                        <span style={{ width: '17%' }}>{sensorGroupData.alarmType}</span>

                        {
                            this.getAlarmStepBox(noAction, alarm.alarmDepth, alarm.zoneID)
                        }

                    </div>
                    <div className={'sensorList'}>
                        <span style={{ width: '20%' }}>대응상태</span>
                        <span style={{ width: '24%' }} className={textColorClassName}>{alarmStatusText}</span>
                        <span style={{ width: '14%' }}>SOP</span>
                        <span style={{ width: '24%', flex: '1' }}>{sopStatusText}</span>
                        <span className={'memoIcon'} onClick={() => this.showMemo(alarm, sensor)}></span>
                    </div>
                </div>
            );

            const firstAlarm = alarms[0];

            if (firstAlarm) {
                this.props.firstSensorAlarm(firstAlarm);
            }

        }

        if (noAction) {
            elementCount[0] = elements.length;

            return (
                <div className={'tab-btn-content unresponsive'}>
                    <div className={'tab_content'}>
                        <div className={'tab-scroll'}>
                            {
                                elements
                            }
                        </div> {/* scrollbar Area */}
                        <div className={'sensorEventBtn'}>
                            <span className={'spreading'} onClick={() => this.onClickRunSOP()}>SOP실행</span>
                            <span className={'spreadEnd'} onClick={() => this.onMalfunction()}>알람종료</span>
                        </div>
                    </div> {/* tab_content */}
                </div>
            );
        }

        elementCount[1] = elements.length;


        return (
            <div className={'tab-btn-content responsive'}>
                <div className={'tab_content'}>
                    <div className={'tab-scroll'}>
                        {
                            elements
                        }
                    </div> {/* scrollbar Area */}
                    <div className={'sensorEventBtn'}>
                        <span className={'historyBtn'} onClick={() => this.onClickSelectDownload()}>다운로드</span>
                        <span className={'downBtn'} onClick={() => this.onClickDownload()}>전체 다운로드</span>
                    </div>
                </div> {/* tab_content */}
            </div>
        );
    }

    onMalfunction() {
        const alarm = this.props.selectedAlarm;

        if (!alarm) {
            return;
        }

        const userAuthor = ProjectResource.getUserAuthor();

        if (alarm.isAlarm) {
            // 권한에 따른 상황 종료 여부
            if (userAuthor === AccountResource.ID.accountLevel.admin) {
                this.props.onMalfunction(alarm);
            }
            else {
                this.props.onAuthorError();
            }
        }
    }

    async onClickRunSOP() {
        const alarm = this.props.selectedAlarm;

        if (!alarm) {
            return;
        }

        if (!alarm.isAlarm) {
            //alert('이미 종료된 알람입니다.');
            this.showConfirmDialog("에러", ["이미 종료된 알람입니다."], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
            return;
        }

        //if (alarm.sopStatus !== -1) {
        //    //alert('SOP가 진행중이거나 이미 종료되었습니다.\r\n연결된 SOP가 존재하지 않을수도 있습니다.');
        //    this.showConfirmDialog("에러", ["SOP가 진행중이거나 이미 종료되었습니다.\r\n연결된 SOP가 존재하지 않을수도 있습니다."], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
        //    return;
        //}

        if (alarm.sopStatus !== 1) {
            //alert('SOP가 진행중이거나 이미 종료되었습니다.\r\n연결된 SOP가 존재하지 않을수도 있습니다.');
            this.showConfirmDialog("에러", ["SOP가 진행중이거나 이미 종료되었습니다.\r\n연결된 SOP가 존재하지 않을수도 있습니다."], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
            return;
        }

        if (!window.confirm('SOP를 실행할까요?'))
            return;

        // sop 새탭으로 띄우기
        // window.open(ProjectResource.path.sopSimulator);

        await SDMSController.requestSituationNotice(alarm.facilityType, alarm.sensorZoneID);

        // 기존탭에서 이동
        this.props.history.push({
            pathname: '/sop-simulator',
            state: alarm });

        // this.props.history.push('/sop-simulator');
    }

    showMemo(alarm, sensor) {
        if (alarm && sensor) {
            // 메모창이 떠있는 상태에서 내용을 바꿔주기 위하여 postMemo를 사용한다.
            this.setState({ memoInfo: null, postMemo: [alarm, sensor] });
        }
        else {
            this.hideMemo();
        }
    }

    async saveMemo(alarm, sensor) {
        const memo = this.refMemo.current.value;

        if (memo) {
            const result = await HistoryController.UpdateAlarmMemo(alarm.sensorZoneHistoryID, memo);

            if (!result) {
                //alert("[오류]\r\n메모를 저장 할 수 없습니다.");
                this.showConfirmDialog("에러", ["[오류]\r\n메모를 저장 할 수 없습니다."], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
            }
            else {
                alarm.alarmMemo = memo;
            }
        }

        this.hideMemo();
    }

    hideMemo() {
        this.setState({ memoInfo: null });
    }

    onClickMoveToSensor(sensor, alarm) {
        if (this.props.wsMgr) {
            if (alarm.isAlarm) {
                this.props.wsMgr.showAlarm(sensor.id, null, null, null);
            }
            else {
                this.props.wsMgr.sendMoveToSensor(sensor.id, null, null, null);
            }
        }
    }

    getSensorList() {
        const _sensors = {
            fire: {}
        };
        const sensorList = this.props.sensorList;

        if (sensorList) {
            for (const sensorTypeName in sensorList) {
                const typeSensors = {};
                _sensors[sensorTypeName] = typeSensors;

                if (sensorTypeName === "atmospheres") {
                    typeSensors.data = SdmsResource.AtmosphereData;
                }
                else if (sensorTypeName === "waters") {
                    typeSensors.data = SdmsResource.WaterData;
                }
                else {
                    continue;
                }

                const sensors = sensorList[sensorTypeName];

                for (const sensorGroup of sensors) {
                    for (const sensor of sensorGroup.sensors) {
                        typeSensors[sensor.id] = sensor;
                    }
                }
            }
        }

        return _sensors;
    }

    onSelectTab(checkedAction) {
        this.setState({ checkedAction });
    }

    // 선택된 이벤트 존재시 해당 탭 ( 대응 , 미대응 ) 이동
    isAlarmed() {

        if (this.props.selectedAlarm?.isAlarm !== this.state.checkedAction) {
            return;
        }

        if (this.props.selectedAlarm) {
            const isAlarmed = this.props.selectedAlarm;
            if (isAlarmed.isAlarm) {
                this.setState({ checkedAction: false });
            } else {
                this.setState({ checkedAction: true });
            }
        }
    }

    getElementCount(elementCount, noAction) {
        if (noAction) {
            return elementCount[0];
        }

        return elementCount[1];
    }

    getMemoElement(alarm, sensor) {
        const popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return <></>;

        const parent = popup.parentElement;
        const memo = alarm ? alarm.alarmMemo : "";

        if (parent) {
            if (this.state.memoInfo) {
                const memoWidth = 241;

                const rectParent = parent.getBoundingClientRect();
                const rect = popup.getBoundingClientRect();

                if (rect.right + memoWidth <= rectParent.width) {
                    return (
                        <div className={'eventMemoBox'} style={{ /* display: 'none', */ position: 'absolute', left: '400px', bottom: '340px' }} /* className={isOpen ? "show-memo" : "hide-memo"} */>
                            <span>메모작성</span>
                            <textarea ref={this.refMemo} className={'memoTextArea'} placeholder="텍스트를 입력해주세요." style={{ resize: 'none' }} defaultValue={memo}></textarea>
                            <div className={'memoBtn'}>
                                <span className={'cancle'} onClick={() => this.hideMemo()}>취소</span>
                                <span className={'save'} onClick={() => this.saveMemo(alarm, sensor)}>저장</span>
                            </div>
                        </div>
                    );
                }
                else {
                    return (
                        <div className={'eventMemoBox'} style={{ /* display: 'none', */ position: 'absolute', right: '370px', top: '0' }} /* className={isOpen ? "show-memo" : "hide-memo"} */>
                            <span>메모작성</span>
                            <textarea ref={this.refMemo} className={'memoTextArea'} placeholder="텍스트를 입력해주세요." style={{ resize: 'none' }} defaultValue={memo}></textarea>
                            <div className={'memoBtn'}>
                                <span className={'cancle'} onClick={() => this.hideMemo()}>취소</span>
                                <span className={'save'} onClick={() => this.saveMemo(alarm, sensor)}>저장</span>
                            </div>
                        </div>
                    );
                }
            }
        }

        return <></>;
    }

    onSound = () => {
        if (this.props.selectedAlarm === null) {
            return;
        }

        if (this.props.alarmSound === false && this.props.selectedAlarm.isAlarm === false) {
            return;
        }

        if (this.props.selectedAlarm.sound === undefined) {
            this.props.selectedAlarm.sound = true;
        }

        this.props.selectedAlarm.sound = !this.props.selectedAlarm.sound;
        this.props.onSound(this.props.selectedAlarm.sound);
    }

    render() {
        const checkedAction = this.state.checkedAction;
        const elementCount = [0, 0];
        const alarm = this.state.memoInfo && this.state.memoInfo.length >= 2 ? this.state.memoInfo[0] : null;
        const sensor = this.state.memoInfo && this.state.memoInfo.length >= 2 ? this.state.memoInfo[1] : null;

        /* const [isOpen, setMemoBox] = useState(false);
        const toggleMemo = () => {
            setMemoBox(isOpen => !isOpen);
        } */

        let isAlarmOn = this.props.alarmSound;

        return (
            <>
                <EventInfoComponent id={this.props.popupType} className={content.eventInfoPopup + " " + SDMSResource.UISection}>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={359}
                        popupMinHeight={570}
                        topSize={35}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                    >

                    <div className={'sensorInfoTitleBoxE'}>
                       <div className={'sensorDslTopE'}>
                          <span className={'eventTitleIcon'}></span>
                          <span className={'sensorTitleE'}>이벤트정보</span>
                           {/* <div className="alarmToolBox"><div data-tooltip="음소거"><AlarmOnIcon className="alarmOnIcon"></AlarmOnIcon></div></div>
                           <AlarmOffIcon className="alarmOffIcon"></AlarmOffIcon> */}
                       </div>

                      <div className={'sensorInfoTitleSecondE'}>
                        <div className={'alarmToolBox'}>
                            {isAlarmOn ?
                                <div data-tooltip="음소거" onClick={() => this.onSound()} >
                                    <img /* src="./../../resource/image/sdms/notifications_black.png"*/ src={AlarmOn} id="pic"/>
                                </div>
                                : <div data-tooltip="음소거해제" onClick={() => this.onSound()} >
                                    <img /* src="./../../resource/image/sdms/notifications_black.png"*/ src={AlarmOff} id="pic" />
                                </div>
                            }
                        </div>
                        <span className={'seosorCloseIcon'} onClick={() => this.props.setVisiblePopups(SDMS.menu.eventInfo, false)}></span>
                      </div>
                    </div>

                    <div className={'contentPaddingBox'} style={{ minHeight: '530px' }}>
                        <div className={'tabs'}>
                           <span className={'tabsBox'}>
                                {
                                    !checkedAction &&
                                    <input id={'unresponsive'} type="radio" name="tab_item" defaultChecked style={{ display: 'none' }} className={'tab-switch unresponsive'} onClick={() => this.onSelectTab(false)} />
                                }
                                {
                                    checkedAction &&
                                    <input id={'unresponsive'} type="radio" name="tab_item" style={{ display: 'none' }} className={'tab-switch unresponsive'} onClick={() => this.onSelectTab(false)} />
                                }
                                    <label className={'tab_item'} htmlFor="unresponsive">미대응
                                            {this.alarmOnNum > 0 &&
                                                <span className={'unresponNum'}>{this.alarmOnNum}</span>
                                            }
                                    </label>
                                {
                                    this.getElements(true, elementCount)
                                }

                                {
                                    checkedAction &&
                                    <input id={'responsive'} type="radio" name="tab_item" defaultChecked style={{ display: 'none' }} className={'tab-switch responsive'} onClick={() => this.onSelectTab(true)} />
                                }
                                {
                                    !checkedAction &&
                                    <input id={'responsive'} type="radio" name="tab_item" style={{ display: 'none' }} className={'tab-switch responsive'} onClick={() => this.onSelectTab(true)} />
                                }
                                    <label className={'tab_item'} htmlFor="responsive">대응
                                            {this.alarmOffNum > 0 &&
                                                <span className={'responNum'}>{this.alarmOffNum}</span>
                                            }
                                    </label>

                                {
                                    this.getElements(false, elementCount)
                                }

                            {/*
                            <div className="check_wrap2">
                                <input type="checkbox" id="check_btn7" />
                                <label htmlFor="check_btn7"><span>전체선택</span></label>
                            </div>
                            */}
                            {/*<span className="areaText">{"전체 " + this.getElementCount(elementCount, !checkedAction) + "건"}</span>*/}
                            </span> {/* tabsBox */}
                        </div> {/* tabs */}
                    </div>{ /* contentPaddingBox */}

                    {
                        this.getMemoElement(alarm, sensor)
                    }
                </PopupDraggable>
                </EventInfoComponent>

                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
                }

            </>
        );
    }
};

export default withRouter(EventInfo);