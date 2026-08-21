import React, { Component } from 'react';
import AccountResource from '../resource/id';

class FindPwdSection extends Component {
    constructor(props) {
		super(props);

        this.state = {
		}

		this.refPwdName = React.createRef();
		this.refPhone = React.createRef();
	}

    componentDidMount() {
        this.refPwdName.current.focus();
    }

    onClickFindPwd = () => {
        const name = this.refPwdName.current.value.toString().trim();
		const phone = this.refPhone.current.value.toString().trim();

        if (name.length === 0) {
            this.refPwdName.current.classList.add('error');
        } else {
            this.refPwdName.current.classList.remove('error');
        }

        if (phone.length === 0) {
            this.refPhone.current.classList.add('error');
        } else {
            this.refPhone.current.classList.remove('error');
        }

        this.props.onClickFindPwd(name, phone)
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
                    <h2>임시 비밀번호 발급</h2>
                    <p>이름과 휴대전화번호를 입력하시면 임시 비밀번호가 발급됩니다.</p>
                </div>
                <form autoComplete='off'>
                    <div className='inputWrap'>
                        <div>
                            <label htmlFor="inputName">
                                {AccountResource.ID.textTitleName}
                            </label>
                        </div>
                        <input ref={this.refPwdName} type='text' id='inputName' placeholder={AccountResource.ID.textPlaceName} />
                    </div>
                    <div className='inputWrap'>
                        <div>
                            <label htmlFor="inputName">
                                {AccountResource.ID.textTitlePhone}
                            </label>
                        </div>
                        <input ref={this.refPhone} type='text' id='inputName' placeholder={AccountResource.ID.textPlacePhone} />
                    </div>


                    {/* 로그인 유효성 검사시 사용 */}
                    <div className='errorMsg'>
                        {errorMsg}
                    </div>
                    
                    <button type='button' className='submitBtn' onClick={() => this.onClickFindPwd()}>확인</button>
                </form>
            </div>
        );
    }
}

export default FindPwdSection;