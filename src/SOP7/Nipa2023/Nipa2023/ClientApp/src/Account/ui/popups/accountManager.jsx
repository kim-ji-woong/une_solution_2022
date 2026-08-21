import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import ProjectResource from '../../../Root/resource/id';
import AccountResource from '../../resource/id';
import { AccountController } from '../../services/accountController';

import { ModalBackground } from '../../../Root/styled/theme';
import { AccountManagerComponent } from '../../styled/accountPopupStyled';

import editmode_icon from '../../images/editmode_icon.png';

import ColText from '../columns/colText';
import ColComboBox from '../columns/colComboBox';
import ConfirmDialog from '../../../Common/ui/confirmDialog';
import AccountManagerAdduser from './accountManagerAdduser';

class AccountManager extends Component {
	constructor(props) {
		super(props);

        this.state = {
            showTable : 'userList',
            search: '',

            accountLevels: null,        // 권한
            isEditMode: false,

            dbUsers: null,              // 로그인한 계정 삭제하지 않은 DB 원본 계정 리스트
            accountUsers: null,         // 계정 리스트 (DB 데이터, 저장 시에 비교 데이터) 
            currentUsers: null,         // 삭제or수정 후의 유저 리스트
            displayMembers: null,       // 화면에 출력할 팀원 정보들 (검색에 활용)

            selectedUser: null,         // 체크된 유저 리스트
            deleteUserId: [],           // 삭제된 유저 ID

            confirmMessage: {
                visible: false,
                messages: [""],
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null,
                type: null
            },
        };

        this.props = props;
        this.init();
    }

    async init() {
        const userInfo = ProjectResource.getUserInfo();

        const masterID = AccountResource.accountLevelID.master;
        const generalAdminID = AccountResource.accountLevelID.generalAdmin;

        if ((userInfo?.levelID === masterID || userInfo?.levelID === generalAdminID) && userInfo.siteID) {
            const siteID = userInfo.siteID;

            const accountLevels = await AccountController.requestUserLevelList();
            let [accountUsers, message1] = await AccountController.requestUserList(siteID);
            let [tempUsers, message2] = await AccountController.requestUserList(siteID);

            if (!accountUsers && message1.length > 0) {
                this.showConfirmDialog([message1], null, null, 'error');
                return;
            };

            let temps = null;
            let currentTemps = null;

            if (tempUsers) {
                temps = JSON.parse(JSON.stringify(tempUsers));
                currentTemps = temps.filter((temp) => temp.id !== userInfo.id);

                for (let i = 0; i < currentTemps.length; i++) {
                    currentTemps[i].checked = false;
                }
            }

            let users = null;
            let currentUsers = null;

            if (accountUsers) {
                users = JSON.parse(JSON.stringify(accountUsers));

                // 로그인 한 유저의 정보는 리스트에서 삭제
                currentUsers = users.filter((user) => user.id !== userInfo.id);

                for (let i = 0; i < currentUsers.length; i++) {
                    currentUsers[i].checked = false;
                }
            };

            this.setState({ dbUsers: accountUsers, accountUsers: currentTemps, currentUsers: currentUsers, accountLevels: accountLevels });
        }
    }

    // 탭 메뉴 변경
    changeMenu = (menu) => {

        this.setState({
            showTable: menu
        });

        this.init();
    }

    searchEnterKey = () => {
        if (window.event && window.event.keyCode === 13) {    
            this.searchUser();
        }
    }
    
    searchUser = () => {
        const text = document.getElementById('txtSearch').value;

        this.setState({ search: text });
    }

