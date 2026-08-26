import $ from 'jquery';
import React, { Component } from 'react';
import { getSearchMinDate } from '../util/searchDateLimit';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import newStyles from '../../Common/css/newStyle.module.css';
import newDefault from '../../Common/css/newDefault.module.css';
import uneStyles from "../../Common/css/uneCommon.module.css";
import HistoryResource from "../resource/id";
import HistoryController from '../services/historyController';
import datepicker from 'react-datepicker';
import ProjectResource from '../../Root/resource/id';
import { ko, enUS } from 'date-fns/esm/locale';
import btnCalendarBk from '../../Common/img/sub/dashboard_calendar_bk.png';
import btnCalendarBk_wonik from '../../Common/img/sub/dashboard_calendar_bk_wonik.png';

import { SpreadHistoryComponent } from '../styled/SensorDetectHistoryStyled';

import { i18n, withTranslation, i18nUtil } from '../../language/i18n';

class SpreadHistory extends Component {
	constructor(props) {
		super(props);

		this.state = {
			dataSource: null,
			maxRowCount: 10, // 한 페이지에 보여줄 data row 수
			maxPageCount: 5, // 한번에 보여줄 페이지 개수
			pageIndex: 1,    // 현재 페이지
			maxPageIndex: 1, // 최대 페이지 Index			
			dateType: 'today',
			beginDate: new Date(),
			endDate: new Date(),
			prevProps: null,

			spreadHistoryTbodyUI: false,
			sensorDetectHistoryOptionUI: false,

			selectValue: [],
		}

		this.props = props;
		this.display = this.display.bind(this);

		this.spreadHistoryTbodyhandleClick = this.spreadHistoryTbodyhandleClick.bind(this);
		this.detectHistoryOptionUIhandleClick = this.detectHistoryOptionUIhandleClick.bind(this);
		this.detectHistoryOptionUI2handleClick = this.detectHistoryOptionUI2handleClick.bind(this);
	}

