import React, { Component } from 'react';

import { AccountListComponent } from '../styled/accountManagerStyled';
import AccountUpdateUser from './accountUpdateUser';
import ProjectResource from "../../Root/resource/id";
import {SDMSController} from "../../SDMS/services/sdmsController";
import {AccountController} from "../services/accountController";

class AccountList extends Component {
    
    static sortType = {
        id: 0,
        regular: 1,
        jobLevel: 2,
        userLevel: 3,
    }
    constructor(props) {
        super(props);

        this.state = {
            showUpdateUserPopup: false,
            
            pageIndex: 1,
            pageTotal: 1,
            pageSize: 14,
            
            selectedUser: null,
            
            search: '',
            
            sortOrder: {
                id: 'asc',
                regular: 'asc',
                jobLevel: 'asc',
                userLevel: 'asc',
            },
            
            accountLevels: null,
            userMemos: null,

            searchTxt: '',
        }
        
        this.init();
    }
    
    init = async () => {
        const accountLevels = await AccountController.getAccountLevels();

        if (!accountLevels) {
            this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["계정 레벨 정보를 불러오는데 실패하였습니다."], null, null);
            return;
        }
        
        this.setState({ accountLevels });
    }

    updateUser = (e, user) => {
        e.preventDefault();
        e.currentTarget.classList.add('selectUser');
        this.handlePopup(true);
        
        this.setState({ selectedUser: user });
    }

    handlePopup = (isShow) => {
        if(!isShow) {
            let element = document.getElementsByClassName('selectUser');
            element = Array.prototype.slice.call(element);

            // 사용자 선택 팝업 닫히면 선택된 li tag의 클래스도 삭제
            element.length > 0 &&
                element.map((item) => item.classList.remove('selectUser'));
        }
        this.setState({ showUpdateUserPopup: isShow });
    }

    handlePageChange = (newPageIndex) => {
        this.setState({ pageIndex: newPageIndex });
    }
    
    getUserListUI = () => {
        const { accountUsers } = this.props;
        const { pageIndex, pageSize } = this.state;

        if (!accountUsers || accountUsers.length === 0) {
            return;
        }
        
        const searchTxt = this.state.searchTxt;
        
        let filteredUsers = [];
        
        if (searchTxt && searchTxt.length > 0) {
            for (let i = 0; i < accountUsers.length; i++) {
                let user = accountUsers[i];
                
                const regularName = user.regular.teamName;
                const memberName = user.memberName;
                const jobLevel = user.jobLevel.name;
                const jobPosition = user.jobPosition.name;
                
                if (regularName.includes(searchTxt) || 
                    memberName.includes(searchTxt) || 
                    jobLevel.includes(searchTxt) || 
                    jobPosition.includes(searchTxt)) {
                    filteredUsers.push(user);
                }
                
            }
        } else {
            filteredUsers = accountUsers;
        }
        
        if (filteredUsers.length === 0) {
            return;
        }

        const startIndex = (pageIndex - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex).filter(user => user.accountID !== -1);
        
        return paginatedUsers
            .map((user, i) => (
            <li key={"userID_" + user.id} onClick={(e) => this.updateUser(e, user)}>
                <div>{user.id}</div>
                <div>{user.regular?.teamName}</div>
                <div>{user.memberName}</div>
                <div>{user.jobLevel?.name}</div>
                <div>{user.userID}</div>
                <div>{user.accountLevel?.levelName}</div>
            </li>
        ));
        
    }
    
    sortUser = (sortType) => {
        
        let sortOrders = { ...this.state.sortOrder };
        
        let sortOrder = null;
        
        if (sortType === AccountList.sortType.id) {
            sortOrder = this.state.sortOrder.id === 'asc' ? 'desc' : 'asc';
            sortOrders.id = sortOrder;
        } else if (sortType === AccountList.sortType.regular) {
            sortOrder = this.state.sortOrder.regular === 'asc' ? 'desc' : 'asc';
            sortOrders.regular = sortOrder;
        } else if (sortType === AccountList.sortType.jobLevel) {
            sortOrder = this.state.sortOrder.jobLevel === 'asc' ? 'desc' : 'asc';
            sortOrders.jobLevel = sortOrder;
        } else if (sortType === AccountList.sortType.userLevel) {
            sortOrder = this.state.sortOrder.userLevel === 'asc' ? 'desc' : 'asc';
            sortOrders.userLevel = sortOrder
        }
        
        this.props.sortAccountUsers(sortType, sortOrder);
        
        this.setState({ sortOrder: sortOrders });
        
    }
    
    saveUserInfo = (user) => {
        
    }
    
    onChangeSearchTxt = (e) => {
        this.setState({ search: e.target.value });
    }
    
    onClickSearch = async () => {
        const search = this.state.search;
        
        this.setState({ searchTxt: search });
    }

    render() {

        const userListUI = this.getUserListUI();
        
        const { pageIndex, pageSize } = this.state;
        const totalPages = Math.ceil(this.props.accountUsers.length / pageSize);

        return (
            <>
                <AccountListComponent>
                    <div className='searchWrap'>
                        <input type="text" id="txtSearch" placeholder='검색어를 입력해주세요.' onChange={(e) => this.onChangeSearchTxt(e)}/>
                        <button onClick={() => this.onClickSearch()}>검색</button>
                    </div>
                    <div className='listWrap'>
                    <ul className='accountList'>
                        <li className='head'>
                            <div>
                                <div className='sort'>
                                    <span>NO</span>
                                    <button className='sortBtn az' onClick={() => this.sortUser(AccountList.sortType.id)}/>
                                </div>
                            </div>
                            <div>
                                <div className='sort'>
                                <span>소속 조직</span>
                                    <button className='sortBtn az' onClick={() => this.sortUser(AccountList.sortType.regular)}/>
                                </div>
                            </div>
                            <div>이름</div>
                            <div>
                                <div className='sort'>
                                    <span>직위</span>
                                    <button className='sortBtn az' onClick={() => this.sortUser(AccountList.sortType.jobLevel)}/>
                                </div>
                            </div>
                            <div>사용자ID</div>
                            <div>
                                <div className='sort'>
                                    <span>권한</span>
                                    <button className='sortBtn az' onClick={() => this.sortUser(AccountList.sortType.userLevel)}/>
                                </div>
                            </div>
                        </li>
                        <li className='body'>
                            <ul>
                            {
                                userListUI
                            }
                            </ul>
                        </li>
                    </ul>

                        <div className='pagenation'>
                            <button className='first' onClick={() => this.handlePageChange(1)}
                                    disabled={pageIndex === 1}>맨앞
                            </button>
                            <button className='prev' onClick={() => this.handlePageChange(pageIndex - 1)}
                                    disabled={pageIndex === 1}>이전
                            </button>
                            <ul>
                                {Array.from({length: totalPages}, (_, i) => (
                                    <li key={i} className={pageIndex === i + 1 ? 'on' : null}>
                                        <button onClick={() => this.handlePageChange(i + 1)}>{i + 1}</button>
                                    </li>
                                ))}
                            </ul>
                            <button className='next' onClick={() => this.handlePageChange(pageIndex + 1)}
                                    disabled={pageIndex === totalPages}>다음
                            </button>
                            <button className='last' onClick={() => this.handlePageChange(totalPages)}
                                    disabled={pageIndex === totalPages}>맨뒤
                            </button>
                        </div>
                    </div>
                </AccountListComponent>
                {
                    this.state.showUpdateUserPopup &&
                    <AccountUpdateUser
                        handlePopup={this.handlePopup}
                        showConfirmDialog={this.props.showConfirmDialog}
                        onCloseConfirmDialog={this.props.onCloseConfirmDialog}
                        selectedUser={this.state.selectedUser}
                        saveUserInfo={this.props.saveUserInfo}
                        accountLevels={this.state.accountLevels}
                        userMemos={this.props.userMemos}
                        deleteUser={this.props.deleteUser}
                    />
                }
            </>
        );
    }
}

export default AccountList;