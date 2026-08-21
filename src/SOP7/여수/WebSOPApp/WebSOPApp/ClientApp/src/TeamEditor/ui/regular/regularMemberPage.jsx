import React, { Component } from 'react';
import { BrowserRouter as Route, Link } from 'react-router-dom';

import styles from '../../../Common/css/style.module.css';
import uneStyles from '../../../Common/css/uneCommon.module.css';
import teamEditors from '../../css/teamEditor.module.css';

import { Scrollbars } from 'react-custom-scrollbars-2';
import PageFooter from '../../../Root/pageFooter';
import { TeamEditController } from '../../services/teamEditController';
import ColRegularMemberNew from './colRegularMemberNew';
import ConfirmDialog from '../../../Common/ui/confirmDialog';

import $ from 'jquery';
import TeamEditorResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';
import AccountResource from '../../../Account/resource/id';

//import CommandStyle from "../../services/commandStyle";

import { TeamSubCont } from '../../styled/TeamStyled';


class RegularMemberPage extends Component {
	static cssStyles = styles;

	constructor(props) {
		super(props);
		this.state = {
			//selectedTeam: null,			// 선택된 팀
			displayMembers: null,		// 화면에 출력할 팀원 정보들 (검색에 활용)
			addIndex: -1, /* 새로 추가될 멤버의 ID (addIndex--; 되서 겹치지 않게 한다) */

			confirmMessage: {
				visible: false,
				title: "",
				messages: [""],
				buttons: ["확인"],
				onClose: this.onCloseConfirmDialog,
				onClickButton: null
			},

			memberGridData: [],
			search: "",
		};

		this.props = props;

		this.onClickRemoveMember = this.onClickRemoveMember.bind(this);
	}

	componentDidMount() {
		$('table').css({ 'width': '100%', 'border-spacing': '0', 'border-collapse': 'collapse', 'table-layout': 'fixed' });
	}

