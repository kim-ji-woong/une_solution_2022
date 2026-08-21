import React, { Component } from 'react';
import { AccountAddUserComponent } from '../../../Account/styled/accountPopupsStyled'; 
import AccountFindMember from '../../../Account/ui/popups/accountFindMember';

import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';
import ConfirmDialog from '../../../Common/ui/confirmHydrogen';
import ProjectResource from '../../../Root/resource/id';
import { AccountController } from '../../services/accountController';

import AccountResource from '../../resource/id';

class AccountAddUser extends Component {

    constructor(props) {
		super(props);

		this.state = {
            showFindMemberPopup: false,
            user: null,

            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: [i18n.t('common.확인')],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null
            },
		}

        this.props = props;

        this.refID = React.createRef();
        this.refOption = React.createRef();
    }

    openGroupInfo = () => {
        this.setState({ showFindMemberPopup: true });
    }

    onClickCloseFindMember = () => {
        this.setState({ showFindMemberPopup: false });
    }

    showConfirmDialog = (title, messages, buttons, onClickButton, onClose) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.title = title;
        confirmMessage.buttons = buttons;
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

    onCloseConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        this.setState({ confirmMessage });
    }

    getTableUI = () => {
        let tableUI = null;
        let btnUI = null;
        const user = this.state.user;
       
        if (user === null) {
            tableUI = (
                <div>
                    <button
                        onClick={this.openGroupInfo}
                    >
                        {i18n.t('account.조직정보 불러오기')}
                    </button>
                </div>);
        }
        else {
            const userAuthor = ProjectResource.getUserAuthor();

            let jobPosition = i18nUtil.convertText(user.jobPosition?.name);

            const opions = [];
            if (this.props.levels.length > 0) {
                for (let i = 0; i < this.props.levels.length; i++) {
                    const level = this.props.levels[i];

                    // 총괄 관리자 부여하지 못함
                    // 관리자는 총괄 관리자만 부여 가능
                    if (level.value === AccountResource.accountLevelID.master ||
                        (level.value === AccountResource.accountLevelID.admin && userAuthor !== AccountResource.accountLevelID.master))
                        continue;

                    opions.push(<option value={level.value}>{i18nUtil.convertText(level.name)}</option>);
                }
            }

            tableUI = (
                <ul>
                    <li>
                        <div>{user.regular?.teamName}</div>
                        <div>{user.memberName}</div>
                        <div>{jobPosition}</div>
                        <div>
                            <input ref={this.refID} type="text" />
                        </div>
                        <div>
                            <select ref={this.refOption} className={'authoritySelect'}>
                                    {opions}
                            </select>
                        </div>
                    </li>
                </ul>);

            btnUI = (
                <div className='btnWrap'>
                    <button className='cancle' onClick={this.onClickCancel}>{i18n.t('common.취소')}</button>
                    <button className='submit' onClick={this.onClickSave}>{i18n.t('common.저장')}</button>
                </div>);
        }

        return [tableUI, btnUI];
    }

    onClickCancel = () => {
        this.setState({ user: null });
    }

    onClickSave = async () => {
        const refID = this.refID.current.value.toString();
        const refOption = this.refOption.current.value.toString();
        const levelID = Number(refOption);

        let eventTextCheck = /^[a-z0-9_-]{5,10}$/;

        if (refID === "" || levelID === NaN || levelID === -1) {
            this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [i18n.t('account.필수 항목이 작성되지 않았습니다'), ''], [i18n.t('common.확인')], () => {
                this.onCloseConfirmDialog();
            });
            return;
        } else if (!eventTextCheck.test(refID)) {
            this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [i18n.t('account.사용자 ID는 5~10자의 영문소문자,숫자와 특수기호(_),(-)만 사용 가능'), ''], [i18n.t('common.확인')], () => {
                this.onCloseConfirmDialog();
            });
            return;
        }

        // 중복검사        
        const [result2, isDouble, message2] = await AccountController.requestDoubleCheckID(refID);
        if (result2 && isDouble) {
            // 중복
            this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [i18n.t('account.이미 존재하는 ID 입니다'), ''], null, null);
            return;
        }
        else if (!result2) {
            // 실패
            this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message2, ''], null, null);
            return;
        }

        // DB 계정 생성
        const user = this.state.user;
        const [result, accountID, message] = await AccountController.requestAddAccount(user.id, levelID, refID, user.memberName);
        if (result) {
            // 계정 만들기 성공
            this.showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, [i18n.t('account.신규등록 되었습니다'), ''], [i18n.t('common.확인')], () => {
                this.state.user = null;
                this.onCloseConfirmDialog();
            });

            user.accountID = accountID;
            user.userID = refID;

            for (let i = 0; i < this.props.levels.length; i++) {
                const level = this.props.levels[i];

                if (level.value === levelID) {
                    user.accountLevel = {};
                    user.accountLevel.id = level.value;
                    user.accountLevel.levelName = level.name;
                    break;
                }
            }
        }
        else {
            // 실패
            this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message, ''], null, null);
        }
    }

    selectUser = (user) => {
        this.setState({ showFindMemberPopup: false, user: user });
    }

    render(){
        const [tableUI, btnUI] = this.getTableUI();

        return(
            <>
            <AccountAddUserComponent>
                <div className='infoWrap'>
                    <p>{i18n.t('account.신규 등록 시 유의사항')}</p>
                    <p>{i18n.t('account.필수항목 미 작성 또는 ID가 중복될 경우 계정 및 권한이 등록되지 않음')}</p>
                    <p>{i18n.t('account.사용자 ID는 5~10자의 영문소문자,숫자와 특수기호(_),(-)만 사용 가능')}</p>
                </div>

                <div className='listWrap'>
                    <ul className='accountList'>
                        <li className='head'>
                            <div>{i18n.t('account.소속 조직')}</div>
                            <div>{i18n.t('account.이름')}</div>
                            <div>{i18n.t('account.직위')}</div>
                            <div className='required'>{i18n.t('account.사용자ID')}</div>
                            <div className='required'>{i18n.t('account.권한')}</div>
                        </li>
                        <li className='body'>
                                {tableUI}
                        </li>
                    </ul>
                </div>
                {btnUI}
                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
                }
            </AccountAddUserComponent>
            {
                this.state.showFindMemberPopup &&
                    <AccountFindMember
                        onClickCloseFindMember={this.onClickCloseFindMember}
                        accountUsers={this.props.accountUsers}
                        selectUser={this.selectUser}
                    />
            }
            </>
        );
    }
}

export default AccountAddUser;