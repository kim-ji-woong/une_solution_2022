import React, { Component } from 'react';
import { MyPageComponent  } from '../styled/myPageStyled';
import { ModalBackground } from '../../Root/styled/theme';
import close_icon from '../../Common/img/imghydrogen/main/close_icon.svg';
import ProjectResource from '../../Root/resource/id';
import { i18n, withTranslation, i18nUtil } from '../../language/i18n';

class MyPage extends Component{
    constructor(props) {
        super(props);

        this.state = {
            user: null,
        }

        this.props = props;
    }

    componentDidMount() {
        this.initUserInfo();
    }

    initUserInfo = () => {
        const accountUsers = this.props.accountUsers;
        const userInfo = ProjectResource.getUserInfo();

        for (let i = 0; i < accountUsers.length; i++) {
            const account = accountUsers[i];

            if (account.accountID === userInfo.id) {
                this.setState({ user: account });
                break;
            }
        }

    }

    onClickCancle = () => {
        this.props.onClickCloseMypage();
    }
    
    onClickChangePassword = () => {
        this.props.onClickChangePassword();
    } 
    
    render(){
        const userInfo = ProjectResource.getUserInfo();
        const user = this.state.user;
    
        let userName = '-';
        let userID = '-';
        let userLevel = '-';

        let team = '-';
        let position = '-';
        let phoneNumber = '-';
        let officePhoneNumber = '-';
        let email = '-';
           
        if (userInfo !== null && userInfo !== undefined) {            
            userName = userInfo.nickName;
            userID = userInfo.userID;
            userLevel = i18nUtil.convertText(userInfo.level);            
        }

        if (user) {
            team = user.regular?.teamName;
            email = (user.email ? user.email : "-");
            position = i18nUtil.convertText(user.jobPosition?.name);
            phoneNumber = (user.phoneNumber ? user.phoneNumber : "-");
            officePhoneNumber = (user.officePhoneNumber ? user.officePhoneNumber : "-");
        }


        let welcomeUI = (<span>Hello, <p>{userName}</p> :-&#41;</span>);
        if (i18n.language === "ko") {
            welcomeUI = (<span><p>{userName}</p>님 안녕하세요 :-&#41;</span>);
        }


        return (
            <>
            <ModalBackground>
                <MyPageComponent>
                    <header>
                        <div>
                                <h2>{i18n.t('account.마이페이지')}</h2>
                            <div>
                                    {welcomeUI}
                            </div>
                        </div>
                        <button onClick={this.onClickCancle} className={'closeBtn'}>
                            <img src={close_icon} alt='닫기 버튼' width={24} height={24} />
                        </button>
                    </header>
                    <section>
                        <ul>
                            <li>
                                    <span>{i18n.t('account.소속 조직')}</span>
                                <span>{team}</span>
                            </li>
                            <li>
                                    <span>{i18n.t('account.이름')}</span>
                                <span>{userName}</span>
                            </li>
                            <li>
                                    <span>{i18n.t('account.직위')}</span>
                                <span>{position}</span>
                            </li>
                            <li>
                                <span>{i18n.t('account.휴대전화번호/myPage')}</span>
                                <span>{phoneNumber}</span>
                            </li>
                            <li>
                                <span>{i18n.t('account.근무처 전화번호/myPage')}</span>
                                <span>{officePhoneNumber}</span>
                            </li>
                            <li>
                                <span>E-mail</span>
                                <span>{email}</span>
                            </li>
                            <li>
                                    <span>{i18n.t('account.ID')}</span>
                                <span>{userID}</span>
                            </li>
                            <li>
                                    <span>{i18n.t('account.권한')}</span>
                                <span>{userLevel}</span>
                            </li>
                        </ul>
                        <button onClick={this.onClickChangePassword}>
                                {i18n.t('account.비밀번호 변경하러 가기')}
                        </button>
                    </section>
                </MyPageComponent>
            </ModalBackground>
            </>
        );
    }
}

export default MyPage;