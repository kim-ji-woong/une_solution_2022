import React, { Component } from 'react';
import AccountResource from '../resource/id';

import pwd_hide from '../images/pwd_hide.svg';
import pwd_show from '../images/pwd_show.svg';
import input_x from '../images/input_x.svg';

class LoginSection extends Component {
    constructor(props) {
		super(props);

        this.state = {
			isShowPwd: false,
            
            isSavedID: false,
            savedID: null,

			idValue: '',
            pwdValue: ''
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
        if (this.props.errorMsg) {
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
        else if (e.keyCode === 9) {
			e.preventDefault();
			this.refPW.current.focus();
		}

		return;
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

    handleIDChange = (event) => {
        this.setState({ idValue: event.target.value });
    }

    handlePWChange = (event) => {
        this.setState({ pwdValue: event.target.value });
    }

    clearInputText = (type) => {
		if (type === 'id') {
			const id = this.refID.current;
			if (id) {
                id.value = '';
				id.focus();
				this.setState({ idValue: '' });
            }
		}
		else if (type === 'pwd') {
			const pw = this.refPW.current;
			if (pw) {
                pw.value = '';
				this.refPW.current.type = 'password';
				pw.focus();
				this.setState({ pwdValue: '', isShowPwd: false });
            }
		}
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
        const { isShowPwd, idValue, pwdValue } = this.state;

        let errorMsgUI = null;

		if (this.props.errorMsg) {
			errorMsgUI = (
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
                                {AccountResource.ID.textTitleID}
                            </label>
                            <label htmlFor='saveId'>
                                <input type='checkbox' id='saveId' checked={this.state.isSavedID} onChange={(e) => this.onChangeSaveID(e.target)}/>
                                {AccountResource.ID.textIDsave}
                            </label>
                        </div>
                        <div className='inputWrap id'>
							<input ref={this.refID} type='text' id='inputId' placeholder={AccountResource.ID.textIDInput} onKeyDown={(e) => this.onKeyPressLogin(e)} value={idValue} onChange={this.handleIDChange} />
							<button
								type='button'
								onClick={() => this.clearInputText('id')}
								style={{ display: idValue.length > 0 ? 'inline-block' : 'none' }}
							>
								<img className='clearBtn'src={input_x} alt='삭제 버튼' />
							</button>
						</div>
                    </div>
                    <div className='inputWrap'>
                        <div>
                            <label htmlFor="inputPwd">
                                {AccountResource.ID.textTitlePwd}
                            </label>
                        </div>
                        <div className='inputWrap pwd'>
							<input ref={this.refPW} type='password' id='inputPwd' placeholder={AccountResource.ID.textPwdInput} onKeyDown={(e) => this.onKeyPressLogin(e)} value={pwdValue} onChange={this.handlePWChange} />
							<button 
								type='button'
								style={{ display: pwdValue.length > 0 ? 'inline-block' : 'none' }}
								onClick={() => this.handleShowPwChecked()}
							>
								<img className='showPwdBtn' src={isShowPwd ? pwd_show : pwd_hide} alt='비밀번호 보기 버튼' /> 
							</button>
							<button
								type='button'
								style={{ display: pwdValue.length > 0 ? 'inline-block' : 'none' }}
								onClick={() => this.clearInputText('pwd')}
							>
								<img className='clearBtn'src={input_x} alt='삭제 버튼' />
							</button>
						</div>
                    </div>

                    {/* 로그인 유효성 검사시 사용 */}
                    <div className='errorMsg'>
                        {errorMsgUI}
                    </div>
                    
                    <button type='button' className='submitBtn' onClick={() => this.onClickLogin()}>로그인</button>
                </form>
            </div>
        );
    }
}

export default LoginSection;