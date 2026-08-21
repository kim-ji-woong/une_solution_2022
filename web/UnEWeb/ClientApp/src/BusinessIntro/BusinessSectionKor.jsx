import { Link } from "react-router-dom";
import React, { Component } from 'react';
import cIntro from '../CompanyIntro/css/company.module.css';
import bIntro from '../BusinessIntro/css/business.module.css';
import home from '../components/css/home.module.css';
import '../CompanyNews/css/cNew.css';
import '../components/css/home.css';

import $ from 'jquery';

import newsDataTemp from "../CompanyNews/newsDataTemp";

import AOS from "aos";
import "aos/dist/aos.css";

import Resource from '../resource/id';

import Modal from '../BusinessIntro/NewsModal.jsx';


class BusinessSectionKor extends Component {
    static displayName = BusinessSectionKor.name;

    constructor(props) {
        super(props);
        //this.index = this.index.bind(this);
        //this.onClickContent = this.onClickContent.bind(this);
        //this.setPageUI = this.setPageUI.bind(this);

        this.state = {
            menu: 0,
            displayContents: [],        // 원본 데이터
            newsDatas: newsDataTemp,              //보여줄 데이터
            currentPageIndex: 1,        //현재 페이지
            currentPageIndexM: 1,
            viewDataCount: 6,           //페이지에서 보여줄 데이터 개수
            //ViewDataCountM: 1,         
            //pageIndex: 1,               // 현재 페이지
            minPageIndex: 1,            // 최소 페이지 Index	
            maxPageIndex: 1,            // 최대 페이지 Index	
            search: null,
            indexOfLastPage: null,
            contentIndex: -1,            //보도자료 첫페이지
            modal: false,
        };

        this.props = props;
        this._isMounted = false;
        this.state.displayContents = newsDataTemp.news;
        this.state.newsDatas = newsDataTemp.news;
        this.displayNews();
        //this.displayNewsM();

        this.state.disBusinessUI = this.displayBusinessUI();
    }

