import React, { Component } from 'react';
import $ from 'jquery';
import uis from '../../../Common/css/ui.module.css';
import uneStyles from '../../../Common/css/uneCommon.module.css';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';

class EndPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }

        this.props = props;
    }

    componentDidMount() {

        this.timerHandle = setTimeout(() => {
            this.onClose();
        }, 10000);
    }

    onClose = () => {
        if (this.timerHandle) {
            clearTimeout(this.timerHandle);
        }
        const history = this.props.sopRunData.sopData.currentActionStep._ActionStepHistory;
        this.props.closeSOP(null, history.id, history.endTime, this.props.loginUser.id);
        this.props.changeContent('');
    }

    onClickClose = () => {
        this.onClose();
    }

    componentWillUnmount = () => {
        if (this.timerHandle) {
            clearTimeout(this.timerHandle);
        }
    }

    render() {
        const sopRunData = this.props.sopRunData;
        const detectTime = sopRunData.sopData.currentActionStep._ActionStepHistory.detectTime.replace('T', ' ');
        const beginTime = sopRunData.sopData.currentActionStep._ActionStepHistory.beginTime.replace('T', ' ');
        const endTime = sopRunData.sopData.currentActionStep._ActionStepHistory.endTime.replace('T', ' ');

        return (
            <div className={uneStyles.endBox}>
                <div className={uneStyles.endBoxTop}>
                    <p>{i18n.t('sopSimulator.formText.SOP 결과 요약')}</p>
                    <a onClick={() => this.onClickClose()}>{i18n.t('common.닫기')}</a>
                </div>
                <div className={uneStyles.endBoxCont}>
                    <dl>
                        <dt>1.{i18n.t('sopSimulator.formText.SOP 유형')}</dt>
                        <dd>-{i18nUtil.convertText(sopRunData.sopData.disaster.disasterName)}</dd>
                        <dt>2.{i18n.t('sopSimulator.formText.재난 위치')}</dt>
                        <dd>-{sopRunData.position}</dd>
                        <dt>3.{i18n.t('sopSimulator.formText.발생시간')}</dt>
                        <dd>-{detectTime}</dd>
                        <dt>4.{i18n.t('sopSimulator.formText.SOP 시작 시간')}</dt>
                        <dd>-{beginTime}</dd>
                        <dt>5.{i18n.t('sopSimulator.formText.SOP 종료 시간')}</dt>
                        <dd>-{endTime}</dd>
                        <dt>6.{i18n.t('sopSimulator.formText.단계')}</dt>
                        <dd>-{sopRunData.sopData.currentActionStep.stepName}</dd>
                    </dl>
                </div>
                <div className={uneStyles.endBoxBtn}>
                    <a className={uneStyles.endBoxClose} onClick={() => this.onClickClose()}>{i18n.t('common.닫기')}</a>
                    {/*<a className={uneStyles.endBoxDetail}>{i18n.t('sopSimulator.formText.상세보기')}</a>*/}
                </div>
            </div>
        );
    }
}

export default withTranslation()(EndPopup);