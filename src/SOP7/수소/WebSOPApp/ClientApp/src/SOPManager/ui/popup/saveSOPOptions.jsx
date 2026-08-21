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

import { SaveSOPOptionsComponent } from '../../styled/sopManagerStyled';
import { i18n, withTranslation } from '../../../language/i18n';

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
			loadingMessage: i18n.t('버전 정보를 조회 중입니다'),
			prevProps: this.props
		};

		this.refTextNewVersionName = React.createRef();
		this.refTextNewVersionDescription = React.createRef();
		this.refCheckNewVersion = React.createRef();
	}

	static getDerivedStateFromProps(props, state) {
		if (props === state.prevProps) {
			return state;
		}

		// if (state.instance) {
		// 	state.instance.getVersions(props.sopData);
		// }

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
			this.props.content(SopManagerResource.menu.SOP_편집, this.state.sopData);
			this.setState({ loading: false });
			//this.setState({ loadingMessage: message });
			// return;
		}
		else {
			this.setState({ versions: disasterVersions.versions, currentVersion: disasterVersions.currentVersion, loading: false });
		}
	}

	onClickCancle = () => {
		this.onClickApply(false);
		this.props.onCloseConfirmDialog();
	}

	onCheckNewVersion = (event) => {
		this.setState({ saveNewVersion: event.target.checked });
	}

	onClickClose() {
		this.props.content(SopManagerResource.menu.SOP_편집, this.state.sopData);
	}

	onClickApply(ok) {
		if (ok) {
			if (this.refCheckNewVersion.current.checked) {
				const newVersionName = this.refTextNewVersionName.current.value.toString().trim();

				if (newVersionName.length === 0) {
					alert(i18n.t('sopManager.formText.저장할 버전 이름을 입력하세요'));
					return;
				}

				this.state.sopData.version = SopDataManager.makeNewVersion(this.state.isNormal, newVersionName, this.props.loginUser ? this.props.loginUser.id : -1, this.refTextNewVersionDescription.current.value.toString().trim());
				this.props.content(SopManagerResource.menu.저장, this.state.sopData);
				return;
            }

			if (this.state.selectedVersion) {
				this.state.sopData.version.id = this.state.selectedVersion.id;
				this.state.sopData.version.isNormal = this.state.selectedVersion.isNormal;
				this.props.content(SopManagerResource.menu.저장, this.state.sopData);
			}
			else {
				alert(i18n.t('sopManager.formText.SOP 버전을 선택하세요'));
            }
		}
		else {
			this.props.content(SopManagerResource.menu.SOP_편집, this.state.sopData);
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
				row.classList.remove('on');
			}
		}

		tr.classList.add('on');
		const saveNewVersion = version === null || version === undefined;

		this.setState({ selectedVersion: version, saveNewVersion: saveNewVersion });
	};

	onChangeSopMode(isNormal) {
		this.getDisasterVersions(isNormal);
	}

	async getDisasterVersions(isNormal) {
		const [disasterVersions, message] = await SopController.requestDisasterVersions(this.state.sopData, isNormal);

		if (disasterVersions === null) {
			alert(message);
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
			<SaveSOPOptionsComponent id={'sopPop'}>
				<div>
					<div>
						<div className={'spPop sopSave'}>
							<div className={'sppTop'}>
								<h4>{i18n.t('sopManager.formText.DB 저장')}</h4>
								<a className={'clickable'} onClick={() => this.onClickClose()}>{i18n.t('common.닫기')}</a>
							</div>
							{/*<div className={'sppSel'}>*/}
							{/*	<label className={'clickable'}>*/}
							{/*		<input type="radio" name="sppSel" className={'labelInput'} checked={this.state.isNormal} onChange={() => this.onChangeSopMode(true)} />*/}
							{/*		{i18n.t('sopManager.formText.평일모드')}*/}
							{/*	</label>*/}
							{/*	<label className={'clickable'}>*/}
							{/*		<input type="radio" name="sppSel" className={'labelInput'} checked={!this.state.isNormal} onChange={() => this.onChangeSopMode(false)} />*/}
							{/*		{i18n.t('sopManager.formText.야간 및 휴일모드')}*/}
							{/*	</label>*/}
							{/*</div>*/}
							<div className={'sppCont2'}>
								<div className="scroll-wrapper scrollbar-outer" id="pos_relative">
									<div className="scrollbar-outer scroll-content" id="saveSOP_scrollContent">
										<div className={'spprCont'}>
											<table className={'scTb'}>
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
														<th>{i18n.t('sopManager.formText.버전명')}</th>
														<th>{i18n.t('sopManager.formText.작성자')}</th>
														<th>{i18n.t('sopManager.formText.생성일자')}</th>
														<th>{i18n.t('sopManager.formText.수정일자')}</th>
														<th>{i18n.t('sopManager.formText.부가설명')}</th>
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
																<td className={'tal'}>{this.state.currentVersion.description}</td>
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
								<div className={'spprBot'}>
									<label className={'clickable'} style={{ display: "none" }} >
										<input ref={this.refCheckNewVersion} type="checkbox" className={'labelInput'} name="" id="popChk" checked={ this.state.saveNewVersion || this.state.currentVersion === null } onChange={this.onCheckNewVersion} />
										{i18n.t('sopManager.formText.새 버전으로 저장')}
									</label>
									<a className={'blu'} onClick={() => this.onClickApply(true)}>{i18n.t('common.저장')}</a>
									<a className={'clickable'} onClick={() => this.onClickApply(false)}>{i18n.t('common.취소')}</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</SaveSOPOptionsComponent>
		);
	}
}

export default withTranslation()(SaveSOPOptions);