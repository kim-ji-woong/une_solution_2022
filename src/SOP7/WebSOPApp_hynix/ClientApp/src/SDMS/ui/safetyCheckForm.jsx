import React, { Component } from 'react';
import { i18n, withTranslation } from '../../language/i18n';
import { AssessmentController } from '../services/assessmentController';
import ProjectResource from '../../Root/resource/id';
import SdmsResource from '../resource/id';

import { SafetyCheckFormComponent, SafetyCheckSubmitComponent } from '../styled/safetyCheckFormStyled';

class SafetyCheckForm extends Component {
    static ETC_ID = -1;

    constructor(props) {
        super(props);

        this.state = {
            submitPageShow: false,
            submitPageMsg: '',
            assessmentID: -1,
            memberID: -1,
            assessmentData: null,
            aList: null,

            mainCategory: 0,
            subCategory: 0
        }

        ProjectResource.loadSiteID();
    }

    componentDidMount() {
        // eslint-disable-next-line no-restricted-globals
        const urlParams = new URL(location.href).searchParams;
        const assessmentID = urlParams.get('assessmentID');
        const memberID = urlParams.get('memberID');

        if (assessmentID === null || memberID === null || assessmentID.legnth === 0 || memberID.length === 0) {
            this.setState({ assessmentID, memberID, submitPageShow: true, submitPageMsg: i18n.t('sdms.safetyCheckForm.잘못된 url입니다')});
            return;
        }

        this.init(assessmentID, memberID);
    }

    async init(assessmentID, memberID) {
        const [success, message, assessmentData, aList] = await AssessmentController.LoadAssessment(assessmentID, memberID);
        if (!success) {
            this.setState({ assessmentID, memberID, submitPageShow: true, submitPageMsg: message });
        } else {
            if (assessmentData.score != null && assessmentData.score >= 0) {
                this.setState({ assessmentID, memberID, assessmentData, aList, submitPageShow: true, submitPageMsg: i18n.t('sdms.safetyCheckForm.이미 완료한 평가입니다')});
            } else {
                this.setState({ assessmentID, memberID, assessmentData, aList });
            }
        }
    }

    onSubmit = async () => {
        //const siteID = ProjectResource.SiteID;

        // 모든 항목 체크여부 확인
        const aList = this.state.aList;
        if (!aList || aList?.length === 0) {
            alert(i18n.t('sdms.safetyCheckForm.제출할 평가 항목이 존재하지 않습니다'));
            return;
        }

        for (let i = 0; i < aList.length; i++) {
            const item = aList[i];

            if (item.score === null || item.score === undefined) {
                alert(i18n.t('sdms.safetyCheckForm.평가하지 않는 항목이 있습니다'));
                return;
            }
            else if (item.memo === null || item.memo === undefined || item.memo?.legnth < 1) {
                alert(i18n.t('sdms.safetyCheckForm.비고를 작성하지 않는 항목이 있습니다. 비고를 모두 작성해주세요.'));
                return;
            }
        }

        const [result, message] = await AssessmentController.SaveAssessment(this.state.assessmentID, this.state.memberID, this.state.aList);
        if (result) {
            this.setState({ submitPageShow: true, submitPageMsg: i18n.t('sdms.safetyCheckForm.안전평가표가 제출되었습니다') });
        } else {
            alert(message);
        }        
    }

    onChangeScore = (score, aID) => {
        const aList = this.state.aList;
        if (aList === null || aList.length === 0) {
            return;
        }

        const length = aList.length;
        for (let i = 0; i < length; i++) {
            const a = aList[i];
            if (a.id === aID) {
                a.score = score;
                this.setState({ aList })
                break;
            }
        }        
    }

    onClickNun = (a, memo) => {
        if (!a)
            return;

        const subTextArea = document.getElementById("subTextArea_" + a.id);
        if (!subTextArea)
            return;

        a.memo = memo;
        subTextArea.value = a.memo;

        this.onChangeScore(4, a.id);
    }

