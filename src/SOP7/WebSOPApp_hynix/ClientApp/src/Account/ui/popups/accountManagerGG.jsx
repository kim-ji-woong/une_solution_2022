import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import imgClose from '../../../Common/image/icon/popup_close_x.png';
import imgCloseWonik from '../../../Common/img/sub/dashboard_layer_close.png';

import ProjectResource from "../../../Root/resource/id";
import AccountResource from '../../resource/id';

import { AccountManagerNewPopup } from '../../styled/accountPopupsStyled.js';
import { ModalBackground } from '../../../Root/styled/variables';

import ColComboBox from '../columns/colComboBox';
import ConfirmDialog from '../../../Common/ui/confirmDialog';

import { AccountController } from '../../services/accountController';
import { i18n /*, withTranslation, i18nUtil*/ } from '../../../language/i18n';


class AccountManagerGG extends Component {
    static Type = {
        Level: 0
    }

	constructor(props) {
		super(props);

		this.state = {
            selectedSite: -1,   // 선택된 입주기관
            displayUsers: [],

            isEditMode: false,  // 사용자 편집모드
            levels: [],         // 권한 정보     (JSON {{value: "value값", name: "name값"}...}) 
            sites: [],          // 사이트 정보   (JSON {{value: "value값", name: "name값"}...}) 

            editMembers: [],    // 수정 리스트

            sortOrder: {
                siteName: 'desc',
                regularName: 'desc',
                memberName: 'desc',
                jobLevelName: 'desc',
                jopPositionName: 'desc',
                phoneNumber: 'desc',
                memberID: 'desc',
                officePhoneNumber: 'desc',
                email: 'desc',
                accountLevel: 'desc'
            },

            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: [i18n.t('common.확인')],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null
            },
        }

        this.refSearch = React.createRef();

        this.props = props;

        this.init();

