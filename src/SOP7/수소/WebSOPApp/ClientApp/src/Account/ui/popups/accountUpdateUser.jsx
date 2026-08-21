import React, { Component } from 'react';
import ProjectResource from '../../../Root/resource/id';
import { AccountUpdateUserComponent } from '../../../Account/styled/accountPopupsStyled';
import { ModalBackground } from '../../../Root/styled/theme';
import close_btn from '../../../Common/img/imghydrogen/main/close_icon.svg';
//import ConfirmDialog from '../../../Common/ui/confirmDialog';
import ConfirmDialog from '../../../Common/ui/confirmHydrogen';

import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';
import { AccountController } from '../../services/accountController';

import AccountResource from '../../resource/id';

class AccountUpdateUser extends Component {

    constructor(props) {
		super(props);

		this.state = {
            isEditMode: false,
            setIsEditMode: null,
            isUpdated: false,
            errorMsg: null,
            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: [i18n.t('common.확인')],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null
            },
		}

        this.refOption = React.createRef();

        this.props = props;
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

    onEditMode = (isOn) => {
        if (isOn) {
            const user = this.props.userInformation;
            const userAuthor = ProjectResource.getUserAuthor();

            if (user?.accountLevel?.id === AccountResource.accountLevelID.master ||
                (user?.accountLevel?.id === AccountResource.accountLevelID.admin && userAuthor !== AccountResource.accountLevelID.master)) {
                this.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, [i18n.t('account.편집 권한이 없습니다'), ''], null, null);
                return;
            }

            this.setState({ isEditMode : isOn });
            
            const editModeBtn = document.getElementById('editModeBtn');

            if(isOn === true){
                editModeBtn.classList.add('on');
            }else{
                editModeBtn.classList.remove('on');
            }

        } else {
            return;
        }
    }

    onConfirmCancel = (index) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        if (index === 0) {
            // 닫기
        }
        else if (index === 1) {
            // 취소
            this.state.isEditMode = false;

            const editModeBtn = document.getElementById('editModeBtn');
            if (editModeBtn)
                editModeBtn.classList.remove('on');
        }

        this.setState({ confirmMessage });
    }

    onDeleteUser = () => {
        const user = this.props.userInformation;
        const userAuthor = ProjectResource.getUserAuthor();

        if (user?.accountLevel?.id === AccountResource.accountLevelID.master ||
            (user?.accountLevel?.id === AccountResource.accountLevelID.admin && userAuthor !== AccountResource.accountLevelID.master)) {
            this.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, [i18n.t('account.편집 권한이 없습니다'), ''], null, null);
            return;
        }

        const deleteBtn = document.getElementById('deleteBtn');
        if(deleteBtn)
            deleteBtn.classList.add('on');

        this.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, [i18n.t('account.삭제하시겠습니까'), ''], [i18n.t('common.닫기'), i18n.t('common.삭제')], this.onConfirmDelete);
    }

    onSaveUser = () => {
        this.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, [i18n.t('account.저장하시겠습니까'), ''], [i18n.t('common.닫기'), i18n.t('common.저장')], this.onConfirmSave);
    }

    onCancel = () => {
        if (this.state.isUpdated)
            this.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, [i18n.t('account.취소하시겠습니까'), ''], [i18n.t('common.닫기'), i18n.t('common.취소')], this.onConfirmCancel);
        else
            this.onConfirmCancel(1);
    }

    onConfirmDelete = async (index) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        const user = this.props.userInformation;

        const deleteBtn = document.getElementById('deleteBtn');
        if(deleteBtn)
            deleteBtn.classList.remove('on');

        if (index === 0) {
            // 닫기
        }
        else if (index === 1) {
            // 삭제
            const accountUsers = [];
            accountUsers.push(user);
    
            const [result, message] = await AccountController.removeAccountUsers(accountUsers);
            if (result === null) {
                // 실패
                this.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, [i18n.t('account.삭제 실패하였습니다'), ''], null, null);
                return;
            }
            else {
                // 성공               
                this.props.removeUser(user.id);
                return;
            }            
        }        
        
        this.setState({ confirmMessage });
    }

    onConfirmSave = async (index) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        if (index === 0) {
            // 취소
        }
        else if (index === 1) {
            // 저장
            const user = this.props.userInformation;
            const option =  this.refOption.current.value.toString();
            let selectLevel = null;

            for (let i = 0; i < this.props.levels.length; i++) {
                const level = this.props.levels[i];

                if (level.value.toString() === option) {
                    selectLevel = level;
                    break;
                }
            }

            if (selectLevel !== null && user.accountLevel?.id !== selectLevel.value) {
                // .TODO: DB 업데이트 필요 (Memo 추가)            
                const [result, message] = await AccountController.requestUpdateUserInfo(user.accountID, selectLevel.value, null);
                if (result) {
                    // UI 업데이트
                    user.accountLevel.id = selectLevel.value;
                    user.accountLevel.levelName = selectLevel.name;
                }
                else {
                    this.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, [i18n.t('account.업데이트 실패하였습니다'), ''], null, null);
                    return;
                }                           
            }

            const editModeBtn = document.getElementById('editModeBtn');
            if (editModeBtn)
                editModeBtn.classList.remove('on');

            this.state.isEditMode = false;
        }

        this.setState({ confirmMessage });
    }

    getErrorMsgUI = () => {
        let errorMsgUI = null;

        if (this.state.errorMsg) {
            errorMsgUI = (
                <p>{this.state.errorMsg}</p>
            );
        }

        return errorMsgUI;
    }

    onClickCloseUserInfo = (id) => {
        this.props.onClickCloseUserInfo(id);
    }

    onChangeUserInfo = () => {
        if (!this.state.isUpdated) {
            this.setState({ isUpdated: true });
        }
    }

    getLevelUI = () => {
        let levelUI = null;
        const opions = [];
        const user = this.props.userInformation;

        if (this.state.isEditMode) {
            if (this.props.levels.length > 0) {
                for (let i = 0; i < this.props.levels.length; i++) {
                    const level = this.props.levels[i];
                    const userAuthor = ProjectResource.getUserAuthor();

                    // 총괄 관리자 부여하지 못함
                    // 관리자는 총괄 관리자만 부여 가능
                    if (level.value === AccountResource.accountLevelID.master ||
                        (level.value === AccountResource.accountLevelID.admin && userAuthor !== AccountResource.accountLevelID.master))
                        continue;

                    opions.push(<option value={level.value}>{i18nUtil.convertText(level.name)}</option>);
                }

                levelUI = (
                    <select ref={this.refOption} className='error' defaultValue={user?.accountLevel?.id} onChange={() => this.onChangeUserInfo()}>
                        {opions}
                    </select>  
                );
            }
        }
        else {
            let level = "-";
            level = i18nUtil.convertText(user?.accountLevel?.levelName);

            levelUI = (<p>{level}</p>);
        }
        
        return levelUI;
    }
    
    render(){
        let jobPosition = "-";
        let level = "-";

        const user = this.props.userInformation;
        
        if (user) {
            jobPosition = i18nUtil.convertText(user.jobPosition?.name);
            level = i18nUtil.convertText(user.accountLevel?.levelName);
        }

        const levelUI = this.getLevelUI();
        
        return(
            <ModalBackground>
                <AccountUpdateUserComponent>
                    <header>
                        <h2>{i18n.t('account.사용자 정보')}</h2>
                        <button onClick={() => this.onClickCloseUserInfo(user.id)} className={'closeBtn'}>
                            <img src={close_btn} alt='닫기 버튼' width={24} height={24} />
                        </button>
                    </header>
                    <section>
                        <div>
                            <button 
                                id={'editModeBtn'}
                                className={'editModeBtn'} 
                                onClick={() => this.onEditMode(true)}
                            >
                                {i18n.t('common.편집')}
                            </button>
                            <button
                                id={'deleteBtn'}
                                className={'deleteBtn'} 
                                onClick={() => this.onDeleteUser()}
                            >
                                {i18n.t('common.삭제')}
                            </button>
                        </div>
                        <ul>
                            <li>
                                <div>{i18n.t('account.소속 조직')}</div>
                                <div>
                                    <p>{user?.regular?.teamName}</p> 
                                </div>
                            </li>
                            <li>
                                <div>{i18n.t('account.이름')}</div>
                                <div>
                                    <p>{user?.nickName}</p>
                                </div>
                            </li>
                            <li>
                                <div>{i18n.t('account.직위')}</div>
                                <div>
                                    <p>{jobPosition}</p>
                                </div>
                            </li>
                            <li>
                                <div>{i18n.t('account.ID')}</div>
                                <div>
                                    <p>{user?.userID}</p>
                                </div>
                            </li>
                            <li>
                                <div>{i18n.t('account.권한')}</div>
                                <div>
                                    { levelUI }
                                </div>
                            </li>
                            {/* 고도화 내용으로 주석처리
                            <li>
                                <div>Memo (Select)</div>
                                <div>
                                    {
                                        this.state.isEditMode ?
                                            <textarea className='edit' />
                                            : <textarea value='-' disabled />
                                        
                                    }
                                </div>
                            </li>
                            */}
                        </ul>
                    </section>
                    {
                        this.state.isEditMode && 
                        <div className='btnWrap'>
                            <button className='cancle' onClick={() => this.onCancel()}>{i18n.t('common.취소')}</button>
                            <button 
                                className={this.state.isUpdated ? 'submit' : 'submit disabled'} 
                                onClick={() => this.state.isUpdated && this.onSaveUser()}
                            >
                                {i18n.t('common.저장')}
                            </button>
                        </div>
                    }
                </AccountUpdateUserComponent>
                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
                }
            </ModalBackground>
        );
    }
}

export default AccountUpdateUser;