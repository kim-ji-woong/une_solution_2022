import React, { Component } from 'react';
import ConfirmDialog from '../../../Common/ui/confirmHydrogen';

import newStyles from '../../../Common/css/newStyle.module.css';
import newDefaults from '../../../Common/css/newDefault.module.css';
import settings from '../../css/settings.module.css';
import styles from '../../../Common/css/style.module.css';
import { TeamEditorComponent } from '../../styled/settingsStyled';

import { SettingController } from '../../services/settingController';

import SettingResource from '../../resource/id';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';

class TeamEditor extends Component {
	constructor(props) {
		super(props);
		this.props = props;

		this.state = {
			confirmMessage: {
				visible: false,
				title: "",
				messages: [""],
				buttons: [''],
				onClose: this.onCloseConfirmDialog,
				onClickButton: null
			},
		}

		this.refRegularTeamFile = React.createRef();
	}

	onClickUpload = (mode) => {
		if (mode === SettingResource.excelMode.조직정보_업데이트) {
			this.refRegularTeamFile.current.click();
		}
	}

	onClickDownload = (mode) => {
		const selectedSiteID = this.props.selectedSiteID;

		if (mode === SettingResource.excelMode.조직정보_업데이트) {
			this.downloadRegularTeam(selectedSiteID);
		}
	}

	async downloadRegularTeam() {
		const [surcess, message] = await SettingController.requestDownloadRegularTeam();

		if (surcess === null) {
			this.showConfirmDialog(i18n.t('common.오류'), [message], null, null);
		}
	}

	onSelectRegularTeamFile = (event) => {
		const file = event.target.files[0];
		this.refRegularTeamFile.current.value = "";

		const type = /(.*?)\.(xls|xlsx)$/;

		if (!file.name.match(type)) {
			this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.userOption.엑셀 파일(xls, xlsx)만 업로드 가능합니다')], null, null);
			return;
		} else if (file.size > 10485760) {
			this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('setting.userOption.최대 10MB 엑셀 파일을 업로드 할 수 있습니다')], null, null);
			return;
		}

		this.props.settings.regularTeamFile = file;
		this.props.onChangeNeedToSave();
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

	onCloseConfirmDialog = () => {
		const confirmMessage = { ...this.state.confirmMessage };
		confirmMessage.visible = false;

		this.setState({ confirmMessage });
	}

	render() {
		return (
			<TeamEditorComponent>
				<ul className={'stgTab' + " " + 'single'}>
					<li><a className={'on' + " " + 'clickable'}>{i18n.t('common.일반')}</a></li>
				</ul>
				<div className={'stgList'}>
					<span className={'stgScroll'}>
						<div className={'stgName'}>
							<h5>{i18n.t('setting.teamEditor.조직정보 업데이트')}</h5>
							<span className={'stgTltp'} data-tooltip={i18n.t('setting.teamEditor.조직정보를 엑셀로 업로드/다운로드 (최대 10MB 가능)')}></span>
							<a onClick={() => this.onClickUpload(SettingResource.excelMode.조직정보_업데이트)} className={'stgnRset' + " " + 'upload'}>{i18n.t('setting.teamEditor.업로드')}</a>
							<a onClick={() => this.onClickDownload(SettingResource.excelMode.조직정보_업데이트)} className={'stgnRset' + " " + 'ml5'}>{i18n.t('setting.teamEditor.다운로드')}</a>
							<input ref={this.refRegularTeamFile} className={'hidden'} type='file' accept='.xls,.xlsx' onChange={this.onSelectRegularTeamFile} />
						</div>
					</span>
				</div>
				{
					/* alert창 대신 사용 */
					this.state.confirmMessage.visible &&
					<ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
				}
			</TeamEditorComponent>
		);
	}
}

export default withTranslation()(TeamEditor);