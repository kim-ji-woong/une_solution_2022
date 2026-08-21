import React, { Component } from 'react';
import styles from '../../../Common/css/style.module.css';
import bodyStyles from '../../css/body.module.css';
import SopController from '../../services/sopController';
import SopManager from '../sopManager';
import $ from 'jquery';
import '../../../Common/js/treeview.js';
import '../../../TeamEditor/ui/utility/css/style.css'; /* 사용중인것, 지우지마세요 */
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';
import SopManagerResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';


class OpenSOPOptions extends Component {
	static cssStyles = styles;

	constructor(props) {
		super(props);
		this.props = props;

		this.state = {
			disasterCategories: [],
			isNormal: true,
			selectedDisaster: null,
			selectedVersion: null,
			loading: true,
			loadingMessage: i18n.t('sopManager.formText.데이터를 불러오고 있습니다'),
			showSites: false,
			siteName: '종합방재실',
		};

		this.isFirst = true;
	}

	componentDidMount() {
		this.checkSiteID();

		this.onChangeSopMode(this.state.isNormal);
		$(document).ready(function () {
			$('.treeview').hummingbird();
		})
    }

	componentDidUpdate(prevProps) {
		if (ProjectResource.SiteID === ProjectResource.Site.GG_A && prevProps.selectedSiteID !== this.props.selectedSiteID) {
			this.onChangeSopMode(this.state.isNormal);
		}
	}

	checkSiteID = () => {
		const selectedSiteID = this.props.selectedSiteID;
		const userInfo = ProjectResource?.getUserInfo();
		if (userInfo?.siteID !== ProjectResource.Site.GG_A) {
			return;
		}

		if (selectedSiteID >= ProjectResource.Site.GG_B && selectedSiteID <= ProjectResource.Site.GG_H) {
			this.props.updateSelectedSiteID(ProjectResource.Site.GG_A);
			this.onChangeSopMode(this.state.isNormal);
		}
	}

	onChangeSopMode(isNormal) {
		this.getDisasterCategories(isNormal);
		//this.setState({ isNormal: isNormal });
	}

	async getDisasterCategories(isNormal) {
		let disasterCategories, message;
		const userInfo = ProjectResource?.getUserInfo();

		if (userInfo.siteID === ProjectResource.Site.GG_A && this.isFirst) {
			[disasterCategories, message] = await SopController.disasterCategories(isNormal, ProjectResource.Site.GG_A);
		} else {
			[disasterCategories, message] = await SopController.disasterCategories(isNormal, this.props.selectedSiteID);
		}

		if (disasterCategories) {
			if (isNormal) {
				this.setState({ loading: false, isNormal: isNormal, selectedDisaster: null, disasterCategories: disasterCategories });
			}
			else {
				this.setState({ loading: false, isNormal: isNormal, selectedDisaster: null, disasterCategories: disasterCategories });
			}
		}
		else {
			this.setState({ loading: true, loadingMessage: message, isNormal: isNormal, selectedDisaster: null });
		}
	}

	onClickClose() {
		// 원래 상태 그대로 돌려준다.
		this.props.content(SopManagerResource.menu.SOP_편집, this.props.sopData);
	}

	onClickTreeNode = (event) => {
		//if (event.target.classList.contains("fa-minus")) {
		//	event.target.classList.remove("fa-minus");
		//	event.target.classList.add("fa-plus");
		//}
		//else if (event.target.classList.contains("fa-plus")) {
		//	event.target.classList.remove("fa-plus");
		//	event.target.classList.add("fa-minus");
		//}

		//this.setState({ loading: false });
	}

	onClickDisaster(disasterData) {
		this.setState({ selectedDisaster: disasterData });
	}

	onClickOpen = (event) => {
		if (this.state.selectedVersion) {
			this.props.content(SopManagerResource.menu.열기, this.state.selectedVersion.id);
		}
		else {
			alert(i18n.t('sopManager.formText.SOP 버전을 선택하세요'));
        }
	}

	tbRdo(event, version) {
		const tr = event.target.parentElement;

		for (let i = 0; i < tr.parentElement.children.length; i++)
		{
			const row = tr.parentElement.children[i];

			if (row === tr) {
				continue;
			}
			else {
				row.classList.remove(OpenSOPOptions.cssStyles.on);
            }
        }

		tr.classList.add(OpenSOPOptions.cssStyles.on);
		this.setState({ selectedVersion: version });
	};

