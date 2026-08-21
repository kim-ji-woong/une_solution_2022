import React, { Component } from 'react';

import main from '../../Main/css/main.module.css';
import dash from '../../Dashboard/css/dash.module.css';
import '../../Main/css/main.css';
import BoxTable from './table/boxTable';
import ServerTable from './table/serverTable';
import NetworkTable from './table/networkTable';
import SanSwitchTable from './table/sanSwitchTable';
import SecurityTable from './table/securityTable';
import BackUpTable from './table/backUpTable';
import StorageTable from './table/storageTable';
import EtcTable from './table/etcTable';

import MainController from '../services/mainController';
import ConfirmDialog from '../../Common/ui/confirmDialog';
import CommonResource from '../../Common/resource/id';

import ExcelDownload from '../services/excelDownload';

import $ from 'jquery';
import ProjectResource from '../../Root/resource/id';

import InputText from '../../Main/ui/table/inputText';
import SelectBox from '../../Main/ui/table/selectBox';
import DatePickerBox from '../../Main/ui/table/datePickerBox';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale';
import Edit from '../../PropertyEdit/ui/edit';


class InventoryManagement extends Component {
    static itemType = {
        Server: 1,
        Box: 2,
        Network: 3,
        SanSwitch: 4,
        Security: 5,
        BackUp: 6,
        Storage: 7,
        Etc: 8
    }

    static itemTypeString = {
        Server: "서버",
        Box: "Box",
        Network: "네트워크",
        SanSwitch: "SAN 스위치",
        Security: "보안",
        BackUp: "백업",
        Storage: "스토리지",
        Etc: "기타"
    }

    static columnType = {
        basic: "기본정보",
        maintenance: "유지보수정보",
        hardware: "하드웨어정보",
        network: "네트워크정보",
        management: "관리정보",
        redundancy: "이중화정보",
        software: "소프트웨어정보",
        backup: "백업정보",
        connect: "연결정보"
    }

    static getItemTypeName(type) {
        if (type === InventoryManagement.itemType.Server) {
            return "server";
        }
        else if (type === InventoryManagement.itemType.Box) {
            return "box";
        }
        else if (type === InventoryManagement.itemType.Network) {
            return "network";
        }
        else if (type === InventoryManagement.itemType.SanSwitch) {
            return "sanswitch";
        }
        else if (type === InventoryManagement.itemType.Security) {
            return "security";
        }
        else if (type === InventoryManagement.itemType.BackUp) {
            return "backup";
        }
        else if (type === InventoryManagement.itemType.Storage) {
            return "storage";
        }
        else if (type === InventoryManagement.itemType.Etc) {
            return "etc";
        }

        return "";
    }

    //static PaginationCount = 5;                             // 페이지 번호는 화면에서 몇개까지 표시되는가? (3, 5, 7, 9, 11 홀수 값만 수정 가능)

    constructor(props) {
        super(props);
        const initType = InventoryManagement.itemType.Network;

        this.state = {
            type: initType,
            visibleColumns: this.initVisibleColumns(),
            itemData: this.initItemData(),
            currentDatas: {
                type: null,
                data: []
            },
            addedDatas: [],
            emptyItemDatas: {},
            pageIndex: 1,                                   // 현재 페이지
            totalPage: null,
            searchText: null,
            //pageItemCount: 50,                              // 한 페이지에서 표시할 최대 갯수 >> 유동적으로 변할 수 있기에 state 선언

            editMode: false,
            isChanged: false,

            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null,
                icon: ConfirmDialog.icon.warning
            },
            loadingData: false,
        }

        this.props = props;
        this.checkList = [];        // 체크 목록

        //this.refCategoryOption = React.createRef();

        this.refBasic = React.createRef();
        this.refManagement = React.createRef();
        this.refHardware = React.createRef();
        this.refRedundancy = React.createRef();
        this.refSoftware = React.createRef();
        this.refNetwork = React.createRef();
        this.refBackup = React.createRef();
        this.refMaintenance = React.createRef();
        this.refConnect = React.createRef();
        this.refSearch = React.createRef();
        this.refUploadITPropertyDetail = React.createRef();

        this.loadItemData(initType);

        //this.maxPageNumber = 1;         // 페이징 마지막 페이지
        this.maxLine = 15;
        this.tabControlItem = null;
        this.originType = null;

