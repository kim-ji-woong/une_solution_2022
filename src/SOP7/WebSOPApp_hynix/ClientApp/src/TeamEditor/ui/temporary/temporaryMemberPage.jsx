import React, { Component } from 'react';
import { BrowserRouter as Route, Link } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars-2';

import styles from '../../../Common/css/style.module.css';
import uneStyles from '../../../Common/css/uneCommon.module.css';
import teamEditors from '../../css/teamEditor.module.css';

import PageFooter from '../../../Root/pageFooter';
import { TeamEditController } from '../../services/teamEditController';
import ColTemporaryMemberNew from './colTemporaryMemberNew';
import PopupSelectManager from './popupSelectManager';
import ConfirmDialog from '../../../Common/ui/confirmDialog';

import $ from 'jquery';

import TeamEditorResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';
import AccountResource from '../../../Account/resource/id';

import { TemporaryMemberPageConponent } from '../../styled/TeamEditorStyled';

import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';

class TemporaryMemberPage extends Component {
	static cssStyles = styles;

	constructor(props) {
		super(props);
		this.state = {
			selectedTeam: null,			// 선택된 팀
			//teamType: null,				// 평일 혹은 휴일 비상조직 체크
			members: null,				// 선택된 팀원 정보들
			displayMembers: [],		// 화면에 출력할 팀원 정보들 (검색에 활용)
			roles: null,				// 정/부 정보들 (JSON {{value: "value값", name: "name값"}...})
			openPopup: false,			// 팝업창(조직 담당자 설정) 오픈 여부
			popupMember: null,			// 팝업창(조직 담당자 설정) 파라미터 >> 설정된 담당자
			addIndex: -1, /* 새로 추가될 멤버의 ID (addIndex--; 되서 겹치지 않게 한다) */

			confirmMessage: {
				visible: false,
				title: "",
				messages: [""],
				buttons: [i18n.t('common.확인')],
				onClose: this.onCloseConfirmDialog,
				onClickButton: null
			},

			memberGridData: [],
			search: "",
		};

		this.props = props;
		//this.displayMembers = this.props.memberGridData;

		// 정/부 ColComboBox 데이터형 만들기
		this.initRoles();
	}

	initRoles() {
		const arrRoles = new Array();

		// 정/부 ColComboBox 데이터형 만들기 >> JSON {{value: "value값", name: "name값"}...}
		let item = new Object();
		item.value = "";
		item.name = i18n.t('teamEditor.formText.알 수 없음');
		arrRoles.push(item);

		item = new Object();
		item.value = 0;
		item.name = i18n.t('teamEditor.formText.정');
		arrRoles.push(item);

		item = new Object();
		item.value = 1;
		item.name = i18n.t('teamEditor.formText.부');
		arrRoles.push(item);

		item = new Object();
		item.value = 2;
		item.name = i18n.t('common.일반');
		arrRoles.push(item);

		this.state.roles = arrRoles;
	}

	componentDidMount() {
		$('table').css({ 'width': '100%', 'border-spacing': '0', 'border-collapse': 'collapse', 'table-layout': 'fixed' });
	}

