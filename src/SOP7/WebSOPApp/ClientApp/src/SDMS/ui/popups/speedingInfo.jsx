import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PopupDraggable from './popupDraggable';
import { SpeedingInfoComponent } from '../../styled/sdmsPopupsStyled';
import SDMS from '../sdms';

import HistoryController from '../../../History/services/historyController';
import RepeatSpeedDetail from '../../../History/ui/RepeatSpeedDetail';
import ProjectResource from '../../../Root/resource/id';

// 과속차량 알림 (원익 전용) - 신규 과속 감지 시 표출
//  - 기존 단순 알림창을 대체. 최근 과속 발생 목록 + 선택 차량 상세정보 + 상세이력
//  - 위험도(개별 과속): 초과속도 기준 주의/경고/집중관리 (appsettings Options.speedDetection.level1~3)
//  - 상세이력: 반복 과속 의심차량 페이지의 상세보기 팝업(RepeatSpeedDetail) 재사용
class SpeedingInfo extends Component {
	static FALLBACK_SPEED_LIMIT = 25;   // BeaconServer 조회 실패 시 임시 기준값

	constructor(props) {
		super(props);

		this.state = {
			speedLimit: SpeedingInfo.FALLBACK_SPEED_LIMIT,
			cfg: this.getSpeedConfig(),

			locationFilter: 'all',
			selectedKey: null,       // 선택 행 (detectionTime 기준)

			monthData: [],           // 당월 과속 감지(차량번호 有)
			monthCounts: {},         // 차량번호 -> { count, latest }
			monthBegin: '',
			monthEnd: '',

			detailProps: null,       // 상세이력 팝업(RepeatSpeedDetail) props
		};
	}

	getSpeedConfig() {
		const cfg = (ProjectResource.getUserInfo() || {}).options?.speedDetection || {};
		return {
			caution: cfg.caution != null ? cfg.caution : 1,
			warning: cfg.warning != null ? cfg.warning : 2,
			alert: cfg.alert != null ? cfg.alert : 3,
			level1: cfg.level1,
			level2: cfg.level2,
			level3: cfg.level3,
		};
	}

	async componentDidMount() {
		let speedLimit = await HistoryController.requestWonikSpeedLimit();
		if (speedLimit === null || speedLimit === undefined || speedLimit <= 0) {
			speedLimit = SpeedingInfo.FALLBACK_SPEED_LIMIT;
		}
		this.setState({ speedLimit }, () => {
			this.loadMonthData();
			this.selectNewest();
		});
	}

	componentDidUpdate(prevProps) {
		// 새 감지가 들어오면 당월 집계 갱신 + 최신 행 자동 선택
		if (this.props.speedDetectionDatas.length !== prevProps.speedDetectionDatas.length) {
			this.loadMonthData();
			this.selectNewest();
		}
	}

	pad(n) { return n >= 10 ? ('' + n) : ('0' + n); }

	makeDate(d) {
		return d.getFullYear() + '-' + this.pad(d.getMonth() + 1) + '-' + this.pad(d.getDate());
	}

	formatDots(d) {
		if (!d) return '-';
		return d.getFullYear() + '.' + this.pad(d.getMonth() + 1) + '.' + this.pad(d.getDate()) + ' ' + this.pad(d.getHours()) + ':' + this.pad(d.getMinutes()) + ':' + this.pad(d.getSeconds());
	}

	// 시:분:초 (오늘 데이터만 표시하므로 날짜 생략)
	formatTime(d) {
		if (!d) return '-';
		return this.pad(d.getHours()) + ':' + this.pad(d.getMinutes()) + ':' + this.pad(d.getSeconds());
	}

	// 위치 축약 (예: "보안실 A-속도측정장비" -> "보안실 A")
	shortLoc(name) {
		if (!name) return '-';
		const idx = name.indexOf('-');
		return idx > 0 ? name.substring(0, idx).trim() : name;
	}

	// 당월 과속 데이터 조회 (당월 N회 / 상세이력용)
	loadMonthData = async () => {
		const now = new Date();
		const monthBegin = new Date(now.getFullYear(), now.getMonth(), 1);

		const beginStr = this.makeDate(monthBegin) + ' 00:00:00';
		const endStr = this.makeDate(now) + ' 23:59:59';

		const result = await HistoryController.requestWonikSpeedDetectionHistorys(beginStr, endStr, null);

		let monthData = [];
		if (result && result.success !== false && result.speedDetectionDatas?.length > 0) {
			monthData = result.speedDetectionDatas.filter(d => d.speed > this.state.speedLimit && d.carNo);
		}

		const counts = {};
		for (let i = 0; i < monthData.length; i++) {
			const d = monthData[i];
			const t = new Date(d.detectionTime);
			if (!counts[d.carNo]) counts[d.carNo] = { count: 0, latest: null };
			counts[d.carNo].count++;
			if (!counts[d.carNo].latest || t > counts[d.carNo].latest) counts[d.carNo].latest = t;
		}

		this.setState({ monthData, monthCounts: counts, monthBegin: this.makeDate(monthBegin), monthEnd: this.makeDate(now) });
	}

