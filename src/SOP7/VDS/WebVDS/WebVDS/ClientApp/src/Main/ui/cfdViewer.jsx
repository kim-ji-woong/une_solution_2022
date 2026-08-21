import React, { Component } from 'react';
import $ from 'jquery';

import main from '../../Main/css/main.module.css';
import '../css/main.css';
import CommonResource from '../../Common/resource/id';
import MainController from '../services/mainController';
import ProjectResource from '../../Root/resource/id';


class CFDViewer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            index: null
        }
    }

    componentDidMount() {
        this.getImages();
    }

    componentWillUnmount() {
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }

    movePage(dir) {
        if (this.state.index === null) {
            if (dir > 0 && this.state.items.length > 0) {
                this.setState({ index: 1 });
            }
        }
        else {
            const itemCount = this.state.items.length;
            const currentIndex = this.state.index;

            if (dir < 0) {
                if (currentIndex > 1 && itemCount > 0) {
                    this.setState({ index: currentIndex + dir });
                }
            }
            else {
                if (currentIndex < itemCount && itemCount > 0) {
                    this.setState({ index: currentIndex + dir });
                }
            }
        }
    }

    onMoveTo(index) {
        if (this.state.index !== index) {
            this.setState({ index });
        }
    }

    async getImages() {
        if (this.props.dataCenterID) {
            const [result, errorMessage] = await MainController.requestCFDImages(this.props.dataCenterID);

            if (result) {
                const imageCount = result.imageUrls.length;
                const items = [];

                for (let i = 0; i < imageCount; i++) {
                    const url = result.imageUrls[i];
                    const time = result.imageTimes[i];
                    items.push([url, time]);
                }

                this.setState({ items, index: (imageCount > 0 ? 1 : null) });
            }
            else {
                this.props.alertMessage(errorMessage);
            }
        }
    }

    getPageElements() {
        const itemCount = this.state.items.length;

        if (itemCount > 1) {
            const items = [];
            const currentIndex = this.state.index;
            const beginIndex = currentIndex % 5 === 0 ? parseInt((currentIndex - 1) / 5) * 5 + 1 : parseInt(currentIndex / 5) * 5 + 1;

            const leftClassName = this.state.index !== null && this.state.index > 1 ? "pageLeft" : "pageLeftDisabled";
            const rightClassName = this.state.index !== null && this.state.index < this.state.items.length ? "pageRight" : "pageRightDisabled";

            items.push(<span className={leftClassName} onClick={() => this.movePage(-1)}></span>);

            for (let i = beginIndex; i < beginIndex + 5 && i <= itemCount; i++) {
                if (i === this.state.index) {
                    items.push(<div className="active" onClick={() => this.onMoveTo(i)}>{i}</div>);
                }
                else {
                    items.push(<div onClick={() => this.onMoveTo(i)}>{i}</div>);
                }
            }

            items.push(<span className={rightClassName} onClick={() => this.movePage(1)}></span>);

            return (
                <div className="page-nav">
                    {
                        items
                    }
                </div>
            );
        }

        return (
            <></>
            );
    }

    getImageElement() {
        if (this.state.index !== null) {
            const item = this.state.items[this.state.index - 1];
            
            return (
                <div className="slides">
                    <div className="active">
                       <img src={item[0]} className="cfdImage" />
                    </div>
                </div>
            );
        }

        return (
            <></>
            );
    }

    getTime() {
        if (this.state.index !== null) {
            const item = this.state.items[this.state.index - 1];
            const index = item[1].indexOf('T');

            if (index > 0) {
                return item[1].substring(0, index);
            }

            return item[1];
        }

        return "";
    }

    onClose() {
        this.props.setVisiblePopups(this.props.popupType, false);
    }

    render() {
        const leftClassName = this.state.index !== null && this.state.index > 1 ? "cfdLeftArrow" : "cfdLeftArrowDisabled";
        const rightClassName = this.state.index !== null && this.state.index < this.state.items.length ? "cfdRightArrow" : "cfdRightArrowDisabled";

        return (
            <div className={main.inventInfoBox + " " + CommonResource.UISection}>
                <div className={CommonResource.UISection} style={{ display: 'flex' }}>
                    <span className={main.inventInfoIcon}></span>
                    <div className={main.inventInfoTitle2}>CFD</div>
                    <span className={main.cfdInfoSide}>CFD 기능 미리보기 입니다.</span>
                    <span className={main.inventCloseBtn} onClick={() => this.onClose()}></span>
                </div>

                <div className="cfdDate">{this.getTime()}</div>
                <div className="slider-2">
                    {
                        this.state.items.length > 1 &&
                        <div className="side-btns">
                            <div><span className={leftClassName} onClick={() => this.movePage(-1)}></span></div>
                            <div><span className={rightClassName} onClick={() => this.movePage(1)}></span></div>
                        </div>
                    }
                    {
                        this.getImageElement()
                    }

                    {
                        this.getPageElements()
                    }
                </div> 
            </div>
        );
    }
}
export default CFDViewer;