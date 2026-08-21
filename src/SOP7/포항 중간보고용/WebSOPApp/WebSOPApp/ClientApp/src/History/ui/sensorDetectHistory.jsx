//import { Button } from '@amcharts/amcharts4/core';
import React, { Component } from 'react';
import $ from 'jquery';
import HistoryResource from "../resource/id";
import HistoryController from '../services/historyController';
import newStyles from "../../Common/css/newStyle.module.css";
import uneStyles from "../../Common/css/uneCommon.module.css";
import teamEditorCss from "../../TeamEditor/css/teamEditor.module.css";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko, enUS } from 'date-fns/esm/locale';
import btnCalendarBk from '../../Common/img/sub/dashboard_calendar_blue.png';

import CircularProgress from '@material-ui/core/CircularProgress';

import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/
import SensorDetectHistoryMemo from './popups/SensorDetectHistoryMemo';

import ProjectResource from '../../Root/resource/id';
import { SensorDetectHistoryMemoComponent } from '../styled/SensorDetectHistoryStyled';


class SensorDetectHistory extends Component {
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
			
			maxRowCount: 10,  // 한 페이지에 보여줄 data row 수
			maxPageCount: 5, // 한번에 보여줄 페이지 개수
			
			pageIndex: 1,    // 현재 페이지
			minPageIndex: 1, // 최소 페이지 Index
			maxPageIndex: 1, // 최대 페이지 Index
			IsKnowPageIndex: true, // 순서대로 조회할 경우 페이지 번호를 알 수 있지만 끝에서부터 조회하면 알 수 없다.

			havePrevPage: false, // 이전 데이터가 있나?
			haveAfterPage: false, // 이후 데이터가 있나?

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

		console.log('maxID' + maxID);

		const [dataSource, currentLastID] = await HistoryController.DisplaySensorDetectHistories(
			beginDate, endDate, facilityType, buildingGroupID, buildingID, zoneID,
			-1, this.state.maxRowCount * this.state.maxPageCount, true, this.props.selectedSiteID);

		if (dataSource === null && currentLastID === null) {
			$("body").css("cursor", "default");
			return;
		}

		let havePrevPage = false;
		let haveAfterPage = false;
		if (minID < currentLastID) {
			// 뒤에 데이터 더 있음
			haveAfterPage = true;
        }
		
		const datacount = dataSource.length;
		const value1 = parseInt(datacount / this.state.maxRowCount);
		const value2 = datacount % this.state.maxRowCount; // 나머지가 있는 경우 페이지 하나를 추가한다.
		let maxPageIndex = value1 + ((value2 > 0) ? 1 : 0);

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

