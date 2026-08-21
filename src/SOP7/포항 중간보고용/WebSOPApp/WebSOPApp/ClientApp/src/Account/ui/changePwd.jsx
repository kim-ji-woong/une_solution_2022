import React, { Component } from 'react';
import { ChangePwdComponent  } from '../styled/myPageStyled';
import { ModalBackground } from '../../Root/styled/theme';
import close_btn from '../../Common/images/close_btn.png';

import pwd_hide from '../images/pwd_hide.svg';
import pwd_show from '../images/pwd_show.svg';

class changePwd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowCurrentPwd: false,
            isShowNewPwd1: false,
            isShowNewPwd2: false,
        }

        this.refCurrentPW = React.createRef();
        this.refNewPW1 = React.createRef();
        this.refNewPW2 = React.createRef();
    }

    handleShowPwChecked = (refType, stateType) => {
        const password = refType.current;
        if (password === null)
            return;

        if (stateType === 'isShowCurrentPwd') {
            if(!this.state.isShowCurrentPwd) {
                password.type = 'text';
            } else {
                password.type = 'password';
            }
            this.setState({ isShowCurrentPwd: !this.state.isShowCurrentPwd });
        }
        else if (stateType === 'isShowNewPwd1') {
            if(!this.state.isShowNewPwd1) {
                password.type = 'text';
            } else {
                password.type = 'password';
            }
            this.setState({ isShowNewPwd1: !this.state.isShowNewPwd1 });
        }
        else if (stateType === 'isShowNewPwd2') {
            if(!this.state.isShowNewPwd2) {
                password.type = 'text';
            } else {
                password.type = 'password';
            }
            this.setState({ isShowNewPwd2: !this.state.isShowNewPwd2 });
        }
    }

    render() {
        return (
            <ModalBackground>
            <ChangePwdComponent>
                <header>
                    <div>
                        <h2>비밀번호 변경</h2>
                        <div>
                            <span>새 비밀번호</span>
                            <span>를 설정하세요</span>
                        </div>
                    </div>
                    <button onClick={() => this.props.handlePopup('changePwd', false)} className={'closeBtn'}>
                        <img src={close_btn} alt='닫기 버튼' width={16} height={16} />
                    </button>
                </header>
                <section>
                    <div className='infoWrap'>
                        <p>비밀번호 변경 시 유의사항</p>
                        <p>비밀번호는 5~10자 이내로 입력</p>
                        <p>영문 대소문자, 숫자, 특수기호 _ , - 만 사용가능</p>
                    </div>
                    <ul>
                        <li>
                            <span>현재 비밀번호</span>
                            <span>
                                <input ref={this.refCurrentPW} type='password' />
                                <button 
                                    type='button'
                                    className='showPwdBtn' 
                                    onClick={() => this.handleShowPwChecked(this.refCurrentPW, 'isShowCurrentPwd')}
                                >
                                    <img src={this.state.isShowCurrentPwd ? pwd_show : pwd_hide} alt='비밀번호 보기 버튼' />
                                </button>
                            </span>
                        </li>
                        <li>
                            <span>새 비밀번호</span>
                            <span>
                                <input ref={this.refNewPW1} type='password' />
                                <button 
                                    type='button'
                                    className='showPwdBtn' 
                                    onClick={() => this.handleShowPwChecked(this.refNewPW1, 'isShowNewPwd1')}
                                >
                                    <img src={this.state.isShowNewPwd1 ? pwd_show : pwd_hide} alt='비밀번호 보기 버튼' />
                                </button>
                            </span>
                        </li>
                        <li>
                            <span>새 비밀번호 확인</span>
                            <span>
                                <input ref={this.refNewPW2} type='password' />
                                <button 
                                    type='button'
                                    className='showPwdBtn' 
                                    onClick={() => this.handleShowPwChecked(this.refNewPW2, 'isShowNewPwd2')}
                                >
                                    <img src={this.state.isShowNewPwd2 ? pwd_show : pwd_hide} alt='비밀번호 보기 버튼' />
                                </button>
                            </span>
                        </li>
                    </ul>
                    <div className='btnWrap'>
                        <button className='cancle' onClick={() => this.props.handlePopup('myPage', true)}>마이페이지로 돌아가기</button>
                        <button className='submit'>변경</button>
                    </div>
                </section>
            </ChangePwdComponent>
            </ModalBackground>
        );
    }
}

export default changePwd;