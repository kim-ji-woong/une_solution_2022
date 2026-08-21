import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';

import { Dashboard } from '../../styled/dashboardWonik';

import BoardView  from './boardViewWonik';
import BoardViewSecurityOffice from './boardViewSecurityOffice';
import AccessWonik from './accessWonik';
import SensorWonik from './sensorWonik';
import PerceptionWonik from './perceptionWonik';
import OperationWonik from './operationWonik';
import WeatherWonik from './weatherWonik';
import WeeklyWonik from './weeklyWonik';

import ProjectResource from '../../../Root/resource/id';
import AccountResource from '../../../Account/resource/id';
import { DashboardController } from '../../services/dashboardController';

import store from '../../../Root/store';

class DashboardWonik extends Component {
	 constructor(props) {
        super(props);
		
		this.state = {
			selectSiteID: -1,
			monthAlarms: [],
			siteScores: [],
        }

		this.props = props;

		this.initSiteID();
		this.init();
	}

	componentDidMount() {
		$('body').css({ 'background': '#0E162D' });
	}


	initSiteID() {
		let selectSiteID = -1;

		const siteID = ProjectResource.SiteID;
		const userInfo = ProjectResource.getUserInfo();

        if (userInfo) {
			if (userInfo.levelID !== AccountResource.accountLevelID.master &&
				userInfo.levelID !== AccountResource.accountLevelID.wonikCEO &&
				userInfo.levelID !== AccountResource.accountLevelID.wonikSafety &&
				userInfo.levelID !== AccountResource.accountLevelID.wonikSafeAdmin) {
				selectSiteID = userInfo.siteID;
			}
		} else if (siteID) {
			selectSiteID = siteID;
		}

		this.state.selectSiteID = selectSiteID;
	}

	async init() {
		let monthAlarms = [];
		let siteScores = [];

		// 6개월 알람 정보 가져오기
        const [monthAlarmData, message] = await DashboardController.requestMonthStatus();
        if (monthAlarmData)
			monthAlarms = monthAlarmData;

		// 캠퍼스별 평균점수 가져오기
		const [siteScoreData, message2] = await DashboardController.requestLoadSiteScores();
		if (siteScoreData)
			siteScores = siteScoreData;

		this.setState({ monthAlarms, siteScores });
	}

	onClickSelectSite = (siteID) => {
		this.setState({selectSiteID: siteID});
	}

	todayAlarms = () => {
		const selectSiteID = this.state.selectSiteID;
		const projectSiteID = ProjectResource.SiteID;

		const todayAllAlarms = this.props.todayAllAlarms;
		const buildingGroupList = this.props.buildingGroupList;

		const todayAlarms = [];


		for (let j = 0; j < todayAllAlarms?.length; j++) {
			let todayAlarmData = todayAllAlarms[j];
			let todayAlarm = new Object();
			let chk = false;
			
				
			for (let i = 0; i < buildingGroupList?.length; i++) {
				const buildingGroup = buildingGroupList[i];
				let chkOutdoor = false;

				if (selectSiteID === -1 || 
					(selectSiteID && buildingGroup.siteID === selectSiteID)) {

					if (chkOutdoor === false) {
						chkOutdoor = true;
						let outZoneID = null;
						if (projectSiteID) {
							outZoneID = 20000 + (buildingGroup.siteID - projectSiteID);

							if (todayAlarmData.zoneID === outZoneID) {
								chk = true;
								todayAlarm.buildingGroupID = null;
                                todayAlarm.buildingID = null;
                                break;
							}
						}
                    }
					
					for (let z = 0; z < buildingGroup.buildingDatas?.length; z++) {
                        const building = buildingGroup.buildingDatas[z];

						for (let n = 0; n < building.zoneDatas?.length; n++) {
                            const zone = building.zoneDatas[n];

							if (zone.id === todayAlarmData.zoneID) {
                                chk = true;
                                todayAlarm.buildingGroupID = buildingGroup.id;
                                todayAlarm.buildingID = building.id;
                                break;
                            }
						}

						if (chk === true)
                            break;
					}
				}

				if (chk === true)
                    break;
			}

			if (chk === true) {
				todayAlarm.time = todayAlarmData.dtTime;
				todayAlarm.orgSensorID = todayAlarmData.orgSensorID;
				todayAlarm.facilityType = todayAlarmData.facilityType;
				todayAlarm.zoneID = todayAlarmData.zoneID;
				todayAlarm.sensorZoneID = todayAlarmData.sensorZoneID;
				todayAlarm.isAlarm = todayAlarmData.isAlarm;
				todayAlarm.materialType = todayAlarmData.materialType;

				todayAlarms.push(todayAlarm);
            }
		} 
		
		return todayAlarms;
	}

