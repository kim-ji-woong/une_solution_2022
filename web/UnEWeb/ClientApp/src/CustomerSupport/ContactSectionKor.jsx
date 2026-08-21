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

import PopupDom from '../CustomerSupport/PopupDom.jsx';
import ContactPop from '../CustomerSupport/ContactPop.jsx';
import PersonalInforPop from '../CustomerSupport/PersonalInforPop.jsx';

import Resource from '../resource/id';
import * as emailjs from "emailjs-com";

class ContactSectionKor extends Component {
    static displayName = ContactSectionKor.name;

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
        this.refName = React.createRef();
        this.refCompany = React.createRef();
        this.refMemo = React.createRef();
        this.refCheckbox = React.createRef();
        this.refContactTarget = React.createRef();

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
        if (this.refMemo.current === null || this.refContactTarget.current === null) {
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
                            <span data-aos="fade-down" data-aos-duration="1000">채용 및 문의</span>
                            <span data-aos="fade-down" data-aos-duration="1000">유엔이의 인재채용, 복리후생, 회사 문의사항에 대해 소개합니다.</span>
                        </div>
                        <div id="sectionRecruit">
                            <div className={bIntro.spatialInforContentsSect}>
                                <div className={re.recruitArea}>
                                    <div className={re.talentedBox}>
                                        <span className={re.talentedTitle} data-aos="fade-down" data-aos-duration="1000">인재채용</span>
                                        <span className={re.talentedConts}>끊임없는 혁신과 최고의 전문성을 추구하며 열린 마음으로 소통하는 인재를 모십니다.</span>
                                        <div className={re.talentedFlexBox}>
                                            <div className={re.tFlex1}>
                                                <div className={re.tBox1}>창의적 인재</div>
                                                <div className={re.tBox2}>
                                                    <span><span className={re.tBoldText}>I</span>nnovation</span>
                                                    <span>혁신적 변화를 선도하는 창의적이고 도전적인 인재</span>
                                                </div>
                                            </div>
                                            <div className={re.tFlex2}>
                                                <div className={re.tBox3}>전문적 인재</div>
                                                <div className={re.tBox4}>
                                                    <span><span className={re.tBoldText}>P</span>rofessional</span>
                                                    <span>자신의 분야에서 노력하며 최고의 전문성을 갖출 수 있는 인재</span>
                                                </div>
                                            </div>
                                            <div className={re.tFlex3}>
                                                <div className={re.tBox5}>열린 인재</div>
                                                <div className={re.tBox6}>
                                                    <span><span className={re.tBoldText}>C</span>ommunication</span>
                                                    <span>고객과 조직 구성원을 존중하고 열린 마음으로 소통하는 인재</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={re.recruitSubBoxS}>
                            <span className={re.reCircle}></span>
                            <span className={re.recruitSubTitle}>채용절차 및 공고</span>
                            <span className={re.recruitSubConts}>유엔이는 지원자의 자질과 역량을 정확하게 파악하기 위해 <span>공정하고 투명한 채용절차</span>를 준수합니다.</span>
                            <span className={re.recruitSubConts2}>(※세부 내용은 아래 채용공고를 확인해 주시기 바라며, 당사 사정에 따라 일부 변경될 수 있습니다.)</span>
                            <div className={re.recruitShape}>
                                <span className={re.firstMeet}>1차 면접</span>
                                <span className={re.dashedLine}></span>
                                <span className={re.recruitCircle}></span>
                                <span className={re.document}>서류 전형</span>
                            <div className={re.recruitShape2}>
                                <span className={re.dashedLine2}></span>
                                <span className={re.recruitCircle2}></span>
                            </div>
                                <span className={re.lastMeet}>임원 면접</span>
                                <span className={re.dashedLine3}></span>
                                <span className={re.recruitCircle3}></span>
                                <span className={re.accept}>최종 합격</span>
                            </div>
                            <span className={re.shortcut}><a href="https://www.jobkorea.co.kr/Recruit/Co_Read/Recruit/C/une9966?ChkDispType=1">채용공고 바로가기</a></span>
                            {/* <span className={re.explanation}>※상세 일정 및 전형 과정은 회사 사정에 따라 변경될 수 있으며, 자세한 내용은 아래 채용공고를 확인해 주시기 바랍니다.</span> */}
                        </div>

                        <div id="sectionBenefits">
                            <div className={re.benefitsBoxS}>
                                <span className={re.benefitsTitle} data-aos="fade-down" data-aos-duration="1000">복리후생</span>
                                <span className={re.benefitsTitle2}>목표달성을 위한 노력과 자기계발을 성과로 보답하는 기업이 되겠습니다.</span>
                                <div className={re.benefitsArea}>
                                    <div className={re.payBoxS}>
                                        <span className={re.payIconBoxImg}></span>
                                        <span className={re.payIconFont}>연봉/보상</span>
                                        <div className={re.payTextBox}>
                                            <span>연말 성과평가에 따른 인센티브 지급</span>
                                            <span>점심식대 및 식비 지원</span>
                                            <span>업무활동비 지원</span>
                                            <span>장기근속자 포상</span>
                                            <span>4대보험 및 퇴직연금</span>
                                            <span></span>
                                        </div>
                                    </div>

                                    <div className={re.environmentBoxS}>
                                        <span className={re.environmentIconBoxImg}></span>
                                        <span className={re.environmentIconBoxFont}>근무환경</span>
                                        <div className={re.environmentTextBox}>
                                            <span>탄력근무제</span>
                                            <span>경조휴가 및 하계휴가</span>
                                            <span>출산장려 및 육아휴직</span>
                                            <span>연차 사용 장려</span>
                                            <span>자유복장</span>
                                            <span>명절선물</span>
                                            <span></span>
                                        </div>
                                    </div>

                                    <div className={re.developmentBoxS}>
                                        <span className={re.developIconBoxImg}></span>
                                        <span className={re.developIconBoxFont}>역량개발</span>
                                        <div className={re.developmentTextBox}>
                                            <span>도서구입비, 교육비 지원</span>
                                            <span>자격증 취득비용 지원</span>
                                            <span>각종 자기계발비 지원</span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="sectionInquiry">
                            <div className={re.InquiryBoxS}>
                                <div className={re.InquiryArea}>
                                    <span className={re.contactTitle} data-aos="fade-down" data-aos-duration="1000">문의하기</span>
                                    <span className={re.contactSideTitle}>회사에 대해 궁금한 점을 문의해 주시면 분야별 담당자가 회신해 드립니다.
                                                                         (※ 주중 업무시간은 08:00~17:00, 점심시간은 11:30~12:30이며, 토·일·공휴일은 휴무입니다.)</span>

                                    <div className={re.conFirstBoxM}>
                                        <span className={re.conKindNameM}>문의 종류</span>
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

                                                {/*<select ref={this.refContactTarget} class="InquiryHomeSelect">*/}
                                                {/*    <option class="InquiryHomeOptionItem" value="bn@unes.co.kr">사업제안/제휴</option>*/}
                                                {/*    <option class="InquiryHomeOptionItem" value="plan@unes.co.kr">안전관리 분야</option>*/}
                                                {/*    <option class="InquiryHomeOptionItem" value="plan@unes.co.kr">디지털 트윈 분야</option>*/}
                                                {/*    <option class="InquiryHomeOptionItem" value="plan@unes.co.kr">공간정보 분야</option>*/}
                                                {/*    <option class="InquiryHomeOptionItem" value="support@unes.co.kr">회사 일반</option>*/}
                                                {/*</select>*/}
                                                <select ref={this.refContactTarget} class="InquiryHomeSelect">
                                                    <option class="InquiryHomeOptionItem" value="사업제안/제휴">사업제안/제휴</option>
                                                    <option class="InquiryHomeOptionItem" value="안전관리 분야">안전관리 분야</option>
                                                    <option class="InquiryHomeOptionItem" value="디지털 트윈 분야">디지털 트윈 분야</option>
                                                    <option class="InquiryHomeOptionItem" value="공간정보 분야">공간정보 분야</option>
                                                    <option class="InquiryHomeOptionItem" value="회사 일반">회사 일반</option>
                                                </select>
                                            </>
                                        }
                                    </div>
                                    <div className={re.conSecondBoxM}>
                                        <div className={re.conLeftBoxM}>
                                            <span className={re.conLeftTBox}>
                                                <span className={re.companyNameM}>회사명</span>
                                                <span className={re.companyNameSelect}>* 선택</span>
                                            </span>
                                            <input type="text" ref={this.refCompany} className={re.contactCompanyBoxM} placeholder="회사명을 입력하여 주십시오." />
                                        </div>
                                        <div className={re.conMiddleBoxM}>
                                            <span className={re.conPeopleNameM}>성함</span>
                                            <input type="text" ref={this.refName} className={re.contactNameBoxM} placeholder="성함을 입력하여 주십시오." />
                                        </div>
                                        <div className={re.conRightBoxM}>
                                            <span className={re.contactEmailM}>이메일</span>
                                            <input type="text" ref={this.refEmail} className={re.contactEmailBoxM} placeholder="이메일을 입력하여 주십시오." />
                                        </div>
                                    </div>
                                    <div className={re.conThirdBoxM}>
                                        <span className={re.InquiryContentsM}>문의 내용</span>
                                        <textarea ref={this.refMemo} className={re.contactTextBoxMemoM} type="text" placeholder="문의 내용을 입력하여 주십시오."></textarea>
                                    </div>
                                    <div className={re.conFourthBoxM}>
                                        <div className={re.conInputArea}>
                                            {/* <label><input ref={this.refCheckbox} class="checkTest" type="checkbox" name="color" value="red" onClick={this.checkTest} id="aaa" /><p class="inputText">개인정보 취급 방침에 동의합니다.</p></label> */}
                                            <input type="checkbox" ref={this.refCheckbox} class="checkTest" id="check1" name="color" value="red" onClick={this.checkTest} /><label htmlFor={"check1"}></label><p class="inputTextM">개인정보 취급방침에 동의합니다.</p>
                                            <span className={re.personalInforM} id="popupDom" onClick={() => this.openPopup2()}>개인정보처리방침 보기</span>
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
                                        >문의하기
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
                                    <span className={home.footTitle}>(주)유엔이</span>
                                    <a href="../../resource/une_companyInfo_2024.pdf" download>
                                        <span className={home.companyDown}>
                                            <span className={home.companyDownText}>회사소개서 다운로드</span>
                                            <span className={home.companyImg}></span>
                                        </span>
                                    </a>
                                </div>
                                <div className={home.footContents}>
                                    <span>사업자등록번호 : 502-86-09535</span>
                                    <div className={home.footConTop}>
                                        <span>전화번호 : 02-714-4133</span>
                                        <span>팩스번호 : 02-714-4134</span>
                                    </div>
                                    <span className={home.footEmail}>문의메일 :<a href="mailto:team_manager@unes.co.kr" style={{ color: '#666666', marginLeft: '6px' }}>team_manager@unes.co.kr</a></span>
                                    <div className={home.footConBottom}>
                                        <span className={home.footBold}>서울지사 : 서울 용산구 청파로 345, 주연빌딩 1층 (우:04303)</span>
                                        <span><Link to="/directions">오시는길</Link></span>
                                    </div>
                                    <span>본사 : 대구 달서구 달구벌대로 1053, 계명대학교 첨단산업지원센터 108호 (우:42601)</span>
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
                            <span data-aos="fade-down" data-aos-duration="1000">채용 및 문의</span>
                            <span data-aos="fade-down" data-aos-duration="1000">유엔이의 인재채용, 복리후생, 회사 문의사항에 대해 소개합니다.</span>
                        </div>
                        <div id="sectionRecruit">
                            <div className={bIntro.spatialInforContentsSect}>
                                <div className={re.recruitArea}>
                                    <div className={re.talentedBox}>
                                        <span className={re.talentedTitle} data-aos="fade-down" data-aos-duration="1000">인재채용</span>
                                        <span className={re.talentedConts}>끊임없는 혁신과 최고의 전문성을 추구하며 열린 마음으로 소통하는 인재를 모십니다.</span>
                                        <div className={re.talentedFlexBox}>
                                            <div className={re.tFlex1}>
                                                <div className={re.tBox1}>창의적 인재</div>
                                                <div className={re.tBox2}>
                                                    <span><span className={re.tBoldText}>I</span>nnovation</span>
                                                    <span>혁신적 변화를 선도하는 창의적이고 도전적인 인재</span>
                                                </div>
                                            </div>
                                            <div className={re.tFlex2}>
                                                <div className={re.tBox3}>전문적 인재</div>
                                                <div className={re.tBox4}>
                                                    <span><span className={re.tBoldText}>P</span>rofessional</span>
                                                    <span>자신의 분야에서 노력하며 최고의 전문성을 갖출 수 있는 인재</span>
                                                </div>
                                            </div>
                                            <div className={re.tFlex3}>
                                                <div className={re.tBox5}>열린 인재</div>
                                                <div className={re.tBox6}>
                                                    <span><span className={re.tBoldText}>C</span>ommunication</span>
                                                    <span>고객과 조직 구성원을 존중하고 열린 마음으로 소통하는 인재</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={re.recruitSubBoxS}>
                            <span className={re.reCircle}></span>
                            <span className={re.recruitSubTitle}>채용절차 및 공고</span>
                            <span className={re.recruitSubConts}>유엔이는 지원자의 자질과 역량을 정확하게 파악하기 위해 <span>공정하고 투명한 채용절차</span>를 준수합니다.</span>
                            <span className={re.recruitSubConts2}>(※세부 내용은 아래 채용공고를 확인해 주시기 바라며, 당사 사정에 따라 일부 변경될 수 있습니다.)</span>
                            <div className={re.recruitShape}>
                                <span className={re.firstMeet}>1차 면접</span>
                                <span className={re.dashedLine}></span>
                                <span className={re.recruitCircle}></span>
                                <span className={re.document}>서류 전형</span>
                                <div className={re.recruitShape2}>
                                    <span className={re.dashedLine2}></span>
                                    <span className={re.recruitCircle2}></span>
                                </div>
                                <span className={re.lastMeet}>임원 면접</span>
                                <span className={re.dashedLine3}></span>
                                <span className={re.recruitCircle3}></span>
                                <span className={re.accept}>최종 합격</span>
                            </div>
                            <span className={re.shortcut}><a href="https://www.jobkorea.co.kr/Recruit/Co_Read/Recruit/C/une9966?ChkDispType=1">채용공고 바로가기</a></span>
                            {/* <span className={re.explanation}>※상세 일정 및 전형 과정은 회사 사정에 따라 변경될 수 있으며, 자세한 내용은 아래 채용공고를 확인해 주시기 바랍니다.</span> */}
                        </div>