        this.newRowAdded = false;
    }

    componentDidMount() {

    }

    componentDidUpdate() {
        if (this.originType !== null) {
            const originType = this.originType;
            this.originType = null;
            this.setState({ type: originType });
        }
    }

    componentWillUnmount() {
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }

    onCloseConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        this.setState({ confirmMessage });
    }

    onLoading = (loading) => {
        this.setState({ loadingData: loading });
    }

    showConfirmDialog = (title, messages, buttons, onClickButton, icon) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.title = title;
        confirmMessage.buttons = buttons;
        confirmMessage.onClickButton = onClickButton;
        confirmMessage.icon = icon;

        if (!messages) {
            confirmMessage.messages = [""];
        }
        else if (Array.isArray(messages)) {
            confirmMessage.messages = messages;
        }
        else {
            confirmMessage.messages = [messages];
        }

        this.setState({ confirmMessage });
    }

    alertMessage = (message, messageType = ProjectResource.ID.messageBox.title.warning, icon = ConfirmDialog.icon.warning) => {
        this.showConfirmDialog(messageType, [message], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog(), icon);
    }

    loadingEmptyItemDatas() {
        for (const key in this.state.emptyItemDatas) {
            return true;
        }

        return false;
    }

    setEmptyItemDatas(emptyItemDatas, dataCenterID, result) {
        if (result.itemServer) {
            result.itemServer.dataCenterID = dataCenterID;
            emptyItemDatas[InventoryManagement.itemType.Server] = result.itemServer;
        }

        if (result.box) {
            result.box.dataCenterID = dataCenterID;
            emptyItemDatas[InventoryManagement.itemType.Box] = result.box;
        }

        if (result.network) {
            result.network.dataCenterID = dataCenterID;
            emptyItemDatas[InventoryManagement.itemType.Network] = result.network;
        }

        if (result.sanSwitch) {
            result.sanSwitch.dataCenterID = dataCenterID;
            emptyItemDatas[InventoryManagement.itemType.SanSwitch] = result.sanSwitch;
        }

        if (result.security) {
            result.security.dataCenterID = dataCenterID;
            emptyItemDatas[InventoryManagement.itemType.Security] = result.security;
        }

        if (result.backup) {
            result.backup.dataCenterID = dataCenterID;
            emptyItemDatas[InventoryManagement.itemType.BackUp] = result.backup;
        }

        if (result.storage) {
            result.storage.dataCenterID = dataCenterID;
            emptyItemDatas[InventoryManagement.itemType.Storage] = result.storage;
        }

        if (result.etc) {
            result.etc.dataCenterID = dataCenterID;
            emptyItemDatas[InventoryManagement.itemType.Etc] = result.etc;
        }
    }

    async loadItemData(itemType) {
        const dataCenter = this.props.dataCenter;
        let emptyItemDatas = null;

        if (this.loadingEmptyItemDatas() === false) {
            const [result, errorMessage] = await MainController.requestEmptyItemDetails();

            if (!result) {
                this.alertMessage(errorMessage, ProjectResource.ID.messageBox.title.error);
                return;
            }
            else {
                emptyItemDatas = {};
                this.setEmptyItemDatas(emptyItemDatas, dataCenter?.id, result);                
            }
        }

        if (dataCenter) {
            // 해당 데이터 센터 정보 불러오기
            const [result, errorMessage] = await MainController.requestItemDetails(dataCenter.id, itemType);

            if (!result) {
                //alert(errorMessage);
                this.alertMessage(errorMessage, ProjectResource.ID.messageBox.title.error);
            } else {
                const itemData = this.initItemData();

                if (result.itemServers?.length > 0)
                    itemData[InventoryManagement.itemType.Server] = result.itemServers;
                else if (result.boxs?.length > 0)
                    itemData[InventoryManagement.itemType.Box] = result.boxs;
                else if (result.networks?.length > 0)
                    itemData[InventoryManagement.itemType.Network] = result.networks;
                else if (result.sanSwitchs?.length > 0)
                    itemData[InventoryManagement.itemType.SanSwitch] = result.sanSwitchs;
                else if (result.securitys?.length > 0)
                    itemData[InventoryManagement.itemType.Security] = result.securitys;
                else if (result.backups?.length > 0)
                    itemData[InventoryManagement.itemType.BackUp] = result.backups;
                else if (result.storages?.length > 0)
                    itemData[InventoryManagement.itemType.Storage] = result.storages;
                else if (result.etcs?.length > 0)
                    itemData[InventoryManagement.itemType.Etc] = result.etcs;

                this.search(itemData[itemType]);
                this.originType = this.state.type;
                const type = this.originType === InventoryManagement.itemType.Server ? InventoryManagement.itemType.Box : InventoryManagement.itemType.Server;

                if (emptyItemDatas) {
                    this.setState({ itemData, emptyItemDatas, addedDatas: [], type });
                }
                else {
                    this.setState({ itemData, addedDatas: [], type });
                }
                /*const [pageNo, totalPage] = this.getPageNo(itemData[this.state.type]);
                this.setState({ itemData, pageIndex: pageNo, totalPage });*/
            }

        }
    }

    reloadDatas(strMessage) {
        this.loadItemData(this.state.type);
        this.alertMessage(strMessage, ProjectResource.ID.messageBox.title.confirm, ConfirmDialog.icon.check);
    }

    getPageNo(items) {
        if (!items || items.length === 0) {
            return [1, null];
        }

        const itemCount = items.length;
        const totalPage = itemCount % this.maxLine === 0 ? itemCount / this.maxLine : parseInt(itemCount / this.maxLine) + 1;

        if (totalPage === 1) {
            return [1, null];
        }

        return [1, totalPage];
    }

    initItemData = () => {
        const itemData = {};

        itemData[InventoryManagement.itemType.Server] = [];
        itemData[InventoryManagement.itemType.Box] = [];
        itemData[InventoryManagement.itemType.Network] = [];
        itemData[InventoryManagement.itemType.SanSwitch] = [];
        itemData[InventoryManagement.itemType.Security] = [];
        itemData[InventoryManagement.itemType.BackUp] = [];
        itemData[InventoryManagement.itemType.Storage] = [];
        itemData[InventoryManagement.itemType.Etc] = [];

        return itemData;
    }

    initVisibleColumns = () => {
        const visibleColumns = {};

        visibleColumns[InventoryManagement.columnType.basic] = true;
        visibleColumns[InventoryManagement.columnType.maintenance] = true;
        visibleColumns[InventoryManagement.columnType.hardware] = true;
        visibleColumns[InventoryManagement.columnType.network] = true;
        visibleColumns[InventoryManagement.columnType.management] = true;
        visibleColumns[InventoryManagement.columnType.redundancy] = true;
        visibleColumns[InventoryManagement.columnType.software] = true;
        visibleColumns[InventoryManagement.columnType.backup] = true;
        visibleColumns[InventoryManagement.columnType.connect] = true;

        return visibleColumns;
    }

    onClose() {
        if (this.state.isChanged) {
            this.showConfirmDialog("확인", ["수정한 정보가 있습니다. 저장하시겠습니까?"], ["취소", "확인"], this.onClickDialogPopupClose, ConfirmDialog.icon.check);
        } else {
            this.props.setVisiblePopups(this.props.popupType, false);
        }
    }

    onClickDialogPopupClose = async (index) => {
        if (index === 1) {
            await this.onClickSave();
            this.props.setVisiblePopups(this.props.popupType, false);
        }
        else {
            this.onCloseConfirmDialog();
            this.props.setVisiblePopups(this.props.popupType, false);
        }
    }

    onChangeCheckList = (checkList) => {
        this.checkList = checkList;
    }

    insertCheckList = (checkList) => {
        let _checkList = this.checkList;

        if (checkList?.length > 0 && _checkList) {
            for (const check of checkList) {
                const idx = _checkList.indexOf(check);

                if (idx === -1)
                    _checkList.push(check);
            }
        }
    }

    deleteCheckList = (isALL, checkList) => {
        if (isALL === true) {
            this.checkList = [];
            return;
        }
            
        let _checkList = this.checkList;

        if (checkList?.length > 0 && _checkList?.length > 0) {
            for (const check of checkList) {
                const idx = _checkList.indexOf(check);

                if (idx !== -1)
                    _checkList.splice(idx, 1);
            }
        }
    }

    useModifiy = (data) => {
        this.setState({ isChanged: data });
    }

    hasNewRow = () => {
        const newRow = this.newRowAdded;
        this.newRowAdded = false;
        return newRow;
    }

    getGridUI = () => {
        let gridUI = null;
        const itemType = this.state.type;
        this.maxPageNumber = 1;

        if (itemType !== this.state.currentDatas.type) {
            return (
                <></>
                );
        }

        if (itemType === InventoryManagement.itemType.Server) {
            /*const displayData = this.state.itemData[InventoryManagement.itemType.Server];
            if (displayData?.length > 0) {
                this.maxPageNumber = Math.ceil(displayData.length / this.state.pageItemCount);
            }*/

            gridUI = <ServerTable itemData={this.state.currentDatas.data}
                insertCheckList={(checkList) => this.insertCheckList(checkList)} deleteCheckList={(isALL, checkList) => this.deleteCheckList(isALL, checkList)}
                isModifiy={(data) => this.useModifiy(data)} onClickCheck={(data) => this.onClickTableCheck(data)}
                pageIndex={this.state.pageIndex} pageItemCount={this.maxLine}
                setTabControlItem={this.setTabControlItem} editMode={this.state.editMode} addedDatas={this.state.addedDatas}
                hasNewRow={this.hasNewRow}
                />;
         } else if (itemType === InventoryManagement.itemType.Box) {
            /*const displayData = this.state.itemData[InventoryManagement.itemType.Box];
            if (displayData?.length > 0) {
                this.maxPageNumber = Math.ceil(displayData.length / this.state.pageItemCount);
            }*/

            gridUI = <BoxTable itemData={this.state.currentDatas.data}
                insertCheckList={(checkList) => this.insertCheckList(checkList)} deleteCheckList={(isALL, checkList) => this.deleteCheckList(isALL, checkList)}
                isModifiy={(data) => this.useModifiy(data)} onClickCheck={(data) => this.onClickTableCheck(data)}
                pageIndex={this.state.pageIndex} pageItemCount={this.maxLine}
                setTabControlItem={this.setTabControlItem} editMode={this.state.editMode} addedDatas={this.state.addedDatas}
                hasNewRow={this.hasNewRow}
            />;
        } else if (itemType === InventoryManagement.itemType.Network) {
            /*const displayData = this.state.itemData[InventoryManagement.itemType.Network];
            if (displayData?.length > 0) {
                this.maxPageNumber = Math.ceil(displayData.length / this.state.pageItemCount);
            }*/

            gridUI = <NetworkTable itemData={this.state.currentDatas.data}
                insertCheckList={(checkList) => this.insertCheckList(checkList)} deleteCheckList={(isALL, checkList) => this.deleteCheckList(isALL, checkList)}
                isModifiy={(data) => this.useModifiy(data)} onClickCheck={(data) => this.onClickTableCheck(data)}
                pageIndex={this.state.pageIndex} pageItemCount={this.maxLine}
                setTabControlItem={this.setTabControlItem} editMode={this.state.editMode} addedDatas={this.state.addedDatas}
                hasNewRow={this.hasNewRow}
            />;
        } else if (itemType === InventoryManagement.itemType.SanSwitch) {
            /*const displayData = this.state.itemData[InventoryManagement.itemType.SanSwitch];
            if (displayData?.length > 0) {
                this.maxPageNumber = Math.ceil(displayData.length / this.state.pageItemCount);
            }*/

            gridUI = <SanSwitchTable itemData={this.state.currentDatas.data}
                insertCheckList={(checkList) => this.insertCheckList(checkList)} deleteCheckList={(isALL, checkList) => this.deleteCheckList(isALL, checkList)}
                isModifiy={(data) => this.useModifiy(data)} onClickCheck={(data) => this.onClickTableCheck(data)}
                pageIndex={this.state.pageIndex} pageItemCount={this.maxLine}
                setTabControlItem={this.setTabControlItem} editMode={this.state.editMode} addedDatas={this.state.addedDatas}
                hasNewRow={this.hasNewRow}
            />;
        } else if (itemType === InventoryManagement.itemType.Security) {
            /*const displayData = this.state.itemData[InventoryManagement.itemType.Security];
            if (displayData?.length > 0) {
                this.maxPageNumber = Math.ceil(displayData.length / this.state.pageItemCount);
            }*/

            gridUI = <SecurityTable itemData={this.state.currentDatas.data}
                insertCheckList={(checkList) => this.insertCheckList(checkList)} deleteCheckList={(isALL, checkList) => this.deleteCheckList(isALL, checkList)}
                isModifiy={(data) => this.useModifiy(data)} onClickCheck={(data) => this.onClickTableCheck(data)}
                pageIndex={this.state.pageIndex} pageItemCount={this.maxLine}
                setTabControlItem={this.setTabControlItem} editMode={this.state.editMode} addedDatas={this.state.addedDatas}
                hasNewRow={this.hasNewRow}
            />;
        } else if (itemType === InventoryManagement.itemType.BackUp) {
            /*const displayData = this.state.itemData[InventoryManagement.itemType.BackUp];
            if (displayData?.length > 0) {
                this.maxPageNumber = Math.ceil(displayData.length / this.state.pageItemCount);
            }*/

            gridUI = <BackUpTable itemData={this.state.currentDatas.data}
                insertCheckList={(checkList) => this.insertCheckList(checkList)} deleteCheckList={(isALL, checkList) => this.deleteCheckList(isALL, checkList)}
                isModifiy={(data) => this.useModifiy(data)} onClickCheck={(data) => this.onClickTableCheck(data)}
                pageIndex={this.state.pageIndex} pageItemCount={this.maxLine}
                setTabControlItem={this.setTabControlItem} editMode={this.state.editMode} addedDatas={this.state.addedDatas}
                hasNewRow={this.hasNewRow}
            />;
        } else if (itemType === InventoryManagement.itemType.Storage) {
            /*const displayData = this.state.itemData[InventoryManagement.itemType.Storage];
            if (displayData?.length > 0) {
                this.maxPageNumber = Math.ceil(displayData.length / this.state.pageItemCount);
            }*/

            gridUI = <StorageTable itemData={this.state.currentDatas.data}
                insertCheckList={(checkList) => this.insertCheckList(checkList)} deleteCheckList={(isALL, checkList) => this.deleteCheckList(isALL, checkList)}
                isModifiy={(data) => this.useModifiy(data)} onClickCheck={(data) => this.onClickTableCheck(data)}
                pageIndex={this.state.pageIndex} pageItemCount={this.maxLine}
                setTabControlItem={this.setTabControlItem} editMode={this.state.editMode} addedDatas={this.state.addedDatas}
                hasNewRow={this.hasNewRow}
            />;
        } else if (itemType === InventoryManagement.itemType.Etc) {
            /*const displayData = this.state.itemData[InventoryManagement.itemType.Etc];
            if (displayData?.length > 0) {
                this.maxPageNumber = Math.ceil(displayData.length / this.state.pageItemCount);
            }*/

            gridUI = <EtcTable itemData={this.state.currentDatas.data}
                insertCheckList={(checkList) => this.insertCheckList(checkList)} deleteCheckList={(isALL, checkList) => this.deleteCheckList(isALL, checkList)}
                isModifiy={(data) => this.useModifiy(data)} onClickCheck={(data) => this.onClickTableCheck(data)}
                pageIndex={this.state.pageIndex} pageItemCount={this.maxLine}
                setTabControlItem={this.setTabControlItem} editMode={this.state.editMode} addedDatas={this.state.addedDatas}
                hasNewRow={this.hasNewRow}
            />;
        }

        return gridUI;
    }

    needAddRow(addedDatas) {
        if (this.state.type === InventoryManagement.itemType.Server) {
            for (const data of addedDatas) {
                if (data.basic_ServerName === null || data.basic_ServerName === undefined || data.basic_ServerName.trim().length === 0) {
                    return false;
                }
            }
        }
        else {
            for (const data of addedDatas) {
                if (data.basic_Name === null || data.basic_Name === undefined || data.basic_Name.trim().length === 0) {
                    return false;
                }
            }
        }

        return true;
    }

    onClickAddRow() {
        if (this.state.editMode) {
            const addedDatas = [...this.state.addedDatas];

            if (this.needAddRow(addedDatas)) {
                this.newRowAdded = true;
                const emptyDatas = this.state.emptyItemDatas[this.state.type];

                if (emptyDatas) {
                    addedDatas.unshift({ ...emptyDatas });
                    this.setState({ pageIndex: 1, addedDatas, isChanged: true });
                }
            }
        }
    }

    onSearch(e) {
        if (e.keyCode === 13) {
            this.onClickSearch();
        }
    }

    onClickSearch = () => {
        const itemDatas = this.state.itemData[this.state.type];
        this.search(itemDatas);
    }

    search(itemDatas) {
        const searchText = this.refSearch.current?.value ? this.refSearch.current.value.trim().toLowerCase() : null;

        if (itemDatas) {
            const currentDatas = [];
            const currentType = this.state.type;

            if (currentType === InventoryManagement.itemType.Box) {
                for (const itemData of itemDatas) {
                    if (BoxTable.checkSearchText(itemData, searchText)) {
                        currentDatas.push(itemData);
                    }
                }
            }
            else if (currentType === InventoryManagement.itemType.Server) {
                for (const itemData of itemDatas) {
                    if (ServerTable.checkSearchText(itemData, searchText)) {
                        currentDatas.push(itemData);
                    }
                }
            }
            else if (currentType === InventoryManagement.itemType.Network) {
                for (const itemData of itemDatas) {
                    if (NetworkTable.checkSearchText(itemData, searchText)) {
                        currentDatas.push(itemData);
                    }
                }
            }
            else if (currentType === InventoryManagement.itemType.SanSwitch) {
                for (const itemData of itemDatas) {
                    if (SanSwitchTable.checkSearchText(itemData, searchText)) {
                        currentDatas.push(itemData);
                    }
                }
            }
            else if (currentType === InventoryManagement.itemType.Security) {
                for (const itemData of itemDatas) {
                    if (SecurityTable.checkSearchText(itemData, searchText)) {
                        currentDatas.push(itemData);
                    }
                }
            }
            else if (currentType === InventoryManagement.itemType.BackUp) {
                for (const itemData of itemDatas) {
                    if (BackUpTable.checkSearchText(itemData, searchText)) {
                        currentDatas.push(itemData);
                    }
                }
            }
            else if (currentType === InventoryManagement.itemType.Storage) {
                for (const itemData of itemDatas) {
                    if (StorageTable.checkSearchText(itemData, searchText)) {
                        currentDatas.push(itemData);
                    }
                }
            }
            else if (currentType === InventoryManagement.itemType.Etc) {
                for (const itemData of itemDatas) {
                    if (EtcTable.checkSearchText(itemData, searchText)) {
                        currentDatas.push(itemData);
                    }
                }
            }

            const [pageNo, totalPage] = this.getPageNo(currentDatas);
            this.setState({ pageIndex: pageNo, totalPage, currentDatas: { type: currentType, data: currentDatas } });
        }
    }

    getTitle = () => {
        let title = "";

        if (this.props.dataCenter)
            title = this.props.dataCenter.name;

        return title;
    }

    onChangeCheck = (type, checked) => {
        let visibleColumns = this.state.visibleColumns;

        if (visibleColumns) {
            visibleColumns[type] = checked;

            this.setState({ visibleColumns});
        }

    }

    onClickCheck = (target) => {
        if (!target)
            return;

        if (target.id === "generalCheckbox") {
            $('.generalTable').animate({ width: 'toggle' }, 50);
            $('.' + main.gleftArrowIcon).toggleClass(main.grightArrowIcon);
            $('.' + main.inventInfoBox).scrollLeft(0);
        } else if (target.id === "maintenanceCheckbox") {
            $('.maintenanceTable').animate({ width: 'toggle' }, 50);
            $('.' + main.mleftArrowIcon).toggleClass(main.mrightArrowIcon);
            $('.' + main.inventInfoBox).scrollLeft(0);
        } else if (target.id === "hardwareCheckbox") {
            $('.hardwareTable').animate({ width: 'toggle' }, 50);
            $('.' + main.hleftArrowIcon).toggleClass(main.hrightArrowIcon);
            $('.' + main.inventInfoBox).scrollLeft(0);
        } else if (target.id === "networkCheckbox") {
            $('.networkTable').animate({ width: 'toggle' }, 50);
            $('.' + main.nleftArrowIcon).toggleClass(main.nrightArrowIcon);
            $('.' + main.inventInfoBox).scrollLeft(0);
        } else if (target.id === "addTableCheckbox") {
            $('.addTable').animate({ width: 'toggle' }, 50);
            $('.' + main.aleftArrowIcon).toggleClass(main.arightArrowIcon);
            $('.' + main.inventInfoBox).scrollLeft(0);
        } else if (target.id === "connectCheckbox") {
            $('.connectTable').animate({ width: 'toggle' }, 50);
            $('.' + main.cleftArrowIcon).toggleClass(main.crightArrowIcon);
            $('.' + main.inventInfoBox).scrollLeft(0);
        } else if (target.id === "managementCheckbox") {
            $('.managementTable').animate({ width: 'toggle' }, 50);
            $('.' + main.mMleftArrowIcon).toggleClass(main.mMrightArrowIcon);
            $('.' + main.inventInfoBox).scrollLeft(0);
        } else if (target.id === "redundancyCheckbox") {
            $('.redundancyTable').animate({ width: 'toggle' }, 50);
            $('.' + main.rleftArrowIcon).toggleClass(main.rrightArrowIcon);
            $('.' + main.inventInfoBox).scrollLeft(0);
        } else if (target.id === "softwareCheckbox") {
            $('.softwareTable').animate({ width: 'toggle' }, 50);
            $('.' + main.sleftArrowIcon).toggleClass(main.srightArrowIcon);
            $('.' + main.inventInfoBox).scrollLeft(0);
        } else if (target.id === "backupCheckbox") {
            $('.backupTable').animate({ width: 'toggle' }, 50);
            $('.' + main.bleftArrowIcon).toggleClass(main.brightArrowIcon);
            $('.' + main.inventInfoBox).scrollLeft(0);
        }
    }

    onClickTableCheck = (data) => {
        if (!data)
            return;

        let checkbox = document.getElementById(data);
        if (checkbox?.checked === true || checkbox?.checked === false) {
            checkbox.checked = !checkbox.checked;
        }

        if (data === "generalCheckbox") {
            $('.generalTable').animate({ width: 'toggle' }, 50);
            $('.' + main.gleftArrowIcon).toggleClass(main.grightArrowIcon);
            $('.' + main.inventInfoBox).scrollLeft(0);
        } else if (data === "maintenanceCheckbox") {
            $('.maintenanceTable').animate({ width: 'toggle' }, 50);
            $('.' + main.mleftArrowIcon).toggleClass(main.mrightArrowIcon);
            $('.' + main.inventInfoBox).scrollLeft(0);
        } else if (data === "hardwareCheckbox") {
            $('.hardwareTable').animate({ width: 'toggle' }, 50);
            $('.' + main.hleftArrowIcon).toggleClass(main.hrightArrowIcon);
            $('.' + main.inventInfoBox).scrollLeft(0);
        } else if (data === "networkCheckbox") {
            $('.networkTable').animate({ width: 'toggle' }, 50);
            $('.' + main.nleftArrowIcon).toggleClass(main.nrightArrowIcon);
            $('.' + main.inventInfoBox).scrollLeft(0);
        } else if (data === "addTableCheckbox") {
            $('.addTable').animate({ width: 'toggle' }, 50);
            $('.' + main.aleftArrowIcon).toggleClass(main.arightArrowIcon);
            $('.' + main.inventInfoBox).scrollLeft(0);
        } else if (data === "connectCheckbox") {
            $('.connectTable').animate({ width: 'toggle' }, 50);
            $('.' + main.cleftArrowIcon).toggleClass(main.crightArrowIcon);
            $('.' + main.inventInfoBox).scrollLeft(0);
        } else if (data === "managementCheckbox") {
            $('.managementTable').animate({ width: 'toggle' }, 50);
            $('.' + main.mMleftArrowIcon).toggleClass(main.mMrightArrowIcon);
            $('.' + main.inventInfoBox).scrollLeft(0);
        } else if (data === "redundancyCheckbox") {
            $('.redundancyTable').animate({ width: 'toggle' }, 50);
            $('.' + main.rleftArrowIcon).toggleClass(main.rrightArrowIcon);
            $('.' + main.inventInfoBox).scrollLeft(0);
        } else if (data === "softwareCheckbox") {
            $('.softwareTable').animate({ width: 'toggle' }, 50);
            $('.' + main.sleftArrowIcon).toggleClass(main.srightArrowIcon);
            $('.' + main.inventInfoBox).scrollLeft(0);
        } else if (data === "backupCheckbox") {
            $('.backupTable').animate({ width: 'toggle' }, 50);
            $('.' + main.bleftArrowIcon).toggleClass(main.brightArrowIcon);
            $('.' + main.inventInfoBox).scrollLeft(0);
        }
    }

    getCheckBoxAreaUI = () => {
        let checkBoxArea = null;
        let checkBoxAreaUI = null;

        const visibleColumns = this.state.visibleColumns;
        const itemType = this.state.type;

        if (itemType === InventoryManagement.itemType.Server) {
            //기본정보
            //관리정보
            //하드웨어정보
            //이중화정보
            //소프트웨어정보
            //네트워크정보
            //백업정보
            checkBoxArea = <React.Fragment>
                <div key="Server_basicBox" className={main.basicBox}>
                    <span><input type="checkbox" id="generalCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />기본정보</span>
                </div>
                <div key="Server_managementBox" className={main.managementBox}>
                    <span><input type="checkbox" id="managementCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />관리정보</span>
                </div>
                <div key="Server_hardwareBox" className={main.hardwareBox}>
                    <span><input type="checkbox" id="hardwareCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />하드웨어정보</span>
                </div>
                <div key="Server_redundancyBox" className={main.redundancyBox}>
                    <span><input type="checkbox" id="redundancyCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />이중화정보</span>
                </div>
                <div key="Server_softwareBox" className={main.softwareBox}>
                    <span><input type="checkbox" id="softwareCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />소프트웨어정보</span>
                </div>
                <div key="Server_networkBox" className={main.networkBox}>
                    <span><input type="checkbox" id="networkCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />네트워크정보</span>
                </div>
                <div key="Server_backupBox"  className={main.backupBox}>
                    <span><input type="checkbox" id="backupCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />백업정보</span>
                </div>
                </React.Fragment>;
        } else if (itemType === InventoryManagement.itemType.Box) {
            //기본정보
            //유지보수정보
            //하드웨어정보
            //네트워크정보
            checkBoxArea = <React.Fragment>
                <div key="Box_basicBox" className={main.basicBox}>
                    <span><input type="checkbox" id="generalCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />기본정보</span>
                </div>
                <div key="Box_maintenance" className={main.maintenance}>
                    <span><input type="checkbox" id="maintenanceCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />유지보수 정보</span>
                </div>
                <div key="Box_hardwareBox" className={main.hardwareBox}>
                    <span><input type="checkbox" id="hardwareCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />하드웨어정보</span>
                </div>
                <div key="Box_networkBox" className={main.networkBox}>
                    <span><input type="checkbox" id="networkCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />네트워크정보</span>
                </div>
                </React.Fragment>;
        } else if (itemType === InventoryManagement.itemType.Network) {
            //기본정보
            //유지보수정보
            //하드웨어정보
            //연결정보
            checkBoxArea = <React.Fragment>
                <div key="Network_basicBox" className={main.basicBox}>
                    <span><input type="checkbox" id="generalCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />기본정보</span>
                </div>
                <div key="Network_maintenance" className={main.maintenance}>
                    <span><input type="checkbox" id="maintenanceCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />유지보수 정보</span>
                </div>
                <div key="Network_hardwareBox" className={main.hardwareBox}>
                    <span><input type="checkbox" id="hardwareCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />하드웨어정보</span>
                </div>
                <div key="Network_connectBox" className={main.connectBox}>
                    <span><input type="checkbox" id="connectCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />연결정보</span>
                </div>
            </React.Fragment>;
        } else if (itemType === InventoryManagement.itemType.SanSwitch) {
            //기본정보
            //유지보수정보
            //하드웨어정보
            //연결정보
            checkBoxArea = <React.Fragment>
                <div key="SanSwitch_basicBox" className={main.basicBox}>
                    <span><input type="checkbox" id="generalCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />기본정보</span>
                </div>
                <div key="SanSwitch_maintenance" className={main.maintenance}>
                    <span><input type="checkbox" id="maintenanceCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />유지보수 정보</span>
                </div>
                <div key="SanSwitch_hardwareBox" className={main.hardwareBox}>
                    <span><input type="checkbox" id="hardwareCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />하드웨어정보</span>
                </div>
                <div key="SanSwitch_connectBox" className={main.connectBox}>
                    <span><input type="checkbox" id="connectCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />연결정보</span>
                </div>
            </React.Fragment>;
        } else if (itemType === InventoryManagement.itemType.Security) {
            //기본정보
            //유지보수정보
            //하드웨어정보
            //연결정보
            checkBoxArea = <React.Fragment>
                <div key="Security_basicBox" className={main.basicBox}>
                    <span><input type="checkbox" id="generalCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />기본정보</span>
                </div>
                <div key="Security_maintenance" className={main.maintenance}>
                    <span><input type="checkbox" id="maintenanceCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />유지보수 정보</span>
                </div>
                <div key="Security_hardwareBox" className={main.hardwareBox}>
                    <span><input type="checkbox" id="hardwareCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />하드웨어정보</span>
                </div>
                <div key="Security_connectBox" className={main.connectBox}>
                    <span><input type="checkbox" id="connectCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />연결정보</span>
                </div>
            </React.Fragment>;
        } else if (itemType === InventoryManagement.itemType.BackUp) {
            //기본정보
            //유지보수정보
            //하드웨어정보
            //연결정보
            checkBoxArea = <React.Fragment>
                <div key="BackUp_basicBox" className={main.basicBox}>
                    <span><input type="checkbox" id="generalCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />기본정보</span>
                </div>
                <div key="BackUp_maintenance" className={main.maintenance}>
                    <span><input type="checkbox" id="maintenanceCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />유지보수 정보</span>
                </div>
                <div key="BackUp_hardwareBox" className={main.hardwareBox}>
                    <span><input type="checkbox" id="hardwareCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />하드웨어정보</span>
                </div>
                <div key="BackUp_connectBox" className={main.connectBox}>
                    <span><input type="checkbox" id="connectCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />연결정보</span>
                </div>
            </React.Fragment>;
        } else if (itemType === InventoryManagement.itemType.Storage) {
            //기본정보
            //유지보수정보
            //하드웨어정보
            //연결정보
            checkBoxArea = <React.Fragment>
                <div key="Storage_basicBox" className={main.basicBox}>
                    <span><input type="checkbox" id="generalCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />기본정보</span>
                </div>
                <div key="Storage_maintenance" className={main.maintenance}>
                    <span><input type="checkbox" id="maintenanceCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />유지보수 정보</span>
                </div>
                <div key="Storage_hardwareBox" className={main.hardwareBox}>
                    <span><input type="checkbox" id="hardwareCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />하드웨어정보</span>
                </div>
                <div key="Storage_connectBox" className={main.connectBox}>
                    <span><input type="checkbox" id="connectCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />연결정보</span>
                </div>
            </React.Fragment>;
        } else if (itemType === InventoryManagement.itemType.Etc) {
            //기본정보
            //유지보수정보
            //하드웨어정보
            //연결정보
            checkBoxArea = <React.Fragment>
                <div key="Etc_basicBox" className={main.basicBox}>
                    <span><input type="checkbox" id="generalCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />기본정보</span>
                </div>
                <div key="Etc_maintenance" className={main.maintenance}>
                    <span><input type="checkbox" id="maintenanceCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />유지보수 정보</span>
                </div>
                <div key="Etc_hardwareBox" className={main.hardwareBox}>
                    <span><input type="checkbox" id="hardwareCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />하드웨어정보</span>
                </div>
                <div key="Etc_connectBox" className={main.connectBox}>
                    <span><input type="checkbox" id="connectCheckbox" onClick={(e) => this.onClickCheck(e.target)} defaultChecked />연결정보</span>
                </div>
            </React.Fragment>;
        }

        checkBoxAreaUI = <div className={main.checkBoxArea}>
            {checkBoxArea}
        </div>;

        return checkBoxAreaUI;
    }

    onClickEdit() {
        if (this.isEditable()) {
            this.setState({ editMode: !this.state.editMode });
        }
    }

    async onClickSave() {
        if (!this.state.editMode || !this.state.isChanged) {
            return;
        }

        const [currentItemDatas, errorMessage, itemType] = this.tabControlItem.getItemData();

        if (errorMessage) {
            this.alertMessage(errorMessage);
        }
        else {
            const itemData = { ...this.state.itemData };
            itemData[itemType] = currentItemDatas;
            const dataCenter = this.props.dataCenter;

            const [result, errorMessage] = await MainController.requestSaveItemDetails(dataCenter.id, itemData, itemType);

            if (result == null) {
                // 실패
                //window.alert(errorMessage);
                this.alertMessage(errorMessage, ProjectResource.ID.messageBox.title.error);
            } else {
                // 성공
                this.useModifiy(false);
                this.loadItemData(this.state.type);
                this.alertMessage("저장되었습니다.", ProjectResource.ID.messageBox.title.confirm, ConfirmDialog.icon.check);
            }
        }
    }

    onClickDelete = () => {
        const checkList = this.checkList;
        const itemType = this.state.type;
        const itemData = this.state.itemData;

        if (checkList?.length > 0) {
            let displayData = [];
            
            if (itemType === InventoryManagement.itemType.Server) {
                displayData = itemData[InventoryManagement.itemType.Server];
            } else if (itemType === InventoryManagement.itemType.Box) {
                displayData = itemData[InventoryManagement.itemType.Box];
            } else if (itemType === InventoryManagement.itemType.Network) {
                displayData = itemData[InventoryManagement.itemType.Network];
            } else if (itemType === InventoryManagement.itemType.SanSwitch) {
                displayData = itemData[InventoryManagement.itemType.SanSwitch];
            } else if (itemType === InventoryManagement.itemType.Security) {
                displayData = itemData[InventoryManagement.itemType.Security];
            } else if (itemType === InventoryManagement.itemType.BackUp) {
                displayData = itemData[InventoryManagement.itemType.BackUp];
            } else if (itemType === InventoryManagement.itemType.Storage) {
                displayData = itemData[InventoryManagement.itemType.Storage];
            } else if (itemType === InventoryManagement.itemType.Etc) {
                displayData = itemData[InventoryManagement.itemType.Etc];
            }

            if (displayData?.length > 0) {
                const displayCnt = displayData.length;

                for (const check of checkList) {
                    let idx = 0;

                    for (const data of displayData) {
                        if (itemType === InventoryManagement.itemType.Server) {
                            if (data.id === check) {
                                displayData.splice(idx, 1);
                                break;
                            }
                        } else if (itemType === InventoryManagement.itemType.Box) {
                            if (data.boxID === check) {
                                displayData.splice(idx, 1);
                                break;
                            }
                        } else if (itemType === InventoryManagement.itemType.Network) {
                            if (data.networkID === check) {
                                displayData.splice(idx, 1);
                                break;
                            }
                        } else if (itemType === InventoryManagement.itemType.SanSwitch) {
                            if (data.switchID === check) {
                                displayData.splice(idx, 1);
                                break;
                            }
                        } else if (itemType === InventoryManagement.itemType.Security) {
                            if (data.securityID === check) {
                                displayData.splice(idx, 1);
                                break;
                            }
                        } else if (itemType === InventoryManagement.itemType.BackUp) {
                            if (data.backupID === check) {
                                displayData.splice(idx, 1);
                                break;
                            }
                        } else if (itemType === InventoryManagement.itemType.Storage) {
                            if (data.storageID === check) {
                                displayData.splice(idx, 1);
                                break;
                            }
                        } else if (itemType === InventoryManagement.itemType.Etc) {
                            if (data.etcID === check) {
                                displayData.splice(idx, 1);
                                break;
                            }
                        }

                        idx++;
                    }
                }

                if (displayData.length !== displayCnt) {
                    // 전체 선택해제
                    var allCheck = document.getElementById("allCheck");
                    if (allCheck?.checked === true) {
                        allCheck.checked = false;
                    }

                    this.setState({ itemData });
                }
            }
        }
    }

    onClickDownload = () => {
        const checkList = this.checkList;
        const itemType = this.state.type;
        const itemData = this.state.itemData;

        let displayData = [];
        let fileData = [];
        const allDownload = true;

        if (itemType === InventoryManagement.itemType.Server) {
            displayData = itemData[InventoryManagement.itemType.Server];

            for (const data of displayData) {
                if (allDownload || checkList.indexOf(data.id) !== -1) {
                    fileData.push(data);
                }
            }

            ExcelDownload.downloadServerFile(fileData);
        } else if (itemType === InventoryManagement.itemType.Box) {
            displayData = itemData[InventoryManagement.itemType.Box];

            for (const data of displayData) {
                if (allDownload || checkList.indexOf(data.boxID) !== -1) {
                    fileData.push(data);
                }
            }

            ExcelDownload.downloadBoxFile(fileData);
        } else if (itemType === InventoryManagement.itemType.Network) {
            displayData = itemData[InventoryManagement.itemType.Network];

            for (const data of displayData) {
                if (allDownload || checkList.indexOf(data.networkID) !== -1) {
                    fileData.push(data);
                }
            }

            ExcelDownload.downloadNetworkFile(fileData);
        } else if (itemType === InventoryManagement.itemType.SanSwitch) {
            displayData = itemData[InventoryManagement.itemType.SanSwitch];

            for (const data of displayData) {
                if (allDownload || checkList.indexOf(data.switchID) !== -1) {
                    fileData.push(data);
                }
            }

            ExcelDownload.downloadSanSwitchFile(fileData);
        } else if (itemType === InventoryManagement.itemType.Security) {
            displayData = itemData[InventoryManagement.itemType.Security];

            for (const data of displayData) {
                if (allDownload || checkList.indexOf(data.securityID) !== -1) {
                    fileData.push(data);
                }
            }

            ExcelDownload.downloadSecurityFile(fileData);
        } else if (itemType === InventoryManagement.itemType.BackUp) {
            displayData = itemData[InventoryManagement.itemType.BackUp];

            for (const data of displayData) {
                if (allDownload || checkList.indexOf(data.backupID) !== -1) {
                    fileData.push(data);
                }
            }

            ExcelDownload.downloadBackupFile(fileData);
        } else if (itemType === InventoryManagement.itemType.Storage) {
            displayData = itemData[InventoryManagement.itemType.Storage];

            for (const data of displayData) {
                if (allDownload || checkList.indexOf(data.storageID) !== -1) {
                    fileData.push(data);
                }
            }

            ExcelDownload.downloadStorageFile(fileData);
        } else if (itemType === InventoryManagement.itemType.Etc) {
            displayData = itemData[InventoryManagement.itemType.Etc];

            for (const data of displayData) {
                if (allDownload || checkList.indexOf(data.etcID) !== -1) {
                    fileData.push(data);
                }
            }

            ExcelDownload.downloadEtcFile(fileData);
        }

    }

    movePage(dir) {
        /*if (this.refCheckAll.current) {
            this.refCheckAll.current.checked = false;
        }

        this.setAllCheck(false);*/

        if (dir < 0) {
            if (this.state.pageIndex > 1) {
                this.setState({ pageIndex: this.state.pageIndex - 1 });
            }
        }
        else {
            if (this.state.pageIndex < this.state.totalPage) {
                this.setState({ pageIndex: this.state.pageIndex + 1 });
            }
        }

        if (this.tabControlItem) {
            this.tabControlItem.clearAllCheck();
        }
    }

    getPageContents() {
        if (!this.state.totalPage) {
            return (
                <></>
                );
        }

        const leftClassName = this.state.pageIndex > 1 ? main.leftPageArrowIcon + " " + main.active : main.leftPageArrowIcon;
        const rightClassName = this.state.pageIndex < this.state.totalPage ? main.rightArrowIcon + " " + main.active : main.rightArrowIcon;

        return (
            <div className={main.pageArea}>
                <span className={leftClassName} onClick={() => this.movePage(-1)}></span>
                <span className={main.pageNumBox}>{this.state.pageIndex + "/" + this.state.totalPage}</span>
                <span className={rightClassName} onClick={() => this.movePage(1)}></span>
            </div>
        );
    }

    /*getPageContents = () => {
        const currentPageIndex = this.state.pageIndex;
        const paginationCount = InventoryManagement.PaginationCount;
        const halfPaginationCount = Math.floor(paginationCount / 2);


        if (this.maxPageNumber < 2) {
            return <></>;
        }

        let beginPageIndex = 1;

        if (currentPageIndex > halfPaginationCount) {
            beginPageIndex = currentPageIndex - halfPaginationCount;
        }

        let endPageIndex = beginPageIndex + paginationCount - 1;

        if (endPageIndex > this.maxPageNumber && this.maxPageNumber > paginationCount) {
            endPageIndex = this.maxPageNumber;
            beginPageIndex = endPageIndex - (paginationCount + 1);
        } else if(endPageIndex > this.maxPageNumber) {
            endPageIndex = this.maxPageNumber;
        }


        const pageItems = [];

        if (beginPageIndex > 1) {
            const pageIndex = beginPageIndex - (halfPaginationCount + 1);
            pageItems.push(<a className={main.leftIcon} onClick={() => this.onClickPage(pageIndex)}></a>);
        }

        for (let i = beginPageIndex; i <= endPageIndex; i++) {
            if (i === currentPageIndex) {
                pageItems.push(<a className={main.active} onClick={() => this.onClickPage(i)}>{i}</a>);
            } else {
                pageItems.push(<a onClick={() => this.onClickPage(i)}>{i}</a>);
            }
        } 

        if (endPageIndex < this.maxPageNumber) {
            const pageIndex = endPageIndex + 1;
            pageItems.push(<a className={main.rightIcon} onClick={() => this.onClickPage(pageIndex)}></a>);
        }

        const paginationUI = <div className={main.pagination}>
            {pageItems}
        </div>;

        return paginationUI;
    }

    onClickPage(pageIndex) {
        // 전체 선택해제
        var allCheck = document.getElementById("allCheck");
        if (allCheck?.checked === true) {
            allCheck.checked = false;
        }

        this.checkList = [];
        this.setState({ pageIndex });
    }*/

    onSelect(itemType) {
        if (itemType !== this.state.type) {
            if (this.state.isChanged) {
                this.showConfirmDialog("확인", ["수정한 정보가 있습니다. 저장하시겠습니까?"], ["취소", "확인"], (index) => this.onClickCheckSave(index, itemType), ConfirmDialog.icon.check);
                return;
            }

            this.setState({ type: itemType, isChanged: false, addedDatas: [] });
            this.loadItemData(itemType);
        }
    }

    async onClickCheckSave(index, itemType) {
        this.onCloseConfirmDialog();

        if (index === 1) {
            await this.onClickSave();
        }

        this.setState({ type: itemType, isChanged: false });
        this.loadItemData(itemType);
    }

    getItemInput(id, itemType) {
        if (this.state.type === itemType) {
            return (
                <input type="radio" name="tabs" id={id} checked />
                );
        }

        return (
            <input type="radio" name="tabs" id={id} />
            );
    }

    setTabControlItem = (item) => {
        this.tabControlItem = item;
    }

    onSelectUpload(index) {
        this.onCloseConfirmDialog();

        if (index === 1) {
            this.refUploadITPropertyDetail.current.click();
        }
    }

    onClickUploadITPropertyDetail() {
        if (this.isEditable()) {
            this.showConfirmDialog(ProjectResource.ID.messageBox.title.confirm, ["업로드한 파일로 데이터가 업데이트 되며, 기존 데이터는 모두 삭제됩니다.", "계속 진행할까요?"], ["취소", "확인"], (index) => this.onSelectUpload(index), ConfirmDialog.icon.check);
        }
    }

    async onSelectITPropertyDetailFile(e) {
        const file = e.target.files[0];
        this.refUploadITPropertyDetail.current.value = "";

        const type = /(.*?)\.(xls|xlsx)$/;

        if (!file.name.match(type)) {
            this.alertMessage("엑셀 파일(xls, xlsx)만 업로드 가능합니다.", ProjectResource.ID.messageBox.title.error);
            return;
        } else if (file.size > 10485760) {
            this.alertMessage("최대 10MB 엑셀 파일을 업로드 할 수 있습니다.", ProjectResource.ID.messageBox.title.error);
            return;
        }

        this.onLoading(true);

        const [result, errorMessage] = await MainController.requestUploadITPropertyDetail(file, this.props.dataCenter.id, InventoryManagement.getItemTypeName(this.state.type));

        if (!result) {
            if (errorMessage && errorMessage.length > 0) {
                this.alertMessage(errorMessage, ProjectResource.ID.messageBox.title.error);
            }
        }
        else {
            this.reloadDatas("IT자산 상세정보가 업데이트 되었습니다.");
        }

        this.onLoading(false);
    }

    isEditable() {
        const userInfo = ProjectResource.getUserInfo();
        return Edit.isEditableUser(userInfo);
    }

    render() {
        const checkBoxAreaUI = this.getCheckBoxAreaUI();
        const gridUI = this.getGridUI();
        const paginationUI = this.getPageContents();

        const isEditable = this.isEditable();
        
        const editClassName = this.state.editMode ? main.fixIconAct : (isEditable ? main.fixIconDis : main.fixIconDisable);
        const saveClassName = this.state.isChanged && this.state.editMode ? main.saveIconAct : main.saveIconDis;
        const plusClassName = this.state.editMode ? main.plusIcon : main.plusDisIcon;
        const uploadClassName = isEditable ? main.uploadIconAct : main.uploadIconDis;

        return (
            <>
                <div className={main.inventInfoBox + " " + CommonResource.UISection}>
                    <div className={CommonResource.UISection} style={{ display: 'flex' }}>
                      <span className={main.inventInfoIcon}></span>
                      <div className={main.inventInfoTitle2}>인벤토리 상세정보 관리</div>
                      <span className={main.inventInfoSide}>관리하고자 하는 IT장비의 카테고리를 선택하시기 바랍니다.</span>
                      <span className={main.inventCloseBtn} onClick={() => this.onClose()}></span>
                    </div>

                    <div className="inventTabArea">
                        {
                            this.getItemInput("tabNetwork", InventoryManagement.itemType.Network)
                        }
                        <label for="tabNetwork" onClick={() => this.onSelect(InventoryManagement.itemType.Network)}>네트워크</label>
                        {
                            this.getItemInput("tabSecurity", InventoryManagement.itemType.Security)
                        }
                        <label for="tabSecurity" onClick={() => this.onSelect(InventoryManagement.itemType.Security)}>보안</label>
                        {
                            this.getItemInput("tabBackUp", InventoryManagement.itemType.BackUp)
                        }
                        <label for="tabBackUp" onClick={() => this.onSelect(InventoryManagement.itemType.BackUp)}>백업</label>
                        {
                            this.getItemInput("tabServer", InventoryManagement.itemType.Server)
                        }
                        <label for="tabServer" onClick={() => this.onSelect(InventoryManagement.itemType.Server)}>서버</label>
                        {
                            this.getItemInput("tabAppli", InventoryManagement.itemType.Storage)
                        }
                        <label for="tabAppli" onClick={() => this.onSelect(InventoryManagement.itemType.Storage)}>스토리지</label>
                        {
                            this.getItemInput("tabBox", InventoryManagement.itemType.Box)
                        }
                        <label for="tabBox" onClick={() => this.onSelect(InventoryManagement.itemType.Box)}>Box</label>
                        {
                            this.getItemInput("tabSan", InventoryManagement.itemType.SanSwitch)
                        }
                        <label for="tabSan" onClick={() => this.onSelect(InventoryManagement.itemType.SanSwitch)}>SAN 스위치</label>
                        {
                            this.getItemInput("tabEtc", InventoryManagement.itemType.Etc)
                        }
                        <label for="tabEtc" onClick={() => this.onSelect(InventoryManagement.itemType.Etc)}>기타</label>

                     <div className={main.inventSearchBox}>
                            <input ref={this.refSearch} type="text" placeholder="검색어를 입력해주세요." onKeyUp={(e) => this.onSearch(e)} />
                       <div className={main.inventSearchBtn}>
                                <span className={main.inventSearchIcon} onClick={() => this.onClickSearch()}></span>
                                <span className={main.inventSearchText} onClick={() => this.onClickSearch()}>검색</span>
                       </div>
                     </div>

                     <div className={main.inventOptionBox}>
                        <span className={main.plusBox}>
                                <span className={plusClassName} onClick={() => this.onClickAddRow()}></span>
                                <span className={main.addText} onClick={() => this.onClickAddRow()}>추가</span>
                        </span>

                        <span className="inventCheckBox">
                           {checkBoxAreaUI}
                        </span>

                        <div className={main.resetBox}>
                            <div className={main.fixBox} onClick={() => this.onClickEdit()}>
                                <span>편집</span>
                                <span className={editClassName}></span>
                            </div>
                            <span className={main.dashedRight}></span>
                            <div className={main.saveBox} onClick={() => this.onClickSave()}>
                                <span>저장</span>
                                <span className={saveClassName}></span>
                            </div>
                            <span className={main.dashedRight}></span>
                                <div className={main.uploadBox} /*onClick={() => this.onClickUpload()}*/>
                                    <span>업로드</span>
                                    <span className={uploadClassName} onClick={() => this.onClickUploadITPropertyDetail()}></span>
                                    <input ref={this.refUploadITPropertyDetail} type="file" style={{ display: "none" }} onChange={(e) => this.onSelectITPropertyDetailFile(e)} />
                            </div>
                            <span className={main.dashedRight}></span>
                            <div className={main.downBox} onClick={() => this.onClickDownload()}>
                                <span>전체 다운로드</span>
                                    <span className={main.downIconAct}></span>
                            </div>
                        </div>
                     </div> 

                    <div id="content1" className="inventTabContent">
                        <div className={main.inventBottomBox + " " + main.inventBoxScroll + " " + CommonResource.UISection}>
                           {gridUI}
                        </div>
                     </div>

                    {/*페이징*/}
                        {/*<div className={main.pagination}>
                        <a className={main.leftIcon} href="#"></a>
                        <a href="#">1</a>
                        <a className={main.active} href="#">2</a>
                        <a href="#">3</a>
                        <a href="#">4</a>
                        <a href="#">5</a>
                        <a className={main.rightIcon} href="#"></a>
                        </div>*/}

                        {paginationUI}
                    </div>
                </div>
                {
                    this.state.loadingData &&
                    <div className={dash.loadingPop}>
                        <div>
                            <div>
                                <div className={dash.loading}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} icon={this.state.confirmMessage.icon} />
                }

            </>
        );
    }
}
export default InventoryManagement;