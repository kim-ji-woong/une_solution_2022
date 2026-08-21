import React, { Component } from 'react';

class FindPwdSection extends Component {
    constructor(props) {
		super(props);

		this.refPwdID = React.createRef();
		this.refPhone = React.createRef();
	}

    componentDidUpdate() {
        console.log('update');
    }

    onClickFindPwd = () => {
        const name = this.refPwdID.current.value.toString().trim();
		const phone = this.refPhone.current.value.toString().trim();

        this.props.onClickFindPwd(name, phone)
    }

    render() {
        let message = null;

		if (this.props.pwdError) {
			message = (
				<div className='errorMsg'>
                    <p>{this.props.pwdError}</p>
                </div>
			);
		}

		if (this.props.pwdSuccess) {
			message = (
				<div className='confirmMsg'>
                    <p>{this.props.pwdSuccess}</p>
                </div>
			);
		}

        return (
            <section className='findPwdWrap'>
                <h1>비밀번호 찾기</h1>
                <p>비밀번호 찾을 계정 정보를 입력해주세요.</p>

                <form autoComplete='off'>
                    <div>
                        <input ref={this.refPwdID} type='text' id='inputId' placeholder='이름을 입력하세요.' />
                    </div>
                    <div>
                        <input ref={this.refPhone} type='text' id='inputPwd' placeholder='핸드폰 번호를 입력하세요.' />
                    </div>
                    <button type='button' onClick={() => this.onClickFindPwd()}>확인</button>

                    {/* 비밀번호 찾기 유효성 검사시 사용 */}
                    {message}
                </form>
            </section>
        );
    }
}

export default FindPwdSection;
