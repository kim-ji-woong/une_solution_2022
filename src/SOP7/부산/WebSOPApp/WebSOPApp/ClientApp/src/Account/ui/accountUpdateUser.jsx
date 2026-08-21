import React, { Component } from 'react';

import { AccountUpdateUserComponent } from '../styled/accountManagerStyled';
import { ModalBackground } from '../../Root/styled/theme';

import close_btn from '../../Common/images/close_btn.png';
import tooltip_icon from '../../Settings/images/tooltip-icon.png';
import ProjectResource from '../../Root/resource/id';

class AccountUpdateUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isEditMode: false,
            tempUser: null,
            selectedUser: null,
            userMemo: '',
        }
        
    }
    
    componentDidMount() {
        this.setSelectedUser();
        this.setUserMemo();
    }
    
    setSelectedUser = () => {
        const tempUser = { ...this.props.selectedUser };
        this.setState({ selectedUser: this.props.selectedUser, tempUser });
    }
    
    setUserMemo = () => {
        const userMemos = this.props.userMemos;
        
        const selectedUser = this.props.selectedUser;
        
        if (!userMemos || !selectedUser) {
            this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["사용자 정보를 불러오는데 실패하였습니다."], ['확인'], this.props.onCloseConfirmDialog);
            return;
        }
        
        for (let i = 0; i < userMemos.length; i++) {
            const userMemo = userMemos[i];
            
            if (userMemo.userID === selectedUser.accountID) {
                this.setState({ userMemo: userMemo.memo });
                break;
            }
        }
    }

    onEditMode = (isOn) => {
        if(isOn) {
            this.setState({ isEditMode: isOn });
        } else {
            this.props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['취소하시겠습니까?', '편집중이 내용이 있습니다.'], ['확인'], this.onClickCancel);
        }
    }
    
    onClickCancel = (index) => {
        if (index === 0) {
            this.props.onCloseConfirmDialog();
            this.setState({ isEditMode: false, selectedUser: this.props.selectedUser, tempUser: this.props.selectedUser });
        }
    }

    onDeleteUser = () => {
        this.props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['삭제하시겠습니까?', '단, 조직정보는 삭제되지 않습니다.'], ['확인'], this.onClickDeleteUser);
    }
    
    onClickDeleteUser = () => {
        this.props.deleteUser(this.state.selectedUser);
        this.props.handlePopup(false);
        this.props.onCloseConfirmDialog();
    }
    
    onClickSave = () => {
        this.props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['저장하시겠습니까?', '저장하면 변경된 내용이 적용됩니다.'], ['확인'], this.props.saveUserInfo(this.state.tempUser, this.state.userMemo));
        this.props.onCloseConfirmDialog();
        this.setState({ isEditMode: false });
    }

    getAuthorSelectUI = () => {
        const { accountLevels } = this.props;
        const { tempUser } = this.state;

        if (!accountLevels || accountLevels.length === 0 || !tempUser) {
            return (
                <select defaultValue="null">
                    <option value="null">NULL</option>
                </select>
            );
        }

        return (
            <select defaultValue={tempUser?.accountLevel.id} onChange={this.handleAuthorChange}>
                {accountLevels.map(accountLevel => (
                    <option key={accountLevel.id} value={accountLevel.id}>
                        {accountLevel.levelName}
                    </option>
                ))}
            </select>
        );
    }
    
    handleAuthorChange = (e) => {
        const accountLevels = this.props.accountLevels;
        const accountLevelID = e.target.value;
        
        for (let i = 0; i < accountLevels.length; i++) {
            const accountLevel = accountLevels[i];
            
            if (accountLevel.id === parseInt(accountLevelID)) {
                const tempUser = { ...this.state.tempUser };
                tempUser.accountLevel = accountLevel;
                
                this.setState({ tempUser });
                break;
            }
        }
    }
    
    onChangeMemo = (e) => {
        this.setState({ userMemo: e.target.value });
    }

    render() {
        
        const authorSelectUI = this.getAuthorSelectUI();
        
        return (
            <ModalBackground>
            <AccountUpdateUserComponent>
                <header>
                    <h2>사용자 정보</h2>
                    <button onClick={() => this.props.handlePopup(false)} className={'closeBtn'}>
                        <img src={close_btn} alt='닫기 버튼' width={16} height={16} />
                    </button>
                </header>
                <section>
                    <div>
                        <button 
                            className={this.state.isEditMode ? 'on' : 'off'}
                            onClick={() => this.onEditMode(true)}
                        >
                            편집
                        </button>
                        <button
                            onClick={() => this.onDeleteUser()}
                        >
                            삭제
                        </button>
                    </div>
                    <ul>
                        <li>
                            <div>소속 조직<span>*</span></div>
                            <div>
                                <p>{this.state.tempUser?.regular.teamName}</p> 
                            </div>
                        </li>
                        <li>
                            <div>이름<span>*</span></div>
                            <div>
                                <p>{this.state.tempUser?.nickName}</p>
                            </div>
                        </li>
                        <li>
                            <div>직위<span>*</span></div>
                            <div>
                                <p>{this.state.tempUser?.jobLevel?.name}</p>
                            </div>
                        </li>
                        <li>
                            <div>사용자ID<span>*</span></div>
                            <div>
                                <p>{this.state.tempUser?.userID}</p>
                                <div id='tooltip' data-tooltip="5~10자의 영문소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다.">
                                    <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                                </div>
                            </div>
                        </li>
                        <li>
                            <div>권한<span>*</span></div>
                            <div>
                                {
                                    this.state.isEditMode ?
                                        <>
                                            {authorSelectUI}
                                        </>
                                        : <p>{this.state.tempUser?.accountLevel.levelName}</p>
                                }
                            </div>
                        </li>
                        <li>
                            <div>메모</div>
                            <div>
                                {
                                    this.state.isEditMode ?
                                        <textarea className='edit' onChange={(e) => this.onChangeMemo(e)}/>
                                        : <textarea value={this.state.userMemo} disabled />
                                }
                            </div>
                        </li>
                    </ul>
                </section>
                {
                    this.state.isEditMode &&
                        <div className='btnWrap'>
                            <button className='cancle' onClick={() => this.onEditMode(false)}>취소</button>
                            <button className='submit' onClick={() => this.onClickSave()}>저장</button>
                        </div>
                }
            </AccountUpdateUserComponent>
            </ModalBackground>
    );
    }
}

export default AccountUpdateUser;