	componentDidMount() {
		this.display();

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

	spreadHistoryTbodyhandleClick() {
		this.setState(prevState => ({
			spreadHistoryTbodyUIOn: !prevState.spreadHistoryTbodyUIOn,

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
		const beginDate = this.getMakeDateTime(this.state.beginDate) + ' 00:00:00';
		const endDate = this.getMakeDateTime(this.state.endDate) + ' 23:59:59';

		if (beginDate > endDate) {
			alert(i18n.t('조회 기간을 다시 선택하세요'));
			return;
		}

		//const dataSource = await HistoryController.DisplaySOPHistories(beginDate, endDate);

		//const datacount = dataSource.length;
		//const value1 = parseInt(datacount / this.state.maxRowCount);
		////const value2 = datacount % (this.state.maxRowCount + 1); // 나머지가 있는 경우 페이지 하나를 추가한다.
		//let maxPageIndex = value1;// + ((value2 > 0) ? 1 : 0);

		//this.setState({ dataSource, maxPageIndex });
	}

	getMakeDateTime(dateTime) {
		let year = dateTime.getFullYear();
		let month = 1 + dateTime.getMonth();
		month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
		let day = dateTime.getDate();                   //d
		day = day >= 10 ? day : '0' + day;

		//let hour = dateTime.getHours();
		//hour = hour >= 10 ? hour : '0' + hour;
		//let min = dateTime.getMinutes();
		//min = min >= 10 ? min : '0' + min;
		//let sec = dateTime.getSeconds();
		//sec = sec >= 10 ? sec : '0' + sec;

		let strDate = year + '-' + month + '-' + day; //+ ' ' + hour + ':' + min + ':' + sec;

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
	}

	onChangeEnd = (date) => {
		this.setState({ endDate: date });
		$("input:radio[name='stgDate']").prop('checked', false);

		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		let korFormat = year + "-" + month + "-" + day;
	}

	onClickDateType = (type) => {
		let today = new Date();
		let date = new Date();
		let dateType = '';

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
				ui.push(<li key={'pageIndex_' + (pageIndex)} className={newStyles.on}><a onClick={() => this.setPageIndex(pageIndex)}>{pageIndex}</a></li>);
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
			beginIndex = (this.state.pageIndex * this.state.maxRowCount) - 1;
		}

		for (let i = beginIndex; i < beginIndex + this.state.maxRowCount; i++) {
			if (datacount < i + 1) {
				break;
			}

			ui.push(<tr key={'dataSource_' + (i)}>
				<td><input type="checkbox" /></td>
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
				<td><a href="#">{i18n.t('history.formText.상세정보')}</a></td>
			</tr>);
		}

		return ui;
	}

	getSpreadHistoryTbodyUI = () => {
		let spreadHistoryTbodyUI = [];

		if (this.state.spreadHistoryTbodyUIOn === true) {
			if (i18n.language.toString() === "ko") {
				spreadHistoryTbodyUI.push(
					<>
						<tr>
							<td><input type="checkbox" /></td>
							<td>01</td>
							<td>압력</td>
							<td>COMP10264</td>
							<td>공급</td>
							<td>2023-10-20 14:39:55</td>
							<td>압력 스위치 작동 여부</td>
							<td>이상 없음</td>
							<td>Bin Wang</td>
						</tr>
					</>
				)
			} else {
				spreadHistoryTbodyUI.push(
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
							<td>Bin Wang</td>
						</tr>
					</>
				)
			}
		}
		return spreadHistoryTbodyUI;
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
		const spreadHistoryTbodyUI = this.getSpreadHistoryTbodyUI();
		const sensorDetectHistoryOptionUI = this.getSensorDetectHistoryOptionUI();
		const selectValue = this.state.selectValue;


		return (
			<div id={'hsty'}>
				<div className={'hsScr'}>
					<div id={'hsCont'}>
						<form action="">
							<div className={'hscSch'}>
								{
									ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen &&
									<>
										<dl>
											<dd>
												{/* <span className={'locationSelectTitle'}>{i18n.t('common.위치')}</span>
												<select name="" id="" className={'locationSelect'}>
													<option value="전체">All</option>
													<option value="훈련">A</option>
													<option value="실제">B</option>
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
								}
								<dl>
									{
										ProjectResource.styleMode !== ProjectResource.StyleType.Hydrogen &&
										<dt>{i18n.t('history.formText.조회기간 지정')}</dt>
									}
									<dd>
										{ 
											ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen
												? <>
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
												: <>
													<ul className={'hscsDate'}>
														<li>
															<div className={'datepicker'}>
																<datepicker type="text" name="" id="dateStart" />
																<label htmlFor="dateStart">달력</label>
															</div>
														</li>
														<li>~</li>
														<li>
															<div className={'datepicker'}>
																<datepicker type="text" name="" id="dateEnd" />
																<label htmlFor="dateEnd">달력</label>
															</div>
														</li>
													</ul>
													<ul className={'hscsRdo'}>
														<li><input type="radio" name="hscsRdo" id="hscsRdo01" onClick={() => this.onClickDateType('today')} checked={this.state.dateType === 'today'} /><label htmlFor="hscsRdo01">{i18n.t('history.formText.오늘')}</label></li>
														<li><input type="radio" name="hscsRdo" id="hscsRdo02" onClick={() => this.onClickDateType('week')} checked={this.state.dateType === 'week'} /><label htmlFor="hscsRdo02">{i18n.t('history.formText.1주')}</label></li>
														<li><input type="radio" name="hscsRdo" id="hscsRdo03" onClick={() => this.onClickDateType('month')} checked={this.state.dateType === 'month'} /><label htmlFor="hscsRdo03">{i18n.t('history.formText.1개월')}</label></li>
														<li><input type="radio" name="hscsRdo" id="hscsRdo04" onClick={() => this.onClickDateType('year')} checked={this.state.dateType === 'year'} /><label htmlFor="hscsRdo04">{i18n.t('history.formText.1년')}</label></li>
													</ul>
												</>

										}
									</dd>
								</dl>
								{/* 원본 */}
								{/* <dl>
											<dt>발신자</dt>
											<dd>
												<div className={'hscsIpt pl0'}>
													<input type="text" name="" id="" />
												</div>
											</dd>
										</dl> */}
								<dl>
									{
										ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen &&
										<>
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
										</>
									}
								</dl>
								<a onClick={this.spreadHistoryTbodyhandleClick} className={'hscsSbmt'}><span><span>{i18n.t('history.formText.검색')}</span></span></a>
							</div>
						</form>

						<ul className={'hscExl'}>
							<li><a href="#" className={'all'}>{i18n.t('history.formText.전체 다운로드')}</a></li>
							<li><a href="#" className={'exl'}>{i18n.t('history.formText.선택 다운로드')}</a></li>
						</ul>

						<div className={'hscTb'}>
							<div className={'scrTb'}>
								<table>
									<colgroup>
										<col style={{ width: '5%' }} />
										<col style={{ width: '5%' }} />
										<col style={{ width: '10%' }} />
										<col style={{ width: '10%' }} />
										<col style={{ width: '10%' }} />
										<col style={{ width: '10%' }} />
										<col style={{ width: '20%' }} />
										<col style={{ width: '20%' }} />
										<col style={{ width: '10%' }} />
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
															<th>점검일시</th>
															<th>점검내용</th>
															<th>점검결과</th>
															<th>점검자</th>
														</>
														: <>
															<th><input type="checkbox" /></th>
															<th>No</th>
															<th>Facility ID</th>
															<th>Facility management No</th>
															<th>Location</th>
															<th>Maintenance date and time</th>
															<th>Maintenance details</th>
															<th>Maintenance results</th>
															<th>Inspector</th>
														</>
													: <>
														<th><input type="checkbox" /></th>
														<th>No.</th>
														<th>{i18n.t('history.formText.일시')}</th>
														<th>{i18n.t('history.formText.발신자')}</th>
														<th>{i18n.t('history.formText.수신 대상자')}</th>
														<th>{i18n.t('history.formText.내용')}</th>
														<th>{i18n.t('history.formText.재발송')}</th>
													</>
											}
										</tr>
									</thead>
									<tbody>
										{
											ProjectResource.SiteID === ProjectResource.Site.Hydrogen &&
											<>
												{spreadHistoryTbodyUI}
											</>
										}
										{/* 원본 */}
										{/* <tr>
													<td><input type="checkbox" /></td>
													<td>1</td>
													<td>210517 03:11:15</td>
													<td>홍길동</td>
													<td>안전관리팀(3), 총괄팀(5)</td>
													<td>T1-1 구역 화재발생, 비상발송을 실시합니다.</td>
													<td><a href="#">재발송</a></td>
												</tr>*/}
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
} export default withTranslation()(SpreadHistory);