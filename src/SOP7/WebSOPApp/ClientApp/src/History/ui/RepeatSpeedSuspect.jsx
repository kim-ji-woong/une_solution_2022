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
import RepeatSpeedDetail from './RepeatSpeedDetail';
import ProjectResource from '../../Root/resource/id';
import { i18n, withTranslation } from '../../language/i18n';

// 반복 과속 의심차량 (원익 전용)
//  - 동일 차량번호(CarNo, LPR 인식번호)별 과속 횟수를 집계하고 위험도를 분류한다.
//  - 위험도 기준/측정기간은 appsettings.json 의 Options.speedDetection 에서 온다.
//      caution(주의) / warning(경고) / alert(집중관리) : 측정기간 내 과속 횟수 임계값
//      period / periodType : 측정기간 (예: 1 year → 최근 1년)
//  - 평균 매칭 시간차 = SdmsVehicleSpeedDetection.DiffSeconds 의 평균(절대값)
//  - Excel 다운로드 / 상세보기 버튼은 UI만. 동작은 추후 구현 예정.
class RepeatSpeedSuspect extends Component {
	static FALLBACK_SPEED_LIMIT = 25;  // BeaconServer 조회 실패 시 임시 기준값
	static PAGE_SIZE = 10;    // 한 페이지에 표시할 최대 행 수(고정)

	constructor(props) {
		super(props);

		const cfg = this.getSpeedConfig();

		this.state = {
			cfg: cfg,

			speedLimit: RepeatSpeedSuspect.FALLBACK_SPEED_LIMIT,   // BeaconServer 에서 받아옴

			sensors: [],
			selectedSensor: -1,

			beginDate: new Date(),   // 기본값: 오늘
			endDate: new Date(),

			plateNumber: '',              // 카메라 인식번호 필터
			riskFilter: 'all',            // 위험도 필터 (all | 집중관리 | 경고 | 주의)
			rank: 5,                      // 표시 순위 (Top N = 페이지당 행 수)

			suspects: null,               // 집계 결과 (차량번호별)
			detections: [],               // 과속(제한초과 & 차량번호 有) 원본 감지 목록 (상세 팝업용)
			detailCarNo: null,            // 상세 팝업 대상 차량번호 (null 이면 닫힘)

			pageIndex: 1,

			loadingIndicator: false,
		}

		this.refDatepicker01 = React.createRef();
		this.refDatepicker02 = React.createRef();

		this.props = props;
		this.display = this.display.bind(this);

		this.init();
	}

	// appsettings.json Options.speedDetection
	getSpeedConfig() {
		const userInfo = ProjectResource.getUserInfo();
		const cfg = userInfo && userInfo.options ? userInfo.options.speedDetection : null;

		return {
			caution: (cfg && cfg.caution != null) ? cfg.caution : 1,
			warning: (cfg && cfg.warning != null) ? cfg.warning : 2,
			alert: (cfg && cfg.alert != null) ? cfg.alert : 3,
			period: (cfg && cfg.period != null) ? cfg.period : 1,
			periodType: (cfg && cfg.periodType) ? cfg.periodType : 'year',
			// 개별 과속 위험도(상세 팝업)용 초과속도 임계값
			level1: cfg ? cfg.level1 : undefined,
			level2: cfg ? cfg.level2 : undefined,
			level3: cfg ? cfg.level3 : undefined,
		};
	}

