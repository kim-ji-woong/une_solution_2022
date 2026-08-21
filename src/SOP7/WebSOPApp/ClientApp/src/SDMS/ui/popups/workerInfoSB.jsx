import React, { Component } from 'react';
import SettingsStore from '../../../Settings/settingsStore';
import { WorkerInfoSBComponent } from '../../styled/sdmsPopupsStyled';
import SDMS from '../sdms';
import SdmsResource from '../../resource/id';
import '../../../Common/css/content.module.css';
//import ProjectResource from '../../../../Root/resource/id';
import PopupDraggable from './popupDraggable';
import $ from 'jquery';
import { SDMSController } from '../../services/sdmsController';
import SDMSMainMenu from '../sdmsMainMenu';

class WorkerInfoSB extends Component {
    constructor(props) {
        super(props);

        this.state = {
            popupMinWidth: 530,
            popupMinHeight: 525,

            workList: [],
            searchText: "",
        }

        this.props = props;

        this.refSearchText = React.createRef();

        SettingsStore.subscribe(function () {
            let data = SettingsStore.getState();

            if (data?.actionType === 'RESET_POPUP') {
                this.repositionPopup(data.popupState);
            }
        }.bind(this));

        this.loadWorkList();
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
    }

    repositionPopup(popupState) {
        let data = popupState.workerInfoSB;

        if (data === null || data === undefined)
            return;

        let popup = document.getElementById(this.props.popupType);
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

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
        }
    }

    initPopupState() {
        var popup = document.getElementsByClassName('viewDashboardBoxD viewDashboardWorkerInfoSB')[0];

        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        }

        this.setState({ popup: popup });
    }

    loadWorkList = async () => {
        let workList = [];

        const [workListData, message] = await SDMSController.requestSoulbrainWorkList();
        if (workListData?.length > 0)
            workList = workListData;

        this.setState({ workList });
    }

    onClickWorkerInfoPop = (id) => {
        const lineID = "workerTableLine" + id;
        const contID = "workerTableConts" + id;

        const tableLine = document.getElementById(lineID);
        const tableConts = document.getElementById(contID);

        if (tableLine && tableConts) {
            tableLine.classList.toggle('on');
            tableConts.classList.toggle('on');
        }        
    }

    onClickMove = (buildingGroupName, zoneID, buildingID, floorIndex) => {
        if (zoneID > 0 && zoneID != 20000 && buildingID > 0 && floorIndex !== null && floorIndex !== undefined) {
            // 층 이동
            this.props.onSelectMenu(SDMSMainMenu.Menu_MoveTo_Floor, [buildingID, floorIndex], zoneID);
        }
        else if (buildingGroupName != null) {
            // 공장 그룹 이동
            this.props.onSelectMenu(SDMSMainMenu.Menu_MoveTo_BuildingGroup, buildingGroupName);
        }
        else if (zoneID === 20000) {
            // 외곽 이동
            this.props.onSelectMenu(SDMSMainMenu.Menu_MoveTo_BuildingGroup, null);
        }
    }

    displayListUI = (searchList) => {
        //const workList = this.state.workList;
        const tableUI = [];

        //for (let i = 0; i < workList.length; i++) {
        for (let i = 0; i < searchList.length; i++) {
            const work = searchList[i];

            tableUI.push(
                <div key={"workerTableList" + work.id}>
                    <div id={"workerTableLine" + work.id} className={'workerTableLine'} onClick={() => this.onClickMove(work.buildingGroupName, work.zoneID, work.buildingID, work.floorIndex)} onDoubleClick={() => this.onClickWorkerInfoPop(work.id)}>
                        <span>{work.placE_NAME}</span>
                        <span>{work.plaN_NAME}</span>
                        <span>{work.worK_GBN}</span>
                        <span>{work.worK_ENTRANT_NAME}</span>
                    </div>

                    <div id={"workerTableConts" + work.id} className={'workerTableConts'}>
                        <div className={'tableSubTitle'}>
                            <span>법인</span>
                            <span>작업기간</span>
                            <span>공사업체</span>
                        </div>
                        <div className={'tableSubConts'}>
                            <span>{work.companY_GBN}</span>
                            <span>{work.sdate} ~ { work.edate}</span>
                            <span>{work.subcontractoR_NAME}</span>
                        </div>
                        <div className={'tableSubTitleB'}>
                            <span>업체 책임자</span>
                            <span>작원인원</span>
                            <span>공사주관부서</span>
                            <span>공사발생부서</span>
                        </div>
                        <div className={'tableSubContsB'}>
                            <span>{work.fielD_MANAGER_NAME}</span>
                            <span>{work.fielD_PEOPLE_NUM}</span>
                            <span>{work.appR_DEPT1}</span>
                            <span>{work.appR_DEPT2}</span>
                        </div>
                    </div>
                </div>
            );
        }

        return tableUI;
    }

    onClickSearch = () => {
        let searchText = this.refSearchText.current.value;

        if (searchText?.length > 0) {
            this.setState({ searchText });
        }
        else {
            this.setState({ searchText: "" });
        }
    }

    handleKeyPress = (e) => {
        if (e.key === "Enter") {
            this.onClickSaerch();
        }
    }

    getSearchList = () => {
        const workList = this.state.workList;
        const searchText = this.state.searchText;
        const searchList = [];

        for (let i = 0; i < workList.length; i++) {
            const work = workList[i];

            if ((searchText === null || searchText === undefined || searchText.length === 0) ||
                ((work.placE_NAME !== null && work.placE_NAME !== undefined && work.placE_NAME?.indexOf(searchText) !== -1) ||
                (work.plaN_NAME !== null && work.plaN_NAME !== undefined && work.plaN_NAME?.indexOf(searchText) !== -1) ||
                (work.worK_GBN !== null && work.worK_GBN !== undefined && work.worK_GBN?.indexOf(searchText) !== -1) ||
                (work.worK_ENTRANT_NAME !== null && work.worK_ENTRANT_NAME !== undefined && work.worK_ENTRANT_NAME?.indexOf(searchText) !== -1))) {
                searchList.push(work);
            }
        }

        return searchList;
    }

    render() {
        const searchList = this.getSearchList();
        const tableUI = this.displayListUI(searchList);

        return(
            <WorkerInfoSBComponent id={this.props.popupType} className={'viewDashboardBoxD viewDashboardWorkerInfoSB'}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={390}
                    popupMinHeight={380}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >
                    <div className={'dslTop' + " " + 'dslGrd'}>
                        <h5 className={'dslTitle'}>
                            작업자 현황
                        </h5>
                        <a className={'dslX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.workerInfoSB, false)}></a>
                    </div>
                    <div className={'workerInfoSBContents'}>
                        <div className={'dsiSchW'}>
                            <input type="text" ref={this.refSearchText} id="txtSearch" onKeyPress={this.handleKeyPress} placeholder='검색어를 입력하세요' />
                            <a onClick={() => this.onClickSearch()}>검색</a>
                        </div> 

                        <div className={'workerAlarmText'}><span className={'workerIcon'}></span>{searchList?.length}건의 작업일지가 조회되었습니다.</div>
                        <div className={'workerTableBox'}>
                            <div className={'workerTableTitle'}>
                                <span>공사장소</span>
                                <span>작업명</span>
                                <span>작업종류</span>
                                <span>담당자</span>
                            </div>
                                {tableUI}
                        </div>
                    </div> 
                </PopupDraggable>
            </WorkerInfoSBComponent>
        );
    }
}
export default WorkerInfoSB;