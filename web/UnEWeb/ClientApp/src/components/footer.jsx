import React, { Component } from 'react';
import { Link } from "react-router-dom";
import home from '../components/css/home.module.css';
import Directions from '../CompanyIntro/Directions.jsx';
import $ from 'jquery';
import Resource from '../resource/id.js';


class Footer extends Component {
    static displayName = Footer.name;

    constructor(props) {
        super(props)

        //this.onChangeLanguage = this.onChangeLanguage.bind(this);
        this.state = {
            disFooterUI: this.displayFooterUI(),
            targetLanguage: null

        }
    }

    componentDidMount() {
        function refreshPage() {
            window.location.reload();
        }
    }

    /* onClickKOR = () => {
        if (Resource.getCurrentLanguage() !== Resource.languageList[0]) {
            Resource.setLanguage(Resource.languageList[0]);
            this.setState({ setLanguage : Resource.languageList[0] });
            return;
        }
    }

    onClickENG = () => {
        if (Resource.getCurrentLanguage() !== Resource.languageList[1]) {
            Resource.setLanguage(Resource.languageList[1]);
            this.setState({ setLanguage: Resource.languageList[1] });
            return;
        }
    } */

    //onChangeLanguage = (e) => {
    //    Resource.setLanguage(e.target.value);
    //    this.setState({});

        //console.log(Resource.setLanguage);
        //this.setState({ setLanguage: this.setLanguage });
    //}

    resizeUI() {
        this.setState({ disFooterUI: this.displayFooterUI() });
    }

    displayFooterUI = () => {
        let displayFooterUI = [];

        let widthSize = window.outerWidth;

        if (widthSize < 768) {
            displayFooterUI.push(
                <>
                    <div className={home.footBox}>
                        <div className={home.footTitleBox}>
                            <div className={home.footTitle}>
                                <span><Link to="/directions">오시는길</Link></span>
                                <span><Link to="/inquiry">1 : 1 이메일 문의</Link></span>
                            </div>
                            <a href="../../resource/une_companyInfo_2024.pdf" download>
                                <span className={home.companyDown}>회사소개서 다운로드
                                    <span className={home.companyImg}></span>
                                </span>
                            </a>
                        </div>
                        <div className={home.footContents}>
                            <div className={home.footConTop}>
                                <span>(주)유엔이</span>
                                <span>Tel:02-714-4133</span>
                                <span>Fax:02-714-4134</span>
                            </div>
                            <div className={home.footConBottom}>
                                <span>서울지사:서울용산구청파로345주연빌딩1층</span>
                                <span>본사:대구 달서구 달구벌대로 1053 계명대학교 첨단산업지원센터 108호</span>
                            </div>
                        </div>
                        <div className={home.footContents2}>
                            <span className={home.footLogo}></span>
                            <span className={home.footText}>CopyrightⓒU&E All rights reserved.</span>
                        </div>
                        <div className={home.footIconArea}>
                            <span><a target="_blank" href="https://www.youtube.com/channel/UC_DmpJ1xIYW9faxTi1M8TMQ"><span className={home.footYouTube}></span></a></span>
                            <span><a target="_blank" href="https://www.instagram.com/unes.kr"><span className={home.footinstagram}></span></a></span>
                            <span><a target="_blank" href="https://www.facebook.com/%EC%9C%A0%EC%97%94%EC%9D%B4-100778369074049"><span className={home.footFacebook}></span></a></span>
                        </div>
                    </div>
                </>
            );
        } else if (widthSize >= 1025) {
            displayFooterUI.push(
                <>
                    <div className={home.footBox}>
                        <div className={home.footLeftArea}>
                            <div className={home.footTitleBox}>
                                <span>{Resource.ID.footer.footTitle}</span>
                                {/* <select className={home.footerSelect} onChange={(e) => this.onChangeLanguage(e)}>
                                    <option value={Resource.languageList[0]}>KOR</option>
                                    <option value={Resource.languageList[1]}>ENG</option>
                                </select> */}
                            </div>

                            <div className={home.footContents}>
                                <div className={home.footConTop}>
                                    <span>{Resource.ID.footer.footNum}</span>
                                    <span>{Resource.ID.footer.footCall}</span><span>{Resource.ID.footer.footFax}</span><span>{Resource.ID.footer.footEmail}</span>
                                </div>
                                <div className={home.footConBottom}>
                                    <span>{Resource.ID.footer.footSeoul}</span>
                                    <span>{Resource.ID.footer.footDaegu}</span>
                                    <span><Link to="/directions">{Resource.ID.footer.footRoad}</Link></span>
                                </div>
                            </div>
                            <div className={home.footContents2}>
                                <span className={home.footText}>CopyrightⓒU&E All rights reserved.</span>
                            </div>
                        </div>
                        <div className={home.footIconArea}>
                            <a href="../../resource/une_companyInfo_2024.pdf" download>
                                <span className={home.companyDown}>{Resource.ID.footer.footCompanyIntro}
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
                </>
            );
        } else {
            displayFooterUI.push(
                <></>
            );
        }
        return displayFooterUI;
    }

    render() {
        setTimeout(() => { this.resizeUI() }, 500);
        let displayFooterUI = this.state.disFooterUI;

        return (
            <>
                {displayFooterUI}
            </>
        );
    }
}

export default Footer; 


