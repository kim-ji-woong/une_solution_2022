import React, { Component } from 'react';
import ConfirmDialog from '../../../Common/ui/confirmDialog';

import ProjectResource from '../../../Root/resource/id';

import { SystemInfoComponent } from '../../styled/settingsStyled';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';

class SystemInfo extends Component {
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
			<SystemInfoComponent>
				<div className={'stgList'}>
					<div className={'stgName'}>
						<h5>{i18n.t('setting.systemInfo.버전 정보')}</h5>
						<span className={'stgTltp'} data-tooltip={i18n.t('setting.systemInfo.현재 시스템 버전 정보')}></span>
						<span className={'white'}>  v {ProjectResource.version} </span>
					</div>

					<div className={'stgName'}>
						<h5>{i18n.t('setting.systemInfo.제품 공급자 정보')}</h5>
						<span className={'stgTltp'} data-tooltip={i18n.t('setting.systemInfo.제품 공급 업체 정보')}></span>
						<div className={'stgHigh'}>
							<span className={'white'}>{i18n.t('setting.systemInfo.주식회사 유엔이(서울 용산구 청파로 345 주연빌딩 1층)')}</span>
						</div>
					</div>

					<div className={'stgName'}>
						<h5>{i18n.t('setting.systemInfo.고객지원센터')}</h5>
						<span className={'stgTltp'} data-tooltip={i18n.t('setting.systemInfo.고객지원센터 전화번호')}></span>
						<span className={'white'}> 02-714-4133 &nbsp;&nbsp;</span>
					</div>

					<div className={'stgName'}>
						<h5>{i18n.t('setting.systemInfo.유지보수 정보')}</h5>
						<span className={'stgTltp'} data-tooltip={i18n.t('setting.systemInfo.시스템 유지보수 정보')}></span>
						<span className={'white'}>{i18n.t('setting.systemInfo.무상 유지보수 기간 1년 (최초 설치일로부터)')} &nbsp;&nbsp;</span>
					</div>
				</div>

				{
					/* alert창 대신 사용 */
					this.state.confirmMessage.visible &&
					<ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
				}
			</SystemInfoComponent>
		);
	}
}

export default withTranslation()(SystemInfo);