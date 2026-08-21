import React, { Component } from 'react';
import $ from 'jquery';
import uis from '../../../Common/css/ui.module.css';
import uneStyles from '../../../Common/css/uneCommon.module.css';
import styles from '../../../Common/css/style.module.css';
import { ModalBackground } from '../../../Root/styled/theme';

class EndPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTooltip: false,
            tooltipTop: 0,
            tooltipLeft: 0,
            tooltipContent: '',
        }

        this.props = props;
    }

    componentDidMount() {

        //this.timerHandle = setTimeout(() => {
        //    this.onClose();
        //}, 10000);
    }

    handleTooltip = (e, data) => {
        const target = e.target;
        const parent = e.target.parentElement;

        const parentNode = parent.getBoundingClientRect();
        const targetNode = target.getBoundingClientRect();

        // span.width > li.width &&
        if(targetNode.width > parentNode.width) {

            this.setState({
                showTooltip: !this.state.showTooltip,
                tooltipTop: parentNode.top + 33,
                tooltipLeft: parentNode.left + 10,
                tooltipContent: data
            });
        }
    }

    removeTooltip = () => {
        this.setState({ showTooltip: false });
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
        const _actionStepHistory = sopRunData.sopData.currentActionStep._ActionStepHistory;
        const detectTime = _actionStepHistory.detectTime.replace('T', ' ');
        const beginTime = _actionStepHistory.beginTime.replace('T', ' ');
        const endTime = _actionStepHistory.endTime.replace('T', ' ');

        const {showTooltip, tooltipTop, tooltipLeft, tooltipContent} = this.state;

        return (
            <ModalBackground className='UI_Section'>
            {
                showTooltip &&
                <div id={styles.tooltipArea} style={{ top: tooltipTop, left: tooltipLeft }}>
                    {tooltipContent}
                </div>
            }
            <div className={uneStyles.endBox + ' UI_Section'}>
                <div className={uneStyles.endBoxTop}>
                    <p>SOP 결과요약</p>
                    <a onClick={() => this.onClickClose()}>닫기</a>
                </div>
                <div className={uneStyles.endBoxCont}>
                    <dl>
                        <dt>1.SOP 유형</dt>
                        <dd>{sopRunData.sopData.disaster.disasterName}</dd>
                    </dl>
                    <dl>
                        <dt>2.재난 위치</dt>
                        <dd>
                            <span
                                onMouseOver={(e) => this.handleTooltip(e, sopRunData.position)}
                                onMouseLeave={() => this.removeTooltip()}
                            >
                                {sopRunData.position}
                            </span>
                        </dd>
                    </dl>
                    <dl>
                        <dt>3.발생시간</dt>
                        <dd>{detectTime}</dd>
                    </dl>
                    <dl>
                        <dt>4.SOP 시작시간</dt>
                        <dd>{beginTime}</dd>
                    </dl>
                    <dl>
                        <dt>5.SOP 종료시간</dt>
                        <dd>{endTime}</dd>
                    </dl>
                    <dl>
                        <dt>6.단계</dt>
                        <dd>{sopRunData.sopData.currentActionStep.stepName}</dd>
                    </dl>
                </div>
                <div className={uneStyles.endBoxBtn}>
                    <a className={uneStyles.endBoxClose} onClick={() => this.onClickClose()}>닫기</a>
                    {/*<a className={uneStyles.endBoxDetail}>상세보기</a>*/}
                </div>
            </div>
            </ModalBackground>
        );
    }
}

export default EndPopup;