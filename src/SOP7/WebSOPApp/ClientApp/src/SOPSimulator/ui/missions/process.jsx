import React, { Component } from 'react';
import styles from '../../../Common/css/style.module.css';
import uis from '../../../Common/css/ui.module.css';
import uneStyles from '../../../Common/css/uneCommon.module.css';
import SectionData from '../../../Common/models/sections/sectionData';
import $ from 'jquery';
import ConfirmDialog from '../../../Common/ui/confirmDialog';
import { SettingController } from '../../../Settings/services/settingController';

import { ProcessSectionBox } from '../../styled/missionsStyled';

import ProjectResource from '../../../Root/resource/id';
import AccountResource from '../../../Account/resource/id';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';

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
        this.props.showConfirmDialog(
            i18n.t('sopSimulator.formText.알림'),
            i18n.t('sopSimulator.formText.외부 프로그램을 실행할까요?'),
            [i18n.t('sopSimulator.formText.실행'), i18n.t('common.취소')],
            this.onProgress);
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
            
            strMessage = i18n.t('sopSimulator.formText.전파할 수신자가 없습니다');
            this.props.showConfirmDialog(i18n.t('sopSimulator.formText.알림'), strMessage, [i18n.t('common.확인')], this.onProgress);
            return;
        }

        if (onClickType === this.onClickSMSType) {            
            if (this.props.commonSettings.UseSMS === 'false') {
                strMessage = i18n.t('sopSimulator.formText.문자 전파가 사용되지 않음으로 설정되어 있습니다. 문자 전파를 사용함으로 설정하고 발송할까요?');
            }
            else {
                strMessage = i18n.t('sopSimulator.formText.문자메시지를 전송할까요?');
            }
            this.confirmDialogData = [this.onClickSMSType, mission];
        }
        else if (onClickType === this.onClickEmailType) {            
            if (this.props.commonSettings.UseEmail === 'false') {
                strMessage = i18n.t('sopSimulator.formText.메일 전파가 사용되지 않음으로 설정되어 있습니다. 메일 전파를 사용함으로 설정하고 발송할까요?');
            }
            else {
                strMessage = i18n.t('sopSimulator.formText.메일을 발송할까요?');
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
                    strMessage = i18n.t('sopSimulator.formText.문자 전파가 사용되지 않음으로 설정되어 있습니다. 문자 전파를 사용함으로 설정하고 문자메시지와 메일을 모두 전송할까요?');
                }
                else if (this.props.commonSettings.UseSMS === 'true' && this.props.commonSettings.UseEmail === 'false') {
                    strMessage = i18n.t('sopSimulator.formText.메일 전파가 사용되지 않음으로 설정되어 있습니다. 메일 전파를 사용함으로 설정하고 문자메시지와 메일을 모두 전송할까요?');
                }
                else if (this.props.commonSettings.UseSMS === 'false' && this.props.commonSettings.UseEmail === 'false') {
                    strMessage = i18n.t('sopSimulator.formText.문자와 메일 전파가 사용되지 않음으로 설정되어 있습니다. 문자, 메일 전파를 사용함으로 설정하고 문자메시지와 메일을 모두 전송할까요?');
                }
                else {
                    strMessage = i18n.t('sopSimulator.formText.문자메시지와 메일을 모두 전송할까요?');
                }
            }
            else {
                strMessage = i18n.t('sopSimulator.formText.모든 외부 프로그램을 실행할까요?');
            }

            this.confirmDialogData = [this.onClickAllType];
        }

        this.props.showConfirmDialog(i18n.t('sopSimulator.formText.알림'), strMessage, [i18n.t('sopSimulator.formText.상황 전파'), i18n.t('common.취소')], this.onProgress);
    }

    async SaveSetting(propertyName, propertyValue) {
        const result = await SettingController.requestSaveSetting(propertyName, propertyValue);
        return result;
    }

    async onProgress(index) {
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
                else if (type === this.onClickExternalType  && this.confirmDialogData[1]) {                    
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

        const missions = this.props.sectionData.missions;
        if (missions === null) {
            return;
        }
        const missionsLength = missions.length;

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

        if (this.props.sectionData !== null && this.props.sectionData.missions !== null) {
            for (let i = 0; i < this.props.sectionData.missions.length; i++) {
                const mission = this.props.sectionData.missions[i];
                let missionText = '';
                if (mission.missionType === Process.missionType.External) {
                    missionText = mission.programName;
                    if (mission.parameters !== null && mission.parameters.length > 0) {
                        missionText += " (" + i18n.t('sopSimulator.formText.전달 인자') + " : " + mission.parameters.join() + ")";
                    }

                    let btnSpreadAllName = 'btnArea btnPropagateSelect';
                    if (!this.props.sectionData.sectionNumber) {
                        // sectionNumber가 null일 때
                        btnSpreadAllName = 'btnAreaDisable proBtnDisable';
                    }
                    else if (this.props.currentSection?.length > 0 && this.props.currentSection[0].componentType === 3 && this.props.currentSection[0].isBegin) {
                        // 현재 SOP가 시작되지 않았을 때 Disable
                        btnSpreadAllName = 'btnAreaDisable proBtnDisable';
                    }
                    else if (this.props.sectionData.status === SectionData.Status_Done) {
                        // 현재 임무가 완료된 상태라면 Disable
                        btnSpreadAllName = 'btnAreaDisable proBtnDisable';
                    }

                    missionList.push(
                        <dd className={"borderSide"} key={i}>
                            <p className={"check"}>
                                <span className={"checkBox"}>
                                    <input type="checkbox" name="task01"
                                        onChange={(e) => this.onProgressMission(e.target.checked, mission)}
                                        checked={mission.checked} />
                                </span>
                            </p>
                            <p className={"tit"}>
                                <textarea className={'processTextarea'} defaultValue={missionText}>
                                    
                                </textarea>
                            </p>
                            <p className={btnSpreadAllName} style={{ 'marginRight': '40px' }} onClick={() => this.showConfirmDialogExternal(mission)}>{i18n.t('sopSimulator.formText.실행')}</p>
                            <p className={'completionStatus'}>{mission.checked ? i18n.t('sopSimulator.formText.완료') : i18n.t('sopSimulator.formText.미완료')}</p>
                        </dd>
                    );
                }
                else {
                    missionText = i18nUtil.convertText(mission.missionText);

                    missionList.push(
                        <dd className={'borderSide'} key={missionText}>
                            <p className={'check'}>
                                <span className={'checkBox'}>
                                    <input type="checkbox" name="task01"
                                        onChange={(e) => this.onProgressMission(e.target.checked, mission)}
                                        checked={mission.checked} />
                                </span>
                            </p>
                            <p className={'tit'}>
                                <textarea className={'processTextarea'} defaultValue={missionText}>
                                    
                                </textarea>
                            </p>
                            <p><button type="button" onClick={() => this.showConfirmDialog(this.onClickSMSType, mission)}><i className={'messagee'}></i></button></p>
                            <p><button type="button" onClick={() => this.showConfirmDialog(this.onClickEmailType, mission)}><i className={'emaill'}></i></button></p>
                            <p className={'completionStatus'}>{mission.checked ? i18n.t('sopSimulator.formText.완료') : i18n.t('sopSimulator.formText.미완료')}</p>
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

        const missions = this.props.sectionData.missions;
        if (missions === null || missions.length === 0) {
            await this.props.onProgressMission(checked, this.props.sectionData, -1);
            this.setState({ missions: missions, allChecked: checked });
            return;
        }

        const missionsLength = missions.length;
        
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

    getReceiversUI() {
        if (!this.props.sectionData.receivers || this.props.sectionData.receivers.length === 0)
            return <></>;

        let ui = [];
        const receiverCount = this.props.sectionData.receivers.length;

        for (let i = 0; i < receiverCount; i++) {
            const receiver = this.props.sectionData.receivers[i];
            // 0:평일비상조직, 1:휴일비상조직, 2:정규조직
            const teamType = receiver.teamType;
            const teamID = receiver.teamID;

            let content = this.getReceiverContent(teamType, teamID);

            ui.push(<p key={"teamInfo_" + i}>{content}</p>);
        }
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

        for (var i = 0; i < teamDatas.length; i++) {
            if (teamDatas[i].id === teamID) {
                content = teamDatas[i].teamName;
                break;
            }
        }

        return content;
    }

    render() {
        const [missionList] = this.getMissionListUI();

        //현재임무 - sectionCurrent
        //대기(실행중) - sectionRun
        //완료 - sectionDone
        //대기 - 
        let boxClassName = "";
        let textClassName = " " + 'textNormal';

        let bAmICurrentSection = false; // 자신이 현재 세션인지 여부
        const currentSectionCount = this.props.currentSection.length;
        for (let i = 0; i < currentSectionCount; i++) {
            const currentSection = this.props.currentSection[i];
            if (currentSection.id === this.props.sectionData.id && currentSection.componentType === this.props.sectionData.componentType) {
                bAmICurrentSection = true;
            }
        }

        if (bAmICurrentSection) {
            boxClassName = " " + 'sectionCurrent' + " " + 'currentBox';
            textClassName = " " + 'textCurrent';
        } else if (this.props.sectionData.status === SectionData.Status_Run) {
            boxClassName = " " + 'sectionRun';
            textClassName = " " + 'textRun';
        } else if (this.props.sectionData.status === SectionData.Status_Done) {
            boxClassName = " " + 'sectionDone';
            textClassName = " " + 'textDone';
        } else if (this.props.sectionData.status === SectionData.Status_Skip) { // 스킵
            boxClassName = " " + 'sectionSkip';
            textClassName = " " + 'textRun';
        }

        // 다음 버튼 활성화
        let btnNextClassName = 'btnAllCheck';
        let btnSpreadAllName = 'btnArea btnPropagateSelect';
        if (!this.props.sectionData.sectionNumber) {
            // sectionNumber가 null일 때
            btnNextClassName = 'btnDisable';
            btnSpreadAllName = 'btnAreaDisable proBtnDisable';
        }
        else if (this.props.currentSection?.length > 0 && this.props.currentSection[0].componentType === 3 && this.props.currentSection[0].isBegin) {
            // 현재 SOP가 시작되지 않았을 때 Disable
            btnNextClassName = 'btnDisable';
            btnSpreadAllName = 'btnAreaDisable proBtnDisable';
        }
        else if (this.props.sectionData.status === SectionData.Status_Done) {
            // 현재 임무가 완료된 상태라면 Disable
            btnNextClassName = 'btnDisable';
            btnSpreadAllName = 'btnAreaDisable proBtnDisable';
        }

        const receiversUI = this.getReceiversUI();

        // 권한 (사용자 등급은 실행 권한 없음)
        const userAuth = ProjectResource.getUserInfo();
        if (!userAuth || userAuth === null || userAuth.levelID === AccountResource.accountLevelID.user) {
            btnNextClassName = uis.btnDisable;
            btnSpreadAllName = uneStyles.btnAreaDisable + " " + uneStyles.proBtnDisable;
        }

        const title = i18nUtil.convertText(this.props.sectionData.text);

        return (
            <ProcessSectionBox className={'sectionBox' + boxClassName} id={this.props.id}>
                <div className={'tit' + textClassName}>
                    <strong>
                        {this.props.sectionData.sectionNumber}.{title}
                        {
                            (this.props.sectionData.autoRun)
                                ? <span className={'flag flag01'}>{i18n.t('sopSimulator.formText.자동')}</span>
                                : <></>
                        }
                    </strong>
                    <div className={'tooltip'}>
                        <div className={'propagatePeople'}><button type="button"></button></div>
                        <div className={'dropBox'}>
                            <p>{i18n.t('sopSimulator.formText.전파 대상자')}</p>
                            {receiversUI}
                        </div>
                    </div>
                    <div className={'btnArea btnArea'}>
                        <a className={btnNextClassName} onClick={this.runSection}>{i18n.t('sopSimulator.formText.다음')}</a>
                    </div>
                    <div className={'completionStatuss'}>{(this.state.allChecked) ? i18n.t('sopSimulator.formText.완료') : i18n.t('sopSimulator.formText.미완료')}</div>
                </div>
                <dl className={'taskDetail'}>
                    <dt>
                        <p className={'checkk'}>
                            {
                                (this.props.missions !== null) ?
                                    <span className={'checkBox'}>
                                        <input type="checkbox" name=" " checked={this.state.allChecked} onChange={(e) => this.onCheckedChangeAll(e.target.checked)} />
                                    </span>
                                    : null
                            }
                        </p>
                        <span className={'taskDetailText'}>{i18n.t('sopSimulator.formText.행동요령')}</span>
                        {/*<p className={uneStyles.btnAreaDisable + " " + proBtnDisable}>전체전파</p> */} {/*--> 비활성화 모드*/}
                        <p className={btnSpreadAllName} onClick={() => this.showConfirmDialog(this.onClickAllType)}>{i18n.t('sopSimulator.formText.전체 전파')}</p>  {/*활성화 모드*/}
                    </dt>
                    {missionList}
                </dl>
            </ProcessSectionBox>
        );
    }
}

export default withTranslation()(Process);