    searchMember = () => {
		const users = this.state.currentUsers;
		const search = this.state.search;

        let searchMembers = [];

        if (users == null) {
			this.state.displayMembers = searchMembers;
			return searchMembers;
		}

		for (let i = 0; i < users.length; i++) {
			const user = users[i];

            let memberID = user.memberID ? user.memberID.toString() : '';
            let userID = user.userID ? user.userID.toString() : '';
            let regularTeamName = user.regularMember.regularTeamName ? user.regularMember.regularTeamName.toString() : '';
            let memberName = user.regularMember.memberName ? user.regularMember.memberName.toString() : '';
            let jobPosition = user.regularMember.jobPosition ? user.regularMember.jobPosition.toString() : '';
            let jobLevel = user.regularMember.jobLevel ? user.regularMember.jobLevel.toString() : '';
            let phoneNumber = user.regularMember.phoneNumber ? user.regularMember.phoneNumber.toString() : '';
            let officePhoneNumber = user.regularMember.officePhoneNumber ? user.regularMember.officePhoneNumber.toString() : '';
            let email = user.regularMember.email ? user.regularMember.email.toString() : '';
            let userLevel = '';

            if (user.userLevel === AccountResource.accountLevelID.master) {
                userLevel = AccountResource.ID.accountLevel.master;
            } else if (user.userLevel === AccountResource.accountLevelID.generalAdmin) {
                userLevel = AccountResource.ID.accountLevel.generalAdmin;
            } else if (user.userLevel === AccountResource.accountLevelID.admin) {
                userLevel = AccountResource.ID.accountLevel.admin;
            } 

            if (user && search !== null && search !== undefined && search !== "") {
                if (memberID.includes(search) || 
                    userID.includes(search) || 
                    regularTeamName.includes(search) || 
                    memberName.includes(search) || 
                    jobPosition.includes(search) || 
                    jobLevel.includes(search) || 
                    phoneNumber.includes(search) || 
                    officePhoneNumber.includes(search) || 
                    email.includes(search) || 
                    userLevel.includes(search)) {
                        searchMembers.push(user);
                };
            }
            else {
                searchMembers.push(user);
            }
		}

        this.state.displayMembers = searchMembers;
		return searchMembers;
	}

    setEditMode = () => {
        this.setState({ isEditMode: !this.state.isEditMode });
    }

    // 리스트 전체선택
    onCheckedRow(checked, index) {
        const displayMembers = this.state.displayMembers;
		const accountUserscount = displayMembers.length;

		if (index === -1) {
			for (let i = 0; i < accountUserscount; i++) {
				displayMembers[i].checked = checked;
			}
		}
		else {			
			displayMembers[index].checked = checked;
		}

		this.setState({ displayMembers: displayMembers });
	}

    // 체크된 유저 삭제
    deleteUser = () => {
        const currentUsers = this.state.currentUsers
        const displayMembers = this.state.displayMembers;
        const deleteUserId = this.state.deleteUserId;

        let newUserList = displayMembers.filter((user) => !user.checked);
        let newCurrentList = currentUsers.filter((user)=> !user.checked);

        let _deleteUserId = [];

        for (let i = 0; i < displayMembers.length; i++) {
            const user = displayMembers[i];

            if(user.checked) {
                _deleteUserId.push(user.id);
            };
        };

        const newdeleteUserId = deleteUserId.concat(_deleteUserId);

        this.setState({ currentUsers: newCurrentList, displayMembers: newUserList, deleteUserId: newdeleteUserId });
    }

    // 사용자ID, 권한 변경
    onChangeValue = (type, value, id, isUpdate) => {

        if (type === null || type === undefined)
            return;

        let currentUsers = this.state.currentUsers;

        // 사용자ID 변경
        if (type === 'text') {
            for (let i = 0; i < currentUsers.length; i++) {
                if(currentUsers[i].id === id){
                    currentUsers[i].userID = value;
                    if(isUpdate) {
                        currentUsers[i].isUpdate = isUpdate;
                        currentUsers[i].updateItem = type;
                    }
                }
            }
        }
        // 권한 변경
        else if (type === 'combo') {
            for (let i = 0; i < currentUsers.length; i++) {
                if(currentUsers[i].id === id){
                    currentUsers[i].userLevel = value;
                    if(isUpdate) {
                        currentUsers[i].isUpdate = isUpdate;
                    }
                }
            }
        }

        this.setState({ currentUsers: currentUsers });
    }

