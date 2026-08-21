import React, { Component } from 'react';
import $ from 'jquery';
import main from '../../../Main/css/main.module.css';
import InputText from './inputText';
import SelectBox from './selectBox';
import DatePickerBox from './datePickerBox';
import InventoryManagement from '../inventoryManagement';

class ServerTable extends Component {

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
        this.refTable7 = React.createRef();
        this.refTable8 = React.createRef();

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

        if (column === "basic_ServerName" && data.basic_ServerName !== value) {
            this.props.isModifiy(true);
            data.basic_ServerName = value;
        } else if (column === "boxName" && data.boxName !== value) {
                this.props.isModifiy(true);
                data.boxName = value;
        } else if (column === "basic_ServerCategory" && data.basic_ServerCategory !== value) {
            this.props.isModifiy(true);
            data.basic_ServerCategory = value;
        } else if (column === "basic_ProductGroup" && data.basic_ProductGroup !== value) {
            this.props.isModifiy(true);
            data.basic_ProductGroup = value;
        } else if (column === "basic_WorkSystemName" && data.basic_WorkSystemName !== value) {
            this.props.isModifiy(true);
            data.basic_WorkSystemName = value;
        } else if (column === "basic_SystemName" && data.basic_SystemName !== value) {
            this.props.isModifiy(true);
            data.basic_SystemName = value;
        } else if (column === "basic_ServerType" && data.basic_ServerType !== value) {
            this.props.isModifiy(true);
            data.basic_ServerType = value;
        } else if (column === "basic_OperationType" && data.basic_OperationType !== value) {
            this.props.isModifiy(true);
            data.basic_OperationType = value;
        } else if (column === "basic_ServerLevel" && data.basic_ServerLevel !== value) {
            this.props.isModifiy(true);
            data.basic_ServerLevel = value;
        } else if (column === "basic_ServerLevelYear_1" && data.basic_ServerLevelYear_1 !== value) {
            this.props.isModifiy(true);
            data.basic_ServerLevelYear_1 = value;
        } else if (column === "basic_ServerLevelYear" && data.basic_ServerLevelYear !== value) {
            this.props.isModifiy(true);
            data.basic_ServerLevelYear = value;
        } else if (column === "basic_Status" && data.basic_Status !== value) {
            this.props.isModifiy(true);
            data.basic_Status = value;
        } else if (column === "basic_Usage" && data.basic_Usage !== value) {
            this.props.isModifiy(true);
            data.basic_Usage = value;
        } else if (column === "basic_VirtualType" && data.basic_VirtualType !== value) {
            this.props.isModifiy(true);
            data.basic_VirtualType = value;
        } else if (column === "basic_DRType" && data.basic_DRType !== value) {
            this.props.isModifiy(true);
            data.basic_DRType = value;
        } else if (column === "basic_PropertyType" && data.basic_PropertyType !== value) {
            this.props.isModifiy(true);
            data.basic_PropertyType = value;
        } else if (column === "manage_SuperviseManager" && data.manage_SuperviseManager !== value) {
            this.props.isModifiy(true);
            data.manage_SuperviseManager = value;
        } else if (column === "manage_ServiceManager" && data.manage_ServiceManager !== value) {
            this.props.isModifiy(true);
            data.manage_ServiceManager = value;
        } else if (column === "position_InstallRegion" && data.position_InstallRegion !== value) {
            this.props.isModifiy(true);
            data.position_InstallRegion = value;
        } else if (column === "position_Region" && data.position_Region !== value) {
            this.props.isModifiy(true);
            data.position_Region = value;
        } else if (column === "position_RackDetailPosition" && data.position_RackDetailPosition !== value) {
            this.props.isModifiy(true);
            data.position_RackDetailPosition = value;
        } else if (column === "basic_OwnDepartment" && data.basic_OwnDepartment !== value) {
            this.props.isModifiy(true);
            data.basic_OwnDepartment = value;
        } else if (column === "basic_OperationDepartment" && data.basic_OperationDepartment !== value) {
            this.props.isModifiy(true);
            data.basic_OperationDepartment = value;
        } else if (column === "basic_GIMS" && data.basic_GIMS !== value) {
            this.props.isModifiy(true);
            data.basic_GIMS = value;
        } else if (column === "hW_OSType" && data.hW_OSType !== value) {
            this.props.isModifiy(true);
            data.hW_OSType = value;
        } else if (column === "hW_OS" && data.hW_OS !== value) {
            this.props.isModifiy(true);
            data.hW_OS = value;
        } else if (column === "hW_OSVersion" && data.hW_OSVersion !== value) {
            this.props.isModifiy(true);
            data.hW_OSVersion = value;
        } else if (column === "hW_OSPatchLevel" && data.hW_OSPatchLevel !== value) {
            this.props.isModifiy(true);
            data.hW_OSPatchLevel = value;
        } else if (column === "hW_OSAccountID" && data.hW_OSAccountID !== value) {
            this.props.isModifiy(true);
            data.hW_OSAccountID = value;
        } else if (column === "hW_KernelBit" && data.hW_KernelBit !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.hW_KernelBit = this.setNullableInt(value);
        } else if (column === "hW_LogicalCoreCount" && data.hW_LogicalCoreCount !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.hW_LogicalCoreCount = this.setNullableInt(value);
        } else if (column === "hW_UsableDiskVolumeGB" && data.hW_UsableDiskVolumeGB !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.hW_UsableDiskVolumeGB = this.setNullableInt(value);
        } else if (column === "hW_LogicalMemoryVolumeMB" && data.hW_LogicalMemoryVolumeMB !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.hW_LogicalMemoryVolumeMB = this.setNullableInt(value);
        } else if (column === "hW_NetworkSpeed" && data.hW_NetworkSpeed !== value) {
            this.props.isModifiy(true);
            data.hW_NetworkSpeed = value;
        } else if (column === "dual_DualType" && data.dual_DualType !== value) {
            this.props.isModifiy(true);
            data.dual_DualType = value;
        } else if (column === "dual_DualSolutionVM" && data.dual_DualSolutionVM !== value) {
            this.props.isModifiy(true);
            data.dual_DualSolutionVM = value;
        } else if (column === "dual_DualSolutionService" && data.dual_DualSolutionService !== value) {
            this.props.isModifiy(true);
            data.dual_DualSolutionService = value;
        } else if (column === "dual_DualServerVM" && data.dual_DualServerVM !== value) {
            this.props.isModifiy(true);
            data.dual_DualServerVM = value;
        } else if (column === "sW_AccountManage" && data.sW_AccountManage !== value) {
            this.props.isModifiy(true);
            data.sW_AccountManage = value;
        } else if (column === "sW_ServerAccessInstall" && data.sW_ServerAccessInstall !== value) {
            this.props.isModifiy(true);
            data.sW_ServerAccessInstall = value;
        } else if (column === "sW_InstallVaccineName" && data.sW_InstallVaccineName !== value) {
            this.props.isModifiy(true);
            data.sW_InstallVaccineName = value;
        } else if (column === "sW_InstallSWName" && data.sW_InstallSWName !== value) {
            this.props.isModifiy(true);
            data.sW_InstallSWName = value;
        } else if (column === "nW_Zone" && data.nW_Zone !== value) {
            this.props.isModifiy(true);
            data.nW_Zone = value;
        } else if (column === "nW_ServiceIPAddr" && data.nW_ServiceIPAddr !== value) {
            this.props.isModifiy(true);
            data.nW_ServiceIPAddr = value;
        } else if (column === "nW_ServiceIPDual" && data.nW_ServiceIPDual !== value) {
            this.props.isModifiy(true);
            data.nW_ServiceIPDual = value;
        } else if (column === "nW_HeartBeatIPAddr" && data.nW_HeartBeatIPAddr !== value) {
            this.props.isModifiy(true);
            data.nW_HeartBeatIPAddr = value;
        } else if (column === "nW_BackupIPAddr" && data.nW_BackupIPAddr !== value) {
            this.props.isModifiy(true);
            data.nW_BackupIPAddr = value;
        } else if (column === "nW_ManageIPAddr" && data.nW_ManageIPAddr !== value) {
            this.props.isModifiy(true);
            data.nW_ManageIPAddr = value;
        } else if (column === "nW_Etc1IPAddr" && data.nW_Etc1IPAddr !== value) {
            this.props.isModifiy(true);
            data.nW_Etc1IPAddr = value;
        } else if (column === "nW_Etc2IPAddr" && data.nW_Etc2IPAddr !== value) {
            this.props.isModifiy(true);
            data.nW_Etc2IPAddr = value;
        } else if (column === "backup_InternalOSBackupSW" && data.backup_InternalOSBackupSW !== value) {
            this.props.isModifiy(true);
            data.backup_InternalOSBackupSW = value;
        } else if (column === "backup_ExternalBackupSWType" && data.backup_ExternalBackupSWType !== value) {
            this.props.isModifiy(true);
            data.backup_ExternalBackupSWType = value;
        } else if (column === "backup_ExternalRemotePosition" && data.backup_ExternalRemotePosition !== value) {
            this.props.isModifiy(true);
            data.backup_ExternalRemotePosition = value;
        } else if (column === "basic_ReceiveDate" && data.basic_ReceiveDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.basic_ReceiveDate = this.setNullableDate(value);
        } else if (column === "basic_RegDate" && data.basic_RegDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.basic_RegDate = this.setNullableDate(value);
        } else if (column === "hW_OSInstallDate" && data.hW_OSInstallDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.hW_OSInstallDate = this.setNullableDate(value);
        } else if (column === "hW_EOS" && data.hW_EOS !== value) {
            this.props.isModifiy(true);
            data.hW_EOS = value;
        } else if (column === "hW_EOSDate" && data.hW_EOSDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.hW_EOSDate = this.setNullableDate(value);
        } else if (column === "hW_AccountTPAM" && data.hW_AccountTPAM !== value) {
            this.props.isModifiy(true);
            data.hW_AccountTPAM = value;
        } else if (column === "hW_ServerDual" && data.hW_ServerDual !== value) {
            this.props.isModifiy(true);
            data.hW_ServerDual = value;
        } else if (column === "sW_DCA" && data.sW_DCA !== value) {
            this.props.isModifiy(true);
            data.sW_DCA = value;
        } else if (column === "sW_VaccineInstall" && data.sW_VaccineInstall !== value) {
            this.props.isModifiy(true);
            data.sW_VaccineInstall = value;
        } else if (column === "nW_ManageIPDual" && data.nW_ManageIPDual !== value) {
            this.props.isModifiy(true);
            data.nW_ManageIPDual = value;
        } else if (column === "nW_HeartBeatIPDual" && data.nW_HeartBeatIPDual !== value) {
            this.props.isModifiy(true);
            data.nW_HeartBeatIPDual = value;
        } else if (column === "nW_BackIPDual" && data.nW_BackIPDual !== value) {
            this.props.isModifiy(true);
            data.nW_BackIPDual = value;
        } else if (column === "backup_InternalOSBackup" && data.backup_InternalOSBackup !== value) {
            this.props.isModifiy(true);
            data.backup_InternalOSBackup = value;
        } else if (column === "backup_ExternalBackupRun" && data.backup_ExternalBackupRun !== value) {
            this.props.isModifiy(true);
            data.backup_ExternalBackupRun = value;
        } else if (column === "backup_ExternalRemote" && data.backup_ExternalRemote !== value) {
            this.props.isModifiy(true);
            data.backup_ExternalRemote = value;
        }
    }

    onChangeCheck = (target, data) => {
        if (!data)
            return;

        let checkList = [];

        if (target.checked) {
            // 체크한 경우
            checkList.push(data.id);
            this.props.insertCheckList(checkList);
        } else {
            // 체크 해제한 경우
            checkList.push(data.id);

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
                    checkList.push(data.id);
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

        if (item.basic_ServerName && item.basic_ServerName.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_ServerCategory && item.basic_ServerCategory.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.boxName && item.boxName.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_ProductGroup && item.basic_ProductGroup.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_WorkSystemName && item.basic_WorkSystemName.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_SystemName && item.basic_SystemName.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_ServerType && item.basic_ServerType.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_OperationType && item.basic_OperationType.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_ServerLevel && item.basic_ServerLevel.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_ServerLevelYear_1 && item.basic_ServerLevelYear_1.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_ServerLevelYear && item.basic_ServerLevelYear.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_ReceiveDate && item.basic_ReceiveDate.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_RegDate && item.basic_RegDate.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_Status && item.basic_Status.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_Usage && item.basic_Usage.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_VirtualType && item.basic_VirtualType.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_DRType && item.basic_DRType.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_PropertyType && item.basic_PropertyType.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.manage_SuperviseManager && item.manage_SuperviseManager.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.manage_OperationManager && item.manage_OperationManager.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.manage_ServiceManager && item.manage_ServiceManager.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.position_InstallRegion && item.position_InstallRegion.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.position_Region && item.position_Region.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.position_RackDetailPosition && item.position_RackDetailPosition.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_OwnDepartment && item.basic_OwnDepartment.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_OperationDepartment && item.basic_OperationDepartment.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_GIMS && item.basic_GIMS.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_OSType && item.hW_OSType.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_OS && item.hW_OS.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_OSVersion && item.hW_OSVersion.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_OSPatchLevel && item.hW_OSPatchLevel.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_OSInstallDate && item.hW_OSInstallDate.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_OSAccountID && item.hW_OSAccountID.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_KernelBit && item.hW_KernelBit.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_EOS && item.hW_EOS.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_EOSDate && item.hW_EOSDate.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_AccountTPAM && item.hW_AccountTPAM.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_LogicalCoreCount && item.hW_LogicalCoreCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_UsableDiskVolumeGB && item.hW_UsableDiskVolumeGB.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_LogicalMemoryVolumeMB && item.hW_LogicalMemoryVolumeMB.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_NetworkSpeed && item.hW_NetworkSpeed.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_ServerDual && item.hW_ServerDual.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.dual_DualType && item.dual_DualType.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.dual_DualSolutionVM && item.dual_DualSolutionVM.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.dual_DualSolutionService && item.dual_DualSolutionService.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.dual_DualServerVM && item.dual_DualServerVM.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.sW_AccountManage && item.sW_AccountManage.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.sW_ServerAccessInstall && item.sW_ServerAccessInstall.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.sW_DCA && item.sW_DCA.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.sW_VaccineInstall && item.sW_VaccineInstall.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.sW_InstallVaccineName && item.sW_InstallVaccineName.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.sW_InstallSWName && item.sW_InstallSWName.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nW_Zone && item.nW_Zone.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nW_ServiceIPAddr && item.nW_ServiceIPAddr.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nW_ServiceIPDual && item.nW_ServiceIPDual.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nW_HeartBeatIPAddr && item.nW_HeartBeatIPAddr.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nW_HeartBeatIPDual && item.nW_HeartBeatIPDual.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nW_BackupIPAddr && item.nW_BackupIPAddr.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nW_BackIPDual && item.nW_BackIPDual.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nW_ManageIPAddrn && item.nW_ManageIPAddrn.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nW_ManageIPDual && item.nW_ManageIPDual.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nW_Etc1IPAddr && item.nW_Etc1IPAddr.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nW_Etc1IPAddrDual && item.nW_Etc1IPAddrDual.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nW_Etc2IPAddr && item.nW_Etc2IPAddr.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.nW_Etc2IPDual && item.nW_Etc2IPDual.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.backup_InternalOSBackup && item.backup_InternalOSBackup.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.backup_InternalOSBackupSW && item.backup_InternalOSBackupSW.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.backup_ExternalBackupRun && item.backup_ExternalBackupRun.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.backup_ExternalBackupSWType && item.backup_ExternalBackupSWType.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.backup_ExternalRemote && item.backup_ExternalRemote.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.backup_ExternalRemotePosition && item.backup_ExternalRemotePosition.toString().toLowerCase().includes(searchText)) {
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
        let tableDataUI8 = [];
        let tableDataUI9 = [];


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
                    <tr key={data.id + "_1_" + rowIndex} className={main.tableTr}>
                        <td className={main.tableTd}><input type="checkBox" className="colCheckBox" onChange={(e) => this.onChangeCheck(e.target, data)} /></td>
                        <td>{i + 1}</td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable2, rowIndex + 3)}><InputText type="text" value={data.basic_ServerName} onChange={(value) => this.onChangeInputText(data, "basic_ServerName", value)} editMode={editName} /></td>
                    </tr>
                );

                tableDataUI2.push(
                    <tr key={data.id + "_2_" + rowIndex} className={main.tableTr}>
                        <td><InputText type="text" value={data.basic_ServerCategory} onChange={(value) => this.onChangeInputText(data, "basic_ServerCategory", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.boxName} onChange={(value) => this.onChangeInputText(data, "boxName", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_ProductGroup} onChange={(value) => this.onChangeInputText(data, "basic_ProductGroup", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_WorkSystemName} onChange={(value) => this.onChangeInputText(data, "basic_WorkSystemName", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_SystemName} onChange={(value) => this.onChangeInputText(data, "basic_SystemName", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_ServerType} onChange={(value) => this.onChangeInputText(data, "basic_ServerType", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_OperationType} onChange={(value) => this.onChangeInputText(data, "basic_OperationType", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_ServerLevel} onChange={(value) => this.onChangeInputText(data, "basic_ServerLevel", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_ServerLevelYear_1} onChange={(value) => this.onChangeInputText(data, "basic_ServerLevelYear_1", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_ServerLevelYear} onChange={(value) => this.onChangeInputText(data, "basic_ServerLevelYear", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.basic_ReceiveDate} onChange={(value) => this.onChangeInputText(data, "basic_ReceiveDate", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.basic_RegDate} onChange={(value) => this.onChangeInputText(data, "basic_RegDate", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_Status} onChange={(value) => this.onChangeInputText(data, "basic_Status", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_Usage} onChange={(value) => this.onChangeInputText(data, "basic_Usage", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_VirtualType} onChange={(value) => this.onChangeInputText(data, "basic_VirtualType", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_DRType} onChange={(value) => this.onChangeInputText(data, "basic_DRType", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_PropertyType} onChange={(value) => this.onChangeInputText(data, "basic_PropertyType", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.manage_SuperviseManager} onChange={(value) => this.onChangeInputText(data, "manage_SuperviseManager", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.manage_OperationManager} onChange={(value) => this.onChangeInputText(data, "manage_OperationManager", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.manage_ServiceManager} onChange={(value) => this.onChangeInputText(data, "manage_ServiceManager", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.position_InstallRegion} onChange={(value) => this.onChangeInputText(data, "position_InstallRegion", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.position_Region} onChange={(value) => this.onChangeInputText(data, "position_Region", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.position_RackDetailPosition} onChange={(value) => this.onChangeInputText(data, "position_RackDetailPosition", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_OwnDepartment} onChange={(value) => this.onChangeInputText(data, "basic_OwnDepartment", value)} editMode={this.props.editMode} /></td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable3, rowIndex + 2)}><InputText type="text" value={data.basic_OperationDepartment} onChange={(value) => this.onChangeInputText(data, "basic_OperationDepartment", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );

                tableDataUI3.push(
                    <tr key={data.id + "_3_" + rowIndex} className={main.tableTr}>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable4, rowIndex + 2)}><InputText type="text" value={data.basic_GIMS} onChange={(value) => this.onChangeInputText(data, "basic_GIMS", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );

                tableDataUI4.push(
                    <tr key={data.id + "_4_" + rowIndex} className={main.tableTr}>
                        <td><InputText type="text" value={data.hW_OSType} onChange={(value) => this.onChangeInputText(data, "hW_OSType", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_OS} onChange={(value) => this.onChangeInputText(data, "hW_OS", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_OSVersion} onChange={(value) => this.onChangeInputText(data, "hW_OSVersion", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_OSPatchLevel} onChange={(value) => this.onChangeInputText(data, "hW_OSPatchLevel", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.hW_OSInstallDate} onChange={(value) => this.onChangeInputText(data, "hW_OSInstallDate", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_OSAccountID} onChange={(value) => this.onChangeInputText(data, "hW_OSAccountID", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.hW_KernelBit} onChange={(value) => this.onChangeInputText(data, "hW_KernelBit", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.hW_EOS} onChange={(value) => this.onChangeInputText(data, "hW_EOS", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.hW_EOSDate} onChange={(value) => this.onChangeInputText(data, "hW_EOSDate", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.hW_AccountTPAM} onChange={(value) => this.onChangeInputText(data, "hW_AccountTPAM", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.hW_LogicalCoreCount} onChange={(value) => this.onChangeInputText(data, "hW_LogicalCoreCount", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.hW_UsableDiskVolumeGB} onChange={(value) => this.onChangeInputText(data, "hW_UsableDiskVolumeGB", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.hW_LogicalMemoryVolumeMB} onChange={(value) => this.onChangeInputText(data, "hW_LogicalMemoryVolumeMB", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_NetworkSpeed} onChange={(value) => this.onChangeInputText(data, "hW_NetworkSpeed", value)} editMode={this.props.editMode} /></td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable5, rowIndex + 2)}><SelectBox type="yesno" value={data.hW_ServerDual} onChange={(value) => this.onChangeInputText(data, "hW_ServerDual", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );

                tableDataUI5.push(
                    <tr key={data.id + "_5_" + rowIndex} className={main.tableTr}>
                        <td><InputText type="text" value={data.dual_DualType} onChange={(value) => this.onChangeInputText(data, "dual_DualType", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.dual_DualSolutionVM} onChange={(value) => this.onChangeInputText(data, "dual_DualSolutionVM", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.dual_DualSolutionService} onChange={(value) => this.onChangeInputText(data, "dual_DualSolutionService", value)} editMode={this.props.editMode} /></td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable6, rowIndex + 2)}><InputText type="text" value={data.dual_DualServerVM} onChange={(value) => this.onChangeInputText(data, "dual_DualServerVM", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );

                tableDataUI6.push(
                    <tr key={data.id + "_6_" + rowIndex} className={main.tableTr}>
                        <td><InputText type="text" value={data.sW_AccountManage} onChange={(value) => this.onChangeInputText(data, "sW_AccountManage", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.sW_ServerAccessInstall} onChange={(value) => this.onChangeInputText(data, "sW_ServerAccessInstall", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.sW_DCA} onChange={(value) => this.onChangeInputText(data, "sW_DCA", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.sW_VaccineInstall} onChange={(value) => this.onChangeInputText(data, "sW_VaccineInstall", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.sW_InstallVaccineName} onChange={(value) => this.onChangeInputText(data, "sW_InstallVaccineName", value)} editMode={this.props.editMode} /></td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable7, rowIndex + 2)}><InputText type="text" value={data.sW_InstallSWName} onChange={(value) => this.onChangeInputText(data, "sW_InstallSWName", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );

                tableDataUI7.push(
                    <tr key={data.id + "_7_" + rowIndex} className={main.tableTr}>
                        <td><InputText type="text" value={data.nW_Zone} onChange={(value) => this.onChangeInputText(data, "nW_Zone", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.nW_ServiceIPAddr} onChange={(value) => this.onChangeInputText(data, "nW_ServiceIPAddr", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.nW_ServiceIPDual} onChange={(value) => this.onChangeInputText(data, "nW_ServiceIPDual", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.nW_HeartBeatIPAddr} onChange={(value) => this.onChangeInputText(data, "nW_HeartBeatIPAddr", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.nW_HeartBeatIPDual} onChange={(value) => this.onChangeInputText(data, "nW_HeartBeatIPDual", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.nW_BackupIPAddr} onChange={(value) => this.onChangeInputText(data, "nW_BackupIPAddr", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.nW_BackIPDual} onChange={(value) => this.onChangeInputText(data, "nW_BackIPDual", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.nW_ManageIPAddr} onChange={(value) => this.onChangeInputText(data, "nW_ManageIPAddr", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.nW_ManageIPDual} onChange={(value) => this.onChangeInputText(data, "nW_ManageIPDual", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.nW_Etc1IPAddr} onChange={(value) => this.onChangeInputText(data, "nW_Etc1IPAddr", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.nW_Etc1IPAddrDual} onChange={(value) => this.onChangeInputText(data, "nW_Etc1IPAddrDual", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.nW_Etc2IPAddr} onChange={(value) => this.onChangeInputText(data, "nW_Etc2IPAddr", value)} editMode={this.props.editMode} /></td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable8, rowIndex + 2)}><SelectBox type="yesno" value={data.nW_Etc2IPDual} onChange={(value) => this.onChangeInputText(data, "nW_Etc2IPDual", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );

                tableDataUI8.push(
                    <tr key={data.id + "_8_" + rowIndex} className={main.tableTr}>
                        <td><SelectBox type="yesno" value={data.backup_InternalOSBackup} onChange={(value) => this.onChangeInputText(data, "backup_InternalOSBackup", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.backup_InternalOSBackupSW} onChange={(value) => this.onChangeInputText(data, "backup_InternalOSBackupSW", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.backup_ExternalBackupRun} onChange={(value) => this.onChangeInputText(data, "backup_ExternalBackupRun", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.backup_ExternalBackupSWType} onChange={(value) => this.onChangeInputText(data, "backup_ExternalBackupSWType", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.backup_ExternalRemote} onChange={(value) => this.onChangeInputText(data, "backup_ExternalRemote", value)} editMode={this.props.editMode} /></td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable1, rowIndex + 2)}><InputText type="text" value={data.backup_ExternalRemotePosition} onChange={(value) => this.onChangeInputText(data, "backup_ExternalRemotePosition", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );

                tableDataUI9.push(
                    <tr key={data.id + "_9_" + rowIndex} className={main.tableTr}>
                        <td></td>
                    </tr>
                );

                idx++;
                _rowIndex++;
            }
        }

        return [tableDataUI1, tableDataUI2, tableDataUI3, tableDataUI4, tableDataUI5, tableDataUI6, tableDataUI7, tableDataUI8, tableDataUI9];
    }

    onClickSort = (data) => {
        if (!data)
            return;

        const displayData = this.state.displayData;
        const sortString = this.state.sortString;

        if (sortString === data)
            return;


        if (data === "basic_ServerName") { displayData.sort((a, b) => { if ((a.basic_ServerName === null || a.basic_ServerName === undefined) && (b.basic_ServerName === null || b.basic_ServerName === undefined)) { return 0; } else if (a.basic_ServerName === null || a.basic_ServerName === undefined) { return 1; } else if (b.basic_ServerName === null || b.basic_ServerName === undefined) { return -1; } else if (a.basic_ServerName?.toLowerCase() > b.basic_ServerName?.toLowerCase()) { return 1; } else if (a.basic_ServerName?.toLowerCase() < b.basic_ServerName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_ServerCategory") { displayData.sort((a, b) => { if ((a.basic_ServerCategory === null || a.basic_ServerCategory === undefined) && (b.basic_ServerCategory === null || b.basic_ServerCategory === undefined)) { return 0; } else if (a.basic_ServerCategory === null || a.basic_ServerCategory === undefined) { return 1; } else if (b.basic_ServerCategory === null || b.basic_ServerCategory === undefined) { return -1; } else if (a.basic_ServerCategory?.toLowerCase() > b.basic_ServerCategory?.toLowerCase()) { return 1; } else if (a.basic_ServerCategory?.toLowerCase() < b.basic_ServerCategory?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_ProductGroup") { displayData.sort((a, b) => { if ((a.basic_ProductGroup === null || a.basic_ProductGroup === undefined) && (b.basic_ProductGroup === null || b.basic_ProductGroup === undefined)) { return 0; } else if (a.basic_ProductGroup === null || a.basic_ProductGroup === undefined) { return 1; } else if (b.basic_ProductGroup === null || b.basic_ProductGroup === undefined) { return -1; } else if (a.basic_ProductGroup?.toLowerCase() > b.basic_ProductGroup?.toLowerCase()) { return 1; } else if (a.basic_ProductGroup?.toLowerCase() < b.basic_ProductGroup?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_WorkSystemName") { displayData.sort((a, b) => { if ((a.basic_WorkSystemName === null || a.basic_WorkSystemName === undefined) && (b.basic_WorkSystemName === null || b.basic_WorkSystemName === undefined)) { return 0; } else if (a.basic_WorkSystemName === null || a.basic_WorkSystemName === undefined) { return 1; } else if (b.basic_WorkSystemName === null || b.basic_WorkSystemName === undefined) { return -1; } else if (a.basic_WorkSystemName?.toLowerCase() > b.basic_WorkSystemName?.toLowerCase()) { return 1; } else if (a.basic_WorkSystemName?.toLowerCase() < b.basic_WorkSystemName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_SystemName") { displayData.sort((a, b) => { if ((a.basic_SystemName === null || a.basic_SystemName === undefined) && (b.basic_SystemName === null || b.basic_SystemName === undefined)) { return 0; } else if (a.basic_SystemName === null || a.basic_SystemName === undefined) { return 1; } else if (b.basic_SystemName === null || b.basic_SystemName === undefined) { return -1; } else if (a.basic_SystemName?.toLowerCase() > b.basic_SystemName?.toLowerCase()) { return 1; } else if (a.basic_SystemName?.toLowerCase() < b.basic_SystemName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_ServerType") { displayData.sort((a, b) => { if ((a.basic_ServerType === null || a.basic_ServerType === undefined) && (b.basic_ServerType === null || b.basic_ServerType === undefined)) { return 0; } else if (a.basic_ServerType === null || a.basic_ServerType === undefined) { return 1; } else if (b.basic_ServerType === null || b.basic_ServerType === undefined) { return -1; } else if (a.basic_ServerType?.toLowerCase() > b.basic_ServerType?.toLowerCase()) { return 1; } else if (a.basic_ServerType?.toLowerCase() < b.basic_ServerType?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_OperationType") { displayData.sort((a, b) => { if ((a.basic_OperationType === null || a.basic_OperationType === undefined) && (b.basic_OperationType === null || b.basic_OperationType === undefined)) { return 0; } else if (a.basic_OperationType === null || a.basic_OperationType === undefined) { return 1; } else if (b.basic_OperationType === null || b.basic_OperationType === undefined) { return -1; } else if (a.basic_OperationType?.toLowerCase() > b.basic_OperationType?.toLowerCase()) { return 1; } else if (a.basic_OperationType?.toLowerCase() < b.basic_OperationType?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_ServerLevel") { displayData.sort((a, b) => { if ((a.basic_ServerLevel === null || a.basic_ServerLevel === undefined) && (b.basic_ServerLevel === null || b.basic_ServerLevel === undefined)) { return 0; } else if (a.basic_ServerLevel === null || a.basic_ServerLevel === undefined) { return 1; } else if (b.basic_ServerLevel === null || b.basic_ServerLevel === undefined) { return -1; } else if (a.basic_ServerLevel?.toLowerCase() > b.basic_ServerLevel?.toLowerCase()) { return 1; } else if (a.basic_ServerLevel?.toLowerCase() < b.basic_ServerLevel?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_ServerLevelYear_1") { displayData.sort((a, b) => { if ((a.basic_ServerLevelYear_1 === null || a.basic_ServerLevelYear_1 === undefined) && (b.basic_ServerLevelYear_1 === null || b.basic_ServerLevelYear_1 === undefined)) { return 0; } else if (a.basic_ServerLevelYear_1 === null || a.basic_ServerLevelYear_1 === undefined) { return 1; } else if (b.basic_ServerLevelYear_1 === null || b.basic_ServerLevelYear_1 === undefined) { return -1; } else if (a.basic_ServerLevelYear_1?.toLowerCase() > b.basic_ServerLevelYear_1?.toLowerCase()) { return 1; } else if (a.basic_ServerLevelYear_1?.toLowerCase() < b.basic_ServerLevelYear_1?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_ServerLevelYear") { displayData.sort((a, b) => { if ((a.basic_ServerLevelYear === null || a.basic_ServerLevelYear === undefined) && (b.basic_ServerLevelYear === null || b.basic_ServerLevelYear === undefined)) { return 0; } else if (a.basic_ServerLevelYear === null || a.basic_ServerLevelYear === undefined) { return 1; } else if (b.basic_ServerLevelYear === null || b.basic_ServerLevelYear === undefined) { return -1; } else if (a.basic_ServerLevelYear?.toLowerCase() > b.basic_ServerLevelYear?.toLowerCase()) { return 1; } else if (a.basic_ServerLevelYear?.toLowerCase() < b.basic_ServerLevelYear?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_Status") { displayData.sort((a, b) => { if ((a.basic_Status === null || a.basic_Status === undefined) && (b.basic_Status === null || b.basic_Status === undefined)) { return 0; } else if (a.basic_Status === null || a.basic_Status === undefined) { return 1; } else if (b.basic_Status === null || b.basic_Status === undefined) { return -1; } else if (a.basic_Status?.toLowerCase() > b.basic_Status?.toLowerCase()) { return 1; } else if (a.basic_Status?.toLowerCase() < b.basic_Status?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_Usage") { displayData.sort((a, b) => { if ((a.basic_Usage === null || a.basic_Usage === undefined) && (b.basic_Usage === null || b.basic_Usage === undefined)) { return 0; } else if (a.basic_Usage === null || a.basic_Usage === undefined) { return 1; } else if (b.basic_Usage === null || b.basic_Usage === undefined) { return -1; } else if (a.basic_Usage?.toLowerCase() > b.basic_Usage?.toLowerCase()) { return 1; } else if (a.basic_Usage?.toLowerCase() < b.basic_Usage?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_VirtualType") { displayData.sort((a, b) => { if ((a.basic_VirtualType === null || a.basic_VirtualType === undefined) && (b.basic_VirtualType === null || b.basic_VirtualType === undefined)) { return 0; } else if (a.basic_VirtualType === null || a.basic_VirtualType === undefined) { return 1; } else if (b.basic_VirtualType === null || b.basic_VirtualType === undefined) { return -1; } else if (a.basic_VirtualType?.toLowerCase() > b.basic_VirtualType?.toLowerCase()) { return 1; } else if (a.basic_VirtualType?.toLowerCase() < b.basic_VirtualType?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_DRType") { displayData.sort((a, b) => { if ((a.basic_DRType === null || a.basic_DRType === undefined) && (b.basic_DRType === null || b.basic_DRType === undefined)) { return 0; } else if (a.basic_DRType === null || a.basic_DRType === undefined) { return 1; } else if (b.basic_DRType === null || b.basic_DRType === undefined) { return -1; } else if (a.basic_DRType?.toLowerCase() > b.basic_DRType?.toLowerCase()) { return 1; } else if (a.basic_DRType?.toLowerCase() < b.basic_DRType?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_PropertyType") { displayData.sort((a, b) => { if ((a.basic_PropertyType === null || a.basic_PropertyType === undefined) && (b.basic_PropertyType === null || b.basic_PropertyType === undefined)) { return 0; } else if (a.basic_PropertyType === null || a.basic_PropertyType === undefined) { return 1; } else if (b.basic_PropertyType === null || b.basic_PropertyType === undefined) { return -1; } else if (a.basic_PropertyType?.toLowerCase() > b.basic_PropertyType?.toLowerCase()) { return 1; } else if (a.basic_PropertyType?.toLowerCase() < b.basic_PropertyType?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "manage_SuperviseManager") { displayData.sort((a, b) => { if ((a.manage_SuperviseManager === null || a.manage_SuperviseManager === undefined) && (b.manage_SuperviseManager === null || b.manage_SuperviseManager === undefined)) { return 0; } else if (a.manage_SuperviseManager === null || a.manage_SuperviseManager === undefined) { return 1; } else if (b.manage_SuperviseManager === null || b.manage_SuperviseManager === undefined) { return -1; } else if (a.manage_SuperviseManager?.toLowerCase() > b.manage_SuperviseManager?.toLowerCase()) { return 1; } else if (a.manage_SuperviseManager?.toLowerCase() < b.manage_SuperviseManager?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "manage_ServiceManager") { displayData.sort((a, b) => { if ((a.manage_ServiceManager === null || a.manage_ServiceManager === undefined) && (b.manage_ServiceManager === null || b.manage_ServiceManager === undefined)) { return 0; } else if (a.manage_ServiceManager === null || a.manage_ServiceManager === undefined) { return 1; } else if (b.manage_ServiceManager === null || b.manage_ServiceManager === undefined) { return -1; } else if (a.manage_ServiceManager?.toLowerCase() > b.manage_ServiceManager?.toLowerCase()) { return 1; } else if (a.manage_ServiceManager?.toLowerCase() < b.manage_ServiceManager?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "position_InstallRegion") { displayData.sort((a, b) => { if ((a.position_InstallRegion === null || a.position_InstallRegion === undefined) && (b.position_InstallRegion === null || b.position_InstallRegion === undefined)) { return 0; } else if (a.position_InstallRegion === null || a.position_InstallRegion === undefined) { return 1; } else if (b.position_InstallRegion === null || b.position_InstallRegion === undefined) { return -1; } else if (a.position_InstallRegion?.toLowerCase() > b.position_InstallRegion?.toLowerCase()) { return 1; } else if (a.position_InstallRegion?.toLowerCase() < b.position_InstallRegion?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "position_Region") { displayData.sort((a, b) => { if ((a.position_Region === null || a.position_Region === undefined) && (b.position_Region === null || b.position_Region === undefined)) { return 0; } else if (a.position_Region === null || a.position_Region === undefined) { return 1; } else if (b.position_Region === null || b.position_Region === undefined) { return -1; } else if (a.position_Region?.toLowerCase() > b.position_Region?.toLowerCase()) { return 1; } else if (a.position_Region?.toLowerCase() < b.position_Region?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "position_RackDetailPosition") { displayData.sort((a, b) => { if ((a.position_RackDetailPosition === null || a.position_RackDetailPosition === undefined) && (b.position_RackDetailPosition === null || b.position_RackDetailPosition === undefined)) { return 0; } else if (a.position_RackDetailPosition === null || a.position_RackDetailPosition === undefined) { return 1; } else if (b.position_RackDetailPosition === null || b.position_RackDetailPosition === undefined) { return -1; } else if (a.position_RackDetailPosition?.toLowerCase() > b.position_RackDetailPosition?.toLowerCase()) { return 1; } else if (a.position_RackDetailPosition?.toLowerCase() < b.position_RackDetailPosition?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_OwnDepartment") { displayData.sort((a, b) => { if ((a.basic_OwnDepartment === null || a.basic_OwnDepartment === undefined) && (b.basic_OwnDepartment === null || b.basic_OwnDepartment === undefined)) { return 0; } else if (a.basic_OwnDepartment === null || a.basic_OwnDepartment === undefined) { return 1; } else if (b.basic_OwnDepartment === null || b.basic_OwnDepartment === undefined) { return -1; } else if (a.basic_OwnDepartment?.toLowerCase() > b.basic_OwnDepartment?.toLowerCase()) { return 1; } else if (a.basic_OwnDepartment?.toLowerCase() < b.basic_OwnDepartment?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_OperationDepartment") { displayData.sort((a, b) => { if ((a.basic_OperationDepartment === null || a.basic_OperationDepartment === undefined) && (b.basic_OperationDepartment === null || b.basic_OperationDepartment === undefined)) { return 0; } else if (a.basic_OperationDepartment === null || a.basic_OperationDepartment === undefined) { return 1; } else if (b.basic_OperationDepartment === null || b.basic_OperationDepartment === undefined) { return -1; } else if (a.basic_OperationDepartment?.toLowerCase() > b.basic_OperationDepartment?.toLowerCase()) { return 1; } else if (a.basic_OperationDepartment?.toLowerCase() < b.basic_OperationDepartment?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_GIMS") { displayData.sort((a, b) => { if ((a.basic_GIMS === null || a.basic_GIMS === undefined) && (b.basic_GIMS === null || b.basic_GIMS === undefined)) { return 0; } else if (a.basic_GIMS === null || a.basic_GIMS === undefined) { return 1; } else if (b.basic_GIMS === null || b.basic_GIMS === undefined) { return -1; } else if (a.basic_GIMS?.toLowerCase() > b.basic_GIMS?.toLowerCase()) { return 1; } else if (a.basic_GIMS?.toLowerCase() < b.basic_GIMS?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_OSType") { displayData.sort((a, b) => { if ((a.hW_OSType === null || a.hW_OSType === undefined) && (b.hW_OSType === null || b.hW_OSType === undefined)) { return 0; } else if (a.hW_OSType === null || a.hW_OSType === undefined) { return 1; } else if (b.hW_OSType === null || b.hW_OSType === undefined) { return -1; } else if (a.hW_OSType?.toLowerCase() > b.hW_OSType?.toLowerCase()) { return 1; } else if (a.hW_OSType?.toLowerCase() < b.hW_OSType?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_OS") { displayData.sort((a, b) => { if ((a.hW_OS === null || a.hW_OS === undefined) && (b.hW_OS === null || b.hW_OS === undefined)) { return 0; } else if (a.hW_OS === null || a.hW_OS === undefined) { return 1; } else if (b.hW_OS === null || b.hW_OS === undefined) { return -1; } else if (a.hW_OS?.toLowerCase() > b.hW_OS?.toLowerCase()) { return 1; } else if (a.hW_OS?.toLowerCase() < b.hW_OS?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_OSVersion") { displayData.sort((a, b) => { if ((a.hW_OSVersion === null || a.hW_OSVersion === undefined) && (b.hW_OSVersion === null || b.hW_OSVersion === undefined)) { return 0; } else if (a.hW_OSVersion === null || a.hW_OSVersion === undefined) { return 1; } else if (b.hW_OSVersion === null || b.hW_OSVersion === undefined) { return -1; } else if (a.hW_OSVersion?.toLowerCase() > b.hW_OSVersion?.toLowerCase()) { return 1; } else if (a.hW_OSVersion?.toLowerCase() < b.hW_OSVersion?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_OSPatchLevel") { displayData.sort((a, b) => { if ((a.hW_OSPatchLevel === null || a.hW_OSPatchLevel === undefined) && (b.hW_OSPatchLevel === null || b.hW_OSPatchLevel === undefined)) { return 0; } else if (a.hW_OSPatchLevel === null || a.hW_OSPatchLevel === undefined) { return 1; } else if (b.hW_OSPatchLevel === null || b.hW_OSPatchLevel === undefined) { return -1; } else if (a.hW_OSPatchLevel?.toLowerCase() > b.hW_OSPatchLevel?.toLowerCase()) { return 1; } else if (a.hW_OSPatchLevel?.toLowerCase() < b.hW_OSPatchLevel?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_OSAccountID") { displayData.sort((a, b) => { if ((a.hW_OSAccountID === null || a.hW_OSAccountID === undefined) && (b.hW_OSAccountID === null || b.hW_OSAccountID === undefined)) { return 0; } else if (a.hW_OSAccountID === null || a.hW_OSAccountID === undefined) { return 1; } else if (b.hW_OSAccountID === null || b.hW_OSAccountID === undefined) { return -1; } else if (a.hW_OSAccountID?.toLowerCase() > b.hW_OSAccountID?.toLowerCase()) { return 1; } else if (a.hW_OSAccountID?.toLowerCase() < b.hW_OSAccountID?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_KernelBit") { displayData.sort((a, b) => { if ((a.hW_KernelBit === null || a.hW_KernelBit === undefined) && (b.hW_KernelBit === null || b.hW_KernelBit === undefined)) { return 0; } else if (a.hW_KernelBit === null || a.hW_KernelBit === undefined) { return 1; } else if (b.hW_KernelBit === null || b.hW_KernelBit === undefined) { return -1; } else if (a.hW_KernelBit > b.hW_KernelBit) { return 1; } else if (a.hW_KernelBit < b.hW_KernelBit) { return -1; } else { return 0; } }); }
        else if (data === "hW_LogicalCoreCount") { displayData.sort((a, b) => { if ((a.hW_LogicalCoreCount === null || a.hW_LogicalCoreCount === undefined) && (b.hW_LogicalCoreCount === null || b.hW_LogicalCoreCount === undefined)) { return 0; } else if (a.hW_LogicalCoreCount === null || a.hW_LogicalCoreCount === undefined) { return 1; } else if (b.hW_LogicalCoreCount === null || b.hW_LogicalCoreCount === undefined) { return -1; } else if (a.hW_LogicalCoreCount > b.hW_LogicalCoreCount) { return 1; } else if (a.hW_LogicalCoreCount < b.hW_LogicalCoreCount) { return -1; } else { return 0; } }); }
        else if (data === "hW_UsableDiskVolumeGB") { displayData.sort((a, b) => { if ((a.hW_UsableDiskVolumeGB === null || a.hW_UsableDiskVolumeGB === undefined) && (b.hW_UsableDiskVolumeGB === null || b.hW_UsableDiskVolumeGB === undefined)) { return 0; } else if (a.hW_UsableDiskVolumeGB === null || a.hW_UsableDiskVolumeGB === undefined) { return 1; } else if (b.hW_UsableDiskVolumeGB === null || b.hW_UsableDiskVolumeGB === undefined) { return -1; } else if (a.hW_UsableDiskVolumeGB > b.hW_UsableDiskVolumeGB) { return 1; } else if (a.hW_UsableDiskVolumeGB < b.hW_UsableDiskVolumeGB) { return -1; } else { return 0; } }); }
        else if (data === "hW_LogicalMemoryVolumeMB") { displayData.sort((a, b) => { if ((a.hW_LogicalMemoryVolumeMB === null || a.hW_LogicalMemoryVolumeMB === undefined) && (b.hW_LogicalMemoryVolumeMB === null || b.hW_LogicalMemoryVolumeMB === undefined)) { return 0; } else if (a.hW_LogicalMemoryVolumeMB === null || a.hW_LogicalMemoryVolumeMB === undefined) { return 1; } else if (b.hW_LogicalMemoryVolumeMB === null || b.hW_LogicalMemoryVolumeMB === undefined) { return -1; } else if (a.hW_LogicalMemoryVolumeMB > b.hW_LogicalMemoryVolumeMB) { return 1; } else if (a.hW_LogicalMemoryVolumeMB < b.hW_LogicalMemoryVolumeMB) { return -1; } else { return 0; } }); }
        else if (data === "hW_NetworkSpeed") { displayData.sort((a, b) => { if ((a.hW_NetworkSpeed === null || a.hW_NetworkSpeed === undefined) && (b.hW_NetworkSpeed === null || b.hW_NetworkSpeed === undefined)) { return 0; } else if (a.hW_NetworkSpeed === null || a.hW_NetworkSpeed === undefined) { return 1; } else if (b.hW_NetworkSpeed === null || b.hW_NetworkSpeed === undefined) { return -1; } else if (a.hW_NetworkSpeed?.toLowerCase() > b.hW_NetworkSpeed?.toLowerCase()) { return 1; } else if (a.hW_NetworkSpeed?.toLowerCase() < b.hW_NetworkSpeed?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "dual_DualType") { displayData.sort((a, b) => { if ((a.dual_DualType === null || a.dual_DualType === undefined) && (b.dual_DualType === null || b.dual_DualType === undefined)) { return 0; } else if (a.dual_DualType === null || a.dual_DualType === undefined) { return 1; } else if (b.dual_DualType === null || b.dual_DualType === undefined) { return -1; } else if (a.dual_DualType?.toLowerCase() > b.dual_DualType?.toLowerCase()) { return 1; } else if (a.dual_DualType?.toLowerCase() < b.dual_DualType?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "dual_DualSolutionVM") { displayData.sort((a, b) => { if ((a.dual_DualSolutionVM === null || a.dual_DualSolutionVM === undefined) && (b.dual_DualSolutionVM === null || b.dual_DualSolutionVM === undefined)) { return 0; } else if (a.dual_DualSolutionVM === null || a.dual_DualSolutionVM === undefined) { return 1; } else if (b.dual_DualSolutionVM === null || b.dual_DualSolutionVM === undefined) { return -1; } else if (a.dual_DualSolutionVM?.toLowerCase() > b.dual_DualSolutionVM?.toLowerCase()) { return 1; } else if (a.dual_DualSolutionVM?.toLowerCase() < b.dual_DualSolutionVM?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "dual_DualSolutionService") { displayData.sort((a, b) => { if ((a.dual_DualSolutionService === null || a.dual_DualSolutionService === undefined) && (b.dual_DualSolutionService === null || b.dual_DualSolutionService === undefined)) { return 0; } else if (a.dual_DualSolutionService === null || a.dual_DualSolutionService === undefined) { return 1; } else if (b.dual_DualSolutionService === null || b.dual_DualSolutionService === undefined) { return -1; } else if (a.dual_DualSolutionService?.toLowerCase() > b.dual_DualSolutionService?.toLowerCase()) { return 1; } else if (a.dual_DualSolutionService?.toLowerCase() < b.dual_DualSolutionService?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "dual_DualServerVM") { displayData.sort((a, b) => { if ((a.dual_DualServerVM === null || a.dual_DualServerVM === undefined) && (b.dual_DualServerVM === null || b.dual_DualServerVM === undefined)) { return 0; } else if (a.dual_DualServerVM === null || a.dual_DualServerVM === undefined) { return 1; } else if (b.dual_DualServerVM === null || b.dual_DualServerVM === undefined) { return -1; } else if (a.dual_DualServerVM?.toLowerCase() > b.dual_DualServerVM?.toLowerCase()) { return 1; } else if (a.dual_DualServerVM?.toLowerCase() < b.dual_DualServerVM?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "sW_AccountManage") { displayData.sort((a, b) => { if ((a.sW_AccountManage === null || a.sW_AccountManage === undefined) && (b.sW_AccountManage === null || b.sW_AccountManage === undefined)) { return 0; } else if (a.sW_AccountManage === null || a.sW_AccountManage === undefined) { return 1; } else if (b.sW_AccountManage === null || b.sW_AccountManage === undefined) { return -1; } else if (a.sW_AccountManage?.toLowerCase() > b.sW_AccountManage?.toLowerCase()) { return 1; } else if (a.sW_AccountManage?.toLowerCase() < b.sW_AccountManage?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "sW_ServerAccessInstall") { displayData.sort((a, b) => { if ((a.sW_ServerAccessInstall === null || a.sW_ServerAccessInstall === undefined) && (b.sW_ServerAccessInstall === null || b.sW_ServerAccessInstall === undefined)) { return 0; } else if (a.sW_ServerAccessInstall === null || a.sW_ServerAccessInstall === undefined) { return 1; } else if (b.sW_ServerAccessInstall === null || b.sW_ServerAccessInstall === undefined) { return -1; } else if (a.sW_ServerAccessInstall?.toLowerCase() > b.sW_ServerAccessInstall?.toLowerCase()) { return 1; } else if (a.sW_ServerAccessInstall?.toLowerCase() < b.sW_ServerAccessInstall?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "sW_InstallVaccineName") { displayData.sort((a, b) => { if ((a.sW_InstallVaccineName === null || a.sW_InstallVaccineName === undefined) && (b.sW_InstallVaccineName === null || b.sW_InstallVaccineName === undefined)) { return 0; } else if (a.sW_InstallVaccineName === null || a.sW_InstallVaccineName === undefined) { return 1; } else if (b.sW_InstallVaccineName === null || b.sW_InstallVaccineName === undefined) { return -1; } else if (a.sW_InstallVaccineName?.toLowerCase() > b.sW_InstallVaccineName?.toLowerCase()) { return 1; } else if (a.sW_InstallVaccineName?.toLowerCase() < b.sW_InstallVaccineName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "sW_InstallSWName") { displayData.sort((a, b) => { if ((a.sW_InstallSWName === null || a.sW_InstallSWName === undefined) && (b.sW_InstallSWName === null || b.sW_InstallSWName === undefined)) { return 0; } else if (a.sW_InstallSWName === null || a.sW_InstallSWName === undefined) { return 1; } else if (b.sW_InstallSWName === null || b.sW_InstallSWName === undefined) { return -1; } else if (a.sW_InstallSWName?.toLowerCase() > b.sW_InstallSWName?.toLowerCase()) { return 1; } else if (a.sW_InstallSWName?.toLowerCase() < b.sW_InstallSWName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "nW_Zone") { displayData.sort((a, b) => { if ((a.nW_Zone === null || a.nW_Zone === undefined) && (b.nW_Zone === null || b.nW_Zone === undefined)) { return 0; } else if (a.nW_Zone === null || a.nW_Zone === undefined) { return 1; } else if (b.nW_Zone === null || b.nW_Zone === undefined) { return -1; } else if (a.nW_Zone?.toLowerCase() > b.nW_Zone?.toLowerCase()) { return 1; } else if (a.nW_Zone?.toLowerCase() < b.nW_Zone?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "nW_ServiceIPAddr") { displayData.sort((a, b) => { if ((a.nW_ServiceIPAddr === null || a.nW_ServiceIPAddr === undefined) && (b.nW_ServiceIPAddr === null || b.nW_ServiceIPAddr === undefined)) { return 0; } else if (a.nW_ServiceIPAddr === null || a.nW_ServiceIPAddr === undefined) { return 1; } else if (b.nW_ServiceIPAddr === null || b.nW_ServiceIPAddr === undefined) { return -1; } else if (a.nW_ServiceIPAddr?.toLowerCase() > b.nW_ServiceIPAddr?.toLowerCase()) { return 1; } else if (a.nW_ServiceIPAddr?.toLowerCase() < b.nW_ServiceIPAddr?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "nW_ServiceIPDual") { displayData.sort((a, b) => { if ((a.nW_ServiceIPDual === null || a.nW_ServiceIPDual === undefined) && (b.nW_ServiceIPDual === null || b.nW_ServiceIPDual === undefined)) { return 0; } else if (a.nW_ServiceIPDual === null || a.nW_ServiceIPDual === undefined) { return 1; } else if (b.nW_ServiceIPDual === null || b.nW_ServiceIPDual === undefined) { return -1; } else if (a.nW_ServiceIPDual?.toLowerCase() > b.nW_ServiceIPDual?.toLowerCase()) { return 1; } else if (a.nW_ServiceIPDual?.toLowerCase() < b.nW_ServiceIPDual?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "nW_HeartBeatIPAddr") { displayData.sort((a, b) => { if ((a.nW_HeartBeatIPAddr === null || a.nW_HeartBeatIPAddr === undefined) && (b.nW_HeartBeatIPAddr === null || b.nW_HeartBeatIPAddr === undefined)) { return 0; } else if (a.nW_HeartBeatIPAddr === null || a.nW_HeartBeatIPAddr === undefined) { return 1; } else if (b.nW_HeartBeatIPAddr === null || b.nW_HeartBeatIPAddr === undefined) { return -1; } else if (a.nW_HeartBeatIPAddr?.toLowerCase() > b.nW_HeartBeatIPAddr?.toLowerCase()) { return 1; } else if (a.nW_HeartBeatIPAddr?.toLowerCase() < b.nW_HeartBeatIPAddr?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "nW_BackupIPAddr") { displayData.sort((a, b) => { if ((a.nW_BackupIPAddr === null || a.nW_BackupIPAddr === undefined) && (b.nW_BackupIPAddr === null || b.nW_BackupIPAddr === undefined)) { return 0; } else if (a.nW_BackupIPAddr === null || a.nW_BackupIPAddr === undefined) { return 1; } else if (b.nW_BackupIPAddr === null || b.nW_BackupIPAddr === undefined) { return -1; } else if (a.nW_BackupIPAddr?.toLowerCase() > b.nW_BackupIPAddr?.toLowerCase()) { return 1; } else if (a.nW_BackupIPAddr?.toLowerCase() < b.nW_BackupIPAddr?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "nW_ManageIPAddr") { displayData.sort((a, b) => { if ((a.nW_ManageIPAddr === null || a.nW_ManageIPAddr === undefined) && (b.nW_ManageIPAddr === null || b.nW_ManageIPAddr === undefined)) { return 0; } else if (a.nW_ManageIPAddr === null || a.nW_ManageIPAddr === undefined) { return 1; } else if (b.nW_ManageIPAddr === null || b.nW_ManageIPAddr === undefined) { return -1; } else if (a.nW_ManageIPAddr?.toLowerCase() > b.nW_ManageIPAddr?.toLowerCase()) { return 1; } else if (a.nW_ManageIPAddr?.toLowerCase() < b.nW_ManageIPAddr?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "nW_Etc1IPAddr") { displayData.sort((a, b) => { if ((a.nW_Etc1IPAddr === null || a.nW_Etc1IPAddr === undefined) && (b.nW_Etc1IPAddr === null || b.nW_Etc1IPAddr === undefined)) { return 0; } else if (a.nW_Etc1IPAddr === null || a.nW_Etc1IPAddr === undefined) { return 1; } else if (b.nW_Etc1IPAddr === null || b.nW_Etc1IPAddr === undefined) { return -1; } else if (a.nW_Etc1IPAddr?.toLowerCase() > b.nW_Etc1IPAddr?.toLowerCase()) { return 1; } else if (a.nW_Etc1IPAddr?.toLowerCase() < b.nW_Etc1IPAddr?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "nW_Etc2IPAddr") { displayData.sort((a, b) => { if ((a.nW_Etc2IPAddr === null || a.nW_Etc2IPAddr === undefined) && (b.nW_Etc2IPAddr === null || b.nW_Etc2IPAddr === undefined)) { return 0; } else if (a.nW_Etc2IPAddr === null || a.nW_Etc2IPAddr === undefined) { return 1; } else if (b.nW_Etc2IPAddr === null || b.nW_Etc2IPAddr === undefined) { return -1; } else if (a.nW_Etc2IPAddr?.toLowerCase() > b.nW_Etc2IPAddr?.toLowerCase()) { return 1; } else if (a.nW_Etc2IPAddr?.toLowerCase() < b.nW_Etc2IPAddr?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "backup_InternalOSBackupSW") { displayData.sort((a, b) => { if ((a.backup_InternalOSBackupSW === null || a.backup_InternalOSBackupSW === undefined) && (b.backup_InternalOSBackupSW === null || b.backup_InternalOSBackupSW === undefined)) { return 0; } else if (a.backup_InternalOSBackupSW === null || a.backup_InternalOSBackupSW === undefined) { return 1; } else if (b.backup_InternalOSBackupSW === null || b.backup_InternalOSBackupSW === undefined) { return -1; } else if (a.backup_InternalOSBackupSW?.toLowerCase() > b.backup_InternalOSBackupSW?.toLowerCase()) { return 1; } else if (a.backup_InternalOSBackupSW?.toLowerCase() < b.backup_InternalOSBackupSW?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "backup_ExternalBackupSWType") { displayData.sort((a, b) => { if ((a.backup_ExternalBackupSWType === null || a.backup_ExternalBackupSWType === undefined) && (b.backup_ExternalBackupSWType === null || b.backup_ExternalBackupSWType === undefined)) { return 0; } else if (a.backup_ExternalBackupSWType === null || a.backup_ExternalBackupSWType === undefined) { return 1; } else if (b.backup_ExternalBackupSWType === null || b.backup_ExternalBackupSWType === undefined) { return -1; } else if (a.backup_ExternalBackupSWType?.toLowerCase() > b.backup_ExternalBackupSWType?.toLowerCase()) { return 1; } else if (a.backup_ExternalBackupSWType?.toLowerCase() < b.backup_ExternalBackupSWType?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "backup_ExternalRemotePosition") { displayData.sort((a, b) => { if ((a.backup_ExternalRemotePosition === null || a.backup_ExternalRemotePosition === undefined) && (b.backup_ExternalRemotePosition === null || b.backup_ExternalRemotePosition === undefined)) { return 0; } else if (a.backup_ExternalRemotePosition === null || a.backup_ExternalRemotePosition === undefined) { return 1; } else if (b.backup_ExternalRemotePosition === null || b.backup_ExternalRemotePosition === undefined) { return -1; } else if (a.backup_ExternalRemotePosition?.toLowerCase() > b.backup_ExternalRemotePosition?.toLowerCase()) { return 1; } else if (a.backup_ExternalRemotePosition?.toLowerCase() < b.backup_ExternalRemotePosition?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_ReceiveDate") { displayData.sort((a, b) => { if ((a.basic_ReceiveDate === null || a.basic_ReceiveDate === undefined) && (b.basic_ReceiveDate === null || b.basic_ReceiveDate === undefined)) { return 0; } else if (a.basic_ReceiveDate === null || a.basic_ReceiveDate === undefined) { return 1; } else if (b.basic_ReceiveDate === null || b.basic_ReceiveDate === undefined) { return -1; } else if (a.basic_ReceiveDate > b.basic_ReceiveDate) { return 1; } else if (a.basic_ReceiveDate < b.basic_ReceiveDate) { return -1; } else { return 0; } }); }
        else if (data === "basic_RegDate") { displayData.sort((a, b) => { if ((a.basic_RegDate === null || a.basic_RegDate === undefined) && (b.basic_RegDate === null || b.basic_RegDate === undefined)) { return 0; } else if (a.basic_RegDate === null || a.basic_RegDate === undefined) { return 1; } else if (b.basic_RegDate === null || b.basic_RegDate === undefined) { return -1; } else if (a.basic_RegDate > b.basic_RegDate) { return 1; } else if (a.basic_RegDate < b.basic_RegDate) { return -1; } else { return 0; } }); }
        else if (data === "hW_OSInstallDate") { displayData.sort((a, b) => { if ((a.hW_OSInstallDate === null || a.hW_OSInstallDate === undefined) && (b.hW_OSInstallDate === null || b.hW_OSInstallDate === undefined)) { return 0; } else if (a.hW_OSInstallDate === null || a.hW_OSInstallDate === undefined) { return 1; } else if (b.hW_OSInstallDate === null || b.hW_OSInstallDate === undefined) { return -1; } else if (a.hW_OSInstallDate > b.hW_OSInstallDate) { return 1; } else if (a.hW_OSInstallDate < b.hW_OSInstallDate) { return -1; } else { return 0; } }); }
        else if (data === "hW_EOS") { displayData.sort((a, b) => { if ((a.hW_EOS === null || a.hW_EOS === undefined) && (b.hW_EOS === null || b.hW_EOS === undefined)) { return 0; } else if (a.hW_EOS === null || a.hW_EOS === undefined) { return 1; } else if (b.hW_EOS === null || b.hW_EOS === undefined) { return -1; } else if (a.hW_EOS > b.hW_EOS) { return 1; } else if (a.hW_EOS < b.hW_EOS) { return -1; } else { return 0; } }); }
        else if (data === "hW_EOSDate") { displayData.sort((a, b) => { if ((a.hW_EOSDate === null || a.hW_EOSDate === undefined) && (b.hW_EOSDate === null || b.hW_EOSDate === undefined)) { return 0; } else if (a.hW_EOSDate === null || a.hW_EOSDate === undefined) { return 1; } else if (b.hW_EOSDate === null || b.hW_EOSDate === undefined) { return -1; } else if (a.hW_EOSDate > b.hW_EOSDate) { return 1; } else if (a.hW_EOSDate < b.hW_EOSDate) { return -1; } else { return 0; } }); }
        else if (data === "hW_AccountTPAM") { displayData.sort((a, b) => { if ((a.hW_AccountTPAM === null || a.hW_AccountTPAM === undefined) && (b.hW_AccountTPAM === null || b.hW_AccountTPAM === undefined)) { return 0; } else if (a.hW_AccountTPAM === null || a.hW_AccountTPAM === undefined) { return 1; } else if (b.hW_AccountTPAM === null || b.hW_AccountTPAM === undefined) { return -1; } else if (a.hW_AccountTPAM > b.hW_AccountTPAM) { return 1; } else if (a.hW_AccountTPAM < b.hW_AccountTPAM) { return -1; } else { return 0; } }); }
        else if (data === "hW_ServerDual") { displayData.sort((a, b) => { if ((a.hW_ServerDual === null || a.hW_ServerDual === undefined) && (b.hW_ServerDual === null || b.hW_ServerDual === undefined)) { return 0; } else if (a.hW_ServerDual === null || a.hW_ServerDual === undefined) { return 1; } else if (b.hW_ServerDual === null || b.hW_ServerDual === undefined) { return -1; } else if (a.hW_ServerDual > b.hW_ServerDual) { return 1; } else if (a.hW_ServerDual < b.hW_ServerDual) { return -1; } else { return 0; } }); }
        else if (data === "sW_DCA") { displayData.sort((a, b) => { if ((a.sW_DCA === null || a.sW_DCA === undefined) && (b.sW_DCA === null || b.sW_DCA === undefined)) { return 0; } else if (a.sW_DCA === null || a.sW_DCA === undefined) { return 1; } else if (b.sW_DCA === null || b.sW_DCA === undefined) { return -1; } else if (a.sW_DCA > b.sW_DCA) { return 1; } else if (a.sW_DCA < b.sW_DCA) { return -1; } else { return 0; } }); }
        else if (data === "sW_VaccineInstall") { displayData.sort((a, b) => { if ((a.sW_VaccineInstall === null || a.sW_VaccineInstall === undefined) && (b.sW_VaccineInstall === null || b.sW_VaccineInstall === undefined)) { return 0; } else if (a.sW_VaccineInstall === null || a.sW_VaccineInstall === undefined) { return 1; } else if (b.sW_VaccineInstall === null || b.sW_VaccineInstall === undefined) { return -1; } else if (a.sW_VaccineInstall > b.sW_VaccineInstall) { return 1; } else if (a.sW_VaccineInstall < b.sW_VaccineInstall) { return -1; } else { return 0; } }); }
        else if (data === "nW_ManageIPDual") { displayData.sort((a, b) => { if ((a.nW_ManageIPDual === null || a.nW_ManageIPDual === undefined) && (b.nW_ManageIPDual === null || b.nW_ManageIPDual === undefined)) { return 0; } else if (a.nW_ManageIPDual === null || a.nW_ManageIPDual === undefined) { return 1; } else if (b.nW_ManageIPDual === null || b.nW_ManageIPDual === undefined) { return -1; } else if (a.nW_ManageIPDual > b.nW_ManageIPDual) { return 1; } else if (a.nW_ManageIPDual < b.nW_ManageIPDual) { return -1; } else { return 0; } }); }
        else if (data === "nW_HeartBeatIPDual") { displayData.sort((a, b) => { if ((a.nW_HeartBeatIPDual === null || a.nW_HeartBeatIPDual === undefined) && (b.nW_HeartBeatIPDual === null || b.nW_HeartBeatIPDual === undefined)) { return 0; } else if (a.nW_HeartBeatIPDual === null || a.nW_HeartBeatIPDual === undefined) { return 1; } else if (b.nW_HeartBeatIPDual === null || b.nW_HeartBeatIPDual === undefined) { return -1; } else if (a.nW_HeartBeatIPDual > b.nW_HeartBeatIPDual) { return 1; } else if (a.nW_HeartBeatIPDual < b.nW_HeartBeatIPDual) { return -1; } else { return 0; } }); }
        else if (data === "nW_BackIPDual") { displayData.sort((a, b) => { if ((a.nW_BackIPDual === null || a.nW_BackIPDual === undefined) && (b.nW_BackIPDual === null || b.nW_BackIPDual === undefined)) { return 0; } else if (a.nW_BackIPDual === null || a.nW_BackIPDual === undefined) { return 1; } else if (b.nW_BackIPDual === null || b.nW_BackIPDual === undefined) { return -1; } else if (a.nW_BackIPDual > b.nW_BackIPDual) { return 1; } else if (a.nW_BackIPDual < b.nW_BackIPDual) { return -1; } else { return 0; } }); }
        else if (data === "nW_ManageIPDual") { displayData.sort((a, b) => { if ((a.nW_ManageIPDual === null || a.nW_ManageIPDual === undefined) && (b.nW_ManageIPDual === null || b.nW_ManageIPDual === undefined)) { return 0; } else if (a.nW_ManageIPDual === null || a.nW_ManageIPDual === undefined) { return 1; } else if (b.nW_ManageIPDual === null || b.nW_ManageIPDual === undefined) { return -1; } else if (a.nW_ManageIPDual > b.nW_ManageIPDual) { return 1; } else if (a.nW_ManageIPDual < b.nW_ManageIPDual) { return -1; } else { return 0; } }); }
        else if (data === "nW_Etc1IPAddrDual") { displayData.sort((a, b) => { if ((a.nW_Etc1IPAddrDual === null || a.nW_Etc1IPAddrDual === undefined) && (b.nW_Etc1IPAddrDual === null || b.nW_Etc1IPAddrDual === undefined)) { return 0; } else if (a.nW_Etc1IPAddrDual === null || a.nW_Etc1IPAddrDual === undefined) { return 1; } else if (b.nW_Etc1IPAddrDual === null || b.nW_Etc1IPAddrDual === undefined) { return -1; } else if (a.nW_Etc1IPAddrDual > b.nW_Etc1IPAddrDual) { return 1; } else if (a.nW_Etc1IPAddrDual < b.nW_Etc1IPAddrDual) { return -1; } else { return 0; } }); }
        else if (data === "nW_Etc2IPDual") { displayData.sort((a, b) => { if ((a.nW_Etc2IPDual === null || a.nW_Etc2IPDual === undefined) && (b.nW_Etc2IPDual === null || b.nW_Etc2IPDual === undefined)) { return 0; } else if (a.nW_Etc2IPDual === null || a.nW_Etc2IPDual === undefined) { return 1; } else if (b.nW_Etc2IPDual === null || b.nW_Etc2IPDual === undefined) { return -1; } else if (a.nW_Etc2IPDual > b.nW_Etc2IPDual) { return 1; } else if (a.nW_Etc2IPDual < b.nW_Etc2IPDual) { return -1; } else { return 0; } }); }
        else if (data === "backup_InternalOSBackup") { displayData.sort((a, b) => { if ((a.backup_InternalOSBackup === null || a.backup_InternalOSBackup === undefined) && (b.backup_InternalOSBackup === null || b.backup_InternalOSBackup === undefined)) { return 0; } else if (a.backup_InternalOSBackup === null || a.backup_InternalOSBackup === undefined) { return 1; } else if (b.backup_InternalOSBackup === null || b.backup_InternalOSBackup === undefined) { return -1; } else if (a.backup_InternalOSBackup > b.backup_InternalOSBackup) { return 1; } else if (a.backup_InternalOSBackup < b.backup_InternalOSBackup) { return -1; } else { return 0; } }); }
        else if (data === "backup_ExternalBackupRun") { displayData.sort((a, b) => { if ((a.backup_ExternalBackupRun === null || a.backup_ExternalBackupRun === undefined) && (b.backup_ExternalBackupRun === null || b.backup_ExternalBackupRun === undefined)) { return 0; } else if (a.backup_ExternalBackupRun === null || a.backup_ExternalBackupRun === undefined) { return 1; } else if (b.backup_ExternalBackupRun === null || b.backup_ExternalBackupRun === undefined) { return -1; } else if (a.backup_ExternalBackupRun > b.backup_ExternalBackupRun) { return 1; } else if (a.backup_ExternalBackupRun < b.backup_ExternalBackupRun) { return -1; } else { return 0; } }); }
        else if (data === "backup_ExternalRemote") { displayData.sort((a, b) => { if ((a.backup_ExternalRemote === null || a.backup_ExternalRemote === undefined) && (b.backup_ExternalRemote === null || b.backup_ExternalRemote === undefined)) { return 0; } else if (a.backup_ExternalRemote === null || a.backup_ExternalRemote === undefined) { return 1; } else if (b.backup_ExternalRemote === null || b.backup_ExternalRemote === undefined) { return -1; } else if (a.backup_ExternalRemote > b.backup_ExternalRemote) { return 1; } else if (a.backup_ExternalRemote < b.backup_ExternalRemote) { return -1; } else { return 0; } }); }





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

            if (!itemData.basic_ServerName || itemData.basic_ServerName.trim().length === 0) {
                return [null, `No(${i+1}) 서버명은 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.boxName || itemData.boxName.trim().length === 0) {
                return [null, `No(${i+1}) 관련BOX명은 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.basic_OperationType || itemData.basic_OperationType.trim().length === 0) {
                return [null, `No(${i+1}) 운영구분은 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.basic_ServerLevel || itemData.basic_ServerLevel.trim().length === 0) {
                return [null, `No(${i+1}) 서버등급은 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.basic_Status || itemData.basic_Status.trim().length === 0) {
                return [null, `No(${i+1}) 상태는 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.basic_Usage || itemData.basic_Usage.trim().length === 0) {
                return [null, `No(${i+1}) 용도는 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.hW_OS || itemData.hW_OS.trim().length === 0) {
                return [null, `No(${i+1}) OS는 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.hW_OSVersion || itemData.hW_OSVersion.trim().length === 0) {
                return [null, `No(${i+1}) OS Version은 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.nW_ManageIPAddr || itemData.nW_ManageIPAddr.trim().length === 0) {
                return [null, `No(${i+1}) 관리용 IP Address는 필수요소입니다. 비워둘수 없습니다.`, null];
            }
        }

        return [itemDatas, null, InventoryManagement.itemType.Server];
    }

    render() {
        if (this.props.hasNewRow() && this.props.addedDatas.length > 0) {
            this.needRefresh = true;
            return (
                <></>
            );
        }

        const [tableDataUI1, tableDataUI2, tableDataUI3, tableDataUI4, tableDataUI5, tableDataUI6, tableDataUI7, tableDataUI8, tableDataUI9] = this.getTableDataUI2();

        return (
            <>
                <div className={main.serverTable}>
                    <table ref={this.refTable1} border="1" style={{ minWidth: '8%' }}>
                        <thead>
                            <tr style={{ height: '78px' }}>
                                <th rowspan="3"><div className={main.editFlex}><span>전체</span><span><input ref={this.refAllCheck} type="checkBox" id="allCheck" onChange={(e) => this.onChangeAllCheck(e.target)} /></span></div></th>
                                <th rowspan="3" style={{ padding: '0px 15px' }}>No</th>
                                <th rowspan="3" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>서버명<span className={main.bottomArrowIcon} onClick={() => this.onClickSort("basic_ServerName")}></span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableDataUI1}
                        </tbody>
                    </table>
                    <table ref={this.refTable2} border="1" className="generalTable" style={{ minWidth: '94%' }}>
                        <thead>
                            <tr style={{ height: '26px' }}>
                                <th colspan="25">기본정보<span className={main.gleftArrowIcon} onClick={() => this.props.onClickCheck("generalCheckbox")}></span></th>
                            </tr>
                            <tr style={{ height: '26px' }}>
                                <th rowspan="2">서버구분<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_ServerCategory")}></span></th>
                                <th rowspan="2" style={{ position: 'relative', minWidth: '100px' }}><span className={main.essentialBorder}></span>관련BOX명<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_BoxName")}></span></th>
                                <th rowspan="2">제품군<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_ProductGroup")}></span></th>
                                <th rowspan="2">업무시스템명<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_WorkSystemName")}></span></th>
                                <th rowspan="2">시스템명<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_SystemName")}></span></th>
                                <th rowspan="2">서버종류<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_ServerType")}></span></th>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>운영구분<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_OperationType")}></span></th>
                                <th colspan="3">서버등급<span className={main.leftArrowIcon} ></span></th>
                                <th rowspan="2">입고일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_ReceiveDate")}></span></th>
                                <th rowspan="2">설치일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_RegDate")}></span></th>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>상태<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_Status")}></span></th>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>용도<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_Usage")}></span></th>
                                <th rowspan="2">가상화종류<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_VirtualType")}></span></th>
                                <th rowspan="2">DR구분<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_DRType")}></span></th>
                                <th rowspan="2">자산구분<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_PropertyType")}></span></th>
                                <th colspan="3">담당<span className={main.leftArrowIcon} ></span></th>
                                <th colspan="3">위치<span className={main.leftArrowIcon} ></span></th>
                                <th rowspan="2">주관부서<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_OwnDepartment")}></span></th>
                                <th rowspan="2">운영부서<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_OperationDepartment")}></span></th>
                            </tr>
                            <tr>
                                <th style={{ position: 'relative' }}><span className={main.essentialBorder}></span>서버등급<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_ServerLevel")}></span></th>
                                <th>[Year-1]년<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_ServerLevelYear_1")}></span></th>
                                <th>[Year]년<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_ServerLevelYear")}></span></th>

                                <th>관리담당자<span className={main.downArrowIcon} onClick={() => this.onClickSort("manage_SuperviseManager")}></span></th>
                                <th>운영담당자<span className={main.downArrowIcon} onClick={() => this.onClickSort("manage_OperationManager")}></span></th>
                                <th>서비스담당자<span className={main.downArrowIcon} onClick={() => this.onClickSort("manage_ServiceManager")}></span></th>
                                <th>site<span className={main.downArrowIcon} onClick={() => this.onClickSort("position_InstallRegion")}></span></th>
                                <th>단위동<span className={main.downArrowIcon} onClick={() => this.onClickSort("position_Region")}></span></th>
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
                    <table ref={this.refTable3} border="1" className="managementTable" style={{ minWidth: '3%' }}>
                        <thead>
                            <tr style={{ height: '26px' }}>
                                <th>관리정보<span className={main.mMleftArrowIcon} onClick={() => this.props.onClickCheck("managementCheckbox")}></span></th>
                            </tr>
                            <tr style={{ height: '52px' }}>
                                <th rowspan="2">GIMS<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_GIMS")}></span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableDataUI3}
                        </tbody>
                    </table>
                    {/* <div className={main.managementBtnBox} onClick={() => this.props.onClickCheck("managementCheckbox")}>
                        <span className={main.mMleftArrowIcon}></span>
                    </div> */}
                    <table ref={this.refTable4} border="1" className="hardwareTable" style={{ /* minWidth: '74%' */ minWidth: '120%' }}>
                        <thead>
                            <tr style={{ height: '26px' }}>
                                <th colspan="15">하드웨어정보<span className={main.hleftArrowIcon} onClick={() => this.props.onClickCheck("hardwareCheckbox")}></span></th>
                            </tr>
                            <tr style={{ height: '52px' }}>
                                <th rowspan="2">OS Type<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_OSType")}></span></th>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>OS<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_OS")}></span></th>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>OS Version<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_OSVersion")}></span></th>
                                <th rowspan="2">OS Patch Level<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_OSPatchLevel")}></span></th>
                                <th rowspan="2">OS 설치일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_OSInstallDate")}></span></th>
                                <th rowspan="2">OS 계정ID<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_OSAccountID")}></span></th>
                                <th rowspan="2">Kernel bit<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_KernelBit")}></span></th>
                                <th rowspan="2">EOS 여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_EOS")}></span></th>
                                <th rowspan="2">EOS Date<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_EOSDate")}></span></th>
                                <th rowspan="2">계정 TPAM적용여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_AccountTPAM")}></span></th>
                                <th rowspan="2">Logical Core수<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_LogicalCoreCount")}></span></th>
                                <th rowspan="2">Usable Disk용량(GB)<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_UsableDiskVolumeGB")}></span></th>
                                <th rowspan="2">Logical Memory용량(MB)<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_LogicalMemoryVolumeMB")}></span></th>
                                <th rowspan="2">네트워크속도<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_NetworkSpeed")}></span></th>
                                <th rowspan="2">서버 이중화여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_ServerDual")}></span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableDataUI4}
                        </tbody>
                    </table>
                    {/* <div className={main.hardwareBtnBox} onClick={() => this.props.onClickCheck("hardwareCheckbox")}>
                        <span className={main.hleftArrowIcon}></span>
                    </div> */}
                    <table ref={this.refTable5} border="1" className="redundancyTable" style={{ minWidth: '24%' }}>
                        <thead>
                            <tr style={{ height: '26px' }}>
                                <th colspan="4">이중화정보<span className={main.rleftArrowIcon} onClick={() => this.props.onClickCheck("redundancyCheckbox")}></span></th>
                            </tr>
                            <tr style={{ height: '52px' }}>
                                <th rowspan="2">이중화유형<span className={main.downArrowIcon} onClick={() => this.onClickSort("dual_DualType")}></span></th>
                                <th rowspan="2">이중화솔루션(VM)<span className={main.downArrowIcon} onClick={() => this.onClickSort("dual_DualSolutionVM")}></span></th>
                                <th rowspan="2">이중화솔루션(서비스)<span className={main.downArrowIcon} onClick={() => this.onClickSort("dual_DualSolutionService")}></span></th>
                                <th rowspan="2">이중화서버(VM)<span className={main.downArrowIcon} onClick={() => this.onClickSort("dual_DualServerVM")}></span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableDataUI5}
                        </tbody>
                    </table>
                    {/* <div className={main.redundancyBtnBox} onClick={() => this.props.onClickCheck("redundancyCheckbox")}>
                        <span className={main.rleftArrowIcon}></span>
                    </div> */}
                    <table ref={this.refTable6} border="1" className="softwareTable" style={{ minWidth: '30%' }}>
                        <thead>
                            <tr style={{ height: '26px' }}>
                                <th colspan="6">소프트웨어정보<span className={main.sleftArrowIcon} onClick={() => this.props.onClickCheck("softwareCheckbox")}></span></th>
                            </tr>
                            <tr style={{ height: '52px' }}>
                                <th rowspan="2">계정관리등록<span className={main.downArrowIcon} onClick={() => this.onClickSort("sW_AccountManage")}></span></th>
                                <th rowspan="2">서버접근제어 설치<span className={main.downArrowIcon} onClick={() => this.onClickSort("sW_ServerAccessInstall")}></span></th>
                                <th rowspan="2">DCA적용여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("sW_DCA")}></span></th>
                                <th rowspan="2">백신 설치 유무<span className={main.downArrowIcon} onClick={() => this.onClickSort("sW_VaccineInstall")}></span></th>
                                <th rowspan="2">설치 백신명<span className={main.downArrowIcon} onClick={() => this.onClickSort("sW_InstallVaccineName")}></span></th>
                                <th rowspan="2">설치 S/W<span className={main.downArrowIcon} onClick={() => this.onClickSort("sW_InstallSWName")}></span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableDataUI6}
                        </tbody>
                    </table>
                    {/* <div className={main.softwareBtnBox} onClick={() => this.props.onClickCheck("softwareCheckbox")}>
                        <span className={main.sleftArrowIcon}></span>
                    </div> */}
                    <table ref={this.refTable7} border="1" className="networkTable" style={{ minWidth: '86%' }}>
                        <thead>
                            <tr style={{ height: '26px' }}>
                                <th colspan="13">네트워크정보<span className={main.nleftArrowIcon} onClick={() => this.props.onClickCheck("networkCheckbox")}></span></th>
                            </tr>
                            <tr style={{ height: '52px' }}>
                                <th rowspan="2">Zone<span className={main.downArrowIcon} onClick={() => this.onClickSort("nW_Zone")}></span></th>
                                <th rowspan="2">서비스IP Address<span className={main.downArrowIcon} onClick={() => this.onClickSort("nW_ServiceIPAddr")}></span></th>
                                <th rowspan="2">서비스IP 이중화 유무<span className={main.downArrowIcon} onClick={() => this.onClickSort("nW_ServiceIPDual")}></span></th>
                                <th rowspan="2">Heart Beat IP Address<span className={main.downArrowIcon} onClick={() => this.onClickSort("nW_HeartBeatIPAddr")}></span></th>
                                <th rowspan="2">Heart Beat IP 이중화 유무<span className={main.downArrowIcon} onClick={() => this.onClickSort("nW_HeartBeatIPDual")}></span></th>
                                <th rowspan="2">백업 IP Address<span className={main.downArrowIcon} onClick={() => this.onClickSort("nW_BackupIPAddr")}></span></th>
                                <th rowspan="2">백업 IP 이중화 유무<span className={main.downArrowIcon} onClick={() => this.onClickSort("nW_BackIPDual")}></span></th>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>관리용 IP Address<span className={main.downArrowIcon} onClick={() => this.onClickSort("nW_ManageIPAddr")}></span></th>
                                <th rowspan="2">관리용 IP 이중화 유무<span className={main.downArrowIcon} onClick={() => this.onClickSort("nW_ManageIPDual")}></span></th>
                                <th rowspan="2">기타1 IP Address<span className={main.downArrowIcon} onClick={() => this.onClickSort("nW_Etc1IPAddr")}></span></th>
                                <th rowspan="2">기타1 IP 이중화 유무<span className={main.downArrowIcon} onClick={() => this.onClickSort("nW_Etc1IPAddrDual")}></span></th>
                                <th rowspan="2">기타2 IP Address<span className={main.downArrowIcon} onClick={() => this.onClickSort("nW_Etc2IPAddr")}></span></th>
                                <th rowspan="2">기타2 IP 이중화 유무<span className={main.downArrowIcon} onClick={() => this.onClickSort("nW_Etc2IPDual")}></span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableDataUI7}
                        </tbody>
                    </table>
                    {/* <div className={main.networkBtnBox} onClick={() => this.props.onClickCheck("networkCheckbox")}>
                        <span className={main.nleftArrowIcon}></span>
                    </div> */}
                    <table ref={this.refTable8} border="1" className="backupTable" style={{ minWidth: '46%' }}>
                        <thead>
                            <tr style={{ height: '26px' }}>
                                <th colspan="6">백업정보<span className={main.bleftArrowIcon} onClick={() => this.props.onClickCheck("backupCheckbox")}></span></th>
                            </tr>
                            <tr style={{ height: '52px' }}>
                                <th rowspan="2">Internal OS 백업 유무<span className={main.downArrowIcon} onClick={() => this.onClickSort("backup_InternalOSBackup")}></span></th>
                                <th rowspan="2">Internal OS 백업 S/W<span className={main.downArrowIcon} onClick={() => this.onClickSort("backup_InternalOSBackupSW")}></span></th>
                                <th rowspan="2">External 백업 수행 유무<span className={main.downArrowIcon} onClick={() => this.onClickSort("backup_ExternalBackupRun")}></span></th>
                                <th rowspan="2">External 백업 S/W 종류<span className={main.downArrowIcon} onClick={() => this.onClickSort("backup_ExternalBackupSWType")}></span></th>
                                <th rowspan="2">External 원격 소산 여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("backup_ExternalRemote")}></span></th>
                                <th rowspan="2">External 원격 소산 위치<span className={main.downArrowIcon} onClick={() => this.onClickSort("backup_ExternalRemotePosition")}></span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableDataUI8}
                        </tbody>
                    </table>
                    {/* <div className={main.backupBtnBox} onClick={() => this.props.onClickCheck("backupCheckbox")}>
                        <span className={main.bleftArrowIcon}></span>
                    </div> */}
                    {/* <div className={main.addTableBtnBox} onClick={() => this.props.onClickCheck("addTableCheckbox")}>
                        <span className={main.aleftArrowIcon}></span>
                    </div> */}
                </div>
            </>
        );
    }
}
export default ServerTable;