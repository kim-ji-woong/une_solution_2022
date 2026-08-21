import React, { Component } from 'react';
import $ from 'jquery';
import main from '../../../Main/css/main.module.css';
import InputText from './inputText';
import SelectBox from './selectBox';
import DatePickerBox from './datePickerBox';
import InventoryManagement from '../inventoryManagement';

class EtcTable extends Component {

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
        } else if (column === "basic_EquipDetailClass" && data.basic_EquipDetailClass !== value) {
            this.props.isModifiy(true);
            data.basic_EquipDetailClass = value;
        } else if (column === "basic_LifeYear" && data.basic_LifeYear !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.basic_LifeYear = this.setNullableInt(value);
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
        } else if (column === "maintenance_FinancialDepartment" && data.maintenance_FinancialDepartment !== value) {
            this.props.isModifiy(true);
            data.maintenance_FinancialDepartment = value;
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
        } else if (column === "hW_MultiLicense" && data.hW_MultiLicense !== value) {
            this.props.isModifiy(true);
            data.hW_MultiLicense = value;
        } else if (column === "hW_MicCount" && data.hW_MicCount !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.hW_MicCount = this.setNullableInt(value);
        } else if (column === "hW_MonitorModelName" && data.hW_MonitorModelName !== value) {
            this.props.isModifiy(true);
            data.hW_MonitorModelName = value;
        } else if (column === "hW_MonitorType" && data.hW_MonitorType !== value) {
            this.props.isModifiy(true);
            data.hW_MonitorType = value;
        } else if (column === "hW_MonitorScreenSizeInch" && data.hW_MonitorScreenSizeInch !== this.setNullableInt(value)) {
            this.props.isModifiy(true);
            data.hW_MonitorScreenSizeInch = this.setNullableInt(value);
        } else if (column === "hW_ScreenIP" && data.hW_ScreenIP !== value) {
            this.props.isModifiy(true);
            data.hW_ScreenIP = value;
        } else if (column === "hW_HostName" && data.hW_HostName !== value) {
            this.props.isModifiy(true);
            data.hW_HostName = value;
        } else if (column === "hW_QosVolume" && data.hW_QosVolume !== value) {
            this.props.isModifiy(true);
            data.hW_QosVolume = value;
        } else if (column === "hW_PrivateCompanyBW" && data.hW_PrivateCompanyBW !== value) {
            this.props.isModifiy(true);
            data.hW_PrivateCompanyBW = value;
        } else if (column === "hW_Special" && data.hW_Special !== value) {
            this.props.isModifiy(true);
            data.hW_Special = value;
        } else if (column === "connect_NWEquip_1" && data.connect_NWEquip_1 !== value) {
            this.props.isModifiy(true);
            data.connect_NWEquip_1 = value;
        } else if (column === "connect_NWEquip_2" && data.connect_NWEquip_2 !== value) {
            this.props.isModifiy(true);
            data.connect_NWEquip_2 = value;
        } else if (column === "basic_OverUsedYear" && data.basic_OverUsedYear !== value) {
            this.props.isModifiy(true);
            data.basic_OverUsedYear = value;
        } else if (column === "basic_ReceiveDate" && data.basic_ReceiveDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.basic_ReceiveDate = this.setNullableDate(value);
        } else if (column === "basic_RegDate" && data.basic_RegDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.basic_RegDate = this.setNullableDate(value);
        } else if (column === "basic_DiscardDate" && data.basic_DiscardDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.basic_DiscardDate = this.setNullableDate(value);
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
        } else if (column === "hW_PAD" && data.hW_PAD !== value) {
            this.props.isModifiy(true);
            data.hW_PAD = value;
        } else if (column === "hW_Rack" && data.hW_Rack !== value) {
            this.props.isModifiy(true);
            data.hW_Rack = value;
        } else if (column === "hW_QoS" && data.hW_QoS !== value) {
            this.props.isModifiy(true);
            data.hW_QoS = value;
        } else if (column === "hW_PrivateLine" && data.hW_PrivateLine !== value) {
            this.props.isModifiy(true);
            data.hW_PrivateLine = value;
        }
    }

    onChangeCheck = (target, data) => {
        if (!data)
            return;

        let checkList = [];

        if (target.checked) {
            // 체크한 경우
            checkList.push(data.etcID);
            this.props.insertCheckList(checkList);
        } else {
            // 체크 해제한 경우
            checkList.push(data.etcID);

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
                    checkList.push(data.etcID);
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

        if (item.basic_EquipDetailClass && item.basic_EquipDetailClass.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_LifeYear && item.basic_LifeYear.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_OverUsedYear && item.basic_OverUsedYear.toString().toLowerCase().includes(searchText)) {
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

        if (item.basic_SiteManager && item.basic_SiteManager.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_DiscardDate && item.basic_DiscardDate.toString().toLowerCase().includes(searchText)) {
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

        if (item.maintenance_FinancialDepartment && item.maintenance_FinancialDepartment.toString().toLowerCase().includes(searchText)) {
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

        if (item.hW_MultiLicense && item.hW_MultiLicense.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_MicCount && item.hW_MicCount.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_PAD && item.hW_PAD.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_Rack && item.hW_Rack.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_MonitorModelName && item.hW_MonitorModelName.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_MonitorType && item.hW_MonitorType.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_MonitorScreenS && item.hW_MonitorScreenS.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_ScreenIP && item.hW_ScreenIP.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_HostName && item.hW_HostName.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_QoS && item.hW_QoS.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_QosVolume && item.hW_QosVolume.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_PrivateLine && item.hW_PrivateLine.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_PrivateCompanyBW && item.hW_PrivateCompanyBW.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_Special && item.hW_Special.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_NWEquip_1 && item.connect_NWEquip_1.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.connect_NWEquip_2 && item.connect_NWEquip_2.toString().toLowerCase().includes(searchText)) {
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
                    <tr key={data.etcID + "_1_" + rowIndex} className={main.tableTr}>
                        <td className={main.tableTd}><input type="checkBox" className="colCheckBox" onChange={(e) => this.onChangeCheck(e.target, data)} /></td>
                        <td>{i + 1}</td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable2, rowIndex + 3)}><InputText type="text" value={data.basic_Name} onChange={(value) => this.onChangeInputText(data, "basic_Name", value)} editMode={editName} /></td>
                    </tr>
                );

                tableDataUI2.push(
                    <tr key={data.etcID + "_2_" + rowIndex} className={main.tableTr}>
                        <td><InputText type="text" value={data.basic_Status} onChange={(value) => this.onChangeInputText(data, "basic_Status", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_EquipDetailClass} onChange={(value) => this.onChangeInputText(data, "basic_EquipDetailClass", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.basic_LifeYear} onChange={(value) => this.onChangeInputText(data, "basic_LifeYear", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.basic_OverUsedYear} onChange={(value) => this.onChangeInputText(data, "basic_OverUsedYear", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.basic_ReceiveDate} onChange={(value) => this.onChangeInputText(data, "basic_ReceiveDate", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.basic_RegDate} onChange={(value) => this.onChangeInputText(data, "basic_RegDate", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_ItemLevel} onChange={(value) => this.onChangeInputText(data, "basic_ItemLevel", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_Usage} onChange={(value) => this.onChangeInputText(data, "basic_Usage", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_OwnerCompanyName} onChange={(value) => this.onChangeInputText(data, "basic_OwnerCompanyName", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_OwnDepartment} onChange={(value) => this.onChangeInputText(data, "basic_OwnDepartment", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_OperationDepartment} onChange={(value) => this.onChangeInputText(data, "basic_OperationDepartment", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_SiteManager} onChange={(value) => this.onChangeInputText(data, "basic_SiteManager", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.basic_DiscardDate} onChange={(value) => this.onChangeInputText(data, "basic_DiscardDate", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.basic_Memo} onChange={(value) => this.onChangeInputText(data, "basic_Memo", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.manage_SuperviseManager} onChange={(value) => this.onChangeInputText(data, "manage_SuperviseManager", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.manage_OperationManager} onChange={(value) => this.onChangeInputText(data, "manage_OperationManager", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.position_InstallRegion} onChange={(value) => this.onChangeInputText(data, "position_InstallRegion", value)} editMode={this.props.editMode} /></td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable3, rowIndex + 2)}><InputText type="text" value={data.position_RackDetailPosition} onChange={(value) => this.onChangeInputText(data, "position_RackDetailPosition", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );

                tableDataUI3.push(
                    <tr key={data.etcID + "_3_" + rowIndex} className={main.tableTr}>
                        <td><InputText type="text" value={data.maintenance_ProvideCompanyName} onChange={(value) => this.onChangeInputText(data, "maintenance_ProvideCompanyName", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.maintenance_WarrantyMonth} onChange={(value) => this.onChangeInputText(data, "maintenance_WarrantyMonth", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.maintenance_WarrantyExpiredDate} onChange={(value) => this.onChangeInputText(data, "maintenance_WarrantyExpiredDate", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.maintenance_FinancialDepartment} onChange={(value) => this.onChangeInputText(data, "maintenance_FinancialDepartment", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.maintenance_MaintenanceCompanyName} onChange={(value) => this.onChangeInputText(data, "maintenance_MaintenanceCompanyName", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.maintenance_EOSDate} onChange={(value) => this.onChangeInputText(data, "maintenance_EOSDate", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.maintenance_MaintenanceContract} onChange={(value) => this.onChangeInputText(data, "maintenance_MaintenanceContract", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox value={data.maintenance_MaintenanceBeginDate} onChange={(value) => this.onChangeInputText(data, "maintenance_MaintenanceBeginDate", value)} editMode={this.props.editMode} /></td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable4, rowIndex + 2)}><DatePickerBox value={data.maintenance_MaintenanceEndDate} onChange={(value) => this.onChangeInputText(data, "maintenance_MaintenanceEndDate", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );

                tableDataUI4.push(
                    <tr key={data.etcID + "_4_" + rowIndex} className={main.tableTr}>
                        <td><InputText type="text" value={data.hW_ModelName} onChange={(value) => this.onChangeInputText(data, "hW_ModelName", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_Company} onChange={(value) => this.onChangeInputText(data, "hW_Company", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_SerialNumber} onChange={(value) => this.onChangeInputText(data, "hW_SerialNumber", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_FirmwareVersion} onChange={(value) => this.onChangeInputText(data, "hW_FirmwareVersion", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_MultiLicense} onChange={(value) => this.onChangeInputText(data, "hW_MultiLicense", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.hW_MicCount} onChange={(value) => this.onChangeInputText(data, "hW_MicCount", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.hW_PAD} onChange={(value) => this.onChangeInputText(data, "hW_PAD", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.hW_Rack} onChange={(value) => this.onChangeInputText(data, "hW_Rack", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_MonitorModelName} onChange={(value) => this.onChangeInputText(data, "hW_MonitorModelName", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_MonitorType} onChange={(value) => this.onChangeInputText(data, "hW_MonitorType", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="nullNumber" value={data.hW_MonitorScreenSizeInch} onChange={(value) => this.onChangeInputText(data, "hW_MonitorScreenSizeInch", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_ScreenIP} onChange={(value) => this.onChangeInputText(data, "hW_ScreenIP", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_HostName} onChange={(value) => this.onChangeInputText(data, "hW_HostName", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.hW_QoS} onChange={(value) => this.onChangeInputText(data, "hW_QoS", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_QosVolume} onChange={(value) => this.onChangeInputText(data, "hW_QosVolume", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox type="yesno" value={data.hW_PrivateLine} onChange={(value) => this.onChangeInputText(data, "hW_PrivateLine", value)} editMode={this.props.editMode} /></td>
                        <td><InputText type="text" value={data.hW_PrivateCompanyBW} onChange={(value) => this.onChangeInputText(data, "hW_PrivateCompanyBW", value)} editMode={this.props.editMode} /></td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable5, rowIndex + 2)}><InputText type="text" value={data.hW_Special} onChange={(value) => this.onChangeInputText(data, "hW_Special", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );

                tableDataUI5.push(
                    <tr key={data.etcID + "_5_" + rowIndex} className={main.tableTr}>
                        <td><InputText type="text" value={data.connect_NWEquip_1} onChange={(value) => this.onChangeInputText(data, "connect_NWEquip_1", value)} editMode={this.props.editMode} /></td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable1, rowIndex + 2)}><InputText type="text" value={data.connect_NWEquip_2} onChange={(value) => this.onChangeInputText(data, "connect_NWEquip_2", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );

                tableDataUI6.push(
                    <tr key={data.etcID + "_6_" + rowIndex} className={main.tableTr}>
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
        else if (data === "basic_EquipDetailClass") { displayData.sort((a, b) => { if ((a.basic_EquipDetailClass === null || a.basic_EquipDetailClass === undefined) && (b.basic_EquipDetailClass === null || b.basic_EquipDetailClass === undefined)) { return 0; } else if (a.basic_EquipDetailClass === null || a.basic_EquipDetailClass === undefined) { return 1; } else if (b.basic_EquipDetailClass === null || b.basic_EquipDetailClass === undefined) { return -1; } else if (a.basic_EquipDetailClass?.toLowerCase() > b.basic_EquipDetailClass?.toLowerCase()) { return 1; } else if (a.basic_EquipDetailClass?.toLowerCase() < b.basic_EquipDetailClass?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_LifeYear") { displayData.sort((a, b) => { if ((a.basic_LifeYear === null || a.basic_LifeYear === undefined) && (b.basic_LifeYear === null || b.basic_LifeYear === undefined)) { return 0; } else if (a.basic_LifeYear === null || a.basic_LifeYear === undefined) { return 1; } else if (b.basic_LifeYear === null || b.basic_LifeYear === undefined) { return -1; } else if (a.basic_LifeYear > b.basic_LifeYear) { return 1; } else if (a.basic_LifeYear < b.basic_LifeYear) { return -1; } else { return 0; } }); }
        else if (data === "basic_ItemLevel") { displayData.sort((a, b) => { if ((a.basic_ItemLevel === null || a.basic_ItemLevel === undefined) && (b.basic_ItemLevel === null || b.basic_ItemLevel === undefined)) { return 0; } else if (a.basic_ItemLevel === null || a.basic_ItemLevel === undefined) { return 1; } else if (b.basic_ItemLevel === null || b.basic_ItemLevel === undefined) { return -1; } else if (a.basic_ItemLevel?.toLowerCase() > b.basic_ItemLevel?.toLowerCase()) { return 1; } else if (a.basic_ItemLevel?.toLowerCase() < b.basic_ItemLevel?.toLowerCase()) { return -1; } else { return 0; } }); }
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
        else if (data === "maintenance_FinancialDepartment") { displayData.sort((a, b) => { if ((a.maintenance_FinancialDepartment === null || a.maintenance_FinancialDepartment === undefined) && (b.maintenance_FinancialDepartment === null || b.maintenance_FinancialDepartment === undefined)) { return 0; } else if (a.maintenance_FinancialDepartment === null || a.maintenance_FinancialDepartment === undefined) { return 1; } else if (b.maintenance_FinancialDepartment === null || b.maintenance_FinancialDepartment === undefined) { return -1; } else if (a.maintenance_FinancialDepartment?.toLowerCase() > b.maintenance_FinancialDepartment?.toLowerCase()) { return 1; } else if (a.maintenance_FinancialDepartment?.toLowerCase() < b.maintenance_FinancialDepartment?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_MaintenanceCompanyName") { displayData.sort((a, b) => { if ((a.maintenance_MaintenanceCompanyName === null || a.maintenance_MaintenanceCompanyName === undefined) && (b.maintenance_MaintenanceCompanyName === null || b.maintenance_MaintenanceCompanyName === undefined)) { return 0; } else if (a.maintenance_MaintenanceCompanyName === null || a.maintenance_MaintenanceCompanyName === undefined) { return 1; } else if (b.maintenance_MaintenanceCompanyName === null || b.maintenance_MaintenanceCompanyName === undefined) { return -1; } else if (a.maintenance_MaintenanceCompanyName?.toLowerCase() > b.maintenance_MaintenanceCompanyName?.toLowerCase()) { return 1; } else if (a.maintenance_MaintenanceCompanyName?.toLowerCase() < b.maintenance_MaintenanceCompanyName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_ModelName") { displayData.sort((a, b) => { if ((a.hW_ModelName === null || a.hW_ModelName === undefined) && (b.hW_ModelName === null || b.hW_ModelName === undefined)) { return 0; } else if (a.hW_ModelName === null || a.hW_ModelName === undefined) { return 1; } else if (b.hW_ModelName === null || b.hW_ModelName === undefined) { return -1; } else if (a.hW_ModelName?.toLowerCase() > b.hW_ModelName?.toLowerCase()) { return 1; } else if (a.hW_ModelName?.toLowerCase() < b.hW_ModelName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_Company") { displayData.sort((a, b) => { if ((a.hW_Company === null || a.hW_Company === undefined) && (b.hW_Company === null || b.hW_Company === undefined)) { return 0; } else if (a.hW_Company === null || a.hW_Company === undefined) { return 1; } else if (b.hW_Company === null || b.hW_Company === undefined) { return -1; } else if (a.hW_Company?.toLowerCase() > b.hW_Company?.toLowerCase()) { return 1; } else if (a.hW_Company?.toLowerCase() < b.hW_Company?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_SerialNumber") { displayData.sort((a, b) => { if ((a.hW_SerialNumber === null || a.hW_SerialNumber === undefined) && (b.hW_SerialNumber === null || b.hW_SerialNumber === undefined)) { return 0; } else if (a.hW_SerialNumber === null || a.hW_SerialNumber === undefined) { return 1; } else if (b.hW_SerialNumber === null || b.hW_SerialNumber === undefined) { return -1; } else if (a.hW_SerialNumber?.toLowerCase() > b.hW_SerialNumber?.toLowerCase()) { return 1; } else if (a.hW_SerialNumber?.toLowerCase() < b.hW_SerialNumber?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_FirmwareVersion") { displayData.sort((a, b) => { if ((a.hW_FirmwareVersion === null || a.hW_FirmwareVersion === undefined) && (b.hW_FirmwareVersion === null || b.hW_FirmwareVersion === undefined)) { return 0; } else if (a.hW_FirmwareVersion === null || a.hW_FirmwareVersion === undefined) { return 1; } else if (b.hW_FirmwareVersion === null || b.hW_FirmwareVersion === undefined) { return -1; } else if (a.hW_FirmwareVersion?.toLowerCase() > b.hW_FirmwareVersion?.toLowerCase()) { return 1; } else if (a.hW_FirmwareVersion?.toLowerCase() < b.hW_FirmwareVersion?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_MultiLicense") { displayData.sort((a, b) => { if ((a.hW_MultiLicense === null || a.hW_MultiLicense === undefined) && (b.hW_MultiLicense === null || b.hW_MultiLicense === undefined)) { return 0; } else if (a.hW_MultiLicense === null || a.hW_MultiLicense === undefined) { return 1; } else if (b.hW_MultiLicense === null || b.hW_MultiLicense === undefined) { return -1; } else if (a.hW_MultiLicense?.toLowerCase() > b.hW_MultiLicense?.toLowerCase()) { return 1; } else if (a.hW_MultiLicense?.toLowerCase() < b.hW_MultiLicense?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_MicCount") { displayData.sort((a, b) => { if ((a.hW_MicCount === null || a.hW_MicCount === undefined) && (b.hW_MicCount === null || b.hW_MicCount === undefined)) { return 0; } else if (a.hW_MicCount === null || a.hW_MicCount === undefined) { return 1; } else if (b.hW_MicCount === null || b.hW_MicCount === undefined) { return -1; } else if (a.hW_MicCount > b.hW_MicCount) { return 1; } else if (a.hW_MicCount < b.hW_MicCount) { return -1; } else { return 0; } }); }
        else if (data === "hW_MonitorModelName") { displayData.sort((a, b) => { if ((a.hW_MonitorModelName === null || a.hW_MonitorModelName === undefined) && (b.hW_MonitorModelName === null || b.hW_MonitorModelName === undefined)) { return 0; } else if (a.hW_MonitorModelName === null || a.hW_MonitorModelName === undefined) { return 1; } else if (b.hW_MonitorModelName === null || b.hW_MonitorModelName === undefined) { return -1; } else if (a.hW_MonitorModelName?.toLowerCase() > b.hW_MonitorModelName?.toLowerCase()) { return 1; } else if (a.hW_MonitorModelName?.toLowerCase() < b.hW_MonitorModelName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_MonitorType") { displayData.sort((a, b) => { if ((a.hW_MonitorType === null || a.hW_MonitorType === undefined) && (b.hW_MonitorType === null || b.hW_MonitorType === undefined)) { return 0; } else if (a.hW_MonitorType === null || a.hW_MonitorType === undefined) { return 1; } else if (b.hW_MonitorType === null || b.hW_MonitorType === undefined) { return -1; } else if (a.hW_MonitorType?.toLowerCase() > b.hW_MonitorType?.toLowerCase()) { return 1; } else if (a.hW_MonitorType?.toLowerCase() < b.hW_MonitorType?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_MonitorScreenSizeInch") { displayData.sort((a, b) => { if ((a.hW_MonitorScreenSizeInch === null || a.hW_MonitorScreenSizeInch === undefined) && (b.hW_MonitorScreenSizeInch === null || b.hW_MonitorScreenSizeInch === undefined)) { return 0; } else if (a.hW_MonitorScreenSizeInch === null || a.hW_MonitorScreenSizeInch === undefined) { return 1; } else if (b.hW_MonitorScreenSizeInch === null || b.hW_MonitorScreenSizeInch === undefined) { return -1; } else if (a.hW_MonitorScreenSizeInch > b.hW_MonitorScreenSizeInch) { return 1; } else if (a.hW_MonitorScreenSizeInch < b.hW_MonitorScreenSizeInch) { return -1; } else { return 0; } }); }
        else if (data === "hW_ScreenIP") { displayData.sort((a, b) => { if ((a.hW_ScreenIP === null || a.hW_ScreenIP === undefined) && (b.hW_ScreenIP === null || b.hW_ScreenIP === undefined)) { return 0; } else if (a.hW_ScreenIP === null || a.hW_ScreenIP === undefined) { return 1; } else if (b.hW_ScreenIP === null || b.hW_ScreenIP === undefined) { return -1; } else if (a.hW_ScreenIP?.toLowerCase() > b.hW_ScreenIP?.toLowerCase()) { return 1; } else if (a.hW_ScreenIP?.toLowerCase() < b.hW_ScreenIP?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_HostName") { displayData.sort((a, b) => { if ((a.hW_HostName === null || a.hW_HostName === undefined) && (b.hW_HostName === null || b.hW_HostName === undefined)) { return 0; } else if (a.hW_HostName === null || a.hW_HostName === undefined) { return 1; } else if (b.hW_HostName === null || b.hW_HostName === undefined) { return -1; } else if (a.hW_HostName?.toLowerCase() > b.hW_HostName?.toLowerCase()) { return 1; } else if (a.hW_HostName?.toLowerCase() < b.hW_HostName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_QosVolume") { displayData.sort((a, b) => { if ((a.hW_QosVolume === null || a.hW_QosVolume === undefined) && (b.hW_QosVolume === null || b.hW_QosVolume === undefined)) { return 0; } else if (a.hW_QosVolume === null || a.hW_QosVolume === undefined) { return 1; } else if (b.hW_QosVolume === null || b.hW_QosVolume === undefined) { return -1; } else if (a.hW_QosVolume?.toLowerCase() > b.hW_QosVolume?.toLowerCase()) { return 1; } else if (a.hW_QosVolume?.toLowerCase() < b.hW_QosVolume?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_PrivateCompanyBW") { displayData.sort((a, b) => { if ((a.hW_PrivateCompanyBW === null || a.hW_PrivateCompanyBW === undefined) && (b.hW_PrivateCompanyBW === null || b.hW_PrivateCompanyBW === undefined)) { return 0; } else if (a.hW_PrivateCompanyBW === null || a.hW_PrivateCompanyBW === undefined) { return 1; } else if (b.hW_PrivateCompanyBW === null || b.hW_PrivateCompanyBW === undefined) { return -1; } else if (a.hW_PrivateCompanyBW?.toLowerCase() > b.hW_PrivateCompanyBW?.toLowerCase()) { return 1; } else if (a.hW_PrivateCompanyBW?.toLowerCase() < b.hW_PrivateCompanyBW?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_Special") { displayData.sort((a, b) => { if ((a.hW_Special === null || a.hW_Special === undefined) && (b.hW_Special === null || b.hW_Special === undefined)) { return 0; } else if (a.hW_Special === null || a.hW_Special === undefined) { return 1; } else if (b.hW_Special === null || b.hW_Special === undefined) { return -1; } else if (a.hW_Special?.toLowerCase() > b.hW_Special?.toLowerCase()) { return 1; } else if (a.hW_Special?.toLowerCase() < b.hW_Special?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "connect_NWEquip_1") { displayData.sort((a, b) => { if ((a.connect_NWEquip_1 === null || a.connect_NWEquip_1 === undefined) && (b.connect_NWEquip_1 === null || b.connect_NWEquip_1 === undefined)) { return 0; } else if (a.connect_NWEquip_1 === null || a.connect_NWEquip_1 === undefined) { return 1; } else if (b.connect_NWEquip_1 === null || b.connect_NWEquip_1 === undefined) { return -1; } else if (a.connect_NWEquip_1?.toLowerCase() > b.connect_NWEquip_1?.toLowerCase()) { return 1; } else if (a.connect_NWEquip_1?.toLowerCase() < b.connect_NWEquip_1?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "connect_NWEquip_2") { displayData.sort((a, b) => { if ((a.connect_NWEquip_2 === null || a.connect_NWEquip_2 === undefined) && (b.connect_NWEquip_2 === null || b.connect_NWEquip_2 === undefined)) { return 0; } else if (a.connect_NWEquip_2 === null || a.connect_NWEquip_2 === undefined) { return 1; } else if (b.connect_NWEquip_2 === null || b.connect_NWEquip_2 === undefined) { return -1; } else if (a.connect_NWEquip_2?.toLowerCase() > b.connect_NWEquip_2?.toLowerCase()) { return 1; } else if (a.connect_NWEquip_2?.toLowerCase() < b.connect_NWEquip_2?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_OverUsedYear") { displayData.sort((a, b) => { if ((a.basic_OverUsedYear === null || a.basic_OverUsedYear === undefined) && (b.basic_OverUsedYear === null || b.basic_OverUsedYear === undefined)) { return 0; } else if (a.basic_OverUsedYear === null || a.basic_OverUsedYear === undefined) { return 1; } else if (b.basic_OverUsedYear === null || b.basic_OverUsedYear === undefined) { return -1; } else if (a.basic_OverUsedYear > b.basic_OverUsedYear) { return 1; } else if (a.basic_OverUsedYear < b.basic_OverUsedYear) { return -1; } else { return 0; } }); }
        else if (data === "basic_ReceiveDate") { displayData.sort((a, b) => { if ((a.basic_ReceiveDate === null || a.basic_ReceiveDate === undefined) && (b.basic_ReceiveDate === null || b.basic_ReceiveDate === undefined)) { return 0; } else if (a.basic_ReceiveDate === null || a.basic_ReceiveDate === undefined) { return 1; } else if (b.basic_ReceiveDate === null || b.basic_ReceiveDate === undefined) { return -1; } else if (a.basic_ReceiveDate > b.basic_ReceiveDate) { return 1; } else if (a.basic_ReceiveDate < b.basic_ReceiveDate) { return -1; } else { return 0; } }); }
        else if (data === "basic_RegDate") { displayData.sort((a, b) => { if ((a.basic_RegDate === null || a.basic_RegDate === undefined) && (b.basic_RegDate === null || b.basic_RegDate === undefined)) { return 0; } else if (a.basic_RegDate === null || a.basic_RegDate === undefined) { return 1; } else if (b.basic_RegDate === null || b.basic_RegDate === undefined) { return -1; } else if (a.basic_RegDate > b.basic_RegDate) { return 1; } else if (a.basic_RegDate < b.basic_RegDate) { return -1; } else { return 0; } }); }
        else if (data === "basic_DiscardDate") { displayData.sort((a, b) => { if ((a.basic_DiscardDate === null || a.basic_DiscardDate === undefined) && (b.basic_DiscardDate === null || b.basic_DiscardDate === undefined)) { return 0; } else if (a.basic_DiscardDate === null || a.basic_DiscardDate === undefined) { return 1; } else if (b.basic_DiscardDate === null || b.basic_DiscardDate === undefined) { return -1; } else if (a.basic_DiscardDate > b.basic_DiscardDate) { return 1; } else if (a.basic_DiscardDate < b.basic_DiscardDate) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_WarrantyExpiredDate") { displayData.sort((a, b) => { if ((a.maintenance_WarrantyExpiredDate === null || a.maintenance_WarrantyExpiredDate === undefined) && (b.maintenance_WarrantyExpiredDate === null || b.maintenance_WarrantyExpiredDate === undefined)) { return 0; } else if (a.maintenance_WarrantyExpiredDate === null || a.maintenance_WarrantyExpiredDate === undefined) { return 1; } else if (b.maintenance_WarrantyExpiredDate === null || b.maintenance_WarrantyExpiredDate === undefined) { return -1; } else if (a.maintenance_WarrantyExpiredDate > b.maintenance_WarrantyExpiredDate) { return 1; } else if (a.maintenance_WarrantyExpiredDate < b.maintenance_WarrantyExpiredDate) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_EOSDate") { displayData.sort((a, b) => { if ((a.maintenance_EOSDate === null || a.maintenance_EOSDate === undefined) && (b.maintenance_EOSDate === null || b.maintenance_EOSDate === undefined)) { return 0; } else if (a.maintenance_EOSDate === null || a.maintenance_EOSDate === undefined) { return 1; } else if (b.maintenance_EOSDate === null || b.maintenance_EOSDate === undefined) { return -1; } else if (a.maintenance_EOSDate > b.maintenance_EOSDate) { return 1; } else if (a.maintenance_EOSDate < b.maintenance_EOSDate) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_MaintenanceContract") { displayData.sort((a, b) => { if ((a.maintenance_MaintenanceContract === null || a.maintenance_MaintenanceContract === undefined) && (b.maintenance_MaintenanceContract === null || b.maintenance_MaintenanceContract === undefined)) { return 0; } else if (a.maintenance_MaintenanceContract === null || a.maintenance_MaintenanceContract === undefined) { return 1; } else if (b.maintenance_MaintenanceContract === null || b.maintenance_MaintenanceContract === undefined) { return -1; } else if (a.maintenance_MaintenanceContract > b.maintenance_MaintenanceContract) { return 1; } else if (a.maintenance_MaintenanceContract < b.maintenance_MaintenanceContract) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_MaintenanceBeginDate") { displayData.sort((a, b) => { if ((a.maintenance_MaintenanceBeginDate === null || a.maintenance_MaintenanceBeginDate === undefined) && (b.maintenance_MaintenanceBeginDate === null || b.maintenance_MaintenanceBeginDate === undefined)) { return 0; } else if (a.maintenance_MaintenanceBeginDate === null || a.maintenance_MaintenanceBeginDate === undefined) { return 1; } else if (b.maintenance_MaintenanceBeginDate === null || b.maintenance_MaintenanceBeginDate === undefined) { return -1; } else if (a.maintenance_MaintenanceBeginDate > b.maintenance_MaintenanceBeginDate) { return 1; } else if (a.maintenance_MaintenanceBeginDate < b.maintenance_MaintenanceBeginDate) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_MaintenanceEndDate") { displayData.sort((a, b) => { if ((a.maintenance_MaintenanceEndDate === null || a.maintenance_MaintenanceEndDate === undefined) && (b.maintenance_MaintenanceEndDate === null || b.maintenance_MaintenanceEndDate === undefined)) { return 0; } else if (a.maintenance_MaintenanceEndDate === null || a.maintenance_MaintenanceEndDate === undefined) { return 1; } else if (b.maintenance_MaintenanceEndDate === null || b.maintenance_MaintenanceEndDate === undefined) { return -1; } else if (a.maintenance_MaintenanceEndDate > b.maintenance_MaintenanceEndDate) { return 1; } else if (a.maintenance_MaintenanceEndDate < b.maintenance_MaintenanceEndDate) { return -1; } else { return 0; } }); }
        else if (data === "hW_PAD") { displayData.sort((a, b) => { if ((a.hW_PAD === null || a.hW_PAD === undefined) && (b.hW_PAD === null || b.hW_PAD === undefined)) { return 0; } else if (a.hW_PAD === null || a.hW_PAD === undefined) { return 1; } else if (b.hW_PAD === null || b.hW_PAD === undefined) { return -1; } else if (a.hW_PAD > b.hW_PAD) { return 1; } else if (a.hW_PAD < b.hW_PAD) { return -1; } else { return 0; } }); }
        else if (data === "hW_Rack") { displayData.sort((a, b) => { if ((a.hW_Rack === null || a.hW_Rack === undefined) && (b.hW_Rack === null || b.hW_Rack === undefined)) { return 0; } else if (a.hW_Rack === null || a.hW_Rack === undefined) { return 1; } else if (b.hW_Rack === null || b.hW_Rack === undefined) { return -1; } else if (a.hW_Rack > b.hW_Rack) { return 1; } else if (a.hW_Rack < b.hW_Rack) { return -1; } else { return 0; } }); }
        else if (data === "hW_QoS") { displayData.sort((a, b) => { if ((a.hW_QoS === null || a.hW_QoS === undefined) && (b.hW_QoS === null || b.hW_QoS === undefined)) { return 0; } else if (a.hW_QoS === null || a.hW_QoS === undefined) { return 1; } else if (b.hW_QoS === null || b.hW_QoS === undefined) { return -1; } else if (a.hW_QoS > b.hW_QoS) { return 1; } else if (a.hW_QoS < b.hW_QoS) { return -1; } else { return 0; } }); }
        else if (data === "hW_PrivateLine") { displayData.sort((a, b) => { if ((a.hW_PrivateLine === null || a.hW_PrivateLine === undefined) && (b.hW_PrivateLine === null || b.hW_PrivateLine === undefined)) { return 0; } else if (a.hW_PrivateLine === null || a.hW_PrivateLine === undefined) { return 1; } else if (b.hW_PrivateLine === null || b.hW_PrivateLine === undefined) { return -1; } else if (a.hW_PrivateLine > b.hW_PrivateLine) { return 1; } else if (a.hW_PrivateLine < b.hW_PrivateLine) { return -1; } else { return 0; } }); }


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
                return [null, `No(${i+1}) 기타장비명은 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.basic_Status || itemData.basic_Status.trim().length === 0) {
                return [null, `No(${i+1}) 상태는 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.basic_EquipDetailClass || itemData.basic_EquipDetailClass.trim().length === 0) {
                return [null, `No(${i+1}) 기타장비 상세분류는 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.basic_ItemLevel || itemData.basic_ItemLevel.trim().length === 0) {
                return [null, `No(${i+1}) 기타등급은 필수요소입니다. 비워둘수 없습니다.`, null];
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
        }

        return [itemDatas, null, InventoryManagement.itemType.Etc];
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
                <div className={main.etcTable}>
                    <table ref={this.refTable1} border="1" style={{ minWidth: '8%' }}>
                        <thead>
                            <tr style={{ height: '78px' }}>
                                <th rowspan="3"><div className={main.editFlex}><span>전체</span><span><input ref={this.refAllCheck} type="checkBox" id="allCheck" onChange={(e) => this.onChangeAllCheck(e.target)} /></span></div></th>
                                <th rowspan="3" style={{ padding: '0px 15px' }}>No</th>
                                <th rowspan="3" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>기타장비명<span className={main.bottomArrowIcon} onClick={() => this.onClickSort("basic_Name")}></span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableDataUI1}
                        </tbody>
                    </table>
                    <table ref={this.refTable2} border="1" className="generalTable" style={{ minWidth: '80%' }}>
                        <thead>
                            <tr style={{ height: '26px' }}>
                                <th colspan="18">기본정보<span className={main.gleftArrowIcon} onClick={() => this.props.onClickCheck("generalCheckbox")}></span></th>
                            </tr>
                            <tr>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>상태<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_Status")}></span></th>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>기타장비상세분류<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_EquipDetailClass")}></span></th>
                                <th rowspan="2">사용년한<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_LifeYear")}></span></th>
                                <th rowspan="2">초과여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_OverUsedYear")}></span></th>
                                <th rowspan="2">입고일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_ReceiveDate")}></span></th>
                                <th rowspan="2">설치일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_RegDate")}></span></th>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>기타 등급<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_ItemLevel")}></span></th>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>용도<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_Usage")}></span></th>
                                <th rowspan="2">자산구분<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_OwnerCompanyName")}></span></th>
                                <th rowspan="2">주관부서<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_OwnDepartment")}></span></th>
                                <th rowspan="2">운영부서<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_OperationDepartment")}></span></th>
                                <th rowspan="2">사업장 담당자<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_SiteManager")}></span></th>
                                <th rowspan="2">폐기일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_DiscardDate")}></span></th>
                                <th rowspan="2">메모<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_Memo")}></span></th>
                                <th colspan="2">담당자<span className={main.leftArrowIcon} ></span></th>
                                <th colspan="2">위치<span className={main.leftArrowIcon} ></span></th>
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
                    <table ref={this.refTable3} border="1" className="maintenanceTable" style={{ minWidth: '60%' }}>
                        <thead>
                            <tr style={{ height: '52px' }}>
                                <th colspan="9">유지보수정보<span className={main.mleftArrowIcon} onClick={() => this.props.onClickCheck("maintenanceCheckbox")}></span></th>
                            </tr>
                            <tr>
                                <th rowspan="2">공급업체<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_ProvideCompanyName")}></span></th>
                                <th rowspan="2">Warranty기간<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_WarrantyMonth")}></span></th>
                                <th rowspan="2">Warranty 만료일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_WarrantyExpiredDate")}></span></th>
                                <th rowspan="2">비용(구매)부서<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_FinancialDepartment")}></span></th>
                                <th rowspan="2">유지보수업체<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_MaintenanceCompanyName")}></span></th>
                                <th rowspan="2">EOS 일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_EOSDate")}></span></th>
                                <th rowspan="2" style={{ width: '150px' }}>유지보수 계약여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_MaintenanceContract")}></span></th>
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
                    <table ref={this.refTable4} border="1" className="hardwareTable" style={{ /* minWidth: '84%' */ minWidth: '120%' }}>
                        <thead>
                            <tr style={{ height: '52px' }}>
                                <th colspan="18">하드웨어정보<span className={main.hleftArrowIcon} onClick={() => this.props.onClickCheck("hardwareCheckbox")}></span></th>
                            </tr>
                            <tr>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>모델명<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_ModelName")}></span></th>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>제조사<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_Company")}></span></th>
                                <th rowspan="2">시리얼번호<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_SerialNumber")}></span></th>
                                <th rowspan="2">Version<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_FirmwareVersion")}></span></th>
                                <th rowspan="2">다자간 라이센스<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_MultiLicense")}></span></th>
                                <th rowspan="2">마이크 수량(EA)<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_MicCount")}></span></th>
                                <th rowspan="2">PAD여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_PAD")}></span></th>
                                <th rowspan="2">거치대여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_Rack")}></span></th>
                                <th rowspan="2">모니터 모델명<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_MonitorModelName")}></span></th>
                                <th rowspan="2">모니터 타입<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_MonitorType")}></span></th>
                                <th rowspan="2" style={{ width: '150px' }}>모니터 화면크기(Inch)<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_MonitorScreenSizeInch")}></span></th>
                                <th rowspan="2">화상 IP<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_ScreenIP")}></span></th>
                                <th rowspan="2">호스트명<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_HostName")}></span></th>
                                <th rowspan="2">QoS 설정여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_QoS")}></span></th>
                                <th rowspan="2">QoS 할당량<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_QosVolume")}></span></th>
                                <th rowspan="2" style={{ width: '150px' }}>전용화상회선여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_PrivateLine")}></span></th>
                                <th rowspan="2">전용화상회사 B/W<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_PrivateCompanyBW")}></span></th>
                                <th rowspan="2">특이사항<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_Special")}></span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableDataUI4}
                        </tbody>
                    </table>
                    {/* <div className={main.hardwareBtnBox} onClick={() => this.props.onClickCheck("hardwareCheckbox")}>
                        <span className={main.hleftArrowIcon}></span>
                    </div> */}
                    <table ref={this.refTable5} border="1" className="connectTable" style={{ minWidth: '8%' }}>
                        <thead>
                            <tr style={{ height: '52px' }}>
                                <th colspan="2">연결정보<span className={main.cleftArrowIcon} onClick={() => this.props.onClickCheck("connectCheckbox")}></span></th>
                            </tr>
                            <tr>
                                <th rowspan="2">NW장비-1<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_NWEquip_1")}></span></th>
                                <th rowspan="2">NW장비-2<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_NWEquip_2")}></span></th>
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
export default EtcTable;