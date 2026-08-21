import React, { Component } from 'react';
import { BrowserRouter as Route, Link } from 'react-router-dom';
import $ from 'jquery';
// import uis from '../../Common/css/ui.module.css';
import SopController from '../../SOPManager/services/sopController';
import apps from '../css/app.module.css';
import { SettingController } from '../../Settings/services/settingController';

import ProjectResource from '../../Root/resource/id';
import SopSimulatorResource from '../resource/id';

import { i18n, withTranslation, i18nUtil } from '../../language/i18n';

// styled-components 변환 완료
import { SimulatorSBcallSection, AppContainer, SubSectionMenualListWrap, SubSectionBoardListWrap, Noti, CGreenNoti, Date, InnerSection, NumList } from '../styled/sopSimulatorStyled';

class SopSimulatorSBcall extends Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            disasterCategories: [],
            disasterCategoriesEmergency: [],
            isNormal: true,
            isEmergency: false,
            selectedCampusCategory: null, // 캠퍼스 선택
            selectedDisasterCategory: null, // 재난분야
            selectedSubDisasterCategory: null,      // 재난종류
            selectedDisaster: null,         // 재난상황
            selectedVersion: null           // 선택 SOP
        };
    }

    componentDidMount() {
        this.getDisasterCategories();
        $('html, body').css({ 'display': 'block', 'height': '100%', 'overflow': 'hidden', 'color': '#fff' });
        // 각 페이지 별로 클래스 초기화
        $('#subPage').removeClass('sop');

        /*$('.' + uis.list).on('click', function () {
            var isShow = $(this).attr('list');

            $('.' + uis.list).removeClass('isShow');
            $(this).addClass('isShow');
            $('.' + isShow).addClass('isShow');
        });*/


        // E-SOP 매뉴얼 Left List Toggle
        $('.menualListWrap').on('click', 'dt', function () {
            $(this).closest('.list').toggleClass('isShow').siblings().removeClass('isShow');
        });

        // 캠퍼스선택 버튼 이벤트 주석처리 >> campusCategory 버튼이 추후에 생성되어 이벤트 핸들러가 적용이 안됨.
        //$('.campusCategory dd ul').on('click', 'li', function () {
        //    $('.campusCategory').removeClass('isShow');
        //    $('.category').addClass('isShow');
        //});

        // 재난분야 버튼 이벤트
        $('.category dd ul').on('click', 'li', function () {
            //console.log("재난분야 버튼 테스트");

            // 재난분야 메뉴 닫기
            $('.category').removeClass('isShow');
            // 재난종류 메뉴 열기
            $('.subCategory').addClass('isShow');
        });

        // 재난종류 버튼 이벤트
        $('.subCategory dd ul').on('click', 'li', function () {
            //console.log("재난종류 버튼 테스트");
        });

        // 페이지 타이틀 
        $('#pageTitle').text("E-SOP");
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.selectedSiteID !== this.props.selectedSiteID) {
            this.getDisasterCategories();
        }
    }

    async getDisasterCategories() {
        if (ProjectResource.styleMode === ProjectResource.StyleType.Gyeonggi) {
            if (this.props.selectedSiteID) {
                const [disasterCategories, message] = await SopController.disasterCategories(true, this.props.selectedSiteID);
                console.log(disasterCategories);
                const [disasterCategoriesEmergency, message2] = await SopController.disasterCategories(false, this.props.selectedSiteID);
        
                const isNormal = await this.getWorkingTime();
                const isEmergency = !isNormal;
        
                this.setState({ disasterCategories, disasterCategoriesEmergency, isNormal, isEmergency });
            }
        }
        else {
            const [disasterCategories, message] = await SopController.disasterCategories(true, this.props.selectedSiteID);
            console.log(disasterCategories);
            const [disasterCategoriesEmergency, message2] = await SopController.disasterCategories(false, this.props.selectedSiteID);
    
            const isNormal = await this.getWorkingTime();
            const isEmergency = !isNormal;
    
            this.setState({ disasterCategories, disasterCategoriesEmergency, isNormal, isEmergency });
        }
    }

    async getWorkingTime() {
        try {
            const settings = await SettingController.requestSopCommonSettings();
            if (!settings || settings.length === 2) {

                const begin = settings[0].WorkingBeginHour?.split(':');
                const end = settings[0].WorkingEndHour?.split(':');

                if (begin.length != 2 || end.length != 2)
                    return true; // 주간 근무시간 설정 안되어 있으면 그냥 주간으로 간주한다

                const beginHours = Number(begin[0]);
                const beginTime = Number(begin[1]);
                const endHours = Number(end[0]);
                const endTime = Number(end[1]);

                let now = new Date();
                let day = now.getDay();

                let beginDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), beginHours, beginTime);
                let endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHours, endTime);

                if (day >= 1 && day <= 5 && now >= beginDate && now <= endDate) { // 평일 근무시간인가?
                    return true;
                }

                return false;
            }
        } catch (e) {
            return true;
        }
    }

    onSelectCampusCategory = (campusCategoryData) => {
        // 캠퍼스선택 메뉴 닫기
        $('.campusCategory').removeClass('isShow');
        // 재난분야 메뉴 열기
        $('.category').addClass('isShow');

        this.setState({ selectedCampusCategory: campusCategoryData,  selectedDisasterCategory: null, selectedSubDisasterCategory: null });
    }

    onSelectDisasterCategory = (disasterCategoryData) => {
        this.setState({ selectedDisasterCategory: disasterCategoryData, selectedSubDisasterCategory: null });
    }

    onSelectSubDisasterCategory = (subDisasterCategoryData) => {
        this.setState({ selectedSubDisasterCategory: subDisasterCategoryData });
    }

    onSelectVersion = (versionID) => {
        this.props.openDB(versionID, null);
    }

    onChangeNormal = () => {
        this.setState({ isNormal: !this.state.isNormal });
    }
    onChangeEmergency = () => {
        this.setState({ isEmergency: !this.state.isEmergency });
    }

    SetDisasterUI() {
        if (this.state.disasterCategories === null || this.state.disasterCategoriesEmergency === null)
            return;
        
        var campusCategory = [];
        var disasterCategory = [];
        var subDisasterCategory = [];
        var disaster = [];

        disasterCategory.push(
            <li className={'isActive'} key={'disasterCategory/'}>
                <a className={'btnList'} onClick={() => this.onSelectDisasterCategory(null)}>
                    {i18n.t('common.전체')}
                </a>
            </li>
        );

        subDisasterCategory.push(
            <li key={'subDisasterCategory/'}>
                <a className={'btnList'} onClick={() => this.onSelectSubDisasterCategory(null)}>
                    {i18n.t('common.전체')}
                </a>
            </li>
        );

        // 멀티 사이트일때만
        if (this.props.siteList && this.props.siteList.length > 1) {
            this.props.siteList.map((item, index) => {
                campusCategory.push(
                    <li className={'isActive'} key={'campusCategory_' + index} onClick={() => this.onSelectCampusCategory(item)}>
                        {item}
                    </li>  
                )
            });
        }

        if (this.state.isNormal) {
            for (var i = 0; i < this.state.disasterCategories?.length; i++) {
                const dc = this.state.disasterCategories[i];
                if (ProjectResource.SiteID === ProjectResource.Site.Hydrogen) {
                    // 수소 평가용 하드코딩
                    if (ProjectResource.targetLanguage === "ko" && (dc.disasterCategory.categoryName === "Fire" || dc.disasterCategory.categoryName === "Leak accident")) {
                        continue;
                    }
                    if (ProjectResource.targetLanguage === "en" && (dc.disasterCategory.categoryName === "화재" || dc.disasterCategory.categoryName === "누출사고")) {
                        continue;
                    }
                }

                disasterCategory.push(
                    <li className={'isActive'} key={'disasterCategory/' + dc.disasterCategory.id}>
                        <a className={'btnList'} key={dc} onClick={() => this.onSelectDisasterCategory(dc.disasterCategory)}>
                            {i18nUtil.convertText(dc.disasterCategory.categoryName)}
                        </a>
                    </li>
                );

                for (var j = 0; j < dc.subDisasterCategories.length; j++) {
                    const sdc = dc.subDisasterCategories[j];
                    if (this.state.selectedDisasterCategory === null || this.state.selectedDisasterCategory.id === sdc.subDisasterCategory.disasterCategoryID) {

                        subDisasterCategory.push(
                            <li key={'subDisasterCategory/' + sdc.subDisasterCategory.id}>
                                <a className={'btnList'} key={sdc} onClick={() => this.onSelectSubDisasterCategory(sdc.subDisasterCategory)}>
                                    {i18nUtil.convertText(sdc.subDisasterCategory.subCategoryName)}
                                </a>
                            </li>
                        );



                        for (var k = 0; k < sdc.disasterDatas.length; k++) {
                            const d = sdc.disasterDatas[k];
                            const allVersions = [];
                            for (var q = 0; q < d.disasterDatas.length; q++) {
                                if (this.state.selectedSubDisasterCategory === null || this.state.selectedSubDisasterCategory.id === d.disasterDatas[q].disaster.subDisasterCategoryID) {
                                    const isNormal = d.disasterDatas[q].version?.isNormal;
                                    if ((isNormal && this.state.isNormal) || (!isNormal && this.state.isEmergency)) {
                                        allVersions.push(d.disasterDatas[q].version);
                                    }
                                }
                            }

                            let lastAccessVersion = (allVersions.length > 0) ? allVersions[0] : null;
                            for (var q = 0; q < allVersions.length; q++) {
                                if (allVersions.length - 1 >= q + 1) {
                                    if (lastAccessVersion < allVersions[q + 1].lastAccessTime) {
                                        lastAccessVersion = allVersions[q + 1];
                                    }
                                }
                            }

                            if (lastAccessVersion !== null) {
                                const lastAccessTime = lastAccessVersion.lastAccessTime.replace('T', ' '); //this.getMakeDateTime(lastAccessVersion.lastAccessTime);

                                disaster.push(
                                    <li key={'disaster/' + lastAccessVersion.id}>
                                        <a key={d} onClick={() => this.onSelectVersion(lastAccessVersion.id)}>
                                            <p>
                                                {i18nUtil.convertText(dc.disasterCategory.categoryName)}
                                                    &nbsp;&gt;&nbsp;
                                                {i18nUtil.convertText(sdc.subDisasterCategory.subCategoryName)}
                                                    &nbsp;&gt;&nbsp;
                                                {i18nUtil.convertText(d.disasterName)}
                                            </p>
                                            {
                                                (lastAccessVersion.isNormal)
                                                    ? <Noti>{i18n.t('sopSimulator.formText.평일/주간')}</Noti>
                                                    : <CGreenNoti>{i18n.t('sopSimulator.formText.휴일/야간')}</CGreenNoti>
                                            }
                                            <Date>{lastAccessTime}</Date>
                                        </a>
                                    </li>
                                );
                            }
                        }
                    }
                }
            }
        }

        if (this.state.isEmergency) {
            for (var i = 0; i < this.state.disasterCategoriesEmergency.length; i++) {
                const dc = this.state.disasterCategoriesEmergency[i];
                
                for (var j = 0; j < dc.subDisasterCategories.length; j++) {
                    const sdc = dc.subDisasterCategories[j];
                    if (this.state.selectedDisasterCategory === null || this.state.selectedDisasterCategory.id === sdc.subDisasterCategory.disasterCategoryID) {

                        for (var k = 0; k < sdc.disasterDatas.length; k++) {
                            const d = sdc.disasterDatas[k];
                            const allVersions = [];
                            for (var q = 0; q < d.disasterDatas.length; q++) {
                                if (this.state.selectedSubDisasterCategory === null || this.state.selectedSubDisasterCategory.id === d.disasterDatas[q].disaster.subDisasterCategoryID) {
                                    const isNormal = d.disasterDatas[q].version.isNormal;
                                    if ((isNormal && this.state.isNormal) || (!isNormal && this.state.isEmergency)) {
                                        allVersions.push(d.disasterDatas[q].version);
                                    }
                                }
                            }

                            let lastAccessVersion = (allVersions.length > 0) ? allVersions[0] : null;
                            for (var q = 0; q < allVersions.length; q++) {
                                if (allVersions.length - 1 >= q + 1) {
                                    if (lastAccessVersion < allVersions[q + 1].lastAccessTime) {
                                        lastAccessVersion = allVersions[q + 1];
                                    }
                                }
                            }

                            if (lastAccessVersion !== null) {
                                const lastAccessTime = lastAccessVersion.lastAccessTime.replace('T', ' ');//this.getMakeDateTime(lastAccessVersion.lastAccessTime);
                                disaster.push(
                                    <li key={'disaster/' + lastAccessVersion.id}>
                                        <a key={d} onClick={() => this.onSelectVersion(lastAccessVersion.id)}>
                                            <p>
                                                {i18nUtil.convertText(dc.disasterCategory.categoryName)}
                                                    &nbsp;&gt;&nbsp;
                                                {i18nUtil.convertText(sdc.subDisasterCategory.subCategoryName)}
                                                    &nbsp;&gt;&nbsp;
                                                {i18nUtil.convertText(d.disasterName)}
                                            </p>
                                            {
                                                (lastAccessVersion.isNormal)
                                                    ? <Noti>{i18n.t('sopSimulator.formText.평일/주간')}</Noti>
                                                    : <CGreenNoti>{i18n.t('sopSimulator.formText.휴일/야간')}</CGreenNoti>
                                            }
                                            <Date>{lastAccessTime}</Date>
                                        </a>
                                    </li>
                                );
                            }
                        }
                    }
                }
            }
        }
                
        return [campusCategory, disasterCategory, subDisasterCategory, disaster];
    }

    getMakeDateTime = (dateTime) => {
        let year = dateTime.getFullYear();
        let month = 1 + dateTime.getMonth();
        month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
        let day = dateTime.getDate();                   //d
        day = day >= 10 ? day : '0' + day;

        let hour = dateTime.getHours();
        hour = hour >= 10 ? hour : '0' + hour;
        let min = dateTime.getMinutes();
        min = min >= 10 ? min : '0' + min;
        let sec = dateTime.getSeconds();
        sec = sec >= 10 ? sec : '0' + sec;

        let strDate = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
        return strDate;
    }

    render() {
        const [campusCategory, disasterCategory, subDisasterCategory, disaster] = this.SetDisasterUI();

        const allText = i18n.t('common.전체');
        var campusName = (this.state.selectedCampusCategory === null) ? allText : i18nUtil.convertText(this.state.selectedCampusCategory);
        var categoryName = (this.state.selectedDisasterCategory === null) ? allText : i18nUtil.convertText(this.state.selectedDisasterCategory.categoryName);
        var subCategoryName = (this.state.selectedSubDisasterCategory === null) ? allText : i18nUtil.convertText(this.state.selectedSubDisasterCategory.subCategoryName);

        return (
            <SimulatorSBcallSection>
                {
				    ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen &&
					<div className={'teamEditorName'}><span>SOP</span>{/* <span className={'teamEditorNameIcon'}></span> */}</div>
				}
                <AppContainer>
                    <SubSectionMenualListWrap className={'subSection menualListWrap'}>                        
                        <dl>
                            {
                                (this.props.siteList && this.props.siteList.length > 1 && ProjectResource.SiteID !== ProjectResource.Site.GG_A) &&
                                <div className={'list campusCategory'}>
                                    <dt>{i18n.t('sopSimulator.formText.캠퍼스선택')}<em>{campusName}</em></dt>
                                    <dd>
                                        <ul className={'bullet'}>
                                            {campusCategory}
                                        </ul>
                                    </dd>
                                </div>
                            }
                            <div className={'list category'}>
                                <dt>{i18n.t('sopSimulator.formText.재난분야')}<em>{categoryName}</em></dt>
                                <dd>
                                    <ul className={'bullet'}>
                                        {disasterCategory}
                                    </ul>
                                </dd>
                            </div>
                            <div className={'list subCategory'}>
                                <dt>{i18n.t('sopSimulator.formText.재난종류')}<em>{subCategoryName}</em></dt>
                                <dd>
                                    <ul className={'bullet'}>
                                        {subDisasterCategory}
                                    </ul>
                                </dd>
                            </div>
                        </dl>
                    </SubSectionMenualListWrap>
                    <SubSectionBoardListWrap className={'subSection boardListWrap'}>
                        <div className={'tit clfix'}>
                            <strong>{i18n.t('sopSimulator.formText.SOP 임무 목록')}</strong>
                            {
                                ProjectResource.styleMode !== ProjectResource.StyleType.Hydrogen &&
                                <button className={'iconPlay2'} onClick={() => this.props.onSelectMenu(SopSimulatorResource.menu.SOP_불러오기)} />
                            }
                            {
                                ProjectResource.styleMode !== ProjectResource.StyleType.Hydrogen &&
                                <>
                                    <div className={'filterArea clfix'}>
                                        <div className={'checkBox'}>
                                            <input type="checkbox" id="filter01" checked={this.state.isNormal} onChange={this.onChangeNormal} />
                                            <label>{i18n.t('sopSimulator.formText.평일/주간')}</label>
                                        </div>
                                        <div className={'checkBox cGreen'}>
                                            <input type="checkbox" id="filter02" checked={this.state.isEmergency} onChange={this.onChangeEmergency} />
                                            <label>{i18n.t('sopSimulator.formText.휴일/야간')}</label>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                        <InnerSection>
                            {/*<div className={uneStyles.innerSectionnnn + " " + uis.scrollbar}>*/}
                            <NumList className={'numList list'}>
                                {disaster}
                            </NumList>
                        </InnerSection>
                    </SubSectionBoardListWrap>
                </AppContainer>
            </SimulatorSBcallSection>
        );
    }
}
export default withTranslation()(SopSimulatorSBcall);