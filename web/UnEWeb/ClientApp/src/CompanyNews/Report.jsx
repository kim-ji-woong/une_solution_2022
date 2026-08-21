import React, { Component , useState } from 'react';
import { Link } from "react-router-dom";
import cIntro from '../CompanyIntro/css/company.module.css';
import bIntro from '../BusinessIntro/css/business.module.css';
//import CompanyController from '../CompanyNews/services/companyController';
import $ from 'jquery';
import axios from 'axios';

import '../components/css/home.css';

import newsDataTemp from "./newsDataTemp"; /* 원본 */

import AOS from "aos";
import "aos/dist/aos.css";


class Report extends Component {
    static displayName = Report.name;

    constructor(props) {
        super(props);

        this.state = {
            displayContents: [],        // 원본 데이터
            newsDatas: [],              //보여줄 데이터
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
        }

        this.props = props;
        this.state.displayContents = newsDataTemp.news;
        this.state.newsDatas = newsDataTemp.news;
        this.displayNews();
    }

    componentDidMount() {

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

        //this.displayNews();

        $(document).ready(function () {
            AOS.init();
        });

        $(function () {
            $(window).scroll(function () {
                if ($(this).scrollTop() > 500) {
                    $('#toTop').show();
                }
            });
            $(window).scroll(function () {
                if ($(this).scrollTop() > 1550) {
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

        /* function loadItem() {
            return fetch('./resource/json/newsDataTemp.json')
                .then((response) => response.json())
                .then((json) => json.news);
        }

        loadItem().then((items) => {
            this.setState({ newsDatas: items })
        }); */
    }

    componentWillUnmount() {
        this.items = false;
    }

    displayNewsUI = () => {
        let newsUI = [];

        if (!this.state.newsDatas) {
           return newsUI;
        }

        const currentPageIndex = this.state.currentPageIndex;
        const viewDataCount = this.state.viewDataCount;
        const newsDatas = this.state.newsDatas.length;

        let minIdx = 0;
        let maxIdx = 0;

        minIdx = ((currentPageIndex - 1) * 6);

        if ((currentPageIndex * viewDataCount) > newsDatas)
            maxIdx = newsDatas;
        else
            maxIdx = ((currentPageIndex - 1) * viewDataCount) + viewDataCount;

        for (let i = minIdx; i < maxIdx; i++) {
            const news = this.state.newsDatas[i];

            newsUI.push(
                <>
                {/* <div onClick={() => this.onClickContent(i)} key={news.id}>
                    <Link
                        to={{
                            pathname: '/ReportContent',
                            state: {
                                index: i
                            },
                        }} value={news.id} key={news.id}>
                    <span className={bIntro.postingBox}>
                        <span><img src={news.image} /></span>
                        <span className={bIntro.postingText}>
                            <span className={bIntro.postingTitle}>{news.boardTitle}</span>
                            <span className={bIntro.postingContents}>{news.boardContents}</span>
                            <span className={bIntro.postingDate}>{news.boardDate}</span>
                        </span>
                    </span>
                    </Link>
                </div> */}
                <div onClick={() => this.onClickContent(i)} key={news.id}>
                    <span className={bIntro.postingBox}>
                        <span><img src={news.image} /></span>
                        <span className={bIntro.postingText}>
                            <span className={bIntro.postingTitle}>{news.boardTitle}</span>
                            <span className={bIntro.postingContents}>{news.boardContents}</span>
                            <span className={bIntro.postingDate}>{news.boardDate}</span>
                        </span>
                    </span>
                </div> 
                </>
            );
        }

        //console.log(this.onClickContent(i));
        return newsUI;
    }

    onClickContent = (index) => {
        this.setState({ contentIndex: index });
    }

    displayNews = () => {
        const newsDatas = this.state.newsDatas;
        let minPageIndex = 1;
        let maxPageIndex = 1;

        if (newsDatas) {
            let rowCount = newsDatas.length;

            const value1 = parseInt(rowCount / this.state.viewDataCount);
            const value2 = rowCount % this.state.viewDataCount; // 나머지가 있는 경우 페이지 하나를 추가한다.
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

    onKeyPressSearch = (e) => {
        if (e.key === 'Enter') {
            this.onClickSearch();
        }
        return;
    }

    onClickSearch = () => {
        //const newsDatas = this.props.newsDatas;
        const newsDatas = this.state.newsDatas;

        const search = document.getElementById('search').value;
        let searchNewsDatas = new Array();

        if (newsDatas == null || search == null) {
            return;
        }

        // 2. 보도자료와 검색 단어 비교하기
        for (let i = 0; i < newsDatas.length; i++) {
            const newsData = newsDatas[i];

            // 보도자료 제목에서 검색
            if (newsData.boardTitle != null) {
                let boardTitle = null;
                boardTitle = newsData.boardTitle;

                if (boardTitle.indexOf(search) !== -1) {
                    searchNewsDatas.push(newsDatas[i]);
                    continue;
                }
            }

            // 보도자료 내용에서 검색
            if (newsData.boardContents != null) {
                let boardContents = null;
                boardContents = newsData.boardContents;

                if (boardContents.indexOf(search) != -1) {
                    searchNewsDatas.push(newsDatas[i]);
                    continue;
                }
            }
        }
        this.setState({ newsDatas: searchNewsDatas });
        return;
    }

    searchSpace = (event) => {
        let keyword = event.target.value;
        this.setState({ search: keyword })
    }

    /* setPageUI = (param) => {
        let contentIndex = this.state.contentIndex;
    } */

    render() {
        //const newsUI = this.loadNews();
        const newsUI = this.displayNewsUI();
        const pageIndexUI = this.getPageIndexUI();

        return (
            <>
                <div className={cIntro.contentBox}>
                    <div className={bIntro.reportArea}>
                        <div className={bIntro.postingTopArea}>
                            <span className={bIntro.postingCount}>총 <p>10건</p>의 게시물</span>
                        </div>
                    </div>

                    <div className={bIntro.postingBottomArea}>
                        <span className={bIntro.postingBoxArea}>
                            {newsUI} 
                        </span>
                    </div>
                    {
                        (this.state.newsDatas && this.state.newsDatas.length > 0) ?
                            /* <div className={cn.pagination}>
                                <a><span className={cn.arrowLeftFast} onClick={() => this.setPageIndex(1)}></span></a>
                                <a><span className={cn.arrowLeft} onClick={() => this.setPageIndex(this.state.currentPageIndex - 1)}></span></a> 
                                <ul>
                                    {pageIndexUI}
                                </ul>
                                <a><span className={cn.arrowRight} onClick={() => this.setPageIndex(this.state.currentPageIndex + 1)}></span></a>
                                <a><span className={cn.arrowRightFast} onClick={() => this.setPageIndex(this.state.maxPageIndex)}></span></a>
                            </div> */

                            <div className={bIntro.pagination}>
                                <a><span className={bIntro.arrowLeftFast} onClick={() => this.setPageIndex(1)}></span></a>
                                <a><span className={bIntro.arrowLeft} onClick={() => this.setPageIndex(1)}></span></a>
                                <ul>
                                    {pageIndexUI}
                                </ul>
                                <a><span className={bIntro.arrowRight} onClick={() => this.setPageIndex(this.state.maxPageIndex)}></span></a>
                                <a><span className={bIntro.arrowRightFast} onClick={() => this.setPageIndex(this.state.maxPageIndex)}></span></a>
                            </div> 
                            : <></>
                    } 
                    
                    {/* <ReportContent
                        index={this.state.contentIndex}
                        onClickContent={this.onClickContent}
                        setPageUI={this.setPageUI} /> */}
                </div>
            </>
        );
    }
    }


export default Report; 