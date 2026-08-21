import React, { Component } from 'react';
import { Link } from "react-router-dom";
import cIntro from '../CompanyIntro/css/company.module.css';
import bIntro from '../BusinessIntro/css/business.module.css';
import home from '../components/css/home.module.css';
import $ from 'jquery';

import AOS from "aos";
import "aos/dist/aos.css";
import Resource from '../resource/id';


class PerformanceSectionKor extends Component {
    static displayName = PerformanceSectionKor.name;

    constructor(props) {
        super(props);

        this.state = {

        }

        this.state.disPerformanceUI = this.displayPerformanceUI;
    }

    resizeUI() {
        this.setState({ disPerformanceUI: this.displayPerformanceUI() });
    }

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
    }

    displayPerformanceUI = () => {
        let displayPerformanceUI = [];
        let widthSize = window.outerWidth;

        if (widthSize < 768) {
            displayPerformanceUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={bIntro.bIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">보유기술</span>
                            <span data-aos="fade-down" data-aos-duration="1000">유엔이가 보유한 안전관리 및 디지털 트윈 기술 역량과 관련 특허, 인증을 소개합니다.</span>
                        </div>
                        {/* 공간정보 구축 */}
                        <div id="sectionInforBuild">
                            <div className={bIntro.spatialInforContentsSect}>
                                <span className={bIntro.spatialTitle2} data-aos="fade-down" data-aos-duration="1000">공간정보 구축</span>
                                <div className={bIntro.spatialTextBoxTop}>
                                    <span className={bIntro.spatialTexts1}>
                                        WEB 및 C/S 환경에서 원활하게 동작하는<span className={bIntro.businessTextBold}>최적의 실내외 공간정보를 구축, 관리</span>합니다.
                                    </span>
                                    <span className={bIntro.spatialTexts2}>
                                        IndoorGML 기반의 데이터 체계로 기존 시스템 및 센서 연동, 서비스 확장이 용이하며
                                        3차원 공간 상에<span className={bIntro.businessTextBold}>LoD 4 기준 이상의 고품질 형상 정보</span>를 시각화할 수 있습니다.
                                    </span>
                                </div>
                                <div className={bIntro.spatialFlexBox}>
                                    <span className={bIntro.spatialImgBox}>
                                        <span className={bIntro.spatialInforImg}></span>
                                    </span>
                                    <span className={bIntro.spatialTextBox}>
                                        <div className={bIntro.spTarget1}>체크포인트</div>
                                        <div className={bIntro.spSubFlex1}>
                                            <span className={bIntro.spCheckIcon}></span>
                                            <span className={bIntro.spSubTitle1}>
                                                <p>2D 도면과 이미지를 이용하여 실내 공간 모델링 가능</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.spSubFlex2}>
                                            <span className={bIntro.spCheckIcon2}></span>
                                            <span className={bIntro.spSubTitle2}>
                                                <p>Google Sketch Up호환 및 Topology기반 국제표준 공간정보 모델링 구축 및 관리</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.spSubFlex3}>
                                            <span className={bIntro.spCheckIcon3}></span>
                                            <span className={bIntro.spSubTitle3}>
                                                <p>기존 BIM 데이터 대비 1/10수준의 경량화된 실내 모델링 구축 가능</p>
                                            </span>
                                        </div>
                                    </span>
                                </div>
                                {/* <span className={bIntro.spatialBottomText}>{Resource.ID.performanceSect1.spatialTexts19}</span> */}
                            </div>
                        </div>
                        {/* ESOP */}
                        <div id="sectionESOP">
                            <div className={bIntro.eSopContentsSect}>
                                <span className={bIntro.eSopTitle2} data-aos="fade-down" data-aos-duration="1000">E-SOP</span>
                                <div className={bIntro.eSopTextBoxTop}>
                                    <span className={bIntro.eSopTexts1}>
                                        도서,매뉴얼 형식의<span className={bIntro.businessTextBold}>기존 표준행동절차를 디지털화하여 IT 기반 재난대응</span>에 활용합니다.
                                    </span>
                                    <span className={bIntro.eSopTexts2}>
                                        재난유형별 훈련 대응과 함께 실제 상황 발생시<span className={bIntro.businessTextBold}>단계별 행동 요령을 안내</span>하고
                                        비상연락망을 통한 상황전파를 제공하여<span className={bIntro.businessTextBold}>신속하고 효율적인 재난 대응을 가능</span>하게 합니다.
                                    </span>
                                </div>
                                <div className={bIntro.eSopFlexBox}>
                                    <span className={bIntro.eSopImgBox}>
                                        <span className={bIntro.eSopImg}></span>
                                    </span>
                                    <span className={bIntro.eSopTextBox}>
                                        <div className={bIntro.eSopTarget1}>체크포인트</div>
                                        <div className={bIntro.eSopSubFlex1}>
                                            <span className={bIntro.eSopCheckIcon}></span>
                                            <span className={bIntro.eSopSubTitle1}>
                                                <p>표준행동절차를 GUI기반 SW로 생성, 편집하여 DB로 저장</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.eSopSubFlex2}>
                                            <span className={bIntro.eSopCheckIcon2}></span>
                                            <span className={bIntro.eSopSubTitle2}>
                                                <p>DB화된 표준행동절차를 통한 모의훈련 수행</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.eSopSubFlex3}>
                                            <span className={bIntro.eSopCheckIcon3}></span>
                                            <span className={bIntro.eSopSubTitle3}>
                                                <p>비상연락망 구축을 위한 조직관리 및 문자 방송, 카카오톡 등으로 상황전파</p>
                                            </span>
                                        </div>
                                    </span>
                                </div>
                                {/* <span className={bIntro.eSopBottomText}>{Resource.ID.esopSect2.esopTexts18}</span> */}
                            </div>
                        </div>
                        {/* 데이터 시각화 */}
                        <div id="sectionData">
                            <div className={bIntro.dataVisualContentsSect}>
                                <span className={bIntro.dataTitle2} data-aos="fade-down" data-aos-duration="1000">데이터 시각화</span>
                                <div className={bIntro.dataTextBoxTop}>
                                    <span className={bIntro.dataTexts1}>
                                        다양한 형식의<span className={bIntro.businessTextBold}>데이터를 공간정보와 융복합하여 가시화 및 모니터링</span>합니다.
                                    </span>
                                    <span className={bIntro.dataTexts2}>
                                        시스템에 저장된<span className={bIntro.businessTextBold}>업무정보 및 사용자 정보,</span>IoT 센서에서 수집된<span className={bIntro.businessTextBold}>실시간 모니터링 정보,</span>
                                        AI/빅데이터 기술에서 도출된<span className={bIntro.businessTextBold}>분석/예측 정보를 실내외 공간정보와 결합하여 시각화</span>하여
                                        이를 테이블/ 표, 이벤트 스트림 등<span className={bIntro.businessTextBold}>다양한 방식으로 표출</span>합니다.
                                    </span>
                                </div>
                                <div className={bIntro.dataFlexBox}>
                                    <span className={bIntro.dataImgBox}>
                                        <span className={bIntro.dataImg}></span>
                                    </span>
                                    <span className={bIntro.dataTextBox}>
                                        <div className={bIntro.dataTarget1}>체크포인트</div>
                                        <div className={bIntro.dataSubFlex1}>
                                            <span className={bIntro.dataCheckIcon}></span>
                                            <span className={bIntro.dataSubTitle1}>
                                                <p>DBMS 및 파일, Log에 저장된 업무 및 사용자 정보 시각화</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.dataSubFlex2}>
                                            <span className={bIntro.dataCheckIcon2}></span>
                                            <span className={bIntro.dataSubTitle2}>
                                                <p>IoT 센서에서 수집된 실시간 이벤트 스트림 정보 시각화</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.dataSubFlex3}>
                                            <span className={bIntro.dataCheckIcon3}></span>
                                            <span className={bIntro.dataSubTitle3}>
                                                <p>3D 공간 및 시설물과 결합하여 실시간 이벤트 및 과거 이력 시각화</p>
                                            </span>
                                        </div>
                                    </span>
                                </div>
                                {/* <span className={bIntro.dataBottomText}>{Resource.ID.dataSect3.dataTexts16}</span> */}
                            </div>
                        </div>
                        {/* 시스템 통합구축 */}
                        <div id="sectionSystem">
                            <div className={bIntro.systemLinkContentsSect}>
                                <span className={bIntro.systemTitle2} data-aos="fade-down" data-aos-duration="1000">시스템 연계통합</span>
                                <div className={bIntro.systemTextBoxTop}>
                                    <span className={bIntro.systemTexts1}>
                                        여러 산업분야에서 사용되는<span className={bIntro.businessTextBold}>시스템 및 센서, 데이터를 연계 및 통합 구축</span>합니다.
                                    </span>
                                    <span className={bIntro.systemTexts2}>
                                        고객이 사용중인<span className={bIntro.businessTextBold}>레거시 시스템 및 CCTV, 센서</span>와
                                        <span className={bIntro.businessTextBold}>신규 IoT 센서, 웹 서비스의 연계/ 통합</span>이 가능하며
                                        <span className={bIntro.businessTextBold}>API를 활용한 시스템 연계, 온프레미스의 클라우드 전환</span>을 지원합니다.
                                    </span>
                                </div>
                                <div className={bIntro.systemFlexBox}>
                                    <span className={bIntro.systemImgBox}>
                                        <span className={bIntro.systemImg}></span>
                                    </span>
                                    <span className={bIntro.systemTextBox}>
                                        <div className={bIntro.systemTarget1}>체크포인트</div>
                                        <div className={bIntro.systemSubFlex1}>
                                            <span className={bIntro.systemCheckIcon}></span>
                                            <span className={bIntro.systemSubTitle1}>
                                                <p>화재, 누출, 지진 등 개별 프로토콜로 동작하는 센서 연동 서버 구축</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.systemSubFlex2}>
                                            <span className={bIntro.systemCheckIcon2}></span>
                                            <span className={bIntro.systemSubTitle2}>
                                                <p>CCTV 이벤트 연동 및 WEB 기반 영상 표출 분리</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.systemSubFlex3}>
                                            <span className={bIntro.systemCheckIcon3}></span>
                                            <span className={bIntro.systemSubTitle3}>
                                                <p>Windows, Linux B/E 지원 및 WEB 기반 Frontend 제공으로 SaaS 전환 용이</p>
                                            </span>
                                        </div>
                                    </span>
                                </div>
                                {/*  <span className={bIntro.systemBottomText}>{Resource.ID.systemSect4.systemTexts15}</span> */}
                            </div>
                        </div>
                        {/* 특허 및 인증 */}
                        <div id="sectionPatent">
                            <div className={bIntro.contentBox}>
                                <div className={bIntro.comPatContent}>
                                    {/************* 특허 *************/}
                                    <div className={bIntro.comPatConTItle2} data-aos="fade-down" data-aos-duration="1000">특허 및 인증</div>
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comPatConTItle}>특허</div>
                                    <div className={bIntro.comPatentBox}>
                                        <div className={bIntro.ParFirst}>
                                            <span className={bIntro.ParFirstBox1}>
                                                <span className={bIntro.ParFirstImg1}></span>
                                                <span className={bIntro.ParFirstText}>훈련 중 상황에 따른 적응적 SOP 제공방법 및 그 시스템</span>
                                                <span className={bIntro.ParFirstText3}>(2022)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox2}>
                                                <span className={bIntro.ParFirstImg2}></span>
                                                <span className={bIntro.ParFirstText4}>조직 상황에 따른 적용적 SOP 제공방법 및 그 시스템</span>
                                                <span className={bIntro.ParFirstText6}>(2022)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParSecond}>
                                            <span className={bIntro.ParSecondBox1}>
                                                <span className={bIntro.ParSecondImg1}></span>
                                                <span className={bIntro.ParSecondText1}>위기경보 수준 관리방법 및 그 시스템</span>
                                                <span className={bIntro.ParSecondText3}>(2022)</span>
                                            </span>
                                            <span className={bIntro.ParSecondBox2}>
                                                <span className={bIntro.ParSecondImg2}></span>
                                                <span className={bIntro.ParSecondText4}>동적 비행 제한구역 운영방법 및 그 시스템</span>
                                                <span className={bIntro.ParSecondText6}>(2021)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParThird}>
                                            <span className={bIntro.ParThirdBox1}>
                                                <span className={bIntro.ParThirdImg1}></span>
                                                <span className={bIntro.ParThirdText1}>공간정보 전환시스템 및 그 방법</span>
                                                <span className={bIntro.ParThirdText2}>(2021)</span>
                                            </span>
                                            <span className={bIntro.ParThirdBox2}>
                                                <span className={bIntro.ParThirdImg2}></span>
                                                <span className={bIntro.ParThirdText4}>삼차원 비행경로 가시화 방법 및 그 시스템</span>
                                                <span className={bIntro.ParThirdText6}>(2021)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParFourth}>
                                            <span className={bIntro.ParFourthBox1}>
                                                <span className={bIntro.ParFourthImg1}></span>
                                                <span className={bIntro.ParFourthText1}>재난상황 전파 방법 및 이를 위한 시스템</span>
                                                <span className={bIntro.ParFourthText3}>(2020)</span>
                                            </span>
                                            <span className={bIntro.ParFourthBox2}>
                                                <span className={bIntro.ParFourthImg2}></span>
                                                <span className={bIntro.ParFourthText4}>훈련 신 생성이 가능한 재난대응 훈련 방법 및 그 시스템</span>
                                                <span className={bIntro.ParFourthText6}>(2020)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParFifth}>
                                            <span className={bIntro.ParFifthBox1}>
                                                <span className={bIntro.ParFifthImg1}></span>
                                                <span className={bIntro.ParFifthText1}>연계 SOP 생성방법 및 그 시스템</span>
                                                <span className={bIntro.ParFifthText3}>(2020)</span>
                                            </span>
                                            <span className={bIntro.ParFifthBox2}>
                                                <span className={bIntro.ParFifthImg2}></span>
                                                <span className={bIntro.ParFifthText4}>지능형 재난대응 훈련 방법 및 그 시스템</span>
                                                <span className={bIntro.ParFifthText6}>(2019)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParSixth}>
                                            <span className={bIntro.ParSixthBox1}>
                                                <span className={bIntro.ParSixthImg1}></span>
                                                <span className={bIntro.ParSixthText1}>환경 오염 예측 시스템 및 그 방법</span>
                                                <span className={bIntro.ParSixthText2}>(2017)</span>
                                            </span>
                                            <span className={bIntro.ParSixthBox2}>
                                                <span className={bIntro.ParSixthImg2}></span>
                                                <span className={bIntro.ParSixthText4}>재해 시 행동 지원 시스템(일본)</span>
                                                <span className={bIntro.ParSixthText5}>(2016)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParSeventh}>
                                            <span className={bIntro.ParSeventhBox1}>
                                                <span className={bIntro.ParSeventhImg1}></span>
                                                <span className={bIntro.ParSeventhText1}>재난 감지시스템 및 그 제공 방법</span>
                                                <span className={bIntro.ParSeventhText2}>(2015)</span>
                                            </span>
                                            <span className={bIntro.ParSeventhBox2}>
                                                <span className={bIntro.ParSeventhImg2}></span>
                                                <span className={bIntro.ParSeventhText4}>SOP 시나리오 구동 시스템 및 그 제공 방법</span>
                                                <span className={bIntro.ParSeventhText6}>(2015)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParEighth}>
                                            <span className={bIntro.ParEighthBox1}>
                                                <span className={bIntro.ParEighthImg1}></span>
                                                <span className={bIntro.ParEighthText1}>생태환경 평가 시스템 및 그 방법</span>
                                                <span className={bIntro.ParEighthText2}>(2014)</span>
                                            </span>
                                            <span className={bIntro.ParEighthBox2}>
                                                <span className={bIntro.ParEighthImg2}></span>
                                                <span className={bIntro.ParEighthText4}>위치 기반 지능형 SOP 시스템 및 그 제공 방법</span>
                                                <span className={bIntro.ParEighthText6}>(2013)</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/************* 인증 *************/}
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comCertifiedTItle}>인증</div>
                                    <div className={bIntro.comCertifiedBox}>
                                        <div className={bIntro.CerFirst}>
                                            <span className={bIntro.CerFirstBox}>
                                                <span className={bIntro.CerFirstImg}></span>
                                                <span className={bIntro.CerFirstText}>스마트 재난관리 시스템 TTA GS(1등급) 인증</span>
                                                <span className={bIntro.CerFirstText3}>(2022)</span>
                                            </span>
                                            <span className={bIntro.CerFirstBox2}>
                                                <span className={bIntro.CerFirstImg2}></span>
                                                <span className={bIntro.CerFirstText4}>벤처기업 확인서</span>
                                                <span className={bIntro.CerFirstText5}>(2022)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.CerSecond}>
                                            <span className={bIntro.CerSecondBox1}>
                                                <span className={bIntro.CerSecondImg1}></span>
                                                <span className={bIntro.CerSecondText1}>기업부설연구소 인정서</span>
                                                <span className={bIntro.CerSecondText2}>(2022)</span>
                                            </span>
                                            <span className={bIntro.CerSecondBox2}>
                                                <span className={bIntro.CerSecondImg2}></span>
                                                <span className={bIntro.CerSecondText4}>ICT 기업성장지원 디지털 뉴딜 우수성과 창출기업</span>
                                                <span className={bIntro.CerSecondText6}>(2021)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.CerThird}>
                                            <span className={bIntro.CerThirdBox1}>
                                                <span className={bIntro.CerThirdImg1}></span>
                                                <span className={bIntro.CerThirdText1}>이노비즈 확인서</span>
                                                <span className={bIntro.CerThirdText2}>(2021)</span>
                                            </span>
                                            <span className={bIntro.CerThirdBox2}>
                                                <span className={bIntro.CerThirdImg2}></span>
                                                <span className={bIntro.CerThirdText4}>소프트웨어 사업자 신고확인서</span>
                                                <span className={bIntro.CerThirdText5}>(2021)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.CerFourth}>
                                            <span className={bIntro.CerFourthBox1}>
                                                <span className={bIntro.CerFourthImg1}></span>
                                                <span className={bIntro.CerFourthText1}>직접생산확인 증명서</span>
                                                <span className={bIntro.CerFourthText2}>(2021)</span>
                                            </span>
                                            <span className={bIntro.CerFourthBox2}>
                                                <span className={bIntro.CerFourthImg2}></span>
                                                <span className={bIntro.CerFourthText4}>정보통신공사업 등록증</span>
                                                <span className={bIntro.CerFourthText5}>(2020)</span>
                                            </span>
                                        </div>
                                        {/* <span className={bIntro.CerSecondBox4}></span>
                                        <span className={bIntro.CerSecondBox5}></span> */}
                                    </div>

                                    {/************* 수상 *************/}
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comPrizeTItle}>수상</div>
                                    <div className={bIntro.comPrizeBox}>
                                        <div className={bIntro.PrizeFirst}>
                                            <span className={bIntro.PrizeFirstBox}>
                                                <span className={bIntro.PrizeFirstImg}></span>
                                                <span className={bIntro.PrizeFirstText}>한국가스안전공사 표창</span>
                                                <span className={bIntro.PrizeFirstText2}>(2023)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox2}>
                                                <span className={bIntro.PrizeFirstImg2}></span>
                                                <span className={bIntro.PrizeFirstText4}>행정안전부장관 표창</span>
                                                <span className={bIntro.PrizeFirstText5}>(2020)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.PrizeFirst2}>
                                            <span className={bIntro.PrizeFirstBox3}>
                                                <span className={bIntro.PrizeFirstImg3}></span>
                                                <span className={bIntro.PrizeFirstText7}>중소기업중앙회 표창</span>
                                                <span className={bIntro.PrizeFirstText8}>(2020)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox4}>
                                                <span className={bIntro.PrizeFirstImg4}></span>
                                                <span className={bIntro.PrizeFirstText10}>대구광역시장 표창</span>
                                                <span className={bIntro.PrizeFirstText11}>(2019)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.PrizeFirst3}>
                                            <span className={bIntro.PrizeFirstBox5}>
                                                <span className={bIntro.PrizeFirstImg5}></span>
                                                <span className={bIntro.PrizeFirstText13}>행정안전부장관 표창</span>
                                                <span className={bIntro.PrizeFirstText14}>(2018)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox6}>
                                                <span className={bIntro.PrizeFirstImg6}></span>
                                                <span className={bIntro.PrizeFirstText16}></span>
                                                <span className={bIntro.PrizeFirstText17}></span>
                                            </span>
                                        </div>
                                    </div>
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
            displayPerformanceUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={bIntro.bIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">보유기술</span>
                            <span data-aos="fade-down" data-aos-duration="1000">유엔이가 보유한 안전관리 및 디지털 트윈 기술 역량과 관련 특허, 인증을 소개합니다.</span>
                        </div>
                        {/* 공간정보 구축 */}
                        <div id="sectionInforBuild">
                            <div className={bIntro.spatialInforContentsSect}>
                                <span className={bIntro.spatialTitle2} data-aos="fade-down" data-aos-duration="1000">공간정보 구축</span>
                                <div className={bIntro.spatialTextBoxTop}>
                                    <span className={bIntro.spatialTexts1}>WEB 및 C/S 환경에서 원활하게 동작하는<span className={bIntro.businessTextBold}>최적의 실내외 공간정보를 구축, 관리</span><span>합니다.</span></span>
                                    <span className={bIntro.spatialTexts2}>IndoorGML 기반의 데이터 체계로 기존 시스템 및 센서 연동, 서비스 확장이 용이하며</span>
                                    <span className={bIntro.spatialTexts3}>3차원 공간 상에<span className={bIntro.businessTextBold}>LoD 4 기준 이상의 고품질 형상 정보</span>를 시각화할 수 있습니다.</span>
                                </div>
                                <div className={bIntro.spatialFlexBox}>
                                    <span className={bIntro.spatialImgBox}>
                                        <span className={bIntro.spatialInforImg}></span>
                                    </span>
                                    <span className={bIntro.spatialTextBox}>
                                        <div className={bIntro.spTarget1}>체크포인트</div>
                                        <div className={bIntro.spSubFlex1}>
                                            <span className={bIntro.spCheckIcon}></span>
                                            <span className={bIntro.spSubTitle1}>
                                                <p>2D 도면과 이미지를 이용하여 실내 공간 모델링 가능</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.spSubFlex2}>
                                            <span className={bIntro.spCheckIcon2}></span>
                                            <span className={bIntro.spSubTitle2}>
                                                <p>Google Sketch Up호환 및 Topology기반 국제표준 공간정보 모델링 구축 및 관리</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.spSubFlex3}>
                                            <span className={bIntro.spCheckIcon3}></span>
                                            <span className={bIntro.spSubTitle3}>
                                                <p>기존 BIM 데이터 대비 1/10수준의 경량화된 실내 모델링 구축 가능</p>
                                            </span>
                                        </div>
                                    </span>
                                </div>
                                {/* <span className={bIntro.spatialBottomText}>{Resource.ID.performanceSect1.spatialTexts19}</span> */}
                            </div>
                        </div>
                        {/* ESOP */}
                        <div id="sectionESOP">
                            <div className={bIntro.eSopContentsSect}>
                                <span className={bIntro.eSopTitle2} data-aos="fade-down" data-aos-duration="1000">E-SOP</span>
                                <div className={bIntro.eSopTextBoxTop}>
                                    <span className={bIntro.eSopTexts1}><span>도서,매뉴얼 형식의</span><span className={bIntro.businessTextBold}>기존 표준행동절차를 디지털화하여 IT 기반 재난대응</span><span>에 활용합니다.</span></span>
                                    <span className={bIntro.eSopTexts2}>재난유형별 훈련 대응과 함께 실제 상황 발생시<span className={bIntro.businessTextBold}>단계별 행동 요령을 안내</span>하고</span>
                                    <span className={bIntro.eSopTexts3}>비상연락망을 통한 상황전파를 제공하여<span className={bIntro.businessTextBold}>신속하고 효율적인 재난 대응을 가능</span>하게 합니다.</span>
                                </div>
                                <div className={bIntro.eSopFlexBox}>
                                    <span className={bIntro.eSopImgBox}>
                                        <span className={bIntro.eSopImg}></span>
                                    </span>
                                    <span className={bIntro.eSopTextBox}>
                                        <div className={bIntro.eSopTarget1}>체크포인트</div>
                                        <div className={bIntro.eSopSubFlex1}>
                                            <span className={bIntro.eSopCheckIcon}></span>
                                            <span className={bIntro.eSopSubTitle1}>
                                                <p>표준행동절차를 GUI기반 SW로 생성, 편집하여 DB로 저장</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.eSopSubFlex2}>
                                            <span className={bIntro.eSopCheckIcon2}></span>
                                            <span className={bIntro.eSopSubTitle2}>
                                                <p>DB화된 표준행동절차를 통한 모의훈련 수행</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.eSopSubFlex3}>
                                            <span className={bIntro.eSopCheckIcon3}></span>
                                            <span className={bIntro.eSopSubTitle3}>
                                                <p>비상연락망 구축을 위한 조직관리 및 문자 방송, 카카오톡 등으로 상황전파</p>
                                            </span>
                                        </div>
                                    </span>
                                </div>
                                {/* <span className={bIntro.eSopBottomText}>{Resource.ID.esopSect2.esopTexts18}</span> */}
                            </div>
                        </div>
                        {/* 데이터 시각화 */}
                        <div id="sectionData">
                            <div className={bIntro.dataVisualContentsSect}>
                                <span className={bIntro.dataTitle2} data-aos="fade-down" data-aos-duration="1000">데이터 시각화</span>
                                <div className={bIntro.dataTextBoxTop}>
                                    <span className={bIntro.dataTexts1}>다양한 형식의<span className={bIntro.businessTextBold}>데이터를 공간정보와 융복합하여 가시화 및 모니터링</span>합니다.</span>
                                    <span className={bIntro.dataTexts2}><span className={bIntro.businessTextBold}></span>시스템에 저장된<span className={bIntro.businessTextBold} style={{ marginRight: '8px' }}>업무정보 및 사용자 정보,</span>IoT 센서에서 수집된<span className={bIntro.businessTextBold}>실시간 모니터링 정보,</span></span>
                                    <span className={bIntro.dataTexts3}>AI/빅데이터 기술에서 도출된<span className={bIntro.businessTextBold}>분석/예측 정보를 실내외 공간정보와 결합하여 시각화</span>하여<span className={bIntro.businessTextBold}></span></span>
                                    <span className={bIntro.dataTexts4}>이를 테이블/ 표, 이벤트 스트림 등<span className={bIntro.businessTextBold}>다양한 방식으로 표출</span>합니다.</span>
                                </div>
                                <div className={bIntro.dataFlexBox}>
                                    <span className={bIntro.dataImgBox}>
                                        <span className={bIntro.dataImg}></span>
                                    </span>
                                    <span className={bIntro.dataTextBox}>
                                        <div className={bIntro.dataTarget1}>체크포인트</div>
                                        <div className={bIntro.dataSubFlex1}>
                                            <span className={bIntro.dataCheckIcon}></span>
                                            <span className={bIntro.dataSubTitle1}>
                                                <p>DBMS 및 파일, Log에 저장된 업무 및 사용자 정보 시각화</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.dataSubFlex2}>
                                            <span className={bIntro.dataCheckIcon2}></span>
                                            <span className={bIntro.dataSubTitle2}>
                                                <p>IoT 센서에서 수집된 실시간 이벤트 스트림 정보 시각화</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.dataSubFlex3}>
                                            <span className={bIntro.dataCheckIcon3}></span>
                                            <span className={bIntro.dataSubTitle3}>
                                                <p>3D 공간 및 시설물과 결합하여 실시간 이벤트 및 과거 이력 시각화</p>
                                            </span>
                                        </div>
                                    </span>
                                </div>
                                {/* <span className={bIntro.dataBottomText}>{Resource.ID.dataSect3.dataTexts16}</span> */}
                            </div>
                        </div>
                        {/* 시스템 통합구축 */}
                        <div id="sectionSystem">
                            <div className={bIntro.systemLinkContentsSect}>
                                <span className={bIntro.systemTitle2} data-aos="fade-down" data-aos-duration="1000">시스템 연계통합</span>
                                <div className={bIntro.systemTextBoxTop}>
                                    <span className={bIntro.systemTexts1}>여러 산업분야에서 사용되는<span className={bIntro.businessTextBold}>시스템 및 센서, 데이터를 연계 및 통합 구축</span>합니다.</span>
                                    <span className={bIntro.systemTexts2}><span className={bIntro.businessTextBold}></span><span /* className={bIntro.businessTextBold}*/ >고객이 사용중인</span><span className={bIntro.businessTextBold}>레거시 시스템 및 CCTV, 센서</span>와</span>
                                    <span className={bIntro.systemTexts3}><span className={bIntro.businessTextBold}>신규 IoT 센서, 웹 서비스의 연계/ 통합</span>이 가능하며</span>
                                    <span className={bIntro.systemTexts4}><span className={bIntro.businessTextBold}>API를 활용한 시스템 연계, 온프레미스의 클라우드 전환</span><span>을 지원합니다.</span><span className={bIntro.businessTextBold}></span></span>
                                </div>
                                <div className={bIntro.systemFlexBox}>
                                    <span className={bIntro.systemImgBox}>
                                        <span className={bIntro.systemImg}></span>
                                    </span>
                                    <span className={bIntro.systemTextBox}>
                                        <div className={bIntro.systemTarget1}>체크포인트</div>
                                        <div className={bIntro.systemSubFlex1}>
                                            <span className={bIntro.systemCheckIcon}></span>
                                            <span className={bIntro.systemSubTitle1}>
                                                <p>화재, 누출, 지진 등 개별 프로토콜로 동작하는 센서 연동 서버 구축</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.systemSubFlex2}>
                                            <span className={bIntro.systemCheckIcon2}></span>
                                            <span className={bIntro.systemSubTitle2}>
                                                <p>CCTV 이벤트 연동 및 WEB 기반 영상 표출 분리</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.systemSubFlex3}>
                                            <span className={bIntro.systemCheckIcon3}></span>
                                            <span className={bIntro.systemSubTitle3}>
                                                <p>Windows, Linux B/E 지원 및 WEB 기반 Frontend 제공으로 SaaS 전환 용이</p>
                                            </span>
                                        </div>
                                    </span>
                                </div>
                                {/*  <span className={bIntro.systemBottomText}>{Resource.ID.systemSect4.systemTexts15}</span> */}
                            </div>
                        </div>
                        {/* 특허 및 인증 */}
                        <div id="sectionPatent">
                            <div className={bIntro.contentBox}>
                                <div className={bIntro.comPatContent}>
                                    {/************* 특허 *************/}
                                    <div className={bIntro.comPatConTItle2} data-aos="fade-down" data-aos-duration="1000">특허 및 인증</div>
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comPatConTItle}>특허</div>
                                    <div className={bIntro.comPatentBox}>
                                        <div className={bIntro.ParFirst}>
                                            <span className={bIntro.ParFirstBox1}>
                                                <span className={bIntro.ParFirstImg1}></span>
                                                <span className={bIntro.ParFirstText}>훈련 중 상황에 따른 적응적 SOP 제공방법 및 그 시스템</span>
                                                <span className={bIntro.ParFirstText3}>(2022)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox2}>
                                                <span className={bIntro.ParFirstImg2}></span>
                                                <span className={bIntro.ParFirstText4}>조직 상황에 따른 적용적 SOP 제공방법 및 그 시스템</span>
                                                <span className={bIntro.ParFirstText6}>(2022)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParSecond}>
                                            <span className={bIntro.ParSecondBox1}>
                                                <span className={bIntro.ParSecondImg1}></span>
                                                <span className={bIntro.ParSecondText1}>위기경보 수준 관리방법 및 그 시스템</span>
                                                <span className={bIntro.ParSecondText3}>(2022)</span>
                                            </span>
                                            <span className={bIntro.ParSecondBox2}>
                                                <span className={bIntro.ParSecondImg2}></span>
                                                <span className={bIntro.ParSecondText4}>동적 비행 제한구역 운영방법 및 그 시스템</span>
                                                <span className={bIntro.ParSecondText6}>(2021)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParThird}>
                                            <span className={bIntro.ParThirdBox1}>
                                                <span className={bIntro.ParThirdImg1}></span>
                                                <span className={bIntro.ParThirdText1}>공간정보 전환시스템 및 그 방법</span>
                                                <span className={bIntro.ParThirdText2}>(2021)</span>
                                            </span>
                                            <span className={bIntro.ParThirdBox2}>
                                                <span className={bIntro.ParThirdImg2}></span>
                                                <span className={bIntro.ParThirdText4}>삼차원 비행경로 가시화 방법 및 그 시스템</span>
                                                <span className={bIntro.ParThirdText6}>(2021)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParFourth}>
                                            <span className={bIntro.ParFourthBox1}>
                                                <span className={bIntro.ParFourthImg1}></span>
                                                <span className={bIntro.ParFourthText1}>재난상황 전파 방법 및 이를 위한 시스템</span>
                                                <span className={bIntro.ParFourthText3}>(2020)</span>
                                            </span>
                                            <span className={bIntro.ParFourthBox2}>
                                                <span className={bIntro.ParFourthImg2}></span>
                                                <span className={bIntro.ParFourthText4}>훈련 신 생성이 가능한 재난대응 훈련 방법 및 그 시스템</span>
                                                <span className={bIntro.ParFourthText6}>(2020)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParFifth}>
                                            <span className={bIntro.ParFifthBox1}>
                                                <span className={bIntro.ParFifthImg1}></span>
                                                <span className={bIntro.ParFifthText1}>연계 SOP 생성방법 및 그 시스템</span>
                                                <span className={bIntro.ParFifthText3}>(2020)</span>
                                            </span>
                                            <span className={bIntro.ParFifthBox2}>
                                                <span className={bIntro.ParFifthImg2}></span>
                                                <span className={bIntro.ParFifthText4}>지능형 재난대응 훈련 방법 및 그 시스템</span>
                                                <span className={bIntro.ParFifthText6}>(2019)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParSixth}>
                                            <span className={bIntro.ParSixthBox1}>
                                                <span className={bIntro.ParSixthImg1}></span>
                                                <span className={bIntro.ParSixthText1}>환경 오염 예측 시스템 및 그 방법</span>
                                                <span className={bIntro.ParSixthText2}>(2017)</span>
                                            </span>
                                            <span className={bIntro.ParSixthBox2}>
                                                <span className={bIntro.ParSixthImg2}></span>
                                                <span className={bIntro.ParSixthText4}>재해 시 행동 지원 시스템(일본)</span>
                                                <span className={bIntro.ParSixthText5}>(2016)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParSeventh}>
                                            <span className={bIntro.ParSeventhBox1}>
                                                <span className={bIntro.ParSeventhImg1}></span>
                                                <span className={bIntro.ParSeventhText1}>재난 감지시스템 및 그 제공 방법</span>
                                                <span className={bIntro.ParSeventhText2}>(2015)</span>
                                            </span>
                                            <span className={bIntro.ParSeventhBox2}>
                                                <span className={bIntro.ParSeventhImg2}></span>
                                                <span className={bIntro.ParSeventhText4}>SOP 시나리오 구동 시스템 및 그 제공 방법</span>
                                                <span className={bIntro.ParSeventhText6}>(2015)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParEighth}>
                                            <span className={bIntro.ParEighthBox1}>
                                                <span className={bIntro.ParEighthImg1}></span>
                                                <span className={bIntro.ParEighthText1}>생태환경 평가 시스템 및 그 방법</span>
                                                <span className={bIntro.ParEighthText2}>(2014)</span>
                                            </span>
                                            <span className={bIntro.ParEighthBox2}>
                                                <span className={bIntro.ParEighthImg2}></span>
                                                <span className={bIntro.ParEighthText4}>위치 기반 지능형 SOP 시스템 및 그 제공 방법</span>
                                                <span className={bIntro.ParEighthText6}>(2013)</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/************* 인증 *************/}
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comCertifiedTItle}>인증</div>
                                    <div className={bIntro.comCertifiedBox}>
                                        <div className={bIntro.CerFirst}>
                                            <span className={bIntro.CerFirstBox}>
                                                <span className={bIntro.CerFirstImg}></span>
                                                <span className={bIntro.CerFirstText}>스마트 재난관리 시스템 TTA GS(1등급) 인증</span>
                                                <span className={bIntro.CerFirstText3}>(2022)</span>
                                            </span>
                                            <span className={bIntro.CerFirstBox2}>
                                                <span className={bIntro.CerFirstImg2}></span>
                                                <span className={bIntro.CerFirstText4}>벤처기업 확인서</span>
                                                <span className={bIntro.CerFirstText5}>(2022)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.CerSecond}>
                                            <span className={bIntro.CerSecondBox1}>
                                                <span className={bIntro.CerSecondImg1}></span>
                                                <span className={bIntro.CerSecondText1}>기업부설연구소 인정서</span>
                                                <span className={bIntro.CerSecondText2}>(2022)</span>
                                            </span>
                                            <span className={bIntro.CerSecondBox2}>
                                                <span className={bIntro.CerSecondImg2}></span>
                                                <span className={bIntro.CerSecondText4}>ICT 기업성장지원 디지털 뉴딜 우수성과 창출기업</span>
                                                <span className={bIntro.CerSecondText6}>(2021)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.CerThird}>
                                            <span className={bIntro.CerThirdBox1}>
                                                <span className={bIntro.CerThirdImg1}></span>
                                                <span className={bIntro.CerThirdText1}>이노비즈 확인서</span>
                                                <span className={bIntro.CerThirdText2}>(2021)</span>
                                            </span>
                                            <span className={bIntro.CerThirdBox2}>
                                                <span className={bIntro.CerThirdImg2}></span>
                                                <span className={bIntro.CerThirdText4}>소프트웨어 사업자 신고확인서</span>
                                                <span className={bIntro.CerThirdText5}>(2021)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.CerFourth}>
                                            <span className={bIntro.CerFourthBox1}>
                                                <span className={bIntro.CerFourthImg1}></span>
                                                <span className={bIntro.CerFourthText1}>직접생산확인 증명서</span>
                                                <span className={bIntro.CerFourthText2}>(2021)</span>
                                            </span>
                                            <span className={bIntro.CerFourthBox2}>
                                                <span className={bIntro.CerFourthImg2}></span>
                                                <span className={bIntro.CerFourthText4}>정보통신공사업 등록증</span>
                                                <span className={bIntro.CerFourthText5}>(2020)</span>
                                            </span>
                                        </div>
                                        {/* <span className={bIntro.CerSecondBox4}></span>
                                        <span className={bIntro.CerSecondBox5}></span> */}
                                    </div>

                                    {/************* 수상 *************/}
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comPrizeTItle}>수상</div>
                                    <div className={bIntro.comPrizeBox}>
                                        <div className={bIntro.PrizeFirst}>
                                            <span className={bIntro.PrizeFirstBox}>
                                                <span className={bIntro.PrizeFirstImg}></span>
                                                <span className={bIntro.PrizeFirstText}>한국가스안전공사 표창</span>
                                                <span className={bIntro.PrizeFirstText2}>(2023)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox2}>
                                                <span className={bIntro.PrizeFirstImg2}></span>
                                                <span className={bIntro.PrizeFirstText4}>행정안전부장관 표창</span>
                                                <span className={bIntro.PrizeFirstText5}>(2020)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.PrizeFirst2}>
                                            <span className={bIntro.PrizeFirstBox3}>
                                                <span className={bIntro.PrizeFirstImg3}></span>
                                                <span className={bIntro.PrizeFirstText7}>중소기업중앙회 표창</span>
                                                <span className={bIntro.PrizeFirstText8}>(2020)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox4}>
                                                <span className={bIntro.PrizeFirstImg4}></span>
                                                <span className={bIntro.PrizeFirstText10}>대구광역시장 표창</span>
                                                <span className={bIntro.PrizeFirstText11}>(2019)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.PrizeFirst3}>
                                            <span className={bIntro.PrizeFirstBox5}>
                                                <span className={bIntro.PrizeFirstImg5}></span>
                                                <span className={bIntro.PrizeFirstText13}>행정안전부장관 표창</span>
                                                <span className={bIntro.PrizeFirstText14}>(2018)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox6}>
                                                <span className={bIntro.PrizeFirstImg6}></span>
                                                <span className={bIntro.PrizeFirstText16}></span>
                                                <span className={bIntro.PrizeFirstText17}></span>
                                            </span>
                                        </div>
                                    </div>
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
            displayPerformanceUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={bIntro.bIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">보유기술</span>
                            <span data-aos="fade-down" data-aos-duration="1000">유엔이가 보유한 안전관리 및 디지털 트윈 기술 역량과 관련 특허, 인증을 소개합니다.</span>
                        </div>
                        {/* 공간정보 구축 */}
                        <div id="sectionInforBuild">
                            <div className={bIntro.spatialInforContentsSect}>
                                <span className={bIntro.spatialTitle2} data-aos="fade-down" data-aos-duration="1000">공간정보 구축</span>
                                <div className={bIntro.spatialTextBoxTop}>
                                    <span className={bIntro.spatialTexts1}>WEB 및 C/S 환경에서 원활하게 동작하는<span className={bIntro.businessTextBold}>최적의 실내외 공간정보를 구축, 관리</span><span>합니다.</span></span>
                                    <span className={bIntro.spatialTexts2}>IndoorGML 기반의 데이터 체계로 기존 시스템 및 센서 연동, 서비스 확장이 용이하며</span>
                                    <span className={bIntro.spatialTexts3}>3차원 공간 상에<span className={bIntro.businessTextBold}>LoD 4 기준 이상의 고품질 형상 정보</span>를 시각화할 수 있습니다.</span>
                                </div>
                                <div className={bIntro.spatialFlexBox}>
                                    <span className={bIntro.spatialImgBox}>
                                        <span className={bIntro.spatialInforImg}></span>
                                    </span>
                                    <span className={bIntro.spatialTextBox}>
                                        <div className={bIntro.spTarget1}>체크포인트</div>
                                        <div className={bIntro.spSubFlex1}>
                                            <span className={bIntro.spCheckIcon}></span>
                                            <span className={bIntro.spSubTitle1}>
                                                <p>2D 도면과 이미지를 이용하여</p>
                                                <p>실내 공간 모델링 가능</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.spSubFlex2}>
                                            <span className={bIntro.spCheckIcon2}></span>
                                            <span className={bIntro.spSubTitle2}>
                                                <p>Google Sketch Up호환 및</p>
                                                <p>Topology기반 국제표준</p>
                                                <p>공간정보 모델링 구축 및 관리</p>
                                                <p></p>
                                                <p></p>
                                            </span>
                                        </div>
                                        <div className={bIntro.spSubFlex3}>
                                            <span className={bIntro.spCheckIcon3}></span>
                                            <span className={bIntro.spSubTitle3}>
                                                <p>기존 BIM 데이터 대비</p>
                                                <p>1/10수준의 경량화된</p>
                                                <p>실내 모델링 구축 가능</p>
                                            </span>
                                        </div>
                                    </span>
                                </div>
                                {/* <span className={bIntro.spatialBottomText}>{Resource.ID.performanceSect1.spatialTexts19}</span> */}
                            </div>
                        </div>
                        {/* ESOP */}
                        <div id="sectionESOP">
                            <div className={bIntro.eSopContentsSect}>
                                <span className={bIntro.eSopTitle2} data-aos="fade-down" data-aos-duration="1000">E-SOP</span>
                                <div className={bIntro.eSopTextBoxTop}>
                                    <span className={bIntro.eSopTexts1}><span>도서,매뉴얼 형식의</span><span className={bIntro.businessTextBold}>기존 표준행동절차를 디지털화하여 IT 기반 재난대응</span><span>에 활용합니다.</span></span>
                                    <span className={bIntro.eSopTexts2}>재난유형별 훈련 대응과 함께 실제 상황 발생시<span className={bIntro.businessTextBold}>단계별 행동 요령을 안내</span>하고</span>
                                    <span className={bIntro.eSopTexts3}>비상연락망을 통한 상황전파를 제공하여<span className={bIntro.businessTextBold}>신속하고 효율적인 재난 대응을 가능</span>하게 합니다.</span>
                                </div>
                                <div className={bIntro.eSopFlexBox}>
                                    <span className={bIntro.eSopImgBox}>
                                        <span className={bIntro.eSopImg}></span>
                                    </span>
                                    <span className={bIntro.eSopTextBox}>
                                        <div className={bIntro.eSopTarget1}>체크포인트</div>
                                        <div className={bIntro.eSopSubFlex1}>
                                            <span className={bIntro.eSopCheckIcon}></span>
                                            <span className={bIntro.eSopSubTitle1}>
                                                <p>표준행동절차를 GUI기반</p>
                                                <p>SW로 생성, 편집하여 DB로 저장</p>
                                                <p></p>
                                            </span>
                                        </div>
                                        <div className={bIntro.eSopSubFlex2}>
                                            <span className={bIntro.eSopCheckIcon2}></span>
                                            <span className={bIntro.eSopSubTitle2}>
                                                <p>DB화된 표준행동절차를 통한</p>
                                                <p>모의훈련 수행</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.eSopSubFlex3}>
                                            <span className={bIntro.eSopCheckIcon3}></span>
                                            <span className={bIntro.eSopSubTitle3}>
                                                <p>비상연락망 구축을 위한</p>
                                                <p>조직관리 및 문자</p>
                                                <p>방송, 카카오톡 등으로 상황전파</p>
                                                <p></p>
                                            </span>
                                        </div>
                                    </span>
                                </div>
                                {/* <span className={bIntro.eSopBottomText}>{Resource.ID.esopSect2.esopTexts18}</span> */}
                            </div>
                        </div>
                        {/* 데이터 시각화 */}
                        <div id="sectionData">
                            <div className={bIntro.dataVisualContentsSect}>
                                <span className={bIntro.dataTitle2} data-aos="fade-down" data-aos-duration="1000">데이터 시각화</span>
                                <div className={bIntro.dataTextBoxTop}>
                                    <span className={bIntro.dataTexts1}>다양한 형식의<span className={bIntro.businessTextBold}>데이터를 공간정보와 융복합하여 가시화 및 모니터링</span>합니다.</span>
                                    <span className={bIntro.dataTexts2}><span className={bIntro.businessTextBold}></span>시스템에 저장된<span className={bIntro.businessTextBold} style={{ marginRight: '8px' }}>업무정보 및 사용자 정보,</span>IoT 센서에서 수집된<span className={bIntro.businessTextBold}>실시간 모니터링 정보,</span></span>
                                    <span className={bIntro.dataTexts3}>AI/빅데이터 기술에서 도출된<span className={bIntro.businessTextBold}>분석/예측 정보를 실내외 공간정보와 결합하여 시각화</span>하여<span className={bIntro.businessTextBold}></span></span>
                                    <span className={bIntro.dataTexts4}>이를 테이블/ 표, 이벤트 스트림 등<span className={bIntro.businessTextBold}>다양한 방식으로 표출</span>합니다.</span>
                                </div>
                                <div className={bIntro.dataFlexBox}>
                                    <span className={bIntro.dataImgBox}>
                                        <span className={bIntro.dataImg}></span>
                                    </span>
                                    <span className={bIntro.dataTextBox}>
                                        <div className={bIntro.dataTarget1}>체크포인트</div>
                                        <div className={bIntro.dataSubFlex1}>
                                            <span className={bIntro.dataCheckIcon}></span>
                                            <span className={bIntro.dataSubTitle1}>
                                                <p>DBMS 및 파일, Log에 저장된</p>
                                                <p>업무 및 사용자 정보 시각화</p>
                                                <p></p>
                                            </span>
                                        </div>
                                        <div className={bIntro.dataSubFlex2}>
                                            <span className={bIntro.dataCheckIcon2}></span>
                                            <span className={bIntro.dataSubTitle2}>
                                                <p>IoT 센서에서 수집된</p>
                                                <p>실시간 이벤트 스트림 정보 시각화</p>
                                                <p></p>
                                            </span>
                                        </div>
                                        <div className={bIntro.dataSubFlex3}>
                                            <span className={bIntro.dataCheckIcon3}></span>
                                            <span className={bIntro.dataSubTitle3}>
                                                <p>3D 공간 및 시설물과 결합하여</p>
                                                <p>실시간 이벤트 및 과거 이력 시각화</p>
                                                <p></p>
                                            </span>
                                        </div>
                                    </span>
                                </div>
                                {/* <span className={bIntro.dataBottomText}>{Resource.ID.dataSect3.dataTexts16}</span> */}
                            </div>
                        </div>
                        {/* 시스템 통합구축 */}
                        <div id="sectionSystem">
                            <div className={bIntro.systemLinkContentsSect}>
                                <span className={bIntro.systemTitle2} data-aos="fade-down" data-aos-duration="1000">시스템 연계통합</span>
                                <div className={bIntro.systemTextBoxTop}>
                                    <span className={bIntro.systemTexts1}>여러 산업분야에서 사용되는<span className={bIntro.businessTextBold}>시스템 및 센서, 데이터를 연계 및 통합 구축</span>합니다.</span>
                                    <span className={bIntro.systemTexts2}><span className={bIntro.businessTextBold}></span><span /* className={bIntro.businessTextBold}*/ >고객이 사용중인</span><span className={bIntro.businessTextBold}>레거시 시스템 및 CCTV, 센서</span>와</span>
                                    <span className={bIntro.systemTexts3}><span className={bIntro.businessTextBold}>신규 IoT 센서, 웹 서비스의 연계/ 통합</span>이 가능하며</span>
                                    <span className={bIntro.systemTexts4}><span className={bIntro.businessTextBold}>API를 활용한 시스템 연계, 온프레미스의 클라우드 전환</span><span>을 지원합니다.</span><span className={bIntro.businessTextBold}></span></span>
                                </div>
                                <div className={bIntro.systemFlexBox}>
                                    <span className={bIntro.systemImgBox}>
                                        <span className={bIntro.systemImg}></span>
                                    </span>
                                    <span className={bIntro.systemTextBox}>
                                        <div className={bIntro.systemTarget1}>체크포인트</div>
                                        <div className={bIntro.systemSubFlex1}>
                                            <span className={bIntro.systemCheckIcon}></span>
                                            <span className={bIntro.systemSubTitle1}>
                                                <p>화재, 누출, 지진 등</p>
                                                <p>개별 프로토콜로 동작하는</p>
                                                <p>센서 연동 서버 구축</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.systemSubFlex2}>
                                            <span className={bIntro.systemCheckIcon2}></span>
                                            <span className={bIntro.systemSubTitle2}>
                                                <p>CCTV 이벤트 연동 및</p>
                                                <p>WEB 기반 영상 표출 분리</p>
                                                <p></p>
                                            </span>
                                        </div>
                                        <div className={bIntro.systemSubFlex3}>
                                            <span className={bIntro.systemCheckIcon3}></span>
                                            <span className={bIntro.systemSubTitle3}>
                                                <p>Windows, Linux B/E 지원 및</p>
                                                <p>WEB 기반 Frontend 제공으로</p>
                                                <p>SaaS 전환 용이</p>
                                            </span>
                                        </div>
                                    </span>
                                </div>
                                {/*  <span className={bIntro.systemBottomText}>{Resource.ID.systemSect4.systemTexts15}</span> */}
                            </div>
                        </div>
                        {/* 특허 및 인증 */}
                        <div id="sectionPatent">
                            <div className={bIntro.contentBox}>
                                <div className={bIntro.comPatContent}>
                                    {/************* 특허 *************/}
                                    <div className={bIntro.comPatConTItle2} data-aos="fade-down" data-aos-duration="1000">특허 및 인증</div>
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comPatConTItle}>특허</div>
                                    <div className={bIntro.comPatentBox}>
                                        <div className={bIntro.ParFirst}>
                                            <span className={bIntro.ParFirstBox1}>
                                                <span className={bIntro.ParFirstImg}></span>
                                                <span className={bIntro.ParFirstText}>훈련 중 상황에 따른 적응적</span>
                                                <span className={bIntro.ParFirstText2}>SOP 제공방법 및 그 시스템</span>
                                                <span className={bIntro.ParFirstText3}>(2022)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox2}>
                                                <span className={bIntro.ParFirstImg2}></span>
                                                <span className={bIntro.ParFirstText4}>조직 상황에 따른 적용적 SOP</span>
                                                <span className={bIntro.ParFirstText5}>제공방법 및 그 시스템</span>
                                                <span className={bIntro.ParFirstText6}>(2022)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox3}>
                                                <span className={bIntro.ParFirstImg3}></span>
                                                <span className={bIntro.ParFirstText7}>위기경보 수준 관리방법 및</span>
                                                <span className={bIntro.ParFirstText8}>그 시스템</span>
                                                <span className={bIntro.ParFirstText9}>(2022)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox4}>
                                                <span className={bIntro.ParFirstImg4}></span>
                                                <span className={bIntro.ParFirstText10}>동적 비행 제한구역 운영방법 및</span>
                                                <span className={bIntro.ParFirstText11}>그 시스템</span>
                                                <span className={bIntro.ParFirstText12}>(2021)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox5}>
                                                <span className={bIntro.ParFirstImg5}></span>
                                                <span className={bIntro.ParFirstText13}>공간정보 전환시스템 및 그 방법</span>
                                                <span className={bIntro.ParFirstText14}>(2021)</span>
                                                <span className={bIntro.ParFirstText15}></span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParSecond}>
                                            <span className={bIntro.ParSecondBox1}>
                                                <span className={bIntro.ParSecondImg}></span>
                                                <span className={bIntro.ParSecondText}>삼차원 비행경로 가시화 방법 및</span>
                                                <span className={bIntro.ParSecondText2}>그 시스템</span>
                                                <span className={bIntro.ParSecondText3}>(2021)</span>
                                            </span>
                                            <span className={bIntro.ParSecondBox2}>
                                                <span className={bIntro.ParSecondImg2}></span>
                                                <span className={bIntro.ParSecondText4}>재난상황 전파 방법 및</span>
                                                <span className={bIntro.ParSecondText5}>이를 위한 시스템</span>
                                                <span className={bIntro.ParSecondText6}>(2020)</span>
                                            </span>
                                            <span className={bIntro.ParSecondBox3}>
                                                <span className={bIntro.ParSecondImg3}></span>
                                                <span className={bIntro.ParSecondText7}>훈련 신 생성이 가능한 재난대응</span>
                                                <span className={bIntro.ParSecondText8}>훈련 방법 및 그 시스템</span>
                                                <span className={bIntro.ParSecondText9}>(2020)</span>
                                            </span>
                                            <span className={bIntro.ParSecondBox4}>
                                                <span className={bIntro.ParSecondImg4}></span>
                                                <span className={bIntro.ParSecondText10}>연계 SOP 생성방법 및</span>
                                                <span className={bIntro.ParSecondText11}>그 시스템</span>
                                                <span className={bIntro.ParSecondText12}>(2020)</span>
                                            </span>
                                            <span className={bIntro.ParSecondBox5}>
                                                <span className={bIntro.ParSecondImg5}></span>
                                                <span className={bIntro.ParSecondText13}>지능형 재난대응 훈련 방법 및</span>
                                                <span className={bIntro.ParSecondText14}>그 시스템</span>
                                                <span className={bIntro.ParSecondText15}>(2019)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParThird}>
                                            <span className={bIntro.ParThirdBox1}>
                                                <span className={bIntro.ParThirdImg}></span>
                                                <span className={bIntro.ParThirdText}>환경 오염 예측 시스템 및 그 방법</span>
                                                <span className={bIntro.ParThirdText2}>(2017)</span>
                                                <span className={bIntro.ParThirdText3}></span>
                                            </span>
                                            <span className={bIntro.ParThirdBox2}>
                                                <span className={bIntro.ParThirdImg2}></span>
                                                <span className={bIntro.ParThirdText4}>재해 시 행동 지원 시스템(일본)</span>
                                                <span className={bIntro.ParThirdText5}>(2016)</span>
                                                <span className={bIntro.ParThirdText6}></span>
                                            </span>
                                            <span className={bIntro.ParThirdBox3}>
                                                <span className={bIntro.ParThirdImg3}></span>
                                                <span className={bIntro.ParThirdText7}>재난 감지시스템 및 그 제공 방법</span>
                                                <span className={bIntro.ParThirdText8}>(2015)</span>
                                                <span className={bIntro.ParThirdText9}></span>
                                            </span>
                                            <span className={bIntro.ParThirdBox4}>
                                                <span className={bIntro.ParThirdImg4}></span>
                                                <span className={bIntro.ParThirdText10}>SOP 시나리오 구동 시스템 및</span>
                                                <span className={bIntro.ParThirdText11}>그 제공 방법 (2015)</span>
                                                <span className={bIntro.ParThirdText12}></span>
                                            </span>
                                            <span className={bIntro.ParThirdBox5}>
                                                <span className={bIntro.ParThirdImg5}></span>
                                                <span className={bIntro.ParThirdText13}>생태환경 평가 시스템 및 그 방법</span>
                                                <span className={bIntro.ParThirdText14}>(2014)</span>
                                                <span className={bIntro.ParThirdText15}></span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParFourth}>
                                            <span className={bIntro.ParFourthBox1}>
                                                <span className={bIntro.ParFourthImg}></span>
                                                <span className={bIntro.ParFourthText}>위치 기반 지능형 SOP 시스템</span>
                                                <span className={bIntro.ParFourthText2}>및 그 제공 방법</span>
                                                <span className={bIntro.ParFourthText3}>(2013)</span>
                                            </span>
                                            <span className={bIntro.ParFourthBox2}></span>
                                            <span className={bIntro.ParFourthBox3}></span>
                                            <span className={bIntro.ParFourthBox4}></span>
                                            <span className={bIntro.ParFourthBox5}></span>
                                        </div>
                                    </div>

                                    {/************* 인증 *************/}
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comCertifiedTItle}>인증</div>
                                    <div className={bIntro.comCertifiedBox}>
                                        <div className={bIntro.CerFirst}>
                                            <span className={bIntro.CerFirstBox}>
                                                <span className={bIntro.CerFirstImg}></span>
                                                <span className={bIntro.CerFirstText}>스마트 재난관리 시스템</span>
                                                <span className={bIntro.CerFirstText2}>TTA GS(1등급) 인증</span>
                                                <span className={bIntro.CerFirstText3}>(2022)</span>
                                            </span>
                                            <span className={bIntro.CerFirstBox2}>
                                                <span className={bIntro.CerFirstImg2}></span>
                                                <span className={bIntro.CerFirstText4}>벤처기업 확인서</span>
                                                <span className={bIntro.CerFirstText5}>(2022)</span>
                                                <span className={bIntro.CerFirstText6}></span>
                                            </span>
                                            <span className={bIntro.CerFirstBox3}>
                                                <span className={bIntro.CerFirstImg3}></span>
                                                <span className={bIntro.CerFirstText7}>기업부설연구소 인정서</span>
                                                <span className={bIntro.CerFirstText8}>(2022)</span>
                                                <span className={bIntro.CerFirstText9}></span>
                                            </span>
                                            <span className={bIntro.CerFirstBox4}>
                                                <span className={bIntro.CerFirstImg4}></span>
                                                <span className={bIntro.CerFirstText10}>ICT 기업성장지원 디지털 뉴딜</span>
                                                <span className={bIntro.CerFirstText11}>우수성과 창출기업</span>
                                                <span className={bIntro.CerFirstText12}>(2021)</span>
                                            </span>
                                            <span className={bIntro.CerFirstBox5}>
                                                <span className={bIntro.CerFirstImg5}></span>
                                                <span className={bIntro.CerFirstText13}>이노비즈 확인서</span>
                                                <span className={bIntro.CerFirstText14}>(2021)</span>
                                                <span className={bIntro.CerFirstText15}></span>
                                            </span>
                                        </div>
                                        <div className={bIntro.CerSecond}>
                                            <span className={bIntro.CerSecondBox}>
                                                <span className={bIntro.CerSecondImg}></span>
                                                <span className={bIntro.CerSecondText}>소프트웨어 사업자 신고확인서</span>
                                                <span className={bIntro.CerSecondText2}>(2021)</span>
                                                <span className={bIntro.CerSecondText3}></span>
                                            </span>
                                            <span className={bIntro.CerSecondBox2}>
                                                <span className={bIntro.CerSecondImg2}></span>
                                                <span className={bIntro.CerSecondText4}>직접생산확인 증명서</span>
                                                <span className={bIntro.CerSecondText5}>(2021)</span>
                                                <span className={bIntro.CerSecondText6}></span>
                                            </span>
                                            <span className={bIntro.CerSecondBox3}>
                                                <span className={bIntro.CerSecondImg3}></span>
                                                <span className={bIntro.CerSecondText7}>정보통신공사업 등록증</span>
                                                <span className={bIntro.CerSecondText8}>(2020)</span>
                                                <span className={bIntro.CerSecondText9}></span>
                                            </span>
                                            <span className={bIntro.CerSecondBox4}></span>
                                            <span className={bIntro.CerSecondBox5}></span>
                                        </div>
                                    </div>
                                    {/************* 수상 *************/}
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comPrizeTItle}>수상</div>
                                    <div className={bIntro.comPrizeBox}>
                                        <div className={bIntro.PrizeFirst}>
                                            <span className={bIntro.PrizeFirstBox}>
                                                <span className={bIntro.PrizeFirstImg}></span>
                                                <span className={bIntro.PrizeFirstText}>한국가스안전공사 표창</span>
                                                <span className={bIntro.PrizeFirstText2}>(2023)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox2}>
                                                <span className={bIntro.PrizeFirstImg2}></span>
                                                <span className={bIntro.PrizeFirstText4}>행정안전부장관 표창</span>
                                                <span className={bIntro.PrizeFirstText5}>(2020)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.PrizeFirst2}>
                                            <span className={bIntro.PrizeFirstBox3}>
                                                <span className={bIntro.PrizeFirstImg3}></span>
                                                <span className={bIntro.PrizeFirstText7}>중소기업중앙회 표창</span>
                                                <span className={bIntro.PrizeFirstText8}>(2020)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox4}>
                                                <span className={bIntro.PrizeFirstImg4}></span>
                                                <span className={bIntro.PrizeFirstText10}>대구광역시장 표창</span>
                                                <span className={bIntro.PrizeFirstText11}>(2019)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.PrizeFirst3}>
                                            <span className={bIntro.PrizeFirstBox5}>
                                                <span className={bIntro.PrizeFirstImg5}></span>
                                                <span className={bIntro.PrizeFirstText13}>행정안전부장관 표창</span>
                                                <span className={bIntro.PrizeFirstText14}>(2018)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox6}>
                                                <span className={bIntro.PrizeFirstImg6}></span>
                                                <span className={bIntro.PrizeFirstText16}></span>
                                                <span className={bIntro.PrizeFirstText17}></span>
                                            </span>
                                        </div>
                                    </div>
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
            displayPerformanceUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={bIntro.bIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">보유기술</span>
                            <span data-aos="fade-down" data-aos-duration="1000">유엔이가 보유한 안전관리 및 디지털 트윈 기술 역량과 관련 특허, 인증을 소개합니다.</span>
                        </div>
                        {/* 공간정보 구축 */}
                        <div id="sectionInforBuild">
                            <div className={bIntro.spatialInforContentsSect}>
                                <span className={bIntro.spatialTitle2} data-aos="fade-down" data-aos-duration="1000">공간정보 구축</span>
                                <div className={bIntro.spatialTextBoxTop}>
                                    <span className={bIntro.spatialTexts1}>WEB 및 C/S 환경에서 원활하게 동작하는<span className={bIntro.businessTextBold}>최적의 실내외 공간정보를 구축, 관리</span><span>합니다.</span></span>
                                    <span className={bIntro.spatialTexts2}>IndoorGML 기반의 데이터 체계로 기존 시스템 및 센서 연동, 서비스 확장이 용이하며</span>
                                    <span className={bIntro.spatialTexts3}>3차원 공간 상에<span className={bIntro.businessTextBold}>LoD 4 기준 이상의 고품질 형상 정보</span>를 시각화할 수 있습니다.</span>
                                </div>
                                <div className={bIntro.spatialFlexBox}>
                                    <span className={bIntro.spatialImgBox}>
                                        <span className={bIntro.spatialInforImg}></span>
                                    </span>
                                    <span className={bIntro.spatialTextBox}>
                                        <div className={bIntro.spTarget1}>체크포인트</div>
                                        <div className={bIntro.spSubFlex1}>
                                            <span className={bIntro.spCheckIcon}></span>
                                            <span className={bIntro.spSubTitle1}>
                                                <p>2D 도면과 이미지를 이용하여</p>
                                                <p>실내 공간 모델링 가능</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.spSubFlex2}>
                                            <span className={bIntro.spCheckIcon2}></span>
                                            <span className={bIntro.spSubTitle2}>
                                                <p>Google Sketch Up호환 및</p>
                                                <p>Topology기반 국제표준</p>
                                                <p>공간정보 모델링 구축 및 관리</p>
                                                <p></p>
                                                <p></p>
                                            </span>
                                        </div>
                                        <div className={bIntro.spSubFlex3}>
                                            <span className={bIntro.spCheckIcon3}></span>
                                            <span className={bIntro.spSubTitle3}>
                                                <p>기존 BIM 데이터 대비</p>
                                                <p>1/10수준의 경량화된</p>
                                                <p>실내 모델링 구축 가능</p>
                                            </span>
                                        </div>
                                    </span>
                                </div>
                                {/* <span className={bIntro.spatialBottomText}>{Resource.ID.performanceSect1.spatialTexts19}</span> */}
                            </div>
                        </div>
                        {/* ESOP */}
                        <div id="sectionESOP">
                            <div className={bIntro.eSopContentsSect}>
                                <span className={bIntro.eSopTitle2} data-aos="fade-down" data-aos-duration="1000">E-SOP</span>
                                <div className={bIntro.eSopTextBoxTop}>
                                    <span className={bIntro.eSopTexts1}><span>도서,매뉴얼 형식의</span><span className={bIntro.businessTextBold}>기존 표준행동절차를 디지털화하여 IT 기반 재난대응</span><span>에 활용합니다.</span></span>
                                    <span className={bIntro.eSopTexts2}>재난유형별 훈련 대응과 함께 실제 상황 발생시<span className={bIntro.businessTextBold}>단계별 행동 요령을 안내</span>하고</span>
                                    <span className={bIntro.eSopTexts3}>비상연락망을 통한 상황전파를 제공하여<span className={bIntro.businessTextBold}>신속하고 효율적인 재난 대응을 가능</span>하게 합니다.</span>
                                </div>
                                <div className={bIntro.eSopFlexBox}>
                                    <span className={bIntro.eSopImgBox}>
                                        <span className={bIntro.eSopImg}></span>
                                    </span>
                                    <span className={bIntro.eSopTextBox}>
                                        <div className={bIntro.eSopTarget1}>체크포인트</div>
                                        <div className={bIntro.eSopSubFlex1}>
                                            <span className={bIntro.eSopCheckIcon}></span>
                                            <span className={bIntro.eSopSubTitle1}>
                                                <p>표준행동절차를 GUI기반</p>
                                                <p>SW로 생성, 편집하여 DB로 저장</p>
                                                <p></p>
                                            </span>
                                        </div>
                                        <div className={bIntro.eSopSubFlex2}>
                                            <span className={bIntro.eSopCheckIcon2}></span>
                                            <span className={bIntro.eSopSubTitle2}>
                                                <p>DB화된 표준행동절차를 통한</p>
                                                <p>모의훈련 수행</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.eSopSubFlex3}>
                                            <span className={bIntro.eSopCheckIcon3}></span>
                                            <span className={bIntro.eSopSubTitle3}>
                                                <p>비상연락망 구축을 위한</p>
                                                <p>조직관리 및 문자</p>
                                                <p>방송, 카카오톡 등으로 상황전파</p>
                                                <p></p>
                                            </span>
                                        </div>
                                    </span>
                                </div>
                                {/* <span className={bIntro.eSopBottomText}>{Resource.ID.esopSect2.esopTexts18}</span> */}
                            </div>
                        </div>
                        {/* 데이터 시각화 */}
                        <div id="sectionData">
                            <div className={bIntro.dataVisualContentsSect}>
                                <span className={bIntro.dataTitle2} data-aos="fade-down" data-aos-duration="1000">데이터 시각화</span>
                                <div className={bIntro.dataTextBoxTop}>
                                    <span className={bIntro.dataTexts1}>다양한 형식의<span className={bIntro.businessTextBold}>데이터를 공간정보와 융복합하여 가시화 및 모니터링</span>합니다.</span>
                                    <span className={bIntro.dataTexts2}><span className={bIntro.businessTextBold}></span>시스템에 저장된<span className={bIntro.businessTextBold} style={{ marginRight: '8px' }}>업무정보 및 사용자 정보,</span>IoT 센서에서 수집된<span className={bIntro.businessTextBold}>실시간 모니터링 정보,</span></span>
                                    <span className={bIntro.dataTexts3}>AI/빅데이터 기술에서 도출된<span className={bIntro.businessTextBold}>분석/예측 정보를 실내외 공간정보와 결합하여 시각화</span>하여<span className={bIntro.businessTextBold}></span></span>
                                    <span className={bIntro.dataTexts4}>이를 테이블/ 표, 이벤트 스트림 등<span className={bIntro.businessTextBold}>다양한 방식으로 표출</span>합니다.</span>
                                </div>
                                <div className={bIntro.dataFlexBox}>
                                    <span className={bIntro.dataImgBox}>
                                        <span className={bIntro.dataImg}></span>
                                    </span>
                                    <span className={bIntro.dataTextBox}>
                                        <div className={bIntro.dataTarget1}>체크포인트</div>
                                        <div className={bIntro.dataSubFlex1}>
                                            <span className={bIntro.dataCheckIcon}></span>
                                            <span className={bIntro.dataSubTitle1}>
                                                <p>DBMS 및 파일, Log에 저장된</p>
                                                <p>업무 및 사용자 정보 시각화</p>
                                                <p></p>
                                            </span>
                                        </div>
                                        <div className={bIntro.dataSubFlex2}>
                                            <span className={bIntro.dataCheckIcon2}></span>
                                            <span className={bIntro.dataSubTitle2}>
                                                <p>IoT 센서에서 수집된</p>
                                                <p>실시간 이벤트 스트림 정보 시각화</p>
                                                <p></p>
                                            </span>
                                        </div>
                                        <div className={bIntro.dataSubFlex3}>
                                            <span className={bIntro.dataCheckIcon3}></span>
                                            <span className={bIntro.dataSubTitle3}>
                                                <p>3D 공간 및 시설물과 결합하여</p>
                                                <p>실시간 이벤트 및 과거 이력 시각화</p>
                                                <p></p>
                                            </span>
                                        </div>
                                    </span>
                                </div>
                                {/* <span className={bIntro.dataBottomText}>{Resource.ID.dataSect3.dataTexts16}</span> */}
                            </div>
                        </div>
                        {/* 시스템 통합구축 */}
                        <div id="sectionSystem">
                            <div className={bIntro.systemLinkContentsSect}>
                                <span className={bIntro.systemTitle2} data-aos="fade-down" data-aos-duration="1000">시스템 연계통합</span>
                                <div className={bIntro.systemTextBoxTop}>
                                    <span className={bIntro.systemTexts1}>여러 산업분야에서 사용되는<span className={bIntro.businessTextBold}>시스템 및 센서, 데이터를 연계 및 통합 구축</span>합니다.</span>
                                    <span className={bIntro.systemTexts2}><span className={bIntro.businessTextBold}></span><span /* className={bIntro.businessTextBold}*/ >고객이 사용중인</span><span className={bIntro.businessTextBold}>레거시 시스템 및 CCTV, 센서</span>와</span>
                                    <span className={bIntro.systemTexts3}><span className={bIntro.businessTextBold}>신규 IoT 센서, 웹 서비스의 연계/ 통합</span>이 가능하며</span>
                                    <span className={bIntro.systemTexts4}><span className={bIntro.businessTextBold}>API를 활용한 시스템 연계, 온프레미스의 클라우드 전환</span><span>을 지원합니다.</span><span className={bIntro.businessTextBold}></span></span>
                                </div>
                                <div className={bIntro.systemFlexBox}>
                                    <span className={bIntro.systemImgBox}>
                                        <span className={bIntro.systemImg}></span>
                                    </span>
                                    <span className={bIntro.systemTextBox}>
                                        <div className={bIntro.systemTarget1}>체크포인트</div>
                                        <div className={bIntro.systemSubFlex1}>
                                            <span className={bIntro.systemCheckIcon}></span>
                                            <span className={bIntro.systemSubTitle1}>
                                                <p>화재, 누출, 지진 등</p>
                                                <p>개별 프로토콜로 동작하는</p>
                                                <p>센서 연동 서버 구축</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.systemSubFlex2}>
                                            <span className={bIntro.systemCheckIcon2}></span>
                                            <span className={bIntro.systemSubTitle2}>
                                                <p>CCTV 이벤트 연동 및</p>
                                                <p>WEB 기반 영상 표출 분리</p>
                                                <p></p>
                                            </span>
                                        </div>
                                        <div className={bIntro.systemSubFlex3}>
                                            <span className={bIntro.systemCheckIcon3}></span>
                                            <span className={bIntro.systemSubTitle3}>
                                                <p>Windows, Linux B/E 지원 및</p>
                                                <p>WEB 기반 Frontend 제공으로</p>
                                                <p>SaaS 전환 용이</p>
                                            </span>
                                        </div>
                                    </span>
                                </div>
                                {/*  <span className={bIntro.systemBottomText}>{Resource.ID.systemSect4.systemTexts15}</span> */}
                            </div>
                        </div>
                        {/* 특허 및 인증 */}
                        <div id="sectionPatent">
                            <div className={bIntro.contentBox}>
                                <div className={bIntro.comPatContent}>
                                    {/************* 특허 *************/}
                                    <div className={bIntro.comPatConTItle2} data-aos="fade-down" data-aos-duration="1000">특허 및 인증</div>
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comPatConTItle}>특허</div>
                                    <div className={bIntro.comPatentBox}>
                                        <div className={bIntro.ParFirst}>
                                            <span className={bIntro.ParFirstBox1}>
                                                <span className={bIntro.ParFirstImg}></span>
                                                <span className={bIntro.ParFirstText}>훈련 중 상황에 따른 적응적</span>
                                                <span className={bIntro.ParFirstText2}>SOP 제공방법 및 그 시스템</span>
                                                <span className={bIntro.ParFirstText3}>(2022)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox2}>
                                                <span className={bIntro.ParFirstImg2}></span>
                                                <span className={bIntro.ParFirstText4}>조직 상황에 따른 적용적 SOP</span>
                                                <span className={bIntro.ParFirstText5}>제공방법 및 그 시스템</span>
                                                <span className={bIntro.ParFirstText6}>(2022)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox3}>
                                                <span className={bIntro.ParFirstImg3}></span>
                                                <span className={bIntro.ParFirstText7}>위기경보 수준 관리방법 및</span>
                                                <span className={bIntro.ParFirstText8}>그 시스템</span>
                                                <span className={bIntro.ParFirstText9}>(2022)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox4}>
                                                <span className={bIntro.ParFirstImg4}></span>
                                                <span className={bIntro.ParFirstText10}>동적 비행 제한구역 운영방법 및</span>
                                                <span className={bIntro.ParFirstText11}>그 시스템</span>
                                                <span className={bIntro.ParFirstText12}>(2021)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox5}>
                                                <span className={bIntro.ParFirstImg5}></span>
                                                <span className={bIntro.ParFirstText13}>공간정보 전환시스템 및 그 방법</span>
                                                <span className={bIntro.ParFirstText14}>(2021)</span>
                                                <span className={bIntro.ParFirstText15}></span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParSecond}>
                                            <span className={bIntro.ParSecondBox1}>
                                                <span className={bIntro.ParSecondImg}></span>
                                                <span className={bIntro.ParSecondText}>삼차원 비행경로 가시화 방법 및</span>
                                                <span className={bIntro.ParSecondText2}>그 시스템</span>
                                                <span className={bIntro.ParSecondText3}>(2021)</span>
                                            </span>
                                            <span className={bIntro.ParSecondBox2}>
                                                <span className={bIntro.ParSecondImg2}></span>
                                                <span className={bIntro.ParSecondText4}>재난상황 전파 방법 및</span>
                                                <span className={bIntro.ParSecondText5}>이를 위한 시스템</span>
                                                <span className={bIntro.ParSecondText6}>(2020)</span>
                                            </span>
                                            <span className={bIntro.ParSecondBox3}>
                                                <span className={bIntro.ParSecondImg3}></span>
                                                <span className={bIntro.ParSecondText7}>훈련 신 생성이 가능한 재난대응</span>
                                                <span className={bIntro.ParSecondText8}>훈련 방법 및 그 시스템</span>
                                                <span className={bIntro.ParSecondText9}>(2020)</span>
                                            </span>
                                            <span className={bIntro.ParSecondBox4}>
                                                <span className={bIntro.ParSecondImg4}></span>
                                                <span className={bIntro.ParSecondText10}>연계 SOP 생성방법 및</span>
                                                <span className={bIntro.ParSecondText11}>그 시스템</span>
                                                <span className={bIntro.ParSecondText12}>(2020)</span>
                                            </span>
                                            <span className={bIntro.ParSecondBox5}>
                                                <span className={bIntro.ParSecondImg5}></span>
                                                <span className={bIntro.ParSecondText13}>지능형 재난대응 훈련 방법 및</span>
                                                <span className={bIntro.ParSecondText14}>그 시스템</span>
                                                <span className={bIntro.ParSecondText15}>(2019)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParThird}>
                                            <span className={bIntro.ParThirdBox1}>
                                                <span className={bIntro.ParThirdImg}></span>
                                                <span className={bIntro.ParThirdText}>환경 오염 예측 시스템 및 그 방법</span>
                                                <span className={bIntro.ParThirdText2}>(2017)</span>
                                                <span className={bIntro.ParThirdText3}></span>
                                            </span>
                                            <span className={bIntro.ParThirdBox2}>
                                                <span className={bIntro.ParThirdImg2}></span>
                                                <span className={bIntro.ParThirdText4}>재해 시 행동 지원 시스템(일본)</span>
                                                <span className={bIntro.ParThirdText5}>(2016)</span>
                                                <span className={bIntro.ParThirdText6}></span>
                                            </span>
                                            <span className={bIntro.ParThirdBox3}>
                                                <span className={bIntro.ParThirdImg3}></span>
                                                <span className={bIntro.ParThirdText7}>재난 감지시스템 및 그 제공 방법</span>
                                                <span className={bIntro.ParThirdText8}>(2015)</span>
                                                <span className={bIntro.ParThirdText9}></span>
                                            </span>
                                            <span className={bIntro.ParThirdBox4}>
                                                <span className={bIntro.ParThirdImg4}></span>
                                                <span className={bIntro.ParThirdText10}>SOP 시나리오 구동 시스템 및</span>
                                                <span className={bIntro.ParThirdText11}>그 제공 방법 (2015)</span>
                                                <span className={bIntro.ParThirdText12}></span>
                                            </span>
                                            <span className={bIntro.ParThirdBox5}>
                                                <span className={bIntro.ParThirdImg5}></span>
                                                <span className={bIntro.ParThirdText13}>생태환경 평가 시스템 및 그 방법</span>
                                                <span className={bIntro.ParThirdText14}>(2014)</span>
                                                <span className={bIntro.ParThirdText15}></span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParFourth}>
                                            <span className={bIntro.ParFourthBox1}>
                                                <span className={bIntro.ParFourthImg}></span>
                                                <span className={bIntro.ParFourthText}>위치 기반 지능형 SOP 시스템</span>
                                                <span className={bIntro.ParFourthText2}>및 그 제공 방법</span>
                                                <span className={bIntro.ParFourthText3}>(2013)</span>
                                            </span>
                                            <span className={bIntro.ParFourthBox2}></span>
                                            <span className={bIntro.ParFourthBox3}></span>
                                            <span className={bIntro.ParFourthBox4}></span>
                                            <span className={bIntro.ParFourthBox5}></span>
                                        </div>
                                    </div>

                                    {/************* 인증 *************/}
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comCertifiedTItle}>인증</div>
                                    <div className={bIntro.comCertifiedBox}>
                                        <div className={bIntro.CerFirst}>
                                            <span className={bIntro.CerFirstBox}>
                                                <span className={bIntro.CerFirstImg}></span>
                                                <span className={bIntro.CerFirstText}>스마트 재난관리 시스템</span>
                                                <span className={bIntro.CerFirstText2}>TTA GS(1등급) 인증</span>
                                                <span className={bIntro.CerFirstText3}>(2022)</span>
                                            </span>
                                            <span className={bIntro.CerFirstBox2}>
                                                <span className={bIntro.CerFirstImg2}></span>
                                                <span className={bIntro.CerFirstText4}>벤처기업 확인서</span>
                                                <span className={bIntro.CerFirstText5}>(2022)</span>
                                                <span className={bIntro.CerFirstText6}></span>
                                            </span>
                                            <span className={bIntro.CerFirstBox3}>
                                                <span className={bIntro.CerFirstImg3}></span>
                                                <span className={bIntro.CerFirstText7}>기업부설연구소 인정서</span>
                                                <span className={bIntro.CerFirstText8}>(2022)</span>
                                                <span className={bIntro.CerFirstText9}></span>
                                            </span>
                                            <span className={bIntro.CerFirstBox4}>
                                                <span className={bIntro.CerFirstImg4}></span>
                                                <span className={bIntro.CerFirstText10}>ICT 기업성장지원 디지털 뉴딜</span>
                                                <span className={bIntro.CerFirstText11}>우수성과 창출기업</span>
                                                <span className={bIntro.CerFirstText12}>(2021)</span>
                                            </span>
                                            <span className={bIntro.CerFirstBox5}>
                                                <span className={bIntro.CerFirstImg5}></span>
                                                <span className={bIntro.CerFirstText13}>이노비즈 확인서</span>
                                                <span className={bIntro.CerFirstText14}>(2021)</span>
                                                <span className={bIntro.CerFirstText15}></span>
                                            </span>
                                        </div>
                                        <div className={bIntro.CerSecond}>
                                            <span className={bIntro.CerSecondBox}>
                                                <span className={bIntro.CerSecondImg}></span>
                                                <span className={bIntro.CerSecondText}>소프트웨어 사업자 신고확인서</span>
                                                <span className={bIntro.CerSecondText2}>(2021)</span>
                                                <span className={bIntro.CerSecondText3}></span>
                                            </span>
                                            <span className={bIntro.CerSecondBox2}>
                                                <span className={bIntro.CerSecondImg2}></span>
                                                <span className={bIntro.CerSecondText4}>직접생산확인 증명서</span>
                                                <span className={bIntro.CerSecondText5}>(2021)</span>
                                                <span className={bIntro.CerSecondText6}></span>
                                            </span>
                                            <span className={bIntro.CerSecondBox3}>
                                                <span className={bIntro.CerSecondImg3}></span>
                                                <span className={bIntro.CerSecondText7}>정보통신공사업 등록증</span>
                                                <span className={bIntro.CerSecondText8}>(2020)</span>
                                                <span className={bIntro.CerSecondText9}></span>
                                            </span>
                                            <span className={bIntro.CerSecondBox4}></span>
                                            <span className={bIntro.CerSecondBox5}></span>
                                        </div>
                                    </div>
                                    {/************* 수상 *************/}
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comPrizeTItle}>수상</div>
                                    <div className={bIntro.comPrizeBox}>
                                        <div className={bIntro.PrizeFirst}>
                                            <span className={bIntro.PrizeFirstBox}>
                                                <span className={bIntro.PrizeFirstImg}></span>
                                                <span className={bIntro.PrizeFirstText}>한국가스안전공사 표창</span>
                                                <span className={bIntro.PrizeFirstText2}>(2023)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox2}>
                                                <span className={bIntro.PrizeFirstImg2}></span>
                                                <span className={bIntro.PrizeFirstText4}>행정안전부장관 표창</span>
                                                <span className={bIntro.PrizeFirstText5}>(2020)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox3}>
                                                <span className={bIntro.PrizeFirstImg3}></span>
                                                <span className={bIntro.PrizeFirstText7}>중소기업중앙회 표창</span>
                                                <span className={bIntro.PrizeFirstText8}>(2020)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox4}>
                                                <span className={bIntro.PrizeFirstImg4}></span>
                                                <span className={bIntro.PrizeFirstText10}>대구광역시장 표창</span>
                                                <span className={bIntro.PrizeFirstText11}>(2019)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox5}>
                                                <span className={bIntro.PrizeFirstImg5}></span>
                                                <span className={bIntro.PrizeFirstText13}>행정안전부장관 표창</span>
                                                <span className={bIntro.PrizeFirstText14}>(2018)</span>
                                            </span>
                                        </div>
                                    </div>
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
            displayPerformanceUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={bIntro.bIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">보유기술</span>
                            <span data-aos="fade-down" data-aos-duration="1000">유엔이가 보유한 안전관리 및 디지털 트윈 기술 역량과 관련 특허, 인증을 소개합니다.</span>
                        </div>
                        {/* 공간정보 구축 */}
                        <div id="sectionInforBuild">
                            <div className={bIntro.spatialInforContentsSect}>
                                <span className={bIntro.spatialTitle2} data-aos="fade-down" data-aos-duration="1000">공간정보 구축</span>
                                <div className={bIntro.spatialTextBoxTop}>
                                    <span className={bIntro.spatialTexts1}>WEB 및 C/S 환경에서 원활하게 동작하는<span className={bIntro.businessTextBold}>최적의 실내외 공간정보를 구축, 관리</span><span>합니다.</span></span>
                                    <span className={bIntro.spatialTexts2}>IndoorGML 기반의 데이터 체계로 기존 시스템 및 센서 연동, 서비스 확장이 용이하며</span>
                                    <span className={bIntro.spatialTexts3}>3차원 공간 상에<span className={bIntro.businessTextBold}>LoD 4 기준 이상의 고품질 형상 정보</span>를 시각화할 수 있습니다.</span>
                                </div>
                                <div className={bIntro.spatialFlexBox}>
                                    <span className={bIntro.spatialImgBox}>
                                        <span className={bIntro.spatialInforImg}></span>
                                    </span>
                                    <span className={bIntro.spatialTextBox}>
                                        <div className={bIntro.spTarget1}>체크포인트</div>
                                        <div className={bIntro.spSubFlex1}>
                                            <span className={bIntro.spCheckIcon}></span>
                                            <span className={bIntro.spSubTitle1}>
                                                <p>2D 도면과 이미지를 이용하여</p>
                                                <p>실내 공간 모델링 가능</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.spSubFlex2}>
                                            <span className={bIntro.spCheckIcon2}></span>
                                            <span className={bIntro.spSubTitle2}>
                                                <p>Google Sketch Up호환 및</p>
                                                <p>Topology기반 국제표준</p>
                                                <p>공간정보 모델링 구축 및 관리</p>
                                                <p></p>
                                                <p></p>
                                            </span>
                                        </div>
                                        <div className={bIntro.spSubFlex3}>
                                            <span className={bIntro.spCheckIcon3}></span>
                                            <span className={bIntro.spSubTitle3}>
                                                <p>기존 BIM 데이터 대비</p>
                                                <p>1/10수준의 경량화된</p>
                                                <p>실내 모델링 구축 가능</p>
                                            </span>
                                        </div>
                                    </span>
                                </div>
                                {/* <span className={bIntro.spatialBottomText}>{Resource.ID.performanceSect1.spatialTexts19}</span> */}
                            </div>
                        </div>
                        {/* ESOP */}
                        <div id="sectionESOP">
                            <div className={bIntro.eSopContentsSect}>
                                <span className={bIntro.eSopTitle2} data-aos="fade-down" data-aos-duration="1000">E-SOP</span>
                                <div className={bIntro.eSopTextBoxTop}>
                                    <span className={bIntro.eSopTexts1}><span>도서,매뉴얼 형식의</span><span className={bIntro.businessTextBold}>기존 표준행동절차를 디지털화하여 IT 기반 재난대응</span><span>에 활용합니다.</span></span>
                                    <span className={bIntro.eSopTexts2}>재난유형별 훈련 대응과 함께 실제 상황 발생시<span className={bIntro.businessTextBold}>단계별 행동 요령을 안내</span>하고</span>
                                    <span className={bIntro.eSopTexts3}>비상연락망을 통한 상황전파를 제공하여<span className={bIntro.businessTextBold}>신속하고 효율적인 재난 대응을 가능</span>하게 합니다.</span>
                                </div>
                                <div className={bIntro.eSopFlexBox}>
                                    <span className={bIntro.eSopImgBox}>
                                        <span className={bIntro.eSopImg}></span>
                                    </span>
                                    <span className={bIntro.eSopTextBox}>
                                        <div className={bIntro.eSopTarget1}>체크포인트</div>
                                        <div className={bIntro.eSopSubFlex1}>
                                            <span className={bIntro.eSopCheckIcon}></span>
                                            <span className={bIntro.eSopSubTitle1}>
                                                <p>표준행동절차를 GUI기반</p>
                                                <p>SW로 생성, 편집하여 DB로 저장</p>
                                                <p></p>
                                            </span>
                                        </div>
                                        <div className={bIntro.eSopSubFlex2}>
                                            <span className={bIntro.eSopCheckIcon2}></span>
                                            <span className={bIntro.eSopSubTitle2}>
                                                <p>DB화된 표준행동절차를 통한</p>
                                                <p>모의훈련 수행</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.eSopSubFlex3}>
                                            <span className={bIntro.eSopCheckIcon3}></span>
                                            <span className={bIntro.eSopSubTitle3}>
                                                <p>비상연락망 구축을 위한</p>
                                                <p>조직관리 및 문자</p>
                                                <p>방송, 카카오톡 등으로 상황전파</p>
                                                <p></p>
                                            </span>
                                        </div>
                                    </span>
                                </div>
                                {/* <span className={bIntro.eSopBottomText}>{Resource.ID.esopSect2.esopTexts18}</span> */}
                            </div>
                        </div>
                        {/* 데이터 시각화 */}
                        <div id="sectionData">
                            <div className={bIntro.dataVisualContentsSect}>
                                <span className={bIntro.dataTitle2} data-aos="fade-down" data-aos-duration="1000">데이터 시각화</span>
                                <div className={bIntro.dataTextBoxTop}>
                                    <span className={bIntro.dataTexts1}>다양한 형식의<span className={bIntro.businessTextBold}>데이터를 공간정보와 융복합하여 가시화 및 모니터링</span>합니다.</span>
                                    <span className={bIntro.dataTexts2}><span className={bIntro.businessTextBold}></span>시스템에 저장된<span className={bIntro.businessTextBold} style={{ marginRight: '8px' }}>업무정보 및 사용자 정보,</span>IoT 센서에서 수집된<span className={bIntro.businessTextBold}>실시간 모니터링 정보,</span></span>
                                    <span className={bIntro.dataTexts3}>AI/빅데이터 기술에서 도출된<span className={bIntro.businessTextBold}>분석/예측 정보를 실내외 공간정보와 결합하여 시각화</span>하여<span className={bIntro.businessTextBold}></span></span>
                                    <span className={bIntro.dataTexts4}>이를 테이블/ 표, 이벤트 스트림 등<span className={bIntro.businessTextBold}>다양한 방식으로 표출</span>합니다.</span>
                                </div>
                                <div className={bIntro.dataFlexBox}>
                                    <span className={bIntro.dataImgBox}>
                                        <span className={bIntro.dataImg}></span>
                                    </span>
                                    <span className={bIntro.dataTextBox}>
                                        <div className={bIntro.dataTarget1}>체크포인트</div>
                                        <div className={bIntro.dataSubFlex1}>
                                            <span className={bIntro.dataCheckIcon}></span>
                                            <span className={bIntro.dataSubTitle1}>
                                                <p>DBMS 및 파일, Log에 저장된</p>
                                                <p>업무 및 사용자 정보 시각화</p>
                                                <p></p>
                                            </span>
                                        </div>
                                        <div className={bIntro.dataSubFlex2}>
                                            <span className={bIntro.dataCheckIcon2}></span>
                                            <span className={bIntro.dataSubTitle2}>
                                                <p>IoT 센서에서 수집된</p>
                                                <p>실시간 이벤트 스트림 정보 시각화</p>
                                                <p></p>
                                            </span>
                                        </div>
                                        <div className={bIntro.dataSubFlex3}>
                                            <span className={bIntro.dataCheckIcon3}></span>
                                            <span className={bIntro.dataSubTitle3}>
                                                <p>3D 공간 및 시설물과 결합하여</p>
                                                <p>실시간 이벤트 및 과거 이력 시각화</p>
                                                <p></p>
                                            </span>
                                        </div>
                                    </span>
                                </div>
                                {/* <span className={bIntro.dataBottomText}>{Resource.ID.dataSect3.dataTexts16}</span> */}
                            </div>
                        </div>
                        {/* 시스템 통합구축 */}
                        <div id="sectionSystem">
                            <div className={bIntro.systemLinkContentsSect}>
                                <span className={bIntro.systemTitle2} data-aos="fade-down" data-aos-duration="1000">시스템 연계통합</span>
                                <div className={bIntro.systemTextBoxTop}>
                                    <span className={bIntro.systemTexts1}>여러 산업분야에서 사용되는<span className={bIntro.businessTextBold}>시스템 및 센서, 데이터를 연계 및 통합 구축</span>합니다.</span>
                                    <span className={bIntro.systemTexts2}><span className={bIntro.businessTextBold}></span><span /* className={bIntro.businessTextBold}*/ >고객이 사용중인</span><span className={bIntro.businessTextBold}>레거시 시스템 및 CCTV, 센서</span>와</span>
                                    <span className={bIntro.systemTexts3}><span className={bIntro.businessTextBold}>신규 IoT 센서, 웹 서비스의 연계/ 통합</span>이 가능하며</span>
                                    <span className={bIntro.systemTexts4}><span className={bIntro.businessTextBold}>API를 활용한 시스템 연계, 온프레미스의 클라우드 전환</span><span>을 지원합니다.</span><span className={bIntro.businessTextBold}></span></span>
                                </div>
                                <div className={bIntro.systemFlexBox}>
                                    <span className={bIntro.systemImgBox}>
                                        <span className={bIntro.systemImg}></span>
                                    </span>
                                    <span className={bIntro.systemTextBox}>
                                        <div className={bIntro.systemTarget1}>체크포인트</div>
                                        <div className={bIntro.systemSubFlex1}>
                                            <span className={bIntro.systemCheckIcon}></span>
                                            <span className={bIntro.systemSubTitle1}>
                                                <p>화재, 누출, 지진 등</p>
                                                <p>개별 프로토콜로 동작하는</p>
                                                <p>센서 연동 서버 구축</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.systemSubFlex2}>
                                            <span className={bIntro.systemCheckIcon2}></span>
                                            <span className={bIntro.systemSubTitle2}>
                                                <p>CCTV 이벤트 연동 및</p>
                                                <p>WEB 기반 영상 표출 분리</p>
                                                <p></p>
                                            </span>
                                        </div>
                                        <div className={bIntro.systemSubFlex3}>
                                            <span className={bIntro.systemCheckIcon3}></span>
                                            <span className={bIntro.systemSubTitle3}>
                                                <p>Windows, Linux B/E 지원 및</p>
                                                <p>WEB 기반 Frontend 제공으로</p>
                                                <p>SaaS 전환 용이</p>
                                            </span>
                                        </div>
                                    </span>
                                </div>
                                {/*  <span className={bIntro.systemBottomText}>{Resource.ID.systemSect4.systemTexts15}</span> */}
                            </div>
                        </div>
                        {/* 특허 및 인증 */}
                        <div id="sectionPatent">
                            <div className={bIntro.contentBox}>
                                <div className={bIntro.comPatContent}>
                                    {/************* 특허 *************/}
                                    <div className={bIntro.comPatConTItle2} data-aos="fade-down" data-aos-duration="1000">특허 및 인증</div>
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comPatConTItle}>특허</div>
                                    <div className={bIntro.comPatentBox}>
                                        <div className={bIntro.ParFirst}>
                                            <span className={bIntro.ParFirstBox1}>
                                                <span className={bIntro.ParFirstImg}></span>
                                                <span className={bIntro.ParFirstText}>훈련 중 상황에 따른 적응적</span>
                                                <span className={bIntro.ParFirstText2}>SOP 제공방법 및 그 시스템</span>
                                                <span className={bIntro.ParFirstText3}>(2022)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox2}>
                                                <span className={bIntro.ParFirstImg2}></span>
                                                <span className={bIntro.ParFirstText4}>조직 상황에 따른 적용적 SOP</span>
                                                <span className={bIntro.ParFirstText5}>제공방법 및 그 시스템</span>
                                                <span className={bIntro.ParFirstText6}>(2022)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox3}>
                                                <span className={bIntro.ParFirstImg3}></span>
                                                <span className={bIntro.ParFirstText7}>위기경보 수준 관리방법 및</span>
                                                <span className={bIntro.ParFirstText8}>그 시스템</span>
                                                <span className={bIntro.ParFirstText9}>(2022)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox4}>
                                                <span className={bIntro.ParFirstImg4}></span>
                                                <span className={bIntro.ParFirstText10}>동적 비행 제한구역 운영방법 및</span>
                                                <span className={bIntro.ParFirstText11}>그 시스템</span>
                                                <span className={bIntro.ParFirstText12}>(2021)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox5}>
                                                <span className={bIntro.ParFirstImg5}></span>
                                                <span className={bIntro.ParFirstText13}>공간정보 전환시스템 및 그 방법</span>
                                                <span className={bIntro.ParFirstText14}>(2021)</span>
                                                <span className={bIntro.ParFirstText15}></span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParSecond}>
                                            <span className={bIntro.ParSecondBox1}>
                                                <span className={bIntro.ParSecondImg}></span>
                                                <span className={bIntro.ParSecondText}>삼차원 비행경로 가시화 방법 및</span>
                                                <span className={bIntro.ParSecondText2}>그 시스템</span>
                                                <span className={bIntro.ParSecondText3}>(2021)</span>
                                            </span>
                                            <span className={bIntro.ParSecondBox2}>
                                                <span className={bIntro.ParSecondImg2}></span>
                                                <span className={bIntro.ParSecondText4}>재난상황 전파 방법 및</span>
                                                <span className={bIntro.ParSecondText5}>이를 위한 시스템</span>
                                                <span className={bIntro.ParSecondText6}>(2020)</span>
                                            </span>
                                            <span className={bIntro.ParSecondBox3}>
                                                <span className={bIntro.ParSecondImg3}></span>
                                                <span className={bIntro.ParSecondText7}>훈련 신 생성이 가능한 재난대응</span>
                                                <span className={bIntro.ParSecondText8}>훈련 방법 및 그 시스템</span>
                                                <span className={bIntro.ParSecondText9}>(2020)</span>
                                            </span>
                                            <span className={bIntro.ParSecondBox4}>
                                                <span className={bIntro.ParSecondImg4}></span>
                                                <span className={bIntro.ParSecondText10}>연계 SOP 생성방법 및</span>
                                                <span className={bIntro.ParSecondText11}>그 시스템</span>
                                                <span className={bIntro.ParSecondText12}>(2020)</span>
                                            </span>
                                            <span className={bIntro.ParSecondBox5}>
                                                <span className={bIntro.ParSecondImg5}></span>
                                                <span className={bIntro.ParSecondText13}>지능형 재난대응 훈련 방법 및</span>
                                                <span className={bIntro.ParSecondText14}>그 시스템</span>
                                                <span className={bIntro.ParSecondText15}>(2019)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParThird}>
                                            <span className={bIntro.ParThirdBox1}>
                                                <span className={bIntro.ParThirdImg}></span>
                                                <span className={bIntro.ParThirdText}>환경 오염 예측 시스템 및 그 방법</span>
                                                <span className={bIntro.ParThirdText2}>(2017)</span>
                                                <span className={bIntro.ParThirdText3}></span>
                                            </span>
                                            <span className={bIntro.ParThirdBox2}>
                                                <span className={bIntro.ParThirdImg2}></span>
                                                <span className={bIntro.ParThirdText4}>재해 시 행동 지원 시스템(일본)</span>
                                                <span className={bIntro.ParThirdText5}>(2016)</span>
                                                <span className={bIntro.ParThirdText6}></span>
                                            </span>
                                            <span className={bIntro.ParThirdBox3}>
                                                <span className={bIntro.ParThirdImg3}></span>
                                                <span className={bIntro.ParThirdText7}>재난 감지시스템 및 그 제공 방법</span>
                                                <span className={bIntro.ParThirdText8}>(2015)</span>
                                                <span className={bIntro.ParThirdText9}></span>
                                            </span>
                                            <span className={bIntro.ParThirdBox4}>
                                                <span className={bIntro.ParThirdImg4}></span>
                                                <span className={bIntro.ParThirdText10}>SOP 시나리오 구동 시스템 및</span>
                                                <span className={bIntro.ParThirdText11}>그 제공 방법 (2015)</span>
                                                <span className={bIntro.ParThirdText12}></span>
                                            </span>
                                            <span className={bIntro.ParThirdBox5}>
                                                <span className={bIntro.ParThirdImg5}></span>
                                                <span className={bIntro.ParThirdText13}>생태환경 평가 시스템 및 그 방법</span>
                                                <span className={bIntro.ParThirdText14}>(2014)</span>
                                                <span className={bIntro.ParThirdText15}></span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParFourth}>
                                            <span className={bIntro.ParFourthBox1}>
                                                <span className={bIntro.ParFourthImg}></span>
                                                <span className={bIntro.ParFourthText}>위치 기반 지능형 SOP 시스템</span>
                                                <span className={bIntro.ParFourthText2}>및 그 제공 방법</span>
                                                <span className={bIntro.ParFourthText3}>(2013)</span>
                                            </span>
                                            <span className={bIntro.ParFourthBox2}></span>
                                            <span className={bIntro.ParFourthBox3}></span>
                                            <span className={bIntro.ParFourthBox4}></span>
                                            <span className={bIntro.ParFourthBox5}></span>
                                        </div>
                                    </div>

                                    {/************* 인증 *************/}
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comCertifiedTItle}>인증</div>
                                    <div className={bIntro.comCertifiedBox}>
                                        <div className={bIntro.CerFirst}>
                                            <span className={bIntro.CerFirstBox}>
                                                <span className={bIntro.CerFirstImg}></span>
                                                <span className={bIntro.CerFirstText}>스마트 재난관리 시스템</span>
                                                <span className={bIntro.CerFirstText2}>TTA GS(1등급) 인증</span>
                                                <span className={bIntro.CerFirstText3}>(2022)</span>
                                            </span>
                                            <span className={bIntro.CerFirstBox2}>
                                                <span className={bIntro.CerFirstImg2}></span>
                                                <span className={bIntro.CerFirstText4}>벤처기업 확인서</span>
                                                <span className={bIntro.CerFirstText5}>(2022)</span>
                                                <span className={bIntro.CerFirstText6}></span>
                                            </span>
                                            <span className={bIntro.CerFirstBox3}>
                                                <span className={bIntro.CerFirstImg3}></span>
                                                <span className={bIntro.CerFirstText7}>기업부설연구소 인정서</span>
                                                <span className={bIntro.CerFirstText8}>(2022)</span>
                                                <span className={bIntro.CerFirstText9}></span>
                                            </span>
                                            <span className={bIntro.CerFirstBox4}>
                                                <span className={bIntro.CerFirstImg4}></span>
                                                <span className={bIntro.CerFirstText10}>ICT 기업성장지원 디지털 뉴딜</span>
                                                <span className={bIntro.CerFirstText11}>우수성과 창출기업</span>
                                                <span className={bIntro.CerFirstText12}>(2021)</span>
                                            </span>
                                            <span className={bIntro.CerFirstBox5}>
                                                <span className={bIntro.CerFirstImg5}></span>
                                                <span className={bIntro.CerFirstText13}>이노비즈 확인서</span>
                                                <span className={bIntro.CerFirstText14}>(2021)</span>
                                                <span className={bIntro.CerFirstText15}></span>
                                            </span>
                                        </div>
                                        <div className={bIntro.CerSecond}>
                                            <span className={bIntro.CerSecondBox}>
                                                <span className={bIntro.CerSecondImg}></span>
                                                <span className={bIntro.CerSecondText}>소프트웨어 사업자 신고확인서</span>
                                                <span className={bIntro.CerSecondText2}>(2021)</span>
                                                <span className={bIntro.CerSecondText3}></span>
                                            </span>
                                            <span className={bIntro.CerSecondBox2}>
                                                <span className={bIntro.CerSecondImg2}></span>
                                                <span className={bIntro.CerSecondText4}>직접생산확인 증명서</span>
                                                <span className={bIntro.CerSecondText5}>(2021)</span>
                                                <span className={bIntro.CerSecondText6}></span>
                                            </span>
                                            <span className={bIntro.CerSecondBox3}>
                                                <span className={bIntro.CerSecondImg3}></span>
                                                <span className={bIntro.CerSecondText7}>정보통신공사업 등록증</span>
                                                <span className={bIntro.CerSecondText8}>(2020)</span>
                                                <span className={bIntro.CerSecondText9}></span>
                                            </span>
                                            <span className={bIntro.CerSecondBox4}></span>
                                            <span className={bIntro.CerSecondBox5}></span>
                                        </div>
                                    </div>
                                    {/************* 수상 *************/}
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comPrizeTItle}>수상</div>
                                    <div className={bIntro.comPrizeBox}>
                                        <div className={bIntro.PrizeFirst}>
                                            <span className={bIntro.PrizeFirstBox}>
                                                <span className={bIntro.PrizeFirstImg}></span>
                                                <span className={bIntro.PrizeFirstText}>한국가스안전공사 표창</span>
                                                <span className={bIntro.PrizeFirstText2}>(2023)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox2}>
                                                <span className={bIntro.PrizeFirstImg2}></span>
                                                <span className={bIntro.PrizeFirstText4}>행정안전부장관 표창</span>
                                                <span className={bIntro.PrizeFirstText5}>(2020)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox3}>
                                                <span className={bIntro.PrizeFirstImg3}></span>
                                                <span className={bIntro.PrizeFirstText7}>중소기업중앙회 표창</span>
                                                <span className={bIntro.PrizeFirstText8}>(2020)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox4}>
                                                <span className={bIntro.PrizeFirstImg4}></span>
                                                <span className={bIntro.PrizeFirstText10}>대구광역시장 표창</span>
                                                <span className={bIntro.PrizeFirstText11}>(2019)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox5}>
                                                <span className={bIntro.PrizeFirstImg5}></span>
                                                <span className={bIntro.PrizeFirstText13}>행정안전부장관 표창</span>
                                                <span className={bIntro.PrizeFirstText14}>(2018)</span>
                                            </span>
                                        </div>
                                    </div>
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
            displayPerformanceUI.push(
                <></>
            );
        }
        return displayPerformanceUI;

    }

    render() {

        setTimeout(() => { this.resizeUI() }, 500);
        let displayPerformanceUI = this.state.disPerformanceUI;

        return (
            <>
                {displayPerformanceUI}
            </>
        );
    }
}

export default PerformanceSectionKor;