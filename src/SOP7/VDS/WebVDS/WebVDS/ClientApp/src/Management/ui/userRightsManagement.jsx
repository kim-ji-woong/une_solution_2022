import React, { Component } from 'react';
import $ from 'jquery';

import dash from '../../Dashboard/css/dash.module.css';
import '../../Dashboard/css/dash.css';
import ProjectResource from '../../Root/resource/id';
import { AccountController } from '../../Account/services/accountController';
import ConfirmDialog from '../../Common/ui/confirmDialog';
import UserRightsEditManager from './userRightsEditManager';


class UserRightsManagement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //loading: true,
            dataCenters: [],
            levels: [],
            levels2: [],
            users: [],
            selectedLevel: null,
            searchText: null,
            pageNo: null,
            totalPage: null,
            editMode: false,
            memoUser: null,
            isChanged: false,
            newUserMode: false,
            userIDValidCheck: false,
            expandVDCCheckBoxList: false,
            newUserVdcList: [],
            expandVdcListUser: null,
            newUserMemo: null,
            showNewUserMemo: false,
            selectedNewUserLevel: null,
            selectedUser: null,

            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: ["확인"],
                icon: null,
                onClose: this.onCloseConfirmDialog,
                onClickButton: null
            }
        }

        this.maxLine = 12;

        this.refSearchText = React.createRef();
        this.refUserList = React.createRef();
        this.refMemo = React.createRef();
        this.refUserID = React.createRef();
        this.refCompanyName = React.createRef();
        this.refUserName = React.createRef();
        this.refPassword = React.createRef();
        this.refVdcCheckBoxes = React.createRef();
        this.refNewUserLevel = React.createRef();
        this.refCheckAll = React.createRef();

        this.allCheckClear = false;
        this.editManager = new UserRightsEditManager(this);

        this.wantEditMode = false;
    }

    componentDidMount() {
        /*$(document).ready(function () {
            $('.selectBox').click(function () {
              $('.selectDownBox').toggle();
            });

            $('.selectBoxVDC').click(function () {
                $('.selectDownBoxVDC').toggle();
            });

            $('.' + dash.dropbtn).click(function () {
                $('.' + dash.dropdownContent).toggle();
            });

            $('.' + dash.newText).click(function () {
                $('.' + dash.clientBox).hide();
                $('.' + dash.newUserBox).show();
                $('.' + dash.newBox).toggle();
            });

            $('.' + dash.cancelBtn).click(function () {
                $('.' + dash.clientBox).show();
                $('.' + dash.newUserBox).hide();
                $('.' + dash.newBox).show();
            });

            $('.' + dash.registrationBtn).click(function () {
                $('.' + dash.notUserRightText).show();
                $('.' + dash.notUserNameText).show();
                $('.' + dash.notIDText).show();
                $('.' + dash.notPasswordText).show();
                $('.' + dash.notAffiliationText).show();
                $('.' + dash.notVDCText).show();
            });
        });*/

        this.initDatas();
    }

    componentDidUpdate() {
        if (this.allCheckClear) {
            this.allCheckClear = false;
            this.setAllCheck(false);
        }

        if (this.wantEditMode) {
            this.wantEditMode = false;
            this.setState({ editMode: true });
        }
    }

    componentWillUnmount() {
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }

    async initDatas() {
        const user = ProjectResource.getUserInfo();

        if (user) {
            const [levels, message] = await AccountController.requestAccountLevels(user.id);

            if (levels) {
                const [levels2, _message] = await AccountController.requestAccountLevels2(user.id);

                if (!levels2) {
                    this.props.alertMessage(_message, ProjectResource.ID.messageBox.title.error);
                    return;
                }

                const site = this.props.site;

                if (site) {
                    const [users, errorMessage] = await AccountController.requestSearchUserList(site.id, user.id, null);

                    if (users) {
                        const [dataCenters, message2] = await AccountController.requestSiteDataCenters(site.id, user.id);

                        if (dataCenters) {
                            this.editManager.setUsers(users);
                            const [pageNo, totalPage] = this.getPageData(users);
                            this.setState({ levels, levels2, users, pageNo, totalPage, dataCenters, loading: false });
                        }
                        else {
                            this.props.alertMessage(message2, ProjectResource.ID.messageBox.title.error);
                        }
                    }
                    else {
                        this.props.alertMessage(errorMessage, ProjectResource.ID.messageBox.title.error);
                    }
                }
                else {
                    this.setState({ levels/*, loading: false*/ });
                }
            }
            else {
                this.props.alertMessage(message, ProjectResource.ID.messageBox.title.error);
            }
        }
    }

    onCloseConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        this.setState({ confirmMessage });
    }


    showConfirmDialog = (title, messages, buttons, onClickButton, icon) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.title = title;
        confirmMessage.buttons = buttons;
        confirmMessage.icon = icon;
        confirmMessage.onClickButton = onClickButton;

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

    showCheckboxes = () => {
        const checkboxes = document.getElementById("checkboxes");

        let expanded = false;
        if (!expanded) {
            checkboxes.style.display = "block";
            //expanded = true;
        } else {
            checkboxes.style.display = "none";
            //expanded = false;
        }

        this.setState({ expandVDCCheckBoxList: !this.state.expandVDCCheckBoxList });
    }

    showCheckboxesVDC = (user) => {
        const checkboxes2 = document.getElementById("checkboxes2");

        let expanded = false;
        if (!expanded) {
            checkboxes2.style.display = "block";
            //expanded = true;
        } else {
            checkboxes2.style.display = "none";
            //expanded = false;
        }

        if (this.state.expandVdcListUser === user) {
            this.cancelUserVdcCenters(user);
            this.setState({ expandVdcListUser: null });
        }
        else {
            this.setState({ expandVdcListUser: user });
        }
    }

    onClickCancelUserVdcCenters(user) {
        this.cancelUserVdcCenters(user);
        this.setState({ expandVdcListUser: null });
    }

    cancelUserVdcCenters(user) {
        const checkBox2 = document.getElementById("checkboxes2");

        if (checkBox2) {
            const childCount = checkBox2.children.length;

            for (let i = 0; i < childCount; i++) {
                const checkBox6 = checkBox2.children[i];

                if (checkBox6.children.length > 0) {
                    const labelElement = checkBox6.children[0];

                    if (labelElement.children.length > 0) {
                        const checkInput = labelElement.children[0];
                        const centerID = parseInt(checkInput.dataset.id);

                        if (!isNaN(centerID)) {
                            if (this.isUserDataCenter(centerID, user)) {
                                checkInput.checked = true;
                            }
                            else {
                                checkInput.checked = false;
                            }
                        }
                    }
                }
            }
        }
    }

    isUserDataCenter(centerID, user) {
        for (const dataCenter of user.dataCenters) {
            if (dataCenter.id === centerID) {
                return true;
            }
        }

        return false;
    }

    onClickSetUserVdcCenters(user) {
        const dataCenters = [];
        const element = document.getElementById(this.getSelectDownBoxID(user));

        if (!element) {
            return;
        }

        for (const childSpan of element.children) {
            if (childSpan.nodeName === "SPAN") {
                for (const childDiv of childSpan.children) {
                    for (const childLabel of childDiv.children) {
                        if (childLabel.children.length > 0) {
                            const input = childLabel.children[0];

                            if (input.checked) {
                                const dataCenter = this.findDataCenteFromID(parseInt(input.dataset.id), this.state.dataCenters);

                                if (dataCenter) {
                                    dataCenters.push(dataCenter);
                                }
                            }
                        }
                    }
                }
            }
        }

        user.dataCenters = dataCenters;
        this.editManager.updateUser(user);
        this.setState({ expandVdcListUser: false, isChanged: this.editManager.isChanged() });
    }

    onSelectNewUserAccountLevel(e) {
        const levelID = parseInt(e.target.value);
        const levels = [...this.state.levels];

        for (const level of levels) {
            if (level.id === levelID) {
                this.setState({ selectedNewUserLevel: level });
                return;
            }
        }
    }

    async onSelectAccountLevel(e) {
        const levelID = parseInt(e.target.value);
        const levels = [...this.state.levels];
        let _levelID = null;

        if (isNaN(levelID)) {
            return;
        }

        const site = this.props.site;

        if (!site) {
            return;
        }

        if (levelID < 0) {
            _levelID = null;
        }
        else {
            _levelID = levelID;
        }

        const user = ProjectResource.getUserInfo();

        if (user) {
            const [users, errorMessage] = await AccountController.requestSearchUserList(site.id, user.id, _levelID);

            if (users) {
                for (const level of levels) {
                    if (levelID < 0 || level.id === levelID) {
                        this.editManager.setUsers(users);
                        const [pageNo, totalPage] = this.getPageData(users);
                        const text = this.refSearchText.current.value;
                        this.setState({ selectedLevel: level, searchText: text, users, pageNo, totalPage });
                        return;
                    }
                }
            }
            else {
                this.props.alertMessage(errorMessage, ProjectResource.ID.messageBox.title.error);
            }
        }
    }

    getPageData(users, newUserMode = null) {
        const maxLine = newUserMode ? this.maxLine / 2 : this.maxLine;
        const userCount = users.length;

        if (userCount > maxLine) {
            if (userCount % maxLine === 0) {
                return [1, userCount / maxLine];
            }
            else {
                return [1, parseInt(userCount / maxLine) + 1];
            }
        }

        return [null, null];
    }

    onSearch(e) {
        if (e.keyCode === 13) {
            this.search();
        }
    }

    search() {
        const text = this.refSearchText.current.value;

        if (!text) {
            this.setState({ searchText: text });
        }
        else {
            this.setState({ searchText: text.trim() });
        }
    }

    getSiteElements() {
        const elements = [];

        elements.push(
            <span>고객사</span>
        );

        const options = [];
        const site = this.props.site;

        if (site) {
            options.push(
                <option>{ProjectResource.getSiteName(site)}</option>
            );
        }

        elements.push(
            <select>
                {
                    options
                }
            </select>
        );

        return elements;
    }

    getUserLevelElements() {
        const levels = [ ...this.state.levels ];

        const elements = [];

        elements.push(
            <span>권한</span>
        );

        const options = [];

        options.push(
            <option value={-1}>{ProjectResource.ID.management.select.all}</option>
        );

        for (const level of levels) {
            options.push(
                <option value={level.id}>{ProjectResource.getAccountLevelName(level)}</option>
            );
        }

        const selectedLevel = this.state.selectedLevel;

        if (selectedLevel) {
            elements.push(
                <select onChange={(e) => this.onSelectAccountLevel(e)} defaultValue={selectedLevel.id}>
                    {
                        options
                    }
                </select>
            );
        }
        else {
            elements.push(
                <select onChange={(e) => this.onSelectAccountLevel(e)}>
                    {
                        options
                    }
                </select>
            );
        }

        return elements;
    }

    getRegDate(user) {
        const regDate = user.userData.regDate;

        if (regDate) {
            const index1 = regDate.indexOf('-');

            if (index1 > 0) {
                const index2 = regDate.indexOf('-', index1 + 1);

                if (index2 > index1) {
                    const year = regDate.substring(0, index1);
                    const month = regDate.substring(index1 + 1, index1 + 3);
                    const day = regDate.substring(index2 + 1, index2 + 3);

                    return year + "." + month + "." + day;
                }
            }
        }

        return "";
    }

    onClickVDCList = (user) => {
        if (this.state.selectedUser === user) {
            this.setState({ selectedUser: null });
        }
        else {
            if (this.state.editMode === false) {
                this.setState({ selectedUser: null });
            }
        }
    }

    getSiteNameElement(siteName, siteNameConts, hidden) {
        if (siteName.length > 10) {
            siteNameConts = siteName;
            siteName = siteName.substring(0, 10) + "...";

            return (
                <td style={{ position: 'relative' }}>
                    <div className="tooltipSite">
                        <span className="tooltipSiteTitle">
                            {siteName}
                        </span>
                        <span className="tooltipSiteConts tooltip-left">
                            {siteNameConts}
                        </span>
                    </div>
                </td>
            );
        } else {
            return (
                <td>{siteName}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{siteName}</td>
            );
        }

        return (
            <td>{siteName}</td>
        );
    }

    getUserLevelElement(levelName, levelNameConts, hidden) {
        if (levelName.length > 6) {
            levelNameConts = levelName;
            levelName = levelName.substring(0, 6) + "...";

            return (
                <td style={{ position: 'relative' }}>
                    <div className="tooltipUserLevel">
                        <span className="tooltipUserLevelTitle">
                            {levelName}
                        </span>
                        <span className="tooltipUserLevelConts tooltip-left">
                            {levelNameConts}
                        </span>
                    </div>
                </td>
            );
        } else {
            return (
                <td>{levelName}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{levelName}</td>
            );
        }

        return (
            <td>{levelName}</td>
        );
    }

    getNickNameElement(nickName, nickNameConts, hidden) {
        if (nickName.length > 10) {
            nickNameConts = nickName;
            nickName = nickName.substring(0, 10) + "...";

            return (
                <td style={{ position: 'relative' }}>
                    <div className="tooltipNickName">
                        <span className="tooltipNickNameTitle">
                            {nickName}
                        </span>
                        <span className="tooltipNickNameConts tooltip-left">
                            {nickNameConts}
                        </span>
                    </div>
                </td>
            );

        } else {
            return (
                <td>{nickName}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{nickName}</td>
            );
        }
        return (
            <td>{nickName}</td>
        );
    }

    getUserIDElement(userID, userConts, hidden) {
        if (userID.length > 10) {
            userConts = userID;
            userID = userID.substring(0, 10) + "...";

            return (
                <td style={{ position: 'relative' }}>
                    <div className="tooltipUserID">
                        <span className="tooltipUserIDTitle">
                            {userID}
                        </span>
                        <span className="tooltipUserIDConts tooltip-left">
                            {userConts}
                        </span>
                    </div>
                </td>
            );
        } else {
            return (
                <td>{userID}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{userID}</td>
            );
        }

        return (
            <td>{userID}</td>
        );
    }

    getCompanyNameElement(companyName, companyNameConts, hidden) {
        if (companyName.length > 10) {
            companyNameConts = companyName;
            companyName = companyName.substring(0, 10) + "...";

            return (
                <td style={{ position: 'relative' }}>
                    <div className="tooltipCompanyName">
                        <span className="tooltipCompanyNameTitle">
                            {companyName}
                        </span>
                        <span className="tooltipCompanyNameConts tooltip-left">
                            {companyNameConts}
                        </span>
                    </div>
                </td>
            );
        } else {
            return (
                <td>{companyName}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{companyName}</td>
            );
        }

        return (
            <td>{companyName}</td>
        );
    }

    getVdcIDListElement(vdcIDList, vdcIDListConts, user, hidden) {
        if (vdcIDList === "")
            vdcIDList = "-";

        if (vdcIDList.length > 12) {
            vdcIDListConts = vdcIDList;
            vdcIDList = vdcIDList.substring(0, 12) + "...";

            return (
                <td className="vdcIDList" style={{ position: 'relative' }}>
                    <div className="tooltipList" onClick={() => this.onClickVDCList(user)}>
                        <span className="tooltipListTitle">
                            {vdcIDList}
                        </span>
                        <span className="tooltipListConts tooltip-left">
                            {vdcIDListConts}
                        </span>
                    </div>
                </td>
            );
        } else {
            return (
                <td>{vdcIDList}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden} onClick={() => this.onClickVDCList(user)}>{vdcIDList}</td>
            );
        }

        return (
            <td onClick={() => this.onClickVDCList(user)}>{vdcIDList}</td>
        );
    }

    getUserListElements() {
        const elements = [];
        const site = this.props.site;

        if (!site) {
            return elements;
        }

        const siteName = ProjectResource.getSiteName(site);
        //const siteNameConts = ProjectResource.getSiteName(site);
        const users = [...this.state.users];

        users.sort(function (user1, user2) {
            if (user1.userData && user2.userData) {
                if (user1.userData.regDate < user2.userData.regDate) {
                    return 1;
                }
                else if (user1.userData.regDate > user2.userData.regDate) {
                    return -1;
                }

                return 0;
            }
            else if (user1.userData) {
                return 1;
            }
            else if (user2.userData) {
                return -1;
            }

            return 0;
        });

        let userCount = users.length;
        let searchText = this.state.searchText;

        if (searchText && searchText.length > 0) {
            searchText = searchText.toLowerCase().trim();

            if (siteName.toLowerCase().indexOf(searchText) < 0) {
                for (let i = userCount - 1; i >= 0; i--) {
                    const user = users[i];
                    const levelName = ProjectResource.getAccountLevelName(user.userLevel).toLowerCase();

                    if (levelName.indexOf(searchText) >= 0) {
                        continue;
                    }

                    if (user.nickName.toLowerCase().indexOf(searchText) >= 0) {
                        continue;
                    }

                    if (user.userID.toLowerCase().indexOf(searchText) >= 0) {
                        continue;
                    }

                    if (user.userData.companyName.toLowerCase().indexOf(searchText) >= 0) {
                        continue;
                    }

                    if (this.getVdcIDListName(user).toLowerCase().indexOf(searchText) >= 0) {
                        continue;
                    }

                    if (this.getRegDate(user).indexOf(searchText) >= 0) {
                        continue;
                    }

                    users.splice(i, 1);
                }
            }
        }

        userCount = users.length;
        const maxLine = this.state.newUserMode ? this.maxLine / 2 : this.maxLine;

        let beginIndex = 0;
        let endIndex = userCount;

        if (userCount > maxLine) {
            if (this.state.pageNo !== null) {
                beginIndex = (this.state.pageNo - 1) * maxLine;

                const index2 = this.state.pageNo * maxLine;
                endIndex = userCount < index2 ? userCount : index2;
            }
            else {
                endIndex = maxLine;
            }
        }

        //const memoClassName = this.state.editMode ? dash.manageMemoIconAct : dash.manageMemoIcon;

        for (let i = beginIndex; i < endIndex; i++) {
            const user = users[i];
            const memo = user.userData.memo;

            const showMemo = (memo && memo.trim().length > 0) || this.state.editMode;
            const memoClassName = memo && memo.trim().length > 0 ? dash.manageMemoIconAct : (this.state.editMode ? dash.manageMemoIcon : dash.manageMemoIcon + " " + dash.disabled);

            let checkClassName = "";

            if (this.state.editMode) {
                checkClassName = user.userData.activate ? dash.checkIconAct : dash.checkIcon;
            }
            else {
                checkClassName = user.userData.activate ? dash.checkIconAct + " " + dash.disabled : dash.checkIcon + " " + dash.disabled;
            }

            const vdcIDList = this.getVdcIDList(user, site);
            //const levelNameConts = ProjectResource.getAccountLevelName(user.userLevel);


            if (user === this.state.selectedUser) {
                elements.push(
                    <tr data-id={user.id}>
                        <td>{this.getUserListCheckBox()}</td>
                        {
                            this.getSiteNameElement(siteName, true)
                        }
                        {
                            this.getUserLevelElement(ProjectResource.getAccountLevelName(user.userLevel), true)
                        }
                        {
                            this.getNickNameElement(user.nickName, true)
                        }
                        {
                            this.getUserIDElement(user.userID, true)
                        }
                        {
                            this.getCompanyNameElement(user.userData.companyName, true)
                        }
                        {
                            this.getVdcIDListElement(vdcIDList, user, true)
                        }
                        <td>{this.getRegDate(user)}</td>
                        <td><span className={memoClassName} onClick={() => this.onClickShowMemo(user)}></span></td>
                        <td><span className={checkClassName} onClick={() => this.onClickToggleUserActivate(user)}></span></td>
                    </tr>
                );
            } else if (this.state.editMode) {
                elements.push(
                    <tr data-id={user.id}>
                        <td>{this.getUserListCheckBox()}</td>
                        {
                            this.getSiteNameElement(siteName, true)
                        }
                        {
                            this.getUserLevelElement(ProjectResource.getAccountLevelName(user.userLevel), true)
                        }
                        {
                            this.getNickNameElement(user.nickName, true)
                        }
                        {
                            this.getUserIDElement(user.userID, true)
                        }
                        {
                            this.getCompanyNameElement(user.userData.companyName, true)
                        }
                        {
                            this.getVdcIDListElement(vdcIDList, user, true)
                        }
                        <td>{this.getRegDate(user)}</td>
                        {
                            this.getMemoElement2(user, memoClassName, showMemo)
                        }
                        <td><span className={checkClassName} onClick={() => this.onClickToggleUserActivate(user)}></span></td>
                    </tr>
                );
            }
            else {
                elements.push(
                    <tr data-id={user.id}>
                        <td>{this.getUserListCheckBox()}</td>
                        {
                            this.getSiteNameElement(siteName, true)
                        }
                        {
                            this.getUserLevelElement(ProjectResource.getAccountLevelName(user.userLevel), true)
                        }
                        {
                            this.getNickNameElement(user.nickName, true)
                        }
                        {
                            this.getUserIDElement(user.userID, true)
                        }
                        {
                            this.getCompanyNameElement(user.userData.companyName, true)
                        }
                        {
                            this.getVdcIDListElement(vdcIDList, user, true)
                        }
                        <td>{this.getRegDate(user)}</td>
                        <td><span className={memoClassName} onClick={() => this.onClickShowMemo(user)}></span></td>
                        <td><span className={checkClassName} onClick={() => this.onClickToggleUserActivate(user)}></span></td>
                    </tr>
                );
            }
        }

        return elements;
    }

    getMemoElement2(user, memoClassName, showMemo) {
        if (showMemo) {
            return (
                <td><span className={memoClassName} onClick={() => this.onClickShowMemo(user)}></span></td>
            );
        }

        return (
            <td><span className={memoClassName}></span></td>
        );
    }

    onClickToggleUserActivate(user) {
        if (this.state.editMode) {
            const me = ProjectResource.getUserInfo();

            if (me) {
                if (me.id === user.id) {
                    this.props.alertMessage("자신의 계정을 비활성화 시킬수 없습니다.", ProjectResource.ID.messageBox.title.warning, ConfirmDialog.icon.warning);
                }
                else {
                    user.userData.activate = !user.userData.activate;
                    this.editManager.updateUser(user);
                    this.setState({ isChanged: this.editManager.isChanged() });
                }
            }
        }
    }

    onClickCompleteMemo(user) {
        if (this.props.enableEdit && this.refMemo.current) {
            if (this.state.editMode) {
                user.userData.memo = this.refMemo.current.value;
                this.editManager.updateUser(user);
                this.setState({ showNewUserMemo: false, memoUser: null, isChanged: this.editManager.isChanged() });
            }
            else {
                this.setState({ showNewUserMemo: false, memoUser: null });
            }
        }
        else {
            this.onClickShowMemo(null);
        }
    }

    onClickCompleteNewUserMemo() {
        if (this.refMemo.current) {
            const memo = this.refMemo.current.value ? this.refMemo.current.value.trim() : "";
            this.setState({ showNewUserMemo: false, newUserMemo: memo });
        }
        else {
            this.setState({ showNewUserMemo: false });
        }
    }

    onClickShowNewUserMemo(show) {
        this.setState({ showNewUserMemo: show, memoUser: null });
    }

    onClickShowMemo(user) {
        if (user) {
            this.setState({ showNewUserMemo: true, memoUser: user });
        }
        else {
            this.setState({ showNewUserMemo: false, memoUser: user });
        }
    }

    getMemoTextArea(memo) {
        if (this.state.editMode && this.props.enableEdit) {
            return (
                <textarea ref={this.refMemo}>{memo}</textarea>
            );
        }

        return (
            <textarea ref={this.refMemo} disabled>{memo}</textarea>
        );
    }

    getMemoElement(user) {
        return (
            <div className={dash.userMemoPopBox} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <div className={dash.userMemoTitle}>
                    <span>메모작성</span>
                    <span className={dash.memoCloseIcon} onClick={() => this.onClickShowNewUserMemo(false)}></span>
                </div>
                <div className={dash.memoContents}>
                    {
                        this.getMemoTextArea(user.userData.memo)
                    }
                </div>
                <span className={dash.memoConfirmBtn} onClick={() => this.onClickCompleteMemo(user)}>확인</span>
            </div>
        );
    }

    getMemoElementVdc() {
        return (
            <div className={dash.userMemoPopBox} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <div className={dash.userMemoTitle}>
                    <span>메모작성</span>
                    <span className={dash.memoCloseIcon} onClick={() => this.onClickShowMemo(null)}></span>
                </div>
                <div className={dash.memoContents}>
                    <textarea ref={this.refMemo}>{this.state.newUserMemo}</textarea>
                </div>
                <span className={dash.memoConfirmBtn} onClick={() => this.onClickCompleteNewUserMemo()}>확인</span>
            </div>
        );
    }

    getUserListCheckBox() {
        if (this.state.editMode) {
            return (
                <input type="checkBox" />
            );
        }

        return (
            <input type="checkBox" disabled />
        );
    }

    onCheckAllUserList(e) {
        const checked = e.target.checked;
        this.setAllCheck(checked);
    }

    setAllCheck(checked) {
        for (const childTr of this.refUserList.current.children) {
            for (const childTd of childTr.children) {
                if (childTd.children.length > 0) {
                    const input = childTd.children[0];
                    input.checked = checked;
                }
            }
        }
    }

    getAllListCheckBox() {
        if (this.state.editMode) {
            return (
                <input ref={this.refCheckAll} type="checkBox" onChange={(e) => this.onCheckAllUserList(e)} />
            );
        }

        return (
            <input type="checkBox" disabled />
        );
    }

    onTooltipEnter(e) {
        if (e.target.nextSibling) {
            if (e.target.nextSibling.classList.contains("tooltipSelectBoxConts")) {
                const rect = e.target.getBoundingClientRect();

                const checkBox2 = this.getParent(e.target, "checkboxes2");

                if (checkBox2) {
                    const rectParent = checkBox2.getBoundingClientRect();

                    e.target.nextSibling.style.left = "0px";
                    e.target.nextSibling.style.top = (rect.top - rectParent.top) + "px";
                }
            }
        }
    }

    getParent(element, id) {
        if (!element.parentElement) {
            return null;
        }

        if (element.parentElement.id === id) {
            return element.parentElement;
        }

        return this.getParent(element.parentElement, id);
    }

    getSelectBoxElement(dataCenter, dataCenterConts, hidden) {
        if (dataCenter.length > 6) {
            dataCenterConts = dataCenter;
            dataCenter = dataCenter.substring(0, 6) + "...";

            return (
                <div className="tooltipSelectBox">
                    <span className="tooltipSelectBoxTitle" onMouseEnter={(e) => this.onTooltipEnter(e)}>
                        {dataCenter}
                    </span>
                    <span className="tooltipSelectBoxConts tooltip-left">
                        {dataCenterConts}
                    </span>
                </div>
            );
        } else {
            return (
                <td>{dataCenter}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{dataCenter}</td>
            );
        }

        return (
            <td>{dataCenter}</td>
        );
    }


    getVdcIDList(user, site) {
        //const siteName = ProjectResource.getSiteName(site);
        let vdcList = "";

        if (user.dataCenters) {
            if (this.state.editMode) {
                const buttons = [];
                const dataCenters = [...this.state.dataCenters];

                for (const dataCenter of dataCenters) {
                    const checked = this.findDataCenteFromID(dataCenter.id, user.dataCenters) ? true : false;
                    const centerID = "dataCenter_input_" + dataCenter.id;

                    buttons.push(
                        <div className="checkBox6">
                            <label for={centerID} className={dash.labelBox}>
                                <input type="checkbox" id={centerID} data-id={dataCenter.id} defaultChecked={checked} />
                                <p>
                                    {/* {ProjectResource.getDataCenterName(dataCenter)} */}
                                    {
                                        this.getSelectBoxElement(ProjectResource.getDataCenterName(dataCenter), true)
                                    }
                                </p>
                            </label>
                        </div>
                    );
                }

                const confirmButtons = [];
                const selectDownBoxVDCID = this.getSelectDownBoxID(user);

                if (this.state.expandVdcListUser === user) {
                    confirmButtons.push(
                        <div id={selectDownBoxVDCID} className="selectDownBoxVDC">
                            <span id="checkboxes2">
                            {
                                buttons
                            }
                            </span>
                            <div className="confirmBoxVDC">
                                <div className="rightCancelBtn" onClick={() => this.onClickCancelUserVdcCenters(user)}>취소</div>
                                <div className="rightConfirmBtn" onClick={() => this.onClickSetUserVdcCenters(user)}>확인</div>
                            </div>
                        </div>
                    );
                }
                else {
                    confirmButtons.push(
                        <div id={selectDownBoxVDCID} className="selectDownBoxVDC" style={{ display: 'none' }}>
                            <span id="checkboxes2">
                                {
                                    buttons
                                }
                            </span>
                            <div className="confirmBoxVDC">
                                <div className="rightCancelBtn" onClick={() => this.onClickCancelUserVdcCenters(user)}>취소</div>
                                <div className="rightConfirmBtn" onClick={() => this.onClickSetUserVdcCenters(user)}>확인</div>
                            </div>
                        </div>
                    );
                }

                return (
                    <div className={dash.dropdown}>
                        <form>
                            <div className="multiselectVDC">
                                <div className="selectBoxVDC" onClick={() => this.showCheckboxesVDC(user)}>
                                    <select>
                                        <option></option>
                                    </select>
                                    <div className="overSelectVDC">{this.getVdcNames(user.dataCenters)}</div>
                                </div> 
                                {
                                    confirmButtons
                                }
                            </div>
                        </form>
                    </div>
                );
            }
            else {
                vdcList = this.getVdcNames(user.dataCenters);

                /* if (vdcList.length > 15) {

                } */

            }
        }

        return vdcList;
    }

    getVdcIDListName(user) {
        let vdcList = "";

        if (user.dataCenters) {
            vdcList = this.getVdcNames(user.dataCenters);
        }

        return vdcList;
    }

    getSelectDownBoxID(user) {
        return "VdcUserCheckBoxes_" + user.id;
    }

    getVdcNames(dataCenters) {
        let vdcList = "";

        for (const dataCenter of dataCenters) {
            if (vdcList.length === 0) {
                vdcList = ProjectResource.getDataCenterName(dataCenter);
            }
            else {
                vdcList += ", " + ProjectResource.getDataCenterName(dataCenter);
            }
        }

        return vdcList;
    }

    movePage(dir) {
        if (this.refCheckAll.current) {
            this.refCheckAll.current.checked = false;
        }

        this.setAllCheck(false);

        if (dir < 0) {
            if (this.state.pageNo > 1) {
                if (this.state.editMode) {
                    this.wantEditMode = true;
                }

                this.setState({ pageNo: this.state.pageNo - 1, editMode: false });
            }
        }
        else {
            if (this.state.pageNo < this.state.totalPage) {
                if (this.state.editMode) {
                    this.wantEditMode = true;
                }

                this.setState({ pageNo: this.state.pageNo + 1, editMode: false });
            }
        }
    }

    getPageAreaElements() {
        if (this.state.pageNo !== null && this.state.totalPage !== null) {
            const leftClassName = this.state.pageNo > 1 ? dash.leftArrowIcon + " " + dash.active : dash.leftArrowIcon;
            const rightClassName = this.state.pageNo < this.state.totalPage ? dash.rightArrowIcon + " " + dash.active : dash.rightArrowIcon;

            return (
                <div className={dash.pageAreaUser}>
                    <span className={leftClassName} onClick={() => this.movePage(-1)}></span>
                    <span className={dash.pageNumBox}>{this.state.pageNo + "/" + this.state.totalPage}</span>
                    <span className={rightClassName} onClick={() => this.movePage(1)}></span>
                </div>
            );
        }

        return <></>;
        /*<div className={dash.pageArea}>
            <span className={dash.leftArrowIcon}></span>
            <span className={dash.pageNumBox}>1/2</span>
            <span className={dash.rightArrowIcon}></span>
        </div>*/
    }

    getDataCenterListElements() {
        const elements = [];

        elements.push(
            <>
                <span>VDC</span>
                {/*<div className={dash.essentialIcon7}></div>*/}
            </>
        );

        const units = [];

        units.push(
            <div className="selectBox" onClick={() => this.showCheckboxes()}>
                <select>
                    <option>{this.getVdcNames(this.state.newUserVdcList)}</option>
                </select>
                <div className="overSelect"></div>
            </div>
        );


        const checkBoxes = [];

        const dataCenters = [...this.state.dataCenters];
        const dataCenterCount = dataCenters.length;

        for (let i = 0; i < dataCenterCount; i++) {
            const dataCenter = dataCenters[i];
            const id = "dataCenter_" + i;

            const dataContents = [];

            if (ProjectResource.getDataCenterName(dataCenter).length > 12) {
                dataContents.push(
                   <div style={{ position: 'relative' }}>
                     <div className="tooltipCenter">
                        <div className="tooltipCenterTitle">
                            {ProjectResource.getDataCenterName(dataCenter)}
                        </div>
                        <div className="tooltipCenterConts tooltip-left">
                            {ProjectResource.getDataCenterName(dataCenter)}
                        </div>
                     </div>
                  </div>
                );
            } else {
                dataContents.push(
                    <div className="tooltipCenterTitle">{ProjectResource.getDataCenterName(dataCenter)}</div>
                );
            }

            checkBoxes.push(
                <div className="checkBox1">
                    <label for={id}>
                        <input type="checkbox" id={id} data-id={dataCenter.id} />
                        {/* <p>{ProjectResource.getDataCenterName(dataCenter)}</p> */}
                        {
                            dataContents
                        }
                    </label>
                </div>
            );
        }

        if (this.state.expandVDCCheckBoxList) {
            units.push(
                <div className="selectDownBox">
                    <div ref={this.refVdcCheckBoxes} id="checkboxes">
                        {
                            checkBoxes
                        }
                    </div>
                    <div className="confirmBox">
                        <div className="rightCancelBtn" onClick={() => this.onClickCancelNewUserDataCenters()}>취소</div>
                        <div className="rightConfirmBtn" onClick={() => this.onClickSetNewUserDataCenters()}>확인</div>
                    </div>
                </div>
            );
        }
        else {
            units.push(
                <div className="selectDownBox" style={{ display: 'none' }}>
                    <div ref={this.refVdcCheckBoxes} id="checkboxes">
                        {
                            checkBoxes
                        }
                    </div>
                    <div className="confirmBox">
                        <div className="rightCancelBtn">취소</div>
                        <div className="rightConfirmBtn">확인</div>
                    </div>
                </div>
            );
        }

        elements.push(
            <form>
                <div className="multiselect">
                    {
                        units
                    }
                </div>
            </form>
        );

        elements.push(
            <div className={dash.notVDCText} style={{ display: 'none' }}>＊필수값 미입력</div>
        );

        return (
            <div className={dash.vdcIDBox}>
                {
                    elements
                }
            </div>
            );
    }

    onClickSetNewUserDataCenters() {
        const dataCenters = [];

        for (const childDiv of this.refVdcCheckBoxes.current.children) {
            for (const childLabel of childDiv.children) {
                if (childLabel.children.length > 0) {
                    const input = childLabel.children[0];

                    if (input.checked) {
                        const dataCenter = this.findDataCenteFromID(parseInt(input.dataset.id), this.state.dataCenters);

                        if (dataCenter) {
                            dataCenters.push(dataCenter);
                        }
                    }
                }
            }
        }

        this.setState({ newUserVdcList: dataCenters, expandVDCCheckBoxList: false });
    }

    findDataCenteFromID(id, dataCenters) {
        for (const dataCenter of dataCenters) {
            if (dataCenter.id === id) {
                return dataCenter;
            }
        }

        return null;
    }

    onClickCancelNewUserDataCenters() {
        this.setState({ expandVDCCheckBoxList: false });
    }

    getNewUserElements() {
        const elements = [];

        elements.push(
            <div className={dash.userFlexBox}>
                <span className={dash.userListTitle}>신규 사용자등록</span>
            </div>
        );

        const units = [];

        units.push(
            <>
                <span>고객사</span>
                {/*<div className={dash.essentialIcon1}></div>*/}
            </>
        );

        const options = [];
        const site = this.props.site;

        if (site) {
            options.push(
                <option>{ProjectResource.getSiteName(site)}</option>
            );
        }

        units.push(
            <select>
                {
                    options
                }
            </select>
        );

        elements.push(
            <div style={{ display: 'flex' }}>
                <div className={dash.clientCompany2}>
                    {
                        units
                    }
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className={dash.plusIcon}></span>
                    <span className={dash.plusText}>신규등록</span>
                </div>
            </div>
        );

        const units2 = [];

        const levels = [...this.state.levels2];
        const levelOptions = [];

        for (const level of levels) {
            levelOptions.push(
                <option value={level.id}>{ProjectResource.getAccountLevelName(level)}</option>
            );
        }

        const selectElements = [];
        const selectedNewUserLevel = this.state.selectedNewUserLevel;

        if (selectedNewUserLevel) {
            selectElements.push(
                <select ref={this.refNewUserLevel} defaultValue={selectedNewUserLevel.id} onChange={(e) => this.onSelectNewUserAccountLevel(e)}>
                    {
                        levelOptions
                    }
                </select>
            );
        }
        else {
            selectElements.push(
                <select ref={this.refNewUserLevel} onChange={(e) => this.onSelectNewUserAccountLevel(e)}>
                    {
                        levelOptions
                    }
                </select>
            );
        }

        units2.push(
            <div className={dash.registrationFlex1}>
                <div className={dash.userRightBox}>
                    <span>권한</span>
                    {/*<div className={dash.essentialIcon2}></div>*/}
                    {
                        selectElements
                    }
                    <div className={dash.notUserRightText} style={{ display: 'none' }}>＊필수값 미입력</div>
                </div>
                <div className={dash.userNameBox}>
                    <span>사용자명</span>
                    {/*<div className={dash.essentialIcon3}></div>*/}
                    <input ref={this.refUserName} type="text" autoFocus />
                    <div className={dash.notUserNameText} style={{ display: 'none' }}>＊필수값 미입력</div>
                </div>
            </div>
        );

        units2.push(
            <div className={dash.registrationFlex2}>
                <div className={dash.userIDBox}>
                    <span>사용자 ID</span>
                    {/*<div className={dash.essentialIcon4}></div>*/}
                    <input ref={this.refUserID} type="text" />
                    <div className={dash.notIDText} style={{ display: 'none' }}>＊필수값 미입력</div>
                    <div className={dash.idConfirmBtn} onClick={() => this.onClickCheckValidUserID()}>ID확인</div>
                </div>
                <div className={dash.userPasswordBox}>
                    <span>암호</span>
                    {/*<div className={dash.essentialIcon5}></div>*/}
                    <input ref={this.refPassword} type="password" placeholder="" />
                    <div className={dash.notPasswordText} style={{ display: 'none' }}>＊필수값 미입력</div>
                    <div className="tooltipArea">
                      <div className="tooltip">
                        <span className="tooltiptext tooltip-left">
                          최소길이는 9자 이상이며, 영문대소문자,숫자 특수 문자 중 3종류 이상으로 구성
                        </span>
                      </div>
                    </div>
                </div>
            </div>
        );

        units2.push(
            <div className={dash.registrationFlex3}>
                <div className={dash.affiliationBox}>
                    <span>소속</span>
                    {/*<div className={dash.essentialIcon6}></div>*/}
                    <input ref={this.refCompanyName} type="text" placeholder="" />
                    <div className={dash.notAffiliationText} style={{ display: 'none' }}>＊필수값 미입력</div>
                </div>
                {
                    this.getDataCenterListElements()
                }
                <div className={dash.userMemoBox}>
                    <span>메모</span>
                    <div className={dash.userMemoIcon} onClick={() => this.onClickShowNewUserMemo(true) }></div>
                </div>
            </div>
        );

        elements.push(
            <div className={dash.newRegistrationBox}>
                {
                    units2
                }
            </div>
        );

        elements.push(
            <>
                <div className={dash.userRightsBtn}>
                    <span className={dash.cancelBtn} onClick={() => this.onClickCancelNewUserMode()}>취소</span>
                    <span className={dash.registrationBtn} onClick={() => this.onClickRegistNewUser()}>등록</span>
                </div>
                <div className={dash.userDashedLine}></div>
            </>
        );

        return (
            <div className={dash.newUserBox}>
                {
                    elements
                }
            </div>
            );
    }

    async onClickCheckValidUserID() {
        const userID = this.refUserID.current.value ? this.refUserID.current.value.trim() : "";

        if (userID.length === 0) {
            this.props.alertMessage("먼저 사용자 ID를 입력하세요.", ProjectResource.ID.messageBox.title.warning, ConfirmDialog.icon.warning);
        }
        else {
            const [success2, errorMessage2] = this.validCheckID(userID);

            if (success2 === false) {
                this.props.alertMessage(errorMessage2);
                return;
            }

            const [success, errorMessage] = await AccountController.requestValidUserID(userID);

            if (success) {
                this.props.alertMessage("사용 가능한 ID입니다.", ProjectResource.ID.messageBox.title.info, ConfirmDialog.icon.check);
                this.setState({ userIDValidCheck: true });
            }
            else {
                this.props.alertMessage(errorMessage);
                this.setState({ userIDValidCheck: false });
            }
        }
    }

    validCheckID(id) {
        const len = id.length;

        if (len < 5 || len > 12) {
            return [false, "ID는 최소 5자에서 최대 12자까지만 허용합니다."];
        }
        else {
            const pattern = new RegExp('[a-z0-9..]*');
            const result = pattern.exec(id);

            if (result.toString() !== id) {
                return [false, "영문 소문자와 숫자, 마침표(.)만 사용 가능합니다."];
            }
            else {
                if (id.indexOf('..') >= 0) {
                    return [false, "마침표는 연속으로 두개 이상 사용할 수 없습니다."];
                }
            }
        }

        return [true, ""];
    }

    validCheckPassword(pw) {
        if (pw.length < 9) {
            return [false, "암호는 최소 9자 이상이어야 합니다."];
        }
        else {
            let low = false, high = false, num = false, special = false;

            for (let i = pw.length - 1; i >= 0; i--) {
                const ch = pw[i];

                if (ch >= 'a' && ch <= 'z') {
                    low = true;
                }
                else if (ch >= 'A' && ch <= 'Z') {
                    high = true;
                }
                else if (ch >= '0' && ch <= '9') {
                    num = true;
                }
                else if (this.isSpecialCharacter(ch)) {
                    special = true;
                }
                else {
                    return [false, "암호는 영문 대문자와 소문자, 숫자, 특수기호만 사용 가능합니다."];
                }
            }

            let typeCount = 0;

            if (low) {
                typeCount++;
            }

            if (high) {
                typeCount++;
            }

            if (num) {
                typeCount++;
            }

            if (special) {
                typeCount++;
            }

            if (typeCount < 3) {
                return [false, "암호는 영문 대문자와 소문자, 숫자, 특수기호만 사용 가능하며, 이 가운데 최소 3종류 이상을 사용하여야만 합니다."];
            }
        }

        return [true, ""];
    }

    isSpecialCharacter(ch) {
        if (ch === ',') {
            return true;
        }
        else if (ch === '.') {
            return true;
        }
        else if (ch === '/') {
            return true;
        }
        else if (ch === '<') {
            return true;
        }
        else if (ch === '>') {
            return true;
        }
        else if (ch === '?') {
            return true;
        }
        else if (ch === ':') {
            return true;
        }
        else if (ch === ';') {
            return true;
        }
        else if (ch === '"') {
            return true;
        }
        else if (ch === "'") {
            return true;
        }
        else if (ch === '`') {
            return true;
        }
        else if (ch === '~') {
            return true;
        }
        else if (ch === '!') {
            return true;
        }
        else if (ch === '@') {
            return true;
        }
        else if (ch === '#') {
            return true;
        }
        else if (ch === '$') {
            return true;
        }
        else if (ch === '%') {
            return true;
        }
        else if (ch === '^') {
            return true;
        }
        else if (ch === '&') {
            return true;
        }
        else if (ch === '*') {
            return true;
        }
        else if (ch === '(') {
            return true;
        }
        else if (ch === ')') {
            return true;
        }
        else if (ch === '-') {
            return true;
        }
        else if (ch === '_') {
            return true;
        }
        else if (ch === '+') {
            return true;
        }
        else if (ch === '=') {
            return true;
        }
        else if (ch === '\\') {
            return true;
        }
        else if (ch === '|') {
            return true;
        }

        return false;
    }

    toggleEdit() {
        if (!this.props.enableEdit) {
            return;
        }

        if (!this.state.newUserMode) {
            this.setState({ editMode: !this.state.editMode });
        }
    }

    onClickRemove() {
        if (!this.state.editMode) {
            return;
        }

        const removeIDs = [];

        for (const childTr of this.refUserList.current.children) {
            for (const childTd of childTr.children) {
                if (childTd.children.length > 0) {
                    const input = childTd.children[0];

                    if (input.checked) {
                        removeIDs.push(parseInt(childTr.dataset.id));
                    }
                }

                break;
            }
        }

        if (removeIDs.length === 0) {
            this.props.alertMessage("삭제할 대상을 선택하세요.", ProjectResource.ID.messageBox.title.info, ConfirmDialog.icon.question);
            return;
        }

        const me = ProjectResource.getUserInfo();

        if (!me) {
            return;
        }

        if (removeIDs.includes(me.id)) {
            this.props.alertMessage("자신의 계정은 삭제할 수 없습니다.", ProjectResource.ID.messageBox.title.warning, ConfirmDialog.icon.warning);
            return;
        }

        this.showConfirmDialog(ProjectResource.ID.messageBox.title.confirmCancel, "삭제하시겠습니까?", ["취소", "확인"], (index) => this.onClickRemoveUser(index, removeIDs), ConfirmDialog.icon.trash);
    }

    async onClickRemoveUser(index, removeIDs) {
        this.onCloseConfirmDialog();

        if (index === 1) {
            const [success, errorMessage] = await AccountController.requestRemoveUserList(removeIDs);

            if (success) {
                this.allCheckClear = true;

                const users = [...this.state.users];
                const userCount = users.length;

                for (let i = userCount-1; i >= 0; i--) {
                    const user = users[i];

                    if (removeIDs.includes(user.id)) {
                        users.splice(i, 1);
                    }
                }

                const [pageNo, totalPage] = this.getPageData(users);
                this.setState({ users, pageNo, totalPage });
            }
            else {
                this.props.alertMessage(errorMessage, ProjectResource.ID.messageBox.title.error);
            }
        }
    }

    onClickSave() {
        if (this.state.editMode && this.state.isChanged) {
            this.showConfirmDialog(ProjectResource.ID.messageBox.title.confirm, "저장하시겠습니까?", ["취소", "확인"], (index) => this.onClickSaveUser(index), ConfirmDialog.icon.save);
        }
    }

    onClickSaveUser(index) {
        this.onCloseConfirmDialog();

        if (index === 1) {
            this.editManager.save();
        }
    }

    onClickCancelNewUserMode() {
        this.showConfirmDialog(ProjectResource.ID.messageBox.title.confirmCancel, "취소하시겠습니까?", ["취소", "확인"], (index) => this.onClickCanelUser(index), ConfirmDialog.icon.question);
    }

    onClickCanelUser(index) {
        this.onCloseConfirmDialog();

        if (index === 1) {
            const [pageNo, totalPage] = this.getPageData(this.state.users);
            this.setState({ newUserMode: false, pageNo, totalPage });
        }
    }

    async onClickNewUserMode() {
        if (!this.props.enableEdit) {
            return;
        }

        if (this.state.newUserMode === false) {
            const site = this.props.site;

            if (!site) {
                return;
            }

            const user = ProjectResource.getUserInfo();

            if (user) {
                const [users, errorMessage] = await AccountController.requestSearchUserList(site.id, user.id, null);

                if (users) {
                    const [pageNo, totalPage] = this.getPageData(users, true);
                    this.setState({ newUserMode: true, editMode: false, searchText: null, users, pageNo, totalPage });
                }
                else {
                    this.props.alertMessage(errorMessage, ProjectResource.ID.messageBox.title.error);
                }
            }
        }
    }

    async onClickRegistNewUser() {
        const userID = this.refUserID.current.value ? this.refUserID.current.value.trim() : "";

        if (userID.length === 0) {
            this.props.alertMessage("사용자 ID를 입력하세요.", ProjectResource.ID.messageBox.title.warning, ConfirmDialog.icon.warning);
            return;
        }

        if (this.state.userIDValidCheck === false) {
            this.props.alertMessage("[ID 확인]을 실행해 주세요.", ProjectResource.ID.messageBox.title.warning, ConfirmDialog.icon.warning);
            return;
        }

        const [success, errorMessage] = this.validCheckID(userID);

        if (success === false) {
            this.props.alertMessage(errorMessage);
            return;
        }

        const companyName = this.refCompanyName.current.value ? this.refCompanyName.current.value.trim() : "";

        if (companyName.length === 0) {
            this.props.alertMessage("소속을 입력하세요.", ProjectResource.ID.messageBox.title.warning, ConfirmDialog.icon.warning);
            return;
        }

        const userName = this.refUserName.current.value ? this.refUserName.current.value.trim() : "";

        if (userName.length === 0) {
            this.props.alertMessage("사용자명을 입력하세요.", ProjectResource.ID.messageBox.title.warning, ConfirmDialog.icon.warning);
            return;
        }

        const password = this.refPassword.current.value ? this.refPassword.current.value.trim() : "";

        if (password.length === 0) {
            this.props.alertMessage("암호를 입력하세요.", ProjectResource.ID.messageBox.title.warning, ConfirmDialog.icon.warning);
            return;
        }

        const [success2, errorMessage2] = this.validCheckPassword(password);

        if (success2 === false) {
            this.props.alertMessage(errorMessage2, ProjectResource.ID.messageBox.title.warning, ConfirmDialog.icon.warning);
            return;
        }

        const dataCenters = [...this.state.newUserVdcList];

        const dataCenterIDs = [];

        for (const dataCenter of dataCenters) {
            dataCenterIDs.push(dataCenter.id);
        }

        const memo = this.state.newUserMemo;

        const site = this.props.site;

        if (site) {
            this.showConfirmDialog(ProjectResource.ID.messageBox.title.confirm, "등록하시겠습니까?", ["취소", "확인"], (index) => this.onClickRegistUser(index, site, userID, companyName, userName, password, dataCenterIDs, memo), ConfirmDialog.icon.plus);
        }
    }

    async onClickRegistUser(index, site, userID, companyName, userName, password, dataCenterIDs, memo) {
        this.onCloseConfirmDialog();

        if (index === 1) {
            const levelID = this.getNewUserLevelID();

            const [success3, errorMessage3] = await AccountController.requestNewUser(site.id, levelID, userID, companyName, userName, password, dataCenterIDs, memo);

            if (success3) {
                const user = ProjectResource.getUserInfo();

                if (user) {
                    const [users, errorMessage4] = await AccountController.requestSearchUserList(site.id, user.id, null);

                    if (users) {
                        const [pageNo, totalPage] = this.getPageData(users);
                        this.setState({ users, selectedLevel: null, searchText: null, pageNo, totalPage, memoUser: null, newUserMode: false, userIDValidCheck: false, expandVDCCheckBoxList: false, newUserVdcList: [], expandVdcListUser: null, newUserMemo: null, showNewUserMemo: false, selectedNewUserLevel: null });
                    }
                    else {
                        this.props.alertMessage(errorMessage4, ProjectResource.ID.messageBox.title.error);
                    }
                }
            }
            else {
                this.props.alertMessage(errorMessage3, ProjectResource.ID.messageBox.title.error);
            }
        }
    }

    getNewUserLevelID() {
        if (this.state.selectedNewUserLevel) {
            return this.state.selectedNewUserLevel.id;
        }

        return parseInt(this.refNewUserLevel.current.value);
    }

    getEditButtons() {
        let editClassName = this.state.editMode ? dash.removeIconAct : (this.state.newUserMode ? dash.removeIconDisabled : dash.removeIcon);
        const saveClassName = this.state.editMode && this.state.isChanged ? dash.saveDiskIconAct : dash.saveDiskIcon;
        const removeClassName = this.state.editMode ? dash.recycleBinActIcon : dash.recycleBinIcon;

        if (!this.props.enableEdit) {
            editClassName = dash.removeIconDisabled;
        }

        return (
            <div style={{ display: 'flex', alignItems: 'center', width: '400px', justifyContent: 'flex-end' }}>
                {
                    !this.state.newUserMode &&
                    <div className={dash.newBox}>
                        <span className={dash.newResiIcon} onClick={() => this.onClickNewUserMode()}></span>
                        <span className={dash.newText}>신규등록</span>
                    </div>
                }
                <span className={editClassName} onClick={() => this.toggleEdit()}></span>
                <span className={dash.removeText}>편집</span>
                <span className={saveClassName} onClick={() => this.onClickSave()}></span>
                <span className={dash.saveText}>저장</span>
                {/* <div className={dash.recycleFBox}>
                  <span className={removeClassName} onClick={() => this.onClickRemove()}></span>
                  <span className={dash.recycleBinText}>삭제</span>
                </div> */}
            </div>
            );

        /*<div style={{ display: 'flex', alignItems: 'center', width: '400px', justifyContent: 'flex-end' }}>
            <div className={dash.newBox}>
                <span className={dash.newResiIcon}></span>
                <span className={dash.newText}>신규등록</span>
            </div>
            <span className={dash.removeIcon}></span>
            <span className={dash.removeText}>편집</span>
            <span className={dash.saveDiskIcon}></span>
            <span className={dash.saveText}>저장</span>
            <span className={dash.recycleBinIcon}></span>
            <span className={dash.recycleBinText}>삭제</span>
        </div>*/
    }

    render() {
        /*if (this.state.loading) {
            return <></>
        }*/

        return (
            <>
                <div style={{ display: 'flex' }}>
                    <span className={dash.userRightTitle}>사용자 권한 관리</span>
                    <span className={dash.managementClose} onClick={() => this.props.onClose()}></span>
                </div>

                {
                    !this.state.newUserMode &&
                    <div className={dash.clientBox}>
                        <div style={{ display: 'flex', marginBottom: '26px' }}>
                            <div className={dash.clientCompany}>
                                {
                                    this.getSiteElements()
                                }
                            </div>
                            <div className={dash.rightBox}>
                                {
                                    this.getUserLevelElements()
                                }
                            </div>
                            <div className={dash.rightSearchBox}>
                                <div className={dash.rightSearchIcon}></div>
                                <input ref={this.refSearchText} type="text" onKeyUp={(e) => this.onSearch(e)} />
                                <span className={dash.searchBtn} onClick={() => this.search()}>검색</span>
                            </div>
                        </div>
                        <div className={dash.userDashedLine}></div>
                    </div>
                }

                {/* 신규 사용자 등록 */}
                {
                    this.state.newUserMode &&
                    this.getNewUserElements()
                }

                <div className={dash.userFlexBox}>
                    <span className={dash.userListTitle}>사용자목록</span>

                    {
                        this.getEditButtons()
                    }
                </div>

                <div className={dash.managementTable}>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '3%' }}>{this.getAllListCheckBox()}</th>
                                <th style={{ width: '9%' }}>고객사</th>
                                <th style={{ width: '9%' }}>권한</th>
                                <th style={{ width: '14%' }}>사용자명</th>
                                <th style={{ width: '12%' }}>사용자ID</th>
                                <th style={{ width: '14%' }}>소속</th>
                                <th style={{ width: '16%' }}>VDC명</th>
                                <th style={{ width: '9%' }}>등록일</th>
                                <th style={{ width: '5%' }}>메모</th>
                                <th style={{ width: '5%' }}>활성화</th>
                            </tr>
                        </thead>
                        <tbody ref={this.refUserList}>
                            {
                                this.getUserListElements()
                            }
                        </tbody>
                    </table>
                </div> 

                {/* 비활성화 */}
                {/* <div className={dash.managementOpacityTable}>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '5%' }}>{this.getAllListCheckBox()}</th>
                                <th style={{ width: '9%' }} className={dash.opacityTextTh}>고객사</th>
                                <th style={{ width: '9%' }} className={dash.opacityTextTh}>권한</th>
                                <th style={{ width: '14%' }} className={dash.opacityTextTh}>사용자명</th>
                                <th style={{ width: '12%' }} className={dash.opacityTextTh}>사용자ID</th>
                                <th style={{ width: '14%' }} className={dash.opacityTextTh}>소속</th>
                                <th style={{ width: '14%' }} className={dash.opacityTextTh}>VDC명</th>
                                <th style={{ width: '9%' }} className={dash.opacityTextTh}>등록일</th>
                                <th style={{ width: '7%' }} className={dash.opacityTextTh}>메모</th>
                                <th style={{ width: '7%' }} className={dash.opacityTextTh}>활성화</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><input type="checkBox" /></td>
                                <td className={dash.textHidden + " " + dash.opacityText}>LG디스플레이</td>
                                <td className={dash.textHidden + " " + dash.opacityText}>VDS관리자</td>
                                <td className={dash.textHidden + " " + dash.opacityText}>LGD</td>
                                <td className={dash.textHidden + " " + dash.opacityText}>lgd001</td>
                                <td className={dash.textHidden + " " + dash.opacityText}>LGD</td>
                                <td className={dash.opacityText} style={{ position: 'relative' }}>창원DC</td>
                                <td className={dash.opacityText}>2023.04.29</td>
                                <td><span className={dash.manageMemoIconOpacity}></span></td>
                                <td><span className={dash.checkIconOpacity}></span></td>
                            </tr>
                            <tr>
                                <td><input type="checkBox" /></td>
                                <td className={dash.textHidden + " " + dash.opacityText}>LG디스플레이</td>
                                <td className={dash.textHidden + " " + dash.opacityText}>VDS관리자</td>
                                <td className={dash.textHidden + " " + dash.opacityText}>LGD</td>
                                <td className={dash.textHidden + " " + dash.opacityText}>lgd001</td>
                                <td className={dash.textHidden + " " + dash.opacityText}>LGD</td>
                                <td className={dash.opacityText} style={{ position: 'relative' }}>창원DC</td>
                                <td className={dash.opacityText}>2023.04.29</td>
                                <td><span className={dash.manageMemoIconOpacity}></span></td>
                                <td><span className={dash.checkIconOpacity}></span></td>
                            </tr>
                            <tr>
                                <td><input type="checkBox" /></td>
                                <td className={dash.textHidden + " " + dash.opacityText}>LG디스플레이</td>
                                <td className={dash.textHidden + " " + dash.opacityText}>VDS관리자</td>
                                <td className={dash.textHidden + " " + dash.opacityText}>LGD</td>
                                <td className={dash.textHidden + " " + dash.opacityText}>lgd001</td>
                                <td className={dash.textHidden + " " + dash.opacityText}>LGD</td>
                                <td className={dash.opacityText} style={{ position: 'relative' }}>창원DC</td>
                                <td className={dash.opacityText}>2023.04.29</td>
                                <td><span className={dash.manageMemoIconOpacity}></span></td>
                                <td><span className={dash.checkIconOpacity}></span></td>
                            </tr>
                        </tbody>
                    </table>
                </div> */}

                {
                    this.getPageAreaElements()
                }


                {/* 팝업창 */}
                {
                    this.state.memoUser &&
                    this.getMemoElement(this.state.memoUser)
                }
                {
                    !this.state.memoUser && this.state.showNewUserMemo &&
                    this.getMemoElementVdc()
                }

                {/* <div className={dash.idNotRulePopBox}>
                    <span>ID형식이 올바르지 않습니다.</span>
                    <span>*특수기호,공백사용 불가.</span>
                    <div className={dash.idNotConfirm}>확인</div>
                </div> */}
                
                {/* <div className={dash.idNotPopBox}>
                    <span>이미 등록된 ID입니다.</span>
                    <div className={dash.idNotConfirm}>확인</div>
                </div> */}

                {/* <div className={dash.idPopBox}>
                   <span>사용 가능한 ID입니다.</span>
                   <div className={dash.idConfirm}>확인</div>
                </div> */}


                {/* <div className={dash.cancelEditPop}>
                    <span className={dash.cancelEditCloseIcon}></span>
                    <div className={dash.cancelFlex1}>
                        <span className={dash.fileCancelIcon}></span>
                        <span className={dash.fileText}>해당 내용을 취소하시겠습니까?</span>
                    </div>
                    <div className={dash.cancelFlex2}>
                        <span className={dash.fileCancel}>취소</span>
                        <span className={dash.fileConfirm}>확인</span>
                    </div>
                </div> */}

                {/* <div className={dash.signUpEditPop}>
                    <span className={dash.signUpEditCloseIcon}></span>
                    <div className={dash.signUpFlex1}>
                        <span className={dash.fileSignUpIcon}></span>
                        <span className={dash.fileText}>해당 계정을 등록하시겠습니까?</span>
                    </div>
                    <div className={dash.signUpFlex2}>
                        <span className={dash.fileCancel}>취소</span>
                        <span className={dash.fileConfirm}>확인</span>
                    </div>
                </div> */}

                {/* <div className={dash.deleteEditPop}>
                    <span className={dash.deleteEditCloseIcon}></span>
                    <div className={dash.deleteFlex1}>
                        <span className={dash.fileSaveIconD}></span>
                        <span className={dash.fileTextD}>해당 계정을 삭제하시겠습니까?</span>
                    </div>
                    <div className={dash.deleteFlex2}>
                        <span className={dash.fileCancelD}>취소</span>
                        <span className={dash.fileConfirmD}>확인</span>
                    </div>
                </div> */}

                {/* <div className={dash.saveEditPop}>
                    <span className={dash.saveEditCloseIcon}></span>
                    <div className={dash.saveFlex1}>
                        <span className={dash.fileSaveIcon2}></span>
                        <span className={dash.fileText}>해당 내용을 저장하시겠습니까?</span>
                    </div>
                    <div className={dash.saveFlex2}>
                        <span className={dash.fileCancel}>취소</span>
                        <span className={dash.fileConfirm}>확인</span>
                    </div>
                </div> */}

                {
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} icon={this.state.confirmMessage.icon} />
                }
            </>
        );
    }
}
export default UserRightsManagement;