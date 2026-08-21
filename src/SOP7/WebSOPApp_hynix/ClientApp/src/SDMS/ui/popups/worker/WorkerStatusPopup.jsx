import React, { Component } from 'react';
import $ from 'jquery';
import SDMS from '../../sdms';
import SDMSResource from '../../../resource/id';
import content from '../../../../Common/css/content.module.css';
import PopupDraggable from '../popupDraggable';
import ProjectResource from '../../../../Root/resource/id';
import SettingsStore from '../../../../Settings/settingsStore';
import { SDMSController } from '../../../services/sdmsController';

import { WorkerStatusComponentPopup } from '../../../styled/sdmsPopupsStyled';
import { i18n, withTranslation, i18nUtil } from '../../../../language/i18n';

import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/


class WorkerStatusPopup extends Component {
    static Type = {
        Worker: 0,
        Remainer: 1
    }

    constructor(props) {
        super(props);

        this.state = {
            type: WorkerStatusPopup.Type.Worker,
            equipZoneMembers: [],
            refreshTime: 1000 * 5,     // 5초 (자동 새로고침 시간)
        }

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.equipZoneID !== this.props.equipZoneID) {
            //this.state.equipZoneMembers = [];
            this.setState({ equipZoneMembers: [] });
            this.LoadEquipZoneMembers(this.props.equipZoneID); 
        }
    }

    componentDidMount() {
        // 창이 서서히 나타나는 효과
        let cssLeft = null;
        let cssTop = null;
        let cssWidth = null;
        let cssHeight = null;

        const popup = document.getElementById(this.props.popupType);
        const target = document.getElementById("dsBot_" + this.props.popupType);
        const popupState = this.props.popupState;

        if (popup !== null && popup !== undefined &&
            target !== null && target !== undefined &&
            popupState !== null && popupState !== undefined) {
            const clientRect = target.getBoundingClientRect();
            cssLeft = clientRect.left + "px";
            cssTop = clientRect.top + "px";

            popup.style.width = 0;
            popup.style.height = 0;
            popup.style.left = cssLeft;
            popup.style.top = cssTop;

            cssLeft = popupState.x;
            cssTop = popupState.y;
            cssWidth = popupState.width;
            cssHeight = popupState.height;

            $('#' + this.props.popupType).animate({ opacity: 1, width: cssWidth, height: cssHeight, left: cssLeft, top: cssTop }, SDMSResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }
        else {
            $('#' + this.props.popupType).animate({ opacity: 1 }, SDMSResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }

        this.init();

        this.timer = setTimeout(() => this.timerReset(this), this.state.refreshTime);
    }

    componentWillUnmount() {
        // 자동 새로고침 타이머 종료
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    // 구역인원 및 잔류인원 새로고침 타이머 
    timerReset = (target) => {
        if (target !== null && target !== undefined) {
            target.LoadEquipZoneMembers(target.props.equipZoneID);

            target.timer = setTimeout(() => target.timerReset(target), target.state.refreshTime);
        }
    }

    init() {
        this.state.equipZoneMembers = [];

        this.LoadEquipZoneMembers(this.props.equipZoneID); 
    }

    LoadEquipZoneMembers = async (equipZoneID) => {
        if (!equipZoneID)
            return;

        if (ProjectResource.SiteID === ProjectResource.Site.Wonik) {
            // equipZoneID 값에 따라 모드변환 (외곽ID이라면 잔류자 모드)
            let type = WorkerStatusPopup.Type.Worker;

            if (equipZoneID >= SDMSResource.WonikWorker.AssemblyID_H) {
                type = WorkerStatusPopup.Type.Remainer;
            }

            this.setState({ type });

            let equipZoneMembers = null;
            let message = null;

            if (type === WorkerStatusPopup.Type.Remainer) 
                [equipZoneMembers, message] = await SDMSController.requestWonikRemainerMembers(equipZoneID);
            else 
                [equipZoneMembers, message] = await SDMSController.requestWonikEquipZoneMembers(equipZoneID);

            if (equipZoneMembers === null) {
                // 테스트 용도
                //if (type === WorkerStatusPopup.Type.Remainer) {
                //    const _equipZoneMembers = this.state.equipZoneMembers;

                //    if (_equipZoneMembers?.length === 0) {
                //        equipZoneMembers = [];
                //        equipZoneMembers.push({ comNum: 0, name: "홍길동1", floor: "테스트 1층", phoneNumber: "010-123-1234" });
                //        equipZoneMembers.push({ comNum: 0, name: "홍길동2", floor: "테스트 2층", phoneNumber: "010-124-1235" });
                //        equipZoneMembers.push({ comNum: 0, name: "홍길동3", floor: "테스트 3층", phoneNumber: "010-125-1236" });
                //        equipZoneMembers.push({ comNum: 0, name: "홍길동4", floor: "테스트 4층", phoneNumber: "010-126-1237" });

                //        this.setState({ equipZoneMembers });
                //    }
                //}

                return;
            }

            this.setState({ equipZoneMembers });
        }
    }

    setActiveDragPopup = () => {

    }

    displayEquipZoneMembers = () => {
        const equipZoneMembers = this.state.equipZoneMembers;
        const displayEquipZoneMembers = [];

        for (const member of equipZoneMembers) {
     
            displayEquipZoneMembers.push(
                <tr key={"displayEquipZoneMember_" + member.targetId}>
                    <td>{(member.comNum === 1 ? "임직원" : "방문객")}</td>
                    <td>{member.name}</td>
                    <td>{member.targetId}</td>
                    <td>{member.floor}</td>
                    <td>{member.phoneNumber}</td>
                    <td>+{member.stayTime}</td>
                    <td className='sos-icon' />
                </tr>
            );

        }

        return displayEquipZoneMembers;
    }

    onClickDownload = async () => {
        let equipZoneMembers = this.state.equipZoneMembers;

        const title = "잔류자 정보";

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(title); // sheet 이름

        // title		
        let titleRow = worksheet.getCell('A1');
        titleRow.value = title;

        titleRow.font = { name: '맑은 고딕', family: 4, size: 20, bold: true };
        worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.mergeCells('A1:E2');
        worksheet.getCell('A1:E2').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }

        // column
        let columnRow = worksheet.addRow(['No', i18n.t('sdms.worker.분류'), i18n.t('sdms.worker.이름'), i18n.t('sdms.worker.층'), i18n.t('sdms.worker.연락처')]);
        columnRow.eachCell((cell, number) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '#A24B40' }
            };
            cell.style = {
                alignment: { vertical: 'middle', horizontal: 'center' }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }

        });

        // column key 설정 
        worksheet.columns = [
            { key: "no", width: 5 },
            { key: "comNum", width: 10 },
            { key: "name", width: 20 },
            { key: "floor", width: 20 },
            { key: "phoneNumber", width: 20 }
        ];

        if (equipZoneMembers?.length > 0) {
            let arrDatas = [];
            const dataLength = equipZoneMembers.length;
            for (let i = 0; i < dataLength; i++) {
                const data = [];

                const no = arrDatas.length + 1;
                const comNum = (equipZoneMembers[i].comNum === 1 ? "임직원" : "방문객");
                const name = equipZoneMembers[i].name;
                const floor = equipZoneMembers[i].floor;
                const phoneNumber = equipZoneMembers[i].phoneNumber;

                data.no = no;
                data.comNum = comNum;
                data.name = name;
                data.floor = floor;
                data.phoneNumber = phoneNumber;

                arrDatas.push(data);
            }

            arrDatas.forEach(function (item, index) {
                worksheet.addRow({
                    no: item.no,
                    comNum: item.comNum,
                    name: item.name,
                    floor: item.floor,
                    phoneNumber: item.phoneNumber
                }).alignment = { vertical: 'middle', horizontal: 'center' };
            })
        }

        // 다운로드 
        const mimeType = { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], mimeType);

        const dtNow = new Date();
        const date = this.getMakeDateTime(dtNow).replace(/-/gi, '');
        const time = this.getMakeTime(dtNow).replace(/:/gi, '');

        saveAs(blob, title + '_' + date + '_' + time + ".xlsx");
    }

    getMakeDateTime(dateTime) {
        let year = dateTime.getFullYear();
        let month = 1 + dateTime.getMonth();
        month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
        let day = dateTime.getDate();                   //d
        day = day >= 10 ? day : '0' + day;

        let strDate = year + '-' + month + '-' + day;
        return strDate;
    }

    getMakeTime(dateTime) {
        let hour = dateTime.getHours();
        hour = hour >= 10 ? hour : '0' + hour;
        let min = dateTime.getMinutes();
        min = min >= 10 ? min : '0' + min;
        let sec = dateTime.getSeconds();
        sec = sec >= 10 ? sec : '0' + sec;

        let strDate = hour + ':' + min + ':' + sec;
        return strDate;
    }

    displayUI = () => {
        const equipZoneMembers = this.state.equipZoneMembers;
        const type = this.state.type;
        const displayEquipZoneMembers = [];
        let displayMemberTable = null;
        let displayTitle = null;
        let displayIcon = [];

        let date = new Date();
        let i = 0;

        if (type === WorkerStatusPopup.Type.Remainer) {
            displayTitle = i18n.t('sdms.worker.잔류자 정보');
            displayIcon.push(
                <>
                    <a className={'downloadIcon'} onClick={() => this.onClickDownload()}></a>
                    <a className={'messageSend'} onClick={() => this.onClickRemainerSMS()}></a>
                </>
                    );

            for (const member of equipZoneMembers) {

                displayEquipZoneMembers.push(
                    <tr key={"displayRemainer_" /*+ date.getTime() + "_"*/ + (this.props.equipZoneID ? this.props.equipZoneID + "_" : "") + this.state.type + "_" + (member.name ? member.name + "_" : "") + (member.phoneNumber ? member.phoneNumber : "")}>
                        <td>{(member.comNum === 1 ? "임직원" : "방문객")}</td>
                        <td>{member.name}</td>
                        <td>{member.floor}</td>
                        <td>{member.phoneNumber}</td>
                    </tr>
                );

                i++;
            }
        }
        else {
            displayTitle = i18n.t('sdms.worker.작업자 정보');            

            for (const member of equipZoneMembers) {

                displayEquipZoneMembers.push(
                    <tr key={"displayEquipZoneMember_" /*+ date.getTime()*/ + "_" + (this.props.equipZoneID ? this.props.equipZoneID + "_" : "") + this.state.type + "_" + (member.name ? member.name + "_" : "") + (member.phoneNumber ? member.phoneNumber : "")}>
                        <td>{(member.comNum === 1 ? "임직원" : "방문객")}</td>
                        <td>{member.name}</td>
                        <td>{member.targetId}</td>
                        <td>{member.floor}</td>
                        <td>{member.phoneNumber}</td>
                        <td>+{member.stayTime}</td>
                        <td className='sos-icon' />
                    </tr>
                );

                i++;
            }
        }        

        let tableHead = null;

        if (type === WorkerStatusPopup.Type.Remainer) {
            tableHead = (<tr>
                <td width={'10%'}>{i18n.t('sdms.worker.분류')}</td>
                <td width={'30%'}>{i18n.t('sdms.worker.이름')}</td>
                <td width={'30%'}>{i18n.t('sdms.worker.층')}</td>
                <td width={'30%'}>{i18n.t('sdms.worker.연락처')}</td>
            </tr>);
        }
        else {
            tableHead = (<tr>
                <td width={'10%'}>{i18n.t('sdms.worker.분류')}</td>
                <td width={'10%'}>{i18n.t('sdms.worker.이름')}</td>
                <td width={'10%'}>{i18n.t('sdms.worker.사번')}</td>
                <td width={'8%'}>{i18n.t('sdms.worker.층')}</td>
                <td width={'20%'}>{i18n.t('sdms.worker.연락처')}</td>
                <td width={'15%'}>{i18n.t('sdms.worker.체류시간')}</td>
                <td width={'10%'}>{i18n.t('sdms.worker.SOS')}</td>
            </tr>);
        }

        displayMemberTable = (<table>
            <thead>
                {tableHead}
            </thead>
            <tbody>
                {displayEquipZoneMembers}
            </tbody>
        </table>);

        return [displayMemberTable, displayTitle, displayIcon];
    }

    onClickClosePopup = () => {
        this.props.setWorkerStatusPopup(null);
    }

    onClickRemainerSMS = () => {        
        this.props.showConfirmDialog(i18n.t('sdms.worker.잔류자 상황 전파'), [i18n.t('sdms.worker.상황 전파를 하시겠습니까?')], [i18n.t('common.확인'), i18n.t('common.취소')], this.confirmRemainerSMS);
    }

    confirmRemainerSMS = async (index) => {
        if (index === 0) {
            // 전송
            const equipZoneMembers = this.state.equipZoneMembers;

            if (equipZoneMembers === null || equipZoneMembers.length === 0) {
                // 실패 팝업
                this.props.showConfirmDialog(i18n.t('sdms.worker.잔류자 상황 전파'), [i18n.t('sdms.worker.전파 대상자가 없습니다. 확인해주세요')], [i18n.t('common.확인')], null);
                return;
            }

            let phoneNumbers = [];

            for (let i = 0; i < equipZoneMembers.length; i++) {
                const member = equipZoneMembers[i];

                if (member.phoneNumber?.length > 0) {
                    let phoneNumber = member.phoneNumber;
                    phoneNumber = phoneNumber.replace(/-/gi, '');

                    // 10~11 자리 숫자일 경우만
                    let chk = /[0-9]{10,11}$/;
                    if (chk.test(phoneNumber) && phoneNumbers.indexOf(phoneNumber) === -1) {
                        phoneNumbers.push(phoneNumber);
                    }
                }
            }

            if (phoneNumbers.length > 0) {
                const [success, message] = await SDMSController.requestWonikRemainerSMS(phoneNumbers);

                if (success === true) {
                    // 성공 팝업
                    this.props.showConfirmDialog(i18n.t('sdms.worker.잔류자 상황 전파'), [i18n.t('sdms.worker.상황 전파 하였습니다')], [i18n.t('common.확인')], null);
                } else {
                    // 실패 팝업
                    let txt = i18n.t('sdms.worker.상황 전파 실패하였습니다') + " " + message;

                    this.props.showConfirmDialog(i18n.t('sdms.worker.잔류자 상황 전파'), [txt], [i18n.t('common.확인')], null);
                }
            }
            else {
                // 실패 팝업
                this.props.showConfirmDialog(i18n.t('sdms.worker.잔류자 상황 전파'), [i18n.t('sdms.worker.전파 대상자가 없습니다. 확인해주세요')], [i18n.t('common.확인')], null);
            }
        }
        //else 취소
     
    }

    render() {
        const displayEquipZoneMembers = this.displayEquipZoneMembers();
        const [displayMemberTable, displayTitle, displayIcon] = this.displayUI();
    
        return (
            <WorkerStatusComponentPopup id={this.props.popupType} className={'viewDashboardBoxD viewDashboardWorkerStatus scrollbar'} style={{ zIndex: 0, opacity: 1 }} height={this.props.popupState?.height}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={716}
                    popupMinHeight={420}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >
                    <div className={'dslTop dslGrd'}>
                        <h5 className={'dslTitle'} >
                            {displayTitle}
                        </h5>
                        {displayIcon}
                        {/* <a className={'messageSend'}></a> */}
                        <a className={'dslX'} onClick={this.onClickClosePopup} ></a>
                    </div>
                    <div className={'dslCont'}>
                        <div className='worker-info-wrap'>
                            {/*
                            <table>
                                <thead>
                                    <tr>
                                        <td width={'10%'}>{i18n.t('sdms.worker.분류')}</td>
                                        <td width={'10%'}>{i18n.t('sdms.worker.이름')}</td>
                                        <td width={'10%'}>{i18n.t('sdms.worker.사번')}</td>
                                        <td width={'8%'}>{i18n.t('sdms.worker.층')}</td>
                                        <td width={'20%'}>{i18n.t('sdms.worker.연락처')}</td>
                                        <td width={'15%'}>{i18n.t('sdms.worker.체류시간')}</td>
                                        <td width={'10%'}>{i18n.t('sdms.worker.SOS')}</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    { displayEquipZoneMembers }
                                </tbody>
                            </table>
                            */}
                            {displayMemberTable}
                        </div>
                    </div>
                </PopupDraggable>
            </WorkerStatusComponentPopup>
        );
    }
}

export default withTranslation()(WorkerStatusPopup);