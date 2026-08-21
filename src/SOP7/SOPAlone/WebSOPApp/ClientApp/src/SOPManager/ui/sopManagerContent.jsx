import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import styles from '../../Common/css/style.module.css';
import '../../SOPManager/css/componentProperty.css';
import SopManagerResource from '../resource/id';
import SopDataManager from '../services/sopDataManager';
import SopManager from './sopManager';

import { SopMLeft, SalMenu, SalCont, NewSOPIcon, SopOpenIcon, SopSaveIcon, SopSaveAsIcon, SopDeleteIcon, SopOpenXMLIcon, SopSaveXMLIcon } from '../../SOPManager/styled/managerStyled';


class SopManagerContent extends Component {
	static cssStyles = styles;

	constructor(props) {
		super(props);


		this.props = props;
	}

	onClickMenu(e) {
		var target = e;

		if (target.innerText === SopManager.menu.editSOP) {
			this.props.content(SopManager.menu.editSOP, null);
		}
		else if (target.innerText === SopManager.menu.open) {
			this.props.content(SopManager.menu.open, null);
		}
		else if (target.innerText === SopManager.menu.save) {
			this.props.content(SopManager.menu.save, this.props.sopData, true);
		}
		else if (target.innerText === SopManager.menu.saveXML) {
			if (!this.props.sopData.version.createTime) {
				this.props.sopData.version = SopDataManager.makeNewVersion(this.props.sopData.version.isNormal, "", this.props.loginUser ? this.props.loginUser.id : -1, "");
			}

			this.props.content(SopManager.menu.saveXML, this.props.sopData);
		}
		else if (target.innerText === SopManager.menu.openXML) {
			this.props.content(SopManager.menu.openXML, null);
		}
		else if (target.innerText === SopManager.menu.newSOP) {
			this.props.content(SopManager.menu.newSOP, null);
		}
		else if (target.innerText === SopManager.menu.delete) {
			this.props.content(SopManager.menu.delete, null);
		}
	}

	render() {
		return (
			<SopMLeft>
				<div className={SopManagerContent.cssStyles.aslWrap + " " + SopManagerContent.cssStyles.typeC}>
					{
						/*<Link to="/" className={SopManagerContent.cssStyles.salHome}>{SopManagerResource.ID.home}</Link>*/
					}

                    <SalMenu $disabled={this.props.sopData}>
					  <div className="salCont">
						<dd><a><NewSOPIcon onClick={(e) => this.onClickMenu(e.target)}>{SopManager.menu.newSOP}</NewSOPIcon></a></dd>
						<dd><a><SopOpenIcon onClick={(e) => this.onClickMenu(e.target)}>{SopManager.menu.open}</SopOpenIcon></a></dd>
					    <dd><a><SopSaveIcon $disabled={this.props.sopData} onClick={(e) => this.onClickMenu(e.target)}>{SopManager.menu.save}</SopSaveIcon></a></dd>
				    {/* <dd><a><SopSaveAsIcon onClick={(e) => this.onClickMenu(e.target)}>{SopManager.menu.saveAs}</SopSaveAsIcon></a></dd> */}
					    <dd><a><SopDeleteIcon onClick={(e) => this.onClickMenu(e.target)}>{SopManager.menu.delete}</SopDeleteIcon></a></dd>
					    <dd><a><SopOpenXMLIcon onClick={(e) => this.onClickMenu(e.target)}>{SopManager.menu.openXML}</SopOpenXMLIcon></a></dd>
						<dd><a><SopSaveXMLIcon $disabled={this.props.sopData} onClick={(e) => this.onClickMenu(e.target)}>{SopManager.menu.saveXML}</SopSaveXMLIcon></a></dd>
				      </div>
				    </SalMenu>

					{/* <div className={SopManagerContent.cssStyles.salMenu + " " + SopManagerContent.cssStyles.on}>
						<a onClick={(e) => this.onClickMenu(e.target)} className={SopManagerContent.cssStyles.salIco + " " + SopManagerContent.cssStyles.ico0201}>{SopManagerResource.ID.menu.editSOP}</a>
						<dl className={SopManagerContent.cssStyles.salCont}>
							<dd><a className={SopManagerContent.cssStyles.clickable} onClick={(e) => this.onClickMenu(e.target)}>{SopManager.menu.newSOP}</a></dd>
							<dd><a className={SopManagerContent.cssStyles.clickable} onClick={(e) => this.onClickMenu(e.target)}>{SopManager.menu.open}</a></dd>
							<dd><a className={SopManagerContent.cssStyles.clickable} onClick={(e) => this.onClickMenu(e.target)}>{SopManager.menu.save}</a></dd>
							<dd><a className={SopManagerContent.cssStyles.clickable} onClick={(e) => this.onClickMenu(e.target)}>{SopManager.menu.delete}</a></dd>
							<dd><a className={SopManagerContent.cssStyles.clickable} onClick={(e) => this.onClickMenu(e.target)}>{SopManager.menu.openXML}</a></dd>
							<dd><a className={SopManagerContent.cssStyles.clickable} onClick={(e) => this.onClickMenu(e.target)}>{SopManager.menu.saveXML}</a></dd>
						</dl>
					</div> */}
				</div>
			</SopMLeft>
		);
	}
}

export default SopManagerContent;