		this.setState({
			dataSource, maxPageIndex, minPageIndex: 1, pageIndex: 1, minID, maxID, IsKnowPageIndex: true, loadingIndicator: false,
			searchBeginDate: beginDate, searchEndDate: endDate, searchFacilityType: facilityType,
			searchBuildingGroupID: buildingGroupID, searchBuildingID: buildingID, searchZoneID: zoneID, searchZoneName,
			currentLastID,
			havePrevPage, haveAfterPage
		});
	}

	async onClickPrevSearch(bVery) {
		let isDesc = true;
		let searchLastID = -1;
		let searchRowCount = this.state.maxRowCount * this.state.maxPageCount;
		if (bVery) {
			searchLastID = this.state.maxID +1; // maxID도 포함해서 조회해야 하기 때문에 +1한다([<=]가 아닌 [<] 필터임)
		}
		else {
			if (!this.state.IsKnowPageIndex) {
				searchRowCount = this.state.maxRowCount;
			}

			searchLastID = this.state.dataSource[0].sensorZoneHistoryID;// this.currentPageMaxID;
			isDesc = false; // 현재값보다 큰값으로 조회해야함
        }

		const [dataSource, currentLastID] = await HistoryController.DisplaySensorDetectHistories(
			this.state.searchBeginDate, this.state.searchEndDate,
			this.state.searchFacilityType,
			this.state.searchBuildingGroupID, this.state.searchBuildingID, this.state.searchZoneID,
			searchLastID, searchRowCount, isDesc, this.props.selectedSiteID
		);

		let havePrevPage = true;
		let haveAfterPage = false;		

		if (this.state.minID < currentLastID) {
			// 뒤에 데이터 더 있음
			haveAfterPage = true;
		}

		const datacount = dataSource.length;
		const value1 = parseInt(datacount / this.state.maxRowCount);
		const value2 = datacount % this.state.maxRowCount; // 나머지가 있는 경우 페이지 하나를 추가한다.
		let maxPageIndex = value1 + ((value2 > 0) ? 1 : 0);

		let pageIndex = -1;
		let minPageIndex = -1;

		let IsKnowPageIndex = true;

		if (bVery) { // 맨처음
			havePrevPage = false;
			pageIndex = 1;
			minPageIndex = 1;
			IsKnowPageIndex = true;
		}
		else { // 이전
			if (!this.state.IsKnowPageIndex) {
				pageIndex = maxPageIndex;
				minPageIndex = pageIndex;

				IsKnowPageIndex = false; // 맨 끝에서부터 돌아왔기 때문에 페이지 계산 못함
			}
			else {
				minPageIndex = this.state.minPageIndex - this.state.maxPageCount;
				pageIndex = this.state.minPageIndex - 1;
				maxPageIndex = pageIndex;//this.state.maxPageIndex - maxPageIndex;
			}

			if (this.state.maxID <= dataSource[0].sensorZoneHistoryID) {
				havePrevPage = false;
            }
		}

		this.setState({ dataSource, currentLastID, pageIndex, minPageIndex, maxPageIndex, havePrevPage, haveAfterPage, IsKnowPageIndex });
	}

	async onClickAfterSearch(bVery) {
		let isDesc = true;
		let searchLastID = -1;
		let searchRowCount = this.state.maxRowCount * this.state.maxPageCount;
		if (bVery) {
			searchLastID = this.state.minID - 1// maxID도 포함해서 조회해야 하기 때문에 +1한다([<=]가 아닌 [<] 필터임)
			isDesc = false;
			searchRowCount = this.state.maxRowCount; // 맨 끝으로 이동하므로 10개씩 구해옴
		}
		else {
			if (!this.state.IsKnowPageIndex) {
				searchRowCount = this.state.maxRowCount;
			}
			searchLastID = this.state.currentLastID; //this.state.currentPageMinID
			isDesc = true;
		}

		const [dataSource, currentLastID] = await HistoryController.DisplaySensorDetectHistories(
			this.state.searchBeginDate, this.state.searchEndDate,
			this.state.searchFacilityType,
			this.state.searchBuildingGroupID, this.state.searchBuildingID, this.state.searchZoneID,
			searchLastID, searchRowCount, isDesc, this.props.selectedSiteID
		);

		let havePrevPage = true;
		let haveAfterPage = false;
		
		const datacount = dataSource.length;
		const value1 = parseInt(datacount / this.state.maxRowCount);
		const value2 = datacount % this.state.maxRowCount; // 나머지가 있는 경우 페이지 하나를 추가한다.
		let maxPageIndex = value1 + ((value2 > 0) ? 1 : 0);

		let pageIndex = -1;

		let IsKnowPageIndex = true;
		if (bVery) { // 맨끝
			IsKnowPageIndex = false;

			pageIndex = maxPageIndex;
		}
		else { // 다음
			if (!this.state.IsKnowPageIndex) {
				pageIndex = maxPageIndex;

				IsKnowPageIndex = false; // 맨 끝에서부터 돌아왔기 때문에 페이지 계산 못함
			}
			else {
				pageIndex = this.state.maxPageIndex + 1;
				maxPageIndex = maxPageIndex + this.state.maxPageIndex;
			}

			if (this.state.minID < currentLastID) {
				// 뒤에 데이터 더 있음
				haveAfterPage = true;
			}
		}

		this.setState({ dataSource, currentLastID, pageIndex, minPageIndex: pageIndex, maxPageIndex, havePrevPage, haveAfterPage, IsKnowPageIndex });
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

	async setPageIndex(index) {
		if (this.state.pageIndex === index) {
			return;
		}
		if (this.state.maxPageIndex < index || index < 1) {
			return;
		}

		//const [dataSource, lastID] = await HistoryController.DisplaySensorDetectHistories(
		//	this.state.searchBeginDate, this.state.searchEndDate,
		//	this.state.searchFacilityType,
		//	this.state.searchBuildingGroupID, this.state.searchBuildingID, this.state.searchZoneID,
		//	this.state.currentLastID, this.state.maxRowCount
		//);
		//this.setState({ dataSource, currentLastID: lastID, pageIndex: index });

		this.setState({ pageIndex: index });
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

		//if (this.props.settings === null || this.props.settings === undefined)
		//	return;

		//this.props.settings.dashboardBegin = korFormat;
		//this.props.settings.dashboardEnd = korFormat;
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

				const no = arrDatas.length + 1;
				const time = this.state.dataSource[i].time;
				const endTime = this.state.dataSource[i].endTime;
				const type = this.state.dataSource[i].type;
				const sensorName = this.state.dataSource[i].sensorName;
				const zoneName = this.state.dataSource[i].zoneName;
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

	// 하단 페이지 index 만들기
	getPageIndexUI() {
		let ui = [];
		if (!this.state.dataSource) {
			return ui;
		}

		if (this.state.IsKnowPageIndex) {
			for (let i = this.state.minPageIndex; i <= this.state.maxPageIndex; i++) {
				if (i === this.state.pageIndex) {
					ui.push(<li key={'pageIndex_' + (i)} className={'on'}><a>{i}</a></li>);
				}
				else {
					ui.push(<li key={'pageIndex_' + (i)}><a onClick={() => this.setPageIndex(i)}>{i}</a></li>);
				}
			}
		}
		else {
			ui.push(<li key={'pageIndex_'} className={'on'}><a>...</a></li>);
        }

		return ui;
	}

	getGridData() {		
		let ui = [];
		if (!this.state.dataSource) {
			return [ui, false];
		}

		const useAlarmMemo = this.useAlarmMemo();	// 알람메모 옵션 여부 확인

		const dataSource = this.state.dataSource;
		const datacount = dataSource.length;

		let rowCount = 0;
		let allChecked = true; // 전체 체크 여부

		// 데이터를 읽을 시작할 배열값
		let beginIndex = (this.state.pageIndex - this.state.minPageIndex) * this.state.maxRowCount;//0;
		
		for (let i = beginIndex; i < beginIndex + this.state.maxRowCount; i++) {
			if (datacount < i + 1) {
				break;
			}

			if (i == beginIndex) {
				this.currentPageMaxID = dataSource[i].sensorZoneHistoryID;
			}
			if (i == beginIndex + this.state.maxRowCount - 1) {
				this.currentPageMinID = dataSource[i].sensorZoneHistoryID;
			}

			let sopLinkClassName = null;
			if (dataSource[i].sopName.length > 0) {
				sopLinkClassName = teamEditorCss.colTextLink;
			}

			let haveMemoClassName = 'HisMemoOff';
			if (dataSource[i].memo !== null && dataSource[i].memo.length > 0) {
				haveMemoClassName = 'HisMemoOn';
            }

			ui.push(
			<React.Fragment key={'dataSource_' + (i)}>
				<tr key={'dataSource_' + (i)}>
					<td><input type="checkbox" checked={dataSource[i].checked} onChange={(e) => this.onCheckedRow(e.target.checked, i)} /></td>
					<td>{/*(i + 1)*/dataSource[i].sensorZoneHistoryID}</td>
					<td>{dataSource[i].time}</td>
					<td>{dataSource[i].endTime}</td>
					<td>{dataSource[i].type}</td>
					<td>{dataSource[i].sensorName}</td>
					<td>{dataSource[i].zoneName}</td>
					<td>{(dataSource[i].realMode === '0') ? '테스트' : '실제'}</td>
					<td>{dataSource[i].detectType}</td>
					<td>{dataSource[i].detectInfo}</td>
					<td>{dataSource[i].alarmLevel}</td>
					<td className={sopLinkClassName} onClick={() => this.onLinkSOP(dataSource[i].actionStepHistoryID, dataSource[i].sopBeginTime)}>{(dataSource[i].sopName.length > 0) ? dataSource[i].sopName : '-'}</td>
					{
						(useAlarmMemo)
							? <td onClick={() => this.setPopupMemo(true, dataSource[i].sensorZoneHistoryID, dataSource[i].memo)}><span className={haveMemoClassName}></span></td>
							: <React.Fragment></React.Fragment>
					}
				</tr>
			</React.Fragment>
			);

			rowCount++;
			if (allChecked && !dataSource[i].checked) {
				allChecked = false;
            }
		}

		if (rowCount === 0 && allChecked) {
			allChecked = false;
        }

		return [ui, allChecked];
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

		if (this.props.useSensorTypes?.UseFire === true) {
			sensorTypeUI.push(<li key='sensorType_fire'><input type="radio" name="hscsType" id="hscsType0" onChange={() => this.onClickFacilityType(0)} checked={this.state.facilityType === 0} /><label htmlFor="hscsType0">화재</label></li>);
		}
		if (this.props.useSensorTypes?.UsePSM === true) {
			sensorTypeUI.push(<li key='sensorType_psm'><input type="radio" name="hscsType" id="hscsType11" onChange={() => this.onClickFacilityType(11)} checked={this.state.facilityType === 11} /><label htmlFor="hscsType11">누출</label></li>);
		}
		if (this.props.useSensorTypes?.UseETC === true) {
			sensorTypeUI.push(<li key='sensorType_etc'><input type="radio" name="hscsType" id="hscsType21" onChange={() => this.onClickFacilityType(21)} checked={this.state.facilityType === 21} /><label htmlFor="hscsType21">기타</label></li>);
		}

		if (this.props.useSensorTypes?.UseEnvironment === true) {
			sensorTypeUI.push(<li key='sensorType_environment'><input type="radio" name="hscsType" id="hscsType117" onChange={() => this.onClickFacilityType(117)} checked={this.state.facilityType === 117} /><label htmlFor="hscsType117">환경설비</label></li>);
		}
		if (this.props.useSensorTypes?.UseManufacture === true) {
			sensorTypeUI.push(<li key='sensorType_manufacture'><input type="radio" name="hscsType" id="hscsType118" onChange={() => this.onClickFacilityType(118)} checked={this.state.facilityType === 118} /><label htmlFor="hscsType118">제조설비</label></li>);
		}

		if (this.props.useSensorTypes?.UseSVMS === true) {
			sensorTypeUI.push(<li key='sensorType_svms'><input type="radio" name="hscsType" id="hscsType900" onChange={() => this.onClickFacilityType(900)} checked={this.state.facilityType === 900} /><label htmlFor="hscsType900">SVMS</label></li>);
		}
		if (this.props.useSensorTypes?.UseEarthquake === true) {
			sensorTypeUI.push(<li key='sensorType_earthquake'><input type="radio" name="hscsType" id="hscsType50" onChange={() => this.onClickFacilityType(50)} checked={this.state.facilityType === 50} /><label htmlFor="hscsType50">지진</label></li>);
		}
		if (this.props.useSensorTypes?.UseStrongWind === true) {
			sensorTypeUI.push(<li key='sensorType_strongWind'><input type="radio" name="hscsType" id="hscsType18" onChange={() => this.onClickFacilityType(18)} checked={this.state.facilityType === 18} /><label htmlFor="hscsType18">강풍</label></li>);
		}
		if (this.props.useSensorTypes?.UseBlackOut === true) {
			sensorTypeUI.push(<li key='sensorType_blackout'><input type="radio" name="hscsType" id="hscsType17" onChange={() => this.onClickFacilityType(17)} checked={this.state.facilityType === 17} /><label htmlFor="hscsType17">정전</label></li>);
		}

		return sensorTypeUI;
	}


	setSelectValue = (target) => {
		const value = target.textContent;
		let selectValue = this.state.selectValue;

		if (selectValue.length === 3) {
			let newValue = [];
			newValue.push(value);
			this.setState({ selectValue: newValue });
		}
		else {
			selectValue.push(value);
			this.setState({ selectValue: selectValue });
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

	render() {
		const [buildingGroupUI, buildingUI, zoneUI] = this.getSpatailUI();
		const pageIndexUI = this.getPageIndexUI();
		const [gridUI, allChecked] = this.getGridData();
		const useAlarmMemo = this.useAlarmMemo();
		const sensorTypeUI = this.getSensorTypeUI();
		const selectValue = this.state.selectValue;

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
												<li><input type="radio" name="hscsType" id="hscsTypeAll" onChange={() => this.onClickFacilityType(-1)} checked={this.state.facilityType === -1} /> <label htmlFor="hscsTypeAll">전체</label></li>
												<li><input type="radio" name="hscsType" id="hscsTypeAll" onChange={() => this.onClickFacilityType(-1)} checked={this.state.facilityType === -1} /> <label htmlFor="hscsTypeAll">대기오염</label></li>
												<li><input type="radio" name="hscsType" id="hscsTypeAll" onChange={() => this.onClickFacilityType(-1)} checked={this.state.facilityType === -1} /> <label htmlFor="hscsTypeAll">저감설비</label></li>
												<li><input type="radio" name="hscsType" id="hscsTypeAll" onChange={() => this.onClickFacilityType(-1)} checked={this.state.facilityType === -1} /> <label htmlFor="hscsTypeAll">배출설비</label></li>
												{/*<li><input type="radio" name="hscsType" id="hscsType01" onChange={() => this.onClickFacilityType(0)} checked={this.state.facilityType === 0} /><label htmlFor="hscsType01">화재</label></li>*/}
												{/*<li><input type="radio" name="hscsType" id="hscsType03" onChange={() => this.onClickFacilityType(900)} checked={this.state.facilityType === 900} /><label htmlFor="hscsType03">지능형 영상감시</label></li>*/}
												{/*<li><input type="radio" name="hscsType" id="hscsType04" onChange={() => this.onClickFacilityType(11)} checked={this.state.facilityType === 11} /><label htmlFor="hscsType04">누출센서</label></li>*/}
												{/*<li><input type="radio" name="hscsType" id="hscsType04" onChange={() => this.onClickFacilityType(21)} checked={this.state.facilityType === 21} /><label htmlFor="hscsType04">IoT센서</label></li>*/}
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
												<li>
													<select name="" id="" onChange={(e) => this.onChangeZone(e.target)} className={'selWh'}>
														{zoneUI}
													</select>
												</li>
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
											<col style={{ width: '10%' }} />
											<col style={{ width: '10%' }} />
											<col style={{ width: '10%' }} />
											{/* <col style={{ width: '10%' }} />
											<col style={{ width: '8%' }} /> */}
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
											{/* {gridUI} */}
											<tr id={"recentlyBoxArea"} className={'recentlyBoxArea'}>
												<td><input type="checkbox" id={"recentlyCheckbox"} className={'recentlyCheckbox'} onClick={() => this.onClickRecentlybox()} /></td>
												<td>1</td>
												<td>2024-01-31 00:00:00</td>
												<td>2024-01-31 00:00:00</td>
												<td>대기오염</td>
												<td>대기센서</td>
												<td>대경</td>
												<td>테스트</td>
												<td>심각</td>
												<td>-</td>
												<td><span className={'HisMemoOn'}></span></td>
											</tr>
											<tr id={"activeBoxArea"} className={'activeBoxArea'}>
												<td><input type="checkbox" id={"activeCheckbox"} className={'activeCheckbox'} onClick={() => this.onClickCheckbox()} /></td>
												<td>2</td>
												<td>2024-01-31 00:00:00</td>
												<td>2024-01-31 00:00:00</td>
												<td>대기오염</td>
												<td>대기센서</td>
												<td>대경</td>
												<td>테스트</td>
												<td>심각</td>
												<td>-</td>
												<td><span className={'HisMemoOn'}></span></td>
											</tr>
											<tr>
												<td><input type="checkbox"  /></td>
												<td>3</td>
												<td>2024-01-31 00:00:00</td>
												<td>2024-01-31 00:00:00</td>
												<td>대기오염</td>
												<td>대기센서</td>
												<td>대경</td>
												<td>테스트</td>
												<td>심각</td>
												<td>-</td>
												<td><span className={'HisMemoOn'}></span></td>
											</tr>
											<tr>
												<td><input type="checkbox"  /></td>
												<td>4</td>
												<td>2024-01-31 00:00:00</td>
												<td>2024-01-31 00:00:00</td>
												<td>대기오염</td>
												<td>대기센서</td>
												<td>대경</td>
												<td>테스트</td>
												<td>심각</td>
												<td>-</td>
												<td><span className={'HisMemoOn'}></span></td>
											</tr>
											<tr>
												<td><input type="checkbox" /></td>
												<td>5</td>
												<td>2024-01-31 00:00:00</td>
												<td>2024-01-31 00:00:00</td>
												<td>대기오염</td>
												<td>대기센서</td>
												<td>대경</td>
												<td>테스트</td>
												<td>심각</td>
												<td>-</td>
												<td><span className={'HisMemoOn'}></span></td>
											</tr>
											<tr>
												<td><input type="checkbox" /></td>
												<td>6</td>
												<td>2024-01-31 00:00:00</td>
												<td>2024-01-31 00:00:00</td>
												<td>대기오염</td>
												<td>대기센서</td>
												<td>대경</td>
												<td>테스트</td>
												<td>심각</td>
												<td>-</td>
												<td><span className={'HisMemoOn'}></span></td>
											</tr>
											<tr>
												<td><input type="checkbox" /></td>
												<td>7</td>
												<td>2024-01-31 00:00:00</td>
												<td>2024-01-31 00:00:00</td>
												<td>대기오염</td>
												<td>대기센서</td>
												<td>대경</td>
												<td>테스트</td>
												<td>심각</td>
												<td>-</td>
												<td><span className={'HisMemoOn'}></span></td>
											</tr>
											<tr>
												<td><input type="checkbox" /></td>
												<td>8</td>
												<td>2024-01-31 00:00:00</td>
												<td>2024-01-31 00:00:00</td>
												<td>대기오염</td>
												<td>대기센서</td>
												<td>대경</td>
												<td>테스트</td>
												<td>심각</td>
												<td>-</td>
												<td><span className={'HisMemoOn'}></span></td>
											</tr>
											<tr>
												<td><input type="checkbox" /></td>
												<td>9</td>
												<td>2024-01-31 00:00:00</td>
												<td>2024-01-31 00:00:00</td>
												<td>대기오염</td>
												<td>대기센서</td>
												<td>대경</td>
												<td>테스트</td>
												<td>심각</td>
												<td>-</td>
												<td><span className={'HisMemoOn'}></span></td>
											</tr>
											<tr id={"activeMemoArea"} className={'activeMemoArea'}>
												<td><input type="checkbox" /></td>
												<td>10</td>
												<td>2024-01-31 00:00:00</td>
												<td>2024-01-31 00:00:00</td>
												<td>대기오염</td>
												<td>대기센서</td>
												<td>대경</td>
												<td>테스트</td>
												<td>심각</td>
												<td>-</td>
												<td><span id={"memoIcon"} className={'HisMemoOn'} onClick={() => this.onClickMemoPop()}></span></td>
											</tr>
											<tr>
												<td><input type="checkbox" /></td>
												<td>11</td>
												<td>2024-01-31 00:00:00</td>
												<td>2024-01-31 00:00:00</td>
												<td>대기오염</td>
												<td>대기센서</td>
												<td>대경</td>
												<td>테스트</td>
												<td>심각</td>
												<td>-</td>
												<td><span className={'HisMemoOn'}></span></td>
											</tr>
											<tr>
												<td><input type="checkbox" /></td>
												<td>12</td>
												<td>2024-01-31 00:00:00</td>
												<td>2024-01-31 00:00:00</td>
												<td>대기오염</td>
												<td>대기센서</td>
												<td>대경</td>
												<td>테스트</td>
												<td>심각</td>
												<td>-</td>
												<td><span className={'HisMemoOn'}></span></td>
											</tr>
											<tr>
												<td><input type="checkbox" /></td>
												<td>13</td>
												<td>2024-01-31 00:00:00</td>
												<td>2024-01-31 00:00:00</td>
												<td>대기오염</td>
												<td>대기센서</td>
												<td>대경</td>
												<td>테스트</td>
												<td>심각</td>
												<td>-</td>
												<td><span className={'HisMemoOn'}></span></td>
											</tr>
											<tr>
												<td><input type="checkbox" /></td>
												<td>14</td>
												<td>2024-01-31 00:00:00</td>
												<td>2024-01-31 00:00:00</td>
												<td>대기오염</td>
												<td>대기센서</td>
												<td>대경</td>
												<td>테스트</td>
												<td>심각</td>
												<td>-</td>
												<td><span className={'HisMemoOn'}></span></td>
											</tr>
										</tbody>
									</table>
								</div>

								{/* {
									(this.state.dataSource && this.state.dataSource.length > 0) ?
										<div className={'hscNav'}>
											{
												(this.state.havePrevPage) ?
													<>
														<a className={'first'} onClick={() => this.onClickPrevSearch(true)}>맨 앞</a>
														<a className={'prev'} onClick={() => this.onClickPrevSearch(false)}>이전</a>
													</>
													:
													<>
														<a className={'firstDisable'}>맨 앞</a>
														<a className={'prevDisable'}>이전</a>
													</>
											}
											<ul>
												{pageIndexUI}
											</ul>
											{
												(this.state.haveAfterPage) ?
													<>
														<a className={'next'} onClick={() => this.onClickAfterSearch(false)}>다음</a>
														<a className={'last'} onClick={() => this.onClickAfterSearch(true)}>맨 뒤</a>
													</>
													:
													<>
														<a className={'nextDisable'}>다음</a>
														<a className={'lastDisable'}>맨 뒤</a>
													</>
											}
										</div>
										: <> </>
								} */}

						        <div className={'hscNav'}>
									<a className={'first'}>맨 앞</a>
									<a className={'prev'}>이전</a>
										<ul>
										   <li className={'on'}><a>1</a></li>
										   <li><a>2</a></li>
										   <li><a>3</a></li>
										   <li><a>4</a></li>
										   <li><a>5</a></li>
									    </ul>
									<a className={'next'}>다음</a>
									<a className={'last'}>맨 뒤</a>
							    </div>
						    </div>
						</div>
					</div>
				</div>

				{/* 메모장 테스트 */}
				<SensorDetectHistoryMemoComponent>
					<div /* id={'hsMmo'} */ id={"hsMemoBox"} className={'hsMemoBox'}>
						<div className={'dslTopMemo' + " " + 'dslGrd'}>
							<span className={'squareIcon'}></span>
							<h5 className={'squareTitle'}>
							   메모
							</h5>
							<a className={'dslX'} /* onClickClosePopup={this.onClickClosePopup} */></a>
						</div>
						<div className={'memoContents'}>
							<textarea value={'test'} cols="30" rows="10" className={"scroll-wrapper" + 'memoTxt' + "scrollbar scroll-textareaCss"} onChange={(e) => this.onChangeMemo(e)}>메모내용</textarea>
						</div>
					</div>
				</SensorDetectHistoryMemoComponent>



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