    getAList() {
        //let zoneUI = [];
        //let facilityUI = [];
        let aListUI = [];
        let aList1 = [];
        let aList2 = [];
        let aList3 = [];

        const assessmentData = this.state.assessmentData;
        const aList = this.state.aList;
        if (aList === null || aList.length === 0) {
            return [aList1, aList2, aList3];
        }              

        //const siteID = ProjectResource.SiteID;

        const length = aList.length;

        for (let i = 0; i < length; i++) {
            const a = aList[i];

            if (assessmentData.type === SdmsResource.assessmentType.eqZone) {
                if (i < 3) {
                    aList1.push(
                        <React.Fragment key={"subClassFlex_" + a.id}>
                            <div className={'subClassFlex'}>
                                <span className={'subClassConts'}>{i + 1}. {a.contents}</span>
                                <div className={'subClassContsFlex'}>
                                    <span className={'numBoxNone'} onClick={() => this.onClickNun(a, '해당사항 없음')}>해당사항 없음</span>
                                    <span className={'numBoxNone'} onClick={() => this.onClickNun(a, '특이사항 없음')}>특이사항 없음</span>
                                    <span className={a.score === 0 ? 'numBoxActive' : 'numBox'} onClick={() => this.onChangeScore(0, a.id)}>0</span>
                                    <span className={a.score === 2 ? 'numBoxActive' : 'numBox'} onClick={() => this.onChangeScore(2, a.id)}>2</span>
                                    <span className={a.score === 4 ? 'numBoxActive' : 'numBox'} onClick={() => this.onChangeScore(4, a.id)}>4</span>
                                    <span className={'memoBox on'} id={"memoBox_" + a.id} onClick={() => this.onClickShowHide(a)}></span>
                                </div>                            
                            </div>
                            <div className={'subClassContsMemo on'} id={"subClassContsMemo_" + a.id}>
                                <textarea className={'subTextArea'} id={"subTextArea_" + a.id} onChange={(e) => this.onChangeMemo(e, a)} placeholder="비고란을 작성해주세요.">
                                    {(a.memo)}
                                </textarea>
                            </div>
                        </React.Fragment>
                    );
                }
                else if (i < 10) {
                    aList2.push(
                        <React.Fragment key={"subClassFlex_" + a.id}>
                            <div className={'subClassFlex'}>
                                <span className={'subClassConts'}>{i + 1}. {a.contents}</span>
                                <div className={'subClassContsFlex'}>
                                    <span className={'numBoxNone'} onClick={() => this.onClickNun(a, '해당사항 없음')}>해당사항 없음</span>
                                    <span className={'numBoxNone'} onClick={() => this.onClickNun(a, '특이사항 없음')}>특이사항 없음</span>
                                    <span className={a.score === 0 ? 'numBoxActive' : 'numBox'} onClick={() => this.onChangeScore(0, a.id)}>0</span>
                                    <span className={a.score === 2 ? 'numBoxActive' : 'numBox'} onClick={() => this.onChangeScore(2, a.id)}>2</span>
                                    <span className={a.score === 4 ? 'numBoxActive' : 'numBox'} onClick={() => this.onChangeScore(4, a.id)}>4</span>
                                    <span className={'memoBox on'} id={"memoBox_" + a.id} onClick={() => this.onClickShowHide(a)}></span>
                                </div>                                
                            </div>
                            <div className={'subClassContsMemo on'} id={"subClassContsMemo_" + a.id}>
                                <textarea className={'subTextArea'} id={"subTextArea_" + a.id} onChange={(e) => this.onChangeMemo(e, a)} placeholder="비고란을 작성해주세요.">
                                    {(a.memo)}
                                </textarea>
                            </div>
                        </React.Fragment>
                    );
                }
                else {
                    aList3.push(
                        <React.Fragment key={"subClassFlex_" + a.id}>
                            <div className={'subClassFlex'}>
                                <span className={'subClassConts'}>{i + 1}. {a.contents}</span>
                                <div className={'subClassContsFlex'}>
                                    <span className={'numBoxNone'} onClick={() => this.onClickNun(a, '해당사항 없음')}>해당사항 없음</span>
                                    <span className={'numBoxNone'} onClick={() => this.onClickNun(a, '특이사항 없음')}>특이사항 없음</span>
                                    <span className={a.score === 0 ? 'numBoxActive' : 'numBox'} onClick={() => this.onChangeScore(0, a.id)}>0</span>
                                    <span className={a.score === 2 ? 'numBoxActive' : 'numBox'} onClick={() => this.onChangeScore(2, a.id)}>2</span>
                                    <span className={a.score === 4 ? 'numBoxActive' : 'numBox'} onClick={() => this.onChangeScore(4, a.id)}>4</span>
                                    <span className={'memoBox on'} id={"memoBox_" + a.id} onClick={() => this.onClickShowHide(a)}></span>
                                </div>
                            </div>
                            <div className={'subClassContsMemo on'} id={"subClassContsMemo_" + a.id}>
                                <textarea className={'subTextArea'} id={"subTextArea_" + a.id} onChange={(e) => this.onChangeMemo(e, a)} placeholder="비고란을 작성해주세요.">
                                    {(a.memo)}
                                </textarea>
                            </div>
                        </React.Fragment >
                    );
                }
            }
            else {
                aList1.push(
                    <React.Fragment key={"subClassFlex_" + a.id}>
                        <div className={'subClassFlex'}>
                            <span className={'subClassConts'}>{i + 1}. {a.contents}</span>
                            <div className={'subClassContsFlex'}>
                                <span className={'numBoxNone'} onClick={() => this.onClickNun(a, '해당사항 없음')}>해당사항 없음</span>
                                <span className={'numBoxNone'} onClick={() => this.onClickNun(a, '특이사항 없음')}>특이사항 없음</span>
                                <span className={a.score === 0 ? 'numBoxActive' : 'numBox'} onClick={() => this.onChangeScore(0, a.id)}>0</span>
                                <span className={a.score === 2 ? 'numBoxActive' : 'numBox'} onClick={() => this.onChangeScore(2, a.id)}>2</span>
                                <span className={a.score === 4 ? 'numBoxActive' : 'numBox'} onClick={() => this.onChangeScore(4, a.id)}>4</span>
                                <span className={'memoBox on'} id={"memoBox_" + a.id} onClick={() => this.onClickShowHide(a)}></span>
                            </div>                            
                        </div>
                        <div className={'subClassContsMemo on'} id={"subClassContsMemo_" + a.id}>
                            <textarea className={'subTextArea'} id={"subTextArea_" + a.id} onChange={(e) => this.onChangeMemo(e, a)} placeholder="비고란을 작성해주세요.">
                                {(a.memo)}
                            </textarea>
                        </div>
                    </React.Fragment >
                );
            }    
        }

        return [aList1, aList2, aList3];
    }