	// 과속(제한초과) 목록 - 오늘 0시 이후 + 위치필터 + 최신순
	getOverspeedList() {
		const limit = this.state.speedLimit;

		// 오늘 0시 이후 데이터만
		const todayStart = new Date();
		todayStart.setHours(0, 0, 0, 0);

		// 오늘 0시 이후 + 과속 + 차량번호(인식번호)가 있는 데이터만
		let list = (this.props.speedDetectionDatas || []).filter(d => d.speed > limit && d.carNo && new Date(d.detectionTime) >= todayStart);

		if (this.state.locationFilter !== 'all') {
			list = list.filter(d => (d.sensorName || '-') === this.state.locationFilter);
		}

		list = list.slice().sort((a, b) => new Date(b.detectionTime) - new Date(a.detectionTime));
		return list;
	}

	getSelected(list) {
		const arr = list || this.getOverspeedList();
		if (arr.length === 0) return null;
		if (this.state.selectedKey) {
			const found = arr.find(d => d.detectionTime === this.state.selectedKey);
			if (found) return found;
		}
		return arr[0];
	}

	selectNewest = () => {
		const list = this.getOverspeedList();
		if (list.length > 0) {
			this.setState({ selectedKey: list[0].detectionTime });
		}
	}

	onClickRow = (d) => {
		this.setState({ selectedKey: d.detectionTime });
	}

	onChangeLocation = (e) => {
		this.setState({ locationFilter: e.target.value, selectedKey: null });
	}

	// 개별 과속 위험도 (초과속도 기준) - 주의/경고/집중관리
	getOverRisk(speed) {
		const over = speed - this.state.speedLimit;
		const cfg = this.state.cfg;
		if (over <= cfg.level1) return { label: '주의', lv: 2 };
		if (over <= cfg.level2) return { label: '경고', lv: 3 };
		return { label: '집중관리', lv: 4 };
	}

	// 반복 과속 횟수 -> 위험도 (상세이력 헤더용)
	classifyRisk(count) {
		const cfg = this.state.cfg;
		if (count >= cfg.alert) return { label: '집중관리', lv: 4 };
		if (count >= cfg.warning) return { label: '경고', lv: 3 };
		if (count >= cfg.caution) return { label: '주의', lv: 2 };
		return { label: '주의', lv: 2 };
	}

	onClickHistory = () => {
		const selected = this.getSelected();
		if (!selected || !selected.carNo) return;

		const carNo = selected.carNo;
		const detections = this.state.monthData.filter(d => d.carNo === carNo);
		const monthCount = detections.length > 0 ? detections.length : 1;

		this.setState({
			detailProps: {
				carNo: carNo,
				risk: this.classifyRisk(monthCount),
				detections: detections,
				speedLimit: this.state.speedLimit,
				levels: { level1: this.state.cfg.level1, level2: this.state.cfg.level2, level3: this.state.cfg.level3 },
				beginDate: this.state.monthBegin,
				endDate: this.state.monthEnd,
			}
		});
	}

	closeDetail = () => {
		this.setState({ detailProps: null });
	}

	getLocationOptions() {
		const set = {};
		(this.props.speedDetectionDatas || []).forEach(d => { const n = d.sensorName || '-'; set[n] = true; });
		return Object.keys(set);
	}

