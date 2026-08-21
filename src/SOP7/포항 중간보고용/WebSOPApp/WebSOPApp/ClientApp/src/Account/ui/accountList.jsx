import React, { Component } from 'react';

import { AccountListComponent } from '../styled/accountManagerStyled';
import AccountUpdateUser from './accountUpdateUser';

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
        }
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

        if (!accountUsers) {
            return;
        }

        const startIndex = (pageIndex - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedUsers = accountUsers.slice(startIndex, endIndex);

        return paginatedUsers.map((user, i) => (
            <li key={"userID_" + user.id} onClick={(e) => this.updateUser(e, user)}>
                <div>{startIndex + i + 1}</div>
                <div>{user.regular?.teamName}</div>
                <div>{user.memberName}</div>
                <div>{user.jobLevel?.name}</div>
                <div>{user.userID}</div>
                <div>{user.accountLevel?.levelName}</div>
            </li>
        ));
        
    }
    
    sortUser = (sortType) => {
        this.props.sortAccountUsers(sortType);
    }
    
    saveUserInfo = (user) => {
        
    }

    render() {

        const userListUI = this.getUserListUI();
        
        const { pageIndex, pageSize } = this.state;
        const totalPages = Math.ceil(this.props.accountUsers.length / pageSize);

        return (
            <>
                <AccountListComponent>
                    <div className='searchWrap'>
                        <input type="text" id="txtSearch" placeholder='검색어를 입력해주세요.'/>
                        <button>검색</button>
                    </div>
                    <div className='listWrap'>
                    <ul className='accountList'>
                        <li className='head'>
                            <div>NO</div>
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
                    />
                }
            </>
        );
    }
}

export default AccountList;