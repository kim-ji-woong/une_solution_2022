import React, { Component } from 'react';
import re from '../Recruitment/css/recruitment.module.css';

import Resource from '../resource/id';


class ContactPop extends Component {

    constructor(props) {
        super(props);

        this.props = props;
        this.state = {
            //disUI: this.displayUI(),
            language: null,
        }

        this.initLanguage();
        this.state.contactPopUp = this.displaycontactPopUp();
    }


    initLanguage = () => {
        let language = localStorage.getItem('Language');

        if (language === null || language === undefined) {
            language = Resource.Language.ko;
        }

        this.state.language = language;
    }

    resizeUI() {
        this.setState({ contactPopUp: this.displaycontactPopUp() });
    }

    displaycontactPopUp = () => {
        let displaycontactPopUp = [];
        let language = localStorage.getItem('Language');
        let widthSize = window.outerWidth;

        if (language === null || language === undefined) {
            language = Resource.Language.ko;
        }

        if (language === Resource.Language.ko) {
            displaycontactPopUp.push(
                <>
                    <div className={re.contactSendBox}>
                        <span className={re.checkIcon}></span>
                        <span className={re.sendCompletion}>전송 완료!</span>
                        <span className={re.contactText1}>문의하신 내용은 최대한 빠르게 답변해 드리겠습니다.</span>
                        <span className={re.contactText2}>주중 업무시간 외에는 답변을 드리기 어려운 점 양해의 말씀드립니다.</span>
                        <span className={re.contactPopClose} onClick={this.props.onClose}>닫기</span>
                    </div>
                </>
            );
        } else if (language === Resource.Language.en) {
            displaycontactPopUp.push(
                <>
                    <div className={re.contactSendBox}>
                        <span className={re.checkIcon}></span>
                        <span className={re.sendCompletion}>Sending complete!</span>
                        <span className={re.contactText1}>We will answer your inquiry as soon as possible.</span>
                        <span className={re.contactText2}>It is difficult to answer except during office hours.</span>
                        <span className={re.contactPopClose} onClick={this.props.onClose}>Close</span>
                    </div>
                </>
            );
        } else if (widthSize < 768) {
            displaycontactPopUp.push(
                <>
                    <div className={re.contactSendBox}>
                        <span className={re.checkIcon}></span>
                        <span className={re.sendCompletion}>전송 완료!</span>
                        <span className={re.contactText1}>문의하신 내용은 최대한 빠르게 답변해 드리겠습니다.</span>
                        <span className={re.contactText2}>주중 업무시간 외에는 답변을 드리기 어려운 점 양해의 말씀드립니다.</span>
                        <span className={re.contactPopClose} onClick={this.props.onClose}>닫기</span>
                    </div>
                </>
            );
        } else if (widthSize >= 1024) {
            displaycontactPopUp.push(
                <>
                    <div className={re.contactSendBox}>
                        <span className={re.checkIcon}></span>
                        <span className={re.sendCompletion}>전송 완료!</span>
                        <span className={re.contactText1}>문의하신 내용은 최대한 빠르게 답변해 드리겠습니다.</span>
                        <span className={re.contactText2}>주중 업무시간 외에는 답변을 드리기 어려운 점 양해의 말씀드립니다.</span>
                        <span className={re.contactPopClose} onClick={this.props.onClose}>닫기</span>
                    </div>
                </>
            );
        } else {
            displaycontactPopUp.push(
                <></>
            );
        }
        return displaycontactPopUp;
    }


    render() {

        setTimeout(() => { this.resizeUI() }, 500 );
        let contactPopUp = this.displaycontactPopUp();

        return (
            <>
                {contactPopUp}
            </>
        );
    }
}

export default ContactPop;