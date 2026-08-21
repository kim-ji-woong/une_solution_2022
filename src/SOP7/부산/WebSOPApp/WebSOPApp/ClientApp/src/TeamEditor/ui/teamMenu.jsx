import React, { Component } from 'react';
import styles from '../../Common/css/style.module.css';
import team from '../css/teamEditor.module.css';
import '../../Common/js/treeview.js';
import $ from 'jquery';
import { TeamEditController } from '../services/teamEditController';
import TeamEditorResource from '../resource/id';
import TreeView from './utility/treeview';
import ProjectResource from '../../Root/resource/id';
import { SettingsController } from '../../Settings/services/settingsController';

import { SaRht, SarSel, SarEdit } from '../../TeamEditor/styled/teamStyled';
import ConfirmDialog from '../../Common/ui/confirmDialog';
import SettingResource from '../../Settings/resource/id';
import RootResource from '../../Root/resource/id';


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
				buttons: [''],
				onClose: this.onCloseConfirmDialog,
				onClickButton: null
			},
			settings: null,
			onClickSave: null,
        }

		this.props = props;
		this.refRegularTeamFile = React.createRef();
	}

	init = async () => {
		const siteID = ProjectResource.Site.Busan;

		// 설정 적용
		this.setState({
			siteID,
		});
	}

	onCloseConfirmDialog = () => {
		const confirmMessage = { ...this.state.confirmMessage };
		confirmMessage.visible = false;

		this.setState({ confirmMessage });
	}

	onClickList(e) {
		var target = e;

		if ($(target).is('.' + 'on')) {
			$(target).removeClass('on');
			$(target).next().slideUp();
		} else {
			$(target).addClass('on');
			$(target).next().slideDown();
		}

		return;
	}

	onClickTeam(teamType) {		
		this.props.onChangeTeamType(teamType);
		//$('#btnTeamMenu').removeClass('on');
		//$('#btnTeamMenu').next().slideUp();
	}

	onTreeNodeChanged = (team, target) => {
		if (this.props.selectedTeam !== team) {
			this.props.onTeamNodeChanged(team);
		}
	}

	addRootTeam = async () => {
		if (!this.props.isEditMode)
			return;

		let name = "";

		if (this.props.teamType === TeamEditorResource.ID.textRegular) {
			name = "새 조직";
		} else if (this.props.teamType === TeamEditorResource.ID.textTemporary) {
			name = "새 비상조직";
		} else if (this.props.teamType === TeamEditorResource.ID.textTemporaryEmergency) {
			name = "새 휴일 비상조직";
		}

		const nodeData = { ID: -1, TeamName: name, ParentTeam: null, ParentTeamID: null, Children: [], SiteID: ProjectResource.Site.Busan };

		if (this.props.teamType === TeamEditorResource.ID.textRegular) {
			const [success, newID, message] = await TeamEditController.UpdateRegularTeam(nodeData);
			if (!success) {
				this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], ['확인'], this.onCloseConfirmDialog);
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
			//nodeData.SiteID = ProjectResource.campusID;
			nodeData.SiteID = ProjectResource.Site.Busan;

			const [success, newID, message] = await TeamEditController.UpdateTemporaryTeam(nodeData);
			if (!success) {
				this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], ['확인'], this.onCloseConfirmDialog);
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

		const nodeData = { ID: -1, TeamName: name, ParentTeam: null, ParentTeamID: this.props.selectedTeam.ID, Children: [], SiteID: ProjectResource.Site.Busan };

		if (this.props.teamType === TeamEditorResource.ID.textRegular) {
			const [success, newID, message] = await TeamEditController.UpdateRegularTeam(nodeData);
			if (!success) {
				this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], ['확인'], this.onCloseConfirmDialog);
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
			nodeData.SiteID = ProjectResource.Site.Busan;

			const [success, newID, message] = await TeamEditController.UpdateTemporaryTeam(nodeData);
			if (!success) {
				this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], ['확인'], this.onCloseConfirmDialog);
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

	onClickUpload = (mode) => {
		if (mode === SettingResource.ID.excelMode.regularTeam) {
			this.refRegularTeamFile.current.click();
		}
	}

	onClickDownload = (mode) => {
		if (mode === SettingResource.ID.excelMode.regularTeam) {
			this.downloadRegularTeam();
		}
	}

	async downloadRegularTeam() {

		const siteID = RootResource.Site.Busan;

		const [surcess, message] = await SettingsController.requestDownloadRegularTeam(siteID);

		if (surcess === null) {
			this.props.showConfirmDialog("에러", [message], null, null);
		}
	}

	onSelectRegularTeamFile = (event) => {

		const file = event.target.files[0];
		this.refRegularTeamFile.current.value = "";

		const type = /(.*?)\.(xls|xlsx)$/;

		if (!file.name.match(type)) {
			this.props.showConfirmDialog("에러", ["엑셀 파일(xls, xlsx)만 업로드 가능합니다."], null, null);
			return;
		} else if (file.size > 10485760) {
			this.props.showConfirmDialog("에러", ["최대 10MB 엑셀 파일을 업로드 할 수 있습니다."], null, null);
			return;
		}

		this.regularTeamFile = file;
		console.log('파일 선택함');

		this.doSave(this.regularTeamFile);
	}

	async doSave(regularTeamFile) {
		// 조직 정보 업로드
		if (regularTeamFile !== null && regularTeamFile !== undefined) {
			console.log(regularTeamFile);

			let [success, message] = await SettingsController.requestUploadRegularTeamFile(regularTeamFile, ProjectResource.Site.Busan);
			console.log(success);

			if (success !== true) {
				// 저장이 끝남 상태변화
				//this.state.isSaving = false;

				//alert("조직 정보 업로드 실패:" + message);
				this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["조직 정보 업로드 실패 : " + message], ['확인'], this.onCloseConfirmDialog);
				return;

			} else if (success === true) {
				this.regularTeamFile = null;

				this.showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, ["설정이 저장되었습니다."], ["확인"], this.onCloseConfirmDialog);
			}
		}

		// 저장이 끝남 상태변화
		//this.state.isSaving = false;

		console.log('설정이 저장되었습니다');
		this.showConfirmDialog(ProjectResource.dialogTypes.INFO, ["설정이 저장되었습니다."], ["확인"], this.onCloseConfirmDialog);
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

	render() {
		let editArea = null;
		if (this.props.isEditMode) {
			editArea =
			    <>
					{/* <SarEdit className={styles.sarEditBtn} onClick={this.addRootTeam}></SarEdit> */}
				</>
        } 

		return (			
			<SaRht>
				<SarSel>					
					<button id="btnTeamMenu" onClick={(e) => this.onClickList(e.target)}>
						{this.props.teamType}
					</button>
					<ul>
						<li onClick={() => this.onClickTeam(TeamEditorResource.ID.textRegular)}><a>{TeamEditorResource.ID.textRegular}</a></li>
						<li onClick={() => this.onClickTeam(TeamEditorResource.ID.textTemporary)}><a>{TeamEditorResource.ID.textTemporary}</a></li>
						<li onClick={() => this.onClickTeam(TeamEditorResource.ID.textTemporaryEmergency)}><a>{TeamEditorResource.ID.textTemporaryEmergency}</a></li>
					</ul>
				</SarSel>
				<SarEdit >
					<button className='sarEdit' onClick={this.addRootTeam}>
						조직추가
					</button>
				</SarEdit>
				{/* {editArea}  */}
				{/* 트리뷰 위치 */}
				<TreeView
					treeViewID="teamTree"
					teamTreeData={this.props.teamTreeData}
					onTreeNodeChanged={this.onTreeNodeChanged}
					isEditMode={this.props.isEditMode}
					editNodeID={this.state.editNodeID}
					editTeamInfo={this.editTeamInfo}
					selectedTeam={this.props.selectedTeam}
					addTeam={this.addTeam}
					editTeam={this.editTeam}
					removeTeam={this.removeTeam}
					treeViewHeight={'calc(100% - 260px)'}
					treeViewID={this.state.treeViewID}
				/>
				{
					(this.props.teamType === TeamEditorResource.ID.textRegular) ?
						<div className='memberInfoWrap'>
							<button className='upload' onClick={() => this.onClickUpload(SettingResource.ID.excelMode.regularTeam)}>
								조직 업로드
							</button>
							<button className='download' onClick={() => this.onClickDownload(SettingResource.ID.excelMode.regularTeam)}>
								조직 다운로드
							</button>
							<input ref={this.refRegularTeamFile} style={{ display: 'none' }} type='file' accept='.xls,.xlsx' onChange={this.onSelectRegularTeamFile} />
						</div>
						:<></>
				}
				{
					/* alert창 대신 사용 */
					this.state.confirmMessage.visible &&
					<ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
				}
			</SaRht>
        );
    }
}

export default TeamMenu;