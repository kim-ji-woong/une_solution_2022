import React, { Component } from 'react';
import re from '../Recruitment/css/recruitment.module.css';
import Resource from '../resource/id';
import $ from 'jquery';


class PersonalInforPop extends Component {

    constructor(props) {
        super(props);

        this.props = props;
        this.state = {
            //disUI: this.displayUI(),
            language: null,
            isOpenPopup: false,
        }

        this.initLanguage();

        this.state.personalPopUp = this.displaypersonalPopUp();
        this.openPopup = this.openPopup.bind(this);
    }

    openPopup() {
        this.setState({
           isOpenPopup: true,
        })
    }

    initLanguage = () => {
        let language = localStorage.getItem('Language');

        if (language === null || language === undefined) {
            language = Resource.Language.ko;
        }

        this.state.language = language;
    }

    resizeUI() {
        this.setStat({ personalPopUp: this.displaypersonalPopUp() });
    }

    closePopup() {
        this.setState({
            isOpenPopup: true,
        })
    }

    componentDidMount() {
        $(document).mouseup(function (e) {
            var LayerPopup = $('.' + re.personalInfoBox);
            if (LayerPopup.has(e.target).length === 0) {
                //LayerPopup.removeClass("show");
                LayerPopup.hide();
            }
        });
    }

    displaypersonalPopUp = () => {
        let displaypersonalPopUp = [];
        let language = localStorage.getItem('Language');


        if (language === null || language === undefined) {
            language = Resource.Language.ko;
        }

        if (language === Resource.Language.ko) {
            displaypersonalPopUp.push(
                <>
                    <div className={re.personalInfoBox} onClick={this.props.onClose}>
                        <span className={re.personalTitle1}>고객님의 소중한 개인 정보는 다음과 같은 정책에 따라 수집 및 이용되며
                                                            (주)유엔이는 수집된 정보를 투명하고안전하게 보호 관리할 것을 약속드립니다.</span>
                        <span className={re.personalText1}>개인 정보의 수집ㆍ이용 목적</span>
                        <span className={re.personalText2}>고객님이 신청하신 문의에 대해 보다 정확한 답변을 위해 수집됩니다.</span>
                        <span className={re.personalText3}>수집 항목</span>
                        <span className={re.personalText4}>회사명, 성함, 연락처, 이메일, 문의 내용</span>
                        <span className={re.personalText5}>보유 및 이용 기간</span>
                        <span className={re.personalText6}>회사는 개인 정보 수집 및 이용목적이 달성된 후 지체 없이 파기합니다.</span>
                        {/* <span className={re.personalClose} onClick={this.props.onClose}>닫기</span> */}
                        <span className={re.personalClose} onClick={this.props.closePopup}>닫기</span>
                    </div>
                </>
            );
        } else {
            displaypersonalPopUp.push(
                <>
                    <div className={re.personalInfoBox} onClick={this.props.onClose}>
                        <span className={re.personalTitle1}>Your personal information is collected and utilized in accordance with the following policies:
                                                            We promise to protect and manage the collected information transparently and securely.</span>
                        <span className={re.personalText1}>Purpose of collection and use of personal information</span>
                        <span className={re.personalText2}>The questions you have requested will be collected for a more accurate answer.</span>
                        <span className={re.personalText3}>Collections</span>
                        <span className={re.personalText4}>Company name, name, contact, email, contact details</span>
                        <span className={re.personalText5}>Retention and Utilization Period</span>
                        <span className={re.personalText6}>We destroy it immediately after the purpose of collecting and using personal information is achieved.</span>
                        <span className={re.personalClose} onClick={this.props.onClose}>닫기</span>
                    </div>
                </>
            );
        }
        return displaypersonalPopUp;
    }


    render() {

        //setTimeout(() => { this.resizeUI() }, 500);
        let personalPopUp = this.displaypersonalPopUp();

        return (
            <>
                {/* <div className={re.personalInfoBox} onClick={this.props.onClose}>
                    <span className={re.personalTitle1}>{Resource.ID.personal.personalTitle}</span>
                    <span className={re.personalTitle2}>{Resource.ID.personal.personalTitle2}</span>
                    <span className={re.personalText1}>{Resource.ID.personal.personalSubTitle1}</span>
                    <span className={re.personalText2}>{Resource.ID.personal.personalSubTitle2}</span>
                    <span className={re.personalText3}>{Resource.ID.personal.personalSubTitle3}</span>
                    <span className={re.personalText4}>{Resource.ID.personal.personalSubTitle4}</span>
                    <span className={re.personalText5}>{Resource.ID.personal.personalSubTitle5}</span>
                    <span className={re.personalText6}>{Resource.ID.personal.personalSubTitle6}</span>
                </div> */}

                {personalPopUp}
            </>
        );
    }
}
export default PersonalInforPop;