                        <div id="sectionBenefits">
                            <div className={re.benefitsBoxS}>
                                <span className={re.benefitsTitle} data-aos="fade-down" data-aos-duration="1000">복리후생</span>
                                <span className={re.benefitsTitle2}>목표달성을 위한 노력과 자기계발을 성과로 보답하는 기업이 되겠습니다.</span>
                                <div className={re.benefitsArea}>
                                    <div className={re.payBoxS}>
                                        <span className={re.payIconBoxImg}></span>
                                        <span className={re.payIconFont}>연봉/보상</span>
                                        <div className={re.payTextBox}>
                                            <span>연말 성과평가에 따른 인센티브 지급</span>
                                            <span>점심식대 및 식비 지원</span>
                                            <span>업무활동비 지원</span>
                                            <span>장기근속자 포상</span>
                                            <span>4대보험 및 퇴직연금</span>
                                            <span></span>
                                        </div>
                                    </div>

                                    <div className={re.environmentBoxS}>
                                        <span className={re.environmentIconBoxImg}></span>
                                        <span className={re.environmentIconBoxFont}>근무환경</span>
                                        <div className={re.environmentTextBox}>
                                            <span>탄력근무제</span>
                                            <span>경조휴가 및 하계휴가</span>
                                            <span>출산장려 및 육아휴직</span>
                                            <span>연차 사용 장려</span>
                                            <span>자유복장</span>
                                            <span>명절선물</span>
                                            <span></span>
                                        </div>
                                    </div>

