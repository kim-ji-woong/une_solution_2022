import React, { Component } from 'react';
import styles from '../../../Common/css/style.module.css';
import bodyStyles from '../../css/body.module.css';
import SopController from '../../services/sopController';
import '../../../Common/css/scroll.css';

import fire_icon from '../../image/fire.png';
import etc_icon from '../../image/etc.png';
import explosion_icon from '../../image/explosion.png';
import natureDisaster_icon from '../../image/natureDisaster.png';
import pollution_icon from '../../image/pollution.png';
import security_icon from '../../image/security.png';
import terror_icon from '../../image/terror.png';
import lifesaving_icon from '../../image/lifesaving.png';
import earthquake_icon from '../../image/earthquake.png';
import strongwind_icon from '../../image/strongwind.png';
import blackout_icon from '../../image/blackout.png';
import becon_icon from '../../image/becon.png';
import environment_icon from '../../image/environment.png';
import manufacture_icon from '../../image/manufacture.png';
import highTemp_icon from '../../image/highTemp.png';
import tank_icon from '../../image/tank.png';


import SopManagerResource from '../../resource/id';

import { NewSOPOptionsComponent } from '../../styled/sopManagerStyled';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';

import ProjectResource from '../../../Root/resource/id';


class NewSOPOptions extends Component {
	static cssStyles = styles;

	constructor(props) {
		super(props);

		this.props = props;

		this.state = {
			isNormal: true,
			normalDisasterCategories: [],
			abnormalDisasterCategories: [],
			disasterCategories: [],
			subDisasterCategories: [],
			disasterDatas: [],
			selectedDisasterCategory: null,
			selectedSubDisasterCategory: null,
			selectedDisaster: null,
			newSubDisasterCategory: null,
			newDisaster: null,
			loading: true,
			loadingMessage: i18n.t('sopManager.formText.데이터를 불러오고 있습니다'),
			showSites: false,
			siteName: '종합방재실',
		}

		this.refNewSDC = React.createRef();
		this.refNewSDCRadio = React.createRef();
		this.refNewDisaster = React.createRef();
		this.refNewDisasterRadio = React.createRef();
	}

	componentDidMount() {
		this.onSelectSopMode(null, this.state.isNormal);
	}

	componentDidUpdate(prevProps) {
		if (ProjectResource.SiteID === ProjectResource.Site.GG_A && prevProps.selectedSiteID !== this.props.selectedSiteID) {
			this.onSelectSopMode(null, true);
		}
	}
	
	async getDisasterCategories(isNormal) {
		const [disasterCategories, message] = await SopController.disasterCategories(isNormal, this.props.selectedSiteID);

		if (disasterCategories) {
			if (isNormal) {
				this.setState({ loading: false, isNormal: isNormal, normalDisasterCategories: disasterCategories, disasterCategories: disasterCategories });
			}
			else {
				this.setState({ loading: false, isNormal: isNormal, abnormalDisasterCategories: disasterCategories, disasterCategories: disasterCategories });
            }
		}
		else {
			this.setState({ loadingMessage: message, isNormal: isNormal});
        }
	}

	onSelectSopMode(event, isNormal) {
		if (event) {
			const childCount = event.target.parentNode.children.length;
			let inputCount = 0;

			for (let i = 0; i < childCount; i++) {
				const child = event.target.parentNode.children[i];
				if (child.tagName === "INPUT") {
					inputCount++;

					if (isNormal === false && inputCount === 1) {
						continue;
					}

					child.checked = true;
					break;
				}
			}
		}

		// 항상 DB를 읽어오는 방식으로 바꾼다.
		this.getDisasterCategories(isNormal);
		/* if (isNormal) {
			if (this.state.normalDisasterCategories && this.state.normalDisasterCategories.length > 0) {
				this.setState({ isNormal: isNormal, disasterCategories: this.state.normalDisasterCategories });
			}
			else {
				this.getDisasterCategories(isNormal);
			}
		}
		else {
			if (this.state.abnormalDisasterCategories && this.state.abnormalDisasterCategories.length > 0) {
				this.setState({ isNormal: isNormal, disasterCategories: this.state.abnormalDisasterCategories });
			}
			else {
				this.getDisasterCategories(isNormal);
			}
        } */
	}

