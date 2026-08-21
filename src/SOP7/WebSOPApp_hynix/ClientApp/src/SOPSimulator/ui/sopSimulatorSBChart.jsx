import React, { Component } from 'react';
import SectionPanel from '../../Common/sections/sectionPanel';

import sectionStyles from '../../Common/css/section.module.css';
import uneStyles from '../../Common/css/uneCommon.module.css';
import uis from '../../Common/css/ui.module.css';
import apps from '../css/app.module.css';
import $ from 'jquery';

import { SubSectionProgressViewWrap, ChartWrap } from '../styled/sopSimulatorStyled';

import ProjectResource from '../../Root/resource/id';
import AccountResource from '../../Account/resource/id';
import SopManagerResource from '../../SOPManager/resource/id';
import { i18n, withTranslation, i18nUtil } from '../../language/i18n';

class SopSimulatorSBChart extends Component {
    static cellDefaultWidth = 300;
    static cellDefaultHeight = 200;
    static gridHeaderMargin = 50;
    static scrollCenterWidth = 180;

    constructor(props) {
        super(props);

        this.state = {
            currentMenu: { menuType: "" },
            editDatas:
            {
                command: "",
                sectionCellDatas: null,
            },
            selectedSectionData: [],
            firstUpdateChk: false,      // SOP Chart 불러오기 유무 판단

        }

        this.props = props;
        this.showConfirmDialog = this.showConfirmDialog.bind(this);
        this.onClickEditSOP = this.onClickEditSOP.bind(this);
    }

    /*워터마크*/
/*    watermarkplay() {
        $('#' + apps.watermark).hide(); 
        $('#' + apps.waterbtn).click(function () {
            if ($('#' + apps.watermark).css('display') == 'none') {
                $('#' + apps.watermark).show();
            } else {
               $('#' + apps.watermark).hide();
            }
        });
    }*/

    componentDidMount() {        
        //this.watermarkplay();

        /*function btnActive() {
            const target = document.getElementById('target_btn');
            target.disabled = false;
        }*/

    }


    componentDidUpdate(prevProps, prevState) {
        // SOP Chart 첫 업데이트 시 or 탭을 클릭하여 SOP Chart를 변경하였을때
        if (this.state.firstUpdateChk !== true || prevProps.sopTabIndex !== this.props.sopTabIndex)
            this.selectCurrentComponent();

        // 부모에서 현재 컴포넌트를 변경하였을 경우
        if (prevProps.currentSection !== this.props.currentSection) {
            // 현재 Section 조회
            let currentActionStep = this.props.sopData?.currentActionStep;

            let sectionData = null;
            if (this.props.currentSection?.length > 0) {
                const lastIndex = this.props.currentSection.length - 1;
                sectionData = this.props.currentSection[lastIndex];
            }

            // 현재 Section Component 체크하기
            this.setState({ selectedSectionData: [sectionData, currentActionStep] });

            // 실행중인 컴포넌트로 자동 화면 이동
            if (this.props.commonSettings.UseAutoMoveSOPScreen === 'true') {
                this.gridCenterForcus(sectionData?.gridRowIndex, sectionData?.gridColumnIndex);
            }
        }
    }

    selectCurrentComponent = () => {
        // 현재 Section 조회
        let currentActionStep = this.props.sopData?.currentActionStep;
        let sectionData = null;

        if (this.props.currentSection?.length > 0) {
            const lastIndex = this.props.currentSection.length - 1;
            sectionData = this.props.currentSection[lastIndex];
        }

        // 현재 Section Component 체크하기
        this.setState({ selectedSectionData: [sectionData, currentActionStep] });
        this.gridCenterForcus(sectionData?.gridRowIndex, sectionData?.gridColumnIndex);
        
        // 첫 업데이트 체크 >> SOP Chart 불러오기 유무 판단
        this.setState({ firstUpdateChk: true });
    }

    onSelectComponent = (sectionData, actionStep) => {
        // 선택된 sectionData 전달하기
        if (this.props.onSelectComponent(sectionData, null)) {
            this.setState({ selectedSectionData: [sectionData, actionStep] });
            this.gridCenterForcus(sectionData?.gridRowIndex, sectionData?.gridColumnIndex);
        }
    }

    toOriginalLocation = () => {
        if (this.props.currentSection?.length > 0) {
            const lastIndex = this.props.currentSection.length - 1;
            const sectionData = this.props.currentSection[lastIndex];

            this.gridCenterForcus(sectionData.gridRowIndex, sectionData.gridColumnIndex);
        }
    }

