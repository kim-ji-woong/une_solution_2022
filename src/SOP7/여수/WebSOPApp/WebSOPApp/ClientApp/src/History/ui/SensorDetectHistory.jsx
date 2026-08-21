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
import { ko } from 'date-fns/esm/locale';
import btnCalendarBk from '../../Common/img/sub/dashboard_calendar_bk.png';

import CircularProgress from '@material-ui/core/CircularProgress';

import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/
import SensorDetectHistoryMemo from './popups/SensorDetectHistoryMemo';
import ConfirmDialog from '../../Common/ui/confirmDialog';
import StatusInfo from '../../SDMS/ui/popups/statusInfo';

import uis from '../../Common/css/ui.module.css';

import { SensorDetectHistoryUI } from '../styled/HistoryStyled';
import SdmsResource from '../../SDMS/resource/id';
import { Link } from 'react-router-dom';
import { SDMSController } from '../../SDMS/services/sdmsController';


class SensorDetectHistory extends Component {
	static isRealType = { test: 0, real: 1, entire: 2 };
	constructor(props) {
		super(props);

		this.state = {
			content: HistoryResource.ID.menu.userHistory,
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

			//selectedBuildingGroupID: -1,
			selectedBuildingGroupID: 1, // 여수 빌딩 그룹 1개
			selectedBuildingID: -1,
			selectedZoneID: -1,
			dateType: 'today',
			beginDate: new Date(),
			endDate: new Date(),			
			facilityType: -1,

			sensorDatas: null,
			
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

			confirmMessage: {
				visible: false,
				title: "",
				messages: [""],
				buttons: ["확인"],
				onClose: this.onCloseConfirmDialog,
				onClickButton: null
			},

			isReal: SensorDetectHistory.isRealType.entire,

			prevProps: null
		}

		this.refDatepicker01 = React.createRef();
		this.refDatepicker02 = React.createRef();

		this.currentPageMinID = -1;
		this.currentPageMaxID = -1;

		this.props = props;
		this.onClickSearch = this.onClickSearch.bind(this);
		this.onClickDownload = this.onClickDownload.bind(this);

		this.memoX = 0;
		this.memoY = 0;
	}

	componentDidMount() {		
		this.initSensorInfo();
		this.onClickSearch();
	}

	initSensorInfo = async () => {
		const result = await SDMSController.requestSensorDatas();

		if (result === null || result === undefined) {
			this.showConfirmDialog("[ERROR]", "센서 정보를 불러올 수 없습니다.", null, null);
			return;
		} 

		if (result.success === true) {
			this.setState({ sensorDatas: result.sensorDatas });
			return;
		}

		this.showConfirmDialog("[ERROR]", "센서 정보를 불러오지 못했습니다.", null, null);
		return;
	}

