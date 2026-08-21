import React, { Component } from 'react';
import $ from 'jquery';
import uis from '../../Common/css/ui.module.css';
import SopController from '../../SOPManager/services/sopController';
import SopSimulatorController from '../services/sopSimulatorController';

import { SopSimulatorSBcallComponent } from '../styled/sopSimulatorSBcallStyled';

class SopSimulatorSBcall extends Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            disasterCategories: [],
            disasterCategoriesEmergency: [],
            isNormal: true,
            isEmergency: false,
            selectedDisasterCategory: null,         // 재난분야
            selectedSubDisasterCategory: null,      // 재난종류
            selectedDisaster: null,                 // 재난상황
            selectedVersion: null                   // 선택 SOP
        };
    }

    componentDidMount() {
        this.getDisasterCategories();

        $('html, body').css({ 'display': 'block', 'height': '100%', 'overflow': 'hidden', 'color': '#fff' });
        // 각 페이지 별로 클래스 초기화
        $('#subPage').removeClass('sop');

        // E-SOP 매뉴얼 Left List Toggle
        $('.' + uis.menualListWrap).on('click', 'dt', function () {
            $(this).closest('.' + uis.list).toggleClass(uis.isShow).siblings().removeClass(uis.isShow);
        });

        $('.menualListWrap').on('click', 'dt', function () {
            $(this).closest('.list').toggleClass("isShow").siblings().removeClass("isShow");
        });

        // 재난분야 버튼 이벤트
        $('.category dd ul').on('click', 'li', function () {
            //console.log("재난분야 버튼 테스트");

            // 재난분야 메뉴 닫기
            $('.category').removeClass(uis.isShow);
            // 재난종류 메뉴 열기
            $('.subCategory').addClass(uis.isShow);
        });

        // 재난종류 버튼 이벤트
        $('.subCategory dd ul').on('click', 'li', function () {
            //console.log("재난종류 버튼 테스트");
        });

        // 페이지 타이틀 
        $('#pageTitle').text("E-SOP");
    }

    async getDisasterCategories() {
        const [disasterCategories, message] = await SopController.disasterCategories(true);
        const [disasterCategoriesEmergency, message2] = await SopController.disasterCategories(false);

        const isNormal = await this.getWorkingTime();
        const isEmergency = !isNormal;

        this.setState({ disasterCategories, disasterCategoriesEmergency, isNormal, isEmergency });
    }

    async getWorkingTime() {

        try {
            if (this.props.optionSopNormal) {

                const beginHours = this.props.optionSopNormal.workingBeginHour;
                const beginTime = this.props.optionSopNormal.workingBeginMinute;
                const endHours = this.props.optionSopNormal.workingEndHour;
                const endTime = this.props.optionSopNormal.workingEndMinute;

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

    onSelectDisasterCategory = (disasterCategoryData, e) => {

        const category = document.getElementsByClassName('btnList isActiveType');

        for(let el of category) {
            el.classList.remove('isActiveType');
        }

        e.currentTarget.classList.toggle('isActiveType');

        this.setState({ selectedDisasterCategory: disasterCategoryData, selectedSubDisasterCategory: null });
    }

    onSelectSubDisasterCategory = (subDisasterCategoryData, e) => {

        const category = document.getElementsByClassName('isActiveType');
        
        for(let el of category) {
            el.classList.remove('isActiveType');
        }

        e.currentTarget.classList.toggle('isActiveType');

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
        
        var disasterCategory = [];
        var subDisasterCategory = [];
        var disaster = [];

        disasterCategory.push(
            <li className={uis.isActive} key={'disasterCategory/'}>
                <a className={'btnList'} onClick={(e) => this.onSelectDisasterCategory(null, e)}>
                    <span className={uis.sopArrowIcon}></span>
                    전체
                </a>
            </li>
        );

        subDisasterCategory.push(
            <li key={'subDisasterCategory/'}>
                <a className={'btnList'} onClick={(e) => this.onSelectSubDisasterCategory(null, e)}>
                    <span className={uis.sopArrowIcon}></span>
                    전체
                </a>
            </li>
        );

        if (this.state.isNormal) {
            for (var i = 0; i < this.state.disasterCategories.length; i++) {
                const dc = this.state.disasterCategories[i];
                disasterCategory.push(
                    <li className={uis.isActive} key={'disasterCategory/' + dc.disasterCategory.id}>
                        <a key={dc} className={'btnList'} onClick={(e) => this.onSelectDisasterCategory(dc.disasterCategory, e)}>
                            <span className={uis.sopArrowIcon}></span>
                            {dc.disasterCategory.categoryName}
                        </a>
                    </li>
                );

                for (var j = 0; j < dc.subDisasterCategories.length; j++) {
                    const sdc = dc.subDisasterCategories[j];
                    if (this.state.selectedDisasterCategory === null || this.state.selectedDisasterCategory.id === sdc.subDisasterCategory.disasterCategoryID) {

                        subDisasterCategory.push(
                            <li key={'subDisasterCategory/' + sdc.subDisasterCategory.id}>
                                <a key={sdc} className={'btnList'} onClick={(e) => this.onSelectSubDisasterCategory(sdc.subDisasterCategory, e)}>
                                    <span className={uis.sopArrowIcon}></span>
                                    {sdc.subDisasterCategory.subCategoryName}
                                </a>
                            </li>
                        );



                        for (var k = 0; k < sdc.disasterDatas.length; k++) {
                            const d = sdc.disasterDatas[k];
                            const allVersions = [];
                            for (var q = 0; q < d.disasterDatas.length; q++) {
                                if (this.state.selectedSubDisasterCategory === null || this.state.selectedSubDisasterCategory.id === d.disasterDatas[q].disaster.subDisasterCategoryID) {
                                    if (d.disasterDatas[q].version === undefined || d.disasterDatas[q].version === null) {
                                        continue;
                                    }
                                    const isNormal = d.disasterDatas[q].version.isNormal;                                    
                                    if (isNormal === undefined) {
                                        continue;
                                    }
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
                                            <p>{dc.disasterCategory.categoryName}&nbsp;&gt;&nbsp;{sdc.subDisasterCategory.subCategoryName}&nbsp;&gt;&nbsp;{d.disasterName}</p>
                                            {
                                                (lastAccessVersion.isNormal)
                                                    ? <div className={uis.sopDayBox}><span className={uis.sopGreenCircle}></span><span className={uis.noti}>평일/주간</span></div>
                                                    : <div className={uis.sopDayBox}><span className={uis.sopYellowCircle}></span><span className={uis.noti}>휴일/야간</span></div>
                                            }
                                            <span className={uis.date}>{lastAccessTime}</span>
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
                                    if (d.disasterDatas[q].version === undefined || d.disasterDatas[q].version === null) {
                                        continue;
                                    }
                                    const isNormal = d.disasterDatas[q].version.isNormal;
                                    if (isNormal === undefined) {
                                        continue;
                                    }
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
                                            <p>{dc.disasterCategory.categoryName}&nbsp;&gt;&nbsp;{sdc.subDisasterCategory.subCategoryName}&nbsp;&gt;&nbsp;{d.disasterName}</p>
                                            {
                                                (lastAccessVersion.isNormal)
                                                    ? <div className={uis.sopDayBox}><span className={uis.sopGreenCircle}></span><span className={uis.noti}>평일/주간</span></div>
                                                    : <div className={uis.sopDayBox}><span className={uis.sopYellowCircle}></span><span className={uis.noti}>휴일/야간</span></div>
                                            }
                                            <span className={uis.date}>{lastAccessTime}</span>
                                        </a>
                                    </li>
                                );
                            }
                        }
                    }
                }
            }
        }
                
        return [disasterCategory, subDisasterCategory, disaster];
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
        const [disasterCategory, subDisasterCategory, disaster] = this.SetDisasterUI();

        var categoryName = (this.state.selectedDisasterCategory === null) ? '전체' : this.state.selectedDisasterCategory.categoryName; 
        var subCategoryName = (this.state.selectedSubDisasterCategory === null) ? '전체' : this.state.selectedSubDisasterCategory.subCategoryName;

        return (
            <SopSimulatorSBcallComponent className={uis.appContainerWrapp + " " + uis.clfix + " " + 'UI_Section'}>
                <div className={uis.appContainer}>
                <section className={uis.subSection + " " + uis.menualListWrap}>
                        <dl>
                            <div className={uis.list + ' category'}>
                                <dt>상황분야<em>{categoryName}</em></dt>
                                <dd>
                                    <ul className={uis.bullet}>
                                        {disasterCategory}
                                    </ul>
                                </dd>
                            </div>
                            <div className={uis.list + ' subCategory'}>
                                <dt>상황종류<em>{subCategoryName}</em></dt>
                                <dd>
                                    <ul className={uis.bullet}>
                                        {subDisasterCategory}
                                    </ul>
                                </dd>
                            </div> 
                        </dl>
                    </section>
                    <section className={uis.subSection + " " + uis.boardListWrap}>
                        <div className={uis.sopTit + " " + uis.clfix}>
                            <strong>SOP 임무 목록</strong>
                            <div className={uis.filterArea + " " + uis.clfix}>                                    
                                <div className={uis.allDaycheckBox}>
                                    <input type="checkbox" id="filter01" checked={this.state.isNormal} onChange={this.onChangeNormal}/>
                                    <label>평일/주간</label>
                                </div>
                                <div className={uis.holidayCheckBox + " " + uis.cGreen}>
                                    <input type="checkbox" id="filter02" checked={this.state.isEmergency} onChange={this.onChangeEmergency}/>
                                    <label>휴일/야간</label>
                                </div>
                            </div>
                        </div>
                        <div className={uis.innerSection + " " + uis.scrollbar}>
                            <ol className={uis.numList + " " + uis.list}>
                                {disaster}                                    
                            </ol>
                        </div>
                    </section>
                </div>
            </SopSimulatorSBcallComponent>
        );
    }
}
    export default SopSimulatorSBcall;