    // toOriginalLocation = () => {
    //     this.gridCenterForcus(this.props.currentSection.gridRowIndex, this.props.currentSection.gridColumnIndex);
    // }

    gridCenterForcus = (rowIndex, columnIndex) => {
        if (rowIndex === null || rowIndex === undefined) {
            rowIndex = 0;
        }
        if (columnIndex === null || columnIndex === undefined) {
            columnIndex = 0;
        }

        // 그리드 계산
        let width = (SopSimulatorSBChart.cellDefaultWidth * columnIndex) - SopSimulatorSBChart.scrollCenterWidth;
        let height = SopSimulatorSBChart.gridHeaderMargin + (SopSimulatorSBChart.cellDefaultHeight * rowIndex);

        // 스크롤 이동
        //$('.' + sectionStyles.sectionPanel).scrollLeft(width);
        //$('.' + sectionStyles.sectionPanel).scrollTop(height);
        // 애니메이션 효과
        $('.sectionPanel').animate({ scrollTop: height, scrollLeft: width }, 500);
    }

    getSectionData() {
        if (this.state.selectedSectionData && this.state.selectedSectionData.length >= 2) {
            return [this.state.selectedSectionData[0], this.state.selectedSectionData[1]];
        }

        return [null, null];
    }

    onSelectArrow = (arrow, actionStep) => {
        
    }

    getSOPName() {
        let sopName = '';
        if (this.props.sopData?.disaster?.disasterName) {
            sopName = i18nUtil.convertText(this.props.sopData.disaster.disasterName) + ' ';

            if (this.props.sopData.disaster.version) {
                //const mode = this.state.sopData.disaster.version.isNormal ? "(" + SopManagerResource.ID.sopMode.day + ")" : "(" + SopManagerResource.ID.sopMode.night + ")";
                //return sopName + mode;
            }
        }

        if (this.props.sopData?.alarmDateTime && this.props.sopData?.alarmPosition) {
            sopName += this.props.sopData?.alarmDateTime + this.props.sopData?.alarmPosition;
        }

        return sopName;
    }

    // SOP 단계 버튼 클릭시 작동 핸들러 
    onClickStep(e) {
        let target = e;

        // 해당 단계 sop 내용이 없는 버튼이라면 return
        if ($(target).closest('li').hasClass('unActive') !== true)
            return;

        $('.btnActionStep').closest('li.' + 'isActive').removeClass('isActive').addClass('unActive');
        $(target).closest('li').removeClass('unActive').addClass('isActive');

        /* test */
        $('isActive').show('actCircle');


        // 현재 SOP ID 및 단계 정보 얻어오기
        let stepName = target.innerText;
        let sopID = null;
        let actionStepDatas = this.props.sopData?.actionStepDatas;

        for (let i = 0; i < actionStepDatas.length; i++) {
            let actionStepData = actionStepDatas[i];

            if (stepName === actionStepData.stepName) {
                sopID = actionStepData.actionStep?.id;
            }
        }

        // 해당 SOP ID가 없다면 리턴 
        if (sopID === null)
            return;

        // 첫 업데이트 체크 해제 >> SOP Chart 불러오기 유무 판단
        this.setState({ firstUpdateChk: false });

        // 값 전달하기
        this.props.onChangeActionStep(stepName, sopID);
        return;
    }

