import React, { Component } from 'react';
import { getSearchMinDate } from '../util/searchDateLimit';
import $ from 'jquery';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale';
import btnCalendarBk from '../../Common/img/sub/dashboard_calendar_bk.png';
import btnCalendarBk_wonik from '../../Common/img/sub/dashboard_calendar_bk_wonik.png';

import CircularProgress from '@material-ui/core/CircularProgress';

import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/

import HistoryController from '../services/historyController';
import { formatNumber } from '../util/numberFormat';
import RepeatSpeedDetail from './RepeatSpeedDetail';
import ProjectResource from '../../Root/resource/id';
import { i18n, withTranslation } from '../../language/i18n';

// 전체 과속 이력 (원익 전용) - '과속차량 조회'(SpeedVehicleSearch) 화면의 기본 탭.
//    페이지 외곽(hsty/hsScr/hsCont)과 제목은 부모가 그리므로 여기서는 탭 내용만 반환한다.
//    위치 · 조회 기간 · 카메라 인식번호는 두 탭 공통 조건이라 부모가 props.criteria 로 내려주고,
//    값을 바꿀 때는 props.onChangeCriteria 로 부모에 알린다. (탭을 옮겨도 조건이 유지되도록)
//  - 반복 과속 의심차량 탭과 달리 "1회 과속"도, LPR 매칭이 안 된 건(미매칭)도 모두 보여준다.
//  - 과속 판정 기준(제한속도)은 BeaconServer 의 SpeedDetection:SpeedLimit 을 그대로 쓴다.
//    (초과속도 = 측정속도 - 제한속도)
//  - 매칭 시간차 = SdmsVehicleSpeedDetection.DiffSeconds (절대값). 값이 클수록 매칭 신뢰도가 낮다.
//  - 상세보기는 반복 과속 의심차량 탭과 같은 팝업(RepeatSpeedDetail)을 쓰며,
//    조회 기간 안에서 그 인식번호로 잡힌 모든 과속 건을 모아 보여준다. (미매칭 건은 상세보기 불가)
class SpeedAllHistory extends Component {
	static FALLBACK_SPEED_LIMIT = 25;         // BeaconServer 조회 실패 시 임시 기준값
	static PAGE_SIZES = [20, 50, 100];        // 페이지당 행 수 선택지

	constructor(props) {
		super(props);

		this.state = {
			cfg: this.getSpeedConfig(),

			speedLimit: SpeedAllHistory.FALLBACK_SPEED_LIMIT,   // BeaconServer 에서 받아옴

			sensors: [],

			rows: null,              // 과속 발생 이력 (null 이면 아직 조회 전)
			errorMessage: null,      // 조회 실패 사유 (서버 미기동 · 연결 실패 등)
			detailCarNo: null,       // 상세 팝업 대상 인식번호 (null 이면 닫힘)

			sortKey: 'time',         // 정렬 기준 (time | speed)
			sortDir: 'desc',         // 정렬 방향 (asc | desc)

			pageIndex: 1,
			pageSize: SpeedAllHistory.PAGE_SIZES[0],

			loadingIndicator: false,
		}

		this.refDatepicker01 = React.createRef();
		this.refDatepicker02 = React.createRef();

		this.lastQuery = null;   // 마지막으로 서버에 조회한 조건(위치 · 조회 기간). 탭 전환 시 재조회 판단용

		this.props = props;
		this.display = this.display.bind(this);

		this.init();
	}

	// appsettings.json Options.speedDetection - 상세 팝업의 개별 과속 위험도 기준
	getSpeedConfig() {
		const userInfo = ProjectResource.getUserInfo();
		const cfg = userInfo && userInfo.options ? userInfo.options.speedDetection : null;

		return {
			level1: cfg ? cfg.level1 : undefined,
			level2: cfg ? cfg.level2 : undefined,
			level3: cfg ? cfg.level3 : undefined,
		};
	}

