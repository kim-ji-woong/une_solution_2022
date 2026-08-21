import React, { Component } from 'react';
import $ from 'jquery';
import main from '../../../Main/css/main.module.css';
import InputText from './inputText';
import SelectBox from './selectBox';
import DatePickerBox from './datePickerBox';
import InventoryManagement from '../inventoryManagement';

class StorageTable extends Component {

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

    setNullableFloat(value) {
        if (value === null || value === "") {
            return null;
        }

        if (isNaN(Number(value))) {
            return null;
        }

        const data = parseFloat(value);

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

        if (column === "basic_Name" && data.basic_Name !== value) {
            this.props.isModifiy(true);
            data.basic_Name = value;
        } else if (column === "basic_Status" && data.basic_Status !== value) {
            this.props.isModifiy(true);
            data.basic_Status = value;
        } else if (column === "basic_ItemLevel" && data.basic_ItemLevel !== value) {
            this.props.isModifiy(true);
            data.basic_ItemLevel = value;
        } else if (column === "basic_ReceiveYears" && data.basic_ReceiveYears !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.basic_ReceiveYears = this.setNullableInt(value);
        } else if (column === "basic_Usage" && data.basic_Usage !== value) {
            this.props.isModifiy(true);
            data.basic_Usage = value;
        } else if (column === "basic_OwnerCompanyName" && data.basic_OwnerCompanyName !== value) {
            this.props.isModifiy(true);
            data.basic_OwnerCompanyName = value;
        } else if (column === "basic_OwnDepartment" && data.basic_OwnDepartment !== value) {
            this.props.isModifiy(true);
            data.basic_OwnDepartment = value;
        } else if (column === "basic_OperationDepartment" && data.basic_OperationDepartment !== value) {
            this.props.isModifiy(true);
            data.basic_OperationDepartment = value;
        } else if (column === "basic_SiteManager" && data.basic_SiteManager !== value) {
            this.props.isModifiy(true);
            data.basic_SiteManager = value;
        } else if (column === "basic_Memo" && data.basic_Memo !== value) {
            this.props.isModifiy(true);
            data.basic_Memo = value;
        } else if (column === "manage_SuperviseManager" && data.manage_SuperviseManager !== value) {
            this.props.isModifiy(true);
            data.manage_SuperviseManager = value;
        } else if (column === "manage_OperationManager" && data.manage_OperationManager !== value) {
            this.props.isModifiy(true);
            data.manage_OperationManager = value;
        } else if (column === "position_InstallRegion" && data.position_InstallRegion !== value) {
            this.props.isModifiy(true);
            data.position_InstallRegion = value;
        } else if (column === "position_RackDetailPosition" && data.position_RackDetailPosition !== value) {
            this.props.isModifiy(true);
            data.position_RackDetailPosition = value;
        } else if (column === "maintenance_ProvideCompanyName" && data.maintenance_ProvideCompanyName !== value) {
            this.props.isModifiy(true);
            data.maintenance_ProvideCompanyName = value;
        } else if (column === "maintenance_WarrantyMonth" && data.maintenance_WarrantyMonth !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.maintenance_WarrantyMonth = this.setNullableInt(value);
        } else if (column === "maintenance_MaintenanceCompanyName" && data.maintenance_MaintenanceCompanyName !== value) {
            this.props.isModifiy(true);
            data.maintenance_MaintenanceCompanyName = value;
        } else if (column === "hW_ModelName" && data.hW_ModelName !== value) {
            this.props.isModifiy(true);
            data.hW_ModelName = value;
        } else if (column === "hW_Company" && data.hW_Company !== value) {
            this.props.isModifiy(true);
            data.hW_Company = value;
        } else if (column === "hW_CacheMemory" && data.hW_CacheMemory !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.hW_CacheMemory = this.setNullableInt(value);
        } else if (column === "hW_SerialNumber" && data.hW_SerialNumber !== value) {
            this.props.isModifiy(true);
            data.hW_SerialNumber = value;
        } else if (column === "hW_DiskType" && data.hW_DiskType !== value) {
            this.props.isModifiy(true);
            data.hW_DiskType = value;
        } else if (column === "hW_ControllerFirmwareVersion" && data.hW_ControllerFirmwareVersion !== value) {
            this.props.isModifiy(true);
            data.hW_ControllerFirmwareVersion = value;
        } else if (column === "hW_TotalPhysicalVolume" && data.hW_TotalPhysicalVolume !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.hW_TotalPhysicalVolume = this.setNullableInt(value);
        } else if (column === "hW_TotalUsableVolume" && data.hW_TotalUsableVolume !== this.setNullableInt(value)) {
            const changedValue = this.setNullableInt(value);

            if (changedValue !== null) {
                this.props.isModifiy(true);
                data.hW_TotalUsableVolume = changedValue;
            }
        } else if (column === "hW_LogicalVolumeGB" && data.hW_LogicalVolumeGB !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.hW_LogicalVolumeGB = this.setNullableInt(value);
        } else if (column === "hW_FreeVolumeGB" && data.hW_FreeVolumeGB !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.hW_FreeVolumeGB = this.setNullableInt(value);
        } else if (column === "hW_MultiPathPropertyName" && data.hW_MultiPathPropertyName !== value) {
            this.props.isModifiy(true);
            data.hW_MultiPathPropertyName = value;
        } else if (column === "hW_AvailableVolume" && data.hW_AvailableVolume !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.hW_AvailableVolume = this.setNullableInt(value);
        } else if (column === "hW_GivenVolumeGB" && data.hW_GivenVolumeGB !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.hW_GivenVolumeGB = this.setNullableInt(value);
        } else if (column === "hW_GivenRate" && data.hW_GivenRate !== this.setNullableFloat(value)) {
            this.props.isModifiy(true);
            data.hW_GivenRate = this.setNullableFloat(value);
        } else if (column === "dual_DualType" && data.dual_DualType !== value) {
            this.props.isModifiy(true);
            data.dual_DualType = value;
        } else if (column === "dual_BoxDualDiskEquipmentName" && data.dual_BoxDualDiskEquipmentName !== value) {
            this.props.isModifiy(true);
            data.dual_BoxDualDiskEquipmentName = value;
        } else if (column === "dual_BoxDualSolutionName" && data.dual_BoxDualSolutionName !== value) {
            this.props.isModifiy(true);
            data.dual_BoxDualSolutionName = value;
        } else if (column === "dual_StorageCopyType" && data.dual_StorageCopyType !== value) {
            this.props.isModifiy(true);
            data.dual_StorageCopyType = value;
        } else if (column === "volume_DiskType" && data.volume_DiskType !== value) {
            this.props.isModifiy(true);
            data.volume_DiskType = value;
        } else if (column === "volume_EachDiskVolume" && data.volume_EachDiskVolume !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.volume_EachDiskVolume = this.setNullableInt(value);
        } else if (column === "volume_DiskCount" && data.volume_DiskCount !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.volume_DiskCount = this.setNullableInt(value);
        } else if (column === "volume_PhysicalVolume" && data.volume_PhysicalVolume !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.volume_PhysicalVolume = this.setNullableInt(value);
        } else if (column === "volume_UsableVolume" && data.volume_UsableVolume !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.volume_UsableVolume = this.setNullableInt(value);
        } else if (column === "volume_RaidSystem" && data.volume_RaidSystem !== value) {
            this.props.isModifiy(true);
            data.volume_RaidSystem = value;
        } else if (column === "extra_DiskVolume" && data.extra_DiskVolume !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.extra_DiskVolume = this.setNullableInt(value);
        } else if (column === "extra_DiskCount" && data.extra_DiskCount !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.extra_DiskCount = this.setNullableInt(value);
        } else if (column === "iP_IPType" && data.iP_IPType !== value) {
            this.props.isModifiy(true);
            data.iP_IPType = value;
        } else if (column === "iP_IPAddress" && data.iP_IPAddress !== value) {
            this.props.isModifiy(true);
            data.iP_IPAddress = value;
        } else if (column === "iP_NetworkSpeed" && data.iP_NetworkSpeed !== value) {
            this.props.isModifiy(true);
            data.iP_NetworkSpeed = value;
        } else if (column === "port_TotalPortCount" && data.port_TotalPortCount !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.port_TotalPortCount = this.setNullableInt(value);
        } else if (column === "port_UsePortCount" && data.port_UsePortCount !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.port_UsePortCount = this.setNullableInt(value);
        } else if (column === "port_LinkedSanSwitch" && data.port_LinkedSanSwitch !== value) {
            this.props.isModifiy(true);
            data.port_LinkedSanSwitch = value;
        } else if (column === "port_Count" && data.port_Count !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.port_Count = this.setNullableInt(value);
        } else if (column === "connect_ServerName" && data.connect_ServerName !== value) {
            this.props.isModifiy(true);
            data.connect_ServerName = value;
        } else if (column === "connect_Usage" && data.connect_Usage !== value) {
            this.props.isModifiy(true);
            data.connect_Usage = value;
        } else if (column === "connect_ServiceLevel" && data.connect_ServiceLevel !== value) {
            this.props.isModifiy(true);
            data.connect_ServiceLevel = value;
        } else if (column === "connect_ModelName" && data.connect_ModelName !== value) {
            this.props.isModifiy(true);
            data.connect_ModelName = value;
        } else if (column === "connect_OS" && data.connect_OS !== value) {
            this.props.isModifiy(true);
            data.connect_OS = value;
        } else if (column === "connect_Cable" && data.connect_Cable !== value) {
            this.props.isModifiy(true);
            data.connect_Cable = value;
        } else if (column === "connect_GivenVolume" && data.connect_GivenVolume !== this.setNullableFloat(value)) {
            this.props.isModifiy(true);
            data.connect_GivenVolume = this.setNullableFloat(value);
        } else if (column === "connect_RealUseVolume" && data.connect_RealUseVolume !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.connect_RealUseVolume = this.setNullableInt(value);
        } else if (column === "connect_EtcVolume" && data.connect_EtcVolume !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.connect_EtcVolume = this.setNullableInt(value);
        } else if (column === "connect_FreeVolume" && data.connect_FreeVolume !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.connect_FreeVolume = this.setNullableInt(value);
        } else if (column === "connect_MonthlyIncrease" && data.connect_MonthlyIncrease !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.connect_MonthlyIncrease = this.setNullableInt(value);
        } else if (column === "connect_ConnectType" && data.connect_ConnectType !== value) {
            this.props.isModifiy(true);
            data.connect_ConnectType = value;
        } else if (column === "connect_ChannelPathCount" && data.connect_ChannelPathCount !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.connect_ChannelPathCount = this.setNullableInt(value);
        } else if (column === "connect_PathDualSolution" && data.connect_PathDualSolution !== value) {
            this.props.isModifiy(true);
            data.connect_PathDualSolution = value;
        } else if (column === "basic_ReceiveDate" && data.basic_ReceiveDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.basic_ReceiveDate = this.setNullableDate(value);
        } else if (column === "basic_RegDate" && data.basic_RegDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.basic_RegDate = this.setNullableDate(value);
        } else if (column === "basic_DiscardDate" && data.basic_DiscardDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.basic_DiscardDate = this.setNullableDate(value);
        } else if (column === "basic_OverUsedYear" && data.basic_OverUsedYear !== value) {
            this.props.isModifiy(true);
            data.basic_OverUsedYear = value;
        } else if (column === "maintenance_WarrantyExpiredDate" && data.maintenance_WarrantyExpiredDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.maintenance_WarrantyExpiredDate = this.setNullableDate(value);
        } else if (column === "maintenance_EOSDate" && data.maintenance_EOSDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.maintenance_EOSDate = this.setNullableDate(value);
        } else if (column === "maintenance_EOLDate" && data.maintenance_EOLDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.maintenance_EOLDate = this.setNullableDate(value);
        } else if (column === "maintenance_EOSL" && data.maintenance_EOSL !== value) {
            this.props.isModifiy(true);
            data.maintenance_EOSL = value;
        } else if (column === "maintenance_EOSLDate" && data.maintenance_EOSLDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.maintenance_EOSLDate = this.setNullableDate(value);
        } else if (column === "maintenance_MaintenanceContract" && data.maintenance_MaintenanceContract !== value) {
            this.props.isModifiy(true);
            data.maintenance_MaintenanceContract = value;
        } else if (column === "maintenance_MaintenanceBeginDate" && data.maintenance_MaintenanceBeginDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.maintenance_MaintenanceBeginDate = this.setNullableDate(value);
        } else if (column === "maintenance_MaintenanceEndDate" && data.maintenance_MaintenanceEndDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.maintenance_MaintenanceEndDate = this.setNullableDate(value);
        } else if (column === "hW_MultiPath" && data.hW_MultiPath !== value) {
            this.props.isModifiy(true);
            data.hW_MultiPath = value;
        } else if (column === "dual_DualUse" && data.dual_DualUse !== value) {
            this.props.isModifiy(true);
            data.dual_DualUse = value;
        } else if (column === "dual_BoxDualUse" && data.dual_BoxDualUse !== value) {
            this.props.isModifiy(true);
            data.dual_BoxDualUse = value;
        } else if (column === "dual_ControllerDualUse" && data.dual_ControllerDualUse !== value) {
            this.props.isModifiy(true);
            data.dual_ControllerDualUse = value;
        } else if (column === "dual_PowerDualUse" && data.dual_PowerDualUse !== value) {
            this.props.isModifiy(true);
            data.dual_PowerDualUse = value;
        } else if (column === "dual_PDUDualUse" && data.dual_PDUDualUse !== value) {
            this.props.isModifiy(true);
            data.dual_PDUDualUse = value;
        } else if (column === "dual_RackPowerDualUse" && data.dual_RackPowerDualUse !== value) {
            this.props.isModifiy(true);
            data.dual_RackPowerDualUse = value;
        } else if (column === "dual_InternalCopySWUse" && data.dual_InternalCopySWUse !== value) {
            this.props.isModifiy(true);
            data.dual_InternalCopySWUse = value;
        } else if (column === "dual_StorageCopyUse" && data.dual_StorageCopyUse !== value) {
            this.props.isModifiy(true);
            data.dual_StorageCopyUse = value;
        } else if (column === "volume_RegDate" && data.volume_RegDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.volume_RegDate = this.setNullableDate(value);
        } else if (column === "port_ReceiveDate" && data.port_ReceiveDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.port_ReceiveDate = this.setNullableDate(value);
        } else if (column === "connect_NWEquip_1" && data.connect_NWEquip_1 !== value) {
            this.props.isModifiy(true);
            data.connect_NWEquip_1 = value;
        } else if (column === "connect_NWEquip_2" && data.connect_NWEquip_2 !== value) {
            this.props.isModifiy(true);
            data.connect_NWEquip_2 = value;
        } else if (column === "connect_NWEquip_3" && data.connect_NWEquip_3 !== value) {
            this.props.isModifiy(true);
            data.connect_NWEquip_3 = value;
        } else if (column === "connect_NWEquip_4" && data.connect_NWEquip_4 !== value) {
            this.props.isModifiy(true);
            data.connect_NWEquip_4 = value;
        } else if (column === "connect_SanSwitch_1" && data.connect_SanSwitch_1 !== value) {
            this.props.isModifiy(true);
            data.connect_SanSwitch_1 = value;
        } else if (column === "connect_SanSwitch_2" && data.connect_SanSwitch_2 !== value) {
            this.props.isModifiy(true);
            data.connect_SanSwitch_2 = value;
        } else if (column === "connect_SanSwitch_3" && data.connect_SanSwitch_3 !== value) {
            this.props.isModifiy(true);
            data.connect_SanSwitch_3 = value;
        } else if (column === "connect_SanSwitch_4" && data.connect_SanSwitch_4 !== value) {
            this.props.isModifiy(true);
            data.connect_SanSwitch_4 = value;
        } else if (column === "connect_SanSwitch_5" && data.connect_SanSwitch_5 !== value) {
            this.props.isModifiy(true);
            data.connect_SanSwitch_5 = value;
        } else if (column === "connect_SanSwitch_6" && data.connect_SanSwitch_6 !== value) {
            this.props.isModifiy(true);
            data.connect_SanSwitch_6 = value;
        } else if (column === "connect_SanSwitch_7" && data.connect_SanSwitch_7 !== value) {
            this.props.isModifiy(true);
            data.connect_SanSwitch_7 = value;
        } else if (column === "connect_SanSwitch_8" && data.connect_SanSwitch_8 !== value) {
            this.props.isModifiy(true);
            data.connect_SanSwitch_8 = value;
        }
    }

