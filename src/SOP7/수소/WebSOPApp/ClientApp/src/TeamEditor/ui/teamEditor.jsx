import React, { Component } from 'react';
import styles from '../../Common/css/style.module.css';
import teamEditors from '../css/teamEditor.module.css';

import TeamEditorContent from './teamEditorContent';
import TeamMenu from './teamMenu';
import ScheduleMenu from './scheduleMenu';
import SchedulePage from './schedulePage';
import RegularMemberPage from './regular/regularMemberPage';
import TemporaryMemberPage from './temporary/temporaryMemberPage';
import ConfirmDialog from '../../Common/ui/confirmHydrogen';

import $ from 'jquery';

import TeamEditorResource from '../resource/id';
import { TeamEditController } from '../services/teamEditController';

import ProjectResource from '../../Root/resource/id';
import AccountResource from '../../Account/resource/id';

import SettingsStore from '../../Settings/settingsStore';

import { TeamEditorComponent } from '../styled/TeamEditorStyled';
import { i18n, withTranslation, i18nUtil } from '../../language/i18n';

class TeamEditor extends Component {
	constructor(props) {
		super(props);

		this.state = {
			menuType: TeamEditorResource.menu.조직,       // 근무표, 조직 메뉴 구분
			teamType: TeamEditorResource.menu.조직,       // 조직 메뉴내 정규/평일비상/휴일비상 구분
			schedule: TeamEditorResource.menu.고정_근무표, // 근무표내 고정근무표/실시간근무표 구분

			regularTreeData: [],				// 정규조직 팀 데이터
			temporaryTreeData: [],				// 평일 비상조직 팀 데이터
			temporaryEmergencyTreeData: [],		// 주말 비상조직 팀 데이터
			teamTreeData: [],					/* Treeview에 바인딩된 데이터(현재 선택된 팀 데이터) */

			selectedTeam: null,					/* Treeview에서 선택된 팀정보 */
			selectedSiteID: null,				/* 현재 SiteID */

			regularMembers: [],					// 정규조직 멤버 데이터
			temporaryMembers: [],
			memberGridData: [],					/* GridView에 바인딩된 데이터(현재 선택된 팀 멤버 데이터 */
			
			jobLevels: null,					/* 직급 정보들 (JSON {{value: "value값", name: "name값"}...}) */
			jobPositions: null,					/* 직위 정보들 (JSON {{value: "value값", name: "name값"}...}) */

			confirmMessage: {
				visible: false,
				title: "",
				messages: [""],
				buttons: [i18n.t('common.확인')],
				onClose: this.onCloseConfirmDialog,
				onClickButton: null
			}
		}

		this.props = props;
	}

	componentDidMount() {
		const lang = ProjectResource.getLanguage();
		if (lang !== i18n.language) {
			i18n.changeLanguage(lang);
		}

		// LG화학, 솔브레인 CSS 충돌 >> LG화학 폰트 색상 관련 수정
		$('html, body').css({ 'display': 'block', 'height': '100%', 'overflow': 'hidden', 'color': '#000', 'font-size': '14px' });

		// 각 페이지 별로 클래스 초기화
		$('#subPage').removeClass('sop');

		$('#subPage').click(function (e) {
			// 새 인원 css 효과가 있을 경우 제거
			$('#regularMemberTableBody').removeClass('addPointer');
			$('#temporaryMemberTableBody').removeClass('addPointer');
		});

		this.init(); // this.initTeamData();
				
		this.displayJob();
		
		// 처음 로딩시 비상조직, 비상조직멤버가 화면에 표시되어 수정 - K.D.R
		//this.displayRegular();
		//this.displayTemporary();
		//this.displayTemporaryEmergency();
		//this.initTeamData();

		this.unsubscribe_SettingsStore = SettingsStore.subscribe(function () {
            let data = SettingsStore.getState();

            if (data.actionType === 'SELECT_SITEID') {
                this.changeSelectSiteID(data.selectSiteID);
            }
        }.bind(this));
	}

	componentWillUnmount() {
        this.unsubscribe_SettingsStore();
	}

	changeSelectSiteID = (siteID) => {
        const selectSiteID = this.state.selectSiteID;

        if (siteID && siteID !== selectSiteID) {
			this.state.selectedSiteID = siteID;
			this.initTeamData(siteID);
		}

    }

	async init() {
		let userInfo = await ProjectResource.initUserInfo();
		if (userInfo === null || userInfo === undefined)
			return;

		let siteID = null;
		
		if (userInfo.siteID) {
            siteID = userInfo.siteID;
        } else if (ProjectResource.SiteID) {
            siteID = ProjectResource.SiteID;
        }

		this.state.selectedSiteID = siteID;
		this.initTeamData(siteID);
	}