	onSelectDisasterCategory(disasterCategoryData) {
		this.refNewSDC.current.value = '';
		this.refNewDisaster.current.value = '';
		this.refNewSDCRadio.current.checked = false;
		this.refNewDisasterRadio.current.checked = false;

		this.setState(
			{
				selectedDisasterCategory: disasterCategoryData,
				selectedSubDisasterCategory: null,
				selectedDisaster: null,
				subDisasterCategories: disasterCategoryData.subDisasterCategories,
				disasterDatas: [],
				newSubDisasterCategory: null,
				newDisaster: null
			}
		);
	}

	onSelectSubDisasterCategory(event, subDisasterCategoryData) {
		if (event) {
			const childCount = event.target.parentNode.children.length;

			for (let i = 0; i < childCount; i++) {
				const child = event.target.parentNode.children[i];
				if (child.tagName === "INPUT") {
					child.checked = true;
					break;
                }
            }
		}

		this.refNewDisaster.current.value = '';
		this.refNewDisasterRadio.current.checked = false;

		this.setState(
			{
				selectedSubDisasterCategory: subDisasterCategoryData,
				selectedDisaster: null,
				disasterDatas: subDisasterCategoryData.disasterDatas,
				newDisaster: null,
			}
		);
	}

	onSelectNewSubDisasterCategory() {
		const sdc = {
			subDisasterCategory:
			{
				id: -1,
				disasterCategoryID: this.state.selectedDisasterCategory ? this.state.selectedDisasterCategory.id : -1,
				subCategoryName: ''
			},
			disasterDatas: []
		};

		this.refNewDisaster.current.value = '';
		this.refNewDisasterRadio.current.checked = false;

		this.setState(
			{
				selectedSubDisasterCategory: sdc,
				selectedDisaster: null,
				newSubDisasterCategory: sdc,
				newDisaster: null,
				disasterDatas: sdc.disasterDatas
			}
		);
	}

	onSelectDisaster(event, disasterData) {
		if (event) {
			const childCount = event.target.parentNode.children.length;

			for (let i = 0; i < childCount; i++) {
				const child = event.target.parentNode.children[i];
				if (child.tagName === "INPUT") {
					child.checked = true;
					break;
				}
			}
		}

		this.setState(
			{
				selectedDisaster: disasterData
			}
		);
	}

	onSelectNewDisaster() {
		const newDisaster = {
			disaster:
			{
				id: -1,
				disasterName: "",
				subDisasterCategoryID: this.state.selectedSubDisasterCategory?.subDisasterCategory?.id,
				versionID: -1,
				userLevelIDs: null,
				description: null
			},
			actionSteps: [],
			version:
			{
				id: -1,
				isNormal: this.state.isNormal,
				createTime: null,
				lastAccessTime: null,
				versionName: "",
				ownerID: -1,
				description: -1
            }
		};

		this.setState(
			{
				selectedDisaster: newDisaster,
				newDisaster: newDisaster
			}
		);
	}

	getLastDisaster(disasterDatas) {
		if (disasterDatas) {
			const count = disasterDatas.length;

			for (let i = count-1; i >= 0; i--) {
				const disasterData = { ...disasterDatas[i] };

				if (disasterData.version) {
					disasterData.version = { ...disasterData.version };
					disasterData.version.isNormal = this.state.isNormal;
				}

				return disasterData;
            }
		}

		return null;
	}

