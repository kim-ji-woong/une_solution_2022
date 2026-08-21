import React, { Component } from 'react';

import ProjectResource from "../../../../Root/resource/id";
import ConfirmDialog from '../../../../Common/ui/confirmDialog';

import imgClose from '../../../../Common/image/icon/close_x.png';
import imgCloseWonik from '../../../../Common/img/sub/dashboard_layer_close.png';

import { ModalBackground } from '../../../../Root/styled/variables';
import { i18n } from '../../../../language/i18n';
import {CCTVSettingComponent} from '../../../../SDMS/styled/sdmsPopupsStyled';
import ColText from '../../../../SDMS/ui/popups/gyeonggi/colText';
import { GghController } from '../../../../SDMS/services/gghController';
import AccountResource from '../../../../Account/resource/id';


class CCTVSetting_gg extends Component {
    static Type = {
        Level: 0,
        Site: 1
    }

    constructor(props){
        super(props);

        this.state = {
            isEditMode: false,
            cctvList: [],
            displayCCTVList: [],

            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: [i18n.t('common.확인')],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null
            },
        }

        this.refSearch = React.createRef();

        this.init();

        this.isLoading = false;

        this.isUpdated = false;
    }

    async init() {
        const userInfo = await ProjectResource?.initUserInfo();

        if (userInfo?.siteID >= ProjectResource.Site.GG_A && userInfo?.siteID <= ProjectResource.Site.GG_H) {

            const result = await GghController.requestCCTVList(userInfo.siteID === ProjectResource.Site.GG_A ? -1 : userInfo.siteID);

            if (result.success) {
                this.setState({ cctvList: result.cctvList });
            }
        }

        this.onClickSaerch();
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
            this.reload();
        }
    }

    onClickCancleConfirm = (index) => {
        if (index === 1) {
            this.state.isEditMode = false;
            this.reload();
            this.onCloseConfirmDialog();
            this.isUpdated = false;
        }
        else {
            this.onCloseConfirmDialog();
        }
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
            this.props.cctvSetOff(false);
        }
    }

    onClickSelectBox = () => {
        const elementArrow = document.getElementById("cctvSelectBox");

        elementArrow.classList.toggle('on');
    }

    async reload() {
        const userInfo = await ProjectResource?.initUserInfo();

        if (userInfo) {
            const result = await GghController.requestCCTVList(userInfo.siteID === ProjectResource.Site.GG_A ? -1 : userInfo.siteID);
            this.state.cctvList = result.cctvList;
        }

        this.onClickSaerch();
    }

    onChangeCCTVList = (value, cctv, type) => {
        const cctvList = this.state.cctvList;

        if (type === 'ip') {
            cctv.ip = value;
        }
        else if (type === 'deviceID') {
            cctv.deviceID = value;
        }
        else if (type === 'description') {
            cctv.description = value;
        }

        cctv.isUpdate = true;

        for (let i = 0; i < cctvList.length; i++) {
            if (cctvList[i].id === cctv.id) {
                cctvList[i] = cctv;
            }
        }

        this.isUpdated = true;
    }

    onClickSave = async () => {
        const cctvList = this.state.cctvList;

        const updateCCTVList = cctvList.filter(cctv => cctv?.isUpdate);

        const [result, message] = await GghController.updateCCTVList(updateCCTVList);

        if (result) {
            this.showConfirmDialog(i18n.t('common.확인'), ['CCTV 설정이 변경되었습니다.'], null, null);
            
            this.isUpdated = false;
            this.setState({ isEditMode: false });
        }
        else {
            this.showConfirmDialog(i18n.t('common.오류'), [message], null, null);
        }
    }

    setCCTVTable = () => {
        let cctvSetTable = [];
        const cctvList = this.state.displayCCTVList;

        for (let i = 0; i < cctvList.length; i++) {
            const cctv = cctvList[i];

            cctvSetTable.push(
                <tr key={cctv.id}>
                    <td>{i + 1}</td>
                    <td>{cctv.buildingName}</td>
                    <td>{cctv.floorName}</td>
                    <td>{cctv.position}</td>   
                    <td>
                        {
                            this.state.isEditMode ?
                            <ColText
                                value={cctv.ip} 
                                cctv={cctv}
                                onChangeCCTVList={this.onChangeCCTVList}
                                type='ip'
                            />
                            : cctv.ip
                        }
                    </td>
                    <td>
                        {
                            this.state.isEditMode ?
                            <ColText
                                value={cctv.deviceID} 
                                cctv={cctv}
                                onChangeCCTVList={this.onChangeCCTVList}
                                type='deviceID'
                            />
                            : cctv.deviceID
                        }
                    </td>
                    <td>
                        {
                            this.state.isEditMode ?
                            <ColText
                                value={cctv.description} 
                                cctv={cctv}
                                onChangeCCTVList={this.onChangeCCTVList}
                                type='description'
                            />
                            : cctv.description
                        }
                    </td>
                </tr>
            );
        }

        return cctvSetTable;
    }

    handleKeyPress = (e) => {
        if (e.key === "Enter") {
            this.onClickSaerch();
            e.target.blur();
        }
    }

    onClickSaerch = () => {
        const cctvList = this.state.cctvList;
        let displayCCTVList = [];

        const search =  this.refSearch.current.value.toString();

        for (let i = 0; i < cctvList?.length; i++) {
            const cctv = cctvList[i];

            if (!search) {
                displayCCTVList.push(cctv);
            }
            else if (cctv.buildingName?.includes(search) ||
                cctv.description?.includes(search) ||
                cctv.deviceID?.includes(search) ||
                cctv.floorName?.includes(search) ||
                cctv.ip?.includes(search) ||
                cctv.position?.includes(search)) {
                displayCCTVList.push(cctv);
            }
        }

        this.setState({ displayCCTVList });
    }

    render(){
        const cctvSetTable = this.setCCTVTable();
        const userInfo = ProjectResource.getUserInfo();
        
        return(
            <>
            <ModalBackground>
                <CCTVSettingComponent>
                    <div className={"popupBox"}>
                        <div className='popupboxLine' />
                        <div className={"popupBoxTitle"}>CCTV 설정</div>
                        <div className={"popupBoxX"}><a onClick={this.onClickClosePopup}><img src={ProjectResource.styleMode === ProjectResource.StyleType.Wonik ? imgCloseWonik : imgClose} alt={i18n.t('account.저장되었습니다')} /></a></div>

                        <div className='popupContent'>
                            <div className='menuWrap'>
                                <p>{i18n.t('account.목록')}</p>
                            </div>
                            <div className={'cctvSetBox'}>
                                {/*
                                    userInfo?.siteID === ProjectResource.Site.GG_A &&
                                        <div className={'cctvSetSelect'} onClick={() => this.onClickSelectBox()}>
                                            <select name="" id={'cctvSelectBox'}>
                                                <option value="">전체기관</option>
                                                <option value="">도본청ㆍ도의회</option>
                                                <option value="">대표도서관</option>
                                                <option value="">신용보증재단</option>
                                            </select>
                                        </div>
                                */}
                                <div className={'searchWrap'}>
                                    <input ref={this.refSearch} type="text" id="txtSearch" onKeyPress={this.handleKeyPress} placeholder={i18n.t('account.검색어를 입력해주세요')} />
                                    <a onClick={this.onClickSaerch}>{i18n.t('account.검색')}</a>
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
                                            <td width={'10%'}>건물</td>
                                            <td width={'10%'}>층</td>
                                            <td width={'18%'}>상세위치</td>
                                            <td width={'18%'}>IP</td>
                                            <td width={'10%'}>Device ID</td>
                                            <td width={'30%'}>비고</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cctvSetTable}
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
                        </div>
                    </div>

                </CCTVSettingComponent>
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
export default CCTVSetting_gg;