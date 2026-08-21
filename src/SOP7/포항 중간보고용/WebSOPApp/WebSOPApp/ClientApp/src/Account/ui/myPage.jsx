import React, { Component } from 'react';
import { MyPageComponent  } from '../styled/myPageStyled';
import { ModalBackground } from '../../Root/styled/theme';
import close_btn from '../../Common/images/close_btn.png';

class myPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {
        return (
            <ModalBackground className={"UI_Section"}>
                <MyPageComponent className={"UI_Section"}>
                    <header>
                        <div>
                            <h2>마이페이지</h2>
                            <div>
                                <span>홍길동</span>
                                <span>님 안녕하세요 :-&#41;</span>
                            </div>
                        </div>
                        <button onClick={() => this.props.handlePopup('myPage', false)} className={'closeBtn'}>
                            <img src={close_btn} alt='닫기 버튼' width={16} height={16} />
                        </button>
                    </header>
                    <section>
                        <ul>
                            <li>
                                <span>소속 조직</span>
                                <span>부산산단_안전관리팀</span>
                            </li>
                            <li>
                                <span>이름</span>
                                <span>홍길동</span>
                            </li>
                            <li>
                                <span>직위</span>
                                <span>과장</span>
                            </li>
                            <li>
                                <span>휴대전화번호</span>
                                <span>010-0000-0000</span>
                            </li>
                            <li>
                                <span>근무처 전화번호</span>
                                <span>000-0000-0000</span>
                            </li>
                            <li>
                                <span>E-mail</span>
                                <span>abcd@asdf.co.kr</span>
                            </li>
                            <li>
                                <span>사용자ID</span>
                                <span>SDSDFF12345</span>
                            </li>
                            <li>
                                <span>권한</span>
                                <span>총괄관리자</span>
                            </li>
                        </ul>
                        <button onClick={() => this.props.handlePopup('changePwd', true)}>
                            비밀번호 변경하러 가기
                        </button>
                    </section>
                </MyPageComponent>
            </ModalBackground>
        );
    }
}

export default myPage;