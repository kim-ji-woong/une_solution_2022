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

import Modal from '../BusinessIntro/NewsModal.jsx';


class BusinessSectionEng extends Component {
    static displayName = BusinessSectionEng.name;

    constructor(props) {
        super(props);
        //this.index = this.index.bind(this);
        //this.onClickContent = this.onClickContent.bind(this);
        //this.setPageUI = this.setPageUI.bind(this);

        this.state = {
            menu: 0,
            displayContents: [],        // 원본 데이터
            newsDatas: newsDataTemp,              //보여줄 데이터
            //newsDatas: null,
            currentPageIndex: 1,        //현재 페이지
            viewDataCount: 6,           //페이지에서 보여줄 데이터 개수
            //pageIndex: 1,               // 현재 페이지
            minPageIndex: 1,            // 최소 페이지 Index	
            maxPageIndex: 1,            // 최대 페이지 Index	
            search: null,
            indexOfLastPage: null,
            contentIndex: -1,            //보도자료 첫페이지
            //newsDatas: null
            modal: false,
        };

        this.props = props;
        this.state.displayContents = newsDataTemp.news;
        this.state.newsDatas = newsDataTemp.news;
        this.displayNews();

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
        
        $('.' + bIntro.reportBtnLeftCon).css({ display: 'none' });
    }

    onClickContent = (index) => {
        this.setState({ contentIndex: index });
    }

    /* 이전글, 다음글 클릭했을때  */
    setPageUI = (param) => {
        const newNum = this.state.contentIndex + param;

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
        //console.log("selectedIndex : " + selectedIndex);

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
                    <div onClick={() => this.onClickContent(i)} key={news.id} /* value={news.id} */>
                        <span className={bIntro.postingBox} value={news.id} key={news.id} onClick={e => this.modalOpen(e)}>
                            <span className={bIntro.postingImg}><img src={news.image} /></span>
                            <span className={bIntro.postingText}>
                                <span className={bIntro.postingTitle}>{news.boardTitle}</span>
                                <span className={bIntro.postingContents}>{news.boardContents}</span>
                                <span className={bIntro.postingDate}>{news.boardDate}</span>
                            </span>
                        </span>
                    </div>
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

        const pageIndexUI = this.getPageIndexUI();

        let displayBusinessUI = [];
        let widthSize = window.outerWidth;

        if (widthSize < 768) {
            displayBusinessUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={bIntro.eIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">Our Business</span>
                            <span data-aos="fade-down" data-aos-duration="1000">Introduce U&E's business areas, major achievements, and partners.</span>
                        </div>
                        {/* 안전관리 */}
                        <div id="sectionSafety">
                            <div className={bIntro.safetyInforContentsSect2}>
                                <span className={bIntro.safetyTextBox}>
                                    <span className={bIntro.safetyManageTitle} data-aos="fade-down" data-aos-duration="1000">Safety Management Business</span>
                                    <div className={bIntro.safetyManageContents}>
                                        <div className={bIntro.safetyMText1E}>
                                            <span className={bIntro.safetyTextConts}>
                                                <span className={bIntro.safetyTexts1E}>
                                                    <span className={bIntro.businessTextBoldE}>The core of continuous accident/disaster response,</span>such as fire, gas leakage, flooding, and earthquakes,<span className={bIntro.businessTextBoldE}>lies in speed and efficiency.</span>
                                                </span>
                                                <span className={bIntro.safetyTexts2}>
                                                    Therefore, it is important to<span className={bIntro.businessTextBlackE}>integrate, collect, and analyze various sensors and CCTV information in real time,</span>
                                                    to<span className={bIntro.businessTextBlackE}>visualize the current situation by combining with indoor and outdoor spatial information,</span>
                                                    and to<span className={bIntro.businessTextBlackE}>share action tips and spread the situation through SOP</span>(standard operating procedures)<span className={bIntro.businessTextBlackE}>for each type of disaster.</span>
                                                </span>
                                                <span className={bIntro.safetyTexts3}>
                                                    <span className={bIntro.businessTextBoldE}>We provides sustainable safety management services covering both consulting and solutions</span>based
                                                    on the understanding of indoor and outdoor spaces and accumulated capabilities of disaster safety technologies and business.
                                                </span>
                                            </span>
                                        </div>

                                        <div className={bIntro.safetyMText2}>
                                            <span className={bIntro.safetyTextConts2}>
                                                <div className={bIntro.sTarget1}>Safety Management Consulting</div>
                                                <div className={bIntro.sSubFlex1}>
                                                    {/* <span className={bIntro.sCheckIcon}></span> */}
                                                    <span className={bIntro.sSubTitle1}>
                                                        <p className={bIntro.sSubText1}><span className={bIntro.businessTextBold2}></span>Safety management consulting services</p>
                                                        <p className={bIntro.sSubText1}><span>that are</span><span className={bIntro.businessTextBold2} style={{ marginLeft: '8px' }}>practically helpful in disaster situations: </span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.sSubCont1}>
                                                    <p>- Development of crisis response manuals for each</p>
                                                    <p style={{ marginLeft: '10px' }}>disaster situation</p>
                                                    <p>- Risk assessment</p>
                                                    <p>- Establishment of safety-related policies and</p>
                                                    <p style={{ marginLeft: '10px' }}>roadmaps</p>
                                                    <p>- Development of training scenarios</p>
                                                    <p>- Planning of civil defense policies</p>
                                                    <p>- Consulting related to the SERIOUS ACCIDENTS</p>
                                                    <p style={{ marginLeft : '10px' }}>PUNISHMENT ACT</p>
                                                </div>
                                            </span>
                                            <span className={bIntro.safetyTextConts3}>
                                                <div className={bIntro.sTarget2}>Smart Solutions</div>
                                                <div className={bIntro.sSubFlex2}>
                                                    {/* <span className={bIntro.sCheckIcon2}></span> */}
                                                    <span className={bIntro.sSubTitle2}>
                                                        <p>Smart safety management solutions<span className={bIntro.businessTextBold2}></span></p>
                                                        <p>that<span className={bIntro.businessTextBold2} style={{ marginLeft: '8px' }}>can respond to various types of disasters:</span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.sSubCont2}>
                                                    <p>- Smart disaster response system</p>
                                                    <p>- Smart disaster detection system</p>
                                                    <p>- Smart environment monitoring system</p>
                                                    <p>- Smart hazardous material management system</p>
                                                    <p>- Smart facility management system</p>
                                                    <p>- Smart worker safety management system</p>
                                                    <p></p>
                                                    <p></p>
                                                </div>
                                            </span>
                                        </div>
                                        <div className={bIntro.majorCases}>
                                            <span className={bIntro.majorCircle}></span>
                                            <span className={bIntro.majorTitle}>Major Case</span>
                                            <div className={bIntro.majorFlexPic}>
                                                <div className={bIntro.case1}>
                                                    <span className={bIntro.caseIcon1}></span>
                                                    <span className={bIntro.caseText1}>
                                                        <p>Korea South East Power</p>
                                                        <p>(2015)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case2}>
                                                    <span className={bIntro.caseIcon2}></span>
                                                    <span className={bIntro.caseText2}>
                                                        <p>Gyeongsangnama-do</p>
                                                        <p>(2020)</p>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={bIntro.majorFlexPic2}>
                                                <div className={bIntro.case3}>
                                                    <span className={bIntro.caseIcon3}></span>
                                                    <span className={bIntro.caseText3}>
                                                        <p>Gwangmyeong Urban Briggs</p>
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
                                    <span className={bIntro.digitalManageTitle} data-aos="fade-down" data-aos-duration="1000">Digital Twin Solutions Business</span>
                                    <div className={bIntro.digitalManageContents}>
                                        <div className={bIntro.digitalMText1}>
                                            <span className={bIntro.digitalTextConts}>
                                                <span className={bIntro.digitalTexts1E}>
                                                    Digital Twin is<span className={bIntro.businessTextBoldE}>a technology that equally implements real-world infrastructure in a virtual space</span>
                                                    such as buildings, facilities, sensor equipment, and work processes.
                                                </span>
                                                <span className={bIntro.digitalTexts2}>
                                                    Objects, systems and data in virtual space are<span className={bIntro.businessTextBlackE}>connected to real-world in real time,</span>and can be monitored, controlled, and simulated.
                                                    <span className={bIntro.businessTextBlackE}>This supports better decision-making and operation management in reality</span>without changing the actual facility.
                                                </span>
                                                <span className={bIntro.digitalTexts3}>
                                                    <span className={bIntro.businessTextBoldE}>We provides digital twin based application solutions that satisfy customer needs in various industries</span>
                                                    through our indoor and outdoor space construction technology, legacy system and IoT integration,
                                                    and real-time monitoring and simulation based on Bigdata and AI technology.
                                                </span>
                                            </span>
                                        </div>