    // SOP 단계 버튼영역 생성
    getActionStepArea() {
        let class_1st = "btnActionStep " + 'class1st';
        let class_2nd = "btnActionStep " + 'class2nd';
        let class_3rd = "btnActionStep " + 'class3rd';
        let class_4th = "btnActionStep " + 'class4th';

        let actionStepArea = [];

        const siteID = ProjectResource.SiteID;
        let class_1stTlb = "btnActionStep " + 'class1stTlb';
        let class_2ndTlb = "btnActionStep " + 'class2ndTlb';
        let class_3rdTlb = "btnActionStep " + 'class3rdTlb';
        let class_4thTlb = "btnActionStep " + 'class4thTlb';


        // 현재 단계 및 단계 유무 파악
        const stepDatas = this.props.sopData.actionStepDatas;
        const stepDatasLength = stepDatas.length;

        for (let i = 0; i < stepDatasLength; i++) {
            let stepData = stepDatas[i];

            // 단계별 데이터가 존재한다면
            if (stepData.actionStep != null) {
                if (stepData.stepName === SopManagerResource.actionStep._1st) {
                    if (this.props.sopData.currentActionStep.stepName === stepData.stepName) {
                        class_1st += " " + 'isActive';
                        class_1stTlb += " " + 'isActive';
                    }
                    else {
                        class_1st += " " + 'unActive';
                        class_1stTlb += " " + 'unActive';
                    }

                    if (stepData._ActionStepHistory) {
                        class_1st += " " + 'actCircle';
                        class_1stTlb += " " + 'actCircle';
                    }                    
                } else if (stepData.stepName === SopManagerResource.actionStep._2nd) {
                    if (this.props.sopData.currentActionStep.stepName === stepData.stepName) {
                        class_2nd += " " + 'isActive';
                        class_2ndTlb += " " + 'isActive';
                    }
                    else {
                        class_2nd += " " + 'unActive';
                        class_2ndTlb += " " + 'unActive';
                    }

                    if (stepData._ActionStepHistory) {
                        class_2nd += " " + 'actCircle';
                        class_2ndTlb += " " + 'actCircle';
                    }                    
                } else if (stepData.stepName === SopManagerResource.actionStep._3rd) {
                    if (this.props.sopData.currentActionStep.stepName === stepData.stepName) {
                        class_3rd += " " + 'isActive';
                        class_3rdTlb += " " + 'isActive';
                    }
                    else {
                        class_3rd += " " + 'unActive';
                        class_3rdTlb += " " + 'unActive';
                    }

                    if (stepData._ActionStepHistory) {
                        class_3rd += " " + 'actCircle';
                        class_3rdTlb += " " + 'actCircle';
                    }                    
                } else if (stepData.stepName === SopManagerResource.actionStep._4th) {
                    if (this.props.sopData.currentActionStep.stepName === stepData.stepName) {
                        class_4th += " " + 'isActive';
                        class_4thTlb += " " + 'isActive';
                    }
                    else {
                        class_4th += " " + 'unActive';
                        class_4thTlb += " " + 'unActive';
                    }

                    if (stepData._ActionStepHistory) {
                        class_4th += " " + 'actCircle';
                        class_4thTlb += " " + 'actCircle';
                    }                    
                }

            }
        }

        // HTML 작성
       
        if (siteID === ProjectResource.Site.Tlb) {
            if (SopManagerResource.actionStep._1st.length > 0 && siteID === ProjectResource.Site.Tlb)
                actionStepArea.push(<li key={'class_1stTlb'} className={class_1stTlb}><button type="button" className={"value"} onClick={(e) => this.onClickStep(e.target)}>{SopManagerResource.actionStep._1st}</button></li>);
            if (SopManagerResource.actionStep._2nd.length > 0 && siteID === ProjectResource.Site.Tlb)
                actionStepArea.push(<li key={'class_2ndTlb'} className={class_2ndTlb}><button type="button" className={"value"} onClick={(e) => this.onClickStep(e.target)}>{SopManagerResource.actionStep._2nd}</button></li>);
            if (SopManagerResource.actionStep._3rd.length > 0 && siteID === ProjectResource.Site.Tlb)
                actionStepArea.push(<li key={'class_3rdTlb'} className={class_3rdTlb}><button type="button" className={"value"} onClick={(e) => this.onClickStep(e.target)}>{SopManagerResource.actionStep._3rd}</button></li>);
            if (SopManagerResource.actionStep._4th.length > 0 && siteID === ProjectResource.Site.Tlb)
                actionStepArea.push(<li key={'class_4thTlb'} className={class_4thTlb}><button type="button" className={"value"} onClick={(e) => this.onClickStep(e.target)}>{SopManagerResource.actionStep._4th}</button></li>);
        } else {
            if (SopManagerResource.actionStep._1st.length > 0)
                actionStepArea.push(<li key={'class_1st'} className={class_1st}><button type="button" className={"value"} onClick={(e) => this.onClickStep(e.target)}>{SopManagerResource.actionStep._1st}</button></li>);
            if (SopManagerResource.actionStep._2nd.length > 0)
                actionStepArea.push(<li key={'class_2nd'} className={class_2nd}><button type="button" className={"value"} onClick={(e) => this.onClickStep(e.target)}>{SopManagerResource.actionStep._2nd}</button></li>);
            if (SopManagerResource.actionStep._3rd.length > 0)
                actionStepArea.push(<li key={'class_3rd'} className={class_3rd}><button type="button" className={"value"} onClick={(e) => this.onClickStep(e.target)}>{SopManagerResource.actionStep._3rd}</button></li>);
            if (SopManagerResource.actionStep._4th.length > 0)
                actionStepArea.push(<li key={'class_4th'} className={class_4th}><button type="button" className={"value"} onClick={(e) => this.onClickStep(e.target)}>{SopManagerResource.actionStep._4th}</button></li>);
        }

        //actionStepArea = <>
        //    <li className={class_1st}><button type="button" className={"value"} onClick={(e) => this.onClickStep(e.target)}>{SopManagerResource.ID.actionStep._1st}</button></li>
        //    <li className={class_2nd}><button type="button" className={"value"} onClick={(e) => this.onClickStep(e.target)}>{SopManagerResource.ID.actionStep._2nd}</button></li>
        //    <li className={class_3rd}><button type="button" className={"value"} onClick={(e) => this.onClickStep(e.target)}>{SopManagerResource.ID.actionStep._3rd}</button></li>
        //    <li className={class_4th}><button type="button" className={"value"} onClick={(e) => this.onClickStep(e.target)}>{SopManagerResource.ID.actionStep._4th}</button></li>
        //</>;

        return actionStepArea;
    }

