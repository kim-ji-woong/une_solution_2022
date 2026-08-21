import React, { Component } from 'react';
import { Link } from "react-router-dom";
import pIntro from '../ProductIntro/css/product.module.css';

import cIntro from '../CompanyIntro/css/company.module.css';
import bIntro from '../BusinessIntro/css/business.module.css';
import home from '../components/css/home.module.css';
import $ from 'jquery';

import { ProductSectionComponent } from './css/ProductSectionStyled';

import card_image1 from './image/card_image1.svg';
import card_image2 from './image/card_image2.svg';
import card_image3 from './image/card_image3.svg';
import gif1 from './image/gif1.gif';
import gif2 from './image/gif2.gif';
import gif3 from './image/gif3.gif';
import tab2_img1 from './image/tab2_img1.png';
import tab2_img2 from './image/tab2_img2.png';
import tab2_img3 from './image/tab2_img3.png';
import tab3_img1 from './image/tab3_img1.png';
import tab3_img2 from './image/tab3_img2.png';
import tab2_img_icon1 from './image/tab2_img_icon1.png';
import tab2_img_icon2 from './image/tab2_img_icon2.png';
import tab2_img_icon3 from './image/tab2_img_icon3.png';
import tab3_img_icon1 from './image/tab3_img_icon1.png';
import tab3_img_icon2 from './image/tab3_img_icon2.png';
import web_1_1 from './image/web_1_1.png';
import web_1_2 from './image/web_1_2.png';
import web_1_3 from './image/web_1_3.png';
import web_2_1 from './image/web_2_1.png';
import web_2_2 from './image/web_2_2.png';
import web_2_3 from './image/web_2_3.png';
import web_2_4 from './image/web_2_4.png';
import web_3_1 from './image/web_3_1.png';
import web_3_2 from './image/web_3_2.png';
import web_3_3 from './image/web_3_3.png';
import web_3_4 from './image/web_3_4.png';
import web_4_1 from './image/web_4_1.png';
import web_4_2 from './image/web_4_2.png';
import web_4_3 from './image/web_4_3.png';
import info_icon1 from './image/info_icon1.svg';
import info_icon2 from './image/info_icon2.svg';
import roadmap_img1 from './image/roadmap_img1.svg';
import roadmap_img2 from './image/roadmap_img2.svg';
import roadmap_img3 from './image/roadmap_img3.svg';

import protecto_video from './video/protecto.mp4';
import protecto_poster from './video/protecto_poster.png';

import AOS from "aos";
import "aos/dist/aos.css";
//import Resource from '../resource/id';

class ProductSectionKor extends Component {
    static displayName = ProductSectionKor.name;

    constructor(props) {
        super(props);

        this.state = {
            tabContent: 1,
            isMobileView: window.innerWidth <= 1359,  // 초기 화면 크기 체크
            webImgIndex1: 0,
            webImgIndex2: 0,
            webImgIndex3: 0,
            webImgIndex4: 0
        }

        this.webImgList1 = [web_1_1, web_1_2, web_1_3];
        this.webImgList2 = [web_2_1, web_2_2, web_2_3, web_2_4];
        this.webImgList3 = [web_3_1, web_3_2, web_3_3, web_3_4];
        this.webImgList4 = [web_4_1, web_4_2, web_4_3];

        this.state.disProductUI = this.displayProductUI;
    }

    resizeUI() {
        this.setState({ disProductUI: this.displayProductUI() });
    }

