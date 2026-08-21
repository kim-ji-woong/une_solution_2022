import React, { Component } from 'react';
import cIntro from '../CompanyIntro/css/company.module.css';
import home from '../components/css/home.module.css';
import $ from 'jquery';
import { Link } from "react-router-dom";


import AOS from "aos";
import "aos/dist/aos.css";

import Resource from '../resource/id';

class DirectionsEng extends Component {
    static displayName = DirectionsEng.name;

    constructor(props) {
        super(props);

        this.state = {

        }

        this.state.disDirectUI = this.displayDirectUI();
    }

    resizeUI() {
        this.setState({ disDirectUI: this.displayDirectUI() });
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
                if ($(this).scrollTop() > 4260) {
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


        const { kakao } = window;

        /* 서울 지도 */
        var mapContainer = document.getElementById('map'), // 지도를 표시할 div
            mapOption = {
                center: new kakao.maps.LatLng(37.55325363080063, 126.97130007776762), // 지도의 중심좌표
                level: 4 // 지도의 확대 레벨
            };

        // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
        var map = new kakao.maps.Map(mapContainer, mapOption);

        // 주소-좌표 변환 객체를 생성합니다
        var geocoder = new kakao.maps.services.Geocoder();

        geocoder.addressSearch('서울 용산구 청파로 345', function (result, status) {

            // 정상적으로 검색이 완료됐으면 
            if (status === kakao.maps.services.Status.OK) {

                var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                // 결과값으로 받은 위치를 마커로 표시합니다
                var marker = new kakao.maps.Marker({
                    map: map,
                    position: coords
                });

                // 인포윈도우로 장소에 대한 설명을 표시합니다
                var infowindow = new kakao.maps.InfoWindow({
                    content: '<div style="width:150px;text-align:center;padding:6px 0;font-family:SUIT-SemiBold;">(주)유엔이</div>'
                    /* content: '<div className={cIntro.placeBox}>(주)유엔이</div>' */
                });
                infowindow.open(map, marker);

                // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                map.setCenter(coords);
            }
        });


        /* 대구 지도 */
        var mapContainer2 = document.getElementById('map2'),
            mapOption2 = {
                center: new kakao.maps.LatLng(35.85512988331131, 128.58065364892576),
                level: 4
            };

        var map2 = new kakao.maps.Map(mapContainer2, mapOption2);

        // 주소-좌표 변환 객체를 생성합니다
        var geocoder = new kakao.maps.services.Geocoder();

        geocoder.addressSearch('대구 달서구 달구벌대로 1053 계명대학교 첨단산업지원센터', function (result, status) {

            // 정상적으로 검색이 완료됐으면 
            if (status === kakao.maps.services.Status.OK) {

                var coords2 = new kakao.maps.LatLng(result[0].y, result[0].x);

                // 결과값으로 받은 위치를 마커로 표시합니다
                var marker2 = new kakao.maps.Marker({
                    map: map2,
                    position: coords2
                });

                // 인포윈도우로 장소에 대한 설명을 표시합니다
                var infowindow2 = new kakao.maps.InfoWindow({
                    content: '<div style="width:150px;text-align:center;padding:6px 0;font-family:SUIT-SemiBold;">(주)유엔이</div>'
                    /* content: '<div className={cIntro.placeBox}>(주)유엔이</div>' */
                });
                infowindow2.open(map2, marker2);

                // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                map2.setCenter(coords2);
            }
        });
    }


    displayDirectUI = () => {
        let displayDirectUI = [];
        let widthSize = window.outerWidth;

        if (widthSize < 768) {
            displayDirectUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={home.comDirectionsContent}>
                            <div className={home.comDirectionsArea}>
                                <span>Seoul office</span>
                                <span>1F, Juyeon Bldg, 345, Cheongpa-ro, Yongsan-gu, Seoul, Republic of Korea (Zip code: 04303)</span>
                                <span id="map"></span>
                            </div>
                            <div className={home.comDirectionsArea2}>
                                <span>Head office</span>
                                <span>1053 Dalgubeol-daero, Dalseo-gu, Daegu (Zip code: 42601) Room 108, Keimyung University Advanced Industrial Support Center,</span>
                                {/* <span>Room 108, Keimyung University Advanced Industrial Support Center,</span> */}
                                <span id="map2"></span>
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
                                    <span>{/* 본사 : 대구 달서구 달구벌대로 1053, 계명대학교 첨단산업지원센터 108호 (우:42601) */}</span>
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
            displayDirectUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={home.comDirectionsContent}>
                            <div className={home.comDirectionsArea}>
                                <span>Seoul office</span>
                                <span>1F, Juyeon Bldg, 345, Cheongpa-ro, Yongsan-gu, Seoul, Republic of Korea (Zip code: 04303)</span>
                                <span id="map"></span>
                            </div>
                            <div className={home.comDirectionsArea2}>
                                <span>Head office</span>
                                <span>1053 Dalgubeol-daero, Dalseo-gu, Daegu (Zip code: 42601) Room 108, Keimyung University Advanced Industrial Support Center,</span>
                                {/* <span>Room 108, Keimyung University Advanced Industrial Support Center,</span> */}
                                <span id="map2"></span>
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
                                    <span>{/* 본사 : 대구 달서구 달구벌대로 1053, 계명대학교 첨단산업지원센터 108호 (우:42601) */}</span>
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
            displayDirectUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={home.comDirectionsContent}>
                            <div className={home.comDirectionsArea}>
                                <span>Seoul office</span>
                                <span>1F, Juyeon Bldg, 345, Cheongpa-ro, Yongsan-gu, Seoul, Republic of Korea (Zip code: 04303)</span>
                                <span id="map"></span>
                            </div>
                            <div className={home.comDirectionsArea2}>
                                <span>Head office</span>
                                <span>Room 108, Keimyung University Advanced Industrial Support Center, 1053 Dalgubeol-daero, Dalseo-gu, Daegu (Zip code: 42601)</span>
                                <span id="map2"></span>
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
                                        <span>{/* 본사 : 대구 달서구 달구벌대로 1053, 계명대학교 첨단산업지원센터 108호 (우:42601) */}</span>
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
            displayDirectUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={home.comDirectionsContent}>
                            <div className={home.comDirectionsArea}>
                                <span>Seoul office</span>
                                <span>1F, Juyeon Bldg, 345, Cheongpa-ro, Yongsan-gu, Seoul, Republic of Korea (Zip code: 04303)</span>
                                <span id="map"></span>
                            </div>
                            <div className={home.comDirectionsArea2}>
                                <span>Head office</span>
                                <span>Room 108, Keimyung University Advanced Industrial Support Center, 1053 Dalgubeol-daero, Dalseo-gu, Daegu (Zip code: 42601)</span>
                                <span id="map2"></span>
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
                                        <span>{/* 본사 : 대구 달서구 달구벌대로 1053, 계명대학교 첨단산업지원센터 108호 (우:42601) */}</span>
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
            displayDirectUI.push(
                <>
                    <div className={cIntro.contentBox}>
                        <div className={home.comDirectionsContent}>
                            <div className={home.comDirectionsArea}>
                                <span>Seoul office</span>
                                <span>1F, Juyeon Bldg, 345, Cheongpa-ro, Yongsan-gu, Seoul, Republic of Korea (Zip code: 04303)</span>
                                <span id="map"></span>
                            </div>
                            <div className={home.comDirectionsArea2}>
                                <span>Head office</span>
                                <span>Room 108, Keimyung University Advanced Industrial Support Center, 1053 Dalgubeol-daero, Dalseo-gu, Daegu (Zip code: 42601)</span>
                                <span id="map2"></span>
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
                                        <span>{/* 본사 : 대구 달서구 달구벌대로 1053, 계명대학교 첨단산업지원센터 108호 (우:42601) */}</span>
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
            displayDirectUI.push(
                <></>
            );
        }
        return displayDirectUI;
    }


    render() {

        setTimeout(() => { this.resizeUI() }, 500);
        let displayDirectUI = this.state.disDirectUI;

        return (
            <>
                {displayDirectUI}
            </>
        );
    }
}

export default DirectionsEng;