        this.isLoading = false;
    }

    componentDidUpdate(prevProps, prevState) {
        //console.log('componentDidUpdate');
	}

    async init() {
        const userInfo = await ProjectResource?.initUserInfo();
        let siteID = userInfo.siteID;

		if (userInfo.siteID === ProjectResource.Site.GG_A) {
			siteID = null;
		}

        const accountLevels = await AccountController.getAccountLevels();
        this.state.accountLevels = accountLevels;

        const accountUsers = await AccountController.getAccountUsers(siteID);
        this.setSiteName(accountUsers);
        this.state.accountUsers = accountUsers;
        this.state.displayUsers = accountUsers;

        const arrSites = [];
        const sites = ProjectResource.sites;

        let temp = { value: -1, name: "-" };
        //arrSites.push(temp);

        for (let i = 0; i < sites?.length; i++) {
            const item = { value: sites[i].id, name: sites[i].siteName };
			arrSites.push(item);
        }
        
        this.state.sites = arrSites;

        const levels = [];
		levels.push(temp);

        for (let i = 0; i < accountLevels?.length; i++) {
            const item = { value: accountLevels[i].id, name: accountLevels[i].levelName };
			levels.push(item);
        }

        this.state.levels = levels;

        this.onClickSaerch();
    }

    setSiteName = (accountUsers) => {
        if (accountUsers.length > 0) {
            const sites = ProjectResource.sites;

            for (const user of accountUsers) {
                for (let i = 0; i < sites?.length; i++) {
                    const site = sites[i];
                    if (site.id === user.regular.siteID) {
                        user.siteName = site.siteName.trim();
                        break;
                    } 
                }
            }
        }
    }

    setEditMode = () => {
        if (this.state.isEditMode === true) {
            // 새로고침
            this.state.isEditMode = !this.state.isEditMode;
            this.reload();
        } else {
            this.setState({ isEditMode: !this.state.isEditMode });
        }
    }

    onClickClosePopup = () => {
        this.props.onClickClosePopup(false);
    }

    onChangeComboBox = (type, value, member) => {
        const accountUsers = this.state.accountUsers;
        const editMembers = this.state.editMembers;

        const levels = this.state.levels;
        const sites = this.state.sites;

        let user = accountUsers?.find(x => x.memberID === member?.memberID);
        if (user) {
            if (type === AccountManagerGG.Type.Level) {
                
                const level = levels?.find(x => x.value === value);
                if (level) {
                    user.accountLevel = { id: level.value, levelName: level.name };
                    member.accountLevel = { id: level.value, levelName: level.name };

                    if (level.value !== null && user.site === null && sites?.length > 0) {
                        // 권한이 새로 부여된다면 계정 SiteID 부여
                        user.site = { id: user.regular.siteID, siteName: user.regular.teamName, teamID: null };
                    } else if (level.value === null && user.site !== null) {
                        // 권한이 없어진다면 계정 SiteID 제거
                        user.site = null;
                    }

                    let editMember = editMembers.find(x => x.memberID === user.memberID);
                    if (!editMember) {
                        editMembers.push(user);
                    }

                    this.onClickSaerch();
                }
            }
        }
    }

    onClickSaerch = () => {
        const accountUsers = this.state.displayUsers;
        let displayAccountUser = [];

        const search =  this.refSearch.current.value.toString();

        for (let i = 0; i < accountUsers?.length; i++) {
            const user = accountUsers[i];

            let siteName = "";
            if (user.site?.siteName) {
                siteName = user.site?.siteName;
            }
            else if (user.regular?.siteID > 0) {
                const site = this.state.sites?.find(x => x.value === user.regular.siteID);
                if (site)
                    siteName = site.name;
            }

            if (!search) {
                displayAccountUser.push(user);
            }
            else if (user.regular?.teamName?.includes(search) ||
                user.jobLevel?.name?.includes(search) ||
                user.jobPosition?.name?.includes(search) ||
                user.phoneNumber?.includes(search) ||
                user.officePhoneNumber?.includes(search) ||
                user.memberID?.includes(search) ||
                user.email?.includes(search) ||
                user.accountLevel?.levelName?.includes(search) ||
                user.memberName?.includes(search) ||
                siteName?.includes(search)) {
                displayAccountUser.push(user);
            }
        }

        this.setState({ displayAccountUser });
    }

    setAccountUserTable = () => {
        const userInfo = ProjectResource.getUserInfo();

        let accountUserTable = [];
        let accountUsers = this.state.displayAccountUser;

        for (let i = 0; i < accountUsers?.length; i++) {
            let user = accountUsers[i];

            // 사번이 존재하지 않는다면 제외
            if (!user.memberID || user.memberID === "") 
                continue;

            let regularName = "";
            if (user.regular?.teamName) {
                regularName = user.regular.teamName;
            }

            let jobLevel = "-";
            if (user.jobLevel?.name) {
                jobLevel = user.jobLevel.name;
            }

            let jobPosition = "-";
            if (user.jobPosition?.name) {
                jobPosition = user.jobPosition.name;
            }

            let levelName = "-";
            if (user.accountLevel?.levelName) {
                levelName = user.accountLevel.levelName;
            }

            let siteName = "-";
            if (user.regular?.siteID) {
                const sites = ProjectResource.sites;
                for(let i = 0; i < sites?.length; i++) {
                    const site = sites[i];
                    if (site.id === user.regular.siteID) {
                        siteName = site.siteName;
                        break;
                    } 
                }
            }

            let options = [];
            let levels = this.state.levels;

            for (let i = 0; i < levels.length; i++) {
                if (i === 0) {
                    options.push(levels[i]);
                }
                else if (i === 1 && user.regular.siteID === ProjectResource.Site.GG_A) {
                    options.push(levels[i]);
                }
                else if (i > 1) {
                    options.push(levels[i]);
                }
            }

            accountUserTable.push(
                <tr key={"accountUserTable_" + user.id}>
                    <td>{i + 1}</td>
                    <td>{siteName}</td>
                    <td>{regularName}</td>
                    <td>{user.memberName}</td>   
                    <td>{jobLevel}</td>
                    <td>{jobPosition}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.memberID}</td>
                    <td>{user.officePhoneNumber}</td>
                    <td>{user.email}</td>
                    <td>
                    {
                        (this.state.isEditMode && userInfo?.id !== user.accountID) ?
                        <ColComboBox
                            type={AccountManagerGG.Type.Level}
                            member={user}
                            options={options}
                            value={(user.accountLevel?.id >= 0 ? user.accountLevel.id : -1)}
                            onChange={this.onChangeComboBox}
                        />
                        : levelName
                    }
                    </td>
                </tr>
            );
        }
        

        return accountUserTable;
    }

    async reload() {
        const userInfo = await ProjectResource?.initUserInfo();
        let siteID = userInfo.siteID;

        if (userInfo.siteID === ProjectResource.Site.GG_A) {
			siteID = null;
		}

        const accountUsers = await AccountController.getAccountUsers(siteID);
        this.setSiteName(accountUsers);
        this.state.accountUsers = accountUsers;
        this.state.displayUsers = accountUsers;

        this.onClickSaerch();
    }

    onClickSave = async () => {
        const editMembers = this.state.editMembers;
        if (!editMembers || editMembers.length === 0 || this.isLoading === true)
            return;

        // UI 관련
        this.isLoading = true;
        const cursor = document.querySelector('.saveBtn');
        if (cursor) {
            cursor.style.cursor = "wait";
        }

        let deleteOnly = true;
        for (let member of editMembers) {
            if (member.accountLevel.id !== -1) 
                deleteOnly = false;
        }

        const user = ProjectResource.getUserInfo();

        const textConfirm = i18n.t('common.확인');
        const textError = i18n.t('account.에러');

        const [result, message] = await AccountController.updateAccountUser2(editMembers, user.id);
        if (result === true) {
            this.state.editMembers = [];
            if (deleteOnly) {
                this.showConfirmDialog(textConfirm, ['사용자 권한이 변경되었습니다.'], [textConfirm], this.onClickConfirm, this.onClickConfirm);
            }
            else {
                this.showConfirmDialog(textConfirm, ['계정의 권한이 부여되었습니다. 임시 비밀번호는 [1234]입니다.', '*비밀번호 변경 필수'], [textConfirm], this.onClickConfirm, this.onClickConfirm);
            }
        } else {
            this.showConfirmDialog(textError, [message], [textConfirm], this.onClickConfirm, this.onClickConfirm);
        }

        // UI 관련
        this.isLoading = false;
        if (cursor) {
            cursor.style.cursor = "pointer";
        }
    }

    onClickConfirm = () => {
        // 결과 확인 후 새로고침
        this.state.isEditMode = !this.state.isEditMode;
        this.reload();

        this.onCloseConfirmDialog();
    }

    onClickCancle = () => {
        // 새로고침
        this.state.isEditMode = !this.state.isEditMode;
        this.reload();
    }

    showConfirmDialog = (title, messages, buttons, onClickButton, onClickClose) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.title = title;
        confirmMessage.buttons = buttons;
        confirmMessage.onClickButton = onClickButton;

        if (onClickClose !== null && onClickClose !== undefined)
            confirmMessage.onClose = onClickClose;

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

    handleKeyPress = (e) => {
        if (e.key === "Enter") {
            this.onClickSaerch();
            e.target.blur();
        }
    }

    getSelectBoxOptions = () => {
        let options = [];
        const sites = this.state.sites;

        options.push(<option key={'site_all'} value={-1}>전체기관</option>);

        if (sites.length > 0) {
            for (let site of sites) {
                options.push(<option key={'site_' + site.value} value={site.value}>{site.name.trim()}</option>);
            }
        }

        return options;
    }

    onChangeSelectedSite = (value) => {
        const accountUsers = this.state.accountUsers;

        if (this.state.selectedSite !== value) {
            if (Number(value) < 0) {
                this.setState({ selectedSite: value }, () => this.reload());
            }
            else {
                let newAccountUsers = accountUsers.filter((user) => user.regular.siteID === Number(value));
                this.setState({ selectedSite: value, displayUsers: newAccountUsers }, () => this.onClickSaerch());
            }
        }
    }

    onClickSortMembers = (sortType) => {
        let sortOrders = { ...this.state.sortOrder };
        
        let sortOrder = null;
        
        if (sortType === AccountResource.sortType.siteName) {
            sortOrder = this.state.sortOrder.siteName === 'asc' ? 'desc' : 'asc';
            sortOrders.siteName = sortOrder;
        }
        else if (sortType === AccountResource.sortType.regularName) {
            sortOrder = this.state.sortOrder.regularName === 'asc' ? 'desc' : 'asc';
            sortOrders.regularName = sortOrder;
        }
        else if (sortType === AccountResource.sortType.memberName) {
            sortOrder = this.state.sortOrder.memberName === 'asc' ? 'desc' : 'asc';
            sortOrders.memberName = sortOrder;
        }
        else if (sortType === AccountResource.sortType.jobLevelName) {
            sortOrder = this.state.sortOrder.jobLevelName === 'asc' ? 'desc' : 'asc';
            sortOrders.jobLevelName = sortOrder;
        }
        else if (sortType === AccountResource.sortType.jopPositionName) {
            sortOrder = this.state.sortOrder.jopPositionName === 'asc' ? 'desc' : 'asc';
            sortOrders.jopPositionName = sortOrder;
        }
        else if (sortType === AccountResource.sortType.phoneNumber) {
            sortOrder = this.state.sortOrder.phoneNumber === 'asc' ? 'desc' : 'asc';
            sortOrders.phoneNumber = sortOrder;
        }
        else if (sortType === AccountResource.sortType.memberID) {
            sortOrder = this.state.sortOrder.memberID === 'asc' ? 'desc' : 'asc';
            sortOrders.memberID = sortOrder;
        }
        else if (sortType === AccountResource.sortType.officePhoneNumber) {
            sortOrder = this.state.sortOrder.officePhoneNumber === 'asc' ? 'desc' : 'asc';
            sortOrders.officePhoneNumber = sortOrder;
        }
        else if (sortType === AccountResource.sortType.email) {
            sortOrder = this.state.sortOrder.email === 'asc' ? 'desc' : 'asc';
            sortOrders.email = sortOrder;
        }
        else if (sortType === AccountResource.sortType.accountLevel) {
            sortOrder = this.state.sortOrder.accountLevel === 'asc' ? 'desc' : 'asc';
            sortOrders.accountLevel = sortOrder;
        }
        
        this.doSortMembers(sortType, sortOrder);
        
        this.setState({ sortOrder: sortOrders });
    }

    doSortMembers = (sortType, sortOrder) => {
        const { displayAccountUser } = this.state;

        let sortedMembers = [...displayAccountUser];

		if (!sortedMembers || sortedMembers.length === 0) {
			return;
		}

        switch (sortType) {
            case AccountResource.sortType.siteName: // x
                sortedMembers.sort((a, b) => 
                    sortOrder === 'desc' 
                        ? b.siteName.localeCompare(a.siteName) 
                        : a.siteName.localeCompare(b.siteName)
                );
                break;
            case AccountResource.sortType.regularName:
                sortedMembers.sort((a, b) => 
                    sortOrder === 'desc' 
                        ? b.regular.teamName.localeCompare(a.regular.teamName) 
                        : a.regular.teamName.localeCompare(b.regular.teamName)
                );
                break;
            case AccountResource.sortType.memberName:
                sortedMembers.sort((a, b) => 
                    sortOrder === 'desc' 
                        ? b.memberName.localeCompare(a.memberName) 
                        : a.memberName.localeCompare(b.memberName)
                );
                break;
            case AccountResource.sortType.jobLevelName:
                sortedMembers.sort((a, b) => 
                    sortOrder === 'desc' 
                        ? b.jobLevel.name.localeCompare(a.jobLevel.name) 
                        : a.jobLevel.name.localeCompare(b.jobLevel.name)
                );
                break;
            case AccountResource.sortType.jopPositionName:
                sortedMembers.sort((a, b) => 
                    sortOrder === 'desc' 
                        ? b.jobPosition.name.localeCompare(a.jobPosition.name) 
                        : a.jobPosition.name.localeCompare(b.jobPosition.name)
                );
                break;
            case AccountResource.sortType.phoneNumber:
                sortedMembers.sort((a, b) => 
                    sortOrder === 'desc' 
                        ? b.phoneNumber?.localeCompare(a.phoneNumber) 
                        : a.phoneNumber?.localeCompare(b.phoneNumber)
                );
                break;
            case AccountResource.sortType.memberID:
                sortedMembers.sort((a, b) => sortOrder === 'desc' ? a.memberID - b.memberID : b.memberID - a.memberID);
                break;
            case AccountResource.sortType.officePhoneNumber:
                sortedMembers.sort((a, b) => 
                    sortOrder === 'desc' 
                        ? b.officePhoneNumber?.localeCompare(a.officePhoneNumber) 
                        : a.officePhoneNumber?.localeCompare(b.officePhoneNumber)
                );
                break;
            case AccountResource.sortType.email:
                sortedMembers.sort((a, b) => 
                    sortOrder === 'desc' 
                        ? b.email.localeCompare(a.email) 
                        : a.email.localeCompare(b.email)
                );
                break;
            case AccountResource.sortType.accountLevel:
                sortedMembers.sort((a, b) => 
                    sortOrder === 'desc' 
                        ? b.accountLevel?.levelName.localeCompare(a.accountLevel?.levelName) 
                        : a.accountLevel?.levelName.localeCompare(b.accountLevel?.levelName)
                );
                break;
            default:
                break;
        }
    
        this.setState({ displayAccountUser: sortedMembers, displayUsers: sortedMembers });
    }

    render() {
        const userInfo = ProjectResource.getUserInfo();
        const accountUserTable = this.setAccountUserTable();

        // const data = {
        //     id: 1,
        //     campus: '캠퍼스H',
        //     team: '안전관리팀',
        //     name: '홍길동',
        //     position: '팀장',
        //     position2: '팀장',
        //     phone: '010-0000-0000',
        //     teamNumber: 'SS0102',
        //     call: '000-0000-0000',
        //     email: 'aaa123@ncs.co.kr',
        //     authority: '총괄관리자'
        // }

        return (
            <>
                <ModalBackground>
                    <AccountManagerNewPopup>
                        <div className={"popupBox"}>
                            <div className='popupboxLine' />
                            <div className={"popupBoxTitle"}>{i18n.t('account.사용자 권한 관리')}</div>
                            <div className={"popupBoxX"}><a onClick={this.onClickClosePopup}><img src={ProjectResource.styleMode === ProjectResource.StyleType.Gyeonggi ? imgCloseWonik : imgClose} alt={i18n.t('account.저장되었습니다')} /></a></div>

                            <div className='popupContent'>
                                <div className='menuWrap'>
                                    <p>{i18n.t('account.목록')}</p>
                                </div>
                                <div className='filterWrap' style={{ justifyContent: userInfo?.siteID === ProjectResource.Site.GG_A ? 'space-between' : 'flex-end' }}>
                                    {
                                        userInfo?.siteID === ProjectResource.Site.GG_A &&
                                            <div className='selectSite'>
                                                <select name="" id={'selectBox'} onChange={(e) => this.onChangeSelectedSite(e.target.value)}>
                                                    {this.getSelectBoxOptions()}
                                                </select>
                                            </div>
                                    }
                                    <div className={'searchWrap'}>
                                        <input ref={this.refSearch} type="text" id="txtSearch" onKeyPress={this.handleKeyPress} placeholder={i18n.t('account.검색어를 입력해주세요')} />
                                        <a onClick={this.onClickSaerch}>{i18n.t('account.검색')}</a>
                                        <a onClick={this.setEditMode}>{i18n.t('common.편집')}</a>
                                    </div>

                                </div>
                                <section className='userList'>
                                    <table>
                                        <thead>
                                            <tr>
                                                <td width={'3%'}>NO.</td>
                                                <td width={'10%'}>{i18n.t('account.소속')}
                                                    <button className='sortBtn' onClick={() => this.onClickSortMembers(AccountResource.sortType.siteName)}>소속순으로 정렬</button>
                                                </td>
                                                <td width={'10%'}>{i18n.t('account.부서')}
                                                    <button className='sortBtn' onClick={() => this.onClickSortMembers(AccountResource.sortType.regularName)}>부서순으로 정렬</button>
                                                </td>
                                                <td width={'7%'}>{i18n.t('account.이름')}
                                                    <button className='sortBtn' onClick={() => this.onClickSortMembers(AccountResource.sortType.memberName)}>이름순으로 정렬</button>
                                                </td>
                                                <td width={'7%'}>{i18n.t('account.직위')}
                                                    <button className='sortBtn' onClick={() => this.onClickSortMembers(AccountResource.sortType.jobLevelName)}>직위순으로 정렬</button>
                                                </td>
                                                <td width={'7%'}>{i18n.t('account.직급')}
                                                    <button className='sortBtn' onClick={() => this.onClickSortMembers(AccountResource.sortType.jopPositionName)}>직급순으로 정렬</button>
                                                </td>
                                                <td width={'10%'}>{i18n.t('account.핸드폰 번호')}
                                                    <button className='sortBtn' onClick={() => this.onClickSortMembers(AccountResource.sortType.phoneNumber)}>핸드폰 번호순으로 정렬</button>
                                                </td>
                                                <td width={'7%'}>{i18n.t('account.사번')}
                                                    <button className='sortBtn' onClick={() => this.onClickSortMembers(AccountResource.sortType.memberID)}>사번순으로 정렬</button>
                                                </td>
                                                <td width={'10%'}>{i18n.t('account.근무처 전화번호')}
                                                    <button className='sortBtn' onClick={() => this.onClickSortMembers(AccountResource.sortType.officePhoneNumber)}>근무처 전화번호순으로 정렬</button>
                                                </td>
                                                <td width={'16%'}>{i18n.t('common.메일')}
                                                    <button className='sortBtn' onClick={() => this.onClickSortMembers(AccountResource.sortType.email)}>메일순으로 정렬</button>
                                                </td>
                                                <td width={'10%'}>{i18n.t('common.권한')}
                                                    <button className='sortBtn' onClick={() => this.onClickSortMembers(AccountResource.sortType.accountLevel)}>권한순으로 정렬</button>
                                                </td>
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
                                            <li className={'cancelBtn'} onClick={this.onClickCancle}>{i18n.t('common.취소')}</li>
                                            <li className={'saveBtn'} onClick={this.onClickSave}>{i18n.t('common.저장')}</li>
                                        </ul>
                                }
                            </div>
                        </div>

                    </AccountManagerNewPopup>
                </ModalBackground>
                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                        <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
                }
            </>
        );
    }
}

export default withRouter(AccountManagerGG);