	render() {
		const limit = this.state.speedLimit;
		const list = this.getOverspeedList();
		const selected = this.getSelected(list);
		const locationOptions = this.getLocationOptions();

		// 선택 차량 정보
		let plate = '-', repeat = false, monthCount = 0, latestStr = '';
		let selSpeed = 0, selOver = 0, selLoc = '-';
		if (selected) {
			selSpeed = selected.speed;
			selOver = selected.speed - limit;
			selLoc = selected.sensorName || '-';

			if (selected.carNo) {
				plate = selected.carNo;

				// 당월 데이터 + 오늘 실시간 데이터를 합쳐 이 번호의 발생을 집계
				//  - 방금 채워진 최신 감지가 당월 조회분에 아직 없을 수 있어 실시간도 함께 본다.
				//  - 당월 횟수(count)는 현재 선택 건 포함, '최근'은 현재 선택 건을 제외한
				//    직전(이전) 발생 중 가장 최근 시각. 이전 발생이 없으면 생략한다.
				const seen = {};
				let count = 0;
				let latest = null;
				const collect = (arr, onlyOver) => {
					(arr || []).forEach(d => {
						if (d.carNo !== selected.carNo) return;
						if (onlyOver && d.speed <= limit) return;
						if (seen[d.detectionTime]) return;
						seen[d.detectionTime] = true;
						count++;
						if (d.detectionTime === selected.detectionTime) return;   // 현재 선택 건은 '최근'에서 제외
						const t = new Date(d.detectionTime);
						if (!latest || t > latest) latest = t;
					});
				};
				collect(this.state.monthData, false);           // monthData 는 이미 과속만
				collect(this.props.speedDetectionDatas, true);   // 실시간은 과속만 반영

				monthCount = count;
				latestStr = latest ? this.formatDots(latest) : '';   // 이전 발생 없으면 생략
				repeat = monthCount >= 2;
			}
		}

		return (
			<>
			<SpeedingInfoComponent id={this.props.popupType} className={'viewDashboardBoxD viewDashboard'}>
				<PopupDraggable
					id={this.props.popupType}
					popupMinWidth={560}
					popupMinHeight={840}
					topSize={32}
					popupState={this.props.popupState}
					setActiveDragPopup={this.props.setActiveDragPopup}
					setPopupState={this.props.setPopupState}
					usePopupResize={false}
				>
					<div className={'dslTop dslGrd'}>
						<h5 className={'dslTitle'}>과속차량 알림</h5>
						<a className={'dslX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.speedingInfo, false)}></a>
					</div>

					<div className={'dslCont'}>

						{/* 최근 과속 발생 */}
						<div className={'spdListHead'}>
							<div className={'spdSecTitle'}>최근 과속 발생</div>
							<select className={'spdLocSel'} value={this.state.locationFilter} onChange={this.onChangeLocation}>
								<option value="all">전체 위치</option>
								{locationOptions.map((n) => <option key={'loc_' + n} value={n}>{n}</option>)}
							</select>
						</div>

						<div className={'spdTableWrap'}>
							<table className={'spdTable'}>
								<thead>
									<tr>
										<th>발생일시</th>
										<th>인식번호</th>
										<th>위치</th>
										<th>측정속도</th>
										<th>제한속도</th>
										<th>초과속도</th>
										<th>위험도</th>
									</tr>
								</thead>
								<tbody>
									{
										list.map((d, i) => {
											const over = d.speed - limit;
											const risk = this.getOverRisk(d.speed);
											const isOn = selected && d.detectionTime === selected.detectionTime;
											return (
												<tr key={'sd_' + i} className={isOn ? 'on' : ''} onClick={() => this.onClickRow(d)}>
													<td>{this.formatTime(new Date(d.detectionTime))}</td>
													<td>{d.carNo}</td>
													<td title={d.sensorName || '-'}>{this.shortLoc(d.sensorName)}</td>
													<td>{d.speed}km/h</td>
													<td>{limit}km/h</td>
													<td className={'over'}>+{over}km/h</td>
													<td><span className={'spdRisk lv' + risk.lv}>{risk.label}</span></td>
												</tr>
											);
										})
									}
									{
										list.length === 0 &&
										<tr><td colSpan={7} className={'spdEmpty'}>과속 발생 내역이 없습니다.</td></tr>
									}
								</tbody>
							</table>
						</div>

						{/* 선택 차량 상세정보 */}
						<div className={'spdSecTitle'} style={{ marginTop: '18px' }}>선택 차량 상세정보</div>
						<div className={'spdDetail'}>
							<div className={'spdPlateRow'}>
								<span className={'spdPlate'}>{plate}</span>
								<div className={'spdPlateInfo'}>
									{repeat && <span className={'repeat'}>반복 과속 의심</span>}
									<div className={'meta'}>{monthCount > 0 ? ('당월 ' + monthCount + '회' + (latestStr ? (' · 최근 ' + latestStr) : '')) : '당월 집계 없음'}</div>
								</div>
							</div>

							<div className={'spdStats'}>
								<div className={'col'}><div className={'t'}>측정속도</div><div className={'v red'}>{selSpeed}<small>km/h</small></div></div>
								<div className={'col'}><div className={'t'}>제한속도</div><div className={'v'}>{limit}<small>km/h</small></div></div>
								<div className={'col'}><div className={'t'}>초과속도</div><div className={'v red'}>+{selOver}<small>km/h</small></div></div>
							</div>

							<div className={'spdLoc'}>
								<span className={'t'}>발생위치</span>
								<span className={'v'}>{selLoc}</span>
							</div>

							<div className={'spdNote'}>※ 카메라 인식 결과이며 약 30초 후 수신됩니다.</div>
						</div>

						{/* 상세이력 */}
						<div className={'spdFoot'}>
							<a className={'spdHistBtn'} onClick={this.onClickHistory}>▤ 상세이력</a>
						</div>

					</div>
				</PopupDraggable>
			</SpeedingInfoComponent>

			{
				this.state.detailProps &&
				ReactDOM.createPortal(
					<RepeatSpeedDetail {...this.state.detailProps} onClose={this.closeDetail} />,
					document.body
				)
			}
			</>
		);
	}
}

export default SpeedingInfo;