    resizeUI() {
        this.setState({ disBusinessUI: this.displayBusinessUI() });
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

        $(function () {
            $(window).scroll(function () {
                if ($(this).scrollTop() > 500) {
                    $('#toTop').show();
                }
            });
            $(window).scroll(function () {
                if ($(this).scrollTop() > 5600) {
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

        this._isMounted = true;

        $(document).on("touchstart", function () {
            $('.' + bIntro.reportBtnLeftCon).addClass('active');
        });

        $(document).on("touchstart", function () {
            $('.' + bIntro.reportBtnRightCon).addClass('active');
        });

        $(document).ready(function () {
            $('.' + bIntro.reportBtnLeftCon).on('touchstart', function (event) {
                $(this).addClass('active');
            });

            $('.' + bIntro.reportBtnLeftCon).on('touchend', function (event) {
                $(this).removeClass('active');
            });
        });

        $(document).ready(function () {
            $('.' + bIntro.reportBtnRightCon).on('touchstart', function (event) {
                $(this).addClass('active');
            });

            $('.' + bIntro.reportBtnRightCon).on('touchend', function (event) {
                $(this).removeClass('active');
            });
        });


        if (this.state.contentIndex === 10) {
            $('.' + bIntro.reportBtnRightCon).css({ display: 'none' });
        }

        $('.' + bIntro.reportBtnLeftCon).css({ display: 'none' });
    }

    componentWillUnmount() {
        this._isMounted = false;
        // jQuery 이벤트 정리
        $(document).off('touchstart touchend');
        $('.' + bIntro.reportBtnLeftCon).off('touchstart touchend');
        $('.' + bIntro.reportBtnRightCon).off('touchstart touchend');
        $(window).off('scroll resize');

    }
    
    onClickContent = (index) => {
        this.setState({ contentIndex: index });
    }
    
    /* 이전글, 다음글 클릭했을때  */
    setPageUI = (param) => {

        const newNum = this.state.contentIndex + param;
        //console.log('newNum' + newNum);
        //console.log('contentIndex' + this.state.contentIndex);

        if (newNum < 0 || newNum >= this.state.newsDatas.length) {
            return;
        }

        if (newNum === 0) {
            $('.' + bIntro.reportBtnLeftCon).css({ display: 'none' });
        } else {
            $('.' + bIntro.reportBtnLeftCon).css({ display: 'block' });
        }

        if (this.state.contentIndex + param === 9) {
            $('.' + bIntro.reportBtnRightCon).css({ display: 'none' });
        } else {
            $('.' + bIntro.reportBtnRightCon).css({ display: 'block' });
        }

        this.setState({ contentIndex: newNum });
    }

    handleChange(e) {
        const target = e.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(e) {
        this.setState({ name: this.state.modalInputName });
        this.modalClose();
    }

    modalOpen() {
        this.setState({ modal: true });
    }

    modalClose() {
        this.setState({
            modalInputName: "",
            modal: false
        });
    }

    /* 피시버전 */
    displayNewsUI = () => {
        let newsUI = [];

        if (!this.state.newsDatas) {
            return newsUI;
        }

        const currentPageIndex = this.state.currentPageIndex;
        const viewDataCount = this.state.viewDataCount;
        const newsDatas = this.state.newsDatas.length;
        let newsCount = newsDataTemp.news;

        let minIdx = 0;
        let maxIdx = 0;

        minIdx = ((currentPageIndex - 1) * 6);

        if ((currentPageIndex * viewDataCount) > newsDatas)
            maxIdx = newsDatas;
        else
            maxIdx = ((currentPageIndex - 1) * viewDataCount) + viewDataCount;

        const selectedIndex = this.state.contentIndex;

        const selectedNews = selectedIndex >= 0 && selectedIndex < newsDatas ? this.state.newsDatas[selectedIndex] : null;

        for (let i = minIdx; i < maxIdx; i++) {
            const news = this.state.newsDatas[i];

            newsUI.push(
                <React.Fragment key={`news-fragment-${news.id}-${i}`}>
                    <div onClick={() => this.onClickContent(i)} key={news.id} value={news.id}>
                        <span className={bIntro.postingBox} value={news.id} key={news.id} onClick={e => this.modalOpen(e)}>
                            <span className={bIntro.postingImg}><img src={news.image} /></span>
                            <span className={bIntro.postingText}>
                                <span className={bIntro.postingTitle}>{news.boardTitle}</span>
                                <span className={bIntro.postingContents}>{news.boardContents}</span>
                                <span className={bIntro.postingDate}>{news.boardDate}</span>
                            </span>
                        </span>
                    </div>

                    <Modal
                        selectedNews={selectedNews}
                        show={this.state.modal}
                        handleClose={e => this.modalClose(e)}
                        index={this.props.index}
                        onClickContent={this.onClickContent}
                        setPageUI={this.setPageUI}
                        setPageIndex={this.state.setPageIndex}
                    >
                    </Modal>
                </React.Fragment>
            );
        }
        return newsUI;
    }


    /* 모바일 버전 */
    displayNewsUI2 = () => {
        let newsUI = [];

        if (!this.state.newsDatas) {
            return newsUI;
        }

        const currentPageIndex = this.state.currentPageIndex;
        const viewDataCount = this.state.viewDataCount;
        const newsDatas = this.state.newsDatas.length;
        let newsCount = newsDataTemp.news;

        let minIdx = 0;
        let maxIdx = 0;

        minIdx = ((currentPageIndex - 1) * 6);

        if ((currentPageIndex * viewDataCount) > newsDatas)
              maxIdx = newsDatas;
        else
            maxIdx = ((currentPageIndex - 1) * viewDataCount) + viewDataCount;

        const selectedIndex = this.state.contentIndex;

        const selectedNews = selectedIndex >= 0 && selectedIndex < newsDatas ? this.state.newsDatas[selectedIndex] : null;

        minIdx = this.state.contentIndex;

        if (minIdx < 0)
            minIdx = 0;

        maxIdx = minIdx + 1;

        for (let i = minIdx; i < maxIdx; i++) {
            const news = this.state.newsDatas[i];

             newsUI.push(
                 <>
                     <span className={bIntro.reportBtnLeftCon} onClick={() => this.setPageUI(-1)}></span>
                     <div className={bIntro.reportnewsBox} onClick={() => this.onClickContent(i)} key={news.id} value={news.id}>
                         <span className={bIntro.postingBox} value={news.id} key={news.id} onClick={e => this.modalOpen(e)}>
                            <span className={bIntro.postingImg}><img src={news.image} /></span>
                            <span className={bIntro.postingText}>
                                <span className={bIntro.postingTitle}>{news.boardTitle}</span>
                                <span className={bIntro.postingContents}>{news.boardContents}</span>
                                <span className={bIntro.postingDate}>{news.boardDate}</span>
                            </span>
                         </span>
                     </div>
                     {/* <span className={bIntro.reportBtnClose} handleClose={e => this.modalClose(e)}></span> */}
                     <span className={bIntro.reportBtnRightCon} onClick={() => this.setPageUI(1)}></span>

                    <Modal
                        selectedNews={selectedNews}
                        show={this.state.modal}
                        handleClose={e => this.modalClose(e)}
                        index={this.props.index}
                        onClickContent={this.onClickContent}
                        setPageUI={this.setPageUI}
                        setPageIndex={this.state.setPageIndex}
                    >
                    </Modal>
                </>
            );
        }
        return newsUI;
    }


    /* 태블릿 버전 */
    displayNewsUI3 = () => {
        let newsUI = [];

        if (!this.state.newsDatas) {
            return newsUI;
        }

        const currentPageIndex = this.state.currentPageIndex;
        const viewDataCount = this.state.viewDataCount;
        const newsDatas = this.state.newsDatas.length;
        let newsCount = newsDataTemp.news;

        let minIdx = 0;
        let maxIdx = 0;

        minIdx = ((currentPageIndex - 1) * 6);

        if ((currentPageIndex * viewDataCount) > newsDatas)
            maxIdx = newsDatas;
        else
            maxIdx = ((currentPageIndex - 1) * viewDataCount) + viewDataCount;

        const selectedIndex = this.state.contentIndex;

        const selectedNews = selectedIndex >= 0 && selectedIndex < newsDatas ? this.state.newsDatas[selectedIndex] : null;

        for (let i = minIdx; i < maxIdx; i++) {
            const news = this.state.newsDatas[i];

            newsUI.push(
                <>
                    <div onClick={() => this.onClickContent(i)} key={news.id} value={news.id}>
                        <span className={bIntro.postingBox} value={news.id} key={news.id} onClick={e => this.modalOpen(e)}>
                            <span className={bIntro.postingImg}><img src={news.image} /></span>
                            <span className={bIntro.postingText}>
                                <span className={bIntro.postingTitle}>{news.boardTitle}</span>
                                <span className={bIntro.postingContents}>{news.boardContents}</span>
                                <span className={bIntro.postingDate}>{news.boardDate}</span>
                            </span>
                        </span>
                    </div>

                    <Modal
                        selectedNews={selectedNews}
                        show={this.state.modal}
                        handleClose={e => this.modalClose(e)}
                        index={this.props.index}
                        onClickContent={this.onClickContent}
                        setPageUI={this.setPageUI}
                        setPageIndex={this.state.setPageIndex}
                    >
                    </Modal>
                </>
            );
        }
        return newsUI;
    }


    displayNews = () => {
        const newsDatas = this.state.newsDatas;
        let minPageIndex = 1;
        let maxPageIndex = 1;

        if (newsDatas) {
            let rowCount = newsDatas.length;

            const value1 = parseInt(rowCount / this.state.viewDataCount);
            const value2 = rowCount % this.state.viewDataCount;
            maxPageIndex = value1 + ((value2 > 0) ? 1 : 0);
            if (maxPageIndex === 0) {
                maxPageIndex = 1;
            }
        }

        //this.setState({ newsDatas, minPageIndex, maxPageIndex });
        this.state.maxPageIndex = maxPageIndex;
    }


    getPageIndexUI = () => {
        let newsUI = [];

        if (!this.state.newsDatas) {
            return newsUI;
        }

        const totalCount = this.state.newsDatas.length;
        const viewDataCount = this.state.viewDataCount;
        const currentPageIndex = this.state.currentPageIndex;
        //const maxPageIndex = this.state.maxPageIndex;
        let pageCount = Math.floor(totalCount / viewDataCount);

        if (totalCount % viewDataCount > 0)
            pageCount++;

        if (pageCount === 0) {
            pageCount = 1;
        }

        const beginIndex = currentPageIndex % viewDataCount === 0 ? Math.floor(currentPageIndex / viewDataCount) * viewDataCount : Math.floor(currentPageIndex / viewDataCount) * viewDataCount + 1;

        for (let i = beginIndex; i <= pageCount && i < (beginIndex + viewDataCount); i++) {
            let activeClass = "";
            const random = Math.floor(Math.random() * 100);
            let key = "pageButton_" + i + "_" + random;

            if (this.state.currentPageIndex === i)
                activeClass = "activePage";

            newsUI.push(
                <button key={key} onClick={() => this.setPageIndex(i)} className={activeClass + " " + bIntro.btnActive}>{i}</button>
            );
        }
        return newsUI;
    }

    setPageIndex = (currentPageIndex) => {
        if (currentPageIndex === this.state.currentPageIndex) {
            return;
        }
        this.setState({ currentPageIndex });
    }


    displayBusinessUI = () => {
        const newsUI = this.displayNewsUI();
        const newsUI2 = this.displayNewsUI2();
        const newsUI3 = this.displayNewsUI3();
        const pageIndexUI = this.getPageIndexUI();

        let displayBusinessUI = [];
        let widthSize = window.outerWidth;


        if (widthSize < 768) {
            displayBusinessUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={bIntro.eIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">사업분야</span>
                            <span data-aos="fade-down" data-aos-duration="1000">유엔이의 사업 분야 및 주요 실적, 파트너사를 소개합니다.</span>
                        </div>
                        {/* 안전관리 */}
                        <div id="sectionSafety">
                            <div className={bIntro.safetyInforContentsSect2}>
                                <span className={bIntro.safetyTextBox}>
                                    <span className={bIntro.safetyManageTitle} data-aos="fade-down" data-aos-duration="1000">안전관리 솔루션·컨설팅 사업</span>
                                    <div className={bIntro.safetyManageContents}>
                                        <div className={bIntro.safetyMText1}>
                                            <span className={bIntro.safetyTextConts}>
                                                <span className={bIntro.safetyTexts1}>
                                                    화재, 가스누출, 침수, 지진 등
                                                </span>
                                                <span className={bIntro.safetyTexts2}>
                                                    <span className={bIntro.businessTextBold}>지속적으로 발생하는 사고/ 재난 대응의 핵심은 신속과 효율</span>에 있습니다.
                                                </span>
                                                <span className={bIntro.safetyTexts3}>
                                                    이를 위해<span className={bIntro.businessTextBlack}>각종 센서와 CCTV 정보를 실시간으로 연계·수집·분석</span>하고,
                                                </span>
                                                <span className={bIntro.safetyTexts4}>
                                                    <span className={bIntro.businessTextBlack}>실내외 공간정보와 결합하여 현황을 시각화</span>하며,
                                                </span>
                                                <span className={bIntro.safetyTexts5}>
                                                    <span className={bIntro.businessTextBlack}>재난유형별 SOP(표준행동절차)</span>를 통해
                                                </span>
                                                <span className={bIntro.safetyTexts6}>
                                                    <span className={bIntro.businessTextBlack}>행동요령을 공유하고 상황을 전파</span>하는 것이 중요합니다.
                                                </span>
                                                <span className={bIntro.safetyTexts7}>
                                                    유엔이는 실내외 공간에 대한 이해와
                                                </span>
                                                <span className={bIntro.safetyTexts8}>
                                                    축적된 재난안전 기술 및 사업 역량을 바탕으로
                                                </span>
                                                <span className={bIntro.safetyTexts9}>
                                                    <span className={bIntro.businessTextBold}>컨설팅과 솔루션 모두를 포괄하는 지속가능한 안전관리 서비스를 제공</span>합니다.
                                                </span>
                                            </span>
                                        </div>

                                        <div className={bIntro.safetyMText2}>
                                            <span className={bIntro.safetyTextConts2}>
                                                <div className={bIntro.sTarget1}>안전관리 컨설팅</div>
                                                <div className={bIntro.sSubFlex1}>
                                                    {/* <span className={bIntro.sCheckIcon}></span> */}
                                                    <span className={bIntro.sSubTitle1}>
                                                        <p className={bIntro.sSubText1}><span className={bIntro.businessTextBold2}>재난 상황에 실질적인 도움</span>이 되는</p>
                                                        <p className={bIntro.sSubText1}><span>안전관리 컨설팅 서비스를 제공합니다.</span><span className={bIntro.businessTextBold2} style={{ marginLeft: '8px' }}></span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.sSubCont1}>
                                                    <p>- 재난상황별 위기대응 매뉴얼 개발</p>
                                                    <p>- 위험성 평가</p>
                                                    <p>- 안전 관련 정책 및 로드맵 수립</p>
                                                    <p>- 훈련 시나리오 개발</p>
                                                    <p>- 민방위 정책 기획</p>
                                                    <p>- 중대재해처벌법 관련 대책 컨설팅</p>
                                                </div>
                                            </span>
                                            <span className={bIntro.safetyTextConts3}>
                                                <div className={bIntro.sTarget2}>스마트 솔루션</div>
                                                <div className={bIntro.sSubFlex2}>
                                                    {/* <span className={bIntro.sCheckIcon2}></span> */}
                                                    <span className={bIntro.sSubTitle2}>
                                                        <p><span className={bIntro.businessTextBold2}>다양한 유형의 재난 발생에 대응 가능한</span></p>
                                                        <p>스마트 안전관리 솔루션을 제공합니다.<span className={bIntro.businessTextBold2} style={{ marginLeft: '8px' }}></span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.sSubCont2}>
                                                    <p>- 스마트재난대응시스템</p>
                                                    <p>- 스마트재난탐지시스템</p>
                                                    <p>- 스마트환경모니터링시스템</p>
                                                    <p>- 스마트유해물질관리시스템</p>
                                                    <p>- 스마트시설물관리시스템</p>
                                                    <p>- 스마트작업자안전관리시스템</p>
                                                    <p></p>
                                                    <p></p>
                                                </div>
                                            </span>
                                        </div>
                                        <div className={bIntro.majorCases}>
                                            <span className={bIntro.majorCircle}></span>
                                            <span className={bIntro.majorTitle}>주요 사례</span>
                                            <div className={bIntro.majorFlexPic}>
                                                <div className={bIntro.case1}>
                                                    <span className={bIntro.caseIcon1}></span>
                                                    <span className={bIntro.caseText1}>
                                                        <p>한국남동발전</p>
                                                        <p>(2015)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case2}>
                                                    <span className={bIntro.caseIcon2}></span>
                                                    <span className={bIntro.caseText2}>
                                                        <p>경상남도</p>
                                                        <p>(2020)</p>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={bIntro.majorFlexPic2}>
                                                <div className={bIntro.case3}>
                                                    <span className={bIntro.caseIcon3}></span>
                                                    <span className={bIntro.caseText3}>
                                                        <p>광명 어반브릭스</p>
                                                        <p>(2021)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case4}>
                                                    <span className={bIntro.caseIcon4}></span>
                                                    <span className={bIntro.caseText4}></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </span>
                            </div>
                        </div>
                        {/* 디지털 트윈 */}
                        <div id="sectionDigital">
                            <div className={bIntro.digitalInforContentsSect2}>
                                <span className={bIntro.digitalTextBox}>
                                    <span className={bIntro.digitalManageTitle} data-aos="fade-down" data-aos-duration="1000">디지털 트윈 응용 솔루션 사업</span>
                                    <div className={bIntro.digitalManageContents}>
                                        <div className={bIntro.digitalMText1}>

                                            <span className={bIntro.digitalTextConts}>
                                                <span className={bIntro.digitalTexts1}>
                                                    디지털 트윈은 건물, 시설물, 센서장비, 업무 프로세스 등의
                                                </span>
                                                <span className={bIntro.digitalTexts2}>
                                                    <span className={bIntro.businessTextBold}>현실에 존재하는 인프라를 가상 공간에 동일하게 구현한 개념 기술</span>입니다.
                                                </span>
                                                <span className={bIntro.digitalTexts3}>
                                                    가상 공간의 객체와 시스템, 데이터들은<span className={bIntro.businessTextBlack}>현실 공간과 실시간 연결</span>되어
                                                </span>
                                                <span className={bIntro.digitalTexts4}>
                                                    모니터링, 제어, 시뮬레이션이 가능하며,
                                                </span>
                                                <span className={bIntro.digitalTexts5}>
                                                    이를 통해 실제 시설물의 변경 없이도
                                                </span>
                                                <span className={bIntro.digitalTexts6}>
                                                    <span className={bIntro.businessTextBlack}>현실에서 보다 나은 의사결정과 운영관리를 지원</span>합니다.
                                                </span>
                                                <span className={bIntro.digitalTexts7}>
                                                    유엔이는 실내외 공간 통합 구축기술, 레거시 시스템 및 IoT 연계·통합,
                                                </span>
                                                <span className={bIntro.digitalTexts8}>
                                                    빅데이터/AI 기반 실시간 모니터링 및 시뮬레이션 기술을 통해
                                                </span>
                                                <span className={bIntro.digitalTexts9}>
                                                    <span className={bIntro.businessTextBold}>다양한 산업분야에서 고객의 요구를 만족시키는</span>
                                                </span>
                                                <span className={bIntro.digitalTexts10}>
                                                    <span className={bIntro.businessTextBold}>디지털 트윈 기반 응용 솔루션을 제공</span>합니다.
                                                </span>
                                            </span>
                                        </div>

                                        <div className={bIntro.digitalMText2}>
                                            <span className={bIntro.digitalTextConts2}>
                                                <div className={bIntro.dTarget1}>공간정보 구축</div>
                                                <div className={bIntro.dSubFlex1}>
                                                    {/* <span className={bIntro.dCheckIcon}></span> */}
                                                    <span className={bIntro.dSubTitle1}>
                                                        <p><span className={bIntro.businessTextBold3}>경량의 고품질</span><span></span><span className={bIntro.businessTextBold3}></span></p>
                                                        <p><span className={bIntro.businessTextBold3}></span></p>
                                                        <p><span>실내외 공간정보를 구축합니다.</span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont1}>
                                                    <p>- 사람이 체류하는 공간 정보화</p>
                                                    <p>(건축물, 시설물, 선박, 항공기 등)</p>
                                                    <p /* style={{ marginLeft: '14px' }}*/ ><span /* style={{ paddingLeft: '14px' }}*/ >- LoD 4 이상의 고품질 실외 공간 모델링</span></p>
                                                    <p>- 기존 BIM 대비 1/10 수준 경량화</p>
                                                    <p style={{ marginLeft: '14px' }}></p>
                                                    <p></p>

                                                </div>
                                            </span>
                                            <span className={bIntro.digitalTextConts3}>
                                                <div className={bIntro.dTarget2}>시스템 연계통합</div>
                                                <div className={bIntro.dSubFlex2}>
                                                    {/* <span className={bIntro.dCheckIcon2}></span> */}
                                                    <span className={bIntro.dSubTitle2}>
                                                        <p></p>
                                                        <p><span className={bIntro.businessTextBold3}>레거시 시스템 및 IoT 센서</span>의</p>
                                                        <p><span style={{ display: 'inline-block', marginRight: '8px' }}>연계ㆍ통합을 제공합니다.</span><span className={bIntro.businessTextBold2}></span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont2}>
                                                    <p>- 다양한 산업분야 시스템 연계 통합</p>
                                                    <p>(물류, 제조, 항공, 해양, 건설 등)</p>
                                                    <p></p>
                                                    <p>- 기존 센서·CCTV 연계 및 안정화</p>
                                                    <p><span style={{ display: 'inline-block', marginLeft: '14px' }}></span></p>
                                                </div>
                                            </span>
                                            <span className={bIntro.digitalTextConts4}>
                                                <div className={bIntro.dTarget3}>데이터 시각화</div>
                                                <div className={bIntro.dSubFlex3}>
                                                    {/* <span className={bIntro.dCheckIcon3}></span> */}
                                                    <span className={bIntro.dSubTitle3}>
                                                        <p><span className={bIntro.businessTextBold3}>최신 ICT 기술 기반</span>의</p>
                                                        <p><span>데이터 시각화 및 모니터링을 제공합니다.</span></p>
                                                        <p><span className={bIntro.businessTextBold2}></span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont3}>
                                                    <p>- 시스템ㆍ센서 정보 수집 및 시각화</p>
                                                    <p style={{ marginLeft: '14px' }}></p>
                                                    <p>- 시스템ㆍ센서 정보 실시간 모니터링</p>
                                                    <p style={{ marginLeft: '14px' }}></p>
                                                    <p>- 3D 공간정보 기반 데이터 시각화 및 분석</p>
                                                    <p style={{ marginLeft: '14px' }}></p>
                                                </div>
                                            </span>
                                        </div>
                                        <div className={bIntro.majorCasesD}>
                                            <span className={bIntro.majorCircleD}></span>
                                            <span className={bIntro.majorTitleD}>주요 사례</span>
                                            <div className={bIntro.majorFlexBoxD}>
                                                <div className={bIntro.case3}>
                                                    <span className={bIntro.caseIcon3}></span>
                                                    <span className={bIntro.caseText3}>
                                                        <p>여의도 파크원</p>
                                                        <p>(2020)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case4}>
                                                    <span className={bIntro.caseIcon4}></span>
                                                    <span className={bIntro.caseText4}>
                                                        <p>GC녹십자</p>
                                                        <p>(2021)</p>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={bIntro.majorFlexBoxD2}>
                                                <div className={bIntro.case5}>
                                                    <span className={bIntro.caseIcon5}></span>
                                                    <span className={bIntro.caseText5}>
                                                        <p>솔브레인</p>
                                                        <p>(2021)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case6}>
                                                    <span className={bIntro.caseIcon6}></span>
                                                    <span className={bIntro.caseText6}>
                                                        <p></p>
                                                        <p></p>
                                                    </span>
                                                </div>
                                           </div>
                                        </div>
                                    </div>
                                </span>
                            </div>
                        </div>
                        {/* 주요 실적 */}
                        <div id="sectionPerformance">
                            <div className={bIntro.majorPerformanceContentsS}>
                                <span className={bIntro.majorPerformanceTitleS} data-aos="fade-down" data-aos-duration="1000">주요 실적</span>
                                <span className={bIntro.majorPerformanceSelect}>
                                    {/* <div class="majorSelectBox">
                                    <button class="label5M">전체</button>
                                    <ul class="majorOptionList">
                                        <li class="majorOptionItem">전체</li>
                                        <li class="majorOptionItem">안전관리</li>
                                        <li class="majorOptionItem">디지털 트윈</li>
                                    </ul>
                                </div> */}
                                </span>
                                <div className={bIntro.majorListBox}>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>경기융합타운 대표도서관, 신용보증재단 재난관리시스템 구축</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2024년</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>부산 신평/장림산단 디지털 트윈 기반 통합관제 시스템 구축</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2024년</span>
                                            <span className={bIntro.majorListOrder}>부산TP</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>마곡 사이언스파크 재난관리시스템 구축</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2024년</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>경기융합타운 종합방재실 재난관리시스템 구축</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2024년</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>원익QNC 스마트재난시스템 구축</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2024년</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>목포시 강소형 스마트시티 조성사업 수주</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2023년</span>
                                            <span className={bIntro.majorListOrder}>전남정보문화산업진흥원</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>여수 국가산업단지 환경모니터링 시스템 구축</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2023년</span>
                                            <span className={bIntro.majorListOrder}>여수시</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>과기정통부 디지털 트윈 혁신선도 사업(제조실증) 수행</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2023년</span>
                                            <span className={bIntro.majorListOrder}>NIPA</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>강원랜드 중장기안전관리체계 컨설팅 수행</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2023년</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>청량리 수자인 재난관리 시스템 구축</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2022년</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>LG CNS Virtual Datacenter System</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2022년</span>
                                            <span className={bIntro.majorListOrder}>LG CNS</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>솔브레인 공주공장 통합방재플랫폼 소프트웨어 구축</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2021년</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>세종특별자치시 지하공동구 스마트관리시스템 구축</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2020년</span>
                                            <span className={bIntro.majorListOrder}>한국정보화진흥원</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>NIPA 5G 디지털 트윈 공공선도 사업</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2020년</span>
                                            <span className={bIntro.majorListOrder}>정보통신산업진흥원</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>NIPA 5G 디지털 트윈 공공선도 사업 통합 재난 관제 시스템</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2020년</span>
                                            <span className={bIntro.majorListOrder}>정보통신산업진흥원</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>5G 디지털 트윈을 활용한 지자체 및 국방 다중이용 건축물 시설 안전대응 통합관리체계 구축</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2020년</span>
                                            <span className={bIntro.majorListOrder}>정보통신산업진흥원</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>디지털 트윈 기반 지하공동구 지능형 이상탐지 및 안전관리서비스</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2020년</span>
                                            <span className={bIntro.majorListOrder}>한국정보화진흥원</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>신한은행 죽전데이터센터 재난관리 시스템</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2019년</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorClass}>안전관리</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>충남대학교 e재난시스템 구축</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2019년</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorClass}>안전관리</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>ICT기반 재난안전대비 현장훈련시스템 고도화 구축</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2019년</span>
                                            <span className={bIntro.majorListOrder}>한국지역난방공사</span>
                                            <span className={bIntro.majorClass}>안전관리</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>여의도Parc.1 통합모니터링 중 통합재난S/W개발</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2019년</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorClass}>안전관리</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>공간정보 기반의 실감형 콘텐츠 융복합 및 혼합현실 제공기술 개발</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2018년</span>
                                            <span className={bIntro.majorListOrder}>행정안전부</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>세계 최고수준의 저비용∙고효율 실내공간정보 핵심기술 개발 및 실증</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2017년</span>
                                            <span className={bIntro.majorListOrder}>국토교통부</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>3D 기반 도상훈련 시뮬레이터 개발</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2016년</span>
                                            <span className={bIntro.majorListOrder}>산업통상자원부</span>
                                            <span className={bIntro.majorClass}>안전관리</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>에너지산업을 위한 재난안전 대비 현장훈련 시스템 개발</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2016년</span>
                                            <span className={bIntro.majorListOrder}>산업통상자원부</span>
                                            <span className={bIntro.majorClass}>안전관리</span>
                                         </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>실내환경서비스를 위한 IoT 실내 공기질 모니터링 및 플랫폼 기술 상용화</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2016년</span>
                                            <span className={bIntro.majorListOrder}>산업통상자원부</span>
                                            <span className={bIntro.majorClass}>안전관리</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>국가 산업단지내의 재난대응을 위한 Safe-Guard 서비스 플랫폼 개발</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2014년</span>
                                            <span className={bIntro.majorListOrder}>산업통상자원부</span>
                                            <span className={bIntro.majorClass}>안전관리</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 파트너사 */}
                        <div id="sectionPartner">
                            <div className={bIntro.partnerContents}>
                                <span className={bIntro.partnerTitle} data-aos="fade-down" data-aos-duration="1000">파트너사</span>
                                <div className={bIntro.clientArea}>
                                    <div className={bIntro.clientFirst}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo1}></span>
                                            <span className={bIntro.clientName}>국토교통부</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo2}></span>
                                            <span className={bIntro.clientName}>외교부</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo3}></span>
                                            <span className={bIntro.clientName}>해양수산부</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientSecond}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo4}></span>
                                            <span className={bIntro.clientName}>서울특별시</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo5}></span>
                                            <span className={bIntro.clientName}>인천광역시</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo6}></span>
                                            <span className={bIntro.clientName}>경상남도</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientThird}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo7}></span>
                                            <span className={bIntro.clientName}>세종특별자치시</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo8}></span>
                                            <span className={bIntro.clientName}>제주시</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo9}></span>
                                            <span className={bIntro.clientName}>전력거래소</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientFourth}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo10}></span>
                                            <span className={bIntro.clientName}>한국남동발전</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo11}></span>
                                            <span className={bIntro.clientName}>한국지역난방공사</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo12}></span>
                                            <span className={bIntro.clientName}>울산창만공사</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientFifth}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo13}></span>
                                            <span className={bIntro.clientName}>솔브레인</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo14}></span>
                                            <span className={bIntro.clientName}>녹십자</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo15}></span>
                                            <span className={bIntro.clientName}>순천의료원</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientSixth}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo16}></span>
                                            <span className={bIntro.clientName}>파크원</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo17}></span>
                                            <span className={bIntro.clientName}>예울마루</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo18}></span>
                                            <span className={bIntro.clientName}>안양체육관</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientSeventh}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo19}></span>
                                            <span className={bIntro.clientName}>서울대학교</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo20}></span>
                                            <span className={bIntro.clientName}>부산대학교</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo21}></span>
                                            <span className={bIntro.clientName}>충남대학교</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientEighth}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo22}></span>
                                            <span className={bIntro.clientName}>신한은행</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo23}></span>
                                            <span className={bIntro.clientName}>광명 유플래닛</span>
                                        </span>
                                        <span className={bIntro.clientContentsB}>
                                            <span></span>
                                            <span></span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 보도자료 */}
                        <div id="sectionNews">
                            <span className={bIntro.newsTitle} data-aos="fade-down" data-aos-duration="1000">보도자료</span>
                            <div className={bIntro.reportArea}>
                            </div>

                            <div className={bIntro.postingBottomArea}>
                                <span className={bIntro.postingBoxArea}>
                                    {/* {newsUI} */}
                                    {newsUI2}
                                </span>
                            </div>

                            {/* {
                                (this.state.newsDatas && this.state.newsDatas.length > 0) ?
                                    <div className={bIntro.pagination}>
                                        <a><span className={bIntro.arrowLeft} onClick={() => this.setPageIndex(1)}></span></a>
                                        <ul key={""}>
                                            {pageIndexUI}
                                        </ul>
                                        <a><span className={bIntro.arrowRight} onClick={() => this.setPageIndex(this.state.maxPageIndex)}></span></a>
                                    </div>
                                    : <></>
                            } */}
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
            displayBusinessUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={bIntro.eIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">사업분야</span>
                            <span data-aos="fade-down" data-aos-duration="1000">유엔이의 사업 분야 및 주요 실적, 파트너사를 소개합니다.</span>
                        </div>
                        {/* 안전관리 */}
                        <div id="sectionSafety">
                            <div className={bIntro.safetyInforContentsSect2}>
                                <span className={bIntro.safetyTextBox}>
                                    <span className={bIntro.safetyManageTitle} data-aos="fade-down" data-aos-duration="1000">안전관리 솔루션·컨설팅 사업</span>
                                    <div className={bIntro.safetyManageContents}>
                                        <div className={bIntro.safetyMText1}>
                                            {/* <span className={bIntro.safetyTextConts}>
                                                <span className={bIntro.safetyTexts1}>화재, 가스누출, 침수, 지진 등<span className={bIntro.businessTextBold}>지속적으로 발생하는 사고/ 재난 대응의 핵심은 신속과 효율</span>에 있습니다.<span className={bIntro.businessTextBold}></span></span>
                                                <span className={bIntro.safetyTexts2}><p style={{ marginRight: '8px', display: 'inline-block' }}>이를 위해</p><span className={bIntro.businessTextBlack}>각종 센서와 CCTV 정보를 실시간으로 연계·수집·분석</span><span className={bIntro.businessTextBlack}><p style={{ margin: '0px', display: 'inline-block' }}></p></span>하고,</span>
                                                <span className={bIntro.safetyTexts3}><span className={bIntro.businessTextBlack}>실내외 공간정보와 결합하여 현황을 시각화</span><p style={{ marginRight: '8px', display: 'inline-block' }}>하며, </p><span className={bIntro.businessTextBlack}></span></span>
                                                <span className={bIntro.safetyTexts4}><span className={bIntro.businessTextBlack}>재난유형별 SOP(표준행동절차)</span><p style={{ marginRight: '8px', display: 'inline-block' }}>를 통해</p><span className={bIntro.businessTextBlack}>행동요령을 공유하고 상황을 전파</span>하는 것이 중요합니다.<span className={bIntro.businessTextBlack}></span></span>
                                                <span className={bIntro.safetyTexts6}><span className={bIntro.businessTextBold}></span><p style={{ marginLeft: '8px', display: 'inline-block' }}>유엔이는 실내외 공간에 대한 이해와 축적된 재난안전 기술 및 사업 역량을 바탕으로</p></span>
                                                <span className={bIntro.safetyTexts7}><span className={bIntro.businessTextBold}></span><span className={bIntro.businessTextBold}>컨설팅과 솔루션 모두를 포괄하는 지속가능한 안전관리 서비스를 제공</span><span>합니다.</span></span>
                                            </span> */}

                                            <span className={bIntro.safetyTextConts}>
                                                <span className={bIntro.safetyTexts1}>
                                                    화재, 가스누출, 침수, 지진 등
                                                </span>
                                                <span className={bIntro.safetyTexts2}>
                                                    <span className={bIntro.businessTextBold}>지속적으로 발생하는 사고/ 재난 대응의 핵심은 신속과 효율</span>에 있습니다.
                                                </span>
                                                <span className={bIntro.safetyTexts3}>
                                                    이를 위해<span className={bIntro.businessTextBlack}>각종 센서와 CCTV 정보를 실시간으로 연계·수집·분석</span>하고,
                                                </span>
                                                <span className={bIntro.safetyTexts4}>
                                                    <span className={bIntro.businessTextBlack}>실내외 공간정보와 결합하여 현황을 시각화</span>하며,
                                                </span>
                                                <span className={bIntro.safetyTexts5}>
                                                    <span className={bIntro.businessTextBlack}>재난유형별 SOP(표준행동절차)</span>를 통해
                                                </span>
                                                <span className={bIntro.safetyTexts6}>
                                                    <span className={bIntro.businessTextBlack}>행동요령을 공유하고 상황을 전파</span>하는 것이 중요합니다.
                                                </span>
                                                <span className={bIntro.safetyTexts7}>
                                                    유엔이는 실내외 공간에 대한 이해와
                                                </span>
                                                <span className={bIntro.safetyTexts8}>
                                                    축적된 재난안전 기술 및 사업 역량을 바탕으로
                                                </span>
                                                <span className={bIntro.safetyTexts9}>
                                                    <span className={bIntro.businessTextBold}>컨설팅과 솔루션 모두를 포괄하는 지속가능한 안전관리 서비스를 제공</span>합니다.
                                                </span>
                                            </span>
                                        </div>

                                        <div className={bIntro.safetyMText2}>
                                            <span className={bIntro.safetyTextConts2}>
                                                <div className={bIntro.sTarget1}>안전관리 컨설팅</div>
                                                <div className={bIntro.sSubFlex1}>
                                                    {/* <span className={bIntro.sCheckIcon}></span> */}
                                                    <span className={bIntro.sSubTitle1}>
                                                        <p className={bIntro.sSubText1}><span className={bIntro.businessTextBold2}>재난 상황에 실질적인 도움</span>이 되는</p>
                                                        <p className={bIntro.sSubText1}><span>안전관리 컨설팅 서비스를 제공합니다.</span><span className={bIntro.businessTextBold2} style={{ marginLeft: '8px' }}></span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.sSubCont1}>
                                                    <p>- 재난상황별 위기대응 매뉴얼 개발</p>
                                                    <p>- 위험성 평가</p>
                                                    <p>- 안전 관련 정책 및 로드맵 수립</p>
                                                    <p>- 훈련 시나리오 개발</p>
                                                    <p>- 민방위 정책 기획</p>
                                                    <p>- 중대재해처벌법 관련 대책 컨설팅</p>
                                                </div>
                                            </span>
                                            <span className={bIntro.safetyTextConts3}>
                                                <div className={bIntro.sTarget2}>스마트 솔루션</div>
                                                <div className={bIntro.sSubFlex2}>
                                                    {/* <span className={bIntro.sCheckIcon2}></span> */}
                                                    <span className={bIntro.sSubTitle2}>
                                                        <p><span className={bIntro.businessTextBold2}>다양한 유형의 재난 발생에 대응 가능한</span></p>
                                                        <p>스마트 안전관리 솔루션을 제공합니다.<span className={bIntro.businessTextBold2} style={{ marginLeft: '8px' }}></span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.sSubCont2}>
                                                    <p>- 스마트재난대응시스템</p>
                                                    <p>- 스마트재난탐지시스템</p>
                                                    <p>- 스마트환경모니터링시스템</p>
                                                    <p>- 스마트유해물질관리시스템</p>
                                                    <p>- 스마트시설물관리시스템</p>
                                                    <p>- 스마트작업자안전관리시스템</p>
                                                    <p></p>
                                                    <p></p>
                                                </div>
                                            </span>
                                        </div>
                                        <div className={bIntro.majorCases}>
                                            <span className={bIntro.majorCircle}></span>
                                            <span className={bIntro.majorTitle}>주요 사례</span>
                                            <div className={bIntro.majorFlexPic}>
                                                <div className={bIntro.case1}>
                                                    <span className={bIntro.caseIcon1}></span>
                                                    <span className={bIntro.caseText1}>
                                                        <p>한국남동발전</p>
                                                        <p>(2015)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case2}>
                                                    <span className={bIntro.caseIcon2}></span>
                                                    <span className={bIntro.caseText2}>
                                                        <p>경상남도</p>
                                                        <p>(2020)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case3}>
                                                    <span className={bIntro.caseIcon3}></span>
                                                    <span className={bIntro.caseText3}>
                                                        <p>광명 어반브릭스</p>
                                                        <p>(2021)</p>
                                                    </span>
                                                </div>
                                            </div>
                                            {/* <div className={bIntro.majorFlexPic2}>
                                                <div className={bIntro.case3}>
                                                    <span className={bIntro.caseIcon3}></span>
                                                    <span className={bIntro.caseText3}>
                                                        <p>광명 어반브릭스</p>
                                                        <p>(2021)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case4}>
                                                    <span className={bIntro.caseIcon4}></span>
                                                    <span className={bIntro.caseText4}></span>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                </span>
                            </div>
                        </div>
                        {/* 디지털 트윈 */}
                        <div id="sectionDigital">
                            <div className={bIntro.digitalInforContentsSect2}>
                                <span className={bIntro.digitalTextBox}>
                                    <span className={bIntro.digitalManageTitle} data-aos="fade-down" data-aos-duration="1000">디지털 트윈 응용 솔루션 사업</span>
                                    <div className={bIntro.digitalManageContents}>
                                        <div className={bIntro.digitalMText1}>
                                            <span className={bIntro.digitalTextConts}>
                                                <span className={bIntro.digitalTexts1}>
                                                    디지털 트윈은 건물, 시설물, 센서장비, 업무 프로세스 등의
                                                </span>
                                                <span className={bIntro.digitalTexts2}>
                                                    <span className={bIntro.businessTextBold}>현실에 존재하는 인프라를 가상 공간에 동일하게 구현한 개념 기술</span>입니다.
                                                </span>
                                                <span className={bIntro.digitalTexts3}>
                                                    가상 공간의 객체와 시스템, 데이터들은<span className={bIntro.businessTextBlack}>현실 공간과 실시간 연결</span>되어
                                                </span>
                                                <span className={bIntro.digitalTexts4}>
                                                    모니터링, 제어, 시뮬레이션이 가능하며,
                                                </span>
                                                <span className={bIntro.digitalTexts5}>
                                                    이를 통해 실제 시설물의 변경 없이도
                                                </span>
                                                <span className={bIntro.digitalTexts6}>
                                                    <span className={bIntro.businessTextBlack}>현실에서 보다 나은 의사결정과 운영관리를 지원</span>합니다.
                                                </span>
                                                <span className={bIntro.digitalTexts7}>
                                                    유엔이는 실내외 공간 통합 구축기술, 레거시 시스템 및 IoT 연계·통합,
                                                </span>
                                                <span className={bIntro.digitalTexts8}>
                                                    빅데이터/AI 기반 실시간 모니터링 및 시뮬레이션 기술을 통해
                                                </span>
                                                <span className={bIntro.digitalTexts9}>
                                                    <span className={bIntro.businessTextBold}>다양한 산업분야에서 고객의 요구를 만족시키는</span>
                                                </span>
                                                <span className={bIntro.digitalTexts10}>
                                                    <span className={bIntro.businessTextBold}>디지털 트윈 기반 응용 솔루션을 제공</span>합니다.
                                                </span>
                                            </span>
                                        </div>

                                        <div className={bIntro.digitalMText2}>
                                            <span className={bIntro.digitalTextConts2}>
                                                <div className={bIntro.dTarget1}>공간정보 구축</div>
                                                <div className={bIntro.dSubFlex1}>
                                                    {/* <span className={bIntro.dCheckIcon}></span> */}
                                                    <span className={bIntro.dSubTitle1}>
                                                        <p><span className={bIntro.businessTextBold3}>경량의 고품질</span><span></span><span className={bIntro.businessTextBold3}></span></p>
                                                        <p><span className={bIntro.businessTextBold3}></span></p>
                                                        <p><span>실내외 공간정보를 구축합니다.</span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont1}>
                                                    <p>- 사람이 체류하는 공간 정보화</p>
                                                    <p>(건축물, 시설물, 선박, 항공기 등)</p>
                                                    <p /* style={{ marginLeft: '14px' }}*/ ><span /* style={{ paddingLeft: '14px' }}*/ >- LoD 4 이상의 고품질 실외 공간 모델링</span></p>
                                                    <p>- 기존 BIM 대비 1/10 수준 경량화</p>
                                                    <p style={{ marginLeft: '14px' }}></p>
                                                    <p></p>

                                                </div>
                                            </span>
                                            <span className={bIntro.digitalTextConts3}>
                                                <div className={bIntro.dTarget2}>시스템 연계통합</div>
                                                <div className={bIntro.dSubFlex2}>
                                                    {/* <span className={bIntro.dCheckIcon2}></span> */}
                                                    <span className={bIntro.dSubTitle2}>
                                                        <p></p>
                                                        <p><span className={bIntro.businessTextBold3}>레거시 시스템 및 IoT 센서</span>의</p>
                                                        <p><span style={{ display: 'inline-block', marginRight: '8px' }}>연계ㆍ통합을 제공합니다.</span><span className={bIntro.businessTextBold2}></span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont2}>
                                                    <p>- 다양한 산업분야 시스템 연계 통합</p>
                                                    <p>(물류, 제조, 항공, 해양, 건설 등)</p>
                                                    <p></p>
                                                    <p>- 기존 센서·CCTV 연계 및 안정화</p>
                                                    <p><span style={{ display: 'inline-block', marginLeft: '14px' }}></span></p>
                                                </div>
                                            </span>
                                            <span className={bIntro.digitalTextConts4}>
                                                <div className={bIntro.dTarget3}>데이터 시각화</div>
                                                <div className={bIntro.dSubFlex3}>
                                                    {/* <span className={bIntro.dCheckIcon3}></span> */}
                                                    <span className={bIntro.dSubTitle3}>
                                                        <p><span className={bIntro.businessTextBold3}>최신 ICT 기술 기반</span>의</p>
                                                        <p><span>데이터 시각화 및 모니터링을 제공합니다.</span></p>
                                                        <p><span className={bIntro.businessTextBold2}></span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont3}>
                                                    <p>- 시스템ㆍ센서 정보 수집 및 시각화</p>
                                                    <p style={{ marginLeft: '14px' }}></p>
                                                    <p>- 시스템ㆍ센서 정보 실시간 모니터링</p>
                                                    <p style={{ marginLeft: '14px' }}></p>
                                                    <p>- 3D 공간정보 기반 데이터 시각화 및 분석</p>
                                                    <p style={{ marginLeft: '14px' }}></p>
                                                </div>
                                            </span>
                                        </div>
                                        <div className={bIntro.majorCasesD}>
                                            <span className={bIntro.majorCircleD}></span>
                                            <span className={bIntro.majorTitleD}>주요 사례</span>
                                            <div className={bIntro.majorFlexBoxD}>
                                                <div className={bIntro.case3}>
                                                    <span className={bIntro.caseIcon3}></span>
                                                    <span className={bIntro.caseText3}>
                                                        <p>여의도 파크원</p>
                                                        <p>(2020)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case4}>
                                                    <span className={bIntro.caseIcon4}></span>
                                                    <span className={bIntro.caseText4}>
                                                        <p>GC녹십자</p>
                                                        <p>(2021)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case5}>
                                                    <span className={bIntro.caseIcon5}></span>
                                                    <span className={bIntro.caseText5}>
                                                        <p>솔브레인</p>
                                                        <p>(2021)</p>
                                                    </span>
                                                </div>
                                            </div>
                                            {/* <div className={bIntro.majorFlexBoxD2}>
                                                <div className={bIntro.case5}>
                                                    <span className={bIntro.caseIcon5}></span>
                                                    <span className={bIntro.caseText5}>
                                                        <p>솔브레인</p>
                                                        <p>(2021)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case6}>
                                                    <span className={bIntro.caseIcon6}></span>
                                                    <span className={bIntro.caseText6}>
                                                        <p></p>
                                                        <p></p>
                                                    </span>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                </span>
                            </div>
                        </div>
                        {/* 주요 실적 */}
                        <div id="sectionPerformance">
                            <div className={bIntro.majorPerformanceContentsS}>
                                <span className={bIntro.majorPerformanceTitleS} data-aos="fade-down" data-aos-duration="1000">주요 실적</span>
                                <span className={bIntro.majorPerformanceSelect}>
                                    {/* <div class="majorSelectBox">
                                    <button class="label5M">전체</button>
                                    <ul class="majorOptionList">
                                        <li class="majorOptionItem">전체</li>
                                        <li class="majorOptionItem">안전관리</li>
                                        <li class="majorOptionItem">디지털 트윈</li>
                                    </ul>
                                </div> */}
                                </span>
                                <div className={bIntro.majorListBox}>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>경기융합타운 대표도서관, 신용보증재단 재난관리시스템 구축</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2024년</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>부산 신평/장림산단 디지털 트윈 기반 통합관제 시스템 구축</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2024년</span>
                                            <span className={bIntro.majorListOrder}>부산TP</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>마곡 사이언스파크 재난관리시스템 구축</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2024년</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>경기융합타운 종합방재실 재난관리시스템 구축</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2024년</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>원익QNC 스마트재난시스템 구축</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2024년</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>목포시 강소형 스마트시티 조성사업 수주</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2023년</span>
                                            <span className={bIntro.majorListOrder}>전남정보문화산업진흥원</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>여수 국가산업단지 환경모니터링 시스템 구축</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2023년</span>
                                            <span className={bIntro.majorListOrder}>여수시</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>과기정통부 디지털 트윈 혁신선도 사업(제조실증) 수행</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2023년</span>
                                            <span className={bIntro.majorListOrder}>NIPA</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>강원랜드 중장기안전관리체계 컨설팅 수행</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2023년</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>청량리 수자인 재난관리 시스템 구축</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2022년</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>LG CNS Virtual Datacenter System</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2022년</span>
                                            <span className={bIntro.majorListOrder}>LG CNS</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>솔브레인 공주공장 통합방재플랫폼 소프트웨어 구축</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2021년</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>세종특별자치시 지하공동구 스마트관리시스템 구축</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2020년</span>
                                            <span className={bIntro.majorListOrder}>한국정보화진흥원</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>NIPA 5G 디지털 트윈 공공선도 사업</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2020년</span>
                                            <span className={bIntro.majorListOrder}>정보통신산업진흥원</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>NIPA 5G 디지털 트윈 공공선도 사업 통합 재난 관제 시스템</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2020년</span>
                                            <span className={bIntro.majorListOrder}>정보통신산업진흥원</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>5G 디지털 트윈을 활용한 지자체 및 국방 다중이용 건축물 시설 안전대응 통합관리체계 구축</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2020년</span>
                                            <span className={bIntro.majorListOrder}>정보통신산업진흥원</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>디지털 트윈 기반 지하공동구 지능형 이상탐지 및 안전관리서비스</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2020년</span>
                                            <span className={bIntro.majorListOrder}>한국정보화진흥원</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>신한은행 죽전데이터센터 재난관리 시스템</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2019년</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorClass}>안전관리</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>충남대학교 e재난시스템 구축</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2019년</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorClass}>안전관리</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>ICT기반 재난안전대비 현장훈련시스템 고도화 구축</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2019년</span>
                                            <span className={bIntro.majorListOrder}>한국지역난방공사</span>
                                            <span className={bIntro.majorClass}>안전관리</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>여의도Parc.1 통합모니터링 중 통합재난S/W개발</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2019년</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorClass}>안전관리</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>공간정보 기반의 실감형 콘텐츠 융복합 및 혼합현실 제공기술 개발</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2018년</span>
                                            <span className={bIntro.majorListOrder}>행정안전부</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>세계 최고수준의 저비용∙고효율 실내공간정보 핵심기술 개발 및 실증</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2017년</span>
                                            <span className={bIntro.majorListOrder}>국토교통부</span>
                                            <span className={bIntro.majorClass}>디지털트윈</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>3D 기반 도상훈련 시뮬레이터 개발</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2016년</span>
                                            <span className={bIntro.majorListOrder}>산업통상자원부</span>
                                            <span className={bIntro.majorClass}>안전관리</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>에너지산업을 위한 재난안전 대비 현장훈련 시스템 개발</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2016년</span>
                                            <span className={bIntro.majorListOrder}>산업통상자원부</span>
                                            <span className={bIntro.majorClass}>안전관리</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>실내환경서비스를 위한 IoT 실내 공기질 모니터링 및 플랫폼 기술 상용화</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2016년</span>
                                            <span className={bIntro.majorListOrder}>산업통상자원부</span>
                                            <span className={bIntro.majorClass}>안전관리</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>국가 산업단지내의 재난대응을 위한 Safe-Guard 서비스 플랫폼 개발</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2014년</span>
                                            <span className={bIntro.majorListOrder}>산업통상자원부</span>
                                            <span className={bIntro.majorClass}>안전관리</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 파트너사 */}
                        <div id="sectionPartner">
                            <div className={bIntro.partnerContents}>
                                <span className={bIntro.partnerTitle} data-aos="fade-down" data-aos-duration="1000">파트너사</span>
                                <div className={bIntro.clientArea}>
                                    <div className={bIntro.clientFirst}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo1}></span>
                                            <span className={bIntro.clientName}>국토교통부</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo2}></span>
                                            <span className={bIntro.clientName}>외교부</span>
                                        </span>
                                        <span className={bIntro.clientContentsR}>
                                            <span className={bIntro.clientLogo3}></span>
                                            <span className={bIntro.clientName}>해양수산부</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientSecond}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo4}></span>
                                            <span className={bIntro.clientName}>서울특별시</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo5}></span>
                                            <span className={bIntro.clientName}>인천광역시</span>
                                        </span>
                                        <span className={bIntro.clientContentsR}>
                                            <span className={bIntro.clientLogo6}></span>
                                            <span className={bIntro.clientName}>경상남도</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientThird}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo7}></span>
                                            <span className={bIntro.clientName}>세종특별자치시</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo8}></span>
                                            <span className={bIntro.clientName}>제주시</span>
                                        </span>
                                        <span className={bIntro.clientContentsR}>
                                            <span className={bIntro.clientLogo9}></span>
                                            <span className={bIntro.clientName}>전력거래소</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientFourth}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo10}></span>
                                            <span className={bIntro.clientName}>한국남동발전</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo11}></span>
                                            <span className={bIntro.clientName}>한국지역난방공사</span>
                                        </span>
                                        <span className={bIntro.clientContentsR}>
                                            <span className={bIntro.clientLogo12}></span>
                                            <span className={bIntro.clientName}>울산창만공사</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientFifth}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo13}></span>
                                            <span className={bIntro.clientName}>솔브레인</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo14}></span>
                                            <span className={bIntro.clientName}>녹십자</span>
                                        </span>
                                        <span className={bIntro.clientContentsR}>
                                            <span className={bIntro.clientLogo15}></span>
                                            <span className={bIntro.clientName}>순천의료원</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientSixth}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo16}></span>
                                            <span className={bIntro.clientName}>파크원</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo17}></span>
                                            <span className={bIntro.clientName}>예울마루</span>
                                        </span>
                                        <span className={bIntro.clientContentsR}>
                                            <span className={bIntro.clientLogo18}></span>
                                            <span className={bIntro.clientName}>안양체육관</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientSeventh}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo19}></span>
                                            <span className={bIntro.clientName}>서울대학교</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo20}></span>
                                            <span className={bIntro.clientName}>부산대학교</span>
                                        </span>
                                        <span className={bIntro.clientContentsR}>
                                            <span className={bIntro.clientLogo21}></span>
                                            <span className={bIntro.clientName}>충남대학교</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientEighth}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo22}></span>
                                            <span className={bIntro.clientName}>신한은행</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo23}></span>
                                            <span className={bIntro.clientName}>광명 유플래닛</span>
                                        </span>
                                        <span className={bIntro.clientContentsB}>
                                            <span></span>
                                            <span></span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 보도자료 */}
                        <div id="sectionNews">
                            <span className={bIntro.newsTitle} data-aos="fade-down" data-aos-duration="1000">보도자료</span>
                            <div className={bIntro.reportArea}>
                            </div>

                            {/* <span className={bIntro.reportBtnLeftCon}></span> */}
                            <div className={bIntro.postingBottomArea}>
                                <span className={bIntro.postingBoxArea}>
                                   {newsUI}
                                </span>
                            </div>
                            {/* <span className={bIntro.reportBtnRightCon}></span> */}

                            {/*  {
                                (this.state.newsDatas && this.state.newsDatas.length > 0) ?
                                    <div className={bIntro.pagination}>
                                        <a><span className={bIntro.arrowLeft} onClick={() => this.setPageIndex(1)}></span></a>
                                        <ul key={""}>
                                            {pageIndexUI}
                                        </ul>
                                        <a><span className={bIntro.arrowRight} onClick={() => this.setPageIndex(this.state.maxPageIndex)}></span></a>
                                    </div>
                                    : <></>
                            } */}
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
            displayBusinessUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={bIntro.eIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">사업분야</span>
                            <span data-aos="fade-down" data-aos-duration="1000">유엔이의 사업 분야 및 주요 실적, 파트너사를 소개합니다.</span>
                        </div>
                        {/* 안전관리 */}
                        <div id="sectionSafety">
                            <div className={bIntro.safetyInforContentsSect2}>
                                <span className={bIntro.safetyTextBox}>
                                    <span className={bIntro.safetyManageTitle} data-aos="fade-down" data-aos-duration="1000">안전관리 솔루션·컨설팅 사업</span>
                                    <div className={bIntro.safetyManageContents}>
                                        <div className={bIntro.safetyMText1}>
                                            {/* <span className={bIntro.safetyTextConts}>
                                                <span className={bIntro.safetyTexts1}>화재, 가스누출, 침수, 지진 등<span className={bIntro.businessTextBold}>지속적으로 발생하는 사고/ 재난 대응의 핵심은 신속과 효율</span>에 있습니다.<span className={bIntro.businessTextBold}></span></span>
                                                <span className={bIntro.safetyTexts2}><p style={{ marginRight: '8px', display: 'inline-block' }}>이를 위해</p><span className={bIntro.businessTextBlack}>각종 센서와 CCTV 정보를 실시간으로 연계·수집·분석</span><span className={bIntro.businessTextBlack}><p style={{ margin: '0px', display: 'inline-block' }}></p></span>하고,</span>
                                                <span className={bIntro.safetyTexts3}><span className={bIntro.businessTextBlack}>실내외 공간정보와 결합하여 현황을 시각화</span><p style={{ marginRight: '8px', display: 'inline-block' }}>하며, </p><span className={bIntro.businessTextBlack}></span></span>
                                                <span className={bIntro.safetyTexts4}><span className={bIntro.businessTextBlack}>재난유형별 SOP(표준행동절차)</span><p style={{ marginRight: '8px', display: 'inline-block' }}>를 통해</p><span className={bIntro.businessTextBlack}>행동요령을 공유하고 상황을 전파</span>하는 것이 중요합니다.<span className={bIntro.businessTextBlack}></span></span>
                                                <span className={bIntro.safetyTexts6}><span className={bIntro.businessTextBold}></span><p style={{ marginLeft: '8px', display: 'inline-block' }}>유엔이는 실내외 공간에 대한 이해와 축적된 재난안전 기술 및 사업 역량을 바탕으로</p></span>
                                                <span className={bIntro.safetyTexts7}><span className={bIntro.businessTextBold}></span><span className={bIntro.businessTextBold}>컨설팅과 솔루션 모두를 포괄하는 지속가능한 안전관리 서비스를 제공</span><span>합니다.</span></span>
                                            </span> */}

                                            <span className={bIntro.safetyTextConts}>
                                                <span className={bIntro.safetyTexts1}>
                                                    화재, 가스누출, 침수, 지진 등
                                                </span>
                                                <span className={bIntro.safetyTexts2}>
                                                    <span className={bIntro.businessTextBold}>지속적으로 발생하는 사고/ 재난 대응의 핵심은 신속과 효율</span>에 있습니다.
                                                </span>
                                                <span className={bIntro.safetyTexts3}>
                                                    이를 위해<span className={bIntro.businessTextBlack}>각종 센서와 CCTV 정보를 실시간으로 연계·수집·분석</span>하고,
                                                </span>
                                                <span className={bIntro.safetyTexts4}>
                                                    <span className={bIntro.businessTextBlack}>실내외 공간정보와 결합하여 현황을 시각화</span>하며,
                                                </span>
                                                <span className={bIntro.safetyTexts5}>
                                                    <span className={bIntro.businessTextBlack}>재난유형별 SOP(표준행동절차)</span>를 통해
                                                </span>
                                                <span className={bIntro.safetyTexts6}>
                                                    <span className={bIntro.businessTextBlack}>행동요령을 공유하고 상황을 전파</span>하는 것이 중요합니다.
                                                </span>
                                                <span className={bIntro.safetyTexts7}>
                                                    유엔이는 실내외 공간에 대한 이해와
                                                </span>
                                                <span className={bIntro.safetyTexts8}>
                                                    축적된 재난안전 기술 및 사업 역량을 바탕으로
                                                </span>
                                                <span className={bIntro.safetyTexts9}>
                                                    <span className={bIntro.businessTextBold}>컨설팅과 솔루션 모두를 포괄하는 지속가능한 안전관리 서비스를 제공</span>합니다.
                                                </span>
                                            </span>
                                        </div>

                                        <div className={bIntro.safetyMText2}>
                                            <span className={bIntro.safetyTextConts2}>
                                                <div className={bIntro.sTarget1}>안전관리 컨설팅</div>
                                                <div className={bIntro.sSubFlex1}>
                                                    {/* <span className={bIntro.sCheckIcon}></span> */}
                                                    <span className={bIntro.sSubTitle1}>
                                                        <p className={bIntro.sSubText1}><span className={bIntro.businessTextBold2}>재난 상황에 실질적인 도움</span>이 되는</p>
                                                        <p className={bIntro.sSubText1}><span>안전관리 컨설팅 서비스를 제공합니다.</span><span className={bIntro.businessTextBold2} style={{ marginLeft: '8px' }}></span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.sSubCont1}>
                                                    <p>- 재난상황별 위기대응 매뉴얼 개발</p>
                                                    <p>- 위험성 평가</p>
                                                    <p>- 안전 관련 정책 및 로드맵 수립</p>
                                                    <p>- 훈련 시나리오 개발</p>
                                                    <p>- 민방위 정책 기획</p>
                                                    <p>- 중대재해처벌법 관련 대책 컨설팅</p>
                                                </div>
                                            </span>
                                            <span className={bIntro.safetyTextConts3}>
                                                <div className={bIntro.sTarget2}>스마트 솔루션</div>
                                                <div className={bIntro.sSubFlex2}>
                                                    {/* <span className={bIntro.sCheckIcon2}></span> */}
                                                    <span className={bIntro.sSubTitle2}>
                                                        <p><span className={bIntro.businessTextBold2}>다양한 유형의 재난 발생에 대응 가능한</span></p>
                                                        <p>스마트 안전관리 솔루션을 제공합니다.<span className={bIntro.businessTextBold2} style={{ marginLeft: '8px' }}></span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.sSubCont2}>
                                                    <p>- 스마트재난대응시스템</p>
                                                    <p>- 스마트재난탐지시스템</p>
                                                    <p>- 스마트환경모니터링시스템</p>
                                                    <p>- 스마트유해물질관리시스템</p>
                                                    <p>- 스마트시설물관리시스템</p>
                                                    <p>- 스마트작업자안전관리시스템</p>
                                                    <p></p>
                                                    <p></p>
                                                </div>
                                            </span>
                                        </div>
                                        <div className={bIntro.majorCases}>
                                            <span className={bIntro.majorCircle}></span>
                                            <span className={bIntro.majorTitle}>주요 사례</span>
                                            <div className={bIntro.majorFlexPic}>
                                                <div className={bIntro.case1}>
                                                    <span className={bIntro.caseIcon1}></span>
                                                    <span className={bIntro.caseText1}>
                                                        <p>한국남동발전</p>
                                                        <p>(2015)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case2}>
                                                    <span className={bIntro.caseIcon2}></span>
                                                    <span className={bIntro.caseText2}>
                                                        <p>경상남도</p>
                                                        <p>(2020)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case3}>
                                                    <span className={bIntro.caseIcon2}></span>
                                                    <span className={bIntro.caseText3}>
                                                        <p>광명 어반브릭스</p>
                                                        <p>(2021)</p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </span>
                            </div>
                        </div>
                        {/* 디지털 트윈 */}
                        <div id="sectionDigital">
                            <div className={bIntro.digitalInforContentsSect2}>
                                <span className={bIntro.digitalTextBox}>
                                    <span className={bIntro.digitalManageTitle} data-aos="fade-down" data-aos-duration="1000">디지털 트윈 응용 솔루션 사업</span>
                                    <div className={bIntro.digitalManageContents}>
                                        <div className={bIntro.digitalMText1}>
                                            {/* <span className={bIntro.digitalTextConts}>
                                                <span className={bIntro.digitalTexts1}>디지털 트윈은 건물, 시설물, 센서장비, 업무 프로세스 등의<span className={bIntro.businessTextBold}>현실에 존재하는 인프라를 가상 공간에 동일하게 구현한 개념 기술</span>입니다.</span>
                                                <span className={bIntro.digitalTexts2}><p style={{ marginRight: '8px', display: 'inline-block' }}>가상 공간의 객체와 시스템, 데이터들은</p><span className={bIntro.businessTextBlack}>현실 공간과 실시간 연결</span>되어 모니터링, 제어, 시뮬레이션이 가능하며,</span>
                                                <span className={bIntro.digitalTexts3}><p style={{ marginRight: '8px', display: 'inline-block' }}>이를 통해 실제 시설물의 변경 없이도</p><span className={bIntro.businessTextBlack}>현실에서 보다 나은 의사결정과 운영관리를 지원</span><p style={{ display: 'inline-block' }}>합니다.</p></span>
                                                <span className={bIntro.digitalTexts4}>유엔이는 실내외 공간 통합 구축기술, 레거시 시스템 및 IoT 연계·통합, 빅데이터/AI 기반 실시간 모니터링 및 시뮬레이션 기술을 통해<span className={bIntro.businessTextBlack}></span></span>
                                                <span className={bIntro.digitalTexts5}><span style={{ marginLeft: '8px', display: 'inline-block' }}></span></span>
                                                <span className={bIntro.digitalTexts6}><span className={bIntro.businessTextBold}>다양한 산업분야에서 고객의 요구를 만족시키는 디지털 트윈 기반 응용 솔루션을 제공</span>합니다</span>
                                                <span className={bIntro.digitalTexts7}><span></span></span>
                                                <span className={bIntro.digitalTexts8}></span>
                                            </span> */}

                                            <span className={bIntro.digitalTextConts}>
                                                <span className={bIntro.digitalTexts1}>
                                                    디지털 트윈은 건물, 시설물, 센서장비, 업무 프로세스 등의
                                                </span>
                                                <span className={bIntro.digitalTexts2}>
                                                    <span className={bIntro.businessTextBold}>현실에 존재하는 인프라를 가상 공간에 동일하게 구현한 개념 기술</span>입니다.
                                                </span>
                                                <span className={bIntro.digitalTexts3}>
                                                    가상 공간의 객체와 시스템, 데이터들은<span className={bIntro.businessTextBlack}>현실 공간과 실시간 연결</span>되어
                                                </span>
                                                <span className={bIntro.digitalTexts4}>
                                                    모니터링, 제어, 시뮬레이션이 가능하며,
                                                </span>
                                                <span className={bIntro.digitalTexts5}>
                                                    이를 통해 실제 시설물의 변경 없이도
                                                </span>
                                                <span className={bIntro.digitalTexts6}>
                                                    <span className={bIntro.businessTextBlack}>현실에서 보다 나은 의사결정과 운영관리를 지원</span>합니다.
                                                </span>
                                                <span className={bIntro.digitalTexts7}>
                                                    유엔이는 실내외 공간 통합 구축기술, 레거시 시스템 및 IoT 연계·통합,
                                                </span>
                                                <span className={bIntro.digitalTexts8}>
                                                    빅데이터/AI 기반 실시간 모니터링 및 시뮬레이션 기술을 통해
                                                </span>
                                                <span className={bIntro.digitalTexts9}>
                                                    <span className={bIntro.businessTextBold}>다양한 산업분야에서 고객의 요구를 만족시키는</span>
                                                </span>
                                                <span className={bIntro.digitalTexts10}>
                                                    <span className={bIntro.businessTextBold}>디지털 트윈 기반 응용 솔루션을 제공</span>합니다.
                                                </span>
                                            </span>
                                        </div>

                                        <div className={bIntro.digitalMText2}>
                                            <span className={bIntro.digitalTextConts2}>
                                                <div className={bIntro.dTarget1}>공간정보 구축</div>
                                                <div className={bIntro.dSubFlex1}>
                                                    {/* <span className={bIntro.dCheckIcon}></span> */}
                                                    <span className={bIntro.dSubTitle1}>
                                                        <p><span className={bIntro.businessTextBold3}>경량의 고품질</span><span></span><span className={bIntro.businessTextBold3}></span></p>
                                                        <p><span className={bIntro.businessTextBold3}></span></p>
                                                        <p><span>실내외 공간정보를 구축합니다.</span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont1}>
                                                    <p>- 사람이 체류하는 공간 정보화</p>
                                                    <p>(건축물, 시설물, 선박, 항공기 등)</p>
                                                    <p /* style={{ marginLeft: '14px' }}*/ ><span /* style={{ paddingLeft: '14px' }}*/ >- LoD 4 이상의 고품질 실외 공간 모델링</span></p>
                                                    <p>- 기존 BIM 대비 1/10 수준 경량화</p>
                                                    <p style={{ marginLeft: '14px' }}></p>
                                                    <p></p>

                                                </div>
                                            </span>
                                            <span className={bIntro.digitalTextConts3}>
                                                <div className={bIntro.dTarget2}>시스템 연계통합</div>
                                                <div className={bIntro.dSubFlex2}>
                                                    {/* <span className={bIntro.dCheckIcon2}></span> */}
                                                    <span className={bIntro.dSubTitle2}>
                                                        <p></p>
                                                        <p><span className={bIntro.businessTextBold3}>레거시 시스템 및 IoT 센서</span>의</p>
                                                        <p><span style={{ display: 'inline-block', marginRight: '8px' }}>연계ㆍ통합을 제공합니다.</span><span className={bIntro.businessTextBold2}></span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont2}>
                                                    <p>- 다양한 산업분야 시스템 연계 통합</p>
                                                    <p>(물류, 제조, 항공, 해양, 건설 등)</p>
                                                    <p></p>
                                                    <p>- 기존 센서·CCTV 연계 및 안정화</p>
                                                    <p><span style={{ display: 'inline-block', marginLeft: '14px' }}></span></p>
                                                </div>
                                            </span>
                                            <span className={bIntro.digitalTextConts4}>
                                                <div className={bIntro.dTarget3}>데이터 시각화</div>
                                                <div className={bIntro.dSubFlex3}>
                                                    {/* <span className={bIntro.dCheckIcon3}></span> */}
                                                    <span className={bIntro.dSubTitle3}>
                                                        <p><span className={bIntro.businessTextBold3}>최신 ICT 기술 기반</span>의</p>
                                                        <p><span>데이터 시각화 및 모니터링을 제공합니다.</span></p>
                                                        <p><span className={bIntro.businessTextBold2}></span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont3}>
                                                    <p>- 시스템ㆍ센서 정보 수집 및 시각화</p>
                                                    <p style={{ marginLeft: '14px' }}></p>
                                                    <p>- 시스템ㆍ센서 정보 실시간 모니터링</p>
                                                    <p style={{ marginLeft: '14px' }}></p>
                                                    <p>- 3D 공간정보 기반 데이터 시각화 및 분석</p>
                                                    <p style={{ marginLeft: '14px' }}></p>
                                                </div>
                                            </span>
                                        </div>
                                        <div className={bIntro.majorCasesD}>
                                            <span className={bIntro.majorCircleD}></span>
                                            <span className={bIntro.majorTitleD}>주요 사례</span>
                                            <div className={bIntro.majorFlexBoxD}>
                                                <div className={bIntro.case3}>
                                                    <span className={bIntro.caseIcon3}></span>
                                                    <span className={bIntro.caseText3}>
                                                        <p>여의도 파크원</p>
                                                        <p>(2020)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case4}>
                                                    <span className={bIntro.caseIcon4}></span>
                                                    <span className={bIntro.caseText4}>
                                                        <p>GC녹십자</p>
                                                        <p>(2021)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case5}>
                                                    <span className={bIntro.caseIcon5}></span>
                                                    <span className={bIntro.caseText5}>
                                                        <p>솔브레인</p>
                                                        <p>(2021)</p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </span>
                            </div>
                        </div>
                        {/* 주요 실적 */}
                        <div id="sectionPerformance">
                            <div className={bIntro.majorPerformanceContentsS}>
                                <span className={bIntro.majorPerformanceTitleS} data-aos="fade-down" data-aos-duration="1000">주요 실적</span>
                                <span className={bIntro.majorPerformanceSelect}>
                                    {/* <div class="majorSelectBox">
                                    <button class="label5M">전체</button>
                                    <ul class="majorOptionList">
                                        <li class="majorOptionItem">전체</li>
                                        <li class="majorOptionItem">안전관리</li>
                                        <li class="majorOptionItem">디지털 트윈</li>
                                    </ul>
                                </div> */}
                                </span>
                                <div className={bIntro.majorListBox}>

                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>경기융합타운 대표도서관, 신용보증재단 재난관리시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2024년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>부산 신평/장림산단 디지털 트윈 기반 통합관제 시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>부산TP</span>
                                            <span className={bIntro.majorListYear}>2024년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>마곡 사이언스파크 재난관리시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2024년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>경기융합타운 종합방재실 재난관리시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2024년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>원익QNC 스마트재난시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2024년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>목포시 강소형 스마트시티 조성사업 수주</span>
                                            <span className={bIntro.majorListOrder}>전남정보문화산업진흥원</span>
                                            <span className={bIntro.majorListYear}>2023년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>여수 국가산업단지 환경모니터링 시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>여수시</span>
                                            <span className={bIntro.majorListYear}>2023년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>과기정통부 디지털 트윈 혁신선도 사업(제조실증) 수행</span>
                                            <span className={bIntro.majorListOrder}>NIPA</span>
                                            <span className={bIntro.majorListYear}>2023년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>강원랜드 중장기안전관리체계 컨설팅 수행</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2023년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>청량리 수자인 재난관리 시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2022년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>LG CNS Virtual Datacenter System</span>
                                            <span className={bIntro.majorListOrder}>LG CNS</span>
                                            <span className={bIntro.majorListYear}>2022년</span>
                                        </div>
                                    </div>

                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>솔브레인 공주공장 통합방재플랫폼 소프트웨어 구축</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2021년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>세종특별자치시 지하공동구 스마트관리시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>한국정보화진흥원</span>
                                            <span className={bIntro.majorListYear}>2020년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>NIPA 5G 디지털 트윈 공공선도 사업</span>
                                            <span className={bIntro.majorListOrder}>정보통신산업진흥원</span>
                                            <span className={bIntro.majorListYear}>2020년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>NIPA 5G 디지털 트윈 공공선도 사업 통합 재난 관제 시스템</span>
                                            <span className={bIntro.majorListOrder}>정보통신산업진흥원</span>
                                            <span className={bIntro.majorListYear}>2020년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>5G 디지털 트윈을 활용한 지자체 및 국방 다중이용 건축물 시설 안전대응 통합관리체계 구축</span>
                                            <span className={bIntro.majorListOrder}>정보통신산업진흥원</span>
                                            <span className={bIntro.majorListYear}>2020년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>디지털 트윈 기반 지하공동구 지능형 이상탐지 및 안전관리서비스</span>
                                            <span className={bIntro.majorListOrder}>한국정보화진흥원</span>
                                            <span className={bIntro.majorListYear}>2020년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>안전관리</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>신한은행 죽전데이터센터 재난관리 시스템</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2019년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>안전관리</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>충남대학교 e재난시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2019년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>안전관리</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>ICT기반 재난안전대비 현장훈련시스템 고도화 구축</span>
                                            <span className={bIntro.majorListOrder}>한국지역난방공사</span>
                                            <span className={bIntro.majorListYear}>2019년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>안전관리</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>여의도Parc.1 통합모니터링 중 통합재난S/W개발</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2019년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>공간정보 기반의 실감형 콘텐츠 융복합 및 혼합현실 제공기술 개발</span>
                                            <span className={bIntro.majorListOrder}>행정안전부</span>
                                            <span className={bIntro.majorListYear}>2018년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>세계 최고수준의 저비용∙고효율 실내공간정보 핵심기술 개발 및 실증</span>
                                            <span className={bIntro.majorListOrder}>국토교통부</span>
                                            <span className={bIntro.majorListYear}>2017년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>안전관리</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>3D 기반 도상훈련 시뮬레이터 개발</span>
                                            <span className={bIntro.majorListOrder}>산업통상자원부</span>
                                            <span className={bIntro.majorListYear}>2016년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>안전관리</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>에너지산업을 위한 재난안전 대비 현장훈련 시스템 개발</span>
                                            <span className={bIntro.majorListOrder}>산업통상자원부</span>
                                            <span className={bIntro.majorListYear}>2016년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>안전관리</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>실내환경서비스를 위한 IoT 실내 공기질 모니터링 및 플랫폼 기술 상용화</span>
                                            <span className={bIntro.majorListOrder}>산업통상자원부</span>
                                            <span className={bIntro.majorListYear}>2016년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>안전관리</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>국가 산업단지내의 재난대응을 위한 Safe-Guard 서비스 플랫폼 개발</span>
                                            <span className={bIntro.majorListOrder}>산업통상자원부</span>
                                            <span className={bIntro.majorListYear}>2014년</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 파트너사 */}
                        <div id="sectionPartner">
                            <div className={bIntro.partnerContents}>
                                <span className={bIntro.partnerTitle} data-aos="fade-down" data-aos-duration="1000">파트너사</span>
                                <div className={bIntro.clientArea}>
                                    <div className={bIntro.clientFirst}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo1}></span>
                                            <span className={bIntro.clientName}>국토교통부</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo2}></span>
                                            <span className={bIntro.clientName}>외교부</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo3}></span>
                                            <span className={bIntro.clientName}>해양수산부</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo4}></span>
                                            <span className={bIntro.clientName}>서울특별시</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo5}></span>
                                            <span className={bIntro.clientName}>인천광역시</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo6}></span>
                                            <span className={bIntro.clientName}>경상남도</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientSecond}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo7}></span>
                                            <span className={bIntro.clientName}>세종특별자치시</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo8}></span>
                                            <span className={bIntro.clientName}>제주시</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo9}></span>
                                            <span className={bIntro.clientName}>전력거래소</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo10}></span>
                                            <span className={bIntro.clientName}>한국남동발전</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo11}></span>
                                            <span className={bIntro.clientName}>한국지역난방공사</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo12}></span>
                                            <span className={bIntro.clientName}>울산창만공사</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientThird}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo13}></span>
                                            <span className={bIntro.clientName}>솔브레인</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo14}></span>
                                            <span className={bIntro.clientName}>녹십자</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo15}></span>
                                            <span className={bIntro.clientName}>순천의료원</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo16}></span>
                                            <span className={bIntro.clientName}>파크원</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo17}></span>
                                            <span className={bIntro.clientName}>예울마루</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo18}></span>
                                            <span className={bIntro.clientName}>안양체육관</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientFourth}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo19}></span>
                                            <span className={bIntro.clientName}>서울대학교</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo20}></span>
                                            <span className={bIntro.clientName}>부산대학교</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo21}></span>
                                            <span className={bIntro.clientName}>충남대학교</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo22}></span>
                                            <span className={bIntro.clientName}>신한은행</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo23}></span>
                                            <span className={bIntro.clientName}>광명 유플래닛</span>
                                        </span>
                                        <span className={bIntro.clientContentsB}>
                                            <span></span>
                                            <span></span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 보도자료 */}
                        <div id="sectionNews">
                            <span className={bIntro.newsTitle} data-aos="fade-down" data-aos-duration="1000">보도자료</span>
                            <div className={bIntro.reportArea}>
                                {/* <div className={bIntro.postingTopArea}>
                                <span className={bIntro.postingCount}>총 <p>10건</p>의 게시물</span>
                            </div> */}
                            </div>
                            <div className={bIntro.postingBottomArea}>
                                <span className={bIntro.postingBoxArea}>
                                    {newsUI}
                                </span>
                            </div>
                            {
                                (this.state.newsDatas && this.state.newsDatas.length > 0) ?
                                    <div className={bIntro.pagination}>
                                        <a><span className={bIntro.arrowLeft} onClick={() => this.setPageIndex(1)}></span></a>
                                        <ul key={""}>
                                            {pageIndexUI}
                                        </ul>
                                        <a><span className={bIntro.arrowRight} onClick={() => this.setPageIndex(this.state.maxPageIndex)}></span></a>
                                    </div>
                                    : <></>
                            }
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
                    </div>
                </>
            );
        } else if (960 <= widthSize && widthSize <= 1280) { //가로 태블릿
            displayBusinessUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={bIntro.eIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">사업분야</span>
                            <span data-aos="fade-down" data-aos-duration="1000">유엔이의 사업 분야 및 주요 실적, 파트너사를 소개합니다.</span>
                        </div>
                        {/* 안전관리 */}
                        <div id="sectionSafety">
                            <div className={bIntro.safetyInforContentsSect2}>
                                <span className={bIntro.safetyTextBox}>
                                    <span className={bIntro.safetyManageTitle} data-aos="fade-down" data-aos-duration="1000">안전관리 솔루션·컨설팅 사업</span>
                                    <div className={bIntro.safetyManageContents}>
                                        <div className={bIntro.safetyMText1}>
                                            {/* <span className={bIntro.safetyTextConts}>
                                                <span className={bIntro.safetyTexts1}>화재, 가스누출, 침수, 지진 등<span className={bIntro.businessTextBold}>지속적으로 발생하는 사고/ 재난 대응의 핵심은 신속과 효율</span>에 있습니다.<span className={bIntro.businessTextBold}></span></span>
                                                <span className={bIntro.safetyTexts2}><p style={{ marginRight: '8px', display: 'inline-block' }}>이를 위해</p><span className={bIntro.businessTextBlack}>각종 센서와 CCTV 정보를 실시간으로 연계·수집·분석</span><span className={bIntro.businessTextBlack}><p style={{ margin: '0px', display: 'inline-block' }}></p></span>하고,</span>
                                                <span className={bIntro.safetyTexts3}><span className={bIntro.businessTextBlack}>실내외 공간정보와 결합하여 현황을 시각화</span><p style={{ marginRight: '8px', display: 'inline-block' }}>하며, </p><span className={bIntro.businessTextBlack}></span></span>
                                                <span className={bIntro.safetyTexts4}><span className={bIntro.businessTextBlack}>재난유형별 SOP(표준행동절차)</span><p style={{ marginRight: '8px', display: 'inline-block' }}>를 통해</p><span className={bIntro.businessTextBlack}>행동요령을 공유하고 상황을 전파</span>하는 것이 중요합니다.<span className={bIntro.businessTextBlack}></span></span>
                                                <span className={bIntro.safetyTexts6}><span className={bIntro.businessTextBold}></span><p style={{ marginLeft: '8px', display: 'inline-block' }}>유엔이는 실내외 공간에 대한 이해와 축적된 재난안전 기술 및 사업 역량을 바탕으로</p></span>
                                                <span className={bIntro.safetyTexts7}><span className={bIntro.businessTextBold}></span><span className={bIntro.businessTextBold}>컨설팅과 솔루션 모두를 포괄하는 지속가능한 안전관리 서비스를 제공</span><span>합니다.</span></span>
                                            </span> */}

                                            <span className={bIntro.safetyTextConts}>
                                                <span className={bIntro.safetyTexts1}>
                                                    화재, 가스누출, 침수, 지진 등
                                                </span>
                                                <span className={bIntro.safetyTexts2}>
                                                    <span className={bIntro.businessTextBold}>지속적으로 발생하는 사고/ 재난 대응의 핵심은 신속과 효율</span>에 있습니다.
                                                </span>
                                                <span className={bIntro.safetyTexts3}>
                                                    이를 위해<span className={bIntro.businessTextBlack}>각종 센서와 CCTV 정보를 실시간으로 연계·수집·분석</span>하고,
                                                </span>
                                                <span className={bIntro.safetyTexts4}>
                                                    <span className={bIntro.businessTextBlack}>실내외 공간정보와 결합하여 현황을 시각화</span>하며,
                                                </span>
                                                <span className={bIntro.safetyTexts5}>
                                                    <span className={bIntro.businessTextBlack}>재난유형별 SOP(표준행동절차)</span>를 통해
                                                </span>
                                                <span className={bIntro.safetyTexts6}>
                                                    <span className={bIntro.businessTextBlack}>행동요령을 공유하고 상황을 전파</span>하는 것이 중요합니다.
                                                </span>
                                                <span className={bIntro.safetyTexts7}>
                                                    유엔이는 실내외 공간에 대한 이해와
                                                </span>
                                                <span className={bIntro.safetyTexts8}>
                                                    축적된 재난안전 기술 및 사업 역량을 바탕으로
                                                </span>
                                                <span className={bIntro.safetyTexts9}>
                                                    <span className={bIntro.businessTextBold}>컨설팅과 솔루션 모두를 포괄하는 지속가능한 안전관리 서비스를 제공</span>합니다.
                                                </span>
                                            </span>
                                        </div>

                                        <div className={bIntro.safetyMText2}>
                                            <span className={bIntro.safetyTextConts2}>
                                                <div className={bIntro.sTarget1}>안전관리 컨설팅</div>
                                                <div className={bIntro.sSubFlex1}>
                                                    {/* <span className={bIntro.sCheckIcon}></span> */}
                                                    <span className={bIntro.sSubTitle1}>
                                                        <p className={bIntro.sSubText1}><span className={bIntro.businessTextBold2}>재난 상황에 실질적인 도움</span>이 되는</p>
                                                        <p className={bIntro.sSubText1}><span>안전관리 컨설팅 서비스를 제공합니다.</span><span className={bIntro.businessTextBold2} style={{ marginLeft: '8px' }}></span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.sSubCont1}>
                                                    <p>- 재난상황별 위기대응 매뉴얼 개발</p>
                                                    <p>- 위험성 평가</p>
                                                    <p>- 안전 관련 정책 및 로드맵 수립</p>
                                                    <p>- 훈련 시나리오 개발</p>
                                                    <p>- 민방위 정책 기획</p>
                                                    <p>- 중대재해처벌법 관련 대책 컨설팅</p>
                                                </div>
                                            </span>
                                            <span className={bIntro.safetyTextConts3}>
                                                <div className={bIntro.sTarget2}>스마트 솔루션</div>
                                                <div className={bIntro.sSubFlex2}>
                                                    {/* <span className={bIntro.sCheckIcon2}></span> */}
                                                    <span className={bIntro.sSubTitle2}>
                                                        <p><span className={bIntro.businessTextBold2}>다양한 유형의 재난 발생에 대응 가능한</span></p>
                                                        <p>스마트 안전관리 솔루션을 제공합니다.<span className={bIntro.businessTextBold2} style={{ marginLeft: '8px' }}></span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.sSubCont2}>
                                                    <p>- 스마트재난대응시스템</p>
                                                    <p>- 스마트재난탐지시스템</p>
                                                    <p>- 스마트환경모니터링시스템</p>
                                                    <p>- 스마트유해물질관리시스템</p>
                                                    <p>- 스마트시설물관리시스템</p>
                                                    <p>- 스마트작업자안전관리시스템</p>
                                                    <p></p>
                                                    <p></p>
                                                </div>
                                            </span>
                                        </div>
                                        <div className={bIntro.majorCases}>
                                            <span className={bIntro.majorCircle}></span>
                                            <span className={bIntro.majorTitle}>주요 사례</span>
                                            <div className={bIntro.majorFlexPic}>
                                                <div className={bIntro.case1}>
                                                    <span className={bIntro.caseIcon1}></span>
                                                    <span className={bIntro.caseText1}>
                                                        <p>한국남동발전</p>
                                                        <p>(2015)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case2}>
                                                    <span className={bIntro.caseIcon2}></span>
                                                    <span className={bIntro.caseText2}>
                                                        <p>경상남도</p>
                                                        <p>(2020)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case3}>
                                                    <span className={bIntro.caseIcon2}></span>
                                                    <span className={bIntro.caseText3}>
                                                        <p>광명 어반브릭스</p>
                                                        <p>(2021)</p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </span>
                            </div>
                        </div>
                        {/* 디지털 트윈 */}
                        <div id="sectionDigital">
                            <div className={bIntro.digitalInforContentsSect2}>
                                <span className={bIntro.digitalTextBox}>
                                    <span className={bIntro.digitalManageTitle} data-aos="fade-down" data-aos-duration="1000">디지털 트윈 응용 솔루션 사업</span>
                                    <div className={bIntro.digitalManageContents}>
                                        <div className={bIntro.digitalMText1}>
                                            {/* <span className={bIntro.digitalTextConts}>
                                                <span className={bIntro.digitalTexts1}>디지털 트윈은 건물, 시설물, 센서장비, 업무 프로세스 등의<span className={bIntro.businessTextBold}>현실에 존재하는 인프라를 가상 공간에 동일하게 구현한 개념 기술</span>입니다.</span>
                                                <span className={bIntro.digitalTexts2}><p style={{ marginRight: '8px', display: 'inline-block' }}>가상 공간의 객체와 시스템, 데이터들은</p><span className={bIntro.businessTextBlack}>현실 공간과 실시간 연결</span>되어 모니터링, 제어, 시뮬레이션이 가능하며,</span>
                                                <span className={bIntro.digitalTexts3}><p style={{ marginRight: '8px', display: 'inline-block' }}>이를 통해 실제 시설물의 변경 없이도</p><span className={bIntro.businessTextBlack}>현실에서 보다 나은 의사결정과 운영관리를 지원</span><p style={{ display: 'inline-block' }}>합니다.</p></span>
                                                <span className={bIntro.digitalTexts4}>유엔이는 실내외 공간 통합 구축기술, 레거시 시스템 및 IoT 연계·통합, 빅데이터/AI 기반 실시간 모니터링 및 시뮬레이션 기술을 통해<span className={bIntro.businessTextBlack}></span></span>
                                                <span className={bIntro.digitalTexts5}><span style={{ marginLeft: '8px', display: 'inline-block' }}></span></span>
                                                <span className={bIntro.digitalTexts6}><span className={bIntro.businessTextBold}>다양한 산업분야에서 고객의 요구를 만족시키는 디지털 트윈 기반 응용 솔루션을 제공</span>합니다</span>
                                                <span className={bIntro.digitalTexts7}><span></span></span>
                                                <span className={bIntro.digitalTexts8}></span>
                                            </span> */}

                                            <span className={bIntro.digitalTextConts}>
                                                <span className={bIntro.digitalTexts1}>
                                                    디지털 트윈은 건물, 시설물, 센서장비, 업무 프로세스 등의
                                                </span>
                                                <span className={bIntro.digitalTexts2}>
                                                    <span className={bIntro.businessTextBold}>현실에 존재하는 인프라를 가상 공간에 동일하게 구현한 개념 기술</span>입니다.
                                                </span>
                                                <span className={bIntro.digitalTexts3}>
                                                    가상 공간의 객체와 시스템, 데이터들은<span className={bIntro.businessTextBlack}>현실 공간과 실시간 연결</span>되어
                                                </span>
                                                <span className={bIntro.digitalTexts4}>
                                                    모니터링, 제어, 시뮬레이션이 가능하며,
                                                </span>
                                                <span className={bIntro.digitalTexts5}>
                                                    이를 통해 실제 시설물의 변경 없이도
                                                </span>
                                                <span className={bIntro.digitalTexts6}>
                                                    <span className={bIntro.businessTextBlack}>현실에서 보다 나은 의사결정과 운영관리를 지원</span>합니다.
                                                </span>
                                                <span className={bIntro.digitalTexts7}>
                                                    유엔이는 실내외 공간 통합 구축기술, 레거시 시스템 및 IoT 연계·통합,
                                                </span>
                                                <span className={bIntro.digitalTexts8}>
                                                    빅데이터/AI 기반 실시간 모니터링 및 시뮬레이션 기술을 통해
                                                </span>
                                                <span className={bIntro.digitalTexts9}>
                                                    <span className={bIntro.businessTextBold}>다양한 산업분야에서 고객의 요구를 만족시키는</span>
                                                </span>
                                                <span className={bIntro.digitalTexts10}>
                                                    <span className={bIntro.businessTextBold}>디지털 트윈 기반 응용 솔루션을 제공</span>합니다.
                                                </span>
                                            </span>
                                        </div>

                                        <div className={bIntro.digitalMText2}>
                                            <span className={bIntro.digitalTextConts2}>
                                                <div className={bIntro.dTarget1}>공간정보 구축</div>
                                                <div className={bIntro.dSubFlex1}>
                                                    {/* <span className={bIntro.dCheckIcon}></span> */}
                                                    <span className={bIntro.dSubTitle1}>
                                                        <p><span className={bIntro.businessTextBold3}>경량의 고품질</span><span></span><span className={bIntro.businessTextBold3}></span></p>
                                                        <p><span className={bIntro.businessTextBold3}></span></p>
                                                        <p><span>실내외 공간정보를 구축합니다.</span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont1}>
                                                    <p>- 사람이 체류하는 공간 정보화</p>
                                                    <p>(건축물, 시설물, 선박, 항공기 등)</p>
                                                    <p /* style={{ marginLeft: '14px' }}*/ ><span /* style={{ paddingLeft: '14px' }}*/ >- LoD 4 이상의 고품질 실외 공간 모델링</span></p>
                                                    <p>- 기존 BIM 대비 1/10 수준 경량화</p>
                                                    <p style={{ marginLeft: '14px' }}></p>
                                                    <p></p>

                                                </div>
                                            </span>
                                            <span className={bIntro.digitalTextConts3}>
                                                <div className={bIntro.dTarget2}>시스템 연계통합</div>
                                                <div className={bIntro.dSubFlex2}>
                                                    {/* <span className={bIntro.dCheckIcon2}></span> */}
                                                    <span className={bIntro.dSubTitle2}>
                                                        <p></p>
                                                        <p><span className={bIntro.businessTextBold3}>레거시 시스템 및 IoT 센서</span>의</p>
                                                        <p><span style={{ display: 'inline-block', marginRight: '8px' }}>연계ㆍ통합을 제공합니다.</span><span className={bIntro.businessTextBold2}></span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont2}>
                                                    <p>- 다양한 산업분야 시스템 연계 통합</p>
                                                    <p>(물류, 제조, 항공, 해양, 건설 등)</p>
                                                    <p></p>
                                                    <p>- 기존 센서·CCTV 연계 및 안정화</p>
                                                    <p><span style={{ display: 'inline-block', marginLeft: '14px' }}></span></p>
                                                </div>
                                            </span>
                                            <span className={bIntro.digitalTextConts4}>
                                                <div className={bIntro.dTarget3}>데이터 시각화</div>
                                                <div className={bIntro.dSubFlex3}>
                                                    {/* <span className={bIntro.dCheckIcon3}></span> */}
                                                    <span className={bIntro.dSubTitle3}>
                                                        <p><span className={bIntro.businessTextBold3}>최신 ICT 기술 기반</span>의</p>
                                                        <p><span>데이터 시각화 및 모니터링을 제공합니다.</span></p>
                                                        <p><span className={bIntro.businessTextBold2}></span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont3}>
                                                    <p>- 시스템ㆍ센서 정보 수집 및 시각화</p>
                                                    <p style={{ marginLeft: '14px' }}></p>
                                                    <p>- 시스템ㆍ센서 정보 실시간 모니터링</p>
                                                    <p style={{ marginLeft: '14px' }}></p>
                                                    <p>- 3D 공간정보 기반 데이터 시각화 및 분석</p>
                                                    <p style={{ marginLeft: '14px' }}></p>
                                                </div>
                                            </span>
                                        </div>
                                        <div className={bIntro.majorCasesD}>
                                            <span className={bIntro.majorCircleD}></span>
                                            <span className={bIntro.majorTitleD}>주요 사례</span>
                                            <div className={bIntro.majorFlexBoxD}>
                                                <div className={bIntro.case3}>
                                                    <span className={bIntro.caseIcon3}></span>
                                                    <span className={bIntro.caseText3}>
                                                        <p>여의도 파크원</p>
                                                        <p>(2020)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case4}>
                                                    <span className={bIntro.caseIcon4}></span>
                                                    <span className={bIntro.caseText4}>
                                                        <p>GC녹십자</p>
                                                        <p>(2021)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case5}>
                                                    <span className={bIntro.caseIcon5}></span>
                                                    <span className={bIntro.caseText5}>
                                                        <p>솔브레인</p>
                                                        <p>(2021)</p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </span>
                            </div>
                        </div>
                        {/* 주요 실적 */}
                        <div id="sectionPerformance">
                            <div className={bIntro.majorPerformanceContentsS}>
                                <span className={bIntro.majorPerformanceTitleS} data-aos="fade-down" data-aos-duration="1000">주요 실적</span>
                                <span className={bIntro.majorPerformanceSelect}>
                                    {/* <div class="majorSelectBox">
                                    <button class="label5M">전체</button>
                                    <ul class="majorOptionList">
                                        <li class="majorOptionItem">전체</li>
                                        <li class="majorOptionItem">안전관리</li>
                                        <li class="majorOptionItem">디지털 트윈</li>
                                    </ul>
                                </div> */}
                                </span>
                                <div className={bIntro.majorListBox}>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>경기융합타운 대표도서관, 신용보증재단 재난관리시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2024년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>부산 신평/장림산단 디지털 트윈 기반 통합관제 시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>부산TP</span>
                                            <span className={bIntro.majorListYear}>2024년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>마곡 사이언스파크 재난관리시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2024년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>경기융합타운 종합방재실 재난관리시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2024년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>원익QNC 스마트재난시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2024년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>목포시 강소형 스마트시티 조성사업 수주</span>
                                            <span className={bIntro.majorListOrder}>전남정보문화산업진흥원</span>
                                            <span className={bIntro.majorListYear}>2023년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>여수 국가산업단지 환경모니터링 시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>여수시</span>
                                            <span className={bIntro.majorListYear}>2023년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>과기정통부 디지털 트윈 혁신선도 사업(제조실증) 수행</span>
                                            <span className={bIntro.majorListOrder}>NIPA</span>
                                            <span className={bIntro.majorListYear}>2023년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>강원랜드 중장기안전관리체계 컨설팅 수행</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2023년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>청량리 수자인 재난관리 시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2022년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>LG CNS Virtual Datacenter System</span>
                                            <span className={bIntro.majorListOrder}>LG CNS</span>
                                            <span className={bIntro.majorListYear}>2022년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>솔브레인 공주공장 통합방재플랫폼 소프트웨어 구축</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2021년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>세종특별자치시 지하공동구 스마트관리시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>한국정보화진흥원</span>
                                            <span className={bIntro.majorListYear}>2020년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>NIPA 5G 디지털 트윈 공공선도 사업</span>
                                            <span className={bIntro.majorListOrder}>정보통신산업진흥원</span>
                                            <span className={bIntro.majorListYear}>2020년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>NIPA 5G 디지털 트윈 공공선도 사업 통합 재난 관제 시스템</span>
                                            <span className={bIntro.majorListOrder}>정보통신산업진흥원</span>
                                            <span className={bIntro.majorListYear}>2020년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>5G 디지털 트윈을 활용한 지자체 및 국방 다중이용 건축물 시설 안전대응 통합관리체계 구축</span>
                                            <span className={bIntro.majorListOrder}>정보통신산업진흥원</span>
                                            <span className={bIntro.majorListYear}>2020년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>디지털 트윈 기반 지하공동구 지능형 이상탐지 및 안전관리서비스</span>
                                            <span className={bIntro.majorListOrder}>한국정보화진흥원</span>
                                            <span className={bIntro.majorListYear}>2020년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>안전관리</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>신한은행 죽전데이터센터 재난관리 시스템</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2019년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>안전관리</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>충남대학교 e재난시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2019년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>안전관리</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>ICT기반 재난안전대비 현장훈련시스템 고도화 구축</span>
                                            <span className={bIntro.majorListOrder}>한국지역난방공사</span>
                                            <span className={bIntro.majorListYear}>2019년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>안전관리</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>여의도Parc.1 통합모니터링 중 통합재난S/W개발</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2019년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>공간정보 기반의 실감형 콘텐츠 융복합 및 혼합현실 제공기술 개발</span>
                                            <span className={bIntro.majorListOrder}>행정안전부</span>
                                            <span className={bIntro.majorListYear}>2018년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>세계 최고수준의 저비용∙고효율 실내공간정보 핵심기술 개발 및 실증</span>
                                            <span className={bIntro.majorListOrder}>국토교통부</span>
                                            <span className={bIntro.majorListYear}>2017년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>안전관리</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>3D 기반 도상훈련 시뮬레이터 개발</span>
                                            <span className={bIntro.majorListOrder}>산업통상자원부</span>
                                            <span className={bIntro.majorListYear}>2016년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>안전관리</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>에너지산업을 위한 재난안전 대비 현장훈련 시스템 개발</span>
                                            <span className={bIntro.majorListOrder}>산업통상자원부</span>
                                            <span className={bIntro.majorListYear}>2016년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>안전관리</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>실내환경서비스를 위한 IoT 실내 공기질 모니터링 및 플랫폼 기술 상용화</span>
                                            <span className={bIntro.majorListOrder}>산업통상자원부</span>
                                            <span className={bIntro.majorListYear}>2016년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>안전관리</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>국가 산업단지내의 재난대응을 위한 Safe-Guard 서비스 플랫폼 개발</span>
                                            <span className={bIntro.majorListOrder}>산업통상자원부</span>
                                            <span className={bIntro.majorListYear}>2014년</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 파트너사 */}
                        <div id="sectionPartner">
                            <div className={bIntro.partnerContents}>
                                <span className={bIntro.partnerTitle} data-aos="fade-down" data-aos-duration="1000">파트너사</span>
                                <div className={bIntro.clientArea}>
                                    <div className={bIntro.clientFirst}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo1}></span>
                                            <span className={bIntro.clientName}>국토교통부</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo2}></span>
                                            <span className={bIntro.clientName}>외교부</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo3}></span>
                                            <span className={bIntro.clientName}>해양수산부</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo4}></span>
                                            <span className={bIntro.clientName}>서울특별시</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo5}></span>
                                            <span className={bIntro.clientName}>인천광역시</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo6}></span>
                                            <span className={bIntro.clientName}>경상남도</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientSecond}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo7}></span>
                                            <span className={bIntro.clientName}>세종특별자치시</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo8}></span>
                                            <span className={bIntro.clientName}>제주시</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo9}></span>
                                            <span className={bIntro.clientName}>전력거래소</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo10}></span>
                                            <span className={bIntro.clientName}>한국남동발전</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo11}></span>
                                            <span className={bIntro.clientName}>한국지역난방공사</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo12}></span>
                                            <span className={bIntro.clientName}>울산창만공사</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientThird}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo13}></span>
                                            <span className={bIntro.clientName}>솔브레인</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo14}></span>
                                            <span className={bIntro.clientName}>녹십자</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo15}></span>
                                            <span className={bIntro.clientName}>순천의료원</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo16}></span>
                                            <span className={bIntro.clientName}>파크원</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo17}></span>
                                            <span className={bIntro.clientName}>예울마루</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo18}></span>
                                            <span className={bIntro.clientName}>안양체육관</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientFourth}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo19}></span>
                                            <span className={bIntro.clientName}>서울대학교</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo20}></span>
                                            <span className={bIntro.clientName}>부산대학교</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo21}></span>
                                            <span className={bIntro.clientName}>충남대학교</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo22}></span>
                                            <span className={bIntro.clientName}>신한은행</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo23}></span>
                                            <span className={bIntro.clientName}>광명 유플래닛</span>
                                        </span>
                                        <span className={bIntro.clientContentsB}>
                                            <span></span>
                                            <span></span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 보도자료 */}
                        <div id="sectionNews">
                            <span className={bIntro.newsTitle} data-aos="fade-down" data-aos-duration="1000">보도자료</span>
                            <div className={bIntro.reportArea}>
                                {/* <div className={bIntro.postingTopArea}>
                                <span className={bIntro.postingCount}>총 <p>10건</p>의 게시물</span>
                            </div> */}
                            </div>
                            <div className={bIntro.postingBottomArea}>
                                <span className={bIntro.postingBoxArea}>
                                    {newsUI}
                                </span>
                            </div>
                            {
                                (this.state.newsDatas && this.state.newsDatas.length > 0) ?
                                    <div className={bIntro.pagination}>
                                        <a><span className={bIntro.arrowLeft} onClick={() => this.setPageIndex(1)}></span></a>
                                        <ul key={""}>
                                            {pageIndexUI}
                                        </ul>
                                        <a><span className={bIntro.arrowRight} onClick={() => this.setPageIndex(this.state.maxPageIndex)}></span></a>
                                    </div>
                                    : <></>
                            }
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
                    </div>
                </>
            );
        } else if (widthSize >= 1024) {
            displayBusinessUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={bIntro.eIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">사업분야</span>
                            <span data-aos="fade-down" data-aos-duration="1000">유엔이의 사업 분야 및 주요 실적, 파트너사를 소개합니다.</span>
                        </div>
                        {/* 안전관리 */}
                        <div id="sectionSafety">
                            <div className={bIntro.safetyInforContentsSect2}>
                                <span className={bIntro.safetyTextBox}>
                                    <span className={bIntro.safetyManageTitle} data-aos="fade-down" data-aos-duration="1000">안전관리 솔루션·컨설팅 사업</span>
                                    <div className={bIntro.safetyManageContents}>
                                        <div className={bIntro.safetyMText1}>
                                            <span className={bIntro.safetyTextConts}>
                                                <span className={bIntro.safetyTexts1}>화재, 가스누출, 침수, 지진 등<span className={bIntro.businessTextBold}>지속적으로 발생하는 사고/ 재난 대응의 핵심은 신속과 효율</span>에 있습니다.<span className={bIntro.businessTextBold}></span></span>
                                                <span className={bIntro.safetyTexts2}><p style={{ marginRight: '8px', display: 'inline-block' }}>이를 위해</p><span className={bIntro.businessTextBlack}>각종 센서와 CCTV 정보를 실시간으로 연계·수집·분석</span><span className={bIntro.businessTextBlack}><p style={{ margin: '0px', display: 'inline-block' }}></p></span>하고,</span>
                                                <span className={bIntro.safetyTexts3}><span className={bIntro.businessTextBlack}>실내외 공간정보와 결합하여 현황을 시각화</span><p style={{ marginRight: '8px', display: 'inline-block' }}>하며, </p><span className={bIntro.businessTextBlack}></span></span>
                                                <span className={bIntro.safetyTexts4}><span className={bIntro.businessTextBlack}>재난유형별 SOP(표준행동절차)</span><p style={{ marginRight: '8px', display: 'inline-block' }}>를 통해</p><span className={bIntro.businessTextBlack}>행동요령을 공유하고 상황을 전파</span>하는 것이 중요합니다.<span className={bIntro.businessTextBlack}></span></span>
                                                <span className={bIntro.safetyTexts6}><span className={bIntro.businessTextBold}></span><p style={{ marginLeft: '8px', display: 'inline-block' }}>유엔이는 실내외 공간에 대한 이해와 축적된 재난안전 기술 및 사업 역량을 바탕으로</p></span>
                                                <span className={bIntro.safetyTexts7}><span className={bIntro.businessTextBold}></span><span className={bIntro.businessTextBold}>컨설팅과 솔루션 모두를 포괄하는 지속가능한 안전관리 서비스를 제공</span><span>합니다.</span></span>
                                            </span>
                                        </div>

                                        <div className={bIntro.safetyMText2}>
                                            <span className={bIntro.safetyTextConts2}>
                                                <div className={bIntro.sTarget1}>안전관리 컨설팅</div>
                                                <div className={bIntro.sSubFlex1}>
                                                    {/* <span className={bIntro.sCheckIcon}></span> */}
                                                    <span className={bIntro.sSubTitle1}>
                                                        <p className={bIntro.sSubText1}><span className={bIntro.businessTextBold2}>재난 상황에 실질적인 도움</span>이 되는</p>
                                                        <p className={bIntro.sSubText1}><span>안전관리 컨설팅 서비스를 제공합니다.</span><span className={bIntro.businessTextBold2} style={{ marginLeft: '8px' }}></span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.sSubCont1}>
                                                    <p>- 재난상황별 위기대응 매뉴얼 개발</p>
                                                    <p>- 위험성 평가</p>
                                                    <p>- 안전 관련 정책 및 로드맵 수립</p>
                                                    <p>- 훈련 시나리오 개발</p>
                                                    <p>- 민방위 정책 기획</p>
                                                    <p>- 중대재해처벌법 관련 대책 컨설팅</p>
                                                </div>
                                            </span>
                                            <span className={bIntro.safetyTextConts3}>
                                                <div className={bIntro.sTarget2}>스마트 솔루션</div>
                                                <div className={bIntro.sSubFlex2}>
                                                    {/* <span className={bIntro.sCheckIcon2}></span> */}
                                                    <span className={bIntro.sSubTitle2}>
                                                        <p><span className={bIntro.businessTextBold2}>다양한 유형의 재난 발생에 대응 가능한</span></p>
                                                        <p>스마트 안전관리 솔루션을 제공합니다.<span className={bIntro.businessTextBold2} style={{ marginLeft: '8px' }}></span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.sSubCont2}>
                                                    <p>- 스마트재난대응시스템</p>
                                                    <p>- 스마트재난탐지시스템</p>
                                                    <p>- 스마트환경모니터링시스템</p>
                                                    <p>- 스마트유해물질관리시스템</p>
                                                    <p>- 스마트시설물관리시스템</p>
                                                    <p>- 스마트작업자안전관리시스템</p>
                                                    <p></p>
                                                    <p></p>
                                                </div>
                                            </span>
                                        </div>
                                        <div className={bIntro.majorCases}>
                                            <span className={bIntro.majorCircle}></span>
                                            <span className={bIntro.majorTitle}>주요 사례</span>
                                            <div className={bIntro.majorFlexPic}>
                                                <div className={bIntro.case1}>
                                                    <span className={bIntro.caseIcon1}></span>
                                                    <span className={bIntro.caseText1}>
                                                        <p>한국남동발전</p>
                                                        <p>(2015)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case2}>
                                                    <span className={bIntro.caseIcon2}></span>
                                                    <span className={bIntro.caseText2}>
                                                        <p>경상남도</p>
                                                        <p>(2020)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case3}>
                                                    <span className={bIntro.caseIcon2}></span>
                                                    <span className={bIntro.caseText3}>
                                                        <p>광명 어반브릭스</p>
                                                        <p>(2021)</p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </span>
                            </div>
                        </div>
                        {/* 디지털 트윈 */}
                        <div id="sectionDigital">
                            <div className={bIntro.digitalInforContentsSect2}>
                                <span className={bIntro.digitalTextBox}>
                                    <span className={bIntro.digitalManageTitle} data-aos="fade-down" data-aos-duration="1000">디지털 트윈 응용 솔루션 사업</span>
                                    <div className={bIntro.digitalManageContents}>
                                        <div className={bIntro.digitalMText1}>
                                            <span className={bIntro.digitalTextConts}>
                                                <span className={bIntro.digitalTexts1}>디지털 트윈은 건물, 시설물, 센서장비, 업무 프로세스 등의<span className={bIntro.businessTextBold}>현실에 존재하는 인프라를 가상 공간에 동일하게 구현한 개념 기술</span>입니다.</span>
                                                <span className={bIntro.digitalTexts2}><p style={{ marginRight: '8px', display: 'inline-block' }}>가상 공간의 객체와 시스템, 데이터들은</p><span className={bIntro.businessTextBlack}>현실 공간과 실시간 연결</span>되어 모니터링, 제어, 시뮬레이션이 가능하며,</span>
                                                <span className={bIntro.digitalTexts3}><p style={{ marginRight: '8px', display: 'inline-block' }}>이를 통해 실제 시설물의 변경 없이도</p><span className={bIntro.businessTextBlack}>현실에서 보다 나은 의사결정과 운영관리를 지원</span><p style={{ display: 'inline-block' }}>합니다.</p></span>
                                                <span className={bIntro.digitalTexts4}>유엔이는 실내외 공간 통합 구축기술, 레거시 시스템 및 IoT 연계·통합, 빅데이터/AI 기반 실시간 모니터링 및 시뮬레이션 기술을 통해<span className={bIntro.businessTextBlack}></span></span>
                                                {/* <span className={bIntro.digitalTexts5}><span style={{ marginLeft: '8px', display: 'inline-block' }}></span></span> */}
                                                <span className={bIntro.digitalTexts6}><span className={bIntro.businessTextBold}>다양한 산업분야에서 고객의 요구를 만족시키는 디지털 트윈 기반 응용 솔루션을 제공</span>합니다</span>
                                                <span className={bIntro.digitalTexts7}><span></span></span>
                                                <span className={bIntro.digitalTexts8}></span>
                                            </span>
                                        </div>

                                        <div className={bIntro.digitalMText2}>
                                            <span className={bIntro.digitalTextConts2}>
                                                <div className={bIntro.dTarget1}>공간정보 구축</div>
                                                <div className={bIntro.dSubFlex1}>
                                                    {/* <span className={bIntro.dCheckIcon}></span> */}
                                                    <span className={bIntro.dSubTitle1}>
                                                        <p><span className={bIntro.businessTextBold3}>경량의 고품질</span><span></span><span className={bIntro.businessTextBold3}></span></p>
                                                        <p><span className={bIntro.businessTextBold3}></span></p>
                                                        <p><span>실내외 공간정보를 구축합니다.</span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont1}>
                                                    <p>- 사람이 체류하는 공간 정보화</p>
                                                    <p>(건축물, 시설물, 선박, 항공기 등)</p>
                                                    <p /* style={{ marginLeft: '14px' }}*/ ><span /* style={{ paddingLeft: '14px' }}*/ >- LoD 4 이상의 고품질 실외 공간 모델링</span></p>
                                                    <p>- 기존 BIM 대비 1/10 수준 경량화</p>
                                                    <p style={{ marginLeft: '14px' }}></p>
                                                    <p></p>

                                                </div>
                                            </span>
                                            <span className={bIntro.digitalTextConts3}>
                                                <div className={bIntro.dTarget2}>시스템 연계통합</div>
                                                <div className={bIntro.dSubFlex2}>
                                                    {/* <span className={bIntro.dCheckIcon2}></span> */}
                                                    <span className={bIntro.dSubTitle2}>
                                                        <p></p>
                                                        <p><span className={bIntro.businessTextBold3}>레거시 시스템 및 IoT 센서</span>의</p>
                                                        <p><span style={{ display: 'inline-block', marginRight: '8px' }}>연계ㆍ통합을 제공합니다.</span><span className={bIntro.businessTextBold2}></span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont2}>
                                                    <p>- 다양한 산업분야 시스템 연계 통합</p>
                                                    <p>(물류, 제조, 항공, 해양, 건설 등)</p>
                                                    <p></p>
                                                    <p>- 기존 센서·CCTV 연계 및 안정화</p>
                                                    <p><span style={{ display: 'inline-block', marginLeft: '14px' }}></span></p>
                                                </div>
                                            </span>
                                            <span className={bIntro.digitalTextConts4}>
                                                <div className={bIntro.dTarget3}>데이터 시각화</div>
                                                <div className={bIntro.dSubFlex3}>
                                                    {/* <span className={bIntro.dCheckIcon3}></span> */}
                                                    <span className={bIntro.dSubTitle3}>
                                                        <p><span className={bIntro.businessTextBold3}>최신 ICT 기술 기반</span>의</p>
                                                        <p><span>데이터 시각화 및 모니터링을 제공합니다.</span></p>
                                                        <p><span className={bIntro.businessTextBold2}></span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont3}>
                                                    <p>- 시스템ㆍ센서 정보 수집 및 시각화</p>
                                                    <p style={{ marginLeft: '14px' }}></p>
                                                    <p>- 시스템ㆍ센서 정보 실시간 모니터링</p>
                                                    <p style={{ marginLeft: '14px' }}></p>
                                                    <p>- 3D 공간정보 기반 데이터 시각화 및 분석</p>
                                                    <p style={{ marginLeft: '14px' }}></p>
                                                </div>
                                            </span>
                                        </div>
                                        <div className={bIntro.majorCasesD}>
                                            <span className={bIntro.majorCircleD}></span>
                                            <span className={bIntro.majorTitleD}>주요 사례</span>
                                            <div className={bIntro.majorFlexBoxD}>
                                                <div className={bIntro.case3}>
                                                    <span className={bIntro.caseIcon3}></span>
                                                    <span className={bIntro.caseText3}>
                                                        <p>여의도 파크원</p>
                                                        <p>(2020)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case4}>
                                                    <span className={bIntro.caseIcon4}></span>
                                                    <span className={bIntro.caseText4}>
                                                        <p>GC녹십자</p>
                                                        <p>(2021)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case5}>
                                                    <span className={bIntro.caseIcon5}></span>
                                                    <span className={bIntro.caseText5}>
                                                        <p>솔브레인</p>
                                                        <p>(2021)</p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </span>
                            </div>
                        </div>
                        {/* 주요 실적 */}
                        <div id="sectionPerformance">
                            <div className={bIntro.majorPerformanceContentsS}>
                                <span className={bIntro.majorPerformanceTitleS} data-aos="fade-down" data-aos-duration="1000">주요 실적</span>
                                <span className={bIntro.majorPerformanceSelect}>
                                    {/* <div class="majorSelectBox">
                                    <button class="label5M">전체</button>
                                    <ul class="majorOptionList">
                                        <li class="majorOptionItem">전체</li>
                                        <li class="majorOptionItem">안전관리</li>
                                        <li class="majorOptionItem">디지털 트윈</li>
                                    </ul>
                                </div> */}
                                </span>
                                <div className={bIntro.majorListBox}>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>경기융합타운 대표도서관, 신용보증재단 재난관리시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2024년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>부산 신평/장림산단 디지털 트윈 기반 통합관제 시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>부산TP</span>
                                            <span className={bIntro.majorListYear}>2024년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>마곡 사이언스파크 재난관리시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2024년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>경기융합타운 종합방재실 재난관리시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2024년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>원익QNC 스마트재난시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2024년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>목포시 강소형 스마트시티 조성사업 수주</span>
                                            <span className={bIntro.majorListOrder}>전남정보문화산업진흥원</span>
                                            <span className={bIntro.majorListYear}>2023년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>여수 국가산업단지 환경모니터링 시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>여수시</span>
                                            <span className={bIntro.majorListYear}>2023년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>과기정통부 디지털 트윈 혁신선도 사업(제조실증) 수행</span>
                                            <span className={bIntro.majorListOrder}>NIPA</span>
                                            <span className={bIntro.majorListYear}>2023년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>강원랜드 중장기안전관리체계 컨설팅 수행</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2023년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>청량리 수자인 재난관리 시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2022년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>LG CNS Virtual Datacenter System</span>
                                            <span className={bIntro.majorListOrder}>LG CNS</span>
                                            <span className={bIntro.majorListYear}>2022년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>솔브레인 공주공장 통합방재플랫폼 소프트웨어 구축</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2021년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>세종특별자치시 지하공동구 스마트관리시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>한국정보화진흥원</span>
                                            <span className={bIntro.majorListYear}>2020년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>NIPA 5G 디지털 트윈 공공선도 사업</span>
                                            <span className={bIntro.majorListOrder}>정보통신산업진흥원</span>
                                            <span className={bIntro.majorListYear}>2020년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>NIPA 5G 디지털 트윈 공공선도 사업 통합 재난 관제 시스템</span>
                                            <span className={bIntro.majorListOrder}>정보통신산업진흥원</span>
                                            <span className={bIntro.majorListYear}>2020년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>5G 디지털 트윈을 활용한 지자체 및 국방 다중이용 건축물 시설 안전대응 통합관리체계 구축</span>
                                            <span className={bIntro.majorListOrder}>정보통신산업진흥원</span>
                                            <span className={bIntro.majorListYear}>2020년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>디지털 트윈 기반 지하공동구 지능형 이상탐지 및 안전관리서비스</span>
                                            <span className={bIntro.majorListOrder}>한국정보화진흥원</span>
                                            <span className={bIntro.majorListYear}>2020년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>안전관리</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>신한은행 죽전데이터센터 재난관리 시스템</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2019년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>안전관리</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>충남대학교 e재난시스템 구축</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2019년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>안전관리</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>ICT기반 재난안전대비 현장훈련시스템 고도화 구축</span>
                                            <span className={bIntro.majorListOrder}>한국지역난방공사</span>
                                            <span className={bIntro.majorListYear}>2019년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>안전관리</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>여의도Parc.1 통합모니터링 중 통합재난S/W개발</span>
                                            <span className={bIntro.majorListOrder}>(주)에스원</span>
                                            <span className={bIntro.majorListYear}>2019년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>공간정보 기반의 실감형 콘텐츠 융복합 및 혼합현실 제공기술 개발</span>
                                            <span className={bIntro.majorListOrder}>행정안전부</span>
                                            <span className={bIntro.majorListYear}>2018년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>디지털트윈</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>세계 최고수준의 저비용∙고효율 실내공간정보 핵심기술 개발 및 실증</span>
                                            <span className={bIntro.majorListOrder}>국토교통부</span>
                                            <span className={bIntro.majorListYear}>2017년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>안전관리</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>3D 기반 도상훈련 시뮬레이터 개발</span>
                                            <span className={bIntro.majorListOrder}>산업통상자원부</span>
                                            <span className={bIntro.majorListYear}>2016년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>안전관리</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>에너지산업을 위한 재난안전 대비 현장훈련 시스템 개발</span>
                                            <span className={bIntro.majorListOrder}>산업통상자원부</span>
                                            <span className={bIntro.majorListYear}>2016년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>안전관리</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>실내환경서비스를 위한 IoT 실내 공기질 모니터링 및 플랫폼 기술 상용화</span>
                                            <span className={bIntro.majorListOrder}>산업통상자원부</span>
                                            <span className={bIntro.majorListYear}>2016년</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>안전관리</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>국가 산업단지내의 재난대응을 위한 Safe-Guard 서비스 플랫폼 개발</span>
                                            <span className={bIntro.majorListOrder}>산업통상자원부</span>
                                            <span className={bIntro.majorListYear}>2014년</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 파트너사 */}
                        <div id="sectionPartner">
                            <div className={bIntro.partnerContents}>
                                <span className={bIntro.partnerTitle} data-aos="fade-down" data-aos-duration="1000">파트너사</span>
                                <div className={bIntro.clientArea}>
                                    <div className={bIntro.clientFirst}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo1}></span>
                                            <span className={bIntro.clientName}>국토교통부</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo2}></span>
                                            <span className={bIntro.clientName}>외교부</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo3}></span>
                                            <span className={bIntro.clientName}>해양수산부</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo4}></span>
                                            <span className={bIntro.clientName}>서울특별시</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo5}></span>
                                            <span className={bIntro.clientName}>인천광역시</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo6}></span>
                                            <span className={bIntro.clientName}>경상남도</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientSecond}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo7}></span>
                                            <span className={bIntro.clientName}>세종특별자치시</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo8}></span>
                                            <span className={bIntro.clientName}>제주시</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo9}></span>
                                            <span className={bIntro.clientName}>전력거래소</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo10}></span>
                                            <span className={bIntro.clientName}>한국남동발전</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo11}></span>
                                            <span className={bIntro.clientName}>한국지역난방공사</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo12}></span>
                                            <span className={bIntro.clientName}>울산창만공사</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientThird}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo13}></span>
                                            <span className={bIntro.clientName}>솔브레인</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo14}></span>
                                            <span className={bIntro.clientName}>녹십자</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo15}></span>
                                            <span className={bIntro.clientName}>순천의료원</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo16}></span>
                                            <span className={bIntro.clientName}>파크원</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo17}></span>
                                            <span className={bIntro.clientName}>예울마루</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo18}></span>
                                            <span className={bIntro.clientName}>안양체육관</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientFourth}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo19}></span>
                                            <span className={bIntro.clientName}>서울대학교</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo20}></span>
                                            <span className={bIntro.clientName}>부산대학교</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo21}></span>
                                            <span className={bIntro.clientName}>충남대학교</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo22}></span>
                                            <span className={bIntro.clientName}>신한은행</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo23}></span>
                                            <span className={bIntro.clientName}>광명 유플래닛</span>
                                        </span>
                                        <span className={bIntro.clientContentsB}>
                                            <span></span>
                                            <span></span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 보도자료 */}
                        <div id="sectionNews">
                            <span className={bIntro.newsTitle} data-aos="fade-down" data-aos-duration="1000">보도자료</span>
                            <div className={bIntro.reportArea}>
                                {/* <div className={bIntro.postingTopArea}>
                                <span className={bIntro.postingCount}>총 <p>10건</p>의 게시물</span>
                            </div> */}
                            </div>
                            <div className={bIntro.postingBottomArea}>
                                <span className={bIntro.postingBoxArea}>
                                    {newsUI}
                                </span>
                            </div>
                            {
                                (this.state.newsDatas && this.state.newsDatas.length > 0) ?
                                    <div className={bIntro.pagination}>
                                        <a><span className={bIntro.arrowLeft} onClick={() => this.setPageIndex(1)}></span></a>
                                        <ul key={""}>
                                            {pageIndexUI}
                                        </ul>
                                        <a><span className={bIntro.arrowRight} onClick={() => this.setPageIndex(this.state.maxPageIndex)}></span></a>
                                    </div>
                                    : <></>
                            }
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
                    </div>
                </>
            );
        } else {
            displayBusinessUI.push(
                <></>
            );
        }
        return displayBusinessUI;
    }

    render() {
        /* const newsUI = this.displayNewsUI(); */
        /* const pageIndexUI = this.getPageIndexUI(); */

        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
        };

        setTimeout(() => { this.resizeUI() }, 500);
        let displayBusinessUI = this.state.disBusinessUI;

        return (
            <>
              {displayBusinessUI}
            </>
        );
    }
}

export default BusinessSectionKor;