
import React, { Component } from 'react';
import $ from 'jquery';

import newStyles from '../../../Common/css/newStyle.module.css';
import settings from '../../css/settings.module.css';

import SDMSResource from '../../../SDMS/resource/id';
import RootResource from '../../../Root/resource/id';
import { SDMSController } from '../../../SDMS/services/sdmsController';
import SettingsResource from '../../resource/id';
import SDMS from '../../../SDMS/ui/sdms';
import StatusInfo from '../../../SDMS/ui/popups/statusInfo';


import { SettingCommon, StgTab, SopSetCont } from '../../styled/SettingStyled';
import ProjectResource from '../../../Root/resource/id';


class AdvancedTab extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectBuildingGroup: null,					// 선택된 빌딩그룹
			selectBuilding: null,						// 선택된 빌딩
			selectZone: null,							// 선택된 층
			selectedDisasterCategory: null,				// 선택된 재난분야
			selectedSubDisasterCategory: null,			// 선택된 재난종류
			selectedDisasterData: null,					// 선택 SOP
			selectFacilityType: SDMSResource.facilityType.ETC,

			reload: true,
			sensorDatas: null,

			sensorCategory: 1, // Default : 대기 센서 목록
		}

		this.props = props;

	}

	componentDidMount() {
		// ETC 센서 선택
		$("#facilityType_radio_" + SDMSResource.facilityType.ETC).prop("checked", true);

		this.getSensorDatas();

		//this.setBuildingGroupList();

		//$(document).ready(function () {
		//	$("#spreadBtn01").click(function () {
		//		if ($("#hiddenContent01").is(":visible")) {
		//			$("#hiddenContent01").slideUp();
		//		} else {
		//			$("#hiddenContent01").slideDown();
		//		}
		//	});

		//	$("#spreadBtn02").click(function () {
		//		if ($("#hiddenContent02").is(":visible")) {
		//			$("#hiddenContent02").slideUp();
		//		} else {
		//			$("#hiddenContent02").slideDown();
		//		}
		//	});
		//});

		$(document).ready(function () {
			$('h5[id^="spreadBtn01"]').click(function () {
				$(this).next('ul').slideToggle();
			});

			$('h5[id^="spreadBtn02"]').click(function () {
				$(this).next('ul').slideToggle();
			})
		});
	}

	setBuildingGroupList = () => {
		if (this.props.buildingGroupList === null || this.props.buildingGroupList === undefined)
			return;

		const buildingGroup = this.props.buildingGroupList[0]; // 여수산단 : BulidingGroup = 여수산단 한개 => 미리 설정해놓음

		this.setState({ selectBuildingGroup: buildingGroup });
	}

	async getSensorDatas() {
		const result = await SDMSController.requestSensorDatas();

		if (result === null || result === undefined)
			return;

		const sensorDatas = result.sensorDatas;

		this.setState({ sensorDatas: sensorDatas });

	}

	displayBuildingGroup = () => {
		let buildingGroup = [];
		let building = [];
		let zone = [];

		const buildingGroupList = this.props.buildingGroupList;

		if (buildingGroupList === null || buildingGroupList === undefined)
			return [buildingGroup, building, zone];

		for (let i = 0; i < buildingGroupList.length; i++) {
			const buildingGroupData = buildingGroupList[i];

			if (this.state.selectBuildingGroup !== null && this.state.selectBuildingGroup !== undefined && this.state.selectBuildingGroup.id === buildingGroupData.id)
				buildingGroup.push(<li key={"buildingGroup_" + buildingGroupData.id}><input type="radio" name="buildingGroup_radio" id={"buildingGroup_radio_" + buildingGroupData.id} defaultChecked /><label htmlFor={"buildingGroup_radio_" + buildingGroupData.id} onClick={() => this.onClickBuildingGroup(buildingGroupData)} >{buildingGroupData.displayText}</label></li>);
			else
				buildingGroup.push(<li key={"buildingGroup_" + buildingGroupData.id}><input type="radio" name="buildingGroup_radio" id={"buildingGroup_radio_" + buildingGroupData.id} /><label htmlFor={"buildingGroup_radio_" + buildingGroupData.id} onClick={() => this.onClickBuildingGroup(buildingGroupData)} >{buildingGroupData.displayText}</label></li>);
		}

		if (this.state.selectBuildingGroup !== null && this.state.selectBuildingGroup !== undefined) {
			const selectBuildingGroup = this.state.selectBuildingGroup;
			//buildingDatas = Array(23) [Object, Object, Object, …]
			for (let i = 0; i < selectBuildingGroup.buildingDatas.length; i++) {
				const buildingData = selectBuildingGroup.buildingDatas[i];

				if (this.state.selectBuilding !== null && this.state.selectBuilding !== undefined && this.state.selectBuilding.id === buildingData.id)
					building.push(<li key={"building_" + buildingData.id}><input type="radio" name="building_radio" id={"building_radio_" + buildingData.id} defaultChecked /><label fhtmlForor={"building_radio_" + buildingData.id} onClick={() => this.onClickBuilding(buildingData)}>{buildingData.displayText}</label></li>);
				else
					building.push(<li key={"building_" + buildingData.id}><input type="radio" name="building_radio" id={"building_radio_" + buildingData.id} /><label htmlFor={"building_radio_" + buildingData.id} onClick={() => this.onClickBuilding(buildingData)}>{buildingData.displayText}</label></li>);
			}
		}

		if (this.state.selectBuilding !== null && this.state.selectBuilding !== undefined) {
			const selectBuilding = this.state.selectBuilding;
			//zoneDatas = Array(2) [Object, Object]
			for (let i = 0; i < selectBuilding.zoneDatas.length; i++) {
				const zoneData = selectBuilding.zoneDatas[i];

				if (this.state.selectZone !== null && this.state.selectZone !== undefined && this.state.selectZone.id === zoneData.id)
					zone.push(<li key={"zone_" + zoneData.id}><input type="radio" name="zone_radio" id={"zone_radio_" + zoneData.id} defaultChecked /><label htmlFor={"zone_radio_" + zoneData.id} onClick={() => this.onClickZone(zoneData)}>{zoneData.displayText}</label></li>);
				else
					zone.push(<li key={"zone_" + zoneData.id}><input type="radio" name="zone_radio" id={"zone_radio_" + zoneData.id} /><label htmlFor={"zone_radio_" + zoneData.id} onClick={() => this.onClickZone(zoneData)}>{zoneData.displayText}</label></li>);
			}
		}

		return [buildingGroup, building, zone];
	}

	onClickBuildingGroup = (buildingGroup) => {
		let buildingData = null;

		if (buildingGroup !== null && buildingGroup !== undefined) {
			for (let i = 0; i < buildingGroup.buildingDatas.length; i++) {
				if (i === 0) {
					buildingData = buildingGroup.buildingDatas[i];
					break;
				}
			}
		}

		this.setState({ selectBuildingGroup: buildingGroup, selectBuilding: buildingData, selectZone: null });
	}

	onClickBuilding = (buildingData) => {
		const selectBuilding = this.state.selectBuilding;

		for (let i = 0; i < selectBuilding.zoneDatas.length; i++) {
			const zoneData = selectBuilding.zoneDatas[i];

			$("#zone_radio_" + zoneData.id).prop("checked", false);
		}

		this.setState({ selectBuilding: buildingData, selectZone: null });
	}

	onClickZone = (zoneData) => {

		console.log(zoneData);

		this.setState({ selectZone: zoneData });
	}

	displayDisasterCategory = () => {
		let disasterCategory = [];
		let subDisasterCategory = [];
		let disaster = [];

		const disasterCategories = this.props.disasterCategories;

		if (disasterCategories === null || disasterCategories === undefined)
			return [disasterCategory, subDisasterCategory, disaster];

		for (let i = 0; i < disasterCategories.length; i++) {
			const disaster = disasterCategories[i];

			if (this.state.selectedDisasterCategory !== null && this.state.selectedDisasterCategory !== undefined && this.state.selectedDisasterCategory.disasterCategory.id === disaster.disasterCategory.id)
				disasterCategory.push(<li key={"disaster_" + disaster.disasterCategory.id}><input type="radio" name="disaster_radio" id={"disaster_radio_" + disaster.disasterCategory.id} defaultChecked /><label htmlFor={"disaster_radio_" + disaster.disasterCategory.id} onClick={() => this.onClickDisasterCategory(disaster)}>{disaster.disasterCategory.categoryName}</label></li>);
			else
				disasterCategory.push(<li key={"disaster_" + disaster.disasterCategory.id}><input type="radio" name="disaster_radio" id={"disaster_radio_" + disaster.disasterCategory.id} /><label htmlFor={"disaster_radio_" + disaster.disasterCategory.id} onClick={() => this.onClickDisasterCategory(disaster)}>{disaster.disasterCategory.categoryName}</label></li>);
		}

		if (this.state.selectedDisasterCategory !== null && this.state.selectedDisasterCategory !== undefined) {
			const selectedDisasterCategory = this.state.selectedDisasterCategory;
			const subDisasterCategories = selectedDisasterCategory.subDisasterCategories;

			if (subDisasterCategories !== null && subDisasterCategories !== undefined) {
				for (let i = 0; i < subDisasterCategories.length; i++) {
					const subDisaster = subDisasterCategories[i];

					if (this.state.selectedSubDisasterCategory !== null && this.state.selectedSubDisasterCategory !== undefined && this.state.selectedSubDisasterCategory.subDisasterCategory.id === subDisaster.subDisasterCategory.id)
						subDisasterCategory.push(<li key={"subDisaster_" + subDisaster.subDisasterCategory.id}><input type="radio" name="subDisaster_radio" id={"subDisaster_radio_" + subDisaster.subDisasterCategory.id} defaultChecked /><label htmlFor={"subDisaster_radio_" + subDisaster.subDisasterCategory.id} onClick={() => this.onClickSubDisasterCategory(subDisaster)}>{subDisaster.subDisasterCategory.subCategoryName}</label></li>);
					else
						subDisasterCategory.push(<li key={"subDisaster_" + subDisaster.subDisasterCategory.id}><input type="radio" name="subDisaster_radio" id={"subDisaster_radio_" + subDisaster.subDisasterCategory.id} /><label htmlFor={"subDisaster_radio_" + subDisaster.subDisasterCategory.id} onClick={() => this.onClickSubDisasterCategory(subDisaster)}>{subDisaster.subDisasterCategory.subCategoryName}</label></li>);
				}
			}
		}

		if (this.state.selectedSubDisasterCategory !== null && this.state.selectedSubDisasterCategory !== undefined) {
			const disasterDatas = this.state.selectedSubDisasterCategory.disasterDatas; //disasterName

			for (let i = 0; i < disasterDatas.length; i++) {
				const disasterData = disasterDatas[i];

				if (this.state.selectedDisasterData !== null && this.state.selectedDisasterData !== undefined && this.state.selectedDisasterData.disasterName === disasterData.disasterName)
					disaster.push(<li key={"disasterData_" + disasterData.disasterName}><input type="radio" name="disasterData_radio" id={"disasterData_radio_" + disasterData.disasterName} defaultChecked /><label htmlFor={"disasterData_radio_" + disasterData.disasterName} onClick={() => this.onClickDisasterData(disasterData)}>{disasterData.disasterName}</label></li>);
				else
					disaster.push(<li key={"disasterData_" + disasterData.disasterName}><input type="radio" name="disasterData_radio" id={"disasterData_radio_" + disasterData.disasterName} /><label htmlFor={"disasterData_radio_" + disasterData.disasterName} onClick={() => this.onClickDisasterData(disasterData)}>{disasterData.disasterName}</label></li>);
			}
		}

		return [disasterCategory, subDisasterCategory, disaster];
	}

	onClickDisasterCategory = (disasterCategory) => {
		this.setState({ selectedDisasterCategory: disasterCategory, selectedSubDisasterCategory: null, selectedDisasterData: null });
	}

	onClickSubDisasterCategory = (subDisasterCategory) => {
		this.setState({ selectedSubDisasterCategory: subDisasterCategory, selectedDisasterData: null });
	}

	onClickDisasterData = (disasterData) => {
		this.setState({ selectedDisasterData: disasterData });
	}

	displayFacilityType() {
		//SDMSResource
		let facilityType = [];

		facilityType.push(<li key={"facilityType_" + SDMSResource.facilityType.FIRE}><input type="radio" name="facilityType" id={"facilityType_radio_" + SDMSResource.facilityType.FIRE} /><label htmlFor={"facilityType_radio_" + SDMSResource.facilityType.FIRE} onClick={() => this.onClickFacilityType(SDMSResource.facilityType.FIRE)}>{SDMSResource.getFacilityTypeString(SDMSResource.facilityType.FIRE)}</label></li>);
		facilityType.push(<li key={"facilityType_" + SDMSResource.facilityType.PSM_SENSOR}><input type="radio" name="facilityType" id={"facilityType_radio_" + SDMSResource.facilityType.PSM_SENSOR} /><label htmlFor={"facilityType_radio_" + SDMSResource.facilityType.PSM_SENSOR} onClick={() => this.onClickFacilityType(SDMSResource.facilityType.PSM_SENSOR)}>{SDMSResource.getFacilityTypeString(SDMSResource.facilityType.PSM_SENSOR)}</label></li>);
		facilityType.push(<li key={"facilityType_" + SDMSResource.facilityType.ETC}><input type="radio" name="facilityType" id={"facilityType_radio_" + SDMSResource.facilityType.ETC} /><label htmlFor={"facilityType_radio_" + SDMSResource.facilityType.ETC} onClick={() => this.onClickFacilityType(SDMSResource.facilityType.ETC)}>{SDMSResource.getFacilityTypeString(SDMSResource.facilityType.ETC)}</label></li>);
		facilityType.push(<li key={"facilityType_" + SDMSResource.facilityType.Intrusion_S1}><input type="radio" name="facilityType" id={"facilityType_radio_" + SDMSResource.facilityType.Intrusion_S1} /><label htmlFor={"facilityType_radio_" + SDMSResource.facilityType.Intrusion_S1} onClick={() => this.onClickFacilityType(SDMSResource.facilityType.Intrusion_S1)}>지능형 영상</label></li>);

		return facilityType;
	}

	onClickFacilityType = (facilityType) => {
		const buildingGroupList = this.props.buildingGroupList;

		if (buildingGroupList !== null && buildingGroupList !== undefined) {
			for (let i = 0; i < buildingGroupList.length; i++) {
				const buildingGroupData = buildingGroupList[i];

				$("#buildingGroup_radio_" + buildingGroupData.id).prop("checked", false);
			}
		}

		this.setState({ selectFacilityType: facilityType, selectBuildingGroup: null, selectBuilding: null, selectZone: null });
	}

	displayLinkedSOP() {
		let linkedSOPUI = [];
		const linkedSOPs = this.props.linkedSOPs;

		if (linkedSOPs === null || linkedSOPs === undefined)
			return linkedSOPUI;

		let num = 1;
		const selectBuildingGroup = this.state.selectBuildingGroup;
		const selectBuilding = this.state.selectBuilding;
		const selectZone = this.state.selectZone;
		const selectFacilityType = this.state.selectFacilityType;

		const disasterCategories = this.props.disasterCategories;
		const buildingGroupList = this.props.buildingGroupList;

		let facilityType = "";
		let buildingGroup = "";
		let building = "";
		let zone = "";

		let disasterCategory = "";
		let subDisasterCategory = "";

		for (let i = 0; i < linkedSOPs.length; i++) {
			let sopData = linkedSOPs[i];

			if (selectFacilityType !== sopData.facilityTypeID)
				continue;
			else if (selectBuilding !== null && sopData.linkedBuildingID !== selectBuilding.id)
				continue;
			else if (selectZone !== null && sopData.linkedZoneID !== selectZone.id)
				continue;

			if (selectFacilityType !== SDMSResource.facilityType.Intrusion_S1)
				facilityType = SDMSResource.getFacilityTypeString(selectFacilityType);
			else
				facilityType = "지능형 영상";

			let buildingGroupData = null;
			let buildingData = null;
			let zoneData = null;
			let chk = false;

			//if (sopData.linkedBuildingID !== -1 && sopData.linkedBuildingID !== 0 &&
			if (sopData.linkedBuildingID !== null &&
				buildingGroupList !== null && buildingGroupList !== undefined) {

				for (let i = 0; i < buildingGroupList.length; i++) {
					const buildingGroup = buildingGroupList[i];

					for (let j = 0; j < buildingGroup.buildingDatas.length; j++) {
						const building = buildingGroup.buildingDatas[j];

						if (building.id === sopData.linkedBuildingID) {
							buildingGroupData = buildingGroup;
							buildingData = building;

							//if (sopData.linkedZoneID !== -1 && sopData.linkedZoneID !== 0) {
							if (sopData.linkedZoneID !== null) {
								for (let z = 0; z < building.zoneDatas.length; z++) {
									const zone = building.zoneDatas[z];

									if (sopData.linkedZoneID === zone.id) {
										zoneData = zone;
										break;
									}
								}
							}

							chk = true;
							break;
						}
					}

					if (chk === true)
						break;
				}
			}

			if (buildingData !== null) {
				buildingGroup = buildingGroupData.displayText;
				building = buildingData.buildingName;
			}

			if (zoneData !== null) {
				building = zoneData.displayText;
			}

			for (let j = 0; j < disasterCategories.length; j++) {
				const data = disasterCategories[j].disasterCategory;
				const subDisasterCategories = disasterCategories[j].subDisasterCategories;

				if (data.id === sopData.disasterCategoryID) {
					disasterCategory = data.categoryName;

					for (let z = 0; z < subDisasterCategories.length; z++) {
						const sub = subDisasterCategories[z].subDisasterCategory;

						if (sub.id === sopData.subDisasterCategoryID) {
							subDisasterCategory = sub.subCategoryName;
							break;
						}
					}

					break;
				}
			}

			linkedSOPUI.push(
				<>
					{/* <tr key="linkedSOPUI">
					<td>{num}</td>
					<td>{buildingGroup}</td>
					<td>{building}</td>
					<td>{facilityType}</td>
					<td>{disasterCategory}</td>
					<td>{subDisasterCategory}</td>
					<td>{sopData.disasterName}</td>
					<td>
						<a onClick={() => this.onClickModifyLinkedSOP(sopData)}>편집</a>
						<a onClick={() => this.onClickDeleteLinkedSOP(sopData.facilityTypeID, sopData.linkedBuildingID, sopData.linkedZoneID)}>삭제</a></td>
				</tr> */}

					{/* <tr key="linkedSOPUI">
					<td>1</td>
					<td>대기</td>
					<td>LG화치공장1</td>
					<td>대기</td>
					<td>대기오염</td>
					<td>대기1</td>
					<td></td>
				</tr> */}
				</>
			);

			num++;
		}

		return linkedSOPUI;
	}

	onClickModifyLinkedSOP = (sopData) => {
		let buildingGroupData = null;
		let buildingData = null;
		let zoneData = null;
		let disasterCategory = null;
		let subDisasterCategory = null;
		let chk = false;

		const buildingGroupList = this.props.buildingGroupList;
		const selectFacilityType = sopData.facilityTypeID;
		const disasterCategories = this.props.disasterCategories;

		//if (sopData.linkedBuildingID !== -1 && sopData.linkedBuildingID !== 0 &&
		if (sopData.linkedBuildingID !== null &&
			buildingGroupList !== null && buildingGroupList !== undefined) {

			for (let i = 0; i < buildingGroupList.length; i++) {
				const buildingGroup = buildingGroupList[i];

				for (let j = 0; j < buildingGroup.buildingDatas.length; j++) {
					const building = buildingGroup.buildingDatas[j];

					if (building.id === sopData.linkedBuildingID) {
						buildingGroupData = buildingGroup;
						buildingData = building;

						//if (sopData.linkedZoneID !== -1 && sopData.linkedZoneID !== 0) {
						if (sopData.linkedZoneID !== null) {
							for (let z = 0; z < building.zoneDatas.length; z++) {
								const zone = building.zoneDatas[z];

								if (sopData.linkedZoneID === zone.id) {
									zoneData = zone;
									break;
								}
							}
						}

						chk = true;
						break;
					}
				}

				if (chk === true)
					break;
			}
		}

		for (let j = 0; j < disasterCategories.length; j++) {
			const data = disasterCategories[j].disasterCategory;
			const subDisasterCategories = disasterCategories[j].subDisasterCategories;

			if (data.id === sopData.disasterCategoryID) {
				disasterCategory = disasterCategories[j];

				for (let z = 0; z < subDisasterCategories.length; z++) {
					const sub = subDisasterCategories[z].subDisasterCategory;

					if (sub.id === sopData.subDisasterCategoryID) {
						subDisasterCategory = subDisasterCategories[z];
						break;
					}
				}

				break;
			}
		}

		this.setState({ selectFacilityType: selectFacilityType, selectBuildingGroup: buildingGroupData, selectBuilding: buildingData, selectZone: zoneData, selectedDisasterCategory: disasterCategory, selectedSubDisasterCategory: subDisasterCategory, selectedDisasterData: sopData });
	}

	onClickDeleteLinkedSOP = (facilityTypeID, linkedBuildingID, linkedZoneID) => {
		let linkedSOPs = this.props.linkedSOPs;

		if (linkedSOPs === null || linkedSOPs === undefined)
			return;

		for (let i = 0; i < linkedSOPs.length; i++) {
			let sopData = linkedSOPs[i];

			// 기존에 설정된 LinkedSOP 찾기
			if (sopData.facilityTypeID !== facilityTypeID) {
				continue;
				//} else if ((linkedBuildingID === 0 || linkedBuildingID === -1) &&
				//(sopData.linkedBuildingID === 0 || sopData.linkedBuildingID === -1)) {
			} else if ((linkedBuildingID === null) &&
				(sopData.linkedBuildingID === null)) {

				linkedSOPs.splice(i, 1);
				break;

				//} else if ((linkedZoneID === 0 || linkedZoneID === -1) &&
				//(sopData.linkedZoneID === 0 || sopData.linkedZoneID === -1) &&
			} else if ((linkedZoneID === null) &&
				(sopData.linkedZoneID === null) &&
				sopData.linkedBuildingID === linkedBuildingID) {

				linkedSOPs.splice(i, 1);
				break;

				//} else if ((linkedZoneID !== -1 && linkedZoneID !== 0) &&
				//	(linkedBuildingID !== 0 && linkedBuildingID !== -1) &&
			} else if ((linkedZoneID !== null) &&
				(linkedBuildingID !== null) &&
				sopData.linkedBuildingID === linkedBuildingID &&
				sopData.linkedZoneID === linkedZoneID) {

				linkedSOPs.splice(i, 1);
				break;

			}
		}

		// 화면 reload
		this.setState({ reload: true });
	}

	onClickSetSOP = () => {
		if (this.state.selectedDisasterData === null)
			return;

		const linkedSOPs = this.props.linkedSOPs;
		const selectBuilding = this.state.selectBuilding;
		// 여수 프로젝트는 BuildingID와 ZoneID가 동일하게 관리된다.
		/*const selectZone = this.state.selectZone;*/
		const selectZone = this.state.selectBuilding.zoneDatas[0];
		const selectedDisasterCategory = this.state.selectedDisasterCategory;
		const selectedSubDisasterCategory = this.state.selectedSubDisasterCategory;
		const selectedDisasterData = this.state.selectedDisasterData;
		const selectFacilityType = this.state.selectFacilityType;
		const siteID = RootResource.SiteID;

		let chk = false;	// 해당 sop 유무 판단

		for (let i = 0; i < linkedSOPs.length; i++) {
			let sopData = linkedSOPs[i];

			// SiteID
			sopData.siteID = siteID;

			// 기존에 설정된 LinkedSOP 찾기
			if (sopData.facilityTypeID !== selectFacilityType) {
				continue;
			} else if (selectBuilding === null &&
				//(sopData.linkedBuildingID === 0 || sopData.linkedBuildingID === -1)) {
				(sopData.linkedBuildingID === null)) {
				chk = true;
				sopData.disasterName = this.state.selectedDisasterData.disasterName;
			} else if (selectZone === null && selectBuilding !== null &&
				sopData.linkedBuildingID === selectBuilding.id &&
				//(sopData.linkedZoneID === 0 || sopData.linkedZoneID === -1)) {
				(sopData.linkedZoneID === null)) {
				chk = true;
				sopData.disasterName = this.state.selectedDisasterData.disasterName;
			} else if (selectBuilding !== null && selectZone !== null &&
				sopData.linkedBuildingID === selectBuilding.id &&
				sopData.linkedZoneID === selectZone.id) {
				chk = true;
				sopData.disasterName = this.state.selectedDisasterData.disasterName;
			}
		}

		if (chk === false) {
			// 해당 linkedSOP를 찾을 수 없기에 새로 데이터 생성
			let sopData = new Object;
			sopData.id = -1;
			sopData.facilityTypeID = selectFacilityType;
			sopData.disasterCategoryID = selectedDisasterCategory.disasterCategory.id;
			sopData.subDisasterCategoryID = selectedSubDisasterCategory.subDisasterCategory.id

			if (selectBuilding === null)
				sopData.linkedBuildingID = null;
			else
				sopData.linkedBuildingID = selectBuilding.id;

			if (selectZone === null)
				sopData.linkedZoneID = null;
			else
				sopData.linkedZoneID = selectZone.id;

			sopData.description = null;
			sopData.disasterName = this.state.selectedDisasterData.disasterName;

			this.props.linkedSOPs.push(sopData);
		}

		// 화면 reload
		this.setState({ reload: true });
	}

	onClickSelectSOP = () => {
		this.setState({ selectSOPOnOff: true });
	}

	/* displaySelectSOP = () => {
		if (this.state.selectSOPOnOff === true)
			return (<> <SelectSOP selectSOPOff={this.selectSOPOff} buildingGroupList={this.props.buildingGroupList} disasterCategories={this.props.disasterCategories} linkedSOPs={this.props.linkedSOPs} /> </>);
	} */

	selectSOPOff = () => {
		this.setState({ selectSOPOnOff: false });
	}

	getSensorUI = () => {
		if (this.state.sensorDatas === null || this.state.sensorDatas === undefined)
			return;

		if (this.state.sensorCategory === null || this.state.sensorCategory === undefined)
			return;

		const sensorDatas = this.state.sensorDatas;

		const curSensorCategory = this.state.sensorCategory;

		let result = [];

		let targetSensorDatas = [];

		for (let i = 0; i < sensorDatas.length; i++) {
			const sensorData = sensorDatas[i];

			if (sensorData.sensorType === curSensorCategory) {
				targetSensorDatas.push(sensorData);
			}
		}

		const buildingDatas = this.props.buildingGroupList[0]; // 여수 빌딩그룹 개수 1개

		for (let i = 0; i < targetSensorDatas.length; i++) {

			const sensor = targetSensorDatas[i];

			let sensorName = null;

			for (let k = 0; k < buildingDatas.buildingDatas.length; k++) {
				const buildingData = buildingDatas.buildingDatas[k];

				if (buildingData.zoneDatas[0].buildingID === sensor.sensorID) {
					sensorName = buildingData.buildingName.toString();

					let onSelectStyle = null;

					if (this.state.selectBuilding !== null && this.state.selectBuilding !== undefined) {
						if (this.state.selectBuilding.id === buildingData.id) {
							onSelectStyle = {
								backgroundImage: 'linear-gradient(#008BE5,#004673)'
							};
						}
					}

					const ui = <li style={onSelectStyle} onClick={() => this.onSelectBuilding(buildingData)}><a>{sensorName}</a></li>
					result.push(ui);

				}
			}

		}
		
		return result;
	}

	onSelectBuilding = (buildingData) => {

		this.setState({ selectBuilding: buildingData }, () => this.onSelectZone(buildingData.zoneDatas[0]));

	}

	onSelectZone = (zoneData) => {

		this.setState({ selectZone: zoneData });
	}

	onSelectSensorCategory = (event, category) => {

		event.preventDefault();

		const selectedCategroy = category;

		this.setState({ sensorCategory: selectedCategroy });
	}

	onApply = (dc, sdc, dName) => {
		if (this.state.selectBuilding === null || this.state.selectBuilding === undefined) {
			this.props.showConfirmDialog("에러", ["센서를 먼저 선택해주세요."], null, null);
			return;
		}

		if (this.state.selectZone === null || this.state.selectZone === undefined) {
			this.props.showConfirmDialog("에러", ["센서를 먼저 선택해주세요."], null, null);
			return;
		}

		let linkedSOPs = [];

		if (this.props.linkedSOPs !== null && this.props.linkedSOPs !== undefined) {
			linkedSOPs = this.props.linkedSOPs;
		}

		const selectBuildingID = (this.state.selectBuilding) ? this.state.selectBuilding.id : null;
		const selectZoneID = (this.state.selectZone) ? this.state.selectZone.id : null;

		if (selectBuildingID === null || selectBuildingID === undefined) {
			this.props.showConfirmDialog("에러", ["센서를 먼저 선택해주세요."], null, null);
			return;
		}


		const linkedCount = linkedSOPs.length;

		for (let i = 0; i < linkedCount; i++) {
			const linkedSOP = linkedSOPs[i];

			if (selectBuildingID === linkedSOP.linkedBuildingID) {
				this.props.showConfirmDialog("에러", ["이미 연동이 완료된 센서입니다. 삭제 후 다시 시도해주세요."], null, null);
				return;
			}

		}

		let sopData = new Object;
		sopData.id = -1;
		sopData.facilityTypeID = SDMSResource.facilityType.ETC;
		sopData.disasterCategoryID = dc.id;
		sopData.subDisasterCategoryID = sdc.id
		sopData.linkedBuildingID = selectBuildingID;
		sopData.linkedZoneID = selectZoneID

		sopData.description = null;
		sopData.disasterName = dName;

		this.props.linkedSOPs.push(sopData);

	}

	displayDisasterCategoryTree = () => {

		let arrayResult = [];

		const disasterCategories = this.props.disasterCategories;

		if (disasterCategories === null || disasterCategories === undefined) {
			return [];
		}

		let selectBuildingGroupID = (this.props.buildingGroupList) ? this.props.buildingGroupList[0].id : null; // 여수 BuildingGroup은 1개 고정
		let selectBuildingID = (this.state.selectBuilding) ? this.state.selectBuilding.id : null;
		let selectedZoneID = (this.state.selectZone) ? this.state.selectZone.id : null;

		return (
			
			this.props.disasterCategories && this.props.disasterCategories.map((dc, index) => (
				<li key={'dc_' + index}>
					<h5 id="spreadBtn01">
						<div>
							<p className={'sFactoryText'}><span className={'arrowIcon'}></span>{dc.disasterCategory.categoryName}</p>
						</div>
					</h5>

					
						<ul id="hiddenContent01" style={{ display: 'none' }}>
						{
							dc.subDisasterCategories && dc.subDisasterCategories.map((sdc, index2) => (
								<li key={'sdc_' + index2}>
									<h5 style={{ height: '28px' }} id="spreadBtn02">
										<div style={{ padding: '0px', border: 'none' }}>
											<p className={'sAreaText'}><span className={'arrowIcon'}></span>{sdc.subDisasterCategory.subCategoryName}</p>
										</div>
									</h5>
									<ul id="hiddenContent02" style={{ display: 'none' }}>
										{
											sdc.disasterDatas && sdc.disasterDatas.map((d, index3) => (
												<li key={'d_' + index3} id={'d_' + dc.disasterCategory.id + '/' + sdc.subDisasterCategory.id + '/' + d.disasterName}>
													<h5 style={{ height: '24px' }}>
														<div style={{ padding: '0px', border: 'none' }}>
															<p className={'sFloorText'}><span className={'arrowIcon'}></span>{d.disasterName}<p onClick={() => this.onApply(dc.disasterCategory, sdc.subDisasterCategory, d.disasterName)} className={'appliBtn'}>적용</p></p>
															{
																this.props.linkedSOPs && this.props.linkedSOPs.map((link, index4) => (

																	(link.disasterCategoryID === dc.disasterCategory.id &&
																		link.subDisasterCategoryID === sdc.subDisasterCategory.id &&
																		link.disasterName === d.disasterName &&
																		link.facilityTypeID === this.state.selectedSensorType &&
																		link.linkedBuildingGroupID === selectBuildingGroupID &&
																		link.linkedBuildingID === selectBuildingID &&
																		link.linkedZoneID === selectedZoneID)
																		? <p className={'appliBtn'}>{this.formText.apply}</p>
																		: <></>
																))

															}
														</div>
													</h5>
												</li>
											))
										}
									</ul>
								</li>
							))
						}
						</ul>
					

				</li>
			))

			
		)


	}

	getActiveStatus = () => {

		let atmosActive = null;
		let waterActive = null;
		let vocActive = null;
		let ouActive = null;

		if (this.state.sensorCategory === null && this.state.sensorCategory === undefined)
			return [atmosActive, waterActive, vocActive, ouActive];

		if (this.state.sensorCategory === SettingsResource.sensorType.Atmosphere) {
			atmosActive = { backgroundImage: 'linear-gradient(#008BE5,#004673)' };
		} else if (this.state.sensorCategory === SettingsResource.sensorType.Water) {
			waterActive = { backgroundImage: 'linear-gradient(#008BE5,#004673)' };
		} else if (this.state.sensorCategory === SettingsResource.sensorType.VOC) {
			vocActive = { backgroundImage: 'linear-gradient(#008BE5,#004673)' };
		} else if (this.state.sensorCategory === SettingsResource.sensorType.OU) {
			ouActive = { backgroundImage: 'linear-gradient(#008BE5,#004673)' };
		}

		return [atmosActive, waterActive, vocActive, ouActive];
	}

	getLinkedSopDataUI = () => {

		if (this.props.buildingGroupList === null || this.props.buildingGroupList === undefined)
			return;

		if (this.props.disasterCategories === null || this.props.disasterCategories === undefined)
			return;

		if (this.state.sensorDatas === null || this.state.sensorDatas === undefined)
			return;

		const disasterCategories = this.props.disasterCategories;
		const linkedSOPs = this.props.linkedSOPs;

		let resultArray = [];

		for (let i = 0; i < linkedSOPs.length; i++) {
			const linkedSOP = linkedSOPs[i];

			const disasterCategoryID = linkedSOP.disasterCategoryID;
			const subDisasterCategoryID = linkedSOP.subDisasterCategoryID;
			const disasterName = linkedSOP.disasterName;
			const linkedZoneID = linkedSOP.linkedZoneID;

			let disasterCategoryName = null;
			let subDisasterCategoryName = null;
			let facilityTypeName = null;

			let zoneName = null;
			let sensorType = null;

			for (let k = 0; k < disasterCategories.length; k++) {
				const disasterCategory = disasterCategories[k].disasterCategory;
				const subDisasterCategories = disasterCategories[k].subDisasterCategories;

				if (disasterCategoryID === disasterCategory.id) {
					disasterCategoryName = disasterCategory.categoryName;

					for (let j = 0; j < subDisasterCategories.length; j++) {

						const subDisasterCategory = subDisasterCategories[j].subDisasterCategory;

						if (subDisasterCategoryID === subDisasterCategory.id) {
							subDisasterCategoryName = subDisasterCategory.subCategoryName;
						}
					}
				}
				
			}

			const sensorDatas = this.state.sensorDatas;

			for (let m = 0; m < sensorDatas.length; m++) {
				const sensorData = sensorDatas[m];

				if (linkedZoneID === sensorData.sensorID) {

					sensorType = sensorData.sensorType;
					zoneName = sensorData.sensorName;
				}
			}

			let strSensorType = '';
			switch (sensorType) {
				case StatusInfo.AtmosphereType:
					strSensorType = '대기';
					break;
				case StatusInfo.WaterType:
					strSensorType = '수질';
					break;
				case StatusInfo.VocType:
					strSensorType = '화학';
					break;
				case StatusInfo.BacterialType:
					strSensorType = '악취';
					break;
				default:
					strSensorType = '알수없음';
					break;
			}

			const content = {
				zoneName: zoneName,
				sensorType: strSensorType,
				categoryName: disasterCategoryName,
				subCategoryName: subDisasterCategoryName,
				disasterName: disasterName
			};

			resultArray.push(content);
		}

		return (
			<tbody>
				{
					resultArray && resultArray.map((val, index) => (
						<tr key={'linkedSOP' + index}>
							<td>{index + 1}</td>
							<td>{val.sensorType}</td>
							<td>{val.zoneName}</td>
							<td>{val.categoryName}</td>
							<td>{val.subCategoryName}</td>
							<td>{val.disasterName}</td>
							<td><span className={'trashIcon'} onClick={() => this.onClickRemoveLinkedSOP(index)}></span></td>
						</tr>
				))
				}
			</tbody>
		)
	}

	onClickRemoveLinkedSOP = (index) => {
		let linkedSOPs = this.props.linkedSOPs;
		linkedSOPs.splice(index, 1);
		this.props.updateLinkedSops(linkedSOPs);
	}

	render() {
		const [buildingGroup, building, zone] = this.displayBuildingGroup();
		const [disasterCategory, subDisasterCategory, disasterData] = this.displayDisasterCategory();
		const facilityType = this.displayFacilityType();
		//const linkedSOPUI = this.displayLinkedSOP();

		const linkedSOPUI = this.getLinkedSopDataUI();
		const disasterCategoryTree = this.displayDisasterCategoryTree();

		const locationUI = this.getSensorUI();

		var coll = document.getElementsByClassName("collapsible");
		var i;

		for (i = 0; i < coll.length; i++) {
			coll[i].addEventListener("click", function () {
				this.classList.toggle("active");
				var content = this.nextElementSibling;
				if (content.style.display === "block") {
					content.style.display = "none";
				} else {
					content.style.display = "block";
				}
			});
		}

		const [atmosActive, waterActive, vocActive, ouActive] = this.getActiveStatus();

		return (
			<React.Fragment>
				<SopSetCont /* className={newStyles.sppCont} */>
					{/* <div className={newStyles.sppTitle}>
						<h3>센서신호별실행SOP 설정</h3>
						<a onClick={this.props.selectSOPOff}>닫기</a>
					</div> */}
					<div className={'sppRow'}>
						<div className={'sppCol'}>
							{/* <div className={newStyles.spcDep3 + " " + settings.scrollbar}>
								<div className={newStyles.spcTd} id="spcTd4" style={{ display: "block" }}>
									<ul className={newStyles.spcChk}> 
										{facilityType}
									</ul> 
								</div>
							</div> */}

							<div className={'sopTypeBox'}>
								<span className={'sopDisableText sopActiveText'}>센서</span>
								<div className={'sopLTree sopScroll'}>
									<ul className={'sensorTypeTab'}>
										<li style={atmosActive} onClick={(e) => this.onSelectSensorCategory(e, SettingsResource.sensorType.Atmosphere)}><a href="#" >대기</a></li>
										<li style={waterActive} onClick={(e) => this.onSelectSensorCategory(e, SettingsResource.sensorType.Water)}><a href="#" >수질</a></li>
										<li style={vocActive} onClick={(e) => this.onSelectSensorCategory(e, SettingsResource.sensorType.VOC)}><a href="#" >VOC</a></li>
										<li style={ouActive} onClick={(e) => this.onSelectSensorCategory(e, SettingsResource.sensorType.OU)}><a href="#" >악취</a></li>
									</ul>
								</div>
							</div>
						</div>
						<div className={'sppCol2'}>
							{/* <div className={newStyles.spcDep1}>
								<h4>위치</h4>
							</div>
							<ul className={newStyles.spcDep2}>
								<li className={newStyles.col1}><h5>공장</h5></li>
								<li className={newStyles.col1}><h5>건물</h5></li>
								<li className={newStyles.col1}><h5>층</h5></li>
							</ul> 
							<div className={newStyles.spcDep3 + " " + settings.scrollbar}>
								<div className={newStyles.spcTr}>
									<div className={newStyles.spcTd} id="spcTd1" style={{ display: "block" }}>
										<ul className={newStyles.spcChk}>
											{buildingGroup}
										</ul>
									</div>
									<div className={newStyles.spcTd} id="spcTd2" style={{ display: "block" }}>
										<ul className={newStyles.spcChk}>
											{building}
										</ul>
									</div>
									<div className={newStyles.spcTd} id="spcTd3" style={{ display: "block" }}>
										<ul className={newStyles.spcChk}>
											{zone}
										</ul>
									</div>
								</div> 
							</div> */}

							<div className={'sopTypeBox'}>
								<span className={'sopDisableText sopActiveText'}>위치</span>
								<div className={'sopLTree sopScroll'}>
									<ul className={'sensorTypeTab'}>
										{locationUI}
									</ul>
								</div>
							</div>
						</div>
						<div className={'sppCol3'}>
							<div className={'spcDep11'}>
								<h4>재난유형 및 SOP 목록</h4>
								{/* <a onClick={() => this.onClickSetSOP()}>적용</a> */}
								<a className={'spcEditIcon'}></a>
							</div>
							{/* <ul className={newStyles.spcDep2}>
								<li className={newStyles.col1}><h5>재난분야</h5></li>
								<li className={newStyles.col1}><h5>재난종류</h5></li>
								<li className={newStyles.col1}><h5>SOP 이름</h5></li>
							</ul>
							<div className={newStyles.spcDep3 + " " + settings.scrollbar}>
								<div className={newStyles.spcTr}>
									<div className={newStyles.spcTd + " " + newStyles.col1} id="spcTd7" style={{ display: "block" }}>
										<ul className={newStyles.spcChk}>
											{disasterCategory}
										</ul>
									</div>
									<div className={newStyles.spcTd + " " + newStyles.col1} id="spcTd8" style={{ display: "block" }}>
										<ul className={newStyles.spcChk}>
											{subDisasterCategory}
										</ul>
									</div>
									<div className={newStyles.spcTd + " " + newStyles.col1} id="spcTd9" style={{ display: "block" }}>
										<ul className={newStyles.spcChk}>
											{disasterData}
										</ul>
									</div>
								</div>
							</div> */}
							{/* <div className={newStyles.spcDep3 + " " + settings.scrollbar}>
							</div> */}
							<div className={'sopLTree sopScroll'}>
								<ul className={'sopTree'}>
							       <li>
										{disasterCategoryTree}
									</li> 
								</ul>
							</div>
						</div>
					</div>
					<div className={'sppBot'}>
						<div className={'stguTh'}>
							<table>
								<colgroup>
									<col style={{ width: "5%" }} />
									<col style={{ width: "20%" }} />
									<col style={{ width: "20%" }} />
									<col style={{ width: "15%" }} />
									<col style={{ width: "15%" }} />
									<col style={{ width: "15%" }} />
									<col style={{ width: "10%" }} />
								</colgroup>
								<thead>
									<tr>
										<th>No</th>
										<th>센서</th>
										<th>위치</th>
										<th>재난유형</th>
										<th>재난종류</th>
										<th>SOP이름</th>
										<th>삭제</th>
									</tr>
								</thead>
							</table>
						</div>
						<div className={'stguTd scrollbar'} style={{ height: "265px" }}>
							<table>
								<colgroup>
									<col style={{ width: "5%" }} />
									<col style={{ width: "20%" }} />
									<col style={{ width: "20%" }} />
									<col style={{ width: "15%" }} />
									<col style={{ width: "15%" }} />
									<col style={{ width: "15%" }} />
									<col style={{ width: "10%" }} />
								</colgroup>

								{linkedSOPUI}

							</table>
						</div>

						{/* <div className={newStyles.selectConBtn}>
							<span>확인</span>
							<span>취소</span>
						</div> */}
					</div>
				</SopSetCont>
			</React.Fragment>
		);
	}
}

export default AdvancedTab;