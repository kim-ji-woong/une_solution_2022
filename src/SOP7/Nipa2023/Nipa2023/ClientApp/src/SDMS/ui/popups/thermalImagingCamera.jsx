import React, { Component } from 'react';
import $ from 'jquery';
import Monitoring from '../monitoring';
import PopupDraggable from './popupDraggable';

import SDMSResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';

import { ThermalImagingCameraComponent } from '../../styled/sdmsPopupsStyled';
import cctv_on from '../../images/cctv_on.png';
import cctv_off from '../../images/cctv_off.png';
import cctv_none from '../../images/cctv_none.png';

import Clock from '../../../Dashboard/ui/components/clock';

class ThermalImagingCamera extends Component {
    constructor(props) {
        super(props);

        this.state = {
            popupCloseUp: false,
            cctvList: "",
            cctvWidth: 0,           // cctv 화면 사이즈(가로)
            cctvHeight: 0,          // cctv 화면 사이즈(세로)
            cctvCountMax: 4,
            fullScreenIndex: -1,
        }

        this.props = props;

        // if (this.props.cctvList !== null && this.props.cctvList !== "" && this.props.cctvList !== undefined)
        //     this.state.cctvList = this.props.cctvList;

        this.refCCTV1Title = React.createRef();
        this.refCCTV2Title = React.createRef();
        this.refCCTV3Title = React.createRef();
        this.refCCTV4Title = React.createRef();
    }

    componentDidMount() {

        let cssLeft = null;
        let cssTop = null;
        let cssWidth = null;
        let cssHeight = null;

        const popup = document.getElementById(this.props.popupType);
        const target = document.getElementById("dsBot_" + this.props.popupType);
        const popupState = this.props.popupState;

        if (popup !== null && popup !== undefined &&
            target !== null && target !== undefined &&
            popupState !== null && popupState !== undefined) {
            const clientRect = target.getBoundingClientRect();
            cssLeft = clientRect.left + "px";
            cssTop = clientRect.top + "px";

            popup.style.width = 0;
            popup.style.height = 0;
            popup.style.left = cssLeft;
            popup.style.top = cssTop;

            cssLeft = popupState.x;
            cssTop = popupState.y;
            cssWidth = popupState.width;
            cssHeight = popupState.height;

            $('#' + this.props.popupType).animate({ opacity: 1, width: cssWidth, height: cssHeight, left: cssLeft, top: cssTop }, SDMSResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }
        else {
            $('#' + this.props.popupType).animate({ opacity: 1 }, SDMSResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }

        this.initPopupState();

        $('.scrollbar').scrollTop(0);
    }

    initPopupState(width, height, x, y) {
        var popup = document.getElementsByClassName('UI_Section thermalImagingCamera')[0];

        if(width && height && x && y) {
            // 확대, 축소 버튼을 눌렀을 경우
            popup.style.width = width;
            popup.style.height = height;
            popup.style.left = x;
            popup.style.top = y;
        }
        else {
            //DB에 값이 있을 경우에만
            if (typeof this.props.popupState !== 'undefined') {
                popup.style.left = this.props.popupState.x;
                popup.style.top = this.props.popupState.y;
                popup.style.width = this.props.popupState.width;
                popup.style.height = this.props.popupState.height;

                // 가로가 1120px 이상이고 세로가 850px 이상이면
                // 팝업 상단 확대 아이콘 on 상태여야 함
                let regex = /[^0-9]/g;
                let width = this.props.popupState.width.replace(regex, "");
                let height = this.props.popupState.height.replace(regex, "");

                if(width > 1119 && height > 849) {
                    this.setState({popupCloseUp: true});
                }
            } else {
                // DB에 값이 따로 없을 경우
                let data = SDMSResource.popupResetLocation[this.props.popupType];
    
                popup.style.left = data.x;
                popup.style.top = data.y;
                popup.style.width = data.width;
                popup.style.height = data.height;
            }
        }

        this.showCCTVs();
        this.setState({ popup: popup });
    }

    repositionPopup() {

        let popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return;

        let data = SDMSResource.popupResetLocation[this.props.popupType];

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
    }

    setPopupCloseUp = (popupCloseUp) => {

        if(popupCloseUp) {
            this.initPopupState('380px', '290px', '75%', '60%');
        }
        else {
            this.initPopupState('1120px', '850px', '21%', '11%');
        }

        this.setState({popupCloseUp: !popupCloseUp});
    }

    componentDidUpdate(prevProps) {
        if (this.props.cctvIds !== prevProps.cctvIds) {
            this.state.cctvList = this.props.cctvList;
            this.showCCTVs();
        }

        if (this.props.selectedSensor !== prevProps.selectedSensor) {
            this.showCCTVs();
        }

        if (this.props.cctvIds.length === 2) {
            const cctv3_name = document.getElementById('cctv3_name');
            const cctv3_facilityType = document.getElementById('cctv3_facilityType');

            cctv3_name.innerText = '';
            cctv3_facilityType.innerText = '';

            const cctv4_name = document.getElementById('cctv4_name');
            const cctv4_facilityType = document.getElementById('cctv4_facilityType');

            cctv4_name.innerText = '';
            cctv4_facilityType.innerText = '';
        }

        if(prevProps.isPopupStateReset !== this.props.isPopupStateReset) {
            this.repositionPopup();
        }
    }

    //팝업 리사이즈 이벤트 리스너
    popupResizeMouseMove = (event) => {
        let sizeY = 0;

        switch (this.state.resizeType) {
            // 수직
            case 'v-b': // 바텀 수직
                sizeY = event.pageY - this.state.originalY;

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    //그리드 사이즈를 부모(팝업) 사이즈 비율대로 조절
                    const grid = this.findElementByClassName('viewDashboardCCTVGrid');

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            case 'v-t': //탑 수직
                sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName('viewDashboardCCTVGrid');

                    if (grid) {
                        grid.style.height = (sizeY - 90) + 'px';
                    }
                }
                break;
            // 대각
            case 'd-rb': // 오른쪽 하단 대각
                sizeY = event.pageY - this.state.originalY;

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName('viewDashboardCCTVGrid');

                    if (grid) {
                        grid.style.height = (sizeY - 90) + 'px';
                    }
                }
                break;
            case 'd-rt': //오른쪽 상단 대각
                sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName('viewDashboardCCTVGrid');

                    if (grid) {
                        grid.style.height = (sizeY - 90) + 'px';
                    }
                }
                break;
            case 'd-lb': //왼쪽 하단 대각
                sizeY = event.pageY - this.state.originalY;

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName('viewDashboardCCTVGrid');

                    if (grid) {
                        grid.style.height = (sizeY - 90) + 'px';
                    }
                }
                break;
            case 'd-lt': //왼쪽 상단 대각
                sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName('viewDashboardCCTVGrid');

