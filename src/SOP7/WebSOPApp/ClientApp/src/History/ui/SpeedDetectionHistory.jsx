import React, { Component } from 'react';
import $ from 'jquery';
import HistoryController from '../services/historyController';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale';
import btnCalendarBk from '../../Common/img/sub/dashboard_calendar_bk.png';
import btnCalendarBk_wonik from '../../Common/img/sub/dashboard_calendar_bk_wonik.png';
import { Bar } from 'react-chartjs-2';

import CircularProgress from '@material-ui/core/CircularProgress';

import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/

import ProjectResource from '../../Root/resource/id';
import { i18n, withTranslation } from '../../language/i18n';

// 차량 과속 이력 및 분석 (원익 전용)
//  - 제한속도(SPEED_LIMIT)는 BeaconServer 의 appsettings.json(SpeedDetection:SpeedLimit)에서 받아온다.
//    아래 값은 API 호출 실패 시에만 쓰이는 기본값이다. 기준을 바꿀 때는 BeaconServer 설정을 고칠 것.
//  - 위험도 4단계: 초과량(측정속도-제한속도) 기준
//      ~5km/h  : 관심(lv1)
//      ~10km/h : 주의(lv2)
//      ~20km/h : 경계(lv3)
//      그 이상 : 심각(lv4)
class SpeedDetectionHistory extends Component {
	static PLACE_1 = 19000;   // 보안실 A
	static PLACE_2 = 19001;   // S1동 B

	static SPEED_LIMIT = 25;  // 기본값. init() 에서 BeaconServer 값으로 덮어쓴다.

	static PLACE_1_NAME = '보안실 A';
	static PLACE_2_NAME = 'S1동 B';

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
			maxPageCount: 5,  // 한번에 보여줄 페이지 개수

			pageIndex: 1,     // 현재 페이지
			minPageIndex: 1,  // 최소 페이지 Index
			maxPageIndex: 1,  // 최대 페이지 Index

			loadingIndicator: false, // 새로고침중인지 표시

			stats: null,      // 통계 카드용 (현재/이전 기간 과속 횟수 등)

