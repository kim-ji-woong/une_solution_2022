import React, { Component } from 'react';
import styles from '../../../Common/css/style.module.css';
import bodyStyles from '../../css/body.module.css';
import '../../css/componentProperty.css';
import '../../../Common/css/scroll.css';
import commonStyles from '../../../Common/css/common.module.css';
import SectionDataInternal from '../../../Common/models/sections/sectionDataInternal';

import Receiver from '../../../Common/models/sections/receiver';
import TreeView from '../../../TeamEditor/ui/utility/treeview';
import TreeData from '../../../TeamEditor/ui/utility/treedata';
import { TeamEditController } from '../../../TeamEditor/services/teamEditController';
import SectionData from '../../../Common/models/sections/sectionData';
import TreeNode from '../../../TeamEditor/ui/utility/treenode';
import SopDataManager from '../../services/sopDataManager';
import SpecialMessageParameter from '../../../Common/js/specialMessageParameter';
import SopController from '../../services/sopController';

import SettingsStore from '../../../Settings/settingsStore';
import SopManagerResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';

class InternalProperty extends Component {
	static cssStyles = styles;

	static SMS_Type = 0;
	static Broadcast_Type = 1;
	static Email_Type = 2;

	constructor(props) {
		super(props);
		this.props = props;

		const sectionData = new SectionDataInternal();

		if (this.props.sectionData) {
			SectionDataInternal.copyTo(this.props.sectionData, sectionData);
		}

		this.state = {
			instance: this,
			sectionData: sectionData,
			teamType: SopController.getDefaultTeamType(this.props.sectionData),
			teamTreeData: null,
			teamAllTreeDatas: { ...props.teamAllTreeDatas },
			receiverName: sectionData.receiverName ? sectionData.receiverName : "",
			messagePreview: "",
			selectedTeam: null,
			receiversOn: false,
			messagesOn: false,
			includeChildTeams: false,
			/*autoRun: sectionData.autoRun,*/
			curLanguage: i18n.language.toString(),
			prevProps: this.props
		}

		this.refReceivers = React.createRef();
		this.refMessages = React.createRef();
		this.refMessage = React.createRef();
		this.refCheckIncludeChildTeams = React.createRef();
		this.refTitle = React.createRef();
		this.refCheckAutoRun = React.createRef();

		this.canceled = false;
	}

	componentWillUnmount() {
		// 창이 닫히게 될 경우 편집한 내용을 저장한다.
		if (!this.canceled) {
			this.saveSectionData(true);
		}
	}

	static getDerivedStateFromProps(props, state) {
		if (props === state.prevProps) {
			return state;
		}

		if (props.sectionData !== state.prevProps.sectionData && state.sectionData) {
			// 다른 Process를 선택하여 창이 바뀌게 될 경우 편집한 내용을 저장한다.
			state.instance.saveSectionData(true);
		}

		let sectionData = new SectionDataInternal();

		if (props.sectionData) {
			SectionDataInternal.copyTo(props.sectionData, sectionData);
		}

		state.instance.refTitle.current.value = state.instance.refTitle.current.text = i18nUtil.convertText(sectionData.text);
		state.instance.refMessage.current.value = state.instance.refMessage.current.text = i18nUtil.convertText(sectionData.message);

		if (sectionData.removed) {
			sectionData = null;
		}

		return {
			instance: state.instance,
			sectionData: sectionData,
			teamType: SopController.getDefaultTeamType(props.sectionData),
			teamTreeData: null,
			teamAllTreeDatas: { ...props.teamAllTreeDatas },
			receiverName: sectionData?.receiverName ? sectionData?.receiverName : "",
			messagePreview: "",
			selectedTeam: null,
			receiversOn: state.receiversOn,
			messagesOn: state.messagesOn,
			includeChildTeams: state.includeChildTeams,
			/*autoRun: sectionData.autoRun,*/
			prevProps: props
		};
	}

	componentDidUpdate(prevProps, prevState) {
		// 다른 컴포넌트 선택시 수신자 탭 열려 있다면 트리 데이터 재조회 필요함
		if (prevProps.sectionData !== this.props.sectionData) {
			if (this.state.receiversOn) {
				this.slideCascade(this.refReceivers.current, true);
			}
		}
	}