                    if (grid) {
                        grid.style.height = (sizeY - 90) + 'px';
                    }
                }
                break;
            default:
        }

        this.initSizeCCTV();
        this.showCCTVs();
        this.resizeFullScreenCCTV();
    }

    // 팝업 리사이징(누르고 있을 때)
    /* resizeType
        * h-r      오른쪽 수평
        * h-l      왼쪽 수평
        * v-b      바텀 수직
        * v-t      탑 수직
        * d-rt     우측 상단 대각
        * d-rb     우측 하단 대각
        * d-lt     좌축 상단 대각
        * d-lb     좌측 하단 대각
    */
    popupResizeMousePress = (event, resizeType) => {
        const popup = document.getElementById(this.props.popupType);

        this.setState({
            maxScreenHeight: document.getElementsByTagName('body')[0].clientHeight,
            maxScreenWidth: document.getElementsByTagName('body')[0].clientWidth,
            resizeType: resizeType,
            originalMouseX: event.pageX,
            originalMouseY: event.pageY,
            originalWidth: document.getElementById(this.props.popupType).clientWidth,
            originalHeight: document.getElementById(this.props.popupType).clientHeight,
            originalX: document.getElementById(this.props.popupType).getBoundingClientRect().left,
            originalY: document.getElementById(this.props.popupType).getBoundingClientRect().top,
        });
    }

    popupResizeMouseUp = (e) => {
        var popup = document.getElementsByClassName('UI_Section thermalImagingCamera')[0];

        let regex = /[^0-9]/g;
        let width = popup.style.width.replace(regex, "");
        let height = popup.style.height.replace(regex, "");

        if(width > 1119 && height > 849) {
            this.setState({popupCloseUp: true});
        } else {
            this.setState({popupCloseUp: false});
        }

        this.setState({ resizeType: null });
    }

    resizeFullScreenCCTV() {
        const fullScreenIndex  = this.state.fullScreenIndex;
        const rootElement = document.querySelector("#" + this.props.popupType);

        if (fullScreenIndex === -1 || !rootElement) {
            return;
        }

        const gridParent = document.getElementsByClassName('viewDashboardCCTVGrid')[0];

        if (gridParent) {
            let width = gridParent.clientWidth;
            let height = gridParent.clientHeight;

            // 사이즈 조절하기 위한 url 재작성
            let id = "cctv" + fullScreenIndex.toString();
            const frame = this.getChildElement(rootElement, id);

            if (frame !== null && frame !== undefined) {
                let url = frame.parentNode.dataset.url + "?w=" + width + "px&h=" + height + "px";
                frame.setAttribute("src", url);
            }

            this.setState({ cctvWidth: width, cctvHeight: height });
        }
    }

    showCCTVs = () => {
        const selectedSensor = this.props.selectedSensor;
        const ids = this.props.cctvIds;
        
        let idCount = ids.length;

        if (idCount > this.state.cctvCountMax)
            idCount = this.state.cctvCountMax;

        let index = 1;

        for (let i = 0; i < idCount; i++) {
            const suuid = ids[i];

            if (suuid.length === 0) {
                continue;
            }

            if (suuid === selectedSensor?.id) {
                this.setTitleClassName(i, 'on');
            }
            else {
                this.setTitleClassName(i, '');
            }

            const id = '#cctv' + index.toString();
            this.connectStream(suuid, id);
            index++;
        }

        for (let i = index; i <= this.state.cctvCountMax; i++) {
            const id = '#cctv' + i.toString();
            this.closeStream(id);
        }
    }

    setTitleClassName(index, className) {
        let title = null;

        if (index === 0 && this.refCCTV1Title !== null && this.refCCTV1Title.current !== null) {
            title = this.refCCTV1Title;
        }
        else if (index === 1 && this.refCCTV2Title !== null && this.refCCTV2Title.current !== null) {
            title = this.refCCTV2Title;
        }
        else if (index === 2 && this.refCCTV3Title !== null && this.refCCTV3Title.current !== null) {
            title = this.refCCTV3Title;
        }
        else if (index === 3 && this.refCCTV4Title !== null && this.refCCTV4Title.current !== null) {
            title = this.refCCTV4Title;
        }
        else {
            return;
        }

        if (className === '') {
            title.current.removeAttribute('class');
        }
        else if (title.current.classList.contains(className) === false) {
            title.current.removeAttribute('class');
            title.current.classList.add(className);
        }
    }

    initSizeCCTV = () => {
        // cctv 화면 사이즈 체크
        const rootElement = document.querySelector("#" + this.props.popupType);

        if (!rootElement) {
            return;
        }

        const frames = [
            this.getChildElement(rootElement, "cctv1"),
            this.getChildElement(rootElement, "cctv2"),
            this.getChildElement(rootElement, "cctv3"),
            this.getChildElement(rootElement, "cctv4")
        ];

        //그리드에 맞춰 iframe 사이즈를 재조정한다.
        const grid_col = document.getElementsByClassName('col1row1')[0];
        if (grid_col) {
            let width = grid_col.clientWidth;
            let height = grid_col.clientHeight;

            for (let frame of frames) {
                if (frame === null || frame === undefined)
                    continue;

                frame.style.width = width + "px";
                frame.style.height = height + "px";
            }

            this.state.cctvWidth = width;
            this.state.cctvHeight = height;

            this.setState({ cctvWidth: width, cctvHeight: height });

        }
    }

    getChildElement(parent, id) {
        if (parent.hasChildNodes()) {
            const childCount = parent.childNodes.length;

            for (let i = 0; i < childCount; i++) {
                const child = parent.childNodes[i];

                if (child.id === id) {
                    return child;
                }
                else {
                    const result = this.getChildElement(child, id);

                    if (result !== null)
                        return result;
                }
            }
        }

        return null;
    }

    connectStream = (suuid, id) => {
        const rootElement = document.querySelector("#" + this.props.popupType);

        if (!rootElement) {
            return;
        }

        const findID = id.startsWith('#') ? id.substring(1) : id;
        const frame = this.getChildElement(rootElement, findID);

        if (frame === null || frame === undefined)
            return;

        let width = this.state.cctvWidth;
        let height = this.state.cctvHeight;


        if (width === 0 || height === 0) {
            const frame = this.getChildElement(rootElement, "cctv1");

            if (frame === null || frame === undefined)
                return;

            width = frame.clientWidth;
            height = frame.clientHeight;
        }


        let param = "";
        if (width !== null && width !== undefined && height !== null && height !== undefined) {
            param = "?w=" + width + "&h=" + height;
        }
        else if (width !== null && width !== undefined) {
            param = "?w=" + width;
        }
        else if (height !== null && height !== undefined) {
            param = "?h=" + height;
        }

        const url = this.props.streamServerURL + "/stream.html?src=" + suuid + "&mode=mse";   // .TODO: MSE 미디어 서버 방식
        frame.setAttribute("src", url);

        //전체화면 이벤트에 사용
        frame.parentNode.dataset.url = this.props.streamServerURL + "/stream.html?src=" + suuid + "&mode=mse";
        frame.previousElementSibling.dataset.url = this.props.streamServerURL + "/stream.html?src=" + suuid + "&mode=mse";
        
        // CCTV 번호 및 이름 표시
        this.showCCTVInfo(suuid, id);

        const hidden = frame.classList.contains("hidden");

        if (hidden) {
            frame.classList.remove("hidden");
        }
    }

    closeStream = (id) => {
        const rootElement = document.querySelector("#" + this.props.popupType);

        if (!rootElement) {
            return;
        }

        const findID = id.startsWith('#') ? id.substring(1) : id;
        const frame = this.getChildElement(rootElement, findID);
        
        if (frame === null)
            return;

        let titleID = id + "_name";
        const findTitleID = titleID.startsWith('#') ? titleID.substring(1) : titleID;

        if (frame !== null && frame !== undefined) {
            const url = "";
            frame.setAttribute("src", url);

            const hidden = frame.classList.contains("hidden");

            if (hidden === false) {
                frame.classList.add("hidden");
            }
        }
    }

    showFullScreenCCTV(index) {
        const rootElement = document.querySelector("#" + this.props.popupType);

        if (!rootElement) {
            return;
        }

        const gridParent = document.getElementsByClassName('viewDashboardCCTVGrid')[0];

        if (this.state.fullScreenIndex === index) {
            if (gridParent) {
                let width = (gridParent.clientWidth - 10) / 2;
                let height = (gridParent.clientHeight - 10) / 2;

                // 사이즈 조절하기 위한 url 재작성
                let id = "cctv" + index.toString();
                const frame = this.getChildElement(rootElement, id);
                //let id = "#cctv" + index.toString();
                //const frame = document.querySelector(id);

                if (frame !== null && frame !== undefined) {
                    //let url = frame.parentNode.dataset.url + "?w=" + width + "px&h=" + height + "px";     // 기존 방식(RTSPtoWebRTC)
                    let url = frame.parentNode.dataset.url;                                                 // MSE 미디어 서버 방식
                    frame.setAttribute("src", url);
                }

                this.setFrameSize(width, height);
                this.setState({ fullScreenIndex: -1, cctvWidth: width, cctvHeight: height });
            }
            else {
                this.setState({ fullScreenIndex: -1 });
            }
        }
        else {
            if (gridParent) {
                let width = gridParent.clientWidth;
                let height = gridParent.clientHeight;

                // 사이즈 조절하기 위한 url 재작성
                let id = "cctv" + index.toString();
                const frame = this.getChildElement(rootElement, id);

                if (frame !== null && frame !== undefined) {
                    let url = frame.parentNode.dataset.url;                                                 // MSE 미디어 서버 방식
                    frame.setAttribute("src", url);
                }

                this.setFrameSize(width, height);
                this.setState({ fullScreenIndex: index, cctvWidth: width, cctvHeight: height });
            }
            else {
                this.setState({ fullScreenIndex: index });
            }
        }
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

    setFrameSize(width, height) {
        const rootElement = document.querySelector("#" + this.props.popupType);

        if (!rootElement) {
            return;
        }

        for (let i = 1; i <= 4; i++) {
            //그리드에 맞춰 iframe 사이즈를 재조정한다.
            const frame = this.getChildElement(rootElement, "cctv" + i);
            //const frame = document.querySelector("#cctv" + i);

            if (frame) {
                frame.style.width = width + "px";
                frame.style.height = height + "px";
            }
        }
    }

    // CCTV 이름 표시
    showCCTVInfo = (suuid, id) => {
        if (this.props.cctvList === null || this.props.cctvList === undefined)
            return;

        let cctvs = this.props.cctvList;
        let titleID = id + "_name";

        let cctvName = "";
        let facilityTypeName = "";

        for (let i = 0; cctvs.length > i; i++) {
            if (cctvs[i].id == suuid) {
                cctvName = cctvs[i].cameraName;
                facilityTypeName = cctvs[i].facilityTypeName;
                break;
            }
        }

        const rootElement = document.querySelector("#" + this.props.popupType);

        if (!rootElement) {
            return;
        }

        const findTitleID = titleID.endsWith('name') ? titleID.substring(1) : titleID;

        const title = this.getChildElement(rootElement, findTitleID);
        const facilityType = title.nextSibling;

        if (title !== null && facilityType !== null) {
            title.innerHTML = cctvName;
            facilityType.innerHTML = "[" + facilityTypeName + "]";
        }
    }

    render() {
        const popupCloseUp = this.state.popupCloseUp;
        const cctvList = this.props.cctvList;

        return (
            <ThermalImagingCameraComponent id={this.props.popupType} className='UI_Section thermalImagingCamera'>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={380}
                    popupMinHeight={290}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                    popupResizeMouseMove={this.popupResizeMouseMove}
                    popupResizeMousePress={this.popupResizeMousePress}
                    popupResizeMouseUp={this.popupResizeMouseUp}
                >
                    <button className='closeUpBtn' onClick={() => this.setPopupCloseUp(popupCloseUp)}>
                        <img src={popupCloseUp ? cctv_on : cctv_off} alt='확대'/>
                    </button>
                    <div className={'dslTop'}>
                        <div>
                            <h5 className={'dslTitle'} >
                                카메라 영상정보
                            </h5>
                            <Clock />
                        </div>
                        <div className={'dslX'} onClick={() => this.props.setVisiblePopups(Monitoring.menu.ThermalImagingCamera, false)}>
                            <a href="#none">닫기버튼</a>
                        </div>
                    </div>
                    <div className={'viewDashboardCCTVConts'}>
                        <div className={'viewDashboardCCTVGrid'}>
                            <div className={'col1row1' + this.getFullScreenClassName(1)}>
                                <span id="cctv1_span" ref={this.refCCTV1Title} onDoubleClick={(e) => this.showFullScreenCCTV(1)}>
                                    <div className='titleWrap'>
                                        <p id="cctv1_name"></p>
                                        <p id="cctv1_facilityType"></p>
                                    </div>
                                    <iframe id="cctv1" allowtransparency="yes" scrolling="no"></iframe>
                                </span>
                            </div>
                            <div className={'col2row1' + this.getFullScreenClassName(2)}>
                                <span id="cctv2_span" ref={this.refCCTV2Title} onDoubleClick={(e) => this.showFullScreenCCTV(2)}>
                                    <div className='titleWrap'>
                                        <p id="cctv2_name"></p>
                                        <p id="cctv2_facilityType"></p>
                                    </div>
                                    {
                                        cctvList.length < 2 ?
                                        <div className='cctv_none'><img src={cctv_none} alt="CCTV 없음" /></div>
                                        : <iframe id="cctv2" allowtransparency="yes" scrolling="no"></iframe>
                                    }
                                </span>
                            </div>
                            <div className={'col1row2' + this.getFullScreenClassName(3)}>
                                <span id="cctv3_span" ref={this.refCCTV3Title} onDoubleClick={(e) => this.showFullScreenCCTV(3)}>
                                    <div className='titleWrap'>
                                        <p id="cctv3_name"></p>
                                        <p id="cctv3_facilityType"></p>
                                    </div>
                                    {
                                        cctvList.length < 3 ?
                                        <div className='cctv_none'><img src={cctv_none} alt="CCTV 없음" /></div>
                                        : <iframe id="cctv3" allowtransparency="yes" scrolling="no"></iframe>
                                    }
                                </span>
                            </div>
                            <div className={'col2row2' + this.getFullScreenClassName(4)}>
                                <span id="cctv4_span" ref={this.refCCTV4Title} onDoubleClick={(e) => this.showFullScreenCCTV(4)}>
                                    <div className='titleWrap'>
                                        <p id="cctv4_name"></p>
                                        <p id="cctv4_facilityType"></p>
                                    </div>
                                    {
                                        cctvList.length < 4 ?
                                        <div className='cctv_none'><img src={cctv_none} alt="CCTV 없음" /></div>
                                        : <iframe id="cctv4" allowtransparency="yes" scrolling="no"></iframe>
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                </PopupDraggable>
            </ThermalImagingCameraComponent>
        );
    }
}

export default ThermalImagingCamera;