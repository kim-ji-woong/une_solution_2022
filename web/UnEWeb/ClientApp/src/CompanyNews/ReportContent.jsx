import React, { Component } from 'react';
import { Link } from "react-router-dom";
import cIntro from '../CompanyIntro/css/company.module.css';
import bIntro from '../BusinessIntro/css/business.module.css';
import '../CompanyNews/Report.jsx';
import $ from 'jquery';

import newsDataTemp from "./newsDataTemp";

class ReportContent extends Component {
    static displayName = ReportContent.name;
    constructor(props) {
        super(props);

        this.state = {
            //currentPageIndex:1,     //현재 페이지
            //currentPageIndex: this.props.location.state.index,
            contentIndex: -1,
            replay: true,
        }
        this.props = props;
    }

    componentDidMount() {
        /* function loadItem() {
            return fetch('./resource/json/newsDataTemp.json')
                .then((response) => response.json())
                .then((json) => json.news);
        }

        loadItem().then((items) => {
            this.setState({ newsDatas: items })
        }); */

        //console.log(newsDatas);
    }

    /* 원래 상세페이지 */
    displayNewsUI = () => {
        let newsUI = [];
        let news = newsDataTemp.news;
        let currentPageIndex = this.state.contentIndex;
        let newsCount = newsDataTemp.news;

        if (!news || !this.props.location) {
            return newsUI;
        }

        console.log(this.props.location.state.index);
        console.log(newsCount);

        if (this.props.location.state.index === 0) {
            $('.' + bIntro.reportArrowAreaL).hide();
        } else if (this.props.location.state.index >= 1) {
            $('.' + bIntro.reportArrowAreaL).show();
        }

        if (this.props.location.state.index === 9) {
            $('.' + bIntro.reportArrowAreaR).hide();
        } else if (this.props.location.state.index <= 10) {
            $('.' + bIntro.reportArrowAreaR).show();
        }

        newsUI.push(
            <>
                <div className={bIntro.reportContents}>
                    <div className={bIntro.reportContentsTop}>
                        <span className={bIntro.reportContentsTitle}>{news[this.props.location.state.index].boardTitle}</span>
                        <span className={bIntro.reportDay}>{news[this.props.location.state.index].boardDate}</span>
                    </div>
                    <div className={bIntro.reportContentsBottom}>
                        <img src={news[this.props.location.state.index].image} className={bIntro.reportImg} />
                        <span className={bIntro.reportContsArea}>
                          <span className={bIntro.reportConts}>{news[this.props.location.state.index].boardContents}</span>
                        </span>
                    </div>
                    <div className={bIntro.reportSources}>출처: {news[this.props.location.state.index].sources}</div>
                </div> 
            </>
        );
        return newsUI;
    }

    /* 이전글, 다음글 클릭했을때  */
    setPageUI = (param) => {
        //let newsUI;
        let newsCount = newsDataTemp.news;

        //this.props.index = this.props.location.state.index;
        let nextIndex = this.props.location.state.index + param;
        this.props.location.state.index = nextIndex;
        this.setState({ replay: true });

        //console.log(this.props.location.state.index);
    }

    render() {
        const newsUI = this.displayNewsUI();

        return (
            <>
                <div className={bIntro.contentBox}>
                    <div className={bIntro.reportContents}>
                        {newsUI}
                    </div>
                    <div className={bIntro.reportArrowTab}>
                        <span className={bIntro.reportArrowAreaL} onClick={() => this.setPageUI(-1)}><span className={bIntro.reArrowIcon} /* onClick={() => this.setPageUI(-1)}*/></span>이전글</span>
                        <span className={bIntro.reportBtn}><a href="businessSection#sectionNews">목록보기</a></span>
                        <span className={bIntro.reportArrowAreaR} onClick={() => this.setPageUI(1)}>다음글<span className={bIntro.reArrowIcon2} /* onClick={() => this.setPageUI(1)}*/></span></span>
                    </div>
                </div>
            </>
        );
        
    };
}

export default ReportContent;