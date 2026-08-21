import { ui } from 'jquery';
import React, { Component } from 'react';
import content from '../../../Common/css/content.module.css';
import newStyles from '../../../Common/css/newStyle.module.css';
import imgClose from '../../../Common/image/icon/close_x.svg';
import SDMS from '../sdms';
import SettingsStore from '../../../Settings/settingsStore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import btnCalendar from '../../../Common/img/sub/dashboard_calendar.png';
import btnCalendarWonik from '../../../Common/img/sub/wonik_dashboard_calendar.png';
import $ from 'jquery';
import { ko } from 'date-fns/esm/locale';
import { SDMSController } from '../../services/sdmsController';
import SessionString from '../../../Common/js/sessionString';
import ProjectResource from '../../../Root/resource/id';
import SdmsResource from '../../resource/id';

import { ManualReportComponent } from '../../styled/sdmsPopupsStyled';
import SopManagerResource from '../../../SOPManager/resource/id';
import { i18n, withTranslation } from '../../../language/i18n';

class ManualReport extends Component {
	constructor(props) {
		super(props);

        this.state = {
            popupMinWidth: 450, // 팝업 최소 너비
            popupMinHeight: 452, // 팝업 최소  높이

            buildingGroupList: props.buildingGroupList,

            loginUser: null,

            selectedBuildingGroupID: -1,
            selectedBuildingID: -1,
            selectedZoneID: -1,
            selectedFacilityType: 0,      // 재난 유형
            selectedDateTime: new Date(), // 발생 시간
            selectedHour: null,
            selectedMin: null,
            selectedAlarmDepth: 2,        // 재난 단계
            selectedReportPerson: '',     // 신고자
            selectedMemo: ''           // 메모
        };

        this.props = props;

        this.refDatepicker01 = React.createRef();

        this.onReport = this.onReport.bind(this);
        this.initPopupState = this.initPopupState.bind(this);

        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));
    }

    componentDidMount() {
        // 창이 서서히 나타나는 효과
        //$('#' + this.props.popupType).animate({ opacity: 1 }, SdmsResource.PopupAniTime, () => {
        //    if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
        //        document.getElementById(this.props.popupType).style.opacity = 1;
        //    }
        //});
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

        let nickName = "-";

        let userInfo = ProjectResource.getUserInfo();
        if (userInfo !== null && userInfo !== undefined) {
            nickName = userInfo.nickName;
        }

        let selectedBuildingGroupID = -1;
        let selectedBuildingID = -1;
        let selectedZoneID = -1;

        if (this.state.buildingGroupList && this.state.buildingGroupList.length > 0) {            

            const buildingGroup = this.state.buildingGroupList[0];
            selectedBuildingGroupID = buildingGroup.id;
            if (buildingGroup.buildingDatas && buildingGroup.buildingDatas.length > 0) {
                const building = buildingGroup.buildingDatas[0]
                selectedBuildingID = building.id;
                if (building.zoneDatas && building.zoneDatas.length > 0) {
                    selectedZoneID = building.zoneDatas[0].id;
                }
            }            
        }

        const now = new Date();
        const selectedHour = now.getHours();
        const selectedMin = now.getMinutes();

        this.setState({
            selectedReportPerson: nickName,
            selectedBuildingGroupID,
            selectedBuildingID,
            selectedZoneID,
            selectedHour,
            selectedMin
        });

        this.props.setActiveDragPopup(this.props.popupType);
    }

    // 팝업 마우스 드래그 이벤트 리스너
    popupDragMouseMove = (event) => {
        var mousePosition = {
            x: event.clientX,
            y: event.clientY
        }

        //움직여야할 좌표
        let moveX = mousePosition.x + this.state.dragOffsetX;
        let perMoveX = ((moveX / this.state.maxScreenWidth) * 100);

        let moveY = mousePosition.y + this.state.dragOffsetY;
        let perMoveY = ((moveY / this.state.maxScreenHeight) * 100);

        // 팝업 너비
        let width = this.state.popup.clientWidth;
        let left = this.state.popup.offsetLeft;

        // 팝업 높이
        let height = this.state.popup.clientHeight;
        let top = this.state.popup.offsetTop;

        let popupRightPos = width + left;   // 현재 위치에서 오른쪽 끝 절대 좌표
        let popupBottomPos = height + top;  // 현재 위치에서 아래쪽 끝 절대 좌표

        // 팝업이 화면밖으로 안나가도록 처리
        if (moveX > 0 && moveX + width < this.state.maxScreenWidth) {
            this.state.popup.style.left = perMoveX + '%';
        } else if (moveX + width > this.state.maxScreenWidth) {
            // 드래그 도중 이동할 마우스 포지션 지점부터 팝업 끝지점이 우측 화면 밖을 벗어나게 될 때
            if (popupRightPos < this.state.maxScreenWidth) {
                // 팝업을 우측 변에 고정
                let lim = ((this.state.maxScreenWidth - width) / this.state.maxScreenWidth) * 100;
                this.state.popup.style.left = lim + '%';
            } else if (this.state.preMousePosition.x > mousePosition.x) {
                // 화면 오른쪽으로 팝업이 이미 벗어나 있을 때
                this.state.popup.style.left = perMoveX + '%';
            }
        } else if (moveX <= 0) {
            // 드래그 도중 팝업 시작점이 좌측 화면 밖을 벗어나게 될 때
            if (left > 0) {
                this.state.popup.style.left = '0%';
            } else if (this.state.preMousePosition.x < mousePosition.x) {
                // 화면 왼쪽으로 팝업이 이미 벗어나 있을 때
                this.state.popup.style.left = perMoveX + '%';
            }
        }

        if (moveY > 60 && moveY + height < this.state.maxScreenHeight) {
            this.state.popup.style.top = perMoveY + '%';
        } else if (moveY + height > this.state.maxScreenHeight) {
            // 드래그 도중 이동할 마우스 포지션 지점부터 팝업 하단 끝지점이 화면 밖을 벗어나게 될 때
            if (popupBottomPos < this.state.maxScreenHeight) {
                // 팝업을 아랫 변에 고정
                let lim = ((this.state.maxScreenHeight - height) / this.state.maxScreenHeight) * 100;
                this.state.popup.style.top = lim + '%';
            } else if (this.state.preMousePosition.y > mousePosition.y) {
                // 화면 아래쪽으로 팝업이 이미 벗어나 있을 때
                this.state.popup.style.top = perMoveY + '%';
            }
        } else if (moveY <= 60) {
            // 드래그 도중 상단 끝지점이 화면 밖을 벗어나게 될 때
            if (top > 60) {
                // 팝업을 윗 변에 고정
                //상단 툴바는 항상 높이 60 고정이기 때문에 현재 화면 사이즈에서 60px의 비율을 계산한다.
                let lim = (60 / this.state.maxScreenHeight) * 100;
                this.state.popup.style.top = lim + '%';
            } else if (this.state.preMousePosition.y < mousePosition.y) {
                //화면 위쪽으로 팝업이 이미 벗어나 있을 때
                this.state.popup.style.top = perMoveY + '%';
            }
        }
    }

    //팝업 리사이즈 이벤트 리스너
    popupResizeMouseMove = (event) => {
        let sizeX = 0;
        let sizeY = 0;

        switch (this.state.resizeType) {
            // 수평
            case 'h-r': // 오른쪽 수평
                sizeX = event.pageX - this.state.popup.getBoundingClientRect().left;

                if (event.pageX > 0 && event.pageX < this.state.maxScreenWidth && sizeX > this.state.popupMinWidth) {
                    this.state.popup.style.width = sizeX + 'px';
                }
                break;
            case 'h-l': //왼쪽 수평
                sizeX = this.state.originalWidth - (event.pageX - this.state.originalMouseX);

                if (event.pageX > 0 && event.pageX < this.state.maxScreenWidth && sizeX > this.state.popupMinWidth) {
                    this.state.popup.style.width = sizeX + 'px';

                    let pxLeft = (this.state.originalX + (event.pageX - this.state.originalMouseX));
                    this.state.popup.style.left = ((pxLeft / this.state.maxScreenWidth) * 100) + '%';
                }
                break;
            // 수직
            case 'v-b': // 바텀 수직
                sizeY = event.pageY - this.state.popup.getBoundingClientRect().top;

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    this.state.popup.style.height = sizeY + 'px';
                }
                break;
            case 'v-t': //탑 수직
                sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    this.state.popup.style.height = sizeY + 'px'

                    let pxTop = this.state.originalY + (event.pageY - this.state.originalMouseY);
                    this.state.popup.style.top = ((pxTop / this.state.maxScreenHeight) * 100) + '%';
                }
                break;
            // 대각
            case 'd-rb': // 오른쪽 하단 대각
                sizeX = event.pageX - this.state.popup.getBoundingClientRect().left;
                sizeY = event.pageY - this.state.popup.getBoundingClientRect().top;

                if (event.pageX > 0 && event.pageX < this.state.maxScreenWidth && sizeX > this.state.popupMinWidth) {
                    this.state.popup.style.width = sizeX + 'px';
                }

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    this.state.popup.style.height = sizeY + 'px';
                }
                break;
            case 'd-rt': //오른쪽 상단 대각
                sizeX = this.state.originalWidth + (event.pageX - this.state.originalMouseX);
                sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                if (event.pageX > 0 && event.pageX < this.state.maxScreenWidth && sizeX > this.state.popupMinWidth) {
                    this.state.popup.style.width = sizeX + 'px';
                }

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    this.state.popup.style.height = sizeY + 'px';

                    let pxTop = this.state.originalY + (event.pageY - this.state.originalMouseY);
                    this.state.popup.style.top = ((pxTop / this.state.maxScreenHeight) * 100) + '%';
                }
                break;

            case 'd-lb': //왼쪽 하단 대각
                sizeY = event.pageY - this.state.popup.getBoundingClientRect().top;
                sizeX = this.state.originalWidth - (event.pageX - this.state.originalMouseX);

                if (event.pageX > 0 && event.pageX < this.state.maxScreenWidth && sizeX > this.state.popupMinWidth) {
                    this.state.popup.style.width = sizeX + 'px';

                    let pxLeft = (this.state.originalX + (event.pageX - this.state.originalMouseX));
                    this.state.popup.style.left = ((pxLeft / this.state.maxScreenWidth) * 100) + '%';
                }

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    this.state.popup.style.height = sizeY + 'px';
                }
                break;

            case 'd-lt': //왼쪽 상단 대각
                sizeX = this.state.originalWidth - (event.pageX - this.state.originalMouseX);
                sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                if (event.pageX > 0 && event.pageX < this.state.maxScreenWidth && sizeX > this.state.popupMinWidth) {
                    this.state.popup.style.width = sizeX + 'px';

                    let pxLeft = (this.state.originalX + (event.pageX - this.state.originalMouseX));
                    this.state.popup.style.left = ((pxLeft / this.state.maxScreenWidth) * 100) + '%';
                }
                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    this.state.popup.style.height = sizeY + 'px';

                    let pxTop = this.state.originalY + (event.pageY - this.state.originalMouseY);
                    this.state.popup.style.top = ((pxTop / this.state.maxScreenHeight) * 100) + '%';
                }
                break;
            default:
        }

    }

    initPopupState() {
        var popup = document.getElementsByClassName('viewDashboardBoxD' + ' ' + 'viewDashboardManuel')[0];
        
        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        }

        this.setState({ popup: popup });
    }

    repositionPopup(popupState) {
        let data = popupState.manualReport;

        if (data === null || data === undefined)
            return;

        let popup = document.getElementsByClassName('viewDashboardBoxD' + ' ' + 'viewDashboardManuel')[0];
        if (popup === null || popup === undefined)
            return;

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
    }

    resetPopupState = (popupState) => {
        let data = popupState;

        if (data.actionType === 'RESET_POPUP') {
            this.repositionPopup(data.popupState);
        }
    }

    // 팝업 드래그 시작(팝업을 누르고 있을 때)
    popupDragMousePress(event) {
        if (event.button == 0) {
            //마우스 조작중에 브라우저의 크기를 조절할 수 없으므로
            // 이 시점에 도큐먼트 전체 크기를 호출한다.
            this.setState({
                maxScreenHeight: document.getElementsByTagName('body')[0].clientHeight,
                maxScreenWidth: document.getElementsByTagName('body')[0].clientWidth,
                dragOffsetX: this.state.popup.offsetLeft - event.clientX,
                dragOffsetY: this.state.popup.offsetTop - event.clientY,
                preMousePosition: {
                    x: event.clientX,
                    y: event.clientY
                }
            });

            document.addEventListener('mousemove', this.popupDragMouseMove);
            document.addEventListener('mouseup', this.popupDragMouseUp);

            // z-index 조정, 1 이 다른 팝업보다 앞에 배치됨
            this.props.setActiveDragPopup(this.props.popupType);
        }
    }
    // 팝업 드래그 종료(mouse up)
    popupDragMouseUp = () => {
        console.log('popup drag false')
        document.removeEventListener('mousemove', this.popupDragMouseMove);
        document.removeEventListener('mouseup', this.popupDragMouseUp);
        // 팝업 정보 DB 작성
        this.setPopupState();
    }

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            var popup = document.getElementsByClassName('viewDashboardBoxD' + ' ' + 'viewDashboardManuel')[0];
            popup.style.zIndex = this.props.zIndex
            console.log('buildingInfoZIndex changed', popup.style.zIndex)
        }
    }

    // 팝업 리사이징(누르고 있을 때)
    popupResizeMousePress(event, resizeType) {
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

        console.log('popupResizeMousePress');
        this.setState({
            maxScreenHeight: document.getElementsByTagName('body')[0].clientHeight,
            maxScreenWidth: document.getElementsByTagName('body')[0].clientWidth,
            resizeType: resizeType,
            originalMouseX: event.pageX,
            originalMouseY: event.pageY,
            originalWidth: parseFloat(getComputedStyle(this.state.popup, null).getPropertyValue('width').replace('px', '')),
            originalHeight: parseFloat(getComputedStyle(this.state.popup, null).getPropertyValue('height').replace('px', '')),
            originalX: this.state.popup.getBoundingClientRect().left,
            originalY: this.state.popup.getBoundingClientRect().top
        });

        // 수동신고 내부 객체 사이즈 조절이 안되어 외부 사이즈 조절 불필요 
        //document.addEventListener('mousemove', this.popupResizeMouseMove);
        //document.addEventListener('mouseup', this.popupResizeMouseUp);

        // z-index 조정, 1 이 다른 팝업보다 앞에 배치됨
        this.props.setActiveDragPopup(this.props.popupType);
    }

    popupResizeMouseUp = () => {
        console.log('popup resize false');
        document.removeEventListener('mousemove', this.popupResizeMouseMove);
        document.removeEventListener('mouseup', this.popupResizeMouseUp);
        this.setState({ resizeType: null });
        this.setPopupState();
    }

    setPopupState() {
        // 팝업 정보 DB 작성
        let perX = ((this.state.popup.offsetLeft / this.state.maxScreenWidth) * 100);
        let perY = ((this.state.popup.offsetTop) / this.state.maxScreenHeight * 100);
        let width = this.state.popup.offsetWidth;
        let height = this.state.popup.offsetHeight;

        //팝업 비활성화 될 때 컴포넌트가 사라져 계산식이 0으로 되는 현상이 발생함. 이때 DB 등록되는것을 방지
        if (perX > 0 && perY > 0 && width > 0 && height > 0) {
            let popupState = {
                id: typeof this.props.popupState !== 'undefined' ? this.props.popupState.id : -1,
                x: perX + '%',
                y: perY + '%',
                height: height + 'px',
                width: width + 'px'
            }
            this.props.setPopupState(this.props.popupType, popupState);
        }
    }

    onChangeDate = (date) => {
        this.setState({ selectedDateTime: date });
        $("input:radio[name='stgDate']").prop('checked', false);

        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        let korFormat = year + "-" + month + "-" + day;
    }

    async onReport() {
        const year = this.state.selectedDateTime.getFullYear();
        const month = this.state.selectedDateTime.getMonth() + 1;
        const day = this.state.selectedDateTime.getDate();

        const date = year + "-" + month + "-" + day + ' ' + this.state.selectedHour + ':' + this.state.selectedMin + ':00';

        const result = await SDMSController.requestManualReport(
            date,
            this.state.selectedFacilityType,
            this.state.selectedFacilityType + 1000000,
            this.state.selectedZoneID,
            this.state.selectedAlarmDepth,
            this.state.selectedReportPerson,
            this.state.selectedMemo
        );

        this.onClose();
    }

    onClose = () => {
        this.props.setVisiblePopups(SDMS.menu.manualReport, false);
    }

    onChangeBuildingGroup = (target) => {
        let selectedBuildingGroupID = Number(target.value);
        let selectedBuildingID = -1;
        let selectedZoneID = -1;

        const buildingGroupLength = this.state.buildingGroupList.length;
        for (let i = 0; i < buildingGroupLength; i++) {
            const buildingGroup = this.state.buildingGroupList[i];
            if (selectedBuildingGroupID === buildingGroup.id) {                
                const buildingLength = buildingGroup.buildingDatas.length;
                for (let j = 0; j < buildingLength; j++) {
                    const building = buildingGroup.buildingDatas[j];
                    selectedBuildingID = building.id;
                    const zoneLength = building.zoneDatas.length;
                    for (var k = 0; k < zoneLength; k++) {
                        const zone = building.zoneDatas[k];
                        selectedZoneID = zone.id;
                        break;
                    }
                    break;
                }
                break;
            }
        }

        this.setState({ selectedBuildingGroupID, selectedBuildingID, selectedZoneID });
    }
    onChangeBuilding = (target) => {
        let selectedBuildingGroupID = this.state.selectedBuildingGroupID;
        let selectedBuildingID = Number(target.value);
        let selectedZoneID = -1;

        const buildingGroupLength = this.state.buildingGroupList.length;
        for (let i = 0; i < buildingGroupLength; i++) {
            const buildingGroup = this.state.buildingGroupList[i];
            if (selectedBuildingGroupID === buildingGroup.id) {
                const buildingLength = buildingGroup.buildingDatas.length;
                for (let j = 0; j < buildingLength; j++) {
                    const building = buildingGroup.buildingDatas[j];
                    if (selectedBuildingID === building.id) {
                        selectedBuildingID = building.id;
                        const zoneLength = building.zoneDatas.length;
                        for (var k = 0; k < zoneLength; k++) {
                            const zone = building.zoneDatas[k];
                            selectedZoneID = zone.id;
                            break;
                        }
                        break;
                    }
                }
                break;
            }
        }

        this.setState({ selectedBuildingGroupID, selectedBuildingID, selectedZoneID });
    }
    onChangeZone = (target) => {
        this.setState({ selectedZoneID: Number(target.value) });
    }

    onChangeFacilityType = (value) => {
        this.setState({ selectedFacilityType: Number(value) });
    }

    onChangeAlarmDepth = (value) => {
        this.setState({ selectedAlarmDepth: Number(value) });
    }

    onChangeReportPerson = (value) => {
        this.setState({ selectedReportPerson: value });
    }

    onChangeMemo = (value) => {
        this.setState({ selectedMemo: value });
    }

    onChangeHour = (value) => {
        this.setState({ selectedHour: value });
    }

    onChangeMin = (value) => {
        this.setState({ selectedMin: value });
    }

    getSpatailUI() {
        let buildingGroupUI = [];
        let buildingUI = [];
        let zoneUI = [];

        if (!this.state.buildingGroupList) {
            return [buildingGroupUI, buildingUI, zoneUI];
        }

        const buildingGroupLength = this.state.buildingGroupList.length;
        for (let i = 0; i < buildingGroupLength; i++) {
            const buildingGroup = this.state.buildingGroupList[i];

            if (this.state.selectedBuildingGroupID === buildingGroup.id) {
                buildingGroupUI.push(<option key={'buildingGroup_' + buildingGroup.id} value={buildingGroup.id}>{buildingGroup.displayText}</option>);

                const buildingLength = buildingGroup.buildingDatas.length;
                for (let j = 0; j < buildingLength; j++) {
                    const building = buildingGroup.buildingDatas[j];
                    if (this.state.selectedBuildingID === building.id) {
                        buildingUI.push(<option key={'building_' + building.id} value={building.id}>{building.displayText}</option>);

                        const zoneLength = building.zoneDatas.length;
                        for (var k = 0; k < zoneLength; k++) {
                            const zone = building.zoneDatas[k];
                            if (this.state.selectedZoneID === zone.id) {
                                zoneUI.push(<option key={'zone_' + zone.id} value={zone.id}>{zone.displayText}</option>);
                            }
                            else {
                                zoneUI.push(<option key={'zone_' + zone.id} value={zone.id}>{zone.displayText}</option>);
                            }
                        }
                    }
                    else {
                        buildingUI.push(<option key={'building_' + building.id} value={building.id}>{building.displayText}</option>);
                    }
                }
            }
            else {
                buildingGroupUI.push(<option key={'buildingGroup_' + buildingGroup.id} value={buildingGroup.id}>{buildingGroup.displayText}</option>);
            }
        }

        return [buildingGroupUI, buildingUI, zoneUI];
    }

    setDateTime() {
        let hourTag = [];
        for (let i = 0; i <= 23; i++) {
            if (this.state.selectedHour === i) {
                hourTag.push(<option key={'hour_' + i} value={i} selected>{i}</option>);
            }
            else {
                hourTag.push(<option key={'hour_' + i} value={i}>{i}</option>);
            }
        }

        let minTag = [];
        for (let i = 0; i <= 59; i++) {
            if (this.state.selectedMin === i) {
                minTag.push(<option key={'min_' + i} value={i} selected>{i}</option>);
            }
            else {
                minTag.push(<option key={'min_' + i} value={i}>{i}</option>);
            }
        }

        return [hourTag, minTag];
    }

    onClickDatepicker01 = () => {
        this.refDatepicker01.current.setOpen(true);
    }
    
    render() {
        const [buildingGroupUI, buildingUI, zoneUI] = this.getSpatailUI();
        const [hourTag, minTag] = this.setDateTime();

        let facilityTypeUI = [];
        
        if (this.props.useSensorTypes.UseFire === true) {
            facilityTypeUI.push(<option key='facilityType_fire' value={SdmsResource.facilityType.FIRE}>{i18n.t('facilityType.화재')}</option>);
        }
        if (this.props.useSensorTypes.UsePSM === true) {
            facilityTypeUI.push(<option key='facilityType_psm' value={SdmsResource.facilityType.PSM_SENSOR}>{i18n.t('facilityType.누출')}</option>);
        }
        if (this.props.useSensorTypes.UseETC === true) {
            facilityTypeUI.push(<option key='facilityType_etc' value={SdmsResource.facilityType.ETC}>{i18n.t('facilityType.기타')}</option>);
        }
        if (this.props.useSensorTypes.UseEarthquake === true) {
            facilityTypeUI.push(<option key='facilityType_earthquake' value={SdmsResource.facilityType.Earthquake}>{i18n.t('facilityType.지진')}</option>);
        }
        if (this.props.useSensorTypes.UseStrongWind === true) {
            facilityTypeUI.push(<option key='facilityType_strongWind' value={SdmsResource.facilityType.STRONG_WIND}>{i18n.t('facilityType.강풍')}</option>);
        }
        if (this.props.useSensorTypes.UseBlackOut === true) {
            facilityTypeUI.push(<option key='facilityType_blackOut' value={SdmsResource.facilityType.BLACKOUT}>{i18n.t('facilityType.정전')}</option>);
        }

        const stepNames = SopManagerResource.actionStep;

		return (
            <ManualReportComponent id={this.props.popupType} className={'viewDashboardBoxD viewDashboardManuel'}>
                <div className={'manuelTop dslGrd'}>
                    <h5 className={'dslTitle'} onMouseDown={(e) => this.popupDragMousePress(e)}>
                        {i18n.t('sdms.manualReport.수동 신고')}
                    </h5>
                    <a className={'dslX'} onClick={this.onClose}></a>
                </div>

                <div className={'viewDashboardManuelConts'}>
                    <div className={'boxTypeBlue boxTypeBluee'}>
                    {/* <div className={content.boxTypeBluee}> */}
                            <table className={'tblNonee tblManuel'}>
                                <caption>게시판입니다.</caption>
                            <colgroup>
                                <col style={{ width : "30px" }} />
                                <col style={{ width : "*" }} />
                            </colgroup>
                                <tbody>
                                    <tr>
                                    <td>{i18n.t('sdms.manualReport.재난 발생 위치')}</td>
                                        <td>
                                            <ul className={'tel3col'}>
                                                <li>
                                                    <select className={'blueSel'} onChange={(e) => this.onChangeBuildingGroup(e.target)} value={this.state.selectedBuildingGroupID}>
                                                        {buildingGroupUI}
                                                    </select>
                                                </li>
                                                <li>
                                                <select className={'blueSel'} onChange={(e) => this.onChangeBuilding(e.target)} value={this.state.selectedBuildingID}>
                                                        {buildingUI}
                                                    </select>
                                                </li>
                                                <li>
                                                    <select className={'blueSel'} onChange={(e) => this.onChangeZone(e.target)} value={this.state.selectedZoneID}>
                                                        {zoneUI}
                                                    </select>
                                                </li>
                                            </ul>
                                        </td>
                                    </tr>
                                    <tr>
                                    <td>{i18n.t('sdms.manualReport.재난 유형')}</td>
                                    <td>
                                            <select className={'blueSel long'} value={this.state.selectedFacilityType} onChange={(e) => this.onChangeFacilityType(e.target.value)}>
                                                {facilityTypeUI}
                                            </select>
                                        </td>
                                    </tr>
                                <tr>
                                    <td>{i18n.t('sdms.manualReport.발생 시간')}</td>
                                        <td>
                                        <div className={'datepicker' + " " + 'calNormal'}>
                                            <DatePicker ref={this.refDatepicker01} name="datepicker01" id="datepicker01" className={'uiCal' + " " + 'w100p'}
                                                dateFormat="yyyy-MM-dd"
                                                locale={ko}
                                                maxDate={new Date()}
                                                selected={this.state.selectedDateTime}
                                                onChange={date => this.onChangeDate(date)} />
                                            <img src={ProjectResource.styleMode === ProjectResource.StyleType.Wonik ? btnCalendarWonik : btnCalendar} alt="" className={'btnCalendar'} onClick={this.onClickDatepicker01} />
                                            <ul className={'timeArea'}>
                                                <li className={'timeHour'}>
                                                    <select name="" id="" onChange={(e) => this.onChangeHour(e.target.value)}>
                                                        {hourTag}
                                                    </select>
                                                </li>
                                                <li className={'middlePoint'}>:</li>
                                                <li className={'timeMinute'}>
                                                    <select name="" id="" onChange={(e) => this.onChangeMin(e.target.value)}>
                                                        {minTag}
                                                    </select>
                                                </li>
                                            </ul>
                                        </div>
                                        </td>
                                    </tr>
                                    <tr>
                                    <td>{i18n.t('sdms.manualReport.재난 단계')}</td>
                                    <td>
                                        <select className={'blueSel long'} value={this.state.selectedAlarmDepth} onChange={(e) => this.onChangeAlarmDepth(e.target.value)}>
                                            {
                                                stepNames._1st.length > 0 && <option value={1}>{stepNames._1st}</option>
                                            }
                                            {
                                                stepNames._2nd.length > 0 && <option value={2}>{stepNames._2nd}</option>
                                            }
                                            {
                                                stepNames._3rd.length > 0 && <option value={3}>{stepNames._3rd}</option>
                                            }
                                            {
                                                stepNames._4th.length > 0 && <option value={4}>{stepNames._4th}</option>
                                            }
                                        </select>
                                    </td>
                                    </tr>
                                    <tr>
                                    <td>{i18n.t('sdms.manualReport.신고자')}</td>
                                    <td>
                                        <input type="text" className={'blueInput' + " " + 'w100p'} placeholder={this.state.selectedReportPerson}
                                            onChange={(e) => this.onChangeReportPerson(e.target.value)} value={this.state.selectedReportPerson} />
                                    </td>
                                    </tr>
                                    <tr>
                                    <td>{i18n.t('sdms.manualReport.메모')}</td>
                                    <td>
                                        <textarea cols="10" rows="5" className={'w100p' + " " + 'menualTextarea'} onChange={(e) => this.onChangeMemo(e.target.value)} value={this.state.selectedMemo}>
                                            
                                        </textarea></td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className={'gap10'}></div>

                            <div className={'btnArea alignC'}>
                            <a onClick={this.onReport} className={'btnOrange'}>{i18n.t('sdms.manualReport.수동 신고')}</a>
                            <a onClick={this.onClose} className={'btnNavyBorder'}>{i18n.t('common.취소')}</a>
                            </div>
                        </div>
				    </div>
                </ManualReportComponent>
	    );
	}
}

export default withTranslation()(ManualReport);