	getSOPData() {
		if (this.state.selectedSubDisasterCategory === this.state.newSubDisasterCategory) {
			const sdcName = this.refNewSDC.current.value.trim();

			if (sdcName.length === 0) {
				alert(i18n.t('sopManager.formText.재난종류명을 입력하세요'));
				return null;
			}

			this.state.selectedSubDisasterCategory.subDisasterCategory.subCategoryName = sdcName;
		}

		let disasterData = this.state.selectedDisaster;

		if (disasterData === this.state.newDisaster) {
			const disasterName = this.refNewDisaster.current.value.trim();

			if (disasterName.length === 0) {
				alert(i18n.t('sopManager.formText.SOP 이름을 입력하세요'));
				return null;
			}

			disasterData.disaster.disasterName = disasterName;
			disasterData = {
				disasterName: disasterName,
				disasterDatas: [disasterData]
			};
		}

		const disaster = this.getLastDisaster(disasterData.disasterDatas);

		if (disaster === null) {
			alert(i18n.t('sopManager.formText.SOP 이름을 확인할 수 없습니다'));
			return;
		}

		disaster.version.owner = disaster.owner;

		const sopData = {
			disasterCategory: this.state.selectedDisasterCategory,
			subDisasterCategory: this.state.selectedSubDisasterCategory,
			disaster: disaster.disaster,
			version: disaster.version,
			actionStepDatas: disaster.actionSteps
		};

		return sopData;
	}

	onClickCancel() {
		// 원래 상태 그대로 돌려준다.
		this.props.content(SopManagerResource.menu.SOP_편집, this.props.sopData);
    }

	onClickApply() {
		if (!this.state.selectedDisasterCategory) {
			alert(i18n.t('sopManager.formText.재난분야를 선택하세요'));
			return;
		}
		else if (!this.state.selectedSubDisasterCategory) {
			alert(i18n.t('sopManager.formText.재난종류를 선택하세요'));
			return;
		}
		else if (!this.state.selectedDisaster) {
			alert(i18n.t('sopManager.formText.SOP를 선택하세요'));
			return;
		}

		const sopData = this.getSOPData();

		if (sopData?.actionStepDatas && sopData.actionStepDatas.length > 0) {
			this._checkStepMembers(sopData);
			//this.props.content(SopManagerResource.menu.SOP_편집, sopData);
		}
		else {
			this.addActionStepDatas(sopData);
        }
	}

	async addActionStepDatas(sopData) {
		const [actionStepDatas, message] = await SopController.requestDefaultActionStepDatas();

		if (actionStepDatas === null) {
			alert(message);
		}
		else {
			sopData.actionStepDatas = actionStepDatas;
			await this.checkStepMembers(sopData);
			this.props.content(SopManagerResource.menu.SOP_편집, sopData);
        }
	}

	async _checkStepMembers(sopData) {
		await this.checkStepMembers(sopData);
		this.props.content(SopManagerResource.menu.SOP_편집, sopData);
    }

	async checkStepMembers(sopData) {
		if (sopData) {
			const actionStepCount = sopData.actionStepDatas.length;

			for (let i = 0; i < actionStepCount; i++) {
				const actionStepData = sopData.actionStepDatas[i];

				if (actionStepData.stepMemberDatas.length === 0) {
					const [stepMemberData, message] = await SopController.requestDefaultStepMemberData(actionStepData, this.props.selectedSiteID);

					if (!stepMemberData) {
						alert(message);
						break;
					}
				}
			}
		}
	}

	getDisasterCategoryImage(disasterCategoryData) {
		const dcType = SopManagerResource.getDisasterCategoryType(i18nUtil.convertText(disasterCategoryData.disasterCategory.categoryName));

		if (dcType === SopManagerResource.disasterCategoryType.fire) {
			return fire_icon;
		}
		else if (dcType === SopManagerResource.disasterCategoryType.natureDisaster) {
			return natureDisaster_icon;
		}
		else if (dcType === SopManagerResource.disasterCategoryType.explosion) {
			return explosion_icon;
		}
		else if (dcType === SopManagerResource.disasterCategoryType.pollution) {
			return pollution_icon;
		}
		else if (dcType === SopManagerResource.disasterCategoryType.security) {
			return security_icon;
		}
		else if (dcType === SopManagerResource.disasterCategoryType.terror) {
			return terror_icon;
		}
		else if (dcType === SopManagerResource.disasterCategoryType.lifesaving) {
			return lifesaving_icon;
		}
		else if (dcType === SopManagerResource.disasterCategoryType.earthquake) {
			return earthquake_icon;
		}
		else if (dcType === SopManagerResource.disasterCategoryType.strongwind) {
			return strongwind_icon;
		}
		else if (dcType === SopManagerResource.disasterCategoryType.blackout) {
			return blackout_icon;
		}
		else if (dcType === SopManagerResource.disasterCategoryType.becon) {
			return becon_icon;
		}
		else if (dcType === SopManagerResource.disasterCategoryType.environment) {
			return environment_icon;
		}
		else if (dcType === SopManagerResource.disasterCategoryType.manufacture) {
			return manufacture_icon;
		}
		else if (dcType === SopManagerResource.disasterCategoryType.highTemp) {
			return highTemp_icon;
		}
		else if (dcType === SopManagerResource.disasterCategoryType.tank) {
			return tank_icon;
		}

		return etc_icon;
	}