	async displayJob() {
		let arrJobLevels = new Array();
		let jobLevels = await TeamEditController.GetJobLevels(); // 직급 

		// ColComboBox 데이터형 만들기 >> JSON {{value: "value값", name: "name값"}}
		if (jobLevels !== null) {
			for (let i = 0; i < jobLevels.length; i++) {
				const item = { value: jobLevels[i].PropertyID, name: jobLevels[i].PropertyValue }
				arrJobLevels.push(item);
			}
		}

		let arrJobPositions = new Array();
		let jobPositions = await TeamEditController.GetJobPositions(); // 직책

		// ColComboBox 데이터형 만들기 >> JSON {{value: "value값", name: "name값"}}
		if (jobPositions !== null) {
			for (let i = 0; i < jobPositions.length; i++) {
				const item = { value: jobPositions[i].PropertyID, name: jobPositions[i].PropertyValue }
				arrJobPositions.push(item);
			}
		}

		this.setState({ jobLevels: arrJobLevels, jobPositions: arrJobPositions });
	}

	async initTeamData(selectedSiteID) {
		let regularTreeData = [];
		let temporaryTreeData = [];
		let temporaryEmergencyTreeData = [];

		let regularMembers = [];
		let temporaryMembers = [];

		let teamTreeData = [];
		let selectedTeam = null;
		let memberGridData = [];

		let siteID = selectedSiteID;

		const userInfo = ProjectResource?.getUserInfo();
		if (userInfo.siteID === ProjectResource.Site.GG_A) {
			siteID = null;
		}

		let regularDatas = await TeamEditController.DisplayRegular(siteID);
		let temporaryDatas = await TeamEditController.DisplayTemporary(true, siteID);
		let temporaryEmergencyDatas = await TeamEditController.DisplayTemporary(false, siteID);

		if (regularDatas.length > 0) {
			let members = await TeamEditController.DisplayRegularMember(siteID); // 해당 팀원 불러오기
			let displayMembers = this.getViewRegularMember(regularDatas[0], members);

			regularTreeData = regularDatas;
			regularMembers = members;

			teamTreeData = regularDatas;
			selectedTeam = regularDatas[0];
			memberGridData = displayMembers;
		}

		this.setState({ regularTreeData, regularMembers, teamTreeData, selectedTeam, memberGridData });

		if (temporaryDatas.length > 0) {
			const [temporaryMemberData, message] = await TeamEditController.requestTemporaryMembers();

			temporaryTreeData = temporaryDatas;
			temporaryMembers = temporaryMemberData;
		}

		if (temporaryEmergencyDatas.length > 0) {
			temporaryEmergencyTreeData = temporaryEmergencyDatas;
		}

		this.setState({ temporaryTreeData, temporaryMembers, temporaryEmergencyTreeData });
    }

	async displayRegular() {
		let teamDatas = await TeamEditController.DisplayRegular(this.state.selectedSiteID);
		let members = [];
		let displayMembers = [];
		
		if (teamDatas.length > 0) {
			members = await TeamEditController.DisplayRegularMember(this.state.selectedSiteID); // 해당 팀원 불러오기
			displayMembers = this.getViewRegularMember(teamDatas[0], members);

			this.setState({
				regularTreeData: teamDatas, teamTreeData: teamDatas, selectedTeam: teamDatas[0],
				regularMembers: members, memberGridData: displayMembers
			});
		}
		else
			this.setState({ regularTreeData: [], selectedTeam: null, teamTreeData: [], regularMembers: members, memberGridData: displayMembers});
	}

	async displayTemporary() {
		let teamDatas = await TeamEditController.DisplayTemporary(true, this.state.selectedSiteID);
		let temporaryMembers = [];
		let message = null;
		let displayMembers = [];
		
		if (teamDatas.length > 0) {
			[temporaryMembers, message] = await TeamEditController.requestTemporaryMembers();			
			displayMembers = this.getViewTemporaryMember(teamDatas[0], temporaryMembers);
			
			this.setState({
				temporaryTreeData: teamDatas, teamTreeData: teamDatas, selectedTeam: teamDatas[0],
				temporaryMembers: temporaryMembers, memberGridData: displayMembers
			});
		} else {
			this.setState({ temporaryTreeData: [], selectedTeam: null, teamTreeData: [], temporaryMembers: temporaryMembers, memberGridData: displayMembers });
		}
	}

