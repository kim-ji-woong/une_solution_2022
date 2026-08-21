import React, { Component } from 'react';

import { AccountUpdateUserComponent } from '../styled/accountManagerStyled';
import { ModalBackground } from '../../Root/styled/theme';

import close_btn from '../../Common/images/close_btn.png';
import tooltip_icon from '../../Settings/images/tooltip-icon.png';
import ProjectResource from '../../Root/resource/id';
import {AccountController} from "../services/accountController";

class AccountUpdateUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isEditMode: false,
            tempUser: this.props.selectedUser,
            selectedUser: null,
            accountLevels: null,
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
    
    onEditMode = (isOn) => {
        if(isOn) {
            this.setState({ isEditMode: isOn });
        } else {
            this.props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['취소하시겠습니까?', '편집중이 내용이 있습니다.'], ['확인'], this.test);
        }
    }

    onDeleteUser = () => {
        this.props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['삭제하시겠습니까?', '단, 조직정보는 삭제되지 않습니다.'], ['확인'], this.test);
    }
    
    resetTempUser = () => {
        this.setState({ tempUser: this.props.selectedUser });
    }
    
    test = () => {
        this.props.onCloseConfirmDialog();
        this.resetTempUser();
        this.setState({ isEditMode: false });
    }
    
    onClickSave = () => {
        this.props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['저장하시겠습니까?', '저장하면 변경된 내용이 적용됩니다.'], ['확인'], this.test);
        this.props.saveUserInfo(this.state.tempUser);
        this.setState({ isEditMode: false });
    }

    getAuthorSelectUI = () => {
        
        const accountLevels = this.state.accountLevels;
        
        if (!accountLevels || accountLevels.length === 0 || !this.state.tempUser) {
            return (
                <select defaultValue="null">
                    <option value={"null"}>NULL</option>
                </select>
            );
        }
        
        let options = [];
        
        for (let i = 0; i < accountLevels.length; i++) {
            const accountLevel = accountLevels[i];
            
            let option = (
                <option key={accountLevel.id} value={accountLevel.id}>{accountLevel.levelName}</option>
            );
            
            options.push(option);
        }
        
        return (
            <select defaultValue={this.state.tempUser?.accountLevel.id} onChange={(e) => this.handleAuthorChange(e)}>
                {options}
            </select>
        );
    }
    
    handleAuthorChange = (e) => {
        const accountLevels = this.state.accountLevels;
        const accountLevelID = e.target.value;
        
        for (let i = 0; i < accountLevels.length; i++) {
            const accountLevel = accountLevels[i];
            
            if (accountLevel.id === accountLevelID) {
                const tempUser = this.state.tempUser;
                tempUser.accountLevel = accountLevel;
                
                this.setState({ tempUser });
                break;
            }
        }
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
                                        <textarea className='edit' />
                                        : <textarea value='메모입니다' disabled />
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