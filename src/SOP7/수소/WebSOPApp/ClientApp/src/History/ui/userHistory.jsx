//import { Button } from '@amcharts/amcharts4/core';
import React, { Component } from 'react';
import $ from 'jquery';
import HistoryResource from "../resource/id";
import HistoryController from '../services/historyController';
import newStyles from '../../Common/css/newStyle.module.css';
import uneStyles from "../../Common/css/uneCommon.module.css";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko, enUS } from 'date-fns/esm/locale';
import btnCalendarBk from '../../History/image/historyCalendar_icon.svg';
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
			selectedFacility: i18nUtil.convertText('{"ko": "전체", "en": "All"}'),

			historyData: [],
			displayData: [],
        }

		this.refDatepicker01 = React.createRef();
		this.refDatepicker02 = React.createRef();

		this.props = props;
		this.display = this.display.bind(this);
		this.onClickDownload = this.onClickDownload.bind(this);

		this.userHistoryTbodyhandleClick = this.userHistoryTbodyhandleClick.bind(this);
		this.detectHistoryOptionUIhandleClick = this.detectHistoryOptionUIhandleClick.bind(this);
		this.detectHistoryOptionUI2handleClick = this.detectHistoryOptionUI2handleClick.bind(this);

		this.initData();
	}

	initData = () => {
		let historyData = [];

		let now = new Date();
		const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

		now.setHours(6);
		now.setMinutes(1);
		let data = {
			name: '{"ko": "디스펜서", "en": "e디스펜서"}',
			management: '디스펜서 1-1',
			location: '{"ko": "컨테이너3", "en": "e컨테이너3"}',
			date: now,
			details: '{"ko": "냉각기 압력 이상", "en": "e냉각기 압력 이상"}',
			repair: '{"ko": "센서 이상 확인", "en": "e센서 이상 확인"}',
			inspector: 'Kai Oehring'
		}
		historyData.push(data);

		now = new Date();
		now.setHours(6);
		now.setMinutes(25);
		data = {
			name: '{"ko": "중압 컴프레서", "en": "e중압 컴프레서"}',
			management: '전기분해기 1-3',
			location: '{"ko": "컨테이너1", "en": "e컨테이너1"}',
			date: now,
			details: '{"ko": "중압 컴프레서 압력 이상", "en": "e중압 컴프레서 압력 이상"}',
			repair: '{"ko": "설비 이상 확인", "en": "e설비 이상 확인"}',
			inspector: 'Kai Oehring'
		}
		historyData.push(data);

		//now = new Date();
		//now.setHours(6);
		//now.setMinutes(55);
		//data = {
		//	name: '{ "ko":"디스펜서", "en":"Dispenser"}',
		//	management: 'COMP10264',
		//	location: '{"ko": "공급", "en": "Supply"}',
		//	date: now,
		//	details: '{"ko": "토출 압력이 낮음", "en": "The pressure has risen above the normal range."}',
		//	repair: '{"ko": "오래된 흡입필터가 원인으로, 필터 엘리먼트 교체", "en": "Rear end of hydrogen production compressor"}',
		//	inspector: 'Kai Oehring'
		//}
		//historyData.push(data);

		//now = new Date();
		//now.setHours(7);
		//now.setMinutes(13);
		//data = {
		//	name: '{"ko": "컴프레서", "en": "Compressor"}',
		//	management: 'COMP10264',
		//	location: '{"ko": "공급", "en": "Supply"}',
		//	date: now,
		//	details: '{"ko": "토출 압력이 낮음", "en": "The pressure has risen above the normal range."}',
		//	repair: '{"ko": "오래된 흡입필터가 원인으로, 필터 엘리먼트 교체", "en": "Rear end of hydrogen production compressor"}',
		//	inspector: 'Kai Oehring'
		//}
		//historyData.push(data);

		//now = new Date();
		//now.setHours(7);
		//now.setMinutes(55);
		//data = {
		//	name: '{ "ko":"디스펜서", "en":"Dispenser"}',
		//	management: 'COMP10264',
		//	location: '{"ko": "공급", "en": "Supply"}',
		//	date: now,
		//	details: '{"ko": "토출 압력이 낮음", "en": "The pressure has risen above the normal range."}',
		//	repair: '{"ko": "오래된 흡입필터가 원인으로, 필터 엘리먼트 교체", "en": "Rear end of hydrogen production compressor"}',
		//	inspector: 'Kai Oehring'
		//}
		//historyData.push(data);

		//now = new Date();
		//now.setHours(8);
		//now.setMinutes(24);
		//data = {
		//	name: '{"ko": "컴프레서", "en": "Compressor"}',
		//	management: 'COMP10264',
		//	location: '{"ko": "공급", "en": "Supply"}',
		//	date: now,
		//	details: '{"ko": "토출 압력이 낮음", "en": "The pressure has risen above the normal range."}',
		//	repair: '{"ko": "오래된 흡입필터가 원인으로, 필터 엘리먼트 교체", "en": "Rear end of hydrogen production compressor"}',
		//	inspector: 'Kai Oehring'
		//}
		//historyData.push(data);

		//now = new Date();
		//now.setHours(8);
		//now.setMinutes(44);
		//data = {
		//	name: '{"ko": "컴프레서", "en": "Compressor"}',
		//	management: 'COMP10264',
		//	location: '{"ko": "공급", "en": "Supply"}',
		//	date: now,
		//	details: '{"ko": "토출 압력이 낮음", "en": "The pressure has risen above the normal range."}',
		//	repair: '{"ko": "오래된 흡입필터가 원인으로, 필터 엘리먼트 교체", "en": "Rear end of hydrogen production compressor"}',
		//	inspector: 'Kai Oehring'
		//}
		//historyData.push(data);

		this.state.historyData = historyData;
	}

	componentDidMount() {
		$('html, body').css({ 'display': 'block', 'height': '100%', 'overflow': 'hidden' });

		if (this.props.selectedSiteID) {
			if (ProjectResource.SiteID !== ProjectResource.Site.Hydrogen) {
				this.display();
			}
		}
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
		let beginDate = this.state.beginDate
		let endDate = this.state.endDate;

		beginDate.setHours(0);
		beginDate.setMinutes(0);
		beginDate.setSeconds(0);

		endDate.setHours(23);
		endDate.setMinutes(59);
		endDate.setSeconds(59);

		if (beginDate > endDate) {
			alert(i18n.t('조회 기간을 다시 선택하세요'));
			return;
		}

		const selectedFacility = this.state.selectedFacility;

		const all = i18nUtil.convertText('{"ko": "전체", "en": "All"}');

		const displayData = [];
		const historyData = this.state.historyData;

		for (let i = 0; i < historyData.length; i++) {
			const data = historyData[i];
			const facility = i18nUtil.convertText(data.name);

			if (data.date < beginDate || data.date > endDate) {
				continue;
			}
			else if (selectedFacility !== all && selectedFacility !== facility) {
				continue;
			}

			displayData.push(data);
		}

		this.setState({ displayData });
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
		const displayData = this.state.displayData;

		if (i === -1) {
			for (let j = 0; j < displayData?.length; j++) {
				displayData[j].checked = checked;
			}
		}
		else {
			displayData[i].checked = checked;
		}

		this.setState({ displayData });
    }

	async onClickDownload(isCheckedDownload) {
		const title = i18n.t('history.menu.고장 이력');

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
		let columnRow = worksheet.addRow(['No', i18n.t('history.formText.설비명'), i18n.t('history.formText.설비관리번호'), i18n.t('history.formText.위치'), i18n.t('history.formText.발생일시'), i18n.t('history.formText.고장내용'), i18n.t('history.formText.수리내용'), i18n.t('history.formText.담당자')]);
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
			{ key: "name", width: 20 },
			{ key: "management", width: 20 },
			{ key: "location", width: 10 },
			{ key: "date", width: 15 },
			{ key: "details", width: 15 },
			{ key: "repair", width: 15 },
			{ key: "inspector", width: 15 }
		];

		if (this.state.displayData) {
			let arrDatas = [];
			const dataLength = this.state.displayData.length;
			for (let i = 0; i < dataLength; i++) {
				const data = [];

				const checked = this.state.displayData[i].checked;
				if (isCheckedDownload && !checked) {
					continue;
				}

				const now = this.state.displayData[i].date;
				const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

				const no = arrDatas.length + 1;
				const name = i18nUtil.convertText(this.state.displayData[i].name);
				const management = i18nUtil.convertText(this.state.displayData[i].management);
				const location = i18nUtil.convertText(this.state.displayData[i].location);
				const date = formatted;
				const details = i18nUtil.convertText(this.state.displayData[i].details);
				const repair = i18nUtil.convertText(this.state.displayData[i].repair);
				const inspector = i18nUtil.convertText(this.state.displayData[i].inspector);

				data.no = no;
				data.name = name;
				data.management = management;
				data.location = location;
				data.date = date;
				data.details = details;
				data.repair = repair;
				data.inspector = inspector;

				arrDatas.push(data);
			}

			arrDatas.forEach(function (item, index) {
				worksheet.addRow({
					no: item.no,
					name: item.name,
					management: item.management,
					location: item.location,
					date: item.date,
					details: item.details,
					repair: item.repair,
					inspector: item.inspector
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
		let allChecked = true;

		const displayData = this.state.displayData;

		for (let i = 0; i < displayData?.length; i++) {
			const data = displayData[i];

			const now = data.date;
			const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

			if (allChecked && !displayData[i].checked) {
				allChecked = false;
			}

			userHistoryTbodyUI.push(
				<tr>
					<td><input type="checkbox" checked={displayData[i].checked} onChange={(e) => this.onCheckedRow(e.target.checked, i)} /></td>
					<td>{i + 1}</td>
					<td>{i18nUtil.convertText(data.name)}</td>
					<td>{i18nUtil.convertText(data.management)}</td>
					<td>{i18nUtil.convertText(data.location)}</td>
					<td>{formatted}</td>
					<td>{i18nUtil.convertText(data.details)}</td>
					<td>{i18nUtil.convertText(data.repair)}</td>
					<td>{i18nUtil.convertText(data.inspector)}</td>
				</tr>
			);
		}

		return [userHistoryTbodyUI, allChecked];
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

	handleChange = (e) => {
		this.setState({ selectedFacility: e.target.value });
	};

	render() {
		const pageIndexUI = this.getPageIndexUI();
		const gridUI = this.getGridData();
		const [userHistoryTbodyUI, allChecked] = this.getUserHistoryTbodyUI();
		const sensorDetectHistoryOptionUI = this.getSensorDetectHistoryOptionUI();
		const selectValue = this.state.selectValue;

        return (			
			<div id={'hsty'}>
				<div className={'hsScr'}>
					<div id={'hsCont'}>
						<span className={'hsContTitle'}>{i18n.t('history.menu.고장 이력')}</span>

						<form action="">
							<div className={'hscSch'}>
								<ul className={'hscsHalf'}>
									<li>
										<dl>
											<dt>{i18n.t('history.formText.설비명')}</dt>
											<dd>
												<select
													className={'locationSelect'}
													value={this.state.selectedFacility}
													onChange={this.handleChange}
												>
													<option value={i18nUtil.convertText('{"ko": "전체", "en": "All"}')}>{i18nUtil.convertText('{"ko": "전체", "en": "All"}')}</option>
													<option value={i18nUtil.convertText('{ "ko":"중압 컴프레서", "en":"e중압 컴프레서"}')}>{i18nUtil.convertText('{ "ko":"중압 컴프레서", "en":"e중압 컴프레서"}')}</option>
													<option value={i18nUtil.convertText('{ "ko":"디스펜서", "en":"e디스펜서"}')}>{i18nUtil.convertText('{ "ko":"디스펜서", "en":"e디스펜서"}')}</option>
												</select>
											</dd>
										</dl>
									</li>
								</ul>
								<ul className={'hscsHalf'}>
									<li>
										<dl className={'secondDl'}>
											<dt>{i18n.t('history.formText.조회 기간')}</dt>
											<dd>
												<span className={'InquiryPeriodSelectTitle'}>{i18n.t('history.formText.조회기간 지정')}</span>
												<ul className={'hscsDate'}>
													<li>
														<div className={'datepicker'}>
															<DatePicker ref={this.refDatepicker01} name="datepicker01" id="datepicker01"
																dateFormat="yyyy-MM-dd"
																locale={i18n.language === "ko" ? ko : enUS}
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
																locale={i18n.language === "ko" ? ko : enUS}
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
								{/* <dl>
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
								</dl> */}
								{
									<a onClick={() => this.display()} className={'hscsSbmtSecond'}><span><span>{i18n.t('history.formText.검색')}</span></span></a>
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
									<li><a onClick={() => this.onClickDownload(false)} className={'all'}>{i18n.t('history.formText.전체 다운로드')}</a></li>
									<li><a onClick={() => this.onClickDownload(true)} className={'exl'}>{i18n.t('history.formText.선택 다운로드')}</a></li>
								</ul>
						}

						<div className={'hscTb'}>
							<div className={'scrTb'}>
								<table>
									<colgroup>
										<col style={{ width: '3%' }} />
										<col style={{ width: '3%' }} />
										<col style={{ width: '10%' }} />
										<col style={{ width: '10%' }} />
										<col style={{ width: '10%' }} />
										<col style={{ width: '12%' }} />
										<col style={{ width: '20%' }} />
										<col style={{ width: '22%' }} />
										<col style={{ width: '10%' }} />
									</colgroup>
									<thead>
										<tr>
											{
												ProjectResource.SiteID === ProjectResource.Site.Hydrogen
													? i18n.language.toString() === "ko"
														? <>
															<th><input type="checkbox" checked={allChecked} onChange={(e) => this.onCheckedRow(e.target.checked, -1)} /></th>
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
															<th><input type="checkbox" checked={allChecked} onChange={(e) => this.onCheckedRow(e.target.checked, -1)} /></th>
															<th>No</th>
															<th>Facility Name</th>
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
										{userHistoryTbodyUI}
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