	async displayTemporaryEmergency() {
		let teamDatas = await TeamEditController.DisplayTemporary(false, this.state.selectedSiteID);
		let temporaryMembers = [];
		let message = null;
		let displayMembers = [];
		
		if (teamDatas.length > 0) {
			[temporaryMembers, message] = await TeamEditController.requestTemporaryMembers();
			displayMembers = this.getViewTemporaryMember(teamDatas[0], temporaryMembers);
			
			this.setState({
				temporaryEmergencyTreeData: teamDatas, teamTreeData: teamDatas, selectedTeam: teamDatas[0],
				temporaryMembers: temporaryMembers, memberGridData: displayMembers
			});
		}
		else {
			this.setState({ temporaryEmergencyTreeData: [], selectedTeam: null, teamTreeData: [], temporaryMembers: temporaryMembers, memberGridData: displayMembers });
		}
	}

	getViewTeam = () => {
		let teamData = [];
		if (this.state.teamType === TeamEditorResource.menu.조직) {
			teamData = this.state.regularTreeData;
		}
		else if (this.state.teamType === TeamEditorResource.menu.평일_비상조직) {
			teamData = this.state.temporaryTreeData;
		}
		else if (this.state.teamType === TeamEditorResource.menu.휴일_비상조직) {
			teamData = this.state.temporaryEmergencyTreeData;
		}
		else {
			return;
        }

		if (teamData.length === 0) {
			this.setState({ selectedTeam: null, teamTreeData: [] });
		}
		else {
			let members = [];
			if (this.state.teamType === TeamEditorResource.menu.조직) {
				members = this.getViewRegularMember(teamData[0], this.state.regularMembers);
			}
			else if (this.state.teamType === TeamEditorResource.menu.평일_비상조직 || this.state.teamType === TeamEditorResource.menu.휴일_비상조직) {
				members = this.getViewTemporaryMember(teamData[0], this.state.temporaryMembers);
			}

			this.setState({ selectedTeam: teamData[0], teamTreeData: teamData, memberGridData: members });
        }
	}

	getViewRegularMember = (selectedTeam, members) => {
		let displayMembers = [];

		if (selectedTeam && selectedTeam !== null) {
			for (let i = 0; i < members.length; i++) {
				if (selectedTeam.ID === members[i].RegularID) {
					displayMembers.push(members[i]);
				}
			}
		}

		return displayMembers;
	}
	
	getViewTemporaryMember = (selectedTeam, members) => {
		let displayMembers = [];

		if (selectedTeam && selectedTeam !== null) {
			for (let i = 0; i < members.length; i++) {
				if (selectedTeam.ID === members[i].temporary.id) {
					displayMembers.push(members[i]);
				}
			}
		}

		return displayMembers;
	}

	showConfirmDialog = (title, messages, buttons, onClickButton) => {
		const confirmMessage = { ...this.state.confirmMessage };
		confirmMessage.visible = true;
		confirmMessage.title = title;
		confirmMessage.buttons = buttons;
		confirmMessage.onClickButton = onClickButton;

		if (!messages) {
			confirmMessage.messages = [""];
		}
		else if (Array.isArray(messages)) {
			confirmMessage.messages = messages;
		}
		else {
			confirmMessage.messages = [messages];
		}

		this.setState({ confirmMessage });
	}

	onCloseConfirmDialog = () => {
		const confirmMessage = { ...this.state.confirmMessage };
		confirmMessage.visible = false;

		this.setState({ confirmMessage });
	}

	changeMenuType = (menuType) => {
		if (menuType === this.state.menuType) {
			return;
		}

		if (menuType === TeamEditorResource.menu.조직) {
			this.state.teamType = TeamEditorResource.menu.조직;
		}

		this.setState({ menuType });
	}

	onChangeTeamType = (type) => {
		if (this.state.teamType === type) {
			return;
		}

		this.setState({ teamType: type });
		if (type === TeamEditorResource.menu.조직) {
			// 조직
			this.displayRegular();
		} else if (type === TeamEditorResource.menu.평일_비상조직) {
			// 평일 비상조직
			this.displayTemporary();
		} else if (type === TeamEditorResource.menu.휴일_비상조직) {
			// 휴일 비상 조직
			this.displayTemporaryEmergency();
		}
		return;
	}

	changeScheduleType = (type) => {
		this.setState({ schedule: type });
		return;
	}

	onUpdateTeamTreeData = (teamTreeData) => {
		if (!this.state.selectedTeam || this.state.selectedTeam === null) {
			this.setState({ teamTreeData, selectedTeam: teamTreeData[0] });
		}
		else {
			this.setState({ teamTreeData });
        }
    }

