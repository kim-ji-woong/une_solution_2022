import React, { Component } from 'react';
import { Link } from "react-router-dom";
import cIntro from '../CompanyIntro/css/company.module.css';
import home from '../components/css/home.module.css';
import $ from 'jquery';

import AOS from "aos";
import "aos/dist/aos.css";
//import Resource from '../resource/id';

class CompanySectionKor extends Component {
    static displayName = CompanySectionKor.name;

    constructor(props) {
        super(props);

        this.state = {
            //disCompanyUI: null,
        }

        this.state.disCompanyUI = this.displayCompanyUI;
    }

    resizeUI() {
        this.setState({ disCompanyUI: this.displayCompanyUI() });
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

    displayCompanyUI = () => {
        let displayCompanyUI = [];
        let widthSize = window.outerWidth;

        if (widthSize < 768) {
            displayCompanyUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={cIntro.comIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">회사소개</span>
                            <span data-aos="fade-down" data-aos-duration="1000">유엔이의 대표이사 인사말, 비전과 가치, 연혁, CI를 소개합니다.</span>
                        </div>
                        {/* CEO 인사말 */}
                        <div className={cIntro.comGreeting} id="sectionCEO">
                            <span data-aos="fade-down" data-aos-duration="1000">CEO 인사말</span>
                            <div className={cIntro.ceoBox}>
                                <span className={cIntro.ceoPicture}></span>
                                <span className={cIntro.ceoBoxText}>대표이사<span className={cIntro.ceoBoldText}>여 욱 현</span></span>
                                <div className={cIntro.ceoTextBoxS}>
                                    <span>안전한 공간, 편안한 공간, 관리하기 쉬운 공간.</span>
                                    <span>스마트 세상의 공간을 오가는 우리에게는 짧은 시간이라도 안심할 수 있는 공간이 필요합니다.</span>
                                    <span>그 공간의 중심에 바로 저희 유엔이가 있습니다.</span>
                                    <span>유엔이는 사용자를 위한 안전하고 편리한 맞춤형 공간을 디지털 트윈 기반으로 제공하는 IT기술 기업입니다.</span>
                                    <span>축적된 기술과 노하우를 바탕으로 안전한 공간, 편리한 사용, 맞춤형 구축, 합리적 비용을 달성하기 위해</span>
                                    <span>끊임없이 노력하여 고객이 원하고 저희가 추구하는 공간의 안전 가치를 구현해 나가겠습니다.</span>
                                    <span>감사합니다.</span>
                                </div>
                            </div>
                        </div>
                        {/* vision */}
                        <div className={cIntro.comVision} id="sectionVision">
                            <span className={cIntro.comVTitle1} data-aos="fade-down" data-aos-duration="1000">비전 및 핵심가치</span>
                            <span className={cIntro.comVFlex}>
                                <span className={cIntro.comVCircle1}></span>
                                <span className={cIntro.comVTitle11}>비전</span>
                                {/* <span className={cIntro.comVShape}>
                                    <span className={cIntro.comVCircle1}></span>
                                    <span className={cIntro.comVLine}></span>
                                    <span className={cIntro.comVCircle2}></span>
                                </span> */}
                            </span>
                            <span className={cIntro.comVTextBox}><span className={cIntro.comVTitle2}>스마트 기술로 만드는 디지털 공간</span>
                                <span className={cIntro.blueFont}>안전하고 안심되는 공간이 되다</span></span>
                            <div className={cIntro.visionFlexBox}>
                                <div className={cIntro.vFlex1}>
                                    <div className={cIntro.vBox1}>핵심가치1</div>
                                    <div className={cIntro.vBox2}>
                                        <span><span className={cIntro.vBoldText}>S</span>MART</span>
                                        <span>4차 산업혁명</span>
                                        <span>최신 ICT 기술로</span>
                                        <span>더욱 스마트하게</span>
                                    </div>
                                </div>
                                <div className={cIntro.vFlex2}>
                                    <div className={cIntro.vBox3}>핵심가치2</div>
                                    <div className={cIntro.vBox4}>
                                        <span><span className={cIntro.vBoldText}>S</span>PACE</span>
                                        <span>디지털 트윈으로</span>
                                        <span>현실 공간을</span>
                                        <span>가상 공간으로 동기화</span>
                                    </div>
                                </div>
                            </div>
                            <div className={cIntro.visionFlexBox2}>
                                <div className={cIntro.vFlex3}>
                                    <div className={cIntro.vBox5}>핵심가치3</div>
                                    <div className={cIntro.vBox6}>
                                        <span><span className={cIntro.vBoldText}>S</span>AFETY</span>
                                        <span>사람 중심</span>
                                        <span>안전 제일이</span>
                                        <span>최우선 가치</span>
                                    </div>
                                </div>
                                <div className={cIntro.vFlex4}>
                                    <div className={cIntro.vBox7}>핵심가치4</div>
                                    <div className={cIntro.vBox8}>
                                        <span><span className={cIntro.vBoldText}>S</span>ECURITY</span>
                                        <span>신속하고</span>
                                        <span>체계적인 대응으로</span>
                                        <span>재난재해에서 안심</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* history */}
                        <span className={cIntro.comHisTitle2} id="sectionHistory" data-aos="fade-down" data-aos-duration="1000">주요 연혁</span>
                        <div className={cIntro.comHisContent}>
                            <div className={cIntro.comHisTable} border="1">
                                <div className={cIntro.com2022Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2024년</span>
                                    </span>
                                    <div className={cIntro.com2022BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>12월</span>
                                            <span className={cIntro.monthNumB}>00</span>
                                            <span className={cIntro.monthNum}>11월</span>
                                            <span className={cIntro.monthNum}>10월</span>
                                            <span className={cIntro.monthNum}>8월</span>
                                        </span>
                                        <span className={cIntro.comHisFlex3}>
                                            <span className={cIntro.historyText}>경기융합타운 대표도서관, 신용보증재단 재난관리시스템 구축</span>
                                            <span className={cIntro.historyText}>부산 신평/장림산단 디지털 트윈 기반 통합관제 시스템 구축</span>
                                            <span className={cIntro.historyText}>마곡 사이언스파크 재난관리시스템 구축</span>
                                            <span className={cIntro.historyText}>경기융합타운 종합방재실 재난관리시스템 구축</span>
                                            <span className={cIntro.historyText}>원익QNC 스마트재난시스템 구축</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2022Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2023년</span>
                                    </span>
                                    <div className={cIntro.com2022BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>12월</span>
                                            <span className={cIntro.monthNumB}>00</span>
                                            <span className={cIntro.monthNum}>10월</span>
                                            <span className={cIntro.monthNum}>7월</span>
                                            <span className={cIntro.monthNum}>6월</span>
                                        </span>
                                        <span className={cIntro.comHisFlex3}>
                                            <span className={cIntro.historyText}>목포시 강소형 스마트시티 조성사업 수주</span>
                                            <span className={cIntro.historyText}>여수 국가산업단지 환경모니터링 시스템 구축</span>
                                            <span className={cIntro.historyText}>과기정통부 디지털 트윈 혁신선도 사업(제조실증) 수행</span>
                                            <span className={cIntro.historyText}>강원랜드 중장기안전관리체계 컨설팅 수행</span>
                                            <span className={cIntro.historyText}>구독형 산업안전보건관리 서비스 ‘스마플’ 출시</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2022Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2022년</span>
                                    </span>
                                    <div className={cIntro.com2022BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>11월</span>
                                            <span className={cIntro.monthNum}>10월</span>
                                            <span className={cIntro.monthNum}>8월</span>
                                            <span className={cIntro.monthNumB}>00</span>
                                            <span className={cIntro.monthNum}>7월</span>
                                            <span className={cIntro.monthNum}>5월</span>
                                            <span className={cIntro.monthNumB}>00</span>
                                        </span>
                                        <span className={cIntro.comHisFlex3}>
                                            <span className={cIntro.historyText}>청량리 수자인 재난관리 시스템 구축</span>
                                            <span className={cIntro.historyText}>SDMS v1.0.1 GS인증 1등급 획득</span>
                                            <span className={cIntro.historyText}>기업부설연구소 이전</span>
                                            <span className={cIntro.historyText}>LG CNS Virtual Datacenter System</span>
                                            <span className={cIntro.historyText}>위기경보수준 관리방법 및 그 시스템 특허등록</span>
                                            <span className={cIntro.historyText}>조직 상황에 따른 적용적 SOP 제공 방법 및 그 시스템</span>
                                            <span className={cIntro.historyText}>훈련 중 상황에 따른 적응적 SOP 제공 방법 및 그 시스템(특허등록)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2021Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2021년</span>
                                    </span>
                                    <div className={cIntro.com2021BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>10월</span>
                                            <span className={cIntro.monthNum}>8월</span>
                                            <span className={cIntro.monthNum}>7월</span>
                                            <span className={cIntro.monthNum}>6월</span>
                                            <span className={cIntro.monthNumB}>00</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>동적 비행 제한 구역 운영 방법 및 그 시스템</span>
                                            <span className={cIntro.historyText}>공간 정보 전환 시스템 및 그 방법</span>
                                            <span className={cIntro.historyText}>삼차원 비행경로 가시화 방법 및 그 시스템(특허등록)</span>
                                            <span className={cIntro.historyText}>지분 70% 대주주 변경 및 여욱현 대표이사 취임</span>
                                            <span className={cIntro.historyText}>코스닥 기업 ㈜센코 자회사 편입</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2020Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2020년</span>
                                    </span>
                                    <div className={cIntro.com2020BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>10월</span>
                                            <span className={cIntro.monthNum}>5월</span>
                                            <span className={cIntro.monthNumB}>00</span>
                                            <span className={cIntro.monthNum}>1월</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>재난상황 전파 방법 및 이를 위한 시스템(특허등록)</span>
                                            <span className={cIntro.historyText}>연계 SOP 생성 방법 및 그 시스템(특허등록)</span>
                                            <span className={cIntro.historyText}>훈련 시 생성이 가능한 재난대응 훈련 방법 및 그 시스템(특허등록)</span>
                                            <span className={cIntro.historyText}>정보통신공사업 등록</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2019Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2019년</span>
                                    </span>
                                    <div className={cIntro.com2019BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>9월</span>
                                            <span className={cIntro.monthNum}>8월</span>
                                            <span className={cIntro.monthNum}>5월</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>지능형 재난대응 훈련 방법 및 그 시스템(특허등록)</span>
                                            <span className={cIntro.historyText}>기술혁신형 중소기업(inno-Biz)인증</span>
                                            <span className={cIntro.historyText}>기업부설연구소 명칭 변경(재난안전기술연구소)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2018Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2018년</span>
                                    </span>
                                    <div className={cIntro.com2018BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>6월</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>연구개발 서비스업 등록</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2017Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2017년</span>
                                    </span>
                                    <div className={cIntro.com2017BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>8월</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>환경 오염 예측 시스템 및 그 방법(특허등록)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2016Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2016년</span>
                                    </span>
                                    <div className={cIntro.com2016BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>10월</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>災害時行動支援ツステム(재해 시 행동 지원 시스템, 일본 특허등록)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2015Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2015년</span>
                                    </span>
                                    <div className={cIntro.com2015BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>10월</span>
                                            <span className={cIntro.monthNumB}>00</span>
                                            <span className={cIntro.monthNum}>4월</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>재난 감지시스템 및 그 제공 방법(특허등록)</span>
                                            <span className={cIntro.historyText}>성과 공유제 도입 기업 선정</span>
                                            <span className={cIntro.historyText}>SOP 시나리오 구동 시스템 및 그 제공 방법(특허등록)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2014Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2014년</span>
                                    </span>
                                    <div className={cIntro.com2014BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>9월</span>
                                            <span className={cIntro.monthNum}>1월</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>한국남동발전(주)개발선정품 등록</span>
                                            <span className={cIntro.historyText}>생태환경 평가 시스템 및 그 방법(특허등록)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2013Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2013년</span>
                                    </span>
                                    <div className={cIntro.com2013BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>6월</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>위치 기반 지능형 SOP 시스템 및 그 제공 방법(특허등록)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2012Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2012년</span>
                                    </span>
                                    <div className={cIntro.com2012BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>7월</span>
                                            <span className={cIntro.monthNum}>1월</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>중소기업중앙회 직접 생산증명 인증(소프트웨어 개발)</span>
                                            <span className={cIntro.historyText}>벤처기업 인증</span>
                                            <span className={cIntro.historyText}>엔지니어링 사업자 신고(수질,폐기물,소음,진동)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2011Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2011년</span>
                                    </span>
                                    <div className={cIntro.com2011BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>4월</span>
                                            <span className={cIntro.monthNum}>3월</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>기업부설연구 설립 및 등록</span>
                                            <span className={cIntro.historyText}>회사 설립</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CI */}
                        <div className={cIntro.comLogoContent} id="sectionCI">
                            <span className={cIntro.comLTitle} data-aos="fade-down" data-aos-duration="1000">CI소개</span>
                            {/* <span className={cIntro.comLSubTitle}>{Resource.ID.CI.CISubTitle}</span> */}
                            <div className={cIntro.DownBox}>
                                <div className={cIntro.CIDownBox}>
                                    <span></span>
                                    <span>국문 CI</span>
                                </div>
                                <div className={cIntro.CIDownBox2}>
                                    <span></span>
                                    <span>영문 CI</span>
                                </div>
                            </div>
                            <a href="../../resource/logo design_update.ai" download>
                                <span className={cIntro.ClDownArea}>CI 다운로드</span>
                            </a>
                        </div>
                        <div className={cIntro.comCIContent2}>
                            <span className={cIntro.comCircle}></span>
                            <span className={cIntro.comCSubTitle}>심볼 및 컬러</span>
                            <div className={cIntro.comCFlexBox}>
                                <div className={cIntro.comSimbolBox}>
                                    <div className={cIntro.simbol}></div>
                                    <div className={cIntro.comSimbolText}>
                                        <p>U&E를 3D 형태로 표현한 심볼은</p>
                                        <p>디지털 트윈 기반</p>
                                        <p>공간정보 구축 전문성을 상징합니다.</p>
                                    </div>
                                </div>
                                <div className={cIntro.comColorBox}>
                                    <div className={cIntro.colorBox}>
                                        <div className={cIntro.cCircleFlex1}>
                                            <span className={cIntro.colorBCircle}></span>
                                            <span className={cIntro.colorRCircle}></span>
                                        </div>
                                        <div className={cIntro.cCircleFlex2}>
                                            <span className={cIntro.colorGCircle}></span>
                                            <span className={cIntro.colorDGCircle}></span>
                                        </div>
                                    </div>
                                    <div className={cIntro.comColorText}>
                                        <p>경고 표지, 소화기, 경보기 등</p>
                                        <p>대표적인 안전 색채로 쓰이는 붉은 색은</p>
                                        <p>안전을 선도하는 기업임을 표상합니다.</p>
                                    </div>
                                </div>
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
                </>
            );
        } else if (640 <= widthSize && widthSize <= 959) {  /* 가로 모바일 */
            displayCompanyUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={cIntro.comIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">회사소개</span>
                            <span data-aos="fade-down" data-aos-duration="1000">유엔이의 대표이사 인사말, 비전과 가치, 연혁, CI를 소개합니다.</span>
                        </div>
                        {/* CEO 인사말 */}
                        <div className={cIntro.comGreeting} id="sectionCEO">
                            <span data-aos="fade-down" data-aos-duration="1000">CEO 인사말</span>
                            <div className={cIntro.ceoBox}>
                                <span className={cIntro.ceoPicture}></span>
                                <span className={cIntro.ceoBoxText}>대표이사<span className={cIntro.ceoBoldText}>여 욱 현</span></span>
                                <div className={cIntro.ceoTextBoxS}>
                                    <span>안전한 공간, 편안한 공간, 관리하기 쉬운 공간.</span>
                                    <span>스마트 세상의 공간을 오가는 우리에게는 짧은 시간이라도 안심할 수 있는 공간이 필요합니다.</span>
                                    <span>그 공간의 중심에 바로 저희 유엔이가 있습니다.</span>
                                    <span>유엔이는 사용자를 위한 안전하고 편리한 맞춤형 공간을 디지털 트윈 기반으로 제공하는 IT기술 기업입니다.</span>
                                    <span>축적된 기술과 노하우를 바탕으로 안전한 공간, 편리한 사용, 맞춤형 구축, 합리적 비용을 달성하기 위해</span>
                                    <span>끊임없이 노력하여 고객이 원하고 저희가 추구하는 공간의 안전 가치를 구현해 나가겠습니다.</span>
                                    <span>감사합니다.</span>
                                </div>
                            </div>
                        </div>
                        {/* vision */}
                        <div className={cIntro.comVision} id="sectionVision">
                            <span className={cIntro.comVTitle1} data-aos="fade-down" data-aos-duration="1000">비전 및 핵심가치</span>
                            <span className={cIntro.comVFlex}>
                                <span className={cIntro.comVCircle1}></span>
                                <span className={cIntro.comVTitle11}>비전</span>
                                {/* <span className={cIntro.comVShape}>
                                    <span className={cIntro.comVCircle1}></span>
                                    <span className={cIntro.comVLine}></span>
                                    <span className={cIntro.comVCircle2}></span>
                                </span> */}
                            </span>
                            <span className={cIntro.comVTextBox}><span className={cIntro.comVTitle2}>스마트 기술로 만드는 디지털 공간</span>
                                <span className={cIntro.blueFont}>안전하고 안심되는 공간</span>이 되다</span>
                            <div className={cIntro.visionFlexBox}>
                                <div className={cIntro.vFlex1}>
                                    <div className={cIntro.vBox1}>핵심가치 1</div>
                                    <div className={cIntro.vBox2}>
                                        <span><span className={cIntro.vBoldText}>S</span>MART</span>
                                        <span>4차 산업혁명</span>
                                        <span>최신 ICT 기술로</span>
                                        <span>더욱 스마트하게</span>
                                    </div>
                                </div>
                                <div className={cIntro.vFlex2}>
                                    <div className={cIntro.vBox3}>핵심가치 2</div>
                                    <div className={cIntro.vBox4}>
                                        <span><span className={cIntro.vBoldText}>S</span>PACE</span>
                                        <span>디지털 트윈으로</span>
                                        <span>현실 공간을</span>
                                        <span>가상 공간으로 동기화</span>
                                    </div>
                                </div>
                            </div>
                            <div className={cIntro.visionFlexBox2}>
                                <div className={cIntro.vFlex3}>
                                    <div className={cIntro.vBox5}>핵심가치 3</div>
                                    <div className={cIntro.vBox6}>
                                        <span><span className={cIntro.vBoldText}>S</span>AFETY</span>
                                        <span>사람 중심</span>
                                        <span>안전 제일이</span>
                                        <span>최우선 가치</span>
                                    </div>
                                </div>
                                <div className={cIntro.vFlex4}>
                                    <div className={cIntro.vBox7}>핵심가치 4</div>
                                    <div className={cIntro.vBox8}>
                                        <span><span className={cIntro.vBoldText}>S</span>ECURITY</span>
                                        <span>신속하고</span>
                                        <span>체계적인 대응으로</span>
                                        <span>재난재해에서 안심</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* history */}
                        <span className={cIntro.comHisTitle2} id="sectionHistory" data-aos="fade-down" data-aos-duration="1000">주요 연혁</span>
                        <div className={cIntro.comHisContent}>
                            <div className={cIntro.comHisTable} border="1">
                                <div className={cIntro.com2022Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2024년</span>
                                    </span>
                                    <div className={cIntro.com2022BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>12월</span>
                                            <span className={cIntro.monthNumB}>00</span>
                                            <span className={cIntro.monthNum}>11월</span>
                                            <span className={cIntro.monthNum}>10월</span>
                                            <span className={cIntro.monthNum}>8월</span>
                                        </span>
                                        <span className={cIntro.comHisFlex3}>
                                            <span className={cIntro.historyText}>경기융합타운 대표도서관, 신용보증재단 재난관리시스템 구축</span>
                                            <span className={cIntro.historyText}>부산 신평/장림산단 디지털 트윈 기반 통합관제 시스템 구축</span>
                                            <span className={cIntro.historyText}>마곡 사이언스파크 재난관리시스템 구축</span>
                                            <span className={cIntro.historyText}>경기융합타운 종합방재실 재난관리시스템 구축</span>
                                            <span className={cIntro.historyText}>원익QNC 스마트재난시스템 구축</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2022Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2023년</span>
                                    </span>
                                    <div className={cIntro.com2022BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>12월</span>
                                            <span className={cIntro.monthNumB}>00</span>
                                            <span className={cIntro.monthNum}>10월</span>
                                            <span className={cIntro.monthNum}>7월</span>
                                            <span className={cIntro.monthNum}>6월</span>
                                        </span>
                                        <span className={cIntro.comHisFlex3}>
                                            <span className={cIntro.historyText}>목포시 강소형 스마트시티 조성사업 수주</span>
                                            <span className={cIntro.historyText}>여수 국가산업단지 환경모니터링 시스템 구축</span>
                                            <span className={cIntro.historyText}>과기정통부 디지털 트윈 혁신선도 사업(제조실증) 수행</span>
                                            <span className={cIntro.historyText}>강원랜드 중장기안전관리체계 컨설팅 수행</span>
                                            <span className={cIntro.historyText}>구독형 산업안전보건관리 서비스 ‘스마플’ 출시</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2022Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2022년</span>
                                    </span>
                                    <div className={cIntro.com2022BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>11월</span>
                                            <span className={cIntro.monthNum}>10월</span>
                                            <span className={cIntro.monthNum}>8월</span>
                                            <span className={cIntro.monthNumB}>00</span>
                                            <span className={cIntro.monthNum}>7월</span>
                                            <span className={cIntro.monthNum}>5월</span>
                                            <span className={cIntro.monthNumB}>00</span>
                                        </span>
                                        <span className={cIntro.comHisFlex3}>
                                            <span className={cIntro.historyText}>청량리 수자인 재난관리 시스템 구축</span>
                                            <span className={cIntro.historyText}>SDMS v1.0.1 GS인증 1등급 획득</span>
                                            <span className={cIntro.historyText}>기업부설연구소 이전</span>
                                            <span className={cIntro.historyText}>LG CNS Virtual Datacenter System</span>
                                            <span className={cIntro.historyText}>위기경보수준 관리방법 및 그 시스템 특허등록</span>
                                            <span className={cIntro.historyText}>조직 상황에 따른 적용적 SOP 제공 방법 및 그 시스템</span>
                                            <span className={cIntro.historyText}>훈련 중 상황에 따른 적응적 SOP 제공 방법 및 그 시스템(특허등록)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2021Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2021년</span>
                                    </span>
                                    <div className={cIntro.com2021BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>10월</span>
                                            <span className={cIntro.monthNum}>8월</span>
                                            <span className={cIntro.monthNum}>7월</span>
                                            <span className={cIntro.monthNum}>6월</span>
                                            <span className={cIntro.monthNumB}>00</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>동적 비행 제한 구역 운영 방법 및 그 시스템</span>
                                            <span className={cIntro.historyText}>공간 정보 전환 시스템 및 그 방법</span>
                                            <span className={cIntro.historyText}>삼차원 비행경로 가시화 방법 및 그 시스템(특허등록)</span>
                                            <span className={cIntro.historyText}>지분 70% 대주주 변경 및 여욱현 대표이사 취임</span>
                                            <span className={cIntro.historyText}>코스닥 기업 ㈜센코 자회사 편입</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2020Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2020년</span>
                                    </span>
                                    <div className={cIntro.com2020BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>10월</span>
                                            <span className={cIntro.monthNum}>5월</span>
                                            <span className={cIntro.monthNumB}>00</span>
                                            <span className={cIntro.monthNum}>1월</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>재난상황 전파 방법 및 이를 위한 시스템(특허등록)</span>
                                            <span className={cIntro.historyText}>연계 SOP 생성 방법 및 그 시스템(특허등록)</span>
                                            <span className={cIntro.historyText}>훈련 시 생성이 가능한 재난대응 훈련 방법 및 그 시스템(특허등록)</span>
                                            <span className={cIntro.historyText}>정보통신공사업 등록</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2019Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2019년</span>
                                    </span>
                                    <div className={cIntro.com2019BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>9월</span>
                                            <span className={cIntro.monthNum}>8월</span>
                                            <span className={cIntro.monthNum}>5월</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>지능형 재난대응 훈련 방법 및 그 시스템(특허등록)</span>
                                            <span className={cIntro.historyText}>기술혁신형 중소기업(inno-Biz)인증</span>
                                            <span className={cIntro.historyText}>기업부설연구소 명칭 변경(재난안전기술연구소)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2018Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2018년</span>
                                    </span>
                                    <div className={cIntro.com2018BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>6월</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>연구개발 서비스업 등록</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2017Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2017년</span>
                                    </span>
                                    <div className={cIntro.com2017BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>8월</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>환경 오염 예측 시스템 및 그 방법(특허등록)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2016Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2016년</span>
                                    </span>
                                    <div className={cIntro.com2016BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>10월</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>災害時行動支援ツステム(재해 시 행동 지원 시스템, 일본 특허등록)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2015Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2015년</span>
                                    </span>
                                    <div className={cIntro.com2015BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>10월</span>
                                            <span className={cIntro.monthNumB}>00</span>
                                            <span className={cIntro.monthNum}>4월</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>재난 감지시스템 및 그 제공 방법(특허등록)</span>
                                            <span className={cIntro.historyText}>성과 공유제 도입 기업 선정</span>
                                            <span className={cIntro.historyText}>SOP 시나리오 구동 시스템 및 그 제공 방법(특허등록)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2014Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2014년</span>
                                    </span>
                                    <div className={cIntro.com2014BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>9월</span>
                                            <span className={cIntro.monthNum}>1월</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>한국남동발전(주)개발선정품 등록</span>
                                            <span className={cIntro.historyText}>생태환경 평가 시스템 및 그 방법(특허등록)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2013Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2013년</span>
                                    </span>
                                    <div className={cIntro.com2013BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>6월</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>위치 기반 지능형 SOP 시스템 및 그 제공 방법(특허등록)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2012Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2012년</span>
                                    </span>
                                    <div className={cIntro.com2012BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>7월</span>
                                            <span className={cIntro.monthNum}>1월</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>중소기업중앙회 직접 생산증명 인증(소프트웨어 개발)</span>
                                            <span className={cIntro.historyText}>벤처기업 인증</span>
                                            <span className={cIntro.historyText}>엔지니어링 사업자 신고(수질,폐기물,소음,진동)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2011Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2011년</span>
                                    </span>
                                    <div className={cIntro.com2011BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>4월</span>
                                            <span className={cIntro.monthNum}>3월</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>기업부설연구 설립 및 등록</span>
                                            <span className={cIntro.historyText}>회사 설립</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CI */}
                        <div className={cIntro.comLogoContent} id="sectionCI">
                            <span className={cIntro.comLTitle} data-aos="fade-down" data-aos-duration="1000">CI소개</span>
                            {/* <span className={cIntro.comLSubTitle}>{Resource.ID.CI.CISubTitle}</span> */}
                            <div className={cIntro.DownBox}>
                                <div className={cIntro.CIDownBox}>
                                    <span></span>
                                    <span>국문 CI</span>
                                </div>
                                <div className={cIntro.CIDownBox2}>
                                    <span></span>
                                    <span>영문 CI</span>
                                </div>
                            </div>
                            <a href="../../resource/logo design_update.ai" download>
                                <span className={cIntro.ClDownArea}>CI 다운로드</span>
                            </a>
                        </div>
                        <div className={cIntro.comCIContent2}>
                            <span className={cIntro.comCircle}></span>
                            <span className={cIntro.comCSubTitle}>심볼 및 컬러</span>
                            <div className={cIntro.comCFlexBox}>
                                <div className={cIntro.comSimbolBox}>
                                    <div className={cIntro.simbol}></div>
                                    <div className={cIntro.comSimbolText}>
                                        <p>U&E를 3D 형태로 표현한 심볼은</p>
                                        <p>디지털 트윈 기반</p>
                                        <p>공간정보 구축 전문성을 상징합니다.</p>
                                    </div>
                                </div>
                                <div className={cIntro.comColorBox}>
                                    <div className={cIntro.colorBox}>
                                        <div className={cIntro.cCircleFlex1}>
                                            <span className={cIntro.colorBCircle}></span>
                                            <span className={cIntro.colorRCircle}></span>
                                        </div>
                                        <div className={cIntro.cCircleFlex2}>
                                            <span className={cIntro.colorGCircle}></span>
                                            <span className={cIntro.colorDGCircle}></span>
                                        </div>
                                    </div>
                                    <div className={cIntro.comColorText}>
                                        <p>경고 표지, 소화기, 경보기 등</p>
                                        <p>대표적인 안전 색채로 쓰이는 붉은 색은</p>
                                        <p>안전을 선도하는 기업임을 표상합니다.</p>
                                    </div>
                                </div>
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
                </>
            );
        } else if (768 <= widthSize && widthSize <= 1023) { //태블릿
            displayCompanyUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={cIntro.comIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">회사소개</span>
                            <span data-aos="fade-down" data-aos-duration="1000">유엔이의 대표이사 인사말, 비전과 가치, 연혁, CI를 소개합니다.</span>
                        </div>
                        {/* CEO 인사말 */}
                        <div className={cIntro.comGreeting} id="sectionCEO">
                            <span data-aos="fade-down" data-aos-duration="1000">CEO 인사말</span>
                            <div className={cIntro.ceoBox}>
                                <span className={cIntro.ceoPicture}></span>
                                <div className={cIntro.ceoTextBoxS}>
                                    <span>안전한 공간, 편안한 공간, 관리하기 쉬운 공간.</span>
                                    <span>스마트 세상의 공간을 오가는 우리에게는 짧은 시간이라도 안심할 수 있는 공간이 필요합니다.</span>
                                    <span>그 공간의 중심에 바로 저희 유엔이가 있습니다.</span>
                                    <span>유엔이는 사용자를 위한 안전하고 편리한 맞춤형 공간을 디지털 트윈 기반으로 제공하는 IT기술 기업입니다.</span>
                                    <span>축적된 기술과 노하우를 바탕으로 안전한 공간, 편리한 사용, 맞춤형 구축, 합리적 비용을 달성하기 위해</span>
                                    <span>끊임없이 노력하여 고객이 원하고 저희가 추구하는 공간의 안전 가치를 구현해 나가겠습니다.</span>
                                    <span>감사합니다.</span>
                                    <span>대표이사<span className={cIntro.ceoBoldText}>여 욱 현</span></span>
                                </div>
                            </div>
                        </div>
                        {/* vision */}
                        <div className={cIntro.comVision} id="sectionVision">
                            <span className={cIntro.comVTitle1} data-aos="fade-down" data-aos-duration="1000">비전 및 핵심가치</span>
                            <span className={cIntro.comVFlex}>
                                <span className={cIntro.comVTitle11}>비전</span>
                                <span className={cIntro.comVShape}>
                                    <span className={cIntro.comVCircle1}></span>
                                    <span className={cIntro.comVLine}></span>
                                    <span className={cIntro.comVCircle2}></span>
                                </span>
                                <span className={cIntro.comVTitle2}>스마트 기술로 만드는 디지털 공간,<span className={cIntro.blueFont}>안전하고 안심되는 공간</span>이 되다</span>
                            </span>
                            <div className={cIntro.visionFlexBox}>
                                <div className={cIntro.vFlex1}>
                                    <div className={cIntro.vBox1}>핵심가치 1</div>
                                    <div className={cIntro.vBox2}>
                                        <span><span className={cIntro.vBoldText}>S</span>MART</span>
                                        <span>4차 산업혁명</span>
                                        <span>최신 ICT 기술로</span>
                                        <span>더욱 스마트하게</span>
                                    </div>
                                </div>
                                <div className={cIntro.vFlex2}>
                                    <div className={cIntro.vBox3}>핵심가치 2</div>
                                    <div className={cIntro.vBox4}>
                                        <span><span className={cIntro.vBoldText}>S</span>PACE</span>
                                        <span>디지털 트윈으로</span>
                                        <span>현실 공간을</span>
                                        <span>가상 공간으로 동기화</span>
                                    </div>
                                </div>
                                <div className={cIntro.vFlex3}>
                                    <div className={cIntro.vBox5}>핵심가치 3</div>
                                    <div className={cIntro.vBox6}>
                                        <span><span className={cIntro.vBoldText}>S</span>AFETY</span>
                                        <span>사람 중심</span>
                                        <span>안전 제일이</span>
                                        <span>최우선 가치</span>
                                    </div>
                                </div>
                                <div className={cIntro.vFlex4}>
                                    <div className={cIntro.vBox7}>핵심가치 4</div>
                                    <div className={cIntro.vBox8}>
                                        <span><span className={cIntro.vBoldText}>S</span>ECURITY</span>
                                        <span>신속하고</span>
                                        <span>체계적인 대응으로</span>
                                        <span>재난재해에서 안심</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* history */}
                        <span className={cIntro.comHisTitle2} id="sectionHistory" data-aos="fade-down" data-aos-duration="1000">주요 연혁</span>
                        <div className={cIntro.comHisContent}>
                            <div className={cIntro.comHisTable} border="1">
                                <div className={cIntro.com2022Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2024</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>12월</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                        <span className={cIntro.monthNum}>11월</span>
                                        <span className={cIntro.monthNum}>10월</span>
                                        <span className={cIntro.monthNum}>8월</span>
                                    </span>
                                    <span className={cIntro.comHisFlex3}>
                                        <span className={cIntro.historyText}>경기융합타운 대표도서관, 신용보증재단 재난관리시스템 구축</span>
                                        <span className={cIntro.historyText}>부산 신평/장림산단 디지털 트윈 기반 통합관제 시스템 구축</span>
                                        <span className={cIntro.historyText}>마곡 사이언스파크 재난관리시스템 구축</span>
                                        <span className={cIntro.historyText}>경기융합타운 종합방재실 재난관리시스템 구축</span>
                                        <span className={cIntro.historyText}>원익QNC 스마트재난시스템 구축</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2022Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2023</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>12월</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                        <span className={cIntro.monthNum}>10월</span>
                                        <span className={cIntro.monthNum}>7월</span>
                                        <span className={cIntro.monthNum}>6월</span>
                                    </span>
                                    <span className={cIntro.comHisFlex3}>
                                        <span className={cIntro.historyText}>목포시 강소형 스마트시티 조성사업 수주</span>
                                        <span className={cIntro.historyText}>여수 국가산업단지 환경모니터링 시스템 구축</span>
                                        <span className={cIntro.historyText}>과기정통부 디지털 트윈 혁신선도 사업(제조실증) 수행</span>
                                        <span className={cIntro.historyText}>강원랜드 중장기안전관리체계 컨설팅 수행</span>
                                        <span className={cIntro.historyText}>구독형 산업안전보건관리 서비스 ‘스마플’ 출시</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2022Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2022</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>11월</span>
                                        <span className={cIntro.monthNum}>10월</span>
                                        <span className={cIntro.monthNum}>8월</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                        <span className={cIntro.monthNum}>7월</span>
                                        <span className={cIntro.monthNum}>5월</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                    </span>
                                    <span className={cIntro.comHisFlex3}>
                                        <span className={cIntro.historyText}>청량리 수자인 재난관리 시스템 구축</span>
                                        <span className={cIntro.historyText}>SDMS v1.0.1 GS인증 1등급 획득</span>
                                        <span className={cIntro.historyText}>기업부설연구소 이전</span>
                                        <span className={cIntro.historyText}>LG CNS Virtual Datacenter System</span>
                                        <span className={cIntro.historyText}>위기경보수준 관리방법 및 그 시스템 특허등록</span>
                                        <span className={cIntro.historyText}>조직 상황에 따른 적용적 SOP 제공 방법 및 그 시스템</span>
                                        <span className={cIntro.historyText}>훈련 중 상황에 따른 적응적 SOP 제공 방법 및 그 시스템(특허등록)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2021Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2021</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>10월</span>
                                        <span className={cIntro.monthNum}>8월</span>
                                        <span className={cIntro.monthNum}>7월</span>
                                        <span className={cIntro.monthNum}>6월</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>동적 비행 제한 구역 운영 방법 및 그 시스템</span>
                                        <span className={cIntro.historyText}>공간 정보 전환 시스템 및 그 방법</span>
                                        <span className={cIntro.historyText}>삼차원 비행경로 가시화 방법 및 그 시스템(특허등록)</span>
                                        <span className={cIntro.historyText}>지분 70% 대주주 변경 및 여욱현 대표이사 취임</span>
                                        <span className={cIntro.historyText}>코스닥 기업 ㈜센코 자회사 편입</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2020Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2020</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>10월</span>
                                        <span className={cIntro.monthNum}>5월</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                        <span className={cIntro.monthNum}>1월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>재난상황 전파 방법 및 이를 위한 시스템(특허등록)</span>
                                        <span className={cIntro.historyText}>연계 SOP 생성 방법 및 그 시스템(특허등록)</span>
                                        <span className={cIntro.historyText}>훈련 시 생성이 가능한 재난대응 훈련 방법 및 그 시스템(특허등록)</span>
                                        <span className={cIntro.historyText}>정보통신공사업 등록</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2019Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2019</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>9월</span>
                                        <span className={cIntro.monthNum}>8월</span>
                                        <span className={cIntro.monthNum}>5월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>지능형 재난대응 훈련 방법 및 그 시스템(특허등록)</span>
                                        <span className={cIntro.historyText}>기술혁신형 중소기업(inno-Biz)인증</span>
                                        <span className={cIntro.historyText}>기업부설연구소 명칭 변경(재난안전기술연구소)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2018Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2018</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>6월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>연구개발 서비스업 등록</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2017Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2017</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>8월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>환경 오염 예측 시스템 및 그 방법(특허등록)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2016Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2016</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>10월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>災害時行動支援ツステム(재해 시 행동 지원 시스템, 일본 특허등록)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2015Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2015</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>10월</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                        <span className={cIntro.monthNum}>4월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>재난 감지시스템 및 그 제공 방법(특허등록)</span>
                                        <span className={cIntro.historyText}>성과 공유제 도입 기업 선정</span>
                                        <span className={cIntro.historyText}>SOP 시나리오 구동 시스템 및 그 제공 방법(특허등록)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2014Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2014</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>9월</span>
                                        <span className={cIntro.monthNum}>1월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>한국남동발전(주)개발선정품 등록</span>
                                        <span className={cIntro.historyText}>생태환경 평가 시스템 및 그 방법(특허등록)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2013Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2013</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>6월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>위치 기반 지능형 SOP 시스템 및 그 제공 방법(특허등록)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2012Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2012</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>7월</span>
                                        <span className={cIntro.monthNum}>1월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>중소기업중앙회 직접 생산증명 인증(소프트웨어 개발)</span>
                                        <span className={cIntro.historyText}>벤처기업 인증</span>
                                        <span className={cIntro.historyText}>엔지니어링 사업자 신고(수질,폐기물,소음,진동)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2011Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2011</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>4월</span>
                                        <span className={cIntro.monthNum}>3월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>기업부설연구 설립 및 등록</span>
                                        <span className={cIntro.historyText}>회사 설립</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* CI */}
                        <div className={cIntro.comLogoContent} id="sectionCI">
                            <span className={cIntro.comLTitle} data-aos="fade-down" data-aos-duration="1000">CI소개</span>
                            {/* <span className={cIntro.comLSubTitle}>{Resource.ID.CI.CISubTitle}</span> */}
                            <div className={cIntro.DownBox}>
                                <div className={cIntro.CIDownBox}>
                                    <span></span>
                                    <span>국문 CI</span>
                                </div>
                                <div className={cIntro.CIDownBox2}>
                                    <span></span>
                                    <span>영문 CI</span>
                                </div>
                            </div>
                            <a href="../../resource/logo design_update.ai" download>
                                <span className={cIntro.ClDownArea}>CI 다운로드</span>
                            </a>
                        </div>
                        <div className={cIntro.comCIContent2}>
                            <span className={cIntro.comCircle}></span>
                            <span className={cIntro.comCSubTitle}>심볼 및 컬러</span>
                            <div className={cIntro.comCFlexBox}>
                                <div className={cIntro.comSimbolBox}>
                                    <div className={cIntro.simbol}></div>
                                    <div className={cIntro.comSimbolText}>
                                        <p>U&E를 3D 형태로 표현한 심볼은</p>
                                        <p>디지털 트윈 기반</p>
                                        <p>공간정보 구축 전문성을 상징합니다.</p>
                                    </div>
                                </div>
                                <div className={cIntro.comColorBox}>
                                    <div className={cIntro.colorBox}>
                                        <div className={cIntro.cCircleFlex1}>
                                            <span className={cIntro.colorBCircle}></span>
                                            <span className={cIntro.colorRCircle}></span>
                                        </div>
                                        <div className={cIntro.cCircleFlex2}>
                                            <span className={cIntro.colorGCircle}></span>
                                            <span className={cIntro.colorDGCircle}></span>
                                        </div>
                                    </div>
                                    <div className={cIntro.comColorText}>
                                        <p>경고 표지, 소화기, 경보기 등</p>
                                        <p>대표적인 안전 색채로 쓰이는 붉은 색은</p>
                                        <p>안전을 선도하는 기업임을 표상합니다.</p>
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
            displayCompanyUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={cIntro.comIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">회사소개</span>
                            <span data-aos="fade-down" data-aos-duration="1000">유엔이의 대표이사 인사말, 비전과 가치, 연혁, CI를 소개합니다.</span>
                        </div>
                        {/* CEO 인사말 */}
                        <div className={cIntro.comGreeting} id="sectionCEO">
                            <span data-aos="fade-down" data-aos-duration="1000">CEO 인사말</span>
                            <div className={cIntro.ceoBox}>
                                <span className={cIntro.ceoPicture}></span>
                                <div className={cIntro.ceoTextBoxS}>
                                    <span>안전한 공간, 편안한 공간, 관리하기 쉬운 공간.</span>
                                    <span>스마트 세상의 공간을 오가는 우리에게는 짧은 시간이라도 안심할 수 있는 공간이 필요합니다.</span>
                                    <span>그 공간의 중심에 바로 저희 유엔이가 있습니다.</span>
                                    <span>유엔이는 사용자를 위한 안전하고 편리한 맞춤형 공간을 디지털 트윈 기반으로 제공하는 IT기술 기업입니다.</span>
                                    <span>축적된 기술과 노하우를 바탕으로 안전한 공간, 편리한 사용, 맞춤형 구축, 합리적 비용을 달성하기 위해</span>
                                    <span>끊임없이 노력하여 고객이 원하고 저희가 추구하는 공간의 안전 가치를 구현해 나가겠습니다.</span>
                                    <span>감사합니다.</span>
                                    <span>대표이사<span className={cIntro.ceoBoldText}>여 욱 현</span></span>
                                </div>
                            </div>
                        </div>
                        {/* vision */}
                        <div className={cIntro.comVision} id="sectionVision">
                            <span className={cIntro.comVTitle1} data-aos="fade-down" data-aos-duration="1000">비전 및 핵심가치</span>
                            <span className={cIntro.comVFlex}>
                                <span className={cIntro.comVTitle11}>비전</span>
                                <span className={cIntro.comVShape}>
                                    <span className={cIntro.comVCircle1}></span>
                                    <span className={cIntro.comVLine}></span>
                                    <span className={cIntro.comVCircle2}></span>
                                </span>
                                <span className={cIntro.comVTitle2}>스마트 기술로 만드는 디지털 공간,<span className={cIntro.blueFont}>안전하고 안심되는 공간</span>이 되다</span>
                            </span>
                            <div className={cIntro.visionFlexBox}>
                                <div className={cIntro.vFlex1}>
                                    <div className={cIntro.vBox1}>핵심가치 1</div>
                                    <div className={cIntro.vBox2}>
                                        <span><span className={cIntro.vBoldText}>S</span>MART</span>
                                        <span>4차 산업혁명</span>
                                        <span>최신 ICT 기술로</span>
                                        <span>더욱 스마트하게</span>
                                    </div>
                                </div>
                                <div className={cIntro.vFlex2}>
                                    <div className={cIntro.vBox3}>핵심가치 2</div>
                                    <div className={cIntro.vBox4}>
                                        <span><span className={cIntro.vBoldText}>S</span>PACE</span>
                                        <span>디지털 트윈으로</span>
                                        <span>현실 공간을</span>
                                        <span>가상 공간으로 동기화</span>
                                    </div>
                                </div>
                                <div className={cIntro.vFlex3}>
                                    <div className={cIntro.vBox5}>핵심가치 3</div>
                                    <div className={cIntro.vBox6}>
                                        <span><span className={cIntro.vBoldText}>S</span>AFETY</span>
                                        <span>사람 중심</span>
                                        <span>안전 제일이</span>
                                        <span>최우선 가치</span>
                                    </div>
                                </div>
                                <div className={cIntro.vFlex4}>
                                    <div className={cIntro.vBox7}>핵심가치 4</div>
                                    <div className={cIntro.vBox8}>
                                        <span><span className={cIntro.vBoldText}>S</span>ECURITY</span>
                                        <span>신속하고</span>
                                        <span>체계적인 대응으로</span>
                                        <span>재난재해에서 안심</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* history */}
                        <span className={cIntro.comHisTitle2} id="sectionHistory" data-aos="fade-down" data-aos-duration="1000">주요 연혁</span>
                        <div className={cIntro.comHisContent}>
                            <div className={cIntro.comHisTable} border="1">
                                <div className={cIntro.com2022Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2024</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>12월</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                        <span className={cIntro.monthNum}>11월</span>
                                        <span className={cIntro.monthNum}>10월</span>
                                        <span className={cIntro.monthNum}>8월</span>
                                    </span>
                                    <span className={cIntro.comHisFlex3}>
                                        <span className={cIntro.historyText}>경기융합타운 대표도서관, 신용보증재단 재난관리시스템 구축</span>
                                        <span className={cIntro.historyText}>부산 신평/장림산단 디지털 트윈 기반 통합관제 시스템 구축</span>
                                        <span className={cIntro.historyText}>마곡 사이언스파크 재난관리시스템 구축</span>
                                        <span className={cIntro.historyText}>경기융합타운 종합방재실 재난관리시스템 구축</span>
                                        <span className={cIntro.historyText}>원익QNC 스마트재난시스템 구축</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2022Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2023</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>12월</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                        <span className={cIntro.monthNum}>10월</span>
                                        <span className={cIntro.monthNum}>7월</span>
                                        <span className={cIntro.monthNum}>6월</span>
                                    </span>
                                    <span className={cIntro.comHisFlex3}>
                                        <span className={cIntro.historyText}>목포시 강소형 스마트시티 조성사업 수주</span>
                                        <span className={cIntro.historyText}>여수 국가산업단지 환경모니터링 시스템 구축</span>
                                        <span className={cIntro.historyText}>과기정통부 디지털 트윈 혁신선도 사업(제조실증) 수행</span>
                                        <span className={cIntro.historyText}>강원랜드 중장기안전관리체계 컨설팅 수행</span>
                                        <span className={cIntro.historyText}>구독형 산업안전보건관리 서비스 ‘스마플’ 출시</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2022Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2022</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>11월</span>
                                        <span className={cIntro.monthNum}>10월</span>
                                        <span className={cIntro.monthNum}>8월</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                        <span className={cIntro.monthNum}>7월</span>
                                        <span className={cIntro.monthNum}>5월</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                    </span>
                                    <span className={cIntro.comHisFlex3}>
                                        <span className={cIntro.historyText}>청량리 수자인 재난관리 시스템 구축</span>
                                        <span className={cIntro.historyText}>SDMS v1.0.1 GS인증 1등급 획득</span>
                                        <span className={cIntro.historyText}>기업부설연구소 이전</span>
                                        <span className={cIntro.historyText}>LG CNS Virtual Datacenter System</span>
                                        <span className={cIntro.historyText}>위기경보수준 관리방법 및 그 시스템 특허등록</span>
                                        <span className={cIntro.historyText}>조직 상황에 따른 적용적 SOP 제공 방법 및 그 시스템</span>
                                        <span className={cIntro.historyText}>훈련 중 상황에 따른 적응적 SOP 제공 방법 및 그 시스템(특허등록)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2021Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2021</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>10월</span>
                                        <span className={cIntro.monthNum}>8월</span>
                                        <span className={cIntro.monthNum}>7월</span>
                                        <span className={cIntro.monthNum}>6월</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>동적 비행 제한 구역 운영 방법 및 그 시스템</span>
                                        <span className={cIntro.historyText}>공간 정보 전환 시스템 및 그 방법</span>
                                        <span className={cIntro.historyText}>삼차원 비행경로 가시화 방법 및 그 시스템(특허등록)</span>
                                        <span className={cIntro.historyText}>지분 70% 대주주 변경 및 여욱현 대표이사 취임</span>
                                        <span className={cIntro.historyText}>코스닥 기업 ㈜센코 자회사 편입</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2020Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2020</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>10월</span>
                                        <span className={cIntro.monthNum}>5월</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                        <span className={cIntro.monthNum}>1월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>재난상황 전파 방법 및 이를 위한 시스템(특허등록)</span>
                                        <span className={cIntro.historyText}>연계 SOP 생성 방법 및 그 시스템(특허등록)</span>
                                        <span className={cIntro.historyText}>훈련 시 생성이 가능한 재난대응 훈련 방법 및 그 시스템(특허등록)</span>
                                        <span className={cIntro.historyText}>정보통신공사업 등록</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2019Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2019</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>9월</span>
                                        <span className={cIntro.monthNum}>8월</span>
                                        <span className={cIntro.monthNum}>5월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>지능형 재난대응 훈련 방법 및 그 시스템(특허등록)</span>
                                        <span className={cIntro.historyText}>기술혁신형 중소기업(inno-Biz)인증</span>
                                        <span className={cIntro.historyText}>기업부설연구소 명칭 변경(재난안전기술연구소)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2018Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2018</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>6월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>연구개발 서비스업 등록</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2017Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2017</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>8월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>환경 오염 예측 시스템 및 그 방법(특허등록)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2016Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2016</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>10월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>災害時行動支援ツステム(재해 시 행동 지원 시스템, 일본 특허등록)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2015Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2015</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>10월</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                        <span className={cIntro.monthNum}>4월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>재난 감지시스템 및 그 제공 방법(특허등록)</span>
                                        <span className={cIntro.historyText}>성과 공유제 도입 기업 선정</span>
                                        <span className={cIntro.historyText}>SOP 시나리오 구동 시스템 및 그 제공 방법(특허등록)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2014Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2014</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>9월</span>
                                        <span className={cIntro.monthNum}>1월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>한국남동발전(주)개발선정품 등록</span>
                                        <span className={cIntro.historyText}>생태환경 평가 시스템 및 그 방법(특허등록)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2013Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2013</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>6월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>위치 기반 지능형 SOP 시스템 및 그 제공 방법(특허등록)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2012Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2012</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>7월</span>
                                        <span className={cIntro.monthNum}>1월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>중소기업중앙회 직접 생산증명 인증(소프트웨어 개발)</span>
                                        <span className={cIntro.historyText}>벤처기업 인증</span>
                                        <span className={cIntro.historyText}>엔지니어링 사업자 신고(수질,폐기물,소음,진동)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2011Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2011</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>4월</span>
                                        <span className={cIntro.monthNum}>3월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>기업부설연구 설립 및 등록</span>
                                        <span className={cIntro.historyText}>회사 설립</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* CI */}
                        <div className={cIntro.comLogoContent} id="sectionCI">
                            <span className={cIntro.comLTitle} data-aos="fade-down" data-aos-duration="1000">CI소개</span>
                            {/* <span className={cIntro.comLSubTitle}>{Resource.ID.CI.CISubTitle}</span> */}
                            <div className={cIntro.DownBox}>
                                <div className={cIntro.CIDownBox}>
                                    <span></span>
                                    <span>국문 CI</span>
                                </div>
                                <div className={cIntro.CIDownBox2}>
                                    <span></span>
                                    <span>영문 CI</span>
                                </div>
                            </div>
                            <a href="../../resource/logo design_update.ai" download>
                                <span className={cIntro.ClDownArea}>CI 다운로드</span>
                            </a>
                        </div>
                        <div className={cIntro.comCIContent2}>
                            <span className={cIntro.comCircle}></span>
                            <span className={cIntro.comCSubTitle}>심볼 및 컬러</span>
                            <div className={cIntro.comCFlexBox}>
                                <div className={cIntro.comSimbolBox}>
                                    <div className={cIntro.simbol}></div>
                                    <div className={cIntro.comSimbolText}>
                                        <p>U&E를 3D 형태로 표현한 심볼은</p>
                                        <p>디지털 트윈 기반</p>
                                        <p>공간정보 구축 전문성을 상징합니다.</p>
                                    </div>
                                </div>
                                <div className={cIntro.comColorBox}>
                                    <div className={cIntro.colorBox}>
                                        <div className={cIntro.cCircleFlex1}>
                                            <span className={cIntro.colorBCircle}></span>
                                            <span className={cIntro.colorRCircle}></span>
                                        </div>
                                        <div className={cIntro.cCircleFlex2}>
                                            <span className={cIntro.colorGCircle}></span>
                                            <span className={cIntro.colorDGCircle}></span>
                                        </div>
                                    </div>
                                    <div className={cIntro.comColorText}>
                                        <p>경고 표지, 소화기, 경보기 등</p>
                                        <p>대표적인 안전 색채로 쓰이는 붉은 색은</p>
                                        <p>안전을 선도하는 기업임을 표상합니다.</p>
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
            displayCompanyUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={cIntro.comIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">회사소개</span>
                            <span data-aos="fade-down" data-aos-duration="1000">유엔이의 대표이사 인사말, 비전과 가치, 연혁, CI를 소개합니다.</span>
                        </div>
                        {/* CEO 인사말 */}
                        <div className={cIntro.comGreeting} id="sectionCEO">
                            <span data-aos="fade-down" data-aos-duration="1000">CEO 인사말</span>
                            <div className={cIntro.ceoBox}>
                                <span className={cIntro.ceoPicture}></span>
                                <div className={cIntro.ceoTextBoxS}>
                                    <span>안전한 공간, 편안한 공간, 관리하기 쉬운 공간.</span>
                                    <span>스마트 세상의 공간을 오가는 우리에게는 짧은 시간이라도 안심할 수 있는 공간이 필요합니다.</span>
                                    <span>그 공간의 중심에 바로 저희 유엔이가 있습니다.</span>
                                    <span>유엔이는 사용자를 위한 안전하고 편리한 맞춤형 공간을 디지털 트윈 기반으로 제공하는 IT기술 기업입니다.</span>
                                    <span>축적된 기술과 노하우를 바탕으로 안전한 공간, 편리한 사용, 맞춤형 구축, 합리적 비용을 달성하기 위해</span>
                                    <span>끊임없이 노력하여 고객이 원하고 저희가 추구하는 공간의 안전 가치를 구현해 나가겠습니다.</span>
                                    <span>감사합니다.</span>
                                    <span>대표이사<span className={cIntro.ceoBoldText}>여 욱 현</span></span>
                                </div>
                            </div>
                        </div>
                        {/* vision */}
                        <div className={cIntro.comVision} id="sectionVision">
                            <span className={cIntro.comVTitle1} data-aos="fade-down" data-aos-duration="1000">비전 및 핵심가치</span>
                            <span className={cIntro.comVFlex}>
                                <span className={cIntro.comVTitle11}>비전</span>
                                <span className={cIntro.comVShape}>
                                    <span className={cIntro.comVCircle1}></span>
                                    <span className={cIntro.comVLine}></span>
                                    <span className={cIntro.comVCircle2}></span>
                                </span>
                                <span className={cIntro.comVTitle2}>스마트 기술로 만드는 디지털 공간,<span className={cIntro.blueFont}>안전하고 안심되는 공간</span>이 되다</span>
                            </span>
                            <div className={cIntro.visionFlexBox}>
                                <div className={cIntro.vFlex1}>
                                    <div className={cIntro.vBox1}>핵심가치</div>
                                    <div className={cIntro.vBox2}>
                                        <span><span className={cIntro.vBoldText}>S</span>MART</span>
                                        <span>4차 산업혁명</span>
                                        <span>최신 ICT 기술로</span>
                                        <span>더욱 스마트하게</span>
                                    </div>
                                </div>
                                <div className={cIntro.vFlex2}>
                                    <div className={cIntro.vBox3}>핵심가치</div>
                                    <div className={cIntro.vBox4}>
                                        <span><span className={cIntro.vBoldText}>S</span>PACE</span>
                                        <span>디지털 트윈으로</span>
                                        <span>현실 공간을</span>
                                        <span>가상 공간으로 동기화</span>
                                    </div>
                                </div>
                                <div className={cIntro.vFlex3}>
                                    <div className={cIntro.vBox5}>핵심가치</div>
                                    <div className={cIntro.vBox6}>
                                        <span><span className={cIntro.vBoldText}>S</span>AFETY</span>
                                        <span>사람 중심</span>
                                        <span>안전 제일이</span>
                                        <span>최우선 가치</span>
                                    </div>
                                </div>
                                <div className={cIntro.vFlex4}>
                                    <div className={cIntro.vBox7}>핵심가치</div>
                                    <div className={cIntro.vBox8}>
                                        <span><span className={cIntro.vBoldText}>S</span>ECURITY</span>
                                        <span>신속하고</span>
                                        <span>체계적인 대응으로</span>
                                        <span>재난재해에서 안심</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* history */}
                        <span className={cIntro.comHisTitle2} id="sectionHistory" data-aos="fade-down" data-aos-duration="1000">주요 연혁</span>
                        <div className={cIntro.comHisContent}>
                            <div className={cIntro.comHisTable} border="1">
                                <div className={cIntro.com2022Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2024</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>12월</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                        <span className={cIntro.monthNum}>11월</span>
                                        <span className={cIntro.monthNum}>10월</span>
                                        <span className={cIntro.monthNum}>8월</span>
                                    </span>
                                    <span className={cIntro.comHisFlex3}>
                                        <span className={cIntro.historyText}>경기융합타운 대표도서관, 신용보증재단 재난관리시스템 구축</span>
                                        <span className={cIntro.historyText}>부산 신평/장림산단 디지털 트윈 기반 통합관제 시스템 구축</span>
                                        <span className={cIntro.historyText}>마곡 사이언스파크 재난관리시스템 구축</span>
                                        <span className={cIntro.historyText}>경기융합타운 종합방재실 재난관리시스템 구축</span>
                                        <span className={cIntro.historyText}>원익QNC 스마트재난시스템 구축</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2022Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2023</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>12월</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                        <span className={cIntro.monthNum}>10월</span>
                                        <span className={cIntro.monthNum}>7월</span>
                                        <span className={cIntro.monthNum}>6월</span>
                                    </span>
                                    <span className={cIntro.comHisFlex3}>
                                        <span className={cIntro.historyText}>목포시 강소형 스마트시티 조성사업 수주</span>
                                        <span className={cIntro.historyText}>여수 국가산업단지 환경모니터링 시스템 구축</span>
                                        <span className={cIntro.historyText}>과기정통부 디지털 트윈 혁신선도 사업(제조실증) 수행</span>
                                        <span className={cIntro.historyText}>강원랜드 중장기안전관리체계 컨설팅 수행</span>
                                        <span className={cIntro.historyText}>구독형 산업안전보건관리 서비스 ‘스마플’ 출시</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2022Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2022</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>11월</span>
                                        <span className={cIntro.monthNum}>10월</span>
                                        <span className={cIntro.monthNum}>8월</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                        <span className={cIntro.monthNum}>7월</span>
                                        <span className={cIntro.monthNum}>5월</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                    </span>
                                    <span className={cIntro.comHisFlex3}>
                                        <span className={cIntro.historyText}>청량리 수자인 재난관리 시스템 구축</span>
                                        <span className={cIntro.historyText}>SDMS v1.0.1 GS인증 1등급 획득</span>
                                        <span className={cIntro.historyText}>기업부설연구소 이전</span>
                                        <span className={cIntro.historyText}>LG CNS Virtual Datacenter System</span>
                                        <span className={cIntro.historyText}>위기경보수준 관리방법 및 그 시스템 특허등록</span>
                                        <span className={cIntro.historyText}>조직 상황에 따른 적용적 SOP 제공 방법 및 그 시스템</span>
                                        <span className={cIntro.historyText}>훈련 중 상황에 따른 적응적 SOP 제공 방법 및 그 시스템(특허등록)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2021Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2021</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>10월</span>
                                        <span className={cIntro.monthNum}>8월</span>
                                        <span className={cIntro.monthNum}>7월</span>
                                        <span className={cIntro.monthNum}>6월</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>동적 비행 제한 구역 운영 방법 및 그 시스템</span>
                                        <span className={cIntro.historyText}>공간 정보 전환 시스템 및 그 방법</span>
                                        <span className={cIntro.historyText}>삼차원 비행경로 가시화 방법 및 그 시스템(특허등록)</span>
                                        <span className={cIntro.historyText}>지분 70% 대주주 변경 및 여욱현 대표이사 취임</span>
                                        <span className={cIntro.historyText}>코스닥 기업 ㈜센코 자회사 편입</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2020Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2020</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>10월</span>
                                        <span className={cIntro.monthNum}>5월</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                        <span className={cIntro.monthNum}>1월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>재난상황 전파 방법 및 이를 위한 시스템(특허등록)</span>
                                        <span className={cIntro.historyText}>연계 SOP 생성 방법 및 그 시스템(특허등록)</span>
                                        <span className={cIntro.historyText}>훈련 시 생성이 가능한 재난대응 훈련 방법 및 그 시스템(특허등록)</span>
                                        <span className={cIntro.historyText}>정보통신공사업 등록</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2019Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2019</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>9월</span>
                                        <span className={cIntro.monthNum}>8월</span>
                                        <span className={cIntro.monthNum}>5월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>지능형 재난대응 훈련 방법 및 그 시스템(특허등록)</span>
                                        <span className={cIntro.historyText}>기술혁신형 중소기업(inno-Biz)인증</span>
                                        <span className={cIntro.historyText}>기업부설연구소 명칭 변경(재난안전기술연구소)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2018Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2018</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>6월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>연구개발 서비스업 등록</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2017Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2017</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>8월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>환경 오염 예측 시스템 및 그 방법(특허등록)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2016Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2016</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>10월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>災害時行動支援ツステム(재해 시 행동 지원 시스템, 일본 특허등록)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2015Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2015</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>10월</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                        <span className={cIntro.monthNum}>4월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>재난 감지시스템 및 그 제공 방법(특허등록)</span>
                                        <span className={cIntro.historyText}>성과 공유제 도입 기업 선정</span>
                                        <span className={cIntro.historyText}>SOP 시나리오 구동 시스템 및 그 제공 방법(특허등록)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2014Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2014</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>9월</span>
                                        <span className={cIntro.monthNum}>1월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>한국남동발전(주)개발선정품 등록</span>
                                        <span className={cIntro.historyText}>생태환경 평가 시스템 및 그 방법(특허등록)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2013Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2013</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>6월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>위치 기반 지능형 SOP 시스템 및 그 제공 방법(특허등록)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2012Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2012</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>7월</span>
                                        <span className={cIntro.monthNum}>1월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>중소기업중앙회 직접 생산증명 인증(소프트웨어 개발)</span>
                                        <span className={cIntro.historyText}>벤처기업 인증</span>
                                        <span className={cIntro.historyText}>엔지니어링 사업자 신고(수질,폐기물,소음,진동)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2011Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2011</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>4월</span>
                                        <span className={cIntro.monthNum}>3월</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>기업부설연구 설립 및 등록</span>
                                        <span className={cIntro.historyText}>회사 설립</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* CI */}
                        <div className={cIntro.comLogoContent} id="sectionCI">
                            <span className={cIntro.comLTitle} data-aos="fade-down" data-aos-duration="1000">CI소개</span>
                            {/* <span className={cIntro.comLSubTitle}>{Resource.ID.CI.CISubTitle}</span> */}
                            <div className={cIntro.DownBox}>
                                <div className={cIntro.CIDownBox}>
                                    <span></span>
                                    <span>국문 CI</span>
                                </div>
                                <div className={cIntro.CIDownBox2}>
                                    <span></span>
                                    <span>영문 CI</span>
                                </div>
                            </div>
                            <a href="../../resource/logo design_update.ai" download>
                                <span className={cIntro.ClDownArea}>CI 다운로드</span>
                            </a>
                        </div>
                        <div className={cIntro.comCIContent2}>
                            <span className={cIntro.comCircle}></span>
                            <span className={cIntro.comCSubTitle}>심볼 및 컬러</span>
                            <div className={cIntro.comCFlexBox}>
                                <div className={cIntro.comSimbolBox}>
                                    <div className={cIntro.simbol}></div>
                                    <div className={cIntro.comSimbolText}>
                                        <p>U&E를 3D 형태로 표현한 심볼은</p>
                                        <p>디지털 트윈 기반</p>
                                        <p>공간정보 구축 전문성을 상징합니다.</p>
                                    </div>
                                </div>
                                <div className={cIntro.comColorBox}>
                                    <div className={cIntro.colorBox}>
                                        <div className={cIntro.cCircleFlex1}>
                                            <span className={cIntro.colorBCircle}></span>
                                            <span className={cIntro.colorRCircle}></span>
                                        </div>
                                        <div className={cIntro.cCircleFlex2}>
                                            <span className={cIntro.colorGCircle}></span>
                                            <span className={cIntro.colorDGCircle}></span>
                                        </div>
                                    </div>
                                    <div className={cIntro.comColorText}>
                                        <p>경고 표지, 소화기, 경보기 등</p>
                                        <p>대표적인 안전 색채로 쓰이는 붉은 색은</p>
                                        <p>안전을 선도하는 기업임을 표상합니다.</p>
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
            displayCompanyUI.push(
                <></>
            );
        }
        return displayCompanyUI;
    }


    render() {

        setTimeout(() => { this.resizeUI() }, 500);
        let displayCompanyUI = this.state.disCompanyUI;

        return (
            <>
                {displayCompanyUI}
            </>
        );
    }
}

export default CompanySectionKor;