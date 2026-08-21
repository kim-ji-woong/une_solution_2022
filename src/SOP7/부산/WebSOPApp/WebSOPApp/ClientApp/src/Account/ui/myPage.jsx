import React, { Component } from 'react';
import { MyPageComponent  } from '../styled/myPageStyled';
import { ModalBackground } from '../../Root/styled/theme';
import close_btn from '../../Common/images/close_btn.png';
import { AccountController } from '../services/accountController';
import ProjectResource from '../../Root/resource/id';
import { TeamEditController } from '../../TeamEditor/services/teamEditController';


class myPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    componentDidMount() {
    }

    getMyPageAccountUI = () => {
        let accountUsersUl = [];
        const accountUsers = this.props.accountUsers;   
        const userInfo = ProjectResource.getUserInfo(); 

        if (accountUsers != null) {
            for (let i = 0; i < accountUsers.length; i++) {
                let user = accountUsers[i];

                if (userInfo.id === user.id) { 
                    let memberName = "";
                    let officePhoneNumber = "";
                    let userID = "";
                    let level = "";

                    if (user.memberName !== null && user.memberName !== undefined) {
                        memberName = user.memberName;
                    }

                    if (user.officePhoneNumber == null) {
                        officePhoneNumber = '-';
                    }

                    if (user.officePhoneNumber !== null && user.officePhoneNumber !== undefined) {
                        officePhoneNumber = user.officePhoneNumber;
                    } 

                    if (userInfo !== null && userInfo !== undefined) {
                        userID = userInfo.userID;
                        level = userInfo.level;
                    }

                    accountUsersUl.push(
                        <ul key={user.id}>
                            <li>
                                <span>소속 조직</span>
                                <span>{user.regular.teamName}</span>
                            </li>
                            <li>
                                <span>이름</span>
                                <span>{user.memberName}</span>
                            </li>
                            <li>
                                <span>직위</span>
                                <span>{user.jobPosition.name}</span>
                            </li>
                            <li>
                                <span>휴대전화번호</span>
                                <span>{user.phoneNumber}</span>
                            </li>
                            <li>
                                <span>근무처 전화번호</span>
                                <span>{officePhoneNumber}</span>
                            </li>
                            <li>
                                <span>E-mail</span>
                                <span>{user.email}</span>
                            </li>
                            <li>
                                <span>사용자ID</span>
                                <span>{userID}</span>
                            </li>
                            <li>
                                <span>권한</span>
                                <span>{level}</span>
                            </li>
                        </ul>
                    );
                }
            }
        }

        return [accountUsersUl];
    }

    render() {
        const userInfo = ProjectResource.getUserInfo();
        let nickName = "";

        if (userInfo !== null && userInfo !== undefined) {
            nickName = userInfo.nickName;
        }

        const myPageAccountUI = this.getMyPageAccountUI();

        return (
            <ModalBackground className={"UI_Section"}>
                <MyPageComponent className={"UI_Section"}>
                    <header>
                        <div>
                            <h2>마이페이지</h2>
                            <div>
                                <span>{nickName}</span>
                                <span>님 안녕하세요 :-&#41;</span>
                            </div>
                        </div>
                        <button onClick={() => this.props.handlePopup('myPage', false)} className={'closeBtn'}>
                            <img src={close_btn} alt='닫기 버튼' width={16} height={16} />
                        </button>
                    </header>
                    <section>

                        {myPageAccountUI}

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