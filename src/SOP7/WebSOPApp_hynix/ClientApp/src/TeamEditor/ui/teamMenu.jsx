import React, { Component } from 'react';
import styles from '../../Common/css/style.module.css';
import '../../Common/js/treeview.js';
import $ from 'jquery';
import { TeamEditController } from '../services/teamEditController';
import TeamEditorResource from '../resource/id';
import TreeView from './utility/treeview';
import ProjectResource from '../../Root/resource/id';

import { DisplayMenuComponent } from '../styled/TeamEditorStyled';

import { i18n, withTranslation } from '../../language/i18n';
import { SettingController } from '../../Settings/services/settingController';
import ConfirmDialog from '../../Common/ui/confirmDialog';
import AccountResource from '../../Account/resource/id';

class TeamMenu extends Component {
	static cssStyles = styles;

	constructor(props) {
		super(props);

		this.state = {			
			editNodeID: 0, /* 팀 이름 편집하기 위해 필요한거 editNodeID랑 같은 TeamID를 가진 Node가 텍스트박스로 변경된다 */
			selectedSiteID: this.props.selectedSiteID,

			confirmMessage: {
				visible: false,
				title: "",
				messages: [""],
				buttons: [''],
				onClose: this.onCloseConfirmDialog,
				onClickButton: null
			}
        }

		this.props = props;
		this.refRegularTeamFile = React.createRef();
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.selectedSiteID !== this.props.selectedSiteID) {
			this.setState({ selectedSiteID: this.props.selectedSiteID });
		}
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