	// 과속 횟수 -> 위험도
	classifyRisk(count, cfg) {
		if (count >= cfg.alert) return { label: '집중관리', lv: 4 };
		if (count >= cfg.warning) return { label: '경고', lv: 3 };
		if (count >= cfg.caution) return { label: '주의', lv: 2 };
		return null;
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

		const beginDate = this.getMakeDateTime(this.state.beginDate) + ' 00:00:00';
		const endDate = this.getMakeDateTime(this.state.endDate) + ' 23:59:59';

		if (beginDate > endDate) {
			$("body").css("cursor", "default");
			alert(i18n.t('history.formText.조회 기간을 다시 선택하세요'));
			return;
		}

		await this.setState({ loadingIndicator: true });

		let selectedSensor = this.state.selectedSensor;
		if (selectedSensor === -1)
			selectedSensor = null;

		const result = await HistoryController.requestWonikSpeedDetectionHistorys(beginDate, endDate, selectedSensor);
		if (result === null || result === undefined || result.success === false) {
			$("body").css("cursor", "default");
			await this.setState({ loadingIndicator: false });
			return;
		}

		const cfg = this.state.cfg;
		const datas = result.speedDetectionDatas || [];

		// 차량번호(CarNo)별 집계 - 과속(제한초과) & 차량번호가 있는 건만
		const groups = {};
		const detections = [];   // 상세 팝업용 원본 감지 목록
		for (let i = 0; i < datas.length; i++) {
			const d = datas[i];

			if (d.speed <= this.state.speedLimit) continue;   // 과속만
			const plate = d.carNo;
			if (!plate) continue;                                      // 차량번호 없으면 제외

			detections.push({ carNo: plate, detectionTime: d.detectionTime, speed: d.speed, sensorName: d.sensorName, diffSeconds: d.diffSeconds });

			let g = groups[plate];
			if (!g) {
				g = groups[plate] = { carNo: plate, count: 0, sumSpeed: 0, maxSpeed: 0, sumDiff: 0, diffCount: 0, lastTime: null, locs: {} };
			}

			g.count++;
			g.sumSpeed += d.speed;
			if (d.speed > g.maxSpeed) g.maxSpeed = d.speed;

			if (d.diffSeconds !== null && d.diffSeconds !== undefined) {
				g.sumDiff += Math.abs(d.diffSeconds);
				g.diffCount++;
			}

			const t = new Date(d.detectionTime);
			if (!g.lastTime || t > g.lastTime) g.lastTime = t;

			const loc = d.sensorName || '-';
			g.locs[loc] = (g.locs[loc] || 0) + 1;
		}

		let suspects = Object.keys(groups).map(key => {
			const g = groups[key];
			const risk = this.classifyRisk(g.count, cfg);

			// 주요 발생위치
			let mainLoc = '-';
			let mc = 0;
			for (const k in g.locs) {
				if (g.locs[k] > mc) { mc = g.locs[k]; mainLoc = k; }
			}

			return {
				carNo: g.carNo,
				count: g.count,
				avgSpeed: Math.round(g.sumSpeed / g.count),
				maxSpeed: g.maxSpeed,
				avgDiff: g.diffCount > 0 ? (g.sumDiff / g.diffCount) : null,
				lastTime: g.lastTime,
				mainLoc: mainLoc,
				risk: risk,
			};
		}).filter(s => s.risk !== null);  // 임계값(주의) 이상만 의심차량

		// 과속 횟수 내림차순 (동점이면 최고속도)
		suspects.sort((a, b) => (b.count - a.count) || (b.maxSpeed - a.maxSpeed));

		$("body").css("cursor", "default");

		this.setState({ suspects, detections, detailCarNo: null, pageIndex: 1, loadingIndicator: false });
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
		return date + ' ' + hour + ':' + min;
	}

	onChangeSensor = (target) => {
		this.setState({ selectedSensor: Number(target.value) });
	}

	onChangePlateNumber = (e) => {
		this.setState({ plateNumber: e.target.value, pageIndex: 1 });
	}

	onChangeRiskFilter = (e) => {
		this.setState({ riskFilter: e.target.value, pageIndex: 1 });
	}

	onClickRank = (rank) => {
		this.setState({ rank, pageIndex: 1 });
	}

	onChangeBegin = (date) => {
		this.setState({ beginDate: date });
	}

	onChangeEnd = (date) => {
		this.setState({ endDate: date });
	}

	onClickDatepicker01 = () => {
		this.refDatepicker01.current.setOpen(true);
	}

	onClickDatepicker02 = () => {
		this.refDatepicker02.current.setOpen(true);
	}