    onChangeMemo = (e, aItem) => {
        const target = e.target;
        if (!target)
            return;

        const value = target.value;

        aItem.memo = value;
    }

    displayUI = (aList1, aList2, aList3) => {
        let ui = null;
        let mainCategoryUI = null;
        let subCategoryUI = null;
      
        // 현재 선택된 분류 정보 가져오기
        const type = this.state.assessmentData?.type;
        const mainCategory = this.state.mainCategory;
        const subCategory = this.state.subCategory;

        // 분류에 따라 표시할 UI 구성
        if (type === SdmsResource.assessmentType.eqZone) {
            mainCategoryUI = (
                <select className={'safetySelectBox'} onChange={(e) => this.onChangeMainCategory(e)}>
                    <option value={0}>공통 항목</option>
                </select>);

            subCategoryUI = (
                <select className={'safetySelectBox'} onChange={(e) => this.onChangeSubCategory(e)}>
                    <option value={0}>전체</option>
                    <option value={1}>환경</option>
                    <option value={2}>방재</option>
                    <option value={3}>안전보건</option>
                </select>);

            if (subCategory === 1) {
                ui = (
                    <React.Fragment>
                        <div className={'squareTitleBox'}><span className={'squareBox'}></span><span>공통 항목</span></div>
                        <div className={'subClassBox'}>
                            <span className={'subClassTitleBox'}>환경</span>
                            {aList1}
                        </div>
                    </React.Fragment>
                );
            }
            else if (subCategory === 2) {
                ui = (
                    <React.Fragment>
                        <div className={'squareTitleBox'}><span className={'squareBox'}></span><span>공통 항목</span></div>
                        <div className={'subClassBox'}>
                            <span className={'subClassTitleBox'}>방재</span>
                            {aList2}
                        </div>
                    </React.Fragment>
                );
            }
            else if (subCategory === 3) {
                ui = (
                    <React.Fragment>
                        <div className={'squareTitleBox'}><span className={'squareBox'}></span><span>공통 항목</span></div>
                        <div className={'subClassBox'}>
                            <span className={'subClassTitleBox'}>안전보건</span>
                            {aList3}
                        </div>
                    </React.Fragment>
                );
            }
            else {
                ui = (
                    <React.Fragment>
                        <div className={'squareTitleBox'}><span className={'squareBox'}></span><span>공통 항목</span></div>
                        <div className={'subClassBox'}>
                            <span className={'subClassTitleBox'}>환경</span>
                            {aList1}
                            <span className={'subClassTitleBox'}>방재</span>
                            {aList2}
                            <span className={'subClassTitleBox'}>안전보건</span>
                            {aList3}
                        </div>
                    </React.Fragment>
                );
            }
            
        }
        else if (type === SdmsResource.assessmentType.environ) {
            mainCategoryUI = (
                <select className={'safetySelectBox'}>
                    <option>안전환경평가 항목</option>
                </select>);

            subCategoryUI = (
                <select className={'safetySelectBox'}>
                    <option>안전환경</option>
                </select>);

            ui = (
                <React.Fragment>
                    <div className={'squareTitleBox'}><span className={'squareBox'}></span><span>안전환경평가 항목</span></div>
                    <div className={'subClassBox'}>
                        <span className={'subClassTitleBox'}>안전환경</span>
                        {aList1}
                    </div>
                </React.Fragment>
            );
        }
        else if (type === SdmsResource.assessmentType.currentJob) {
            ui = (
                <React.Fragment>
                    <div className={'squareTitleBox'}><span className={'squareBox'}></span><span>현업평가 항목</span></div>
                    <div className={'subClassBox'}>
                        <span className={'subClassTitleBox'}>현업</span>
                        {aList1}
                    </div>
                </React.Fragment>
            );
        }
        else if (type === SdmsResource.assessmentType.safety) {
            ui = (
                <React.Fragment>
                    <div className={'squareTitleBox'}><span className={'squareBox'}></span><span>안전/보건평가 항목</span></div>
                    <div className={'subClassBox'}>
                        <span className={'subClassTitleBox'}>안전/보건</span>
                        {aList1}
                    </div>
                </React.Fragment>
            );
        }
        else if (type === SdmsResource.assessmentType.prevention) {
            ui = (
                <React.Fragment>
                    <div className={'squareTitleBox'}><span className={'squareBox'}></span><span>방재/환경평가 항목</span></div>
                    <div className={'subClassBox'}>
                        <span className={'subClassTitleBox'}>방재/환경</span>
                        {aList1}
                    </div>
                </React.Fragment>
            );
        }
        
        return [ui, mainCategoryUI, subCategoryUI];
    }

