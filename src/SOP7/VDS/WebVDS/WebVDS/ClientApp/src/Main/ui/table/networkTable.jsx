import React, { Component } from 'react';
import $ from 'jquery';
import main from '../../../Main/css/main.module.css';
import InputText from './inputText';
import SelectBox from './selectBox';
import DatePickerBox from './datePickerBox';
import InventoryManagement from '../inventoryManagement';

class NetworkTable extends Component {

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
            this.setState({ });
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
        } else if (column === "basic_Type1" && data.basic_Type1 !== value) {
            this.props.isModifiy(true);
            data.basic_Type1 = value;
        } else if (column === "basic_Type2" && data.basic_Type2 !== value) {
            this.props.isModifiy(true);
            data.basic_Type2 = value;
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
        } else if (column === "hW_OSVersion" && data.hW_OSVersion !== value) {
            this.props.isModifiy(true);
            data.hW_OSVersion = value;
        } else if (column === "hW_IP_01" && data.hW_IP_01 !== value) {
            this.props.isModifiy(true);
            data.hW_IP_01 = value;
        } else if (column === "hW_IP_02" && data.hW_IP_02 !== value) {
            this.props.isModifiy(true);
            data.hW_IP_02 = value;
        } else if (column === "hW_IP_03" && data.hW_IP_03 !== value) {
            this.props.isModifiy(true);
            data.hW_IP_03 = value;
        } else if (column === "hW_IP_04" && data.hW_IP_04 !== value) {
            this.props.isModifiy(true);
            data.hW_IP_04 = value;
        } else if (column === "hW_IP_05" && data.hW_IP_05 !== value) {
            this.props.isModifiy(true);
            data.hW_IP_05 = value;
        } else if (column === "hW_IP_06" && data.hW_IP_06 !== value) {
            this.props.isModifiy(true);
            data.hW_IP_06 = value;
        } else if (column === "hW_IP_07" && data.hW_IP_07 !== value) {
            this.props.isModifiy(true);
            data.hW_IP_07 = value;
        } else if (column === "hW_IP_08" && data.hW_IP_08 !== value) {
            this.props.isModifiy(true);
            data.hW_IP_08 = value;
        } else if (column === "hW_Rack" && data.hW_Rack !== value) {
            this.props.isModifiy(true);
            data.hW_Rack = value;
        } else if (column === "hW_Zone" && data.hW_Zone !== value) {
            this.props.isModifiy(true);
            data.hW_Zone = value;
        } else if (column === "hW_DetailUsage" && data.hW_DetailUsage !== value) {
            this.props.isModifiy(true);
            data.hW_DetailUsage = value;
        } else if (column === "hW_NWLineName" && data.hW_NWLineName !== value) {
            this.props.isModifiy(true);
            data.hW_NWLineName = value;
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
        } else if (column === "basic_ReceiveDate" && data.basic_ReceiveDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.basic_ReceiveDate = this.setNullableDate(value);
        } else if (column === "basic_RegDate" && data.basic_RegDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.basic_RegDate = this.setNullableDate(value);
        } else if (column === "basic_OverUsedYear" && data.basic_OverUsedYear !== value) {
            this.props.isModifiy(true);
            data.basic_OverUsedYear = value;
        } else if (column === "basic_Stock" && data.basic_Stock !== value) {
            this.props.isModifiy(true);
            data.basic_Stock = value;
        } else if (column === "maintenance_WarrantyExpiredDate" && data.maintenance_WarrantyExpiredDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.maintenance_WarrantyExpiredDate = this.setNullableDate(value);
        } else if (column === "maintenance_EOSDate" && data.maintenance_EOSDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.maintenance_EOSDate = this.setNullableDate(value);
        } else if (column === "maintenance_EOLDate" && data.maintenance_EOLDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.maintenance_EOLDate = this.setNullableDate(value);
        } else if (column === "maintenance_MaintenanceContract" && data.maintenance_MaintenanceContract !== value) {
            this.props.isModifiy(true);
            data.maintenance_MaintenanceContract = value;
        } else if (column === "maintenance_MaintenanceBeginDate" && data.maintenance_MaintenanceBeginDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.maintenance_MaintenanceBeginDate = this.setNullableDate(value);
        } else if (column === "maintenance_MaintenanceEndDate" && data.maintenance_MaintenanceEndDate !== this.setNullableDate(value)) {
            this.props.isModifiy(true);
            data.maintenance_MaintenanceEndDate = this.setNullableDate(value);
        } else if (column === "hW_PowerDual" && data.hW_PowerDual !== value) {
            this.props.isModifiy(true);
            data.hW_PowerDual = value;
        }
    }

    onChangeCheck = (target, data) => {
        if (!data)
            return;

        let checkList = [];

        if (target.checked) {
            // 체크한 경우
            checkList.push(data.networkID);
            this.props.insertCheckList(checkList);
        } else {
            // 체크 해제한 경우
            checkList.push(data.networkID);

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
                    checkList.push(data.networkID);
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

        if (item.basic_ItemLevel && item.basic_ItemLevel.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_ReceiveDate && item.basic_ReceiveDate.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_RegDate && item.basic_RegDate.toString().toLowerCase().includes(searchText)) {
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

        if (item.basic_OverUsedYear && item.basic_OverUsedYear.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_Stock && item.basic_Stock.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_Type1 && item.basic_Type1.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.basic_Type2 && item.basic_Type2.toString().toLowerCase().includes(searchText)) {
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

        if (item.hW_OSVersion && item.hW_OSVersion.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_IP_01 && item.hW_IP_01.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_IP_02 && item.hW_IP_02.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_IP_03 && item.hW_IP_03.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_IP_04 && item.hW_IP_04.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_IP_05 && item.hW_IP_05.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_IP_06 && item.hW_IP_06.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_IP_07 && item.hW_IP_07.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_IP_08 && item.hW_IP_08.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_Rack && item.hW_Rack.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_PowerDual && item.hW_PowerDual.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_Zone && item.hW_Zone.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_DetailUsage && item.hW_DetailUsage.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_NMS && item.hW_NMS.toString().toLowerCase().includes(searchText)) {
            return true;
        }

        if (item.hW_NWLineName && item.hW_NWLineName.toString().toLowerCase().includes(searchText)) {
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
        //const displayData = this.state.displayData;

        const addedDatas = [...this.props.addedDatas];
        const addedCount = addedDatas.length;

        for (let i = addedCount - 1; i >= 0; i--) {
            const addedData = addedDatas[i];
            addedData.newOne = true;
            displayData.unshift(addedData);
        }

        const sortString = this.state.sortString;

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
                    <tr key={data.networkID + "_1_" + rowIndex} className={main.tableTr}>
                        <td className={main.tableTd}><input type="checkBox" className="colCheckBox" onChange={(e) => this.onChangeCheck(e.target, data)} /></td>
                        <td>{i + 1}</td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable2, rowIndex + 3)}><InputText id={"basic_Name" + i} type="text" value={data.basic_Name} onChange={(value) => this.onChangeInputText(data, "basic_Name", value)} editMode={editName} /></td>
                    </tr>
                );
                tableDataUI2.push(
                    <tr key={data.networkID + "_2_" + rowIndex} className={main.tableTr}>
                        <td><InputText id={"basic_Status" + i} type="text" value={data.basic_Status} onChange={(value) => this.onChangeInputText(data, "basic_Status", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"basic_EquipDetailClass" + i} type="text" value={data.basic_EquipDetailClass} onChange={(value) => this.onChangeInputText(data, "basic_EquipDetailClass", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"basic_ItemLevel" + i} type="text" value={data.basic_ItemLevel} onChange={(value) => this.onChangeInputText(data, "basic_ItemLevel", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox id={"basic_ReceiveDate" + i} value={data.basic_ReceiveDate} onChange={(value) => this.onChangeInputText(data, "basic_ReceiveDate", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox id={"basic_RegDate" + i} value={data.basic_RegDate} onChange={(value) => this.onChangeInputText(data, "basic_RegDate", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"basic_Usage" + i} type="text" value={data.basic_Usage} onChange={(value) => this.onChangeInputText(data, "basic_Usage", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"basic_OwnerCompanyName" + i} type="text" value={data.basic_OwnerCompanyName} onChange={(value) => this.onChangeInputText(data, "basic_OwnerCompanyName", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"basic_OwnDepartment" + i} type="text" value={data.basic_OwnDepartment} onChange={(value) => this.onChangeInputText(data, "basic_OwnDepartment", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"basic_OperationDepartment" + i} type="text" value={data.basic_OperationDepartment} onChange={(value) => this.onChangeInputText(data, "basic_OperationDepartment", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox id={"basic_OverUsedYear" + i} type="yesno" value={data.basic_OverUsedYear} onChange={(value) => this.onChangeInputText(data, "basic_OverUsedYear", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox id={"basic_Stock" + i} type="yesno" value={data.basic_Stock} onChange={(value) => this.onChangeInputText(data, "basic_Stock", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"basic_Type1" + i} type="text" value={data.basic_Type1} onChange={(value) => this.onChangeInputText(data, "basic_Type1", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"basic_Type2" + i} type="text" value={data.basic_Type2} onChange={(value) => this.onChangeInputText(data, "basic_Type2", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"basic_Memo" + i} type="text" value={data.basic_Memo} onChange={(value) => this.onChangeInputText(data, "basic_Memo", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"manage_SuperviseManager" + i} type="text" value={data.manage_SuperviseManager} onChange={(value) => this.onChangeInputText(data, "manage_SuperviseManager", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"manage_OperationManager" + i} type="text" value={data.manage_OperationManager} onChange={(value) => this.onChangeInputText(data, "manage_OperationManager", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"position_InstallRegion" + i} type="text" value={data.position_InstallRegion} onChange={(value) => this.onChangeInputText(data, "position_InstallRegion", value)} editMode={this.props.editMode} /></td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable3, rowIndex + 2)}><InputText id={"position_RackDetailPosition" + i} type="text" value={data.position_RackDetailPosition} onChange={(value) => this.onChangeInputText(data, "position_RackDetailPosition", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );
                tableDataUI3.push(
                    <tr key={data.networkID + "_3_" + rowIndex} className={main.tableTr}>
                        <td><InputText id={"maintenance_ProvideCompanyName" + i} type="text" value={data.maintenance_ProvideCompanyName} onChange={(value) => this.onChangeInputText(data, "maintenance_ProvideCompanyName", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"maintenance_WarrantyMonth" + i} type="nullNumber" value={data.maintenance_WarrantyMonth} onChange={(value) => this.onChangeInputText(data, "maintenance_WarrantyMonth", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox id={"maintenance_WarrantyExpiredDate" + i} value={data.maintenance_WarrantyExpiredDate} onChange={(value) => this.onChangeInputText(data, "maintenance_WarrantyExpiredDate", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"maintenance_MaintenanceCompanyName" + i} type="text" value={data.maintenance_MaintenanceCompanyName} onChange={(value) => this.onChangeInputText(data, "maintenance_MaintenanceCompanyName", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox id={"maintenance_EOSDate" + i} value={data.maintenance_EOSDate} onChange={(value) => this.onChangeInputText(data, "maintenance_EOSDate", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox id={"maintenance_EOLDate" + i} value={data.maintenance_EOLDate} onChange={(value) => this.onChangeInputText(data, "maintenance_EOLDate", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox id={"maintenance_MaintenanceContract" + i} type="yesno" value={data.maintenance_MaintenanceContract} onChange={(value) => this.onChangeInputText(data, "maintenance_MaintenanceContract", value)} editMode={this.props.editMode} /></td>
                        <td><DatePickerBox id={"maintenance_MaintenanceBeginDate" + i} value={data.maintenance_MaintenanceBeginDate} onChange={(value) => this.onChangeInputText(data, "maintenance_MaintenanceBeginDate", value)} editMode={this.props.editMode} /></td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable4, rowIndex + 2)}><DatePickerBox id={"maintenance_MaintenanceEndDate" + i} value={data.maintenance_MaintenanceEndDate} onChange={(value) => this.onChangeInputText(data, "maintenance_MaintenanceEndDate", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );
                tableDataUI4.push(
                    <tr key={data.networkID + "_4_" + rowIndex} className={main.tableTr}>
                        <td><InputText id={"hW_ModelName" + i} type="text" value={data.hW_ModelName} onChange={(value) => this.onChangeInputText(data, "hW_ModelName", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"hW_Company" + i} type="text" value={data.hW_Company} onChange={(value) => this.onChangeInputText(data, "hW_Company", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"hW_SerialNumber" + i} type="text" value={data.hW_SerialNumber} onChange={(value) => this.onChangeInputText(data, "hW_SerialNumber", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"hW_OSVersion" + i} type="text" value={data.hW_OSVersion} onChange={(value) => this.onChangeInputText(data, "hW_OSVersion", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"hW_IP_01" + i} type="text" value={data.hW_IP_01} onChange={(value) => this.onChangeInputText(data, "hW_IP_01", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"hW_IP_02" + i} type="text" value={data.hW_IP_02} onChange={(value) => this.onChangeInputText(data, "hW_IP_02", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"hW_IP_03" + i} type="text" value={data.hW_IP_03} onChange={(value) => this.onChangeInputText(data, "hW_IP_03", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"hW_IP_04" + i} type="text" value={data.hW_IP_04} onChange={(value) => this.onChangeInputText(data, "hW_IP_04", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"hW_IP_05" + i} type="text" value={data.hW_IP_05} onChange={(value) => this.onChangeInputText(data, "hW_IP_05", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"hW_IP_06" + i} type="text" value={data.hW_IP_06} onChange={(value) => this.onChangeInputText(data, "hW_IP_06", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"hW_IP_07" + i} type="text" value={data.hW_IP_07} onChange={(value) => this.onChangeInputText(data, "hW_IP_07", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"hW_IP_08" + i} type="text" value={data.hW_IP_08} onChange={(value) => this.onChangeInputText(data, "hW_IP_08", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"hW_Rack" + i} type="text" value={data.hW_Rack} onChange={(value) => this.onChangeInputText(data, "hW_Rack", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox id={"hW_PowerDual" + i} type="yesno" value={data.hW_PowerDual} onChange={(value) => this.onChangeInputText(data, "hW_PowerDual", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"hW_Zone" + i} type="text" value={data.hW_Zone} onChange={(value) => this.onChangeInputText(data, "hW_Zone", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"hW_DetailUsage" + i} type="text" value={data.hW_DetailUsage} onChange={(value) => this.onChangeInputText(data, "hW_DetailUsage", value)} editMode={this.props.editMode} /></td>
                        <td><SelectBox id={"hW_NMS" + i} type="yesno" value={data.hW_NMS} onChange={(value) => this.onChangeInputText(data, "hW_NMS", value)} editMode={this.props.editMode} /></td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable5, rowIndex + 2)}><InputText id={"hW_NWLineName" + i} type="text" value={data.hW_NWLineName} onChange={(value) => this.onChangeInputText(data, "hW_NWLineName", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );
                tableDataUI5.push(
                    <tr key={data.networkID + "_5_" + rowIndex} className={main.tableTr}>
                        <td><InputText id={"connect_NWEquip_1" + i} type="text" value={data.connect_NWEquip_1} onChange={(value) => this.onChangeInputText(data, "connect_NWEquip_1", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"connect_NWEquip_2" + i} type="text" value={data.connect_NWEquip_2} onChange={(value) => this.onChangeInputText(data, "connect_NWEquip_2", value)} editMode={this.props.editMode} /></td>
                        <td><InputText id={"connect_NWEquip_3" + i} type="text" value={data.connect_NWEquip_3} onChange={(value) => this.onChangeInputText(data, "connect_NWEquip_3", value)} editMode={this.props.editMode} /></td>
                        <td onKeyDown={(e) => this.onTabClick(e, this.refTable1, rowIndex + 2)}><InputText id={"connect_NWEquip_4" + i} type="text" value={data.connect_NWEquip_4} onChange={(value) => this.onChangeInputText(data, "connect_NWEquip_4", value)} editMode={this.props.editMode} /></td>
                    </tr>
                );
                tableDataUI6.push(
                    <tr key={data.networkID + "_6_" + rowIndex} className={main.tableTr}>
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
        else if (data === "basic_ItemLevel") { displayData.sort((a, b) => { if ((a.basic_ItemLevel === null || a.basic_ItemLevel === undefined) && (b.basic_ItemLevel === null || b.basic_ItemLevel === undefined)) { return 0; } else if (a.basic_ItemLevel === null || a.basic_ItemLevel === undefined) { return 1; } else if (b.basic_ItemLevel === null || b.basic_ItemLevel === undefined) { return -1; } else if (a.basic_ItemLevel?.toLowerCase() > b.basic_ItemLevel?.toLowerCase()) { return 1; } else if (a.basic_ItemLevel?.toLowerCase() < b.basic_ItemLevel?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_Usage") { displayData.sort((a, b) => { if ((a.basic_Usage === null || a.basic_Usage === undefined) && (b.basic_Usage === null || b.basic_Usage === undefined)) { return 0; } else if (a.basic_Usage === null || a.basic_Usage === undefined) { return 1; } else if (b.basic_Usage === null || b.basic_Usage === undefined) { return -1; } else if (a.basic_Usage?.toLowerCase() > b.basic_Usage?.toLowerCase()) { return 1; } else if (a.basic_Usage?.toLowerCase() < b.basic_Usage?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_OwnerCompanyName") { displayData.sort((a, b) => { if ((a.basic_OwnerCompanyName === null || a.basic_OwnerCompanyName === undefined) && (b.basic_OwnerCompanyName === null || b.basic_OwnerCompanyName === undefined)) { return 0; } else if (a.basic_OwnerCompanyName === null || a.basic_OwnerCompanyName === undefined) { return 1; } else if (b.basic_OwnerCompanyName === null || b.basic_OwnerCompanyName === undefined) { return -1; } else if (a.basic_OwnerCompanyName?.toLowerCase() > b.basic_OwnerCompanyName?.toLowerCase()) { return 1; } else if (a.basic_OwnerCompanyName?.toLowerCase() < b.basic_OwnerCompanyName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_OwnDepartment") { displayData.sort((a, b) => { if ((a.basic_OwnDepartment === null || a.basic_OwnDepartment === undefined) && (b.basic_OwnDepartment === null || b.basic_OwnDepartment === undefined)) { return 0; } else if (a.basic_OwnDepartment === null || a.basic_OwnDepartment === undefined) { return 1; } else if (b.basic_OwnDepartment === null || b.basic_OwnDepartment === undefined) { return -1; } else if (a.basic_OwnDepartment?.toLowerCase() > b.basic_OwnDepartment?.toLowerCase()) { return 1; } else if (a.basic_OwnDepartment?.toLowerCase() < b.basic_OwnDepartment?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_OperationDepartment") { displayData.sort((a, b) => { if ((a.basic_OperationDepartment === null || a.basic_OperationDepartment === undefined) && (b.basic_OperationDepartment === null || b.basic_OperationDepartment === undefined)) { return 0; } else if (a.basic_OperationDepartment === null || a.basic_OperationDepartment === undefined) { return 1; } else if (b.basic_OperationDepartment === null || b.basic_OperationDepartment === undefined) { return -1; } else if (a.basic_OperationDepartment?.toLowerCase() > b.basic_OperationDepartment?.toLowerCase()) { return 1; } else if (a.basic_OperationDepartment?.toLowerCase() < b.basic_OperationDepartment?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_Type1") { displayData.sort((a, b) => { if ((a.basic_Type1 === null || a.basic_Type1 === undefined) && (b.basic_Type1 === null || b.basic_Type1 === undefined)) { return 0; } else if (a.basic_Type1 === null || a.basic_Type1 === undefined) { return 1; } else if (b.basic_Type1 === null || b.basic_Type1 === undefined) { return -1; } else if (a.basic_Type1?.toLowerCase() > b.basic_Type1?.toLowerCase()) { return 1; } else if (a.basic_Type1?.toLowerCase() < b.basic_Type1?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_Type2") { displayData.sort((a, b) => { if ((a.basic_Type2 === null || a.basic_Type2 === undefined) && (b.basic_Type2 === null || b.basic_Type2 === undefined)) { return 0; } else if (a.basic_Type2 === null || a.basic_Type2 === undefined) { return 1; } else if (b.basic_Type2 === null || b.basic_Type2 === undefined) { return -1; } else if (a.basic_Type2?.toLowerCase() > b.basic_Type2?.toLowerCase()) { return 1; } else if (a.basic_Type2?.toLowerCase() < b.basic_Type2?.toLowerCase()) { return -1; } else { return 0; } }); }
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
        else if (data === "hW_OSVersion") { displayData.sort((a, b) => { if ((a.hW_OSVersion === null || a.hW_OSVersion === undefined) && (b.hW_OSVersion === null || b.hW_OSVersion === undefined)) { return 0; } else if (a.hW_OSVersion === null || a.hW_OSVersion === undefined) { return 1; } else if (b.hW_OSVersion === null || b.hW_OSVersion === undefined) { return -1; } else if (a.hW_OSVersion?.toLowerCase() > b.hW_OSVersion?.toLowerCase()) { return 1; } else if (a.hW_OSVersion?.toLowerCase() < b.hW_OSVersion?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_IP_01") { displayData.sort((a, b) => { if ((a.hW_IP_01 === null || a.hW_IP_01 === undefined) && (b.hW_IP_01 === null || b.hW_IP_01 === undefined)) { return 0; } else if (a.hW_IP_01 === null || a.hW_IP_01 === undefined) { return 1; } else if (b.hW_IP_01 === null || b.hW_IP_01 === undefined) { return -1; } else if (a.hW_IP_01?.toLowerCase() > b.hW_IP_01?.toLowerCase()) { return 1; } else if (a.hW_IP_01?.toLowerCase() < b.hW_IP_01?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_IP_02") { displayData.sort((a, b) => { if ((a.hW_IP_02 === null || a.hW_IP_02 === undefined) && (b.hW_IP_02 === null || b.hW_IP_02 === undefined)) { return 0; } else if (a.hW_IP_02 === null || a.hW_IP_02 === undefined) { return 1; } else if (b.hW_IP_02 === null || b.hW_IP_02 === undefined) { return -1; } else if (a.hW_IP_02?.toLowerCase() > b.hW_IP_02?.toLowerCase()) { return 1; } else if (a.hW_IP_02?.toLowerCase() < b.hW_IP_02?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_IP_03") { displayData.sort((a, b) => { if ((a.hW_IP_03 === null || a.hW_IP_03 === undefined) && (b.hW_IP_03 === null || b.hW_IP_03 === undefined)) { return 0; } else if (a.hW_IP_03 === null || a.hW_IP_03 === undefined) { return 1; } else if (b.hW_IP_03 === null || b.hW_IP_03 === undefined) { return -1; } else if (a.hW_IP_03?.toLowerCase() > b.hW_IP_03?.toLowerCase()) { return 1; } else if (a.hW_IP_03?.toLowerCase() < b.hW_IP_03?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_IP_04") { displayData.sort((a, b) => { if ((a.hW_IP_04 === null || a.hW_IP_04 === undefined) && (b.hW_IP_04 === null || b.hW_IP_04 === undefined)) { return 0; } else if (a.hW_IP_04 === null || a.hW_IP_04 === undefined) { return 1; } else if (b.hW_IP_04 === null || b.hW_IP_04 === undefined) { return -1; } else if (a.hW_IP_04?.toLowerCase() > b.hW_IP_04?.toLowerCase()) { return 1; } else if (a.hW_IP_04?.toLowerCase() < b.hW_IP_04?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_IP_05") { displayData.sort((a, b) => { if ((a.hW_IP_05 === null || a.hW_IP_05 === undefined) && (b.hW_IP_05 === null || b.hW_IP_05 === undefined)) { return 0; } else if (a.hW_IP_05 === null || a.hW_IP_05 === undefined) { return 1; } else if (b.hW_IP_05 === null || b.hW_IP_05 === undefined) { return -1; } else if (a.hW_IP_05?.toLowerCase() > b.hW_IP_05?.toLowerCase()) { return 1; } else if (a.hW_IP_05?.toLowerCase() < b.hW_IP_05?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_IP_06") { displayData.sort((a, b) => { if ((a.hW_IP_06 === null || a.hW_IP_06 === undefined) && (b.hW_IP_06 === null || b.hW_IP_06 === undefined)) { return 0; } else if (a.hW_IP_06 === null || a.hW_IP_06 === undefined) { return 1; } else if (b.hW_IP_06 === null || b.hW_IP_06 === undefined) { return -1; } else if (a.hW_IP_06?.toLowerCase() > b.hW_IP_06?.toLowerCase()) { return 1; } else if (a.hW_IP_06?.toLowerCase() < b.hW_IP_06?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_IP_07") { displayData.sort((a, b) => { if ((a.hW_IP_07 === null || a.hW_IP_07 === undefined) && (b.hW_IP_07 === null || b.hW_IP_07 === undefined)) { return 0; } else if (a.hW_IP_07 === null || a.hW_IP_07 === undefined) { return 1; } else if (b.hW_IP_07 === null || b.hW_IP_07 === undefined) { return -1; } else if (a.hW_IP_07?.toLowerCase() > b.hW_IP_07?.toLowerCase()) { return 1; } else if (a.hW_IP_07?.toLowerCase() < b.hW_IP_07?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_IP_08") { displayData.sort((a, b) => { if ((a.hW_IP_08 === null || a.hW_IP_08 === undefined) && (b.hW_IP_08 === null || b.hW_IP_08 === undefined)) { return 0; } else if (a.hW_IP_08 === null || a.hW_IP_08 === undefined) { return 1; } else if (b.hW_IP_08 === null || b.hW_IP_08 === undefined) { return -1; } else if (a.hW_IP_08?.toLowerCase() > b.hW_IP_08?.toLowerCase()) { return 1; } else if (a.hW_IP_08?.toLowerCase() < b.hW_IP_08?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_Rack") { displayData.sort((a, b) => { if ((a.hW_Rack === null || a.hW_Rack === undefined) && (b.hW_Rack === null || b.hW_Rack === undefined)) { return 0; } else if (a.hW_Rack === null || a.hW_Rack === undefined) { return 1; } else if (b.hW_Rack === null || b.hW_Rack === undefined) { return -1; } else if (a.hW_Rack?.toLowerCase() > b.hW_Rack?.toLowerCase()) { return 1; } else if (a.hW_Rack?.toLowerCase() < b.hW_Rack?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_Zone") { displayData.sort((a, b) => { if ((a.hW_Zone === null || a.hW_Zone === undefined) && (b.hW_Zone === null || b.hW_Zone === undefined)) { return 0; } else if (a.hW_Zone === null || a.hW_Zone === undefined) { return 1; } else if (b.hW_Zone === null || b.hW_Zone === undefined) { return -1; } else if (a.hW_Zone?.toLowerCase() > b.hW_Zone?.toLowerCase()) { return 1; } else if (a.hW_Zone?.toLowerCase() < b.hW_Zone?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_DetailUsage") { displayData.sort((a, b) => { if ((a.hW_DetailUsage === null || a.hW_DetailUsage === undefined) && (b.hW_DetailUsage === null || b.hW_DetailUsage === undefined)) { return 0; } else if (a.hW_DetailUsage === null || a.hW_DetailUsage === undefined) { return 1; } else if (b.hW_DetailUsage === null || b.hW_DetailUsage === undefined) { return -1; } else if (a.hW_DetailUsage?.toLowerCase() > b.hW_DetailUsage?.toLowerCase()) { return 1; } else if (a.hW_DetailUsage?.toLowerCase() < b.hW_DetailUsage?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "hW_NWLineName") { displayData.sort((a, b) => { if ((a.hW_NWLineName === null || a.hW_NWLineName === undefined) && (b.hW_NWLineName === null || b.hW_NWLineName === undefined)) { return 0; } else if (a.hW_NWLineName === null || a.hW_NWLineName === undefined) { return 1; } else if (b.hW_NWLineName === null || b.hW_NWLineName === undefined) { return -1; } else if (a.hW_NWLineName?.toLowerCase() > b.hW_NWLineName?.toLowerCase()) { return 1; } else if (a.hW_NWLineName?.toLowerCase() < b.hW_NWLineName?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "connect_NWEquip_1") { displayData.sort((a, b) => { if ((a.connect_NWEquip_1 === null || a.connect_NWEquip_1 === undefined) && (b.connect_NWEquip_1 === null || b.connect_NWEquip_1 === undefined)) { return 0; } else if (a.connect_NWEquip_1 === null || a.connect_NWEquip_1 === undefined) { return 1; } else if (b.connect_NWEquip_1 === null || b.connect_NWEquip_1 === undefined) { return -1; } else if (a.connect_NWEquip_1?.toLowerCase() > b.connect_NWEquip_1?.toLowerCase()) { return 1; } else if (a.connect_NWEquip_1?.toLowerCase() < b.connect_NWEquip_1?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "connect_NWEquip_2") { displayData.sort((a, b) => { if ((a.connect_NWEquip_2 === null || a.connect_NWEquip_2 === undefined) && (b.connect_NWEquip_2 === null || b.connect_NWEquip_2 === undefined)) { return 0; } else if (a.connect_NWEquip_2 === null || a.connect_NWEquip_2 === undefined) { return 1; } else if (b.connect_NWEquip_2 === null || b.connect_NWEquip_2 === undefined) { return -1; } else if (a.connect_NWEquip_2?.toLowerCase() > b.connect_NWEquip_2?.toLowerCase()) { return 1; } else if (a.connect_NWEquip_2?.toLowerCase() < b.connect_NWEquip_2?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "connect_NWEquip_3") { displayData.sort((a, b) => { if ((a.connect_NWEquip_3 === null || a.connect_NWEquip_3 === undefined) && (b.connect_NWEquip_3 === null || b.connect_NWEquip_3 === undefined)) { return 0; } else if (a.connect_NWEquip_3 === null || a.connect_NWEquip_3 === undefined) { return 1; } else if (b.connect_NWEquip_3 === null || b.connect_NWEquip_3 === undefined) { return -1; } else if (a.connect_NWEquip_3?.toLowerCase() > b.connect_NWEquip_3?.toLowerCase()) { return 1; } else if (a.connect_NWEquip_3?.toLowerCase() < b.connect_NWEquip_3?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "connect_NWEquip_4") { displayData.sort((a, b) => { if ((a.connect_NWEquip_4 === null || a.connect_NWEquip_4 === undefined) && (b.connect_NWEquip_4 === null || b.connect_NWEquip_4 === undefined)) { return 0; } else if (a.connect_NWEquip_4 === null || a.connect_NWEquip_4 === undefined) { return 1; } else if (b.connect_NWEquip_4 === null || b.connect_NWEquip_4 === undefined) { return -1; } else if (a.connect_NWEquip_4?.toLowerCase() > b.connect_NWEquip_4?.toLowerCase()) { return 1; } else if (a.connect_NWEquip_4?.toLowerCase() < b.connect_NWEquip_4?.toLowerCase()) { return -1; } else { return 0; } }); }
        else if (data === "basic_ReceiveDate") { displayData.sort((a, b) => { if ((a.basic_ReceiveDate === null || a.basic_ReceiveDate === undefined) && (b.basic_ReceiveDate === null || b.basic_ReceiveDate === undefined)) { return 0; } else if (a.basic_ReceiveDate === null || a.basic_ReceiveDate === undefined) { return 1; } else if (b.basic_ReceiveDate === null || b.basic_ReceiveDate === undefined) { return -1; } else if (a.basic_ReceiveDate > b.basic_ReceiveDate) { return 1; } else if (a.basic_ReceiveDate < b.basic_ReceiveDate) { return -1; } else { return 0; } }); }
        else if (data === "basic_RegDate") { displayData.sort((a, b) => { if ((a.basic_RegDate === null || a.basic_RegDate === undefined) && (b.basic_RegDate === null || b.basic_RegDate === undefined)) { return 0; } else if (a.basic_RegDate === null || a.basic_RegDate === undefined) { return 1; } else if (b.basic_RegDate === null || b.basic_RegDate === undefined) { return -1; } else if (a.basic_RegDate > b.basic_RegDate) { return 1; } else if (a.basic_RegDate < b.basic_RegDate) { return -1; } else { return 0; } }); }
        else if (data === "basic_OverUsedYear") { displayData.sort((a, b) => { if ((a.basic_OverUsedYear === null || a.basic_OverUsedYear === undefined) && (b.basic_OverUsedYear === null || b.basic_OverUsedYear === undefined)) { return 0; } else if (a.basic_OverUsedYear === null || a.basic_OverUsedYear === undefined) { return 1; } else if (b.basic_OverUsedYear === null || b.basic_OverUsedYear === undefined) { return -1; } else if (a.basic_OverUsedYear > b.basic_OverUsedYear) { return 1; } else if (a.basic_OverUsedYear < b.basic_OverUsedYear) { return -1; } else { return 0; } }); }
        else if (data === "basic_Stock") { displayData.sort((a, b) => { if ((a.basic_Stock === null || a.basic_Stock === undefined) && (b.basic_Stock === null || b.basic_Stock === undefined)) { return 0; } else if (a.basic_Stock === null || a.basic_Stock === undefined) { return 1; } else if (b.basic_Stock === null || b.basic_Stock === undefined) { return -1; } else if (a.basic_Stock > b.basic_Stock) { return 1; } else if (a.basic_Stock < b.basic_Stock) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_WarrantyExpiredDate") { displayData.sort((a, b) => { if ((a.maintenance_WarrantyExpiredDate === null || a.maintenance_WarrantyExpiredDate === undefined) && (b.maintenance_WarrantyExpiredDate === null || b.maintenance_WarrantyExpiredDate === undefined)) { return 0; } else if (a.maintenance_WarrantyExpiredDate === null || a.maintenance_WarrantyExpiredDate === undefined) { return 1; } else if (b.maintenance_WarrantyExpiredDate === null || b.maintenance_WarrantyExpiredDate === undefined) { return -1; } else if (a.maintenance_WarrantyExpiredDate > b.maintenance_WarrantyExpiredDate) { return 1; } else if (a.maintenance_WarrantyExpiredDate < b.maintenance_WarrantyExpiredDate) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_EOSDate") { displayData.sort((a, b) => { if ((a.maintenance_EOSDate === null || a.maintenance_EOSDate === undefined) && (b.maintenance_EOSDate === null || b.maintenance_EOSDate === undefined)) { return 0; } else if (a.maintenance_EOSDate === null || a.maintenance_EOSDate === undefined) { return 1; } else if (b.maintenance_EOSDate === null || b.maintenance_EOSDate === undefined) { return -1; } else if (a.maintenance_EOSDate > b.maintenance_EOSDate) { return 1; } else if (a.maintenance_EOSDate < b.maintenance_EOSDate) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_EOLDate") { displayData.sort((a, b) => { if ((a.maintenance_EOLDate === null || a.maintenance_EOLDate === undefined) && (b.maintenance_EOLDate === null || b.maintenance_EOLDate === undefined)) { return 0; } else if (a.maintenance_EOLDate === null || a.maintenance_EOLDate === undefined) { return 1; } else if (b.maintenance_EOLDate === null || b.maintenance_EOLDate === undefined) { return -1; } else if (a.maintenance_EOLDate > b.maintenance_EOLDate) { return 1; } else if (a.maintenance_EOLDate < b.maintenance_EOLDate) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_MaintenanceContract") { displayData.sort((a, b) => { if ((a.maintenance_MaintenanceContract === null || a.maintenance_MaintenanceContract === undefined) && (b.maintenance_MaintenanceContract === null || b.maintenance_MaintenanceContract === undefined)) { return 0; } else if (a.maintenance_MaintenanceContract === null || a.maintenance_MaintenanceContract === undefined) { return 1; } else if (b.maintenance_MaintenanceContract === null || b.maintenance_MaintenanceContract === undefined) { return -1; } else if (a.maintenance_MaintenanceContract > b.maintenance_MaintenanceContract) { return 1; } else if (a.maintenance_MaintenanceContract < b.maintenance_MaintenanceContract) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_MaintenanceBeginDate") { displayData.sort((a, b) => { if ((a.maintenance_MaintenanceBeginDate === null || a.maintenance_MaintenanceBeginDate === undefined) && (b.maintenance_MaintenanceBeginDate === null || b.maintenance_MaintenanceBeginDate === undefined)) { return 0; } else if (a.maintenance_MaintenanceBeginDate === null || a.maintenance_MaintenanceBeginDate === undefined) { return 1; } else if (b.maintenance_MaintenanceBeginDate === null || b.maintenance_MaintenanceBeginDate === undefined) { return -1; } else if (a.maintenance_MaintenanceBeginDate > b.maintenance_MaintenanceBeginDate) { return 1; } else if (a.maintenance_MaintenanceBeginDate < b.maintenance_MaintenanceBeginDate) { return -1; } else { return 0; } }); }
        else if (data === "maintenance_MaintenanceEndDate") { displayData.sort((a, b) => { if ((a.maintenance_MaintenanceEndDate === null || a.maintenance_MaintenanceEndDate === undefined) && (b.maintenance_MaintenanceEndDate === null || b.maintenance_MaintenanceEndDate === undefined)) { return 0; } else if (a.maintenance_MaintenanceEndDate === null || a.maintenance_MaintenanceEndDate === undefined) { return 1; } else if (b.maintenance_MaintenanceEndDate === null || b.maintenance_MaintenanceEndDate === undefined) { return -1; } else if (a.maintenance_MaintenanceEndDate > b.maintenance_MaintenanceEndDate) { return 1; } else if (a.maintenance_MaintenanceEndDate < b.maintenance_MaintenanceEndDate) { return -1; } else { return 0; } }); }
        else if (data === "hW_PowerDual") { displayData.sort((a, b) => { if ((a.hW_PowerDual === null || a.hW_PowerDual === undefined) && (b.hW_PowerDual === null || b.hW_PowerDual === undefined)) { return 0; } else if (a.hW_PowerDual === null || a.hW_PowerDual === undefined) { return 1; } else if (b.hW_PowerDual === null || b.hW_PowerDual === undefined) { return -1; } else if (a.hW_PowerDual > b.hW_PowerDual) { return 1; } else if (a.hW_PowerDual < b.hW_PowerDual) { return -1; } else { return 0; } }); }


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
                return [null, `No(${i+1}) 네트워크장비명은 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.basic_Status || itemData.basic_Status.trim().length === 0) {
                return [null, `No(${i+1}) 상태는 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.basic_EquipDetailClass || itemData.basic_EquipDetailClass.trim().length === 0) {
                return [null, `No(${i+1}) 네트워크장비 상세분류는 필수요소입니다. 비워둘수 없습니다.`, null];
            }

            if (!itemData.basic_ItemLevel || itemData.basic_ItemLevel.trim().length === 0) {
                return [null, `No(${i+1}) 네트워크 운영등급은 필수요소입니다. 비워둘수 없습니다.`, null];
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

        return [itemDatas, null, InventoryManagement.itemType.Network];
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
                <div className={main.networkTable}>
                    <table ref={this.refTable1} border="1" style={{ minWidth: '10%' }}>
                        <thead>
                            <tr style={{ height: '78px' }}>
                                <th rowspan="3"><div className={main.editFlex}><span>전체</span><span><input ref={this.refAllCheck} type="checkBox" id="allCheck" onChange={(e) => this.onChangeAllCheck(e.target)} /></span></div></th>
                                <th rowspan="3" style={{ padding: '0px 15px' }}>No</th>
                                <th rowspan="3" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>네트워크장비명<span className={main.bottomArrowIcon} onClick={() => this.onClickSort("basic_Name")}></span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableDataUI1}
                        </tbody>
                    </table>
                    <table ref={this.refTable2} border="1" className="generalTable" style={{ minWidth: '90%' }}>
                        <thead>
                            <tr>
                                <th colspan="18">네트워크장비명<span className={main.gleftArrowIcon} onClick={() => this.props.onClickCheck("generalCheckbox")}></span></th>
                            </tr>
                            <tr>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>상태<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_Status")}></span></th>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>네트워크장비상세분류<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_EquipDetailClass")}></span></th>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>네트워크운영등급<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_ItemLevel")}></span></th>
                                <th rowspan="2">입고일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_ReceiveDate")}></span></th>
                                <th rowspan="2">설치일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_RegDate")}></span></th>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>용도<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_Usage")}></span></th>
                                <th rowspan="2">자산구분<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_OwnerCompanyName")}></span></th>
                                <th rowspan="2">주관부서<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_OwnDepartment")}></span></th>
                                <th rowspan="2">운영부서<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_OperationDepartment")}></span></th>
                                <th rowspan="2">사용연한초과여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_OverUsedYear")}></span></th>
                                <th rowspan="2">Stock여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_Stock")}></span></th>
                                <th rowspan="2">구분Ⅰ<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_Type1")}></span></th>
                                <th rowspan="2">구분Ⅱ<span className={main.downArrowIcon} onClick={() => this.onClickSort("basic_Type2")}></span></th>
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
                    <table ref={this.refTable3} border="1" className="maintenanceTable" style={{ minWidth: '50%' }}>
                        <thead>
                            <tr style={{ height: '26px' }}>
                                <th colspan="9">유지보수정보<span className={main.mleftArrowIcon} onClick={() => this.props.onClickCheck("maintenanceCheckbox")}></span></th>
                            </tr>
                            <tr style={{ height: '52px' }}>
                                <th rowspan="2">공급업체<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_ProvideCompanyName")}></span></th>
                                <th rowspan="2">Warranty기간<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_WarrantyMonth")}></span></th>
                                <th rowspan="2">Warranty만료일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_WarrantyExpiredDate")}></span></th>
                                <th rowspan="2">유지보수업체<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_MaintenanceCompanyName")}></span></th>
                                <th rowspan="2">EOS일자<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_EOSDate")}></span></th>
                                <th rowspan="2">EOL Date<span className={main.downArrowIcon} onClick={() => this.onClickSort("maintenance_EOLDate")}></span></th>
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
                    <table ref={this.refTable4} border="1" className="hardwareTable" style={{ minWidth: '60%' }}>
                        <thead>
                            <tr style={{ height: '26px' }}>
                                <th colspan="18">하드웨어정보<span className={main.hleftArrowIcon} onClick={() => this.props.onClickCheck("hardwareCheckbox")}></span></th>
                            </tr>
                            <tr style={{ height: '52px' }}>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>모델명<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_ModelName")}></span></th>
                                <th rowspan="2" style={{ position: 'relative' }}><span className={main.essentialBorder}></span>제조사<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_Company")}></span></th>
                                <th rowspan="2">시리얼번호<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_SerialNumber")}></span></th>
                                <th rowspan="2">OS Version<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_OSVersion")}></span></th>
                                <th rowspan="2">IP-01<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_IP_01")}></span></th>
                                <th rowspan="2">IP-02<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_IP_02")}></span></th>
                                <th rowspan="2">IP-03<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_IP_03")}></span></th>
                                <th rowspan="2">IP-04<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_IP_04")}></span></th>
                                <th rowspan="2">IP-05<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_IP_05")}></span></th>
                                <th rowspan="2">IP-06<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_IP_06")}></span></th>
                                <th rowspan="2">IP-07<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_IP_07")}></span></th>
                                <th rowspan="2">IP-08<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_IP_08")}></span></th>
                                <th rowspan="2">Rack<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_Rack")}></span></th>
                                <th rowspan="2">Power이중화여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_PowerDual")}></span></th>
                                <th rowspan="2">Zone<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_Zone")}></span></th>
                                <th rowspan="2">상세용도<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_DetailUsage")}></span></th>
                                <th rowspan="2">NMS 적용여부<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_NMS")}></span></th>
                                <th rowspan="2">NW회선명<span className={main.downArrowIcon} onClick={() => this.onClickSort("hW_NWLineName")}></span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableDataUI4}
                        </tbody>
                    </table>
                    {/* <div className={main.hardwareBtnBox} onClick={() => this.props.onClickCheck("hardwareCheckbox")}>
                        <span className={main.hleftArrowIcon}></span>
                    </div> */}
                    <table ref={this.refTable5} border="1" className="connectTable" style={{ minWidth: '16%' }}>
                        <thead>
                            <tr style={{ height: '26px' }}>
                                <th colspan="4">연결정보<span className={main.cleftArrowIcon} onClick={() => this.props.onClickCheck("connectCheckbox")}></span></th>
                            </tr>
                            <tr style={{ height: '52px' }}>
                                <th rowspan="2">NW장비-1<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_NWEquip_1")}></span></th>
                                <th rowspan="2">NW장비-2<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_NWEquip_2")}></span></th>
                                <th rowspan="2">NW장비-3<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_NWEquip_3")}></span></th>
                                <th rowspan="2">NW장비-4<span className={main.downArrowIcon} onClick={() => this.onClickSort("connect_NWEquip_4")}></span></th>
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
export default NetworkTable;