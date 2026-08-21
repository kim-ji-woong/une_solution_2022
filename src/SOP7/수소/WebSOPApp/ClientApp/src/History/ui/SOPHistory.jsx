import $ from 'jquery';
import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko, enUS } from 'date-fns/esm/locale';
import newStyles from '../../Common/css/newStyle.module.css';
import uneStyles from "../../Common/css/uneCommon.module.css";
import HistoryResource from "../resource/id";
import HistoryController from '../services/historyController';
import SOPHistoryDetailInfo from './popups/SOPHistoryDetailInfo';
import btnCalendarBk from '../../History/image/historyCalendar_icon.svg';
import btnCalendarBk_wonik from '../../Common/img/sub/dashboard_calendar_bk_wonik.png';
import CircularProgress from '@material-ui/core/CircularProgress';

import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/

import ProjectResource from '../../Root/resource/id';

import { SOPHistoryComponent, SOPHistoryDetailBoxs } from '../styled/SensorDetectHistoryStyled';
import SopManagerResource from '../../SOPManager/resource/id';
import SopController from '../../SOPManager/services/sopController';
import { i18n, withTranslation, i18nUtil } from '../../language/i18n';

import SDMSResource from '../../SDMS/resource/id';


class SOPHistory extends Component {

	constructor(props) {
		super(props);

		this.state = {
			subContent: null,
			selectedData: null,

			disasterCategories: null,
			dataSource: null,
			viewDataSource: null,
			maxRowCount: 10, // 한 페이지에 보여줄 data row 수
			maxPageCount: 5, // 한번에 보여줄 페이지 개수
			pageIndex: 1,    // 현재 페이지
			maxPageIndex: 1, // 최대 페이지 Index
			dateType: 'today',
			beginDate: new Date(),
			endDate: new Date(),

			selectDisasterType: i18n.t('common.전체'),
			selectActionStep: i18n.t('common.전체'),
			selectRealMode: i18n.t('common.전체'),
			selectUserName: '',

			loadingIndicator: false,
			linkSOP: null,
			prevProps: null,

			sopHistoryTbodyUI: false,
			sopHistoryDetailBoxUI: false,
		}

		this.refDatepicker01 = React.createRef();
		this.refDatepicker02 = React.createRef();

		this.props = props;
		this.display = this.display.bind(this);
		this.changeSubContent = this.changeSubContent.bind(this);
		this.onClickDownload = this.onClickDownload.bind(this);
		this.loadActionStepNames();

		//this.sopHistoryTbodyhandleClick = this.sopHistoryTbodyhandleClick.bind(this);
		//this.sopHistoryDetailBoxyhandleClick = this.sopHistoryDetailBoxyhandleClick.bind(this);
	}

	componentDidMount() {
		if (this.props.selectedSiteID) {
			this.loadDisasterCategory();
			if (ProjectResource.SiteID !== ProjectResource.Site.Hydrogen) {
				this.display();
			}
		}

		$(document).ready(function () {
			$('.' + newStyles.hsmCls).click(function () {
				$('.' + newStyles.hsmContHydrogen).css({ display: 'none' });
				$('.' + newStyles.hsmContHydrogen).css({ "display": "none" });
				$('#' + newStyles.hsMmoHydrogen).remove();
				$('#' + newStyles.hsMmoHydrogen).css({ "display": "none" });
			});
		})

		$('.disasterTypeSelect').click(function () {
			$('.disasterTypeSelect').css({ border: "solid 1px #0085FF" });
		});

		$('.crisisStageSelect').click(function () {
			$('.crisisStageSelect').css({ border: "solid 1px #0085FF" });
		});

		/* $('.modeSelect').click(function () {
			$('.modeSelect').css({ border: "solid 1px #0085FF" });
		}); */

		$('.writePersonInput').click(function () {
			$('.writePersonInput').css({ border: "solid 1px #0085FF" });
		});

		/* $('.hscsDate').click(function () {
			$('.hscsDate').css({ border: "solid 1px #0085FF" });
		}); */

		$('.sensorDetectHDaySelect').click(function () {
			$('.sensorDetectDayOptionBox').toggle();
			$('.sensorDetectHDaySelect').css({ border: "solid 1px #0085FF" });
		});
	}

