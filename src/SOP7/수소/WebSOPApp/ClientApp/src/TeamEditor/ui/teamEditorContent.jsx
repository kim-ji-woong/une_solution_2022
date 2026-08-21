import React, { Component } from 'react';
import { BrowserRouter as Route, Link } from 'react-router-dom';

import styles from '../../Common/css/style.module.css';
import TeamEditorResource from '../resource/id';
import uneStyles from '../../Common/css/uneCommon.module.css';
//import $ from 'jquery';

import { TeamEditorContentComponent } from '../styled/TeamEditorStyled';

class TeamEditorContent extends Component {
	static cssStyles = styles;

	constructor(props) {
		super(props);

		this.state = {
			teamClass: 'on',
		    scheduleClass: null,
			isEditMode: false,
        }

		this.props = props;
	}

	onClickMenu = (e) => {
		var target = e;

		// 각각의 state 값에 저장 한 후 해당 클래스 네임에 입력하기
		if (target.innerText == TeamEditorResource.menu.조직 && this.state.teamClass !== 'on') {
			this.setState({ teamClass: 'on', scheduleClass: null });
			this.props.changeMenuType(TeamEditorResource.menu.조직);
		}
		else if (target.innerText == TeamEditorResource.menu.근무표 && this.state.scheduleClass !== 'on') {
			this.setState({ teamClass: null, scheduleClass: 'on' });
			this.props.changeMenuType(TeamEditorResource.menu.근무표);
		}
	}

	//편집모드 event
	//onClickEdit = () => {
	//	// 권한 체크
	//	const userAuthor = ProjectResource.getUserAuthor();

	//	if (userAuthor !== AccountResource.ID.accountLevel.admin) {
	//		this.props.onAuthorError();
	//		return;
	//	}

	//	let chk = this.state.isEditMode;

	//	if (chk === false) {
	//		chk = true;
	//	} else {
	//		chk = false;
	//	}

	//	this.setState({ isEditMode: chk });
	//	this.props.isEditMode(chk);
	//	return;
	//}

	//save = () => {
	//	if (!this.state.isEditMode)
	//		return;

	//	this.props.save();
	//}

	//getSaveEnabled() {
	//	let saveClass = "";

	//	if (!this.state.isEditMode)
	//		saveClass = uneStyles.disabled;

	//	return saveClass;
 //   }

	render() {
		// GS인증에 따른 홈버튼 표시
		let homeUI = null;
		
		//if (ProjectResource.isGSMode !== true) {
			homeUI = <Link to="/team-editor" className={'salHome'}>홈</Link>;
        //}

		return (

			<TeamEditorContentComponent className={'saLeft'}>
				<div className={'aslWrap typeH'}>
					{ homeUI }
					<div className={'salMenu' + " " + this.state.teamClass}>
					{/*<div className={styles.salMenu}>*/}
						<a onClick={(e) => this.onClickMenu(e.target)} className={'salIco ico0101'}>{TeamEditorResource.menu.조직}</a>
						{
							//<dl className={styles.salCont + " " + uneStyles.salCont}>
							//	<dt onClick={this.onClickEdit}><input type="checkbox" id="salChk01" onChange={this.onChangeEdit} checked={this.state.isEditMode} /><label>편집</label></dt>
							//	<dd><a className={this.getSaveEnabled()} onClick={this.save} >저장</a></dd>
							//</dl>
						}
					</div>
					{/*
					<div className={styles.salMenu + " " + this.state.scheduleClass}>
						<a onClick={(e) => this.onClickMenu(e.target)} className={styles.salIco + " " + styles.ico0102}>{TeamEditorResource.ID.textSchedule}</a>
						<dl className={styles.salCont + " " + uneStyles.salCont}>
							<dt onClick={this.onClickEdit}><input type="checkbox" id="salChk01" onChange={this.onChangeEdit} checked={this.state.isEditMode} /><label>편집</label></dt>
							<dd><a href="#">뒤로가기</a></dd>
							<dd><a href="#">되돌리기</a></dd>
							<dd><a href="#">저장</a></dd>
						</dl>
					</div>
					*/}
				</div>
			</TeamEditorContentComponent>

        );
    }
}

export default TeamEditorContent;