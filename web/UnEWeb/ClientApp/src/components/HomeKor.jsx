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
//import videoGif from '../components/video/mainIntro.gif';


class HomeKor extends Component {
    static displayName = HomeKor.name;

    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            menu: 0,
            //disHomeUI: null,
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


        /* function fallback(video) {
            var img = video.querySelector('img');
            if (img)
             video.parentNode.replaceChild(img, video);
        } */
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
                                        <div className={home.videoBox}>
                                            <span className={home.slideTitle} data-aos="fade-down" data-aos-duration="1000">Unique  &  Experience</span>
                                            <div className={home.slideTitle2}>
                                                <p>오늘날 우리가 머무르는</p>
                                                <p>스마트한 공간에도 재난 위험은 존재합니다.</p>
                                                <p>숙련된 전문가의 손길로</p>
                                                <p>안전하고 편리한 공간을 만들어야</p>
                                                <p>공간의 고유한 가치를 높일 수 있습니다.</p>
                                            </div>
                                            <video autoPlay loop muted playsInline
                                                width='100vw' height='100vh'
                                                className={home.videoArea} 
                                                /* resizeMode={'cover'} */ >
                                                <source src={videoSrc} type="video/mp4" /* onerror="fallback(parentNode)"*/  />
                                            </video>
                                            {/* <img src={videoGif} className={home.imgArea}/> */}
                                        </div> 
                                    </div>
                                </div>
                            </div>

                            <div className={home.uTechnologyS}>
                                <span className={home.skillSubTitle}>유엔이는 안전하고 편리한 공간을 만들고 관리하는<br></br>
                                    핵심원천기술을 보유하고 있습니다.
                                </span>
                                {/* <span className={home.skillSubTitle}>{Resource.ID.homeSkill.skillSubTitle2}</span> */}
                                <div className={home.skillBox}>
                                    <div className={home.skill1}>
                                        <div className={home.iconAreaS1}>
                                            <span></span>
                                        </div>
                                        <div className={home.skillTextBox1}>
                                            <span className={home.skillTextTitle}>공간정보 구축</span>
                                            <div className={home.skillContBox}>
                                                <span>다양한 시설의 특수성과</span>
                                                <span>서비스 확장성을 지원 가능한</span>
                                                <span>저용량ㆍ고품질의</span>
                                                <span>실내외 공간정보를 구축합니다.</span>
                                            </div>
                                        </div>
                                        <div className={home.moreView1Area}>
                                            <span className={home.moreViewS1}>
                                                <a href="performanceSection#sectionInforBuild">자세히 보기</a>
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
                                                <span>문서 형식의 표준행동절차를</span>
                                                <span>디지털화 및 시스템에 적용해</span>
                                                <span>재난상황의 빠른 전파ㆍ대응과</span>
                                                <span>의사결정을 지원합니다.</span>
                                                <span></span>
                                            </div>
                                        </div>
                                        <span className={home.moreViewS2}><a href="performanceSection#sectionESOP">자세히 보기</a></span>
                                    </div>
                                </div>
                                <div className={home.skillBox2}>
                                    <div className={home.skill3}>
                                        <div className={home.iconAreaS3}>
                                            <span></span>
                                        </div>
                                        <div className={home.skillTextBox3}>
                                            <span className={home.skillTextTitle3}>데이터 시각화</span>
                                            <div className={home.skillContBox3}>
                                                <span>2Dㆍ3D 공간정보와</span>
                                                <span>여러 유형의 IoTㆍ센서 정보를</span>
                                                <span>결합하고 사용자가 직관적으로</span>
                                                <span>이해하도록 시각화합니다.</span>
                                                <span></span>
                                            </div>
                                        </div>
                                        <span className={home.moreViewS3}><a href="performanceSection#sectionData">자세히 보기</a></span>
                                    </div>
                                    <div className={home.skill4}>
                                        <div className={home.iconAreaS4}>
                                            <span></span>
                                        </div>
                                        <div className={home.skillTextBox4}>
                                            <span className={home.skillTextTitle4}>시스템 연계통합</span>
                                            <div className={home.skillContBox4}>
                                                <span>공공ㆍ민간의 기존 시스템 및</span>
                                                <span>서로 다른 프로토콜로 동작하는</span>
                                                <span>센서들을 연계, 통합하여</span>
                                                <span>웹 서비스, 플랫폼을 구축합니다.</span>
                                                <span></span>
                                            </div>
                                        </div>
                                        <span className={home.moreViewS4}><a href="performanceSection#sectionSystem">자세히 보기</a></span>
                                    </div>
                                </div>
                            </div>
                            <div className={home.uBusiness}>
                                <span className={home.introBSubTitle}>
                                    <span>유엔이는 창사 이래 안전관리 솔루션·컨설팅 및</span>
                                    <span>디지털 트윈 응용 솔루션 사업에</span>
                                    <span>특화·집중하고 있습니다.</span>
                                </span>
                                <div className={home.introBBox}>
                                    <div className={home.introBFlex}>
                                        <span className={home.introBBoxArea1}>
                                            <span className={home.introBIcon}></span>
                                            <span className={home.introBTextBox}>
                                                <span className={home.introBBoxText1}>안전관리</span>
                                                <span className={home.introBBoxText2}>솔루션·컨설팅 사업</span>
                                            </span>
                                            <span className={home.introBContsBox}>
                                                <span className={home.introBBoxText3}>여러 유형의 재난에 대해</span>
                                                <span className={home.introBBoxText4}>다년간 축적된 재난안전기술 및</span>
                                                <span className={home.introBBoxText5}>관리역량으로 맞춤형 솔루션</span>
                                                <span className={home.introBBoxText6}>및 컨설팅을 제공합니다.</span>
                                            </span>
                                            <span className={home.moreView6}><a href="businessSection#sectionSafety">자세히 보기</a></span>
                                        </span>

