import React, { Component } from 'react';

import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/

import { RepeatSpeedDetailComponent } from '../styled/SensorDetectHistoryStyled';

// 반복 과속 상세 팝업
//  props:
//    carNo       : 카메라 인식번호
//    risk        : 차량 전체 위험도 { label, lv } (반복 과속 의심차량 페이지 기준: 주의/경고/집중관리)
//    detections  : 해당 차량번호의 과속 감지 목록 [{ detectionTime, speed, sensorName, diffSeconds }]
//    speedLimit  : 제한속도
//    levels      : 초과속도 임계값 { level1, level2, level3 }
//    beginDate/endDate : 조회기간 (yyyy-MM-dd)
//    onClose     : 닫기 콜백
class RepeatSpeedDetail extends Component {

	static TIME_LABELS = ['00~06', '06~10', '10~15', '15~17', '17~18', '18~24'];

	// 개별 과속의 위험도 (초과속도 기준) - 페이지와 동일한 라벨(주의/경고/집중관리)
	getOverRisk(speed) {
		const over = speed - this.props.speedLimit;
		const lv = this.props.levels || {};

		if (over <= lv.level1) return { label: '주의', lv: 2 };
		if (over <= lv.level2) return { label: '경고', lv: 3 };
		return { label: '집중관리', lv: 4 };
	}

	getTimeSlotIndex(hour) {
		if (hour < 6) return 0;   // 00~06
		if (hour < 10) return 1;  // 06~10
		if (hour < 15) return 2;  // 10~15
		if (hour < 17) return 3;  // 15~17
		if (hour < 18) return 4;  // 17~18
		return 5;                 // 18~24
	}

	pad(n) { return n >= 10 ? ('' + n) : ('0' + n); }

	formatDateTime(d) {
		if (!d) return '-';
		return this.pad(d.getMonth() + 1) + '-' + this.pad(d.getDate()) + ' ' + this.pad(d.getHours()) + ':' + this.pad(d.getMinutes());
	}

	formatFullDateTime(d) {
		if (!d) return '-';
		return d.getFullYear() + '-' + this.pad(d.getMonth() + 1) + '-' + this.pad(d.getDate()) + ' ' + this.pad(d.getHours()) + ':' + this.pad(d.getMinutes());
	}

	// 감지 목록 -> 집계
	buildDetail() {
		const detections = (this.props.detections || []).map(d => ({
			time: new Date(d.detectionTime),
			speed: d.speed,
			sensorName: d.sensorName || '-',
		}));

		detections.sort((a, b) => b.time - a.time);

		const count = detections.length;

		let sumSpeed = 0, maxSpeed = 0;
		const locs = {};
		const timeCounts = new Array(RepeatSpeedDetail.TIME_LABELS.length).fill(0);

		for (let i = 0; i < detections.length; i++) {
			const d = detections[i];
			sumSpeed += d.speed;
			if (d.speed > maxSpeed) maxSpeed = d.speed;
			locs[d.sensorName] = (locs[d.sensorName] || 0) + 1;
			timeCounts[this.getTimeSlotIndex(d.time.getHours())]++;
		}

		const avgSpeed = count > 0 ? Math.round(sumSpeed / count) : 0;
		const lastTime = count > 0 ? detections[0].time : null;

		// 위치 분포
		const locList = Object.keys(locs).map(name => ({ name, count: locs[name], pct: count > 0 ? Math.round((locs[name] / count) * 100) : 0 }));
		locList.sort((a, b) => b.count - a.count);
		const mainLoc = locList.length > 0 ? locList[0].name : '-';

		// 최다 시간대
		let maxTimeIdx = -1, maxTimeCount = 0;
		for (let i = 0; i < timeCounts.length; i++) {
			if (timeCounts[i] > maxTimeCount) { maxTimeCount = timeCounts[i]; maxTimeIdx = i; }
		}

		return { detections, count, avgSpeed, maxSpeed, lastTime, locList, mainLoc, timeCounts, maxTimeIdx, maxTimeCount };
	}

