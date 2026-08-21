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
import btnCalendarBk from '../../Common/img/sub/dashboard_calendar_blue.png';
import CircularProgress from '@material-ui/core/CircularProgress';

import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/

import ProjectResource from '../../Root/resource/id';

import { SOPHistoryComponent, SOPHistoryDetailBoxs } from '../styled/SensorDetectHistoryStyled';
import SopController from "../../SOPManager/services/sopController";
//import SopManagerResource from '../../SOPManager/resource/id';
//import SopController from '../../SOPManager/services/sopController';


class SOPHistory extends Component {

	constructor(props) {
		super(props);

		this.state = {
			subContent: null,
			selectedData: null,

			disasterCategories: null,
			dataSource: null,
			viewDataSource: null,
			maxRowCount: 14, // 한 페이지에 보여줄 data row 수
			maxPageCount: 5, // 한번에 보여줄 페이지 개수
			pageIndex: 1,    // 현재 페이지
			maxPageIndex: 1, // 최대 페이지 Index			
			dateType: 'today',
			beginDate: new Date(),
			endDate: new Date(),
			pageSize: 14,
			selectSensorType: '전체',
			selectActionStep: '전체',
			selectRealMode: '전체',
			selectUserName: '',

			selectDisasterType: '전체',

			loadingIndicator: false,
			linkSOP: null,
			prevProps: null,
		}

		this.refDatepicker01 = React.createRef();
		this.refDatepicker02 = React.createRef();

		this.props = props;
		this.display = this.display.bind(this);
		this.changeSubContent = this.changeSubContent.bind(this);
		this.onClickDownload = this.onClickDownload.bind(this);
		this.loadActionStepNames();
	}