	// Excel 다운로드 - 현재 조회 결과(필터 + 표시 순위 Top N)를 내보낸다.
	onClickExcelDownload = async () => {
		const title = '반복 과속 의심차량';

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet(title);

		// 제목
		worksheet.mergeCells('A1:I2');
		const titleCell = worksheet.getCell('A1');
		titleCell.value = title;
		titleCell.font = { name: '맑은 고딕', family: 4, size: 20, bold: true };
		titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

		// 조회 기간
		const beginDate = this.getMakeDateTime(this.state.beginDate);
		const endDate = this.getMakeDateTime(this.state.endDate);
		worksheet.addRow([i18n.t('history.formText.조회 기간') + ' : ' + beginDate + ' ~ ' + endDate]);

		// 요약 (통계 카드 값)
		const all = this.state.suspects || [];
		let cntAlert = 0, cntWarning = 0, cntCaution = 0;
		for (let i = 0; i < all.length; i++) {
			const lv = all[i].risk.lv;
			if (lv === 4) cntAlert++;
			else if (lv === 3) cntWarning++;
			else if (lv === 2) cntCaution++;
		}
		const topSuspect = all.length > 0 ? all[0] : null;

		worksheet.addRow([]);
		const statTitleRow = worksheet.addRow(['[ 통계 ]']);
		statTitleRow.getCell(1).font = { bold: true };

		worksheet.addRow(['반복 과속 의심번호 : ' + all.length + '개']);
		worksheet.addRow(['위험도별 의심차량 : 집중관리 ' + cntAlert + '대 / 경고 ' + cntWarning + '대 / 주의 ' + cntCaution + '대']);
		worksheet.addRow(['최다 반복 인식번호 : ' + (topSuspect ? (topSuspect.carNo + ' · ' + topSuspect.count + '건 · 최고속도 ' + topSuspect.maxSpeed + 'km/h') : '-')]);
		worksheet.addRow([]);

		// 헤더
		const columnRow = worksheet.addRow(['순위', '위험도', '카메라 인식번호', '과속 횟수', '평균속도', '최고속도', '평균 매칭 시간차', '최근 발생일시', '주요 발생위치']);
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
			{ key: "rank", width: 8 },
			{ key: "risk", width: 12 },
			{ key: "carNo", width: 18 },
			{ key: "count", width: 10 },
			{ key: "avgSpeed", width: 12 },
			{ key: "maxSpeed", width: 12 },
			{ key: "avgDiff", width: 16 },
			{ key: "lastTime", width: 20 },
			{ key: "mainLoc", width: 24 },
		];

		// 현재 필터 + 표시 순위(Top N) 적용된 목록
		const list = this.getFilteredSuspects().slice(0, this.state.rank);
		for (let i = 0; i < list.length; i++) {
			const s = list[i];
			worksheet.addRow({
				rank: i + 1,
				risk: s.risk.label,
				carNo: s.carNo,
				count: s.count + '건',
				avgSpeed: s.avgSpeed + 'km/h',
				maxSpeed: s.maxSpeed + 'km/h',
				avgDiff: s.avgDiff === null ? '-' : (s.avgDiff.toFixed(1) + '초'),
				lastTime: this.formatDateTime(s.lastTime),
				mainLoc: s.mainLoc,
			}).alignment = { vertical: 'middle', horizontal: 'center' };
		}

		// 다운로드
		const mimeType = { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
		const buffer = await workbook.xlsx.writeBuffer();
		const blob = new Blob([buffer], mimeType);

		const dtNow = new Date();
		const date = this.getMakeDateTime(dtNow).replace(/-/gi, '');
		saveAs(blob, title + '_' + date + ".xlsx");
	}

	// 상세보기 - 동작은 추후 구현 예정
	// 상세보기 팝업 열기 / 닫기
	onClickDetail = (carNo) => {
		this.setState({ detailCarNo: carNo });
	}

	closeDetail = () => {
		this.setState({ detailCarNo: null });
	}

