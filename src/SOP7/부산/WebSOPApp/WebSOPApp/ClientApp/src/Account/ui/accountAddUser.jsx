import React, { Component } from 'react';

import { AccountAddUserComponent } from '../styled/accountManagerStyled';
import AccountFindMember from './accountFindMember';
import ProjectResource from "../../Root/resource/id";
import {AccountController} from "../services/accountController";
import Proj from "proj4/lib/Proj";

class AccountAddUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showFindMemberPopup: false,
            selectedMember: null,
            newUserID: '',
            newAccountLevel: null,
        }
    }

    handlePopup = (isShow) => {
        this.setState({ showFindMemberPopup: isShow });
    }
    
    onClickApply = (selectedMember) => {
        
        if (!selectedMember) {
            this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["사용자를 선택해주세요."], null, null);
            return;
        }
        
        this.setState({ selectedMember });
    }
    
    getSelectedUserUI = () => {
        const selectedMember = this.state.selectedMember;
        const accountLevels = this.props.accountLevels;
        const regular = this.props.regular;
        const jobLevels = this.props.jobLevels;
        
        if (!selectedMember) {
            return;
        }

        if (!regular || !jobLevels) {
            return this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["직원 정보를 불러오는데 실패하였습니다."], null, null);
        }
        
        let userLevelsUI = null;
        
        if (accountLevels) {
            
            userLevelsUI = (
                <select onChange={(e) => this.onChangeAccountLevel(e)}>
                    {
                        accountLevels.map((accountLevel, index) => {
                            if (accountLevel.id !== 1) {
                                return (
                                    <option key={index} value={accountLevel.id}>{accountLevel.levelName}</option>
                                )
                            }
                        })
                    }
                </select>
            );
            
        }
        
        const targetJobLevel = jobLevels.find(x => x.PropertyID === selectedMember.JobLevelID);
        const targetRegular = regular.find(x => x.id === selectedMember.RegularID);
        
        return (
            <ul>
                <li>
                    <div>{targetRegular.teamName}</div>
                    <div>{selectedMember.MemberName}</div>
                    <div>{targetJobLevel.PropertyValue}</div>
                    <div>
                        <input type='text' onChange={(e) => this.onChangeUserID(e)}/>
                    </div>
                    <div>
                        {userLevelsUI}
                    </div>
                </li>
            </ul>
        )
    }
    
    onChangeUserID = (e) => {
        this.setState({ newUserID: e.target.value });
    }
    
    onChangeAccountLevel = (e) => {
        this.setState({ newAccountLevel: e.target.value });
    }
    
    onClickCancel = () => {
        this.setState({ selectedMember: null, newUserID: '', newAccountLevel: null });
    }
    
    onClickSave = async () => {
            
        const selectedMember = this.state.selectedMember;
        const newUserID = this.state.newUserID;
        const newAccountLevel = this.state.newAccountLevel;
        
        if (!selectedMember) {
            return this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["사용자를 선택해주세요."], null, null);
        }
        
        if (!newUserID) {
            return this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["사용자ID를 입력해주세요."], null, null);
        }
        
        if (!newAccountLevel) {
            return this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["권한을 선택해주세요."], null, null);
        }
        
        let tempUser = {
            memberID: selectedMember.ID,
            userLevel: parseInt(newAccountLevel),
            userID: newUserID,
            nickName: selectedMember.MemberName,
            siteID: ProjectResource.Site.Busan,
        }
        
        const result = await AccountController.requestAddUser(tempUser);
        
        if (!result.success) {
            return this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["저장에 실패하였습니다. " + result.message], null, null);
        }
        
        this.props.init();
            
        this.setState({ selectedMember: null, newUserID: '', newAccountLevel: null });
    }
        

    render() {

        const selectedMemberUI = this.getSelectedUserUI();

        return (
            <>
                <AccountAddUserComponent>
                    <div className='infoWrap'>
                        <p>신규등록 시 유의사항</p>
                        <p>초기 비밀번호는 전화번호 존재시 전화번호 뒷자리, 존재하지 않는 경우 1234로 설정됩니다.</p>
                        <p>최고관리자 계정생성은 시스템 관리자에게 문의해주시기 바랍니다.</p>
                    </div>
                    <div className='listWrap'>
                        <ul className='accountList'>
                            <li className='head'>
                                <div>소속 조직</div>
                                <div>이름</div>
                                <div>직위</div>
                            <div>사용자ID</div>
                            <div>권한</div>
                        </li>
                        <li className='body'>
                            {
                                !this.state.selectedMember &&
                                <div>
                                    <button
                                        onClick={() => this.handlePopup(true)}
                                    >
                                        조직정보 불러오기
                                    </button>
                                </div>
                            }
                            {selectedMemberUI}
                        </li>
                        </ul>
                    </div>
                    <div className='btnWrap'>
                        <button className='cancle' onClick={() => this.onClickCancel()}>취소</button>
                        <button className='submit' onClick={() => this.onClickSave()}>등록</button>
                </div>
            </AccountAddUserComponent>
            {
                this.state.showFindMemberPopup &&
                <AccountFindMember
                    showConfirmDialog={this.props.showConfirmDialog}
                    onCloseConfirmDialog={this.props.onCloseConfirmDialog}
                    handlePopup={this.handlePopup}
                    accountUsers={this.props.accountUsers}
                    members={this.props.members}
                    jobLevels={this.props.jobLevels}
                    jobPositions={this.props.jobPositions}
                    regular={this.props.regular}
                    onClickApply={this.onClickApply}
                />
            }
            </>
        );
    }
}

export default AccountAddUser;