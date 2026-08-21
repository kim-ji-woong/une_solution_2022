import React, { Component } from 'react';
import { AccountListComponent } from '../../../Account/styled/accountPopupsStyled';
import magnifier_icon from '../../../Common/img/imghydrogen/main/magnifier_icon.svg';
import AccountUpdateUser from './accountUpdateUser';

import { AccountController } from '../../services/accountController';
import ProjectResource from "../../../Root/resource/id";
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';
import SearchInput from '../../../Common/ui/searchInput';

class AccountList extends Component {
    static ItemNum = 14;
    static pageNum = 5;

	constructor(props) {
		super(props);

		this.state = {
            userInformation: null,
            currentPage: null,
            lastPage: null,
            displayAccountUser: [],
		}

        this.props = props;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.accountUsers !== prevProps.accountUsers) {
            this.onClickSaerch();
        }
    }

    componentDidMount() {
        this.onClickSaerch();
    }

    onClickSaerch = () => {
        const accountUsers = this.props.accountUsers;
        let displayAccountUser = [];
        let currentPage = null;
        let lastPage = null;

        let search = document.getElementById('searchWrapInput').value;

        const userInfo = ProjectResource.getUserInfo();

        for (let i = 0; i < accountUsers?.length; i++) {
            const user = accountUsers[i];

            // 본인 계정 제외
            if (user.accountID === -1 ||
                user.accountID === userInfo.id)
                continue;


            if (!search) {
                displayAccountUser.push(user);
            }
            else {
                search = search.toLowerCase();

                if (user.regular?.teamName?.toLowerCase().includes(search) ||
                    user.jobLevel?.name?.toLowerCase().includes(search) ||
                    user.jobPosition?.name?.toLowerCase().includes(search) ||
                    user.phoneNumber?.toLowerCase().includes(search) ||
                    user.officePhoneNumber?.toLowerCase().includes(search) ||
                    user.memberID?.toLowerCase().includes(search) ||
                    user.email?.toLowerCase().includes(search) ||
                    user.accountLevel?.levelName?.toLowerCase().includes(search) ||
                    user.memberName?.toLowerCase().includes(search) ||
                    user.userID?.toLowerCase().includes(search)) {
                    displayAccountUser.push(user);
                }
            }            
        }

        if (displayAccountUser.length > 0) {
            currentPage = 1;            
            lastPage = Math.floor(displayAccountUser.length / AccountList.ItemNum) + 1;
        }
        else {
            currentPage = null;
            lastPage = null;
        }

        this.setState({ displayAccountUser, currentPage, lastPage });
    }

    updateUser = (user) => {
        let element = document.getElementById("userItem_" + user.id);
        if (element)
            element.classList.add('selectUser');

        this.setState({ userInformation: user }); 
    }

    onClickCloseUserInfo = (id) => {
        let element = document.getElementById("userItem_" + id);
        if (element)
            element.classList.remove('selectUser');

        this.setState({ userInformation : null });
    }

    getAccountUserTable = () => {
        let accountUserTable = [];
        let accountUsers = this.state.displayAccountUser;

        const currentPage = this.state.currentPage;

        const firstNum = (currentPage > 0) ? AccountList.ItemNum * (currentPage - 1) : 0;
        
        for (let i = firstNum; i < firstNum + AccountList.ItemNum; i++) {
            if (accountUsers.length <= i) {
                break;
            }                

            let user = accountUsers[i];

            let regularName = "";
            if (user.regular?.teamName) {
                regularName = user.regular.teamName;
            }

            let jobLevel = "-";
            if (user.jobLevel?.name) {
                jobLevel = i18nUtil.convertText(user.jobLevel.name);
            }

            let jobPosition = "-";
            if (user.jobPosition?.name) {
                jobPosition = i18nUtil.convertText(user.jobPosition.name);
            }

            let levelName = "-";
            if (user.accountLevel?.levelName) {
                levelName = i18nUtil.convertText(user.accountLevel.levelName);
            }

            accountUserTable.push(
                <li key={user.id + "_" + i} id={"userItem_" + user.id} onClick={() => this.updateUser(user)}>
                    <div>{i + 1}</div>
                    <div>{regularName}</div>
                    <div>{user.memberName}</div>
                    <div>{jobPosition}</div>
                    <div>{user.userID}</div>
                    <div>{levelName}</div>
                </li>
            );
        }       

        return accountUserTable;
    }

    getPagenationUI = () => {
        let pagenationUI = null;
        const currentPage = this.state.currentPage;
        const lastPage = this.state.lastPage;

        //const pageFirst = currentPage === null ? null : currentPage - (currentPage % AccountList.pageNum) + 1;
        const pageFirst = currentPage === null ? null : Math.floor((currentPage - 1) / AccountList.pageNum) * AccountList.pageNum + 1;
        //const pageLast = lastPage === null ? null : lastPage - (lastPage % AccountList.pageNum) + 1;

        let pageItems = [];

        if (currentPage !== null && lastPage !== null) {
            for (let i = pageFirst; i < pageFirst + 5; i++) {
                if (i > lastPage)
                    break;

                if (i === currentPage)
                    pageItems.push(<li key={i} className='on'><button>{i}</button></li>);
                else
                    pageItems.push(<li key={i} onClick={() => this.setPage(i)}><button>{i}</button></li>);
            }

            pagenationUI = <div className='pagenation'>
                <button className={(pageFirst > 1) ? 'first' : 'firstDisable'} onClick={() => this.onClickFirst(pageFirst)}>{i18n.t('common.맨앞')}</button>
                <button className={(pageFirst > AccountList.pageNum) ? 'prev' : 'prevDisable'} onClick={() => this.onClickPrev(pageFirst)}>{i18n.t('common.이전')}</button>
                <ul>
                    {pageItems}
                </ul>
                <button className={(pageFirst + 5 <= lastPage) ? 'next' : 'nextDisable'} onClick={() => this.onClickNext(pageFirst)}>{i18n.t('common.다음')}</button>
                <button className={(pageFirst + 5 <= lastPage) ? 'last' : 'lastDisable'} onClick={() => this.onClickLast(pageFirst)}>{i18n.t('common.맨뒤')}</button>
            </div>;
        }        
       
        return pagenationUI;
    }

    onClickFirst = (pageFirst) => {
        if (pageFirst > 1) {
            this.setState({ currentPage: 1 });
        }
    }

    onClickPrev = (pageFirst) => {
        if (pageFirst > AccountList.pageNum) {
            this.setState({ currentPage: pageFirst - 1 });
        }            
    }

    onClickNext = (pageFirst) => {
        if (this.state.lastPage >= pageFirst + 5) {
            this.setState({ currentPage: pageFirst + 5 });
        }
    }

    onClickLast = (pageFirst) => {
        if (this.state.lastPage >= pageFirst + 5) {
            this.setState({ currentPage: this.state.lastPage });
        }
    }

    setPage = (pageIndex) => {
        if (pageIndex !== null && pageIndex !== undefined) {
            this.setState({ currentPage: pageIndex });
        }
    }

    removeUser = (id) => {
        let element = document.getElementById("userItem_" + id);
        if (element)
            element.classList.remove('selectUser');

        // 유저 리스트 삭제
        let accountUsers = this.props.accountUsers;
        for (let i = 0; i < accountUsers.length; i++) {
            let account = accountUsers[i];

            if (account.id === id) {
                accountUsers.splice(i, 1);
                break;
            }
        }

        this.state.userInformation = null;
        //this.props.accountUsers = accountUsers;   
        this.onClickSaerch();
    }

    render(){
        const accountUserTable = this.getAccountUserTable();
        const pagenationUI = this.getPagenationUI();

        return(
            <>
            <AccountListComponent>
                <SearchInput
                    search={this.onClickSaerch}
                />
                <div className='listWrap'>
                    <ul className='accountList'>
                        <li className='head'>
                            <div>NO</div>
                            <div>
                                <div className='_sort'>
                                     <span>{i18n.t('account.소속 조직')}</span>
                                    <button className='sortBtn az' />
                                </div>
                            </div>
                                <div>{i18n.t('account.이름')}</div>
                            <div>
                                <div className='_sort'>
                                    <span>{i18n.t('account.직위')}</span>
                                    <button className='sortBtn az' />
                                </div>
                            </div>
                            <div>{i18n.t('account.사용자ID')}</div>
                            <div>
                                <div className='_sort'>
                                    <span>{i18n.t('account.권한')}</span>
                                    <button className='sortBtn az' />
                                </div>
                            </div>
                        </li>
                        <li className='body'>
                            <ul>
                            {
                               accountUserTable
                            }
                            </ul>
                        </li>
                    </ul>

                    {pagenationUI}

                </div>
            </AccountListComponent>
            {
                this.state.userInformation !== null &&
                <AccountUpdateUser 
                    onClickCloseUserInfo={this.onClickCloseUserInfo}
                    userInformation={this.state.userInformation}
                    levels ={this.props.levels}
                    removeUser={this.removeUser}
                />
            }
            </>
        );
    }
}

export default AccountList;