import React, { Component } from 'react';
import { RemainerSMSComponent } from '../../../styled/sdmsPopupsStyled';
import { i18n, withTranslation } from '../../../../language/i18n';

/// 잔류자 상황 전파 메시지 작성 팝업
/// props:
///   defaultMessage - textarea에 미리 채울 기본 문구
///   onSend(message) - 보내기 버튼 클릭 시 호출
///   onCancel() - 취소/닫기 버튼 클릭 시 호출
class RemainerSMSPopup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: props.defaultMessage || '',
        };
    }

    onChangeMessage = (e) => {
        this.setState({ message: e.target.value });
    }

    onClickSend = () => {
        this.props.onSend(this.state.message);
    }

    render() {
        return (
            <RemainerSMSComponent>
                <div className='sms-top'>
                    <h5 className='sms-title'>{i18n.t('sdms.worker.메시지 작성')}</h5>
                    <a className='sms-close' onClick={this.props.onCancel} />
                </div>
                <div className='sms-body'>
                    <textarea
                        className='sms-textarea'
                        value={this.state.message}
                        onChange={this.onChangeMessage}
                        placeholder={i18n.t('sdms.worker.메시지를 입력해주세요')}
                    />
                </div>
                <div className='sms-btn-area'>
                    <a className='sms-btn-send' onClick={this.onClickSend}>
                        {i18n.t('sdms.worker.보내기')}
                    </a>
                    <a className='sms-btn-cancel' onClick={this.props.onCancel}>
                        {i18n.t('common.취소')}
                    </a>
                </div>
            </RemainerSMSComponent>
        );
    }
}

export default withTranslation()(RemainerSMSPopup);