    onClickClosePopup = () => {
        if (this.state.isEditMode) {
            let currentUsers = this.state.currentUsers;
            let accountUsers = this.state.accountUsers;
    
            // 데이터가 변경되었는지 확인
            let compareList = (
                currentUsers,
                accountUsers
            ) => {
                return (
                    currentUsers.length === accountUsers.length &&
                    currentUsers.every((currentUser) =>
                    accountUsers.some(
                            (accountUser) =>
                            currentUser.userID === accountUser.userID &&
                            currentUser.userLevel === accountUser.userLevel
                        )
                    )
                );
            };
    
            // 값이 동일하다면 저장없이 창 닫음
            if (compareList(currentUsers, accountUsers)) {
                this.props.onClickClosePopup('manager', false);
            } else {
                this.showConfirmDialog(['편집 중인 내용이 있습니다', '저장하시겠습니까?'], ['초기화', '확인'], this.onClickSaveDB, 'save');
            }
        } else {
            this.props.onClickClosePopup('manager', false);
        }
    }

    showConfirmDialog = (messages, buttons, onClickButton, type) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.messages = messages;
		confirmMessage.buttons = buttons;
		confirmMessage.onClickButton = onClickButton;
		confirmMessage.type = type;

        if (!messages) {
            confirmMessage.messages = [""];
        }
        else if (Array.isArray(messages)) {
            confirmMessage.messages = messages;
        }
        else {
            confirmMessage.messages = [messages];
        }