	onClickCascade = (event) => {
		this.slideCascade(event.target);
	}

	// bLoad => 로드시 트리 Team 조회를 위한 값
	async slideCascade(element, bLoad) {
		let teamTreeDatas = null;
		let receiversOn = this.state.receiversOn;
		let messagesOn = this.state.messagesOn;

		let selectedSiteID = SettingsStore.getState().selectSiteID;
		if (!selectedSiteID) {
			selectedSiteID = null;
		}
		else if (selectedSiteID === ProjectResource.Site.GG_A) {
			selectedSiteID = this.props.selectedSiteID;
		}

		const teamAllTreeDatas = { ...this.state.teamAllTreeDatas };

		if (element === this.refReceivers.current) {
			if (!bLoad && element.classList.contains(InternalProperty.cssStyles.on)) {
				receiversOn = false;
			}
			else {
				if (!bLoad) {
					receiversOn = true;
					messagesOn = false;
				}

				if (this.state.teamType === Receiver.RegularTeam) {
					teamTreeDatas = await TeamEditController.DisplayRegular(selectedSiteID);
					SopDataManager.setTeamTreeDataChecked(teamTreeDatas, this.state.sectionData?.receivers, Receiver.RegularTeam);
					teamAllTreeDatas.regular = teamTreeDatas;
				}
				else if (this.state.teamType === Receiver.TemporaryNormalTeam) {
					teamTreeDatas = await TeamEditController.DisplayTemporary(true, selectedSiteID);
					SopDataManager.setTeamTreeDataChecked(teamTreeDatas, this.state.sectionData?.receivers, Receiver.TemporaryNormalTeam);
					teamAllTreeDatas.normal = teamTreeDatas;
				}
				else if (this.state.teamType === Receiver.TemporaryEmergencyTeam) {
					teamTreeDatas = await TeamEditController.DisplayTemporary(false, selectedSiteID);
					SopDataManager.setTeamTreeDataChecked(teamTreeDatas, this.state.sectionData?.receivers, Receiver.TemporaryEmergencyTeam);
					teamAllTreeDatas.emergency = teamTreeDatas;
				}
            }
		}
		else {
			if (element.classList.contains(InternalProperty.cssStyles.on)) {
				messagesOn = false;
			}
			else {
				receiversOn = false;
				messagesOn = true;
			}
		}

		if (ProjectResource.treeCascadeMode() === TreeNode.Checkbox_RelativeUse) {
			TreeData.setRelativeDefaultCheck(teamTreeDatas);
		}

		this.setState({ teamTreeData: teamTreeDatas, teamAllTreeDatas, receiversOn, messagesOn });
	}

	getReceiversClassName() {
		if (this.state.receiversOn) {
			return InternalProperty.cssStyles.on;
		}

		return "";
	}

	getMessagesClassName() {
		if (this.state.messagesOn) {
			return InternalProperty.cssStyles.on;
		}

		return "";
	}

	onCheckIncludeChildTeam = (event) => {
		this.setState({ includeChildTeams: event.target.checked });
	}

	onChangeAutoRun = (event) => {
		if (this.state.sectionData) {
			const sectionData = { ...this.state.sectionData };
			sectionData.autoRun = event.target.checked;
			this.setState({ sectionData });
		}

		//this.setState({ autoRun: event.target.checked });
    }

	onChangeMode(event, mode) {
		const sectionData = { ...this.state.sectionData };
		const checked = event.target.checked ? true : false;

		if (mode === InternalProperty.SMS_Type) {
			sectionData.isSMS = checked;
		}
		else if (mode === InternalProperty.Broadcast_Type) {
			sectionData.isBroadcast = checked;
		}
		else if (mode === InternalProperty.Email_Type) {
			sectionData.isEmail = checked;
		}

		this.setState({ sectionData: sectionData });
	}

	onChangeTeamMode(teamType) {
		this.changeTeamMode(teamType);
	}

