import React, { Component } from 'react';
import styles from '../../Common/css/style.module.css';
import '../../Common/js/treeview.js';
import $ from 'jquery';
import { TeamEditController } from '../services/teamEditController';
import TeamEditorResource from '../resource/id';
import TreeView from './utility/treeview';
import ProjectResource from '../../Root/resource/id';
import ConfirmDialog from '../../Common/ui/confirmDialog';
import uis from '../../Common/css/ui.module.css';
import { Link } from 'react-router-dom';

class TeamMenu extends Component {
	static cssStyles = styles;

	constructor(props) {
		super(props);

		this.state = {			
			editNodeID: 0, /* 팀 이름 편집하기 위해 필요한거 editNodeID랑 같은 TeamID를 가진 Node가 텍스트박스로 변경된다 */
			confirmMessage: {
				visible: false,
				title: "",
				messages: [""],
				buttons: ["확인"],
				onClose: this.onCloseConfirmDialog,
				onClickButton: null
			},
        }

		this.props = props;

		this.wsMgr = this.props.wsMgr;
	}

	componentDidMount() {
		//$('span[id^="test01"]').click(function () {
		//	$('.regular').slideToggle();
		//});

		//$('span[id^="test02"]').click(function () {
		//	$('.temporary').slideToggle();
		//});

		//$('span[id^="test03"]').click(function () {
		//	$('.temporaryEmergency').slideToggle();
		//});

		//$('span[id^="test01"]').click(function () {
		//	$('.temporary').hide();
		//	$('.temporaryEmergency').hide();
		//});

		//$('span[id^="test02"]').click(function () {
		//	$('.regular').hide();
		//	$('.temporaryEmergency').hide();
		//});

		//$('span[id^="test03"]').click(function () {
		//	$('.regular').hide();
		//	$('.temporary').hide();
		//});
	}

	onClickTeamBtn = (e, team) => {

		e.stopPropagation();

		if (team === TeamEditorResource.teamType.regular) {
			this.props.onChangeTeamType(TeamEditorResource.ID.textRegular);
			this.toggleTeam(e, '.regular');
		}

		if (team === TeamEditorResource.teamType.temporary) {
			this.props.onChangeTeamType(TeamEditorResource.ID.textTemporary);
			this.toggleTeam(e, '.temporary');
		}

		if (team === TeamEditorResource.teamType.temporaryEmergency) {
			this.props.onChangeTeamType(TeamEditorResource.ID.textTemporaryEmergency);
			this.toggleTeam(e, '.temporaryEmergency');
		}
	}

	toggleTeam = (e, teamSelector) => {
		const teamElement = document.querySelector(teamSelector);

		let target = e.target;

		if ($(target).is('.' + TeamMenu.cssStyles.on)) {
			$(target).removeClass(TeamMenu.cssStyles.on);
			//$(target).next().slideUp();
		} else {
			$(target).addClass(TeamMenu.cssStyles.on);
			//$(target).next().slideDown();
		}

		let disappearCont1 = null;
		let disappearCont2 = null;

		if (teamSelector === '.regular') {
			disappearCont1 = '.temporary';
			disappearCont2 = '.temporaryEmergency';
		} else if (teamSelector === '.temporary') {
			disappearCont1 = '.regular';
			disappearCont2 = '.temporaryEmergency';
		} else if (teamSelector === '.temporaryEmergency') {
			disappearCont1 = '.regular';
			disappearCont2 = '.temporary';
		}

		const disappearElement1 = document.querySelector(disappearCont1);
		const disappearElement2 = document.querySelector(disappearCont2);

		if (teamElement) {
			//teamElement.classList.toggle('hidden');
			if (teamElement.style.display === 'none' || teamElement.style.display === '') {
				teamElement.style.display = 'block';
				disappearElement1.style.display = 'none';
				disappearElement2.style.display = 'none';
			} else {
				teamElement.style.display = 'none';
			}
		}
	}

