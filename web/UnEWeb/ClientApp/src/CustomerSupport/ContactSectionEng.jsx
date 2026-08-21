import React, { Component } from 'react';
import { Link } from "react-router-dom";
import cIntro from '../CompanyIntro/css/company.module.css';
import bIntro from '../BusinessIntro/css/business.module.css';
import home from '../components/css/home.module.css';
import re from '../Recruitment/css/recruitment.module.css';
import '../components/css/home.css';
import $ from 'jquery';

import AOS from "aos";
import "aos/dist/aos.css";
import * as emailjs from "emailjs-com";

import PopupDom from '../CustomerSupport/PopupDom.jsx';
import ContactPop from '../CustomerSupport/ContactPop.jsx';
import PersonalInforPop from '../CustomerSupport/PersonalInforPop.jsx';

import Resource from '../resource/id';

class ContactSectionEng extends Component {
    static displayName = ContactSectionEng.name;

    constructor(props) {
        super(props);

        this.state = {
            isOpenPopup: false,
            isOpenPopup2: false,
            attachFile: null,
            moveScrollLeft: null,
            //checkTest:null
        }

        this.openPopup = this.openPopup.bind(this);
        this.openPopup2 = this.openPopup2.bind(this);
        this.closePopup = this.closePopup.bind(this);
        //this.closePopup2 = this.closePopup2.bind(this);


        this.refEmail = React.createRef();
        this.refPhone = React.createRef();
        this.refMemo = React.createRef();
        this.refCheckbox = React.createRef();
        this.refContactTarget = React.createRef();
        this.refCompany = React.createRef();
        this.refName = React.createRef();

        this.state.disContactUI = this.displayContactUI();
    }

    resizeUI() {
        this.setState({ disContactUI: this.displayContactUI() });

    }


    openPopup() {
        this.setState({
            isOpenPopup: true,
        })
    }

    openPopup2() {
        let temp = this.state.isOpenPopup2;

        if (temp === true) {
            temp = false;
        } else if (temp === false) {
            temp = true;
        }

        this.setState({
            isOpenPopup2: temp,
        })
    }

    closePopup() {
        this.setState({
            isOpenPopup: false,
        })
    }

    /* closePopup2() {
        this.setState({
            isOpenPopup2: false,
        })
    } */


