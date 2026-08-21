import React, { Component } from 'react';

import PopupDraggable from './popupDraggable';
import { CCTVInfoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';

import expandIcon from '../../images/expandIcon.svg';
import downsizeIcon from '../../images/downsizeIcon.svg';
import SDMS from "../sdms";

class CCTVInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fullScreenIndex: 0,
        }

        this.refCCTV1Title = React.createRef();
        this.refCCTV2Title = React.createRef();
        this.refCCTV3Title = React.createRef();
        this.refCCTV4Title = React.createRef();
    }

    getFullScreenClassName(index) {

        if(this.props.cctvList.length === 1){
            // 선택된 센서가 1개일 경우 full 사이즈로 표출
            if(index === 1) {
                return " " + 'full';
            } else {
                return " " + 'hidden';
            }
        }
        else {
            if (index === this.state.fullScreenIndex) {
                return " " + 'full';
            }
    
            if (this.state.fullScreenIndex > 0) {
                return " " + 'hidden';
            }
        }

        return "";
    }

    render() {

        return (
            <CCTVInfoComponent id={this.props.popupType} className='UI_Section cctvInfo' $resize={true}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={300}
                    popupMinHeight={314}
                    topSize={40}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >
                    <div className='dslTop'>
                        <h5 className='dslTitle'>
                            {SdmsResource.ID.menu.cctvInfo}
                        </h5>
                        <button className='dslX' onClick={() => this.props.setVisiblePopups(SDMS.menu.cctvInfo, false)}>닫기</button>
                    </div>
                    <div className={'content'}>
                        <div className={'viewDashboardCCTVConts'}>
                            <div className={'viewDashboardCCTVGrid'}>
                                {/* className : full/hidden */}
                                <div className={'col1row1 full'}>
                                    <div id="cctv1_span" ref={this.refCCTV1Title} onDoubleClick={(e) => this.showFullScreenCCTV(1)}>
                                        <div className='titleWrap selected'>
                                            <p id="cctv1_name">CCTV 01</p>
                                            <button>
                                                <img src={downsizeIcon} alt='축소 버튼' />
                                            </button>
                                        </div>
                                        {/* <iframe id="cctv1" allowtransparency="yes" scrolling="no"></iframe> */}
                                    </div>
                                </div>
                                <div className={'col2row1 hidden'}>
                                    <div id="cctv2_span" ref={this.refCCTV2Title} onDoubleClick={(e) => this.showFullScreenCCTV(2)}>
                                        <div className='titleWrap'>
                                            <p id="cctv2_name">CCTV 02</p>
                                            <button>
                                                <img src={expandIcon} alt='확대 버튼' />
                                            </button>
                                        </div>
                                        {/* <iframe id="cctv2" allowtransparency="yes" scrolling="no"></iframe> */}
                                    </div>
                                </div>
                                <div className={'col1row2 hidden'}>
                                    <div id="cctv3_span" ref={this.refCCTV3Title} onDoubleClick={(e) => this.showFullScreenCCTV(3)}>
                                        <div className='titleWrap'>
                                            <p id="cctv3_name">CCTV 03</p>
                                            <button>
                                                <img src={expandIcon} alt='확대 버튼' />
                                            </button>
                                        </div>
                                        {/* <iframe id="cctv3" allowtransparency="yes" scrolling="no"></iframe> */}
                                    </div>
                                </div>
                                <div className={'col2row2 hidden'}>
                                    <div id="cctv4_span" ref={this.refCCTV4Title} onDoubleClick={(e) => this.showFullScreenCCTV(4)}>
                                        <div className='titleWrap'>
                                            <p id="cctv4_name">CCTV 04</p>
                                            <button>
                                                <img src={expandIcon} alt='확대 버튼' />
                                            </button>
                                        </div>
                                        {/* <iframe id="cctv4" allowtransparency="yes" scrolling="no"></iframe> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </PopupDraggable>
            </CCTVInfoComponent>
        );
    }
}

export default CCTVInfo;