	async changeTeamMode(teamType) {
		let teamTreeDatas = null;
		const teamAllTreeDatas = { ...this.state.teamAllTreeDatas };

		const selectedSiteID = SettingsStore.getState().selectSiteID;
		if (!selectedSiteID)
			selectedSiteID = null;

		if (teamType === Receiver.RegularTeam) {
			teamTreeDatas = await TeamEditController.DisplayRegular(selectedSiteID);
			SopDataManager.setTeamTreeDataChecked(teamTreeDatas, this.state.sectionData?.receivers, Receiver.RegularTeam);
			teamAllTreeDatas.regular = teamTreeDatas;
		}
		else if (teamType === Receiver.TemporaryNormalTeam) {
			teamTreeDatas = await TeamEditController.DisplayTemporary(true, selectedSiteID);
			SopDataManager.setTeamTreeDataChecked(teamTreeDatas, this.state.sectionData?.receivers, Receiver.TemporaryNormalTeam);
			teamAllTreeDatas.normal = teamTreeDatas;
		}
		else if (teamType === Receiver.TemporaryEmergencyTeam) {
			teamTreeDatas = await TeamEditController.DisplayTemporary(false, selectedSiteID);
			SopDataManager.setTeamTreeDataChecked(teamTreeDatas, this.state.sectionData?.receivers, Receiver.TemporaryEmergencyTeam);
			teamAllTreeDatas.emergency = teamTreeDatas;
		}

		this.setState({ teamTreeData: teamTreeDatas, teamAllTreeDatas, teamType });
	}

	onTreeNodeChanged = (team, event) => {
		if (event === undefined) {
			if (this.state.selectedTeam !== team) {
				this.setState({ selectedTeam: team });
			}
		}
		else if (event.type === TreeView.EventCheckedChanged) {
			this.onTreeNodeCheckedChanged(team, this.state.teamType);
		}
	}

	onTreeNodeCheckedChanged(team, teamType) {
		if (team) {
			let receivers = this.state.sectionData.receivers;

			if (!receivers) {
				this.state.sectionData.receivers = [];
				receivers = this.state.sectionData.receivers;
			}

			if (receivers) {
				/*if (team.checked === TreeNode.CHECKED_NONE) {
					this.removeReceiver(receivers, team.ID, teamType);
				}
				else if (team.checked === TreeNode.CHECKED_ALL) {
					this.addReceiver(receivers, team.ID, teamType);
				}*/

				receivers.splice(0, receivers.length);
				this.setReceiver(receivers, this.state.teamTreeData);
				const receiverName = SopDataManager.getReceiverText(this.state.sectionData.receivers, this.state.teamAllTreeDatas);

				if (receiverName !== this.state.receiverName) {
					this.setState({ receiverName });
				}
			}
		}
	}

	setReceiver(receivers, teamTreeData) {
		for (const treeData of teamTreeData) {
			if (treeData.checked) {
				receivers.push({
					teamType: this.state.teamType,
					teamID: treeData.ID
				});
			}

			this.setReceiver(receivers, treeData.Children);
		}
	}

	removeReceiver(receivers, teamID, teamType) {
		const receiverCount = receivers.length;

		for (let i = 0; i < receiverCount; i++) {
			const receiver = receivers[i];

			if (receiver.teamType === teamType && receiver.teamID == teamID) {
				receivers.splice(i, 1);
				break;
			}
		}
	}

	addReceiver(receivers, teamID, teamType) {
		const receiverCount = receivers.length;

		for (let i = 0; i < receiverCount; i++) {
			const receiver = receivers[i];

			if (receiver.teamType === teamType && receiver.teamID == teamID) {
				// 이미 존재한다.
				return;
			}
		}

		const receiver = { teamType, teamID };
		receivers.push(receiver);
	}

	onTitleChange = (event) => {
	}

	onMessageChange = (event) => {
    }

	onClickApply(ok) {
		if (ok) {
			this.saveSectionData(true);
			// 확인 버튼을 누르면 강제로 초기화 시키도록 한다.
			this.props.onClickCancel();
		}
		else {
			this.setState({
				sectionData: null,
				teamType: SopController.getDefaultTeamType(this.props.sectionData),
				teamTreeData: null,
				selectedTeam: null,
				receiversOn: false,
				missionsOn: false,
				includeChildTeams: false
			});

			this.canceled = true;
			this.props.onClickCancel();
		}
	}

