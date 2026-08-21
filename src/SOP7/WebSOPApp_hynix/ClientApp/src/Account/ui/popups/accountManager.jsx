import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';

import uis from '../../../Common/css/ui.module.css';
import contents from '../../../Common/css/content.module.css';
import uneCommon from '../../../Common/css/uneCommon.module.css';
import accounts from '../../css/account.module.css';

import imgClose from '../../../Common/image/icon/popup_close_x.png';
import imgCloseWonik from '../../../Common/img/sub/dashboard_layer_close.png';

import { AccountController } from '../../services/accountController';
import { TeamEditController } from '../../../TeamEditor/services/teamEditController';

import ProjectResource from "../../../Root/resource/id";
import AccountResource from '../../resource/id';

import { AccountManagerPopup } from '../../styled/accountPopupsStyled.js';
import { ModalBackground } from '../../../Root/styled/variables';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';


class AccountManager extends Component {

	constructor(props) {
		super(props);

        this.refName = React.createRef();
        this.refLevel = React.createRef();
        this.refRegular = React.createRef();
        this.refPhoneNum1 = React.createRef();
        this.refPhoneNum2 = React.createRef();
        this.refPhoneNum3 = React.createRef();

		this.state = {
            displayAccountUser: null,
            removeAccountUsers: [],
            mode: i18n.t('account.사용자 권한 관리'),
		}

        this.props = props;
        this.state.displayAccountUser = this.props.accountUsers;
    }

	componentDidUpdate(prevProps, prevState) {
        //console.log('componentDidUpdate');

        if (prevProps.accountUsers !== this.props.accountUsers) {
            this.onClickSearch();
        }
	}

	componentDidMount() {
		//console.log('componentDidMount');
	}

    onClickClosePopup = () => {
        this.props.onClickClosePopup(false);
    }

    onClickRegister = () => {
        if (this.state.mode === i18n.t('account.삭제이력')) {
            // 삭제이력 모드일 경우 재등록 버튼 기능
            let accountUsers = this.state.displayAccountUser;
            let reRegisterUsers = [];
            //let newSelectUsers = [];

            if (accountUsers != null || accountUsers.length !== 0) {
                // 체크된 유저 리스트 만들기
                for (let i = 0; i < accountUsers.length; i++) {
                    let user = accountUsers[i];
                    let userID = user.id;

                    if ($('#' + userID + '_searchCheck').is(":checked") == true) {
                        reRegisterUsers.push(user);
                    }
                }
            }

            if (reRegisterUsers.length === 0)
                return;
            else {
                this.reRegisterAccountUsers(reRegisterUsers);
                return;
            }
                
        }

        this.props.onClickRegister();
    }

    async reRegisterAccountUsers(accountUsers) {
        if (accountUsers === null || accountUsers.length === 0)
            return;

        const [result, message] = await AccountController.reRegisterAccountUsers(accountUsers);

        if (result === null) {
            // 에러 발생
            console.log(message);
            return;
        } else {
            // 재등록 성공
            let removeAccountUsers = this.props.removeAccountUsers;
            let newAccountUsers = [];

            /*
            for (let i = 0; i < removeAccountUsers.length; i++) {
                let removeUser = removeAccountUsers[i];
                let chk = false;

                for (let j = 0; j < accountUsers.length; j++) {
                    let user = accountUsers[j];
                    
                    if (removeUser.id === user.id) {
                        chk = true;
                        break;
                    }
                }

                if (chk === false)
                    newAccountUsers.push(removeUser);
            }
            */


            for (let j = 0; j < accountUsers.length; j++) {
                let user = accountUsers[j];

                for (let i = 0; i < removeAccountUsers.length; i++) {
                    let removeUser = removeAccountUsers[i];

                    if (removeUser.id === user.id) {
                        removeAccountUsers.splice(i, 1);
                        break;
                    }
                }
            }

            // 다시 불러오기
            this.props.onChangeReload();

            // 새로운 삭제인원으로 표시
            //this.state.removeAccountUsers = newAccountUsers;
            this.onClickSearch();
        }
    }