	componentDidMount() {
		if (this.props.selectedSiteID) {
			this.loadDisasterCategory();
			if (ProjectResource.SiteID !== ProjectResource.Site.Hydrogen) {
				this.display();
			}
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.linkSOP !== prevState.linkSOP) {
			if (prevProps.linkSOP && prevProps.linkSOP.beginTime) {
				this.setState({ beginDate: new Date(prevProps.linkSOP.beginTime), endDate: new Date(prevProps.linkSOP.beginTime), linkSOP: prevProps.linkSOP });
				this.display();
            }
        } 
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

		$("body").css("cursor", "wait");

		const beginDate = this.getMakeDateTime(this.state.beginDate) + ' 00:00:00';
		const endDate = this.getMakeDateTime(this.state.endDate) + ' 23:59:59';

		if (beginDate > endDate) {
			$("body").css("cursor", "default");
			alert('조회 기간을 다시 선택하세요');
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
		this.setState({ selectSensorType: value });
    }
	onChangeStep = (value) => {
		this.setState({ selectActionStep: value });
	}
	
	// 모드 선택 안함
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

	async onClickDownload(isCheckedDownload) {
		const title = 'history.menu.SOP 이력';

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
		worksheet.addRow(['조회 기간' + ' : ' + beginDate + ' ~ ' + endDate]);
		worksheet.addRow(['재난 타입' + ' : ' + this.state.selectDisasterType]);
		worksheet.addRow(['위기경보 단계' + ' : ' + this.state.selectActionStep]);
		worksheet.addRow(['모드' + ' : ' + this.state.selectRealMode]);
		worksheet.addRow([]);

		// column
		let columnRow = worksheet.addRow(['No', 'SOP 유형', 'SOP 이름', '위기경보 단계', 'SOP모드', '센서명', '위치', '시작 시간', '종료 시간', '이름']);
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
		if (!this.state.dataSource || this.state.dataSource?.length === 0) {
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
			if (dataSource[i].disasterName === this.state.selectDisasterType || this.state.selectDisasterType === '전체') {
				// 위기단계
				if (dataSource[i].actionStepName === this.state.selectActionStep || this.state.selectActionStep === '전체') {
					// 모드
					if (dataSource[i].realMode === this.state.selectRealMode || this.state.selectRealMode === '전체') {
						let trClassName = null;
						if (this.state.linkSOP && this.state.linkSOP.actionStepHistoryID && this.state.linkSOP.actionStepHistoryID === dataSource[i].actionStepHistoryID) {
							trClassName = 'selectedTr';
                        }
						
						let userName = dataSource[i].userName;
						if (userName === '')
							userName = '자동실행';

						ui.push(<tr key={'dataSource_' + (i)} className={trClassName}>
									<td><input type="checkbox" checked={dataSource[i].checked} onChange={(e) => this.onCheckedRow(e.target.checked, i)} /></td>
									<td>{i + 1}</td>
									<td>{dataSource[i].disasterName}</td>
									<td>{dataSource[i].sopName}</td>
									<td>{dataSource[i].actionStepName}</td>
									{/* <td>{dataSource[i].realMode}</td> */}
									<td>{(!dataSource[i].sensorName || dataSource[i].sensorName.length === 0) ? '-' : dataSource[i].sensorName}</td>
									<td>{dataSource[i].position}</td>
									<td>{dataSource[i].beginTime}</td>
									<td>{dataSource[i].endTime}</td>
									<td>{userName}</td>
							        <td><a onClick={() => this.onDetailInfo(dataSource[i])}>상세정보</a></td>
								</tr>);
                    }
                }
            }
		}

		return ui;
	}

	getDisasterCategories() {
		let ui = [];
		ui.push(<option key={'disaster_all'} value={'전체'}>전체</option>);

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
		this.setState({ selectedData: data, subContent: '상세보기'});
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

	onClose = () => {
		this.changeSubContent(null);
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
	
	getSopDetailInfo = () => {
		const selectedData = this.state.selectedData;
		
		if (this.state.subContent && this.state.subContent === HistoryResource.ID.menu.detailHistory) {
			return (
				<SOPHistoryDetailInfo selectedData={selectedData} changeSubContent={this.changeSubContent} />
			)
		}
	}

	handlePageChange = (newPageIndex) => {
		if (newPageIndex < 1 || newPageIndex > this.state.maxPageIndex) {
			return;
		}

		this.setState({ pageIndex: newPageIndex });
	}
	
	render() {
		const categories = this.getDisasterCategories();
		const pageIndexUI = this.getPageIndexUI();
		const gridUI = this.getGridData();
		const sopDetailInfo = this.getSopDetailInfo();
		//const actionStepNamesUI = this.getActionStepNames();
		//const sopHistoryDetailBox = this.getSopHistoryDetailBox();

		let totalPages = 0;
		if (!this.state.dataSource) {
			return <></>;
		}
		totalPages = Math.ceil(this.state.dataSource.length / this.state.pageSize);
		
		console.log(totalPages);

		return (
			<div id={'hsty'}>
				<div className={'hsScr'}>
					<div id={'hsCont'}>
						<span className={'hsContTitle'}>SOP 이력</span>
						<form action="">
							<div className={'hscSch'}>
								<ul className={'hscsHalf'}>
									<li>
										<dl>
											<dt>센서유형</dt>
											<dd>
												<select name="" id=""
														onChange={(e) => this.onChangeDisasterType(e.target.value)}
														className={'selWh'}>
													{categories}
												</select>
											</dd>
										</dl>
									</li>
									<li>
										<dl>
											<dt>위기단계</dt>
											<dd>
												<select name="" id=""
														onChange={(e) => this.onChangeStep(e.target.value)}
														className={'selWh'}>
													<option value="전체">전체</option>
													<option value="관심">관심</option>
													<option value="주의">주의</option>
													<option value="경계">경계</option>
													<option value="심각">심각</option>
												</select>
											</dd>
										</dl>
									</li>
									<li>
										<dl>
											<dt>실행자</dt>
											<dd>
												<input type="text" name="" id="" value={this.state.selectUserName}
													   onChange={(e) => this.onChangeSelectedUser(e.target.value)}
													   onKeyUp={this.searchEnterKey}/>
											</dd>
										</dl>
									</li>
								</ul>

								<dl>
									<dt>조회기간</dt>
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
																onChange={date => this.onChangeBegin(date)}/>
													<img src={btnCalendarBk} onClick={this.onClickDatepicker01} alt=""
														 className={'btnCalendarBk'}/>
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
											<li><input type="radio" name="hscsRdo" id="hscsRdo01" onChange={() => this.onClickDateType('select')} checked={this.state.dateType === 'select'} /><label htmlFor="hscsRdo01">기간선택</label></li>
											<li><input type="radio" name="hscsRdo" id="hscsRdo01" onChange={() => this.onClickDateType('today')} checked={this.state.dateType === 'today'} /><label htmlFor="hscsRdo01">오늘</label></li>
											<li><input type="radio" name="hscsRdo" id="hscsRdo02" onChange={() => this.onClickDateType('week')} checked={this.state.dateType === 'week'} /><label htmlFor="hscsRdo02">1주</label></li>
											<li><input type="radio" name="hscsRdo" id="hscsRdo03" onChange={() => this.onClickDateType('month')} checked={this.state.dateType === 'month'} /><label htmlFor="hscsRdo03">1개월</label></li>
											<li><input type="radio" name="hscsRdo" id="hscsRdo04" onChange={() => this.onClickDateType('year')} checked={this.state.dateType === 'year'} /><label htmlFor="hscsRdo04">1년</label></li>
										</ul>
									</dd>
								</dl>
								{
									this.state.loadingIndicator === true ?
										<a className={'hscsSbmtSOP'} id={'hscsSbmting'}><span><span><CircularProgress className="spinner" /></span></span></a>
										:
										<a onClick={this.display} className={'hscsSbmtSOP'}><span><span>검색</span></span></a>
								} 
								{/*<a onClick={this.sopHistoryTbodyhandleClick} className={'hscsSbmt'}><span><span>{i18n.t('history.formText.검색')}</span></span></a>*/}
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
									<li><a onClick={() => this.onClickDownload(false)} className={'all'}>전체 다운로드</a></li>
									<li><a onClick={() => this.onClickDownload(true)} className={'exl'}>선택 다운로드</a></li>
								</ul>
						}
						<div className={'hscSOPTb'}>
							<div className={'scrSOPTb'}>
								<table>
									<colgroup>
										<col style={{ width: '5%' }} />
										<col style={{ width: '5%' }} />
										<col style={{ width: '10%' }} />
										<col style={{ width: '10%' }} />
										<col style={{ width: '10%' }} />
										{/* <col style={{ width: '9%' }} /> */}
										<col style={{ width: '10%' }} />
										<col style={{ width: '10%' }} />
										<col style={{ width: '10%' }} />
										<col style={{ width: '10%' }} />
										<col style={{ width: '10%' }} />
										<col style={{ width: '10%' }} />
									</colgroup>
									<thead>
										<tr>
											<th><input type="checkbox" /></th>
											<th>NO</th>
											<th>센서유형</th>
											<th>SOP 이름</th>
											<th>위기경보 단계</th>
											{/* <th>SOP 단계</th> */}
											<th>센서명</th>
											<th>위치</th>
											<th>일시</th>
											<th>종료일시</th>
											<th>실행자</th>
											<th>상세대응이력</th>
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
											<a className={'prev'} onClick={() => this.handlePageChange(this.state.pageIndex - 1)}>이전</a>
										</>
										<ul>
											{Array.from({length: Math.min(5, totalPages)}, (_, i) => {
												const startIndex = Math.max(0, Math.min(totalPages - 5, this.state.pageIndex - 3));
												const pageNumber = startIndex + i + 1;
												return (
													<li key={i} className={this.state.pageIndex === pageNumber ? 'on' : null}>
														<a onClick={() => this.handlePageChange(i + 1)}>{i + 1}</a>
													</li>
												);
											})
											}
										</ul>
										<>
											<a className={'next'} onClick={() => this.handlePageChange(this.state.pageIndex + 1)}>다음</a>
											<a className={'last'} onClick={() => this.handlePageChange(totalPages)}>맨 뒤</a>
										</>
									</div>
									: <> </>
							}
					    </div>
					</div>
				</div>



				{/* SOP 상세정보창 */}
				{ this.state.subContent === '상세보기' &&
					sopDetailInfo
				}


				{/* {
					(this.state.subContent && this.state.subContent === i18n.t('history.menu.상세보기')) ?
						<SOPHistoryDetailInfo changeSubContent={this.changeSubContent} selectedData={this.state.selectedData} />
						: <> </>
				} */}
				{/* {sopHistoryDetailBox} */}
			</div>
		);
	}
} export default SOPHistory;