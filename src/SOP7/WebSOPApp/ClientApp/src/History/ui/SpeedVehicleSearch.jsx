import React, { Component } from 'react';
import SpeedAllHistory from './SpeedAllHistory';
import RepeatSpeedSuspect from './RepeatSpeedSuspect';

// 과속차량 조회 (원익 전용) - 과속 관련 화면 두 개를 탭으로 묶은 컨테이너.
//  - 전체 과속 이력(기본)   : 1회 과속·미매칭 건까지 포함한 모든 발생 이력
//  - 반복 과속 의심차량     : 동일 인식번호의 반복 과속 횟수와 위험도
//  페이지 외곽(hsty/hsScr/hsCont) · 제목 · 탭은 여기서 그리고,
//  각 탭 컴포넌트는 자기 내용(검색바 · 카드 · 표)만 반환한다.
//  탭은 한 번 열면 그대로 두고 display 로만 감춘다. (탭을 오갈 때마다 재조회하지 않기 위해)
//
//  공통 검색 조건(위치 · 조회 기간 · 카메라 인식번호)은 여기서 들고 있어 두 탭이 같은 값을 쓴다.
//    - 탭을 옮겨도 조건이 그대로 유지된다.
//    - 옮겨 간 탭의 마지막 조회 조건(위치 · 조회 기간)과 다르면 그 탭이 스스로 다시 조회한다.
//    - 위험도 · 표시 순위처럼 한 탭에만 있는 조건은 각 탭이 따로 가진다.
class SpeedVehicleSearch extends Component {
	static TAB_ALL = 'all';
	static TAB_REPEAT = 'repeat';

	constructor(props) {
		super(props);

		const today = new Date();

		this.state = {
			tab: SpeedVehicleSearch.TAB_ALL,
			opened: { [SpeedVehicleSearch.TAB_ALL]: true },   // 한 번이라도 연 탭

			// 두 탭 공통 검색 조건
			criteria: {
				selectedSensor: -1,      // 위치 (-1 = 전체)
				beginDate: today,        // 조회 기간 (기본값: 오늘)
				endDate: today,
				plateNumber: '',         // 카메라 인식번호
			},
		}

		this.props = props;
	}

	onClickTab = (tab) => {
		if (this.state.tab === tab) return;

		const opened = Object.assign({}, this.state.opened);
		opened[tab] = true;

		this.setState({ tab, opened });
	}

	// 공통 검색 조건 변경 - 바뀐 항목만 넘기면 나머지는 유지된다.
	onChangeCriteria = (patch) => {
		this.setState((prev) => ({ criteria: Object.assign({}, prev.criteria, patch) }));
	}

	getTabUI() {
		const tabs = [
			{ key: SpeedVehicleSearch.TAB_ALL, label: '전체 과속 이력' },
			{ key: SpeedVehicleSearch.TAB_REPEAT, label: '반복 과속 의심차량' },
		];

		return tabs.map((t) => (
			<li key={'svsTab_' + t.key}>
				<a onClick={() => this.onClickTab(t.key)} className={this.state.tab === t.key ? 'on' : ''}>{t.label}</a>
			</li>
		));
	}

	render() {
		const tab = this.state.tab;
		const opened = this.state.opened;
		const criteria = this.state.criteria;

		return (
			<div id={'hsty'}>
				<div className={'hsScr'}>
					<div id={'hsCont'}>

						{/* 헤더 */}
						<div className={'hscHead'}>
							<div className={'hscHeadTop'}>
								<h2>과속차량 조회</h2>
							</div>
							<p className={'hscDesc'}>기간별 전체 과속 이력과 반복 과속 의심차량을 조회합니다.</p>
						</div>

						{/* 탭 */}
						<ul className={'svsTab'}>
							{this.getTabUI()}
						</ul>

						{
							opened[SpeedVehicleSearch.TAB_ALL] &&
							<div className={'svsPane'} style={{ display: tab === SpeedVehicleSearch.TAB_ALL ? 'block' : 'none' }}>
								<SpeedAllHistory key='svs_SpeedAllHistory' selectedSiteID={this.props.selectedSiteID}
									criteria={criteria} onChangeCriteria={this.onChangeCriteria} active={tab === SpeedVehicleSearch.TAB_ALL} />
							</div>
						}

						{
							opened[SpeedVehicleSearch.TAB_REPEAT] &&
							<div className={'svsPane'} style={{ display: tab === SpeedVehicleSearch.TAB_REPEAT ? 'block' : 'none' }}>
								<RepeatSpeedSuspect key='svs_RepeatSpeedSuspect' selectedSiteID={this.props.selectedSiteID}
									criteria={criteria} onChangeCriteria={this.onChangeCriteria} active={tab === SpeedVehicleSearch.TAB_REPEAT} />
							</div>
						}

					</div>
				</div>
			</div>
		);
	}
}

export default SpeedVehicleSearch;