			// 위험도 초과속도 임계값 (appsettings.json Options.speedDetection)
			levels: this.getSpeedLevels(),
		}

		this.refDatepicker01 = React.createRef();
		this.refDatepicker02 = React.createRef();

		this.props = props;
		this.display = this.display.bind(this);
		this.onClickDownload = this.onClickDownload.bind(this);

		this.init();
	}

	init = async () => {
		// 과속 기준 속도 불러오기.
		// 원본은 BeaconServer 의 appsettings.json (SpeedDetection:SpeedLimit) 한 곳뿐이다.
		// 못 받아오면 아래 기본값(SPEED_LIMIT)을 그대로 쓴다.
		const speedLimit = await HistoryController.requestWonikSpeedLimit();
		if (speedLimit !== null && speedLimit > 0)
			SpeedDetectionHistory.SPEED_LIMIT = speedLimit;

		// 위치 불러오기
		let result = await HistoryController.requestWonikSpeedDetectionSensors();

		let sensors = [];
		if (result !== null && result.success === true && result.sensors?.length > 0) {
			sensors = result.sensors;
		}

		this.state.sensors = sensors;

		this.display();
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

		// 제한속도를 초과한(= 과속) 데이터만 표시한다. (제한속도 이하 데이터는 제외)
		if (dataSource?.length > 0) {
			dataSource = dataSource.filter(d => d.speed > SpeedDetectionHistory.SPEED_LIMIT);
		}

		const datacount = dataSource?.length;

		if (datacount > 1) {
			dataSource = dataSource.sort((a, b) => new Date(b.detectionTime) - new Date(a.detectionTime));
		}

		const value1 = parseInt(datacount / this.state.maxRowCount);
		const value2 = datacount % (this.state.maxRowCount); // 나머지가 있는 경우 페이지 하나를 추가한다.
		let maxPageIndex = value1 + ((value2 > 0) ? 1 : 0);

		// --- 통계 카드용: 현재 기간 / 이전 기간 과속 횟수 집계 ---
		//  이전 기간 = 현재 조회 기간과 같은 길이의 바로 직전 구간
		//  (오늘→전일, 해당주→전주, 해당월→전월, 해당년→전년, 기간선택→이전 기간)
		const appliedDateType = this.state.dateType;
		const curCount = datacount || 0;

		const msDay = 24 * 60 * 60 * 1000;
		const curBeginD = new Date(this.state.beginDate); curBeginD.setHours(0, 0, 0, 0);
		const curEndD = new Date(this.state.endDate); curEndD.setHours(0, 0, 0, 0);
		const nDays = Math.round((curEndD - curBeginD) / msDay) + 1; // 포함 일수

		const prevEndD = new Date(curBeginD.getTime() - msDay);
		const prevBeginD = new Date(curBeginD.getTime() - nDays * msDay);

		const prevBeginStr = this.getMakeDateTime(prevBeginD);
		const prevEndStr = this.getMakeDateTime(prevEndD);

		let prevCount = 0;
		const prevResult = await HistoryController.requestWonikSpeedDetectionHistorys(prevBeginStr + ' 00:00:00', prevEndStr + ' 23:59:59', selectedSensor);
		if (prevResult && prevResult.success !== false && prevResult.speedDetectionDatas?.length > 0) {
			prevCount = prevResult.speedDetectionDatas.filter(d => d.speed > SpeedDetectionHistory.SPEED_LIMIT).length;
		}

		const stats = {
			dateType: appliedDateType,
			curBegin: this.getMakeDateTime(curBeginD),
			curEnd: this.getMakeDateTime(curEndD),
			prevBegin: prevBeginStr,
			prevEnd: prevEndStr,
			curCount,
			prevCount,
		};

		$("body").css("cursor", "default");

		this.setState({ dataSource, maxPageIndex, minPageIndex: 1, pageIndex: 1, loadingIndicator: false, stats });
	}

	getMakeDateTime(dateTime) {
		let year = dateTime.getFullYear();
		let month = 1 + dateTime.getMonth();
		month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
		let day = dateTime.getDate();
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
		this.setState({ beginDate: date, dateType: 'select' });
	}

	onChangeEnd = (date) => {
		this.setState({ endDate: date, dateType: 'select' });
	}

	onChangeSensor = (target) => {
		this.setState({ selectedSensor: Number(target.value) });
	}

	onClickDateType = (type) => {
		if (type === 'select') {
			this.setState({ dateType: 'select' });
			return;
		}

		let today = new Date();
		let date = new Date();

		if (type === 'today') {
			// today
		}
		else if (type === 'week') {
			date.setDate(date.getDate() - 7);
		}
		else if (type === 'month') {
			date.setMonth(date.getMonth() - 1);
		}
		else if (type === 'year') {
			date.setFullYear(date.getFullYear() - 1);
		}

		this.setState({ beginDate: date, endDate: today, dateType: type });
	}

	onClickDatepicker01 = () => {
		this.refDatepicker01.current.setOpen(true);
	}

	onClickDatepicker02 = () => {
		this.refDatepicker02.current.setOpen(true);
	}

	// 위험도 초과속도 임계값 (appsettings.json Options.speedDetection.level1~3)
	getSpeedLevels() {
		const cfg = (ProjectResource.getUserInfo() || {}).options?.speedDetection || {};
		return { level1: cfg.level1, level2: cfg.level2, level3: cfg.level3 };
	}

	// 측정속도 -> 위험도 (제한속도 초과량 기준 4단계)
	//   초과량 ≤ level1 : 관심 / ≤ level2 : 주의 / ≤ level3 : 경계 / 그 이상 : 심각
	getRisk(speed) {
		const over = speed - SpeedDetectionHistory.SPEED_LIMIT;
		const lv = this.state.levels;

		if (over <= lv.level1) return { label: '관심', lv: 1 };
		if (over <= lv.level2) return { label: '주의', lv: 2 };
		if (over <= lv.level3) return { label: '경계', lv: 3 };
		return { label: '심각', lv: 4 };
	}

	// 조회기간 옵션(dateType)에 따른 카드 라벨
	//   기간선택 : 해당기간 / 이전 기간
	//   오늘     : 오늘     / 전일
	//   1주      : 해당주   / 전주
	//   1개월    : 해당월   / 전월
	//   1년      : 해당년   / 전년
	getPeriodLabels(dateType) {
		switch (dateType) {
			case 'today': return { cur: '오늘', prev: '전일' };
			case 'week': return { cur: '해당주', prev: '전주' };
			case 'year': return { cur: '해당년', prev: '전년' };
			case 'select': return { cur: '해당기간', prev: '이전 기간' };
			case 'month':
			default: return { cur: '해당월', prev: '전월' };
		}
	}

	getTimeSlotIndex(hour) {
		if (hour < 6) return 0;    // 00-06
		if (hour < 9) return 1;    // 06-09
		if (hour < 12) return 2;   // 09-12
		if (hour < 15) return 3;   // 12-15
		if (hour < 17) return 4;   // 15-17
		if (hour < 18) return 5;   // 17-18
		if (hour < 21) return 6;   // 18-21
		return 7;                  // 21-24
	}

	getSpeedOverIndex(speed) {
		const over = speed - SpeedDetectionHistory.SPEED_LIMIT;
		const lv = this.state.levels;
		if (over <= 0) return -1;
		if (over <= lv.level1) return 0;    // 1 ~ level1
		if (over <= lv.level2) return 1;    // level1+1 ~ level2
		if (over <= lv.level3) return 2;    // level2+1 ~ level3
		return 3;                           // level3 초과
	}

	// 차트/요약 집계 (보안실 A = place1, S1동 B = place2)
	buildAnalysis() {
		const timeLabels = ['00-06', '06-09', '09-12', '12-15', '15-17', '17-18', '18-21', '21-24'];

		// 속도 초과 구간 라벨: level1/2/3 기준으로 동적 생성
		const lv = this.state.levels;
		const speedLabels = [
			'1~' + lv.level1 + 'km/h',
			(lv.level1 + 1) + '~' + lv.level2 + 'km/h',
			(lv.level2 + 1) + '~' + lv.level3 + 'km/h',
			(lv.level3 + 1) + 'km/h 이상',
		];

		const timeA = new Array(timeLabels.length).fill(0);
		const timeB = new Array(timeLabels.length).fill(0);
		const speedA = new Array(speedLabels.length).fill(0);
		const speedB = new Array(speedLabels.length).fill(0);

		const dataSource = this.state.dataSource || [];

		let total = 0;

		for (let i = 0; i < dataSource.length; i++) {
			const d = dataSource[i];
			const isA = d.sensorID === SpeedDetectionHistory.PLACE_1;
			const isB = d.sensorID === SpeedDetectionHistory.PLACE_2;

			total++;

			const hour = new Date(d.detectionTime).getHours();
			const ti = this.getTimeSlotIndex(hour);

			const si = this.getSpeedOverIndex(d.speed);

			if (isA) {
				timeA[ti]++;
				if (si >= 0) speedA[si]++;
			} else if (isB) {
				timeB[ti]++;
				if (si >= 0) speedB[si]++;
			} else {
				// 위치를 특정할 수 없는 데이터는 시간대 집계에만 place1 기준으로 포함
				timeA[ti]++;
				if (si >= 0) speedA[si]++;
			}
		}

		// 최다 발생 시간대
		let maxTimeIdx = -1;
		let maxTimeCount = 0;
		for (let i = 0; i < timeLabels.length; i++) {
			const c = timeA[i] + timeB[i];
			if (c > maxTimeCount) {
				maxTimeCount = c;
				maxTimeIdx = i;
			}
		}

		// 최다 속도 초과 구간
		let maxSpeedIdx = -1;
		let maxSpeedCount = 0;
		for (let i = 0; i < speedLabels.length; i++) {
			const c = speedA[i] + speedB[i];
			if (c > maxSpeedCount) {
				maxSpeedCount = c;
				maxSpeedIdx = i;
			}
		}

		return { timeLabels, speedLabels, timeA, timeB, speedA, speedB, total, maxTimeIdx, maxTimeCount, maxSpeedIdx, maxSpeedCount };
	}

	renderBarChart(id, labels, dataA, dataB, colorsA, colorsB) {
		const chartData = {
			labels: labels,
			datasets: [
				{
					label: SpeedDetectionHistory.PLACE_1_NAME,
					data: dataA,
					backgroundColor: colorsA,
					minBarLength: 3,   // 0건이어도 최소 높이로 막대를 표시
				},
				{
					label: SpeedDetectionHistory.PLACE_2_NAME,
					data: dataB,
					backgroundColor: colorsB,
					minBarLength: 3,   // 0건이어도 최소 높이로 막대를 표시
				},
			],
		};

		const valueLabelPlugin = {
			afterDraw: function (chart) {
				const ctx = chart.ctx;
				ctx.save();
				ctx.font = '11px sans-serif';
				ctx.fillStyle = '#555';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'bottom';

				chart.data.datasets.forEach((dataset, i) => {
					const meta = chart.getDatasetMeta(i);
					meta.data.forEach((bar, index) => {
						const value = dataset.data[index];
						if (value !== null && value !== undefined && bar && bar._model) {
							// 0건도 숫자를 표시한다.
							ctx.fillText(value, bar._model.x, bar._model.y - 3);
						}
					});
				});
				ctx.restore();
			},
		};

		const chartOptions = {
			responsive: true,
			maintainAspectRatio: false,
			layout: { padding: { top: 24 } },
			scales: {
				xAxes: [{
					gridLines: { display: false },
					ticks: { fontColor: '#666' },
					// 보안실 A / S1동 B 두 막대를 한 항목 안에 바짝 붙여서 그린다.
					categoryPercentage: 0.6,
					barPercentage: 0.95,
				}],
				yAxes: [{ ticks: { beginAtZero: true }, gridLines: { color: '#f0f0f0' } }],
			},
			legend: { display: false },
			tooltips: { enabled: true },
			animation: { duration: 0 },
		};

		return (
			<Bar id={id} data={chartData} options={chartOptions} plugins={[valueLabelPlugin]} />
		);
	}

	renderChartLegend() {
		return (
			<div className={'chartLegend'}>
				<span><i style={{ background: '#3b82f6' }}></i>{SpeedDetectionHistory.PLACE_1_NAME}</span>
				<span><i style={{ background: '#93c5fd' }}></i>{SpeedDetectionHistory.PLACE_2_NAME}</span>
			</div>
		);
	}

	// 하단 페이지 index 만들기
	getPageIndexUI() {
		let ui = [];
		if (!this.state.dataSource) {
			return ui;
		}

		const pageArr = new Array();

		let index = this.state.pageIndex;
		while (true) {
			index--;
			if (index < 1) break;
			if (this.state.pageIndex - 2 > index) break;
			pageArr.push(index);
		}
		index = this.state.pageIndex;
		pageArr.push(index);

		while (true) {
			if (pageArr.length === this.state.maxPageCount) break;
			index++;
			if (index > this.state.maxPageIndex) break;
			pageArr.push(index);
		}

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

			const speed = dataSource[i].speed;
			const over = speed - SpeedDetectionHistory.SPEED_LIMIT;
			const risk = this.getRisk(speed);

			ui.push(
				<tr key={'dataSource_' + (i)}>
					<td>{(i + 1)}</td>
					<td>{detectionTime}</td>
					<td>{dataSource[i].sensorName}</td>
					<td className={'spdOver'}>{speed}km/h</td>
					<td>{SpeedDetectionHistory.SPEED_LIMIT}km/h</td>
					<td className={'spdOver'}>+{over}km/h</td>
					<td><span className={'riskBadge lv' + risk.lv}>{risk.label}</span></td>
				</tr>
			);
		}

		return ui;
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

	async onClickDownload() {
		const title = '차량 과속 이력 및 분석';

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet(title);

		// title
		let titleRow = worksheet.getCell('A1');
		titleRow.value = title;
		titleRow.font = { name: '맑은 고딕', family: 4, size: 20, bold: true };
		worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
		worksheet.mergeCells('A1:G2');

		const beginDate = this.getMakeDateTime(this.state.beginDate);
		const endDate = this.getMakeDateTime(this.state.endDate);
		worksheet.addRow([i18n.t('history.formText.조회 기간') + ' : ' + beginDate + ' ~ ' + endDate]);

		// 요약 (통계 카드)
		const analysis = this.buildAnalysis();
		const stats = this.state.stats;
		const labels = this.getPeriodLabels(stats ? stats.dateType : this.state.dateType);
		const maxTimeLabel = (analysis.maxTimeIdx >= 0) ? analysis.timeLabels[analysis.maxTimeIdx].replace('-', '~') + '시' : '-';

		worksheet.addRow([labels.cur + ' 과속 횟수 : ' + (stats ? stats.curCount : analysis.total) + '건']);
		worksheet.addRow([labels.prev + ' 과속 횟수 : ' + (stats ? stats.prevCount : '-') + '건']);
		worksheet.addRow(['최다 발생시간 : ' + (analysis.maxTimeIdx >= 0 ? (maxTimeLabel + ' · ' + analysis.maxTimeCount + '건') : '-')]);
		worksheet.addRow([]);

		// column
		let columnRow = worksheet.addRow(['No', i18n.t('history.formText.일시'), i18n.t('common.위치'), '측정속도', '제한속도', '초과속도', '위험도']);
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
			{ key: "no", width: 6 },
			{ key: "detectionTime", width: 24 },
			{ key: "sensorName", width: 20 },
			{ key: "speed", width: 12 },
			{ key: "limit", width: 12 },
			{ key: "over", width: 12 },
			{ key: "risk", width: 10 },
		];

		if (this.state.dataSource) {
			const dataLength = this.state.dataSource.length;
			for (let i = 0; i < dataLength; i++) {
				let detectionTime = this.state.dataSource[i].detectionTime;
				detectionTime = detectionTime.replace("T", " ");

				const speed = this.state.dataSource[i].speed;
				const over = speed - SpeedDetectionHistory.SPEED_LIMIT;
				const risk = this.getRisk(speed);

				worksheet.addRow({
					no: i + 1,
					detectionTime: detectionTime,
					sensorName: this.state.dataSource[i].sensorName,
					speed: speed + 'km/h',
					limit: SpeedDetectionHistory.SPEED_LIMIT + 'km/h',
					over: '+' + over + 'km/h',
					risk: risk.label,
				}).alignment = { vertical: 'middle', horizontal: 'center' };
			}
		}

		const mimeType = { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
		const buffer = await workbook.xlsx.writeBuffer();
		const blob = new Blob([buffer], mimeType);

		const dtNow = new Date();
		const date = this.getMakeDateTime(dtNow).replace(/-/gi, '');
		const time = this.getMakeTime(dtNow).replace(/:/gi, '');

		saveAs(blob, title + '_' + date + '_' + time + ".xlsx");
	}

	render() {
		const sensorUI = this.getSensorUI();
		const pageIndexUI = this.getPageIndexUI();
		const gridUI = this.getGridData();

		const analysis = this.buildAnalysis();

		const calendarImg = ProjectResource.styleMode === ProjectResource.StyleType.Soulbrain ? btnCalendarBk : btnCalendarBk_wonik;

		// 조회기간 수동 선택 제한: 시작일자는 현재로부터 최대 1년 전까지, 종료일자는 현재일자까지
		const today = new Date();
		const oneYearAgo = new Date();
		oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

		// 시간대별 과속 현황 : 보안실 A / S1동 B
		const timeColorsA = '#3b82f6';
		const timeColorsB = '#93c5fd';

		// 속도 초과 구간 : 마지막(level3 초과 · 심각) 구간은 빨강 강조
		const speedColorsA = ['#3b82f6', '#3b82f6', '#3b82f6', '#ef4444'];
		const speedColorsB = ['#93c5fd', '#93c5fd', '#93c5fd', '#fca5a5'];

		const maxTimeLabel = (analysis.maxTimeIdx >= 0) ? analysis.timeLabels[analysis.maxTimeIdx] : '-';
		const maxSpeedLabel = (analysis.maxSpeedIdx >= 0) ? analysis.speedLabels[analysis.maxSpeedIdx] : '-';

		// --- 통계 카드 데이터 ---
		const stats = this.state.stats;
		const labels = this.getPeriodLabels(stats ? stats.dateType : this.state.dateType);

		const curCount = stats ? stats.curCount : null;
		const prevCount = stats ? stats.prevCount : null;

		// 이전 기간 대비 증감률
		let cmpValueUI = <>-</>;
		let cmpSub = labels.prev + ' 대비 증감';
		let cmpClass = '';
		if (stats) {
			const diff = curCount - prevCount;
			if (prevCount > 0) {
				const pct = Math.abs((diff / prevCount) * 100).toFixed(1);
				const word = diff < 0 ? '감소' : (diff > 0 ? '증가' : '변동 없음');
				cmpClass = diff < 0 ? 'up' : (diff > 0 ? 'down' : '');
				cmpValueUI = (diff === 0) ? <>0<small>%</small></> : <>{pct}<small>% {word}</small></>;
				cmpSub = (diff === 0) ? '변동 없음' : ('과속 ' + Math.abs(diff) + '건 ' + (diff < 0 ? '감소' : '증가'));
			} else {
				// 이전 기간 데이터가 없어 증감률 계산 불가
				cmpValueUI = <>-</>;
				cmpSub = '이전 기간 데이터 없음';
			}
		}

		// 최다 발생시간 (예: 06-09 -> 06~09시)
		const maxTimeCardValue = (analysis.maxTimeIdx >= 0) ? (maxTimeLabel.replace('-', '~') + '시') : '-';
		const maxTimeRatio = (analysis.total > 0) ? ((analysis.maxTimeCount / analysis.total) * 100).toFixed(1) : 0;
		const maxTimeSub = (analysis.maxTimeIdx >= 0) ? (analysis.maxTimeCount + '건 · 전체의 ' + maxTimeRatio + '%') : '집중 발생 시간대';

		return (
			<>
				<div id={'hsty'}>
					<div className={'hsScr'}>
						<div id={'hsCont'}>

							{/* 헤더 */}
							<div className={'hscHead'}>
								<div className={'hscHeadTop'}>
									<h2>차량 과속 이력 및 분석</h2>
								</div>
								<p className={'hscDesc'}>위치별 과속 현황과 전월 대비 변화, 집중 발생시간을 확인합니다.</p>
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
															minDate={oneYearAgo}
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
															minDate={oneYearAgo}
															maxDate={today}
															selected={this.state.endDate}
															onChange={date => this.onChangeEnd(date)} />
														<img src={calendarImg} alt="" className={'btnCalendarBk'} onClick={this.onClickDatepicker02} />
													</div>
												</li>
											</ul>
											<ul className={'hscsRdo'}>
												<li><input type="radio" name="hscsRdo" id="hscsRdo01" onChange={() => this.onClickDateType('select')} checked={this.state.dateType === 'select'} /><label htmlFor="hscsRdo01">{i18n.t('history.formText.기간선택')}</label></li>
												<li><input type="radio" name="hscsRdo" id="hscsRdo02" onChange={() => this.onClickDateType('today')} checked={this.state.dateType === 'today'} /><label htmlFor="hscsRdo02">{i18n.t('history.formText.오늘')}</label></li>
												<li><input type="radio" name="hscsRdo" id="hscsRdo03" onChange={() => this.onClickDateType('week')} checked={this.state.dateType === 'week'} /><label htmlFor="hscsRdo03">{i18n.t('history.formText.1주')}</label></li>
												<li><input type="radio" name="hscsRdo" id="hscsRdo04" onChange={() => this.onClickDateType('month')} checked={this.state.dateType === 'month'} /><label htmlFor="hscsRdo04">{i18n.t('history.formText.1개월')}</label></li>
												<li><input type="radio" name="hscsRdo" id="hscsRdo05" onChange={() => this.onClickDateType('year')} checked={this.state.dateType === 'year'} /><label htmlFor="hscsRdo05">{i18n.t('history.formText.1년')}</label></li>
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
								<li><a onClick={this.onClickDownload} className={'exl'}>Excel 다운로드</a></li>
							</ul>

							{/* 통계 카드 4개 */}
							<div className={'hscCards'}>
								<div className={'card'}>
									<p className={'cardTitle'}>{labels.cur} 과속 횟수</p>
									<p className={'cardValue'}>{stats ? curCount : '-'}<small>건</small></p>
									<p className={'cardSub'}>{stats ? (stats.curBegin + ' ~ ' + stats.curEnd) : (labels.cur + ' 과속 발생')}</p>
								</div>
								<div className={'card'}>
									<p className={'cardTitle'}>{labels.prev} 과속 횟수</p>
									<p className={'cardValue'}>{stats ? prevCount : '-'}<small>건</small></p>
									<p className={'cardSub'}>{stats ? (stats.prevBegin + ' ~ ' + stats.prevEnd) : (labels.prev + ' 동일 기간')}</p>
								</div>
								<div className={'card'}>
									<p className={'cardTitle'}>{labels.prev} 대비</p>
									<p className={'cardValue ' + cmpClass}>{cmpValueUI}</p>
									<p className={'cardSub'}>{cmpSub}</p>
								</div>
								<div className={'card'}>
									<p className={'cardTitle'}>최다 발생시간</p>
									<p className={'cardValue'}>{maxTimeCardValue}</p>
									<p className={'cardSub'}>{maxTimeSub}</p>
								</div>
							</div>

							{/* 차트 2단 */}
							<div className={'hscChartRow'}>
								<div className={'hscChartBox'}>
									<div className={'chartHead'}>
										<h3>시간대별 과속 현황</h3>
										<div className={'chartHeadRight'}>
											{this.renderChartLegend()}
											<span className={'chartBadge'}>최다 {maxTimeLabel} · {analysis.maxTimeCount}건</span>
										</div>
									</div>
									<div className={'chartBody'}>
										{this.renderBarChart('chart1', analysis.timeLabels, analysis.timeA, analysis.timeB, timeColorsA, timeColorsB)}
									</div>
								</div>
								<div className={'hscChartBox'}>
									<div className={'chartHead'}>
										<h3>속도 초과 구간</h3>
										<div className={'chartHeadRight'}>
											{this.renderChartLegend()}
											<span className={'chartBadge'}>최다 {maxSpeedLabel} · {analysis.maxSpeedCount}건</span>
										</div>
									</div>
									<div className={'chartBody'}>
										{this.renderBarChart('chart2', analysis.speedLabels, analysis.speedA, analysis.speedB, speedColorsA, speedColorsB)}
									</div>
								</div>
							</div>

							{/* 최근 과속 이력 테이블 */}
							<div className={'hscTbHead'}>
								<h3>최근 과속 이력</h3>
								<span className={'hscTbCnt'}>총 {analysis.total}건 · 최근 발생순</span>
							</div>

							<div className={'hscTb'}>
								<div className={'scrTb'}>
									<table>
										<colgroup>
											<col style={{ width: '7%' }} />
											<col style={{ width: '23%' }} />
											<col style={{ width: '20%' }} />
											<col style={{ width: '14%' }} />
											<col style={{ width: '14%' }} />
											<col style={{ width: '12%' }} />
											<col style={{ width: '10%' }} />
										</colgroup>
										<thead>
											<tr>
												<th>No.</th>
												<th>{i18n.t('history.formText.일시')}</th>
												<th>{i18n.t('common.위치')}</th>
												<th>측정속도</th>
												<th>제한속도</th>
												<th>초과속도</th>
												<th>위험도</th>
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