	getDisasterVersion(disaster) {
		if (disaster?.version) {
			this.versionCount = this.versionCount + 1;

			return (
				<tr key={"version_" + this.versionCount} onClick={(event) => this.tbRdo(event, disaster.version)}>
					<td>{disaster.version.versionName}</td>
					<td>{disaster.owner}</td>
					<td>{disaster.version.createTime.toString().replace('T', ' ')}</td>
					<td>{disaster.version.lastAccessTime.toString().replace('T', ' ')}</td>
					<td className={OpenSOPOptions.cssStyles.tal}>{i18nUtil.convertText(disaster.version.description)}</td>
				</tr>
				);
		}

		return <></>
    }

	getDisasterVersions(disasterData) {
		this.versionCount = 0;

		if (disasterData) {
			return (
				<table className={OpenSOPOptions.cssStyles.scTb}>
					<caption>버전명, 작성자, 생성일자, 수정일자, 부가설명으로 구성된 표</caption>
					<colgroup>
						<col className={bodyStyles.col10Pro} />
						<col className={bodyStyles.col10Pro} />
						<col className={bodyStyles.col20Pro} />
						<col className={bodyStyles.col20Pro} />
						<col className={bodyStyles.col40Pro} />
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
							disasterData.disasterDatas && (
								disasterData.disasterDatas.map(disaster => (this.getDisasterVersion(disaster)))
							)
						}
					</tbody>
				</table>
			);
		}

