import React, { Component } from 'react';
import $ from 'jquery';
import main from '../../../Main/css/main.module.css';
import InputText from './inputText';
import SelectBox from './selectBox';
import DatePickerBox from './datePickerBox';
import InventoryManagement from '../inventoryManagement';

class SanSwitchTable extends Component {

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

        if (column === "basic_Name" && data.basic_Name !== value) {
            this.props.isModifiy(true);
            data.basic_Name = value;
        } else if (column === "basic_Status" && data.basic_Status !== value) {
            this.props.isModifiy(true);
            data.basic_Status = value;
        } else if (column === "basic_ItemLevel" && data.basic_ItemLevel !== value) {
            this.props.isModifiy(true);
            data.basic_ItemLevel = value;
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
        } else if (column === "hW_SerialNumber" && data.hW_SerialNumber !== value) {
            this.props.isModifiy(true);
            data.hW_SerialNumber = value;
        } else if (column === "hW_FirmwareVersion" && data.hW_FirmwareVersion !== value) {
            this.props.isModifiy(true);
            data.hW_FirmwareVersion = value;
        } else if (column === "hW_DualSanSwitchName" && data.hW_DualSanSwitchName !== value) {
            this.props.isModifiy(true);
            data.hW_DualSanSwitchName = value;
        } else if (column === "hW_InterfaceType" && data.hW_InterfaceType !== value) {
            this.props.isModifiy(true);
            data.hW_InterfaceType = value;
        } else if (column === "hW_Interface" && data.hW_Interface !== value) {
            this.props.isModifiy(true);
            data.hW_Interface = value;
        } else if (column === "hW_FCPortCount" && data.hW_FCPortCount !== this.setNullableInt(value)) {
            const changedValue = this.setNullableInt(value);

            if (changedValue !== null) {
                this.props.isModifiy(true);
                data.hW_FCPortCount = changedValue;
            }
        } else if (column === "hW_FCPortUseCount" && data.hW_FCPortUseCount !== this.setNullableInt(value)) {
            const changedValue = this.setNullableInt(value);

            if (changedValue !== null) {
                this.props.isModifiy(true);
                data.hW_FCPortUseCount = changedValue;
            }
        } else if (column === "hW_FCPortFree" && data.hW_FCPortFree !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.hW_FCPortFree = this.setNullableInt(value);
        } else if (column === "hW_GBICPortCount" && data.hW_GBICPortCount !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.hW_GBICPortCount = this.setNullableInt(value);
        } else if (column === "hW_DualBoxSerial" && data.hW_DualBoxSerial !== value) {
            this.props.isModifiy(true);
            data.hW_DualBoxSerial = value;
        } else if (column === "hW_SecurityType" && data.hW_SecurityType !== value) {
            this.props.isModifiy(true);
            data.hW_SecurityType = value;
        } else if (column === "hW_FanCount" && data.hW_FanCount !== value) {
            this.props.isModifiy(true);
            data.hW_FanCount = this.setNullableInt(value);
        } else if (column === "basic_ReceiveDate" && data.basic_ReceiveDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.basic_ReceiveDate = this.setNullableDate(value);
        } else if (column === "basic_RegDate" && data.basic_RegDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.basic_RegDate = this.setNullableDate(value);
        } else if (column === "maintenance_WarrantyExpiredDate" && data.maintenance_WarrantyExpiredDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.maintenance_WarrantyExpiredDate = this.setNullableDate(value);
        } else if (column === "maintenance_EOSDate" && data.maintenance_EOSDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.maintenance_EOSDate = this.setNullableDate(value);
        } else if (column === "maintenance_MaintenanceContract" && data.maintenance_MaintenanceContract !== value) {
            this.props.isModifiy(true);
            data.maintenance_MaintenanceContract = value;
        } else if (column === "maintenance_MaintenanceBeginDate" && data.maintenance_MaintenanceBeginDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.maintenance_MaintenanceBeginDate = this.setNullableDate(value);
        } else if (column === "maintenance_MaintenanceEndDate" && data.maintenance_MaintenanceEndDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.maintenance_MaintenanceEndDate = this.setNullableDate(value);
        } else if (column === "hW_Dual" && data.hW_Dual !== value) {
            this.props.isModifiy(true);
            data.hW_Dual = value;
        } else if (column === "hW_FanDual" && data.hW_FanDual !== value) {
            this.props.isModifiy(true);
            data.hW_FanDual = value;
        } else if (column === "hW_PowerSupplyDual" && data.hW_PowerSupplyDual !== value) {
            this.props.isModifiy(true);
            data.hW_PowerSupplyDual = value;
        } else if (column === "hW_ConnectPDUDual" && data.hW_ConnectPDUDual !== value) {
            this.props.isModifiy(true);
            data.hW_ConnectPDUDual = value;
        } else if (column === "dual_RackPowerDualUse" && data.dual_RackPowerDualUse !== value) {
            this.props.isModifiy(true);
            data.dual_RackPowerDualUse = value;
        }

    }

    onChangeCheck = (target, data) => {
        if (!data)
            return;

        let checkList = [];

        if (target.checked) {
            // 체크한 경우
            checkList.push(data.switchID);
            this.props.insertCheckList(checkList);
        } else {
            // 체크 해제한 경우
            checkList.push(data.switchID);

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
                    checkList.push(data.switchID);
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

        if (item.hW_SerialNumber && item.hW_SerialNumber.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_FirmwareVersion && item.hW_FirmwareVersion.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_Dual && item.hW_Dual.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_Dual && item.hW_Dual.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_DualSanSwitchName && item.hW_DualSanSwitchName.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_InterfaceType && item.hW_InterfaceType.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_Interface && item.hW_Interface.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_FCPortCount && item.hW_FCPortCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_FCPortUseCount && item.hW_FCPortUseCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_FCPortFree && item.hW_FCPortFree.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_GBICPortCount && item.hW_GBICPortCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_DualBoxSerial && item.hW_DualBoxSerial.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_SecurityType && item.hW_SecurityType.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_FanCount && item.hW_FanCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_FanDual && item.hW_FanDual.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_PowerSupplyDual && item.hW_PowerSupplyDual.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_ConnectPDUDual && item.hW_ConnectPDUDual.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.dual_RackPowerDualUse && item.dual_RackPowerDualUse.toString().toLowerCase().includes(searchText)) {
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
                    <tr key={data.switchID + "_1_" + rowIndex} className={main.tableTr}>
                        <td className={main.tableTd}><input type="checkBox" className="colCheckBox" onChange={(e) => this.onChangeCheck(e.target, data)} /></td>
                        <td>{i + 1}</td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable2, rowIndex + 3)}><InputText type="text" value={data.basic_Name} onChange={(value) => this.onChangeInputText(data, "basic_Name", value)} editMode={editName} /></td>
                    </tr>
                );

                tableDataUI2.push(
                    <tr key={data.switchID + "_2_" + rowIndex} className={main.tableTr}>
                        <td><InputText type="text" value={data.basic_Status} onChange={(value) => this.onChangeInputText(data, "basic_Status", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.basic_ReceiveDate} onChange={(value) => this.onChangeInputText(data, "basic_ReceiveDate", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.basic_RegDate} onChange={(value) => this.onChangeInputText(data, "basic_RegDate", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_ItemLevel} onChange={(value) => this.onChangeInputText(data, "basic_ItemLevel", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_Usage} onChange={(value) => this.onChangeInputText(data, "basic_Usage", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_OwnerCompanyName} onChange={(value) => this.onChangeInputText(data, "basic_OwnerCompanyName", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_OwnDepartment} onChange={(value) => this.onChangeInputText(data, "basic_OwnDepartment", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_OperationDepartment} onChange={(value) => this.onChangeInputText(data, "basic_OperationDepartment", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_Memo} onChange={(value) => this.onChangeInputText(data, "basic_Memo", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.manage_SuperviseManager} onChange={(value) => this.onChangeInputText(data, "manage_SuperviseManager", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.manage_OperationManager} onChange={(value) => this.onChangeInputText(data, "manage_OperationManager", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.position_InstallRegion} onChange={(value) => this.onChangeInputText(data, "position_InstallRegion", value)} editMode={this.props.editMode} /></td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable3, rowIndex + 2)}><InputText type="text" value={data.position_RackDetailPosition} onChange={(value) => this.onChangeInputText(data, "position_RackDetailPosition", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );

                tableDataUI3.push(
                    <tr key={data.switchID + "_3_" + rowIndex} className={main.tableTr}>
                        <td><InputText type="text" value={data.maintenance_ProvideCompanyName} onChange={(value) => this.onChangeInputText(data, "maintenance_ProvideCompanyName", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.maintenance_WarrantyMonth} onChange={(value) => this.onChangeInputText(data, "maintenance_WarrantyMonth", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.maintenance_WarrantyExpiredDate} onChange={(value) => this.onChangeInputText(data, "maintenance_WarrantyExpiredDate", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.maintenance_MaintenanceCompanyName} onChange={(value) => this.onChangeInputText(data, "maintenance_MaintenanceCompanyName", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.maintenance_EOSDate} onChange={(value) => this.onChangeInputText(data, "maintenance_EOSDate", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.maintenance_MaintenanceContract} onChange={(value) => this.onChangeInputText(data, "maintenance_MaintenanceContract", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.maintenance_MaintenanceBeginDate} onChange={(value) => this.onChangeInputText(data, "maintenance_MaintenanceBeginDate", value)} editMode={this.props.editMode} /></td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable4, rowIndex + 2)}><DatePickerBox value={data.maintenance_MaintenanceEndDate} onChange={(value) => this.onChangeInputText(data, "maintenance_MaintenanceEndDate", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );

                tableDataUI4.push(
                    <tr key={data.switchID + "_4_" + rowIndex} className={main.tableTr}>
                        <td><InputText type="text" value={data.hW_ModelName} onChange={(value) => this.onChangeInputText(data, "hW_ModelName", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_Company} onChange={(value) => this.onChangeInputText(data, "hW_Company", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_SerialNumber} onChange={(value) => this.onChangeInputText(data, "hW_SerialNumber", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_FirmwareVersion} onChange={(value) => this.onChangeInputText(data, "hW_FirmwareVersion", value)} editMode={this.props.editMode} /></td>
                        {/* <td><DatePickerBox value={data.hW_Dual} onChange={(value) => this.onChangeInputText(data, "hW_Dual", value)} /></td> */}
                        <td><SelectBox type="yesno" value={data.hW_Dual} onChange={(value) => this.onChangeInputText(data, "hW_Dual", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_DualSanSwitchName} onChange={(value) => this.onChangeInputText(data, "hW_DualSanSwitchName", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_InterfaceType} onChange={(value) => this.onChangeInputText(data, "hW_InterfaceType", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_Interface} onChange={(value) => this.onChangeInputText(data, "hW_Interface", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="number" value={data.hW_FCPortCount} onChange={(value) => this.onChangeInputText(data, "hW_FCPortCount", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="number" value={data.hW_FCPortUseCount} onChange={(value) => this.onChangeInputText(data, "hW_FCPortUseCount", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.hW_FCPortFree} onChange={(value) => this.onChangeInputText(data, "hW_FCPortFree", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.hW_GBICPortCount} onChange={(value) => this.onChangeInputText(data, "hW_GBICPortCount", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_DualBoxSerial} onChange={(value) => this.onChangeInputText(data, "hW_DualBoxSerial", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_SecurityType} onChange={(value) => this.onChangeInputText(data, "hW_SecurityType", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.hW_FanCount} onChange={(value) => this.onChangeInputText(data, "hW_FanCount", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.hW_FanDual} onChange={(value) => this.onChangeInputText(data, "hW_FanDual", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.hW_PowerSupplyDual} onChange={(value) => this.onChangeInputText(data, "hW_PowerSupplyDual", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.hW_ConnectPDUDual} onChange={(value) => this.onChangeInputText(data, "hW_ConnectPDUDual", value)} editMode={this.props.editMode} /></td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable1, rowIndex + 2)}><SelectBox type="yesno" value={data.dual_RackPowerDualUse} onChange={(value) => this.onChangeInputText(data, "dual_RackPowerDualUse", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );

                idx++;
                _rowIndex++;
            }
        }

        return [tableDataUI1, tableDataUI2, tableDataUI3, tableDataUI4];
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
        else if (data === "basic_Usage") { displayData.sort((a, b) => { if ((a.basic_Usage === null || a.basic_Usage === undefined) && (b.basic_Usage === null || b.basic_Usage === undefined)) { return 0; } else if (a.basic_Usage === null || a.basic_Usage === undefined) { return 1; } else if (b.basic_Usage === null || b.basic_Usage === undefined) { return -1; } else if (a.basic_Usage?.toLowerCase() > b.basic_Usage?.toLowerCase()) { return 1; } else if (a.basic_Usage?.toLowerCase() < b.basic_Usage?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_OwnerCompanyName") { displayData.sort((a, b) => { if ((a.basic_OwnerCompanyName === null || a.basic_OwnerCompanyName === undefined) && (b.basic_OwnerCompanyName === null || b.basic_OwnerCompanyName === undefined)) { return 0; } else if (a.basic_OwnerCompanyName === null || a.basic_OwnerCompanyName === undefined) { return 1; } else if (b.basic_OwnerCompanyName === null || b.basic_OwnerCompanyName === undefined) { return -1; } else if (a.basic_OwnerCompanyName?.toLowerCase() > b.basic_OwnerCompanyName?.toLowerCase()) { return 1; } else if (a.basic_OwnerCompanyName?.toLowerCase() < b.basic_OwnerCompanyName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_OwnDepartment") { displayData.sort((a, b) => { if ((a.basic_OwnDepartment === null || a.basic_OwnDepartment === undefined) && (b.basic_OwnDepartment === null || b.basic_OwnDepartment === undefined)) { return 0; } else if (a.basic_OwnDepartment === null || a.basic_OwnDepartment === undefined) { return 1; } else if (b.basic_OwnDepartment === null || b.basic_OwnDepartment === undefined) { return -1; } else if (a.basic_OwnDepartment?.toLowerCase() > b.basic_OwnDepartment?.toLowerCase()) { return 1; } else if (a.basic_OwnDepartment?.toLowerCase() < b.basic_OwnDepartment?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_OperationDepartment") { displayData.sort((a, b) => { if ((a.basic_OperationDepartment === null || a.basic_OperationDepartment === undefined) && (b.basic_OperationDepartment === null || b.basic_OperationDepartment === undefined)) { return 0; } else if (a.basic_OperationDepartment === null || a.basic_OperationDepartment === undefined) { return 1; } else if (b.basic_OperationDepartment === null || b.basic_OperationDepartment === undefined) { return -1; } else if (a.basic_OperationDepartment?.toLowerCase() > b.basic_OperationDepartment?.toLowerCase()) { return 1; } else if (a.basic_OperationDepartment?.toLowerCase() < b.basic_OperationDepartment?.toLowerCase()) { return -1; } else { return 0; } }); }
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
        else if (data === "hW_SerialNumber") { displayData.sort((a, b) => { if ((a.hW_SerialNumber === null || a.hW_SerialNumber === undefined) && (b.hW_SerialNumber === null || b.hW_SerialNumber === undefined)) { return 0; } else if (a.hW_SerialNumber === null || a.hW_SerialNumber === undefined) { return 1; } else if (b.hW_SerialNumber === null || b.hW_SerialNumber === undefined) { return -1; } else if (a.hW_SerialNumber?.toLowerCase() > b.hW_SerialNumber?.toLowerCase()) { return 1; } else if (a.hW_SerialNumber?.toLowerCase() < b.hW_SerialNumber?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_FirmwareVersion") { displayData.sort((a, b) => { if ((a.hW_FirmwareVersion === null || a.hW_FirmwareVersion === undefined) && (b.hW_FirmwareVersion === null || b.hW_FirmwareVersion === undefined)) { return 0; } else if (a.hW_FirmwareVersion === null || a.hW_FirmwareVersion === undefined) { return 1; } else if (b.hW_FirmwareVersion === null || b.hW_FirmwareVersion === undefined) { return -1; } else if (a.hW_FirmwareVersion?.toLowerCase() > b.hW_FirmwareVersion?.toLowerCase()) { return 1; } else if (a.hW_FirmwareVersion?.toLowerCase() < b.hW_FirmwareVersion?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_DualSanSwitchName") { displayData.sort((a, b) => { if ((a.hW_DualSanSwitchName === null || a.hW_DualSanSwitchName === undefined) && (b.hW_DualSanSwitchName === null || b.hW_DualSanSwitchName === undefined)) { return 0; } else if (a.hW_DualSanSwitchName === null || a.hW_DualSanSwitchName === undefined) { return 1; } else if (b.hW_DualSanSwitchName === null || b.hW_DualSanSwitchName === undefined) { return -1; } else if (a.hW_DualSanSwitchName?.toLowerCase() > b.hW_DualSanSwitchName?.toLowerCase()) { return 1; } else if (a.hW_DualSanSwitchName?.toLowerCase() < b.hW_DualSanSwitchName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_InterfaceType") { displayData.sort((a, b) => { if ((a.hW_InterfaceType === null || a.hW_InterfaceType === undefined) && (b.hW_InterfaceType === null || b.hW_InterfaceType === undefined)) { return 0; } else if (a.hW_InterfaceType === null || a.hW_InterfaceType === undefined) { return 1; } else if (b.hW_InterfaceType === null || b.hW_InterfaceType === undefined) { return -1; } else if (a.hW_InterfaceType?.toLowerCase() > b.hW_InterfaceType?.toLowerCase()) { return 1; } else if (a.hW_InterfaceType?.toLowerCase() < b.hW_InterfaceType?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_Interface") { displayData.sort((a, b) => { if ((a.hW_Interface === null || a.hW_Interface === undefined) && (b.hW_Interface === null || b.hW_Interface === undefined)) { return 0; } else if (a.hW_Interface === null || a.hW_Interface === undefined) { return 1; } else if (b.hW_Interface === null || b.hW_Interface === undefined) { return -1; } else if (a.hW_Interface?.toLowerCase() > b.hW_Interface?.toLowerCase()) { return 1; } else if (a.hW_Interface?.toLowerCase() < b.hW_Interface?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_FCPortCount") { displayData.sort((a, b) => { if ((a.hW_FCPortCount === null || a.hW_FCPortCount === undefined) && (b.hW_FCPortCount === null || b.hW_FCPortCount === undefined)) { return 0; } else if (a.hW_FCPortCount === null || a.hW_FCPortCount === undefined) { return 1; } else if (b.hW_FCPortCount === null || b.hW_FCPortCount === undefined) { return -1; } else if (a.hW_FCPortCount > b.hW_FCPortCount) { return 1; } else if (a.hW_FCPortCount < b.hW_FCPortCount) { return -1; } else { return 0; } }); }
        else if (data === "hW_FCPortUseCount") { displayData.sort((a, b) => { if ((a.hW_FCPortUseCount === null || a.hW_FCPortUseCount === undefined) && (b.hW_FCPortUseCount === null || b.hW_FCPortUseCount === undefined)) { return 0; } else if (a.hW_FCPortUseCount === null || a.hW_FCPortUseCount === undefined) { return 1; } else if (b.hW_FCPortUseCount === null || b.hW_FCPortUseCount === undefined) { return -1; } else if (a.hW_FCPortUseCount > b.hW_FCPortUseCount) { return 1; } else if (a.hW_FCPortUseCount < b.hW_FCPortUseCount) { return -1; } else { return 0; } }); }
        else if (data === "hW_FCPortFree") { displayData.sort((a, b) => { if ((a.hW_FCPortFree === null || a.hW_FCPortFree === undefined) && (b.hW_FCPortFree === null || b.hW_FCPortFree === undefined)) { return 0; } else if (a.hW_FCPortFree === null || a.hW_FCPortFree === undefined) { return 1; } else if (b.hW_FCPortFree === null || b.hW_FCPortFree === undefined) { return -1; } else if (a.hW_FCPortFree > b.hW_FCPortFree) { return 1; } else if (a.hW_FCPortFree < b.hW_FCPortFree) { return -1; } else { return 0; } }); }
        else if (data === "hW_GBICPortCount") { displayData.sort((a, b) => { if ((a.hW_GBICPortCount === null || a.hW_GBICPortCount === undefined) && (b.hW_GBICPortCount === null || b.hW_GBICPortCount === undefined)) { return 0; } else if (a.hW_GBICPortCount === null || a.hW_GBICPortCount === undefined) { return 1; } else if (b.hW_GBICPortCount === null || b.hW_GBICPortCount === undefined) { return -1; } else if (a.hW_GBICPortCount > b.hW_GBICPortCount) { return 1; } else if (a.hW_GBICPortCount < b.hW_GBICPortCount) { return -1; } else { return 0; } }); }
        else if (data === "hW_DualBoxSerial") { displayData.sort((a, b) => { if ((a.hW_DualBoxSerial === null || a.hW_DualBoxSerial === undefined) && (b.hW_DualBoxSerial === null || b.hW_DualBoxSerial === undefined)) { return 0; } else if (a.hW_DualBoxSerial === null || a.hW_DualBoxSerial === undefined) { return 1; } else if (b.hW_DualBoxSerial === null || b.hW_DualBoxSerial === undefined) { return -1; } else if (a.hW_DualBoxSerial?.toLowerCase() > b.hW_DualBoxSerial?.toLowerCase()) { return 1; } else if (a.hW_DualBoxSerial?.toLowerCase() < b.hW_DualBoxSerial?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_SecurityType") { displayData.sort((a, b) => { if ((a.hW_SecurityType === null || a.hW_SecurityType === undefined) && (b.hW_SecurityType === null || b.hW_SecurityType === undefined)) { return 0; } else if (a.hW_SecurityType === null || a.hW_SecurityType === undefined) { return 1; } else if (b.hW_SecurityType === null || b.hW_SecurityType === undefined) { return -1; } else if (a.hW_SecurityType?.toLowerCase() > b.hW_SecurityType?.toLowerCase()) { return 1; } else if (a.hW_SecurityType?.toLowerCase() < b.hW_SecurityType?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_FanCount") { displayData.sort((a, b) => { if ((a.hW_FanCount === null || a.hW_FanCount === undefined) && (b.hW_FanCount === null || b.hW_FanCount === undefined)) { return 0; } else if (a.hW_FanCount === null || a.hW_FanCount === undefined) { return 1; } else if (b.hW_FanCount === null || b.hW_FanCount === undefined) { return -1; } else if (a.hW_FanCount > b.hW_FanCount) { return 1; } else if (a.hW_FanCount < b.hW_FanCount) { return -1; } else { return 0; } }); }
        else if (data === "basic_ReceiveDate") { displayData.sort((a, b) => { if ((a.basic_ReceiveDate === null || a.basic_ReceiveDate === undefined) && (b.basic_ReceiveDate === null || b.basic_ReceiveDate === undefined)) { return 0; } else if (a.basic_ReceiveDate === null || a.basic_ReceiveDate === undefined) { return 1; } else if (b.basic_ReceiveDate === null || b.basic_ReceiveDate === undefined) { return -1; } else if (a.basic_ReceiveDate > b.basic_ReceiveDate) { return 1; } else if (a.basic_ReceiveDate < b.basic_ReceiveDate) { return -1; } else { return 0; } }); }
        else if (data === "basic_RegDate") { displayData.sort((a, b) => { if ((a.basic_RegDate === null || a.basic_RegDate === undefined) && (b.basic_RegDate === null || b.basic_RegDate === undefined)) { return 0; } else if (a.basic_RegDate === null || a.basic_RegDate === undefined) { return 1; } else if (b.basic_RegDate === null || b.basic_RegDate === undefined) { return -1; } else if (a.basic_RegDate > b.basic_RegDate) { return 1; } else if (a.basic_RegDate < b.basic_RegDate) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_WarrantyExpiredDate") { displayData.sort((a, b) => { if ((a.maintenance_WarrantyExpiredDate === null || a.maintenance_WarrantyExpiredDate === undefined) && (b.maintenance_WarrantyExpiredDate === null || b.maintenance_WarrantyExpiredDate === undefined)) { return 0; } else if (a.maintenance_WarrantyExpiredDate === null || a.maintenance_WarrantyExpiredDate === undefined) { return 1; } else if (b.maintenance_WarrantyExpiredDate === null || b.maintenance_WarrantyExpiredDate === undefined) { return -1; } else if (a.maintenance_WarrantyExpiredDate > b.maintenance_WarrantyExpiredDate) { return 1; } else if (a.maintenance_WarrantyExpiredDate < b.maintenance_WarrantyExpiredDate) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_EOSDate") { displayData.sort((a, b) => { if ((a.maintenance_EOSDate === null || a.maintenance_EOSDate === undefined) && (b.maintenance_EOSDate === null || b.maintenance_EOSDate === undefined)) { return 0; } else if (a.maintenance_EOSDate === null || a.maintenance_EOSDate === undefined) { return 1; } else if (b.maintenance_EOSDate === null || b.maintenance_EOSDate === undefined) { return -1; } else if (a.maintenance_EOSDate > b.maintenance_EOSDate) { return 1; } else if (a.maintenance_EOSDate < b.maintenance_EOSDate) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_MaintenanceContract") { displayData.sort((a, b) => { if ((a.maintenance_MaintenanceContract === null || a.maintenance_MaintenanceContract === undefined) && (b.maintenance_MaintenanceContract === null || b.maintenance_MaintenanceContract === undefined)) { return 0; } else if (a.maintenance_MaintenanceContract === null || a.maintenance_MaintenanceContract === undefined) { return 1; } else if (b.maintenance_MaintenanceContract === null || b.maintenance_MaintenanceContract === undefined) { return -1; } else if (a.maintenance_MaintenanceContract > b.maintenance_MaintenanceContract) { return 1; } else if (a.maintenance_MaintenanceContract < b.maintenance_MaintenanceContract) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_MaintenanceBeginDate") { displayData.sort((a, b) => { if ((a.maintenance_MaintenanceBeginDate === null || a.maintenance_MaintenanceBeginDate === undefined) && (b.maintenance_MaintenanceBeginDate === null || b.maintenance_MaintenanceBeginDate === undefined)) { return 0; } else if (a.maintenance_MaintenanceBeginDate === null || a.maintenance_MaintenanceBeginDate === undefined) { return 1; } else if (b.maintenance_MaintenanceBeginDate === null || b.maintenance_MaintenanceBeginDate === undefined) { return -1; } else if (a.maintenance_MaintenanceBeginDate > b.maintenance_MaintenanceBeginDate) { return 1; } else if (a.maintenance_MaintenanceBeginDate < b.maintenance_MaintenanceBeginDate) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_MaintenanceEndDate") { displayData.sort((a, b) => { if ((a.maintenance_MaintenanceEndDate === null || a.maintenance_MaintenanceEndDate === undefined) && (b.maintenance_MaintenanceEndDate === null || b.maintenance_MaintenanceEndDate === undefined)) { return 0; } else if (a.maintenance_MaintenanceEndDate === null || a.maintenance_MaintenanceEndDate === undefined) { return 1; } else if (b.maintenance_MaintenanceEndDate === null || b.maintenance_MaintenanceEndDate === undefined) { return -1; } else if (a.maintenance_MaintenanceEndDate > b.maintenance_MaintenanceEndDate) { return 1; } else if (a.maintenance_MaintenanceEndDate < b.maintenance_MaintenanceEndDate) { return -1; } else { return 0; } }); }
        else if (data === "hW_Dual") { displayData.sort((a, b) => { if ((a.hW_Dual === null || a.hW_Dual === undefined) && (b.hW_Dual === null || b.hW_Dual === undefined)) { return 0; } else if (a.hW_Dual === null || a.hW_Dual === undefined) { return 1; } else if (b.hW_Dual === null || b.hW_Dual === undefined) { return -1; } else if (a.hW_Dual > b.hW_Dual) { return 1; } else if (a.hW_Dual < b.hW_Dual) { return -1; } else { return 0; } }); }
        else if (data === "hW_FanDual") { displayData.sort((a, b) => { if ((a.hW_FanDual === null || a.hW_FanDual === undefined) && (b.hW_FanDual === null || b.hW_FanDual === undefined)) { return 0; } else if (a.hW_FanDual === null || a.hW_FanDual === undefined) { return 1; } else if (b.hW_FanDual === null || b.hW_FanDual === undefined) { return -1; } else if (a.hW_FanDual > b.hW_FanDual) { return 1; } else if (a.hW_FanDual < b.hW_FanDual) { return -1; } else { return 0; } }); }
        else if (data === "hW_PowerSupplyDual") { displayData.sort((a, b) => { if ((a.hW_PowerSupplyDual === null || a.hW_PowerSupplyDual === undefined) && (b.hW_PowerSupplyDual === null || b.hW_PowerSupplyDual === undefined)) { return 0; } else if (a.hW_PowerSupplyDual === null || a.hW_PowerSupplyDual === undefined) { return 1; } else if (b.hW_PowerSupplyDual === null || b.hW_PowerSupplyDual === undefined) { return -1; } else if (a.hW_PowerSupplyDual > b.hW_PowerSupplyDual) { return 1; } else if (a.hW_PowerSupplyDual < b.hW_PowerSupplyDual) { return -1; } else { return 0; } }); }
        else if (data === "hW_ConnectPDUDual") { displayData.sort((a, b) => { if ((a.hW_ConnectPDUDual === null || a.hW_ConnectPDUDual === undefined) && (b.hW_ConnectPDUDual === null || b.hW_ConnectPDUDual === undefined)) { return 0; } else if (a.hW_ConnectPDUDual === null || a.hW_ConnectPDUDual === undefined) { return 1; } else if (b.hW_ConnectPDUDual === null || b.hW_ConnectPDUDual === undefined) { return -1; } else if (a.hW_ConnectPDUDual > b.hW_ConnectPDUDual) { return 1; } else if (a.hW_ConnectPDUDual < b.hW_ConnectPDUDual) { return -1; } else { return 0; } }); }
        else if (data === "dual_RackPowerDualUse") { displayData.sort((a, b) => { if ((a.dual_RackPowerDualUse === null || a.dual_RackPowerDualUse === undefined) && (b.dual_RackPowerDualUse === null || b.dual_RackPowerDualUse === undefined)) { return 0; } else if (a.dual_RackPowerDualUse === null || a.dual_RackPowerDualUse === undefined) { return 1; } else if (b.dual_RackPowerDualUse === null || b.dual_RackPowerDualUse === undefined) { return -1; } else if (a.dual_RackPowerDualUse > b.dual_RackPowerDualUse) { return 1; } else if (a.dual_RackPowerDualUse < b.dual_RackPowerDualUse) { return -1; } else { return 0; } }); }


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
                return [null, `No(${i+1}) SAN 스위치명은 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.basic_Status || itemData.basic_Status.trim().length === 0) {
                return [null, `No(${i+1}) 상태는 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.basic_ItemLevel || itemData.basic_ItemLevel.trim().length === 0) {
                return [null, `No(${i+1}) SAN 스위치등급은 필수요소입니다. 비워둘수 없습니다.`, null];
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

            if (itemData.hW_FCPortCount === null || itemData.hW_FCPortCount === undefined) {
                return [null, `No(${i+1}) FC 포트 개수(최대포트수)는 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (itemData.hW_FCPortUseCount === null || itemData.hW_FCPortUseCount === undefined) {
                return [null, `No(${i+1}) FC 포트 사용개수(최대포트수)는 필수요소입니다. 비워둘수 없습니다.`, null];
            }
        }

        return [itemDatas, null, InventoryManagement.itemType.SanSwitch];
    }

    render() {
        if (this.props.hasNewRow() && this.props.addedDatas.length > 0) {
            this.needRefresh = true;
            return (
                <></>
            );
        }

        const [tableDataUI1, tableDataUI2, tableDataUI3, tableDataUI4, tableDataUI5] = this.getTableDataUI2();

        return (
            <>
                <div className={main.sanSwitchTable}>
                    <table ref={this.refTable1} border="1" style={{ minWidth: '9%' }}>
                        <thead>
                            <tr style={{ height: '78px' }}>
                                <th rowspan="3"><div className={main.editFlex}><span>전체</span><span><input ref={this.refAllCheck} type="checkBox" id="allCheck" onChange={(e) => this.onChangeAllCheck(e.target)} /></span></div></th>
                                <th rowspan="3" style={{ padding: '0px 15px' }}>No</th>
                                <th rowspan="3" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>SAN 스위치명<span className={main.bottomArrowIcon} onClick={() => this.onClickSort("basic_Name")}></span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableDataUI1}
                        </tbody>
                    </table>
                    <table ref={this.refTable2} border="1" className="generalTable" style={{ minWidth: '60%' }}>
                        <thead>
                            <tr style={{ height: '26px' }}>
                                <th colspan="13">기본정보<span className={main.gleftArrowIcon} onClick={() => this.props.onClickCheck("generalCheckbox")}></span></th>
                            </tr>
                            <tr>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>상태<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_Status")}></span></th>
                                <th rowspan="2">입고일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_ReceiveDate")}></span></th>
                                <th rowspan="2">설치일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_RegDate")}></span></th>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>SAN 스위치 등급<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_ItemLevel")}></span></th>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>용도<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_Usage")}></span></th>
                                <th rowspan="2">자산구분<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_OwnerCompanyName")}></span></th>
                                <th rowspan="2">주관부서<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_OwnDepartment")}></span></th>
                                <th rowspan="2">운영부서<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_OperationDepartment")}></span></th>
                                <th rowspan="2">메모<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_Memo")}></span></th>
                                <th colspan="2">담당자<span className={main.leftArrowIcon}></span></th>
                                <th colspan="2">위치<span className={main.leftArrowIcon}></span></th>
                            </tr>
                            <tr>
                                <th>관리담당자(고객사)<span className={main.downArrowIcon} onClick={() => this.onClickSort("manage_SuperviseManager")}></span></th>
                                <th>운영담당자(EDS)<span className={main.downArrowIcon} onClick={() => this.onClickSort("manage_OperationManager")}></span></th>
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
                    <table ref={this.refTable3} border="1" className="maintenanceTable" style={{ minWidth: '42%' }}>
                        <thead>
                            <tr style={{ height: '26px' }}>
                                <th colspan="8">유지보수정보<span className={main.mleftArrowIcon} onClick={() => this.props.onClickCheck("maintenanceCheckbox")}></span></th>
                            </tr>
                            <tr style={{ height: '52px' }}>
                                <th rowspan="2">공급업체<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_ProvideCompanyName")}></span></th>
                                <th rowspan="2">Warranty기간<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_WarrantyMonth")}></span></th>
                                <th rowspan="2">Warranty만료일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_WarrantyExpiredDate")}></span></th>
                                <th rowspan="2">유지보수업체<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_MaintenanceCompanyName")}></span></th>
                                <th rowspan="2">EOS일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_EOSDate")}></span></th>
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
                    <table ref={this.refTable4} className="hardwareTable" border="1" style={{ minWidth: '104%' }}>
                        <thead>
                            <tr style={{ height: '26px' }}>
                                <th colspan="19">하드웨어정보<span className={main.hleftArrowIcon} onClick={() => this.props.onClickCheck("hardwareCheckbox")}></span></th>
                            </tr>
                            <tr style={{ height: '52px' }}>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>모델명<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_ModelName")}></span></th>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>제조사<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_Company")}></span></th>
                                <th rowspan="2">시리얼번호<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_SerialNumber")}></span></th>
                                <th rowspan="2">펌웨어 버전<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_FirmwareVersion")}></span></th>
                                <th rowspan="2">이중화여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_Dual")}></span></th>
                                <th rowspan="2">이중화대상 SAN 스위치명<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_DualSanSwitchName")}></span></th>
                                <th rowspan="2">Interface Type<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_InterfaceType")}></span></th>
                                <th rowspan="2">Interface<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_Interface")}></span></th>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>FC 포트 개수(최대포트수)<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_FCPortCount")}></span></th>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>FC 포트 사용개수(최대포트수)<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_FCPortUseCount")}></span></th>
                                <th rowspan="2">FC Port 여유<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_FCPortFree")}></span></th>
                                <th rowspan="2">GBIC 포트개수<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_GBICPortCount")}></span></th>
                                <th rowspan="2">이중화 BOX 시리얼<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_DualBoxSerial")}></span></th>
                                <th rowspan="2">보안구분<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_SecurityType")}></span></th>
                                <th rowspan="2">FAN 개수<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_FanCount")}></span></th>
                                <th rowspan="2">FAN 이중화여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_FanDual")}></span></th>
                                <th rowspan="2">Power Supply 이중화여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_PowerSupplyDual")}></span></th>
                                <th rowspan="2">연결 PDU 이중화여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_ConnectPDUDual")}></span></th>
                                <th rowspan="2">RACK 전원 이중화여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("dual_RackPowerDualUse")}></span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableDataUI4}
                        </tbody>
                    </table>
                    {/* <div className={main.hardwareBtnBox} onClick={() => this.props.onClickCheck("hardwareCheckbox")}>
                        <span className={main.hleftArrowIcon}></span>
                    </div> */}
                    {/* <div className={main.addTableBtnBox} onClick={() => this.props.onClickCheck("addTableCheckbox")}>
                        <span className={main.aleftArrowIcon}></span>
                    </div> */}
                </div>
            </>
        );
    }

}
export default SanSwitchTable;