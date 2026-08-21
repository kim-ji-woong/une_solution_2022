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

import SDMSController from '../../SDMS/services/sdmsController';


import CircularProgress from '@material-ui/core/CircularProgress';

import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/

import HistoryResource from "../resource/id";
import ProjectResource from '../../Root/resource/id';

import { SafetyAreaHistoryPopupComponent } from '../styled/SensorDetectHistoryStyled';
import { i18n, withTranslation, i18nUtil } from '../../language/i18n';

class SpeedDetectionHistory extends Component {
	constructor(props) {
		super(props);

		this.state = {



			dataSource: null,


			dateType: 'today',




			sensors: [],
			selectedSensor: -1,

			beginDate: new Date(),
			endDate: new Date(),

			
			maxRowCount: 10,  // 한 페이지에 보여줄 data row 수
			maxPageCount: 5, // 한번에 보여줄 페이지 개수
			
			pageIndex: 1,    // 현재 페이지
			minPageIndex: 1, // 최소 페이지 Index
			maxPageIndex: 1, // 최대 페이지 Index
			
			loadingIndicator: false, // 새로고침중인지 표시

		}

		this.refDatepicker01 = React.createRef();
		this.refDatepicker02 = React.createRef();

		this.props = props;
		this.display = this.display.bind(this);
		this.onClickDownload = this.onClickDownload.bind(this);

		this.init();
	}

	init = async () => {
		// 위치 불러오기
		let result = await HistoryController.requestWonikSpeedDetectionSensors();

		let sensors = [];

		if (result !== null && result.success === true && result.sensors?.length > 0) {
			sensors = result.sensors;
		}

		this.state.sensors = sensors;

		this.display();
    }

	componentDidMount() {

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
		
		let selectedSensor = this.state.selectedSensor;
		if (selectedSensor === -1)
			selectedSensor = null;


		const result = await HistoryController.requestWonikSpeedDetectionHistorys(beginDate, endDate, selectedSensor);
		if (result === null || result === undefined || result.success === false) {
			$("body").css("cursor", "default");
			await this.setState({ loadingIndicator: false })
			return;
		}

		let dataSource = result.speedDetectionDatas;
		
		const datacount = dataSource?.length;

		if (datacount > 1) {
			dataSource = dataSource.sort((a, b) => new Date(b.detectionTime) - new Date(a.detectionTime));
        }

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

	onChangeSensor = (target) => {
		this.setState({ selectedSensor: Number(target.value) });
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
		const title = '차량과속 이력';

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet(title); // sheet 이름

		// title		
		let titleRow = worksheet.getCell('A1');
		titleRow.value = title;

		titleRow.font = { name: '맑은 고딕', family: 4, size: 20, bold: true };
		worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

		worksheet.mergeCells('A1:D2');
		worksheet.getCell('A1:D2').border = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' }
		}

		const beginDate = this.getMakeDateTime(this.state.beginDate);
		const endDate = this.getMakeDateTime(this.state.endDate);
		worksheet.addRow([i18n.t('history.formText.조회 기간') + ' : ' + beginDate + ' ~ ' + endDate]);
		worksheet.addRow([]);

		// column
		let columnRow = worksheet.addRow(['No', i18n.t('history.formText.일시'), i18n.t('common.위치'), '속도']);
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
			{ key: "detectionTime", width: 20 },
			{ key: "sensorName", width: 20 },
			{ key: "speed", width: 15 }
		];

		if (this.state.dataSource) {
			let arrDatas = [];
			const dataLength = this.state.dataSource.length;
			for (let i = 0; i < dataLength; i++) {
				let data = {};

				const checked = this.state.dataSource[i].checked;
				if (isCheckedDownload && !checked) {
					continue;
				}

				const no = arrDatas.length + 1;

				let detectionTime = this.state.dataSource[i].detectionTime;
				detectionTime = detectionTime.replace("T", " ");

				const sensorName = this.state.dataSource[i].sensorName;
				const speed = this.state.dataSource[i].speed;
				
				data.no = no;
				data.detectionTime = detectionTime;
				data.sensorName = sensorName;
				data.speed = speed;

				arrDatas.push(data);
			}

			arrDatas.forEach(function (item, index) {
				worksheet.addRow({
					no: item.no,
					detectionTime: item.detectionTime,
					sensorName: item.sensorName,
					speed: item.speed
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

			let detectionTime = dataSource[i].detectionTime;
			detectionTime = detectionTime.replace("T", " ");

			ui.push(
				<tr key={'dataSource_' + (i)}>
					<td><input type="checkbox" checked={dataSource[i].checked} onChange={(e) => this.onCheckedRow(e.target.checked, i)} /></td>
					<td>{(i + 1)}</td>
					<td>{detectionTime}</td>
					<td>{dataSource[i].sensorName}</td>
					<td>{dataSource[i].speed}</td>
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

	getSensorUI() {
		let sensorUI = [];

		sensorUI.push(<option key={'sensorOption_-1'} value="-1">{i18n.t('common.전체')}</option>);

		if (this.state.sensors < 1) {
			return sensorUI;
		}

		const sensors = this.state.sensors;
		for (let i = 0; i < sensors.length; i++) {
			const sensor = this.state.sensors[i];

			sensorUI.push(<option key={'sensorOption_' + sensor.id} value={sensor.id} >{sensor.name}</option>);
		}

		return sensorUI;
	}

	onClickDatepicker01 = () => {
		this.refDatepicker01.current.setOpen(true);
	}

	onClickDatepicker02 = () => {
		this.refDatepicker02.current.setOpen(true);
	}

	render() {
		const sensorUI = this.getSensorUI();
		const pageIndexUI = this.getPageIndexUI();
		const [gridUI, allChecked] = this.getGridData();

		return (
			<>
				<div id={'hsty'}>
					<div className={'hsScr'}>
						<div id={'hsCont'}>
							<form action="">
								<div className={'hscSch'}>									
									<dl>
										<dt>{i18n.t('common.위치')}</dt>
										<dd>
											<ul className={'hscsLoc'}>
												<li>
													<select name="" id="" onChange={(e) => this.onChangeSensor(e.target)} className={'selWh'}>
														{sensorUI}
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
															locale={ko}
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
											<col style={{ width: '45%' }} />
											<col style={{ width: '30%' }} />
											<col style={{ width: '15%' }} />
										</colgroup>
										<thead>
											<tr>
												<th><input type="checkbox" checked={allChecked} onChange={(e) => this.onCheckedRow(e.target.checked, -1)} /></th>
												<th>No.</th>
												<th>{i18n.t('history.formText.일시')}</th>
												<th>{i18n.t('common.위치')}</th>												
												<th>속도</th>
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

			</>
		);
	}
}

export default withTranslation()(SpeedDetectionHistory);