    componentDidMount() {

        $(document).ready(function () {
            AOS.init();
        });

        $('.' + cIntro.dropdown).mouseover(function () {
            $('.' + cIntro.dropdownContent).show();
        });

        $('.' + cIntro.cMenu).mouseleave(function () {
            $('.' + cIntro.dropdownContent).hide();
        });

        $('#dropdownContent').click(function () {
            $('#dropdownContent span').hide();
        });

        $(document).ready(function () {
            $('.' + re.contactSend).click(function () {
                $('.' + re.contactSend).toggleClass("shadow");
            });
        })

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto'
        });

        $(function () {
            $(window).scroll(function () {
                if ($(this).scrollTop() > 500) {
                    $('#toTop').show();
                }
            });
            $(window).scroll(function () {
                if ($(this).scrollTop() > 3400) {
                    $('#toTop').hide();
                }
            });
            $('#toTop').click(function () {
                $('html, body').animate({
                    scrollTop: 0
                }, 300);
                return false;
            });
        });


        //$('.checkTest').click(function () {
        //    var checked = $('#aaa').is(':checked')
        //$('#aaa').prop('checked', !checked);
        //    $('.inputText').removeClass("inputEffect");
        //});

        /* const label5 = document.querySelector('.label4M');
        const options5 = document.querySelectorAll('.InquiryOptionItemM');
        const handleSelect5 = function (item) {
            label5.innerHTML = item.textContent;
            label5.parentNode.classList.remove('active');
        }
        options5.forEach(function (option5) {
            option5.addEventListener('click', function () { handleSelect5(option5) })
        })

        label5.addEventListener('click', function () {
            if (label5.parentNode.classList.contains('active')) {
                label5.parentNode.classList.remove('active');
            } else {
                label5.parentNode.classList.add('active');
            }
        }); */

        $(function () {
            $('.' + re.contactCompanyBoxM).keyup(function () {
                $('.' + re.contactCompanyBoxM).css({ border: 'solid 1px #4D8DE8' });
            });
        });
        $(function () {
            $('.' + re.contactCompanyBoxM).mouseleave(function () {
                $('.' + re.contactCompanyBoxM).css({ border: 'solid 1px #DDDDDD' });
            });
        });

        $(function () {
            $('.' + re.contactNameBoxM).keyup(function () {
                $('.' + re.contactNameBoxM).css({ border: 'solid 1px #4D8DE8' });
            });
        });
        $(function () {
            $('.' + re.contactNameBoxM).mouseleave(function () {
                $('.' + re.contactNameBoxM).css({ border: 'solid 1px #DDDDDD' });
            });
        });

        $(function () {
            $('.' + re.contactEmailBoxM).keyup(function () {
                $('.' + re.contactEmailBoxM).css({ border: 'solid 1px #4D8DE8' });
            });
        });
        $(function () {
            $('.' + re.contactEmailBoxM).mouseleave(function () {
                $('.' + re.contactEmailBoxM).css({ border: 'solid 1px #DDDDDD' });
            });
        });

        $(function () {
            $('.' + re.contactTextBoxMemoM).keyup(function () {
                $('.' + re.contactTextBoxMemoM).css({ border: 'solid 1px #4D8DE8' });
            });
        });
        $(function () {
            $('.' + re.contactTextBoxMemoM).mouseleave(function () {
                $('.' + re.contactTextBoxMemoM).css({ border: 'solid 1px #DDDDDD' });
            });
        });

    }

    moveTest = () => {
        var offset = $("#moveTest_obj").offset();
        $('html,body').animate({ scrollTop: offset.top }, 400);
    }

    onSend = async () => {
        if (this.refMemo.current === null || this.refContactTarget.current === null
            || this.refCompany.current === null || this.refName.current === null) {
            return;
        }

        if (this.refMemo.current.value.length === 0) {
            alert('문의 내용을 입력하세요');
            return;
        }

        if (this.refCheckbox.current.checked === false) {
            $('.inputText').addClass("inputEffect");
            alert('개인정보 취급 방침에 동의해주세요.');
        }

        try {

            // const ContactUSParam = {
            //     FromEmail: new File([], this.refEmail.current.value),
            //     //FromEmail: new File([], this.refEmail.current.value + '/' + this.refPhone.current.value), // 보내는 사람 메일 or 연락처 넣기
            //     //FromEmail: new File([], 'jsj930406@naver.com'),
            //     ToEmail: new File([], this.refContactTarget.current.value),
            //     Subject: new File([], '[UNEWeb] 문의하기'),
            //     Body: new File([], this.refMemo.current.value)
            // }
            //

            // const formData = new FormData();
            // formData.append('files', ContactUSParam.FromEmail);
            // formData.append('files', ContactUSParam.ToEmail);
            // formData.append('files', ContactUSParam.Subject);
            // formData.append('files', ContactUSParam.Body);
            //
            // if (this.state.attachFile !== null) {
            //     formData.append('files', this.state.attachFile);
            // }
            //
            // const res = await fetch('/Company/ContactUS', {
            //     method: 'post',
            //     body: formData
            // });
            //
            // const data = await res.json();
            //
            // if (this.refCheckbox.current.checked === true || data.success) {
            //     this.setState({ isOpenPopup: true });
            // }

            const templateParams = {
                subject: '[UNEWeb] 문의하기' + '\n' + this.refContactTarget.current.value,
                company: this.refCompany.current.value,
                name: this.refName.current.value,
                from_email: this.refEmail.current.value,
                message: this.refMemo.current.value,
                //to_email: this.refContactTarget.current.value,
            }

            // npm 설치
            // npm install emailjs-com

            const result = await emailjs.send(
                process.env.REACT_APP_EMAILJS_SERVICE_ID,
                process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
                templateParams,
                process.env.REACT_APP_EMAILJS_PUBLIC_KEY
            );

            if (result.status === 200) {
                this.setState({ isOpenPopup: true });
            }

        }
        catch (e) {
            console.log(e);
        }
    }

    onAttachFile = (e) => {
        if (e && e.target && e.target.files[0]) {
            this.setState({ attachFile: e.target.files[0] });
        }
    }

    displayContactUI = () => {
        let displayContactUI = [];
        let widthSize = window.outerWidth;

        if (widthSize < 768) {
            displayContactUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={re.conIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">Recruitment and Inquiry</span>
                            <span data-aos="fade-down" data-aos-duration="1000">Introduce U&E's recruitment, welfare benefits, and inquiries about the company.</span>
                        </div>
                        <div id="sectionRecruit">
                            <div className={bIntro.spatialInforContentsSect}>
                                <div className={re.recruitArea}>
                                    <div className={re.talentedBox}>
                                        <span className={re.talentedTitle} data-aos="fade-down" data-aos-duration="1000">Recruitment</span>
                                        <span className={re.talentedConts}>We are looking for talented people who constantly challenge innovation, pursue the best professionalism, and communicate with an open mind.</span>
                                        <div className={re.talentedFlexBox}>
                                            <div className={re.tFlex1}>
                                                <div className={re.tBox1}>Creative talent</div>
                                                <div className={re.tBox2}>
                                                    <span><span className={re.tBoldText}>I</span>nnovation</span>
                                                    <span>A person who leads innovative changes with creative and challenging mindset</span>
                                                </div>
                                            </div>
                                            <div className={re.tFlex2}>
                                                <div className={re.tBox3}>Professional talent</div>
                                                <div className={re.tBox4}>
                                                    <span><span className={re.tBoldText}>P</span>rofessional</span>
                                                    <span>A person who strives in his/her field and has the best expertise</span>
                                                </div>
                                            </div>
                                            <div className={re.tFlex3}>
                                                <div className={re.tBox5}>Open-minded talent</div>
                                                <div className={re.tBox6}>
                                                    <span><span className={re.tBoldText}>C</span>ommunication</span>
                                                    <span>A person who communicates with an open mind, and respects customers and members</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             </div>
                         </div>

                        <div className={re.recruitSubBoxS}>
                            <span className={re.reCircle}></span>
                            <span className={re.recruitSubTitle}>Process and Announcement</span>
                            <span className={re.recruitSubConts}>We follows a<span>fair and transparent recruitment process</span>to accurately determine the qualifications and capabilities of applicants.</span>
                            <span className={re.recruitSubConts2}>(※ For more information, please check the job posting, and some changes may be made depending on our circumstances.)</span>
                                <div className={re.recruitShape}>
                                    <span className={re.firstMeet}>Document screening</span>
                                    <span className={re.dashedLineE}></span>
                                    <span className={re.recruitCircle}></span>
                                    <span className={re.document}>First interview</span>
                                <div className={re.recruitShape2}>
                                    <span className={re.dashedLine2E}></span>
                                    <span className={re.recruitCircle2}></span>
                                </div>
                                    <span className={re.lastMeet}>Executive interview</span>
                                    <span className={re.dashedLine3E}></span>
                                    <span className={re.recruitCircle3}></span>
                                    <span className={re.accept}>Final pass</span>
                                </div>
                            <span className={re.shortcut}><a href="https://www.jobkorea.co.kr/Recruit/Co_Read/Recruit/C/une9966?ChkDispType=1">Recruit Announcement</a></span>
                            {/* <span className={re.explanation}>※상세 일정 및 전형 과정은 회사 사정에 따라 변경될 수 있으며, 자세한 내용은 아래 채용공고를 확인해 주시기 바랍니다.</span> */}
                        </div>

                        <div id="sectionBenefits">
                            <div className={re.benefitsBoxS}>
                                <span className={re.benefitsTitle} data-aos="fade-down" data-aos-duration="1000">Welfare & Benefits</span>
                                <span className={re.benefitsTitle2}>We will repay members for his/her efforts to achieve goals and self-development to improve capabilities.</span>
                                <div className={re.benefitsArea}>
                                    <div className={re.payBoxS}>
                                        <span className={re.payIconBoxImg}></span>
                                        <span className={re.payIconFont}>Salary and Compensation</span>
                                        <div className={re.payTextBox}>
                                            <span>Incentive payment</span>
                                            <span>Support for lunch and meal cost</span>
                                            <span>Support for business activity expenses</span>
                                            <span>Rewards for long-term employees</span>
                                            <span>Support for four major insurances</span>
                                            <span>Support for retirement pensions</span>
                                        </div>
                                    </div>

                                    <div className={re.environmentBoxS}>
                                        <span className={re.environmentIconBoxImg}></span>
                                        <span className={re.environmentIconBoxFont}>Working environment</span>
                                        <div className={re.environmentTextBox}>
                                            <span>Flexible working hour system</span>
                                            <span>Congratulatory and condolence leaves</span>
                                            <span>Summer holidays</span>
                                            <span>Encouragement of childbirth and Parental leave</span>
                                            <span>Encouragement of annual leave use</span>
                                            <span>Casual(free) dresscode</span>
                                            <span>Holiday gift</span>
                                        </div>
                                    </div>

                                    <div className={re.developmentBoxS}>
                                        <span className={re.developIconBoxImg}></span>
                                        <span className={re.developIconBoxFont}>Competency development</span>
                                        <div className={re.developmentTextBox}>
                                            <span>Support for book purchase</span>
                                            <span>and education expenses,</span>
                                            <span>certification acquisition costs,</span>
                                            <span>various self-improvement expenses</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="sectionInquiry">
                            <div className={re.InquiryBoxS}>
                                <div className={re.InquiryArea}>
                                    <span className={re.contactTitle} data-aos="fade-down" data-aos-duration="1000">Contact us</span>
                                    <span className={re.contactSideTitle}>Please feel free to ask any questions you have about the company. A person in charge of each field will reply to you.
                                                                         (※ Weekday Business hours: 08:00~17:00, Lunch time: 11:30~12:30. We closed on Saturdays, Sundays, and public holidays.)</span>

                                    <div className={re.conFirstBoxM}>
                                        <span className={re.conKindNameM}>Inquiry type</span>
                                        {
                                            <>
                                                {/* <div class="InquirySelectBoxM">
                                                <button class="label4M" className={re.contactOp} value="jsj930406@unes.co.kr">{Resource.ID.homeContact.conKingNamePlace}</button>
                                                <ul class="InquiryOptionListM" ref={this.refContactTarget}>
                                                    <li class="InquiryOptionItemM" value="jsj930406@unes.co.kr">{Resource.ID.homeContact.conkingSelect1}</li>
                                                    <li class="InquiryOptionItemM" value="jsj930406@unes.co.kr">{Resource.ID.homeContact.conkingSelect2}</li>
                                                    <li class="InquiryOptionItemM" value="jsj930406@unes.co.kr">{Resource.ID.homeContact.conkingSelect3}</li>
                                                    <li class="InquiryOptionItemM" value="jsj930406@unes.co.kr">{Resource.ID.homeContact.conkingSelect4}</li>
                                                    <li class="InquiryOptionItemM" value="jsj930406@unes.co.kr">{Resource.ID.homeContact.conkingSelect5}</li>
                                                </ul>
                                            </div> */}

                                                {/* <select ref={this.refContactTarget}>
                                              <option value="jsj930406@unes.co.kr">경영지원팀</option>
                                              <option value="jsj930406@unes.co.kr">사업팀</option>
                                              <option value="jsj930406@unes.co.kr">전략기획팀</option>
                                              <option value="jsj930406@unes.co.kr">개발1팀</option>
                                              <option value="jsj930406@unes.co.kr">개발2팀</option>
                                              <option value="jsj930406@unes.co.kr">스마플TF팀</option>
                                            </select> */}

                                                
                                            </>
                                        }<select ref={this.refContactTarget} class="InquiryHomeSelect">
                                        <option class="InquiryHomeOptionItem" value="Business Proposal/Partnership">Business Proposal/Partnership</option>
                                        <option class="InquiryHomeOptionItem" value="Safety Management Area">Safety Management Area</option>
                                        <option class="InquiryHomeOptionItem" value="Digital Twin Area">Digital Twin Area</option>
                                        <option class="InquiryHomeOptionItem" value="Spatial Information Area">Spatial Information Area</option>
                                        <option class="InquiryHomeOptionItem" value="General Information">General Information</option>
                                    </select>
                                    </div>
                                    <div className={re.conSecondBoxM}>
                                        <div className={re.conLeftBoxM}>
                                            <span className={re.conLeftTBox}>
                                                <span className={re.companyNameM}>Company name</span>
                                                <span className={re.companyNameSelect}>* Optional</span>
                                            </span>
                                            <input type="text" className={re.contactCompanyBoxM} placeholder="Enter company name" ref={this.refCompany} />
                                        </div>
                                        <div className={re.conMiddleBoxM}>
                                            <span className={re.conPeopleNameM}>Name</span>
                                            <input type="text" className={re.contactNameBoxM} placeholder="Please enter your name" ref={this.refName} />
                                        </div>
                                        <div className={re.conRightBoxM}>
                                            <span className={re.contactEmailM}>E-mail</span>
                                            <input type="text" ref={this.refEmail} className={re.contactEmailBoxM} placeholder="Please enter your email" />
                                        </div>
                                    </div>
                                    <div className={re.conThirdBoxM}>
                                        <span className={re.InquiryContentsM}>Content</span>
                                        <textarea ref={this.refMemo} className={re.contactTextBoxMemoM} type="text" placeholder="Please enter your inquiry"></textarea>
                                    </div>
                                    <div className={re.conFourthBoxM}>
                                        <div className={re.conInputArea}>
                                            {/* <label><input ref={this.refCheckbox} class="checkTest" type="checkbox" name="color" value="red" onClick={this.checkTest} id="aaa" /><p class="inputText">개인정보 취급 방침에 동의합니다.</p></label> */}
                                            <input type="checkbox" ref={this.refCheckbox} class="checkTest" id="check1" name="color" value="red" onClick={this.checkTest} /><label htmlFor={"check1"}></label><p class="inputTextM">I agree with the personal information handling policy.</p>
                                            <span className={re.personalInforM} id="popupDom" onClick={() => this.openPopup2()}>View policy</span>
                                            {
                                                this.state.isOpenPopup2 &&
                                                <PopupDom>
                                                    <PersonalInforPop onClose={this.closePopup} />
                                                </PopupDom>
                                            }
                                        </div>
                                    </div>
                                    <span>
                                        <button type="button"
                                            id="popupDom"
                                            className={re.contactSendM}
                                            onClick={() => this.onSend()}
                                        >Send Question
                                        </button>
                                        {
                                            this.state.isOpenPopup &&
                                            <PopupDom>
                                                <div className={re.shadow}></div>
                                                <ContactPop onClose={this.closePopup} />
                                            </PopupDom>
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={home.footBox}>
                            <div className={home.footLeftArea}>
                                <div className={home.footTitleBox}>
                                    <span className={home.footTitle}>U&E</span>
                                    <a href="../../resource/une_companyInfo_2024.pdf" download>
                                        <span className={home.companyDown}>
                                            <span className={home.companyDownText}>Company Introduction</span>
                                            <span className={home.companyImg}></span>
                                        </span>
                                    </a>
                                </div>
                                <div className={home.footContents}>
                                    <span>Corporate Registration Number: 502-86-09535</span>
                                    <div className={home.footConTop}>
                                        <span>Tel: 82-2-714-4133</span>
                                        <span>Fax: 82-2-714-4134</span>
                                    </div>
                                    <span className={home.footEmail}>E-mail:<a href="mailto:team_manager@unes.co.kr" style={{ color: '#666666', marginLeft: '6px' }}>team_manager@unes.co.kr</a></span>
                                    <div className={home.footConBottom}>
                                        <span className={home.footBold}>Address (Seoul) : 1F, Juyeon Bldg, 345, Cheongpa-ro, Yongsan-gu, Seoul, Republic of Korea (Zip code: 04303)</span>
                                        <span><Link to="/directions">Map</Link></span>
                                    </div>
                                    <span>{/* 본사 : 대구 달서구 달구벌대로 1053, 계명대학교 첨단산업지원센터 108호 (우:42601)*/}</span>
                                </div>
                                <div className={home.footContents2}>
                                    <span className={home.footText}>CopyrightⓒU&E All rights reserved.</span>
                                </div>
                            </div>
                            <div className={home.footIconArea}>
                                <div className={home.footIconBox}>
                                    <span><a target="_blank" href="https://www.youtube.com/channel/UC_DmpJ1xIYW9faxTi1M8TMQ"><span className={home.footYouTube}></span></a></span>
                                    <span><a target="_blank" href="https://www.instagram.com/unes.kr"><span className={home.footinstagram}></span></a></span>
                                    <span><a target="_blank" href="https://www.facebook.com/%EC%9C%A0%EC%97%94%EC%9D%B4-100778369074049"><span className={home.footFacebook}></span></a></span>
                                </div>
                            </div>
                         </div>
                    </div>
                </>
            );
        } else if (640 <= widthSize && widthSize <= 959) {  /* 가로 모바일 */
            displayContactUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={re.conIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">Recruitment and Inquiry</span>
                            <span data-aos="fade-down" data-aos-duration="1000">Introduce U&E's recruitment, welfare benefits, and inquiries about the company.</span>
                        </div>
                        <div id="sectionRecruit">
                            <div className={bIntro.spatialInforContentsSect}>
                                <div className={re.recruitArea}>
                                    <div className={re.talentedBox}>
                                        <span className={re.talentedTitle} data-aos="fade-down" data-aos-duration="1000">Recruitment</span>
                                        <span className={re.talentedConts}>We are looking for talented people who constantly challenge innovation, pursue the best professionalism, and communicate with an open mind.</span>
                                        <div className={re.talentedFlexBox}>
                                            <div className={re.tFlex1}>
                                                <div className={re.tBox1}>Creative talent</div>
                                                <div className={re.tBox2}>
                                                    <span><span className={re.tBoldText}>I</span>nnovation</span>
                                                    <span>A person who leads innovative changes with creative and challenging mindset</span>
                                                </div>
                                            </div>
                                            <div className={re.tFlex2}>
                                                <div className={re.tBox3}>Professional talent</div>
                                                <div className={re.tBox4}>
                                                    <span><span className={re.tBoldText}>P</span>rofessional</span>
                                                    <span>A person who strives in his/her field and has the best expertise</span>
                                                </div>
                                            </div>
                                            <div className={re.tFlex3}>
                                                <div className={re.tBox5}>Open-minded talent</div>
                                                <div className={re.tBox6}>
                                                    <span><span className={re.tBoldText}>C</span>ommunication</span>
                                                    <span>A person who communicates with an open mind, and respects customers and members</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={re.recruitSubBoxS}>
                            <span className={re.reCircle}></span>
                            <span className={re.recruitSubTitle}>Process and Announcement</span>
                            <span className={re.recruitSubConts}>We follows a<span>fair and transparent recruitment process</span>to accurately determine the qualifications and capabilities of applicants.</span>
                            <span className={re.recruitSubConts2}>(※ For more information, please check the job posting, and some changes may be made depending on our circumstances.)</span>
                            <div className={re.recruitShape}>
                                <span className={re.firstMeet}>Document screening</span>
                                <span className={re.dashedLineE}></span>
                                <span className={re.recruitCircle}></span>
                                <span className={re.document}>First interview</span>
                                <div className={re.recruitShape2}>
                                    <span className={re.dashedLine2E}></span>
                                    <span className={re.recruitCircle2}></span>
                                </div>
                                <span className={re.lastMeet}>Executive interview</span>
                                <span className={re.dashedLine3E}></span>
                                <span className={re.recruitCircle3}></span>
                                <span className={re.accept}>Final pass</span>
                            </div>
                            <span className={re.shortcut}><a href="https://www.jobkorea.co.kr/Recruit/Co_Read/Recruit/C/une9966?ChkDispType=1">Recruit Announcement</a></span>
                            {/* <span className={re.explanation}>※상세 일정 및 전형 과정은 회사 사정에 따라 변경될 수 있으며, 자세한 내용은 아래 채용공고를 확인해 주시기 바랍니다.</span> */}
                        </div>

                        <div id="sectionBenefits">
                            <div className={re.benefitsBoxS}>
                                <span className={re.benefitsTitle} data-aos="fade-down" data-aos-duration="1000">Welfare & Benefits</span>
                                <span className={re.benefitsTitle2}>We will repay members for his/her efforts to achieve goals and self-development to improve capabilities.</span>
                                <div className={re.benefitsArea}>
                                    <div className={re.payBoxS}>
                                        <span className={re.payIconBoxImg}></span>
                                        <span className={re.payIconFont}>Salary and Compensation</span>
                                        <div className={re.payTextBox}>
                                            <span>Incentive payment</span>
                                            <span>Support for lunch and meal cost</span>
                                            <span>Support for business activity expenses</span>
                                            <span>Rewards for long-term employees</span>
                                            <span>Support for four major insurances</span>
                                            <span>Support for retirement pensions</span>
                                        </div>
                                    </div>

                                    <div className={re.environmentBoxS}>
                                        <span className={re.environmentIconBoxImg}></span>
                                        <span className={re.environmentIconBoxFont}>Working environment</span>
                                        <div className={re.environmentTextBox}>
                                            <span>Flexible working hour system</span>
                                            <span>Congratulatory and condolence leaves</span>
                                            <span>Summer holidays</span>
                                            <span>Encouragement of childbirth and Parental leave</span>
                                            <span>Encouragement of annual leave use</span>
                                            <span>Casual(free) dresscode</span>
                                            <span>Holiday gift</span>
                                        </div>
                                    </div>

                                    <div className={re.developmentBoxS}>
                                        <span className={re.developIconBoxImg}></span>
                                        <span className={re.developIconBoxFont}>Competency development</span>
                                        <div className={re.developmentTextBox}>
                                            <span>Support for book purchase</span>
                                            <span>and education expenses,</span>
                                            <span>certification acquisition costs,</span>
                                            <span>various self-improvement expenses</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="sectionInquiry">
                            <div className={re.InquiryBoxS}>
                                <div className={re.InquiryArea}>
                                    <span className={re.contactTitle} data-aos="fade-down" data-aos-duration="1000">Contact us</span>
                                    <span className={re.contactSideTitle}>Please feel free to ask any questions you have about the company. A person in charge of each field will reply to you.
                                        (※ Weekday Business hours: 08:00~17:00, Lunch time: 11:30~12:30. We closed on Saturdays, Sundays, and public holidays.)</span>

                                    <div className={re.conFirstBoxM}>
                                        <span className={re.conKindNameM}>Inquiry type</span>
                                        {
                                            <>
                                                <select ref={this.refContactTarget} class="InquiryHomeSelect">
                                                    <option class="InquiryHomeOptionItem" value="Business Proposal/Partnership">Business Proposal/Partnership</option>
                                                    <option class="InquiryHomeOptionItem" value="Safety Management Area">Safety Management Area</option>
                                                    <option class="InquiryHomeOptionItem" value="Digital Twin Area">Digital Twin Area</option>
                                                    <option class="InquiryHomeOptionItem" value="Spatial Information Area">Spatial Information Area</option>
                                                    <option class="InquiryHomeOptionItem" value="General Information">General Information</option>
                                                </select>
                                            </>
                                        }
                                    </div>
                                    <div className={re.conSecondBoxM}>
                                        <div className={re.conLeftBoxM}>
                                            <span className={re.conLeftTBox}>
                                                <span className={re.companyNameM}>Company name</span>
                                                <span className={re.companyNameSelect}>* Optional</span>
                                            </span>
                                            <input type="text" className={re.contactCompanyBoxM} placeholder="Enter company name" ref={this.refCompany} />
                                        </div>
                                        <div className={re.conMiddleBoxM}>
                                            <span className={re.conPeopleNameM}>Name</span>
                                            <input type="text" className={re.contactNameBoxM} placeholder="Please enter your name" ref={this.refName} />
                                        </div>
                                        <div className={re.conRightBoxM}>
                                            <span className={re.contactEmailM}>E-mail</span>
                                            <input type="text" ref={this.refEmail} className={re.contactEmailBoxM} placeholder="Please enter your email" />
                                        </div>
                                    </div>
                                    <div className={re.conThirdBoxM}>
                                        <span className={re.InquiryContentsM}>Content</span>
                                        <textarea ref={this.refMemo} className={re.contactTextBoxMemoM} type="text" placeholder="Please enter your inquiry"></textarea>
                                    </div>
                                    <div className={re.conFourthBoxM}>
                                        <div className={re.conInputArea}>
                                            {/* <label><input ref={this.refCheckbox} class="checkTest" type="checkbox" name="color" value="red" onClick={this.checkTest} id="aaa" /><p class="inputText">개인정보 취급 방침에 동의합니다.</p></label> */}
                                            <input type="checkbox" ref={this.refCheckbox} class="checkTest" id="check1" name="color" value="red" onClick={this.checkTest} /><label htmlFor={"check1"}></label><p class="inputTextM">I agree with the personal information handling policy.</p>
                                            <span className={re.personalInforM} id="popupDom" onClick={() => this.openPopup2()}>View policy</span>
                                            {
                                                this.state.isOpenPopup2 &&
                                                <PopupDom>
                                                    <PersonalInforPop onClose={this.closePopup} />
                                                </PopupDom>
                                            }
                                        </div>
                                    </div>
                                    <span>
                                        <button type="button"
                                            id="popupDom"
                                            className={re.contactSendM}
                                            onClick={() => this.onSend()}
                                        >Send Question
                                        </button>
                                        {
                                            this.state.isOpenPopup &&
                                            <PopupDom>
                                                <div className={re.shadow}></div>
                                                <ContactPop onClose={this.closePopup} />
                                            </PopupDom>
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={home.footBox}>
                            <div className={home.footLeftArea}>
                                <div className={home.footTitleBox}>
                                    <span className={home.footTitle}>U&E</span>
                                    <a href="../../resource/une_companyInfo_2024.pdf" download>
                                        <span className={home.companyDown}>
                                            <span className={home.companyDownText}>Company Introduction</span>
                                            <span className={home.companyImg}></span>
                                        </span>
                                    </a>
                                </div>
                                <div className={home.footContents}>
                                    <span>Corporate Registration Number: 502-86-09535</span>
                                    <div className={home.footConTop}>
                                        <span>Tel: 82-2-714-4133</span>
                                        <span>Fax: 82-2-714-4134</span>
                                    </div>
                                    <span className={home.footEmail}>E-mail:<a href="mailto:team_manager@unes.co.kr" style={{ color: '#666666', marginLeft: '6px' }}>team_manager@unes.co.kr</a></span>
                                    <div className={home.footConBottom}>
                                        <span className={home.footBold}>Address (Seoul) : 1F, Juyeon Bldg, 345, Cheongpa-ro, Yongsan-gu, Seoul, Republic of Korea (Zip code: 04303)</span>
                                        <span><Link to="/directions">Map</Link></span>
                                    </div>
                                    <span>{/* 본사 : 대구 달서구 달구벌대로 1053, 계명대학교 첨단산업지원센터 108호 (우:42601)*/}</span>
                                </div>
                                <div className={home.footContents2}>
                                    <span className={home.footText}>CopyrightⓒU&E All rights reserved.</span>
                                </div>
                            </div>
                            <div className={home.footIconArea}>
                                <div className={home.footIconBox}>
                                    <span><a target="_blank" href="https://www.youtube.com/channel/UC_DmpJ1xIYW9faxTi1M8TMQ"><span className={home.footYouTube}></span></a></span>
                                    <span><a target="_blank" href="https://www.instagram.com/unes.kr"><span className={home.footinstagram}></span></a></span>
                                    <span><a target="_blank" href="https://www.facebook.com/%EC%9C%A0%EC%97%94%EC%9D%B4-100778369074049"><span className={home.footFacebook}></span></a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        } else if (768 <= widthSize && widthSize <= 1023) { //태블릿
            displayContactUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={re.conIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">Recruitment and Inquiry</span>
                            <span data-aos="fade-down" data-aos-duration="1000">Introduce U&E's recruitment, welfare benefits, and inquiries about the company.</span>
                        </div>
                        <div id="sectionRecruit">
                            <div className={bIntro.spatialInforContentsSect}>
                                <div className={re.recruitArea}>
                                    <div className={re.talentedBox}>
                                        <span className={re.talentedTitle} data-aos="fade-down" data-aos-duration="1000">Recruitment</span>
                                        <span className={re.talentedConts}>We are looking for talented people who constantly challenge innovation, pursue the best professionalism, and communicate with an open mind.</span>
                                        <div className={re.talentedFlexBox}>
                                            <div className={re.tFlex1}>
                                                <div className={re.tBox1}>Creative talent</div>
                                                <div className={re.tBox2}>
                                                    <span><span className={re.tBoldText}>I</span>nnovation</span>
                                                    <span>A person who leads</span>
                                                    <span>innovative changes with creative</span>
                                                    <span>and challenging mindset</span>
                                                </div>
                                            </div>
                                            <div className={re.tFlex2}>
                                                <div className={re.tBox3}>Professional talent</div>
                                                <div className={re.tBox4}>
                                                    <span><span className={re.tBoldText}>P</span>rofessional</span>
                                                    <span>A person who strives</span>
                                                    <span>in his/her field and</span>
                                                    <span>has the best expertise</span>
                                                </div>
                                            </div>
                                            <div className={re.tFlex3}>
                                                <div className={re.tBox5}>Open-minded talent</div>
                                                <div className={re.tBox6}>
                                                    <span><span className={re.tBoldText}>C</span>ommunication</span>
                                                    <span>A person who communicates</span>
                                                    <span>with an open mind, and</span>
                                                    <span>respects customers and members</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={re.recruitSubBoxS}>
                            <span className={re.reCircle}></span>
                            <span className={re.recruitSubTitle}>Process and Announcement</span>
                            <span className={re.recruitSubConts}>We follows a<span>fair and transparent recruitment process</span>to accurately determine the qualifications and capabilities of applicants.</span>
                            <span className={re.recruitSubConts2}>(※ For more information, please check the job posting, and some changes may be made depending on our circumstances.)</span>
                            <div className={re.recruitShape}>
                                <span className={re.document}>
                                    <p>Document screening</p>
                                    <p></p>
                                </span>
                                <span className={re.dashedLine}></span>
                                <span className={re.recruitCircle}></span>
                                <span className={re.firstMeet}>First interview</span>
                                <span className={re.dashedLine}></span>
                                <span className={re.recruitCircle}></span>
                                <span className={re.lastMeet}>Executive interview<span></span></span>
                                <span className={re.dashedLine}></span>
                                <span className={re.recruitCircle}></span>
                                <span className={re.accept}>Final pass</span>
                            </div>
                            <span className={re.shortcut}><a href="https://www.jobkorea.co.kr/Recruit/Co_Read/Recruit/C/une9966?ChkDispType=1">Recruit Announcement</a></span>
                            {/* <span className={re.explanation}>※상세 일정 및 전형 과정은 회사 사정에 따라 변경될 수 있으며, 자세한 내용은 아래 채용공고를 확인해 주시기 바랍니다.</span> */}
                        </div>

                        <div id="sectionBenefits">
                            <div className={re.benefitsBoxS}>
                                <span className={re.benefitsTitle} data-aos="fade-down" data-aos-duration="1000">Welfare & Benefits</span>
                                <span className={re.benefitsTitle2}>We will repay members for his/her efforts to achieve goals and self-development to improve capabilities.</span>
                                <div className={re.benefitsArea}>
                                    <div className={re.payBoxS}>
                                        <span className={re.payIconBoxImg}></span>
                                        <span className={re.payIconFont}>Salary and Compensation</span>
                                        <div className={re.payTextBox}>
                                            <span>Incentive payment</span>
                                            <span>Support for lunch and meal cost</span>
                                            <span>Support for business activity expenses</span>
                                            <span>Rewards for long-term employees</span>
                                            <span>Support for four major insurances</span>
                                            <span>Support for retirement pensions</span>
                                        </div>
                                    </div>

                                    <div className={re.environmentBoxS}>
                                        <span className={re.environmentIconBoxImg}></span>
                                        <span className={re.environmentIconBoxFont}>Working environment</span>
                                        <div className={re.environmentTextBox}>
                                            <span>Flexible working hour system</span>
                                            <span>Congratulatory and condolence leaves</span>
                                            <span>Summer holidays</span>
                                            <span>Encouragement of childbirth and Parental leave</span>
                                            <span>Encouragement of annual leave use</span>
                                            <span>Casual(free) dresscode</span>
                                            <span>Holiday gift</span>
                                        </div>
                                    </div>

                                    <div className={re.developmentBoxS}>
                                        <span className={re.developIconBoxImg}></span>
                                        <span className={re.developIconBoxFont}>Competency development</span>
                                        <div className={re.developmentTextBox}>
                                            <span>Support for book purchase</span>
                                            <span>and education expenses,</span>
                                            <span>certification acquisition costs,</span>
                                            <span>various self-improvement expenses</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="sectionInquiry">
                            <div className={re.InquiryBoxS}>
                                <div className={re.InquiryArea}>
                                    <span className={re.contactTitle} data-aos="fade-down" data-aos-duration="1000">Contact us</span>
                                    <span className={re.contactSideTitle}>Please feel free to ask any questions you have about the company. A person in charge of each field will reply to you.</span>
                                    <span className={re.contactSideTitle2}>(※ Weekday Business hours: 08:00~17:00, Lunch time: 11:30~12:30. We closed on Saturdays, Sundays, and public holidays.)</span>

                                    <div className={re.conFirstBoxM}>
                                        <span className={re.conKindNameM}>Inquiry type</span>
                                        {
                                            <>
                                                <select ref={this.refContactTarget} class="InquiryHomeSelect">
                                                    <option class="InquiryHomeOptionItem" value="Business Proposal/Partnership">Business Proposal/Partnership</option>
                                                    <option class="InquiryHomeOptionItem" value="Safety Management Area">Safety Management Area</option>
                                                    <option class="InquiryHomeOptionItem" value="Digital Twin Area">Digital Twin Area</option>
                                                    <option class="InquiryHomeOptionItem" value="Spatial Information Area">Spatial Information Area</option>
                                                    <option class="InquiryHomeOptionItem" value="General Information">General Information</option>
                                                </select>
                                            </>
                                        }
                                    </div>
                                    <div className={re.conSecondBoxM}>
                                        <div className={re.conLeftBoxM}>
                                            <span className={re.conLeftTBox}>
                                                <span className={re.companyNameM}>Company name</span>
                                                <span className={re.companyNameSelect}>* Optional</span>
                                            </span>
                                            <input type="text" className={re.contactCompanyBoxM} placeholder="Enter company name" ref={this.refCompany} />
                                        </div>
                                        <div className={re.conMiddleBoxM}>
                                            <span className={re.conPeopleNameM}>Name</span>
                                            <input type="text" className={re.contactNameBoxM} placeholder="Please enter your name" ref={this.refName} />
                                        </div>
                                        <div className={re.conRightBoxM}>
                                            <span className={re.contactEmailM}>E-mail</span>
                                            <input type="text" ref={this.refEmail} className={re.contactEmailBoxM} placeholder="Please enter your email" />
                                        </div>
                                    </div>
                                    <div className={re.conThirdBoxM}>
                                        <span className={re.InquiryContentsM}>Content</span>
                                        <textarea ref={this.refMemo} className={re.contactTextBoxMemoM} type="text" placeholder="Please enter your inquiry"></textarea>
                                    </div>
                                    <div className={re.conFourthBoxM}>
                                        <div className={re.conInputArea}>
                                            {/* <label><input ref={this.refCheckbox} class="checkTest" type="checkbox" name="color" value="red" onClick={this.checkTest} id="aaa" /><p class="inputText">개인정보 취급 방침에 동의합니다.</p></label> */}
                                            <input type="checkbox" ref={this.refCheckbox} class="checkTest" id="check1" name="color" value="red" onClick={this.checkTest} /><label htmlFor={"check1"}></label><p class="inputTextM">I agree with the personal information handling policy.</p>
                                            <span className={re.personalInforM} id="popupDom" onClick={() => this.openPopup2()}>View policy</span>
                                            {
                                                this.state.isOpenPopup2 &&
                                                <PopupDom>
                                                    <PersonalInforPop onClose={this.closePopup} />
                                                </PopupDom>
                                            }
                                        </div>
                                    </div>
                                    <span>
                                        <button type="button"
                                            id="popupDom"
                                            className={re.contactSendM}
                                            onClick={() => this.onSend()}
                                        >Send Question
                                        </button>
                                        {
                                            this.state.isOpenPopup &&
                                            <PopupDom>
                                                <div className={re.shadow}></div>
                                                <ContactPop onClose={this.closePopup} />
                                            </PopupDom>
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={home.footBox}>
                            <div className={home.footLeftArea}>
                                <div className={home.footTitleBox}>
                                    <span>U&E</span>
                                </div>
                                <div className={home.footContents}>
                                    <div className={home.footConTop}>
                                        <span>Corporate Registration Number: 502-86-09535</span>
                                        <span className={home.footBorder}></span>
                                        <span>Tel: 82-2-714-4133</span>
                                        <span className={home.footBorder}></span>
                                        <span>Fax: 82-2-714-4134</span>
                                        <span className={home.footBorder}></span>
                                        <span className={home.footEmail}>E-mail:<a href="mailto:team_manager@unes.co.kr" style={{ color: '#666666', marginLeft: '6px' }}>team_manager@unes.co.kr</a></span>
                                    </div>
                                    <div className={home.footConBottom}>
                                        <span className={home.footBold}>Address (Seoul) : 1F, Juyeon Bldg, 345, Cheongpa-ro, Yongsan-gu, Seoul, Republic of Korea (Zip code: 04303)</span>
                                        <span className={home.footBorder}></span>
                                        <span></span>
                                        <span><Link to="/directions">Map</Link></span>
                                    </div>
                                </div>
                                <div className={home.footContents2}>
                                    <span className={home.footText}>CopyrightⓒU&E All rights reserved.</span>
                                </div>
                            </div>
                            <div className={home.footIconArea}>
                                <a href="../../resource/une_companyInfo_2024.pdf" download>
                                    <span className={home.companyDown}>Company Introduction
                                        <span className={home.companyImg}></span>
                                    </span>
                                </a>
                                <div className={home.footIconBox}>
                                    <span><a target="_blank" href="https://www.youtube.com/channel/UC_DmpJ1xIYW9faxTi1M8TMQ"><span className={home.footYouTube}></span></a></span>
                                    <span><a target="_blank" href="https://www.instagram.com/unes.kr"><span className={home.footinstagram}></span></a></span>
                                    <span><a target="_blank" href="https://www.facebook.com/%EC%9C%A0%EC%97%94%EC%9D%B4-100778369074049"><span className={home.footFacebook}></span></a></span>
                                </div>
                                <div>

                                    {/*  <span className={home.korBtn} onClick={this.onClickKOR}>KOR</span>
                                                <span className={home.engBtn} onClick={this.onClickENG}>ENG</span> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        } else if (960 <= widthSize && widthSize <= 1280) { //가로 태블릿
            displayContactUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={re.conIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">Recruitment and Inquiry</span>
                            <span data-aos="fade-down" data-aos-duration="1000">Introduce U&E's recruitment, welfare benefits, and inquiries about the company.</span>
                        </div>
                        <div id="sectionRecruit">
                            <div className={bIntro.spatialInforContentsSect}>
                                <div className={re.recruitArea}>
                                    <div className={re.talentedBox}>
                                        <span className={re.talentedTitle} data-aos="fade-down" data-aos-duration="1000">Recruitment</span>
                                        <span className={re.talentedConts}>We are looking for talented people who constantly challenge innovation, pursue the best professionalism, and communicate with an open mind.</span>
                                        <div className={re.talentedFlexBox}>
                                            <div className={re.tFlex1}>
                                                <div className={re.tBox1}>Creative talent</div>
                                                <div className={re.tBox2}>
                                                    <span><span className={re.tBoldText}>I</span>nnovation</span>
                                                    <span>A person who leads</span>
                                                    <span>innovative changes with creative</span>
                                                    <span>and challenging mindset</span>
                                                </div>
                                            </div>
                                            <div className={re.tFlex2}>
                                                <div className={re.tBox3}>Professional talent</div>
                                                <div className={re.tBox4}>
                                                    <span><span className={re.tBoldText}>P</span>rofessional</span>
                                                    <span>A person who strives</span>
                                                    <span>in his/her field and</span>
                                                    <span>has the best expertise</span>
                                                </div>
                                            </div>
                                            <div className={re.tFlex3}>
                                                <div className={re.tBox5}>Open-minded talent</div>
                                                <div className={re.tBox6}>
                                                    <span><span className={re.tBoldText}>C</span>ommunication</span>
                                                    <span>A person who communicates</span>
                                                    <span>with an open mind, and</span>
                                                    <span>respects customers and members</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={re.recruitSubBoxS}>
                            <span className={re.reCircle}></span>
                            <span className={re.recruitSubTitle}>Process and Announcement</span>
                            <span className={re.recruitSubConts}>We follows a<span>fair and transparent recruitment process</span>to accurately determine the qualifications and capabilities of applicants.</span>
                            <span className={re.recruitSubConts2}>(※ For more information, please check the job posting, and some changes may be made depending on our circumstances.)</span>
                            <div className={re.recruitShape}>
                                <span className={re.document}>
                                    <p>Document screening</p>
                                    <p></p>
                                </span>
                                <span className={re.dashedLine}></span>
                                <span className={re.recruitCircle}></span>
                                <span className={re.firstMeet}>First interview</span>
                                <span className={re.dashedLine}></span>
                                <span className={re.recruitCircle}></span>
                                <span className={re.lastMeet}>Executive interview<span></span></span>
                                <span className={re.dashedLine}></span>
                                <span className={re.recruitCircle}></span>
                                <span className={re.accept}>Final pass</span>
                            </div>
                            <span className={re.shortcut}><a href="https://www.jobkorea.co.kr/Recruit/Co_Read/Recruit/C/une9966?ChkDispType=1">Recruit Announcement</a></span>
                            {/* <span className={re.explanation}>※상세 일정 및 전형 과정은 회사 사정에 따라 변경될 수 있으며, 자세한 내용은 아래 채용공고를 확인해 주시기 바랍니다.</span> */}
                        </div>

                        <div id="sectionBenefits">
                            <div className={re.benefitsBoxS}>
                                <span className={re.benefitsTitle} data-aos="fade-down" data-aos-duration="1000">Welfare & Benefits</span>
                                <span className={re.benefitsTitle2}>We will repay members for his/her efforts to achieve goals and self-development to improve capabilities.</span>
                                <div className={re.benefitsArea}>
                                    <div className={re.payBoxS}>
                                        <span className={re.payIconBoxImg}></span>
                                        <span className={re.payIconFont}>Salary and Compensation</span>
                                        <div className={re.payTextBox}>
                                            <span>Incentive payment</span>
                                            <span>Support for lunch and meal cost</span>
                                            <span>Support for business activity expenses</span>
                                            <span>Rewards for long-term employees</span>
                                            <span>Support for four major insurances</span>
                                            <span>Support for retirement pensions</span>
                                        </div>
                                    </div>

                                    <div className={re.environmentBoxS}>
                                        <span className={re.environmentIconBoxImg}></span>
                                        <span className={re.environmentIconBoxFont}>Working environment</span>
                                        <div className={re.environmentTextBox}>
                                            <span>Flexible working hour system</span>
                                            <span>Congratulatory and condolence leaves</span>
                                            <span>Summer holidays</span>
                                            <span>Encouragement of childbirth and Parental leave</span>
                                            <span>Encouragement of annual leave use</span>
                                            <span>Casual(free) dresscode</span>
                                            <span>Holiday gift</span>
                                        </div>
                                    </div>

                                    <div className={re.developmentBoxS}>
                                        <span className={re.developIconBoxImg}></span>
                                        <span className={re.developIconBoxFont}>Competency development</span>
                                        <div className={re.developmentTextBox}>
                                            <span>Support for book purchase</span>
                                            <span>and education expenses,</span>
                                            <span>certification acquisition costs,</span>
                                            <span>various self-improvement expenses</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="sectionInquiry">
                            <div className={re.InquiryBoxS}>
                                <div className={re.InquiryArea}>
                                    <span className={re.contactTitle} data-aos="fade-down" data-aos-duration="1000">Contact us</span>
                                    <span className={re.contactSideTitle}>Please feel free to ask any questions you have about the company. A person in charge of each field will reply to you.</span>
                                    <span className={re.contactSideTitle2}>(※ Weekday Business hours: 08:00~17:00, Lunch time: 11:30~12:30. We closed on Saturdays, Sundays, and public holidays.)</span>

                                    <div className={re.conFirstBoxM}>
                                        <span className={re.conKindNameM}>Inquiry type</span>
                                        {
                                            <>
                                                <select ref={this.refContactTarget} class="InquiryHomeSelect">
                                                    <option class="InquiryHomeOptionItem" value="Business Proposal/Partnership">Business Proposal/Partnership</option>
                                                    <option class="InquiryHomeOptionItem" value="Safety Management Area">Safety Management Area</option>
                                                    <option class="InquiryHomeOptionItem" value="Digital Twin Area">Digital Twin Area</option>
                                                    <option class="InquiryHomeOptionItem" value="Spatial Information Area">Spatial Information Area</option>
                                                    <option class="InquiryHomeOptionItem" value="General Information">General Information</option>
                                                </select>
                                            </>
                                        }
                                    </div>
                                    <div className={re.conSecondBoxM}>
                                        <div className={re.conLeftBoxM}>
                                            <span className={re.conLeftTBox}>
                                                <span className={re.companyNameM}>Company name</span>
                                                <span className={re.companyNameSelect}>* Optional</span>
                                            </span>
                                            <input type="text" className={re.contactCompanyBoxM} placeholder="Enter company name" ref={this.refCompany} />
                                        </div>
                                        <div className={re.conMiddleBoxM}>
                                            <span className={re.conPeopleNameM}>Name</span>
                                            <input type="text" className={re.contactNameBoxM} placeholder="Please enter your name" ref={this.refName} />
                                        </div>
                                        <div className={re.conRightBoxM}>
                                            <span className={re.contactEmailM}>E-mail</span>
                                            <input type="text" ref={this.refEmail} className={re.contactEmailBoxM} placeholder="Please enter your email" />
                                        </div>
                                    </div>
                                    <div className={re.conThirdBoxM}>
                                        <span className={re.InquiryContentsM}>Content</span>
                                        <textarea ref={this.refMemo} className={re.contactTextBoxMemoM} type="text" placeholder="Please enter your inquiry"></textarea>
                                    </div>
                                    <div className={re.conFourthBoxM}>
                                        <div className={re.conInputArea}>
                                            {/* <label><input ref={this.refCheckbox} class="checkTest" type="checkbox" name="color" value="red" onClick={this.checkTest} id="aaa" /><p class="inputText">개인정보 취급 방침에 동의합니다.</p></label> */}
                                            <input type="checkbox" ref={this.refCheckbox} class="checkTest" id="check1" name="color" value="red" onClick={this.checkTest} /><label htmlFor={"check1"}></label><p class="inputTextM">I agree with the personal information handling policy.</p>
                                            <span className={re.personalInforM} id="popupDom" onClick={() => this.openPopup2()}>View policy</span>
                                            {
                                                this.state.isOpenPopup2 &&
                                                <PopupDom>
                                                    <PersonalInforPop onClose={this.closePopup} />
                                                </PopupDom>
                                            }
                                        </div>
                                    </div>
                                    <span>
                                        <button type="button"
                                            id="popupDom"
                                            className={re.contactSendM}
                                            onClick={() => this.onSend()}
                                        >Send Question
                                        </button>
                                        {
                                            this.state.isOpenPopup &&
                                            <PopupDom>
                                                <div className={re.shadow}></div>
                                                <ContactPop onClose={this.closePopup} />
                                            </PopupDom>
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={home.footBox}>
                            <div className={home.footLeftArea}>
                                <div className={home.footTitleBox}>
                                    <span>U&E</span>
                                </div>
                                <div className={home.footContents}>
                                    <div className={home.footConTop}>
                                        <span>Corporate Registration Number: 502-86-09535</span>
                                        <span className={home.footBorder}></span>
                                        <span>Tel: 82-2-714-4133</span>
                                        <span className={home.footBorder}></span>
                                        <span>Fax: 82-2-714-4134</span>
                                        <span className={home.footBorder}></span>
                                        <span className={home.footEmail}>E-mail:<a href="mailto:team_manager@unes.co.kr" style={{ color: '#666666', marginLeft: '6px' }}>team_manager@unes.co.kr</a></span>
                                    </div>
                                    <div className={home.footConBottom}>
                                        <span className={home.footBold}>Address (Seoul) : 1F, Juyeon Bldg, 345, Cheongpa-ro, Yongsan-gu, Seoul, Republic of Korea (Zip code: 04303)</span>
                                        <span className={home.footBorder}></span>
                                        <span></span>
                                        <span><Link to="/directions">Map</Link></span>
                                    </div>
                                </div>
                                <div className={home.footContents2}>
                                    <span className={home.footText}>CopyrightⓒU&E All rights reserved.</span>
                                </div>
                            </div>
                            <div className={home.footIconArea}>
                                <a href="../../resource/une_companyInfo_2024.pdf" download>
                                    <span className={home.companyDown}>Company Introduction
                                        <span className={home.companyImg}></span>
                                    </span>
                                </a>
                                <div className={home.footIconBox}>
                                    <span><a target="_blank" href="https://www.youtube.com/channel/UC_DmpJ1xIYW9faxTi1M8TMQ"><span className={home.footYouTube}></span></a></span>
                                    <span><a target="_blank" href="https://www.instagram.com/unes.kr"><span className={home.footinstagram}></span></a></span>
                                    <span><a target="_blank" href="https://www.facebook.com/%EC%9C%A0%EC%97%94%EC%9D%B4-100778369074049"><span className={home.footFacebook}></span></a></span>
                                </div>
                                <div>

                                    {/*  <span className={home.korBtn} onClick={this.onClickKOR}>KOR</span>
                                                <span className={home.engBtn} onClick={this.onClickENG}>ENG</span> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        } else if (widthSize >= 1024) {
            displayContactUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={re.conIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">Recruitment and Inquiry</span>
                            <span data-aos="fade-down" data-aos-duration="1000">Introduce U&E's recruitment, welfare benefits, and inquiries about the company.</span>
                        </div>
                        <div id="sectionRecruit">
                            <div className={bIntro.spatialInforContentsSect}>
                                <div className={re.recruitArea}>
                                    <div className={re.talentedBox}>
                                        <span className={re.talentedTitle} data-aos="fade-down" data-aos-duration="1000">Recruitment</span>
                                        <span className={re.talentedConts}>We are looking for talented people who constantly challenge innovation, pursue the best professionalism, and communicate with an open mind.</span>
                                        <div className={re.talentedFlexBox}>
                                            <div className={re.tFlex1}>
                                                <div className={re.tBox1}>Creative talent</div>
                                                <div className={re.tBox2}>
                                                    <span><span className={re.tBoldText}>I</span>nnovation</span>
                                                    <span>A person who leads</span>
                                                    <span>innovative changes with creative</span>
                                                    <span>and challenging mindset</span>
                                                </div>
                                            </div>
                                            <div className={re.tFlex2}>
                                                <div className={re.tBox3}>Professional talent</div>
                                                <div className={re.tBox4}>
                                                    <span><span className={re.tBoldText}>P</span>rofessional</span>
                                                    <span>A person who strives</span>
                                                    <span>in his/her field and</span>
                                                    <span>has the best expertise</span>
                                                </div>
                                            </div>
                                            <div className={re.tFlex3}>
                                                <div className={re.tBox5}>Open-minded talent</div>
                                                <div className={re.tBox6}>
                                                    <span><span className={re.tBoldText}>C</span>ommunication</span>
                                                    <span>A person who communicates</span>
                                                    <span>with an open mind, and</span>
                                                    <span>respects customers and members</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={re.recruitSubBoxS}>
                            <span className={re.reCircle}></span>
                            <span className={re.recruitSubTitle}>Process and Announcement</span>
                            <span className={re.recruitSubConts}>We follows a<span>fair and transparent recruitment process</span>to accurately determine the qualifications and capabilities of applicants.</span>
                            <span className={re.recruitSubConts2}>(※ For more information, please check the job posting, and some changes may be made depending on our circumstances.)</span>
                            <div className={re.recruitShape}>
                                <span className={re.document}>
                                    <p>Document screening</p>
                                    <p></p>
                                </span>
                                <span className={re.dashedLine}></span>
                                <span className={re.recruitCircle}></span>
                                <span className={re.firstMeet}>First interview</span>
                                <span className={re.dashedLine}></span>
                                <span className={re.recruitCircle}></span>
                                <span className={re.lastMeet}>Executive interview<span></span></span>
                                <span className={re.dashedLine}></span>
                                <span className={re.recruitCircle}></span>
                                <span className={re.accept}>Final pass</span>
                            </div>
                            <span className={re.shortcut}><a href="https://www.jobkorea.co.kr/Recruit/Co_Read/Recruit/C/une9966?ChkDispType=1">Recruit Announcement</a></span>
                            {/* <span className={re.explanation}>※상세 일정 및 전형 과정은 회사 사정에 따라 변경될 수 있으며, 자세한 내용은 아래 채용공고를 확인해 주시기 바랍니다.</span> */}
                        </div>

                        <div id="sectionBenefits">
                            <div className={re.benefitsBoxS}>
                                <span className={re.benefitsTitle} data-aos="fade-down" data-aos-duration="1000">Welfare & Benefits</span>
                                <span className={re.benefitsTitle2}>We will repay members for his/her efforts to achieve goals and self-development to improve capabilities.</span>
                                <div className={re.benefitsArea}>
                                    <div className={re.payBoxS}>
                                        <span className={re.payIconBoxImg}></span>
                                        <span className={re.payIconFont}>Salary and Compensation</span>
                                        <div className={re.payTextBox}>
                                            <span>Incentive payment</span>
                                            <span>Support for lunch and meal cost</span>
                                            <span>Support for business activity expenses</span>
                                            <span>Rewards for long-term employees</span>
                                            <span>Support for four major insurances</span>
                                            <span>Support for retirement pensions</span>
                                        </div>
                                    </div>

                                    <div className={re.environmentBoxS}>
                                        <span className={re.environmentIconBoxImg}></span>
                                        <span className={re.environmentIconBoxFont}>Working environment</span>
                                        <div className={re.environmentTextBox}>
                                            <span>Flexible working hour system</span>
                                            <span>Congratulatory and condolence leaves</span>
                                            <span>Summer holidays</span>
                                            <span>Encouragement of childbirth and Parental leave</span>
                                            <span>Encouragement of annual leave use</span>
                                            <span>Casual(free) dresscode</span>
                                            <span>Holiday gift</span>
                                        </div>
                                    </div>

                                    <div className={re.developmentBoxS}>
                                        <span className={re.developIconBoxImg}></span>
                                        <span className={re.developIconBoxFont}>Competency development</span>
                                        <div className={re.developmentTextBox}>
                                            <span>Support for book purchase</span>
                                            <span>and education expenses,</span>
                                            <span>certification acquisition costs,</span>
                                            <span>various self-improvement expenses</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="sectionInquiry">
                            <div className={re.InquiryBoxS}>
                                <div className={re.InquiryArea}>
                                    <span className={re.contactTitle} data-aos="fade-down" data-aos-duration="1000">Contact us</span>
                                    <span className={re.contactSideTitle}>Please feel free to ask any questions you have about the company. A person in charge of each field will reply to you.</span>
                                    <span className={re.contactSideTitle2}>(※ Weekday Business hours: 08:00~17:00, Lunch time: 11:30~12:30. We closed on Saturdays, Sundays, and public holidays.)</span>

                                    <div className={re.conFirstBoxM}>
                                        <span className={re.conKindNameM}>Inquiry type</span>
                                        {
                                            <>
                                                <select ref={this.refContactTarget} class="InquiryHomeSelect">
                                                    <option class="InquiryHomeOptionItem" value="Business Proposal/Partnership">Business Proposal/Partnership</option>
                                                    <option class="InquiryHomeOptionItem" value="Safety Management Area">Safety Management Area</option>
                                                    <option class="InquiryHomeOptionItem" value="Digital Twin Area">Digital Twin Area</option>
                                                    <option class="InquiryHomeOptionItem" value="Spatial Information Area">Spatial Information Area</option>
                                                    <option class="InquiryHomeOptionItem" value="General Information">General Information</option>
                                                </select>
                                            </>
                                        }
                                    </div>
                                    <div className={re.conSecondBoxM}>
                                        <div className={re.conLeftBoxM}>
                                            <span className={re.conLeftTBox}>
                                                <span className={re.companyNameM}>Company name</span>
                                                <span className={re.companyNameSelect}>* Optional</span>
                                            </span>
                                            <input type="text" className={re.contactCompanyBoxM} placeholder="Enter company name" ref={this.refCompany} />
                                        </div>
                                        <div className={re.conMiddleBoxM}>
                                            <span className={re.conPeopleNameM}>Name</span>
                                            <input type="text" className={re.contactNameBoxM} placeholder="Please enter your name" ref={this.refName} />
                                        </div>
                                        <div className={re.conRightBoxM}>
                                            <span className={re.contactEmailM}>E-mail</span>
                                            <input type="text" ref={this.refEmail} className={re.contactEmailBoxM} placeholder="Please enter your email" />
                                        </div>
                                    </div>
                                    <div className={re.conThirdBoxM}>
                                        <span className={re.InquiryContentsM}>Content</span>
                                        <textarea ref={this.refMemo} className={re.contactTextBoxMemoM} type="text" placeholder="Please enter your inquiry"></textarea>
                                    </div>
                                    <div className={re.conFourthBoxM}>
                                        <div className={re.conInputArea}>
                                            {/* <label><input ref={this.refCheckbox} class="checkTest" type="checkbox" name="color" value="red" onClick={this.checkTest} id="aaa" /><p class="inputText">개인정보 취급 방침에 동의합니다.</p></label> */}
                                            <input type="checkbox" ref={this.refCheckbox} class="checkTest" id="check1" name="color" value="red" onClick={this.checkTest} /><label htmlFor={"check1"}></label><p class="inputTextM">I agree with the personal information handling policy.</p>
                                            <span className={re.personalInforM} id="popupDom" onClick={() => this.openPopup2()}>View policy</span>
                                            {
                                                this.state.isOpenPopup2 &&
                                                <PopupDom>
                                                    <PersonalInforPop onClose={this.closePopup} />
                                                </PopupDom>
                                            }
                                        </div>
                                    </div>
                                    <span>
                                        <button type="button"
                                            id="popupDom"
                                            className={re.contactSendM}
                                            onClick={() => this.onSend()}
                                        >Send Question
                                        </button>
                                        {
                                            this.state.isOpenPopup &&
                                            <PopupDom>
                                                <div className={re.shadow}></div>
                                                <ContactPop onClose={this.closePopup} />
                                            </PopupDom>
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={home.footBox}>
                            <div className={home.footLeftArea}>
                                <div className={home.footTitleBox}>
                                    <span>U&E</span>
                                </div>
                                <div className={home.footContents}>
                                    <div className={home.footConTop}>
                                        <span>Corporate Registration Number: 502-86-09535</span>
                                        <span className={home.footBorder}></span>
                                        <span>Tel: 82-2-714-4133</span>
                                        <span className={home.footBorder}></span>
                                        <span>Fax: 82-2-714-4134</span>
                                        <span className={home.footBorder}></span>
                                        <span className={home.footEmail}>E-mail:<a href="mailto:team_manager@unes.co.kr" style={{ color: '#666666', marginLeft: '6px' }}>team_manager@unes.co.kr</a></span>
                                    </div>
                                    <div className={home.footConBottom}>
                                        <span className={home.footBold}>Address (Seoul) : 1F, Juyeon Bldg, 345, Cheongpa-ro, Yongsan-gu, Seoul, Republic of Korea (Zip code: 04303)</span>
                                        <span className={home.footBorder}></span>
                                        <span></span>
                                        <span><Link to="/directions">Map</Link></span>
                                    </div>
                                </div>
                                <div className={home.footContents2}>
                                    <span className={home.footText}>CopyrightⓒU&E All rights reserved.</span>
                                </div>
                            </div>
                            <div className={home.footIconArea}>
                                <a href="../../resource/une_companyInfo_2024.pdf" download>
                                    <span className={home.companyDown}>Company Introduction
                                        <span className={home.companyImg}></span>
                                    </span>
                                </a>
                                <div className={home.footIconBox}>
                                    <span><a target="_blank" href="https://www.youtube.com/channel/UC_DmpJ1xIYW9faxTi1M8TMQ"><span className={home.footYouTube}></span></a></span>
                                    <span><a target="_blank" href="https://www.instagram.com/unes.kr"><span className={home.footinstagram}></span></a></span>
                                    <span><a target="_blank" href="https://www.facebook.com/%EC%9C%A0%EC%97%94%EC%9D%B4-100778369074049"><span className={home.footFacebook}></span></a></span>
                                </div>
                                <div>

                                    {/*  <span className={home.korBtn} onClick={this.onClickKOR}>KOR</span>
                                                <span className={home.engBtn} onClick={this.onClickENG}>ENG</span> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        } else {
            displayContactUI.push(
                <></>
            );
        }
        return displayContactUI;
    }

    render() {

        setTimeout(() => { this.resizeUI() }, 500);
        let displayContactUI = this.state.disContactUI;

        return (
            <>
                {displayContactUI}
            </>
        );
    }
}

export default ContactSectionEng;