	onChangeSubDisasterCategoryText() {
		if (this.refNewSDC.current) {
			const value = this.refNewSDC.current.value;

			if (value && value.length > 0) {
				if (this.refNewSDCRadio.current) {
					this.refNewSDCRadio.current.checked = true;
					this.onSelectNewSubDisasterCategory();
				}
			}
        }
	}

	onChangeDisasterText() {
		if (this.refNewDisaster.current) {
			const value = this.refNewDisaster.current.value;

			if (value && value.length > 0) {
				if (this.refNewDisasterRadio.current) {
					this.refNewDisasterRadio.current.checked = true;
					this.onSelectNewDisaster();
				}
			}
        }
    }

	onClickSite = (siteID) => {
		const sites = ProjectResource?.sites;

		if(sites.length > 1){
			for (let i = 0; i < sites?.length; i++) {
				const siteData = sites[i];

				if(siteID === siteData.id){
					this.setState({ 
						siteName: siteData.siteName, 
						showSites: false,
						selectedDisasterCategory: null,
						selectedSubDisasterCategory: null,
						selectedDisaster: null,
						disasterDatas: [],
						subDisasterCategories: []
					});
					this.props.onChangeSite(siteID);
				}
			}
		}
    }

	displaySite = () => {
		const sites = ProjectResource?.sites;
		let selectSiteUI_GG_SOP = [];

		if(sites.length > 1){
			for (let i = 0; i < sites?.length; i++) {
				const siteData = sites[i];

				selectSiteUI_GG_SOP.push(<li key={"selectSiteUI" + siteData.id} onClick={() => this.onClickSite(Number(siteData.id))}>{siteData.siteName}</li>);
			}
		}
		return [selectSiteUI_GG_SOP];
	}