	onCloseConfirmDialog = () => {
		const confirmMessage = { ...this.state.confirmMessage };
		confirmMessage.visible = false;

		this.setState({ confirmMessage });
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

	onClickList(e) {
		var target = e;

		if ($(target).is('.' + TeamMenu.cssStyles.on)) {
			$(target).removeClass(TeamMenu.cssStyles.on);
			//$(target).next().slideUp();
		} else {
			$(target).addClass(TeamMenu.cssStyles.on);
			//$(target).next().slideDown();
		}

		return;
	}

	onClickTeam(teamType) {		
		this.props.onChangeTeamType(teamType);
		$('#btnTeamMenu').removeClass(TeamMenu.cssStyles.on);
		$('#btnTeamMenu').next().slideUp();
	}

	onTreeNodeChanged = (team, target) => {
		if (this.props.selectedTeam !== team) {
			this.props.onTeamNodeChanged(team);
		}
	}

	addRootTeam = async (type) => {
		if (!this.props.isEditMode)
			return;

		if (this.props.teamType !== type) {
			this.props.onChangeTeamType(type);
		}

		let name = "";

		//if (this.props.teamType === TeamEditorResource.ID.textRegular) {
		//	name = "새 조직";
		//} else if (this.props.teamType === TeamEditorResource.ID.textTemporary) {
		//	name = "새 비상조직";
		//} else if (this.props.teamType === TeamEditorResource.ID.textTemporaryEmergency) {
		//	name = "새 휴일 비상조직";
		//}

		if (type === TeamEditorResource.ID.textRegular) {
			name = "새 조직";
		} else if (type === TeamEditorResource.ID.textTemporary) {
			name = "새 비상조직";
		} else if (type === TeamEditorResource.ID.textTemporaryEmergency) {
			name = "새 휴일 비상조직";
		}

		const siteID = ProjectResource.Site.Yeosu;

		const nodeData = { ID: -1, TeamName: name, ParentTeam: null, ParentTeamID: null, Children:[], SiteID: siteID };

		if (type === TeamEditorResource.ID.textRegular) {
			const [success, newID, message] = await TeamEditController.UpdateRegularTeam(nodeData);
			if (!success) {
				//alert(message);
				this.showConfirmDialog("에러", [message], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
				return;
			}

			nodeData.ID = newID;
		}
		else if (type === TeamEditorResource.ID.textTemporary || type === TeamEditorResource.ID.textTemporaryEmergency) {
			if (type === TeamEditorResource.ID.textTemporary) {
				nodeData.IsNormal = true;
			}
			else {
				nodeData.IsNormal = false;
            }
			nodeData.SiteID = ProjectResource.SiteID;

			const [success, newID, message] = await TeamEditController.UpdateTemporaryTeam(nodeData);
			if (!success) {
				//alert(message);
				this.showConfirmDialog("에러", [message], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
				return;
			}

			nodeData.ID = newID;
		}
		else {
			return;
        }

		const teamTreeData = this.props.teamTreeData;
		teamTreeData.push(nodeData);

		this.props.onUpdateTeamTreeData(teamTreeData);
    }

	addTeam = async () => {
		if (!this.props.isEditMode)
			return;

		let name = '';
		if (this.props.teamType === TeamEditorResource.ID.textRegular) {
			name = "새 조직";
		}
		else if (this.props.teamType === TeamEditorResource.ID.textTemporary) {
			name = "새 비상조직";
		}
		else if (this.props.teamType === TeamEditorResource.ID.textTemporaryEmergency) {
			name = "새 휴일 비상조직";
		}
		else {
			return;
		}

		const siteID = ProjectResource.Site.Yeosu;

		const nodeData = { ID: -1, TeamName: name, ParentTeam: null, ParentTeamID: this.props.selectedTeam.ID, Children: [], SiteID: siteID };

		if (this.props.teamType === TeamEditorResource.ID.textRegular) {
			const [success, newID, message] = await TeamEditController.UpdateRegularTeam(nodeData);
			if (!success) {
				//alert(message);
				this.showConfirmDialog("에러", [message], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
				return;
			}

			nodeData.ID = newID;
		}
		else if (this.props.teamType === TeamEditorResource.ID.textTemporary || this.props.teamType === TeamEditorResource.ID.textTemporaryEmergency) {
			if (this.props.teamType === TeamEditorResource.ID.textTemporary) {
				nodeData.IsNormal = true;
			}
			else {
				nodeData.IsNormal = false;
			}
			nodeData.SiteID = ProjectResource.SiteID;

			const [success, newID, message] = await TeamEditController.UpdateTemporaryTeam(nodeData);
			if (!success) {
				//alert(message);
				this.showConfirmDialog("에러", [message], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
				return;
			}

			nodeData.ID = newID;
		}

		const findNode = TeamEditController.findParent(nodeData.ParentTeamID, this.props.teamTreeData);
		if (!findNode.Children)
			findNode.Children = [];
		findNode.Children.push(nodeData);

		this.props.onUpdateTeamTreeData(this.props.teamTreeData);
	}

	removeTeam = () => {
		if (!this.props.isEditMode)
			return;

		this.props.removeTeam();
	}

	editTeam = () => {
		if (!this.props.isEditMode)
			return;
				
		this.setState({ editNodeID: this.props.selectedTeam.ID });
	}

	editTeamInfo = (team, chgName) => {
		if (team !== null) {
			this.props.editTeam(team, chgName);
		}

		// 팀 이름 수정이 끝났으면 텍스트박스를 label tag로 바꿔주려고
		this.setState({ editNodeID: 0 });
    }

	onClickReturn = () => {
		if (this.wsMgr) {
			this.wsMgr.moveCameraToTarget(0);
		}
	}

	changeArrow = () => {
		//const changeArrow1 = document.getElementById('test01');
		//const changeArrow2 = document.getElementById('test02');
		//const changeArrow3 = document.getElementById('test03');

		//changeArrow1.classList.toggle('on');
		//changeArrow2.classList.toggle('on');
		//changeArrow3.classList.toggle('on');
	}

	render() {
		let editArea = null;
		if (this.props.isEditMode) {
			editArea =
				/* <div className={styles.sarEdit}>
					<a className={styles.left} onClick={this.editTeam}>수정</a>
					<a onClick={this.addTeam}>추가</a>
					<a onClick={this.removeTeam}>삭제</a>
				</div> */
				/* <div className={styles.sarEdit}>
					<a onClick={this.addRootTeam}></a>
				</div> */
				<></>
        }

		return (			
			<div className={styles.saRht}>
				<div className={styles.sarSel}>
					<button id="btnTeamRegularMenu" /*onClick={(e) => this.onClickList(e.target)}*/> {/* 클릭영역 넓혀야 하는지 넓히려면 여기에 이벤트 */}
						<span className={uis.leftBorder} onClick={(e) => this.onClickTeamBtn(e, TeamEditorResource.teamType.regular)}>{/*{this.props.teamType}*/}조직</span>
						{/* <span id="test01" className={styles.teamArrowDown} onClick={(e) => this.onClickTeamBtn(e, TeamEditorResource.teamType.regular)}></span> */}
						<span className={styles.addSignBtn} onClick={() => this.addRootTeam(TeamEditorResource.ID.textRegular)}></span>
					</button>
				</div>
				{editArea}
				{/*트리뷰 위치 */}
				<div className={'regular'} /* style={{ height: 'calc(100% - 340px)' }} */ style={{ display: 'none' }}>
					<TreeView
						treeViewID="teamTree"
						//teamTreeData={this.props.teamTreeData}
						teamTreeData={this.props.regularTreeData}
						onTreeNodeChanged={this.onTreeNodeChanged}
						isEditMode={this.props.isEditMode}
						editNodeID={this.state.editNodeID}
						editTeamInfo={this.editTeamInfo}
						selectedTeam={this.props.selectedTeam}
						addTeam={this.addTeam}
						editTeam={this.editTeam}
						removeTeam={this.removeTeam}
					/>
				</div>
				<div className={styles.sarSel}>
					<button id="btnTeamTemporaryMenu" /*onClick={(e) => this.onClickList(e.target)}*/>
						<span className={uis.leftBorder} onClick={(e) => this.onClickTeamBtn(e, TeamEditorResource.teamType.temporary)}>평일 비상조직</span>
						{/* <span id="test02" className={styles.teamArrowDown} onClick={(e) => this.onClickTeamBtn(e, TeamEditorResource.teamType.temporary)}></span> */}
						<span className={styles.addSignBtn} onClick={() => this.addRootTeam(TeamEditorResource.ID.textTemporary)}></span>
					</button>
				</div>
				<div className={'temporary'} style={{ display: 'none' }}>
					<TreeView
						treeViewID="teamTree"
						//teamTreeData={this.props.teamTreeData}
						teamTreeData={this.props.temporaryTreeData}
						onTreeNodeChanged={this.onTreeNodeChanged}
						isEditMode={this.props.isEditMode}
						editNodeID={this.state.editNodeID}
						editTeamInfo={this.editTeamInfo}
						selectedTeam={this.props.selectedTeam}
						addTeam={this.addTeam}
						editTeam={this.editTeam}
						removeTeam={this.removeTeam}
					/>
				</div>
				<div className={styles.sarSel}>
					<button id="btnTeamTemporaryEmergencyMenu" /*onClick={(e) => this.onClickList(e.target)}*/>
						<span className={uis.leftBorder} onClick={(e) => this.onClickTeamBtn(e, TeamEditorResource.teamType.temporaryEmergency)}>휴일 비상조직</span>
						{/* <span id="test03" className={styles.teamArrowDown} onClick={(e) => this.onClickTeamBtn(e, TeamEditorResource.teamType.temporaryEmergency)}></span> */}
						<span className={styles.addSignBtn} onClick={() => this.addRootTeam(TeamEditorResource.ID.textTemporaryEmergency)}></span>
					</button>
				</div>
				<div className={'temporaryEmergency'} style={{ display: 'none' }}>
					<TreeView
						treeViewID="teamTree"
						//teamTreeData={this.props.teamTreeData}
						teamTreeData={this.props.temporaryEmergencyTreeData}
						onTreeNodeChanged={this.onTreeNodeChanged}
						isEditMode={this.props.isEditMode}
						editNodeID={this.state.editNodeID}
						editTeamInfo={this.editTeamInfo}
						selectedTeam={this.props.selectedTeam}
						addTeam={this.addTeam}
						editTeam={this.editTeam}
						removeTeam={this.removeTeam}
					/>
				</div>

				{/*<div className={styles.sarSelBox}>*/}
				{/*	<button id="btnTeamMenu" onClick={(e) => this.onClickList(e.target)}><span className={uis.leftBorder}>조직</span><span id="test01" className={styles.teamArrowDown}></span></button>*/}
				{/*	<button id="btnTeamMenu" onClick={(e) => this.onClickList(e.target)}><span className={uis.leftBorder}>평일 비상조직</span><span className={styles.teamArrowDown}></span></button>*/}
				{/*	<button id="btnTeamMenu" onClick={(e) => this.onClickList(e.target)}><span className={uis.leftBorder}>휴일 비상조직</span><span className={styles.teamArrowDown}></span></button>*/}
			 {/*  </div> */}
			    <Link to="/sdms"><div className={uis.returnArea} onClick={() => this.onClickReturn()}><span className={uis.returnBtn}></span>이전페이지</div></Link>
				{
					/* alert창 대신 사용 */
					this.state.confirmMessage.visible &&
					<ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
				}
			</div>
        );
    }
}

export default TeamMenu;