	init = async () => {
		// 제한속도(과속 기준)를 BeaconServer 에서 받아온다. (실패 시 폴백값 유지)
		let speedLimit = await HistoryController.requestWonikSpeedLimit();
		if (speedLimit !== null && speedLimit !== undefined && speedLimit > 0) {
			this.state.speedLimit = speedLimit;
		}

		let result = await HistoryController.requestWonikSpeedDetectionSensors();

		let sensors = [];
		if (result !== null && result.success === true && result.sensors?.length > 0) {
			sensors = result.sensors;
		}

		this.state.sensors = sensors;

		this.display();
	}

	async display() {
		$("body").css("cursor", "wait");

		const criteria = this.props.criteria;

		const beginDate = this.getMakeDateTime(criteria.beginDate) + ' 00:00:00';
		const endDate = this.getMakeDateTime(criteria.endDate) + ' 23:59:59';

		if (beginDate > endDate) {
			$("body").css("cursor", "default");
			alert(i18n.t('history.formText.조회 기간을 다시 선택하세요'));
			return;
		}

		this.lastQuery = this.getQueryKey();

		await this.setState({ loadingIndicator: true });

		let selectedSensor = criteria.selectedSensor;
		if (selectedSensor === -1)
			selectedSensor = null;

		const result = await HistoryController.requestWonikSpeedDetectionHistorys(beginDate, endDate, selectedSensor);
		if (result === null || result === undefined || result.success === false) {
			// 실패를 조용히 삼키면 "조회 결과 0건" 과 구분이 안 된다. 사유를 화면에 남긴다.
			$("body").css("cursor", "default");
			this.setState({
				rows: null,
				errorMessage: (result && result.message) ? result.message : '과속 이력을 불러오지 못했습니다.',
				loadingIndicator: false,
			});
			return;
		}

		const datas = result.speedDetectionDatas || [];
		const speedLimit = this.state.speedLimit;

		// 과속(제한초과) 건만. 인식번호가 없는 건(미매칭)도 그대로 남긴다.
		const rows = [];
		for (let i = 0; i < datas.length; i++) {
			const d = datas[i];

			if (d.speed <= speedLimit) continue;

			rows.push({
				key: (d.id !== null && d.id !== undefined) ? ('d' + d.id) : ('i' + i),
				detectionTime: d.detectionTime,
				time: new Date(d.detectionTime),
				carNo: d.carNo || null,
				sensorName: d.sensorName || '-',
				speed: d.speed,
				diffSeconds: (d.diffSeconds === null || d.diffSeconds === undefined) ? null : Math.abs(d.diffSeconds),
			});
		}

		$("body").css("cursor", "default");

		this.setState({ rows, errorMessage: null, detailCarNo: null, pageIndex: 1, loadingIndicator: false });
	}

	componentDidUpdate(prevProps) {
		// 인식번호 필터가 바뀌면 (어느 탭에서 바꿨든) 첫 페이지부터 보여준다.
		if (prevProps.criteria.plateNumber !== this.props.criteria.plateNumber && this.state.pageIndex !== 1) {
			this.setState({ pageIndex: 1 });
		}

		// 탭이 다시 보이게 됐을 때, 공통 조건(위치 · 조회 기간)이 이 탭의 마지막 조회와 다르면 다시 조회한다.
		//   다른 탭에서 조건을 바꾸고 넘어온 경우다. 인식번호는 화면에서 거르는 필터라 재조회가 필요 없다.
		//   아직 첫 조회(init) 전이면 init 이 곧 조회하므로 건너뛴다.
		if (this.props.active && !prevProps.active && this.lastQuery !== null && this.lastQuery !== this.getQueryKey()) {
			this.display();
		}
	}

	// 서버 조회에 쓰이는 조건만 묶은 키 (위치 · 조회 기간)
	getQueryKey() {
		const c = this.props.criteria;
		return c.selectedSensor + '|' + this.getMakeDateTime(c.beginDate) + '|' + this.getMakeDateTime(c.endDate);
	}