	onClickExcel = async (detail) => {
		const carNo = this.props.carNo;
		const title = '반복 과속 상세';

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet(carNo);

		worksheet.mergeCells('A1:F2');
		const titleCell = worksheet.getCell('A1');
		titleCell.value = title + ' - ' + carNo;
		titleCell.font = { name: '맑은 고딕', family: 4, size: 20, bold: true };
		titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

		worksheet.addRow(['조회기간 : ' + this.props.beginDate + ' ~ ' + this.props.endDate]);
		worksheet.addRow(['위험도 : ' + (this.props.risk ? this.props.risk.label : '-')]);
		worksheet.addRow([]);

		// 요약
		const st = worksheet.addRow(['[ 요약 ]']); st.getCell(1).font = { bold: true };
		worksheet.addRow(['과속 횟수 : ' + detail.count + '건']);
		worksheet.addRow(['평균속도 : ' + detail.avgSpeed + 'km/h']);
		worksheet.addRow(['최고속도 : ' + detail.maxSpeed + 'km/h']);
		worksheet.addRow(['최근 발생 : ' + this.formatFullDateTime(detail.lastTime)]);
		worksheet.addRow(['주요 위치 : ' + detail.mainLoc]);
		worksheet.addRow([]);

		// 발생 위치 분포
		const lt = worksheet.addRow(['[ 발생 위치 분포 ]']); lt.getCell(1).font = { bold: true };
		detail.locList.forEach(l => worksheet.addRow([l.name + ' : ' + l.count + '건 (' + l.pct + '%)']));
		worksheet.addRow([]);

		// 시간대별 발생 패턴
		const tt = worksheet.addRow(['[ 시간대별 발생 패턴 ]']); tt.getCell(1).font = { bold: true };
		RepeatSpeedDetail.TIME_LABELS.forEach((lbl, i) => worksheet.addRow([lbl + ' : ' + detail.timeCounts[i] + '건']));
		worksheet.addRow([]);

		// 과속 발생 목록
		const dt = worksheet.addRow(['[ 과속 발생 목록 ]']); dt.getCell(1).font = { bold: true };
		const columnRow = worksheet.addRow(['발생일시', '위치', '측정속도', '제한속도', '초과속도', '위험도']);
		columnRow.eachCell((cell) => {
			cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFA24B40' } };
			cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
			cell.alignment = { vertical: 'middle', horizontal: 'center' };
			cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
		});

		worksheet.columns = [
			{ key: 'time', width: 20 },
			{ key: 'loc', width: 20 },
			{ key: 'speed', width: 12 },
			{ key: 'limit', width: 12 },
			{ key: 'over', width: 12 },
			{ key: 'risk', width: 10 },
		];

		detail.detections.forEach(d => {
			const over = d.speed - this.props.speedLimit;
			const risk = this.getOverRisk(d.speed);
			worksheet.addRow({
				time: this.formatFullDateTime(d.time),
				loc: d.sensorName,
				speed: d.speed + 'km/h',
				limit: this.props.speedLimit + 'km/h',
				over: '+' + over + 'km/h',
				risk: risk.label,
			}).alignment = { vertical: 'middle', horizontal: 'center' };
		});

		const mimeType = { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
		const buffer = await workbook.xlsx.writeBuffer();
		const blob = new Blob([buffer], mimeType);
		saveAs(blob, title + '_' + carNo + '.xlsx');
	}

	render() {
		const { carNo, risk, beginDate, endDate, onClose } = this.props;
		const detail = this.buildDetail();

		const maxTimeCount = detail.maxTimeCount;
		const recent = detail.detections.slice(0, 5);

		return (
			<RepeatSpeedDetailComponent onClick={onClose}>
				<div className={'rsdBox'} onClick={(e) => e.stopPropagation()}>

					{/* 헤더 */}
					<div className={'rsdHead'}>
						<h2>반복 과속 상세</h2>
						<button className={'rsdClose'} onClick={onClose}>×</button>
					</div>

					{/* 번호 + 위험도 + 조회기간 */}
					<div className={'rsdTop'}>
						<div>
							<div className={'plateLabel'}>카메라 인식번호</div>
							<div className={'plateBox'}>
								<span className={'plate'}>{carNo}</span>
								{risk && <span className={'rsdBadge lv' + risk.lv}>{risk.label}</span>}
							</div>
						</div>
						<div className={'period'}>조회기간<b>{beginDate} ~ {endDate}</b></div>
					</div>

					<div className={'rsdNotice'}>
						<span>ⓘ</span>
						<span>카메라 자동 인식 결과로 실제 차량번호와 다를 수 있습니다.</span>
					</div>

					{/* 통계 카드 5개 */}
					<div className={'rsdCards'}>
						<div className={'card'}><div className={'t'}>과속 횟수</div><div className={'v'}>{detail.count}건</div></div>
						<div className={'card'}><div className={'t'}>평균속도</div><div className={'v'}>{detail.avgSpeed}km/h</div></div>
						<div className={'card'}><div className={'t'}>최고속도</div><div className={'v red'}>{detail.maxSpeed}km/h</div></div>
						<div className={'card'}><div className={'t'}>최근 발생</div><div className={'v'}>{this.formatDateTime(detail.lastTime)}</div></div>
						<div className={'card'}><div className={'t'}>주요 위치</div><div className={'v'}>{detail.mainLoc}</div></div>
					</div>

					{/* 차트 2단 */}
					<div className={'rsdCharts'}>
						{/* 발생 위치 분포 */}
						<div className={'rsdChartBox rsdLoc'}>
							<h3>발생 위치 분포</h3>
							{
								detail.locList.length === 0 ?
									<div style={{ fontSize: '13px', color: '#999' }}>데이터가 없습니다.</div>
									:
									detail.locList.map((l, i) => (
										<div className={'row'} key={'loc_' + i}>
											<div className={'name'}>{l.name}<b>{l.count}건</b></div>
											<div className={'barLine'}>
												<div className={'track'}><div className={'fill'} style={{ width: l.pct + '%', background: i === 0 ? '#1f5fd0' : '#93c5fd' }}></div></div>
												<div className={'pct'}>{l.pct}%</div>
											</div>
										</div>
									))
							}
						</div>

						{/* 시간대별 발생 패턴 */}
						<div className={'rsdChartBox rsdTime'}>
							<div className={'chartHeadRow'}>
								<h3>시간대별 발생 패턴</h3>
								<span className={'badge'}>최다 {detail.maxTimeIdx >= 0 ? RepeatSpeedDetail.TIME_LABELS[detail.maxTimeIdx] : '-'} · {maxTimeCount}건</span>
							</div>
							<div className={'bars'}>
								{
									detail.timeCounts.map((c, i) => (
										<div className={'col' + (i === detail.maxTimeIdx && maxTimeCount > 0 ? ' max' : '')} key={'tc_' + i}>
											<span className={'cnt'}>{c}</span>
											<div className={'bar'} style={{ height: (maxTimeCount > 0 ? (c / maxTimeCount) * 100 : 0) + '%' }}></div>
										</div>
									))
								}
							</div>
							<div className={'labels'}>
								{RepeatSpeedDetail.TIME_LABELS.map((lbl, i) => <span key={'tl_' + i}>{lbl}</span>)}
							</div>
						</div>
					</div>

					{/* 최근 과속 발생 */}
					<div className={'rsdTableWrap'}>
						<div className={'head'}>
							<h3>최근 과속 발생</h3>
							<span className={'meta'}>전체 {detail.count}건 중 최근 {recent.length}건</span>
						</div>
						<table className={'rsdTable'}>
							<thead>
								<tr>
									<th>발생일시</th>
									<th>위치</th>
									<th>측정속도</th>
									<th>제한속도</th>
									<th>초과속도</th>
									<th>위험도</th>
								</tr>
							</thead>
							<tbody>
								{
									recent.map((d, i) => {
										const over = d.speed - this.props.speedLimit;
										const r = this.getOverRisk(d.speed);
										return (
											<tr key={'row_' + i}>
												<td>{this.formatFullDateTime(d.time)}</td>
												<td>{d.sensorName}</td>
												<td>{d.speed}km/h</td>
												<td>{this.props.speedLimit}km/h</td>
												<td className={'red'}>+{over}km/h</td>
												<td><span className={'rsdBadge lv' + r.lv}>{r.label}</span></td>
											</tr>
										);
									})
								}
								{
									recent.length === 0 &&
									<tr><td colSpan={6} style={{ padding: '20px 0', color: '#999' }}>과속 발생 내역이 없습니다.</td></tr>
								}
							</tbody>
						</table>
					</div>

					{/* 하단 버튼 */}
					<div className={'rsdFoot'}>
						<a className={'close'} onClick={onClose}>닫기</a>
						<a className={'excel'} onClick={() => this.onClickExcel(detail)}>↓ Excel 다운로드</a>
					</div>

				</div>
			</RepeatSpeedDetailComponent>
		);
	}
}

export default RepeatSpeedDetail;
