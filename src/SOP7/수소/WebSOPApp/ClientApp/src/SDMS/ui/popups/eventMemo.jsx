import React, { Component } from 'react';
import newStyles from "../../../Common/css/newStyle.module.css";

import sdmsCss from "../../../SDMS/css/sdms.module.css";
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';

class EventMemo extends Component {
    constructor(props) {
		super(props);
		this.state = {
			displayMemo: this.props.popupMemoContent,

			confirmMessage: {
				visible: false,
				title: "",
				messages: [""],
				buttons: [''],
				onClose: this.onCloseConfirmDialog,
				onClickButton: null
			},
		}
		this.props = props;
	}


	onChangeMemo = (e) => {
		this.setState({ displayMemo: e.target.value });
	}

	/* onSave = async () => {
		const result = await HistoryController.UpdateAlarmMemo(this.props.actionStepHistoryID, this.state.displayMemo);
		if (result) {
			this.props.setPopupMemo(false, this.props.actionStepHistoryID, this.state.displayMemo);
		}
		else {
			this.showConfirmDialog("오류", '메모를 저장 할 수 없습니다.', null, null);
		}
	} */


	onChangeMemo = (e) => {
		this.setState({ displayMemo: e.target.value });
	}


	render() {
		return (
			<>
				<div id={sdmsCss.hsMmo}>
					<div className={sdmsCss.memoCont}>
						<div className={sdmsCss.memoTitle}>
							<span>{i18n.t('sdms.eventMemo.메모 작성')}</span>
							<a className={sdmsCss.memoCancel} /* onClick={() => this.props.setPopupMemo(-1)} */>{i18n.t('common.닫기')}</a>
						</div>
						<div className={sdmsCss.memoContents}>
							<textarea name="" id="" cols="30" rows="10" className={"scroll-wrapper" + sdmsCss.memoTxt + "scrollbar scroll-textareaCss"} onChange={(e) => this.onChangeMemo(e)}>
								{this.state.displayMemo}
							</textarea>
						</div>
						<ul className={sdmsCss.memoBtn}>
							<li><a /* onClick={() => this.props.setPopupMemo(false)}*/>{i18n.t('common.삭제')}</a></li>
							<li><a onClick={() => this.onSave()}>{i18n.t('common.저장')}</a></li>
						</ul>
					</div>
				</div>
			</>
		);
	}
}

export default withTranslation()(EventMemo);