	// 조직,비상조직 TreeView 팀을 선택 했을 때 Member 조회를 한다
	onTeamNodeChanged = (team) => {
		if (team === null) {
			this.setState({ selectedTeam: team});
		}
		else if (this.state.teamType === TeamEditorResource.menu.조직) {
			let members = this.getViewRegularMember(team, this.state.regularMembers);
			this.setState({ selectedTeam: team, memberGridData: members })
			//this.setState({ selectedTeam: team }, () => this.displayRegularMember());
		}
		else if (this.state.teamType === TeamEditorResource.menu.평일_비상조직 || this.state.teamType === TeamEditorResource.menu.휴일_비상조직) {
			let members = this.getViewTemporaryMember(team, this.state.temporaryMembers);
			this.setState({ selectedTeam: team, memberGridData: members })
			//this.setState({ selectedTeam: team }, () => this.displayTemporaryMember());
		} 
	}

	makeRemoveRegularMember(deleteMembers, data) {
		let memberGridData = data;

		for (let i = 0; i < deleteMembers.length; i++) {
			for (let j = 0; j < memberGridData.length; j++) {
				if (memberGridData[j].ID === deleteMembers[i].ID) {
					memberGridData.splice(j, 1);
					break;
				}
			}
		}

		let members = null;

		if (this.state.teamType === TeamEditorResource.menu.조직) {
			members = this.state.regularMembers;

			for (let i = 0; i < deleteMembers.length; i++) {
				for (let j = 0; j < members.length; j++) {
					if (members[j].ID === deleteMembers[i].ID) {
						members.splice(j, 1);
						break;
					}
				}
			}
		} else if (this.state.teamType === TeamEditorResource.menu.평일_비상조직 || this.state.teamType === TeamEditorResource.menu.휴일_비상조직) {
			members = this.state.temporaryMembers;

			for (let i = 0; i < deleteMembers.length; i++) {
				for (let j = 0; j < members.length; j++) {
					if (members[j].id === deleteMembers[i].id) {
						members.splice(j, 1);
						break;
					}
				}
			}
		}

		return [memberGridData, members];
    }

	removeTeam = () => {
		// 경고 메시지 띄우기
		this.showConfirmDialog("확인", ["조직을 삭제하시겠습니까?", "(하위 조직,조직원 및 하위 조직원에 부여된 계정권한도 함께 삭제됩니다.)"], ["확인", "취소"], this.doRemoveTeam);
	}

	doRemoveTeam = async (index) => {
		const confirmMessage = { ...this.state.confirmMessage };
		confirmMessage.visible = false;

		if (index === 0) {
			// yes
			const curTeamTreeData = [...this.state.teamTreeData];

			if (this.state.teamType === TeamEditorResource.menu.조직) {
				const data = await this.makeRemoveRegularTeam(this.state.selectedTeam, curTeamTreeData);
				this.setState({ teamTreeData: curTeamTreeData, regularTreeData: curTeamTreeData, confirmMessage }, () => this.onTeamNodeChanged(curTeamTreeData[0]));
			} else if (this.state.teamType === TeamEditorResource.menu.평일_비상조직) {
				const data = await this.makeRemoveRegularTeam(this.state.selectedTeam, curTeamTreeData);
				this.setState({ teamTreeData: curTeamTreeData, temporaryTreeData: curTeamTreeData, confirmMessage }, () => this.onTeamNodeChanged(curTeamTreeData[0]));
			} else if (this.state.teamType === TeamEditorResource.menu.휴일_비상조직) {
				const data = await this.makeRemoveRegularTeam(this.state.selectedTeam, curTeamTreeData);
				this.setState({ teamTreeData: curTeamTreeData, temporaryEmergencyTreeData: curTeamTreeData, confirmMessage }, () => this.onTeamNodeChanged(curTeamTreeData[0]));
			}

			return;
		}

		this.setState({ confirmMessage });
	}

