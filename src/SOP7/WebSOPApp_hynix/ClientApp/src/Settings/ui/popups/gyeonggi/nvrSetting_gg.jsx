import React, { Component } from 'react';
import ConfirmDialog from '../../../../Common/ui/confirmDialog';
import { ModalBackgroundNVR, NVRSettingComponent } from '../../../styled/settingsStyled';

import { i18n } from '../../../../language/i18n';
import { GghController } from '../../../../SDMS/services/gghController';
import ProjectResource from "../../../../Root/resource/id";


class NVRSetting_gg extends Component {
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

			selectNVRPlace: '41',

			tooltip:{
				tooltipShow: false,
				tooltipTop: 0,
				tooltipLeft: 0,
				tooltipItem: ''
			}
		}
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
	
	onChangeNVRPlace = (value) => {
        this.setState({ selectNVRPlace: value });
	}

	onChangeCCTVSetting = (e, cctv, type) => {
		if(type === 'url') {
			if (cctv.url !== e.target.value) {
				cctv.url = e.target.value;
				cctv.isUpdate = true;
			}
		}

		const nvrList = this.props.nvrList;
		for (let i = 0; i < nvrList.length; i++) {
			if (nvrList[i].id === cctv.id) {
				nvrList[i] = cctv;
			}
		}

		this.props.updateCCTVSettings(nvrList);
	}
	
	getNvrListView = () => {
		let listView = [];
		const nvrList = this.props.nvrList;
		const selectNVRPlace = this.state.selectNVRPlace; 

		if (!nvrList || nvrList?.length === 0) {
			return <></>
		}
			if(selectNVRPlace === '41'){
				nvrList.map((item) => (
					listView.push(
						<div key={'nvrList' + item.id} className={'stgName'}>
							<h5>SERVER0{item.id}</h5>
							<span className={'tooltipGGNVR'}
								onMouseEnter={(e) => this.handleTooltip(e, item.description)}
								onMouseLeave={() => this.setState({ tooltip: {tooltipShow: false} })}
							/>
							<div className='server'>
								<div>
									<label>서버명:</label>
									<input type='text' defaultValue={item.name} disabled />
								</div>
								<div>
									<label>IP/PORT:</label>
									<input type='text' defaultValue={item.url} onBlur={(e) => this.onChangeCCTVSetting(e, item, 'url')} />
								</div>
							</div>
						</div>
					)
				));
			}else if(selectNVRPlace === '43'){
				listView.push(
				);
			}else if(selectNVRPlace === '45'){
				listView.push(
				);  
			}

		return listView;
	}

	onClickCancle = () => {
        this.props.nvrSetOff(false);
    }

	onClickSave = async () => {
		const nvrList = this.props.nvrList;

		const updateNVRList = nvrList.filter(nvr => nvr?.isUpdate);

		// cctv nvr 리스트 설정
		if (nvrList?.length > 0) {
			const [success, message] = await GghController.updateNvrList(updateNVRList);
			if (!success) {
				this.showConfirmDialog(i18n.t('common.오류'), [message], null, null);
				return;
			}
			else {
				this.showConfirmDialog(i18n.t('common.확인'), ['NVR 설정이 변경되었습니다.'], null, null);
				
				for (let nvr of nvrList) {
					nvr.isUpdate = false;
				}
			}
		}
	}

	onClickClosePopup = () => {
        this.props.nvrSetOff(false);
    }

	handleTooltip = (e, item) => {
		const domRect = e.target.getBoundingClientRect();

		this.setState({
			tooltip: {
				tooltipShow: !this.state.tooltipShow,
				tooltipTop: domRect.top - 33,
				tooltipLeft: domRect.left - 14,
				tooltipItem: item  
			}
		});
	}

	render() {
		const listView = this.getNvrListView();
		const userInfo = ProjectResource.getUserInfo();

		return (
			<ModalBackgroundNVR>
				{
					//NVR 설정창 tooltip
					this.state.tooltip.tooltipShow &&
					<div style={{ left: this.state.tooltip.tooltipLeft, top: this.state.tooltip.tooltipTop }}
						className={'tooltipGGNVR-content'}>
							관할 CCTV : {this.state.tooltip.tooltipItem}
					</div>
				}
				<NVRSettingComponent>
					<div className={'dslTop dslGrd'}>
						<h5 className={'dslTitle'}>
							NVR 설정
						</h5>
						<a className={'dslX'} onClick={this.onClickClosePopup}></a>
					</div>
					{
						userInfo.siteID === ProjectResource.Site.GG_A &&
							<>
								<div className={'nvrSelectBox'}>
									<select name="" id={'nvrSelectBox'} onChange={(e) => this.onChangeNVRPlace(e.target.value)}>
										<option value="41">경기도청/도의회</option>
										<option value="43">경기도서관</option>
										<option value="45">경기신용보증재단</option>
									</select>
								</div>
							</>
					}
					{
						userInfo.siteID === ProjectResource.Site.GG_B &&
							<p className={'nvrSelectP'}>경기도청/도의회</p>
					}
					{
						userInfo.siteID === ProjectResource.Site.GG_D &&
						<p className={'nvrSelectP'}>경기도서관</p>
					}
					{
						userInfo.siteID === ProjectResource.Site.GG_E &&
						<p className={'nvrSelectP'}>복합시설관</p>
					}
					{
						userInfo.siteID === ProjectResource.Site.GG_F &&
						<p className={'nvrSelectP'}>경기신용보증재단</p>
					}
					{
						userInfo.siteID === ProjectResource.Site.GG_G &&
						<p className={'nvrSelectP'}>경기도교육청</p>
					}
					{
						userInfo.siteID === ProjectResource.Site.GG_H &&
						<p className={'nvrSelectP'}>경기주택도시공사 신사옥</p>
					}
					<div className={'stgList'}>
						<span className={'stgScroll'}>
							{listView} 
						</span>
					</div>
					<ul className={'buttonWrap'}>
						<li className={'cancelBtn'} onClick={this.onClickCancle}>{i18n.t('common.취소')}</li>
						<li className={'saveBtn'} onClick={this.onClickSave}>{i18n.t('common.저장')}</li>
					</ul>
					{
						/* alert창 대신 사용 */
						this.state.confirmMessage.visible &&
						<ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
					}

				</NVRSettingComponent>
			</ModalBackgroundNVR>
		);
	}
}

export default NVRSetting_gg;