	componentDidUpdate(prevProps, prevState) {
		//if (this.state.memberGridData !== this.props.memberGridData) {
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

	showErrorDialog = (title, messages) => {
		const confirmMessage = { ...this.state.confirmMessage };
		confirmMessage.visible = true;
		confirmMessage.title = title;
		confirmMessage.buttons = ["확인"];
		confirmMessage.onClickButton = this.onCloseConfirmDialog;

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

	onClickAddMember = () => {
		if (this.props.selectedTeam === null || this.props.selectedTeam === undefined) {
			this.showConfirmDialog("확인", ["선택된 팀이 없습니다.", "팀을 먼저 선택해주세요."], null, null);
			return;
        }

		const index = this.state.addIndex;
		this.onAddMember(index);
		this.setState({ addIndex: index - 1 });
	}

	async onAddMember(addIndex) {
		const index = addIndex;

		const member = new Object();
		member.ID = index;
		member.RegularID = this.props.selectedTeam.ID;
		member.MemberName = "새 인원";
		member.MemberID = null;
		member.OfficePhoneNumber = null;
		member.PhoneNumber = null;
		member.JobLevelID = 1;
		member.JobPositionID = 1;

		let members = this.props.memberGridData;
		let regularMembers = this.props.regularMembers;

		members.push(member);
		regularMembers.push(member);

		// 새 인원 css 효과
		$('#regularMemberTableBody').addClass("addPointer");
	}

	async onClickRemoveMember() {		
		let curMembers = this.state.displayMembers;

		// 삭제할 인원 분류
		const deleteMembers = [];
		for (let i = 0; i < curMembers.length; i++) {
			if (curMembers[i].check) {
				//await this.props.onDeleteMember(curMembers[i]);
				deleteMembers.push(curMembers[i]);
			}
		}

		if (deleteMembers.length === 0) {
			this.showConfirmDialog('확인', ['삭제할 직원을 선택하세요'], null, null);
		}
		else {
			this.confirmDialogData = deleteMembers;
			this.showConfirmDialog('삭제', '선택한 직원을 삭제할까요?', ['삭제', '취소'], this.onDeleteMember);
		}
	}

	onDeleteMember = async (index) => {
		if (index !== 0 || !this.confirmDialogData || this.confirmDialogData.length === 0) {
			return;
		}

		const deleteMembers = this.confirmDialogData;

		const [success, message] = await TeamEditController.RemoveRegularMembers(deleteMembers);
		if (!success && message.length > 0) {
			//alert(message);
			this.showConfirmDialog("에러", [message], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
			return;
		}

		//const [members, regularMembers] = await this.makeRemoveRegularMember(deleteMembers, this.state.memberGridData);
		let curMembers = this.state.displayMembers;
		let members = this.props.memberGridData;
		let regularMembers = this.props.regularMembers;

		for (let i = 0; i < deleteMembers.length; i++) {
			for (let j = 0; j < members.length; j++) {
				if (members[j].ID === deleteMembers[i].ID) {
					members.splice(j, 1);
					break;
				}
			}

			for (let j = 0; j < regularMembers.length; j++) {
				if (regularMembers[j].ID === deleteMembers[i].ID) {
					regularMembers.splice(j, 1);
					break;
				}
			}

			for (let j = 0; j < curMembers.length; j++) {
				if (curMembers[j].ID === deleteMembers[i].ID) {
					curMembers.splice(j, 1);
					break;
				}
			}
		}

		this.setState({ displayMembers: curMembers });

		this.onCloseConfirmDialog();

		//this.setState({ memberGridData: members, displayMemberGridData: members, regularMembers: regularMembers });
		//this.setState({ memberGridData: members, regularMembers: regularMembers });
	}

	searchMember = () => {
		// 검색할 경우 member 정보를 검색어와 비교하여 rowContent에 push하기
		// 1. 팀원 정보 및 검색 단어 불러오기
		// 2. member 정보 조회 및 검색 단어와 비교하기
		// 3. 단어가 포함된다면 포함하기

		// 1. 팀원 정보 및 검색 단어 불러오기
		const members = this.props.memberGridData;
		const search = this.state.search;

		let searchMembers = new Array();

		if (members == null) {
			this.state.displayMembers = searchMembers;
			return searchMembers;
		}

		// 2. 팀원 정보와 검색 단어 비교하기
		for (let i = 0; i < members.length; i++) {
			const member = members[i];

			if (search !== null && search !== undefined && search !== "") {

				// 멤버 이름에서 검색
				if (member.MemberName != null) {
					let memberName = null;
					memberName = member.MemberName;

					if (memberName.indexOf(search) !== -1) {
						searchMembers.push(members[i]);
						continue;
					}
				}

				// 멤버 직급에서 검색
				if (member.JobLevelID != null || this.props.jobLevels[member.JobLevelID] != null) {
					let jobLevel = this.props.jobLevels[member.JobLevelID].name;

					if (jobLevel.indexOf(search) != -1) {
						searchMembers.push(members[i]);
						continue;
					}
				}

				// 멤버 직위에서 검색
				if (member.JobPositionID != null || this.props.jobPositions[member.JobPositionID] != null) {
					let jobPosition = this.props.jobPositions[member.JobPositionID].name;

					if (jobPosition.indexOf(search) != -1) {
						searchMembers.push(members[i]);
						continue;
					}
				}

				// 휴대전화번호에서 검색
				if (member.PhoneNumber != null) {
					let phoneNumber = member.PhoneNumber;

					if (phoneNumber.indexOf(search) != -1) {
						searchMembers.push(members[i]);
						continue;
					}
				}

				// 근무처 전화번호에서 검색
				if (member.OfficePhoneNumber != null) {
					let officePhoneNumber = member.OfficePhoneNumber;

					if (officePhoneNumber.indexOf(search) != -1) {
						searchMembers.push(members[i]);
						continue;
					}
				}

				// 사번에서 검색
				if (member.MemberID != null) {
					let memberID = null;
					memberID = member.MemberID;

					if (memberID.indexOf(search) !== -1) {
						searchMembers.push(members[i]);
						continue;
					}
				}

				// 이메일에서 검색
				if (member.Email != null) {
					let email = null;
					email = member.Email;

					if (email.indexOf(search) !== -1) {
						searchMembers.push(members[i]);
						continue;
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

	onClickSearch = () => {
		const search = document.getElementById('search').value;

		this.setState({ search });
		return;
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

		// 권한에 따라 삭제 컬럼 표시
		const userAuthor = ProjectResource.getUserAuthor();
		let theadUI;
		let colgroupUI;

		if (userAuthor === AccountResource.ID.accountLevel.admin) {
			colgroupUI = <colgroup>
				<col style={{ width: '5%' }} />
				<col style={{ width: '5%' }} />
				<col style={{ width: '12%' }} />
				<col style={{ width: '12%' }} />
				<col style={{ width: '10%' }} />
				<col style={{ width: '10%' }} />
				<col style={{ width: '10%' }} />
				<col style={{ width: '9%' }} />
				<col style={{ width: '12%' }} />
				<col style={{ width: '15%' }} />
			</colgroup>;

			theadUI = <tr className={'memberThead'}>
				<th>삭제</th>
				<th>번호</th>
				<th>소속팀</th>
				<th>이름</th>
				<th>직위</th>
				<th>직급</th>
				<th>휴대전화번호</th>
				<th>사번</th>
				<th>근무처 전화번호</th>
				<th>Email</th>
			</tr>;
        }
		else {
			colgroupUI = <colgroup>
				<col style={{ width: '5%' }} />
				<col style={{ width: '12%' }} />
				<col style={{ width: '12%' }} />
				<col style={{ width: '10%' }} />
				<col style={{ width: '10%' }} />
				<col style={{ width: '10%' }} />
				<col style={{ width: '9%' }} />
				<col style={{ width: '12%' }} />
				<col style={{ width: '20%' }} />
			</colgroup>;

			theadUI = <tr>
				<th>번호</th>
				<th>소속팀</th>
				<th>이름</th>
				<th>직위</th>
				<th>직급</th>
				<th>휴대전화번호</th>
				<th>사번</th>
				<th>근무처 전화번호</th>
				<th>Email</th>
			</tr>;
        }

		const rowContent = [];

		const displayMembers = this.searchMember();

		if (displayMembers !== null && displayMembers !== undefined) {
			displayMembers.map((member, index) =>
			(
				rowContent.push(
					<tr key={Math.random()}>
						<ColRegularMemberNew
							member={member}
							teamName={teamName}
							jobLevels={this.props.jobLevels}
							jobPositions={this.props.jobPositions}
							index={index}
							checkMemberID={this.props.checkMemberID}
							checkPhoneNumber={this.props.checkPhoneNumber}
							checkEmail={this.props.checkEmail}
							//onChange={this.props.onChangeMember}
							showConfirmDialog={this.showConfirmDialog}
							showErrorDialog={this.showErrorDialog}
							onChangeMemberEditMode={this.props.onChangeMemberEditMode}
							onChangeMember={this.props.onChangeMember}
						/>
					</tr>
				)
			))
		}

		let editArea = null;
		if (this.props.isEditMode) {
			editArea =
				<>
					<span style={{ float: 'right' }}>
					  <a onClick={this.onClickAddMember} className={'sctAdd'}>추가</a>
					  <a onClick={this.onClickRemoveMember} className={'sctDel'}>삭제</a>
				    </span>
					{
						/*
						<a href="#" className={styles.sctDwn}>엑셀 다운로드</a>
						<a href="#" className={styles.sctUld}>엑셀 업로드</a>
						*/
					}
				</>
		}
		else {
			editArea = null;
		}

		return (

			<TeamSubCont id={'subCont'} className="scrollbar-outer">
			{/* <div className={'scrollbar'} style={{ height: menuHeight }}> */}
				<div className={'scWrap'}>
					<div className={'scCont'}>
						<div className={'scTop'}>
							<h4>{teamName}</h4>
							<div className={'sctRht'}>
								<div className={'sctSch'}>
									<input id="search" type="text" onKeyPress={(e) => this.onKeyPressSearch(e)} placeholder={TeamEditorResource.ID.textFilter} title={TeamEditorResource.ID.textFilter} />
									<a onClick={this.onClickSearch}>{TeamEditorResource.ID.textSearch}</a>
								</div>
								{editArea}
							</div>
						</div>
						<div className={'scrollbar'} /* style={{ height: menuHeight }} */>
							<table className={'scTb scTb'}>
								{colgroupUI}
								<thead>
									{theadUI}
								</thead>
								<tbody id="regularMemberTableBody">

									{rowContent}

								</tbody>
							</table>
						</div>
					</div>

					<PageFooter />

				</div>
					{/* </div> */}
				{
					/* alert창 대신 사용 */
					this.state.confirmMessage.visible &&
					<ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
				}
			</TeamSubCont>

		);
	}
}

export default RegularMemberPage;