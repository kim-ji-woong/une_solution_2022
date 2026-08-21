import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import ProjectResource from '../../../Root/resource/id';
import AccountResource from '../../resource/id';
import { AccountController } from '../../services/accountController';

import editmode_icon_green from '../../images/editmode_icon_green.png';

import { AddMemberPopupComponent } from '../../styled/accountPopupStyled';
import { ModalBackground } from '../../../Root/styled/theme';

class AccountManagerAdduser extends Component {
	constructor(props) {
		super(props);

        this.state = {
            regularMembers: null,

            regularMembersPopup: false,
            selectedMember: null,

        };

        this.props = props;
    }

    getSelectedMember = (member) => {
        if (member.length === 0) {
            this.props.showConfirmDialog(['조직원을 선택해주세요.'], null, null, 'error');
            return;
        }

        let check = this.props.dbUsers.filter((user) => user.regularMember.id === member.members[0].id);

        if (check.length !== 0) {
            this.props.showConfirmDialog(['이미 계정이 존재하는 조직원입니다.'], null, null, 'error');
            return;
        }

        this.setState({ selectedMember: member }, () => {});
        this.onClickClosePopup();
    }

    onClickPopup = () => {
        this.setState({ regularMembersPopup: true });
    }

    onClickClosePopup = () => {
        this.setState({ regularMembersPopup: false });
    }

    onClickCloseManagerPopup = () => {

        if (this.state.selectedMember !== null) {
            this.props.showConfirmDialog(['편집 중인 내용이 있습니다', '등록하시겠습니까?'], ['초기화', '확인'], this.onClickSaveDB, 'save');
        } else {
            this.props.onClickClosePopup('manager', false)
        }
    }

    handleChange = (value, type) => {
        let selectedMember = this.state.selectedMember;
        
        if (type === null || type === undefined)
        return;

        if (type === 'text') {
            selectedMember.userID = value;
        }
        else if (type === 'combo') { 
            selectedMember.levelID = value;
        }
    }

    onClickSaveDB = async () => {
        let selectedMember = this.state.selectedMember;

        if(selectedMember == null) {
            this.props.showConfirmDialog(['입력된 계정 정보가 없습니다.'], null, null, 'error');
            return;
        };
        let dbUsers = this.props.dbUsers;

        const siteID = selectedMember.siteID;
        const userID = selectedMember.userID;
        const levelID = selectedMember.levelID;
        const memberID = selectedMember.members[0].id;

        // ID 유효성 검사
        // 5~10자의 영문소문자, 숫자와 특수기호(_),(-) 사용 가능
        let regID = /^[a-z0-9_-]{5,10}$/;
        // 중복 검사
        let checkID = dbUsers.filter((user) => user.userID === userID);

        if (userID == '' || userID == null) {
            this.props.showConfirmDialog(['아이디를 입력해주세요.'], null, null, 'error');
            return;
        } 
        else if (!regID.test(userID)) {
            this.props.showConfirmDialog(['아이디를 확인해주세요.'], null, null, 'error');
            return;
        }
        else if (levelID == '' || levelID == null || levelID == undefined) {
            this.props.showConfirmDialog(['권한을 선택해주세요.'], null, null, 'error');
            return;
        } 
        else if (checkID.length > 0) {
            this.props.showConfirmDialog(['이미 등록된 ID입니다.'], null, null, 'error');
            return;
        }
        else {
            let [user, message] = await AccountController.requestCreateUser(siteID, userID, levelID, memberID);

            if (user) {
                this.props.showConfirmDialog(['등록되었습니다.'], null, null, 'success');
                this.props.changeMenu('userList');
            } else {
                this.props.showConfirmDialog([message], null, null, 'error');
            }
        }
    }

    setUserTable = () => {
        let userTable = null;
        let selectedMember = this.state.selectedMember;

        if (selectedMember == null || selectedMember?.length == 0) {
            return;
        }
        else {
            userTable = (
                <tr key={selectedMember.id}>
                    <td>{selectedMember.teamName}</td>
                    <td>{selectedMember.members[0].memberName}</td>
                    <td>{selectedMember.members[0].jobPosition}</td>
                    <td>{selectedMember.members[0].jobLevel}</td>
                    <td>{selectedMember.members[0].phoneNumber}</td>
                    <td>{selectedMember.members[0].id}</td>
                    <td>{selectedMember.members[0].officePhoneNumber}</td>
                    <td>{selectedMember.members[0].email}</td>
                    <td><input type='text' onChange={(e) => this.handleChange(e.target.value, 'text')} /></td>
                    <td>
                        <select onChange={(e) => this.handleChange(e.target.value, 'combo')}>
                            <option>선택</option>
                            {/* <option value="1">{AccountResource.ID.accountLevel.master}</option> */}
                            <option value="2">{AccountResource.ID.accountLevel.generalAdmin}</option>
                            <option value="3">{AccountResource.ID.accountLevel.admin}</option>
                        </select>
                    </td>
                </tr>
            );
        }

        return userTable;
    }

