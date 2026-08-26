//import { Button } from '@amcharts/amcharts4/core';
import React, { Component } from 'react';
import { getSearchMinDate } from '../util/searchDateLimit';
import $ from 'jquery';
import HistoryResource from "../resource/id";
import HistoryController from '../services/historyController';
import newStyles from '../../Common/css/newStyle.module.css';
import uneStyles from "../../Common/css/uneCommon.module.css";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko, enUS } from 'date-fns/esm/locale';
import btnCalendarBk from '../../Common/img/sub/dashboard_calendar_bk.png';
import btnCalendarBk_wonik from '../../Common/img/sub/dashboard_calendar_bk_wonik.png';

import CircularProgress from '@material-ui/core/CircularProgress';

import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/

import ProjectResource from '../../Root/resource/id';

import { UserHistoryComponent } from '../styled/SensorDetectHistoryStyled';
import { i18n, withTranslation, i18nUtil } from '../../language/i18n';


class UserHistory extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
			dataSource: null,			
			maxRowCount: 13, // 한 페이지에 보여줄 data row 수
			maxPageCount: 9, // 한번에 보여줄 페이지 개수
			pageIndex: 1,    // 현재 페이지
			maxPageIndex: 1, // 최대 페이지 Index			
			dateType: 'today',
			beginDate: new Date(),
			endDate: new Date(),

			filterType: 1,
			filterContent: '',

			loadingIndicator: false,

			prevProps: null,

			userHistoryTbodyUI: false,
			sensorDetectHistoryOptionUI: false,

			selectValue: [],
        }

		this.refDatepicker01 = React.createRef();
		this.refDatepicker02 = React.createRef();

		this.props = props;
		this.display = this.display.bind(this);
		this.onClickDownload = this.onClickDownload.bind(this);

		this.userHistoryTbodyhandleClick = this.userHistoryTbodyhandleClick.bind(this);
		this.detectHistoryOptionUIhandleClick = this.detectHistoryOptionUIhandleClick.bind(this);
		this.detectHistoryOptionUI2handleClick = this.detectHistoryOptionUI2handleClick.bind(this);
	}

	componentDidMount() {
		$('html, body').css({ 'display': 'block', 'height': '100%', 'overflow': 'hidden' });

		if (this.props.selectedSiteID) {
			if (ProjectResource.SiteID !== ProjectResource.Site.Hydrogen) {
				this.display();
			}
		}

		$('.locationSelect').click(function () {
			$('.locationSelect').css({ border: "solid 1px #00AFFF" });
		});

		$('.hscsDate').click(function () {
			$('.hscsDate').css({ border: "solid 1px #00AFFF" });
		});

		$('.sensorDetectHDaySelect').click(function () {
			$('.sensorDetectDayOptionBox').toggle();
			$('.sensorDetectHDaySelect').css({ border: "solid 1px #00AFFF" });
		});


		$('.sensorTypeSelect').click(function () {
			$('.sensorTypeSelect').css({ border: "solid 1px #00AFFF" });
		});

		$('.sensorDetectHSelect').click(function () {
			$('.sensorDetectOptionBox').toggle();
			$('.sensorDetectHSelect').css({ border: "solid 1px #00AFFF" });
		});

		$('.sensorDetectHDaySelect').click(function () {
			$('.sensorDetectDayOptionBox').toggle();
			$('.sensorDetectHDaySelect').css({ border: "solid 1px #00AFFF" });
		});

		$('.hscsDate').click(function () {
			$('.hscsDate').css({ border: "solid 1px #00AFFF" });
		});

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
			this.display();
		}
	}

	userHistoryTbodyhandleClick() {
		this.setState(prevState => ({
			userHistoryTbodyUIOn: !prevState.userHistoryTbodyUIOn,

		}));
	}

	detectHistoryOptionUIhandleClick() {
		this.setState(prevState => ({
			sensorDetectHistoryOptionUIOn: true,

		}));
	}

	detectHistoryOptionUI2handleClick() {
		this.setState(prevState => ({
			sensorDetectHistoryOptionUIOn: false,

		}));
	}

	async display() {
		if (ProjectResource.SiteID === ProjectResource.Site.Hydrogen) {
			this.userHistoryTbodyhandleClick();
			return;
		}

		$("body").css("cursor", "wait");

		const beginDate = this.getMakeDateTime(this.state.beginDate) + ' 00:00:00';
		const endDate = this.getMakeDateTime(this.state.endDate) + ' 23:59:59';

		if (beginDate > endDate) {
			$("body").css("cursor", "default");
			alert(i18n.t('조회 기간을 다시 선택하세요'));
			return;
		}

		await this.setState({ loadingIndicator: true })

		let dataSource = await HistoryController.DisplayUserHistories(beginDate, endDate, this.props.selectedSiteID);
		let datacount = dataSource.length;

		if (this.state.filterContent.length > 0) {
			let realDataSource = [];
			for (let i = 0; i < datacount; i++) {
				if (this.state.filterType === 1) {
					if (dataSource[i].name.indexOf(this.state.filterContent) >= 0) {
						realDataSource.push(dataSource[i]);
					}
				}
				else if (this.state.filterType === 2) {
					if (dataSource[i].level.indexOf(this.state.filterContent) >= 0) {
						realDataSource.push(dataSource[i]);
					}
				}
				else if (this.state.filterType === 3) {
					if (dataSource[i].teamName.indexOf(this.state.filterContent) >= 0) {
						realDataSource.push(dataSource[i]);
					}
				}
				else if (this.state.filterType === 4) {
					if (dataSource[i].targetType.indexOf(this.state.filterContent) >= 0) {
						realDataSource.push(dataSource[i]);
					}
				}
				else if (this.state.filterType === 5) {
					if (dataSource[i].actionType.indexOf(this.state.filterContent) >= 0) {
						realDataSource.push(dataSource[i]);
					}
				}
				else if (this.state.filterType === 6) {
					if (dataSource[i].historyContent.indexOf(this.state.filterContent) >= 0) {
						realDataSource.push(dataSource[i]);
					}
				}
			}

			dataSource = realDataSource;
			datacount = dataSource.length;
		}

		const value1 = parseInt(datacount / this.state.maxRowCount);
		const value2 = datacount % this.state.maxRowCount; // 나머지가 있는 경우 페이지 하나를 추가한다.
		let maxPageIndex = value1 + ((value2 > 0) ? 1 : 0);

		$("body").css("cursor", "default");

		this.setState({ dataSource, maxPageIndex, pageIndex: 1, loadingIndicator: false });
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

	setPageIndex(index) {
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
	
	onChangeFilterType = (value) => {
		this.setState({ filterType: Number(value) });
	}

	onChangeFilterContent = (value) => {
		this.setState({ filterContent: value });
	}

	searchEnterKey = () => {
		if (window.event && window.event.keyCode === 13) {
			this.display();
		}
	}

	onCheckedRow(checked, i) {
		const dataSource = this.state.dataSource;
		//const dataLength = dataSource.length;
		dataSource[i].checked = checked;

		this.setState({ dataSource });
    }

	async onClickDownload(isCheckedDownload) {
		const title = i18n.t('history.menu.데이터 수정 이력');

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet(title); // sheet 이름

		// title
		let titleRow = worksheet.getCell('A1');
		titleRow.value = title;

		titleRow.font = { name: '맑은 고딕', family: 4, size: 20, bold: true };		
		worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

		worksheet.mergeCells('A1:H2');
		worksheet.getCell('A1:H2').border = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' }
		}

		const beginDate = this.getMakeDateTime(this.state.beginDate);
		const endDate = this.getMakeDateTime(this.state.endDate);
		worksheet.addRow([i18n.t('history.formText.조회 기간') + ' : ' + beginDate + ' ~ ' + endDate]);

		// 빈칸
		worksheet.addRow([]);

		// column
		let columnRow = worksheet.addRow(['No', i18n.t('history.formText.일시'), i18n.t('history.formText.이름'), i18n.t('common.권한'), i18n.t('history.formText.소속'), i18n.t('history.formText.수정 데이터'), i18n.t('history.formText.수정 유형'), i18n.t('history.formText.내용')]);
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
			{ key: "name", width: 10 },
			{ key: "level", width: 15 },
			{ key: "teamName", width: 15 },
			{ key: "targetType", width: 15 },
			{ key: "actionType", width: 15 },
			{ key: "historyContent", width: 50 }
		];

		if (this.state.dataSource) {
			let arrDatas = [];
			const dataLength = this.state.dataSource.length;
			for (let i = 0; i < dataLength; i++) {
				const data = [];

				const checked = this.state.dataSource[i].checked;
				if (isCheckedDownload && !checked) {
					continue;
				}

				const no = arrDatas.length + 1;
				const time = this.state.dataSource[i].time;
				const name = this.state.dataSource[i].name;
				const level = this.state.dataSource[i].level;
				const teamName = this.state.dataSource[i].teamName;
				const targetType = this.state.dataSource[i].targetType;
				const actionType = this.state.dataSource[i].actionType;
				const historyContent = this.state.dataSource[i].historyContent;

				data.no = no;
				data.time = time;
				data.name = name;
				data.level = level;
				data.teamName = teamName;
				data.targetType = targetType;
				data.actionType = actionType;
				data.historyContent = historyContent;

				arrDatas.push(data);
			}

			arrDatas.forEach(function (item, index) {
				worksheet.addRow({
					no: item.no,
					time: item.time,
					name: item.name,
					level: item.level,
					teamName: item.teamName,
					targetType: item.targetType,
					actionType: item.actionType,
					historyContent: item.historyContent
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

			pageArr.push(index);
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

		// 정렬
		pageArr.sort(function (a, b) { if (a > b) return 1; if (a === b) return 0; if (a < b) return -1; }); 

		for (let i = 0; i < pageArr.length; i++) {
			let pageIndex = pageArr[i];
			if (pageIndex === this.state.pageIndex) {
				ui.push(<li key={'pageIndex_' + (pageIndex)} className={'on'}><a onClick={() => this.setPageIndex(pageIndex)}>{pageIndex}</a></li>);
			}
			else {
				ui.push(<li key={'pageIndex_' + (pageIndex)}><a onClick={() => this.setPageIndex(pageIndex)}>{pageIndex}</a></li>);
            }
		}

		return ui;
    }

	getGridData() {
		let ui = [];
		if (!this.state.dataSource) {
			return ui;
		}

		const dataSource = this.state.dataSource;
		const datacount = dataSource.length;

		// 데이터를 읽을 시작할 배열값
		let beginIndex = 0;
		if (this.state.pageIndex > 1) {
			beginIndex = (this.state.pageIndex - 1) * this.state.maxRowCount; 
		}

		for (let i = beginIndex; i < beginIndex + this.state.maxRowCount; i++) {
			if (datacount < i + 1) {
				break;
            }

			ui.push(<tr key={'dataSource_' + (i)}>
						<td><input type="checkbox" checked={dataSource[i].checked} onChange={(e) => this.onCheckedRow(e.target.checked, i)} /></td>
						<td>{i + 1}</td>
						<td>{dataSource[i].time}</td>
						<td>{dataSource[i].name}</td>
						<td>{dataSource[i].level}</td>
						<td>{dataSource[i].teamName}</td>
						<td>{dataSource[i].targetType}</td>
						<td >{dataSource[i].actionType}</td>
						<td style={{ textAlign: 'left' }}>{dataSource[i].historyContent}</td>
					</tr>);
        }
		
		return ui;
	}

	onClickDatepicker01 = () => {
		this.refDatepicker01.current.setOpen(true);
	}

	onClickDatepicker02 = () => {
		this.refDatepicker02.current.setOpen(true);
	}

	getUserHistoryTbodyUI = () => {
		let userHistoryTbodyUI = [];

		if (this.state.userHistoryTbodyUIOn === true) {
			if (i18n.language.toString() === "ko") {
				userHistoryTbodyUI.push(
					<>
						<tr>
							<td><input type="checkbox" /></td>
							<td>01</td>
							<td>압력</td>
							<td>COMP10264</td>
							<td>공급</td>
							<td>2023-10-20 14:39:55</td>
							<td>토출 압력이 낮음</td>
							<td>오래된 흡입필터가 원인으로, 필터 엘리먼트 교체</td>
							<td>Kai Oehring</td>
						</tr>
					</>
				)
			} else {
				userHistoryTbodyUI.push(
					<>
						<tr>
							<td><input type="checkbox" /></td>
							<td>01</td>
							<td>pressure</td>
							<td>COMP10264</td>
							<td>Supply</td>
							<td>2023-10-20 14:39:55</td>
							<td>The pressure has risen above the normal range.</td>
							<td>Rear end of hydrogen production compressor</td>
							<td>Kai Oehring</td>
						</tr>
					</>
				)
			}
		}
		return userHistoryTbodyUI;
	}


	getSensorDetectHistoryOptionUI = () => {
		let sensorDetectHistoryOptionUI = [];

		if (this.state.sensorDetectHistoryOptionUIOn === true) {
			if (i18n.language.toString() === "ko") {
				sensorDetectHistoryOptionUI.push(
					<>
						<div name="" id="" onChange={(e) => this.onChangeBuilding(e.target)} className={'sensorDetectSecondOption'}>
							<span key={'buildingOption_-1'} value="-1">전체</span>
							<span>전기분해기 생산 수소 공급</span>
							<span>수소 트레일러용 하역 터미널</span>
							<span>질소 정화 시스템</span>
							<span className={'activeOption2'} onClick={(e) => this.setSelectValue(e.target)}>압력용기</span>
							<span>압축기</span>
							<span>냉각 시스템</span>
							<span>디스펜서</span>
						</div>

						<div name="" id="" onChange={(e) => this.onChangeZone(e.target)} className={'sensorDetectThirdOption'}>
							<span key={'zoneOption_-1'} value="-1">전체</span>
							<span className={'activeOption3'} onClick={(e) => this.setSelectValue(e.target)}>중압 압력용기1</span>
							<span>중압 압력용기2</span>
							<span>중압 압력용기3</span>
							<span>고압 압력용기1</span>
							<span>고압 압력용기2</span>
							<span>고압 압력용기3</span>
							<span>고압 압력용기4</span>
							<span>고압 압력용기5</span>
						</div>
					</>
				)

			} else if (i18n.language.toString() === "en") {
				sensorDetectHistoryOptionUI.push(
					<>
						<div name="" id="" onChange={(e) => this.onChangeBuilding(e.target)} className={'sensorDetectSecondOption'}>
							<span key={'buildingOption_-1'} value="-1">Entire</span>
							<span>Electrolyzer Production Hydrogen Supply</span>
							<span>Unloading-Terminal Tube Trailer</span>
							<span>N₂ Purging System</span>
							<span className={'activeOption2'} onClick={(e) => this.setSelectValue(e.target)}>Medium Pressure Vessel</span>
							<span>High Pressure Vessel</span>
							<span>Cooling System</span>
							<span>Dispenser</span>
						</div>

						<div name="" id="" onChange={(e) => this.onChangeZone(e.target)} className={'sensorDetectThirdOption'}>
							<span key={'zoneOption_-1'} value="-1">Entire</span>
							<span className={'activeOption3'} onClick={(e) => this.setSelectValue(e.target)}>MP Vessel 1</span>
							<span>MP Vessel 2</span>
							<span>MP Vessel 3</span>
							<span>HP Vessel 1</span>
							<span>HP Vessel 2</span>
							<span>HP Vessel 3</span>
							<span>HP Vessel 4</span>
							<span>HP Vessel 5</span>
						</div>
					</>
				);
			}
		} else if (this.state.sensorDetectHistoryOptionUIOn === false) {
			if (i18n.language.toString() === "ko") {
				sensorDetectHistoryOptionUI.push(
					<>
						<div name="" id="" onChange={(e) => this.onChangeBuilding(e.target)} className={'sensorDetectSecondOption'}>
							<span key={'buildingOption_-1'} value="-1">전체</span>
							<span className={'activeOption2'} onClick={(e) => this.setSelectValue(e.target)}>전기분해기</span>
						</div>

						<div name="" id="" onChange={(e) => this.onChangeZone(e.target)} className={'sensorDetectThirdOption'}>
							<span key={'zoneOption_-1'} value="-1">전체</span>
							<span className={'activeOption3'} onClick={(e) => this.setSelectValue(e.target)}>수처리 장치</span>
							<span>수질 정화용 압력용기</span>
							<span>냉각용 열교환기</span>
							<span>냉각용 펌프</span>
							<span>냉각용 압력용기</span>
							<span>질소 정화 시스템</span>
							<span>ELY 모듈</span>
							<span>드라이어</span>
							<span>압력용기</span>
						</div>
					</>
				);
			} else if (i18n.language.toString() === "en") {
				sensorDetectHistoryOptionUI.push(
					<>
						<div name="" id="" onChange={(e) => this.onChangeBuilding(e.target)} className={'sensorDetectSecondOption'}>
							<span key={'buildingOption_-1'} value="-1">Entire</span>
							<span className={'activeOption2'} onClick={(e) => this.setSelectValue(e.target)}>Electrolyzer</span>
						</div>

						<div name="" id="" onChange={(e) => this.onChangeZone(e.target)} className={'sensorDetectThirdOption'}>
							<span key={'zoneOption_-1'} value="-1">Entire</span>
							<span className={'activeOption3'} onClick={(e) => this.setSelectValue(e.target)}>WaterTreatmentDevice</span>
							<span>PressureVesselForWaterPurification</span>
							<span>Cooling Heat Exchanger</span>
							<span>Cooling Pump</span>
							<span>Cooling Pressure Vessel</span>
							<span>N₂Purging System</span>
							<span>Ely Module</span>
							<span>Dryer</span>
							<span>Pressure Vessel</span>
						</div>
					</>
				);

			}
		}

		return sensorDetectHistoryOptionUI;
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
		const pageIndexUI = this.getPageIndexUI();
		const gridUI = this.getGridData();
		const userHistoryTbodyUI = this.getUserHistoryTbodyUI();
		const sensorDetectHistoryOptionUI = this.getSensorDetectHistoryOptionUI();
		const selectValue = this.state.selectValue;

        return (			
			<div id={'hsty'}>
				<div className={'hsScr'}>
					<div id={'hsCont'}>
						<form action="">
							<div className={'hscSch'}>
								<dl>
									{
										ProjectResource.styleMode !== ProjectResource.StyleType.Hydrogen &&
										<dt>{i18n.t('history.formText.조회 기간')}</dt>
									}
									<dd>
										{
											ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen
												? <>
													<dl>
														<dd>
															{/* <span className={'locationSelectTitle'}>{i18n.t('common.위치')}</span>
															<select name="" id="" onChange={(e) => this.onChangeRealMode(e.target.value)} className={'locationSelect'}>
																<option value="전체">All</option>
																<option value="훈련">B</option>
																<option value="실제">C</option>
															</select> */}
															<ul className={'hscsLoc'}>
																<span className={'locationTypeSelectTitle'}>{i18n.t('common.위치')}</span>
																<div className={'sensorDetectHSelect'}>
																	<p>
																		{
																			selectValue.length > 0 &&
																			selectValue.map((data, index) => <span id={'select' + index}>{data}</span>)
																		}
																	</p>
																</div>
																<div className={'sensorDetectOptionBox'} style={{ display: 'none' }}>
																	<div name="" id="" onChange={(e) => this.onChangeBuildingGroup(e.target)} className={'sensorDetectFirstOption'}>
																		<span key={'buildingGroupOption_-1'} value="-1">{i18n.t('common.전체')}</span>
																		<span className={'activeOption1'} onClick={(e) => this.setSelectValue(e.target)}><p onClick={this.detectHistoryOptionUI2handleClick}>{i18n.language === "ko" ? '생산' : 'production'}</p></span>
																		<span onClick={(e) => this.setSelectValue(e.target)}><p onClick={this.detectHistoryOptionUIhandleClick}>{i18n.language === "ko" ? '공급' : 'Supply'}</p></span>
																	</div>

																	{sensorDetectHistoryOptionUI}

																</div>
																<span className={'selectBoxArrowDrop'}></span>
															</ul>
														</dd>
													</dl>
												</>
												: <>
													<ul className={'hscsDate'}>
														<li>
															<div className={'datepicker'}>
																<DatePicker ref={this.refDatepicker01} name="datepicker01" id="datepicker01"
																	dateFormat="yyyy-MM-dd"
																	locale={i18n.language === "ko" ? ko : enUS}
																	showYearDropdown // 년도 드롭다운 활성화
																	showMonthDropdown // 월 드롭다운 활성화
																	maxDate={new Date()} minDate={getSearchMinDate()}
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
																	showYearDropdown // 년도 드롭다운 활성화
																	showMonthDropdown // 월 드롭다운 활성화
																	maxDate={new Date()} minDate={getSearchMinDate()}
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
												</>

										}
									</dd>
								</dl>
								<dl>
									<dd>
										{
											ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen &&
											<>
												<span className={'InquiryPeriodSelectTitle'}>{i18n.t('history.formText.조회기간 지정')}</span>
												<ul className={'hscsDate'}>
													<li>
														<div className={'datepicker'}>
															<DatePicker ref={this.refDatepicker01} name="datepicker01" id="datepicker01"
																dateFormat="yyyy-MM-dd"
																locale={i18n.language === "ko" ? ko : enUS}
																showYearDropdown // 년도 드롭다운 활성화
																showMonthDropdown // 월 드롭다운 활성화
																maxDate={new Date()} minDate={getSearchMinDate()}
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
																showYearDropdown // 년도 드롭다운 활성화
																showMonthDropdown // 월 드롭다운 활성화
																maxDate={new Date()} minDate={getSearchMinDate()}
																selected={this.state.endDate}
																onChange={date => this.onChangeEnd(date)} />
															<img src={ProjectResource.styleMode === ProjectResource.StyleType.Soulbrain ? btnCalendarBk : btnCalendarBk_wonik} alt="" className={'btnCalendarBk'} onClick={this.onClickDatepicker02} />
														</div>
													</li>
												</ul>
											</>
										}
									</dd>
								</dl>
								<dl>
									{
										ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen
											? <>
												<dl>
													<dd>
														<ul className={'hscsDay'}>
															<span className={'dateTypeChiceTitle'}>{i18n.t('history.formText.조회기간 지정')}</span>
															<select className={'sensorDetectHDaySelect'} onChange={(e) => this.onClickDateType(e.target.value)}>
																<option value='today'>{i18n.t('history.formText.오늘')}</option>
																<option value='week'>{i18n.t('history.formText.1주')}</option>
																<option value='month'>{i18n.t('history.formText.1개월')}</option>
																<option value='year'>{i18n.t('history.formText.1년')}</option>
															</select>
															<span className={'selectBoxArrowDrop'}></span>
														</ul>
													</dd>
												</dl>
											</>
											: <>
												<dt>{i18n.t('history.formText.검색어')}</dt>
												<dd>
													<div className={'hscsIpt'}>
														<select name="" id="" className={'selWh'} onChange={(e) => this.onChangeFilterType(e.target.value)} value={this.state.filterType}>
															<option value={1}>{i18n.t('history.formText.이름')}</option>
															<option value={2}>{i18n.t('common.권한')}</option>
															<option value={3}>{i18n.t('history.formText.소속')}</option>
															<option value={4}>{i18n.t('history.formText.수정 데이터')}</option>
															<option value={5}>{i18n.t('history.formText.수정 유형')}</option>
															<option value={6}>{i18n.t('history.formText.내용')}</option>
														</select>
														<input type="text" name="" id="" value={this.state.filterContent} onChange={(e) => this.onChangeFilterContent(e.target.value)} onKeyUp={this.searchEnterKey} />
													</div>
												</dd>
											</>
									}
								</dl>
								{
									this.state.loadingIndicator === true
										? <a className={'hscsSbmt'} id={'hscsSbmting'}><span><span><CircularProgress className="spinner" /></span></span></a>
										: <a onClick={this.display} className={'hscsSbmt'}><span><span>{i18n.t('history.formText.검색')}</span></span></a>
								}
								{/*<a onClick={this.userHistoryTbodyhandleClick} className={'hscsSbmt'}><span><span>{i18n.t('history.formText.검색')}</span></span></a>*/}
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
									<li><a onClick={() => this.onClickDownload(false)} className={'all'}>{i18n.t('history.formText.전체 다운로드')}</a></li>
									<li><a onClick={() => this.onClickDownload(true)} className={'exl'}>{i18n.t('history.formText.선택 다운로드')}</a></li>
								</ul>
						}

						<div className={'hscTb'}>
							<div className={'scrTb'}>
								<table>
									<colgroup>
										{
											ProjectResource.SiteID === ProjectResource.Site.Hydrogen
												? <>
													<col style={{ width: '5%' }} />
													<col style={{ width: '5%' }} />
													<col style={{ width: '10%' }} />
													<col style={{ width: '10%' }} />
													<col style={{ width: '10%' }} />
													<col style={{ width: '10%' }} />
													<col style={{ width: '20%' }} />
													<col style={{ width: '20%' }} />
													<col style={{ width: '10%' }} />
												</>
												: <>
													<col style={{ width: '5%' }} />
													<col style={{ width: '5%' }} />
													<col style={{ width: '10%' }} />
													<col style={{ width: '10%' }} />
													<col style={{ width: '10%' }} />
													<col style={{ width: '10%' }} />
													<col style={{ width: '10%' }} />
													<col style={{ width: '10%' }} />
													<col style={{ width: '30%' }} />
												</>
										}
									</colgroup>
									<thead>
										<tr>
											{
												ProjectResource.SiteID === ProjectResource.Site.Hydrogen
													? i18n.language.toString() === "ko"
														? <>
															<th><input type="checkbox" /></th>
															<th>번호</th>
															<th>설비명</th>
															<th>설비관리번호</th>
															<th>위치</th>
															<th>발생일시</th>
															<th>고장내용</th>
															<th>수리내용</th>
															<th>담당자</th>
														</>
														: <>
															<th><input type="checkbox" /></th>
															<th>No</th>
															<th>Facility ID</th>
															<th>Facility management No</th>
															<th>Location</th>
															<th>Time of Occurrence</th>
															<th>Breakdown Details</th>
															<th>Repair details</th>
															<th>Person in charge</th>
														</>
													: <>
														<th><input type="checkbox" /></th>
														<th>No.</th>
														<th>{i18n.t('history.formText.일시')}</th>
														<th>{i18n.t('history.formText.이름')}</th>
														<th>{i18n.t('common.권한')}</th>
														<th>{i18n.t('history.formText.소속')}</th>
														<th>{i18n.t('history.formText.수정 데이터')}</th>
														<th>{i18n.t('history.formText.수정 유형')}</th>
														<th>{i18n.t('history.formText.내용')}</th>
													</>
											}
										</tr>
									</thead>
									<tbody>
										{
											ProjectResource.SiteID === ProjectResource.Site.Hydrogen
												? <>
													{userHistoryTbodyUI}
												</>
												: <>
													{gridUI}
												</>
										}
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
        );
    }
}

export default withTranslation()(UserHistory);