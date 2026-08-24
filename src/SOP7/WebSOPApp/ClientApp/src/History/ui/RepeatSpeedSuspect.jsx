import React, { Component } from 'react';
import { getSearchMinDate } from '../util/searchDateLimit';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale';
import btnCalendarBk from '../../Common/img/sub/dashboard_calendar_bk.png';
import btnCalendarBk_wonik from '../../Common/img/sub/dashboard_calendar_bk_wonik.png';

import HistoryController from '../services/historyController';
import ProjectResource from '../../Root/resource/id';
import { i18n, withTranslation } from '../../language/i18n';

// 반복 과속 의심차량 (원익 전용)
// ※ 화면은 헤더 + 검색(필터)바 까지만 구현. 통계/순위 목록 등 상세 영역은 추후 구현 예정.
// ※ Excel 다운로드 버튼은 UI만 배치. 기능은 추후 구현 예정.
class RepeatSpeedSuspect extends Component {

	constructor(props) {
		super(props);

		this.state = {
			sensors: [],
			selectedSensor: -1,

			dateType: 'today',
			beginDate: new Date(),
			endDate: new Date(),

			plateNumber: '',   // 카메라 인식번호
			rank: 5,           // 표시 순위 (Top N)
		}

		this.refDatepicker01 = React.createRef();
		this.refDatepicker02 = React.createRef();

		this.props = props;

		this.init();
	}

	init = async () => {
		// 위치 불러오기 (기존 차량과속 이력과 동일한 센서 목록 사용)
		let result = await HistoryController.requestWonikSpeedDetectionSensors();

		let sensors = [];
		if (result !== null && result.success === true && result.sensors?.length > 0) {
			sensors = result.sensors;
		}

		this.setState({ sensors });
	}

	onChangeSensor = (target) => {
		this.setState({ selectedSensor: Number(target.value) });
	}

	onChangePlateNumber = (e) => {
		this.setState({ plateNumber: e.target.value });
	}

	onClickRank = (rank) => {
		this.setState({ rank });
	}

	onChangeBegin = (date) => {
		this.setState({ beginDate: date, dateType: 'select' });
	}

	onChangeEnd = (date) => {
		this.setState({ endDate: date, dateType: 'select' });
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

	// 검색 - 상세 화면은 추후 구현 예정
	onClickSearch = () => {
	}

	// Excel 다운로드 - 기능은 추후 구현 예정
	onClickExcelDownload = () => {
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

	render() {
		const sensorUI = this.getSensorUI();
		const rankUI = this.getRankUI();
		const calendarImg = ProjectResource.styleMode === ProjectResource.StyleType.Soulbrain ? btnCalendarBk : btnCalendarBk_wonik;

		return (
			<>
				<div id={'hsty'}>
					<div className={'hsScr'}>
						<div id={'hsCont'}>

							<div className={'hscHead'}>
								<div className={'hscHeadTop'}>
									<h2>반복 과속 의심차량</h2>
								</div>
								<p className={'hscDesc'}>동일하게 인식된 차량번호의 반복 과속 횟수와 위험도를 확인합니다.</p>
							</div>

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
															maxDate={new Date()} minDate={getSearchMinDate()}
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
															maxDate={new Date()} minDate={getSearchMinDate()}
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
										<dt>표시 순위</dt>
										<dd>
											<ul className={'hscsRank'}>
												{rankUI}
											</ul>
										</dd>
									</dl>
									<a onClick={this.onClickSearch} className={'hscsSbmt'}><span><span>{i18n.t('history.formText.검색')}</span></span></a>
								</div>
							</form>

							<ul className={'hscExl'}>
								<li><a onClick={this.onClickExcelDownload} className={'exl'}>Excel 다운로드</a></li>
							</ul>

						</div>
					</div>
				</div>
			</>
		);
	}
}

export default withTranslation()(RepeatSpeedSuspect);