		return <></>
    }

	getDisasterContents(disasterData) {
		this.disasterCount = this.disasterCount + 1;
		const className = disasterData === this.state.selectedDisaster ? "treeviewLastItem " + OpenSOPOptions.cssStyles.selectedTreeNode + " " + OpenSOPOptions.cssStyles.clickable : "treeviewLastItem " + OpenSOPOptions.cssStyles.clickable;

		return (
			<li key={"disaster_" + this.disasterCount} className={className} onClick={() => this.onClickDisaster(disasterData)}>{i18nUtil.convertText(disasterData.disasterName)}</li>
		);
	}

	getSubDisasterCategoryContents(subDisasterCategoryData) {
		if (!subDisasterCategoryData.subDisasterCategory) {
			return <></>
		}

		this.sdcCount = this.sdcCount + 1;

		if (subDisasterCategoryData.disasterDatas && subDisasterCategoryData.disasterDatas.length > 0) {
			return (
				<li key={"sdc_" + this.sdcCount}>
					<i className="fa-minus" onClick={this.onClickTreeNode}>{i18n.t('sopManager.formText.더 보기')}</i><h5>{i18nUtil.convertText(subDisasterCategoryData.subDisasterCategory.subCategoryName)}</h5>
					{
						subDisasterCategoryData.disasterDatas && (
							<ul>
								{
									subDisasterCategoryData.disasterDatas.map(disasterData => this.getDisasterContents(disasterData))
								}
							</ul>
						)
					}
				</li>
			);
		}

		return (
			<li key={"sdc_" + this.sdcCount} className={"treeviewLastItem " + OpenSOPOptions.cssStyles.grayText}>{i18nUtil.convertText(subDisasterCategoryData.subDisasterCategory.subCategoryName)}</li>
		);
	}

	getDisasterCategoryContents(disasterCategoryData) {
		if (!disasterCategoryData.disasterCategory) {
			return <></>
		}

		this.dcCount = this.dcCount + 1;

		return (
			<li key={"dc_" + this.dcCount}>
				<i className="fa-minus" onClick={this.onClickTreeNode}>{i18n.t('sopManager.formText.더 보기')}</i><h5>{i18nUtil.convertText(disasterCategoryData.disasterCategory.categoryName)}</h5>
				{
					disasterCategoryData.subDisasterCategories && (
					<ul>
					{
							disasterCategoryData.subDisasterCategories.map(subDisasterCategoryData => this.getSubDisasterCategoryContents(subDisasterCategoryData))
					}
					</ul>
					)
				}
			</li>
		);
    }

	onClickSite = (siteID) => {
		const sites = ProjectResource?.sites;

		if(sites.length > 1){
			for(let i = 0; i < sites?.length; i++){
				const siteData = sites[i];

				if(siteID === siteData.id){
					this.setState({ 
						siteName: siteData.siteName,
						showSites: false
					});

					this.isFirst = false;
					this.props.onChangeSite(siteID);
				}
			}
		}
	}

	displaySite = () => {
		const sites = ProjectResource?.sites;
		let selectSiteUI_GG_SOP = [];

		if(sites.length > 1){
			for(let i = 0; i < sites?.length; i++){
				const siteData = sites[i];

				selectSiteUI_GG_SOP.push(<li key={"selectSiteUI" + siteData.id} onClick={() => this.onClickSite(Number(siteData.id))}>{siteData.siteName}</li>);
			}
		}
		return [selectSiteUI_GG_SOP];
	}

	render() {
		this.dcCount = 0;
		this.sdcCount = 0;
		this.disasterCount = 0;

		const userInfo = ProjectResource.getUserInfo();
		const [selectSiteUI_GG_SOP] = this.displaySite();
		const siteName = this.state.siteName;

		return (
			<div id={OpenSOPOptions.cssStyles.sopPop}>
				<div>
					<div>
						<div className={OpenSOPOptions.cssStyles.spPop + " " + OpenSOPOptions.cssStyles.sopOpen}>
							<div className={OpenSOPOptions.cssStyles.sppTop}>
								<h4>{i18n.t('sopManager.formText.SOP 열기')}</h4>
								<a className={OpenSOPOptions.cssStyles.clickable} onClick={() => this.onClickClose()}>{i18n.t('common.닫기')}</a>
							</div>
							<div className={OpenSOPOptions.cssStyles.sppSel}>
								<h5>{i18n.t('sopManager.formText.전체 SOP')}</h5>
								<label className={OpenSOPOptions.cssStyles.clickable}>
									<input type="radio" name="sppSel" className={bodyStyles.labelInput} checked={this.state.isNormal} onChange={() => this.onChangeSopMode(true)} />
									{i18n.t('sopManager.formText.평일모드')}
								</label>
								<label className={OpenSOPOptions.cssStyles.clickable}>
									<input type="radio" name="sppSel" className={bodyStyles.labelInput} checked={!this.state.isNormal} onChange={() => this.onChangeSopMode(false)} />
									{i18n.t('sopManager.formText.야간 및 휴일모드')}
								</label>
							</div>
							<div className={OpenSOPOptions.cssStyles.sppCont}>
								<div className={OpenSOPOptions.cssStyles.sppLft}>
									{
										userInfo?.siteID === ProjectResource.Site.GG_A ?
											<div className={OpenSOPOptions.cssStyles.selectBoxSOP}>
												<button className={this.state.showSites ? OpenSOPOptions.cssStyles.on : null} onClick={() => this.setState({ showSites: !this.state.showSites })}>
													<div>{siteName}</div>
													<span className={this.state.showSites ? OpenSOPOptions.cssStyles.on : null}></span>
												</button>
												<ul className={this.state.showSites ? OpenSOPOptions.cssStyles.on : null}>
													{selectSiteUI_GG_SOP}
												</ul>
											</div>
											: <></>
									}
									<div className={OpenSOPOptions.cssStyles.scrollbarOuter}>
										<ul className={styles.sarTree + ' treeview'}>
										{
											this.state.disasterCategories && (
												this.state.disasterCategories.map(disasterCategoryData => (this.getDisasterCategoryContents(disasterCategoryData)))
											)
										}
										</ul>
									</div>
								</div>
								<div className={OpenSOPOptions.cssStyles.sppRht}>
									<div className={OpenSOPOptions.cssStyles.scrollbarOuter}>
										<div className={OpenSOPOptions.cssStyles.spprCont}>
										{
											this.getDisasterVersions(this.state.selectedDisaster)
                                        }
										</div>
									</div>
									<div className={OpenSOPOptions.cssStyles.spprBot}>
										<a className={OpenSOPOptions.cssStyles.blu} onClick={this.onClickOpen}>{i18n.t('sopManager.formText.SOP 열기')}</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withTranslation()(OpenSOPOptions);