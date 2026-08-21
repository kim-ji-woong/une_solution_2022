import React, { Component } from 'react';

import nipa_logo from '../../../Root/images/nipa_logo.png';

class LoginSection extends Component {
    constructor(props) {
		super(props);

		this.refID = React.createRef();
		this.refPW = React.createRef();
	}

    componentDidMount() {
        this.refID.current.focus();
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

        this.props.onClickLogin(id, pw);
    }

    render() {
        let loginError = null;

        if (this.props.loginError) {
			loginError = (
				<div className='errorMsg'>
					<p>{this.props.loginError}</p>
				</div>
			);
		}

        return (
            <section className='loginWrap'>
                <div className='mainLogo'>
                    <img src={nipa_logo} alt="메인로고" />
                </div>
                <form autoComplete='off'>
                    <div>
                        <input ref={this.refID} type='text' className='indexLoginId' id='inputId' placeholder='아이디를 입력하세요.' onKeyUp={(e) => this.onKeyPressLogin(e)} />
                    </div>
                    <div>
                        <input ref={this.refPW} type='password' className='indexLoginPw' id='inputPwd' placeholder='비밀번호를 입력하세요.' onKeyUp={(e) => this.onKeyPressLogin(e)} />
                    </div>
                    <button type='button' onClick={() => this.onClickLogin()}>로그인</button>

                    {/* 로그인 유효성 검사시 사용 */}
                    {loginError}
                </form>
            </section>
        );
    }
}

export default LoginSection;