	onClickList(e) {
		var target = e;

		if ($(target).is('.' + TeamMenu.cssStyles.on)) {
			$(target).removeClass(TeamMenu.cssStyles.on);
			$(target).next().slideUp();
		} else {
			$(target).addClass(TeamMenu.cssStyles.on);
			$(target).next().slideDown();
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

	addRootTeam = async () => {
		if (!this.props.isEditMode)
			return;

		let name = "";

		if (this.props.teamType === TeamEditorResource.menu.조직) {
			name = i18n.t('teamEditor.formText.새 조직');
		} else if (this.props.teamType === TeamEditorResource.menu.평일_비상조직) {
			name = i18n.t('teamEditor.formText.새 비상조직');
		} else if (this.props.teamType === TeamEditorResource.menu.휴일_비상조직) {
			name = i18n.t('teamEditor.formText.새 휴일 비상조직');
		}

		const nodeData = { ID: -1, TeamName: name, ParentTeam: null, ParentTeamID: null, Children:[], SiteID: this.state.selectedSiteID};

		if (this.props.teamType === TeamEditorResource.menu.조직) {
			const [success, newID, message] = await TeamEditController.UpdateRegularTeam(nodeData);
			if (!success) {
				alert(message);
				return;
			}

			nodeData.ID = newID;
		}
		else if (this.props.teamType === TeamEditorResource.menu.평일_비상조직 || this.props.teamType === TeamEditorResource.menu.휴일_비상조직) {
			if (this.props.teamType === TeamEditorResource.menu.평일_비상조직) {
				nodeData.IsNormal = true;
			}
			else {
				nodeData.IsNormal = false;
            }
			//nodeData.SiteID = ProjectResource.SiteID;

			const [success, newID, message] = await TeamEditController.UpdateTemporaryTeam(nodeData);
			if (!success) {
				alert(message);
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
		if (this.props.teamType === TeamEditorResource.menu.조직) {
			name = i18n.t('teamEditor.formText.새 조직');
		}
		else if (this.props.teamType === TeamEditorResource.menu.평일_비상조직) {
			name = i18n.t('teamEditor.formText.새 비상조직');
		}
		else if (this.props.teamType === TeamEditorResource.menu.휴일_비상조직) {
			name = i18n.t('teamEditor.formText.새 휴일 비상조직');
		}
		else {
			return;
		}

		const nodeData = { ID: -1, TeamName: name, ParentTeam: null, ParentTeamID: this.props.selectedTeam.ID, Children: [] , SiteID: this.props.selectedTeam.SiteID };

		if (this.props.teamType === TeamEditorResource.menu.조직) {
			const [success, newID, message] = await TeamEditController.UpdateRegularTeam(nodeData);
			if (!success) {
				alert(message);
				return;
			}

			nodeData.ID = newID;
		}
		else if (this.props.teamType === TeamEditorResource.menu.평일_비상조직 || this.props.teamType === TeamEditorResource.menu.휴일_비상조직) {
			if (this.props.teamType === TeamEditorResource.menu.평일_비상조직) {
				nodeData.IsNormal = true;
			}
			else {
				nodeData.IsNormal = false;
			}
			//nodeData.SiteID = ProjectResource.SiteID;

			const [success, newID, message] = await TeamEditController.UpdateTemporaryTeam(nodeData);
			if (!success) {
				alert(message);
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

	onClickUpload = () => {
		this.refRegularTeamFile.current.click();
	}

	onClickDownload = () => {
		const selectedSiteID = this.props.selectedSiteID;
		this.downloadRegularTeam(selectedSiteID);
	}

	async downloadRegularTeam(siteID) {
		if (siteID === ProjectResource.Site.GG_A) {
			// 종합방재실의 경우 전체 사용자 정보를 모두 받아와야 한다.
			siteID = null;
		}

		const [surcess, message] = await SettingController.requestDownloadRegularTeam(siteID);

		if (surcess === null) {
			this.showConfirmDialog(i18n.t('common.오류'), [message], null, null);
		}
	}

	onSelectRegularTeamFile = (event) => {
		const file = event.target.files[0];
		this.refRegularTeamFile.current.value = "";

		const type = /(.*?)\.(xls|xlsx)$/;

		if (!file.name.match(type)) {
			this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.userOption.엑셀 파일(xls, xlsx)만 업로드 가능합니다')], null, null);
			return;
		} else if (file.size > 10485760) {
			this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.userOption.최대 10MB 엑셀 파일을 업로드 할 수 있습니다')], null, null);
			return;
		}

		// 조직 정보 업로드
		if (file !== null && file !== undefined) {
			this.requestUploadRegularTeamFile(file);
		}
	}

	requestUploadRegularTeamFile = async (regularTeamFile) => {
		if (regularTeamFile !== null && regularTeamFile !== undefined) {
			const [success, message] = await SettingController.requestUploadRegularTeamFile(regularTeamFile, this.state.selectedSiteID);

			if (success) {
				this.showConfirmDialog(i18n.t('common.확인'), ['조직 정보가 업로드되었습니다.'], null, null);
				this.props.init();
			}
			else {
				this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.formText.조직 정보 업로드 실패 :') + message], null, null);
			}
		}
	}

	render() {
		let editArea = null;
		if (this.props.isEditMode && ProjectResource.SiteID !== ProjectResource.Site.GG_A) {
			editArea =
				/* <div className={styles.sarEdit}>
					<a className={styles.left} onClick={this.editTeam}>수정</a>
					<a onClick={this.addTeam}>추가</a>
					<a onClick={this.removeTeam}>삭제</a>
				</div> */
				<div className={'sarEdit'}>
					<a onClick={this.addRootTeam}></a>
				</div>
		}

		let teamTypeName = '';
		if (this.props.teamType === TeamEditorResource.menu.조직) {
			teamTypeName = i18n.t('teamEditor.menu.조직');
		}
		else if (this.props.teamType === TeamEditorResource.menu.평일_비상조직) {
			teamTypeName = i18n.t('teamEditor.menu.평일 비상조직');
		}
		else if (this.props.teamType === TeamEditorResource.menu.휴일_비상조직) {
			teamTypeName = i18n.t('teamEditor.menu.휴일 비상조직');
		}

		const userInfo = ProjectResource?.getUserInfo();

		return (	
			<>		
			<DisplayMenuComponent className={'saRht'}>
				<div className={'sarSel'}>
					{
						ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen
							? <><button id="btnTeamMenu" onClick={(e) => this.onClickList(e.target)}>{teamTypeName}</button></>
							: <>
								<button id="btnTeamMenu" onClick={(e) => this.onClickList(e.target)}>{teamTypeName}</button>
								<ul>
									<li onClick={() => this.onClickTeam(TeamEditorResource.menu.조직)}><a>{TeamEditorResource.menu.조직}</a></li>
									<li onClick={() => this.onClickTeam(TeamEditorResource.menu.평일_비상조직)}><a>{TeamEditorResource.menu.평일_비상조직}</a></li>
									<li onClick={() => this.onClickTeam(TeamEditorResource.menu.휴일_비상조직)}><a>{TeamEditorResource.menu.휴일_비상조직}</a></li>
								</ul>
							</>
					}
				</div>
				{
					ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen
						? <></>
						: <>  {editArea} </>
				}
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
					selectedSiteID={this.state.selectedSiteID}
				/>
				{
					ProjectResource.SiteID === ProjectResource.Site.GG_A?
					<div className='teamBtnWrap'>
						{
							(userInfo.levelID === AccountResource.accountLevelID.master || 
							userInfo.levelID === AccountResource.accountLevelID.admin) &&
							<div className={'teamBtnBox'} onClick={() => this.onClickUpload()}><p>조직 업로드</p><span className={'teamUpIcon'}></span></div>
						}
						<div className={'teamBtnBox'} onClick={() => this.onClickDownload()}><p>조직 다운로드</p><span className={'teamDownIcon'}></span></div>
						<input ref={this.refRegularTeamFile} className={'hidden'} type='file' accept='.xls,.xlsx' onChange={this.onSelectRegularTeamFile} style={{ position: 'absolute' }} />
					</div>
					:<></>
				}
			</DisplayMenuComponent>
			{
				/* alert창 대신 사용 */
				this.state.confirmMessage.visible &&
				<ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
			}
			</>
        );
    }
}

export default withTranslation()(TeamMenu);