	getMakeDateTime(dateTime) {
		let year = dateTime.getFullYear();
		let month = 1 + dateTime.getMonth();
		month = month >= 10 ? month : '0' + month;
		let day = dateTime.getDate();
		day = day >= 10 ? day : '0' + day;
		return year + '-' + month + '-' + day;
	}

	formatDateTime(d) {
		if (!d) return '-';
		const date = this.getMakeDateTime(d);
		let hour = d.getHours(); hour = hour >= 10 ? hour : '0' + hour;
		let min = d.getMinutes(); min = min >= 10 ? min : '0' + min;
		let sec = d.getSeconds(); sec = sec >= 10 ? sec : '0' + sec;
		return date + ' ' + hour + ':' + min + ':' + sec;
	}

	onChangeSensor = (target) => {
		this.props.onChangeCriteria({ selectedSensor: Number(target.value) });
	}

	onChangePlateNumber = (e) => {
		this.props.onChangeCriteria({ plateNumber: e.target.value });
	}

	onChangeBegin = (date) => {
		this.props.onChangeCriteria({ beginDate: date });
	}

	onChangeEnd = (date) => {
		this.props.onChangeCriteria({ endDate: date });
	}

	onClickDatepicker01 = () => {
		this.refDatepicker01.current.setOpen(true);
	}

	onClickDatepicker02 = () => {
		this.refDatepicker02.current.setOpen(true);
	}

	// 정렬 - 같은 컬럼을 다시 누르면 방향만 바뀐다. (기본: 발생일시 내림차순)
	onClickSort = (key) => {
		if (this.state.sortKey === key) {
			this.setState({ sortDir: this.state.sortDir === 'desc' ? 'asc' : 'desc', pageIndex: 1 });
		}
		else {
			this.setState({ sortKey: key, sortDir: 'desc', pageIndex: 1 });
		}
	}

	onChangePageSize = (e) => {
		this.setState({ pageSize: Number(e.target.value), pageIndex: 1 });
	}

	onClickDetail = (carNo) => {
		if (!carNo) return;   // 미매칭 건은 모아볼 인식번호가 없다.
		this.setState({ detailCarNo: carNo });
	}

	closeDetail = () => {
		this.setState({ detailCarNo: null });
	}

	setPageIndex(index, maxPageIndex) {
		if (index < 1 || index > maxPageIndex || index === this.state.pageIndex) return;
		this.setState({ pageIndex: index });
	}

	// 카메라 인식번호 필터 적용 (입력이 있으면 미매칭 건은 제외된다)
	getFilteredRows() {
		const rows = this.state.rows || [];

		const plate = (this.props.criteria.plateNumber || '').trim();
		if (plate.length < 1) {
			return rows;
		}

		return rows.filter(r => r.carNo && r.carNo.indexOf(plate) >= 0);
	}

	getSortedRows(rows) {
		const key = this.state.sortKey;
		const sign = this.state.sortDir === 'desc' ? -1 : 1;

		const sorted = rows.slice();
		sorted.sort((a, b) => {
			if (key === 'speed') {
				return sign * ((a.speed - b.speed) || (a.time - b.time));
			}
			return sign * ((a.time - b.time) || (a.speed - b.speed));
		});

		return sorted;
	}

	// 조회 결과 요약 (통계 카드) - 화면에 보이는 목록(필터 적용 후) 기준
	getSummary(rows) {
		if (rows.length < 1) {
			return null;
		}

		const locs = {};
		let noMatch = 0;
		let top = rows[0];

		for (let i = 0; i < rows.length; i++) {
			const r = rows[i];

			locs[r.sensorName] = (locs[r.sensorName] || 0) + 1;
			if (!r.carNo) noMatch++;
			if (r.speed > top.speed) top = r;
		}

		let mainLoc = '-';
		let mainLocCount = 0;
		for (const name in locs) {
			if (locs[name] > mainLocCount) { mainLocCount = locs[name]; mainLoc = name; }
		}

		return { total: rows.length, noMatch, mainLoc, mainLocCount, top };
	}