    onChangeSearchAllChk = (e) => {
        let target = e;
        let checked = target.checked;

        $('.searchCheck').prop("checked", checked);
    }

    setRegularComboBax = () => {
        let regularComboBax = [];
        regularComboBax.push(<option key="-1" value="-1">{i18n.t('common.전체')}</option>);

        let regulars = this.props.regulars;

        if (regulars != null) {
            for (let i = 0; i < regulars.length; i++) {
                let regular = regulars[i];

                regularComboBax.push(<option key={regular.id} value={regular.id}>{regular.teamName}</option>);
            }
        }

        return regularComboBax;
    }

    setAccountLevelsComboBax = () => {
        let accountLevelComboBax = [];
        accountLevelComboBax.push(<option key="-1" value="-1">{i18n.t('common.전체')}</option >);

        let accountLevels = this.props.accountLevels;

        if (accountLevels != null) {
            for (let i = 0; i < accountLevels.length; i++) {
                let level = accountLevels[i];

                if (level === null || level === undefined)
                    continue;

                accountLevelComboBax.push(<option key={level.id} value={level.id}>{level.levelName}</option>);
            }
        }

        return accountLevelComboBax;
    }

    setAccountUserTable = () => {
        let accountUserTable = [];
        let accountUserCount = 0;

        let accountUsers = this.state.displayAccountUser;

        if (accountUsers != null) {
            for (let i = 0; i < accountUsers.length; i++) {
                let user = accountUsers[i];
                let regularName = "";
                if (user.regular !== null && user.regular !== undefined) {
                    regularName = user.regular.teamName;
                }

                let accountLevelName = "";
                if (user.accountLevel !== null && user.accountLevel !== undefined) {
                    accountLevelName = user.accountLevel.levelName;
                }

                let siteName = "-";
                if (user.regular?.siteID) {
                    const sites = ProjectResource.sites;
                    for(let i = 0; i < sites?.length; i++) {
                        const site = sites[i];
                        if (site.id === user.regular.siteID) {
                            siteName = site.siteName;
                            break;
                        } 
                    }
                }

                accountUserTable.push(
                    <ul key={user.id}>
                        <li className={"tableCheck"}>
                            <label className={"checkboxCssEtc"}>
                                <input type="checkbox" id={user.id + "_searchCheck"} className="searchCheck" />
                                <span className={"checkmarkEtc"}></span>
                            </label>
                        </li>
                        <li>{siteName}</li>
                        <li>{user.memberID}</li>
                        <li>{user.memberName}</li>
                        <li>{regularName}</li>
                        <li>{accountLevelName}</li>
                        <li>{user.phoneNumber}</li>
                    </ul>
                );

                accountUserCount = accountUserCount + 1;
            }
        }

        return [accountUserCount, accountUserTable];
    }

    onClickSearch = () => {
        const name = this.refName.current.value.toString().trim();
        const level = this.refLevel.current.value.toString().trim();
        const regular = this.refRegular.current.value.toString().trim();
        const phoneNum1 = this.refPhoneNum1.current.value.toString().trim();
        const phoneNum2 = this.refPhoneNum2.current.value.toString().trim();
        const phoneNum3 = this.refPhoneNum3.current.value.toString().trim();

        let accountUsers = [];
        let displayUsers = [];

        if (this.state.mode === i18n.t('account.삭제이력')) {
            accountUsers = this.props.removeAccountUsers;
        } else {
            accountUsers = this.props.accountUsers;
        }

        for (let i = 0; i < accountUsers.length; i++) {
            let user = accountUsers[i];

            if (name !== "" && user.memberName.indexOf(name) === -1)
                continue;

            if (level !== "-1" && (user.accountLevel === null || (user.accountLevel !== null && user.accountLevel.id.toString() !== level)))
                continue;

            if (regular !== "-1" && (user.regular === null || (user.regular !== null && user.regular.id.toString() !== regular)))
                continue;


            if (phoneNum1 !== "-1" && user.phoneNumber.indexOf(phoneNum1) !== 0)
                continue;

            if (phoneNum2 !== "" && user.phoneNumber.indexOf(phoneNum2) === -1)
                continue;

            if (phoneNum3 !== "" && user.phoneNumber.indexOf(phoneNum3) === -1)
                continue;

            displayUsers.push(user);
        }

        this.setState({ displayAccountUser: displayUsers });
    }

