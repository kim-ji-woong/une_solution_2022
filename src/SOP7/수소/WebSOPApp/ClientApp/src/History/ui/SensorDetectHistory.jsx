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
import btnCalendarBk from '../../History/image/historyCalendar_icon.svg';
import btnCalendarBk_wonik from '../../Common/img/sub/dashboard_calendar_bk_wonik.png';

import CircularProgress from '@material-ui/core/CircularProgress';

import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/
import SensorDetectHistoryMemo from './popups/SensorDetectHistoryMemo';

import ProjectResource from '../../Root/resource/id';
import { i18n, withTranslation, i18nUtil } from '../../language/i18n';

import SDMSResource from '../../SDMS/resource/id';

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



			count: 0,			// 검색 결과 갯수
			maxPage: 1,			// 끝 페이지
			pageIdx: 1,			// 현재 페이지
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
		if (this.props.selectedSiteID) {
			if (this.props.selectedSiteID !== ProjectResource.Site.Hydrogen) {
				this.onClickSearch();
			}
		}

		/* $('.sensorTypeSelect').click(function () {
			$('.sensorTypeSelect').css({ border: "solid 1px #0085FF" });
		}); */

		$('.sensorDetectHSelect').click(function () {
			$('.sensorDetectOptionBox').toggle();
			$('.sensorDetectHSelect').css({ border: "solid 1px #0085FF" });
		});

		$('.sensorDetectHDaySelect').click(function () {
			$('.sensorDetectDayOptionBox').toggle();
			$('.sensorDetectHDaySelect').css({ border: "solid 1px #0085FF" });
		});

		/* $('.hscsDate').click(function () {
			$('.hscsDate').css({ border: "solid 1px #0085FF" });
		}); */

		$('.sensorDetectThirdOption').click(function () {
			$('.sensorDetectOptionBox').toggle();
		});

		$('.activeOption1').click(function () {
			$('.activeOption1').addClass('activeOption1Active');
		});

		$('.activeOption2').click(function () {
			$('.activeOption2').addClass('activeOption2Active');
		});

		$('.activeOption3').click(function () {
			$('.activeOption3').addClass('activeOption3Active');
		});
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.selectedSiteID !== this.props.selectedSiteID) {
			if (this.props.selectedSiteID !== ProjectResource.Site.Hydrogen) {
				this.onClickSearch();
			}
        }
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
		const [minID, maxID] = await HistoryController.GetMinMaxIndex(beginDate, endDate, facilityType, buildingGroupID, buildingID, zoneID);

		return [minID, maxID];
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

		//const [minID, maxID] = await this.getMinMaxIndex(beginDate, endDate, facilityType, buildingGroupID, buildingID, zoneID);
		const [minID, maxID] = await HistoryController.GetMinMaxIndex_Hydrogen(beginDate, endDate, facilityType, buildingID, zoneID);

		let maxPage = 1;

		let count = await HistoryController.GetCountIndex_Hydrogen(beginDate, endDate, facilityType, buildingID, zoneID);
		if (count > 0) {
			maxPage = Math.ceil(count / this.state.maxRowCount);
		}
		else {
			count = 0;
        }

		console.log('maxID' + maxID);

		const siteID = this.props.selectedSiteID;

		const [dataSource, currentLastID] = await HistoryController.DisplaySensorDetectHistories_Hydrogen2(
			beginDate, endDate, facilityType, buildingID, zoneID,
			0, this.state.maxRowCount * this.state.maxPageCount, siteID);

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
			searchZoneName = i18n.t('common.전체');
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
			havePrevPage, haveAfterPage,
			count, maxPage
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

		const [dataSource, currentLastID] = await HistoryController.DisplaySensorDetectHistories_Hydrogen(
			this.state.searchBeginDate, this.state.searchEndDate,
			this.state.searchFacilityType,
			this.state.searchBuildingID, this.state.searchZoneID,
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

		const [dataSource, currentLastID] = await HistoryController.DisplaySensorDetectHistories_Hydrogen(
			this.state.searchBeginDate, this.state.searchEndDate,
			this.state.searchFacilityType,
			this.state.searchBuildingID, this.state.searchZoneID,
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

	async onClickPrevAfterSearch(pageNum) {
		if (pageNum < 1 || pageNum > this.state.maxPage) {
			return;
        }

		// 조회 limit 구하기
		let searchLimit = (Math.floor((pageNum - 1) / this.state.maxPageCount) * this.state.maxPageCount) * this.state.maxRowCount;
		let searchRowCount = this.state.maxRowCount * this.state.maxPageCount;

		const [dataSource, currentLastID] = await HistoryController.DisplaySensorDetectHistories_Hydrogen2(
			this.state.searchBeginDate, this.state.searchEndDate,
			this.state.searchFacilityType,
			this.state.searchBuildingID, this.state.searchZoneID,
			searchLimit, searchRowCount, this.props.selectedSiteID
		);

		this.setState({ dataSource, pageIndex: pageNum });
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
		if (this.state.maxPage < index || index < 1) {
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

	onClickFacilityType = (e) => {
		const value = e.target.value;
		const num = Number(value);

		if (num !== NaN) {
			this.setState({ facilityType: num });
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
		//let columnRow = worksheet.addRow(['No', i18n.t('history.formText.일시'), i18n.t('history.formText.종료일시'), i18n.t('history.formText.유형'), i18n.t('history.formText.센서명'), i18n.t('common.위치'), i18n.t('history.formText.실제/테스트'), i18n.t('history.formText.탐지 유형'), i18n.t('history.formText.탐지 정보'), i18n.t('history.formText.위험경보 단계'), i18n.t('history.formText.대응 SOP'), i18n.t('history.formText.메모')]);
		let columnRow = worksheet.addRow(['No', i18n.t('history.formText.센서명'), i18n.t('history.formText.발생유형'), i18n.t('history.formText.위험경보 단계'), i18n.t('common.위치'), i18n.t('history.formText.실제/테스트'), i18n.t('history.formText.일시'), i18n.t('history.formText.종료일시'), i18n.t('history.formText.메모')]);
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
			{ key: "sensorName", width: 25 },
			{ key: "type", width: 15 },
			{ key: "alarmLevel", width: 15 },
			{ key: "zoneName", width: 30 },
			{ key: "realMode", width: 15 },
			{ key: "time", width: 20 },
			{ key: "endTime", width: 20 },
			{ key: "memo", width: 40 }
			//{ key: "type", width: 15 },
			//{ key: "detectType", width: 15 },
			//{ key: "detectInfo", width: 15 },			
			//{ key: "sopName", width: 20 },
			//{ key: "memo", width: 40 }
		];

		const [dataSource, currentLastID] = await HistoryController.DisplaySensorDetectHistories_Hydrogen2(
			this.state.searchBeginDate, this.state.searchEndDate, this.state.searchFacilityType
			, this.state.searchBuildingID, this.state.searchZoneID,
			-1, -1, this.props.selectedSiteID);

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
				const sensorName = i18nUtil.convertText(dataSource[i].sensorName);
				const type = dataSource[i].type;
				const alarmLevel = dataSource[i].alarmLevel;
				const zoneName = i18nUtil.convertText(dataSource[i].zoneName);
				const realMode = dataSource[i].realMode;
				const time = dataSource[i].time;
				const endTime = dataSource[i].endTime;
				const memo = dataSource[i].memo;
				//const type = this.state.dataSource[i].type;
				//const detectType = this.state.dataSource[i].detectType;
				//const detectInfo = this.state.dataSource[i].detectInfo;				
				//const sopName = this.state.dataSource[i].sopName;

				data.no = no;
				data.sensorName = sensorName;
				data.type = type;
				data.alarmLevel = alarmLevel;
				data.zoneName = zoneName;
				data.realMode = (realMode === '1') ? i18n.t('history.formText.실제') : i18n.t('history.formText.테스트');
				data.time = time;
				data.endTime = endTime;
				data.memo = (memo === null) ? '' : memo;
				//data.type = type;
				//data.detectType = detectType;
				//data.detectInfo = detectInfo;				
				//data.sopName = (sopName.length > 0) ? sopName : '-';

				arrDatas.push(data);
			}

			arrDatas.forEach(function (item, index) {
				worksheet.addRow({
					no: item.no,
					sensorName: item.sensorName,
					type: item.type,
					alarmLevel: item.alarmLevel,
					zoneName: item.zoneName,
					realMode: item.realMode,
					time: item.time,
					endTime: item.endTime,
					memo: item.memo
					//type: item.type,
					//detectType: item.detectType,
					//detectInfo: item.detectInfo,
					//sopName: item.sopName,
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
		//let columnRow = worksheet.addRow(['No', i18n.t('history.formText.일시'), i18n.t('history.formText.종료일시'), i18n.t('history.formText.유형'), i18n.t('history.formText.센서명'), i18n.t('common.위치'), i18n.t('history.formText.실제/테스트'), i18n.t('history.formText.탐지 유형'), i18n.t('history.formText.탐지 정보'), i18n.t('history.formText.위험경보 단계'), i18n.t('history.formText.대응 SOP'), i18n.t('history.formText.메모')]);
		let columnRow = worksheet.addRow(['No', i18n.t('history.formText.센서명'), i18n.t('history.formText.발생유형'), i18n.t('history.formText.위험경보 단계'), i18n.t('common.위치'), i18n.t('history.formText.실제/테스트'), i18n.t('history.formText.일시'), i18n.t('history.formText.종료일시'), i18n.t('history.formText.메모')]);
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
			{ key: "sensorName", width: 25 },
			{ key: "type", width: 15 },
			{ key: "alarmLevel", width: 15 },
			{ key: "zoneName", width: 30 },
			{ key: "realMode", width: 15 },
			{ key: "time", width: 20 },
			{ key: "endTime", width: 20 },
			{ key: "memo", width: 40 }
			//{ key: "type", width: 15 },					
			//{ key: "detectType", width: 15 },
			//{ key: "detectInfo", width: 15 },			
			//{ key: "sopName", width: 20 },
			//{ key: "memo", width: 40 }
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
				const sensorName = i18nUtil.convertText(this.state.dataSource[i].sensorName);
				const type = this.state.dataSource[i].type;
				const alarmLevel = this.state.dataSource[i].alarmLevel;
				const zoneName = i18nUtil.convertText(this.state.dataSource[i].zoneName);
				const realMode = this.state.dataSource[i].realMode;
				const time = this.state.dataSource[i].time;
				const endTime = this.state.dataSource[i].endTime;
				const memo = this.state.dataSource[i].memo;
				//const type = this.state.dataSource[i].type;											
				//const detectType = this.state.dataSource[i].detectType;
				//const detectInfo = this.state.dataSource[i].detectInfo;				
				//const sopName = this.state.dataSource[i].sopName;				

				data.no = no;
				data.sensorName = sensorName;
				data.type = type;
				data.alarmLevel = alarmLevel;
				data.zoneName = zoneName;
				data.realMode = (realMode === '1') ? i18n.t('history.formText.실제') : i18n.t('history.formText.테스트');
				data.time = time;
				data.endTime = endTime;
				data.memo = (memo === null) ? '' : memo;
				//data.type = type;												
				//data.detectType = detectType;
				//data.detectInfo = detectInfo;				
				//data.sopName = (sopName.length > 0) ? sopName : '-';
				
				arrDatas.push(data);
			}

			arrDatas.forEach(function (item, index) {
				worksheet.addRow({
					no: item.no,
					sensorName: item.sensorName,
					type: item.type,
					alarmLevel: item.alarmLevel,
					zoneName: item.zoneName,
					realMode: item.realMode,
					time: item.time,
					endTime: item.endTime,
					memo: item.memo
					//type: item.type,
					//detectType: item.detectType,
					//detectInfo: item.detectInfo,
					//sopName: item.sopName,
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
	getPageIndexUI = () => {
		let pageIndexUI = null;
		let ui = [];
		if (!this.state.dataSource) {
			return pageIndexUI;
		}

		const pageIndex = this.state.pageIndex;
		const maxPage = this.state.maxPage;
		const pageFirst = pageIndex === null ? null : Math.floor((pageIndex - 1) / this.state.maxPageCount) * this.state.maxPageCount + 1;

		if (pageIndex !== null && maxPage !== null) {
			for (let i = pageFirst; i < pageFirst + this.state.maxPageCount; i++) {
				if (i > maxPage)
					break;

				if (i === pageIndex)
					ui.push(<li key={'pageIndext_' + (i)} className={'on'}><a>{i}</a></li>);
				else
					ui.push(<li key={'pageIndext_' + (i)}><a onClick={() => this.setPageIndex(i)}>{i}</a></li>);
			}

			pageIndexUI =
			<div className={'hscNav'}>
				<a className={(pageFirst > 1 ? 'first' : 'firstDisable')} onClick={() => this.onClickPrevAfterSearch(1)}>{i18n.t('history.formText.맨 앞')}</a>
				<a className={(pageFirst > this.state.maxPageCount ? 'prev' : 'prevDisable')} onClick={() => this.onClickPrevAfterSearch(pageFirst - 1)}>{i18n.t('history.formText.이전')}</a>
					<ul>
						{ui}
					</ul>
				<a className={(pageFirst + this.state.maxPageCount <= maxPage ? 'next' : 'nextDisable')} onClick={() => this.onClickPrevAfterSearch(pageFirst + this.state.maxPageCount)}>{i18n.t('history.formText.다음')}</a>
				<a className={(pageFirst + this.state.maxPageCount <= maxPage ? 'last' : 'lastDisable')} onClick={() => this.onClickPrevAfterSearch(maxPage)}>{i18n.t('history.formText.맨 뒤')}</a>
			</div>;
		}
		
		return pageIndexUI;
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

		const pageFirst = Math.floor((this.state.pageIndex - 1) / this.state.maxPageCount) * this.state.maxPageCount + 1;

		// 데이터를 읽을 시작할 배열값
		let beginIndex = (this.state.pageIndex - pageFirst) * this.state.maxRowCount;
		
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
					<td>{/*dataSource[i].sensorZoneHistoryID*/i + 1}</td>
					<td>{i18nUtil.convertText(dataSource[i].sensorName)}</td>
					<td>{dataSource[i].type}</td>
					<td>{dataSource[i].alarmLevel}</td>
					<td>{i18nUtil.convertText(dataSource[i].zoneName)}</td>
						<td>{(dataSource[i].realMode === '0') ? i18n.t('history.formText.테스트') : i18n.t('history.formText.실제')}</td>
					<td>{dataSource[i].time}</td>
						<td>{dataSource[i].endTime}</td>
						<td style={{ position: 'relative' }}><span className={(dataSource[i].memo?.length > 0 ? 'memoActive' : 'memoDisable')} onClick={() => {
							if (dataSource[i].memo?.length > 0) {
								this.setPopupMemo(true, dataSource[i].sensorZoneHistoryID, dataSource[i].memo);
                            }							
						}}></span></td>
					{
						//(useAlarmMemo)
						//	?  <td onClick={() => this.setPopupMemo(true, dataSource[i].sensorZoneHistoryID, dataSource[i].memo)}>{dataSource[i].memo}</td>
						//	: <React.Fragment></React.Fragment>
					}
					{/*<td>{dataSource[i].sensorName}</td>*/}
					{/*<td>{dataSource[i].detectInfo}</td>*/}
					{/*<td>{dataSource[i].detectType}</td>*/}
					{/*<td className={sopLinkClassName} onClick={() => this.onLinkSOP(dataSource[i].actionStepHistoryID, dataSource[i].sopBeginTime)}>{(dataSource[i].sopName.length > 0) ? dataSource[i].sopName : '-'}</td>*/}
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

		buildingGroupUI.push(<option key={'buildingGroupOption_-1'} value="-1">{i18n.t('common.전체')}</option>);
		buildingUI.push(<option key={'buildingOption_-1'} value="-1">{i18n.t('common.전체')}</option>);
		zoneUI.push(<option key={'zoneOption_-1'} value="-1">{i18n.t('common.전체')}</option>);

		if (!this.props.buildingGroupList) {
			return [buildingGroupUI, buildingUI, zoneUI];
		}

		const buildingGroupLength = this.props.buildingGroupList.length;
		for (let i = 0; i < buildingGroupLength; i++) {
			const buildingGroup = this.props.buildingGroupList[i];

			// BuildingGroup 따로 구분 요소가 없다.
			//if (this.state.selectedBuildingGroupID === buildingGroup.id) {
				//buildingGroupUI.push(<option key={'buildingGroupOption_' + buildingGroup.id} value={buildingGroup.id} selected>{buildingGroup.displayText}</option>);

				const buildingLength = buildingGroup.buildingDatas.length;
				for (let j = 0; j < buildingLength; j++) {
					const building = buildingGroup.buildingDatas[j];
					if (this.state.selectedBuildingID === building.id) {
						buildingUI.push(<option key={'buildingOption_' + building.id} value={building.id}>{i18nUtil.convertText(building.displayText)}</option>);

						const zoneLength = building.zoneDatas.length;
						for (var k = 0; k < zoneLength; k++) {
							const zone = building.zoneDatas[k];
							//if (this.state.selectedZoneID === zone.id) {
							zoneUI.push(<option key={'zoneOption_' + zone.id} value={zone.id}>{i18nUtil.convertText(zone.displayText)}</option>);
							//}
							//else {
							//	zoneUI.push(<option key={'zoneOption_' + zone.id} value={zone.id}>{zone.displayText}</option>);
							//}
						}
					}
					else {
						buildingUI.push(<option key={'buildingOption_' + building.id} value={building.id}>{i18nUtil.convertText(building.displayText)}</option>);
					}
				}
			//}
			//else {
			//	buildingGroupUI.push(<option key={'buildingGroupOption_' + buildingGroup.id} value={buildingGroup.id}>{buildingGroup.displayText}</option>);
			//}
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

	render() {
		const [buildingGroupUI, buildingUI, zoneUI] = this.getSpatailUI();
		const pageIndexUI = this.getPageIndexUI();
		const [gridUI, allChecked] = this.getGridData();

		return (
			<>
				<div id={'hsty'}>
					<div className={'hsScr'}>
						<div id={'hsCont'}>
							<span className={'hsContTitle'}>{i18n.t('history.menu.이벤트 이력')}</span>

							<form action="">
								<div className={'hscSch'}>
									<ul className={'hscsHalf'}>
										<li>
											<dl>
												<dt>{i18n.t('history.formText.센서 유형')}</dt>
												<dd>
													<ul className={'hscsLoc2'}>
														<li>
														{/*<span className={'sensorTypeSelectTitle'}>{i18n.t('common.전체')}</span>*/}
															{/*<select className={'sensorTypeSelect'} onChange={(e) => this.onClickFacilityType(e)}>*/}
															<select name="" id="" className={'selWh'} onChange={(e) => this.onClickFacilityType(e)}>
																<option value={-1}>{i18n.t('common.전체')}</option>
																<option value={SDMSResource.facilityType.H2}>{i18n.t('facilityType.고농도수소')}</option>

																<option value={SDMSResource.facilityType.H2Low_Senko}>{i18n.t('facilityType.저농도수소')}</option>
																<option value={SDMSResource.facilityType.O2_Senko}>{i18n.t('facilityType.산소')}</option>

																<option value={SDMSResource.facilityType.PRESSURE_SENSOR}>{i18n.t('facilityType.압력')}</option>
																<option value={SDMSResource.facilityType.Temp}>{i18n.t('facilityType.온도')}</option>
																<option value={SDMSResource.facilityType.Flow}>{i18n.t('facilityType.유량')}</option>
																{/*<option value={SDMSResource.facilityType.GAS}>{i18n.t('facilityType.가스')}</option>*/}
																{/*<option value={SDMSResource.facilityType.Conductivity}>{i18n.t('facilityType.전도도')}</option>*/}

																<option value={SDMSResource.facilityType.H2JAG}>{i18n.t('facilityType.수소가스')}</option>
																<option value={SDMSResource.facilityType.O2JAG}>{i18n.t('facilityType.산소가스')}</option>

															</select>
														</li>
														{/*<span className={'selectBoxArrowDrop'}></span>*/}
													</ul>
												</dd>
											</dl>
										</li>
									</ul>
									<ul className={'hscsHalf'}>
										<li>
											<dl>
												<dt>{i18n.t('history.formText.위치')}</dt>
												<dd>
													<ul className={'hscsLoc'}>
														{/* buildingGroup 구분 요소가 없기 때문에 주석 */}
														{/*<li>*/}
														{/*	<select name="" id="" onChange={(e) => this.onChangeBuildingGroup(e.target)} className={'selWh'}>*/}
														{/*		{buildingGroupUI}*/}
														{/*	</select>*/}
														{/*</li>*/}
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
										</li>
									</ul>
									<ul className={'hscsHalf'}>
										<li>
											<dl className={'thirdDl'}>
												<dt>{i18n.t('history.formText.조회 기간')}</dt>
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
														<li><input type="radio" name="hscsRdo" id="hscsRdo00" onChange={() => this.onClickDateType('select')} checked={this.state.dateType === 'select'} /><label htmlFor="hscsRdo00">{i18n.t('history.formText.기간선택')}</label></li>
														<li><input type="radio" name="hscsRdo" id="hscsRdo01" onChange={() => this.onClickDateType('today')} checked={this.state.dateType === 'today'} /><label htmlFor="hscsRdo01">{i18n.t('history.formText.오늘')}</label></li>
														<li><input type="radio" name="hscsRdo" id="hscsRdo02" onChange={() => this.onClickDateType('week')} checked={this.state.dateType === 'week'} /><label htmlFor="hscsRdo02">{i18n.t('history.formText.1주')}</label></li>
														<li><input type="radio" name="hscsRdo" id="hscsRdo03" onChange={() => this.onClickDateType('month')} checked={this.state.dateType === 'month'} /><label htmlFor="hscsRdo03">{i18n.t('history.formText.1개월')}</label></li>
														<li><input type="radio" name="hscsRdo" id="hscsRdo04" onChange={() => this.onClickDateType('year')} checked={this.state.dateType === 'year'} /><label htmlFor="hscsRdo04">{i18n.t('history.formText.1년')}</label></li>
													</ul>
												</dd>
											</dl>
										</li>
									</ul>
									{
										this.state.loadingIndicator === true
											? <a className={'hscsSbmt'} id={'hscsSbmting'}><span><span><CircularProgress className="spinner" /></span></span></a>
											: <a onClick={this.onClickSearch} className={'hscsSbmt'}><span><span>{i18n.t('history.formText.검색')}</span></span></a>
									}
								</div>
							</form>
							{
								this.state.loadingIndicator === true ?
									<ul className={'hscExl'}>
										<li><a className={'all'} id={'hscsSbmting'}>{i18n.t('history.formText.전체 다운로드')}</a></li>
										<li><a className={'exl'} id={'hscsSbmting'}>{i18n.t('history.formText.선택 다운로드')}</a></li>
									</ul>
									:
									<ul className={'hscExl'}>
										<li><a onClick={() => this.onClickDownload()} className={'all'}>{i18n.t('history.formText.전체 다운로드')}</a></li>
										<li><a onClick={() => this.onClickSelectDownload()} className={'exl'}>{i18n.t('history.formText.선택 다운로드')}</a></li>
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
											<col style={{ width: '8%' }} />
											<col style={{ width: '18%' }} />
											<col style={{ width: '9%' }} />
											<col style={{ width: '15%' }} />
											<col style={{ width: '15%' }} />
											<col style={{ width: '7%' }} />
										</colgroup>
										<thead>
											<tr>
												<th><input type="checkbox" checked={allChecked} onChange={(e) => this.onCheckedRow(e.target.checked, -1)} /></th>
												<th>{i18n.t('history.formText.번호')}</th>
												<th>{i18n.t('history.formText.센서명')}</th>
												<th>{i18n.t('history.formText.발생유형')}</th>
												<th>{i18n.t('history.formText.단계')}</th>
												<th>{i18n.t('common.위치')}</th>
												<th>{i18n.t('history.formText.알람')}</th>
												<th>{i18n.t('history.formText.발생일시')}</th>
												<th>{i18n.t('history.formText.종료일시')}</th>
												<th>{i18n.t('history.formText.메모')}</th>
											</tr>
										</thead>
										<tbody>
											{
												<>
													{/* {sensorDetectHistoryTbodyUI} */}
													{/*
													<tr>
														<td><input type="checkbox" /></td>
														<td>01</td>
														<td>압력</td>
														<td>주의</td>
														<td>수처리 장치</td>
														<td>테스트</td>
														<td>2023-10-20 14:39:25</td>
														<td>2023-10-20 18:00:25</td>
														<td style={{ position: 'relative' }}><span className={'memoActive'}></span></td>
													</tr>
													*/}
													{gridUI}
												</>
											}
										</tbody>
									</table>
								</div>

								{pageIndexUI}

							</div>

						</div>
					</div>
				</div>
				{
					(this.state.popupMemoHistoryID !== null && this.state.popupMemoHistoryID > 0) ?
						<SensorDetectHistoryMemo fromHistoryMenu={true} setPopupMemo={this.setPopupMemo} actionStepHistoryID={this.state.popupMemoHistoryID} popupMemoContent={this.state.popupMemoContent} />
						: null
				}
			</>
		);
	}
}

export default withTranslation()(SensorDetectHistory);