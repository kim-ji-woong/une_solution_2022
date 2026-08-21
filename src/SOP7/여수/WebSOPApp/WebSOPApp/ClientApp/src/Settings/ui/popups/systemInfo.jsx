import React, { Component } from 'react';
import ConfirmDialog from '../../../Common/ui/confirmDialog';

import newStyles from '../../../Common/css/newStyle.module.css';
import settings from '../../css/settings.module.css';

import ProjectResource from '../../../Root/resource/id';

import { SettingCommon, StgTab, SystemInfoCont } from '../../styled/SettingStyled';


class SystemInfo extends Component {
	constructor(props) {
		super(props);
		this.props = props;

		this.state = {
			confirmMessage: {
				visible: false,
				title: "",
				messages: [""],
				buttons: ["확인"],
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

	sendShutDownSystem = () => {
		this.props.onClickShutDown();
	}

	render() {
		return (
			<>
				<StgTab className={'stgTab single'}>
				
				</StgTab>
				<SystemInfoCont className={'stgList'}>
					  <span className={'stgScroll'}>
							<div className={'stgName'}>
								<h5>버전 정보</h5>
								<span className={'stgTltp'} data-tooltip="현재 시스템 버전 정보"></span>
							<span className={'white'}>  v {ProjectResource.version} </span>
							</div>

							<div className={'stgName'}>
								<h5>제품 공급자 정보</h5>
								<span className={'stgTltp'} data-tooltip="제품 공급 업체 정보"></span>
								<div className={'stgHigh'}>
									<span className={'white'}>주식회사 유엔이(서울 용산구 청파로 345 주연빌딩 1층)</span>

								</div>
							</div>

							<div className={'stgName'}>
								<h5>고객지원센터</h5>
							    <span className={'stgTltp'} data-tooltip="고객지원센터 전화번호"></span>
							    <span className={'white'} style={{ display: 'block', padding: '8px 0px' }}> 02-714-4133 &nbsp;&nbsp;</span>
						</div>

						<div className={'stgName'}>
							<h5>유지보수 정보</h5>
							<span className={'stgTltp'} data-tooltip="시스템 유지보수 정보"></span>
							<span className={'white'} style={{ display: 'block', padding: '8px 0px' }}> 최초 설치일 : 2022.01.02 / 무상 유지보수 기간 1년 &nbsp;&nbsp;</span>

						</div>
					</span>

					<ul className={'dspBtn'}>
						<span className={'systemEndBtn'} onClick={() => this.sendShutDownSystem()}>시스템 종료</span>
					</ul>
				</SystemInfoCont>

				{
					/* alert창 대신 사용 */
					this.state.confirmMessage.visible &&
					<ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
				}
			</>
		);
	}
}

export default SystemInfo;