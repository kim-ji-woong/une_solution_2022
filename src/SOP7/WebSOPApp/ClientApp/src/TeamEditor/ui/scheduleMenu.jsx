import React, { Component } from 'react';
import { BrowserRouter as Route, Link } from 'react-router-dom';

import styles from '../../Common/css/style.module.css';

import TeamEditorResource from '../resource/id';

import { DisplayMenuComponent } from '../styled/TeamEditorStyled';
import { i18n, withTranslation, i18nUtil } from '../../language/i18n';

class ScheduleMenu extends Component {
	static cssStyles = styles;
	//static textFixed = "고정 근무표";
	//static textCurrent = "실시간 근무표";

	constructor(props) {
		super(props);

		this.state = {
			fixedClass: ScheduleMenu.cssStyles.current,
			currentClass: null,
		}

		this.props = props;
	}

	onClickList(e) {
		var target = e;

		// 각각의 state 값에 저장 한 후 해당 클래스 네임에 입력하기
		if (target.innerText == i18n.t('teamEditor.menu.고정 근무표') && this.state.fixedClass !== ScheduleMenu.cssStyles.current) {
			this.setState({ fixedClass: ScheduleMenu.cssStyles.current, currentClass: null });
			this.props.onChange(TeamEditorResource.menu.고정_근무표);
		} else if (target.innerText == i18n.t('teamEditor.menu.실시간 근무표') && this.state.currentClass !== ScheduleMenu.cssStyles.current) {
			this.setState({ fixedClass: null, currentClass: ScheduleMenu.cssStyles.current });
			this.props.onChange(TeamEditorResource.menu.실시간_근무표);
		}

		return;
	}

	render() {
		return (			
			<DisplayMenuComponent className={'saRht'}>
				<div className={'sarSel'}>
					<h3>{i18n.t('teamEditor.menu.근무표')}</h3>
				</div>
				<div>
					<ul className={styles.sarList}>
						<li><a onClick={(e) => this.onClickList(e.target)} className={this.state.fixedClass}>{i18n.t('teamEditor.menu.고정 근무표')}</a></li>
						<li><a onClick={(e) => this.onClickList(e.target)} className={this.state.currentClass}>{i18n.t('teamEditor.menu.실시간 근무표')}</a></li>
					</ul>
				</div>
			</DisplayMenuComponent>
        );
    }
}

export default withTranslation()(ScheduleMenu);