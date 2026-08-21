import React, { Component, useEffect } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';

/* import './NavMenu.css'; */
import nav from '../components/css/navMenu.module.css';
import home from '../components/css/home.module.css';
import '../components/css/home.css';
import Resource from '../resource/id';


export class NavMenuEng extends Component {
    static displayName = NavMenuEng.name;

    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true,
            disMUI: this.displayMUI(),
        };
    }

    resizeMUI() {
        this.setState({ disMUI: this.displayMUI() });
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    onChangeLanguage = (e) => {
        Resource.setLanguage(e.target.value);
        this.setState({});
    }


    componentDidMount() {

        window.addEventListener('resize', () => this.resizeMUI());

        /* 메뉴 li 클릭했을때만 밑줄 생기게 */
        $('.menuu2').mouseenter(function () {
            $('#' + nav.menu1).css({
                'border-bottom-width': '0.5px',
                'border-bottom-style': 'solid',
                'border-bottom-color': '#d7d7d7'
            });
        });

        $('.menu22').mouseenter(function () {
            $('#' + nav.menu1).css({
                'border-bottom-width': '0.5px',
                'border-bottom-style': 'solid',
                'border-bottom-color': '#d7d7d7'
            });
        });


        $('.menuu2').mouseleave(function () {
            $('#' + nav.menu1).css({ 'border': 'none' });
        });


        /* 2차 */
        $('.menu22').hide();

        $('#' + nav.menu1).mouseleave(function () {
            $('.menu22').hide();
            $('.' + home.overlay).hide();
        });

        $('.' + nav.menuLogo).click(function () {
            $('.menu2').hide();
            $('.menuu2 li').removeClass("selected");
        });

        $('.menuu2 li').mouseenter(function () {
            $('.menu22').show();
            $('.' + home.overlay).show();
        });

        $('#tab1 li').click(function () {
            $('.menu22').hide();
        });

        $('#tab2 li').click(function () {
            $('.menu22').hide();
        });

        $('#tab3 li').click(function () {
            $('.menu22').hide();
        });

        $('#tab4 li').click(function () {
            $('.menu22').hide();
        });

        $('#tab5 li').click(function () {
            $('.menu22').hide();
        });


        $(document).ready(function () {
            $(".menuu2 li").each(function () {
                $(this).click(function () {
                    $(this).addClass("selected");
                    $(this).siblings().removeClass("selected");
                });
            });
        });


        $(".menuu2 li:nth-child(1)").mouseenter(function () {
            $("#tab1").addClass("active");
        });
        $(".menuu2 li:nth-child(1)").mouseleave(function () {
            $("#tab1").removeClass("active");
        });

        $(".menuu2 li:nth-child(2)").mouseenter(function () {
            $("#tab2").addClass("active");
        });
        $(".menuu2 li:nth-child(2)").mouseleave(function () {
            $("#tab2").removeClass("active");
        });

        $(".menuu2 li:nth-child(3)").mouseenter(function () {
            $("#tab3").addClass("active");
        });
        $(".menuu2 li:nth-child(3)").mouseleave(function () {
            $("#tab3").removeClass("active");
        });

        $(".menuu2 li:nth-child(4)").mouseenter(function () {
            $("#tab4").addClass("active");
        });
        $(".menuu2 li:nth-child(4)").mouseleave(function () {
            $("#tab4").removeClass("active");
        });

        $(".menuu2 li:nth-child(5)").mouseenter(function () {
            $("#tab5").addClass("active");
        });
        $(".menuu2 li:nth-child(5)").mouseleave(function () {
            $("#tab5").removeClass("active");
        });


        $("#tab1").click(function () {
            $(".menuu2 li:nth-child(1)").addClass("selected");
            $(".menuu2 li").not(".menuu li:nth-child(1)").removeClass("selected");
        });
        $("#tab2").click(function () {
            $(".menuu2 li:nth-child(2)").addClass("selected");
            $(".menuu2 li").not(".menuu li:nth-child(2)").removeClass("selected");
        });
        $("#tab3").click(function () {
            $(".menuu2 li:nth-child(3)").addClass("selected");
            $(".menuu2 li").not(".menuu li:nth-child(3)").removeClass("selected");
        });
        $("#tab4").click(function () {
            $(".menuu2 li:nth-child(4)").addClass("selected");
            $(".menuu2 li").not(".menuu li:nth-child(4)").removeClass("selected");
        });
        $("#tab5").click(function () {
            $(".menuu2 li:nth-child(5)").addClass("selected");
            $(".menuu2 li").not(".menuu li:nth-child(5)").removeClass("selected");
        });


        /* 0819 */
        $('.menuu2 li').click(function () {
            $('.menu22').hide();
        });

        $('.ico').on('click', function () {
            $('.left-side-bar-box').addClass('active');
            $('.overlay').fadeIn();
        });

        $('.overlay').on('click', function () {
            $('.left-side-bar-box').removeClass('active');
            $('.overlay').fadeOut();
        });

        $('.menuTab1 li a').click(function () {
            $('.left-side-bar-box').removeClass('active');
            $('.overlay').fadeOut();
        });

        $('.menuTab2 li a').click(function () {
            $('.left-side-bar-box').removeClass('active');
            $('.overlay').fadeOut();
        });

        $('.menuTab3 li a').click(function () {
            $('.left-side-bar-box').removeClass('active');
            $('.overlay').fadeOut();
        });

        $('.menuTab4 li a').click(function () {
            $('.left-side-bar-box').removeClass('active');
            $('.overlay').fadeOut();
        });

        $('.menuTab5 li a').click(function () {
            $('.left-side-bar-box').removeClass('active');
            $('.overlay').fadeOut();
        });


        $('.menuClose').click(function () {
            $('.left-side-bar-box').removeClass('active');
            $('.overlay').fadeOut();
        });

        $('.menuDirect').click(function () {
            $('.left-side-bar-box').removeClass('active');
            $('.overlay').fadeOut();
        });
    }

    displayMUI = () => {
        let displayMUI = [];

        let widthSize = window.outerWidth;

        /* mobile */
        if (widthSize < 768) {
            displayMUI.push(
                <>
                    <div class="overlay"></div>
                    <div class="mobile-top-bar">
                        <Link to="/"><span class="menuLogoM"></span></Link>
                        <div class="ico toggle-side-bar-btn" /* data-ico-now-animating="N" */>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    <div class="left-side-bar-box">
                        <div class="left-side-bar">
                            <div class="menuM">
                                <span className="menuClose"></span>
                                <div class="menuContent">
                                    <ul>
                                        <li class="companyTab">Company</li>
                                        <ul class="menuTab1">
                                            <li><Link to={"/companySection#sectionCEO"}>CEO Greeting</Link></li>
                                            <li><Link to={"/companySection#sectionVision"}>Vision & Value</Link></li>
                                            <li><Link to={"/companySection#sectionHistory"}>History</Link></li>
                                            <li><Link to={"/companySection#sectionCI"}>C.I</Link></li>
                                        </ul>
                                        <li class="businessTab">Technology</li>
                                        <ul class="menuTab2">
                                            <li><Link to={"/performanceSection#sectionInforBuild"}>Spatial Information</Link></li>
                                            <li><Link to={"/performanceSection#sectionESOP"}>E-SOP</Link></li>
                                            <li><Link to={"/performanceSection#sectionData"}>Data Visualization</Link></li>
                                            <li><Link to={"/performanceSection#sectionSystem"}>System Integration</Link></li>
                                            <li><Link to={"/performanceSection#sectionPatent"}>Patent & Certification</Link></li>
                                        </ul>
                                        <li class="newsTab">Business</li>
                                        <ul class="menuTab3">
                                            <li><Link to={"/businessSection#sectionSafety"}>Safety Management</Link></li>
                                            <li><Link to={"/businessSection#sectionDigital"}>Digital Twin</Link></li>
                                            <li><Link to={"/businessSection#sectionPerformance"}>Result</Link></li>
                                            <li><Link to={"/businessSection#sectionPartner"}>Partner</Link></li>
                                            <li><Link to={"/businessSection#sectionNews"}>Press Release</Link></li>
                                        </ul>
                                        <li class="productTab">Product Intro</li>
                                        <ul class="menuTab4">
                                            <li><Link to={"/productSection#protecto"}>PROTECTO</Link></li>
                                        </ul>
                                        <li class="customerTab">Recruit</li>
                                        <ul class="menuTab5">
                                            <li><Link to={"/contactSection#sectionRecruit"}>Recruitment</Link></li>
                                            <li><Link to={"/contactSection#sectionBenefits"}>Welfare & Benefit</Link></li>
                                        </ul>
                                    </ul>
                                    <div class="menuDirect"><Link to="/directions">Map</Link></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        } else if (640 <= widthSize && widthSize <= 959) {  /* 가로 모바일 */
            displayMUI.push(
                <>
                    <div class="overlay"></div>
                    <div class="mobile-top-bar">
                        <Link to="/"><span class="menuLogoM"></span></Link>
                        <div class="ico toggle-side-bar-btn" /* data-ico-now-animating="N" */>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    <div class="left-side-bar-box">
                        <div class="left-side-bar">
                            <div class="menuM">
                                <div class="menuContent">
                                    <ul>
                                        <li class="companyTab">Company</li>
                                        <ul class="menuTab1">
                                            <li><Link to={"/companySection#sectionCEO"}>CEO Greeting</Link></li>
                                            <li><Link to={"/companySection#sectionVision"}>Vision & Value</Link></li>
                                            <li><Link to={"/companySection#sectionHistory"}>History</Link></li>
                                            <li><Link to={"/companySection#sectionCI"}>C.I</Link></li>
                                        </ul>
                                        <li class="businessTab">Technology</li>
                                        <ul class="menuTab2">
                                            <li><Link to={"/performanceSection#sectionInforBuild"}>Spatial Information</Link></li>
                                            <li><Link to={"/performanceSection#sectionESOP"}>E-SOP</Link></li>
                                            <li><Link to={"/performanceSection#sectionData"}>Data Visualization</Link></li>
                                            <li><Link to={"/performanceSection#sectionSystem"}>System Integration</Link></li>
                                            <li><Link to={"/performanceSection#sectionPatent"}>Patent & Certification</Link></li>
                                        </ul>
                                        <li class="newsTab">Business</li>
                                        <ul class="menuTab3">
                                            <li><Link to={"/businessSection#sectionSafety"}>Safety Management</Link></li>
                                            <li><Link to={"/businessSection#sectionDigital"}>Digital Twin</Link></li>
                                            <li><Link to={"/businessSection#sectionPerformance"}>Result</Link></li>
                                            <li><Link to={"/businessSection#sectionPartner"}>Partner</Link></li>
                                            <li><Link to={"/businessSection#sectionNews"}>Press Release</Link></li>
                                        </ul>
                                        <li class="productTab">Product Intro</li>
                                        <ul class="menuTab4">
                                            <li><Link to={"/productSection#protecto"}>PROTECTO</Link></li>
                                        </ul>
                                        <li class="customerTab">Recruit</li>
                                        <ul class="menuTab5">
                                            <li><Link to={"/contactSection#sectionRecruit"}>Recruitment</Link></li>
                                            <li><Link to={"/contactSection#sectionBenefits"}>Welfare & Benefit</Link></li>
                                        </ul>
                                    </ul>
                                <div class="menuDirect"><Link to="/directions">Map</Link></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        } else if (768 <= widthSize && widthSize <= 1023) { //태블릿
            displayMUI.push(
                <>
                    <div id={nav.menu1}>
                        <Link to="/"><span className={nav.menuLogo}></span></Link>
                        <ul className={nav.menu} class="menuu2">
                            <li class="isOn"><Link to="/companySection" href="#tab1">Company</Link></li>
                            <li><Link to="/performanceSection" href="#tab2">Technology</Link></li>
                            <li><Link to="/businessSection" href="#tab3">Business</Link></li>
                            <li><Link to="/productSection" href="#tab4">Product Intro</Link></li>
                            <li><Link to="/contactSection" href="#tab4">Recruit</Link></li>

                        </ul>
                        <div class="menu22" >
                            <div className={nav.menuContent2}>
                                <ul className={nav.menusub1} id="tab1">
                                    <li><Link to={"/companySection#sectionCEO"}>CEO Greeting</Link></li>
                                    <li><Link to={"/companySection#sectionVision"}>Vision & Value</Link></li>
                                    <li><Link to={"/companySection#sectionHistory"}>History</Link></li>
                                    <li><Link to={"/companySection#sectionCI"}>C.I</Link></li>

                                </ul>
                                <ul className={nav.menusub2} id="tab2">
                                    <li><Link to={"/performanceSection#sectionInforBuild"}>Spatial Information</Link></li>
                                    <li><Link to={"/performanceSection#sectionESOP"}>E-SOP</Link></li>
                                    <li><Link to={"/performanceSection#sectionData"}>Data Visualization</Link></li>
                                    <li><Link to={"/performanceSection#sectionSystem"}>System Integration</Link></li>
                                    <li><Link to={"/performanceSection#sectionPatent"}>Patent & Certification</Link></li>
                                </ul>
                                <ul className={nav.menusub3} id="tab3">
                                    <li><Link to={"/businessSection#sectionSafety"}>Safety Management</Link></li>
                                    <li><Link to={"/businessSection#sectionDigital"}>Digital Twin</Link></li>
                                    <li><Link to={"/businessSection#sectionPerformance"}>Result</Link></li>
                                    <li><Link to={"/businessSection#sectionPartner"}>Partner</Link></li>
                                    <li><Link to={"/businessSection#sectionNews"}>Press Release</Link></li>
                                </ul>
                                <ul className={nav.menusub4} id="tab4">
                                    <li><a href="productSection#protecto">PROTECTO</a></li>
                                </ul>
                                <ul className={nav.menusub5} id="tab5">
                                    <li><Link to={"/contactSection#sectionRecruit"}>Recruitment</Link></li>
                                    <li><Link to={"/contactSection#sectionBenefits"}>Welfare & Benefit</Link></li>
                                    <li><Link to={"/contactSection#sectionInquiry"}>Contact Us</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </>
            );
        } else if (960 <= widthSize && widthSize <= 1280) { //가로 태블릿
            displayMUI.push(
                <>
                    <div id={nav.menu1}>
                        <Link to="/"><span className={nav.menuLogo}></span></Link>
                        <ul className={nav.menu} class="menuu2">
                            <li class="isOn"><Link to="/companySection" href="#tab1">Company</Link></li>
                            <li><Link to="/performanceSection" href="#tab2">Technology</Link></li>
                            <li><Link to="/businessSection" href="#tab3">Business</Link></li>
                            <li><Link to="/productSection" href="#tab4">Product Intro</Link></li>
                            <li><Link to="/contactSection" href="#tab4">Recruit</Link></li>

                        </ul>
                        <div class="menu22" >
                            <div className={nav.menuContent2}>
                                <ul className={nav.menusub1} id="tab1">
                                    <li><Link to={"/companySection#sectionCEO"}>CEO Greeting</Link></li>
                                    <li><Link to={"/companySection#sectionVision"}>Vision & Value</Link></li>
                                    <li><Link to={"/companySection#sectionHistory"}>History</Link></li>
                                    <li><Link to={"/companySection#sectionCI"}>C.I</Link></li>

                                </ul>
                                <ul className={nav.menusub2} id="tab2">
                                    <li><Link to={"/performanceSection#sectionInforBuild"}>Spatial Information</Link></li>
                                    <li><Link to={"/performanceSection#sectionESOP"}>E-SOP</Link></li>
                                    <li><Link to={"/performanceSection#sectionData"}>Data Visualization</Link></li>
                                    <li><Link to={"/performanceSection#sectionSystem"}>System Integration</Link></li>
                                    <li><Link to={"/performanceSection#sectionPatent"}>Patent & Certification</Link></li>
                                </ul>
                                <ul className={nav.menusub3} id="tab3">
                                    <li><Link to={"/businessSection#sectionSafety"}>Safety Management</Link></li>
                                    <li><Link to={"/businessSection#sectionDigital"}>Digital Twin</Link></li>
                                    <li><Link to={"/businessSection#sectionPerformance"}>Result</Link></li>
                                    <li><Link to={"/businessSection#sectionPartner"}>Partner</Link></li>
                                    <li><Link to={"/businessSection#sectionNews"}>Press Release</Link></li>
                                </ul>
                                <ul className={nav.menusub4} id="tab4">
                                    <li><Link to={"/productSection#protecto"}>PROTECTO</Link></li>
                                </ul>
                                <ul className={nav.menusub5} id="tab5">
                                    <li><Link to={"/contactSection#sectionRecruit"}>Recruitment</Link></li>
                                    <li><Link to={"/contactSection#sectionBenefits"}>Welfare & Benefit</Link></li>
                                    <li><Link to={"/contactSection#sectionInquiry"}>Contact Us</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </>
            );
        } else if (widthSize >= 1024) {
            displayMUI.push(
                <>
                    <div id={nav.menu1}>
                        <Link to="/"><span className={nav.menuLogo}></span></Link>
                        <ul className={nav.menu} class="menuu2">
                            <li class="isOn"><Link to="/companySection" href="#tab1">Company</Link></li>
                            <li><Link to="/performanceSection" href="#tab2">Technology</Link></li>
                            <li><Link to="/businessSection" href="#tab3">Business</Link></li>
                            <li><Link to="/productSection" href="#tab4">Product Intro</Link></li>
                            <li><Link to="/contactSection" href="#tab5">Recruit</Link></li>

                        </ul>
                        <div class="menu22" >
                            <div className={nav.menuContent2}>
                                <ul className={nav.menusub1} id="tab1">
                                    <li><a href="companySection#sectionCEO">CEO Greeting</a></li>
                                    <li><a href="companySection#sectionVision">Vision & Value</a></li>
                                    <li><a href="companySection#sectionHistory">History</a></li>
                                    <li><a href="companySection#sectionCI">C.I</a></li>

                                </ul>
                                <ul className={nav.menusub2} id="tab2">
                                    <li><a href="performanceSection#sectionInforBuild">Spatial Information</a></li>
                                    <li><a href="performanceSection#sectionESOP">E-SOP</a></li>
                                    <li><a href="performanceSection#sectionData">Data Visualization</a></li>
                                    <li><a href="performanceSection#sectionSystem">System Integration</a></li>
                                    <li><a href="performanceSection#sectionPatent">Patent & Certification</a></li>
                                </ul>
                                <ul className={nav.menusub3} id="tab3">
                                    <li><a href="businessSection#sectionSafety">Safety Management</a></li>
                                    <li><a href="businessSection#sectionDigital">Digital Twin</a></li>
                                    <li><a href="businessSection#sectionPerformance">Result</a></li>
                                    <li><a href="businessSection#sectionPartner">Partner</a></li>
                                    <li><a href="businessSection#sectionNews">Press Release</a></li>
                                </ul>
                                <ul className={nav.menusub4} id="tab4">
                                    <li><a href="productSection#protecto">PROTECTO</a></li>
                                </ul>
                                <ul className={nav.menusub5} id="tab5">
                                    <li><a href="contactSection#sectionRecruit">Recruitment</a></li>
                                    <li><a href="contactSection#sectionBenefits">Welfare & Benefit</a></li>
                                    <li><a href="contactSection#sectionInquiry">Contact Us</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </>
            );
        } else {
            displayMUI.push(
                <></>
            );
        }
        return displayMUI;
    }


    render() {
        setTimeout(() => { this.resizeMUI() }, 500);
        let displayMUI = this.state.disMUI;

        return (
            <>
                {displayMUI}
            </>
        );
    }
}

export default NavMenuEng;