	saveSectionData(shouldUpdate) {
		const sectionData = { ...this.state.sectionData };
		//sectionData.receiver = this.refReceivers.current.value;
		sectionData.receiverName = this.state.receiverName;
		sectionData.text = i18nUtil.convertJsonByLanguage(this.state.curLanguage, sectionData.text, this.refTitle.current.value);
		sectionData.message = i18nUtil.convertJsonByLanguage(this.state.curLanguage, sectionData.message, this.refMessage.current.value);
		sectionData.autoRun = this.refCheckAutoRun.current.checked;

		if (this.state.teamTreeData) {
			sectionData.receivers = TreeData.teamTreeDataToReceivers(this.state.teamTreeData, Receiver.RegularTeam);
		}

		this.props.onApplyComponentProperty(sectionData, this.props.actionStep, shouldUpdate);
	}

	onClickPreview = () => {
		const message = this.refMessage.current.value.trim();

		if (message.length === 0) {
			return;
		}

		this.processPreview(message);
	}

	onClearPreview = () => {
		this.setState({ messagePreview: "" });
    }

	async processPreview(message) {
		const param = new SpecialMessageParameter();
		param.message = message;
		param.location = i18n.t('sopManager.formText.재난 발생 위치');

		const [resultMessage, errorMessage] = await SopController.requestParseSpecialMessage(param);

		if (resultMessage !== null) {
			this.setState({ messagePreview: resultMessage });
		}
		else if (errorMessage !== null && errorMessage.length > 0) {
			alert(errorMessage);
        }
    }