	getSensorUI() {
		let sensorUI = [];
		sensorUI.push(<option key={'sensorOption_-1'} value="-1">{i18n.t('common.전체')}</option>);

		const sensors = this.state.sensors;
		if (!sensors || sensors.length < 1) {
			return sensorUI;
		}

		for (let i = 0; i < sensors.length; i++) {
			const sensor = sensors[i];
			sensorUI.push(<option key={'sensorOption_' + sensor.id} value={sensor.id}>{sensor.name}</option>);
		}
		return sensorUI;
	}

	getSortMark(key) {
		if (this.state.sortKey !== key) return '⇅';
		return this.state.sortDir === 'desc' ? '↓' : '↑';
	}

	getDiffClass(diff) {
		if (diff === null || diff === undefined) return '';
		if (diff < 2) return 'diffLow';
		if (diff < 4) return 'diffMid';
		return 'diffHigh';
	}

	getPageIndexUI(maxPageIndex) {
		let ui = [];
		const pageIndex = this.state.pageIndex;

		let start = Math.max(1, pageIndex - 2);
		let end = Math.min(maxPageIndex, start + 4);
		start = Math.max(1, end - 4);

		for (let i = start; i <= end; i++) {
			ui.push(
				<li key={'page_' + i} className={i === pageIndex ? 'on' : ''}>
					<a onClick={() => this.setPageIndex(i, maxPageIndex)}>{formatNumber(i)}</a>
				</li>
			);
		}
		return ui;
	}

