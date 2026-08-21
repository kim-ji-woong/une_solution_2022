import React, { Component } from 'react';
import { Link } from "react-router-dom";
import cIntro from '../CompanyIntro/css/company.module.css';
import home from '../components/css/home.module.css';
import $ from 'jquery';

import AOS from "aos";
import "aos/dist/aos.css";
//import Resource from '../resource/id';

class CompanySectionEng extends Component {
    static displayName = CompanySectionEng.name;

    constructor(props) {
        super(props);

        this.state = {

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
                            <span data-aos="fade-down" data-aos-duration="1000">About Us</span>
                            <span data-aos="fade-down" data-aos-duration="1000">Introduce U&E's CEO greetings, vision and values, history, and CI.</span>
                        </div>
                        {/* CEO 인사말 */}
                        <div className={cIntro.comGreeting} id="sectionCEO">
                            <span data-aos="fade-down" data-aos-duration="1000">CEO Greetings</span>
                            <div className={cIntro.ceoBox}>
                                <span className={cIntro.ceoPicture}></span>
                                <span className={cIntro.ceoBoxTextE}>CEO<span className={cIntro.ceoBoldTextE}>Wook-hyun Yeo</span></span>
                                <div className={cIntro.ceoTextBoxS}>
                                    <span>Safe space, Comfortable space, Easy-to-manage space.</span>
                                    <span>People in the smart world need the space to relax even for a short time.</span>
                                    <span>We, U&E is right in the center of that space.</span>
                                    <span>U&E is an IT-tech company that provides secure, convenient, customized space for users on a Digital Twin based technologies.</span>
                                    <span>With our accumulated technology and professional experience, we will continue to strive to achieve safe space, convenience,</span>
                                    <span>customized deployment, and reasonable costs to realize the safe value of the space our customers want and seek.</span>
                                    <span>Thank you.</span>
                                </div>
                            </div>
                        </div>
                        {/* vision */}
                        <div className={cIntro.comVision} id="sectionVision">
                            <span className={cIntro.comVTitle1} data-aos="fade-down" data-aos-duration="1000">Vision and Core Values</span>
                            <span className={cIntro.comVFlex}>
                                <span className={cIntro.comVCircle1}></span>
                                <span className={cIntro.comVTitle11}>Vision</span>
                                {/* <span className={cIntro.comVShape}>
                                    <span className={cIntro.comVCircle1}></span>
                                    <span className={cIntro.comVLine}></span>
                                    <span className={cIntro.comVCircle2}></span>
                                </span> */}
                                <span className={cIntro.comVTextBox}>
                                   <span className={cIntro.comVTitle2}>A digital space made with smart technology,<span className={cIntro.blueFont}>becomes a safe and secure space.</span></span>
                                </span>
                            </span>
                            <div className={cIntro.visionFlexBox}>
                                <div className={cIntro.vFlex1}>
                                    <div className={cIntro.vBox1}>Core values</div>
                                    <div className={cIntro.vBox2}>
                                        <span><span className={cIntro.vBoldText}>S</span>MART</span>
                                        <span>Smarter</span>
                                        <span>with the latest</span>
                                        <span>ICT technology</span>
                                    </div>
                                </div>
                                <div className={cIntro.vFlex2}>
                                    <div className={cIntro.vBox3}>Core values</div>
                                    <div className={cIntro.vBox4}>
                                        <span><span className={cIntro.vBoldText}>S</span>PACE</span>
                                        <span>Synchronize real world</span>
                                        <span>to virtual space</span>
                                        <span>with digital twin</span>
                                    </div>
                                </div>
                            </div>
                            <div className={cIntro.visionFlexBox2}>
                                <div className={cIntro.vFlex3}>
                                    <div className={cIntro.vBox5}>Core values</div>
                                    <div className={cIntro.vBox6}>
                                        <span><span className={cIntro.vBoldText}>S</span>AFETY</span>
                                        <span>People-centered</span>
                                        <span>safety is first</span>
                                        <span></span>
                                    </div>
                                </div>
                                <div className={cIntro.vFlex4}>
                                    <div className={cIntro.vBox7}>Core values</div>
                                    <div className={cIntro.vBox8}>
                                        <span><span className={cIntro.vBoldText}>S</span>ECURITY</span>
                                        <span>Secure from disasters</span>
                                        <span>with rapid and</span>
                                        <span>systematic response</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* history */}
                        <span className={cIntro.comHisTitle2} id="sectionHistory" data-aos="fade-down" data-aos-duration="1000">Major Histories</span>
                        <div className={cIntro.comHisContent}>
                            <div className={cIntro.comHisTable} border="1">
                                <div className={cIntro.com2022Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2022</span>
                                    </span>
                                    <div className={cIntro.com2022BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>May</span>
                                            <span className={cIntro.monthNumB}>000</span>
                                            <span className={cIntro.monthNum}>Apr</span>
                                            <span className={cIntro.monthNum}>Mar</span>
                                        </span>
                                        <span className={cIntro.comHisFlex3}>
                                            <span className={cIntro.historyText}>Patent application (Method and system for providing adaptive SOP according to organization's situation)</span>
                                            <span className={cIntro.historyText}>Patent application (Method and system for providing adaptive SOP according to emergent situation during SOP training)</span>
                                            <span className={cIntro.historyText}>Patent application (Crisis Alert Level Management Method and System)</span>
                                            <span className={cIntro.historyText}>Relocation of R&D Center</span>
                                        </span>
                                  </div>
                                </div>
                                <div className={cIntro.com2021Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2021</span>
                                    </span>
                                    <div className={cIntro.com2021BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>Oct</span>
                                            <span className={cIntro.monthNum}>Aug</span>
                                            <span className={cIntro.monthNum}>Jul</span>
                                            <span className={cIntro.monthNum}>Jun</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>Patent application (Method and system for operating dynamic flight restricted area)</span>
                                            <span className={cIntro.historyText}>Patent application (System and method for transitioning space information)</span>
                                            <span className={cIntro.historyText}>Patent registration (Method and system for visualizing 3D flight paths)</span>
                                            <span className={cIntro.historyText}>Change of major shareholders and inauguration of CEO (Wook-hyun Yeo)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2020Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2020</span>
                                    </span>
                                    <div className={cIntro.com2020BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>Oct</span>
                                            <span className={cIntro.monthNum}>May</span>
                                            <span className={cIntro.monthNumB}>00</span>
                                            <span className={cIntro.monthNum}>Jan</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>Patent registration (Method for disaster situation propagation and system thereof)</span>
                                            <span className={cIntro.historyText}>Patent registration (Method and system for creating related Standard Operating Procedure)</span>
                                            <span className={cIntro.historyText}>Patent registration (Disaster Countermeasures Training method capable to make training scene and system thereof)</span>
                                            <span className={cIntro.historyText}>Registration of Information and communication construction business</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2019Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2019</span>
                                    </span>
                                    <div className={cIntro.com2019BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>Sep</span>
                                            <span className={cIntro.monthNum}>Aug</span>
                                            <span className={cIntro.monthNum}>May</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>Patent registration (Intelligent Disaster Countermeasures Training method and system thereof)</span>
                                            <span className={cIntro.historyText}>Certification of inno-Biz company (Technology innovative small and medium-sized enterprises)</span>
                                            <span className={cIntro.historyText}>R&D center name changed (Disaster Safety Technology Research Center)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2018Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2018</span>
                                    </span>
                                    <div className={cIntro.com2018BoxFlex}>
                                    <span>
                                        <span className={cIntro.monthNum}>Jun</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Registration of R&D service business</span>
                                    </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2017Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2017</span>
                                    </span>
                                    <div className={cIntro.com2017BoxFlex}>
                                    <span>
                                        <span className={cIntro.monthNum}>Aug</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Patent Registration (System and method for prediction of environmental pollution)</span>
                                    </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2016Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2016</span>
                                    </span>
                                    <div className={cIntro.com2016BoxFlex}>
                                    <span>
                                        <span className={cIntro.monthNum}>Oct</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Japanese Patent registration (Disaster Time Behavior Support System)</span>
                                    </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2015Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2015</span>
                                    </span>
                                    <div className={cIntro.com2015BoxFlex}>
                                    <span>
                                        <span className={cIntro.monthNum}>Oct</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                        <span className={cIntro.monthNum}>Apr</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Patent registration (Disaster detection system and providing method thereof)</span>
                                        <span className={cIntro.historyText}>Selection of Achievement-sharing enterprise</span>
                                        <span className={cIntro.historyText}>Patent registration (SOP scenario executing system and providing method thereof)</span>
                                    </span>
                                </div>
                                </div>
                                <div className={cIntro.com2014Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2014</span>
                                    </span>
                                    <div className={cIntro.com2014BoxFlex}>
                                    <span>
                                        <span className={cIntro.monthNum}>Sep</span>
                                        <span className={cIntro.monthNum}>Jan</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Registration of Korea South-East Power Co., Ltd. development selection product</span>
                                        <span className={cIntro.historyText}>Patent registration (Ecological environment evaluation system and method thereof)</span>
                                    </span>
                                </div>
                                </div>
                                <div className={cIntro.com2013Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2013</span>
                                    </span>
                                    <div className={cIntro.com2013BoxFlex}>
                                    <span>
                                        <span className={cIntro.monthNum}>Jun</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Patent registration (Intelligent Standard Operating Procedure system based on location and providing method thereof)</span>
                                    </span>
                                </div>
                                </div>
                                <div className={cIntro.com2012Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2012</span>
                                    </span>
                                    <div className={cIntro.com2012BoxFlex}>
                                    <span>
                                        <span className={cIntro.monthNum}>Jul</span>
                                        <span className={cIntro.monthNum}>Jan</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Certification of Direct production by Federation of Small and Medium Business (Software development)</span>
                                        <span className={cIntro.historyText}>Certification of Venture company</span>
                                        <span className={cIntro.historyText}>Report of Engineering business (water quality, waste, noise, vibration)</span>
                                    </span>
                                </div>
                                </div>
                                <div className={cIntro.com2011Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2011</span>
                                    </span>
                                    <div className={cIntro.com2011BoxFlex}>
                                    <span>
                                        <span className={cIntro.monthNum}>Apr</span>
                                        <span className={cIntro.monthNum}>Mar</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Establishment and registration of R&D center</span>
                                        <span className={cIntro.historyText}>Establishment of company</span>
                                    </span>
                                </div>
                                </div>
                            </div>
                        </div>

                        {/* CI */}
                        <div className={cIntro.comLogoContent} id="sectionCI">
                            <span className={cIntro.comLTitle} data-aos="fade-down" data-aos-duration="1000">Introduction to CI</span>
                            {/* <span className={cIntro.comLSubTitle}>{Resource.ID.CI.CISubTitle}</span> */}
                            <div className={cIntro.DownBox}>
                                <div className={cIntro.CIDownBox}>
                                    <span></span>
                                    <span>Korean CI</span>
                                </div>
                                <div className={cIntro.CIDownBox2}>
                                    <span></span>
                                    <span>English CI</span>
                                </div>
                            </div>
                            <a href="../../resource/logo design_update.ai" download>
                                <span className={cIntro.ClDownArea}>Download CI</span>
                            </a>
                        </div>
                        <div className={cIntro.comCIContent2}>
                            <span className={cIntro.comCircle}></span>
                            <span className={cIntro.comCSubTitle}>Symbols and Colors</span>
                            <div className={cIntro.comCFlexBox}>
                                <div className={cIntro.comSimbolBox}>
                                    <div className={cIntro.simbol}></div>
                                    <div className={cIntro.comSimbolText}>
                                        <p>The 3D symbol is Digital Twin Based</p>
                                        <p>It symbolizes the expertise of</p>
                                        <p>spatial information construction.</p>
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
                                        <p>Warning signs, fire extinguishers, alarms, etc</p>
                                        <p>The representative safety color red</p>
                                        <p>represents a safety-leading company</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={home.footBox}>
                            <div className={home.footLeftArea}>
                                <div className={home.footTitleBox}>
                                    <span>U&E</span>
                                    <a href="../../resource/une_companyInfo_2024.pdf" download>
                                        <span className={home.companyDown}>Company Introduction
                                            <span className={home.companyImg}></span>
                                        </span>
                                    </a>
                                </div>
                                <div className={home.footContents}>
                                    <div className={home.footConTop}>
                                        <span>Corporate Registration Number: 502-86-09535</span>
                                        <span className={home.footBorder}></span>
                                        <span>Tel: 82-2-714-4133</span>
                                        <span className={home.footBorder}></span>
                                        <span>Fax: 82-2-714-4134 </span>
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
        } else if (640 <= widthSize && widthSize <= 959) {  /* 가로 모바일 */
            displayCompanyUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={cIntro.comIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">About Us</span>
                            <span data-aos="fade-down" data-aos-duration="1000">Introduce U&E's CEO greetings, vision and values, history, and CI.</span>
                        </div>
                        {/* CEO 인사말 */}
                        <div className={cIntro.comGreeting} id="sectionCEO">
                            <span data-aos="fade-down" data-aos-duration="1000">CEO Greetings</span>
                            <div className={cIntro.ceoBox}>
                                <span className={cIntro.ceoPicture}></span>
                                <span className={cIntro.ceoBoxTextE}>CEO<span className={cIntro.ceoBoldTextE}>Wook-hyun Yeo</span></span>
                                <div className={cIntro.ceoTextBoxS}>
                                    <span>Safe space, Comfortable space, Easy-to-manage space.</span>
                                    <span>People in the smart world need the space to relax even for a short time.</span>
                                    <span>We, U&E is right in the center of that space.</span>
                                    <span>U&E is an IT-tech company that provides secure, convenient, customized space for users on a Digital Twin based technologies.</span>
                                    <span>With our accumulated technology and professional experience, we will continue to strive to achieve safe space, convenience,</span>
                                    <span>customized deployment, and reasonable costs to realize the safe value of the space our customers want and seek.</span>
                                    <span>Thank you.</span>
                                </div>
                            </div>
                        </div>
                        {/* vision */}
                        <div className={cIntro.comVision} id="sectionVision">
                            <span className={cIntro.comVTitle1} data-aos="fade-down" data-aos-duration="1000">Vision and Core Values</span>
                            <span className={cIntro.comVFlex}>
                                <span className={cIntro.comVCircle1}></span>
                                <span className={cIntro.comVTitle11}>Vision</span>
                                {/* <span className={cIntro.comVShape}>
                                    <span className={cIntro.comVCircle1}></span>
                                    <span className={cIntro.comVLine}></span>
                                    <span className={cIntro.comVCircle2}></span>
                                </span> */}
                                <span className={cIntro.comVTextBox}>
                                    <span className={cIntro.comVTitle2}>A digital space made with smart technology,<span className={cIntro.blueFont}>becomes a safe and secure space.</span></span>
                                </span>
                            </span>
                            <div className={cIntro.visionFlexBox}>
                                <div className={cIntro.vFlex1}>
                                    <div className={cIntro.vBox1}>Core values 1</div>
                                    <div className={cIntro.vBox2}>
                                        <span><span className={cIntro.vBoldText}>S</span>MART</span>
                                        <span>Smarter</span>
                                        <span>with the latest</span>
                                        <span>ICT technology</span>
                                    </div>
                                </div>
                                <div className={cIntro.vFlex2}>
                                    <div className={cIntro.vBox3}>Core values 2</div>
                                    <div className={cIntro.vBox4}>
                                        <span><span className={cIntro.vBoldText}>S</span>PACE</span>
                                        <span>Synchronize real world</span>
                                        <span>to virtual space</span>
                                        <span>with digital twin</span>
                                    </div>
                                </div>
                            </div>
                            <div className={cIntro.visionFlexBox2}>
                                <div className={cIntro.vFlex3}>
                                    <div className={cIntro.vBox5}>Core values 3</div>
                                    <div className={cIntro.vBox6}>
                                        <span><span className={cIntro.vBoldText}>S</span>AFETY</span>
                                        <span>People-centered</span>
                                        <span>safety is first</span>
                                        <span></span>
                                    </div>
                                </div>
                                <div className={cIntro.vFlex4}>
                                    <div className={cIntro.vBox7}>Core values 4</div>
                                    <div className={cIntro.vBox8}>
                                        <span><span className={cIntro.vBoldText}>S</span>ECURITY</span>
                                        <span>Secure from disasters</span>
                                        <span>with rapid and</span>
                                        <span>systematic response</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* history */}
                        <span className={cIntro.comHisTitle2} id="sectionHistory" data-aos="fade-down" data-aos-duration="1000">Major Histories</span>
                        <div className={cIntro.comHisContent}>
                            <div className={cIntro.comHisTable} border="1">
                                <div className={cIntro.com2022Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2022</span>
                                    </span>
                                    <div className={cIntro.com2022BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>May</span>
                                            <span className={cIntro.monthNumB}>000</span>
                                            <span className={cIntro.monthNum}>Apr</span>
                                            <span className={cIntro.monthNum}>Mar</span>
                                        </span>
                                        <span className={cIntro.comHisFlex3}>
                                            <span className={cIntro.historyText}>Patent application (Method and system for providing adaptive SOP according to organization's situation)</span>
                                            <span className={cIntro.historyText}>Patent application (Method and system for providing adaptive SOP according to emergent situation during SOP training)</span>
                                            <span className={cIntro.historyText}>Patent application (Crisis Alert Level Management Method and System)</span>
                                            <span className={cIntro.historyText}>Relocation of R&D Center</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2021Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2021</span>
                                    </span>
                                    <div className={cIntro.com2021BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>Oct</span>
                                            <span className={cIntro.monthNum}>Aug</span>
                                            <span className={cIntro.monthNum}>Jul</span>
                                            <span className={cIntro.monthNum}>Jun</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>Patent application (Method and system for operating dynamic flight restricted area)</span>
                                            <span className={cIntro.historyText}>Patent application (System and method for transitioning space information)</span>
                                            <span className={cIntro.historyText}>Patent registration (Method and system for visualizing 3D flight paths)</span>
                                            <span className={cIntro.historyText}>Change of major shareholders and inauguration of CEO (Wook-hyun Yeo)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2020Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2020</span>
                                    </span>
                                    <div className={cIntro.com2020BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>Oct</span>
                                            <span className={cIntro.monthNum}>May</span>
                                            <span className={cIntro.monthNumB}>00</span>
                                            <span className={cIntro.monthNum}>Jan</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>Patent registration (Method for disaster situation propagation and system thereof)</span>
                                            <span className={cIntro.historyText}>Patent registration (Method and system for creating related Standard Operating Procedure)</span>
                                            <span className={cIntro.historyText}>Patent registration (Disaster Countermeasures Training method capable to make training scene and system thereof)</span>
                                            <span className={cIntro.historyText}>Registration of Information and communication construction business</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2019Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2019</span>
                                    </span>
                                    <div className={cIntro.com2019BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>Sep</span>
                                            <span className={cIntro.monthNum}>Aug</span>
                                            <span className={cIntro.monthNum}>May</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>Patent registration (Intelligent Disaster Countermeasures Training method and system thereof)</span>
                                            <span className={cIntro.historyText}>Certification of inno-Biz company (Technology innovative small and medium-sized enterprises)</span>
                                            <span className={cIntro.historyText}>R&D center name changed (Disaster Safety Technology Research Center)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2018Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2018</span>
                                    </span>
                                    <div className={cIntro.com2018BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>Jun</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>Registration of R&D service business</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2017Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2017</span>
                                    </span>
                                    <div className={cIntro.com2017BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>Aug</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>Patent Registration (System and method for prediction of environmental pollution)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2016Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2016</span>
                                    </span>
                                    <div className={cIntro.com2016BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>Oct</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>Japanese Patent registration (Disaster Time Behavior Support System)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2015Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2015</span>
                                    </span>
                                    <div className={cIntro.com2015BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>Oct</span>
                                            <span className={cIntro.monthNumB}>00</span>
                                            <span className={cIntro.monthNum}>Apr</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>Patent registration (Disaster detection system and providing method thereof)</span>
                                            <span className={cIntro.historyText}>Selection of Achievement-sharing enterprise</span>
                                            <span className={cIntro.historyText}>Patent registration (SOP scenario executing system and providing method thereof)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2014Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2014</span>
                                    </span>
                                    <div className={cIntro.com2014BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>Sep</span>
                                            <span className={cIntro.monthNum}>Jan</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>Registration of Korea South-East Power Co., Ltd. development selection product</span>
                                            <span className={cIntro.historyText}>Patent registration (Ecological environment evaluation system and method thereof)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2013Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2013</span>
                                    </span>
                                    <div className={cIntro.com2013BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>Jun</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>Patent registration (Intelligent Standard Operating Procedure system based on location and providing method thereof)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2012Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2012</span>
                                    </span>
                                    <div className={cIntro.com2012BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>Jul</span>
                                            <span className={cIntro.monthNum}>Jan</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>Certification of Direct production by Federation of Small and Medium Business (Software development)</span>
                                            <span className={cIntro.historyText}>Certification of Venture company</span>
                                            <span className={cIntro.historyText}>Report of Engineering business (water quality, waste, noise, vibration)</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={cIntro.com2011Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2011</span>
                                    </span>
                                    <div className={cIntro.com2011BoxFlex}>
                                        <span>
                                            <span className={cIntro.monthNum}>Apr</span>
                                            <span className={cIntro.monthNum}>Mar</span>
                                        </span>
                                        <span>
                                            <span className={cIntro.historyText}>Establishment and registration of R&D center</span>
                                            <span className={cIntro.historyText}>Establishment of company</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CI */}
                        <div className={cIntro.comLogoContent} id="sectionCI">
                            <span className={cIntro.comLTitle} data-aos="fade-down" data-aos-duration="1000">Introduction to CI</span>
                            {/* <span className={cIntro.comLSubTitle}>{Resource.ID.CI.CISubTitle}</span> */}
                            <div className={cIntro.DownBox}>
                                <div className={cIntro.CIDownBox}>
                                    <span></span>
                                    <span>Korean CI</span>
                                </div>
                                <div className={cIntro.CIDownBox2}>
                                    <span></span>
                                    <span>English CI</span>
                                </div>
                            </div>
                            <a href="../../resource/logo design_update.ai" download>
                                <span className={cIntro.ClDownArea}>Download CI</span>
                            </a>
                        </div>
                        <div className={cIntro.comCIContent2}>
                            <span className={cIntro.comCircle}></span>
                            <span className={cIntro.comCSubTitle}>Symbols and Colors</span>
                            <div className={cIntro.comCFlexBox}>
                                <div className={cIntro.comSimbolBox}>
                                    <div className={cIntro.simbol}></div>
                                    <div className={cIntro.comSimbolText}>
                                        <p>The 3D symbol is Digital Twin Based</p>
                                        <p>It symbolizes the expertise of</p>
                                        <p>spatial information construction.</p>
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
                                        <p>Warning signs, fire extinguishers, alarms, etc</p>
                                        <p>The representative safety color red</p>
                                        <p>represents a safety-leading company</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={home.footBox}>
                            <div className={home.footLeftArea}>
                                <div className={home.footTitleBox}>
                                    <span>U&E</span>
                                    <a href="../../resource/une_companyInfo_2024.pdf" download>
                                        <span className={home.companyDown}>Company Introduction
                                            <span className={home.companyImg}></span>
                                        </span>
                                    </a>
                                </div>
                                <div className={home.footContents}>
                                    <div className={home.footConTop}>
                                        <span>Corporate Registration Number: 502-86-09535</span>
                                        <span className={home.footBorder}></span>
                                        <span>Tel: 82-2-714-4133</span>
                                        <span className={home.footBorder}></span>
                                        <span>Fax: 82-2-714-4134 </span>
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
        } else if (768 <= widthSize && widthSize <= 1023) { //태블릿
            displayCompanyUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={cIntro.comIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">About Us</span>
                            <span data-aos="fade-down" data-aos-duration="1000">Introduce U&E's CEO greetings, vision and values, history, and CI.</span>
                        </div>
                        {/* CEO 인사말 */}
                        <div className={cIntro.comGreeting} id="sectionCEO">
                            <span data-aos="fade-down" data-aos-duration="1000">CEO Greetings</span>
                            <div className={cIntro.ceoBox}>
                                <span className={cIntro.ceoPicture}></span>
                                <div className={cIntro.ceoTextBoxS}>
                                    <span>Safe space, Comfortable space, Easy-to-manage space.</span>
                                    <span>People in the smart world need the space to relax even for a short time.</span>
                                    <span>We, U&E is right in the center of that space.</span>
                                    <span>U&E is an IT-tech company that provides secure, convenient, customized space for users on a Digital Twin based technologies.</span>
                                    <span>With our accumulated technology and professional experience, we will continue to strive to achieve safe space, convenience,</span>
                                    <span>customized deployment, and reasonable costs to realize the safe value of the space our customers want and seek.</span>
                                    <span>Thank you.</span>
                                    <span>CEO<span className={cIntro.ceoBoldText}>Wook-hyun Yeo</span></span>
                                </div>
                            </div>
                        </div>
                        {/* vision */}
                        <div className={cIntro.comVision} id="sectionVision">
                            <span className={cIntro.comVTitle1} data-aos="fade-down" data-aos-duration="1000">Vision and Core Values</span>
                            <span className={cIntro.comVFlex}>
                                <span className={cIntro.comVTitle11}>Vision</span>
                                <span className={cIntro.comVShape}>
                                    <span className={cIntro.comVCircle1}></span>
                                    <span className={cIntro.comVLine}></span>
                                    <span className={cIntro.comVCircle2}></span>
                                </span>
                                <span className={cIntro.comVTitle2}>A digital space made with smart technology,<span className={cIntro.blueFont}>becomes a safe and secure space.</span></span>
                            </span>
                            <div className={cIntro.visionFlexBox}>
                                <div className={cIntro.vFlex1}>
                                    <div className={cIntro.vBox1}>Core values 1</div>
                                    <div className={cIntro.vBox2}>
                                        <span><span className={cIntro.vBoldText}>S</span>MART</span>
                                        <span>Smarter</span>
                                        <span>with the latest</span>
                                        <span>ICT technology</span>
                                    </div>
                                </div>
                                <div className={cIntro.vFlex2}>
                                    <div className={cIntro.vBox3}>Core values 2</div>
                                    <div className={cIntro.vBox4}>
                                        <span><span className={cIntro.vBoldText}>S</span>PACE</span>
                                        <span>Synchronize real world</span>
                                        <span>to virtual space</span>
                                        <span>with digital twin</span>
                                    </div>
                                </div>
                                <div className={cIntro.vFlex3}>
                                    <div className={cIntro.vBox5}>Core values 3</div>
                                    <div className={cIntro.vBox6}>
                                        <span><span className={cIntro.vBoldText}>S</span>AFETY</span>
                                        <span>People-centered</span>
                                        <span>safety is first</span>
                                        <span></span>
                                    </div>
                                </div>
                                <div className={cIntro.vFlex4}>
                                    <div className={cIntro.vBox7}>Core values 4</div>
                                    <div className={cIntro.vBox8}>
                                        <span><span className={cIntro.vBoldText}>S</span>ECURITY</span>
                                        <span>Secure from disasters</span>
                                        <span>with rapid and</span>
                                        <span>systematic response</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* history */}
                        <span className={cIntro.comHisTitle2} id="sectionHistory" data-aos="fade-down" data-aos-duration="1000">Major Histories</span>
                        <div className={cIntro.comHisContent}>
                            <div className={cIntro.comHisTable} border="1">
                                <div className={cIntro.com2022Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2022</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>May</span>
                                        <span className={cIntro.monthNumB}>000</span>
                                        <span className={cIntro.monthNum}>Apr</span>
                                        <span className={cIntro.monthNum}>Mar</span>
                                    </span>
                                    <span className={cIntro.comHisFlex3}>
                                        <span className={cIntro.historyText}>Patent application (Method and system for providing adaptive SOP according to organization's situation)</span>
                                        <span className={cIntro.historyText}>Patent application (Method and system for providing adaptive SOP according to emergent situation during SOP training)</span>
                                        <span className={cIntro.historyText}>Patent application (Crisis Alert Level Management Method and System)</span>
                                        <span className={cIntro.historyText}>Relocation of R&D Center</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2021Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2021</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Oct</span>
                                        <span className={cIntro.monthNum}>Aug</span>
                                        <span className={cIntro.monthNum}>Jul</span>
                                        <span className={cIntro.monthNum}>Jun</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Patent application (Method and system for operating dynamic flight restricted area)</span>
                                        <span className={cIntro.historyText}>Patent application (System and method for transitioning space information)</span>
                                        <span className={cIntro.historyText}>Patent registration (Method and system for visualizing 3D flight paths)</span>
                                        <span className={cIntro.historyText}>Change of major shareholders and inauguration of CEO (Wook-hyun Yeo)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2020Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2020</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Oct</span>
                                        <span className={cIntro.monthNum}>May</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                        <span className={cIntro.monthNum}>Jan</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Patent registration (Method for disaster situation propagation and system thereof)</span>
                                        <span className={cIntro.historyText}>Patent registration (Method and system for creating related Standard Operating Procedure)</span>
                                        <span className={cIntro.historyText}>Patent registration (Disaster Countermeasures Training method capable to make training scene and system thereof)</span>
                                        <span className={cIntro.historyText}>Registration of Information and communication construction business</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2019Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2019</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Sep</span>
                                        <span className={cIntro.monthNum}>Aug</span>
                                        <span className={cIntro.monthNum}>May</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Patent registration (Intelligent Disaster Countermeasures Training method and system thereof)</span>
                                        <span className={cIntro.historyText}>Certification of inno-Biz company (Technology innovative small and medium-sized enterprises)</span>
                                        <span className={cIntro.historyText}>R&D center name changed (Disaster Safety Technology Research Center)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2018Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2018</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Jun</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Registration of R&D service business</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2017Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2017</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Aug</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Patent Registration (System and method for prediction of environmental pollution)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2016Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2016</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Oct</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Japanese Patent registration (Disaster Time Behavior Support System)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2015Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2015</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Oct</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                        <span className={cIntro.monthNum}>Apr</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Patent registration (Disaster detection system and providing method thereof)</span>
                                        <span className={cIntro.historyText}>Selection of Achievement-sharing enterprise</span>
                                        <span className={cIntro.historyText}>Patent registration (SOP scenario executing system and providing method thereof)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2014Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2014</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Sep</span>
                                        <span className={cIntro.monthNum}>Jan</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Registration of Korea South-East Power Co., Ltd. development selection product</span>
                                        <span className={cIntro.historyText}>Patent registration (Ecological environment evaluation system and method thereof)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2013Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2013</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Jun</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Patent registration (Intelligent Standard Operating Procedure system based on location and providing method thereof)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2012Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2012</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Jul</span>
                                        <span className={cIntro.monthNum}>Jan</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Certification of Direct production by Federation of Small and Medium Business (Software development)</span>
                                        <span className={cIntro.historyText}>Certification of Venture company</span>
                                        <span className={cIntro.historyText}>Report of Engineering business (water quality, waste, noise, vibration)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2011Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2011</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Apr</span>
                                        <span className={cIntro.monthNum}>Mar</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Establishment and registration of R&D center</span>
                                        <span className={cIntro.historyText}>Establishment of company</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* CI */}
                        <div className={cIntro.comLogoContent} id="sectionCI">
                            <span className={cIntro.comLTitle} data-aos="fade-down" data-aos-duration="1000">Introduction to CI</span>
                            {/* <span className={cIntro.comLSubTitle}>{Resource.ID.CI.CISubTitle}</span> */}
                            <div className={cIntro.DownBox}>
                                <div className={cIntro.CIDownBox}>
                                    <span></span>
                                    <span>Korean CI</span>
                                </div>
                                <div className={cIntro.CIDownBox2}>
                                    <span></span>
                                    <span>English CI</span>
                                </div>
                            </div>
                            <a href="../../resource/logo design_update.ai" download>
                                <span className={cIntro.ClDownArea}>Download CI</span>
                            </a>
                        </div>
                        <div className={cIntro.comCIContent2}>
                            <span className={cIntro.comCircle}></span>
                            <span className={cIntro.comCSubTitle}>Symbols and Colors</span>
                            <div className={cIntro.comCFlexBox}>
                                <div className={cIntro.comSimbolBox}>
                                    <div className={cIntro.simbol}></div>
                                    <div className={cIntro.comSimbolText}>
                                        <p>The 3D symbol is Digital Twin Based</p>
                                        <p>It symbolizes the expertise of</p>
                                        <p>spatial information construction.</p>
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
                                        <p>Warning signs, fire extinguishers, alarms, etc</p>
                                        <p>The representative safety color red</p>
                                        <p>represents a safety-leading company</p>
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
                                        <span>Fax: 82-2-714-4134 </span>
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
            displayCompanyUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={cIntro.comIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">About Us</span>
                            <span data-aos="fade-down" data-aos-duration="1000">Introduce U&E's CEO greetings, vision and values, history, and CI.</span>
                        </div>
                        {/* CEO 인사말 */}
                        <div className={cIntro.comGreeting} id="sectionCEO">
                            <span data-aos="fade-down" data-aos-duration="1000">CEO Greetings</span>
                            <div className={cIntro.ceoBox}>
                                <span className={cIntro.ceoPicture}></span>
                                <div className={cIntro.ceoTextBoxS}>
                                    <span>Safe space, Comfortable space, Easy-to-manage space.</span>
                                    <span>People in the smart world need the space to relax even for a short time.</span>
                                    <span>We, U&E is right in the center of that space.</span>
                                    <span>U&E is an IT-tech company that provides secure, convenient, customized space for users on a Digital Twin based technologies.</span>
                                    <span>With our accumulated technology and professional experience, we will continue to strive to achieve safe space, convenience,</span>
                                    <span>customized deployment, and reasonable costs to realize the safe value of the space our customers want and seek.</span>
                                    <span>Thank you.</span>
                                    <span>CEO<span className={cIntro.ceoBoldText}>Wook-hyun Yeo</span></span>
                                </div>
                            </div>
                        </div>
                        {/* vision */}
                        <div className={cIntro.comVision} id="sectionVision">
                            <span className={cIntro.comVTitle1} data-aos="fade-down" data-aos-duration="1000">Vision and Core Values</span>
                            <span className={cIntro.comVFlex}>
                                <span className={cIntro.comVTitle11}>Vision</span>
                                <span className={cIntro.comVShape}>
                                    <span className={cIntro.comVCircle1}></span>
                                    <span className={cIntro.comVLine}></span>
                                    <span className={cIntro.comVCircle2}></span>
                                </span>
                                <span className={cIntro.comVTitle2}>A digital space made with smart technology,<span className={cIntro.blueFont}>becomes a safe and secure space.</span></span>
                            </span>
                            <div className={cIntro.visionFlexBox}>
                                <div className={cIntro.vFlex1}>
                                    <div className={cIntro.vBox1}>Core values 1</div>
                                    <div className={cIntro.vBox2}>
                                        <span><span className={cIntro.vBoldText}>S</span>MART</span>
                                        <span>Smarter</span>
                                        <span>with the latest</span>
                                        <span>ICT technology</span>
                                    </div>
                                </div>
                                <div className={cIntro.vFlex2}>
                                    <div className={cIntro.vBox3}>Core values 2</div>
                                    <div className={cIntro.vBox4}>
                                        <span><span className={cIntro.vBoldText}>S</span>PACE</span>
                                        <span>Synchronize real world</span>
                                        <span>to virtual space</span>
                                        <span>with digital twin</span>
                                    </div>
                                </div>
                                <div className={cIntro.vFlex3}>
                                    <div className={cIntro.vBox5}>Core values 3</div>
                                    <div className={cIntro.vBox6}>
                                        <span><span className={cIntro.vBoldText}>S</span>AFETY</span>
                                        <span>People-centered</span>
                                        <span>safety is first</span>
                                        <span></span>
                                    </div>
                                </div>
                                <div className={cIntro.vFlex4}>
                                    <div className={cIntro.vBox7}>Core values 4</div>
                                    <div className={cIntro.vBox8}>
                                        <span><span className={cIntro.vBoldText}>S</span>ECURITY</span>
                                        <span>Secure from disasters</span>
                                        <span>with rapid and</span>
                                        <span>systematic response</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* history */}
                        <span className={cIntro.comHisTitle2} id="sectionHistory" data-aos="fade-down" data-aos-duration="1000">Major Histories</span>
                        <div className={cIntro.comHisContent}>
                            <div className={cIntro.comHisTable} border="1">
                                <div className={cIntro.com2022Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2022</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>May</span>
                                        <span className={cIntro.monthNumB}>000</span>
                                        <span className={cIntro.monthNum}>Apr</span>
                                        <span className={cIntro.monthNum}>Mar</span>
                                    </span>
                                    <span className={cIntro.comHisFlex3}>
                                        <span className={cIntro.historyText}>Patent application (Method and system for providing adaptive SOP according to organization's situation)</span>
                                        <span className={cIntro.historyText}>Patent application (Method and system for providing adaptive SOP according to emergent situation during SOP training)</span>
                                        <span className={cIntro.historyText}>Patent application (Crisis Alert Level Management Method and System)</span>
                                        <span className={cIntro.historyText}>Relocation of R&D Center</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2021Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2021</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Oct</span>
                                        <span className={cIntro.monthNum}>Aug</span>
                                        <span className={cIntro.monthNum}>Jul</span>
                                        <span className={cIntro.monthNum}>Jun</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Patent application (Method and system for operating dynamic flight restricted area)</span>
                                        <span className={cIntro.historyText}>Patent application (System and method for transitioning space information)</span>
                                        <span className={cIntro.historyText}>Patent registration (Method and system for visualizing 3D flight paths)</span>
                                        <span className={cIntro.historyText}>Change of major shareholders and inauguration of CEO (Wook-hyun Yeo)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2020Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2020</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Oct</span>
                                        <span className={cIntro.monthNum}>May</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                        <span className={cIntro.monthNum}>Jan</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Patent registration (Method for disaster situation propagation and system thereof)</span>
                                        <span className={cIntro.historyText}>Patent registration (Method and system for creating related Standard Operating Procedure)</span>
                                        <span className={cIntro.historyText}>Patent registration (Disaster Countermeasures Training method capable to make training scene and system thereof)</span>
                                        <span className={cIntro.historyText}>Registration of Information and communication construction business</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2019Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2019</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Sep</span>
                                        <span className={cIntro.monthNum}>Aug</span>
                                        <span className={cIntro.monthNum}>May</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Patent registration (Intelligent Disaster Countermeasures Training method and system thereof)</span>
                                        <span className={cIntro.historyText}>Certification of inno-Biz company (Technology innovative small and medium-sized enterprises)</span>
                                        <span className={cIntro.historyText}>R&D center name changed (Disaster Safety Technology Research Center)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2018Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2018</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Jun</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Registration of R&D service business</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2017Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2017</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Aug</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Patent Registration (System and method for prediction of environmental pollution)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2016Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2016</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Oct</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Japanese Patent registration (Disaster Time Behavior Support System)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2015Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2015</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Oct</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                        <span className={cIntro.monthNum}>Apr</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Patent registration (Disaster detection system and providing method thereof)</span>
                                        <span className={cIntro.historyText}>Selection of Achievement-sharing enterprise</span>
                                        <span className={cIntro.historyText}>Patent registration (SOP scenario executing system and providing method thereof)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2014Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2014</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Sep</span>
                                        <span className={cIntro.monthNum}>Jan</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Registration of Korea South-East Power Co., Ltd. development selection product</span>
                                        <span className={cIntro.historyText}>Patent registration (Ecological environment evaluation system and method thereof)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2013Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2013</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Jun</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Patent registration (Intelligent Standard Operating Procedure system based on location and providing method thereof)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2012Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2012</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Jul</span>
                                        <span className={cIntro.monthNum}>Jan</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Certification of Direct production by Federation of Small and Medium Business (Software development)</span>
                                        <span className={cIntro.historyText}>Certification of Venture company</span>
                                        <span className={cIntro.historyText}>Report of Engineering business (water quality, waste, noise, vibration)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2011Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2011</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Apr</span>
                                        <span className={cIntro.monthNum}>Mar</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Establishment and registration of R&D center</span>
                                        <span className={cIntro.historyText}>Establishment of company</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* CI */}
                        <div className={cIntro.comLogoContent} id="sectionCI">
                            <span className={cIntro.comLTitle} data-aos="fade-down" data-aos-duration="1000">Introduction to CI</span>
                            {/* <span className={cIntro.comLSubTitle}>{Resource.ID.CI.CISubTitle}</span> */}
                            <div className={cIntro.DownBox}>
                                <div className={cIntro.CIDownBox}>
                                    <span></span>
                                    <span>Korean CI</span>
                                </div>
                                <div className={cIntro.CIDownBox2}>
                                    <span></span>
                                    <span>English CI</span>
                                </div>
                            </div>
                            <a href="../../resource/logo design_update.ai" download>
                                <span className={cIntro.ClDownArea}>Download CI</span>
                            </a>
                        </div>
                        <div className={cIntro.comCIContent2}>
                            <span className={cIntro.comCircle}></span>
                            <span className={cIntro.comCSubTitle}>Symbols and Colors</span>
                            <div className={cIntro.comCFlexBox}>
                                <div className={cIntro.comSimbolBox}>
                                    <div className={cIntro.simbol}></div>
                                    <div className={cIntro.comSimbolText}>
                                        <p>The 3D symbol is Digital Twin Based</p>
                                        <p>It symbolizes the expertise of</p>
                                        <p>spatial information construction.</p>
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
                                        <p>Warning signs, fire extinguishers, alarms, etc</p>
                                        <p>The representative safety color red</p>
                                        <p>represents a safety-leading company</p>
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
                                        <span>Fax: 82-2-714-4134 </span>
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
            displayCompanyUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={cIntro.comIntroTitle}>
                            <span data-aos="fade-down" data-aos-duration="1000">About Us</span>
                            <span data-aos="fade-down" data-aos-duration="1000">Introduce U&E's CEO greetings, vision and values, history, and CI.</span>
                        </div>
                        {/* CEO 인사말 */}
                        <div className={cIntro.comGreeting} id="sectionCEO">
                            <span data-aos="fade-down" data-aos-duration="1000">CEO Greetings</span>
                            <div className={cIntro.ceoBox}>
                                <span className={cIntro.ceoPicture}></span>
                                <div className={cIntro.ceoTextBoxS}>
                                    <span>Safe space, Comfortable space, Easy-to-manage space.</span>
                                    <span>People in the smart world need the space to relax even for a short time.</span>
                                    <span>We, U&E is right in the center of that space.</span>
                                    <span>U&E is an IT-tech company that provides secure, convenient, customized space for users on a Digital Twin based technologies.</span>
                                    <span>With our accumulated technology and professional experience, we will continue to strive to achieve safe space, convenience,</span>
                                    <span>customized deployment, and reasonable costs to realize the safe value of the space our customers want and seek.</span>
                                    <span>Thank you.</span>
                                    <span>CEO<span className={cIntro.ceoBoldText}>Wook-hyun Yeo</span></span>
                                </div>
                            </div>
                        </div>
                        {/* vision */}
                        <div className={cIntro.comVision} id="sectionVision">
                            <span className={cIntro.comVTitle1} data-aos="fade-down" data-aos-duration="1000">Vision and Core Values</span>
                            <span className={cIntro.comVFlex}>
                                <span className={cIntro.comVTitle11}>Vision</span>
                                <span className={cIntro.comVShape}>
                                    <span className={cIntro.comVCircle1}></span>
                                    <span className={cIntro.comVLine}></span>
                                    <span className={cIntro.comVCircle2}></span>
                                </span>
                                <span className={cIntro.comVTitle2}>A digital space made with smart technology,<span className={cIntro.blueFont}>becomes a safe and secure space.</span></span>
                            </span>
                            <div className={cIntro.visionFlexBox}>
                                <div className={cIntro.vFlex1}>
                                    <div className={cIntro.vBox1}>Core values</div>
                                    <div className={cIntro.vBox2}>
                                        <span><span className={cIntro.vBoldText}>S</span>MART</span>
                                        <span>Smarter</span>
                                        <span>with the latest</span>
                                        <span>ICT technology</span>
                                    </div>
                                </div>
                                <div className={cIntro.vFlex2}>
                                    <div className={cIntro.vBox3}>Core values</div>
                                    <div className={cIntro.vBox4}>
                                        <span><span className={cIntro.vBoldText}>S</span>PACE</span>
                                        <span>Synchronize real world</span>
                                        <span>to virtual space</span>
                                        <span>with digital twin</span>
                                    </div>
                                </div>
                                <div className={cIntro.vFlex3}>
                                    <div className={cIntro.vBox5}>Core values</div>
                                    <div className={cIntro.vBox6}>
                                        <span><span className={cIntro.vBoldText}>S</span>AFETY</span>
                                        <span>People-centered</span>
                                        <span>safety is first</span>
                                        <span></span>
                                    </div>
                                </div>
                                <div className={cIntro.vFlex4}>
                                    <div className={cIntro.vBox7}>Core values</div>
                                    <div className={cIntro.vBox8}>
                                        <span><span className={cIntro.vBoldText}>S</span>ECURITY</span>
                                        <span>Secure from disasters</span>
                                        <span>with rapid and</span>
                                        <span>systematic response</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* history */}
                        <span className={cIntro.comHisTitle2} id="sectionHistory" data-aos="fade-down" data-aos-duration="1000">Major Histories</span>
                        <div className={cIntro.comHisContent}>
                            <div className={cIntro.comHisTable} border="1">
                                <div className={cIntro.com2022Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2022</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>May</span>
                                        <span className={cIntro.monthNumB}>000</span>
                                        <span className={cIntro.monthNum}>Apr</span>
                                        <span className={cIntro.monthNum}>Mar</span>
                                    </span>
                                    <span className={cIntro.comHisFlex3}>
                                        <span className={cIntro.historyText}>Patent application (Method and system for providing adaptive SOP according to organization's situation)</span>
                                        <span className={cIntro.historyText}>Patent application (Method and system for providing adaptive SOP according to emergent situation during SOP training)</span>
                                        <span className={cIntro.historyText}>Patent application (Crisis Alert Level Management Method and System)</span>
                                        <span className={cIntro.historyText}>Relocation of R&D Center</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2021Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2021</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Oct</span>
                                        <span className={cIntro.monthNum}>Aug</span>
                                        <span className={cIntro.monthNum}>Jul</span>
                                        <span className={cIntro.monthNum}>Jun</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Patent application (Method and system for operating dynamic flight restricted area)</span>
                                        <span className={cIntro.historyText}>Patent application (System and method for transitioning space information)</span>
                                        <span className={cIntro.historyText}>Patent registration (Method and system for visualizing 3D flight paths)</span>
                                        <span className={cIntro.historyText}>Change of major shareholders and inauguration of CEO (Wook-hyun Yeo)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2020Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2020</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Oct</span>
                                        <span className={cIntro.monthNum}>May</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                        <span className={cIntro.monthNum}>Jan</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Patent registration (Method for disaster situation propagation and system thereof)</span>
                                        <span className={cIntro.historyText}>Patent registration (Method and system for creating related Standard Operating Procedure)</span>
                                        <span className={cIntro.historyText}>Patent registration (Disaster Countermeasures Training method capable to make training scene and system thereof)</span>
                                        <span className={cIntro.historyText}>Registration of Information and communication construction business</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2019Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2019</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Sep</span>
                                        <span className={cIntro.monthNum}>Aug</span>
                                        <span className={cIntro.monthNum}>May</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Patent registration (Intelligent Disaster Countermeasures Training method and system thereof)</span>
                                        <span className={cIntro.historyText}>Certification of inno-Biz company (Technology innovative small and medium-sized enterprises)</span>
                                        <span className={cIntro.historyText}>R&D center name changed (Disaster Safety Technology Research Center)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2018Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2018</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Jun</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Registration of R&D service business</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2017Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2017</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Aug</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Patent Registration (System and method for prediction of environmental pollution)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2016Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2016</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Oct</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Japanese Patent registration (Disaster Time Behavior Support System)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2015Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2015</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Oct</span>
                                        <span className={cIntro.monthNumB}>00</span>
                                        <span className={cIntro.monthNum}>Apr</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Patent registration (Disaster detection system and providing method thereof)</span>
                                        <span className={cIntro.historyText}>Selection of Achievement-sharing enterprise</span>
                                        <span className={cIntro.historyText}>Patent registration (SOP scenario executing system and providing method thereof)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2014Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2014</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Sep</span>
                                        <span className={cIntro.monthNum}>Jan</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Registration of Korea South-East Power Co., Ltd. development selection product</span>
                                        <span className={cIntro.historyText}>Patent registration (Ecological environment evaluation system and method thereof)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2013Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2013</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Jun</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Patent registration (Intelligent Standard Operating Procedure system based on location and providing method thereof)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2012Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2012</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Jul</span>
                                        <span className={cIntro.monthNum}>Jan</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Certification of Direct production by Federation of Small and Medium Business (Software development)</span>
                                        <span className={cIntro.historyText}>Certification of Venture company</span>
                                        <span className={cIntro.historyText}>Report of Engineering business (water quality, waste, noise, vibration)</span>
                                    </span>
                                </div>
                                <div className={cIntro.com2011Box}>
                                    <span>
                                        <span className={cIntro.yearNum}>2011</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.monthNum}>Apr</span>
                                        <span className={cIntro.monthNum}>Mar</span>
                                    </span>
                                    <span>
                                        <span className={cIntro.historyText}>Establishment and registration of R&D center</span>
                                        <span className={cIntro.historyText}>Establishment of company</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* CI */}
                        <div className={cIntro.comLogoContent} id="sectionCI">
                            <span className={cIntro.comLTitle} data-aos="fade-down" data-aos-duration="1000">Introduction to CI</span>
                            {/* <span className={cIntro.comLSubTitle}>{Resource.ID.CI.CISubTitle}</span> */}
                            <div className={cIntro.DownBox}>
                                <div className={cIntro.CIDownBox}>
                                    <span></span>
                                    <span>Korean CI</span>
                                </div>
                                <div className={cIntro.CIDownBox2}>
                                    <span></span>
                                    <span>English CI</span>
                                </div>
                            </div>
                            <a href="../../resource/logo design_update.ai" download>
                                <span className={cIntro.ClDownArea}>Download CI</span>
                            </a>
                        </div>
                        <div className={cIntro.comCIContent2}>
                            <span className={cIntro.comCircle}></span>
                            <span className={cIntro.comCSubTitle}>Symbols and Colors</span>
                            <div className={cIntro.comCFlexBox}>
                                <div className={cIntro.comSimbolBox}>
                                    <div className={cIntro.simbol}></div>
                                    <div className={cIntro.comSimbolText}>
                                        <p>The 3D symbol is Digital Twin Based</p>
                                        <p>It symbolizes the expertise of</p>
                                        <p>spatial information construction.</p>
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
                                        <p>Warning signs, fire extinguishers, alarms, etc</p>
                                        <p>The representative safety color red</p>
                                        <p>represents a safety-leading company</p>
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
                                        <span>Fax: 82-2-714-4134 </span>
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

export default CompanySectionEng;