	render() {
		if (this.state.loading) {
			return <h2>{this.state.loadingMessage}</h2>
		}

		const sdcClassName = this.state.selectedDisasterCategory ? "on" : "";
		const disasterClassName = this.state.selectedSubDisasterCategory ? "on" : "";
		const userInfo = ProjectResource.getUserInfo();
		const [selectSiteUI_GG_SOP] = this.displaySite();
		const siteName = this.state.siteName;

        return (
			<NewSOPOptionsComponent className={'speWrap'}>
				<div className={'speTop'}>
					<h3>{i18n.t('sopManager.menu.새 SOP')}</h3>
					<input type="radio" name="speTop" id={'speTop01'} checked={this.state.isNormal} onChange={() => this.onSelectSopMode(null, true)} /><label onClick={(event) => this.onSelectSopMode(event, true)}>{i18n.t('sopManager.formText.평일모드')}</label>
					<input type="radio" name="speTop" id={'speTop02'} checked={!this.state.isNormal} onChange={() => this.onSelectSopMode(null, false)} /><label onClick={(event) => this.onSelectSopMode(event, false)}>{i18n.t('sopManager.formText.야간 및 휴일모드')}</label>
					{
						userInfo?.siteID === ProjectResource.Site.GG_A &&
						<>
							<div className={'sopManagerDrop'}>
								<button className={this.state.showSites ? 'on' : null} onClick={() => this.setState({ showSites: !this.state.showSites })}>
									{siteName}
									<span className={this.state.showSites ? 'on' : null}></span>
								</button>
								<ul className={this.state.showSites ? 'on' : null}>
									{selectSiteUI_GG_SOP}
								</ul>
							</div>
						</>
					}
				</div>
				<div className={'speRow'}>
					<div className={'speCont'}>
						<div>
							<div>
								<h4 className={'on'}>{i18n.t('sopManager.formText.재난 분야')}</h4>
								<div className={'speChk'}>
								</div>
								<div className={"scroll-wrapper speScr" + " scrollbar-outer"}>
									<div className={'speScr'}>
										<ul className={'speGry'}>
											{
												this.state.disasterCategories.map((disasterCategoryData, index) => (
													<li key={"dc_" + index}>
														<label htmlFor={'speGry01_' + disasterCategoryData.disasterCategory.categoryName}>
															<img src={this.getDisasterCategoryImage(disasterCategoryData)} alt="" />
															<input type="radio" name="speGry" id={'speGry01_' + disasterCategoryData.disasterCategory.categoryName} onChange={() => this.onSelectDisasterCategory(disasterCategoryData)} />
															<span>{i18nUtil.convertText(disasterCategoryData.disasterCategory.categoryName)}</span>
														</label>
													</li>
													))
                                            }
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className={'speCont'}>
						<div>
							<div>
								<h4 className={sdcClassName}>{i18n.t('sopManager.formText.재난 종류')}</h4>
								<div className="scroll-wrapper scrollbar-outer">
									<div className={'speScr'}>
										<ul className={'speLst'}>
											{
												this.state.subDisasterCategories.map((sdc, index) => (
													<li key={"sdc_" + index}>
														<input type="radio" name="speType" id={'speType01'} disabled={this.state.selectedDisasterCategory === null} onChange={() => this.onSelectSubDisasterCategory(null, sdc)} />
														<label onClick={(event) => this.onSelectSubDisasterCategory(event, sdc)}>{i18nUtil.convertText(sdc.subDisasterCategory.subCategoryName)}</label>
													</li>
                                                ))
											}
											<li>
												<input ref={this.refNewSDCRadio} type="radio" name="speType" id={'speType01'} disabled={this.state.selectedDisasterCategory === null} onChange={() => this.onSelectNewSubDisasterCategory()} />
												<input ref={this.refNewSDC} type="text" className={'fullText'} disabled={this.state.selectedDisasterCategory === null} placeholder={i18n.t('sopManager.formText.새로운 재난 종류')} onChange={() => this.onChangeSubDisasterCategoryText()} />
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className={'speCont'}>
						<div>
							<div>
								<h4 className={disasterClassName}>{i18n.t('sopManager.formText.SOP 이름')}</h4>
								<div className="scroll-wrapper scrollbar-outer">
									<div className={'speScr'}>
										<ul className={'speIpt'}>
											{
												this.state.disasterDatas.map(disasterData => (
													<li key={"disaster_" + disasterData.disasterName}>
														<input type="radio" name="speIpt" id={'speIpt01'} disabled={this.state.selectedSubDisasterCategory === null} onChange={() => this.onSelectDisaster(null, disasterData)}/>
														<label onClick={(event) => this.onSelectDisaster(event, disasterData)}>{i18nUtil.convertText(disasterData.disasterName)}</label>
													</li>
													))
                                            }
											<li>
												<input ref={this.refNewDisasterRadio} type="radio" name="speIpt" id={'speIpt01'} disabled={this.state.selectedSubDisasterCategory === null} onChange={() => this.onSelectNewDisaster()} />
												<input ref={this.refNewDisaster} type="text" className={'fullText'} disabled={this.state.selectedSubDisasterCategory === null} placeholder={i18n.t('sopManager.formText.새로운 SOP')} onChange={() => this.onChangeDisasterText()} />
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>


				<div className={'speBot'}>
					<a className={'clickable'} onClick={() => this.onClickCancel()}>{i18n.t('common.취소')}</a>
					&nbsp;&nbsp;
					<a className={'clickable'} onClick={() => this.onClickApply()}>{i18n.t('common.만들기')}</a>
				</div>

			</NewSOPOptionsComponent>
        );

    }
}

export default withTranslation()(NewSOPOptions);