	// Excel 다운로드 - 현재 조회 결과(필터 + 정렬 적용) 전체를 내보낸다.
	onClickExcelDownload = async () => {
		const title = '전체 과속 발생 이력';
		const speedLimit = this.state.speedLimit;

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet(title);

		// 제목
		worksheet.mergeCells('A1:H2');
		const titleCell = worksheet.getCell('A1');
		titleCell.value = title;
		titleCell.font = { name: '맑은 고딕', family: 4, size: 20, bold: true };
		titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

		// 조회 기간
		const beginDate = this.getMakeDateTime(this.props.criteria.beginDate);
		const endDate = this.getMakeDateTime(this.props.criteria.endDate);
		worksheet.addRow([i18n.t('history.formText.조회 기간') + ' : ' + beginDate + ' ~ ' + endDate]);

		// 요약 (통계 카드 값)
		const list = this.getSortedRows(this.getFilteredRows());
		const summary = this.getSummary(list);

		worksheet.addRow([]);
		const statTitleRow = worksheet.addRow(['[ 통계 ]']);
		statTitleRow.getCell(1).font = { bold: true };

		worksheet.addRow(['주요 발생 위치 : ' + (summary ? (summary.mainLoc + ' · ' + formatNumber(summary.mainLocCount) + '건') : '-')]);
		worksheet.addRow(['과속 발생 건수 : ' + (summary ? (formatNumber(summary.total) + '건 (미매칭 ' + formatNumber(summary.noMatch) + '건 포함)') : '0건')]);
		worksheet.addRow(['최고속도 차량 : ' + (summary ? ((summary.top.carNo || '미매칭') + ' · ' + summary.top.speed + 'km/h · ' + summary.top.sensorName) : '-')]);
		worksheet.addRow([]);

		// 헤더
		const columnRow = worksheet.addRow(['번호', '발생일시', '카메라 인식번호', '위치', '측정속도', '제한속도', '초과속도', '매칭 시간차']);
		columnRow.eachCell((cell) => {
			cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFA24B40' } };
			cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
			cell.alignment = { vertical: 'middle', horizontal: 'center' };
			cell.border = {
				top: { style: 'thin' }, left: { style: 'thin' },
				bottom: { style: 'thin' }, right: { style: 'thin' }
			}
		});

		worksheet.columns = [
			{ key: "no", width: 8 },
			{ key: "time", width: 22 },
			{ key: "carNo", width: 18 },
			{ key: "loc", width: 24 },
			{ key: "speed", width: 12 },
			{ key: "limit", width: 12 },
			{ key: "over", width: 12 },
			{ key: "diff", width: 14 },
		];

		for (let i = 0; i < list.length; i++) {
			const r = list[i];
			const dataRow = worksheet.addRow({
				no: i + 1,
				time: this.formatDateTime(r.time),
				carNo: r.carNo || '미매칭',
				loc: r.sensorName,
				speed: r.speed + 'km/h',
				limit: speedLimit + 'km/h',
				over: '+' + (r.speed - speedLimit) + 'km/h',
				diff: r.diffSeconds === null ? '-' : (r.diffSeconds.toFixed(1) + '초'),
			});
			dataRow.alignment = { vertical: 'middle', horizontal: 'center' };
			dataRow.getCell('no').numFmt = '#,##0';   // 숫자는 숫자 그대로 두고 천 단위 쉼표 서식만 준다 (엑셀에서 정렬 · 계산 가능)
		}

		// 다운로드
		const mimeType = { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
		const buffer = await workbook.xlsx.writeBuffer();
		const blob = new Blob([buffer], mimeType);

		const dtNow = new Date();
		const date = this.getMakeDateTime(dtNow).replace(/-/gi, '');
		saveAs(blob, title + '_' + date + ".xlsx");
	}

	render() {
		const sensorUI = this.getSensorUI();
		const calendarImg = ProjectResource.styleMode === ProjectResource.StyleType.Soulbrain ? btnCalendarBk : btnCalendarBk_wonik;

		const today = new Date();
		const minDate = getSearchMinDate();

		const speedLimit = this.state.speedLimit;

		// --- 목록 (필터 + 정렬 + 페이지) ---
		const list = this.getSortedRows(this.getFilteredRows());
		const summary = this.getSummary(list);

		const pageSize = this.state.pageSize;
		const maxPageIndex = Math.max(1, Math.ceil(list.length / pageSize));
		const pageIndex = Math.min(this.state.pageIndex, maxPageIndex);
		const beginRow = (pageIndex - 1) * pageSize;
		const pageRows = list.slice(beginRow, beginRow + pageSize);

		return (
			<>
				{/* 검색(필터) 바 */}
				<form action="">
					<div className={'hscSch'}>
						<dl>
							<dt>{i18n.t('common.위치')}</dt>
							<dd>
								<ul className={'hscsLoc'}>
									<li>
										<select value={this.props.criteria.selectedSensor} onChange={(e) => this.onChangeSensor(e.target)} className={'selWh'}>
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
												showYearDropdown
												showMonthDropdown
												minDate={minDate}
												maxDate={today}
												selected={this.props.criteria.beginDate}
												onChange={date => this.onChangeBegin(date)} />
											<img src={calendarImg} alt="" className={'btnCalendarBk'} onClick={this.onClickDatepicker01} />
										</div>
									</li>
									<li>~</li>
									<li>
										<div className={'datepicker'}>
											<DatePicker ref={this.refDatepicker02} name="datepicker02" id="datepicker02"
												dateFormat="yyyy-MM-dd"
												locale={ko}
												showYearDropdown
												showMonthDropdown
												minDate={minDate}
												maxDate={today}
												selected={this.props.criteria.endDate}
												onChange={date => this.onChangeEnd(date)} />
											<img src={calendarImg} alt="" className={'btnCalendarBk'} onClick={this.onClickDatepicker02} />
										</div>
									</li>
								</ul>
							</dd>
						</dl>
						<dl>
							<dt>카메라 인식번호</dt>
							<dd>
								<ul className={'hscsNum'}>
									<li>
										<input type="text" value={this.props.criteria.plateNumber} onChange={this.onChangePlateNumber} placeholder="번호를 입력하세요" />
									</li>
								</ul>
							</dd>
						</dl>
						<div className={'hscsBtns'}>
							{
								this.state.loadingIndicator === true ?
									<a className={'hscsSbmt'} id={'hscsSbmting'}><span><span><CircularProgress className="spinner" /></span></span></a>
									:
									<a onClick={this.display} className={'hscsSbmt'}><span><span>{i18n.t('history.formText.검색')}</span></span></a>
							}
						</div>
					</div>
				</form>

				{/* 통계 카드 3개 */}
				<div className={'ahCards'}>
					<div className={'card'}>
						<span className={'cardIcon icoLoc'} />
						<div className={'cardText'}>
							<p className={'cardTitle'}>주요 발생 위치</p>
							<div className={'cardMain'}>
								<p className={'cardValue'}>{summary ? summary.mainLoc : '-'}</p>
								<p className={'cardSub'}>{summary ? (formatNumber(summary.mainLocCount) + '건 · 조회 결과 중 최다 발생') : '조회 결과 없음'}</p>
							</div>
						</div>
					</div>
					<div className={'card'}>
						<span className={'cardIcon icoCount'} />
						<div className={'cardText'}>
							<p className={'cardTitle'}>과속 발생 건수</p>
							<div className={'cardMain'}>
								<p className={'cardValue'}>{this.state.rows ? formatNumber(list.length) : '-'}<small>건</small></p>
								<p className={'cardSub'}>{summary ? ('미매칭 ' + formatNumber(summary.noMatch) + '건 포함') : '조회 결과 없음'}</p>
							</div>
						</div>
					</div>
					<div className={'card'}>
						<span className={'cardIcon icoSpeed'} />
						<div className={'cardText'}>
							<p className={'cardTitle'}>최고속도 차량</p>
							<div className={'cardMain'}>
								<p className={'cardValue'}>{summary ? (summary.top.carNo || '미매칭') : '-'}</p>
								<p className={'cardSub'}>
									{
										summary ?
											<>
												<span className={'spdOver'}>최고속도 {summary.top.speed}km/h</span>
												<span className={'cardSubLoc'}>{summary.top.sensorName}</span>
											</>
											: '조회 결과 없음'
									}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* 조회 실패 안내 */}
				{
					this.state.errorMessage &&
					<div className={'rsNotice error'}>
						<span>!</span>
						<span>{this.state.errorMessage}</span>
					</div>
				}

				{/* 안내 문구 */}
				<div className={'rsNotice'}>
					<span>ⓘ</span>
					<span>인식번호는 장비 간 시각을 기준으로 매칭한 결과이며, 실제 차량번호와 다를 수 있습니다.</span>
				</div>

				{/* 전체 과속 발생 이력 테이블 */}
				<div className={'hscTbHead'}>
					<div className={'hscTbHeadText'}>
						<h3>전체 과속 발생 이력</h3>
						<p className={'hscTbDesc'}>1회 과속을 포함한 모든 발생 이력을 조회합니다.</p>
					</div>
					<ul className={'hscExl'}>
						<li><a onClick={this.onClickExcelDownload} className={'exl'}>Excel 다운로드</a></li>
					</ul>
				</div>

				<div className={'hscTb'}>
					<div className={'scrTb'}>
						<table>
							<colgroup>
								<col style={{ width: '5%' }} />
								<col style={{ width: '16%' }} />
								<col style={{ width: '14%' }} />
								<col style={{ width: '13%' }} />
								<col style={{ width: '10%' }} />
								<col style={{ width: '9%' }} />
								<col style={{ width: '9%' }} />
								<col style={{ width: '12%' }} />
								<col style={{ width: '12%' }} />
							</colgroup>
							<thead>
								<tr>
									<th>번호</th>
									<th>
										<a className={'sortTh' + (this.state.sortKey === 'time' ? ' on' : '')} onClick={() => this.onClickSort('time')}>
											{i18n.t('history.formText.발생일시')}<span className={'sortMark'}>{this.getSortMark('time')}</span>
										</a>
									</th>
									<th>카메라 인식번호</th>
									<th>{i18n.t('common.위치')}</th>
									<th>
										<a className={'sortTh' + (this.state.sortKey === 'speed' ? ' on' : '')} onClick={() => this.onClickSort('speed')}>
											측정속도<span className={'sortMark'}>{this.getSortMark('speed')}</span>
										</a>
									</th>
									<th>제한속도</th>
									<th>초과속도</th>
									<th>매칭 시간차</th>
									<th>이력</th>
								</tr>
							</thead>
							<tbody>
								{
									pageRows.map((r, i) => (
										<tr key={r.key}>
											<td>{formatNumber(beginRow + i + 1)}</td>
											<td>{this.formatDateTime(r.time)}</td>
											<td>
												{
													r.carNo ?
														<span>{r.carNo}</span>
														:
														<span className={'plateNone'}>미매칭</span>
												}
											</td>
											<td>{r.sensorName}</td>
											<td className={'spdOver'}>{r.speed}km/h</td>
											<td>{speedLimit}km/h</td>
											<td className={'spdOver'}>+{r.speed - speedLimit}km/h</td>
											<td className={this.getDiffClass(r.diffSeconds)}>{r.diffSeconds === null ? '—' : (r.diffSeconds.toFixed(1) + '초')}</td>
											<td>
												{
													r.carNo ?
														<a className={'detailBtn'} onClick={() => this.onClickDetail(r.carNo)}>상세보기</a>
														:
														<span className={'detailBtn disabled'}>상세보기</span>
												}
											</td>
										</tr>
									))
								}
								{
									(this.state.rows && list.length === 0) &&
									<tr><td colSpan={9} style={{ textAlign: 'center', padding: '30px 0', color: '#999' }}>조회된 과속 이력이 없습니다.</td></tr>
								}
							</tbody>
						</table>
					</div>

					<div className={'hscTbFoot'}>
						<span className={'footCnt'}>
							{
								list.length > 0 ?
									('총 ' + formatNumber(list.length) + '건 중 ' + formatNumber(beginRow + 1) + '~' + formatNumber(beginRow + pageRows.length) + '건 표시')
									: '총 0건'
							}
						</span>

						{
							list.length > 0 ?
								<div className={'hscNav'}>
									<>
										<a className={'first'} onClick={() => this.setPageIndex(1, maxPageIndex)}>{i18n.t('history.formText.맨 앞')}</a>
										<a className={'prev'} onClick={() => this.setPageIndex(pageIndex - 1, maxPageIndex)}>{i18n.t('history.formText.이전')}</a>
									</>
									<ul>
										{this.getPageIndexUI(maxPageIndex)}
									</ul>
									<>
										<a className={'next'} onClick={() => this.setPageIndex(pageIndex + 1, maxPageIndex)}>{i18n.t('history.formText.다음')}</a>
										<a className={'last'} onClick={() => this.setPageIndex(maxPageIndex, maxPageIndex)}>{i18n.t('history.formText.맨 뒤')}</a>
									</>
								</div>
								:
								<div className={'hscNav'} />
						}

						<select value={this.state.pageSize} onChange={this.onChangePageSize} className={'selWh footPageSize'}>
							{
								SpeedAllHistory.PAGE_SIZES.map(n => (
									<option key={'pageSize_' + n} value={n}>{n}개씩</option>
								))
							}
						</select>
					</div>
				</div>

				{
					this.state.detailCarNo &&
					(() => {
						const carNo = this.state.detailCarNo;
						const dets = (this.state.rows || []).filter(r => r.carNo === carNo);
						return (
							<RepeatSpeedDetail
								carNo={carNo}
								risk={null}
								detections={dets}
								speedLimit={this.state.speedLimit}
								levels={{ level1: this.state.cfg.level1, level2: this.state.cfg.level2, level3: this.state.cfg.level3 }}
								beginDate={this.getMakeDateTime(this.props.criteria.beginDate)}
								endDate={this.getMakeDateTime(this.props.criteria.endDate)}
								onClose={this.closeDetail}
							/>
						);
					})()
				}
			</>
		);
	}
}

export default withTranslation()(SpeedAllHistory);
