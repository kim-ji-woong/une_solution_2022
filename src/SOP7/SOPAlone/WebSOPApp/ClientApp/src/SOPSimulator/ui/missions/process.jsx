import React, { Component } from 'react';
import styles from '../../../Common/css/style.module.css';
import uis from '../../../Common/css/ui.module.css';
import uneStyles from '../../../Common/css/uneCommon.module.css';
import SectionData from '../../../Common/models/sections/sectionData';
import $ from 'jquery';
import ConfirmDialog from '../../../Common/ui/confirmDialog';
import { SettingController } from '../../../Settings/services/settingController';
import ManualInputMessagePopup from '../popup/manualInputMessagePopup';

import ProjectResource from '../../../Root/resource/id';

class Process extends Component {
    static missionType =
        {
            Normal: 0,
            External: 1,
            None: 2
        }
    constructor(props) {
        super(props);

        this.state = {
            allChecked: false,
            missions: this.props.sectionData.missions,
            //useManualInputMessagePopup: ProjectResource.SiteID === ProjectResource.Site.Cleannara ? true : false, // 수동 번호 입력 팝업
            //showManualInputMessagePopup: {
            //    visible: false,
            //    message: ''
            //},
            prevProps: props
        }

        this.props = props;

        this.runSection = this.runSection.bind(this);
        this.onProgress = this.onProgress.bind(this);

        this.onClickSMSType = 'sms';
        this.onClickEmailType = 'email';
        this.onClickExternalType = 'external';
        this.onClickAllType = 'all';
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps === prevState.prevProps) {
            return prevState;
        }

        let allChecked = true;
        if (nextProps.sectionData.missions === null || nextProps.sectionData.missions.length === 0) {
            if (nextProps.sectionData.status === SectionData.Status_Done) {
                allChecked = true;
            }
            else {
                allChecked = prevState.allChecked;
            }
        }
        else {
            for (let i = 0; i < nextProps.sectionData.missions.length; i++) {
                if (!nextProps.sectionData.missions[i].checked) {
                    allChecked = false;
                    break;
                }
            }
        }

