import React, { Component } from 'react';
import { i18n, withTranslation } from '../../../language/i18n';
import { withRouter } from 'react-router-dom';
import { AccountController } from '../../services/accountController';
import ConfirmDialog from '../../../Common/ui/confirmDialog';
import ProjectResource from '../../../Root/resource/id';
//import SdmsResource from '../resource/id';
import { AccessSSOPopup } from '../../styled/accountPopupsStyled.js';

import LoginPageWonik from '../loginPageWonik';

class AccessWonikSSO extends Component {
    constructor(props) {
        super(props);

        this.state = {
            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: [''],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null
            },
        }

        this.init();
    }

    componentDidMount() {

    }

    async init() {
        let result = false;
        let message = "";

        const urlData = window.location.href;
        const url = new URL(urlData);
        const urlParams = url.searchParams;
        const code = urlParams.get('code');

        if (code) {
            // 사이트 정보 불러오기
            let siteID = ProjectResource.SiteID;

            if (siteID === null || siteID === undefined) {
                siteID = await ProjectResource.loadSiteID();
            }

            [result, message] = await AccountController.checkSSOLogin(code);

            if (result) {
                // 해당 유저정보
                // 세션 저장
                ProjectResource.setLoginUser(result.user);

                // 페이지 이동
                this.props.history.push(ProjectResource.path.dashboard);
            }
            else {
                // 요청 실패 팝업창 발생
                this.showConfirmDialog(i18n.t('common.오류'), [message], [i18n.t('common.확인')], this.onClickRoot);
            }
        }
        else {
            // 코드값이 없음에 에러 팝업창 발생
            this.showConfirmDialog(i18n.t('common.오류'), ["SSOLogin code 값이 올바르지 않습니다."], [i18n.t('common.확인')], this.onClickRoot);
        }       
    }

    onClickRoot = () => {
        this.props.history.push(ProjectResource.path.root);
    }

    onCloseConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        this.setState({ confirmMessage });
    }

    showConfirmDialog = (title, messages, buttons, onClickButton) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.title = title;
        confirmMessage.buttons = buttons;
        confirmMessage.onClickButton = onClickButton;

        if (!messages) {
            confirmMessage.messages = [""];
        }
        else if (Array.isArray(messages)) {
            confirmMessage.messages = messages;
        }
        else {
            confirmMessage.messages = [messages];
        }

        this.setState({ confirmMessage });
    }

    render() {
        return (
            <React.Fragment>
                <AccessSSOPopup>
                    <div className={'wonik-background'}></div>
                    <div id={'spinner'}></div>
                    <p>로그인 처리 중</p>
                    <div className={'gradient-bg'}></div>
                </AccessSSOPopup>
                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
                }
            </React.Fragment>
        );
    }
}

export default withRouter(withTranslation()(AccessWonikSSO));