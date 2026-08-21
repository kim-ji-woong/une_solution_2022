import React, { Component } from 'react';
import bIntro from '../BusinessIntro/css/business.module.css';

import newsDataTemp from "../CompanyNews/newsDataTemp";
import Resource from '../resource/id';
import '../components/css/home.css';


const NewsModal = ({ selectedNews, handleClose, show, children, index, onClickContent, setPageUI }) => {
    const showHideClassName = show ? "modal d-block" : "modal d-none";
    const news = newsDataTemp.news;


    if (selectedNews) {
        return (

            //const NewsModalUI = this.displayNewsModalUI();
            <>
                <div className={showHideClassName}>
                    <div className="modal-container" /* onClick={() => onClickContent(index)} */ /* value={news.id} */>
                        {/* {children} */}
                        <div>
                            <div className={bIntro.reportContents} value={news.id}>
                                <span className={bIntro.reportBtnLeft} onClick={() => setPageUI(-1)}></span>
                                <div className={bIntro.reportContentsTop}>
                                    <span className={bIntro.reportContentsTitle}>{selectedNews.boardTitle}</span>
                                </div>
                                <div className={bIntro.reportContentsMiddle}>
                                    <img src={selectedNews.image} className={bIntro.reportImg} />
                                    <span className={bIntro.reportContsArea}>
                                        <span className={bIntro.reportConts}>{selectedNews.boardContents}</span>
                                    </span>
                                </div>
                                <div className={bIntro.reportContentsBottom}>
                                    <div className={bIntro.reportSources}>{selectedNews.sources}</div>
                                    <span className={bIntro.reportDay}>{selectedNews.boardDate}</span>
                                </div>
                                <span className={bIntro.reportBtnClose} onClick={handleClose}></span>
                                <span className={bIntro.reportBtnRight} onClick={() => setPageUI(1)}></span>
                            </div>
                        </div>
                    </div> {/* modalContainer */}
                </div>
            </>
        );
    }

    return <></>;
}

export default NewsModal;