	// 조직 삭제
    // data : 모든 팀 정보
	async makeRemoveRegularTeam(selectedTeam, data) {
		// 하위 팀
		const deleteTeams = [];
		deleteTeams.push({ ID: selectedTeam.ID, TeamName: selectedTeam.TeamName, ParentTeamID: selectedTeam.ParentTeamID });
		if (selectedTeam.Children) {
			TeamEditController.findChild(selectedTeam.ID, selectedTeam.Children, deleteTeams);
		}

		let members = [];
		let deleteMembers = [];

		// 속한 직원 (팀 타입에 따라 달리 설정 필요.)
		if (this.state.teamType === TeamEditorResource.menu.조직) {
			members = this.state.regularMembers;

			for (var i = 0; i < members.length; i++) {
				for (var j = 0; j < deleteTeams.length; j++) {
					if (deleteTeams[j].ID === members[i].RegularID) {
						deleteMembers.push(members[i]);
						break;
					}
				}
			}
		} else if (this.state.teamType === TeamEditorResource.menu.평일_비상조직 || this.state.teamType === TeamEditorResource.menu.휴일_비상조직) {
			members = this.state.temporaryMembers;

			for (var i = 0; i < members.length; i++) {
				for (var j = 0; j < deleteTeams.length; j++) {
					if (deleteTeams[j].ID === members[i].temporary.id) {
						deleteMembers.push(members[i]);
						break;
					}
				}
			}
		}
		else {
			return;
        }

		let deleteTeamIDs = [];
		for (let i = 0; i < deleteTeams.length; i++) {
			deleteTeamIDs.push(deleteTeams[i].ID);
        }

		if (this.state.teamType === TeamEditorResource.menu.조직) {
			const [success, message] = await TeamEditController.RemoveRegularTeams(deleteTeamIDs);
			if (!success) {
				// 사용자에게 불필요한 메시지 수정 - K.D.R
				this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('teamEditor.formText.조직 삭제 중 오류가 발생했습니다'), i18n.t('teamEditor.formText.새로고침 후에 다시 시도하거나 시스템 관리자에게 문의해주세요')], null, null);
				return;
			}
		}
		else {
			const [success, message] = await TeamEditController.RemoveTemporaryTeams(deleteTeamIDs);
			if (!success) {
				// 사용자에게 불필요한 메시지 수정 - K.D.R
				this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('teamEditor.formText.조직 삭제 중 오류가 발생했습니다'), i18n.t('teamEditor.formText.새로고침 후에 다시 시도하거나 시스템 관리자에게 문의해주세요')], null, null);
				return;
			}
        }

		if (deleteMembers.length > 0) {
			const [memberGridData, members] = this.makeRemoveRegularMember(deleteMembers, this.state.memberGridData);
			this.state.memberGridData = memberGridData;

			if (this.state.teamType === TeamEditorResource.menu.조직) {
				this.state.regularMembers = members;
			} else if (this.state.teamType === TeamEditorResource.menu.평일_비상조직 || this.state.teamType === TeamEditorResource.menu.휴일_비상조직) {
				this.state.temporaryMembers = members;
            }
        }

		let findNode = null;

		if (selectedTeam.ParentTeamID === null) {
			// 루트 노드일 경우
			findNode = TeamEditController.findParent(selectedTeam.ID, data);

			const idx = data.findIndex(function (item) { return item.ID === selectedTeam.ID });
			if (idx > -1) {
				data.splice(idx, 1);
				this.setState({ teamTreeData: data, selectedTeam: null });
			}

		} else {
			// 자식 노드일 경우
			findNode = TeamEditController.findParent(selectedTeam.ParentTeamID, data);

			if (findNode !== null && findNode.Children !== null && findNode.Children) {
				const idx = findNode.Children.findIndex(function (item) { return item.ID === selectedTeam.ID })
				if (idx > -1) {
					findNode.Children.splice(idx, 1);
					this.setState({ teamTreeData: data });
				}
			}
        }
    }

	editTeam = async (team, chgName) => {
		// 변경할 이름 검사
		if (chgName === null || chgName === undefined || chgName.replace(/\s/gi, "") === "") {
			this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('teamEditor.formText.변경할 팀 이름을 다시 확인해주세요')], null, null);
			return;
		} 

		const curTeamTreeData = [...this.state.teamTreeData];

		let siteID = this.state.selectedSiteID;

		if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
			siteID = this.state.selectedTeam.SiteID;
		}
		
		const nodeData = { ID: team.ID, TeamName: chgName, ParentTeamID: team.ParentTeamID, SiteID: siteID};
		if (this.state.teamType === TeamEditorResource.menu.조직) {
			const [success, message] = await TeamEditController.UpdateRegularTeam(nodeData);
			if (!success) {
				// 사용자에게 불필요한 메시지 수정 - K.D.R
				//alert(message);
				this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('teamEditor.formText.조직 정보 수정 중 오류가 발생했습니다'), i18n.t('teamEditor.formText.새로고침 후에 다시 시도하거나 시스템 관리자에게 문의해주세요')], null, null);
				return;
            }

			const data = await this.makeChangeRegularTeamInfo(this.state.selectedTeam, chgName, curTeamTreeData);
			this.setState({ teamTreeData: data, regularTreeData: data });
		} else if (this.state.teamType === TeamEditorResource.menu.평일_비상조직 || this.state.teamType === TeamEditorResource.menu.휴일_비상조직) {
			if (this.state.teamType === TeamEditorResource.menu.평일_비상조직) {
				nodeData.IsNormal = true;
			}
			else {
				nodeData.IsNormal = false;
			}
			//nodeData.SiteID = ProjectResource.SiteID;

			const [success, message] = await TeamEditController.UpdateTemporaryTeam(nodeData);
			if (!success) {
				// 사용자에게 불필요한 메시지 수정 - K.D.R
				//alert(message);
				this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('teamEditor.formText.조직 정보 수정 중 오류가 발생했습니다'), i18n.t('teamEditor.formText.새로고침 후에 다시 시도하거나 시스템 관리자에게 문의해주세요')], null, null);
				return;
			}

			const data = await this.makeChangeRegularTeamInfo(this.state.selectedTeam, chgName, curTeamTreeData);
			if (this.state.teamType === TeamEditorResource.menu.평일_비상조직) {
				this.setState({ teamTreeData: data, temporaryTreeData: data });
			}
			else {
				this.setState({ teamTreeData: data, temporaryEmergencyTreeData: data });
            }
		} 
	}

	async makeChangeRegularTeamInfo(selectedTeam, newData, data) {
		//const findNode = await TeamEditController.findNode(data[0], selectedTeam.ID);
		const findNode = await TeamEditController.findNode(data, selectedTeam.ID);
		findNode.TeamName = newData;

		return data;
    }

	checkEmail = (id, email, target) => {
		let members = [];
		let chk = false;

		if (id === null || id === undefined ||
			email === null || email === undefined)
			return chk;

		members = this.state.regularMembers;

		for (let i = 0; i < members.length; i++) {
			let member = members[i];

			if (member.ID !== id && member.Email === email) {
				chk = true;
				break;
			}
		}

		if (chk === true) {
			this.showConfirmDialog(i18n.t('common.오류'), [email + " " + i18n.t('teamEditor.formText.이메일 주소가 이미 사용 중입니다')], null, null);
			target.value = "";
        }

		return chk;
    }

	checkMemberID = (id, memberID, target) => {
		if (id === null || id === undefined ||
			memberID === null || memberID === undefined)
			return;

		let members = [];
		let chk = false;

		// 속한 직원 (팀 타입에 따라 달리 설정 필요.)
		//if (this.state.teamType === TeamEditorResource.menu.조직)
		//	members = this.state.regularMembers;
		//else
		//	members = this.state.regularMembers;
		members = this.state.regularMembers;

		for (let i = 0; i < members.length; i++) {
			let member = members[i];

			if (member.ID !== id && member.MemberID === memberID) {
				chk = true;
				break;
            }
        }

		if (chk === true) {
			// 사번이 중복됨.
			this.showConfirmDialog(i18n.t('common.오류'), [memberID + " " + i18n.t('teamEditor.formText.사번이 이미 사용 중입니다')], null, null);
			target.value = "";
		}

		return chk;
	}

	checkPhoneNumber = (id, phoneNumber, target) => {
		let members = [];
		let chk = false;

		if (id === null || id === undefined ||
			phoneNumber === null || phoneNumber === undefined)
			return chk;

		// 속한 직원 (팀 타입에 따라 달리 설정 필요.)
		if (this.state.teamType === TeamEditorResource.menu.조직)
			members = this.state.regularMembers;
		else
			members = this.state.regularMembers;

		for (let i = 0; i < members.length; i++) {
			let member = members[i];

			if (member.ID !== id && member.PhoneNumber === phoneNumber) {
				chk = true;
				break;
			}
		}

		if (chk === true) {
			// 휴대전화번호이 중복됨.
			this.showConfirmDialog(i18n.t('common.오류'), [phoneNumber + " " + i18n.t('teamEditor.formText.휴대전화번호가 이미 사용 중입니다')], null, null);
			target.value = "";
		}

		return chk;
	}

	onChangeMemberEditMode = (member, editType, isEditMode) => {
		let members = [...this.state.memberGridData];

		let userInfo = ProjectResource.getUserInfo();
		if (userInfo && 
			((userInfo.levelID !== AccountResource.accountLevelID.master && userInfo.levelID !== AccountResource.accountLevelID.admin) ||
			userInfo.options?.teamEditor?.useRegularEditor === false)) {
			isEditMode = false;
		}

		const memberCount = members.length;
		for (let i = 0; i < memberCount; i++) {
			if ((this.state.teamType === TeamEditorResource.menu.조직 && member.ID === members[i].ID) ||
				(this.state.teamType === TeamEditorResource.menu.평일_비상조직 && member.id === members[i].id) ||
				(this.state.teamType === TeamEditorResource.menu.휴일_비상조직 && member.id === members[i].id)) {
				members[i].isEditMode = isEditMode;

				if (!isEditMode)
					members[i].editType = '';
				else
					members[i].editType = editType;
			}
			else if (isEditMode) {
				members[i].isEditMode = false;
				members[i].editType = '';
			}
		}

		this.setState({ memberGridData: members });
	}

	onChangeMember = async (member, isUpdate) => {
		let members = [];
		if (this.state.teamType === TeamEditorResource.menu.조직) {
			members = [...this.state.memberGridData];
			const memberCount = this.state.memberGridData.length;
			for (let i = 0; i < memberCount; i++) {
				if (member.ID === members[i].ID) {
					members[i].isEditMode = false;
					members[i].editType = '';
					break;
				}
			}

			if (isUpdate) {
				const [success, newID, message] = await TeamEditController.UpdateRegularMember(member);
				if (!success && message.length > 0) {
					// 일반 사용자에게 불필요한 메시지 수정 - K.D.R
					//alert(message);
					this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('teamEditor.formText.조직원 정보 수정 중 오류가 발생했습니다'), i18n.t('teamEditor.formText.새로고침 후에 다시 시도하거나 시스템 관리자에게 문의해주세요')], null, null);
					return;
				}

				if (member.ID < 0) {
					for (let i = 0; i < memberCount; i++) {
						if (member.ID === members[i].ID) {
							member.ID = newID;
							break;
						}
					}
				}
			}
		}
		else if (this.state.teamType === TeamEditorResource.menu.평일_비상조직 || this.state.teamType === TeamEditorResource.menu.휴일_비상조직) {
			members = [...this.state.memberGridData];
			const memberCount = this.state.memberGridData.length;
			for (let i = 0; i < memberCount; i++) {
				if (member.id === members[i].id) {
					members[i].isEditMode = false;
					members[i].editType = '';
					break;
				}
			}

			if (isUpdate) {
				const [success, newID, message] = await TeamEditController.UpdateTemporaryMember(member);
				if (!success && message.length > 0) {
					// 일반 사용자에게 불필요한 메시지 수정 - K.D.R
					//alert(message);
					this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('teamEditor.formText.조직원 정보 수정 중 오류가 발생했습니다'), i18n.t('teamEditor.formText.새로고침 후에 다시 시도하거나 시스템 관리자에게 문의해주세요')], null, null);
					return;
				}

				if (member.id < 0) {
					for (let i = 0; i < memberCount; i++) {
						if (member.id === members[i].id) {
							member.id = newID;
							break;
						}
					}
				}
			}
        }

		this.setState({ memberGridData: members });
	}

	render() {
		let isEditMode = false;
		//if (ProjectResource.SiteID !== ProjectResource.Site.Hydrogen) {
			const userInfo = ProjectResource.getUserInfo();
            if (userInfo && (userInfo.levelID === AccountResource.accountLevelID.master || userInfo.levelID === AccountResource.accountLevelID.admin)) {
                isEditMode = true;

                // 정규조직 수정 여부 확인
				if (this.state.teamType === TeamEditorResource.menu.조직 &&
                    userInfo.options?.teamEditor?.useRegularEditor === false)
                    isEditMode = false;
            }
        //}
		return (
			<TeamEditorComponent>
				
				<div id="subPage">
					<div id={'subAside'} className="pageMenu">
						{/* 조직, 근무표 메뉴 버튼 컴포넌트 */}
						{						
							<TeamEditorContent
								changeMenuType={this.changeMenuType}
								//save={this.save}
								//onAuthorError={this.onAuthorError}
							/>
								
						}
						{/* 조직, 근무표 선택 시 해당 메뉴 컴포넌트 */}
						<DisplayMenu
							teamType={this.state.teamType}
							onChangeTeamType={this.onChangeTeamType}
							scheduleType={this.changeScheduleType}
							onTeamNodeChanged={this.onTeamNodeChanged}
							isEditMode={isEditMode}
							teamTreeData={this.state.teamTreeData}
							selectedTeam={this.state.selectedTeam}
							removeTeam={this.removeTeam}
							editTeam={this.editTeam}
							onUpdateTeamTreeData={this.onUpdateTeamTreeData}
							selectedSiteID={this.state.selectedSiteID}
						/>
					</div>

					{/* 멤버 테이블 또는 근무표 테이블 */}
					<DisplayContent
						teamType={this.state.teamType}
						scheduleType={this.state.schedule}
						selectedTeam={this.state.selectedTeam}
						isEditMode={isEditMode}
						regularTreeData={this.state.regularTreeData}
						regularMembers={this.state.regularMembers}
						temporaryMembers={this.state.temporaryMembers}
						memberGridData={this.state.memberGridData}
						jobLevels={this.state.jobLevels}
						jobPositions={this.state.jobPositions}
						checkMemberID={this.checkMemberID}
						checkPhoneNumber={this.checkPhoneNumber}
						checkEmail={this.checkEmail}
						onChangeMemberEditMode={this.onChangeMemberEditMode}
						onChangeMember={this.onChangeMember}
					/>
					{
						/* alert창 대신 사용 */
						this.state.confirmMessage.visible &&
						<ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
					}
				</div>
			</TeamEditorComponent>
		);
	}
}