	getBoardViewUI = (todayAlarms) => {
		let userLevelID = null;
		let boardViewUI = null;

		const userInfo = ProjectResource.getUserInfo();
		
		if (userInfo?.levelID !== null && userInfo?.levelID !== undefined) {
			userLevelID = userInfo?.levelID;
		}

		if (userLevelID === AccountResource.accountLevelID.wonikSecurity) {
			boardViewUI = (
				<BoardViewSecurityOffice
					selectSiteID={this.state.selectSiteID}
					buildingGroupList={this.props.buildingGroupList}
					workerInfos={this.props.workerInfos}
				/>);
		} else {		
			boardViewUI = (
				<BoardView
					selectSiteID={this.state.selectSiteID}
					buildingGroupList={this.props.buildingGroupList}
					useSensorList={this.props.useSensorList}
					useSensorTypes={this.props.useSensorTypes}
					onClickSelectSite={this.onClickSelectSite}
					todayAlarms={todayAlarms}
					siteScores={this.state.siteScores}
					outdoorZones={this.props.outdoorZones}
				/>);
		}

		return boardViewUI;
	}

	onClickSample() {
		// 샘플영상 탭 띄우기
		window.open(ProjectResource.path.sampleVideo);
    }

	render() {
		const todayAlarms = this.todayAlarms();
		const boardViewUI = this.getBoardViewUI(todayAlarms);

		return (
			<>
				{/* <TitleBar /> */}
				<Dashboard>
					<span className={'gridMovieBox'} onClick={this.onClickSample}>가이드 영상<span className={'gridPlayBtn'}></span></span>
					{/* 작업자 입출입 현황 */}
					<AccessWonik
						selectSiteID={this.state.selectSiteID}
						buildingGroupList={this.props.buildingGroupList}
						workerInfos={this.props.workerInfos}
					/>

					{/* 대시보드 메인영역 */}
					{boardViewUI}

					{/* 이상 센서 알람 */}
					<SensorWonik 
						todayAlarms={todayAlarms}
						useSensorTypes={this.props.useSensorTypes}
					/>

					{/* 감지항목별 알림현황 */}
					<PerceptionWonik 
						selectSiteID={this.state.selectSiteID}
						buildingGroupList={this.props.buildingGroupList}
						todayAlarms={todayAlarms}
						useSensorList={this.props.useSensorList}
					/>

					{/* 실시간 작업 현황 */}
					<OperationWonik 
						selectSiteID={this.state.selectSiteID}
						buildingGroupList={this.props.buildingGroupList}
						workPermit={this.props.workPermit}
					/>

					{/* 주간 현황 */}
					<WeeklyWonik 
						todayAlarms={todayAlarms}
						weeklyAlarms={this.props.weeklyAlarms}
						monthAlarms={this.state.monthAlarms}
					/>

					{/* 기상 정보 */}
					<WeatherWonik
						selectSiteID={this.state.selectSiteID}
						weatherDatas={this.props.weatherDatas}
						weeklyDatas={this.props.weeklyDatas}
					/>
				</Dashboard>
				
            </>
        );
    }
}

export default withRouter(DashboardWonik);