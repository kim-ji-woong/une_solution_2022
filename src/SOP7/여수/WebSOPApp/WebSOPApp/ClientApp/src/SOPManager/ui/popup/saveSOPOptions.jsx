import React, { Component } from 'react';
import styles from '../../../Common/css/style.module.css';
import commonStyles from '../../../Common/css/common.module.css';
import bodyStyles from '../../css/body.module.css';
import '../../css/componentProperty.css';
import SopManagerResource from '../../resource/id';
import SopController from '../../services/sopController';
import SopManager from '../sopManager';
import $ from 'jquery';
import '../../../Common/js/treeview.js';
import '../../../TeamEditor/ui/utility/css/style.css'; /* 사용중인것, 지우지마세요 */
import SopDataManager from '../../services/sopDataManager';
import ConfirmDialog from '../../../Common/ui/confirmDialog';

class SaveSOPOptions extends Component {
	static cssStyles = styles;

	constructor(props) {
		super(props);
		this.props = props;

		this.state = {
			sopData: this.props.sopData,
			isNormal: SaveSOPOptions.getSOPMode(this.props.sopData),
			verions: [],
			currentVersion: null,
			selectedVersion: null,
			saveNewVersion: false,
			instance: this,
			loading: true,
			loadingMessage: "버전 정보를 얻어오고 있습니다.",

			confirmMessage: {
				visible: false,
				title: "",
				messages: [""],
				buttons: ["확인"],
				onClose: this.onCloseConfirmDialog,
				onClickButton: null
			},

			prevProps: this.props
		};

		this.refTextNewVersionName = React.createRef();
		this.refTextNewVersionDescription = React.createRef();
		this.refCheckNewVersion = React.createRef();
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

	static getDerivedStateFromProps(props, state) {
		if (props === state.prevProps) {
			return state;
		}

		//if (state.instance) {
		//	state.instance.getVersions(props.sopData);
		//}

		return {
			sopData: props.sopData,
			isNormal: SaveSOPOptions.getSOPMode(props.sopData),
			verions: [],
			currentVersion: null,
			selectedVersion: null,
			saveNewVersion: state.saveNewVersion,
			loading: state.loading,
			loadingMessage: state.loadingMessage,
			instance: state.instance,
			prevProps: props
		};
	}

	static getSOPMode(sopData) {
		if (sopData?.version) {
			return sopData.version.isNormal;
		}

		return true;
	}

	componentDidMount() {
		this.getVersions(this.state.sopData);
    }

	async getVersions(sopData) {
		if (!sopData) {
			return;
		}

		const [disasterVersions, message] = await SopController.requestDisasterVersions(sopData, this.state.isNormal);

		if (disasterVersions === null) {
			this.props.showConfirmDialog('오류', [message], ['확인'], this.onClickCancle);
			//this.props.content(SopManagerResource.editSOP, this.state.sopData); // 에러 발생 0711
			this.props.content(SopManagerResource.id.ko.menu.editSOP, this.state.sopData); // 객체 연동
			this.setState({ loading: false });
			//this.setState({ loadingMessage: message });
			// return;

			this.props.showConfirmDialog([message], null, null, 'error');
			//this.setState({ loadingMessage: message });
			return;
		}
		else {
			this.setState({ versions: disasterVersions.versions, currentVersion: disasterVersions.currentVersion, loading: false });
		}

		//this.setState({ versions: disasterVersions.versions, currentVersion: disasterVersions.currentVersion, loading: false });
	}

	onClickCancle = () => {
		this.onClickApply(false);
		this.props.onCloseConfirmDialog();
	}

	onCheckNewVersion = (event) => {
		this.setState({ saveNewVersion: event.target.checked });
	}

	onClickClose() {
		this.props.content(SopManager.menu.editSOP, this.state.sopData);
	}

	onClickApply(ok) {
		if (ok) {
			if (this.refCheckNewVersion.current.checked) {
				const newVersionName = this.refTextNewVersionName.current.value.toString().trim();

				if (newVersionName.length === 0) {
					//alert(SopManagerResource.ID.messages.inputSOPVersionName);
					this.showConfirmDialog("에러", [SopManagerResource.ID.messages.inputSOPVersionName], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
					return;
				}

				this.state.sopData.version = SopDataManager.makeNewVersion(this.state.isNormal, newVersionName, this.props.loginUser ? this.props.loginUser.id : -1, this.refTextNewVersionDescription.current.value.toString().trim());
				this.props.content(SopManager.menu.save, this.state.sopData);
				return;
            }

			if (this.state.selectedVersion) {
				this.state.sopData.version.id = this.state.selectedVersion.id;
				this.state.sopData.version.isNormal = this.state.selectedVersion.isNormal;
				this.props.content(SopManager.menu.save, this.state.sopData);
			}
			else {
				//alert(SopManagerResource.ID.messages.selectSOPVersion);
				this.showConfirmDialog("에러", [SopManagerResource.ID.messages.selectSOPVersion], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
            }
		}
		else {
			this.props.content(SopManager.menu.editSOP, this.state.sopData);
        }
	}

	tbRdo(event, version) {
		const tr = event.target.parentElement;

		for (let i = 0; i < tr.parentElement.children.length; i++) {
			const row = tr.parentElement.children[i];

			if (row === tr) {
				continue;
			}
			else {
				row.classList.remove(SaveSOPOptions.cssStyles.on);
			}
		}

		tr.classList.add(SaveSOPOptions.cssStyles.on);
		const saveNewVersion = version === null || version === undefined;

		this.setState({ selectedVersion: version, saveNewVersion: saveNewVersion });
	};

	onChangeSopMode(isNormal) {
		this.getDisasterVersions(isNormal);
	}

	async getDisasterVersions(isNormal) {
		const [disasterVersions, message] = await SopController.requestDisasterVersions(this.state.sopData, isNormal);

		if (disasterVersions === null) {
			//alert(message);
			this.showConfirmDialog("에러", [message], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
			return;
		}

		this.setState({ versions: disasterVersions.versions, currentVersion: disasterVersions.currentVersion, isNormal: isNormal });
    }

	getUserName() {
		if (this.props.loginUser) {
			/*if (this.props.loginUser.nickName.length > 0) {
				return this.props.loginUser.nickName;
			}
			else {*/
				return this.props.loginUser.userID;
            //}
		}

		return "-";
    }

	render() {
		if (this.state.loading) {
			return <h2>{this.state.loadingMessage}</h2>
		}

		const userName = this.getUserName();

		return (
			<div id={SaveSOPOptions.cssStyles.sopPop}>
				<div>
					<div>
						<div className={SaveSOPOptions.cssStyles.spPop + " " + SaveSOPOptions.cssStyles.sopSave}>
							<div className={SaveSOPOptions.cssStyles.sppTop}>
								<h4>DB 저장</h4>
								<a className={SaveSOPOptions.cssStyles.clickable} onClick={() => this.onClickClose()}>닫기</a>
							</div>
							<div className={SaveSOPOptions.cssStyles.sppSel}>
								{/*<label className={SaveSOPOptions.cssStyles.clickable}>*/}
								{/*	<input type="radio" name="sppSel" className={bodyStyles.labelInput} checked={this.state.isNormal} onChange={() => this.onChangeSopMode(true)} />*/}
								{/*	{SopManagerResource.ID.sopMode.normal}*/}
								{/*</label>*/}
								{/*<label className={SaveSOPOptions.cssStyles.clickable}>*/}
								{/*	<input type="radio" name="sppSel" className={bodyStyles.labelInput} checked={!this.state.isNormal} onChange={() => this.onChangeSopMode(false)} />*/}
								{/*	{SopManagerResource.ID.sopMode.abnormal}*/}
								{/*</label>*/}
							</div>
							<div className={SaveSOPOptions.cssStyles.sppCont2}>
								<div className="scroll-wrapper scrollbar-outer" id="pos_relative">
									<div className="scrollbar-outer scroll-content" id="saveSOP_scrollContent">
										<div className={SaveSOPOptions.cssStyles.spprCont}>
											<table className={SaveSOPOptions.cssStyles.scTb}>
												<caption>버전명, 작성자, 생성일자, 수정일자, 부가설명으로 구성된 표</caption>
												<colgroup>
													<col className="width_10Pro" />
													<col className="width_10Pro" />
													<col className="width_20Pro" />
													<col className="width_20Pro" />
													<col className="width_35Pro" />
												</colgroup>
												<thead>
													<tr>
														<th>버전명</th>
														<th>작성자</th>
														<th>생성일자</th>
														<th>수정일자</th>
														<th>부가설명</th>
													</tr>
												</thead>
												<tbody>
													{
														this.state.currentVersion && (
															<tr onClick={(event) => this.tbRdo(event, this.state.currentVersion)}>
																<td>{this.state.currentVersion.versionName}</td>
																<td>{this.state.currentVersion.owner}</td>
																<td>{this.state.currentVersion.createTime.replace('T', ' ')}</td>
																<td>{this.state.currentVersion.lastAccessTime.replace('T', ' ')}</td>
																<td className={commonStyles.tal}>{this.state.currentVersion.description}</td>
															</tr>
                                                        )
                                                    }
													<tr onClick={(event) => this.tbRdo(event, null)}>
														<td><input ref={this.refTextNewVersionName} type="text" /></td>
														<td>{userName}</td>
														<td>-</td>
														<td>-</td>
														<td><input ref={this.refTextNewVersionDescription} type="text" /></td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
									<div className="scroll-element scroll-x">
										<div className="scroll-element_outer">
											<div className="scroll-element_size">
											</div>
											<div className="scroll-element_track">
											</div>
											<div className="scroll-bar" id="width_100px">
											</div>
										</div>
									</div>
									<div className="scroll-element scroll-y">
										<div className="scroll-element_outer">
											<div className="scroll-element_size">
											</div>
											<div className="scroll-element_track">
											</div>
											<div className="scroll-bar" id="height_100px">
											</div>
										</div>
									</div>
								</div>
								<div className={SaveSOPOptions.cssStyles.spprBot}>
									<label className={SaveSOPOptions.cssStyles.clickable} style={{ "display": "none" }}>
										<input ref={this.refCheckNewVersion} type="checkbox" className={bodyStyles.labelInput} name="" id="popChk" checked={this.state.saveNewVersion || this.state.currentVersion === null} onChange={this.onCheckNewVersion} />
										새 버전으로 저장
									</label>
									<a className={SaveSOPOptions.cssStyles.blu} onClick={() => this.onClickApply(true)}>저장</a>
									<a className={SaveSOPOptions.cssStyles.clickable} onClick={() => this.onClickApply(false)}>취소</a>
								</div>
							</div>
						</div>
					</div>
				</div>

				{
					/* alert창 대신 사용 */
					this.state.confirmMessage.visible &&
					<ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
				}
			</div>
		);
	}
}

export default SaveSOPOptions;