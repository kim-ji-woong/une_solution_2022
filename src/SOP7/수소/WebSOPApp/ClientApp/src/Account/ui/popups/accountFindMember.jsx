import React, { Component } from 'react';

import { AccountFindMemberComponent } from '../../styled/accountPopupsStyled';
import { ModalBackground } from '../../../Root/styled/theme';
import close_btn from '../../../Common/img/imghydrogen/main/close_icon.svg';
import magnifier_icon from '../../../Common/img/imghydrogen/main/magnifier_icon.svg';
import cancelIcon from '../../../Common/img/imghydrogen/cancel_icon.svg';
import $ from 'jquery';

import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';
import SearchInput from '../../../Common/ui/searchInput';

class AccountFindMember extends Component {
    // 행이 6개 이상이면 Table head css값 변경
    
    constructor(props) {
        super(props);

		this.state = {
            idSearch: '',
            displayAccountUser: [],
        }
        
        this.props = props;
    }

    onClickCloseFindMember = () => {
        this.props.onClickCloseFindMember();
    }

    onSearch = () => {
        const accountUsers = this.props.accountUsers;
        let displayAccountUser = [];

        let search = document.getElementById('searchWrapInput').value;

        for (let i = 0; i < accountUsers?.length; i++) {
            const user = accountUsers[i];

            if (user.accountID > 0)
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
                    user.memberName?.toLowerCase().includes(search)) {
                    displayAccountUser.push(user);
                }
            }
                
        }

        this.setState({ displayAccountUser });
    }

    getAccountUserTable = () => {
        let accountUserTable = [];
        let accountUsers = this.state.displayAccountUser;

        for (let i = 0; i < accountUsers.length; i++) {
            let user = accountUsers[i];

            let regularName = "";
            if (user.regular?.teamName) {
                regularName = user.regular.teamName;
            }

            let jobPosition = "-";
            if (user.jobPosition?.name) {
                jobPosition = i18nUtil.convertText(user.jobPosition.name);
            }

            accountUserTable.push(
                <li key={"find_" + user.id + "_" + i} onClick={() => this.props.selectUser(user)}>
                    <div>{i + 1}</div>
                    <div>{regularName}</div>
                    <div>{user.memberName}</div>
                    <div>{jobPosition}</div>
                    <div>{user.phoneNumber}</div>
                    <div>{user.officePhoneNumber}</div>
                    <div>{user.email}</div>
                </li>
            );
        }

        return accountUserTable;
    }

    render(){
        let rowLength = 10;

        const accountUserTable = this.getAccountUserTable();

        const { displayAccountUser } = this.state;

        return (
            <ModalBackground>
                <AccountFindMemberComponent $rowLength={rowLength}>
                    <header>
                        <h2>{i18n.t('account.조직정보 불러오기')}</h2>
                        <button onClick={this.onClickCloseFindMember} className={'closeBtn'}>
                            <img src={close_btn} alt='닫기 버튼' width={24} height={24} />
                        </button>
                    </header>
                    <section>
                        <SearchInput
                            search={this.onSearch}
                        />
                        <div className='listWrap'>
                            <ul className='accountList'>
                                <li className='head'>
                                    <div>NO</div>
                                    <div>{i18n.t('account.소속 조직')}</div>
                                    <div>{i18n.t('account.이름')}</div>
                                    <div>{i18n.t('account.직위')}</div>
                                    <div>{i18n.t('account.휴대전화번호')}</div>
                                    <div>{i18n.t('account.근무처 전화번호')}</div>
                                    <div>Email</div>
                                </li>
                                <li className='body'>
                                    {
                                        displayAccountUser.length > 0 ? 
                                        <ul>
                                            {accountUserTable}
                                        </ul>
                                        : <div>
                                                <p>{i18n.t('account.찾고자 하는 조직원의 정보를 검색해주세요')}</p>
                                        </div>
                                    }
                                </li>
                            </ul>
                        </div>
                        

                    </section>

                    {/* <div className='btnWrap'>
                        <button className='cancle' onClick={() => props.handlePopup(false)}>취소</button>
                        <button className='submit'>적용</button>
                    </div> */}
                </AccountFindMemberComponent>
            </ModalBackground>
        );
    }
}

export default AccountFindMember;