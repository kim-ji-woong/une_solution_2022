import React, { Component } from 'react';
import { Link } from "react-router-dom";
import cIntro from '../CompanyIntro/css/company.module.css';
import bIntro from '../BusinessIntro/css/business.module.css';
import home from '../components/css/home.module.css';
import $ from 'jquery';

import AOS from "aos";
import "aos/dist/aos.css";
import Resource from '../resource/id';


class PerformanceSectionEng extends Component {
    static displayName = PerformanceSectionEng.name;

    constructor(props) {
        super(props);

        this.state = {

        }

        this.state.disPerformanceUI = this.displayPerformanceUI;
    }

    resizeUI() {
        this.setState({ disPerformanceUI : this.displayPerformanceUI() });
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
                            <span data-aos="fade-down" data-aos-duration="1000">Our Technology</span>
                            <span data-aos="fade-down" data-aos-duration="1000">Introduce U&E's safety management and digital twin technology capabilities, related patents and certifications.</span>
                        </div>
                        {/* 공간정보 구축 */}
                        <div id="sectionInforBuild">
                            <div className={bIntro.spatialInforContentsSect}>
                                <span className={bIntro.spatialTitle2} data-aos="fade-down" data-aos-duration="1000">Spatial Information Construction</span>
                                <div className={bIntro.spatialTextBoxTop}>
                                    <span className={bIntro.spatialTexts1}>
                                        <span className={bIntro.businessTextBoldE}>It builds and manages optimal indoor and outdoor spatial information</span>
                                        that operates smoothly in web and C/ S environments.
                                    </span>
                                    <span className={bIntro.spatialTexts2}>
                                        Through the IndoorGML-based data structure, it is easy to link legacy systems and sensors, expand services, and visualize
                                        <span className={bIntro.businessTextBold}>high-quality feature information above LoD 4 criteria in 3D space.</span>
                                    </span>
                                </div>
                                <div className={bIntro.spatialFlexBox}>
                                    <span className={bIntro.spatialImgBox}>
                                        <span className={bIntro.spatialInforImg}></span>
                                    </span>
                                    <span className={bIntro.spatialTextBox}>
                                        <div className={bIntro.spTarget1}>Checkpoint</div>
                                        <div className={bIntro.spSubFlex1}>
                                            <span className={bIntro.spCheckIcon}></span>
                                            <span className={bIntro.spSubTitle1}>
                                                <p>Modeling Interior Space Using 2D Drawings and Images</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.spSubFlex2}>
                                            <span className={bIntro.spCheckIcon2}></span>
                                            <span className={bIntro.spSubTitle2}>
                                                <p>Using 2D Drawings and Images Google Sketch- up</p>
                                                <p>and topology- based international standard</p>
                                                <p>spatial information modeling</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.spSubFlex3}>
                                            <span className={bIntro.spCheckIcon3}></span>
                                            <span className={bIntro.spSubTitle3}>
                                                <p>Building Lightweight</p>
                                                <p>Interior Modeling</p>
                                                <p></p>
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
                                        It is used for<span className={bIntro.businessTextBoldE}>IT-based disaster response by digitizing existing standard action procedures</span>in the form of books and manuals.
                                    </span>
                                    <span className={bIntro.eSopTexts2}>
                                        Along with the response to training by disaster type, the<span className={bIntro.businessTextBoldE}>step-by-step action tips</span>are guided in the event of an actual situation,
                                        and provides situation transmission through emergency contact networks to enable<span className={bIntro.businessTextBoldE}>quick and efficient disaster response</span>
                                    </span>
                                </div>
                                <div className={bIntro.eSopFlexBox}>
                                    <span className={bIntro.eSopImgBox}>
                                        <span className={bIntro.eSopImg}></span>
                                    </span>
                                    <span className={bIntro.eSopTextBox}>
                                        <div className={bIntro.eSopTarget1}>Checkpoint</div>
                                        <div className={bIntro.eSopSubFlex1}>
                                            <span className={bIntro.eSopCheckIcon}></span>
                                            <span className={bIntro.eSopSubTitle1}>
                                                <p>Create and edit SOPs with GUI-based SW and</p>
                                                <p>save them as database</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.eSopSubFlex2}>
                                            <span className={bIntro.eSopCheckIcon2}></span>
                                            <span className={bIntro.eSopSubTitle2}>
                                                <p>Simulated training through digitalized SOPs</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.eSopSubFlex3}>
                                            <span className={bIntro.eSopCheckIcon3}></span>
                                            <span className={bIntro.eSopSubTitle3}>
                                                <p>Organizational management and transmission of situations through text messages etc for emergency contact</p>
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
                                <span className={bIntro.dataTitle2} data-aos="fade-down" data-aos-duration="1000">Data Visualization</span>
                                <div className={bIntro.dataTextBoxTop}>
                                    <span className={bIntro.dataTexts1}>
                                        Various types of<span className={bIntro.businessTextBoldE}>data with spatial information to visualize and monitor.</span>
                                    </span>
                                    <span className={bIntro.dataTexts2}>
                                        <span className={bIntro.businessTextBoldE}>Business and user information</span>stored in the system, <span className={bIntro.businessTextBoldE}>real- time monitoring information</span>collected from IoT sensors,
                                        <span className={bIntro.businessTextBoldE}>Analysis/prediction information derived</span>from AI/ big data technology<span className={bIntro.businessTextBoldE}>is visualized by combining spatial information</span>
                                        And<span className={bIntro.businessTextBoldE}>expressed in various ways</span>such as tables/table and event streams.
                                    </span>
                                </div>
                                <div className={bIntro.dataFlexBox}>
                                    <span className={bIntro.dataImgBox}>
                                        <span className={bIntro.dataImg}></span>
                                    </span>
                                    <span className={bIntro.dataTextBox}>
                                        <div className={bIntro.dataTarget1}>Checkpoint</div>
                                        <div className={bIntro.dataSubFlex1}>
                                            <span className={bIntro.dataCheckIcon}></span>
                                            <span className={bIntro.dataSubTitle1}>
                                                <p>Visualize business and user information stored in DBMS, files, Log</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.dataSubFlex2}>
                                            <span className={bIntro.dataCheckIcon2}></span>
                                            <span className={bIntro.dataSubTitle2}>
                                                <p>Visualize real-time event stream information collected from IoT sensors</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.dataSubFlex3}>
                                            <span className={bIntro.dataCheckIcon3}></span>
                                            <span className={bIntro.dataSubTitle3}>
                                                <p>Combine with 3D space to visualize real-time events and historical history</p>
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
                                <span className={bIntro.systemTitle2} data-aos="fade-down" data-aos-duration="1000">System Integration</span>
                                <div className={bIntro.systemTextBoxTop}>
                                    <span className={bIntro.systemTexts1}>
                                        It<span className={bIntro.businessTextBoldE}>connects and integrates systems, sensors, and data</span>used in various industries.
                                    </span>
                                    <span className={bIntro.systemTexts2}>
                                        <span className={bIntro.businessTextBoldE}>It is possible to link and integrate legacy systems and CCTVs, sensors new IoT sensors, and web services</span>
                                        that customers are using, And it supports<span className={bIntro.businessTextBoldE}>system linkage using API and on-premise cloud conversion.</span>
                                    </span>
                                </div>
                                <div className={bIntro.systemFlexBox}>
                                    <span className={bIntro.systemImgBox}>
                                        <span className={bIntro.systemImg}></span>
                                    </span>
                                    <span className={bIntro.systemTextBox}>
                                        <div className={bIntro.systemTarget1}>Checkpoint</div>
                                        <div className={bIntro.systemSubFlex1}>
                                            <span className={bIntro.systemCheckIcon}></span>
                                            <span className={bIntro.systemSubTitle1}>
                                                <p>Deploy sensor-linked servers that operate with each protocol</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.systemSubFlex2}>
                                            <span className={bIntro.systemCheckIcon2}></span>
                                            <span className={bIntro.systemSubTitle2}>
                                                <p>Connect CCTV event and WEB-based video display separation</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.systemSubFlex3}>
                                            <span className={bIntro.systemCheckIcon3}></span>
                                            <span className={bIntro.systemSubTitle3}>
                                                <p>Easy SaaS transition with Windows, Linux B/E support and front-end provision</p>
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
                                    <div className={bIntro.comPatConTItle2} data-aos="fade-down" data-aos-duration="1000">Patents and Certifications</div>
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comPatConTItle}>Patents</div>
                                    <div className={bIntro.comPatentBox}>
                                        <div className={bIntro.ParFirst}>
                                            <span className={bIntro.ParFirstBox1}>
                                                <span className={bIntro.ParFirstImg1}></span>
                                                <span className={bIntro.ParFirstText}>Method and system for providing adaptive SOP according to emergent</span>
                                                <span className={bIntro.ParFirstText2}>situation during SOP training</span>
                                                <span className={bIntro.ParFirstText3}>(2022)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox2}>
                                                <span className={bIntro.ParFirstImg2}></span>
                                                <span className={bIntro.ParFirstText4}>Method and system for providing adaptive SOP</span>
                                                <span className={bIntro.ParFirstText5}>according to organization's situation</span>
                                                <span className={bIntro.ParFirstText6}>(2022)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParSecond}>
                                            <span className={bIntro.ParSecondBox1}>
                                                <span className={bIntro.ParSecondImg1}></span>
                                                <span className={bIntro.ParSecondText1}>Method and system for managing grade of risk</span>
                                                <span className={bIntro.ParSecondText2}>alarm</span>
                                                <span className={bIntro.ParSecondText3}>(2022)</span>
                                            </span>
                                            <span className={bIntro.ParSecondBox2}>
                                                <span className={bIntro.ParSecondImg2}></span>
                                                <span className={bIntro.ParSecondText4}>Method and system for operating dynamic flight</span>
                                                <span className={bIntro.ParSecondText5}>restricted area</span>
                                                <span className={bIntro.ParSecondText6}>(2021)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParThird}>
                                            <span className={bIntro.ParThirdBox1}>
                                                <span className={bIntro.ParThirdImg1}></span>
                                                <span className={bIntro.ParThirdText1}>System and method for transitioning space</span>
                                                <span className={bIntro.ParThirdText2}>information</span>
                                                <span className={bIntro.ParThirdText3}>(2021)</span>
                                            </span>
                                            <span className={bIntro.ParThirdBox2}>
                                                <span className={bIntro.ParThirdImg2}></span>
                                                <span className={bIntro.ParThirdText4}>Method and system for visualizing 3D flight paths</span>
                                                <span className={bIntro.ParThirdText5}>(2021)</span>
                                                <span className={bIntro.ParThirdText6}></span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParFourth}>
                                            <span className={bIntro.ParFourthBox1}>
                                                <span className={bIntro.ParFourthImg1}></span>
                                                <span className={bIntro.ParFourthText1}>Method for disaster situation propagation and</span>
                                                <span className={bIntro.ParFourthText2}>system thereof</span>
                                                <span className={bIntro.ParFourthText3}>(2020)</span>
                                            </span>
                                            <span className={bIntro.ParFourthBox2}>
                                                <span className={bIntro.ParFourthImg2}></span>
                                                <span className={bIntro.ParFourthText4}>Disaster Countermeasures Training method capable to</span>
                                                <span className={bIntro.ParFourthText5}>make training scene and system thereof</span>
                                                <span className={bIntro.ParFourthText6}>(2020)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParFifth}>
                                            <span className={bIntro.ParFifthBox1}>
                                                <span className={bIntro.ParFifthImg1}></span>
                                                <span className={bIntro.ParFifthText1}>Method and system for creating related Standard</span>
                                                <span className={bIntro.ParFifthText2}>Operating Procedure</span>
                                                <span className={bIntro.ParFifthText3}>(2020)</span>
                                            </span>
                                            <span className={bIntro.ParFifthBox2}>
                                                <span className={bIntro.ParFifthImg2}></span>
                                                <span className={bIntro.ParFifthText4}>Intelligent Disaster Countermeasures Training</span>
                                                <span className={bIntro.ParFifthText5}>method and system thereof</span>
                                                <span className={bIntro.ParFifthText6}>(2019)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParSixth}>
                                            <span className={bIntro.ParSixthBox1}>
                                                <span className={bIntro.ParSixthImg1}></span>
                                                <span className={bIntro.ParSixthText1}>System and method for prediction of environmental</span>
                                                <span className={bIntro.ParSixthText2}>pollution</span>
                                                <span className={bIntro.ParSixthText3}>(2017)</span>
                                            </span>
                                            <span className={bIntro.ParSixthBox2}>
                                                <span className={bIntro.ParSixthImg2}></span>
                                                <span className={bIntro.ParSixthText4}>DISASTER TIME BEHAVIOR</span>
                                                <span className={bIntro.ParSixthText5}>SUPPORT SYSTEM</span>
                                                <span className={bIntro.ParSixthText6}>(2016)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParSeventh}>
                                            <span className={bIntro.ParSeventhBox1}>
                                                <span className={bIntro.ParSeventhImg1}></span>
                                                <span className={bIntro.ParSeventhText1}>Disaster detection system and providing method</span>
                                                <span className={bIntro.ParSeventhText2}>thereof</span>
                                                <span className={bIntro.ParSeventhText3}>(2015)</span>
                                            </span>
                                            <span className={bIntro.ParSeventhBox2}>
                                                <span className={bIntro.ParSeventhImg2}></span>
                                                <span className={bIntro.ParSeventhText4}>SOP scenario executing system and providing</span>
                                                <span className={bIntro.ParSeventhText5}>method thereof</span>
                                                <span className={bIntro.ParSeventhText6}>(2015)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParEighth}>
                                            <span className={bIntro.ParEighthBox1}>
                                                <span className={bIntro.ParEighthImg1}></span>
                                                <span className={bIntro.ParEighthText1}>Ecological environment evaluation system and</span>
                                                <span className={bIntro.ParEighthText2}>method thereof</span>
                                                <span className={bIntro.ParEighthText3}>(2014)</span>
                                            </span>
                                            <span className={bIntro.ParEighthBox2}>
                                                <span className={bIntro.ParEighthImg2}></span>
                                                <span className={bIntro.ParEighthText4}>Intelligent Standard Operating Procedure system based on location</span>
                                                <span className={bIntro.ParEighthText5}>and providing method thereof</span>
                                                <span className={bIntro.ParEighthText6}>(2013)</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/************* 인증 *************/}
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comCertifiedTItle}>Certifications</div>
                                    <div className={bIntro.comCertifiedBox}>
                                        <div className={bIntro.CerFirst}>
                                            <span className={bIntro.CerFirstBox}>
                                                <span className={bIntro.CerFirstImg}></span>
                                                <span className={bIntro.CerFirstText}>Smart Disaster Management System Good</span>
                                                <span className={bIntro.CerFirstText2}>Software(Grade 1)</span>
                                                <span className={bIntro.CerFirstText3}>(TTA, 2022)</span>
                                            </span>
                                            <span className={bIntro.CerFirstBox2}>
                                                <span className={bIntro.CerFirstImg2}></span>
                                                <span className={bIntro.CerFirstText4}>Venture Company</span>
                                                <span className={bIntro.CerFirstText5}>Confirmation</span>
                                                <span className={bIntro.CerFirstText6}>(2022)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.CerSecond}>
                                            <span className={bIntro.CerSecondBox1}>
                                                <span className={bIntro.CerSecondImg1}></span>
                                                <span className={bIntro.CerSecondText1}>Corporate R&D Center</span>
                                                <span className={bIntro.CerSecondText2}>Accreditation</span>
                                                <span className={bIntro.CerSecondText3}>(KOITA, 2022)</span>
                                            </span>
                                            <span className={bIntro.CerSecondBox2}>
                                                <span className={bIntro.CerSecondImg2}></span>
                                                <span className={bIntro.CerSecondText4}>Digital New deal Excellence</span>
                                                <span className={bIntro.CerSecondText5}>and Creation Company</span>
                                                <span className={bIntro.CerSecondText6}>(KCA, 2021)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.CerThird}>
                                            <span className={bIntro.CerThirdBox1}>
                                                <span className={bIntro.CerThirdImg1}></span>
                                                <span className={bIntro.CerThirdText1}>Technology innovation type small business(Inno-Biz)</span>
                                                <span className={bIntro.CerThirdText2}>Confirmation</span>
                                                <span className={bIntro.CerThirdText3}>(MSS, 2021)</span>
                                            </span>
                                            <span className={bIntro.CerThirdBox2}>
                                                <span className={bIntro.CerThirdImg2}></span>
                                                <span className={bIntro.CerThirdText4}>Software Business Enterprise Report</span>
                                                <span className={bIntro.CerThirdText5}>Confirmation</span>
                                                <span className={bIntro.CerThirdText6}>(KOSA, 2021)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.CerFourth}>
                                            <span className={bIntro.CerFourthBox1}>
                                                <span className={bIntro.CerFourthImg1}></span>
                                                <span className={bIntro.CerFourthText1}>Direct Production</span>
                                                <span className={bIntro.CerFourthText2}>Confirmation</span>
                                                <span className={bIntro.CerFourthText3}>(KBIZ, 2021)</span>
                                            </span>
                                            <span className={bIntro.CerFourthBox2}>
                                                <span className={bIntro.CerFourthImg2}></span>
                                                <span className={bIntro.CerFourthText4}>Information and Communication</span>
                                                <span className={bIntro.CerFourthText5}>Construction Business Registration</span>
                                                <span className={bIntro.CerFourthText6}>(Daegu-si, 2020)</span>
                                            </span>
                                        </div>
                                        {/* <span className={bIntro.CerSecondBox4}></span>
                                        <span className={bIntro.CerSecondBox5}></span> */}
                                    </div>

                                    {/************* 수상 *************/}
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comPrizeTItle}>Awards</div>
                                    <div className={bIntro.comPrizeBox}>
                                        <div className={bIntro.PrizeFirst}>
                                            <span className={bIntro.PrizeFirstBox}>
                                                <span className={bIntro.PrizeFirstImg}></span>
                                                <span className={bIntro.PrizeFirstText}>Award Certification from</span>
                                                <span className={bIntro.PrizeFirstText2}>Korea Gas Safety Corporation</span>
                                                <span className={bIntro.PrizeFirstText3}>(2023)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox2}>
                                                <span className={bIntro.PrizeFirstImg2}></span>
                                                <span className={bIntro.PrizeFirstText4}>Award Certification from</span>
                                                <span className={bIntro.PrizeFirstText5}>the Minister of MOIS</span>
                                                <span className={bIntro.PrizeFirstText6}>(2020)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.PrizeFirst2}>
                                            <span className={bIntro.PrizeFirstBox3}>
                                                <span className={bIntro.PrizeFirstImg3}></span>
                                                <span className={bIntro.PrizeFirstText7}>Award Certification from</span>
                                                <span className={bIntro.PrizeFirstText8}>K- BIZ</span>
                                                <span className={bIntro.PrizeFirstText9}>(2020)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox4}>
                                                <span className={bIntro.PrizeFirstImg4}></span>
                                                <span className={bIntro.PrizeFirstText10}>Award Certification from</span>
                                                <span className={bIntro.PrizeFirstText11}>the Mayor of Daegu Metropolitan City</span>
                                                <span className={bIntro.PrizeFirstText12}>(2019)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.PrizeFirst3}>
                                            <span className={bIntro.PrizeFirstBox5}>
                                                <span className={bIntro.PrizeFirstImg5}></span>
                                                <span className={bIntro.PrizeFirstText13}>Award Certification from</span>
                                                <span className={bIntro.PrizeFirstText14}>the Minister of MOIS</span>
                                                <span className={bIntro.PrizeFirstText15}>(2018)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox6}>
                                                <span className={bIntro.PrizeFirstImg6}></span>
                                                <span className={bIntro.PrizeFirstText16}></span>
                                                <span className={bIntro.PrizeFirstText17}></span>
                                                <span className={bIntro.PrizeFirstText18}></span>
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
            displayPerformanceUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={bIntro.bIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">Our Technology</span>
                            <span data-aos="fade-down" data-aos-duration="1000">Introduce U&E's safety management and digital twin technology capabilities, related patents and certifications.</span>
                        </div>
                        {/* 공간정보 구축 */}
                        <div id="sectionInforBuild">
                            <div className={bIntro.spatialInforContentsSect}>
                                <span className={bIntro.spatialTitle2} data-aos="fade-down" data-aos-duration="1000">Spatial Information Construction</span>
                                <div className={bIntro.spatialTextBoxTop}>
                                    <span className={bIntro.spatialTexts1}>
                                        <span className={bIntro.businessTextBoldE}>It builds and manages optimal indoor and outdoor spatial information</span>
                                        that operates smoothly in web and C/ S environments.
                                    </span>
                                    <span className={bIntro.spatialTexts2}>
                                        Through the IndoorGML-based data structure, it is easy to link legacy systems and sensors, expand services, and visualize
                                        <span className={bIntro.businessTextBoldE}>high-quality feature information above LoD 4 criteria</span>in 3D space.
                                    </span>
                                </div>

                                <div className={bIntro.spatialFlexBox}>
                                    <span className={bIntro.spatialImgBox}>
                                        <span className={bIntro.spatialInforImg}></span>
                                    </span>
                                    <span className={bIntro.spatialTextBox}>
                                        <div className={bIntro.spTarget1}>Checkpoint</div>
                                        <div className={bIntro.spSubFlex1}>
                                            <span className={bIntro.spCheckIcon}></span>
                                            <span className={bIntro.spSubTitle1}>
                                                <p>Modeling Interior Space Using 2D Drawings and Images</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.spSubFlex2}>
                                            <span className={bIntro.spCheckIcon2}></span>
                                            <span className={bIntro.spSubTitle2}>
                                                <p>Using 2D Drawings and Images Google Sketch- up</p>
                                                <p>and topology- based international standard</p>
                                                <p>spatial information modeling</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.spSubFlex3}>
                                            <span className={bIntro.spCheckIcon3}></span>
                                            <span className={bIntro.spSubTitle3}>
                                                <p>Building Lightweight</p>
                                                <p>Interior Modeling</p>
                                                <p></p>
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
                                        It is used for<span className={bIntro.businessTextBoldE}>IT-based disaster response by digitizing existing standard action procedures</span>in the form of books and manuals.
                                    </span>
                                    <span className={bIntro.eSopTexts2}>
                                        Along with the response to training by disaster type, the<span className={bIntro.businessTextBoldE}>step-by-step action tips</span>are guided in the event of an actual situation,
                                        and provides situation transmission through emergency contact networks to enable<span className={bIntro.businessTextBoldE}>quick and efficient disaster response</span>
                                    </span>
                                </div>

                                <div className={bIntro.eSopFlexBox}>
                                    <span className={bIntro.eSopImgBox}>
                                        <span className={bIntro.eSopImg}></span>
                                    </span>
                                    <span className={bIntro.eSopTextBox}>
                                        <div className={bIntro.eSopTarget1}>Checkpoint</div>
                                        <div className={bIntro.eSopSubFlex1}>
                                            <span className={bIntro.eSopCheckIcon}></span>
                                            <span className={bIntro.eSopSubTitle1}>
                                                <p>Create and edit SOPs with GUI-based SW and</p>
                                                <p>save them as database</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.eSopSubFlex2}>
                                            <span className={bIntro.eSopCheckIcon2}></span>
                                            <span className={bIntro.eSopSubTitle2}>
                                                <p>Simulated training through digitalized SOPs</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.eSopSubFlex3}>
                                            <span className={bIntro.eSopCheckIcon3}></span>
                                            <span className={bIntro.eSopSubTitle3}>
                                                <p>Organizational management and transmission of situations through text messages etc for emergency contact</p>
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
                                <span className={bIntro.dataTitle2} data-aos="fade-down" data-aos-duration="1000">Data Visualization</span>

                                <div className={bIntro.dataTextBoxTop}>
                                    <span className={bIntro.dataTexts1}>
                                        Various types of<span className={bIntro.businessTextBoldE}>data with spatial information to visualize and monitor.</span>
                                    </span>
                                    <span className={bIntro.dataTexts2}>
                                        <span className={bIntro.businessTextBoldE}>Business and user information</span>stored in the system, <span className={bIntro.businessTextBoldE}>real- time monitoring information</span>collected from IoT sensors,
                                        <span className={bIntro.businessTextBoldE}>Analysis/prediction information derived</span>from AI/ big data technology<span className={bIntro.businessTextBoldE}>is visualized by combining spatial information</span>
                                        And<span className={bIntro.businessTextBoldE}>expressed in various ways</span>such as tables/table and event streams.
                                    </span>
                                </div>

                                <div className={bIntro.dataFlexBox}>
                                    <span className={bIntro.dataImgBox}>
                                        <span className={bIntro.dataImg}></span>
                                    </span>
                                    <span className={bIntro.dataTextBox}>
                                        <div className={bIntro.dataTarget1}>Checkpoint</div>
                                        <div className={bIntro.dataSubFlex1}>
                                            <span className={bIntro.dataCheckIcon}></span>
                                            <span className={bIntro.dataSubTitle1}>
                                                <p>Visualize business and user information stored in DBMS, files, Log</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.dataSubFlex2}>
                                            <span className={bIntro.dataCheckIcon2}></span>
                                            <span className={bIntro.dataSubTitle2}>
                                                <p>Visualize real-time event stream information collected from IoT sensors</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.dataSubFlex3}>
                                            <span className={bIntro.dataCheckIcon3}></span>
                                            <span className={bIntro.dataSubTitle3}>
                                                <p>Combine with 3D space to visualize real-time events and historical history</p>
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
                                <span className={bIntro.systemTitle2} data-aos="fade-down" data-aos-duration="1000">System Integration</span>
                                <div className={bIntro.systemTextBoxTop}>
                                    <span className={bIntro.systemTexts1}>
                                        It<span className={bIntro.businessTextBoldE}>connects and integrates systems, sensors, and data</span>used in various industries.
                                    </span>
                                    <span className={bIntro.systemTexts2}>
                                       <span className={bIntro.businessTextBoldE}>It is possible to link and integrate legacy systems and CCTVs, sensors new IoT sensors, and web services</span>
                                       that customers are using, And it supports<span className={bIntro.businessTextBoldE}>system linkage using API and on-premise cloud conversion.</span>
                                    </span>
                                </div>

                                <div className={bIntro.systemFlexBox}>
                                    <span className={bIntro.systemImgBox}>
                                        <span className={bIntro.systemImg}></span>
                                    </span>
                                    <span className={bIntro.systemTextBox}>
                                        <div className={bIntro.systemTarget1}>Checkpoint</div>
                                        <div className={bIntro.systemSubFlex1}>
                                            <span className={bIntro.systemCheckIcon}></span>
                                            <span className={bIntro.systemSubTitle1}>
                                                <p>Deploy sensor-linked servers that operate with each protocol</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.systemSubFlex2}>
                                            <span className={bIntro.systemCheckIcon2}></span>
                                            <span className={bIntro.systemSubTitle2}>
                                                <p>Connect CCTV event and WEB-based video display separation</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.systemSubFlex3}>
                                            <span className={bIntro.systemCheckIcon3}></span>
                                            <span className={bIntro.systemSubTitle3}>
                                                <p>Easy SaaS transition with Windows, Linux B/E support and front-end provision</p>
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
                                    <div className={bIntro.comPatConTItle2} data-aos="fade-down" data-aos-duration="1000">Patents and Certifications</div>
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comPatConTItle}>Patents</div>
                                    <div className={bIntro.comPatentBox}>
                                        <div className={bIntro.ParFirst}>
                                            <span className={bIntro.ParFirstBox1}>
                                                <span className={bIntro.ParFirstImg1}></span>
                                                <span className={bIntro.ParFirstText}>Method and system for providing adaptive SOP according to emergent</span>
                                                <span className={bIntro.ParFirstText2}>situation during SOP training</span>
                                                <span className={bIntro.ParFirstText3}>(2022)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox2}>
                                                <span className={bIntro.ParFirstImg2}></span>
                                                <span className={bIntro.ParFirstText4}>Method and system for providing adaptive SOP</span>
                                                <span className={bIntro.ParFirstText5}>according to organization's situation</span>
                                                <span className={bIntro.ParFirstText6}>(2022)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParSecond}>
                                            <span className={bIntro.ParSecondBox1}>
                                                <span className={bIntro.ParSecondImg1}></span>
                                                <span className={bIntro.ParSecondText1}>Method and system for managing grade of risk</span>
                                                <span className={bIntro.ParSecondText2}>alarm</span>
                                                <span className={bIntro.ParSecondText3}>(2022)</span>
                                            </span>
                                            <span className={bIntro.ParSecondBox2}>
                                                <span className={bIntro.ParSecondImg2}></span>
                                                <span className={bIntro.ParSecondText4}>Method and system for operating dynamic flight</span>
                                                <span className={bIntro.ParSecondText5}>restricted area</span>
                                                <span className={bIntro.ParSecondText6}>(2021)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParThird}>
                                            <span className={bIntro.ParThirdBox1}>
                                                <span className={bIntro.ParThirdImg1}></span>
                                                <span className={bIntro.ParThirdText1}>System and method for transitioning space</span>
                                                <span className={bIntro.ParThirdText2}>information</span>
                                                <span className={bIntro.ParThirdText3}>(2021)</span>
                                            </span>
                                            <span className={bIntro.ParThirdBox2}>
                                                <span className={bIntro.ParThirdImg2}></span>
                                                <span className={bIntro.ParThirdText4}>Method and system for visualizing 3D flight paths</span>
                                                <span className={bIntro.ParThirdText5}>(2021)</span>
                                                <span className={bIntro.ParThirdText6}></span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParFourth}>
                                            <span className={bIntro.ParFourthBox1}>
                                                <span className={bIntro.ParFourthImg1}></span>
                                                <span className={bIntro.ParFourthText1}>Method for disaster situation propagation and</span>
                                                <span className={bIntro.ParFourthText2}>system thereof</span>
                                                <span className={bIntro.ParFourthText3}>(2020)</span>
                                            </span>
                                            <span className={bIntro.ParFourthBox2}>
                                                <span className={bIntro.ParFourthImg2}></span>
                                                <span className={bIntro.ParFourthText4}>Disaster Countermeasures Training method capable to</span>
                                                <span className={bIntro.ParFourthText5}>make training scene and system thereof</span>
                                                <span className={bIntro.ParFourthText6}>(2020)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParFifth}>
                                            <span className={bIntro.ParFifthBox1}>
                                                <span className={bIntro.ParFifthImg1}></span>
                                                <span className={bIntro.ParFifthText1}>Method and system for creating related Standard</span>
                                                <span className={bIntro.ParFifthText2}>Operating Procedure</span>
                                                <span className={bIntro.ParFifthText3}>(2020)</span>
                                            </span>
                                            <span className={bIntro.ParFifthBox2}>
                                                <span className={bIntro.ParFifthImg2}></span>
                                                <span className={bIntro.ParFifthText4}>Intelligent Disaster Countermeasures Training</span>
                                                <span className={bIntro.ParFifthText5}>method and system thereof</span>
                                                <span className={bIntro.ParFifthText6}>(2019)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParSixth}>
                                            <span className={bIntro.ParSixthBox1}>
                                                <span className={bIntro.ParSixthImg1}></span>
                                                <span className={bIntro.ParSixthText1}>System and method for prediction of environmental</span>
                                                <span className={bIntro.ParSixthText2}>pollution</span>
                                                <span className={bIntro.ParSixthText3}>(2017)</span>
                                            </span>
                                            <span className={bIntro.ParSixthBox2}>
                                                <span className={bIntro.ParSixthImg2}></span>
                                                <span className={bIntro.ParSixthText4}>DISASTER TIME BEHAVIOR</span>
                                                <span className={bIntro.ParSixthText5}>SUPPORT SYSTEM</span>
                                                <span className={bIntro.ParSixthText6}>(2016)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParSeventh}>
                                            <span className={bIntro.ParSeventhBox1}>
                                                <span className={bIntro.ParSeventhImg1}></span>
                                                <span className={bIntro.ParSeventhText1}>Disaster detection system and providing method</span>
                                                <span className={bIntro.ParSeventhText2}>thereof</span>
                                                <span className={bIntro.ParSeventhText3}>(2015)</span>
                                            </span>
                                            <span className={bIntro.ParSeventhBox2}>
                                                <span className={bIntro.ParSeventhImg2}></span>
                                                <span className={bIntro.ParSeventhText4}>SOP scenario executing system and providing</span>
                                                <span className={bIntro.ParSeventhText5}>method thereof</span>
                                                <span className={bIntro.ParSeventhText6}>(2015)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParEighth}>
                                            <span className={bIntro.ParEighthBox1}>
                                                <span className={bIntro.ParEighthImg1}></span>
                                                <span className={bIntro.ParEighthText1}>Ecological environment evaluation system and</span>
                                                <span className={bIntro.ParEighthText2}>method thereof</span>
                                                <span className={bIntro.ParEighthText3}>(2014)</span>
                                            </span>
                                            <span className={bIntro.ParEighthBox2}>
                                                <span className={bIntro.ParEighthImg2}></span>
                                                <span className={bIntro.ParEighthText4}>Intelligent Standard Operating Procedure system based on location</span>
                                                <span className={bIntro.ParEighthText5}>and providing method thereof</span>
                                                <span className={bIntro.ParEighthText6}>(2013)</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/************* 인증 *************/}
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comCertifiedTItle}>Certifications</div>
                                    <div className={bIntro.comCertifiedBox}>
                                        <div className={bIntro.CerFirst}>
                                            <span className={bIntro.CerFirstBox}>
                                                <span className={bIntro.CerFirstImg}></span>
                                                <span className={bIntro.CerFirstText}>Smart Disaster Management System Good</span>
                                                <span className={bIntro.CerFirstText2}>Software(Grade 1)</span>
                                                <span className={bIntro.CerFirstText3}>(TTA, 2022)</span>
                                            </span>
                                            <span className={bIntro.CerFirstBox2}>
                                                <span className={bIntro.CerFirstImg2}></span>
                                                <span className={bIntro.CerFirstText4}>Venture Company</span>
                                                <span className={bIntro.CerFirstText5}>Confirmation</span>
                                                <span className={bIntro.CerFirstText6}>(2022)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.CerSecond}>
                                            <span className={bIntro.CerSecondBox1}>
                                                <span className={bIntro.CerSecondImg1}></span>
                                                <span className={bIntro.CerSecondText1}>Corporate R&D Center</span>
                                                <span className={bIntro.CerSecondText2}>Accreditation</span>
                                                <span className={bIntro.CerSecondText3}>(KOITA, 2022)</span>
                                            </span>
                                            <span className={bIntro.CerSecondBox2}>
                                                <span className={bIntro.CerSecondImg2}></span>
                                                <span className={bIntro.CerSecondText4}>Digital New deal Excellence</span>
                                                <span className={bIntro.CerSecondText5}>and Creation Company</span>
                                                <span className={bIntro.CerSecondText6}>(KCA, 2021)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.CerThird}>
                                            <span className={bIntro.CerThirdBox1}>
                                                <span className={bIntro.CerThirdImg1}></span>
                                                <span className={bIntro.CerThirdText1}>Technology innovation type small business(Inno-Biz)</span>
                                                <span className={bIntro.CerThirdText2}>Confirmation</span>
                                                <span className={bIntro.CerThirdText3}>(MSS, 2021)</span>
                                            </span>
                                            <span className={bIntro.CerThirdBox2}>
                                                <span className={bIntro.CerThirdImg2}></span>
                                                <span className={bIntro.CerThirdText4}>Software Business Enterprise Report</span>
                                                <span className={bIntro.CerThirdText5}>Confirmation</span>
                                                <span className={bIntro.CerThirdText6}>(KOSA, 2021)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.CerFourth}>
                                            <span className={bIntro.CerFourthBox1}>
                                                <span className={bIntro.CerFourthImg1}></span>
                                                <span className={bIntro.CerFourthText1}>Direct Production</span>
                                                <span className={bIntro.CerFourthText2}>Confirmation</span>
                                                <span className={bIntro.CerFourthText3}>(KBIZ, 2021)</span>
                                            </span>
                                            <span className={bIntro.CerFourthBox2}>
                                                <span className={bIntro.CerFourthImg2}></span>
                                                <span className={bIntro.CerFourthText4}>Information and Communication</span>
                                                <span className={bIntro.CerFourthText5}>Construction Business Registration</span>
                                                <span className={bIntro.CerFourthText6}>(Daegu-si, 2020)</span>
                                            </span>
                                        </div>
                                        {/* <span className={bIntro.CerSecondBox4}></span>
                                        <span className={bIntro.CerSecondBox5}></span> */}
                                    </div>

                                    {/************* 수상 *************/}
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comPrizeTItle}>Awards</div>
                                    <div className={bIntro.comPrizeBox}>
                                        <div className={bIntro.PrizeFirst}>
                                            <span className={bIntro.PrizeFirstBox}>
                                                <span className={bIntro.PrizeFirstImg}></span>
                                                <span className={bIntro.PrizeFirstText}>Award Certification from</span>
                                                <span className={bIntro.PrizeFirstText2}>Korea Gas Safety Corporation</span>
                                                <span className={bIntro.PrizeFirstText3}>(2023)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox2}>
                                                <span className={bIntro.PrizeFirstImg2}></span>
                                                <span className={bIntro.PrizeFirstText4}>Award Certification from</span>
                                                <span className={bIntro.PrizeFirstText5}>the Minister of MOIS</span>
                                                <span className={bIntro.PrizeFirstText6}>(2020)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.PrizeFirst2}>
                                            <span className={bIntro.PrizeFirstBox3}>
                                                <span className={bIntro.PrizeFirstImg3}></span>
                                                <span className={bIntro.PrizeFirstText7}>Award Certification from</span>
                                                <span className={bIntro.PrizeFirstText8}>K- BIZ</span>
                                                <span className={bIntro.PrizeFirstText9}>(2020)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox4}>
                                                <span className={bIntro.PrizeFirstImg4}></span>
                                                <span className={bIntro.PrizeFirstText10}>Award Certification from</span>
                                                <span className={bIntro.PrizeFirstText11}>the Mayor of Daegu Metropolitan City</span>
                                                <span className={bIntro.PrizeFirstText12}>(2019)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.PrizeFirst3}>
                                            <span className={bIntro.PrizeFirstBox5}>
                                                <span className={bIntro.PrizeFirstImg5}></span>
                                                <span className={bIntro.PrizeFirstText13}>Award Certification from</span>
                                                <span className={bIntro.PrizeFirstText14}>the Minister of MOIS</span>
                                                <span className={bIntro.PrizeFirstText15}>(2018)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox6}>
                                                <span className={bIntro.PrizeFirstImg6}></span>
                                                <span className={bIntro.PrizeFirstText16}></span>
                                                <span className={bIntro.PrizeFirstText17}></span>
                                                <span className={bIntro.PrizeFirstText18}></span>
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
            displayPerformanceUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={bIntro.bIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">Our Technology</span>
                            <span data-aos="fade-down" data-aos-duration="1000">Introduce U&E's safety management and digital twin technology capabilities, related patents and certifications.</span>
                        </div>
                        {/* 공간정보 구축 */}
                        <div id="sectionInforBuild">
                            <div className={bIntro.spatialInforContentsSect}>
                                <span className={bIntro.spatialTitle2} data-aos="fade-down" data-aos-duration="1000">Spatial Information Construction</span>
                                <div className={bIntro.spatialTextBoxTop}>
                                    <span className={bIntro.spatialTexts1}>
                                        <span className={bIntro.businessTextBoldE}>It builds and manages optimal indoor and outdoor spatial information</span>
                                        that operates smoothly in web and C/ S environments.
                                    </span>
                                    <span className={bIntro.spatialTexts2}>
                                        Through the IndoorGML-based data structure, it is easy to link legacy systems and sensors, expand services, and visualize
                                        <span className={bIntro.businessTextBoldE}>high-quality feature information above LoD 4 criteria</span>in 3D space.
                                    </span>
                                </div>

                                <div className={bIntro.spatialFlexBox}>
                                    <span className={bIntro.spatialImgBox}>
                                        <span className={bIntro.spatialInforImg}></span>
                                    </span>
                                    <span className={bIntro.spatialTextBox}>
                                        <div className={bIntro.spTarget1}>Checkpoint</div>
                                        <div className={bIntro.spSubFlex1}>
                                            <span className={bIntro.spCheckIcon}></span>
                                            <span className={bIntro.spSubTitle1}>
                                                <p>Modeling Interior Space</p>
                                                <p>Using 2D Drawings and Images</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.spSubFlex2}>
                                            <span className={bIntro.spCheckIcon2}></span>
                                            <span className={bIntro.spSubTitle2}>
                                                <p>Compatible with</p>
                                                <p>Google Sketch- up</p>
                                                <p>and topology- based</p>
                                                <p>international standard</p>
                                                <p>spatial information modeling</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.spSubFlex3}>
                                            <span className={bIntro.spCheckIcon3}></span>
                                            <span className={bIntro.spSubTitle3}>
                                                <p>Building Lightweight</p>
                                                <p>Interior Modeling</p>
                                                <p></p>
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
                                        It is used for<span className={bIntro.businessTextBoldE}>IT-based disaster response by digitizing existing standard action procedures</span>in the form of books and manuals.
                                    </span>
                                    <span className={bIntro.eSopTexts2}>
                                        Along with the response to training by disaster type, the<span className={bIntro.businessTextBoldE}>step-by-step action tips</span>are guided in the event of an actual situation,
                                        and provides situation transmission through emergency contact networks to enable<span className={bIntro.businessTextBoldE}>quick and efficient disaster response</span>
                                    </span>
                                </div>

                                <div className={bIntro.eSopFlexBox}>
                                    <span className={bIntro.eSopImgBox}>
                                        <span className={bIntro.eSopImg}></span>
                                    </span>
                                    <span className={bIntro.eSopTextBox}>
                                        <div className={bIntro.eSopTarget1}>Checkpoint</div>
                                        <div className={bIntro.eSopSubFlex1}>
                                            <span className={bIntro.eSopCheckIcon}></span>
                                            <span className={bIntro.eSopSubTitle1}>
                                                <p>Create and edit SOPs with</p>
                                                <p>GUI-based SW and</p>
                                                <p>save them as database</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.eSopSubFlex2}>
                                            <span className={bIntro.eSopCheckIcon2}></span>
                                            <span className={bIntro.eSopSubTitle2}>
                                                <p>Simulated training through</p>
                                                <p>digitalized SOPs</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.eSopSubFlex3}>
                                            <span className={bIntro.eSopCheckIcon3}></span>
                                            <span className={bIntro.eSopSubTitle3}>
                                                <p>Organizational management</p>
                                                <p>and transmission of situations</p>
                                                <p>through text messages etc.</p>
                                                <p>for emergency contact</p>
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
                                <span className={bIntro.dataTitle2} data-aos="fade-down" data-aos-duration="1000">Data Visualization</span>
                                <div className={bIntro.dataTextBoxTop}>
                                    <span className={bIntro.dataTexts1}>
                                        Various types of<span className={bIntro.businessTextBold}>data with spatial information to visualize and monitor.</span>
                                    </span>
                                    <span className={bIntro.dataTexts2}>
                                        <span className={bIntro.businessTextBoldE}>Business and user information</span>stored in the system, <span className={bIntro.businessTextBoldE}>real- time monitoring information</span>collected from IoT sensors,
                                        <span className={bIntro.businessTextBoldE}>Analysis/prediction information derived</span>from AI/ big data technology<span className={bIntro.businessTextBoldE}>is visualized by combining spatial information</span>
                                        And<span className={bIntro.businessTextBoldE}>expressed in various ways</span>such as tables/table and event streams.
                                    </span>
                                </div>

                                <div className={bIntro.dataFlexBox}>
                                    <span className={bIntro.dataImgBox}>
                                        <span className={bIntro.dataImg}></span>
                                    </span>
                                    <span className={bIntro.dataTextBox}>
                                        <div className={bIntro.dataTarget1}>Checkpoint</div>
                                        <div className={bIntro.dataSubFlex1}>
                                            <span className={bIntro.dataCheckIcon}></span>
                                            <span className={bIntro.dataSubTitle1}>
                                                <p>Visualize business</p>
                                                <p>and user information</p>
                                                <p>stored in DBMS, files, Log</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.dataSubFlex2}>
                                            <span className={bIntro.dataCheckIcon2}></span>
                                            <span className={bIntro.dataSubTitle2}>
                                                <p>Visualize real-time event</p>
                                                <p>stream information</p>
                                                <p>collected from IoT sensors</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.dataSubFlex3}>
                                            <span className={bIntro.dataCheckIcon3}></span>
                                            <span className={bIntro.dataSubTitle3}>
                                                <p>Combine with 3D space to</p>
                                                <p>visualize real-time events</p>
                                                <p>and historical history</p>
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
                                <span className={bIntro.systemTitle2} data-aos="fade-down" data-aos-duration="1000">System Integration</span>
                                <div className={bIntro.systemTextBoxTop}>
                                    <span className={bIntro.systemTexts1}>
                                        It<span className={bIntro.businessTextBoldE}>connects and integrates systems, sensors, and data</span>used in various industries.
                                    </span>
                                    <span className={bIntro.systemTexts2}>
                                        <span className={bIntro.businessTextBoldE}>It is possible to link and integrate legacy systems and CCTVs, sensors new IoT sensors, and web services</span>
                                        that customers are using, And it supports<span className={bIntro.businessTextBoldE}>system linkage using API and on-premise cloud conversion.</span>
                                    </span>
                                </div>

                                <div className={bIntro.systemFlexBox}>
                                    <span className={bIntro.systemImgBox}>
                                        <span className={bIntro.systemImg}></span>
                                    </span>
                                    <span className={bIntro.systemTextBox}>
                                        <div className={bIntro.systemTarget1}>Checkpoint</div>
                                        <div className={bIntro.systemSubFlex1}>
                                            <span className={bIntro.systemCheckIcon}></span>
                                            <span className={bIntro.systemSubTitle1}>
                                                <p>Deploy sensor-linked</p>
                                                <p>servers that operate</p>
                                                <p>with each protocol</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.systemSubFlex2}>
                                            <span className={bIntro.systemCheckIcon2}></span>
                                            <span className={bIntro.systemSubTitle2}>
                                                <p>Connect CCTV event</p>
                                                <p>and WEB-based video</p>
                                                <p>display separation</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.systemSubFlex3}>
                                            <span className={bIntro.systemCheckIcon3}></span>
                                            <span className={bIntro.systemSubTitle3}>
                                                <p>Easy SaaS transition with</p>
                                                <p>Windows, Linux B/E support</p>
                                                <p>and front-end provision</p>
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
                                    <div className={bIntro.comPatConTItle2} data-aos="fade-down" data-aos-duration="1000">Patents and Certifications</div>
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comPatConTItle}>Patents</div>
                                    <div className={bIntro.comPatentBox}>
                                        <div className={bIntro.ParFirst}>
                                            <span className={bIntro.ParFirstBox1}>
                                                <span className={bIntro.ParFirstImg}></span>
                                                <span className={bIntro.ParFirstText}>Method and system for providing adaptive SOP according to emergent</span>
                                                <span className={bIntro.ParFirstText2}>situation during SOP training</span>
                                                <span className={bIntro.ParFirstText3}>(2022)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox2}>
                                                <span className={bIntro.ParFirstImg2}></span>
                                                <span className={bIntro.ParFirstText4}>Method and system for providing adaptive SOP</span>
                                                <span className={bIntro.ParFirstText5}>according to organization's situation</span>
                                                <span className={bIntro.ParFirstText6}>(2022)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox3}>
                                                <span className={bIntro.ParFirstImg3}></span>
                                                <span className={bIntro.ParFirstText7}>Method and system for managing grade of risk</span>
                                                <span className={bIntro.ParFirstText8}>alarm</span>
                                                <span className={bIntro.ParFirstText9}>(2022)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox4}>
                                                <span className={bIntro.ParFirstImg4}></span>
                                                <span className={bIntro.ParFirstText10}>Method and system for operating dynamic flight</span>
                                                <span className={bIntro.ParFirstText11}>restricted area</span>
                                                <span className={bIntro.ParFirstText12}>(2021)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox5}>
                                                <span className={bIntro.ParFirstImg5}></span>
                                                <span className={bIntro.ParFirstText13}>System and method for transitioning space</span>
                                                <span className={bIntro.ParFirstText14}>information</span>
                                                <span className={bIntro.ParFirstText15}>(2021)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParSecond}>
                                            <span className={bIntro.ParSecondBox1}>
                                                <span className={bIntro.ParSecondImg}></span>
                                                <span className={bIntro.ParSecondText}>Method and system for visualizing 3D flight paths</span>
                                                <span className={bIntro.ParSecondText2}>(2021)</span>
                                                <span className={bIntro.ParSecondText3}></span>
                                            </span>
                                            <span className={bIntro.ParSecondBox2}>
                                                <span className={bIntro.ParSecondImg2}></span>
                                                <span className={bIntro.ParSecondText4}>Method for disaster situation propagation and </span>
                                                <span className={bIntro.ParSecondText5}>system thereof</span>
                                                <span className={bIntro.ParSecondText6}>(2020)</span>
                                            </span>
                                            <span className={bIntro.ParSecondBox3}>
                                                <span className={bIntro.ParSecondImg3}></span>
                                                <span className={bIntro.ParSecondText7}>Disaster Countermeasures Training method capable to</span>
                                                <span className={bIntro.ParSecondText8}>make training scene and system thereof</span>
                                                <span className={bIntro.ParSecondText9}>(2020)</span>
                                            </span>
                                            <span className={bIntro.ParSecondBox4}>
                                                <span className={bIntro.ParSecondImg4}></span>
                                                <span className={bIntro.ParSecondText10}>Method and system for creating related Standard</span>
                                                <span className={bIntro.ParSecondText11}>Operating Procedure</span>
                                                <span className={bIntro.ParSecondText12}>(2020)</span>
                                            </span>
                                            <span className={bIntro.ParSecondBox5}>
                                                <span className={bIntro.ParSecondImg5}></span>
                                                <span className={bIntro.ParSecondText13}>Intelligent Disaster Countermeasures Training</span>
                                                <span className={bIntro.ParSecondText14}>method and system thereof</span>
                                                <span className={bIntro.ParSecondText15}>(2019)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParThird}>
                                            <span className={bIntro.ParThirdBox1}>
                                                <span className={bIntro.ParThirdImg}></span>
                                                <span className={bIntro.ParThirdText}>System and method for prediction of environmental</span>
                                                <span className={bIntro.ParThirdText2}>pollution</span>
                                                <span className={bIntro.ParThirdText3}>(2017)</span>
                                            </span>
                                            <span className={bIntro.ParThirdBox2}>
                                                <span className={bIntro.ParThirdImg2}></span>
                                                <span className={bIntro.ParThirdText4}>DISASTER TIME BEHAVIOR</span>
                                                <span className={bIntro.ParThirdText5}>SUPPORT SYSTEM</span>
                                                <span className={bIntro.ParThirdText6}>(2016)</span>
                                            </span>
                                            <span className={bIntro.ParThirdBox3}>
                                                <span className={bIntro.ParThirdImg3}></span>
                                                <span className={bIntro.ParThirdText7}>Disaster detection system and providing method</span>
                                                <span className={bIntro.ParThirdText8}>thereof</span>
                                                <span className={bIntro.ParThirdText9}>(2015)</span>
                                            </span>
                                            <span className={bIntro.ParThirdBox4}>
                                                <span className={bIntro.ParThirdImg4}></span>
                                                <span className={bIntro.ParThirdText10}>SOP scenario executing system and providing</span>
                                                <span className={bIntro.ParThirdText11}>method thereof</span>
                                                <span className={bIntro.ParThirdText12}>(2015)</span>
                                            </span>
                                            <span className={bIntro.ParThirdBox5}>
                                                <span className={bIntro.ParThirdImg5}></span>
                                                <span className={bIntro.ParThirdText13}>Ecological environment evaluation system and</span>
                                                <span className={bIntro.ParThirdText14}>method thereof</span>
                                                <span className={bIntro.ParThirdText15}>(2014)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParFourth}>
                                            <span className={bIntro.ParFourthBox1}>
                                                <span className={bIntro.ParFourthImg}></span>
                                                <span className={bIntro.ParFourthText}>Intelligent Standard Operating Procedure system based on location</span>
                                                <span className={bIntro.ParFourthText2}>and providing method thereof</span>
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
                                    <div className={bIntro.comCertifiedTItle}>Certifications</div>
                                    <div className={bIntro.comCertifiedBox}>
                                        <div className={bIntro.CerFirst}>
                                            <span className={bIntro.CerFirstBox}>
                                                <span className={bIntro.CerFirstImg}></span>
                                                <span className={bIntro.CerFirstText}>Smart Disaster Management System Good</span>
                                                <span className={bIntro.CerFirstText2}>Software(Grade 1)</span>
                                                <span className={bIntro.CerFirstText3}>(TTA, 2022)</span>
                                            </span>
                                            <span className={bIntro.CerFirstBox2}>
                                                <span className={bIntro.CerFirstImg2}></span>
                                                <span className={bIntro.CerFirstText4}>Venture Company</span>
                                                <span className={bIntro.CerFirstText5}>Confirmation</span>
                                                <span className={bIntro.CerFirstText6}>(2022)</span>
                                            </span>
                                            <span className={bIntro.CerFirstBox3}>
                                                <span className={bIntro.CerFirstImg3}></span>
                                                <span className={bIntro.CerFirstText7}>Corporate R&D Center</span>
                                                <span className={bIntro.CerFirstText8}>Accreditation</span>
                                                <span className={bIntro.CerFirstText9}>(KOITA, 2022)</span>
                                            </span>
                                            <span className={bIntro.CerFirstBox4}>
                                                <span className={bIntro.CerFirstImg4}></span>
                                                <span className={bIntro.CerFirstText10}>Digital New deal Excellence</span>
                                                <span className={bIntro.CerFirstText11}>and Creation Company</span>
                                                <span className={bIntro.CerFirstText12}>(KCA, 2021)</span>
                                            </span>
                                            <span className={bIntro.CerFirstBox5}>
                                                <span className={bIntro.CerFirstImg5}></span>
                                                <span className={bIntro.CerFirstText13}>Technology innovation type small business(Inno-Biz)</span>
                                                <span className={bIntro.CerFirstText14}>Confirmation</span>
                                                <span className={bIntro.CerFirstText15}>(MSS, 2021)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.CerSecond}>
                                            <span className={bIntro.CerSecondBox}>
                                                <span className={bIntro.CerSecondImg}></span>
                                                <span className={bIntro.CerSecondText}>Software Business Enterprise Report</span>
                                                <span className={bIntro.CerSecondText2}>Confirmation</span>
                                                <span className={bIntro.CerSecondText3}>(KOSA, 2021)</span>
                                            </span>
                                            <span className={bIntro.CerSecondBox2}>
                                                <span className={bIntro.CerSecondImg2}></span>
                                                <span className={bIntro.CerSecondText4}>Direct Production</span>
                                                <span className={bIntro.CerSecondText5}>Confirmation</span>
                                                <span className={bIntro.CerSecondText6}>(KBIZ, 2021)</span>
                                            </span>
                                            <span className={bIntro.CerSecondBox3}>
                                                <span className={bIntro.CerSecondImg3}></span>
                                                <span className={bIntro.CerSecondText7}>Information and Communication</span>
                                                <span className={bIntro.CerSecondText8}>Construction Business Registration</span>
                                                <span className={bIntro.CerSecondText9}>(Daegu-si, 2020)</span>
                                            </span>
                                            <span className={bIntro.CerSecondBox4}></span>
                                            <span className={bIntro.CerSecondBox5}></span>
                                        </div>
                                    </div>
                                    {/************* 수상 *************/}
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comPrizeTItle}>Awards</div>
                                    <div className={bIntro.comPrizeBox}>
                                        <div className={bIntro.PrizeFirst}>
                                            <span className={bIntro.PrizeFirstBox}>
                                                <span className={bIntro.PrizeFirstImg}></span>
                                                <span className={bIntro.PrizeFirstText}>Award Certification from</span>
                                                <span className={bIntro.PrizeFirstText2}>Korea Gas Safety Corporation</span>
                                                <span className={bIntro.PrizeFirstText3}>(2023)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox2}>
                                                <span className={bIntro.PrizeFirstImg2}></span>
                                                <span className={bIntro.PrizeFirstText4}>Award Certification from</span>
                                                <span className={bIntro.PrizeFirstText5}>the Minister of MOIS</span>
                                                <span className={bIntro.PrizeFirstText6}>(2020)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.PrizeFirst2}>
                                            <span className={bIntro.PrizeFirstBox3}>
                                                <span className={bIntro.PrizeFirstImg3}></span>
                                                <span className={bIntro.PrizeFirstText7}>Award Certification from</span>
                                                <span className={bIntro.PrizeFirstText8}>K- BIZ</span>
                                                <span className={bIntro.PrizeFirstText9}>(2020)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox4}>
                                                <span className={bIntro.PrizeFirstImg4}></span>
                                                <span className={bIntro.PrizeFirstText10}>Award Certification from</span>
                                                <span className={bIntro.PrizeFirstText11}>the Mayor of Daegu Metropolitan City</span>
                                                <span className={bIntro.PrizeFirstText12}>(2019)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.PrizeFirst3}>
                                            <span className={bIntro.PrizeFirstBox5}>
                                                <span className={bIntro.PrizeFirstImg5}></span>
                                                <span className={bIntro.PrizeFirstText13}>Award Certification from</span>
                                                <span className={bIntro.PrizeFirstText14}>the Minister of MOIS</span>
                                                <span className={bIntro.PrizeFirstText15}>(2018)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox6}>
                                                <span className={bIntro.PrizeFirstImg6}></span>
                                                <span className={bIntro.PrizeFirstText16}></span>
                                                <span className={bIntro.PrizeFirstText17}></span>
                                                <span className={bIntro.PrizeFirstText18}></span>
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
            displayPerformanceUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={bIntro.bIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">Our Technology</span>
                            <span data-aos="fade-down" data-aos-duration="1000">Introduce U&E's safety management and digital twin technology capabilities, related patents and certifications.</span>
                        </div>
                        {/* 공간정보 구축 */}
                        <div id="sectionInforBuild">
                            <div className={bIntro.spatialInforContentsSect}>
                                <span className={bIntro.spatialTitle2} data-aos="fade-down" data-aos-duration="1000">Spatial Information Construction</span>
                                {/* <div className={bIntro.spatialTextBoxTop}>
                                    <span className={bIntro.spatialTexts1}><span className={bIntro.businessTextBold} style={{ marginRight: '8px' }}>It builds and manages optimal indoor and outdoor spatial information</span><span>that operates smoothly in web and C/ S environments.</span></span>
                                    <span className={bIntro.spatialTexts2}>Through the IndoorGML-based data structure, it is easy to link legacy systems and sensors, expand services,</span>
                                    <span className={bIntro.spatialTexts3}>and visualize<span className={bIntro.businessTextBold} style={{ marginRight: '8px' }}>high-quality feature information above LoD 4 criteria</span>in 3D space.</span>
                                </div> */}

                                <div className={bIntro.spatialTextBoxTop}>
                                    <span className={bIntro.spatialTexts1}>
                                        <span className={bIntro.businessTextBoldE}>It builds and manages optimal indoor and outdoor spatial information</span>
                                        that operates smoothly in web and C/ S environments.
                                    </span>
                                    <span className={bIntro.spatialTexts2}>
                                        Through the IndoorGML-based data structure, it is easy to link legacy systems and sensors, expand services, and visualize
                                        <span className={bIntro.businessTextBoldE}>high-quality feature information above LoD 4 criteria in 3D space.</span>
                                    </span>
                                </div>

                                <div className={bIntro.spatialFlexBox}>
                                    <span className={bIntro.spatialImgBox}>
                                        <span className={bIntro.spatialInforImg}></span>
                                    </span>
                                    <span className={bIntro.spatialTextBox}>
                                        <div className={bIntro.spTarget1}>Checkpoint</div>
                                        <div className={bIntro.spSubFlex1}>
                                            <span className={bIntro.spCheckIcon}></span>
                                            <span className={bIntro.spSubTitle1}>
                                                <p>Modeling Interior Space</p>
                                                <p>Using 2D Drawings and Images</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.spSubFlex2}>
                                            <span className={bIntro.spCheckIcon2}></span>
                                            <span className={bIntro.spSubTitle2}>
                                                <p>Compatible with</p>
                                                <p>Google Sketch- up</p>
                                                <p>and topology- based</p>
                                                <p>international standard</p>
                                                <p>spatial information modeling</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.spSubFlex3}>
                                            <span className={bIntro.spCheckIcon3}></span>
                                            <span className={bIntro.spSubTitle3}>
                                                <p>Building Lightweight</p>
                                                <p>Interior Modeling</p>
                                                <p></p>
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
                                {/* <div className={bIntro.eSopTextBoxTop}>
                                    <span className={bIntro.eSopTexts1}><span>It is used for</span><span className={bIntro.businessTextBold} style={{ marginRight: '8px' }}>IT-based disaster response by digitizing existing standard action procedures</span><span>in the form of books and manuals.</span></span>
                                    <span className={bIntro.eSopTexts2}>Along with the response to training by disaster type, the<span className={bIntro.businessTextBold} style={{ marginRight: '8px' }}>step-by-step action tips</span>are guided in the event of an actual situation,</span>
                                    <span className={bIntro.eSopTexts3}>and provides situation transmission through emergency contact networks to enable<span className={bIntro.businessTextBold}>quick and efficient disaster response</span></span>
                                </div> */}

                                <div className={bIntro.eSopTextBoxTop}>
                                    <span className={bIntro.eSopTexts1}>
                                        It is used for<span className={bIntro.businessTextBoldE}>IT-based disaster response by digitizing existing standard action procedures</span>in the form of books and manuals.
                                    </span>
                                    <span className={bIntro.eSopTexts2}>
                                        Along with the response to training by disaster type, the<span className={bIntro.businessTextBoldE}>step-by-step action tips</span>are guided in the event of an actual situation,
                                        and provides situation transmission through emergency contact networks to enable<span className={bIntro.businessTextBoldE}>quick and efficient disaster response</span>
                                    </span>
                                </div>

                                <div className={bIntro.eSopFlexBox}>
                                    <span className={bIntro.eSopImgBox}>
                                        <span className={bIntro.eSopImg}></span>
                                    </span>
                                    <span className={bIntro.eSopTextBox}>
                                        <div className={bIntro.eSopTarget1}>Checkpoint</div>
                                        <div className={bIntro.eSopSubFlex1}>
                                            <span className={bIntro.eSopCheckIcon}></span>
                                            <span className={bIntro.eSopSubTitle1}>
                                                <p>Create and edit SOPs with</p>
                                                <p>GUI-based SW and</p>
                                                <p>save them as database</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.eSopSubFlex2}>
                                            <span className={bIntro.eSopCheckIcon2}></span>
                                            <span className={bIntro.eSopSubTitle2}>
                                                <p>Simulated training through</p>
                                                <p>digitalized SOPs</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.eSopSubFlex3}>
                                            <span className={bIntro.eSopCheckIcon3}></span>
                                            <span className={bIntro.eSopSubTitle3}>
                                                <p>Organizational management</p>
                                                <p>and transmission of situations</p>
                                                <p>through text messages etc.</p>
                                                <p>for emergency contact</p>
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
                                <span className={bIntro.dataTitle2} data-aos="fade-down" data-aos-duration="1000">Data Visualization</span>
                                {/* <div className={bIntro.dataTextBoxTop}>
                                    <span className={bIntro.dataTexts1}>Various types of<span className={bIntro.businessTextBold}>data with spatial information to visualize and monitor.</span></span>
                                    <span className={bIntro.dataTexts2}><span className={bIntro.businessTextBold} style={{ marginRight: '8px' }}>Business and user information</span>stored in the system,<span className={bIntro.businessTextBold} style={{ marginRight: '8px' }}>real- time monitoring information</span>collected from IoT sensors,<span className={bIntro.businessTextBold}></span></span>
                                    <span className={bIntro.dataTexts3}><span className={bIntro.businessTextBold} style={{ marginRight: '8px' }}>Analysis/prediction information derived</span>from AI/ big data technology<span className={bIntro.businessTextBold}>is visualized by combining spatial information</span></span>
                                    <span className={bIntro.dataTexts4}>And<span className={bIntro.businessTextBold} style={{ marginRight: '8px' }}>expressed in various ways</span>such as tables/table and event streams.</span>
                                </div> */}

                                <div className={bIntro.dataTextBoxTop}>
                                    <span className={bIntro.dataTexts1}>
                                        Various types of<span className={bIntro.businessTextBoldE}>data with spatial information to visualize and monitor.</span>
                                    </span>
                                    <span className={bIntro.dataTexts2}>
                                        <span className={bIntro.businessTextBoldE}>Business and user information</span>stored in the system, <span className={bIntro.businessTextBoldE}>real- time monitoring information</span>collected from IoT sensors,
                                        <span className={bIntro.businessTextBoldE}>Analysis/prediction information derived</span>from AI/ big data technology<span className={bIntro.businessTextBoldE}>is visualized by combining spatial information</span>
                                        And<span className={bIntro.businessTextBoldE}>expressed in various ways</span>such as tables/table and event streams.
                                    </span>
                                </div>

                                <div className={bIntro.dataFlexBox}>
                                    <span className={bIntro.dataImgBox}>
                                        <span className={bIntro.dataImg}></span>
                                    </span>
                                    <span className={bIntro.dataTextBox}>
                                        <div className={bIntro.dataTarget1}>Checkpoint</div>
                                        <div className={bIntro.dataSubFlex1}>
                                            <span className={bIntro.dataCheckIcon}></span>
                                            <span className={bIntro.dataSubTitle1}>
                                                <p>Visualize business</p>
                                                <p>and user information</p>
                                                <p>stored in DBMS, files, Log</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.dataSubFlex2}>
                                            <span className={bIntro.dataCheckIcon2}></span>
                                            <span className={bIntro.dataSubTitle2}>
                                                <p>Visualize real-time event</p>
                                                <p>stream information</p>
                                                <p>collected from IoT sensors</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.dataSubFlex3}>
                                            <span className={bIntro.dataCheckIcon3}></span>
                                            <span className={bIntro.dataSubTitle3}>
                                                <p>Combine with 3D space to</p>
                                                <p>visualize real-time events</p>
                                                <p>and historical history</p>
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
                                <span className={bIntro.systemTitle2} data-aos="fade-down" data-aos-duration="1000">System Integration</span>
                                {/* <div className={bIntro.systemTextBoxTop}>
                                    <span className={bIntro.systemTexts1}>It<span className={bIntro.businessTextBold} style={{ marginRight: '8px' }}>connects and integrates systems, sensors, and data</span>used in various industries.</span>
                                    <span className={bIntro.systemTexts2}><span className={bIntro.businessTextBold}>It is possible to link and integrate legacy systems and CCTVs, sensors</span><span className={bIntro.businessTextBold}></span></span>
                                    <span className={bIntro.systemTexts3}><span className={bIntro.businessTextBold} style={{ marginRight: '8px' }}>new IoT sensors, and web services</span>that customers are using,</span>
                                    <span className={bIntro.systemTexts4}><span className={bIntro.businessTextBold}></span><span>And it supports</span><span className={bIntro.businessTextBold}>system linkage using API and on-premise cloud conversion.</span></span>
                                </div> */}

                                <div className={bIntro.systemTextBoxTop}>
                                    <span className={bIntro.systemTexts1}>
                                        It<span className={bIntro.businessTextBoldE}>connects and integrates systems, sensors, and data</span>used in various industries.
                                    </span>
                                    <span className={bIntro.systemTexts2}>
                                        <span className={bIntro.businessTextBoldE}>It is possible to link and integrate legacy systems and CCTVs, sensors new IoT sensors, and web services</span>
                                        that customers are using, And it supports<span className={bIntro.businessTextBoldE}>system linkage using API and on-premise cloud conversion.</span>
                                    </span>
                                </div>

                                <div className={bIntro.systemFlexBox}>
                                    <span className={bIntro.systemImgBox}>
                                        <span className={bIntro.systemImg}></span>
                                    </span>
                                    <span className={bIntro.systemTextBox}>
                                        <div className={bIntro.systemTarget1}>Checkpoint</div>
                                        <div className={bIntro.systemSubFlex1}>
                                            <span className={bIntro.systemCheckIcon}></span>
                                            <span className={bIntro.systemSubTitle1}>
                                                <p>Deploy sensor-linked</p>
                                                <p>servers that operate</p>
                                                <p>with each protocol</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.systemSubFlex2}>
                                            <span className={bIntro.systemCheckIcon2}></span>
                                            <span className={bIntro.systemSubTitle2}>
                                                <p>Connect CCTV event</p>
                                                <p>and WEB-based video</p>
                                                <p>display separation</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.systemSubFlex3}>
                                            <span className={bIntro.systemCheckIcon3}></span>
                                            <span className={bIntro.systemSubTitle3}>
                                                <p>Easy SaaS transition with</p>
                                                <p>Windows, Linux B/E support</p>
                                                <p>and front-end provision</p>
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
                                    <div className={bIntro.comPatConTItle2} data-aos="fade-down" data-aos-duration="1000">Patents and Certifications</div>
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comPatConTItle}>Patents</div>
                                    <div className={bIntro.comPatentBox}>
                                        <div className={bIntro.ParFirst}>
                                            <span className={bIntro.ParFirstBox1}>
                                                <span className={bIntro.ParFirstImg}></span>
                                                <span className={bIntro.ParFirstText}>Method and system for providing adaptive SOP according to emergent</span>
                                                <span className={bIntro.ParFirstText2}>situation during SOP training</span>
                                                <span className={bIntro.ParFirstText3}>(2022)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox2}>
                                                <span className={bIntro.ParFirstImg2}></span>
                                                <span className={bIntro.ParFirstText4}>Method and system for providing adaptive SOP</span>
                                                <span className={bIntro.ParFirstText5}>according to organization's situation</span>
                                                <span className={bIntro.ParFirstText6}>(2022)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox3}>
                                                <span className={bIntro.ParFirstImg3}></span>
                                                <span className={bIntro.ParFirstText7}>Method and system for managing grade of risk</span>
                                                <span className={bIntro.ParFirstText8}>alarm</span>
                                                <span className={bIntro.ParFirstText9}>(2022)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox4}>
                                                <span className={bIntro.ParFirstImg4}></span>
                                                <span className={bIntro.ParFirstText10}>Method and system for operating dynamic flight</span>
                                                <span className={bIntro.ParFirstText11}>restricted area</span>
                                                <span className={bIntro.ParFirstText12}>(2021)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox5}>
                                                <span className={bIntro.ParFirstImg5}></span>
                                                <span className={bIntro.ParFirstText13}>System and method for transitioning space</span>
                                                <span className={bIntro.ParFirstText14}>information</span>
                                                <span className={bIntro.ParFirstText15}>(2021)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParSecond}>
                                            <span className={bIntro.ParSecondBox1}>
                                                <span className={bIntro.ParSecondImg}></span>
                                                <span className={bIntro.ParSecondText}>Method and system for visualizing 3D flight paths</span>
                                                <span className={bIntro.ParSecondText2}>(2021)</span>
                                                <span className={bIntro.ParSecondText3}></span>
                                            </span>
                                            <span className={bIntro.ParSecondBox2}>
                                                <span className={bIntro.ParSecondImg2}></span>
                                                <span className={bIntro.ParSecondText4}>Method for disaster situation propagation and </span>
                                                <span className={bIntro.ParSecondText5}>system thereof</span>
                                                <span className={bIntro.ParSecondText6}>(2020)</span>
                                            </span>
                                            <span className={bIntro.ParSecondBox3}>
                                                <span className={bIntro.ParSecondImg3}></span>
                                                <span className={bIntro.ParSecondText7}>Disaster Countermeasures Training method capable to</span>
                                                <span className={bIntro.ParSecondText8}>make training scene and system thereof</span>
                                                <span className={bIntro.ParSecondText9}>(2020)</span>
                                            </span>
                                            <span className={bIntro.ParSecondBox4}>
                                                <span className={bIntro.ParSecondImg4}></span>
                                                <span className={bIntro.ParSecondText10}>Method and system for creating related Standard</span>
                                                <span className={bIntro.ParSecondText11}>Operating Procedure</span>
                                                <span className={bIntro.ParSecondText12}>(2020)</span>
                                            </span>
                                            <span className={bIntro.ParSecondBox5}>
                                                <span className={bIntro.ParSecondImg5}></span>
                                                <span className={bIntro.ParSecondText13}>Intelligent Disaster Countermeasures Training</span>
                                                <span className={bIntro.ParSecondText14}>method and system thereof</span>
                                                <span className={bIntro.ParSecondText15}>(2019)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParThird}>
                                            <span className={bIntro.ParThirdBox1}>
                                                <span className={bIntro.ParThirdImg}></span>
                                                <span className={bIntro.ParThirdText}>System and method for prediction of environmental</span>
                                                <span className={bIntro.ParThirdText2}>pollution</span>
                                                <span className={bIntro.ParThirdText3}>(2017)</span>
                                            </span>
                                            <span className={bIntro.ParThirdBox2}>
                                                <span className={bIntro.ParThirdImg2}></span>
                                                <span className={bIntro.ParThirdText4}>DISASTER TIME BEHAVIOR</span>
                                                <span className={bIntro.ParThirdText5}>SUPPORT SYSTEM</span>
                                                <span className={bIntro.ParThirdText6}>(2016)</span>
                                            </span>
                                            <span className={bIntro.ParThirdBox3}>
                                                <span className={bIntro.ParThirdImg3}></span>
                                                <span className={bIntro.ParThirdText7}>Disaster detection system and providing method</span>
                                                <span className={bIntro.ParThirdText8}>thereof</span>
                                                <span className={bIntro.ParThirdText9}>(2015)</span>
                                            </span>
                                            <span className={bIntro.ParThirdBox4}>
                                                <span className={bIntro.ParThirdImg4}></span>
                                                <span className={bIntro.ParThirdText10}>SOP scenario executing system and providing</span>
                                                <span className={bIntro.ParThirdText11}>method thereof</span>
                                                <span className={bIntro.ParThirdText12}>(2015)</span>
                                            </span>
                                            <span className={bIntro.ParThirdBox5}>
                                                <span className={bIntro.ParThirdImg5}></span>
                                                <span className={bIntro.ParThirdText13}>Ecological environment evaluation system and</span>
                                                <span className={bIntro.ParThirdText14}>method thereof</span>
                                                <span className={bIntro.ParThirdText15}>(2014)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParFourth}>
                                            <span className={bIntro.ParFourthBox1}>
                                                <span className={bIntro.ParFourthImg}></span>
                                                <span className={bIntro.ParFourthText}>Intelligent Standard Operating Procedure system based on location</span>
                                                <span className={bIntro.ParFourthText2}>and providing method thereof</span>
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
                                    <div className={bIntro.comCertifiedTItle}>Certifications</div>
                                    <div className={bIntro.comCertifiedBox}>
                                        <div className={bIntro.CerFirst}>
                                            <span className={bIntro.CerFirstBox}>
                                                <span className={bIntro.CerFirstImg}></span>
                                                <span className={bIntro.CerFirstText}>Smart Disaster Management System Good</span>
                                                <span className={bIntro.CerFirstText2}>Software(Grade 1)</span>
                                                <span className={bIntro.CerFirstText3}>(TTA, 2022)</span>
                                            </span>
                                            <span className={bIntro.CerFirstBox2}>
                                                <span className={bIntro.CerFirstImg2}></span>
                                                <span className={bIntro.CerFirstText4}>Venture Company</span>
                                                <span className={bIntro.CerFirstText5}>Confirmation</span>
                                                <span className={bIntro.CerFirstText6}>(2022)</span>
                                            </span>
                                            <span className={bIntro.CerFirstBox3}>
                                                <span className={bIntro.CerFirstImg3}></span>
                                                <span className={bIntro.CerFirstText7}>Corporate R&D Center</span>
                                                <span className={bIntro.CerFirstText8}>Accreditation</span>
                                                <span className={bIntro.CerFirstText9}>(KOITA, 2022)</span>
                                            </span>
                                            <span className={bIntro.CerFirstBox4}>
                                                <span className={bIntro.CerFirstImg4}></span>
                                                <span className={bIntro.CerFirstText10}>Digital New deal Excellence</span>
                                                <span className={bIntro.CerFirstText11}>and Creation Company</span>
                                                <span className={bIntro.CerFirstText12}>(KCA, 2021)</span>
                                            </span>
                                            <span className={bIntro.CerFirstBox5}>
                                                <span className={bIntro.CerFirstImg5}></span>
                                                <span className={bIntro.CerFirstText13}>Technology innovation type small business(Inno-Biz)</span>
                                                <span className={bIntro.CerFirstText14}>Confirmation</span>
                                                <span className={bIntro.CerFirstText15}>(MSS, 2021)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.CerSecond}>
                                            <span className={bIntro.CerSecondBox}>
                                                <span className={bIntro.CerSecondImg}></span>
                                                <span className={bIntro.CerSecondText}>Software Business Enterprise Report</span>
                                                <span className={bIntro.CerSecondText2}>Confirmation</span>
                                                <span className={bIntro.CerSecondText3}>(KOSA, 2021)</span>
                                            </span>
                                            <span className={bIntro.CerSecondBox2}>
                                                <span className={bIntro.CerSecondImg2}></span>
                                                <span className={bIntro.CerSecondText4}>Direct Production</span>
                                                <span className={bIntro.CerSecondText5}>Confirmation</span>
                                                <span className={bIntro.CerSecondText6}>(KBIZ, 2021)</span>
                                            </span>
                                            <span className={bIntro.CerSecondBox3}>
                                                <span className={bIntro.CerSecondImg3}></span>
                                                <span className={bIntro.CerSecondText7}>Information and Communication</span>
                                                <span className={bIntro.CerSecondText8}>Construction Business Registration</span>
                                                <span className={bIntro.CerSecondText9}>(Daegu-si, 2020)</span>
                                            </span>
                                            <span className={bIntro.CerSecondBox4}></span>
                                            <span className={bIntro.CerSecondBox5}></span>
                                        </div>
                                    </div>
                                    {/************* 수상 *************/}
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comPrizeTItle}>Awards</div>
                                    <div className={bIntro.comPrizeBox}>
                                        <div className={bIntro.PrizeFirst}>
                                            <span className={bIntro.PrizeFirstBox}>
                                                <span className={bIntro.PrizeFirstImg}></span>
                                                <span className={bIntro.PrizeFirstText}>Award Certification from</span>
                                                <span className={bIntro.PrizeFirstText2}>Korea Gas Safety Corporation</span>
                                                <span className={bIntro.PrizeFirstText3}>(2023)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox2}>
                                                <span className={bIntro.PrizeFirstImg2}></span>
                                                <span className={bIntro.PrizeFirstText4}>Award Certification from</span>
                                                <span className={bIntro.PrizeFirstText5}>the Minister of MOIS</span>
                                                <span className={bIntro.PrizeFirstText6}>(2020)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox3}>
                                                <span className={bIntro.PrizeFirstImg3}></span>
                                                <span className={bIntro.PrizeFirstText7}>Award Certification from</span>
                                                <span className={bIntro.PrizeFirstText8}>K- BIZ</span>
                                                <span className={bIntro.PrizeFirstText9}>(2020)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox4}>
                                                <span className={bIntro.PrizeFirstImg4}></span>
                                                <span className={bIntro.PrizeFirstText10}>Award Certification from</span>
                                                <span className={bIntro.PrizeFirstText11}>the Mayor of Daegu Metropolitan City</span>
                                                <span className={bIntro.PrizeFirstText12}>(2019)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox5}>
                                                <span className={bIntro.PrizeFirstImg5}></span>
                                                <span className={bIntro.PrizeFirstText13}>Award Certification from</span>
                                                <span className={bIntro.PrizeFirstText14}>the Minister of MOIS</span>
                                                <span className={bIntro.PrizeFirstText15}>(2018)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox6}>
                                                <span className={bIntro.PrizeFirstImg6}></span>
                                                <span className={bIntro.PrizeFirstText16}></span>
                                                <span className={bIntro.PrizeFirstText17}></span>
                                                <span className={bIntro.PrizeFirstText18}></span>
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
            displayPerformanceUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={bIntro.bIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">Our Technology</span>
                            <span data-aos="fade-down" data-aos-duration="1000">Introduce U&E's safety management and digital twin technology capabilities, related patents and certifications.</span>
                        </div>
                        {/* 공간정보 구축 */}
                        <div id="sectionInforBuild">
                            <div className={bIntro.spatialInforContentsSect}>
                                <span className={bIntro.spatialTitle2} data-aos="fade-down" data-aos-duration="1000">Spatial Information Construction</span>
                                <div className={bIntro.spatialTextBoxTop}>
                                    <span className={bIntro.spatialTexts1}><span className={bIntro.businessTextBold} style={{ marginRight: '8px' }}>It builds and manages optimal indoor and outdoor spatial information</span><span>that operates smoothly in web and C/ S environments.</span></span>
                                    <span className={bIntro.spatialTexts2}>Through the IndoorGML-based data structure, it is easy to link legacy systems and sensors, expand services,</span>
                                    <span className={bIntro.spatialTexts3}>and visualize<span className={bIntro.businessTextBold} style={{ marginRight: '8px' }}>high-quality feature information above LoD 4 criteria</span>in 3D space.</span>
                                </div>

                                {/* <div className={bIntro.spatialTextBoxTop}>
                                    <span className={bIntro.spatialTexts1}>
                                        <span className={bIntro.businessTextBoldE}>It builds and manages optimal indoor and outdoor spatial information</span>
                                        that operates smoothly in web and C/ S environments.
                                    </span>
                                    <span className={bIntro.spatialTexts2}>
                                        Through the IndoorGML-based data structure, it is easy to link legacy systems and sensors, expand services, and visualize
                                        <span className={bIntro.businessTextBoldE}>high-quality feature information above LoD 4 criteria</span>in 3D space.
                                    </span>
                                </div> */}

                                <div className={bIntro.spatialFlexBox}>
                                    <span className={bIntro.spatialImgBox}>
                                        <span className={bIntro.spatialInforImg}></span>
                                    </span>
                                    <span className={bIntro.spatialTextBox}>
                                        <div className={bIntro.spTarget1}>Checkpoint</div>
                                        <div className={bIntro.spSubFlex1}>
                                            <span className={bIntro.spCheckIcon}></span>
                                            <span className={bIntro.spSubTitle1}>
                                                <p>Modeling Interior Space</p>
                                                <p>Using 2D Drawings and Images</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.spSubFlex2}>
                                            <span className={bIntro.spCheckIcon2}></span>
                                            <span className={bIntro.spSubTitle2}>
                                                <p>Compatible with</p>
                                                <p>Google Sketch- up</p>
                                                <p>and topology- based</p>
                                                <p>international standard</p>
                                                <p>spatial information modeling</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.spSubFlex3}>
                                            <span className={bIntro.spCheckIcon3}></span>
                                            <span className={bIntro.spSubTitle3}>
                                                <p>Building Lightweight</p>
                                                <p>Interior Modeling</p>
                                                <p></p>
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
                                    <span className={bIntro.eSopTexts1}><span>It is used for</span><span className={bIntro.businessTextBold} style={{ marginRight: '8px' }}>IT-based disaster response by digitizing existing standard action procedures</span><span>in the form of books and manuals.</span></span>
                                    <span className={bIntro.eSopTexts2}>Along with the response to training by disaster type, the<span className={bIntro.businessTextBold} style={{ marginRight: '8px' }}>step-by-step action tips</span>are guided in the event of an actual situation,</span>
                                    <span className={bIntro.eSopTexts3}>and provides situation transmission through emergency contact networks to enable<span className={bIntro.businessTextBold}>quick and efficient disaster response</span></span>
                                </div> 

                                {/* <div className={bIntro.eSopTextBoxTop}>
                                    <span className={bIntro.eSopTexts1}>
                                        It is used for<span className={bIntro.businessTextBoldE}>IT-based disaster response by digitizing existing standard action procedures</span>in the form of books and manuals.
                                    </span>
                                    <span className={bIntro.eSopTexts2}>
                                        Along with the response to training by disaster type, the<span className={bIntro.businessTextBoldE}>step-by-step action tips</span>are guided in the event of an actual situation,
                                        and provides situation transmission through emergency contact networks to enable<span className={bIntro.businessTextBoldE}>quick and efficient disaster response</span>
                                    </span>
                                </div> */}

                                <div className={bIntro.eSopFlexBox}>
                                    <span className={bIntro.eSopImgBox}>
                                        <span className={bIntro.eSopImg}></span>
                                    </span>
                                    <span className={bIntro.eSopTextBox}>
                                        <div className={bIntro.eSopTarget1}>Checkpoint</div>
                                        <div className={bIntro.eSopSubFlex1}>
                                            <span className={bIntro.eSopCheckIcon}></span>
                                            <span className={bIntro.eSopSubTitle1}>
                                                <p>Create and edit SOPs with</p>
                                                <p>GUI-based SW and</p>
                                                <p>save them as database</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.eSopSubFlex2}>
                                            <span className={bIntro.eSopCheckIcon2}></span>
                                            <span className={bIntro.eSopSubTitle2}>
                                                <p>Simulated training through</p>
                                                <p>digitalized SOPs</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.eSopSubFlex3}>
                                            <span className={bIntro.eSopCheckIcon3}></span>
                                            <span className={bIntro.eSopSubTitle3}>
                                                <p>Organizational management</p>
                                                <p>and transmission of situations</p>
                                                <p>through text messages etc.</p>
                                                <p>for emergency contact</p>
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
                                <span className={bIntro.dataTitle2} data-aos="fade-down" data-aos-duration="1000">Data Visualization</span>
                                <div className={bIntro.dataTextBoxTop}>
                                    <span className={bIntro.dataTexts1}>Various types of<span className={bIntro.businessTextBold}>data with spatial information to visualize and monitor.</span></span>
                                    <span className={bIntro.dataTexts2}><span className={bIntro.businessTextBold} style={{ marginRight: '8px' }}>Business and user information</span>stored in the system,<span className={bIntro.businessTextBold} style={{ marginRight: '8px' }}>real- time monitoring information</span>collected from IoT sensors,<span className={bIntro.businessTextBold}></span></span>
                                    <span className={bIntro.dataTexts3}><span className={bIntro.businessTextBold} style={{ marginRight: '8px' }}>Analysis/prediction information derived</span>from AI/ big data technology<span className={bIntro.businessTextBold}>is visualized by combining spatial information</span></span>
                                    <span className={bIntro.dataTexts4}>And<span className={bIntro.businessTextBold} style={{ marginRight: '8px' }}>expressed in various ways</span>such as tables/table and event streams.</span>
                                </div>

                                {/* <div className={bIntro.dataTextBoxTop}>
                                    <span className={bIntro.dataTexts1}>
                                        Various types of<span className={bIntro.businessTextBoldE}>data with spatial information to visualize and monitor.</span>
                                    </span>
                                    <span className={bIntro.dataTexts2}>
                                        <span className={bIntro.businessTextBoldE}>Business and user information</span>stored in the system, <span className={bIntro.businessTextBoldE}>real- time monitoring information</span>collected from IoT sensors,
                                        <span className={bIntro.businessTextBoldE}>Analysis/prediction information derived</span>from AI/ big data technology<span className={bIntro.businessTextBoldE}>is visualized by combining spatial information</span>
                                        And<span className={bIntro.businessTextBoldE}>expressed in various ways</span>such as tables/table and event streams.
                                    </span>
                                </div> */}

                                <div className={bIntro.dataFlexBox}>
                                    <span className={bIntro.dataImgBox}>
                                        <span className={bIntro.dataImg}></span>
                                    </span>
                                    <span className={bIntro.dataTextBox}>
                                        <div className={bIntro.dataTarget1}>Checkpoint</div>
                                        <div className={bIntro.dataSubFlex1}>
                                            <span className={bIntro.dataCheckIcon}></span>
                                            <span className={bIntro.dataSubTitle1}>
                                                <p>Visualize business</p>
                                                <p>and user information</p>
                                                <p>stored in DBMS, files, Log</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.dataSubFlex2}>
                                            <span className={bIntro.dataCheckIcon2}></span>
                                            <span className={bIntro.dataSubTitle2}>
                                                <p>Visualize real-time event</p>
                                                <p>stream information</p>
                                                <p>collected from IoT sensors</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.dataSubFlex3}>
                                            <span className={bIntro.dataCheckIcon3}></span>
                                            <span className={bIntro.dataSubTitle3}>
                                                <p>Combine with 3D space to</p>
                                                <p>visualize real-time events</p>
                                                <p>and historical history</p>
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
                                <span className={bIntro.systemTitle2} data-aos="fade-down" data-aos-duration="1000">System Integration</span>
                                <div className={bIntro.systemTextBoxTop}>
                                    <span className={bIntro.systemTexts1}>It<span className={bIntro.businessTextBold} style={{ marginRight: '8px' }}>connects and integrates systems, sensors, and data</span>used in various industries.</span>
                                    <span className={bIntro.systemTexts2}><span className={bIntro.businessTextBold}>It is possible to link and integrate legacy systems and CCTVs, sensors</span><span className={bIntro.businessTextBold}></span></span>
                                    <span className={bIntro.systemTexts3}><span className={bIntro.businessTextBold} style={{ marginRight: '8px' }}>new IoT sensors, and web services</span>that customers are using,</span>
                                    <span className={bIntro.systemTexts4}><span className={bIntro.businessTextBold}></span><span>And it supports</span><span className={bIntro.businessTextBold}>system linkage using API and on-premise cloud conversion.</span></span>
                                </div>

                                {/* <div className={bIntro.systemTextBoxTop}>
                                    <span className={bIntro.systemTexts1}>
                                        It<span className={bIntro.businessTextBoldE}>connects and integrates systems, sensors, and data</span>used in various industries.
                                    </span>
                                    <span className={bIntro.systemTexts2}>
                                        <span className={bIntro.businessTextBoldE}>It is possible to link and integrate legacy systems and CCTVs, sensors new IoT sensors, and web services</span>
                                        that customers are using, And it supports<span className={bIntro.businessTextBoldE}>system linkage using API and on-premise cloud conversion.</span>
                                    </span>
                                </div> */}

                                <div className={bIntro.systemFlexBox}>
                                    <span className={bIntro.systemImgBox}>
                                        <span className={bIntro.systemImg}></span>
                                    </span>
                                    <span className={bIntro.systemTextBox}>
                                        <div className={bIntro.systemTarget1}>Checkpoint</div>
                                        <div className={bIntro.systemSubFlex1}>
                                            <span className={bIntro.systemCheckIcon}></span>
                                            <span className={bIntro.systemSubTitle1}>
                                                <p>Deploy sensor-linked</p>
                                                <p>servers that operate</p>
                                                <p>with each protocol</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.systemSubFlex2}>
                                            <span className={bIntro.systemCheckIcon2}></span>
                                            <span className={bIntro.systemSubTitle2}>
                                                <p>Connect CCTV event</p>
                                                <p>and WEB-based video</p>
                                                <p>display separation</p>
                                            </span>
                                        </div>
                                        <div className={bIntro.systemSubFlex3}>
                                            <span className={bIntro.systemCheckIcon3}></span>
                                            <span className={bIntro.systemSubTitle3}>
                                                <p>Easy SaaS transition with</p>
                                                <p>Windows, Linux B/E support</p>
                                                <p>and front-end provision</p>
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
                                    <div className={bIntro.comPatConTItle2} data-aos="fade-down" data-aos-duration="1000">Patents and Certifications</div>
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comPatConTItle}>Patents</div>
                                    <div className={bIntro.comPatentBox}>
                                        <div className={bIntro.ParFirst}>
                                            <span className={bIntro.ParFirstBox1}>
                                                <span className={bIntro.ParFirstImg}></span>
                                                <span className={bIntro.ParFirstText}>Method and system for providing adaptive SOP according to emergent</span>
                                                <span className={bIntro.ParFirstText2}>situation during SOP training</span>
                                                <span className={bIntro.ParFirstText3}>(2022)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox2}>
                                                <span className={bIntro.ParFirstImg2}></span>
                                                <span className={bIntro.ParFirstText4}>Method and system for providing adaptive SOP</span>
                                                <span className={bIntro.ParFirstText5}>according to organization's situation</span>
                                                <span className={bIntro.ParFirstText6}>(2022)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox3}>
                                                <span className={bIntro.ParFirstImg3}></span>
                                                <span className={bIntro.ParFirstText7}>Method and system for managing grade of risk</span>
                                                <span className={bIntro.ParFirstText8}>alarm</span>
                                                <span className={bIntro.ParFirstText9}>(2022)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox4}>
                                                <span className={bIntro.ParFirstImg4}></span>
                                                <span className={bIntro.ParFirstText10}>Method and system for operating dynamic flight</span>
                                                <span className={bIntro.ParFirstText11}>restricted area</span>
                                                <span className={bIntro.ParFirstText12}>(2021)</span>
                                            </span>
                                            <span className={bIntro.ParFirstBox5}>
                                                <span className={bIntro.ParFirstImg5}></span>
                                                <span className={bIntro.ParFirstText13}>System and method for transitioning space</span>
                                                <span className={bIntro.ParFirstText14}>information</span>
                                                <span className={bIntro.ParFirstText15}>(2021)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParSecond}>
                                            <span className={bIntro.ParSecondBox1}>
                                                <span className={bIntro.ParSecondImg}></span>
                                                <span className={bIntro.ParSecondText}>Method and system for visualizing 3D flight paths</span>
                                                <span className={bIntro.ParSecondText2}>(2021)</span>
                                                <span className={bIntro.ParSecondText3}></span>
                                            </span>
                                            <span className={bIntro.ParSecondBox2}>
                                                <span className={bIntro.ParSecondImg2}></span>
                                                <span className={bIntro.ParSecondText4}>Method for disaster situation propagation and </span>
                                                <span className={bIntro.ParSecondText5}>system thereof</span>
                                                <span className={bIntro.ParSecondText6}>(2020)</span>
                                            </span>
                                            <span className={bIntro.ParSecondBox3}>
                                                <span className={bIntro.ParSecondImg3}></span>
                                                <span className={bIntro.ParSecondText7}>Disaster Countermeasures Training method capable to</span>
                                                <span className={bIntro.ParSecondText8}>make training scene and system thereof</span>
                                                <span className={bIntro.ParSecondText9}>(2020)</span>
                                            </span>
                                            <span className={bIntro.ParSecondBox4}>
                                                <span className={bIntro.ParSecondImg4}></span>
                                                <span className={bIntro.ParSecondText10}>Method and system for creating related Standard</span>
                                                <span className={bIntro.ParSecondText11}>Operating Procedure</span>
                                                <span className={bIntro.ParSecondText12}>(2020)</span>
                                            </span>
                                            <span className={bIntro.ParSecondBox5}>
                                                <span className={bIntro.ParSecondImg5}></span>
                                                <span className={bIntro.ParSecondText13}>Intelligent Disaster Countermeasures Training</span>
                                                <span className={bIntro.ParSecondText14}>method and system thereof</span>
                                                <span className={bIntro.ParSecondText15}>(2019)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParThird}>
                                            <span className={bIntro.ParThirdBox1}>
                                                <span className={bIntro.ParThirdImg}></span>
                                                <span className={bIntro.ParThirdText}>System and method for prediction of environmental</span>
                                                <span className={bIntro.ParThirdText2}>pollution</span>
                                                <span className={bIntro.ParThirdText3}>(2017)</span>
                                            </span>
                                            <span className={bIntro.ParThirdBox2}>
                                                <span className={bIntro.ParThirdImg2}></span>
                                                <span className={bIntro.ParThirdText4}>DISASTER TIME BEHAVIOR</span>
                                                <span className={bIntro.ParThirdText5}>SUPPORT SYSTEM</span>
                                                <span className={bIntro.ParThirdText6}>(2016)</span>
                                            </span>
                                            <span className={bIntro.ParThirdBox3}>
                                                <span className={bIntro.ParThirdImg3}></span>
                                                <span className={bIntro.ParThirdText7}>Disaster detection system and providing method</span>
                                                <span className={bIntro.ParThirdText8}>thereof</span>
                                                <span className={bIntro.ParThirdText9}>(2015)</span>
                                            </span>
                                            <span className={bIntro.ParThirdBox4}>
                                                <span className={bIntro.ParThirdImg4}></span>
                                                <span className={bIntro.ParThirdText10}>SOP scenario executing system and providing</span>
                                                <span className={bIntro.ParThirdText11}>method thereof</span>
                                                <span className={bIntro.ParThirdText12}>(2015)</span>
                                            </span>
                                            <span className={bIntro.ParThirdBox5}>
                                                <span className={bIntro.ParThirdImg5}></span>
                                                <span className={bIntro.ParThirdText13}>Ecological environment evaluation system and</span>
                                                <span className={bIntro.ParThirdText14}>method thereof</span>
                                                <span className={bIntro.ParThirdText15}>(2014)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.ParFourth}>
                                            <span className={bIntro.ParFourthBox1}>
                                                <span className={bIntro.ParFourthImg}></span>
                                                <span className={bIntro.ParFourthText}>Intelligent Standard Operating Procedure system based on location</span>
                                                <span className={bIntro.ParFourthText2}>and providing method thereof</span>
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
                                    <div className={bIntro.comCertifiedTItle}>Certifications</div>
                                    <div className={bIntro.comCertifiedBox}>
                                        <div className={bIntro.CerFirst}>
                                            <span className={bIntro.CerFirstBox}>
                                                <span className={bIntro.CerFirstImg}></span>
                                                <span className={bIntro.CerFirstText}>Smart Disaster Management System Good</span>
                                                <span className={bIntro.CerFirstText2}>Software(Grade 1)</span>
                                                <span className={bIntro.CerFirstText3}>(TTA, 2022)</span>
                                            </span>
                                            <span className={bIntro.CerFirstBox2}>
                                                <span className={bIntro.CerFirstImg2}></span>
                                                <span className={bIntro.CerFirstText4}>Venture Company</span>
                                                <span className={bIntro.CerFirstText5}>Confirmation</span>
                                                <span className={bIntro.CerFirstText6}>(2022)</span>
                                            </span>
                                            <span className={bIntro.CerFirstBox3}>
                                                <span className={bIntro.CerFirstImg3}></span>
                                                <span className={bIntro.CerFirstText7}>Corporate R&D Center</span>
                                                <span className={bIntro.CerFirstText8}>Accreditation</span>
                                                <span className={bIntro.CerFirstText9}>(KOITA, 2022)</span>
                                            </span>
                                            <span className={bIntro.CerFirstBox4}>
                                                <span className={bIntro.CerFirstImg4}></span>
                                                <span className={bIntro.CerFirstText10}>Digital New deal Excellence</span>
                                                <span className={bIntro.CerFirstText11}>and Creation Company</span>
                                                <span className={bIntro.CerFirstText12}>(KCA, 2021)</span>
                                            </span>
                                            <span className={bIntro.CerFirstBox5}>
                                                <span className={bIntro.CerFirstImg5}></span>
                                                <span className={bIntro.CerFirstText13}>Technology innovation type small business(Inno-Biz)</span>
                                                <span className={bIntro.CerFirstText14}>Confirmation</span>
                                                <span className={bIntro.CerFirstText15}>(MSS, 2021)</span>
                                            </span>
                                        </div>
                                        <div className={bIntro.CerSecond}>
                                            <span className={bIntro.CerSecondBox}>
                                                <span className={bIntro.CerSecondImg}></span>
                                                <span className={bIntro.CerSecondText}>Software Business Enterprise Report</span>
                                                <span className={bIntro.CerSecondText2}>Confirmation</span>
                                                <span className={bIntro.CerSecondText3}>(KOSA, 2021)</span>
                                            </span>
                                            <span className={bIntro.CerSecondBox2}>
                                                <span className={bIntro.CerSecondImg2}></span>
                                                <span className={bIntro.CerSecondText4}>Direct Production</span>
                                                <span className={bIntro.CerSecondText5}>Confirmation</span>
                                                <span className={bIntro.CerSecondText6}>(KBIZ, 2021)</span>
                                            </span>
                                            <span className={bIntro.CerSecondBox3}>
                                                <span className={bIntro.CerSecondImg3}></span>
                                                <span className={bIntro.CerSecondText7}>Information and Communication</span>
                                                <span className={bIntro.CerSecondText8}>Construction Business Registration</span>
                                                <span className={bIntro.CerSecondText9}>(Daegu-si, 2020)</span>
                                            </span>
                                            <span className={bIntro.CerSecondBox4}></span>
                                            <span className={bIntro.CerSecondBox5}></span>
                                        </div>
                                    </div>
                                    {/************* 수상 *************/}
                                    <span className={bIntro.comPatCircle}></span>
                                    <div className={bIntro.comPrizeTItle}>Awards</div>
                                    <div className={bIntro.comPrizeBox}>
                                        <div className={bIntro.PrizeFirst}>
                                            <span className={bIntro.PrizeFirstBox}>
                                                <span className={bIntro.PrizeFirstImg}></span>
                                                <span className={bIntro.PrizeFirstText}>Award Certification from</span>
                                                <span className={bIntro.PrizeFirstText2}>Korea Gas Safety Corporation</span>
                                                <span className={bIntro.PrizeFirstText3}>(2023)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox2}>
                                                <span className={bIntro.PrizeFirstImg2}></span>
                                                <span className={bIntro.PrizeFirstText4}>Award Certification from</span>
                                                <span className={bIntro.PrizeFirstText5}>the Minister of MOIS</span>
                                                <span className={bIntro.PrizeFirstText6}>(2020)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox3}>
                                                <span className={bIntro.PrizeFirstImg3}></span>
                                                <span className={bIntro.PrizeFirstText7}>Award Certification from</span>
                                                <span className={bIntro.PrizeFirstText8}>K- BIZ</span>
                                                <span className={bIntro.PrizeFirstText9}>(2020)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox4}>
                                                <span className={bIntro.PrizeFirstImg4}></span>
                                                <span className={bIntro.PrizeFirstText10}>Award Certification from</span>
                                                <span className={bIntro.PrizeFirstText11}>the Mayor of Daegu Metropolitan City</span>
                                                <span className={bIntro.PrizeFirstText12}>(2019)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox5}>
                                                <span className={bIntro.PrizeFirstImg5}></span>
                                                <span className={bIntro.PrizeFirstText13}>Award Certification from</span>
                                                <span className={bIntro.PrizeFirstText14}>the Minister of MOIS</span>
                                                <span className={bIntro.PrizeFirstText15}>(2018)</span>
                                            </span>
                                            <span className={bIntro.PrizeFirstBox6}>
                                                <span className={bIntro.PrizeFirstImg6}></span>
                                                <span className={bIntro.PrizeFirstText16}></span>
                                                <span className={bIntro.PrizeFirstText17}></span>
                                                <span className={bIntro.PrizeFirstText18}></span>
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

export default PerformanceSectionEng;