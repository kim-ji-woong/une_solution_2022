import React, { Component } from 'react';
import styles from '../../../Common/css/style.module.css';
import uis from '../../../Common/css/ui.module.css';
/*import resets from '../../../Common/css/reset.module.css';*/
import uneStyles from '../../../Common/css/uneCommon.module.css';
import $ from 'jquery';
import SectionData from '../../../Common/models/sections/sectionData';
import { SettingsController } from '../../../Settings/services/settingsController';
import ProjectResource from '../../../Root/resource/id';


class Internal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allChecked: false,
            prevProps: props
        }

        //this.refMessage = React.createRef();
        this.props = props;

        this.runSection = this.runSection.bind(this);
        this.onProgressSpread = this.onProgressSpread.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps === prevState.prevProps) {
            return prevState;
        }

        return {
            allChecked: nextProps.sectionData.checked,
            prevProps: nextProps
        };
    }

    runSection() {
        this.props.runSection(this.props.sectionData);
    }

    componentDidMount() {
        $('html, body').css({ 'display': 'block', 'height': '100%', 'overflow': 'hidden', 'color': '#fff' });

        // Sound Button UI
        $('.btnSoundToggle').on('click', function () {
            $(this).closest('.' + uis.soundInfo).toggleClass(uis.isShow);
        });

        // soundInfoList
        $('.' + uis.soundInfoList).on('click', 'button', function () {
            var val = $(this).data('value');
            if (val == 'Y') {
                $(this).closest('.' + uis.soundInfo).addClass(uis.isOn);
            }
            else if (val == 'N') {
                $(this).closest('.' + uis.soundInfo).removeClass(uis.isOn);
            }
            $(this).closest('.' + uis.soundInfo).removeClass(uis.isShow);
        });

        //Mic
        // $('.btnMicToggle').on('click', function () {
        //     $(this).closest('.' + uneStyles.micInfo).toggleClass(uneStyles.isShow);
        // });

        // $('.' + uneStyles.micInfoList).on('click', 'button', function () {
        //     var val = $(this).data('value');
        //     if (val == 'Y') {
        //         $(this).closest('.' + uneStyles.micInfo).addClass(uneStyles.isOn);
        //         $('#' + uneStyles.micInfoOn).css('color', '#39A7DE');
        //         $('#' + uneStyles.micInfoOff).css('color', '#fff');
        //     }
        //     else if (val == 'N') {
        //         $(this).closest('.' + uneStyles.micInfo).removeClass(uneStyles.isOn);
        //         $('#' + uneStyles.micInfoOn).css('color', '#fff');
        //         $('#' + uneStyles.micInfoOff).css('color', '#39A7DE');
        //     }
        //     $(this).closest('.' + uneStyles.micInfo).removeClass(uneStyles.isShow);
        // });

        //Volume
        // $('.btnVolumeToggle').on('click', function () {
        //     $(this).closest('.' + uneStyles.volumeInfo).toggleClass(uneStyles.isShow);
        // });

        // $('.' + uneStyles.volumeInfoList).on('click', 'button', function () {
        //     var val = $(this).data('value');
        //     if (val == 'Y') {
        //         $(this).closest('.' + uneStyles.volumeInfo).addClass(uneStyles.isOn);
        //         $('#' + uneStyles.volumeInfoOn).css('color', '#39A7DE');
        //         $('#' + uneStyles.volumeInfoOff).css('color', '#fff');
        //     }
        //     else if (val == 'N') {
        //         $(this).closest('.' + uneStyles.volumeInfo).removeClass(uneStyles.isOn);
        //         $('#' + uneStyles.volumeInfoOn).css('color', '#fff');
        //         $('#' + uneStyles.volumeInfoOff).css('color', '#39A7DE');
        //     }
        //     $(this).closest('.' + uneStyles.volumeInfo).removeClass(uneStyles.isShow);
        // });

        //this.refMessage.current.value = this.props.sectionData.message;
    }

    componentDidUpdate(prevProps) {
        if (this.props.sectionData.message !== prevProps.sectionData.message) {
            //this.refMessage.current.value = this.props.sectionData.message;
            this.props.sectionData.message = this.props.sectionData.message;
        }
    }

    async onProgressMission(checked) {
        if (this.props.currentSection?.length > 0 && this.props.currentSection[0].componentType === 3 && this.props.currentSection[0].isBegin) {
            return;
        }

        this.props.sectionData.status = checked ? SectionData.Status_Done : SectionData.Status_Run;
        this.setState({ allChecked: checked });
                
        await this.props.onProgressMission(checked, this.props.sectionData, 0);       
    }

    confirmSendSms = () => {
        if (this.props.currentSection?.length > 0 && this.props.currentSection[0].componentType === 3 && this.props.currentSection[0].isBegin) {
            return;
        }

        if (this.props.sectionData.receivers === null || this.props.sectionData.receivers.length === 0) {
            this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['전파할 수신자가 없습니다.'], null, null);
            return;
        }

        this.props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['메시지를 전송할까요?'], ['취소', '발송'], this.sendSms);
    }

    sendSms = (index) => {
        if (index === 1) {
            this.showConfirmDialog(true, false, false, false);
        }
    }

    showConfirmDialog = (isSMS, isEmail, isBroadcast, isSiren) => {
        if (this.props.currentSection?.length > 0 && this.props.currentSection[0].componentType === 3 && this.props.currentSection[0].isBegin) {
            return;
        }

        //if (!this.refMessage || this.refMessage.current.value.length === 0) {
        //    return;
        //}

        if (this.props.sectionData.message.length === 0) {
            this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['전파할 내용이 없습니다'], null, null);
            return;
        }

        if (!isBroadcast && this.props.sectionData.receivers === null || this.props.sectionData.receivers.length === 0) {
            this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['전파할 수신자가 없습니다.'], null, null);
            return;
        }
        else {
            let strMessage = '';
            let strSmsName = '문자';

            if (isSMS) {
                if (!this.props.commonSettings.UseSMS === 'TRUE') {
                    strMessage = strSmsName + '전파가 사용되지 않음으로 설정되어 있습니다.' + strSmsName + ' 전파를 사용함으로 설정하고 발송할까요?'
                }
                else {
                    // 상황 전파시 확인단계 거치기
                    if (this.props.commonSettings.UseConfirm === 'TRUE') {
                        strMessage = strSmsName + '메시지를 전송할까요?'
                    }
                }

                this.confirmDialogData = [isSMS, isEmail, isBroadcast, isSiren];
            }
            else if (isEmail) {
                if (!this.props.commonSettings.useEmail === 'TRUE') {
                    strMessage = '메일 전파가 사용되지 않음으로 설정되어 있습니다. 메일 전파를 사용함으로 설정하고 발송할까요?'
                }
                else {
                    // 상황 전파시 확인단계 거치기
                    if (this.props.commonSettings.useConfirm === 'TRUE') {
                        strMessage = '메일을 발송할까요?'
                    }
                }

                this.confirmDialogData = [isSMS, isEmail, isBroadcast, isSiren];
            }
            else if (isBroadcast) {
                if (!this.props.commonSettings.useEmail === 'TRUE') {
                    strMessage = '방송 전파가 사용되지 않음으로 설정되어 있습니다. 방송 전파를 사용함으로 설정하고 전파할까요?'
                }
                else {
                    // 상황 전파시 확인단계 거치기
                    if (this.props.commonSettings.useConfirm === 'TRUE') {
                        strMessage = '방송을 전파할까요?'
                    }
                }

                this.confirmDialogData = [isSMS, isEmail, isBroadcast, isSiren];
            }

            if (strMessage.length > 0) {
                this.props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, [strMessage], ['취소', '상황 전파'], this.onProgressSpread);
            }
            else {
                this.onProgressSpread(0);
            }            
        }
    }

    async SaveSetting(propertyName, propertyValue) {
        const result = await SettingsController.requestSaveSOPSetting(propertyName, propertyValue, ProjectResource.campusID);
        return result;
    }

    async onProgressSpread(index) {
        if (index === 1) {
            if (this.confirmDialogData && this.confirmDialogData.length === 4) {

                const isSMS = this.confirmDialogData[0];
                const isEmail = this.confirmDialogData[1];
                const isBroadcast = this.confirmDialogData[2];
                const isSiren = this.confirmDialogData[3];

                if (isSMS) {
                    let useSMS = this.props.commonSettings.UseSMS;
                    if (!useSMS) {
                        useSMS = await this.SaveSetting('UseSMS', 'TRUE');
                    }

                    if (!useSMS) {
                        this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['문자 전파 설정이 실패했습니다'], null, null);
                        return;
                    }
                }
                else if (isEmail) {
                    let useEmail = this.props.commonSettings.useEmail;
                    if (!useEmail) {
                        useEmail = await this.SaveSetting('UseEmail', 'TRUE');
                    }

                    if (!useEmail) {
                        this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['메일 전파 설정이 실패했습니다'], null, null);
                        return;
                    }
                }
                else if (isBroadcast) {
                    let useBroadcast = this.props.commonSettings.useBroadcast;
                    if (!useBroadcast) {
                        useBroadcast = await this.SaveSetting('UseBroadcast', 'TRUE');
                    }

                    if (!useBroadcast) {
                        this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['방송 전파 설정이 실패했습니다'], null, null);
                        return;
                    }
                }

                const dataIndex = 0; // 상황전파는 한 개 임무만 있으므로 첫번째인 0
                this.props.onProgressSpread(this.props.sectionData, dataIndex, isSMS, isEmail, isBroadcast, isSiren, this.props.sectionData.message/*this.refMessage.current.value*/);

                this.confirmDialogData = undefined;
            }
        }

        this.props.onCloseConfirmDialog();
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
            
            ui.push(<li key={"teamInfo_" + i}>{content}</li>);
        }
        return ui;
    }

    getReceiverContent(teamType, teamID) {
        let content = '';

        let teamDatas = null;
        if (teamType === 2) {
            teamDatas = this.props.teamDatas.regular;
        }

        if (!teamDatas) {
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

    onChangea(e) {
        this.refMessage.current.value = e.target.value;
        this.props.sectionData.message = e.target.value;
    }

    render() {
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
            //boxClassName = " " + uis.sectionCurrent + " " + uneStyles.currentBox + " " + uis.borderCurrent;
            boxClassName = " " + uis.sectionCurrent + " " + uis.borderCurrent;
            textClassName = " " + uis.textCurrent;
        } else if (this.props.sectionData.status === SectionData.Status_Run) {
            boxClassName = " " + uis.sectionCurrent + " " + uis.borderCurrent;
            textClassName = " " + uis.textCurrent;
        } else if (this.props.sectionData.status === SectionData.Status_Done) {
            boxClassName = " " + uis.sectionDone;
            textClassName = " " + uis.textDone;
        } else if (this.props.sectionData.status === SectionData.Status_Skip) {
            boxClassName = " " + uis.sectionRun;
            textClassName = " " + uis.textRun;
        }

        // 다음 버튼 활성화
        var btnNextClassName = uis.btnAllCheck;
        if (!this.props.sectionData.sectionNumber) {
            // sectionNumber가 null일 때
            btnNextClassName = uis.btnDisable;
        }
        else if (this.props.currentSection?.length > 0 && this.props.currentSection[0].componentType === 3 && this.props.currentSection[0].isBegin) {
            // 현재 SOP가 시작되지 않았을 때 Disable
            btnNextClassName = uis.btnDisable;
        }
        else if (this.props.sectionData.status === SectionData.Status_Done) {
            // 현재 임무가 완료된 상태라면 Disable
            btnNextClassName = uis.btnDisable;
        }

        let tagUI = [];
        if (this.props.sectionData.autoRun)
            tagUI.push(<span key='auto' className={uis.flag + " " + uis.flagAuto}>자동</span>);
        if (this.props.sectionData.isSMS)
            tagUI.push(
                <span key='sms' className={uis.flag + " " + uis.flagSms}>
                    문자
                </span>
            );
        if (this.props.sectionData.isEmail)
            tagUI.push(<span key='email' className={uis.flag + " " + uis.flagMail}>메일</span>);

        let receiverUI = this.getReceiversUI();

        return (
            <div className={uis.sectionBox + boxClassName + " " + uneStyles.sectionBox} id={this.props.id}>
                <div className={uis.tit + " " + uis.clfix + textClassName}>
                    <strong>{this.props.sectionData.sectionNumber}.{this.props.sectionData.text}
                        {tagUI}
                    </strong>
                    <div className={uis.btnArea + " " + uneStyles.btnArea}>
                        <a className={btnNextClassName} onClick={this.runSection}>다음</a>
                    </div>
                    <div className={uneStyles.completionStatuss}>{(this.state.allChecked) ? '완료' : '미완료' }</div>
                </div>
                <div className={uis.sendMessage + " " + uneStyles.sendMessage}>
                    {
                        // (this.props.sectionData.isBroadcast)
                        //     ? <div className={uis.send}>
                        //         {
                        //             /* <div className={uis.soundInfo}>
                        //                     <button type="button" className={"btnSoundToggle"}><i className={uis.iconSound}></i></button>
                        //                     <ul className={uis.soundInfoList}>
                        //                         <li><button type="button" data-value="Y">Sound On</button></li>
                        //                         <li><button type="button" data-value="N">Sound Off</button></li>
                        //                     </ul>
                        //                 </div>*/
                        //         }
                        //     </div>
                        //     : <></>
                    }
                    {/*<div className={uis.message}><button type="button" onClick={() => this.onProgressSpread(true, false, false, false)}><i className={uis.iconMessage}></i></button></div>*/}
                    <div className={uis.check}>
                        <span className={uis.checkBox}>
                            <input type="checkbox" checked={this.state.allChecked} onChange={(e) => this.onProgressMission(e.target.checked)}/>
                        </span>
                    </div>
                    {
                        (this.props.sectionData.isSMS) ?
                            <div><button type="button" onClick={() => this.confirmSendSms()/*this.confirmSendSms(true, false, false, false)*/}><i className={uneStyles.message}></i></button></div>
                            : <></>
                    }
                    {
                        (this.props.sectionData.isEmail) ?
                            <div><button type="button" onClick={() => this.showConfirmDialog(false, true, false, false)}><i className={uneStyles.email}></i></button></div>
                            : <></>
                    }
                    {/*<div className={uneStyles.mic}><button type="button"></button></div>*/}
                    {/**********************************************************************/}
                    {
                        // (this.props.sectionData.isBroadcast) ?
                        //     <>
                        //         <div className={uneStyles.micInfo}>
                        //             <button type="button" className={"btnMicToggle"}><i className={uneStyles.mic}></i></button>
                        //             <ul className={uneStyles.micInfoList}>
                        //                 {/**********************************************************/}
                        //                 <li><button type="button" id={uneStyles.micInfoOn} data-value="Y">Mic On</button></li>
                        //                 <li><button type="button" id={uneStyles.micInfoOff} data-value="N">Mic Off</button></li>
                        //             </ul>
                        //         </div>
                        //         <div className={uneStyles.volumeInfo}>
                        //             <button type="button" className={"btnVolumeToggle"}><i className={uneStyles.volume}></i></button>
                        //             <ul className={uneStyles.volumeInfoList}>
                        //                 <li><button type="button" id={uneStyles.volumeInfoOn} data-value="Y">Volume On</button></li>
                        //                 <li><button type="button" id={uneStyles.volumeInfoOff} data-value="N">Volume Off</button></li>
                        //             </ul>
                        //         </div>
                        //     </>
                        //     : <></>
                    }
                    {/*<p className={uneStyles.completionStatus}>완료</p>*/}
                </div>
                <dl className={uis.taskDetail + " " + uis.taskSubSection}>
                    <div className={uis.taskSub}>
                        <dt style={{ backgroundColor: '#0D121A', fontSize: '14px', padding: '0 10px' }}>전파메시지</dt>
                        <textarea /*ref={this.refMessage}*/ className={uis.taskMessage + " " + uis.scrollbar} defaultValue={this.props.sectionData.message} onChange={(e) => this.onChangea(e)} />
                    </div>
                    <div className={uis.taskSub + " " + uis.taskSubList}>
                        <dt style={{ backgroundColor: '#0D121A', fontSize: '14px', padding: '0 10px' }}>전파 대상자</dt>
                        <dd className={uis.scrollbar}>
                            <ul className={uis.clfix}>
                                {receiverUI}
                            </ul>
                        </dd>
                    </div>
                </dl>
            </div>
        );
    }
}

export default Internal;