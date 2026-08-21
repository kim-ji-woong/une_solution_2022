import React, { Component, useState } from 'react';
import $ from 'jquery';
import SDMSResource from '../../resource/id';
import PopupDraggable from './popupDraggable';
import SettingsStore from '../../../Settings/settingsStore';
import SDMS from '../sdms';

import { SafetyAreaAssessmentComponent, EditReceiverComponent, EvaluationTableComponent, SmsSettingComponent, GridSettingComponent } from '../../styled/sdmsPopupsStyled';
import { ModalBackground } from '../../../Root/styled/variables';

import { SelectReceiverComponent } from '../../../Settings/styled/settingsStyled';
import { ConfirmDialogComponent } from '../../../Common/styled/confirmDialogStyled';

import safetyArea_minus_icon from '../../img/popup/safetyArea_minus_icon.png';
// import { fa } from '@faker-js/faker';
import { AssessmentController } from '../../services/assessmentController';
import { TeamEditController } from '../../../TeamEditor/services/teamEditController';
import ProjectResource from '../../../Root/resource/id';
import AccountResource from '../../../Account/resource/id';
import { i18n, withTranslation } from '../../../language/i18n';

import imgCloseWonik from '../../../Common/img/sub/dashboard_layer_close.png';

class SafetyAreaAssessment extends Component {
    // 알림팝업 종류
    static dialogType = { none: '', list: '불러오기', receiver: '수신자', save: '저장', saveAs: '다른이름저장' };

    constructor(props) {
        super(props);

        this.areaInput = React.createRef();

        this.refClassA_Start = React.createRef();
        this.refClassA_End = React.createRef();
        this.refClassB_Start = React.createRef();
        this.refClassB_End = React.createRef();
        this.refClassC_Start = React.createRef();
        this.refClassC_End = React.createRef();

        this.state = {
            // 알림 팝업
            dialog: {
                type: SafetyAreaAssessment.dialogType.none,
                visible: false
            },
            userID: -1,
            searchEqZoneText: '',
            showEqZoneDropDown: false, // equipmentZone list drop down 리스트 보여줄지 여부
            eqZoneDatas: [], // 현재 3D에 있는 equipmentZone list
            searchEqZoneDatas: [], // 검색어와 일치하는 equipmentZone list
            selectedEqZone: null,

            q: null,
            qItems: [],

            teamDatas: [],
            members: [],
            selectedMembers: [],
        };

        this.addQID = -1;
        this.chkEqZoneID = null;
        this.isSending = false;

        this.type = null;

        this.getEquipZoneQItems(null, SDMSResource.assessmentType.currentJob);
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
        
        this.unsubscribe_SettingsStore = SettingsStore.subscribe(function () {
            let data = SettingsStore.getState();

            if (data?.actionType === 'RESET_POPUP') {
                this.repositionPopup(data.popupState);
            }
        }.bind(this));

        this.init();

    }


    componentDidUpdate(prevProps, prevState) {        
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
        }

