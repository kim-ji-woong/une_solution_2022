//import { Button } from '@amcharts/amcharts4/core';
import React, { Component } from 'react';
import $ from 'jquery';
import HistoryController from '../services/historyController';
import teamEditorCss from "../../TeamEditor/css/teamEditor.module.css";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale';
import btnCalendarBk from '../../Common/img/sub/dashboard_calendar_bk.png';
import btnCalendarBk_wonik from '../../Common/img/sub/dashboard_calendar_bk_wonik.png';
import user_icon from '../../Common/img/sub/user_icon.png';

import grade_levelE from "../../Common/image/icon/grade_level1.png";
import grade_levelD from "../../Common/image/icon/grade_level2.png";
import grade_levelC from "../../Common/image/icon/grade_level3.png";
import grade_levelB from "../../Common/image/icon/grade_level4.png";
import grade_levelA from "../../Common/image/icon/grade_level5.png";
import grade_levelC_wonik from "../../Common/image/icon/grade_level1_wonik.png";
import grade_levelB_wonik from "../../Common/image/icon/grade_level2_wonik.png";
import grade_levelA_wonik from "../../Common/image/icon/grade_level3_wonik.png";

import CircularProgress from '@material-ui/core/CircularProgress';

import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/

import HistoryResource from "../resource/id";
import ProjectResource from '../../Root/resource/id';

import { SafetyAreaHistoryPopupComponent } from '../styled/SensorDetectHistoryStyled';
import { i18n, withTranslation, i18nUtil } from '../../language/i18n';

class SafetyAreaHistory extends Component {
	constructor(props) {
		super(props);

		this.state = {
			dataSource: null,

			selectedEvaluator: '',
			selectedScore: -1,
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
			
			loadingIndicator: false, // 새로고침중인지 표시

			prevProps: null,

			// 상세정보 팝업 show
			detailPopupShow: false,
			selectedAssessment: {}
		}

		this.refDatepicker01 = React.createRef();
		this.refDatepicker02 = React.createRef();

		this.props = props;
		this.display = this.display.bind(this);
		this.onClickDownload = this.onClickDownload.bind(this);
	}

	componentDidMount() {		
		if (this.props.selectedSiteID) {
			this.display();
		}
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
			alert(i18n.t('history.formText.조회 기간을 다시 선택하세요'));
			return;
		}

		await this.setState({ loadingIndicator: true })
		
		const buildingGroupID = this.state.selectedBuildingGroupID;
		const buildingID = this.state.selectedBuildingID;
		const zoneID = this.state.selectedZoneID;

		const dataSource = await HistoryController.DisplayAssessmentHistories(
			beginDate, endDate, buildingGroupID, buildingID, zoneID, this.state.selectedScore, this.state.selectedEvaluator, this.props.selectedSiteID);
		
		const datacount = dataSource.length;

		const value1 = parseInt(datacount / this.state.maxRowCount);
		const value2 = datacount % (this.state.maxRowCount); // 나머지가 있는 경우 페이지 하나를 추가한다.
		let maxPageIndex = value1 + ((value2 > 0) ? 1 : 0);

		$("body").css("cursor", "default");

		this.setState({ dataSource, maxPageIndex, minPageIndex: 1, pageIndex: 1, loadingIndicator: false });
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

	onChangeEvaluator = (e) => {
		this.setState({ selectedEvaluator: e.target.value });
	}

