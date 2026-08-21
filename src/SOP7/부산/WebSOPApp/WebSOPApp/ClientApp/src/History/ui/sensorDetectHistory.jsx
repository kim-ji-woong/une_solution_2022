//import { Button } from '@amcharts/amcharts4/core';
import React, { Component } from 'react';
import $ from 'jquery';
import HistoryResource from "../resource/id";
import HistoryController from '../services/historyController';

import { SDMSController } from "../../SDMS/services/sdmsController";

import newStyles from "../../Common/css/newStyle.module.css";
import uneStyles from "../../Common/css/uneCommon.module.css";
import teamEditorCss from "../../TeamEditor/css/teamEditor.module.css";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko, enUS } from 'date-fns/esm/locale';
import btnCalendarBk from '../../Common/img/sub/dashboard_calendar_blue.png';
import memoIcon_on from '../../Common/img/common/history_memo_On.png';
import memoIcon_off from '../../Common/img/common/history_memo_Off.png';

import CircularProgress from '@material-ui/core/CircularProgress';

import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/
import SensorDetectHistoryMemo from './popups/SensorDetectHistoryMemo';

import ProjectResource from '../../Root/resource/id';
import { SensorDetectHistoryMemoComponent } from '../styled/SensorDetectHistoryStyled';
import SDMS from "../../SDMS/ui/sdms";


class SensorDetectHistory extends Component {
	
	static ExternalSensorTypes = {
		Atmosphere: 1,
		Electricity: 3,
		KWeather: 4,
	}
	
	constructor(props) {
		super(props);

		this.state = {
			dataSource: null,

			// 현재 조회 데이터에 적용된 필터
			minID: 0,
			maxID: 0,
			currentLastID: 0,
			searchBeginDate: new Date(),
			searchEndDate: new Date(),
			searchFacilityType: -1,
			searchBuildingGroupID: -1,
			searchBuildingID: -1,
			searchZoneID: -1,

			searchZoneName: '-',

			selectedBuildingGroupID: -1,
			selectedBuildingID: -1,
			selectedZoneID: -1,
			dateType: 'today',
			beginDate: new Date(),
			endDate: new Date(),			
			facilityType: -1,
			currentFacilityType: -1,
			
			maxRowCount: 14,  // 한 페이지에 보여줄 data row 수
			maxPageCount: 5, // 한번에 보여줄 페이지 개수
			
			pageIndex: 1, // 현재 페이지
			pageTotal: 1, // 전체 페이지
			pageSize: 14, // 한 페이지에 보여줄 data row 수
			
			loadingIndicator: false, // 새로고침중인지 표시

			popupMemoHistoryID: null, // 메모 팝업에 표현할 SensorZoneHistoryID
			popupMemoContent: null,

			prevProps: null,

			selectValue: [],
			popupOpen: false,

			displayMemo: this.props.popupMemoContent,
		}

		this.refDatepicker01 = React.createRef();
		this.refDatepicker02 = React.createRef();

		this.currentPageMinID = -1;
		this.currentPageMaxID = -1;

		this.props = props;
		this.onClickSearch = this.onClickSearch.bind(this);
		this.onClickDownload = this.onClickDownload.bind(this);

	}