                                        <div className={bIntro.digitalMText2}>
                                            <span className={bIntro.digitalTextConts2}>
                                                <div className={bIntro.dTarget1}>Spatial Information Construction</div>
                                                <div className={bIntro.dSubFlex1}>
                                                    {/* <span className={bIntro.dCheckIcon}></span> */}
                                                    <span className={bIntro.dSubTitle1}>
                                                        <p><span className={bIntro.businessTextBold3}>Construction of</span><span></span><span className={bIntro.businessTextBold3}>lightweight</span></p>
                                                        <p><span className={bIntro.businessTextBold3}>and high- quality</span></p>
                                                        <p><span>spatial information</span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont1}>
                                                    <p>- Informatization of the space where</p>
                                                    <p>people stay (buildings, facilities, ships,  aircraft, etc.)</p>
                                                    <p /* style={{ marginLeft: '14px' }}*/ ><span /* style={{ paddingLeft: '14px' }}*/ ></span></p>
                                                    <p>- High quality outdoor space modeling</p>
                                                    <p style={{ marginLeft: '14px' }}>with LOD 4 or higher</p>
                                                    <p>- 1/10th lighter than traditional BIM</p>

                                                </div>
                                            </span>
                                            <span className={bIntro.digitalTextConts3}>
                                                <div className={bIntro.dTarget2}>Data Visualization</div>
                                                <div className={bIntro.dSubFlex2}>
                                                    {/* <span className={bIntro.dCheckIcon2}></span> */}
                                                    <span className={bIntro.dSubTitle2}>
                                                        <p></p>
                                                        <p><span className={bIntro.businessTextBold3}>legacy systems</span></p>
                                                        <p><span style={{ display: 'inline-block', marginRight: '8px' }}>and various</span><span className={bIntro.businessTextBold2}>IoT sensors</span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont2}>
                                                    <p>- Integration of systems in various</p>
                                                    <p>industries(logistics, manufacturing,</p>
                                                    <p>aviation, marine, construction, etc.)</p>
                                                    <p>- Connecting and stabilizing CCTV with</p>
                                                    <p><span style={{ display: 'inline-block', marginLeft: '14px' }}>existing sensors</span></p>
                                                </div>
                                            </span>
                                            <span className={bIntro.digitalTextConts4}>
                                                <div className={bIntro.dTarget3}>System Integration</div>
                                                <div className={bIntro.dSubFlex3}>
                                                    {/* <span className={bIntro.dCheckIcon3}></span> */}
                                                    <span className={bIntro.dSubTitle3}>
                                                        <p><span className={bIntro.businessTextBold3}></span>Provides data visualization</p>
                                                        <p><span>and monitoring</span></p>
                                                        <p><span className={bIntro.businessTextBold2}>based on the latest ICT</span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont3}>
                                                    <p>- Collecting and visualizing system and</p>
                                                    <p style={{ marginLeft: '14px' }}>sensor information</p>
                                                    <p>- Real-time monitoring of system and</p>
                                                    <p style={{ marginLeft: '14px' }}>sensor information</p>
                                                    <p>- Visualization and Analysis of Data</p>
                                                    <p style={{ marginLeft: '14px' }}>Based on 3D Spatial Information</p>
                                                </div>
                                            </span>
                                        </div>
                                        <div className={bIntro.majorCasesD}>
                                            <span className={bIntro.majorCircleD}></span>
                                            <span className={bIntro.majorTitleD}>Major Case</span>
                                            <div className={bIntro.majorFlexBoxD}>
                                                <div className={bIntro.case3}>
                                                    <span className={bIntro.caseIcon3}></span>
                                                    <span className={bIntro.caseText3}>
                                                        <p>Yeouido Park One</p>
                                                        <p>(2020)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case4}>
                                                    <span className={bIntro.caseIcon4}></span>
                                                    <span className={bIntro.caseText4}>
                                                        <p>GC Biopharma</p>
                                                        <p>(2021)</p>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={bIntro.majorFlexBoxD2}>
                                                <div className={bIntro.case5}>
                                                    <span className={bIntro.caseIcon5}></span>
                                                    <span className={bIntro.caseText5}>
                                                        <p>Soulbrain</p>
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
                                <span className={bIntro.majorPerformanceTitleS} data-aos="fade-down" data-aos-duration="1000">Business performance</span>
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
                                            <span className={bIntro.majorListTitle}>Development of Soulbrain Gongju Factory Integrated disaster prevention platform software</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2021</span>
                                            <span className={bIntro.majorListOrder}>S1</span>
                                            <span className={bIntro.majorClass}>Digital Twin</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Sejong City Underground joint district smart management system</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2020</span>
                                            <span className={bIntro.majorListOrder}>NIA</span>
                                            <span className={bIntro.majorClass}>Digital Twin</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Participation in NIPA 5G digital twin public leading project</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2020</span>
                                            <span className={bIntro.majorListOrder}>NIPA</span>
                                            <span className={bIntro.majorClass}>Digital Twin</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Integrated disaster control system in NIPA 5G digital twin public leading project</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2020</span>
                                            <span className={bIntro.majorListOrder}>NIPA</span>
                                            <span className={bIntro.majorClass}>Digital Twin</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Establishment of Integrated management system for safety response for local governments and defense multi- use building facilities using 5G digital twin</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2020</span>
                                            <span className={bIntro.majorListOrder}>NIPA</span>
                                            <span className={bIntro.majorClass}>Digital Twin</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Digital twin-based underground tunnel intelligent anomaly detection and safety management service</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2020</span>
                                            <span className={bIntro.majorListOrder}>NIA</span>
                                            <span className={bIntro.majorClass}>Digital Twin</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Shinhan Bank Jukjeon data center disaster management system</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2019</span>
                                            <span className={bIntro.majorListOrder}>S1</span>
                                            <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Chungnam National University e-Disaster system</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2019</span>
                                            <span className={bIntro.majorListOrder}>S1</span>
                                            <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of ICT-based disaster safety preparation on-site training system (advanced)</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2019</span>
                                            <span className={bIntro.majorListOrder}>KDHC</span>
                                            <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Yeouido Parc.1 Integrated disaster S/W part</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2019</span>
                                            <span className={bIntro.majorListOrder}>S1</span>
                                            <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Technology for providing immersive content convergence and mixed reality based on spatial information</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2018</span>
                                            <span className={bIntro.majorListOrder}>MOIS</span>
                                            <span className={bIntro.majorClass}>Digital Twin</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development and demonstration of World-class low-cost and high- efficiency indoor spatial information core technology</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2017</span>
                                            <span className={bIntro.majorListOrder}>MOLIT</span>
                                            <span className={bIntro.majorClass}>Digital Twin</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of 3D-based map training simulator</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2016</span>
                                            <span className={bIntro.majorListOrder}>MOTIE</span>
                                            <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of On-site training system for disaster safety preparedness for the energy industry</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2016</span>
                                            <span className={bIntro.majorListOrder}>MOTIE</span>
                                            <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Commercialization of IoT indoor air quality monitoring and platform technology for indoor environment service</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2016</span>
                                            <span className={bIntro.majorListOrder}>MOTIE</span>
                                            <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Safe-Guard service platform development for disaster response in national industrial complexes</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2014</span>
                                            <span className={bIntro.majorListOrder}>MOTIE</span>
                                            <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 파트너사 */}
                        <div id="sectionPartner">
                            <div className={bIntro.partnerContents}>
                                <span className={bIntro.partnerTitle} data-aos="fade-down" data-aos-duration="1000">Our Partners</span>
                                <div className={bIntro.clientArea}>
                                    <div className={bIntro.clientFirst}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo1}></span>
                                            <span className={bIntro.clientName}>MOLIT</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo2}></span>
                                            <span className={bIntro.clientName}>MOFA</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo3}></span>
                                            <span className={bIntro.clientName}>MOF</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientSecond}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo4}></span>
                                            <span className={bIntro.clientName}>Seoul Metropolitan City</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo5}></span>
                                            <span className={bIntro.clientName}>Incheon Metropolitan City</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo6}></span>
                                            <span className={bIntro.clientName}>Gyeongsangnama-do</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientThird}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo7}></span>
                                            <span className={bIntro.clientName}>Sejong City</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo8}></span>
                                            <span className={bIntro.clientName}>Jeju City</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo9}></span>
                                            <span className={bIntro.clientName}>KPX</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientFourth}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo10}></span>
                                            <span className={bIntro.clientName}>KOEN</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo11}></span>
                                            <span className={bIntro.clientName}>KDHC</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo12}></span>
                                            <span className={bIntro.clientName}>UPA</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientFifth}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo13}></span>
                                            <span className={bIntro.clientName}>Soulbrain</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo14}></span>
                                            <span className={bIntro.clientName}>GC Biopharma</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo15}></span>
                                            <span className={bIntro.clientName}>Suncheon Medical Center</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientSixth}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo16}></span>
                                            <span className={bIntro.clientName}>Parc.1</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo17}></span>
                                            <span className={bIntro.clientName}>Yeulmaru</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo18}></span>
                                            <span className={bIntro.clientName}>Anyang Gymnasium</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientSeventh}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo19}></span>
                                            <span className={bIntro.clientName}>Seoul National Univ.</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo20}></span>
                                            <span className={bIntro.clientName}>Pusan National Univ.</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo21}></span>
                                            <span className={bIntro.clientName}>Chungnam National Univ.</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientEighth}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo22}></span>
                                            <span className={bIntro.clientName}>Shinhan Bank</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo23}></span>
                                            <span className={bIntro.clientName}>U - Planet</span>
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
                            <span className={bIntro.newsTitle} data-aos="fade-down" data-aos-duration="1000">Press Release</span>
                            <div className={bIntro.reportArea}>
                            </div>

                            <div className={bIntro.postingBottomArea}>
                                <span className={bIntro.postingBoxArea}>
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
            displayBusinessUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={bIntro.eIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">Our Businessv</span>
                            <span data-aos="fade-down" data-aos-duration="1000">Introduce U&E's business areas, major achievements, and partners.</span>
                        </div>
                        {/* 안전관리 */}
                        <div id="sectionSafety">
                            <div className={bIntro.safetyInforContentsSect2}>
                                <span className={bIntro.safetyTextBox}>
                                    <span className={bIntro.safetyManageTitle} data-aos="fade-down" data-aos-duration="1000">Safety Management Business</span>
                                    <div className={bIntro.safetyManageContents}>
                                        <div className={bIntro.safetyMText1}>
                                            <span className={bIntro.safetyTextConts}>
                                                <span className={bIntro.safetyTexts1E}>
                                                    <span className={bIntro.businessTextBold}>The core of continuous accident/disaster response,</span>such as fire, gas leakage, flooding, and earthquakes,<span className={bIntro.businessTextBold}>lies in speed and efficiency.</span>
                                                </span>
                                                <span className={bIntro.safetyTexts2}>
                                                    Therefore, it is important to<span className={bIntro.businessTextBlack}>integrate, collect, and analyze various sensors and CCTV information in real time,</span>
                                                    to<span className={bIntro.businessTextBlack}>visualize the current situation by combining with indoor and outdoor spatial information,</span>
                                                    and to<span className={bIntro.businessTextBlack}>share action tips and spread the situation through SOP</span>(standard operating procedures)<span className={bIntro.businessTextBlack}>for each type of disaster.</span>
                                                </span>
                                                <span className={bIntro.safetyTexts3}>
                                                    <span className={bIntro.businessTextBold}>We provides sustainable safety management services covering both consulting and solutions</span>based
                                                    on the understanding of indoor and outdoor spaces and accumulated capabilities of disaster safety technologies and business.
                                                </span>
                                            </span>
                                        </div>

                                        <div className={bIntro.safetyMText2}>
                                            <span className={bIntro.safetyTextConts2}>
                                                <div className={bIntro.sTarget1}>Safety Management Consulting</div>
                                                <div className={bIntro.sSubFlex1}>
                                                    {/* <span className={bIntro.sCheckIcon}></span> */}
                                                    <span className={bIntro.sSubTitle1}>
                                                        <p className={bIntro.sSubText1}><span className={bIntro.businessTextBold2}></span>Safety management consulting services</p>
                                                        <p className={bIntro.sSubText1}><span>that are</span><span className={bIntro.businessTextBold2} style={{ marginLeft: '8px' }}>practically helpful in disaster situations: </span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.sSubCont1}>
                                                    <p>- Development of crisis response manuals for each disaster situation</p>
                                                    <p>- Risk assessment</p>
                                                    <p>- Establishment of safety-related policies and roadmaps</p>
                                                    <p>- Development of training scenarios</p>
                                                    <p>- Planning of civil defense policies</p>
                                                    <p>- Consulting related to the SERIOUS ACCIDENTS PUNISHMENT ACT</p>
                                                </div>
                                            </span>
                                            <span className={bIntro.safetyTextConts3}>
                                                <div className={bIntro.sTarget2}>Smart Solutions</div>
                                                <div className={bIntro.sSubFlex2}>
                                                    {/* <span className={bIntro.sCheckIcon2}></span> */}
                                                    <span className={bIntro.sSubTitle2}>
                                                        <p>Smart safety management solutions<span className={bIntro.businessTextBold2}></span></p>
                                                        <p>that<span className={bIntro.businessTextBold2} style={{ marginLeft: '8px' }}>can respond to various types of disasters:</span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.sSubCont2}>
                                                    <p>- Smart disaster response system</p>
                                                    <p>- Smart disaster detection system</p>
                                                    <p>- Smart environment monitoring system</p>
                                                    <p>- Smart hazardous material management system</p>
                                                    <p>- Smart facility management system</p>
                                                    <p>- Smart worker safety management system</p>
                                                    <p></p>
                                                    <p></p>
                                                </div>
                                            </span>
                                        </div>
                                        <div className={bIntro.majorCases}>
                                            <span className={bIntro.majorCircle}></span>
                                            <span className={bIntro.majorTitle}>Major Case</span>
                                            <div className={bIntro.majorFlexPic}>
                                                <div className={bIntro.case1}>
                                                    <span className={bIntro.caseIcon1}></span>
                                                    <span className={bIntro.caseText1}>
                                                        <p>Korea South East Power</p>
                                                        <p>(2015)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case2}>
                                                    <span className={bIntro.caseIcon2}></span>
                                                    <span className={bIntro.caseText2}>
                                                        <p>Gyeongsangnama-do</p>
                                                        <p>(2020)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case3}>
                                                    <span className={bIntro.caseIcon3}></span>
                                                    <span className={bIntro.caseText3}>
                                                        <p>Gwangmyeong Urban Briggs</p>
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
                                    <span className={bIntro.digitalManageTitle} data-aos="fade-down" data-aos-duration="1000">Digital Twin Solutions Business</span>
                                    <div className={bIntro.digitalManageContents}>
                                        <div className={bIntro.digitalMText1}>
                                            <span className={bIntro.digitalTextConts}>
                                                <span className={bIntro.digitalTexts1E}>
                                                    Digital Twin is<span className={bIntro.businessTextBold}>a technology that equally implements real-world infrastructure in a virtual space</span>
                                                    such as buildings, facilities, sensor equipment, and work processes.
                                                </span>
                                                <span className={bIntro.digitalTexts2}>
                                                    Objects, systems and data in virtual space are<span className={bIntro.businessTextBlack}>connected to real-world in real time,</span>and can be monitored, controlled, and simulated.
                                                    <span className={bIntro.businessTextBlack}>This supports better decision-making and operation management in reality</span>without changing the actual facility.
                                                </span>
                                                <span className={bIntro.digitalTexts3}>
                                                    <span className={bIntro.businessTextBold}>We provides digital twin based application solutions that satisfy customer needs in various industries</span>
                                                    through our indoor and outdoor space construction technology, legacy system and IoT integration,
                                                    and real-time monitoring and simulation based on Bigdata and AI technology.
                                                </span>
                                            </span>
                                        </div>

                                        <div className={bIntro.digitalMText2}>
                                            <span className={bIntro.digitalTextConts2}>
                                                <div className={bIntro.dTarget1}>Spatial Information Construction</div>
                                                <div className={bIntro.dSubFlex1}>
                                                    {/* <span className={bIntro.dCheckIcon}></span> */}
                                                    <span className={bIntro.dSubTitle1}>
                                                        <p><span className={bIntro.businessTextBold3}>Construction of</span><span></span><span className={bIntro.businessTextBold3}>lightweight</span></p>
                                                        <p><span className={bIntro.businessTextBold3}>and high- quality</span></p>
                                                        <p><span>spatial information</span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont1}>
                                                    <p>- Informatization of the space where</p>
                                                    <p>people stay (buildings, facilities, ships,  aircraft, etc.)</p>
                                                    <p /* style={{ marginLeft: '14px' }}*/ ><span /* style={{ paddingLeft: '14px' }}*/ ></span></p>
                                                    <p>- High quality outdoor space modeling</p>
                                                    <p style={{ marginLeft: '14px' }}>with LOD 4 or higher</p>
                                                    <p>- 1/10th lighter than traditional BIM</p>

                                                </div>
                                            </span>
                                            <span className={bIntro.digitalTextConts3}>
                                                <div className={bIntro.dTarget2}>Data Visualization</div>
                                                <div className={bIntro.dSubFlex2}>
                                                    {/* <span className={bIntro.dCheckIcon2}></span> */}
                                                    <span className={bIntro.dSubTitle2}>
                                                        <p></p>
                                                        <p><span className={bIntro.businessTextBold3}>legacy systems</span></p>
                                                        <p><span style={{ display: 'inline-block', marginRight: '8px' }}>and various</span><span className={bIntro.businessTextBold2}>IoT sensors</span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont2}>
                                                    <p>- Integration of systems in various</p>
                                                    <p>industries(logistics, manufacturing,</p>
                                                    <p>aviation, marine, construction, etc.)</p>
                                                    <p>- Connecting and stabilizing CCTV with</p>
                                                    <p><span style={{ display: 'inline-block', marginLeft: '14px' }}>existing sensors</span></p>
                                                </div>
                                            </span>
                                            <span className={bIntro.digitalTextConts4}>
                                                <div className={bIntro.dTarget3}>System Integration</div>
                                                <div className={bIntro.dSubFlex3}>
                                                    {/* <span className={bIntro.dCheckIcon3}></span> */}
                                                    <span className={bIntro.dSubTitle3}>
                                                        <p><span className={bIntro.businessTextBold3}></span>Provides data visualization</p>
                                                        <p><span>and monitoring</span></p>
                                                        <p><span className={bIntro.businessTextBold2}>based on the latest ICT</span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont3}>
                                                    <p>- Collecting and visualizing system and</p>
                                                    <p style={{ marginLeft: '14px' }}>sensor information</p>
                                                    <p>- Real-time monitoring of system and</p>
                                                    <p style={{ marginLeft: '14px' }}>sensor information</p>
                                                    <p>- Visualization and Analysis of Data</p>
                                                    <p style={{ marginLeft: '14px' }}>Based on 3D Spatial Information</p>
                                                </div>
                                            </span>
                                        </div>
                                        <div className={bIntro.majorCasesD}>
                                            <span className={bIntro.majorCircleD}></span>
                                            <span className={bIntro.majorTitleD}>Major Case</span>
                                            <div className={bIntro.majorFlexBoxD}>
                                                <div className={bIntro.case3}>
                                                    <span className={bIntro.caseIcon3}></span>
                                                    <span className={bIntro.caseText3}>
                                                        <p>Yeouido Park One</p>
                                                        <p>(2020)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case4}>
                                                    <span className={bIntro.caseIcon4}></span>
                                                    <span className={bIntro.caseText4}>
                                                        <p>GC Biopharma</p>
                                                        <p>(2021)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case5}>
                                                    <span className={bIntro.caseIcon5}></span>
                                                    <span className={bIntro.caseText5}>
                                                        <p>Soulbrain</p>
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
                                <span className={bIntro.majorPerformanceTitleS} data-aos="fade-down" data-aos-duration="1000">Business performance</span>
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
                                            <span className={bIntro.majorListTitle}>Development of Soulbrain Gongju Factory Integrated disaster prevention platform software</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2021</span>
                                            <span className={bIntro.majorListOrder}>S1</span>
                                            <span className={bIntro.majorClass}>Digital Twin</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Sejong City Underground joint district smart management system</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2020</span>
                                            <span className={bIntro.majorListOrder}>NIA</span>
                                            <span className={bIntro.majorClass}>Digital Twin</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Participation in NIPA 5G digital twin public leading project</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2020</span>
                                            <span className={bIntro.majorListOrder}>NIPA</span>
                                            <span className={bIntro.majorClass}>Digital Twin</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Integrated disaster control system in NIPA 5G digital twin public leading project</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2020</span>
                                            <span className={bIntro.majorListOrder}>NIPA</span>
                                            <span className={bIntro.majorClass}>Digital Twin</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Establishment of Integrated management system for safety response for local governments and defense multi- use building facilities using 5G digital twin</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2020</span>
                                            <span className={bIntro.majorListOrder}>NIPA</span>
                                            <span className={bIntro.majorClass}>Digital Twin</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Digital twin-based underground tunnel intelligent anomaly detection and safety management service</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2020</span>
                                            <span className={bIntro.majorListOrder}>NIA</span>
                                            <span className={bIntro.majorClass}>Digital Twin</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Shinhan Bank Jukjeon data center disaster management system</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2019</span>
                                            <span className={bIntro.majorListOrder}>S1</span>
                                            <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Chungnam National University e-Disaster system</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2019</span>
                                            <span className={bIntro.majorListOrder}>S1</span>
                                            <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of ICT-based disaster safety preparation on-site training system (advanced)</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2019</span>
                                            <span className={bIntro.majorListOrder}>KDHC</span>
                                            <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Yeouido Parc.1 Integrated disaster S/W part</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2019</span>
                                            <span className={bIntro.majorListOrder}>S1</span>
                                            <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Technology for providing immersive content convergence and mixed reality based on spatial information</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2018</span>
                                            <span className={bIntro.majorListOrder}>MOIS</span>
                                            <span className={bIntro.majorClass}>Digital Twin</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development and demonstration of World-class low-cost and high- efficiency indoor spatial information core technology</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2017</span>
                                            <span className={bIntro.majorListOrder}>MOLIT</span>
                                            <span className={bIntro.majorClass}>Digital Twin</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of 3D-based map training simulator</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2016</span>
                                            <span className={bIntro.majorListOrder}>MOTIE</span>
                                            <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of On-site training system for disaster safety preparedness for the energy industry</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2016</span>
                                            <span className={bIntro.majorListOrder}>MOTIE</span>
                                            <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Commercialization of IoT indoor air quality monitoring and platform technology for indoor environment service</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2016</span>
                                            <span className={bIntro.majorListOrder}>MOTIE</span>
                                            <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Safe-Guard service platform development for disaster response in national industrial complexes</span>
                                        </div>
                                        <div className={bIntro.majorFlexBoxY}>
                                            <span className={bIntro.majorListYear}>2014</span>
                                            <span className={bIntro.majorListOrder}>MOTIE</span>
                                            <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 파트너사 */}
                        <div id="sectionPartner">
                            <div className={bIntro.partnerContents}>
                                <span className={bIntro.partnerTitle} data-aos="fade-down" data-aos-duration="1000">Our Partners</span>
                                <div className={bIntro.clientArea}>
                                    <div className={bIntro.clientFirst}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo1}></span>
                                            <span className={bIntro.clientName}>MOLIT</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo2}></span>
                                            <span className={bIntro.clientName}>MOFA</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo3}></span>
                                            <span className={bIntro.clientName}>MOF</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientSecond}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo4}></span>
                                            <span className={bIntro.clientName}>Seoul Metropolitan City</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo5}></span>
                                            <span className={bIntro.clientName}>Incheon Metropolitan City</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo6}></span>
                                            <span className={bIntro.clientName}>Gyeongsangnama-do</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientThird}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo7}></span>
                                            <span className={bIntro.clientName}>Sejong City</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo8}></span>
                                            <span className={bIntro.clientName}>Jeju City</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo9}></span>
                                            <span className={bIntro.clientName}>KPX</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientFourth}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo10}></span>
                                            <span className={bIntro.clientName}>KOEN</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo11}></span>
                                            <span className={bIntro.clientName}>KDHC</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo12}></span>
                                            <span className={bIntro.clientName}>UPA</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientFifth}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo13}></span>
                                            <span className={bIntro.clientName}>Soulbrain</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo14}></span>
                                            <span className={bIntro.clientName}>GC Biopharma</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo15}></span>
                                            <span className={bIntro.clientName}>Suncheon Medical Center</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientSixth}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo16}></span>
                                            <span className={bIntro.clientName}>Parc.1</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo17}></span>
                                            <span className={bIntro.clientName}>Yeulmaru</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo18}></span>
                                            <span className={bIntro.clientName}>Anyang Gymnasium</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientSeventh}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo19}></span>
                                            <span className={bIntro.clientName}>Seoul National Univ.</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo20}></span>
                                            <span className={bIntro.clientName}>Pusan National Univ.</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo21}></span>
                                            <span className={bIntro.clientName}>Chungnam National Univ.</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientEighth}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo22}></span>
                                            <span className={bIntro.clientName}>Shinhan Bank</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo23}></span>
                                            <span className={bIntro.clientName}>U - Planet</span>
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
                            <span className={bIntro.newsTitle} data-aos="fade-down" data-aos-duration="1000">Press Release</span>
                            <div className={bIntro.reportArea}>
                            </div>

                            <div className={bIntro.postingBottomArea}>
                                <span className={bIntro.postingBoxArea}>
                                    {newsUI}
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
            displayBusinessUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={bIntro.eIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">Our Business</span>
                            <span data-aos="fade-down" data-aos-duration="1000">Introduce U&E's business areas, major achievements, and partners.</span>
                        </div>
                        {/* 안전관리 */}
                        <div id="sectionSafety">
                            <div className={bIntro.safetyInforContentsSect2}>
                                <span className={bIntro.safetyTextBox}>
                                    <span className={bIntro.safetyManageTitle} data-aos="fade-down" data-aos-duration="1000">Safety Management Business</span>
                                    <div className={bIntro.safetyManageContents}>
                                        <div className={bIntro.safetyMText1}>
                                            <span className={bIntro.safetyTextConts}>
                                                <span className={bIntro.safetyTexts1E}>
                                                    <span className={bIntro.businessTextBold}>The core of continuous accident/disaster response,</span>such as fire, gas leakage, flooding, and earthquakes,<span className={bIntro.businessTextBold}>lies in speed and efficiency.</span>
                                                </span>
                                                <span className={bIntro.safetyTexts2}>
                                                    Therefore, it is important to<span className={bIntro.businessTextBlack}>integrate, collect, and analyze various sensors and CCTV information in real time,</span>
                                                    to<span className={bIntro.businessTextBlack}>visualize the current situation by combining with indoor and outdoor spatial information,</span>
                                                    and to<span className={bIntro.businessTextBlack}>share action tips and spread the situation through SOP</span>(standard operating procedures)<span className={bIntro.businessTextBlack}>for each type of disaster.</span>
                                                </span>
                                                <span className={bIntro.safetyTexts3}>
                                                    <span className={bIntro.businessTextBold}>We provides sustainable safety management services covering both consulting and solutions</span>based
                                                    on the understanding of indoor and outdoor spaces and accumulated capabilities of disaster safety technologies and business.
                                                </span>
                                            </span>
                                        </div>

                                        <div className={bIntro.safetyMText2}>
                                            <span className={bIntro.safetyTextConts2}>
                                                <div className={bIntro.sTarget1}>Safety Management Consulting</div>
                                                <div className={bIntro.sSubFlex1}>
                                                    {/* <span className={bIntro.sCheckIcon}></span> */}
                                                    <span className={bIntro.sSubTitle1}>
                                                        <p className={bIntro.sSubText1}><span className={bIntro.businessTextBold2}></span>Safety management consulting services</p>
                                                        <p className={bIntro.sSubText1}><span>that are</span><span className={bIntro.businessTextBold2} style={{ marginLeft: '8px' }}>practically helpful in disaster situations: </span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.sSubCont1}>
                                                    <p>- Development of crisis response manuals for each disaster</p>
                                                    <p style={{ marginLeft : '10px' }}>situation</p>
                                                    <p>- Risk assessment</p>
                                                    <p>- Establishment of safety-related policies and roadmaps</p>
                                                    <p>- Development of training scenarios</p>
                                                    <p>- Planning of civil defense policies</p>
                                                    <p>- Consulting related to the SERIOUS ACCIDENTS</p>
                                                    <p style={{ marginLeft : '10px' }}>PUNISHMENT ACT</p>
                                                </div>
                                            </span>
                                            <span className={bIntro.safetyTextConts3}>
                                                <div className={bIntro.sTarget2}>Smart Solutions</div>
                                                <div className={bIntro.sSubFlex2}>
                                                    {/* <span className={bIntro.sCheckIcon2}></span> */}
                                                    <span className={bIntro.sSubTitle2}>
                                                        <p>Smart safety management solutions<span className={bIntro.businessTextBold2}></span></p>
                                                        <p>that<span className={bIntro.businessTextBold2} style={{ marginLeft: '8px' }}>can respond to various types of disasters:</span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.sSubCont2}>
                                                    <p>- Smart disaster response system</p>
                                                    <p>- Smart disaster detection system</p>
                                                    <p>- Smart environment monitoring system</p>
                                                    <p>- Smart hazardous material management system</p>
                                                    <p>- Smart facility management system</p>
                                                    <p>- Smart worker safety management system</p>
                                                    <p></p>
                                                    <p></p>
                                                </div>
                                            </span>
                                        </div>
                                        <div className={bIntro.majorCases}>
                                            <span className={bIntro.majorCircle}></span>
                                            <span className={bIntro.majorTitle}>Major Case</span>
                                            <div className={bIntro.majorFlexPic}>
                                                <div className={bIntro.case1}>
                                                    <span className={bIntro.caseIcon1}></span>
                                                    <span className={bIntro.caseText1}>
                                                        <p>Korea South East Power</p>
                                                        <p>(2015)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case2}>
                                                    <span className={bIntro.caseIcon2}></span>
                                                    <span className={bIntro.caseText2}>
                                                        <p>Gyeongsangnama-do</p>
                                                        <p>(2020)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case3}>
                                                    <span className={bIntro.caseIcon2}></span>
                                                    <span className={bIntro.caseText3}>
                                                        <p>Gwangmyeong Urban Briggs</p>
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
                                    <span className={bIntro.digitalManageTitle} data-aos="fade-down" data-aos-duration="1000">Digital Twin Solutions Business</span>
                                    <div className={bIntro.digitalManageContents}>
                                        <div className={bIntro.digitalMText1}>
                                             <span className={bIntro.digitalTextConts}>
                                                <span className={bIntro.digitalTexts1}>
                                                    Digital Twin is<span className={bIntro.businessTextBold}>a technology that equally implements real-world infrastructure in a virtual space</span>
                                                    such as buildings, facilities, sensor equipment, and work processes.
                                                </span>
                                                <span className={bIntro.digitalTexts2}>
                                                    Objects, systems and data in virtual space are<span className={bIntro.businessTextBlack}>connected to real-world in real time,</span>and can be monitored, controlled, and simulated.
                                                    <span className={bIntro.businessTextBlack}>This supports better decision-making and operation management in reality</span>without changing the actual facility.
                                                </span>
                                                <span className={bIntro.digitalTexts3}>
                                                    <span className={bIntro.businessTextBold}>We provides digital twin based application solutions that satisfy customer needs in various industries</span>
                                                    through our indoor and outdoor space construction technology, legacy system and IoT integration,
                                                    and real-time monitoring and simulation based on Bigdata and AI technology.
                                                </span>
                                            </span>
                                        </div>

                                        <div className={bIntro.digitalMText2}>
                                            <span className={bIntro.digitalTextConts2}>
                                                <div className={bIntro.dTarget1}>Spatial Information Construction</div>
                                                <div className={bIntro.dSubFlex1}>
                                                    {/* <span className={bIntro.dCheckIcon}></span> */}
                                                    <span className={bIntro.dSubTitle1}>
                                                        <p><span className={bIntro.businessTextBold3}></span><span style={{ marginRight: '8px' }}>Construction of</span><span className={bIntro.businessTextBold3}>lightweight</span></p>
                                                        <p><span className={bIntro.businessTextBold3}>and high- quality</span></p>
                                                        <p><span>spatial information</span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont1}>
                                                    <p>- Informatization of the space where</p>
                                                    <p>people stay (buildings, facilities, ships,  aircraft, etc.)</p>
                                                    <p /* style={{ marginLeft: '14px' }}*/ ><span /* style={{ paddingLeft: '14px' }}*/ ></span></p>
                                                    <p>- High quality outdoor space modeling</p>
                                                    <p style={{ marginLeft: '14px' }}>with LOD 4 or higher</p>
                                                    <p>- 1/10th lighter than traditional BIM</p>

                                                </div>
                                            </span>
                                            <span className={bIntro.digitalTextConts3}>
                                                <div className={bIntro.dTarget2}>Data Visualization</div>
                                                <div className={bIntro.dSubFlex2}>
                                                    {/* <span className={bIntro.dCheckIcon2}></span> */}
                                                    <span className={bIntro.dSubTitle2}>
                                                        <p>Integration of</p>
                                                        <p><span className={bIntro.businessTextBold3}>legacy systems</span></p>
                                                        <p><span style={{ display: 'inline-block', marginRight: '8px' }}>and various</span><span className={bIntro.businessTextBold2}>IoT sensors</span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont2}>
                                                    <p>- Integration of systems in various</p>
                                                    <p>industries(logistics, manufacturing,</p>
                                                    <p>aviation, marine, construction, etc.)</p>
                                                    <p>- Connecting and stabilizing CCTV with</p>
                                                    <p><span style={{ display: 'inline-block', marginLeft: '14px' }}>existing sensors</span></p>
                                                </div>
                                            </span>
                                            <span className={bIntro.digitalTextConts4}>
                                                <div className={bIntro.dTarget3}>System Integration</div>
                                                <div className={bIntro.dSubFlex3}>
                                                    {/* <span className={bIntro.dCheckIcon3}></span> */}
                                                    <span className={bIntro.dSubTitle3}>
                                                        <p><span className={bIntro.businessTextBold3}></span>Provides data visualization</p>
                                                        <p><span>and monitoring</span></p>
                                                        <p><span className={bIntro.businessTextBold2}>based on the latest ICT</span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont3}>
                                                    <p>- Collecting and visualizing system and</p>
                                                    <p style={{ marginLeft: '14px' }}>sensor information</p>
                                                    <p>- Real-time monitoring of system and</p>
                                                    <p style={{ marginLeft: '14px' }}>sensor information</p>
                                                    <p>- Visualization and Analysis of Data </p>
                                                    <p style={{ marginLeft: '14px' }}>Based on 3D Spatial Information</p>
                                                </div>
                                            </span>
                                        </div>
                                        <div className={bIntro.majorCasesD}>
                                            <span className={bIntro.majorCircleD}></span>
                                            <span className={bIntro.majorTitleD}>Major Case</span>
                                            <div className={bIntro.majorFlexBoxD}>
                                                <div className={bIntro.case3}>
                                                    <span className={bIntro.caseIcon3}></span>
                                                    <span className={bIntro.caseText3}>
                                                        <p>Yeouido Park One</p>
                                                        <p>(2020)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case4}>
                                                    <span className={bIntro.caseIcon4}></span>
                                                    <span className={bIntro.caseText4}>
                                                        <p>GC Biopharma</p>
                                                        <p>(2021)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case5}>
                                                    <span className={bIntro.caseIcon5}></span>
                                                    <span className={bIntro.caseText5}>
                                                        <p>Soulbrain</p>
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
                                <span className={bIntro.majorPerformanceTitleS} data-aos="fade-down" data-aos-duration="1000">Business performance</span>
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
                                        <span className={bIntro.majorClass}>Digital Twin</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Soulbrain Gongju Factory Integrated disaster prevention platform software</span>
                                            <span className={bIntro.majorListOrder}>S1</span>
                                            <span className={bIntro.majorListYear}>2021</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Digital Twin</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Sejong City Underground joint district smart management system</span>
                                            <span className={bIntro.majorListOrder}>NIA</span>
                                            <span className={bIntro.majorListYear}>2020</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Digital Twin</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Participation in NIPA 5G digital twin public leading project</span>
                                            <span className={bIntro.majorListOrder}>NIPA</span>
                                            <span className={bIntro.majorListYear}>2020</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Digital Twin</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Integrated disaster control system in NIPA 5G digital twin public leading project</span>
                                            <span className={bIntro.majorListOrder}>NIPA</span>
                                            <span className={bIntro.majorListYear}>2020</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Digital Twin</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Establishment of Integrated management system for safety response for local governments and defense multi- use building facilities using 5G digital twin</span>
                                            <span className={bIntro.majorListOrder}>NIPA</span>
                                            <span className={bIntro.majorListYear}>2020</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Digital Twin</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Digital twin-based underground tunnel intelligent anomaly detection and safety management service</span>
                                            <span className={bIntro.majorListOrder}>NIA</span>
                                            <span className={bIntro.majorListYear}>2020</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Shinhan Bank Jukjeon data center disaster management system</span>
                                            <span className={bIntro.majorListOrder}>S1</span>
                                            <span className={bIntro.majorListYear}>2019</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Chungnam National University e-Disaster system</span>
                                            <span className={bIntro.majorListOrder}>S1</span>
                                            <span className={bIntro.majorListYear}>2019</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of ICT-based disaster safety preparation on-site training system (advanced)</span>
                                            <span className={bIntro.majorListOrder}>KDHC</span>
                                            <span className={bIntro.majorListYear}>2019</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Yeouido Parc.1 Integrated disaster S/W part</span>
                                            <span className={bIntro.majorListOrder}>S1</span>
                                            <span className={bIntro.majorListYear}>2019</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Digital Twin</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Technology for providing immersive content convergence and mixed reality based on spatial information</span>
                                            <span className={bIntro.majorListOrder}>MOIS</span>
                                            <span className={bIntro.majorListYear}>2018</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Digital Twin</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development and demonstration of World-class low-cost and high- efficiency indoor spatial information core technology</span>
                                            <span className={bIntro.majorListOrder}>MOLIT</span>
                                            <span className={bIntro.majorListYear}>2017</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of 3D-based map training simulator</span>
                                            <span className={bIntro.majorListOrder}>MOTIE</span>
                                            <span className={bIntro.majorListYear}>2016</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of On-site training system for disaster safety preparedness for the energy industry</span>
                                            <span className={bIntro.majorListOrder}>MOTIE</span>
                                            <span className={bIntro.majorListYear}>2016</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Commercialization of IoT indoor air quality monitoring and platform technology for indoor environment service</span>
                                            <span className={bIntro.majorListOrder}>MOTIE</span>
                                            <span className={bIntro.majorListYear}>2016</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Safe-Guard service platform development for disaster response in national industrial complexes</span>
                                            <span className={bIntro.majorListOrder}>MOTIE</span>
                                            <span className={bIntro.majorListYear}>2014</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 파트너사 */}
                        <div id="sectionPartner">
                            <div className={bIntro.partnerContents}>
                                <span className={bIntro.partnerTitle} data-aos="fade-down" data-aos-duration="1000">Our Partners</span>
                                <div className={bIntro.clientArea}>
                                    <div className={bIntro.clientFirst}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo1}></span>
                                            <span className={bIntro.clientName}>MOLIT</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo2}></span>
                                            <span className={bIntro.clientName}>MOFA</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo3}></span>
                                            <span className={bIntro.clientName}>MOF</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo4}></span>
                                            <span className={bIntro.clientName}>Seoul Metropolitan City</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo5}></span>
                                            <span className={bIntro.clientName}>Incheon Metropolitan City</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo6}></span>
                                            <span className={bIntro.clientName}>Gyeongsangnama-do</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientSecond}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo7}></span>
                                            <span className={bIntro.clientName}>Sejong City</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo8}></span>
                                            <span className={bIntro.clientName}>Jeju City</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo9}></span>
                                            <span className={bIntro.clientName}>KPX</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo10}></span>
                                            <span className={bIntro.clientName}>KOEN</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo11}></span>
                                            <span className={bIntro.clientName}>KDHC</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo12}></span>
                                            <span className={bIntro.clientName}>UPA</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientThird}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo13}></span>
                                            <span className={bIntro.clientName}>Soulbrain</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo14}></span>
                                            <span className={bIntro.clientName}>GC Biopharma</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo15}></span>
                                            <span className={bIntro.clientName}>Suncheon Medical Center</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo16}></span>
                                            <span className={bIntro.clientName}>Parc.1</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo17}></span>
                                            <span className={bIntro.clientName}>Yeulmaru</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo18}></span>
                                            <span className={bIntro.clientName}>Anyang Gymnasium</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientFourth}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo19}></span>
                                            <span className={bIntro.clientName}>Seoul National Univ.</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo20}></span>
                                            <span className={bIntro.clientName}>Pusan National Univ.</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo21}></span>
                                            <span className={bIntro.clientName}>Chungnam National Univ.</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo22}></span>
                                            <span className={bIntro.clientName}>Shinhan Bank</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo23}></span>
                                            <span className={bIntro.clientName}>U - Planet</span>
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
                            <span className={bIntro.newsTitle} data-aos="fade-down" data-aos-duration="1000">Press Release</span>
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
            displayBusinessUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={bIntro.eIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">Our Business</span>
                            <span data-aos="fade-down" data-aos-duration="1000">Introduce U&E's business areas, major achievements, and partners.</span>
                        </div>
                        {/* 안전관리 */}
                        <div id="sectionSafety">
                            <div className={bIntro.safetyInforContentsSect2}>
                                <span className={bIntro.safetyTextBox}>
                                    <span className={bIntro.safetyManageTitle} data-aos="fade-down" data-aos-duration="1000">Safety Management Business</span>
                                    <div className={bIntro.safetyManageContents}>
                                        <div className={bIntro.safetyMText1}>
                                            {/* <span className={bIntro.safetyTextConts}>
                                                <span className={bIntro.safetyTexts1}>
                                                    <span className={bIntro.businessTextBold}>The core of continuous accident/disaster response,</span>such as fire, gas leakage, flooding, and earthquakes,<span className={bIntro.businessTextBold}>lies in speed and efficiency.</span>
                                                </span>
                                                <span className={bIntro.safetyTexts2}>
                                                    Therefore, it is important to<span className={bIntro.businessTextBlack}>integrate, collect, and analyze various sensors and CCTV information in real time,</span>
                                                    to<span className={bIntro.businessTextBlack}>visualize the current situation by combining with indoor and outdoor spatial information,</span>
                                                    and to<span className={bIntro.businessTextBlack}>share action tips and spread the situation through SOP</span>(standard operating procedures)<span className={bIntro.businessTextBlack}>for each type of disaster.</span>
                                                </span>
                                                <span className={bIntro.safetyTexts3}>
                                                    <span className={bIntro.businessTextBold}>We provides sustainable safety management services covering both consulting and solutions</span>based
                                                    on the understanding of indoor and outdoor spaces and accumulated capabilities of disaster safety technologies and business.
                                                </span>
                                            </span> */}

                                            <span className={bIntro.safetyTextConts}>
                                                <span className={bIntro.safetyTexts1}>
                                                    <span className={bIntro.businessTextBoldE}>The core of continuous accident/disaster response,</span>such as fire, gas leakage, flooding, and earthquakes,<span className={bIntro.businessTextBoldE}>lies in speed and efficiency.</span>
                                                </span>
                                                <span className={bIntro.safetyTexts2}>
                                                    Therefore, it is important to<span className={bIntro.businessTextBlack}>integrate, collect, and analyze various sensors and CCTV information in real time,</span>
                                                </span>
                                                <span className={bIntro.safetyTexts3}>
                                                    to<span className={bIntro.businessTextBlack}>visualize the current situation by combining with indoor and outdoor spatial information,</span>
                                                </span>
                                                <span className={bIntro.safetyTexts4}>
                                                    and to<span className={bIntro.businessTextBlack}>share action tips and spread the situation through SOP</span>(standard operating procedures)<span className={bIntro.businessTextBlack}>for each type of disaster.</span>
                                                </span>
                                                <span className={bIntro.safetyTexts5}>
                                                    <span className={bIntro.businessTextBoldE}>We provides sustainable safety management services covering both consulting and solutions</span>based
                                                </span>
                                                <span className={bIntro.safetyTexts6}>
                                                    on the understanding of indoor and outdoor spaces and accumulated capabilities of disaster safety technologies and business.
                                                </span>
                                            </span>
                                        </div>

                                        <div className={bIntro.safetyMText2}>
                                            <span className={bIntro.safetyTextConts2}>
                                                <div className={bIntro.sTarget1}>Safety Management Consulting</div>
                                                <div className={bIntro.sSubFlex1}>
                                                    {/* <span className={bIntro.sCheckIcon}></span> */}
                                                    <span className={bIntro.sSubTitle1}>
                                                        <p className={bIntro.sSubText1}><span className={bIntro.businessTextBold2}></span>Safety management consulting services</p>
                                                        <p className={bIntro.sSubText1}><span>that are</span><span className={bIntro.businessTextBold2} style={{ marginLeft: '8px' }}>practically helpful in disaster situations: </span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.sSubCont1}>
                                                    <p>- Development of crisis response manuals for each disaster</p>
                                                    <p style={{ marginLeft : '14px' }}>situation</p>
                                                    <p>- Risk assessment</p>
                                                    <p>- Establishment of safety-related policies and roadmaps</p>
                                                    <p>- Development of training scenarios</p>
                                                    <p>- Planning of civil defense policies</p>
                                                    <p>- Consulting related to the SERIOUS ACCIDENTS</p>
                                                    <p style={{ marginLeft : '14px' }}>PUNISHMENT ACT</p>
                                                </div>
                                            </span>
                                            <span className={bIntro.safetyTextConts3}>
                                                <div className={bIntro.sTarget2}>Smart Solutions</div>
                                                <div className={bIntro.sSubFlex2}>
                                                    {/* <span className={bIntro.sCheckIcon2}></span> */}
                                                    <span className={bIntro.sSubTitle2}>
                                                        <p>Smart safety management solutions<span className={bIntro.businessTextBold2}></span></p>
                                                        <p>that<span className={bIntro.businessTextBold2} style={{ marginLeft: '8px' }}>can respond to various types of disasters:</span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.sSubCont2}>
                                                    <p>- Smart disaster response system</p>
                                                    <p>- Smart disaster detection system</p>
                                                    <p>- Smart environment monitoring system</p>
                                                    <p>- Smart hazardous material management system</p>
                                                    <p>- Smart facility management system</p>
                                                    <p>- Smart worker safety management system</p>
                                                    <p></p>
                                                    <p></p>
                                                </div>
                                            </span>
                                        </div>
                                        <div className={bIntro.majorCases}>
                                            <span className={bIntro.majorCircle}></span>
                                            <span className={bIntro.majorTitle}>Major Case</span>
                                            <div className={bIntro.majorFlexPic}>
                                                <div className={bIntro.case1}>
                                                    <span className={bIntro.caseIcon1}></span>
                                                    <span className={bIntro.caseText1}>
                                                        <p>Korea South East Power</p>
                                                        <p>(2015)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case2}>
                                                    <span className={bIntro.caseIcon2}></span>
                                                    <span className={bIntro.caseText2}>
                                                        <p>Gyeongsangnama-do</p>
                                                        <p>(2020)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case3}>
                                                    <span className={bIntro.caseIcon2}></span>
                                                    <span className={bIntro.caseText3}>
                                                        <p>Gwangmyeong Urban Briggs</p>
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
                                    <span className={bIntro.digitalManageTitle} data-aos="fade-down" data-aos-duration="1000">Digital Twin Solutions Business</span>
                                    <div className={bIntro.digitalManageContents}>
                                        <div className={bIntro.digitalMText1}>
                                            {/* <span className={bIntro.digitalTextConts}>
                                                <span className={bIntro.digitalTexts1}>
                                                    Digital Twin is<span className={bIntro.businessTextBold}>a technology that equally implements real-world infrastructure in a virtual space</span>
                                                    such as buildings, facilities, sensor equipment, and work processes.
                                                </span>
                                                <span className={bIntro.digitalTexts2}>
                                                    Objects, systems and data in virtual space are<span className={bIntro.businessTextBlack}>connected to real-world in real time,</span>and can be monitored, controlled, and simulated.
                                                    <span className={bIntro.businessTextBlack}>This supports better decision-making and operation management in reality</span>without changing the actual facility.
                                                </span>
                                                <span className={bIntro.digitalTexts3}>
                                                    <span className={bIntro.businessTextBold}>We provides digital twin based application solutions that satisfy customer needs in various industries</span>
                                                    through our indoor and outdoor space construction technology, legacy system and IoT integration,
                                                    and real-time monitoring and simulation based on Bigdata and AI technology.
                                                </span>
                                            </span> */}

                                            <span className={bIntro.digitalTextConts}>
                                                <span className={bIntro.digitalTexts1E}>
                                                    Digital Twin is<span className={bIntro.businessTextBoldE}>a technology that equally implements real-world infrastructure in a virtual space</span>
                                                </span>
                                                <span className={bIntro.digitalTexts2E}>
                                                    such as buildings, facilities, sensor equipment, and work processes.
                                                </span>
                                                <span className={bIntro.digitalTexts3E}>
                                                    Objects, systems and data in virtual space are<span className={bIntro.businessTextBlack}>connected to real-world in real time,</span>and can be monitored, controlled, and simulated.
                                                </span>
                                                <span className={bIntro.digitalTexts4E}>
                                                    <span className={bIntro.businessTextBlack}>This supports better decision-making and operation management in reality</span>without changing the actual facility.
                                                </span>
                                                <span className={bIntro.digitalTexts5}>
                                                    <span className={bIntro.businessTextBoldE}>We provides digital twin based application solutions that satisfy customer needs in various industries</span>
                                                </span>
                                                <span className={bIntro.digitalTexts6}>
                                                    through our indoor and outdoor space construction technology, legacy system and IoT integration,
                                                </span>
                                                <span className={bIntro.digitalTexts7}>
                                                    and real-time monitoring and simulation based on Bigdata and AI technology.
                                                </span>
                                            </span>
                                        </div>

                                        <div className={bIntro.digitalMText2}>
                                            <span className={bIntro.digitalTextConts2}>
                                                <div className={bIntro.dTarget1}>Spatial Information Construction</div>
                                                <div className={bIntro.dSubFlex1}>
                                                    {/* <span className={bIntro.dCheckIcon}></span> */}
                                                    <span className={bIntro.dSubTitle1}>
                                                        <p><span className={bIntro.businessTextBold3}></span><span style={{ marginRight: '8px' }}>Construction of</span><span className={bIntro.businessTextBold3}>lightweight</span></p>
                                                        <p><span className={bIntro.businessTextBold3}>and high- quality</span></p>
                                                        <p><span>spatial information</span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont1}>
                                                    <p>- Informatization of the space where</p>
                                                    <p>people stay (buildings, facilities, ships,  aircraft, etc.)</p>
                                                    <p /* style={{ marginLeft: '14px' }}*/ ><span /* style={{ paddingLeft: '14px' }}*/ ></span></p>
                                                    <p>- High quality outdoor space modeling</p>
                                                    <p style={{ marginLeft: '14px' }}>with LOD 4 or higher</p>
                                                    <p>- 1/10th lighter than traditional BIM</p>

                                                </div>
                                            </span>
                                            <span className={bIntro.digitalTextConts3}>
                                                <div className={bIntro.dTarget2}>Data Visualization</div>
                                                <div className={bIntro.dSubFlex2}>
                                                    {/* <span className={bIntro.dCheckIcon2}></span> */}
                                                    <span className={bIntro.dSubTitle2}>
                                                        <p>Integration of</p>
                                                        <p><span className={bIntro.businessTextBold3}>legacy systems</span></p>
                                                        <p><span style={{ display: 'inline-block', marginRight: '8px' }}>and various</span><span className={bIntro.businessTextBold2}>IoT sensors</span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont2}>
                                                    <p>- Integration of systems in various</p>
                                                    <p>industries(logistics, manufacturing,</p>
                                                    <p>aviation, marine, construction, etc.)</p>
                                                    <p>- Connecting and stabilizing CCTV with</p>
                                                    <p><span style={{ display: 'inline-block', marginLeft: '14px' }}>existing sensors</span></p>
                                                </div>
                                            </span>
                                            <span className={bIntro.digitalTextConts4}>
                                                <div className={bIntro.dTarget3}>System Integration</div>
                                                <div className={bIntro.dSubFlex3}>
                                                    {/* <span className={bIntro.dCheckIcon3}></span> */}
                                                    <span className={bIntro.dSubTitle3}>
                                                        <p><span className={bIntro.businessTextBold3}></span>Provides data visualization</p>
                                                        <p><span>and monitoring</span></p>
                                                        <p><span className={bIntro.businessTextBold2}>based on the latest ICT</span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont3}>
                                                    <p>- Collecting and visualizing system and</p>
                                                    <p style={{ marginLeft: '14px' }}>sensor information</p>
                                                    <p>- Real-time monitoring of system and</p>
                                                    <p style={{ marginLeft: '14px' }}>sensor information</p>
                                                    <p>- Visualization and Analysis of Data </p>
                                                    <p style={{ marginLeft: '14px' }}>Based on 3D Spatial Information</p>
                                                </div>
                                            </span>
                                        </div>
                                        <div className={bIntro.majorCasesD}>
                                            <span className={bIntro.majorCircleD}></span>
                                            <span className={bIntro.majorTitleD}>Major Case</span>
                                            <div className={bIntro.majorFlexBoxD}>
                                                <div className={bIntro.case3}>
                                                    <span className={bIntro.caseIcon3}></span>
                                                    <span className={bIntro.caseText3}>
                                                        <p>Yeouido Park One</p>
                                                        <p>(2020)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case4}>
                                                    <span className={bIntro.caseIcon4}></span>
                                                    <span className={bIntro.caseText4}>
                                                        <p>GC Biopharma</p>
                                                        <p>(2021)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case5}>
                                                    <span className={bIntro.caseIcon5}></span>
                                                    <span className={bIntro.caseText5}>
                                                        <p>Soulbrain</p>
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
                                <span className={bIntro.majorPerformanceTitleS} data-aos="fade-down" data-aos-duration="1000">Business performance</span>
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
                                        <span className={bIntro.majorClass}>Digital Twin</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Soulbrain Gongju Factory Integrated disaster prevention platform software</span>
                                            <span className={bIntro.majorListOrder}>S1</span>
                                            <span className={bIntro.majorListYear}>2021</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Digital Twin</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Sejong City Underground joint district smart management system</span>
                                            <span className={bIntro.majorListOrder}>NIA</span>
                                            <span className={bIntro.majorListYear}>2020</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Digital Twin</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Participation in NIPA 5G digital twin public leading project</span>
                                            <span className={bIntro.majorListOrder}>NIPA</span>
                                            <span className={bIntro.majorListYear}>2020</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Digital Twin</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Integrated disaster control system in NIPA 5G digital twin public leading project</span>
                                            <span className={bIntro.majorListOrder}>NIPA</span>
                                            <span className={bIntro.majorListYear}>2020</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Digital Twin</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Establishment of Integrated management system for safety response for local governments and defense multi- use building facilities using 5G digital twin</span>
                                            <span className={bIntro.majorListOrder}>NIPA</span>
                                            <span className={bIntro.majorListYear}>2020</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Digital Twin</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Digital twin-based underground tunnel intelligent anomaly detection and safety management service</span>
                                            <span className={bIntro.majorListOrder}>NIA</span>
                                            <span className={bIntro.majorListYear}>2020</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Shinhan Bank Jukjeon data center disaster management system</span>
                                            <span className={bIntro.majorListOrder}>S1</span>
                                            <span className={bIntro.majorListYear}>2019</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Chungnam National University e-Disaster system</span>
                                            <span className={bIntro.majorListOrder}>S1</span>
                                            <span className={bIntro.majorListYear}>2019</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of ICT-based disaster safety preparation on-site training system (advanced)</span>
                                            <span className={bIntro.majorListOrder}>KDHC</span>
                                            <span className={bIntro.majorListYear}>2019</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Yeouido Parc.1 Integrated disaster S/W part</span>
                                            <span className={bIntro.majorListOrder}>S1</span>
                                            <span className={bIntro.majorListYear}>2019</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Digital Twin</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Technology for providing immersive content convergence and mixed reality based on spatial information</span>
                                            <span className={bIntro.majorListOrder}>MOIS</span>
                                            <span className={bIntro.majorListYear}>2018</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Digital Twin</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development and demonstration of World-class low-cost and high- efficiency indoor spatial information core technology</span>
                                            <span className={bIntro.majorListOrder}>MOLIT</span>
                                            <span className={bIntro.majorListYear}>2017</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of 3D-based map training simulator</span>
                                            <span className={bIntro.majorListOrder}>MOTIE</span>
                                            <span className={bIntro.majorListYear}>2016</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of On-site training system for disaster safety preparedness for the energy industry</span>
                                            <span className={bIntro.majorListOrder}>MOTIE</span>
                                            <span className={bIntro.majorListYear}>2016</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Commercialization of IoT indoor air quality monitoring and platform technology for indoor environment service</span>
                                            <span className={bIntro.majorListOrder}>MOTIE</span>
                                            <span className={bIntro.majorListYear}>2016</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Safe-Guard service platform development for disaster response in national industrial complexes</span>
                                            <span className={bIntro.majorListOrder}>MOTIE</span>
                                            <span className={bIntro.majorListYear}>2014</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 파트너사 */}
                        <div id="sectionPartner">
                            <div className={bIntro.partnerContents}>
                                <span className={bIntro.partnerTitle} data-aos="fade-down" data-aos-duration="1000">Our Partners</span>
                                <div className={bIntro.clientArea}>
                                    <div className={bIntro.clientFirst}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo1}></span>
                                            <span className={bIntro.clientName}>MOLIT</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo2}></span>
                                            <span className={bIntro.clientName}>MOFA</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo3}></span>
                                            <span className={bIntro.clientName}>MOF</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo4}></span>
                                            <span className={bIntro.clientName}>Seoul Metropolitan City</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo5}></span>
                                            <span className={bIntro.clientName}>Incheon Metropolitan City</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo6}></span>
                                            <span className={bIntro.clientName}>Gyeongsangnama-do</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientSecond}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo7}></span>
                                            <span className={bIntro.clientName}>Sejong City</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo8}></span>
                                            <span className={bIntro.clientName}>Jeju City</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo9}></span>
                                            <span className={bIntro.clientName}>KPX</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo10}></span>
                                            <span className={bIntro.clientName}>KOEN</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo11}></span>
                                            <span className={bIntro.clientName}>KDHC</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo12}></span>
                                            <span className={bIntro.clientName}>UPA</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientThird}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo13}></span>
                                            <span className={bIntro.clientName}>Soulbrain</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo14}></span>
                                            <span className={bIntro.clientName}>GC Biopharma</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo15}></span>
                                            <span className={bIntro.clientName}>Suncheon Medical Center</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo16}></span>
                                            <span className={bIntro.clientName}>Parc.1</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo17}></span>
                                            <span className={bIntro.clientName}>Yeulmaru</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo18}></span>
                                            <span className={bIntro.clientName}>Anyang Gymnasium</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientFourth}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo19}></span>
                                            <span className={bIntro.clientName}>Seoul National Univ.</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo20}></span>
                                            <span className={bIntro.clientName}>Pusan National Univ.</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo21}></span>
                                            <span className={bIntro.clientName}>Chungnam National Univ.</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo22}></span>
                                            <span className={bIntro.clientName}>Shinhan Bank</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo23}></span>
                                            <span className={bIntro.clientName}>U - Planet</span>
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
                            <span className={bIntro.newsTitle} data-aos="fade-down" data-aos-duration="1000">Press Release</span>
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
            displayBusinessUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={bIntro.eIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">Our Business</span>
                            <span data-aos="fade-down" data-aos-duration="1000">Introduce U&E's business areas, major achievements, and partners.</span>
                        </div>
                        {/* 안전관리 */}
                        <div id="sectionSafety">
                            <div className={bIntro.safetyInforContentsSect2}>
                                <span className={bIntro.safetyTextBox}>
                                    <span className={bIntro.safetyManageTitle} data-aos="fade-down" data-aos-duration="1000">Safety Management Business</span>
                                    <div className={bIntro.safetyManageContents}>
                                        <div className={bIntro.safetyMText1}>
                                            {/* <span className={bIntro.safetyTextConts}>
                                                <span className={bIntro.safetyTexts1}>
                                                    <span className={bIntro.businessTextBoldE}>The core of continuous accident/disaster response,</span>such as fire, gas leakage, flooding, and earthquakes,<span className={bIntro.businessTextBoldE}>lies in speed and efficiency.</span>
                                                </span>
                                                <span className={bIntro.safetyTexts2}>
                                                    Therefore, it is important to<span className={bIntro.businessTextBlackE}>integrate, collect, and analyze various sensors and CCTV information in real time,</span>
                                                    to<span className={bIntro.businessTextBlackE}>visualize the current situation by combining with indoor and outdoor spatial information,</span>
                                                    and to<span className={bIntro.businessTextBlackE}>share action tips and spread the situation through SOP</span>(standard operating procedures)<span className={bIntro.businessTextBlackE}>for each type of disaster.</span>
                                                </span>
                                                <span className={bIntro.safetyTexts3}>
                                                    <span className={bIntro.businessTextBoldE}>We provides sustainable safety management services covering both consulting and solutions</span>based
                                                    on the understanding of indoor and outdoor spaces and accumulated capabilities of disaster safety technologies and business.
                                                </span>
                                            </span> */}

                                            <span className={bIntro.safetyTextConts}>
                                                <span className={bIntro.safetyTexts1}>
                                                    <span className={bIntro.businessTextBoldE}>The core of continuous accident/disaster response,</span>such as fire, gas leakage, flooding, and earthquakes,<span className={bIntro.businessTextBoldE}>lies in speed and efficiency.</span>
                                                </span>
                                                <span className={bIntro.safetyTexts2}>
                                                    Therefore, it is important to<span className={bIntro.businessTextBlack}>integrate, collect, and analyze various sensors and CCTV information in real time,</span>
                                                </span>
                                                <span className={bIntro.safetyTexts3}>
                                                    to<span className={bIntro.businessTextBlack}>visualize the current situation by combining with indoor and outdoor spatial information,</span>
                                                </span>
                                                <span className={bIntro.safetyTexts4}>
                                                    and to<span className={bIntro.businessTextBlack}>share action tips and spread the situation through SOP</span>(standard operating procedures)<span className={bIntro.businessTextBlack}>for each type of disaster.</span>
                                                </span>
                                                <span className={bIntro.safetyTexts5}>
                                                    <span className={bIntro.businessTextBoldE}>We provides sustainable safety management services covering both consulting and solutions</span>based
                                                </span>
                                                <span className={bIntro.safetyTexts6}>
                                                    on the understanding of indoor and outdoor spaces and accumulated capabilities of disaster safety technologies and business.
                                                </span>
                                            </span>
                                        </div>

                                        <div className={bIntro.safetyMText2}>
                                            <span className={bIntro.safetyTextConts2}>
                                                <div className={bIntro.sTarget1}>Safety Management Consulting</div>
                                                <div className={bIntro.sSubFlex1}>
                                                    {/* <span className={bIntro.sCheckIcon}></span> */}
                                                    <span className={bIntro.sSubTitle1}>
                                                        <p className={bIntro.sSubText1}><span className={bIntro.businessTextBold2}></span>Safety management consulting services</p>
                                                        <p className={bIntro.sSubText1}><span>that are</span><span className={bIntro.businessTextBold2} style={{ marginLeft: '8px' }}>practically helpful in disaster situations: </span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.sSubCont1}>
                                                    <p>- Development of crisis response manuals for each disaster</p>
                                                    <p style={{ marginLeft : '14px' }}>situation</p>
                                                    <p>- Risk assessment</p>
                                                    <p>- Establishment of safety-related policies and roadmaps</p>
                                                    <p>- Development of training scenarios</p>
                                                    <p>- Planning of civil defense policies</p>
                                                    <p>- Consulting related to the SERIOUS ACCIDENTS</p>
                                                    <p style={{ marginLeft : '14px' }}>PUNISHMENT ACT</p>
                                                </div>
                                            </span>
                                            <span className={bIntro.safetyTextConts3}>
                                                <div className={bIntro.sTarget2}>Smart Solutions</div>
                                                <div className={bIntro.sSubFlex2}>
                                                    {/* <span className={bIntro.sCheckIcon2}></span> */}
                                                    <span className={bIntro.sSubTitle2}>
                                                        <p>Smart safety management solutions<span className={bIntro.businessTextBold2}></span></p>
                                                        <p>that<span className={bIntro.businessTextBold2} style={{ marginLeft: '8px' }}>can respond to various types of disasters:</span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.sSubCont2}>
                                                    <p>- Smart disaster response system</p>
                                                    <p>- Smart disaster detection system</p>
                                                    <p>- Smart environment monitoring system</p>
                                                    <p>- Smart hazardous material management system</p>
                                                    <p>- Smart facility management system</p>
                                                    <p>- Smart worker safety management system</p>
                                                    <p></p>
                                                    <p></p>
                                                </div>
                                            </span>
                                        </div>
                                        <div className={bIntro.majorCases}>
                                            <span className={bIntro.majorCircle}></span>
                                            <span className={bIntro.majorTitle}>Major Case</span>
                                            <div className={bIntro.majorFlexPic}>
                                                <div className={bIntro.case1}>
                                                    <span className={bIntro.caseIcon1}></span>
                                                    <span className={bIntro.caseText1}>
                                                        <p>Korea South East Power</p>
                                                        <p>(2015)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case2}>
                                                    <span className={bIntro.caseIcon2}></span>
                                                    <span className={bIntro.caseText2}>
                                                        <p>Gyeongsangnama-do</p>
                                                        <p>(2020)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case3}>
                                                    <span className={bIntro.caseIcon2}></span>
                                                    <span className={bIntro.caseText3}>
                                                        <p>Gwangmyeong Urban Briggs</p>
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
                                    <span className={bIntro.digitalManageTitle} data-aos="fade-down" data-aos-duration="1000">Digital Twin Solutions Business</span>
                                    <div className={bIntro.digitalManageContents}>
                                        <div className={bIntro.digitalMText1}>
                                            <span className={bIntro.digitalTextConts}>
                                                <span className={bIntro.digitalTexts1E}>
                                                    Digital Twin is<span className={bIntro.businessTextBoldE}>a technology that equally implements real-world infrastructure in a virtual space</span>
                                                </span>
                                                <span className={bIntro.digitalTexts2E}>
                                                    such as buildings, facilities, sensor equipment, and work processes.
                                                </span>
                                                <span className={bIntro.digitalTexts3E}>
                                                    Objects, systems and data in virtual space are<span className={bIntro.businessTextBlack}>connected to real-world in real time,</span>and can be monitored, controlled, and simulated.
                                                </span>
                                                <span className={bIntro.digitalTexts4E}>
                                                    <span className={bIntro.businessTextBlack}>This supports better decision-making and operation management in reality</span>without changing the actual facility.
                                                </span>
                                                <span className={bIntro.digitalTexts5}>
                                                    <span className={bIntro.businessTextBoldE}>We provides digital twin based application solutions that satisfy customer needs in various industries</span>
                                                </span>
                                                <span className={bIntro.digitalTexts6}>
                                                    through our indoor and outdoor space construction technology, legacy system and IoT integration,
                                                </span>
                                                <span className={bIntro.digitalTexts7}>
                                                    and real-time monitoring and simulation based on Bigdata and AI technology.
                                                </span>
                                            </span>
                                        </div>

                                        <div className={bIntro.digitalMText2}>
                                            <span className={bIntro.digitalTextConts2}>
                                                <div className={bIntro.dTarget1}>Spatial Information Construction</div>
                                                <div className={bIntro.dSubFlex1}>
                                                    {/* <span className={bIntro.dCheckIcon}></span> */}
                                                    <span className={bIntro.dSubTitle1}>
                                                        <p><span className={bIntro.businessTextBold3}></span><span style={{ marginRight: '8px' }}>Construction of</span><span className={bIntro.businessTextBold3}>lightweight</span></p>
                                                        <p><span className={bIntro.businessTextBold3}>and high- quality</span></p>
                                                        <p><span>spatial information</span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont1}>
                                                    <p>- Informatization of the space where</p>
                                                    <p>people stay (buildings, facilities, ships,  aircraft, etc.)</p>
                                                    <p /* style={{ marginLeft: '14px' }}*/ ><span /* style={{ paddingLeft: '14px' }}*/ ></span></p>
                                                    <p>- High quality outdoor space modeling</p>
                                                    <p style={{ marginLeft: '14px' }}>with LOD 4 or higher</p>
                                                    <p>- 1/10th lighter than traditional BIM</p>

                                                </div>
                                            </span>
                                            <span className={bIntro.digitalTextConts3}>
                                                <div className={bIntro.dTarget2}>Data Visualization</div>
                                                <div className={bIntro.dSubFlex2}>
                                                    {/* <span className={bIntro.dCheckIcon2}></span> */}
                                                    <span className={bIntro.dSubTitle2}>
                                                        <p>Integration of</p>
                                                        <p><span className={bIntro.businessTextBold3}>legacy systems</span></p>
                                                        <p><span style={{ display: 'inline-block', marginRight: '8px' }}>and various</span><span className={bIntro.businessTextBold2}>IoT sensors</span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont2}>
                                                    <p>- Integration of systems in various</p>
                                                    <p>industries(logistics, manufacturing,</p>
                                                    <p>aviation, marine, construction, etc.)</p>
                                                    <p>- Connecting and stabilizing CCTV with</p>
                                                    <p><span style={{ display: 'inline-block', marginLeft: '14px' }}>existing sensors</span></p>
                                                </div>
                                            </span>
                                            <span className={bIntro.digitalTextConts4}>
                                                <div className={bIntro.dTarget3}>System Integration</div>
                                                <div className={bIntro.dSubFlex3}>
                                                    {/* <span className={bIntro.dCheckIcon3}></span> */}
                                                    <span className={bIntro.dSubTitle3}>
                                                        <p><span className={bIntro.businessTextBold3}></span>Provides data visualization</p>
                                                        <p><span>and monitoring</span></p>
                                                        <p><span className={bIntro.businessTextBold2}>based on the latest ICT</span></p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.dSubCont3}>
                                                    <p>- Collecting and visualizing system and</p>
                                                    <p style={{ marginLeft: '14px' }}>sensor information</p>
                                                    <p>- Real-time monitoring of system and</p>
                                                    <p style={{ marginLeft: '14px' }}>sensor information</p>
                                                    <p>- Visualization and Analysis of Data </p>
                                                    <p style={{ marginLeft: '14px' }}>Based on 3D Spatial Information</p>
                                                </div>
                                            </span>
                                        </div>
                                        <div className={bIntro.majorCasesD}>
                                            <span className={bIntro.majorCircleD}></span>
                                            <span className={bIntro.majorTitleD}>Major Case</span>
                                            <div className={bIntro.majorFlexBoxD}>
                                                <div className={bIntro.case3}>
                                                    <span className={bIntro.caseIcon3}></span>
                                                    <span className={bIntro.caseText3}>
                                                        <p>Yeouido Park One</p>
                                                        <p>(2020)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case4}>
                                                    <span className={bIntro.caseIcon4}></span>
                                                    <span className={bIntro.caseText4}>
                                                        <p>GC Biopharma</p>
                                                        <p>(2021)</p>
                                                    </span>
                                                </div>
                                                <div className={bIntro.case5}>
                                                    <span className={bIntro.caseIcon5}></span>
                                                    <span className={bIntro.caseText5}>
                                                        <p>Soulbrain</p>
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
                                <span className={bIntro.majorPerformanceTitleS} data-aos="fade-down" data-aos-duration="1000">Business performance</span>
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
                                        <span className={bIntro.majorClass}>Digital Twin</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Soulbrain Gongju Factory Integrated disaster prevention platform software</span>
                                            <span className={bIntro.majorListOrder}>S1</span>
                                            <span className={bIntro.majorListYear}>2021</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Digital Twin</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Sejong City Underground joint district smart management system</span>
                                            <span className={bIntro.majorListOrder}>NIA</span>
                                            <span className={bIntro.majorListYear}>2020</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Digital Twin</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Participation in NIPA 5G digital twin public leading project</span>
                                            <span className={bIntro.majorListOrder}>NIPA</span>
                                            <span className={bIntro.majorListYear}>2020</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Digital Twin</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Integrated disaster control system in NIPA 5G digital twin public leading project</span>
                                            <span className={bIntro.majorListOrder}>NIPA</span>
                                            <span className={bIntro.majorListYear}>2020</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Digital Twin</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Establishment of Integrated management system for safety response for local governments and defense multi- use building facilities using 5G digital twin</span>
                                            <span className={bIntro.majorListOrder}>NIPA</span>
                                            <span className={bIntro.majorListYear}>2020</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Digital Twin</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Digital twin-based underground tunnel intelligent anomaly detection and safety management service</span>
                                            <span className={bIntro.majorListOrder}>NIA</span>
                                            <span className={bIntro.majorListYear}>2020</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Shinhan Bank Jukjeon data center disaster management system</span>
                                            <span className={bIntro.majorListOrder}>S1</span>
                                            <span className={bIntro.majorListYear}>2019</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Chungnam National University e-Disaster system</span>
                                            <span className={bIntro.majorListOrder}>S1</span>
                                            <span className={bIntro.majorListYear}>2019</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of ICT-based disaster safety preparation on-site training system (advanced)</span>
                                            <span className={bIntro.majorListOrder}>KDHC</span>
                                            <span className={bIntro.majorListYear}>2019</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Yeouido Parc.1 Integrated disaster S/W part</span>
                                            <span className={bIntro.majorListOrder}>S1</span>
                                            <span className={bIntro.majorListYear}>2019</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Digital Twin</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Technology for providing immersive content convergence and mixed reality based on spatial information</span>
                                            <span className={bIntro.majorListOrder}>MOIS</span>
                                            <span className={bIntro.majorListYear}>2018</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Digital Twin</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development and demonstration of World-class low-cost and high- efficiency indoor spatial information core technology</span>
                                            <span className={bIntro.majorListOrder}>MOLIT</span>
                                            <span className={bIntro.majorListYear}>2017</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of 3D-based map training simulator</span>
                                            <span className={bIntro.majorListOrder}>MOTIE</span>
                                            <span className={bIntro.majorListYear}>2016</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of On-site training system for disaster safety preparedness for the energy industry</span>
                                            <span className={bIntro.majorListOrder}>MOTIE</span>
                                            <span className={bIntro.majorListYear}>2016</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Commercialization of IoT indoor air quality monitoring and platform technology for indoor environment service</span>
                                            <span className={bIntro.majorListOrder}>MOTIE</span>
                                            <span className={bIntro.majorListYear}>2016</span>
                                        </div>
                                    </div>
                                    <div className={bIntro.majorBox}>
                                        <span className={bIntro.majorClass}>Safety Mgmt.</span>
                                        <div className={bIntro.majorFlexBoxM}>
                                            <span className={bIntro.majorListTitle}>Development of Safe-Guard service platform development for disaster response in national industrial complexes</span>
                                            <span className={bIntro.majorListOrder}>MOTIE</span>
                                            <span className={bIntro.majorListYear}>2014</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 파트너사 */}
                        <div id="sectionPartner">
                            <div className={bIntro.partnerContents}>
                                <span className={bIntro.partnerTitle} data-aos="fade-down" data-aos-duration="1000">Our Partners</span>
                                <div className={bIntro.clientArea}>
                                    <div className={bIntro.clientFirst}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo1}></span>
                                            <span className={bIntro.clientName}>MOLIT</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo2}></span>
                                            <span className={bIntro.clientName}>MOFA</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo3}></span>
                                            <span className={bIntro.clientName}>MOF</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo4}></span>
                                            <span className={bIntro.clientName}>Seoul Metropolitan City</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo5}></span>
                                            <span className={bIntro.clientName}>Incheon Metropolitan City</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo6}></span>
                                            <span className={bIntro.clientName}>Gyeongsangnama-do</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientSecond}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo7}></span>
                                            <span className={bIntro.clientName}>Sejong City</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo8}></span>
                                            <span className={bIntro.clientName}>Jeju City</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo9}></span>
                                            <span className={bIntro.clientName}>KPX</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo10}></span>
                                            <span className={bIntro.clientName}>KOEN</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo11}></span>
                                            <span className={bIntro.clientName}>KDHC</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo12}></span>
                                            <span className={bIntro.clientName}>UPA</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientThird}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo13}></span>
                                            <span className={bIntro.clientName}>Soulbrain</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo14}></span>
                                            <span className={bIntro.clientName}>GC Biopharma</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo15}></span>
                                            <span className={bIntro.clientName}>Suncheon Medical Center</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo16}></span>
                                            <span className={bIntro.clientName}>Parc.1</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo17}></span>
                                            <span className={bIntro.clientName}>Yeulmaru</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo18}></span>
                                            <span className={bIntro.clientName}>Anyang Gymnasium</span>
                                        </span>
                                    </div>
                                    <div className={bIntro.clientFourth}>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo19}></span>
                                            <span className={bIntro.clientName}>Seoul National Univ.</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo20}></span>
                                            <span className={bIntro.clientName}>Pusan National Univ.</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo21}></span>
                                            <span className={bIntro.clientName}>Chungnam National Univ.</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo22}></span>
                                            <span className={bIntro.clientName}>Shinhan Bank</span>
                                        </span>
                                        <span className={bIntro.clientContents}>
                                            <span className={bIntro.clientLogo23}></span>
                                            <span className={bIntro.clientName}>U - Planet</span>
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
                            <span className={bIntro.newsTitle} data-aos="fade-down" data-aos-duration="1000">Press Release</span>
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
            displayBusinessUI.push(
                <></>
            );
        }
        return displayBusinessUI;
    }



    render() {
        /* const newsUI = this.displayNewsUI();
        const pageIndexUI = this.getPageIndexUI(); */

        setTimeout(() => { this.resizeUI() }, 500);
        let displayBusinessUI = this.state.disBusinessUI;

        return (
            <>
                {displayBusinessUI}
            </>
        );
    }
}

export default BusinessSectionEng;