        if (this.props.currentView !== prevProps.currentView) {
            if (/*this.props.currentView.buildingID === null || */this.props.currentView.zoneID === null) {
                return;
            }

            const eqZoneDatas = this.getEqZoneDatas();
            this.setState({ eqZoneDatas, searchEqZoneText: '', showEqZoneDropDown: false, searchEqZoneDatas: [], selectedEqZone: null });
        }
    }

    componentWillUnmount() {
		
	}

    async init() {
        const userInfo = await ProjectResource.initUserInfo();
        if (!userInfo) {
            return;
        }

        let currentSiteID = this.props.currentSiteID;
        if (userInfo.levelID === AccountResource.accountLevelID.master) {
            currentSiteID = null;
        }

        const teamDatas = await TeamEditController.DisplayRegular(currentSiteID);
        // 설정된 멤버 정보는 다 불러옴
        //const members = await TeamEditController.DisplayRegularMember(currentSiteID);
        const members = await TeamEditController.DisplayRegularMember(null);

        const basicRegular = await TeamEditController.DisplayBasicRegular(null);

        if (basicRegular?.length > 0) {
            for (let i = 0; i < members.length; i++) {
                let member = members[i];

                const team = basicRegular.find(x => x.id === member.RegularID);
                if (team) {
                    member.TeamName = team.teamName;
                }
            }
        }

        const eqZoneDatas = this.getEqZoneDatas();
        this.setState({ teamDatas, members, eqZoneDatas, userID: userInfo.id });
    }

    getEqZoneDatas() {
        if (!this.props.buildingGroupList) {
            return;
        }

        const length = this.props.buildingGroupList.length;
        for (let i = 0; i < length; i++) {
            const buildingGroup = this.props.buildingGroupList[i];
            if (!buildingGroup.buildingDatas) {
                continue;
            }

            const buildingLength = buildingGroup.buildingDatas.length;
            for (let j = 0; j < buildingLength; j++) {
                const building = buildingGroup.buildingDatas[j];
                if (building.id !== this.props.currentView.buildingID) {
                    continue;
                }

                if (!building.zoneDatas) {
                    continue;
                }

                const zoneLength = building.zoneDatas.length;
                for (let k = 0; k < zoneLength; k++) {
                    const zone = building.zoneDatas[k];
                    if (zone.id !== this.props.currentView.zoneID) {
                        continue;
                    }

                    return zone.equipmentZoneDatas;
                }
            }
        }

        const outdoorZones = this.props.outdoorZones;

        for (let zoneID in outdoorZones) {
            zoneID = Number(zoneID);

            if (zoneID !== NaN && zoneID !== 30000) {
                const outdoorZone = outdoorZones[zoneID];

                if (outdoorZone.equipZones?.length > 0) {
                    const equipZoneDatas = [];

                    for (let equipZoneID in outdoorZone.equipZones) {
                        const equipZone = outdoorZone.equipZones[equipZoneID];
                        
                        if (equipZone[0] && equipZone[1]) {
                            let equipZoneData = {};
                            equipZoneData.id = equipZone[0];
                            equipZoneData.displayText = equipZone[1];

                            equipZoneDatas.push(equipZoneData);
                        }                        
                    }

                    return equipZoneDatas;
                }                    
            }                
        }

        return [];
    }

    repositionPopup(popupState) {
        let data = popupState.safetyAreaAssessment;

        if (data === null || data === undefined)
            return;

        let popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return;

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
    }

    onShowPopup = (type, show) => {
        if(type === undefined) {
            return;
        }

        const p = { ...this.state.dialog }
        p.visible = show;
        p.type = type;
        this.setState({ dialog: p })
    }

    onClickInit = () => {
        //this.addQID = -1;
        //this.setState({ q: null, qItems: [] });

        // 해당 타입 및 관리 구역에 해당하는 리스트 불러오기
        this.getEquipZoneQItems(null, this.type);
    }

    // 항목 작성 input 추가
    onAddQItem = () => {
        const { q, qItems } = this.state;

        this.addQID--;

        const newQItem = {
            id: this.addQID,
            qid: q === null ? -1 : q.id,
            contents: ''
        };

        qItems.push(newQItem);

        this.setState({ qItems });
    };

    // 항목 작성 input 삭제
    onDeleteQItem = (qItemID) => {
        const { qItems } = this.state;
        if (!qItems || qItems.length === 0) {
            return;
        }

        this.setState({ qItems: qItems.filter((item) => item.id !== qItemID) });
    };

    // 항목 input 수정
    onChangeQItem = (e, id) => {
        const { q, qItems } = this.state;
        
        const { value } = e.target;

        const length = qItems.length;
        if (length === 0) {
            qItems.push({
                id: id,
                qid: q === null ? -1 : q.id,
                contents: value
            });
        }
        else {
            for (let i = 0; i < length; i++) {
                const qItem = qItems[i];
                if (qItem.id === id) {
                    qItem.contents = value;
                    break;
                }
            }
        }
        
        this.setState({ qItems });
    }

    // 관리구역 input 클릭 시 dropdown list show
    showDropDownList = (e) => {
        e.stopPropagation();
        this.setState({
            showEqZoneDropDown: true
        });
    };

    // 관리구역 리스트 선택 시
    clickDropDownItem = (item) => {
        this.setState({
            selectedEqZone: item,
            searchEqZoneText: item.displayText,
            showEqZoneDropDown: false
        });

        this.getEquipZoneQItems(item?.id, this.type);
    };

    // 관리구역 input 사용자 입력 핸들러
    onChangeEqZone = (e) => {
        const { value } = e.target;
        const eqZoneDatas = this.state.eqZoneDatas;

        // 검색어에 따라 드롭다운 리스트 필터링
        const searchDatas = eqZoneDatas.filter((item) => {
            return item.displayText.toLocaleLowerCase().replace(" ","").includes(value.toLocaleLowerCase().replace(" ",""));
        })

        this.setState({
            selectedEqZone: null,
            searchEqZoneDatas: searchDatas,
            searchEqZoneText: value
        })
    };

    setPopupState = (popup, state) => {
        this.props.setPopupState(SDMSResource.popupLayer.safetyAreaAssessment, state);
    }

    onClickSave = () => {
        this.setState({ dialog: true })
    }

    getPopupUI = () => {
        if (this.state.dialog && this.state.dialog.visible) {
            if (this.state.dialog.type === SafetyAreaAssessment.dialogType.save) {
                return <SafetyConfirmDialog
                    title={i18n.t('common.저장')}
                    messages={[i18n.t('sdms.safetyAreaAssessment.항목명을 입력하세요')]}
                    inputItem={true} // 항목명 text input 필요할 경우 true
                    buttons={[i18n.t('common.취소'), i18n.t('common.저장')]}
                    onClosePopup={this.onShowPopup}
                    onClickButton={null}
                    type={SafetyAreaAssessment.dialogType.save}
                    onSave={this.onSave}                    
                />
            } else if (this.state.dialog.type === SafetyAreaAssessment.dialogType.saveAs) {
                return <SafetyConfirmDialog
                    title={i18n.t('common.다른 이름으로 저장')}
                    messages={[i18n.t('sdms.safetyAreaAssessment.항목명을 입력하세요')]}
                    inputItem={true} // 항목명 text input 필요할 경우 true
                    buttons={[i18n.t('common.취소'), i18n.t('common.저장')]}
                    onClosePopup={this.onShowPopup}
                    onClickButton={null}
                    type={SafetyAreaAssessment.dialogType.saveAs}
                    onSave={this.onSave}
                    selectedQ={this.state.q}
                />
            } else if (this.state.dialog.type === SafetyAreaAssessment.dialogType.list) {
                return <LoadSafetyList
                    onBringIn={this.onBringIn}
                    onClosePopup={this.onShowPopup}
                    showConfirmDialog={this.props.showConfirmDialog}
                    closeConfirmDialog={this.props.closeConfirmDialog}
                    buildingGroupList={this.props.buildingGroupList}
                    members={this.state.members}
                    teamDatas={this.state.teamDatas}
                    currentSiteID={this.props.currentSiteID}
                    outdoorZones={this.props.outdoorZones}
                    site3dOptions={this.props.site3dOptions}
                />
            } else if (this.state.dialog.type === SafetyAreaAssessment.dialogType.receiver) {
                return <EditReceiver
                    onClosePopup={this.onShowPopup}
                    teamDatas={this.state.teamDatas}
                    members={this.state.members}
                    selectedMembers={this.state.selectedMembers}
                    currentSiteID={this.props.currentSiteID}
                    onSelectReceiver={this.onSelectReceiver}
                />
            }
        }

        return <></>;
    }

    onBringIn = (q, qItems) => {
        this.addQID = -1;

        const p = { ...this.state.dialog }
        p.visible = false;
        p.type = SafetyAreaAssessment.dialogType.none;

        this.setState({ q, qItems, dialog: p });
    }

    // 수신자 선택
    onSelectReceiver = (selectedMembers) => {
        if (this.state.selectedMembers !== selectedMembers) {

            const p = { ...this.state.dialog }
            p.visible = false;
            p.type = SafetyAreaAssessment.dialogType.none;

            this.setState({ selectedMembers, dialog: p });
        }
    }

    onSaveDialog = (type) => {
        if (type === SafetyAreaAssessment.dialogType.saveAs) {
            // 저장 안되어 있는 항목은 다른이름으로 저장할 수 없음
            if (this.state.q === null) {
                this.onShowPopup(SafetyAreaAssessment.dialogType.save, true);
            } else {
                this.onShowPopup(SafetyAreaAssessment.dialogType.saveAs, true);
            }
        }
        else if (type === SafetyAreaAssessment.dialogType.save) {
            if (this.state.q === null) {
                this.onShowPopup(SafetyAreaAssessment.dialogType.save, true)
            }
            else {
                this.onSave(this.state.q.id, this.state.q.title);
            }
        }
    }

    onSave = async () => {
        // 관리구역 체크 
        // NULL 경우 공통 항목 
        if (!this.state.selectedEqZone) {
            this.props.showConfirmDialog(i18n.t('sdms.safetyAreaAssessment.보내기'), [i18n.t('sdms.safetyAreaAssessment.관리구역을 선택하세요')], [i18n.t('common.확인')], null);
            return;
        }

        // 항목 체크
        if (!this.state.qItems || this.state.qItems.length === 0) {
            this.props.showConfirmDialog(i18n.t('sdms.safetyAreaAssessment.보내기'), [i18n.t('sdms.safetyAreaAssessment.평가 항목을 입력하세요')], [i18n.t('common.확인')], null);
            return;
        }

        let selectedEqZone = this.state.selectedEqZone;
        let eqZoneID = null;
        if (selectedEqZone)
            eqZoneID = selectedEqZone.id;

        let receiverMemberIDs = null;
        if (this.state.selectedMembers?.length > 0) {
            //receiverMemberIDs = this.state.selectedMembers.map(row => row.ID);
            for (let i = 0; i < this.state.selectedMembers.length; i++) {
                const member = this.state.selectedMembers[i];
                if (member.ID) {
                    if (receiverMemberIDs === null)
                        receiverMemberIDs = member.ID.toString();
                    else
                        receiverMemberIDs += "," + member.ID;
                }
            }
        }

        let qID = this.state.q ? this.state.q.id : -1;
        // let qItems = this.state.qItems;

        const [suc, saveID, message] = await AssessmentController.SaveQ(qID, eqZoneID, receiverMemberIDs, this.state.qItems, this.type);
        if (suc) {
            this.props.showConfirmDialog(i18n.t('common.저장'), [i18n.t('msg.저장되었습니다')], [i18n.t('common.확인')], null);
            const [suc2, result] = await AssessmentController.LoadQItem(saveID);
            if (suc2) {
                const q = {
                    id: saveID
                }

                const p = { ...this.state.dialog }
                p.visible = false;
                p.type = SafetyAreaAssessment.dialogType.none;

                this.setState({ q, qItems: result, dialog: p });
            }
        } else {
            this.props.showConfirmDialog(i18n.t('common.오류'), [message], [i18n.t('common.확인')], null);
        }
    }

    onSend = async () => {
        if (this.isSending)
            return;

        this.isSending = true;

        if (!this.state.selectedMembers || this.state.selectedMembers.length === 0) {
            this.props.showConfirmDialog(i18n.t('sdms.safetyAreaAssessment.보내기'), [i18n.t('sdms.safetyAreaAssessment.수신자를 선택하세요')], [i18n.t('common.확인')], null);
            this.isSending = false;
            return;
        }

        if (!this.state.selectedEqZone) {
            this.props.showConfirmDialog(i18n.t('sdms.safetyAreaAssessment.보내기'), [i18n.t('sdms.safetyAreaAssessment.관리구역을 선택하세요')], [i18n.t('common.확인')], null);
            this.isSending = false;
            return;
        }

        if (!this.state.qItems || this.state.qItems.length === 0) {
            this.props.showConfirmDialog(i18n.t('sdms.safetyAreaAssessment.보내기'), [i18n.t('sdms.safetyAreaAssessment.평가 항목을 입력하세요')], [i18n.t('common.확인')], null);
            this.isSending = false;
            return;
        }

        const eqZoneID = this.state.selectedEqZone.id;
        const receiverMemberIDs = this.state.selectedMembers.map(row => row.ID);
        const title = this.state.q ? this.state.q.title : '-';
        const contents = this.state.qItems.map(row => row.contents);
        const userID = this.state.userID;
        
        const [suc, message] = await AssessmentController.SendEmail(eqZoneID, receiverMemberIDs, title, contents, userID, this.type);
        if (!suc) {
            this.props.showConfirmDialog(i18n.t('common.오류'), [message], [i18n.t('common.확인')], null);
        } else {
            this.props.showConfirmDialog(i18n.t('sdms.safetyAreaAssessment.보내기'), [receiverMemberIDs.length + i18n.t('sdms.safetyAreaAssessment.명에게 평가 메일을 전송했습니다')], [i18n.t('common.확인')], null);
        }

        this.isSending = false;
    }

    async getEquipZoneQItems(eqZoneID, type) {
        if (eqZoneID === undefined)
            eqZoneID = null;

        // 선택된 구역이 기존 선택된 구역과 다를 경우
        if (eqZoneID !== this.chkEqZoneID || type !== this.type) {
            this.chkEqZoneID = eqZoneID;
            this.type = type;

            let memberIDs = null;
            let qItems = [];

            const selectedMembers = [];

            let result = await AssessmentController.LoadEquipZoneQItem(eqZoneID, type);
            if (result[0] === true && result[2]?.length > 0) {
                memberIDs = result[1]?.memberIDs;
                qItems = result[2];
            }            
            else if (eqZoneID !== null) {
                // 공통 항목 불러오기
                result = await AssessmentController.LoadEquipZoneQItem(null, type);
                if (result[0] === true && result[2]?.length > 0) {
                    memberIDs = result[1]?.memberIDs;
                    qItems = result[2];
                }                
            }

            // 기본 템플릿
            if (qItems.length === 0) {
                if (type === SDMSResource.assessmentType.eqZone) {
                    let item = { id: this.addQID, qid: this.addQID, contents: "해당 구역 기계, 기구 또는 설비 폐수 & 폐액 누출" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "해당 구역 폐기물 분리 배출 상태 확인" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "방재 물품함 관리 " };
                    qItems.push(item);
                    this.addQID--;

                    item = { id: this.addQID, qid: this.addQID, contents: "피난 및 소방시설에 대한 적정 정리" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "방화문, 방화셔터 적정 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "경보설비의 적정 출력 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "소방설비의 적정관리 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "위험물 적정 보관 관리 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "화재 위험 관리 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "가스 사용구간 " };
                    qItems.push(item);
                    this.addQID--;

                    item = { id: this.addQID, qid: this.addQID, contents: "해당 구역 기계, 기구 또는 설비 점검 및 이상 유무 (방호장치 포함)" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "소속 근로자 적정 보호구 착용 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "작업장 정리정돈 및 통로 확보 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "보호구함 및 의약품 점검 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "안전교육계획 수립에 따른 실시 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "화학물질 취급시 MSDS 관리" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "작업 표준 준수 여부" };
                    qItems.push(item);
                    this.addQID--;
                }
                else if (type === SDMSResource.assessmentType.environ) {
                    let item = { id: this.addQID, qid: this.addQID, contents: "안전감시단 위반진단 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "안전사고 발생여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "팀별 훈련 진행여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "유해화학물질 사용구역 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "가스 사용구역 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "종합방재실 위반진단 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "소방설비 정상 작동 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "가스설비 정상 작동 여부" };
                    qItems.push(item);
                    this.addQID--;
                }
                else if (type === SDMSResource.assessmentType.currentJob) {
                    let item = { id: this.addQID, qid: this.addQID, contents: "해당 구역 기계, 기구 또는 설비 폐수 & 폐액 누출" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "해당 구역 폐기물 분리 배출 상태 확인" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "작업 표준 준수 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "해당 구역 기계, 기구 또는 설비 점검 및 이상 유무 (방호장치 포함)" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "작업장 정리정돈 및 통로 확보 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "일반 방송설비의 적정 출력 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "전기장치 적정 관리 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "피난 표식 및 소방시설에 대한 적정 정리" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "가스설비 점검 및 이력 관리 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "보호구함 및 의약품 점검 여부" };
                    qItems.push(item);
                    this.addQID--;
                }
                else if (type === SDMSResource.assessmentType.safety) {
                    let item = { id: this.addQID, qid: this.addQID, contents: "소속 근로자 적정 보호구 착용 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "해당 구역 기계, 기구 또는 설비 점검 및 이상 유무 (방호장치 포함)" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "안전보건표지 및 MSDS 관리" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "팀별 훈련 또는 교육 진행여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "안전교육계획 수립에 따른 실시 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "안전사고 발생 후 개선조치 이행 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "안전감시단, 종합방재실 위반진단 여부" };
                    qItems.push(item);
                    this.addQID--;
                }
                else if (type === SDMSResource.assessmentType.prevention) {
                    let item = { id: this.addQID, qid: this.addQID, contents: "화재 발생 위험요소 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "방화문, 방화셔터 적정 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "소방설비의 적정관리 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "위험물 적정 보관 관리 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "환기설비 적정 가동여부 & 작업구역 준수 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "정전 발생 여부" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "방재 물품함 관리" };
                    qItems.push(item);
                    this.addQID--;
                    item = { id: this.addQID, qid: this.addQID, contents: "자연재해 예방조치" };
                    qItems.push(item);
                    this.addQID--;
                }
            }

            if (memberIDs) {
                const arrIDs = memberIDs.split(",");
                const members = this.state.members;

                for (let j = 0; j < arrIDs?.length; j++) {
                    const id = arrIDs[j];

                    for (let i = 0; i < members?.length; i++) {
                        const member = members[i];
                        if (member.ID.toString() === id) {
                            selectedMembers.push(member);
                            break;
                        }
                    }
                }
            }            

            this.setState({ qItems, selectedMembers });
        }
    }

    getQItemsUI() {       
        let ui = <React.Fragment></React.Fragment>;
        let qItemUI1 = [];
        let qItemUI2 = [];
        let qItemUI3 = [];

        const length = this.state.qItems.length;
        for (let i = 0; i < length; i++) {
            const qItem = this.state.qItems[i];

            // 대분류/소분류 타이틀 UI 관련 부분 (항목 작성)
            if (this.type === SDMSResource.assessmentType.eqZone) {
                if (i < 3) {
                    qItemUI1.push(
                        <li key={'qItem_li_' + qItem.id}>
                            <label htmlFor={'qItem_lbl_' + qItem.id}>{i + 1}</label>
                            <input
                                type='text'
                                name={'qItem_txt_' + qItem.id}
                                value={qItem.contents}
                                id={'item' + qItem.id}
                                placeholder={i18n.t('sdms.safetyAreaAssessment.항목명을 입력하세요')}
                                autoComplete='off'
                                onChange={(e) => this.onChangeQItem(e, qItem.id)}
                            />
                        </li>
                    );
                }
                else if (i < 10) {
                    qItemUI2.push(
                        <li key={'qItem_li_' + qItem.id}>
                            <label htmlFor={'qItem_lbl_' + qItem.id}>{i + 1}</label>
                            <input
                                type='text'
                                name={'qItem_txt_' + qItem.id}
                                value={qItem.contents}
                                id={'item' + qItem.id}
                                placeholder={i18n.t('sdms.safetyAreaAssessment.항목명을 입력하세요')}
                                autoComplete='off'
                                onChange={(e) => this.onChangeQItem(e, qItem.id)}
                            />
                        </li>
                    );
                }
                else {
                    qItemUI3.push(
                        <li key={'qItem_li_' + qItem.id}>
                            <label htmlFor={'qItem_lbl_' + qItem.id}>{i + 1}</label>
                            <input
                                type='text'
                                name={'qItem_txt_' + qItem.id}
                                value={qItem.contents}
                                id={'item' + qItem.id}
                                placeholder={i18n.t('sdms.safetyAreaAssessment.항목명을 입력하세요')}
                                autoComplete='off'
                                onChange={(e) => this.onChangeQItem(e, qItem.id)}
                            />
                        </li>
                    );
                }
            }
            else {
                qItemUI1.push(
                    <li key={'qItem_li_' + qItem.id}>
                        <label htmlFor={'qItem_lbl_' + qItem.id}>{i + 1}</label>
                        <input
                            type='text'
                            name={'qItem_txt_' + qItem.id}
                            value={qItem.contents}
                            id={'item' + qItem.id}
                            placeholder={i18n.t('sdms.safetyAreaAssessment.항목명을 입력하세요')}
                            autoComplete='off'
                            onChange={(e) => this.onChangeQItem(e, qItem.id)}
                        />
                    </li>
                );
            }
        }

        if (this.type === SDMSResource.assessmentType.eqZone) {
            ui = (
                <React.Fragment>
                    <div className={'zoneUIBox'}>
                        <span className={'zoneUITitle'}><span className={'squareBox'}></span>공통 항목</span>
                        <span className={'subUITitle'}><p>환경</p></span>
                        <span className={'subUIContents'}>
                            {qItemUI1}
                        </span>
                        <span className={'subUITitle'}><p>방재</p></span>
                        <span className={'subUIContents'}>
                            {qItemUI2}
                        </span>
                        <span className={'subUITitle'}><p>안전보건</p></span>
                        <span className={'subUIContents'}>
                            {qItemUI3}
                        </span>
                    </div>
                </React.Fragment>
            );
        }
        else if (this.type === SDMSResource.assessmentType.environ) {
            ui = (
                <React.Fragment>
                    <div className={'zoneUIBox'}>
                        <span className={'zoneUITitle'}><span className={'squareBox'}></span>안전환경평가 항목</span>
                        <span className={'subUITitle'}><p>안전환경</p></span>
                        <span className={'subUIContents'}>
                            {qItemUI1}
                        </span>
                    </div>
                </React.Fragment>
            );
        }
        else if (this.type === SDMSResource.assessmentType.currentJob) {
            ui = (
                <React.Fragment>
                    <div className={'zoneUIBox'}>
                        <span className={'zoneUITitle'}><span className={'squareBox'}></span>현업평가 항목</span>
                        <span className={'subUITitle'}><p>현업</p></span>
                        <span className={'subUIContents'}>
                            {qItemUI1}
                        </span>
                    </div>
                </React.Fragment>
            );
        }
        else if (this.type === SDMSResource.assessmentType.safety) {
            ui = (
                <React.Fragment>
                    <div className={'zoneUIBox'}>
                        <span className={'zoneUITitle'}><span className={'squareBox'}></span>안전/보건평가 항목</span>
                        <span className={'subUITitle'}><p>안전/보건</p></span>
                        <span className={'subUIContents'}>
                            {qItemUI1}
                        </span>
                    </div>
                </React.Fragment>
            );
        }
        else if (this.type === SDMSResource.assessmentType.prevention) {
            ui = (
                <React.Fragment>
                    <div className={'zoneUIBox'}>
                        <span className={'zoneUITitle'}><span className={'squareBox'}></span>방재/환경평가 항목</span>
                        <span className={'subUITitle'}><p>방재/환경</p></span>
                        <span className={'subUIContents'}>
                            {qItemUI1}
                        </span>
                    </div>
                </React.Fragment>
            );
        }
       
        return ui;
    }

    getReceiverTextUI = () => {
        const members = this.state.selectedMembers;
        if (!members || members.length === 0) {
            return '';
        }

        let text = '';

        const length = members.length;
        for (let i = 0; i < length; i++) {
            if (text.length === 0) {
                text = members[i].MemberName
            }
            else {
                text += ',' + members[i].MemberName
            }
        }

        return text;
    }

    onBlurCheck = () => {
        const eqZoneDatas = this.state.eqZoneDatas;
        const value = this.areaInput.current.value;

        let item = null;

        for (let i = 0; i < eqZoneDatas?.length; i++) {
            const data = eqZoneDatas[i];

            if (data.displayText === value) {
                item = data;
                break;
            }
        }

        if (item === null) {
            this.state.searchEqZoneText = "";
            this.state.searchEqZoneDatas = [];

            this.state.selectedEqZone = null;
            this.getEquipZoneQItems(null, this.type);
        }
        else {
            this.state.selectedEqZone = item;
            this.getEquipZoneQItems(item?.id, this.type);
        }

        this.setState({ showEqZoneDropDown: false });
    }

    handleKeyPress = (e) => {
        if (e.key === "Enter" || e.key === 'Escape') {
            e.target.blur();
            this.onBlurCheck();
        }
    }

    onClickGradePop = async () => {
        const element = document.getElementById('gradeSetPopupBox');
        const elementBtn = document.getElementById('gradeBtn');

        if (!element || !elementBtn)
            return;


        await this.LoadAssessment();
        

        element.classList.toggle('on');
        elementBtn.classList.toggle('on');
    }

    LoadAssessment = async () => {
        // 등급기준 불러오기
        let currentSiteID = parseInt(this.props.currentSiteID);
        if (currentSiteID === NaN) {
            currentSiteID = null;
        }

        const [assessmentClasses /*, message*/] = await AssessmentController.LoadAssessmentClass(currentSiteID);
        // 등급기준 적용하기
        if (assessmentClasses?.length > 0) {
            for (let i = 0; i < assessmentClasses.length; i++) {
                const assessmentClass = assessmentClasses[i];

                if (assessmentClass.className === SDMSResource.AssessmentClass.A) {
                    this.refClassA_Start.current.value = assessmentClass.startScore;
                    this.refClassA_End.current.value = assessmentClass.endScore;
                } else if (assessmentClass.className === SDMSResource.AssessmentClass.B) {
                    this.refClassB_Start.current.value = assessmentClass.startScore;
                    this.refClassB_End.current.value = assessmentClass.endScore;
                } else if (assessmentClass.className === SDMSResource.AssessmentClass.C) {
                    this.refClassC_Start.current.value = assessmentClass.startScore;
                    this.refClassC_End.current.value = assessmentClass.endScore;
                }
            }
        } else {
            this.refClassA_Start.current.value = 0;
            this.refClassA_End.current.value = 0;
            this.refClassB_Start.current.value = 0;
            this.refClassB_End.current.value = 0;
            this.refClassC_Start.current.value = 0;
            this.refClassC_End.current.value = 0;
        }
    }

    onClickInput = (targetClass) => {
        const elementClassA = document.getElementsByClassName('gradeClassA');
        const elementClassB = document.getElementsByClassName('gradeClassB');
        const elementClassC = document.getElementsByClassName('gradeClassC');    

        for (let i = 0; i < elementClassA?.length; i++) {
            const element = elementClassA[i];
            element.classList.remove('on');
        }
        for (let i = 0; i < elementClassB?.length; i++) {
            const element = elementClassB[i];
            element.classList.remove('on');
        }
        for (let i = 0; i < elementClassC?.length; i++) {
            const element = elementClassC[i];
            element.classList.remove('on');
        }

        const elementClass = document.getElementsByClassName(targetClass);

        for (let i = 0; i < elementClass?.length; i++) {
            const element = elementClass[i];
            element.classList.add('on');
        }
    }

    getEqZoneSensorList = () => {
        let eqZoneSensorList = [];

        const sensorList = this.props.sensorList;
        const selectedEqZone = this.state.selectedEqZone;

        if (!selectedEqZone || !sensorList)
            return eqZoneSensorList;

        // .TODO: 환경,제조 설비 추가

        const fireSensors = sensorList?.fireSensors;
        const psmSensors = sensorList?.psmSensors;

        for (let i = 0; i < fireSensors?.length; i++) {
            const fireSensor = fireSensors[i];

            if (selectedEqZone.id === fireSensor.equipZoneID) {
                eqZoneSensorList.push(<tr key={"eqZone_fire_" + fireSensor.id}>
                    <td>화재센서</td>
                    <td>{fireSensor.name}</td>
                </tr>);
            }
        }

        for (let i = 0; i < psmSensors?.length; i++) {
            const psmSensor = psmSensors[i];

            if (selectedEqZone.id === psmSensor.equipZoneID) {
                eqZoneSensorList.push(<tr key={"eqZone_psm_" + psmSensor.id}>
                    <td>가스센서</td>
                    <td>{psmSensor.name}</td>
                </tr>);
            }
        }

        return eqZoneSensorList;        
    }

    onClickCancleGrade = () => {
        const element = document.getElementById('gradeSetPopupBox');
        const elementBtn = document.getElementById('gradeBtn');

        if (!element || !elementBtn)
            return;

        element.classList.remove('on');
        elementBtn.classList.remove('on');
    }

    onClickSaveGrade = async () => {
        let classA_Start = this.refClassA_Start.current.value;
        classA_Start = parseInt(classA_Start);
        let classA_End = this.refClassA_End.current.value;
        classA_End = parseInt(classA_End);
        let classB_Start = this.refClassB_Start.current.value;
        classB_Start = parseInt(classB_Start);
        let classB_End = this.refClassB_End.current.value;
        classB_End = parseInt(classB_End);
        let classC_Start = this.refClassC_Start.current.value;
        classC_Start = parseInt(classC_Start);
        let classC_End = this.refClassC_End.current.value;
        classC_End = parseInt(classC_End);

        if ((!classA_Start && classA_Start !== 0) || (!classA_End && classA_End !== 0) ||
            (!classB_Start && classB_Start !== 0) || (!classB_End && classB_End !== 0) ||
            (!classC_Start && classC_Start !== 0) || (!classC_End && classC_End !== 0)) {
            // 확인 팝업
            this.props.showConfirmDialog(i18n.t('common.확인'), [i18n.t('sdms.safetyAreaAssessment.기준 값을 모두 넣어주세요')], null, null);
            return;
        }

        let currentSiteID = parseInt(this.props.currentSiteID);
        if (currentSiteID === NaN) {
            currentSiteID = null;
        }

        const data = {};
        data.SiteID = currentSiteID;
        data.ClassA_Start = classA_Start;
        data.ClassA_End = classA_End;
        data.ClassB_Start = classB_Start;
        data.ClassB_End = classB_End;
        data.ClassC_Start = classC_Start;
        data.ClassC_End = classC_End;
        data.ClassD_Start = null;
        data.ClassD_End = null;
        data.ClassE_Start = null;
        data.ClassE_End = null;

        const [success, message] = await AssessmentController.SaveAssessmentClass(data);
        if (success !== true) {
            this.props.showConfirmDialog(i18n.t('common.오류'), [i18n.t('sdms.safetyAreaAssessment.기준 값 저장 실패하였습니다') + " (" + message + ")"], null, null);
        }

        this.onClickCancleGrade();
    }

    onChangeKey = (e) => {
        const target = e.target;
        if (!target)
            return;

        let value = target.value;
        value = value.replace(/[^0-9]/g, '');

        target.value = value;
    }

    onClickRefresh() {

    }

    onClickToggle = (type) => {
        /*
        let assessmentType = SDMSResource.assessmentType.eqZone;

        if (this.type === SDMSResource.assessmentType.eqZone) {
            assessmentType = SDMSResource.assessmentType.environ;
        }
        */

        this.getEquipZoneQItems(this.chkEqZoneID, type);
    }

    onSetQList = async (index) => {        
        if (index === 0) {
            // 저장하기
            const type = this.type;
            const qItems = this.state.qItems;

            const [success, message] = await AssessmentController.SetQList(type, qItems);
            if (!success) {
                this.props.showConfirmDialog(i18n.t('common.오류'), [message], [i18n.t('common.확인')], null);
            }
            else {
                this.props.closeConfirmDialog();
            }
        }
        else {
            this.props.closeConfirmDialog();
        }
    }

    sendAllAssessment = async (index) => {
        if (index === 0) {
            // 일괄 전송
            const type = this.type;
            const qItems = this.state.qItems;

            const [success, message] = await AssessmentController.SendAllAssessment();
            if (!success) {
                this.props.showConfirmDialog(i18n.t('common.오류'), [message], [i18n.t('common.확인')], null);
            }
            else {
                this.props.showConfirmDialog(i18n.t('common.확인'), ["일괄 전송이 시작되었습니다."], [i18n.t('common.확인')], null);
            }
        }
        else {
            this.props.closeConfirmDialog();
        }
    }

    render() {
        const { searchEqZoneText, showEqZoneDropDown, eqZoneDatas, searchEqZoneDatas } = this.state;
        const getQItemsUI = this.getQItemsUI();
        const getPopupUI = this.getPopupUI();
        const getReceiverTextUI = this.getReceiverTextUI();
        
        const eqZoneSensorList = this.getEqZoneSensorList();

        const userAuthor = ProjectResource.getUserAuthor();

        return (
            <React.Fragment>
                <SafetyAreaAssessmentComponent 
                    id={this.props.popupType} 
                    className={'viewDashboardBoxD viewDashboardSafetyAreaAssessment'} 
                     >
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={432}
                        /* popupMinHeight={316} */
                        popupMinHeight={741}
                        topSize={32}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.setPopupState}
                        onClick={() => this.onBlurCheck()}
                    >
                    <div className={'dslTop dslGrd'}>
                        <h5 className={'dslTitle'} >
                                {i18n.t('sdms.safetyAreaAssessment.안전구역 평가')}
                        </h5>
                            <a className={'gradeBtn'} id={"gradeBtn"} onClick={() => this.onClickGradePop()}></a>
                        <a className={'dslX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.safetyAreaAssessment, false)}></a>
                    </div>

                    {/* 등급기준 팝업 */}
                    <div id={"gradeSetPopupBox"} className={'gradeSetPopupBox'}>
                        <span className={'gradeTriangle'}></span>
                        <div className={'gradeSetPopup'}>
                                <span className={'gradeFlexTitle'}><h5 className={'gradeTitle'}>등급 기준 설정</h5><a className={'gradeRefreshBtn'} onClick={() => this.LoadAssessment()}></a></span>
                                <span className={'gradeFlex'} onClick={() => this.onClickInput('gradeClassA')}><p id={"gradeA"} className={"gradeClassA"}>A</p><input ref={this.refClassA_Start} type="text" className={'gradeInputA gradeClassA'} id={"gradeInputA"} onChange={(e) => this.onChangeKey(e)} /><p className={'slice gradeClassA'} id={"sliceActiveA"}>-</p><input ref={this.refClassA_End} type="text" className={'gradeInputA gradeClassA'} id={"gradeInputA_B"} onChange={(e) => this.onChangeKey(e)} /></span>
                                <span className={'gradeFlex'} onClick={() => this.onClickInput('gradeClassB')}><p id={"gradeB"} className={"gradeClassB"}>B</p><input ref={this.refClassB_Start} type="text" className={'gradeInputB gradeClassB'} id={"gradeInputB"} onChange={(e) => this.onChangeKey(e)} /><p className={'slice gradeClassB'} id={"sliceActiveB"}>-</p><input ref={this.refClassB_End} type="text" className={'gradeInputB gradeClassB'} id={"gradeInputB_B"} onChange={(e) => this.onChangeKey(e)} /></span>
                                <span className={'gradeFlex'} onClick={() => this.onClickInput('gradeClassC')}><p id={"gradeC"} className={"gradeClassC"}>C</p><input ref={this.refClassC_Start} type="text" className={'gradeInputC gradeClassC'} id={"gradeInputC"} onChange={(e) => this.onChangeKey(e)} /><p className={'slice gradeClassC'} id={"sliceActiveC"}>-</p><input ref={this.refClassC_End} type="text" className={'gradeInputC gradeClassC'} id={"gradeInputC_B"} onChange={(e) => this.onChangeKey(e)} /></span>
                           <span className={'gradeConfirmBox'}>
                             <a onClick={this.onClickCancleGrade}>취소</a>
                             <a onClick={this.onClickSaveGrade}>저장</a>
                           </span>
                        </div>
                    </div>

                    <div className={'dslCont'}>
                        <h5>수신자 설정</h5>

                        <ul className='receiver-info-area-wrap'>
                            
                            <li className='management-area-info'>
                                    
                                <span className='span-left'>{i18n.t('sdms.safetyAreaAssessment.관리구역')}</span>
                                <div className='management-area-input'>
                                    <input
                                        type='text'
                                        value={searchEqZoneText}
                                        ref={this.areaInput}
                                        onChange={(e) => this.onChangeEqZone(e)}
                                        onClick={(e) => this.showDropDownList(e)}
                                        onKeyPress={this.handleKeyPress}
                                    />
                                    {
                                        showEqZoneDropDown &&
                                        <ul className='area-dropdown-list scrollbar'>
                                            {
                                                searchEqZoneText ?
                                                    searchEqZoneDatas.map((item, index) => {
                                                        return (
                                                            <li
                                                                key={index + "_" + item.displayText}
                                                                onClick={() => this.clickDropDownItem(item)}
                                                            >
                                                                {item.displayText}
                                                            </li>
                                                        )
                                                    })
                                                    : eqZoneDatas.map((item, index) => {
                                                        return (
                                                            <li
                                                                key={index + "_" + item.displayText}
                                                                onClick={() => this.clickDropDownItem(item)}
                                                            >
                                                                {item.displayText}
                                                            </li>
                                                        )
                                                    })
                                            }
                                        </ul>
                                    }
                                </div>
                            </li>

                            <li className='receiver-info'>
                                <span className='span-left'>{i18n.t('sdms.safetyAreaAssessment.수신자')}</span>
                                <span onClick={() => this.onShowPopup(SafetyAreaAssessment.dialogType.receiver, true)}>{getReceiverTextUI}</span>
                            </li>
                        </ul>

                        <div style={{ paddingRight: '10px' }}>
                            <table className={'receiverTable scrollbar'}>
                                <colgroup>
                                    <col style={{ width: "63px" }} />
                                    <col style={{ width: "auto" }} />
                                </colgroup>
                                <tbody>
                                        {eqZoneSensorList}
                               </tbody>
                           </table>
                        </div>

                        <div className='item-management-wrap'>
                                <h5>
                                    {/* {
                                        this.state.q ? this.state.q.title : '-'
                                    } */}
                                    평가항목 작성
                                </h5>

                                {/* <div className={'toggleBtn'}>
                                    <div className={'button b2'} id={'button-10'}>
                                        <input type="checkbox" className={'toggleCheckbox'} onClick={(e) => this.onClickToggle()} />
                                        <div className={'toggleChange'}>
                                            <span>ZONE</span>
                                        </div>
                                        <div className={'layer'}></div>
                                    </div>
                                </div> */}

                                <div className='content-button-wrap'>
                                    <button className={this.type === SDMSResource.assessmentType.currentJob ? 'on' : ''} onClick={(e) => this.onClickToggle(SDMSResource.assessmentType.currentJob)}>현업</button>
                                    <button className={this.type === SDMSResource.assessmentType.safety ? 'on' : ''} onClick={(e) => this.onClickToggle(SDMSResource.assessmentType.safety)}>안전/보건</button>
                                    <button className={this.type === SDMSResource.assessmentType.prevention ? 'on' : ''} onClick={(e) => this.onClickToggle(SDMSResource.assessmentType.prevention)}>방재/환경</button>
                                </div>

                                <div className='item-management-right-wrap'>
                                    <a onClick={() => this.onSave(SafetyAreaAssessment.dialogType.save)}>{i18n.t('common.저장')}</a>
                                    {                                    
                                        this.state.q && ProjectResource.SiteID !== ProjectResource.Site.Wonik &&
                                        <a onClick={() => this.onSaveDialog(SafetyAreaAssessment.dialogType.saveAs)}>{i18n.t('common.다른 이름으로 저장')}</a>
                                    }
                                    <a onClick={() => this.onShowPopup(SafetyAreaAssessment.dialogType.list, true)}>{i18n.t('sdms.safetyAreaAssessment.평가표 관리')}</a>
                                </div>
                        </div>

                        <ul className='item-list-wrap scrollbar'>
                            { getQItemsUI }
                        </ul>

                        <div className='footer-button-wrap'>
                            {
                                this.state.q && ProjectResource.SiteID !== ProjectResource.Site.Wonik &&
                                <button className='add-btn' onClick={() => this.onAddQItem()}>{i18n.t('sdms.safetyAreaAssessment.항목추가')}</button>
                            }
                            {
                                userAuthor === AccountResource.accountLevelID.master &&
                                <button className='save-Items-btn' onClick={() => this.props.showConfirmDialog(i18n.t('common.확인'), ["저장된 모든 안전구역 평가를 일괄 전송 하시겠습니까?"], [i18n.t('common.확인'), i18n.t('common.취소')], this.sendAllAssessment)}>일괄 전송</button>
                            }                            
                            <button className='save-Items-btn' onClick={() => this.props.showConfirmDialog(i18n.t('common.확인'), [i18n.t('msg.저장할까요?')], [i18n.t('common.확인'), i18n.t('common.취소')], this.onSetQList)}>항목 저장</button>
                            <button className='reset-btn' onClick={() => this.onClickInit()}>{i18n.t('sdms.safetyAreaAssessment.초기화')}</button>
                            <button className='confirm-btn' onClick={() => this.onSend()}>{i18n.t('sdms.safetyAreaAssessment.보내기')}</button>
                        </div>
                    </div>
                    </PopupDraggable>
                </SafetyAreaAssessmentComponent>

                {getPopupUI}
            </React.Fragment>
        );
    }
}

export default withTranslation()(SafetyAreaAssessment);


// 수신자 편집
class EditReceiver extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectRegularID: null, // 선택된 팀
            selectedMembers: this.props.selectedMembers,

            addMembers: [],     // 추가하려고 선택한 인원들
            removeMembers: [],  // 삭제하려고 선택한 인원들
            searchText: null,
        }

        this.refSearch = React.createRef();
    }

    componentDidMount() {
        //this.initData();

        // 트리 열고 닫기
        $('.' + 'dsiTree' + ' h5 span').click(function () {
            if ($(this).is('.' + 'on')) {
                $(this).removeClass('on');
                $(this).parent().next().hide();
            } else {
                $(this).addClass('on');
                $(this).parent().next().show();
            };
        });

        // 트리 선택
        $('.' + 'dsiTree' + ' h5 span').click(function () {
            let targets = $('.' + 'dsiTreeCheck');

            if (targets !== null && targets !== undefined && targets.length > 0) {
                for (let i = 0; i < targets.length; i++) {
                    let target = targets[i];

                    $(target).removeClass('dsiTreeCheck');
                }
            }

            $(this).addClass('dsiTreeCheck');
        });

        // 트리 선택
        $('.' + 'dsiTree' + ' li a').click(function () {
            let targets = $('.' + 'dsiTreeCheck');

            if (targets !== null && targets !== undefined && targets.length > 0) {
                for (let i = 0; i < targets.length; i++) {
                    let target = targets[i];

                    $(target).removeClass('dsiTreeCheck');
                }
            }

            $(this).addClass('dsiTreeCheck');
        });
    }

    displayTreeView = () => {

        const teamTreeDatas = this.props.teamDatas;
        let displayTreeViewUI = [];

        if (teamTreeDatas === null || teamTreeDatas === undefined || teamTreeDatas.length < 1)
            return displayTreeViewUI;

        for (let i = 0; i < teamTreeDatas.length; i++) {
            let node = teamTreeDatas[i];

            if (node.Children !== null && node.Children !== undefined && node.Children.length > 0) {
                displayTreeViewUI.push(this.getParentNode(node));
            } else {
                displayTreeViewUI.push(this.getChildNode(node));
            }
        }

        return displayTreeViewUI;
    }

    getParentNode = (node) => {
        let name = node.TeamName;
        let id = node.ID;

        let childTree = [];

        for (let i = 0; i < node.Children.length; i++) {
            let child = node.Children[i];

            if (child.Children !== null && child.Children !== undefined && child.Children.length > 0) {
                childTree.push(this.getParentNode(child));
            } else {
                childTree.push(this.getChildNode(child));
            }
        }

        return (<li key={"parentNode_" + id}>
            <h5><span id={id} onClick={() => this.selectRegular(id)}> {name} </span></h5>
            <ul>{childTree}</ul>
        </li>);
    }

    getChildNode = (node) => {
        let name = node.TeamName;
        let id = node.ID;

        return (<li key={"childNode_" + id}><a id={id} onClick={() => this.selectRegular(id)}> {name} </a></li>);
    }

    selectRegular = (id) => {
        // 선택된 팀원 체크 해제
        let targets = $('.' + 'regularMemberCheck');

        if (targets !== null && targets !== undefined && targets.length > 0) {
            for (let i = 0; i < targets.length; i++) {
                let target = targets[i];

                $(target).removeClass('regularMemberCheck');
            }
        }

        this.setState({ selectRegularID: id, addMembers: [] });
    }

    displayMembersUI = () => {
        const RegularID = this.state.selectRegularID;
        const members = this.props.members;

        let ui = [];

        if (members === null && members === undefined)
            return ui;

        if (RegularID === null || RegularID === undefined) {
            const searchText = this.state.searchText;
            let j = 1;

            for (let i = 0; i < members.length; i++) {
                const member = members[i];

                if (member.MemberName?.includes(searchText)) {
                    ui.push(
                        <tr>
                            <td>{j}</td>
                            <td>{member.TeamName}</td>
                            <td>
                                <a onClick={(e) => this.selectRegularMember(e, member)}>{member.MemberName}</a>
                            </td>
                        </tr>
                    );
                    j++;
                }
            }
        }        
        else {
            let j = 1;

            for (let i = 0; i < members.length; i++) {
                const member = members[i];

                if (member.RegularID === RegularID) {
                    ui.push(
                        <tr>
                            <td>{j}</td>
                            <td>{member.TeamName}</td>
                            <td>
                                <a onClick={(e) => this.selectRegularMember(e, member)}>{member.MemberName}</a>
                            </td>                            
                        </tr>
                    );
                    j++;
                }
            }
        }

        return ui;
    }

    selectRegularMember = (e, selectedMember) => {
        // 선택된 팀 해제
        let targets = $('.' + 'dsiTreeCheck');

        if (targets !== null && targets !== undefined && targets.length > 0) {
            for (let i = 0; i < targets.length; i++) {
                let target = targets[i];

                $(target).removeClass('dsiTreeCheck');
            }
        }

        let addMembers = this.state.addMembers;
        const target = e.target;
        if ($(target).hasClass('regularMemberCheck')) {
            // 선택된 팀원이라면 체크해제
            $(target).removeClass('regularMemberCheck');

            for (let i = 0; i < addMembers.length; i++) {
                let member = addMembers[i];

                if (member.ID === selectedMember.ID) {
                    addMembers.splice(i, 1);
                    break;
                }
            }
        } else {
            // 선택되지 않은 팀원이라면 체크
            $(target).addClass('regularMemberCheck');
            addMembers.push(selectedMember);
        }

        this.setState({ addMembers });
    }

    onClickAdd = () => {
        let { addMembers } = this.state;
        let tempSelectedMembers = [...this.state.selectedMembers];
        if (!addMembers || addMembers.length === 0) {
            return;
        }

        const addLength = addMembers.length;
        const selectedLength = this.state.selectedMembers.length;
        for (let i = 0; i < addLength; i++) {
            const addMember = addMembers[i];
            let bCheck = true;
            for (let j = 0; j < selectedLength; j++) {
                const alreadyMember = this.state.selectedMembers[j];
                if (addMember.ID === alreadyMember.ID) {
                    bCheck = false;
                    break;
                }
            }

            if (bCheck) {
                tempSelectedMembers.push(addMember);
            }
        }

        // 인원선택한 효과 해제
        let targets = $('.' + 'regularMemberCheck');

        if (targets !== null && targets !== undefined && targets.length > 0) {
            for (let i = 0; i < targets.length; i++) {
                let target = targets[i];

                $(target).removeClass('regularMemberCheck');
            }
        }

        this.setState({ selectedMembers: tempSelectedMembers, addMembers:[] });
    }

    onClickDelete = (member) => {
        let selectedMembers = this.state.selectedMembers.filter((item) => item.ID !== member.ID)
        this.setState({ selectedMembers });
    }

    displayReceiverUI = () => {        
        let ui = [];

        const selectedMembers = this.state.selectedMembers;
        if (!selectedMembers) {
            return ui;
        }

        const length = selectedMembers.length;

        for (let i = 0; i < length; i++) {
            const member = selectedMembers[i];
            ui.push(
                <tr key={'selectedMember_' + member.ID}>
                    <td>{i + 1}</td>
                    <td>{member.MemberName}</td>
                    <td className='delete-icon'><a onClick={(e) => this.onClickDelete(member)}></a></td>
                </tr>
            );            
        }

        return ui;
    }

    onSelectReceiver = () => {
        this.props.onSelectReceiver(this.state.selectedMembers);
    }

    onClickSearch = () => {
        // 선택된 팀 해제
        let targets = $('.' + 'dsiTreeCheck');

        if (targets !== null && targets !== undefined && targets.length > 0) {
            for (let i = 0; i < targets.length; i++) {
                let target = targets[i];

                $(target).removeClass('dsiTreeCheck');
            }
        }

        let refSearch = this.refSearch.current.value;

        this.setState({ searchText: refSearch, selectRegularID: null });
    }

    handleKeyPress = (e) => {
        if (e.key === "Enter") {
            this.onClickSearch();
        }
    }

    render() {
        const displayTreeViewUI = this.displayTreeView();
        const displayMembersUI = this.displayMembersUI();
        const displayReceiverUI = this.displayReceiverUI();

        return (
            <ModalBackground>
                <EditReceiverComponent id={this.props.popupType} className={'viewDashboardBoxD viewDashboardSafetyAreaAssessment'}>
                    <div className={'dslTop dslGrd'}>
                        <h5 className={'dslTitle'} >
                            {i18n.t('sdms.safetyAreaAssessment.수신자 편집')}
                        </h5>
                        <a className={'dslX'} onClick={() => this.props.onClosePopup(SafetyAreaAssessment.dialogType.receiver, false)}></a>
                    </div>
                    <div className={'dslCont'}>
                        <div className={'dsiSchE'}>
                            <input ref={this.refSearch} type="text" onKeyPress={this.handleKeyPress} />
                            <a onClick={this.onClickSearch}>{i18n.t('sdms.statusInfo.검색')}</a>
                        </div>
                        <SelectReceiverComponent>
                            <div className={'stguWrap'}>
								<div>
									<div className={'stguTree' + " " + 'scrollbar'}>
										<ul className={'dsiTree'}>											
                                            {displayTreeViewUI}
										</ul>
									</div>
								</div>
								<div>
									<div className={'stguTeam'}>
										<div className={'stguTh'}>
											<table>
												<colgroup>
                                                    <col style={{ "width": "20%" }} />
                                                    <col style={{ "width": "50%" }} />
                                                    <col style={{ "width": "30%" }} />
												</colgroup>
												<thead className={'pointDefault'}>
													<tr>
                                                        <th>No</th>
                                                        <th>부서</th>
                                                        <th>팀원</th>                                                        
													</tr>
												</thead>
											</table>
										</div>
										<div className={'stguTd' + " " + 'scrollbar'}>
											<table>
												<colgroup>
                                                    <col style={{ "width": "20%" }} />
                                                    <col style={{ "width": "50%" }} />
                                                    <col style={{ "width": "30%" }} />
												</colgroup>
												<tbody className={'regularMemberList'}>
                                                    {displayMembersUI}
												</tbody>
											</table>
										</div>
									</div>
								</div>
								<div>
									<div className={'stguAdd'}>
										<div>
											<div>
												<ul>
                                                    <li><a className={'stguAddIcon'} onClick={this.onClickAdd}>{i18n.t('common.추가')}</a></li>
                                                    {/* <li><a onClick={this.onClickDelete}>삭제</a></li> */}
												</ul>
											</div>
										</div>
									</div>
								</div>
								<div>
									<div className={'stguName'}>
										<div className={'stguTh'}>
											<table>
												<colgroup>
                                                    <col style={{ "width": "20%" }} />
                                                    <col style={{ "width": "50%" }} />
                                                    <col style={{ "width": "30%" }} />
												</colgroup>
												<thead className={'pointDefault'}>
													<tr>
														<th>No</th>
                                                        <th>{i18n.t('sdms.safetyAreaAssessment.이름')}</th>
                                                        <th>{i18n.t('common.삭제')}</th>
													</tr>
												</thead>
											</table>
										</div>
										<div className={'stguTd' + " " + 'scrollbar'}>
											<table>
												<colgroup>
                                                    <col style={{ "width": "20%" }} />
                                                    <col style={{ "width": "50%" }} />
                                                    <col style={{ "width": "30%" }} />
												</colgroup>
												<tbody className={'regularMemberList'}>
													{displayReceiverUI}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
                        </SelectReceiverComponent>

                        <div className='footer-button-wrap'>
                            <button className='confirm-btn' onClick={this.onSelectReceiver}>{i18n.t('common.확인')}</button>
                            <button className='reset-btn' onClick={() => this.props.onClosePopup(SafetyAreaAssessment.dialogType.receiver, false)}>{i18n.t('common.취소')}</button>
                        </div>
                    </div>
                </EditReceiverComponent>
            </ModalBackground>
        );
    }
}


