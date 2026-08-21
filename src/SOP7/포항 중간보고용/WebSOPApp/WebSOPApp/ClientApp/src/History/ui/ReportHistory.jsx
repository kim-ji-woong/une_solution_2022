import React, { Component } from 'react';
import $ from 'jquery';
import HistoryController from '../services/historyController';
import DatePicker from 'react-datepicker';
import { ko, enUS } from 'date-fns/esm/locale';
import btnCalendarBk from '../../Common/img/sub/dashboard_calendar_blue.png';

import CircularProgress from '@material-ui/core/CircularProgress';

import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/



class ReportHistory extends Component {

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

			selectValue: [],
		}

		this.refDatepicker01 = React.createRef();
		this.refDatepicker02 = React.createRef();

		this.props = props;
		this.display = this.display.bind(this);
		this.onClickDownload = this.onClickDownload.bind(this);
	}

	componentDidMount() {
		$('html, body').css({ 'display': 'block', 'height': '100%', 'overflow': 'hidden' });

		/* $('.locationSelect').click(function () {
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
		}); */
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.selectedSiteID !== this.props.selectedSiteID) {
			this.display();
		}
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
		const title = '데이터 수정 이력';

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
		worksheet.addRow(['조회 기간' + ' : ' + beginDate + ' ~ ' + endDate]);

		// 빈칸
		worksheet.addRow([]);

		// column
		let columnRow = worksheet.addRow(['No', '일시', '이름', '권한', '소속', '수정 데이터', '수정 유형', '내용']);
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

	render() {
		const pageIndexUI = this.getPageIndexUI();
		const gridUI = this.getGridData();
		//const userHistoryTbodyUI = this.getUserHistoryTbodyUI();
		//const sensorDetectHistoryOptionUI = this.getSensorDetectHistoryOptionUI();
		const selectValue = this.state.selectValue;

		return (
			<div id={'hsty'}>
				<div className={'hsScr'}>
					<div id={'hsCont'}>
						<span className={'hsContTitle'}>센서 탐지 통계표</span>
						<form action="">
							<div className={'hscSch'}>
								<ul className={'hscsHalf'}>
									<li>
										<dl>
											<dt>센서유형</dt>
											<dd>
												<select name="" id="" onChange={(e) => this.onChangeDisasterType(e.target.value)} className={'selWh'}>
													{/* {categories} */}
												</select>
											</dd>
										</dl>
									</li>
									<li>
										<dl>
											<dt>위치</dt>
											<dd>
												<select name="" id="" onChange={(e) => this.onChangeStep(e.target.value)} className={'selWh'}>
													{/* {actionStepNamesUI} */}
												</select>
											</dd>
										</dl>
									</li>
									<li>
										<dl>
											<dt>측정값</dt>
											<dd>
												<select name="" id="" onChange={(e) => this.onChangeStep(e.target.value)} className={'selWh'}>
													{/* {actionStepNamesUI} */}
												</select>
											</dd>
										</dl>
									</li>
									<li>
										<dl>
											<dt>집계방식</dt>
											<dd>
												<select name="" id="" onChange={(e) => this.onChangeStep(e.target.value)} className={'selWh'}>
													{/* {actionStepNamesUI} */}
												</select>
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
										? <a className={'hscsSbmtSOP'} id={'hscsSbmting'}><span><span><CircularProgress className="spinner" /></span></span></a>
										: <a onClick={this.display} className={'hscsSbmtSOP'}><span><span>검색</span></span></a>
								}
								{/*<a onClick={this.userHistoryTbodyhandleClick} className={'hscsSbmt'}><span><span>{i18n.t('history.formText.검색')}</span></span></a>*/}
							</div>
						</form>

						{
							this.state.loadingIndicator === true ?
								<ul className={'hscExl'}>
									<li><a className={'all'} id={'hscsSbmting'}>전체 다운로드</a></li>
									<li><a className={'all'} id={'hscsSbmting'}>선택 다운로드</a></li>
								</ul>
								:
								<ul className={'hscExl'}>
									<li><a onClick={() => this.onClickDownload(false)} className={'all'}>전체 다운로드</a></li>
									<li><a onClick={() => this.onClickDownload(true)} className={'all'}>선택 다운로드</a></li>
								</ul>
						}

						<div className={'hscTb2'}>
							<div className={'hsTbFlex'}>
								<div className={'hsTbConts'}>
									<table>
										<colgroup>
											<col style={{ width: '15%' }} />
											<col style={{ width: '15%' }} />
											<col style={{ width: '70%' }} />
										</colgroup>
										<thead>
											<tr>
												<th><input type="checkbox" /></th>
												<th>NO</th>
												<th>위치</th>
											</tr>
										</thead>
										<tbody>
											{/* {gridUI} */}
											<tr id={"recentlyBoxArea"} className={'recentlyBoxArea'}>
												<td><input type="checkbox" id={"recentlyCheckbox"} className={'recentlyCheckbox'} onClick={() => this.onClickRecentlybox()} /></td>
												<td>1</td>
												<td>대경</td>
											</tr>
											<tr id={"activeBoxArea"} className={'activeBoxArea'}>
												<td><input type="checkbox" id={"activeCheckbox"} className={'activeCheckbox'} onClick={() => this.onClickCheckbox()} /></td>
												<td>2</td>
												<td>대경</td>
											</tr>
											<tr>
												<td><input type="checkbox" /></td>
												<td>3</td>
												<td>대경</td>
											</tr>
											<tr>
												<td><input type="checkbox" /></td>
												<td>4</td>
												<td>대경</td>
											</tr>
											<tr>
												<td><input type="checkbox" /></td>
												<td>5</td>
												<td>대경</td>
											</tr>
											<tr>
												<td><input type="checkbox" /></td>
												<td>6</td>
												<td>대경</td>
											</tr>
											<tr>
												<td><input type="checkbox" /></td>
												<td>7</td>
												<td>대경</td>
											</tr>
											<tr>
												<td><input type="checkbox" /></td>
												<td>8</td>
												<td>대경</td>
											</tr>
											<tr>
												<td><input type="checkbox" /></td>
												<td>9</td>
												<td>대경</td>
											</tr>
											<tr>
												<td><input type="checkbox" /></td>
												<td>10</td>
												<td>대경</td>
											</tr>
											<tr className={'checkDisable'}>
												<td><input type="checkbox" /></td>
												<td>11</td>
												<td>대경</td>
											</tr>
											<tr className={'checkDisable'}>
												<td><input type="checkbox" /></td>
												<td>12</td>
												<td>대경</td>
											</tr>
											<tr className={'checkDisable'}>
												<td><input type="checkbox" /></td>
												<td>13</td>
												<td>대경</td>
											</tr>
											<tr>
												<td><input type="checkbox" /></td>
											    <td>14</td>
												<td>대경</td>
											</tr>
											<tr>
												<td><input type="checkbox" /></td>
												<td>15</td>
												<td>대경</td>
											</tr>
										</tbody>
									</table>
								</div>
								
								<div className={'hsTbContsNum'}>
									<ul className={'hsTbContList'}>
										<li className={'hsTbContListHead'}>
											<div><span className={'listText'}>측정일시</span><span className={'listIcon'}></span></div>
											<div><span className={'listText'}>온도</span><span className={'listIcon'}></span></div>
											<div><span className={'listText'}>습도</span><span className={'listIcon'}></span></div>
											<div><span className={'listText'}>풍향</span><span className={'listIcon'}></span></div>
											<div><span className={'listText'}>풍속</span><span className={'listIcon'}></span></div>
											<div><span className={'listText'}>먼지</span><span className={'listIcon'}></span></div>
											<div><span className={'listText'}>미세먼지</span><span className={'listIcon'}></span></div>
											<div><span className={'listText'}>황하수소</span><span className={'listIcon'}></span></div>
											<div><span className={'listText'}>암모니아</span><span className={'listIcon'}></span></div>
											<div><span className={'listText'}>총휘발성유</span><span className={'listIcon'}></span></div>
											<div><span className={'listText'}>이산화황</span><span className={'listIcon'}></span></div>
											<div><span className={'listText'}>이산화질소</span><span className={'listIcon'}></span></div>
											<div><span className={'listText'}>456</span><span className={'listIcon'}></span></div>
											<div><span className={'listText'}>이산화황</span><span className={'listIcon'}></span></div>
											<div><span className={'listText'}>이산화질소</span><span className={'listIcon'}></span></div>
											<div><span className={'listText'}>456</span><span className={'listIcon'}></span></div>
										</li>
										<li className={'hsTbContListBody'}>
											{/* {gridUI} */}
											<ul>
												<li>
													<div><p>2023-12-27 00:00:00</p></div>
													<div>9.66</div>
													<div>9.66</div>
													<div>남동풍</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
											   </li>
												<li>
													<div><p>2023-12-27 00:00:00</p></div>
													<div>9.66</div>
													<div>9.66</div>
													<div>남동풍</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
												</li>
												<li>
													<div><p>2023-12-27 00:00:00</p></div>
													<div>9.66</div>
													<div>9.66</div>
													<div>남동풍</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
												</li>
												<li>
													<div><p>2023-12-27 00:00:00</p></div>
													<div>9.66</div>
													<div>9.66</div>
													<div>남동풍</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
												</li>
												<li>
													<div><p>2023-12-27 00:00:00</p></div>
													<div>9.66</div>
													<div>9.66</div>
													<div>남동풍</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
												</li>
												<li>
													<div><p>2023-12-27 00:00:00</p></div>
													<div>9.66</div>
													<div>9.66</div>
													<div>남동풍</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
												</li>
												<li>
													<div><p>2023-12-27 00:00:00</p></div>
													<div>9.66</div>
													<div>9.66</div>
													<div>남동풍</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
												</li>
												<li>
													<div><p>2023-12-27 00:00:00</p></div>
													<div>9.66</div>
													<div>9.66</div>
													<div>남동풍</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
												</li>
												<li>
													<div><p>2023-12-27 00:00:00</p></div>
													<div>9.66</div>
													<div>9.66</div>
													<div>남동풍</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
												</li>
												<li>
													<div><p>2023-12-27 00:00:00</p></div>
													<div>9.66</div>
													<div>9.66</div>
													<div>남동풍</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
												</li>
												<li>
													<div><p>2023-12-27 00:00:00</p></div>
													<div>9.66</div>
													<div>9.66</div>
													<div>남동풍</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
												</li>
												<li>
													<div><p>2023-12-27 00:00:00</p></div>
													<div>9.66</div>
													<div>9.66</div>
													<div>남동풍</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
												</li>
												<li>
													<div><p>2023-12-27 00:00:00</p></div>
													<div>9.66</div>
													<div>9.66</div>
													<div>남동풍</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
												</li>
												<li>
													<div><p>2023-12-27 00:00:00</p></div>
													<div>9.66</div>
													<div>9.66</div>
													<div>남동풍</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
												</li>
												<li>
													<div><p>2023-12-27 00:00:00</p></div>
													<div>9.66</div>
													<div>9.66</div>
													<div>남동풍</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
												</li>
												<li>
													<div><p>2023-12-27 00:00:00</p></div>
													<div>9.66</div>
													<div>9.66</div>
													<div>남동풍</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
													<div>9.66</div>
												</li>
											</ul>
										</li>
									</ul>
								</div>

							{/* <div className={'hsTbContsNone'}>
								<span></span>
								<div>
									선택된 목록이 없습니다.
								</div>
							</div> */}
							</div> {/* flex */}


							{/* {
								(this.state.dataSource && this.state.dataSource.length > 0) ?
									<div className={'hscNav'}>
										<a className={'first'} onClick={() => this.setPageIndex(1)}>맨 앞</a>
										<a className={'prev'} onClick={() => this.setPageIndex(this.state.pageIndex - 1)}>이전</a>
										<ul>
											{pageIndexUI}
										</ul>
										<a className={'next'} onClick={() => this.setPageIndex(this.state.pageIndex + 1)}>다음</a>
										<a className={'last'} onClick={() => this.setPageIndex(this.state.maxPageIndex)}>맨 뒤</a>
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
		);
	}
}

export default ReportHistory;