	onChangeScore = (target) => {
		this.setState({ selectedScore: target.value });
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

	async onClickDownload(isCheckedDownload) {
		const title = i18n.t('history.menu.안전구역 평가 이력');

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
		worksheet.addRow([i18n.t('history.formText.조회 기간') + ' : ' + beginDate + ' ~ ' + endDate]);
		worksheet.addRow([i18n.t('history.formText.조회 범위') + ' : ' + this.state.searchZoneName]);
		worksheet.addRow([]);

		// column
		let columnRow = worksheet.addRow(['No', i18n.t('history.formText.항목명'), i18n.t('common.위치'), i18n.t('history.formText.관리구역'), i18n.t('history.formText.평가등급'), i18n.t('history.formText.수신자'), i18n.t('history.formText.발송일자'), i18n.t('history.formText.제출일자')]);
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
			{ key: "title", width: 20 },
			{ key: "position", width: 20 },
			{ key: "zoneName", width: 15 },
			{ key: "score", width: 25 },
			{ key: "evaluator", width: 30 },
			{ key: "sendDate", width: 15 },
			{ key: "resultDate", width: 15 }
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
				const title = this.state.dataSource[i].title;
				const position = this.state.dataSource[i].position;
				const zoneName = this.state.dataSource[i].zoneName;
				const score = this.state.dataSource[i].score;
				const evaluator = this.state.dataSource[i].evaluator;
				const sendDate = this.state.dataSource[i].sendDate;
				const resultDate = this.state.dataSource[i].resultDate;

				data.no = no;
				data.title = title;
				data.position = position;
				data.zoneName = zoneName;
				data.score = score;
				data.evaluator = evaluator;
				data.sendDate = sendDate;
				data.resultDate = resultDate;

				arrDatas.push(data);
			}

			arrDatas.forEach(function (item, index) {
				worksheet.addRow({
					no: item.no,
					title: item.title,
					position: item.position,
					zoneName: item.zoneName,
					score: item.score,
					evaluator: item.evaluator,
					sendDate: item.sendDate,
					resultDate: item.resultDate
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
	
	onCheckedRow(checked, i) {
		const dataSource = this.state.dataSource;
		//const dataLength = dataSource.length;
		dataSource[i].checked = checked;

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
			return [ui, false];
		}

		const dataSource = this.state.dataSource;
		const datacount = dataSource.length;

		let rowCount = 0;
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

			let type = "ZONE";
			if (dataSource[i].type === HistoryResource.AssessmentType.Environ)
				type = "안전";

			ui.push(
				<tr key={'dataSource_' + (i)}>
					<td><input type="checkbox" checked={dataSource[i].checked} onChange={(e) => this.onCheckedRow(e.target.checked, i)} /></td>
					<td>{/*(i + 1)*/dataSource[i].assessmentID}</td>
					{/* <td>{dataSource[i].title}</td> */}
					<td>{dataSource[i].position}</td>
					<td>{dataSource[i].zoneName}</td>
					<td>{dataSource[i].score}</td>
					<td>{dataSource[i].evaluator}</td>
					<td>{type}</td>
					<td>{dataSource[i].sendDate}</td>
					<td>{dataSource[i].updateDate}</td>
					<td><button className='detailBtn' onClick={() => { this.showPopup(dataSource[i]) }}>{i18n.t('history.formText.상세정보')}</button>
					</td>
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

	showPopup = (assessment) => {
		this.setState({ detailPopupShow: true, selectedAssessment: assessment });
    }

	closePopup = () => {
		this.setState({ detailPopupShow: false });
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

	render() {
		const [buildingGroupUI, buildingUI, zoneUI] = this.getSpatailUI();
		const pageIndexUI = this.getPageIndexUI();
		const [gridUI, allChecked] = this.getGridData();
		const { detailPopupShow } = this.state;

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
												<dt>{i18n.t('history.formText.평가등급')}</dt>
												<dd>
													{/* <ul className={'hscsLoc'}> */}
													 {/* <li> */}
													<select name="" id="" className={'selWh'} onChange={(e) => this.onChangeScore(e.target)}>
														<option value="-1">{i18n.t('common.전체')}</option>
														<option value="5">A</option>
														<option value="4">B</option>
														<option value="3">C</option>
														<option value="2">D</option>
														<option value="1">E</option>
													</select>
													{/* </li> */}
													{/*	<li> */}
												</dd>
											</dl>
										</li>
										<li>
											<dl>
												<dt>평가대상</dt>
												<dd>
													{/* <span className={'subjectEvaluation'}>평가대상</span> */}
													<select name="" id="" className={'selWh'} onChange={(e) => this.onChangeScore(e.target)}>
														<option value="-1">{i18n.t('common.전체')}</option>
														<option value="5">A</option>
														<option value="4">B</option>
														<option value="3">C</option>
														<option value="2">D</option>
														<option value="1">E</option>
													</select>
													{/*	</li> */}
													{/*	<li className='managerArea'> */}
                                                 </dd>
											</dl>
										</li>
									    <li>
											<dl>
												<dt><label htmlFor='manager'>{i18n.t('history.formText.수신자')}</label></dt>
												<dd>
													{/* <label htmlFor='manager'>{i18n.t('history.formText.수신자')}</label> */}
													<input type='text' value={this.state.selectedEvaluator} onChange={(e) => this.onChangeEvaluator(e)} className='managerInput' id='manager' autoComplete='off' />
													{/*	</li> */}
												    {/* </ul> */}
												</dd>
											</dl>
										</li>
									</ul>
									<dl>
										<dt>{i18n.t('common.위치')}</dt>
										<dd>
											<ul className={'hscsLoc'}>
												<li>
													<select name="" id="" onChange={(e) => this.onChangeBuildingGroup(e.target)} className={'selWh'}>
														{buildingGroupUI}
													</select>
												</li>
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
									<dl>
										<dt>{i18n.t('history.formText.제출기간')}</dt>
										<dd>
											<ul className={'hscsDate'}>
												<li>
													<div className={'datepicker'}>
														<DatePicker ref={this.refDatepicker01} name="datepicker01" id="datepicker01"
															dateFormat="yyyy-MM-dd"
															locale={ko}
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
															locale={ko}
															showYearDropdown // 년도 드롭다운 활성화
															showMonthDropdown // 월 드롭다운 활성화
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
									{
										this.state.loadingIndicator === true ?
											<a className={'hscsSbmt'} id={'hscsSbmting'}><span><span><CircularProgress className="spinner" /></span></span></a>
											:
											<a onClick={this.display} className={'hscsSbmt'}><span><span>{i18n.t('history.formText.검색')}</span></span></a>
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
											<col style={{ width: '5%' }} />
											<col style={{ width: '5%' }} />
											{/* <col style={{ width: '15%' }} /> */}
											<col style={{ width: '13%' }} />
											<col style={{ width: '12%' }} />
											<col style={{ width: '5%' }} />
											<col style={{ width: '10%' }} />
											<col style={{ width: '10%' }} />
											<col style={{ width: '10%' }} />
											<col style={{ width: '10%' }} />
											<col style={{ width: '10%' }} />
										</colgroup>
										<thead>
											<tr>
												<th><input type="checkbox" checked={allChecked} onChange={(e) => this.onCheckedRow(e.target.checked, -1)} /></th>
												<th>No.</th>
												{/* <th>{i18n.t('history.formText.항목명')}</th> */}
												<th>{i18n.t('common.위치')}</th>
												<th>{i18n.t('history.formText.관리구역')}</th>
												<th>{i18n.t('history.formText.평가등급')}</th>
												<th>{i18n.t('history.formText.수신자')}</th>
												<th>평가대상</th>
												<th>{i18n.t('history.formText.발송일자')}</th>
												<th>{i18n.t('history.formText.제출일자')}</th>
												<th>{i18n.t('history.formText.상세이력')}</th>
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
												<a className={'first'} onClick={() => this.setPageIndex(1)}>{i18n.t('history.formText.맨 앞')}</a>
												<a className={'prev'} onClick={() => this.setPageIndex(this.state.pageIndex - 1)}>{i18n.t('history.formText.이전')}</a>
											</>
											<ul>
												{pageIndexUI}
											</ul>
											<>
												<a className={'next'} onClick={() => this.setPageIndex(this.state.pageIndex + 1)}>{i18n.t('history.formText.다음')}</a>
												<a className={'last'} onClick={() => this.setPageIndex(this.state.maxPageIndex)}>{i18n.t('history.formText.맨 뒤')}</a>
											</>
										</div>
										: <> </>
								}

							</div>

						</div>
					</div>
				</div>

				{/* 상세정보 팝업 */}
				{
					detailPopupShow &&
					<SafetyAreaHistoryPopup closePopup={this.closePopup} assessment={this.state.selectedAssessment} selectedSiteID={this.props.selectedSiteID} />
				}
			</>
		);
	}
}

export default withTranslation()(SafetyAreaHistory);


// 상세정보 팝업
class SafetyAreaHistoryPopup extends Component {
	constructor(props) {
		super(props);

		this.state = {
			aList: [],
			memberScores: [],
			selectedScore: -1,
			selectedMemberName: '',
			scoreClasses: []
		}
	}

	componentDidMount() {
		this.onLoad();
	}

	async onLoad() {		
		let selectedSiteID = parseInt(this.props.selectedSiteID);
		if (selectedSiteID === NaN) {
			selectedSiteID = null;
		}

		const [aList, memberScores] = await HistoryController.DisplayAssessmentDetail(this.props.assessment.assessmentID, selectedSiteID);

		let [scoreClasses, message] = await HistoryController.LoadAssessmentClass(selectedSiteID);
		if (!scoreClasses)
			scoreClasses = [];

		this.setState({ aList, memberScores, scoreClasses });
	}

	onChangeScore = (selectedScore) => {
		if (selectedScore === this.state.selectedScore) {
			return;
		}

		this.setState({ selectedScore });
	}

	onChangeMember = (e) => {
		this.setState({ selectedMemberName: e.target.value });
	}

	onDownload = async () =>{
		const title = i18n.t('history.formText.안전점검표 상세정보');

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet(title); // sheet 이름

		// title		
		let titleRow = worksheet.getCell('A1');
		titleRow.value = title;

		titleRow.font = { name: '맑은 고딕', family: 4, size: 20, bold: true };
		worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

		worksheet.mergeCells('A1:B2');
		worksheet.getCell('A1:B2').border = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' }
		}

		//const beginDate = this.getMakeDateTime(this.state.beginDate);
		//const endDate = this.getMakeDateTime(this.state.endDate);
		//worksheet.addRow(['조회기간 : ' + beginDate + ' ~ ' + endDate]);
		//worksheet.addRow(['조회범위 : ' + this.state.searchZoneName]);

		worksheet.addRow([i18n.t('history.formText.평가명') + ' : ' + this.props.assessment.title]);
		worksheet.addRow([i18n.t('common.위치') + ' : ' + this.props.assessment.position]);
		worksheet.addRow([i18n.t('history.formText.관리구역') + ' : ' + this.props.assessment.zoneName]);
		worksheet.addRow([i18n.t('history.formText.평가등급') + ' : ' + this.props.assessment.score]);
		worksheet.addRow([i18n.t('history.formText.평가자') + ' : ' + this.props.assessment.evaluator]);
		worksheet.addRow([i18n.t('history.formText.평가기간') + ' : ' + this.props.assessment.sendDate + " ~ " + this.props.assessment.resultDate]);
		worksheet.addRow([]);

		const scoreClasses = this.state.scoreClasses;

		let score1 = 0;
		let score2 = 0;
		let score3 = 0;
		let score4 = 0;
		let score5 = 0;

		// column
		const memberScores = this.state.memberScores;
		if (memberScores) {
			const dataLength = memberScores.length;

			// 전체 평가자 데이터
			for (let i = 0; i < dataLength; i++) {
				const data = this.state.memberScores[i];

				const score = data.avgScore * 20;
				let classData = "-";

				for (let j = 0; j < scoreClasses?.length; j++) {
					const scoreClass = scoreClasses[j];

					if (score >= scoreClass.startScore && score <= scoreClass.endScore) {
						classData = scoreClass.className;
						break;
					}
				}

				if (classData === HistoryResource.AssessmentClass.A) {
					score5++;
				} else if (classData === HistoryResource.AssessmentClass.B) {
					score4++;
				} else if (classData === HistoryResource.AssessmentClass.C) {
					score3++;
				}

				//const strScore = data.avgScore === 5 ? 'A' : data.avgScore === 4 ? 'B' : data.avgScore === 3 ? 'C' : data.avgScore === 2 ? 'D' : data.avgScore === 1 ? 'E' : '';
				//const imgGradeLevel = data.avgScore === 5 ? grade_levelA : data.avgScore === 4 ? grade_levelB : data.avgScore === 3 ? grade_levelC : data.avgScore === 2 ? grade_levelD : data.avgScore === 1 ? grade_levelE : '';

				worksheet.addRow([data.memberName + ' / ' + i18n.t('history.formText.평가등급') + ' : ' + classData]);


				let columnRow = worksheet.addRow([i18n.t('history.formText.항목명'), i18n.t('history.formText.점수')]);
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
					{ key: "contents", width: 50 },
					{ key: "score", width: 10 }
				];

				// 개별 평가자 문항과 점수
				let arrDatas = [];				
				const aItemLength = data.aItems.length;
				for (let j = 0; j < aItemLength; j++) {
					const aItem = data.aItems[j];
					const contents = (j+1) + '. ' + aItem.contents;
					const score = aItem.score + i18n.t('history.formText.점');

					const arrData = {};
					arrData.contents = contents;
					arrData.score = score;
					arrDatas.push(arrData);
				}

				arrDatas.forEach(function (item, index) {
					worksheet.addRow({
						contents: item.contents,
						score: item.score
					}).alignment = { vertical: 'middle' };
				})

				worksheet.addRow([]);
			}
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

	getMemerScore() {
		const siteID = ProjectResource.SiteID;
		let scoreType = <></>;
		let memberList = [];
		if (!this.state.memberScores || this.state.memberScores.length === 0) {
			scoreType =
				<ul> 
					<li className='on'>{i18n.t('common.전체')} (0)</li>
					<li>A{i18n.t('history.formText.등급')} (0)</li>
					<li>B{i18n.t('history.formText.등급')} (0)</li>
					<li>C{i18n.t('history.formText.등급')} (0)</li>
				{/* <li>D{i18n.t('history.formText.등급')} (0)</li>
					<li>E{i18n.t('history.formText.등급')} (0)</li> */}
				</ul>;

			memberList.push(<></>);

			return [scoreType, memberList];
		}

		const scoreClasses = this.state.scoreClasses;

		let score1 = 0;
		let score2 = 0;
		let score3 = 0;
		let score4 = 0;
		let score5 = 0;

		const length = this.state.memberScores.length;
		for (let i = 0; i < length; i++) {
			const data = this.state.memberScores[i];

			if (data.scoreClass === HistoryResource.AssessmentClass.A) {
				score5++;
			}
			else if (data.scoreClass === HistoryResource.AssessmentClass.B) {
				score4++;
			}
			else if (data.scoreClass === HistoryResource.AssessmentClass.C) {
				score3++;
			}

			if (this.state.selectedMemberName.length > 0) {
				if (!data.memberName.includes(this.state.selectedMemberName)) {
					continue;
				}
			}

			if (this.state.selectedScore !== -1 && this.state.selectedScore !== data.scoreClass) {
				continue;
			}

			const items1 = [];
			const items2 = [];
			const items3 = [];
			const facilityItems = [];

			for (let i = 0; i < data?.aItems?.length; i++) {
				const aItem = data.aItems[i];

				if (data.type === HistoryResource.AssessmentType.EqZone) {
					if (i < 3) {
						items1.push(
							<div key={'zoneItems_' + i} className={'subClassContsFlex'}>
								<div className={'subClassFlex'}>
									<span className={'subClassConts'}>{(i + 1) + ". " + aItem.contents}</span>
									<span className={'subClassConts'}>{aItem.score}점</span>
								</div>
								<div type="text" className={'memoBox'}>{aItem.memo}</div>
							</div>
						);
					}
					else if (i < 10) {
						items2.push(
							<div key={'zoneItems_' + i} className={'subClassContsFlex'}>
								<div className={'subClassFlex'}>
									<span className={'subClassConts'}>{(i + 1) + ". " + aItem.contents}</span>
									<span className={'subClassConts'}>{aItem.score}점</span>
								</div>
								<div type="text" className={'memoBox'}>{aItem.memo}</div>
							</div>
						);
					}
					else {
						items3.push(
							<div key={'zoneItems_' + i} className={'subClassContsFlex'}>
								<div className={'subClassFlex'}>
									<span className={'subClassConts'}>{(i + 1) + ". " + aItem.contents}</span>
									<span className={'subClassConts'}>{aItem.score}점</span>
								</div>
								<div type="text" className={'memoBox'}>{aItem.memo}</div>
							</div>
						);
                    }					
				}
				else {
					items1.push(
						<div key={'zoneItems_' + i} className={'subClassContsFlex'}>
							<div className={'subClassFlex'}>
								<span className={'subClassConts'}>{(i + 1) + ". " + aItem.contents}</span>
								<span className={'subClassConts'}>{aItem.score}점</span>
							</div>
							<div type="text" className={'memoBox'}>{aItem.memo}</div>
						</div>
					);
                }				
			}

			let aItemTable = null;
			let type = null;

			if (data.type === HistoryResource.AssessmentType.EqZone) {
				aItemTable = (
					<>
						<div className='scroe-info'>

							<div className={'squareTitleBox'}><span className={'squareBox'}></span><span>공통 항목</span></div>
							<div className={'subClassBox'}>
								<span className={'subClassTitleBox'}>환경</span>
								{items1}
								<span className={'subClassTitleBox'}>방재</span>
								{items2}
								<span className={'subClassTitleBox'}>안전보건</span>
								{items3}
							</div>
						</div> {/* scroe-info */}
					</>
				);

				type = "ZONE";
			}
			else {
				aItemTable = (
					<>
						<div className='scroe-info'>

							<div className={'squareTitleBox'}><span className={'squareBox'}></span><span>안전환경평가 항목</span></div>
							<div className={'subClassBox'}>
								<span className={'subClassTitleBox'}>안전환경</span>
								{items1}
							</div>
						</div> {/* scroe-info */}
					</>
				);

				type = "안전";
            }
		
			//const strScore = data.avgScore === 5 ? 'A' : data.avgScore === 4 ? 'B' : data.avgScore === 3 ? 'C' : data.avgScore === 2 ? 'D' : data.avgScore === 1 ? 'E' : '';
			//const imgGradeLevel = data.avgScore === 5 ? grade_levelA : data.avgScore === 4 ? grade_levelB : data.avgScore === 3 ? grade_levelC : data.avgScore === 2 ? grade_levelD : data.avgScore === 1 ? grade_levelE : '';
			const imgGradeLevel = data.scoreClass === HistoryResource.AssessmentClass.A ? grade_levelA_wonik : data.scoreClass === HistoryResource.AssessmentClass.B ? grade_levelB_wonik : data.scoreClass === HistoryResource.AssessmentClass.C ? grade_levelC_wonik : "";
			memberList.push(
				<>
					<div className='user-info' key={'member_'+i}>
						<img src={user_icon} alt='유저아이콘' />
						<ul>
							<li>{data.memberName}</li>
							<li className='grade-wrap'>
								<span className='grade'>{type + ' 평가 등급' + ' : ' + data.scoreClass}</span>
								<div className='chart'>
									{/* 등급별 차트 이미지 */}
									{/* grade_levelA, grade_levelB, grade_levelC, grade_levelD, grade_levelE */}
									<img src={imgGradeLevel} alt='등급차트'/>
								</div>
							</li>
						</ul>
					</div>
					{aItemTable}
				</>
			);
		}
				
		scoreType =
			<ul>
				<li onClick={() => this.onChangeScore(-1)} className={this.state.selectedScore === -1 ? 'on' : ''}>{i18n.t('common.전체')}({score1 + score2 + score3 + score4 + score5})</li>
			    <li onClick={() => this.onChangeScore(HistoryResource.AssessmentClass.A)} className={this.state.selectedScore === HistoryResource.AssessmentClass.A ? 'on' : ''}>A{i18n.t('history.formText.등급')} ({score5})</li>
			    <li onClick={() => this.onChangeScore(HistoryResource.AssessmentClass.B)} className={this.state.selectedScore === HistoryResource.AssessmentClass.B ? 'on' : ''}>B{i18n.t('history.formText.등급')} ({score4})</li>
			    <li onClick={() => this.onChangeScore(HistoryResource.AssessmentClass.C)} className={this.state.selectedScore === HistoryResource.AssessmentClass.C ? 'on' : ''}>C{i18n.t('history.formText.등급')} ({score3})</li>
			</ul>;

		return [scoreType, memberList];
    }

	render() {
		const [scoreType, memberList] = this.getMemerScore();

		return (
			<SafetyAreaHistoryPopupComponent>
				<header>
					<div>
						<h1>{i18n.t('history.formText.안전점검표 상세정보')}</h1>
						<button onClick={() => this.onDownload()}>{i18n.t('history.formText.엑셀 다운로드')}</button>
					</div>
					<div>
						<a className={'close'} onClick={() => this.props.closePopup()}>{i18n.t('common.닫기')}</a>
					</div>
				</header>
				<section>
					<aside>
						{scoreType}
						<div className='search-area'>
							<input type="text" onChange={(e) => this.onChangeMember(e)} placeholder={i18n.t('history.formText.담당자명 검색')} />
							<a>{i18n.t('history.formText.검색')}</a>
						</div>
					</aside>
					
					<div className='content-wrap scrollbar'>
						<div>
							{memberList}
						</div>
					</div>

				</section>
			</SafetyAreaHistoryPopupComponent>
		);
	}
}