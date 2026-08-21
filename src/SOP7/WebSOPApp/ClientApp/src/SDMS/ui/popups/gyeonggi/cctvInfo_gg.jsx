
import React, { PureComponent } from 'react';
import $ from 'jquery';
import SettingsStore from '../../../../Settings/settingsStore';
import store from '../../../../Root/store';

import Contents3D from '../../3D/contents3D';

import SdmsResource from '../../../resource/id';
import ProjectResource from '../../../../Root/resource/id';

import PopupDraggable from '../popupDraggable';

import { CCTVInfoComponent } from '../../../styled/sdmsPopupsStyled';
import { i18n, withTranslation } from '../../../../language/i18n';

import hoistStatics from 'hoist-non-react-statics';

import CCTVSetting_gg from '../../../../Settings/ui/popups/gyeonggi/cctvSetting_gg';

class CCTVInfo_gg extends PureComponent {
    static Mode_Select_Sensor = 1;
    static Mode_Select_CCTV = 2;
    static Mode_Delete_CCTV = 3;

    constructor(props) {
        super(props);

        this.state = {
            cctvList: "",
            cctvWidth: 0,           // cctv 화면 사이즈(가로)
            cctvHeight: 0,          // cctv 화면 사이즈(세로)
            cctvCountMax: 4,        // cctv 최대 갯수
            streamServerURL: "",
            fullScreenIndex: -1,
            popupMinWidth: 360,
            popupMinHeight: 380,
            refreshTime: 1000 * 60 * 30,     // 30분 (자동 새로고침 시간)
            reload: 0,
            popupOpen:false,
            tooltip:{
                tooltipShow: false,
                tooltipTop: 0,
                tooltipLeft: 0
            }
        };

        this.props = props;

        if (this.props.cctvList !== null && this.props.cctvList !== "" && this.props.cctvList !== undefined)
            this.state.cctvList = this.props.cctvList;

        if (this.props.streamServerURL !== null && this.props.streamServerURL !== "" && this.props.streamServerURL !== undefined)
            this.state.streamServerURL = this.props.streamServerURL;

        this.initPopupState = this.initPopupState.bind(this);
        this.onClickReset = this.onClickReset.bind(this);

        this.refCCTV1Title = React.createRef();
        this.refCCTV2Title = React.createRef();
        this.refCCTV3Title = React.createRef();
        this.refCCTV4Title = React.createRef();

        this.refCCTVDiv = React.createRef();

        this.timer = null;
    }

    componentDidMount() {
        // 창이 서서히 나타나는 효과
        let cssLeft = null;
        let cssTop = null;
        let cssWidth = null;
        let cssHeight = null;

        const popup = document.getElementById(this.props.popupType);
        const target = document.getElementById("dsBot_" + SdmsResource.popupLayer.cctvInfo);
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

            $('#' + this.props.popupType).animate({ opacity: 1, width: cssWidth, height: cssHeight, left: cssLeft, top: cssTop }, SdmsResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }
        else {
            $('#' + this.props.popupType).animate({ opacity: 1 }, SdmsResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }

        this.initPopupState();

        this.setCctvFullScreenInit();

        // 포커스 CCTV 팝업창
        this.initCCTVPopupFocus();

        // 모드에 따른 닫기 버튼 표시여부
        if (this.props.editMode === Contents3D.Edit_Mode_CCTVGroup) {
            $('#cctvInfoCloseBtn').hide();
        } else {
            $('#cctvInfoCloseBtn').show();
        }

        this.unsubscribe = SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));

