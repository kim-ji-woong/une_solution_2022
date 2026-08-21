import React, { Component, useEffect } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';

/* import './NavMenu.css'; */
import nav from '../components/css/navMenu.module.css';
import home from '../components/css/home.module.css';
import '../components/css/home.css';
import Resource from '../resource/id';


export class NavMenuKor extends Component {
    static displayName = NavMenuKor.name;

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

        //$('.menu22').hide();

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

        $('.menuu2 li').click(function () {
            $('.menu22').hide();
        });

        $('.menuu2 li').mouseenter(function () {
            $('.menu22').show();
            $('.' + home.overlay).show();
        });

        /* test ****************************/

        $('.menuu2 li').mouseenter(function () {
            $('.menu22').toggleClass("active");
        });

        $('.menuu2 li').hover(function () {
            $('.menu22').toggleClass("active");
        });

        /***********************************/


        $('.menuu2 li').click(function () {
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


        $('.menuu2 li').click(function () {
            $('.menu22').hide();
        });

        /* mobile */
        $('.ico').on('click', function () {
            $('.left-side-bar-box').addClass('active');
            $('.overlay').fadeIn();
        });

        $('.overlay').on('click', function () {
            $('.left-side-bar-box').removeClass('active');
            $('.overlay').fadeOut();
        });

        $('.menuTab1 li /*a*/ link').click(function () {
            $('.left-side-bar-box').removeClass('active');
            $('.overlay').fadeOut();
        });

        $('.menuTab2 li /*a*/ link').click(function () {
            $('.left-side-bar-box').removeClass('active');
            $('.overlay').fadeOut();
        });

        $('.menuTab3 li /*a*/ link').click(function () {
            $('.left-side-bar-box').removeClass('active');
            $('.overlay').fadeOut();
        });

        $('.menuTab4 li /*a*/ link').click(function () {
            $('.left-side-bar-box').removeClass('active');
            $('.overlay').fadeOut();
        });

        $('.menuTab5 li /*a*/ link').click(function () {
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
                    <div className="overlay"></div>
                    <div className="mobile-top-bar">
                        <Link to="/"><span className="menuLogoM"></span></Link>
                        <div className="ico toggle-side-bar-btn" /* data-ico-now-animating="N" */>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    <div className="left-side-bar-box">
                        <div className="left-side-bar">
                            <div className="menuM">
                                <span className="menuClose"></span>
                                <div className="menuContent">
                                    <ul>
                                        <li className="companyTab">회사소개</li>
                                        <ul className="menuTab1">
                                            <li><Link to={"/companySection#sectionCEO"}>CEO인사말</Link></li>
                                            <li><Link to={"/companySection#sectionVision"}>비전 및 가치</Link></li>
                                            <li><Link to={"/companySection#sectionHistory"}>연혁</Link></li>
                                            <li><Link to={"/companySection#sectionCI"}>CI소개</Link></li>
                                        </ul>
                                        <li className="businessTab">기술소개</li>
                                        <ul className="menuTab2">
                                            <li><Link to={"/performanceSection#sectionInforBuild"}>공간정보 구축</Link></li>
                                            <li><Link to={"/performanceSection#sectionESOP"}>E-SOP</Link></li>
                                            <li><Link to={"/performanceSection#sectionData"}>데이터 시각화</Link></li>
                                            <li><Link to={"/performanceSection#sectionSystem"}>시스템 통합구축</Link></li>
                                            <li><Link to={"/performanceSection#sectionPatent"}>특허 및 인증</Link></li>
                                        </ul>
                                        <li className="newsTab">사업소개</li>
                                        <ul className="menuTab3">
                                            <li><Link to={"/businessSection#sectionSafety"}>안전관리</Link></li>
                                            <li><Link to={"/businessSection#sectionDigital"}>디지털 트윈</Link></li>
                                            <li><Link to={"/businessSection#sectionPerformance"}>주요 실적</Link></li>
                                            <li><Link to={"/businessSection#sectionPartner"}>파트너사</Link></li>
                                            <li><Link to={"/businessSection#sectionNews"}>보도자료</Link></li>
                                        </ul>
                                        <li className="productTab">제품 소개</li>
                                        <ul className="menuTab4">
                                            <li><Link to={"/productSection#protecto"}>PROTECTO</Link></li>
                                        </ul>
                                        <li className="customerTab">채용 및 문의</li>
                                        <ul className="menuTab5">
                                            <li><Link to={"/contactSection#sectionRecruit"}>인재채용</Link></li>
                                            <li><Link to={"/contactSection#sectionBenefits"}>복리후생</Link></li>
                                        </ul>
                                    </ul>
                                <div className="menuDirect"><Link to="/directions">오시는 길</Link></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        } else if (640 <= widthSize && widthSize <= 959) {  /* 가로 모바일 */
            displayMUI.push(
                <>
                   <div className="overlay"></div>
                    <div className="mobile-top-bar">
                        <Link to="/"><span className="menuLogoM"></span></Link>
                        <div className="ico toggle-side-bar-btn">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    <div className="left-side-bar-box">
                        <div className="left-side-bar">
                            <div className="menuM">
                                <div className="menuContent">
                                    <ul>
                                        <li className="companyTab">회사소개</li>
                                        <ul className="menuTab1">
                                            <li><Link to={"/companySection#sectionCEO"}>CEO인사말</Link></li>
                                            <li><Link to={"/companySection#sectionVision"}>비전 및 가치</Link></li>
                                            <li><Link to={"/companySection#sectionHistory"}>연혁</Link></li>
                                            <li><Link to={"/companySection#sectionCI"}>CI소개</Link></li>
                                        </ul>
                                        <li className="businessTab">기술소개</li>
                                        <ul className="menuTab2">
                                            <li><Link to={"/performanceSection#sectionInforBuild"}>공간정보 구축</Link></li>
                                            <li><Link to={"/performanceSection#sectionESOP"}>E-SOP</Link></li>
                                            <li><Link to={"/performanceSection#sectionData"}>데이터 시각화</Link></li>
                                            <li><Link to={"/performanceSection#sectionSystem"}>시스템 통합구축</Link></li>
                                            <li><Link to={"/performanceSection#sectionPatent"}>특허 및 인증</Link></li>
                                        </ul>
                                        <li className="newsTab">사업소개</li>
                                        <ul className="menuTab3">
                                            <li><Link to={"/businessSection#sectionSafety"}>안전관리</Link></li>
                                            <li><Link to={"/businessSection#sectionDigital"}>디지털 트윈</Link></li>
                                            <li><Link to={"/businessSection#sectionPerformance"}>주요 실적</Link></li>
                                            <li><Link to={"/businessSection#sectionPartner"}>파트너사</Link></li>
                                            <li><Link to={"/businessSection#sectionNews"}>보도자료</Link></li>
                                        </ul>
                                        <li className="productTab">제품 소개</li>
                                        <ul className="menuTab4">
                                            <li><Link to={"/productSection#protecto"}>PROTECTO</Link></li>
                                        </ul>
                                        <li className="customerTab">채용 및 문의</li>
                                        <ul className="menuTab5">
                                            <li><Link to={"/contactSection#sectionRecruit"}>인재채용</Link></li>
                                            <li><Link to={"/contactSection#sectionBenefits"}>복리후생</Link></li>
                                        </ul>
                                    </ul>
                                <div className="menuDirect"><Link to="/directions">오시는 길</Link></div>
                                </div>
                            </div>
                        </div>
                    </div> 
                </>
            );
        } else if (768 < widthSize && widthSize <= 1023) { //태블릿
            displayMUI.push(
                <>
                    <div id={nav.menu1}>
                        <Link to="/"><span className={nav.menuLogo}></span></Link>
                        <ul className="menuu2">
                            <li className="isOn"><Link to="/companySection" href="#tab1">회사소개</Link></li>
                            <li><Link to="/performanceSection" href="#tab2">기술소개</Link></li>
                            <li><Link to="/businessSection" href="#tab3">사업소개</Link></li>
                            <li><Link to="/productSection" href="#tab4">제품소개</Link></li>
                            <li><Link to="/contactSection" href="#tab5">채용 및 문의</Link></li>
                        </ul>
                        <div className="menu22">
                            <div className={nav.menuContent2}>
                                <ul className={nav.menusub1} id="tab1">
                                    <li><Link to={"/companySection#sectionCEO"}>CEO인사말</Link></li>
                                    <li><Link to={"/companySection#sectionVision"}>비전 및 가치</Link></li>
                                    <li><Link to={"/companySection#sectionHistory"}>연혁</Link></li>
                                    <li><Link to={"/companySection#sectionCI"}>CI소개</Link></li>

                                </ul>
                                <ul className={nav.menusub2} id="tab2">
                                    <li><Link to={"/performanceSection#sectionInforBuild"}>공간정보 구축</Link></li>
                                    <li><Link to={"/performanceSection#sectionESOP"}>E-SOP</Link></li>
                                    <li><Link to={"/performanceSection#sectionData"}>데이터 시각화</Link></li>
                                    <li><Link to={"/performanceSection#sectionSystem"}>시스템 통합구축</Link></li>
                                    <li><Link to={"/performanceSection#sectionPatent"}>특허 및 인증</Link></li>
                                </ul>
                                <ul className={nav.menusub3} id="tab3">
                                    <li><Link to={"/businessSection#sectionSafety"}>안전관리</Link></li>
                                    <li><Link to={"/businessSection#sectionDigital"}>디지털 트윈</Link></li>
                                    <li><Link to={"/businessSection#sectionPerformance"}>주요 실적</Link></li>
                                    <li><Link to={"/businessSection#sectionPartner"}>파트너사</Link></li>
                                    <li><Link to={"/businessSection#sectionNews"}>보도자료</Link></li>
                                </ul>
                                <ul className={nav.menusub4} id="tab4">
                                    <li><Link to={"/productSection#protecto"}>PROTECTO</Link></li>
                                </ul>
                                <ul className={nav.menusub5} id="tab5">
                                    <li><Link to={"/contactSection#sectionRecruit"}>인재채용</Link></li>
                                    <li><Link to={"/contactSection#sectionBenefits"}>복리후생</Link></li>
                                    <li><Link to={"/contactSection#sectionInquiry"}>문의하기</Link></li>
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
                        <ul className="menuu2">
                            <li className="isOn"><Link to="/companySection" href="#tab1">회사소개</Link></li>
                            <li><Link to="/performanceSection" href="#tab2">기술소개</Link></li>
                            <li><Link to="/businessSection" href="#tab3">사업소개</Link></li>
                            <li><Link to="/productSection" href="#tab4">제품소개</Link></li>
                            <li><Link to="/contactSection" href="#tab5">채용 및 문의</Link></li>

                        </ul>
                        <div className="menu22" >
                            <div className={nav.menuContent2}>
                                <ul className={nav.menusub1} id="tab1">
                                    <li><Link to={"/companySection#sectionCEO"}>CEO인사말</Link></li>
                                    <li><Link to={"/companySection#sectionVision"}>비전 및 가치</Link></li>
                                    <li><Link to={"/companySection#sectionHistory"}>연혁</Link></li>
                                    <li><Link to={"/companySection#sectionCI"}>CI소개</Link></li>

                                </ul>
                                <ul className={nav.menusub2} id="tab2">
                                    <li><Link to={"/performanceSection#sectionInforBuild"}>공간정보 구축</Link></li>
                                    <li><Link to={"/performanceSection#sectionESOP"}>E-SOP</Link></li>
                                    <li><Link to={"/performanceSection#sectionData"}>데이터 시각화</Link></li>
                                    <li><Link to={"/performanceSection#sectionSystem"}>시스템 통합구축</Link></li>
                                    <li><Link to={"/performanceSection#sectionPatent"}>특허 및 인증</Link></li>
                                </ul>
                                <ul className={nav.menusub3} id="tab3">
                                    <li><Link to={"/businessSection#sectionSafety"}>안전관리</Link></li>
                                    <li><Link to={"/businessSection#sectionDigital"}>디지털 트윈</Link></li>
                                    <li><Link to={"/businessSection#sectionPerformance"}>주요 실적</Link></li>
                                    <li><Link to={"/businessSection#sectionPartner"}>파트너사</Link></li>
                                    <li><Link to={"/businessSection#sectionNews"}>보도자료</Link></li>
                                </ul>
                                <ul className={nav.menusub4} id="tab4">
                                    <li><Link to={"/productSection#protecto"}>PROTECTO</Link></li>
                                </ul>
                                <ul className={nav.menusub5} id="tab5">
                                    <li><Link to={"/contactSection#sectionRecruit"}>인재채용</Link></li>
                                    <li><Link to={"/contactSection#sectionBenefits"}>복리후생</Link></li>
                                    <li><Link to={"/contactSection#sectionInquiry"}>문의하기</Link></li>
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
                        <ul className="menuu2">
                            <li className="isOn"><Link to="/companySection" href="#tab1">회사소개</Link></li>
                            <li><Link to="/performanceSection" href="#tab2">기술소개</Link></li>
                            <li><Link to="/businessSection" href="#tab3">사업소개</Link></li>
                            <li><Link to="/productSection" href="#tab4">제품소개</Link></li>
                            <li><Link to="/contactSection" href="#tab5">채용 및 문의</Link></li>
                        </ul>
                        <div className="menu22">
                            <div className={nav.menuContent2}>
                                <ul className={nav.menusub1} id="tab1">
                                    <li><Link to={"/companySection#sectionCEO"}>CEO인사말</Link></li>
                                    <li><Link to={"/companySection#sectionVision"}>비전 및 가치</Link></li>
                                    <li><Link to={"/companySection#sectionHistory"}>연혁</Link></li>
                                    <li><Link to={"/companySection#sectionCI"}>CI소개</Link></li>

                                </ul>
                                <ul className={nav.menusub2} id="tab2">
                                    <li><Link to={"/performanceSection#sectionInforBuild"}>공간정보 구축</Link></li>
                                    <li><Link to={"/performanceSection#sectionESOP"}>E-SOP</Link></li>
                                    <li><Link to={"/performanceSection#sectionData"}>데이터 시각화</Link></li>
                                    <li><Link to={"/performanceSection#sectionSystem"}>시스템 통합구축</Link></li>
                                    <li><Link to={"/performanceSection#sectionPatent"}>특허 및 인증</Link></li>
                                </ul>
                                <ul className={nav.menusub3} id="tab3">
                                    <li><Link to={"/businessSection#sectionSafety"}>안전관리</Link></li>
                                    <li><Link to={"/businessSection#sectionDigital"}>디지털 트윈</Link></li>
                                    <li><Link to={"/businessSection#sectionPerformance"}>주요 실적</Link></li>
                                    <li><Link to={"/businessSection#sectionPartner"}>파트너사</Link></li>
                                    <li><Link to={"/businessSection#sectionNews"}>보도자료</Link></li>
                                </ul>
                                <ul className={nav.menusub4} id="tab4">
                                    <li><Link to={"/productSection#protecto"}>PROTECTO</Link></li>
                                </ul>
                                <ul className={nav.menusub5} id="tab5">
                                    <li><Link to={"/contactSection#sectionRecruit"}>인재채용</Link></li>
                                    <li><Link to={"/contactSection#sectionBenefits"}>복리후생</Link></li>
                                    <li><Link to={"/contactSection#sectionInquiry"}>문의하기</Link></li>
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

export default NavMenuKor;