import React, { Component } from 'react';
import $ from 'jquery';
import main from '../../../Main/css/main.module.css';

import InputText from './inputText';
import SelectBox from './selectBox';
import DatePickerBox from './datePickerBox';
import InventoryManagement from '../inventoryManagement';

class BoxTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            itemData: [],           // 부모로 부터 전달받은 원본 데이터
            displayData: [],        // 테이블에 표시되고 있는 데이터
            sortString: null,       // 정렬 해당 컬럼 값
        }

        this.props = props;

        if (this.props.itemData) {
            this.state.itemData = this.props.itemData;
            this.state.displayData = this.props.itemData;
        }

        this.refAllCheck = React.createRef();
        this.refTable1 = React.createRef();
        this.refTable2 = React.createRef();
        this.refTable3 = React.createRef();
        this.refTable4 = React.createRef();
        this.refTable5 = React.createRef();
        this.refTable6 = React.createRef();

        this.needRefresh = false;
    }

    componentDidMount() {
        this.props.setTabControlItem(this);
    }

    componentDidUpdate() {
        const _itemData = this.state.itemData;
        const itemData = this.props.itemData;

        if (itemData &&
            _itemData.length !== itemData.length) {
            this.setState({ itemData: itemData, displayData: itemData });
        }
        else if (this.needRefresh) {
            this.needRefresh = false;
            this.setState({});
        }

    }

    setNullableInt(value) {
        if (value === null || value === "") {
            return null;
        }

        if (isNaN(Number(value))) {
            return null;
        }

        const data = parseInt(value);

        if (isNaN(data)) {
            return null;
        }

        return data;
    }

    setNullableDate(value) {
        if (value === null || value === "") {
            return null;
        }

        return value;
    }

    onChangeInputText = (data, column, value) => {
        if (!data)
            return;

        if (column === "basic_Name" && data.basic_Name !== value) { this.props.isModifiy(true); data.basic_Name = value; }
        else if (column === "test" && data.test !== value) { this.props.isModifiy(true); data.test = value; }
        else if (column === "basic_ItemLevel" && data.basic_ItemLevel !== value) { this.props.isModifiy(true); data.basic_ItemLevel = value; }
        else if (column === "basic_Company" && data.basic_Company !== value) { this.props.isModifiy(true); data.basic_Company = value; }
        else if (column === "basic_ModelName" && data.basic_ModelName !== value) { this.props.isModifiy(true); data.basic_ModelName = value; }
        else if (column === "basic_EquipType" && data.basic_EquipType !== value) { this.props.isModifiy(true); data.basic_EquipType = value; }
        else if (column === "basic_SerialNumber" && data.basic_SerialNumber !== value) { this.props.isModifiy(true); data.basic_SerialNumber = value; }
        else if (column === "basic_PropertyType" && data.basic_PropertyType !== value) { this.props.isModifiy(true); data.basic_PropertyType = value; }
        else if (column === "basic_ReceiveDate" && data.basic_ReceiveDate !== this.setNullableDate(value)) { this.props.isModifiy(true); data.basic_ReceiveDate = this.setNullableDate(value); }
        else if (column === "basic_RegDate" && data.basic_RegDate !== this.setNullableDate(value)) { this.props.isModifiy(true); data.basic_RegDate = this.setNullableDate(value); }
        else if (column === "basic_OwnDepartment" && data.basic_OwnDepartment !== value) { this.props.isModifiy(true); data.basic_OwnDepartment = value; }
        else if (column === "basic_Status" && data.basic_Status !== value) { this.props.isModifiy(true); data.basic_Status = value; }
        else if (column === "basic_Usage" && data.basic_Usage !== value) { this.props.isModifiy(true); data.basic_Usage = value; }
        else if (column === "manage_SuperviseManager" && data.manage_SuperviseManager !== value) { this.props.isModifiy(true); data.manage_SuperviseManager = value; }
        else if (column === "manage_OperationManager" && data.manage_OperationManager !== value) { this.props.isModifiy(true); data.manage_OperationManager = value; }
        else if (column === "basic_PartitionAble" && data.basic_PartitionAble !== value) { this.props.isModifiy(true); data.basic_PartitionAble = value; }
        else if (column === "basic_PartitionName" && data.basic_PartitionName !== value) { this.props.isModifiy(true); data.basic_PartitionName = value; }
        else if (column === "basic_ReceiveYears" && data.basic_ReceiveYears !== this.setNullableInt(value)) { this.props.isModifiy(true); data.basic_ReceiveYears = this.setNullableInt(value); }
        else if (column === "position_InstallRegion" && data.position_InstallRegion !== value) { this.props.isModifiy(true); data.position_InstallRegion = value; }
        else if (column === "position_RackDetailPosition" && data.position_RackDetailPosition !== value) { this.props.isModifiy(true); data.position_RackDetailPosition = value; }
        else if (column === "basic_OperationDepartment" && data.basic_OperationDepartment !== value) { this.props.isModifiy(true); data.basic_OperationDepartment = value; }
        else if (column === "basic_DiscardDate" && data.basic_DiscardDate !== this.setNullableDate(value)) { this.props.isModifiy(true); data.basic_DiscardDate = this.setNullableDate(value); }
        else if (column === "basic_OverUsedYear" && data.basic_OverUsedYear !== value) { this.props.isModifiy(true); data.basic_OverUsedYear = value; }
        else if (column === "maintenance_WarrantyMonth" && data.maintenance_WarrantyMonth !== this.setNullableInt(value)) { this.props.isModifiy(true); data.maintenance_WarrantyMonth = this.setNullableInt(value); }
        else if (column === "maintenance_WarrantyExpiredDate" && data.maintenance_WarrantyExpiredDate !== this.setNullableDate(value)) { this.props.isModifiy(true); data.maintenance_WarrantyExpiredDate = this.setNullableDate(value); }
        else if (column === "maintenance_EOLDate" && data.maintenance_EOLDate !== this.setNullableDate(value)) { this.props.isModifiy(true); data.maintenance_EOLDate = this.setNullableDate(value); }
        else if (column === "maintenance_EOSLDate" && data.maintenance_EOSLDate !== this.setNullableDate(value)) { this.props.isModifiy(true); data.maintenance_EOSLDate = this.setNullableDate(value); }
        else if (column === "maintenance_EOSL" && data.maintenance_EOSL !== value) { this.props.isModifiy(true); data.maintenance_EOSL = value; }
        else if (column === "maintenance_MaintenanceContract" && data.maintenance_MaintenanceContract !== value) { this.props.isModifiy(true); data.maintenance_MaintenanceContract = value; }
        else if (column === "maintenance_MaintenanceCompanyName" && data.maintenance_MaintenanceCompanyName !== value) { this.props.isModifiy(true); data.maintenance_MaintenanceCompanyName = value; }
        else if (column === "maintenance_MaintenanceBeginDate" && data.maintenance_MaintenanceBeginDate !== this.setNullableDate(value)) { this.props.isModifiy(true); data.maintenance_MaintenanceBeginDate = this.setNullableDate(value); }
        else if (column === "maintenance_MaintenanceEndDate" && data.maintenance_MaintenanceEndDate !== this.setNullableDate(value)) { this.props.isModifiy(true); data.maintenance_MaintenanceEndDate = this.setNullableDate(value); }
        else if (column === "maintenance_ProvideCompanyName" && data.maintenance_ProvideCompanyName !== value) { this.props.isModifiy(true); data.maintenance_ProvideCompanyName = value; }
        else if (column === "hW_BoxPartitionType" && data.hW_BoxPartitionType !== value) { this.props.isModifiy(true); data.hW_BoxPartitionType = value; }
        else if (column === "hW_PowerDual" && data.hW_PowerDual !== value) { this.props.isModifiy(true); data.hW_PowerDual = value; }
        else if (column === "hW_ConsoleUse" && data.hW_ConsoleUse !== value) { this.props.isModifiy(true); data.hW_ConsoleUse = value; }
        else if (column === "cpU_ModelName" && data.cpU_ModelName !== value) { this.props.isModifiy(true); data.cpU_ModelName = value; }
        else if (column === "cpU_ClockSpeed" && data.cpU_ClockSpeed !== value) { this.props.isModifiy(true); data.cpU_ClockSpeed = value; }
        else if (column === "cpU_SocketCount" && data.cpU_SocketCount !== this.setNullableInt(value)) { this.props.isModifiy(true); data.cpU_SocketCount = this.setNullableInt(value); }
        else if (column === "cpU_CoreCountPerCPU" && data.cpU_CoreCountPerCPU !== this.setNullableInt(value)) { this.props.isModifiy(true); data.cpU_CoreCountPerCPU = this.setNullableInt(value); }
        else if (column === "cpU_TotalSlotCount" && data.cpU_TotalSlotCount !== this.setNullableInt(value)) { this.props.isModifiy(true); data.cpU_TotalSlotCount = this.setNullableInt(value); }
        else if (column === "cpU_UseSlotCount" && data.cpU_UseSlotCount !== this.setNullableInt(value)) { this.props.isModifiy(true); data.cpU_UseSlotCount = this.setNullableInt(value); }
        else if (column === "cpU_HTUse" && data.cpU_HTUse !== value) { this.props.isModifiy(true); data.cpU_HTUse = value; }
        else if (column === "cpU_TotalCoreCount" && data.cpU_TotalCoreCount !== this.setNullableInt(value)) {
            const changedValue = this.setNullableInt(value);

            if (changedValue !== null) {
                this.props.isModifiy(true);
                data.cpU_TotalCoreCount = changedValue;
            }
        }
        else if (column === "mem_TotalSlotCount" && data.mem_TotalSlotCount !== this.setNullableInt(value)) { this.props.isModifiy(true); data.mem_TotalSlotCount = this.setNullableInt(value); }
        else if (column === "mem_EA_1GB" && data.mem_EA_1GB !== this.setNullableInt(value)) { this.props.isModifiy(true); data.mem_EA_1GB = this.setNullableInt(value); }
        else if (column === "mem_EA_2GB" && data.mem_EA_2GB !== this.setNullableInt(value)) { this.props.isModifiy(true); data.mem_EA_2GB = this.setNullableInt(value); }
        else if (column === "mem_EA_4GB" && data.mem_EA_4GB !== this.setNullableInt(value)) { this.props.isModifiy(true); data.mem_EA_4GB = this.setNullableInt(value); }
        else if (column === "mem_EA_8GB" && data.mem_EA_8GB !== this.setNullableInt(value)) { this.props.isModifiy(true); data.mem_EA_8GB = this.setNullableInt(value); }
        else if (column === "mem_EA_16GB" && data.mem_EA_16GB !== this.setNullableInt(value)) { this.props.isModifiy(true); data.mem_EA_16GB = this.setNullableInt(value); }
        else if (column === "mem_EA_32GB" && data.mem_EA_32GB !== this.setNullableInt(value)) { this.props.isModifiy(true); data.mem_EA_32GB = this.setNullableInt(value); }
        else if (column === "mem_EA_64GB" && data.mem_EA_64GB !== this.setNullableInt(value)) { this.props.isModifiy(true); data.mem_EA_64GB = this.setNullableInt(value); }
        else if (column === "mem_EA_128GB" && data.mem_EA_128GB !== this.setNullableInt(value)) { this.props.isModifiy(true); data.mem_EA_128GB = this.setNullableInt(value); }
        else if (column === "mem_EA_256GB" && data.mem_EA_256GB !== this.setNullableInt(value)) { this.props.isModifiy(true); data.mem_EA_256GB = this.setNullableInt(value); }
        else if (column === "mem_UseSlotCount" && data.mem_UseSlotCount !== this.setNullableInt(value)) { this.props.isModifiy(true); data.mem_UseSlotCount = this.setNullableInt(value); }
        else if (column === "mem_MemoryCount" && data.mem_MemoryCount !== this.setNullableInt(value)) { this.props.isModifiy(true); data.mem_MemoryCount = this.setNullableInt(value); }
        else if (column === "mem_TotalMemoryVolume" && data.mem_TotalMemoryVolume !== this.setNullableInt(value)) {
            const changedValue = this.setNullableInt(value);

            if (changedValue !== null) {
                this.props.isModifiy(true);
                data.mem_TotalMemoryVolume = changedValue;
            }
        }
        else if (column === "internal_InternalDiskVolumeGB" && data.internal_InternalDiskVolumeGB !== this.setNullableInt(value)) { this.props.isModifiy(true); data.internal_InternalDiskVolumeGB = this.setNullableInt(value); }
        else if (column === "internal_InternalDiskCount" && data.internal_InternalDiskCount !== this.setNullableInt(value)) { this.props.isModifiy(true); data.internal_InternalDiskCount = this.setNullableInt(value); }
        else if (column === "internal_InternalDiskUsableVolumeGB" && data.internal_InternalDiskUsableVolumeGB !== this.setNullableInt(value)) { this.props.isModifiy(true); data.internal_InternalDiskUsableVolumeGB = this.setNullableInt(value); }
        else if (column === "internal_InternalDiskTotalSlotCount" && data.internal_InternalDiskTotalSlotCount !== this.setNullableInt(value)) { this.props.isModifiy(true); data.internal_InternalDiskTotalSlotCount = this.setNullableInt(value); }
        else if (column === "internal_InternalDiskUseSlot" && data.internal_InternalDiskUseSlot !== value) { this.props.isModifiy(true); data.internal_InternalDiskUseSlot = value; }
        else if (column === "internal_InternalDiskRaidType" && data.internal_InternalDiskRaidType !== value) { this.props.isModifiy(true); data.internal_InternalDiskRaidType = value; }
        else if (column === "internal_InternalDiskSizeGB" && data.internal_InternalDiskSizeGB !== this.setNullableInt(value)) { this.props.isModifiy(true); data.internal_InternalDiskSizeGB = this.setNullableInt(value); }
        else if (column === "external_ExternalDiskCompanyName" && data.external_ExternalDiskCompanyName !== value) { this.props.isModifiy(true); data.external_ExternalDiskCompanyName = value; }
        else if (column === "external_ExternalDiskModel" && data.external_ExternalDiskModel !== value) { this.props.isModifiy(true); data.external_ExternalDiskModel = value; }
        else if (column === "external_ExternalDiskRaidType" && data.external_ExternalDiskRaidType !== value) { this.props.isModifiy(true); data.external_ExternalDiskRaidType = value; }
        else if (column === "external_ExternalDiskSizeGB" && data.external_ExternalDiskSizeGB !== this.setNullableInt(value)) { this.props.isModifiy(true); data.external_ExternalDiskSizeGB = this.setNullableInt(value); }
        else if (column === "external_ExternalDiskMultiPathSolution" && data.external_ExternalDiskMultiPathSolution !== value) { this.props.isModifiy(true); data.external_ExternalDiskMultiPathSolution = value; }
        else if (column === "pS_PowerSupplyCount" && data.pS_PowerSupplyCount !== this.setNullableInt(value)) { this.props.isModifiy(true); data.pS_PowerSupplyCount = this.setNullableInt(value); }
        else if (column === "pS_PowerSupplyVolumeW" && data.pS_PowerSupplyVolumeW !== value) { this.props.isModifiy(true); data.pS_PowerSupplyVolumeW = value; }
        else if (column === "pS_PowerSupplyPduDual" && data.pS_PowerSupplyPduDual !== value) { this.props.isModifiy(true); data.pS_PowerSupplyPduDual = value; }
        else if (column === "pS_PowerSupplyRackPowerDual" && data.pS_PowerSupplyRackPowerDual !== value) { this.props.isModifiy(true); data.pS_PowerSupplyRackPowerDual = value; }
        else if (column === "fan_FanCount" && data.fan_FanCount !== this.setNullableInt(value)) { this.props.isModifiy(true); data.fan_FanCount = this.setNullableInt(value); }
        else if (column === "fan_FanDual" && data.fan_FanDual !== value) { this.props.isModifiy(true); data.fan_FanDual = value; }
        else if (column === "nic_NicSpeed" && data.nic_NicSpeed !== value) { this.props.isModifiy(true); data.nic_NicSpeed = value; }
        else if (column === "nic_NicType" && data.nic_NicType !== value) { this.props.isModifiy(true); data.nic_NicType = value; }
        else if (column === "nic_NicPort" && data.nic_NicPort !== value) { this.props.isModifiy(true); data.nic_NicPort = value; }
        else if (column === "nic_NicCount" && data.nic_NicCount !== this.setNullableInt(value)) { this.props.isModifiy(true); data.nic_NicCount = this.setNullableInt(value); }
        else if (column === "nic_NicUsePortCount" && data.nic_NicUsePortCount !== this.setNullableInt(value)) { this.props.isModifiy(true); data.nic_NicUsePortCount = this.setNullableInt(value); }
        else if (column === "nic_OnboardNicPortCount" && data.nic_OnboardNicPortCount !== this.setNullableInt(value)) { this.props.isModifiy(true); data.nic_OnboardNicPortCount = this.setNullableInt(value); }
        else if (column === "nic_OnboardNicUsePortCount" && data.nic_OnboardNicUsePortCount !== this.setNullableInt(value)) { this.props.isModifiy(true); data.nic_OnboardNicUsePortCount = this.setNullableInt(value); }
        else if (column === "nic_HBASpeed" && data.nic_HBASpeed !== value) { this.props.isModifiy(true); data.nic_HBASpeed = value; }
        else if (column === "nic_HBAType" && data.nic_HBAType !== value) { this.props.isModifiy(true); data.nic_HBAType = value; }
        else if (column === "nic_HBAPort" && data.nic_HBAPort !== value) { this.props.isModifiy(true); data.nic_HBAPort = value; }
        else if (column === "nic_HBACount" && data.nic_HBACount !== this.setNullableInt(value)) { this.props.isModifiy(true); data.nic_HBACount = this.setNullableInt(value); }
        else if (column === "nic_UsingHBAPortCount" && data.nic_UsingHBAPortCount !== this.setNullableInt(value)) { this.props.isModifiy(true); data.nic_UsingHBAPortCount = this.setNullableInt(value); }
        else if (column === "nW_ManageIPAddr" && data.nW_ManageIPAddr !== value) { this.props.isModifiy(true); data.nW_ManageIPAddr = value; }
        else if (column === "nW_IPAddr2" && data.nW_IPAddr2 !== value) { this.props.isModifiy(true); data.nW_IPAddr2 = value; }
        else if (column === "nW_IPAddr3" && data.nW_IPAddr3 !== value) { this.props.isModifiy(true); data.nW_IPAddr3 = value; }
        else if (column === "nW_IPAddr4" && data.nW_IPAddr4 !== value) { this.props.isModifiy(true); data.nW_IPAddr4 = value; }
        else if (column === "connect_SanSwitch1" && data.connect_SanSwitch1 !== value) { this.props.isModifiy(true); data.connect_SanSwitch1 = value; }
        else if (column === "connect_SanSwitch2" && data.connect_SanSwitch2 !== value) { this.props.isModifiy(true); data.connect_SanSwitch2 = value; }
        else if (column === "connect_SanSwitch3" && data.connect_SanSwitch3 !== value) { this.props.isModifiy(true); data.connect_SanSwitch3 = value; }
        else if (column === "connect_NWEquip1" && data.connect_NWEquip1 !== value) { this.props.isModifiy(true); data.connect_NWEquip1 = value; }
        else if (column === "connect_NWEquip2" && data.connect_NWEquip2 !== value) { this.props.isModifiy(true); data.connect_NWEquip2 = value; }
        else if (column === "connect_NWEquip3" && data.connect_NWEquip3 !== value) { this.props.isModifiy(true); data.connect_NWEquip3 = value; }
        else if (column === "connect_NWEquip4" && data.connect_NWEquip4 !== value) { this.props.isModifiy(true); data.connect_NWEquip4 = value; }
        else if (column === "connect_NWEquip5" && data.connect_NWEquip5 !== value) { this.props.isModifiy(true); data.connect_NWEquip5 = value; }
        else if (column === "connect_NWEquip6" && data.connect_NWEquip6 !== value) { this.props.isModifiy(true); data.connect_NWEquip6 = value; }
        else if (column === "connect_NWEquip7" && data.connect_NWEquip7 !== value) { this.props.isModifiy(true); data.connect_NWEquip7 = value; }
        else if (column === "connect_NWEquip8" && data.connect_NWEquip8 !== value) { this.props.isModifiy(true); data.connect_NWEquip8 = value; }
        else if (column === "connect_Storage1" && data.connect_Storage1 !== value) { this.props.isModifiy(true); data.connect_Storage1 = value; }
        else if (column === "connect_Storage2" && data.connect_Storage2 !== value) { this.props.isModifiy(true); data.connect_Storage2 = value; }
        else if (column === "connect_Backup1" && data.connect_Backup1 !== value) { this.props.isModifiy(true); data.connect_Backup1 = value; }
        else if (column === "connect_Backup2" && data.connect_Backup2 !== value) { this.props.isModifiy(true); data.connect_Backup2 = value; }
        else if (column === "connect_Backup3" && data.connect_Backup3 !== value) { this.props.isModifiy(true); data.connect_Backup3 = value; }
        else if (column === "connect_Backup4" && data.connect_Backup4 !== value) { this.props.isModifiy(true); data.connect_Backup4 = value; }
    }

    onChangeCheck = (target, data) => {
        if (!data)
            return;

        let checkList = [];

        if (target.checked) {
            // 체크한 경우
            checkList.push(data.boxID);
            this.props.insertCheckList(checkList);
        } else {
            // 체크 해제한 경우
            checkList.push(data.boxID);

            this.props.deleteCheckList(false, checkList);

            // 전체 선택해제
            var allCheck = document.getElementById("allCheck");
            if (allCheck?.checked === true) {
                allCheck.checked = false;
            }
        }
    }

    onChangeAllCheck = (target) => {
        var checkboxs = document.getElementsByClassName("colCheckBox");

        if (checkboxs?.length > 0) {
            const displayData = this.state.displayData;
            let checkList = [];

            if (target.checked) {
                // UI 수정
                for (const check of checkboxs) {
                    check.checked = true;
                }

                // 데이터 수정
                const pageIndex = this.props.pageIndex;
                const pageItemCount = this.props.pageItemCount;

                let beginNum = 0;
                let endNum = displayData.length;

                if (pageIndex && pageItemCount) {
                    beginNum = (pageIndex - 1) * pageItemCount;
                    endNum = pageIndex * pageItemCount;

                    if (endNum > displayData.length)
                        endNum = displayData.length;
                }

                //for (const data of displayData) {
                for (let i = beginNum; i < endNum; i++) {
                    const data = displayData[i];
                    checkList.push(data.boxID);
                }

                this.props.insertCheckList(checkList);
            } else {
                // UI 수정
                for (const check of checkboxs) {
                    check.checked = false;
                }

                // 데이터 수정
                this.props.deleteCheckList(true, checkList);
            }
        }
    }

    static checkSearchText(item, searchText) {
        if (!searchText || searchText.length === 0) {
            return true;
        }

        if (item.basic_Name && item.basic_Name.toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_ItemLevel && item.basic_ItemLevel.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_Company && item.basic_Company.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_ModelName && item.basic_ModelName.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_EquipType && item.basic_EquipType.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_SerialNumber && item.basic_SerialNumber.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_PropertyType && item.basic_PropertyType.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_ReceiveDate && item.basic_ReceiveDate.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_Eqbasic_RegDateuipType && item.basic_RegDate.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_OwnDepartment && item.basic_OwnDepartment.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_Status && item.basic_Status.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_Usage && item.basic_Usage.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.manage_SuperviseManager && item.manage_SuperviseManager.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.manage_OperationManager && item.manage_OperationManager.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_PartitionAble && item.basic_PartitionAble.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_PartitionName && item.basic_PartitionName.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_ReceiveYears && item.basic_ReceiveYears.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.position_InstallRegion && item.position_InstallRegion.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.position_RackDetailPosition && item.position_RackDetailPosition.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_OperationDepartment && item.basic_OperationDepartment.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_DiscardDate && item.basic_DiscardDate.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_OverUsedYear && item.basic_OverUsedYear.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.maintenance_WarrantyMonth && item.maintenance_WarrantyMonth.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.maintenance_WarrantyExpiredDate && item.maintenance_WarrantyExpiredDate.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.maintenance_EOLDate && item.maintenance_EOLDate.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.maintenance_EOSLDate && item.maintenance_EOSLDate.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.maintenance_EOSL && item.maintenance_EOSL.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.maintenance_MaintenanceContract && item.maintenance_MaintenanceContract.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.maintenance_MaintenanceCompanyName && item.maintenance_MaintenanceCompanyName.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.maintenance_MaintenanceBeginDate && item.maintenance_MaintenanceBeginDate.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.maintenance_MaintenanceEndDate && item.maintenance_MaintenanceEndDate.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.maintenance_ProvideCompanyName && item.maintenance_ProvideCompanyName.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_BoxPartitionType && item.hW_BoxPartitionType.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_PowerDual && item.hW_PowerDual.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_ConsoleUse && item.hW_ConsoleUse.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.cpU_ModelName && item.cpU_ModelName.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.cpU_ClockSpeed && item.cpU_ClockSpeed.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.cpU_SocketCount && item.cpU_SocketCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.cpU_CoreCountPerCPU && item.cpU_CoreCountPerCPU.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.cpU_TotalSlotCount && item.cpU_TotalSlotCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.cpU_UseSlotCount && item.cpU_UseSlotCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.cpU_HTUse && item.cpU_HTUse.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.cpU_TotalCoreCount && item.cpU_TotalCoreCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.mem_TotalSlotCount && item.mem_TotalSlotCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.mem_EA_1GB && item.mem_EA_1GB.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.mem_EA_2GB && item.mem_EA_2GB.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.mem_EA_4GB && item.mem_EA_4GB.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.mem_EA_8GB && item.mem_EA_8GB.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.mem_EA_16GB && item.mem_EA_16GB.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.mem_EA_32GB && item.mem_EA_32GB.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.mem_EA_64GB && item.mem_EA_64GB.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.mem_EA_128GB && item.mem_EA_128GB.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.mem_EA_256GB && item.mem_EA_256GB.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.mem_UseSlotCount && item.mem_UseSlotCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.mem_MemoryCount && item.mem_MemoryCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.mem_TotalMemoryVolume && item.mem_TotalMemoryVolume.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.internal_InternalDiskVolumeGB && item.internal_InternalDiskVolumeGB.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.internal_InternalDiskCount && item.internal_InternalDiskCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.internal_InternalDiskUsableVolumeGB && item.internal_InternalDiskUsableVolumeGB.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.internal_InternalDiskTotalSlotCount && item.internal_InternalDiskTotalSlotCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.internal_InternalDiskUseSlot && item.internal_InternalDiskUseSlot.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.internal_InternalDiskRaidType && item.internal_InternalDiskRaidType.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.internal_InternalDiskSizeGB && item.internal_InternalDiskSizeGB.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.external_ExternalDiskCompanyName && item.external_ExternalDiskCompanyName.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.external_ExternalDiskModel && item.external_ExternalDiskModel.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.external_ExternalDiskRaidType && item.external_ExternalDiskRaidType.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.external_ExternalDiskSizeGB && item.external_ExternalDiskSizeGB.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.external_ExternalDiskMultiPathSolution && item.external_ExternalDiskMultiPathSolution.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.pS_PowerSupplyCount && item.pS_PowerSupplyCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.pS_PowerSupplyVolumeW && item.pS_PowerSupplyVolumeW.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.pS_PowerSupplyPduDual && item.pS_PowerSupplyPduDual.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.pS_PowerSupplyRackPowerDual && item.pS_PowerSupplyRackPowerDual.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.fan_FanCount && item.fan_FanCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.fan_FanDual && item.fan_FanDual.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nic_NicSpeed && item.nic_NicSpeed.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nic_NicType && item.nic_NicType.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nic_NicPort && item.nic_NicPort.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nic_NicCount && item.nic_NicCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nic_NicUsePortCount && item.nic_NicUsePortCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nic_OnboardNicPortCount && item.nic_OnboardNicPortCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nic_OnboardNicUsePortCount && item.nic_OnboardNicUsePortCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nic_HBASpeed && item.nic_HBASpeed.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nic_HBAType && item.nic_HBAType.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nic_HBAPort && item.nic_HBAPort.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nic_HBACount && item.nic_HBACount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nic_UsingHBAPortCount && item.nic_UsingHBAPortCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nW_ManageIPAddr && item.nW_ManageIPAddr.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nW_IPAddr2 && item.nW_IPAddr2.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nW_IPAddr3 && item.nW_IPAddr3.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nW_IPAddr4 && item.nW_IPAddr4.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_SanSwitch1 && item.connect_SanSwitch1.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_SanSwitch2 && item.connect_SanSwitch2.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_SanSwitch3 && item.connect_SanSwitch3.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_NWEquip1 && item.connect_NWEquip1.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_NWEquip2 && item.connect_NWEquip2.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_NWEquip3 && item.connect_NWEquip3.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_NWEquip4 && item.connect_NWEquip4.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_NWEquip5 && item.connect_NWEquip5.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_NWEquip6 && item.connect_NWEquip6.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_NWEquip7 && item.connect_NWEquip7.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_NWEquip8 && item.connect_NWEquip8.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_Storage1 && item.connect_Storage1.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_Storage2 && item.connect_Storage2.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_Backup1 && item.connect_Backup1.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_Backup2 && item.connect_Backup2.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_Backup3 && item.connect_Backup3.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_Backup4 && item.connect_Backup4.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        return false;
    }

    onTabClick(e, table, rowIndex) {
        if (e.key === 'Tab') {
            e.preventDefault();

            if (table.current) {
                const nextCell = table.current.rows[rowIndex]?.cells[0];

                if (nextCell && nextCell.children.length > 0) {
                    nextCell.children[0].focus();
                }
            }
        }
    }

    getTableDataUI2 = () => {
        const displayData = this.props.itemData ? [...this.props.itemData] : [];

        const addedDatas = [...this.props.addedDatas];
        const addedCount = addedDatas.length;

        for (let i = addedCount - 1; i >= 0; i--) {
            const addedData = addedDatas[i];
            addedData.newOne = true;
            displayData.unshift(addedData);
        }

        const sortString = this.state.sortString;

        let tableDataUI = [];
        let tableDataUI1 = [];
        let tableDataUI2 = [];
        let tableDataUI3 = [];
        let tableDataUI4 = [];
        let tableDataUI5 = [];
        let tableDataUI6 = [];
        let tableDataUI7 = [];

        let idx = 1;

        if (displayData?.length > 0) {
            const pageIndex = this.props.pageIndex;
            const pageItemCount = this.props.pageItemCount;

            let beginNum = 0;
            let endNum = displayData.length;

            if (pageIndex && pageItemCount) {
                beginNum = (pageIndex - 1) * pageItemCount;
                endNum = pageIndex * pageItemCount;

                if (endNum > displayData.length)
                    endNum = displayData.length;
            }

            let _rowIndex = 0;

            //for (const data of displayData) {
            for (let i = beginNum; i < endNum; i++) {
                const data = displayData[i];
                const editName = data.newOne ? this.props.editMode : false;
                const rowIndex = _rowIndex;

                tableDataUI1.push(
                    <tr key={data.boxID + "_1_" + rowIndex} className={main.tableTr}>
                        <td className={main.tableTd}><input type="checkBox" className="colCheckBox" onChange={(e) => this.onChangeCheck(e.target, data)} /></td>
                        <td>{i + 1}</td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable2, rowIndex + 3)}><InputText type="text" value={data.basic_Name} onChange={(value) => this.onChangeInputText(data, "basic_Name", value)} editMode={editName} /></td>
                    </tr>
                );
                tableDataUI2.push(
                    <tr key={data.boxID + "_2_" + rowIndex} className={main.tableTr}>
                        <td><InputText type="text" value={data.basic_ItemLevel} onChange={(value) => this.onChangeInputText(data, "basic_ItemLevel", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_Company} onChange={(value) => this.onChangeInputText(data, "basic_Company", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_ModelName} onChange={(value) => this.onChangeInputText(data, "basic_ModelName", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_EquipType} onChange={(value) => this.onChangeInputText(data, "basic_EquipType", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_SerialNumber} onChange={(value) => this.onChangeInputText(data, "basic_SerialNumber", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_PropertyType} onChange={(value) => this.onChangeInputText(data, "basic_PropertyType", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.basic_ReceiveDate} onChange={(value) => this.onChangeInputText(data, "basic_ReceiveDate", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.basic_RegDate} onChange={(value) => this.onChangeInputText(data, "basic_RegDate", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_OwnDepartment} onChange={(value) => this.onChangeInputText(data, "basic_OwnDepartment", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_Status} onChange={(value) => this.onChangeInputText(data, "basic_Status", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_Usage} onChange={(value) => this.onChangeInputText(data, "basic_Usage", value)} editMode={this.props.editMode} /></td>
                        <td><span><InputText type="text" value={data.manage_SuperviseManager} onChange={(value) => this.onChangeInputText(data, "manage_SuperviseManager", value)} editMode={this.props.editMode} /></span></td>
                        <td><span><InputText type="text" value={data.manage_OperationManager} onChange={(value) => this.onChangeInputText(data, "manage_OperationManager", value)} editMode={this.props.editMode} /></span></td>
                        <td><SelectBox type="yesno" value={data.basic_PartitionAble} onChange={(value) => this.onChangeInputText(data, "basic_PartitionAble", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_PartitionName} onChange={(value) => this.onChangeInputText(data, "basic_PartitionName", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.basic_ReceiveYears} onChange={(value) => this.onChangeInputText(data, "basic_ReceiveYears", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.position_InstallRegion} onChange={(value) => this.onChangeInputText(data, "position_InstallRegion", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.position_RackDetailPosition} onChange={(value) => this.onChangeInputText(data, "position_RackDetailPosition", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_OperationDepartment} onChange={(value) => this.onChangeInputText(data, "basic_OperationDepartment", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.basic_DiscardDate} onChange={(value) => this.onChangeInputText(data, "basic_DiscardDate", value)} editMode={this.props.editMode} /></td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable3, rowIndex + 2)}><SelectBox type="yesno" value={data.basic_OverUsedYear} onChange={(value) => this.onChangeInputText(data, "basic_OverUsedYear", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );
                tableDataUI3.push(
                    <tr key={data.boxID + "_3_" + rowIndex} className={main.tableTr}>
                        <td><InputText type="nullNumber" value={data.maintenance_WarrantyMonth} onChange={(value) => this.onChangeInputText(data, "maintenance_WarrantyMonth", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.maintenance_WarrantyExpiredDate} onChange={(value) => this.onChangeInputText(data, "maintenance_WarrantyExpiredDate", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.maintenance_EOLDate} onChange={(value) => this.onChangeInputText(data, "maintenance_EOLDate", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.maintenance_EOSLDate} onChange={(value) => this.onChangeInputText(data, "maintenance_EOSLDate", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.maintenance_EOSL} onChange={(value) => this.onChangeInputText(data, "maintenance_EOSL", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.maintenance_MaintenanceContract} onChange={(value) => this.onChangeInputText(data, "maintenance_MaintenanceContract", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.maintenance_MaintenanceCompanyName} onChange={(value) => this.onChangeInputText(data, "maintenance_MaintenanceCompanyName", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.maintenance_MaintenanceBeginDate} onChange={(value) => this.onChangeInputText(data, "maintenance_MaintenanceBeginDate", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.maintenance_MaintenanceEndDate} onChange={(value) => this.onChangeInputText(data, "maintenance_MaintenanceEndDate", value)} editMode={this.props.editMode} /></td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable4, rowIndex + 3)}><InputText type="text" value={data.maintenance_ProvideCompanyName} onChange={(value) => this.onChangeInputText(data, "maintenance_ProvideCompanyName", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );
                tableDataUI4.push(
                    <tr key={data.boxID + "_4_" + rowIndex} className={main.tableTr}>
                        <td><InputText type="text" value={data.hW_BoxPartitionType} onChange={(value) => this.onChangeInputText(data, "hW_BoxPartitionType", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.hW_PowerDual} onChange={(value) => this.onChangeInputText(data, "hW_PowerDual", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.hW_ConsoleUse} onChange={(value) => this.onChangeInputText(data, "hW_ConsoleUse", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.cpU_ModelName} onChange={(value) => this.onChangeInputText(data, "cpU_ModelName", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.cpU_ClockSpeed} onChange={(value) => this.onChangeInputText(data, "cpU_ClockSpeed", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.cpU_SocketCount} onChange={(value) => this.onChangeInputText(data, "cpU_SocketCount", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.cpU_CoreCountPerCPU} onChange={(value) => this.onChangeInputText(data, "cpU_CoreCountPerCPU", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.cpU_TotalSlotCount} onChange={(value) => this.onChangeInputText(data, "cpU_TotalSlotCount", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.cpU_UseSlotCount} onChange={(value) => this.onChangeInputText(data, "cpU_UseSlotCount", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.cpU_HTUse} onChange={(value) => this.onChangeInputText(data, "cpU_HTUse", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="number" value={data.cpU_TotalCoreCount} onChange={(value) => this.onChangeInputText(data, "cpU_TotalCoreCount", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.mem_TotalSlotCount} onChange={(value) => this.onChangeInputText(data, "mem_TotalSlotCount", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.mem_EA_1GB} onChange={(value) => this.onChangeInputText(data, "mem_EA_1GB", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.mem_EA_2GB} onChange={(value) => this.onChangeInputText(data, "mem_EA_2GB", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.mem_EA_4GB} onChange={(value) => this.onChangeInputText(data, "mem_EA_4GB", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.mem_EA_8GB} onChange={(value) => this.onChangeInputText(data, "mem_EA_8GB", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.mem_EA_16GB} onChange={(value) => this.onChangeInputText(data, "mem_EA_16GB", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.mem_EA_32GB} onChange={(value) => this.onChangeInputText(data, "mem_EA_32GB", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.mem_EA_64GB} onChange={(value) => this.onChangeInputText(data, "mem_EA_64GB", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.mem_EA_128GB} onChange={(value) => this.onChangeInputText(data, "mem_EA_128GB", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.mem_EA_256GB} onChange={(value) => this.onChangeInputText(data, "mem_EA_256GB", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.mem_UseSlotCount} onChange={(value) => this.onChangeInputText(data, "mem_UseSlotCount", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.mem_MemoryCount} onChange={(value) => this.onChangeInputText(data, "mem_MemoryCount", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="number" value={data.mem_TotalMemoryVolume} onChange={(value) => this.onChangeInputText(data, "mem_TotalMemoryVolume", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.internal_InternalDiskVolumeGB} onChange={(value) => this.onChangeInputText(data, "internal_InternalDiskVolumeGB", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.internal_InternalDiskCount} onChange={(value) => this.onChangeInputText(data, "internal_InternalDiskCount", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.internal_InternalDiskUsableVolumeGB} onChange={(value) => this.onChangeInputText(data, "internal_InternalDiskUsableVolumeGB", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.internal_InternalDiskTotalSlotCount} onChange={(value) => this.onChangeInputText(data, "internal_InternalDiskTotalSlotCount", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.internal_InternalDiskUseSlot} onChange={(value) => this.onChangeInputText(data, "internal_InternalDiskUseSlot", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.internal_InternalDiskRaidType} onChange={(value) => this.onChangeInputText(data, "internal_InternalDiskRaidType", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.internal_InternalDiskSizeGB} onChange={(value) => this.onChangeInputText(data, "internal_InternalDiskSizeGB", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.external_ExternalDiskCompanyName} onChange={(value) => this.onChangeInputText(data, "external_ExternalDiskCompanyName", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.external_ExternalDiskModel} onChange={(value) => this.onChangeInputText(data, "external_ExternalDiskModel", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.external_ExternalDiskRaidType} onChange={(value) => this.onChangeInputText(data, "external_ExternalDiskRaidType", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.external_ExternalDiskSizeGB} onChange={(value) => this.onChangeInputText(data, "external_ExternalDiskSizeGB", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.external_ExternalDiskMultiPathSolution} onChange={(value) => this.onChangeInputText(data, "external_ExternalDiskMultiPathSolution", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.pS_PowerSupplyCount} onChange={(value) => this.onChangeInputText(data, "pS_PowerSupplyCount", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.pS_PowerSupplyVolumeW} onChange={(value) => this.onChangeInputText(data, "pS_PowerSupplyVolumeW", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.pS_PowerSupplyPduDual} onChange={(value) => this.onChangeInputText(data, "pS_PowerSupplyPduDual", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.pS_PowerSupplyRackPowerDual} onChange={(value) => this.onChangeInputText(data, "pS_PowerSupplyRackPowerDual", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.fan_FanCount} onChange={(value) => this.onChangeInputText(data, "fan_FanCount", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.fan_FanDual} onChange={(value) => this.onChangeInputText(data, "fan_FanDual", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.nic_NicSpeed} onChange={(value) => this.onChangeInputText(data, "nic_NicSpeed", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.nic_NicType} onChange={(value) => this.onChangeInputText(data, "nic_NicType", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.nic_NicPort} onChange={(value) => this.onChangeInputText(data, "nic_NicPort", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.nic_NicCount} onChange={(value) => this.onChangeInputText(data, "nic_NicCount", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.nic_NicUsePortCount} onChange={(value) => this.onChangeInputText(data, "nic_NicUsePortCount", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.nic_OnboardNicPortCount} onChange={(value) => this.onChangeInputText(data, "nic_OnboardNicPortCount", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.nic_OnboardNicUsePortCount} onChange={(value) => this.onChangeInputText(data, "nic_OnboardNicUsePortCount", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.nic_HBASpeed} onChange={(value) => this.onChangeInputText(data, "nic_HBASpeed", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.nic_HBAType} onChange={(value) => this.onChangeInputText(data, "nic_HBAType", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.nic_HBAPort} onChange={(value) => this.onChangeInputText(data, "nic_HBAPort", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.nic_HBACount} onChange={(value) => this.onChangeInputText(data, "nic_HBACount", value)} editMode={this.props.editMode} /></td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable5, rowIndex + 2)}><InputText type="nullNumber" value={data.nic_UsingHBAPortCount} onChange={(value) => this.onChangeInputText(data, "nic_UsingHBAPortCount", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );
                tableDataUI5.push(
                    <tr key={data.boxID + "_5_" + rowIndex} className={main.tableTr}>
                        <td><InputText type="text" value={data.nW_ManageIPAddr} onChange={(value) => this.onChangeInputText(data, "nW_ManageIPAddr", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.nW_IPAddr2} onChange={(value) => this.onChangeInputText(data, "nW_IPAddr2", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.nW_IPAddr3} onChange={(value) => this.onChangeInputText(data, "nW_IPAddr3", value)} editMode={this.props.editMode} /></td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable6, rowIndex + 2)}><InputText type="text" value={data.nW_IPAddr4} onChange={(value) => this.onChangeInputText(data, "nW_IPAddr4", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );
                tableDataUI6.push(
                    <tr key={data.boxID + "_6_" + rowIndex} className={main.tableTr}>
                        <td><InputText type="text" value={data.connect_SanSwitch1} onChange={(value) => this.onChangeInputText(data, "connect_SanSwitch1", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_SanSwitch2} onChange={(value) => this.onChangeInputText(data, "connect_SanSwitch2", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_SanSwitch3} onChange={(value) => this.onChangeInputText(data, "connect_SanSwitch3", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_NWEquip1} onChange={(value) => this.onChangeInputText(data, "connect_NWEquip1", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_NWEquip2} onChange={(value) => this.onChangeInputText(data, "connect_NWEquip2", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_NWEquip3} onChange={(value) => this.onChangeInputText(data, "connect_NWEquip3", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_NWEquip4} onChange={(value) => this.onChangeInputText(data, "connect_NWEquip4", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_NWEquip5} onChange={(value) => this.onChangeInputText(data, "connect_NWEquip5", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_NWEquip6} onChange={(value) => this.onChangeInputText(data, "connect_NWEquip6", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_NWEquip7} onChange={(value) => this.onChangeInputText(data, "connect_NWEquip7", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_NWEquip8} onChange={(value) => this.onChangeInputText(data, "connect_NWEquip8", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_Storage1} onChange={(value) => this.onChangeInputText(data, "connect_Storage1", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_Storage2} onChange={(value) => this.onChangeInputText(data, "connect_Storage2", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_Backup1} onChange={(value) => this.onChangeInputText(data, "connect_Backup1", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_Backup2} onChange={(value) => this.onChangeInputText(data, "connect_Backup2", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_Backup3} onChange={(value) => this.onChangeInputText(data, "connect_Backup3", value)} editMode={this.props.editMode} /></td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable1, rowIndex + 2)}><InputText type="text" value={data.connect_Backup4} onChange={(value) => this.onChangeInputText(data, "connect_Backup4", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );
                tableDataUI7.push(
                    <tr key={data.boxID + "_7_" + rowIndex} className={main.tableTr}>
                        <td></td>
                    </tr>
                );

                idx++;
                _rowIndex++;
            }
        }

        return [tableDataUI1, tableDataUI2, tableDataUI3, tableDataUI4, tableDataUI5, tableDataUI6, tableDataUI7];
    }

    onClickSort = (data) => {
        if (!data)
            return;

        const displayData = this.state.displayData;
        const sortString = this.state.sortString;

        if (sortString === data)
            return;



        // .TODO: 정렬 필요
        if (data === "basic_Name") { displayData.sort((a, b) => { if ((a.basic_Name === null || a.basic_Name === undefined) && (b.basic_Name === null || b.basic_Name === undefined)) { return 0; } else if (a.basic_Name === null || a.basic_Name === undefined) { return 1; } else if (b.basic_Name === null || b.basic_Name === undefined) { return -1; } else if (a.basic_Name?.toLowerCase() > b.basic_Name?.toLowerCase()) { return 1; } else if (a.basic_Name?.toLowerCase() < b.basic_Name?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_ItemLevel") { displayData.sort((a, b) => { if ((a.basic_ItemLevel === null || a.basic_ItemLevel === undefined) && (b.basic_ItemLevel === null || b.basic_ItemLevel === undefined)) { return 0; } else if (a.basic_ItemLevel === null || a.basic_ItemLevel === undefined) { return 1; } else if (b.basic_ItemLevel === null || b.basic_ItemLevel === undefined) { return -1; } else if (a.basic_ItemLevel?.toLowerCase() > b.basic_ItemLevel?.toLowerCase()) { return 1; } else if (a.basic_ItemLevel?.toLowerCase() < b.basic_ItemLevel?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_Company") { displayData.sort((a, b) => { if ((a.basic_Company === null || a.basic_Company === undefined) && (b.basic_Company === null || b.basic_Company === undefined)) { return 0; } else if (a.basic_Company === null || a.basic_Company === undefined) { return 1; } else if (b.basic_Company === null || b.basic_Company === undefined) { return -1; } else if (a.basic_Company?.toLowerCase() > b.basic_Company?.toLowerCase()) { return 1; } else if (a.basic_Company?.toLowerCase() < b.basic_Company?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_ModelName") { displayData.sort((a, b) => { if ((a.basic_ModelName === null || a.basic_ModelName === undefined) && (b.basic_ModelName === null || b.basic_ModelName === undefined)) { return 0; } else if (a.basic_ModelName === null || a.basic_ModelName === undefined) { return 1; } else if (b.basic_ModelName === null || b.basic_ModelName === undefined) { return -1; } else if (a.basic_ModelName?.toLowerCase() > b.basic_ModelName?.toLowerCase()) { return 1; } else if (a.basic_ModelName?.toLowerCase() < b.basic_ModelName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_EquipType") { displayData.sort((a, b) => { if ((a.basic_EquipType === null || a.basic_EquipType === undefined) && (b.basic_EquipType === null || b.basic_EquipType === undefined)) { return 0; } else if (a.basic_EquipType === null || a.basic_EquipType === undefined) { return 1; } else if (b.basic_EquipType === null || b.basic_EquipType === undefined) { return -1; } else if (a.basic_EquipType?.toLowerCase() > b.basic_EquipType?.toLowerCase()) { return 1; } else if (a.basic_EquipType?.toLowerCase() < b.basic_EquipType?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_SerialNumber") { displayData.sort((a, b) => { if ((a.basic_SerialNumber === null || a.basic_SerialNumber === undefined) && (b.basic_SerialNumber === null || b.basic_SerialNumber === undefined)) { return 0; } else if (a.basic_SerialNumber === null || a.basic_SerialNumber === undefined) { return 1; } else if (b.basic_SerialNumber === null || b.basic_SerialNumber === undefined) { return -1; } else if (a.basic_SerialNumber?.toLowerCase() > b.basic_SerialNumber?.toLowerCase()) { return 1; } else if (a.basic_SerialNumber?.toLowerCase() < b.basic_SerialNumber?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_PropertyType") { displayData.sort((a, b) => { if ((a.basic_PropertyType === null || a.basic_PropertyType === undefined) && (b.basic_PropertyType === null || b.basic_PropertyType === undefined)) { return 0; } else if (a.basic_PropertyType === null || a.basic_PropertyType === undefined) { return 1; } else if (b.basic_PropertyType === null || b.basic_PropertyType === undefined) { return -1; } else if (a.basic_PropertyType?.toLowerCase() > b.basic_PropertyType?.toLowerCase()) { return 1; } else if (a.basic_PropertyType?.toLowerCase() < b.basic_PropertyType?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_ReceiveDate") { displayData.sort((a, b) => { if ((a.basic_ReceiveDate === null || a.basic_ReceiveDate === undefined) && (b.basic_ReceiveDate === null || b.basic_ReceiveDate === undefined)) { return 0; } else if (a.basic_ReceiveDate === null || a.basic_ReceiveDate === undefined) { return 1; } else if (b.basic_ReceiveDate === null || b.basic_ReceiveDate === undefined) { return -1; } else if (a.basic_ReceiveDate > b.basic_ReceiveDate) { return 1; } else if (a.basic_ReceiveDate < b.basic_ReceiveDate) { return -1; } else { return 0; } }); }
        else if (data === "basic_RegDate") { displayData.sort((a, b) => { if ((a.basic_RegDate === null || a.basic_RegDate === undefined) && (b.basic_RegDate === null || b.basic_RegDate === undefined)) { return 0; } else if (a.basic_RegDate === null || a.basic_RegDate === undefined) { return 1; } else if (b.basic_RegDate === null || b.basic_RegDate === undefined) { return -1; } else if (a.basic_RegDate > b.basic_RegDate) { return 1; } else if (a.basic_RegDate < b.basic_RegDate) { return -1; } else { return 0; } }); }
        else if (data === "basic_OwnDepartment") { displayData.sort((a, b) => { if ((a.basic_OwnDepartment === null || a.basic_OwnDepartment === undefined) && (b.basic_OwnDepartment === null || b.basic_OwnDepartment === undefined)) { return 0; } else if (a.basic_OwnDepartment === null || a.basic_OwnDepartment === undefined) { return 1; } else if (b.basic_OwnDepartment === null || b.basic_OwnDepartment === undefined) { return -1; } else if (a.basic_OwnDepartment?.toLowerCase() > b.basic_OwnDepartment?.toLowerCase()) { return 1; } else if (a.basic_OwnDepartment?.toLowerCase() < b.basic_OwnDepartment?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_Status") { displayData.sort((a, b) => { if ((a.basic_Status === null || a.basic_Status === undefined) && (b.basic_Status === null || b.basic_Status === undefined)) { return 0; } else if (a.basic_Status === null || a.basic_Status === undefined) { return 1; } else if (b.basic_Status === null || b.basic_Status === undefined) { return -1; } else if (a.basic_Status?.toLowerCase() > b.basic_Status?.toLowerCase()) { return 1; } else if (a.basic_Status?.toLowerCase() < b.basic_Status?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_Usage") { displayData.sort((a, b) => { if ((a.basic_Usage === null || a.basic_Usage === undefined) && (b.basic_Usage === null || b.basic_Usage === undefined)) { return 0; } else if (a.basic_Usage === null || a.basic_Usage === undefined) { return 1; } else if (b.basic_Usage === null || b.basic_Usage === undefined) { return -1; } else if (a.basic_Usage?.toLowerCase() > b.basic_Usage?.toLowerCase()) { return 1; } else if (a.basic_Usage?.toLowerCase() < b.basic_Usage?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "manage_SuperviseManager") { displayData.sort((a, b) => { if ((a.manage_SuperviseManager === null || a.manage_SuperviseManager === undefined) && (b.manage_SuperviseManager === null || b.manage_SuperviseManager === undefined)) { return 0; } else if (a.manage_SuperviseManager === null || a.manage_SuperviseManager === undefined) { return 1; } else if (b.manage_SuperviseManager === null || b.manage_SuperviseManager === undefined) { return -1; } else if (a.manage_SuperviseManager?.toLowerCase() > b.manage_SuperviseManager?.toLowerCase()) { return 1; } else if (a.manage_SuperviseManager?.toLowerCase() < b.manage_SuperviseManager?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "manage_OperationManager") { displayData.sort((a, b) => { if ((a.manage_OperationManager === null || a.manage_OperationManager === undefined) && (b.manage_OperationManager === null || b.manage_OperationManager === undefined)) { return 0; } else if (a.manage_OperationManager === null || a.manage_OperationManager === undefined) { return 1; } else if (b.manage_OperationManager === null || b.manage_OperationManager === undefined) { return -1; } else if (a.manage_OperationManager?.toLowerCase() > b.manage_OperationManager?.toLowerCase()) { return 1; } else if (a.manage_OperationManager?.toLowerCase() < b.manage_OperationManager?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_PartitionAble") { displayData.sort((a, b) => { if ((a.basic_PartitionAble === null || a.basic_PartitionAble === undefined) && (b.basic_PartitionAble === null || b.basic_PartitionAble === undefined)) { return 0; } else if (a.basic_PartitionAble === null || a.basic_PartitionAble === undefined) { return 1; } else if (b.basic_PartitionAble === null || b.basic_PartitionAble === undefined) { return -1; } else if (a.basic_PartitionAble > b.basic_PartitionAble) { return 1; } else if (a.basic_PartitionAble < b.basic_PartitionAble) { return -1; } else { return 0; } }); }
        else if (data === "basic_PartitionName") { displayData.sort((a, b) => { if ((a.basic_PartitionName === null || a.basic_PartitionName === undefined) && (b.basic_PartitionName === null || b.basic_PartitionName === undefined)) { return 0; } else if (a.basic_PartitionName === null || a.basic_PartitionName === undefined) { return 1; } else if (b.basic_PartitionName === null || b.basic_PartitionName === undefined) { return -1; } else if (a.basic_PartitionName?.toLowerCase() > b.basic_PartitionName?.toLowerCase()) { return 1; } else if (a.basic_PartitionName?.toLowerCase() < b.basic_PartitionName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_ReceiveYears") { displayData.sort((a, b) => { if ((a.basic_ReceiveYears === null || a.basic_ReceiveYears === undefined) && (b.basic_ReceiveYears === null || b.basic_ReceiveYears === undefined)) { return 0; } else if (a.basic_ReceiveYears === null || a.basic_ReceiveYears === undefined) { return 1; } else if (b.basic_ReceiveYears === null || b.basic_ReceiveYears === undefined) { return -1; } else if (a.basic_ReceiveYears > b.basic_ReceiveYears) { return 1; } else if (a.basic_ReceiveYears < b.basic_ReceiveYears) { return -1; } else { return 0; } }); }
        else if (data === "position_InstallRegion") { displayData.sort((a, b) => { if ((a.position_InstallRegion === null || a.position_InstallRegion === undefined) && (b.position_InstallRegion === null || b.position_InstallRegion === undefined)) { return 0; } else if (a.position_InstallRegion === null || a.position_InstallRegion === undefined) { return 1; } else if (b.position_InstallRegion === null || b.position_InstallRegion === undefined) { return -1; } else if (a.position_InstallRegion?.toLowerCase() > b.position_InstallRegion?.toLowerCase()) { return 1; } else if (a.position_InstallRegion?.toLowerCase() < b.position_InstallRegion?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "position_RackDetailPosition") { displayData.sort((a, b) => { if ((a.position_RackDetailPosition === null || a.position_RackDetailPosition === undefined) && (b.position_RackDetailPosition === null || b.position_RackDetailPosition === undefined)) { return 0; } else if (a.position_RackDetailPosition === null || a.position_RackDetailPosition === undefined) { return 1; } else if (b.position_RackDetailPosition === null || b.position_RackDetailPosition === undefined) { return -1; } else if (a.position_RackDetailPosition?.toLowerCase() > b.position_RackDetailPosition?.toLowerCase()) { return 1; } else if (a.position_RackDetailPosition?.toLowerCase() < b.position_RackDetailPosition?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_OperationDepartment") { displayData.sort((a, b) => { if ((a.basic_OperationDepartment === null || a.basic_OperationDepartment === undefined) && (b.basic_OperationDepartment === null || b.basic_OperationDepartment === undefined)) { return 0; } else if (a.basic_OperationDepartment === null || a.basic_OperationDepartment === undefined) { return 1; } else if (b.basic_OperationDepartment === null || b.basic_OperationDepartment === undefined) { return -1; } else if (a.basic_OperationDepartment?.toLowerCase() > b.basic_OperationDepartment?.toLowerCase()) { return 1; } else if (a.basic_OperationDepartment?.toLowerCase() < b.basic_OperationDepartment?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_DiscardDate") { displayData.sort((a, b) => { if ((a.basic_DiscardDate === null || a.basic_DiscardDate === undefined) && (b.basic_DiscardDate === null || b.basic_DiscardDate === undefined)) { return 0; } else if (a.basic_DiscardDate === null || a.basic_DiscardDate === undefined) { return 1; } else if (b.basic_DiscardDate === null || b.basic_DiscardDate === undefined) { return -1; } else if (a.basic_DiscardDate > b.basic_DiscardDate) { return 1; } else if (a.basic_DiscardDate < b.basic_DiscardDate) { return -1; } else { return 0; } }); }
        else if (data === "basic_OverUsedYear") { displayData.sort((a, b) => { if ((a.basic_OverUsedYear === null || a.basic_OverUsedYear === undefined) && (b.basic_OverUsedYear === null || b.basic_OverUsedYear === undefined)) { return 0; } else if (a.basic_OverUsedYear === null || a.basic_OverUsedYear === undefined) { return 1; } else if (b.basic_OverUsedYear === null || b.basic_OverUsedYear === undefined) { return -1; } else if (a.basic_OverUsedYear > b.basic_OverUsedYear) { return 1; } else if (a.basic_OverUsedYear < b.basic_OverUsedYear) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_WarrantyMonth") { displayData.sort((a, b) => { if ((a.maintenance_WarrantyMonth === null || a.maintenance_WarrantyMonth === undefined) && (b.maintenance_WarrantyMonth === null || b.maintenance_WarrantyMonth === undefined)) { return 0; } else if (a.maintenance_WarrantyMonth === null || a.maintenance_WarrantyMonth === undefined) { return 1; } else if (b.maintenance_WarrantyMonth === null || b.maintenance_WarrantyMonth === undefined) { return -1; } else if (a.maintenance_WarrantyMonth > b.maintenance_WarrantyMonth) { return 1; } else if (a.maintenance_WarrantyMonth < b.maintenance_WarrantyMonth) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_WarrantyExpiredDate") { displayData.sort((a, b) => { if ((a.maintenance_WarrantyExpiredDate === null || a.maintenance_WarrantyExpiredDate === undefined) && (b.maintenance_WarrantyExpiredDate === null || b.maintenance_WarrantyExpiredDate === undefined)) { return 0; } else if (a.maintenance_WarrantyExpiredDate === null || a.maintenance_WarrantyExpiredDate === undefined) { return 1; } else if (b.maintenance_WarrantyExpiredDate === null || b.maintenance_WarrantyExpiredDate === undefined) { return -1; } else if (a.maintenance_WarrantyExpiredDate > b.maintenance_WarrantyExpiredDate) { return 1; } else if (a.maintenance_WarrantyExpiredDate < b.maintenance_WarrantyExpiredDate) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_EOLDate") { displayData.sort((a, b) => { if ((a.maintenance_EOLDate === null || a.maintenance_EOLDate === undefined) && (b.maintenance_EOLDate === null || b.maintenance_EOLDate === undefined)) { return 0; } else if (a.maintenance_EOLDate === null || a.maintenance_EOLDate === undefined) { return 1; } else if (b.maintenance_EOLDate === null || b.maintenance_EOLDate === undefined) { return -1; } else if (a.maintenance_EOLDate > b.maintenance_EOLDate) { return 1; } else if (a.maintenance_EOLDate < b.maintenance_EOLDate) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_EOSLDate") { displayData.sort((a, b) => { if ((a.maintenance_EOSLDate === null || a.maintenance_EOSLDate === undefined) && (b.maintenance_EOSLDate === null || b.maintenance_EOSLDate === undefined)) { return 0; } else if (a.maintenance_EOSLDate === null || a.maintenance_EOSLDate === undefined) { return 1; } else if (b.maintenance_EOSLDate === null || b.maintenance_EOSLDate === undefined) { return -1; } else if (a.maintenance_EOSLDate > b.maintenance_EOSLDate) { return 1; } else if (a.maintenance_EOSLDate < b.maintenance_EOSLDate) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_EOSL") { displayData.sort((a, b) => { if ((a.maintenance_EOSL === null || a.maintenance_EOSL === undefined) && (b.maintenance_EOSL === null || b.maintenance_EOSL === undefined)) { return 0; } else if (a.maintenance_EOSL === null || a.maintenance_EOSL === undefined) { return 1; } else if (b.maintenance_EOSL === null || b.maintenance_EOSL === undefined) { return -1; } else if (a.maintenance_EOSL > b.maintenance_EOSL) { return 1; } else if (a.maintenance_EOSL < b.maintenance_EOSL) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_MaintenanceContract") { displayData.sort((a, b) => { if ((a.maintenance_MaintenanceContract === null || a.maintenance_MaintenanceContract === undefined) && (b.maintenance_MaintenanceContract === null || b.maintenance_MaintenanceContract === undefined)) { return 0; } else if (a.maintenance_MaintenanceContract === null || a.maintenance_MaintenanceContract === undefined) { return 1; } else if (b.maintenance_MaintenanceContract === null || b.maintenance_MaintenanceContract === undefined) { return -1; } else if (a.maintenance_MaintenanceContract > b.maintenance_MaintenanceContract) { return 1; } else if (a.maintenance_MaintenanceContract < b.maintenance_MaintenanceContract) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_MaintenanceCompanyName") { displayData.sort((a, b) => { if ((a.maintenance_MaintenanceCompanyName === null || a.maintenance_MaintenanceCompanyName === undefined) && (b.maintenance_MaintenanceCompanyName === null || b.maintenance_MaintenanceCompanyName === undefined)) { return 0; } else if (a.maintenance_MaintenanceCompanyName === null || a.maintenance_MaintenanceCompanyName === undefined) { return 1; } else if (b.maintenance_MaintenanceCompanyName === null || b.maintenance_MaintenanceCompanyName === undefined) { return -1; } else if (a.maintenance_MaintenanceCompanyName?.toLowerCase() > b.maintenance_MaintenanceCompanyName?.toLowerCase()) { return 1; } else if (a.maintenance_MaintenanceCompanyName?.toLowerCase() < b.maintenance_MaintenanceCompanyName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_MaintenanceBeginDate") { displayData.sort((a, b) => { if ((a.maintenance_MaintenanceBeginDate === null || a.maintenance_MaintenanceBeginDate === undefined) && (b.maintenance_MaintenanceBeginDate === null || b.maintenance_MaintenanceBeginDate === undefined)) { return 0; } else if (a.maintenance_MaintenanceBeginDate === null || a.maintenance_MaintenanceBeginDate === undefined) { return 1; } else if (b.maintenance_MaintenanceBeginDate === null || b.maintenance_MaintenanceBeginDate === undefined) { return -1; } else if (a.maintenance_MaintenanceBeginDate > b.maintenance_MaintenanceBeginDate) { return 1; } else if (a.maintenance_MaintenanceBeginDate < b.maintenance_MaintenanceBeginDate) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_MaintenanceEndDate") { displayData.sort((a, b) => { if ((a.maintenance_MaintenanceEndDate === null || a.maintenance_MaintenanceEndDate === undefined) && (b.maintenance_MaintenanceEndDate === null || b.maintenance_MaintenanceEndDate === undefined)) { return 0; } else if (a.maintenance_MaintenanceEndDate === null || a.maintenance_MaintenanceEndDate === undefined) { return 1; } else if (b.maintenance_MaintenanceEndDate === null || b.maintenance_MaintenanceEndDate === undefined) { return -1; } else if (a.maintenance_MaintenanceEndDate > b.maintenance_MaintenanceEndDate) { return 1; } else if (a.maintenance_MaintenanceEndDate < b.maintenance_MaintenanceEndDate) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_ProvideCompanyName") { displayData.sort((a, b) => { if ((a.maintenance_ProvideCompanyName === null || a.maintenance_ProvideCompanyName === undefined) && (b.maintenance_ProvideCompanyName === null || b.maintenance_ProvideCompanyName === undefined)) { return 0; } else if (a.maintenance_ProvideCompanyName === null || a.maintenance_ProvideCompanyName === undefined) { return 1; } else if (b.maintenance_ProvideCompanyName === null || b.maintenance_ProvideCompanyName === undefined) { return -1; } else if (a.maintenance_ProvideCompanyName?.toLowerCase() > b.maintenance_ProvideCompanyName?.toLowerCase()) { return 1; } else if (a.maintenance_ProvideCompanyName?.toLowerCase() < b.maintenance_ProvideCompanyName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_BoxPartitionType") { displayData.sort((a, b) => { if ((a.hW_BoxPartitionType === null || a.hW_BoxPartitionType === undefined) && (b.hW_BoxPartitionType === null || b.hW_BoxPartitionType === undefined)) { return 0; } else if (a.hW_BoxPartitionType === null || a.hW_BoxPartitionType === undefined) { return 1; } else if (b.hW_BoxPartitionType === null || b.hW_BoxPartitionType === undefined) { return -1; } else if (a.hW_BoxPartitionType?.toLowerCase() > b.hW_BoxPartitionType?.toLowerCase()) { return 1; } else if (a.hW_BoxPartitionType?.toLowerCase() < b.hW_BoxPartitionType?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_PowerDual") { displayData.sort((a, b) => { if ((a.hW_PowerDual === null || a.hW_PowerDual === undefined) && (b.hW_PowerDual === null || b.hW_PowerDual === undefined)) { return 0; } else if (a.hW_PowerDual === null || a.hW_PowerDual === undefined) { return 1; } else if (b.hW_PowerDual === null || b.hW_PowerDual === undefined) { return -1; } else if (a.hW_PowerDual > b.hW_PowerDual) { return 1; } else if (a.hW_PowerDual < b.hW_PowerDual) { return -1; } else { return 0; } }); }
        else if (data === "hW_ConsoleUse") { displayData.sort((a, b) => { if ((a.hW_ConsoleUse === null || a.hW_ConsoleUse === undefined) && (b.hW_ConsoleUse === null || b.hW_ConsoleUse === undefined)) { return 0; } else if (a.hW_ConsoleUse === null || a.hW_ConsoleUse === undefined) { return 1; } else if (b.hW_ConsoleUse === null || b.hW_ConsoleUse === undefined) { return -1; } else if (a.hW_ConsoleUse > b.hW_ConsoleUse) { return 1; } else if (a.hW_ConsoleUse < b.hW_ConsoleUse) { return -1; } else { return 0; } }); }
        else if (data === "cpU_ModelName") { displayData.sort((a, b) => { if ((a.cpU_ModelName === null || a.cpU_ModelName === undefined) && (b.cpU_ModelName === null || b.cpU_ModelName === undefined)) { return 0; } else if (a.cpU_ModelName === null || a.cpU_ModelName === undefined) { return 1; } else if (b.cpU_ModelName === null || b.cpU_ModelName === undefined) { return -1; } else if (a.cpU_ModelName?.toLowerCase() > b.cpU_ModelName?.toLowerCase()) { return 1; } else if (a.cpU_ModelName?.toLowerCase() < b.cpU_ModelName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "cpU_ClockSpeed") { displayData.sort((a, b) => { if ((a.cpU_ClockSpeed === null || a.cpU_ClockSpeed === undefined) && (b.cpU_ClockSpeed === null || b.cpU_ClockSpeed === undefined)) { return 0; } else if (a.cpU_ClockSpeed === null || a.cpU_ClockSpeed === undefined) { return 1; } else if (b.cpU_ClockSpeed === null || b.cpU_ClockSpeed === undefined) { return -1; } else if (a.cpU_ClockSpeed?.toLowerCase() > b.cpU_ClockSpeed?.toLowerCase()) { return 1; } else if (a.cpU_ClockSpeed?.toLowerCase() < b.cpU_ClockSpeed?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "cpU_SocketCount") { displayData.sort((a, b) => { if ((a.cpU_SocketCount === null || a.cpU_SocketCount === undefined) && (b.cpU_SocketCount === null || b.cpU_SocketCount === undefined)) { return 0; } else if (a.cpU_SocketCount === null || a.cpU_SocketCount === undefined) { return 1; } else if (b.cpU_SocketCount === null || b.cpU_SocketCount === undefined) { return -1; } else if (a.cpU_SocketCount > b.cpU_SocketCount) { return 1; } else if (a.cpU_SocketCount < b.cpU_SocketCount) { return -1; } else { return 0; } }); }
        else if (data === "cpU_CoreCountPerCPU") { displayData.sort((a, b) => { if ((a.cpU_CoreCountPerCPU === null || a.cpU_CoreCountPerCPU === undefined) && (b.cpU_CoreCountPerCPU === null || b.cpU_CoreCountPerCPU === undefined)) { return 0; } else if (a.cpU_CoreCountPerCPU === null || a.cpU_CoreCountPerCPU === undefined) { return 1; } else if (b.cpU_CoreCountPerCPU === null || b.cpU_CoreCountPerCPU === undefined) { return -1; } else if (a.cpU_CoreCountPerCPU > b.cpU_CoreCountPerCPU) { return 1; } else if (a.cpU_CoreCountPerCPU < b.cpU_CoreCountPerCPU) { return -1; } else { return 0; } }); }
        else if (data === "cpU_TotalSlotCount") { displayData.sort((a, b) => { if ((a.cpU_TotalSlotCount === null || a.cpU_TotalSlotCount === undefined) && (b.cpU_TotalSlotCount === null || b.cpU_TotalSlotCount === undefined)) { return 0; } else if (a.cpU_TotalSlotCount === null || a.cpU_TotalSlotCount === undefined) { return 1; } else if (b.cpU_TotalSlotCount === null || b.cpU_TotalSlotCount === undefined) { return -1; } else if (a.cpU_TotalSlotCount > b.cpU_TotalSlotCount) { return 1; } else if (a.cpU_TotalSlotCount < b.cpU_TotalSlotCount) { return -1; } else { return 0; } }); }
        else if (data === "cpU_UseSlotCount") { displayData.sort((a, b) => { if ((a.cpU_UseSlotCount === null || a.cpU_UseSlotCount === undefined) && (b.cpU_UseSlotCount === null || b.cpU_UseSlotCount === undefined)) { return 0; } else if (a.cpU_UseSlotCount === null || a.cpU_UseSlotCount === undefined) { return 1; } else if (b.cpU_UseSlotCount === null || b.cpU_UseSlotCount === undefined) { return -1; } else if (a.cpU_UseSlotCount > b.cpU_UseSlotCount) { return 1; } else if (a.cpU_UseSlotCount < b.cpU_UseSlotCount) { return -1; } else { return 0; } }); }
        else if (data === "cpU_HTUse") { displayData.sort((a, b) => { if ((a.cpU_HTUse === null || a.cpU_HTUse === undefined) && (b.cpU_HTUse === null || b.cpU_HTUse === undefined)) { return 0; } else if (a.cpU_HTUse === null || a.cpU_HTUse === undefined) { return 1; } else if (b.cpU_HTUse === null || b.cpU_HTUse === undefined) { return -1; } else if (a.cpU_HTUse > b.cpU_HTUse) { return 1; } else if (a.cpU_HTUse < b.cpU_HTUse) { return -1; } else { return 0; } }); }
        else if (data === "cpU_TotalCoreCount") { displayData.sort((a, b) => { if ((a.cpU_TotalCoreCount === null || a.cpU_TotalCoreCount === undefined) && (b.cpU_TotalCoreCount === null || b.cpU_TotalCoreCount === undefined)) { return 0; } else if (a.cpU_TotalCoreCount === null || a.cpU_TotalCoreCount === undefined) { return 1; } else if (b.cpU_TotalCoreCount === null || b.cpU_TotalCoreCount === undefined) { return -1; } else if (a.cpU_TotalCoreCount > b.cpU_TotalCoreCount) { return 1; } else if (a.cpU_TotalCoreCount < b.cpU_TotalCoreCount) { return -1; } else { return 0; } }); }
        else if (data === "mem_TotalSlotCount") { displayData.sort((a, b) => { if ((a.mem_TotalSlotCount === null || a.mem_TotalSlotCount === undefined) && (b.mem_TotalSlotCount === null || b.mem_TotalSlotCount === undefined)) { return 0; } else if (a.mem_TotalSlotCount === null || a.mem_TotalSlotCount === undefined) { return 1; } else if (b.mem_TotalSlotCount === null || b.mem_TotalSlotCount === undefined) { return -1; } else if (a.mem_TotalSlotCount > b.mem_TotalSlotCount) { return 1; } else if (a.mem_TotalSlotCount < b.mem_TotalSlotCount) { return -1; } else { return 0; } }); }
        else if (data === "mem_EA_1GB") { displayData.sort((a, b) => { if ((a.mem_EA_1GB === null || a.mem_EA_1GB === undefined) && (b.mem_EA_1GB === null || b.mem_EA_1GB === undefined)) { return 0; } else if (a.mem_EA_1GB === null || a.mem_EA_1GB === undefined) { return 1; } else if (b.mem_EA_1GB === null || b.mem_EA_1GB === undefined) { return -1; } else if (a.mem_EA_1GB > b.mem_EA_1GB) { return 1; } else if (a.mem_EA_1GB < b.mem_EA_1GB) { return -1; } else { return 0; } }); }
        else if (data === "mem_EA_2GB") { displayData.sort((a, b) => { if ((a.mem_EA_2GB === null || a.mem_EA_2GB === undefined) && (b.mem_EA_2GB === null || b.mem_EA_2GB === undefined)) { return 0; } else if (a.mem_EA_2GB === null || a.mem_EA_2GB === undefined) { return 1; } else if (b.mem_EA_2GB === null || b.mem_EA_2GB === undefined) { return -1; } else if (a.mem_EA_2GB > b.mem_EA_2GB) { return 1; } else if (a.mem_EA_2GB < b.mem_EA_2GB) { return -1; } else { return 0; } }); }
        else if (data === "mem_EA_4GB") { displayData.sort((a, b) => { if ((a.mem_EA_4GB === null || a.mem_EA_4GB === undefined) && (b.mem_EA_4GB === null || b.mem_EA_4GB === undefined)) { return 0; } else if (a.mem_EA_4GB === null || a.mem_EA_4GB === undefined) { return 1; } else if (b.mem_EA_4GB === null || b.mem_EA_4GB === undefined) { return -1; } else if (a.mem_EA_4GB > b.mem_EA_4GB) { return 1; } else if (a.mem_EA_4GB < b.mem_EA_4GB) { return -1; } else { return 0; } }); }
        else if (data === "mem_EA_8GB") { displayData.sort((a, b) => { if ((a.mem_EA_8GB === null || a.mem_EA_8GB === undefined) && (b.mem_EA_8GB === null || b.mem_EA_8GB === undefined)) { return 0; } else if (a.mem_EA_8GB === null || a.mem_EA_8GB === undefined) { return 1; } else if (b.mem_EA_8GB === null || b.mem_EA_8GB === undefined) { return -1; } else if (a.mem_EA_8GB > b.mem_EA_8GB) { return 1; } else if (a.mem_EA_8GB < b.mem_EA_8GB) { return -1; } else { return 0; } }); }
        else if (data === "mem_EA_16GB") { displayData.sort((a, b) => { if ((a.mem_EA_16GB === null || a.mem_EA_16GB === undefined) && (b.mem_EA_16GB === null || b.mem_EA_16GB === undefined)) { return 0; } else if (a.mem_EA_16GB === null || a.mem_EA_16GB === undefined) { return 1; } else if (b.mem_EA_16GB === null || b.mem_EA_16GB === undefined) { return -1; } else if (a.mem_EA_16GB > b.mem_EA_16GB) { return 1; } else if (a.mem_EA_16GB < b.mem_EA_16GB) { return -1; } else { return 0; } }); }
        else if (data === "mem_EA_32GB") { displayData.sort((a, b) => { if ((a.mem_EA_32GB === null || a.mem_EA_32GB === undefined) && (b.mem_EA_32GB === null || b.mem_EA_32GB === undefined)) { return 0; } else if (a.mem_EA_32GB === null || a.mem_EA_32GB === undefined) { return 1; } else if (b.mem_EA_32GB === null || b.mem_EA_32GB === undefined) { return -1; } else if (a.mem_EA_32GB > b.mem_EA_32GB) { return 1; } else if (a.mem_EA_32GB < b.mem_EA_32GB) { return -1; } else { return 0; } }); }
        else if (data === "mem_EA_64GB") { displayData.sort((a, b) => { if ((a.mem_EA_64GB === null || a.mem_EA_64GB === undefined) && (b.mem_EA_64GB === null || b.mem_EA_64GB === undefined)) { return 0; } else if (a.mem_EA_64GB === null || a.mem_EA_64GB === undefined) { return 1; } else if (b.mem_EA_64GB === null || b.mem_EA_64GB === undefined) { return -1; } else if (a.mem_EA_64GB > b.mem_EA_64GB) { return 1; } else if (a.mem_EA_64GB < b.mem_EA_64GB) { return -1; } else { return 0; } }); }
        else if (data === "mem_EA_128GB") { displayData.sort((a, b) => { if ((a.mem_EA_128GB === null || a.mem_EA_128GB === undefined) && (b.mem_EA_128GB === null || b.mem_EA_128GB === undefined)) { return 0; } else if (a.mem_EA_128GB === null || a.mem_EA_128GB === undefined) { return 1; } else if (b.mem_EA_128GB === null || b.mem_EA_128GB === undefined) { return -1; } else if (a.mem_EA_128GB > b.mem_EA_128GB) { return 1; } else if (a.mem_EA_128GB < b.mem_EA_128GB) { return -1; } else { return 0; } }); }
        else if (data === "mem_EA_256GB") { displayData.sort((a, b) => { if ((a.mem_EA_256GB === null || a.mem_EA_256GB === undefined) && (b.mem_EA_256GB === null || b.mem_EA_256GB === undefined)) { return 0; } else if (a.mem_EA_256GB === null || a.mem_EA_256GB === undefined) { return 1; } else if (b.mem_EA_256GB === null || b.mem_EA_256GB === undefined) { return -1; } else if (a.mem_EA_256GB > b.mem_EA_256GB) { return 1; } else if (a.mem_EA_256GB < b.mem_EA_256GB) { return -1; } else { return 0; } }); }
        else if (data === "mem_UseSlotCount") { displayData.sort((a, b) => { if ((a.mem_UseSlotCount === null || a.mem_UseSlotCount === undefined) && (b.mem_UseSlotCount === null || b.mem_UseSlotCount === undefined)) { return 0; } else if (a.mem_UseSlotCount === null || a.mem_UseSlotCount === undefined) { return 1; } else if (b.mem_UseSlotCount === null || b.mem_UseSlotCount === undefined) { return -1; } else if (a.mem_UseSlotCount > b.mem_UseSlotCount) { return 1; } else if (a.mem_UseSlotCount < b.mem_UseSlotCount) { return -1; } else { return 0; } }); }
        else if (data === "mem_MemoryCount") { displayData.sort((a, b) => { if ((a.mem_MemoryCount === null || a.mem_MemoryCount === undefined) && (b.mem_MemoryCount === null || b.mem_MemoryCount === undefined)) { return 0; } else if (a.mem_MemoryCount === null || a.mem_MemoryCount === undefined) { return 1; } else if (b.mem_MemoryCount === null || b.mem_MemoryCount === undefined) { return -1; } else if (a.mem_MemoryCount > b.mem_MemoryCount) { return 1; } else if (a.mem_MemoryCount < b.mem_MemoryCount) { return -1; } else { return 0; } }); }
        else if (data === "mem_TotalMemoryVolume") { displayData.sort((a, b) => { if ((a.mem_TotalMemoryVolume === null || a.mem_TotalMemoryVolume === undefined) && (b.mem_TotalMemoryVolume === null || b.mem_TotalMemoryVolume === undefined)) { return 0; } else if (a.mem_TotalMemoryVolume === null || a.mem_TotalMemoryVolume === undefined) { return 1; } else if (b.mem_TotalMemoryVolume === null || b.mem_TotalMemoryVolume === undefined) { return -1; } else if (a.mem_TotalMemoryVolume > b.mem_TotalMemoryVolume) { return 1; } else if (a.mem_TotalMemoryVolume < b.mem_TotalMemoryVolume) { return -1; } else { return 0; } }); }
        else if (data === "internal_InternalDiskVolumeGB") { displayData.sort((a, b) => { if ((a.internal_InternalDiskVolumeGB === null || a.internal_InternalDiskVolumeGB === undefined) && (b.internal_InternalDiskVolumeGB === null || b.internal_InternalDiskVolumeGB === undefined)) { return 0; } else if (a.internal_InternalDiskVolumeGB === null || a.internal_InternalDiskVolumeGB === undefined) { return 1; } else if (b.internal_InternalDiskVolumeGB === null || b.internal_InternalDiskVolumeGB === undefined) { return -1; } else if (a.internal_InternalDiskVolumeGB > b.internal_InternalDiskVolumeGB) { return 1; } else if (a.internal_InternalDiskVolumeGB < b.internal_InternalDiskVolumeGB) { return -1; } else { return 0; } }); }
        else if (data === "internal_InternalDiskCount") { displayData.sort((a, b) => { if ((a.internal_InternalDiskCount === null || a.internal_InternalDiskCount === undefined) && (b.internal_InternalDiskCount === null || b.internal_InternalDiskCount === undefined)) { return 0; } else if (a.internal_InternalDiskCount === null || a.internal_InternalDiskCount === undefined) { return 1; } else if (b.internal_InternalDiskCount === null || b.internal_InternalDiskCount === undefined) { return -1; } else if (a.internal_InternalDiskCount > b.internal_InternalDiskCount) { return 1; } else if (a.internal_InternalDiskCount < b.internal_InternalDiskCount) { return -1; } else { return 0; } }); }
        else if (data === "internal_InternalDiskUsableVolumeGB") { displayData.sort((a, b) => { if ((a.internal_InternalDiskUsableVolumeGB === null || a.internal_InternalDiskUsableVolumeGB === undefined) && (b.internal_InternalDiskUsableVolumeGB === null || b.internal_InternalDiskUsableVolumeGB === undefined)) { return 0; } else if (a.internal_InternalDiskUsableVolumeGB === null || a.internal_InternalDiskUsableVolumeGB === undefined) { return 1; } else if (b.internal_InternalDiskUsableVolumeGB === null || b.internal_InternalDiskUsableVolumeGB === undefined) { return -1; } else if (a.internal_InternalDiskUsableVolumeGB > b.internal_InternalDiskUsableVolumeGB) { return 1; } else if (a.internal_InternalDiskUsableVolumeGB < b.internal_InternalDiskUsableVolumeGB) { return -1; } else { return 0; } }); }
        else if (data === "internal_InternalDiskTotalSlotCount") { displayData.sort((a, b) => { if ((a.internal_InternalDiskTotalSlotCount === null || a.internal_InternalDiskTotalSlotCount === undefined) && (b.internal_InternalDiskTotalSlotCount === null || b.internal_InternalDiskTotalSlotCount === undefined)) { return 0; } else if (a.internal_InternalDiskTotalSlotCount === null || a.internal_InternalDiskTotalSlotCount === undefined) { return 1; } else if (b.internal_InternalDiskTotalSlotCount === null || b.internal_InternalDiskTotalSlotCount === undefined) { return -1; } else if (a.internal_InternalDiskTotalSlotCount > b.internal_InternalDiskTotalSlotCount) { return 1; } else if (a.internal_InternalDiskTotalSlotCount < b.internal_InternalDiskTotalSlotCount) { return -1; } else { return 0; } }); }
        else if (data === "internal_InternalDiskUseSlot") { displayData.sort((a, b) => { if ((a.internal_InternalDiskUseSlot === null || a.internal_InternalDiskUseSlot === undefined) && (b.internal_InternalDiskUseSlot === null || b.internal_InternalDiskUseSlot === undefined)) { return 0; } else if (a.internal_InternalDiskUseSlot === null || a.internal_InternalDiskUseSlot === undefined) { return 1; } else if (b.internal_InternalDiskUseSlot === null || b.internal_InternalDiskUseSlot === undefined) { return -1; } else if (a.internal_InternalDiskUseSlot > b.internal_InternalDiskUseSlot) { return 1; } else if (a.internal_InternalDiskUseSlot < b.internal_InternalDiskUseSlot) { return -1; } else { return 0; } }); }
        else if (data === "internal_InternalDiskRaidType") { displayData.sort((a, b) => { if ((a.internal_InternalDiskRaidType === null || a.internal_InternalDiskRaidType === undefined) && (b.internal_InternalDiskRaidType === null || b.internal_InternalDiskRaidType === undefined)) { return 0; } else if (a.internal_InternalDiskRaidType === null || a.internal_InternalDiskRaidType === undefined) { return 1; } else if (b.internal_InternalDiskRaidType === null || b.internal_InternalDiskRaidType === undefined) { return -1; } else if (a.internal_InternalDiskRaidType?.toLowerCase() > b.internal_InternalDiskRaidType?.toLowerCase()) { return 1; } else if (a.internal_InternalDiskRaidType?.toLowerCase() < b.internal_InternalDiskRaidType?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "internal_InternalDiskSizeGB") { displayData.sort((a, b) => { if ((a.internal_InternalDiskSizeGB === null || a.internal_InternalDiskSizeGB === undefined) && (b.internal_InternalDiskSizeGB === null || b.internal_InternalDiskSizeGB === undefined)) { return 0; } else if (a.internal_InternalDiskSizeGB === null || a.internal_InternalDiskSizeGB === undefined) { return 1; } else if (b.internal_InternalDiskSizeGB === null || b.internal_InternalDiskSizeGB === undefined) { return -1; } else if (a.internal_InternalDiskSizeGB > b.internal_InternalDiskSizeGB) { return 1; } else if (a.internal_InternalDiskSizeGB < b.internal_InternalDiskSizeGB) { return -1; } else { return 0; } }); }
        else if (data === "external_ExternalDiskCompanyName") { displayData.sort((a, b) => { if ((a.external_ExternalDiskCompanyName === null || a.external_ExternalDiskCompanyName === undefined) && (b.external_ExternalDiskCompanyName === null || b.external_ExternalDiskCompanyName === undefined)) { return 0; } else if (a.external_ExternalDiskCompanyName === null || a.external_ExternalDiskCompanyName === undefined) { return 1; } else if (b.external_ExternalDiskCompanyName === null || b.external_ExternalDiskCompanyName === undefined) { return -1; } else if (a.external_ExternalDiskCompanyName?.toLowerCase() > b.external_ExternalDiskCompanyName?.toLowerCase()) { return 1; } else if (a.external_ExternalDiskCompanyName?.toLowerCase() < b.external_ExternalDiskCompanyName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "external_ExternalDiskModel") { displayData.sort((a, b) => { if ((a.external_ExternalDiskModel === null || a.external_ExternalDiskModel === undefined) && (b.external_ExternalDiskModel === null || b.external_ExternalDiskModel === undefined)) { return 0; } else if (a.external_ExternalDiskModel === null || a.external_ExternalDiskModel === undefined) { return 1; } else if (b.external_ExternalDiskModel === null || b.external_ExternalDiskModel === undefined) { return -1; } else if (a.external_ExternalDiskModel?.toLowerCase() > b.external_ExternalDiskModel?.toLowerCase()) { return 1; } else if (a.external_ExternalDiskModel?.toLowerCase() < b.external_ExternalDiskModel?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "external_ExternalDiskRaidType") { displayData.sort((a, b) => { if ((a.external_ExternalDiskRaidType === null || a.external_ExternalDiskRaidType === undefined) && (b.external_ExternalDiskRaidType === null || b.external_ExternalDiskRaidType === undefined)) { return 0; } else if (a.external_ExternalDiskRaidType === null || a.external_ExternalDiskRaidType === undefined) { return 1; } else if (b.external_ExternalDiskRaidType === null || b.external_ExternalDiskRaidType === undefined) { return -1; } else if (a.external_ExternalDiskRaidType?.toLowerCase() > b.external_ExternalDiskRaidType?.toLowerCase()) { return 1; } else if (a.external_ExternalDiskRaidType?.toLowerCase() < b.external_ExternalDiskRaidType?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "external_ExternalDiskSizeGB") { displayData.sort((a, b) => { if ((a.external_ExternalDiskSizeGB === null || a.external_ExternalDiskSizeGB === undefined) && (b.external_ExternalDiskSizeGB === null || b.external_ExternalDiskSizeGB === undefined)) { return 0; } else if (a.external_ExternalDiskSizeGB === null || a.external_ExternalDiskSizeGB === undefined) { return 1; } else if (b.external_ExternalDiskSizeGB === null || b.external_ExternalDiskSizeGB === undefined) { return -1; } else if (a.external_ExternalDiskSizeGB > b.external_ExternalDiskSizeGB) { return 1; } else if (a.external_ExternalDiskSizeGB < b.external_ExternalDiskSizeGB) { return -1; } else { return 0; } }); }
        else if (data === "external_ExternalDiskMultiPathSolution") { displayData.sort((a, b) => { if ((a.external_ExternalDiskMultiPathSolution === null || a.external_ExternalDiskMultiPathSolution === undefined) && (b.external_ExternalDiskMultiPathSolution === null || b.external_ExternalDiskMultiPathSolution === undefined)) { return 0; } else if (a.external_ExternalDiskMultiPathSolution === null || a.external_ExternalDiskMultiPathSolution === undefined) { return 1; } else if (b.external_ExternalDiskMultiPathSolution === null || b.external_ExternalDiskMultiPathSolution === undefined) { return -1; } else if (a.external_ExternalDiskMultiPathSolution?.toLowerCase() > b.external_ExternalDiskMultiPathSolution?.toLowerCase()) { return 1; } else if (a.external_ExternalDiskMultiPathSolution?.toLowerCase() < b.external_ExternalDiskMultiPathSolution?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "pS_PowerSupplyCount") { displayData.sort((a, b) => { if ((a.pS_PowerSupplyCount === null || a.pS_PowerSupplyCount === undefined) && (b.pS_PowerSupplyCount === null || b.pS_PowerSupplyCount === undefined)) { return 0; } else if (a.pS_PowerSupplyCount === null || a.pS_PowerSupplyCount === undefined) { return 1; } else if (b.pS_PowerSupplyCount === null || b.pS_PowerSupplyCount === undefined) { return -1; } else if (a.pS_PowerSupplyCount > b.pS_PowerSupplyCount) { return 1; } else if (a.pS_PowerSupplyCount < b.pS_PowerSupplyCount) { return -1; } else { return 0; } }); }
        else if (data === "pS_PowerSupplyVolumeW") { displayData.sort((a, b) => { if ((a.pS_PowerSupplyVolumeW === null || a.pS_PowerSupplyVolumeW === undefined) && (b.pS_PowerSupplyVolumeW === null || b.pS_PowerSupplyVolumeW === undefined)) { return 0; } else if (a.pS_PowerSupplyVolumeW === null || a.pS_PowerSupplyVolumeW === undefined) { return 1; } else if (b.pS_PowerSupplyVolumeW === null || b.pS_PowerSupplyVolumeW === undefined) { return -1; } else if (a.pS_PowerSupplyVolumeW?.toLowerCase() > b.pS_PowerSupplyVolumeW?.toLowerCase()) { return 1; } else if (a.pS_PowerSupplyVolumeW?.toLowerCase() < b.pS_PowerSupplyVolumeW?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "pS_PowerSupplyPduDual") { displayData.sort((a, b) => { if ((a.pS_PowerSupplyPduDual === null || a.pS_PowerSupplyPduDual === undefined) && (b.pS_PowerSupplyPduDual === null || b.pS_PowerSupplyPduDual === undefined)) { return 0; } else if (a.pS_PowerSupplyPduDual === null || a.pS_PowerSupplyPduDual === undefined) { return 1; } else if (b.pS_PowerSupplyPduDual === null || b.pS_PowerSupplyPduDual === undefined) { return -1; } else if (a.pS_PowerSupplyPduDual > b.pS_PowerSupplyPduDual) { return 1; } else if (a.pS_PowerSupplyPduDual < b.pS_PowerSupplyPduDual) { return -1; } else { return 0; } }); }
        else if (data === "pS_PowerSupplyRackPowerDual") { displayData.sort((a, b) => { if ((a.pS_PowerSupplyRackPowerDual === null || a.pS_PowerSupplyRackPowerDual === undefined) && (b.pS_PowerSupplyRackPowerDual === null || b.pS_PowerSupplyRackPowerDual === undefined)) { return 0; } else if (a.pS_PowerSupplyRackPowerDual === null || a.pS_PowerSupplyRackPowerDual === undefined) { return 1; } else if (b.pS_PowerSupplyRackPowerDual === null || b.pS_PowerSupplyRackPowerDual === undefined) { return -1; } else if (a.pS_PowerSupplyRackPowerDual > b.pS_PowerSupplyRackPowerDual) { return 1; } else if (a.pS_PowerSupplyRackPowerDual < b.pS_PowerSupplyRackPowerDual) { return -1; } else { return 0; } }); }
        else if (data === "fan_FanCount") { displayData.sort((a, b) => { if ((a.fan_FanCount === null || a.fan_FanCount === undefined) && (b.fan_FanCount === null || b.fan_FanCount === undefined)) { return 0; } else if (a.fan_FanCount === null || a.fan_FanCount === undefined) { return 1; } else if (b.fan_FanCount === null || b.fan_FanCount === undefined) { return -1; } else if (a.fan_FanCount > b.fan_FanCount) { return 1; } else if (a.fan_FanCount < b.fan_FanCount) { return -1; } else { return 0; } }); }
        else if (data === "fan_FanDual") { displayData.sort((a, b) => { if ((a.fan_FanDual === null || a.fan_FanDual === undefined) && (b.fan_FanDual === null || b.fan_FanDual === undefined)) { return 0; } else if (a.fan_FanDual === null || a.fan_FanDual === undefined) { return 1; } else if (b.fan_FanDual === null || b.fan_FanDual === undefined) { return -1; } else if (a.fan_FanDual > b.fan_FanDual) { return 1; } else if (a.fan_FanDual < b.fan_FanDual) { return -1; } else { return 0; } }); }
        else if (data === "nic_NicSpeed") { displayData.sort((a, b) => { if ((a.nic_NicSpeed === null || a.nic_NicSpeed === undefined) && (b.nic_NicSpeed === null || b.nic_NicSpeed === undefined)) { return 0; } else if (a.nic_NicSpeed === null || a.nic_NicSpeed === undefined) { return 1; } else if (b.nic_NicSpeed === null || b.nic_NicSpeed === undefined) { return -1; } else if (a.nic_NicSpeed?.toLowerCase() > b.nic_NicSpeed?.toLowerCase()) { return 1; } else if (a.nic_NicSpeed?.toLowerCase() < b.nic_NicSpeed?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "nic_NicType") { displayData.sort((a, b) => { if ((a.nic_NicType === null || a.nic_NicType === undefined) && (b.nic_NicType === null || b.nic_NicType === undefined)) { return 0; } else if (a.nic_NicType === null || a.nic_NicType === undefined) { return 1; } else if (b.nic_NicType === null || b.nic_NicType === undefined) { return -1; } else if (a.nic_NicType?.toLowerCase() > b.nic_NicType?.toLowerCase()) { return 1; } else if (a.nic_NicType?.toLowerCase() < b.nic_NicType?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "nic_NicPort") { displayData.sort((a, b) => { if ((a.nic_NicPort === null || a.nic_NicPort === undefined) && (b.nic_NicPort === null || b.nic_NicPort === undefined)) { return 0; } else if (a.nic_NicPort === null || a.nic_NicPort === undefined) { return 1; } else if (b.nic_NicPort === null || b.nic_NicPort === undefined) { return -1; } else if (a.nic_NicPort?.toLowerCase() > b.nic_NicPort?.toLowerCase()) { return 1; } else if (a.nic_NicPort?.toLowerCase() < b.nic_NicPort?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "nic_NicCount") { displayData.sort((a, b) => { if ((a.nic_NicCount === null || a.nic_NicCount === undefined) && (b.nic_NicCount === null || b.nic_NicCount === undefined)) { return 0; } else if (a.nic_NicCount === null || a.nic_NicCount === undefined) { return 1; } else if (b.nic_NicCount === null || b.nic_NicCount === undefined) { return -1; } else if (a.nic_NicCount > b.nic_NicCount) { return 1; } else if (a.nic_NicCount < b.nic_NicCount) { return -1; } else { return 0; } }); }
        else if (data === "nic_NicUsePortCount") { displayData.sort((a, b) => { if ((a.nic_NicUsePortCount === null || a.nic_NicUsePortCount === undefined) && (b.nic_NicUsePortCount === null || b.nic_NicUsePortCount === undefined)) { return 0; } else if (a.nic_NicUsePortCount === null || a.nic_NicUsePortCount === undefined) { return 1; } else if (b.nic_NicUsePortCount === null || b.nic_NicUsePortCount === undefined) { return -1; } else if (a.nic_NicUsePortCount > b.nic_NicUsePortCount) { return 1; } else if (a.nic_NicUsePortCount < b.nic_NicUsePortCount) { return -1; } else { return 0; } }); }
        else if (data === "nic_OnboardNicPortCount") { displayData.sort((a, b) => { if ((a.nic_OnboardNicPortCount === null || a.nic_OnboardNicPortCount === undefined) && (b.nic_OnboardNicPortCount === null || b.nic_OnboardNicPortCount === undefined)) { return 0; } else if (a.nic_OnboardNicPortCount === null || a.nic_OnboardNicPortCount === undefined) { return 1; } else if (b.nic_OnboardNicPortCount === null || b.nic_OnboardNicPortCount === undefined) { return -1; } else if (a.nic_OnboardNicPortCount > b.nic_OnboardNicPortCount) { return 1; } else if (a.nic_OnboardNicPortCount < b.nic_OnboardNicPortCount) { return -1; } else { return 0; } }); }
        else if (data === "nic_OnboardNicUsePortCount") { displayData.sort((a, b) => { if ((a.nic_OnboardNicUsePortCount === null || a.nic_OnboardNicUsePortCount === undefined) && (b.nic_OnboardNicUsePortCount === null || b.nic_OnboardNicUsePortCount === undefined)) { return 0; } else if (a.nic_OnboardNicUsePortCount === null || a.nic_OnboardNicUsePortCount === undefined) { return 1; } else if (b.nic_OnboardNicUsePortCount === null || b.nic_OnboardNicUsePortCount === undefined) { return -1; } else if (a.nic_OnboardNicUsePortCount > b.nic_OnboardNicUsePortCount) { return 1; } else if (a.nic_OnboardNicUsePortCount < b.nic_OnboardNicUsePortCount) { return -1; } else { return 0; } }); }
        else if (data === "nic_HBASpeed") { displayData.sort((a, b) => { if ((a.nic_HBASpeed === null || a.nic_HBASpeed === undefined) && (b.nic_HBASpeed === null || b.nic_HBASpeed === undefined)) { return 0; } else if (a.nic_HBASpeed === null || a.nic_HBASpeed === undefined) { return 1; } else if (b.nic_HBASpeed === null || b.nic_HBASpeed === undefined) { return -1; } else if (a.nic_HBASpeed?.toLowerCase() > b.nic_HBASpeed?.toLowerCase()) { return 1; } else if (a.nic_HBASpeed?.toLowerCase() < b.nic_HBASpeed?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "nic_HBAType") { displayData.sort((a, b) => { if ((a.nic_HBAType === null || a.nic_HBAType === undefined) && (b.nic_HBAType === null || b.nic_HBAType === undefined)) { return 0; } else if (a.nic_HBAType === null || a.nic_HBAType === undefined) { return 1; } else if (b.nic_HBAType === null || b.nic_HBAType === undefined) { return -1; } else if (a.nic_HBAType?.toLowerCase() > b.nic_HBAType?.toLowerCase()) { return 1; } else if (a.nic_HBAType?.toLowerCase() < b.nic_HBAType?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "nic_HBAPort") { displayData.sort((a, b) => { if ((a.nic_HBAPort === null || a.nic_HBAPort === undefined) && (b.nic_HBAPort === null || b.nic_HBAPort === undefined)) { return 0; } else if (a.nic_HBAPort === null || a.nic_HBAPort === undefined) { return 1; } else if (b.nic_HBAPort === null || b.nic_HBAPort === undefined) { return -1; } else if (a.nic_HBAPort?.toLowerCase() > b.nic_HBAPort?.toLowerCase()) { return 1; } else if (a.nic_HBAPort?.toLowerCase() < b.nic_HBAPort?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "nic_HBACount") { displayData.sort((a, b) => { if ((a.nic_HBACount === null || a.nic_HBACount === undefined) && (b.nic_HBACount === null || b.nic_HBACount === undefined)) { return 0; } else if (a.nic_HBACount === null || a.nic_HBACount === undefined) { return 1; } else if (b.nic_HBACount === null || b.nic_HBACount === undefined) { return -1; } else if (a.nic_HBACount > b.nic_HBACount) { return 1; } else if (a.nic_HBACount < b.nic_HBACount) { return -1; } else { return 0; } }); }
        else if (data === "nic_UsingHBAPortCount") { displayData.sort((a, b) => { if ((a.nic_UsingHBAPortCount === null || a.nic_UsingHBAPortCount === undefined) && (b.nic_UsingHBAPortCount === null || b.nic_UsingHBAPortCount === undefined)) { return 0; } else if (a.nic_UsingHBAPortCount === null || a.nic_UsingHBAPortCount === undefined) { return 1; } else if (b.nic_UsingHBAPortCount === null || b.nic_UsingHBAPortCount === undefined) { return -1; } else if (a.nic_UsingHBAPortCount > b.nic_UsingHBAPortCount) { return 1; } else if (a.nic_UsingHBAPortCount < b.nic_UsingHBAPortCount) { return -1; } else { return 0; } }); }
        else if (data === "nW_ManageIPAddr") { displayData.sort((a, b) => { if ((a.nW_ManageIPAddr === null || a.nW_ManageIPAddr === undefined) && (b.nW_ManageIPAddr === null || b.nW_ManageIPAddr === undefined)) { return 0; } else if (a.nW_ManageIPAddr === null || a.nW_ManageIPAddr === undefined) { return 1; } else if (b.nW_ManageIPAddr === null || b.nW_ManageIPAddr === undefined) { return -1; } else if (a.nW_ManageIPAddr?.toLowerCase() > b.nW_ManageIPAddr?.toLowerCase()) { return 1; } else if (a.nW_ManageIPAddr?.toLowerCase() < b.nW_ManageIPAddr?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "nW_IPAddr2") { displayData.sort((a, b) => { if ((a.nW_IPAddr2 === null || a.nW_IPAddr2 === undefined) && (b.nW_IPAddr2 === null || b.nW_IPAddr2 === undefined)) { return 0; } else if (a.nW_IPAddr2 === null || a.nW_IPAddr2 === undefined) { return 1; } else if (b.nW_IPAddr2 === null || b.nW_IPAddr2 === undefined) { return -1; } else if (a.nW_IPAddr2?.toLowerCase() > b.nW_IPAddr2?.toLowerCase()) { return 1; } else if (a.nW_IPAddr2?.toLowerCase() < b.nW_IPAddr2?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "nW_IPAddr3") { displayData.sort((a, b) => { if ((a.nW_IPAddr3 === null || a.nW_IPAddr3 === undefined) && (b.nW_IPAddr3 === null || b.nW_IPAddr3 === undefined)) { return 0; } else if (a.nW_IPAddr3 === null || a.nW_IPAddr3 === undefined) { return 1; } else if (b.nW_IPAddr3 === null || b.nW_IPAddr3 === undefined) { return -1; } else if (a.nW_IPAddr3?.toLowerCase() > b.nW_IPAddr3?.toLowerCase()) { return 1; } else if (a.nW_IPAddr3?.toLowerCase() < b.nW_IPAddr3?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "nW_IPAddr4") { displayData.sort((a, b) => { if ((a.nW_IPAddr4 === null || a.nW_IPAddr4 === undefined) && (b.nW_IPAddr4 === null || b.nW_IPAddr4 === undefined)) { return 0; } else if (a.nW_IPAddr4 === null || a.nW_IPAddr4 === undefined) { return 1; } else if (b.nW_IPAddr4 === null || b.nW_IPAddr4 === undefined) { return -1; } else if (a.nW_IPAddr4?.toLowerCase() > b.nW_IPAddr4?.toLowerCase()) { return 1; } else if (a.nW_IPAddr4?.toLowerCase() < b.nW_IPAddr4?.toLowerCase()) { return -1; } else { return 0; } }); }



        this.setState({ sortString: data });
    }

    clearAllCheck() {
        if (this.refAllCheck.current) {
            this.refAllCheck.current.checked = false;
        }
    }

    getItemData() {
        const itemDatas = this.props.itemData ? [...this.props.itemData] : [];

        const addedDatas = [...this.props.addedDatas];
        const addedCount = addedDatas.length;

        for (let i = addedCount - 1; i >= 0; i--) {
            const addedData = addedDatas[i];
            itemDatas.unshift(addedData);
        }

        const count = itemDatas.length;

        for (let i = 0; i < count; i++) {
            const itemData = itemDatas[i];

            if (!itemData.basic_Name || itemData.basic_Name.trim().length === 0) {
                return [null, `No(${i+1}) Box명은 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.basic_ItemLevel || itemData.basic_ItemLevel.trim().length === 0) {
                return [null, `No(${i+1}) Box등급은 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.basic_Company || itemData.basic_Company.trim().length === 0) {
                return [null, `No(${i+1}) Box제조사는 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.basic_ModelName || itemData.basic_ModelName.trim().length === 0) {
                return [null, `No(${i+1}) Box모델명은 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.basic_Status || itemData.basic_Status.trim().length === 0) {
                return [null, `No(${i+1}) 상태는 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.basic_Usage || itemData.basic_Usage.trim().length === 0) {
                return [null, `No(${i+1}) 용도는 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.cpU_ModelName || itemData.cpU_ModelName.trim().length === 0) {
                return [null, `No(${i+1}) 모델명은 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.cpU_ClockSpeed || itemData.cpU_ClockSpeed.trim().length === 0) {
                return [null, `No(${i+1}) Clock Speed는 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (itemData.cpU_TotalCoreCount === null) {
                return [null, `No(${i+1}) 총 Core 수는 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (itemData.mem_TotalMemoryVolume === null) {
                return [null, `No(${i+1}) 총 Memory 용량은 필수요소입니다. 비워둘수 없습니다.`, null];
            }
        }

        return [itemDatas, null, InventoryManagement.itemType.Box];
    }

    render() {
        if (this.props.hasNewRow() && this.props.addedDatas.length > 0) {
            this.needRefresh = true;
            return (
                <></>
            );

        }
        const [tableDataUI1, tableDataUI2, tableDataUI3, tableDataUI4, tableDataUI5, tableDataUI6, tableDataUI7] = this.getTableDataUI2();

        return (
            <>
                <div className={main.boxTable}>
                    <table ref={this.refTable1} border="1" style={{ minWidth: '8%' }}>
                        <thead>
                            <tr style={{ height: '78px' }}>
                                <th><div className={main.editFlex}><span>전체</span><span><input ref={this.refAllCheck} type="checkBox" id="allCheck" onChange={(e) => this.onChangeAllCheck(e.target)} /></span></div></th>
                                <th style={{ padding: '0px 15px' }}>No</th>
                                <th style={{ position: 'relative' }}><span className={main.essentialBorder}></span>Box명<span className={main.bottomArrowIcon} onClick={() => this.onClickSort("basic_Name")}></span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableDataUI1}
                        </tbody>
                    </table>
                    <table ref={this.refTable2} border="1" className="generalTable" style={{ minWidth: '140%' }}>
                        <thead>
                            <tr>
                                <th colspan="21">기본정보<span className={main.gleftArrowIcon} onClick={() => this.props.onClickCheck("generalCheckbox")}></span></th>
                            </tr>
                            <tr>
                                <td rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span><p id="tableText">Box등급<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_ItemLevel")}></span></p></td>
                                <td rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span><p id="tableText">Box제조사<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_Company")}></span></p></td>
                                <td rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span><p id="tableText">Box모델명<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_ModelName")}></span></p></td>
                                <td rowspan="2"><p id="tableText">장비구분<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_EquipType")}></span></p></td>
                                <td rowspan="2"><p id="tableText">시리얼번호<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_SerialNumber")}></span></p></td>
                                <td><p id="tableText">자산구분<span className={main.leftArrowIcon}></span></p></td>
                                <td rowspan="2"><p id="tableText">입고일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_ReceiveDate")}></span></p></td>
                                <td rowspan="2"><p id="tableText">설치일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_RegDate")}></span></p></td>
                                <td rowspan="2"><p id="tableText">주관부서<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_OwnDepartment")}></span></p></td>
                                <td rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span><p id="tableText">상태<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_Status")}></span></p></td>
                                <td rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span><p id="tableText">용도<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_Usage")}></span></p></td>
                                <td colspan="2"><p id="tableText">담당자<span className={main.leftArrowIcon}></span></p></td>
                                <td rowspan="2"><p id="tableText">파티션 가능유무<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_PartitionAble")}></span></p></td>
                                <td rowspan="2"><p id="tableText">파티션 명<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_PartitionName")}></span></p></td>
                                <td rowspan="2"><p id="tableText">도입년차(년)<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_ReceiveYears")}></span></p></td>
                                <td colspan="2"><p id="tableText">위치<span className={main.leftArrowIcon}></span></p></td>
                                <td rowspan="2"><p id="tableText">운영부서<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_OperationDepartment")}></span></p></td>
                                <td rowspan="2"><p id="tableText">폐기일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_DiscardDate")}></span></p></td>
                                <td rowspan="2"><p id="tableText">사용년한 초과여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_OverUsedYear")}></span></p></td>
                            </tr>
                            <tr>
                                <td><p id="tableText">자산소유고객사명<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_PropertyType")}></span></p></td>
                                <td><p id="tableText">관리담당자<span className={main.downArrowIcon} onClick={() => this.onClickSort("manage_SuperviseManager")}></span></p></td>
                                <td><p id="tableText">운영담당자<span className={main.downArrowIcon} onClick={() => this.onClickSort("manage_OperationManager")}></span></p></td>
                                <td><p id="tableText">설치지역/단위동<span className={main.downArrowIcon} onClick={() => this.onClickSort("position_InstallRegion")}></span></p></td>
                                <td><p id="tableText">랙/상세위치<span className={main.downArrowIcon} onClick={() => this.onClickSort("position_RackDetailPosition")}></span></p></td>
                            </tr>
                        </thead>
                        <tbody>
                            {tableDataUI2}
                        </tbody>
                    </table>
                    {/* <div className={main.generalBtnBox} onClick={() => this.props.onClickCheck("generalCheckbox")}>
                        <span className={main.gleftArrowIcon}></span>
                    </div> */}
                    <table ref={this.refTable3} border="1" className="maintenanceTable" style={{ minWidth: '60%' }}>
                        <thead>
                            <tr>
                                <th colspan="10">유지보수정보<span className={main.mleftArrowIcon} onClick={() => this.props.onClickCheck("maintenanceCheckbox")}></span></th>
                            </tr>
                            <tr style={{ height: '52px' }}>
                                <th>Warranty기간<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_WarrantyMonth")}></span></th>
                                <th>Warranty 만료일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_WarrantyExpiredDate")}></span></th>
                                <th>EOL Date<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_EOLDate")}></span></th>
                                <th>EOSL Date<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_EOSLDate")}></span></th>
                                <th>EOSL 여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_EOSL")}></span></th>
                                <th>유지보수 여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_MaintenanceContract")}></span></th>
                                <th>유지보수업체<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_MaintenanceCompanyName")}></span></th>
                                <th>유지보수 시작 일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_MaintenanceBeginDate")}></span></th>
                                <th>유지보수 종료 일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_MaintenanceEndDate")}></span></th>
                                <th>공급업체<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_ProvideCompanyName")}></span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableDataUI3}
                        </tbody>
                    </table>
                    {/* <div className={main.maintenanceBtnBox} onClick={() => this.props.onClickCheck("maintenanceCheckbox")}>
                        <span className={main.mleftArrowIcon}></span>
                    </div> */}
                    <table ref={this.refTable4} border="1" className="hardwareTable" style={{ minWidth: '440%', textAlign: 'center' }}>
                        <thead>
                            <tr>
                                <th colspan="54">하드웨어정보<span className={main.hleftArrowIcon} onClick={() => this.props.onClickCheck("hardwareCheckbox")}></span></th>
                            </tr>
                            <tr>
                                <th rowspan="2">Box파티션구분<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_BoxPartitionType")}></span></th>
                                <th rowspan="2">Power이중화여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_PowerDual")}></span></th>
                                <th rowspan="2">콘솔유무<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_ConsoleUse")}></span></th>
                                <th colspan="8">CPU<span className={main.leftArrowIcon}></span></th>
                                <th colspan="13">Memory<span className={main.leftArrowIcon}></span></th>
                                <th colspan="7">Internal DISK<span className={main.leftArrowIcon}></span></th>
                                <th colspan="5">External DISK<span className={main.leftArrowIcon}></span></th>
                                <th colspan="4">Power Supply<span className={main.leftArrowIcon}></span></th>
                                <th colspan="2">FAN<span className={main.leftArrowIcon}></span></th>
                                <th colspan="12">Network Card<span className={main.leftArrowIcon}></span></th>
                            </tr>
                            <tr>
                                <th style={{ position: 'relative' }}><span className={main.essentialBorder}></span>모델명<span className={main.downArrowIcon} onClick={() => this.onClickSort("cpU_ModelName")}></span></th>
                                <th style={{ position: 'relative' }}><span className={main.essentialBorder}></span>Clock Speed<span className={main.downArrowIcon} onClick={() => this.onClickSort("cpU_ClockSpeed")}></span></th>
                                <th>Socket수<span className={main.downArrowIcon} onClick={() => this.onClickSort("cpU_SocketCount")}></span></th>
                                <th>CPU당 Core수<span className={main.downArrowIcon} onClick={() => this.onClickSort("cpU_CoreCountPerCPU")}></span></th>
                                <th>전체 slot 수<span className={main.downArrowIcon} onClick={() => this.onClickSort("cpU_TotalSlotCount")}></span></th>
                                <th>사용 slot 수<span className={main.downArrowIcon} onClick={() => this.onClickSort("cpU_UseSlotCount")}></span></th>
                                <th>HT 지원유무<span className={main.downArrowIcon} onClick={() => this.onClickSort("cpU_HTUse")}></span></th>
                                <th style={{ position: 'relative' }}><span className={main.essentialBorder}></span>총 Core 수<span className={main.downArrowIcon} onClick={() => this.onClickSort("cpU_TotalCoreCount")}></span></th>

                                <th>전체 Slot수<span className={main.downArrowIcon} onClick={() => this.onClickSort("mem_TotalSlotCount")}></span></th>
                                <th>1GB (EA)<span className={main.downArrowIcon} onClick={() => this.onClickSort("mem_EA_1GB")}></span></th>
                                <th>2GB (EA)<span className={main.downArrowIcon} onClick={() => this.onClickSort("mem_EA_2GB")}></span></th>
                                <th>4GB (EA)<span className={main.downArrowIcon} onClick={() => this.onClickSort("mem_EA_4GB")}></span></th>
                                <th>8GB (EA)<span className={main.downArrowIcon} onClick={() => this.onClickSort("mem_EA_8GB")}></span></th>
                                <th>16GB (EA)<span className={main.downArrowIcon} onClick={() => this.onClickSort("mem_EA_16GB")}></span></th>
                                <th>32GB (EA)<span className={main.downArrowIcon} onClick={() => this.onClickSort("mem_EA_32GB")}></span></th>
                                <th>64GB (EA)<span className={main.downArrowIcon} onClick={() => this.onClickSort("mem_EA_64GB")}></span></th>
                                <th>128GB (EA)<span className={main.downArrowIcon} onClick={() => this.onClickSort("mem_EA_128GB")}></span></th>
                                <th>256GB (EA)<span className={main.downArrowIcon} onClick={() => this.onClickSort("mem_EA_256GB")}></span></th>
                                <th>사용Slot수<span className={main.downArrowIcon} onClick={() => this.onClickSort("mem_UseSlotCount")}></span></th>
                                <th>Memory 수<span className={main.downArrowIcon} onClick={() => this.onClickSort("mem_MemoryCount")}></span></th>
                                <th style={{ position: 'relative' }}><span className={main.essentialBorder}></span>총 Memory 용량<span className={main.downArrowIcon} onClick={() => this.onClickSort("mem_TotalMemoryVolume")}></span></th>

                                <th>Internal Disk용량(GB)<span className={main.downArrowIcon} onClick={() => this.onClickSort("internal_InternalDiskVolumeGB")}></span></th>
                                <th>Internal Disk수<span className={main.downArrowIcon} onClick={() => this.onClickSort("internal_InternalDiskCount")}></span></th>
                                <th>Internal Disk Usable Disk용량(GB)<span className={main.downArrowIcon} onClick={() => this.onClickSort("internal_InternalDiskUsableVolumeGB")}></span></th>
                                <th>Internal Disk 전체 slot 수<span className={main.downArrowIcon} onClick={() => this.onClickSort("internal_InternalDiskTotalSlotCount")}></span></th>
                                <th>Internal Disk 사용 slot 수<span className={main.downArrowIcon} onClick={() => this.onClickSort("internal_InternalDiskUseSlot")}></span></th>
                                <th>Internal Disk RAID 종류<span className={main.downArrowIcon} onClick={() => this.onClickSort("internal_InternalDiskRaidType")}></span></th>
                                <th>Internal Disk Size(GB)<span className={main.downArrowIcon} onClick={() => this.onClickSort("internal_InternalDiskSizeGB")}></span></th>

                                <th>External DISK 제조사<span className={main.downArrowIcon} onClick={() => this.onClickSort("external_ExternalDiskCompanyName")}></span></th>
                                <th>External DISK 모델<span className={main.downArrowIcon} onClick={() => this.onClickSort("external_ExternalDiskModel")}></span></th>
                                <th>External DISK RAID 종류<span className={main.downArrowIcon} onClick={() => this.onClickSort("external_ExternalDiskRaidType")}></span></th>
                                <th>External DISK Size(GB)<span className={main.downArrowIcon} onClick={() => this.onClickSort("external_ExternalDiskSizeGB")}></span></th>
                                <th>External DISK MultiPath 솔루션<span className={main.downArrowIcon} onClick={() => this.onClickSort("external_ExternalDiskMultiPathSolution")}></span></th>

                                <th>Power Supply 개수<span className={main.downArrowIcon} onClick={() => this.onClickSort("pS_PowerSupplyCount")}></span></th>
                                <th>Power Supply 용량(W)<span className={main.downArrowIcon} onClick={() => this.onClickSort("pS_PowerSupplyVolumeW")}></span></th>
                                <th>Power Supply PDU 이중화 여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("pS_PowerSupplyPduDual")}></span></th>
                                <th>Power Supply RACK 전원 이중화 여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("pS_PowerSupplyRackPowerDual")}></span></th>

                                <th>FAN 개수<span className={main.downArrowIcon} onClick={() => this.onClickSort("fan_FanCount")}></span></th>
                                <th>FAN 이중화 유무<span className={main.downArrowIcon} onClick={() => this.onClickSort("fan_FanDual")}></span></th>

                                <th>NIC속도<span className={main.downArrowIcon} onClick={() => this.onClickSort("nic_NicSpeed")}></span></th>
                                <th>NIC타입<span className={main.downArrowIcon} onClick={() => this.onClickSort("nic_NicType")}></span></th>
                                <th>NIC포트<span className={main.downArrowIcon} onClick={() => this.onClickSort("nic_NicPort")}></span></th>
                                <th>NIC수<span className={main.downArrowIcon} onClick={() => this.onClickSort("nic_NicCount")}></span></th>
                                <th>NIC 사용 Port수<span className={main.downArrowIcon} onClick={() => this.onClickSort("nic_NicUsePortCount")}></span></th>
                                <th>Onboard NIC Port수<span className={main.downArrowIcon} onClick={() => this.onClickSort("nic_OnboardNicPortCount")}></span></th>
                                <th>Onboard NIC 사용Port수<span className={main.downArrowIcon} onClick={() => this.onClickSort("nic_OnboardNicUsePortCount")}></span></th>
                                <th>HBA속도<span className={main.downArrowIcon} onClick={() => this.onClickSort("nic_HBASpeed")}></span></th>
                                <th>HBA타입<span className={main.downArrowIcon} onClick={() => this.onClickSort("nic_HBAType")}></span></th>
                                <th>HBA포트<span className={main.downArrowIcon} onClick={() => this.onClickSort("nic_HBAPort")}></span></th>
                                <th>HBA수<span className={main.downArrowIcon} onClick={() => this.onClickSort("nic_HBACount")}></span></th>
                                <th>사용중인 HBA Port수량<span className={main.downArrowIcon} onClick={() => this.onClickSort("nic_UsingHBAPortCount")}></span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableDataUI4}
                        </tbody>
                    </table>
                    {/* <div className={main.hardwareBtnBox} onClick={() => this.props.onClickCheck("hardwareCheckbox")}>
                        <span className={main.hleftArrowIcon}></span>
                    </div> */}
                    <table ref={this.refTable5} border="1" className="networkTable" style={{ minWidth: '12%' }}>
                        <thead>
                            <tr>
                                <th colspan="4">네트워크정보<span className={main.nleftArrowIcon} onClick={() => this.props.onClickCheck("networkCheckbox")}></span></th>
                            </tr>
                            <tr style={{ height: '52px' }}>
                                <th rowspan="2">관리 IP 주소<span className={main.downArrowIcon} onClick={() => this.onClickSort("nW_ManageIPAddr")}></span></th>
                                <th rowspan="2">IP 주소 2<span className={main.downArrowIcon} onClick={() => this.onClickSort("nW_IPAddr2")}></span></th>
                                <th rowspan="2">IP 주소 3<span className={main.downArrowIcon} onClick={() => this.onClickSort("nW_IPAddr3")}></span></th>
                                <th rowspan="2">IP 주소 4<span className={main.downArrowIcon} onClick={() => this.onClickSort("nW_IPAddr4")}></span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableDataUI5}
                        </tbody>
                    </table>
                    {/* <div className={main.networkBtnBox} onClick={() => this.props.onClickCheck("networkCheckbox")}>
                        <span className={main.nleftArrowIcon}></span>
                    </div> */}
                    <table ref={this.refTable6} border="1" className="connectTable" style={{ minWidth: '80%' }}>
                        <thead>
                            <tr>
                                <th colspan="17">연결정보<span className={main.cleftArrowIcon}></span></th>
                            </tr>
                            <tr style={{ height: '52px' }}>
                                <th rowspan="2">SAN스위치-1<span className={main.downArrowIcon} onClick={() => { }}></span></th>
                                <th rowspan="2">SAN스위치-2<span className={main.downArrowIcon} onClick={() => { }}></span></th>
                                <th rowspan="2">SAN스위치-3<span className={main.downArrowIcon} onClick={() => { }}></span></th>
                                <th rowspan="2">NW장비-1<span className={main.downArrowIcon} onClick={() => { }}></span></th>
                                <th rowspan="2">NW장비-2<span className={main.downArrowIcon} onClick={() => { }}></span></th>
                                <th rowspan="2">NW장비-3<span className={main.downArrowIcon} onClick={() => { }}></span></th>
                                <th rowspan="2">NW장비-4<span className={main.downArrowIcon} onClick={() => { }}></span></th>
                                <th rowspan="2">NW장비-5<span className={main.downArrowIcon} onClick={() => { }}></span></th>
                                <th rowspan="2">NW장비-6<span className={main.downArrowIcon} onClick={() => { }}></span></th>
                                <th rowspan="2">NW장비-7<span className={main.downArrowIcon} onClick={() => { }}></span></th>
                                <th rowspan="2">NW장비-8<span className={main.downArrowIcon} onClick={() => { }}></span></th>
                                <th rowspan="2">스토리지-1<span className={main.downArrowIcon} onClick={() => { }}></span></th>
                                <th rowspan="2">스토리지-2<span className={main.downArrowIcon} onClick={() => { }}></span></th>
                                <th rowspan="2">백업장비-1<span className={main.downArrowIcon} onClick={() => { }}></span></th>
                                <th rowspan="2">백업장비-2<span className={main.downArrowIcon} onClick={() => { }}></span></th>
                                <th rowspan="2">백업장비-3<span className={main.downArrowIcon} onClick={() => { }}></span></th>
                                <th rowspan="2">백업장비-4<span className={main.downArrowIcon} onClick={() => { }}></span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableDataUI6}
                        </tbody>
                    </table>
                    {/* <div className={main.addTableBtnBox} onClick={() => this.props.onClickCheck("addTableCheckbox")}>
                        <span className={main.aleftArrowIcon}></span>
                    </div> */}
                </div>
            </>
        );
    }
}
export default BoxTable;