	componentDidMount() {	
		if (this.props.selectedSiteID) {
			if (this.props.selectedSiteID !== ProjectResource.Site.Hydrogen) {
				this.onClickSearch();
			}
		}

		//$('.activeBoxArea').hover(function () {
		//	$('.activeCheckbox').css({ border: "solid 1px #ffffff" });
		//	$('.activeCheckbox:checked.on').css({ border: "solid 1px #ffffff" });
		//});
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.selectedSiteID !== this.props.selectedSiteID) {
			if (this.props.selectedSiteID !== ProjectResource.Site.Hydrogen) {
				this.onClickSearch();
			}
        }
    }

	async getMinMaxIndex(beginDate, endDate, facilityType, buildingGroupID, buildingID, zoneID) {
		const [minID, maxID] = await HistoryController.GetMinMaxIndex(beginDate, endDate, facilityType, buildingGroupID, buildingID, zoneID);

		return [minID, maxID];
    }

	async onClickSearch() {
		$("body").css("cursor", "wait");

		const beginDate = this.getMakeDateTime(this.state.beginDate) + ' 00:00:00';
		const endDate = this.getMakeDateTime(this.state.endDate) + ' 23:59:59';

		if (beginDate > endDate) {
			$("body").css("cursor", "default");
			alert('조회 기간을 다시 선택하세요');
			return;
		}

		await this.setState({ loadingIndicator: true })
		
		const buildingGroupID = this.state.selectedBuildingGroupID;
		const buildingID = this.state.selectedBuildingID;
		const zoneID = this.state.selectedZoneID;
		const facilityType = this.state.facilityType;

		const [minID, maxID] = await this.getMinMaxIndex(beginDate, endDate, facilityType, buildingGroupID, buildingID, zoneID);

		let [dataSource, currentLastID] = await HistoryController.DisplaySensorDetectHistories(
			beginDate, endDate, /*facilityType*/21, buildingGroupID, buildingID, zoneID,
			-1, this.state.maxRowCount * this.state.maxPageCount,  true, this.props.selectedSiteID);
		
		if (dataSource === null && currentLastID === null) {
			$("body").css("cursor", "default");
			return;
		}

		let searchZoneName = '-';
		if (this.state.selectedBuildingGroupID === -1) {
			searchZoneName = '전체'
		}
		else {
			const buildingGroupLength = this.props.buildingGroupList.length;
			for (let i = 0; i < buildingGroupLength; i++) {
				const buildingGroup = this.props.buildingGroupList[i];

				if (this.state.selectedBuildingGroupID === buildingGroup.id) {
					searchZoneName = buildingGroup.displayText;

					if (this.state.selectedBuildingID === -1) {
						break;
					}

					const buildingLength = buildingGroup.buildingDatas.length;
					for (let j = 0; j < buildingLength; j++) {
						const building = buildingGroup.buildingDatas[j];
						if (this.state.selectedBuildingID === building.id) {
							searchZoneName += ' ' + building.displayText;
							if (this.state.selectedZoneID === -1) {
								break;
							}

							const zoneLength = building.zoneDatas.length;
							for (var k = 0; k < zoneLength; k++) {
								const zone = building.zoneDatas[k];
								if (this.state.selectedZoneID === zone.id) {
									searchZoneName += ' ' + zone.displayText;
									break;
								}
							}
						}
					}
				}
			}
		}

		$("body").css("cursor", "default");
		
		const pageTotal = Math.ceil(dataSource.length / this.state.maxRowCount);

		this.setState({
			dataSource, pageTotal, minPageIndex: 1, minID, maxID, loadingIndicator: false,
			searchBeginDate: beginDate, searchEndDate: endDate, searchFacilityType: facilityType,
			searchBuildingGroupID: buildingGroupID, searchBuildingID: buildingID, searchZoneID: zoneID, searchZoneName,
			currentLastID, pageIndex: 1
		});
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

	onChangeBegin = (date) => {
		this.setState({ beginDate: date });
		$("input:radio[name='stgDate']").prop('checked', false);

		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		let korFormat = year + "-" + month + "-" + day;

		this.setState({ dateType: 'select' });
	}

	onChangeEnd = (date) => {
		this.setState({ endDate: date });
		$("input:radio[name='stgDate']").prop('checked', false);

		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		let korFormat = year + "-" + month + "-" + day;

		this.setState({ dateType: 'select' });
	}

	onChangeBuildingGroup = (target) => {
		this.setState({ selectedBuildingGroupID: Number(target.value), selectedBuildingID: -1, selectedZoneID: -1 });
	}
	onChangeBuilding = (target) => {
		this.setState({ selectedBuildingID: Number(target.value), selectedZoneID: -1 });
	}
	onChangeZone = (target) => {
		this.setState({ selectedZoneID: Number(target.value) });
	}

	onClickDateType = (type) => {		
		let dateType = '';

		if (type === 'select') {
			dateType = 'select';
			this.setState({ dateType: dateType });
			return;
		}

		let today = new Date();
		let date = new Date();

		if (type === 'today') {
			dateType = 'today';
		}
		else if (type === 'week') {
			date.setDate(date.getDate() - 7);
			dateType = 'week';
		}
		else if (type === 'month') {
			date.setMonth(date.getMonth() - 1);
			dateType = 'month';
		}
		else if (type === 'year') {
			date.setFullYear(date.getFullYear() - 1);
			dateType = 'year';
		}

		let year = today.getFullYear();
		let month = today.getMonth() + 1;
		let day = today.getDate();

		let korFormat = year + "-" + month + "-" + day;

		this.setState({ beginDate: date, endDate: today, dateType: dateType });
	}

	onClickFacilityType = (facilityType) => {
		this.setState({ facilityType });
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
		worksheet.addRow(['조회 기간' + ' : ' + beginDate + ' ~ ' + endDate]);
		worksheet.addRow(['조회 범위' + ' : ' + this.state.searchZoneName]);
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

		const [dataSource, currentLastID] = await HistoryController.DisplaySensorDetectHistories(
			this.state.searchBeginDate, this.state.searchEndDate, this.state.searchFacilityType
			, this.state.searchBuildingGroupID, this.state.searchBuildingID, this.state.searchZoneID,
			-1, -1, true, this.props.selectedSiteID);

		if (dataSource) {
			let arrDatas = [];
			const dataLength = dataSource.length;
			for (let i = 0; i < dataLength; i++) {
				const data = [];

				//const checked = dataSource[i].checked;
				//if (isCheckedDownload && !checked) {
				//	continue;
				//}
				
				const strSensorType = this.getSensorTypeFromSensorZoneID(dataSource[i].sensorZoneID);

				const no = arrDatas.length + 1;
				const time = dataSource[i].time;
				const endTime = dataSource[i].endTime;
				const type = dataSource[i].type;
				const sensorName = strSensorType;
				const zoneName = dataSource[i].sensorName;
				const realMode = dataSource[i].realMode;
				const detectType = dataSource[i].detectType;
				const detectInfo = dataSource[i].detectInfo;
				const alarmLevel = dataSource[i].alarmLevel;
				const sopName = dataSource[i].sopName;

				data.no = no;
				data.time = time;
				data.endTime = endTime;
				data.type = type;
				data.sensorName = sensorName;
				data.zoneName = zoneName;
				data.realMode = (realMode === '1') ? '실제' : '테스트';
				data.detectType = detectType;
				data.detectInfo = detectInfo;
				data.alarmLevel = alarmLevel;
				data.sopName = (sopName.length > 0) ? sopName : '-';

				arrDatas.push(data);
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

		saveAs(blob, title + '_' + date + '_' + time + ".xlsx");
	}
	async onClickSelectDownload() {
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
		worksheet.addRow(['조회 기간' + ' : ' + beginDate + ' ~ ' + endDate]);
		worksheet.addRow(['조회 범위' + ' : ' + this.state.searchZoneName]);
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

		if (this.state.dataSource) {
			let arrDatas = [];
			const dataLength = this.state.dataSource.length;
			for (let i = 0; i < dataLength; i++) {
				const data = [];

				const checked = this.state.dataSource[i].checked;
				if (!checked) {
					continue;
				}
				
				const strSensorType = this.getSensorTypeFromSensorZoneID(this.state.dataSource[i].sensorZoneID);

				const no = arrDatas.length + 1;
				const time = this.state.dataSource[i].time;
				const endTime = this.state.dataSource[i].endTime;
				const type = this.state.dataSource[i].type;
				const sensorName = strSensorType;
				const zoneName = this.state.dataSource[i].sensorName;
				const realMode = this.state.dataSource[i].realMode;
				const detectType = this.state.dataSource[i].detectType;
				const detectInfo = this.state.dataSource[i].detectInfo;
				const alarmLevel = this.state.dataSource[i].alarmLevel;
				const sopName = this.state.dataSource[i].sopName;

				data.no = no;
				data.time = time;
				data.endTime = endTime;
				data.type = type;
				data.sensorName = sensorName;
				data.zoneName = zoneName;
				data.realMode = (realMode === '1') ? '실제' : '테스트';
				data.detectType = detectType;
				data.detectInfo = detectInfo;
				data.alarmLevel = alarmLevel;
				data.sopName = (sopName.length > 0) ? sopName : '-';

				arrDatas.push(data);
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

		saveAs(blob, title + '_' + date + '_' + time + ".xlsx");
	}

	onCheckedRow(checked, index) {
		const dataSource = this.state.dataSource;
		const datacount = dataSource.length;
		if (index === -1) {
			let beginIndex = (this.state.pageIndex - this.state.minPageIndex) * this.state.maxRowCount;
			for (let i = beginIndex; i < beginIndex + this.state.maxRowCount; i++) {
				if (datacount < i + 1) {
					break;
				}
				dataSource[i].checked = checked;
			}			
		}
		else {			
			//const dataLength = dataSource.length;
			dataSource[index].checked = checked;
		}
		this.setState({ dataSource });
	}

	onLinkSOP = (actionStepHistoryID, beginTime) => {
		if (!actionStepHistoryID || actionStepHistoryID === -1) {
			return;
		}

		const linkSOP = {
			beginTime: beginTime,
			actionStepHistoryID: actionStepHistoryID
		};

		this.props.changeContent(HistoryResource.menu.SOP_이력, linkSOP);
	}

	setPopupMemo = (isOpen, sensorZoneHistoryID, memoContent) => {
		if (isOpen && sensorZoneHistoryID !== null && sensorZoneHistoryID > 0) {
			// 메모 팝업 열기
			this.setState({ popupMemoHistoryID: sensorZoneHistoryID, popupMemoContent: memoContent });
		}
		else {
			if (sensorZoneHistoryID !== null && sensorZoneHistoryID > 0) {
				// 메모 저장 후
				const dataSource = [...this.state.dataSource];
				const dataLength = dataSource.length;
				for (let i = 0; i < dataLength; i++) {
					if (dataSource[i].sensorZoneHistoryID === sensorZoneHistoryID) {
						dataSource[i].memo = memoContent;
						break;
                    }
                }
			}

			this.setState({ popupMemoHistoryID: null, popupMemoContent: null });
		}		
	}

	getGridData() {		
		let ui = [];
		if (!this.state.dataSource || this.state.dataSource?.length === 0) {
			return [ui, false];
		}

		const useAlarmMemo = this.useAlarmMemo();	// 알람메모 옵션 여부 확인

		const dataSource = this.state.dataSource;
		const etcSensorList = this.props.etcSensorList;
		const externalSensors = this.props.externalSensors;
		const externalSensorTypes = this.props.externalSensorTypes;
		
		const sensorTypes = this.props.sensorTypes;

		let rowCount = 0;
		let allChecked = true; // 전체 체크 여부
		
		let { pageIndex, pageSize } = this.state;
		let paginatedDataSource = [];
		const currentFacilityType = this.state.searchFacilityType;
		for (let i = 0; i < dataSource.length; i++) {
			let data = dataSource[i];
			const targetEtc = etcSensorList.find(sensor => sensor.id === data.sensorZoneID);
			const targetSensor = externalSensors.find(sensor => sensor.zoneID === targetEtc.zoneID);
			const targetSensorType = externalSensorTypes.find(sensorType => sensorType.id === targetSensor.sensorType);
			
			let convertedSensorType = -1;
			if (targetSensorType.id === SensorDetectHistory.ExternalSensorTypes.Atmosphere) {
				convertedSensorType = 1;
			} else if (targetSensorType.id === SensorDetectHistory.ExternalSensorTypes.KWeather) {
				convertedSensorType = 2;
			} else if (targetSensorType.id === SensorDetectHistory.ExternalSensorTypes.Electricity) {
				convertedSensorType = 3;
			}
			
			if (currentFacilityType === -1 || currentFacilityType === convertedSensorType) {
				paginatedDataSource.push(data);
			}
		}
		
		if (paginatedDataSource.length < pageSize) {
			pageIndex = 1;
		}
		
		paginatedDataSource = paginatedDataSource.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

		for (let i = 0; i < paginatedDataSource.length; i++) {

			let sopLinkClassName = null;
			if (paginatedDataSource[i].sopName.length > 0) {
				sopLinkClassName = teamEditorCss.colTextLink;
			}

			let haveMemoClassName = 'HisMemoOff';  
			if (paginatedDataSource[i].memo !== null && paginatedDataSource[i].memo.length > 0) {
				haveMemoClassName = 'HisMemoOn';
            }
			
			const strSensorType = this.getSensorTypeFromSensorZoneID(paginatedDataSource[i].sensorZoneID);
			
			let strSensorCategory = "기타";
			if (strSensorType === "대기센서") 
				strSensorCategory = "대기유해물질";
			else if (strSensorType === "전류CT센서")
				strSensorCategory = "ON/OFF";

			ui.push(
			<React.Fragment key={'dataSource_' + (i)}>
				<tr key={'dataSource_' + (i)}>
					<td><input type="checkbox" checked={paginatedDataSource[i].checked}
							   onChange={(e) => this.onCheckedRow(e.target.checked, i)}/></td>
					<td>{/*(i + 1)*/paginatedDataSource[i].sensorZoneHistoryID}</td>
					<td>{paginatedDataSource[i].time}</td>
					<td>{paginatedDataSource[i].endTime}</td>
					<td>{strSensorCategory}</td>
					<td>{strSensorType}</td>
					<td>{paginatedDataSource[i].sensorName}</td>
					<td>{(paginatedDataSource[i].realMode === '0') ? '테스트' : '실제'}</td>
					<td>{paginatedDataSource[i].alarmLevel}</td>
					<td>{paginatedDataSource[i].detectType}</td>
					<td style={{ position: 'relative' }} onClick={() => this.setPopupMemo(true, paginatedDataSource[i].sensorZoneHistoryID, paginatedDataSource[i].memo)}><span className={haveMemoClassName}></span></td>
					{/* <td className={sopLinkClassName} onClick={() => this.onLinkSOP(paginatedDataSource[i].actionStepHistoryID, paginatedDataSource[i].sopBeginTime)}>{(paginatedDataSource[i].sopName.length > 0) ? paginatedDataSource[i].sopName : '-'}</td> */}
					{/*
						(useAlarmMemo)
							?
							<td onClick={() => this.setPopupMemo(true, paginatedDataSource[i].sensorZoneHistoryID, paginatedDataSource[i].memo)}>
								<span className={haveMemoClassName}></span></td>
							: <React.Fragment></React.Fragment>
					*/}
				</tr>
			</React.Fragment>
			);

			rowCount++;
			if (allChecked && !paginatedDataSource[i].checked) {
				allChecked = false;
			}
		}

		if (rowCount === 0 && allChecked) {
			allChecked = false;
        }
		return [ui, allChecked];
	}
	
	isMatchedFacilityType = (sensorZoneID) => {
		const etcSensorList = this.props.etcSensorList;
		const externalSensors = this.props.externalSensors;
		const externalSensorTypes = this.props.externalSensorTypes;
		
		const targetSensor = etcSensorList.find(sensor => sensor.id === sensorZoneID);
		if (!targetSensor) {
			return false;
		}
		
		const zoneID = targetSensor.zoneID;
		
		const targetSensorInfo = externalSensors.find(sensor => sensor.zoneID === zoneID);
		const targetSensorType = externalSensorTypes.find(sensorType => sensorType.id === targetSensorInfo.sensorType);
		
		return targetSensorType.id !== this.state.searchFacilityType;
	}

	getSensorTypeFromSensorZoneID(sensorZoneID) {
		const etcSensorList = this.props.etcSensorList;
		if (!etcSensorList)
			return "기타센서";
		
		const targetSensor = etcSensorList.find(sensor => sensor.id === sensorZoneID);
		if (!targetSensor) {
			return "기타센서";
		}
		
		const uniqueKey = targetSensor.uniqueKey;
		if (uniqueKey.indexOf('KWeather') !== -1 ) {
			return "면오염원";
		}
		
		if (uniqueKey.indexOf('Atmosphere') !== -1) {
			return "대기센서";
		}
		
		if (uniqueKey.indexOf('Electricity') !== -1) {
			return "전류CT센서";
		}
	}

	handlePageChange = (newPageIndex) => {
		if (newPageIndex < 1 || newPageIndex > this.state.pageTotal) {
			return;
		}
		
		this.setState({ pageIndex: newPageIndex });
	}
	
	getSpatailUI() {
		let buildingGroupUI = [];
		let buildingUI = [];
		let zoneUI = [];

		buildingGroupUI.push(<option key={'buildingGroupOption_-1'} value="-1">전체</option>);
		buildingUI.push(<option key={'buildingOption_-1'} value="-1">전체</option>);
		zoneUI.push(<option key={'zoneOption_-1'} value="-1">전체</option>);

		if (!this.props.buildingGroupList) {
			return [buildingGroupUI, buildingUI, zoneUI];
		}

		const buildingGroupLength = this.props.buildingGroupList.length;
		for (let i = 0; i < buildingGroupLength; i++) {
			const buildingGroup = this.props.buildingGroupList[i];

			if (this.state.selectedBuildingGroupID === buildingGroup.id) {
				buildingGroupUI.push(<option key={'buildingGroupOption_' + buildingGroup.id} value={buildingGroup.id} selected>{buildingGroup.displayText}</option>);

				const buildingLength = buildingGroup.buildingDatas.length;
				for (let j = 0; j < buildingLength; j++) {
					const building = buildingGroup.buildingDatas[j];
					if (this.state.selectedBuildingID === building.id) {
						buildingUI.push(<option key={'buildingOption_' + building.id} value={building.id} selected>{building.displayText}</option>);

						const zoneLength = building.zoneDatas.length;
						for (var k = 0; k < zoneLength; k++) {
							const zone = building.zoneDatas[k];
							if (this.state.selectedZoneID === zone.id) {
								zoneUI.push(<option key={'zoneOption_' + zone.id} value={zone.id} selected>{zone.displayText}</option>);
							}
							else {
								zoneUI.push(<option key={'zoneOption_' + zone.id} value={zone.id}>{zone.displayText}</option>);
							}
						}
					}
					else {
						buildingUI.push(<option key={'buildingOption_' + building.id} value={building.id}>{building.displayText}</option>);
					}
				}
			}
			else {
				buildingGroupUI.push(<option key={'buildingGroupOption_' + buildingGroup.id} value={buildingGroup.id}>{buildingGroup.displayText}</option>);
			}
		}

		return [buildingGroupUI, buildingUI, zoneUI];
	}

	onClickDatepicker01 = () => {
		this.refDatepicker01.current.setOpen(true);
	}

	onClickDatepicker02 = () => {
		this.refDatepicker02.current.setOpen(true);
	}

	useAlarmMemo() {
		const userInfo = ProjectResource.getUserInfo();

		if (userInfo?.options?.ui?.useAlarmMemo === true) {
			return true;
		}

		return false;
	}

	getSensorTypeUI = () => {
		let sensorTypeUI = [];

		const sensorTypes = this.props.sensorTypes;
		
		sensorTypeUI.push(
			<li key={-1}><input type="radio" name="hscsType" id="hscsTypeAll" checked={this.state.facilityType === -1} onChange={() => this.onClickFacilityType(-1)}/> <label>전체</label></li>
		)
		
		if (!sensorTypes) {
			return sensorTypeUI;
		}
		
		for (let i = 0; i < sensorTypes.length; i++) {
			const sensorType = sensorTypes[i];
			let element = (
				<li key={sensorType.id}><input type="radio" name="hscsType" id="hscsTypeAll" checked={this.state.facilityType === sensorType.id}
						   onChange={() => this.onClickFacilityType(sensorType.id)}/>
					<label>{sensorType.description}</label>
				</li>
			)
			
			sensorTypeUI.push(element);
		}

		return sensorTypeUI;
	}


	setSelectValue = (target) => {
		const value = target.textContent;
		let selectValue = this.state.selectValue;

		if (selectValue.length === 3) {
			let newValue = [];
			newValue.push(value);
			this.setState({selectValue: newValue});
		} else {
			selectValue.push(value);
			this.setState({selectValue: selectValue});
		}
	}

	onClickRecentlybox = () => {
		const element = document.getElementById('recentlyCheckbox');
		const elementBox = document.getElementById('recentlyBoxArea');

		element.classList.toggle('on');
		elementBox.classList.toggle('on');
	}

	onClickCheckbox = () => {
		const element = document.getElementById('activeCheckbox');
		const elementBox = document.getElementById('activeBoxArea');

		element.classList.toggle('on');
		elementBox.classList.toggle('on');
	}

	onClickMemoPop = () => {
		const memoIcon = document.getElementById('memoIcon');
		const memoConts = document.getElementById('hsMemoBox');
		const elementBox = document.getElementById('activeMemoArea');

		memoIcon.classList.toggle('on');
		memoConts.classList.toggle('on');
		elementBox.classList.toggle('on');
	}

	onChangeMemo = (e) => {
		this.setState({ displayMemo: e.target.value });
	}
	
	getTotalPages = () => {
		const pageSize = this.state.pageSize;
		const dataSource = this.state.dataSource;
		
		if (!dataSource) {
			return 0;
		}

		const etcSensorList = this.props.etcSensorList;
		const externalSensors = this.props.externalSensors;
		const externalSensorTypes = this.props.externalSensorTypes;
		
		const currentFacilityType = this.state.searchFacilityType;
		let filteredDataSource = [];
		for (let i = 0; i < dataSource.length; i++) {
			const data = dataSource[i];
			const sensorZoneID = data.sensorZoneID;

			const targetEtc = etcSensorList.find(sensor => sensor.id === data.sensorZoneID);
			const targetSensor = externalSensors.find(sensor => sensor.zoneID === targetEtc.zoneID);
			const targetSensorType = externalSensorTypes.find(sensorType => sensorType.id === targetSensor.sensorType);

			let convertedSensorType = -1;
			if (targetSensorType.id === SensorDetectHistory.ExternalSensorTypes.Atmosphere) {
				convertedSensorType = 1;
			} else if (targetSensorType.id === SensorDetectHistory.ExternalSensorTypes.KWeather) {
				convertedSensorType = 2;
			} else if (targetSensorType.id === SensorDetectHistory.ExternalSensorTypes.Electricity) {
				convertedSensorType = 3;
			}

			if (currentFacilityType === -1 || currentFacilityType === convertedSensorType) {
				filteredDataSource.push(data);
			}
		}
		
		return Math.ceil(filteredDataSource.length / pageSize);
	}

	render() {
		const [buildingGroupUI, buildingUI, zoneUI] = this.getSpatailUI();
		const [gridUI, allChecked] = this.getGridData();
		const useAlarmMemo = this.useAlarmMemo();
		const sensorTypeUI = this.getSensorTypeUI();
		const selectValue = this.state.selectValue;
		
		const { pageIndex, pageSize } = this.state;
		let totalPages = 0;
		if (!this.state.dataSource) {
			return <></>;
		}
		totalPages = this.getTotalPages();

		return (
			<>
				<div id={'hsty'}>
					<div className={'hsScr'}>
						<div id={'hsCont'}>
							<span className={'hsContTitle'}>센서 탐지 이력</span>
							<form action="">
								<div className={'hscSch'}>
									<dl>
										<dt>센서유형</dt>
										<dd>
											<ul className={'hscsRdo'}>
												{sensorTypeUI}
											</ul>
										</dd>
									</dl>
									<dl>
										<dt>위치</dt>
										<dd>
											<ul className={'hscsLoc'}>
												<li>
													<select name="" id="" onChange={(e) => this.onChangeBuildingGroup(e.target)} className={'selWh'}>
														{buildingGroupUI}
													</select>
												</li>
												<li>
													<select name="" id="" onChange={(e) => this.onChangeBuilding(e.target)} className={'selWh'}>
														{buildingUI}
													</select>
												</li>
												{/*<li>*/}
												{/*	<select name="" id="" onChange={(e) => this.onChangeZone(e.target)} className={'selWh'}>*/}
												{/*		{zoneUI}*/}
												{/*	</select>*/}
												{/*</li>*/}
											</ul>
										</dd>
									</dl>
									<dl>
										<dt>조회기간</dt>
										<dd>
											<ul className={'hscsDate'}>
												<li>
													<div className={'datepicker'}>
														<DatePicker ref={this.refDatepicker01} name="datepicker01" id="datepicker01"
															dateFormat="yyyy-MM-dd"
															locale={ko}
															maxDate={new Date()}
															selected={this.state.beginDate}
															onChange={date => this.onChangeBegin(date)}
															className={'datePickerCss'} />
														    <img src={btnCalendarBk} alt="" className={'btnCalendarBk'} onClick={this.onClickDatepicker01} /> 
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
															onChange={date => this.onChangeEnd(date)} />
														    <img src={btnCalendarBk} alt="" className={'btnCalendarBk'} onClick={this.onClickDatepicker02} /> 
													</div>
												</li>
											</ul>
											<ul className={'hscsRdoPeriod'}>
												<li><input type="radio" name="hscsRdo" id="hscsRdo01" onChange={() => this.onClickDateType('select')} checked={this.state.dateType === 'select'} /><label htmlFor="hscsRdo01">기간선택</label></li>
												<li><input type="radio" name="hscsRdo" id="hscsRdo01" onChange={() => this.onClickDateType('today')} checked={this.state.dateType === 'today'} /><label htmlFor="hscsRdo01">오늘</label></li>
												<li><input type="radio" name="hscsRdo" id="hscsRdo02" onChange={() => this.onClickDateType('week')} checked={this.state.dateType === 'week'} /><label htmlFor="hscsRdo02">1주</label></li>
												<li><input type="radio" name="hscsRdo" id="hscsRdo03" onChange={() => this.onClickDateType('month')} checked={this.state.dateType === 'month'} /><label htmlFor="hscsRdo03">1개월</label></li>
												<li><input type="radio" name="hscsRdo" id="hscsRdo04" onChange={() => this.onClickDateType('year')} checked={this.state.dateType === 'year'} /><label htmlFor="hscsRdo04">1년</label></li>
											</ul>
										</dd>
									</dl>
									{
                                         this.state.loadingIndicator === true
											? <a className={'hscsSbmt'} id={'hscsSbmting'}><span><span><CircularProgress className="spinner"/></span></span></a>
											: <a onClick={this.onClickSearch} className={'hscsSbmt'}><span><span>검색</span></span></a>
									}
									
								</div>
							</form>

							{
								this.state.loadingIndicator === true ?
									<ul className={'hscExl'}>
										<li><a className={'all'} id={'hscsSbmting'}>전체 다운로드</a></li>
										<li><a className={'exl'} id={'hscsSbmting'}>선택 다운로드</a></li>
									</ul>
									:
									<ul className={'hscExl'}>
										<li><a onClick={() => this.onClickDownload()} className={'all'}>전체 다운로드</a></li>
										<li><a onClick={() => this.onClickSelectDownload()} className={'exl'}>선택 다운로드</a></li>
									</ul>
							}

							<div className={'hscTb'}>
								<div className={'scrTb'}>
									<table>
										<colgroup>
											<col style={{ width: '3%' }} />
											<col style={{ width: '5%' }} />
											<col style={{ width: '10%' }} />
											<col style={{ width: '10%' }} />
											<col style={{ width: '10%' }} />
											<col style={{ width: '10%' }} />
											<col style={{ width: '13%' }} />
											<col style={{ width: '10%' }} />
											<col style={{ width: '10%' }} />
											<col style={{ width: '12%' }} />
											<col style={{ width: '5%' }} />
											{/* <col style={{ width: '8%' }} /> */}
										    {
												(useAlarmMemo)
													? <React.Fragment><col style={{ width: '10%' }} /> <col style={{ width: '5%' }} /></React.Fragment>
													: <col style={{ width: '15%' }} />
											} 
										</colgroup>
										<thead>
											<tr>
												<th><input type="checkbox" checked={allChecked} onChange={(e) => this.onCheckedRow(e.target.checked, -1)} /></th>
												<th>NO</th>
												<th>일시</th>
												<th>종료 일시</th>
												<th>센서유형</th>
												<th>센서명</th>
												<th>위치</th>
												<th>탐지정보</th>
												<th>단계</th>
												<th>대응 SOP</th>
												<th>메모</th> 
												{/* {
													(useAlarmMemo)
														? <React.Fragment><th>대응 SOP</th><th>메모</th></React.Fragment>
														: <th>대응 SOP</th>
												} */}
											</tr>
										</thead>
										<tbody>
											{gridUI}
										</tbody>
									</table>
								</div>

								{
									(this.state.dataSource && this.state.dataSource.length > 0) ?
										<div className={'hscNav'}>
											<>
												<a className={'first'} onClick={() => this.handlePageChange(1)}>맨 앞</a>
												<a className={'prev'} onClick={() => this.handlePageChange(pageIndex - 1)}>이전</a>
											</>
											<ul>
												{Array.from({length: Math.min(5, totalPages)}, (_, i) => {
													const startIndex = Math.max(0, Math.min(totalPages - 5, pageIndex - 3));
													const pageNumber = startIndex + i + 1;
													return (
														<li key={i} className={pageIndex === pageNumber ? 'on' : null}>
															<a onClick={() => this.handlePageChange(i + 1)}>{i + 1}</a>
														</li>
														);
													})
												}
											</ul>
											<>
												<a className={'next'} onClick={() => this.handlePageChange(pageIndex + 1)}>다음</a>
												<a className={'last'} onClick={() => this.handlePageChange(totalPages)}>맨 뒤</a>
											</>
										</div>
										: <> </>
								}
						    </div>
						</div>
					</div>
				</div>

				{/* 메모장 테스트 */}
				{/*}
				<SensorDetectHistoryMemoComponent>
					<div id={"hsMemoBox"} className={'hsMemoBox'}>
						<div className={'dslTopMemo' + " " + 'dslGrd'}>
							<span className={'squareIcon'}></span>
							<h5 className={'squareTitle'}>
							   메모
							</h5>
							<a className={'dslX'} onClickClosePopup={this.onClickClosePopup}></a>
						</div>
						<div className={'memoContents'}>
							<textarea value={'test'} cols="30" rows="10" className={"scroll-wrapper" + 'memoTxt' + "scrollbar scroll-textareaCss"} onChange={(e) => this.onChangeMemo(e)}>메모내용</textarea>
						</div>
					</div>
				</SensorDetectHistoryMemoComponent>
				*/}
				
				{
					(this.state.popupMemoHistoryID !== null && this.state.popupMemoHistoryID > 0) ?
						<SensorDetectHistoryMemo fromHistoryMenu={true} setPopupMemo={this.setPopupMemo} actionStepHistoryID={this.state.popupMemoHistoryID} popupMemoContent={this.state.popupMemoContent} />
						: null
				}
			</>
		);
	}
}

export default SensorDetectHistory;