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
import btnCalendarBk from '../../Common/img/sub/dashboard_calendar_bk.png';
import btnCalendarBk_wonik from '../../Common/img/sub/dashboard_calendar_bk_wonik.png';

import CircularProgress from '@material-ui/core/CircularProgress';

import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/
import SensorDetectHistoryMemo from './popups/SensorDetectHistoryMemo';

import ProjectResource from '../../Root/resource/id';
import { i18n, withTranslation, i18nUtil } from '../../language/i18n';
import SdmsResource from '../../SDMS/resource/id';
import { GghController } from '../../SDMS/services/gghController';
import ConfirmDialog from '../../Common/ui/confirmDialog';

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

			sensorDetectHistoryTbodyUI: false,
            sensorDetectHistoryOptionUI: false,

			selectValue: [],

			searchText: '',

			confirmMessage: {
				visible: false,
				title: "",
				messages: [""],
				buttons: [i18n.t('common.확인')],
				onClose: this.onCloseConfirmDialog,
				onClickButton: null
			},
		}

		this.refDatepicker01 = React.createRef();
		this.refDatepicker02 = React.createRef();

		this.currentPageMinID = -1;
		this.currentPageMaxID = -1;

		this.props = props;
		this.onClickSearch = this.onClickSearch.bind(this);
		this.onClickDownload = this.onClickDownload.bind(this);

		this.detectHistoryTbodyhandleClick = this.detectHistoryTbodyhandleClick.bind(this);
		this.detectHistoryOptionUIhandleClick = this.detectHistoryOptionUIhandleClick.bind(this);
		this.detectHistoryOptionUI2handleClick = this.detectHistoryOptionUI2handleClick.bind(this);
	}

	componentDidMount() {
		const beginDate = this.getMakeDateTime(this.state.beginDate) + ' 00:00:00';
		const endDate = this.getMakeDateTime(this.state.endDate) + ' 23:59:59';

		if (beginDate <= endDate) {
			this.getSensorDetectCondition(
				beginDate,
				endDate,
				this.state.facilityType,
				this.state.selectedBuildingGroupID,
				this.state.selectedBuildingID,
				this.state.selectedZoneID
			);
		}

		if (this.props.selectedSiteID) {
			this.onClickSearch();
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.selectedSiteID !== this.props.selectedSiteID) {
			this.onClickSearch();
		}

		// 재난타입/위치/조회기간 변경 감지
		const disasterTypeChanged =
			prevState.facilityType !== this.state.facilityType;

		const locationChanged =
			prevState.selectedBuildingGroupID !== this.state.selectedBuildingGroupID ||
			prevState.selectedBuildingID !== this.state.selectedBuildingID ||
			prevState.selectedZoneID !== this.state.selectedZoneID;

		const periodChanged =
			prevState.beginDate !== this.state.beginDate ||
			prevState.endDate !== this.state.endDate;

		if (disasterTypeChanged || locationChanged || periodChanged) {
			const beginDate = this.getMakeDateTime(this.state.beginDate) + ' 00:00:00';
			const endDate = this.getMakeDateTime(this.state.endDate) + ' 23:59:59';

			if (beginDate <= endDate) {
				this.getSensorDetectCondition(
					beginDate,
					endDate,
					this.state.facilityType,
					this.state.selectedBuildingGroupID,
					this.state.selectedBuildingID,
					this.state.selectedZoneID
				);
			}
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

        this.setState({ confirmMessage });
    }

    onCloseConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        this.setState({ confirmMessage });
    }

	detectHistoryTbodyhandleClick() {
		this.setState(prevState => ({
			sensorDetectHistoryTbodyUIOn: !prevState.sensorDetectHistoryTbodyUIOn,

		}));
	}

    detectHistoryOptionUIhandleClick(){
		this.setState(prevState => ({
			sensorDetectHistoryOptionUIOn: true,

		}));
	}

	detectHistoryOptionUI2handleClick() {
		this.setState(prevState => ({
			sensorDetectHistoryOptionUIOn: false,

		}));
	}

	async getMinMaxIndex(beginDate, endDate, facilityType, buildingGroupID, buildingID, zoneID) {
		const [minID, maxID] = await HistoryController.GetMinMaxIndex(beginDate, endDate, facilityType, buildingGroupID, buildingID, zoneID, this.getSearchOption(this.props.selectedSiteID));

		return [minID, maxID];
	}

	// facilityType 하나만 조회할 것인가?
	getSearchOption(siteID) {
		if (siteID >= ProjectResource.Site.GG_A && siteID <= ProjectResource.Site.GG_H) {
			return true;
		}

		return false;
    }

	getSensorDetectCondition = async (beginDate, endDate, facilityType, buildingGroupID, buildingID, zoneID) => {
		const result = await HistoryController.requestSensorDetectCondition(beginDate, endDate, facilityType, buildingGroupID, buildingID, zoneID);

		if (result.success) {
			this.setState({ searchText: result.condition });
		}
		else {
			console.log(result.message);
		}
	}

	async onClickSearch() {
		$("body").css("cursor", "wait");

		const beginDate = this.getMakeDateTime(this.state.beginDate) + ' 00:00:00';
		const endDate = this.getMakeDateTime(this.state.endDate) + ' 23:59:59';

		if (beginDate > endDate) {
			$("body").css("cursor", "default");
			alert(i18n.t('조회 기간을 다시 선택하세요'));
			return;
		}

		await this.setState({ loadingIndicator: true })
		
		const buildingGroupID = this.state.selectedBuildingGroupID;
		const buildingID = this.state.selectedBuildingID;
		const zoneID = this.state.selectedZoneID;
		const facilityType = this.state.facilityType;

		const [minID, maxID] = await this.getMinMaxIndex(beginDate, endDate, facilityType, buildingGroupID, buildingID, zoneID);

		console.log('maxID' + maxID);

		let dataSource, currentLastID;

		if (this.state.searchText.trim() === '') {
			// searchText가 비어 있으면 전체 조회
			[dataSource, currentLastID] = await HistoryController.DisplaySensorDetectHistories(
				beginDate, endDate, facilityType, buildingGroupID, buildingID, zoneID,
				-1, -1, true,
				this.props.selectedSiteID,
				this.getSearchOption(this.props.selectedSiteID)
			);
		} else {
			// 검색어가 있으면 조건 검색
			[dataSource, currentLastID] = await HistoryController.DisplaySensorDetectHistoryQuery(
				this.state.searchText,
				-1,
				-1,
				this.props.selectedSiteID
			);
		}

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

	async onClickDownloadAlarmReport() {
		let arrSensorZoneHistoryIDs = [];

		if (this.state.dataSource) {
			for (const data of this.state.dataSource) {
				const checked = data.checked;

				if (!checked) {
					continue;
				}

				arrSensorZoneHistoryIDs.push(data.sensorZoneHistoryID);
			}
		}

		if (arrSensorZoneHistoryIDs.length > 0) {
			const [success, message] = await GghController.requestDownloadAlarmReport(arrSensorZoneHistoryIDs);

			if (!success) {
				this.showConfirmDialog(i18n.t('account.에러'), [message], null, null);
			}
		}
		else {
			this.showConfirmDialog(i18n.t('account.에러'), ["다운로드 받을 데이터를 선택해주세요."], null, null);
		}
    }

	async onClickDownload() {
		const title = i18n.t('history.menu.센서 탐지 이력');

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet(title); // sheet 이름

		// title		
		let titleRow = worksheet.getCell('A1');
		titleRow.value = title;

		titleRow.font = { name: '맑은 고딕', family: 4, size: 20, bold: true };
		worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

		worksheet.mergeCells('A1:L2');
		worksheet.getCell('A1:H2').border = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' }
		}

		const beginDate = this.getMakeDateTime(this.state.beginDate);
		const endDate = this.getMakeDateTime(this.state.endDate);

		worksheet.addRow([i18n.t('history.formText.조회 기간') + ' : ' + beginDate + ' ~ ' + endDate]);
		worksheet.addRow([i18n.t('history.formText.조회 범위') + ' : ' + this.state.searchZoneName]);
		worksheet.addRow([]);

		// column
		let columnRow = worksheet.addRow(['No', i18n.t('history.formText.일시'), i18n.t('history.formText.종료일시'), i18n.t('history.formText.유형'), i18n.t('history.formText.센서명'), i18n.t('common.위치'), i18n.t('history.formText.실제/테스트'), i18n.t('history.formText.탐지 유형'), i18n.t('history.formText.탐지 정보'), i18n.t('history.formText.위험경보 단계'), i18n.t('history.formText.대응 SOP'), i18n.t('history.formText.메모')]);
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
			{ key: "sopName", width: 20 },
			{ key: "memo", width: 40 }
		];

		let dataSource, currentLastID;
		if (this.state.searchText.trim() === '') {
			[dataSource, currentLastID] = await HistoryController.DisplaySensorDetectHistories(
				this.state.searchBeginDate,
				this.state.searchEndDate,
				this.state.searchFacilityType,
				this.state.searchBuildingGroupID,
				this.state.searchBuildingID,
				this.state.searchZoneID,
				-1,         // lastId
				-1,         // rowCount: 전체
				true,       // isDesc
				this.props.selectedSiteID,
				this.getSearchOption(this.props.selectedSiteID)
			);
		} else {
			[dataSource, currentLastID] = await HistoryController.DisplaySensorDetectHistoryQuery(
				this.state.searchText,
				-1,     // lastSensorZoneHistoryID: 전체 덤프
				-1,     // rowCount: 전체
				this.props.selectedSiteID
			);
		}

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
				const memo = dataSource[i].memo;

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
				data.memo = (memo === null) ? '' : memo;

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
					sopName: item.sopName,
					memo: item.memo
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
		const title = i18n.t('history.menu.센서 탐지 이력');

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet(title); // sheet 이름

		// title		
		let titleRow = worksheet.getCell('A1');
		titleRow.value = title;

		titleRow.font = { name: '맑은 고딕', family: 4, size: 20, bold: true };
		worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

		worksheet.mergeCells('A1:L2');
		worksheet.getCell('A1:H2').border = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' }
		}

		const beginDate = this.getMakeDateTime(this.state.beginDate);
		const endDate = this.getMakeDateTime(this.state.endDate);
		worksheet.addRow([i18n.t('history.formText.조회 기간') + ' : ' + beginDate + ' ~ ' + endDate]);
		worksheet.addRow([i18n.t('history.formText.조회 범위') + ' : ' + this.state.searchZoneName]);
		worksheet.addRow([]);

		// column
		let columnRow = worksheet.addRow(['No', i18n.t('history.formText.일시'), i18n.t('history.formText.종료일시'), i18n.t('history.formText.유형'), i18n.t('history.formText.센서명'), i18n.t('common.위치'), i18n.t('history.formText.실제/테스트'), i18n.t('history.formText.탐지 유형'), i18n.t('history.formText.탐지 정보'), i18n.t('history.formText.위험경보 단계'), i18n.t('history.formText.대응 SOP'), i18n.t('history.formText.메모')]);
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
			{ key: "sopName", width: 20 },
			{ key: "memo", width: 40 }
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
				const memo = this.state.dataSource[i].memo;

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
				data.memo = (memo === null) ? '' : memo;

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
					sopName: item.sopName,
					memo: item.memo
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

		const { pageIndex, maxPageIndex, maxPageCount } = this.state;

		const windowStart = Math.floor((pageIndex - 1) / maxPageCount) * maxPageCount + 1;
		const windowEnd = Math.min(windowStart + maxPageCount - 1, maxPageIndex);

		for (let i = windowStart; i <= windowEnd; i++) {
			if (i === pageIndex) {
				ui.push(<li key={'pageIndex_' + i} className={'on'}><a>{i}</a></li>);
			} else {
				ui.push(<li key={'pageIndex_' + i}><a onClick={() => this.setPageIndex(i)}>{i}</a></li>);
			}
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

			if (ProjectResource.SiteID === ProjectResource.Site.Magog && dataSource[i].detectType === "수동 신고") {
				dataSource[i].detectType = "이력 관리";
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
								? /*<td onClick={() => this.setPopupMemo(true, dataSource[i].sensorZoneHistoryID, dataSource[i].memo)}><span className={haveMemoClassName}></span></td>*/
								<td onClick={() => this.setPopupMemo(true, dataSource[i].sensorZoneHistoryID, dataSource[i].memo)}>{dataSource[i].memo}</td>
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

	getSpatialUI() {
		const buildingGroupUI = [<option key="buildingGroupOption_-1" value="-1">{i18n.t('common.전체')}</option>];
		const buildingUI = [<option key="buildingOption_-1"       value="-1">{i18n.t('common.전체')}</option>];
		const zoneUI = [<option key="zoneOption_-1"           value="-1">{i18n.t('common.전체')}</option>];

		const listProp = this.props.buildingGroupList;
		if (!listProp) {
			return [buildingGroupUI, buildingUI, zoneUI];
		}

		const allGroups = Array.isArray(listProp) ? listProp : [listProp];

		let groups = allGroups;

		for (const group of groups) {
			const groupId = group.id != null ? group.id : (group.groupId ?? group.siteID ?? '');
			const groupLabel = group.displayText ?? group.groupName ?? group.name ?? (groupId !== '' ? `Group ${groupId}` : i18n.t('common.그룹'));

			if (this.state.selectedBuildingGroupID === groupId) {
				buildingGroupUI.push(
					<option key={`buildingGroupOption_${groupId}`} value={groupId}>{groupLabel}</option>
				);

				const buildings = Array.isArray(group.buildingDatas) ? group.buildingDatas : [];
				for (const b of buildings) {
					const bId = b.id;
					const bLabel = b.displayText ?? b.zoneName ?? b.name ?? (bId != null ? `Building ${bId}` : i18n.t('common.빌딩'));
					buildingUI.push(
						<option key={`buildingOption_${bId}`} value={bId}>{bLabel}</option>
					);

					if (this.state.selectedBuildingID === bId) {
						const zones = Array.isArray(b.zoneDatas) ? b.zoneDatas : [];
						for (const z of zones) {
							const zId = z.id;
							const zLabel = z.displayText ?? z.zoneName ?? z.name ?? (zId != null ? `Zone ${zId}` : i18n.t('common.구역'));
							zoneUI.push(
								<option key={`zoneOption_${zId}`} value={zId}>{zLabel}</option>
							);
						}
					}
				}
			} else {
				buildingGroupUI.push(
					<option key={`buildingGroupOption_${groupId}`} value={groupId}>{groupLabel}</option>
				);
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
			sensorTypeUI.push(<li key='sensorType_fire'><input type="radio" name="hscsType" id="hscsType0" onChange={() => this.onClickFacilityType(0)} checked={this.state.facilityType === 0} /><label htmlFor="hscsType0">{i18n.t('facilityType.화재')}</label></li>);
		}
		if (this.props.useSensorTypes?.UsePSM === true) {
			sensorTypeUI.push(<li key='sensorType_psm'><input type="radio" name="hscsType" id="hscsType11" onChange={() => this.onClickFacilityType(11)} checked={this.state.facilityType === 11} /><label htmlFor="hscsType11">{i18n.t('facilityType.누출')}</label></li>);
		}
		if (this.props.useSensorTypes?.UseETC === true) {
			sensorTypeUI.push(<li key='sensorType_etc'><input type="radio" name="hscsType" id="hscsType21" onChange={() => this.onClickFacilityType(21)} checked={this.state.facilityType === 21} /><label htmlFor="hscsType21">{i18n.t('facilityType.기타')}</label></li>);
		}

		if (this.props.useSensorTypes?.UseEnvironment === true) {
			sensorTypeUI.push(<li key='sensorType_environment'><input type="radio" name="hscsType" id="hscsType117" onChange={() => this.onClickFacilityType(117)} checked={this.state.facilityType === 117} /><label htmlFor="hscsType117">{i18n.t('facilityType.환경설비')}</label></li>);
		}
		if (this.props.useSensorTypes?.UseManufacture === true) {
			sensorTypeUI.push(<li key='sensorType_manufacture'><input type="radio" name="hscsType" id="hscsType118" onChange={() => this.onClickFacilityType(118)} checked={this.state.facilityType === 118} /><label htmlFor="hscsType118">{i18n.t('facilityType.제조설비')}</label></li>);
		}

		if (this.props.useSensorTypes?.UseSVMS === true) {
			sensorTypeUI.push(<li key='sensorType_svms'><input type="radio" name="hscsType" id="hscsType900" onChange={() => this.onClickFacilityType(900)} checked={this.state.facilityType === 900} /><label htmlFor="hscsType900">SVMS</label></li>);
		}
		if (this.props.useSensorTypes?.UseEarthquake === true) {
			sensorTypeUI.push(<li key='sensorType_earthquake'><input type="radio" name="hscsType" id="hscsType50" onChange={() => this.onClickFacilityType(50)} checked={this.state.facilityType === 50} /><label htmlFor="hscsType50">{i18n.t('facilityType.지진')}</label></li>);
		}
		if (this.props.useSensorTypes?.UseStrongWind === true) {
			sensorTypeUI.push(<li key='sensorType_strongWind'><input type="radio" name="hscsType" id="hscsType18" onChange={() => this.onClickFacilityType(18)} checked={this.state.facilityType === 18} /><label htmlFor="hscsType18">{i18n.t('facilityType.강풍')}</label></li>);
		}
		if (this.props.useSensorTypes?.UseBlackOut === true) {
			sensorTypeUI.push(<li key='sensorType_blackout'><input type="radio" name="hscsType" id="hscsType17" onChange={() => this.onClickFacilityType(17)} checked={this.state.facilityType === 17} /><label htmlFor="hscsType17">{i18n.t('facilityType.정전')}</label></li>);
		}
		if (this.props.useSensorTypes?.UseLaser === true) {
			sensorTypeUI.push(<li key='sensorType_laser'><input type="radio" name="hscsType" id="hscsType120" onChange={() => this.onClickFacilityType(120)} checked={this.state.facilityType === 120} /><label htmlFor="hscsType120">{i18n.t('facilityType.레이저')}</label></li>);
		}
		if (this.props.useSensorTypes?.UseDoor === true) {
			sensorTypeUI.push(<li key='sensorType_door'><input type="radio" name="hscsType" id="hscsType16" onChange={() => this.onClickFacilityType(16)} checked={this.state.facilityType === 16} /><label htmlFor="hscsType16">{i18n.t('facilityType.도어')}</label></li>);
		}

		sensorTypeUI.push(<li key='sensorType_ForcedDoorOpen'><input type="radio" name="hscsType" id="hscsType951" onChange={() => this.onClickFacilityType(SdmsResource.facilityType.ForcedDoorOpen)} checked={this.state.facilityType === SdmsResource.facilityType.ForcedDoorOpen} /><label htmlFor="hscsType951">강제 문열림</label></li>);

		sensorTypeUI.push(<li key='sensorType_CheatedTagging'><input type="radio" name="hscsType" id="hscsType952" onChange={() => this.onClickFacilityType(SdmsResource.facilityType.CheatedTagging)} checked={this.state.facilityType === SdmsResource.facilityType.CheatedTagging} /><label htmlFor="hscsType952">대리태깅</label></li>);

		sensorTypeUI.push(<li key='sensorType_Untagging'><input type="radio" name="hscsType" id="hscsType953" onChange={() => this.onClickFacilityType(SdmsResource.facilityType.Untagging)} checked={this.state.facilityType === SdmsResource.facilityType.Untagging} /><label htmlFor="hscsType953">꼬리물기</label></li>);

		sensorTypeUI.push(<li key='sensorType_StealCard'><input type="radio" name="hscsType" id="hscsType954" onChange={() => this.onClickFacilityType(SdmsResource.facilityType.StealCard)} checked={this.state.facilityType === SdmsResource.facilityType.StealCard} /><label htmlFor="hscsType954">사원증 도용</label></li>);

		sensorTypeUI.push(<li key='sensorType_Stranger'><input type="radio" name="hscsType" id="hscsType955" onChange={() => this.onClickFacilityType(SdmsResource.facilityType.Stranger)} checked={this.state.facilityType === SdmsResource.facilityType.Stranger} /><label htmlFor="hscsType955">이상행위자</label></li>);

		sensorTypeUI.push(<li key='sensorType_EvasionItem'><input type="radio" name="hscsType" id="hscsType956" onChange={() => this.onClickFacilityType(SdmsResource.facilityType.EvasionItem)} checked={this.state.facilityType === SdmsResource.facilityType.EvasionItem} /><label htmlFor="hscsType956">무인 보안검색 회피</label></li>);

		sensorTypeUI.push(<li key='sensorType_NotPermittedPerson'><input type="radio" name="hscsType" id="hscsType957" onChange={() => this.onClickFacilityType(SdmsResource.facilityType.NotPermittedPerson)} checked={this.state.facilityType === SdmsResource.facilityType.NotPermittedPerson} /><label htmlFor="hscsType957">비인가 구역 출입</label></li>);

		sensorTypeUI.push(<li key='sensorType_NotPermittedItem'><input type="radio" name="hscsType" id="hscsType958" onChange={() => this.onClickFacilityType(SdmsResource.facilityType.NotPermittedItem)} checked={this.state.facilityType === SdmsResource.facilityType.NotPermittedItem} /><label htmlFor="hscsType958">비인가 구역 반입</label></li>);

		// sensorTypeUI.push(<li key='sensorType_CardTag'><input type="radio" name="hscsType" id="hscsType959" onChange={() => this.onClickFacilityType(SdmsResource.facilityType.CardTag)} checked={this.state.facilityType === SdmsResource.facilityType.CardTag} /><label htmlFor="hscsType959">사원증 태깅</label></li>);

		// sensorTypeUI.push(<li key='sensorType_SmartTag'><input type="radio" name="hscsType" id="hscsType960" onChange={() => this.onClickFacilityType(SdmsResource.facilityType.SmartTag)} checked={this.state.facilityType === SdmsResource.facilityType.SmartTag} /><label htmlFor="hscsType960">스마트태그 태깅</label></li>);

		// sensorTypeUI.push(<li key='sensorType_CardReader'><input type="radio" name="hscsType" id="hscsType961" onChange={() => this.onClickFacilityType(SdmsResource.facilityType.CardReader)} checked={this.state.facilityType === SdmsResource.facilityType.CardReader} /><label htmlFor="hscsType961">카드리더</label></li>);

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

	onChangeSearchText = (value) => {
		this.setState({ searchText: value });
	}

	searchEnterKey = () => {
		if (window.event && window.event.keyCode === 13) {
			this.onClickSearch();
		}
	}

	render() {
		const [buildingGroupUI, buildingUI, zoneUI] = this.getSpatialUI();
		const pageIndexUI = this.getPageIndexUI();
		const [gridUI, allChecked] = this.getGridData();
		const useAlarmMemo = this.useAlarmMemo();
		const sensorTypeUI = this.getSensorTypeUI();

		return (
			<>
				<div id={'hsty'}>
					<div className={'hsScr'}>
						<div id={'hsCont'}>
							<form action="">
								<div className={'hscSch'}>
									<dl>
										<dt>{i18n.t('history.formText.재난타입')}</dt>
										<dd>
											<ul className={'hscsRdo'}>
												<li><input type="radio" name="hscsType" id="hscsTypeAll" onChange={() => this.onClickFacilityType(-1)} checked={this.state.facilityType === -1} /> <label htmlFor="hscsTypeAll">{i18n.t('common.전체')}</label></li>
												{sensorTypeUI}
											</ul>
										</dd>
									</dl>
									<dl>
										<dt>{i18n.t('common.위치')}</dt>
										<dd>
											<ul className={'hscsLoc'}>
												<li>
													<select
														className="selWh"
														value={this.state.selectedBuildingGroupID ?? '-1'}
														onChange={(e) => this.onChangeBuildingGroup(e.target)}
													>
														{buildingGroupUI}
													</select>
												</li>
												<li>
													<select
														className="selWh"
														value={this.state.selectedBuildingID ?? '-1'}
														onChange={(e) => this.onChangeBuilding(e.target)}
													>
														{buildingUI}
													</select>
												</li>
												<li>
													<select
														className="selWh"
														value={this.state.selectedZoneID ?? '-1'}
														onChange={(e) => this.onChangeZone(e.target)}
													>
														{zoneUI}
													</select>
												</li>
											</ul>
										</dd>
									</dl>
									<dl>
										<dt>{i18n.t('history.formText.조회 기간')}</dt>
										<dd>
											<ul className={'hscsDate'}>
												<li>
													<div className={'datepicker'}>
														<DatePicker ref={this.refDatepicker01} name="datepicker01" id="datepicker01"
															dateFormat="yyyy-MM-dd"
															locale={i18n.language === "ko" ? ko : enUS}
															maxDate={new Date()}
															selected={this.state.beginDate}
															onChange={date => this.onChangeBegin(date)} />
														<img src={ProjectResource.styleMode === ProjectResource.StyleType.Soulbrain ? btnCalendarBk : btnCalendarBk_wonik} alt="" className={'btnCalendarBk'} onClick={this.onClickDatepicker01} />
													</div>
												</li>
												<li>~</li>
												<li>
													<div className={'datepicker'}>
														<DatePicker ref={this.refDatepicker02} name="datepicker02" id="datepicker02"
															dateFormat="yyyy-MM-dd"
															locale={i18n.language === "ko" ? ko : enUS}
															maxDate={new Date()}
															selected={this.state.endDate}
															onChange={date => this.onChangeEnd(date)} />
														<img src={ProjectResource.styleMode === ProjectResource.StyleType.Soulbrain ? btnCalendarBk : btnCalendarBk_wonik} alt="" className={'btnCalendarBk'} onClick={this.onClickDatepicker02} />
													</div>
												</li>
											</ul>
											<ul className={'hscsRdo'}>
												<li><input type="radio" name="hscsRdo" id="hscsRdo01" onChange={() => this.onClickDateType('select')} checked={this.state.dateType === 'select'} /><label htmlFor="hscsRdo01">{i18n.t('history.formText.기간선택')}</label></li>
												<li><input type="radio" name="hscsRdo" id="hscsRdo01" onChange={() => this.onClickDateType('today')} checked={this.state.dateType === 'today'} /><label htmlFor="hscsRdo01">{i18n.t('history.formText.오늘')}</label></li>
												<li><input type="radio" name="hscsRdo" id="hscsRdo02" onChange={() => this.onClickDateType('week')} checked={this.state.dateType === 'week'} /><label htmlFor="hscsRdo02">{i18n.t('history.formText.1주')}</label></li>
												<li><input type="radio" name="hscsRdo" id="hscsRdo03" onChange={() => this.onClickDateType('month')} checked={this.state.dateType === 'month'} /><label htmlFor="hscsRdo03">{i18n.t('history.formText.1개월')}</label></li>
												<li><input type="radio" name="hscsRdo" id="hscsRdo04" onChange={() => this.onClickDateType('year')} checked={this.state.dateType === 'year'} /><label htmlFor="hscsRdo04">{i18n.t('history.formText.1년')}</label></li>
											</ul>
										</dd>
									</dl>
									<dl>
										<dt>검색 조건</dt>
										<dd>
											<input type="text" name="" id="" value={this.state.searchText} onChange={(e) => this.onChangeSearchText(e.target.value)} onKeyUp={this.searchEnterKey} />
										</dd>
									</dl>
									{
										this.state.loadingIndicator === true
											? <a className={'hscsSbmt'} id={'hscsSbmting'}><span><span><CircularProgress className="spinner"/></span></span></a>
											: <a onClick={this.onClickSearch} className={'hscsSbmt'}><span><span>{i18n.t('history.formText.검색')}</span></span></a>
									}
								</div>
							</form>

							{
								this.state.loadingIndicator === true ?
									<ul className={'hscExl'}>
										{
											ProjectResource.SiteID === ProjectResource.Site.GG_A &&
												<li className={'report'}><a>보고서 다운로드</a></li>
										}
										<li><a className={'all'} id={'hscsSbmting'}>{i18n.t('history.formText.전체 다운로드')}</a></li>
										<li><a className={'exl'} id={'hscsSbmting'}>{i18n.t('history.formText.선택 다운로드')}</a></li>
									</ul>
									:
									<ul className={'hscExl'}>
										{
											ProjectResource.SiteID === ProjectResource.Site.GG_A &&
											<li className={'report'}><a onClick={() => this.onClickDownloadAlarmReport()}>보고서 다운로드</a></li>
										}
										<li><a onClick={() => this.onClickDownload()} className={'all'}>{i18n.t('history.formText.전체 다운로드')}</a></li>
										<li><a onClick={() => this.onClickSelectDownload()} className={'exl'}>{i18n.t('history.formText.선택 다운로드')}</a></li>
									</ul>
							}

							<div className={'hscTb'}>
								<div className={'scrTb'}>
									<table>
										<colgroup>
											<>
												<col style={{ width: '2%' }} />
												<col style={{ width: '5%' }} />
												<col style={{ width: '8%' }} />
												<col style={{ width: '8%' }} />
												<col style={{ width: '8%' }} />
												<col style={{ width: '12%' }} />
												<col style={{ width: '11%' }} />
												<col style={{ width: '5%' }} />
												<col style={{ width: '5%' }} />
												<col style={{ width: '5%' }} />
												<col style={{ width: '5%' }} />
												{
													(useAlarmMemo)
														? <React.Fragment><col style={{ width: '10%' }} /> <col style={{ width: '13%' }} /></React.Fragment>
														: <col style={{ width: '23%' }} />
												}
											</>
										</colgroup>
										<thead>
											<tr>
												<th><input type="checkbox" checked={allChecked} onChange={(e) => this.onCheckedRow(e.target.checked, -1)} /></th>
												<th>No.</th>
												<th>{i18n.t('history.formText.일시')}</th>
												<th>{i18n.t('history.formText.종료일시')}</th>
												<th>{i18n.t('history.formText.유형')}</th>
												<th>{i18n.t('history.formText.센서명')}</th>
												<th>{i18n.t('common.위치')}</th>
												<th>{i18n.t('history.formText.실제/테스트')}</th>
												<th>{i18n.t('history.formText.탐지 유형')}</th>
												<th>{i18n.t('history.formText.탐지 정보')}</th>
												<th>{i18n.t('history.formText.위기경보 단계')}</th>
												{
													(useAlarmMemo)
														? <React.Fragment><th>{i18n.t('history.formText.대응 SOP')}</th><th>{i18n.t('history.formText.메모')}</th></React.Fragment>
														: <th>{i18n.t('history.formText.대응 SOP')}</th>
												}
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
											<a className={'first'} onClick={() => this.setPageIndex(1)}>{i18n.t('history.formText.맨 앞')}</a>
											<a className={'prev'} onClick={() => this.setPageIndex(this.state.pageIndex - 1)}>{i18n.t('history.formText.이전')}</a>
											<ul>
												{pageIndexUI}
											</ul>
											<a className={'next'} onClick={() => this.setPageIndex(this.state.pageIndex + 1)}>{i18n.t('history.formText.다음')}</a>
											<a className={'last'} onClick={() => this.setPageIndex(this.state.maxPageIndex)}>{i18n.t('history.formText.맨 뒤')}</a>
										</div>
										: <> </>
								}
							</div>
						</div>
					</div>
				</div>
				{
					(this.state.popupMemoHistoryID !== null && this.state.popupMemoHistoryID > 0) ?
						<SensorDetectHistoryMemo fromHistoryMenu={true} setPopupMemo={this.setPopupMemo} actionStepHistoryID={this.state.popupMemoHistoryID} popupMemoContent={this.state.popupMemoContent} />
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

export default withTranslation()(SensorDetectHistory);