    onChangeCheck = (target, data) => {
        if (!data)
            return;

        let checkList = [];

        if (target.checked) {
            // 체크한 경우
            checkList.push(data.storageID);
            this.props.insertCheckList(checkList);
        } else {
            // 체크 해제한 경우
            checkList.push(data.storageID);

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
                    checkList.push(data.storageID);
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

        if (item.basic_Name && item.basic_Name.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_Status && item.basic_Status.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_ReceiveDate && item.basic_ReceiveDate.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_RegDate && item.basic_RegDate.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_ItemLevel && item.basic_ItemLevel.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_ReceiveYears && item.basic_ReceiveYears.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_Usage && item.basic_Usage.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_OwnerCompanyName && item.basic_OwnerCompanyName.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_OwnDepartment && item.basic_OwnDepartment.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_OperationDepartment && item.basic_OperationDepartment.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_SiteManager && item.basic_SiteManager.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_DiscardDate && item.basic_DiscardDate.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_OverUsedYear && item.basic_OverUsedYear.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_Memo && item.basic_Memo.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.manage_SuperviseManager && item.manage_SuperviseManager.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.manage_OperationManager && item.manage_OperationManager.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.position_InstallRegion && item.position_InstallRegion.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.position_RackDetailPosition && item.position_RackDetailPosition.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.maintenance_ProvideCompanyName && item.maintenance_ProvideCompanyName.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.maintenance_WarrantyMonth && item.maintenance_WarrantyMonth.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.maintenance_WarrantyExpiredDate && item.maintenance_WarrantyExpiredDate.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.maintenance_MaintenanceCompanyName && item.maintenance_MaintenanceCompanyName.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.maintenance_EOSDate && item.maintenance_EOSDate.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.maintenance_EOLDate && item.maintenance_EOLDate.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.maintenance_EOSL && item.maintenance_EOSL.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.maintenance_EOSLDate && item.maintenance_EOSLDate.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.maintenance_MaintenanceContract && item.maintenance_MaintenanceContract.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.maintenance_MaintenanceBeginDate && item.maintenance_MaintenanceBeginDate.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.maintenance_MaintenanceEndDate && item.maintenance_MaintenanceEndDate.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_ModelName && item.hW_ModelName.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_Company && item.hW_Company.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_CacheMemory && item.hW_CacheMemory.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_SerialNumber && item.hW_SerialNumber.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_DiskType && item.hW_DiskType.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_ControllerFirmwareVersion && item.hW_ControllerFirmwareVersion.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_TotalPhysicalVolume && item.hW_TotalPhysicalVolume.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_TotalUsableVolume && item.hW_TotalUsableVolume.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_LogicalVolumeGB && item.hW_LogicalVolumeGB.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_FreeVolumeGB && item.hW_FreeVolumeGB.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_MultiPath && item.hW_MultiPath.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_MultiPathPropertyName && item.hW_MultiPathPropertyName.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_AvailableVolume && item.hW_AvailableVolume.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_GivenVolumeGB && item.hW_GivenVolumeGB.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_GivenRate && item.hW_GivenRate.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.dual_DualUse && item.dual_DualUse.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.dual_DualType && item.dual_DualType.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.dual_BoxDualUse && item.dual_BoxDualUse.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.dual_BoxDualDiskEquipmentName && item.dual_BoxDualDiskEquipmentName.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.dual_BoxDualSolutionName && item.dual_BoxDualSolutionName.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.dual_ControllerDualUse && item.dual_ControllerDualUse.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.dual_PowerDualUse && item.dual_PowerDualUse.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.dual_PDUDualUse && item.dual_PDUDualUse.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.dual_RackPowerDualUse && item.dual_RackPowerDualUse.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.dual_InternalCopySWUse && item.dual_InternalCopySWUse.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.dual_StorageCopyUse && item.dual_StorageCopyUse.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.dual_StorageCopyType && item.dual_StorageCopyType.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.volume_RegDat && item.volume_RegDat.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.volume_DiskType && item.volume_DiskType.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.volume_EachDiskVolume && item.volume_EachDiskVolume.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.volume_DiskCount && item.volume_DiskCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.volume_PhysicalVolume && item.volume_PhysicalVolume.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.volume_UsableVolume && item.volume_UsableVolume.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.volume_RaidSystem && item.volume_RaidSystem.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.extra_DiskType && item.extra_DiskType.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.extra_DiskVolume && item.extra_DiskVolume.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.extra_DiskCount && item.extra_DiskCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.iP_IPType && item.iP_IPType.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.iP_IPAddress && item.iP_IPAddress.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.iP_NetworkSpeed && item.iP_NetworkSpeed.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.port_TotalPortCount && item.port_TotalPortCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.port_UsePortCount && item.port_UsePortCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.port_LinkedSanSwitch && item.port_LinkedSanSwitch.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.port_ReceiveDate && item.port_ReceiveDate.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.port_Count && item.port_Count.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_ServerName && item.connect_ServerName.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_Usage && item.connect_Usage.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_ServiceLevel && item.connect_ServiceLevel.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_ModelName && item.connect_ModelName.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_OS && item.connect_OS.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_Cable && item.connect_Cable.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_GivenVolume && item.connect_GivenVolume.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_RealUseVolume && item.connect_RealUseVolume.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_EtcVolume && item.connect_EtcVolume.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_FreeVolume && item.connect_FreeVolume.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_MonthlyIncrease && item.connect_MonthlyIncrease.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_ConnectType && item.connect_ConnectType.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_ChannelPathCount && item.connect_ChannelPathCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_PathDualSolution && item.connect_PathDualSolution.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_NWEquip_1 && item.connect_NWEquip_1.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_NWEquip_2 && item.connect_NWEquip_2.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_NWEquip_3 && item.connect_NWEquip_3.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_NWEquip_4 && item.connect_NWEquip_4.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_SanSwitch_1 && item.connect_SanSwitch_1.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_SanSwitch_2 && item.connect_SanSwitch_2.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_SanSwitch_3 && item.connect_SanSwitch_3.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_SanSwitch_4 && item.connect_SanSwitch_4.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_SanSwitch_5 && item.connect_SanSwitch_5.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_SanSwitch_6 && item.connect_SanSwitch_6.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_SanSwitch_7 && item.connect_SanSwitch_7.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_SanSwitch_8 && item.connect_SanSwitch_8.toString().toLowerCase().includes(searchText)) {
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
                    <tr key={data.storageID + "_1_" + rowIndex} className={main.tableTr}>
                        <td className={main.tableTd}><input type="checkBox" className="colCheckBox" onChange={(e) => this.onChangeCheck(e.target, data)} /></td>
                        <td>{i + 1}</td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable2, rowIndex + 3)}><InputText type="text" value={data.basic_Name} onChange={(value) => this.onChangeInputText(data, "basic_Name", value)} editMode={editName} /></td>
                    </tr>
                );
                tableDataUI2.push(
                    <tr key={data.storageID + "_2_" + rowIndex} className={main.tableTr}>
                        <td><InputText type="text" value={data.basic_Status} onChange={(value) => this.onChangeInputText(data, "basic_Status", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.basic_ReceiveDate} onChange={(value) => this.onChangeInputText(data, "basic_ReceiveDate", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.basic_RegDate} onChange={(value) => this.onChangeInputText(data, "basic_RegDate", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_ItemLevel} onChange={(value) => this.onChangeInputText(data, "basic_ItemLevel", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.basic_ReceiveYears} onChange={(value) => this.onChangeInputText(data, "basic_ReceiveYears", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_Usage} onChange={(value) => this.onChangeInputText(data, "basic_Usage", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_OwnerCompanyName} onChange={(value) => this.onChangeInputText(data, "basic_OwnerCompanyName", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_OwnDepartment} onChange={(value) => this.onChangeInputText(data, "basic_OwnDepartment", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_OperationDepartment} onChange={(value) => this.onChangeInputText(data, "basic_OperationDepartment", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_SiteManager} onChange={(value) => this.onChangeInputText(data, "basic_SiteManager", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.basic_DiscardDate} onChange={(value) => this.onChangeInputText(data, "basic_DiscardDate", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.basic_OverUsedYear} onChange={(value) => this.onChangeInputText(data, "basic_OverUsedYear", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_Memo} onChange={(value) => this.onChangeInputText(data, "basic_Memo", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.manage_SuperviseManager} onChange={(value) => this.onChangeInputText(data, "manage_SuperviseManager", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.manage_OperationManager} onChange={(value) => this.onChangeInputText(data, "manage_OperationManager", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.position_InstallRegion} onChange={(value) => this.onChangeInputText(data, "position_InstallRegion", value)} editMode={this.props.editMode} /></td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable3, rowIndex + 2)}><InputText type="text" value={data.position_RackDetailPosition} onChange={(value) => this.onChangeInputText(data, "position_RackDetailPosition", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );
                tableDataUI3.push(
                    <tr key={data.storageID + "_3_" + rowIndex} className={main.tableTr}>
                        <td><InputText type="text" value={data.maintenance_ProvideCompanyName} onChange={(value) => this.onChangeInputText(data, "maintenance_ProvideCompanyName", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.maintenance_WarrantyMonth} onChange={(value) => this.onChangeInputText(data, "maintenance_WarrantyMonth", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.maintenance_WarrantyExpiredDate} onChange={(value) => this.onChangeInputText(data, "maintenance_WarrantyExpiredDate", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.maintenance_MaintenanceCompanyName} onChange={(value) => this.onChangeInputText(data, "maintenance_MaintenanceCompanyName", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.maintenance_EOSDate} onChange={(value) => this.onChangeInputText(data, "maintenance_EOSDate", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.maintenance_EOLDate} onChange={(value) => this.onChangeInputText(data, "maintenance_EOLDate", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.maintenance_EOSL} onChange={(value) => this.onChangeInputText(data, "maintenance_EOSL", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.maintenance_EOSLDate} onChange={(value) => this.onChangeInputText(data, "maintenance_EOSLDate", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.maintenance_MaintenanceContract} onChange={(value) => this.onChangeInputText(data, "maintenance_MaintenanceContract", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.maintenance_MaintenanceBeginDate} onChange={(value) => this.onChangeInputText(data, "maintenance_MaintenanceBeginDate", value)} editMode={this.props.editMode} /></td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable4, rowIndex + 3)}><DatePickerBox value={data.maintenance_MaintenanceEndDate} onChange={(value) => this.onChangeInputText(data, "maintenance_MaintenanceEndDate", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );
                tableDataUI4.push(
                    <tr key={data.storageID + "_4_" + rowIndex} className={main.tableTr}>
                        <td><InputText type="text" value={data.hW_ModelName} onChange={(value) => this.onChangeInputText(data, "hW_ModelName", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_Company} onChange={(value) => this.onChangeInputText(data, "hW_Company", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.hW_CacheMemory} onChange={(value) => this.onChangeInputText(data, "hW_CacheMemory", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_SerialNumber} onChange={(value) => this.onChangeInputText(data, "hW_SerialNumber", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_DiskType} onChange={(value) => this.onChangeInputText(data, "hW_DiskType", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_ControllerFirmwareVersion} onChange={(value) => this.onChangeInputText(data, "hW_ControllerFirmwareVersion", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.hW_TotalPhysicalVolume} onChange={(value) => this.onChangeInputText(data, "hW_TotalPhysicalVolume", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="number" value={data.hW_TotalUsableVolume} onChange={(value) => this.onChangeInputText(data, "hW_TotalUsableVolume", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.hW_LogicalVolumeGB} onChange={(value) => this.onChangeInputText(data, "hW_LogicalVolumeGB", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.hW_FreeVolumeGB} onChange={(value) => this.onChangeInputText(data, "hW_FreeVolumeGB", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.hW_MultiPath} onChange={(value) => this.onChangeInputText(data, "hW_MultiPath", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_MultiPathPropertyName} onChange={(value) => this.onChangeInputText(data, "hW_MultiPathPropertyName", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.hW_AvailableVolume} onChange={(value) => this.onChangeInputText(data, "hW_AvailableVolume", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.hW_GivenVolumeGB} onChange={(value) => this.onChangeInputText(data, "hW_GivenVolumeGB", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.hW_GivenRate} onChange={(value) => this.onChangeInputText(data, "hW_GivenRate", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.dual_DualUse} onChange={(value) => this.onChangeInputText(data, "dual_DualUse", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.dual_DualType} onChange={(value) => this.onChangeInputText(data, "dual_DualType", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.dual_BoxDualUse} onChange={(value) => this.onChangeInputText(data, "dual_BoxDualUse", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.dual_BoxDualDiskEquipmentName} onChange={(value) => this.onChangeInputText(data, "dual_BoxDualDiskEquipmentName", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.dual_BoxDualSolutionName} onChange={(value) => this.onChangeInputText(data, "dual_BoxDualSolutionName", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.dual_ControllerDualUse} onChange={(value) => this.onChangeInputText(data, "dual_ControllerDualUse", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.dual_PowerDualUse} onChange={(value) => this.onChangeInputText(data, "dual_PowerDualUse", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.dual_PDUDualUse} onChange={(value) => this.onChangeInputText(data, "dual_PDUDualUse", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.dual_RackPowerDualUse} onChange={(value) => this.onChangeInputText(data, "dual_RackPowerDualUse", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.dual_InternalCopySWUse} onChange={(value) => this.onChangeInputText(data, "dual_InternalCopySWUse", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.dual_StorageCopyUse} onChange={(value) => this.onChangeInputText(data, "dual_StorageCopyUse", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.dual_StorageCopyType} onChange={(value) => this.onChangeInputText(data, "dual_StorageCopyType", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.volume_RegDate} onChange={(value) => this.onChangeInputText(data, "volume_RegDate", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.volume_DiskType} onChange={(value) => this.onChangeInputText(data, "volume_DiskType", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.volume_EachDiskVolume} onChange={(value) => this.onChangeInputText(data, "volume_EachDiskVolume", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.volume_DiskCount} onChange={(value) => this.onChangeInputText(data, "volume_DiskCount", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.volume_PhysicalVolume} onChange={(value) => this.onChangeInputText(data, "volume_PhysicalVolume", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.volume_UsableVolume} onChange={(value) => this.onChangeInputText(data, "volume_UsableVolume", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.volume_RaidSystem} onChange={(value) => this.onChangeInputText(data, "volume_RaidSystem", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.extra_DiskType} onChange={(value) => this.onChangeInputText(data, "extra_DiskType", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.extra_DiskVolume} onChange={(value) => this.onChangeInputText(data, "extra_DiskVolume", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.extra_DiskCount} onChange={(value) => this.onChangeInputText(data, "extra_DiskCount", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.iP_IPType} onChange={(value) => this.onChangeInputText(data, "iP_IPType", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.iP_IPAddress} onChange={(value) => this.onChangeInputText(data, "iP_IPAddress", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.iP_NetworkSpeed} onChange={(value) => this.onChangeInputText(data, "iP_NetworkSpeed", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.port_TotalPortCount} onChange={(value) => this.onChangeInputText(data, "port_TotalPortCount", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.port_UsePortCount} onChange={(value) => this.onChangeInputText(data, "port_UsePortCount", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.port_LinkedSanSwitch} onChange={(value) => this.onChangeInputText(data, "port_LinkedSanSwitch", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.port_ReceiveDate} onChange={(value) => this.onChangeInputText(data, "port_ReceiveDate", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.port_Count} onChange={(value) => this.onChangeInputText(data, "port_Count", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_ServerName} onChange={(value) => this.onChangeInputText(data, "connect_ServerName", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_Usage} onChange={(value) => this.onChangeInputText(data, "connect_Usage", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_ServiceLevel} onChange={(value) => this.onChangeInputText(data, "connect_ServiceLevel", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_ModelName} onChange={(value) => this.onChangeInputText(data, "connect_ModelName", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_OS} onChange={(value) => this.onChangeInputText(data, "connect_OS", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_Cable} onChange={(value) => this.onChangeInputText(data, "connect_Cable", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.connect_GivenVolume} onChange={(value) => this.onChangeInputText(data, "connect_GivenVolume", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.connect_RealUseVolume} onChange={(value) => this.onChangeInputText(data, "connect_RealUseVolume", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.connect_EtcVolume} onChange={(value) => this.onChangeInputText(data, "connect_EtcVolume", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.connect_FreeVolume} onChange={(value) => this.onChangeInputText(data, "connect_FreeVolume", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.connect_MonthlyIncrease} onChange={(value) => this.onChangeInputText(data, "connect_MonthlyIncrease", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_ConnectType} onChange={(value) => this.onChangeInputText(data, "connect_ConnectType", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.connect_ChannelPathCount} onChange={(value) => this.onChangeInputText(data, "connect_ChannelPathCount", value)} editMode={this.props.editMode} /></td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable5, rowIndex + 2)}><InputText type="text" value={data.connect_PathDualSolution} onChange={(value) => this.onChangeInputText(data, "connect_PathDualSolution", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );
                tableDataUI5.push(
                    <tr key={data.storageID + "_5_" + rowIndex} className={main.tableTr}>
                        <td><InputText type="text" value={data.connect_NWEquip_1} onChange={(value) => this.onChangeInputText(data, "connect_NWEquip_1", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_NWEquip_2} onChange={(value) => this.onChangeInputText(data, "connect_NWEquip_2", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_NWEquip_3} onChange={(value) => this.onChangeInputText(data, "connect_NWEquip_3", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_NWEquip_4} onChange={(value) => this.onChangeInputText(data, "connect_NWEquip_4", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_SanSwitch_1} onChange={(value) => this.onChangeInputText(data, "connect_SanSwitch_1", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_SanSwitch_2} onChange={(value) => this.onChangeInputText(data, "connect_SanSwitch_2", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_SanSwitch_3} onChange={(value) => this.onChangeInputText(data, "connect_SanSwitch_3", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_SanSwitch_4} onChange={(value) => this.onChangeInputText(data, "connect_SanSwitch_4", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_SanSwitch_5} onChange={(value) => this.onChangeInputText(data, "connect_SanSwitch_5", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_SanSwitch_6} onChange={(value) => this.onChangeInputText(data, "connect_SanSwitch_6", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.connect_SanSwitch_7} onChange={(value) => this.onChangeInputText(data, "connect_SanSwitch_7", value)} editMode={this.props.editMode} /></td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable1, rowIndex + 2)}><InputText type="text" value={data.connect_SanSwitch_8} onChange={(value) => this.onChangeInputText(data, "connect_SanSwitch_8", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );
                tableDataUI6.push(
                    <tr key={data.storageID + "_6_" + rowIndex} className={main.tableTr}>
                        <td></td>
                    </tr>
                );





                idx++;
                _rowIndex++;
            }
        }

        return [tableDataUI1, tableDataUI2, tableDataUI3, tableDataUI4, tableDataUI5, tableDataUI6];
    }

    onClickSort = (data) => {
        if (!data)
            return;

        const displayData = this.state.displayData;
        const sortString = this.state.sortString;

        if (sortString === data)
            return;

        if (data === "basic_Name") { displayData.sort((a, b) => { if ((a.basic_Name === null || a.basic_Name === undefined) && (b.basic_Name === null || b.basic_Name === undefined)) { return 0; } else if (a.basic_Name === null || a.basic_Name === undefined) { return 1; } else if (b.basic_Name === null || b.basic_Name === undefined) { return -1; } else if (a.basic_Name?.toLowerCase() > b.basic_Name?.toLowerCase()) { return 1; } else if (a.basic_Name?.toLowerCase() < b.basic_Name?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_Status") { displayData.sort((a, b) => { if ((a.basic_Status === null || a.basic_Status === undefined) && (b.basic_Status === null || b.basic_Status === undefined)) { return 0; } else if (a.basic_Status === null || a.basic_Status === undefined) { return 1; } else if (b.basic_Status === null || b.basic_Status === undefined) { return -1; } else if (a.basic_Status?.toLowerCase() > b.basic_Status?.toLowerCase()) { return 1; } else if (a.basic_Status?.toLowerCase() < b.basic_Status?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_ItemLevel") { displayData.sort((a, b) => { if ((a.basic_ItemLevel === null || a.basic_ItemLevel === undefined) && (b.basic_ItemLevel === null || b.basic_ItemLevel === undefined)) { return 0; } else if (a.basic_ItemLevel === null || a.basic_ItemLevel === undefined) { return 1; } else if (b.basic_ItemLevel === null || b.basic_ItemLevel === undefined) { return -1; } else if (a.basic_ItemLevel?.toLowerCase() > b.basic_ItemLevel?.toLowerCase()) { return 1; } else if (a.basic_ItemLevel?.toLowerCase() < b.basic_ItemLevel?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_ReceiveYears") { displayData.sort((a, b) => { if ((a.basic_ReceiveYears === null || a.basic_ReceiveYears === undefined) && (b.basic_ReceiveYears === null || b.basic_ReceiveYears === undefined)) { return 0; } else if (a.basic_ReceiveYears === null || a.basic_ReceiveYears === undefined) { return 1; } else if (b.basic_ReceiveYears === null || b.basic_ReceiveYears === undefined) { return -1; } else if (a.basic_ReceiveYears > b.basic_ReceiveYears) { return 1; } else if (a.basic_ReceiveYears < b.basic_ReceiveYears) { return -1; } else { return 0; } }); }
        else if (data === "basic_Usage") { displayData.sort((a, b) => { if ((a.basic_Usage === null || a.basic_Usage === undefined) && (b.basic_Usage === null || b.basic_Usage === undefined)) { return 0; } else if (a.basic_Usage === null || a.basic_Usage === undefined) { return 1; } else if (b.basic_Usage === null || b.basic_Usage === undefined) { return -1; } else if (a.basic_Usage?.toLowerCase() > b.basic_Usage?.toLowerCase()) { return 1; } else if (a.basic_Usage?.toLowerCase() < b.basic_Usage?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_OwnerCompanyName") { displayData.sort((a, b) => { if ((a.basic_OwnerCompanyName === null || a.basic_OwnerCompanyName === undefined) && (b.basic_OwnerCompanyName === null || b.basic_OwnerCompanyName === undefined)) { return 0; } else if (a.basic_OwnerCompanyName === null || a.basic_OwnerCompanyName === undefined) { return 1; } else if (b.basic_OwnerCompanyName === null || b.basic_OwnerCompanyName === undefined) { return -1; } else if (a.basic_OwnerCompanyName?.toLowerCase() > b.basic_OwnerCompanyName?.toLowerCase()) { return 1; } else if (a.basic_OwnerCompanyName?.toLowerCase() < b.basic_OwnerCompanyName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_OwnDepartment") { displayData.sort((a, b) => { if ((a.basic_OwnDepartment === null || a.basic_OwnDepartment === undefined) && (b.basic_OwnDepartment === null || b.basic_OwnDepartment === undefined)) { return 0; } else if (a.basic_OwnDepartment === null || a.basic_OwnDepartment === undefined) { return 1; } else if (b.basic_OwnDepartment === null || b.basic_OwnDepartment === undefined) { return -1; } else if (a.basic_OwnDepartment?.toLowerCase() > b.basic_OwnDepartment?.toLowerCase()) { return 1; } else if (a.basic_OwnDepartment?.toLowerCase() < b.basic_OwnDepartment?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_OperationDepartment") { displayData.sort((a, b) => { if ((a.basic_OperationDepartment === null || a.basic_OperationDepartment === undefined) && (b.basic_OperationDepartment === null || b.basic_OperationDepartment === undefined)) { return 0; } else if (a.basic_OperationDepartment === null || a.basic_OperationDepartment === undefined) { return 1; } else if (b.basic_OperationDepartment === null || b.basic_OperationDepartment === undefined) { return -1; } else if (a.basic_OperationDepartment?.toLowerCase() > b.basic_OperationDepartment?.toLowerCase()) { return 1; } else if (a.basic_OperationDepartment?.toLowerCase() < b.basic_OperationDepartment?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_SiteManager") { displayData.sort((a, b) => { if ((a.basic_SiteManager === null || a.basic_SiteManager === undefined) && (b.basic_SiteManager === null || b.basic_SiteManager === undefined)) { return 0; } else if (a.basic_SiteManager === null || a.basic_SiteManager === undefined) { return 1; } else if (b.basic_SiteManager === null || b.basic_SiteManager === undefined) { return -1; } else if (a.basic_SiteManager?.toLowerCase() > b.basic_SiteManager?.toLowerCase()) { return 1; } else if (a.basic_SiteManager?.toLowerCase() < b.basic_SiteManager?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_Memo") { displayData.sort((a, b) => { if ((a.basic_Memo === null || a.basic_Memo === undefined) && (b.basic_Memo === null || b.basic_Memo === undefined)) { return 0; } else if (a.basic_Memo === null || a.basic_Memo === undefined) { return 1; } else if (b.basic_Memo === null || b.basic_Memo === undefined) { return -1; } else if (a.basic_Memo?.toLowerCase() > b.basic_Memo?.toLowerCase()) { return 1; } else if (a.basic_Memo?.toLowerCase() < b.basic_Memo?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "manage_SuperviseManager") { displayData.sort((a, b) => { if ((a.manage_SuperviseManager === null || a.manage_SuperviseManager === undefined) && (b.manage_SuperviseManager === null || b.manage_SuperviseManager === undefined)) { return 0; } else if (a.manage_SuperviseManager === null || a.manage_SuperviseManager === undefined) { return 1; } else if (b.manage_SuperviseManager === null || b.manage_SuperviseManager === undefined) { return -1; } else if (a.manage_SuperviseManager?.toLowerCase() > b.manage_SuperviseManager?.toLowerCase()) { return 1; } else if (a.manage_SuperviseManager?.toLowerCase() < b.manage_SuperviseManager?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "manage_OperationManager") { displayData.sort((a, b) => { if ((a.manage_OperationManager === null || a.manage_OperationManager === undefined) && (b.manage_OperationManager === null || b.manage_OperationManager === undefined)) { return 0; } else if (a.manage_OperationManager === null || a.manage_OperationManager === undefined) { return 1; } else if (b.manage_OperationManager === null || b.manage_OperationManager === undefined) { return -1; } else if (a.manage_OperationManager?.toLowerCase() > b.manage_OperationManager?.toLowerCase()) { return 1; } else if (a.manage_OperationManager?.toLowerCase() < b.manage_OperationManager?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "position_InstallRegion") { displayData.sort((a, b) => { if ((a.position_InstallRegion === null || a.position_InstallRegion === undefined) && (b.position_InstallRegion === null || b.position_InstallRegion === undefined)) { return 0; } else if (a.position_InstallRegion === null || a.position_InstallRegion === undefined) { return 1; } else if (b.position_InstallRegion === null || b.position_InstallRegion === undefined) { return -1; } else if (a.position_InstallRegion?.toLowerCase() > b.position_InstallRegion?.toLowerCase()) { return 1; } else if (a.position_InstallRegion?.toLowerCase() < b.position_InstallRegion?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "position_RackDetailPosition") { displayData.sort((a, b) => { if ((a.position_RackDetailPosition === null || a.position_RackDetailPosition === undefined) && (b.position_RackDetailPosition === null || b.position_RackDetailPosition === undefined)) { return 0; } else if (a.position_RackDetailPosition === null || a.position_RackDetailPosition === undefined) { return 1; } else if (b.position_RackDetailPosition === null || b.position_RackDetailPosition === undefined) { return -1; } else if (a.position_RackDetailPosition?.toLowerCase() > b.position_RackDetailPosition?.toLowerCase()) { return 1; } else if (a.position_RackDetailPosition?.toLowerCase() < b.position_RackDetailPosition?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_ProvideCompanyName") { displayData.sort((a, b) => { if ((a.maintenance_ProvideCompanyName === null || a.maintenance_ProvideCompanyName === undefined) && (b.maintenance_ProvideCompanyName === null || b.maintenance_ProvideCompanyName === undefined)) { return 0; } else if (a.maintenance_ProvideCompanyName === null || a.maintenance_ProvideCompanyName === undefined) { return 1; } else if (b.maintenance_ProvideCompanyName === null || b.maintenance_ProvideCompanyName === undefined) { return -1; } else if (a.maintenance_ProvideCompanyName?.toLowerCase() > b.maintenance_ProvideCompanyName?.toLowerCase()) { return 1; } else if (a.maintenance_ProvideCompanyName?.toLowerCase() < b.maintenance_ProvideCompanyName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_WarrantyMonth") { displayData.sort((a, b) => { if ((a.maintenance_WarrantyMonth === null || a.maintenance_WarrantyMonth === undefined) && (b.maintenance_WarrantyMonth === null || b.maintenance_WarrantyMonth === undefined)) { return 0; } else if (a.maintenance_WarrantyMonth === null || a.maintenance_WarrantyMonth === undefined) { return 1; } else if (b.maintenance_WarrantyMonth === null || b.maintenance_WarrantyMonth === undefined) { return -1; } else if (a.maintenance_WarrantyMonth > b.maintenance_WarrantyMonth) { return 1; } else if (a.maintenance_WarrantyMonth < b.maintenance_WarrantyMonth) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_MaintenanceCompanyName") { displayData.sort((a, b) => { if ((a.maintenance_MaintenanceCompanyName === null || a.maintenance_MaintenanceCompanyName === undefined) && (b.maintenance_MaintenanceCompanyName === null || b.maintenance_MaintenanceCompanyName === undefined)) { return 0; } else if (a.maintenance_MaintenanceCompanyName === null || a.maintenance_MaintenanceCompanyName === undefined) { return 1; } else if (b.maintenance_MaintenanceCompanyName === null || b.maintenance_MaintenanceCompanyName === undefined) { return -1; } else if (a.maintenance_MaintenanceCompanyName?.toLowerCase() > b.maintenance_MaintenanceCompanyName?.toLowerCase()) { return 1; } else if (a.maintenance_MaintenanceCompanyName?.toLowerCase() < b.maintenance_MaintenanceCompanyName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_ModelName") { displayData.sort((a, b) => { if ((a.hW_ModelName === null || a.hW_ModelName === undefined) && (b.hW_ModelName === null || b.hW_ModelName === undefined)) { return 0; } else if (a.hW_ModelName === null || a.hW_ModelName === undefined) { return 1; } else if (b.hW_ModelName === null || b.hW_ModelName === undefined) { return -1; } else if (a.hW_ModelName?.toLowerCase() > b.hW_ModelName?.toLowerCase()) { return 1; } else if (a.hW_ModelName?.toLowerCase() < b.hW_ModelName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_Company") { displayData.sort((a, b) => { if ((a.hW_Company === null || a.hW_Company === undefined) && (b.hW_Company === null || b.hW_Company === undefined)) { return 0; } else if (a.hW_Company === null || a.hW_Company === undefined) { return 1; } else if (b.hW_Company === null || b.hW_Company === undefined) { return -1; } else if (a.hW_Company?.toLowerCase() > b.hW_Company?.toLowerCase()) { return 1; } else if (a.hW_Company?.toLowerCase() < b.hW_Company?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_CacheMemory") { displayData.sort((a, b) => { if ((a.hW_CacheMemory === null || a.hW_CacheMemory === undefined) && (b.hW_CacheMemory === null || b.hW_CacheMemory === undefined)) { return 0; } else if (a.hW_CacheMemory === null || a.hW_CacheMemory === undefined) { return 1; } else if (b.hW_CacheMemory === null || b.hW_CacheMemory === undefined) { return -1; } else if (a.hW_CacheMemory > b.hW_CacheMemory) { return 1; } else if (a.hW_CacheMemory < b.hW_CacheMemory) { return -1; } else { return 0; } }); }
        else if (data === "hW_SerialNumber") { displayData.sort((a, b) => { if ((a.hW_SerialNumber === null || a.hW_SerialNumber === undefined) && (b.hW_SerialNumber === null || b.hW_SerialNumber === undefined)) { return 0; } else if (a.hW_SerialNumber === null || a.hW_SerialNumber === undefined) { return 1; } else if (b.hW_SerialNumber === null || b.hW_SerialNumber === undefined) { return -1; } else if (a.hW_SerialNumber?.toLowerCase() > b.hW_SerialNumber?.toLowerCase()) { return 1; } else if (a.hW_SerialNumber?.toLowerCase() < b.hW_SerialNumber?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_DiskType") { displayData.sort((a, b) => { if ((a.hW_DiskType === null || a.hW_DiskType === undefined) && (b.hW_DiskType === null || b.hW_DiskType === undefined)) { return 0; } else if (a.hW_DiskType === null || a.hW_DiskType === undefined) { return 1; } else if (b.hW_DiskType === null || b.hW_DiskType === undefined) { return -1; } else if (a.hW_DiskType?.toLowerCase() > b.hW_DiskType?.toLowerCase()) { return 1; } else if (a.hW_DiskType?.toLowerCase() < b.hW_DiskType?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_ControllerFirmwareVersion") { displayData.sort((a, b) => { if ((a.hW_ControllerFirmwareVersion === null || a.hW_ControllerFirmwareVersion === undefined) && (b.hW_ControllerFirmwareVersion === null || b.hW_ControllerFirmwareVersion === undefined)) { return 0; } else if (a.hW_ControllerFirmwareVersion === null || a.hW_ControllerFirmwareVersion === undefined) { return 1; } else if (b.hW_ControllerFirmwareVersion === null || b.hW_ControllerFirmwareVersion === undefined) { return -1; } else if (a.hW_ControllerFirmwareVersion?.toLowerCase() > b.hW_ControllerFirmwareVersion?.toLowerCase()) { return 1; } else if (a.hW_ControllerFirmwareVersion?.toLowerCase() < b.hW_ControllerFirmwareVersion?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_TotalPhysicalVolume") { displayData.sort((a, b) => { if ((a.hW_TotalPhysicalVolume === null || a.hW_TotalPhysicalVolume === undefined) && (b.hW_TotalPhysicalVolume === null || b.hW_TotalPhysicalVolume === undefined)) { return 0; } else if (a.hW_TotalPhysicalVolume === null || a.hW_TotalPhysicalVolume === undefined) { return 1; } else if (b.hW_TotalPhysicalVolume === null || b.hW_TotalPhysicalVolume === undefined) { return -1; } else if (a.hW_TotalPhysicalVolume > b.hW_TotalPhysicalVolume) { return 1; } else if (a.hW_TotalPhysicalVolume < b.hW_TotalPhysicalVolume) { return -1; } else { return 0; } }); }
        else if (data === "hW_TotalUsableVolume") { displayData.sort((a, b) => { if ((a.hW_TotalUsableVolume === null || a.hW_TotalUsableVolume === undefined) && (b.hW_TotalUsableVolume === null || b.hW_TotalUsableVolume === undefined)) { return 0; } else if (a.hW_TotalUsableVolume === null || a.hW_TotalUsableVolume === undefined) { return 1; } else if (b.hW_TotalUsableVolume === null || b.hW_TotalUsableVolume === undefined) { return -1; } else if (a.hW_TotalUsableVolume > b.hW_TotalUsableVolume) { return 1; } else if (a.hW_TotalUsableVolume < b.hW_TotalUsableVolume) { return -1; } else { return 0; } }); }
        else if (data === "hW_LogicalVolumeGB") { displayData.sort((a, b) => { if ((a.hW_LogicalVolumeGB === null || a.hW_LogicalVolumeGB === undefined) && (b.hW_LogicalVolumeGB === null || b.hW_LogicalVolumeGB === undefined)) { return 0; } else if (a.hW_LogicalVolumeGB === null || a.hW_LogicalVolumeGB === undefined) { return 1; } else if (b.hW_LogicalVolumeGB === null || b.hW_LogicalVolumeGB === undefined) { return -1; } else if (a.hW_LogicalVolumeGB > b.hW_LogicalVolumeGB) { return 1; } else if (a.hW_LogicalVolumeGB < b.hW_LogicalVolumeGB) { return -1; } else { return 0; } }); }
        else if (data === "hW_FreeVolumeGB") { displayData.sort((a, b) => { if ((a.hW_FreeVolumeGB === null || a.hW_FreeVolumeGB === undefined) && (b.hW_FreeVolumeGB === null || b.hW_FreeVolumeGB === undefined)) { return 0; } else if (a.hW_FreeVolumeGB === null || a.hW_FreeVolumeGB === undefined) { return 1; } else if (b.hW_FreeVolumeGB === null || b.hW_FreeVolumeGB === undefined) { return -1; } else if (a.hW_FreeVolumeGB > b.hW_FreeVolumeGB) { return 1; } else if (a.hW_FreeVolumeGB < b.hW_FreeVolumeGB) { return -1; } else { return 0; } }); }
        else if (data === "hW_MultiPathPropertyName") { displayData.sort((a, b) => { if ((a.hW_MultiPathPropertyName === null || a.hW_MultiPathPropertyName === undefined) && (b.hW_MultiPathPropertyName === null || b.hW_MultiPathPropertyName === undefined)) { return 0; } else if (a.hW_MultiPathPropertyName === null || a.hW_MultiPathPropertyName === undefined) { return 1; } else if (b.hW_MultiPathPropertyName === null || b.hW_MultiPathPropertyName === undefined) { return -1; } else if (a.hW_MultiPathPropertyName?.toLowerCase() > b.hW_MultiPathPropertyName?.toLowerCase()) { return 1; } else if (a.hW_MultiPathPropertyName?.toLowerCase() < b.hW_MultiPathPropertyName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_AvailableVolume") { displayData.sort((a, b) => { if ((a.hW_AvailableVolume === null || a.hW_AvailableVolume === undefined) && (b.hW_AvailableVolume === null || b.hW_AvailableVolume === undefined)) { return 0; } else if (a.hW_AvailableVolume === null || a.hW_AvailableVolume === undefined) { return 1; } else if (b.hW_AvailableVolume === null || b.hW_AvailableVolume === undefined) { return -1; } else if (a.hW_AvailableVolume > b.hW_AvailableVolume) { return 1; } else if (a.hW_AvailableVolume < b.hW_AvailableVolume) { return -1; } else { return 0; } }); }
        else if (data === "hW_GivenVolumeGB") { displayData.sort((a, b) => { if ((a.hW_GivenVolumeGB === null || a.hW_GivenVolumeGB === undefined) && (b.hW_GivenVolumeGB === null || b.hW_GivenVolumeGB === undefined)) { return 0; } else if (a.hW_GivenVolumeGB === null || a.hW_GivenVolumeGB === undefined) { return 1; } else if (b.hW_GivenVolumeGB === null || b.hW_GivenVolumeGB === undefined) { return -1; } else if (a.hW_GivenVolumeGB > b.hW_GivenVolumeGB) { return 1; } else if (a.hW_GivenVolumeGB < b.hW_GivenVolumeGB) { return -1; } else { return 0; } }); }
        else if (data === "hW_GivenRate") { displayData.sort((a, b) => { if ((a.hW_GivenRate === null || a.hW_GivenRate === undefined) && (b.hW_GivenRate === null || b.hW_GivenRate === undefined)) { return 0; } else if (a.hW_GivenRate === null || a.hW_GivenRate === undefined) { return 1; } else if (b.hW_GivenRate === null || b.hW_GivenRate === undefined) { return -1; } else if (a.hW_GivenRate > b.hW_GivenRate) { return 1; } else if (a.hW_GivenRate < b.hW_GivenRate) { return -1; } else { return 0; } }); }
        else if (data === "dual_DualType") { displayData.sort((a, b) => { if ((a.dual_DualType === null || a.dual_DualType === undefined) && (b.dual_DualType === null || b.dual_DualType === undefined)) { return 0; } else if (a.dual_DualType === null || a.dual_DualType === undefined) { return 1; } else if (b.dual_DualType === null || b.dual_DualType === undefined) { return -1; } else if (a.dual_DualType?.toLowerCase() > b.dual_DualType?.toLowerCase()) { return 1; } else if (a.dual_DualType?.toLowerCase() < b.dual_DualType?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "dual_BoxDualDiskEquipmentName") { displayData.sort((a, b) => { if ((a.dual_BoxDualDiskEquipmentName === null || a.dual_BoxDualDiskEquipmentName === undefined) && (b.dual_BoxDualDiskEquipmentName === null || b.dual_BoxDualDiskEquipmentName === undefined)) { return 0; } else if (a.dual_BoxDualDiskEquipmentName === null || a.dual_BoxDualDiskEquipmentName === undefined) { return 1; } else if (b.dual_BoxDualDiskEquipmentName === null || b.dual_BoxDualDiskEquipmentName === undefined) { return -1; } else if (a.dual_BoxDualDiskEquipmentName?.toLowerCase() > b.dual_BoxDualDiskEquipmentName?.toLowerCase()) { return 1; } else if (a.dual_BoxDualDiskEquipmentName?.toLowerCase() < b.dual_BoxDualDiskEquipmentName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "dual_BoxDualSolutionName") { displayData.sort((a, b) => { if ((a.dual_BoxDualSolutionName === null || a.dual_BoxDualSolutionName === undefined) && (b.dual_BoxDualSolutionName === null || b.dual_BoxDualSolutionName === undefined)) { return 0; } else if (a.dual_BoxDualSolutionName === null || a.dual_BoxDualSolutionName === undefined) { return 1; } else if (b.dual_BoxDualSolutionName === null || b.dual_BoxDualSolutionName === undefined) { return -1; } else if (a.dual_BoxDualSolutionName?.toLowerCase() > b.dual_BoxDualSolutionName?.toLowerCase()) { return 1; } else if (a.dual_BoxDualSolutionName?.toLowerCase() < b.dual_BoxDualSolutionName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "dual_StorageCopyType") { displayData.sort((a, b) => { if ((a.dual_StorageCopyType === null || a.dual_StorageCopyType === undefined) && (b.dual_StorageCopyType === null || b.dual_StorageCopyType === undefined)) { return 0; } else if (a.dual_StorageCopyType === null || a.dual_StorageCopyType === undefined) { return 1; } else if (b.dual_StorageCopyType === null || b.dual_StorageCopyType === undefined) { return -1; } else if (a.dual_StorageCopyType?.toLowerCase() > b.dual_StorageCopyType?.toLowerCase()) { return 1; } else if (a.dual_StorageCopyType?.toLowerCase() < b.dual_StorageCopyType?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "volume_DiskType") { displayData.sort((a, b) => { if ((a.volume_DiskType === null || a.volume_DiskType === undefined) && (b.volume_DiskType === null || b.volume_DiskType === undefined)) { return 0; } else if (a.volume_DiskType === null || a.volume_DiskType === undefined) { return 1; } else if (b.volume_DiskType === null || b.volume_DiskType === undefined) { return -1; } else if (a.volume_DiskType?.toLowerCase() > b.volume_DiskType?.toLowerCase()) { return 1; } else if (a.volume_DiskType?.toLowerCase() < b.volume_DiskType?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "volume_EachDiskVolume") { displayData.sort((a, b) => { if ((a.volume_EachDiskVolume === null || a.volume_EachDiskVolume === undefined) && (b.volume_EachDiskVolume === null || b.volume_EachDiskVolume === undefined)) { return 0; } else if (a.volume_EachDiskVolume === null || a.volume_EachDiskVolume === undefined) { return 1; } else if (b.volume_EachDiskVolume === null || b.volume_EachDiskVolume === undefined) { return -1; } else if (a.volume_EachDiskVolume > b.volume_EachDiskVolume) { return 1; } else if (a.volume_EachDiskVolume < b.volume_EachDiskVolume) { return -1; } else { return 0; } }); }
        else if (data === "volume_DiskCount") { displayData.sort((a, b) => { if ((a.volume_DiskCount === null || a.volume_DiskCount === undefined) && (b.volume_DiskCount === null || b.volume_DiskCount === undefined)) { return 0; } else if (a.volume_DiskCount === null || a.volume_DiskCount === undefined) { return 1; } else if (b.volume_DiskCount === null || b.volume_DiskCount === undefined) { return -1; } else if (a.volume_DiskCount > b.volume_DiskCount) { return 1; } else if (a.volume_DiskCount < b.volume_DiskCount) { return -1; } else { return 0; } }); }
        else if (data === "volume_PhysicalVolume") { displayData.sort((a, b) => { if ((a.volume_PhysicalVolume === null || a.volume_PhysicalVolume === undefined) && (b.volume_PhysicalVolume === null || b.volume_PhysicalVolume === undefined)) { return 0; } else if (a.volume_PhysicalVolume === null || a.volume_PhysicalVolume === undefined) { return 1; } else if (b.volume_PhysicalVolume === null || b.volume_PhysicalVolume === undefined) { return -1; } else if (a.volume_PhysicalVolume > b.volume_PhysicalVolume) { return 1; } else if (a.volume_PhysicalVolume < b.volume_PhysicalVolume) { return -1; } else { return 0; } }); }
        else if (data === "volume_UsableVolume") { displayData.sort((a, b) => { if ((a.volume_UsableVolume === null || a.volume_UsableVolume === undefined) && (b.volume_UsableVolume === null || b.volume_UsableVolume === undefined)) { return 0; } else if (a.volume_UsableVolume === null || a.volume_UsableVolume === undefined) { return 1; } else if (b.volume_UsableVolume === null || b.volume_UsableVolume === undefined) { return -1; } else if (a.volume_UsableVolume > b.volume_UsableVolume) { return 1; } else if (a.volume_UsableVolume < b.volume_UsableVolume) { return -1; } else { return 0; } }); }
        else if (data === "volume_RaidSystem") { displayData.sort((a, b) => { if ((a.volume_RaidSystem === null || a.volume_RaidSystem === undefined) && (b.volume_RaidSystem === null || b.volume_RaidSystem === undefined)) { return 0; } else if (a.volume_RaidSystem === null || a.volume_RaidSystem === undefined) { return 1; } else if (b.volume_RaidSystem === null || b.volume_RaidSystem === undefined) { return -1; } else if (a.volume_RaidSystem?.toLowerCase() > b.volume_RaidSystem?.toLowerCase()) { return 1; } else if (a.volume_RaidSystem?.toLowerCase() < b.volume_RaidSystem?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "extra_DiskVolume") { displayData.sort((a, b) => { if ((a.extra_DiskVolume === null || a.extra_DiskVolume === undefined) && (b.extra_DiskVolume === null || b.extra_DiskVolume === undefined)) { return 0; } else if (a.extra_DiskVolume === null || a.extra_DiskVolume === undefined) { return 1; } else if (b.extra_DiskVolume === null || b.extra_DiskVolume === undefined) { return -1; } else if (a.extra_DiskVolume > b.extra_DiskVolume) { return 1; } else if (a.extra_DiskVolume < b.extra_DiskVolume) { return -1; } else { return 0; } }); }
        else if (data === "extra_DiskCount") { displayData.sort((a, b) => { if ((a.extra_DiskCount === null || a.extra_DiskCount === undefined) && (b.extra_DiskCount === null || b.extra_DiskCount === undefined)) { return 0; } else if (a.extra_DiskCount === null || a.extra_DiskCount === undefined) { return 1; } else if (b.extra_DiskCount === null || b.extra_DiskCount === undefined) { return -1; } else if (a.extra_DiskCount > b.extra_DiskCount) { return 1; } else if (a.extra_DiskCount < b.extra_DiskCount) { return -1; } else { return 0; } }); }
        else if (data === "iP_IPType") { displayData.sort((a, b) => { if ((a.iP_IPType === null || a.iP_IPType === undefined) && (b.iP_IPType === null || b.iP_IPType === undefined)) { return 0; } else if (a.iP_IPType === null || a.iP_IPType === undefined) { return 1; } else if (b.iP_IPType === null || b.iP_IPType === undefined) { return -1; } else if (a.iP_IPType?.toLowerCase() > b.iP_IPType?.toLowerCase()) { return 1; } else if (a.iP_IPType?.toLowerCase() < b.iP_IPType?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "iP_IPAddress") { displayData.sort((a, b) => { if ((a.iP_IPAddress === null || a.iP_IPAddress === undefined) && (b.iP_IPAddress === null || b.iP_IPAddress === undefined)) { return 0; } else if (a.iP_IPAddress === null || a.iP_IPAddress === undefined) { return 1; } else if (b.iP_IPAddress === null || b.iP_IPAddress === undefined) { return -1; } else if (a.iP_IPAddress?.toLowerCase() > b.iP_IPAddress?.toLowerCase()) { return 1; } else if (a.iP_IPAddress?.toLowerCase() < b.iP_IPAddress?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "iP_NetworkSpeed") { displayData.sort((a, b) => { if ((a.iP_NetworkSpeed === null || a.iP_NetworkSpeed === undefined) && (b.iP_NetworkSpeed === null || b.iP_NetworkSpeed === undefined)) { return 0; } else if (a.iP_NetworkSpeed === null || a.iP_NetworkSpeed === undefined) { return 1; } else if (b.iP_NetworkSpeed === null || b.iP_NetworkSpeed === undefined) { return -1; } else if (a.iP_NetworkSpeed?.toLowerCase() > b.iP_NetworkSpeed?.toLowerCase()) { return 1; } else if (a.iP_NetworkSpeed?.toLowerCase() < b.iP_NetworkSpeed?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "port_TotalPortCount") { displayData.sort((a, b) => { if ((a.port_TotalPortCount === null || a.port_TotalPortCount === undefined) && (b.port_TotalPortCount === null || b.port_TotalPortCount === undefined)) { return 0; } else if (a.port_TotalPortCount === null || a.port_TotalPortCount === undefined) { return 1; } else if (b.port_TotalPortCount === null || b.port_TotalPortCount === undefined) { return -1; } else if (a.port_TotalPortCount > b.port_TotalPortCount) { return 1; } else if (a.port_TotalPortCount < b.port_TotalPortCount) { return -1; } else { return 0; } }); }
        else if (data === "port_UsePortCount") { displayData.sort((a, b) => { if ((a.port_UsePortCount === null || a.port_UsePortCount === undefined) && (b.port_UsePortCount === null || b.port_UsePortCount === undefined)) { return 0; } else if (a.port_UsePortCount === null || a.port_UsePortCount === undefined) { return 1; } else if (b.port_UsePortCount === null || b.port_UsePortCount === undefined) { return -1; } else if (a.port_UsePortCount > b.port_UsePortCount) { return 1; } else if (a.port_UsePortCount < b.port_UsePortCount) { return -1; } else { return 0; } }); }
        else if (data === "port_LinkedSanSwitch") { displayData.sort((a, b) => { if ((a.port_LinkedSanSwitch === null || a.port_LinkedSanSwitch === undefined) && (b.port_LinkedSanSwitch === null || b.port_LinkedSanSwitch === undefined)) { return 0; } else if (a.port_LinkedSanSwitch === null || a.port_LinkedSanSwitch === undefined) { return 1; } else if (b.port_LinkedSanSwitch === null || b.port_LinkedSanSwitch === undefined) { return -1; } else if (a.port_LinkedSanSwitch?.toLowerCase() > b.port_LinkedSanSwitch?.toLowerCase()) { return 1; } else if (a.port_LinkedSanSwitch?.toLowerCase() < b.port_LinkedSanSwitch?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "port_Count") { displayData.sort((a, b) => { if ((a.port_Count === null || a.port_Count === undefined) && (b.port_Count === null || b.port_Count === undefined)) { return 0; } else if (a.port_Count === null || a.port_Count === undefined) { return 1; } else if (b.port_Count === null || b.port_Count === undefined) { return -1; } else if (a.port_Count > b.port_Count) { return 1; } else if (a.port_Count < b.port_Count) { return -1; } else { return 0; } }); }
        else if (data === "connect_ServerName") { displayData.sort((a, b) => { if ((a.connect_ServerName === null || a.connect_ServerName === undefined) && (b.connect_ServerName === null || b.connect_ServerName === undefined)) { return 0; } else if (a.connect_ServerName === null || a.connect_ServerName === undefined) { return 1; } else if (b.connect_ServerName === null || b.connect_ServerName === undefined) { return -1; } else if (a.connect_ServerName?.toLowerCase() > b.connect_ServerName?.toLowerCase()) { return 1; } else if (a.connect_ServerName?.toLowerCase() < b.connect_ServerName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "connect_Usage") { displayData.sort((a, b) => { if ((a.connect_Usage === null || a.connect_Usage === undefined) && (b.connect_Usage === null || b.connect_Usage === undefined)) { return 0; } else if (a.connect_Usage === null || a.connect_Usage === undefined) { return 1; } else if (b.connect_Usage === null || b.connect_Usage === undefined) { return -1; } else if (a.connect_Usage?.toLowerCase() > b.connect_Usage?.toLowerCase()) { return 1; } else if (a.connect_Usage?.toLowerCase() < b.connect_Usage?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "connect_ServiceLevel") { displayData.sort((a, b) => { if ((a.connect_ServiceLevel === null || a.connect_ServiceLevel === undefined) && (b.connect_ServiceLevel === null || b.connect_ServiceLevel === undefined)) { return 0; } else if (a.connect_ServiceLevel === null || a.connect_ServiceLevel === undefined) { return 1; } else if (b.connect_ServiceLevel === null || b.connect_ServiceLevel === undefined) { return -1; } else if (a.connect_ServiceLevel?.toLowerCase() > b.connect_ServiceLevel?.toLowerCase()) { return 1; } else if (a.connect_ServiceLevel?.toLowerCase() < b.connect_ServiceLevel?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "connect_ModelName") { displayData.sort((a, b) => { if ((a.connect_ModelName === null || a.connect_ModelName === undefined) && (b.connect_ModelName === null || b.connect_ModelName === undefined)) { return 0; } else if (a.connect_ModelName === null || a.connect_ModelName === undefined) { return 1; } else if (b.connect_ModelName === null || b.connect_ModelName === undefined) { return -1; } else if (a.connect_ModelName?.toLowerCase() > b.connect_ModelName?.toLowerCase()) { return 1; } else if (a.connect_ModelName?.toLowerCase() < b.connect_ModelName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "connect_OS") { displayData.sort((a, b) => { if ((a.connect_OS === null || a.connect_OS === undefined) && (b.connect_OS === null || b.connect_OS === undefined)) { return 0; } else if (a.connect_OS === null || a.connect_OS === undefined) { return 1; } else if (b.connect_OS === null || b.connect_OS === undefined) { return -1; } else if (a.connect_OS?.toLowerCase() > b.connect_OS?.toLowerCase()) { return 1; } else if (a.connect_OS?.toLowerCase() < b.connect_OS?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "connect_Cable") { displayData.sort((a, b) => { if ((a.connect_Cable === null || a.connect_Cable === undefined) && (b.connect_Cable === null || b.connect_Cable === undefined)) { return 0; } else if (a.connect_Cable === null || a.connect_Cable === undefined) { return 1; } else if (b.connect_Cable === null || b.connect_Cable === undefined) { return -1; } else if (a.connect_Cable?.toLowerCase() > b.connect_Cable?.toLowerCase()) { return 1; } else if (a.connect_Cable?.toLowerCase() < b.connect_Cable?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "connect_GivenVolume") { displayData.sort((a, b) => { if ((a.connect_GivenVolume === null || a.connect_GivenVolume === undefined) && (b.connect_GivenVolume === null || b.connect_GivenVolume === undefined)) { return 0; } else if (a.connect_GivenVolume === null || a.connect_GivenVolume === undefined) { return 1; } else if (b.connect_GivenVolume === null || b.connect_GivenVolume === undefined) { return -1; } else if (a.connect_GivenVolume > b.connect_GivenVolume) { return 1; } else if (a.connect_GivenVolume < b.connect_GivenVolume) { return -1; } else { return 0; } }); }
        else if (data === "connect_RealUseVolume") { displayData.sort((a, b) => { if ((a.connect_RealUseVolume === null || a.connect_RealUseVolume === undefined) && (b.connect_RealUseVolume === null || b.connect_RealUseVolume === undefined)) { return 0; } else if (a.connect_RealUseVolume === null || a.connect_RealUseVolume === undefined) { return 1; } else if (b.connect_RealUseVolume === null || b.connect_RealUseVolume === undefined) { return -1; } else if (a.connect_RealUseVolume > b.connect_RealUseVolume) { return 1; } else if (a.connect_RealUseVolume < b.connect_RealUseVolume) { return -1; } else { return 0; } }); }
        else if (data === "connect_EtcVolume") { displayData.sort((a, b) => { if ((a.connect_EtcVolume === null || a.connect_EtcVolume === undefined) && (b.connect_EtcVolume === null || b.connect_EtcVolume === undefined)) { return 0; } else if (a.connect_EtcVolume === null || a.connect_EtcVolume === undefined) { return 1; } else if (b.connect_EtcVolume === null || b.connect_EtcVolume === undefined) { return -1; } else if (a.connect_EtcVolume > b.connect_EtcVolume) { return 1; } else if (a.connect_EtcVolume < b.connect_EtcVolume) { return -1; } else { return 0; } }); }
        else if (data === "connect_FreeVolume") { displayData.sort((a, b) => { if ((a.connect_FreeVolume === null || a.connect_FreeVolume === undefined) && (b.connect_FreeVolume === null || b.connect_FreeVolume === undefined)) { return 0; } else if (a.connect_FreeVolume === null || a.connect_FreeVolume === undefined) { return 1; } else if (b.connect_FreeVolume === null || b.connect_FreeVolume === undefined) { return -1; } else if (a.connect_FreeVolume > b.connect_FreeVolume) { return 1; } else if (a.connect_FreeVolume < b.connect_FreeVolume) { return -1; } else { return 0; } }); }
        else if (data === "connect_MonthlyIncrease") { displayData.sort((a, b) => { if ((a.connect_MonthlyIncrease === null || a.connect_MonthlyIncrease === undefined) && (b.connect_MonthlyIncrease === null || b.connect_MonthlyIncrease === undefined)) { return 0; } else if (a.connect_MonthlyIncrease === null || a.connect_MonthlyIncrease === undefined) { return 1; } else if (b.connect_MonthlyIncrease === null || b.connect_MonthlyIncrease === undefined) { return -1; } else if (a.connect_MonthlyIncrease > b.connect_MonthlyIncrease) { return 1; } else if (a.connect_MonthlyIncrease < b.connect_MonthlyIncrease) { return -1; } else { return 0; } }); }
        else if (data === "connect_ConnectType") { displayData.sort((a, b) => { if ((a.connect_ConnectType === null || a.connect_ConnectType === undefined) && (b.connect_ConnectType === null || b.connect_ConnectType === undefined)) { return 0; } else if (a.connect_ConnectType === null || a.connect_ConnectType === undefined) { return 1; } else if (b.connect_ConnectType === null || b.connect_ConnectType === undefined) { return -1; } else if (a.connect_ConnectType?.toLowerCase() > b.connect_ConnectType?.toLowerCase()) { return 1; } else if (a.connect_ConnectType?.toLowerCase() < b.connect_ConnectType?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "connect_ChannelPathCount") { displayData.sort((a, b) => { if ((a.connect_ChannelPathCount === null || a.connect_ChannelPathCount === undefined) && (b.connect_ChannelPathCount === null || b.connect_ChannelPathCount === undefined)) { return 0; } else if (a.connect_ChannelPathCount === null || a.connect_ChannelPathCount === undefined) { return 1; } else if (b.connect_ChannelPathCount === null || b.connect_ChannelPathCount === undefined) { return -1; } else if (a.connect_ChannelPathCount > b.connect_ChannelPathCount) { return 1; } else if (a.connect_ChannelPathCount < b.connect_ChannelPathCount) { return -1; } else { return 0; } }); }
        else if (data === "connect_PathDualSolution") { displayData.sort((a, b) => { if ((a.connect_PathDualSolution === null || a.connect_PathDualSolution === undefined) && (b.connect_PathDualSolution === null || b.connect_PathDualSolution === undefined)) { return 0; } else if (a.connect_PathDualSolution === null || a.connect_PathDualSolution === undefined) { return 1; } else if (b.connect_PathDualSolution === null || b.connect_PathDualSolution === undefined) { return -1; } else if (a.connect_PathDualSolution?.toLowerCase() > b.connect_PathDualSolution?.toLowerCase()) { return 1; } else if (a.connect_PathDualSolution?.toLowerCase() < b.connect_PathDualSolution?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_ReceiveDate") { displayData.sort((a, b) => { if ((a.basic_ReceiveDate === null || a.basic_ReceiveDate === undefined) && (b.basic_ReceiveDate === null || b.basic_ReceiveDate === undefined)) { return 0; } else if (a.basic_ReceiveDate === null || a.basic_ReceiveDate === undefined) { return 1; } else if (b.basic_ReceiveDate === null || b.basic_ReceiveDate === undefined) { return -1; } else if (a.basic_ReceiveDate > b.basic_ReceiveDate) { return 1; } else if (a.basic_ReceiveDate < b.basic_ReceiveDate) { return -1; } else { return 0; } }); }
        else if (data === "basic_RegDate") { displayData.sort((a, b) => { if ((a.basic_RegDate === null || a.basic_RegDate === undefined) && (b.basic_RegDate === null || b.basic_RegDate === undefined)) { return 0; } else if (a.basic_RegDate === null || a.basic_RegDate === undefined) { return 1; } else if (b.basic_RegDate === null || b.basic_RegDate === undefined) { return -1; } else if (a.basic_RegDate > b.basic_RegDate) { return 1; } else if (a.basic_RegDate < b.basic_RegDate) { return -1; } else { return 0; } }); }
        else if (data === "basic_DiscardDate") { displayData.sort((a, b) => { if ((a.basic_DiscardDate === null || a.basic_DiscardDate === undefined) && (b.basic_DiscardDate === null || b.basic_DiscardDate === undefined)) { return 0; } else if (a.basic_DiscardDate === null || a.basic_DiscardDate === undefined) { return 1; } else if (b.basic_DiscardDate === null || b.basic_DiscardDate === undefined) { return -1; } else if (a.basic_DiscardDate > b.basic_DiscardDate) { return 1; } else if (a.basic_DiscardDate < b.basic_DiscardDate) { return -1; } else { return 0; } }); }
        else if (data === "basic_OverUsedYear") { displayData.sort((a, b) => { if ((a.basic_OverUsedYear === null || a.basic_OverUsedYear === undefined) && (b.basic_OverUsedYear === null || b.basic_OverUsedYear === undefined)) { return 0; } else if (a.basic_OverUsedYear === null || a.basic_OverUsedYear === undefined) { return 1; } else if (b.basic_OverUsedYear === null || b.basic_OverUsedYear === undefined) { return -1; } else if (a.basic_OverUsedYear > b.basic_OverUsedYear) { return 1; } else if (a.basic_OverUsedYear < b.basic_OverUsedYear) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_WarrantyExpiredDate") { displayData.sort((a, b) => { if ((a.maintenance_WarrantyExpiredDate === null || a.maintenance_WarrantyExpiredDate === undefined) && (b.maintenance_WarrantyExpiredDate === null || b.maintenance_WarrantyExpiredDate === undefined)) { return 0; } else if (a.maintenance_WarrantyExpiredDate === null || a.maintenance_WarrantyExpiredDate === undefined) { return 1; } else if (b.maintenance_WarrantyExpiredDate === null || b.maintenance_WarrantyExpiredDate === undefined) { return -1; } else if (a.maintenance_WarrantyExpiredDate > b.maintenance_WarrantyExpiredDate) { return 1; } else if (a.maintenance_WarrantyExpiredDate < b.maintenance_WarrantyExpiredDate) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_EOSDate") { displayData.sort((a, b) => { if ((a.maintenance_EOSDate === null || a.maintenance_EOSDate === undefined) && (b.maintenance_EOSDate === null || b.maintenance_EOSDate === undefined)) { return 0; } else if (a.maintenance_EOSDate === null || a.maintenance_EOSDate === undefined) { return 1; } else if (b.maintenance_EOSDate === null || b.maintenance_EOSDate === undefined) { return -1; } else if (a.maintenance_EOSDate > b.maintenance_EOSDate) { return 1; } else if (a.maintenance_EOSDate < b.maintenance_EOSDate) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_EOLDate") { displayData.sort((a, b) => { if ((a.maintenance_EOLDate === null || a.maintenance_EOLDate === undefined) && (b.maintenance_EOLDate === null || b.maintenance_EOLDate === undefined)) { return 0; } else if (a.maintenance_EOLDate === null || a.maintenance_EOLDate === undefined) { return 1; } else if (b.maintenance_EOLDate === null || b.maintenance_EOLDate === undefined) { return -1; } else if (a.maintenance_EOLDate > b.maintenance_EOLDate) { return 1; } else if (a.maintenance_EOLDate < b.maintenance_EOLDate) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_EOSL") { displayData.sort((a, b) => { if ((a.maintenance_EOSL === null || a.maintenance_EOSL === undefined) && (b.maintenance_EOSL === null || b.maintenance_EOSL === undefined)) { return 0; } else if (a.maintenance_EOSL === null || a.maintenance_EOSL === undefined) { return 1; } else if (b.maintenance_EOSL === null || b.maintenance_EOSL === undefined) { return -1; } else if (a.maintenance_EOSL > b.maintenance_EOSL) { return 1; } else if (a.maintenance_EOSL < b.maintenance_EOSL) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_EOSLDate") { displayData.sort((a, b) => { if ((a.maintenance_EOSLDate === null || a.maintenance_EOSLDate === undefined) && (b.maintenance_EOSLDate === null || b.maintenance_EOSLDate === undefined)) { return 0; } else if (a.maintenance_EOSLDate === null || a.maintenance_EOSLDate === undefined) { return 1; } else if (b.maintenance_EOSLDate === null || b.maintenance_EOSLDate === undefined) { return -1; } else if (a.maintenance_EOSLDate > b.maintenance_EOSLDate) { return 1; } else if (a.maintenance_EOSLDate < b.maintenance_EOSLDate) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_MaintenanceContract") { displayData.sort((a, b) => { if ((a.maintenance_MaintenanceContract === null || a.maintenance_MaintenanceContract === undefined) && (b.maintenance_MaintenanceContract === null || b.maintenance_MaintenanceContract === undefined)) { return 0; } else if (a.maintenance_MaintenanceContract === null || a.maintenance_MaintenanceContract === undefined) { return 1; } else if (b.maintenance_MaintenanceContract === null || b.maintenance_MaintenanceContract === undefined) { return -1; } else if (a.maintenance_MaintenanceContract > b.maintenance_MaintenanceContract) { return 1; } else if (a.maintenance_MaintenanceContract < b.maintenance_MaintenanceContract) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_MaintenanceBeginDate") { displayData.sort((a, b) => { if ((a.maintenance_MaintenanceBeginDate === null || a.maintenance_MaintenanceBeginDate === undefined) && (b.maintenance_MaintenanceBeginDate === null || b.maintenance_MaintenanceBeginDate === undefined)) { return 0; } else if (a.maintenance_MaintenanceBeginDate === null || a.maintenance_MaintenanceBeginDate === undefined) { return 1; } else if (b.maintenance_MaintenanceBeginDate === null || b.maintenance_MaintenanceBeginDate === undefined) { return -1; } else if (a.maintenance_MaintenanceBeginDate > b.maintenance_MaintenanceBeginDate) { return 1; } else if (a.maintenance_MaintenanceBeginDate < b.maintenance_MaintenanceBeginDate) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_MaintenanceEndDate") { displayData.sort((a, b) => { if ((a.maintenance_MaintenanceEndDate === null || a.maintenance_MaintenanceEndDate === undefined) && (b.maintenance_MaintenanceEndDate === null || b.maintenance_MaintenanceEndDate === undefined)) { return 0; } else if (a.maintenance_MaintenanceEndDate === null || a.maintenance_MaintenanceEndDate === undefined) { return 1; } else if (b.maintenance_MaintenanceEndDate === null || b.maintenance_MaintenanceEndDate === undefined) { return -1; } else if (a.maintenance_MaintenanceEndDate > b.maintenance_MaintenanceEndDate) { return 1; } else if (a.maintenance_MaintenanceEndDate < b.maintenance_MaintenanceEndDate) { return -1; } else { return 0; } }); }
        else if (data === "hW_MultiPath") { displayData.sort((a, b) => { if ((a.hW_MultiPath === null || a.hW_MultiPath === undefined) && (b.hW_MultiPath === null || b.hW_MultiPath === undefined)) { return 0; } else if (a.hW_MultiPath === null || a.hW_MultiPath === undefined) { return 1; } else if (b.hW_MultiPath === null || b.hW_MultiPath === undefined) { return -1; } else if (a.hW_MultiPath > b.hW_MultiPath) { return 1; } else if (a.hW_MultiPath < b.hW_MultiPath) { return -1; } else { return 0; } }); }
        else if (data === "dual_DualUse") { displayData.sort((a, b) => { if ((a.dual_DualUse === null || a.dual_DualUse === undefined) && (b.dual_DualUse === null || b.dual_DualUse === undefined)) { return 0; } else if (a.dual_DualUse === null || a.dual_DualUse === undefined) { return 1; } else if (b.dual_DualUse === null || b.dual_DualUse === undefined) { return -1; } else if (a.dual_DualUse > b.dual_DualUse) { return 1; } else if (a.dual_DualUse < b.dual_DualUse) { return -1; } else { return 0; } }); }
        else if (data === "dual_BoxDualUse") { displayData.sort((a, b) => { if ((a.dual_BoxDualUse === null || a.dual_BoxDualUse === undefined) && (b.dual_BoxDualUse === null || b.dual_BoxDualUse === undefined)) { return 0; } else if (a.dual_BoxDualUse === null || a.dual_BoxDualUse === undefined) { return 1; } else if (b.dual_BoxDualUse === null || b.dual_BoxDualUse === undefined) { return -1; } else if (a.dual_BoxDualUse > b.dual_BoxDualUse) { return 1; } else if (a.dual_BoxDualUse < b.dual_BoxDualUse) { return -1; } else { return 0; } }); }
        else if (data === "dual_ControllerDualUse") { displayData.sort((a, b) => { if ((a.dual_ControllerDualUse === null || a.dual_ControllerDualUse === undefined) && (b.dual_ControllerDualUse === null || b.dual_ControllerDualUse === undefined)) { return 0; } else if (a.dual_ControllerDualUse === null || a.dual_ControllerDualUse === undefined) { return 1; } else if (b.dual_ControllerDualUse === null || b.dual_ControllerDualUse === undefined) { return -1; } else if (a.dual_ControllerDualUse > b.dual_ControllerDualUse) { return 1; } else if (a.dual_ControllerDualUse < b.dual_ControllerDualUse) { return -1; } else { return 0; } }); }
        else if (data === "dual_PowerDualUse") { displayData.sort((a, b) => { if ((a.dual_PowerDualUse === null || a.dual_PowerDualUse === undefined) && (b.dual_PowerDualUse === null || b.dual_PowerDualUse === undefined)) { return 0; } else if (a.dual_PowerDualUse === null || a.dual_PowerDualUse === undefined) { return 1; } else if (b.dual_PowerDualUse === null || b.dual_PowerDualUse === undefined) { return -1; } else if (a.dual_PowerDualUse > b.dual_PowerDualUse) { return 1; } else if (a.dual_PowerDualUse < b.dual_PowerDualUse) { return -1; } else { return 0; } }); }
        else if (data === "dual_PDUDualUse") { displayData.sort((a, b) => { if ((a.dual_PDUDualUse === null || a.dual_PDUDualUse === undefined) && (b.dual_PDUDualUse === null || b.dual_PDUDualUse === undefined)) { return 0; } else if (a.dual_PDUDualUse === null || a.dual_PDUDualUse === undefined) { return 1; } else if (b.dual_PDUDualUse === null || b.dual_PDUDualUse === undefined) { return -1; } else if (a.dual_PDUDualUse > b.dual_PDUDualUse) { return 1; } else if (a.dual_PDUDualUse < b.dual_PDUDualUse) { return -1; } else { return 0; } }); }
        else if (data === "dual_RackPowerDualUse") { displayData.sort((a, b) => { if ((a.dual_RackPowerDualUse === null || a.dual_RackPowerDualUse === undefined) && (b.dual_RackPowerDualUse === null || b.dual_RackPowerDualUse === undefined)) { return 0; } else if (a.dual_RackPowerDualUse === null || a.dual_RackPowerDualUse === undefined) { return 1; } else if (b.dual_RackPowerDualUse === null || b.dual_RackPowerDualUse === undefined) { return -1; } else if (a.dual_RackPowerDualUse > b.dual_RackPowerDualUse) { return 1; } else if (a.dual_RackPowerDualUse < b.dual_RackPowerDualUse) { return -1; } else { return 0; } }); }
        else if (data === "dual_InternalCopySWUse") { displayData.sort((a, b) => { if ((a.dual_InternalCopySWUse === null || a.dual_InternalCopySWUse === undefined) && (b.dual_InternalCopySWUse === null || b.dual_InternalCopySWUse === undefined)) { return 0; } else if (a.dual_InternalCopySWUse === null || a.dual_InternalCopySWUse === undefined) { return 1; } else if (b.dual_InternalCopySWUse === null || b.dual_InternalCopySWUse === undefined) { return -1; } else if (a.dual_InternalCopySWUse > b.dual_InternalCopySWUse) { return 1; } else if (a.dual_InternalCopySWUse < b.dual_InternalCopySWUse) { return -1; } else { return 0; } }); }
        else if (data === "dual_StorageCopyUse") { displayData.sort((a, b) => { if ((a.dual_StorageCopyUse === null || a.dual_StorageCopyUse === undefined) && (b.dual_StorageCopyUse === null || b.dual_StorageCopyUse === undefined)) { return 0; } else if (a.dual_StorageCopyUse === null || a.dual_StorageCopyUse === undefined) { return 1; } else if (b.dual_StorageCopyUse === null || b.dual_StorageCopyUse === undefined) { return -1; } else if (a.dual_StorageCopyUse > b.dual_StorageCopyUse) { return 1; } else if (a.dual_StorageCopyUse < b.dual_StorageCopyUse) { return -1; } else { return 0; } }); }
        else if (data === "volume_RegDate") { displayData.sort((a, b) => { if ((a.volume_RegDate === null || a.volume_RegDate === undefined) && (b.volume_RegDate === null || b.volume_RegDate === undefined)) { return 0; } else if (a.volume_RegDate === null || a.volume_RegDate === undefined) { return 1; } else if (b.volume_RegDate === null || b.volume_RegDate === undefined) { return -1; } else if (a.volume_RegDate > b.volume_RegDate) { return 1; } else if (a.volume_RegDate < b.volume_RegDate) { return -1; } else { return 0; } }); }
        else if (data === "port_ReceiveDate") { displayData.sort((a, b) => { if ((a.port_ReceiveDate === null || a.port_ReceiveDate === undefined) && (b.port_ReceiveDate === null || b.port_ReceiveDate === undefined)) { return 0; } else if (a.port_ReceiveDate === null || a.port_ReceiveDate === undefined) { return 1; } else if (b.port_ReceiveDate === null || b.port_ReceiveDate === undefined) { return -1; } else if (a.port_ReceiveDate > b.port_ReceiveDate) { return 1; } else if (a.port_ReceiveDate < b.port_ReceiveDate) { return -1; } else { return 0; } }); }
        else if (data === "connect_NWEquip_1") { displayData.sort((a, b) => { if ((a.connect_NWEquip_1 === null || a.connect_NWEquip_1 === undefined) && (b.connect_NWEquip_1 === null || b.connect_NWEquip_1 === undefined)) { return 0; } else if (a.connect_NWEquip_1 === null || a.connect_NWEquip_1 === undefined) { return 1; } else if (b.connect_NWEquip_1 === null || b.connect_NWEquip_1 === undefined) { return -1; } else if (a.connect_NWEquip_1?.toLowerCase() > b.connect_NWEquip_1?.toLowerCase()) { return 1; } else if (a.connect_NWEquip_1?.toLowerCase() < b.connect_NWEquip_1?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "connect_NWEquip_2") { displayData.sort((a, b) => { if ((a.connect_NWEquip_2 === null || a.connect_NWEquip_2 === undefined) && (b.connect_NWEquip_2 === null || b.connect_NWEquip_2 === undefined)) { return 0; } else if (a.connect_NWEquip_2 === null || a.connect_NWEquip_2 === undefined) { return 1; } else if (b.connect_NWEquip_2 === null || b.connect_NWEquip_2 === undefined) { return -1; } else if (a.connect_NWEquip_2?.toLowerCase() > b.connect_NWEquip_2?.toLowerCase()) { return 1; } else if (a.connect_NWEquip_2?.toLowerCase() < b.connect_NWEquip_2?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "connect_NWEquip_3") { displayData.sort((a, b) => { if ((a.connect_NWEquip_3 === null || a.connect_NWEquip_3 === undefined) && (b.connect_NWEquip_3 === null || b.connect_NWEquip_3 === undefined)) { return 0; } else if (a.connect_NWEquip_3 === null || a.connect_NWEquip_3 === undefined) { return 1; } else if (b.connect_NWEquip_3 === null || b.connect_NWEquip_3 === undefined) { return -1; } else if (a.connect_NWEquip_3?.toLowerCase() > b.connect_NWEquip_3?.toLowerCase()) { return 1; } else if (a.connect_NWEquip_3?.toLowerCase() < b.connect_NWEquip_3?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "connect_NWEquip_4") { displayData.sort((a, b) => { if ((a.connect_NWEquip_4 === null || a.connect_NWEquip_4 === undefined) && (b.connect_NWEquip_4 === null || b.connect_NWEquip_4 === undefined)) { return 0; } else if (a.connect_NWEquip_4 === null || a.connect_NWEquip_4 === undefined) { return 1; } else if (b.connect_NWEquip_4 === null || b.connect_NWEquip_4 === undefined) { return -1; } else if (a.connect_NWEquip_4?.toLowerCase() > b.connect_NWEquip_4?.toLowerCase()) { return 1; } else if (a.connect_NWEquip_4?.toLowerCase() < b.connect_NWEquip_4?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "connect_SanSwitch_1") { displayData.sort((a, b) => { if ((a.connect_SanSwitch_1 === null || a.connect_SanSwitch_1 === undefined) && (b.connect_SanSwitch_1 === null || b.connect_SanSwitch_1 === undefined)) { return 0; } else if (a.connect_SanSwitch_1 === null || a.connect_SanSwitch_1 === undefined) { return 1; } else if (b.connect_SanSwitch_1 === null || b.connect_SanSwitch_1 === undefined) { return -1; } else if (a.connect_SanSwitch_1?.toLowerCase() > b.connect_SanSwitch_1?.toLowerCase()) { return 1; } else if (a.connect_SanSwitch_1?.toLowerCase() < b.connect_SanSwitch_1?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "connect_SanSwitch_2") { displayData.sort((a, b) => { if ((a.connect_SanSwitch_2 === null || a.connect_SanSwitch_2 === undefined) && (b.connect_SanSwitch_2 === null || b.connect_SanSwitch_2 === undefined)) { return 0; } else if (a.connect_SanSwitch_2 === null || a.connect_SanSwitch_2 === undefined) { return 1; } else if (b.connect_SanSwitch_2 === null || b.connect_SanSwitch_2 === undefined) { return -1; } else if (a.connect_SanSwitch_2?.toLowerCase() > b.connect_SanSwitch_2?.toLowerCase()) { return 1; } else if (a.connect_SanSwitch_2?.toLowerCase() < b.connect_SanSwitch_2?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "connect_SanSwitch_3") { displayData.sort((a, b) => { if ((a.connect_SanSwitch_3 === null || a.connect_SanSwitch_3 === undefined) && (b.connect_SanSwitch_3 === null || b.connect_SanSwitch_3 === undefined)) { return 0; } else if (a.connect_SanSwitch_3 === null || a.connect_SanSwitch_3 === undefined) { return 1; } else if (b.connect_SanSwitch_3 === null || b.connect_SanSwitch_3 === undefined) { return -1; } else if (a.connect_SanSwitch_3?.toLowerCase() > b.connect_SanSwitch_3?.toLowerCase()) { return 1; } else if (a.connect_SanSwitch_3?.toLowerCase() < b.connect_SanSwitch_3?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "connect_SanSwitch_4") { displayData.sort((a, b) => { if ((a.connect_SanSwitch_4 === null || a.connect_SanSwitch_4 === undefined) && (b.connect_SanSwitch_4 === null || b.connect_SanSwitch_4 === undefined)) { return 0; } else if (a.connect_SanSwitch_4 === null || a.connect_SanSwitch_4 === undefined) { return 1; } else if (b.connect_SanSwitch_4 === null || b.connect_SanSwitch_4 === undefined) { return -1; } else if (a.connect_SanSwitch_4?.toLowerCase() > b.connect_SanSwitch_4?.toLowerCase()) { return 1; } else if (a.connect_SanSwitch_4?.toLowerCase() < b.connect_SanSwitch_4?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "connect_SanSwitch_5") { displayData.sort((a, b) => { if ((a.connect_SanSwitch_5 === null || a.connect_SanSwitch_5 === undefined) && (b.connect_SanSwitch_5 === null || b.connect_SanSwitch_5 === undefined)) { return 0; } else if (a.connect_SanSwitch_5 === null || a.connect_SanSwitch_5 === undefined) { return 1; } else if (b.connect_SanSwitch_5 === null || b.connect_SanSwitch_5 === undefined) { return -1; } else if (a.connect_SanSwitch_5?.toLowerCase() > b.connect_SanSwitch_5?.toLowerCase()) { return 1; } else if (a.connect_SanSwitch_5?.toLowerCase() < b.connect_SanSwitch_5?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "connect_SanSwitch_6") { displayData.sort((a, b) => { if ((a.connect_SanSwitch_6 === null || a.connect_SanSwitch_6 === undefined) && (b.connect_SanSwitch_6 === null || b.connect_SanSwitch_6 === undefined)) { return 0; } else if (a.connect_SanSwitch_6 === null || a.connect_SanSwitch_6 === undefined) { return 1; } else if (b.connect_SanSwitch_6 === null || b.connect_SanSwitch_6 === undefined) { return -1; } else if (a.connect_SanSwitch_6?.toLowerCase() > b.connect_SanSwitch_6?.toLowerCase()) { return 1; } else if (a.connect_SanSwitch_6?.toLowerCase() < b.connect_SanSwitch_6?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "connect_SanSwitch_7") { displayData.sort((a, b) => { if ((a.connect_SanSwitch_7 === null || a.connect_SanSwitch_7 === undefined) && (b.connect_SanSwitch_7 === null || b.connect_SanSwitch_7 === undefined)) { return 0; } else if (a.connect_SanSwitch_7 === null || a.connect_SanSwitch_7 === undefined) { return 1; } else if (b.connect_SanSwitch_7 === null || b.connect_SanSwitch_7 === undefined) { return -1; } else if (a.connect_SanSwitch_7?.toLowerCase() > b.connect_SanSwitch_7?.toLowerCase()) { return 1; } else if (a.connect_SanSwitch_7?.toLowerCase() < b.connect_SanSwitch_7?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "connect_SanSwitch_8") { displayData.sort((a, b) => { if ((a.connect_SanSwitch_8 === null || a.connect_SanSwitch_8 === undefined) && (b.connect_SanSwitch_8 === null || b.connect_SanSwitch_8 === undefined)) { return 0; } else if (a.connect_SanSwitch_8 === null || a.connect_SanSwitch_8 === undefined) { return 1; } else if (b.connect_SanSwitch_8 === null || b.connect_SanSwitch_8 === undefined) { return -1; } else if (a.connect_SanSwitch_8?.toLowerCase() > b.connect_SanSwitch_8?.toLowerCase()) { return 1; } else if (a.connect_SanSwitch_8?.toLowerCase() < b.connect_SanSwitch_8?.toLowerCase()) { return -1; } else { return 0; } }); }


        this.setState({ sortString: data });
    }

    clearAllCheck() {
        if (this.refAllCheck.current) {
            this.refAllCheck.current.value = false;
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
                return [null, `No(${i+1}) 스토리지명은 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.basic_Status || itemData.basic_Status.trim().length === 0) {
                return [null, `No(${i+1}) 상태는 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.basic_ItemLevel || itemData.basic_ItemLevel.trim().length === 0) {
                return [null, `No(${i+1}) Storage등급은 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.basic_Usage || itemData.basic_Usage.trim().length === 0) {
                return [null, `No(${i+1}) 용도는 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.hW_ModelName || itemData.hW_ModelName.trim().length === 0) {
                return [null, `No(${i+1}) 모델명은 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.hW_Company || itemData.hW_Company.trim().length === 0) {
                return [null, `No(${i+1}) 제조사는 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.hW_DiskType || itemData.hW_DiskType.trim().length === 0) {
                return [null, `No(${i+1}) Disk Type은 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (itemData.hW_TotalUsableVolume === null) {
                return [null, `No(${i+1}) Total Usable 용량은 필수요소입니다. 비워둘수 없습니다.`, null];
            }
        }

        return [itemDatas, null, InventoryManagement.itemType.Storage];
    }

    render() {
        if (this.props.hasNewRow() && this.props.addedDatas.length > 0) {
            this.needRefresh = true;
            return (
                <></>
            );
        }

        const [tableDataUI1, tableDataUI2, tableDataUI3, tableDataUI4, tableDataUI5, tableDataUI6] = this.getTableDataUI2();

        return (
            <>
                <div className={main.storageTable}>
                    <table ref={this.refTable1} border="1" style={{ minWidth: '7%' }}>
                        <thead>
                            <tr style={{ height: '78px' }}>
                                <th rowspan="3"><div className={main.editFlex}><span>전체</span><span><input ref={this.refAllCheck} type="checkBox" id="allCheck" onChange={(e) => this.onChangeAllCheck(e.target)} /></span></div></th>
                                <th rowspan="3" style={{ padding: '0px 15px' }}>No</th>
                                <th rowspan="3" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>스토리지명<span className={main.bottomArrowIcon} onClick={() => this.onClickSort("basic_Name")}></span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableDataUI1}
                        </tbody>
                    </table>
                    <table ref={this.refTable2} border="1" className="generalTable" style={{ minWidth: '74%' }}>
                        <thead>
                            <tr style={{ height: '26px' }}>
                                <th colspan="17">기본정보<span className={main.gleftArrowIcon} onClick={() => this.props.onClickCheck("generalCheckbox")}></span></th>
                            </tr>
                            <tr>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>상태<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_Status")}></span></th>
                                <th rowspan="2">입고일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_ReceiveDate")}></span></th>
                                <th rowspan="2">설치일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_RegDate")}></span></th>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>Storage등급<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_ItemLevel")}></span></th>
                                <th rowspan="2">도입년차(년)<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_ReceiveYears")}></span></th>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>용도<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_Usage")}></span></th>
                                <th rowspan="2">자산구분<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_OwnerCompanyName")}></span></th>
                                <th rowspan="2">주관부서<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_OwnDepartment")}></span></th>
                                <th rowspan="2">운영부서<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_OperationDepartment")}></span></th>
                                <th rowspan="2">사업장 담당자<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_SiteManager")}></span></th>
                                <th rowspan="2">폐기일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_DiscardDate")}></span></th>
                                <th rowspan="2">사용연한 초과여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_OverUsedYear")}></span></th>
                                <th rowspan="2">메모<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_Memo")}></span></th>
                                <th colspan="2">담당자<span className={main.leftArrowIcon}></span></th>
                                <th colspan="2">위치<span className={main.leftArrowIcon}></span></th>
                            </tr>
                            <tr>
                                <th>관리담당자<span className={main.downArrowIcon} onClick={() => this.onClickSort("manage_SuperviseManager")}></span></th>
                                <th>운영담당자<span className={main.downArrowIcon} onClick={() => this.onClickSort("manage_OperationManager")}></span></th>
                                <th>설치지역/단위동<span className={main.downArrowIcon} onClick={() => this.onClickSort("position_InstallRegion")}></span></th>
                                <th>랙/상세위치<span className={main.downArrowIcon} onClick={() => this.onClickSort("position_RackDetailPosition")}></span></th>
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
                            <tr style={{ height: '26px' }}>
                                <th colspan="11">유지보수정보<span className={main.mleftArrowIcon} onClick={() => this.props.onClickCheck("maintenanceCheckbox")}></span></th>
                            </tr>
                            <tr style={{ height: '52px' }}>
                                <th rowspan="2">공급업체<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_ProvideCompanyName")}></span></th>
                                <th rowspan="2">Warranty기간<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_WarrantyMonth")}></span></th>
                                <th rowspan="2">Warranty 만료일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_WarrantyExpiredDate")}></span></th>
                                <th rowspan="2">유지보수업체<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_MaintenanceCompanyName")}></span></th>
                                <th rowspan="2">EOS 일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_EOSDate")}></span></th>
                                <th rowspan="2">EOL Date<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_EOLDate")}></span></th>
                                <th rowspan="2">EOSL 여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_EOSL")}></span></th>
                                <th rowspan="2">EOSL Date<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_EOSLDate")}></span></th>
                                <th rowspan="2">유지보수 계약여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_MaintenanceContract")}></span></th>
                                <th rowspan="2">유지보수 시작일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_MaintenanceBeginDate")}></span></th>
                                <th rowspan="2">유지보수 종료일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_MaintenanceEndDate")}></span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableDataUI3}
                        </tbody>
                    </table>
                    {/* <div className={main.maintenanceBtnBox} onClick={() => this.props.onClickCheck("maintenanceCheckbox")}>
                        <span className={main.mleftArrowIcon}></span>
                    </div> */}
                    <table ref={this.refTable4} border="1" className="hardwareTable" style={{ /* minWidth: '280%' */ minWidth: '460%' }}>
                        <thead>
                            <tr style={{ height: '26px' }}>
                                <th colspan="59">하드웨어정보<span className={main.hleftArrowIcon} onClick={() => this.props.onClickCheck("hardwareCheckbox")}></span></th>
                            </tr>
                            <tr>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>모델명<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_ModelName")}></span></th>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>제조사<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_Company")}></span></th>
                                <th rowspan="2">Cache Memory<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_CacheMemory")}></span></th>
                                <th rowspan="2">시리얼번호<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_SerialNumber")}></span></th>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>Disk Type<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_DiskType")}></span></th>
                                <th rowspan="2">컨트롤러 펌웨어 버전<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_ControllerFirmwareVersion")}></span></th>
                                <th rowspan="2">Total Physical 용량<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_TotalPhysicalVolume")}></span></th>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>Total Usable 용량<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_TotalUsableVolume")}></span></th>
                                <th rowspan="2">Logical 용량(GB)<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_LogicalVolumeGB")}></span></th>
                                <th rowspan="2">여유 용량(GB)<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_FreeVolumeGB")}></span></th>
                                <th rowspan="2" style={{ width: '150px' }}>MultiPath 도입여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_MultiPath")}></span></th>
                                <th rowspan="2">MultiPath 자산명<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_MultiPathPropertyName")}></span></th>
                                <th rowspan="2">Available 용량<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_AvailableVolume")}></span></th>
                                <th rowspan="2">할당 용량(GB)<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_GivenVolumeGB")}></span></th>
                                <th rowspan="2">할당율<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_GivenRate")}></span></th>
                                <th colspan="12">이중화<span className={main.leftArrowIcon}></span></th>
                                <th colspan="7">용량<span className={main.leftArrowIcon}></span></th>
                                <th colspan="3">Spare Disk Drive<span className={main.leftArrowIcon}></span></th>
                                <th colspan="3">IP<span className={main.leftArrowIcon}></span></th>
                                <th colspan="5">Port<span className={main.leftArrowIcon}></span></th>
                                <th colspan="14">연결서버<span className={main.leftArrowIcon}></span></th>
                            </tr>
                            <tr>
                                <th>이중화여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("dual_DualUse")}></span></th>
                                <th>이중화 유형<span className={main.downArrowIcon} onClick={() => this.onClickSort("dual_DualType")}></span></th>
                                <th style={{ width: '150px' }}>Box 이중화여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("dual_BoxDualUse")}></span></th>
                                <th style={{ width: '150px' }}>Box 이중화디스크 장비명<span className={main.downArrowIcon} onClick={() => this.onClickSort("dual_BoxDualDiskEquipmentName")}></span></th>
                                <th style={{ width: '150px' }}>Box 이중화솔루션<span className={main.downArrowIcon} onClick={() => this.onClickSort("dual_BoxDualSolutionName")}></span></th>
                                <th style={{ width: '150px' }}>컨트롤러 이중화여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("dual_ControllerDualUse")}></span></th>
                                <th style={{ width: '150px' }}>Power 이중화여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("dual_PowerDualUse")}></span></th>
                                <th style={{ width: '150px' }}>PDU이중화<span className={main.downArrowIcon} onClick={() => this.onClickSort("dual_PDUDualUse")}></span></th>
                                <th style={{ width: '150px' }}>Rack 전원이중화<span className={main.downArrowIcon} onClick={() => this.onClickSort("dual_RackPowerDualUse")}></span></th>
                                <th style={{ width: '150px' }}>내부복제 S/W 사용여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("dual_InternalCopySWUse")}></span></th>
                                <th style={{ width: '150px' }}>스토리지 복제여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("dual_StorageCopyUse")}></span></th>
                                <th style={{ width: '150px' }}>스토리지 복제 방식<span className={main.downArrowIcon} onClick={() => this.onClickSort("dual_StorageCopyType")}></span></th>

                                <th>설치 일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("volume_RegDate")}></span></th>
                                <th>Disk Type<span className={main.downArrowIcon} onClick={() => this.onClickSort("volume_DiskType")}></span></th>
                                <th>개별 Disk 용량<span className={main.downArrowIcon} onClick={() => this.onClickSort("volume_EachDiskVolume")}></span></th>
                                <th>Disk 수<span className={main.downArrowIcon} onClick={() => this.onClickSort("volume_DiskCount")}></span></th>
                                <th>물리적 용량<span className={main.downArrowIcon} onClick={() => this.onClickSort("volume_PhysicalVolume")}></span></th>
                                <th>Usable 용량<span className={main.downArrowIcon} onClick={() => this.onClickSort("volume_UsableVolume")}></span></th>
                                <th>RAID 구성<span className={main.downArrowIcon} onClick={() => this.onClickSort("volume_RaidSystem")}></span></th>

                                <th>Disk Type<span className={main.downArrowIcon} onClick={() => this.onClickSort("extra_DiskType")}></span></th>
                                <th>Disk 용량<span className={main.downArrowIcon} onClick={() => this.onClickSort("extra_DiskVolume")}></span></th>
                                <th>Disk 수<span className={main.downArrowIcon} onClick={() => this.onClickSort("extra_DiskCount")}></span></th>

                                <th>IP 구분<span className={main.downArrowIcon} onClick={() => this.onClickSort("iP_IPType")}></span></th>
                                <th>IP<span className={main.downArrowIcon} onClick={() => this.onClickSort("iP_IPAddress")}></span></th>
                                <th>네트워크 속도<span className={main.downArrowIcon} onClick={() => this.onClickSort("iP_NetworkSpeed")}></span></th>

                                <th>총 Ports<span className={main.downArrowIcon} onClick={() => this.onClickSort("port_TotalPortCount")}></span></th>
                                <th>사용 Ports<span className={main.downArrowIcon} onClick={() => this.onClickSort("port_UsePortCount")}></span></th>
                                <th>연결 SAN 스위치<span className={main.downArrowIcon} onClick={() => this.onClickSort("port_LinkedSanSwitch")}></span></th>
                                <th>도입일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("port_ReceiveDate")}></span></th>
                                <th>대수<span className={main.downArrowIcon} onClick={() => this.onClickSort("port_Count")}></span></th>

                                <th>서버명<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_ServerName")}></span></th>
                                <th>용도<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_Usage")}></span></th>
                                <th>서비스 등급<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_ServiceLevel")}></span></th>
                                <th>모델명<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_ModelName")}></span></th>
                                <th>OS<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_OS")}></span></th>
                                <th>접속 Cable<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_Cable")}></span></th>
                                <th>할당 용량<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_GivenVolume")}></span></th>
                                <th>실 사용 용량(AP/DB 파일)<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_RealUseVolume")}></span></th>
                                <th>기타 용량 (관리)<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_EtcVolume")}></span></th>
                                <th>여유 용량<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_FreeVolume")}></span></th>
                                <th>월별 증가량<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_MonthlyIncrease")}></span></th>
                                <th>접속방법<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_ConnectType")}></span></th>
                                <th>연결 Channel Path 수<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_ChannelPathCount")}></span></th>
                                <th>Path 이중화 솔루션<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_PathDualSolution")}></span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableDataUI4}
                        </tbody>
                    </table>
                    {/* <div className={main.hardwareBtnBox} onClick={() => this.props.onClickCheck("hardwareCheckbox")}>
                        <span className={main.hleftArrowIcon}></span>
                    </div> */}
                    <table ref={this.refTable5} border="1" className="connectTable" style={{ minWidth: '54%' }}>
                        <thead>
                            <tr style={{ height: '26px' }}>
                                <th colspan="12">연결정보<span className={main.cleftArrowIcon} onClick={() => this.props.onClickCheck("connectCheckbox")}></span></th>
                            </tr>
                            <tr style={{ height: '52px' }}>
                                <th rowspan="2">NW장비-1<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_NWEquip_1")}></span></th>
                                <th rowspan="2">NW장비-2<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_NWEquip_2")}></span></th>
                                <th rowspan="2">NW장비-3<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_NWEquip_3")}></span></th>
                                <th rowspan="2">NW장비-4<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_NWEquip_4")}></span></th>
                                <th rowspan="2">SAN스위치-1<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_SanSwitch_1")}></span></th>
                                <th rowspan="2">SAN스위치-2<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_SanSwitch_2")}></span></th>
                                <th rowspan="2">SAN스위치-3<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_SanSwitch_3")}></span></th>
                                <th rowspan="2">SAN스위치-4<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_SanSwitch_4")}></span></th>
                                <th rowspan="2">SAN스위치-5<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_SanSwitch_5")}></span></th>
                                <th rowspan="2">SAN스위치-6<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_SanSwitch_6")}></span></th>
                                <th rowspan="2">SAN스위치-7<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_SanSwitch_7")}></span></th>
                                <th rowspan="2">SAN스위치-8<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_SanSwitch_8")}></span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableDataUI5}
                        </tbody>
                    </table>
                    {/* <div className={main.connectBtnBox} onClick={() => this.props.onClickCheck("connectCheckbox")}>
                        <span className={main.cleftArrowIcon}></span>
                    </div> */}
                    {/* <div className={main.addTableBtnBox} onClick={() => this.props.onClickCheck("addTableCheckbox")}>
                        <span className={main.aleftArrowIcon}></span>
                    </div> */}
                </div>
            </>
        );
    }
}
export default StorageTable;