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
import btnCalendarBk from '../../Common/img/sub/dashboard_calendar_bk.png';
import btnCalendarBk_wonik from '../../Common/img/sub/dashboard_calendar_bk_wonik.png';
import CircularProgress from '@material-ui/core/CircularProgress';

import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/

import ProjectResource from '../../Root/resource/id';

import { SOPHistoryComponent, SOPHistoryDetailBoxs } from '../styled/SensorDetectHistoryStyled';
import SopManagerResource from '../../SOPManager/resource/id';
import SopController from '../../SOPManager/services/sopController';
import { i18n, withTranslation, i18nUtil } from '../../language/i18n';
import { GghController } from '../../SDMS/services/gghController';
import ConfirmDialog from '../../Common/ui/confirmDialog';

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

			selectDisasterType: '전체',
			selectActionStep: '전체',
			selectRealMode: '전체',
			selectUserName: '',

			loadingIndicator: false,
			linkSOP: null,
			prevProps: null,

			sopHistoryTbodyUI: false,
			sopHistoryDetailBoxUI: false,

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

		this.props = props;
		this.display = this.display.bind(this);
		this.changeSubContent = this.changeSubContent.bind(this);
		this.onClickDownload = this.onClickDownload.bind(this);
		this.loadActionStepNames();

		this.sopHistoryTbodyhandleClick = this.sopHistoryTbodyhandleClick.bind(this);
		this.sopHistoryDetailBoxyhandleClick = this.sopHistoryDetailBoxyhandleClick.bind(this);
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
			$('.disasterTypeSelect').css({ border: "solid 1px #00AFFF" });
		});

		$('.crisisStageSelect').click(function () {
			$('.crisisStageSelect').css({ border: "solid 1px #00AFFF" });
		});

		$('.modeSelect').click(function () {
			$('.modeSelect').css({ border: "solid 1px #00AFFF" });
		});

		$('.writePersonInput').click(function () {
			$('.writePersonInput').css({ border: "solid 1px #00AFFF" });
		});

		$('.hscsDate').click(function () {
			$('.hscsDate').css({ border: "solid 1px #00AFFF" });
		});

		$('.sensorDetectHDaySelect').click(function () {
			$('.sensorDetectDayOptionBox').toggle();
			$('.sensorDetectHDaySelect').css({ border: "solid 1px #00AFFF" });
		});
	}

	componentDidUpdate(prevProps, prevState) {
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

	sopHistoryTbodyhandleClick() {
		this.setState(prevState => ({
			sopHistoryTbodyUIOn: !prevState.sopHistoryTbodyUIOn,

		}));
	}

	sopHistoryDetailBoxyhandleClick() {
		this.setState(prevState => ({
			sopHistoryDetailBoxUIOn: !prevState.sopHistoryDetailBoxUIOn,

		}));
	}

	async loadActionStepNames() {
		// 각 사이트별 단계배열 및 단계명 초기화
		await SopController.loadActionStepNames();
	}

	async loadDisasterCategory() {
		const disasterCategories = await HistoryController.LoadDisasterCategories(this.props.selectedSiteID);
		this.setState({ disasterCategories });
    }

	async display() {
		if (ProjectResource.SiteID === ProjectResource.Site.Hydrogen) {
			this.sopHistoryTbodyhandleClick();
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

		await this.setState({ loadingIndicator: true });

		let dataSource = await HistoryController.DisplaySOPHistories(beginDate, endDate, this.props.selectedSiteID);
		let datacount = dataSource.length;

		if (this.state.selectUserName.length > 0) {
			let realDataSource = [];
			for (let i = 0; i < datacount; i++) {
				if (dataSource[i].userName.indexOf(this.state.selectUserName) >= 0) {
					realDataSource.push(dataSource[i]);
                }
			}
						
			dataSource = realDataSource;
			datacount = dataSource.length;
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
	onChangeRealMode = (value) => {
		this.setState({ selectRealMode: value });
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

	onChangeSelectedUser = (value) => {
		this.setState({ selectUserName: value });
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

	onClickDownloadSopReport = async () => {
		let arrActionStepHistoryIDs = [];

		if (this.state.dataSource) {
			for (const data of this.state.dataSource) {
				const checked = data.checked;

				if (!checked) {
					continue;
				}

				arrActionStepHistoryIDs.push(data.actionStepHistoryID);
			}
		}

		if (arrActionStepHistoryIDs.length > 0) {
			const [success, message] = await GghController.requestDownloadSopReport(arrActionStepHistoryIDs);

			if (!success) {
				this.showConfirmDialog(i18n.t('account.에러'), [message], null, null);
			}
		}
		else {
			this.showConfirmDialog(i18n.t('account.에러'), ["다운로드 받을 데이터를 선택해주세요."], null, null);
		}
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

		worksheet.mergeCells('A1:J2');
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
		worksheet.addRow([i18n.t('history.formText.모드') + ' : ' + this.state.selectRealMode]);
		worksheet.addRow([]);

		// column
		let columnRow = worksheet.addRow(['No', i18n.t('history.formText.SOP 유형'), i18n.t('history.formText.SOP 이름'), i18n.t('history.formText.위기경보 단계'), i18n.t('history.formText.SOP모드'), i18n.t('history.formText.센서명'), i18n.t('위치'), i18n.t('history.formText.시작 시간'), i18n.t('history.formText.종료 시간'), i18n.t('history.formText.사용자 이름')]);
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
			{ key: "realMode", width: 15 },
			{ key: "sensorName", width: 30 },
			{ key: "position", width: 25 },			
			{ key: "beginTime", width: 20 },
			{ key: "endTime", width: 20 },
			{ key: "userName", width: 15 }
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
				const disasterName = this.state.dataSource[i].disasterName;
				const sopName = this.state.dataSource[i].sopName;
				const actionStepName = this.state.dataSource[i].actionStepName;
				const realMode = this.state.dataSource[i].realMode;
				const sensorName = this.state.dataSource[i].sensorName;
				const position = this.state.dataSource[i].position;				
				const beginTime = this.state.dataSource[i].beginTime;
				const endTime = this.state.dataSource[i].endTime;
				const userName = this.state.dataSource[i].userName;

				data.no = no;
				data.disasterName = disasterName;
				data.sopName = sopName;
				data.actionStepName = actionStepName;
				data.realMode = realMode;
				data.sensorName = (!sensorName || sensorName.length === 0) ? '-' : sensorName;
				data.position = position;				
				data.beginTime = beginTime;
				data.endTime = endTime;
				data.userName = userName;

				arrDatas.push(data);
			}

			arrDatas.forEach(function (item, index) {
				worksheet.addRow({
					no: item.no,
					disasterName: item.disasterName,
					sopName: item.sopName,
					actionStepName: item.actionStepName,
					realMode: item.realMode,
					sensorName: item.sensorName,
					position: item.position,
					beginTime: item.beginTime,
					endTime: item.endTime,
					userName: item.userName
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
			beginIndex = (this.state.pageIndex - 1)* this.state.maxRowCount;
		}

		for (let i = beginIndex; i < beginIndex + this.state.maxRowCount; i++) {
			if (datacount < i + 1) {
				break;
			}

			// 재난타입
			if (dataSource[i].disasterName === this.state.selectDisasterType || this.state.selectDisasterType === i18n.t('common.전체')) {
				// 위기단계
				if (dataSource[i].actionStepName === this.state.selectActionStep || this.state.selectActionStep === i18n.t('common.전체')) {
					// 모드
					if (dataSource[i].realMode === this.state.selectRealMode || this.state.selectRealMode === i18n.t('common.전체')) {
						let trClassName = null;
						if (this.state.linkSOP && this.state.linkSOP.actionStepHistoryID && this.state.linkSOP.actionStepHistoryID === dataSource[i].actionStepHistoryID) {
							trClassName = 'selectedTr';
                        }

						ui.push(<tr key={'dataSource_' + (i)} className={trClassName}>
									<td><input type="checkbox" checked={dataSource[i].checked} onChange={(e) => this.onCheckedRow(e.target.checked, i)} /></td>
									<td>{i + 1}</td>
									<td>{dataSource[i].disasterName}</td>
									<td>{dataSource[i].sopName}</td>
									<td>{dataSource[i].actionStepName}</td>
									<td>{dataSource[i].realMode}</td>
									<td>{(!dataSource[i].sensorName || dataSource[i].sensorName.length === 0) ? '-' : dataSource[i].sensorName}</td>
									<td>{dataSource[i].position}</td>
									<td>{dataSource[i].beginTime}</td>
									<td>{dataSource[i].endTime}</td>
									<td>{dataSource[i].userName}</td>
							        <td><a onClick={() => this.onDetailInfo(dataSource[i])}>{i18n.t('history.formText.상세정보')}</a></td>
								</tr>);
                    }
                }
            }
		}

		return ui;
	}

	getDisasterCategories() {
		let ui = [];
		ui.push(<option key={'disaster_all'} value={i18n.t('common.전체')}>{i18n.t('common.전체')}</option>);

		if (this.state.disasterCategories) {
			for (let i = 0; i < this.state.disasterCategories.length; i++) {
				if (this.state.selectDisasterType === this.state.disasterCategories[i].categoryName) {
					ui.push(<option key={'disaster_' + i} value={this.state.disasterCategories[i].categoryName} selected>{this.state.disasterCategories[i].categoryName}</option>);
				}
				else {
					ui.push(<option key={'disaster_' + i} value={this.state.disasterCategories[i].categoryName}>{this.state.disasterCategories[i].categoryName}</option>);
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
					ui.push(<option value={actionStepNames._1st}>{actionStepNames._1st}</option>)
				} else if (i === 1) {
					ui.push(<option value={actionStepNames._2nd}>{actionStepNames._2nd}</option>)
				} else if (i === 2) {
					ui.push(<option value={actionStepNames._3rd}>{actionStepNames._3rd}</option>)
				} else if (i === 3) {
					ui.push(<option value={actionStepNames._4th}>{actionStepNames._4th}</option>)
                }
			}

			return ui;
		}
	}


	onClose = () => {
		this.changeSubContent(null);
	}

	getSopHistoryDetailBox = () => {
		let sopHistoryDetailBox = [];

		if (this.state.sopHistoryDetailBoxUIOn === true) {
			if (i18n.language.toString() === "ko") {
				sopHistoryDetailBox.push(
					<>
						<div id={newStyles.hsMmoHydrogen} className={newStyles.popup}>
							<div>
								<div>
									<div className={newStyles.hsmContHydrogen + " " + newStyles.sop}>
										<div className={newStyles.hsmTitleHydrogen}>
											<h3>SOP 상세정보</h3>
											{/* <a onClick={this.onClickAllDownload} className={newStyles.hsmExl}>엑셀 다운로드</a> */}
											<a onClick={this.sopHistoryDetailBoxyhandleClick} className={newStyles.hsmCls}>닫기</a>
										</div>
										<div className={"scroll-wrapper" + " " + newStyles.hsmPrcHydrogen + " " + "scroll-bar"}>
											<table className={newStyles.hsmTbHydrogen}>
												<colgroup>
													<col style={{ width: '5%' }} />
													<col style={{ width: '20%' }} />
													<col style={{ width: '40%' }} />
													<col style={{ width: '20%' }} />
													<col style={{ width: '15%' }} />
												</colgroup>
												<thead>
													<tr>
														<th>No.</th>
														<th>프로세스 제목</th>
														<th>전파 대상자</th>
														<th>시간</th>
														<th>완료여부</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>1</td>
														<td>시작</td>
														<td></td>
														<td>2023-10-20</td>
														<td>확인</td>
													</tr>
													<tr>
														<td>2</td>
														<td>누출 규모 확인</td>
														<td></td>
														<td>2023-10-20</td>
														<td>실행중</td>
													</tr>
												</tbody>
											</table>
										</div>
										<div className={"scroll-wrapper" + " " + newStyles.hsmDtlHydrogen + " " + "scroll-bar"} id={newStyles.hsmDtl + "1"}>
											<table className={newStyles.hsmTbHydrogen}>
												<colgroup>
													<col style={{ width: '5%' }} />
													<col style={{ width: '20%' }} />
													<col style={{ width: '40%' }} />
													<col style={{ width: '20%' }} />
													<col style={{ width: '15%' }} />
												</colgroup>
												<thead>
													<tr>
														<th>No.</th>
														<th>프로세스 제목</th>
														<th>세부 임무/전파 메시지</th>
														<th>시간</th>
														<th>완료여부</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>1</td>
														<td>화재 규모 확인</td>
														<td>
															<div className={"scroll-wrapper" + " " + newStyles.hsmScrHydrogen + " " + "scroll-bar"}>
																1. 최초 신고자를 통해 현장 상황을 확인
															</div>
														</td>
														<td>2023-10-21</td>
														<td>확인</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
						</div>
					</>
				)
			} else if (i18n.language.toString() === "en") {
				sopHistoryDetailBox.push(
					<>
						<div id={newStyles.hsMmoHydrogen} className={newStyles.popup}>
							<div>
								<div>
									<div className={newStyles.hsmContHydrogen + " " + newStyles.sop}>
										<div className={newStyles.hsmTitleHydrogen}>
											<h3>SOP Detailed Information</h3>
											{/* <a onClick={this.onClickAllDownload} className={newStyles.hsmExl}>엑셀 다운로드</a> */}
											<a onClick={this.sopHistoryDetailBoxyhandleClick} className={newStyles.hsmCls}>Close</a>
										</div>
										<div className={"scroll-wrapper" + " " + newStyles.hsmPrcHydrogen + " " + "scroll-bar"}>
											<table className={newStyles.hsmTbHydrogen}>
												<colgroup>
													<col style={{ width: '5%' }} />
													<col style={{ width: '20%' }} />
													<col style={{ width: '40%' }} />
													<col style={{ width: '20%' }} />
													<col style={{ width: '15%' }} />
												</colgroup>
												<thead>
													<tr>
														<th>No.</th>
														<th>Process Title</th>
														<th>Person Subject to Transmission</th>
														<th>Time</th>
														<th>Completion status</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>1</td>
														<td>Start</td>
														<td></td>
														<td>2023-10-20</td>
														<td>Check</td>
													</tr>
													<tr>
														<td>2</td>
														<td>Check the leak Scale</td>
														<td></td>
														<td>2023-10-20</td>
														<td>Running</td>
													</tr>
												</tbody>
											</table>
										</div>
										<div className={"scroll-wrapper" + " " + newStyles.hsmDtlHydrogen + " " + "scroll-bar"} id={newStyles.hsmDtl + "1"}>
											<table className={newStyles.hsmTbHydrogen}>
												<colgroup>
													<col style={{ width: '5%' }} />
													<col style={{ width: '20%' }} />
													<col style={{ width: '40%' }} />
													<col style={{ width: '20%' }} />
													<col style={{ width: '15%' }} />
												</colgroup>
												<thead>
													<tr>
														<th>No.</th>
														<th>Process Title</th>
														<th>Detailed Mission/Propagation Message</th>
														<th>Time</th>
														<th>Completion status</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>1</td>
														<td>Check the Size Of Fire</td>
														<td>
															<div className={"scroll-wrapper" + " " + newStyles.hsmScrHydrogen + " " + "scroll-bar"}>
																1. First-time caller to check on-site status
															</div>
														</td>
														<td>2023-10-21</td>
														<td>Check</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
						</div>
					</>
				)
			}
		}
		return sopHistoryDetailBox;

	}

	render() {
		const categories = this.getDisasterCategories();
		const pageIndexUI = this.getPageIndexUI();
		const gridUI = this.getGridData();
		const actionStepNamesUI = this.getActionStepNames();
		const sopHistoryDetailBox = this.getSopHistoryDetailBox();

		return (
			<>
				<div id={'hsty'}>
					<div className={'hsScr'}>
						<div id={'hsCont'}>
							<form action="">
								<div className={'hscSch'}>
									<ul className={'hscsHalf'}>
										<li>
											<dl>
												<dt>{i18n.t('history.formText.재난타입')}</dt>
												<dd>
													<select name="" id="" onChange={(e) => this.onChangeDisasterType(e.target.value)} className={'selWh'}>
														{categories}
													</select>
												</dd>
											</dl>
										</li>
										<li>
											<dl>
												<dt>{i18n.t('history.formText.위기단계')}</dt>
												<dd>
													<select name="" id="" onChange={(e) => this.onChangeStep(e.target.value)} className={'selWh'}>
														{actionStepNamesUI}
													</select>
												</dd>
											</dl>
										</li>
										<li>
											<dl>
												<dt>{i18n.t('history.formText.모드')}</dt>
												<dd>
													<select name="" id="" onChange={(e) => this.onChangeRealMode(e.target.value)} className={'selWh'}>
														<option value={i18n.t('common.전체')}>{i18n.t('common.전체')}</option>
														<option value={i18n.t('history.formText.훈련')}>{i18n.t('history.formText.훈련')}</option>
														<option value={i18n.t('history.formText.실제')}>{i18n.t('history.formText.실제')}</option>
													</select>
												</dd>
											</dl>
										</li>
										<li>
											<dl>
												<dt>{i18n.t('history.formText.작성자')}</dt>
												<dd>
													<input type="text" name="" id="" value={this.state.selectUserName} onChange={(e) => this.onChangeSelectedUser(e.target.value)} onKeyUp={this.searchEnterKey} />
												</dd>
											</dl>
										</li>
									</ul>

									<dl>
										<dt>{i18n.t('history.formText.시작시간')}</dt>
										<dd>
											{
												ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen
													? <>
														<span className={'dateTypeSelectTitle'}>{i18n.t('history.formText.조회기간 지정')}</span>
														<ul className={'hscsDate'}>
															<li>
																<div className={'datepicker'}>
																	<DatePicker ref={this.refDatepicker01} name="datepicker01" id="datepicker01"
																		dateFormat="yyyy-MM-dd"
																		locale={i18n.language === "ko" ? ko : enUS}
																		showYearDropdown // 년도 드롭다운 활성화
																		showMonthDropdown // 월 드롭다운 활성화
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
																		showYearDropdown // 년도 드롭다운 활성화
																		showMonthDropdown // 월 드롭다운 활성화
																		maxDate={new Date()}
																		selected={this.state.endDate}
																		onChange={date => this.onChangeEnd(date)} />
																	<img src={ProjectResource.styleMode === ProjectResource.StyleType.Soulbrain ? btnCalendarBk : btnCalendarBk_wonik} alt="" className={'btnCalendarBk'} onClick={this.onClickDatepicker02} />
																</div>
															</li>
														</ul>
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
																		maxDate={new Date()}
																		selected={this.state.beginDate}
																		onChange={date => this.onChangeBegin(date)} />
																	<img src={ProjectResource.styleMode === ProjectResource.StyleType.Soulbrain ? btnCalendarBk : btnCalendarBk_wonik} onClick={this.onClickDatepicker01} alt="" className={'btnCalendarBk'} />
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
																		maxDate={new Date()}
																		selected={this.state.endDate}
																		onChange={date => this.onChangeEnd(date)} />
																	<img src={ProjectResource.styleMode === ProjectResource.StyleType.Soulbrain ? btnCalendarBk : btnCalendarBk_wonik} onClick={this.onClickDatepicker02} alt="" className={'btnCalendarBk'} />
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
									{
										ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen &&
										<>
											<dl>
												<dd>
													<ul className={'hscsDay'}>
														<span className={'dateTypeChiceTitle'}>{i18n.t('history.formText.조회기간 지정')}</span>
														<select className={'sensorDetectHDaySelect'} onChange={(e) => this.onClickDateType(e)}>
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
									}
									{
										this.state.loadingIndicator === true ?
											<a className={'hscsSbmt'} id={'hscsSbmting'}><span><span><CircularProgress className="spinner" /></span></span></a>
											:
											<a onClick={this.display} className={'hscsSbmt'}><span><span>{i18n.t('history.formText.검색')}</span></span></a>
									} 
									{/*<a onClick={this.sopHistoryTbodyhandleClick} className={'hscsSbmt'}><span><span>{i18n.t('history.formText.검색')}</span></span></a>*/}
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
												<li className={'report'}><a onClick={() => this.onClickDownloadSopReport()}>보고서 다운로드</a></li>
										}
										<li><a onClick={() => this.onClickDownload(false)} className={'all'}>{i18n.t('history.formText.전체 다운로드')}</a></li>
										<li><a onClick={() => this.onClickDownload(true)} className={'exl'}>{i18n.t('history.formText.선택 다운로드')}</a></li>
									</ul>
							}
							<div className={'hscTb'}>
								<div className={'scrTb'}>
									<table>
										<colgroup>
											<col style={{ width: '5%' }} />
											<col style={{ width: '5%' }} />
											<col style={{ width: '9%' }} />
											<col style={{ width: '9%' }} />
											<col style={{ width: '9%' }} />
											<col style={{ width: '9%' }} />
											<col style={{ width: '9%' }} />
											<col style={{ width: '9%' }} />
											<col style={{ width: '9%' }} />
											<col style={{ width: '9%' }} />
											<col style={{ width: '9%' }} />
											<col style={{ width: '9%' }} />
										</colgroup>
										<thead>
											<tr>
												<th><input type="checkbox" /></th>
												<th>{i18n.t('history.formText.번호')}</th>
												<th>{i18n.t('history.formText.SOP 유형')}</th>
												<th>{i18n.t('history.formText.SOP 이름')}</th>
												<th>{i18n.t('history.formText.위기경보 단계')}</th>
												<th>{i18n.t('history.formText.SOP모드')}</th>
												<th>{i18n.t('history.formText.센서명')}</th>
												<th>{i18n.t('common.위치')}</th>
												<th>{i18n.t('history.formText.시작시간')}</th>
												<th>{i18n.t('history.formText.종료 시간')}</th>
												<th>{i18n.t('history.formText.사용자 이름')}</th>
												<th>{i18n.t('history.formText.상세대응이력')}</th>
											</tr>
										</thead>
										<tbody>
											{
												<>
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
					{
						(this.state.subContent && this.state.subContent === i18n.t('history.menu.상세보기')) ?
							<SOPHistoryDetailInfo changeSubContent={this.changeSubContent} selectedData={this.state.selectedData} />
							: <> </>
					}
					{sopHistoryDetailBox}
				</div>

				{
					/* alert창 대신 사용 */
					this.state.confirmMessage.visible &&
					<ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
				}
			</>
		);
	}
} export default SOPHistory;