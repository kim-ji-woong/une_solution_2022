import React, { Component } from 'react';
import $ from 'jquery';
import TreeNode from './treenode';
import '../../../Common/js/treeview.js';
import './css/style.css'; /* 사용중인것, 지우지마세요 */

import teamEditorCSS from '../../css/teamEditor.module.css';
import ConfirmDialog from '../../../Common/ui/confirmDialog';
import ProjectResource from '../../../Root/resource/id';


class TreeView extends Component {
	static EventCheckedChanged = 1;

	constructor(props) {
		super(props);

		this.state = {
			teamTreeData: this.props.teamTreeData,
			useCheckBox: this.getCheckBoxType(),
			confirmMessage: {
				visible: false,
				title: "",
				messages: [""],
				buttons: ["확인"],
				onClose: this.onCloseConfirmDialog,
				onClickButton: null
			},
		}
	}

	componentDidMount() {
		$('.regularNameTag').click(function () {
			//alert("regularNameTag 제이쿼리");
			this.showConfirmDialog("에러", ["regularNameTag 제이쿼리"], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
		});
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

	getCheckBoxType() {
		if (this.props.useCheckBox !== null && this.props.useCheckBox !== undefined) {
			return this.props.useCheckBox;
		}

		return TreeNode.CheckBox_NotUse;
    }

	onTreeNodeChanged = (team, event) => {
		this.props.onTreeNodeChanged(team, event);
	}

	render() {
		const target = $('#' + this.props.treeViewID);
		//const area = $('#' + this.props.treeViewID + "Area");
		let treeHeight = this.props.treeViewHeight;
		const path = window.location.pathname;

		if (treeHeight === null || treeHeight === undefined || isNaN(treeHeight) === true) {
			// 트리뷰 높이 Props값  설정이 없을 경우 or 값이 잘못 들어가 있을 경우
			if (target[0] != null) {
				treeHeight = target[0].clientHeight;
				//area.css("height", treeHeight);
			} else {
				treeHeight = 0;
			}
		}

		if (this.props.teamTreeData && this.props.teamTreeData.length > 0) {
			return (
				<div className={teamEditorCSS.teamBox} style={{color: "black"}}>
					<div id={this.props.treeViewID} className={teamEditorCSS.teamScroll}>
						<ul id={this.props.treeViewID + "Area"} /* className={'sarTree treeview ' + teamEditorCSS.scrollbar} */ className={path === ProjectResource.path.teamEditor ? 'sarTreeTeam treeviewTeam ' + teamEditorCSS.scrollbar : 'sarTree treeview ' + teamEditorCSS.scrollbar}>
						{
							this.props.teamTreeData.map((data, index) => (
								(this.props.teamTreeData[index].Children === null || this.props.teamTreeData[index].Children === undefined || this.props.teamTreeData[index].length === 0)
									?
									<TreeNode key={data.ID}
										teamTreeData={data}
										onTreeNodeChanged={this.onTreeNodeChanged}
										isEditMode={this.props.isEditMode}
										editNodeID={this.props.editNodeID}
										editTeamInfo={this.props.editTeamInfo}
										useCheckBox={this.state.useCheckBox}
										addTeam={this.props.addTeam}
										selectedTeam={this.props.selectedTeam}
										editTeam={this.props.editTeam}
										removeTeam={this.props.removeTeam}
									/>
									:
									<li key={data.ID}>
										<TreeNode key={data.ID}
											teamTreeData={data}
											onTreeNodeChanged={this.onTreeNodeChanged}
											isEditMode={this.props.isEditMode}
											editNodeID={this.props.editNodeID}
											editTeamInfo={this.props.editTeamInfo}
											useCheckBox={this.state.useCheckBox}
											addTeam={this.props.addTeam}
											selectedTeam={this.props.selectedTeam}
											editTeam={this.props.editTeam}
											removeTeam={this.props.removeTeam}
										/>
									</li>
							))
						}
					</ul>

					{
						/* alert창 대신 사용 */
						this.state.confirmMessage.visible &&
						<ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
					}
			    </div>
			    </div>
			);
		}
		else {
			return (
				<div id={this.props.treeViewID} className="scrollbar-outer" >
					{
						/* alert창 대신 사용 */
						this.state.confirmMessage.visible &&
						<ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
					}
				</div>);
        }
	}
}

export default TreeView;