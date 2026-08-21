import React, { Component } from 'react';
import AccountResource from '../resource/id';

import pwd_hide from '../images/pwd_hide.png';
import pwd_show from '../images/pwd_show.png';

class LoginSection extends Component {
    constructor(props) {
		super(props);

        this.state = {
			isShowPwd: false,
            
            isSavedID: false,
            savedID: null,
		}

		this.refID = React.createRef();
		this.refPW = React.createRef();
        
        this.isMount = true;
	}

    componentDidMount() {
        this.refID.current.focus();
        
        this.init();
    }

    componentDidUpdate() {
        if (this.props.errorMsg === AccountResource.ID.textLoginError) {
            this.refID.current.classList.add('error');
            this.refPW.current.classList.add('error');
        }
    }
    
    componentWillUnmount() {
        this.isMount = false;
    }

    _setState = (state, callback) => {
        if (this.isMount) {
            this.setState(state, callback);
        }
    }


    init = () => {
        // 로그인 정보가 저장되어 있는지 확인
        const savedID = localStorage.getItem('id') !== null ? localStorage.getItem('id') : null;
        const isSavedID = (savedID !== null && savedID.length > 0);

        this._setState({ isSavedID, savedID });
    }

    onKeyPressLogin = (e) => {
		if (e.key === 'Enter') {
			this.onClickLogin();
		}

		return;
	}

    onClickLogin = () => {
        const id = this.refID.current.value.toString().trim();
        const pw = this.refPW.current.value.toString().trim();

        if (id.length === 0) {
            this.refID.current.classList.add('error');
        } else {
            this.refID.current.classList.remove('error');
        }

        if (pw.length === 0) {
            this.refPW.current.classList.add('error');
        } else {
            this.refPW.current.classList.remove('error');
        }

        this.props.onClickLogin(id, pw, this.state.isSavedID);
    }

    handleShowPwChecked = () => {
        const password = this.refPW.current;
        if (password === null)
            return;

        if(!this.state.isShowPwd) {
            password.type = 'text';
        } else {
            password.type = 'password';
        }

        this.setState({ isShowPwd: !this.state.isShowPwd });
    }
    
    onChangeSaveID = (target) => {
        this.setState({ isSavedID: target.checked })
    }
    
    render() {
        let errorMsg = null;

        if (this.props.errorMsg) {
			errorMsg = (
				<p>{this.props.errorMsg}</p>
			);
		}

        return (
            <div className='sectionWrap'>
                <div className='titleWrap'>
                    <h2>로그인</h2>
                    <p>아이디와 비밀번호를 입력해주세요.</p>
                </div>
                <form autoComplete='off'>
                    <div className='inputWrap'>
                        <div>
                            <label htmlFor="inputId">
                                {AccountResource.ID.textTitleID}<span>*</span>
                            </label>
                            <label htmlFor='saveId'>
                                <input type='checkbox' id='saveId' checked={this.state.isSavedID} onChange={(e) => this.onChangeSaveID(e.target)}/>
                                {AccountResource.ID.textIDsave}
                            </label>
                        </div>
                        <input ref={this.refID} type='text' id='inputId' defaultValue={this.state.savedID ? this.state.savedID : ''} placeholder={AccountResource.ID.textIDInput} onKeyUp={(e) => this.onKeyPressLogin(e)} />
                    </div>
                    <div className='inputWrap'>
                        <div>
                            <label htmlFor="inputPwd">
                                {AccountResource.ID.textTitlePwd}<span>*</span>
                            </label>
                        </div>
                        <input ref={this.refPW} type='password' id='inputPwd' placeholder={AccountResource.ID.textPwdInput} onKeyUp={(e) => this.onKeyPressLogin(e)} />
                        <button 
                            type='button'
                            className='showPwdBtn' 
                            onClick={() => this.handleShowPwChecked()}
                        >
                            <img src={this.state.isShowPwd ? pwd_show : pwd_hide} alt='비밀번호 보기 버튼' />
                        </button>
                    </div>

                    {/* 로그인 유효성 검사시 사용 */}
                    <div className='errorMsg'>
                        {errorMsg}
                    </div>
                    
                    <button type='button' className='submitBtn' onClick={() => this.onClickLogin()}>로그인</button>
                </form>
            </div>
        );
    }
}

export default LoginSection;