class DisplayMenu extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedSiteID: this.props.selectedSiteID
		}

		this.props = props;

	}
	componentDidUpdate(prevProps, prevState) {
		if (this.state.selectedSiteID !== this.props.selectedSiteID) {
			this.setState({ selectedSiteID: this.props.selectedSiteID });
		}
	}

	onChangeTeamType = (type) => {
		this.props.onChangeTeamType(type);

		return;
	}

	relayScheduleType = (type) => {
		this.props.scheduleType(type);

		return;
	}
	
	render() {
		if (this.props.teamType === TeamEditorResource.menu.조직 ||
			this.props.teamType === TeamEditorResource.menu.평일_비상조직 ||
			this.props.teamType === TeamEditorResource.menu.휴일_비상조직) {
			return <TeamMenu
				teamTreeData={this.props.teamTreeData}
				selectedTeam={this.props.selectedTeam}
				onChangeTeamType={this.onChangeTeamType}
				teamType={this.props.teamType}
				onTeamNodeChanged={this.props.onTeamNodeChanged}
				isEditMode={this.props.isEditMode}
				removeTeam={this.props.removeTeam}
				editTeam={this.props.editTeam}
				onUpdateTeamTreeData={this.props.onUpdateTeamTreeData}
				selectedSiteID={this.state.selectedSiteID}
			/>;
		}
		else if (this.props.teamType === TeamEditorResource.menu.근무표) {
			return <ScheduleMenu onChange={this.relayScheduleType} />;
		}
		else {
			return null;
		}
	}
}

