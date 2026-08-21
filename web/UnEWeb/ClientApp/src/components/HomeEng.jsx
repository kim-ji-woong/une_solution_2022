import React, { Component } from 'react';
import $ from 'jquery';
import home from '../components/css/home.module.css';
import re from '../Recruitment/css/recruitment.module.css';
//import '../components/css/navMenu.module.css';
import '../components/css/home.css';
import * as emailjs from "emailjs-com";

/* carousel */
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "aos/dist/aos.css";
import AOS from "aos";

/* fullPage test */
import { FullPage, Slide } from 'react-full-page';
import { Link } from "react-router-dom";

import PopupDom from '../CustomerSupport/PopupDom.jsx';
import ContactPop from '../CustomerSupport/ContactPop.jsx';
import PersonalInforPop from '../CustomerSupport/PersonalInforPop.jsx';

import videoSrc from '../components/video/mainIntro.mp4';

class HomeEng extends Component {
    static displayName = HomeEng.name;

    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            menu: 0,
            disHomeUI: null,
            //checkTest:null
            collapsed: true,
            isOpenPopup: false,
            isOpenPopup3: false,
        }

        this.openPopup = this.openPopup.bind(this);
        this.openPopup3 = this.openPopup3.bind(this);
        this.closePopup = this.closePopup.bind(this);

        this.refEmail = React.createRef();
        this.refPhone = React.createRef();
        this.refMemo = React.createRef();
        this.refCheckbox = React.createRef();
        this.refContactTarget = React.createRef();
        this.refCompany = React.createRef();
        this.refName = React.createRef();

        this.state.disHomeUI = this.displayHomeUI();
    }


    openPopup() {
        this.setState({
            isOpenPopup: true,
        })
    }

    openPopup3() {
        let temp = this.state.isOpenPopup3;

        if (temp === true) {
            temp = false;
        } else if (temp === false) {
            temp = true;
        }

        this.setState({
            isOpenPopup3: temp,
        })
    }

    closePopup() {
        this.setState({
            isOpenPopup: false,
        })
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    resizeUI() {
        this.setState({ disHomeUI: this.displayHomeUI() });
    }

    chkValue() {
        // 공통입력폼내의 모든 입력오브젝트
        var inputObjs = $('.' + home.contactCompanyBoxM);
        // 미입력여부(경우에 따라 사용)
        var bEmpty = true;
        var focus;

        // 각 오브젝트에 대해 입력체크
        inputObjs.each(function (index) {
            if ($(this).val() == '') {
                focus = $(this);
                bEmpty = false;

                //alert("필수 입력사항입니다.");
                //$(this).text("필수 입력사항입니다.");
                $('.' + home.contactCompanyBoxM).css({ border: 'solid 1px red' });
                $(this).text('필수 입력사항입니다.');

                focus.focus();

                // 여기서는 each문을 탈출
                return false;
            }
        });

        // 필수입력사항에 누락이 있으면 진행금지
        //if (!bEmpty) return;

        //form.submit();
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

    componentDidMount() {
        $(document).ready(function () {
            AOS.init();
        });

        window.addEventListener('resize', () => this.resizeUI());

        $(function () {
            $(window).scroll(function () {
                if ($(this).scrollTop() > 500) {
                    $('#toTop').show();
                }
            });

            $(window).scroll(function () {
                if ($(this).scrollTop() > 2900) {
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


        $(function () {
            $('.' + home.contactCompanyBoxM).keyup(function () {
                $('.' + home.contactCompanyBoxM).css({ border: 'solid 1px #4D8DE8' });
            });
        });
        $(function () {
            $('.' + home.contactCompanyBoxM).mouseleave(function () {
                $('.' + home.contactCompanyBoxM).css({ border: 'solid 1px #DDDDDD' });
            });
        });

        $(function () {
            $('.' + home.contactNameBoxM).keyup(function () {
                $('.' + home.contactNameBoxM).css({ border: 'solid 1px #4D8DE8' });
            });
        });
        $(function () {
            $('.' + home.contactNameBoxM).mouseleave(function () {
                $('.' + home.contactNameBoxM).css({ border: 'solid 1px #DDDDDD' });
            });
        });

        $(function () {
            $('.' + home.contactEmailBoxM).keyup(function () {
                $('.' + home.contactEmailBoxM).css({ border: 'solid 1px #4D8DE8' });
            });
        });
        $(function () {
            $('.' + home.contactEmailBoxM).mouseleave(function () {
                $('.' + home.contactEmailBoxM).css({ border: 'solid 1px #DDDDDD' });
            });
        });

        $(function () {
            $('.' + home.contactTextBoxMemoM).keyup(function () {
                $('.' + home.contactTextBoxMemoM).css({ border: 'solid 1px #4D8DE8' });
            });
        });
        $(function () {
            $('.' + home.contactTextBoxMemoM).mouseleave(function () {
                $('.' + home.contactTextBoxMemoM).css({ border: 'solid 1px #DDDDDD' });
            });
        });


        $(document).ready(function () {
            var page_url = window.location.href;
            var page_id = page_url.substring(page_url.lastIndexOf("#") + 1);

            if (page_id == 'section1') {
                $('html, body').animate({
                    scrollTop: $('#scroll-' + page_id).offset().top
                }, 500);
            } else if (page_id == 'section22') {
                $('html, body').animate({
                    scrollTop: $('#scroll-' + page_id).offset().top
                }, 500);
                //scrollTop: $('#scroll-' + page_id).offset.top - height() / 2}, 500);
            }
        });


        $('.btn1').click(function () {
            $(".slider").css({ 'transform': 'translateX(0px)' });
        });
        $('.btn2').click(function () {
            $(".slider").css({ 'transform': 'translateX(-100%)' });
        });

        $("ul").on("click", ".init", function () {
            $(this).closest("ul").children('li:not(.init)').toggle();
        });


        $(document).mouseup(function (e) {
            var LayerPopup = $(".layer-popup");
            if (LayerPopup.has(e.target).length === 0) {
                LayerPopup.removeClass("show");
            }
        });

        document.addEventListener('DOMContentLoaded', () => {
            var interval = window.setInterval(rollingCallback, 3000);
        })
        function rollingCallback() {
            //.prev 클래스 삭제
            document.querySelector('.rollingbanner .prev').classList.remove('prev');

            //.current -> .prev
            let current = document.querySelector('.rollingbanner .current');
            current.classList.remove('current');
            current.classList.add('prev');

            //.next -> .current
            let next = document.querySelector('.rollingbanner .next');
            //다음 목록 요소가 널인지 체크
            if (next.nextElementSibling == null) {
                document.querySelector('.rollingbanner ul li:first-child').classList.add('next');
            } else {
                //목록 처음 요소를 다음 요소로 선택
                next.nextElementSibling.classList.add('next');
            }
            next.classList.remove('next');
            next.classList.add('current');
        }

    }

    statusChange(statusItem) {
        var strText = $(statusItem).text("나옴?");

        // strText 에 전체 문자열이 입력된다.
        $(".tt").val(strText);
    }


    onChangeTemp = (e) => {
        console.log("temp log");
    }

    displayHomeUI = () => {
        let displayHomeUI = [];
        let widthSize = window.outerWidth;

        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
        };

        if (widthSize < 768) {
            displayHomeUI.push(
                <>
                    <div className={home.contentBox}>
                        <div className={home.overlay}></div>
                        <div className={home.homeArea}>
                            <div /* className={home.homeVideo} */>
                                <div class="slider_container">
                                    <div class="slider">
                                        <div /* className={home.imgBg} */>
                                            <span className={home.slideTitle} data-aos="fade-down" data-aos-duration="1000">Unique  &  Experience</span>
                                            <div className={home.slideTitle2}>
                                                <p>Disaster risk exists even</p>
                                                <p>in the smart spaces we live in today.</p>
                                                <p>You need the help of an experienced professional</p>
                                                <p>to create a safe and convenient space and</p>
                                                <p>to increase the unique value of the space.</p>
                                            </div>
                                            <video autoPlay loop muted playsInline
                                                className={home.videoArea}
                                                resizeMode={'cover'}>
                                                <source src={videoSrc} type="video/mp4" />
                                            </video>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={home.uTechnologyS}>
                                <span className={home.skillSubTitle}>We have the core technology to create and<br></br>
                                    manage safe and convenient spaces.
                                </span>
                                {/* <span className={home.skillSubTitle}>{Resource.ID.homeSkill.skillSubTitle2}</span> */}
                                <div className={home.skillBox}>
                                    <div className={home.skill1}>
                                        <div className={home.iconAreaS1}>
                                            <span></span>
                                        </div>
                                        <div className={home.skillTextBox1}>
                                            <span className={home.skillTextTitleE}>Spatial Information Construction</span>
                                            <div className={home.skillContBox}>
                                                <span>
                                                    Build lightweight and high-quality
                                                    indoor/outdoor space information
                                                    that supports the characteristics
                                                    of various facilities and service scalability.
                                                </span>
                                            </div>
                                        </div>
                                        <div className={home.moreView1Area}>
                                            <span className={home.moreViewS1}><a href="performanceSection#sectionInforBuild">More View</a></span>
                                        </div>
                                    </div>
                                    <div className={home.skill2}>
                                        <div className={home.iconAreaS2}>
                                            <span></span>
                                        </div>
                                        <div className={home.skillTextBox2}>
                                            <span className={home.skillTextTitle2E}>E-SOP</span>
                                            <div className={home.skillContBox2}>
                                                <span>
                                                    Support rapid spread of disaster/
                                                    crisis situations and decision-
                                                    making by converting the
                                                    document-based standard operation
                                                    procedure to digital form and combining it with the IT system.
                                                </span>
                                            </div>
                                        </div>
                                        <span className={home.moreViewS2}><a href="performanceSection#sectionESOP">More View</a></span>
                                    </div>
                                </div>
                                <div className={home.skillBox2}>
                                    <div className={home.skill3}>
                                        <div className={home.iconAreaS3}>
                                            <span></span>
                                        </div>
                                        <div className={home.skillTextBox3}>
                                            <span className={home.skillTextTitle3E}>Data Visualization</span>
                                            <div className={home.skillContBox3}>
                                                <span>
                                                    Combine 2D and 3D spatial
                                                    information with various types of
                                                    IoT and sensor information and
                                                    visualizes data so that users can
                                                    intuitively understand it.
                                                </span>
                                            </div>
                                        </div>
                                        <span className={home.moreViewS3}><a href="performanceSection#sectionData">More View</a></span>
                                    </div>
                                    <div className={home.skill4}>
                                        <div className={home.iconAreaS4}>
                                            <span></span>
                                        </div>
                                        <div className={home.skillTextBox4}>
                                            <span className={home.skillTextTitle4E}>System Integration</span>
                                            <div className={home.skillContBox4}>
                                                <span>
                                                    Perform web service development,
                                                    platform construction, and cloud
                                                    conversion by linking and
                                                    integrating legacy systems and
                                                    sensors operating in multiple protocols from the public to the private fields.
                                                </span>
                                            </div>
                                        </div>
                                        <span className={home.moreViewS4}><a href="performanceSection#sectionSystem">More View</a></span>
                                    </div>
                                </div>
                            </div>
                            <div className={home.uBusiness}>
                                <span className={home.introBSubTitle}>
                                    <span>We have specialized and focused on safety management solutions,
                                    consulting, and digital twin application
                                    solutions since our foundation.</span>
                                </span>
                                <div className={home.introBBox}>
                                    <div className={home.introBFlex}>
                                        <span className={home.introBBoxArea1}>
                                            <span className={home.introBIcon}></span>
                                            <span className={home.introBTextBox}>
                                                <span className={home.introBBoxText1E}>Safety Management Business</span>
                                            </span>
                                            <span className={home.introBContsBox}>
                                                <span className={home.introBBoxText3}>
                                                    Provide customized solutions and consulting for
                                                    various types of disasters with our disaster
                                                    safety technology and management
                                                    capabilities accumulated over many years.
                                                </span>
                                            </span>
                                            <span className={home.moreView6}><a href="businessSection#sectionSafety">More View</a></span>
                                        </span>

                                        <span className={home.introBBoxArea2}>
                                            <span className={home.introBIcon2}></span>
                                            <span className={home.introBTextBox2}>
                                                <span className={home.introBBoxText7E}>Digital Twin Solutions Business</span>
                                            </span>
                                            <span className={home.introBContsBox2}>
                                                <span className={home.introBBoxText9}>Provide customers with 3D-based digital twin</span>
                                                <span className={home.introBBoxText10}>solutions with a high understanding of indoor</span>
                                                <span className={home.introBBoxText11}>and outdoor space and integrated IoT sensor</span>
                                                <span className={home.introBBoxText12}>monitoring technology.</span>
                                            </span>
                                            <span className={home.moreView7}><a href="businessSection#sectionDigital">More View</a></span>
                                        </span>
                                    </div>
                                    <div className={home.introBFlex2}>
                                        <span className={home.introBBoxArea3}>
                                            <span className={home.introBIcon3}></span>
                                            <span className={home.introBTextBox3}>
                                                <span className={home.introBBoxText13E}>Achivements and Customers</span>
                                            </span>
                                            <span className={home.introBContsBox3}>
                                                <span className={home.introBBoxText15}>With more than 10 years of business experience,</span>
                                                <span className={home.introBBoxText16}>many customers in the public and </span>
                                                <span className={home.introBBoxText17}>private sectors are using our solutions.</span>
                                                <span className={home.introBBoxText18}></span>
                                            </span>
                                            <span className={home.moreView8}><a href="businessSection#sectionPerformance">More View</a></span>
                                        </span>
                                        <span className={home.introBBoxArea4}>
                                            <span className={home.introBIcon3}></span>
                                            <span className={home.introBTextBox3}>
                                                <span className={home.introBBoxText13}></span>
                                            </span>
                                            <span className={home.introBContsBox3}>
                                                <span className={home.introBBoxText15}></span>
                                                <span className={home.introBBoxText16}></span>
                                                <span className={home.introBBoxText17}></span>
                                                <span className={home.introBBoxText18}></span>
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={home.contactMainBoxM}>
                                <div className={home.InquiryAreaM}>
                                    <span className={home.contactSideTitleE}>
                                        <span>Are you curious about our technology and business?</span>
                                        <span>Please feel free to contact: </span>
                                    </span>
                                    <div className={home.conFirstBoxM}>
                                        <span className={home.conKindNameM}>Inquiry type</span>
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
                                    <div className={home.conSecondBoxM}>
                                        <div className={home.conLeftBoxM}>
                                            <span className={home.conLeftTBox}>
                                                <span className={home.companyNameM}>Company name</span>
                                                <span className={home.companyNameSelect}>* Optional</span>
                                            </span>
                                            <input type="text" className={home.contactCompanyBoxM} placeholder="Enter company name" ref={this.refCompany} /* onClick={this.chkValue} */ required />
                                        </div>
                                        <div className={home.conMiddleBoxM}>
                                            <span className={home.conPeopleNameM}>Name</span>
                                            <input type="text" id="tt" className={home.contactNameBoxM} placeholder="Please enter your name" ref={this.refName} onClick={this.statusChange} />
                                        </div>
                                        <div className={home.conRightBoxM}>
                                            <span className={home.contactEmailM}>E-mail</span>
                                            <input type="text" ref={this.refEmail} className={home.contactEmailBoxM} placeholder="Please enter your email" />
                                        </div>
                                    </div>
                                    <div className={home.conThirdBoxM}>
                                        <span className={home.InquiryContentsM}>Content</span>
                                        <textarea ref={this.refMemo} className={home.contactTextBoxMemoM} type="text" placeholder="Please enter your inquiry"></textarea>
                                    </div>
                                    <div className={home.conFourthBoxM}>
                                        <div className={home.conInputArea}>
                                            {/* <label><input ref={this.refCheckbox} class="checkTest" type="checkbox" name="color" value="red" onClick={this.checkTest} id="aaa" /><p class="inputText">개인정보 취급 방침에 동의합니다.</p></label> */}
                                            <input type="checkbox" ref={this.refCheckbox} class="checkTest" id="check1" name="color" value="red" onClick={this.checkTest} /><label htmlFor={"check1"}></label><p class="inputTextM">I agree with the personal information handling policy.</p>
                                        </div>
                                        <span className={home.personalInforM} id="popupDom" onClick={() => this.openPopup3()}>View policy</span>
                                        {
                                            this.state.isOpenPopup3 &&
                                            <PopupDom>
                                                <PersonalInforPop onClose={this.closePopup} />
                                            </PopupDom>
                                        }
                                    </div>
                                    <span>
                                        <button type="button"
                                            id="popupDom"
                                            className={home.contactSendM}
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
                    </div> {/* contentBox */}
                </>
            );
        } else if (640 <= widthSize && widthSize <= 959) {  /* 가로 모바일 */
            displayHomeUI.push(
                <>
                    <div className={home.contentBox}>
                        <div className={home.overlay}></div>
                        <div className={home.homeArea}>
                            <div /* className={home.homeVideo} */>
                                <div class="slider_container">
                                    <div class="slider">
                                        <div /* className={home.imgBg} */>
                                            <span className={home.slideTitle} data-aos="fade-down" data-aos-duration="1000">Unique  &  Experience</span>
                                            <div className={home.slideTitle2}>
                                                <p>Disaster risk exists even</p>
                                                <p>in the smart spaces we live in today.</p>
                                                <p>You need the help of an experienced professional</p>
                                                <p>to create a safe and convenient space and</p>
                                                <p>to increase the unique value of the space.</p>
                                            </div>
                                            <video autoPlay loop muted playsInline
                                                className={home.videoArea}
                                                resizeMode={'cover'}>
                                                <source src={videoSrc} type="video/mp4" />
                                            </video>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={home.uTechnologyS}>
                                <span className={home.skillSubTitle}>We have the core technology to create and<br></br>
                                    manage safe and convenient spaces.
                                </span>
                                {/* <span className={home.skillSubTitle}>{Resource.ID.homeSkill.skillSubTitle2}</span> */}
                                <div className={home.skillBox}>
                                    <div className={home.skill1}>
                                        <div className={home.iconAreaS1}>
                                            <span></span>
                                        </div>
                                        <div className={home.skillTextBox1}>
                                            <span className={home.skillTextTitleE}>Spatial Information Construction</span>
                                            <div className={home.skillContBox}>
                                                <span>
                                                    Build lightweight and high-quality
                                                    indoor/outdoor space information
                                                    that supports the characteristics
                                                    of various facilities and service scalability.
                                                </span>
                                            </div>
                                        </div>
                                        <div className={home.moreView1Area}>
                                            <span className={home.moreViewS1}>
                                                <a href="performanceSection#sectionInforBuild">More View</a>
                                            </span>
                                        </div>
                                    </div>
                                    <div className={home.skill2}>
                                        <div className={home.iconAreaS2}>
                                            <span></span>
                                        </div>
                                        <div className={home.skillTextBox2}>
                                            <span className={home.skillTextTitle2E}>E-SOP</span>
                                            <div className={home.skillContBox2}>
                                                <span>
                                                    Support rapid spread of disaster/
                                                    crisis situations and decision-
                                                    making by converting the
                                                    document-based standard operation
                                                    procedure to digital form and combining it with the IT system.
                                                </span>
                                            </div>
                                        </div>
                                        <span className={home.moreViewS2}><a href="performanceSection#sectionESOP">More View</a></span>
                                    </div>
                                </div>
                                <div className={home.skillBox2}>
                                    <div className={home.skill3}>
                                        <div className={home.iconAreaS3}>
                                            <span></span>
                                        </div>
                                        <div className={home.skillTextBox3}>
                                            <span className={home.skillTextTitle3E}>Data Visualization</span>
                                            <div className={home.skillContBox3}>
                                                <span>
                                                    Combine 2D and 3D spatial
                                                    information with various types of
                                                    IoT and sensor information and
                                                    visualizes data so that users can
                                                    intuitively understand it.
                                                </span>
                                            </div>
                                        </div>
                                        <span className={home.moreViewS3}><a href="performanceSection#sectionData">More View</a></span>
                                    </div>
                                    <div className={home.skill4}>
                                        <div className={home.iconAreaS4}>
                                            <span></span>
                                        </div>
                                        <div className={home.skillTextBox4}>
                                            <span className={home.skillTextTitle4E}>System Integration</span>
                                            <div className={home.skillContBox4}>
                                                <span>
                                                    Perform web service development,
                                                    platform construction, and cloud
                                                    conversion by linking and
                                                    integrating legacy systems and
                                                    sensors operating in multiple protocols from the public to the private fields.
                                                </span>
                                            </div>
                                        </div>
                                        <span className={home.moreViewS4}><a href="performanceSection#sectionSystem">More View</a></span>
                                    </div>
                                </div>
                            </div>
                            <div className={home.uBusiness}>
                                <span className={home.introBSubTitle}>
                                    <span>We have specialized and focused on safety management solutions,
                                        consulting, and digital twin application
                                        solutions since our foundation.</span>
                                </span>
                                <div className={home.introBBox}>
                                    <div className={home.introBFlex}>
                                        <span className={home.introBBoxArea1}>
                                            <span className={home.introBIcon}></span>
                                            <span className={home.introBTextBox}>
                                                <span className={home.introBBoxText1E}>Safety Management Business</span>
                                            </span>
                                            <span className={home.introBContsBox}>
                                                <span className={home.introBBoxText3}>
                                                    Provide customized solutions and consulting for
                                                    various types of disasters with our disaster
                                                    safety technology and management
                                                    capabilities accumulated over many years.
                                                </span>
                                            </span>
                                            <span className={home.moreView6}><a href="businessSection#sectionSafety">More View</a></span>
                                        </span>

                                        <span className={home.introBBoxArea2}>
                                            <span className={home.introBIcon2}></span>
                                            <span className={home.introBTextBox2}>
                                                <span className={home.introBBoxText7E}>Digital Twin Solutions Business</span>
                                            </span>
                                            <span className={home.introBContsBox2}>
                                                <span className={home.introBBoxText9}>Provide customers with 3D-based digital twin</span>
                                                <span className={home.introBBoxText10}>solutions with a high understanding of indoor</span>
                                                <span className={home.introBBoxText11}>and outdoor space and integrated IoT sensor</span>
                                                <span className={home.introBBoxText12}>monitoring technology.</span>
                                            </span>
                                            <span className={home.moreView7}><a href="businessSection#sectionDigital">More View</a></span>
                                        </span>
                                    </div>
                                    <div className={home.introBFlex2}>
                                        <span className={home.introBBoxArea3}>
                                            <span className={home.introBIcon3}></span>
                                            <span className={home.introBTextBox3}>
                                                <span className={home.introBBoxText13E}>Achivements and Customers</span>
                                            </span>
                                            <span className={home.introBContsBox3}>
                                                <span className={home.introBBoxText15}>With more than 10 years of business experience,</span>
                                                <span className={home.introBBoxText16}>many customers in the public and </span>
                                                <span className={home.introBBoxText17}>private sectors are using our solutions.</span>
                                                <span className={home.introBBoxText18}></span>
                                            </span>
                                            <span className={home.moreView8}><a href="businessSection#sectionPerformance">More View</a></span>
                                        </span>
                                        <span className={home.introBBoxArea4}></span>
                                    </div>
                                </div>
                            </div>
                            <div className={home.contactMainBoxM}>
                                <div className={home.InquiryAreaM}>
                                    <span className={home.contactSideTitleE}>
                                        <span>Are you curious about our technology and business?</span>
                                        <span>Please feel free to contact: </span>
                                    </span>
                                    <div className={home.conFirstBoxM}>
                                        <span className={home.conKindNameM}>Inquiry type</span>
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
                                    <div className={home.conSecondBoxM}>
                                        <div className={home.conLeftBoxM}>
                                            <span className={home.conLeftTBox}>
                                                <span className={home.companyNameM}>Company name</span>
                                                <span className={home.companyNameSelect}>* Optional</span>
                                            </span>
                                            <input type="text" className={home.contactCompanyBoxM} placeholder="Enter company name" ref={this.refCompany} /* onClick={this.chkValue} */ required />
                                        </div>
                                        <div className={home.conMiddleBoxM}>
                                            <span className={home.conPeopleNameM}>Name</span>
                                            <input type="text" id="tt" className={home.contactNameBoxM} placeholder="Please enter your name" ref={this.refName} onClick={this.statusChange} />
                                        </div>
                                        <div className={home.conRightBoxM}>
                                            <span className={home.contactEmailM}>E-mail</span>
                                            <input type="text" ref={this.refEmail} className={home.contactEmailBoxM} placeholder="Please enter your email" />
                                        </div>
                                    </div>
                                    <div className={home.conThirdBoxM}>
                                        <span className={home.InquiryContentsM}>Content</span>
                                        <textarea ref={this.refMemo} className={home.contactTextBoxMemoM} type="text" placeholder="Please enter your inquiry"></textarea>
                                    </div>
                                    <div className={home.conFourthBoxM}>
                                        <div className={home.conInputArea}>
                                            {/* <label><input ref={this.refCheckbox} class="checkTest" type="checkbox" name="color" value="red" onClick={this.checkTest} id="aaa" /><p class="inputText">개인정보 취급 방침에 동의합니다.</p></label> */}
                                            <input type="checkbox" ref={this.refCheckbox} class="checkTest" id="check1" name="color" value="red" onClick={this.checkTest} /><label htmlFor={"check1"}></label><p class="inputTextM">I agree with the personal information handling policy.</p>
                                        </div>
                                        <span className={home.personalInforM} id="popupDom" onClick={() => this.openPopup3()}>View policy</span>
                                        {
                                            this.state.isOpenPopup3 &&
                                            <PopupDom>
                                                <PersonalInforPop onClose={this.closePopup} />
                                            </PopupDom>
                                        }
                                    </div>
                                    <span>
                                        <button type="button"
                                            id="popupDom"
                                            className={home.contactSendM}
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
                    </div> {/* contentBox */}
                </>
            );
        } else if (768 <= widthSize && widthSize <= 1023) { //태블릿
            displayHomeUI.push(
                <>
                    <div className={home.contentBox}>
                        <div className={home.overlay}></div>
                        <div className={home.homeArea}>
                            <FullPage>
                                <Slide id={home.section1}>
                                    <div class="slider_container">
                                        <div class="slider">
                                            <div /* className={home.imgBg} */>
                                                <span className={home.slideTitle} data-aos="fade-down" data-aos-duration="1000">Unique & Experience</span>

                                                <div class="rollingbanner ">
                                                    <div class="wrap">
                                                        <ul>
                                                            <li class="current">
                                                                <a href="#">Disaster risk exists even in the smart spaces we live in today.</a>
                                                                <a href="#">You need the help of an experienced professional to create a safe and convenient space and to increase the unique value of the space.</a>
                                                            </li>
                                                            <li class="next">
                                                                <a href="#">We, U&E is a disaster safety specialized company that creates new value of space with digital twin based technologies.</a>
                                                                <a href="#"></a>
                                                            </li>
                                                            <li class="#">
                                                                <a href="#">Disaster risk exists even in the smart spaces we live in today.</a>
                                                                <a href="#">You need the help of an experienced professional to create a safe and convenient space and to increase the unique value of the space.</a>
                                                            </li>
                                                            <li class="prev">
                                                                <a href="#">We, U&E is a disaster safety specialized company that creates new value of space with digital twin based technologies.</a>
                                                                <a href="#"></a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <video autoPlay loop muted playsInline
                                                    className={home.videoArea}
                                                    resizeMode={'cover'}>
                                                    <source src={videoSrc} type="video/mp4" />
                                                </video>
                                            </div>
                                        </div>
                                    </div>
                                </Slide>
                                <Slide id={home.section2}>
                                    <div className={home.uTechnologyS}>
                                        <span className={home.skillSubTitle}>We have the core technology to create and manage safe and convenient spaces.<br></br>
                                            {/* {Resource.ID.homeSkill.skillSubTitle2} */}
                                        </span>
                                        <div className={home.skillBox}>
                                            <div className={home.skill1}>
                                                <div className={home.iconAreaS1}>
                                                    <span></span>
                                                </div>
                                                <div className={home.skillTextBox1}>
                                                    <span className={home.skillTextTitle}>Spatial Information Construction</span>
                                                    <div className={home.skillContBox}>
                                                        <span>
                                                            Build lightweight and high-quality
                                                            indoor/outdoor space information
                                                            that supports the characteristics
                                                            of various facilities and service scalability.
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className={home.moreView1Area}>
                                                    <span className={home.moreViewS1}>
                                                        <a href="performanceSection#sectionInforBuild">More View</a>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={home.skill2}>
                                                <div className={home.iconAreaS2}>
                                                    <span></span>
                                                </div>
                                                <div className={home.skillTextBox2}>
                                                    <span className={home.skillTextTitle2}>E-SOP</span>
                                                    <div className={home.skillContBox2}>
                                                        <span>
                                                            Support rapid spread of disaster/
                                                            crisis situations and decision-
                                                            making by converting the
                                                            document-based standard operation
                                                            procedure to digital form and combining it with the IT system.
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={home.moreViewS2}><a href="performanceSection#sectionESOP">More View</a></span>
                                            </div>
                                            <div className={home.skill3}>
                                                <div className={home.iconAreaS3}>
                                                    <span></span>
                                                </div>
                                                <div className={home.skillTextBox3}>
                                                    <span className={home.skillTextTitle3}>Data Visualization</span>
                                                    <div className={home.skillContBox3}>
                                                        <span>
                                                            Combine 2D and 3D spatial
                                                            information with various types of
                                                            IoT and sensor information and
                                                            visualizes data so that users can
                                                            intuitively understand it.
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={home.moreViewS3}><a href="performanceSection#sectionData">More View</a></span>
                                            </div>
                                            <div className={home.skill4}>
                                                <div className={home.iconAreaS4}>
                                                    <span></span>
                                                </div>
                                                <div className={home.skillTextBox4}>
                                                    <span className={home.skillTextTitle4}>System Integration</span>
                                                    <div className={home.skillContBox4}>
                                                        <span>
                                                            Perform web service development,
                                                            platform construction, and cloud
                                                            conversion by linking and
                                                            integrating legacy systems and
                                                            sensors operating in multiple protocols from the public to the private fields.
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={home.moreViewS4}><a href="performanceSection#sectionSystem">More View</a></span>
                                            </div>
                                        </div>
                                    </div>
                                </Slide>
                                <Slide id={home.section3}>
                                    <div className={home.uBusiness}>
                                        <span className={home.introBSubTitle}>
                                            <span>We have specialized and focused on safety management solutions,</span>
                                            <span>consulting, and digital twin application solutions since our foundation.</span>
                                        </span>
                                        <div className={home.introBBox}>
                                            <div className={home.introBFlex}>
                                                <span className={home.introBBoxArea1}>
                                                    <span className={home.introBIcon}></span>
                                                    <span className={home.introBTextBox}>
                                                        <span className={home.introBBoxText1}>Safety Management</span>
                                                        <span className={home.introBBoxText2}>Business</span>
                                                    </span>
                                                    <span className={home.introBContsBox}>
                                                        <span className={home.introBBoxText3}>Provide customized solutions and consulting for</span>
                                                        <span className={home.introBBoxText4}>various types of disasters with our disaster</span>
                                                        <span className={home.introBBoxText5}>safety technology and management</span>
                                                        <span className={home.introBBoxText6}>capabilities accumulated over many years.</span>
                                                    </span>
                                                    <span className={home.moreView6}><a href="businessSection#sectionSafety">More View</a></span>
                                                </span>

                                                <span className={home.introBBoxArea2}>
                                                    <span className={home.introBIcon2}></span>
                                                    <span className={home.introBTextBox2}>
                                                        <span className={home.introBBoxText7}>Digital Twin Solutions</span>
                                                        <span className={home.introBBoxText8}>Business</span>
                                                    </span>
                                                    <span className={home.introBContsBox2}>
                                                        <span className={home.introBBoxText9}>Provide customers with 3D-based digital twin</span>
                                                        <span className={home.introBBoxText10}>solutions with a high understanding of indoor</span>
                                                        <span className={home.introBBoxText11}>and outdoor space and integrated IoT sensor</span>
                                                        <span className={home.introBBoxText12}>monitoring technology.</span>
                                                    </span>
                                                    <span className={home.moreView7}><a href="businessSection#sectionDigital">More View</a></span>
                                                </span>

                                                <span className={home.introBBoxArea3}>
                                                    <span className={home.introBIcon3}></span>
                                                    <span className={home.introBTextBox3}>
                                                        <span className={home.introBBoxText13}>Achivements and</span>
                                                        <span className={home.introBBoxText14}>Customers</span>
                                                    </span>
                                                    <span className={home.introBContsBox3}>
                                                        <span className={home.introBBoxText15}>With more than 10 years of business experience,</span>
                                                        <span className={home.introBBoxText16}>many customers in the public and </span>
                                                        <span className={home.introBBoxText17}>private sectors are using our solutions.</span>
                                                        <span className={home.introBBoxText18}></span>
                                                    </span>
                                                    <span className={home.moreView8}><a href="businessSection#sectionPerformance">More View</a></span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Slide>
                                <Slide id={home.section4}>
                                    <div className={home.contactMainBoxM}>
                                        <div className={home.InquiryAreaM}>
                                            <span className={home.contactSideTitle}>Are you curious about our technology and business? Please feel free to contact:</span>
                                            <div className={home.conFirstBoxM}>
                                                <span className={home.conKindNameM}>Inquiry type</span>
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
                                            <div className={home.conSecondBoxM}>
                                                <div className={home.conLeftBoxM}>
                                                    <span className={home.conLeftTBox}>
                                                        <span className={home.companyNameM}>Company name</span>
                                                        <span className={home.companyNameSelect}>* Optional</span>
                                                    </span>
                                                    <input type="text" className={home.contactCompanyBoxM} placeholder="Enter company name" ref={this.refCompany} /* onClick={this.chkValue} */ required />
                                                </div>
                                                <div className={home.conMiddleBoxM}>
                                                    <span className={home.conPeopleNameM}>Name</span>
                                                    <input type="text" id="tt" className={home.contactNameBoxM} placeholder="Please enter your name" ref={this.refName} onClick={this.statusChange} />
                                                </div>
                                                <div className={home.conRightBoxM}>
                                                    <span className={home.contactEmailM}>E-mail</span>
                                                    <input type="text" ref={this.refEmail} className={home.contactEmailBoxM} placeholder="Please enter your email" />
                                                </div>
                                            </div>
                                            <div className={home.conThirdBoxM}>
                                                <span className={home.InquiryContentsM}>Content</span>
                                                <textarea ref={this.refMemo} className={home.contactTextBoxMemoM} type="text" placeholder="Please enter your inquiry"></textarea>
                                            </div>
                                            <div className={home.conFourthBoxM}>
                                                <div className={home.conInputArea}>
                                                    {/* <label><input ref={this.refCheckbox} class="checkTest" type="checkbox" name="color" value="red" onClick={this.checkTest} id="aaa" /><p class="inputText">개인정보 취급 방침에 동의합니다.</p></label> */}
                                                    <input type="checkbox" ref={this.refCheckbox} class="checkTest" id="check1" name="color" value="red" onClick={this.checkTest} /><label htmlFor={"check1"}></label><p class="inputTextM">I agree with the personal information handling policy.</p>
                                                    <span className={home.personalInforM} id="popupDom" onClick={() => this.openPopup3()}>View policy</span>
                                                    {
                                                        this.state.isOpenPopup3 &&
                                                        <PopupDom>
                                                            <PersonalInforPop onClose={this.closePopup} />
                                                        </PopupDom>
                                                    }
                                                </div>
                                            </div>
                                            <span>
                                                <button type="button"
                                                    id="popupDom"
                                                    className={home.contactSendM}
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
                                </Slide>
                                <Slide id={home.section5}>
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
                                </Slide>
                            </FullPage>
                        </div>
                    </div> {/* contentBox */}
                </>
            );
        } else if (960 <= widthSize && widthSize <= 1280) { //가로 태블릿
            displayHomeUI.push(
                <>
                    <div className={home.contentBox}>
                        <div className={home.overlay}></div>
                        <div className={home.homeArea}>
                            <FullPage>
                                <Slide id={home.section1}>
                                    <div class="slider_container">
                                        <div class="slider">
                                            <div /* className={home.imgBg} */>
                                                <span className={home.slideTitle} data-aos="fade-down" data-aos-duration="1000">Unique & Experience</span>

                                                <div class="rollingbanner ">
                                                    <div class="wrap">
                                                        <ul>
                                                            <li class="current">
                                                                <a href="#">Disaster risk exists even in the smart spaces we live in today.</a>
                                                                <a href="#">You need the help of an experienced professional to create a safe and convenient space and to increase the unique value of the space.</a>
                                                            </li>
                                                            <li class="next">
                                                                <a href="#">We, U&E is a disaster safety specialized company that creates new value of space with digital twin based technologies.</a>
                                                                <a href="#"></a>
                                                            </li>
                                                            <li class="#">
                                                                <a href="#">Disaster risk exists even in the smart spaces we live in today.</a>
                                                                <a href="#">You need the help of an experienced professional to create a safe and convenient space and to increase the unique value of the space.</a>
                                                            </li>
                                                            <li class="prev">
                                                                <a href="#">We, U&E is a disaster safety specialized company that creates new value of space with digital twin based technologies.</a>
                                                                <a href="#"></a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <video autoPlay loop muted playsInline
                                                    className={home.videoArea}
                                                    resizeMode={'cover'}>
                                                    <source src={videoSrc} type="video/mp4" />
                                                </video>
                                            </div>
                                        </div>
                                    </div>
                                </Slide>
                                <Slide id={home.section2}>
                                    <div className={home.uTechnologyS}>
                                        <span className={home.skillSubTitle}>We have the core technology to create and manage safe and convenient spaces.<br></br>
                                            {/* {Resource.ID.homeSkill.skillSubTitle2} */}
                                        </span>
                                        <div className={home.skillBox}>
                                            <div className={home.skill1}>
                                                <div className={home.iconAreaS1}>
                                                    <span></span>
                                                </div>
                                                <div className={home.skillTextBox1}>
                                                    <span className={home.skillTextTitle}>Spatial Information Construction</span>
                                                    <div className={home.skillContBox}>
                                                        <span>
                                                           Build lightweight and high-quality
                                                           indoor/outdoor space information
                                                           that supports the characteristics
                                                           of various facilities and service scalability.
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className={home.moreView1Area}>
                                                    <span className={home.moreViewS1}>
                                                        <a href="performanceSection#sectionInforBuild">More View</a>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={home.skill2}>
                                                <div className={home.iconAreaS2}>
                                                    <span></span>
                                                </div>
                                                <div className={home.skillTextBox2}>
                                                    <span className={home.skillTextTitle2}>E-SOP</span>
                                                    <div className={home.skillContBox2}>
                                                        <span>
                                                            Support rapid spread of disaster/
                                                            crisis situations and decision-
                                                            making by converting the
                                                            document-based standard operation
                                                            procedure to digital form and combining it with the IT system.
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={home.moreViewS2}><a href="performanceSection#sectionESOP">More View</a></span>
                                            </div>
                                            <div className={home.skill3}>
                                                <div className={home.iconAreaS3}>
                                                    <span></span>
                                                </div>
                                                <div className={home.skillTextBox3}>
                                                    <span className={home.skillTextTitle3}>Data Visualization</span>
                                                    <div className={home.skillContBox3}>
                                                        <span>
                                                            Combine 2D and 3D spatial
                                                            information with various types of
                                                            IoT and sensor information and
                                                            visualizes data so that users can
                                                            intuitively understand it.
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={home.moreViewS3}><a href="performanceSection#sectionData">More View</a></span>
                                            </div>
                                            <div className={home.skill4}>
                                                <div className={home.iconAreaS4}>
                                                    <span></span>
                                                </div>
                                                <div className={home.skillTextBox4}>
                                                    <span className={home.skillTextTitle4}>System Integration</span>
                                                    <div className={home.skillContBox4}>
                                                        <span>
                                                            Perform web service development,
                                                            platform construction, and cloud
                                                            conversion by linking and
                                                            integrating legacy systems and
                                                            sensors operating in multiple protocols from the public to the private fields.
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={home.moreViewS4}><a href="performanceSection#sectionSystem">More View</a></span>
                                            </div>
                                        </div>
                                    </div>
                                </Slide>
                                <Slide id={home.section3}>
                                    <div className={home.uBusiness}>
                                        <span className={home.introBSubTitle}>
                                            <span>We have specialized and focused on safety management solutions,</span>
                                            <span>consulting, and digital twin application solutions since our foundation.</span>
                                        </span>
                                        <div className={home.introBBox}>
                                            <div className={home.introBFlex}>
                                                <span className={home.introBBoxArea1}>
                                                    <span className={home.introBIcon}></span>
                                                    <span className={home.introBTextBox}>
                                                        <span className={home.introBBoxText1}>Safety Management</span>
                                                        <span className={home.introBBoxText2}>Business</span>
                                                    </span>
                                                    <span className={home.introBContsBox}>
                                                        <span className={home.introBBoxText3}>Provide customized solutions and consulting for</span>
                                                        <span className={home.introBBoxText4}>various types of disasters with our disaster</span>
                                                        <span className={home.introBBoxText5}>safety technology and management</span>
                                                        <span className={home.introBBoxText6}>capabilities accumulated over many years.</span>
                                                    </span>
                                                    <span className={home.moreView6}><a href="businessSection#sectionSafety">More View</a></span>
                                                </span>

                                                <span className={home.introBBoxArea2}>
                                                    <span className={home.introBIcon2}></span>
                                                    <span className={home.introBTextBox2}>
                                                        <span className={home.introBBoxText7}>Digital Twin Solutions</span>
                                                        <span className={home.introBBoxText8}>Business</span>
                                                    </span>
                                                    <span className={home.introBContsBox2}>
                                                        <span className={home.introBBoxText9}>Provide customers with 3D-based digital twin</span>
                                                        <span className={home.introBBoxText10}>solutions with a high understanding of indoor</span>
                                                        <span className={home.introBBoxText11}>and outdoor space and integrated IoT sensor</span>
                                                        <span className={home.introBBoxText12}>monitoring technology.</span>
                                                    </span>
                                                    <span className={home.moreView7}><a href="businessSection#sectionDigital">More View</a></span>
                                                </span>

                                                <span className={home.introBBoxArea3}>
                                                    <span className={home.introBIcon3}></span>
                                                    <span className={home.introBTextBox3}>
                                                        <span className={home.introBBoxText13}>Achivements and</span>
                                                        <span className={home.introBBoxText14}>Customers</span>
                                                    </span>
                                                    <span className={home.introBContsBox3}>
                                                        <span className={home.introBBoxText15}>With more than 10 years of business experience,</span>
                                                        <span className={home.introBBoxText16}>many customers in the public and </span>
                                                        <span className={home.introBBoxText17}>private sectors are using our solutions.</span>
                                                        <span className={home.introBBoxText18}></span>
                                                    </span>
                                                    <span className={home.moreView8}><a href="businessSection#sectionPerformance">More View</a></span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Slide>
                                <Slide id={home.section4}>
                                    <div className={home.contactMainBoxM}>
                                        <div className={home.InquiryAreaM}>
                                            <span className={home.contactSideTitle}>Are you curious about our technology and business? Please feel free to contact:</span>
                                            <div className={home.conFirstBoxM}>
                                                <span className={home.conKindNameM}>Inquiry type</span>
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
                                            <div className={home.conSecondBoxM}>
                                                <div className={home.conLeftBoxM}>
                                                    <span className={home.conLeftTBox}>
                                                        <span className={home.companyNameM}>Company name</span>
                                                        <span className={home.companyNameSelect}>* Optional</span>
                                                    </span>
                                                    <input type="text" className={home.contactCompanyBoxM} placeholder="Enter company name" ref={this.refCompany} /* onClick={this.chkValue} */ required />
                                                </div>
                                                <div className={home.conMiddleBoxM}>
                                                    <span className={home.conPeopleNameM}>Name</span>
                                                    <input type="text" id="tt" className={home.contactNameBoxM} placeholder="Please enter your name" ref={this.refName} onClick={this.statusChange} />
                                                </div>
                                                <div className={home.conRightBoxM}>
                                                    <span className={home.contactEmailM}>E-mail</span>
                                                    <input type="text" ref={this.refEmail} className={home.contactEmailBoxM} placeholder="Please enter your email" />
                                                </div>
                                            </div>
                                            <div className={home.conThirdBoxM}>
                                                <span className={home.InquiryContentsM}>Content</span>
                                                <textarea ref={this.refMemo} className={home.contactTextBoxMemoM} type="text" placeholder="Please enter your inquiry"></textarea>
                                            </div>
                                            <div className={home.conFourthBoxM}>
                                                <div className={home.conInputArea}>
                                                    {/* <label><input ref={this.refCheckbox} class="checkTest" type="checkbox" name="color" value="red" onClick={this.checkTest} id="aaa" /><p class="inputText">개인정보 취급 방침에 동의합니다.</p></label> */}
                                                    <input type="checkbox" ref={this.refCheckbox} class="checkTest" id="check1" name="color" value="red" onClick={this.checkTest} /><label htmlFor={"check1"}></label><p class="inputTextM">I agree with the personal information handling policy.</p>
                                                    <span className={home.personalInforM} id="popupDom" onClick={() => this.openPopup3()}>View policy</span>
                                                    {
                                                        this.state.isOpenPopup3 &&
                                                        <PopupDom>
                                                            <PersonalInforPop onClose={this.closePopup} />
                                                        </PopupDom>
                                                    }
                                                </div>
                                            </div>
                                            <span>
                                                <button type="button"
                                                    id="popupDom"
                                                    className={home.contactSendM}
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
                                </Slide>
                                <Slide id={home.section5}>
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
                                </Slide>
                            </FullPage>
                        </div>
                    </div> {/* contentBox */}
                </>
            );
        } else if (widthSize >= 1024) {
            displayHomeUI.push(
                <>
                    {/* 홈페이지 2차 Home.js */}
                    <div className={home.contentBox}>
                        <div className={home.overlay}></div>
                        <div className={home.homeArea}>
                            <FullPage>
                                <Slide id={home.section1}>
                                    <div class="slider_container">
                                        <div class="slider">
                                            <div /* className={home.imgBg} */>
                                                <span className={home.slideTitle} data-aos="fade-down" data-aos-duration="1000">Unique & Experience</span>

                                                <div class="rollingbanner ">
                                                    <div class="wrap">
                                                        <ul>
                                                            <li class="current">
                                                                <a href="#">Disaster risk exists even in the smart spaces we live in today.</a>
                                                                <a href="#">You need the help of an experienced professional to create a safe and convenient space and to increase the unique value of the space.</a>
                                                            </li>
                                                            <li class="next">
                                                                <a href="#">We, U&E is a disaster safety specialized company that creates new value of space with digital twin based technologies.</a>
                                                                <a href="#"></a>
                                                            </li>
                                                            <li class="#">
                                                                <a href="#">Disaster risk exists even in the smart spaces we live in today.</a>
                                                                <a href="#">You need the help of an experienced professional to create a safe and convenient space and to increase the unique value of the space.</a>
                                                            </li>
                                                            <li class="prev">
                                                                <a href="#">We, U&E is a disaster safety specialized company that creates new value of space with digital twin based technologies.</a>
                                                                <a href="#"></a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <video autoPlay loop muted playsInline
                                                    className={home.videoArea}
                                                    resizeMode={'cover'}>
                                                    <source src={videoSrc} type="video/mp4" />
                                                </video>
                                            </div>
                                        </div>
                                    </div>
                                </Slide>
                                <Slide id={home.section2}>
                                    <div className={home.uTechnologyS}>
                                        <span className={home.skillSubTitle}>We have the core technology to create and manage safe and convenient spaces.<br></br>
                                            {/* {Resource.ID.homeSkill.skillSubTitle2} */}
                                        </span>
                                        <div className={home.skillBox}>
                                            <div className={home.skill1}>
                                                <div className={home.iconAreaS1}>
                                                    <span></span>
                                                </div>
                                                <div className={home.skillTextBox1}>
                                                    <span className={home.skillTextTitle}>Spatial Information Construction</span>
                                                    <div className={home.skillContBox}>
                                                        <span>
                                                            Build lightweight and high-quality
                                                            indoor/outdoor space information
                                                            that supports the characteristics
                                                            of various facilities and service scalability.
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className={home.moreView1Area}>
                                                    <span className={home.moreViewS1}>
                                                        <a href="performanceSection#sectionInforBuild">More View</a>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={home.skill2}>
                                                <div className={home.iconAreaS2}>
                                                    <span></span>
                                                </div>
                                                <div className={home.skillTextBox2}>
                                                    <span className={home.skillTextTitle2}>E-SOP</span>
                                                    <div className={home.skillContBox2}>
                                                        <span>
                                                            Support rapid spread of disaster/
                                                            crisis situations and decision-
                                                            making by converting the
                                                            document-based standard operation
                                                            procedure to digital form and combining it with the IT system.
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={home.moreViewS2}><a href="performanceSection#sectionESOP">More View</a></span>
                                            </div>
                                            <div className={home.skill3}>
                                                <div className={home.iconAreaS3}>
                                                    <span></span>
                                                </div>
                                                <div className={home.skillTextBox3}>
                                                    <span className={home.skillTextTitle3}>Data Visualization</span>
                                                    <div className={home.skillContBox3}>
                                                        <span>
                                                            Combine 2D and 3D spatial
                                                            information with various types of
                                                            IoT and sensor information and
                                                            visualizes data so that users can
                                                            intuitively understand it.
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={home.moreViewS3}><a href="performanceSection#sectionData">More View</a></span>
                                            </div>
                                            <div className={home.skill4}>
                                                <div className={home.iconAreaS4}>
                                                    <span></span>
                                                </div>
                                                <div className={home.skillTextBox4}>
                                                    <span className={home.skillTextTitle4}>System Integration</span>
                                                    <div className={home.skillContBox4}>
                                                        <span>
                                                            Perform web service development,
                                                            platform construction, and cloud
                                                            conversion by linking and
                                                            integrating legacy systems and
                                                            sensors operating in multiple protocols from the public to the private fields.
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={home.moreViewS4}><a href="performanceSection#sectionSystem">More View</a></span>
                                            </div>
                                        </div>
                                    </div>
                                </Slide>
                                <Slide id={home.section3}>
                                    <div className={home.uBusiness}>
                                        <span className={home.introBSubTitle}>
                                            <span>We have specialized and focused on safety management solutions,</span>
                                            <span>consulting, and digital twin application solutions since our foundation.</span>
                                        </span>
                                        <div className={home.introBBox}>
                                            <div className={home.introBFlex}>
                                                <span className={home.introBBoxArea1}>
                                                    <span className={home.introBIcon}></span>
                                                    <span className={home.introBTextBox}>
                                                        <span className={home.introBBoxText1}>Safety Management</span>
                                                        <span className={home.introBBoxText2}>Business</span>
                                                    </span>
                                                    <span className={home.introBContsBox}>
                                                        <span className={home.introBBoxText3}>Provide customized solutions and consulting for</span>
                                                        <span className={home.introBBoxText4}>various types of disasters with our disaster</span>
                                                        <span className={home.introBBoxText5}>safety technology and management</span>
                                                        <span className={home.introBBoxText6}>capabilities accumulated over many years.</span>
                                                    </span>
                                                    <span className={home.moreView6}><a href="businessSection#sectionSafety">More View</a></span>
                                                </span>

                                                <span className={home.introBBoxArea2}>
                                                    <span className={home.introBIcon2}></span>
                                                    <span className={home.introBTextBox2}>
                                                        <span className={home.introBBoxText7}>Digital Twin Solutions</span>
                                                        <span className={home.introBBoxText8}>Business</span>
                                                    </span>
                                                    <span className={home.introBContsBox2}>
                                                        <span className={home.introBBoxText9}>Provide customers with 3D-based digital twin</span>
                                                        <span className={home.introBBoxText10}>solutions with a high understanding of indoor</span>
                                                        <span className={home.introBBoxText11}>and outdoor space and integrated IoT sensor</span>
                                                        <span className={home.introBBoxText12}>monitoring technology.</span>
                                                    </span>
                                                    <span className={home.moreView7}><a href="businessSection#sectionDigital">More View</a></span>
                                                </span>

                                                <span className={home.introBBoxArea3}>
                                                    <span className={home.introBIcon3}></span>
                                                    <span className={home.introBTextBox3}>
                                                        <span className={home.introBBoxText13}>Achivements and</span>
                                                        <span className={home.introBBoxText14}>Customers</span>
                                                    </span>
                                                    <span className={home.introBContsBox3}>
                                                        <span className={home.introBBoxText15}>With more than 10 years of business experience,</span>
                                                        <span className={home.introBBoxText16}>many customers in the public and </span>
                                                        <span className={home.introBBoxText17}>private sectors are using our solutions.</span>
                                                        <span className={home.introBBoxText18}></span>
                                                    </span>
                                                    <span className={home.moreView8}><a href="businessSection#sectionPerformance">More View</a></span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Slide>
                                <Slide id={home.section4}>
                                    <div className={home.contactMainBoxM}>
                                        <div className={home.InquiryAreaM}>
                                            <span className={home.contactSideTitle}>Are you curious about our technology and business? Please feel free to contact:</span>
                                            <div className={home.conFirstBoxM}>
                                                <span className={home.conKindNameM}>Inquiry type</span>
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
                                            <div className={home.conSecondBoxM}>
                                                <div className={home.conLeftBoxM}>
                                                    <span className={home.conLeftTBox}>
                                                        <span className={home.companyNameM}>Company name</span>
                                                        <span className={home.companyNameSelect}>* Optional</span>
                                                    </span>
                                                    <input type="text" className={home.contactCompanyBoxM} placeholder="Enter company name" ref={this.refCompany} /* onClick={this.chkValue} */ required />
                                                </div>
                                                <div className={home.conMiddleBoxM}>
                                                    <span className={home.conPeopleNameM}>Name</span>
                                                    <input type="text" id="tt" className={home.contactNameBoxM} placeholder="Please enter your name" ref={this.refName} onClick={this.statusChange} />
                                                </div>
                                                <div className={home.conRightBoxM}>
                                                    <span className={home.contactEmailM}>E-mail</span>
                                                    <input type="text" ref={this.refEmail} className={home.contactEmailBoxM} placeholder="Please enter your email" />
                                                </div>
                                            </div>
                                            <div className={home.conThirdBoxM}>
                                                <span className={home.InquiryContentsM}>Content</span>
                                                <textarea ref={this.refMemo} className={home.contactTextBoxMemoM} type="text" placeholder="Please enter your inquiry"></textarea>
                                            </div>
                                            <div className={home.conFourthBoxM}>
                                                <div className={home.conInputArea}>
                                                    {/* <label><input ref={this.refCheckbox} class="checkTest" type="checkbox" name="color" value="red" onClick={this.checkTest} id="aaa" /><p class="inputText">개인정보 취급 방침에 동의합니다.</p></label> */}
                                                    <input type="checkbox" ref={this.refCheckbox} class="checkTest" id="check1" name="color" value="red" onClick={this.checkTest} /><label htmlFor={"check1"}></label><p class="inputTextM">I agree with the personal information handling policy.</p>
                                                    <span className={home.personalInforM} id="popupDom" onClick={() => this.openPopup3()}>View policy</span>
                                                    {
                                                        this.state.isOpenPopup3 &&
                                                        <PopupDom>
                                                            <PersonalInforPop onClose={this.closePopup} />
                                                        </PopupDom>
                                                    }
                                                </div>
                                            </div>
                                            <span>
                                                <button type="button"
                                                    id="popupDom"
                                                    className={home.contactSendM}
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
                                </Slide>
                                <Slide id={home.section5}>
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
                                </Slide>
                            </FullPage>
                        </div>
                    </div> {/* contentBox */}
                </>
            );
        } else {
            displayHomeUI.push(
                <></>
            );
        }
        return displayHomeUI;
    }


    render() {
        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
        };

        setTimeout(() => { this.resizeUI() }, 500);
        let displayHomeUI = this.state.disHomeUI;

        return (
            <>
                {displayHomeUI}
            </>
        );
    }
}

export default HomeEng;