                                    <div className={re.developmentBoxS}>
                                        <span className={re.developIconBoxImg}></span>
                                        <span className={re.developIconBoxFont}>역량개발</span>
                                        <div className={re.developmentTextBox}>
                                            <span>도서구입비, 교육비 지원</span>
                                            <span>자격증 취득비용 지원</span>
                                            <span>각종 자기계발비 지원</span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="sectionInquiry">
                            <div className={re.InquiryBoxS}>
                                <div className={re.InquiryArea}>
                                    <span className={re.contactTitle} data-aos="fade-down" data-aos-duration="1000">문의하기</span>
                                    <span className={re.contactSideTitle}>회사에 대해 궁금한 점을 문의해 주시면 분야별 담당자가 회신해 드립니다.
                                        (※ 주중 업무시간은 08:00~17:00, 점심시간은 11:30~12:30이며, 토·일·공휴일은 휴무입니다.)</span>

                                    <div className={re.conFirstBoxM}>
                                        <span className={re.conKindNameM}>문의 종류</span>
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

                                                {/*<select ref={this.refContactTarget} class="InquiryHomeSelect">*/}
                                                {/*    <option class="InquiryHomeOptionItem" value="bn@unes.co.kr">사업제안/제휴</option>*/}
                                                {/*    <option class="InquiryHomeOptionItem" value="plan@unes.co.kr">안전관리 분야</option>*/}
                                                {/*    <option class="InquiryHomeOptionItem" value="plan@unes.co.kr">디지털 트윈 분야</option>*/}
                                                {/*    <option class="InquiryHomeOptionItem" value="plan@unes.co.kr">공간정보 분야</option>*/}
                                                {/*    <option class="InquiryHomeOptionItem" value="support@unes.co.kr">회사 일반</option>*/}
                                                {/*</select>*/}
                                                <select ref={this.refContactTarget} class="InquiryHomeSelect">
                                                    <option class="InquiryHomeOptionItem" value="사업제안/제휴">사업제안/제휴</option>
                                                    <option class="InquiryHomeOptionItem" value="안전관리 분야">안전관리 분야</option>
                                                    <option class="InquiryHomeOptionItem" value="디지털 트윈 분야">디지털 트윈 분야</option>
                                                    <option class="InquiryHomeOptionItem" value="공간정보 분야">공간정보 분야</option>
                                                    <option class="InquiryHomeOptionItem" value="회사 일반">회사 일반</option>
                                                </select>
                                            </>
                                        }
                                    </div>
                                    <div className={re.conSecondBoxM}>
                                        <div className={re.conLeftBoxM}>
                                            <span className={re.conLeftTBox}>
                                                <span className={re.companyNameM}>회사명</span>
                                                <span className={re.companyNameSelect}>* 선택</span>
                                            </span>
                                            <input type="text" ref={this.refCompany} className={re.contactCompanyBoxM} placeholder="회사명을 입력하여 주십시오." />
                                        </div>
                                        <div className={re.conMiddleBoxM}>
                                            <span className={re.conPeopleNameM}>성함</span>
                                            <input type="text" ref={this.refName} className={re.contactNameBoxM} placeholder="성함을 입력하여 주십시오." />
                                        </div>
                                        <div className={re.conRightBoxM}>
                                            <span className={re.contactEmailM}>이메일</span>
                                            <input type="text" ref={this.refEmail} className={re.contactEmailBoxM} placeholder="이메일을 입력하여 주십시오." />
                                        </div>
                                    </div>
                                    <div className={re.conThirdBoxM}>
                                        <span className={re.InquiryContentsM}>문의 내용</span>
                                        <textarea ref={this.refMemo} className={re.contactTextBoxMemoM} type="text" placeholder="문의 내용을 입력하여 주십시오."></textarea>
                                    </div>
                                    <div className={re.conFourthBoxM}>
                                        <div className={re.conInputArea}>
                                            {/* <label><input ref={this.refCheckbox} class="checkTest" type="checkbox" name="color" value="red" onClick={this.checkTest} id="aaa" /><p class="inputText">개인정보 취급 방침에 동의합니다.</p></label> */}
                                            <input type="checkbox" ref={this.refCheckbox} class="checkTest" id="check1" name="color" value="red" onClick={this.checkTest} /><label htmlFor={"check1"}></label><p class="inputTextM">개인정보 취급방침에 동의합니다.</p>
                                            <span className={re.personalInforM} id="popupDom" onClick={() => this.openPopup2()}>개인정보처리방침 보기</span>
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
                                        >문의하기
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
                                    <span className={home.footTitle}>(주)유엔이</span>
                                    <a href="../../resource/une_companyInfo_2024.pdf" download>
                                        <span className={home.companyDown}>
                                            <span className={home.companyDownText}>회사소개서 다운로드</span>
                                            <span className={home.companyImg}></span>
                                        </span>
                                    </a>
                                </div>
                                <div className={home.footContents}>
                                    <span>사업자등록번호 : 502-86-09535</span>
                                    <div className={home.footConTop}>
                                        <span>전화번호 : 02-714-4133</span>
                                        <span>팩스번호 : 02-714-4134</span>
                                    </div>
                                    <span className={home.footEmail}>문의메일 :<a href="mailto:team_manager@unes.co.kr" style={{ color: '#666666', marginLeft: '6px' }}>team_manager@unes.co.kr</a></span>
                                    <div className={home.footConBottom}>
                                        <span className={home.footBold}>서울지사 : 서울 용산구 청파로 345, 주연빌딩 1층 (우:04303)</span>
                                        <span><Link to="/directions">오시는길</Link></span>
                                    </div>
                                    <span>본사 : 대구 달서구 달구벌대로 1053, 계명대학교 첨단산업지원센터 108호 (우:42601)</span>
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
                            <span data-aos="fade-down" data-aos-duration="1000">채용 및 문의</span>
                            <span data-aos="fade-down" data-aos-duration="1000">유엔이의 인재채용, 복리후생, 회사 문의사항에 대해 소개합니다.</span>
                        </div>
                        <div id="sectionRecruit">
                            <div className={bIntro.spatialInforContentsSect}>
                                <div className={re.recruitArea}>
                                    <div className={re.talentedBox}>
                                        <span className={re.talentedTitle} data-aos="fade-down" data-aos-duration="1000">인재채용</span>
                                        <span className={re.talentedConts}>끊임없는 혁신과 최고의 전문성을 추구하며 열린 마음으로 소통하는 인재를 모십니다.</span>
                                        <div className={re.talentedFlexBox}>
                                            <div className={re.tFlex1}>
                                                <div className={re.tBox1}>창의적 인재</div>
                                                <div className={re.tBox2}>
                                                    <span><span className={re.tBoldText}>I</span>nnovation</span>
                                                    <span>혁신적 변화를 선도하는</span>
                                                    <span>창의적이고 도전적인 인재</span>
                                                    <span></span>
                                                </div>
                                            </div>
                                            <div className={re.tFlex2}>
                                                <div className={re.tBox3}>전문적 인재</div>
                                                <div className={re.tBox4}>
                                                    <span><span className={re.tBoldText}>P</span>rofessional</span>
                                                    <span>자신의 분야에서 노력하며</span>
                                                    <span>최고의 전문성을 갖출 수 있는 인재</span>
                                                    <span></span>
                                                </div>
                                            </div>
                                            <div className={re.tFlex3}>
                                                <div className={re.tBox5}>열린 인재</div>
                                                <div className={re.tBox6}>
                                                    <span><span className={re.tBoldText}>C</span>ommunication</span>
                                                    <span>고객과 조직 구성원을 존중하고</span>
                                                    <span>열린 마음으로 소통하는 인재</span>
                                                    <span></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={re.recruitSubBoxS}>
                            <span className={re.reCircle}></span>
                            <span className={re.recruitSubTitle}>채용절차 및 공고</span>
                            <span className={re.recruitSubConts}>유엔이는 지원자의 자질과 역량을 정확하게 파악하기 위해 <span>공정하고 투명한 채용절차</span>를 준수합니다.</span>
                            <span className={re.recruitSubConts2}>(※세부 내용은 아래 채용공고를 확인해 주시기 바라며, 당사 사정에 따라 일부 변경될 수 있습니다.)</span>
                            <div className={re.recruitShape}>
                                <span className={re.document}>
                                    <p>서류 전형</p>
                                    <p></p>
                                </span>
                                <span className={re.dashedLine}></span>
                                <span className={re.recruitCircle}></span>
                                <span className={re.firstMeet}>1차 면접</span>
                                <span className={re.dashedLine}></span>
                                <span className={re.recruitCircle}></span>
                                <span className={re.lastMeet}>임원 면접<span></span></span>
                                <span className={re.dashedLine}></span>
                                <span className={re.recruitCircle}></span>
                                <span className={re.accept}>최종 합격</span>
                            </div>
                            <span className={re.shortcut}><a href="https://www.jobkorea.co.kr/Recruit/Co_Read/Recruit/C/une9966?ChkDispType=1">채용공고 바로가기</a></span>
                            {/* <span className={re.explanation}>※상세 일정 및 전형 과정은 회사 사정에 따라 변경될 수 있으며, 자세한 내용은 아래 채용공고를 확인해 주시기 바랍니다.</span> */}
                        </div>

                        <div id="sectionBenefits">
                            <div className={re.benefitsBoxS}>
                                <span className={re.benefitsTitle} data-aos="fade-down" data-aos-duration="1000">복리후생</span>
                                <span className={re.benefitsTitle2}>목표달성을 위한 노력과 자기계발을 성과로 보답하는 기업이 되겠습니다.</span>
                                <div className={re.benefitsArea}>
                                    <div className={re.payBoxS}>
                                        <span className={re.payIconBoxImg}></span>
                                        <span className={re.payIconFont}>연봉/보상</span>
                                        <div className={re.payTextBox}>
                                            <span>연말 성과평가에 따른 인센티브 지급</span>
                                            <span>점심식대 및 식비 지원</span>
                                            <span>업무활동비 지원</span>
                                            <span>장기근속자 포상</span>
                                            <span>4대보험 및 퇴직연금</span>
                                            <span></span>
                                        </div>
                                    </div>

                                    <div className={re.environmentBoxS}>
                                        <span className={re.environmentIconBoxImg}></span>
                                        <span className={re.environmentIconBoxFont}>근무환경</span>
                                        <div className={re.environmentTextBox}>
                                            <span>탄력근무제</span>
                                            <span>경조휴가 및 하계휴가</span>
                                            <span>출산장려 및 육아휴직</span>
                                            <span>연차 사용 장려</span>
                                            <span>자유복장</span>
                                            <span>명절선물</span>
                                            <span></span>
                                        </div>
                                    </div>

                                    <div className={re.developmentBoxS}>
                                        <span className={re.developIconBoxImg}></span>
                                        <span className={re.developIconBoxFont}>역량개발</span>
                                        <div className={re.developmentTextBox}>
                                            <span>도서구입비, 교육비 지원</span>
                                            <span>자격증 취득비용 지원</span>
                                            <span>각종 자기계발비 지원</span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="sectionInquiry">
                            <div className={re.InquiryBoxS}>
                                <div className={re.InquiryArea}>
                                    <span className={re.contactTitle} data-aos="fade-down" data-aos-duration="1000">문의하기</span>
                                    <span className={re.contactSideTitle}>회사에 대해 궁금한 점을 문의해 주시면 분야별 담당자가 회신해 드립니다.</span>
                                    <span className={re.contactSideTitle2}>(※ 주중 업무시간은 08:00~17:00, 점심시간은 11:30~12:30이며, 토·일·공휴일은 휴무입니다.)</span>

                                    <div className={re.conFirstBoxM}>
                                        <span className={re.conKindNameM}>문의 종류</span>
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

                                                {/*<select ref={this.refContactTarget} class="InquiryHomeSelect">*/}
                                                {/*    <option class="InquiryHomeOptionItem" value="bn@unes.co.kr">사업제안/제휴</option>*/}
                                                {/*    <option class="InquiryHomeOptionItem" value="plan@unes.co.kr">안전관리 분야</option>*/}
                                                {/*    <option class="InquiryHomeOptionItem" value="plan@unes.co.kr">디지털 트윈 분야</option>*/}
                                                {/*    <option class="InquiryHomeOptionItem" value="plan@unes.co.kr">공간정보 분야</option>*/}
                                                {/*    <option class="InquiryHomeOptionItem" value="support@unes.co.kr">회사 일반</option>*/}
                                                {/*</select>*/}
                                                <select ref={this.refContactTarget} class="InquiryHomeSelect">
                                                    <option class="InquiryHomeOptionItem" value="사업제안/제휴">사업제안/제휴</option>
                                                    <option class="InquiryHomeOptionItem" value="안전관리 분야">안전관리 분야</option>
                                                    <option class="InquiryHomeOptionItem" value="디지털 트윈 분야">디지털 트윈 분야</option>
                                                    <option class="InquiryHomeOptionItem" value="공간정보 분야">공간정보 분야</option>
                                                    <option class="InquiryHomeOptionItem" value="회사 일반">회사 일반</option>
                                                </select>
                                            </>
                                        }
                                    </div>
                                    <div className={re.conSecondBoxM}>
                                        <div className={re.conLeftBoxM}>
                                            <span className={re.conLeftTBox}>
                                                <span className={re.companyNameM}>회사명</span>
                                                <span className={re.companyNameSelect}>* 선택</span>
                                            </span>
                                            <input type="text" ref={this.refCompany} className={re.contactCompanyBoxM} placeholder="회사명을 입력하여 주십시오." />
                                        </div>
                                        <div className={re.conMiddleBoxM}>
                                            <span className={re.conPeopleNameM}>성함</span>
                                            <input type="text" ref={this.refName} className={re.contactNameBoxM} placeholder="성함을 입력하여 주십시오." />
                                        </div>
                                        <div className={re.conRightBoxM}>
                                            <span className={re.contactEmailM}>이메일</span>
                                            <input type="text" ref={this.refEmail} className={re.contactEmailBoxM} placeholder="이메일을 입력하여 주십시오." />
                                        </div>
                                    </div>
                                    <div className={re.conThirdBoxM}>
                                        <span className={re.InquiryContentsM}>문의 내용</span>
                                        <textarea ref={this.refMemo} className={re.contactTextBoxMemoM} type="text" placeholder="문의 내용을 입력하여 주십시오."></textarea>
                                    </div>
                                    <div className={re.conFourthBoxM}>
                                        <div className={re.conInputArea}>
                                            {/* <label><input ref={this.refCheckbox} class="checkTest" type="checkbox" name="color" value="red" onClick={this.checkTest} id="aaa" /><p class="inputText">개인정보 취급 방침에 동의합니다.</p></label> */}
                                            <input type="checkbox" ref={this.refCheckbox} class="checkTest" id="check1" name="color" value="red" onClick={this.checkTest} /><label htmlFor={"check1"}></label><p class="inputTextM">개인정보 취급방침에 동의합니다.</p>
                                            <span className={re.personalInforM} id="popupDom" onClick={() => this.openPopup2()}>개인정보처리방침 보기</span>
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
                                        >문의하기
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
                                    <span>(주)유엔이</span>
                                </div>
                                <div className={home.footContents}>
                                    <div className={home.footConTop}>
                                        <span>사업자등록번호 : 502-86-09535</span>
                                        <span className={home.footBorder}></span>
                                        <span>전화번호 : 02-714-4133</span>
                                        <span className={home.footBorder}></span>
                                        <span>팩스번호 : 02-714-4134</span>
                                        <span className={home.footBorder}></span>
                                        <span className={home.footEmail}>문의메일 :<a href="mailto:team_manager@unes.co.kr" style={{ color: '#666666', marginLeft: '6px' }}>team_manager@unes.co.kr</a></span>
                                    </div>
                                    <div className={home.footConBottom}>
                                        <span className={home.footBold}>서울지사 : 서울 용산구 청파로 345, 주연빌딩 1층 (우:04303)</span>
                                        <span className={home.footBorder}></span>
                                        <span>본사 : 대구 달서구 달구벌대로 1053, 계명대학교 첨단산업지원센터 108호 (우:42601)</span>
                                        <span><Link to="/directions">오시는길</Link></span>
                                    </div>
                                </div>
                                <div className={home.footContents2}>
                                    <span className={home.footText}>CopyrightⓒU&E All rights reserved.</span>
                                </div>
                            </div>
                            <div className={home.footIconArea}>
                                <a href="../../resource/une_companyInfo_2024.pdf" download>
                                    <span className={home.companyDown}>회사소개서 다운로드
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
                            <span data-aos="fade-down" data-aos-duration="1000">채용 및 문의</span>
                            <span data-aos="fade-down" data-aos-duration="1000">유엔이의 인재채용, 복리후생, 회사 문의사항에 대해 소개합니다.</span>
                        </div>
                        <div id="sectionRecruit">
                            <div className={bIntro.spatialInforContentsSect}>
                                <div className={re.recruitArea}>
                                    <div className={re.talentedBox}>
                                        <span className={re.talentedTitle} data-aos="fade-down" data-aos-duration="1000">인재채용</span>
                                        <span className={re.talentedConts}>끊임없는 혁신과 최고의 전문성을 추구하며 열린 마음으로 소통하는 인재를 모십니다.</span>
                                        <div className={re.talentedFlexBox}>
                                            <div className={re.tFlex1}>
                                                <div className={re.tBox1}>창의적 인재</div>
                                                <div className={re.tBox2}>
                                                    <span><span className={re.tBoldText}>I</span>nnovation</span>
                                                    <span>혁신적 변화를 선도하는</span>
                                                    <span>창의적이고 도전적인 인재</span>
                                                    <span></span>
                                                </div>
                                            </div>
                                            <div className={re.tFlex2}>
                                                <div className={re.tBox3}>전문적 인재</div>
                                                <div className={re.tBox4}>
                                                    <span><span className={re.tBoldText}>P</span>rofessional</span>
                                                    <span>자신의 분야에서 노력하며</span>
                                                    <span>최고의 전문성을 갖출 수 있는 인재</span>
                                                    <span></span>
                                                </div>
                                            </div>
                                            <div className={re.tFlex3}>
                                                <div className={re.tBox5}>열린 인재</div>
                                                <div className={re.tBox6}>
                                                    <span><span className={re.tBoldText}>C</span>ommunication</span>
                                                    <span>고객과 조직 구성원을 존중하고</span>
                                                    <span>열린 마음으로 소통하는 인재</span>
                                                    <span></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={re.recruitSubBoxS}>
                            <span className={re.reCircle}></span>
                            <span className={re.recruitSubTitle}>채용절차 및 공고</span>
                            <span className={re.recruitSubConts}>유엔이는 지원자의 자질과 역량을 정확하게 파악하기 위해 <span>공정하고 투명한 채용절차</span>를 준수합니다.</span>
                            <span className={re.recruitSubConts2}>(※세부 내용은 아래 채용공고를 확인해 주시기 바라며, 당사 사정에 따라 일부 변경될 수 있습니다.)</span>
                            <div className={re.recruitShape}>
                                <span className={re.document}>
                                    <p>서류 전형</p>
                                    <p></p>
                                </span>
                                <span className={re.dashedLine}></span>
                                <span className={re.recruitCircle}></span>
                                <span className={re.firstMeet}>1차 면접</span>
                                <span className={re.dashedLine}></span>
                                <span className={re.recruitCircle}></span>
                                <span className={re.lastMeet}>임원 면접<span></span></span>
                                <span className={re.dashedLine}></span>
                                <span className={re.recruitCircle}></span>
                                <span className={re.accept}>최종 합격</span>
                            </div>
                            <span className={re.shortcut}><a href="https://www.jobkorea.co.kr/Recruit/Co_Read/Recruit/C/une9966?ChkDispType=1">채용공고 바로가기</a></span>
                            {/* <span className={re.explanation}>※상세 일정 및 전형 과정은 회사 사정에 따라 변경될 수 있으며, 자세한 내용은 아래 채용공고를 확인해 주시기 바랍니다.</span> */}
                        </div>

                        <div id="sectionBenefits">
                            <div className={re.benefitsBoxS}>
                                <span className={re.benefitsTitle} data-aos="fade-down" data-aos-duration="1000">복리후생</span>
                                <span className={re.benefitsTitle2}>목표달성을 위한 노력과 자기계발을 성과로 보답하는 기업이 되겠습니다.</span>
                                <div className={re.benefitsArea}>
                                    <div className={re.payBoxS}>
                                        <span className={re.payIconBoxImg}></span>
                                        <span className={re.payIconFont}>연봉/보상</span>
                                        <div className={re.payTextBox}>
                                            <span>연말 성과평가에 따른 인센티브 지급</span>
                                            <span>점심식대 및 식비 지원</span>
                                            <span>업무활동비 지원</span>
                                            <span>장기근속자 포상</span>
                                            <span>4대보험 및 퇴직연금</span>
                                            <span></span>
                                        </div>
                                    </div>

                                    <div className={re.environmentBoxS}>
                                        <span className={re.environmentIconBoxImg}></span>
                                        <span className={re.environmentIconBoxFont}>근무환경</span>
                                        <div className={re.environmentTextBox}>
                                            <span>탄력근무제</span>
                                            <span>경조휴가 및 하계휴가</span>
                                            <span>출산장려 및 육아휴직</span>
                                            <span>연차 사용 장려</span>
                                            <span>자유복장</span>
                                            <span>명절선물</span>
                                            <span></span>
                                        </div>
                                    </div>

                                    <div className={re.developmentBoxS}>
                                        <span className={re.developIconBoxImg}></span>
                                        <span className={re.developIconBoxFont}>역량개발</span>
                                        <div className={re.developmentTextBox}>
                                            <span>도서구입비, 교육비 지원</span>
                                            <span>자격증 취득비용 지원</span>
                                            <span>각종 자기계발비 지원</span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="sectionInquiry">
                            <div className={re.InquiryBoxS}>
                                <div className={re.InquiryArea}>
                                    <span className={re.contactTitle} data-aos="fade-down" data-aos-duration="1000">문의하기</span>
                                    <span className={re.contactSideTitle}>회사에 대해 궁금한 점을 문의해 주시면 분야별 담당자가 회신해 드립니다.</span>
                                    <span className={re.contactSideTitle2}>(※ 주중 업무시간은 08:00~17:00, 점심시간은 11:30~12:30이며, 토·일·공휴일은 휴무입니다.)</span>

                                    <div className={re.conFirstBoxM}>
                                        <span className={re.conKindNameM}>문의 종류</span>
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

                                                {/*<select ref={this.refContactTarget} class="InquiryHomeSelect">*/}
                                                {/*    <option class="InquiryHomeOptionItem" value="bn@unes.co.kr">사업제안/제휴</option>*/}
                                                {/*    <option class="InquiryHomeOptionItem" value="plan@unes.co.kr">안전관리 분야</option>*/}
                                                {/*    <option class="InquiryHomeOptionItem" value="plan@unes.co.kr">디지털 트윈 분야</option>*/}
                                                {/*    <option class="InquiryHomeOptionItem" value="plan@unes.co.kr">공간정보 분야</option>*/}
                                                {/*    <option class="InquiryHomeOptionItem" value="support@unes.co.kr">회사 일반</option>*/}
                                                {/*</select>*/}
                                                <select ref={this.refContactTarget} class="InquiryHomeSelect">
                                                    <option class="InquiryHomeOptionItem" value="사업제안/제휴">사업제안/제휴</option>
                                                    <option class="InquiryHomeOptionItem" value="안전관리 분야">안전관리 분야</option>
                                                    <option class="InquiryHomeOptionItem" value="디지털 트윈 분야">디지털 트윈 분야</option>
                                                    <option class="InquiryHomeOptionItem" value="공간정보 분야">공간정보 분야</option>
                                                    <option class="InquiryHomeOptionItem" value="회사 일반">회사 일반</option>
                                                </select>
                                            </>
                                        }
                                    </div>
                                    <div className={re.conSecondBoxM}>
                                        <div className={re.conLeftBoxM}>
                                            <span className={re.conLeftTBox}>
                                                <span className={re.companyNameM}>회사명</span>
                                                <span className={re.companyNameSelect}>* 선택</span>
                                            </span>
                                            <input type="text" ref={this.refCompany} className={re.contactCompanyBoxM} placeholder="회사명을 입력하여 주십시오." />
                                        </div>
                                        <div className={re.conMiddleBoxM}>
                                            <span className={re.conPeopleNameM}>성함</span>
                                            <input type="text" ref={this.refName} className={re.contactNameBoxM} placeholder="성함을 입력하여 주십시오." />
                                        </div>
                                        <div className={re.conRightBoxM}>
                                            <span className={re.contactEmailM}>이메일</span>
                                            <input type="text" ref={this.refEmail} className={re.contactEmailBoxM} placeholder="이메일을 입력하여 주십시오." />
                                        </div>
                                    </div>
                                    <div className={re.conThirdBoxM}>
                                        <span className={re.InquiryContentsM}>문의 내용</span>
                                        <textarea ref={this.refMemo} className={re.contactTextBoxMemoM} type="text" placeholder="문의 내용을 입력하여 주십시오."></textarea>
                                    </div>
                                    <div className={re.conFourthBoxM}>
                                        <div className={re.conInputArea}>
                                            {/* <label><input ref={this.refCheckbox} class="checkTest" type="checkbox" name="color" value="red" onClick={this.checkTest} id="aaa" /><p class="inputText">개인정보 취급 방침에 동의합니다.</p></label> */}
                                            <input type="checkbox" ref={this.refCheckbox} class="checkTest" id="check1" name="color" value="red" onClick={this.checkTest} /><label htmlFor={"check1"}></label><p class="inputTextM">개인정보 취급방침에 동의합니다.</p>
                                            <span className={re.personalInforM} id="popupDom" onClick={() => this.openPopup2()}>개인정보처리방침 보기</span>
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
                                        >문의하기
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
                                    <span>(주)유엔이</span>
                                </div>
                                <div className={home.footContents}>
                                    <div className={home.footConTop}>
                                        <span>사업자등록번호 : 502-86-09535</span>
                                        <span className={home.footBorder}></span>
                                        <span>전화번호 : 02-714-4133</span>
                                        <span className={home.footBorder}></span>
                                        <span>팩스번호 : 02-714-4134</span>
                                        <span className={home.footBorder}></span>
                                        <span className={home.footEmail}>문의메일 :<a href="mailto:team_manager@unes.co.kr" style={{ color: '#666666', marginLeft: '6px' }}>team_manager@unes.co.kr</a></span>
                                    </div>
                                    <div className={home.footConBottom}>
                                        <span className={home.footBold}>서울지사 : 서울 용산구 청파로 345, 주연빌딩 1층 (우:04303)</span>
                                        <span className={home.footBorder}></span>
                                        <span>본사 : 대구 달서구 달구벌대로 1053, 계명대학교 첨단산업지원센터 108호 (우:42601)</span>
                                        <span><Link to="/directions">오시는길</Link></span>
                                    </div>
                                </div>
                                <div className={home.footContents2}>
                                    <span className={home.footText}>CopyrightⓒU&E All rights reserved.</span>
                                </div>
                            </div>
                            <div className={home.footIconArea}>
                                <a href="../../resource/une_companyInfo_2024.pdf" download>
                                    <span className={home.companyDown}>회사소개서 다운로드
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
                            <span data-aos="fade-down" data-aos-duration="1000">채용 및 문의</span>
                            <span data-aos="fade-down" data-aos-duration="1000">유엔이의 인재채용, 복리후생, 회사 문의사항에 대해 소개합니다.</span>
                        </div>
                        <div id="sectionRecruit">
                            <div className={bIntro.spatialInforContentsSect}>
                                <div className={re.recruitArea}>
                                    <div className={re.talentedBox}>
                                        <span className={re.talentedTitle} data-aos="fade-down" data-aos-duration="1000">인재채용</span>
                                        <span className={re.talentedConts}>끊임없는 혁신과 최고의 전문성을 추구하며 열린 마음으로 소통하는 인재를 모십니다.</span>
                                        <div className={re.talentedFlexBox}>
                                            <div className={re.tFlex1}>
                                                <div className={re.tBox1}>창의적 인재</div>
                                                <div className={re.tBox2}>
                                                    <span><span className={re.tBoldText}>I</span>nnovation</span>
                                                    <span>혁신적 변화를 선도하는</span>
                                                    <span>창의적이고 도전적인 인재</span>
                                                    <span></span>
                                                </div>
                                            </div>
                                            <div className={re.tFlex2}>
                                                <div className={re.tBox3}>전문적 인재</div>
                                                <div className={re.tBox4}>
                                                    <span><span className={re.tBoldText}>P</span>rofessional</span>
                                                    <span>자신의 분야에서 노력하며</span>
                                                    <span>최고의 전문성을 갖출 수 있는 인재</span>
                                                    <span></span>
                                                </div>
                                            </div>
                                            <div className={re.tFlex3}>
                                                <div className={re.tBox5}>열린 인재</div>
                                                <div className={re.tBox6}>
                                                    <span><span className={re.tBoldText}>C</span>ommunication</span>
                                                    <span>고객과 조직 구성원을 존중하고</span>
                                                    <span>열린 마음으로 소통하는 인재</span>
                                                    <span></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={re.recruitSubBoxS}>
                            <span className={re.reCircle}></span>
                            <span className={re.recruitSubTitle}>채용절차 및 공고</span>
                            <span className={re.recruitSubConts}>유엔이는 지원자의 자질과 역량을 정확하게 파악하기 위해 <span>공정하고 투명한 채용절차</span>를 준수합니다.</span>
                            <span className={re.recruitSubConts2}>(※세부 내용은 아래 채용공고를 확인해 주시기 바라며, 당사 사정에 따라 일부 변경될 수 있습니다.)</span>
                            <div className={re.recruitShape}>
                                <span className={re.document}>
                                    <p>서류 전형</p>
                                    <p></p>
                                </span>
                                <span className={re.dashedLine}></span>
                                <span className={re.recruitCircle}></span>
                                <span className={re.firstMeet}>1차 면접</span>
                                <span className={re.dashedLine}></span>
                                <span className={re.recruitCircle}></span>
                                <span className={re.lastMeet}>임원 면접<span></span></span>
                                <span className={re.dashedLine}></span>
                                <span className={re.recruitCircle}></span>
                                <span className={re.accept}>최종 합격</span>
                            </div>
                            <span className={re.shortcut}><a href="https://www.jobkorea.co.kr/Recruit/Co_Read/Recruit/C/une9966?ChkDispType=1">채용공고 바로가기</a></span>
                            {/* <span className={re.explanation}>※상세 일정 및 전형 과정은 회사 사정에 따라 변경될 수 있으며, 자세한 내용은 아래 채용공고를 확인해 주시기 바랍니다.</span> */}
                        </div>

                        <div id="sectionBenefits">
                            <div className={re.benefitsBoxS}>
                                <span className={re.benefitsTitle} data-aos="fade-down" data-aos-duration="1000">복리후생</span>
                                <span className={re.benefitsTitle2}>목표달성을 위한 노력과 자기계발을 성과로 보답하는 기업이 되겠습니다.</span>
                                <div className={re.benefitsArea}>
                                    <div className={re.payBoxS}>
                                        <span className={re.payIconBoxImg}></span>
                                        <span className={re.payIconFont}>연봉/보상</span>
                                        <div className={re.payTextBox}>
                                            <span>연말 성과평가에 따른 인센티브 지급</span>
                                            <span>점심식대 및 식비 지원</span>
                                            <span>업무활동비 지원</span>
                                            <span>장기근속자 포상</span>
                                            <span>4대보험 및 퇴직연금</span>
                                            <span></span>
                                        </div>
                                    </div>

                                    <div className={re.environmentBoxS}>
                                        <span className={re.environmentIconBoxImg}></span>
                                        <span className={re.environmentIconBoxFont}>근무환경</span>
                                        <div className={re.environmentTextBox}>
                                            <span>탄력근무제</span>
                                            <span>경조휴가 및 하계휴가</span>
                                            <span>출산장려 및 육아휴직</span>
                                            <span>연차 사용 장려</span>
                                            <span>자유복장</span>
                                            <span>명절선물</span>
                                            <span></span>
                                        </div>
                                    </div>

                                    <div className={re.developmentBoxS}>
                                        <span className={re.developIconBoxImg}></span>
                                        <span className={re.developIconBoxFont}>역량개발</span>
                                        <div className={re.developmentTextBox}>
                                            <span>도서구입비, 교육비 지원</span>
                                            <span>자격증 취득비용 지원</span>
                                            <span>각종 자기계발비 지원</span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="sectionInquiry">
                            <div className={re.InquiryBoxS}>
                                <div className={re.InquiryArea}>
                                    <span className={re.contactTitle} data-aos="fade-down" data-aos-duration="1000">문의하기</span>
                                    <span className={re.contactSideTitle}>회사에 대해 궁금한 점을 문의해 주시면 분야별 담당자가 회신해 드립니다.</span>
                                    <span className={re.contactSideTitle2}>(※ 주중 업무시간은 08:00~17:00, 점심시간은 11:30~12:30이며, 토·일·공휴일은 휴무입니다.)</span>

                                    <div className={re.conFirstBoxM}>
                                        <span className={re.conKindNameM}>문의 종류</span>
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

                                                {/*<select ref={this.refContactTarget} class="InquiryHomeSelect">*/}
                                                {/*    <option class="InquiryHomeOptionItem" value="bn@unes.co.kr">사업제안/제휴</option>*/}
                                                {/*    <option class="InquiryHomeOptionItem" value="plan@unes.co.kr">안전관리 분야</option>*/}
                                                {/*    <option class="InquiryHomeOptionItem" value="plan@unes.co.kr">디지털 트윈 분야</option>*/}
                                                {/*    <option class="InquiryHomeOptionItem" value="plan@unes.co.kr">공간정보 분야</option>*/}
                                                {/*    <option class="InquiryHomeOptionItem" value="support@unes.co.kr">회사 일반</option>*/}
                                                {/*</select>*/}
                                                <select ref={this.refContactTarget} class="InquiryHomeSelect">
                                                    <option class="InquiryHomeOptionItem" value="사업제안/제휴">사업제안/제휴</option>
                                                    <option class="InquiryHomeOptionItem" value="안전관리 분야">안전관리 분야</option>
                                                    <option class="InquiryHomeOptionItem" value="디지털 트윈 분야">디지털 트윈 분야</option>
                                                    <option class="InquiryHomeOptionItem" value="공간정보 분야">공간정보 분야</option>
                                                    <option class="InquiryHomeOptionItem" value="회사 일반">회사 일반</option>
                                                </select>
                                            </>
                                        }
                                    </div>
                                    <div className={re.conSecondBoxM}>
                                        <div className={re.conLeftBoxM}>
                                            <span className={re.conLeftTBox}>
                                                <span className={re.companyNameM}>회사명</span>
                                                <span className={re.companyNameSelect}>* 선택</span>
                                            </span>
                                            <input type="text" ref={this.refCompany} className={re.contactCompanyBoxM} placeholder="회사명을 입력하여 주십시오." />
                                        </div>
                                        <div className={re.conMiddleBoxM}>
                                            <span className={re.conPeopleNameM}>성함</span>
                                            <input type="text" ref={this.refName} className={re.contactNameBoxM} placeholder="성함을 입력하여 주십시오." />
                                        </div>
                                        <div className={re.conRightBoxM}>
                                            <span className={re.contactEmailM}>이메일</span>
                                            <input type="text" ref={this.refEmail} className={re.contactEmailBoxM} placeholder="이메일을 입력하여 주십시오." />
                                        </div>
                                    </div>
                                    <div className={re.conThirdBoxM}>
                                        <span className={re.InquiryContentsM}>문의 내용</span>
                                        <textarea ref={this.refMemo} className={re.contactTextBoxMemoM} type="text" placeholder="문의 내용을 입력하여 주십시오."></textarea>
                                    </div>
                                    <div className={re.conFourthBoxM}>
                                        <div className={re.conInputArea}>
                                            {/* <label><input ref={this.refCheckbox} class="checkTest" type="checkbox" name="color" value="red" onClick={this.checkTest} id="aaa" /><p class="inputText">개인정보 취급 방침에 동의합니다.</p></label> */}
                                            <input type="checkbox" ref={this.refCheckbox} class="checkTest" id="check1" name="color" value="red" onClick={this.checkTest} /><label htmlFor={"check1"}></label><p class="inputTextM">개인정보 취급방침에 동의합니다.</p>
                                            <span className={re.personalInforM} id="popupDom" onClick={() => this.openPopup2()}>개인정보처리방침 보기</span>
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
                                        >문의하기
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
                                    <span>(주)유엔이</span>
                                </div>
                                <div className={home.footContents}>
                                    <div className={home.footConTop}>
                                        <span>사업자등록번호 : 502-86-09535</span>
                                        <span className={home.footBorder}></span>
                                        <span>전화번호 : 02-714-4133</span>
                                        <span className={home.footBorder}></span>
                                        <span>팩스번호 : 02-714-4134</span>
                                        <span className={home.footBorder}></span>
                                        <span className={home.footEmail}>문의메일 :<a href="mailto:team_manager@unes.co.kr" style={{ color: '#666666', marginLeft: '6px' }}>team_manager@unes.co.kr</a></span>
                                    </div>
                                    <div className={home.footConBottom}>
                                        <span className={home.footBold}>서울지사 : 서울 용산구 청파로 345, 주연빌딩 1층 (우:04303)</span>
                                        <span className={home.footBorder}></span>
                                        <span>본사 : 대구 달서구 달구벌대로 1053, 계명대학교 첨단산업지원센터 108호 (우:42601)</span>
                                        <span><Link to="/directions">오시는길</Link></span>
                                    </div>
                                </div>
                                <div className={home.footContents2}>
                                    <span className={home.footText}>CopyrightⓒU&E All rights reserved.</span>
                                </div>
                            </div>
                            <div className={home.footIconArea}>
                                <a href="../../resource/une_companyInfo_2024.pdf" download>
                                    <span className={home.companyDown}>회사소개서 다운로드
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

export default ContactSectionKor;