class DisplayContent extends Component {
	constructor(props) {
		super(props);

		this.props = props;
	}

	render() {
		if (this.props.teamType === TeamEditorResource.menu.조직) {
			return (
				<RegularMemberPage
					isEditMode={this.props.isEditMode}
					selectedTeam={this.props.selectedTeam}
					regularMembers={this.props.regularMembers}
					memberGridData={this.props.memberGridData}
					jobLevels={this.props.jobLevels}
					jobPositions={this.props.jobPositions}
					checkMemberID={this.props.checkMemberID}
					checkPhoneNumber={this.props.checkPhoneNumber}
					checkEmail={this.props.checkEmail}
					onChangeMemberEditMode={this.props.onChangeMemberEditMode}
					onChangeMember={this.props.onChangeMember}
				/>
			);
		} else if (this.props.teamType === TeamEditorResource.menu.평일_비상조직 || this.props.teamType === TeamEditorResource.menu.휴일_비상조직) {
			return (
				<TemporaryMemberPage
					isEditMode={this.props.isEditMode}
					selectedTeam={this.props.selectedTeam}
					temporaryMembers={this.props.temporaryMembers}
					memberGridData={this.props.memberGridData}
					teamType={this.props.teamType}
					jobLevels={this.props.jobLevels}
					jobPositions={this.props.jobPositions}
					regularTreeData={this.props.regularTreeData}
					regularMembers={this.props.regularMembers}
					onChangeMemberEditMode={this.props.onChangeMemberEditMode}
					onChangeMember={this.props.onChangeMember}
				/>
			);
		} else if (this.props.teamType === TeamEditorResource.menu.근무표) {
			return <SchedulePage scheduleType={this.props.scheduleType} isEditMode={this.props.isEditMode} />;
		} else {
			return null;
		} 
	}
}

export default withTranslation()(TeamEditor);