    render() {

        let userTable = this.setUserTable();

        return (
            <>
            <section className='userAdd'>
                <h5 onClick={this.onClickPopup}>조직정보 불러오기</h5>
                <table>
                    <caption>* 계정 생성을 위한 필수 입력값 입니다.</caption>
                    <thead>
                        <tr>
                            <td width={'10%'}>소속팀</td>
                            <td width={'10%'}>이름</td>
                            <td width={'10%'}>직위</td>
                            <td width={'10%'}>직급</td>
                            <td width={'10%'}>핸드폰 번호</td>
                            <td width={'10%'}>사번</td>
                            <td width={'10%'}>근무처 전화번호</td>
                            <td width={'10%'}>Email</td>
                            <td width={'10%'} className='userId'>
                                사용자ID *
                                <div>
                                    <img src={editmode_icon_green} alt='도움말' />
                                    <p>5~10자의 영문소문자 , 숫자와 특수기호(_),(-)만 사용 가능합니다.</p>
                                </div>
                        </td>
                            <td width={'10%'} className='userLevel'>권한 *</td>
                        </tr>
                    </thead>
                    <tbody>
                        {userTable}
                    </tbody>
                </table>
                <ul className={'buttonWrap'}>
                    <li className={'cancelBtn'} onClick={this.onClickCloseManagerPopup}>취소</li>
                    <li className={'saveBtn'} onClick={() => this.props.showConfirmDialog(['등록하시겠습니까?'], ['초기화', '확인'], this.onClickSaveDB, 'save')}>등록</li>
                </ul>
            </section>
            {
                this.state.regularMembersPopup &&
                    <AddMemberPopup
                        onClickClosePopup={this.onClickClosePopup}
                        getSelectedMember={this.getSelectedMember}
                        showConfirmDialog={this.props.showConfirmDialog}
                    />
            }
            </>
        );
    }
}

export default withRouter(AccountManagerAdduser);


// 조직정보 불러오기 팝업
class AddMemberPopup extends Component {
	constructor(props) {
		super(props);

        this.state = {
            regularMembers: [],
            selectedMember: [],
            search: '',
            focusNode: null,
        };

        this.props = props;
    }

    searchEnterKey = () => {
        if (window.event && window.event.keyCode === 13) {    
            this.searchMember();
        }
    }

    async searchMember() {
        const keyword = document.getElementById('txtSearch').value;

        const userInfo = ProjectResource.getUserInfo();

        const masterID = AccountResource.accountLevelID.master;
        const generalAdminID = AccountResource.accountLevelID.generalAdmin;

        if ((userInfo?.levelID === masterID || userInfo?.levelID === generalAdminID) && userInfo.siteID) {

            const siteID = userInfo.siteID;
        
            let [regularMembers, message] = await AccountController.requestRegularMemberList(siteID, keyword);
    
            if(!regularMembers && message.length > 0) {
                this.showConfirmDialog(message, null, null, 'error');
                return;
            };
    
            this.setState({ regularMembers: regularMembers });
        }
    }

    onSelectedMember = (user) => {
        this.setState({ selectedMember: user, focusNode: user.id });
    }

    setUserTable = () => {
        let userTable = [];
        let userCount = 0;
        let regularMembers = this.state.regularMembers;

        if (regularMembers.length > 0) {
            for (let i = 0; i < regularMembers.length; i++) {
                let user = regularMembers[i];
                userCount = userCount + 1;

                userTable.push(
                    <tr key={user.id} className={this.state.focusNode === user.id ? 'on' : null}>
                        <td><input type="radio" name="regularMember" onChange={() => this.onSelectedMember(user)} /></td>
                        <td>{userCount}</td>
                        <td>{user.teamName}</td>
                        <td>{user.members[0].memberName}</td>
                        <td>{user.members[0].jobPosition}</td>
                        <td>{user.members[0].jobLevel}</td>
                        <td>{user.members[0].phoneNumber}</td>
                        <td>{user.members[0].id}</td>
                        <td>{user.members[0].officePhoneNumber}</td>
                        <td>{user.members[0].email}</td>
                    </tr>
                );
            }   
        }

        return userTable;
    }

    render() {

        let userTable = this.setUserTable();

        return (
            <ModalBackground>
                <AddMemberPopupComponent>
                    <div className={'header'}>
                        <h5 className={'title'}>
                            조직정보 불러오기
                        </h5>
                        <a onClick={() => this.props.onClickClosePopup()} className={'closeBtn'} />
                    </div>

                    <div className='content'>
                        <div className={'searchWrap'}>
                            <input type="text" id="txtSearch" onKeyUp={this.searchEnterKey} placeholder='검색어를 입력해주세요.'/>
                            <a onClick={() => this.searchMember()}>검색</a>
                        </div>
                        <section className='userList'>
                            <table>
                                <thead>
                                    <tr>
                                        <td width={'3%'}>선택</td>
                                        <td width={'3%'}>NO.</td>
                                        <td width={'10%'}>소속팀</td>
                                        <td width={'8%'}>이름</td>
                                        <td width={'8%'}>직위</td>
                                        <td width={'8%'}>직급</td>
                                        <td width={'10%'}>핸드폰 번호</td>
                                        <td width={'8%'}>사번</td>
                                        <td width={'10%'}>근무처 전화번호</td>
                                        <td width={'12%'}>Email</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userTable}
                                </tbody>
                            </table>
                        </section> 
                        <ul className={'buttonWrap'}>
                            <li className={'cancelBtn'} onClick={() => this.props.onClickClosePopup()}>취소</li>
                            <li className={'saveBtn'} onClick={() => this.props.getSelectedMember(this.state.selectedMember)}>확인</li>
                        </ul>
                    </div>
                </AddMemberPopupComponent>
            </ModalBackground>
        );
    }
}