// 항목 불러오기
class LoadSafetyList extends Component {
    
    static AutoAssessmentType = {
        None: 0,
        Month: 1,
        Week: 2
    }



    constructor(props) {
        super(props);

        //this.refEqZoneFile = React.createRef();
        //this.refEnvironFile = React.createRef();
        //this.refEqZoneFileName = React.createRef();
        //this.refEnvironFileName = React.createRef();        

        //this.eqZoneFile = null;
        //this.environFile = null;

        this.refCurrentJobFile = React.createRef();
        this.refSafetyFile = React.createRef();
        this.refPreventionFile = React.createRef();
        this.refCurrentJobFileName = React.createRef();
        this.refSafetyFileName = React.createRef();
        this.refPreventionFileName = React.createRef();

        this.currentJobFile = null;
        this.safetyFile = null;
        this.preventionFile = null;

        this.state = {
            qList: [],
            selectedQID: -1,
            qItems: [],
            dialog: {
                type: SafetyAreaAssessment.dialogType.none,
                visible: false,
                qID: null,
                members: []
            },
            isEditMode: false,
            qList_backup: [],
            search: "",
        };

        this.refSearch = React.createRef();
        this.refAutoMonth = React.createRef();
        this.refAutoWeek = React.createRef();
        this.refAutoNone = React.createRef();
    }