    componentDidMount() {
        $(document).ready(function () {
            AOS.init();
        });

        $('.' + pIntro.dropdown).mouseover(function () {
            $('.' + pIntro.dropdownContent).show();
        });

        $('.' + pIntro.cMenu).mouseleave(function () {
            $('.' + pIntro.dropdownContent).hide();
        });

        $('#dropdownContent').click(function () {
            $('#dropdownContent span').hide();
        });

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
                if ($(this).scrollTop() > 8000) {
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

        window.addEventListener('resize', this.handleResize);

        if (!this.state.isMobileView) {
            this.startTabRotation();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        clearInterval(this.interval);
    }

    handleResize = () => {
        const isMobile = window.innerWidth <= 768;

        if (isMobile !== this.state.isMobileView) {
            this.setState({ isMobileView: isMobile }, () => {
                if (isMobile) {
                    clearInterval(this.interval);
                } else {
                    this.startTabRotation();
                }
            });
        }
    };

    startTabRotation = () => {
        clearInterval(this.interval);

        // folder section 5초마다 탭 이동
        this.interval = setInterval(() => {
            this.setState((prevState) => ({
                tabContent: prevState.tabContent === 3 ? 1 : prevState.tabContent + 1,
            }));
        }, 20000);
    };

    onChangeTabContent = (tabNumber) => {
        if (this.state.tabContent !== tabNumber) {
            if (this.state.tabContent === 4) {
                this.interval = setInterval(() => {
                    this.setState((prevState) => ({
                        tabContent: prevState.tabContent === 3 ? 1 : prevState.tabContent + 1,
                    }));
                }, 20000);
            }
            else if (tabNumber === 4) {
                clearInterval(this.interval);
            }

            this.setState({ tabContent: tabNumber });
        }
    }

    downloadFile = () => {
        const fileUrl = '/resource/protecto_info.pdf'; // 다운로드할 파일 경로
        const fileName = 'PROTECTO_제품소개서.pdf'; // 저장될 파일 이름
    
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    onChangeWebImg = (section, action) => {
        const key = `webImgIndex${section}`;

        this.setState(prevState => ({
            [key]: action ? prevState[key] + 1 : prevState[key] - 1
        }));
    };

    render() {
        const { tabContent, isMobileView, webImgIndex1, webImgIndex2, webImgIndex3, webImgIndex4 } = this.state;

        return (
            <ProductSectionComponent className={cIntro.contentBox}>
                <div className='header'>
                    <span data-aos="fade-down" data-aos-duration="1000">PROTECTO</span>
                    <span data-aos="fade-down" data-aos-duration="1000">빠르고 유연하며 기능적인 디지털 트윈 통합 모니터링 플랫폼 프로텍토를 소개합니다.</span>
                </div>

                <div className='body'>
                    <span className='contentBox'>
                        <span className='title' data-aos="fade-down" data-aos-duration="1000">About Us</span>
                        <div className='content'>
                            <h1>
                                프로텍토는 고객의 업무 현장과 설비, 센서를 디지털 트윈으로 손쉽게 통합하고 실시간 모니터링하여<br />
                                현장 상황 대처 및 사고 발생 시 빠르게 대응할 수 있도록 도와주는 <span className='highlight'>SaaS 기반 통합 모니터링 플랫폼</span> 입니다.
                            </h1>
                            <ul className='cardsWrap'>
                                <li className='card' data-aos="zoom-in" data-aos-duration="500">
                                    <p>콘텐츠 구축</p>
                                    <div>
                                        <img src={card_image1} alt='콘텐츠 구축 이미지' />
                                        <div className='description'>
                                            <p className='head'>기본 콘텐츠 구축</p>
                                            <p className='substance'>고객 보유 데이터를 활용해 현장공간 구축</p>
                                            <p className='substance'>설비/센서 연동에 필요한 관리정보 입력</p>
                                            <p className='substance'>통합 모니터링을 위한 서비스 콘텐츠 구축</p>
                                        </div>
                                    </div>
                                </li>
                                <li className='card' data-aos="zoom-in" data-aos-duration="1000">
                                    <p>수집 및 분석</p>
                                    <div>
                                        <img src={card_image2} alt='수집 및 분석 이미지' />
                                        <div className='description'>
                                            <p className='head'>데이터 수집 및 분석</p>
                                            <p className='substance'>연계 센서/설비 현황 수집 및 알람 전송</p>
                                            <p className='substance'>기간별 센서/설비 데이터 분석</p>
                                            <p className='substance'>수집 데이터 중 이상치 정보 감지 알림</p>
                                        </div>
                                    </div>
                                </li>
                                <li className='card' data-aos="zoom-in" data-aos-duration="1500">
                                    <p>통합 모니터링</p>
                                    <div>
                                        <img src={card_image3} alt='통합 모니터링 이미지' />
                                        <div className='description'>
                                            <p className='head'>통합 안전관리 모니터링</p>
                                            <p className='substance'>공간정보 기반 시각화 및 통합 대시보드 제공</p>
                                            <p className='substance'>효율적인 현장 모니터링 UI/UX 제공</p>
                                            <p className='substance'>현장의 실시간 정보에 기반한 안전관리 모니터링</p>
                                        </div>
                                    </div>
                                </li>
                            </ul> 
                        </div>

                        <div className='content'>
                            <h1>
                                다수의 공공 및 민간 사업으로 검증된 기술 역량을 토대로 확보한<br />
                                신속함과 유연함, 기능성을 제공하여 <span className='highlight'>고객의 효율적인 현장 관제를 지원하고 사고대응의 골든타임을 확보</span>합니다.
                            </h1>
                            <ul className='gifWrap'>
                                <li className='item'>
                                    <img src={gif1} alt='신속성 이미지' />
                                    <div className='description'>
                                        <p className='head'>신속성</p>
                                        <p className='substance'>{`고객의 보유정보를 활용한\n통합 모니터링 서비스의 빠른 구축 및 운영`}</p>
                                    </div>
                                </li>
                                <li className='item'>
                                    <img src={gif2} alt='유연성 이미지' />
                                    <div className='description'>
                                        <p className='head'>유연성</p>
                                        <p className='substance'>{`고객 현황 및 요구사항을 고려한\n응용 서비스 커스터마이징 및 확장 지원`}</p>
                                    </div>
                                </li>
                                <li className='item'>
                                    <img src={gif3} alt='기능성 이미지' />
                                    <div className='description'>
                                        <p className='head'>기능성</p>
                                        <p className='substance'>{`효과적인 통합 모니터링을 위한\n운영관리 서비스 및 고성능 프레임워크 제공`}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <span className='title' data-aos="fade-down" data-aos-duration="1000">Main Services</span>
                        <div className='content'>
                            <h1>
                                프로텍토는 고객의 신속하고 효율적인 디지털 트윈 기반 통합 모니터링을 위한<br />
                                <span className='highlight'>공간정보 편집 및 저작, 설비/센서 및 고객 정보 운영관리, 3D 공간기반 실시간 관제 서비스, SOP 기반 사고대응 서비스를 제공</span>합니다.
                            </h1>
                            {
                                isMobileView ? (
                                    <div className='folderWrap moblie'>
                                        <div className='moblieItem first'>
                                            <h1>01 구축 의뢰</h1>
                                            <h2>현장현황과 사고예방 및 대응을 위한</h2>
                                            <h2><span className='highlight'>통합 모니터링 플랫폼</span> 구축 의뢰</h2>
                                            <ul className='checklist'>
                                                <li>“최대한 빠른 시간 내 인터넷에서 현장 모니터링이 필요합니다.”</li>
                                                <li>“우리가 보유한 도면을 활용해서 실제 현장처럼 보여야 합니다.”</li> 
                                                <li>“현장에 설치된 센서와 설비, CCTV 정보를 실시간으로 봐야 합니다.”</li> 
                                                <li>“현장 상황 이나 사고 발생 시 즉각 인지할 수 있어야 합니다.”</li> 
                                            </ul>
                                        </div>
                                        <div className='moblieItem second'>
                                            <h1>02 데이터 및 공간 생성</h1>
                                            <h2><span className='highlight'>저작 및 관리 서비스</span>를 통해</h2>
                                            <h2>기본 데이터 입력 및 공간 정보 생성</h2>
                                            <ul>
                                                <li> 
                                                    <img src={tab2_img_icon1} alt='운영관리 서비스 아이콘' data-aos="fade-up" data-aos-duration="600" />
                                                    <p>운영관리 서비스</p>
                                                    <p>운영정보 입력 및 관리</p>
                                                </li>
                                                <li>
                                                    <img src={tab2_img_icon2} alt='공간편집 및 저작도구 아이콘' data-aos="fade-up" data-aos-duration="600" />
                                                    <p>공간편집 및 저작도구</p>
                                                    <p>공간 저작 및 센서/설비 배치 관리</p>
                                                </li>
                                                <li>
                                                    <img src={tab2_img_icon3} alt='SOP 편집 아이콘' data-aos="fade-up" data-aos-duration="600" />
                                                    <p>SOP 편집</p>
                                                    <p>상황대응 SOP 편집 및 관리</p>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className='moblieItem third'>
                                            <h1>03 통합 모니터링</h1>
                                            <h2><span className='highlight'>모니터링 서비스</span>를 통해</h2>
                                            <h2>관리 및 입력 데이터 정보를 통합 모니터링</h2>
                                            <ul>
                                                <li>
                                                    <img src={tab3_img_icon1} alt='관제 서비스 아이콘' data-aos="fade-up" data-aos-duration="600" />
                                                    <p>관제 서비스</p>
                                                    <p>3D 기반 실시간 현황 모니터링</p>
                                                </li>
                                                <li>
                                                    <img src={tab3_img_icon2} alt='SOP 서비스 아이콘' data-aos="fade-up" data-aos-duration="600" />
                                                    <p>SOP 서비스</p>
                                                    <p>사고 및 상황 발생 시 대응 및 전파</p>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className='moblieItem fourth'>
                                            <h1>소개 동영상</h1>
                                            <video src={protecto_video} poster={protecto_poster} preload="auto" controls controlsList="nodownload" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className='folderWrap'>
                                        <nav className='tabs'>
                                            <div>
                                                <span className={`tab ${tabContent === 1 && 'active'}`} onClick={() => this.onChangeTabContent(1)}>01 구축의뢰</span>
                                                <span className={`tab ${tabContent === 2 && 'active'}`} onClick={() => this.onChangeTabContent(2)}>02 데이터 및 공간 생성</span>
                                                <span className={`tab ${tabContent === 3 && 'active'}`} onClick={() => this.onChangeTabContent(3)}>03 통합 모니터링</span>
                                            </div>
                                            <div>
                                                <span className={`tab ${tabContent === 4 && 'active'}`} onClick={() => this.onChangeTabContent(4)}>소개 동영상</span>
                                            </div>
                                        </nav>
                                        {
                                            tabContent === 1 &&
                                                <div className='item first'>
                                                    <h2>현장현황과 사고예방 및 대응을 위한</h2>
                                                    <h2><span className='highlight'>통합 모니터링 플랫폼</span> 구축 의뢰</h2>
                                                    <ul className='checklist'>
                                                        <li>“최대한 빠른 시간 내 인터넷에서 현장 모니터링이 필요합니다.”</li>
                                                        <li>“우리가 보유한 도면을 활용해서 실제 현장처럼 보여야 합니다.”</li> 
                                                        <li>“현장에 설치된 센서와 설비, CCTV 정보를 실시간으로 봐야 합니다.”</li> 
                                                        <li>“현장 상황 이나 사고 발생 시 즉각 인지할 수 있어야 합니다.”</li> 
                                                    </ul>
                                                </div>
                                        }
                                        {
                                            tabContent === 2 &&
                                                <div className='item second'>
                                                    <h2><span className='highlight'>저작 및 관리 서비스</span>를 통해</h2> 
                                                    <h2>기본 데이터 입력 및 공간 정보 생성</h2>
                                                    <ul>
                                                        <li> 
                                                            <img src={tab2_img1} alt='운영관리 서비스 이미지' />
                                                            <img src={tab2_img_icon1} alt='운영관리 서비스 아이콘' data-aos="fade-up" data-aos-duration="600" />
                                                            <p>운영관리 서비스</p>
                                                            <p>운영정보 입력 및 관리</p>
                                                        </li>
                                                        <li>
                                                            <img src={tab2_img2} alt='공간편집 및 저작도구 이미지' />
                                                            <img src={tab2_img_icon2} alt='공간편집 및 저작도구 아이콘' data-aos="fade-up" data-aos-duration="600" />
                                                            <p>공간편집 및 저작도구</p>
                                                            <p>공간 저작 및 센서/설비 배치 관리</p>
                                                        </li>
                                                        <li>
                                                            <img src={tab2_img3} alt='SOP 편집 이미지' />
                                                            <img src={tab2_img_icon3} alt='SOP 편집 아이콘' data-aos="fade-up" data-aos-duration="600" />
                                                            <p>SOP 편집</p>
                                                            <p>상황대응 SOP 편집 및 관리</p>
                                                        </li>
                                                    </ul>
                                                </div>
                                        }
                                        {
                                            tabContent === 3 &&
                                                <div className='item third'>
                                                    <h2><span className='highlight'>모니터링 서비스</span>를 통해</h2>
                                                    <h2>관리 및 입력 데이터 정보를 통합 모니터링</h2>
                                                    <ul>
                                                        <li>
                                                            <img src={tab3_img1} alt='관제 서비스 이미지' />
                                                            <img src={tab3_img_icon1} alt='관제 서비스 아이콘' data-aos="fade-up" data-aos-duration="600" />
                                                            <p>관제 서비스</p>
                                                            <p>3D 기반 실시간 현황 모니터링</p>
                                                        </li>
                                                        <li>
                                                            <img src={tab3_img2} alt='SOP 서비스 이미지' />
                                                            <img src={tab3_img_icon2} alt='SOP 서비스 아이콘' data-aos="fade-up" data-aos-duration="600" />
                                                            <p>SOP 서비스</p>
                                                            <p>사고 및 상황 발생 시 대응 및 전파</p>
                                                        </li>
                                                    </ul>
                                                </div>
                                        }
                                        {
                                            tabContent === 4 &&
                                                <div className='item fourth'>
                                                    <video src={protecto_video} poster={protecto_poster} preload="auto" controls controlsList="nodownload" />
                                                </div>
                                        }
                                    </div>
                                )
                            }
                        </div>

                        <div className='content'>
                            <ul className='pageWrap'>
                                <li>
                                    <h2>공간편집 및 저작도구<span className='highlight'>Spacebuilder</span></h2>
                                    <h3>고객이 보유한 건물 도면과 센서/설비 정보를 이용해 <span className='highlight'>실내외 공간을 3D로 생성 및 편집</span>합니다.</h3>
                                    <div className='content'>
                                        <div className='imgWrap'>
                                            <img src={this.webImgList1[webImgIndex1]} alt='공간편집 및 저작도구 화면 이미지' />
                                            {
                                                webImgIndex1 > 0 &&
                                                    <button className='prev' onClick={() => this.onChangeWebImg(1, false)}>이전으로</button>
                                            }
                                            {
                                                webImgIndex1 < this.webImgList1.length - 1 &&
                                                    <button className='next' onClick={() => this.onChangeWebImg(1, true)}>다음으로</button>
                                            }
                                        </div>
                                        <div className='card'>
                                            <p>체크 포인트</p>
                                            <div className='description'>
                                                <p className='substance'>{`고객사가 보유한 CAD/BIM 데이터\n기반의 공간 구축`}</p>
                                                <p className='substance'>{`실내 공간의 문,창문, 벽체 등을\n자유롭게 배치 및 편집`}</p>
                                                <p className='substance'>{`센서 및 설비, CCTV POI를 배치하여\n현장과 일치하는 모니터링 환경 구축`}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <h2>운영관리 서비스<span className='highlight'>Operation & Management Service</span></h2>
                                    <h3>현장 안전관리 모니터링 운영을 위해 고객의 <span className='highlight'>공간과 센서/설비, 사용자/조직 정보를 편집 및 관리</span>합니다.</h3>
                                    <div className='content'>
                                        <div className='imgWrap'>
                                            <img src={this.webImgList2[webImgIndex2]} alt='운영관리 서비스 화면 이미지' />
                                            {
                                                webImgIndex2 > 0 &&
                                                    <button className='prev' onClick={() => this.onChangeWebImg(2, false)}>이전으로</button>
                                            }
                                            {
                                                webImgIndex2 < this.webImgList2.length - 1 &&
                                                    <button className='next' onClick={() => this.onChangeWebImg(2, true)}>다음으로</button>
                                            }
                                        </div>
                                        <div className='card'>
                                            <p>체크 포인트</p>
                                            <div className='description'>
                                                <p className='substance'>{`고객 사이트 및 사용자, 조직정보를\n등록 및 관리`}</p>
                                                <p className='substance'>{`모니터링 할 센서/설비 정보를\n등록 및 관리`}</p>
                                                <p className='substance'>{`실시간 영상을 조회할 CCTV 정보를\n등록 및 관리`}</p>
                                                <p className='substance'>{`모니터링에 대한 이력 및 로그 관리`}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <h2>관제 서비스<span className='highlight'>Monitoring Service</span></h2>
                                    <h3>구축된 3D 실내외 공간에서 센서/설비/CCTV로 현장 상황을 <span className='highlight'>실시간으로 모니터링</span>합니다.</h3>
                                    <div className='content'>
                                        <div className='imgWrap'>
                                            <img src={this.webImgList3[webImgIndex3]} alt='관제 서비스 화면 이미지' />
                                            {
                                                webImgIndex3 > 0 &&
                                                    <button className='prev' onClick={() => this.onChangeWebImg(3, false)}>이전으로</button>
                                            }
                                            {
                                                webImgIndex3 < this.webImgList3.length - 1 &&
                                                    <button className='next' onClick={() => this.onChangeWebImg(3, true)}>다음으로</button>
                                            }
                                        </div>
                                        <div className='card'>
                                            <p>체크 포인트</p>
                                            <div className='description'>
                                                <p className='substance'>{`현재 상황을 반영한 3D 기반의 실내외\n공간 속 통합 모니터링 제공`}</p>
                                                <p className='substance'>{`현장 센서/설비 정보 및 CCTV 영상을\n기반으로 실시간 모니터링`}</p>
                                                <p className='substance'>{`다년간의 사용자 경험을 반영한\n대시보드로 직관적인 현황확인 및 대응`}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <h2>SOP 편집 및 서비스<span className='highlight'>SOP Service</span></h2>
                                    <h3>사고나 비상상황이 발생한 경우, 유형별 <span className='highlight'>SOP(표준행동요령)를 저작 및 자동 실행하여 신속대응</span>합니다.</h3>
                                    <div className='content'>
                                        <div className='imgWrap'>
                                            <img src={this.webImgList4[webImgIndex4]} alt='SOP 편집 및 서비스 화면 이미지' />
                                            {
                                                webImgIndex4 > 0 &&
                                                    <button className='prev' onClick={() => this.onChangeWebImg(4, false)}>이전으로</button>
                                            }
                                            {
                                                webImgIndex4 < this.webImgList4.length - 1 &&
                                                    <button className='next' onClick={() => this.onChangeWebImg(4, true)}>다음으로</button>
                                            }
                                        </div>
                                        <div className='card'>
                                            <p>체크 포인트</p>
                                            <div className='description'>
                                                <p className='substance'>{`순서도 방식의 GUI로 대응요령을\n편리하게 생성 및 편집`}</p>
                                                <p className='substance'>{`사고 유형에 따른 단계별 상세임무와\n대응 상세정보를 지정`}</p>
                                                <p className='substance'>{`문자/방송/이메일 등 다양한 매체를\n통한 사고대응 및 상황전파`}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <span className='title' data-aos="fade-down" data-aos-duration="1000">Reference</span>
                        <div className='content'>
                            <h1>
                                프로텍토는 제조기업 및 공장 같은 민간영역에서부터<br />
                                국가 산업단지 등 공공영역까지 <span className='highlight'>폭넓은 활용 및 지원</span>이 가능합니다.
                            </h1>
                            <div className='referenceWrap'>
                                <div>
                                    <p>민간영역</p>
                                    <span data-aos="fade-right" />
                                    <p>{`제조기업의 공장 및 중소규모 건물, 초고층 빌딩 속 실내공간을\n빠르고 효과적으로 구축하여 모니터링 할 수 있습니다.`}</p>
                                </div>
                                <ul>
                                    <li data-aos="flip-up" data-aos-duration="500">
                                        <p>초고층 빌딩</p>
                                    </li>
                                    <li data-aos="flip-up" data-aos-duration="800">
                                        <p>공장</p>
                                    </li>
                                    <li data-aos="flip-up" data-aos-duration="1100">
                                        <p>제조기업</p>
                                    </li>
                                    <li data-aos="flip-up" data-aos-duration="1400">
                                        <p>데이터 센터</p>
                                    </li>
                                    <li data-aos="flip-up" data-aos-duration="1700" >
                                        <p>전시장</p>
                                    </li>
                                </ul>
                            </div>
                            <div className='referenceWrap'>
                                <ul>
                                    <li data-aos="flip-up" data-aos-duration="1700">
                                        <p>전통시장</p>
                                    </li>
                                    <li data-aos="flip-up" data-aos-duration="1400">
                                        <p>지하공동구</p>
                                    </li>
                                    <li data-aos="flip-up" data-aos-duration="1100">
                                        <p>발전소</p>
                                    </li>
                                    <li data-aos="flip-up" data-aos-duration="800">
                                        <p>스마트 시티</p>
                                    </li>
                                    <li data-aos="flip-up" data-aos-duration="500" >
                                        <p>국가 산단</p>
                                    </li>
                                </ul> 
                                <div>
                                    <p>공공영역</p> 
                                    <span data-aos="fade-left" />
                                    <p>{`다양한 요구사항과 구축 범위를 만족시켜야 하는 공공 분야는\n축적된 사업경험에 기반한 최적화를 진행하여 고객 만족을 제공합니다.`}</p>
                                </div>
                            </div>
                        </div>

                        <span className='title' data-aos="fade-down" data-aos-duration="1000">Roadmap</span>
                        <div className='content'>
                            <h1>
                                24년 12월 v1.0을 최초 릴리즈 후 25년까지 <span className='highlight'>구독형 SaaS로 전환</span> 예정입니다.
                            </h1>
                            <div className='cardsContainer'>
                                <ul className='cardsWrap second'>
                                    <li className='card' data-aos="zoom-in" data-aos-duration="500">
                                        <p>Release v1.0</p>
                                        <div>
                                            <img src={roadmap_img1} alt='Release v1.0 이미지' />
                                            <div className='description'>
                                                <p className='head_roadmap'>플랫폼 최초 릴리즈</p>
                                                <p className='substance'>공통 프레임워크 구축</p>
                                                <p className='substance'>디지털 트윈 통합 모니터링 플랫폼 개발</p>
                                                <p className='substance'>구독형 SaaS 전환</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li className='card' data-aos="zoom-in" data-aos-duration="1000">
                                        <p>Release v2.0</p>
                                        <div>
                                            <img src={roadmap_img2} alt='Release v2.0 이미지' />
                                            <div className='description'>
                                                <p className='head_roadmap'>플랫폼 서비스 추가</p>
                                                <p className='substance'>센서 AI분석 및 내방객 분석 서비스 개발</p>
                                                <p className='substance'>산업안전보건관리 서비스 추가 (스마플)</p>
                                                <p className='substance'>핵심 고객사 요청 서비스 반영</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li className='card' data-aos="zoom-in" data-aos-duration="1500">
                                        <p>Release v3.0</p>
                                        <div>
                                            <img src={roadmap_img3} alt='Release v3.0 이미지' />
                                            <div className='description'>
                                                <p className='head_roadmap'>플랫폼 서비스 고도화</p>
                                                <p className='substance'>공통 프레임워크 고도화</p>
                                                <p className='substance'>디지털 트윈 통합 모니터링 플랫폼 고도화</p>
                                                <p className='substance'>산업안전보건관리 서비스 고도화 (스마플)</p>
                                            </div>
                                        </div>
                                    </li>
                                </ul> 
                                <p className='cardDescription'>*V2.0 이후의 릴리즈 계획은 당사의 개발 일정에 따라 변경될 수 있습니다.</p>
                            </div>
                        </div>

                        <div className='content'>
                            <h1>
                                PROTECTO에 대해 더 알고싶으신가요?<br />
                                <span className='highlight'>아래 버튼을 눌러보세요!</span>
                            </h1>
                            <ul className='infoWrap'>
                                <li data-aos="zoom-in" data-aos-duration="500">
                                    <div className='imgArea'>
                                        <img src={info_icon1} alt='다운로드 아이콘' />
                                    </div>
                                    <div className='infoArea'>
                                        <p>제품 소개서 다운로드</p>
                                        <p>프로텍토의 구조와 기능, 적용 시나리오 및
                                        활용 방안에 대해 더욱 자세히 설명합니다.</p>
                                        <button onClick={() => this.downloadFile()}>다운로드 하기</button>
                                    </div>
                                </li>
                                <li data-aos="zoom-in" data-aos-duration="1000">
                                    <div className='imgArea'>
                                        <img src={info_icon2} alt='제품문의 아이콘' />
                                    </div>
                                    <div className='infoArea'>
                                        <p>제품 문의</p>
                                        <p>프로텍토 사용/도입 관련 문의 및 사업화,
                                        파트너십 제안 등을
                                        언제든지 문의하실 수 있습니다.</p>
                                        <button onClick={() => (window.location.href = "contactSection#sectionInquiry")}>문의하기</button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </span>
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
                        </div>
                    </div>
                </div>
            </ProductSectionComponent>
        );
    }
}

export default ProductSectionKor;