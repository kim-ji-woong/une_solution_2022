import React, { Component } from 'react';

import { AccountFindMemberComponent } from '../styled/accountManagerStyled';
import { ModalBackground } from '../../Root/styled/theme';

import close_btn from '../../Common/images/close_btn.png';
import ProjectResource from "../../Root/resource/id";

class AccountFindMember extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            searchingTxt: '',
            displayMembers: [],
            selectedMember: null,
            selectedMemberID: null,
        }
    }
    
    onChangeSearchingTxt = (e) => {
        this.setState({ searchingTxt: e.target.value });
    }
    
    onClickSearch = () => {
        const searchingTxt = this.state.searchingTxt;
        
        // 검색 로직
        const accountUsers = this.props.accountUsers;
        const members = this.props.members;
        
        if (!accountUsers || !members) {
            this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["계정 및 권한 정보를 불러오는데 실패하였습니다."], null, null);
            return;
        }
        
        const jobLevels = this.props.jobLevels;
        const jobPositions = this.props.jobPositions;
        
        if (!jobLevels || !jobPositions) {
            this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["직위 및 직급 정보를 불러오는데 실패하였습니다."], null, null);
            return;
        }
        
        let displayMembers = [];

        if (searchingTxt === '') {
            this.setState({ displayMembers: members });
            return;
        }
        
        for (let i = 0; i < members.length; i++) {
            const member = members[i];
            
            let targetJobLevelID = member.JobLevelID;
            let targetJobPositionID = member.JobPositionID;
            
            let jobLevel = jobLevels.find(x => x.PropertyID === targetJobLevelID);
            let jobPosition = jobPositions.find(x => x.PropertyID === targetJobPositionID);
            
            if (this.compareString(member.MemberName, searchingTxt) || 
                this.compareString(jobLevel.PropertyValue, searchingTxt) || 
                this.compareString(jobPosition.PropertyValue, searchingTxt ||
                this.compareString(member.PhoneNumber, searchingTxt) ||
                this.compareString(member.OfficePhoneNumber, searchingTxt) ||
                this.compareString(member.Email, searchingTxt))) {
                displayMembers.push(member);
            }
        }
        
        this.setState({ displayMembers });
        
    }
    
    normalizeString = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ /g, "").toLowerCase();
    }
    
    compareString = (str1, str2) => {
        return this.normalizeString(str1).includes(this.normalizeString(str2));
    }

    onChangeSelectedMember = (member) => {
        this.setState({ selectedMemberID: member.ID, selectedMember: member });
    }
    
    getMemberUI = () => {
        
        const displayMembers = this.state.displayMembers;
        
        if (!displayMembers || displayMembers.length === 0) {
            return (
                <li className='body'>
                    <div>
                        <p>찾고자 하는 조직원의 정보를 검색해주세요.</p>
                    </div>
                </li>
            )
        }
        
        let memberElements = [];
        
        const jobLevels = this.props.jobLevels;
        const jobPositions = this.props.jobPositions;
        const regular = this.props.regular;
        
        for (let i = 0; i < displayMembers.length; i++) {
            const member = displayMembers[i];
            
            const targetRegular = regular.find(x => x.id === member.RegularID);
            const targetJobLevel = jobLevels.find(x => x.PropertyID === member.JobLevelID);
            const targetJobPosition = jobPositions.find(x => x.PropertyID === member.JobPositionID);
            
            let element = (
                <li key={member.ID}>
                    <div>
                        <input type='radio' name={'selectMember_' + member.ID} checked={this.state.selectedMemberID === member.ID} onChange={() => this.onChangeSelectedMember(member)}/>
                    </div>
                    <div>{member.ID}</div>
                    <div>{targetRegular.teamName}</div>
                    <div>{member.MemberName}</div>
                    <div>{targetJobLevel.PropertyValue}</div>
                    <div>{member.PhoneNumber}</div>
                    <div>{member.OfficePhoneNumber ? member.OfficePhoneNumber : ""}</div>
                    <div>{member.Email ? member.Email : ""}</div>
                </li>
            )
            
            memberElements.push(element);
        }
        
        return (
            <li className='body'>
                <ul>
                    {memberElements}
                </ul>
            </li>
        );
    }
    
    onClickApply = () => {
        
        // validation
        const accountUsers = this.props.accountUsers;
        
        for (let i = 0; i < accountUsers.length; i++) {
            const user = accountUsers[i];
            if (this.state.selectedMember.MemberID === user.memberID) {
                if (user.accountID !== -1) {
                    return this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["이미 등록된 사용자입니다."], null, null);
                }
            }
        }
        
        this.props.handlePopup(false)
        this.props.onClickApply(this.state.selectedMember);
    }

    render() {
        // 행이 6개 이상이면 Table head css값 변경
        let rowLength = 10;
        let memberUI = this.getMemberUI();
        return (
            <ModalBackground>
                <AccountFindMemberComponent $rowLength={rowLength}>
                    <header>
                        <h2>조직정보 불러오기</h2>
                        <button onClick={() => this.props.handlePopup(false)} className={'closeBtn'}>
                            <img src={close_btn} alt='닫기 버튼' width={16} height={16}/>
                        </button>
                    </header>
                    <section>
                        <div className='searchWrap'>
                            <input type="text" id="txtSearch" placeholder='검색어를 입력해주세요.'
                                   onChange={(e) => this.onChangeSearchingTxt(e)}/>
                            <button onClick={() => this.onClickSearch()}>검색</button>
                        </div>
                        <div className='listWrap'>
                            <ul className='accountList'>
                                <li className='head'>
                                    <div>선택</div>
                                    <div>NO</div>
                                    <div>소속 조직</div>
                                <div>이름</div>
                                <div>직위</div>
                                <div>휴대전화번호</div>
                                <div>근무처 전화번호</div>
                                <div>Email</div>
                            </li>
                            {memberUI}
                        </ul>
                    </div>
                </section>
                <div className='btnWrap'>
                    <button className='cancle' onClick={() => this.props.handlePopup(false)}>취소</button>
                    <button className='submit' onClick={() => this.onClickApply()}>적용</button>
                </div>
            </AccountFindMemberComponent>
            </ModalBackground>
        );
    }
}

export default AccountFindMember;