	componentDidUpdate(prevProps, prevState) {
		console.log(prevProps);
		console.log(prevState);

		if (prevProps.linkSOP !== prevState.linkSOP) {
			if (prevProps.linkSOP && prevProps.linkSOP.beginTime) {
				this.setState({ beginDate: new Date(prevProps.linkSOP.beginTime), endDate: new Date(prevProps.linkSOP.beginTime), linkSOP: prevProps.linkSOP });
				this.display();
            }
        } 

		if (prevProps.selectedSiteID !== this.props.selectedSiteID) {
			this.loadDisasterCategory();

			if (prevProps.linkSOP === prevState.linkSOP)
				this.display();
        }
	}

	//sopHistoryTbodyhandleClick() {
	//	this.setState(prevState => ({
	//		sopHistoryTbodyUIOn: !prevState.sopHistoryTbodyUIOn,

	//	}));
	//}

	async loadActionStepNames() {
		// 각 사이트별 단계배열 및 단계명 초기화
		await SopController.loadActionStepNames();
	}

	async loadDisasterCategory() {
		const disasterCategories = await HistoryController.LoadDisasterCategories(this.props.selectedSiteID);
		this.setState({ disasterCategories });
    }

	async display() {
		//if (ProjectResource.SiteID === ProjectResource.Site.Hydrogen) {
		//	this.sopHistoryTbodyhandleClick();
		//	return;
		//}

		$("body").css("cursor", "wait");

		const beginDate = this.getMakeDateTime(this.state.beginDate) + ' 00:00:00';
		const endDate = this.getMakeDateTime(this.state.endDate) + ' 23:59:59';

		if (beginDate > endDate) {
			$("body").css("cursor", "default");
			alert(i18n.t('조회 기간을 다시 선택하세요'));
			return;
		}

		await this.setState({ loadingIndicator: true });

		let dataSource = await HistoryController.DisplaySOPHistories(beginDate, endDate, this.props.selectedSiteID);
		let datacount = dataSource.length;

		//if (this.state.selectUserName.length > 0) {
			let realDataSource = [];

			for (let i = 0; i < datacount; i++) {
				//if (dataSource[i].userName.indexOf(this.state.selectUserName) >= 0) {

					// 검색할 때, 조건도 같이 하도록 수정
					// 재난타입
					if (i18nUtil.convertText(dataSource[i].disasterName) === this.state.selectDisasterType || this.state.selectDisasterType === i18n.t('common.전체')) {
						// 위기단계
						if (dataSource[i].actionStepName === this.state.selectActionStep || this.state.selectActionStep === i18n.t('common.전체')) {
							// 모드 - 모드가 없기 때문에 제외
							//if (dataSource[i].realMode === this.state.selectRealMode || this.state.selectRealMode === i18n.t('common.전체')) {
								realDataSource.push(dataSource[i]);
							//}
						}
					}
                //}
			}
						
			dataSource = realDataSource;
			datacount = dataSource.length;
        //}

		if (datacount > 1) {
			dataSource = dataSource.sort((a, b) => { return new Date(b.beginTime).getTime() - new Date(a.beginTime).getTime(); });
        }

		const value1 = parseInt(datacount / this.state.maxRowCount);
		const value2 = datacount % (this.state.maxRowCount); // 나머지가 있는 경우 페이지 하나를 추가한다.
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

	onChangeDisasterType = (value) => {
		this.setState({ selectDisasterType: value });
	}

	onChangeStep = (value) => {
		this.setState({ selectActionStep: value });
	}

	//onChangeRealMode = (value) => {
	//	this.setState({ selectRealMode: value });
	//}

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

	onChangeSelectedUser = (value) => {
		this.setState({ selectUserName: value });
	}

	searchEnterKey = () => {
		if (window.event && window.event.keyCode === 13) {
			this.display();
		}
	}

	onCheckedRow(checked, index) {
		const dataSource = this.state.dataSource;
		//dataSource[i].checked = checked;
		const datacount = dataSource.length;
		if (index === -1) {
			let beginIndex = 0;
			if (this.state.pageIndex > 1) {
				beginIndex = (this.state.pageIndex - 1) * this.state.maxRowCount;
			}

			for (let i = beginIndex; i < beginIndex + this.state.maxRowCount; i++) {
				if (datacount < i + 1) {
					break;
				}
				dataSource[i].checked = checked;
			}
		}
		else {
			dataSource[index].checked = checked;
		}

		this.setState({ dataSource });
	}

	async onClickDownload(isCheckedDownload) {
		const title = i18n.t('history.menu.SOP 이력');

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
		worksheet.addRow([i18n.t('history.formText.재난 타입') + ' : ' + this.state.selectDisasterType]);
		worksheet.addRow([i18n.t('history.formText.위기경보 단계') + ' : ' + this.state.selectActionStep]);
		//worksheet.addRow([i18n.t('history.formText.모드') + ' : ' + this.state.selectRealMode]);
		worksheet.addRow([]);

		// column
		let columnRow = worksheet.addRow(['No', i18n.t('history.formText.SOP 유형'), i18n.t('history.formText.SOP 이름'), i18n.t('history.formText.위기경보 단계'), /*i18n.t('history.formText.SOP모드'),*/ i18n.t('history.formText.센서명'), i18n.t('common.위치'), i18n.t('history.formText.시작 시간'), i18n.t('history.formText.종료 시간')/*, i18n.t('history.formText.이름')*/]);
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
			{ key: "disasterName", width: 20 },
			{ key: "sopName", width: 15 },
			{ key: "actionStepName", width: 15 },
			//{ key: "realMode", width: 15 },
			{ key: "sensorName", width: 30 },
			{ key: "position", width: 25 },			
			{ key: "beginTime", width: 20 },
			{ key: "endTime", width: 20 },
			//{ key: "userName", width: 15 }
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
				const disasterName = i18nUtil.convertText(this.state.dataSource[i].disasterName);
				const sopName = i18nUtil.convertText(this.state.dataSource[i].sopName);
				const actionStepName = this.state.dataSource[i].actionStepName;
				//const realMode = (this.state.dataSource[i].realMode === '실제') ? i18n.t('history.formText.실제') : i18n.t('history.formText.테스트');
				const sensorName = i18nUtil.convertText(this.state.dataSource[i].sensorName);
				const position = i18nUtil.convertText(this.state.dataSource[i].position);
				const beginTime = this.state.dataSource[i].beginTime;
				const endTime = this.state.dataSource[i].endTime;
				const userName = this.state.dataSource[i].userName;

				data.no = no;
				data.disasterName = disasterName;
				data.sopName = sopName;
				data.actionStepName = actionStepName;
				//data.realMode = realMode;
				data.sensorName = (!sensorName || sensorName.length === 0) ? '-' : sensorName;
				data.position = position;				
				data.beginTime = beginTime;
				data.endTime = endTime;
				//data.userName = userName;

				arrDatas.push(data);
			}

			arrDatas.forEach(function (item, index) {
				worksheet.addRow({
					no: item.no,
					disasterName: item.disasterName,
					sopName: item.sopName,
					actionStepName: item.actionStepName,
					//realMode: item.realMode,
					sensorName: item.sensorName,
					position: item.position,
					beginTime: item.beginTime,
					endTime: item.endTime,
					//userName: item.userName
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
		let pageIndexUI = null;
		let ui = [];
		if (!this.state.dataSource) {
			return pageIndexUI;
		}

		const pageArr = new Array();

		//let index = this.state.pageIndex;
		//// 이전 페이지 넣기
		//while (true) {
		//	index--;
		//	if (index < 1) {
		//		break;
		//	}
		//	if (this.state.pageIndex - 2 > index) {
		//		break;
		//	}

		//	pageArr.push(index);
		//}
		//index = this.state.pageIndex;
		//pageArr.push(index);

		//// 다음 페이지 넣기
		//while (true) {
		//	if (pageArr.length === this.state.maxPageCount) {
		//		break;
		//	}

		//	index++;
		//	if (index > this.state.maxPageIndex) {
		//		break;
		//	}

		//	pageArr.push(index);
		//}

		//// 정렬
		//pageArr.sort(function (a, b) { if (a > b) return 1; if (a === b) return 0; if (a < b) return -1; });

		//for (let i = 0; i < pageArr.length; i++) {
		//	let pageIndex = pageArr[i];
		//	if (pageIndex === this.state.pageIndex) {
		//		ui.push(<li key={'pageIndex_' + (pageIndex)} className={'on'}><a onClick={() => this.setPageIndex(pageIndex)}>{pageIndex}</a></li>);
		//	}
		//	else {
		//		ui.push(<li key={'pageIndex_' + (pageIndex)}><a onClick={() => this.setPageIndex(pageIndex)}>{pageIndex}</a></li>);
		//	}
		//}

		const pageIndex = this.state.pageIndex;
		const maxPageIndex = this.state.maxPageIndex;

		const pageFirst = pageIndex === null ? null : Math.floor((pageIndex - 1) / this.state.maxPageCount) * this.state.maxPageCount + 1;


		for (let i = pageFirst; i < pageFirst + this.state.maxPageCount; i++) {
			if (i > maxPageIndex)
				break;

			ui.push(<li key={'pageIndex_' + (i)} className={(i === pageIndex ? 'on' : '')}><a onClick={() => this.setPageIndex(i)}>{i}</a></li>);
		}

		pageIndexUI =
			<div className={'hscNav'}>
			<a className={(pageFirst > 1 ? 'first' : 'firstDisable')} onClick={() => this.setPageIndex(1)}>{i18n.t('history.formText.맨 앞')}</a>
			<a className={(pageFirst > this.state.maxPageCount ? 'prev' : 'prevDisable')} onClick={() => this.setPageIndex(pageFirst - 1)}>{i18n.t('history.formText.이전')}</a>
				<ul>
					{ui}
				</ul>
			<a className={(pageFirst + this.state.maxPageCount <= maxPageIndex ? 'next' : 'nextDisable')} onClick={() => this.setPageIndex(pageFirst + this.state.maxPageCount)}>{i18n.t('history.formText.다음')}</a>
			<a className={(pageFirst + this.state.maxPageCount <= maxPageIndex ? 'last' : 'lastDisable')} onClick={() => this.setPageIndex(maxPageIndex)}>{i18n.t('history.formText.맨 뒤')}</a>
			</div>;


		return pageIndexUI;
	}

	getGridData() {
		let ui = [];
		if (!this.state.dataSource) {
			return [ui, false];
		}

		const dataSource = this.state.dataSource;
		const datacount = dataSource.length;

		let allChecked = true; // 전체 체크 여부

		// 데이터를 읽을 시작할 배열값
		let beginIndex = 0;
		if (this.state.pageIndex > 1) {
			beginIndex = (this.state.pageIndex - 1) * this.state.maxRowCount;
		}

		for (let i = beginIndex; i < beginIndex + this.state.maxRowCount; i++) {
			if (datacount < i + 1) {
				break;
			}

			// 검색할 때, 조건을 맞춤으로 제외처리
			// 재난타입
			//if (i18nUtil.convertText(dataSource[i].disasterName) === this.state.selectDisasterType || this.state.selectDisasterType === i18n.t('common.전체')) {
				// 위기단계
				//if (dataSource[i].actionStepName === this.state.selectActionStep || this.state.selectActionStep === i18n.t('common.전체')) {
					// 모드
					//if (dataSource[i].realMode === this.state.selectRealMode || this.state.selectRealMode === i18n.t('common.전체')) {


						let trClassName = null;
						if (this.state.linkSOP && this.state.linkSOP.actionStepHistoryID && this.state.linkSOP.actionStepHistoryID === dataSource[i].actionStepHistoryID) {
							trClassName = 'selectedTr';
                        }

						ui.push(<tr key={'dataSource_' + (i)} className={trClassName}>
									<td><input type="checkbox" checked={dataSource[i].checked} onChange={(e) => this.onCheckedRow(e.target.checked, i)} /></td>
									<td>{i + 1}</td>
									<td>{i18nUtil.convertText(dataSource[i].disasterName)}</td>
									<td>{i18nUtil.convertText(dataSource[i].sopName)}</td>
									<td>{dataSource[i].actionStepName}</td>
							<td>{(!dataSource[i].sensorName || dataSource[i].sensorName.length === 0) ? '-' : i18nUtil.convertText(dataSource[i].sensorName)}</td>
									<td>{dataSource[i].position}</td>
									<td>{dataSource[i].beginTime}</td>
									<td>{dataSource[i].endTime}</td>
									{/*<td>{dataSource[i].userName}</td>*/}
							        <td><a onClick={() => this.onDetailInfo(dataSource[i])}>{i18n.t('history.formText.상세정보')}</a></td>
						</tr>);
					//}
                //}
			//}

			if (allChecked && !dataSource[i].checked) {
				allChecked = false;
			}
		}

		return [ui, allChecked];
	}	

	getDisasterCategories() {
		let ui = [];
		ui.push(<option key={'disaster_all'} value={i18n.t('common.전체')}>{i18n.t('common.전체')}</option>);

		if (this.state.disasterCategories) {
			for (let i = 0; i < this.state.disasterCategories.length; i++) {
				if (this.state.selectDisasterType === i18nUtil.convertText(this.state.disasterCategories[i].categoryName)) {
					ui.push(<option key={'disaster_' + i} value={i18nUtil.convertText(this.state.disasterCategories[i].categoryName)} selected>{i18nUtil.convertText(this.state.disasterCategories[i].categoryName)}</option>);
				}
				else {
					ui.push(<option key={'disaster_' + i} value={i18nUtil.convertText(this.state.disasterCategories[i].categoryName)}>{i18nUtil.convertText(this.state.disasterCategories[i].categoryName)}</option>);
				}
            }
		}

		return ui;
    }

	onDetailInfo(data) {
		this.setState({ selectedData: data, subContent: i18n.t('history.menu.상세보기') });
	}

	changeSubContent(subContent) {
		this.setState({ subContent });
	}

	onClickDatepicker01 = () => {
		this.refDatepicker01.current.setOpen(true);
	}

	onClickDatepicker02 = () => {
		this.refDatepicker02.current.setOpen(true);
	}

	getActionStepNames() {
		const actionStepNames = SopManagerResource.actionStep;
		if (actionStepNames === null) {
			return <>
				<option value={i18n.t('common.전체')}>{i18n.t('common.전체')}</option>
				<option value={i18n.t('history.formText.관심')}>{i18n.t('history.formText.관심')}</option>
				<option value={i18n.t('history.formText.주의')}>{i18n.t('history.formText.주의')}</option>
				<option value={i18n.t('history.formText.경계')}>{i18n.t('history.formText.경계')}</option>
				<option value={i18n.t('history.formText.심각')}>{i18n.t('history.formText.심각')}</option>
			</>
		}
		else {
			const ui = [];
			ui.push(<option value={i18n.t('common.전체')}>{i18n.t('common.전체')}</option>);
			const arrNames = Object.keys(actionStepNames);
			for (let i = 0; i < arrNames.length; i++) {
				if (i === 0) {
					//ui.push(<option value={actionStepNames._1st}>{actionStepNames._1st}</option>)
				} else if (i === 1) {
					ui.push(<option value={actionStepNames._2nd}>{actionStepNames._2nd}</option>)
				} else if (i === 2) {
					ui.push(<option value={actionStepNames._3rd}>{actionStepNames._3rd}</option>)
				} else if (i === 3) {
					//ui.push(<option value={actionStepNames._4th}>{actionStepNames._4th}</option>)
                }
			}

			return ui;
		}
	}

	//onClose = () => {
	//	this.changeSubContent(null);
	//}	

	render() {
		const categories = this.getDisasterCategories();
		const pageIndexUI = this.getPageIndexUI();
		const [gridUI, allChecked] = this.getGridData();
		const actionStepNamesUI = this.getActionStepNames();

		return (
			<div id={'hsty'}>
				<div className={'hsScr'}>
					<div id={'hsCont'}>
						<span className={'hsContTitle'}>{i18n.t('history.menu.SOP 이력')}</span>
						<form action="">
							<div className={'hscSch'}>
								<ul className={'hscsHalf'}>
									<li>
										<dl>
											<dt>{i18n.t('history.formText.재난 타입')}</dt>
											<dd>
												<select name="" id="" onChange={(e) => this.onChangeDisasterType(e.target.value)} className={'selWhSOP'} >
													{categories}
												</select>
											</dd>
										</dl>
									</li>
									<li>
										<dl>
											<dt>{i18n.t('history.formText.위기단계')}</dt>
											<dd>
												<select name="" id="" onChange={(e) => this.onChangeStep(e.target.value)} className={'selWhSOP'}>
													{actionStepNamesUI}
												</select>
											</dd>
										</dl>
									</li>
									{/*<li>*/}
									{/*	<dl>*/}
									{/*		<dt>{i18n.t('history.formText.작성자')}</dt>*/}
									{/*		<dd>*/}
									{/*			<input type="text" name="" id="" value={this.state.selectUserName}*/}
									{/*				onChange={(e) => this.onChangeSelectedUser(e.target.value)}*/}
									{/*				onKeyUp={this.searchEnterKey} />*/}
									{/*		</dd>*/}
									{/*	</dl>*/}
									{/*</li>*/}
								</ul>

								<ul className={'hscsHalf'}>
									<li>
										<dl className={'secondDl'}>
											<dt>{i18n.t('history.formText.조회 기간')}</dt>
											<dd>
												<ul className={'hscsDate'}>
													<li>
														<div className={'datepicker'}>
															<DatePicker ref={this.refDatepicker01} name="datepicker01"
																id="datepicker01"
																dateFormat="yyyy-MM-dd"
																locale={ko}
																maxDate={new Date()}
																selected={this.state.beginDate}
																onChange={date => this.onChangeBegin(date)} />
															<img src={btnCalendarBk} onClick={this.onClickDatepicker01} alt="" className={'btnCalendarBk'} />
														</div>
													</li>
													<li>~</li>
													<li>
														<div className={'datepicker'}>
															<DatePicker ref={this.refDatepicker02} name="datepicker02"
																id="datepicker02"
																dateFormat="yyyy-MM-dd"
																locale={ko}
																maxDate={new Date()}
																selected={this.state.endDate}
																onChange={date => this.onChangeEnd(date)} />
															<img src={btnCalendarBk} onClick={this.onClickDatepicker02} alt="" className={'btnCalendarBk'} />
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
									this.state.loadingIndicator === true ?
										<a className={'hscsSbmtSecond'} id={'hscsSbmting'}><span><span><CircularProgress className="spinner" /></span></span></a>
										:
										<a onClick={this.display} className={'hscsSbmtSecond'}><span><span>{i18n.t('history.formText.검색')}</span></span></a>
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
										<col style={{ width: '9%' }} />
										<col style={{ width: '9%' }} />
										<col style={{ width: '9%' }} />
										{/*<col style={{ width: '9%' }} />*/}
										<col style={{ width: '9%' }} />
										<col style={{ width: '9%' }} />
										<col style={{ width: '11%' }} />
										<col style={{ width: '11%' }} />
										{/*<col style={{ width: '9%' }} />*/}
										<col style={{ width: '9%' }} />
									</colgroup>
									<thead>
										<tr>
											<th><input type="checkbox" checked={allChecked} onChange={(e) => this.onCheckedRow(e.target.checked, -1)} /></th>
											<th>{i18n.t('history.formText.번호')}</th>
											<th>{i18n.t('history.formText.SOP 유형')}</th>
											<th>{i18n.t('history.formText.SOP 이름')}</th>
											<th>{i18n.t('history.formText.위기경보 단계')}</th>
											{/*<th>{i18n.t('history.formText.SOP모드')}</th>*/}
											<th>{i18n.t('history.formText.센서명')}</th>
											<th>{i18n.t('common.위치')}</th>
											<th>{i18n.t('history.formText.시작시간')}</th>
											<th>{i18n.t('history.formText.종료 시간')}</th>
											{/*<th>{i18n.t('history.formText.이름')}</th>*/}
											<th>{i18n.t('history.formText.상세대응이력')}</th>
										</tr>
									</thead>
									<tbody>
										{gridUI}
									</tbody>
								</table>
							</div>
							{ pageIndexUI }
						</div>
					</div>
				</div>
				{
					(this.state.subContent && this.state.subContent === i18n.t('history.menu.상세보기')) ?
						<SOPHistoryDetailInfo changeSubContent={this.changeSubContent} selectedData={this.state.selectedData} />
						: <> </>
				}
			</div>
		);
	}
} export default SOPHistory;