	async getMinMaxIndex(beginDate, endDate, facilityType, buildingGroupID, buildingID, zoneID) {
		const [minID, maxID] = await HistoryController.GetMinMaxIndex(beginDate, endDate, facilityType, buildingGroupID, buildingID, zoneID);

		return [minID, maxID];
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

	onCloseConfirmDialog = () => {
		const confirmMessage = { ...this.state.confirmMessage };
		confirmMessage.visible = false;

		this.setState({ confirmMessage });
	}

	isValidSearch = (buildingID, facilityType) => {

		if (this.state.facilityType === -1 || this.state.selectedBuildingID)
			return true;

		const sensorDatas = this.state.sensorDatas;

		for (let i = 0; i < sensorDatas?.length; i++) {
			const sensorData = sensorDatas[i];
			if (sensorData.sensorID === buildingID) {
				if (sensorData.sensorType === facilityType) {
					return true;
				}
			}
		}
		return false;
	}

	async onClickSearch() {
		$("body").css("cursor", "wait");

		const beginDate = this.getMakeDateTime(this.state.beginDate) + ' 00:00:00';
		const endDate = this.getMakeDateTime(this.state.endDate) + ' 23:59:59';

		if (beginDate > endDate) {
			$("body").css("cursor", "default");
			this.showConfirmDialog("에러", ["조회 기간을 다시 선택하세요."], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
			return;
		}

		await this.setState({ loadingIndicator: true })
		
		const buildingGroupID = this.state.selectedBuildingGroupID;
		const buildingID = this.state.selectedBuildingID;
		const zoneID = this.state.selectedZoneID;
		const facilityType = this.state.facilityType;

		if (!this.isValidSearch(buildingID, facilityType)) {
			$("body").css("cursor", "default");
			this.showConfirmDialog("[INFO]", "선택한 재난타입과 위치가 일치하지 않습니다.", null, null);
			setTimeout(() => {	
				this.setState({ loadingIndicator: false })}, 3000);
			return;
		}

		const [minID, maxID] = await this.getMinMaxIndex(beginDate, endDate, facilityType, buildingGroupID, buildingID, zoneID);

		console.log('maxID' + maxID);

		//const [orgDataSource, currentLastID, sensorZoneHistories] = await HistoryController.DisplaySensorDetectHistories( // 전체 조회
		//	beginDate, endDate, facilityType, buildingGroupID, buildingID, zoneID,
		//	-1, this.state.maxRowCount * this.state.maxPageCount, true);

		const [orgDataSource, currentLastID, sensorZoneHistories] = await HistoryController.DisplaySensorDetectHistories( // 전체 조회
			beginDate, endDate, -1, buildingGroupID, buildingID, zoneID,
			-1, 1000 , true); // 데이터 갯수가 왜 this.state.maxRowCount * this.state.maxPageCount로 조회 하는지 모르겠음 기존대로하면 50개가 최대 갯수인데 1000개로 조회하게 수정함

		let dataSource = [];
		let splitedHistories = null;

		// 전체 조회 후 FacilityType에 의하여 분기처리
		if (facilityType !== -1) {
			dataSource = this.splitSensorType(orgDataSource, sensorZoneHistories);

			//for (let i = 0; i < splitedHistories?.length; i++) {
			//	const splitedHistory = splitedHistories[i];

			//	if (splitedHistory.sensorType === facilityType) {
			//		dataSource.push(splitedHistory)
			//	} 
			//}

		} else if (facilityType === -1) {
			dataSource = orgDataSource;
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

	splitSensorType = (orgDataSource, sensorZoneHistories) => {
		const sensorDatas = this.state.sensorDatas;

		if (sensorDatas === null || sensorDatas === undefined) {
			this.initSensorInfo();
			this.showConfirmDialog("[ERROR]", "센서정보 불러오기에 실패하였습니다. SensorDetectHistory.jsx line:264");
			return null;
		}

		let result = [];

		let splitedHistories = [];

		for (let i = 0; i < sensorDatas.length; i++) {
			const sensorData = sensorDatas[i];

			for (let k = 0; k < sensorZoneHistories?.length; k++) {
				let sensorZoneHistory = sensorZoneHistories[k];

				const sensorType = sensorData.sensorType;

				if (sensorData.sensorID === sensorZoneHistory.zoneID) {

					sensorZoneHistory.sensorType = sensorType;
					splitedHistories.push(sensorZoneHistory);

				}
			}
		}

		for (let i = 0; i < orgDataSource?.length; i++) {
			const sensorDitectHistory = orgDataSource[i];

			for (let k = 0; k < splitedHistories?.length; k++) {
				const splitedHistory = splitedHistories[k];

				if (sensorDitectHistory.sensorZoneHistoryID === splitedHistory.id) {
					
					if (splitedHistory.sensorType === this.state.facilityType) {
						result.push(sensorDitectHistory);
					}
				}
			}
		}

		return result;

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

		const [dataSource, currentLastID, sensorZoneHistories] = await HistoryController.DisplaySensorDetectHistories(
			this.state.searchBeginDate, this.state.searchEndDate,
			this.state.searchFacilityType,
			this.state.searchBuildingGroupID, this.state.searchBuildingID, this.state.searchZoneID,
			searchLastID, searchRowCount, isDesc
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

		const [dataSource, currentLastID, sensorZoneHistories] = await HistoryController.DisplaySensorDetectHistories(
			this.state.searchBeginDate, this.state.searchEndDate,
			this.state.searchFacilityType,
			this.state.searchBuildingGroupID, this.state.searchBuildingID, this.state.searchZoneID,
			searchLastID, searchRowCount, isDesc
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

	onChangeDateTImeRange = (value) => { // value: string (day week month year)

		// today
		const today = new Date();

		// 1week ago
		const weekAgo = new Date(today);
		weekAgo.setDate(weekAgo.getDate() - 7)

		// 1month ago
		const monthAgo = new Date(today);
		monthAgo.setMonth(monthAgo.getMonth() - 1);

		// 1year ago
		const yearAgo = new Date(today);
		yearAgo.setFullYear(yearAgo.getFullYear() - 1);

		let result;

		if (value === 'day') result = today;
		if (value === 'week') result = weekAgo;
		if (value === 'month') result = monthAgo;
		if (value === 'year') result = yearAgo;

		this.refDatepicker01.current.setSelected(result);
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

	tryParseInt = (strValue) => {
		const parsedValue = parseInt(strValue, 10);

		if (isNaN(parsedValue)) {
			this.showConfirmDialog("[ERROR]", "SensorType을 불러오지 못했습니다.", null, null);
			return -1;
		}

		return parsedValue;
	}

	onClickFacilityType = (facilityType) => {
		// facilityType 비정상이면 전체 유형 return
		const result = this.tryParseInt(facilityType);
		this.setState({ facilityType: result });
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

		//const [dataSource, currentLastID] = await HistoryController.DisplaySensorDetectHistories(
		//	this.state.searchBeginDate, this.state.searchEndDate, this.state.searchFacilityType
		//	, this.state.searchBuildingGroupID, this.state.searchBuildingID, this.state.searchZoneID,
		//	-1, -1, true);
		const [dataSource, currentLastID, sensorZoneHIstories] = await HistoryController.DisplaySensorDetectHistories(
			this.state.searchBeginDate, this.state.searchEndDate, -1 // 전체 조회
			, this.state.searchBuildingGroupID, this.state.searchBuildingID, this.state.searchZoneID,
			-1, -1, true);

		// facilityType에 다른 분기 처리


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

		this.props.changeContent(HistoryResource.ID.menu.sopHistory, linkSOP);
	}

	setPopupMemo = (e, isOpen, sensorZoneHistoryID, memoContent) => {

		const target = e.target;

		const { clientX, clientY } = e;
		this.memoX = 1920 - 225; // px
		this.memoY = clientY;

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

		const pageArr = new Array();
		
		let index = this.state.pageIndex;
		// 이전 페이지 넣기
		while (true) {
			index--;
			if (index < 1) {
				break;
			}
			if (this.state.pageIndex - 2 > index) {
				break;
			}
		}
		index = this.state.pageIndex;
		pageArr.push(index);
		
		// 다음 페이지 넣기
		while (true) {
			if (pageArr.length === this.state.maxPageCount) {
				break;
			}
			
			index++;
			if (index > this.state.maxPageIndex) {
				break;
			}
			pageArr.push(index);
		}
		
		pageArr.sort(function (a, b) { if (a > b) return 1; if (a === b) return 0; if (a < b) return -1; });

		for (let i = 0; i < pageArr.length; i++) {
			let pageIndex = pageArr[i];
			if (pageIndex === this.state.pageIndex) {
				ui.push(<li key={'pageIndex_' + (pageIndex)} className={"on"}><a onClick={() => this.setPageIndex(pageIndex)}>{pageIndex}</a></li>);
			}
			else {
				ui.push(<li key={'pageIndex_' + (pageIndex)}><a onClick={() => this.setPageIndex(pageIndex)}>{pageIndex}</a></li>);
			}
		}
		
		// if (this.state.IsKnowPageIndex) {
		// 	for (let i = this.state.minPageIndex; i <= this.state.maxPageIndex; i++) {
		// 		if (i === this.state.pageIndex) {
		// 			ui.push(<li key={'pageIndex_' + (i)} className={"on"}><a>{i}</a></li>);
		// 		}
		// 		else {
		// 			ui.push(<li key={'pageIndex_' + (i)}><a onClick={() => this.setPageIndex(i)}>{i}</a></li>);
		// 		}
		// 	}
		// }
		// else {
		// 	ui.push(<li key={'pageIndex_'} className={'on'}><a>...</a></li>);
        // }

		return ui;
	}

	getGridData() {		
		let ui = [];
		if (!this.state.dataSource) {
			return [ui, false];
		}
		
		let dataSource = this.state.dataSource;
 		
		const type = this.state.isReal;

		let datacount = dataSource.length;
		
		if (type === SensorDetectHistory.isRealType.real) {
			let array = [];
			for (let i = 0; i < datacount; i++) {
				if (parseInt(dataSource[i].realMode) === SensorDetectHistory.isRealType.real) {
					array.push(dataSource[i]);
				}
			}
			dataSource = array;
			datacount = array.length;
		} else if (type === SensorDetectHistory.isRealType.test) {
			let array = [];
			for (let i = 0; i < datacount; i++) {
				if (parseInt(dataSource[i].realMode) === SensorDetectHistory.isRealType.test) {
					array.push(dataSource[i]);
				}
			}
			dataSource = array;
			datacount = array.length;
		}
		
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
				haveMemoClassName = 'HisMemoOff';
            }

			ui.push(
				<tr key={'dataSource_' + (i)}>
					<td className={uis.detectHTd}><input type="checkbox" checked={dataSource[i].checked || false} onChange={(e) => this.onCheckedRow(e.target.checked, i)} /></td>
					<td>{/*(i + 1)*/dataSource[i].sensorZoneHistoryID}</td>
					<td>{dataSource[i].time}</td>
					<td>{dataSource[i].endTime}</td>
					{/* <td>{dataSource[i].type}</td> */}
					<td>{dataSource[i].sensorName}</td>
					<td>{dataSource[i].zoneName}</td>
					<td>{(dataSource[i].realMode === '0') ? '테스트' : '실제'}</td>
					<td>{dataSource[i].detectType}</td>
					{/* <td>{dataSource[i].detectInfo}</td> */}
					<td>{dataSource[i].alarmLevel}</td>
					<td className={sopLinkClassName} onClick={() => this.onLinkSOP(dataSource[i].actionStepHistoryID, dataSource[i].sopBeginTime)}>{(dataSource[i].sopName.length > 0) ? dataSource[i].sopName : '-'}</td>
					<td onClick={(e) => this.setPopupMemo(e, true, dataSource[i].sensorZoneHistoryID, dataSource[i].memo)}><span className={haveMemoClassName}></span></td>
				</tr>
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

	onChangeTest = (value) => {
		const nValue = parseInt(value);
		
		let dataSource = this.state.dataSource;
		
		if (dataSource === null || dataSource === undefined) {
			this.setState({isReal: nValue});
		}
		else {
			for (let i = 0; i < dataSource.length; i++) {
				dataSource[i].checked = false;
			}
			this.setState({ isReal: nValue, dataSource });
		}
	}

	render() {
		const [buildingGroupUI, buildingUI, zoneUI] = this.getSpatailUI();
		const pageIndexUI = this.getPageIndexUI();
		const [gridUI, allChecked] = this.getGridData();

		return (
			<>				
				<SensorDetectHistoryUI id={'historyback'} className={SdmsResource.UISection}>
					<Link to="/sdms"><span className={uis.yeosuLogoBlackBox}></span></Link>
					<div id={'hsty'}>
						<div id={'hsLft'}>
							<ul className={'hslMenu'}>								
								<li><a onClick={() => this.props.changeContent(HistoryResource.ID.menu.sensorDetectHistory)} className={newStyles.on}>센서 탐지 이력</a></li>
								<li><a onClick={() => this.props.changeContent(HistoryResource.ID.menu.sensorDetectAnalysis)}>센서 탐지 분석</a></li>
								<li><a onClick={() => this.props.changeContent(HistoryResource.ID.menu.sopHistory)}>SOP 이력</a></li>
								{/* <li><a onClick={() => this.props.changeContent(HistoryResource.ID.menu.userHistory)}>데이터 수정 이력</a></li> */}
								{/*<li><a onClick={() => this.props.changeContent(HistoryResource.ID.menu.spreadHistory)}>상황전파 이력</a></li>*/}
							</ul>
							<div className={'returnArea'}><span className={'returnBtn'}></span><Link to="/sdms">이전페이지</Link></div>
						</div>

						<div className={'hsScr hsScr'}>
							<span className={'detectTitle'}>센서탐지 이력</span>
							<div id={'hsCont'}>
								<form action="">
									<div className={'hscSch'}>
										<dl className={'hscSchFirst'}>
											{/* <dt>재난타입</dt> */}
											<dd className={'disasterTypeBox'}>
												{/* <ul className={newStyles.hscsRdo}>
													<li><input type="radio" name="hscsType" id="hscsType01" onChange={() => this.onClickFacilityType(-1)} checked={this.state.facilityType === -1} /> <label htmlFor="hscsType01">전체</label></li>
													<li><input type="radio" name="hscsType" id="hscsType01" onChange={() => this.onClickFacilityType(0)} checked={this.state.facilityType === 0} /><label htmlFor="hscsType01">화재</label></li>
													<li><input type="radio" name="hscsType" id="hscsType03" onChange={() => this.onClickFacilityType(900)} checked={this.state.facilityType === 900} /><label htmlFor="hscsType03">지능형 영상감시</label></li>
													<li><input type="radio" name="hscsType" id="hscsType04" onChange={() => this.onClickFacilityType(11)} checked={this.state.facilityType === 11} /><label htmlFor="hscsType04">누출센서</label></li>
													<li><input type="radio" name="hscsType" id="hscsType04" onChange={() => this.onClickFacilityType(21)} checked={this.state.facilityType === 21} /><label htmlFor="hscsType04">IoT센서</label></li>
												</ul> */}
												<p className={'disasterTypeTitle'}>재난타입</p>
												<select className={'disasterSelect'} onChange={(e) => this.onClickFacilityType(e.target.value)}>
													<option value={-1} >전체</option>
													<option value={StatusInfo.AtmosphereType} >대기</option>
													<option value={StatusInfo.WaterType} >수질</option>
													<option value={StatusInfo.VocType} >VOC</option>
													<option value={StatusInfo.BacterialType} >악취</option>
												</select>
											</dd>
										</dl>
										<dl className={'hscSchSecond'}>
											{/* <dt>위치</dt> */}
											<dd className={'locationTypeBox'}>
												<p className={'locationTitle'}>위치</p>
												<ul className={'hscsLoc'}>
													<li>
														<select name="" id="" onChange={(e) => this.onChangeBuilding(e.target)} className={'locationSelect'}>
															{/*{buildingGroupUI}*/}
															{buildingUI}
														</select>
													</li>
													{/* <li>
														<select name="" id="" onChange={(e) => this.onChangeBuilding(e.target)} className={newStyles.selWh}>
															{buildingUI}
														</select>
													</li>
													<li>
														<select name="" id="" onChange={(e) => this.onChangeZone(e.target)} className={newStyles.selWh}>
															{zoneUI}
														</select>
													</li> */}
												</ul>
											</dd>
										</dl>
										<dl className={'hscSchThird'}>
											{/* <dt>조회기간</dt> */}
											<dd className={'inquiryPeriodBox'}>
												<p className={'inquiryPeriodTitle'}>조회기간</p>
												<ul className={'hscsDatee'}>
													<li>
														<div className={'datepicker'}>
															<DatePicker ref={this.refDatepicker01} name="datepicker01" id="datepicker01"
																dateFormat="yyyy-MM-dd"
																locale={ko}
																maxDate={new Date()}
																selected={this.state.beginDate}
																onChange={date => this.onChangeBegin(date)} />
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
												{/* <ul className={newStyles.hscsRdo}>
													<li><input type="radio" name="hscsRdo" id="hscsRdo01" onChange={() => this.onClickDateType('select')} checked={this.state.dateType === 'select'} /><label htmlFor="hscsRdo01">기간선택</label></li>
													<li><input type="radio" name="hscsRdo" id="hscsRdo01" onChange={() => this.onClickDateType('today')} checked={this.state.dateType === 'today'} /><label htmlFor="hscsRdo01">오늘</label></li>
													<li><input type="radio" name="hscsRdo" id="hscsRdo02" onChange={() => this.onClickDateType('week')} checked={this.state.dateType === 'week'} /><label htmlFor="hscsRdo02">1주</label></li>
													<li><input type="radio" name="hscsRdo" id="hscsRdo03" onChange={() => this.onClickDateType('month')} checked={this.state.dateType === 'month'} /><label htmlFor="hscsRdo03">1개월</label></li>
													<li><input type="radio" name="hscsRdo" id="hscsRdo04" onChange={() => this.onClickDateType('year')} checked={this.state.dateType === 'year'} /><label htmlFor="hscsRdo04">1년</label></li>
												</ul> */}
											</dd>
										</dl>
										<dl className={'hscSchFourth'}>
										  <dd className={'inquiryChoice'}>
											<p className={'inquiryChoiceTitle'}>조회기간 선택</p>
										 {/* <ul className={'hscsDatee'}>
												<li>
													<div className={'datepicker'}>
														<DatePicker ref={this.refDatepicker01} name="datepicker01" id="datepicker01"
															dateFormat="yyyy-MM-dd"
															locale={ko}
															maxDate={new Date()}
															selected={this.state.beginDate}
															onChange={date => this.onChangeBegin(date)} />
													</div>
												</li>
										    </ul> */}
											<select defaultValue="day" onChange={(e) => this.onChangeDateTImeRange(e.target.value)}>
												<option value="day">오늘</option>
												<option value="week">1주</option>
												<option value="month">1달</option>
												<option value="year">1년</option>
											</select>
										  </dd>
										</dl>
										{
											this.state.loadingIndicator === true ?
												<a className={'hscsSbmt'} id={'hscsSbmting'}><span><span><CircularProgress className="spinner"/></span></span></a>
												:
												<a onClick={this.onClickSearch} className={'hscsSbmt'}><span><span>검색</span></span></a>
										}
									</div>
								</form>

								{
									this.state.loadingIndicator === true ?
										<ul className={'hscExl'}>
											<li><span className={'downIcon'}></span><a className={'exl'} id={'hscsSbmting'}>선택 다운로드</a></li>
											<li><span className={'downIcon'}></span><a className={'all'} id={'hscsSbmting'}>전체 다운로드</a></li>
										</ul>
										:
										<ul className={'hscExl'}>
											<li><span className={'downIcon'}></span><a onClick={() => this.onClickSelectDownload()} className={'exl'}>선택 다운로드</a></li>
											<li><span className={'downIcon'}></span><a onClick={() => this.onClickDownload()} className={'all'}>전체 다운로드</a></li>
										</ul>
								}

								<div className={'hscTb'}>
									<div className={'scrTb'}>
										<table>
											<colgroup>
												<col style={{ width: '3%' }} />
												<col style={{ width: '5%' }} />
												<col style={{ width: '10%' }} />
												<col style={{ width: '16%' }} />
												{/* <col style={{ width: '10%' }} /> */}
												<col style={{ width: '14%' }} />
												<col style={{ width: '14%' }} />
												<col style={{ width: '8%' }} />
												<col style={{ width: '8%' }} />
												{/* <col style={{ width: '5%' }} /> */}
												<col style={{ width: '8%' }} />
												<col style={{ width: '8%' }} />
												<col style={{ width: '5%' }} />
											</colgroup>
											<thead>
												<tr>
													<th className={'whiteCheckBox'}><input type="checkbox" checked={allChecked} onChange={(e) => this.onCheckedRow(e.target.checked, -1)} /></th>
													<th>번호</th>
													<th>일시</th>
													<th>종료일시</th>
													{/* <th>유형</th> */}
													<th>센서명</th>
													<th>위치</th>
													{/* <th className={newStyles.entireArea}>전체<span className={newStyles.theadArrowIcon}></span></th> */}
													<th className={'entireArea'}>
														<select className={'sensorHistorySelect'} name="" id="" onChange={(e) => this.onChangeTest(e.target.value)}>
															<option value={SensorDetectHistory.isRealType.entire}>전체</option>
															<option value={SensorDetectHistory.isRealType.test}>테스트</option>
															<option value={SensorDetectHistory.isRealType.real}>실제</option>
														</select>
														<span className={'theadArrowIcon'}></span>
													</th>
													<th>탐지 유형</th>
													{/* <th>탐지 정보</th> */}
													<th>위기경보 단계</th>
													<th>대응SOP</th>
													<th>메모</th>
												</tr>
											</thead>
											<tbody>
												{gridUI}
											</tbody>
										</table>
									</div>

									{/*	{
										(this.state.dataSource && this.state.dataSource.length > 0) ?
											<div className={newStyles.hscNav}>
												{
													(this.state.havePrevPage) ?
														<>
															<a className={newStyles.first} onClick={() => this.onClickPrevSearch(true)}>맨앞</a>
															<a className={newStyles.prev} onClick={() => this.onClickPrevSearch(false)}>이전</a>
														</>
														:
														<>
															<a className={newStyles.firstDisable}>맨앞</a> 
															<a className={newStyles.prevDisable}>이전</a>
														</>
												}
												<ul>
													{pageIndexUI}
												</ul>
												{
													(this.state.haveAfterPage) ?
														<>
															<a className={newStyles.next} onClick={() => this.onClickAfterSearch(false)}>다음</a>
															<a className={newStyles.last} onClick={() => this.onClickAfterSearch(true)}>맨뒤</a>
														</>
														:
														<>
															<a className={newStyles.nextDisable}>다음</a>
														    <a className={newStyles.lastDisable}>맨뒤</a>
														</>
												}
											</div>
											: <> </>
									} */}

									{
										(this.state.dataSource && this.state.dataSource.length > 0) ?
											<div className={'hscNav'}>
												{/* <a className={'first'} onClick={() => this.setPageIndex(1)}>맨앞</a> */}
												<a className={'prev'} onClick={() => this.setPageIndex(this.state.pageIndex - 1)}>이전</a>
												<ul>
													{pageIndexUI}
												</ul>
												<a className={'next'} onClick={() => this.setPageIndex(this.state.pageIndex + 1)}>다음</a>
												{/* <a className={'last'} onClick={() => this.setPageIndex(this.state.maxPageIndex)}>맨뒤</a> */}
											</div>
											: <> </>
									}

								</div>
							</div>
						</div>
					</div>
				</SensorDetectHistoryUI>
				{
					(this.state.popupMemoHistoryID !== null && this.state.popupMemoHistoryID > 0) ?
						<SensorDetectHistoryMemo fromHistoryMenu={true} setPopupMemo={this.setPopupMemo} actionStepHistoryID={this.state.popupMemoHistoryID} popupMemoContent={this.state.popupMemoContent} memoX={this.memoX} memoY={this.memoY} />
						: null					
				}
				{
					/* alert창 대신 사용 */
					this.state.confirmMessage.visible &&
					<ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
				}
			</>
		);
	}
}

export default SensorDetectHistory;