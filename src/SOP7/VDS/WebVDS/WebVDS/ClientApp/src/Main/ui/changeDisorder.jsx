import React, { Component } from 'react';
import $ from 'jquery';

import main from '../../Main/css/main.module.css';
import dash from '../../Dashboard/css/dash.module.css';

//import SettingsStore from '../../Settings/settingsStore';
import PopupDraggable from './popupDraggable';
import MainController from '../services/mainController';
import ProjectResource from '../../Root/resource/id';

import Tooltip from './tooltip';



class ChangeDisorder extends Component {
    static ModeChange = "change";
    static ModeError = "error";

    static sortChangeMode = {
        noAsc: 1,
        noDesc: 2,
        no: 3,
        statusAsc: 4,
        statusDesc: 5,
        status: 6,
        titleAsc: 7,
        titleDesc: 8,
        title: 9,
        timeAsc: 10,
        timeDesc: 11,
        time: 12,
        propertyAsc: 13,
        propertyDesc: 14,
        property: 15,
        typeAsc: 16,
        typeDesc: 17,
        type: 18
    }

    static sortFaultMode = {
        noAsc: 1,
        noDesc: 2,
        no: 3,
        titleAsc: 4,
        titleDesc: 5,
        title: 6,
        reasonAsc: 7,
        reasonDesc: 8,
        reason: 9,
        levelAsc: 10,
        levelDesc: 11,
        level: 12,
        timeAsc: 13,
        timeDesc: 14,
        time: 15,
        typeAsc: 16,
        typeDesc: 17,
        type: 18
    }

    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            changeMode: true,
            searchText: null,
            changeDatas: [],
            faultDatas: [],
            sortChangeMode: ChangeDisorder.sortChangeMode.noAsc,
            sortFaultMode: ChangeDisorder.sortFaultMode.noAsc,
            selectedChange: null,
            selectedFault: null,
            titleTooltipShow: false,
            typeTooltipShow: false,
            nameTooltipShow: false,
            tooltipTop: 0,
            tooltipLeft: 0,
        }

        this.refLayer = React.createRef();
        this.refScrollArea = React.createRef();
        this.refScrollbar = React.createRef();
        this.refTree = React.createRef();
        this.refSearch = React.createRef();


        //this.changeIDs = [];
        //this.errorIDs = [];

        this.readDatas();
    }

    componentWillUnmount() {
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }

    async readDatas() {
        if (this.props.dataCenter) {
            const [result, errorMessage] = await MainController.requestWorkData(this.props.dataCenter.id);

            if (result) {
                const changeDatas = this.setWorkDatas(result.changeDatas);
                const faultDatas = this.setFaultDatas(result.faultDatas);

                this.setState({ changeDatas, faultDatas });
            }
            else {
                this.props.alertMessage(errorMessage, ProjectResource.ID.messageBox.title.error);
            }
        }
    }

    setFaultDatas(datas) {
        /*datas.sort((data1, data2) => {
            if (data1.basicData.eventTime < data2.basicData.eventTime) {
                return -1;
            }
            else if (data1.basicData.eventTime > data2.basicData.eventTime) {
                return 1;
            }

            return 0;
        });*/

        const faultDatas = [];

        for (const data of datas) {
            for (const target of data.targetDatas) {
                const faultData = [];

                faultData.push(data.basicData.title);
                faultData.push(data.basicData.reason);
                faultData.push(data.basicData.faultLevel);

                const time = this.getTime(data.basicData.eventTime) + " ~ " + this.getTime(data.basicData.finishTime);
                faultData.push(time);

                faultData.push(target.equipmentType)

                faultDatas.push(faultData);
            }
        }

        return faultDatas;
    }

    setWorkDatas(datas) {
        /*datas.sort((data1, data2) => {
            if (data1.basicData.planBeginTime < data2.basicData.planBeginTime) {
                return -1;
            }
            else if (data1.basicData.planBeginTime > data2.basicData.planBeginTime) {
                return 1;
            }

            return 0;
        });*/

        const workDatas = [];

        for (const data of datas) {
            for (const target of data.targetDatas) {
                const workData = [];

                workData.push(data.basicData.status);
                workData.push(data.basicData.title);
                workData.push(data.basicData.mainWorker);

                const time = this.getTime(data.basicData.planBeginTime) + " ~ " + this.getTime(data.basicData.planEndTime);
                workData.push(time);

                workData.push(target.propertyName);
                workData.push(target.equipmentType);
                workData.push(target.item);

                workDatas.push(workData);
            }
        }

        return workDatas;
    }

    getTime(dateTime) {
        dateTime = dateTime.replace('T', ' ');
        const index = dateTime.lastIndexOf(':');

        if (index > 0) {
            dateTime = dateTime.substring(0, index);
        }

        return dateTime;
    }

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
            //console.log('statusInfoZIndex changed', this.state.popup.style.zIndex)
        }

        //this.setScrollbar();
    }

    setVisiblePoi(typeName, visible) {
        this.props.setVisiblePoi(typeName, visible);
    }

    initPopupState() {
        var popup = document.getElementsByClassName(main.changePopup)[0];

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
        let data = popupState.statusInfo;

        if (data === null || data === undefined)
            return;

        //let popup = document.getElementsByClassName(content.viewDashboard + ' ' + content.viewDashboardBoxD)[0];
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

    searchEnterKey = () => {
        if (window.event && window.event.keyCode === 13) {
            this.search();
        }
    }

    onClose() {
        this.props.setVisiblePopups(this.props.popupType, false);
    }

    onClickSortChange(mode) {
        if (mode === ChangeDisorder.sortChangeMode.no) {
            if (this.state.sortChangeMode === ChangeDisorder.sortChangeMode.noAsc) {
                this.setState({ sortChangeMode: ChangeDisorder.sortChangeMode.noDesc });
            }
            else {
                this.setState({ sortChangeMode: ChangeDisorder.sortChangeMode.noAsc });
            }
        }
        else if (mode === ChangeDisorder.sortChangeMode.status) {
            if (this.state.sortChangeMode === ChangeDisorder.sortChangeMode.statusAsc) {
                this.setState({ sortChangeMode: ChangeDisorder.sortChangeMode.statusDesc });
            }
            else {
                this.setState({ sortChangeMode: ChangeDisorder.sortChangeMode.statusAsc });
            }
        }
        else if (mode === ChangeDisorder.sortChangeMode.time) {
            if (this.state.sortChangeMode === ChangeDisorder.sortChangeMode.timeAsc) {
                this.setState({ sortChangeMode: ChangeDisorder.sortChangeMode.timeDesc });
            }
            else {
                this.setState({ sortChangeMode: ChangeDisorder.sortChangeMode.timeAsc });
            }
        }
        else if (mode === ChangeDisorder.sortChangeMode.type) {
            if (this.state.sortChangeMode === ChangeDisorder.sortChangeMode.typeAsc) {
                this.setState({ sortChangeMode: ChangeDisorder.sortChangeMode.typeDesc });
            }
            else {
                this.setState({ sortChangeMode: ChangeDisorder.sortChangeMode.typeAsc });
            }
        }
    }

    onClickSortFault(mode) {
        if (mode === ChangeDisorder.sortFaultMode.no) {
            if (this.state.sortFaultMode === ChangeDisorder.sortFaultMode.noAsc) {
                this.setState({ sortFaultMode: ChangeDisorder.sortFaultMode.noDesc });
            }
            else {
                this.setState({ sortFaultMode: ChangeDisorder.sortFaultMode.noAsc });
            }
        }
        else if (mode === ChangeDisorder.sortFaultMode.time) {
            if (this.state.sortFaultMode === ChangeDisorder.sortFaultMode.timeAsc) {
                this.setState({ sortFaultMode: ChangeDisorder.sortFaultMode.timeDesc });
            }
            else {
                this.setState({ sortFaultMode: ChangeDisorder.sortFaultMode.timeAsc });
            }
        }
        else if (mode === ChangeDisorder.sortFaultMode.type) {
            if (this.state.sortFaultMode === ChangeDisorder.sortFaultMode.typeAsc) {
                this.setState({ sortFaultMode: ChangeDisorder.sortFaultMode.typeDesc });
            }
            else {
                this.setState({ sortFaultMode: ChangeDisorder.sortFaultMode.typeAsc });
            }
        }
    }

    sortChangeData(changeDatas) {
        if (this.state.sortChangeMode === ChangeDisorder.sortChangeMode.noAsc) {
            return changeDatas;
        }
        else if (this.state.sortChangeMode === ChangeDisorder.sortChangeMode.noDesc) {
            this.sortDatas(changeDatas, 0, false);
        }
        else if (this.state.sortChangeMode === ChangeDisorder.sortChangeMode.statusAsc) {
            this.sortDatas(changeDatas, 1, true);
        }
        else if (this.state.sortChangeMode === ChangeDisorder.sortChangeMode.statusDesc) {
            this.sortDatas(changeDatas, 1, false);
        }
        else if (this.state.sortChangeMode === ChangeDisorder.sortChangeMode.timeAsc) {
            this.sortDatas(changeDatas, 4, true);
        }
        else if (this.state.sortChangeMode === ChangeDisorder.sortChangeMode.timeDesc) {
            this.sortDatas(changeDatas, 4, false);
        }
        else if (this.state.sortChangeMode === ChangeDisorder.sortChangeMode.typeAsc) {
            this.sortDatas(changeDatas, 6, true);
        }
        else if (this.state.sortChangeMode === ChangeDisorder.sortChangeMode.typeDesc) {
            this.sortDatas(changeDatas, 6, false);
        }

        return changeDatas;
    }

    sortFaultData(faultDatas) {
        if (this.state.sortFaultMode === ChangeDisorder.sortFaultMode.noAsc) {
            return faultDatas;
        }
        else if (this.state.sortFaultMode === ChangeDisorder.sortFaultMode.noDesc) {
            this.sortDatas(faultDatas, 0, false);
        }
        else if (this.state.sortFaultMode === ChangeDisorder.sortFaultMode.timeAsc) {
            this.sortDatas(faultDatas, 4, true);
        }
        else if (this.state.sortFaultMode === ChangeDisorder.sortFaultMode.timeDesc) {
            this.sortDatas(faultDatas, 4, false);
        }
        else if (this.state.sortFaultMode === ChangeDisorder.sortFaultMode.typeAsc) {
            this.sortDatas(faultDatas, 5, true);
        }
        else if (this.state.sortFaultMode === ChangeDisorder.sortFaultMode.typeDesc) {
            this.sortDatas(faultDatas, 5, false);
        }
    }

    sortDatas(datas, index, asc) {
        if (asc) {
            datas.sort((data1, data2) => {
                if (data1[index] < data2[index]) {
                    return -1;
                }
                else if (data1[index] > data2[index]) {
                    return 1;
                }

                return 0;
            });
        }
        else {
            datas.sort((data1, data2) => {
                if (data1[index] < data2[index]) {
                    return 1;
                }
                else if (data1[index] > data2[index]) {
                    return -1;
                }

                return 0;
            });
        }
    }

    selectChange(rowData) {
        if (this.state.selectedChange) {
            if (this.state.selectedChange[0] !== rowData[0]) {
                this.selectItem(rowData[7]);
                this.setState({ selectedChange: rowData });
            }
        }
        else {
            this.selectItem(rowData[7]);
            this.setState({ selectedChange: rowData });
        }
    }

    selectItem(item) {
        if (!item) {
            this.props.alertMessage("연결된 IT자산이 존재하지 않습니다.");
        }
        else {
            if (this.props.wsManager) {
                this.props.wsManager.selectItem(item.id);
                this.props.wsManager.wsProcessManager.selectItem(item.id, this.props.wsManager);
            }
        }
    }

    selectFault(rowData) {
        if (this.state.selectedFault) {
            if (this.state.selectedFault[0] !== rowData[0]) {
                this.setState({ selectedFault: rowData });
            }
        }
        else {
            this.setState({ selectedFault: rowData });
        }
    }

    rowData1(rowData, rowDataConts, hidden) {
        if (rowData.length > 7) {
            rowDataConts = rowData;
            rowData = rowData.substring(0, 7) + "...";

            return (
                <td style={{ position: 'relative' }}>
                  <div className="tooltipData1">
                    <span className="tooltipData1Title">
                        {rowData}
                    </span>
                    <span className="tooltipData1Conts tooltip-left">
                        {rowDataConts}
                    </span>
                  </div>
                </td>
            );
        } else {
            return (
                <td>{rowData}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{rowData}</td>
            );
        }

        return (
            <td>{rowData}</td>
        );
    }

    rowData2(rowData, rowDataConts, hidden) {
        if (rowData.length > 16) {
            rowDataConts = rowData;
            rowData = rowData.substring(0, 16) + "...";

            return (
                <td style={{ position: 'relative' }}>
                <div className="tooltipData2">
                    <span className="tooltipData2Title">
                        {rowData}
                    </span>
                    <span className="tooltipData2Conts tooltip-left">
                        {rowDataConts}
                    </span>
                </div>
                </td>
            );
        } else {
            return (
                <td>{rowData}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{rowData}</td>
            );
        }

        return (
            <td>{rowData}</td>
        );
    }

    rowData3(rowData, rowDataConts, hidden) {
        if (rowData.length > 13) {
            rowDataConts = rowData;
            rowData = rowData.substring(0, 13) + "...";

            return (
                <td style={{ position: 'relative' }}>
                <div className="tooltipData3">
                    <span className="tooltipData3Title">
                        {rowData}
                    </span>
                    <span className="tooltipData3Conts tooltip-left">
                        {rowDataConts}
                    </span>
                </div>
                </td>
            );
        } else {
            return (
                <td>{rowData}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{rowData}</td>
            );
        }

        return (
            <td>{rowData}</td>
        );
    }

    rowData5(rowData, rowDataConts, hidden) {
        if (rowData.length > 13) {
            rowDataConts = rowData;
            rowData = rowData.substring(0, 13) + "...";

            return (
                <td style={{ position: 'relative' }}>
                <div className="tooltipData5">
                    <span className="tooltipData5Title"
                        onMouseEnter={(e) => this.handleTooltip('name', e)}
                        onMouseLeave={() => this.setState({ nameTooltipShow: false })}>
                            {rowData}
                    </span>
                    <Tooltip 
                        show={this.state.nameTooltipShow}
                        message={this.rowDataConts} 
                        top={this.state.tooltipTop}
                        left={this.state.tooltipLeft}
                        className={"tooltipData5Conts tooltip-left"}
                    >
                        {rowDataConts}
                    </Tooltip>
                </div>
                </td>
            );
        } else {
            return (
                <td>{rowData}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{rowData}</td>
            );
        }

        return (
            <td>{rowData}</td>
        );
    }

    rowData6(rowData, rowDataConts, hidden) {
        if (rowData.length > 7) {
            rowDataConts = rowData;
            rowData = rowData.substring(0, 7) + "...";

            return (
                <td style={{ position: 'relative' }}>
                  <div className="tooltipData6">
                    <span className="tooltipData6Title">
                        {rowData}
                    </span>
                    <span className="tooltipData6Conts tooltip-left">
                        {rowDataConts}
                    </span>
                  </div>
                </td>
            );
        } else {
            return (
                <td>{rowData}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{rowData}</td>
            );
        }

        return (
            <td>{rowData}</td>
        );
    }

    getChangeElements(changeDatas) {
        const elements = [];
        const searchText = this.state.searchText ? this.state.searchText.toLowerCase().trim() : null;

        elements.push(
            <thead>
                <tr>
                    <th style={{ width: '5%' }}>No<span className={main.changeArrowIcon} onClick={() => this.onClickSortChange(ChangeDisorder.sortChangeMode.no)}></span></th>
                    <th style={{ width: '12%' }}>진행상태<span className={main.changeArrowIcon} onClick={() => this.onClickSortChange(ChangeDisorder.sortChangeMode.status)}></span></th>
                    <th style={{ width: '23%' }}>제목</th>
                    <th style={{ width: '18%' }}>주작업자</th>
                    <th style={{ width: '15%' }}>계획시간<span className={main.changeArrowIcon} onClick={() => this.onClickSortChange(ChangeDisorder.sortChangeMode.time)}></span></th>
                    <th style={{ width: '15%' }}>대상자산명</th>
                    <th style={{ width: '12%' }}>자산구분<span className={main.changeArrowIcon} onClick={() => this.onClickSortChange(ChangeDisorder.sortChangeMode.type)}></span></th>
                </tr>
            </thead>
        );

        const bodyElements = [];
        //const changeIDs = [];
        let no = 1;

        const rowDatas = [];

        for (const changeData of changeDatas) {
            /*const id = this.getID(ChangeDisorder.ModeChange, changeData[0]);
            changeIDs.push(id);*/

            if (this.checkSearchChangeText(searchText, changeData)) {
                rowDatas.push([no++, changeData[0], changeData[1], changeData[2], changeData[3], changeData[4], ProjectResource.getEquipmentTypeName(changeData[5]), changeData[6]]);
            }
        }

        this.sortChangeData(rowDatas);

        for (const rowData of rowDatas) {
            const className = this.state.selectedChange && this.state.selectedChange[0] === rowData[0] ? main.tableActive : "";

            bodyElements.push(
                <tr className={className} onClick={() => this.selectChange(rowData)}>
                    <td>{rowData[0]}</td>
                    {
                        this.rowData1(rowData[1], true)
                    }
                    {
                        this.rowData2(rowData[2], true)
                    }
                    {
                        this.rowData3(rowData[3], true)
                    }
                    <td className={main.timeText}>{rowData[4]}</td>
                    {
                        this.rowData5(rowData[5], true)
                    }
                    {
                        this.rowData6(rowData[6], true)
                    }
                </tr>
            );
        }

        //this.changeIDs = changeIDs;

        elements.push(
            <tbody>
               {bodyElements}
            </tbody>
        );

        return elements;
    }

    handleTooltip = (param, e) => {
        const domRect = e.target.getBoundingClientRect();

        if(param === 'title') {
            this.setState({
                titleTooltipShow: !this.state.titleTooltipShow,
                tooltipTop: domRect.top - 18,
                tooltipLeft: domRect.left + 18,
            });
        } else if(param ==='type') {
            this.setState({
                typeTooltipShow: !this.state.typeTooltipShow,
                tooltipTop: domRect.top - 18,
                tooltipLeft: domRect.left + 18,
            });
        } else if(param ==='name') {
            this.setState({
                nameTooltipShow: !this.state.nameTooltipShow,
                tooltipTop: domRect.top - 18,
                tooltipLeft: domRect.left + 18,
            });
        }
    }

     disOrderRowData1(rowData, rowDataConts, hidden) {
        if (rowData.length > 38) {
            rowDataConts = rowData;
            rowData = rowData.substring(0, 38) + "...";

            return (
                <td style={{ position: 'relative' }}>
                    <div className="tooltipDisOrder1">
                        <span className="tooltipDisOrder1Title" 
                            onMouseEnter={(e) => this.handleTooltip('title', e)}
                            onMouseLeave={() => this.setState({ titleTooltipShow: false })}>
                                {rowData}
                        </span>
                        <Tooltip 
                            show={this.state.titleTooltipShow}
                            message={this.rowDataConts} 
                            top={this.state.tooltipTop}
                            left={this.state.tooltipLeft}
                            className={"tooltipDisOrder1Conts tooltip-left"}
                        >
                            {rowDataConts}
                        </Tooltip>
                    </div>
                </td>
            );
        } else {
            return (
                <td>{rowData}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{rowData}</td>
            );
        }

        return (
            <td>{rowData}</td>
        );
    }

    disOrderRowData2(rowData, rowDataConts, hidden) {
        if (rowData.length > 7) {
            rowDataConts = rowData;
            rowData = rowData.substring(0, 7) + "...";
            
            return (
                <td style={{ position: 'relative' }}>
                  <div className="tooltipDisOrder2">
                    <span className="tooltipDisOrder2Title" 
                        onMouseEnter={(e) => this.handleTooltip('type', e)}
                        onMouseLeave={() => this.setState({ typeTooltipShow: false })}>
                            {rowData}
                    </span>
                    <Tooltip 
                        show={this.state.typeTooltipShow}
                        message={this.rowDataConts} 
                        top={this.state.tooltipTop}
                        left={this.state.tooltipLeft}
                        className={"tooltipDisOrder2Conts tooltip-left"}
                    >
                        {rowDataConts}
                    </Tooltip>
                  </div>
                </td>
            );
        } else {
            return (
                <td>{rowData}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{rowData}</td>
            );
        }

        return (
            <td>{rowData}</td>
        );
    }


    disOrderRowData3(rowData, rowDataConts, hidden) {
        if (rowData.length > 8) {
            rowDataConts = rowData;
            rowData = rowData.substring(0, 8) + "...";

            return (
                <td style={{ position: 'relative' }}>
                  <div className="tooltipDisOrder3">
                    <span className="tooltipDisOrder3Title">
                        {rowData}
                    </span>
                    <span className="tooltipDisOrder3Conts tooltip-left">
                        {rowDataConts}
                    </span>
                  </div>
                </td>
            );
        } else {
            return (
                <td>{rowData}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{rowData}</td>
            );
        }

        return (
            <td>{rowData}</td>
        );
    }


    disOrderRowData5(rowData, rowDataConts, hidden) {
        if (rowData.length > 8) {
            rowDataConts = rowData;
            rowData = rowData.substring(0, 8) + "...";

            return (
                <td style={{ position: 'relative' }}>
                  <div className="tooltipDisOrder5">
                    <span className="tooltipDisOrder5Title">
                        {rowData}
                    </span>
                    <span className="tooltipDisOrder5Conts tooltip-left">
                        {rowDataConts}
                    </span>
                  </div>
                </td>
            );
        } else {
            return (
                <td>{rowData}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{rowData}</td>
            );
        }

        return (
            <td>{rowData}</td>
        );
    }



    getErrorElements(errorDatas) {
        const elements = [];
        const searchText = this.state.searchText ? this.state.searchText.toLowerCase().trim() : null;

        elements.push(
            <thead>
                <tr>
                    <th style={{ width: '5%' }}>No<span className={main.changeArrowIcon} onClick={() => this.onClickSortFault(ChangeDisorder.sortFaultMode.no)}></span></th>
                    <th style={{ width: '45%' }}>장애제목</th>
                    <th style={{ width: '12%' }}>장애원인유형</th>
                    <th style={{ width: '12%' }}>장애등급</th>
                    <th style={{ width: '14%' }}>장애발생일시<span className={main.changeArrowIcon} onClick={() => this.onClickSortFault(ChangeDisorder.sortFaultMode.time)}></span></th>
                    <th style={{ width: '12%' }}>자산구분<span className={main.changeArrowIcon} onClick={() => this.onClickSortFault(ChangeDisorder.sortFaultMode.type)}></span></th>
                </tr>
            </thead>
        );

        const bodyElements = [];
        //const errorIDs = [];
        let no = 1;
        const rowDatas = [];

        for (const errorData of errorDatas) {
            /*const id = this.getID("error", errorData[0]);
            errorIDs.push(id);*/

            if (this.checkSearchFaultText(searchText, errorData)) {
                rowDatas.push([no++, errorData[0], errorData[1], errorData[2], errorData[3], ProjectResource.getEquipmentTypeName(errorData[4])]);
            }
        }

        this.sortFaultData(rowDatas);

        for (const rowData of rowDatas) {
            const className = this.state.selectedFault && this.state.selectedFault[0] === rowData[0] ? main.tableActive : "";

            bodyElements.push(
                <tr className={className} onClick={() => this.selectFault(rowData)}>
                    <td>{rowData[0]}</td>
                    {
                        this.disOrderRowData1(rowData[1], true)
                    }
                    {
                        this.disOrderRowData2(rowData[2], true)
                    }
                    {
                        this.disOrderRowData3(rowData[3], true)
                    }
                    <td className={main.timeText}>{rowData[4]}</td>
                    {
                        this.disOrderRowData5(rowData[5], true)
                    }
                </tr>
            );
        }

        //this.errorIDs = errorIDs;

        elements.push(
            <tbody>
                {bodyElements}
            </tbody>
        );

        return elements;
    }

    checkSearchChangeText(text, datas) {
        if (!text || text.length === 0) {
            return true;
        }

        // datas[0]은 no
        for (let i = 0; i < 6; i++) {
            const data = i === 5 ? ProjectResource.getEquipmentTypeName(datas[i]).toLowerCase() : datas[i].toLowerCase();
            
            if (data.includes(text)) {
                return true;
            }
        }

        return false;
    }

    checkSearchFaultText(text, datas) {
        if (!text || text.length === 0) {
            return true;
        }

        // datas[0]은 no
        for (let i = 0; i < 5; i++) {
            if (!datas[i]) {
                continue;
            }

            const data = i === 4 ? ProjectResource.getEquipmentTypeName(datas[i]).toLowerCase() : datas[i].toLowerCase();

            if (data.includes(text)) {
                return true;
            }
        }

        return false;
    }

    onSort(tag, index) {
        const datas = tag === ChangeDisorder.ModeChange ? this.changeDatas : this.errorDatas;

        datas.sort((a, b) => {
            if (a[index] < b[index]) {
                return -1;
            }
            else if (a[index] > b[index]) {
                return 1;
            }

            return 0;
        });

        this.setState({});
    }

    /*onChangeCheck(e, tag) {
        const checked = e.target.checked;
        const ids = tag === ChangeDisorder.ModeChange ? this.changeIDs : this.errorIDs;

        for (const id of ids) {
            const element = document.getElementById(id);

            if (element) {
                element.checked = checked;
                this.onChangeCheck2(element);
            }
        }
    }

    onChangeCheck2(element) {
        const checked = element.checked;
        const trElement = element.parentElement.parentElement.parentElement;

        if (checked) {
            if ($(trElement).is('.' + main.squareActive) === false) {
                $(trElement).addClass(main.squareActive);
            }
        }
        else {
            if ($(trElement).is('.' + main.squareActive)) {
                $(trElement).removeClass(main.squareActive);
            }
        }
    }

    getID(elementType, id) {
        return elementType + "_" + id;
    }*/

    getRadioElement(mode, id) {
        const checked = mode === ChangeDisorder.ModeChange ? this.state.changeMode : !this.state.changeMode;

        if (checked) {
            return <input type="radio" checked name="tabmenu" id={id} onChange={(e) => this.onChangeRadio(e, mode)} />;
        }

        return <input type="radio" name="tabmenu" id={id} onChange={(e) => this.onChangeRadio(e, mode)} />;
    }

    onChangeRadio(e, mode) {
        const checked = e.target.checked;

        if (checked) {
            if (mode === ChangeDisorder.ModeChange) {
                this.setState({ changeMode: true });
            }
            else {
                this.setState({ changeMode: false });
            }
        }
    }

    onSearch(e) {
        if (e.keyCode === 13) {
            const text = this.refSearch.current.value;
            this.setState({ searchText: text });
        }
    }

    render() {
        return (
            <>
                <div id='tooltip-area'></div>
                <div id={this.props.popupType} className={main.changePopup + " " + main.changeBox}>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={766}
                        popupMinHeight={289}
                        topSize={35}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                    >
                    <div style={{ padding: '17px' }}>
                        <span className={main.changeTitle}><span className={main.changeIcon}></span><p>변경/장애관리</p><span className={main.closeBtn} onClick={() => this.onClose()}></span></span>

                        <span className={main.changeSearchBox}>
                            <span className={main.changeSearch}>
                                <input ref={this.refSearch} type="text" placeholder="검색어를 입력하세요." onKeyUp={(e) => this.onSearch(e)} />
                            </span>
                            {/* <span className={main.downLoadBtn}>
                                <span className={main.downIcon}></span>
                                <span className={main.downText}>다운로드</span>
                            </span> */}
                            <span className={main.searchBtn}>
                               <span className={main.searchText}>검색</span>
                            </span>
                        </span>

                        <div className={main.tabmenu}>
                            <ul>
                                <li id="tab1" className={main.btnCon}>
                                    {
                                        this.getRadioElement(ChangeDisorder.ModeChange, "tabmenu1")
                                    }
                                    <label htmlFor="tabmenu1" id={main.changeTabTitle}>변경관리</label>
                                    <div className={main.tabCon + " " + main.changeScrollArea}>
                                        <table className={main.changeTable}>
                                            {this.getChangeElements(this.state.changeDatas)}
                                        </table>
                                    </div>
                                </li>
                                <li id="tab2" className={main.btnCon}>
                                    {
                                        this.getRadioElement(ChangeDisorder.ModeError, "tabmenu2")
                                    }
                                    <label htmlFor="tabmenu2" id={main.disOrderTabTitle}>장애관리</label>
                                    <div className={main.tabCon + " " + main.changeScrollArea}>
                                        <table className={main.changeTable}>
                                            {this.getErrorElements(this.state.faultDatas)}
                                        </table>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div> 
                    </PopupDraggable>
                </div>
            </>
        );
    }
}

export default ChangeDisorder;