        return {
            missions: nextProps.sectionData.missions,
            allChecked: allChecked,
            prevProps: nextProps
        };
    }

    runSection() {
        this.props.runSection(this.props.sectionData);
    }

    showConfirmDialogExternal(mission) {
        if (this.props.currentSection?.length > 0 && this.props.currentSection[0].componentType === 3 && this.props.currentSection[0].isBegin) {
            return;
        }

        this.confirmDialogData = [this.onClickExternalType, mission];

        this.props.showConfirmDialog('알림', '외부 프로그램을 실행할까요?', ['실행', '취소'], this.onProgress);
    }

    showConfirmDialog(onClickType, mission) {
        if (this.props.currentSection?.length > 0 && this.props.currentSection[0].componentType === 3 && this.props.currentSection[0].isBegin) {
            return;
        }

        if (this.props.sectionData.missions === null || this.props.sectionData.missions.length === 0) {
            return;
        }

        let strMessage = '';
        if (this.props.sectionData.receivers === null || this.props.sectionData.receivers.length === 0) {
            strMessage = '수신자가 없습니다.'
            this.props.showConfirmDialog('알림', strMessage, ['확인'], this.onProgress);
            return;
        }

        if (onClickType === this.onClickSMSType) {
            if (this.props.commonSettings.UseSMS === 'false') {
                strMessage = '문자 전파가 사용되지 않음으로 설정되어 있습니다. 문자 전파를 사용함으로 설정하고 발송할까요?'
            }
            else {
                strMessage = '문자메시지를 발송할까요?'
            }

            this.confirmDialogData = [this.onClickSMSType, mission];
        }
        else if (onClickType === this.onClickEmailType) {
            if (this.props.commonSettings.UseEmail === 'false') {
                strMessage = '메일 전파가 사용되지 않음으로 설정되어 있습니다. 메일 전파를 사용함으로 설정하고 발송할까요?'
            }
            else {
                strMessage = '메일을 전송할까요?';
            }
            this.confirmDialogData = [this.onClickEmailType, mission];
        }
        else if (onClickType === this.onClickAllType) {
            let containsNormalMission = false;
            const missionCount = this.props.sectionData.missions.length;
            for (let i = 0; i < missionCount; i++) {
                if (this.props.sectionData.missions[i].missionType === Process.missionType.Normal) {
                    containsNormalMission = true;
                    break;
                }
            }

            if (containsNormalMission) {
                if (this.props.commonSettings.UseSMS === 'false' && this.props.commonSettings.UseEmail === 'true') {
                    strMessage = '문자 전파가 사용되지 않음으로 설정되어 있습니다. 문자 전파를 사용함으로 설정하고 문자메시지와 메일을 모두 전송할까요?'
                }
                else if (this.props.commonSettings.UseSMS === 'true' && this.props.commonSettings.UseEmail === 'false') {
                    strMessage = '메일 전파가 사용되지 않음으로 설정되어 있습니다. 메일 전파를 사용함으로 설정하고 문자메시지와 메일을 모두 전송할까요?'
                }
                else if (this.props.commonSettings.UseSMS === 'false' && this.props.commonSettings.UseEmail === 'false') {
                    strMessage = '문자와 메일 전파가 사용되지 않음으로 설정되어 있습니다. 문자, 메일 전파를 사용함으로 설정하고 문자메시지와 메일을 모두 전송할까요?'
                }
                else {
                    strMessage = '문자메시지와 메일을 모두 전송할까요?';
                }
            }
            else {
                strMessage = '모든 외부 프로그램을 실행할까요?';
            }

            this.confirmDialogData = [this.onClickAllType];
        }

        //if (this.state.useManualInputMessagePopup) {
        //    const showManualInputMessagePopup = {
        //        visible: true, message: strMessage
        //    }
        //    this.setState({ showManualInputMessagePopup });
        //}
        //else {
        this.props.showConfirmDialog('알림', strMessage, ['상황 전파', '취소'], this.onProgress);
        //}
    }

    //onCloseManualInputMessagePopup = () => {
    //    const showManualInputMessagePopup = {
    //        visible: false, message: ''
    //    }
    //    this.setState({ showManualInputMessagePopup });
    //}

    async SaveSetting(propertyName, propertyValue) {
        const result = await SettingController.requestSaveSetting(propertyName, propertyValue);
        return result;
    }

    // 보류
    // bIncludeOrg : 핸드폰 번호 추가 입력 기능을 사용하는 사이트 (깨끗한나라) 에서
    //               기존에 지정된 담당자들에게도 발송할건지 여부 
    // otherPhoneNumbers : 추가 입력한 번호들
    async onProgress(index, bIncludeOrg, otherPhoneNumbers) {
        if (index === 0) {
            if (this.confirmDialogData) {
                const type = this.confirmDialogData[0];
                if (type === this.onClickSMSType && this.confirmDialogData[1]) {
                    let useSMS = this.props.commonSettings.UseSMS === 'true';
                    if (!useSMS) {
                        useSMS = await this.SaveSetting('UseSMS', 'true');
                    }

                    if (useSMS) {
                        this.onProgressSpread(this.confirmDialogData[1], type);
                    }
                }
                else if (type === this.onClickEmailType && this.confirmDialogData[1]) {
                    let useEmail = this.props.commonSettings.UseEmail === 'true';
                    if (!useEmail) {
                        useEmail = await this.SaveSetting('UseEmail', 'true');
                    }

                    if (useEmail) {
                        this.onProgressSpread(this.confirmDialogData[1], type);
                    }
                }
                else if (type === this.onClickExternalType && this.confirmDialogData[1]) {
                    this.onProgressSpread(this.confirmDialogData[1], type);
                }
                else if (type === this.onClickAllType) {
                    let containsNormalMission = false;
                    const missionCount = this.props.sectionData.missions.length;
                    for (let i = 0; i < missionCount; i++) {
                        if (this.props.sectionData.missions[i].missionType === Process.missionType.Normal) {
                            containsNormalMission = true;
                            break;
                        }
                    }

                    if (containsNormalMission) {
                        let useSMS = this.props.commonSettings.UseSMS === 'true';
                        if (!useSMS) {
                            useSMS = await this.SaveSetting('UseSMS', 'true');
                        }

                        let useEmail = this.props.commonSettings.UseEmail === 'true';
                        if (!useEmail) {
                            useEmail = await this.SaveSetting('UseEmail', 'true');
                        }

                        if (useSMS && useEmail) {
                            this.onProgressSpreadAll();
                        }
                    }
                    else {
                        this.onProgressSpreadAll();
                    }
                }

                this.confirmDialogData = undefined;
            }
        }

        this.props.onCloseConfirmDialog();
    }

    onProgressSpread(mission, type) {
        const missions = this.props.sectionData.missions;
        const missionsLength = this.props.sectionData.missions.length;

        let missionIndex = -1;
        for (let i = 0; i < missionsLength; i++) {
            if (missions[i] === mission) {
                // 몇 번째 임무인지 구하기
                missionIndex = i;
                break;
            }
        }

        if (type === this.onClickExternalType) {
            this.props.onExcuteExternalProgram(this.props.sectionData, missionIndex);
        }
        else {
            this.props.onProgressSpread(this.props.sectionData, missionIndex, type === this.onClickSMSType, !type === this.onClickSMSType, false, false);
        }
    }

    onProgressSpreadAll() {
        if (this.props.currentSection?.length > 0 && this.props.currentSection[0].componentType === 3 && this.props.currentSection[0].isBegin) {
            return;
        }

        this.props.onProgressSpread(this.props.sectionData, -1, true, true, false, false);
    }


    async onProgressMission(checked, mission) {
        if (this.props.currentSection?.length > 0 && this.props.currentSection[0].componentType === 3 && this.props.currentSection[0].isBegin) {
            return;
        }

        const missions = this.state.missions;
        const missionsLength = this.state.missions.length;

        let allChecked = true;
        let missionIndex = -1;
        for (var i = 0; i < missionsLength; i++) {
            if (missions[i] === mission) {
                // 몇 번째 임무인지 구하기
                missionIndex = i;
                missions[i].checked = checked;
            }

            if (!missions[i].checked) {
                allChecked = false;
            }
        }

        if (allChecked) {
            this.props.sectionData.status = SectionData.Status_Done;
        }

        this.setState({ missions: missions, allChecked: allChecked });

        if (missionIndex >= 0) {
            await this.props.onProgressMission(checked, this.props.sectionData, missionIndex);
        }
    }

    getMissionListUI() {
        var missionList = [];

        if (this.state.missions !== null) {
            for (let i = 0; i < this.state.missions.length; i++) {
                const mission = this.state.missions[i];
                let missionText = '';
                if (mission.missionType === Process.missionType.External) {
                    missionText = mission.programName;
                    if (mission.parameters !== null && mission.parameters.length > 0) {
                        missionText += " (전달인자 : " + mission.parameters.join() + ")";
                    }

                    let btnSpreadAllName = uneStyles.btnArea + " " + uneStyles.btnPropagateSelect;
                    if (!this.props.sectionData.sectionNumber) {
                        // sectionNumber가 null일 때
                        btnSpreadAllName = uneStyles.btnAreaDisable + " " + uneStyles.proBtnDisable;
                    }
                    else if (this.props.currentSection?.length > 0 && this.props.currentSection[0].componentType === 3 && this.props.currentSection[0].isBegin) {
                        // 현재 SOP가 시작되지 않았을 때 Disable
                        btnSpreadAllName = uneStyles.btnAreaDisable + " " + uneStyles.proBtnDisable;
                    }
                    else if (this.props.sectionData.status === SectionData.Status_Done) {
                        // 현재 임무가 완료된 상태라면 Disable
                        btnSpreadAllName = uneStyles.btnAreaDisable + " " + uneStyles.proBtnDisable;
                    }

                    missionList.push(
                        <dd className={uneStyles.borderSide} key={i}>
                            <p className={uis.check}>
                                <span className={uis.checkBox}>
                                    <input type="checkbox" name="task01"
                                        onChange={(e) => this.onProgressMission(e.target.checked, mission)}
                                        checked={mission.checked} />
                                </span>
                            </p>
                            <p className={uis.tit}>
                                <textarea className={uis.processTextarea + " " + uis.processTextScrollbar}>
                                    {missionText}
                                </textarea>
                            </p>
                            <p className={btnSpreadAllName} style={{ 'marginRight': '40px' }} onClick={() => this.showConfirmDialogExternal(mission)}>실행</p>
                            <p className={uneStyles.completionStatus}>{mission.checked ? '완료' : '미완료'}</p>
                        </dd>
                    );
                }
                else {
                    missionText = mission.missionText;

                    missionList.push(
                        <dd className={uneStyles.borderSide} key={i}>
                            <p className={uis.check}>
                                <span className={uis.checkBox}>
                                    <input type="checkbox" name="task01"
                                        onChange={(e) => this.onProgressMission(e.target.checked, mission)}
                                        checked={mission.checked} />
                                </span>
                            </p>
                            <p className={uis.tit}>
                                <textarea className={uis.processTextarea + " " + uis.processTextScrollbar}>
                                    {missionText}
                                </textarea>
                            </p>
                            {
                                ProjectResource.SiteID === ProjectResource.Site.Cleannara
                                    ?
                                    <></>
                                    : ProjectResource.SiteID === ProjectResource.Site.Busan
                                        ? <></>
                                        : <span style={{ display: 'flex', flexDirection: 'column', width: '80px' }}>
                                            <p><button type="button" onClick={() => this.showConfirmDialog(this.onClickSMSType, mission)}><i className={uneStyles.messagee}></i></button></p>
                                            <p><button type="button" onClick={() => this.showConfirmDialog(this.onClickEmailType, mission)}><i className={uneStyles.emaill}></i></button></p>
                                        </span>
                            } 
                            <p className={uneStyles.completionStatus}>{mission.checked ? '완료' : '미완료'}</p>
                        </dd>
                    );
                }
            }
        }


        return [missionList];
    }

    async onCheckedChangeAll(checked) {
        if (this.props.currentSection?.length > 0 && this.props.currentSection[0].componentType === 3 && this.props.currentSection[0].isBegin) {
            return;
        }

        const missions = this.state.missions;
        if (missions === null || missions.length === 0) {
            await this.props.onProgressMission(checked, this.props.sectionData, -1);
            this.setState({ missions: missions, allChecked: checked });
            return;
        }

        const missionsLength = this.state.missions.length;

        for (var i = 0; i < missionsLength; i++) {
            if (missions[i].checked === checked) {
                continue;
            }

            missions[i].checked = checked;
            this.props.sectionData.status = checked ? SectionData.Status_Done : SectionData.Status_Run;

            await this.props.onProgressMission(checked, this.props.sectionData, i);
        }

        this.setState({ missions: missions, allChecked: checked });

    }

    onClickEditPhoneNumber = () => {

    }

    //onBlurCheckPhoneNumber = (target) => {
    //    let patternPhone = /01[016789]-[^0][0-9]{2,3}-[0-9]{3,4}/;

    //    const phoneValid = patternPhone.test(target.value);
    //    if (!phoneValid && target.value != "") {
    //        //alert(target.value + "휴대전화번호 형식이 맞지 않습니다.");
    //        //this.props.showErrorDialog("에러", [target.value + " 휴대전화번호 형식이 맞지 않습니다."]);
    //        this.setState({ value: "" });
    //        //this.props.member.PhoneNumber = '';
    //        return;
    //    }

    //    //this.props.member.PhoneNumber = target.value;
    //    if (!this.props.sectionData.phoneNumbers) {
    //        this.props.sectionData.phoneNumbers = [];
    //    }

    //    this.props.sectionData.phoneNumbers.push(target.value);
    //}

    //onChangeCheckPhoneNumber = (target) => {
    //    // 휴대전화일 경우 숫자 및 자릿수 제한
    //    const regex = /^[0-9\b -]{0,13}$/;
    //    if (regex.test(target.value)) {
    //        let value = target.value;
    //        let inputValue = value.replace(/-/g, '');
    //        inputValue = inputValue.replace(/ /g, '');

    //        inputValue = value;

    //        //this.setState({ value: inputValue });
    //    }
    //}

    getReceiversUI() {
        if (!this.props.sectionData.receivers || this.props.sectionData.receivers.length === 0)
            return <></>;

        let ui = [];
        const receiverCount = this.props.sectionData.receivers.length;

        //if (ProjectResource.SiteID === ProjectResource.Site.Cleannara) {
        //    let contents = [];
        //    for (let i = 0; i < receiverCount; i++) {
        //        const receiver = this.props.sectionData.receivers[i];
        //        // 0:평일비상조직, 1:휴일비상조직, 2:정규조직
        //        const teamType = receiver.teamType;
        //        const teamID = receiver.teamID;

        //        this.getReceiverPhoneNumberContent(contents, teamType, teamID);
        //    }

        //    const contentCount = contents.length;
        //    for (let i = 0; i < contentCount; i++) {
        //        const content = contents[i];

        //        ui.push(
        //            <div className={uneStyles.dropFlex}>
        //                <span className={uneStyles.arrowLeft}></span>
        //                <span className={uneStyles.personName}>{content.memberName}</span>
        //                <p className={uneStyles.phoneName}>
        //                    <input type="text"
        //                        //onBlur={(e) => this.onBlurCheckPhoneNumber(e.target)}
        //                        //onChange={(e) => this.onChangeCheckPhoneNumber(e.target)}
        //                        placeholder='010-0000-0000' value={content.phoneNumber} />
        //                </p>
        //            </div>
        //        );
        //    }
        //}
        //else {
        for (let i = 0; i < receiverCount; i++) {
            const receiver = this.props.sectionData.receivers[i];
            // 0:평일비상조직, 1:휴일비상조직, 2:정규조직
            const teamType = receiver.teamType;
            const teamID = receiver.teamID;

            let content = this.getReceiverContent(teamType, teamID);

            ui.push(<p key={"teamInfo_" + i}>{content}</p>);
        }
        //}
        return ui;
    }

    getReceiverContent(teamType, teamID) {
        let content = '';

        let teamDatas = null;
        if (teamType === 2) {
            teamDatas = this.props.teamDatas.regular;
        }

        if (!teamDatas || teamDatas === null) {
            return '';
        }

        for (let i = 0; i < teamDatas.length; i++) {
            if (teamDatas[i].id === teamID) {
                content = teamDatas[i].teamName;
                break;
            }
        }

        return content;
    }

    getReceiverPhoneNumberContent(contents, teamType, teamID) {
        let members = null;
        if (teamType === 2) {
            members = this.props.teamDatas.regularMember;
        }

        if (!members || members === null) {
            return ['', ''];
        }

        const memberLength = members.length;
        for (let i = 0; i < memberLength; i++) {
            if (members[i].RegularID === teamID) {
                let content = {};
                content.memberName = members[i].MemberName;
                content.phoneNumber = members[i].PhoneNumber === null ? '' : members[i].PhoneNumber;
                contents.push(content);
            }
        }

        return contents;
    }

    render() {
        const [missionList] = this.getMissionListUI();

        //현재임무 - sectionCurrent
        //대기(실행중) - sectionRun
        //완료 - sectionDone
        //대기 - 
        let boxClassName = "";
        let textClassName = " " + uis.textNormal;

        let bAmICurrentSection = false; // 자신이 현재 세션인지 여부
        const currentSectionCount = this.props.currentSection.length;
        for (let i = 0; i < currentSectionCount; i++) {
            const currentSection = this.props.currentSection[i];
            if (currentSection.id === this.props.sectionData.id && currentSection.componentType === this.props.sectionData.componentType) {
                bAmICurrentSection = true;
            }
        }

        if (bAmICurrentSection) {
            boxClassName = " " + uis.sectionCurrent + " " + uneStyles.currentBox;
            textClassName = " " + uis.textCurrent;
        } else if (this.props.sectionData.status === SectionData.Status_Run) {
            boxClassName = " " + uis.sectionRun;
            textClassName = " " + uis.textRun;
        } else if (this.props.sectionData.status === SectionData.Status_Done) {
            boxClassName = " " + uis.sectionDone;
            textClassName = " " + uis.textDone;
        } else if (this.props.sectionData.status === SectionData.Status_Skip) { // 스킵
            boxClassName = " " + uis.sectionSkip;
            textClassName = " " + uis.textRun;
        }

        // 다음 버튼 활성화
        let btnNextClassName = uis.btnAllCheck;
        let btnSpreadAllName = uneStyles.btnArea + " " + uneStyles.btnPropagateSelect;
        if (!this.props.sectionData.sectionNumber) {
            // sectionNumber가 null일 때
            btnNextClassName = uis.btnDisable;
            btnSpreadAllName = uneStyles.btnAreaDisable + " " + uneStyles.proBtnDisable;
        }
        else if (this.props.currentSection?.length > 0 && this.props.currentSection[0].componentType === 3 && this.props.currentSection[0].isBegin) {
            // 현재 SOP가 시작되지 않았을 때 Disable
            btnNextClassName = uis.btnDisable;
            btnSpreadAllName = uneStyles.btnAreaDisable + " " + uneStyles.proBtnDisable;
        }
        else if (this.props.sectionData.status === SectionData.Status_Done) {
            // 현재 임무가 완료된 상태라면 Disable
            btnNextClassName = uis.btnDisable;
            btnSpreadAllName = uneStyles.btnAreaDisable + " " + uneStyles.proBtnDisable;
        }

        const receiversUI = this.getReceiversUI();

        return (
            <div className={uis.sectionBox + boxClassName} id={this.props.id}>
                <div className={uis.tit + " " + uis.clfix + textClassName}>
                    <strong>
                        {this.props.sectionData.sectionNumber}.{this.props.sectionData.text}
                        {
                            (this.props.sectionData.autoRun)
                                ? <span className={uis.flag + " " + uis.flag01}>자동</span>
                                : <></>
                        }
                    </strong>
                    <div className={uneStyles.tooltip}>
                        <div className={uneStyles.propagatePeople}><button type="button"></button></div>
                        <div className={uneStyles.dropBox}>
                            <span className={uneStyles.dropFlexTitle}>
                                <p>전파 대상자</p>
                                {/* <span className={uneStyles.editIcon} onClick={() => this.onClickEditPhoneNumber}></span> */}
                            </span>
                            {receiversUI}
                            {/*
                                <div>
                                    <div className={uneStyles.dropFlex}><span className={uneStyles.arrowLeft}></span><span className={uneStyles.personName}>홍길동</span><p className={uneStyles.phoneName}>010-0000-0000</p></div>
                                    <div className={uneStyles.dropFlex}><span className={uneStyles.arrowLeft}></span><span className={uneStyles.personName}>홍길동</span><p className={uneStyles.phoneName}>010-0000-0000</p></div>
                                    <div className={uneStyles.dropFlex}><span className={uneStyles.arrowLeft}></span><span className={uneStyles.personName}>홍길동</span><p className={uneStyles.phoneName}>010-0000-0000</p></div>
                                </div>
                                */

                                /* input */
                                //<div>
                                //    <div className={uneStyles.dropFlex}><span className={uneStyles.arrowLeft}></span><span className={uneStyles.personName}>홍길동</span><p className={uneStyles.phoneName}><input type="text" placeholder="010-0000-0000" /></p></div>
                                //    <div className={uneStyles.dropFlex}><span className={uneStyles.arrowLeft}></span><span className={uneStyles.personName}>홍길동</span><p className={uneStyles.phoneName}><input type="text" placeholder="010-0000-0000" /></p></div>
                                //    <div className={uneStyles.dropFlex}><span className={uneStyles.arrowLeft}></span><span className={uneStyles.personName}>홍길동</span><p className={uneStyles.phoneName}><input type="text" placeholder="010-0000-0000" /></p></div>
                                //</div>

                                //<div className={uneStyles.dropBtn}>확인</div>
                            }

                        </div>
                    </div>
                    <div className={uis.btnArea + " " + uneStyles.btnArea}>
                        <a className={btnNextClassName} onClick={this.runSection}>다음</a>
                    </div>
                    <div className={uneStyles.completionStatuss}>{(this.state.allChecked) ? '완료' : '미완료'}</div>
                </div>
                <dl className={uis.taskDetail}>
                    <span className={uis.taskDetailFlex}>
                    <p className={uis.checkk + " " + uneStyles.checkk}>
                        {
                            (this.props.missions !== null) ?
                                <span className={uis.checkBox}>
                                    <input type="checkbox" name=" " checked={this.state.allChecked} onChange={(e) => this.onCheckedChangeAll(e.target.checked)} />
                                </span>
                                : null
                        }
                    </p>
                    <dt>행동요령
                        {
                            /*<p className={uneStyles.btnAreaDisable + " " + uneStyles.proBtnDisable}>전체전파</p> */ /*--> 비활성화 모드*/
                            (ProjectResource.SiteID !== ProjectResource.Site.Cleannara)
                                ? <p className={btnSpreadAllName} onClick={() => this.showConfirmDialog(this.onClickAllType)}>전체전파</p>  /*활성화 모드*/
                                : <></>
                        }
                    </dt>
                    </span>
                    {missionList}
                </dl>

                {
                    //(this.state.showManualInputMessagePopup.visible)
                    //    ? <ManualInputMessagePopup message={this.state.showManualInputMessagePopup.message}
                    //        onProgress={this.onProgress}
                    //        onClose={this.onCloseManualInputMessagePopup}
                    //        showConfirmDialog={this.props.showConfirmDialog}
                    //    />
                    //    : <></>
                }
            </div>
        );
    }
}

export default Process;