    onChangeMainCategory = (e) => {
        const target = e.target;

        const main = parseInt(target.value, 0);
        this.setState({ mainCategory: main });
    }

    onChangeSubCategory = (e) => {
        const target = e.target;

        const sub = parseInt(target.value, 0);
        this.setState({ subCategory: sub});
    }

    onClickReassess = () => {
        this.setState({ submitPageShow: false });
    }

    onClickShowHide = (aItem) => {
        const element = document.getElementById("subClassContsMemo_" + aItem?.id);
        const elementIcon = document.getElementById("memoBox_" + aItem?.id);
        const subTextArea = document.getElementById("subTextArea_" + aItem?.id);

        if (!element || !elementIcon || !subTextArea)
            return;

        if (!element.classList.contains('on') && aItem.memo)
            subTextArea.value = aItem.memo;

        element.classList.toggle('on');
        elementIcon.classList.toggle('on');
    }

    onClickGaideu = () => {
        const type = this.state.assessmentData?.type;
        let pdfURL = "/resource/pdf/wonik/Guide1.pdf";

        if (type === SdmsResource.assessmentType.environ) {
            pdfURL = "/resource/pdf/wonik/Guide2.pdf";
        }
        else if (type === SdmsResource.assessmentType.currentJob) {
            pdfURL = "/resource/pdf/wonik/Guide3.pdf";
        }
        else if (type === SdmsResource.assessmentType.safety) {
            pdfURL = "/resource/pdf/wonik/Guide4.pdf";
        }
        else if (type === SdmsResource.assessmentType.prevention) {
            pdfURL = "/resource/pdf/wonik/Guide5.pdf";
        }

        window.open(pdfURL, "_blank");
    }