    onClickReport = () => {
        // 삭제이력 버튼 감추기
        $('#btnReport').hide();

        // 삭제이력 모드 변경
        //this.setState({ mode: AccountResource.ID.popupMode.report });
        this.state.mode = i18n.t('account.삭제이력');

        // 삭제 인원으로 검색
        this.onClickSearch();
    }

    onClickRemove = () => {
        if (this.state.mode === i18n.t('account.삭제이력')) {
            // 삭제이력 모드일 경우 이전 버튼 기능

            // 삭제이력 버튼 표시
            $('#btnReport').show();

            // 다시 표시
            this.state.mode = i18n.t('account.사용자 권한 관리');
            this.onClickSearch();

            return;
        }

        let accountUsers = this.state.displayAccountUser;
        let removeUsers = [];
        let newSelectUsers = [];

        if (accountUsers != null || accountUsers.length !== 0) {
            // 체크된 유저 리스트 만들기
            for (let i = 0; i < accountUsers.length; i++) {
                let user = accountUsers[i];
                let userID = user.id;

                if (user.accountID === -1)
                    continue;

                if ($('#' + userID + '_searchCheck').is(":checked") == true) {
                    removeUsers.push(user);
                }
            }
        }

        if (removeUsers.length === 0)
            return;
        else 
            this.removeAccountUsers(removeUsers);
    }

    async removeAccountUsers(accountUsers) {
        if (accountUsers === null || accountUsers.length === 0)
            return;

        const [result, message] = await AccountController.removeAccountUsers(accountUsers);

        if (result === null) {
            // 에러 발생
            console.log(message);
            return;
        } else {
            // 삭제 성공
            // 다시 불러오기
            this.props.onChangeReload();

            //this.setState({ removeAccountUsers: accountUsers });
            const removeAccountUsers = this.props.removeAccountUsers;

            for (let i = 0; i < accountUsers.length; i++) {
                const user = accountUsers[i];
                let chk = true;

                for (let j = 0; j < removeAccountUsers.length; j++) {
                    const removeAccount = removeAccountUsers[j];

                    if (removeAccount.id === user.id) {
                        chk = false;
                        break;
                    }
                }

                if (chk) {
                    removeAccountUsers.push(user);
                }
                    
            }

            
        }
    }

    setButtonText = () => {
        let btnRegisterText = i18n.t('account.등록');
        let btnRemoveText = i18n.t('common.삭제');

        if (this.state.mode === i18n.t('account.삭제이력')) {
            btnRegisterText = i18n.t('account.재등록');
            btnRemoveText = i18n.t('account.이전');
        }

        return [btnRegisterText, btnRemoveText];
    }

