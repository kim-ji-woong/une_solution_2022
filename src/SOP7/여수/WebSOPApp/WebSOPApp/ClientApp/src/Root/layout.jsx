import React, { Component } from 'react';
import { Container } from 'reactstrap';
import $ from 'jquery';

import './css/layout.css';      // LG 화학 관련 추가 CSS
import uneCommon from '../Common/css/uneCommon.module.css';

import TitleBar from './titleBar';
import uis from '../Common/css/ui.module.css';

import RootResource from './resource/id';
import SDMSResource from '../SDMS/resource/id'

import YeosuLogo from '../Common/image/common/yeosuLogo_W.png';
import { useReducer } from 'react';
import { AccountController } from '../Account/services/accountController';
import ProjectResource from './resource/id';


class Layout extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            user: null,
        }

        this.wsMgr = this.props.wsMgr;
    }

    componentDidMount() {
        const path = window.location.pathname;

        // 경로에 따라 타이틀바 css 변경
        if (path.indexOf(RootResource.path.sdms) === 0) {
           /* $('#layoutContainer').removeClass(uneCommon.paddingTop50); */
        } else if (path.indexOf(RootResource.path.sopSimulator) === 0) {
           /* $('#layoutContainer').addClass(uneCommon.paddingTop50); */
        } else if (path.indexOf(RootResource.path.sopSimulatorYeosu) === 0) {
           /*  $('#layoutContainer').addClass(uneCommon.paddingTop0); */
        } else if (path.indexOf(RootResource.path.teamEditor) === 0) {
           /*  $('#layoutContainer').addClass(uneCommon.paddingTop50); */
        } else if (path.indexOf(RootResource.path.sopManager) === 0) {
            /* $('#layoutContainer').addClass(uneCommon.paddingTop50); */
        } else if (path.indexOf(RootResource.path.dashboard) === 0) {
            /* $('#layoutContainer').addClass(uneCommon.paddingTop50); */
        } else if (path.indexOf(RootResource.path.history) === 0) {
            /* $('#layoutContainer').addClass(uneCommon.paddingTop50); */
        } else if (path.indexOf(RootResource.path.historyYeosu) === 0) {
            $('#logoBack').addClass(uneCommon.backgroundWhite);
        } else if (path.indexOf(RootResource.path.sensorSimulator) === 0) {
            /* $('#layoutContainer').addClass(uneCommon.paddingTop50); */
        } else if (path.indexOf(RootResource.path.reportYeosu) === 0) {
            /* $('#layoutContainer').addClass(uneCommon.paddingTop50); */
        }

        this.checkSession();

    } 

    async checkSession() {

        const user = await ProjectResource.initUserInfo();
        let sessions = null;
        
        if (user !== null && user !== undefined) {
            sessions = await AccountController.checkBrowserID(user.id, user.sessionKey);

        } else {
            return;
        }

    }

    render() {
        return (
            <main id="mainSB" className={uis.appWrap}>
                {/* <div className={uis.logoBack}>
                </div> */}
                {/* <span className={uis.logoArea} style={{ position: 'absolute', left: '0px', top: '0px' }}><img src={YeosuLogo} /></span> */}
                <TitleBar menuEvent={this.props.menuEvent} wsMgr={this.wsMgr} target={this.props.target} style={{ position: 'absolute', right: '0px', top: '0px' }}/>
                <Container id="layoutContainer">
                    {this.props.children}
                </Container>

            </main>
        );
    }
}

export default Layout;