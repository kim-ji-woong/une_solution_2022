import React, { Component } from 'react';

import ConfirmDialog from '../../../../Common/ui/confirmDialog';
import { ModalBackground } from '../../../../Root/styled/variables';
import { SensorSetComponent } from '../../../styled/settingsStyled';
import { i18n } from '../../../../language/i18n';
import ProjectResource from "../../../../Root/resource/id";
import imgClose from '../../../../Common/image/icon/close_x.png';
import imgCloseWonik from '../../../../Common/img/sub/dashboard_layer_close.png';
import AccountResource from '../../../../Account/resource/id';
import ToggleSwitch from '../../../../Common/ui/toggleSwitch';
import { SDMSController } from '../../../../SDMS/services/sdmsController';
import { GghController } from '../../../../SDMS/services/gghController';
import Pagination from '../../../../Common/ui/pagination';
import SettingStore from '../../../settingsStore';

class SensorSet_gg extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
            isEditMode: false,
            sensorList: {},
            buildingGroupList: [],

            displaySensorList: [],

            updateSensorList : [
                                    {
                                        "sensorType": "fire",
                                        "sensorIDs": []
                                    },
                                    {
                                        "sensorType": "etc",
                                        "sensorIDs": []
                                    },
                                    {
                                        "sensorType": "cctv",
                                        "sensorIDs": []
                                    }
                                ],

            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: [i18n.t('common.확인')],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null
            },

            siteIDs: [],
            sensorType: null,
            enabled: null,
            searchText: null,
            pageItemCount: 13,
            pageIndex: 1,
            totalCount: 0,
            listCount: 0
        }

        this.refSearch = React.createRef();

        this.init();

        this.isLoading = false;

        this.isUpdated = false;
    }

    setPage = (page) => {
        this.setState({ pageIndex: page }, () => {
            this.getSensorDatas();
        });
    }

    async init() {
        let siteIDs = null;

        if (ProjectResource.siteID === null) {
            await ProjectResource.loadSiteID();
        }
        if (ProjectResource.siteID >= ProjectResource.Site.GG_A && ProjectResource.siteID <= ProjectResource.Site.GG_H) {
            const userInfo = ProjectResource?.getUserInfo();

            if (ProjectResource.siteID === ProjectResource.Site.GG_A && userInfo?.siteID === ProjectResource.Site.GG_A) {
                // 통합방재실 > 모든 공간
                siteIDs = [];
                siteIDs.push(ProjectResource.Site.GG_A);
                siteIDs.push(ProjectResource.Site.GG_B);
                siteIDs.push(ProjectResource.Site.GG_C);
                siteIDs.push(ProjectResource.Site.GG_D);
                siteIDs.push(ProjectResource.Site.GG_E);
                siteIDs.push(ProjectResource.Site.GG_F);
                siteIDs.push(ProjectResource.Site.GG_G);
                siteIDs.push(ProjectResource.Site.GG_H);
            }
            else {
                // 그 외 > 공통으로 사용하는 지하층만 포함
                siteIDs = [];
                siteIDs.push(userInfo.siteID);
            }
        }

        const [buildingGroupList, outdoorZones, errorMessage] = await SDMSController.requestBuildingGroupList(siteIDs);

        this.setState({ buildingGroupList, siteIDs: siteIDs }, () => {
            this.getSensorDatas();
        });
    }

    showConfirmDialog = (title, messages, buttons, onClickButton, onClickClose) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.title = title;
        confirmMessage.buttons = buttons;
        confirmMessage.onClickButton = onClickButton;

        if (onClickClose !== null && onClickClose !== undefined)
            confirmMessage.onClose = onClickClose;

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

    onCloseConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        this.setState({ confirmMessage });
    }

    onClickClosePopup = () => {
        if (this.isUpdated) {
            this.showConfirmDialog(i18n.t('common.확인'), ['현재 편집중인 항목이 있습니다. 편집을 취소하시겠습니까?'], ['닫기', '편집취소'], this.onClickCancleConfirm);
        }
        else {
            this.props.sensorSetOff(false);
        }
    }

    setEditMode = () => {
        if (this.state.isEditMode === true) {
            this.onClickCancle();
        } else {
            this.setState({ isEditMode: !this.state.isEditMode });
        }
    }

    onClickCancle = () => {
        if (this.isUpdated) {
            this.showConfirmDialog(i18n.t('common.확인'), ['현재 편집중인 항목이 있습니다. 편집을 취소하시겠습니까?'], ['닫기', '편집취소'], this.onClickCancleConfirm);
        }
        else {
            this.state.isEditMode = false;
            this.getSensorDatas();
        }
    }

    onClickCancleConfirm = (index) => {
        if (index === 1) {
            this.state.isEditMode = false;
            this.getSensorDatas();
            this.onCloseConfirmDialog();
            this.isUpdated = false;
        }
        else {
            this.onCloseConfirmDialog();
        }
    }

    getSensorName = (sensor) => {
        let name = null;

        switch(sensor)
        {
            case 'fireSensors' : name = '화재'; break;
            case 'emergencyBellSensors' : name = '비상벨'; break;
            case 'cctvs' : name = 'CCTV'; break;
        }

        return name;
    }

    getSiteName = (sensor) => {
        let name = null;

        switch(sensor)
        {
            case ProjectResource.Site.GG_B : name = '경기도청/도의회'; break;
            case ProjectResource.Site.GG_D : name = '경기도서관'; break;
            case ProjectResource.Site.GG_E : name = '복합시설관'; break;
            case ProjectResource.Site.GG_F : name = '경기신용보증재단'; break;
            case ProjectResource.Site.GG_G : name = '경기도교육청'; break;
            case ProjectResource.Site.GG_H : name = '경기주택도시공사 신사옥'; break;
        }

        return name;
    }

    getPositionNameByZoneID = (zoneID, siteID) => {
        let buildingName = '';
        let zoneName = '';

        const buildingGroupList = this.state.buildingGroupList;

        // indoor
        if (buildingGroupList.length > 0 && zoneID < 20000) {
            for (let buildingGroup of buildingGroupList) {
                if (buildingGroup.siteID === siteID) {
                    for (let building of buildingGroup.buildingDatas) {
                        for (let zone of building.zoneDatas) {
                            if (zone.id === zoneID) {
                                zoneName = zone.displayText;
                                buildingName = building.displayText;
                            }
                        }
                    }
                }
            }
        }
        else {
            buildingName = '외부영역';
        }

        return buildingName + ' ' + zoneName;
    }

    setChecked = (enabled, sensor, sensorType) => {
        const sensorList = this.state.sensorList;
        sensor.updateSensor = true;

        for (let data in sensorList) {
            const sensors = sensorList[data];

            for (let i = 0; i < sensors.length; i++) {
                const value = sensors[i];
                if (value.updateSensor && value.id === sensor.id) {
                    value.enabled = enabled;
                    value.isUpdate = true;
                    value.sensorType = sensorType;
                }
            }
        }

        this.isUpdated = true;
        this.setState({ sensorList });
    }

    onClickSave = async () => {
        const sensorList = this.state.sensorList;
        const enabledSensorDatas = [];
        const disabledSensorDatas = [];

        const updateFireSensors = sensorList["fireSensors"]?.filter(sensor => sensor?.isUpdate);
        const updateETCSensors = sensorList["emergencyBellSensors"]?.filter(sensor => sensor?.isUpdate);
        const updateCCTVSensors = sensorList["cctvs"]?.filter(sensor => sensor?.isUpdate);

        if (updateFireSensors && updateFireSensors?.length > 0) {
            let enabledIds = [];
            let disabledIds = [];
            for (let sensor of updateFireSensors) {
                if (sensor.enabled) {
                    enabledIds.push(sensor.id);
                }
                else if (!sensor.enabled) {
                    disabledIds.push(sensor.id);   
                }
            }
            enabledSensorDatas.push({"sensorType": "fire", "sensorIDs": enabledIds});
            disabledSensorDatas.push({"sensorType": "fire", "sensorIDs": disabledIds});
        }

        if (updateETCSensors && updateETCSensors?.length > 0) {
            let enabledIds = [];
            let disabledIds = [];
            for (let sensor of updateETCSensors) {
                if (sensor.enabled) {
                    enabledIds.push(sensor.id);
                }
                else if (!sensor.enabled) {
                    disabledIds.push(sensor.id);   
                }
            }
            enabledSensorDatas.push({"sensorType": "etc", "sensorIDs": enabledIds});
            disabledSensorDatas.push({"sensorType": "etc", "sensorIDs": disabledIds});
        }

        if (updateCCTVSensors && updateCCTVSensors?.length > 0) {
            let enabledIds = [];
            let disabledIds = [];
            for (let sensor of updateCCTVSensors) {
                if (sensor.enabled) {
                    enabledIds.push(sensor.id);
                }
                else if (!sensor.enabled) {
                    disabledIds.push(sensor.id);   
                }
            }
            enabledSensorDatas.push({ "sensorType": "cctv", "sensorIDs": enabledIds });
            disabledSensorDatas.push({ "sensorType": "cctv", "sensorIDs": disabledIds });
        }

        const result = await GghController.updateSensorEnabled(enabledSensorDatas, disabledSensorDatas);

        if (result.success) {
            this.showConfirmDialog(i18n.t('common.확인'), ['센서 설정이 변경되었습니다.'], null, null);
            
            SettingStore.dispatch({ type: 'UPDATED_SENSOR_LIST' });
            this.isUpdated = false;
            this.setState({ isEditMode: false });
        }
        else {
            this.showConfirmDialog(i18n.t('common.오류'), [result.message], null, null);
        }
    }

    setSensorSetTable = () => {
        let sensorSetTable = [];
        const { sensorList, pageIndex, pageItemCount } = this.state;

        let index = 1;

        if (pageIndex > 1) {
            index = pageIndex * pageItemCount - (pageItemCount - 1);
        }

        for (let data in sensorList) {
            const sensors = sensorList[data];

            if (sensors.length > 0) {
                for (let i = 0; i < sensors.length; i++) {
                    const value = sensors[i];
                    const sensorName = this.getSensorName(data);
                    const siteName = this.getSiteName(value.siteID);
                    const positionName = this.getPositionNameByZoneID(value.zoneID, value.siteID);

                    sensorSetTable.push(
                        <tr key={sensorName + " " + index}>
                            <td>{index}</td>
                            <td>{siteName}</td>
                            <td>{sensorName}</td>
                            <td>{value.name}</td>   
                            <td>{positionName}</td>
                            <td>
                                <ToggleSwitch 
                                    left="OFF" 
                                    right="ON" 
                                    leftcolor="#7D7E84" 
                                    rightcolor="#7D7E84"
                                    leftbgcolor="#272E42" 
                                    rightbgcolor="#272E42"
                                    setChecked={this.setChecked}
                                    isChecked={value.enabled}
                                    sensor={value}
                                    sensorName={data}
                                    disabled={this.state.isEditMode ? false : true}
                                />
                            </td>
                        </tr>
                    );

                    index++;
                }
            }
        }

        return sensorSetTable;
    }

    onChangeSite = (e) => {
        const target = e.target;
        let siteID = parseInt(target.value);
        let siteIDs = [];

        if (isNaN(siteID)) {
            return;
        }
        else if (siteID === -1) {
            siteIDs.push(ProjectResource.Site.GG_B);
            siteIDs.push(ProjectResource.Site.GG_D);
            siteIDs.push(ProjectResource.Site.GG_F);
        }
        else {
            siteIDs.push(siteID);
        }

        this.setState({ siteIDs: siteIDs, pageIndex: 1 }, () => {
            this.getSensorDatas();
        });
    }

    onChangeSensorType = (e) => {
        let { value } = e.target;

        if (value === "-1")
            value = null;

        this.setState({ sensorType: value, pageIndex: 1 }, () => {
            this.getSensorDatas();
        });
    } 

    onChangeEnabled = (e) => {
        let { value } = e.target;
    
        switch (value) {
            case "-1":
                value = null;
                break;
            case "true":
                value = true;
                break;
            case "false":
                value = false;
                break;
        }
    
        this.setState({ enabled: value, pageIndex: 1 }, () => {
            this.getSensorDatas();
        });
    }

    searchEnterKey = () => {
        if (window.event.keyCode == 13) {
            this.search();
        }
    }

    search = () => {
        const text = document.getElementById('txtSearch').value;
        let newText = text.trim();

        if (newText.length === 0) {
            newText = null;
        }

        this.setState({ searchText: newText, pageIndex: 1 }, () => {
            this.getSensorDatas();
        });
    }

    getSensorDatas = async () => {
        let { siteIDs, sensorType, enabled, searchText, pageItemCount, pageIndex } = this.state;

        const [result, message] = await SDMSController.requestPageSensorList(siteIDs, sensorType, enabled, searchText, pageItemCount, pageIndex - 1);

        if (result === null) {
            this.showConfirmDialog(i18n.t('common.오류'), [message], null, null);
        }
        else {
            const sensorList = {};
            if (result.fireSensors) {
                sensorList['fireSensors'] = result.fireSensors;
            }
            if (result.cctvs) {
                sensorList['cctvs'] = result.cctvs;
            }
            if (result.emergencyBellSensors) {
                sensorList['emergencyBellSensors'] = result.emergencyBellSensors;
            }

            const newTotalCount = Math.ceil(result.totalCount / this.state.pageItemCount);

            this.setState({ sensorList: sensorList, totalCount: newTotalCount, listCount: result.totalCount });
        }
    }

    render(){
        const sensorSetTable = this.setSensorSetTable();
        const userInfo = ProjectResource.getUserInfo();

        return(
            <>
                <ModalBackground>
                    <SensorSetComponent $isEditMode={this.state.isEditMode}>
                        <div className={"popupBox"}>
                            <div className='popupboxLine' />
                            <div className={"popupBoxTitle"}>센서 설정</div>
                            <div className={"popupBoxX"}><a onClick={this.onClickClosePopup}><img src={ProjectResource.styleMode === ProjectResource.StyleType.Wonik ? imgCloseWonik : imgClose} alt={i18n.t('account.저장되었습니다')} /></a></div>

                            <div className='popupContent'>
                                <div className='menuWrap'>
                                    <p>{i18n.t('account.목록')}</p>
                                </div>
                                <div className={'cctvSetFlex'}>
                                    <div className={'cctvSetBox'}>
                                        <p>기관</p>
                                        <div className={'cctvSetSelect'}>
                                            <select id={'cctvSelectBox'} onChange={this.onChangeSite} disabled={this.state.isEditMode ? true : false}>
                                                <option value={-1}>전체</option>
                                                <option value={ProjectResource.Site.GG_B}>경기도청/도의회</option>
                                                <option value={ProjectResource.Site.GG_D}>경기도서관</option>
                                                <option value={ProjectResource.Site.GG_F}>경기신용보증재단</option>
                                            </select>
                                        </div>
                                        <p>유형</p>
                                        <div className={'cctvSetSelect'}>
                                            <select id={'cctvSelectBox'} onChange={this.onChangeSensorType} disabled={this.state.isEditMode ? true : false}>
                                                <option value={-1}>전체</option>
                                                <option value="fire">화재</option>
                                                <option value="emergencybell">비상벨</option>
                                                <option value="cctv">CCTV</option>
                                            </select>
                                        </div>
                                        <p>활성화 상태</p>
                                        <div className={'cctvSetSelect'}>
                                            <select id={'cctvSelectBox'} onChange={this.onChangeEnabled} disabled={this.state.isEditMode ? true : false}>
                                                <option value={-1}>전체</option>
                                                <option value={true}>활성화</option>
                                                <option value={false}>비활성화</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className={'searchWrap'}>
                                        <input ref={this.refSearch} type="text" id="txtSearch" onKeyUp={this.searchEnterKey} placeholder={i18n.t('account.검색어를 입력해주세요')} disabled={this.state.isEditMode ? true : false} />
                                        <a onClick={this.search}>{i18n.t('account.검색')}</a>
                                        {
                                            userInfo?.levelID !== AccountResource.accountLevelID.user &&
                                                <a className={this.state.isEditMode ? 'on' : null} onClick={this.setEditMode}>{i18n.t('common.편집')}</a>
                                        }
                                    </div>
                                </div>
                                <section className='userList'>
                                    <table>
                                        <thead>
                                            <tr>
                                                <td width={'4%'}>NO.</td>
                                                <td width={'20%'}>기관명</td>
                                                <td width={'12%'}>센서유형</td>
                                                <td width={'26%'}>센서명</td>
                                                <td width={'20%'}>센서 위치 건물 정보</td>
                                                <td width={'18%'}>활성화 상태</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sensorSetTable}
                                        </tbody>
                                    </table>
                                </section> 

                                {
                                    this.state.isEditMode &&
                                    <ul className={'buttonWrap'}>
                                        <li className={'cancelBtn'} onClick={this.onClickCancle}>{i18n.t('common.취소')}</li>
                                        <li className={'saveBtn'} onClick={this.onClickSave}>{i18n.t('common.저장')}</li>
                                    </ul>
                                }
                                {
                                    (!this.state.isEditMode && this.state.listCount > 0) &&
                                    <Pagination
                                        totalPage={this.state.totalCount}
                                        limit={5}
                                        page={this.state.pageIndex}
                                        setPage={this.setPage}
                                    />
                                }
                            </div>
                        </div>
                    </SensorSetComponent>
                </ModalBackground>
                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                        <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
                }
            </>
        )
    }
}
export default SensorSet_gg;