    render() {
        let regularComboBax = this.setRegularComboBax();
        let accountLevelComboBax = this.setAccountLevelsComboBax();
        let [accountUserCount, accountUserTable] = this.setAccountUserTable();
        let [btnRegisterText, btnRemoveText] = this.setButtonText();

		return (
			<ModalBackground>
                <AccountManagerPopup>

                    <div className={"popupBox"}>
                        <div className='popupboxLine' />
                        <div className={"popupBoxTitle"}>{this.state.mode}</div>
                        <div className={"popupBoxX"}><a onClick={this.onClickClosePopup}><img src={ProjectResource.styleMode === ProjectResource.StyleType.Wonik ? imgCloseWonik : imgClose} alt={i18n.t('common.닫기')} /></a></div>

                        {/* 솔브레인 상단 테이블 */}
                        <div className={"boxTypeBlue marginBottom"}>
                            <table className={"tblNone"}>
                                <caption>{i18n.t('account.게시판 입니다')}</caption>
                                <colgroup>
                                    <col style={{ width: ProjectResource.styleMode === ProjectResource.StyleType.Wonik ? "50px" : "70px" }} />
                                    <col style={{ width: "*" }} />
                                    <col style={{ width: ProjectResource.styleMode === ProjectResource.StyleType.Wonik ? "50px" : "70px" }} />
                                    <col style={{ width: "*" }} />
                                    <col style={{ width: "70px" }} />
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <td>・ {i18n.t('account.이름')}</td>
                                        <td><input ref={this.refName} type="text" className={"blueInput w90p"} placeholder={i18n.t('account.이름을 입력하세요')} /></td>
                                        <td>・ {i18n.t('common.권한')}</td>
                                        <td>
                                            <select ref={this.refLevel} className={"blueSel w100p"}>
                                                {accountLevelComboBax}
                                            </select>
                                        </td>
                                        <td rowSpan="3"><a onClick={this.onClickSearch} className={"searchBlueBtn"}>{i18n.t('account.검색')}</a></td>
                                    </tr>
                                    <tr>
                                        <td>・ {i18n.t('account.부서')}</td>
                                        <td>
                                            <select ref={this.refRegular} className={"blueSel w90p"}>
                                                {regularComboBax}
                                            </select>
                                        </td>
                                        <td>・ {i18n.t('account.연락처')}</td>
                                        <td>
                                            <ul className={"tel3col"}>
                                                <li>
                                                    <select ref={this.refPhoneNum1} className={"blueSel short"}>
                                                        <option value="-1">{i18n.t('account.선택')}</option>
                                                        <option value="010">010</option>
                                                        <option value="011">011</option>
                                                        <option value="016">016</option>
                                                        <option value="017">017</option>
                                                        <option value="018">018</option>
                                                        <option value="019">019</option>
                                                    </select><span>-</span>
                                                </li>
                                                <li>
                                                    <input type="text" ref={this.refPhoneNum2} className={"blueInput w100p"} />
                                                </li>
                                                <li>
                                                    <input type="text" ref={this.refPhoneNum3} className={"blueInput w100p"} />
                                                </li>
                                            </ul>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* 원익 상단 테이블 */}
                        {/*<div className={"boxTypeBlue marginBottom"}>
                            <table className={"tblNone"}>
                                <caption>{AccountResource.ID.textBoard}</caption>
                                <colgroup>
                                    <col style={{ width: ProjectResource.styleMode === ProjectResource.StyleType.Wonik ? "50px" : "70px" }} />
                                    <col style={{ width: "*" }} />
                                    <col style={{ width: ProjectResource.styleMode === ProjectResource.StyleType.Wonik ? "50px" : "70px" }} />
                                    <col style={{ width: "*" }} />
                                    <col style={{ width: "70px" }} />
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <td>캠퍼스</td>
                                        <td colSpan='3'><select className={"blueSel long"}>
                                                <option>전체</option>
                                            </select>
                                        </td>
                                        <td rowSpan="3"><a onClick={this.onClickSearch} className={"searchBlueBtn"}>검색</a></td>
                                    </tr>

                                    <tr>
                                        <td>이름</td>
                                        <td><input ref={this.refName} type="text" className={"blueInput w90p"} placeholder={AccountResource.ID.textPlaceName} /></td>
                                        <td>권한</td>
                                        <td>
                                            <select ref={this.refLevel} className={"blueSel w100p"}>
                                                {accountLevelComboBax}
                                            </select>
                                        </td>

                                    </tr>
                                    <tr>
                                        <td>부서</td>
                                        <td>
                                            <select ref={this.refRegular} className={"blueSel w90p"}>
                                                {regularComboBax}
                                            </select>
                                        </td>
                                        <td>연락처</td>
                                        <td>
                                            <ul className={"tel3col"}>
                                                <li>
                                                    <select ref={this.refPhoneNum1} className={"blueSel short"}>
                                                        <option value="-1">선택</option>
                                                        <option value="010">010</option>
                                                        <option value="011">011</option>
                                                        <option value="016">016</option>
                                                        <option value="017">017</option>
                                                        <option value="018">018</option>
                                                        <option value="019">019</option>
                                                    </select><span>-</span>
                                                </li>
                                                <li>
                                                    <input type="text" ref={this.refPhoneNum2} className={"blueInput w100p"} />
                                                </li>
                                                <li>
                                                    <input type="text" ref={this.refPhoneNum3} className={"blueInput w100p"} />
                                                </li>
                                            </ul>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div> */}

                        <div className='btn-wrap order'>
                            <div>{i18n.t('account.검색결과')} : {i18n.t('account.총')} {accountUserCount}{i18n.t('account.명')}</div>
                            <div>
                                <a onClick={this.onClickReport} id="btnReport" className={"darkNaveBtn"}>{i18n.t('account.삭제이력')}</a>
                                <a onClick={this.onClickRemove} className={"lightNaveBtn"}>{btnRemoveText}</a>
                                <a onClick={this.onClickRegister} className={"lightBlueBtn"}>{btnRegisterText}</a>
                            </div>
                        </div>

                        <div className={"gap20"}></div>

                        <div className={"boxTypeBlue table"}>

                            {/* 솔브레인 하단 테이블 */}
                            <div className={"tableHead"}>
                                <ul>
                                    <li className={"tableCheck"}>
                                        <label className={"checkboxCssEtc"}>
                                            <input type="checkbox" onChange={(e) => this.onChangeSearchAllChk(e.target)} />
                                            <span className={"checkmarkEtc"}></span>
                                        </label>
                                    </li>
                                    <li>{i18n.t('account.ID')}</li>
                                    <li>{i18n.t('account.이름')}</li>
                                    <li>{i18n.t('account.부서')}</li>
                                    <li>{i18n.t('common.권한')}</li>
                                    <li>{i18n.t('account.연락처')}</li>
                                </ul>
                            </div>
                            <div className={'tableScroll'}>
                                <div className={"tablebody"}>
                                    {accountUserTable}
                                </div>
                            </div>

                            {/* 원익 하단 테이블 */}
                            {/*<div className={"tableHead"}>
                                <ul>
                                    <li className={"tableCheck"}>
                                        <label className={"checkboxCssEtc"}>
                                            <input type="checkbox" onChange={(e) => this.onChangeSearchAllChk(e.target)} />
                                            <span className={"checkmarkEtc"}></span>
                                        </label>
                                    </li>
                                    <li>소속</li>
                                    <li>ID</li>
                                    <li>이름</li>
                                    <li>부서</li>
                                    <li>부여권한</li>
                                    <li>연락처</li>
                                </ul>
                            </div>*/}
                            {/*<div className={'tableScroll'}>
                                <div className={"tablebody"}>
                                    {
                                        
                                        Array.from(Array(10), x => 
                                        <ul>
                                            <li className={"tableCheck"}>
                                                <label className={"checkboxCssEtc"}>
                                                    <input type="checkbox" id={"_searchCheck"} className="searchCheck" />
                                                    <span className={"checkmarkEtc"}></span>
                                                </label>
                                            </li>
                                            <li>캠퍼스H</li>
                                            <li>TEST ID_123</li>
                                            <li>홍길동</li>
                                            <li>00관리팀</li>
                                            <li>총괄관리자</li>
                                            <li>010-0000-0000</li>
                                        </ul>
                                        )
                                        {accountUserTable}
                                    }
                                </div>
                            </div>
                            */}
                        </div>
                    </div>
                </AccountManagerPopup>
            </ModalBackground>
        );
    }
}

export default withRouter(AccountManager);