    onClickMinimapBox = () => {
        const elementTitle = document.getElementById('zoneTitle');
        const elementArrow = document.getElementById('zoneTitleArrow');
        const elementConts = document.getElementById('minimapConts');

        elementTitle.classList.toggle('on');
        elementArrow.classList.toggle('on');
        elementConts.classList.toggle('on');
    }

    getImageURL() {
        let url = "/resource/image/mapping/mapping_";

        const equipmentZoneID = this.state.assessmentData?.equipmentZoneID > 0 ? this.state.assessmentData.equipmentZoneID : '';

        if (equipmentZoneID >= 1000) {
            url += equipmentZoneID + ".jpg";
        }
        else if (equipmentZoneID >= 100) {
            url += "0" + equipmentZoneID + ".jpg";
        }
        else if (equipmentZoneID >= 10) {
            url += "00" + equipmentZoneID + ".jpg";
        }
        else {
            url += "000" + equipmentZoneID + ".jpg";
        }


        return url;
    }

    render() {
        const [aList1, aList2, aList3] = this.getAList();
        //const displayUI = this.displayUI(aListUI);
        const [ui, mainCategoryUI, subCategoryUI] = this.displayUI(aList1, aList2, aList3);
        const deadline = this.state.assessmentData ? this.state.assessmentData.deadline.replace('T', ' ') : '';
        const zoneName = this.state.assessmentData ? this.state.assessmentData.zoneName : '';

        const url = this.getImageURL(); //'/resource/image/mapping/mapping_*.jpg';

        return (
            <React.Fragment /* style={{ overflow: 'hidden' }} */>
                {
                    !this.state.submitPageShow &&
                    <div style={{ overflowY: 'auto', height: '100vh' }}>
                        <SafetyCheckFormComponent>
                            <div className={'headerBox'}>
                                <div className={'headerFlex'}>
                                    <h1>{i18n.t('sdms.safetyCheckForm.안전평가표')}</h1>
                                    <p></p>
                                </div>
                                <div className={'headerBtnBox'}>
                                    {/* <button>{i18n.t('sdms.safetyCheckForm.양식지우기')}</button> */}
                                    <button onClick={() => this.onClickGaideu()}>가이드</button>
                                    <button onClick={this.onSubmit}>{i18n.t('sdms.safetyCheckForm.제출')}</button>
                                </div>
                            </div>
                            <div className={'zoneTitle'} id={"zoneTitle"}>
                               <p>{zoneName}</p>
                               <span className={'zoneTitleArrow'} id={"zoneTitleArrow"} onClick={() => this.onClickMinimapBox()}></span>
                            </div>
                            <div className={'minimapConts'} id={"minimapConts"}>
                                <img src={url}></img>
                            </div>
                            {/*
                             * 카테고리 삭제 요청 - 2025.06.12 공민수
                            <div className={'mainCategoryBox'}>
                              {mainCategoryUI}
                            </div>

                            {subCategoryUI}
                            */}
                            {ui}
                        
                        </SafetyCheckFormComponent>
                    </div>
                }

                {
                    this.state.submitPageShow &&
                    <SafetyCheckSubmit message={this.state.submitPageMsg} onClickReassess={this.onClickReassess} />
                }
            </React.Fragment>
        );
    }
}

export default withTranslation()(SafetyCheckForm);



class SafetyCheckSubmit extends Component {
    constructor(props) {
        super(props);

    }

    onClickLink = () => {
        let pdfURL = "http://she.wonik.com/ncac/reg/list.do"; // 링크 수정 요청 - 2025.06.12 공민수 (기존 url "http://she.wonik.com/mnglogin.do";)
        window.open(pdfURL, "_blank");
    }

    render() {
        
        return (
            <SafetyCheckSubmitComponent>
                <header>
                    <h1>{i18n.t('sdms.safetyCheckForm.안전평가표')}</h1>
                    <button onClick={this.props.onClickReassess}>{i18n.t('sdms.safetyCheckForm.재평가')}</button>
                </header>
                <p>{this.props.message}</p>
                <section>
                    <div>시정개선 업로드를 위한</div>
                    <div onClick={() => this.onClickLink()}>SHE 통합시스템 바로가기<span></span></div>
                </section>
            </SafetyCheckSubmitComponent>
        );
    }
}