        this.setState({ confirmMessage });
    }

    onCloseConfirmDialog = () => {
		const confirmMessage = { ...this.state.confirmMessage };
		confirmMessage.visible = false;

		this.setState({ confirmMessage });
	}
    
    // 변경된 데이터 DB에 저장
    onClickSaveDB = async () => {
        if (this.state.isEditMode) {
            let dbUsers = this.state.dbUsers; // DB데이터 (로그인한계정 삭제X)
            let currentUsers = this.state.currentUsers; // 수정된 정보 반영된 데이터
            let deleleUserId = this.state.deleteUserId; // 삭제된 계정 아이디 배열
            let updateUsers = currentUsers.filter((user) => user.isUpdate); // isUpdate = true인 계정

            let arrupdateUsers = [];
            if (updateUsers.length > 0) {

                for (let i = 0; i < updateUsers.length; i++) {
                    
                    if (updateUsers[i]?.updateItem === 'text') {
                        let value = updateUsers[i].userID;
    
                        let regID = /^[a-z0-9_-]{5,10}$/;
                        // 중복 검사
                        let checkID = dbUsers.filter((user) => user.userID == value);
                
                        if (value == '' || value == null) {
                            this.showConfirmDialog(['아이디를 입력해주세요.'], null, null, 'error');
                            return;
                        } 
                        else if (!regID.test(value)) {
                            this.showConfirmDialog(['아이디를 확인해주세요.'], null, null, 'error');
                            return;
                        }
                        else if (checkID.length > 0) {
                            this.showConfirmDialog(['이미 등록된 ID입니다.'], null, null, 'error');
                            return;
                        }
                    }
                }
                
                for (let i = 0; i < updateUsers.length; i++) {
                    const item = { 
                        id: updateUsers[i].id, 
                        userID: updateUsers[i].userID, 
                        levelID: updateUsers[i].userLevel 
                    }
                    arrupdateUsers.push(item);
                }
            }
    
            const [success, message] = await AccountController.requestUpdateUsers(deleleUserId, arrupdateUsers);
    
            if (!success && message.length > 0) {
                this.showConfirmDialog([message], null, null, 'error');
            } else {
                this.showConfirmDialog(['저장되었습니다.'], null, null, 'success');

                for (let i = 0; i < currentUsers.length; i++) {
                    currentUsers[i].isUpdate = false;
                    currentUsers[i].updateItem = null;
                }

                this.setState({ isEditMode: false });
                this.init();
            }
        }
    }

    setAccountUserTable = () => {
        const userInfo = ProjectResource.getUserInfo();
        const loginUserLevel = userInfo.userLevel.id;

        let accountUserTable = [];
        let accountUserCount = 0;
        let userLevelName = '-';
        let allChecked = true; // 전체 체크 여부
        let isEditPossible = true; // 조직원 정보 수정 가능여부
        let trClassName = '';
        
        const displayMembers = this.searchMember();

        if (displayMembers !== null && displayMembers !== undefined) {
            for (let i = 0; i < displayMembers?.length; i++) {
                let user = displayMembers[i];
                accountUserCount = accountUserCount + 1;

                if (parseInt(user.userLevel) === AccountResource.accountLevelID.master)
                    userLevelName = AccountResource.ID.accountLevel.master;
                if (parseInt(user.userLevel) === AccountResource.accountLevelID.generalAdmin)
                    userLevelName = AccountResource.ID.accountLevel.generalAdmin;
                if (parseInt(user.userLevel) === AccountResource.accountLevelID.admin)
                    userLevelName = AccountResource.ID.accountLevel.admin;

                // 로그인한 조직원의 레벨과 같은 조직원이나 레벨이 마스터인 조직원은
                // 체크박스 비활성화, 조직원 정보 수정 불가
                if (loginUserLevel === user.userLevel || user.userLevel === AccountResource.accountLevelID.master) {
                    user.checked = false;

                    if (user.isUpdate) {
                        isEditPossible = true;
                    } else {
                        isEditPossible = false;
                    }

                } else {
                    isEditPossible = true;
                }

                if (this.state.isEditMode && !isEditPossible) {
                    trClassName = 'trDisabled';
                }
                else if (user.checked) {
                    trClassName = 'on';
                } else {
                    trClassName = 'trNormal';
                }

                accountUserTable.push(
                    <tr key={user.id} className={trClassName}>
                        <td>
                            {
                                this.state.isEditMode && isEditPossible ?
                                <input type="checkbox" checked={user.checked || false} onChange={(e) => this.onCheckedRow(e.target.checked, i)} />
                                : <input type="checkbox" checked={user.checked} disabled />
                            }
                        </td>
                        <td>{accountUserCount}</td>
                        <td>{user.regularMember.regularTeamName}</td>
                        <td>{user.regularMember.memberName}</td>
                        <td>{user.regularMember.jobPosition}</td>
                        <td>{user.regularMember.jobLevel}</td>
                        <td>{user.regularMember.phoneNumber}</td>
                        <td>{user.memberID}</td>
                        <td>{user.regularMember.officePhoneNumber}</td>
                        <td>{user.regularMember.email}</td>
                        <td>
                        {
                            this.state.isEditMode && isEditPossible ?
                            <ColText
                                value={user.userID} 
                                id={user.id}
                                member={user}
                                onChangeMember={this.onChangeValue}
                            /> : user.userID
                        }
                        </td>
                        <td>
                        {
                            this.state.isEditMode && isEditPossible ?
                            <ColComboBox
                                value={user.userLevel}
                                id={user.id}
                                member={user}
                                onChangeMember={this.onChangeValue}
                            />
                            : userLevelName
                        }
                        </td>
                    </tr>
                );

                if (loginUserLevel !== user.userLevel) {
                    if (allChecked && !user.checked) {
                        allChecked = false;
                    }
                }
            }
        }

        return [allChecked, accountUserTable];
    }

    render() {
        let [allChecked, accountUserTable] = this.setAccountUserTable();

        return (
            <ModalBackground className='UI_Section'>
                <AccountManagerComponent>
                    <div className={'header'}>
                        <h5 className={'title'}>
                            사용자계정 및 권한관리
                        </h5>
                        <a onClick={this.onClickClosePopup} className={'closeBtn'} />
                    </div>
                    <div className='content'>
                        <nav>
                            <ul>
                                <li className={this.state.showTable === 'userList' ? 'on' : null} onClick={() => this.changeMenu('userList')}>목록</li>
                                <li className={this.state.showTable === 'userAdd' ? 'on' : null} onClick={() => this.changeMenu('userAdd')}>신규등록</li>
                            </ul>
                        </nav>
                        {/* 목록 */}
                        {
                            this.state.showTable === 'userList' &&
                        <>
                        <div className={this.state.isEditMode ? 'searchWrap on' : 'searchWrap'}>
                            <input type="text" id="txtSearch" onKeyUp={this.searchEnterKey} placeholder='검색어를 입력해주세요.'/>
                            <a onClick={this.searchUser}>검색</a>
                            <a onClick={this.setEditMode}>편집</a>
                            {
                                this.state.isEditMode ? 
                                    <a onClick={this.deleteUser}>삭제</a>
                                    : <a className='disabled'>삭제</a>
                            }
                        </div>
                        <section className='userList'>
                            <table>
                                <thead>
                                    <tr>
                                        <td width={'3%'}>
                                            {
                                                this.state.isEditMode ?
                                                <input type="checkbox" checked={allChecked} onChange={(e) => this.onCheckedRow(e.target.checked, -1)}/>
                                                : <input type="checkbox" checked={false} disabled />
                                            }
                                        </td>
                                        <td width={'3%'}>NO.</td>
                                        <td width={'10%'}>소속팀</td>
                                        <td width={'8%'}>이름</td>
                                        <td width={'8%'}>직위</td>
                                        <td width={'8%'}>직급</td>
                                        <td width={'10%'}>핸드폰 번호</td>
                                        <td width={'8%'}>사번</td>
                                        <td width={'10%'}>근무처 전화번호</td>
                                        <td width={'12%'}>Email</td>
                                        <td width={'10%'} className='userId'>
                                            사용자ID
                                            {
                                                this.state.isEditMode &&
                                                    <div>
                                                        <img src={editmode_icon} alt='도움말' />
                                                        <p>5~10자의 영문소문자 , 숫자와 특수기호(_),(-)만 사용 가능합니다.</p>
                                                    </div>
                                            }
                                        </td>
                                        <td width={'10%'}>권한</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {accountUserTable}
                                </tbody>
                            </table>
                        </section> 
                        {
                            this.state.isEditMode &&
                                <ul className={'buttonWrap'}>
                                    <li className={'cancelBtn'} onClick={this.onClickClosePopup}>취소</li>
                                    <li className={'saveBtn'} onClick={() => this.showConfirmDialog(['저장하시겠습니까?'], ['초기화', '확인'], this.onClickSaveDB, 'save')}>저장</li>
                                </ul>
                        }
                        </>
                        }
                        {/* 신규등록 */}
                        {
                            this.state.showTable === 'userAdd' &&
                                <AccountManagerAdduser
                                    showConfirmDialog={this.showConfirmDialog}
                                    dbUsers={this.state.dbUsers}
                                    onClickClosePopup={this.props.onClickClosePopup}
                                    changeMenu={this.changeMenu}
                                />
                        }
                    </div>
                </AccountManagerComponent>
                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog 
                        messages={this.state.confirmMessage.messages} 
                        buttons={this.state.confirmMessage.buttons} 
                        onClose={this.state.confirmMessage.onClose}
                        onClickButton={this.state.confirmMessage.onClickButton}
                        onCloseConfirmDialog={this.onCloseConfirmDialog}
                        onClickClosePopup={this.props.onClickClosePopup}
                        type={this.state.confirmMessage.type}
                    />
                } 
            </ModalBackground>
        );
    }
}

export default withRouter(AccountManager);