    showConfirmDialog() {
        // 권한 (사용자 등급은 실행 권한 없음)
        const userAuth = ProjectResource.getUserInfo();
        if (!userAuth || userAuth === null || userAuth.levelID === AccountResource.accountLevelID.user) {
            this.props.showConfirmDialog(i18n.t('common.권한'), i18n.t('sopSimulator.formText.해당 로그인 사용자는 편집 권한이 없습니다'), [i18n.t('common.확인')], null);
            return;
        }

        this.props.showConfirmDialog(i18n.t('sopSimulator.formText.알림'),
            i18n.t('sopSimulator.formText.SOP는 종료 후 수정 할 수 있습니다. 종료할까요 ?')
            , [i18n.t('sopSimulator.formText.종료 후 열기'), i18n.t('sopSimulator.formText.종료하지 않고 열기'), i18n.t('common.취소')], this.onClickEditSOP);
    }

    onClickEditSOP(index) {        
        if (index === 0) {
            this.props.closeSOP();
        }

        if (index <= 1) {
            window.open("/sop-manager?sop=" + this.props.sopData.version.id, '_blank');
        }

        this.props.onCloseConfirmDialog();
    }

    render() {
        const [sectionData, /*actionStep*/] = this.getSectionData();

        let sopName = "";
        sopName = this.getSOPName();

        // SOP 단계 버튼영역 생성
        let btnActionStepArea = this.getActionStepArea();

        return (
          <>
                {/*soulbrainchart*/}
                
                <SubSectionProgressViewWrap className={'progressViewWrap'} >
                    <div className={'tit'}>
                        <strong>{sopName}</strong>
                        {
                            /*
                            <select id="" value="훈련모드" onChange={() => { }} className={uneStyles.modeSelect}>
                                <option>훈련모드</option>
                                <option>실제모드</option>
                            </select>
                            */
                        }
                        <div className={'btnArea'}>
                            <button className={'btnMod'} onClick={this.showConfirmDialog}><i className={'iconMod'}></i></button>
                            <button className={'btnPlay'} onClick={this.props.beginSopData}><i className={'iconPlay'}></i></button>
                            <button className={'btnEnd'} onClick={() => this.props.closeSOP(false)}><i className={'iconEnd'}></i></button>
                        </div>
                    </div>
                    <ChartWrap className={'chartWrap'}>
                        <ul className={'infoList'}>
                            {btnActionStepArea}
                        </ul>

                        <div className={'chartArea'}>
                            <section className={'panelAreas'}>
                                {/*<button id={apps.waterbtn}>훈련모드</button>*/}
                                <button id={'refresh'} onClick={this.toOriginalLocation}></button>
                                {/* 실행모드일 경우 Cell hover 테두리 제거를 위해서 apps.sectionPanels 클래스 네임 선언 */}
                                    <div className={'sectionPanels'}>
                                        <SectionPanel
                                            currentMenu={this.state.currentMenu}
                                            selectedSectionData={sectionData}
                                            editDatas={this.state.editDatas}
                                            onProcessEdit={""}
                                            onSelectComponent={this.onSelectComponent}
                                            selectedArrowData={""}
                                            onAddComponent={""}
                                            onRemoveComponent={""}
                                            onSelectArrow={this.onSelectArrow}
                                            sopData={this.props.sopData}
                                            rowCount={30}
                                            columnCount={30}
                                            mode={"exec"}
                                            showConfirmDialog={this.props.showConfirmDialog}
                                            />
                                    {/*<div id={apps.watermark}>Training mode</div>*/}
                                    {/*<div id={apps.watermark}>훈련모드</div>*/}
                                    </div>
                                </section>
                            </div>

                    </ChartWrap>
                </SubSectionProgressViewWrap>
                {/*soulbrainchart*/}

       </>
    );
  }
}

export default withTranslation()(SopSimulatorSBChart);