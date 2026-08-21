//import { Button } from '@amcharts/amcharts4/core';
import React, { Component } from 'react';
import newStyles from "../../../Common/css/newStyle.module.css";
import { i18n, withTranslation, i18nUtil } from '../../language/i18n';

class SpreadHistoryDetail extends Component {

	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		return (
			<div id={newStyles.hsMmo} className={newStyles.popup}>
				<div>
					<div>
						<div className={newStyles.hsmCont}>
							<div className={newStyles.hsmTitle}>
								<h3>{i18n.t('history.spreadDetail.문자 재발송')}</h3>
								<a href="javascript:popClose();" className={newStyles.hsmCls}>{i18n.t('common.닫기')}</a>
							</div>
							<h5 className={newStyles.hsmSub}>{i18n.t('history.spreadDetail.발송 문구')}</h5>
							<textarea name="" id="" cols="30" rows="10" className={"scroll-wrapper" + " " + newStyles.hsmTxt + "scroll-bar"}>{i18n.t('history.spreadDetail.T1-1 구역 화재발생 비상방송 실시')}</textarea>
							<h5 className={newStyles.hsmSub}>{i18n.t('history.spreadDetail.전파대상자')}</h5>
							<div className={"scroll-wrapper" + " " + newStyles.hsmSend + "scroll-bar"}>
								<ul className={newStyles.hsmUsr}>
									<li><input type="checkbox" name="" id="hsmUsr01" /><label htmlFor="hsmUsr01">{i18n.t('history.spreadDetail.안전관리팀 홍길동')}</label></li>
									<li><input type="checkbox" name="" id="hsmUsr02" /><label htmlFor="hsmUsr02">{i18n.t('history.spreadDetail.안전관리팀 홍길동')}</label></li>
									<li><input type="checkbox" name="" id="hsmUsr03" /><label htmlFor="hsmUsr03">{i18n.t('history.spreadDetail.안전관리팀 홍길동')}</label></li>
									<li><input type="checkbox" name="" id="hsmUsr04" /><label htmlFor="hsmUsr04">{i18n.t('history.spreadDetail.안전관리팀 홍길동')}</label></li>
									<li><input type="checkbox" name="" id="hsmUsr05" /><label htmlFor="hsmUsr05">{i18n.t('history.spreadDetail.안전관리팀 홍길동')}</label></li>
									<li><input type="checkbox" name="" id="hsmUsr06" /><label htmlFor="hsmUsr06">{i18n.t('history.spreadDetail.안전관리팀 홍길동')}</label></li>
									<li><input type="checkbox" name="" id="hsmUsr07" /><label htmlFor="hsmUsr07">{i18n.t('history.spreadDetail.안전관리팀 홍길동')}</label></li>
									<li><input type="checkbox" name="" id="hsmUsr08" /><label htmlFor="hsmUsr08">{i18n.t('history.spreadDetail.안전관리팀 홍길동')}</label></li>
									<li><input type="checkbox" name="" id="hsmUsr09" /><label htmlFor="hsmUsr09">{i18n.t('history.spreadDetail.안전관리팀 홍길동')}</label></li>
									<li><input type="checkbox" name="" id="hsmUsr10" /><label htmlFor="hsmUsr10">{i18n.t('history.spreadDetail.안전관리팀 홍길동')}</label></li>
								</ul>
							</div>
							<ul className={newStyles.hsmBtn}>
								<li><a href="javascript:popClose();">{i18n.t('common.취소')}</a></li>
								<li><a href="#">{i18n.t('history.spreadDetail.발송')}</a></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withTranslation()(SpreadHistoryDetail);