                                        <span className={home.introBBoxArea2}>
                                            <span className={home.introBIcon2}></span>
                                            <span className={home.introBTextBox2}>
                                                <span className={home.introBBoxText7}>디지털 트윈</span>
                                                <span className={home.introBBoxText8}>응용 솔루션 사업</span>
                                            </span>
                                            <span className={home.introBContsBox2}>
                                                <span className={home.introBBoxText9}>실내외 공간의 높은 이해와</span>
                                                <span className={home.introBBoxText10}>IoT 센서 통합모니터링 기술로</span>
                                                <span className={home.introBBoxText11}>3D 기반 디지털 트윈 응용</span>
                                                <span className={home.introBBoxText12}>솔루션을 고객에게 제공합니다.</span>
                                            </span>
                                            <span className={home.moreView7}><a href="businessSection#sectionDigital">자세히 보기</a></span>
                                        </span>
                                    </div>
                                    <div className={home.introBFlex2}>
                                        <span className={home.introBBoxArea3}>
                                            <span className={home.introBIcon3}></span>
                                            <span className={home.introBTextBox3}>
                                                <span className={home.introBBoxText13}>주요실적/고객사</span>
                                            </span>
                                            <span className={home.introBContsBox3}>
                                                <span className={home.introBBoxText15}>10년 이상의 사업수행을 통해</span>
                                                <span className={home.introBBoxText16}>공공 및 민간 분야의</span>
                                                <span className={home.introBBoxText17}>여러 고객들이 유엔이의</span>
                                                <span className={home.introBBoxText18}>솔루션을 이용하고 계십니다.</span>
                                            </span>
                                            <span className={home.moreView8}><a href="businessSection#sectionPerformance">자세히 보기</a></span>
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
                                    <span className={home.contactSideTitle}>
                                        <span>유엔이의 기술과 사업이 궁금하신가요?</span>
                                        <span>언제든지 문의해 주십시오</span>
                                    </span>
                                    <div className={home.conFirstBoxM}>
                                        <span className={home.conKindNameM}>문의 종류</span>
                                        {
                                            <>
                                                {/* <div class="InquirySelectBoxM">
                                                    <button class="label4M" className={home.contactOp} value="jsj930406@unes.co.kr">{Resource.ID.homeContact.conkingSelect1}</button>
                                                    <ul class="InquiryOptionListM" ref={this.refContactTarget} onChange={(e) => this.onChangeTemp(e)} >
                                                        <li class="InquiryOptionItemM" value="jsj930406@unes.co.kr">{Resource.ID.homeContact.conkingSelect1}</li>
                                                        <li class="InquiryOptionItemM" value="jsj930406@unes.co.kr">{Resource.ID.homeContact.conkingSelect2}</li>
                                                        <li class="InquiryOptionItemM" value="jsj930406@unes.co.kr">{Resource.ID.homeContact.conkingSelect3}</li>
                                                        <li class="InquiryOptionItemM" value="jsj930406@unes.co.kr">{Resource.ID.homeContact.conkingSelect4}</li>
                                                        <li class="InquiryOptionItemM" value="jsj930406@unes.co.kr">{Resource.ID.homeContact.conkingSelect5}</li>
                                                    </ul>
                                                </div> */}

                                                {/* test용 */}
                                                {/* <select ref={this.refContactTarget} class="InquiryHomeSelect">
                                                    <option class="InquiryHomeOptionItem" value="jsj930406@unes.co.kr">{Resource.ID.homeContact.conkingSelect1}</option>
                                                    <option class="InquiryHomeOptionItem" value="jsj930406@unes.co.kr">{Resource.ID.homeContact.conkingSelect2}</option>
                                                    <option class="InquiryHomeOptionItem" value="jsj930406@unes.co.kr">{Resource.ID.homeContact.conkingSelect3}</option>
                                                    <option class="InquiryHomeOptionItem" value="jsj930406@unes.co.kr">{Resource.ID.homeContact.conkingSelect4}</option>
                                                    <option class="InquiryHomeOptionItem" value="jsj930406@unes.co.kr">{Resource.ID.homeContact.conkingSelect5}</option>
                                                </select> */}

                                                {/* <div class="custom-select">
                                                    <select ref={this.refContactTarget}>
                                                        <option value="jsj930406@unes.co.kr">{Resource.ID.homeContact.conkingSelect1}</option>
                                                        <option value="jsj930406@unes.co.kr">{Resource.ID.homeContact.conkingSelect1}</option>
                                                        <option value="jsj930406@unes.co.kr">{Resource.ID.homeContact.conkingSelect2}</option>
                                                        <option value="jsj930406@unes.co.kr">{Resource.ID.homeContact.conkingSelect3}</option>
                                                        <option value="jsj930406@unes.co.kr">{Resource.ID.homeContact.conkingSelect4}</option>
                                                        <option value="jsj930406@unes.co.kr">{Resource.ID.homeContact.conkingSelect5}</option>
                                                    </select>
                                                </div> */}

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
                                    <div className={home.conSecondBoxM}>
                                        <div className={home.conLeftBoxM}>
                                            <span className={home.conLeftTBox}>
                                                <span className={home.companyNameM}>회사명</span>
                                                <span className={home.companyNameSelect}>* 선택</span>
                                            </span>
                                            <input type="text" ref={this.refCompany} className={home.contactCompanyBoxM} placeholder="회사명을 입력하여 주십시오." /* onClick={this.chkValue} */ required />
                                        </div>
                                        <div className={home.conMiddleBoxM}>
                                            <span className={home.conPeopleNameM}>성함</span>
                                            <input type="text" ref={this.refName} id="tt" className={home.contactNameBoxM} placeholder="성함을 입력하여 주십시오." onClick={this.statusChange} />
                                        </div>
                                        <div className={home.conRightBoxM}>
                                            <span className={home.contactEmailM}>이메일</span>
                                            <input type="text" ref={this.refEmail} className={home.contactEmailBoxM} placeholder="이메일을 입력하여 주십시오." />
                                        </div>
                                    </div>
                                    <div className={home.conThirdBoxM}>
                                        <span className={home.InquiryContentsM}>문의 내용</span>
                                        <textarea ref={this.refMemo} className={home.contactTextBoxMemoM} type="text" placeholder="문의 내용을 입력하여 주십시오."></textarea>
                                    </div>
                                    <div className={home.conFourthBoxM}>
                                        <div className={home.conInputArea}>
                                            {/* <label><input ref={this.refCheckbox} class="checkTest" type="checkbox" name="color" value="red" onClick={this.checkTest} id="aaa" /><p class="inputText">개인정보 취급 방침에 동의합니다.</p></label> */}
                                            <input type="checkbox" ref={this.refCheckbox} class="checkTest" id="check1" name="color" value="red" onClick={this.checkTest} /><label htmlFor={"check1"}></label><p class="inputTextM">개인정보 취급방침에 동의합니다.</p>
                                        </div>
                                        <span className={home.personalInforM} id="popupDom" onClick={() => this.openPopup3()}>개인정보처리방침 보기</span>
                                        {
                                            this.state.isOpenPopup3 &&
                                            <PopupDom>
                                                <PersonalInforPop onClose={this.props.closePopup} />
                                            </PopupDom>
                                        }
                                    </div>
                                    <span>
                                        <button type="button"
                                            id="popupDom"
                                            className={home.contactSendM}
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
                                                <p>오늘날 우리가 머무르는</p>
                                                <p>스마트한 공간에도 재난 위험은 존재합니다.</p>
                                                <p>숙련된 전문가의 손길로</p>
                                                <p>안전하고 편리한 공간을 만들어야</p>
                                                <p>공간의 고유한 가치를 높일 수 있습니다.</p>
                                            </div>
                                            <video autoPlay loop muted playsInline
                                                className={home.videoArea}
                                                resizeMode={'cover'} >
                                                <source src={videoSrc} type="video/mp4" />
                                            </video>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={home.uTechnologyS}>
                                <span className={home.skillSubTitle}>유엔이는 안전하고 편리한 공간을 만들고 관리하는<br></br>
                                    핵심원천기술을 보유하고 있습니다.
                                </span>
                                {/* <span className={home.skillSubTitle}>{Resource.ID.homeSkill.skillSubTitle2}</span> */}
                                <div className={home.skillBox}>
                                    <div className={home.skill1}>
                                        <div className={home.iconAreaS1}>
                                            <span></span>
                                        </div>
                                        <div className={home.skillTextBox1}>
                                            <span className={home.skillTextTitle}>공간정보 구축</span>
                                            <div className={home.skillContBox}>
                                                <span>다양한 시설의 특수성과</span>
                                                <span>서비스 확장성을 지원 가능한</span>
                                                <span>저용량ㆍ고품질의</span>
                                                <span>실내외 공간정보를 구축합니다.</span>
                                            </div>
                                        </div>
                                        <div className={home.moreView1Area}>
                                            <span className={home.moreViewS1}>
                                                <a href="performanceSection#sectionInforBuild">자세히 보기</a>
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
                                                <span>문서 형식의 표준행동절차를</span>
                                                <span>디지털화 및 시스템에 적용해</span>
                                                <span>재난상황의 빠른 전파ㆍ대응과</span>
                                                <span>의사결정을 지원합니다.</span>
                                                <span></span>
                                            </div>
                                        </div>
                                        <span className={home.moreViewS2}><a href="performanceSection#sectionESOP">자세히 보기</a></span>
                                    </div>
                                </div>
                                <div className={home.skillBox2}>
                                    <div className={home.skill3}>
                                        <div className={home.iconAreaS3}>
                                            <span></span>
                                        </div>
                                        <div className={home.skillTextBox3}>
                                            <span className={home.skillTextTitle3}>데이터 시각화</span>
                                            <div className={home.skillContBox3}>
                                                <span>2Dㆍ3D 공간정보와</span>
                                                <span>여러 유형의 IoTㆍ센서 정보를</span>
                                                <span>결합하고 사용자가 직관적으로</span>
                                                <span>이해하도록 시각화합니다.</span>
                                                <span></span>
                                            </div>
                                        </div>
                                        <span className={home.moreViewS3}><a href="performanceSection#sectionData">자세히 보기</a></span>
                                    </div>
                                    <div className={home.skill4}>
                                        <div className={home.iconAreaS4}>
                                            <span></span>
                                        </div>
                                        <div className={home.skillTextBox4}>
                                            <span className={home.skillTextTitle4}>시스템 연계통합</span>
                                            <div className={home.skillContBox4}>
                                                <span>공공ㆍ민간의 기존 시스템 및</span>
                                                <span>서로 다른 프로토콜로 동작하는</span>
                                                <span>센서들을 연계, 통합하여</span>
                                                <span>웹 서비스, 플랫폼을 구축합니다.</span>
                                                <span></span>
                                            </div>
                                        </div>
                                        <span className={home.moreViewS4}><a href="performanceSection#sectionSystem">자세히 보기</a></span>
                                    </div>
                                </div>
                            </div>
                            <div className={home.uBusiness}>
                                <span className={home.introBSubTitle}>
                                    <span>유엔이는 창사 이래 안전관리 솔루션·컨설팅 및</span>
                                    <span>디지털 트윈 응용 솔루션 사업에</span>
                                    <span>특화·집중하고 있습니다.</span>
                                </span>
                                <div className={home.introBBox}>
                                    <div className={home.introBFlex}>
                                        <span className={home.introBBoxArea1}>
                                            <span className={home.introBIcon}></span>
                                            <span className={home.introBTextBox}>
                                                <span className={home.introBBoxText1}>안전관리</span>
                                                <span className={home.introBBoxText2}>솔루션·컨설팅 사업</span>
                                            </span>
                                            <span className={home.introBContsBox}>
                                                <span className={home.introBBoxText3}>여러 유형의 재난에 대해</span>
                                                <span className={home.introBBoxText4}>다년간 축적된 재난안전기술 및</span>
                                                <span className={home.introBBoxText5}>관리역량으로 맞춤형 솔루션</span>
                                                <span className={home.introBBoxText6}>및 컨설팅을 제공합니다.</span>
                                            </span>
                                            <span className={home.moreView6}><a href="businessSection#sectionSafety">자세히 보기</a></span>
                                        </span>

                                        <span className={home.introBBoxArea2}>
                                            <span className={home.introBIcon2}></span>
                                            <span className={home.introBTextBox2}>
                                                <span className={home.introBBoxText7}>디지털 트윈</span>
                                                <span className={home.introBBoxText8}>응용 솔루션 사업</span>
                                            </span>
                                            <span className={home.introBContsBox2}>
                                                <span className={home.introBBoxText9}>실내외 공간의 높은 이해와</span>
                                                <span className={home.introBBoxText10}>IoT 센서 통합모니터링 기술로</span>
                                                <span className={home.introBBoxText11}>3D 기반 디지털 트윈 응용</span>
                                                <span className={home.introBBoxText12}>솔루션을 고객에게 제공합니다.</span>
                                            </span>
                                            <span className={home.moreView7}><a href="businessSection#sectionDigital">자세히 보기</a></span>
                                        </span>
                                    </div>
                                    <div className={home.introBFlex2}>
                                        <span className={home.introBBoxArea3}>
                                            <span className={home.introBIcon3}></span>
                                            <span className={home.introBTextBox3}>
                                                <span className={home.introBBoxText13}>주요실적/고객사</span>
                                            </span>
                                            <span className={home.introBContsBox3}>
                                                <span className={home.introBBoxText15}>10년 이상의 사업수행을 통해</span>
                                                <span className={home.introBBoxText16}>공공 및 민간 분야의</span>
                                                <span className={home.introBBoxText17}>여러 고객들이 유엔이의</span>
                                                <span className={home.introBBoxText18}>솔루션을 이용하고 계십니다.</span>
                                            </span>
                                            <span className={home.moreView8}><a href="businessSection#sectionPerformance">자세히 보기</a></span>
                                        </span>
                                        <span className={home.introBBoxArea4}></span>
                                    </div>
                                </div>
                            </div>
                            <div className={home.contactMainBoxM}>
                                <div className={home.InquiryAreaM}>
                                    <span className={home.contactSideTitle}>
                                        <span>유엔이의 기술과 사업이 궁금하신가요?</span>
                                        <span>언제든지 문의해 주십시오</span>
                                    </span>
                                    <div className={home.conFirstBoxM}>
                                        <span className={home.conKindNameM}>문의 종류</span>
                                        {
                                            <>
                                                {/* 게시할때 아래 코드 사용할것 */}
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
                                    <div className={home.conSecondBoxM}>
                                        <div className={home.conLeftBoxM}>
                                            <span className={home.conLeftTBox}>
                                                <span className={home.companyNameM}>회사명</span>
                                                <span className={home.companyNameSelect}>* 선택</span>
                                            </span>
                                            <input type="text" ref={this.refCompany} className={home.contactCompanyBoxM} placeholder="회사명을 입력하여 주십시오." /* onClick={this.chkValue} */ required />
                                        </div>
                                        <div className={home.conMiddleBoxM}>
                                            <span className={home.conPeopleNameM}>성함</span>
                                            <input type="text" ref={this.refName} id="tt" className={home.contactNameBoxM} placeholder="성함을 입력하여 주십시오." onClick={this.statusChange} />
                                        </div>
                                        <div className={home.conRightBoxM}>
                                            <span className={home.contactEmailM}>이메일</span>
                                            <input type="text" ref={this.refEmail} className={home.contactEmailBoxM} placeholder="이메일을 입력하여 주십시오." />
                                        </div>
                                    </div>
                                    <div className={home.conThirdBoxM}>
                                        <span className={home.InquiryContentsM}>문의 내용</span>
                                        <textarea ref={this.refMemo} className={home.contactTextBoxMemoM} type="text" placeholder="문의 내용을 입력하여 주십시오."></textarea>
                                    </div>
                                    <div className={home.conFourthBoxM}>
                                        <div className={home.conInputArea}>
                                            {/* <label><input ref={this.refCheckbox} class="checkTest" type="checkbox" name="color" value="red" onClick={this.checkTest} id="aaa" /><p class="inputText">개인정보 취급 방침에 동의합니다.</p></label> */}
                                            <input type="checkbox" ref={this.refCheckbox} class="checkTest" id="check1" name="color" value="red" onClick={this.checkTest} /><label htmlFor={"check1"}></label><p class="inputTextM">개인정보 취급방침에 동의합니다.</p>
                                        </div>
                                        <span className={home.personalInforM} id="popupDom" onClick={() => this.openPopup3()}>개인정보처리방침 보기</span>
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
                                                <span className={home.slideTitle} data-aos="fade-down" data-aos-duration="1000">Unique  &  Experience</span>

                                                <div class="rollingbanner ">
                                                    <div class="wrap">
                                                        <ul>
                                                            <li class="current">
                                                                <a href="#">오늘날 우리가 머무르는 스마트한 공간에도 재난 위험은 존재합니다.</a>
                                                                <a href="#">숙련된 전문가의 손길로 안전하고 편리한 공간을 만들어야 공간의 고유한 가치를 높일 수 있습니다.</a>
                                                            </li>
                                                            <li class="next">
                                                                <a href="#">공간의 가치를 새롭게 창조해 나가는 디지털 트윈 기술 기반 재난안전 전문 기업,</a>
                                                                <a href="#">(주)유엔이입니다.</a>
                                                            </li>
                                                            <li class="#">
                                                                <a href="#">오늘날 우리가 머무르는 스마트한 공간에도 재난 위험은 존재합니다.</a>
                                                                <a href="#">숙련된 전문가의 손길로 안전하고 편리한 공간을 만들어야 공간의 고유한 가치를 높일 수 있습니다.</a>
                                                            </li>
                                                            <li class="prev">
                                                                <a href="#">공간의 가치를 새롭게 창조해 나가는 디지털 트윈 기술 기반 재난안전 전문 기업,</a>
                                                                <a href="#">(주)유엔이입니다.</a>
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
                                        <span className={home.skillSubTitle}>유엔이는 안전하고 편리한 공간을 만들고 관리하는<br></br>
                                            핵심원천기술을 보유하고 있습니다.
                                        </span>
                                        {/* <span className={home.skillSubTitle}>{Resource.ID.homeSkill.skillSubTitle2}</span> */}
                                        <div className={home.skillBox}>
                                            <div className={home.skill1}>
                                                <div className={home.iconAreaS1}>
                                                    <span></span>
                                                </div>
                                                <div className={home.skillTextBox1}>
                                                    <span className={home.skillTextTitle}>공간정보 구축</span>
                                                    <div className={home.skillContBox}>
                                                        <span>다양한 시설의 특수성과</span>
                                                        <span>서비스 확장성을 지원 가능한</span>
                                                        <span>저용량ㆍ고품질의</span>
                                                        <span>실내외 공간정보를 구축합니다.</span>
                                                    </div>
                                                </div>
                                                <div className={home.moreView1Area}>
                                                    <span className={home.moreViewS1}>
                                                        <a href="performanceSection#sectionInforBuild">자세히 보기</a>
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
                                                        <span>문서 형식의 표준행동절차를</span>
                                                        <span>디지털화 및 시스템에 적용해</span>
                                                        <span>재난상황의 빠른 전파ㆍ대응과</span>
                                                        <span>의사결정을 지원합니다.</span>
                                                        <span></span>
                                                    </div>
                                                </div>
                                                <span className={home.moreViewS2}><a href="performanceSection#sectionESOP">자세히 보기</a></span>
                                            </div>
                                        </div>
                                        <div className={home.skillBox2}>
                                            <div className={home.skill3}>
                                                <div className={home.iconAreaS3}>
                                                    <span></span>
                                                </div>
                                                <div className={home.skillTextBox3}>
                                                    <span className={home.skillTextTitle3}>데이터 시각화</span>
                                                    <div className={home.skillContBox3}>
                                                        <span>2Dㆍ3D 공간정보와</span>
                                                        <span>여러 유형의 IoTㆍ센서 정보를</span>
                                                        <span>결합하고 사용자가 직관적으로</span>
                                                        <span>이해하도록 시각화합니다.</span>
                                                        <span></span>
                                                    </div>
                                                </div>
                                                <span className={home.moreViewS3}><a href="performanceSection#sectionData">자세히 보기</a></span>
                                            </div>
                                            <div className={home.skill4}>
                                                <div className={home.iconAreaS4}>
                                                    <span></span>
                                                </div>
                                                <div className={home.skillTextBox4}>
                                                    <span className={home.skillTextTitle4}>시스템 연계통합</span>
                                                    <div className={home.skillContBox4}>
                                                        <span>공공ㆍ민간의 기존 시스템 및</span>
                                                        <span>서로 다른 프로토콜로 동작하는</span>
                                                        <span>센서들을 연계, 통합하여</span>
                                                        <span>웹 서비스, 플랫폼을 구축합니다.</span>
                                                        <span></span>
                                                    </div>
                                                </div>
                                                <span className={home.moreViewS4}><a href="performanceSection#sectionSystem">자세히 보기</a></span>
                                            </div>
                                        </div>
                                    </div>
                                </Slide>
                                <Slide id={home.section3}>
                                    <div className={home.uBusiness}>
                                        <span className={home.introBSubTitle}>
                                            <span>유엔이는 창사 이래 안전관리 솔루션·컨설팅 및</span>
                                            <span>디지털 트윈 응용 솔루션 사업에 특화·집중하고 있습니다.</span>
                                        </span>
                                        <div className={home.introBBox}>
                                            <div className={home.introBFlex}>
                                                <span className={home.introBBoxArea1}>
                                                    <span className={home.introBIcon}></span>
                                                    <span className={home.introBTextBox}>
                                                        <span className={home.introBBoxText1}>안전관리</span>
                                                        <span className={home.introBBoxText2}>솔루션·컨설팅 사업</span>
                                                    </span>
                                                    <span className={home.introBContsBox}>
                                                        <span className={home.introBBoxText3}>여러 유형의 재난에 대해</span>
                                                        <span className={home.introBBoxText4}>다년간 축적된 재난안전기술 및</span>
                                                        <span className={home.introBBoxText5}>관리역량으로 맞춤형 솔루션</span>
                                                        <span className={home.introBBoxText6}>및 컨설팅을 제공합니다.</span>
                                                    </span>
                                                    <span className={home.moreView6}><a href="businessSection#sectionSafety">자세히 보기</a></span>
                                                </span>

                                                <span className={home.introBBoxArea2}>
                                                    <span className={home.introBIcon2}></span>
                                                    <span className={home.introBTextBox2}>
                                                        <span className={home.introBBoxText7}>디지털 트윈</span>
                                                        <span className={home.introBBoxText8}>응용 솔루션 사업</span>
                                                    </span>
                                                    <span className={home.introBContsBox2}>
                                                        <span className={home.introBBoxText9}>실내외 공간의 높은 이해와</span>
                                                        <span className={home.introBBoxText10}>IoT 센서 통합모니터링 기술로</span>
                                                        <span className={home.introBBoxText11}>3D 기반 디지털 트윈 응용</span>
                                                        <span className={home.introBBoxText12}>솔루션을 고객에게 제공합니다.</span>
                                                    </span>
                                                    <span className={home.moreView7}><a href="businessSection#sectionDigital">자세히 보기</a></span>
                                                </span>

                                                <span className={home.introBBoxArea3}>
                                                    <span className={home.introBIcon3}></span>
                                                    <span className={home.introBTextBox3}>
                                                        <span className={home.introBBoxText13}>주요실적/고객사</span>
                                                        <span className={home.introBBoxText14}></span>
                                                    </span>
                                                    <span className={home.introBContsBox3}>
                                                        <span className={home.introBBoxText15}>10년 이상의 사업수행을 통해</span>
                                                        <span className={home.introBBoxText16}>공공 및 민간 분야의</span>
                                                        <span className={home.introBBoxText17}>여러 고객들이 유엔이의</span>
                                                        <span className={home.introBBoxText18}>솔루션을 이용하고 계십니다.</span>
                                                    </span>
                                                    <span className={home.moreView8}><a href="businessSection#sectionPerformance">자세히 보기</a></span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Slide>
                                <Slide id={home.section4}>
                                    <div className={home.contactMainBoxM}>
                                        <div className={home.InquiryAreaM}>
                                            <span className={home.contactSideTitle}>유엔이의 기술과 사업이 궁금하신가요? 언제든지 문의해 주십시오</span>
                                            <div className={home.conFirstBoxM}>
                                                <span className={home.conKindNameM}>문의 종류</span>
                                                {
                                                    <>
                                                        {/* 게시할때 아래 코드 사용할것 */}
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
                                            <div className={home.conSecondBoxM}>
                                                <div className={home.conLeftBoxM}>
                                                    <span className={home.conLeftTBox}>
                                                        <span className={home.companyNameM}>회사명</span>
                                                        <span className={home.companyNameSelect}>* 선택</span>
                                                    </span>
                                                    <input type="text" ref={this.refCompany} className={home.contactCompanyBoxM} placeholder="회사명을 입력하여 주십시오." /* onClick={this.chkValue} */ required />
                                                </div>
                                                <div className={home.conMiddleBoxM}>
                                                    <span className={home.conPeopleNameM}>성함</span>
                                                    <input type="text" ref={this.refName} id="tt" className={home.contactNameBoxM} placeholder="성함을 입력하여 주십시오." onClick={this.statusChange} />
                                                </div>
                                                <div className={home.conRightBoxM}>
                                                    <span className={home.contactEmailM}>이메일</span>
                                                    <input type="text" ref={this.refEmail} className={home.contactEmailBoxM} placeholder="이메일을 입력하여 주십시오." />
                                                </div>
                                            </div>
                                            <div className={home.conThirdBoxM}>
                                                <span className={home.InquiryContentsM}>문의 내용</span>
                                                <textarea ref={this.refMemo} className={home.contactTextBoxMemoM} type="text" placeholder="문의 내용을 입력하여 주십시오."></textarea>
                                            </div>
                                            <div className={home.conFourthBoxM}>
                                                <div className={home.conInputArea}>
                                                    {/* <label><input ref={this.refCheckbox} class="checkTest" type="checkbox" name="color" value="red" onClick={this.checkTest} id="aaa" /><p class="inputText">개인정보 취급 방침에 동의합니다.</p></label> */}
                                                    <input type="checkbox" ref={this.refCheckbox} class="checkTest" id="check1" name="color" value="red" onClick={this.checkTest} /><label htmlFor={"check1"}></label><p class="inputTextM">개인정보 취급방침에 동의합니다.</p>
                                                    <span className={home.personalInforM} id="popupDom" onClick={() => this.openPopup3()}>개인정보처리방침 보기</span>
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
                                </Slide>
                                <Slide id={home.section5}>
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
                                            <div /* className={home.imgBg}*/ >
                                                <span className={home.slideTitle} data-aos="fade-down" data-aos-duration="1000">Unique  &  Experience</span>

                                                <div class="rollingbanner ">
                                                    <div class="wrap">
                                                        <ul>
                                                            <li class="current">
                                                                <a href="#">오늘날 우리가 머무르는 스마트한 공간에도 재난 위험은 존재합니다.</a>
                                                                <a href="#">숙련된 전문가의 손길로 안전하고 편리한 공간을 만들어야 공간의 고유한 가치를 높일 수 있습니다.</a>
                                                            </li>
                                                            <li class="next">
                                                                <a href="#">공간의 가치를 새롭게 창조해 나가는 디지털 트윈 기술 기반 재난안전 전문 기업,</a>
                                                                <a href="#">(주)유엔이입니다.</a>
                                                            </li>
                                                            <li class="#">
                                                                <a href="#">오늘날 우리가 머무르는 스마트한 공간에도 재난 위험은 존재합니다.</a>
                                                                <a href="#">숙련된 전문가의 손길로 안전하고 편리한 공간을 만들어야 공간의 고유한 가치를 높일 수 있습니다.</a>
                                                            </li>
                                                            <li class="prev">
                                                                <a href="#">공간의 가치를 새롭게 창조해 나가는 디지털 트윈 기술 기반 재난안전 전문 기업,</a>
                                                                <a href="#">(주)유엔이입니다.</a>
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
                                        <span className={home.skillSubTitle}>유엔이는 안전하고 편리한 공간을 만들고 관리하는<br></br>
                                            핵심원천기술을 보유하고 있습니다.
                                        </span>
                                        {/* <span className={home.skillSubTitle}>{Resource.ID.homeSkill.skillSubTitle2}</span> */}
                                        <div className={home.skillBox}>
                                            <div className={home.skill1}>
                                                <div className={home.iconAreaS1}>
                                                    <span></span>
                                                </div>
                                                <div className={home.skillTextBox1}>
                                                    <span className={home.skillTextTitle}>공간정보 구축</span>
                                                    <div className={home.skillContBox}>
                                                        <span>다양한 시설의 특수성과</span>
                                                        <span>서비스 확장성을 지원 가능한</span>
                                                        <span>저용량ㆍ고품질의</span>
                                                        <span>실내외 공간정보를 구축합니다.</span>
                                                    </div>
                                                </div>
                                                <div className={home.moreView1Area}>
                                                    <span className={home.moreViewS1}>
                                                        <a href="performanceSection#sectionInforBuild">자세히 보기</a>
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
                                                        <span>문서 형식의 표준행동절차를</span>
                                                        <span>디지털화 및 시스템에 적용해</span>
                                                        <span>재난상황의 빠른 전파ㆍ대응과</span>
                                                        <span>의사결정을 지원합니다.</span>
                                                        <span></span>
                                                    </div>
                                                </div>
                                                <span className={home.moreViewS2}><a href="performanceSection#sectionESOP">자세히 보기</a></span>
                                            </div>
                                        {/* <div className={home.skillBox2}> */}
                                            <div className={home.skill3}>
                                                <div className={home.iconAreaS3}>
                                                    <span></span>
                                                </div>
                                                <div className={home.skillTextBox3}>
                                                    <span className={home.skillTextTitle3}>데이터 시각화</span>
                                                    <div className={home.skillContBox3}>
                                                        <span>2Dㆍ3D 공간정보와</span>
                                                        <span>여러 유형의 IoTㆍ센서 정보를</span>
                                                        <span>결합하고 사용자가 직관적으로</span>
                                                        <span>이해하도록 시각화합니다.</span>
                                                        <span></span>
                                                    </div>
                                                </div>
                                                <span className={home.moreViewS3}><a href="performanceSection#sectionData">자세히 보기</a></span>
                                            </div>
                                            <div className={home.skill4}>
                                                <div className={home.iconAreaS4}>
                                                    <span></span>
                                                </div>
                                                <div className={home.skillTextBox4}>
                                                    <span className={home.skillTextTitle4}>시스템 연계통합</span>
                                                    <div className={home.skillContBox4}>
                                                        <span>공공ㆍ민간의 기존 시스템 및</span>
                                                        <span>서로 다른 프로토콜로 동작하는</span>
                                                        <span>센서들을 연계, 통합하여</span>
                                                        <span>웹 서비스, 플랫폼을 구축합니다.</span>
                                                        <span></span>
                                                    </div>
                                                </div>
                                                <span className={home.moreViewS4}><a href="performanceSection#sectionSystem">자세히 보기</a></span>
                                            </div>
                                        {/* </div> */}
                                        </div>
                                    </div>
                                </Slide>
                                <Slide id={home.section3}>
                                    <div className={home.uBusiness}>
                                        <span className={home.introBSubTitle}>
                                            <span>유엔이는 창사 이래 안전관리 솔루션·컨설팅 및</span>
                                            <span>디지털 트윈 응용 솔루션 사업에 특화·집중하고 있습니다.</span>
                                        </span>
                                        <div className={home.introBBox}>
                                            <div className={home.introBFlex}>
                                                <span className={home.introBBoxArea1}>
                                                    <span className={home.introBIcon}></span>
                                                    <span className={home.introBTextBox}>
                                                        <span className={home.introBBoxText1}>안전관리</span>
                                                        <span className={home.introBBoxText2}>솔루션·컨설팅 사업</span>
                                                    </span>
                                                    <span className={home.introBContsBox}>
                                                        <span className={home.introBBoxText3}>여러 유형의 재난에 대해</span>
                                                        <span className={home.introBBoxText4}>다년간 축적된 재난안전기술 및</span>
                                                        <span className={home.introBBoxText5}>관리역량으로 맞춤형 솔루션</span>
                                                        <span className={home.introBBoxText6}>및 컨설팅을 제공합니다.</span>
                                                    </span>
                                                    <span className={home.moreView6}><a href="businessSection#sectionSafety">자세히 보기</a></span>
                                                </span>

                                                <span className={home.introBBoxArea2}>
                                                    <span className={home.introBIcon2}></span>
                                                    <span className={home.introBTextBox2}>
                                                        <span className={home.introBBoxText7}>디지털 트윈</span>
                                                        <span className={home.introBBoxText8}>응용 솔루션 사업</span>
                                                    </span>
                                                    <span className={home.introBContsBox2}>
                                                        <span className={home.introBBoxText9}>실내외 공간의 높은 이해와</span>
                                                        <span className={home.introBBoxText10}>IoT 센서 통합모니터링 기술로</span>
                                                        <span className={home.introBBoxText11}>3D 기반 디지털 트윈 응용</span>
                                                        <span className={home.introBBoxText12}>솔루션을 고객에게 제공합니다.</span>
                                                    </span>
                                                    <span className={home.moreView7}><a href="businessSection#sectionDigital">자세히 보기</a></span>
                                                </span>

                                                <span className={home.introBBoxArea3}>
                                                    <span className={home.introBIcon3}></span>
                                                    <span className={home.introBTextBox3}>
                                                        <span className={home.introBBoxText13}>주요실적/고객사</span>
                                                        <span className={home.introBBoxText14}></span>
                                                    </span>
                                                    <span className={home.introBContsBox3}>
                                                        <span className={home.introBBoxText15}>10년 이상의 사업수행을 통해</span>
                                                        <span className={home.introBBoxText16}>공공 및 민간 분야의</span>
                                                        <span className={home.introBBoxText17}>여러 고객들이 유엔이의</span>
                                                        <span className={home.introBBoxText18}>솔루션을 이용하고 계십니다.</span>
                                                    </span>
                                                    <span className={home.moreView8}><a href="businessSection#sectionPerformance">자세히 보기</a></span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Slide>
                                <Slide id={home.section4}>
                                    <div className={home.contactMainBoxM}>
                                        <div className={home.InquiryAreaM}>
                                            <span className={home.contactSideTitle}>유엔이의 기술과 사업이 궁금하신가요? 언제든지 문의해 주십시오</span>
                                            <div className={home.conFirstBoxM}>
                                                <span className={home.conKindNameM}>문의 종류</span>
                                                {
                                                    <>
                                                        {/* 게시할때 아래 코드 사용할것 */}
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
                                            <div className={home.conSecondBoxM}>
                                                <div className={home.conLeftBoxM}>
                                                    <span className={home.conLeftTBox}>
                                                        <span className={home.companyNameM}>회사명</span>
                                                        <span className={home.companyNameSelect}>* 선택</span>
                                                    </span>
                                                    <input type="text" ref={this.refCompany} className={home.contactCompanyBoxM} placeholder="회사명을 입력하여 주십시오." /* onClick={this.chkValue} */ required />
                                                </div>
                                                <div className={home.conMiddleBoxM}>
                                                    <span className={home.conPeopleNameM}>성함</span>
                                                    <input type="text" ref={this.refName} id="tt" className={home.contactNameBoxM} placeholder="성함을 입력하여 주십시오." onClick={this.statusChange} />
                                                </div>
                                                <div className={home.conRightBoxM}>
                                                    <span className={home.contactEmailM}>이메일</span>
                                                    <input type="text" ref={this.refEmail} className={home.contactEmailBoxM} placeholder="이메일을 입력하여 주십시오." />
                                                </div>
                                            </div>
                                            <div className={home.conThirdBoxM}>
                                                <span className={home.InquiryContentsM}>문의 내용</span>
                                                <textarea ref={this.refMemo} className={home.contactTextBoxMemoM} type="text" placeholder="문의 내용을 입력하여 주십시오."></textarea>
                                            </div>
                                            <div className={home.conFourthBoxM}>
                                                <div className={home.conInputArea}>
                                                    {/* <label><input ref={this.refCheckbox} class="checkTest" type="checkbox" name="color" value="red" onClick={this.checkTest} id="aaa" /><p class="inputText">개인정보 취급 방침에 동의합니다.</p></label> */}
                                                    <input type="checkbox" ref={this.refCheckbox} class="checkTest" id="check1" name="color" value="red" onClick={this.checkTest} /><label htmlFor={"check1"}></label><p class="inputTextM">개인정보 취급방침에 동의합니다.</p>
                                                    <span className={home.personalInforM} id="popupDom" onClick={() => this.openPopup3()}>개인정보처리방침 보기</span>
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
                                </Slide>
                                <Slide id={home.section5}>
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
                                            <div /* className={home.imgBg}*/>
                                                <span className={home.slideTitle} data-aos="fade-down" data-aos-duration="1000">Unique  &  Experience</span>

                                                <div class="rollingbanner ">
                                                    <div class="wrap">
                                                        <ul>
                                                            <li class="current">
                                                                <a href="#">오늘날 우리가 머무르는 스마트한 공간에도 재난 위험은 존재합니다.</a>
                                                                <a href="#">숙련된 전문가의 손길로 안전하고 편리한 공간을 만들어야 공간의 고유한 가치를 높일 수 있습니다.</a>
                                                            </li>
                                                            <li class="next">
                                                                <a href="#">공간의 가치를 새롭게 창조해 나가는 디지털 트윈 기술 기반 재난안전 전문 기업,</a>
                                                                <a href="#">(주)유엔이입니다.</a>
                                                            </li>
                                                            <li class="#">
                                                                <a href="#">오늘날 우리가 머무르는 스마트한 공간에도 재난 위험은 존재합니다.</a>
                                                                <a href="#">숙련된 전문가의 손길로 안전하고 편리한 공간을 만들어야 공간의 고유한 가치를 높일 수 있습니다.</a>
                                                            </li>
                                                            <li class="prev">
                                                                <a href="#">공간의 가치를 새롭게 창조해 나가는 디지털 트윈 기술 기반 재난안전 전문 기업,</a>
                                                                <a href="#">(주)유엔이입니다.</a>
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
                                        <span className={home.skillSubTitle}>유엔이는 안전하고 편리한 공간을 만들고 관리하는<br></br>
                                            핵심원천기술을 보유하고 있습니다.
                                        </span>
                                        {/* <span className={home.skillSubTitle}>{Resource.ID.homeSkill.skillSubTitle2}</span> */}
                                        <div className={home.skillBox}>
                                            <div className={home.skill1}>
                                                <div className={home.iconAreaS1}>
                                                    <span></span>
                                                </div>
                                                <div className={home.skillTextBox1}>
                                                    <span className={home.skillTextTitle}>공간정보 구축</span>
                                                    <div className={home.skillContBox}>
                                                        <span>다양한 시설의 특수성과</span>
                                                        <span>서비스 확장성을 지원 가능한</span>
                                                        <span>저용량ㆍ고품질의</span>
                                                        <span>실내외 공간정보를 구축합니다.</span>
                                                    </div>
                                                </div>
                                                <div className={home.moreView1Area}>
                                                    <span className={home.moreViewS1}>
                                                        <a href="performanceSection#sectionInforBuild">자세히 보기</a>
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
                                                        <span>문서 형식의 표준행동절차를</span>
                                                        <span>디지털화 및 시스템에 적용해</span>
                                                        <span>재난상황의 빠른 전파ㆍ대응과</span>
                                                        <span>의사결정을 지원합니다.</span>
                                                        <span></span>
                                                    </div>
                                                </div>
                                                <span className={home.moreViewS2}><a href="performanceSection#sectionESOP">자세히 보기</a></span>
                                            </div>
                                            <div className={home.skill3}>
                                                <div className={home.iconAreaS3}>
                                                    <span></span>
                                                </div>
                                                <div className={home.skillTextBox3}>
                                                    <span className={home.skillTextTitle3}>데이터 시각화</span>
                                                    <div className={home.skillContBox3}>
                                                        <span>2Dㆍ3D 공간정보와</span>
                                                        <span>여러 유형의 IoTㆍ센서 정보를</span>
                                                        <span>결합하고 사용자가 직관적으로</span>
                                                        <span>이해하도록 시각화합니다.</span>
                                                        <span></span>
                                                    </div>
                                                </div>
                                                <span className={home.moreViewS3}><a href="performanceSection#sectionData">자세히 보기</a></span>
                                            </div>
                                            <div className={home.skill4}>
                                                <div className={home.iconAreaS4}>
                                                    <span></span>
                                                </div>
                                                <div className={home.skillTextBox4}>
                                                    <span className={home.skillTextTitle4}>시스템 연계통합</span>
                                                    <div className={home.skillContBox4}>
                                                        <span>공공ㆍ민간의 기존 시스템 및</span>
                                                        <span>서로 다른 프로토콜로 동작하는</span>
                                                        <span>센서들을 연계, 통합하여</span>
                                                        <span>웹 서비스, 플랫폼을 구축합니다.</span>
                                                        <span></span>
                                                    </div>
                                                </div>
                                                <span className={home.moreViewS4}><a href="performanceSection#sectionSystem">자세히 보기</a></span>
                                            </div>
                                        </div>
                                    </div>
                                </Slide>
                                <Slide id={home.section3}>
                                    <div className={home.uBusiness}>
                                        <span className={home.introBSubTitle}>
                                            <span>유엔이는 창사 이래 안전관리 솔루션·컨설팅 및</span>
                                            <span>디지털 트윈 응용 솔루션 사업에 특화·집중하고 있습니다.</span>
                                        </span>
                                        <div className={home.introBBox}>
                                            <div className={home.introBFlex}>
                                                <span className={home.introBBoxArea1}>
                                                    <span className={home.introBIcon}></span>
                                                    <span className={home.introBTextBox}>
                                                        <span className={home.introBBoxText1}>안전관리</span>
                                                        <span className={home.introBBoxText2}>솔루션·컨설팅 사업</span>
                                                    </span>
                                                    <span className={home.introBContsBox}>
                                                        <span className={home.introBBoxText3}>여러 유형의 재난에 대해</span>
                                                        <span className={home.introBBoxText4}>다년간 축적된 재난안전기술 및</span>
                                                        <span className={home.introBBoxText5}>관리역량으로 맞춤형 솔루션</span>
                                                        <span className={home.introBBoxText6}>및 컨설팅을 제공합니다.</span>
                                                    </span>
                                                    <span className={home.moreView6}><a href="businessSection#sectionSafety">자세히 보기</a></span>
                                                </span>

                                                <span className={home.introBBoxArea2}>
                                                    <span className={home.introBIcon2}></span>
                                                    <span className={home.introBTextBox2}>
                                                        <span className={home.introBBoxText7}>디지털 트윈</span>
                                                        <span className={home.introBBoxText8}>응용 솔루션 사업</span>
                                                    </span>
                                                    <span className={home.introBContsBox2}>
                                                        <span className={home.introBBoxText9}>실내외 공간의 높은 이해와</span>
                                                        <span className={home.introBBoxText10}>IoT 센서 통합모니터링 기술로</span>
                                                        <span className={home.introBBoxText11}>3D 기반 디지털 트윈 응용</span>
                                                        <span className={home.introBBoxText12}>솔루션을 고객에게 제공합니다.</span>
                                                    </span>
                                                    <span className={home.moreView7}><a href="businessSection#sectionDigital">자세히 보기</a></span>
                                                </span>

                                                <span className={home.introBBoxArea3}>
                                                    <span className={home.introBIcon3}></span>
                                                    <span className={home.introBTextBox3}>
                                                        <span className={home.introBBoxText13}>주요실적/고객사</span>
                                                        <span className={home.introBBoxText14}></span>
                                                    </span>
                                                    <span className={home.introBContsBox3}>
                                                        <span className={home.introBBoxText15}>10년 이상의 사업수행을 통해</span>
                                                        <span className={home.introBBoxText16}>공공 및 민간 분야의</span>
                                                        <span className={home.introBBoxText17}>여러 고객들이 유엔이의</span>
                                                        <span className={home.introBBoxText18}>솔루션을 이용하고 계십니다.</span>
                                                    </span>
                                                    <span className={home.moreView8}><a href="businessSection#sectionPerformance">자세히 보기</a></span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Slide>
                                <Slide id={home.section4}>
                                    <div className={home.contactMainBoxM}>
                                        <div className={home.InquiryAreaM}>
                                            <span className={home.contactSideTitle}>유엔이의 기술과 사업이 궁금하신가요? 언제든지 문의해 주십시오</span>
                                            <div className={home.conFirstBoxM}>
                                                <span className={home.conKindNameM}>문의 종류</span>
                                                {
                                                    <>
                                                        {/* 게시할때 아래 코드 사용할것 */}
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
                                            <div className={home.conSecondBoxM}>
                                                <div className={home.conLeftBoxM}>
                                                    <span className={home.conLeftTBox}>
                                                        <span className={home.companyNameM}>회사명</span>
                                                        <span className={home.companyNameSelect}>* 선택</span>
                                                    </span>
                                                    <input type="text" ref={this.refCompany} className={home.contactCompanyBoxM} placeholder="회사명을 입력하여 주십시오." /* onClick={this.chkValue} */ required />
                                                </div>
                                                <div className={home.conMiddleBoxM}>
                                                    <span className={home.conPeopleNameM}>성함</span>
                                                    <input type="text" ref={this.refName} id="tt" className={home.contactNameBoxM} placeholder="성함을 입력하여 주십시오." onClick={this.statusChange} />
                                                </div>
                                                <div className={home.conRightBoxM}>
                                                    <span className={home.contactEmailM}>이메일</span>
                                                    <input type="text" ref={this.refEmail} className={home.contactEmailBoxM} placeholder="이메일을 입력하여 주십시오." />
                                                </div>
                                            </div>
                                            <div className={home.conThirdBoxM}>
                                                <span className={home.InquiryContentsM}>문의 내용</span>
                                                <textarea ref={this.refMemo} className={home.contactTextBoxMemoM} type="text" placeholder="문의 내용을 입력하여 주십시오."></textarea>
                                            </div>
                                            <div className={home.conFourthBoxM}>
                                                <div className={home.conInputArea}>
                                                    {/* <label><input ref={this.refCheckbox} class="checkTest" type="checkbox" name="color" value="red" onClick={this.checkTest} id="aaa" /><p class="inputText">개인정보 취급 방침에 동의합니다.</p></label> */}
                                                    <input type="checkbox" ref={this.refCheckbox} class="checkTest" id="check1" name="color" value="red" onClick={this.checkTest} /><label htmlFor={"check1"}></label><p class="inputTextM">개인정보 취급방침에 동의합니다.</p>
                                                    <span className={home.personalInforM} id="popupDom" onClick={() => this.openPopup3()}>개인정보처리방침 보기</span>
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
                                </Slide>
                                <Slide id={home.section5}>
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

export default HomeKor;