	setPageIndex(index, maxPageIndex) {
		if (index < 1 || index > maxPageIndex || index === this.state.pageIndex) return;
		this.setState({ pageIndex: index });
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

	getRankUI() {
		const ranks = [{ value: 5, label: 'Top 5' }, { value: 10, label: '10' }, { value: 20, label: '20' }, { value: 30, label: '30' }];

		return ranks.map((r) => (
			<li key={'rank_' + r.value}>
				<a onClick={() => this.onClickRank(r.value)} className={this.state.rank === r.value ? 'on' : ''}>{r.label}</a>
			</li>
		));
	}

	// 위험도 필터 + 카메라 인식번호 필터 적용
	getFilteredSuspects() {
		let list = this.state.suspects || [];

		const plate = (this.state.plateNumber || '').trim();
		if (plate.length > 0) {
			list = list.filter(s => s.carNo && s.carNo.indexOf(plate) >= 0);
		}

		if (this.state.riskFilter !== 'all') {
			list = list.filter(s => s.risk.label === this.state.riskFilter);
		}

		return list;
	}

	getDiffClass(avgDiff) {
		if (avgDiff === null || avgDiff === undefined) return '';
		if (avgDiff < 2) return 'diffLow';
		if (avgDiff < 4) return 'diffMid';
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
					<a onClick={() => this.setPageIndex(i, maxPageIndex)}>{i}</a>
				</li>
			);
		}
		return ui;
	}

	render() {
		const sensorUI = this.getSensorUI();
		const rankUI = this.getRankUI();
		const calendarImg = ProjectResource.styleMode === ProjectResource.StyleType.Soulbrain ? btnCalendarBk : btnCalendarBk_wonik;

		const today = new Date();
		const minDate = getSearchMinDate();

		const allSuspects = this.state.suspects || [];

		// --- 통계 카드 ---
		const suspectCount = allSuspects.length;                       // 반복 과속 의심번호
		let cntAlert = 0, cntWarning = 0, cntCaution = 0;              // 위험도별 의심차량
		for (let i = 0; i < allSuspects.length; i++) {
			const lv = allSuspects[i].risk.lv;
			if (lv === 4) cntAlert++;
			else if (lv === 3) cntWarning++;
			else if (lv === 2) cntCaution++;
		}
		const topSuspect = allSuspects.length > 0 ? allSuspects[0] : null;   // 최다 반복 인식번호

		// --- 테이블 (필터 + Top N 제한 + 페이지) ---
		//  표시 순위(rank) = 상위 N개 총량 제한, 한 페이지는 최대 PAGE_SIZE(10)개
		//  예) Top 20 → 상위 20개를 10개씩 2페이지, Top 30 → 3페이지
		const rank = this.state.rank;
		const PAGE_SIZE = RepeatSpeedSuspect.PAGE_SIZE;
		const filtered = this.getFilteredSuspects().slice(0, rank);
		const maxPageIndex = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
		const pageIndex = Math.min(this.state.pageIndex, maxPageIndex);
		const beginRow = (pageIndex - 1) * PAGE_SIZE;
		const pageRows = filtered.slice(beginRow, beginRow + PAGE_SIZE);

		return (
			<>
				<div id={'hsty'}>
					<div className={'hsScr'}>
						<div id={'hsCont'}>

							{/* 헤더 */}
							<div className={'hscHead'}>
								<div className={'hscHeadTop'}>
									<h2>반복 과속 의심차량</h2>
								</div>
								<p className={'hscDesc'}>동일하게 인식된 차량번호의 반복 과속 횟수와 위험도를 확인합니다.</p>
							</div>

							{/* 검색(필터) 바 */}
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
															showYearDropdown
															showMonthDropdown
															minDate={minDate}
															maxDate={today}
															selected={this.state.beginDate}
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
															selected={this.state.endDate}
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
													<input type="text" value={this.state.plateNumber} onChange={this.onChangePlateNumber} placeholder="번호를 입력하세요" />
												</li>
											</ul>
										</dd>
									</dl>
									<dl>
										<dt>위험도</dt>
										<dd>
											<ul className={'hscsLoc'}>
												<li>
													<select value={this.state.riskFilter} onChange={this.onChangeRiskFilter} className={'selWh'}>
														<option value="all">{i18n.t('common.전체')}</option>
														<option value="집중관리">집중관리</option>
														<option value="경고">경고</option>
														<option value="주의">주의</option>
													</select>
												</li>
											</ul>
										</dd>
									</dl>
									<dl>
										<dt>표시 순위</dt>
										<dd>
											<ul className={'hscsRank'}>
												{rankUI}
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

							{/* Excel 다운로드 */}
							<ul className={'hscExl'}>
								<li><a onClick={this.onClickExcelDownload} className={'exl'}>Excel 다운로드</a></li>
							</ul>

							{/* 통계 카드 3개 */}
							<div className={'rsCards'}>
								<div className={'card'}>
									<p className={'cardTitle'}>반복 과속 의심번호</p>
									<div className={'cardBody'}>
										<span className={'cardNum'}>{this.state.suspects ? suspectCount : '-'}</span>
										<span className={'cardUnit'}>개</span>
									</div>
								</div>
								<div className={'card'}>
									<p className={'cardTitle'}>위험도별 의심차량</p>
									<div className={'cardBody'}>
										<div className={'riskMini'}>
											<div className={'item lv4'}>
												<div className={'lbl'}>집중관리</div>
												<div className={'cnt'}>{this.state.suspects ? cntAlert : '-'}<small>대</small></div>
											</div>
											<div className={'item lv3'}>
												<div className={'lbl'}>경고</div>
												<div className={'cnt'}>{this.state.suspects ? cntWarning : '-'}<small>대</small></div>
											</div>
											<div className={'item lv2'}>
												<div className={'lbl'}>주의</div>
												<div className={'cnt'}>{this.state.suspects ? cntCaution : '-'}<small>대</small></div>
											</div>
										</div>
									</div>
								</div>
								<div className={'card'}>
									<p className={'cardTitle'}>최다 반복 인식번호</p>
									<div className={'cardBody'}>
										{
											topSuspect ?
												<>
													<span className={'topPlate'}>{topSuspect.carNo}</span>
													<span className={'topMeta'}>{topSuspect.count}건 · 최고속도 <span className={'maxSpd'}>{topSuspect.maxSpeed}km/h</span></span>
												</>
												:
												<span className={'cardNum'}>-</span>
										}
									</div>
								</div>
							</div>

							{/* 안내 문구 */}
							<div className={'rsNotice'}>
								<span>ⓘ</span>
								<span>속도 측정 장비와 LPR 카메라의 수집 시각 차이를 기준으로 차량을 매칭합니다. 시간차가 클수록 매칭 신뢰도가 낮을 수 있습니다.</span>
							</div>

							{/* 과속 빈도 Top N 테이블 */}
							<div className={'hscTbHead'}>
								<h3>과속 빈도 Top {rank}</h3>
								<span className={'hscTbMeta'}>과속 횟수 내림차순 · 동일 인식번호 기준 · 시간차는 평균값</span>
							</div>

							<div className={'hscTb'}>
								<div className={'scrTb'}>
									<table>
										<colgroup>
											<col style={{ width: '6%' }} />
											<col style={{ width: '9%' }} />
											<col style={{ width: '16%' }} />
											<col style={{ width: '8%' }} />
											<col style={{ width: '9%' }} />
											<col style={{ width: '9%' }} />
											<col style={{ width: '11%' }} />
											<col style={{ width: '13%' }} />
											<col style={{ width: '11%' }} />
											<col style={{ width: '8%' }} />
										</colgroup>
										<thead>
											<tr>
												<th>순위</th>
												<th>위험도</th>
												<th>카메라 인식번호</th>
												<th>과속 횟수</th>
												<th>평균속도</th>
												<th>최고속도</th>
												<th>평균 매칭 시간차</th>
												<th>최근 발생일시</th>
												<th>주요 발생위치</th>
												<th>이력</th>
											</tr>
										</thead>
										<tbody>
											{
												pageRows.map((s, i) => {
													const globalRank = beginRow + i + 1;
													return (
														<tr key={'suspect_' + s.carNo}>
															<td><span className={'rankNo' + (globalRank <= 3 ? ' top' : '')}>{globalRank}</span></td>
															<td><span className={'riskBadge lv' + s.risk.lv}>{s.risk.label}</span></td>
															<td>
																<div>{s.carNo}</div>
															</td>
															<td>{s.count}건</td>
															<td>{s.avgSpeed}km/h</td>
															<td className={'spdOver'}>{s.maxSpeed}km/h</td>
															<td className={this.getDiffClass(s.avgDiff)}>{s.avgDiff === null ? '-' : (s.avgDiff.toFixed(1) + '초')}</td>
															<td>{this.formatDateTime(s.lastTime)}</td>
															<td>{s.mainLoc}</td>
															<td><a className={'detailBtn'} onClick={() => this.onClickDetail(s.carNo)}>상세보기</a></td>
														</tr>
													);
												})
											}
											{
												(this.state.suspects && filtered.length === 0) &&
												<tr><td colSpan={10} style={{ textAlign: 'center', padding: '30px 0', color: '#999' }}>조회된 반복 과속 의심차량이 없습니다.</td></tr>
											}
										</tbody>
									</table>
								</div>

								{
									(filtered.length > 0) &&
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
								}
							</div>

						</div>
					</div>
				</div>

				{
					this.state.detailCarNo &&
					(() => {
						const carNo = this.state.detailCarNo;
						const dets = (this.state.detections || []).filter(d => d.carNo === carNo);
						const sus = (this.state.suspects || []).find(s => s.carNo === carNo);
						return (
							<RepeatSpeedDetail
								carNo={carNo}
								risk={sus ? sus.risk : null}
								detections={dets}
								speedLimit={this.state.speedLimit}
								levels={{ level1: this.state.cfg.level1, level2: this.state.cfg.level2, level3: this.state.cfg.level3 }}
								beginDate={this.getMakeDateTime(this.state.beginDate)}
								endDate={this.getMakeDateTime(this.state.endDate)}
								onClose={this.closeDetail}
							/>
						);
					})()
				}
			</>
		);
	}
}

export default withTranslation()(RepeatSpeedSuspect);
