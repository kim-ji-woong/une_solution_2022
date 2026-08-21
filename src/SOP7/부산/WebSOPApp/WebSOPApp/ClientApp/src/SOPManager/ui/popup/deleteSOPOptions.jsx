import React, { Component } from 'react';
import styles from '../../../Common/css/style.module.css';
import bodyStyles from '../../css/body.module.css';
import SopManagerResource from '../../resource/id';
import SopController from '../../services/sopController';
import SopManager from '../sopManager';
import $ from 'jquery';
import '../../../Common/js/treeview.js';
import '../../../TeamEditor/ui/utility/css/style.css'; /* 사용중인것, 지우지마세요 */

import { SopPop, SpPop, SppTop, SppSel, SppCont, SppLft, SppRhtDelete, SpprCont, SpprBot } from '../../../SOPManager/styled/popupStyled';
import { LabelInputRadio, LabelInput } from '../../../SOPManager/styled/componentsStyled';
import ProjectResource from '../../../Root/resource/id.js';


class DeleteSOPOptions extends Component {
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
			loadingMessage: SopManagerResource.ID.messages.loadingData
		};

		this.refCheckBoxHeader = React.createRef();
		this.refTBody = React.createRef();

		this.deleteVersionIDs = [];
	}

	componentDidMount() {
		this.onChangeSopMode(this.state.isNormal);
		$(document).ready(function () {
			$('.treeview').hummingbird();
		})
    }

	onChangeSopMode(isNormal) {
		this.getDisasterCategories(isNormal);
		//this.setState({ isNormal: isNormal });
	}

	async getDisasterCategories(isNormal) {
		const [disasterCategories, message] = await SopController.disasterCategories(isNormal);

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
		this.props.content(SopManager.menu.editSOP, this.props.sopData);
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
		if (this.state.selectedDisaster !== disasterData) {
			if (this.refCheckBoxHeader.current) {
				this.refCheckBoxHeader.current.checked = false;
				this.onChangeCheckHeader(this.refCheckBoxHeader.current);
			}

			this.setState({ selectedDisaster: disasterData });
		}
	}

	getCheckedVersions() {
		const children = this.refTBody.current.children;
		const childCount = children.length;

		const versionIDs = [];

		for (let i = 0; i < childCount; i++) {
			const tr = children[i];

			if (tr.tagName === "TR") {
				if (tr.children.length > 0) {
					const td = tr.children[0];

					if (td.tagName !== "TD") {
						continue;
					}

					if (td.children.length > 0) {
						const input = td.children[0];

						if (input.tagName !== "INPUT") {
							continue;
						}

						if (input.checked) {
							const versionID = parseInt(tr.dataset.versionid);

							if (isNaN(versionID) === false && versionID !== undefined && versionID !== null) {
								versionIDs.push(versionID);
							}
                        }
					}
				}
			}
		}

		return versionIDs;
    }

	onClickDelete = (event) => {
		const versionIDs = this.getCheckedVersions();

		if (versionIDs.length > 0) {
			if (this.checkCurrentVersion(versionIDs)) {
				this.props.content(SopManager.menu.delete, [versionIDs, this, this.state.isNormal]);
			}
        }
	}

	checkCurrentVersion(versionIDs) {
		const sopData = this.props.sopData;

		if (sopData?.disaster) {
			const disaster = { ...sopData.disaster };

			for (const versionID of versionIDs) {
				if (versionID === disaster.versionID) {
					this.deleteVersionIDs = versionIDs;
					this.props.showConfirmDialog(ProjectResource.dialogTypes.WARNING, ["현재 화면에서 편집중인 버전을 삭제하려고 합니다.", "계속 진행할까요? 이 작업은 돌이킬수 없습니다."], ["취소", "확인"], this.onConfirmDelete);
					return false;
                }
            }
		}

		return true;
	}

	onConfirmDelete = (index) => {
		if (index === 1) {
			this.props.content(SopManager.menu.delete, [this.deleteVersionIDs, this, this.state.isNormal]);
		}

		this.props.onCloseConfirmDialog();
    }

	static postDeleteMethod(obj, isNormal) {
		obj.onChangeSopMode(isNormal);
    }

	tbRdo(event, version) {
		const tr = event.target.parentElement;

		for (let i = 0; i < tr.parentElement.children.length; i++)
		{
			const row = tr.parentElement.children[i];

			if (row === tr) {
				if (row.children.length > 0) {
					const td = row.children[0];

					if (td.tagName === "TD" && td.children.length > 0) {
						const input = td.children[0];

						if (input.tagName === "INPUT") {
							input.checked = input.checked ? false : true;
						}
					}
				}

				continue;
			}
			else {
				row.classList.remove(DeleteSOPOptions.cssStyles.on);
			}
        }

		tr.classList.add(DeleteSOPOptions.cssStyles.on);
		this.setState({ selectedVersion: version });
	};

	getDisasterVersion(disaster) {
		if (disaster?.version) {
			this.versionCount = this.versionCount + 1;

			return (
				<tr key={"version_" + this.versionCount} data-versionid={disaster.version.id} onClick={(event) => this.tbRdo(event, disaster.version)}>
					<td>
					   <input type="checkbox" /* className={styles.deleteCheckbox} */ />
					</td>
					<td>
						<span
							onMouseOver={(e) => this.props.handleTooltip(e, disaster.version.versionName)}
							onMouseLeave={() => this.props.removeTooltip()}
						>
							{disaster.version.versionName}
						</span>
					</td>
					<td>{disaster.owner}</td>
					<td>{disaster.version.createTime.toString().replace('T', ' ')}</td>
					<td>{disaster.version.lastAccessTime.toString().replace('T', ' ')}</td>
					<td className={DeleteSOPOptions.cssStyles.tal}>
						<span
							onMouseOver={(e) => this.props.handleTooltip(e, disaster.version.description)}
							onMouseLeave={() => this.props.removeTooltip()}
						>
							{disaster.version.description}
						</span>
					</td>
				</tr>
			);
		}

		return <></>
    }

	getDisasterVersions(disasterData) {
		this.versionCount = 0;

		if (disasterData) {
			return (
				<table className={DeleteSOPOptions.cssStyles.scTb}>
					<caption>버전명, 작성자, 생성일자, 수정일자, 부가설명으로 구성된 표</caption>
					<colgroup>
						<col className={bodyStyles.col5Pro} />
						<col className={bodyStyles.col12Pro} />
						<col className={bodyStyles.col12Pro} />
						<col className={bodyStyles.col25Pro} />
						<col className={bodyStyles.col25Pro} />
						<col className={bodyStyles.col40Pro} />
					</colgroup>
					<thead>
						<tr>
							<th>
								<LabelInput>
								  <input ref={this.refCheckBoxHeader} type="checkbox" onChange={(e) => this.onChangeCheckHeader(e.target)} />
								</LabelInput>
						    </th>
							<th>버전명</th>
							<th>작성자</th>
							<th>생성일자</th>
							<th>수정일자</th>
							<th>부가설명</th>
						</tr>
					</thead>
					<tbody ref={this.refTBody}>
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

	onChangeCheckHeader = (target) => {
		if (!this.refTBody.current) {
			return;
		}

		const children = this.refTBody.current.children;
		const childCount = children.length;
		const checked = target.checked;

		for (let i = 0; i < childCount; i++) {
			const child = children[i];

			if (child.tagName === "TR") {
				if (child.children.length > 0) {
					const td = child.children[0];

					if (td.tagName !== "TD") {
						continue;
					}

					if (td.children.length > 0) {
						const input = td.children[0];

						if (input.tagName !== "INPUT") {
							continue;
						}

						input.checked = checked;
                    }
                }
            }
        }
	}

	getDisasterContents(disasterData) {
		this.disasterCount = this.disasterCount + 1;
		const className = disasterData === this.state.selectedDisaster ? "treeviewLastItem " + DeleteSOPOptions.cssStyles.selectedTreeNode + " " + DeleteSOPOptions.cssStyles.clickable : "treeviewLastItem " + DeleteSOPOptions.cssStyles.clickable;

		return (
			<li key={"disaster_" + this.disasterCount} className={className} onClick={() => this.onClickDisaster(disasterData)}>{disasterData.disasterName}</li>
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
					<i className="fa-minus" onClick={this.onClickTreeNode}>더보기</i><h5>{subDisasterCategoryData.subDisasterCategory.subCategoryName}</h5>
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
			<li key={"sdc_" + this.sdcCount} className={"treeviewLastItem " + DeleteSOPOptions.cssStyles.grayText}>{subDisasterCategoryData.subDisasterCategory.subCategoryName}</li>
		);
	}

	getDisasterCategoryContents(disasterCategoryData) {
		if (!disasterCategoryData.disasterCategory) {
			return <></>
		}

		this.dcCount = this.dcCount + 1;

		return (
			<li key={"dc_" + this.dcCount}>
				<i className="fa-minus" onClick={this.onClickTreeNode}>더보기</i><h5>{disasterCategoryData.disasterCategory.categoryName}</h5>
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

	render() {
		this.dcCount = 0;
		this.sdcCount = 0;
		this.disasterCount = 0;

		return (
			<SopPop>
				<div>
					<div>
						<SpPop>
							<SppTop>
								<h4>SOP삭제</h4>
								<a /* className={DeleteSOPOptions.cssStyles.clickable} */ onClick={() => this.onClickClose()}>닫기</a>
							</SppTop>
							<SppSel>
								{/* <h5>전체 SOP</h5> */}
								<label /* className={DeleteSOPOptions.cssStyles.clickable} */>
								   <LabelInputRadio>
									 <input type="radio" name="sppSel" className={bodyStyles.labelInput} checked={this.state.isNormal} onChange={() => this.onChangeSopMode(true)} />
								   </LabelInputRadio>
									{SopManagerResource.ID.sopMode.normal}
								</label>
								<label /* className={DeleteSOPOptions.cssStyles.clickable} */>
								  <LabelInputRadio>
									<input type="radio" name="sppSel" className={bodyStyles.labelInput} checked={!this.state.isNormal} onChange={() => this.onChangeSopMode(false)} />
								  </LabelInputRadio>
								  {SopManagerResource.ID.sopMode.abnormal}
								</label>
							</SppSel>
							<SppCont>
								<SppLft>
									<div className={DeleteSOPOptions.cssStyles.scrollbarOuter}>
										<ul className={styles.sarTree + ' treeview'}>
										{
											this.state.disasterCategories && (
												this.state.disasterCategories.map(disasterCategoryData => (this.getDisasterCategoryContents(disasterCategoryData)))
											)
										}
										</ul>
									</div>
								</SppLft>
								<SppRhtDelete>
									<div className={DeleteSOPOptions.cssStyles.scrollbarOuter}>
										<SpprCont>
										{
											this.getDisasterVersions(this.state.selectedDisaster)
                                        }
										</SpprCont>
									</div>
									<SpprBot>
										<a className={DeleteSOPOptions.cssStyles.blu} onClick={this.onClickDelete}>SOP 삭제</a>
									</SpprBot>
								</SppRhtDelete>
							</SppCont>
						</SpPop>
					</div>
				</div>
			</SopPop>
		);
	}
}

export default DeleteSOPOptions;