        // CCTV 자동 새로고침 타이머 >> 영상 끊김 문제
        this.timer = setTimeout(() => this.timerReset(this), this.state.refreshTime);
    }

    componentWillUnmount() {
        this.unsubscribe();

        // 자동 새로고침 타이머 종료
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    // CCTV 자동 새로고침 타이머 
    timerReset = (target) => {
        if (target !== null && target !== undefined) {
            target.onClickReset();

            target.timer = setTimeout(() => target.timerReset(target), target.state.refreshTime);
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
                        if(ProjectResource.styleMode === ProjectResource.StyleType.Wonik) {
                            grid.style.height = (sizeY - 90) + 'px';
                        } else {
                            grid.style.height = (sizeY - 70) + 'px';
                        }
                    }
                }
                break;
            // 대각
            case 'd-rb': // 오른쪽 하단 대각
                sizeY = event.pageY - this.state.originalY;

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName('viewDashboardCCTVGrid');

                    if (grid) {
                        if(ProjectResource.styleMode === ProjectResource.StyleType.Wonik) {
                            grid.style.height = (sizeY - 90) + 'px';
                        } else {
                            grid.style.height = (sizeY - 70) + 'px';
                        }
                    }
                }
                break;
            case 'd-rt': //오른쪽 상단 대각
                sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName('viewDashboardCCTVGrid');

                    if (grid) {
                        if(ProjectResource.styleMode === ProjectResource.StyleType.Wonik) {
                            grid.style.height = (sizeY - 90) + 'px';
                        } else {
                            grid.style.height = (sizeY - 70) + 'px';
                        }
                    }
                }
                break;
            case 'd-lb': //왼쪽 하단 대각
                sizeY = event.pageY - this.state.originalY;

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName('viewDashboardCCTVGrid');

                    if (grid) {
                        if(ProjectResource.styleMode === ProjectResource.StyleType.Wonik) {
                            grid.style.height = (sizeY - 90) + 'px';
                        } else {
                            grid.style.height = (sizeY - 70) + 'px';
                        }
                    }
                }
                break;
            case 'd-lt': //왼쪽 상단 대각
                sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName('viewDashboardCCTVGrid');

                    if (grid) {
                        if(ProjectResource.styleMode === ProjectResource.StyleType.Wonik) {
                            grid.style.height = (sizeY - 90) + 'px';
                        } else {
                            grid.style.height = (sizeY - 70) + 'px';
                        }
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

    popupResizeMouseUp = () => {
        this.setState({ resizeType: null });
    }

    initCCTVPopupFocus() {
        const alarmInfo = this.props.alarmInfo;
        const selectedAlarm = this.props.selectedAlarm;

        if (alarmInfo === null || alarmInfo === undefined ||
            selectedAlarm === null || selectedAlarm === undefined)
            return;

        // CCTV 팝업창이 포커스된 경우
        if (alarmInfo[1].sensorZoneHistoryID === selectedAlarm.sensorZoneHistoryID) {
            $(".cctvAlarm_" + alarmInfo[1].sensorZoneHistoryID).addClass('dslGrdAct');
        }
    }

    /*
    isDifferntSize(nextProps, nextState) {
        const currentStyle = this.state.popup?.style;
        const nextStyle = nextState.popup?.style;

        if (!currentStyle && !nextStyle) {
            return false;
        }
        else if (!currentStyle) {
            console.log("current style is : " + currentStyle);
            return true;
        }
        else if (!nextStyle) {
            console.log("next style is : " + nextStyle);
            return true;
        }

        if (currentStyle.width !== nextStyle.width) {
            console.log("current width : " + currentStyle.width + ", next width : " + nextStyle.width);
            return true;
        }

        if (currentStyle.height !== nextStyle.height) {
            console.log("current height : " + currentStyle.height + ", next height : " + nextStyle.height);
            return true;
        }

        return false;
    }

    isDifferntCCTVList(nextProps, nextState) {
        const cctvList1 = this.props.cctvList;
        const cctvList2 = nextProps.cctvList;

        if (cctvList1 !== cctvList2) {
            console.log("cctvList1 : " + cctvList1 + ", cctvList2 : " + cctvList2);
            return true;
        }

        if (this.state.fullScreenIndex !== nextState.fullScreenIndex) {
            console.log("current fullScreenIndex : " + this.state.fullScreenIndex + ", next fullScreenIndex : " + nextState.fullScreenIndex);
            return true;
        }

        return false;
    }
    */

    componentDidUpdate(prevProps, prevState) {
        if (this.props.cctvList !== prevProps.cctvList) {
            this.state.cctvList = this.props.cctvList;
            this.showCCTVs();
        } else if (this.props.selectedCCTVID !== prevProps.selectedCCTVID) {
            const cctvIDs = !this.state.cctvList ? "" : this.state.cctvList;
            const ids = cctvIDs.split(',');

            if (ids?.length > 1 && this.state.fullScreenIndex !== -1 && this.props.selectedCCTVID !== null) {
                const idx = this.state.fullScreenIndex;
                this.showFullScreenCCTV(idx);
            }

            this.setCCTVClasses(this.props);
        }

        if (this.props.streamServerURL !== prevProps.streamServerURL) {
            this.state.streamServerURL = this.props.streamServerURL;
        }

        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
            console.log('cctvInfoZIndex changed', this.state.popup.style.zIndex)
        }
    }

    initPopupState() {
        const popup = this.refCCTVDiv.current;
        if (!popup)
            return;

        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;

            const grid = this.findElementByClassName('viewDashboardCCTVGrid');
            //let grid = document.getElementsByClassName('viewDashboardCCTVGrid')[0];
            grid.style.height = (popup.offsetHeight - 70) + 'px';
        } else {
            // DB에 값이 따로 없을 경우
            let data = SdmsResource.popupResetLocation[this.props.popupType];

            popup.style.left = data.x;
            popup.style.top = data.y;
            popup.style.width = data.width;
            popup.style.height = data.height;

            const grid = this.findElementByClassName('viewDashboardCCTVGrid');

            grid.style.height = (popup.offsetHeight - 70) + 'px';
        }

        this.initSizeCCTV();
        this.showCCTVs();  
        this.setState({ popup: popup });
    }

    initSizeCCTV = () => {
        // cctv 화면 사이즈 체크
        //const frame = document.querySelector("#cctv1");
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
        const grid_col = this.findElementByClassName('col1row1');
        //const grid_col = document.getElementsByClassName('col1row1')[0];
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

    repositionPopup(popupState) {
        let data = popupState[this.props.popupType];

        if (data === null || data === undefined)
            return;
        
        let popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return;

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        const grid = this.findElementByClassName('viewDashboardCCTVGrid');
        grid.style.height = (popup.offsetHeight - 70) + 'px';

        this.initSizeCCTV();
        this.showCCTVs();
        this.setState({ popup: popup });
    }

    resetPopupState = (popupState) => {
        let data = popupState;

        if (data.actionType === 'RESET_POPUP') {
            this.repositionPopup(data.popupState);
        }
    }

    setEditModeCCTVList(ids, idCount) {
        const cctvList = [null, null, null, null];
        const [equipZoneID, equipZoneName] = this.getCurrentEquipZoneInfo();

        if (equipZoneID === 0 || equipZoneID) {
            let index = 0;

            for (let i = 0; i < idCount; i++) {
                const cctvID = ids[i].trim();

                if (cctvID.length > 0 && cctvID !== "NaN") {
                    cctvList[index++] = cctvID;
                }
            }

            this.props.editModeManager.setEquipZoneCCTVGroup(equipZoneID, cctvList[0], cctvList[1], cctvList[2], cctvList[3]);
        }
    }

    setCCTVClasses(props) {
        const input = !this.state.cctvList ? "" : this.state.cctvList;
        const cctvIDs = input.toString().trim();

        const ids = cctvIDs.split(',');
        let idCount = ids.length;

        if (idCount > this.state.cctvCountMax)
            idCount = this.state.cctvCountMax;

        let index = 1;

        for (let i = 0; i < idCount; i++) {
            const suuid = ids[i].trim();

            if (suuid.length === 0) {
                this.setTitleClassName(i, '');
                continue;
            }

            if (this.isSelectedCCTV(suuid, props)) {
                this.setTitleClassName(i, 'selected');
            }
            else {
                this.setTitleClassName(i, '');
            }

            index++;
        }

        for (let i = index; i <= this.state.cctvCountMax; i++) {
            this.setTitleClassName(i, '');
        }
    }

    showCCTVs = () => {
        const input = !this.state.cctvList ? "" : this.state.cctvList;
        const cctvIDs = input.toString().trim();
        
        const ids = cctvIDs.split(',');
        let idCount = ids.length;

        if (cctvIDs === "")
            idCount = 0;

        if (idCount > this.state.cctvCountMax)
            idCount = this.state.cctvCountMax;

        if (this.props.editMode === Contents3D.Edit_Mode_CCTVGroup) {
            this.setEditModeCCTVList(ids, idCount);
        }

        let index = 1;

        for (let i = 0; i < idCount; i++) {
            const suuid = ids[i].trim();

            if (suuid.length === 0) {
                this.setTitleClassName(i, '');
                continue;
            }

            if (this.isSelectedCCTV(suuid, this.props)) {
                this.setTitleClassName(i, 'selected');
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
            this.setTitleClassName(i, '');
        }

        // 영상이 1개이라면 큰 화면으로
        if (idCount === 1) {
            if (this.state.fullScreenIndex !== 1)
                this.showFullScreenCCTV(1);
        }
        else if (idCount !== 0 && this.state.fullScreenIndex !== -1) {
            const idx = this.state.fullScreenIndex;
            this.showFullScreenCCTV(idx);
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

    isSelectedCCTV(id, props) {
        if (id === null) {
            return false;
        }

        const _id = parseInt(id);

        if (_id !== null && _id !== undefined && isNaN(_id) === false) {
            return _id === props.selectedCCTVID;
        }

        return false;
    }

    connectStream = (suuid, id) => {
        const rootElement = document.querySelector("#" + this.props.popupType);

        if (!rootElement) {
            return;
        }

        const findID = id.startsWith('#') ? id.substring(1) : id;
        const frame = this.getChildElement(rootElement, findID);

        //const frame = document.querySelector(id);

        if (frame === null || frame === undefined)
            return;

        let width = this.state.cctvWidth;
        let height = this.state.cctvHeight;

        if (width === 0 || height === 0) {
            const frame = this.getChildElement(rootElement, "cctv1");
            //const frame = document.querySelector("#cctv1");

            if (frame === null || frame === undefined)
                return;

            width = frame.clientWidth;
            height = frame.clientHeight;
        }

        let param = "";
        if (width !== null && width !== undefined && height !== null && height !== undefined) {
            param = "w=" + width + "&h=" + height;
        }
        else if (width !== null && width !== undefined) {
            param = "w=" + width;
        }
        else if (height !== null && height !== undefined) {
            param = "?h=" + height;
        }

        let cctvs = this.props.cctvs;
        let cctvName;
        let cctv = null;

        for (let i = 0; cctvs.length > i; i++) {
            if (cctvs[i].id == suuid) {
                cctvName = suuid + ". " + cctvs[i].name;
                cctv = cctvs[i];
                break;
            }
        }

        if (cctv && cctv.type.toLowerCase() === "http") {
            frame.setAttribute("src", cctv.url);
            frame.parentNode.dataset.url = cctv.url;
            frame.previousElementSibling.dataset.url = cctv.url;
        }
        else {
            if (ProjectResource.SiteID === ProjectResource.Site.Soulbrain) {
                const cctvAllList = store.getState().cctvAllList;
                const cctv = cctvAllList.find(x => x.id.toString() === suuid);
                let url = cctv?.url?.length > 0 ? cctv.url : null;
                
                if (url !== null && url.indexOf("/stream/player/") === -1) {
                    url += "&mode=mse";
                }
                
                frame.parentNode.dataset.url = url;
                frame.previousElementSibling.dataset.url = url;

                if (url !== null && url.indexOf("/stream/player/") !== -1) 
                    url += param;
                
                frame.setAttribute("src", url);
            }
            else {
                //let url = this.state.streamServerURL + "/stream/player/" + suuid + param;             // 기존 방식(RTSPtoWebRTC)
                const url = this.state.streamServerURL + "/stream.html?src=" + suuid + "&mode=mse";     // MSE 미디어 서버 방식
                frame.setAttribute("src", url);

                //전체화면 이벤트에 사용
                //frame.parentNode.dataset.url = this.state.streamServerURL + "/stream/player/" + suuid;                                // 기존 방식(RTSPtoWebRTC)
                //frame.previousElementSibling.dataset.url = this.state.streamServerURL + "/stream/player/" + suuid;                    // 기존 방식(RTSPtoWebRTC)
                frame.parentNode.dataset.url = this.state.streamServerURL + "/stream.html?src=" + suuid + "&mode=mse";                  // MSE 미디어 서버 방식
                frame.previousElementSibling.dataset.url = this.state.streamServerURL + "/stream.html?src=" + suuid + "&mode=mse";      // MSE 미디어 서버 방식
            }            
        }

        frame.parentNode.dataset.cctvname = cctvName;
        frame.previousElementSibling.dataset.cctvname = cctvName;


        // CCTV 번호 및 이름 표시
        this.showCCTVInfo(suuid, id);

        const hidden = frame.classList.contains('hidden');

        if (hidden) {
            frame.classList.remove('hidden');
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

    findElementByClassName(className, parent) {
        if (!parent) {
            const rootElement = document.querySelector("#" + this.props.popupType);

            if (!rootElement) {
                return null;
            }

            parent = rootElement;

            if (parent.className === className)
                return parent;
        }

        if (parent.hasChildNodes()) {
            const childCount = parent.childNodes.length;

            for (let i = 0; i < childCount; i++) {
                const child = parent.childNodes[i];

                if (child.className === className) {
                    return child;
                }
                else {
                    const result = this.findElementByClassName(className, child);

                    if (result !== null)
                        return result;
                }
            }
        }

        return null;
    }

    showCCTVInfo = (suuid, id) => {
        if (this.props.ccvts === null || this.props.cctvs === undefined)
            return;

        let cctvs = this.props.cctvs;
        let titleID = id + "_name";
        
        let cctvName = "";

        for (let i = 0; cctvs.length > i; i++) {
            if (cctvs[i].id == suuid) {
                if (ProjectResource.SiteID === ProjectResource.Site.Soulbrain)
                    cctvName = suuid + ". " + cctvs[i].name;
                else
                    cctvName = cctvs[i].name;
                break;
            }
        }

        const rootElement = document.querySelector("#" + this.props.popupType);

        if (!rootElement) {
            return;
        }

        const findTitleID = titleID.startsWith('#') ? titleID.substring(1) : titleID;
        const title = this.getChildElement(rootElement, findTitleID);
        //let title = document.querySelector(titleID);

        if (title !== null) {
            title.innerHTML = cctvName;
        }
    }

    closeStream = (id) => {
        const rootElement = document.querySelector("#" + this.props.popupType);

        if (!rootElement) {
            return;
        }

        const findID = id.startsWith('#') ? id.substring(1) : id;
        const frame = this.getChildElement(rootElement, findID);
        //const frame = document.querySelector(id);

        if (frame === null)
            return;

        let titleID = id + "_name";
        const findTitleID = titleID.startsWith('#') ? titleID.substring(1) : titleID;

        const title = this.getChildElement(rootElement, findTitleID);
        //const title = document.querySelector(titleID);

        if (frame !== null && frame !== undefined) {
            const url = "";
            frame.setAttribute("src", url);

            title.innerHTML = "";

            const hidden = frame.classList.contains('hidden');

            if (hidden === false) {
                frame.classList.add('hidden');
            }
        }
    }

    onClickReset = () => {
        this.showCCTVs();
    }

    resizeFullScreenCCTV() {
        const fullScreenIndex  = this.state.fullScreenIndex;
        const rootElement = document.querySelector("#" + this.props.popupType);

        if (fullScreenIndex === -1 || !rootElement) {
            return;
        }

        const gridParent = this.findElementByClassName('viewDashboardCCTVGrid', rootElement);

        if (gridParent) {
            let width = gridParent.clientWidth;
            let height = gridParent.clientHeight;

            // 사이즈 조절하기 위한 url 재작성
            let id = "cctv" + fullScreenIndex.toString();
            const frame = this.getChildElement(rootElement, id);

            if (frame !== null && frame !== undefined) {
                let url = frame.parentNode.dataset.url + "w=" + width + "px&h=" + height + "px";
                frame.setAttribute("src", url);
            }

            this.setState({ cctvWidth: width, cctvHeight: height });
        }
    }

    showFullScreenCCTV(index) {
        const rootElement = document.querySelector("#" + this.props.popupType);

        if (!rootElement) {
            return;
        }

        const gridParent = this.findElementByClassName('viewDashboardCCTVGrid', rootElement);
        //const gridParent = document.getElementsByClassName('viewDashboardCCTVGrid')[0];

        if (this.state.fullScreenIndex === index) {
            if (gridParent) {
                let width = Math.ceil((gridParent.clientWidth) / 2);
                let height = Math.ceil((gridParent.clientHeight) / 2);

                // 사이즈 조절하기 위한 url 재작성
                let id = "cctv" + index.toString();
                const frame = this.getChildElement(rootElement, id);
                //let id = "#cctv" + index.toString();
                //const frame = document.querySelector(id);

                if (frame !== null && frame !== undefined) {

                    if (ProjectResource.SiteID === ProjectResource.Site.Soulbrain) {
                        let url = frame.parentNode.dataset.url?.length > 0 ? frame.parentNode.dataset.url : null;
                        if (url !== null && url.indexOf("/stream/player/") !== -1) {
                            url += "w=" + width + "px&h=" + height + "px";
                        }

                        frame.setAttribute("src", url);
                    }
                    else {
                        //let url = frame.parentNode.dataset.url + "?w=" + width + "px&h=" + height + "px";     // 기존 방식(RTSPtoWebRTC)
                        let url = frame.parentNode.dataset.url;                                                 // MSE 미디어 서버 방식
                        frame.setAttribute("src", url);
                    }                    
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
                let height = gridParent.clientHeight + 10;

                // 사이즈 조절하기 위한 url 재작성
                let id = "cctv" + index.toString();
                const frame = this.getChildElement(rootElement, id);
                //let id = "#cctv" + index.toString();
                //const frame = document.querySelector(id);

                if (frame !== null && frame !== undefined) {

                    if (ProjectResource.SiteID === ProjectResource.Site.Soulbrain) {
                        let url = frame.parentNode.dataset.url?.length > 0 ? frame.parentNode.dataset.url : null;
                        if (url !== null && url.indexOf("/stream/player/") !== -1) {
                            url += "w=" + width + "px&h=" + height + "px";
                        }

                        frame.setAttribute("src", url);
                    }
                    else {
                        //let url = frame.parentNode.dataset.url + "?w=" + width + "px&h=" + height + "px";     // 기존 방식(RTSPtoWebRTC)
                        let url = frame.parentNode.dataset.url;                                                 // MSE 미디어 서버 방식
                        frame.setAttribute("src", url);
                    }                    
                }

                this.setFrameSize(width, height);
                this.setState({ fullScreenIndex: index, cctvWidth: width, cctvHeight: height });
            }
            else {
                this.setState({ fullScreenIndex: index });
            }
        }
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

    onClickCCTV(index) {
        if (this.props.editMode === Contents3D.Edit_Mode_CCTVGroup) {
            if (this.props.editModeParam === CCTVInfo_gg.Mode_Delete_CCTV) {
                this.removeCCTV(index);
            }

            console.log("onClickCCTV : " + index + ", " + this.state.cctvList);
        }
    }

    removeCCTV(index) {
        const cctvList = this.state.cctvList;

        if (!cctvList || cctvList.length === 0) {
            return;
        }

        const cctvIDs = cctvList.split(',');
        const cctvCount = cctvIDs.length;

        let newList = "";
        const newCCTVIDs = [null, null, null, null];
        let j = 0;

        for (let i = 0; i < cctvCount; i++) {
            if (i === index) {
                continue;
            }

            if (newList.length === 0) {
                newList = cctvIDs[i];
            }
            else {
                newList += "," + cctvIDs[i];
            }

            newCCTVIDs[j++] = cctvIDs[i];
        }

        this.props.setCCTVList(newList);

        const [equipZoneID, equipZoneName] = this.getCurrentEquipZoneInfo();

        if (equipZoneID !== null) {
            this.props.editModeManager.setEquipZoneCCTVGroup(equipZoneID, newCCTVIDs[0], newCCTVIDs[1], newCCTVIDs[2], newCCTVIDs[3]);
        }
    }

    //컴포넌트가 마운트 될 때, 이전에 cctv 전체화면을 띄운경우 그대로 띄워준다.
    setCctvFullScreenInit() {
        let cctvFullScreenState = this.props.cctvFullScreenState;

        if (cctvFullScreenState.isFullScreen) {
            let url = cctvFullScreenState.url;

            let width = cctvFullScreenState.w;
            let height = cctvFullScreenState.h;

            const cctvConts = this.findElementByClassName('viewDashboardCCTVConts');
            //let cctvConts = document.getElementsByClassName(content.viewDashboardCCTVConts)[0];
            let cctvName = cctvFullScreenState.cctvName;

            let isUnmatchedSize = false;
            
            //사이즈 드래그 하는 도중 팝업이 사라질때 cctv 전체화면이 팝업 사이즈와 맞지 않는 문제 해결
            if (width != cctvConts.offsetWidth - 18) {
                width = cctvConts.offsetWidth - 18;
                isUnmatchedSize = true;
            }
            if (height != cctvConts.offsetHeight - 8) {
                height = cctvConts.offsetHeight - 8;
                isUnmatchedSize = true;
            }

            //사이즈가 맞지 않을 때 props도 갱신한다.
            if (isUnmatchedSize) {
                this.props.setCctvFullScreenState({
                    isFullScreen: true,
                    cctvName: cctvName,
                    url: url,
                    w: width,
                    h: height
                });
            }

            //전체화면 프레임 div
            let div = document.createElement('div');
            div.style.width = width + "px";
            div.style.height = height + "px";
            //div.classList.add(content.fullScreenCCTV);

            let title = document.createElement('span');
            title.innerText = cctvName;

            //닫기 이벤트용 div
            let eventTag = document.createElement('div');
            eventTag.style.width = width + 'px';
            eventTag.style.height = height + 'px';

            //전체화면 닫기 이벤트
            eventTag.addEventListener('dblclick', function (e) {
                console.log('closeFullSize');
                const viewDashboardCCTVview = this.findElementByClassName('viewDashboardCCTVview');
                //let viewDashboardCCTVview = document.getElementsByClassName('viewDashboardCCTVview')[0];
                viewDashboardCCTVview.style.visibility = 'visible';
                div.remove();
            });

            div.appendChild(eventTag);
            div.appendChild(title);

            let frame = document.createElement('img');
            frame.src = url + "w=" + width + "&h=" + height;
            div.appendChild(frame);

            cctvConts.prepend(div);

            const viewDashboardCCTVview = this.findElementByClassName('viewDashboardCCTVview');
            //let viewDashboardCCTVview = document.getElementsByClassName('viewDashboardCCTVview')[0];
            // display none으로 하면 전체화면을 띄우기 위한 크기 정보를 얻을 수 없으므로 화면상에서만 태그를 감춘다.
            viewDashboardCCTVview.style.visibility = 'hidden';
        }
    }

    getCurrentEquipZoneInfo() {
        if (this.props.editMode === Contents3D.Edit_Mode_CCTVGroup) {
            const editModeManager = this.props.editModeManager;

            if (editModeManager && editModeManager.cctvGroupDatas && editModeManager.cctvGroupDatas.length === 3) {
                const equipZoneID = editModeManager.cctvGroupDatas[0];
                const equipZoneName = editModeManager.cctvGroupDatas[1];

                if ((equipZoneID === 0 || equipZoneID) && equipZoneName && equipZoneName.length > 0) {
                    return [equipZoneID, equipZoneName];
                }
            }
        }

        return [null, null];
    }

    getTitle() {
        let title = "CCTV " + i18n.t('sdms.cctvInfo.영상정보');
        const [equipZoneID, equipZoneName] = this.getCurrentEquipZoneInfo();

        if (equipZoneName !== null) {
            title += " - " + equipZoneName;
        }
        else {
            if (this.props.alarmInfo) {
                if (this.props.alarmInfo.length >= 2) {
                    const alarmType = this.props.alarmInfo[0];
                    const selectedAlarm = this.props.alarmInfo[1];

                    title = "[" + alarmType + "] " + selectedAlarm.positionName + " - [" + selectedAlarm.dtTime.substr(5).replace('T', ' ') + "]";
                    //title += " - [" + alarmType + "] " + selectedAlarm.positionName;
                }
            }
        }

        return title;
    }

    getFullScreenClassName(index) {
        if (index === this.state.fullScreenIndex) {
            return " " + 'full';
        }

        if (this.state.fullScreenIndex > 0) {
            return " " + 'hidden';
        }

        return "";
    }

    displayAlarmNumUI = () => {
        let menu = this.props.menu;
        let num = null;
        let displayAlarmNumUI = [];

        if (menu.indexOf(SdmsResource.menu.알람_CCTV + "_") !== -1) {
            num = menu.replace(SdmsResource.menu.알람_CCTV + "_", "");
        }

        if (num !== null) {
            displayAlarmNumUI.push(
                <span key={"cctvInfo_" + num} className={'cctvAct'}>{num}</span>
            );
        }

        return displayAlarmNumUI;
    }

    displayAlarmClass() {
        const alarm = this.props.alarmInfo;
        let displayAlarmClass = "cctvAlarmPopup";

        if (alarm !== null && alarm !== undefined) {
            displayAlarmClass = displayAlarmClass + " cctvAlarm_" + alarm[1].equipZoneID;
        }


        return displayAlarmClass;
    }

    setVisibleCCTVPopup = () => {
        // 모드에 따른 닫기 기능
        if (this.props.editMode === Contents3D.Edit_Mode_None) {
            this.props.setVisiblePopups(this.props.menu, false);
        } else {
            this.props.setEditModeCCTV(!this.props.editModeCCTV);
        }
    }

    onClickCCTVSetBox = () => {
        this.setState({ popupOpen: true });
    }

    handleTooltip = (e) => {
		const domRect = e.target.getBoundingClientRect();

		this.setState({
            tooltip: {
                tooltipShow: !this.state.tooltipShow,
                tooltipTop: domRect.top - 24,
                tooltipLeft: domRect.left - 30,
            }
        });
	}
    
    onClickClosePopup = (value) => {
        this.setState({ popupOpen: value });
    }

    render() {
        const title = this.getTitle();

        // 이벤트 숫자
        const displayAlarmNumUI = this.displayAlarmNumUI();
        const displayAlarmClass = this.displayAlarmClass();

        return (
            <>
            <CCTVInfoComponent id={this.props.popupType} className='viewDashboardCCTV' ref={this.refCCTVDiv}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={this.state.popupMinWidth}
                    popupMinHeight={this.state.popupMinHeight}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                    popupResizeMouseMove={this.popupResizeMouseMove}
                    popupResizeMousePress={this.popupResizeMousePress}
                    popupResizeMouseUp={this.popupResizeMouseUp}
                    usePopupResize={false}
                >
                    {/*<div className={content.resetBtn} onClick={this.onClickReset} ><a><img src={imgReset} alt="새로고침" /></a></div>*/}
                    <div className={'dslTop dslGrd' + " " + displayAlarmClass}>
                    {/*<div className={content.dslTop + " " + content.dslGrd}>*/}
                        { displayAlarmNumUI }  
                        <h5 className={'dslTitle'} >
                            {title}
                        </h5>
                        {/* <span className={'tooltipGG_cctv'}
                            onClick={this.onClickCCTVSetBox}
                            onMouseEnter={(e) => this.handleTooltip(e)}
                            onMouseLeave={() => this.setState({ tooltip: {tooltipShow: false} })}
                        /> */}
                        <a id="cctvInfoCloseBtn" className={'dslX'} onClick={() => this.setVisibleCCTVPopup()}></a>
                    </div>
                    <div className={'viewDashboardCCTVConts'}>
                        { /*
                            <ul className={content.viewTab}>
                                <li><a className={content.viewTabOn}>CCTV</a></li>
                                //<li><a>이동형 장비</a></li>
                            </ul>
                        */ }
                        <div>
                            <div className={'viewDashboardCCTVview'}>
                                <div className={'viewDashboardCCTVGrid'}>
                                    <div className={'col1row1' + this.getFullScreenClassName(1)}>
                                        <span id="cctv1_span" onDoubleClick={(e) => this.showFullScreenCCTV(1)} onClick={() => this.onClickCCTV(0)}>
                                            <p ref={this.refCCTV1Title} id="cctv1_name"></p>
                                            <img id="cctv1" allowtransparency="yes" scrolling="no"></img>
                                        </span>
                                    </div>
                                    <div className={'col2row1' + this.getFullScreenClassName(2)}>
                                        <span id="cctv2_span" onDoubleClick={(e) => this.showFullScreenCCTV(2)} onClick={() => this.onClickCCTV(1)}>
                                            <p ref={this.refCCTV2Title} id="cctv2_name"></p>
                                            <img id="cctv2" allowtransparency="yes" scrolling="no"></img>
                                        </span>
                                    </div>
                                    <div className={'col1row2' + this.getFullScreenClassName(3)}>
                                        <span id="cctv3_span" onDoubleClick={(e) => this.showFullScreenCCTV(3)} onClick={() => this.onClickCCTV(2)}>
                                            <p ref={this.refCCTV3Title} id="cctv3_name"></p>
                                            <img id="cctv3" allowtransparency="yes" scrolling="no"></img>
                                        </span>
                                    </div>
                                    <div className={'col2row2' + this.getFullScreenClassName(4)}>
                                        <span id="cctv4_span" onDoubleClick={(e) => this.showFullScreenCCTV(4)} onClick={() => this.onClickCCTV(3)}>
                                            <p ref={this.refCCTV4Title} id="cctv4_name"></p>
                                            <img id="cctv4" allowtransparency="yes" scrolling="no"></img>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        this.state.tooltip.tooltipShow &&
                        <p className='tooltipGG_cctv-content'>CCTV 설정</p>
                    }
                </PopupDraggable>
            </CCTVInfoComponent>
            {
                this.state.popupOpen &&
                <CCTVSetting_gg onClickClosePopup={this.onClickClosePopup}></CCTVSetting_gg>
            }
            </>
        );
    }
}

export default hoistStatics(withTranslation()(CCTVInfo_gg), CCTVInfo_gg);