    componentDidMount() {
        this.loadQList();
    }

    onClickClosePopup = () => {
        this.props.onClickClosePopup(false);
    }

    showSafetyListDetail = async (e, qID) => {
        if (qID === this.state.selectedQID) {
            if (e.target.parentNode.nextSibling !== null) {
                e.stopPropagation()
                e.target.parentNode.nextSibling.classList.toggle('on');
            }
            return;
        }

        const result = await AssessmentController.LoadQItem(qID);
        if (result[0] === false) {
            return;
        }

        this.setState({ qItems: result[1], selectedQID: qID }, () => {
            if (e.target.parentNode.nextSibling !== null) {
                e.stopPropagation()
                e.target.parentNode.nextSibling.classList.toggle('on');
            }
        });
    }

    loadQList = async () => {
        const members = this.props.members;

        const result = await AssessmentController.LoadQList();
        const result2 = await AssessmentController.LoadQItem(null);

        if (result[0] === false || result2[0] === false) {
            return;
        }

        const qList = result[1];
        const qItems = result2[1];

        for (let i = 0; i < qList?.length; i++) {            
            const item = qList[i];
            item.buildingName = "-";
            item.zoneName = "-";
            item.equipZoneName = "-";
            item.memberNames = "-";
            item.members = [];

            let eqChk = false;

            // 공간정보 찾기
            for (let i = 0; i < this.props.buildingGroupList?.length; i++) {
                const buildingGroup = this.props.buildingGroupList[i];
                if (!buildingGroup.buildingDatas) {
                    continue;
                }

                const buildingLength = buildingGroup.buildingDatas.length;
                for (let j = 0; j < buildingLength; j++) {
                    const building = buildingGroup.buildingDatas[j];
                    if (!building.zoneDatas) {
                        continue;
                    }

                    const zoneLength = building.zoneDatas.length;
                    for (let k = 0; k < zoneLength; k++) {
                        const zone = building.zoneDatas[k];
                        if (!zone.equipmentZoneDatas) 
                            continue;

                        const equipLength = zone.equipmentZoneDatas.length;
                        for (let z = 0; z < equipLength; z++) {
                            const equipZone = zone.equipmentZoneDatas[z];
                            if (equipZone.id === item.equipZoneID) {
                                item.equipZoneName = equipZone.displayText;
                                item.zoneName = zone.displayText;
                                item.buildingName = building.displayText;
                                eqChk = true;
                                break;
                            }
                            
                        }
                        
                        if (eqChk)
                            break;
                    }

                    if (eqChk)
                        break;
                }

                if (eqChk)
                    break;
            }

            if (!eqChk) {
                // 구역정보를 찾지 못한 경우, 외곽 정보도 조회
                //const _outdoorZones = this.props.outdoorZones;
                const site3dOptions = this.props.site3dOptions;

                for (let siteID in site3dOptions) {
                    siteID = Number(siteID);

                    if (siteID !== NaN) {
                        const outdoorZones = site3dOptions[siteID]?.outdoorZones;

                        if (outdoorZones) {
                            for (let zoneID in outdoorZones) {
                                zoneID = Number(zoneID);

                                if (zoneID !== NaN && zoneID !== 30000) {
                                    const outdoorZone = outdoorZones[zoneID];

                                    if (outdoorZone.equipZones?.length > 0) {

                                        for (let equipZoneID in outdoorZone.equipZones) {
                                            const equipZone = outdoorZone.equipZones[equipZoneID];

                                            if (equipZone[0] && equipZone[1]) {
                                                if (equipZone[0] === item.equipZoneID) {
                                                    item.equipZoneName = equipZone[1];
                                                    item.zoneName = outdoorZone.name;
                                                    item.buildingName = outdoorZone.name;
                                                    eqChk = true;
                                                    break;
                                                }

                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (eqChk)
                        break;
                }

                
            }

            // 멤버정보 찾기
            if (item.memberIDs !== null && item.memberIDs !== undefined && item.memberIDs.length > 0) {
                const arrIDs = item.memberIDs.split(",");
                let memberNames = "-";

                for (let j = 0; j < arrIDs?.length; j++) {
                    const id = arrIDs[j];

                    for (let i = 0; i < this.props.members?.length; i++) {
                        const member = this.props.members[i];
                        if (member.ID.toString() === id) {
                            if (memberNames === "-" || memberNames === null || memberNames === "")
                                memberNames = member.MemberName;
                            else
                                memberNames += ", " + member.MemberName;

                            item.members.push(member);
                            break;
                        }

                    }
                }

                item.memberNames = memberNames;
            }            
        }

        const qList_backup = qList.slice();
        
        this.setState({ qList, qItems, qList_backup });
    }

    loadQItems = async (qID) => {
        const result = await AssessmentController.LoadQItem(qID);
        if (result[0] === false) {
            return;
        }

        this.setState({ qItems: result[1] });
    }

    onClickDeleteQ = (qID, index) => {
        if (this.state.selectedQID !== qID) {
            this.setState({ selectedQID: qID });
        }
        //this.confirmData = { qID, index };
        this.props.showConfirmDialog(i18n.t('common.삭제'), [i18n.t('msg.삭제할까요?')], [i18n.t('common.삭제'), i18n.t('common.취소')], this.onDeleteQ)
    }

    onDeleteQ = async (btnIndex) => {
        if (btnIndex === 0) {
            const result = await AssessmentController.DeleteQ(this.state.selectedQID);
            if (result[0]) {
                let qList = [...this.state.qList];
                const length = qList.length;
                for (let i = 0; i < length; i++) {
                    if (qList[i].id === this.state.selectedQID) {
                        qList.splice(i, 1);
                        break;
                    }
                }

                this.setState({ qList, selectedQID: -1 });
            }
        }

        this.props.closeConfirmDialog();
    }

    onChangeRadio = (qID) => {
        if (this.state.selectedQID === qID) {
            return;
        }

        this.setState({ selectedQID: qID });
    }    

    getQList = () => {
        if (!this.state.qList) {
            return <></>;
        }

        let ui = [];
        const qItems = this.state.qItems;
        const search = this.state.search;
        let qListCnt = 1;
        
        const length = this.state.qList.length;
        for (let i = 0; i < length; i++) {
            const qList = this.state.qList[i];

            let zoneUI = [];
            let qItemUI1 = [];
            let qItemUI2 = [];
            let qItemUI3 = [];

            let cnt = 1;
            
            // 검색 필터
            if (search !== null && search !== undefined && search !== "" &&
                qList.buildingName?.includes(search) === false &&
                qList.zoneName?.includes(search) === false &&
                qList.equipZoneName?.includes(search) === false &&
                qList.memberNames?.includes(search) === false )
                continue;

            let type = qList.type;
            if (type === SDMSResource.assessmentType.eqZone)
                type = "ZONE";
            else if (type === SDMSResource.assessmentType.environ)
                type = "안전";
            else if (type === SDMSResource.assessmentType.currentJob)
                type = "현업";
            else if (type === SDMSResource.assessmentType.safety)
                type = "안전/보건";
            else if (type === SDMSResource.assessmentType.prevention)
                type = "방재/환경";
            else
                type = "-";

            for (let j = 0; j < qItems?.length; j++) {
                const qItem = qItems[j];

                if (qList.id === qItem.qid) {                    
                    if (qList.type === SDMSResource.assessmentType.eqZone) {
                        if (cnt <= 3) {
                            qItemUI1.push(<div className={'subUIFlex'}><span>{cnt}. </span><span>{qItem.contents}</span></div>);
                        } else if (cnt <= 10) {
                            qItemUI2.push(<div className={'subUIFlex'}><span>{cnt}. </span><span>{qItem.contents}</span></div>);
                        } else {
                            qItemUI3.push(<div className={'subUIFlex'}><span>{cnt}. </span><span>{qItem.contents}</span></div>);
                        }
                    }
                    /*else if (qList.type === SDMSResource.assessmentType.environ) {
                        if (j < 5) {
                            qItemUI1.push(<div className={'subUIFlex'}><span>{cnt}. </span><span>{qItem.contents}</span></div>);
                        } else {
                            qItemUI2.push(<div className={'subUIFlex'}><span>{cnt}. </span><span>{qItem.contents}</span></div>);
                        }
                    }*/
                    else {
                        qItemUI1.push(<div className={'subUIFlex'}><span>{cnt}. </span><span>{qItem.contents}</span></div>);
                    }

                    cnt++;
                }
            }
                
            let createDate = "-";
            if (qList.createDate) {
                createDate = qList.createDate;
                createDate = createDate.replace("T", " ");
            }


            // 대분류/소분류 타이틀 UI 관련 부분 (관리 상세 항목)
            if (qList.type === SDMSResource.assessmentType.eqZone) {
                ui.push(
                    <React.Fragment key={"QListTabe_" + qList.id + "_" + qListCnt}>
                        <ul id={"evaluationActive_" + qList.id} className={'evaluationListTd'} onClick={() => this.onClickEvaluationPop(qList.id)}>
                            <li style={{ width: '3%' }}><input type="checkbox" className={"qCheckbox"} value={qList.id} onClick={(e) => this.onClickQCheckbox(e)} /></li>
                            <li style={{ width: '7%' }}>{qListCnt}</li>
                            <li style={{ width: '10%' }}>{qList.buildingName}</li>
                            <li style={{ width: '18%' }}>{qList.zoneName}</li>
                            <li style={{ width: '15%' }}>{qList.equipZoneName}</li>
                            <li style={{ width: '15%' }}>
                                <div className={"activeInput"} onClick={(e) => this.onClickMembers(qList.id, qList.members, e)}>{qList.memberNames}</div>
                            </li>
                            <li style={{ width: '16%' }}>{type}</li>
                            <li style={{ width: '16%' }}>{createDate}</li>
                        </ul>

                        <div id={"evaluationActiveConts_" + qList.id} className={'evaluationContentWrap scrollbar'}>

                            <div className={'zoneUIBox'}>
                                <span className={'zoneUITitle'}><span className={'squareBox'}></span>공통 항목</span>
                                <span className={'subUITitle'}><p>환경</p></span>
                                <span className={'subUIContents'}>
                                    {qItemUI1}
                                </span>
                                <span className={'subUITitle'}><p>방재</p></span>
                                <span className={'subUIContents'}>
                                    {qItemUI2}
                                </span>
                                <span className={'subUITitle'}><p>안전보건</p></span>
                                <span className={'subUIContents'}>
                                    {qItemUI3}
                                </span>
                            </div>
                        </div>
                    </React.Fragment>
                );
            }
            else if (qList.type === SDMSResource.assessmentType.environ) {
                ui.push(
                    <React.Fragment key={"QListTabe_" + qList.id + "_" + qListCnt}>
                        <ul id={"evaluationActive_" + qList.id} className={'evaluationListTd'} onClick={() => this.onClickEvaluationPop(qList.id)}>
                            <li style={{ width: '3%' }}><input type="checkbox" className={"qCheckbox"} value={qList.id} onClick={(e) => this.onClickQCheckbox(e)} /></li>
                            <li style={{ width: '7%' }}>{qListCnt}</li>
                            <li style={{ width: '10%' }}>{qList.buildingName}</li>
                            <li style={{ width: '18%' }}>{qList.zoneName}</li>
                            <li style={{ width: '15%' }}>{qList.equipZoneName}</li>
                            <li style={{ width: '15%' }}>
                                <div className={"activeInput"} onClick={(e) => this.onClickMembers(qList.id, qList.members, e)}>{qList.memberNames}</div>
                            </li>
                            <li style={{ width: '16%' }}>{type}</li>
                            <li style={{ width: '16%' }}>{createDate}</li>
                        </ul>

                        <div id={"evaluationActiveConts_" + qList.id} className={'evaluationContentWrap scrollbar'}>

                            <div className={'zoneUIBox'}>
                                <span className={'zoneUITitle'}><span className={'squareBox'}></span>안전환경평가 항목</span>
                                <span className={'subUITitle'}><p>안전환경</p></span>
                                <span className={'subUIContents'}>
                                    {qItemUI1}
                                </span>
                            </div>
                        </div>
                    </React.Fragment>
                );
            }
            else if (qList.type === SDMSResource.assessmentType.currentJob) {
                ui.push(
                    <React.Fragment key={"QListTabe_" + qList.id + "_" + qListCnt}>
                        <ul id={"evaluationActive_" + qList.id} className={'evaluationListTd'} onClick={() => this.onClickEvaluationPop(qList.id)}>
                            <li style={{ width: '3%' }}><input type="checkbox" className={"qCheckbox"} value={qList.id} onClick={(e) => this.onClickQCheckbox(e)} /></li>
                            <li style={{ width: '7%' }}>{qListCnt}</li>
                            <li style={{ width: '10%' }}>{qList.buildingName}</li>
                            <li style={{ width: '18%' }}>{qList.zoneName}</li>
                            <li style={{ width: '15%' }}>{qList.equipZoneName}</li>
                            <li style={{ width: '15%' }}>
                                <div className={"activeInput"} onClick={(e) => this.onClickMembers(qList.id, qList.members, e)}>{qList.memberNames}</div>
                            </li>
                            <li style={{ width: '16%' }}>{type}</li>
                            <li style={{ width: '16%' }}>{createDate}</li>
                        </ul>

                        <div id={"evaluationActiveConts_" + qList.id} className={'evaluationContentWrap scrollbar'}>

                            <div className={'zoneUIBox'}>
                                <span className={'zoneUITitle'}><span className={'squareBox'}></span>현업평가 항목</span>
                                <span className={'subUITitle'}><p>현업</p></span>
                                <span className={'subUIContents'}>
                                    {qItemUI1}
                                </span>
                            </div>
                        </div>
                    </React.Fragment>
                );
            }
            else if (qList.type === SDMSResource.assessmentType.safety) {
                ui.push(
                    <React.Fragment key={"QListTabe_" + qList.id + "_" + qListCnt}>
                        <ul id={"evaluationActive_" + qList.id} className={'evaluationListTd'} onClick={() => this.onClickEvaluationPop(qList.id)}>
                            <li style={{ width: '3%' }}><input type="checkbox" className={"qCheckbox"} value={qList.id} onClick={(e) => this.onClickQCheckbox(e)} /></li>
                            <li style={{ width: '7%' }}>{qListCnt}</li>
                            <li style={{ width: '10%' }}>{qList.buildingName}</li>
                            <li style={{ width: '18%' }}>{qList.zoneName}</li>
                            <li style={{ width: '15%' }}>{qList.equipZoneName}</li>
                            <li style={{ width: '15%' }}>
                                <div className={"activeInput"} onClick={(e) => this.onClickMembers(qList.id, qList.members, e)}>{qList.memberNames}</div>
                            </li>
                            <li style={{ width: '16%' }}>{type}</li>
                            <li style={{ width: '16%' }}>{createDate}</li>
                        </ul>

                        <div id={"evaluationActiveConts_" + qList.id} className={'evaluationContentWrap scrollbar'}>

                            <div className={'zoneUIBox'}>
                                <span className={'zoneUITitle'}><span className={'squareBox'}></span>안전/보건평가 항목</span>
                                <span className={'subUITitle'}><p>안전/보건</p></span>
                                <span className={'subUIContents'}>
                                    {qItemUI1}
                                </span>
                            </div>
                        </div>
                    </React.Fragment>
                );
            }
            else if (qList.type === SDMSResource.assessmentType.prevention) {
                ui.push(
                    <React.Fragment key={"QListTabe_" + qList.id + "_" + qListCnt}>
                        <ul id={"evaluationActive_" + qList.id} className={'evaluationListTd'} onClick={() => this.onClickEvaluationPop(qList.id)}>
                            <li style={{ width: '3%' }}><input type="checkbox" className={"qCheckbox"} value={qList.id} onClick={(e) => this.onClickQCheckbox(e)} /></li>
                            <li style={{ width: '7%' }}>{qListCnt}</li>
                            <li style={{ width: '10%' }}>{qList.buildingName}</li>
                            <li style={{ width: '18%' }}>{qList.zoneName}</li>
                            <li style={{ width: '15%' }}>{qList.equipZoneName}</li>
                            <li style={{ width: '15%' }}>
                                <div className={"activeInput"} onClick={(e) => this.onClickMembers(qList.id, qList.members, e)}>{qList.memberNames}</div>
                            </li>
                            <li style={{ width: '16%' }}>{type}</li>
                            <li style={{ width: '16%' }}>{createDate}</li>
                        </ul>

                        <div id={"evaluationActiveConts_" + qList.id} className={'evaluationContentWrap scrollbar'}>

                            <div className={'zoneUIBox'}>
                                <span className={'zoneUITitle'}><span className={'squareBox'}></span>방재/환경평가 항목</span>
                                <span className={'subUITitle'}><p>방재/환경</p></span>
                                <span className={'subUIContents'}>
                                    {qItemUI1}
                                </span>
                            </div>
                        </div>
                    </React.Fragment>
                );
            }

            qListCnt++;
        }

        return ui;
    }

    onClickQCheckbox = (e) => {
        // 클릭 이벤트가 상위로 전파되지 않도록
        e.stopPropagation();
    }

    onClickBringIn = () => {
        if (this.state.selectedQID <= 0) {
            this.props.showConfirmDialog(i18n.t('sdms.safetyAreaAssessment.불러오기'), [i18n.t('sdms.safetyAreaAssessment.항목을 선택하세요')], [i18n.t('common.확인')], null);
            return;
        }

        let q = null;
        const length = this.state.qList.length;
        for (let i = 0; i < length; i++) {
            const qList = this.state.qList[i];
            if (qList.id === this.state.selectedQID) {
                q = qList;
                break;
            }

        }
        this.props.onBringIn(q, this.state.qItems);
    }

    onClickEvaluationPop = async (id) => {
        const element = document.getElementById('evaluationActive_' + id);
        const elementConts = document.getElementById('evaluationActiveConts_' + id);

        if (!element || !elementConts)
            return;

        element.classList.toggle('on');
        elementConts.classList.toggle('on');
    }

    onClickActiveInput = () => {
        const activeInputs = document.getElementsByClassName('activeInput');
        const activeCheckbox = document.getElementsByClassName('evaluationCheckbox');
        const activeQCheckbox = document.getElementsByClassName('qCheckbox');

        for (let i = 0; i < activeInputs?.length; i++) {
            const element = activeInputs[i];
            element.classList.toggle('on');
        }

        for (let i = 0; i < activeCheckbox?.length; i++) {
            const element2 = activeCheckbox[i];
            element2.classList.toggle('on');
        }

        for (let i = 0; i < activeQCheckbox?.length; i++) {
            const element3 = activeQCheckbox[i];
            element3.classList.toggle('on');
        }

        let isEditMode = this.state.isEditMode;
        isEditMode = !isEditMode;

        // 수정 취소
        if (isEditMode === false) {
            const qList_backup = this.state.qList_backup;
            this.state.qList = qList_backup;
        }

        this.setState({ isEditMode });
    }

    onClickSmsPop = async () => {
        const currentSiteID = parseInt(this.props.currentSiteID);
        if (currentSiteID === NaN) 
            return;

        // DB 데이터 불러오기
        const [success, type, date] = await AssessmentController.LoadAutoAssessment(currentSiteID);
        if (success === false)
            return;

        this.refAutoMonth.current.checked = false;
        this.refAutoWeek.current.checked = false;
        this.refAutoNone.current.checked = false;

        if (type === LoadSafetyList.AutoAssessmentType.Month) {
            this.refAutoMonth.current.checked = true;
        } else if (type === LoadSafetyList.AutoAssessmentType.Week) {
            this.refAutoWeek.current.checked = true;
        } else {
            this.refAutoNone.current.checked = true;
        }



        // 날짜 설정도 필요하다면 date 값을 이용



        // UI 기능
        const showSmsPop = document.getElementById('smsPop');
        if (!showSmsPop)
            return;
        showSmsPop.classList.toggle('on');
    }

    guidePop = () => {
        const guidePopBox = document.getElementById('guidePopBox');
        if (!guidePopBox)
            return;

        // 초기화
        //this.refEnvironFileName.current.textContent = "파일 없음";
        //this.refEqZoneFileName.current.textContent = "파일 없음";
        //this.eqZoneFile = null;
        //this.environFile = null;

        this.refCurrentJobFileName.current.textContent = "파일 없음";
        this.currentJobFile = null;        
        this.refSafetyFileName.current.textContent = "파일 없음";
        this.safetyFile = null;
        this.refPreventionFileName.current.textContent = "파일 없음";
        this.preventionFile = null;

        this.refCurrentJobFile.current.value = null;
        this.refSafetyFile.current.value = null;
        this.refPreventionFile.current.value = null;

        // UI
        guidePopBox.classList.toggle('on');
    }

    onClickAutoSave = async () => {
        let type = 0;
        let date = 0;

        if (this.refAutoMonth.current.checked === true) {
            type = LoadSafetyList.AutoAssessmentType.Month; // 매월
            date = 4; // 4일
        } else if (this.refAutoWeek.current.checked === true) {
            type = LoadSafetyList.AutoAssessmentType.Week; // 매주
            date = 1; // 월요일
        }

        const currentSiteID = parseInt(this.props.currentSiteID);
        if (currentSiteID === NaN)
            return;

        const [success, msg] = await AssessmentController.SetAutoAssessment(currentSiteID, type, date);
        if (success === true) {
            this.props.showConfirmDialog(i18n.t('common.저장'), [i18n.t('msg.저장되었습니다')], [i18n.t('common.확인')], null);
        } else {
            this.props.showConfirmDialog(i18n.t('common.오류'), [msg], [i18n.t('common.확인')], null);
        }

        const showSmsPop = document.getElementById('smsPop');
        if (!showSmsPop)
            return;
        showSmsPop.classList.toggle('on');
    }

    onClickAutoCancle = () => {
        // UI 기능
        const showSmsPop = document.getElementById('smsPop');
        if (!showSmsPop)
            return;
        showSmsPop.classList.toggle('on');
    }

    onClickGuideCancle = () => {
        // UI 기능
        const guidePopBox = document.getElementById('guidePopBox');
        if (!guidePopBox)
            return;
        guidePopBox.classList.toggle('on');
    }

    onClickGuideSave = async () => {
        if (/*this.eqZoneFile === null && this.environFile === null &&*/ this.currentJobFile === null && this.safetyFile === null && this.preventionFile === null) {
            this.props.showConfirmDialog(i18n.t('common.오류'), ["파일이 선택되지 않았습니다."], null, null);
            return;
        }

        const [success, msg] = await AssessmentController.requestUploadGuideFile(/*this.eqZoneFile, this.environFile,*/ this.currentJobFile, this.safetyFile, this.preventionFile);
        if (success === true) {
            this.props.showConfirmDialog(i18n.t('common.저장'), [i18n.t('msg.저장되었습니다')], [i18n.t('common.확인')], null);
        } else {
            this.props.showConfirmDialog(i18n.t('common.오류'), [msg], [i18n.t('common.확인')], null);
        }

        this.onClickGuideCancle();
    }

    getPopupUI = () => {
        if (this.state.dialog && this.state.dialog.visible) {
            if (this.state.dialog.type === SafetyAreaAssessment.dialogType.receiver) {
                return <EditReceiver
                    onClosePopup={this.onShowPopup}
                    teamDatas={this.props.teamDatas}
                    members={this.props.members}
                    selectedMembers={this.state.dialog.members}
                    currentSiteID={this.props.currentSiteID}
                    onSelectReceiver={this.onSelectReceiver}
                />
            }
        }

        return <></>;
    }

    onClickMembers = (qID, members, e) => {
        const target = e?.target;
        if (!target)
            return;

        if (target.classList.contains("on") === false)
            return;

        // 클릭 이벤트가 상위로 전파되지 않도록
        e.stopPropagation();

        const p = { ...this.state.dialog }
        p.visible = true;
        p.type = SafetyAreaAssessment.dialogType.receiver;
        p.qID = qID;
        p.members = members;

        this.setState({ dialog: p });        
    }

    onShowPopup = (type, show) => {
        if (type === undefined) {
            return;
        }

        const p = { ...this.state.dialog }
        p.visible = show;
        p.type = SafetyAreaAssessment.dialogType.none;
        p.qID = null;
        p.members = [];

        this.setState({ dialog: p })
    }

    // 수신자 선택
    onSelectReceiver = async (selectedMembers) => {
        let members = [];
        let memberIDs = null;
        let memberNames = "-";

        if (selectedMembers) {
            members = selectedMembers;
            
            for (let i = 0; i < selectedMembers.length; i++) {
                const selectedMember = selectedMembers[i];
                
                if (selectedMember.MemberName && selectedMember.MemberName !== "") {                    
                    if (memberNames === "-")
                        memberNames = selectedMember.MemberName;
                    else 
                        memberNames += ", " + selectedMember.MemberName;
                }
                
                if (memberIDs === null)
                    memberIDs = selectedMember.ID.toString();
                else 
                    memberIDs += "," + selectedMember.ID.toString();
            }
        }
            
        const p = { ...this.state.dialog }

        // UI 관련 데이터 수정
        let isChg = false;
        let qList = this.state.qList;
        for (let i = 0; i < qList?.length; i++) {
            const qData = qList[i];
            if (qData.id === p.qID) {
                qData.members = members;
                qData.memberIDs = memberIDs;
                qData.memberNames = memberNames;
                isChg = true;
                break;
            }            
        }

        if (isChg) 
            this.state.qList = qList;

        p.visible = false;
        p.type = SafetyAreaAssessment.dialogType.none;
        p.qID = null;
        p.members = [];

        this.setState({ selectedMembers, dialog: p });
    }

    onClickDeleteQ = () => {
        const qCheckboxs = document.getElementsByClassName("qCheckbox");
        if (!qCheckboxs || qCheckboxs.length === 0)
            return;

        let qList = this.state.qList;
        const qCount = qList?.length;

        if (qCount > 0) {
            for (let i = 0; i < qCheckboxs.length; i++) {
                const qCheckbox = qCheckboxs[i];
                if (qCheckbox.checked === false)
                    continue;

                const qID = parseInt(qCheckbox.value);
                if (qID === NaN)
                    continue;

                for (let j = 0; j < qList.length; j++) {
                    const q = qList[j];
                    if (q.id === qID) {
                        qList.splice(j, 1);
                        break;
                    }
                }
            }

            const qCountAfter = qList?.length;
            if (qCount !== qCountAfter) {
                this.setState({ qList });
            }
        }       
    }

    onClickAllQ = (e) => {
        const target = e.target;
        if (!target)
            return;

        const isChecked = target.checked;

        const qCheckboxs = document.getElementsByClassName("qCheckbox");
        if (!qCheckboxs || qCheckboxs.length === 0)
            return;

        for (let i = 0; i < qCheckboxs.length; i++) {
            const qCheckbox = qCheckboxs[i];
            qCheckbox.checked = isChecked;            
        }
    }

    onClickSave = async () => {
        const activeInputs = document.getElementsByClassName('activeInput');

        for (let i = 0; i < activeInputs?.length; i++) {
            const element = activeInputs[i];
            element.classList.toggle('on');
        }

        let isEditMode = this.state.isEditMode;
        isEditMode = !isEditMode;

        const qList = this.state.qList;

        // DB 저장
        const [suc, message] = await AssessmentController.SaveQList(qList);
        if (suc === false) {
            console.log(message);
            return;
        }

        const qList_backup = qList.slice();

        this.setState({ isEditMode, qList_backup });
    }

    onClickCancle = () => {
        const activeInputs = document.getElementsByClassName('activeInput');

        for (let i = 0; i < activeInputs?.length; i++) {
            const element = activeInputs[i];
            element.classList.toggle('on');
        }

        let isEditMode = this.state.isEditMode;
        isEditMode = !isEditMode;

        // 수정 취소
        const qList_backup = this.state.qList_backup;
        this.state.qList = qList_backup;

        this.setState({ isEditMode });
    }

    handleKeyPress = (e) => {
        if (e.key === "Enter") {
            this.onClickSaerch();
        }
    }

    onClickSaerch = () => {
        let refSearch = this.refSearch.current.value;
        const search = this.state.search;

        if (refSearch === null || refSearch === undefined)
            refSearch = "";

        if (search !== refSearch)
            this.setState({ search: refSearch });
    }

    onSelectFile = (event, fileType) => {
        const file = event.target.files[0];
        //this.refBuildingFile.current.value = "";

        const type = /(.*?)\.(pdf)$/;

        if (!file) {
            // 파일을 선택하지 않을 경우
            // 초기화
            //if (fileType === SDMSResource.assessmentType.environ) {
            //    this.refEnvironFileName.current.textContent = "파일 없음";
            //    this.environFile = null;
            //}
            //else if (fileType === SDMSResource.assessmentType.eqZone) {
            //    this.refEqZoneFileName.current.textContent = "파일 없음";
            //    this.eqZoneFile = null;
            //}
            if (fileType === SDMSResource.assessmentType.currentJob) {
                this.refCurrentJobFileName.current.textContent = "파일 없음";
                this.currentJobFile = null;
            }
            else if (fileType === SDMSResource.assessmentType.safety) {
                this.refSafetyFileName.current.textContent = "파일 없음";
                this.safetyFile = null;
            }
            else if (fileType === SDMSResource.assessmentType.prevention) {
                this.refPreventionFileName.current.textContent = "파일 없음";
                this.preventionFile = null;
            }

            return;
        } else if (!file.name.match(type)) {
            this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('PDF 파일만 업로드 가능합니다')], null, null);
            return;
        } else if (file.size > 10485760) {
            this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('최대 10MB PDF 파일을 업로드 할 수 있습니다')], null, null);
            return;
        }

        const idx = file.name.lastIndexOf('.');
        const fileName = file.name.slice(0, idx);

        //if (fileType === SDMSResource.assessmentType.environ) {
        //    this.refEnvironFileName.current.textContent = fileName;
        //    this.environFile = file;
        //}
        //else if (fileType === SDMSResource.assessmentType.eqZone) {
        //    this.refEqZoneFileName.current.textContent = fileName;
        //    this.eqZoneFile = file;
        //}
        if (fileType === SDMSResource.assessmentType.currentJob) {
            this.refCurrentJobFileName.current.textContent = fileName;
            this.currentJobFile = file;
        }
        else if (fileType === SDMSResource.assessmentType.safety) {
            this.refSafetyFileName.current.textContent = fileName;
            this.safetyFile = file;
        }
        else if (fileType === SDMSResource.assessmentType.prevention) {
            this.refPreventionFileName.current.textContent = fileName;
            this.preventionFile = file;
        }
    }

    displayUploadUI = () => {
        const userAuthor = ProjectResource.getUserAuthor();

        if (userAuthor === AccountResource.accountLevelID.master) {
            return <a className={'guideBtn'} onClick={() => this.guidePop()}></a>;
        }

        return <React.Fragment></React.Fragment>;
    }

    render() {
        const getQList = this.getQList();
        const getPopupUI = this.getPopupUI();
        const displayUploadUI = this.displayUploadUI();

        return (
            <React.Fragment>
                <ModalBackground>
                    <EvaluationTableComponent id={this.props.popupType} className={'viewDashboardBoxD viewDashboardSafetyAreaAssessment'}>
                        <div className={"popupBox"}>
                            <div className='popupboxLine' />
                            <div className={"popupBoxTitle"}>{i18n.t('sdms.safetyAreaAssessment.평가표 관리')}</div>
                            <div className={"popupBoxX"}><a onClick={() => this.props.onClosePopup(SafetyAreaAssessment.dialogType.list, false)}><img src={imgCloseWonik} alt={i18n.t('account.저장되었습니다')} /></a></div>

                            <div className='popupContent'>
                                <div className='menuWrap'>
                                    <p>{i18n.t('account.목록')}</p>
                                </div>
                                <div className={'searchWrap'}>
                                    <input ref={this.refSearch} type="text" id="txtSearch" onKeyPress={this.handleKeyPress} placeholder={i18n.t('account.검색어를 입력해주세요')} />
                                    <a className={'searchBtn'} onClick={this.onClickSaerch}>{i18n.t('account.검색')}</a>
                                    <a className={'editBtn'} onClick={() => this.onClickActiveInput()}>{i18n.t('common.편집')}</a>
                                    {
                                        this.state.isEditMode &&
                                        <a className={'deleteBtn'} onClick={() => this.onClickDeleteQ()}>{i18n.t('common.삭제')}</a>
                                    }                                    
                                    <a className={'setBtn'} onClick={() => this.onClickSmsPop()} >설정</a>
                                    {displayUploadUI}

                                    <GridSettingComponent>
                                        <div className={'guidePopBox'} id={"guidePopBox"}>
                                            <span className={'guideTitle'}>가이드 파일 업로드</span>
                                            {/*
                                            <span className={'guideContsTitle'}>ZONE</span>
                                            <div className={'guideConts'}>
                                                <button className={'guideContsButton'} onClick={() => this.refEqZoneFile.current.click()}>파일선택</button>
                                                <p ref={this.refEqZoneFileName}>파일 없음</p>
                                                <input ref={this.refEqZoneFile} type='file' className={'hidden'} accept='.pdf' onChange={(e) => this.onSelectFile(e, SDMSResource.assessmentType.eqZone)} />
                                            </div>
                                            <span className={'guideContsTitle'}>설비</span>
                                            <div className={'guideConts'}>
                                                <button className={'guideContsButton'} onClick={() => this.refEnvironFile.current.click()}>파일선택</button>
                                                <p ref={this.refEnvironFileName}>파일 없음</p>
                                                <input ref={this.refEnvironFile} type='file' className={'hidden'} accept='.pdf' onChange={(e) => this.onSelectFile(e, SDMSResource.assessmentType.environ)} />
                                            </div>
                                            */}

                                            <span className={'guideContsTitle'}>현업</span>
                                            <div className={'guideConts'}>
                                                <button className={'guideContsButton'} onClick={() => this.refCurrentJobFile.current.click()}>파일선택</button>
                                                <p ref={this.refCurrentJobFileName}>파일 없음</p>
                                                <input ref={this.refCurrentJobFile} type='file' className={'hidden'} accept='.pdf' onChange={(e) => this.onSelectFile(e, SDMSResource.assessmentType.currentJob)} />
                                            </div>

                                            <span className={'guideContsTitle'}>안전/보건</span>
                                            <div className={'guideConts'}>
                                                <button className={'guideContsButton'} onClick={() => this.refSafetyFile.current.click()}>파일선택</button>
                                                <p ref={this.refSafetyFileName}>파일 없음</p>
                                                <input ref={this.refSafetyFile} type='file' className={'hidden'} accept='.pdf' onChange={(e) => this.onSelectFile(e, SDMSResource.assessmentType.safety)} />
                                            </div>

                                            <span className={'guideContsTitle'}>방재/환경</span>
                                            <div className={'guideConts'}>
                                                <button className={'guideContsButton'} onClick={() => this.refPreventionFile.current.click()}>파일선택</button>
                                                <p ref={this.refPreventionFileName}>파일 없음</p>
                                                <input ref={this.refPreventionFile} type='file' className={'hidden'} accept='.pdf' onChange={(e) => this.onSelectFile(e, SDMSResource.assessmentType.prevention)} />
                                            </div>

                                            <span className={'guideConfirmBox'}>
                                                <a onClick={this.onClickGuideCancle}>취소</a>
                                                <a onClick={this.onClickGuideSave}>저장</a>
                                            </span>
                                        </div>
                                    </GridSettingComponent>

                                </div>
                                <section className={'evaluationList'}>
                                    <div>
                                        <ul className={'evaluationListUI'}>
                                            <li style={{ width: '3%' }}><input type="checkbox" className={'evaluationCheckbox'} onClick={(e) => this.onClickAllQ(e)} /></li>
                                            <li style={{ width: '7%' }}>NO.</li>
                                            <li style={{ width: '10%' }}>동</li>
                                            <li style={{ width: '18%' }}>층</li>
                                            <li style={{ width: '15%' }}>구역</li>
                                            <li style={{ width: '15%' }}>수신자</li>
                                            <li style={{ width: '16%' }}>평가대상</li>
                                            <li style={{ width: '16%' }}>수정일자</li>
                                        </ul>
                                    </div>
                                    <div className={'evaluationlistScrollbar'}>
                                        {getQList}
                                    </div>
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
                    </EvaluationTableComponent>

                    <SmsSettingComponent>
                        <div className={'smsPopImage'} id={"smsPop"}>
                            <span className={'smsTitle'}>메일 발송주기 설정</span>
                            <div className={'smsConts'}><input ref={this.refAutoMonth} type="radio" name={"radioAutoType"} /><span className={'smsTab'}>매월(4일)</span></div>
                            <div className={'smsConts'}><input ref={this.refAutoWeek} type="radio" name={"radioAutoType"} /><span className={'smsTab'}>매주(월요일)</span></div>
                            <div className={'smsConts'}><input ref={this.refAutoNone} type="radio" name={"radioAutoType"} /><span className={'smsTab'}>설정 안함</span></div>
                            <span className={'smsConfirmBox'}>
                                <a onClick={this.onClickAutoCancle}>취소</a>
                                <a onClick={this.onClickAutoSave}>저장</a>
                            </span>
                        </div>
                    </SmsSettingComponent>

                </ModalBackground>

                {getPopupUI}
            </React.Fragment>
        );
    }
}


// 저장
export class SafetyConfirmDialog extends Component {
    static keys = [];
    static idxEnter = -1;       // Enter 단축키 인덱스 번호 

	constructor(props) {
        super(props);

        this.refBody = React.createRef();
        this.clickX = 0;
        this.clickY = 0;
        this.moveX = 0;
        this.moveY = 0;
        this.originMoveX = 0;
        this.originMoveY = 0;
    }

    componentDidMount() {
        const body = this.refBody.current;

        if (!body) {
            return;
        }

        // 팝업 마우스 드래그 이벤트 리스너
        this.popupDragMouseMove = (event) => {
            this.moveX = event.clientX - this.clickX + this.originMoveX;
            this.moveY = event.clientY - this.clickY + this.originMoveY;

            body.style.transform = `translate(${this.moveX}px, ${this.moveY}px)`;
        }

        // 단축키 이벤트 리스너
        document.addEventListener("keydown", this.keyFunction, false);
        document.addEventListener("keyup", this.keysReleased, false);
    }

    componentWillUnmount() {
        // 단축키 이벤트 리스너 제거
        document.removeEventListener("keydown", this.keyFunction);
        document.removeEventListener("keyup", this.keysReleased);
    }

    // 팝업 드래그 시작(팝업을 누르고 있을 때)
    popupDragMousePress(event) {
        if (event.button === 0) {
            this.clickX = event.clientX;
            this.clickY = event.clientY;
            
            document.addEventListener('mousemove', this.popupDragMouseMove);
            document.addEventListener('mouseup', this.popupDragMouseUp);
        }
    }

    // 팝업 드래그 종료(mouse up)
    popupDragMouseUp = () => {
        document.removeEventListener('mousemove', this.popupDragMouseMove);
        document.removeEventListener('mouseup', this.popupDragMouseUp);

        this.originMoveX = this.moveX;
        this.originMoveY = this.moveY;
    }

    keyFunction = (e) => this.keysPressed(e, this);

    keysPressed(e, target) {
        // store an entry for every key pressed
        SafetyConfirmDialog.keys[e.keyCode] = true;

        if (SafetyConfirmDialog.keys[27]) {
            // ESC 누를 시 
            target.props.onClosePopup(this.props.type);

            SafetyConfirmDialog.keys[27] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (SafetyConfirmDialog.keys[13]) {
            // Enter 누를 시 
            target.props.onClickButton(SafetyConfirmDialog.idxEnter);

            SafetyConfirmDialog.keys[13] = false;
            // prevent default browser behavior
            e.preventDefault();
        }
    }

    keysReleased(e) {
        // mark keys that were released
        SafetyConfirmDialog.keys[e.keyCode] = false;
    }

    onSave = () => {
        const eleTitle = document.getElementById('qTitle');
        if (eleTitle) {
            if (this.props.type === SafetyAreaAssessment.dialogType.saveAs) {
                this.props.onSave(-1, eleTitle.value);
            }
            else if (this.props.type === SafetyAreaAssessment.dialogType.save) {
                this.props.onSave(!this.props.selectedQ || this.props.selectedQ === null ? -1 : this.props.selectedQ.id, eleTitle.value);
            }
        }
    }

    getMessage() {
        const messages = [];
        let input = '';

        if(!this.props.inputItem){
            this.props.messages.map((message, index) => {
                messages.push(
                    <p key={"message_" + index}>{message}</p>
                );
            });
        } else {
            this.props.messages.map((message, index) => {
                messages.push(
                    <p key={"message_" + index}>{message}</p>
                );
            });
            input = <div>
                <label htmlFor='areaName'>{i18n.t('sdms.safetyAreaAssessment.항목명')} : </label>
                <input type='text' className='check' id='qTitle' placeholder={this.props.selectedQ && this.props.selectedQ !== null ? this.props.selectedQ.title : ''} />
            </div>;
        }

        return (
            <main>
                {messages}
                {input}
            </main>
            );
    }

    getButtons() {
        const buttons = [];

        if (!this.props.buttons || this.props.buttons.length === 0) {
            buttons.push(
                <button key={"button_0"} className={'close'}>{i18n.t('common.확인')}</button>
            );
        }
        else {
            this.props.buttons.map((button, index) => {
                if (button === i18n.t('common.저장')) {
                    SafetyConfirmDialog.idxEnter = index;

                    buttons.push(
                        <button key={"button_" + index} className={'close'} onClick={this.onSave}>{button}</button>
                    );
                } else {
                    buttons.push(
                        <button key={"button_" + index} className={'close'} onClick={() => this.props.onClosePopup(this.props.type, false)}>{button}</button>
                    );
                }
            });
        }

        return (
            <footer>
                {buttons}
            </footer>
            );
    }

    render() {

		return (
            <ConfirmDialogComponent ref={this.refBody} className={'modal openModal'}>
                <section>
                    <header onMouseDown={(e) => this.popupDragMousePress(e)}>
                        {this.props.title}
                        <button className={'close'} onClick={() => this.props.onClosePopup(this.props.type, false)}> &times; </button>
                    </header>
                    {
                        this.getMessage()
                    }
                    {
                        this.getButtons()
                    }
                </section>
            </ConfirmDialogComponent>
			);
    }
}