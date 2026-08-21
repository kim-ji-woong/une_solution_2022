import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import styles from '../../Common/css/style.module.css';
import SopManagerResource from '../resource/id';
import SopDataManager from '../services/sopDataManager';
import SopManager from './sopManager';

import { SopManagerContentComponent } from '../styled/sopManagerStyled';
import { i18n, withTranslation, i18nUtil } from '../../language/i18n';
import ProjectResource from '../../Root/resource/id';

class SopManagerContent extends Component {
	static cssStyles = styles;

	constructor(props) {
		super(props);


		this.props = props;
	}

	onClickMenu(e) {
		const menu = SopManagerResource.menu;

		var target = e;

		if (target.innerText === i18n.t('sopManager.menu.SOP 편집')) {
			this.props.content(menu.SOP_편집, null);
		}
		else if (target.innerText === i18n.t('sopManager.menu.열기')) {
			this.props.content(menu.열기, null);
		}
		else if (target.innerText === i18n.t('common.저장')) {
			if (this.props.sopData) {
				this.props.content(menu.저장, this.props.sopData, true);
			}
		}
		else if (target.innerText === i18n.t('sopManager.menu.파일 저장')) {
			if (this.props.sopData) {
				if (!this.props.sopData.version.createTime) {
					this.props.sopData.version = SopDataManager.makeNewVersion(this.props.sopData.version.isNormal, "", this.props.loginUser ? this.props.loginUser.id : -1, "");
				}

				this.props.content(menu.파일_저장, this.props.sopData);
			}
		}
		else if (target.innerText === i18n.t('sopManager.menu.파일 열기')) {
			this.props.content(menu.파일_열기, null);
		}
		else if (target.innerText === i18n.t('sopManager.menu.새 SOP')) {
			this.props.content(menu.새_SOP, null);
		}
		else if (target.innerText === i18n.t('common.삭제')) {
			this.props.content(menu.삭제, null);
		}
	}

	render() {
		return (
			<SopManagerContentComponent className={'saLeft'} $disabled={this.props.sopData} $menu={this.props.menu}>
				<div className={'aslWrap typeC'}>
					{
						/*<Link to="/" className={SopManagerContent.cssStyles.salHome}>{SopManagerResource.ID.home}</Link>*/
					}
					<div className={'salMenu on'}>
						<a onClick={(e) => {if (this.props.menu !== SopManagerResource.menu.새_SOP) {this.onClickMenu(e.target)}}} className={'salIco ico0201'}>{i18n.t('sopManager.menu.SOP 편집')}</a>
						<dl className={'salCont'}>
							<dd><a className={'clickable'} onClick={(e) => {if (this.props.menu !== SopManagerResource.menu.새_SOP) {this.onClickMenu(e.target)}}}>{i18n.t('sopManager.menu.새 SOP')}</a></dd>
							<dd><a className={'clickable'} onClick={(e) => {if (this.props.menu !== SopManagerResource.menu.새_SOP) {this.onClickMenu(e.target)}}}>{i18n.t('sopManager.menu.열기')}</a></dd>
							<dd><a className={'clickable'} onClick={(e) => {if (this.props.menu !== SopManagerResource.menu.새_SOP) {this.onClickMenu(e.target)}}}>{i18n.t('common.저장')}</a></dd>
							{/* <dd><a className={'clickable'} onClick={(e) => this.onClickMenu(e.target)}>{i18n.t('sopManager.menu.다른 이름 저장')}</a></dd> */}
							<dd><a className={'clickable'} onClick={(e) => {if (this.props.menu !== SopManagerResource.menu.새_SOP) {this.onClickMenu(e.target)}}}>{i18n.t('common.삭제')}</a></dd>
							<dd><a className={'clickable'} onClick={(e) => {if (this.props.menu !== SopManagerResource.menu.새_SOP) {this.onClickMenu(e.target)}}}>{i18n.t('sopManager.menu.파일 열기')}</a></dd>
							<dd><a className={'clickable'} onClick={(e) => {if (this.props.menu !== SopManagerResource.menu.새_SOP) {this.onClickMenu(e.target)}}}>{i18n.t('sopManager.menu.파일 저장')}</a></dd>
						</dl>
					</div>
				</div>
			</SopManagerContentComponent>
		);
	}
}

export default withTranslation()(SopManagerContent);