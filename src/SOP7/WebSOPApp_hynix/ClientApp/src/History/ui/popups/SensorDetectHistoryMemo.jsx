//import { Button } from '@amcharts/amcharts4/core';
import React, { Component } from 'react';
import content from '../../../Common/css/content.module.css';
import newStyles from "../../../Common/css/newStyle.module.css";
import ConfirmDialog from '../../../Common/ui/confirmDialog';
import SettingsStore from '../../../Settings/settingsStore';

import HistoryController from '../../services/historyController';

import { SensorDetectHistoryMemoComponent, SensorDetectHistoryMemoCenterComponent } from '../../../SDMS/styled/sdmsPopupsStyled';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';

import PopupDraggable from '../../../SDMS/ui/popups/popupDraggable';
import ProjectResource from '../../../Root/resource/id';

class SensorDetectHistoryMemo extends Component {
    static CommText1 = "소방 비화재보";
    static CommText2 = "디바이스 오감지, 오작동";
    static CommText3 = "디바이스 고장";
    static CommText4 = "디바이스 점검";
    static CommText5 = "소방 작동기능점검";

	constructor(props) {
		super(props);
		this.state = {
			popupMinWidth: 340, // 팝업 최소 너비
			popupMinHeight: 370, // 팝업 최소  높이

			displayMemo: this.props.popupMemoContent,

			confirmMessage: {
				visible: false,
				title: "",
				messages: [""],
                buttons: [i18n.t('common.확인')],
				onClose: this.onCloseConfirmDialog,
				onClickButton: null
			},
        }
		this.props = props;
        this.initPopupState = this.initPopupState.bind(this);

        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));

        this.refCommText1 = React.createRef();
        this.refCommText2 = React.createRef();
        this.refCommText3 = React.createRef();
        this.refCommText4 = React.createRef();
        this.refCommText5 = React.createRef();
        this.refMemo = React.createRef();
	}

    componentDidMount() {
        if (!this.props.fromHistoryMenu) {
            this.initPopupState();

            this.props.setActiveDragPopup(this.props.popupType);
        }

        // 솔브레인 경우 자주 사용하는 문구
        if (ProjectResource.siteID === ProjectResource.Site.Soulbrain) {
            const displayMemo = this.state.displayMemo;

            if (displayMemo === SensorDetectHistoryMemo.CommText1)
                this.refCommText1.current.checked = true;
            else if (displayMemo === SensorDetectHistoryMemo.CommText2)
                this.refCommText2.current.checked = true;
            else if (displayMemo === SensorDetectHistoryMemo.CommText3)
                this.refCommText3.current.checked = true;
            else if (displayMemo === SensorDetectHistoryMemo.CommText4)
                this.refCommText4.current.checked = true;
            else if (displayMemo === SensorDetectHistoryMemo.CommText5)
                this.refCommText5.current.checked = true;
            else 
                this.refMemo.current.checked = true;

            const openTextMemo = document.getElementById('openMemo');
            if (openTextMemo) {
                if (this.refMemo.current.checked)
                    openTextMemo.classList.add('memoOn');
                else
                    openTextMemo.classList.remove('memoOn');
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            var popup = document.getElementsByClassName('viewDashboardBoxD' + ' ' + 'viewDashboardAlarmMemo')[0];
            popup.style.zIndex = this.props.zIndex;
            console.log('SensorDetectHistoryMemo changed', popup.style.zIndex);
        }

        if (this.props.actionStepHistoryID !== prevProps.actionStepHistoryID) {           
            // 솔브레인 경우 자주 사용하는 문구
            if (ProjectResource.siteID === ProjectResource.Site.Soulbrain) {
                const displayMemo = this.props.popupMemoContent;

                if (displayMemo === SensorDetectHistoryMemo.CommText1)
                    this.refCommText1.current.checked = true;
                else if (displayMemo === SensorDetectHistoryMemo.CommText2)
                    this.refCommText2.current.checked = true;
                else if (displayMemo === SensorDetectHistoryMemo.CommText3)
                    this.refCommText3.current.checked = true;
                else if (displayMemo === SensorDetectHistoryMemo.CommText4)
                    this.refCommText4.current.checked = true;
                else if (displayMemo === SensorDetectHistoryMemo.CommText5)
                    this.refCommText5.current.checked = true;
                else
                    this.refMemo.current.checked = true;

                const openTextMemo = document.getElementById('openMemo');
                if (openTextMemo) {
                    if (this.refMemo.current.checked)
                        openTextMemo.classList.add('memoOn');
                    else
                        openTextMemo.classList.remove('memoOn');
                }
            }

            this.setState({ displayMemo: this.props.popupMemoContent });
        }
    }

	initPopupState() {
        var popup = document.getElementsByClassName('viewDashboardBoxD' + ' ' + 'viewDashboardAlarmMemo')[0];

		//DB에 값이 있을 경우에만
		if (typeof this.props.popupState !== 'undefined') {
			popup.style.left = this.props.popupState.x;
			popup.style.top = this.props.popupState.y;
			popup.style.width = this.props.popupState.width;
			popup.style.height = this.props.popupState.height;
		}

		this.setState({ popup: popup });
    }

    resetPopupState = (popupState) => {
        let data = popupState;

        if (data.actionType === 'RESET_POPUP') {
            this.repositionPopup(data.popupState);
        }
    }

    repositionPopup(popupState) {
        let data = popupState.alarmMemo;

        if (data === null || data === undefined)
            return;

        let popup = document.getElementsByClassName('viewDashboardBoxD' + ' ' + 'viewDashboardAlarmMemo')[0];
        if (popup === null || popup === undefined)
            return;

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
    }

	onChangeMemo = (e) => {
		this.setState({ displayMemo: e.target.value });
    }

    onSave = async () => {
        let displayMemo = this.state.displayMemo;

        // 솔브레인 경우 자주 사용하는 문구
        if (ProjectResource.siteID === ProjectResource.Site.Soulbrain) {
            if (this.refCommText1.current.checked)
                displayMemo = SensorDetectHistoryMemo.CommText1;
            else if (this.refCommText2.current.checked)
                displayMemo = SensorDetectHistoryMemo.CommText2;
            else if (this.refCommText3.current.checked)
                displayMemo = SensorDetectHistoryMemo.CommText3;
            else if (this.refCommText4.current.checked)
                displayMemo = SensorDetectHistoryMemo.CommText4;
            else if (this.refCommText5.current.checked)
                displayMemo = SensorDetectHistoryMemo.CommText5;
        }

        const result = await HistoryController.UpdateAlarmMemo(this.props.actionStepHistoryID, displayMemo);
		if (result) {
            this.props.setPopupMemo(false, this.props.actionStepHistoryID, displayMemo);
		}
		else {
            /* this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('history.memo.메모를 저장할 수 없습니다')], null, null); */
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

    openTextMemo = (isOpen) => {
        const openTextMemo = document.getElementById('openMemo');

        if (isOpen)
            openTextMemo.classList.add('memoOn');
        else
            openTextMemo.classList.remove('memoOn');
    }

    render() {
        let memoUI = null;

        if (ProjectResource.siteID === ProjectResource.Site.Soulbrain) {
            memoUI =
                <>
                <div className={'dslTop' + " " + 'dslGrd'}>
                    <h5 className={'dslTitle'}>
                        {i18n.t('history.memo.메모 작성')}
                    </h5>
                    <a className={'dslX'} onClick={() => this.props.setPopupMemo(false)}></a>
                </div>
                <div className={'memoContents'}>
                    <ul className={'memoContentsUl'}>
                        <li className={'memoRadio'}>
                            <input ref={this.refCommText1} type="radio" id="commText1" name="commText" onClick={() => this.openTextMemo(false)} />
                            <label name="commText" htmlFor="commText1" >{SensorDetectHistoryMemo.CommText1}</label>
                        </li>
                        <li className={'memoRadio'} >
                            <input ref={this.refCommText2} type="radio" id="commText2" name="commText" onClick={() => this.openTextMemo(false)} />
                            <label name="commText" htmlFor="commText2">{SensorDetectHistoryMemo.CommText2}</label>
                        </li>
                        <li className={'memoRadio'}>
                            <input ref={this.refCommText3} type="radio" id="commText3" name="commText" onClick={() => this.openTextMemo(false)} />
                            <label name="commText3" htmlFor="commText3">{SensorDetectHistoryMemo.CommText3}</label>
                        </li>
                        <li className={'memoRadio'}>
                            <input ref={this.refCommText4} type="radio" id="commText4" name="commText" onClick={() => this.openTextMemo(false)} />
                            <label name="commText" htmlFor="commText4">{SensorDetectHistoryMemo.CommText4}</label>
                        </li>
                        <li className={'memoRadio'}>
                            <input ref={this.refCommText5} type="radio" id="commText5" name="commText" onClick={() => this.openTextMemo(false)} />
                            <label name="commText" htmlFor="commText5">{SensorDetectHistoryMemo.CommText5}</label>
                        </li>
                        <li className={'memoRadio'}>
                            <input ref={this.refMemo} type="radio" id="memo" name="commText" onClick={() => this.openTextMemo(true)} />
                            <label name="commText" htmlFor="memo">직접입력</label>
                        </li>
                        <div className={'memoTextarea'}>
                            <textarea name="" cols="30" rows="10" id="openMemo" className={"scroll-wrapper" + 'memoTxt' + "scrollbar scroll-textareaCss"} onChange={(e) => this.onChangeMemo(e)}
                                value={(this.state.displayMemo && this.state.displayMemo.length > 0) ? this.state.displayMemo : ''}>
                            </textarea>
                        </div>
                    </ul>
                </div>
                <ul className={'memoBtn'}>
                    <li><a onClick={() => this.props.setPopupMemo(false)}>{i18n.t('common.취소')}</a></li>
                    <li><a onClick={() => this.onSave()}>{i18n.t('common.저장')}</a></li>
                </ul>
                </>;
        }
        else {
            memoUI =
                <>
                <div className={'dslTop' + " " + 'dslGrd'}>
                    <h5 className={'dslTitle'}>
                        {i18n.t('history.memo.메모 작성')}
                    </h5>
                    <a className={'dslX'} onClick={() => this.props.setPopupMemo(false)}></a>
                </div>
                <div className={'memoContents'}>
                    <textarea name="" id="" cols="30" rows="10" className={"scroll-wrapper" + 'memoTxt' + "scrollbar scroll-textareaCss"} onChange={(e) => this.onChangeMemo(e)}
                        value={(this.state.displayMemo && this.state.displayMemo.length > 0) ? this.state.displayMemo : ''}>
                    </textarea>
                </div>
                <ul className={'memoBtn'}>
                    <li><a onClick={() => this.props.setPopupMemo(false)}>{i18n.t('common.취소')}</a></li>
                    <li><a onClick={() => this.onSave()}>{i18n.t('common.저장')}</a></li>
                </ul>
                </>;
        }

        let hsMmoClassName = null;
        if (!this.props.fromHistoryMenu) {
            hsMmoClassName = 'viewDashboardBoxD' + ' ' + 'viewDashboardAlarmMemo';
        }

        if (!this.props.fromHistoryMenu) {
            return (
                <SensorDetectHistoryMemoComponent id={this.props.popupType} className={hsMmoClassName}>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={380}
                        popupMinHeight={370}
                        topSize={32}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                    >
                        {memoUI}
                    </PopupDraggable>
                </SensorDetectHistoryMemoComponent>
            );
        }
        else {
            return (
                <SensorDetectHistoryMemoCenterComponent id={this.props.popupType} className={hsMmoClassName}>                    
                    {memoUI}
                </SensorDetectHistoryMemoCenterComponent>
            );
        }

        
	}
}

export default withTranslation()(SensorDetectHistoryMemo);