	componentDidUpdate(prevProps, prevState) {
		//if (this.state.memberGridData !== this.props.memberGridData) {
			//this.setState({ displayMembers: this.props.memberGridData });
			//this.setState({ memberGridData: this.props.memberGridData });
		//}
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

	async getTemporaryMember(team, isNormal) {
		let members = new Array();

		if (team != null) 
			members = await TeamEditController.displayTemporaryMember(team.ID, isNormal);	// 해당 팀원 불러오기

		if (members !== null) {
			this.setState({ members: members, displayMembers: members });
	  }
	}

	onClickAddMember = () => {
		if (this.props.selectedTeam === null || this.props.selectedTeam === undefined) {
			this.showConfirmDialog(i18n.t('common.확인'), [i18n.t('teamEditor.formText.선택된 조직이 없습니다'), i18n.t('teamEditor.formText.조직을 먼저 선택하세요')], null, null);
			return;
        }

		const index = this.state.addIndex;
		this.onAddMember(index);
		this.setState({ addIndex: index - 1 });
	}

	onAddMember(addIndex) {
		const index = addIndex;

		const isNormal = (this.props.teamType == TeamEditorResource.menu.평일_비상조직 ? 1 : 0);
		const selectedTeam = this.props.selectedTeam;
		const temporary = this.makeTemporaryData(selectedTeam, isNormal);

		const member = new Object();
		member.id = index;
		member.isNormal = isNormal;
		member.displaySOPName = i18n.t('teamEditor.formText.새 인원');
		member.regular = null;
		member.regularMember = null;
		member.role = null;
		member.temporary = temporary;

		let members = this.props.memberGridData;
		let temporaryMembers = this.props.temporaryMembers;

		members.push(member);
		temporaryMembers.push(member);

		// 새 인원 css 효과
		$('#temporaryMemberTableBody').addClass('addPointer');
	
	}

	makeTemporaryData(selectedTeam, isNormal) {
		let temporary = new Object();
		temporary.id = selectedTeam.ID;
		temporary.teamName = selectedTeam.TeamName
		temporary.isNormal = isNormal === 1 ? true : false;
		temporary.parentTeamID = selectedTeam.ParentTeamID;

		return temporary;
    }

	onClickMoveMember = (value) => {
		this.props.handleMoveMembersPopup(value);
	}

	onClickRemoveMember = () => {
		let curMembers = this.state.displayMembers;

		// 삭제할 인원 분류
		const deleteMembers = [];
		for (let i = 0; i < curMembers.length; i++) {
			if (curMembers[i].check) {
				//await this.props.onDeleteMember(curMembers[i]);
				deleteMembers.push(curMembers[i]);
			}
		}

		// 삭제할 인원 데이터 삭제
		this.onDeleteMember(deleteMembers);
	}

	onDeleteMember = async (deleteMembers) => {
		const [success, message] = await TeamEditController.RemoveTemporaryMembers(deleteMembers);
		if (!success && message.length > 0) {
			alert(message);
			return;
		}

		let curMembers = this.state.displayMembers;
		let members = this.props.memberGridData;
		let temporaryMembers = this.props.temporaryMembers;

		for (let i = 0; i < deleteMembers.length; i++) {
			for (let j = 0; j < members.length; j++) {
				if (members[j].id === deleteMembers[i].id) {
					members.splice(j, 1);
					break;
				}
			}

			for (let j = 0; j < temporaryMembers.length; j++) {
				if (temporaryMembers[j].id === deleteMembers[i].id) {
					temporaryMembers.splice(j, 1);
					break;
				}
			}

			for (let j = 0; j < curMembers.length; j++) {
				if (curMembers[j].id === deleteMembers[i].id) {
					curMembers.splice(j, 1);
					break;
				}
			}
		}

		this.setState({ displayMembers: curMembers });

		//this.setState({ memberGridData: members, displayMemberGridData: members, regularMembers: regularMembers });
		//this.setState({ memberGridData: members, regularMembers: regularMembers });
	}

	onChangeMember = (index, member) => {
		let members = this.state.memberGridData;
		members[index] = member;

		this.setState({ memberGridData: members, displayMembers: members });
		return;
	}

	onClickSearch = () => {
		const search = document.getElementById('search').value;

		this.setState({ search });
		return;
	}

	searchMember = () => {
		const members = this.props.memberGridData;
		const search = this.state.search;
		let searchMembers = new Array();

		if (members == null) {
			this.state.displayMembers = searchMembers;
			return searchMembers;
		}

		for (let i = 0; i < members.length; i++) {
			const member = members[i];

			if (search !== null && search !== undefined && search !== "") {

				// SOP 표시 이름에서 검색
				if (member.displaySOPName != null) {
					let displaySOPName = null;
					displaySOPName = member.displaySOPName;

					if (displaySOPName.indexOf(search) !== -1) {
						searchMembers.push(members[i]);
						continue;
					}
				}

				// 부서명에서 검색
				if (member.regular != null) {
					let regularName = null;
					regularName = member.regular.teamName;

					if (regularName.indexOf(search) !== -1) {
						searchMembers.push(members[i]);
						continue;
					}
				}

				// 멤버 이름에서 검색
				if (member.regularMember != null) {
					let regularMemberName = null;
					regularMemberName = member.regularMember.memberName;

					if (regularMemberName.indexOf(search) !== -1) {
						searchMembers.push(members[i]);
						continue;
					}
					else if (member.regularMember.jobPositionID != null || this.props.jobPositions[member.regularMember.jobPositionID] != null) {
						// 멤버 직위에서 검색
						let jobPosition = this.props.jobPositions[member.regularMember.jobPositionID].name;

						if (jobPosition.indexOf(search) != -1) {
							searchMembers.push(members[i]);
							continue;
						}
					}
				}

				// 정/부에서 검색
				if (member.role != null) {
					let roles = this.state.roles;

					for (let j = 0; j < roles.length; j++) {
						let role = roles[j];

						if (role.value === member.role) {
							if (role.name.indexOf(search) != -1) {
								searchMembers.push(members[i]);
							}

							break;
						}
					}
				}
			}
			else {
				searchMembers.push(members[i]);
			}
		}

		//this.setState({ displayMembers: searchMembers });
		this.state.displayMembers = searchMembers;
		return searchMembers;
	}

	openPopup = (member) => {
		this.setState({ openPopup: true, popupMember: member });

		return;
	}

	closePopup = () => {
		this.setState({ openPopup: false });

		return;
	}

	onChangeSelect = (member) => {
		let members = this.state.memberGridData;

		for (let i = 0; i < members.length; i++) {
			let oldMember = members[i];
			
			if (oldMember.TemporaryMemberID === member.TemporaryMemberID) {
				members[i] = member;
            }
		}

		this.props.onChangeMember(member, true);

		this.setState({ /*members: members, */openPopup: false });
	}

	openPopupSelectManager = () => {
		let popupSelectManagerUI = null;

		if (this.props.isEditMode && this.state.openPopup === true) {
			popupSelectManagerUI = <>
				<PopupSelectManager
					popupMember={this.state.popupMember}
					close={this.closePopup}
					select={this.onChangeSelect}
					jobLevels={this.props.jobLevels}
					jobPositions={this.props.jobPositions}
					regularTreeData={this.props.regularTreeData}
					regularMembers={this.props.regularMembers}
					onChangeMember={this.props.onChangeMember}
				/>
			</>;
		}

		return popupSelectManagerUI;
	}

	onKeyPressSearch = (e) => {
		if (e.key === 'Enter') {
			this.onClickSearch();
		}

		return;
	}

	render() {
		let teamName = "";
		if (this.props.selectedTeam !== null && this.props.selectedTeam !== undefined &&
			this.props.selectedTeam.TeamName !== null && this.props.selectedTeam.TeamName !== undefined)
			teamName = this.props.selectedTeam.TeamName;

		// 왼쪽 메뉴 높이 가져와 스크롤 높이 넣기
		const target = $('.pageMenu');
		let menuHeight = 0;

		if (target[0] != null) {
			menuHeight = target[0].clientHeight;
        }

		const rowContent = [];

		const displayMembers = this.searchMember();

		if (displayMembers !== null && displayMembers !== undefined) {
			displayMembers.map((member, index) =>
				(
					rowContent.push(
						<tr key={Math.random()}>
							<ColTemporaryMemberNew
								member={member}
								jobPositions={this.props.jobPositions}
								roles={this.state.roles}
								index={index}
								openPopup={this.openPopup}
								onChangeMemberEditMode={this.props.onChangeMemberEditMode}
								onChangeMember={this.props.onChangeMember}
								isEditMode={this.props.isEditMode}
							/>
						</tr>
					)
				))
		} 

		let editArea = null;
		if (this.props.isEditMode) {
			editArea =
				<>
					{
						ProjectResource.SiteID === ProjectResource.Site.GG_A ? 
						<>
							<a onClick={this.onClickAddMember} className={'sctAdd'}>{i18n.t('common.추가')}</a>
							<a onClick={this.onClickRemoveMember} className={'sctAdd'}>{i18n.t('common.삭제')}</a>
							<a onClick={() => this.onClickMoveMember(true)} className={'sctDel'}>{i18n.t('teamEditor.formText.조직이동')}</a>
						</> :
						<>
							<a onClick={this.onClickAddMember} className={'sctAdd'}>{i18n.t('common.추가')}</a>
							<a onClick={this.onClickRemoveMember} className={'sctDel'}>{i18n.t('common.삭제')}</a>
							{
								/*
								<a href="#" className={styles.sctDwn}>엑셀 다운로드</a>
								<a href="#" className={styles.sctUld}>엑셀 업로드</a>
								*/
							}
						</>
					}
				</>
		}
		else {
			editArea = null;
		}

		let popupSelectManagerUI = this.openPopupSelectManager();

		// 권한에 따라 삭제 컬럼 표시
		const userAuthor = ProjectResource.getUserAuthor();
		let theadUI;
		let colgroupUI;

		const isEditMode = this.props.isEditMode;

		if (isEditMode === true &&
			(userAuthor === AccountResource.accountLevelID.master || userAuthor === AccountResource.accountLevelID.admin)) {
			colgroupUI = <colgroup>
				<col style={{ width: '5%' }} />
				<col style={{ width: '5%' }} />
				<col style={{ width: '10%' }} />
				<col style={{ width: '25%' }} />
				<col style={{ width: '25%' }} />
				<col style={{ width: '10%' }} />
				<col style={{ width: '20%' }} />
			</colgroup>;

			theadUI = <tr>
				<th>{i18n.t('common.삭제')}</th>
				<th>{i18n.t('teamEditor.formText.번호')}</th>
				<th>{i18n.t('teamEditor.formText.정/부')}</th>
				<th>{i18n.t('teamEditor.formText.SOP이름')}</th>
				<th>{i18n.t('teamEditor.formText.부서명')}</th>
				<th>{i18n.t('teamEditor.formText.직위')}</th>
				<th>{i18n.t('teamEditor.formText.성명')}</th>
			</tr>;
		}
		else {
			colgroupUI = <colgroup>
				<col style={{ width: '5%' }} />
				<col style={{ width: '10%' }} />
				<col style={{ width: '25%' }} />
				<col style={{ width: '25%' }} />
				<col style={{ width: '10%' }} />
				<col style={{ width: '25%' }} />
			</colgroup>;

			theadUI = <tr>
				<th>{i18n.t('teamEditor.formText.번호')}</th>
				<th>{i18n.t('teamEditor.formText.정/부')}</th>
				<th>{i18n.t('teamEditor.formText.SOP이름')}</th>
				<th>{i18n.t('teamEditor.formText.부서명')}</th>
				<th>{i18n.t('teamEditor.formText.직위')}</th>
				<th>{i18n.t('teamEditor.formText.성명')}</th>
			</tr>;
		}

		return (
			<>
				<TemporaryMemberPageConponent id={'subCont'} className={uneStyles.subContt}>
					{/*<Scrollbars style={{ height: menuHeight }}>*/}
					<div className={'scrollbar'} style={{ height: menuHeight }} >
						<div className={'scWrap' + " " + uneStyles.scWrapp}>
							<div className={'scCont'}>
								<div className={'scTop' + " " + uneStyles.scTopp}>
									<h4>{teamName}</h4>
									<div className={'sctRht' + " " + 'sctRht'}>
										<div className={'sctSch' + " " + 'sctSch'}>
											<input id="search" type="text" onKeyPress={(e) => this.onKeyPressSearch(e)} placeholder={i18n.t('teamEditor.formText.검색어 입력')} title={i18n.t('teamEditor.formText.검색어 입력')} />
											<a onClick={this.onClickSearch} >{i18n.t('teamEditor.formText.검색')}</a>
										</div>
										{editArea}
									</div>
								</div>
								<table className={'scTb'}>
									{colgroupUI}
									<thead>
										{theadUI}
									</thead>
									<tbody id="temporaryMemberTableBody">

										{rowContent}

									</tbody>
								</table>
							</div>

							<PageFooter />

						</div>
					</div>
				</TemporaryMemberPageConponent>

				{popupSelectManagerUI}

				{
					/* alert창 대신 사용 */
					this.state.confirmMessage.visible &&
					<ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
				}

			</>
		);
    }
}

export default withTranslation()(TemporaryMemberPage);