	render() {
		const autoRun = this.state.sectionData?.autoRun ? true : false;

		return (
			<div className={InternalProperty.cssStyles.sprCont}>
				<div className={InternalProperty.cssStyles.sprTop}>
					<div className={InternalProperty.cssStyles.sprtTitle}>
						<h4>{i18n.t('sopManager.formText.전파 내용 입력')}</h4>
						<p>
							<label className={InternalProperty.cssStyles.clickable}>
								<input ref={this.refCheckAutoRun} type="checkbox" name="smsChk" className={bodyStyles.labelInput} id={InternalProperty.cssStyles.smsChk} checked={autoRun} onChange={this.onChangeAutoRun} />
								{i18n.t('sopManager.formText.자동실행')}
							</label>
						</p>
					</div>
					<dl className={InternalProperty.cssStyles.sprtIpt}>
						<dt>{i18n.t('sopManager.formText.제목')}</dt>
						<dd><input ref={this.refTitle} type="text" defaultValue={i18nUtil.convertText(this.state.sectionData?.text)} onChange={this.onTitleChange} /></dd>
					</dl>
					<dl className={InternalProperty.cssStyles.sprtIpt}>
						<dt>{i18n.t('sopManager.formText.수신자')}</dt>
						<dd>
							<div className={"scroll-wrapper " + InternalProperty.cssStyles.sprtTxt + " scrollbar-outer scroll-textarea"} id="pos_relative">
								<div className="scroll-content" id="internal_scrollContent">
									<textarea cols="30" rows="10" className={InternalProperty.cssStyles.sprtTxt + " scrollbar-outer"} value={this.state.receiverName} onChange={() => {}}></textarea>
								</div>
								<div className="scroll-element scroll-x">
									<div className="scroll-element_outer">
										<div className="scroll-element_size">
										</div><div className="scroll-element_track">
										</div><div className="scroll-bar" id="width_100px">
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
						</dd>
					</dl>
				</div>
				<div className={InternalProperty.cssStyles.sprMid}>
					<div className="scroll-wrapper scrollbar-outer" id="pos_relative">
						<div className="scrollbar-outer scroll-content" id="internal_scrollContent2">
							<div className={InternalProperty.cssStyles.sprmCont}>
								<dl className={InternalProperty.cssStyles.sprmAcdn}>
									<dt ref={this.refReceivers} className={this.getReceiversClassName()} onClick={this.onClickCascade}>{i18n.t('sopManager.formText.수신자')}</dt>
									<dd className={this.getReceiversClassName()}>
										<div className={InternalProperty.cssStyles.sprmSms}>
											<label className={InternalProperty.cssStyles.clickable}>
												<input type="checkbox" name="sprmSms" className={bodyStyles.labelInput} id={InternalProperty.cssStyles.sprmSms01} checked={this.state.sectionData?.isSMS} onChange={(event) => this.onChangeMode(event, InternalProperty.SMS_Type)} />
												{i18n.t('sopManager.formText.문자발송')}
											</label>
											<label className={InternalProperty.cssStyles.clickable}>
												<input type="checkbox" name="sprmSms" className={bodyStyles.labelInput} id={InternalProperty.cssStyles.sprmSms02} checked={this.state.sectionData?.isBroadcast} onChange={(event) => this.onChangeMode(event, InternalProperty.Broadcast_Type)} />
												{i18n.t('sopManager.formText.방송전파')}
											</label>
											<label className={InternalProperty.cssStyles.clickable}>
												<input type="checkbox" name="sprmSms" className={bodyStyles.labelInput} id={InternalProperty.cssStyles.sprmSms02} checked={this.state.sectionData?.isEmail} onChange={(event) => this.onChangeMode(event, InternalProperty.Email_Type)} />
												{i18n.t('sopManager.formText.메일발송')}
											</label>
										</div>
										<div className={InternalProperty.cssStyles.sprmTeam}>
											<ul className={InternalProperty.cssStyles.sprmRdo}>
												<li>
													<label className={InternalProperty.cssStyles.clickable}>
														<input type="radio" name="sprmRdo" className={bodyStyles.labelInput} id={InternalProperty.cssStyles.sprmRdo01} checked={this.state.teamType === Receiver.RegularTeam} onChange={() => this.onChangeTeamMode(Receiver.RegularTeam)} />
														{i18n.t('sopManager.formText.정규조직')}
													</label>
												</li>
												<li>
													<label className={InternalProperty.cssStyles.clickable}>
														<input type="radio" name="sprmRdo" className={bodyStyles.labelInput} id={InternalProperty.cssStyles.sprmRdo02} checked={this.state.teamType === Receiver.TemporaryNormalTeam} onChange={() => this.onChangeTeamMode(Receiver.TemporaryNormalTeam)} />
														{i18n.t('sopManager.formText.평일 비상조직')}
													</label>
												</li>
												<li>
													<label className={InternalProperty.cssStyles.clickable}>
														<input type="radio" name="sprmRdo" className={bodyStyles.labelInput} id={InternalProperty.cssStyles.sprmRdo03} checked={this.state.teamType === Receiver.TemporaryEmergencyTeam} onChange={() => this.onChangeTeamMode(Receiver.TemporaryEmergencyTeam)} />
														{i18n.t('sopManager.formText.야간/휴일 비상조직')}
													</label>
												</li>
											</ul>
											<TreeView treeViewID="sopInternalTree" treeViewHeight={250} teamTreeData={this.state.teamTreeData} onTreeNodeChanged={this.onTreeNodeChanged} useCheckBox={ProjectResource.treeCascadeMode()} />
										</div>
									</dd>
									<dt ref={this.refMessages} className={this.getMessagesClassName()} onClick={this.onClickCascade}>{i18n.t('sopManager.formText.전파 내용')}</dt>
									<dd className={this.getMessagesClassName()}>
										<div className={InternalProperty.cssStyles.sprmSprd}>
											<h5>{i18n.t('sopManager.formText.전파 내용')}</h5>
											<div className={"scroll-wrapper " + InternalProperty.cssStyles.sprmSpTxt + " scrollbar-outer scroll-textarea"} id="pos_relative">
												<div className="scroll-content" id="internal_scrollContent3">
													<textarea ref={this.refMessage} name="" id="" cols="30" rows="10" className={InternalProperty.cssStyles.sprmSpTxt + " scrollbar-outer"} defaultValue={i18nUtil.convertText(this.state.sectionData?.message)} onChange={this.onMessageChange}></textarea>
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
										</div>
										<div className={InternalProperty.cssStyles.sprmSprd}>
											<h5>{i18n.t('sopManager.formText.미리보기')}</h5>
											<div className={"scroll-wrapper " + InternalProperty.cssStyles.sprmSpTxt + " scrollbar-outer scroll-textarea"} id="pos_relative">
												<div className="scroll-content" id="internal_scrollContent3">
													<textarea name="" id="" cols="30" rows="10" className={InternalProperty.cssStyles.sprmSpTxt + " scrollbar-outer"} value={this.state.messagePreview} onChange={() => {}}></textarea>
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
										</div>
										<div className={InternalProperty.cssStyles.sprmSpBtn}>
											{
											/*<a href="#" className={InternalProperty.cssStyles.sprmSpPly}>재생</a>
											<a href="#" className={InternalProperty.cssStyles.sprmSpStp}>정지</a>*/
											}
											<a className={InternalProperty.cssStyles.sprmSpOk + " " + InternalProperty.cssStyles.clickable} onClick={this.onClearPreview}>{i18n.t('common.확인')}</a>
											<a className={InternalProperty.cssStyles.sprmSpApy + " " + InternalProperty.cssStyles.clickable} onClick={this.onClickPreview}>{i18n.t('sopManager.formText.적용')}</a>
										</div>
									</dd>
								</dl>
							</div>
						</div>
						<div className="scroll-element scroll-x">
							<div className="scroll-element_outer">
								<div className="scroll-element_size">
								</div>
								<div className="scroll-element_track"></div>
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
								<div className="scroll-bar" id="height_100px_top0">
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={InternalProperty.cssStyles.sprBot}>
					<a className={InternalProperty.cssStyles.clickable} onClick={() => this.onClickApply(true)}>{i18n.t('common.확인')}</a>
					<a className={InternalProperty.cssStyles.clickable} onClick={() => this.onClickApply(false)}>{i18n.t('common.취소')}</a>
				</div>
			</div>
        );
    }
    /*constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            sectionData: this.props.sectionData
        }

        this.refSMS = React.createRef();
        this.refBroadcast = React.createRef();
        this.refTitle = React.createRef();
        this.refReceiver = React.createRef();
        this.refText = React.createRef();
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.sectionData !== nextProps.sectionData) {
            this.setState({ sectionData: nextProps.sectionData });
        }
    }

    onApplyComponentProperty = () => {
        const sectionData = { ...this.state.sectionData };
        sectionData.message = this.refText.current.value;
        sectionData.receiver = this.refReceiver.current.value;
        sectionData.text = this.refTitle.current.value;

        this.props.onApplyComponentProperty(sectionData, this.props.actionStep);
    }

    onChange(isSMS) {
        const sectionData = { ...this.state.sectionData };
        sectionData.isSMS = isSMS;
        this.setState({ sectionData });
    }

    onChangeTitle = (event) => {
        const sectionData = { ...this.state.sectionData };
        sectionData.text = event.target.value;
        this.setState({ sectionData });
    }

    onChangeReceiver = (event) => {
        const sectionData = { ...this.state.sectionData };
        sectionData.receiver = event.target.value;
        this.setState({ sectionData });
    }

    onChangeText = (event) => {
        const sectionData = { ...this.state.sectionData };
        sectionData.message = event.target.value;
        this.setState({ sectionData });
    }

    render() {
        return (
            <>
                <div className="componentProperties">
                    <span className="componentType">상황전파</span>
                    <div className="internalProperty">
                        <div>
                            <label>제목</label>
                            <input ref={this.refTitle} className="processText" type="text" size="20" onChange={this.onChangeTitle} value={this.state.sectionData.text} />
                        </div>

                        <div>
                            <label>수신자</label>
                            <input ref={this.refReceiver} className="processText" type="text" size="20" onChange={this.onChangeReceiver} value={this.state.sectionData.receiver} />
                        </div>
                        <div className="isSMS">
                            <div>
                                <input ref={this.refSMS} type="radio" id="sms" name="sms" onChange={() => this.onChange(true)} checked={this.state.sectionData.isSMS === true} />
                                <label htmlFor="sms">문자메시지</label>
                            </div>

                            <div className="optionItem">
                                <input ref={this.refBroadcast} type="radio" id="broadcast" name="broadcast" onChange={() => this.onChange(false)} checked={this.state.sectionData.isSMS === false} />
                                <label htmlFor="broadcast">방송</label>
                            </div>
                        </div>
                        <div>
                            <textarea ref={this.refText} className="missionText" value={this.state.sectionData.message} onChange={this.onChangeText}/>
                        </div>
                    </div>
                </div>
                <button className="btnApply" onClick={this.onApplyComponentProperty}>적용</button>
            </>
        );
    }*/
}

export default withTranslation()(InternalProperty);